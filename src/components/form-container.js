import CommonUtils from '../utils/common-utils.js';
import ErrorHandler from '../utils/error-handler.js';
import HtmlUtils from '../utils/html-utils.js';
import Container from './container.js';
import Panel from '../utils/panel.js';

export default class FormContainer extends Container {

    formControl;
    formSchema;
    formCaption;
    #guid;
    formPanel;
    theForm;

    constructor(placeholder, schema, observer, designmode = false) {
        schema = schema || {};

        if (CommonUtils.isJson(schema)) {
            schema = JSON.parse(schema);
        }

        if (CommonUtils.isNullOrUndefined(placeholder)) {
            return ErrorHandler.throwError(
                ErrorHandler.errorCode.Form.MISSING_PLACEHOLDER
            );
        }

        if (!HtmlUtils.isHTMLElement(placeholder)) {
            placeholder = HtmlUtils.getElement(placeholder)
        }

        if (!HtmlUtils.isHTMLElement(placeholder)) {

            return ErrorHandler.throwError(
                ErrorHandler.errorCode.Form.MISSING_PLACEHOLDER
            );
        }

        if (!schema.hasOwnProperty('name')) {
            return ErrorHandler.throwError(
                ErrorHandler.errorCode.Form.MISSING_NAME
            );
        }

        if (!schema.hasOwnProperty('type')) {
            schema['type'] = "form";
        }

        super(schema, observer, null, designmode);

        this.formSchema = schema;

        this.#guid = CommonUtils.ShortGuid();
        if (!schema.hasOwnProperty('caption')) {
            schema['caption'] = this.name;
        }
        let formAttrs = {};
        if (this.customvalidation) {
            formAttrs['novalidate'] = '';

            formAttrs['class'] = 'needs-validation';
        }
        let method = 'post';
        if (schema.hasOwnProperty('method')) {
            method = schema['method'];
        }

        formAttrs['method'] = method;

        let action = '/';
        if (schema.hasOwnProperty('action')) {
            action = schema['action'];
        }

        formAttrs['action'] = action;

        this.formPanel = new Panel(this.#panelId, schema['caption']);


        this.formControl = this.formPanel.panel;
        let formid = schema.name;
        if (designmode) {
            formid = `${formid}-design`;
        }
        this.theForm = HtmlUtils.createElement('form', formid, formAttrs);
        this.theForm.appendChild(this.formControl);
        placeholder.appendChild(this.theForm);
        this.initForm();

    }

    get name() {
        return this.formSchema['name'];
    }

    resetForm() {
        this.formPanel.resetPanel();
        this.refreshContainer();
        this.initForm();
        console.log('form has reset');
    }


    initForm() {
        //set default class
        if (!this.#getClassSchema('form')) {
            this.#setClassSchema('form', 'qf-form mb-2 border');
        }

        if (!this.#getClassSchema('body')) {
            this.#setClassSchema('body', 'qf-form-body');
        }

        if (!this.#getClassSchema('title')) {
            this.#setClassSchema('title', 'qf-form-title mb-0');
        }

        if (!this.#getClassSchema('header')) {
            this.#setClassSchema('header', 'qf-form-header bg-defaul');
        }

        this.#buildForm();
        if (this.customvalidation) {
            FormContainer.#setCustomValidation();
        }
    }

    static #setCustomValidation() {
        (function () {
            'use strict'

            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.querySelectorAll('.needs-validation')

            // Loop over them and prevent submission
            Array.prototype.slice.call(forms)
                .forEach(function (form) {
                    form.addEventListener('submit', function (event) {
                        if (!form.checkValidity()) {
                            event.preventDefault()
                            event.stopPropagation()
                        }
                        form.classList.add('was-validated')
                    }, false)
                })
        })()
    }

