import barcodeDecoder from '../src'

const buttons = document.getElementsByTagName('button')

for (let i = 0; i < buttons.length; i += 1) {
  const button = buttons[i]
  const type = button.getAttribute('data-type')
  const subType = button.getAttribute('data-sub-type')
  const img = document.getElementById(
    `img-${type}${subType ? `-${subType}` : ''}`
  )

  button.onclick = () => {
    // eslint-disable-next-line
    alert(barcodeDecoder(img, { barcode: type, type: subType }))
  }
}
