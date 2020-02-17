const CHAR_SET: {
  [key: string]: string
} = {
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
  '101011110': '*'
}

export function decoder(lines: number[]): string {
  const code = []
  const binary = []

  // remove termination bar
  lines.pop()

  const barThreshold = Math.ceil(lines.reduce((pre, item) => pre + item, 0) / lines.length)
  const minBarWidth = Math.ceil(
    lines.reduce((pre, item) => {
      if (item < barThreshold) return (pre + item) / 2
      return pre
    }, 0)
  )

  function getLetterIndex(letter: string): number {
    const keys = Object.keys(CHAR_SET)

    for (let i = 0; i < keys.length; i += 1) {
      if (CHAR_SET[keys[i]] === letter) {
        return i
      }
    }

    return 0
  }

  // leave the padded *
  for (let i = 0; i < lines.length; i += 1) {
    let segment = lines[i]

    while (segment > 0) {
      if (i % 2 === 0) {
        binary.push(1)
      } else {
        binary.push(0)
      }
      segment -= minBarWidth
    }
  }

  for (let i = 0; i < binary.length; i += 9) {
    const searcKey = binary.slice(i, i + 9).join('')
    code.push(CHAR_SET[searcKey])
  }

  if (code.shift() !== '*' || code.pop() !== '*') return ''

  let sum: number
  let value: number

  const K = code.pop()
  sum = 0

  for (let i = code.length - 1; i >= 0; i -= 1) {
    value = getLetterIndex(code[i])
    sum += value * (1 + ((code.length - (i + 1)) % 20))
  }

  if (CHAR_SET[sum % 47] !== K) return ''

  const C = code.pop()
  sum = 0

  for (let i = code.length - 1; i >= 0; i -= 1) {
    value = getLetterIndex(code[i])
    sum += value * (1 + ((code.length - (i + 1)) % 20))
  }

  if (CHAR_SET[sum % 47] !== C) return ''

  return code.join('')
}
