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

export function decoder(lines: number[], type = '13'): string {
  let code = ''

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
    lines.splice(20, 5)
  }

  for (let i = 0; i < lines.length; i += 4) {
    const group = lines.slice(i, i + 4)

    const digits = [group[0] / bar, group[1] / bar, group[2] / bar, group[3] / bar].map((digit) =>
      digit === 1.5 ? 1 : Math.round(digit)
    )

    const result = UPC_SET[digits.join('')] || UPC_SET[digits.reverse().join('')]

    if (result) {
      code += result
    } else {
      code += '?'
    }
  }

  if (type === 'E') {
    const lastDigit = code.charCodeAt(code.length - 1) - 48
    const numberSystem = code.substring(0, 6)
    let expanded = ''

    switch (lastDigit) {
      case 0:
        expanded = numberSystem + '0000' + lastDigit
        break
      case 1:
        expanded = numberSystem + '1000' + lastDigit
        break
      case 2:
        expanded = numberSystem + '2000' + lastDigit
        break
      case 3:
        expanded = numberSystem.substring(0, 3) + '0000' + numberSystem.substring(3)
        break
      case 4:
        expanded = numberSystem.substring(0, 4) + '00000' + numberSystem.substring(4, 5)
        break
      default:
        expanded = numberSystem + '00000' + lastDigit
    }
    code = expanded
  }

  return code
}
