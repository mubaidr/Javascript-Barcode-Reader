# Javascript-Barcode-Reader

Simple & Fast Barcode decoder for Browsers and Node.js capable of reading multiple barcode formats including Code128 (UCC/EAN-128), Code93, Code39, Standard/Industrial 2 of 5, Interleaved 2 of 5, Codabar, EAN-13, EAN-8, UPC-A, UPC-E, MSI, and Pharmacode.

[![Build Status](https://travis-ci.org/mubaidr/Javascript-Barcode-Reader.svg?branch=master)](https://travis-ci.org/mubaidr/Javascript-Barcode-Reader)
[![codecov](https://codecov.io/gh/mubaidr/Javascript-Barcode-Reader/branch/master/graph/badge.svg)](https://codecov.io/gh/mubaidr/Javascript-Barcode-Reader)
[![npm version](https://img.shields.io/npm/v/javascript-barcode-reader.svg)](https://www.npmjs.com/package/javascript-barcode-reader)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![NPM](https://nodei.co/npm/javascript-barcode-reader.png)](https://nodei.co/npm/javascript-barcode-reader/)

## Try now

https://codesandbox.io/s/javascript-barcode-reader-liium

## Available decoders

- EAN-13
- EAN-8
- UPC-A
- UPC-E
- Code-39
- Code-93
- Code-2of5
  - standard
  - Interleaved
- Codabar
- Code-128 (UCC/EAN-128)
- MSI
- Pharmacode

## Features

- Pure JavaScript/TypeScript implementation
- Works in both Node.js and browser environments
- Supports multiple barcode formats
- Adaptive thresholding for challenging images
- Single-pass mode for faster decoding
- Automatic barcode region detection
- Automatic rotation detection and correction
- TypeScript support

## Installation

Recommended way to install is by using package manager (npm, yarn etc):

```bash
npm i javascript-barcode-reader
```

or use cdn:

```html
<script src="//unpkg.com/javascript-barcode-reader"></script>
```

or download manually:

[javascript-barcode-reader](https://unpkg.com/javascript-barcode-reader)

## Usage

### Node.js

```ts
import javascriptBarcodeReader from 'javascript-barcode-reader'

javascriptBarcodeReader({
  /* Image file Path || {data: Uint8ClampedArray, width, height} || HTML5 Canvas ImageData */
  image: source,
  barcode: 'code-2of5',
  // barcodeType: 'industrial', // for code-2of5: 'industrial' or 'interleaved'
  options: {
    // useAdaptiveThreshold: true // for images with shaded/ gradient portions
    // singlePass: true
    // detectRotation: true // auto-detect and correct rotation
    // locateBarcode: true // auto-locate barcode region
  },
})
  .then((code) => {
    console.log(code)
  })
  .catch((err) => {
    console.log(err)
  })
```

### Browser

`javascriptBarcodeReader` will be available as global in Browsers.

```js
javascriptBarcodeReader({
  /* Image ID || HTML5 Image || HTML5 Canvas || HTML5 Canvas ImageData || Image URL */
  image: source,
  barcode: 'code-2of5',
  // barcodeType: 'industrial', // for code-2of5: 'industrial' or 'interleaved'
  options: {
    // useAdaptiveThreshold: true // for images with shaded/ gradient portions
    // singlePass: true
    // detectRotation: true // auto-detect and correct rotation
    // locateBarcode: true // auto-locate barcode region
  },
})
  .then((code) => {
    console.log(code)
  })
  .catch((err) => {
    console.log(err)
  })
```

### Supported Barcode Types

| Barcode Type | Value          |
| ------------ | -------------- |
| EAN-13       | `'ean-13'`     |
| EAN-8        | `'ean-8'`      |
| UPC-A        | `'upc-a'`      |
| UPC-E        | `'upc-e'`      |
| Code-39      | `'code-39'`    |
| Code-93      | `'code-93'`    |
| Code-2of5    | `'code-2of5'`  |
| Codabar      | `'codabar'`    |
| Code-128     | `'code-128'`   |
| MSI          | `'msi'`        |
| Pharmacode   | `'pharmacode'` |

## Options

- `useAdaptiveThreshold`: Apply adaptive thresholding for images with shading or gradients
- `singlePass`: Use single-pass decoding for faster processing
- `detectRotation`: Automatically detect and correct barcode rotation
- `locateBarcode`: Automatically locate barcode region in image

## Note

- For best results, ensure barcode is relatively straight in the image
- Works best when barcode occupies most of the image

## Contributing

- Each decoder is defined in `src` directory as a module.
- Tests are defined in the `test` directory using `Jest`.

## License

MIT
