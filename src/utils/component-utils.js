import ErrorHandler from './error-handler.js';

export default class ComponentUtils {
    constructor() {
    }

    /*     static getType(type) {
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
        } */

    static getControlType(type) {
        switch (type) {
            case 'select':
                return 'select';
            case 'textarea':
                return 'textarea';
            case 'columns':
                return 'div';
            case 'groupbox':
                return 'fieldset';
            case 'button':
            case 'submit':
                return 'button';
            default:
                return 'input';
        }
    }

    static canUseMask(type) {
        switch (type) {
            case 'text':
            case 'email':
            case 'tel':
            case 'password':
                return true;
            default:
                return false;
        }
    }

    static getLabelType(type) {
        switch (type) {
            case 'groupbox':
                return 'legend';
            default:
                return 'span';
        }
    }

    static #validToken = new RegExp('^[A-Za-z][A-Za-z0-9_:\.-]*$');

    static blankAttribure(attr) {
        return attr && ComponentUtils.blankAttrs.includes(attr);
    }

    static blankAttrs = ['required', 'readonly', 'disabled'];
}