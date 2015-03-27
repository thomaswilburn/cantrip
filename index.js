#!/usr/bin/env node

var fs = require("fs");

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
    if (data.lemma.indexOf("_") > -1) continue; //skip weird names
    lines.push(data);
  }
  //console.log("loaded " + lines.length + " lines");
  return lines;
}

var db = {};

var indices = fs.readdirSync("./data").forEach(function(filename) {
  var pos = filename.split(".").pop();
  var file = fs.readFileSync("./data/" + filename, "utf8");
  //console.log("parsing " + filename);
  db[pos] = parseIndex(file);
});

var getWord = function(pos) {
  var index = db[pos];
  var item = index[Math.floor(Math.random() * index.length)];
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