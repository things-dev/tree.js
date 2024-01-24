"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = void 0;
const crypto_1 = require("crypto");
const node_1 = require("./node");
class Tree {
    treeId;
    root;
    constructor({ nodes, key, childKey, }) {
        this.treeId = (0, crypto_1.randomUUID)();
        const nodeParam = this.#buildParams({
            nodes,
            key,
            childKey,
        });
        this.root = this.#parse({
            key,
            childKey,
            nodeParam,
        });
    }
    find(fn) {
        let targetNode = undefined;
        this.root.move((node) => {
            if (fn(node)) {
                targetNode = node;
                return false;
            }
            return true;
        });
        return targetNode;
    }
    findOrThrow(fn) {
        const targetNode = this.find(fn);
        if (!targetNode) {
            throw new Error("Target node not found");
        }
        return targetNode;
    }
    findMany(fn) {
        const targetNodes = [];
        this.root.move((node) => {
            if (fn(node)) {
                targetNodes.push(node);
            }
            return true;
        });
        return targetNodes;
    }
    flat() {
        const nodes = [];
        this.root.move((node) => {
            nodes.push(node);
            return true;
        });
        return nodes;
    }
    #buildParams({ nodes, key, childKey, }) {
        const newNodes = nodes.map((node) => ({
            ...node,
            children: [],
        }));
        const nodeMap = new Map();
        const rootNode = newNodes.find((node) => node.level === 0);
        if (!rootNode) {
            throw new Error("Level 0 root node not found");
        }
        for (const node of newNodes) {
            nodeMap.set(node.data[key], {
                ...node,
                children: [],
                parentKey: null,
            });
        }
        for (const node of newNodes) {
            if (node.data[childKey]) {
                const parent = nodeMap.get(node.data[key]);
                if (!parent) {
                    throw new Error("Parent node not found");
                }
                const child = nodeMap.get(node.data[childKey]);
                if (!child) {
                    throw new Error("Child node not found");
                }
                parent?.children.push({
                    ...child,
                    parentKey: parent.data[key],
                });
            }
        }
        const root = nodeMap.get(rootNode?.data[key]);
        for (const node of newNodes) {
            delete node.data[childKey];
        }
        return root;
    }
    #parse({ key, childKey, nodeParam, }) {
        const node = new node_1.Node({
            treeId: this.treeId,
            key,
            childKey,
            level: nodeParam.level,
            parentKey: nodeParam.parentKey,
            children: nodeParam.children.map((childNodeModel) => this.#parse({
                key,
                childKey,
                nodeParam: childNodeModel,
            })),
            data: nodeParam.data,
        });
        return node;
    }
}
exports.Tree = Tree;
//# sourceMappingURL=tree.js.map