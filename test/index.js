/**
 * Test of directory loader
 **/
'use strict';

process.mainModule = module;

const debug   = require('debug')('directory-loader.test.index');
const path    = require('path');
const load    = require('..');
const file    = require('../example').file;
const tree    = require('../example').tree;

debug('loading ...');

describe('load a file', () => {
    it('should return a File object with type FILE', (done) => {
        file.should.be.an.instanceOf(load.File);
        file.type.should.be.exactly(load.File.TYPE_FILE);
        file.name.should.be.exactly('foo');
        file.basename.should.be.exactly('foo.js');
        file.extname.should.be.exactly('.js');
        path.isAbsolute(file.path).should.be.exactly(true);
        done();
    });
});

describe('load a directory', () => {
    it('should return a File object with type DIRECTORY', (done) => {
        tree.should.be.an.instanceOf(load.File);
        tree.type.should.be.exactly(load.File.TYPE_DIRECTORY);
        tree.name.should.be.exactly('bar');
        tree.files.should.be.an.instanceOf(Map).with.property('size', 5);
        done();
    });

    it('should read sub directories recursively', (done) => {
        const tree1 = tree.files.get('d');
        tree1.should.be.an.instanceOf(load.File);
        tree1.type.should.be.exactly(load.File.TYPE_DIRECTORY);
        tree1.name.should.be.exactly('d');
        tree1.files.should.be.an.instanceOf(Map).with.property('size', 3);
        done();
    });
});

debug('loaded!');
