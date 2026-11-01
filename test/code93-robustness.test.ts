import * as path from 'path'
import javascriptBarcodeReader from '../src/index'
import { decoder } from '../src/code-93'

const patterns: { [key: string]: string } = {
  '0': '100010100',
  '1': '101001000',
  '2': '101000100',
  '3': '101000010',
  A: '110101000',
  B: '110100100',
  C: '110100010',
  U: '110010110',
  Z: '100111010',
  '(/)': '111010110',
  '*': '101011110',
}

function toRunWidths(bits: string): number[] {
  const runs: number[] = []
  let count = 1

  for (let i = 1; i < bits.length; i += 1) {
    if (bits[i] === bits[i - 1]) {
      count += 1
    } else {
      runs.push(count)
      count = 1
    }
  }

  runs.push(count)
  return runs
}

function linesFor(symbols: string[]): number[] {
  const bits = symbols.map((symbol) => patterns[symbol]).join('')

  // trailing bar is removed by the decoder before run expansion
  return toRunWidths(`${bits}1`)
}

describe('Code 93 robustness', () => {
  test('empty, all-zero, and zero-unit inputs return empty without hanging', () => {
    const malformed = [[], [0, 0, 0], [0, 0, 0, 0], [5, 5, 5]]

    malformed.forEach((lines) => {
      const result = decoder([...lines])

      expect(result).toBe('')
      expect(result).not.toContain('undefined')
    })
  })

  test('unknown 9-bit pattern returns empty and never throws', () => {
    // 8 bar modules + 1 space module expand to the unknown pattern 111111110
    expect(() => decoder([8, 1, 1])).not.toThrow()
    expect(decoder([8, 1, 1])).toBe('')
  })

  test('unknown pattern inside a starred symbol returns empty without a checksum throw', () => {
    const lines = toRunWidths(
      `${patterns['*']}111111110${patterns['2']}${patterns['0']}${patterns['*']}1`
    )

    expect(() => decoder([...lines])).not.toThrow()
    expect(decoder([...lines])).toBe('')
  })

  test('decodes a valid synthetic symbol with C and K checks', () => {
    // payload 123ABC has C = (/) and K = Z
    const lines = linesFor(['*', '1', '2', '3', 'A', 'B', 'C', '(/)', 'Z', '*'])

    expect(decoder([...lines])).toBe('123ABC')
  })
})

describe('Code 93 sample regression', () => {
  test('code-93.jpg still decodes to 123ABC', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-93.jpg'),
      barcode: 'code-93',
    })

    expect(result).toBe('123ABC')
  })

  test('code-93-no-padding.jpg still decodes to WIKIPEDIA', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-93-no-padding.jpg'),
      barcode: 'code-93',
    })

    expect(result).toBe('WIKIPEDIA')
  })
})
