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


        super(schema, observer, null, designmode);

        this.initForm();

        this.#guid = CommonUtils.ShortGuid();
        if (!schema.hasOwnProperty('caption')) {
            schema['caption'] = this.name;
        }

        this.formSchema = schema;
        this.formCaption = schema['caption'];
        this.buildForm();
    }

    initForm() {

        //set default class
        if (!this.getClass('form')) {
            this.setClass('form', 'fb-form mb-2 border');
        }

        if (!this.getClass('body')) {
            this.setClass('body', 'fb-form-body');
        }

        if (!this.getClass('title')) {
            this.setClass('title', 'fb-form-title mb-0');
        }

        if (!this.getClass('header')) {
            this.setClass('header', 'fb-form-header bg-defaul');
        }

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
        let hdrAttrs = {};
        hdrAttrs.class = `card-header ${this.getClass('header')}`;
        let styles = this.getStyle('header');
        if (!CommonUtils.isNullOrEmpty(styles)) {
            hdrAttrs['styles'] = styles;
        }
        for (let attr of this.getAttributeObj('header')) {
            hdrAttrs[attr['name']] = attr['value'];
        }
        this.formHeader = HtmlUtils.createElement(
            "div",
            'noid',
            hdrAttrs
        );

        let ttlAttrs = {};
        ttlAttrs.class = `card-title ${this.getClass('title')}`;
        let tstyles = this.getStyle('title');
        if (!CommonUtils.isNullOrEmpty(tstyles)) {
            ttlAttrs['styles'] = tstyles;
        }
        for (let attr of this.getAttributeObj('title')) {
            ttlAttrs[attr['name']] = attr['value'];
        }
        ttlAttrs['aria-controls'] = this.#panelId;
        ttlAttrs['aria-expanded'] = true;
        ttlAttrs['role'] = 'button';

        let title = `card-title ${this.getClass('title')}`;

        this.formTitle = HtmlUtils.createElement(
            "span",
            'noid',
            ttlAttrs
        );

        this.formTitle.textContent = this.formCaption;

        this.formHeader.appendChild(this.formTitle);

    }
    setFormBody() {
        let bodyAttrs = {};
        bodyAttrs.class = `card-body ${this.getClass('body')}`;
        let styles = this.getStyle('body');
        if (!CommonUtils.isNullOrEmpty(styles)) {
            bodyAttrs['styles'] = styles;
        }
        for (let attr of this.getAttributeObj('body')) {
            bodyAttrs[attr['name']] = attr['value'];
        }
        this.formBody = HtmlUtils.createElement(
            "div",
            this.#panelId,
            bodyAttrs
        );
    }
    setformFooter() {

    }

    buildForm() {
        let formAttrs = {};
        formAttrs.class = `card ${this.getClass('form')}`;
        let styles = this.getStyle('form');
        if (!CommonUtils.isNullOrEmpty(styles)) {
            formAttrs['styles'] = styles;
        }
        for (let attr of this.getAttributeObj('form')) {
            formAttrs[attr['name']] = attr['value'];
        }
        formAttrs['tabindex'] = -1;
        this.formControl = HtmlUtils.createElement(
            "div",
            this.formid,
            formAttrs
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

    setClass(key, value) {
        if (!this.schema.hasOwnProperty('class')) {
            this.schema['class'] = {};
        }
        this.schema.class[key] = value;
        //to do for controls
    }

    getClass(key) {
        let val = "";
        if (this.schema.hasOwnProperty('class')) {
            val = this.schema['class'][key];
            if (val === undefined) {
                val = '';
            }
        }
        return val;
    }

    setStyle(key, value) {
        if (!this.schema.hasOwnProperty('styles')) {
            this.schema['styles'] = {};
        }
        this.schema.styles[key] = value;
        //to do for controls
    }

    getStyle(key) {
        let val = "";
        if (this.schema.hasOwnProperty('styles')) {
            val = this.schema['styles'][key];
            if (val === undefined) {
                val = '';
            }
        }
        return val;
    }

    setProperty(key, value) {
        if (!this.schema.hasOwnProperty('properties')) {
            this.schema['properties'] = {};
        }
        this.schema.properties[key] = value;
    }

    getProperty(key) {
        let val = "";
        if (this.schema.hasOwnProperty('properties')) {
            val = this.schema['properties'][key];
            if (val === undefined) {
                val = '';
            }
        }
        return val;
    }

    deleteAttrs(name, attrs) {
        let crtl;
        switch (name) {
            case "form":
                crtl = this.formControl;
                break;
            case "body":
                crtl = this.formBody;
                break;
            case "header":
                crtl = this.formHeader;
                break;
            case "title":
                crtl = this.formTitle;
                break;
            default:
                break;
        }
        if (crtl && CommonUtils.isArray(attrs)) {
            for (let attr of val) {
                crtl.removeAttribute(attr.name);
            }
        }
    }

    addAttrs(name, attrs) {
        let crtl;
        switch (name) {
            case "form":
                crtl = this.formControl;
                break;
            case "body":
                crtl = this.formBody;
                break;
            case "header":
                crtl = this.formHeader;
                break;
            case "title":
                crtl = this.formTitle;
                break;
            default:
                break;
        }
        if (crtl && CommonUtils.isArray(attrs)) {
            for (let attr of val) {
                crtl.setAttribute(attr.name, attr.val);
            }
        }
    }

    setAttribute(key, value) {
        if (!this.schema.hasOwnProperty('attributes')) {
            this.schema['attributes'] = {};
        }
        //delete 
        this.deleteAttrs(key, this.schema.attributes[key]);
        delete this.schema.attributes[key];
        let attrs = JSON.parse(value);
        if (attrs && Object.keys(attrs).length > 0) {
            let attrsArray = [];
            for (let [key, attr] of Object.entries(attrs)) {
                attrsArray.push(attr);
            }
            this.schema.attributes[key] = attrsArray;
        }
        //to do for controls
    }

    getAttributeObj(key) {
        let val = [];
        if (this.schema.hasOwnProperty('attributes')) {
            val = this.schema['attributes'][key];
            if (val === undefined) {
                val = [];
            }
        }
        return val;
    }

    getAttribute(key) {
        let val = "";
        if (this.schema.hasOwnProperty('attributes')) {
            val = this.schema['attributes'][key];
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

    //invalidProp is a callback with message
    setFormProperty(type, name, val, invalidProp) {
        switch (type) {
            case "attribute":
            case "attr":
                this.setAttribute(name, val);
                break;
            case "style":
                this.setStyle(name, val);
                break;
            case "prop":
            case "property":
                this.setProperty(name, val);
                break;
            default:
                this.formSchema[name] = val;
                break;
        }
        this.setPropertyToControl(type, name, val);
        this.propertyChanged(name);
    }

    resetClass(name, val) {
        let crtl;
        let cls;
        switch (name) {
            case "class":
                crtl = this.formControl;
                cls = `card ${val}`
                break;
            case "body":
                crtl = this.formBody;
                cls = `card-body ${val}`
                break;
            case "header":
                crtl = this.formHeader;
                cls = `card-header ${val}`
                break;
            case "title":
                crtl = this.formTitle;
                cls = `card-title ${val}`
                break;
            default:
                break;
        }
        if (crtl) {
            crtl.class = cla;
        }
    }

    resetStyle(name, val) {
        let crtl;
        switch (name) {
            case "form":
                crtl = this.formControl;
                break;
            case "body":
                crtl = this.formBody;
                break;
            case "header":
                crtl = this.formHeader;
                break;
            case "title":
                crtl = this.formTitle;
                break;
            default:
                break;
        }
        if (crtl) {
            crtl.styles = val;
        }
    }

    resetGen(name, val) {
        switch (name) {
            case "name":
                this.formName = val;
                break;
            case "caption":
                this.formTitle.textContent = val;
                this.formCaption = val;
                break;
        }
    }
    setPropertyToControl(type, name, val) {
        switch (type) {
            case "gen":
                this.resetGen(name, val)
                break;
            case "class":
                this.resetClass(name, val)
                break;
            case "style":
                this.resetStyle(name, val)
                break;
            case "attrs":
                this.addAttrs(name, val)
                break;
        }
    }

    getFormProperty(type, name) {
        let val = "";
        switch (type) {
            case "attribute":
            case "attr":
                val = this.getAttribute(name);
                break;
            case "class":
                val = this.getClass(name);
                break;
            case "style":
                val = this.getStyle(name);
                break;
            case "prop":
            case "property":
                this.getProperty(name);
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
