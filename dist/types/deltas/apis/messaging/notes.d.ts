/**
 * @ChoruOfficial
 * @description A module for interacting with Facebook Messenger Notes. This is not for creating notes on a user's profile page, but rather the temporary status-like notes in Messenger.
 * @param {Object} defaultFuncs The default functions provided by the API wrapper.
 * @param {Object} api The full API object.
 * @param {Object} ctx The context object containing the user's session state (e.g., userID, jar).
 * @returns {Object} An object containing methods to create, delete, recreate, and check notes.
 */
export default function (defaultFuncs: any, api: any, ctx: any): {
    create: (text: any, privacy?: string, callback?: any) => void;
    delete: (noteID: any, callback: any) => void;
    recreate: (oldNoteID: any, newText: any, callback: any) => void;
    check: (callback: any) => void;
};
