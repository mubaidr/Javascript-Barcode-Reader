import { decoder } from '../src/pharmacode'

const NARROW = 2
const WIDE = 4
const SPACE = 1

// getLines returns alternating bar/space run widths, starting with a bar.
function linesFor(bars: number[], spaces: number[] = []): number[] {
  const lines: number[] = []

  bars.forEach((bar, index) => {
    lines.push(bar)

    if (index < bars.length - 1) {
      lines.push(spaces[index] === undefined ? SPACE : spaces[index])
    }
  })

  return lines
}

describe('Pharmacode decoder from run widths', () => {
  test('decodes 3 from two narrow bars', () => {
    expect(decoder(linesFor([NARROW, NARROW]))).toBe('3')
  })

  test('decodes 7 from three narrow bars', () => {
    expect(decoder(linesFor([NARROW, NARROW, NARROW]))).toBe('7')
  })

  test('decodes 31 from five narrow bars', () => {
    expect(
      decoder(linesFor([NARROW, NARROW, NARROW, NARROW, NARROW]))
    ).toBe('31')
  })

  test('decodes 91 from a mixed narrow/wide sequence', () => {
    // narrow, wide, wide, wide, narrow, narrow folds to 91.
    expect(
      decoder(linesFor([NARROW, WIDE, WIDE, WIDE, NARROW, NARROW]))
    ).toBe('91')
  })

  test('ignores spaces between bars', () => {
    const bars = [NARROW, WIDE, WIDE, WIDE, NARROW, NARROW]

    expect(decoder(linesFor(bars, [9, 1, 7, 3, 5]))).toBe('91')
    expect(decoder(linesFor(bars, [NaN, -1, 0, 100, 0.25]))).toBe('91')
  })

  test('normalizes scaled run widths by the narrow bar unit', () => {
    expect(
      decoder(linesFor([NARROW * 3, NARROW * 3, NARROW * 3]))
    ).toBe('7')

    expect(
      decoder(
        linesFor(
          [
            NARROW * 3,
            WIDE * 3,
            WIDE * 3,
            WIDE * 3,
            NARROW * 3,
            NARROW * 3,
          ],
          [3, 3, 3, 3, 3]
        )
      )
    ).toBe('91')
  })

  test('decodes symbols with more than eight runs', () => {
    const bars = [
      WIDE,
      WIDE,
      WIDE,
      WIDE,
      WIDE,
      WIDE,
      WIDE,
      WIDE,
      WIDE,
      WIDE,
      WIDE,
      WIDE,
      WIDE,
      WIDE,
      WIDE,
      NARROW,
    ]

    expect(decoder(linesFor(bars))).toBe('131069')
  })

  test('returns empty below the minimum value', () => {
    expect(decoder([])).toBe('')
    expect(decoder([NARROW])).toBe('')
    expect(decoder([WIDE])).toBe('')
  })

  test('returns empty above the maximum value', () => {
    const bars = Array.from({ length: 17 }, () => NARROW)

    expect(decoder(linesFor(bars))).toBe('')
  })

  test('returns empty for all-zero or non-positive bar widths', () => {
    expect(decoder([0, 0, 0, 0])).toBe('')
    expect(decoder([NARROW, SPACE, 0])).toBe('')
    expect(decoder([-NARROW, SPACE, NARROW])).toBe('')
  })

  test('returns empty for non-finite bar widths', () => {
    expect(decoder([NaN, SPACE, NARROW])).toBe('')
    expect(decoder([NARROW, SPACE, Infinity])).toBe('')
    expect(decoder([NARROW, SPACE, -Infinity])).toBe('')
  })

  test('returns empty for missing input', () => {
    expect(decoder(undefined as unknown as number[])).toBe('')
  })
})
