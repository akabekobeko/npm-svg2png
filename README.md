# svg2png

[![npm version](https://badge.fury.io/js/.svg)](https://badge.fury.io/js/@akabeko/svg2png)
[![Build Status](https://travis-ci.org/akabekobeko/npm-svg2png.svg?branch=master)](https://travis-ci.org/akabekobeko/npm-svg2png)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue)](https://github.com/akabekobeko/npm-svg2png/blob/master/LICENSE)

Create PNG file from SVG file with [puppeteer-core](https://www.npmjs.com/package/puppeteer-core). Use the specified revision or installed Chromium for PNG file creation.

## Installation

```
$ npm install @akabeko/svg2png
```

## Node.js API

### `svg2png(options: SVG2PNGOptions): Promise<string[]>`

Create the PNG file from the SVG file.

- **options**: `SVG2PNGOptions` Options.
  - **input**: `String` Path of the input SVG file.
  - **output**: `String` Path of the output PNG file.
  - **sizes**: `Size[]` Sizes of the output PNG files.
    - **width**: `Number` Width (px).
    - **height**: `Number` Height (px).
  - **executablePath**: `String (Optional)` If use Chromium installed, specify the path of the executable file. If this is specified, `fetcher` will be ignored.
  - **fetcher**: `Object` Information for downloading and using Chromium.
    - **revision**: `String` Revision of the download Chromium. see: http://omahaproxy.appspot.com/
    - **path**: `String` Path of the directory to download. If not specified, it will be selected in the puppeteer-core directory of `node_moduels`.

**Returns**: `Promise<string[]>` Path collection of the output PNG files.

If there is a single `sizes` element, it will be output with the file name specified in `output`.

When multiple sizes are specified, the size is specified in prefix like `sample-256.png`. If there are multiple sizes and the width and heigth are different, it becomes like `sample-24x32.png`.

```js
import { svg2png } from '@akabeko/svg2png'

// Fetch Chromium
svg2png({
  input: './sample.svg',
  output: './sample.png',
  sizes: [{ width: 256, height: 256 }],
  fetcher: {
    revision: '782078',
    path: './renderer'
  }
})
  .then((results) => {
    console.log(results)
    console.log('Completed!!!')
  })
  .catch((err) => {
    console.log(err)
  })

// Use installed Chrome (Chromium) on macOS and multiple sizes
svg2png({
  input: './sample.svg',
  output: './sample.png',
  sizes: [
    { width: 256, height: 256 },
    { width: 48, height: 64 }
  ],
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
})
  .then((results) => {
    console.log(results)
    console.log('Completed!!!')
  })
  .catch((err) => {
    console.log(err)
  })
```

## CLI

```
Usage:  svg2png [options]

Create PNG file from SVG file with puppeteer-core. Use the specified revision or installed Chromium for PNG file creation.

Options:
  -i, --input <String>         Path of the input SVG file. (default: "")
  -o, --output <String>        Path of the output PNG file. (default: "")
  --sizes <Size[]>             Sizes array of the output PNG file. Specify one element for the array if it is a square, and specify [width,height]
                               for a rectangle. e.g. [256,[256,128],...]
  --executable-path <String>   If use Chromium installed, specify the path of the executable file. If this is specified, `--fetcher-*` will be
                               ignored. (default: "")
  --fetcher-revision <String>  Revision of the download Chromium. see: http://omahaproxy.appspot.com/ (default: "")
  --fetcher-path <String>      Path of the directory to download. If not specified, it will be selected in the puppeteer-core directory of
                               `node_moduels`. (default: "")
  -v, --version                output the version number
  -h, --help                   display help for command

Examples:
  $ svg2png -i sample.svg -o sample.png --sizes [256] --executable-path "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  $ svg2png -i sample.svg -o sample.png --sizes [[24,32],256] --executable-path "C:\Program Files (x86)\Google\Chrome\Application\Chrome.exe"
  $ svg2png -i sample.svg -o sample.png --sizes [256] --fetcher-revision 782078 --fetcher-path ./renderer

See also:
  https://github.com/akabekobeko/npm-svg2png
```
