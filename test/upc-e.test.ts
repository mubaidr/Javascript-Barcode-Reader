import * as eanDecoder from '../src/ean'

const DIGIT_PATTERN: { [digit: string]: number[] } = {
  '0': [3, 2, 1, 1],
  '1': [2, 2, 2, 1],
  '2': [2, 1, 2, 2],
  '3': [1, 4, 1, 1],
  '4': [1, 1, 3, 2],
  '5': [1, 2, 3, 1],
  '6': [1, 1, 1, 4],
  '7': [1, 3, 1, 2],
  '8': [1, 2, 1, 3],
  '9': [3, 1, 1, 2],
}

// ZXing UPC-E number-system parity tables; index = check digit.
const NS0_PARITY = [0x38, 0x34, 0x32, 0x31, 0x2c, 0x26, 0x23, 0x2a, 0x29, 0x25]
const NS1_PARITY = [0x07, 0x0b, 0x0d, 0x0e, 0x13, 0x19, 0x1c, 0x15, 0x16, 0x1a]

function buildUpcELines(ns: number, checkDigit: number, payload: string): number[] {
  const parity = ns === 0 ? NS0_PARITY[checkDigit] : NS1_PARITY[checkDigit]
  const lines: number[] = [1, 1, 1]

  for (let i = 0; i < 6; i += 1) {
    const useG = ((parity >> (5 - i)) & 1) === 1
    const widths = DIGIT_PATTERN[payload[i]]
    lines.push(...(useG ? widths.slice().reverse() : widths))
  }

  lines.push(1, 1, 1, 1, 1, 1)
  return lines
}

describe('UPC-E decoder', () => {
  const payload = '012345'

  test.each([0, 1])('NS %d decodes all check digits 0-9 to 8 chars', (ns) => {
    for (let checkDigit = 0; checkDigit <= 9; checkDigit += 1) {
      const lines = buildUpcELines(ns, checkDigit, payload)
      const result = eanDecoder.decoder(lines, 'E')
      expect(result).toBe(String(ns) + payload + String(checkDigit))
      expect(result).toHaveLength(8)
    }
  })

  test('unknown 4-run digit pattern returns empty', () => {
    const lines = buildUpcELines(0, 0, payload)
    // Corrupt the first digit group to an unresolvable pattern.
    lines.splice(3, 4, 9, 9, 9, 9)
    const result = eanDecoder.decoder(lines, 'E')
    expect(result).toBe('')
  })

  test('invalid parity that matches no table entry returns empty', () => {
    const lines: number[] = [1, 1, 1]
    for (let i = 0; i < 6; i += 1) {
      lines.push(...DIGIT_PATTERN['0'])
    }
    lines.push(1, 1, 1, 1, 1, 1)
    // All-L parity = 0x00, which is in neither table.
    const result = eanDecoder.decoder(lines, 'E')
    expect(result).toBe('')
  })

  test('short input returns empty without throwing', () => {
    expect(eanDecoder.decoder([1, 1, 1], 'E')).toBe('')
    expect(eanDecoder.decoder([], 'E')).toBe('')
  })

  test('G parity bit position is 1 << (5-i)', () => {
    // NS0 check digit 0 -> parity 0x38 = bits 5,4,3 set -> positions 0,1,2 are G.
    const lines = buildUpcELines(0, 0, payload)
    const result = eanDecoder.decoder(lines, 'E')
    expect(result).toBe('00123450')

    // NS1 check digit 0 -> parity 0x07 = bits 2,1,0 set -> positions 3,4,5 are G.
    const lines2 = buildUpcELines(1, 0, payload)
    const result2 = eanDecoder.decoder(lines2, 'E')
    expect(result2).toBe('10123450')
  })
})
