/* eslint-disable func-names */

const GPU = require('gpu.js')
const UTILITIES = require('./utiltities')

function getLines(data, start, end, channels, width) {
  return data
}

async function testGpu() {
  const gpu = new GPU()

  const image =
    'D:\\Current\\Javascript-Barcode-Reader\\docs\\sample-images\\code-93.jpg'
  const { data, width, height } = await UTILITIES.getImageDataFromSource(image)
  const channels = data.length / (width * height)
  const start = 0
  const end = data.length - 1

  const ImageDataToLines = gpu
    .createKernel(function(arr, s, e, c, w) {
      return getLines(arr[this.thread.x], s, e, c, w)
    })
    .setOutput([data.length])
    .setFunctions([getLines])

  console.log(ImageDataToLines(data, start, end, channels, width))
}

testGpu()

module.exports = {
  // ImageDataToLines,
}
