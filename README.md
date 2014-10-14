# Rump
[![NPM](http://img.shields.io/npm/v/rump.svg?style=flat-square)](https://www.npmjs.org/package/rump)
![License](http://img.shields.io/npm/l/rump.svg?style=flat-square)
![Dependencies](http://img.shields.io/david/rumps/rump.svg?style=flat-square)
![Peer Dependencies](http://img.shields.io/david/peer/rumps/rump.svg?style=flat-square)


## About
Rump and its related modules together make a semi-opinionated workflow for
assembling client-side assets, leveraging [Gulp](http://gulpjs.com/) tasks.
Sensible defaults are provided so no configuration is required. Don't like the
defaults? Want to change the folder structure? Configurations can be overriden
with ease. In some instances you can just rewrite options as you want with JS.
Gulp tasks are provided out of the box to easily assemble assets with one
task, or you can use the given tasks and integrate/create your own workflow
instead.


## Examples
If you are not interested in reading and just want to explore, check out the
[examples repository](https://github.com/rumps/examples) for some boilerplate
examples.


## Getting Started
You can easily start by creating a `gulpfile.js` file with the following:

```js
require('rump').autoload().addGulpTasks();
```

This will load all other Rump modules defined in `package.json` and add tasks
to Gulp. If you want to overwrite some configurations:

```js
require('rump').autoload().addGulpTasks().configure({
  ...
});
```

If you don't want to load all modules and prefer loading your own manually:

```js
// Load modules first before calling addGulpTasks or call addGulpTasks again
require('rump-scripts');
require('rump-styles');
require('rump').addGulpTasks();
```


## API

### `rump.autoload()`
Load all Rump modules (modules whose names start with `rump-`) that are defined
in `package.json`. If the module is not available (such as a module in
`devDependencies` that was not installed because of `npm install --production`)
then no error is raised and is skipped.

### `rump.addGulpTasks()`
Add all tasks from Rump modules to Gulp. If you load other Rump modules after
calling this, you need to call this again. Read the documentation for each Rump
module to see which tasks are defined. For information on source and
destination, see `rump.configure()` below. The following tasks are included:
- `rump:build` will build all assets once from source to destination. Rump
  modules will add to this task. (scripts, styles, etc.)
- `rump:watch` will build all assets once from source to destination, then
  monitor for changes and update destination as needed. Rump modules will add
  to this task. (scripts, styles, etc.)
- `rump:watch:setup` is used to set up for tasks that build continuously, such as
  `rump:watch` and `rump:test:watch`. This is typically used internally and has no
  effect by itself.
- `rump:clean` will clean the contents of destination. This is invoked when
  running the build or watch task. The destination should be considered
  volatile since files on source may be removed.
- `rump:info` will display information on this and other Rump modules in a
  readable format.
- `rump:info:core` will display information on the core module, including the
  current environment set.
- `rump:test` will run all tests once. Rump modules will add to this task.
  (scripts, etc.)
- `rump:test:watch` will run tests continuously, useful for things like TDD.
  Rump modules will add to this task. (scripts, etc.)

### `rump.configure(options)`
Redefine options for Rump and Rump modules to follow. Read the documentation
each Rump module to see what options are available. The following options are
available alongside default values:

#### `options.environment` (`process.env.NODE_ENV` or `'development'`)
This is used by Rump modules to distinguish what kind of build to make.
Currently only two values are supported: (using another value is NOT
recommended)
- `development` typically does not optimize items and includes useful items
  such as source maps and more. This is likely something you do not want to be
  using in production.
- `production` focuses on minifications and optimizations for production level
  builds.

#### `options.paths.source.root` (`'src'`)
This is the base directory where source code and items are housed for asset
builds. Rump modules will typically reference files/directories relative to
this path for builds. You can specify an absolute path, use the current
directory, (`''`) or other relative paths. (`'../../source'`)

#### `options.paths.destination.root` (`'dist'`)
This is the base directory where assets will be built to. This should be
considered a volatile directory as it is subject to cleaning on rebuilds. Rump
modules will typically reference files/directories relative to this path for
builds. You can specify an absolute path or other relative paths.
(`'../../build'`)

#### `options.globs.global` (`[]`)
These are globs that are to be applied to all Rump modules as an array of
strings. This is useful if you want to ignore certain files or directories. For
example, to ignore files in a directory named `prototype`:
`['!**/prototype{,**/*}']` Use this carefully as too many items will slow down
builds.

### `rump.configs`
This will contain references to configurations that are generated either by
default or from `rump.configure`. Read the documentation for each Rump module
to see additional items added to this object. The following options are
included.

#### `rump.configs.main`
This contains options with defaults or what has been changed through
`rump.configure()`. This is used by other Rump modules and typically does not
need to be modified. (except by Rump modules) If you want to modify just use
`rump.configure()` instead.
