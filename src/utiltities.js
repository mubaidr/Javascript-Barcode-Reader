const Jimp = require('jimp')

const isNode =
  typeof process === 'object' &&
  process.release &&
  process.release.name === 'node'

// check if string is url
function isUrl(s) {
  const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/
  return !s[0] === '#' || regexp.test(s)
}

function median(arr) {
  if (!arr || arr.length === 0) return 0

  arr.sort(function(a, b) {
    return a - b
  })

  let half = Math.floor(arr.length / 2)

  if (arr.length % 2) return arr[half]

  return (arr[half - 1] + arr[half]) / 2.0
}

function preProcessImage(imgData) {
  const threshold = 127
  const { data: d, width, height } = imgData
  const channels = d.length / (width * height)

  const copyData = d.slice(0)

  // skip first and last row
  for (let row = 2; row < height - 2; row += 1) {
    for (let col = 0; col < width; col += 1) {
      const i = (row * width + col) * channels
      const iPrev2 = ((row - 2) * width + col) * channels
      const iPrev = ((row - 1) * width + col) * channels
      const iNext = ((row + 1) * width + col) * channels
      const iNext2 = ((row + 2) * width + col) * channels

      const vI = (d[i] + d[i + 1] + d[i + 2]) / 3
      const vPrev2 = (d[iPrev2] + d[iPrev2 + 1] + d[iPrev2 + 2]) / 3
      const vPrev = (d[iPrev] + d[iPrev + 1] + d[iPrev + 2]) / 3
      const vNext = (d[iNext] + d[iNext + 1] + d[iNext + 2]) / 3
      const vNext2 = (d[iNext2] + d[iNext2 + 1] + d[iNext2 + 2]) / 3

      d[i] = d[i + 1] = d[i + 2] = median([vPrev2, vPrev, vI, vNext, vNext2])
    }
  }

  for (let i = 0; i < d.length; i += channels) {
    let r = d[i]
    let g = d[i + 1]
    let b = d[i + 2]
    // let v = 0.2126 * r + 0.7152 * g + 0.0722 * b
    let v = (r + g + b) / 3

    d[i] = d[i + 1] = d[i + 2] = v > threshold ? 255 : 0
  }

  if (process.env.NODE_ENV !== 'test') {
    new Jimp({ data: Buffer.from(d), width, height }, (err, image) => {
      if (err) console.error(err)

      image.write(`./tmp/orig-${Date.now()}.jpg`)
    })

    new Jimp({ data: Buffer.from(copyData), width, height }, (err, image) => {
      if (err) console.error(err)

      image.write(`./tmp/upda-${Date.now()}.jpg`)
    })
  }

  return { data: d, width, height }
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

  return preProcessImage(ctx.getImageData(0, 0, width, height))
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
        Jimp.read(
          isURLSource ? { url: source, headers: {} } : source,
          (err, image) => {
            if (err) {
              reject(err)
            } else {
              const { data, width, height } = image.bitmap
              resolve(
                preProcessImage({
                  data: data.toJSON().data,
                  width,
                  height,
                })
              )
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
          preProcessImage(
            source
              .getContext('2d')
              .getImageData(0, 0, source.naturalWidth, source.naturalHeight)
          )
        )
      }

      reject(new Error('Invalid image source specified!'))
    }
    // Pixel Data
    else if (source.data && source.width && source.height) {
      resolve(preProcessImage(source.data, source.width, source.height))
    } else {
      reject(new Error('Invalid image source specified!'))
    }
  })
}

function getLines(obj) {
  const { data, start, end, channels, width } = obj
  const pxLine = data.slice(start, end)
  const sum = []
  const bmp = []
  const lines = []
  let count = 1
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

  for (let col = 0; col < width; col += 1) {
    let matches = 0
    let value

    for (let row = 0; row < 2; row += 1) {
      value = pxLine[(row * width + col) * channels]

      if (value > pivot) {
        matches += 1
      }
    }

    if (col === 0 && value <= pivot) {
      padding.left = false
    }
    if (col === width - 1 && value <= pivot) {
      padding.right = false
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

  return { lines, padding }
}

module.exports = {
  getImageDataFromSource,
  getLines,
}
