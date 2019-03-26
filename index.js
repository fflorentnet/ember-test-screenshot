'use strict';
var imageServer = require('./lib/image-server');

module.exports = {
  name: 'ember-test-screenshot',
  isDevelopingAddon() {
    return true;
  },

  serverMiddleware: function(startOptions) {
    return imageServer.server(startOptions.app, {
      config: this.project.configPath()
    });
  },

  testemMiddleware: function (app) {
    const config = {
      configPath: this.project.configPath()
    };
    if (process.argv.includes('--server') || process.argv.includes('-s')) {
      return this.serverMiddleware({ app }, config);
    }
    return imageServer.server(app, {
      config: this.project.configPath()
    });
  }
};
