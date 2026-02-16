"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUrl = isUrl;
function isUrl(s) {
    const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    if (s.startsWith('#'))
        return false;
    return regexp.test(s);
}
//# sourceMappingURL=isUrl.js.map