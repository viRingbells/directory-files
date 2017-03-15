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
