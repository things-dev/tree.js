import { Node } from "./node";

export type NodeParam<T> = { level: number; data: T; children: NodeParam<T>[] };

export class Tree<T> {
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
    const nodeModel = this.buildParams({
      nodes,
      key,
      childKey,
    });

    this.root = this.parse({
      nodeModel,
    });
  }

  find(fn: (node: Node<T>) => boolean) {
    let targetNode: Node<T>;
    this.root.move((node) => {
      if (fn(node)) {
        targetNode = node;
        return false;
      }
    });
    return targetNode;
  }

  findAll(fn: (node: Node<T>) => boolean) {
    const targetNodes: Node<T>[] = [];
    this.root.move((node) => {
      if (fn(node)) {
        targetNodes.push(node);
      }
      return true;
    });
    return targetNodes;
  }

  private parse({ nodeModel }: { nodeModel: NodeParam<T> }) {
    const node = new Node<T>({
      level: nodeModel.level,
      children: nodeModel.children.map((childNodeModel) =>
        this.parse({
          nodeModel: childNodeModel,
        }),
      ),
      data: nodeModel.data,
    });

    return node;
  }

  private buildParams<T>({
    nodes,
    key,
    childKey,
  }: {
    nodes: { level: number; data: T }[];
    key: string;
    childKey: string;
  }) {
    const nodeMap = new Map<string, NodeParam<T>[]>();
    const rootNodeParams = nodes.filter((node) => node.level === 0);
    if (rootNodeParams.length === 0) {
      throw new Error("Level 0 root node not found");
    }
    const nestedNodes: NodeParam<T>[] = [];

    // 特定のkeyを子として持つnodeをnodeMapに格納
    for (const node of nodes) {
      const targetKey = node.data[key];

      if (!nodeMap.has(targetKey)) {
        nodeMap.set(targetKey, []);
      }

      nodeMap.get(targetKey).push({
        ...node,
        children: [],
      });
    }

    for (const node of nodes.sort((a, b) => b.level - a.level)) {
      if (!node.data[childKey]) {
        continue;
      }
      const childNode = nodeMap
        .get(node.data[childKey])
        .find(
          (targetNode) =>
            targetNode.level - 1 === node.level &&
            targetNode.data[key] === node.data[childKey],
        );

      if (childNode.level === 0) {
        nestedNodes.push(this.removeChildKeyFromObj(childNode, childKey));
      } else {
        const parentNode = nodeMap
          .get(node.data[key])
          .find(
            (parentNode) =>
              parentNode.level + 1 === childNode.level &&
              parentNode.data[childKey] === childNode.data[key] &&
              !parentNode.children.includes(childNode),
          );
        if (!parentNode) {
          throw new Error("Parent node not found");
        }
        parentNode.children.push(
          this.removeChildKeyFromObj(childNode, childKey),
        );
        if (parentNode.level === 1) {
          nestedNodes.push(parentNode);
        }
      }
    }

    const rootNodeObj = rootNodeParams.reduce(
      (acc, node) => {
        Object.assign(acc, node);
        return acc;
      },
      {} as NodeParam<T>,
    );
    const rootNode = {
      ...this.removeChildKeyFromObj({ ...rootNodeObj, children: [] }, childKey),
      level: 0,
      children: nestedNodes,
    };
    return rootNode;
  }

  private removeChildKeyFromObj<T>(node: NodeParam<T>, childKey: string) {
    delete node.data[childKey];
    return node;
  }
}
