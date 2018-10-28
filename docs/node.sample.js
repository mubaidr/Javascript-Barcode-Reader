const path = require('path')
const jbr = require('../src/index')

process.env.DEVELOPMENT = true

async function test() {
  // code 128 with no padding on either side
  let result = await jbr(
    path.resolve('docs/sample-images/code-128-no-padding.jpg'),
    {
      barcode: 'code-128',
    }
  )
  console.log('\nCode 128 (without white padding): ', result)

  // code 128 with
  result = await jbr(path.resolve('docs/sample-images/code-128.jpg'), {
    barcode: 'code-128',
  })
  console.log('\nCode 128: ', result)

  // code 93 with padding
  result = await jbr(path.resolve('docs/sample-images/code-93.jpg'), {
    barcode: 'code-93',
  })
  console.log('\nCode 93: ', result)

  // code 93 with no padding on either side
  result = await jbr(
    path.resolve('docs/sample-images/code-93-no-padding.jpg'),
    {
      barcode: 'code-93',
    }
  )
  console.log('\nCode 93 (without white padding): ', result)
}

test()
