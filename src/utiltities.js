const Jimp = require('jimp')

const isNode =
  typeof process === 'object' &&
  process.release &&
  process.release.name === 'node'

// check if string is url
function isUrl(s) {
  let regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/
  return regexp.test(s)
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

  return ctx.getImageData(0, 0, image.naturalWidth, image.naturalHeight)
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

module.exports = {
  getImageDataFromSource,
}
