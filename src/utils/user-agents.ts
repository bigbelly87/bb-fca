import { getRandom } from "./constants";

interface BrowserPlatform {
  platform: string;
  chromeVersions: string[];
  platformVersion: string;
}

const BROWSER_DATA: Record<string, BrowserPlatform> = {
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

export const defaultUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

export function randomUserAgent() {
  const osKey = getRandom(Object.keys(BROWSER_DATA));
  const data = BROWSER_DATA[osKey];
  const version = getRandom(data.chromeVersions);
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

export const windowsUserAgent = defaultUserAgent;
