"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = (function () {
  function Node(name, start, end, textIndex) {
    _classCallCheck(this, Node);

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

  _createClass(Node, [{
    key: "addChild",
    value: function addChild(node) {
      this.children.push(node);
    }
  }, {
    key: "isLeaf",
    value: function isLeaf() {
      return this.children.length === 0;
    }
  }, {
    key: "link",
    set: function set(node) {
      this.suffixLink = node;
    },
    get: function get() {
      return this.suffixLink;
    }
  }, {
    key: "nodeName",
    get: function get() {
      return this.name;
    }
  }]);

  return Node;
})();

var SuffixTree = (function () {
  function SuffixTree() {
    _classCallCheck(this, SuffixTree);

    this.start = 0;
    this.nodeCounter = 2;

    // collect all inputs
    this.inputs = [];

    this.virtualRoot = new Node("virtualRoot", 0, 0);
    this.rootNode = new Node("root", 0, 0);

    // virtualRoot --> root --> virtualRoot
    this.virtualRoot.addChild(this.rootNode);
    this.rootNode.link = this.virtualRoot;

    this.text = "";
  }

  _createClass(SuffixTree, [{
    key: "findChild",
    value: function findChild(node, start) {
      // find child with correct edge
      if (node === this.virtualRoot) return this.rootNode;
      for (var index in node.children) {
        var childStartIndex = node.children[index].reference.start;
        if (this.text[start] === this.text[childStartIndex]) {
          return node.children[index];
          break;
        }
      }
    }
  }, {
    key: "buildSuffixTree",
    value: function buildSuffixTree(input) {
      this.input = input;

      if (input.length < 1) {
        return;
      }

      //let child = new Node(this.input[this.startIndex - 1], this.startIndex - 1, Infinity);
      //this.rootNode.addChild(child);

      var activeNode = this.rootNode;
      var start = undefined;
      for (var i = 0; i < input.length; i++) {
        var _update = this.update(activeNode, this.startIndex, i - 1, i);

        // construct T^i from T^i-1
        // activeNode is the real active node

        var _update2 = _slicedToArray(_update, 2);

        activeNode = _update2[0];
        start = _update2[1];

        this.startIndex = start;
        // now activeNode is the endpoint
      }
      //this.print(this.rootNode, 0);
      console.log(this.rootNode);
    }
  }, {
    key: "update",
    value: function update(activeNode, start, end, index) {
      console.log("UPDATE", start, end, activeNode.nodeName);

      var lastInsertedNode = this.rootNode;

      var _canonize = this.canonize(activeNode, start, end);

      var _canonize2 = _slicedToArray(_canonize, 2);

      activeNode = _canonize2[0];
      start = _canonize2[1];

      // TODO: add text indices to references in Node class

      var _testAndSplit = this.testAndSplit(activeNode, start, end, this.input[index]);

      var _testAndSplit2 = _slicedToArray(_testAndSplit, 2);

      var done = _testAndSplit2[0];
      var newInnerNode = _testAndSplit2[1];

      while (!done) {
        //console.log("DONE:", done);
        var newLeaf = new Node(this.input[index], index, Infinity);
        this.nodeCounter++;
        newInnerNode.addChild(newLeaf);
        if (lastInsertedNode !== this.rootNode) {
          lastInsertedNode.link = newInnerNode;
        }
        lastInsertedNode = newInnerNode;

        var _canonize3 = this.canonize(activeNode.link, start, end);

        var _canonize32 = _slicedToArray(_canonize3, 2);

        activeNode = _canonize32[0];
        start = _canonize32[1];

        var _testAndSplit3 = this.testAndSplit(activeNode, start, end, this.input[index]);

        var _testAndSplit32 = _slicedToArray(_testAndSplit3, 2);

        done = _testAndSplit32[0];
        newInnerNode = _testAndSplit32[1];
      }

      if (lastInsertedNode !== this.rootNode) {
        lastInsertedNode.link = newInnerNode;
      }
      return [activeNode, start];
    }
  }, {
    key: "canonize",
    value: function canonize(activeNode, start, end) {
      console.log("CANONIZE", start, end, activeNode.nodeName);

      while (end - start + 1 > 0) {
        var child = this.findChild(activeNode, start);
        // check for minimal reference or if child is a leaf
        var edgeLength = child.reference.end - child.reference.start + 1;
        console.log("EDGE", edgeLength);
        if (child !== this.rootNode && (edgeLength > end - start || child.isLeaf())) {
          break;
        }
        activeNode = child;
        start += edgeLength;
      }

      return [activeNode, start];
    }
  }, {
    key: "testAndSplit",
    value: function testAndSplit(canonizedNode, start, end, character) {
      console.log("testAndSplit", start, end, canonizedNode.nodeName);
      if (start > end) {
        // explicit reference
        for (var index in canonizedNode.children) {
          if (canonizedNode === this.virtualRoot || character === this.text[canonizedNode.children[index].reference.start]) {
            return [true, canonizedNode];
          }
        }
        return [false, canonizedNode];
      } else {
        // implicit reference
        var child = this.findChild(canonizedNode, start);
        if (character === this.input[child.reference.end + 1]) {
          return [true, canonizedNode];
        } else {
          var newParent = new Node("", start, end);
          var newChild = new Node("", end + 1, child.reference.end);
          canonizedNode.addChild(newParent);
          newParent.addChild(newChild);
          return [false, newParent];
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

  }, {
    key: "input",
    set: function set(text) {
      this.text = text;
    },
    get: function get() {
      return this.text;
    }
  }, {
    key: "startIndex",
    set: function set(start) {
      this.start = start;
    },
    get: function get() {
      return this.start;
    }
  }]);

  return SuffixTree;
})();

module.exports = SuffixTree;

//# sourceMappingURL=suffixTree-compiled.js.map