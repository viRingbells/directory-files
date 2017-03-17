/**
 * Test of directory loader
 **/
'use strict';

process.mainModule = module;

const debug   = require('debug')('directory-loader.test.index');
const path    = require('path');
const File    = require('..');
const { foo, bar, jsFiles, barJs, getBarTree } = require('../example');

debug('loading ...');

describe('load a file', () => {
    it('should return a File object with type FILE', (done) => {
        foo.should.be.an.instanceOf(File);
        foo.type.should.be.exactly(File.TYPE_FILE);
        foo.name.should.be.exactly('foo');
        foo.basename.should.be.exactly('foo.js');
        foo.extname.should.be.exactly('.js');
        path.isAbsolute(foo.path).should.be.exactly(true);
        done();
    });
});

describe('load a directory', () => {
    it('should return a File object with type DIRECTORY', (done) => {
        bar.should.be.an.instanceOf(File);
        bar.type.should.be.exactly(File.TYPE_DIRECTORY);
        bar.name.should.be.exactly('bar');
        bar.files.should.be.an.instanceOf(Map).with.property('size', 4);
        done();
    });

    it('should read sub directories recursively', (done) => {
        const barD = bar.files.get('d');
        barD.should.be.an.instanceOf(File);
        barD.type.should.be.exactly(File.TYPE_DIRECTORY);
        barD.name.should.be.exactly('d');
        barD.files.should.be.an.instanceOf(Map).with.property('size', 3);
        done();
    });
});

describe('method filter', () => {
    it('should return a new File object with filtered files', (done) => {
        barJs.should.be.an.instanceOf(File);
        barJs.type.should.be.exactly(File.TYPE_DIRECTORY);
        barJs.name.should.be.exactly('bar');
        barJs.files.should.be.an.instanceOf(Map).with.property('size', 2);
        barJs.files.get('d').should.be.an.instanceOf(File);
        barJs.files.get('d').type.should.be.exactly(File.TYPE_DIRECTORY);
        barJs.files.get('d').name.should.be.exactly('d');
        barJs.files.get('d').files.should.be.an.instanceOf(Map).with.property('size', 1);
        done();
    });
});

describe('method each', () => {
    it('should write each of path into jspath', (done) => {
        jsFiles.should.be.an.instanceOf(Array).with.lengthOf(2);
        for (const filepath of jsFiles) {
            filepath.endsWith('.js').should.be.ok;
        }
        done();
    });
});

describe('method toTree', () => {
    it('should read all files content', () => (async () => {
        const tree = await getBarTree();
        tree.should.be.an.instanceOf(Map).with.property('size', 4);
        tree.get('d').should.be.an.instanceOf(Map).with.property('size', 3);
    })());
    it('should set file path as value by default', () => (async () => {
        const rawTree = await bar.toTree();
        rawTree.should.be.an.instanceOf(Map).with.property('size', 4);
        path.isAbsolute(rawTree.get('a.js')).should.be.ok;
    })());
});

debug('loaded!');
