class Node {
  constructor(start, end, textIndex) {

    this.children = []; // array of references to the text

    // reference inside the text
    this.reference = {
      start: start,
      end: end,
      textIndex: textIndex
    };
    this.suffixLink = undefined;
  }

  isLeaf() {
    if(this.children.length === 0) return true
  }
}

class SuffixTree {
  constructor() {
    this.start = 2;

    // collect all inputs
    this.inputs = [];

    this.virtualRoot = new Node();
    this.rootNode = new Node(this.start, 1);

    // virtualRoot --> root --> virtualRoot
    this.virtualRoot.children.push(this.root);
    this.rootNode.suffixLink = this.virtualRoot;

  }

  buildSuffixTree(input) {

    let activeNode = this.rootNode;
    for(let i = 2; i < input.length; i++) {
      // construct T^i from T^i-1
      let result = this.update(activeNode, input, i);
      //start = result.start;
      //activeNode = result.activeNode;
    }
  }

  update(activeNode, input, index) {
    let lastInsertedNode = this.rootNode;
    let canonizedNode = this.canonize(activeNode, input);
    // TODO: implement testAndSplit function
    // TODO: add text indices to references in Node class
    //var resultTestAndSplit = this.testAndSplit(canonizedNode, input, );
  }

  canonize(activeNode, input) {
    while(activeNode.reference.end - activeNode.reference.start + 1 > 0) {
      let child = undefined;

      // find child with correct edge
      for(var index in activeNode.children) {
        let childStartIndex = activeNode.children[index].reference.start;
        if(input[activeNode.reference.start] === input[childStartIndex]) {
          child = activeNode.children[index];
          break;
        }
      }

      // check for minimal reference or if child is a leaf
      if(child.reference.end - child.reference.start > activeNode.reference.end - activeNode.reference.start || child.isLeaf()) {
        break;
      }
      activeNode = child;
      activeNode.reference.start += 1;
    }
    return activeNode;
  }

  testAndSplit() {

  }
}

module.exports = SuffixTree;