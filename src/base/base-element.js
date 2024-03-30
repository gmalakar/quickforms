import CommonUtils from "../utils/common-utils.js";
import HtmlUtils from "../utils/html-utils.js";
import ComponentUtils from "../utils/component-utils.js";
import BootstrapUtils from "../utils/boostrap-utils.js";

export default class BaseElement {
    captionControl;

    componentControl;

    elementControl;

    #vfControl;

    #ivfControl;

    containingComponent;

    schema = {};

    defaultCaption;

    otherControl;

    designmode = false;

    controlId;

    defaultPlacehHolder;

    defaultMask;

    static defaultCompClass(type) {
        return 'mb-2 qf-form-component';;
    }

    static defaultCaptionClass(type) {
        let cls = 'qf-form-label';
        switch (type) {
            case "checkbox":
                cls = 'qf-form-label-checkbox';
                break;
            case "radio":
                cls = 'qf-form-label-radio';
                break;
            default:
                break;
        }
        return cls;
    }

    static defaultControlClass(type) {
        let cls = 'qf-form-control';
        switch (type) {
            case "checkbox":
                cls = 'qf-form-checkbox';
                break;
            case "radio":
                cls = 'qf-form-radio';
                break;
            case "button":
            case "submit":
                cls = ' btn-primary qf-form-button';
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
        let caption = this.schema['caption'] || '';
        if (CommonUtils.isNullOrEmpty(caption)) {
            this.schema['caption'] = defaultCaption;
        }

        this.#setControlId(this.schema['name'] || '');

        this.initialize();

        this.#setMask();

        this.initControl;
    }

    #setMask() {
        let ph = this.getSchema('attr', 'control', 'placeholder');
        if (CommonUtils.isNullOrEmpty(ph) && !CommonUtils.isNullOrEmpty(this.defaultPlacehHolder)) {
            this.setSchemaBykey('attributes', 'control', 'placeholder', this.defaultPlacehHolder, '');
        }
        let pt = this.getSchema('attr', 'control', 'pattern');
        if (CommonUtils.isNullOrEmpty(pt) && !CommonUtils.isNullOrEmpty(this.defaultMask)) {
            this.setSchemaBykey('attributes', 'control', 'pattern', this.defaultMask, '');
        }
    }
    initialize() {

    }

    initControl() {
    }

