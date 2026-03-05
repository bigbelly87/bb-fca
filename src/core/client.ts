import utils = require('../utils');
import buildAPIModel from './models/buildAPI';
import loginHelperModel from './models/loginHelper';
import setOptionsModel from './models/setOptions';

let globalOptions: any = {};
let ctx: any = null;
let defaultFuncs: any = null;
let api: any = null;

const fbLink = (ext?: string): string =>
  'https://www.facebook.com' + (ext ? '/' + ext : '');
const ERROR_RETRIEVING =
  'Error retrieving userID. This can be caused by many factors, including being blocked by Facebook for logging in from an unknown location. Try logging in with a browser to verify.';

async function login(
  credentials: any,
  options: any,
  callback?: (...args: any[]) => any,
): Promise<void> {
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
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  };
  Object.assign(globalOptions, defaultOptions, options);

  await setOptionsModel(globalOptions, options);

  loginHelperModel(
    credentials,
    globalOptions,
    (loginError, loginApi) => {
      if (loginError) {
        return callback(loginError);
      }
      api = loginApi;
      ctx = loginApi.ctx;
      defaultFuncs = loginApi.defaultFuncs;
      return callback(null, loginApi);
    },
    setOptionsModel,
    buildAPIModel,
    api,
    fbLink,
    ERROR_RETRIEVING,
  );
}

export { login };
