/**
 * Sticker API Module
 * Provides access to Facebook's GraphQL-based sticker endpoints.
 * Made by @ChoruOfficial
 */
export default function (defaultFuncs: any, api: any, ctx: any): {
    /**
     * Search for stickers by keyword
     * @param {string} query - Search term
     * @returns {Promise<Array<Object>>}
     */
    search: (query: any) => Promise<any>;
    /**
     * List user's sticker packs
     * @returns {Promise<Array<Object>>}
     */
    listPacks: () => Promise<any>;
    /**
     * Get all available sticker packs from the store (with pagination)
     * @returns {Promise<Array<Object>>}
     */
    getStorePacks: () => Promise<any[]>;
    /**
     * Merge user's and store sticker packs into one list
     * @returns {Promise<Array<Object>>}
     */
    listAllPacks: () => Promise<any[]>;
    /**
     * Add a sticker pack by ID
     * @param {string} packID - The ID of the sticker pack
     * @returns {Promise<Object>}
     */
    addPack: (packID: any) => Promise<any>;
    /**
     * Get all stickers in a pack
     * @param {string} packID - Sticker pack ID
     * @returns {Promise<Array<Object>>}
     */
    getStickersInPack: (packID: any) => Promise<any>;
    /**
     * Get trending AI-generated stickers
     * @param {{ limit?: number }} options - Options object
     * @returns {Promise<Array<Object>>}
     */
    getAiStickers: ({ limit }?: {
        limit?: number;
    }) => Promise<any>;
};
