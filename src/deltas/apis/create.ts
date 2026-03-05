/**
 * @namespace api.create
 * @description A collection of functions for creating and managing content on Facebook.
 * @license Ex-it
 */
export default function(defaultFuncs: any, api: any, ctx: any) {
  const postModule = require('./posting/post').default(defaultFuncs, api, ctx);

  return {
    /**
     * Creates a new post on Facebook.
     * @param {string|object} options - The post content (string) or options object.
     * @param {string} options.message - The text content of the post.
     * @param {string} [options.privacy="SELF"] - Privacy setting: "EVERYONE", "FRIENDS", or "SELF".
     * @param {Function} [callback] - Optional callback function.
     * @returns {Promise<object>} The server's response containing post details.
     */
    addPost: postModule.create,

    /**
     * Deletes a post from Facebook.
     * @param {string} postID - The ID of the post to delete.
     * @param {Function} [callback] - Optional callback function.
     * @returns {Promise<object>} The server's response.
     */
    deletePost: postModule.delete,
  };
}
