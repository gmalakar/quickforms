import ErrorHandler from '../utils/error-handler.js';
export default class ComponentUtils {
    constructor() {
       
    }
    static getType(type) {
        switch (type) {
            case 'textfield':
                return 'text';
            default:
                return ErrorHandler.throwError(ErrorHandler.errorCode.Component.INVALID_TYPE);
        }
    }

    static getControlType(type) {
        switch (type) {
            case 'textfield':
                return 'input';
            default:
                return ErrorHandler.throwError(ErrorHandler.errorCode.Component.INVALID_TYPE);
        }
    }
}