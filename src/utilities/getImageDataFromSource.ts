import Jimp from 'jimp'
import { createImageData } from './createImageData'
import { isUrl } from './isUrl'

const isNode = typeof process === 'object' && process.release && process.release.name === 'node'

export async function getImageDataFromSource(
  source: string | HTMLImageElement | HTMLCanvasElement
): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    if (typeof source === 'string') {
      if (isUrl(source)) {
        const img = new Image()
        img.onerror = reject
        img.onload = (): void => resolve(createImageData(img))
        img.src = source
      } else if (isNode) {
        Jimp.read(source, (err, image) => {
          if (err) {
            reject(err)
          } else {
            const { data, width, height } = image.bitmap

            resolve({
              data: Uint8ClampedArray.from(data),
              width,
              height
            })
          }
        })
      } else {
        const imageElement = document.getElementById(source)

        if (imageElement instanceof HTMLImageElement) {
          resolve(createImageData(imageElement))
        }

        reject(new Error('Invalid image source specified!'))
      }
    } else if (source instanceof HTMLImageElement) {
      resolve(createImageData(source))
    } else if (source instanceof HTMLCanvasElement) {
      const ctx = source.getContext('2d')
      if (!ctx) throw new Error('Cannot create canvas 2d context')
      resolve(ctx.getImageData(0, 0, source.width, source.height))
    } else {
      reject(new Error('Invalid image source specified!'))
    }
  })
}
