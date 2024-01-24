import { randomUUID } from "crypto";

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
    this.treeId = randomUUID();
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

  #buildParams<T extends Data>({
    nodes,
    key,
    childKey,
  }: {
    nodes: { level: number; data: T }[];
    key: string;
    childKey: string;
  }) {
    const nodeMap = new Map<string, NodeParam<T>[]>();
    const rootNodeParams: NodeParam<T>[] = nodes
      .filter((node) => node.level === 0)
      .map((node) => ({
        ...node,
        parentKey: null,
        children: [],
      }));
    if (rootNodeParams.length === 0) {
      throw new Error("Level 0 root node not found");
    }
    const rootNode = rootNodeParams.reduce(
      (acc, node) => {
        if (Object.keys(acc).length === 0) {
          Object.assign(acc, node);
        } else {
          acc.children.push(...node.children);
        }
        return acc;
      },
      {} as NodeParam<T>,
    );

    // Store node with a specific key as a child in nodeMap
    for (const node of nodes) {
      const targetKey = node.data[key] as string;

      if (!nodeMap.has(targetKey)) {
        nodeMap.set(targetKey, []);
      }

      nodeMap.get(targetKey)?.push({
        ...node,
        parentKey: null,
        children: [],
      });
    }

    const parentNodes = Array(...nodeMap.values()).flat();
    for (const node of nodes.sort((a, b) => b.level - a.level)) {
      // validation
      if (!node.data[childKey]) {
        const targetNode = nodeMap
          .get(node.data[key] as string)
          ?.find(
            (targetNode) =>
              targetNode.level === node.level &&
              targetNode.data[key] === node.data[key],
          );
        if (!targetNode) {
          throw new Error(`Target node: ${key} not found`);
        }
        const parentNode = parentNodes.find(
          (parentNode) =>
            parentNode.level === targetNode.level - 1 &&
            parentNode.data[childKey] === targetNode.data[key],
        );
        if (parentNode) {
          targetNode.parentKey = parentNode?.data[key] as string;
        }
        // Skip node whose childKey is null because there is no need to aggregate descendants.
        continue;
      }

      // Aggregation of parent-child relationships
      const childNode = nodeMap
        .get(node.data[childKey] as string)
        ?.find(
          (targetNode) =>
            targetNode.level - 1 === node.level &&
            targetNode.data[key] === node.data[childKey],
        );
      if (!childNode) {
        throw new Error("Child node not found");
      }

      if (childNode.data[childKey] === null) {
        if (childNode.level === 1) {
          childNode.parentKey = rootNode.data[key] as string;
          rootNode.children.push(childNode);
        } else {
          const parentNode = parentNodes.find(
            (parentNode) =>
              parentNode.level === childNode.level - 1 &&
              parentNode.data[childKey] === childNode.data[key],
          );
          childNode.parentKey = parentNode?.data[key] as string;
          parentNode?.children.push(childNode);
        }
      } else {
        if (
          childNode.level === 1 &&
          !rootNode.children.find(
            (child) =>
              childNode.level === child.level &&
              childNode.data[key] === child.data[childKey],
          )
        ) {
          childNode.parentKey = rootNode.data[key] as string;
          rootNode.children.push(childNode);
        } else {
          const targetNode = nodeMap
            .get(node.data[key] as string)
            ?.find(
              (targetNode) =>
                targetNode.level + 1 === childNode.level &&
                targetNode.data[childKey] === childNode.data[key] &&
                !targetNode.children.includes(childNode),
            );
          if (!targetNode) {
            throw new Error("Parent node not found");
          }
          targetNode.children.push(childNode);
          childNode.parentKey = targetNode.data[key] as string;

          const parentNode = parentNodes.find(
            (parentNode) =>
              parentNode.level === targetNode.level - 1 &&
              parentNode.data[childKey] === targetNode.data[key],
          );
          if (parentNode) {
            targetNode.parentKey = parentNode?.data[key] as string;
          }
        }
      }
    }

    for (const node of nodes) {
      delete node.data[childKey];
    }
    return rootNode;
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
