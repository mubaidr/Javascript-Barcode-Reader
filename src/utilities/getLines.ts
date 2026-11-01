export function getLines(data: Uint8ClampedArray, width: number, height: number): number[] {
  const lines: number[] = []

  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    return lines
  }

  const pixelCount = width * height

  // Channel data must describe complete pixels of a supported layout.
  if (data.length % pixelCount !== 0) {
    return lines
  }

  const channels = data.length / pixelCount

  if (channels !== 1 && channels !== 3 && channels !== 4) {
    return lines
  }

  const readChannel = (index: number): number =>
    index >= 0 && index < data.length ? data[index] : 255

  // Rec. 601 luminance keeps colored pixels comparable to grayscale brightness.
  const getLuminance = (red: number, green: number, blue: number): number =>
    0.299 * red + 0.587 * green + 0.114 * blue

  const getPixelValue = (index: number): number => {
    if (channels === 1) return readChannel(index)

    const luminance = getLuminance(readChannel(index), readChannel(index + 1), readChannel(index + 2))

    if (channels === 3) return luminance

    const alpha = readChannel(index + 3)

    // Transparent pixels are padding, so treat them as white background.
    if (alpha < 128) return 255

    return (luminance * alpha + 255 * (255 - alpha)) / 255
  }

  let count = 0
  let columnAverageLast = 0

  for (let column = 0; column < width; column += 1) {
    let columnSum = 0

    for (let row = 0; row < height; row += 1) {
      const index = (row * width + column) * channels
      columnSum += getPixelValue(index)
    }

    // pixels are same in column
    const columnAverage = columnSum / height >= 127 ? 255 : 0

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
