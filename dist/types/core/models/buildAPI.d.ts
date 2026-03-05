/**
 * Builds the core API context and default functions after successful login.
 *
 * @param {string} html The HTML body from the initial Facebook page.
 * @param {object} jar The cookie jar.
 * @param {Array<object>} netData Network data extracted from the HTML.
 * @param {object} globalOptions The global options object.
 * @param {function} fbLinkFunc A function to generate Facebook links.
 * @param {string} errorRetrievingMsg The error message for retrieving user ID.
 * @returns {Array<object>} An array containing [ctx, defaultFuncs, {}].
 */
declare function buildAPI(html: string, jar: any, netData: any[], globalOptions: any, fbLinkFunc: (...args: any[]) => string, errorRetrievingMsg: string): Promise<[any, any, any]>;
export default buildAPI;
