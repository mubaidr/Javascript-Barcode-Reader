const path = require('path')
const jbr = require('../src/index')

describe('javascript-barcode-reader', () => {
  it('should be defined', () => {
    expect(jbr).toBeDefined()
    expect(jbr).toBeInstanceOf(Function)
  })

  it('should detect barcode codabar', async () => {
    const result = await jbr(path.resolve('docs/sample-images/codabar.jpg'), {
      barcode: 'codabar',
    })

    expect(result).toBe('A40156C')
  })

  it('should detect barcode 2 of 5', async () => {
    const result = await jbr(path.resolve('docs/sample-images/code-2of5.jpg'), {
      barcode: 'code-2of5',
    })

    expect(result).toBe('12345670')
  })

  it('should detect barcode 2 of 5 interleaved', async () => {
    const result = await jbr(
      path.resolve('docs/sample-images/code-2of5-interleaved.jpg'),
      {
        barcode: 'code-2of5',
        type: 'interleaved',
      }
    )

    expect(result).toBe('12345670')
  })

  it('should detect barcode 39', async () => {
    const result = await jbr(path.resolve('docs/sample-images/code-39.jpg'), {
      barcode: 'code-39',
    })

    expect(result).toBe('10023')
  })

  it('should detect barcode 93', async () => {
    const result = await jbr(path.resolve('docs/sample-images/code-93.jpg'), {
      barcode: 'code-93',
    })

    expect(result).toBe('123ABC')
  })

  it('should detect barcode 128', async () => {
    const result = await jbr(path.resolve('docs/sample-images/code-128.jpg'), {
      barcode: 'code-128',
    })

    expect(result).toBe('ABC-abc-1234')
  })

  it('should detect barcode EAN-8', async () => {
    const result = await jbr(path.resolve('docs/sample-images/ean-8.jpg'), {
      barcode: 'ean-8',
    })

    expect(result).toBe('73127727')
  })

  it('should detect barcode EAN-13', async () => {
    const result = await jbr(path.resolve('docs/sample-images/ean-13.jpg'), {
      barcode: 'ean-13',
    })

    expect(result).toBe('901234123457')
  })

  it('should detect barcode 128 without padding white bars', async () => {
    const result = await jbr(
      path.resolve('docs/sample-images/code-128-no-padding.jpg'),
      {
        barcode: 'code-128',
      }
    )

    expect(result).toBe('ABC-abc-1234')
  })

  it('should detect barcode 93 without padding white bars', async () => {
    const result = await jbr(
      path.resolve('docs/sample-images/code-93-no-padding.jpg'),
      {
        barcode: 'code-93',
      }
    )

    expect(result).toBe('123ABC')
  })
})
