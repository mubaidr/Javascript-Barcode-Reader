import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

const production = !process.env.ROLLUP_WATCH

export default [
  {
    external: ['jimp'],
    input: 'src/index.js',
    output: {
      globals: {
        jimp: 'window.jimp', // fake jimp to document to avoid jimp load error
      },
      file: 'dist/javascript-barcode-reader.min.js',
      format: 'umd',
      name: 'javascriptBarcodeReader',
      sourcemap: true,
      sourcemapFile: 'dist/javascript-barcode-reader.min.js.map',
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelrc: true,
        runtimeHelpers: true,
      }),
      production && terser(),
    ],
  },
  {
    external: ['jimp'],
    input: 'src/index.js',
    output: {
      globals: {
        jimp: 'window.jimp', // fake jimp to document to avoid jimp load error
      },
      file: 'dist/javascript-barcode-reader.js',
      format: 'umd',
      name: 'javascriptBarcodeReader',
      sourcemap: true,
      sourcemapFile: 'dist/javascript-barcode-reader.js.map',
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelrc: true,
        runtimeHelpers: true,
      }),
    ],
    watch: {
      clearScreen: false,
    },
  },
  {
    external: ['jimp'],
    input: 'src/index.js',
    output: {
      globals: {
        jimp: 'window.jimp', // fake jimp to document to avoid jimp load error
      },
      file: 'docs/javascript-barcode-reader.min.js',
      format: 'umd',
      name: 'javascriptBarcodeReader',
      sourcemap: true,
      sourcemapFile: 'docs/javascript-barcode-reader.min.js.map',
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelrc: true,
        runtimeHelpers: true,
      }),
      production && terser(),
    ],
  },
]
