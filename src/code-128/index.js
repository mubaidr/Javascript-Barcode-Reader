const CHAR_SET = {}

module.exports = lines => {
  let code = []
  const binary = []
  const barWidths = []
  let linestemp = lines.slice()

  // remove termination bars
  // lines.pop()

  const barThreshold = lines.reduce((pre, item) => (pre + item) / 2, 0)

  let minBarWidth = lines.reduce((pre, item) => {
    if (item < barThreshold) return (pre + item) / 2
    return pre
  }, 0)
  // minBarWidth = mode(lines)
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
  linestemp.pop()
  while (linestemp.length > 0) {
    let seg = linestemp.splice(0, 6)
    let minWidth = seg.reduce((pre, item) => pre + item, 0) / 11
    barWidths.push(seg.map(item => Math.round(item / minWidth)))
  }
  // Start char
  const startChar = binary.splice(0, 11).join('')
  while (binary.length > 0) {
    let a = binary.splice(0, 11).join('')
  }
  let table = CTable

  switch (startChar) {
    case '11010000100':
      table = ATable
      break
    case '11010010000':
      table = BTable
      break
  }

  return code.join('')
}

function mode(array) {
  if (array.length == 0) return null
  let modeMap = {}
  let maxEl = array[0],
    maxCount = 1
  for (let i = 0; i < array.length; i++) {
    let el = array[i]
    if (modeMap[el] == null) modeMap[el] = 1
    else modeMap[el]++
    if (modeMap[el] > maxCount) {
      maxEl = el
      maxCount = modeMap[el]
    }
  }
  return maxEl
}
