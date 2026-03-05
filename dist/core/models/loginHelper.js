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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("../../utils");
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const qs = __importStar(require("querystring"));
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
async function loginHelper(credentials, globalOptions, callback, setOptionsFunc, buildAPIFunc, initialApi, fbLinkFunc, errorRetrievingMsg) {
    let ctx = null;
    let defaultFuncs = null;
    let api = initialApi;
    try {
        const jar = utils.getJar();
        utils.log('Logging in...');
        const appState = credentials.appState;
        if (appState) {
            let cookieStrings = [];
            if (Array.isArray(appState)) {
                cookieStrings = appState.map((c) => [c.name || c.key, c.value].join('='));
            }
            else if (typeof appState === 'string') {
                cookieStrings = appState
                    .split(';')
                    .map((s) => s.trim())
                    .filter(Boolean);
            }
            else {
                throw new Error('Invalid appState format. Please provide an array of cookie objects or a cookie string.');
            }
            cookieStrings.forEach((cookieString) => {
                const domain = '.facebook.com';
                const expires = new Date().getTime() + 1000 * 60 * 60 * 24 * 365;
                const str = `${cookieString}; expires=${expires}; domain=${domain}; path=/;`;
                jar.setCookie(str, `https://${domain}`);
            });
        }
        else if (credentials.email && credentials.password) {
            // Rui
            const url = 'https://api.facebook.com/method/auth.login';
            const params = {
                access_token: '350685531728|62f8ce9f74b12f84c123cc23437a4a32',
                format: 'json',
                sdk_version: 2,
                email: credentials.email,
                locale: 'en_US',
                password: credentials.password,
                generate_session_cookies: 1,
                sig: 'c1c640010993db92e5afd11634ced864',
            };
            const query = qs.stringify(params);
            const xurl = `${url}?${query}`;
            try {
                const resp = await axios_1.default.get(xurl);
                if (resp.status !== 200) {
                    throw new Error('Wrong password / email');
                }
                let cstrs = resp.data['session_cookies'].map((c) => `${c.name}=${c.value}`);
                cstrs.forEach((cstr) => {
                    const domain = '.facebook.com';
                    const expires = new Date().getTime() + 1000 * 60 * 60 * 24 * 365;
                    const str = `${cstr}; expires=${expires}; domain=${domain}; path=/;`;
                    jar.setCookie(str, `https://${domain}`);
                });
            }
            catch (e) {
                throw new Error('Wrong password / email');
            }
        }
        else {
            throw new Error('No cookie or credentials found. Please provide cookies or credentials.');
        }
        if (!api) {
            api = {
                setOptions: setOptionsFunc.bind(null, globalOptions),
                getAppState() {
                    const appState = utils.getAppState(jar);
                    if (!Array.isArray(appState))
                        return [];
                    const uniqueAppState = appState.filter((item, index, self) => self.findIndex((t) => t.key === item.key) === index);
                    return uniqueAppState.length > 0 ? uniqueAppState : appState;
                },
            };
        }
        const resp = await utils
            .get(fbLinkFunc(), jar, null, globalOptions, { noRef: true })
            .then(utils.saveCookies(jar));
        const extractNetData = (html) => {
            const allScriptsData = [];
            const scriptRegex = /<script type="application\/json"[^>]*>(.*?)<\/script>/g;
            let match;
            while ((match = scriptRegex.exec(html)) !== null) {
                try {
                    allScriptsData.push(JSON.parse(match[1]));
                }
                catch (e) {
                    utils.error(`Failed to parse a JSON blob from HTML`, e.message);
                }
            }
            return allScriptsData;
        };
        const netData = extractNetData(resp.body);
        const [newCtx, newDefaultFuncs] = await buildAPIFunc(resp.body, jar, netData, globalOptions, fbLinkFunc, errorRetrievingMsg);
        ctx = newCtx;
        defaultFuncs = newDefaultFuncs;
        api.message = new Map();
        api.timestamp = {};
        /**
         * Loads API modules from the deltas/apis directory.
         *
         * @returns {void}
         */
        const loadApiModules = () => {
            const apiPath = path.join(__dirname, '..', '..', 'deltas', 'apis');
            const ext = __filename.endsWith('.ts') ? '.ts' : '.js';
            const apiFolders = fs
                .readdirSync(apiPath)
                .filter((name) => fs.lstatSync(path.join(apiPath, name)).isDirectory());
            apiFolders.forEach((folder) => {
                const modulePath = path.join(apiPath, folder);
                fs.readdirSync(modulePath)
                    .filter((file) => file.endsWith(ext) && !file.endsWith('.d.ts'))
                    .forEach((file) => {
                    const moduleName = path.basename(file, ext);
                    const fullPath = path.join(modulePath, file);
                    try {
                        api[moduleName] = require(fullPath).default
                            ? require(fullPath).default(defaultFuncs, api, ctx)
                            : require(fullPath)(defaultFuncs, api, ctx);
                    }
                    catch (e) {
                        utils.error(`Failed to load module ${moduleName} from ${folder}:`, e);
                    }
                });
            });
            const listenPath = path.join(__dirname, '..', '..', 'deltas', 'apis', 'mqtt', 'listenMqtt' + ext);
            const realtimePath = path.join(__dirname, '..', '..', 'deltas', 'apis', 'mqtt', 'realtime' + ext);
            if (fs.existsSync(realtimePath)) {
                const mod = require(realtimePath);
                api['realtime'] = (mod.default || mod)(defaultFuncs, api, ctx);
            }
            if (fs.existsSync(listenPath)) {
                const mod = require(listenPath);
                api['listenMqtt'] = (mod.default || mod)(defaultFuncs, api, ctx);
            }
        };
        api.getCurrentUserID = () => ctx.userID;
        api.getOptions = (key) => (key ? globalOptions[key] : globalOptions);
        loadApiModules();
        api.ctx = ctx;
        api.defaultFuncs = defaultFuncs;
        api.globalOptions = globalOptions;
        return callback(null, api);
    }
    catch (error) {
        utils.error('loginHelper', error.error || error);
        return callback(error);
    }
}
exports.default = loginHelper;
//# sourceMappingURL=loginHelper.js.map