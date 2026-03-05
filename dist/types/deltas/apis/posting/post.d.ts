/**
 * @namespace api.post
 * @description A collection of functions for creating Facebook posts.
 * @license Ex-it
 */
export default function (defaultFuncs: any, api: any, ctx: any): {
    create: (options: any, callback: any) => Promise<{
        success: boolean;
        postID: any;
        url: any;
        data: any;
    }>;
    delete: (postID: any, callback: any) => Promise<{
        success: boolean;
        postID: any;
        data: any;
    }>;
    getComments: (postID: any, callback: any) => Promise<any>;
    uploadPhoto: (photoPath: any, callback: any) => Promise<any>;
};
