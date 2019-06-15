/* eslint-disable func-names */

const { GPU } = require('gpu.js')
const UTILITIES = require('./utiltities')

async function testGpu() {
  const gpu = new GPU({
    mode: 'dev',
  })

  const image =
    'D:\\Current\\Javascript-Barcode-Reader\\docs\\sample-images\\code-93.jpg'
  const { data, width, height } = await UTILITIES.getImageDataFromSource(image)
  // const dataLength = data.length
  // const channels = dataLength / (width * height)
  const start = 0
  const end = 100
  const extractedData = data.slice(start, end)

  /* eslint-disable no-shadow */
  const ImageDataToLines = gpu.createKernelMap(
    [
      function add(a, b) {
        return a + b
      },
      function multiply(a, b) {
        return a * b
      },
    ],
    function(a) {
      return a[this.thread.x]
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
