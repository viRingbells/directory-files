/**
 * The directory loader
 **/
'use strict';

const debug   = require('debug')('directoryfiles.Descriptor');
const fs      = require('fs');
const misc    = require('vi-misc');
const path    = require('path');

misc.async.all(fs);


class Descriptor {

    /**
     * Construct, init path
     **/
    constructor(descriptor_path, parent_directory_path = null) {
        descriptor_path = parent_directory_path == null ? descriptor_path :
            path.join(parent_directory_path, descriptor_path);
        this.path = misc.path.absolute(descriptor_path);
        this._rel_path = path.relative(misc.path.root, this.path);
        this.stats = null;
        debug(`constructed as [${this._rel_path}]`);
    }

    /**
     * Get ready for further uses
     **/
    async ready() {
        await this._stat();
        await this._load();
        debug(`[${this._rel_path}] getting ready`);
    }

    /**
     * Check the stat
     **/
    async _stat() {
        if (this.stats === null) {
            this.stats = await fs.statAsync(this.path);
            debug(`[${this._rel_path}] stats OK`);
        }
        return this;
    }

    /**
     * Load the file content / directory tree
     **/
    async _load() {
        debug(`[${this._rel_path}] loading`);
        if (this.stats.isDirectory()) {
            debug(`[${this._rel_path}] loading as DIRECTORY`);
            await this.loadDirectory();
        }
        else {
            debug(`[${this._rel_path}] loading as FILE`);
            await this.loadFile();
        }
        return this;
    }

    /**
     * Load file content
     **/
    async loadFile() {
        this.content = this.path;
        return this;
    }

    /**
     * Load directory
     **/
    async loadDirectory() {
        const file_list = await fs.readdirAsync(this.path);
        this.files = {};
        for (const file_path of file_list) {
            const sub_file = new Descriptor(file_path, this.path);
            await sub_file.ready();
            this.files[file_path] = sub_file;
        }
        return this;
    }

    /**
     * Extract the directory/files into a tree in objects
     **/
    get tree() {
        debug(`[${this._rel_path}] to tree`);
        if (!this.stats.isDirectory()) {
            return this.path;
        }
        const object = {};
        for (const name in this.files) {
            object[name] = this.files[name].tree;
        }
        return object;
    }
}


module.exports = Descriptor;
