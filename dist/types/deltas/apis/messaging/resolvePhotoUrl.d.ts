/**
 * @module resolvePhotoUrl
 * @description Fetches the direct URL of a Facebook photo using its photo ID.
 * @param {Object} defaultFuncs - An object containing default request functions.
 * @param {Object} api - Facebook API object (unused here but kept for compatibility).
 * @param {Object} ctx - Context object containing cookies (jar) and other session info.
 * @returns {Function} resolvePhotoUrl - A function that takes a photo ID and optional callback, and returns a Promise resolving to the photo URL.
 */
export default function (defaultFuncs: any, api: any, ctx: any): (photoID: any, callback: any) => Promise<any>;
