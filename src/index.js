const UTILITIES = require('./utiltities')

/* eslint-disable */
const BARCODE_DECODERS = {
  'code-128': require('./code-128'),
  'code-2of5': require('./2of5'),
  'code-39': require('./code-39'),
  'code-93': require('./code-93'),
  'ean-13': require('./ean-13'),
  'ean-8': require('./ean-8'),
  codabar: require('./codabar'),
}
/* eslint-enable */

/**
 * Scans and returns barcode from the provided image
 *
 * @param {*} image Image element || Canvas || ImageData || Image Path in Node.js
 * @param {Object} options Options defining type of barcode to detect
 * @param {String} options.barcode Barcode name
 * @param {String=} options.type Type of Barcode
 * @returns {Promise<String>} Extracted barcode string
 */
async function barcodeDecoder(image, options) {
  // eslint-disable-next-line
  options.barcode = options.barcode.toLowerCase()
  const list = Object.keys(BARCODE_DECODERS)

  if (list.indexOf(options.barcode) === -1) {
    throw new Error(
      `Invalid barcode specified. Available decoders: ${list}. https://github.com/mubaidr/Javascript-Barcode-Reader#available-decoders`
    )
  }

  const { data, width, height } = await UTILITIES.getImageDataFromSource(image)
  const channels = data.length / (width * height)

  // check points for barcode location
  const spoints = [1, 9, 2, 8, 3, 7, 4, 6, 5]
  let numLines = spoints.length
  const slineStep = height / (numLines + 1)

  // eslint-disable-next-line
  while ((numLines -= 1)) {
    // create section of height 2
    const start = channels * width * Math.floor(slineStep * spoints[numLines])
    const end =
      channels * width * Math.floor(slineStep * spoints[numLines]) +
      2 * channels * width
    // const pxLine = data.slice(start, end)

    // const { lines, padding } = UTILITIES.getLines({
    const { lines, padding } = UTILITIES.getLines({
      data,
      start,
      end,
      width,
      height,
      channels,
    })

    if (lines && lines.length !== 0) {
      // remove empty whitespaces on side of barcode
      if (padding.left) lines.shift()
      if (padding.right) lines.pop()

      // Run the decoder
      const result = BARCODE_DECODERS[options.barcode](lines, options.type)

      if (result) return result
    }
  }

  throw new Error('Failed to extract barcode!')
}

if (module && module.exports) {
  module.exports = barcodeDecoder
} else {
  global.javascriptBarcodeReader = barcodeDecoder
}
