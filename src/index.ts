// available decoders
import * as codabar from './codabar'
import * as code128 from './code-128'
import * as code39 from './code-39'
import * as code93 from './code-93'
import * as code2of5 from './code2of5'
import * as ean from './ean'
import { applyAdaptiveThreshold } from './utilities/adaptiveThreshold'
import { BARCODE_DECODERS } from './utilities/BARCODE_DECODERS'
import { combineAllPossible } from './utilities/combineAllPossible'
import { getImageDataFromSource } from './utilities/getImageDataFromSource'
import { getLines } from './utilities/getLines'
import { ImageDataLike } from './utilities/ImageDataLike'

// detect test env
let isTestEnv: boolean
try {
  if (process && process.env.NODE_ENV === 'test') {
    isTestEnv = true
  }
} catch {
  isTestEnv = false
}

function isImageLike(object: any): object is ImageDataLike {
  return object.data && object.width && object.height
}

type JavascriptBarcodeReader = {
  image: string | HTMLImageElement | HTMLCanvasElement | ImageDataLike
  barcode: string | BARCODE_DECODERS
  barcodeType?: string
  options?: {
    useAdaptiveThreshold?: boolean
    singlePass?: boolean
  }
}

interface DecoderFunction {
  (lines: number[], type?: string): string
}

export default async function javascriptBarcodeReader({
  image,
  barcode,
  barcodeType,
  options,
}: JavascriptBarcodeReader): Promise<string> {
  let decoder: DecoderFunction

  switch (barcode) {
    case BARCODE_DECODERS.codabar:
      decoder = codabar.decoder
      break
    case BARCODE_DECODERS['code-128']:
      decoder = code128.decoder
      break
    case BARCODE_DECODERS['code-39']:
      decoder = code39.decoder
      break
    case BARCODE_DECODERS['code-93']:
      decoder = code93.decoder
      break
    case BARCODE_DECODERS['code-2of5']:
      decoder = code2of5.decoder
      break
    case BARCODE_DECODERS['ean-13']:
      decoder = ean.decoder
      barcodeType = '13'
      break
    case BARCODE_DECODERS['ean-8']:
      decoder = ean.decoder
      barcodeType = '8'
      break
    default:
      throw new Error(`Invalid barcode specified. Available decoders: ${BARCODE_DECODERS}.`)
  }

  const useSinglePass = isTestEnv || (options && options.singlePass) || false
  const { data, width, height } = isImageLike(image) ? image : await getImageDataFromSource(image)
  const channels = data.length / (width * height)
  let finalResult = ''

  // apply adaptive threshold
  if (options && options.useAdaptiveThreshold) {
    applyAdaptiveThreshold(data, width, height)
  }

  // check points for barcode location
  const searchPoints = [5, 6, 4, 7, 3, 8, 2, 9, 1]
  const searchLineStep = Math.round(height / searchPoints.length)
  const rowsToScan = Math.min(2, height)

  for (let i = 0; i < searchPoints.length; i += 1) {
    const start = channels * width * Math.floor(searchLineStep * searchPoints[i])
    const end = start + rowsToScan * channels * width
    const lines = getLines(data.slice(start, end), width, rowsToScan)

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

    finalResult = combineAllPossible(finalResult, result)
    if (!finalResult.includes('?')) return finalResult
  }

  return finalResult
}
