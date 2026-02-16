function decodePharmacode(binary: string): string {
  if (binary.length < 3) return ''

  let result = 0
  let i = 0

  while (i < binary.length) {
    if (binary[i] === '1') {
      let count = 1
      i++
      while (i < binary.length && binary[i] === '1') {
        count++
        i++
      }
      if (count > 2) {
        result = result * 10 + (count - 2)
      }
    } else {
      i++
    }
  }

  return result.toString()
}

export function decoder(lines: number[]): string {
  if (lines.length < 8) {
    return ''
  }

  const bar = (lines[0] + lines[1]) / 2
  let binary = ''

  for (let i = 0; i < lines.length; i++) {
    const width = lines[i] / bar
    if (width >= 0.5 && width < 1.5) {
      binary += '0'
    } else if (width >= 1.5) {
      binary += '1'
    }
  }

  return decodePharmacode(binary)
}
