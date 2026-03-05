/**
 * @param {Object} defaultFuncs
 * @param {Object} api
 * @param {Object} ctx
 * @returns {function(threadID: string, messageID: string): Promise<void>}
 */
export default function (defaultFuncs: any, api: any, ctx: any): (threadID: any, messageID: any) => Promise<void>;
