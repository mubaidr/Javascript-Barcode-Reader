// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({19:[function(require,module,exports) {
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

var decoder = function decoder(imgOrId) {
  var doc = document;
  var img = (typeof imgOrId === 'undefined' ? 'undefined' : _typeof(imgOrId)) === 'object' ? imgOrId : doc.getElementById(imgOrId);
  var canvas = doc.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var width = img.width,
      height = img.height;

  // check points for barcode location

  var spoints = [1, 9, 2, 8, 3, 7, 4, 6, 5];
  var numLines = spoints.length;
  var slineStep = height / (numLines + 1);

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0);

  // eslint-disable-next-line
  while (numLines -= 1) {
    // create section of height 2
    var pxLine = ctx.getImageData(0, slineStep * spoints[numLines], width, 2).data;
    var sum = [];
    var min = 0;
    var max = 0;

    // grey scale section and sum of columns pixels in section
    for (var row = 0; row < 2; row += 1) {
      for (var col = 0; col < width; col += 1) {
        var i = (row * width + col) * 4;
        var g = (pxLine[i] * 3 + pxLine[i + 1] * 4 + pxLine[i + 2] * 2) / 9;
        var s = sum[col];

        pxLine[i] = g;
        pxLine[i + 1] = g;
        pxLine[i + 2] = g;

        sum[col] = g + (s === undefined ? 0 : s);
      }
    }

    for (var _i = 0; _i < width; _i += 1) {
      sum[_i] /= 2;
      var _s = sum[_i];

      if (_s < min) {
        min = _s;
      }
      if (_s > max) {
        max = _s;
      }
    }

    // matches columns in two rows
    var pivot = min + (max - min) / 2;
    var bmp = [];

    for (var _col = 0; _col < width; _col += 1) {
      var matches = 0;
      for (var _row = 0; _row < 2; _row += 1) {
        if (pxLine[(_row * width + _col) * 4] > pivot) {
          matches += 1;
        }
      }
      bmp.push(matches > 1);
    }

    // matches width of barcode lines
    var curr = bmp[0];
    var count = 1;
    var lines = [];

    for (var _col2 = 0; _col2 < width; _col2 += 1) {
      if (bmp[_col2] === curr) {
        count += 1;
      } else {
        lines.push(count);
        count = 1;
        curr = bmp[_col2];
      }
    }

    var code = '';
    // start indicator/reference lines
    var bar = ~~((lines[1] + lines[2] + lines[3]) / 3); //eslint-disable-line

    for (var _i2 = 1; _i2 < lines.length; _i2 += 1) {
      var group = void 0;

      if (code.length < 6) {
        group = lines.slice(_i2 * 4, _i2 * 4 + 4);
      } else {
        group = lines.slice(_i2 * 4 + 5, _i2 * 4 + 9);
      }

      var digits = [Math.round(group[0] / bar), Math.round(group[1] / bar), Math.round(group[2] / bar), Math.round(group[3] / bar)];

      code += UPC_SET[digits.join('')] || UPC_SET[digits.reverse().join('')] || 'X';

      if (code.length === 12) {
        return code;
        // eslint-disable-next-line
        break;
      }
    }
    if (code.indexOf('X') === -1) {
      return code || false;
    }
  }
  return false;
};

if (module) {
  module.exports = { decoder: decoder };
}
},{}],10:[function(require,module,exports) {
'use strict';

var _src = require('../src');

var buttons = document.getElementsByTagName('button');

for (var i = 0; i < buttons.length; i += 1) {
  var button = buttons[i];
  console.log(button);
}

console.log(_src.decoder);
},{"../src":19}],22:[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '61170' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
      // Clear the console after HMR
      console.clear();
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[22,10], null)
//# sourceMappingURL=/demo.1f9e6257.map