//tweaks
var minSynset = 2;
var minPointers = 3;

var fs = require("fs");
var path = require("path");


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
  var file = fs.readFileSync(path.join(__dirname, "data", filename), "utf8");
  db[pos] = parseIndex(file);
});

var getWord = function(pos) {
  var index = db[pos];
  var item = index[Math.floor(Math.random() * index.length)];
  return item.lemma;
};

module.exports = {
  generate: function(words, options) {
    return words.filter(function(word) { return word in db }).map(getWord);
  }
};
