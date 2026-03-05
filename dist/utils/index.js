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
const network = __importStar(require("./axios"));
const headers = __importStar(require("./headers"));
const clients = __importStar(require("./clients"));
const constants = __importStar(require("./constants"));
const formatters = __importStar(require("./formatters"));
const userAgents = __importStar(require("./user-agents"));
const cheerio = __importStar(require("cheerio"));
const util = __importStar(require("util"));
async function json(url, jar, qs, options, ctx, customHeader) {
    try {
        const res = await network.get(url, jar, qs, options, ctx, customHeader);
        const body = res.body;
        const $ = cheerio.load(body);
        const scripts = $('script[type="application/json"]');
        if (scripts.length === 0) {
            constants.warn(`No <script type="application/json"> tags found on ${url}`);
            return [];
        }
        const allJsonData = [];
        scripts.each((index, element) => {
            try {
                const jsonContent = $(element).html();
                if (jsonContent) {
                    allJsonData.push(JSON.parse(jsonContent));
                }
            }
            catch (e) {
                constants.warn(`Could not parse JSON from script #${index + 1} on ${url}`);
            }
        });
        return allJsonData;
    }
    catch (error) {
        constants.error(`Error in utils.json fetching from ${url}:`, error);
        throw error;
    }
}
function makeDefaults(html, userID, ctx) {
    let reqCounter = 1;
    const revision = constants.getFrom(html, 'revision":', ",");
    function mergeWithDefaults(obj) {
        const newObj = { av: userID, __user: userID, __req: (reqCounter++).toString(36), __rev: revision, __a: 1, ...(ctx && { fb_dtsg: ctx.fb_dtsg, jazoest: ctx.jazoest }) };
        if (!obj)
            return newObj;
        for (const prop in obj) {
            if (obj.hasOwnProperty(prop) && !newObj[prop]) {
                newObj[prop] = obj[prop];
            }
        }
        return newObj;
    }
    return {
        get: (url, jar, qs, ctxx, customHeader = {}) => network.get(url, jar, mergeWithDefaults(qs), ctx.globalOptions, ctxx || ctx, customHeader),
        post: (url, jar, form, ctxx, customHeader = {}) => network.post(url, jar, mergeWithDefaults(form), ctx.globalOptions, ctxx || ctx, customHeader),
        postFormData: (url, jar, form, qs, ctxx) => network.postFormData(url, jar, mergeWithDefaults(form), mergeWithDefaults(qs), ctx.globalOptions, ctxx || ctx),
    };
}
const utils = {
    ...network,
    ...headers,
    ...clients,
    ...constants,
    ...formatters,
    ...userAgents,
    json,
    makeDefaults,
    promisify: (func) => util.promisify(func),
    delay: (ms) => new Promise(r => setTimeout(r, ms))
};
module.exports = utils;
//# sourceMappingURL=index.js.map