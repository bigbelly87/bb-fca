/**
 * @param {Object} defaultFuncs
 * @param {Object} api
 * @param {Object} ctx
 * @returns {function(threadID: string, amount: number, timestamp: number | null): Promise<Array<Object>>}
 */
export default function (defaultFuncs: any, api: any, ctx: any): (threadID: any, amount: any, timestamp: any) => Promise<any>;
