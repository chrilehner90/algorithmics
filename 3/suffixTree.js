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
    let start = undefined;
    for(let i = 1; i < input.length; i++) {
      // construct T^i from T^i-1
      // activeNode is the real active node
      ( [ activeNode, this.start ] = this.update(activeNode,  { start: this.start, end: this.start - 1 }, i) );
      // now activeNode is the endpoint
    }
  }

  update(activeNode, reference, index) {
    let { start, end } = reference;
    let lastInsertedNode = this.rootNode;
    let canonizedNode = undefined;
    ( [ canonizedNode, start ] = this.canonize(activeNode, start, end) );

    // TODO: add text indices to references in Node class
    let [ done, newInnerNode ] = this.testAndSplit(canonizedNode, start, end, this.input[index]);
    while(!done) {
      //console.log("DONE:", done);
      let newLeaf = new Node("", index, Infinity);
      newInnerNode.addChild(newLeaf);
      if(lastInsertedNode !== this.rootNode) {
        lastInsertedNode.link = newInnerNode;
      }
      lastInsertedNode = newInnerNode;
      ( [ canonizedNode, start ] = this.canonize(activeNode.link, start, end) );
      console.log("CANONIZED NODE", canonizedNode);
      ( [ done, newInnerNode ] = this.testAndSplit(canonizedNode, start, end , this.input[index]) );
    }

    if(lastInsertedNode !== this.rootNode) {
      lastInsertedNode.link = newInnerNode;
    }
    return [ activeNode, start ];
  }

  canonize(activeNode, start, end) {

    if(start > end && activeNode === undefined) {
      activeNode = this.virtualRoot;
      return { activeNode, start };
    }

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

    return [ activeNode, start ];
  }

  testAndSplit(canonizedNode, start, end, character) {
    if(start > end) {
      // explicit reference
      for(var index in canonizedNode.children) {
        console.log("EXPLICIT");
        if(character === this.text[canonizedNode.children[index].reference.start]) {
          console.log("TRUE");
          return [ true, canonizedNode ];
        }
      }
      return [ false, canonizedNode ];
    }
    else {
      // implicit reference
      console.log("IMPLICIT");
      let child = findChild(canonizedNode, start);
      if(character === this.input[child.reference.end + 1]) {
        return [ true, canonizedNode ];
      }
      else {
        let newParent = new Node("", start, end);
        let newChild = new Node(end + 1, child.reference.end);
        canonizedNode.addChild(newParent);
        newParent.addChild(newChild);
        return [ false, newParent ];
      }
    }
  }
}

module.exports = SuffixTree;