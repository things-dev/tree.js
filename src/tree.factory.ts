import { type Data, Tree } from "./tree";

/*
 *  Bridge to reference a Tree from a specific Node.
 *  If every node has a tree, the data will be more than necessary.
 */
export const treeMap = new Map<string, unknown>();

export const TreeFactory = {
  create<T extends Data, K extends keyof T>({
    nodes,
    key,
    childKey,
  }: {
    nodes: { level: number; data: T }[];
    key: string;
    childKey: K;
  }) {
    if (typeof childKey !== "string") {
      throw new Error("childKey must be a string");
    }
    // Because a node can have multiple children, omit the childKey that specifies only one.
    const tree = new Tree<Omit<T, K>>({
      nodes,
      key,
      childKey,
    });
    if (!treeMap.has(tree.treeId)) {
      treeMap.set(tree.treeId, tree);
    }
    return tree;
  },
};
