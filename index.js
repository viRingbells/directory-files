'use strict';

const assert  = require('assert');
const fs      = require('fs');
const path    = require('path');
const thenify = require('thenify');

fs.statAsync    = thenify(fs.stat);
fs.readdirAsync = thenify(fs.readdir);

const misc    = require('vi-misc');

class DirectoryFiles {

    constructor(directoryPath, async = false) {
        this.children = new Map();
        this.path = misc.path.absolute(directoryPath);
        !async && this.loadSync();
    }

    loadSync() {
        let stat = fs.statSync(this.path);
        assert(stat.isDirectory(), 'Path should be a directory');

        const files = fs.readdirSync(this.path);
        for (let file of files) {
            let result = path.join(this.path, file);
            let stat = fs.statSync(result);
            if (stat.isDirectory()) {
                result = new DirectoryFiles(result);
            }
            this.children.set(file, result);
        }
    }

    async load() {
        let stat = await fs.statAsync(this.path);
        assert(stat.isDirectory(), 'Path should be a directory');

        const files = await fs.readdirAsync(this.path);
        let works = [];
        for (let file of files) {
            let result = path.join(this.path, file);
            let stat = await fs.statAsync(result);
            if (stat.isDirectory()) {
                result = new DirectoryFiles(result, true);
                works.push(result.load());
            }
            this.children.set(file, result);
        }
        await Promise.all(works);
    }

    toObject() {
        const obj = {};
        for (let key of this.children.keys()) {
            let value = this.children.get(key);
            if (value instanceof DirectoryFiles) value = value.toObject();
            obj[key] = value;
        }
        return obj;
    }

    iterate(handler) {
        assert(handler instanceof Function, 'Handler should be a Function');
        const object = Object.assign(Object.create(this), this);
        const keys = object.children.keys();
        const children = new Map();
        for (let filename of keys) {
            const file = object.children.get(filename);
            let key = filename;
            let content = file;
            if (file instanceof DirectoryFiles) {
                let result = handler(file, key);
                key = result.key;
                (key !== null) && (content = file.iterate(handler));
            }
            else {
                let result = handler(file, filename);
                content = result.file;
                key = result.key;
            }
            if (key === null) continue;

            assert(!children.has(key), `Duplicated key ${key} on directory ${object.path}`);
            children.set(key, content);
        }
        object.children = children;
        return object;
    }

    each(handler) {
        return this.iterate((file, key) => {
            (file instanceof DirectoryFiles) || handler(file, key);
            return { key, file };
        });
    }

    map(handler) {
        return this.iterate((file, key) => {
            (file instanceof DirectoryFiles) || (file = handler(file, key));
            return { key, file };
        });
    }

    mapkeys(handler) {
        return this.iterate((file, key) => {
            (file instanceof DirectoryFiles) || (key = handler(key, file));
            return { key, file };
        });
    }

    filter(handler) {
        return this.iterate((file, key) => {
            (file instanceof DirectoryFiles) || (key = handler(file, key) === false ? null : key);
            return { key, file };
        });
    }

    filterDirectory(handler) {
        return this.iterate((file, key) => {
            (file instanceof DirectoryFiles) && (key = handler(file, key));
            return { key, file };
        });
    }
}

module.exports = DirectoryFiles;