    #makeUniqueId(id) {
        return `${id}-${this.#guid}`;
    }

    #setAttrs(type) {
        if (this.formPanel) {
            switch (type) {
                case "form":
                    this.formPanel.setPanelAttributes(this.#getAttributeObj(type), true);
                    break;
                case "header":
                    this.formPanel.setHeaderAttributes(this.#getAttributeObj(type), true);
                    break;
                case "title":
                    this.formPanel.setTitleAttributes(this.#getAttributeObj(type), true);
                    break;
                case "body":
                    this.formPanel.setBodyAttributes(this.#getAttributeObj(type), true);
                    break;
                case "footer":
                    this.formPanel.setFooterAttributes(this.#getAttributeObj(type), true);
                    break;
                default:
                    break;
            }
        }
    }

    #setStyle(type) {
        if (this.formPanel) {
            switch (type) {
                case "form":
                    this.formPanel.setPanelStyles(this.#getStylesObj(type), true);
                    break;
                case "header":
                    this.formPanel.setHeaderStyles(this.#getStylesObj(type), true);
                    break;
                case "title":
                    this.formPanel.setTitleStyles(this.#getStylesObj(type), true);
                    break;
                case "body":
                    this.formPanel.setBodyStyles(this.#getStylesObj(type), true);
                    break;
                case "footer":
                    this.formPanel.setFooterStyles(this.#getStylesObj(type), true);
                    break;
                default:
                    break;
            }
        }
    }

    #setClass(type) {
        if (this.formPanel) {
            switch (type) {
                case "form":
                    this.formPanel.setPanelClass(this.#getClassSchema(type), true);
                    break;
                case "header":
                    this.formPanel.setHeaderClass(this.#getClassSchema(type), true);
                    break;
                case "title":
                    this.formPanel.setTitleClass(this.#getClassSchema(type), true);
                    break;
                case "body":
                    this.formPanel.setBodyClass(this.#getClassSchema(type), true);
                    break;
                case "footer":
                    this.formPanel.setFooterClass(this.#getClassSchema(type), true);
                    break;
                default:
                    break;
            }
        }
    }

    get #panelId() {
        return this.#makeUniqueId('panel');
    }
    #buildForm() {
        //set caption
        if (this.formPanel) {
            this.formPanel.setCaption(this.schema['caption'])
            this.formPanel.setPanelClass(['h-100']);
            if (this.formPanel.body && this.control) {
                this.formPanel.body.appendChild(this.control);
            }
            if (this.formSchema.hasOwnProperty('styles')) {
                for (let key of Object.keys(this.formSchema.hasOwnProperty('styles'))) {
                    this.#setStyle(key);
                }
            }
            if (this.formSchema.hasOwnProperty('attributes')) {
                for (let key of Object.keys(this.formSchema.hasOwnProperty('attributes'))) {
                    this.#setAttrs(key);
                }
            }
            if (this.formSchema.hasOwnProperty('class')) {
                for (let key of Object.keys(this.formSchema.hasOwnProperty('class'))) {
                    this.#setClass(key);
                }
            }
        }
    }

    getJSONSchema() {
        return JSON.stringify(this.formSchema, null, 2)
    }

    #setClassSchema(key, value) {
        if (!this.formSchema.hasOwnProperty('class')) {
            this.formSchema['class'] = {};
        }
        this.formSchema.class[key] = value;
    }

    #getClassSchema(key) {
        let val = "";
        if (this.formSchema.hasOwnProperty('class')) {
            val = this.formSchema['class'][key];
            if (val === undefined) {
                val = '';
            }
        }
        return val;
    }

    #setStyleSchema(key, value) {
        if (!this.formSchema.hasOwnProperty('styles')) {
            this.formSchema['styles'] = {};
        }
        let styles = JSON.parse(value);
        if (styles && Object.keys(styles).length > 0) {
            let styleArr = [];
            for (let [key, attr] of Object.entries(styles)) {
                styleArr.push(attr);
            }
            this.formSchema.styles[key] = styleArr;
        }
    }

    #resetStyle(name) {
        this.#setStyle(name);
    }


    #getStylesObj(key) {
        let val = [];
        if (this.formSchema.hasOwnProperty('styles')) {
            val = this.formSchema['styles'][key];
            if (val === undefined) {
                val = [];
            }
        }
        return val;
    }
    #getStyleSchema(key) {
        let val = "";
        if (this.formSchema.hasOwnProperty('styles')) {
            val = this.formSchema['styles'][key];
            if (val === undefined) {
                val = '';
            } else if (CommonUtils.isArray(val)) {
                let attrs = {};
                let counter = 0;
                for (let attr of val) {
                    attrs[counter++] = attr
                }
                val = JSON.stringify(attrs);
            }
            return val;
        }
    }

    #setPropSchema(key, value) {
        if (!this.formSchema.hasOwnProperty('properties')) {
            this.formSchema['properties'] = {};
        }
        this.formSchema.properties[key] = value;
    }

    #getPropSchema(key) {
        let val = "";
        if (this.formSchema.hasOwnProperty('properties')) {
            val = this.formSchema['properties'][key];
            if (val === undefined) {
                val = '';
            }
        }
        return val;
    }

    #resetAttrs(name) {
        this.#setAttrs(name);
    }

    #setAttrSchema(key, value) {
        if (!this.formSchema.hasOwnProperty('attributes')) {
            this.formSchema['attributes'] = {};
        }
        //delete 
        let attrs = JSON.parse(value);
        if (attrs && Object.keys(attrs).length > 0) {
            let attrsArray = [];
            for (let [key, attr] of Object.entries(attrs)) {
                attrsArray.push(attr);
            }
            this.formSchema.attributes[key] = attrsArray;
        }
    }

    #getAttributeObj(key) {
        let val = [];
        if (this.formSchema.hasOwnProperty('attributes')) {
            val = this.formSchema['attributes'][key];
            if (val === undefined) {
                val = [];
            }
        }
        return val;
    }

    #getAttribute(key) {
        let val = "";
        if (this.formSchema.hasOwnProperty('attributes')) {
            val = this.formSchema['attributes'][key];
            if (val === undefined) {
                val = '';
            } else if (CommonUtils.isArray(val)) {
                let attrs = {};
                let counter = 0;
                for (let attr of val) {
                    attrs[counter++] = attr
                }
                val = JSON.stringify(attrs);
            }
            return val;
        }
    }

    #setLayoutSchema(key, value) {

        if (!this.schema.hasOwnProperty('styles')) {
            this.schema['styles'] = {};
        }
        if (!this.schema.styles.hasOwnProperty('data')) {
            this.schema.styles['data'] = {};
        }

        if (!CommonUtils.isNullOrEmpty(value)) {
            this.schema.styles.data[key] = value;
        }
    }

    #getLayoutSchema(key) {
        let val = "";
        if (this.schema.hasOwnProperty('styles') &&
            this.schema.styles.hasOwnProperty('data') &&
            this.schema.styles.data.hasOwnProperty(key)) {
            val = this.schema.styles.data[key];
        }
        return val;
    }

    #resetLayouts(name) {
        if (this.formPanel) {
            this.formPanel.setPanelStyles([{ name: name, value: this.schema?.styles?.data[name] }]);
        }
    }
    //invalidProp is a callback with message
    setFormProperty(type, name, val, invalidProp) {
        let invalidMsg = "";
        switch (type) {
            case "attribute":
            case "attr":
                this.#setAttrSchema(name, val);
                break;
            case "style":
                this.#setStyleSchema(name, val);
                break;
            case "class":
                this.#setClassSchema(name, val);
                break;
            case "prop":
            case "property":
                this.#setPropSchema(name, val);
                break;
            case "layout":
                this.#setLayoutSchema(name, val);
                break;
            case "general":
            case "gen":
                switch (name) {
                    case "name":
                        if (this.formSchema.name !== val) {
                            //changed
                            if (!HtmlUtils.isValidName(val)) {
                                invalidMsg = ErrorHandler.errorCode.Form.INVALID_NAME;
                            } else {
                                this.name = val;
                                this.formSchema[name] = val;
                            }
                        }
                        break;
                    default:
                        this.formSchema[name] = val;
                        break;
                }
                break;
            default:
                this.formSchema[name] = val;
                break;
        }
        if (!CommonUtils.isNullOrEmpty(invalidMsg)) {
            if (invalidProp) {
                invalidProp(invalidMsg);
            }
        } else {
            this.setPropertyToControl(type, name);
            this.propertyChanged(name);
        }
    }


    setPropertyToControl(type, name) {
        switch (type) {
            case "gen":
                this.#resetGen(name)
                break;
            case "class":
                this.#resetClass(name)
                break;
            case "style":
                this.#resetStyle(name,)
                break;
            case "attrs":
            case "attribute":
                this.#resetAttrs(name)
                break;
            case "layout":
                this.#resetLayouts(name)
                break;
        }
    }

    #resetClass(name) {
        this.#setClass(name);
    }

    #resetGen(name) {
        let val = this.formSchema[name]
        switch (name) {
            case "caption":
                this.formPanel.setCaption(val)
                break;
        }
    }

    setCurrentFormComponent(name) {
        if (this.allComponents.hasOwnProperty(name)) {
            this.setCurrentComponent(this.allComponents[name]);
        }
    }

    getFormProperty(type, name) {
        let val = "";
        switch (type) {
            case "attribute":
            case "attr":
                val = this.#getAttribute(name);
                break;
            case "class":
                val = this.#getClassSchema(name);
                break;
            case "style":
                val = this.#getStyleSchema(name);
                break;
            case "prop":
            case "property":
                this.#getPropSchema(name);
                break;
            case "layout":
                this.#getLayoutSchema(name, val);
                break;
            default:
                val = this.formSchema[name];
                break;
        }
        if (val === undefined) {
            val = '';
        }
        return val;
    }
}
