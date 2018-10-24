const path = require('path')
const jbr = require('../src/index')

process.env.DEVELOPMENT = true

// code 128 with no padding on either side
jbr(path.resolve('docs/sample-images/code-128-no-padding.jpg'), {
  barcode: 'code-128',
})
  .then(result => {
    console.log('\nCode 128 (without white padding): ', result)
  })
  .catch(err => {
    console.error(err)
  })

/*
// code 128 padded on both sides by white bars
jbr(path.resolve('docs/sample-images/code-128.jpg'), {
  barcode: 'code-128',
})
  .then(result => {
    console.log('\nCode 128 (with white padding): ', result)
  })
  .catch(err => {
    console.error(err)
  })
*/
