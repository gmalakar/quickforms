import ErrorCode from './error-codes.js'
export default class ErrorHandler{
    constructor(){

    }
    static errorCode = new ErrorCode();
    static throwError(error) {
        throw new Error(error);
    }
    static throwBuilderError(key) {
        throw new Error(errorCode.Builder[key]);
    }    static throwFormError(key) {
        throw new Error(errorCode.Form[key]);
    }    
    static throwComponentError(key) {
        throw new Error(errorCode.Component[key]);
    }
}