//dont import any object here
export default class CommonUtils {
    constructor() { }

    static isNullOrEmpty(value) {
        return (!value || value === undefined || value === '' || value.length === 0);
    };
    
    static isObjcetButNotArray(obj) {
        if (
            typeof obj === 'object' &&
            !Array.isArray(obj) &&
            obj !== null
        ) {
            return true
        }
        return false;
    }

    static isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    static jsonToObject(json) {
        try {
            return JSON.parse(json);
        } catch {
            return null;
        }
    }

    static ShortGuid(){
        return Math.random().toString(36).slice(-6);
    }
    
    static isArray(obj) {
        if (
            typeof obj === 'object' &&
            Array.isArray(obj) &&
            obj !== null
        ) {
            return true
        }
        return false;
    }

    static isNullOrUndefined(obj) {
        return typeof (obj) === "undefined" || obj === null;
    }

    static isString(obj) {
        return typeof obj === 'string' || obj instanceof String;
    }
}