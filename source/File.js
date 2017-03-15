/**
 * Class file
 **/
'use strict';

const debug   = require('debug')('directory-loader.File');
const fs      = require('fs');
const misc    = require('vi-misc');
const path    = require('path');

debug('loading ...');

class File {
    constructor(filepath) {
        this.path = misc.path.absolute(filepath);
        this.basename = path.basename(this.path);
        this.extname = path.extname(this.path);
        this.name = path.basename(this.path, this.extname);
        const stat = fs.statSync(this.path);
        this.type = stat.isDirectory() ? File.TYPE_DIRECTORY :
                     stat.isFile() ? File.TYPE_FILE : File.TYPE_OTHER;
        if (this.type === File.TYPE_DIRECTORY) {
            this.files = new Map();
            let files = fs.readdirSync(this.path);
            files.filter((name) => !name.startsWith('.')).forEach((name) => {
                const file = new File(path.join(this.path, name));
                this.files.set(file.basename, file);
            });
        }
    }
}

File.TYPE_FILE = 'FILE';
File.TYPE_DIRECTORY = 'DIRECTORY';
File.TYPE_OTHER = 'OTHER';

debug('loaded!');
module.exports = File;
