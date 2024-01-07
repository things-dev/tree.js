import { TreeType } from "./tree";
export declare class Node<T> {
  #private;
  level: number;
  parentKey: string | null;
  children: Node<T>[];
  data: T;
  isRoot: boolean;
  isLeaf: boolean;
  hasParent: boolean;
  hasChildren: boolean;
  constructor({
    treeKey,
    key,
    childKey,
    level,
    parentKey,
    children,
    data,
  }: {
    treeKey: string;
    key: string;
    childKey: string;
    level: number;
    parentKey: string | null;
    children: Node<T>[];
    data?: T;
  });
  move(fn: (node: Node<T>) => boolean): boolean;
  findDescendantNodes(fn: (node: Node<T>) => boolean): Node<T>[];
  findParentNodes(fn: (node: Node<T>) => boolean): Node<T>[];
  addChild({
    data,
  }: {
    data: T;
  }): Node<T>;
  drop(): void;
  getParentNode(): Node<T>;
  getAncestorNodes(): Node<T>[];
  getPath(key: string): string;
  getTree(): TreeType<T>;
}
//# sourceMappingURL=node.d.ts.map
