import { decoder } from '../src/code-11'

function encode(code11: string): number[] {
  const unit = 1
  const narrow = unit
  const wide = unit * 2
  const bar = (bits: string): number[] =>
    bits.split('').map((b) => (b === '1' ? wide : narrow))
  const space = [narrow]
  const start = bar('00110')
  const stop = bar('00110')
  const chars: { [key: string]: string } = {
    '0': '00001', '1': '10001', '2': '01001', '3': '11000', '4': '00101',
    '5': '10100', '6': '01100', '7': '00011', '8': '10010', '9': '10000',
    '-': '00100',
  }
  const parts: number[][] = [start]
  for (let i = 0; i < code11.length; i += 1) {
    parts.push(space)
    parts.push(bar(chars[code11[i]]))
  }
  parts.push(space)
  parts.push(stop)
  return parts.flat()
}

describe('Code 11 decoder', () => {
  test('decodes a single digit', () => {
    expect(decoder(encode('0'))).toBe('0')
  })

  test('decodes a multi-character string', () => {
    expect(decoder(encode('12'))).toBe('12')
  })

  test('decodes dash and digits', () => {
    expect(decoder(encode('1-2'))).toBe('1-2')
  })

  test('decodes all digits', () => {
    expect(decoder(encode('0123456789'))).toBe('0123456789')
  })

  test('rejects empty input', () => {
    expect(decoder([])).toBe('')
    expect(decoder([] as any)).toBe('')
  })

  test('rejects non-finite widths', () => {
    expect(decoder([NaN, NaN, NaN])).toBe('')
    expect(decoder([Infinity, Infinity])).toBe('')
  })

  test('rejects unknown pattern', () => {
    // 11111 is not a valid Code 11 character
    expect(decoder([2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 1])).toBe('')
  })
})
