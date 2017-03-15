/**
 * Example of the app
 **/
'use strict';

process.mainModule = module;

const debug   = require('debug')('directory-loader.example.index');
const load    = require('..');

debug('loading ...');

const file = load('./foo.js');
const tree = load('./bar');

debug('loaded!');
exports.file = file;
exports.tree = tree;

const jsfiles = [];
const tree1 = tree.filter(file => file.type === file.File.TYPE_DIRECTORY || file.extname === '.js');
tree1.each(file => jsfiles.push(file.path));

exports.tree1 = tree1;
exports.jsfiles = jsfiles;
