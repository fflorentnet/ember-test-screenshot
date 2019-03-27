'use strict';

const bodyParser = require('body-parser').json({ limit: '50mb' });
const path = require('path');
const fs = require('fs');
const extend = require('extend');
const foxr = require('foxr').default;

const POST_URL = '/image_generation';
let VERBOSE = false;

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

function debug(message) {
    if (this.VERBOSE) {
        console.debug(message);
      }
}

function getDefaultConfig() {
    return {
        filename: ({ selector }) =>
            `screenshot-${selector}-${(new Date()).toISOString()}.png`,
        path: 'screenshots',
        verbose: false,
        connectOpts: {
            defaultViewport: {
                width: 1920,
                height: 1080
            }
        }
    }
}
function objOrFct(obj, opts) {
    if (typeof obj === 'function') {
        return JSON.stringify(obj.call(null, opts));
    } else {
        return obj;
    }
}

async function takeScreenshot(selector, path, connectOpts) {
    debug(`Connexion au browser`);
    const browser = await foxr.connect(connectOpts);
    debug(`Connexion au browser: OK`);
    debug(`Recuperation des pages`);
    const pages = await browser.pages();
    debug(`Recuperation des pages: OK, ${pages.length} page(s) disponible(s)`);
    const page = pages[0];
    if (!selector) {
        debug(`Aucun selector, screenshot de page`);
        await page.screenshot({ path });
        debug(`Screenshot de page: OK`);
    } else {
        debug(`Selection de l'element ${selector}`);
        const element = await page.$(selector);
        debug(`Selection de l'element ${selector}: OK`);
        debug(`Screenshot de l'element ${selector}`);
        await element.screenshot({ path });    
        debug(`Screenshot de l'element ${selector}: OK`);
    }
    debug('Deconnexion du browser');
    return browser.disconnect();
}

const server = function (app, opts) {
    app.post(POST_URL,
        bodyParser,
        async function ({ body }, res) {
            const config = getConfig(opts.config);
            const filename = body.filename || objOrFct(config.filename, body),
                folder = objOrFct(config.path, body);
            let path = filename;
            this.VERBOSE = config.verbose;
            if (folder) { path = `${folder}/${filename}`; }
            debug(`Chemin du fichier: ${path}`);
            try {
                await takeScreenshot(body.selector, path, config.connectOpts);
            }
            catch (err) {
                console.error(err);
                res.json(err);
            }
            res.json("OK");
        },
        logError
    );
}

module.exports = {
 server
}