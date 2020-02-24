import * as Jimp from 'jimp'
import * as path from 'path'
import { BARCODE_DECODERS, javascriptBarcodeReader } from '../src/index'
import { combineAllPossible } from '../src/utilities/combineAllPossible'
import { getImageDataFromSource } from '../src/utilities/getImageDataFromSource'
import { isUrl } from '../src/utilities/isUrl'
import { median } from '../src/utilities/median'
import { applyMedianFilter } from '../src/utilities/medianFilter'

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onerror = reject
    img.onload = (): void => resolve(img)
    img.src = src
  })
}

function loadCanvas(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight

  const ctx = canvas.getContext('2d')

  ctx?.drawImage(img, 0, 0)

  return canvas
}

beforeAll(async () => {
  const imageUrl = 'https://upload.wikimedia.org/wikipedia/en/a/a9/Code_93_wikipedia.png'
  const img = await loadImage(imageUrl)
  img.id = 'Code_93_wikipedia_image'

  const canvas = loadCanvas(img)
  canvas.id = 'Code_93_wikipedia_canvas'

  document.body.appendChild(img)
  document.body.appendChild(canvas)
})

describe('get imageData from source', () => {
  test('should get imageData from url', async () => {
    const url = 'https://upload.wikimedia.org/wikipedia/en/a/a9/Code_93_wikipedia.png'
    const dataSource = await getImageDataFromSource(url)

    expect(typeof dataSource.data).toBe('object')
    expect(typeof dataSource.width).toBe('number')
    expect(typeof dataSource.height).toBe('number')
  })

  test('should get imageData from file path', async () => {
    const url = path.resolve('./test/sample-images/codabar.jpg')
    const dataSource = await getImageDataFromSource(url)

    expect(typeof dataSource.data).toBe('object')
    expect(typeof dataSource.width).toBe('number')
    expect(typeof dataSource.height).toBe('number')
  })

  test('should get imageData from HTMLImageElement id', async () => {
    const dataSource = await getImageDataFromSource('#Code_93_wikipedia_image')

    expect(typeof dataSource.data).toBe('object')
    expect(typeof dataSource.width).toBe('number')
    expect(typeof dataSource.height).toBe('number')
  })

  test('should get imageData from HTMLCanvasElement id', async () => {
    const dataSource = await getImageDataFromSource('#Code_93_wikipedia_canvas')

    expect(typeof dataSource.data).toBe('object')
    expect(typeof dataSource.width).toBe('number')
    expect(typeof dataSource.height).toBe('number')
  })

  test('should get imageData from HTMLImageElement', async () => {
    const imageElement = document.getElementById('Code_93_wikipedia_image')
    if (!imageElement || !(imageElement instanceof HTMLImageElement)) return

    const dataSource = await getImageDataFromSource(imageElement)

    expect(typeof dataSource.data).toBe('object')
    expect(typeof dataSource.width).toBe('number')
    expect(typeof dataSource.height).toBe('number')
  })

  test('should get imageData from HTMLCanvasElement', async () => {
    const imageElement = document.getElementById('Code_93_wikipedia_canvas')
    if (!imageElement || !(imageElement instanceof HTMLCanvasElement)) return

    const dataSource = await getImageDataFromSource(imageElement)

    expect(typeof dataSource.data).toBe('object')
    expect(typeof dataSource.width).toBe('number')
    expect(typeof dataSource.height).toBe('number')
  })

  test('should throw with invalid source', () => {
    getImageDataFromSource('Olalalala').catch(err => {
      expect(err).toBeDefined()
    })
  })
})

describe('Median Filter', () => {
  test('Apply median filter to imageData', () => {
    const width = 9
    const height = 9
    const data = new Array(width * height).map(() => Math.random() * 255)
    const dataMedian = applyMedianFilter(Uint8ClampedArray.from(data), width, height)

    expect(dataMedian).toMatchSnapshot()
  })
})

describe('isUrl', () => {
  test('check if string is URL', () => {
    const url = 'https://upload.wikimedia.org/wikipedia/en/a/a9/Code_93_wikipedia.png'

    expect(isUrl(url)).toBeTruthy()
    expect(isUrl('#someString')).toBeFalsy()
  })
})

