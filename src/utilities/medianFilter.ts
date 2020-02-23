export function applyMedianFilter(
  data: Uint8ClampedArray,
  width: number,
  height: number
): Uint8ClampedArray {
  const channels = data.length / (width * height)
  const window = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 0],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
  ]

  for (let col = 1; col < width - 1; col += 1) {
    for (let row = 1; row < height - 1; row += 1) {
      const i = (row * width + col) * channels
      const arr = []

      for (let z = 0; z < window.length; z += 1) {
        const i = ((row + window[z][0]) * width + (col + window[z][1])) * channels
        const v = (data[i] + data[i + 1] + data[i + 2]) / 3
        arr.push(v)
      }

      const v = arr.sort((a, b) => a - b)[4] > 127 ? 255 : 0
      data[i] = v
      data[i + 1] = v
      data[i + 2] = v
    }
  }

  return data
}
