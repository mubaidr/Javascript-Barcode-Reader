# Javascript-Barcode-Reader

A Barcode scanner capapable of reading Code128 (UCC/EAN-128), Code93, Code39, Standard/Industrial 2 of 5, Interleaved 2 of 5, Codabar and EAN-13 barcodes in javascript for Node.js and Browsers.

<a href="https://patreon.com/mubaidr">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" height="42">
</a>

[![NPM](https://nodei.co/npm/javascript-barcode-reader.png?compact=true)](https://nodei.co/npm/javascript-barcode-reader/)

[![Build Status](https://travis-ci.org/mubaidr/Javascript-Barcode-Reader.svg?branch=master)](https://travis-ci.org/mubaidr/Javascript-Barcode-Reader)

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

//using promise
javascriptBarcodeReader(
  Image /* Image file Path || {data: pixelArray, width, height} || HTML5 Canvas ImageData */,
  {
    barcode: 'code-2of5',
    type: 'industrial', //optional type
  }
).then(code => {
  console.log(code)
})

// using await
const code = await javascriptBarcodeReader(
  Image /* Image file Path || {data: pixelArray, width, height} || HTML5 Canvas ImageData */,
  {
    barcode: 'code-2of5',
    type: 'industrial', //optional type
  }
)
```

### Browser

`javascriptBarcodeReader` will be available as global in Browsers.

```js
//using promise
javascriptBarcodeReader(
  Image /* Image ID || HTML5 Image || HTML5 Canvas || HTML5 Canvas ImageData || Image URL */,
  {
    barcode: 'code-2of5',
    type: 'industrial', //optional type
  }
).then(code => {
  console.log(code)
})

// using await
const code = await javascriptBarcodeReader(
  Image /* Image ID || HTML5 Image || HTML5 Canvas || HTML5 Canvas ImageData || Image URL */,
  {
    barcode: 'code-2of5',
    type: 'industrial', //optional type
  }
)
```
