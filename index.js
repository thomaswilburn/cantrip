#!/usr/bin/env node

//tweaks
var minSynset = 2;
var minPointers = 3;

var fs = require("fs");
var path = require("path");

var args = process.argv;
var config = {
  verbose: args.indexOf("--verbose") > -1
}

var columns = ["lemma", "pos", "synsets", "pointers", "pointerSymbol", null, "tagSense", "synsetOffset"];

var parseIndex = function(index) {
  var lines = [];
  //match only non-comment, non-hyphenated lines
  var matcher = /^([a-zA-Z]+) (\w+) (\w+) (\w+)/gm;
  var match;
  var count = 0;
  while (match = matcher.exec(index)) {
    var line = {
      lemma: match[1],
      pos: match[2],
      synsets: match[3] * 1,
      pointers: match[4] * 1
    };
    //skip obscure words
    if (line.pointers < minPointers || line.synsets < minSynset) continue;
    lines.push(line);
  }
  return lines;
}

var db = {};

var indices = fs.readdirSync(path.join(__dirname, "data")).forEach(function(filename) {
  var pos = filename.split(".").pop();
  if (config.verbose) console.log("reading " + filename);
  var file = fs.readFileSync(path.join(__dirname, "data", filename), "utf8");
  if (config.verbose) console.log("parsing " + filename);
  db[pos] = parseIndex(file);
});

var getWord = function(pos) {
  var index = db[pos];
  var item = index[Math.floor(Math.random() * index.length)];
  if (config.verbose) console.log("Found word", item);
  return item.lemma;
}

var request = [];
args.forEach(function(item) {
  if (item in db) {
    request.push(item);
  }
});

if (!request.length) request = ["adj", "noun"];

var answer = request.map(getWord);

console.log(answer.join("-"));
