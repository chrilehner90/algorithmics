'use strict';

require('source-map-support').install(); // use sourcemaps

var fs = require('fs'),
    Q = require('q'),
    SuffixTree = require('./suffixTree-compiled'),
    Utils = require('./utils.js');

var sherlockHolmes1 = 'Books/SherlockHolmes1.txt',
    sherlockHolmes2 = 'Books/SherlockHolmes2.txt',
    sherlockHolmes3 = 'Books/SherlockHolmes3.txt',
    sherlockHolmes4 = 'Books/SherlockHolmes4.txt',
    sherlockHolmes5 = 'Books/SherlockHolmes5.txt';

// create a readFile function that returns a promise
var readFile = Q.denodeify(fs.readFile),
    writeFile = Q.denodeify(fs.writeFile);

var sherlockHolmes1Promise = readFile(sherlockHolmes1),
    sherlockHolmes2Promise = readFile(sherlockHolmes2),
    sherlockHolmes3Promise = readFile(sherlockHolmes3),
    sherlockHolmes4Promise = readFile(sherlockHolmes4),
    sherlockHolmes5Promise = readFile(sherlockHolmes5);

//function exportFile(results) {
//  let output = "";
//  for(let i in prefixLenghts) {
//    output += "test" + "\t" + "test" + "\n";
//  }
//
//  let writingPromise = writeFile('data.dat', new Buffer(output));
//  writingPromise.done(function() {
//    console.log("Results written to data.dat file!");
//  });
//
//}

Q.all([sherlockHolmes1Promise, sherlockHolmes2Promise, sherlockHolmes3Promise, sherlockHolmes4Promise, sherlockHolmes5Promise]).done(function (data) {
    var suffixTree = new SuffixTree();
    suffixTree.buildSuffixTree('ab');
});

//# sourceMappingURL=main-compiled.js.map