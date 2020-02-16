import * as codabar from './codabar'
import { combineAllPossible } from './utilities/combineAllPossible'
import { getImageDataFromSource } from './utilities/getImageDataFromSource'
import { getLines } from './utilities/getLines'
import { applyAdaptiveThreshold } from './utilities/threshold/adaptiveThreshold'
import { applySimpleThreshold } from './utilities/threshold/applySimpleThreshold'

export enum BARCODE_DECODERS {
  'code-128' = 'code-128',
  'code-2of5' = 'code-2of5',
  'code-39' = 'code-39',
  'code-93' = 'code-93',
  'ean-13' = 'ean-13',
  'ean-8' = 'ean-8',
  'codabar' = 'codabar'
}

type JavascriptBarcodeReader = {
  image: string | HTMLImageElement | HTMLCanvasElement | ImageData
  barcode: string | BARCODE_DECODERS
  options?: {
    type?: string
    useAdaptiveThreshold?: boolean
    singlePass?: boolean
  }
}

interface DecoderFunction {
  (lines: number[], type?: string): string
}

export async function javascriptBarcodeReader({
  image,
  barcode,
  options
}: JavascriptBarcodeReader): Promise<string> {
  let decoder: DecoderFunction

  switch (barcode) {
    case BARCODE_DECODERS.codabar:
      decoder = codabar.decoder
      break
    case BARCODE_DECODERS['code-128']:
      decoder = codabar.decoder
      break
    case BARCODE_DECODERS['code-2of5']:
      decoder = codabar.decoder
      break
    case BARCODE_DECODERS['code-39']:
      decoder = codabar.decoder
      break
    case BARCODE_DECODERS['code-93']:
      decoder = codabar.decoder
      break
    case BARCODE_DECODERS['ean-13']:
      decoder = codabar.decoder
      break
    case BARCODE_DECODERS['ean-8']:
      decoder = codabar.decoder
      break
    default:
      throw new Error(`Invalid barcode specified. Available decoders: ${BARCODE_DECODERS}.`)
      break
  }

  const useSinglePass = (options && options.singlePass) || false
  const imageData = image instanceof ImageData ? image : await getImageDataFromSource(image)
  const width = imageData.width
  const height = imageData.height
  let data = imageData.data
  const channels = data.length / (width * height)
  let finalResult = ''

  // apply adaptive threshold
  if (options && options.useAdaptiveThreshold) {
    data = applyAdaptiveThreshold(data, width, height)
  }

  // check points for barcode location
  const sPoints = [5, 6, 4, 7, 3, 8, 2, 9, 1]
  const slineStep = Math.round(height / sPoints.length)
  const rowsToScan = Math.min(3, height)

  for (let i = 0; i < sPoints.length; i += 1) {
    const sPoint = sPoints[i]
    const start = channels * width * Math.floor(slineStep * sPoint)
    const end = start + rowsToScan * channels * width
    let dataSlice = data.slice(start, end)

    if (!options || !options.useAdaptiveThreshold) {
      dataSlice = applySimpleThreshold(dataSlice, width, height)
    }

    const lines = getLines(dataSlice, width, rowsToScan)

    if (lines.length === 0) {
      if (useSinglePass) throw new Error('Failed to extract barcode!')
      continue
    }

    // Run the decoder
    const result = decoder(lines, options && options.type)

    if (!result) continue
    if (useSinglePass) return result
    if (!result.includes('?')) return result

    finalResult = combineAllPossible(finalResult, result)

    if (!finalResult.includes('?')) return finalResult
    if (i === sPoints.length - 1) return finalResult
  }

  throw new Error('Failed to extract barcode!')
}
