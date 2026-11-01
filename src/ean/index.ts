const UPC_SET: {
  [key: string]: string
} = {
  '3211': '0',
  '2221': '1',
  '2122': '2',
  '1411': '3',
  '1132': '4',
  '1231': '5',
  '1114': '6',
  '1312': '7',
  '1213': '8',
  '3112': '9',
}

// EAN-13 encodes its first digit in the L/G parity of the six left-hand digits.
const EAN13_FIRST_DIGIT: {
  [key: string]: string
} = {
  LLLLLL: '0',
  LLGLGG: '1',
  LLGGLG: '2',
  LLGGGL: '3',
  LGLLGG: '4',
  LGGLLG: '5',
  LGGGLL: '6',
  LGLGLG: '7',
  LGLGGL: '8',
  LGGLGL: '9',
}

// UPC-E carries no centre guard; its number system and check digit are implied by
// the L/G parity of the six decoded digits (ZXing parity tables).
// Maps the six-bit L/G parity value to "numberSystem + checkDigit".
const UPC_E_PAIRS: {
  [key: string]: string
} = {
  '56': '00', '52': '01', '50': '02', '49': '03', '44': '04', '38': '05', '35': '06',
  '42': '07', '41': '08', '37': '09', '7': '10', '11': '11', '13': '12', '14': '13',
  '19': '14', '25': '15', '28': '16', '21': '17', '22': '18', '26': '19'
}

export function decoder(lines: number[], type = '13'): string {
  let code = ''
  let parity = ''

  const bar = (lines[0] + lines[1] + lines[2]) / 3

  lines.shift()
  lines.shift()
  lines.shift()

  lines.pop()
  lines.pop()
  lines.pop()

  if (type === '13' || type === 'A') {
    lines.splice(24, 5)
  } else if (type === '8') {
    lines.splice(16, 5)
  } else if (type === 'E') {
    lines.splice(24, 3)
  }

  for (let i = 0; i < lines.length; i += 4) {
    const group = lines.slice(i, i + 4)

    const digits = [group[0] / bar, group[1] / bar, group[2] / bar, group[3] / bar].map((digit) =>
      digit === 1.5 ? 1 : Math.round(digit)
    )

    const direct = UPC_SET[digits.join('')]
    const result = direct || UPC_SET[digits.reverse().join('')]

    if (result) {
      code += result

      if ((type === '13' || type === 'E') && i < 24) {
        parity += direct ? 'L' : 'G'
      }
    } else {
      code += '?'

      if ((type === '13' || type === 'E') && i < 24) {
        parity += '?'
      }
    }
  }

  if (type === '13') {
    code = (EAN13_FIRST_DIGIT[parity] || '?') + code
  }

  if (type === 'E') {
    let parityValue = 0
    for (let i = 0; i < parity.length; i += 1) {
      if (parity[i] > 'F' && parity[i] < 'H') {
        parityValue |= 1 << (5 - i)
      }
    }
    const pair = UPC_E_PAIRS[String(parityValue)]
    code = pair ? pair[0] + code + pair[1] : ''
  }

  return code
}
