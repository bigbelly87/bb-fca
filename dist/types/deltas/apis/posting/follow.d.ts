/**
 * Author @YanMaglinte
 * https://github.com/YANDEVA
 * * Example:
 * api.follow("100090794779367", true); // Set true to follow, false if otherwise.
 * jsdocs @ChoruOfficial
 */
/**
 * @param {object} defaultFuncs The default functions for making API requests.
 * @param {object} api The full API object.
 * @param {object} ctx The context object.
 * @returns {function(senderID: string, boolean: boolean, callback?: (err: any, data?: any) => void): void} The follow function.
 */
export default function (defaultFuncs: any, api: any, ctx: any): (senderID: any, boolean: any, callback: any) => void;
