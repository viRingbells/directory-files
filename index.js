/**
 * This is a file loader, which scan and read all files under a given directory.
 * All files (and their contents if needed) are organized into a tree in a map just
 * the same as they are in file system.
 **/
'use strict';

const debug     = require('debug')('directory-loader.main');
const File      = require('./source/File');

debug('loading ...');

function load(filepath) {
    return new File(filepath);    
}

debug('loaded!');

module.exports = load;
