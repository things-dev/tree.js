import { Tree } from "./tree";
export const treeMap = new Map();
export const TreeFactory = {
    create({ nodes, key, childKey, }) {
        if (typeof childKey !== "string") {
            throw new Error("childKey must be a string");
        }
        const tree = new Tree({
            nodes,
            key,
            childKey,
        });
        if (!treeMap.has(tree.treeId)) {
            treeMap.set(tree.treeId, tree);
        }
        return tree;
    },
};
//# sourceMappingURL=tree.factory.js.map