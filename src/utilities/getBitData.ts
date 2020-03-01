export default function getBitData(
  data: Uint8ClampedArray,
  width: number,
  height: number
): number[] {
  const bitData: number[] = []
  const channels = data.length / (width * height)

  for (let i = 0; i < data.length; i += channels) {
    let average = Math.sqrt((data[i] ** 2 + data[i + 1] ** 2 + data[i + 2] ** 2) / 3)

    if (channels === 4) {
      average *= data[3] / 255
    }

    bitData.push(average)
  }

  return bitData
}
