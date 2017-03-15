# vi-directory-loader

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

A tool to find all files under a certain directory. The scan result files are organized in a tree just as they are in file system.

# usage

```
const load = require('vi-directory-loader');

const directory = load('./foo');

/*
directory => {
    'name': 'foo',
    'type': 'DIRECTORY',
    'files': Map{
        'a': { 'name': 'a', ...},
        'b': { 'name': 'b', ...},
        ...
    }
}
*/

```

Note that invisible files are ignored.

[npm-image]: https://img.shields.io/npm/v/vi-directory-loader.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/vi-directory-loader
[travis-image]: https://img.shields.io/travis/viRingbells/vi-directory-loader/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/viRingbells/vi-directory-loader
[coveralls-image]: https://img.shields.io/codecov/c/github/viRingbells/vi-directory-loader.svg?style=flat-square
[coveralls-url]: https://codecov.io/github/viRingbells/vi-directory-loader?branch=master
