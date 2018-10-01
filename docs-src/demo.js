const barcodeDecoder = require('../src')

const buttons = document.getElementsByTagName('button')

for (let i = 0; i < buttons.length; i += 1) {
  const button = buttons[i]
  const type = button.getAttribute('data-type')
  const subType = button.getAttribute('data-sub-type')
  const img = document.getElementById(
    `img-${type}${subType ? `-${subType}` : ''}`
  )

  button.onclick = () => {
    const res = barcodeDecoder(img, { barcode: type, type: subType })
    // only one iteration when dev mode
    if (process && process.env.NODE_ENV === 'development') {
      console.log(res)
    } else {
      // eslint-disable-next-line
      alert(res)
    }
  }
}
