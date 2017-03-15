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
const tree1   = require('../example').tree1;
const jsfiles = require('../example').jsfiles;

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
        const treed = tree.files.get('d');
        treed.should.be.an.instanceOf(load.File);
        treed.type.should.be.exactly(load.File.TYPE_DIRECTORY);
        treed.name.should.be.exactly('d');
        treed.files.should.be.an.instanceOf(Map).with.property('size', 3);
        done();
    });
});

describe('method filter', () => {
    it('should return a new File object with filtered files', (done) => {
        tree1.should.be.an.instanceOf(load.File);
        tree1.type.should.be.exactly(load.File.TYPE_DIRECTORY);
        tree1.name.should.be.exactly('bar');
        tree1.files.should.be.an.instanceOf(Map).with.property('size', 2);
        tree1.files.get('d').should.be.an.instanceOf(load.File);
        tree1.files.get('d').type.should.be.exactly(load.File.TYPE_DIRECTORY);
        tree1.files.get('d').name.should.be.exactly('d');
        tree1.files.get('d').files.should.be.an.instanceOf(Map).with.property('size', 1);
        done();
    });
});

describe('method each', () => {
    it('should write each of path into jspath', (done) => {
        jsfiles.should.be.an.instanceOf(Array).with.lengthOf(4);
        for (const filepath of jsfiles) {
            filepath.endsWith('.js').should.be.ok;
        }
        done();
    });
});

debug('loaded!');
