import { Node } from "./node";
export class Tree {
    treeKey;
    root;
    constructor({ nodes, key, childKey, }) {
        this.treeKey = Date.now().toString() + Math.random().toString();
        const nodeModel = this.#buildParams({
            nodes,
            key,
            childKey,
        });
        this.root = this.#parse({
            key,
            childKey,
            nodeModel,
        });
    }
    find(fn) {
        let targetNode;
        this.root.move((node) => {
            if (fn(node)) {
                targetNode = node;
                return false;
            }
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
    #buildParams({ nodes, key, childKey, }) {
        const nodeMap = new Map();
        const rootNodeParams = nodes
            .filter((node) => node.level === 0)
            .map((node) => ({
            ...node,
            parentKey: null,
            children: [],
        }));
        if (rootNodeParams.length === 0) {
            throw new Error("Level 0 root node not found");
        }
        const nestedNodes = [];
        for (const node of nodes) {
            const targetKey = node.data[key];
            if (!nodeMap.has(targetKey)) {
                nodeMap.set(targetKey, []);
            }
            nodeMap.get(targetKey).push({
                ...node,
                parentKey: null,
                children: [],
            });
        }
        for (const node of nodes.sort((a, b) => b.level - a.level)) {
            const parentNodes = Array(...nodeMap.values()).flat();
            if (!node.data[childKey]) {
                const targetNode = nodeMap
                    .get(node.data[key])
                    .find((targetNode) => targetNode.level === node.level &&
                    targetNode.data[key] === node.data[key]);
                if (!targetNode) {
                    throw new Error(`Target node: ${key} not found`);
                }
                const parentNode = parentNodes.find((parentNode) => parentNode.level === targetNode.level - 1 &&
                    parentNode.data[childKey] === targetNode.data[key]);
                if (parentNode) {
                    targetNode.parentKey = parentNode.data[key];
                }
                continue;
            }
            const childNode = nodeMap
                .get(node.data[childKey])
                .find((targetNode) => targetNode.level - 1 === node.level &&
                targetNode.data[key] === node.data[childKey]);
            if (childNode.level === 0) {
                nestedNodes.push(this.#removeChildKeyFromObj(childNode, childKey));
            }
            else {
                const targetNode = nodeMap
                    .get(node.data[key])
                    .find((targetNode) => targetNode.level + 1 === childNode.level &&
                    targetNode.data[childKey] === childNode.data[key] &&
                    !targetNode.children.includes(childNode));
                if (!targetNode) {
                    throw new Error("Parent node not found");
                }
                targetNode.children.push(this.#removeChildKeyFromObj(childNode, childKey));
                if (targetNode.level === 1) {
                    nestedNodes.push(targetNode);
                }
                const parentNode = parentNodes.find((parentNode) => parentNode.level === targetNode.level - 1 &&
                    parentNode.data[childKey] === targetNode.data[key] &&
                    targetNode.parentKey === null);
                if (parentNode) {
                    targetNode.parentKey = parentNode.data[key];
                }
            }
        }
        const rootNodeObj = rootNodeParams.reduce((acc, node) => {
            Object.assign(acc, node);
            return acc;
        }, {});
        const rootNode = {
            ...this.#removeChildKeyFromObj({ ...rootNodeObj, children: [] }, childKey),
            level: 0,
            children: nestedNodes,
        };
        return rootNode;
    }
    #parse({ key, childKey, nodeModel, }) {
        const node = new Node({
            treeKey: this.treeKey,
            key,
            childKey,
            level: nodeModel.level,
            parentKey: nodeModel.parentKey,
            children: nodeModel.children.map((childNodeModel) => this.#parse({
                key,
                childKey,
                nodeModel: childNodeModel,
            })),
            data: nodeModel.data,
        });
        return node;
    }
    #removeChildKeyFromObj(node, childKey) {
        delete node.data[childKey];
        return node;
    }
}
//# sourceMappingURL=tree.js.map