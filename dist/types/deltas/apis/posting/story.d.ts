/**
 * @namespace api.story
 * @description A collection of functions for interacting with Facebook Stories.
 * @license Ex-it
 * @author Jonell Magallanes, ChoruOfficial
 */
export default function (defaultFuncs: any, api: any, ctx: any): {
    /**
     * Creates a new text-based story.
     * @param {string} message The text content of the story.
     * @param {string} [fontName="classic"] The font to use (`headline`, `classic`, `fancy`).
     * @param {string} [backgroundName="blue"] The background to use (`orange`, `blue`, `green`, `modern`).
     * @returns {Promise<{success: boolean, storyID: string}>}
     */
    create: (message: any, fontName?: string, backgroundName?: string) => Promise<{
        success: boolean;
        storyID: any;
    }>;
    /**
     * Reacts to a story with a specific emoji.
     * @param {string} storyIdOrUrl The ID or full URL of the story to react to.
     * @param {string} reaction The emoji to react with. Must be one of: ❤️, 👍, 🤗, 😆, 😡, 😢, 😮.
     * @returns {Promise<{success: boolean, result: object}>}
     */
    react: (storyIdOrUrl: any, reaction: any) => Promise<{
        success: boolean;
        result: any;
    }>;
    /**
     * Sends a text message reply to a story.
     * @param {string} storyIdOrUrl The ID or full URL of the story to reply to.
     * @param {string} message The text message to send.
     * @returns {Promise<{success: boolean, result: object}>}
     */
    msg: (storyIdOrUrl: any, message: any) => Promise<{
        success: boolean;
        result: any;
    }>;
};
