/**
 * Example of the app
 **/
'use strict';

process.mainModule = module;

const fs              = require('fs');
const path            = require('path');
const DirectoryFiles  = require('directoryfiles');

async function main() {
    const directory = new DirectoryFiles();
    await directory.load();
    await directory.load('foo');
    const js = directory
        .filter(path => path.endsWith('.js') || path.endsWith('.json'))
        .map(path => require(path))
        .mapKeys(key => path.basename(key, path.extname(key)))
        .toObject();

    const yaml = directory.filter(path => path.endsWith('.yaml') || path.endsWith('yml'))
         .map(path => fs.readFileSync(path).toString())
         .mapKeys(key => path.basename(key, path.extname(key)))
         .toObject();
    
    return [directory, js, yaml];
}

module.exports = main;
