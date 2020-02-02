/**
 * Greyscale, threshold and apply median noise removal to image data
 * @param {number[]} data Raw pixel data
 * @param {number} width Width fo image data
 * @param {number} height Height of image data
 * @returns {Promise<number[]>} Pixel Data
 */
export async function applyAdaptiveThreshold(data, width, height) {
  const integralImage = new Array(width * height).fill(0)
  const channels = data.length / (width * height)
  const t = 0.15 // threshold percentage
  const s = Math.floor(width / 4) // bracket size
  const s2 = Math.ceil(s / 2)

  for (let i = 0; i < width; i += 1) {
    let sum = 0
    for (let j = 0; j < height; j += 1) {
      let pureIndex = j * width + i
      let index = pureIndex * channels
      // greyscale
      let v = (data[index] + data[index + 1] + data[index + 2]) / 3
      data[index] = v
      data[index + 1] = v
      data[index + 2] = v
      sum += v
      if (i === 0) {
        integralImage[pureIndex] = sum
      } else {
        integralImage[pureIndex] = integralImage[pureIndex - 1] + sum
      }
    }
  }

  // skip edge rows
  for (let i = 0; i < width; i += 1) {
    for (let j = 0; j < height; j += 1) {
      let pureIndex = j * width + i
      let index = pureIndex * channels
      // no. of pixels per window
      let x1 = i - s2
      let x2 = i + s2
      let y1 = j - s2
      let y2 = j + s2
      if (x1 < 0) x1 = 0
      if (x2 >= width) x2 = width - 1
      if (y1 < 0) y1 = 0
      if (y2 >= height) y2 = height - 1
      let count = (x2 - x1) * (y2 - y1)
      const sum =
        integralImage[y2 * width + x2] -
        integralImage[y1 * width + x2] -
        integralImage[y2 * width + x1] +
        integralImage[y1 * width + x1]
      let v = 255
      if (data[index] * count < sum * (1 - t)) {
        v = 0
      }
      data[index] = v
      data[index + 1] = v
      data[index + 2] = v
    }
  }

  return data
}
