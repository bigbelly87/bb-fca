/**
 * @module shareContact
 * @param {Object} defaultFuncs - The default functions provided by the API.
 * @param {Object} api - The full API object.
 * @param {Object} ctx - The context object.
 * @returns {function(text: string, senderID: string, threadID: string, callback: Function): void} - A function to share a contact.
 */
export default function (defaultFuncs: any, api: any, ctx: any): (text: any, senderID: any, threadID: any, callback: any) => void;
