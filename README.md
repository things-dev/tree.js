# Tree.js

Simple Model for manipulating tree structure.
This works with both browser and server side runtime.

## Installation

```shell
bun install @thingsinc/treejs
```

```shell
pnpm install @thingsinc/treejs
```

```shell
npm install @thingsinc/treejs
```

```shell
yarn add @thingsinc/treejs
```

## Usage

```ts
import { TreeFactory } from "@things/treejs";

// CommonJS
// const { TreeFactory } = require("@thingsinc/treejs")

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
    drop: [Function: drop],
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
        drop: [Function: drop],
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
    drop: [Function: drop],
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
    drop: [Function: drop],
    getParentNode: [Function: getParentNode],
    getAncestorNodes: [Function: getAncestorNodes],
    getPath: [Function: getPath],
    getTree: [Function: getTree],
  }
*/
```

## Features

### Tree

#### `Tree#find`

The `find()` function of Tree instances returns the first Node in the provided tree that satisfies the provided testing function. If no values satisfy the testing function, undefined is returned.

#### `Tree#findOrThrow`

The `findOrThrow()` function of Tree instances returns the first Node in the provided tree that satisfies the provided testing function. If no values satisfy the testing function, Error is returned.

#### `Tree#findMany`

The `findMany()` function of Tree instances returns the all Node in the provided tree that satisfies the provided testing function. If no values satisfy the testing function, empty array is returned.

### Node

#### `Node#move`

The `move()` function of Node instances traverses the subtree that satisfies the provided test function. The action is a function which receives the visited Node as argument. The traversal can be halted by returning false from the action.

#### `Node#findDescendantNodes`

The `findDescendantNodes()` function of Node instances returns the all Node in the subtree that satisfies the provided testing function.

#### `Node#findParentNodes`

The `findParentNodes()` function of Node instances returns the all Node in the parent tree that satisfies the provided testing function.

#### `Node#addChild`

The `addChild()` function of Node instances add the given node as child of this one and return the child node.

#### `Node#drop`

The `drop()` function of Node instances drop the subtree starting at this node.

#### `Node#getParentNode`

The `getParentNode()` function of Node instances return the parent Node.

#### `Node#getAncestorNodes`

The `getAncestorNodes()` function of Node instances returns the all parent Node.

#### `Node#getPath`

The `getPath(key)` function of Node instances returns a list of nodes up to the current node in path format with the given key.

```ts
root: {
 level: 0,
 data: {
   key: 'level0Node'
 },
 children: [
   {
     level: 1,
     data: {
       key: 'level1Node'
     },
     children: [
       {
          level: 2,
          data: {
            key: 'level2Node'
          },
          children: []
       }
     ]
   }
 ]
}

// current node is level2
node.getPath('key') // -> level0Node/level1Node
```

#### `Node#getTree`

The `getTree()` function of Node instances returns Tree instance.
This function for referencing tree instances from each node. Not each node holds a reference to a tree instance.

## Contribution

### Setup

1. Install [bun.sh](https://bun.sh/). This repository supports the use of asdf. (.tool-versions)
2. `$ bun install`

### Test

```shell
bun test
```

### Release

1. `bun run build`
2. `git commit`
3. `bun run release`

## License

MIT License