    #setControlId(name) {
        if (this.designmode) {
            this.controlId = `${name}-${this.containingContainer.formContainer.name}-design`;
        } else {
            this.controlId = `${name}-${this.containingContainer.formContainer.name}`;
        }
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
        return this.schema['name'] || '';
    }

    set name(value) {
        let oldName = this.schema['name'];
        this.schema['name'] = value;
        //change the name of the component
        if (this.componentControl) {
            this.componentControl.name = value;
            this.componentControl.id = value;
        }
        //chenge the name of the element control
        if (this.elementControl) {
            this.#setControlId();
            this.elementControl.name = this.controlId;
            this.elementControl.id = this.controlId;
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

    #checkIfUsedByOtherComponent(newname) {
        return this.containingContainer.allComponentNames.includes(newname);
    }

    setComponentPropertyLocal(type, name, val) {
    }

    getControl(name) {
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
                crtl = this.elementControl;
                break;
        }
        return crtl;
    }

    resetControl(name) {
    }

    #clearSchema(type, sybtype, key = undefined) {
        if (this.schema.hasOwnProperty(type)) {
            let schema = this.schema[type][sybtype];
            if (schema) {
                let ctrl = this.getControl(sybtype);
                if (ctrl) {
                    if (!CommonUtils.isNullOrUndefined(key)) {
                        switch (type) {
                            case "attributes":
                            case "otherattributes":
                                ctrl.removeAttribute(key);
                                break;
                            case "styles":
                                ctrl.style.removeProperty(key);
                                break;
                        }
                    }
                    else if (CommonUtils.isObjcetButNotArray(schema)) {
                        for (let attr of Object.keys(schema)) {
                            switch (type) {
                                case "attributes":
                                case "otherattributes":
                                    ctrl.removeAttribute(attr);
                                    break;
                                case "styles":
                                    ctrl.style.removeProperty(style);
                                    break;
                            }
                        }
                    }
                }
                if (!CommonUtils.isNullOrUndefined(key)) {
                    if (this.schema[type][sybtype].hasOwnProperty(key)) {
                        delete this.schema[type][sybtype][key];
                    }
                } else {
                    delete this.schema[type][sybtype];
                }
            }
        }
    }

    setSchemaBykey(type, subtype, key, value, removedwhen = undefined) {
        //delete 
        this.#clearSchema(type, subtype, key);
        if (CommonUtils.isNullOrUndefined(removedwhen) || value !== removedwhen) {
            let attrs = value;
            if (!CommonUtils.isNullOrUndefined(key) && !CommonUtils.isNullOrUndefined(value)) {
                if (!this.schema.hasOwnProperty(type)) {
                    this.schema[type] = {};
                }
                if (!this.schema[type].hasOwnProperty(subtype)) {
                    this.schema[type][subtype] = {};
                }
                this.schema[type][subtype][key] = value;
            } else if (CommonUtils.isJson(value)) {
                attrs = JSON.parse(value);

                if (Object.keys(attrs).length > 0) {
                    if (!this.schema.hasOwnProperty(type)) {
                        this.schema[type] = {};
                    }
                    let attrObj = {};
                    for (let [key, attr] of Object.entries(attrs)) {
                        attrObj[attr.name] = attr.value;
                    }
                    this.schema[type][subtype] = attrObj;
                }
            } else if (CommonUtils.isString(value)) {
                if (!this.schema.hasOwnProperty(type)) {
                    this.schema[type] = {};
                }
                this.schema[type][subtype] = value;
            }
        }
    }

    setSchema(type, subtype, value, removedwhen = undefined) {
        this.setSchemaBykey(type, subtype, undefined, value, removedwhen);
    }

    #getSchemaObj(type, subtype, key = undefined) {
        let validKey = !CommonUtils.isNullOrUndefined(key);
        let val = validKey ? '' : {};

        if (this.schema.hasOwnProperty(type) && this.schema[type].hasOwnProperty(subtype)) {
            val = this.schema[type][subtype];
            if (val === undefined) {
                val = validKey ? '' : {};
            } else if (validKey && val.hasOwnProperty) {
                val = val[key];
            }
        }
        return val;
    }

    getSchema(type, subtype, key = undefined) {
        let val = "";
        let validKey = !CommonUtils.isNullOrUndefined(key);
        if (this.schema.hasOwnProperty(type)) {
            val = this.schema[type][subtype];
            if (val && validKey) {
                val = this.schema[type][subtype][key];
            }
            if (val === undefined) {
                val = '';
            } else if (CommonUtils.isObjcetButNotArray(val)) {
                let attrs = {};
                let counter = 0;
                for (let [key, attr] of Object.entries(val)) {
                    attrs[counter++] = { name: key, value: attr };
                }
                val = JSON.stringify(attrs);
            }
        }
        return val;
    }

    resetSchema(type, subtype, key = undefined) {
        let crtl = this.getControl(subtype);
        if (crtl && this.schema.hasOwnProperty(type) && this.schema[type].hasOwnProperty(subtype)) {
            let attrs = this.schema[type][subtype];
            if (!CommonUtils.isNullOrUndefined(key)) {
                attrs = attrs[key];
            }
            if (attrs && crtl) {
                if (CommonUtils.isObjcetButNotArray(attrs)) {
                    for (let [key, val] of Object.entries(attrs)) {
                        switch (type) {
                            case "attributes":
                            case "otherattributes":
                                crtl.setAttribute(key, val);
                                break;
                            case "styles":
                                crtl.style.setProperty(key, val);
                                break;
                        }
                    }
                } else if (CommonUtils.isString(attrs)) {
                    let val = attrs;
                    switch (type) {
                        case "attributes":
                        case "otherattributes":
                            crtl.setAttribute(key, val);
                            break;
                        case "styles":
                            crtl.style.setProperty(key, val);
                            break;
                        case "class":
                            if (this.designmode && subtype === 'component') {
                                val = val + " qf-design-mode";
                            }
                            if (val) {
                                crtl.class = val;
                            }
                            break;
                    }
                }
            }
        }
        this.resetControl(subtype);
    }

    setAttrsFromSchema(type, subtype, attrArr) {
        if (attrArr && CommonUtils.isObjcetButNotArray(attrArr)) {
            for (let [key, val] of Object.entries(this.#getSchemaObj(type, subtype))) {
                let set = !ComponentUtils.blankAttribure(key); //set if not blank attr
                if (!set && val.toString() === 'true') {
                    val = ''
                    set = true;
                }
                if (set) {
                    attrArr[key] = val;
                }
            }
        }
    }

    getEventListenersSchema() {
        let events = this.#getPropSchema('events');
        if (CommonUtils.isJson(events)) {
            events = CommonUtils.jsonToObject(events);
        }
        return events;
    }

    resetRequired(name, val) {
        if (val) {
            this.elementControl.required = true;
            this.elementControl.setAttribute('aria-required', 'true');
            if (this.captionControl) {
                HtmlUtils.addClasses(this.captionControl, 'qf-required');
            }
        } else {
            this.elementControl.removeAttribute(name);
            this.elementControl.removeAttribute('aria-required');
            if (this.captionControl) {
                HtmlUtils.removeClasses(this.captionControl, 'qf-required');
            }
        }
    }

    resetValidation(name, val, reset = true) {
        if (this.elementControl) {
            switch (name) {
                case "required":
                    this.resetRequired(name, val);
                    break;
                case "invalid-feedback":
                case "valid-feedback":
                    let vfid = `${this.controlId}-vf`;
                    let cls = `valid-${this.containingContainer.formContainer.validationtype}`;
                    if (name === 'invalid-feedback') {
                        vfid = `${this.controlId}-ivf`;
                        cls = `invalid-${this.containingContainer.formContainer.validationtype}`;
                    }
                    let vf = HtmlUtils.getElement(vfid);
                    if (CommonUtils.isNullOrEmpty(val)) {
                        if (vf) {
                            vf.remove();
                        }
                        if (name === 'invalid-feedback') {
                            this.#ivfControl = undefined;
                        } else {
                            this.#vfControl = undefined;
                        }
                        this.elementControl.removeAttribute('aria-describedby');
                    } else {
                        if (!vf) {
                            vf = HtmlUtils.createElement('div', vfid, { class: cls });
                            if (name === 'invalid-feedback') {
                                this.#ivfControl = vf;
                            } else {
                                this.#vfControl = vf;
                            }
                            if (reset) {
                                this.elementControl.insertAdjacentElement("afterend", vf);
                            }
                        }
                        this.elementControl.setAttribute('aria-describedby', vfid);
                        vf.innerHTML = val;
                    }
                    break;
            }
        }
    }

    resetGen(name) {
        let val = this.schema[name]
    }

    setComponentProperty(type, name, val, subtype, removedwhen, invalidProp) {
        let useLocal = name === 'col-props' && this.type === 'columns';
        let invalidMsg = "";
        if (!useLocal) {
            switch (type) {
                case "attribute":
                case "attr":
                    this.setSchemaBykey('attributes', subtype, name, val, removedwhen);
                    break;
                case "otherattribute":
                case "otherattr":
                    this.setSchema('otherattributes', name, val, removedwhen);
                    break;
                case "style":
                    this.setSchema('styles', name, val);
                    break;
                case "data":
                case "dataattr":
                    this.setSchemaBykey('attributes', 'data', name, val);
                    break;
                case "class":
                    this.setSchema('class', name, val);
                    break;
                case "prop":
                case "property":
                    this.#setPropSchema(name, val);
                    break;
                case "validation":
                    this.#setValidationPropVal(name, val);
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
                        case "type":
                            this.schema[name] = val;
                            this.elementControl.type = val;
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
            this.setPropertyToControl(type, name, val, subtype);
            this.setComponentPropertyLocal(type, name, val);
            this.containingContainer.propertyChanged(name);
        }
    }

    setPropertyToControl(type, name, val, subtype) {
        switch (type) {
            case "gen":
                this.resetGen(name)
                break;
            case "class":
                this.resetSchema('class', name)
                break;
            case "style":
                this.resetSchema('styles', name)
                break;
            case "attr":
            case "attribute":
                this.resetSchema('attributes', subtype, name)
                break;
            case "otherattr":
            case "otherattribute":
                this.resetSchema('otherattributes', name)
                break;
            case "data":
            case "dataattr":
                this.resetSchema('attributes', 'data', name)
                break;
            case "validation":
                this.resetValidation(name, val);
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

    #setValidationPropVal(key, value) {
        if (!this.schema.hasOwnProperty('validation')) {
            this.schema['validation'] = {};
        }
        if (!CommonUtils.isNullOrEmpty(value)) {
            this.schema.validation[key] = value;
        } else {
            delete this.schema.validation[key];
        }
        if (Object.keys(this.schema.validation).length <= 0) {
            delete this.schema.validation;
        }
    }

    #getValidationPropVal(key) {
        let val = "";
        if (this.schema.hasOwnProperty('validation')) {
            val = this.schema['validation'][key];
            if (val === undefined) {
                val = '';
            }
        }
        return val;
    }

    getValidationSchema() {
        let val = {};
        if (this.schema.hasOwnProperty('validation')) {
            val = this.schema['validation'];
        }
        return val;
    }

    getComponentProperty(type, name, subtype) {
        let val = "";
        switch (type) {
            case "attribute":
            case "attr":
                val = this.getSchema('attributes', subtype, name);
                break;
            case "otherattribute":
            case "otherattr":
                val = this.getSchema('otherattributes', name);
                break;
            case "class":
                val = this.getSchema('class', name);
                break;
            case "style":
                val = this.getSchema('styles', name);
                break;
            case "prop":
            case "property":
                val = this.#getPropSchema(name);
                break;
            case "validation":
                val = this.#getValidationPropVal(name);
                break;
            case "data":
            case "dataattr":
                val = this.getSchema('attributes', 'data', name);
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

    setCompControl() {
        let compAttrs = {};

        let cls = BaseElement.defaultCompClass(this.type);

        let bsClass = BootstrapUtils.getBSComponentClass(this.type);

        if (!CommonUtils.isNullOrEmpty(bsClass)) {
            cls = `${cls} ${bsClass}`;
        }

        let compcls = this.getSchema('class', 'component');

        if (!CommonUtils.isNullOrEmpty(compcls)) {
            cls = `${cls} ${compcls}`;
        }

        if (this.designmode) {
            cls = cls + " qf-design-mode";
        }

        if (this.containingContainer.formContainer.validationtype === 'tooltip') {
            cls = cls + " position-relative";
        }

        compAttrs.class = cls;
        this.setAttrsFromSchema('attributes', 'component', compAttrs);
        this.setAttrsFromSchema('styles', 'component', compAttrs);
        this.setAttrsFromSchema('otherattributes', 'component', compAttrs);
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
        let cls = BaseElement.defaultCaptionClass(this.type);

        let bsClass = BootstrapUtils.getBSlabelClass(this.type);

        if (!CommonUtils.isNullOrEmpty(bsClass)) {
            cls = `${cls} ${bsClass}`;
        }

        let lblcls = this.getSchema('class', 'label');

        if (!CommonUtils.isNullOrEmpty(lblcls)) {
            cls = `${cls} ${lblcls}`;
        }

        lblAttrs.class = cls;
        this.setAttrsFromSchema('attributes', 'label', lblAttrs);
        this.setAttrsFromSchema('styles', 'label', lblAttrs);
        this.setAttrsFromSchema('othersattributes', 'label', lblAttrs);
        lblAttrs['for'] = this.controlId;
        this.captionControl = HtmlUtils.createElement(ComponentUtils.getLabelType(this.type), `lbl-${this.controlId}`, lblAttrs);
        this.setCaption(this.schema.caption);
    }

    setElementControl() {
        let elAttrs = {};
        let cls = BaseElement.defaultControlClass(this.type);

        let bsClass = BootstrapUtils.getBSElementClass(this.type);

        if (!CommonUtils.isNullOrEmpty(bsClass)) {
            cls = `${cls} ${bsClass}`;
        }

        let elcls = this.getSchema('class', 'control');

        if (!CommonUtils.isNullOrEmpty(elcls)) {
            cls = `${cls} ${elcls}`;
        }

        elAttrs.class = cls;

        if (CommonUtils.isNullOrEmpty(elAttrs.class)) {
            elAttrs.class = BaseElement.defaultControlClass;
        }

        this.setAttrsFromSchema('attributes', 'control', elAttrs);
        this.setAttrsFromSchema('styles', 'control', elAttrs);
        this.setAttrsFromSchema('otherattributes', 'control', elAttrs);
        //this.setCompositeAttrs('data', elAttrs);
        elAttrs['type'] = this.type;
        this.elementControl = HtmlUtils.createElement(
            ComponentUtils.getControlType(this.type),
            this.controlId,
            elAttrs
        );

        if (this.elementControl && !this.elementControl.hasAttribute('autocomplete')) {
            this.elementControl.setAttribute('autocomplete', 'off');
        }

        if (this.elementControl && !this.elementControl.hasAttribute('spellcheck')) {
            this.elementControl.setAttribute('spellcheck', 'true');
        }

        if (this.elementControl && !this.elementControl.hasAttribute('lang')) {
            this.elementControl.setAttribute('lang', 'en');
        }
        if (this.elementControl && !this.elementControl.hasAttribute('inputmode') && this.schema.hasOwnProperty('inputmode')) {
            this.elementControl.setAttribute('inputmode', this.schema['inputmode']);
        }

        if (!this.designmode) {
            for (let [seq, event] of Object.entries(this.getEventListenersSchema())) {
                if (event && event.event && event.script) {
                    this.elementControl.addEventListener(event.event, Function(event.script));
                }
            }
        }
        //set validation
        for (let [name, val] of Object.entries(this.getValidationSchema())) {
            if (name) {
                this.resetValidation(name, val, true);
            }
        }
    }

    initializeControl() { }

    setOtherControls() { }

    buildControl() {
        this.initializeControl();

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
            if (this.#vfControl) {
                this.componentControl.appendChild(this.#vfControl);
            }
            if (this.#ivfControl) {
                this.componentControl.appendChild(this.#ivfControl);
            }
            if (this.captionControl) {
                this.elementControl.setAttribute('aria-labelledby', this.captionControl.id);
            }
        }

        this.containerControl.appendChild(this.componentControl);

        this.afterBuild();
    }

    afterBuild() { }

}
