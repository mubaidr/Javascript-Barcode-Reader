'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.createImageData = createImageData
function createImageData(image) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Cannot create canvas 2d context')
  const width = image.naturalWidth
  const height = image.naturalHeight
  canvas.width = width
  canvas.height = height
  ctx.drawImage(image, 0, 0)
  return ctx.getImageData(0, 0, width, height)
}
//# sourceMappingURL=createImageData.js.map
