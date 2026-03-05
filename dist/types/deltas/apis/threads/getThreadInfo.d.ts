/**
 * @param {Object} defaultFuncs
 * @param {Object} api
 * @param {Object} ctx
 * @returns {function(threadID: string | string[]): Promise<Object>}
 */
export default function (defaultFuncs: any, api: any, ctx: any): (threadID: any) => Promise<unknown>;
