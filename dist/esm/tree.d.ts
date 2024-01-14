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
export declare class Tree<T extends Data> {
  #private;
  treeId: string;
  root: Node<T>;
  constructor({
    nodes,
    key,
    childKey,
  }: {
    nodes: {
      level: number;
      data: T;
    }[];
    key: string;
    childKey: string;
  });
  find(fn: (node: Node<T>) => boolean): Node<T> | undefined;
  findOrThrow(fn: (node: Node<T>) => boolean): Node<T>;
  findMany(fn: (node: Node<T>) => boolean): Node<T>[];
}
//# sourceMappingURL=tree.d.ts.map
