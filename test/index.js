/**
 * Test of directory loader
 **/
'use strict';

process.mainModule = module;

const path              = require('path');
const should            = require('should');
const DirectoryFiles    = require('..');
const { dir, js, yaml } = require('../example');

describe('create an instance of DirectoryFiles', () => {
    it('should return a instance with the files record in its property "children"', (done) => {
        dir.should.be.an.instanceof(DirectoryFiles);
        dir.should.have.property('path');
        dir.path.should.be.a.String;
        path.isAbsolute(dir.path).should.be.exactly(true);
        dir.children.should.be.an.instanceof(Map).with.property('size', 4);
        dir.children.get('d').should.be.an.instanceof(DirectoryFiles);
        dir.children.get('d').children.should.have.property('size', 3);
        done();
    });
});

describe('filter files', () => {
    it('should return a new instance with files filtered', (done) => {
        const js = dir.filter(path => path.endsWith('.js'));
        js.should.be.an.instanceof(DirectoryFiles);
        js.should.not.be.exactly(dir);
        js.children.size.should.be.exactly(2);
        js.children.get('a.js').should.be.ok;
        should(js.children.get('b.json')).not.be.ok;
        js.children.get('d').children.size.should.be.exactly(1);
        js.children.get('d').children.get('e.js').should.be.ok;
        should(js.children.get('d').children.get('h.yaml')).not.be.ok;
        done();
    });
});

describe('filter directories', () => {
    it('should return a new instance with directory filtered', (done) => {
        const c4 = dir.filterDirectory(file => file.children.size > 3);
        should(c4.children.has('d')).be.exactly(false);
        done();
    });
});

describe('mapping keys', () => {
    it('should rename files in property children', (done) => {
        const rename = dir.mapkeys(key => path.basename(key, path.extname(key)).toUpperCase());
        should(rename.children.get('a.js')).not.be.ok;
        rename.children.get('A').should.be.ok;
        should(rename.children.get('d').children.get('f.yaml')).not.be.ok;
        rename.children.get('d').children.get('F').should.be.ok;
        done();
    });
});

describe('mapping content', () => {
    it('should map contents with handler', (done) => {
        const map = dir.map(filepath => path.relative(dir.path, filepath));
        map.children.get('a.js').should.be.exactly('a.js');
        map.children.get('d').children.get('e.js').should.be.exactly('d/e.js');
        done();
    });
});

describe('each file', () => {
    it('should handle each file', (done) => {
        const paths = [];
        dir.each(path => paths.push(path));
        paths.length.should.be.exactly(6);
        done();
    });
});

describe('async load', () => {
    it('should return a instance with the files record in its property "children"', async () => {
        const dir = new DirectoryFiles('../example/foo', true);
        await dir.load();
        dir.should.be.an.instanceof(DirectoryFiles);
        dir.should.have.property('path');
        dir.path.should.be.a.String;
        path.isAbsolute(dir.path).should.be.exactly(true);
        dir.children.should.be.an.instanceof(Map).with.property('size', 4);
        dir.children.get('d').should.be.an.instanceof(DirectoryFiles);
        dir.children.get('d').children.should.have.property('size', 3);
    });
});

describe('load wrong file', () => {
    it('should not throw in sync mode', async () => {
        let error = {};
        let dir = null;
        try {
            dir = new DirectoryFiles('../example/foo222');
        }
        catch (e) {
            error = e;
        }
        error.should.be.an.instanceof(Error);
    });
    it('should not throw in async mode', async () => {
        let error = {};
        try {
            const dir = new DirectoryFiles('../example/foo222', true);
            await dir.load();
        }
        catch (e) {
            error = e;
        }
        error.should.be.an.instanceof(Error);
    });
});
