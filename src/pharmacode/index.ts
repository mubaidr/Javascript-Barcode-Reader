const PHARMA_MIN = 3
const PHARMA_MAX = 131070

export function decoder(lines: number[]): string {
  if (!lines || lines.length === 0) {
    return ''
  }

  // Pharmacode is a single track of bars separated by spaces. Bars are at even
  // indices (starting with a bar); spaces at odd indices are ignored.
  const barWidths: number[] = []
  for (let i = 0; i < lines.length; i += 2) {
    const w = lines[i]
    if (Number.isFinite(w) && w > 0) {
      barWidths.push(w)
    }
  }

  if (barWidths.length === 0) {
    return ''
  }

  // Derive the unit width from the narrowest bar.
  let unit = barWidths[0]
  for (const w of barWidths) {
    if (w < unit) {
      unit = w
    }
  }
  if (unit <= 0) {
    return ''
  }

  // Classify each bar as narrow (value 1) or wide (value 2) relative to the
  // unit width, then decode left to right: value = value * 2 + barValue.
  let value = 0
  for (const w of barWidths) {
    const barValue = w < unit * 1.5 ? 1 : 2
    value = value * 2 + barValue
  }

  if (value < PHARMA_MIN || value > PHARMA_MAX) {
    return ''
  }

  return String(value)
}
