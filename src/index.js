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
 * @returns {String} Extracted barcode string
 */
async function barcodeDecoder(image, options) {
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
    const pxLine = data.slice(start, end)
    const sum = []
    let min = 0
    let max = 0

    const padding = { left: true, right: true }

    // grey scale section and sum of columns pixels in section
    for (let row = 0; row < 2; row += 1) {
      for (let col = 0; col < width; col += 1) {
        const i = (row * width + col) * channels
        const g = (pxLine[i] * 3 + pxLine[i + 1] * 4 + pxLine[i + 2] * 2) / 9
        const s = sum[col]

        pxLine[i] = g
        pxLine[i + 1] = g
        pxLine[i + 2] = g

        sum[col] = g + (s || 0)
      }
    }

    for (let i = 0; i < width; i += 1) {
      sum[i] /= 2
      const s = sum[i]

      if (s < min) {
        min = s
      } else {
        max = s
      }
    }

    // matches columns in two rows
    const pivot = min + (max - min) / 2
    const bmp = []

    for (let col = 0; col < width; col += 1) {
      let matches = 0
      let value

      for (let row = 0; row < 2; row += 1) {
        value = pxLine[(row * width + col) * channels]

        if (value > pivot) {
          matches += 1
        }
      }

      if (col === 0 && value <= pivot) padding.left = false
      if (col === width - 1 && value <= pivot) {
        padding.right = false
      }

      bmp.push(matches > 1)
    }

    // matches width of barcode lines
    let curr = bmp[0]
    let count = 1
    const lines = []

    for (let col = 0; col < width; col += 1) {
      if (bmp[col] === curr) {
        count += 1

        if (col === width - 1) {
          lines.push(count)
        }
      } else {
        lines.push(count)
        count = 1
        curr = bmp[col]
      }
    }

    // remove empty whitespaces on side of barcode
    if (padding.left) lines.shift()
    if (padding.right) lines.pop()

    // Run the decoder
    const result = BARCODE_DECODERS[options.barcode](lines, options.type)

    if (result) {
      return result
    }
  }

  return new Error('Failed to extract barcode!')
}

if (module && module.exports) {
  module.exports = barcodeDecoder
} else {
  global.javascriptBarcodeReader = barcodeDecoder
}
