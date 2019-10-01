const path = require('path')
const Jimp = require('jimp')

const jbr = require('../src/index')
const UTILITIES = require('../src/utiltities')

// const { Image } = require('canvas')
// const { createCanvas, loadImage } = require('canvas')

// jest.unmock('canvas')

// describe('extract barcode from DOM elements', () => {
//   beforeAll(() => {
//     jest.setTimeout(15000)
//   })

//   test('should detect barcode 93 from Canvas', async () => {
//     const image = await loadImage('examples/node/sample-images/code-93.jpg')
//     const canvas = createCanvas(200, 200)
//     const ctx = canvas.getContext('2d')

//     canvas.width = image.naturalHeight
//     canvas.height = image.naturalHeight
//     ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

//     document.body.innerHTML += `<img id="testImage" style="display: block;" src="${canvas.toDataURL()}" />`

//     setTimeout(() => {
//       const img = document.getElementById('testImage')

//       console.log(img.complete, img.naturalWidth, canvas)

//       // const result = await jbr(img, {
//       //   barcode: 'code-93',
//       // })

//       //   expect(result).toBe('WIKIPEDIA')
//     }, 2500)
//   })

//   afterAll(() => {
//     jest.setTimeout(5000)
//   })
// })

describe('combineAllPossible', () => {
  test('should be able to combine multiple results into one complete', () => {
    const results = ['?123456', '012345?']

    const result = UTILITIES.combineAllPossible(...results)

    expect(result).toBe('0123456')
  })
})

describe('extract barcode from local files', () => {
  test('should detect barcode codabar', async () => {
    const result = await jbr(
      path.resolve('examples/node/sample-images/codabar.jpg'),
      {
        barcode: 'codabar',
      }
    )

    expect(result).toBe('A40156C')
  })

  test('should detect barcode codabar', async () => {
    const result = await jbr(
      path.resolve('examples/node/sample-images/codabar.jpg'),
      {
        barcode: 'codabar',
        singlePass: true,
      }
    )

    expect(result).toBe('A40156C')
  })

  test('should detect barcode 2 of 5', async () => {
    const result = await jbr(
      path.resolve('examples/node/sample-images/code-2of5.jpg'),
      {
        barcode: 'code-2of5',
      }
    )

    expect(result).toBe('12345670')
  })

  test('should detect barcode 2 of 5 interleaved', async () => {
    const result = await jbr(
      path.resolve('examples/node/sample-images/code-2of5-interleaved.jpg'),
      {
        barcode: 'code-2of5',
        type: 'interleaved',
      }
    )

    expect(result).toBe('12345670')
  })

  test('should detect barcode 39', async () => {
    const result = await jbr(
      path.resolve('examples/node/sample-images/code-39.jpg'),
      {
        barcode: 'code-39',
      }
    )

    expect(result).toBe('10023')
  })

  test('should detect barcode 93', async () => {
    const result = await jbr(
      path.resolve('examples/node/sample-images/code-93.jpg'),
      {
        barcode: 'code-93',
      }
    )

    expect(result).toBe('123ABC')
  })

  test('should detect barcode 128', async () => {
    const result = await jbr(
      path.resolve('examples/node/sample-images/code-128.jpg'),
      {
        barcode: 'code-128',
      }
    )

    expect(result).toBe('ABC-abc-1234')
  })

  test('should detect barcode EAN-8', async () => {
    const result = await jbr(
      path.resolve('examples/node/sample-images/ean-8.jpg'),
      {
        barcode: 'ean-8',
      }
    )

    expect(result).toBe('73127727')
  })

  test('should detect barcode EAN-13', async () => {
    const result = await jbr(
      path.resolve('examples/node/sample-images/ean-13.jpg'),
      {
        barcode: 'ean-13',
      }
    )

    expect(result).toBe('901234123457')
  })

  test('should detect barcode 128 without padding white bars', async () => {
    const result = await jbr(
      path.resolve('examples/node/sample-images/code-128-no-padding.jpg'),
      {
        barcode: 'code-128',
      }
    )

    expect(result).toBe('12ab#!')
  })

  test('should detect barcode 128 with multiple zeros', async () => {
    const result = await jbr(
      path.resolve('examples/node/sample-images/code-128-000.jpg'),
      {
        barcode: 'code-128',
      }
    )

    expect(result).toBe('79619647103200000134407005')
  })

  test('should detect barcode 128 with default start Code B', async () => {
    const result = await jbr(
      path.resolve('examples/node/sample-images/L89HE1806005080432.gif'),
      {
        barcode: 'code-128',
      }
    )

    expect(result).toBe('L89HE1806005080432')
  })

  test('should detect barcode 93 without padding white bars', async () => {
    const result = await jbr(
      path.resolve('examples/node/sample-images/code-93-no-padding.jpg'),
      {
        barcode: 'code-93',
      }
    )

    expect(result).toBe('WIKIPEDIA')
  })

  test('should detect barcode 93 with bitmap data', async () => {
    const image = await Jimp.read(
      'examples/node/sample-images/code-93-no-padding.jpg'
    )
    const { data, width, height } = image.bitmap

    const result = await jbr(
      {
        data: data.toJSON().data,
        width,
        height,
      },
      {
        barcode: 'code-93',
      }
    )

    expect(result).toBe('WIKIPEDIA')
  })
})

describe('extract barcode after applying adaptive threhsold', () => {
  test('should detect barcode codabar', async () => {
    const result = await jbr(
      path.resolve('examples/node/sample-images/codabar.jpg'),
      {
        barcode: 'codabar',
        useAdaptiveThreshold: true,
      }
    )

    expect(result).toBe('A40156C')
  })

  test('should detect barcode 2 of 5', async () => {
    const result = await jbr(
      path.resolve('examples/node/sample-images/code-2of5.jpg'),
      {
        barcode: 'code-2of5',
        useAdaptiveThreshold: true,
      }
    )

    expect(result).toBe('12345670')
  })

  test('should detect barcode 2 of 5 interleaved', async () => {
    const result = await jbr(
      path.resolve('examples/node/sample-images/code-2of5-interleaved.jpg'),
      {
        barcode: 'code-2of5',
        type: 'interleaved',
        useAdaptiveThreshold: true,
      }
    )

    expect(result).toBe('12345670')
  })
})

describe('extract barcode from remote URL', () => {
  test('should detect barcode 93 from remote url', async () => {
    const result = await jbr(
      'https://upload.wikimedia.org/wikipedia/en/a/a9/Code_93_wikipedia.png',
      {
        barcode: 'code-93',
      }
    )
    expect(result).toBe('WIKIPEDIA')
  })
})

describe('Fails', () => {
  test('throws when no barcode specified', async () => {
    try {
      await jbr({}, {})
    } catch (err) {
      expect(err).toBeDefined()
    }
  })

  test('throws when invalid barcode specified', async () => {
    try {
      await jbr('examples/node/sample-images/empty.jpg', {
        barcode: 'none',
      })
    } catch (err) {
      expect(err).toBeDefined()
    }
  })

  test('invalid image source', async () => {
    try {
      await jbr(
        {},
        {
          barcode: 'code-93',
        }
      )
    } catch (err) {
      expect(err).toBeDefined()
    }
  })

  test('throws when no barcode found', async () => {
    try {
      await jbr('examples/node/sample-images/empty.jpg', {
        barcode: 'code-93',
      })
    } catch (err) {
      expect(err).toBeDefined()
    }
  })
})
