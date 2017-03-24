# directoryfiles

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

Handle all files under a given directory

# usage

```
const directoryfiles = require('directoryfiles');

const dir = new directoryfiles('file/path');

/*
dir => {
    'path': '/absolute/file/path',
    'children': Map{
        'a.js': "/absolute/file/path/a.js,
        'b': directoryfiles{
            'path': '/absolute/file/path/b',
            children: Map{
                'c.js': "/absolute/file/path/b/c.js"
            }
         }
    }
}
*/

```

# .each()

Handle each file

```
dir.each(filepath => console.log(filepath));
```

# .map()
Map values

```
let dir1 = dir.map(filepath => path.relative(dir1.path, filepath).split('/').join('.'));

/*
dir => {
    'path': '/absolute/file/path',
    'children': Map{
        'a.js': "/absolute/file/path/a.js,
        'b': directoryfiles{
            'path': '/absolute/file/path/b',
            children: Map{
                'c.js': "/absolute/file/path/b/c.js"
            }
         }
    }
}
*/

```

# .mapkeys()
Change keyname

```
let dir2 = dir.mapkeys(key => path.basename(key, path.extname(key)));

/*
dir => {
    'path': '/absolute/file/path',
    'children': Map{
        'a': "/absolute/file/path/a.js,
        'b': directoryfiles{
            'path': '/absolute/file/path/b',
            children: Map{
                'c': "/absolute/file/path/b/c.js"
            }
         }
    }
}
*/

```

# .filter()
filter files

```
let dir3 = dir.filter((file, key) => key !== 'a.js');

/*
dir => {
    'path': '/absolute/file/path',
    'children': Map{
        'b': directoryfiles{
            'path': '/absolute/file/path/b',
            children: Map{
                'c': "/absolute/file/path/b/c.js"
            }
         }
    }
}
*/

```

# .filterDirectory()
filter directories

```
let dir4 = dir.filterDirectory((dir, key) => dir.children.size !== 0);
```

# .toObject()
parse into an object

```
let obj = dir.toObject();

/*
obj => {
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
