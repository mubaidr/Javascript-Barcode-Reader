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

const barcodeDecoder = (imgOrId, options) => {
  const doc = document
  const img =
    typeof imgOrId === 'object' ? imgOrId : doc.getElementById(imgOrId)
  const width = img.naturalWidth
  const height = img.naturalHeight

  const canvas = doc.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  console.log(options)

  // check points for barcode location
  const spoints = [1, 9, 2, 8, 3, 7, 4, 6, 5]
  let numLines = spoints.length
  const slineStep = height / (numLines + 1)

  ctx.drawImage(img, 0, 0)

  // eslint-disable-next-line
  while ((numLines -= 1)) {
    // create section of height 2
    const pxLine = ctx.getImageData(0, slineStep * spoints[numLines], width, 2)
      .data
    const sum = []
    let min = 0
    let max = 0

    // grey scale section and sum of columns pixels in section
    for (let row = 0; row < 2; row += 1) {
      for (let col = 0; col < width; col += 1) {
        const i = (row * width + col) * 4
        const g = (pxLine[i] * 3 + pxLine[i + 1] * 4 + pxLine[i + 2] * 2) / 9
        const s = sum[col]

        pxLine[i] = g
        pxLine[i + 1] = g
        pxLine[i + 2] = g

        sum[col] = g + (s === undefined ? 0 : s)
      }
    }

    for (let i = 0; i < width; i += 1) {
      sum[i] /= 2
      const s = sum[i]

      if (s < min) {
        min = s
      }
      if (s > max) {
        max = s
      }
    }

    // matches columns in two rows
    const pivot = min + (max - min) / 2
    const bmp = []

    for (let col = 0; col < width; col += 1) {
      let matches = 0
      for (let row = 0; row < 2; row += 1) {
        if (pxLine[(row * width + col) * 4] > pivot) {
          matches += 1
        }
      }
      bmp.push(matches > 1)
    }

    // matches width of barcode lines
    let curr = bmp[0]
    let count = 1
    const lines = []

    for (let col = 0; col < width; col += 1) {
      if (bmp[col] === curr) {
        count += 1
      } else {
        lines.push(count)
        count = 1
        curr = bmp[col]
      }
    }

    let code = ''
    // start indicator/reference lines
    const bar = ~~((lines[1] + lines[2] + lines[3]) / 3) //eslint-disable-line

    for (let i = 1; i < lines.length; i += 1) {
      let group

      if (code.length < 6) {
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

      code +=
        UPC_SET[digits.join('')] || UPC_SET[digits.reverse().join('')] || 'X'

      if (code.length === 12) {
        return code
        // eslint-disable-next-line
        break
      }
    }
    if (code.indexOf('X') === -1) {
      return code || false
    }
  }
  return false
}

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = barcodeDecoder
    module.exports = barcodeDecoder
  }
  exports.barcodeDecoder = barcodeDecoder
} else {
  root.barcodeDecoder = barcodeDecoder
}
