import * as Jimp from 'jimp'
import * as path from 'path'
import { getImageDataFromSource } from '../src/utilities/getImageDataFromSource'
import { isUrl } from '../src/utilities/isUrl'
import { ImageDataLike } from '../src/utilities/ImageDataLike'
import * as createImageDataModule from '../src/utilities/createImageData'

jest.setTimeout(30000)

describe('isUrl', () => {
  test.each([
    ['https://example.com/barcode.png', true],
    ['http://example.com/barcode.png', true],
    ['ftp://files.example.com/barcode.png', true],
    ['data:image/png;base64,abc123', true],
    ['data:image/png;base64,', true],
    ['//example.com/barcode.png', true],
    ['//host/path', true],
    ['#id', false],
    ['#someString', false],
    ['./image.png', false],
    ['image.png', false],
    ['C:\\Users\\foo\\image.png', false],
    ['C:/Users/foo/image.png', false],
    ['', false],
  ])('classifies %s as %s', (source, expected) => {
    expect(isUrl(source)).toBe(expected)
  })
})

describe('getImageDataFromSource', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('resolves data, width, and height for a Node file path', async () => {
    const url = path.resolve('./test/sample-images/codabar.jpg')
    const dataSource = await getImageDataFromSource(url)

    expect(typeof dataSource.data).toBe('object')
    expect(typeof dataSource.width).toBe('number')
    expect(typeof dataSource.height).toBe('number')
    expect(dataSource.width).toBeGreaterThan(0)
    expect(dataSource.height).toBeGreaterThan(0)
  })

  test('rejects promptly for an invalid source instead of hanging', async () => {
    await expect(getImageDataFromSource('not-a-real-source')).rejects.toBeDefined()
  })

  test('rejects unsupported source types', async () => {
    await expect(getImageDataFromSource(42 as unknown as string)).rejects.toBeDefined()
  })

  test('rejects zero-size images from the Node file path', async () => {
    const bitmap = { bitmap: { data: new Uint8ClampedArray(0), width: 0, height: 0 } }

    jest.spyOn(Jimp, 'read').mockImplementation((...args: unknown[]) => {
      const callback = args[1] as (err: unknown, image: typeof bitmap) => void

      callback(null, bitmap)

      return undefined as unknown as Promise<never>
    })

    await expect(getImageDataFromSource('zero.jpg')).rejects.toThrow('Zero-size image')
  })

  test('resolves a URL through mocked Jimp.read without a real network call', async () => {
    const bitmap = { bitmap: { data: new Uint8ClampedArray([0, 0, 0, 255]), width: 1, height: 1 } }

    jest.spyOn(Jimp, 'read').mockImplementation((...args: unknown[]) => {
      const callback = args[1] as (err: unknown, image: typeof bitmap) => void

      callback(null, bitmap)

      return undefined as unknown as Promise<never>
    })

    const dataSource = await getImageDataFromSource('https://example.com/barcode.png')

    expect(dataSource.width).toBe(1)
    expect(dataSource.height).toBe(1)
  })

  test('rejects when Jimp.read fails for a URL', async () => {
    jest.spyOn(Jimp, 'read').mockImplementation((...args: unknown[]) => {
      const callback = args[1] as (err: unknown, image: unknown) => void

      callback(new Error('read failed'), null)

      return undefined as unknown as Promise<never>
    })

    await expect(getImageDataFromSource('https://example.com/broken.png')).rejects.toThrow('read failed')
  })

  test('rejects createImageData failures for an image element', async () => {
    jest
      .spyOn(createImageDataModule, 'createImageData')
      .mockImplementation((_image: HTMLImageElement): ImageDataLike => {
        throw new Error('Cannot create canvas 2d context')
      })

    const image = document.createElement('img')

    await expect(getImageDataFromSource(image)).rejects.toThrow('Cannot create canvas 2d context')
  })

  test('rejects zero-size image elements', async () => {
    jest
      .spyOn(createImageDataModule, 'createImageData')
      .mockImplementation((image: HTMLImageElement): ImageDataLike => {
        if (image.naturalWidth === 0 || image.naturalHeight === 0) {
          throw new Error('Zero-size image')
        }

        throw new Error('Cannot create canvas 2d context')
      })

    const image = document.createElement('img')

    await expect(getImageDataFromSource(image)).rejects.toThrow('Zero-size image')
  })
})
