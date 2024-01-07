"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeFactory = exports.treeMap = void 0;
const tree_1 = require("./tree");
exports.treeMap = new Map();
exports.TreeFactory = {
    build({ nodes, key, childKey, }) {
        if (typeof childKey !== "string") {
            throw new Error("childKey must be a string");
        }
        const tree = new tree_1.Tree({
            nodes,
            key,
            childKey,
        });
        if (!exports.treeMap.has(tree.treeId)) {
            exports.treeMap.set(tree.treeId, tree);
        }
        return tree;
    },
};
//# sourceMappingURL=tree.factory.js.map