/**
 * @param {Object} defaultFuncs
 * @param {Object} api
 * @param {Object} ctx
 * @returns {function(limit: number, timestamp: number | null, tags: string[]): Promise<Array<Object>>}
 */
export default function (defaultFuncs: any, api: any, ctx: any): (limit: any, timestamp?: any, tags?: string[]) => Promise<any>;
