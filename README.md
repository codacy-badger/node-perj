# perj

A simple, fast JSON logger. (Not Published Yet)

[![Maintainability](https://api.codeclimate.com/v1/badges/14946690a2410b71177e/maintainability)](https://codeclimate.com/github/grantcarthew/node-perj/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/14946690a2410b71177e/test_coverage)](https://codeclimate.com/github/grantcarthew/node-perj/test_coverage)
[![Build Status][travisci-image]][travisci-url]
[![js-standard-style][js-standard-image]][js-standard-url]
[![NSP Status][nsp-image]][nsp-url]
[![Patreon Donation][patreon-image]][patreon-url]

[![NPM][nodei-npm-image]][nodei-npm-url]


## Installing

* Node: v4.7.0 or later.
* Browser: Not tested

```sh

npm install --save perj

```
## Goals

The perj logger project has the following goals:

* Designed to be integrated rather than used out of the box (DIY).
* KISS: Keep it simple smiley.
* Cross platform (Node.js and Browser) with no platform dependencies.
* Flexible log and additional property options.
* Fast.
* Feature limited.

## Features

* No dependencies.
* Flexible log methods:
  * Log items can be any number in any order of any type.
* Messages are nested as a string or array of strings.
* Objects are nested as an object or array of objects.
* No transports included (see primary goal).

## Quick Start

### Node.js Usage

The following example adds a `name`, `host`, `pid` and `file` top level property to the log entries.

```js

const perj = require('perj')

// Customise the variables below as needed.
const name = 'QuickStart'
const host = require('os').hostname()
const pid = process.pid
const file = require('path').basename(module.filename)

const log = perj.create({name, host, pid, file})

log.info('the quick brown fox jumps over the lazy dog')

```

### Browser Usage

__Total size is 2.8kB minified index file.__

The following example adds a `host` top level property to the log entries.

```js

const perj = require('perj')

// Customise the variables below as needed.
const name = 'QuickStart'
const host = location.hostname

const log = perj.create({name, host})

log.info('the quick brown fox jumps over the lazy dog')

```


## Rational

After having some performance issues with a popular Node.js logging package I decided to switch to another logging package that is advertised as blasing fast called [pino][pino-url].

I must say `pino` seems like a great package. I worked with it for a while however there are a number of things which I dislike about `pino`. I started to try and contribute to fix some of the issues. The authors were helpful. After working on a pull request and submitting it I changed my mind and decided to write `perj`.

Why the name `perj`? Mostly becasue the name `perj` was already taking on NPM.

## Function



## API

### perj.create(options)

The create method returns a new logger object with the options applied.

#### options

A plain object with logger options and top level properties.

Current supported options include:

| Name   | Type   | Default        |
|--------|--------|----------------|
| stream | Object | process.stdout |
| level  | string | 'info'         |

__stream:__ Can be set to any writable stream object that has a `write` function.

__level:__ Set to one of the below values. Once set only log entries of the same or less noisy levels will be logged. If you set the level to `warn` you will only get `fatal`, `error`, and `warn` log entries.

| level   | lvl | When to Use                                         |
|---------|-----|-----------------------------------------------------|
| `fatal` | 60  | Stop errors. Process crash.                         |
| `error` | 50  | Processing failed for a known or unknown reason.    |
| `warn`  | 40  | Something went wrong however it is not critical.    |
| `info`  | 30  | Hey Dad? I dug a hole! (see The Castle).            |
| `debug` | 20  | When you need to find out where something happened. |
| `trace` | 10  | When you need to know everything that happens.      |


#### perj.create Example

As with the quick start above, the following example adds a `name`, `host`, `pid`, and `file` as top level properties to the log entries. These properties do not exist by default because that would require `perj` to import the `os` Node.js module. Node.js modules are not imported to ease the use of `perj` on either Node.js or in the Browser.

```js

const perj = require('perj')

// Customise the variables below as needed.
const name = 'QuickStart'
const host = require('os').hostname()
const pid = process.pid
const file = require('path').basename(module.filename)

// Because the valid options `level` and `stream` are not supplied they are set to the defaults.
const log = perj.create({name, host, pid, file})

log.info('the quick brown fox jumps over the lazy dog')

// The following will be sent to the process standard out
// {"ver":"1","level":"info","lvl":30,"name":"QuickStart","host":"Dev","pid":"5009","file":"example.js","time":1524902250052,"msg":"the quick brown fox jumps over the lazy dog","data":""}

```

## About the Owner

I, Grant Carthew, am a technologist, trainer, and Dad from Queensland, Australia. I work on code in a number of personal projects and when the need arises I build my own packages.

This project exists because I was not happy with other logging packages.

Everything I do in open source is done in my own time and as a contribution to the open source community.

If you are using my projects and would like to thank me or support me, please click the Patreon link below.

[![Patreon Donation][patreon-image]][patreon-url]

See my [other projects on NPM](https://www.npmjs.com/~grantcarthew).

## Contributing

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request :D

## Change Log

- v1.0.0 [20##-##-##]: Initial release. 

[travisci-image]: https://travis-ci.org/grantcarthew/node-perj.svg?branch=master
[travisci-url]: https://travis-ci.org/grantcarthew/node-perj
[js-standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[js-standard-url]: http://standardjs.com/
[nsp-image]: https://nodesecurity.io/orgs/openjs/projects/node-perj/badge
[nsp-url]: https://nodesecurity.io/orgs/openjs/projects/node-perj
[patreon-image]: https://img.shields.io/badge/patreon-donate-yellow.svg
[patreon-url]: https://www.patreon.com/grantcarthew
[nodei-npm-image]: https://nodei.co/npm/node-perj.png?downloads=true&downloadRank=true&stars=true
[nodei-npm-url]: https://nodei.co/npm/node-perj/
[pino-url]: https://www.npmjs.com/package/pino
