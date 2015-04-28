'use strict';

var broccoli = require('broccoli');
var walkSync = require('walk-sync');
var expect   = require('chai').expect;
var chalk    = require('chalk');
var DeprecatedReexporter = require('../../../lib/utilities/deprecated-reexport');

describe('deprecated-reexport-tree', function() {
  var builder;

  afterEach(function() {
    if (builder) {
      return builder.cleanup();
    }
  });

  it('rebuilds without error', function() {
    var tree = new DeprecatedReexporter('tests/fixtures/addon/component-with-template', {
      name: 'component-with-template',
      outputFile: 'component-with-template.js'
    });

    var log = console.log;
    var messages = [];

    console.log = function(logMsg) {
      messages.push(logMsg);
    };

    builder = new broccoli.Builder(tree);
      return builder.build()
        .then(function() {
          expect(messages.length).to.equal(1);
          expect(messages[0]).to.equal(chalk.yellow('The addon "component-with-template" is using a deprecated addon structure that will be removed in Ember-CLI 1.0.0 beta. Please see the migration guide https://github.com/ember-cli/ember-cli/blob/master/MIGRATION.md'));
          return builder.build();
        })
        .then(function(results) {
          var outputPath = results.directory;

          var expected = [
            'reexports/',
            'reexports/component-with-template.js'
          ];

          console.log = log;
          expect(messages.length).to.eql(2);
          expect(messages[0]).to.eql(messages[1]);
          expect(walkSync(outputPath)).to.eql(expected);
        });
  });

});