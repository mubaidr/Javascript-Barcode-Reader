const isNode =
  typeof process === 'object' &&
  process.release &&
  process.release.name === 'node'

// check if string is url
function isUrl(s) {
  const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/
  return !s[0] === '#' || regexp.test(s)
}

/**
 * Returns median number from a number array (modified for only 3 rows)
 * @param {number[]} arr Array of numbers
 * @return {number} Median of the array
 */
// function median(arr) {
//   arr.sort((a, b) => {
//     return a - b
//   })

//   return arr[1]
// }

/**
 * Creates image data from HTML image
 * @param {HTMLImageElement} image HTML Image element
 */
function createImageData(image) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const width = image.naturalWidth
  const height = image.naturalHeight

  canvas.width = width
  canvas.height = height
  ctx.drawImage(image, 0, 0)

  return ctx.getImageData(0, 0, width, height)
}

/**
 * Reads image source and returns imageData as only callback parameter
 * @param {*} source Image source
 * @param {Function} callback Callback to pass the imageData
 */
async function getImageDataFromSource(source) {
  const isStringSource = typeof source === 'string'
  const isURLSource = isStringSource ? isUrl(source) : false
  const { tagName } = source

  return new Promise((resolve, reject) => {
    // String source
    if (isStringSource) {
      // Read file in Node.js
      if (isNode) {
        const Jimp = require('jimp')

        Jimp.read(
          isURLSource ? { url: source, headers: {} } : source,
          (err, image) => {
            if (err) {
              reject(err)
            } else {
              const { data, width, height } = image.bitmap
              resolve({
                data: data.toJSON().data,
                width,
                height,
              })
            }
          }
        )
      } else if (isURLSource) {
        // Load Image from source
        const img = new Image()
        img.onerror = reject
        img.onload = () => resolve(createImageData(img))
        img.src = source
      } else {
        // Find Elment by ID
        const imgElem = document.getElementById(source)
        if (imgElem) {
          resolve(createImageData(imgElem))
        }

        reject(new Error('Invalid image source specified!'))
      }
    } else if (tagName) {
      // HTML Image element
      if (tagName === 'IMG') {
        resolve(createImageData(source))
      }
      // HTML Canvas element
      else if (tagName === 'CANVAS') {
        resolve(
          source
            .getContext('2d')
            .getImageData(0, 0, source.naturalWidth, source.naturalHeight)
        )
      }

      reject(new Error('Invalid image source specified!'))
    }
    // Pixel Data
    else if (source.data && source.width && source.height) {
      resolve(source)
    } else {
      reject(new Error('Invalid image source specified!'))
    }
  })
}

/**
 * Greyscale, threshold and apply median noise removal to image data
 * @param {Object} imgData ImageData
 * @param {number[]} imgData.data Raw pixel data
 * @param {number} imgData.width Width fo image data
 * @param {number} imgData.height Height of image data
 * @param {Object} options Options defining type of barcode to detect
 * @param {Boolean=} options.useAdaptiveThreshold Use adaptive threshold (default: OTSU Threshold method)
 * @returns {{data: number[], width: number, height: number}} ImageData
 */
function preProcessImageData(imgData, options) {
  const { data, width, height } = imgData
  const { useAdaptiveThreshold } = options
  const channels = data.length / (width * height)

  // Adaptive Threshold
  if (useAdaptiveThreshold) {
    // TODO: implement this
  } else {
    for (let i = 0; i < data.length; i += channels) {
      let r = data[i]
      let g = data[i + 1]
      let b = data[i + 2]
      let v = (r + g + b) / 3

      v = v >= 127 ? 255 : 0

      data[i] = v
      data[i + 1] = v
      data[i + 2] = v
    }
  }

  return { data, width, height }
}

/**
 * Greyscale, threshold and apply median noise removal to image data
 * @param {{data: number[], width: number, height: number}} imgData
 * @returns {number[]}}
 */
function getLines(obj) {
  const { data, width, height } = obj
  const channels = data.length / (width * height)

  const padding = { left: true, right: true }
  const bmp = []
  const lines = []
  let count = 1

  for (let col = 0; col < width; col += 1) {
    let matches = 0
    let value

    for (let row = 0; row < height; row += 1) {
      value = data[(row * width + col) * channels]

      if (value === 255) matches += 1
    }

    if (value === 0) {
      if (col === 0) padding.left = false
      if (col === width - 1) padding.right = false
    }

    bmp.push(matches > 1)
  }

  // matches width of barcode lines
  let curr = bmp[0]

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

  return lines
}

module.exports = {
  getImageDataFromSource,
  getLines,
  preProcessImageData,
}
