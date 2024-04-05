import { treeMap } from "./tree.factory";
export class Node {
  level;
  parentKey;
  children;
  data;
  isRoot;
  isLeaf;
  hasParent;
  hasChildren;
  #treeId;
  #ancestorPath;
  #key;
  #childKey;
  constructor({
    treeId,
    ancestorPath,
    key,
    childKey,
    level,
    parentKey,
    children,
    data,
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
  move(fn) {
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
  findDescendantNodes(fn) {
    const results = [];
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
  findParentNodes(fn) {
    const parentNodes = [];
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
  addChild({ data }) {
    const newChildNode = new Node({
      treeId: this.#treeId,
      ancestorPath: this.#ancestorPath,
      key: this.#key,
      childKey: this.#childKey,
      level: this.level + 1,
      parentKey: this.data[this.#key],
      children: [],
      data,
    });
    this.children.push(newChildNode);
    return newChildNode;
  }
  drop() {
    const parentNode = this.getParentNode();
    if (parentNode) {
      const index = parentNode.children.indexOf(this);
      parentNode.children.splice(index, 1);
    }
  }
  getParentNode() {
    const tree = this.getTree();
    const parentNode = tree.find(
      (node) =>
        node.data[this.#key] === this.parentKey &&
        this.#ancestorPath.includes(node.#ancestorPath),
    );
    return parentNode;
  }
  getAncestorNodes() {
    const ancestors = [];
    let ancestor = this.getParentNode();
    while (ancestor) {
      ancestors.unshift(ancestor);
      ancestor = ancestor.getParentNode();
    }
    return ancestors;
  }
  getPath(key) {
    const ancestors = this.getAncestorNodes();
    return ancestors.map((ancestor) => ancestor.data[key]).join("/");
  }
  getTree() {
    if (treeMap.size === 0) {
      throw new Error(
        "If you do not create a tree instance via TreeFactory, you cannot reference it from the getTree function of a Node instance. if you do not use TreeFactory, manage references to the tree instance on your own.",
      );
    }
    const tree = treeMap.get(this.#treeId);
    return tree;
  }
}
//# sourceMappingURL=node.js.map
