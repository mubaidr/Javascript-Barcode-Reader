const path = require('path')
const jbr = require('../src/index')

process.env.DEVELOPMENT = true

async function test() {
  let result = ''

  result = await jbr(path.resolve('docs/sample-images/code-128.jpg'), {
    barcode: 'code-128',
  })
  console.log('Code 128: ', result)

  result = await jbr(
    path.resolve('docs/images/33c64780-a9c0-e92a-820c-fae7011c11e2.gif'),
    {
      barcode: 'code-128',
    }
  )
  console.log('Code 128: ', result)

  result = await jbr(
    path.resolve('docs/images/33c64780-a9c0-e92a-820c-fae7011c11e2.png'),
    {
      barcode: 'code-128',
    }
  )
  console.log('Code 128: ', result)
}

test()
