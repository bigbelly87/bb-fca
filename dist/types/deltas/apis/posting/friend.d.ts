/**
 * @ChoruOfficial
 * @description A module for managing friend-related actions like listing friends, handling requests, and getting suggestions.
 * @param {Object} defaultFuncs The default functions provided by the API wrapper.
 * @param {Object} api The full API object.
 * @param {Object} ctx The context object containing the user's session state (e.g., userID, jar, fb_dtsg).
 * @returns {Object} A `friendModule` object with methods for friend interactions.
 */
export default function (defaultFuncs: any, api: any, ctx: any): {
    /**
     * @namespace api.friend
     * @description A collection of functions for interacting with friends.
     * @license Ex-it
     * @author ChoruOfficial
     */
    /**
     * Fetches the list of incoming friend requests.
     * @async
     * @returns {Promise<Array<Object>>} A promise that resolves to an array of friend request objects.
     * @throws {Error} If the API request fails or returns an error.
     */
    requests: () => Promise<any>;
    /**
     * Accepts a friend request.
     * @async
     * @param {string} identifier The user ID or name of the person whose friend request is to be accepted. If a name is provided, the function will search through pending requests.
     * @returns {Promise<Object>} A promise that resolves to the API response data upon successful acceptance.
     * @throws {Error} If the identifier is missing, the user is not found in requests, or the API call fails.
     */
    accept: (identifier: any) => Promise<any>;
    /**
     * Fetches the friend list for a given user ID.
     * @async
     * @param {string} [userID=ctx.userID] The ID of the user whose friend list to fetch. Defaults to the logged-in user.
     * @returns {Promise<Array<Object>>} A promise that resolves to an array of formatted friend objects.
     * @throws {Error} If the API request fails.
     */
    list: (userID?: any) => Promise<any>;
    /**
     * @namespace api.friend.suggest
     * @description Functions for managing friend suggestions.
     */
    suggest: {
        /**
         * Fetches a list of suggested friends (People You May Know).
         * @async
         * @param {number} [limit=30] The maximum number of suggestions to fetch.
         * @returns {Promise<Array<Object>>} A promise that resolves to an array of suggested friend objects.
         * @throws {Error} If the API request fails.
         */
        list: (limit?: number) => Promise<any>;
        /**
         * Sends a friend request to a user.
         * @async
         * @param {string} userID The ID of the user to send the friend request to.
         * @returns {Promise<Object>} A promise that resolves to the API response data on success.
         * @throws {Error} If the userID is missing or the API request fails.
         */
        request: (userID: any) => Promise<any>;
    };
};
