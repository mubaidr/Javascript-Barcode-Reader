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

export function decoder(lines: number[]): string {
  const code = []

  const barThreshold = Math.ceil(lines.reduce((pre, item) => (pre + item) / 2, 0))

  // Read one encoded character at a time.
  while (lines.length > 0) {
    const seg = lines.splice(0, 8).splice(0, 7)
    const a = seg.map(line => (line < barThreshold ? 'n' : 'w')).join('')

    code.push(CHAR_SET[a])
  }

  return code.join('')
}
