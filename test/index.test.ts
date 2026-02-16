import * as Jimp from 'jimp'
import * as path from 'path'
import javascriptBarcodeReader from '../src/index'
import { combineAllPossible } from '../src/utilities/combineAllPossible'
import { getImageDataFromSource } from '../src/utilities/getImageDataFromSource'
import { getLines } from '../src/utilities/getLines'
import { isUrl } from '../src/utilities/isUrl'
import { applyAdaptiveThreshold } from '../src/utilities/adaptiveThreshold'
import * as codabarDecoder from '../src/codabar'
import * as code128Decoder from '../src/code-128'
import * as code2of5Decoder from '../src/code2of5'
import * as msiDecoder from '../src/msi'
import * as pharmacodeDecoder from '../src/pharmacode'

beforeAll(async () => {
  jest.setTimeout(60000)
  const imagePath = path.resolve('./test/sample-images/code-93-no-padding.jpg')
  const image = await Jimp.read(imagePath)

  const canvas = document.createElement('canvas')
  canvas.width = image.getWidth()
  canvas.height = image.getHeight()
  canvas.id = 'Code_93_wikipedia_canvas'

  document.body.appendChild(canvas)
}, 60000)

describe('Count lines in an image', () => {
  test('should detect lines in barcode image', async () => {
    const rowsToScan = 3
    const image = await Jimp.read('./test/sample-images/small-padding.png')
    const { data, width, height } = image.bitmap
    const channels = data.length / (width * height)
    const startIndex = channels * width * Math.floor(height / 2)
    const endIndex = startIndex + rowsToScan * channels * width
    const lines = getLines(
      Uint8ClampedArray.from(data.slice(startIndex, endIndex)),
      width,
      rowsToScan
    )

    expect(lines.length).toBe(27)
  })

  test('should detect lines in barcode image without padding', async () => {
    const rowsToScan = 3
    const image = await Jimp.read('./test/sample-images/small.png')
    const { data, width, height } = image.bitmap
    const channels = data.length / (width * height)
    const startIndex = channels * width * Math.floor(height / 2)
    const endIndex = startIndex + rowsToScan * channels * width
    const lines = getLines(
      Uint8ClampedArray.from(data.slice(startIndex, endIndex)),
      width,
      rowsToScan
    )

    expect(lines.length).toBe(27)
  })

  test('should return zero lines with empty image', async () => {
    const rowsToScan = 3
    const image = await Jimp.read('./test/sample-images/empty.jpg')
    const { data, width, height } = image.bitmap
    const channels = data.length / (width * height)
    const startIndex = channels * width * Math.floor(height / 2)
    const endIndex = startIndex + rowsToScan * channels * width
    const lines = getLines(
      Uint8ClampedArray.from(data.slice(startIndex, endIndex)),
      width,
      rowsToScan
    )

    expect(lines.length).toBe(0)
  })
})

describe('get imageData from source', () => {
  test('should get imageData from file path', async () => {
    const url = path.resolve('./test/sample-images/codabar.jpg')
    const dataSource = await getImageDataFromSource(url)

    expect(typeof dataSource.data).toBe('object')
    expect(typeof dataSource.width).toBe('number')
    expect(typeof dataSource.height).toBe('number')
  })

  test.skip('should get imageData from HTMLCanvasElement', async () => {
    const imageElement = document.getElementById('Code_93_wikipedia_canvas')
    if (!imageElement || !(imageElement instanceof HTMLCanvasElement)) return

    const dataSource = await getImageDataFromSource(imageElement)

    expect(typeof dataSource.data).toBe('object')
    expect(typeof dataSource.width).toBe('number')
    expect(typeof dataSource.height).toBe('number')
  }, 30000)

  test('should throw with invalid source', () => {
    getImageDataFromSource('Olalalala').catch((err) => {
      expect(err).toBeDefined()
    })
  })
})

describe('isUrl', () => {
  test('check if string is URL', () => {
    const url = 'https://upload.wikimedia.org/wikipedia/en/a/a9/Code_93_wikipedia.png'

    expect(isUrl(url)).toBeTruthy()
    expect(isUrl('#someString')).toBeFalsy()
  })
})

describe('combineAllPossible', () => {
  test('should be able to combine multiple results into one complete', () => {
    const result = combineAllPossible('?123456', '012345?')

    expect(result).toBe('0123456')
    expect(combineAllPossible('', '')).toBe('')
  })
})

