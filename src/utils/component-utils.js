import ErrorHandler from './error-handler.js';

export default class ComponentUtils {
    constructor() {
    }

    static getType(type) {
        switch (type) {
            case 'text':
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
            case 'text':
            case 'password':
            case 'number':
            case 'checkbox':
            case 'select':
                return 'input';
            case 'textarea':
                return 'textarea';
            case 'columns':
                return 'div';
            default:
                return ErrorHandler.throwError(ErrorHandler.errorCode.Component.INVALID_TYPE);
        }
    }
    static #validToken = new RegExp('^[A-Za-z][A-Za-z0-9_:\.-]*$');

    static blankAttribure(attr) {
        return attr && HtmlUtils.btnAttrs.includes(attr);
    }

    static blankAttrs = ['required', 'readonly', 'disabled'];
}