export function applyMedianFilter(
  data: number[],
  width: number,
  height: number,
  windowSize = 3
): number[] {
  const limit = (windowSize - 1) / 2
  const filterWindow: number[][] = []

  for (let i = limit * -1; i < limit + 1; i += 1) {
    for (let j = limit * -1; j < limit + 1; j += 1) {
      filterWindow.push([i, j])
    }
  }

  for (let col = limit; col < width - limit; col += 1) {
    for (let row = limit; row < height - limit; row += 1) {
      const index = row * width + col
      const collection: number[] = []

      for (let z = 0; z < filterWindow.length; z += 1) {
        const i = (row + filterWindow[z][0]) * width + (col + filterWindow[z][1])
        collection.push(data[i])
      }

      const sorted = collection.sort((a, b) => b - a)
      data[index] = sorted[Math.floor(sorted.length / 2)]
    }
  }

  return data
}
