import ErrorHandler from '../utils/error-handler.js';

export default class ComponentUtils {
    constructor() {

    }
    static getType(type) {
        switch (type) {
            case 'textfield':
                return 'text';
            case 'textarea':
                return 'textarea';
                case 'columns':
                   return 'columns';
                default:
                return ErrorHandler.throwError(ErrorHandler.errorCode.Component.INVALID_TYPE);
        }
    }

    static getControlType(type) {
        switch (type) {
            case 'textfield':
                return 'input';
            case 'textarea':
                return 'textarea';
            case 'columns':
                return 'div';
            default:
                return ErrorHandler.throwError(ErrorHandler.errorCode.Component.INVALID_TYPE);
        }
    }
}