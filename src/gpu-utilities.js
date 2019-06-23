/* eslint-disable func-names */

const { GPU } = require('gpu.js')
const UTILITIES = require('./utiltities')

const gpu = new GPU({
  // mode: 'dev',
})

// TODO: create kernel utilities
const add = gpu
  .createKernel(function(a, b) {
    return a[this.thread.x] + b[this.thread.x]
  })
  .setOutput([20])

async function testGpu() {
  const image =
    'D:\\Current\\Javascript-Barcode-Reader\\docs\\sample-images\\code-93.jpg'
  const { data, width, height } = await UTILITIES.getImageDataFromSource(image)
  // const dataLength = data.length
  // const channels = dataLength / (width * height)
  const channels = data.length / (width * height)
  const start = 0
  const end = 5 * channels
  const extractedData = data.slice(start, end)

  console.log(channels)

  // TODO:  combine kernels

  const ImageDataToLines = gpu.combineKernels(
    add,
    function(a) {
      return add(a[this.thread.x], 25)
    },
    { output: [extractedData.length] }
  )

  /* eslint-enable no-shadow */
  const result = ImageDataToLines(extractedData)

  return result
}

testGpu()
  .then(res => {
    console.log('Result: ', res)
  })
  .catch(err => {
    console.error(err)
  })

module.exports = {
  // ImageDataToLines,
}
