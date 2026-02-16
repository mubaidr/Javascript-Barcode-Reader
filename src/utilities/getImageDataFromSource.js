'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.getImageDataFromSource = getImageDataFromSource
const Jimp = require('jimp')
const createImageData_1 = require('./createImageData')
const isUrl_1 = require('./isUrl')
const isNode = typeof process === 'object' && process.release && process.release.name === 'node'
function getImageDataFromSource(source) {
  return __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
      if (typeof source === 'string') {
        if (source.startsWith('#')) {
          const imageElement = document.getElementById(source.substr(1))
          if (imageElement instanceof HTMLImageElement) {
            resolve((0, createImageData_1.createImageData)(imageElement))
          }
          if (imageElement instanceof HTMLCanvasElement) {
            const ctx = imageElement.getContext('2d')
            if (!ctx) throw new Error('Cannot create canvas 2d context')
            resolve(ctx.getImageData(0, 0, imageElement.width, imageElement.height))
          }
          reject(new Error('Invalid image source specified!'))
        } else if ((0, isUrl_1.isUrl)(source)) {
          const img = new Image()
          img.onerror = reject
          img.onload = () => resolve((0, createImageData_1.createImageData)(img))
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
                height,
              })
            }
          })
        }
      } else if (source instanceof HTMLImageElement) {
        resolve((0, createImageData_1.createImageData)(source))
      } else if (source instanceof HTMLCanvasElement) {
        const ctx = source.getContext('2d')
        if (!ctx) throw new Error('Cannot create canvas 2d context')
        resolve(ctx.getImageData(0, 0, source.width, source.height))
      }
    })
  })
}
//# sourceMappingURL=getImageDataFromSource.js.map
