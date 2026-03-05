"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const utils = require("../../../utils");
const fs = __importStar(require("fs"));
/**
 * @namespace api.post
 * @description A collection of functions for creating Facebook posts.
 * @license Ex-it
 */
function default_1(defaultFuncs, api, ctx) {
    /**
     * Creates a new post on Facebook.
     * @param {string|object} options - The post content (string) or options object.
     * @param {string} options.message - The text content of the post.
     * @param {string} [options.privacy="SELF"] - Privacy setting: "EVERYONE", "FRIENDS", or "SELF".
     * @param {Array<string>} [options.photos] - Array of photo IDs to attach.
     * @param {Function} [callback] - Optional callback function.
     * @returns {Promise<object>} The server's response containing post details.
     */
    async function createPost(options, callback) {
        try {
            // Handle both string and object input
            let postMessage = '';
            let privacy = 'SELF';
            let photos = [];
            if (typeof options === 'string') {
                postMessage = options;
            }
            else if (typeof options === 'object') {
                postMessage = options.message || '';
                privacy = options.privacy || 'SELF';
                photos = options.photos || [];
            }
            else {
                throw new Error('Invalid input: expected string or object.');
            }
            // Validate privacy setting
            const validPrivacy = ['EVERYONE', 'FRIENDS', 'SELF'];
            if (!validPrivacy.includes(privacy)) {
                throw new Error(`Invalid privacy setting. Use one of: ${validPrivacy.join(', ')}`);
            }
            // Validate photos
            if (!Array.isArray(photos)) {
                photos = [photos];
            }
            const composerSessionId = `${Date.now().toString(36)}-${Math.random()
                .toString(36)
                .substring(2)}-${Math.random()
                .toString(36)
                .substring(2)}-${Math.random()
                .toString(36)
                .substring(2)}-${Math.random()
                .toString(36)
                .substring(2)}`;
            const idempotenceToken = `${composerSessionId}_FEED`;
            const variables = {
                input: {
                    composer_entry_point: 'inline_composer',
                    composer_source_surface: 'newsfeed',
                    composer_type: 'feed',
                    idempotence_token: idempotenceToken,
                    source: 'WWW',
                    audience: {
                        privacy: {
                            allow: [],
                            base_state: privacy,
                            deny: [],
                            tag_expansion_state: 'UNSPECIFIED',
                        },
                    },
                    message: {
                        ranges: [],
                        text: postMessage,
                    },
                    with_tags_ids: null,
                    inline_activities: [],
                    text_format_preset_id: '0',
                    publishing_flow: {
                        supported_flows: ['ASYNC_SILENT', 'ASYNC_NOTIF', 'FALLBACK'],
                    },
                    logging: {
                        composer_session_id: composerSessionId,
                    },
                    navigation_data: {
                        attribution_id_v2: `CometHomeRoot.react,comet.home,via_cold_start,${Date.now()},229279,4748854339,,`,
                    },
                    tracking: [null],
                    event_share_metadata: {
                        surface: 'newsfeed',
                    },
                    actor_id: ctx.userID,
                    client_mutation_id: '1',
                },
                feedLocation: 'NEWSFEED',
                feedbackSource: 1,
                focusCommentID: null,
                gridMediaWidth: null,
                groupID: null,
                scale: 2,
                privacySelectorRenderLocation: 'COMET_STREAM',
                checkPhotosToReelsUpsellEligibility: true,
                referringStoryRenderLocation: null,
                renderLocation: 'homepage_stream',
                useDefaultActor: false,
                inviteShortLinkKey: null,
                isFeed: true,
                isFundraiser: false,
                isFunFactPost: false,
                isGroup: false,
                isEvent: false,
                isTimeline: false,
                isSocialLearning: false,
                isPageNewsFeed: false,
                isProfileReviews: false,
                isWorkSharedDraft: false,
                hashtag: null,
                canUserManageOffers: false,
            };
            // Add photo attachments if provided
            if (photos && photos.length > 0) {
                variables.input.attachments = photos
                    .filter(Boolean) // Remove null/undefined
                    .map((photoID) => ({
                    photo: {
                        id: String(photoID),
                    },
                }));
            }
            const form = {
                av: ctx.userID,
                __user: ctx.userID,
                __a: '1',
                __req: '1',
                __hs: '20516.HCSV2:comet_pkg.2.1...0',
                __ccg: 'EXCELLENT',
                __comet_req: '15',
                fb_dtsg: ctx.fb_dtsg,
                jazoest: ctx.jazoest,
                lsd: ctx.fb_dtsg,
                __spin_r: '1034195523',
                __spin_b: 'trunk',
                __spin_t: Math.floor(Date.now() / 1000),
                fb_api_caller_class: 'RelayModern',
                fb_api_req_friendly_name: 'ComposerStoryCreateMutation',
                variables: JSON.stringify(variables),
                server_timestamps: 'true',
                doc_id: '35233514182914739',
            };
            const postResult = await defaultFuncs
                .post('https://www.facebook.com/api/graphql/', ctx.jar, form, {})
                .then(utils.parseAndCheckLogin(ctx, defaultFuncs));
            if (postResult.error) {
                throw new Error(JSON.stringify(postResult.error));
            }
            const result = {
                success: true,
                postID: postResult.data?.story_create?.story?.id || null,
                data: postResult,
            };
            if (callback) {
                callback(null, result);
            }
            return result;
        }
        catch (err) {
            utils.error('createPost', err);
            if (callback) {
                callback(err);
            }
            throw err;
        }
    }
    /**
     * Deletes a post from Facebook.
     * @param {string} postID - The ID of the post to delete.
     * @param {Function} [callback] - Optional callback function.
     * @returns {Promise<object>} The server's response.
     */
    async function deletePost(postID, callback) {
        try {
            if (!postID) {
                throw new Error('Post ID is required.');
            }
            const variables = {
                input: {
                    story_id: postID,
                    story_location: 'TIMELINE',
                    actor_id: ctx.userID,
                    client_mutation_id: Math.round(Math.random() * 10).toString(),
                },
            };
            const form = {
                av: ctx.userID,
                __user: ctx.userID,
                __a: '1',
                __req: '1',
                __hs: '20516.HCSV2:comet_pkg.2.1...0',
                __ccg: 'EXCELLENT',
                __comet_req: '15',
                fb_dtsg: ctx.fb_dtsg,
                jazoest: ctx.jazoest,
                lsd: ctx.fb_dtsg,
                __spin_r: '1034195523',
                __spin_b: 'trunk',
                __spin_t: Math.floor(Date.now() / 1000),
                fb_api_caller_class: 'RelayModern',
                fb_api_req_friendly_name: 'useCometTrashPostMutation',
                variables: JSON.stringify(variables),
                server_timestamps: 'true',
                doc_id: '25243162995346433',
            };
            const deleteResult = await defaultFuncs
                .postFormData('https://www.facebook.com/api/graphql/', ctx.jar, form, {})
                .then(utils.parseAndCheckLogin(ctx, defaultFuncs));
            if (deleteResult.error || deleteResult.errors) {
                throw new Error(JSON.stringify(deleteResult.error || deleteResult.errors));
            }
            const result = {
                success: true,
                postID: postID,
                data: deleteResult,
            };
            if (callback) {
                callback(null, result);
            }
            return result;
        }
        catch (err) {
            utils.error('deletePost', err);
            if (callback) {
                callback(err);
            }
            throw err;
        }
    }
    /**
     * Gets comments from a Facebook post.
     * @param {string|object} postID - The post ID (string) or options object.
     * @param {string} postID.story_fbid - The story FBID from the permalink URL.
     * @param {string} postID.id - The account ID from the permalink URL.
     * @param {Function} [callback] - Optional callback function.
     * @returns {Promise<Array>} Array of comments with author info, text, timestamps, etc.
     */
    async function getPostComments(postID, callback) {
        let resolveFunc = function () { };
        let rejectFunc = function () { };
        const returnPromise = new Promise(function (resolve, reject) {
            resolveFunc = resolve;
            rejectFunc = reject;
        });
        callback =
            callback ||
                function (err, data) {
                    if (err)
                        return rejectFunc(err);
                    resolveFunc(data);
                };
        try {
            let story_fbid, accountID;
            // Handle both string and object input
            if (typeof postID === 'string') {
                // If it's a simple post ID, construct URL with user's ID
                story_fbid = postID;
                accountID = ctx.userID;
            }
            else if (typeof postID === 'object') {
                story_fbid = postID.story_fbid;
                accountID = postID.id || ctx.userID;
            }
            else {
                throw new Error('Invalid input: expected string or object with story_fbid and id.');
            }
            if (!story_fbid) {
                throw new Error('Post ID or story_fbid is required.');
            }
            // Construct the permalink URL
            const url = `https://www.facebook.com/permalink.php?story_fbid=${story_fbid}&id=${accountID}`;
            // Make GET request to fetch the page HTML with cookies
            const resData = await utils.get(url, ctx.jar, {}, ctx.globalOptions, ctx);
            const html = resData.body.toString();
            // Extract comments using new logic
            const commentList = extractCommentsFromHTML(html);
            callback(null, commentList);
        }
        catch (err) {
            utils.error('getPostComments', err);
            callback(err);
        }
        return returnPromise;
    }
    /**
     * Navigate to comments in data structure
     * @private
     */
    function navigateToComments(nodeData) {
        try {
            return nodeData?.comet_sections?.feedback?.story?.story_ufi_container
                ?.story?.feedback_context?.feedback_target_with_context
                ?.comment_list_renderer?.feedback
                ?.comment_rendering_instance_for_feed_location?.comments;
        }
        catch (e) {
            return null;
        }
    }
    /**
     * Extract comments from HTML using new parsing logic
     * @private
     */
    function extractCommentsFromHTML(htmlContent) {
        const comments = [];
        try {
            // Find all script tags containing JSON data
            const scriptMatches = htmlContent.match(/<script type="application\/json"\s+data-content-len="\d+"\s+data-sjs>(.*?)<\/script>/gs);
            if (!scriptMatches) {
                return comments;
            }
            // Loop through each script tag
            for (const scriptMatch of scriptMatches) {
                try {
                    // Extract JSON content
                    const jsonMatch = scriptMatch.match(/<script[^>]*>(.*?)<\/script>/s);
                    if (!jsonMatch)
                        continue;
                    const jsonData = JSON.parse(jsonMatch[1]);
                    // Look in require array
                    if (!jsonData.require || !Array.isArray(jsonData.require))
                        continue;
                    for (const req of jsonData.require) {
                        if (!Array.isArray(req))
                            continue;
                        // Find ScheduledServerJS
                        if (req[0] === 'ScheduledServerJS' && req[1] === 'handle') {
                            const payload = req[3];
                            if (!payload || !Array.isArray(payload))
                                continue;
                            for (const item of payload) {
                                if (!item.__bbox || !item.__bbox.require)
                                    continue;
                                for (const bboxReq of item.__bbox.require) {
                                    if (!Array.isArray(bboxReq))
                                        continue;
                                    // Find RelayPrefetchedStreamCache
                                    if (bboxReq[0] === 'RelayPrefetchedStreamCache' &&
                                        bboxReq[1] === 'next') {
                                        const streamData = bboxReq[3];
                                        if (!streamData ||
                                            !Array.isArray(streamData) ||
                                            streamData.length < 2)
                                            continue;
                                        const bboxData = streamData[1];
                                        if (!bboxData ||
                                            !bboxData.__bbox ||
                                            !bboxData.__bbox.result)
                                            continue;
                                        // Navigate to comments
                                        const result = bboxData.__bbox.result;
                                        if (!result.data || !result.data.node_v2)
                                            continue;
                                        const commentData = navigateToComments(result.data.node_v2);
                                        if (commentData &&
                                            commentData.edges &&
                                            Array.isArray(commentData.edges)) {
                                            // Extract comments
                                            commentData.edges.forEach((edge) => {
                                                if (!edge.node)
                                                    return;
                                                const comment = {
                                                    id: edge.node.legacy_fbid,
                                                    graphql_id: edge.node.id,
                                                    text: edge.node.body?.text ||
                                                        edge.node.preferred_body?.text ||
                                                        '',
                                                    created_time: edge.node.created_time,
                                                    author: {
                                                        id: edge.node.author?.id,
                                                        name: edge.node.author?.name,
                                                        avatar: edge.node.author?.profile_picture_depth_0?.uri,
                                                    },
                                                    reply_count: edge.node.feedback?.replies_fields?.count || 0,
                                                    total_reply_count: edge.node.feedback?.replies_fields?.total_count ||
                                                        0,
                                                    depth: edge.node.depth || 0,
                                                    attachments: edge.node.attachments || [],
                                                };
                                                // Get replies if available
                                                if (edge.node.feedback?.replies_connection?.edges) {
                                                    comment.replies = edge.node.feedback.replies_connection.edges
                                                        .map((replyEdge) => {
                                                        if (!replyEdge.node)
                                                            return null;
                                                        return {
                                                            id: replyEdge.node.legacy_fbid,
                                                            text: replyEdge.node.body?.text ||
                                                                replyEdge.node.preferred_body?.text ||
                                                                '',
                                                            created_time: replyEdge.node.created_time,
                                                            author: {
                                                                id: replyEdge.node.author?.id,
                                                                name: replyEdge.node.author?.name,
                                                                avatar: replyEdge.node.author
                                                                    ?.profile_picture_depth_0?.uri,
                                                            },
                                                        };
                                                    })
                                                        .filter((r) => r !== null);
                                                }
                                                comments.push(comment);
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                catch (e) {
                    // Skip JSON parse errors for this script
                    continue;
                }
            }
        }
        catch (error) {
            utils.error('extractCommentsFromHTML', error);
        }
        return comments;
    }
    /**
     * Upload a photo to Facebook
     * @param {string} photoPath - File path to the photo
     * @param {Function} [callback] - Optional callback function
     * @returns {Promise<object>} Object containing photo ID and metadata
     */
    async function uploadPhoto(photoPath, callback) {
        let resolveFunc = function () { };
        let rejectFunc = function () { };
        const returnPromise = new Promise(function (resolve, reject) {
            resolveFunc = resolve;
            rejectFunc = reject;
        });
        callback =
            callback ||
                function (err, data) {
                    if (err)
                        return rejectFunc(err);
                    resolveFunc(data);
                };
        try {
            if (!photoPath) {
                throw new Error('Photo path is required.');
            }
            // Validate if file exists
            if (typeof photoPath !== 'string') {
                throw new Error('Photo path must be a string.');
            }
            if (!fs.existsSync(photoPath)) {
                throw new Error(`Photo file not found: ${photoPath}`);
            }
            // Create readable stream from file path
            const photoStream = fs.createReadStream(photoPath);
            // Generate upload_id
            const uploadId = `jsc_c_${Math.random()
                .toString(36)
                .substring(2, 11)}`;
            // Construct URL with query parameters
            const url = new URL('https://upload.facebook.com/ajax/react_composer/attachments/photo/upload');
            url.searchParams.append('av', ctx.userID);
            url.searchParams.append('__aaid', '0');
            url.searchParams.append('__user', ctx.userID);
            url.searchParams.append('__a', '1');
            url.searchParams.append('__req', '1');
            url.searchParams.append('__hs', '20516.HCSV2:comet_pkg.2.1...0');
            url.searchParams.append('dpr', '2');
            url.searchParams.append('__ccg', 'EXCELLENT');
            url.searchParams.append('__comet_req', '15');
            url.searchParams.append('fb_dtsg', ctx.fb_dtsg);
            url.searchParams.append('jazoest', ctx.jazoest);
            url.searchParams.append('lsd', ctx.fb_dtsg);
            // Prepare form data
            const form = {
                source: '8',
                profile_id: ctx.userID,
                waterfallxapp: 'comet',
                farr: photoStream,
                upload_id: uploadId,
            };
            // Upload photo using utils to auto-load cookies
            const uploadResponse = await utils.postFormData(url.toString(), ctx.jar, form, ctx.globalOptions, ctx);
            const uploadResult = JSON.parse(uploadResponse.body.toString().replace(/^for \(;;\);/, ''));
            if (uploadResult.error || uploadResult.errors) {
                throw new Error(JSON.stringify(uploadResult.error || uploadResult.errors));
            }
            // Extract photo ID from response
            const photoId = uploadResult.payload?.fbid || uploadResult.payload?.photoID || null;
            const result = {
                success: true,
                photoID: photoId,
                uploadID: uploadId,
                data: uploadResult,
            };
            callback(null, result);
        }
        catch (err) {
            utils.error('uploadPhoto', err);
            callback(err);
        }
        return returnPromise;
    }
    return {
        create: createPost,
        delete: deletePost,
        getComments: getPostComments,
        uploadPhoto: uploadPhoto,
    };
}
//# sourceMappingURL=post.js.map