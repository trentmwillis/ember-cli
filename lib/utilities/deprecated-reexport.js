'use strict';

var fs = require('fs-extra');
var path = require('path');
var template = fs.readFileSync(path.join(__dirname, 'reexport-template.js'), 'utf-8');

function DeprecatedReexporter(inputTree, options) {
  this.inputTree = inputTree;
  this.name = options.name;
  this.outputFile = options.outputFile;
}

DeprecatedReexporter.prototype.rebuild = function() {
  var hasReexport = fs.existsSync(path.join(this.inputPath, this.name, 'index.js'));

  if (hasReexport) {
    fs.outputFileSync(path.join(this.outputPath, this.name, this.outputFile), this.content());
  }

  return this.outputPath;
};

DeprecatedReexporter.prototype.content = function() {
  return template
    .replace(/\s*\/\*.*\*\/\s*/, '')
    .replace('{{DEST}}', this.name)
    .replace('{{SRC}}', this.name + '/index');
};

module.exports = function(inputTree, options) {
  return new DeprecatedReexporter(inputTree, options);
};