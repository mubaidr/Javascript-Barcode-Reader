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

module.exports = (lines, type = 'interleaved') => {
  let code = []
  const sequenceBar = []

  const barThreshold = Math.ceil(
    lines.reduce((pre, item) => pre + item, 0) / lines.length
  )

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

  // TODO: implement interleaved
  // Read one encoded character at a time.
  while (lines.length > 0) {
    lines
      .splice(0, 10)
      .filter((item, index) => index % 2 === 0)
      .map(line => sequenceBar.push(line > barThreshold ? 'w' : 'n'))
  }

  // Convert bars pattern to integers.
  while (sequenceBar.length > 0) {
    code.push(CHAR_SET.indexOf(sequenceBar.splice(0, 5).join('')))
  }

  return code.join('')
}
