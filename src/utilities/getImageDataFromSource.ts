import { createImageData } from './createImageData'
import { isUrl } from './isUrl'

const isNode = typeof process === 'object' && process.release && process.release.name === 'node'

export async function getImageDataFromSource(
  source: string | HTMLImageElement | { data: Uint8ClampedArray; width: number; height: number }
): Promise<{ data: Uint8ClampedArray; width: number; height: number }> {
  const isStringSource = typeof source === 'string'
  const isURLSource = isStringSource ? await isUrl(source) : false
  const { tagName } = source

  return new Promise((resolve, reject) => {
    // String source
    if (isStringSource) {
      // Read file in Node.js
      if (isNode) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Jimp = require('jimp')

        Jimp.read(isURLSource ? { url: source, headers: {} } : source, (err, image) => {
          if (err) {
            reject(err)
          } else {
            const { data, width, height } = image.bitmap
            resolve({
              data: data.toJSON().data,
              width,
              height
            })
          }
        })
      } else if (isURLSource) {
        // Load Image from source
        const img = new Image()
        img.onerror = reject
        img.onload = (): void => resolve(createImageData(img))
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
          source.getContext('2d').getImageData(0, 0, source.naturalWidth, source.naturalHeight)
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
