import { Tree } from "./tree";
export const treeMap = new Map();
export const TreeFactory = {
    build({ nodes, key, childKey, }) {
        if (typeof childKey !== "string") {
            throw new Error("childKey must be a string");
        }
        const tree = new Tree({
            nodes,
            key,
            childKey,
        });
        if (!treeMap.has(tree.treeKey)) {
            treeMap.set(tree.treeKey, tree);
        }
        return tree;
    },
};
//# sourceMappingURL=tree.factory.js.map