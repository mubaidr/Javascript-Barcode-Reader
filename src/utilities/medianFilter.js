/**
 * Threshold image data
 * @param {number[]} data Raw pixel data
 * @param {number} width Width fo image data
 * @param {number} height Height of image data
 * @returns {Promise<number[]>} Pixel Data
 */
export async function applyMedianFilter(data, width, height) {
  const channels = data.length / (width * height)
  let window = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 0],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ]

  for (let col = 1; col < width - 1; col += 1) {
    for (let row = 1; row < height - 1; row += 1) {
      let i = (row * width + col) * channels
      let arr = []
      for (let z = 0; z < window.length; z += 1) {
        let i = ((row + window[z][0]) * width + (col + window[z][1])) * channels
        let v = (data[i] + data[i + 1] + data[i + 2]) / 3
        arr.push(v)
      }
      let v = arr.sort((a, b) => a - b)[5]
      data[i] = v > 127 ? 255 : 0
      data[i + 1] = v > 127 ? 255 : 0
      data[i + 2] = v > 127 ? 255 : 0
    }
  }

  return data
}
