const path = require('path')
const Jimp = require('jimp')

const jbr = require('../src/index')

// const imageLoader = src =>
//   new Promise((resolve, reject) => {
//     const img = new Image()
//     img.onload = () => {
//       resolve(img)
//     }
//     img.onerror = err => {
//       reject(err)
//     }
//     img.src = src
//   })

describe('javascript-barcode-reader', () => {
  test('should be defined', () => {
    expect(jbr).toBeDefined()
    expect(jbr).toBeInstanceOf(Function)
  })
})

describe('extract barcode from local files', () => {
  test('should detect barcode codabar', async () => {
    expect.assertions(1)

    const result = await jbr(path.resolve('docs/sample-images/codabar.jpg'), {
      barcode: 'codabar',
    })

    expect(result).toBe('A40156C')
  })

  test('should detect barcode 2 of 5', async () => {
    expect.assertions(1)

    const result = await jbr(path.resolve('docs/sample-images/code-2of5.jpg'), {
      barcode: 'code-2of5',
    })

    expect(result).toBe('12345670')
  })

  test('should detect barcode 2 of 5 interleaved', async () => {
    expect.assertions(1)

    const result = await jbr(
      path.resolve('docs/sample-images/code-2of5-interleaved.jpg'),
      {
        barcode: 'code-2of5',
        type: 'interleaved',
      }
    )

    expect(result).toBe('12345670')
  })

  test('should detect barcode 39', async () => {
    expect.assertions(1)

    const result = await jbr(path.resolve('docs/sample-images/code-39.jpg'), {
      barcode: 'code-39',
    })

    expect(result).toBe('10023')
  })

  test('should detect barcode 93', async () => {
    expect.assertions(1)

    const result = await jbr(path.resolve('docs/sample-images/code-93.jpg'), {
      barcode: 'code-93',
    })

    expect(result).toBe('123ABC')
  })

  test('should detect barcode 128', async () => {
    expect.assertions(1)

    const result = await jbr(path.resolve('docs/sample-images/code-128.jpg'), {
      barcode: 'code-128',
    })

    expect(result).toBe('ABC-abc-1234')
  })

  test('should detect barcode EAN-8', async () => {
    expect.assertions(1)

    const result = await jbr(path.resolve('docs/sample-images/ean-8.jpg'), {
      barcode: 'ean-8',
    })

    expect(result).toBe('73127727')
  })

  test('should detect barcode EAN-13', async () => {
    expect.assertions(1)

    const result = await jbr(path.resolve('docs/sample-images/ean-13.jpg'), {
      barcode: 'ean-13',
    })

    expect(result).toBe('901234123457')
  })

  test('should detect barcode 128 without padding white bars', async () => {
    expect.assertions(1)

    const result = await jbr(
      path.resolve('docs/sample-images/code-128-no-padding.jpg'),
      {
        barcode: 'code-128',
      }
    )

    expect(result).toBe('12ab#!')
  })

  test('should detect barcode 128 with multiple zeros', async () => {
    expect.assertions(1)

    const result = await jbr(
      path.resolve('docs/sample-images/code-128-000.jpg'),
      {
        barcode: 'code-128',
      }
    )

    expect(result).toBe('79619647103200000134407005')
  })

  test('should detect barcode 93 without padding white bars', async () => {
    expect.assertions(1)

    const result = await jbr(
      path.resolve('docs/sample-images/code-93-no-padding.jpg'),
      {
        barcode: 'code-93',
      }
    )

    expect(result).toBe('WIKIPEDIA')
  })

  test('should detect barcode 93 with bitmap data', async () => {
    expect.assertions(1)

    const image = await Jimp.read('docs/sample-images/code-93-no-padding.jpg')
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

/*
describe('extract barcode from DOM elements', () => {
  test('should detect barcode 93 from IMG', async done => {
    expect.assertions(1)

    const img = new Image()
    img.onload = async () => {
      const result = await jbr(img, {
        barcode: 'code-93',
      })
      expect(result).toBe('WIKIPEDIA')
    }
    img.src = 'docs/sample-images/code-93-no-padding.jpg'
  })

  test('should detect barcode 93 from Canvas', async done => {
    expect.assertions(1)

    const canvas = document.createElement('canvas')
    const img = new Image()
    img.onload = async () => {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      const result = await jbr(canvas, {
        barcode: 'code-93',
      })
      expect(result).toBe('WIKIPEDIA')
    }
    img.src = 'docs/sample-images/code-93-no-padding.jpg'
  })
})
*/

describe('extract barcode from remote URL', () => {
  test('should detect barcode 93 from remote url', async () => {
    expect.assertions(1)

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
  test('invalid image source', async () => {
    expect.assertions(1)

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
    expect.assertions(1)

    try {
      await jbr('docs/sample-images/empty.jpg', {
        barcode: 'code-93',
      })
    } catch (err) {
      expect(err).toBeDefined()
    }
  })
})
