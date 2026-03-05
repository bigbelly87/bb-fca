/**
 * @param {Object} defaultFuncs
 * @param {Object} api
 * @param {Object} ctx
 * @returns {function(netData: Array<Object>): Object | null}
 */
export default function (defaultFuncs: any, api: any, ctx: any): (netData: any) => {
    name: any;
    firstName: any;
    uid: any;
    appID: any;
    dtsgToken: any;
    lsdToken: any;
    dtsgInit: {
        token: any;
        async_get_token: any;
    };
    /**
     * @param {string} key The key of the value to retrieve.
     * @returns {any} The value from the context.
     */
    getCtx: (key: any) => any;
    /**
     * @param {string} key The key of the option to retrieve.
     * @returns {any} The value of the option.
     */
    getOptions: (key: any) => any;
    /**
     * @returns {string | undefined} The current region.
     */
    getRegion: () => any;
};
