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

  // start indicator/reference lines
  const bar = (lines[0] + lines[1] + lines[2]) / 3

  // remove start pattern
  lines.shift()
  lines.shift()
  lines.shift()

  // remove end pattern
  lines.pop()
  lines.pop()
  lines.pop()

  // remove middle check pattern

  // remove middle check pattern
  if (type === '13') {
    lines.splice(24, 5)
  } else {
    lines.splice(16, 5)
  }

  for (let i = 0; i < lines.length; i += 4) {
    const group = lines.slice(i, i + 4)

    const digits = [group[0] / bar, group[1] / bar, group[2] / bar, group[3] / bar].map(digit =>
      digit === 1.5 ? 1 : Math.round(digit)
    )

    const result = UPC_SET[digits.join('')] || UPC_SET[digits.reverse().join('')]

    if (result) {
      code += result
    } else {
      code += '?'
    }
  }

  return code
}
