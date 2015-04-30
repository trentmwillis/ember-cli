'use strict';

var rimraf = require('rimraf').sync;
var chalk = require('chalk');
var quickTemp = require('quick-temp');
var walkSync = require('walk-sync');
var fs = require('fs');
var path = require('path');
var template = fs.readFileSync(path.join(__dirname, 'reexport-template.js'), 'utf-8');

function DeprecatedReexporter(inputTree, options) {
  this.inputTree = inputTree;
  this.name = options.name;
  this.outputFile = options.outputFile;
}

DeprecatedReexporter.prototype.read = function(readTree) {
  var dir = quickTemp.makeOrReuse(this, 'tmpCacheDir');
  var self = this;
  return readTree(this.inputTree).then(function(srcDir) {
    if (!self.verifyAddonStructure(walkSync(srcDir))) {
      if (!self.subdirCreated) {
        fs.mkdirSync(path.join(dir, 'reexports'));
        self.subdirCreated = true;
      }
      fs.writeFileSync(path.join(dir, 'reexports', self.outputFile), self.content());
    }
  }).then(function() {
    return dir;
  });
};

DeprecatedReexporter.prototype.content = function() {
  return template
    .replace(/\s*\/\*.*\*\/\s*/, '')
    .replace('{{DEST}}', this.name)
    .replace('{{SRC}}', this.name + '/index');
};

DeprecatedReexporter.prototype.verifyAddonStructure = function(paths) {
  if (paths.indexOf( this.name + '/index.js') > -1) {
    console.log(chalk.yellow('The addon "' + this.name + '" is using a deprecated addon structure that will be removed in Ember-CLI 1.0.0 beta. Please see the migration guide https://github.com/ember-cli/ember-cli/blob/master/MIGRATION.md'));
    return false;
  }

  return true;
};

DeprecatedReexporter.prototype.cleanup = function() {
  return rimraf(this.tmpCacheDir);
};

module.exports = function(inputTree, options) {
  return new DeprecatedReexporter(inputTree, options);
};