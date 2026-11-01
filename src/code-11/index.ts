const CODE_11_PATTERNS: {
  [key: string]: string
} = {
  '00001': '0',
  '10001': '1',
  '01001': '2',
  '11000': '3',
  '00101': '4',
  '10100': '5',
  '01100': '6',
  '00011': '7',
  '10010': '8',
  '10000': '9',
  '00100': '-',
  '00110': '*',
}

export function decoder(lines: number[]): string {
  if (!lines || lines.length < 10) {
    return ''
  }

  // Derive the unit width from the narrowest run. Elements are bar/space
  // pairs, so every run contributes to the unit estimate.
  let unit = lines[0]
  for (const w of lines) {
    if (w > 0 && w < unit) {
      unit = w
    }
  }
  if (!Number.isFinite(unit) || unit <= 0) {
    return ''
  }

  // Classify each run as narrow (0) or wide (1) relative to the unit width.
  const bits: string[] = []
  for (const w of lines) {
    bits.push(w < unit * 1.5 ? '0' : '1')
  }

  // Characters are 5 elements (bar/space/bar/space/bar) separated by one
  // narrow space. Rebuild the bit string and split into 5-element groups.
  const bitStr = bits.join('')
  const groups: string[] = []
  let i = 0
  while (i + 5 <= bitStr.length) {
    groups.push(bitStr.slice(i, i + 5))
    i += 5
    if (i < bitStr.length) {
      i += 1 // skip the single narrow space separator
    }
  }

  const code: string[] = []
  for (const group of groups) {
    if (group.length < 5) {
      return ''
    }
    const char = CODE_11_PATTERNS[group]
    if (char === undefined) {
      return ''
    }
    if (char === '*') {
      continue // start/stop guards carry no data
    }
    code.push(char)
  }

  return code.join('')
}
