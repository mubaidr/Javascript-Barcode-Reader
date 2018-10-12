const Jimp = require('jimp')

/**
 * Reads image source and returns imageData as only callback parameter
 * @param {*} source Image source
 * @param {Function} callback Callback to pass the imageData
 */
async function getImageDataFromSource(source) {
  return new Promise((resolve, reject) => {
    // if Node.js
    if (process && process.release && process.release.name === 'node') {
      if (source.data && source.width && source.height) {
        resolve(source)
      } else if (typeof source === 'string') {
        Jimp.read(source, (err, image) => {
          if (err) reject(err)

          const { data, width, height } = image.bitmap
          resolve({ data: data.toJSON().data, width, height })
        })
      } else {
        reject(new Error('Invalid image source specified!'))
      }
    }
    // if Browser
    else if (typeof source === 'string') {
      source = document.getElementById(source)
      if (!source) reject(new Error('Invalid image source specified!'))

      let elementType = source.tagName
      if (elementType === 'IMG') {
        const canvas = document.createElement('canvas')
        canvas.width = source.naturalWidth
        canvas.height = source.naturalHeight
        const ctx = canvas.getContext('2d')

        ctx.drawImage(source, 0, 0)

        resolve(
          ctx.getImageData(0, 0, source.naturalWidth, source.naturalHeight)
        )
      } else if (elementType === 'CANVAS') {
        resolve(
          source
            .getContext('2d')
            .getImageData(0, 0, source.naturalWidth, source.naturalHeight)
        )
      }
    } else if (source.data) {
      resolve(source)
    } else {
      reject(new Error('Invalid image source specified!'))
    }
  })
}

module.exports = {
  getImageDataFromSource,
}
