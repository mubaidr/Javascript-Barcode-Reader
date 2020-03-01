import * as Jimp from 'jimp'
import { applyMedianFilter } from '../src/utilities/medianFilter'

async function anon(): Promise<void> {
  const image = await Jimp.read('./test/sample-images/L89HE1806005080432.png')
  const { data, width, height } = image.bitmap
  const dataMedian = applyMedianFilter(Uint8ClampedArray.from(data), width, height)

  new Jimp({ data: Buffer.from(dataMedian), width, height }, (err, image) => {
    image.write('./tmp/sample.png')
    // this image is 1280 x 768, pixels are loaded from the given buffer.
  })
}

anon()
