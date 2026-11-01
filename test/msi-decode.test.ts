import { decoder } from '../src/msi'

const MSI_PATTERNS: { [key: string]: string } = {
  '0': '100100100100',
  '1': '100100100110',
  '2': '100100110100',
  '3': '100100110110',
  '4': '100110100100',
  '5': '100110100110',
  '6': '100110110100',
  '7': '100110110110',
  '8': '110100100100',
  '9': '110100100110',
}

const START = '110'
const STOP = '1001'

function bitsFor(payload: string): string {
  let bits = START

  for (let i = 0; i < payload.length; i += 1) {
    const pattern = MSI_PATTERNS[payload[i]]

    if (!pattern) {
      throw new Error(`No test pattern for ${payload[i]}`)
    }

    bits += pattern
  }

  return bits + STOP
}

// getLines returns alternating bar/space run widths, starting with a bar.
function runsFromBits(bits: string, unit = 1): number[] {
  const runs: number[] = []
  let count = 1

  for (let i = 1; i <= bits.length; i += 1) {
    if (i < bits.length && bits[i] === bits[i - 1]) {
      count += 1
    } else {
      runs.push(count * unit)
      count = 1
    }
  }

  return runs
}

describe('MSI decoder from run widths', () => {
  test('decodes "0"', () => {
    expect(decoder(runsFromBits(bitsFor('0')))).toBe('0')
  })

  test('decodes "00"', () => {
    expect(decoder(runsFromBits(bitsFor('00')))).toBe('00')
  })

  test('decodes "123456"', () => {
    expect(decoder(runsFromBits(bitsFor('123456')))).toBe('123456')
  })

  test('normalizes scaled run widths by the narrow unit', () => {
    expect(decoder(runsFromBits(bitsFor('123456'), 3))).toBe('123456')
  })

  test('returns empty when the start guard is missing or incorrect', () => {
    expect(decoder(runsFromBits(bitsFor('0').slice(1)))).toBe('')
    expect(decoder(runsFromBits(`101${bitsFor('0').slice(START.length)}`))).toBe('')
  })

  test('returns empty when the stop guard is missing or incorrect', () => {
    expect(decoder(runsFromBits(bitsFor('0').slice(0, -STOP.length)))).toBe('')
    expect(decoder(runsFromBits(`${bitsFor('0').slice(0, -STOP.length)}1010`))).toBe('')
  })

  test('returns empty when the payload is not a whole number of digits', () => {
    expect(decoder(runsFromBits(`${START}${MSI_PATTERNS['0']}1${STOP}`))).toBe('')
  })

  test('returns empty for an unknown digit pattern', () => {
    const result = decoder(runsFromBits(`${START}101010101010${STOP}`))

    expect(result).toBe('')
    expect(result).not.toContain('?')
  })

  test('returns empty for empty, non-positive, non-finite, or short input', () => {
    expect(decoder([])).toBe('')
    expect(decoder([0, 0, 0])).toBe('')
    expect(decoder([3, 1, 3])).toBe('')
    expect(() => decoder([NaN, Infinity, 0])).not.toThrow()
    expect(decoder([NaN, Infinity, 0])).toBe('')
  })
})
