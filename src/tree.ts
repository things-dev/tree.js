import { v4 as uuid } from "uuid";

import { Node } from "./node";

export type Data = {
  [key: string]: unknown;
};

export type NodeParam<T extends Data> = {
  level: number;
  data: T;
  parentKey: string | null;
  children: NodeParam<T>[];
};

export type TreeType<T extends Data> = Tree<T>;

export class Tree<T extends Data> {
  treeId: string;
  root: Node<T>;

  constructor({
    nodes,
    key,
    childKey,
  }: {
    nodes: { level: number; data: T }[];
    key: string;
    childKey: string;
  }) {
    this.treeId = uuid();
    const nodeParam = this.#buildParams({
      nodes,
      key,
      childKey,
    });

    this.root = this.#parse({
      key,
      childKey,
      nodeParam,
    });
  }

  find(fn: (node: Node<T>) => boolean): Node<T> | undefined {
    let targetNode: Node<T> | undefined = undefined;
    this.root.move((node) => {
      if (fn(node)) {
        targetNode = node;
        return false;
      }
      return true;
    });
    return targetNode;
  }

  findOrThrow(fn: (node: Node<T>) => boolean): Node<T> {
    const targetNode = this.find(fn);
    if (!targetNode) {
      throw new Error("Target node not found");
    }
    return targetNode;
  }

  findMany(fn: (node: Node<T>) => boolean): Node<T>[] {
    const targetNodes: Node<T>[] = [];
    this.root.move((node) => {
      if (fn(node)) {
        targetNodes.push(node);
      }
      return true;
    });
    return targetNodes;
  }

  flat(): Node<T>[] {
    const nodes: Node<T>[] = [];
    this.root.move((node) => {
      nodes.push(node);
      return true;
    });
    return nodes;
  }

  #buildParams<T extends Data>({
    nodes,
    key,
    childKey,
  }: {
    nodes: { level: number; data: T }[];
    key: string;
    childKey: string;
  }) {
    const nodeParams = nodes.map((node) => ({
      ...node,
      children: [],
    }));
    const nodeMap = new Map<string, NodeParam<T>>();
    const rootNode = nodeParams.find((node) => node.level === 0);
    if (!rootNode) {
      throw new Error("Level 0 root node not found");
    }

    for (const node of nodeParams) {
      nodeMap.set(node.data[key] as string, {
        ...node,
        children: [],
        parentKey: null,
      });
    }

    for (const node of nodeParams) {
      if (node.data[childKey]) {
        const parent = nodeMap.get(node.data[key] as string);
        if (!parent) {
          throw new Error("Parent node not found");
        }

        const child = nodeMap.get(node.data[childKey] as string);

        if (!child) {
          throw new Error("Child node not found");
        }

        parent?.children.push({
          ...child,
          parentKey: parent.data[key] as string,
        });
      }
    }
    const root = nodeMap.get(rootNode?.data[key] as string) as NodeParam<T>;

    for (const node of nodeParams) {
      delete node.data[childKey];
    }
    return root;
  }

  #parse({
    key,
    childKey,
    nodeParam,
  }: {
    key: string;
    childKey: string;
    nodeParam: NodeParam<T>;
  }) {
    const node = new Node<T>({
      treeId: this.treeId,
      key,
      childKey,
      level: nodeParam.level,
      parentKey: nodeParam.parentKey,
      children: nodeParam.children.map((childNodeModel) =>
        this.#parse({
          key,
          childKey,
          nodeParam: childNodeModel,
        }),
      ),
      data: nodeParam.data,
    }) as Node<T>;

    return node;
  }
}
