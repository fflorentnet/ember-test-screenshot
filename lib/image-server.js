'use strict';

const bodyParser = require('body-parser').json({ limit: '50mb' });
const path = require('path');
const fs = require('fs');

const POST_URL = '/image_generation';

function logError(err, req, res, next) {
    console.error(err.stack);
    next(err);
}
  
const server = function (app, options) {
    app.post(POST_URL,
        bodyParser,
        ({ body }, res) => {
            fs.writeFile(`screenshot-${body.selector}.png`,
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