/**
 * This module is supposed to scan all files under a certain directory
 * and provides iterate interface to handle these files
 **/
'use strict';

const assert    = require('assert');
const bluebird  = require('bluebird');
const clone     = require('clone');
const debug     = require('debug')('directoryfiles.index');
const fs        = require('fs');
const misc      = require('vi-misc');
const path      = require('path');

debug('promisify native apis');
bluebird.promisifyAll(fs);

class DirectoryFiles {

    /**
     * Scan and record all files paths under a certain directory
     **/
    async load(path = '') {
        debug('load directory');
        await this._initialize(path);
        const files = await fs.readdirAsync(this.path);
        await this._loadFiles(files);
    }

    /**
     * Initialize all properties
     **/
    async _initialize(path) {
        debug('initialize');
        assert('string' === typeof path, `Param 'path' must be a string, ${typeof path} given`);
        this.path = misc.path.absolute(path);
        const stat = await fs.statAsync(this.path);
        assert(stat.isDirectory(), `${typeof this.path} should be a directory path`);
        this.children = new Map();
    }

    /**
     * Load files under the directory
     **/
    async _loadFiles(files) {
        debug('load files');
        const loadList = [];
        for (let file of files) {
            loadList.push((async (file) => {
                const filePath = path.join(this.path, file);
                const stat = await fs.statAsync(filePath);
                if (stat.isDirectory()) {
                    await this._loadDirectory(file);
                    return;
                }
                debug(`load file ${filePath}`);
                assert(!this.children.has(file), `Duplicated file/directory name ${file} for file ${file}`);
                this.children.set(file, filePath);
            })(file));
        }
        await Promise.all(loadList);
        debug('load files done');
    }

    /**
     * Load a directory under the directory
     **/
    async _loadDirectory(directoryName) {
        assert(!this.children.has(directoryName), `Duplicated file/directory name for directory ${directoryName}`);
        const directoryPath = path.join(this.path, directoryName);
        debug(`load directory ${directoryPath}`);
        const result = new DirectoryFiles();
        await result.load(directoryPath);
        this.children.set(directoryName, result);
    }

    /**
     * Transform into a pure object
     **/
    toObject() {
        const object = {};
        for (const key of this.children.keys()) {
            const value = this.children.get(key);
            object[key] = value instanceof DirectoryFiles ? value.toObject() : value;
        }
        return object;
    }

    /**
     * iterate an action on each of the files
     **/
    iterate(handler) {
        assert(handler instanceof Function, 'Iterate handler must be a Function');
        const subject = clone(this);
        const keys = subject.children.keys();
        const children = new Map();
        for (const key of keys) {
            const value = subject.children.get(key);
            let result = handler(value, key);
            result = Object.assign({}, result);

            if (!result.hasOwnProperty('key')) {
                continue;
            }
            assert(!children.has(result.key), `Duplicated key ${result.key} on directory ${subject.path}`);

            if (result.value instanceof DirectoryFiles) {
                result.value = result.value.iterate(handler);
            }

            children.set(result.key, result.value);
        }
        subject.children = children;
        return subject;
    }

    iterateWith(type, handler) {
        debug('iterate directory');
        return this.iterate((value, key) => {
            if ((value instanceof DirectoryFiles) !== (type === 'directory')) {
                return { key, value };
            }
            return handler(value, key);
        });
    }

    /**
     * Map the values with a certain parser
     **/
    map(handler) {
        debug('map');
        return this.iterateWith('value', (value, key) => {
            value = handler(value, key);
            return { key, value };
        });
    }

    /**
     * Map the keys with a certain parser
     **/
    mapKeys(handler) {
        debug('map keys');
        return this.iterateWith('value', (value, key) => {
            key = handler(key, value);
            return { key, value };
        });
    }

    /**
     * Map the directories
     **/
    mapDirectory(handler) {
        debug('map directory');
        return this.iterateWith('directory', (value, key) => {
            value = handler(value, key);
            return { key, value };
        });
    }

    /**
     * Map directory keys
     **/
    mapDirectoryKeys(handler) {
        debug('map directory keys');
        return this.iterateWith('directory', (value, key) => {
            key = handler(key, value);
            return { key, value };
        });
    }

    /**
     * Apply the handler to each value of this.children
     **/
    each(handler) {
        debug('each');
        return this.map((value, key) => {
            handler(value, key);
            return value;
        });
    }

    eachDirectory(handler) {
        debug('each directory');
        return this.mapDirectory((value, key) => {
            handler(value, key);
            return value;
        });
    }

    /**
     * Filter the values with a condition
     **/
    filter(handler) {
        debug('filter');
        return this.iterateWith('value', (value, key) => {
            return handler(value, key) === true ? { key, value } : {};
        });
    }

    /**
     * Filter the directories with a condition
     **/
    filterDirectory(handler) {
        debug('filter directory');
        return this.iterateWith('directory', (value, key) => {
            return handler(value, key) === true ? { key, value } : {};
        });
    }
}

module.exports = DirectoryFiles;
