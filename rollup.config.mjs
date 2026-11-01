import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import sourceMaps from 'rollup-plugin-sourcemaps'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

const libraryName = 'javascriptBarcodeReader'

export default {
  input: `src/index.ts`,
  output: [
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
      file: 'dist/javascript-barcode-reader.es5.min.js',
      format: 'es',
      sourcemap: true,
      globals: {
        jimp: 'Jimp',
      },
      plugins: [terser()],
    },
  ],
  external: ['jimp'],
  watch: {
    include: 'src/**',
  },
  plugins: [
    json(),
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.rollup.json' }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
    }),
    sourceMaps(),
  ],
}
