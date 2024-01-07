"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bun_test_1 = require("bun:test");
const tree_factory_1 = require("./tree.factory");
const nodes = [
    {
        level: 0,
        data: {
            nodeKey: "root",
            childNodeKey: "child0",
            someProperty: {
                someKey: Math.random(),
            },
        },
    },
    {
        level: 0,
        data: {
            nodeKey: "root",
            childNodeKey: "child1",
            someProperty: {
                someKey: Math.random(),
            },
        },
    },
    {
        level: 1,
        data: {
            nodeKey: "child0",
            childNodeKey: null,
            someProperty: {
                someKey: Math.random(),
            },
        },
    },
    {
        level: 1,
        data: {
            nodeKey: "child1",
            childNodeKey: "child2",
            someProperty: {
                someKey: Math.random(),
            },
        },
    },
    {
        level: 2,
        data: {
            nodeKey: "child2",
            childNodeKey: "child3",
            someProperty: {
                someKey: Math.random(),
            },
        },
    },
    {
        level: 3,
        data: {
            nodeKey: "child3",
            childNodeKey: null,
            someProperty: {
                someKey: Math.random(),
            },
        },
    },
];
(0, bun_test_1.describe)("Treejs", () => {
    const tree = tree_factory_1.TreeFactory.build({
        nodes: structuredClone(nodes),
        key: "nodeKey",
        childKey: "childNodeKey",
    });
    (0, bun_test_1.test)("find", () => {
        const node = tree.find((node) => node.level === 3);
        (0, bun_test_1.expect)(node).not.toBeUndefined();
        (0, bun_test_1.expect)(node.level).toBe(3);
    });
    (0, bun_test_1.test)("find (return undefined)", () => {
        const node = tree.find((node) => node.level === 10000);
        (0, bun_test_1.expect)(node).toBeUndefined();
    });
    (0, bun_test_1.test)("findOrThrow", () => {
        const node = tree.find((node) => node.level === 3);
        (0, bun_test_1.expect)(node).not.toBeUndefined();
        (0, bun_test_1.expect)(node.level).toBe(3);
    });
    (0, bun_test_1.test)("findOrThrow (throw Error)", () => {
        (0, bun_test_1.expect)(() => {
            tree.findOrThrow((node) => node.level === 4);
        }).toThrow("Target node not found");
    });
    (0, bun_test_1.test)("findMany", () => {
        const nodes = tree.findMany((node) => [1, 2, 3].includes(node.level));
        const levels = nodes.map((node) => node.level);
        (0, bun_test_1.expect)(nodes).not.toBeUndefined();
        (0, bun_test_1.expect)(nodes.length).toBe(3);
        (0, bun_test_1.expect)(levels).toContain(1);
        (0, bun_test_1.expect)(levels).toContain(2);
        (0, bun_test_1.expect)(levels).toContain(3);
    });
    (0, bun_test_1.test)("isRoot", () => {
        const node = tree.find((node) => node.level === 0);
        (0, bun_test_1.expect)(node).not.toBeUndefined();
        (0, bun_test_1.expect)(node.isRoot).toBe(true);
    });
    (0, bun_test_1.test)("isLeaf", () => {
        const node = tree.find((node) => node.level === 3);
        (0, bun_test_1.expect)(node).not.toBeUndefined();
        (0, bun_test_1.expect)(node.isLeaf).toBe(true);
    });
    (0, bun_test_1.test)("hasChildren", () => {
        const node = tree.find((node) => node.level === 0);
        (0, bun_test_1.expect)(node).not.toBeUndefined();
        (0, bun_test_1.expect)(node.hasChildren).toBe(true);
    });
    (0, bun_test_1.test)("hasParent", () => {
        const node = tree.find((node) => node.level === 3);
        (0, bun_test_1.expect)(node).not.toBeUndefined();
        (0, bun_test_1.expect)(node.hasParent).toBe(true);
    });
    (0, bun_test_1.test)("findDescendantNodes", () => {
        const node = tree.find((node) => node.level === 0);
        const descendants = node.findDescendantNodes((node) => node.level === 3);
        const levels = descendants.map((node) => node.level);
        (0, bun_test_1.expect)(descendants).not.toBeUndefined();
        (0, bun_test_1.expect)(descendants.length).toBe(1);
        (0, bun_test_1.expect)(levels).toContain(3);
    });
    (0, bun_test_1.test)("findParentNodes", () => {
        const node = tree.find((node) => node.level === 3);
        const parents = node.findParentNodes((node) => node.level === 1);
        const levels = parents.map((node) => node.level);
        (0, bun_test_1.expect)(parents).not.toBeUndefined();
        (0, bun_test_1.expect)(parents.length).toBe(1);
        (0, bun_test_1.expect)(levels).toContain(1);
    });
    (0, bun_test_1.test)("addChild", () => {
        const node = tree.find((node) => node.level === 0);
        const childNode = node.addChild({
            data: {
                nodeKey: "child4",
                someProperty: {
                    someKey: Math.random(),
                },
            },
        });
        (0, bun_test_1.expect)(childNode).not.toBeUndefined();
        (0, bun_test_1.expect)(childNode.level).toBe(1);
    });
    (0, bun_test_1.test)("remove", () => {
        const node = tree.find((node) => node.level === 0);
        (0, bun_test_1.expect)(node.children).toHaveLength(2);
        const childNode = node.addChild({
            data: {
                nodeKey: "child4",
                someProperty: {
                    someKey: Math.random(),
                },
            },
        });
        (0, bun_test_1.expect)(node.children).toHaveLength(3);
        childNode.drop();
        (0, bun_test_1.expect)(node.children).toHaveLength(2);
        (0, bun_test_1.expect)(childNode).not.toBeUndefined();
        (0, bun_test_1.expect)(childNode.level).toBe(1);
    });
    (0, bun_test_1.test)("getAncestorNodes", () => {
        const node = tree.find((node) => node.level === 3);
        const ancestors = node.getAncestorNodes();
        const levels = ancestors.map((node) => node.level);
        (0, bun_test_1.expect)(ancestors).not.toBeUndefined();
        (0, bun_test_1.expect)(ancestors.length).toBe(3);
        (0, bun_test_1.expect)(levels).toContain(0);
        (0, bun_test_1.expect)(levels).toContain(1);
        (0, bun_test_1.expect)(levels).toContain(2);
    });
    (0, bun_test_1.test)("getPath", () => {
        const node = tree.find((node) => node.level === 3);
        const path = node.getPath("nodeKey");
        (0, bun_test_1.expect)(path).not.toBeUndefined();
        (0, bun_test_1.expect)(path).toBe("root/child1/child2");
    });
    (0, bun_test_1.test)("Two trees can be generated at the same time", () => {
        const tree2 = tree_factory_1.TreeFactory.build({
            nodes: structuredClone(nodes),
            key: "nodeKey",
            childKey: "childNodeKey",
        });
        (0, bun_test_1.expect)(tree).not.toBeUndefined();
        (0, bun_test_1.expect)(tree2).not.toBeUndefined();
        (0, bun_test_1.expect)(tree).not.toBe(tree2);
        tree2.find((node) => node.data.nodeKey === "child2").drop();
        (0, bun_test_1.expect)(tree2.find((node) => node.data.nodeKey === "child2")).toBeUndefined();
        (0, bun_test_1.expect)(tree.find((node) => node.data.nodeKey === "child2")).not.toBeUndefined();
    });
});
//# sourceMappingURL=tree.test.js.map