export type NodeModel = {
  level: number;
  parent?: NodeModel;
  children: NodeModel[];
};

export class Node<T> {
  level: number; // root: 0
  parent: Node<T> | undefined;
  children: Node<T>[];
  data: T;

  isRoot: boolean;
  isLeaf: boolean;
  hasParent: boolean;
  hasChildren: boolean;

  constructor(model: { level: number; children: Node<T>[]; data?: T }) {
    this.level = model.level;
    this.parent = undefined;
    this.children = model.children;
    this.data = model.data;
    this.isRoot = !this.parent;
    this.isLeaf = this.children.length === 0;
    this.hasParent = !this.isRoot;
    this.hasChildren = !this.isLeaf;
  }

  move(fn: (node: Node<T>) => boolean) {
    const isContinue = !!fn(this);

    for (const child of this.children) {
      const childContinue = child.move(fn);
      if (!childContinue) {
        return false;
      }
    }
    if (!isContinue) {
      return false;
    }
    return true;
  }

  addChild(child: Node<T>) {
    child.parent = this;
    this.children.push(child);
    return child;
  }

  remove() {
    if (this.parent) {
      const index = this.parent.children.indexOf(this);
      this.parent.children.splice(index, 1);
    }
  }

  getAncestorNodes() {
    const ancestors: Node<T>[] = [];
    let ancestor = this.parent;
    while (ancestor) {
      ancestors.unshift(ancestor);
      ancestor = ancestor.parent;
    }
    return ancestors;
  }

  getPath(key: string) {
    const ancestors = this.getAncestorNodes();
    return ancestors.map((ancestor) => ancestor.data[key]).join("/");
  }
}
