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
    lines.reduce((pre, item) => (pre + item) / 2, 0)
  )

  const minBarWidth = Math.ceil(
    lines.reduce((pre, item) => {
      if (item < barThreshold) return (pre + item) / 2
      return pre
    }, 0)
  )

  if (type === 'interleaved') {
    // TODO: finish this
    console.log(lines, barThreshold, minBarWidth, type)
    // extract start/ends pair
    const startChar = lines
      .splice(0, 4)
      .map(line => (line < barThreshold ? 'n' : 'w'))
      .join('')

    const endChar = lines
      .splice(lines.length - 3, 3)
      // .filter((item, index) => index % 2 === 0)
      .map(line => (line < barThreshold ? 'n' : 'w'))
      .join('')

    console.log(startChar, endChar)

    if (startChar !== 'nnnn' || endChar !== 'wnn') return null
  } else {
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
      lines
        .splice(0, 10)
        .filter((item, index) => index % 2 === 0)
        .map(line => sequenceBar.push(line > barThreshold ? 'w' : 'n'))
    }

    // Convert bars pattern to integers.
    while (sequenceBar.length > 0) {
      code.push(CHAR_SET.indexOf(sequenceBar.splice(0, 5).join('')))
    }
  }

  return code.join('')
}
