export function applyAdaptiveThreshold(
  data: Uint8ClampedArray,
  width: number,
  height: number
): Uint8ClampedArray {
  const channels = data.length / (width * height)
  const t = 0.15 // threshold percentage

  // Degenerate images (one row or column) cannot form a meaningful window.
  // Apply a fixed 127 threshold instead so dark pixels stay dark.
  if (width < 2 || height < 2) {
    for (let i = 0; i < data.length; i += channels) {
      const v = (data[i] + data[i + 1] + data[i + 2]) / 3
      const b = v >= 127 ? 255 : 0
      data[i] = b
      data[i + 1] = b
      data[i + 2] = b
    }
    return data
  }

  const integralImage = new Array(width * height).fill(0)

  for (let i = 0; i < width; i += 1) {
    let sum = 0
    for (let j = 0; j < height; j += 1) {
      const pureIndex = j * width + i
      const index = pureIndex * channels
      const v = (data[index] + data[index + 1] + data[index + 2]) / 3

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

  const s = Math.floor(height) // bracket size
  const s2 = Math.floor(s / 2)

  for (let i = 0; i < width; i += 1) {
    for (let j = 0; j < height; j += 1) {
      const pureIndex = j * width + i
      const index = pureIndex * channels

      let x1 = i - s2
      let x2 = i + s2
      let y1 = j - s2
      let y2 = j + s2

      if (x1 < 0) x1 = 0
      if (x2 >= width) x2 = width - 1
      if (y1 < 0) y1 = 0
      if (y2 >= height) y2 = height - 1

      // Inclusive integral-window bounds; the window includes x1/y1 and x2/y2.
      const count = (x2 - x1 + 1) * (y2 - y1 + 1)
      const getII = (y: number, x: number): number => {
        if (y < 0 || x < 0) return 0
        return integralImage[y * width + x]
      }
      const sum = getII(y2, x2) - getII(y1 - 1, x2) - getII(y2, x1 - 1) + getII(y1 - 1, x1 - 1)

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
