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

function combineAllPossible(results) {
  const finalResult = []
  let maxLength = 0

  results
    .sort((a, b) => {
      return b.length - a.length
    })
    .forEach(result => {
      const length = result.length

      // continue if new result is larger in size, most probable
      if (maxLength === 0 || length === maxLength) {
        maxLength = length

        // update finalResult if char is feasible
        result.split('').forEach((char, index) => {
          if (!finalResult[index]) {
            finalResult[index] = char === '?' ? '?' : char
          }
        })
      }
    })

  return finalResult.join('')
}

/**
 * Scans and returns barcode from the provided image
 *
 * @param {HTMLImageElement | HTMLCanvasElement | ImageData | Object | String} image Image element || Canvas || ImageData || Image Path in Node.js
 * @param {Object} options Options defining type of barcode to detect
 * @param {String} options.barcode Barcode name
 * @param {String=} options.type Type of Barcode
 * @param {Boolean=} options.fast Perform only single attemp to extract code
 * @param {Boolean=} options.useAdaptiveThreshold Use adaptive threshold (default: OTSU Threshold method)
 * @returns {Promise<String>} Extracted barcode string
 */
async function javascriptBarcodeReader(image, options) {
  // store intermediary results, get final result by replacing ? from available result
  const results = []

  // eslint-disable-next-line
  options.barcode = options.barcode.toLowerCase()
  const list = Object.keys(BARCODE_DECODERS)

  if (list.indexOf(options.barcode) === -1) {
    throw new Error(
      `Invalid barcode specified. Available decoders: ${list}. https://github.com/mubaidr/Javascript-Barcode-Reader#available-decoders`
    )
  }

  let { data, width, height } = await UTILITIES.getImageDataFromSource(image)
  const channels = data.length / (width * height)

  // check points for barcode location
  const sPoints = [5, 6, 4, 7, 3, 8, 2, 9, 1]
  const slineStep = Math.floor(height / sPoints.length)
  //should be odd number to be able to find center
  const rowsToScan = Math.min(2, height)

  if (options.useAdaptiveThreshold) {
    data = UTILITIES.applyAdaptiveThreshold(data, width, height)
  }

  for (let i = 0; i < sPoints.length; i += 1) {
    const sPoint = sPoints[i]
    const start = channels * width * Math.floor(slineStep * sPoint)
    const end = start + rowsToScan * channels * width
    let dataSlice = data.slice(start, end)

    if (!options.useAdaptiveThreshold) {
      dataSlice = UTILITIES.applySimpleThreshold(dataSlice, width, rowsToScan)
    }

    const lines = UTILITIES.getLines(dataSlice, width, rowsToScan)

    if (!lines || lines.length === 0) {
      if (options.fast) throw new Error('Failed to extract barcode!')

      continue
    }

    // Run the decoder
    const result = BARCODE_DECODERS[options.barcode](lines, options.type)

    if (result) {
      if (result.indexOf('?') === -1) {
        return result
      }

      results.push(result)
    }

    if (options.fast) break
  }

  if (results.length === 0) {
    throw new Error('Failed to extract barcode!')
  } else {
    return combineAllPossible(results)
  }
}

module.exports = javascriptBarcodeReader
