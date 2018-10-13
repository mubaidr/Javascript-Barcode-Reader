const Jimp = require('jimp')

const isNode =
  typeof process === 'object' &&
  process.release &&
  process.release.name === 'node'

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
  return new Promise((resolve, reject) => {
    let { tagName } = source

    // Pixel Data
    if (source.data && source.width && source.height) {
      return resolve(source)
    }

    // HTML Image element
    if (tagName === 'IMG') {
      return resolve(createImageData(source))
    }

    // HTML Canvas element
    if (tagName === 'CANVAS') {
      return resolve(
        source
          .getContext('2d')
          .getImageData(0, 0, source.naturalWidth, source.naturalHeight)
      )
    }

    // String source
    if (typeof source === 'string') {
      // Read file in Node.js
      if (isNode) {
        return Jimp.read(source, (err, image) => {
          if (err) {
            reject(err)
            return
          }

          const { data, width, height } = image.bitmap
          resolve({
            data: data.toJSON().data,
            width,
            height,
          })
        })
      }

      // Find Elment by ID
      const imgElem = document.getElementById(source)
      if (imgElem) {
        return resolve(createImageData(imgElem))
      }
      // Load Image from source
      const img = new Image()
      img.onerror = () => reject(new Error('Invalid image source specified!'))
      img.onload = () => resolve(createImageData(img))
      img.src = source
    }

    return reject(new Error('Invalid image source specified!'))
  })
}

module.exports = {
  getImageDataFromSource,
}
