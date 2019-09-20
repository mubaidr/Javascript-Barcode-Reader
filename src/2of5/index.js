const CHAR_SET = [
  'nnwwn',
  'wnnnw',
  'nwnnw',
  'wwnnn',
  'nnwnw',
  'wnwnn',
  'nwwnn',
  'nnnww',
  'wnnwn',
  'nwnwn',
]

module.exports = (lines, type = 'standard') => {
  const code = []

  const barThreshold = Math.ceil(
    lines.reduce((pre, item) => (pre + item) / 2, 0)
  )

  if (type === 'interleaved') {
    // extract start/ends pair
    const startChar = lines
      .splice(0, 4)
      .map(line => (line > barThreshold ? 'w' : 'n'))
      .join('')

    const endChar = lines
      .splice(lines.length - 3, 3)
      .map(line => (line > barThreshold ? 'w' : 'n'))
      .join('')

    if (startChar !== 'nnnn' || endChar !== 'wnn') return null

    // Read one encoded character at a time.
    while (lines.length > 0) {
      const seg = lines.splice(0, 10)

      const a = seg
        .filter((item, index) => index % 2 === 0)
        .map(line => (line > barThreshold ? 'w' : 'n'))
        .join('')

      code.push(CHAR_SET.indexOf(a))

      const b = seg
        .filter((item, index) => index % 2 !== 0)
        .map(line => (line > barThreshold ? 'w' : 'n'))
        .join('')

      code.push(CHAR_SET.indexOf(b))
    }
  } else if (type === 'standard') {
    // extract start/ends pair

    const startChar = lines
      .splice(0, 6)
      .filter((item, index) => index % 2 === 0)
      .map(line => (line > barThreshold ? 'w' : 'n'))
      .join('')

    const endChar = lines
      .splice(lines.length - 5, 5)
      .filter((item, index) => index % 2 === 0)
      .map(line => (line > barThreshold ? 'w' : 'n'))
      .join('')

    if (startChar !== 'wwn' || endChar !== 'wnw') return null

    // Read one encoded character at a time.
    while (lines.length > 0) {
      const a = lines
        .splice(0, 10)
        .filter((item, index) => index % 2 === 0)
        .map(line => (line > barThreshold ? 'w' : 'n'))
        .join('')

      code.push(CHAR_SET.indexOf(a))
    }
  }

  return code.join('')
}
