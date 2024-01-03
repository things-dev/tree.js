import { Tree, TreeType } from "./tree";

/*
 *  Bridge to reference a Tree from a specific Node.
 *  If every node has a tree, the data will be more than necessary.
 */
export const treeMap = new Map<string, TreeType<unknown>>();

export const TreeFactory = {
  build<T, K extends keyof T>({
    nodes,
    key,
    childKey,
  }: {
    nodes: { level: number; data: T }[];
    key: string;
    childKey: K;
  }) {
    // Because a node can have multiple children, omit the childKey that specifies only one.
    const tree = new Tree<Omit<T, K>>({
      nodes,
      key,
      childKey: childKey as string,
    });
    treeMap.set(tree.treeKey, tree);
    return tree;
  },
};