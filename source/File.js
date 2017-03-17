/**
 * Class file
 **/
'use strict';

const debug   = require('debug')('directory-loader.File');
const fs      = require('fs');
const misc    = require('vi-misc');
const path    = require('path');

debug('loading ...');

/**
 *  Class File to load file or directory recursively
 **/
class File {
    /**
     * Initializing a new File instance
     * @param   filepath : string   the path of the file or directory
     * @return  this : File         return self for chaining calls
     **/
    constructor(filepath) {
        /**
         * Set common attributes of the file
         **/
        this.path = misc.path.absolute(filepath);
        this.basename = path.basename(this.path);
        this.extname = path.extname(this.path);
        this.name = path.basename(this.path, this.extname);
        const stat = fs.statSync(this.path);
        this.type = stat.isDirectory() ? File.TYPE_DIRECTORY :
                     stat.isFile() ? File.TYPE_FILE : File.TYPE_OTHER;
        /**
         * For type directory, load files under the directory recursively
         **/
        if (this.type === File.TYPE_DIRECTORY) {
            this.files = new Map();
            let files = fs.readdirSync(this.path);
            files.forEach((name) => {
                const file = new File(path.join(this.path, name));
                this.files.set(file.basename, file);
            });
        }
        return this;
    }
    /**
     * Filter all files and directories under this file or directory
     * @param   test : function(file: File)   the tester to see if file should be filtered
     * @return  object : File                 returns a new filtered File instance
     *                                        (current instance will be not modified)
     **/
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
    /**
     * like file, but only for type FILE
     * @param   test : function(file: File)   tester to see if file should be kept
     * @return  object : File                 returns a new filtered File instance
     *                                        (current instance will be not modified)
     **/
    filterFile(test) {
        return this.filter(file => file.type === File.TYPE_DIRECTORY ||
                          (file.type === File.TYPE_FILE && test(file)));
    }
    /**
     * Do a task for all files and directories under current file
     * @param   handler : function(file: File)   handler to do something on each file
     * @return  this : File                       return self for chaining calls
     **/
    each(handler) {
        handler(this);
        if (this.type === File.TYPE_DIRECTORY) {
            this.files.forEach((item) => item.each(handler));
        }
        return this;
    }
    /**
     * like each, but only for type FILE
     * @param   handler : function(file: File)   handler to do something on each file
     * @return  this : File                       return self for chaining calls
     **/
    eachFile(handler) {
        return this.each(file => file.type === File.TYPE_FILE && handler(file));
    }
    /**
     * parse into tree
     * @param   handler : function(file: File)   handler to do something on each file
     * @return  result : any or a Map            the result in a tree
     **/
    async toTree(handler = (file) => file.path) {
        if (this.type !== File.TYPE_DIRECTORY) {
            return await handler(this);
        }
        const map = new Map();
        for (const file of this.files.values()) {
            const tree = await file.toTree(handler);
            map.set(file.basename, tree);
        }
        return map;
    }
}

File.TYPE_FILE = 'FILE';
File.TYPE_DIRECTORY = 'DIRECTORY';
File.TYPE_OTHER = 'OTHER';

debug('loaded!');
module.exports = File;
