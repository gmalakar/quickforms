import CommonUtils from "../utils/common-utils.js";
import HtmlUtils from "../utils/html-utils.js";
import ComponentUtils from "../utils/component-utils.js";
import BootstrapUtils from "../utils/boostrap-utils.js";

export default class BaseElement {
    captionControl;

    componentControl;

    elementControl;

    containingComponent;

    schema = {};

    defaultCaption;

    otherControl;

    designmode = false;

    controlId;

    static #defaultCompClass(type) {
        return 'mb-2 fb-form-component';;
    }

    static #defaultCaptionClass(type) {
        let cls = 'fb-form-label';
        switch (type) {
            case "checkbox":
                cls = 'fb-form-label-checkbox';
                break;
            case "radio":
                cls = 'fb-form-label-radio';
                break;
            default:
                break;
        }
        return cls;
    }

    static #defaultControlClass(type) {
        let cls = 'fb-form-control';
        switch (type) {
            case "checkbox":
                cls = 'fb-form-checkbox';
                break;
            case "radio":
                cls = 'fb-form-radio';
                break;
            case "button":
                cls = ' btn-primary fb-form-button';
                break;
            default:
                break;
        }
        return cls;
    }


    constructor(containingComponent, defaultCaption = "Base Element") {
        if (this.constructor === BaseElement) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.containingComponent = containingComponent;
        this.schema = containingComponent.schema || {};
        this.designmode = this.containingComponent.designmode || false;
        //set default caption
        if (CommonUtils.isNullOrEmpty(this.schema.caption)) {
            this.schema.caption = defaultCaption;
        }
        this.controlId = `${this.containingContainer.formName}[${this.name}]`;
        this.initControl;
    }

    initControl() {
    }

    get name() {
        this.schema.name || "";
    }

    get containingContainer() {
        return this.containingComponent.container;
    }

    get containerControl() {
        return this.containingComponent.containerControl;
    }

    setCaption(value) {
        this.schema.caption = value;
        if (this.captionControl) {
            this.captionControl.textContent = value;
        }
    }

    get value() {
        if (this.elementControl) {
            return this.elementControl.value;
        } else {
            return "";
        }
    }

    set value(value) {
        if (this.elementControl) {
            this.elementControl.value = value;
        }
    }

    get type() {
        return this.schema.type || null;
    }

    get name() {
        return this.schema.name || null;
    }

    set name(value) {
        let oldName = this.schema.name;
        this.schema.name = value;
        //change the name of the component
        if (this.componentControl) {
            this.componentControl.name = value;
            this.componentControl.id = value;
            //set the new ref
            //this.componentControl.setAttribute("ref", value);
        }
        //chenge the name of the element control
        if (this.elementControl) {
            value = `${this.containingContainer.formName}[${value}]`;
            this.elementControl.name = value;
            this.elementControl.id = value;
        }
        //change the for of the label control
        if (this.captionControl && this.elementControl) {
            this.captionControl.setAttribute("for", this.elementControl.name);
        }
        //change the name in the container
        //chenge the component name
        this.containingComponent.name = this.name;
        this.containingContainer.changeName(oldName, this.name);
    }

    get eventlisteners() {
        return this.schema.eventlisteners || {};
    }

    #checkIfUsedByOtherComponent(newname) {
        return this.containingContainer.allComponentNames.includes(newname);
    }

    setComponentPropertyLocal(type, name, val) {
    }

    #getControl(name) {
        let crtl;
        switch (name) {
            case "label":
                crtl = this.captionControl;
                break;
            case "control":
                crtl = this.elementControl;
                break;
            case "component":
                crtl = this.componentControl;
                break;
            default:
                break;
        }
        return crtl;
    }

    #clearAttrs(name) {
        let attrs = this.schema.attributes[name];
        if (attrs) {
            let crtl = this.#getControl(name);

            if (crtl && CommonUtils.isArray(attrs)) {
                for (let attr of attrs) {
                    crtl.removeAttribute(attr.name);
                }
            }
            delete this.schema.attributes[name];
        }
    }

    setAttrSchema(key, value) {
        if (!this.schema.hasOwnProperty('attributes')) {
            this.schema['attributes'] = {};
        }
        //delete 
        this.#clearAttrs(key);
        let attrs = JSON.parse(value);
        if (attrs && Object.keys(attrs).length > 0) {
            let attrsArray = [];
            for (let [key, attr] of Object.entries(attrs)) {
                attrsArray.push(attr);
            }
            this.schema.attributes[key] = attrsArray;
        }
    }

    #getAttributeObj(key) {
        let val = [];
        if (this.schema.hasOwnProperty('attributes')) {
            val = this.schema['attributes'][key];
            if (val === undefined) {
                val = [];
            }
        }
        return val;
    }

    getAttrSchema(key) {
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
        }
        return val;
    }

    #resetAttrs(name) {
        let crtl = this.#getControl(name);
        let attrs = this.schema?.attributes[name];
        if (crtl && CommonUtils.isArray(attrs)) {
            for (let attr of attrs) {
                crtl.setAttribute(attr.name, attr.value);
            }
        }
    }

    #clearDataAttrs(name) {
        if (this.schema.hasOwnProperty('attributes') &&
            this.schema.attributes.hasOwnProperty('data') &&
            this.schema.attributes.data.hasOwnProperty(name)) {
            delete this.schema.attributes.data[name];
        }
    }

    setDataAttrSchema(key, value) {

        if (!this.schema.hasOwnProperty('attributes')) {
            this.schema['attributes'] = {};
        }
        if (!this.schema.attributes.hasOwnProperty('data')) {
            this.schema.attributes['data'] = {};
        }

        //delete 
        this.#clearDataAttrs(key);

        if (!CommonUtils.isNullOrEmpty(value)) {
            this.schema.attributes.data[key] = value;
        }
    }

    getDataAttrSchema(key) {
        let val = "";
        if (this.schema.hasOwnProperty('attributes') &&
            this.schema.attributes.hasOwnProperty('data') &&
            this.schema.attributes.data.hasOwnProperty(key)) {
            val = this.schema.attributes.data[key];
        }
        return val;
    }

    #resetDataAttrs(name) {
        if (this.elementControl) {
            this.elementControl.setAttribute(name, this.schema?.attributes?.data[name]);
        }
    }

    #resetGen(name) {
        let val = this.schema[name]
    }

    setStyleSchema(key, value) {
        if (!this.schema.hasOwnProperty('styles')) {
            this.schema['styles'] = {};
        }
        //delete 
        this.#clearStyle(key);

        let styles = JSON.parse(value);
        if (styles && Object.keys(styles).length > 0) {
            let styleArr = [];
            for (let [key, attr] of Object.entries(styles)) {
                styleArr.push(attr);
            }
            this.schema.styles[key] = styleArr;
        }
    }

    #resetStyle(name) {
        let crtl = this.#getControl(name);
        if (crtl) {
            let styleArr = this.schema?.styles[name];
            for (let style of styleArr) {
                crtl.style.setProperty(style.name, style.value);
            }
        }
    }

    #clearStyle(name) {
        let styles = this.schema.styles[name];
        if (styles) {
            let crtl = this.#getControl(name);
            if (crtl && CommonUtils.isArray(styles)) {
                for (let attr of styles) {
                    crtl.style.removeProperty(attr.name);
                }
            }
            delete this.schema.styles[name];
        }
    }

    getStyleSchema(key) {
        let val = "";
        if (this.schema.hasOwnProperty('styles')) {
            val = this.schema['styles'][key];
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
        }
        return val;
    }

    setClassSchema(key, value) {
        if (!this.schema.hasOwnProperty('class')) {
            this.schema['class'] = {};
        }
        this.schema.class[key] = value;
        //to do for controls
    }

    getClassSchema(key) {
        let val = "";
        if (this.schema.hasOwnProperty('class')) {
            val = this.schema['class'][key];
            if (val === undefined) {
                val = '';
            }
        }
        return val;
    }

    #resetClass(name) {
        let crtl = this.#getControl(name);
        if (crtl) {
            let cls = this.getClassSchema(name);
            if (this.designmode && name === 'conponent') {
                cls = cls + " fb-design-mode";
            }
            if (cls) {
                crtl.class = cls;
            }
        }
    }

    setComponentProperty(type, name, val, invalidProp) {
        let useLocal = name === 'col-props' && this.type === 'columns';
        let invalidMsg = "";
        if (!useLocal) {
            switch (type) {
                case "attribute":
                case "attr":
                    this.setAttrSchema(name, val);
                    break;
                case "style":
                    this.setStyleSchema(name, val);
                    break;
                case "data":
                case "dataattr":
                    this.setDataAttrSchema(name, val);
                    break;
                case "class":
                    this.setClassSchema(name, val);
                    break;
                case "prop":
                case "property":
                    this.#setPropSchema(name, val);
                    break;
                case "general":
                case "gen":
                    switch (name) {
                        case "name":
                            if (this.schema.name !== val) {
                                //changed
                                if (!HtmlUtils.isValidName(val)) {
                                    invalidMsg = ErrorHandler.errorCode.Component.INVALID_NAME;
                                } else if (this.#checkIfUsedByOtherComponent(val)) {
                                    invalidMsg = ErrorHandler.errorCode.Component.USED_NAME;
                                } else {
                                    this.name = val;
                                }
                            }
                            break;
                        case "caption":
                            this.setCaption(val);
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    this.schema[name] = val;
                    break;
            }
        }
        if (!CommonUtils.isNullOrEmpty(invalidMsg)) {
            if (invalidProp) {
                invalidProp(invalidMsg);
            }
        } else {
            //raise property changed
            this.setPropertyToControl(type, name);
            this.setComponentPropertyLocal(type, name, val);
            this.containingContainer.propertyChanged(name);
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
            case "style":
                this.#resetStyle(name,)
                break;
            case "attrs":
            case "attribute":
                this.#resetAttrs(name)
                break;
            case "data":
            case "dataattr":
                this.#resetDataAttrs(name);
                break;
        }
    }

    #setPropSchema(key, value) {
        if (!this.schema.hasOwnProperty('properties')) {
            this.schema['properties'] = {};
        }
        this.schema.properties[key] = value;
    }

    #getPropSchema(key) {
        let val = "";
        if (this.schema.hasOwnProperty('properties')) {
            val = this.schema['properties'][key];
            if (val === undefined) {
                val = '';
            }
        }
        return val;
    }

    getComponentProperty(type, name) {
        let val = "";
        switch (type) {
            case "attribute":
            case "attr":
                val = this.getAttrSchema(name);
                break;
            case "class":
                val = this.getClassSchema(name);
                break;
            case "style":
                val = this.getStyleSchema(name);
                break;
            case "prop":
            case "property":
                val = this.#getPropSchema(name);
                break;
            case "data":
            case "dataattr":
                val = this.getDataAttrSchema(name);
                break;
            default:
                val = this.schema[name];
                break;
        }
        if (val === undefined) {
            val = '';
        }
        return val;
    }

    getComponentPropertyLocal(type, name, val) {
        return val;
    }

    setAttrs(type, attrArr) {
        if (attrArr && CommonUtils.isArray(attrArr)) {
            for (let attr of this.#getAttributeObj(type)) {
                let attrName = attr['name'];
                let attrVal = attr['value'];
                let set = !ComponentUtils.blankAttribure(attrName); //set if not blank attr
                if (!set && attrVal === 'true') {
                    attrVal = ''
                    set = true;
                }
                if (set) {
                    attrArr[attrName] = attrVal;
                }
            }
        }
    }

    setStyle(type, styleArr) {
        if (styleArr && CommonUtils.isArray(styleArr)) {
            let style = HtmlUtils.joinStyles(this.#getAttributeObj(type));
            if (!CommonUtils.isNullOrEmpty(style)) {
                styleArr['style'] = style;
            }
        }
    }

    setCompControl() {
        let compAttrs = {};

        let cls = BaseElement.#defaultCompClass(this.type);

        let bsClass = BootstrapUtils.getBSComponentClass(this.type);

        if (!CommonUtils.isNullOrEmpty(bsClass)) {
            cls = `${cls} ${bsClass}`;
        }

        let compcls = this.getClassSchema('component')

        if (!CommonUtils.isNullOrEmpty(compcls)) {
            cls = `${cls} ${compcls}`;
        }

        if (this.designmode) {
            cls = cls + " fb-design-mode";
        }

        compAttrs.class = cls;
        this.setStyle('component', compAttrs);
        this.setAttrs('component', compAttrs);
        compAttrs['tabindex'] = -1;
        compAttrs['draggable'] = true;
        compAttrs['ref'] = this.parentComponent?.name || this.name

        this.componentControl = HtmlUtils.createElement(
            "div",
            this.name,
            compAttrs
        );
    }

    setLabelControl() {
        let lblAttrs = {};
        let cls = BaseElement.#defaultCaptionClass(this.type);

        let bsClass = BootstrapUtils.getBSlabelClass(this.type);

        if (!CommonUtils.isNullOrEmpty(bsClass)) {
            cls = `${cls} ${bsClass}`;
        }

        let lblcls = this.getClassSchema('label')

        if (!CommonUtils.isNullOrEmpty(lblcls)) {
            cls = `${cls} ${lblcls}`;
        }

        lblAttrs.class = cls;

        this.setStyle('lable', lblAttrs);
        this.setAttrs('lable', lblAttrs);
        lblAttrs['for'] = this.controlId;
        this.captionControl = HtmlUtils.createElement(ComponentUtils.getLabelType(this.type), "noid", lblAttrs);
        this.setCaption(this.schema.caption);
    }

    setElementControl() {
        let elAttrs = {};
        elAttrs['type'] = this.type;//ComponentUtils.getType(this.type);
        let cls = BaseElement.#defaultControlClass(this.type);

        let bsClass = BootstrapUtils.getBSElementClass(this.type);

        if (!CommonUtils.isNullOrEmpty(bsClass)) {
            cls = `${cls} ${bsClass}`;
        }

        let elcls = this.getClassSchema('control')

        if (!CommonUtils.isNullOrEmpty(elcls)) {
            cls = `${cls} ${elcls}`;
        }

        elAttrs.class = cls;

        if (CommonUtils.isNullOrEmpty(elAttrs.class)) {
            elAttrs.class = BaseElement.#defaultControlClass;
        }

        this.setStyle('control', elAttrs);
        this.setAttrs('control', elAttrs);
        this.setAttrs('data', elAttrs);
        elAttrs['type'] = this.type;
        this.elementControl = HtmlUtils.createElement(
            ComponentUtils.getControlType(this.type),
            this.controlId,
            elAttrs
        );

        for (let [event, fn] of Object.entries(this.eventlisteners)) {
            this.elementControl.addEventListener(event, fn());
        }
    }

    setOtherControls() { }

    buildControl() {
        this.setCompControl();

        this.setLabelControl();

        this.setElementControl();

        this.setOtherControls();

        this.setControls();
    }

    setControls() {

        if (this.captionControl) {
            this.componentControl.appendChild(this.captionControl);
        }

        if (this.otherControl) {
            this.componentControl.appendChild(this.otherControl);
        }

        if (this.elementControl) {
            this.componentControl.appendChild(this.elementControl);
        }

        this.containerControl.appendChild(this.componentControl);
    }

}
