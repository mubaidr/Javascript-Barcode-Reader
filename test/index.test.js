"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Jimp = require("jimp");
const path = require("path");
const index_1 = require("../src/index");
const combineAllPossible_1 = require("../src/utilities/combineAllPossible");
const getImageDataFromSource_1 = require("../src/utilities/getImageDataFromSource");
const getLines_1 = require("../src/utilities/getLines");
const isUrl_1 = require("../src/utilities/isUrl");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    jest.setTimeout(60000);
    const imagePath = path.resolve('./test/sample-images/code-93-no-padding.jpg');
    const image = yield Jimp.read(imagePath);
    const canvas = document.createElement('canvas');
    canvas.width = image.getWidth();
    canvas.height = image.getHeight();
    canvas.id = 'Code_93_wikipedia_canvas';
    document.body.appendChild(canvas);
}), 60000);
describe('Count lines in an image', () => {
    test('should detect lines in barcode image', () => __awaiter(void 0, void 0, void 0, function* () {
        const rowsToScan = 3;
        const image = yield Jimp.read('./test/sample-images/small-padding.png');
        const { data, width, height } = image.bitmap;
        const channels = data.length / (width * height);
        const startIndex = channels * width * Math.floor(height / 2);
        const endIndex = startIndex + rowsToScan * channels * width;
        const lines = (0, getLines_1.getLines)(Uint8ClampedArray.from(data.slice(startIndex, endIndex)), width, rowsToScan);
        expect(lines.length).toBe(27);
    }));
    test('should detect lines in barcode image without padding', () => __awaiter(void 0, void 0, void 0, function* () {
        const rowsToScan = 3;
        const image = yield Jimp.read('./test/sample-images/small.png');
        const { data, width, height } = image.bitmap;
        const channels = data.length / (width * height);
        const startIndex = channels * width * Math.floor(height / 2);
        const endIndex = startIndex + rowsToScan * channels * width;
        const lines = (0, getLines_1.getLines)(Uint8ClampedArray.from(data.slice(startIndex, endIndex)), width, rowsToScan);
        expect(lines.length).toBe(27);
    }));
    test('should return zero lines with empty image', () => __awaiter(void 0, void 0, void 0, function* () {
        const rowsToScan = 3;
        const image = yield Jimp.read('./test/sample-images/empty.jpg');
        const { data, width, height } = image.bitmap;
        const channels = data.length / (width * height);
        const startIndex = channels * width * Math.floor(height / 2);
        const endIndex = startIndex + rowsToScan * channels * width;
        const lines = (0, getLines_1.getLines)(Uint8ClampedArray.from(data.slice(startIndex, endIndex)), width, rowsToScan);
        expect(lines.length).toBe(0);
    }));
});
describe('get imageData from source', () => {
    test('should get imageData from file path', () => __awaiter(void 0, void 0, void 0, function* () {
        const url = path.resolve('./test/sample-images/codabar.jpg');
        const dataSource = yield (0, getImageDataFromSource_1.getImageDataFromSource)(url);
        expect(typeof dataSource.data).toBe('object');
        expect(typeof dataSource.width).toBe('number');
        expect(typeof dataSource.height).toBe('number');
    }));
    test.skip('should get imageData from HTMLCanvasElement', () => __awaiter(void 0, void 0, void 0, function* () {
        const imageElement = document.getElementById('Code_93_wikipedia_canvas');
        if (!imageElement || !(imageElement instanceof HTMLCanvasElement))
            return;
        const dataSource = yield (0, getImageDataFromSource_1.getImageDataFromSource)(imageElement);
        expect(typeof dataSource.data).toBe('object');
        expect(typeof dataSource.width).toBe('number');
        expect(typeof dataSource.height).toBe('number');
    }), 30000);
    test('should throw with invalid source', () => {
        (0, getImageDataFromSource_1.getImageDataFromSource)('Olalalala').catch((err) => {
            expect(err).toBeDefined();
        });
    });
});
describe('isUrl', () => {
    test('check if string is URL', () => {
        const url = 'https://upload.wikimedia.org/wikipedia/en/a/a9/Code_93_wikipedia.png';
        expect((0, isUrl_1.isUrl)(url)).toBeTruthy();
        expect((0, isUrl_1.isUrl)('#someString')).toBeFalsy();
    });
});
describe('combineAllPossible', () => {
    test('should be able to combine multiple results into one complete', () => {
        const result = (0, combineAllPossible_1.combineAllPossible)('?123456', '012345?');
        expect(result).toBe('0123456');
        expect((0, combineAllPossible_1.combineAllPossible)('', '')).toBe('');
    });
});
describe('extract barcode from local files', () => {
    test('should detect barcode codabar', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, index_1.default)({
            image: path.resolve('./test/sample-images/codabar.jpg'),
            barcode: 'codabar',
        });
        expect(result).toBe('A40156C');
    }));
    test('should detect barcode codabar', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, index_1.default)({
            image: path.resolve('./test/sample-images/codabar.jpg'),
            barcode: 'codabar',
            options: {
                singlePass: true,
            },
        });
        expect(result).toBe('A40156C');
    }));
    test('should detect barcode 2 of 5 standard', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, index_1.default)({
            image: path.resolve('./test/sample-images/code-2of5.jpg'),
            barcode: 'code-2of5',
        });
        expect(result).toBe('12345670');
    }));
    test('should detect barcode 2 of 5 interleaved', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, index_1.default)({
            image: path.resolve('./test/sample-images/code-2of5-interleaved.jpg'),
            barcode: 'code-2of5',
            barcodeType: 'interleaved',
        });
        expect(result).toBe('12345670');
    }));
    test('should detect barcode 39', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, index_1.default)({
            image: path.resolve('./test/sample-images/code-39.jpg'),
            barcode: 'code-39',
        });
        expect(result).toBe('10023');
    }));
    test('should detect barcode 93', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, index_1.default)({
            image: path.resolve('./test/sample-images/code-93.jpg'),
            barcode: 'code-93',
        });
        expect(result).toBe('123ABC');
    }));
    test('should detect barcode 128: ABC-abc-1234', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, index_1.default)({
            image: path.resolve('./test/sample-images/code-128.jpg'),
            barcode: 'code-128',
        });
        expect(result).toBe('ABC-abc-1234');
    }));
    // test('should detect barcode 128: eeb00f0c-0c7e-a937-1794-25685779ba0c', async () => {
    //   const result = await javascriptBarcodeReader({
    //     image: path.resolve('./test/sample-images/code-128-eeb00f0c-0c7e-a937-1794-25685779ba0c.png'),
    //     barcode: 'code-128',
    //   })
    //   expect(result).toBe('eeb00f0c-0c7e-a937-1794-25685779ba0c')
    // })
    // test('should detect barcode 128: 3107cde3-d1ff-0f93-a215-4109753c0c9e', async () => {
    //   const result = await javascriptBarcodeReader({
    //     image: path.resolve('./test/sample-images/code-128-3107cde3-d1ff-0f93-a215-4109753c0c9e.png'),
    //     barcode: 'code-128',
    //   })
    //   expect(result).toBe('3107cde3-d1ff-0f93-a215-4109753c0c9e')
    // })
    test('should detect barcode EAN-8', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, index_1.default)({
            image: path.resolve('./test/sample-images/ean-8.jpg'),
            barcode: 'ean-8',
            options: {
                useAdaptiveThreshold: true,
            },
        });
        expect(result).toBe('73127727');
    }));
    test('should detect barcode EAN-13 small', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, index_1.default)({
            image: path.resolve('./test/sample-images/ean-13-5901234123457.png'),
            barcode: 'ean-13',
        });
        expect(result).toBe('901234123457');
    }));
    test('should detect barcode EAN-13 large', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, index_1.default)({
            image: path.resolve('./test/sample-images/ean-13.jpg'),
            barcode: 'ean-13',
        });
        expect(result).toBe('901234123457');
    }));
    test('should detect barcode 128 without padding white bars', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, index_1.default)({
            image: path.resolve('./test/sample-images/code-128-no-padding.jpg'),
            barcode: 'code-128',
        });
        expect(result).toBe('12ab#!');
    }));
    test('should detect barcode 128 with multiple zeros', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, index_1.default)({
            image: path.resolve('./test/sample-images/code-128-000.jpg'),
            barcode: 'code-128',
        });
        expect(result).toBe('79619647103200000134407005');
    }));
    test('should detect barcode 128 with default start Code B', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, index_1.default)({
            image: path.resolve('./test/sample-images/L89HE1806005080432.gif'),
            barcode: 'code-128',
        });
        expect(result).toBe('L89HE1806005080432');
    }));
    test('should detect barcode 93 without padding white bars', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, index_1.default)({
            image: path.resolve('./test/sample-images/code-93-no-padding.jpg'),
            barcode: 'code-93',
        });
        expect(result).toBe('WIKIPEDIA');
    }));
    test('should detect barcode 93 with bitmap data', () => __awaiter(void 0, void 0, void 0, function* () {
        const image = yield Jimp.read('./test/sample-images/code-93-no-padding.jpg');
        const { data, width, height } = image.bitmap;
        const result = yield (0, index_1.default)({
            image: {
                data: Uint8ClampedArray.from(data),
                width,
                height,
            },
            barcode: 'code-93',
        });
        expect(result).toBe('WIKIPEDIA');
    }));
});
describe('extract barcode after applying adaptive threhsold', () => {
    test('should detect barcode codabar', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, index_1.default)({
            image: path.resolve('./test/sample-images/codabar.jpg'),
            barcode: 'codabar',
            options: {
                useAdaptiveThreshold: true,
            },
        });
        expect(result).toBe('A40156C');
    }));
    test('should detect barcode 2 of 5', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, index_1.default)({
            image: path.resolve('./test/sample-images/code-2of5.jpg'),
            barcode: 'code-2of5',
            options: {
                useAdaptiveThreshold: true,
            },
        });
        expect(result).toBe('12345670');
    }));
    test('should detect barcode 2 of 5 interleaved', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, index_1.default)({
            image: path.resolve('./test/sample-images/code-2of5-interleaved.jpg'),
            barcode: 'code-2of5',
            barcodeType: 'interleaved',
            options: {
                useAdaptiveThreshold: true,
            },
        });
        expect(result).toBe('12345670');
    }));
});
describe('extract barcode from local files - additional', () => {
    test('should detect barcode 93 from local file', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, index_1.default)({
            image: path.resolve('./test/sample-images/code-93-no-padding.jpg'),
            barcode: 'code-93',
        });
        expect(result).toBe('WIKIPEDIA');
    }));
});
describe('Fails', () => {
    test('throws when no barcode specified', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, index_1.default)({
                image: path.resolve('./test/sample-images/code-93-no-padding.jpg'),
                barcode: 'oallal',
            });
        }
        catch (err) {
            expect(err).toBeDefined();
        }
    }));
    test('throws when invalid barcode specified', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, index_1.default)({
                image: './test/sample-images/empty.jpg',
                barcode: 'none',
            });
        }
        catch (err) {
            expect(err).toBeDefined();
        }
    }));
    test('throws when no barcode found', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, index_1.default)({
                image: './test/sample-images/empty.jpg',
                barcode: 'code-93',
            });
        }
        catch (err) {
            expect(err).toBeDefined();
        }
    }));
});
//# sourceMappingURL=index.test.js.map