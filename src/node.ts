import { treeMap } from "./tree.factory";

import type { Data, TreeType } from "./tree";

export class Node<T extends Data> {
  level: number; // root is 0
  parentKey: string | null;
  children: Node<T>[];
  data: T;
  isRoot: boolean;
  isLeaf: boolean;
  hasParent: boolean;
  hasChildren: boolean;

  #treeId: string;
  #ancestorPath: string;
  #key: string;
  #childKey: string;

  constructor({
    treeId,
    ancestorPath,
    key,
    childKey,
    level,
    parentKey,
    children,
    data,
  }: {
    treeId: string;
    ancestorPath: string;
    key: string;
    childKey: string;
    level: number;
    parentKey: string | null;
    children: Node<T>[];
    data: T;
  }) {
    this.level = level;
    this.parentKey = parentKey;
    this.children = children;
    this.data = data;
    this.isRoot = !this.parentKey;
    this.isLeaf = this.children.length === 0;
    this.hasParent = !this.isRoot;
    this.hasChildren = !this.isLeaf;

    this.#treeId = treeId;
    this.#ancestorPath = ancestorPath;
    this.#key = key;
    this.#childKey = childKey;
  }

  move(fn: (node: Node<T>) => boolean): boolean {
    const isContinue = !!fn(this);

    for (const child of this.children) {
      const isChildContinue = child.move(fn);
      if (!isChildContinue) {
        return false;
      }
    }
    if (!isContinue) {
      return false;
    }
    return true;
  }

  findDescendantNodes(fn: (node: Node<T>) => boolean): Node<T>[] {
    const results: Node<T>[] = [];
    for (const child of this.children) {
      const isContinue = fn(child);
      if (isContinue) {
        results.push(child);
      }
      const childDescendants = child.findDescendantNodes(fn);
      results.push(...childDescendants);
    }
    return results;
  }

  findParentNodes(fn: (node: Node<T>) => boolean): Node<T>[] {
    const parentNodes: Node<T>[] = [];
    let parentNode = this.getParentNode();
    while (parentNode) {
      const isContinue = fn(parentNode);
      if (isContinue) {
        parentNodes.push(parentNode);
      }
      parentNode = parentNode.getParentNode();
    }
    return parentNodes;
  }

  addChild({ data }: { data: T }): Node<T> {
    const newChildNode = new Node<T>({
      treeId: this.#treeId,
      ancestorPath: `${this.#ancestorPath}/${data[this.#key]}`,
      key: this.#key,
      childKey: this.#childKey,
      level: this.level + 1,
      parentKey: this.data[this.#key] as string,
      children: [],
      data,
    });
    this.children.push(newChildNode);
    return newChildNode;
  }

  drop(): void {
    const parentNode = this.getParentNode();
    if (parentNode) {
      const index = parentNode.children.indexOf(this);
      parentNode.children.splice(index, 1);
    }
  }

  getParentNode(): Node<T> | undefined {
    const tree = this.getTree();
    const parentNode = tree.find(
      (node) =>
        node.data[this.#key] === this.parentKey &&
        this.#ancestorPath.includes(node.#ancestorPath),
    );
    return parentNode;
  }

  getAncestorNodes(): Node<T>[] {
    const ancestors: Node<T>[] = [];
    let ancestor = this.getParentNode();
    while (ancestor) {
      ancestors.unshift(ancestor);
      ancestor = ancestor.getParentNode();
    }
    return ancestors;
  }

  getPath(key: keyof T): string {
    const ancestors = this.getAncestorNodes();
    return `${ancestors.map((ancestor) => ancestor.data[key]).join("/")}/${
      this.data[key]
    }`;
  }

  getTree(): TreeType<T> {
    if (treeMap.size === 0) {
      throw new Error(
        "If you do not create a tree instance via TreeFactory, you cannot reference it from the getTree function of a Node instance. if you do not use TreeFactory, manage references to the tree instance on your own.",
      );
    }
    const tree = treeMap.get(this.#treeId) as TreeType<T>;
    return tree;
  }
}
