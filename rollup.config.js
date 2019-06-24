import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

// const production = !process.env.ROLLUP_WATCH

export default [
  {
    external: ['jimp'],
    input: 'src/index.js',
    output: {
      globals: {
        jimp: 'document', // fake jimp to document to avoid jimp load error
      },
      file: 'dist/javascript-barcode-reader.min.js',
      format: 'iife',
      name: 'javascriptBarcodeReader',
      sourcemap: true,
      sourcemapFile: 'dist/javascript-barcode-reader.min.js.map',
    },
    plugins: [
      babel({
        babelrc: false,
        presets: [
          [
            '@babel/preset-env',
            {
              corejs: '3.0.0',
              useBuiltIns: 'entry',
            },
          ],
        ],
      }),
      resolve(),
      commonjs(),
      terser(),
    ],
  },
  {
    external: ['jimp'],
    input: 'src/index.js',
    output: {
      globals: {
        jimp: 'document', // fake jimp to document to avoid jimp load error
      },
      file: 'dist/javascript-barcode-reader.js',
      format: 'iife',
      name: 'javascriptBarcodeReader',
      sourcemap: true,
      sourcemapFile: 'dist/javascript-barcode-reader.js.map',
    },
    plugins: [
      babel({
        babelrc: false,
        presets: [
          [
            '@babel/preset-env',
            {
              corejs: '3.0.0',
              useBuiltIns: 'entry',
            },
          ],
        ],
      }),
      resolve(),
      commonjs(),
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
        jimp: 'document', // fake jimp to document to avoid jimp load error
      },
      file: 'docs/javascript-barcode-reader.min.js',
      format: 'iife',
      name: 'javascriptBarcodeReader',
      sourcemap: true,
      sourcemapFile: 'docs/javascript-barcode-reader.min.js.map',
    },
    plugins: [
      babel({
        babelrc: false,
        presets: [
          [
            '@babel/preset-env',
            {
              corejs: '3.0.0',
              useBuiltIns: 'entry',
            },
          ],
        ],
      }),
      resolve(),
      commonjs(),
      terser(),
    ],
  },
]
