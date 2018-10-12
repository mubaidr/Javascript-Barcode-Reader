import buble from 'rollup-plugin-buble'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import minify from 'rollup-plugin-babel-minify'

const production = !process.env.ROLLUP_WATCH

export default [
  {
    external: ['jimp'],
    input: 'src/index.js',
    output: {
      file: 'dist/javascript-barcode-reader.min.js',
      format: 'iife',
      name: 'javascriptBarcodeReader',
      sourcemap: true,
      sourcemapFile: 'dist/javascript-barcode-reader.min.js.map',
    },
    plugins: [buble(), resolve(), commonjs(), production && minify()],
  },
  {
    external: ['jimp'],
    input: 'src/index.js',
    output: {
      file: 'dist/javascript-barcode-reader.js',
      format: 'iife',
      name: 'javascriptBarcodeReader',
      sourcemap: true,
      sourcemapFile: 'dist/javascript-barcode-reader.js.map',
    },
    plugins: [buble(), resolve(), commonjs()],
  },
]
