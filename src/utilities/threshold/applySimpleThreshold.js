/**
 * Threshold image data
 * @param {number[]} data Raw pixel data
 * @param {number} width Width fo image data
 * @param {number} height Height of image data
 * @returns {Promise<number[]>} Pixel Data
 */
export async function applySimpleThreshold(data, width, height) {
  const channels = data.length / (width * height)
  for (let i = 0; i < data.length; i += channels) {
    let r = data[i]
    let g = data[i + 1]
    let b = data[i + 2]
    let v = (r + g + b) / 3
    v = v >= 127 ? 255 : 0
    data[i] = v
    data[i + 1] = v
    data[i + 2] = v
  }
  return data
}
