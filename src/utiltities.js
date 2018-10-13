const Jimp = require('jimp')

const isNode =
  typeof process === 'object' &&
  process.release &&
  process.release.name === 'node'

/**
 * Reads image source and returns imageData as only callback parameter
 * @param {*} source Image source
 * @param {Function} callback Callback to pass the imageData
 */
async function getImageDataFromSource(source) {
  return new Promise((resolve, reject) => {
    if (source.data && source.width && source.height) {
      return resolve(source)
    }

    // if Node.js
    if (isNode) {
      if (typeof source === 'string') {
        return Jimp.read(source, (err, image) => {
          if (err) {
            reject(err)
            return
          }

          const { data, width, height } = image.bitmap
          resolve({ data: data.toJSON().data, width, height })
        })
      }

      return reject(new Error('Invalid image source specified!'))
    }

    // if Browser
    if (typeof source === 'string') {
      source = document.getElementById(source)
      if (!source) return reject(new Error('Invalid image source specified!'))
    }

    let elementType = source.tagName

    if (elementType === 'IMG') {
      const canvas = document.createElement('canvas')
      canvas.width = source.naturalWidth
      canvas.height = source.naturalHeight
      const ctx = canvas.getContext('2d')

      ctx.drawImage(source, 0, 0)

      return resolve(
        ctx.getImageData(0, 0, source.naturalWidth, source.naturalHeight)
      )
    }

    if (elementType === 'CANVAS') {
      return resolve(
        source
          .getContext('2d')
          .getImageData(0, 0, source.naturalWidth, source.naturalHeight)
      )
    }

    return reject(new Error('Invalid image source specified!'))
  })
}

module.exports = {
  getImageDataFromSource,
}
