import { isValidChecksum } from '../src/utilities/checksum'
import * as Jimp from 'jimp'
import javascriptBarcodeReader from '../src/index'
import * as path from 'path'

describe('checksum validation', () => {
  test('valid EAN-13 check digit', () => {
    expect(isValidChecksum('5901234123457', 'ean-13')).toBe(true)
  })

  test('invalid EAN-13 check digit', () => {
    expect(isValidChecksum('5901234123450', 'ean-13')).toBe(false)
  })

  test('valid EAN-8 check digit', () => {
    expect(isValidChecksum('73127727', 'ean-8')).toBe(true)
  })

  test('invalid EAN-8 check digit', () => {
    expect(isValidChecksum('73127720', 'ean-8')).toBe(false)
  })

  test('valid UPC-A check digit', () => {
    expect(isValidChecksum('012345678905', 'upc-a')).toBe(true)
  })

  test('invalid UPC-A check digit', () => {
    expect(isValidChecksum('012345678900', 'upc-a')).toBe(false)
  })

  test('valid UPC-E check digit via expansion', () => {
    expect(isValidChecksum('12345670', 'upc-e')).toBe(true)
  })

  test('invalid UPC-E check digit via expansion', () => {
    expect(isValidChecksum('12345671', 'upc-e')).toBe(false)
  })

  test('non-numeric value is invalid', () => {
    expect(isValidChecksum('ABC', 'ean-13')).toBe(false)
  })

  test('wrong length is invalid', () => {
    expect(isValidChecksum('590123412345', 'ean-13')).toBe(false)
  })

  test('validateChecksum: true on ean-13.jpg returns 5901234123457', async () => {
    const imagePath = path.resolve('./test/sample-images/ean-13.jpg')
    const image = await Jimp.read(imagePath)
    const { data, width, height } = image.bitmap
    const result = await javascriptBarcodeReader({
      image: { data: Uint8ClampedArray.from(data), width, height },
      barcode: 'ean-13',
      options: { validateChecksum: true },
    })
    expect(result).toBe('5901234123457')
  })

  test('validateChecksum: true on a Jimp image returns the same as omitted', async () => {
    const imagePath = path.resolve('./test/sample-images/ean-13.jpg')
    const image = await Jimp.read(imagePath)
    const { data, width, height } = image.bitmap
    const imgData = { data: Uint8ClampedArray.from(data), width, height }
    const withChecksum = await javascriptBarcodeReader({
      image: imgData,
      barcode: 'ean-13',
      options: { validateChecksum: true },
    })
    const without = await javascriptBarcodeReader({
      image: imgData,
      barcode: 'ean-13',
    })
    expect(withChecksum).toBe(without)
    expect(withChecksum).toBe('5901234123457')
  })
})
