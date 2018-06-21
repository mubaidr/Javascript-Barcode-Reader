# Javascript-Barcode-Reader

A Barcode scanner capapable of reading Code128, Code93, Code39, Standard/Industrial 2 of 5, Interleaved 2 of 5, Codabar and EAN-13 barcodes in javascript.

## Available decoders

<ul>
<li><input type="checkbox" disabled checked> EAN-13</li>
<li><input type="checkbox" disabled checked> Code 39</li>
</ul>
<ul>Work in progress...
<li><input type="checkbox" disabled> Code 93</li>
<li><input type="checkbox" disabled> Code 128</li>
<li><input type="checkbox" disabled> Code 2 of 5</li>
<li><input type="checkbox" disabled> Codabar.</li>
</ul>

## Install

```bash
npm install javascript-barcode-reader
```

## How to use

```js
import { barcodeDecoder } from 'javascript-barcode-reader'

const code = barcodeDecoder(
  '#imageID' /* Image ID || Image || Canvas || Canvas ImageData */,
  { barcode: 'code-39' }
)
```
