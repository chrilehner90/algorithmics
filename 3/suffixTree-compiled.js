"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = (function () {
  function Node(start, end, textIndex) {
    _classCallCheck(this, Node);

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
    key: "isLeaf",
    value: function isLeaf() {
      if (this.children.length === 0) return true;
    }
  }]);

  return Node;
})();

var SuffixTree = (function () {
  function SuffixTree() {
    _classCallCheck(this, SuffixTree);

    this.start = 2;

    // collect all inputs
    this.inputs = [];

    this.virtualRoot = new Node();
    this.rootNode = new Node(this.start, 1);

    // virtualRoot --> root --> virtualRoot
    this.virtualRoot.children.push(this.root);
    this.rootNode.suffixLink = this.virtualRoot;
  }

  _createClass(SuffixTree, [{
    key: "buildSuffixTree",
    value: function buildSuffixTree(input) {

      var activeNode = this.rootNode;
      for (var i = 2; i < input.length; i++) {
        // construct T^i from T^i-1
        var result = this.update(activeNode, input, i);
        //start = result.start;
        //activeNode = result.activeNode;
      }
    }
  }, {
    key: "update",
    value: function update(activeNode, input, index) {
      var lastInsertedNode = this.rootNode;
      var canonizedNode = this.canonize(activeNode, input);
      // TODO: implement testAndSplit function
      // TODO: add text indices to references in Node class
      //var resultTestAndSplit = this.testAndSplit(canonizedNode, input, );
    }
  }, {
    key: "canonize",
    value: function canonize(activeNode, input) {
      while (activeNode.reference.end - activeNode.reference.start + 1 > 0) {
        var child = undefined;

        // find child with correct edge
        for (var index in activeNode.children) {
          var childStartIndex = activeNode.children[index].reference.start;
          if (input[activeNode.reference.start] === input[childStartIndex]) {
            child = activeNode.children[index];
            break;
          }
        }

        // check for minimal reference or if child is a leaf
        if (child.reference.end - child.reference.start > activeNode.reference.end - activeNode.reference.start || child.isLeaf()) {
          break;
        }
        activeNode = child;
        activeNode.reference.start += 1;
      }
      return activeNode;
    }
  }, {
    key: "testAndSplit",
    value: function testAndSplit() {}
  }]);

  return SuffixTree;
})();

module.exports = SuffixTree;

//# sourceMappingURL=suffixTree-compiled.js.map