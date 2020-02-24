export function getLines(data: Uint8ClampedArray, width: number, height: number): number[] {
  const channels = data.length / (width * height)
  const lines: number[] = []
  let count = 0
  let colSum = 0
  let colAvg = 0
  let colAvgLast = 0

  for (let col = 0; col < width; col += 1) {
    colSum = 0

    for (let row = 0; row < height; row += 1) {
      colSum += data[(row * width + col) * channels]
    }

    // atleast 75% of the pixels are same in column
    colAvg = colSum / height >= 127 ? 255 : 0

    // skip white padding in the start
    if (count === 0 && colAvg === 255) continue

    // count line width
    if (colAvg === colAvgLast) {
      count += 1
    } else {
      lines.push(count)
      count = 1
      colAvgLast = colAvg
    }

    // skip padding in the last
    if (col === width - 1 && colAvg === 0) {
      lines.push(count)
    }
  }

  return lines
}
