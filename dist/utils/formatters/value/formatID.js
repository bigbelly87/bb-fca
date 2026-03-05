"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Strips "fbid:" or "id:" prefixes from a Facebook ID string.
 * @param {string} id The ID to format.
 * @returns {string} The formatted ID.
 */
function formatID(id) {
    if (id != undefined && id != null) {
        return id.replace(/(fb)?id[:.]/, '');
    }
    else {
        return id;
    }
}
exports.default = formatID;
//# sourceMappingURL=formatID.js.map