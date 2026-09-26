import { decoder } from '../src/code-93'

const patterns: { [key: string]: string } = {
  '3': '101000010',
  A: '110101000',
  C: '110100010',
  P: '100010110',
  U: '110010110',
  '*': '101011110',
}

function linesFor(symbol: string): number[] {
  const bits = symbol.split('').map(char => patterns[char]).join('') + '1'
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

describe('Code 93 K checksum', () => {
  test('accepts a 15 character symbol whose K weight wraps at 15', () => {
    const payload = 'A'.repeat(15)
    expect(decoder(linesFor(`*${payload}P3*`))).toBe(payload)
  })

  test('rejects the K digit produced by wrapping at 20', () => {
    const payload = 'A'.repeat(15)
    expect(decoder(linesFor(`*${payload}PC*`))).toBe('')
  })

  test('still accepts a one character symbol', () => {
    expect(decoder(linesFor('*AAU*'))).toBe('A')
  })
})
