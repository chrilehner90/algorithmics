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

  get nodeName() {
    return this.name;
  }

  isLeaf() {
    return this.children.length === 0;
  }
}

class SuffixTree {
  constructor() {
    this.start = 0;
    this.nodeCounter = 2;

    // collect all inputs
    this.inputs = [];

    this.virtualRoot = new Node("virtualRoot");
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

  set startIndex(start) {
    this.start = start;
  }

  get startIndex() {
    return this.start;
  }

  findChild(node, start) {
    // find child with correct edge
    for (var index in node.children) {
      let childStartIndex = node.children[index].reference.start;
      if (this.text[start] === this.text[childStartIndex]) {
        return node.children[index];
        break;
      }
    }
  }

  buildSuffixTree(input) {
    this.input = input;

    if(input.length < 1) {
      return;
    }

    //let child = new Node(this.input[this.startIndex - 1], this.startIndex - 1, Infinity);
    //this.rootNode.addChild(child);

    let activeNode = this.rootNode;
    let start = undefined;
    for(let i = 0; i < input.length; i++) {
      // construct T^i from T^i-1
      // activeNode is the real active node
      ( [ activeNode, start ] = this.update(activeNode,  this.startIndex, i - 1, i) );
      this.startIndex = start;
      // now activeNode is the endpoint
    }
    //this.print(this.rootNode, 0);
    console.log(this.rootNode);
  }

  update(activeNode, start, end, index) {
    console.log("UPDATE", start, end, activeNode.nodeName);

    let lastInsertedNode = this.rootNode;
    ( [ activeNode, start ] = this.canonize(activeNode, start, end) );

    // TODO: add text indices to references in Node class
    let [ done, newInnerNode ] = this.testAndSplit(activeNode, start, end, this.input[index]);
    while(!done) {
      //console.log("DONE:", done);
      let newLeaf = new Node(this.input[index], index, Infinity);
      this.nodeCounter++;
      newInnerNode.addChild(newLeaf);
      if(lastInsertedNode !== this.rootNode) {
        lastInsertedNode.link = newInnerNode;
      }
      lastInsertedNode = newInnerNode;
      ( [ activeNode, start ] = this.canonize(activeNode.link, start, end) );
      ( [ done, newInnerNode ] = this.testAndSplit(activeNode, start, end , this.input[index]) );
    }

    if(lastInsertedNode !== this.rootNode) {
      lastInsertedNode.link = newInnerNode;
    }
    return [ activeNode, start ];
  }

  canonize(activeNode, start, end) {
    //if(start > end && activeNode === undefined) {
    //  activeNode = this.rootNode;
    //  return [ activeNode, start ];
    //}

    if(activeNode === this.virtualRoot) {
      return [ activeNode, start ];
    }

    console.log("CANONIZE", start, end, activeNode.nodeName);

    while(end - start + 1 > 0) {
      let child = this.findChild(activeNode, start);
      // check for minimal reference or if child is a leaf
      let edgeLength = child.reference.end - child.reference.start;
      console.log("EDGE", edgeLength);
      // TODO: edgeLength > end - start?
      if(edgeLength > end - start || child.isLeaf()) {
        break;
      }
      activeNode = child;
      start += edgeLength;
    }

    return [ activeNode, start ];
  }

  testAndSplit(canonizedNode, start, end, character) {
    console.log("testAndSplit", start, end, canonizedNode.nodeName);
    if(start > end) {
      // explicit reference
      for(var index in canonizedNode.children) {
        if(canonizedNode === this.virtualRoot || (character === this.text[canonizedNode.children[index].reference.start])) {
          return [ true, canonizedNode ];
        }
      }
      return [ false, canonizedNode ];
    }
    else {
      // implicit reference
      let child = this.findChild(canonizedNode, start);
      if(character === this.input[child.reference.end + 1]) {
        return [ true, canonizedNode ];
      }
      else {
        let newParent = new Node("", start, end);
        let newChild = new Node("", end + 1, child.reference.end);
        canonizedNode.addChild(newParent);
        newParent.addChild(newChild);
        return [ false, newParent ];
      }
    }
  }

  //print(node, depth) {
  //  console.log("NODE COUNTER", this.nodeCounter);
  //  for(let i = 0; i < this.nodeCounter - 1; i++) {
  //    let child = node.children[i];
  //    if(child !== undefined) {
  //      let output = "";
  //      for(let j = 0; j < depth; j++) {
  //        output += " ";
  //      }
  //      console.log("Parent", node.nodeName);
  //      for(let j = 0; j < depth; j++) {
  //        output += " ";
  //      }
  //      output += "|- Child";
  //      console.log(output, node.nodeName);
  //      this.print(child, depth + 1);
  //    }
  //  }
  //}
}

module.exports = SuffixTree;