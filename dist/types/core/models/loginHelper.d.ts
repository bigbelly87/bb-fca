/**
 * The main login helper function, orchestrating the login process.
 *
 * @param {object} credentials User credentials or appState.
 * @param {object} globalOptions Global options for the API.
 * @param {function} callback The final callback function.
 * @param {function} setOptionsFunc Reference to the setOptions function from models.
 * @param {function} buildAPIFunc Reference to the buildAPI function from models.
 * @param {object} initialApi The initial API object to extend.
 * @param {function} fbLinkFunc A function to generate Facebook links.
 * @param {string} errorRetrievingMsg The error message for retrieving user ID.
 * @returns {Promise<void>}
 */
declare function loginHelper(credentials: any, globalOptions: any, callback: any, setOptionsFunc: any, buildAPIFunc: any, initialApi: any, fbLinkFunc: (...args: any[]) => string, errorRetrievingMsg: string): Promise<void>;
export default loginHelper;
