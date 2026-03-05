"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const utils = require("../utils");
const buildAPI_1 = __importDefault(require("./models/buildAPI"));
const loginHelper_1 = __importDefault(require("./models/loginHelper"));
const setOptions_1 = __importDefault(require("./models/setOptions"));
let globalOptions = {};
let ctx = null;
let defaultFuncs = null;
let api = null;
const fbLink = (ext) => 'https://www.facebook.com' + (ext ? '/' + ext : '');
const ERROR_RETRIEVING = 'Error retrieving userID. This can be caused by many factors, including being blocked by Facebook for logging in from an unknown location. Try logging in with a browser to verify.';
async function login(credentials, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }
    if ('logging' in options) {
        utils.logOptions(options.logging);
    }
    const defaultOptions = {
        selfListen: false,
        listenEvents: true,
        listenTyping: false,
        updatePresence: false,
        forceLogin: false,
        autoMarkDelivery: false,
        autoMarkRead: true,
        autoReconnect: true,
        online: true,
        emitReady: false,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    };
    Object.assign(globalOptions, defaultOptions, options);
    await (0, setOptions_1.default)(globalOptions, options);
    (0, loginHelper_1.default)(credentials, globalOptions, (loginError, loginApi) => {
        if (loginError) {
            return callback(loginError);
        }
        api = loginApi;
        ctx = loginApi.ctx;
        defaultFuncs = loginApi.defaultFuncs;
        return callback(null, loginApi);
    }, setOptions_1.default, buildAPI_1.default, api, fbLink, ERROR_RETRIEVING);
}
//# sourceMappingURL=client.js.map