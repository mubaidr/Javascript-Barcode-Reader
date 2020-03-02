import commonjs from '@rollup/plugin-commonjs'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import sourceMaps from 'rollup-plugin-sourcemaps'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

const libraryName = 'javascriptBarcodeReader'

export default {
  input: `src/index.ts`,
  output: [
    {
      file: 'dist/javascript-barcode-reader.umd.js',
      name: libraryName,
      format: 'umd',
      sourcemap: true,
      globals: {
        jimp: 'Jimp',
      },
    },
    {
      file: 'dist/javascript-barcode-reader.umd.min.js',
      name: libraryName,
      format: 'umd',
      sourcemap: true,
      globals: {
        jimp: 'Jimp',
      },
      plugins: [terser()],
    },
    {
      file: 'dist/javascript-barcode-reader.es5.js',
      format: 'es',
      sourcemap: true,
      globals: {
        jimp: 'Jimp',
      },
    },
    {
      file: 'dist/javascript-barcode-reader.es5.min.js',
      format: 'es',
      sourcemap: true,
      globals: {
        jimp: 'Jimp',
      },
      plugins: [terser()],
    },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: ['jimp'],
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // use babel
    babel({
      exclude: 'node_modules/**',
    }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
}
