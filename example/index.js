/**
 * Example of the app
 **/
'use strict';

process.mainModule = module;

const fs              = require('fs');
const path            = require('path');
const DirectoryFiles  = require('..');

const dir = new DirectoryFiles('foo');

const js = dir.filter(path => path.endsWith('.js') || path.endsWith('.json'))
              .map(path => require(path))
              .mapkeys(key => path.basename(key, path.extname(key)))
              .toObject();

const yaml = dir.filter(path => path.endsWith('.yaml') || path.endsWith('yml'))
                .map(path => fs.readFileSync(path).toString())
                .mapkeys(key => path.basename(key, path.extname(key)))
                .toObject();

js.d.e();

module.exports = { dir, js, yaml };
