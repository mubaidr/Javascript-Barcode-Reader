export function getLines(data: Uint8ClampedArray, width: number, height: number): number[] {
  const lines: number[] = []
  const channels = data.length / (width * height)
  let count = 0
  let columnAverageLast = 0

  for (let column = 0; column < width; column += 1) {
    let columnSum = 0
    let columnAverage = 0

    for (let row = 0; row < height; row += 1) {
      const index = (row * width + column) * channels
      columnSum += Math.sqrt((data[index] ** 2 + data[index + 1] ** 2 + data[index + 2] ** 2) / 3)
    }

    // pixels are same in column
    columnAverage = columnSum / height >= 127 ? 255 : 0

    // skip white padding in the start & end
    if (columnAverage === 255 && count === 0) continue

    // count line width
    if (columnAverage === columnAverageLast) {
      count += 1
    } else {
      lines.push(count)
      columnAverageLast = columnAverage
      count = 1
    }

    // skip padding in the last
    if (column === width - 1 && columnAverage === 0) {
      lines.push(count)
    }
  }

  return lines
}
