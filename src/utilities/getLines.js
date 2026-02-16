"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLines = getLines;
function getLines(data, width, height) {
    const lines = [];
    const channels = data.length / (width * height);
    let count = 0;
    let columnAverageLast = 0;
    for (let column = 0; column < width; column += 1) {
        let columnSum = 0;
        let columnAverage = 0;
        for (let row = 0; row < height; row += 1) {
            const index = (row * width + column) * channels;
            columnSum += Math.sqrt((Math.pow(data[index], 2) + Math.pow(data[index + 1], 2) + Math.pow(data[index + 2], 2)) / 3);
        }
        // pixels are same in column
        columnAverage = columnSum / height >= 127 ? 255 : 0;
        // skip white padding in the start & end
        if (columnAverage === 255 && count === 0)
            continue;
        // count line width
        if (columnAverage === columnAverageLast) {
            count += 1;
        }
        else {
            lines.push(count);
            columnAverageLast = columnAverage;
            count = 1;
        }
        // skip padding in the last
        if (column === width - 1 && columnAverage === 0) {
            lines.push(count);
        }
    }
    return lines;
}
//# sourceMappingURL=getLines.js.map