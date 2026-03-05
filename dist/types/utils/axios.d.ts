import { CookieJar } from 'tough-cookie';
export declare function setProxy(proxyUrl?: string): void;
export declare function cleanGet(url: string): Promise<any>;
export declare function get(url: string, reqJar: any, qs?: any, options?: any, ctx?: any, customHeader?: any): Promise<any>;
export declare function post(url: string, reqJar: any, form?: any, options?: any, ctx?: any, customHeader?: any): Promise<any>;
export declare function postFormData(url: string, reqJar: any, form: any, qs?: any, options?: any, ctx?: any): Promise<any>;
export declare const getJar: () => CookieJar;