describe('median', () => {
  test('get median of array', () => {
    expect(median([6, 3, 9])).toBe(6)
    expect(median([9, 3, 6])).toBe(6)
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
      barcode: BARCODE_DECODERS.codabar
    })

    expect(result).toBe('A40156C')
  })

  test('should detect barcode codabar', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/codabar.jpg'),
      barcode: BARCODE_DECODERS.codabar,
      options: {
        singlePass: true
      }
    })

    expect(result).toBe('A40156C')
  })

  test('should detect barcode 2 of 5 standard', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-2of5.jpg'),
      barcode: 'code-2of5'
    })

    expect(result).toBe('12345670')
  })

  test('should detect barcode 2 of 5 interleaved', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-2of5-interleaved.jpg'),
      barcode: 'code-2of5',
      barcodeType: 'interleaved'
    })

    expect(result).toBe('12345670')
  })

  test('should detect barcode 39', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-39.jpg'),
      barcode: 'code-39'
    })

    expect(result).toBe('10023')
  })

  test('should detect barcode 93', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-93.jpg'),
      barcode: 'code-93'
    })

    expect(result).toBe('123ABC')
  })

  test('should detect barcode 128: ABC-abc-1234', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-128.jpg'),
      barcode: 'code-128'
    })

    expect(result).toBe('ABC-abc-1234')
  })

  test('should detect barcode 128: eeb00f0c-0c7e-a937-1794-25685779ba0c', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-128-eeb00f0c-0c7e-a937-1794-25685779ba0c.png'),
      barcode: 'code-128'
    })

    expect(result).toBe('eeb00f0c-0c7e-a937-1794-25685779ba0c')
  })

  test('should detect barcode EAN-8', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/ean-8.jpg'),
      barcode: 'ean-8'
    })

    expect(result).toBe('73127727')
  })

  test('should detect barcode EAN-13', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/ean-13-5901234123457.png'),
      barcode: 'ean-13'
    })

    expect(result).toBe('901234123457')
  })

  test('should detect barcode EAN-13', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/ean-13.jpg'),
      barcode: 'ean-13'
    })

    expect(result).toBe('901234123457')
  })

  test('should detect barcode 128 without padding white bars', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-128-no-padding.jpg'),
      barcode: 'code-128'
    })

    expect(result).toBe('12ab#!')
  })

  test('should detect barcode 128 with multiple zeros', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-128-000.jpg'),
      barcode: 'code-128'
    })

    expect(result).toBe('79619647103200000134407005')
  })

  test('should detect barcode 128 with default start Code B', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/L89HE1806005080432.gif'),
      barcode: 'code-128'
    })

    expect(result).toBe('L89HE1806005080432')
  })

  test('should detect barcode 93 without padding white bars', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-93-no-padding.jpg'),
      barcode: 'code-93'
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
        height
      },
      barcode: 'code-93'
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
        useAdaptiveThreshold: true
      }
    })

    expect(result).toBe('A40156C')
  })

  test('should detect barcode 2 of 5', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-2of5.jpg'),
      barcode: 'code-2of5',
      options: {
        useAdaptiveThreshold: true
      }
    })

    expect(result).toBe('12345670')
  })

  test('should detect barcode 2 of 5 interleaved', async () => {
    const result = await javascriptBarcodeReader({
      image: path.resolve('./test/sample-images/code-2of5-interleaved.jpg'),
      barcode: 'code-2of5',
      barcodeType: 'interleaved',
      options: {
        useAdaptiveThreshold: true
      }
    })

    expect(result).toBe('12345670')
  })
})

describe('extract barcode from remote URL', () => {
  test('should detect barcode 93 from remote url', async () => {
    const result = await javascriptBarcodeReader({
      image: 'https://upload.wikimedia.org/wikipedia/en/a/a9/Code_93_wikipedia.png',
      barcode: 'code-93'
    })
    expect(result).toBe('WIKIPEDIA')
  })
})

describe('Fails', () => {
  test('throws when no barcode specified', async () => {
    try {
      await javascriptBarcodeReader({
        image: 'https://upload.wikimedia.org/wikipedia/en/a/a9/Code_93_wikipedia.png',
        barcode: 'oallal'
      })
    } catch (err) {
      expect(err).toBeDefined()
    }
  })

  test('throws when invalid barcode specified', async () => {
    try {
      await javascriptBarcodeReader({
        image: './test/sample-images/empty.jpg',
        barcode: 'none'
      })
    } catch (err) {
      expect(err).toBeDefined()
    }
  })

  test('throws when no barcode found', async () => {
    try {
      await javascriptBarcodeReader({
        image: './test/sample-images/empty.jpg',
        barcode: 'code-93'
      })
    } catch (err) {
      expect(err).toBeDefined()
    }
  })
})
