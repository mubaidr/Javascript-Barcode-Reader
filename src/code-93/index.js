const BAR_SET = {
  '10001': '1',
  '01001': '2',
  '11000': '3',
  '00101': '4',
  '10100': '5',
  '01100': '6',
  '00011': '7',
  '10010': '8',
  '01010': '9',
  '00110': '10',
}

const GROUP_SET = {
  '01000': '0',
  '00100': '10',
  '00010': '20',
  '10000': '30',
}

const CHAR_SET = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '-',
  '.',
  '␣',
  '*',
]

const decode = lines => {
  // manualy push last white space
  lines.push(3)
  let code = ''

  for (let i = 1; i < lines.length; i += 10) {
    const segment = lines.slice(i, i + 10)

    const barThreshold = Math.round(
      segment.reduce((pre, item) => pre + item, 0) / segment.length
    )

    const noob = segment.map(item => (item > barThreshold ? 1 : 0))
    const barSeg = noob.filter((item, index) => index % 2 === 0).join('')
    const whiteSeg = noob.filter((item, index) => index % 2 !== 0).join('')

    code +=
      CHAR_SET[
        parseInt(BAR_SET[barSeg], 10) - 1 + parseInt(GROUP_SET[whiteSeg], 10)
      ]
  }

  return code.substring(1, code.length - 1)
}

module.exports = {
  decode,
}
