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
  index = index.split("\n");
  for (var i = 0; i < index.length; i++) {
    var line = index[i];
    if (line.match(/^  \d/)) continue; //skip commented lines
    line = line.split(" ");
    var data = {};
    columns.forEach(function(key, i) {
      if (!key) return;
      data[key] = line[i];
    });
    if (data.lemma.match(/[-_]/)) continue; //skip weird names
    if (data.pointers * 1 < minPointers || data.synsets * 1 < minSynset) continue; //skip super-obscure words
    lines.push(data);
  }
  if (config.verbose) console.log("loaded " + lines.length + " lines");
  return lines;
}

var db = {};

var indices = fs.readdirSync(path.join(__dirname, "data")).forEach(function(filename) {
  var pos = filename.split(".").pop();
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