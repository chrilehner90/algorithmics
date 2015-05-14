var fs = require('fs');
var Q = require('q');

var UTILS = require('./utils.js');

var fulltextFile = 'first_quarter_of_chromosome1.fa';
var searchtextFile = 'parkinson_gene.fa';

// create a readFile function that returns a promise
var readFile = Q.denodeify(fs.readFile);
var writeFile = Q.denodeify(fs.writeFile);

var fullTextPromise = readFile(fulltextFile);
var searchTextPromise = readFile(searchtextFile);


var naiveApproach = function(fullText, searchText) {
  var maxIterations = fullText.length - searchText.length;
  var i = 0,
      j = 0,
      count = 0;

  while(i <= maxIterations) {
    while(fullText[i + j] == searchText[j]) {
      j++;
      if(j == searchText.length) count++;
    }
    i++;
    j = 0;
  }
  return count;
}


var KMP = function(fullText, searchText) {
  var maxIterations = fullText.length - searchText.length;
  var border = computeBorders(searchText);
  var i = 0,
      j = 0,
      count = 0;
  while(i < maxIterations) {
    while(fullText[i + j] == searchText[j]) {
      j++;
      if(j == searchText.length) count++;
    }
    i = i + (j - border[j]);
    j = Math.max(0, border[j]);
  }

  return count;
}

var computeBorders = function(searchText) {
  var border = [];
  border[0] = -1;
  border[1] =  0;

  var i = border[1];
  for(var j = 2; j <= searchText.length; j++) {
    while(i >= 0 && searchText[i] != searchText[j - 1]) {
      i = border[i];
    }
    i++;
    border[j] = i;
  }

  return border;
}

var measure = function(algorithm, prefixLenghts, fullText, searchText, message, repetitions) {
  var prefixLengths = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  var results = [];
  var result = 0;
  var averageTimes = [];

  console.log("\nExecuting " + message + " " + repetitions + " times. Hold on...");

  for(var i in prefixLengths) {
    var times = [];
    for(var j = 0; j < repetitions; j++) {
      prefixLength = prefixLengths[i];
      // high resolution time measurement
      var start = process.hrtime();
      result = algorithm(fullText, searchText.substr(0, prefixLength));
      var diff = process.hrtime(start);
      times.push(diff[0] * 1e9 + diff[1]);
    }
    results.push(result);
    averageTimes.push(Math.floor(UTILS.average(times)));
  }

  return {
    results: results,
    avgTimes: averageTimes
  }
}

var exportFile = function(prefixLenghts, naive, kmp) {
  var output = "";
  for(var i in prefixLenghts) {
    output += prefixLenghts[i] + "\t" + naive.results[i] + " \t" + naive.avgTimes[i] + "\t" + kmp.avgTimes[i] + "\n";
  }
  
  var writing = writeFile('data.dat', new Buffer(output));
  writing.done(function() {
    console.log("Results written to data.dat file!");
  })

}


Q.all([fullTextPromise, searchTextPromise]).done(function(data) {
  var fullText = data[0].toString();
  var searchText = data[1].toString();
  var prefixLengths = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  var repetitions = process.argv[2] || 5;

  var naive = measure(naiveApproach, prefixLengths, fullText, searchText, "naive approach", repetitions);
  var kmp = measure(KMP, prefixLengths, fullText, searchText, "kmp algorithm" , repetitions);

  console.log("naive");
  console.log(naive);
  
  console.log("kmp");
  console.log(kmp);

  exportFile(prefixLengths, naive, kmp);
});