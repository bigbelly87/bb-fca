import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import FormData from 'form-data';
import { CookieJar } from 'tough-cookie';
import { getType } from './constants';
import { getHeaders } from './headers';

const jar = new CookieJar();
const client = wrapper(axios.create({ jar } as any));

let proxyConfig: any = {};

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

function adaptResponse(res: any): any {
  const response = res.response || res;
  return {
    ...response,
    body: response.data,
    statusCode: response.status,
    request: {
      uri: new URL(response.config.url),
      headers: response.config.headers,
      method: response.config.method.toUpperCase(),
      form: response.config.data,
      formData: response.config.data,
    },
  };
}

async function requestWithRetry(
  requestFunction: () => Promise<any>,
  retries: number = 3,
): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await requestFunction();
      return adaptResponse(res);
    } catch (error) {
      if (i === retries - 1) {
        console.error(
          `Request failed after ${retries} attempts:`,
          error.message,
        );
        if (error.response) {
          return adaptResponse(error.response);
        }
        throw error;
      }
      const backoffTime = Math.pow(2, i) * 1000;
      console.warn(
        `Request attempt ${i + 1} failed. Retrying in ${backoffTime}ms...`,
      );
      await delay(backoffTime);
    }
  }
}

export function setProxy(proxyUrl?: string): void {
  if (proxyUrl) {
    try {
      const parsedProxy = new URL(proxyUrl);
      proxyConfig = {
        proxy: {
          host: parsedProxy.hostname,
          port: parsedProxy.port,
          protocol: parsedProxy.protocol.replace(':', ''),
          auth:
            parsedProxy.username && parsedProxy.password
              ? {
                  username: parsedProxy.username,
                  password: parsedProxy.password,
                }
              : undefined,
        },
      };
    } catch (e) {
      console.error('Invalid proxy URL.');
      proxyConfig = {};
    }
  } else {
    proxyConfig = {};
  }
}

export function cleanGet(url: string): Promise<any> {
  const fn = () => client.get(url, { timeout: 60000, ...proxyConfig });
  return requestWithRetry(fn as any);
}

export async function get(
  url: string,
  reqJar: any,
  qs?: any,
  options?: any,
  ctx?: any,
  customHeader?: any,
): Promise<any> {
  const config: any = {
    headers: getHeaders(url, options, ctx, customHeader),
    timeout: 60000,
    params: qs,
    ...proxyConfig,
    validateStatus: (status: number) => status >= 200 && status < 600,
  };
  return requestWithRetry(async () => await client.get(url, config));
}

export async function post(
  url: string,
  reqJar: any,
  form?: any,
  options?: any,
  ctx?: any,
  customHeader?: any,
): Promise<any> {
  const headers = getHeaders(url, options, ctx, customHeader);
  let data: any = form;
  let contentType =
    headers['Content-Type'] || 'application/x-www-form-urlencoded';

  if (contentType.includes('json')) {
    data = JSON.stringify(form);
  } else {
    const transformedForm = new URLSearchParams();
    for (const key in form) {
      if (form.hasOwnProperty(key)) {
        let value = form[key];
        if (getType(value) === 'Object') {
          value = JSON.stringify(value);
        }
        transformedForm.append(key, value);
      }
    }
    data = transformedForm.toString();
  }
  headers['Content-Type'] = contentType;

  const config: any = {
    headers,
    timeout: 60000,
    ...proxyConfig,
    validateStatus: (status: number) => status >= 200 && status < 600,
  };
  return requestWithRetry(async () => await client.post(url, data, config));
}

export async function postFormData(
  url: string,
  reqJar: any,
  form: any,
  qs?: any,
  options?: any,
  ctx?: any,
): Promise<any> {
  const formData = new FormData();
  for (const key in form) {
    if (form.hasOwnProperty(key)) {
      formData.append(key, form[key]);
    }
  }

  const customHeader = {
    'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
  };

  const config: any = {
    headers: getHeaders(url, options, ctx, customHeader),
    timeout: 60000,
    params: qs,
    ...proxyConfig,
    validateStatus: (status: number) => status >= 200 && status < 600,
  };
  return requestWithRetry(async () => await client.post(url, formData, config));
}

export const getJar = (): CookieJar => jar;
