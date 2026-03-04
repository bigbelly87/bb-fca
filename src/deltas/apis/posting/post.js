"use strict";

const utils = require('../../../utils');

/**
 * @namespace api.post
 * @description A collection of functions for creating Facebook posts.
 * @license Ex-it
 */
module.exports = function (defaultFuncs, api, ctx) {

    /**
     * Creates a new post on Facebook.
     * @param {string|object} options - The post content (string) or options object.
     * @param {string} options.message - The text content of the post.
     * @param {string} [options.privacy="SELF"] - Privacy setting: "EVERYONE", "FRIENDS", or "SELF".
     * @param {Function} [callback] - Optional callback function.
     * @returns {Promise<object>} The server's response containing post details.
     */
    async function createPost(options, callback) {
        try {
            // Handle both string and object input
            let postMessage = "";
            let privacy = "SELF";

            if (typeof options === "string") {
                postMessage = options;
            } else if (typeof options === "object") {
                postMessage = options.message || "";
                privacy = options.privacy || "SELF";
            } else {
                throw new Error("Invalid input: expected string or object.");
            }

            if (!postMessage) {
                throw new Error("Post message is required.");
            }

            // Validate privacy setting
            const validPrivacy = ["EVERYONE", "FRIENDS", "SELF"];
            if (!validPrivacy.includes(privacy)) {
                throw new Error(`Invalid privacy setting. Use one of: ${validPrivacy.join(", ")}`);
            }

            const composerSessionId = `create-post-${Date.now()}`;
            const idempotenceToken = `${composerSessionId}_FEED`;

            const variables = {
                input: {
                    composer_entry_point: "inline_composer",
                    composer_source_surface: "newsfeed",
                    composer_type: "feed",
                    idempotence_token: idempotenceToken,
                    source: "WWW",
                    audience: {
                        privacy: {
                            allow: [],
                            base_state: privacy,
                            deny: [],
                            tag_expansion_state: "UNSPECIFIED"
                        }
                    },
                    message: {
                        ranges: [],
                        text: postMessage
                    },
                    inline_activities: [],
                    text_format_preset_id: "0",
                    publishing_flow: {
                        supported_flows: ["ASYNC_SILENT", "ASYNC_NOTIF", "FALLBACK"]
                    },
                    reels_remix: {
                        is_original_audio_reusable: true,
                        remix_status: "ENABLED"
                    },
                    logging: {
                        composer_session_id: composerSessionId
                    },
                    navigation_data: {
                        attribution_id_v2: `CometHomeRoot.react,comet.home,via_cold_start,${Date.now()},229279,4748854339,,`
                    },
                    tracking: [null],
                    event_share_metadata: {
                        surface: "newsfeed"
                    },
                    actor_id: ctx.userID,
                    client_mutation_id: "1"
                },
                feedLocation: "NEWSFEED",
                feedbackSource: 1,
                focusCommentID: null,
                gridMediaWidth: null,
                groupID: null,
                scale: 2,
                privacySelectorRenderLocation: "COMET_STREAM",
                checkPhotosToReelsUpsellEligibility: true,
                referringStoryRenderLocation: null,
                renderLocation: "homepage_stream",
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
                canUserManageOffers: false
            };

            const form = {
                av: ctx.userID,
                __user: ctx.userID,
                __a: "1",
                __req: "1",
                __hs: "20516.HCSV2:comet_pkg.2.1...0",
                __ccg: "EXCELLENT",
                __comet_req: "15",
                fb_dtsg: ctx.fb_dtsg,
                jazoest: ctx.jazoest,
                lsd: ctx.fb_dtsg,
                __spin_r: "1034195523",
                __spin_b: "trunk",
                __spin_t: Math.floor(Date.now() / 1000),
                fb_api_caller_class: "RelayModern",
                fb_api_req_friendly_name: "ComposerStoryCreateMutation",
                variables: JSON.stringify(variables),
                server_timestamps: "true",
                doc_id: "35233514182914739"
            };

            const postResult = await defaultFuncs.post(
                "https://www.facebook.com/api/graphql/",
                ctx.jar,
                form,
                {}
            ).then(utils.parseAndCheckLogin(ctx, defaultFuncs));

            if (postResult.error) {
                throw new Error(JSON.stringify(postResult.error));
            }

            const result = {
                success: true,
                postID: postResult.data?.story_create?.story?.id || null,
                data: postResult
            };

            if (callback) {
                callback(null, result);
            }

            return result;

        } catch (err) {
            utils.error("createPost", err);
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
                throw new Error("Post ID is required.");
            }

            const variables = {
                input: {
                    story_id: postID,
                    story_location: "TIMELINE",
                    actor_id: ctx.userID,
                    client_mutation_id: Math.round(Math.random() * 10).toString(),
                }
            };

            const form = {
                av: ctx.userID,
                __user: ctx.userID,
                __a: "1",
                __req: "1",
                __hs: "20516.HCSV2:comet_pkg.2.1...0",
                __ccg: "EXCELLENT",
                __comet_req: "15",
                fb_dtsg: ctx.fb_dtsg,
                jazoest: ctx.jazoest,
                lsd: ctx.fb_dtsg,
                __spin_r: "1034195523",
                __spin_b: "trunk",
                __spin_t: Math.floor(Date.now() / 1000),
                fb_api_caller_class: "RelayModern",
                fb_api_req_friendly_name: "useCometTrashPostMutation",
                variables: JSON.stringify(variables),
                server_timestamps: "true",
                doc_id: "25243162995346433"
            };

            const deleteResult = await defaultFuncs.postFormData(
                "https://www.facebook.com/api/graphql/",
                ctx.jar,
                form,
                {}
            ).then(utils.parseAndCheckLogin(ctx, defaultFuncs));

            if (deleteResult.error || deleteResult.errors) {
                throw new Error(JSON.stringify(deleteResult.error || deleteResult.errors));
            }

            const result = {
                success: true,
                postID: postID,
                data: deleteResult
            };

            if (callback) {
                callback(null, result);
            }

            return result;

        } catch (err) {
            utils.error("deletePost", err);
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

        callback = callback || function (err, data) {
            if (err) return rejectFunc(err);
            resolveFunc(data);
        };

        try {
            let story_fbid, accountID;

            // Handle both string and object input
            if (typeof postID === "string") {
                // If it's a simple post ID, construct URL with user's ID
                story_fbid = postID;
                accountID = ctx.userID;
            } else if (typeof postID === "object") {
                story_fbid = postID.story_fbid;
                accountID = postID.id || ctx.userID;
            } else {
                throw new Error("Invalid input: expected string or object with story_fbid and id.");
            }

            if (!story_fbid) {
                throw new Error("Post ID or story_fbid is required.");
            }

            // Construct the permalink URL
            const url = `https://www.facebook.com/permalink.php?story_fbid=${story_fbid}&id=${accountID}`;
            console.log(url);
            // Make GET request to fetch the page HTML
            const html = await new Promise((resolve, reject) => {
                defaultFuncs
                    .get(url, ctx.jar, {}, null, {})
                    .then(function (resData) {
                        resolve(resData.body.toString());
                    })
                    .catch(function (err) {
                        utils.error("getPostComments", err);
                        reject(err);
                    });
            });
            // Parse HTML to extract JSON data from script tag
            const scriptMatch = html.match(/<script type="application\/json" data-content-len="\d+" data-sjs>(.*?)<\/script>/s);

            if (!scriptMatch || !scriptMatch[1]) {
                throw new Error("Failed to find JSON data in HTML response. The page structure may have changed.");
            }

            const jsonData = JSON.parse(scriptMatch[1]);

            // Navigate to comments in the JSON structure
            if (!jsonData.require || !Array.isArray(jsonData.require) || jsonData.require.length === 0) {
                throw new Error("Invalid JSON structure: 'require' not found.");
            }

            const require = jsonData.require[0].__bbox.require;
            let comments = null;

            // Find the RelayPrefetchedStreamCache entry
            for (const req of require) {
                if (req[0] === "RelayPrefetchedStreamCache") {
                    try {
                        const result = req[3][1].__bbox.result;
                        comments = result.data.node_v2.comet_sections.feedback.story
                            .story_ufi_container.story.feedback_context
                            .feedback_target_with_context.comment_list_renderer.feedback
                            .comment_rendering_instance_for_feed_location.comments;
                        break;
                    } catch (navError) {
                        // Continue searching if this entry doesn't have the expected structure
                        continue;
                    }
                }
            }

            if (!comments || !comments.edges) {
                throw new Error("Comments not found in the response. The post may have no comments or the structure has changed.");
            }

            // Format comments into a cleaner structure
            const commentList = comments.edges.map(edge => {
                const node = edge.node;
                return {
                    id: node.legacy_fbid || node.id,
                    text: node.body?.text || "",
                    author: {
                        id: node.author?.id || null,
                        name: node.author?.name || "Unknown",
                        avatar: node.author?.profile_picture_depth_0?.uri || null
                    },
                    created_time: node.created_time || null,
                    reply_count: node.feedback?.replies_fields?.count || 0,
                    like_count: node.feedback?.reaction_count?.count || 0
                };
            });

            callback(null, commentList);
        } catch (err) {
            utils.error("getPostComments", err);
            callback(err);
        }

        return returnPromise;
    }

    return {
        create: createPost,
        delete: deletePost,
        getComments: getPostComments
    }
};
