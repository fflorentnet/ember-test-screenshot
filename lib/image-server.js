'use strict';

const bodyParser = require('body-parser').json({ limit: '50mb' });
const path = require('path');
const fs = require('fs');
const extend = require('extend');

const POST_URL = '/image_generation';

function logError(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

function getConfig(configPath) {
    const configDirName = path.dirname(configPath);
    const configFile = path.resolve(path.join(configDirName, 'screenshots.js'));
    const defaultConfig = getDefaultConfig();

    if (fs.existsSync(configFile)) {
      const projectConfig = require(configFile);
      return extend({}, defaultConfig, projectConfig);
    }

    return defaultConfig;
  }

function getDefaultConfig() {
    return {
        filename: (selector) =>
            `screenshot-${selector}-${(new Date()).toISOString()}.png`,
        path: 'screenshots'
    }
}
function objOrFct(obj, opts) {
    if (typeof obj === 'function') {
        return obj(opts);
    } else {
        return obj;
    }
}

const server = function (app, opts) {
    app.post(POST_URL,
        bodyParser,
        ({ body }, res) => {
            const config = getConfig(opts.config);
            const filename = objOrFct(config.filename, opts),
                folder = objOrFct(config.path, opts);
            let path = filename;
            if (folder) { path = `${folder}/${filename}`; }
            fs.writeFile(path,
                body.image
                .replace(/^data:image\/png;base64,/, ""), 'base64', (err) => {
            if (err) throw err;
            res.json(body);
        });
        },
        logError
    );
}

module.exports = {
 server
}