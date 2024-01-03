import { Tree, TreeType } from "./tree";
export declare const treeMap: Map<string, TreeType<unknown>>;
export declare const TreeFactory: {
  build<T, K extends keyof T>({
    nodes,
    key,
    childKey,
  }: {
    nodes: {
      level: number;
      data: T;
    }[];
    key: string;
    childKey: K;
  }): Tree<Omit<T, K>>;
};
//# sourceMappingURL=tree.factory.d.ts.map
