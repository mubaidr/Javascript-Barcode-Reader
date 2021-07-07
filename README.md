# Javascript-Barcode-Reader

Simple & Fast Barcode decoder for Browsers and Node.js capapable of reading Code128 (UCC/EAN-128), Code93, Code39, Standard/Industrial 2 of 5, Interleaved 2 of 5, Codabar and EAN-13 barcodes.

[![Build Status](https://travis-ci.org/mubaidr/Javascript-Barcode-Reader.svg?branch=master)](https://travis-ci.org/mubaidr/Javascript-Barcode-Reader)
[![codebeat badge](https://codebeat.co/badges/8f27170b-909e-489f-ae93-459664c47422)](https://codebeat.co/projects/github-com-mubaidr-javascript-barcode-reader-master)
[![codecov](https://codecov.io/gh/mubaidr/Javascript-Barcode-Reader/branch/master/graph/badge.svg)](https://codecov.io/gh/mubaidr/Javascript-Barcode-Reader)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)
[![Rate on Openbase](https://badges.openbase.com/js/rating/javascript-barcode-reader.svg)](https://openbase.com/js/javascript-barcode-reader?utm_source=embedded&utm_medium=badge&utm_campaign=rate-badge)

[![NPM](https://nodei.co/npm/javascript-barcode-reader.png)](https://nodei.co/npm/javascript-barcode-reader/)

<a href="https://patreon.com/mubaidr">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" height="45">
</a>

## Try now

https://codesandbox.io/s/javascript-barcode-reader-liium

## Available decoders

- EAN-13
- EAN-8
- Code-39
- Code-93
- Code-2of5
  - standard
  - Interleaved
- Codabar
- Code-128 (UCC/EAN-128)

## How to use

### Install

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

### Node.js

```ts
import javascriptBarcodeReader from 'javascript-barcode-reader'

javascriptBarcodeReader({
  /* Image file Path || {data: Uint8ClampedArray, width, height} || HTML5 Canvas ImageData */
  image: source,
  barcode: 'code-2of5',
  // barcodeType: 'industrial',
  options: {    
    // useAdaptiveThreshold: true // for images with sahded portions
    // singlePass: true
  }
})
  .then(code => {
    console.log(code)
  })
  .catch(err => {
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
  // barcodeType: 'industrial',
  options: {
    // useAdaptiveThreshold: true // for images with sahded portions
    // singlePass: true
  }
})
  .then(code => {
    console.log(code)
  })
  .catch(err => {
    console.log(err)
  })
```

## Note

- This script does not implement logic to locate/rotate barcode in the given image.
- Make sure the barcode image is the only thing in the image. Otherwise this script will most probably fail.

## Contributing

- Each decoder is defined in `src` directory as a module.
- Tests are defined in the `tests` directory using `Jest`.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://github.com/nitescuc"><img src="https://avatars0.githubusercontent.com/u/1108077?v=4" width="100px;" alt="Cristian Nitescu"/><br /><sub><b>Cristian Nitescu</b></sub></a><br /><a href="https://github.com/mubaidr/Javascript-Barcode-Reader/commits?author=nitescuc" title="Code">💻</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
