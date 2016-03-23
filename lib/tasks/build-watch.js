'use strict';

var chalk    = require('chalk');
var Task     = require('../models/task');
var Watcher  = require('../models/watcher');
var MultiBuilder  = require('../models/multi-builder');
var Promise  = require('../ext/promise');

module.exports = Task.extend({
  run: function(options) {
    this.ui.startProgress(
      chalk.green('Building'), chalk.green('.')
    );

    return new Watcher({
      ui: this.ui,
      builder: new MultiBuilder({
        ui: this.ui,
        cli: this.cli,
        outputPath: options.outputPath,
        environment: options.environment,
        projectPaths: options.projects.split(','),
        project: this.project
      }),
      analytics: this.analytics,
      options: options
    }).then(function() {
      return new Promise(function () {}); // Run until failure or signal to exit
    });
  }
});
