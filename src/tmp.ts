// import * as Jimp from 'jimp'
import { applyMedianFilter } from './utilities/medianFilter'

console.log(applyMedianFilter(Uint8ClampedArray.from([0, 0, 0, 0]), 2, 2))
