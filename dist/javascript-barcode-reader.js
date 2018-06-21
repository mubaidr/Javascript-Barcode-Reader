parcelRequire = (function(e, r, n, t) {
  let i = typeof parcelRequire === 'function' && parcelRequire,
    o = typeof require === 'function' && require
  function u(n, t) {
    if (!r[n]) {
      if (!e[n]) {
        let f = typeof parcelRequire === 'function' && parcelRequire
        if (!t && f) return f(n, !0)
        if (i) return i(n, !0)
        if (o && typeof n === 'string') return o(n)
        let c = new Error(`Cannot find module '${n}'`)
        throw ((c.code = 'MODULE_NOT_FOUND'), c)
      }
      p.resolve = function(r) {
        return e[n][1][r] || r
      }
      let l = (r[n] = new u.Module(n))
      e[n][0].call(l.exports, p, l, l.exports, this)
    }
    return r[n].exports
    function p(e) {
      return u(p.resolve(e))
    }
  }
  ;(u.isParcelRequire = !0),
    (u.Module = function(e) {
      ;(this.id = e), (this.bundle = u), (this.exports = {})
    }),
    (u.modules = e),
    (u.cache = r),
    (u.parent = i),
    (u.register = function(r, n) {
      e[r] = [
        function(e, r) {
          r.exports = n
        },
        {},
      ]
    })
  for (let f = 0; f < n.length; f++) u(n[f])
  if (n.length) {
    let c = u(n[n.length - 1])
    typeof exports === 'object' && typeof module !== 'undefined'
      ? (module.exports = c)
      : typeof define === 'function' && define.amd
        ? define(() => c)
        : t && (this[t] = c)
  }
  return u
})(
  {
    3: [
      function(require, module, exports) {
        let n = {
            10001: '1',
            '01001': '2',
            11000: '3',
            '00101': '4',
            10100: '5',
            '01100': '6',
            '00011': '7',
            10010: '8',
            '01010': '9',
            '00110': '10',
          },
          r = { '01000': '0', '00100': '10', '00010': '20', 10000: '30' },
          t = [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '0',
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J',
            'K',
            'L',
            'M',
            'N',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U',
            'V',
            'W',
            'X',
            'Y',
            'Z',
            '-',
            '.',
            '␣',
            '*',
          ],
          e = function(e) {
            e.push(3)
            for (
              var u = '',
                o = function(o) {
                  let i = e.slice(o, o + 10),
                    c = Math.round(i.reduce((n, r) => n + r, 0) / i.length),
                    f = i.map(n => (n > c ? 1 : 0)),
                    a = f.filter((n, r) => r % 2 == 0).join(''),
                    l = f.filter((n, r) => r % 2 != 0).join('')
                  u += t[parseInt(n[a], 10) - 1 + parseInt(r[l], 10)]
                },
                i = 1;
              i < e.length;
              i += 10
            )
              o(i)
            return u.substring(1, u.length - 1)
          }
        module.exports = { decode: e }
      },
      {},
    ],
    4: [
      function(require, module, exports) {
        let n = {
            10001: '1',
            '01001': '2',
            11000: '3',
            '00101': '4',
            10100: '5',
            '01100': '6',
            '00011': '7',
            10010: '8',
            '01010': '9',
            '00110': '10',
          },
          r = { '01000': '0', '00100': '10', '00010': '20', 10000: '30' },
          t = [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '0',
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J',
            'K',
            'L',
            'M',
            'N',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U',
            'V',
            'W',
            'X',
            'Y',
            'Z',
            '-',
            '.',
            '␣',
            '*',
          ],
          e = function(e) {
            e.push(0)
            for (
              var u = '',
                o = function(o) {
                  let i = e.slice(o, o + 10),
                    c = Math.round(i.reduce((n, r) => n + r, 0) / i.length),
                    f = i.map(n => (n > c ? 1 : 0)),
                    a = f.filter((n, r) => r % 2 == 0).join(''),
                    l = f.filter((n, r) => r % 2 != 0).join('')
                  u += t[parseInt(n[a], 10) - 1 + parseInt(r[l], 10)]
                },
                i = 1;
              i < e.length;
              i += 10
            )
              o(i)
            return u.substring(1, u.length - 1)
          }
        module.exports = { decode: e }
      },
      {},
    ],
    5: [
      function(require, module, exports) {
        let r = {
            3211: '0',
            2221: '1',
            2122: '2',
            1411: '3',
            1132: '4',
            1231: '5',
            1114: '6',
            1312: '7',
            1213: '8',
            3112: '9',
          },
          e = function(e) {
            for (
              var n = '', o = ~~((e[1] + e[2] + e[3]) / 3), t = 1;
              t < e.length;
              t += 1
            ) {
              let d = void 0
              d =
                n.length < 6
                  ? e.slice(4 * t, 4 * t + 4)
                  : e.slice(4 * t + 5, 4 * t + 9)
              let a = [
                Math.round(d[0] / o),
                Math.round(d[1] / o),
                Math.round(d[2] / o),
                Math.round(d[3] / o),
              ]
              if (
                (n += r[a.join('')] || r[a.reverse().join('')] || 'X')
                  .length === 12
              )
                return n
            }
            return (n.indexOf('X') === -1 && n) || !1
          }
        module.exports = { decode: e }
      },
      {},
    ],
    1: [
      function(require, module, exports) {
        let e = require('./code-93'),
          r = n(e),
          t = require('./code-39'),
          a = n(t),
          o = require('./ean-13'),
          d = n(o)
        function n(e) {
          return e && e.__esModule ? e : { default: e }
        }
        let u = {
            'code-93': r.default,
            'code-39': a.default,
            'ean-13': d.default,
          },
          i = function(e, r) {
            let t = void 0
            typeof e === 'string' && (e = document.getElementById(e))
            let a = e.tagName
            if (a === 'IMG') {
              let o = document.createElement('canvas')
              ;(o.width = e.naturalWidth), (o.height = e.naturalHeight)
              let d = o.getContext('2d')
              d.drawImage(e, 0, 0),
                (t = d.getImageData(0, 0, e.naturalWidth, e.naturalHeight))
            } else if (a === 'CANVAS')
              t = e
                .getContext('2d')
                .getImageData(0, 0, e.naturalWidth, e.naturalHeight)
            else {
              if (!e.data) throw new Error('Invalid image source specified!')
              t = e
            }
            let n = t,
              i = n.data,
              l = n.width,
              f = n.height
            ;(e = null), (t = null)
            for (
              let c = [1, 9, 2, 8, 3, 7, 4, 6, 5],
                v = c.length,
                h = f / (v + 1);
              (v -= 1);

            ) {
              for (
                var g = 4 * l * Math.floor(h * c[v]),
                  s = 4 * l * Math.floor(h * c[v]) + 8 * l,
                  m = i.slice(g, s),
                  p = [],
                  x = 0,
                  I = 0,
                  w = 0;
                w < 2;
                w += 1
              )
                for (let y = 0; y < l; y += 1) {
                  let D = 4 * (w * l + y),
                    M = (3 * m[D] + 4 * m[D + 1] + 2 * m[D + 2]) / 9,
                    b = p[y]
                  ;(m[D] = M),
                    (m[D + 1] = M),
                    (m[D + 2] = M),
                    (p[y] = M + (void 0 === b ? 0 : b))
                }
              for (let q = 0; q < l; q += 1) {
                p[q] /= 2
                let C = p[q]
                C < x && (x = C), C > I && (I = C)
              }
              for (var E = x + (I - x) / 2, H = [], W = 0; W < l; W += 1) {
                for (var A = 0, N = 0; N < 2; N += 1)
                  m[4 * (N * l + W)] > E && (A += 1)
                H.push(A > 1)
              }
              for (var _ = H[0], B = 1, G = [], S = 0; S < l; S += 1)
                H[S] === _ ? (B += 1) : (G.push(B), (B = 1), (_ = H[S]))
              return u[r.barcode].decode(G)
            }
            return null
          }
        typeof exports !== 'undefined'
          ? (exports.barcodeDecoder = i)
          : typeof module !== 'undefined' && module.exports
            ? (module.exports = i)
            : (root.barcodeDecoder = i)
      },
      { './code-93': 3, './code-39': 4, './ean-13': 5 },
    ],
  },
  {},
  [1],
  null
)
// # sourceMappingURL=/javascript-barcode-reader.map
