# Tree.js

Simple Model for manipulating tree structure.

## Installation

```shell
npm install @thingsinc/treejs
```

## Usage

```ts
import { TreeFactory } from "@things/treejs";

const nodes = [
  {
    level: 0,
    data: {
      nodeKey: "root",
      childNodeKey: "node1",
      someProperty: {
        // Set any data you want
      },
    },
  },
  {
    level: 0,
    data: {
      nodeKey: "root",
      childNodeKey: "node2",
      someProperty: {
        // Set any data you want
      },
    },
  },
  {
    level: 1,
    data: {
      nodeKey: "node1",
      childNodeKey: "node3",
      someProperty: {
        // Set any data you want
      },
    },
  },
  {
    level: 1,
    data: {
      nodeKey: "node2",
      childNodeKey: null,
      someProperty: {
        // Set any data you want
      },
    },
  },
  {
    level: 2,
    data: {
      nodeKey: "node3",
      childNodeKey: null,
      someProperty: {
        // Set any data you want
      },
    },
  },
];

const tree = TreeFactory.build({
  nodes,
  key: "nodeKey",
  childKey: "childNodeKey",
});

const num3Node = tree.find((node) => node.data.nodeKey === "node3");
console.log(num3Node);
/* output
  Node {
    level: 2,
    parentKey: "node1",
    children: [],
    data: {
      nodeKey: "node3",
      someProperty: {},
    },
    isRoot: false,
    isLeaf: true,
    hasParent: true,
    hasChildren: false,
    move: [Function: move],
    addChild: [Function: addChild],
    remove: [Function: remove],
    getParentNode: [Function: getParentNode],
    getAncestorNodes: [Function: getAncestorNodes],
    getPath: [Function: getPath],
    getTree: [Function: getTree],
  }
*/
console.log(num3Node.getParentNode());
/* output
  Node {
    level: 1,
    parentKey: "root",
    children: [
      Node {
        level: 2,
        parentKey: "node1",
        children: [],
        data: [Object ...],
        isRoot: false,
        isLeaf: true,
        hasParent: true,
        hasChildren: false,
        move: [Function: move],
        addChild: [Function: addChild],
        remove: [Function: remove],
        getParentNode: [Function: getParentNode],
        getAncestorNodes: [Function: getAncestorNodes],
        getPath: [Function: getPath],
        getTree: [Function: getTree],
      }
    ],
    data: {
      nodeKey: "node1",
      someProperty: {},
    },
    isRoot: false,
    isLeaf: false,
    hasParent: true,
    hasChildren: true,
    move: [Function: move],
    addChild: [Function: addChild],
    remove: [Function: remove],
    getParentNode: [Function: getParentNode],
    getAncestorNodes: [Function: getAncestorNodes],
    getPath: [Function: getPath],
    getTree: [Function: getTree],
  }
*/

console.log(num3Node.getPath("nodeKey"));
/* output
  root/node1
*/

console.log(
  num3Node.addChild({
    data: { nodeKey: "node4", someProperty: {} },
  }),
);
/* output
  Node {
    level: 3,
    parentKey: "node3",
    children: [],
    data: {
      nodeKey: "node4",
      someProperty: {},
    },
    isRoot: false,
    isLeaf: true,
    hasParent: true,
    hasChildren: false,
    move: [Function: move],
    addChild: [Function: addChild],
    remove: [Function: remove],
    getParentNode: [Function: getParentNode],
    getAncestorNodes: [Function: getAncestorNodes],
    getPath: [Function: getPath],
    getTree: [Function: getTree],
  }
*/
```

## Contribution

### Setup

1. Install [bun.sh](https://bun.sh/). This repository supports the use of asdf. (.tool-versions)
2. `$ bun install`

### Test

```shell
bun run test
```

### Release

```shell
bun run release
```

## License

MIT License
