const DecoderEAN13 = require('./ean-13')
const DecoderEAN8 = require('./ean-8')
const DecoderCode39 = require('./code-39')
const DecoderCode93 = require('./code-93')

const BARCODE_DECODERS = {
  'code-93': DecoderCode93,
  'code-39': DecoderCode39,
  'ean-13': DecoderEAN13,
  'ean-8': DecoderEAN8,
}

/**
 *
 * @param {*} image Image element || Canvas || ImageData
 * @param {Object} options
 */
const barcodeDecoder = (imageSource, options) => {
  let imageDataInput

  if (typeof imageSource === 'string')
    imageSource = document.getElementById(imageSource)

  let elementType = imageSource.tagName
  if (elementType === 'IMG') {
    const canvas = document.createElement('canvas')
    canvas.width = imageSource.naturalWidth
    canvas.height = imageSource.naturalHeight
    const ctx = canvas.getContext('2d')

    ctx.drawImage(imageSource, 0, 0)

    imageDataInput = ctx.getImageData(
      0,
      0,
      imageSource.naturalWidth,
      imageSource.naturalHeight
    )
  } else if (elementType === 'CANVAS') {
    imageDataInput = imageSource
      .getContext('2d')
      .getImageData(0, 0, imageSource.naturalWidth, imageSource.naturalHeight)
  } else if (imageSource.data) {
    imageDataInput = imageSource
  } else {
    throw new Error('Invalid image source specified!')
  }

  const { data, width, height } = imageDataInput
  imageSource = null
  imageDataInput = null

  // start debug code
  /*
  const canvasTemp = document.createElement('canvas')
  const ctxTemp = canvasTemp.getContext('2d')
  canvasTemp.style.border = '2px solid red'
  canvasTemp.width = width
  canvasTemp.height = height

  let imgData = ctxTemp.createImageData(width, height)
  for (let i = 0; i < imgData.data.length; i += 1) {
    imgData.data[i] = data[i]
  }
  ctxTemp.putImageData(imgData, 0, 0)
  document.body.appendChild(canvasTemp)
  */
  // end debug code

  // check points for barcode location
  const spoints = [1, 9, 2, 8, 3, 7, 4, 6, 5]
  let numLines = spoints.length
  const slineStep = height / (numLines + 1)

  // eslint-disable-next-line
  while ((numLines -= 1)) {
    // create section of height 2
    const start = 4 * width * Math.floor(slineStep * spoints[numLines])
    const end =
      4 * width * Math.floor(slineStep * spoints[numLines]) + 2 * 4 * width
    const pxLine = data.slice(start, end)
    const sum = []
    let min = 0
    let max = 0

    // grey scale section and sum of columns pixels in section
    for (let row = 0; row < 2; row += 1) {
      for (let col = 0; col < width; col += 1) {
        const i = (row * width + col) * 4
        const g = (pxLine[i] * 3 + pxLine[i + 1] * 4 + pxLine[i + 2] * 2) / 9
        const s = sum[col]

        pxLine[i] = g
        pxLine[i + 1] = g
        pxLine[i + 2] = g

        sum[col] = g + (s === undefined ? 0 : s)
      }
    }

    for (let i = 0; i < width; i += 1) {
      sum[i] /= 2
      const s = sum[i]

      if (s < min) {
        min = s
      }
      if (s > max) {
        max = s
      }
    }

    // matches columns in two rows
    const pivot = min + (max - min) / 2
    const bmp = []

    for (let col = 0; col < width; col += 1) {
      let matches = 0
      for (let row = 0; row < 2; row += 1) {
        if (pxLine[(row * width + col) * 4] > pivot) {
          matches += 1
        }
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
      } else {
        lines.push(count)
        count = 1
        curr = bmp[col]
      }
    }

    // Run the decoder
    const result = BARCODE_DECODERS[options.barcode](lines)
    if (result) {
      return result
    }
    // eslint-disable-next-line
    continue
  }
  return null
}

if (module && module.exports) {
  module.exports = barcodeDecoder
} else {
  root.javascriptBarcodeReader = barcodeDecoder
}
