'use strict';

var rimraf = require('rimraf').sync;
var quickTemp = require('quick-temp');
var fs = require('fs');
var path = require('path');
var template = fs.readFileSync(path.join(__dirname, 'reexport-template.js'), 'utf-8');

function DeprecatedReexporter(inputTree, options) {
  this.inputTree = inputTree;
  this.name = options.name;
  this.outputFile = options.outputFile;
}

DeprecatedReexporter.prototype.read = function() {
  var dir = quickTemp.makeOrReuse(this, 'tmpCacheDir');

  if (!this.subdirCreated) {
    fs.mkdirSync(path.join(dir, this.name));
    this.subdirCreated = true;
  }

  fs.writeFileSync(path.join(dir, this.name, this.outputFile), this.content());

  return dir;
};

DeprecatedReexporter.prototype.content = function() {
  return template
    .replace(/\s*\/\*.*\*\/\s*/, '')
    .replace('{{DEST}}', this.name)
    .replace('{{SRC}}', this.name + '/index');
};

DeprecatedReexporter.prototype.cleanup = function() {
  return rimraf(this.tmpCacheDir);
};

module.exports = function(inputTree, options) {
  return new DeprecatedReexporter(inputTree, options);
};