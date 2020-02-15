import { combineAllPossible } from './utilities/combineAllPossible'
import { getImageDataFromSource } from './utilities/getImageDataFromSource'
import { getLines } from './utilities/getLines'
import { applyAdaptiveThreshold } from './utilities/threshold/adaptiveThreshold'
import { applySimpleThreshold } from './utilities/threshold/applySimpleThreshold'

const BARCODE_DECODERS: {
  [key: string]: Function
} = {
  'code-128': require('./code-128'),
  'code-2of5': require('./2of5'),
  'code-39': require('./code-39'),
  'code-93': require('./code-93'),
  'ean-13': require('./ean-13'),
  'ean-8': require('./ean-8'),
  codabar: require('./codabar')
}

export async function javascriptBarcodeReader(
  image: string | HTMLImageElement | HTMLCanvasElement | ImageData,
  options: { barcode: string; type?: any; useAdaptiveThreshold?: any; singlePass?: any }
): Promise<string> {
  // store intermediary results, get final result by replacing ? from available result
  let finalResult = ''
  const barcode = options.barcode.toLowerCase()
  const type = (options.type || '').toLowerCase()

  const list = Object.keys(BARCODE_DECODERS)

  if (!list.includes(barcode)) {
    throw new Error(
      `Invalid barcode specified. Available decoders: ${list}. https://github.com/mubaidr/Javascript-Barcode-Reader#available-decoders`
    )
  }

  const imageData = await getImageDataFromSource(image)
  let data = imageData.data
  const width = imageData.width
  const height = imageData.height

  const channels = data.length / (width * height)

  // apply adaptive threshold
  if (options.useAdaptiveThreshold) {
    data = applyAdaptiveThreshold(data, width, height)
  }

  // check points for barcode location
  const sPoints = [5, 6, 4, 7, 3, 8, 2, 9, 1]
  const slineStep = Math.round(height / sPoints.length)
  //should be odd number to be able to find center
  const rowsToScan = Math.min(3, height)

  for (let i = 0; i < sPoints.length; i += 1) {
    const sPoint = sPoints[i]
    const start = channels * width * Math.floor(slineStep * sPoint)
    const end = start + rowsToScan * channels * width
    let dataSlice = data.slice(start, end)

    if (!options.useAdaptiveThreshold) {
      dataSlice = applySimpleThreshold(dataSlice, width, rowsToScan)
    }

    const lines = getLines(dataSlice, width, rowsToScan)

    if (!lines || lines.length === 0) {
      if (options.singlePass) throw new Error('Failed to extract barcode!')

      continue
    }

    // Run the decoder
    const result = BARCODE_DECODERS[barcode](lines, type)

    if (!result) continue
    if (result.indexOf('?') === -1) return result
    if (options.singlePass) return result

    if (finalResult === '') {
      finalResult = result
    } else {
      finalResult = combineAllPossible(finalResult, result)

      if (!finalResult.includes('?')) return finalResult
    }

    if (i === sPoints.length - 1) return finalResult
  }

  throw new Error('Failed to extract barcode!')
}
