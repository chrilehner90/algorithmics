"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = function Node(start, end) {
  _classCallCheck(this, Node);

  this.start = start || undefined;
  this.end = end || undefined;

  this.children = []; // array of references to the text

  // reference inside the text
  this.reference = {
    start: this.start,
    end: this.end
  };
  this.suffixLink = undefined;
};

var SuffixTree = (function () {
  function SuffixTree() {
    _classCallCheck(this, SuffixTree);

    this.start = 2;
    this.i = 2;

    this.virtualRoot = new Node();
    this.root = new Node(this.start, 2);

    // virtualRoot --> root --> virtualRoot
    virtualRoot.children.push(root);
    root.suffixLink = virtualRoot;
  }

  _createClass(SuffixTree, [{
    key: "buildSuffixTree",
    value: function buildSuffixTree(input) {
      var activeNode = root;
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
      var lastInsertedNode = root;
      var canonizedNode = this.canonize(activeNode, input);
      //var resultTestAndSplit = this.testAndSplit(canonizedNode, input, );
      console.log(index);
    }
  }], [{
    key: "canonize",
    value: function canonize(activeNode, input) {}
  }, {
    key: "testAndSplit",
    value: function testAndSplit() {}
  }]);

  return SuffixTree;
})();

//var Node = function(start, end) {
//  var start = start || undefined;
//  var end = end || undefined;
//
//  var children = []; // array of references to the text
//
//  // reference inside the text
//  var reference = {
//    start: start,
//    end: end
//  };
//  var suffixLink = undefined;
//
//  return {
//    children: children,
//    reference: reference,
//    suffixLink: suffixLink
//  }
//}

//var SuffixTree = function() {
//
//  var start = 2;
//  var i = 2;
//
//  var virtualRoot = new Node();
//  var root = new Node(start, i - 1);
//
//  // virtualRoot --> root --> virtualRoot
//  virtualRoot.children.push(root);
//  root.suffixLink = virtualRoot;
//
//  var activeNode = root;
//
//  var buildSuffixTree = function(input) {
//    for(; i < input.length; i++) {
//      // construct T^i from T^i-1
//      var result = update(activeNode, input, i);
//      //start = result.start;
//      //activeNode = result.activeNode;
//    }
//  }
//
//  var update = function(activeNode, input, index) {
//    var lastInsertedNode = root;
//    var canonizedNode = canonize(activeNode);
//    //var resultTestAndSplit = testAndSplit(canonizedNode, input, );
//    console.log(index);
//  }
//
//  var canonize = function() {
//
//  }
//
//  var testAndSplit = function() {
//
//  }
//
//  return {
//    buildSuffixTree: buildSuffixTree
//  };
//}

module.exports = SuffixTree;

//# sourceMappingURL=suffixTree-compiled.js.map