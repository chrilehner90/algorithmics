class Node {
  constructor(start, end) {
    this.start = start || undefined;
    this.end = end || undefined;

    this.children = []; // array of references to the text

    // reference inside the text
    this.reference = {
      start: this.start,
      end: this.end
    };
    this.suffixLink = undefined;
  }
}

class SuffixTree {
  constructor() {
    this.start = 2;
    this.i = 2;

    this.virtualRoot = new Node();
    this.root = new Node(this.start, 2);

    // virtualRoot --> root --> virtualRoot
    virtualRoot.children.push(root);
    root.suffixLink = virtualRoot;

  }

  buildSuffixTree(input) {
    let activeNode = root;
    for(let i = 2; i < input.length; i++) {
      // construct T^i from T^i-1
      let result = this.update(activeNode, input, i);
      //start = result.start;
      //activeNode = result.activeNode;
    }
  }

  update(activeNode, input, index) {
    let lastInsertedNode = root;
    let canonizedNode = this.canonize(activeNode, input);
    //var resultTestAndSplit = this.testAndSplit(canonizedNode, input, );
    console.log(index);
  }

  static canonize(activeNode, input) {

  }

  static testAndSplit() {

  }
}

module.exports = SuffixTree;