import { getLines } from '../src/utilities/getLines'

function buildData(pixels: number[][]): Uint8ClampedArray {
  const channels = pixels[0].length
  const data = new Uint8ClampedArray(pixels.length * channels)

  pixels.forEach((pixel, pixelIndex) => {
    pixel.forEach((value, channelIndex) => {
      data[pixelIndex * channels + channelIndex] = value
    })
  })

  return data
}

describe('getLines channel handling', () => {
  test('reads grayscale values from channel 0 and averages rows', () => {
    const data = Uint8ClampedArray.from([255, 0, 0, 255, 255, 0, 0, 255, 0, 0, 255, 255, 0, 0])

    expect(getLines(data, 7, 2)).toEqual([2, 2, 2])
  })

  test('applies the 127 threshold to grayscale columns', () => {
    const data = Uint8ClampedArray.from([0, 126, 127, 255])

    expect(getLines(data, 4, 1)).toEqual([2])
  })

  test('computes luminance for three-channel RGB data', () => {
    const data = buildData([
      [0, 0, 0],
      [0, 0, 0],
      [255, 255, 255],
      [255, 255, 255],
      [0, 0, 255],
      [0, 0, 255],
      [0, 0, 255],
    ])

    expect(getLines(data, 7, 1)).toEqual([2, 2, 3])
  })

  test('treats a light green RGB column as white', () => {
    const data = buildData([
      [255, 255, 255],
      [0, 255, 0],
      [0, 0, 0],
    ])

    expect(getLines(data, 3, 1)).toEqual([1])
  })

  test('treats transparent RGBA padding as white', () => {
    const data = buildData([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 255],
      [0, 0, 0, 255],
      [255, 255, 255, 0],
      [255, 255, 255, 0],
      [0, 0, 0, 255],
      [0, 0, 0, 255],
    ])

    expect(getLines(data, 8, 1)).toEqual([2, 2, 2])
  })

  test('treats alpha below 128 as background', () => {
    const data = buildData([
      [0, 0, 0, 64],
      [0, 0, 0, 64],
      [0, 0, 0, 255],
      [0, 0, 0, 255],
      [255, 255, 255, 255],
      [255, 255, 255, 255],
      [0, 0, 0, 255],
    ])

    expect(getLines(data, 7, 1)).toEqual([2, 2, 1])
  })

  test('returns no lines for invalid dimensions or channel counts', () => {
    expect(getLines(new Uint8ClampedArray(0), 0, 0)).toEqual([])
    expect(getLines(new Uint8ClampedArray(0), 1, 1)).toEqual([])
    expect(getLines(new Uint8ClampedArray(5), -1, 1)).toEqual([])
    expect(getLines(new Uint8ClampedArray(5), NaN, 1)).toEqual([])
    expect(getLines(new Uint8ClampedArray(5), 1.5, 1)).toEqual([])
    expect(getLines(new Uint8ClampedArray(8), 4, 1)).toEqual([])
    expect(getLines(new Uint8ClampedArray(10), 4, 1)).toEqual([])
  })

  test('does not throw when the buffer is shorter than width * height', () => {
    expect(() => getLines(new Uint8ClampedArray(3), 4, 1)).not.toThrow()
    expect(getLines(new Uint8ClampedArray(3), 4, 1)).toEqual([])
  })
})
