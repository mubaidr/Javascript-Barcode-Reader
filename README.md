# Javascript-Barcode-Reader

A Barcode scanner capapable of reading Code128 (UCC/EAN-128), Code93, Code39, Standard/Industrial 2 of 5, Interleaved 2 of 5, Codabar and EAN-13 barcodes in javascript for Node.js and Browsers.

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/adf93fc22bd3479da66f3d4c74a0b95f)](https://app.codacy.com/app/mubaidr/Javascript-Barcode-Reader?utm_source=github.com&utm_medium=referral&utm_content=mubaidr/Javascript-Barcode-Reader&utm_campaign=Badge_Grade_Dashboard)

[![codecov](https://codecov.io/gh/mubaidr/Javascript-Barcode-Reader/branch/master/graph/badge.svg)](https://codecov.io/gh/mubaidr/Javascript-Barcode-Reader)

[![Build Status](https://travis-ci.org/mubaidr/Javascript-Barcode-Reader.svg?branch=master)](https://travis-ci.org/mubaidr/Javascript-Barcode-Reader)

<br>

[![NPM](https://nodei.co/npm/javascript-barcode-reader.png?compact=true)](https://nodei.co/npm/javascript-barcode-reader/)

<a href="https://patreon.com/mubaidr">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" height="45">
</a>

## Demo

http://mubaidr.js.org/Javascript-Barcode-Reader/

## Available decoders

<ul>
<li><input type="checkbox" disabled checked> EAN-13</li>
<li><input type="checkbox" disabled checked> EAN-8</li>
<li><input type="checkbox" disabled checked> Code 39</li>
<li><input type="checkbox" disabled checked> Code 93</li>
<li><input type="checkbox" disabled checked> Code 2 of 5 (Industrial & Interleaved)</li>
<li><input type="checkbox" disabled checked> Codabar</li>
<li><input type="checkbox" disabled checked> Code 128 (UCC/EAN-128)</li>
</ul>

## Install

Recommended way to install is by using package manager (npm, yarn etc):

```bash
npm install javascript-barcode-reader
```

or use cdn:

```html
<script src="//unpkg.com/javascript-barcode-reader/dist/javascript-barcode-reader.min.js"></script>
```

or download manually:

[javascript-barcode-reader.js](https://unpkg.com/javascript-barcode-reader/dist/javascript-barcode-reader.min.js)

## How to use

### Node.js

```js
const javascriptBarcodeReader = require('javascript-barcode-reader')
```

#### Using promise

```js
javascriptBarcodeReader(
  Image /* Image file Path || {data: pixelArray, width, height} || HTML5 Canvas ImageData */,
  {
    barcode: 'code-2of5',
    type: 'industrial', //optional type
  }
)
  .then(code => {
    console.log(code)
  })
  .catch(err => {
    console.log(err)
  })
```

#### Using await

```js
try {
  const code = await javascriptBarcodeReader(
    Image /* Image file Path || {data: pixelArray, width, height} || HTML5 Canvas ImageData */,
    {
      barcode: 'code-2of5',
      type: 'industrial', //optional type
    }
  )
} catch (err) {
  console.log(err)
}
```

### Browser

`javascriptBarcodeReader` will be available as global in Browsers.

### Using promise

```js
javascriptBarcodeReader(
  Image /* Image ID || HTML5 Image || HTML5 Canvas || HTML5 Canvas ImageData || Image URL */,
  {
    barcode: 'code-2of5',
    type: 'industrial', //optional type
  }
)
  .then(code => {
    console.log(code)
  })
  .catch(err => {
    console.log(err)
  })
```

#### Using await

```js
try {
  const code = await javascriptBarcodeReader(
    Image /* Image ID || HTML5 Image || HTML5 Canvas || HTML5 Canvas ImageData || Image URL */,
    {
      barcode: 'code-2of5',
      type: 'industrial', //optional type
    }
  )
} catch (err) {
  console.log(err)
}
```

## Tips

- Make sure the barcode image is the only thing in the image. Otherwise this script will most probably fail.

## Known Issues

This script does not implement logic to locate/rotate barcode in the given image.

## Contributing

All the modules are contianed in `src` directory. If you implement a new module or update an existing one, then make sure to add/run tests by running:

```bash
npm test
```

Tests are defined in the `__tests__` directory using `Jest`.

There is no need to run build script before creating pull request.

## Licence

MIT License

Copyright (c) 2018 Muhammad Ubaid Raza

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
