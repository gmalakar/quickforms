import CommonUtils from '../utils/common-utils.js';
import ComponentUtils from '../utils/comp-utils.js';
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

        this.formSchema = schema;

        this.initForm();

        this.#guid = CommonUtils.ShortGuid();
        if (!schema.hasOwnProperty('caption')) {
            schema['caption'] = this.name;
        }

        this.formCaption = schema['caption'];
        this.#buildForm();
    }

    initForm() {

        //set default class
        if (!this.#getClassSchema('form')) {
            this.#setClassSchema('form', 'fb-form mb-2 border');
        }

        if (!this.#getClassSchema('body')) {
            this.#setClassSchema('body', 'fb-form-body');
        }

        if (!this.#getClassSchema('title')) {
            this.#setClassSchema('title', 'fb-form-title mb-0');
        }

        if (!this.#getClassSchema('header')) {
            this.#setClassSchema('header', 'fb-form-header bg-defaul');
        }

    }

    #makeUniqueId(id) {
        return `${id}-${this.#guid}`;
    }

    #setAttrs(type, attrArr) {
        if (attrArr && CommonUtils.isArray(attrArr)) {
            for (let attr of this.#getAttributeObj(type)) {
                attrArr[attr['name']] = attr['value'];
            }
        }
    }

    #setStyle(type, styleArr) {
        if (styleArr && CommonUtils.isArray(styleArr)) {
            let style = HtmlUtils.joinStyles(this.#getAttributeObj(type));
            if (!CommonUtils.isNullOrEmpty(style)) {
                styleArr['style'] = style;
            }
        }
    }

    get formid() {
        return this.#makeUniqueId(this.name);
    }

    get #panelId() {
        return this.#makeUniqueId('panel');
    }

    #setFromHeader() {
        let hdrAttrs = {};
        hdrAttrs.class = `card-header ${this.#getClassSchema('header')}`;

        this.#setStyle('header', hdrAttrs);

        this.#setAttrs('header', hdrAttrs);

        this.formHeader = HtmlUtils.createElement(
            "div",
            'noid',
            hdrAttrs
        );

        let ttlAttrs = {};
        ttlAttrs.class = `card-title ${this.#getClassSchema('title')}`;

        this.#setStyle('title', ttlAttrs);

        this.#setAttrs('title', ttlAttrs);

        ttlAttrs['aria-controls'] = this.#panelId;
        ttlAttrs['aria-expanded'] = true;
        ttlAttrs['role'] = 'button';

        let title = `card-title ${this.#getClassSchema('title')}`;

        this.formTitle = HtmlUtils.createElement(
            "span",
            'noid',
            ttlAttrs
        );

        this.formTitle.textContent = this.formCaption;

        this.formHeader.appendChild(this.formTitle);

    }

    #setFormBody() {
        let bodyAttrs = {};
        bodyAttrs.class = `card-body ${this.#getClassSchema('body')}`;
        this.#setStyle('body', bodyAttrs);
        this.#setAttrs('body', bodyAttrs);
        this.formBody = HtmlUtils.createElement(
            "div",
            this.#panelId,
            bodyAttrs
        );
    }

    #setformFooter() {

    }

    #buildForm() {
        let formAttrs = {};
        formAttrs.class = `card ${this.#getClassSchema('form')}`;
        this.#setStyle('form', formAttrs);
        this.#setAttrs('form', formAttrs);

        formAttrs['tabindex'] = -1;
        this.formControl = HtmlUtils.createElement(
            "div",
            this.formid,
            formAttrs
        );

        this.#setFromHeader();
        this.#setFormBody();
        this.#setformFooter();
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

    #setClassSchema(key, value) {
        if (!this.formSchema.hasOwnProperty('class')) {
            this.formSchema['class'] = {};
        }
        this.formSchema.class[key] = value;
        //to do for controls
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
        //delete 
        this.#clearStyle(key);

        let styles = JSON.parse(value);
        if (styles && Object.keys(styles).length > 0) {
            let styleArr = [];
            for (let [key, attr] of Object.entries(styles)) {
                styleArr.push(attr);
            }
            this.formSchema.styles[key] = styleArr;
        }
    }

    #getControl(name) {
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
        return crtl;
    }

    #resetStyle(name) {
        let crtl = this.#getControl(name);
        if (crtl) {
            let styleArr = this.formSchema?.styles[name];
            for (let style of styleArr) {
                crtl.style.setProperty(style.name, style.value);
            }
        }
    }


    #clearStyle(name) {
        let styles = this.formSchema.styles[name];
        if (styles) {
            let crtl = this.#getControl(name);
            if (crtl && CommonUtils.isArray(styles)) {
                for (let attr of styles) {
                    crtl.style.removeProperty(attr.name);
                }
            }
            delete this.formSchema.styles[name];
        }
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

    #clearAttrs(name) {
        let attrs = this.formSchema.attributes[name];
        if (attrs) {
            let crtl = this.#getControl(name);
            if (crtl && CommonUtils.isArray(attrs)) {
                for (let attr of attrs) {
                    crtl.removeAttribute(attr.name);
                }
            }
            delete this.formSchema.attributes[name];
        }
    }

    #resetAttrs(name) {
        let crtl = this.#getControl(name);
        let attrs = this.formSchema?.attributes[name];
        if (crtl && CommonUtils.isArray(attrs)) {
            for (let attr of attrs) {
                crtl.setAttribute(attr.name, attr.value);
            }
        }
    }

    #setAttrSchema(key, value) {
        if (!this.formSchema.hasOwnProperty('attributes')) {
            this.formSchema['attributes'] = {};
        }
        //delete 
        this.#clearAttrs(key);
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

    //invalidProp is a callback with message
    setFormProperty(type, name, val, invalidProp) {
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
            default:
                this.formSchema[name] = val;
                break;
        }
        this.setPropertyToControl(type, name);
        this.propertyChanged(name);
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
                this.#resetAttrs(name)
                break;
        }
    }

    #resetClass(name) {
        let crtl = this.#getControl(name);
        if (crtl) {
            let val = this.#getClassSchema(name);
            let cls;
            switch (name) {
                case "class":
                    cls = `card ${val}`
                    break;
                case "body":
                    cls = `card-body ${val}`
                    break;
                case "header":
                    cls = `card-header ${val}`
                    break;
                case "title":
                    cls = `card-title ${val}`
                    break;
                default:
                    break;
            }
            if (cls) {
                crtl.class = cls;
            }
        }
    }


    #resetGen(name) {
        let val = this.formSchema[name]
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
