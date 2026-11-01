import * as path from 'path'
import javascriptBarcodeReader from '../src/index'
import { decoder as code39Decoder } from '../src/code-39'
import { decoder as codabarDecoder } from '../src/codabar'

const CODE39_PATTERNS: { [key: string]: string } = {
  '0': 'nnnwwnwnn',
  '1': 'wnnwnnnnw',
  '2': 'nnwwnnnnw',
  '3': 'wnwwnnnnn',
  '*': 'nwnnwnwnn',
  '-': 'nwnnnnwnw',
  A: 'wnnnnwnnw',
}

const CODABAR_PATTERNS: { [key: string]: string } = {
  '0': 'nnnnnww',
  '1': 'nnnnwwn',
  '2': 'nnnwnnw',
  '3': 'wwnnnnn',
  '4': 'nnwnnwn',
  '5': 'wnnnnwn',
  '6': 'nwnnnnw',
  ':': 'wnnnwnw',
  A: 'nnwwnwn',
  B: 'nnnwnww',
  C: 'nwnwnnw',
  D: 'nnnwwwn',
}

function patternWidths(pattern: string): number[] {
  return pattern.split('').map((element) => (element === 'w' ? 3 : 1))
}

function buildCode39(patterns: string[]): number[] {
  const lines: number[] = []

  patterns.forEach((pattern, index) => {
    lines.push(...patternWidths(pattern))

    if (index < patterns.length - 1) lines.push(1)
  })

  return lines
}

function code39Patterns(symbols: string): string[] {
  return symbols.split('').map((symbol) => CODE39_PATTERNS[symbol])
}

function buildCodabar(patterns: string[]): number[] {
  const lines: number[] = []

  patterns.forEach((pattern, index) => {
    lines.push(...patternWidths(pattern))

    if (index < patterns.length - 1) lines.push(1)
  })

  return lines
}

function codabarPatterns(symbols: string): string[] {
  return symbols.split('').map((symbol) => CODABAR_PATTERNS[symbol])
}

describe('Code 39 robustness', () => {
  test('decodes valid synthetic symbols with star guards', () => {
    expect(code39Decoder(buildCode39(code39Patterns('*123*')))).toBe('123')
    expect(code39Decoder(buildCode39(code39Patterns('*A-1*')))).toBe('A-1')
  })

  test('returns empty for an unknown pattern instead of silently dropping it', () => {
    const lines = buildCode39([
      CODE39_PATTERNS['*'],
      CODE39_PATTERNS['1'],
      'nnnnnnnnn',
      CODE39_PATTERNS['3'],
      CODE39_PATTERNS['*'],
    ])

    const result = code39Decoder(lines)

    expect(result).toBe('')
    expect(result).not.toContain('undefined')
  })

  test('requires star start and stop guards', () => {
    expect(code39Decoder(buildCode39(code39Patterns('123')))).toBe('')
    expect(code39Decoder(buildCode39(code39Patterns('*123')))).toBe('')
    expect(code39Decoder(buildCode39(code39Patterns('123*')))).toBe('')
    expect(code39Decoder(buildCode39(code39Patterns('A1*')))).toBe('')
  })

  test('rejects trailing short segments', () => {
    const lines = buildCode39(code39Patterns('*123*'))
    lines.push(1, 1)

    expect(code39Decoder(lines)).toBe('')
  })

  test('returns empty for empty input', () => {
    expect(code39Decoder([])).toBe('')
  })
})

describe('Codabar robustness', () => {
  test('decodes valid synthetic symbols and preserves guards', () => {
    expect(codabarDecoder(buildCodabar(codabarPatterns('A40156C')))).toBe('A40156C')
    expect(codabarDecoder(buildCodabar(codabarPatterns('B123D')))).toBe('B123D')
  })

  test('returns empty for an unknown pattern instead of silently dropping it', () => {
    const patterns = codabarPatterns('A40156C')
    patterns[3] = 'nnnnnnn'

    expect(codabarDecoder(buildCodabar(patterns))).toBe('')
  })

  test('requires A-D guards at both ends', () => {
    expect(codabarDecoder(buildCodabar(codabarPatterns('40156C')))).toBe('')
    expect(codabarDecoder(buildCodabar(codabarPatterns('A40156')))).toBe('')
    expect(codabarDecoder(buildCodabar(codabarPatterns('0401560')))).toBe('')
    expect(codabarDecoder(buildCodabar(codabarPatterns(':40156:')))).toBe('')
  })

  test('rejects trailing short segments', () => {
    const lines = buildCodabar(codabarPatterns('A40156C'))
    lines.push(1, 1)

    expect(codabarDecoder(lines)).toBe('')
  })

  test('returns empty for empty input', () => {
    expect(codabarDecoder([])).toBe('')
  })
})

describe('Code 39 and Codabar sample regressions', () => {
  test('decodes code-39.jpg to 10023', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-39.jpg'),
      barcode: 'code-39',
    })

    expect(result).toBe('10023')
  })

  test('decodes codabar.jpg to A40156C', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/codabar.jpg'),
      barcode: 'codabar',
    })

    expect(result).toBe('A40156C')
  })

  test('decodes codabar.jpg with singlePass to A40156C', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/codabar.jpg'),
      barcode: 'codabar',
      options: {
        singlePass: true,
      },
    })

    expect(result).toBe('A40156C')
  })
})
