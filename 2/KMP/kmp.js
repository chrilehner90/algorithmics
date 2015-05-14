var fs = require('fs');
var Q = require('q');

var fulltextFile = 'first_quarter_of_chromosome1.fa';
var searchtextFile = 'parkinson_gene.fa';

// create a readFile function that returns a promise
var readFile = Q.denodeify(fs.readFile);

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

var measure = function(algorithm, fullText, searchText, message) {
  var prefixLengths = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  results = [];
  times = [];

  console.log("\nExecuting " + message + ". Hold on...");
  for(var i in prefixLengths) {
    prefixLength = prefixLengths[i];
    var start = process.hrtime();
    results.push(algorithm(fullText, searchText.substr(0, prefixLength)));
    var diff = process.hrtime(start);
    times.push(diff[0] * 1e9 + diff[1]);
  }

  return {
    results: results,
    times: times
  }
}


Q.all([fullTextPromise, searchTextPromise]).done(function(data) {
  var fullText = data[0].toString();
  var searchText = data[1].toString();

  var naive = measure(naiveApproach, fullText, searchText, "naive approach");
  var kmp = measure(KMP, fullText, searchText, "kmp algorithm");

  console.log("naive");
  console.log(naive);
  
  console.log("kmp");
  console.log(kmp);
});