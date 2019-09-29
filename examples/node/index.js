const path = require('path')
const javascriptBarcodeReader = require('../../src/index')

javascriptBarcodeReader(path.resolve('./sample-images/code-128.jpg'), {
  barcode: 'code-128',
})
  .then(code => {
    console.log(code)
  })
  .catch(err => console.error(err))

javascriptBarcodeReader(path.resolve('./sample-images/code-128.jpg'), {
  barcode: 'code-128',
  fast: true,
})
  .then(code => {
    console.log(code)
  })
  .catch(err => console.error(err))

javascriptBarcodeReader(path.resolve('./sample-images/code-128.jpg'), {
  barcode: 'code-128',
  fast: true,
  useAdaptiveThreshold: true,
})
  .then(code => {
    console.log(code)
  })
  .catch(err => console.error(err))

javascriptBarcodeReader(path.resolve('./sample-images/code-39.jpg'), {
  barcode: 'code-39',
  fast: true,
  useAdaptiveThreshold: true,
})
  .then(code => {
    console.log(code)
  })
  .catch(err => console.error(err))
