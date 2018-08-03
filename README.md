# Javascript-Barcode-Reader

A Barcode scanner capapable of reading Code128, Code93, Code39, Standard/Industrial 2 of 5, Interleaved 2 of 5, Codabar and EAN-13 barcodes in javascript.

<a href="https://patreon.com/mubaidr">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" height="42">
</a>

[![NPM](https://nodei.co/npm/javascript-barcode-reader.png?compact=true)](https://nodei.co/npm/javascript-barcode-reader/)

![dependencies](https://david-dm.org/mubaidr/javascript-barcode-reader.svg)

## Demo

http://mubaidr.js.org/Javascript-Barcode-Reader/

## Available decoders

<ul>
<li><input type="checkbox" disabled checked> EAN-13</li>
<li><input type="checkbox" disabled checked> EAN-8</li>
<li><input type="checkbox" disabled checked> Code 39</li>
<li><input type="checkbox" disabled checked> Code 93</li>
</ul>
<ul>Work in progress...
<li><input type="checkbox" disabled> Code 128</li>
<li><input type="checkbox" disabled> Code 2 of 5</li>
<li><input type="checkbox" disabled> Codabar.</li>
</ul>

## Install

```bash
npm install javascript-barcode-reader
```

or use cdn:

[https://unpkg.com/javascript-barcode-reader/dist/javascript-barcode-reader.js](https://unpkg.com/javascript-barcode-reader/dist/javascript-barcode-reader.js)

## How to use

```js
// Node
const javascriptBarcodeReader = require('javascript-barcode-reader')

const code = javascriptBarcodeReader(
  '#imageID' /* Image ID || Image || Canvas || Canvas ImageData */,
  { barcode: 'code-39' }
)

// Browser
// Include link to script file from cdn
// or Downlaod & use manualy from `dist` folder

const code = javascriptBarcodeReader(
  '#imageID' /* Image ID || Image || Canvas || Canvas ImageData */,
  { barcode: 'code-39' }
)
```
