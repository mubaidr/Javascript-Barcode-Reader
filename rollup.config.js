import buble from 'rollup-plugin-buble'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import minify from 'rollup-plugin-babel-minify'

export default [
  {
    external: ['jimp'],
    input: 'src/index.js',
    output: {
      file: 'dist/javascript-barcode-reader.js',
      format: 'iife',
      name: 'javascriptBarcodeReader',
    },
    plugins: [buble(), resolve(), commonjs(), minify()],
  },
]
