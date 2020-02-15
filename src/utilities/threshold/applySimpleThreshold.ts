export function applySimpleThreshold(
  data: Uint8ClampedArray,
  width: number,
  height: number
): Uint8ClampedArray {
  const channels = data.length / (width * height)

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    let v = (r + g + b) / 3
    v = v >= 127 ? 255 : 0
    data[i] = v
    data[i + 1] = v
    data[i + 2] = v
  }

  return data
}
