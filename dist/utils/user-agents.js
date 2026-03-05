"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.windowsUserAgent = exports.defaultUserAgent = void 0;
exports.randomUserAgent = randomUserAgent;
const constants_1 = require("./constants");
const BROWSER_DATA = {
    windows: {
        platform: "Windows NT 10.0; Win64; x64",
        chromeVersions: ["126.0.0.0", "125.0.0.0", "124.0.0.0"],
        platformVersion: '"15.0.0"'
    },
    mac: {
        platform: "Macintosh; Intel Mac OS X 10_15_7",
        chromeVersions: ["126.0.0.0", "125.0.0.0", "124.0.0.0"],
        platformVersion: '"15.7.9"'
    }
};
exports.defaultUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
function randomUserAgent() {
    const osKey = (0, constants_1.getRandom)(Object.keys(BROWSER_DATA));
    const data = BROWSER_DATA[osKey];
    const version = (0, constants_1.getRandom)(data.chromeVersions);
    const majorVersion = version.split(".")[0];
    const userAgent = `Mozilla/5.0 (${data.platform}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`;
    const brands = [
        `"Not/A)Brand";v="8"`,
        `"Chromium";v="${majorVersion}"`,
        `"Google Chrome";v="${majorVersion}"`
    ];
    const secChUa = brands.join(", ");
    const secChUaFullVersionList = brands.map((b) => b.replace(/"$/, '.0.0.0"')).join(", ");
    return {
        userAgent,
        secChUa,
        secChUaFullVersionList,
        secChUaPlatform: `"${osKey === "windows" ? "Windows" : "macOS"}"`,
        secChUaPlatformVersion: data.platformVersion
    };
}
exports.windowsUserAgent = exports.defaultUserAgent;
//# sourceMappingURL=user-agents.js.map