'use strict';
var imageServer = require('./lib/image-server');

module.exports = {
  name: 'ember-test-screenshot',
  isDevelopingAddon() {
    return true;
  },

  serverMiddleware: function(startOptions) {
    imageServer.server(startOptions.app, {
      config: this.project.configPath()
    });
  },

  afterInstall() {
    // Add addons to package.json and run defaultBlueprint
    return this.addAddonsToProject({
      // a packages array defines the addons to install
      packages: [
        { name: 'html2canvas' }
      ]
    })
  },

  included: function (app) {
    this._super.included(app);
    app.import('node_modules/html2canvas/dist/html2canvas.min.js');
  }
};
