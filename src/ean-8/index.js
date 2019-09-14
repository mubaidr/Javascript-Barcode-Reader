const UPC_SET = {
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

module.exports = lines => {
  let code = ''
  // manually add start dummy line
  lines.unshift(0)
  // start indicator/reference lines
  const bar = ~~((lines[1] + lines[2] + lines[3]) / 3) //eslint-disable-line

  for (let i = 1; i < lines.length; i += 1) {
    let group

    if (code.length < 4) {
      group = lines.slice(i * 4, i * 4 + 4)
    } else {
      group = lines.slice(i * 4 + 5, i * 4 + 9)
    }

    const digits = [
      Math.round(group[0] / bar),
      Math.round(group[1] / bar),
      Math.round(group[2] / bar),
      Math.round(group[3] / bar),
    ]

    const result =
      UPC_SET[digits.join('')] || UPC_SET[digits.reverse().join('')]

    if (result) {
      code += result
    }

    // if (code.length === 8) break
  }

  return code
}
