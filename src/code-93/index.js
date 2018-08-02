const CHAR_SET = {
  '100010100': '0',
  '101001000': '1',
  '101000100': '2',
  '101000010': '3',
  '100101000': '4',
  '100100100': '5',
  '100100010': '6',
  '101010000': '7',
  '100010010': '8',
  '100001010': '9',
  '110101000': 'A',
  '110100100': 'B',
  '110100010': 'C',
  '110010100': 'D',
  '110010010': 'E',
  '110001010': 'F',
  '101101000': 'G',
  '101100100': 'H',
  '101100010': 'I',
  '100110100': 'J',
  '100011010': 'K',
  '101011000': 'L',
  '101001100': 'M',
  '101000110': 'N',
  '100101100': 'O',
  '100010110': 'P',
  '110110100': 'Q',
  '110110010': 'R',
  '110101100': 'S',
  '110100110': 'T',
  '110010110': 'U',
  '110011010': 'V',
  '101101100': 'W',
  '101100110': 'X',
  '100110110': 'Y',
  '100111010': 'Z',
  '100101110': '-',
  '111010100': '.',
  '111010010': ' ',
  '111001010': '$',
  '101101110': '/',
  '101110110': '+',
  '110101110': '%',
  '100100110': '($)',
  '111011010': '(%)',
  '111010110': '(/)',
  '100110010': '(+)',
  '101011110': '*',
}

module.exports = lines => {
  // manualy push last white space
  // lines.push(0)
  let code = ''

  console.log('Lines Count: \n', lines.length)
  console.log('Lines: \n', lines)

  const binary = []

  const barThreshold = Math.ceil(
    lines.slice(1).reduce((pre, item) => pre + item, 0) / lines.length
  )

  let sum = 0
  let count = 0
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i] < barThreshold) {
      sum += lines[i]
      count += 1
    }
  }
  const minBarWidth = sum / count

  lines.shift()
  lines.pop()
  // leave the padded *
  for (let i = 0; i < lines.length - 1; i += 1) {
    let segment = lines[i]
    // const result = ''
    // const barThreshold = Math.ceil(
    //   segment.reduce((pre, item) => pre + item, 0) / segment.length
    // )
    // const noob = segment.map(item => (item > barThreshold ? 1 : 0)).join('')

    while (segment >= 0) {
      if (i % 2 === 0) {
        binary.push(1)
      } else {
        binary.push(0)
      }
      segment -= minBarWidth
    }
  }

  console.log(binary)

  return code
}
