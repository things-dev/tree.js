import { describe, expect, test } from "bun:test";
import { TreeFactory } from "./tree.factory";

type Nodes = {
  level: number;
  data: {
    nodeKey: string;
    childNodeKey: string;
    someProperty: {
      someKey: number;
    };
  };
}[];

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

describe("Treejs", () => {
  const tree = TreeFactory.build({
    nodes,
    key: "nodeKey",
    childKey: "childNodeKey",
  });

  test("find", () => {
    const node = tree.find((node) => node.level === 3);

    expect(node).not.toBeUndefined();
    expect(node.level).toBe(3);
  });

  test("find (return undefined)", () => {
    const node = tree.find((node) => node.level === 10000);

    expect(node).toBeUndefined();
  });

  test("findOrThrow", () => {
    const node = tree.find((node) => node.level === 3);

    expect(node).not.toBeUndefined();
    expect(node.level).toBe(3);
  });

  test("findOrThrow (throw Error)", () => {
    expect(() => {
      tree.findOrThrow((node) => node.level === 4);
    }).toThrow("Target node not found");
  });

  test("findAll", () => {
    const nodes = tree.findAll((node) => [1, 2, 3].includes(node.level));
    const levels = nodes.map((node) => node.level);

    expect(nodes).not.toBeUndefined();
    expect(nodes.length).toBe(3);
    expect(levels).toContain(1);
    expect(levels).toContain(2);
    expect(levels).toContain(3);
  });

  test("isRoot", () => {
    const node = tree.find((node) => node.level === 0);

    expect(node).not.toBeUndefined();
    expect(node.isRoot).toBe(true);
  });

  test("isLeaf", () => {
    const node = tree.find((node) => node.level === 3);

    expect(node).not.toBeUndefined();
    expect(node.isLeaf).toBe(true);
  });

  test("hasChildren", () => {
    const node = tree.find((node) => node.level === 0);

    expect(node).not.toBeUndefined();
    expect(node.hasChildren).toBe(true);
  });

  test("hasParent", () => {
    const node = tree.find((node) => node.level === 3);

    expect(node).not.toBeUndefined();
    expect(node.hasParent).toBe(true);
  });

  test("addChild", () => {
    const node = tree.find((node) => node.level === 0);
    const childNode = node.addChild({
      data: {
        nodeKey: "child4",
        someProperty: {
          someKey: Math.random(),
        },
      },
    });

    expect(childNode).not.toBeUndefined();
    expect(childNode.level).toBe(1);
  });

  test("remove", () => {
    const node = tree.find((node) => node.level === 0);
    expect(node.children).toHaveLength(2);
    const childNode = node.addChild({
      data: {
        nodeKey: "child4",
        someProperty: {
          someKey: Math.random(),
        },
      },
    });
    expect(node.children).toHaveLength(3);
    childNode.remove();
    expect(node.children).toHaveLength(2);
    expect(childNode).not.toBeUndefined();
    expect(childNode.level).toBe(1);
  });

  test("getAncestorNodes", () => {
    const node = tree.find((node) => node.level === 3);
    const ancestors = node.getAncestorNodes();
    const levels = ancestors.map((node) => node.level);

    expect(ancestors).not.toBeUndefined();
    expect(ancestors.length).toBe(3);
    expect(levels).toContain(0);
    expect(levels).toContain(1);
    expect(levels).toContain(2);
  });

  test("getPath", () => {
    const node = tree.find((node) => node.level === 3);
    const path = node.getPath("nodeKey");

    expect(path).not.toBeUndefined();
    expect(path).toBe("root/child1/child2");
  });
});
