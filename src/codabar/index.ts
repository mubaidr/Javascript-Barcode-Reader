const CHAR_SET: {
  [key: string]: string
} = {
  nnnnnww: '0',
  nnnnwwn: '1',
  nnnwnnw: '2',
  wwnnnnn: '3',
  nnwnnwn: '4',
  wnnnnwn: '5',
  nwnnnnw: '6',
  nwnnwnn: '7',
  nwwnnnn: '8',
  wnnwnnn: '9',
  nnnwwnn: '-',
  nnwwnnn: '$',
  wnnnwnw: ':',
  wnwnnnw: '/',
  wnwnwnn: '.',
  nnwwwww: '+',
  nnwwnwn: 'A',
  nnnwnww: 'B',
  nwnwnnw: 'C',
  nnnwwwn: 'D',
}

const GUARDS = 'ABCD'

export function decoder(lines: number[]): string {
  const code = []

  if (lines.length === 0) {
    return ''
  }

  const barThreshold = Math.ceil(lines.reduce((pre, item) => pre + item, 0) / lines.length)

  // Read one encoded character at a time.
  while (lines.length > 0) {
    const seg = lines.splice(0, 8).splice(0, 7)
    const a = seg.map((line) => (line < barThreshold ? 'n' : 'w')).join('')

    const char = CHAR_SET[a]
    if (char === undefined) {
      return ''
    }
    code.push(char)
  }

  // Validate start/stop guards are A-D.
  if (code.length === 0 || GUARDS.indexOf(code[0]) === -1 || GUARDS.indexOf(code[code.length - 1]) === -1) {
    return ''
  }

  return code.join('')
}
