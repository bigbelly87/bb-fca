"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const utils = require("../../../utils");
// @ChoruOfficial
/**
 * @param {Object} defaultFuncs
 * @param {Object} api
 * @param {Object} ctx
 * @returns {function(): Promise<void>}
 */
function default_1(defaultFuncs, api, ctx) {
    /**
     * @returns {Promise<void>}
     */
    return async function markAsReadAll() {
        const form = {
            folder: 'inbox',
        };
        try {
            const resData = await defaultFuncs.post('https://www.facebook.com/ajax/mercury/mark_folder_as_read.php', ctx.jar, form);
            const parsedData = utils.parseAndCheckLogin(resData, defaultFuncs);
            if (parsedData.error) {
                throw parsedData;
            }
            return;
        }
        catch (err) {
            utils.error('markAsReadAll', err);
            throw err;
        }
    };
}
//# sourceMappingURL=markAsReadAll.js.map