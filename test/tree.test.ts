import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { TreeFactory, type TreeType, treeMap } from "../src";

type Data = {
  nodeKey: string;
  childNodeKey: string | null;
  someProperty: {
    someKey: number;
  };
};

type Node = {
  level: number;
  data: Data;
};
type Nodes = Node[];

describe("Treejs", () => {
  describe("all functios are called successfully", () => {
    const nodes: Nodes = [
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

    let tree: TreeType<Omit<Data, "childNodeKey">>;

    beforeEach(() => {
      tree = TreeFactory.create({
        nodes: structuredClone(nodes),
        key: "nodeKey",
        childKey: "childNodeKey",
      });
    });

    afterEach(() => {
      treeMap.clear();
    });

    test("find", () => {
      const node = tree.find((node) => node.level === 3);

      expect(node).not.toBeUndefined();
      expect(node?.level).toBe(3);
    });

    test("find (return undefined)", () => {
      const node = tree.find((node) => node.level === 10000);

      expect(node).toBeUndefined();
    });

    test("findOrThrow", () => {
      const node = tree.find((node) => node.level === 3);

      expect(node).not.toBeUndefined();
      expect(node?.level).toBe(3);
    });

    test("findOrThrow (throw Error)", () => {
      expect(() => {
        tree.findOrThrow((node) => node.level === 4);
      }).toThrow("Target node not found");
    });

    test("findMany", () => {
      const nodes = tree.findMany((node) => [1, 2, 3].includes(node.level));
      const levels = nodes.map((node) => node.level);

      expect(nodes).not.toBeUndefined();
      expect(nodes.length).toBe(4);
      expect(levels).toContain(1);
      expect(levels).toContain(2);
      expect(levels).toContain(3);
    });

    test("isRoot", () => {
      const node = tree.find((node) => node.level === 0);

      expect(node).not.toBeUndefined();
      expect(node?.isRoot).toBe(true);
    });

    test("isLeaf", () => {
      const node = tree.find((node) => node.level === 3);

      expect(node).not.toBeUndefined();
      expect(node?.isLeaf).toBe(true);
    });

    test("hasChildren", () => {
      const node = tree.find((node) => node.level === 0);

      expect(node).not.toBeUndefined();
      expect(node?.hasChildren).toBe(true);
    });

    test("hasParent", () => {
      const node = tree.find((node) => node.level === 3);

      expect(node).not.toBeUndefined();
      expect(node?.hasParent).toBe(true);
    });

    test("findDescendantNodes", () => {
      const node = tree.find((node) => node.level === 0);
      const descendants = node?.findDescendantNodes((node) => node.level === 3);
      const levels = descendants?.map((node) => node.level);

      expect(descendants).not.toBeUndefined();
      expect(descendants?.length).toBe(1);
      expect(levels).toContain(3);
    });

    test("findParentNodes", () => {
      const node = tree.findOrThrow((node) => node.level === 3);
      const parents = node.findParentNodes((node) => node.level === 1);
      const levels = parents.map((node) => node.level);

      expect(parents).toBeArray();
      expect(parents.length).toBe(1);
      expect(levels).toContain(1);
    });

    test("addChild", () => {
      const node = tree.find((node) => node.level === 0);
      const childNode = node?.addChild({
        data: {
          nodeKey: "child4",
          someProperty: {
            someKey: Math.random(),
          },
        },
      });

      expect(childNode).not.toBeUndefined();
      expect(childNode?.level).toBe(1);
    });

    test("remove", () => {
      const node = tree.find((node) => node.level === 0);
      expect(node?.children).toHaveLength(2);
      const childNode = node?.addChild({
        data: {
          nodeKey: "child4",
          someProperty: {
            someKey: Math.random(),
          },
        },
      });
      expect(node?.children).toHaveLength(3);
      childNode?.drop();
      expect(node?.children).toHaveLength(2);
      expect(childNode).not.toBeUndefined();
      expect(childNode?.level).toBe(1);
    });

    test("getAncestorNodes", () => {
      const node = tree.find((node) => node.level === 3);
      const ancestors = node?.getAncestorNodes();
      const levels = ancestors?.map((node) => node.level);

      expect(ancestors).not.toBeUndefined();
      expect(ancestors?.length).toBe(3);
      expect(levels).toContain(0);
      expect(levels).toContain(1);
      expect(levels).toContain(2);
    });

    test("getPath", () => {
      const node = tree.find((node) => node.level === 3);
      const path = node?.getPath("nodeKey");

      expect(path).not.toBeUndefined();
      expect(path).toBe("root/child1/child2/child3");
    });

    test("Two trees can be generated at the same time", () => {
      const tree2 = TreeFactory.create({
        nodes: structuredClone(nodes),
        key: "nodeKey",
        childKey: "childNodeKey",
      });

      expect(tree).not.toBeUndefined();
      expect(tree2).not.toBeUndefined();
      expect(tree).not.toBe(tree2);

      tree2.find((node) => node.data.nodeKey === "child2")?.drop();
      expect(
        tree2.find((node) => node.data.nodeKey === "child2"),
      ).toBeUndefined();
      expect(
        tree.find((node) => node.data.nodeKey === "child2"),
      ).not.toBeUndefined();
    });

    test("flat", () => {
      const nodes = tree.flat();
      expect(nodes).not.toBeUndefined();
      expect(nodes.length).toEqual(5);
    });
  });

  describe("when there are only level0 and level1 nodes", () => {
    const nodes: Nodes = [
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
        level: 0,
        data: {
          nodeKey: "root",
          childNodeKey: "child2",
          someProperty: {
            someKey: Math.random(),
          },
        },
      },
      {
        level: 0,
        data: {
          nodeKey: "root",
          childNodeKey: "child3",
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
          childNodeKey: null,
          someProperty: {
            someKey: Math.random(),
          },
        },
      },
      {
        level: 1,
        data: {
          nodeKey: "child2",
          childNodeKey: null,
          someProperty: {
            someKey: Math.random(),
          },
        },
      },
      {
        level: 1,
        data: {
          nodeKey: "child3",
          childNodeKey: null,
          someProperty: {
            someKey: Math.random(),
          },
        },
      },
    ];

    let tree: TreeType<Omit<Data, "childNodeKey">>;

    beforeEach(() => {
      tree = TreeFactory.create({
        nodes: structuredClone(nodes),
        key: "nodeKey",
        childKey: "childNodeKey",
      });
    });

    afterEach(() => {
      treeMap.clear();
    });

    test("All nodes must be generated as tree instances", () => {
      const level0Nodes = tree.findMany((node) => node.level === 0);
      const level1Nodes = tree.findMany((node) => node.level === 1);
      expect(level0Nodes).not.toBeUndefined();
      expect(level0Nodes.length).toEqual(1);
      expect(level1Nodes.length).toEqual(4);
    });
  });

  describe("Multiple childNodes are connected to the level1 node.", () => {
    const nodes: Nodes = [
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
        level: 0,
        data: {
          nodeKey: "root",
          childNodeKey: "child2",
          someProperty: {
            someKey: Math.random(),
          },
        },
      },
      {
        level: 1,
        data: {
          nodeKey: "child1",
          childNodeKey: null,
          someProperty: {
            someKey: Math.random(),
          },
        },
      },
      {
        level: 1,
        data: {
          nodeKey: "child2",
          childNodeKey: "grandChild1",
          someProperty: {
            someKey: Math.random(),
          },
        },
      },
      {
        level: 1,
        data: {
          nodeKey: "child2",
          childNodeKey: "grandChild2",
          someProperty: {
            someKey: Math.random(),
          },
        },
      },
      {
        level: 1,
        data: {
          nodeKey: "child2",
          childNodeKey: "grandChild3",
          someProperty: {
            someKey: Math.random(),
          },
        },
      },
      {
        level: 2,
        data: {
          nodeKey: "grandChild1",
          childNodeKey: null,
          someProperty: {
            someKey: Math.random(),
          },
        },
      },
      {
        level: 2,
        data: {
          nodeKey: "grandChild2",
          childNodeKey: null,
          someProperty: {
            someKey: Math.random(),
          },
        },
      },
      {
        level: 2,
        data: {
          nodeKey: "grandChild3",
          childNodeKey: null,
          someProperty: {
            someKey: Math.random(),
          },
        },
      },
    ];

    let tree: TreeType<Omit<Data, "childNodeKey">>;

    beforeEach(() => {
      tree = TreeFactory.create({
        nodes: structuredClone(nodes),
        key: "nodeKey",
        childKey: "childNodeKey",
      });
    });

    afterEach(() => {
      treeMap.clear();
    });

    test("Everything up to the terminal node must be generated.", () => {
      const level0Nodes = tree.findMany((node) => node.level === 0);
      const level1Nodes = tree.findMany((node) => node.level === 1);
      const level2Nodes = tree.findMany((node) => node.level === 2);
      expect(level0Nodes.length).toEqual(1);
      expect(level1Nodes.length).toEqual(2);
      expect(level2Nodes.length).toEqual(3);
    });
  });
});
