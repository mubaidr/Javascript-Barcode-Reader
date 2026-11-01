import { applyAdaptiveThreshold } from '../src/utilities/adaptiveThreshold'

const t = 0.15

// Brute-force reference using inclusive window bounds and inclusive area.
function referenceThreshold(
  data: Uint8ClampedArray,
  width: number,
  height: number
): Uint8ClampedArray {
  const channels = data.length / (width * height)
  const s = Math.floor(height)
  const s2 = Math.floor(s / 2)
  const grey = new Array(width * height).fill(0)

  // pass 1: greyscale (mirrors the implementation)
  for (let i = 0; i < width; i += 1) {
    for (let j = 0; j < height; j += 1) {
      const index = (j * width + i) * channels
      grey[j * width + i] = (data[index] + data[index + 1] + data[index + 2]) / 3
    }
  }

  const out = new Uint8ClampedArray(data.length)
  for (let i = 0; i < width; i += 1) {
    for (let j = 0; j < height; j += 1) {
      const index = (j * width + i) * channels
      let x1 = Math.max(0, i - s2)
      let x2 = Math.min(width - 1, i + s2)
      let y1 = Math.max(0, j - s2)
      let y2 = Math.min(height - 1, j + s2)

      let sum = 0
      for (let yy = y1; yy <= y2; yy += 1) {
        for (let xx = x1; xx <= x2; xx += 1) {
          sum += grey[yy * width + xx]
        }
      }
      const count = (x2 - x1 + 1) * (y2 - y1 + 1)
      const v = grey[j * width + i] * count < sum * (1 - t) ? 0 : 255
      out[index] = v
      if (channels > 1) out[index + 1] = v
      if (channels > 2) out[index + 2] = v
    }
  }
  return out
}

describe('adaptiveThreshold', () => {
  test('height 1 dark pixels stay black (fixed-threshold path)', () => {
    const width = 5
    const height = 1
    const channels = 3
    const data = new Uint8ClampedArray(width * height * channels)
    for (let i = 0; i < data.length; i += 1) data[i] = 50 // dark gray

    applyAdaptiveThreshold(data, width, height)

    for (let i = 0; i < data.length; i += 1) {
      expect(data[i]).toBe(0)
    }
  })

  test('width 1 dark pixels stay black (fixed-threshold path)', () => {
    const width = 1
    const height = 5
    const channels = 3
    const data = new Uint8ClampedArray(width * height * channels)
    for (let i = 0; i < data.length; i += 1) data[i] = 50 // dark gray

    applyAdaptiveThreshold(data, width, height)

    for (let i = 0; i < data.length; i += 1) {
      expect(data[i]).toBe(0)
    }
  })

  test('height 1 white pixels stay white (fixed-threshold path)', () => {
    const width = 5
    const height = 1
    const channels = 3
    const data = new Uint8ClampedArray(width * height * channels)
    for (let i = 0; i < data.length; i += 1) data[i] = 200 // light gray

    applyAdaptiveThreshold(data, width, height)

    for (let i = 0; i < data.length; i += 1) {
      expect(data[i]).toBe(255)
    }
  })

  test('inclusive window bounds match brute-force reference', () => {
    const width = 7
    const height = 5
    const channels = 3
    const data = new Uint8ClampedArray(width * height * channels)
    for (let i = 0; i < data.length; i += 1) data[i] = (i * 37) % 256 // gradient

    const expected = referenceThreshold(data, width, height)
    applyAdaptiveThreshold(data, width, height)

    expect(Array.from(data)).toEqual(Array.from(expected))
  })

  test('constant dark region keeps expected thresholded pixels', () => {
    const width = 3
    const height = 3
    const channels = 3
    const data = new Uint8ClampedArray(width * height * channels)
    for (let i = 0; i < data.length; i += 1) data[i] = 100 // dark gray

    applyAdaptiveThreshold(data, width, height)

    // Uniform dark region: center equals local mean, so no pixel falls below
    // mean*(1-t); everything becomes white.
    for (let i = 0; i < data.length; i += 1) {
      expect(data[i]).toBe(255)
    }
  })

  test('does not mutate image shape (length, width, height preserved)', () => {
    const width = 4
    const height = 4
    const channels = 3
    const data = new Uint8ClampedArray(width * height * channels)
    for (let i = 0; i < data.length; i += 1) data[i] = 128

    const result = applyAdaptiveThreshold(data, width, height)

    expect(result).toBe(data)
    expect(result.length).toBe(width * height * channels)
  })
})
