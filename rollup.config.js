import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

export default [
  {
    external: ['jimp'],
    input: 'src/index.js',
    output: {
      globals: {
        jimp: 'window.jimp', // fake jimp to document to avoid jimp load error
      },
      file: 'dist/javascript-barcode-reader.umd.min.js',
      format: 'umd',
      name: 'javascriptBarcodeReader',
      sourcemap: true,
      sourcemapFile: 'dist/javascript-barcode-reader.umd.min.js.map',
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelrc: true,
        runtimeHelpers: true,
      }),
      terser(),
    ],
  },
  {
    external: ['jimp'],
    input: 'src/index.js',
    output: {
      globals: {
        jimp: 'window.jimp', // fake jimp to document to avoid jimp load error
      },
      file: 'dist/javascript-barcode-reader.esm.min.js',
      format: 'esm',
      name: 'javascriptBarcodeReader',
      sourcemap: true,
      sourcemapFile: 'dist/javascript-barcode-reader.esm.min.js.map',
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelrc: true,
        runtimeHelpers: true,
      }),
      terser(),
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
      terser(),
    ],
  },
  {
    external: ['jimp'],
    input: 'src/index.js',
    output: {
      globals: {
        jimp: 'window.jimp', // fake jimp to document to avoid jimp load error
      },
      file: 'examples/browser/javascript-barcode-reader.min.js',
      format: 'umd',
      name: 'javascriptBarcodeReader',
      sourcemap: true,
      sourcemapFile: 'examples/browser/javascript-barcode-reader.min.js.map',
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelrc: true,
        runtimeHelpers: true,
      }),
      terser(),
    ],
  },
  // {
  //   external: ['jimp'],
  //   input: 'src/index.js',
  //   output: {
  //     globals: {
  //       jimp: 'window.jimp', // fake jimp to document to avoid jimp load error
  //     },
  //     file: 'docs/javascript-barcode-reader.min.js',
  //     format: 'umd',
  //     name: 'javascriptBarcodeReader',
  //     sourcemap: true,
  //     sourcemapFile: 'docs/javascript-barcode-reader.min.js.map',
  //   },
  //   plugins: [
  //     resolve(),
  //     commonjs(),
  //     babel({
  //       babelrc: true,
  //       runtimeHelpers: true,
  //     }),
  //     terser(),
  //   ],
  // },
]
