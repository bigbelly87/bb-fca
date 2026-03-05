import { makeParsable, log, warn } from "./constants";

function formatCookie(arr: any[], url: string): string {
  return arr[0] + "=" + arr[1] + "; Path=" + arr[3] + "; Domain=" + url + ".com";
}

export function parseAndCheckLogin(ctx: any, http: any, retryCount: number = 0): (data: any) => Promise<any> {
  const delay = (ms: number): Promise<void> => new Promise<any>((resolve) => setTimeout(resolve, ms));

  return async (data: any): Promise<any> => {
    if (data.statusCode >= 500 && data.statusCode < 600) {
      if (retryCount >= 5) {
        const err: any = new Error("Request retry failed.");
        err.statusCode = data.statusCode;
        err.res = data.body;
        throw err;
      }

      retryCount++;
      const retryTime = Math.floor(Math.random() * 5000);
      const url = data.request.uri.protocol + "//" + data.request.uri.hostname + data.request.uri.pathname;

      await delay(retryTime);

      if (data.request.headers["content-type"].split(";")[0] === "multipart/form-data") {
        const newData = await http.postFormData(url, ctx.jar, data.request.formData, data.request.qs, ctx.globalOptions, ctx);
        return await parseAndCheckLogin(ctx, http, retryCount)(newData);
      } else {
        const newData = await http.post(url, ctx.jar, data.request.form, ctx.globalOptions, ctx);
        return await parseAndCheckLogin(ctx, http, retryCount)(newData);
      }
    }

    if (data.statusCode === 404) return;

    if (data.statusCode !== 200) {
      throw new Error("parseAndCheckLogin got status code: " + data.statusCode);
    }

    let res: any = null;

    if (typeof data.body === "object" && data.body !== null) {
      res = data.body;
    } else if (typeof data.body === "string") {
      try {
        res = JSON.parse(makeParsable(data.body) as string);
      } catch (e) {
        const err: any = new Error("JSON.parse error.");
        err.detail = e;
        err.res = data.body;
        throw err;
      }
    } else {
      throw new Error("Unknown response body type: " + typeof data.body);
    }

    if (res.redirect && data.request.method === "GET") {
      const redirectRes = await http.get(res.redirect, ctx.jar);
      return await parseAndCheckLogin(ctx, http)(redirectRes);
    }

    if (res.jsmods && res.jsmods.require && Array.isArray(res.jsmods.require[0]) && res.jsmods.require[0][0] === "Cookie") {
      res.jsmods.require[0][3][0] = res.jsmods.require[0][3][0].replace("_js_", "");
      const requireCookie = res.jsmods.require[0][3];
      ctx.jar.setCookie(formatCookie(requireCookie, "facebook"), "https://www.facebook.com");
      ctx.jar.setCookie(formatCookie(requireCookie, "messenger"), "https://www.messenger.com");
    }

    if (res.jsmods && Array.isArray(res.jsmods.require)) {
      const arr = res.jsmods.require;
      for (const i in arr) {
        if (arr[i][0] === "DTSG" && arr[i][1] === "setToken") {
          ctx.fb_dtsg = arr[i][3][0];
          ctx.ttstamp = "2";
          for (let j = 0; j < ctx.fb_dtsg.length; j++) {
            ctx.ttstamp += ctx.fb_dtsg.charCodeAt(j);
          }
        }
      }
    }

    if (res.error === 1357001) {
      const err: any = new Error("Facebook blocked the login");
      err.error = "Not logged in.";
      throw err;
    }

    return res;
  };
}

export function saveCookies(jar: any): (res: any) => any {
  return function (res: any): any {
    const cookies = res.headers["set-cookie"] || [];
    cookies.forEach(function (c: string) {
      if (c.indexOf(".facebook.com") > -1) {
        jar.setCookie(c, "https://www.facebook.com");
      }
      const c2 = c.replace(/domain=\.facebook\.com/, "domain=.messenger.com");
      jar.setCookie(c2, "https://www.messenger.com");
    });
    return res;
  };
}

export function getAccessFromBusiness(jar: any, Options: any): (res: any) => Promise<[string | null, string | null]> {
  return async function (res: any): Promise<[string | null, string | null]> {
    const html = res ? res.body : null;
    const { get } = require("./axios");
    try {
      const businessRes = await get("https://business.facebook.com/content_management", jar, null, Options, null, { noRef: true });
      const match = /"accessToken":"([^.]+)","clientID":/g.exec(businessRes.body);
      const token = match ? match[1] : null;
      return [html, token];
    } catch (e) {
      return [html, null];
    }
  };
}

export function getAppState(jar: any): any[] {
  return jar
    .getCookiesSync("https://www.facebook.com")
    .concat(jar.getCookiesSync("https://www.messenger.com"));
}
