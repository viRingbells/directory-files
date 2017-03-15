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
            files.forEach((name) => {
                const file = new File(path.join(this.path, name));
                this.files.set(file.basename, file);
            });
        }
    }
    filter(test) {
        if (!test(this)) {
            return null;
        }
        const object = Object.assign(Object.create(this), this);
        if (object.type === File.TYPE_DIRECTORY) {
            const files = new Map();
            for (const filename of object.files.keys()) {
                let file = object.files.get(filename);
                file = file.filter(test);
                if (file !== null) {
                    files.set(filename, file);
                }
            }
            object.files = files;
        }
        return object;
    }
    each(callback) {
        callback(this);
        if (this.type === File.TYPE_DIRECTORY) {
            this.files.forEach((item) => item.each(callback));
        }
        return this;
    }
}

File.TYPE_FILE = 'FILE';
File.TYPE_DIRECTORY = 'DIRECTORY';
File.TYPE_OTHER = 'OTHER';

debug('loaded!');
module.exports = File;
