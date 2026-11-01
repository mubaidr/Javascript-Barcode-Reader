import * as path from 'path'
import javascriptBarcodeReader from '../src/index'
import { decoder } from '../src/code2of5'

const NARROW = 1
const WIDE = 3

const DIGIT_PATTERNS: { [key: string]: string } = {
  '0': 'nnwwn',
  '1': 'wnnnw',
  '2': 'nwnnw',
  '3': 'wwnnn',
  '4': 'nnwnw',
  '5': 'wnwnn',
  '6': 'nwwnn',
  '7': 'nnnww',
  '8': 'wnnwn',
  '9': 'nwnwn',
}

function width(token: string): number {
  return token === 'w' ? WIDE : NARROW
}

// Fresh arrays per call: the decoder splices its input.
function standardLines(payload: string, extra: number[] = []): number[] {
  const runs: number[] = []

  const pushBarAndSpace = (pattern: string) => {
    for (let i = 0; i < pattern.length; i += 1) {
      runs.push(width(pattern[i]))
      runs.push(NARROW)
    }
  }

  pushBarAndSpace('wwn')
  for (let i = 0; i < payload.length; i += 1) {
    pushBarAndSpace(DIGIT_PATTERNS[payload[i]])
  }
  runs.push(...extra)
  runs.push(WIDE, NARROW, NARROW, NARROW, WIDE)
  return runs
}

function interleavedLines(payload: string, extra: number[] = []): number[] {
  const runs = [NARROW, NARROW, NARROW, NARROW]

  for (let i = 0; i < payload.length; i += 2) {
    const bars = DIGIT_PATTERNS[payload[i]]
    const spaces = DIGIT_PATTERNS[payload[i + 1]]
    for (let j = 0; j < 5; j += 1) {
      runs.push(width(bars[j]), width(spaces[j]))
    }
  }

  runs.push(...extra)
  runs.push(WIDE, NARROW, NARROW)
  return runs
}

describe('Code 2 of 5 decoder robustness', () => {
  test('decodes a valid standard symbol from run widths', () => {
    expect(decoder(standardLines('12345670'))).toBe('12345670')
  })

  test('decodes a valid interleaved symbol from run widths', () => {
    expect(decoder(interleavedLines('12345670'), 'interleaved')).toBe('12345670')
  })

  test('emits ? for an unknown standard group', () => {
    const unknown = [NARROW, NARROW, NARROW, NARROW, NARROW, NARROW, NARROW, NARROW, NARROW, NARROW]
    const result = decoder(standardLines('1', unknown))

    expect(result).toBe('1?')
    expect(result).not.toContain('-1')
  })

  test('emits ? at the unknown interleaved position', () => {
    const unknownBars = [NARROW, NARROW, NARROW, NARROW, NARROW]
    const knownSpaces = DIGIT_PATTERNS['0'].split('').map(width)
    const unknownPair: number[] = []

    for (let i = 0; i < 5; i += 1) {
      unknownPair.push(unknownBars[i], knownSpaces[i])
    }

    expect(decoder(interleavedLines('', unknownPair), 'interleaved')).toBe('?0')
  })

  test('emits ? for a trailing short standard segment', () => {
    expect(decoder(standardLines('1', [NARROW, NARROW, NARROW, NARROW]))).toBe('1?')
  })

  test('emits ? for a trailing short interleaved segment', () => {
    expect(decoder(interleavedLines('12', [NARROW, NARROW, NARROW, NARROW]), 'interleaved')).toBe(
      '12?'
    )
  })

  test('returns empty string for invalid standard guards', () => {
    const invalidStart = standardLines('1')
    invalidStart[0] = NARROW
    expect(decoder(invalidStart)).toBe('')

    const invalidEnd = standardLines('1')
    invalidEnd[invalidEnd.length - 1] = NARROW
    expect(decoder(invalidEnd)).toBe('')
  })

  test('returns empty string for invalid interleaved guards', () => {
    const invalidStart = interleavedLines('12')
    invalidStart[0] = WIDE
    expect(decoder(invalidStart, 'interleaved')).toBe('')

    const invalidEnd = interleavedLines('12')
    invalidEnd[invalidEnd.length - 1] = WIDE
    expect(decoder(invalidEnd, 'interleaved')).toBe('')
  })

  test('returns empty string for empty and short inputs', () => {
    expect(decoder([])).toBe('')
    expect(decoder([NARROW, NARROW, NARROW])).toBe('')
    expect(decoder([NARROW, NARROW, NARROW], 'interleaved')).toBe('')
    expect(decoder(interleavedLines(''), 'interleaved')).toBe('')
  })
})

describe('Code 2 of 5 sample expectations', () => {
  test('decodes standard sample to 12345670', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-2of5.jpg'),
      barcode: 'code-2of5',
    })

    expect(result).toBe('12345670')
  })

  test('decodes interleaved sample to 12345670', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-2of5-interleaved.jpg'),
      barcode: 'code-2of5',
      barcodeType: 'interleaved',
    })

    expect(result).toBe('12345670')
  })
})
