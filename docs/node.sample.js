const path = require('path')
const jbr = require('../src/index')

process.env.DEVELOPMENT = true

async function test() {
  let result = ''

  result = await jbr(path.resolve('docs/images/small.png'), {
    barcode: 'code-128',
    singlePass: true,
  })
  console.log('Code: ', result)

  result = await jbr(path.resolve('docs/sample-images/code-93.jpg'), {
    barcode: 'code-93',
  })
  console.log('Code: ', result)

  result = await jbr(path.resolve('docs/sample-images/code-128.jpg'), {
    barcode: 'code-128',
  })
  console.log('Code: ', result)

  result = await jbr(path.resolve('docs/images/L89HE1806005080432.png'), {
    barcode: 'code-128',
  })
  console.log('Code: ', result)

  result = await jbr(
    path.resolve('docs/images/33c64780-a9c0-e92a-820c-fae7011c11e2.png'),
    {
      barcode: 'code-128',
    }
  )
  console.log('Code: ', result)

  result = await jbr(
    path.resolve(
      'docs/images/65794755-0f1bd580-e126-11e9-8918-24618efdc76c.png'
    ),
    {
      barcode: 'code-128',
    }
  )
  console.log('Code: ', result)
}

test()
