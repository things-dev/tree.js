import { type Data, Tree } from "./tree";
export declare const treeMap: Map<string, unknown>;
export declare const TreeFactory: {
  create<T extends Data, K extends keyof T>({
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
