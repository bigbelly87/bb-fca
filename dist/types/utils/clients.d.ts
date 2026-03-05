export declare function parseAndCheckLogin(ctx: any, http: any, retryCount?: number): (data: any) => Promise<any>;
export declare function saveCookies(jar: any): (res: any) => any;
export declare function getAccessFromBusiness(jar: any, Options: any): (res: any) => Promise<[string | null, string | null]>;
export declare function getAppState(jar: any): any[];
