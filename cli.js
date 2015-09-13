#!/usr/bin/env node

var cantrip = require("./index.js");
var minimist = require("minimist");

var args = minimist(process.argv.slice(2));

var request = args._;

if (!request.length) request = ["adj", "noun"];

var repeat = args.times || 1;

for (var i = 0; i < repeat; i++) {
  var response = cantrip.generate(request);
  console.log(response.join("-"));
}
