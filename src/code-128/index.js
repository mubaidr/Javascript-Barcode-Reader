module.exports = lines => {
  const binary = []

  // extract terminal bar
  lines.pop()

  const barThreshold = Math.ceil(
    lines.reduce((pre, item) => (pre + item) / 2, 0)
  )

  let minBarWidth = lines.reduce((pre, item) => {
    if (item <= barThreshold) return (pre + item) / 2
    return pre
  }, 0)

  minBarWidth = Math.min(...lines)

  lines.forEach((line, index) => {
    while (line - minBarWidth >= 0) {
      if (index % 2 === 0) {
        binary.push(1)
      } else {
        binary.push(0)
      }

      line -= minBarWidth
    }
  })

  console.log(lines)
}
