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
    #treeKey;
    #key;
    #childKey;
    constructor({ treeKey, key, childKey, level, parentKey, children, data, }) {
        this.level = level;
        this.parentKey = parentKey;
        this.children = children;
        this.data = data;
        this.isRoot = !this.parentKey;
        this.isLeaf = this.children.length === 0;
        this.hasParent = !this.isRoot;
        this.hasChildren = !this.isLeaf;
        this.#treeKey = treeKey;
        this.#key = key;
        this.#childKey = childKey;
    }
    move(fn) {
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
    addChild({ data }) {
        const newChildNode = new Node({
            treeKey: this.#treeKey,
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
    remove() {
        const parentNode = this.getParentNode();
        if (parentNode) {
            const index = parentNode.children.indexOf(this);
            parentNode.children.splice(index, 1);
        }
    }
    getParentNode() {
        const tree = this.getTree();
        const parentNode = tree.find((node) => node.data[this.#key] === this.parentKey);
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
        const tree = treeMap.get(this.#treeKey);
        return tree;
    }
}
//# sourceMappingURL=node.js.map