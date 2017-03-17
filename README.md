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

# .filter() and .each()

Apply handler for every file and directory in the target.

```
const dectory1 = directory.filter(file => file.type !== file.File.TYPE_DIRECTORY && file.name != ''a');
```

```
directory.each(file => console.log(file.name));
```
# .toTree()

Map all files into a tree, file name as the key and path (by default) as the value

```
const tree = directory.toTree();

/*
directory => {
    'a': 'xxx',
    'b': 'xxx',
    'c': Map{
        'd': 'xxx',
        'e': 'xxx',
        ...
    }
}
*/
```

[npm-image]: https://img.shields.io/npm/v/vi-directory-loader.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/vi-directory-loader
[travis-image]: https://img.shields.io/travis/viRingbells/vi-directory-loader/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/viRingbells/vi-directory-loader
[coveralls-image]: https://img.shields.io/codecov/c/github/viRingbells/vi-directory-loader.svg?style=flat-square
[coveralls-url]: https://codecov.io/github/viRingbells/vi-directory-loader?branch=master
