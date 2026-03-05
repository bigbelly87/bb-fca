"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const utils = require("../../../utils");
// @NethWs3Dev
function default_1(defaultFuncs, api, ctx) {
    return async (messageID) => {
        const defData = await defaultFuncs.post("https://www.facebook.com/messaging/unsend_message/", ctx.jar, {
            message_id: messageID
        });
        const resData = await utils.parseAndCheckLogin(ctx, defaultFuncs)(defData);
        if (resData.error) {
            throw new Error(resData);
        }
        return resData;
    };
}
;
//# sourceMappingURL=unsendMessage.js.map