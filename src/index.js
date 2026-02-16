'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.default = javascriptBarcodeReader
// available decoders
const codabar = require('./codabar')
const code128 = require('./code-128')
const code39 = require('./code-39')
const code93 = require('./code-93')
const code2of5 = require('./code2of5')
const ean = require('./ean')
const msi = require('./msi')
const pharmacode = require('./pharmacode')
const adaptiveThreshold_1 = require('./utilities/adaptiveThreshold')
const BARCODE_DECODERS_1 = require('./utilities/BARCODE_DECODERS')
const combineAllPossible_1 = require('./utilities/combineAllPossible')
const getImageDataFromSource_1 = require('./utilities/getImageDataFromSource')
const getLines_1 = require('./utilities/getLines')
// detect test env
let isTestEnv
try {
  if (process && process.env.NODE_ENV === 'test') {
    isTestEnv = true
  }
} catch (_a) {
  isTestEnv = false
}
function isImageLike(object) {
  return object.data && object.width && object.height
}
function javascriptBarcodeReader(_a) {
  return __awaiter(this, arguments, void 0, function* ({ image, barcode, barcodeType, options }) {
    let decoder
    switch (barcode) {
      case BARCODE_DECODERS_1.BARCODE_DECODERS.codabar:
        decoder = codabar.decoder
        break
      case BARCODE_DECODERS_1.BARCODE_DECODERS['code-128']:
        decoder = code128.decoder
        break
      case BARCODE_DECODERS_1.BARCODE_DECODERS['code-39']:
        decoder = code39.decoder
        break
      case BARCODE_DECODERS_1.BARCODE_DECODERS['code-93']:
        decoder = code93.decoder
        break
      case BARCODE_DECODERS_1.BARCODE_DECODERS['code-2of5']:
        decoder = code2of5.decoder
        break
      case BARCODE_DECODERS_1.BARCODE_DECODERS['ean-13']:
        decoder = ean.decoder
        barcodeType = '13'
        break
      case BARCODE_DECODERS_1.BARCODE_DECODERS['ean-8']:
        decoder = ean.decoder
        barcodeType = '8'
        break
      case BARCODE_DECODERS_1.BARCODE_DECODERS['upc-a']:
        decoder = ean.decoder
        barcodeType = 'A'
        break
      case BARCODE_DECODERS_1.BARCODE_DECODERS['upc-e']:
        decoder = ean.decoder
        barcodeType = 'E'
        break
      case BARCODE_DECODERS_1.BARCODE_DECODERS.msi:
        decoder = msi.decoder
        break
      case BARCODE_DECODERS_1.BARCODE_DECODERS.pharmacode:
        decoder = pharmacode.decoder
        break
      default:
        throw new Error(
          `Invalid barcode specified. Available decoders: ${Object.values(BARCODE_DECODERS_1.BARCODE_DECODERS).join(', ')}.`
        )
    }
    const useSinglePass = isTestEnv || (options && options.singlePass) || false
    const { data, width, height } = isImageLike(image)
      ? image
      : yield (0, getImageDataFromSource_1.getImageDataFromSource)(image)
    const channels = data.length / (width * height)
    let finalResult = ''
    // apply adaptive threshold
    if (options && options.useAdaptiveThreshold) {
      ;(0, adaptiveThreshold_1.applyAdaptiveThreshold)(data, width, height)
    }
    // check points for barcode location
    const searchPoints = [5, 6, 4, 7, 3, 8, 2, 9, 1]
    const searchLineStep = Math.round(height / searchPoints.length)
    const rowsToScan = Math.min(2, height)
    for (let i = 0; i < searchPoints.length; i += 1) {
      const start = channels * width * Math.floor(searchLineStep * searchPoints[i])
      const end = start + rowsToScan * channels * width
      const lines = (0, getLines_1.getLines)(data.slice(start, end), width, rowsToScan)
      if (lines.length === 0) {
        if (useSinglePass || i === searchPoints.length - 1) {
          throw new Error('Failed to detect lines in the image!')
        }
        continue
      }
      // Run the decoder
      const result = decoder(lines, barcodeType)
      if (!result) continue
      else if (useSinglePass || !result.includes('?')) return result
      finalResult = (0, combineAllPossible_1.combineAllPossible)(finalResult, result)
      if (!finalResult.includes('?')) return finalResult
    }
    return finalResult
  })
}
//# sourceMappingURL=index.js.map
