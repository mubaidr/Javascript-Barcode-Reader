/* eslint-disable func-names, no-param-reassign */

// NOTE: Dropped as GPUJS is unstable at the moment and difficult to debug

const { GPU, input } = require('gpu.js')
const UTILITIES = require('./utiltities')

const gpu = new GPU({
  // mode: 'cpu',
})

const image =
  'D:\\Current\\Javascript-Barcode-Reader\\docs\\sample-images\\code-93.jpg'

/* eslint-disable vars-on-top, block-scoped-var */
const getMinMax = gpu
  .createKernel(function(d, w, c, sum) {
    const data = d[this.thread.x]
    let min = 255
    let max = 0
    let row = 0
    let col = 0

    // gray scale pixels
    for (; row < 2; row += 1) {
      for (; col < w; col += 1) {
        const i = (row * w + col) * c
        const g = (data[i] * 3 + data[i + 1] * 4 + data[i + 2] * 2) / 9

        data[i] = g
        data[i + 1] = g
        data[i + 2] = g

        if (sum[col]) {
          sum[col] = g + sum[col]
        } else {
          sum[col] = g
        }
      }
    }

    // find min/max
    col = 0
    for (; col < 3; col += 1) {
      const s = sum[col] / 2

      if (s < min) {
        min = s
      } else {
        max = s
      }
    }

    return [min, max]
  })
  .setOutput([2])

/* eslint-enable no-var */

const o = getMinMax(
  input(new Float32Array([255, 255, 255, 0, 0, 0, 128, 128, 128]), [3, 3]),
  3,
  3,
  [0, 0, 0]
)
console.log(o)

async function testGpu() {
  // get image data
  const { data, width, height } = await UTILITIES.getImageDataFromSource(image)

  // prepare kernels
  const ImageDataToLines = gpu.combineKernels(getMinMax, function(d, w, h) {
    const channels = d.length / (w * h)
    const start = 0
    const end = 10 * channels
    const extractedData = d.slice(start, end)

    // get min, max from the image data
    return getMinMax(extractedData, w, channels)
  })

  // run kernels
  return ImageDataToLines(data, width, height)
}

/*
testGpu()
  .then(res => {
    console.log('Result: ', res)
  })
  .catch(err => {
    console.error(err)
  })
*/

module.exports = {
  // ImageDataToLines,
}

/*

    const sum = []
    let min = 255
    let max = 0
    let row = 0
    let col = 0

    // gray scale pixels
    for (; row < 2; row += 1) {
      for (; col < w; col += 1) {
        const i = (row * w + col) * c
        const g = (data[i] * 3 + data[i + 1] * 4 + data[i + 2] * 2) / 9

        data[i] = g
        data[i + 1] = g
        data[i + 2] = g

        sum[col] = g + (sum[col] || 0)
      }
    }

    // find min/max
    col = 0
    for (; col < w; col += 1) {
      const s = sum[col] / 2

      if (s < min) {
        min = s
      } else {
        max = s
      }
    }

    return [min, max]
*/
