const MSI_PATTERNS: { [key: string]: string } = {
  '100100100100': '0',
  '100100100110': '1',
  '100100110100': '2',
  '100100110110': '3',
  '100110100100': '4',
  '100110100110': '5',
  '100110110100': '6',
  '100110110110': '7',
  '110100100100': '8',
  '110100100110': '9',
}

const MSI_START = '110'
const MSI_STOP = '1001'
const BITS_PER_DIGIT = 12

function decodeMSI(encoded: string): string {
  let result = ''
  let i = 0

  if (!encoded.startsWith(MSI_START)) {
    return ''
  }
  i += MSI_START.length

  while (i + BITS_PER_DIGIT <= encoded.length - MSI_STOP.length) {
    const chunk = encoded.substring(i, i + BITS_PER_DIGIT)
    const digit = MSI_PATTERNS[chunk]
    if (digit === undefined) {
      return ''
    }
    result += digit
    i += BITS_PER_DIGIT
  }

  if (!encoded.endsWith(MSI_STOP) || i !== encoded.length - MSI_STOP.length) {
    return ''
  }

  return result
}

export function decoder(lines: number[]): string {
  if (lines.length === 0) {
    return ''
  }

  // Estimate the narrow unit width from the smallest positive run.
  let unit = Infinity
  for (const item of lines) {
    if (item > 0 && item < unit) {
      unit = item
    }
  }
  if (!Number.isFinite(unit) || unit <= 0) {
    return ''
  }

  // Rebuild module bits from run widths with alternating polarity: bars are 1s,
  // spaces are 0s. Each run of width w contributes round(w / unit) modules.
  let encoded = ''
  for (let i = 0; i < lines.length; i += 1) {
    const width = lines[i]
    if (width <= 0) {
      continue
    }
    const modules = Math.max(1, Math.round(width / unit))
    const bit = i % 2 === 0 ? '1' : '0'
    for (let m = 0; m < modules; m += 1) {
      encoded += bit
    }
  }

  return decodeMSI(encoded)
}
