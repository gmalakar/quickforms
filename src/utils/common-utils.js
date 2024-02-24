//dont import any object here
export default class CommonUtils {
    constructor() { }

    static isNullOrEmpty(value) {
        return !value || value === undefined || value === "" || value.length === 0;
    }

    static isObjcetButNotArray(obj) {
        if (obj !== null && typeof obj === "object" && !Array.isArray(obj)) {
            return true;
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

    static isFunction(obj) {
        return obj !== null && typeof obj === "function";
    }

    static jsonToObject(json) {
        try {
            return JSON.parse(json);
        } catch {
            return null;
        }
    }

    static isBoolean(val) {
        return typeof val == "boolean"
    }

    static ShortGuid() {
        return Math.random().toString(36).slice(-6);
    }

    static isArray(obj) {
        if (obj !== null && typeof obj === "object" && Array.isArray(obj)) {
            return true;
        }
        return false;
    }

    static isNullOrUndefined(obj) {
        return typeof obj === "undefined" || obj === null;
    }

    static isString(obj) {
        return typeof obj === "string" || obj instanceof String;
    }

    static deleteFromArray(arr, item) {
        if (CommonUtils.isArray(arr) && arr.includes(item)) {
            arr.splice(arr.indexOf(item), 1);
        }
    }
    static replaceInArray(arr, oldItem, newItem) {
        if (CommonUtils.isArray(arr))
            if (arr.includes(oldItem)) {
                arr.splice(arr.indexOf(oldItem), 1);
            }
        arr.push(newItem);
    }
}