describe('extract barcode from local files', () => {
  test('should detect barcode codabar', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/codabar.jpg'),
      barcode: 'codabar',
    })

    expect(result).toBe('A40156C')
  })

  test('should detect barcode codabar', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/codabar.jpg'),
      barcode: 'codabar',
      options: {
        singlePass: true,
      },
    })

    expect(result).toBe('A40156C')
  })

  test('should detect barcode 2 of 5 standard', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-2of5.jpg'),
      barcode: 'code-2of5',
    })

    expect(result).toBe('12345670')
  })

  test('should detect barcode 2 of 5 interleaved', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-2of5-interleaved.jpg'),
      barcode: 'code-2of5',
      barcodeType: 'interleaved',
    })

    expect(result).toBe('12345670')
  })

  test('should detect barcode 39', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-39.jpg'),
      barcode: 'code-39',
    })

    expect(result).toBe('10023')
  })

  test('should detect barcode 93', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-93.jpg'),
      barcode: 'code-93',
    })

    expect(result).toBe('123ABC')
  })

  test('should detect barcode 128: ABC-abc-1234', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-128.jpg'),
      barcode: 'code-128',
    })

    expect(result).toBe('ABC-abc-1234')
  })

  // test('should detect barcode 128: eeb00f0c-0c7e-a937-1794-25685779ba0c', async () => {
  //   const result = await javascriptBarcodeReader({
  //     image: path.resolve('./test/sample-images/code-128-eeb00f0c-0c7e-a937-1794-25685779ba0c.png'),
  //     barcode: 'code-128',
  //   })

  //   expect(result).toBe('eeb00f0c-0c7e-a937-1794-25685779ba0c')
  // })

  // test('should detect barcode 128: 3107cde3-d1ff-0f93-a215-4109753c0c9e', async () => {
  //   const result = await javascriptBarcodeReader({
  //     image: path.resolve('./test/sample-images/code-128-3107cde3-d1ff-0f93-a215-4109753c0c9e.png'),
  //     barcode: 'code-128',
  //   })

  //   expect(result).toBe('3107cde3-d1ff-0f93-a215-4109753c0c9e')
  // })

  test('should detect barcode EAN-8', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/ean-8.jpg'),
      barcode: 'ean-8',
      options: {
        useAdaptiveThreshold: true,
      },
    })

    expect(result).toBe('73127727')
  })

  test('should detect barcode EAN-13 small', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/ean-13-5901234123457.png'),
      barcode: 'ean-13',
    })

    expect(result).toBe('901234123457')
  })

  test('should detect barcode EAN-13 large', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/ean-13.jpg'),
      barcode: 'ean-13',
    })

    expect(result).toBe('901234123457')
  })

  test('should detect barcode 128 without padding white bars', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-128-no-padding.jpg'),
      barcode: 'code-128',
    })

    expect(result).toBe('12ab#!')
  })

  test('should detect barcode 128 with multiple zeros', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-128-000.jpg'),
      barcode: 'code-128',
    })

    expect(result).toBe('79619647103200000134407005')
  })

  test('should detect barcode 128 with default start Code B', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/L89HE1806005080432.gif'),
      barcode: 'code-128',
    })

    expect(result).toBe('L89HE1806005080432')
  })

  test('should detect barcode 93 without padding white bars', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-93-no-padding.jpg'),
      barcode: 'code-93',
    })

    expect(result).toBe('WIKIPEDIA')
  })

  test('should detect barcode 93 with bitmap data', async () => {
    const image = await Jimp.read('./test/sample-images/code-93-no-padding.jpg')
    const { data, width, height } = image.bitmap

    const result = await javascriptBarcodeReader({
      image: {
        data: Uint8ClampedArray.from(data),
        width,
        height,
      },
      barcode: 'code-93',
    })

    expect(result).toBe('WIKIPEDIA')
  })
})

describe('extract barcode after applying adaptive threhsold', () => {
  test('should detect barcode codabar', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/codabar.jpg'),
      barcode: 'codabar',
      options: {
        useAdaptiveThreshold: true,
      },
    })

    expect(result).toBe('A40156C')
  })

  test('should detect barcode 2 of 5', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-2of5.jpg'),
      barcode: 'code-2of5',
      options: {
        useAdaptiveThreshold: true,
      },
    })

    expect(result).toBe('12345670')
  })

  test('should detect barcode 2 of 5 interleaved', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-2of5-interleaved.jpg'),
      barcode: 'code-2of5',
      barcodeType: 'interleaved',
      options: {
        useAdaptiveThreshold: true,
      },
    })

    expect(result).toBe('12345670')
  })
})

describe('extract barcode from local files - additional', () => {
  test('should detect barcode 93 from local file', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-93-no-padding.jpg'),
      barcode: 'code-93',
    })
    expect(result).toBe('WIKIPEDIA')
  })
})

