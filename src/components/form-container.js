import CommonUtils from '../utils/common-utils.js';
import ErrorHandler from '../utils/error-handler.js';
import HtmlUtils from '../utils/html-utils.js';
import Container from './container.js';

export default class FormContainer extends Container {

    formSchema;
    formControl;
    formid;
    formHeader;
    formBody;
    formTitle;
    formFooter;
    formCaption;
    #guid;

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
            schema['type'] = "form";
        }

        if (!schema.hasOwnProperty('class')) {
            schema['class'] = "fb-form mb-2 border";
        }

        if (!schema.hasOwnProperty('bodyclass')) {
            schema['bodyclass'] = "fb-form-body";
        }

        if (!schema.hasOwnProperty('titleclass')) {
            schema['titleclass'] = "fb-form-title mb-0";
        }

        if (!schema.hasOwnProperty('headerclass')) {
            schema['headerclass'] = "fb-form-header bg-defaul";
        }

        if (!schema.hasOwnProperty('headerclass')) {
            schema['headerclass'] = "fb-form-header bg-defaul";
        }

        super(schema, observer, null, designmode);

        this.#guid = CommonUtils.ShortGuid();
        if (!schema.hasOwnProperty('caption')) {
            schema['caption'] = this.name;
        }

        this.formSchema = schema;
        this.formCaption = schema['caption'];
        this.buildForm();
    }

    #makeUniqueId(id) {
        return `${id}-${this.#guid}`;
    }

    get formid() {
        return this.#makeUniqueId(this.name);
    }

    get #panelId() {
        return this.#makeUniqueId('panel');
    }

    setFromHeader() {
        let headerClass = `card-header ${this.formSchema['headerclass']}`;
        this.formHeader = HtmlUtils.createElement(
            "div",
            'noid',
            {
                class: headerClass,
                'aria-controls': this.#panelId,
                'aria-expanded': true,
                role: 'button'
            }
        );
        let titleClass = `card-title ${this.formSchema['titleclass']}`;

        this.formTitle = HtmlUtils.createElement(
            "span",
            'noid',
            {
                class: titleClass,
                'aria-controls': this.#panelId,
                'aria-expanded': true,
                role: 'button'
            }
        );

        this.formTitle.textContent = this.formCaption;

        this.formHeader.appendChild(this.formTitle);

    }
    setFormBody() {
        let formClass = `card-body ${this.formSchema['bodyclass']}`;
        this.formBody = HtmlUtils.createElement(
            "div",
            this.#panelId,
            {
                class: formClass
            }
        );
    }
    setformFooter() {

    }

    buildForm() {
        let formClass = `card ${this.formSchema['class']}`;
        this.formControl = HtmlUtils.createElement(
            "div",
            this.formid,
            {
                class: formClass,
                tabindex: -1,
            }
        );

        this.setFromHeader();
        this.setFormBody();
        this.setformFooter();
        this.formBody.appendChild(this.control);
        if (this.formHeader) {
            this.formControl.appendChild(this.formHeader);
        }
        this.formControl.appendChild(this.formBody);
        if (this.formFooter) {
            this.formControl.appendChild(this.formFooter);
        }
    }

    getJSONSchema() {
        return JSON.stringify(this.formSchema, null, 2)
    }
}
