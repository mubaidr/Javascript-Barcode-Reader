export function applyMedianFilter(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  windowSize = 3
): Uint8ClampedArray {
  const channels = data.length / (width * height)
  const filterWindow: number[][] = []
  const limit = (windowSize - 1) / 2

  for (let i = limit * -1; i < limit + 1; i += 1) {
    for (let j = limit * -1; j < limit + 1; j += 1) {
      filterWindow.push([i, j])
    }
  }

  for (let col = limit; col < width - limit; col += 1) {
    for (let row = limit; row < height - limit; row += 1) {
      const index = (row * width + col) * channels
      const arr: number[] = []

      for (let z = 0; z < filterWindow.length; z += 1) {
        const i = ((row + filterWindow[z][0]) * width + (col + filterWindow[z][1])) * channels
        const average = Math.sqrt((data[i] ** 2 + data[i + 1] ** 2 + data[i + 2] ** 2) / 3)

        arr.push(average)
      }

      const sorted = arr.sort((a, b) => a - b)
      const medianValue = sorted[Math.floor(sorted.length / 2)]
      // const thresholdValue = medianValue >= 180 ? 255 : 0

      data[index + 0] = medianValue
      data[index + 1] = medianValue
      data[index + 2] = medianValue

      if (channels === 4) data[index + 3] = 255
    }
  }

  return data
}
