"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineAllPossible = combineAllPossible;
function combineAllPossible(finalResult, result) {
    if (finalResult === '' || result === '') {
        return result;
    }
    const finalResultArr = finalResult.split('');
    const resultArr = result.split('');
    resultArr.forEach((char, index) => {
        if (!finalResultArr[index] || finalResultArr[index] === '?') {
            if (char && char !== '?') {
                finalResultArr[index] = char;
            }
        }
    });
    return finalResultArr.join('');
}
//# sourceMappingURL=combineAllPossible.js.map