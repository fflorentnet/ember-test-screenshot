'use strict';

const bodyParser = require('body-parser').json({ limit: '50mb' });
const path = require('path');
const fs = require('fs');
const extend = require('extend');
const foxr = require('foxr').default;

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
        filename: ({ selector }) =>
            `screenshot-${selector}-${(new Date()).toISOString()}.png`,
        path: 'screenshots'
    }
}
function objOrFct(obj, opts) {
    if (typeof obj === 'function') {
        return JSON.stringify(obj.call(null, opts));
    } else {
        return obj;
    }
}

async function takeScreenshot(selector, path) {
    const browser = await foxr.connect({
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });
    const pages = await browser.pages();
    const page = pages[0];
    // await page.screenshot({ path });
    const element = await page.$(selector);
    await element.screenshot({ path });
    return browser.disconnect();
}

const server = function (app, opts) {
    app.post(POST_URL,
        bodyParser,
        async ({ body }, res)  => {
            const config = getConfig(opts.config);
            const filename = body.filename || objOrFct(config.filename, body),
                folder = objOrFct(config.path, body);
            let path = filename;
            if (folder) { path = `${folder}/${filename}`; }
            await takeScreenshot(body.selector, path);
            res.json("OK");
        },
        logError
    );
}

module.exports = {
 server
}