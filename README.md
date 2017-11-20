# directoryfiles

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

Handle all files under a given directory

# usage

```
const Directoryfiles = require('directoryfiles');

const dir = new Directoryfiles('path/to/a/directory');
await dir.ready();

console.log(dir.tree);
/*
{
    'a.js': "/absolute/file/path/a.js,
    'b': {
        'c.js': "/absolute/file/path/b/c.js"
    }
}
*/

```

[npm-image]: https://img.shields.io/npm/v/directoryfiles.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/directoryfiles
[travis-image]: https://img.shields.io/travis/viRingbells/directoryfiles/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/viRingbells/directoryfiles
[coveralls-image]: https://img.shields.io/codecov/c/github/viRingbells/directoryfiles.svg?style=flat-square
[coveralls-url]: https://codecov.io/github/viRingbells/directoryfiles?branch=master