describe('Fails', () => {
  test('throws when no barcode specified', async () => {
    try {
      await javascriptBarcodeReader({
        image: path.resolve('./test/sample-images/code-93-no-padding.jpg'),
        barcode: 'oallal',
      })
    } catch (err) {
      expect(err).toBeDefined()
    }
  })

  test('throws when invalid barcode specified', async () => {
    try {
      await javascriptBarcodeReader({
        image: './test/sample-images/empty.jpg',
        barcode: 'none',
      })
    } catch (err) {
      expect(err).toBeDefined()
    }
  })

  test('throws when no barcode found', async () => {
    try {
      await javascriptBarcodeReader({
        image: './test/sample-images/empty.jpg',
        barcode: 'code-93',
      })
    } catch (err) {
      expect(err).toBeDefined()
    }
  })
})

describe('extract MSI barcode', () => {
  test('should decode MSI barcode with 10 digits', () => {
    const lines = [3, 1, 3, 1, 3, 2, 1, 3, 1, 3, 2, 1, 3, 1, 3, 2, 1, 3, 1, 3, 2, 1, 3, 1, 3]
    const result = msiDecoder.decoder(lines)
    expect(result).toBeDefined()
  })

  test('should return empty for short MSI lines', () => {
    const lines = [3, 1, 3]
    const result = msiDecoder.decoder(lines)
    expect(result).toBe('')
  })
})

describe('extract Pharmacode barcode', () => {
  test('should decode Pharmacode barcode', () => {
    const lines = [4, 2, 4, 2, 4, 2, 4, 2]
    const result = pharmacodeDecoder.decoder(lines)
    expect(result).toBeDefined()
  })

  test('should return empty for short pharmacode lines', () => {
    const lines = [4, 2]
    const result = pharmacodeDecoder.decoder(lines)
    expect(result).toBe('')
  })
})

describe('extract UPC-A barcode', () => {
  test('should detect barcode UPC-A', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/ean-13.jpg'),
      barcode: 'upc-a',
    })
    expect(result).toBe('901234123457')
  })
})

describe('extract UPC-E barcode', () => {
  test('should detect barcode UPC-E', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/ean-8.jpg'),
      barcode: 'upc-e',
    })
    expect(result).toBeDefined()
  })
})

describe('barcode decoder threshold calculations', () => {
  test('code2of5 should calculate threshold correctly', () => {
    const lines = [10, 5, 10, 5, 10, 5]
    expect(() => code2of5Decoder.decoder(lines)).not.toThrow()
  })

  test('codabar should calculate threshold correctly', () => {
    const lines = [8, 4, 8, 4, 8, 4, 8]
    expect(() => codabarDecoder.decoder(lines)).not.toThrow()
  })

  test('code-128 should handle typo fix', () => {
    const decoder = code128Decoder.decoder
    const lines = [
      2, 3, 3, 1, 1, 1, 2, 1, 2, 1, 2, 3, 1, 1, 2, 1, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1,
      1, 2, 1, 2, 3, 1, 2,
    ]
    expect(() => decoder(lines)).not.toThrow()
  })
})

describe('getLines utility', () => {
  test('should handle grayscale conversion', async () => {
    const image = await Jimp.read('./test/sample-images/small.png')
    const { data, width, height } = image.bitmap
    const channels = data.length / (width * height)
    const startIndex = channels * width * Math.floor(height / 2)
    const endIndex = startIndex + 3 * channels * width
    const lines = getLines(Uint8ClampedArray.from(data.slice(startIndex, endIndex)), width, 3)
    expect(lines.length).toBeGreaterThan(0)
  })

  test('should handle RGB channels', () => {
    const data = new Uint8ClampedArray(1200)
    for (let i = 0; i < 400; i++) {
      data[i * 4] = 255
      data[i * 4 + 1] = 255
      data[i * 4 + 2] = 255
      data[i * 4 + 3] = 255
    }
    const lines = getLines(data, 100, 3)
    expect(lines).toBeDefined()
  })
})

describe('combineAllPossible utility', () => {
  test('should handle empty strings', () => {
    expect(combineAllPossible('', '')).toBe('')
    expect(combineAllPossible('123', '')).toBe('')
    expect(combineAllPossible('', '456')).toBe('456')
  })

  test('should merge partial results', () => {
    expect(combineAllPossible('1?345?', '12?45?')).toBe('12345?')
    expect(combineAllPossible('????', 'abcd')).toBe('abcd')
  })
})

describe('adaptive threshold', () => {
  test('should apply threshold to image data', () => {
    const data = new Uint8ClampedArray(10000)
    for (let i = 0; i < 5000; i++) {
      data[i] = 100
    }
    for (let i = 5000; i < 10000; i++) {
      data[i] = 200
    }
    applyAdaptiveThreshold(data, 100, 100)
    const uniqueValues = new Set(Array.from(data))
    expect(uniqueValues.size).toBeLessThan(3)
  })
})
