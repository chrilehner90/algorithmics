"use strict";

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
  }]);

  return Node;
})();

var SuffixTree = (function () {
  function SuffixTree() {
    _classCallCheck(this, SuffixTree);

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

  _createClass(SuffixTree, [{
    key: "findChild",
    value: function findChild(node, start) {
      // find child with correct edge
      var child = undefined;
      for (var index in node.children) {
        var childStartIndex = node.children[index].reference.start;
        if (input[start] === input[childStartIndex]) {
          return node.children[index];
          break;
        }
      }
    }
  }, {
    key: "buildSuffixTree",
    value: function buildSuffixTree(input) {
      this.input = input;

      var activeNode = this.rootNode;
      for (var i = 1; i < input.length; i++) {
        // construct T^i from T^i-1
        var result = this.update(activeNode, { start: this.start, end: this.start - 1 }, i);
        //start = result.start;
        //activeNode = result.activeNode;
      }
    }
  }, {
    key: "update",
    value: function update(activeNode, reference, index) {
      var start = reference.start;
      var end = reference.end;

      var lastInsertedNode = this.rootNode;
      var canonizedNode = undefined;
      var newStart = 0;

      var _canonize = this.canonize(activeNode, { start: start, end: end });

      canonizedNode = _canonize.activeNode;
      newStart = _canonize.start;

      // TODO: add text indices to references in Node class
      var resultTestAndSplit = this.testAndSplit(canonizedNode, { start: start, end: end }, this.input[index]);
    }
  }, {
    key: "canonize",
    value: function canonize(activeNode, reference) {
      var start = reference.start;
      var end = reference.end;

      while (end - start + 1 > 0) {
        var child = findChild(activeNode, start);
        // check for minimal reference or if child is a leaf
        var edgeLength = child.reference.end - child.reference.start;
        if (edgeLength > activeNode.reference.end - activeNode.reference.start || child.isLeaf()) {
          break;
        }
        activeNode = child;
        start += edgeLength;
      }
      return { activeNode: activeNode, start: start };
    }
  }, {
    key: "testAndSplit",
    value: function testAndSplit(canonizedNode, reference, character) {
      var start = reference.start;
      var end = reference.end;

      if (start > end) {
        // explicit reference
        for (var index in canonizedNode.children) {
          if (character === this.input[canonizedNode.children[index].reference.start]) {
            return { done: true, testAndSplitNode: canonizedNode };
          }
        }
        return { done: false, testAndSplitNode: canonizedNode };
      } else {
        // implicit reference
        var child = findChild(canonizedNode, start);
        if (character === this.input[child.reference.end + 1]) {
          return { done: true, testAndSplitNode: canonizedNode };
        } else {
          var newParent = new Node("", start, end);
          var newChild = new Node(end + 1, child.reference.end);
          canonizedNode.addChild(newParent);
          newParent.addChild(newChild);
          return { done: false, testAndSplitNode: newParent };
        }
      }
    }
  }, {
    key: "input",
    set: function set(text) {
      this.text = text;
    },
    get: function get() {
      return this.text;
    }
  }]);

  return SuffixTree;
})();

module.exports = SuffixTree;

//# sourceMappingURL=suffixTree-compiled.js.map