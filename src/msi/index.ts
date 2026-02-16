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
const MSI_END = '1001'

function decodeMSI(encoded: string): string {
  let result = ''
  let i = 0

  if (encoded.startsWith(MSI_START)) {
    i += MSI_START.length
  }

  while (i < encoded.length - MSI_END.length) {
    const chunk = encoded.substring(i, i + 12)
    const digit = MSI_PATTERNS[chunk]
    if (digit) {
      result += digit
      i += 12
    } else {
      result += '?'
      break
    }
  }

  return result
}

export function decoder(lines: number[]): string {
  if (lines.length < 20) {
    return ''
  }

  const bar = (lines[0] + lines[1]) / 2
  let encoded = ''

  for (let i = 0; i < lines.length; i++) {
    const width = lines[i] / bar
    if (width >= 0.5 && width < 1.5) {
      encoded += '1'
    } else if (width >= 1.5 && width < 2.5) {
      encoded += '11'
    } else if (width >= 2.5) {
      encoded += '111'
    } else {
      encoded += '0'
    }
  }

  return decodeMSI(encoded)
}
