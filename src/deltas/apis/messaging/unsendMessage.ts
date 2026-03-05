import utils = require("../../../utils");
// @NethWs3Dev

export default function(defaultFuncs: any, api: any, ctx: any) {
  return async (messageID) => {
    const defData = await defaultFuncs.post("https://www.facebook.com/messaging/unsend_message/", ctx.jar, {
      message_id: messageID
    })
    const resData = await utils.parseAndCheckLogin(ctx, defaultFuncs)(defData);
    if (resData.error) {
      throw new Error(resData);
    }
    return resData;
  };
};
