import CommonUtils from '../utils/common-utils.js';
import ErrorHandler from '../utils/error-handler.js';
import Container from './container.js';

export default class Form extends Container {

    formSchema;

    constructor(schema, observer, designmode = false) {

        schema = schema || {};

        if (CommonUtils.isJson(schema)) {
            schema = JSON.parse(schema);
        }

        if (!schema.hasOwnProperty('name')) {
            return ErrorHandler.throwError(
                ErrorHandler.errorCode.Form.MISSING_NAME
            );
        }

        if (!schema.hasOwnProperty('type')) {
            schema['type'] = "container";
        }

        if (!schema.hasOwnProperty('components')) {
            schema['components'] = {};
        }

        super(schema, observer, null, designmode);
        this.formSchema = schema;
    }

    getJSONSchema() {
        return JSON.stringify(this.formSchema, null, 2)
    }
}
