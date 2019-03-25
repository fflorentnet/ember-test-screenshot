'use strict';
var imageServer = require('./lib/image-server');

module.exports = {
  name: require('./package').name,
  isDevelopingAddon() {
    return true;
  },
  
  serverMiddleware: function(startOptions) {
    imageServer.server(startOptions.app, {
      configPath: this.project.configPath(),
      root: this.project.root
    });
  },

  afterInstall() {
    // Add addons to package.json and run defaultBlueprint
    return this.addAddonsToProject({
      // a packages array defines the addons to install
      packages: [
        // name is the addon name, and target (optional) is the version
        { name: 'html2canvas' }
      ]
    })
  },

  included: function (app) {
    this._super.included(app);
    // console.log(app);
    app.import('node_modules/html2canvas/dist/html2canvas.min.js');
  }
};
