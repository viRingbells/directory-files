/**
 * Test of directory loader
 **/
'use strict';

process.mainModule = module;

const path              = require('path');
const should            = require('should');
const DirectoryFiles    = require('directoryfiles');
const example           = require('directoryfiles/example');

describe('instance of DirectoryFiles', () => {
    let directory, js, yaml;
    before(async () => {
        [directory, js, yaml] = await example();
    });

    it('should have files record in its property "children"', async () => {
        directory.should.be.an.instanceof(DirectoryFiles);
        directory.should.have.property('path');
        directory.path.should.be.a.String;
        path.isAbsolute(directory.path).should.be.exactly(true);
        directory.children.should.be.an.instanceof(Map).with.property('size', 4);
        directory.children.get('d').should.be.an.instanceof(DirectoryFiles);
        directory.children.get('d').children.should.have.property('size', 3);

        js.d.e.should.be.an.instanceof(Function);
        js.d.e().should.be.exactly('This is e.js');
    });

    it('should return a new instance with files filtered with method filter', async () => {
        const js = directory.filter(path => path.endsWith('.js'));
        js.should.be.an.instanceof(DirectoryFiles);
        js.should.not.be.exactly(directory);
        js.children.size.should.be.exactly(2);
        js.children.get('a.js').should.be.ok;
        should(js.children.get('b.json')).not.be.ok;
        js.children.get('d').children.size.should.be.exactly(1);
        js.children.get('d').children.get('e.js').should.be.ok;
        should(js.children.get('d').children.get('h.yaml')).not.be.ok;
    });

    it('should return a new instance with directory filtered with method filterDirectory', async () => {
        const c4 = directory.filterDirectory(file => file.children.size > 3);
        should(c4.children.has('d')).be.exactly(false);
    });

    it('should rename files in property children with method mapKeys', async () => {
        const rename = directory.mapKeys(key => path.basename(key, path.extname(key)).toUpperCase());
        should(rename.children.get('a.js')).not.be.ok;
        rename.children.get('A').should.be.ok;
        should(rename.children.get('d').children.get('f.yaml')).not.be.ok;
        rename.children.get('d').children.get('F').should.be.ok;
    });

    it('should map contents with handler with method map', async () => {
        const map = directory.map(filePath => path.relative(directory.path, filePath));
        map.children.get('a.js').should.be.exactly('a.js');
        map.children.get('d').children.get('e.js').should.be.exactly('d/e.js');
    });

    it('should handle each file with method each', async () => {
        const paths = [];
        directory.each(path => paths.push(path));
        paths.length.should.be.exactly(6);
    });

    it('should map directories', async () => {
        const map = directory.mapDirectory(subDirectory => subDirectory.path);
        map.should.have.property('children').which.is.an.instanceof(Map);
        map.children.size.should.be.exactly(4);
        map.children.has('d').should.be.ok;
        map.children.get('d').should.be.an.instanceof(String);
        map.children.get('d').endsWith('example/foo/d').should.be.ok;
    });

    it('should map directory keys', async () => {
        const map = directory.mapDirectoryKeys(key => `direcotry:${key}`);
        map.should.have.property('children').which.is.an.instanceof(Map);
        map.children.size.should.be.exactly(4);
        map.children.has('d').should.not.be.ok;
        map.children.has('direcotry:d').should.be.ok;
        map.children.get('direcotry:d').should.be.an.instanceof(DirectoryFiles);
    });

    it('should iterate through each directory', async () => {
        const paths = [];
        directory.eachDirectory(path => paths.push(path));
        paths.length.should.be.exactly(1);
    });

    it('should remove directory', async () => {
        const map = directory.filterDirectory(() => false);
        map.should.have.property('children').which.is.an.instanceof(Map);
        map.children.size.should.be.exactly(3);
        map.children.has('d').should.not.be.ok;
    });

    it('should keep directory', async () => {
        const map = directory.filterDirectory(() => true);
        map.should.have.property('children').which.is.an.instanceof(Map);
        map.children.size.should.be.exactly(4);
        map.children.has('d').should.be.ok;
    });
});

describe('load wrong file', () => {
    it('should throw an error', async () => {
        let error = {};
        try {
            const directory = new DirectoryFiles();
            await directory.load('../example/foo222');
        }
        catch (e) {
            error = e;
        }
        error.should.be.an.instanceof(Error);
    });
});
