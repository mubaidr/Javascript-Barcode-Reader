var javascriptBarcodeReader = (function (jimp) {
  'use strict';

  jimp = jimp && jimp.hasOwnProperty('default') ? jimp['default'] : jimp;

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var isNode = (typeof process === "undefined" ? "undefined" : _typeof(process)) === 'object' && process.release && process.release.name === 'node'; // check if string is url

  function isUrl(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return !s[0] === '#' || regexp.test(s);
  }
  /**
   * Creates image data from HTML image
   * @param {HTMLImageElement} image HTML Image element
   */


  function createImageData(image) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var width = image.naturalWidth;
    var height = image.naturalHeight;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0);
    return ctx.getImageData(0, 0, image.naturalWidth, image.naturalHeight);
  }
  /**
   * Reads image source and returns imageData as only callback parameter
   * @param {*} source Image source
   * @param {Function} callback Callback to pass the imageData
   */


  function getImageDataFromSource(_x) {
    return _getImageDataFromSource.apply(this, arguments);
  }

  function _getImageDataFromSource() {
    _getImageDataFromSource = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(source) {
      var isStringSource, isURLSource, tagName;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              isStringSource = typeof source === 'string';
              isURLSource = isStringSource ? isUrl(source) : false;
              tagName = source.tagName;
              return _context.abrupt("return", new Promise(function (resolve, reject) {
                // String source
                if (isStringSource) {
                  // Read file in Node.js
                  if (isNode) {
                    jimp.read(isURLSource ? {
                      url: source,
                      headers: {}
                    } : source, function (err, image) {
                      if (err) {
                        reject(err);
                      } else {
                        var _image$bitmap = image.bitmap,
                            data = _image$bitmap.data,
                            width = _image$bitmap.width,
                            height = _image$bitmap.height;
                        resolve({
                          data: data.toJSON().data,
                          width: width,
                          height: height
                        });
                      }
                    });
                  } else if (isURLSource) {
                    // Load Image from source
                    var img = new Image();
                    img.onerror = reject;

                    img.onload = function () {
                      return resolve(createImageData(img));
                    };

                    img.src = source;
                  } else {
                    // Find Elment by ID
                    var imgElem = document.getElementById(source);

                    if (imgElem) {
                      resolve(createImageData(imgElem));
                    }

                    reject(new Error('Invalid image source specified!'));
                  }
                } else if (tagName) {
                  // HTML Image element
                  if (tagName === 'IMG') {
                    resolve(createImageData(source));
                  } // HTML Canvas element
                  else if (tagName === 'CANVAS') {
                      resolve(source.getContext('2d').getImageData(0, 0, source.naturalWidth, source.naturalHeight));
                    }

                  reject(new Error('Invalid image source specified!'));
                } // Pixel Data
                else if (source.data && source.width && source.height) {
                    resolve(source);
                  } else {
                    reject(new Error('Invalid image source specified!'));
                  }
              }));

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _getImageDataFromSource.apply(this, arguments);
  }

  function getLines(obj) {
    var data = obj.data,
        start = obj.start,
        end = obj.end,
        channels = obj.channels,
        width = obj.width;
    var pxLine = data.slice(start, end);
    var sum = [];
    var bmp = [];
    var lines = [];
    var count = 1;
    var min = 0;
    var max = 0;
    var padding = {
      left: true,
      right: true // grey scale section and sum of columns pixels in section

    };

    for (var row = 0; row < 2; row += 1) {
      for (var col = 0; col < width; col += 1) {
        var i = (row * width + col) * channels;
        var g = (pxLine[i] * 3 + pxLine[i + 1] * 4 + pxLine[i + 2] * 2) / 9;
        var s = sum[col];
        pxLine[i] = g;
        pxLine[i + 1] = g;
        pxLine[i + 2] = g;
        sum[col] = g + (s || 0);
      }
    }

    for (var _i = 0; _i < width; _i += 1) {
      sum[_i] /= 2;
      var _s = sum[_i];

      if (_s < min) {
        min = _s;
      } else {
        max = _s;
      }
    } // matches columns in two rows


    var pivot = min + (max - min) / 2;

    for (var _col = 0; _col < width; _col += 1) {
      var matches = 0;
      var value = void 0;

      for (var _row = 0; _row < 2; _row += 1) {
        value = pxLine[(_row * width + _col) * channels];

        if (value > pivot) {
          matches += 1;
        }
      }

      if (_col === 0 && value <= pivot) padding.left = false;

      if (_col === width - 1 && value <= pivot) {
        padding.right = false;
      }

      bmp.push(matches > 1);
    } // matches width of barcode lines


    var curr = bmp[0];

    for (var _col2 = 0; _col2 < width; _col2 += 1) {
      if (bmp[_col2] === curr) {
        count += 1;

        if (_col2 === width - 1) {
          lines.push(count);
        }
      } else {
        lines.push(count);
        count = 1;
        curr = bmp[_col2];
      }
    }

    return {
      lines: lines,
      padding: padding
    };
  }

  var utiltities = {
    getImageDataFromSource: getImageDataFromSource,
    getLines: getLines
  };

  var WIDTH_TBL = ['212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213', '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132', '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211', '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313', '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331', '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111', '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214', '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111', '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141', '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141', '114131', '311141', '411131', '211412', '211214', '211232', '233111', '211133', '2331112'];
  var TBL_A = [' ', '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', 'NUL', 'SOH', 'STX', 'ETX', 'EOT', 'ENQ', 'ACK', 'BEL', 'BS', 'HT', 'LF', 'VT', 'FF', 'CR', 'SO', 'SI', 'DLE', 'DC1', 'DC2', 'DC3', 'DC4', 'NAK', 'SYN', 'ETB', 'CAN', 'EM', 'SUB', 'ESC', 'FS', 'GS', 'RS', 'US', 'FNC 3', 'FNC 2', 'Shift B', 'Code C', 'Code B', 'FNC 4', 'FNC 1'];
  var TBL_B = [' ', '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~', 'DEL', 'FNC 3', 'FNC 2', 'Shift A', 'Code C', 'FNC 4', 'Code A', 'FNC 1'];
  var TBL_C = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', 'Code B', 'Code A', 'FNC 1'];

  var computeGroup = function computeGroup(lines) {
    // sum of a group in code-128 must be 11
    var factor = lines.reduce(function (pre, item) {
      return pre + item;
    }, 0) / 11; //

    return lines.map(function (item) {
      return Math.round(item / factor);
    }).join('');
  };

  var code128 = function code128(lines) {
    var lookupTBL;
    var sumOP;
    var letterKey;
    var letterCode;
    var keyIndex;
    var code = []; // extract terminal bar

    lines.pop();
    var seq = lines.slice(0);
    letterKey = computeGroup(seq.splice(0, 6));

    switch (letterKey) {
      case '211214':
        lookupTBL = TBL_B;
        sumOP = 104;
        break;

      case '211232':
        lookupTBL = TBL_C;
        sumOP = 105;
        break;

      default:
        lookupTBL = TBL_A;
        sumOP = 103;
        break;
    }

    for (var i = 1; seq.length > 12; i += 1) {
      letterKey = computeGroup(seq.splice(0, 6));
      keyIndex = WIDTH_TBL.indexOf(letterKey);
      sumOP += i * keyIndex;
      letterCode = lookupTBL[keyIndex];

      switch (letterCode) {
        case 'Code A':
          lookupTBL = TBL_A;
          break;

        case 'Code B':
          lookupTBL = TBL_B;
          break;

        case 'Code C':
          lookupTBL = TBL_C;
          break;

        default:
          code.push(letterCode);
          break;
      }
    }

    letterKey = computeGroup(seq.splice(0, 6));
    if (sumOP % 103 !== WIDTH_TBL.indexOf(letterKey)) return null;
    return code.join('');
  };

  var CHAR_SET = ['nnwwn', 'wnnnw', 'nwnnw', 'wwnnn', 'nnwnw', 'wnwnn', 'nwwnn', 'nnnww', 'wnnwn', 'nwnwn'];

  var _2of5 = function _2of5(lines) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'standard';
    var code = [];
    var barThreshold = Math.ceil(lines.reduce(function (pre, item) {
      return (pre + item) / 2;
    }, 0));

    if (type === 'interleaved') {
      // extract start/ends pair
      var startChar = lines.splice(0, 4).map(function (line) {
        return line > barThreshold ? 'w' : 'n';
      }).join('');
      var endChar = lines.splice(lines.length - 3, 3).map(function (line) {
        return line > barThreshold ? 'w' : 'n';
      }).join('');
      if (startChar !== 'nnnn' || endChar !== 'wnn') return null; // Read one encoded character at a time.

      while (lines.length > 0) {
        var seg = lines.splice(0, 10);
        var a = seg.filter(function (item, index) {
          return index % 2 === 0;
        }).map(function (line) {
          return line > barThreshold ? 'w' : 'n';
        }).join('');
        code.push(CHAR_SET.indexOf(a));
        var b = seg.filter(function (item, index) {
          return index % 2 !== 0;
        }).map(function (line) {
          return line > barThreshold ? 'w' : 'n';
        }).join('');
        code.push(CHAR_SET.indexOf(b));
      }
    } else if (type === 'standard') {
      // extract start/ends pair
      var _startChar = lines.splice(0, 6).filter(function (item, index) {
        return index % 2 === 0;
      }).map(function (line) {
        return line > barThreshold ? 'w' : 'n';
      }).join('');

      var _endChar = lines.splice(lines.length - 5, 5).filter(function (item, index) {
        return index % 2 === 0;
      }).map(function (line) {
        return line > barThreshold ? 'w' : 'n';
      }).join('');

      if (_startChar !== 'wwn' || _endChar !== 'wnw') return null; // Read one encoded character at a time.

      while (lines.length > 0) {
        var _a = lines.splice(0, 10).filter(function (item, index) {
          return index % 2 === 0;
        }).map(function (line) {
          return line > barThreshold ? 'w' : 'n';
        }).join('');

        code.push(CHAR_SET.indexOf(_a));
      }
    }

    return code.join('');
  };

  var CHAR_SET$1 = {
    nnnwwnwnn: '0',
    wnnwnnnnw: '1',
    nnwwnnnnw: '2',
    wnwwnnnnn: '3',
    nnnwwnnnw: '4',
    wnnwwnnnn: '5',
    nnwwwnnnn: '6',
    nnnwnnwnw: '7',
    wnnwnnwnn: '8',
    nnwwnnwnn: '9',
    wnnnnwnnw: 'A',
    nnwnnwnnw: 'B',
    wnwnnwnnn: 'C',
    nnnnwwnnw: 'D',
    wnnnwwnnn: 'E',
    nnwnwwnnn: 'F',
    nnnnnwwnw: 'G',
    wnnnnwwnn: 'H',
    nnwnnwwnn: 'I',
    nnnnwwwnn: 'J',
    wnnnnnnww: 'K',
    nnwnnnnww: 'L',
    wnwnnnnwn: 'M',
    nnnnwnnww: 'N',
    wnnnwnnwn: 'O',
    nnwnwnnwn: 'P',
    nnnnnnwww: 'Q',
    wnnnnnwwn: 'R',
    nnwnnnwwn: 'S',
    nnnnwnwwn: 'T',
    wwnnnnnnw: 'U',
    nwwnnnnnw: 'V',
    wwwnnnnnn: 'W',
    nwnnwnnnw: 'X',
    wwnnwnnnn: 'Y',
    nwwnwnnnn: 'Z',
    nwnnnnwnw: '-',
    wwnnnnwnn: '.',
    nwwnnnwnn: ' ',
    nwnwnwnnn: '$',
    nwnwnnnwn: '/',
    nwnnnwnwn: '+',
    nnnwnwnwn: '%',
    nwnnwnwnn: '*'
  };

  var code39 = function code39(lines) {
    var code = [];
    var barThreshold = Math.ceil(lines.reduce(function (pre, item) {
      return pre + item;
    }, 0) / lines.length); // Read one encoded character at a time.

    while (lines.length > 0) {
      var sequenceBar = lines.splice(0, 10).map(function (line) {
        return line > barThreshold ? 'w' : 'n';
      });
      code.push(CHAR_SET$1[sequenceBar.slice(0, 9).join('')]);
    }

    if (code.pop() !== '*' || code.shift() !== '*') return null;
    return code.join('');
  };

  var CHAR_SET$2 = [{
    '100010100': '0'
  }, {
    '101001000': '1'
  }, {
    '101000100': '2'
  }, {
    '101000010': '3'
  }, {
    '100101000': '4'
  }, {
    '100100100': '5'
  }, {
    '100100010': '6'
  }, {
    '101010000': '7'
  }, {
    '100010010': '8'
  }, {
    '100001010': '9'
  }, {
    '110101000': 'A'
  }, {
    '110100100': 'B'
  }, {
    '110100010': 'C'
  }, {
    '110010100': 'D'
  }, {
    '110010010': 'E'
  }, {
    '110001010': 'F'
  }, {
    '101101000': 'G'
  }, {
    '101100100': 'H'
  }, {
    '101100010': 'I'
  }, {
    '100110100': 'J'
  }, {
    '100011010': 'K'
  }, {
    '101011000': 'L'
  }, {
    '101001100': 'M'
  }, {
    '101000110': 'N'
  }, {
    '100101100': 'O'
  }, {
    '100010110': 'P'
  }, {
    '110110100': 'Q'
  }, {
    '110110010': 'R'
  }, {
    '110101100': 'S'
  }, {
    '110100110': 'T'
  }, {
    '110010110': 'U'
  }, {
    '110011010': 'V'
  }, {
    '101101100': 'W'
  }, {
    '101100110': 'X'
  }, {
    '100110110': 'Y'
  }, {
    '100111010': 'Z'
  }, {
    '100101110': '-'
  }, {
    '111010100': '.'
  }, {
    '111010010': ' '
  }, {
    '111001010': '$'
  }, {
    '101101110': '/'
  }, {
    '101110110': '+'
  }, {
    '110101110': '%'
  }, {
    '100100110': '($)'
  }, {
    '111011010': '(%)'
  }, {
    '111010110': '(/)'
  }, {
    '100110010': '(+)'
  }, {
    '101011110': '*'
  }];

  var code93 = function code93(lines) {
    var code = [];
    var binary = []; // remove termination bar

    lines.pop();
    var barThreshold = Math.ceil(lines.reduce(function (pre, item) {
      return pre + item;
    }, 0) / lines.length);
    var minBarWidth = Math.ceil(lines.reduce(function (pre, item) {
      if (item < barThreshold) return (pre + item) / 2;
      return pre;
    }, 0)); // leave the padded *

    for (var i = 0; i < lines.length; i += 1) {
      var segment = lines[i];

      while (segment > 0) {
        if (i % 2 === 0) {
          binary.push(1);
        } else {
          binary.push(0);
        }

        segment -= minBarWidth;
      }
    }

    var _loop = function _loop(_i) {
      var searcKey = binary.slice(_i, _i + 9).join('');
      var char = CHAR_SET$2.filter(function (item) {
        return Object.keys(item)[0] === searcKey;
      });
      code.push(char[0][searcKey]);
    };

    for (var _i = 0; _i < binary.length; _i += 9) {
      _loop(_i);
    }

    if (code.shift() !== '*' || code.pop() !== '*') return null;
    var K = code.pop();
    var sum = 0;
    var letter;
    var Value;

    var findValue = function findValue(item) {
      return Object.values(item)[0] === letter;
    };

    for (var _i2 = code.length - 1; _i2 >= 0; _i2 -= 1) {
      letter = code[_i2];
      Value = CHAR_SET$2.indexOf(CHAR_SET$2.filter(findValue)[0]);
      sum += Value * (1 + (code.length - (_i2 + 1)) % 20);
    }

    if (Object.values(CHAR_SET$2[sum % 47])[0] !== K) return null;
    var C = code.pop();
    sum = 0;

    for (var _i3 = code.length - 1; _i3 >= 0; _i3 -= 1) {
      letter = code[_i3];
      Value = CHAR_SET$2.indexOf(CHAR_SET$2.filter(findValue)[0]);
      sum += Value * (1 + (code.length - (_i3 + 1)) % 20);
    }

    if (Object.values(CHAR_SET$2[sum % 47])[0] !== C) return null;
    return code.join('');
  };

  var UPC_SET = {
    '3211': '0',
    '2221': '1',
    '2122': '2',
    '1411': '3',
    '1132': '4',
    '1231': '5',
    '1114': '6',
    '1312': '7',
    '1213': '8',
    '3112': '9'
  };

  var ean13 = function ean13(lines) {
    var code = ''; // manually add start dummy line

    lines.unshift(0); // start indicator/reference lines

    var bar = ~~((lines[1] + lines[2] + lines[3]) / 3); //eslint-disable-line

    for (var i = 1; i < lines.length; i += 1) {
      var group = void 0;

      if (code.length < 6) {
        group = lines.slice(i * 4, i * 4 + 4);
      } else {
        group = lines.slice(i * 4 + 5, i * 4 + 9);
      }

      var digits = [Math.round(group[0] / bar), Math.round(group[1] / bar), Math.round(group[2] / bar), Math.round(group[3] / bar)];
      var result = UPC_SET[digits.join('')] || UPC_SET[digits.reverse().join('')];

      if (result) {
        code += result;
      }

      if (code.length === 12) break;
    }

    return code;
  };

  var UPC_SET$1 = {
    '3211': '0',
    '2221': '1',
    '2122': '2',
    '1411': '3',
    '1132': '4',
    '1231': '5',
    '1114': '6',
    '1312': '7',
    '1213': '8',
    '3112': '9'
  };

  var ean8 = function ean8(lines) {
    var code = ''; // manually add start dummy line

    lines.unshift(0); // start indicator/reference lines

    var bar = ~~((lines[1] + lines[2] + lines[3]) / 3); //eslint-disable-line

    for (var i = 1; i < lines.length; i += 1) {
      var group = void 0;

      if (code.length < 4) {
        group = lines.slice(i * 4, i * 4 + 4);
      } else {
        group = lines.slice(i * 4 + 5, i * 4 + 9);
      }

      var digits = [Math.round(group[0] / bar), Math.round(group[1] / bar), Math.round(group[2] / bar), Math.round(group[3] / bar)];
      var result = UPC_SET$1[digits.join('')] || UPC_SET$1[digits.reverse().join('')];

      if (result) {
        code += result;
      }

      if (code.length === 8) break;
    }

    return code;
  };

  var CHAR_SET$3 = {
    nnnnnww: '0',
    nnnnwwn: '1',
    nnnwnnw: '2',
    wwnnnnn: '3',
    nnwnnwn: '4',
    wnnnnwn: '5',
    nwnnnnw: '6',
    nwnnwnn: '7',
    nwwnnnn: '8',
    wnnwnnn: '9',
    nnnwwnn: '-',
    nnwwnnn: '$',
    wnnnwnw: ':',
    wnwnnnw: '/',
    wnwnwnn: '.',
    nnwwwww: '+',
    nnwwnwn: 'A',
    nnnwnww: 'B',
    nwnwnnw: 'C',
    nnnwwwn: 'D'
  };

  var codabar = function codabar(lines) {
    var code = [];
    var barThreshold = Math.ceil(lines.reduce(function (pre, item) {
      return (pre + item) / 2;
    }, 0)); // Read one encoded character at a time.

    while (lines.length > 0) {
      var seg = lines.splice(0, 8).splice(0, 7);
      var a = seg.map(function (line) {
        return line < barThreshold ? 'n' : 'w';
      }).join('');
      code.push(CHAR_SET$3[a]);
    }

    return code.join('');
  };

  var src = createCommonjsModule(function (module) {
    /* eslint-disable */
    var BARCODE_DECODERS = {
      'code-128': code128,
      'code-2of5': _2of5,
      'code-39': code39,
      'code-93': code93,
      'ean-13': ean13,
      'ean-8': ean8,
      codabar: codabar
      /* eslint-enable */

      /**
       * Scans and returns barcode from the provided image
       *
       * @param {*} image Image element || Canvas || ImageData || Image Path in Node.js
       * @param {Object} options Options defining type of barcode to detect
       * @param {String} options.barcode Barcode name
       * @param {String=} options.type Type of Barcode
       * @returns {String} Extracted barcode string
       */

    };

    function barcodeDecoder(_x, _x2) {
      return _barcodeDecoder.apply(this, arguments);
    }

    function _barcodeDecoder() {
      _barcodeDecoder = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(image, options) {
        var list, _ref, data, width, height, channels, spoints, numLines, slineStep, start, end, _UTILITIES$getLines, lines, padding, result;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // eslint-disable-next-line
                options.barcode = options.barcode.toLowerCase();
                list = Object.keys(BARCODE_DECODERS);

                if (!(list.indexOf(options.barcode) === -1)) {
                  _context.next = 4;
                  break;
                }

                throw new Error("Invalid barcode specified. Available decoders: ".concat(list, ". https://github.com/mubaidr/Javascript-Barcode-Reader#available-decoders"));

              case 4:
                _context.next = 6;
                return utiltities.getImageDataFromSource(image);

              case 6:
                _ref = _context.sent;
                data = _ref.data;
                width = _ref.width;
                height = _ref.height;
                channels = data.length / (width * height); // check points for barcode location

                spoints = [1, 9, 2, 8, 3, 7, 4, 6, 5];
                numLines = spoints.length;
                slineStep = height / (numLines + 1); // eslint-disable-next-line

              case 14:
                if (!(numLines -= 1)) {
                  _context.next = 26;
                  break;
                }

                // create section of height 2
                start = channels * width * Math.floor(slineStep * spoints[numLines]);
                end = channels * width * Math.floor(slineStep * spoints[numLines]) + 2 * channels * width; // const pxLine = data.slice(start, end)
                // const { lines, padding } = UTILITIES.getLines({

                _UTILITIES$getLines = utiltities.getLines({
                  data: data,
                  start: start,
                  end: end,
                  width: width,
                  height: height,
                  channels: channels
                }), lines = _UTILITIES$getLines.lines, padding = _UTILITIES$getLines.padding;

                if (!(lines && lines.length !== 0)) {
                  _context.next = 24;
                  break;
                }

                // remove empty whitespaces on side of barcode
                if (padding.left) lines.shift();
                if (padding.right) lines.pop(); // Run the decoder

                result = BARCODE_DECODERS[options.barcode](lines, options.type);

                if (!result) {
                  _context.next = 24;
                  break;
                }

                return _context.abrupt("return", result);

              case 24:
                _context.next = 14;
                break;

              case 26:
                throw new Error('Failed to extract barcode!');

              case 27:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _barcodeDecoder.apply(this, arguments);
    }

    if (module && module.exports) {
      module.exports = barcodeDecoder;
    } else {
      commonjsGlobal.javascriptBarcodeReader = barcodeDecoder;
    }
  });

  return src;

}(window.jimp));
//# sourceMappingURL=javascript-barcode-reader.js.map
