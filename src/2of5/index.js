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
const WEIGHTS = [1, 2, 4, 7, 0]

module.exports = (lines, type = 'interleaved ') => {
  let code = []
  const binary = []
  const sequenceBar = []
  const sequenceSpace = []

  // remove empty whitespaces
  lines.shift()
  lines.pop()

  const barThreshold = Math.ceil(
    lines.reduce((pre, item) => pre + item, 0) / lines.length
  )

  // extract start pair
  const startChar = lines
    .splice(0, 4)
    .map(line => (line > barThreshold ? 1 : 0))
    .join('')
  const endChar = lines
    .splice(lines.length - 4, 4)
    .map(line => (line > barThreshold ? 1 : 0))
    .join('')

  console.log(startChar, endChar)

  for (let i = 0; i < lines.length; i += 1) {
    let segment = lines[i]

    const isEven = i % 2 === 0
    if (isEven) {
      sequenceBar.push(segment > barThreshold ? 'w' : 'n')
    } else {
      sequenceSpace.push(segment > barThreshold ? 'w' : 'n')
    }
  }

  // for (let i = 0; i < sequenceBar.length; i += 5) {
  //   const segBar = sequenceBar.slice(i, i + 5).join('')
  //   const segSpace = sequenceSpace.slice(i, i + 5).join('')

  //   console.log(segBar, segSpace)
  // }

  console.log(sequenceBar, sequenceSpace)

  return code.join('')
}
