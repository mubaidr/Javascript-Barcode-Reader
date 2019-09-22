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
 * Returns median number from a number array
 * @param {number[]} arr Array of numbers
 * @return {number} Median of the array
 */
function median(arr) {
  if (!arr || arr.length === 0) return 0

  arr.sort((a, b) => {
    return a - b
  })

  const half = Math.floor(arr.length / 2)

  if (arr.length % 2) return arr[half]

  return (arr[half - 1] + arr[half]) / 2.0
}

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
 * @param {{data: number[], width: number, height: number}} imgData
 * @returns {{data: number[], width: number, height: number}}
 */
function preProcessImage(imgData, useSimpleThreshold) {
  const { data, width, height, channels } = imgData
  const row = (height - 1) / 2

  if (useSimpleThreshold) {
    // median filter
    for (let col = 0; col < width; col += 1) {
      const i = (row * width + col) * channels
      const iPrev = ((row - 1) * width + col) * channels
      const iNext = ((row + 1) * width + col) * channels

      for (let j = 0; j < 3; j += 1) {
        data[i + j] = median([data[iPrev + j], data[i + j], data[iNext + j]])
      }
    }

    // threshold
    for (let i = 0; i < data.length; i += channels) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      // let v = r * 0.2126 + g * 0.7152 + b * 0.0722
      let v = (r + g + b) / 3

      v = v >= 127 ? 255 : 0

      data[i] = v
      data[i + 1] = v
      data[i + 2] = v
    }

    return { data, width, height }
  }

  // apply adpative threshold 😕

  return { data, width, height }
}

function getLines(obj) {
  const { data, width, height: rowsToScan, channels, useSimpleThreshold } = obj
  // const pxLine = data
  const { data: pxLine } = preProcessImage(
    {
      data,
      width,
      height: rowsToScan,
      channels,
    },
    useSimpleThreshold
  )
  const sum = []
  const bmp = []
  const lines = []
  let count = 1
  let min = 0
  let max = 0

  const padding = { left: true, right: true }

  // grey scale section and sum of columns pixels in section
  for (let row = 0; row < rowsToScan; row += 1) {
    for (let col = 0; col < width; col += 1) {
      const i = (row * width + col) * channels

      sum[col] = pxLine[i] + (sum[col] || 0)
    }
  }

  for (let i = 0; i < width; i += 1) {
    sum[i] /= rowsToScan
    const s = sum[i]

    s < min ? (min = s) : (max = s)
  }

  // matches columns in two rows
  const pivot = min + (max - min) / rowsToScan

  for (let col = 0; col < width; col += 1) {
    let matches = 0
    let value

    for (let row = 0; row < rowsToScan; row += 1) {
      value = pxLine[(row * width + col) * channels]

      if (value > pivot) matches += 1
    }

    if (value <= pivot) {
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
}
