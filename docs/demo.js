/* globals javascriptBarcodeReader */

const buttons = document.getElementsByTagName('button')

for (let i = 0; i < buttons.length; i += 1) {
  const button = buttons[i]
  const type = button.getAttribute('data-type')
  const subType = button.getAttribute('data-sub-type')
  const img = document.getElementById(
    `img-${type}${subType ? `-${subType}` : ''}`
  )

  button.onclick = () => {
    javascriptBarcodeReader(img, {
      barcode: type,
      type: subType,
    }).then(code => {
      console.log(`Code : ${code}`)
      alert(`Code : ${code}`) // eslint-disable-line
    })
  }
}
