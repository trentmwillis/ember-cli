'use strict';

var rimraf = require('rimraf').sync;
var quickTemp = require('quick-temp');
var fs = require('fs');
var path = require('path');
var walkSync = require('walk-sync');
var template = fs.readFileSync(path.join(__dirname, 'reexport-template.js'), 'utf-8');

function DeprecatedReexporter(inputTree, options) {
  this.inputTree = inputTree;
  this.name = options.name;
  this.outputFile = options.outputFile;
}

DeprecatedReexporter.prototype.rebuild = function() {
  var hasReexport = fs.existsSync(this.inputPath + path.sep + this.name + path.sep + 'index.js');

  if (hasReexport) {
    if (!this.subdirCreated) {
      fs.mkdirSync(path.join(this.outputPath, this.name));
      this.subdirCreated = true;
    }

    fs.writeFileSync(path.join(this.outputPath, this.name, this.outputFile), this.content());
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