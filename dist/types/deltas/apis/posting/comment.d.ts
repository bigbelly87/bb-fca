/**
 * Creates a comment on a Facebook post. Can also reply to an existing comment.
 * @param {string|object} msg - The message to post. Can be a string or an object with `body`, `attachments`, `mentions`, etc.
 * @param {string} postID - The ID of the post to comment on.
 * @param {string} [replyCommentID] - (Optional) The ID of the comment to reply to.
 * @param {function} [callback] - (Optional) A callback function.
 * @returns {Promise<object>} A promise that resolves with the new comment's information.
 */
export default function (defaultFuncs: any, api: any, ctx: any): (msg: any, postID: any, replyCommentID: any, callback: any) => Promise<any>;
