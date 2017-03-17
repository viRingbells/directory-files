/**
 * Example of the app
 **/
'use strict';

process.mainModule = module;

const debug   = require('debug')('directory-loader.example.index');
const fs      = require('fs');
const File    = require('..');

debug('loading ...');

const foo = new File('./foo.js');
const bar = new File('./bar');

const jsFiles = [];
const barJs = bar.filterFile(file => file.extname === '.js');

barJs.eachFile(file => jsFiles.push(file.path));

function getBarTree () {
    return bar.toTree((file) => new Promise((resolve) => {
        fs.readFile(file.path, (err, data) => resolve(data.toString().trim()));
    }));
}

debug('loaded!');

module.exports = { foo, bar, jsFiles, barJs, getBarTree };
