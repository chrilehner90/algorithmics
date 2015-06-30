class Node {
  constructor(name, start, end, textIndex) {

    this.name = name; // name just for debugging purposes
    this.children = []; // array of references to the text

    // reference inside the text
    this.reference = {
      start: start,
      end: end,
      textIndex: textIndex
    };
    this.suffixLink = undefined;
  }

  addChild(node) {
    this.children.push(node);
  }

  set link(node) {
    this.suffixLink = node;
  }

  get link() {
    return this.suffixLink;
  }

  isLeaf() {
    return this.children.length === 0;
  }
}

class SuffixTree {
  constructor() {
    this.start = 1;

    // collect all inputs
    this.inputs = [];

    this.virtualRoot = new Node("virutalRoot");
    this.rootNode = new Node("root");

    // virtualRoot --> root --> virtualRoot
    this.virtualRoot.addChild(this.rootNode);

    this.rootNode.link = this.virtualRoot;

    this.text = "";
  }

  set input(text) {
    this.text = text;
  }

  get input() {
    return this.text;
  }

  findChild(node, start) {
    // find child with correct edge
    let child = undefined;
    for (var index in node.children) {
      let childStartIndex = node.children[index].reference.start;
      if (input[start] === input[childStartIndex]) {
        return node.children[index];
        break;
      }
    }
  }

  buildSuffixTree(input) {
    this.input = input;

    let activeNode = this.rootNode;
    for(let i = 1; i < input.length; i++) {
      // construct T^i from T^i-1
      let result = this.update(activeNode,  { start: this.start, end: this.start - 1 }, i);
      //start = result.start;
      //activeNode = result.activeNode;
    }
  }

  update(activeNode, reference, index) {
    let { start, end } = reference;
    let lastInsertedNode = this.rootNode;
    let canonizedNode = undefined;
    let newStart = 0;
    ( { activeNode: canonizedNode, start: newStart } = this.canonize(activeNode, { start: start, end: end }) );

    // TODO: add text indices to references in Node class
    var resultTestAndSplit = this.testAndSplit(canonizedNode, { start: start, end: end }, this.input[index]);
  }

  canonize(activeNode, reference) {
    let { start, end } = reference;

    while(end - start + 1 > 0) {
      let child = findChild(activeNode, start);
      // check for minimal reference or if child is a leaf
      let edgeLength = child.reference.end - child.reference.start;
      if(edgeLength > activeNode.reference.end - activeNode.reference.start || child.isLeaf()) {
        break;
      }
      activeNode = child;
      start += edgeLength;
    }
    return { activeNode: activeNode, start: start };
  }

  testAndSplit(canonizedNode, reference, character) {
    let { start, end } = reference;
    if(start > end) {
      // explicit reference
      for(var index in canonizedNode.children) {
        if(character === this.input[canonizedNode.children[index].reference.start]) {
          return { done: true, testAndSplitNode: canonizedNode };
        }
      }
      return { done: false, testAndSplitNode: canonizedNode };
    }
    else {
      // implicit reference
      let child = findChild(canonizedNode, start);
      if(character === this.input[child.reference.end + 1]) {
        return { done: true, testAndSplitNode: canonizedNode };
      }
      else {
        // TODO: split
      }
    }
  }
}

module.exports = SuffixTree;