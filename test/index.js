/**
 * Test of directory loader
 **/
'use strict';

process.mainModule = module;

const misc        = require('vi-misc');
const should      = require('should');
const Descriptor  = require('directoryfiles');


describe('common use', () => {
    let descriptor = null;

    it('should be ok newing a descriptor on a directory', async () => {
        descriptor = new Descriptor('directory');
        await descriptor.ready();
        descriptor.should.have.property('stats');
        descriptor.stats.isDirectory().should.be.exactly(true);
    });

    it('should have property files as the files in the directory', async () => {
        descriptor.should.have.property('files');
        descriptor.files.should.be.an.instanceOf(Object);
        const keys = Object.keys(descriptor.files);
        keys.length.should.be.exactly(3);
        for (const name of ['file.txt', 'js_file.js', 'sub_dir']) {
            keys.includes(name).should.be.ok;
            descriptor.files[name].should.be.an.instanceOf(Descriptor);
        }
        for (const file_name of ['file.txt', 'js_file.js']) {
            descriptor.files[file_name].stats.isFile().should.be.ok;
        }
        descriptor.files.sub_dir.stats.isDirectory().should.be.ok;
    });

    it('should return a directory tree', async () => {
        const tree = descriptor.tree;
        tree.should.be.an.instanceOf(Object);
        tree.should.containDeep({
            'file.txt': misc.path.absolute('directory/file.txt'),
            'js_file.js': misc.path.absolute('directory/js_file.js'),
            'sub_dir': {
                'sub_2_dir': {
                    'a.txt': misc.path.absolute('directory/sub_dir/sub_2_dir/a.txt'),
                    'b.txt': misc.path.absolute('directory/sub_dir/sub_2_dir/b.txt'),
                },
                'sub_dir_file.txt': misc.path.absolute('directory/sub_dir/sub_dir_file.txt'),
                'sub_dir_file_2.txt': misc.path.absolute('directory/sub_dir/sub_dir_file_2.txt'),
            },
        });
    });
    
});


describe('special cases', () => {

    it('should be ok newing a descriptor on an empty directory', async () => {
        const descriptor = new Descriptor('empty');
        await descriptor.ready();
        descriptor.stats.isDirectory().should.be.exactly(true);
        descriptor.should.have.property('files');
        descriptor.files.should.be.an.instanceof(Object);
        Object.keys(descriptor.files).length.should.be.exactly(0);
    });

    it('should throw newing a descriptor on a none-existing file', async () => {
        const descriptor = new Descriptor('not-exist');
        const error = (await misc.async.catchError(descriptor.ready())) || {};
        error.should.be.instanceOf(Error);
    });

    it('should be ok calling ready twice', async () => {
        const descriptor = new Descriptor('directory');
        await descriptor.ready();
        await descriptor.ready();
        await descriptor._stat();
        await descriptor._load();
    });
    
});
