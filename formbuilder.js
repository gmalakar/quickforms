class FormBuilderModal {
    modalid;
    #modalEl;
    #titleEl;
    #messageEl;
    #footerEl;
    #bootstrapModal;
    #response;
    #caller;

    static YesNo = 'YN';
    static OkCancel = 'OC';
    static Ok = 'OK';

    constructor(id) {
        this.modalid = id;
    }

    hide() {
        if (this.#bootstrapModal) {
            this.#bootstrapModal.hide();
        }
    };

    show() {
        if (this.#bootstrapModal) {
            this.#bootstrapModal.show();
        }
    };

    #modalButtonClicked(which) {
        if (this.#response && typeof this.#response === 'function') {
            this.#response(this.#caller, which);
        }
    }
    setModal(caller, title, message, type, callback, messageClass, reset) {
        this.#caller = caller;
        this.#response = callback;
        if (!this.#modalEl || reset) {
            let titleId = 'title-' + this.modalid;
            let btnId = 'btnModalMessage-' + this.modalid;
            let messageId = 'message-' + this.modalid;

            let footerId = 'footer-' + this.modalid;

            let modal = FormBuilderHelper.createElement('div', this.modalid, {
                class: 'modal fade',
                role: 'dialog', 'data-bs-backdrop': 'static', 'data-backdrop': 'static', 'data-bs-keyboard': false, 'data-keyboard': false, tabindex: '-1',
                'aria-labelledby': titleId, 'aria-hidden': true
            });
            let modalDialog = FormBuilderHelper.createElement('div', 'noid', { class: 'modal-dialog' });
            let modalContent = FormBuilderHelper.createElement('div', 'noid', { class: 'modal-content' });
            let modalHeader = FormBuilderHelper.createElement('div', 'noid', { class: 'modal-header' });
            let moldalTitle = FormBuilderHelper.createElement('h5', titleId, { class: 'modal-title' });
            let moldalClose = FormBuilderHelper.createElement('button', btnId, { class: 'btn-close', type: 'button', 'data-bs-dismiss': 'modal', 'aria-label': 'Close' });
            modalHeader.appendChild(moldalTitle);
            modalHeader.appendChild(moldalClose);
            this.#titleEl = moldalTitle;

            let moldalBody = FormBuilderHelper.createElement('div', 'noid', { class: 'modal-body' });
            let moldalMessage = FormBuilderHelper.createElement('p', messageId, { class: 'text-success' });
            moldalBody.appendChild(moldalMessage);
            this.#messageEl = moldalMessage;

            this.#footerEl = FormBuilderHelper.createElement('div', footerId, { class: 'modal-footer' });
            modalContent.appendChild(modalHeader);
            modalContent.appendChild(moldalBody);
            modalContent.appendChild(this.#footerEl);

            modalDialog.appendChild(modalContent);
            modal.appendChild(modalDialog);
            this.#modalEl = modal;
            this.#bootstrapModal = new bootstrap.Modal(this.#modalEl, {});
        }
        this.#titleEl.innerHTML = title;
        this.#messageEl.innerHTML = message;
        this.#footerEl.innerHTML = '';

        if (messageClass && FormBuilderHelper.isString(messageClass)) {
            messageEl.class = messageClass;
        }
        if (type === FormBuilderModal.YesNo || type === FormBuilderModal.OkCancel) {
            let moldalFooterYes = FormBuilderHelper.createElement('button', 'footer-btn-yes' + this.modalid, { class: 'btn btn-primary', type: 'button', 'data-bs-dismiss': 'modal' });
            moldalFooterYes.textContent = type === FormBuilderModal.YesNo ? 'Yes' : 'Ok';
            moldalFooterYes.addEventListener('click', (e) => {
                this.#modalButtonClicked('yes');
            })
            this.#footerEl.appendChild(moldalFooterYes);
            let moldalFooterNo = FormBuilderHelper.createElement('button', 'footer-btn-no' + this.modalid, { class: 'btn btn-primary', type: 'button', 'data-bs-dismiss': 'modal' });
            moldalFooterNo.textContent = type === FormBuilderModal.YesNo ? 'No' : 'Cancel';;
            moldalFooterNo.addEventListener('click', (e) => {
                this.#modalButtonClicked('no');
            })
            this.#footerEl.appendChild(moldalFooterNo);
        } else {
            let moldalFooterClose = FormBuilderHelper.createElement('button', 'footer-btn-close' + this.modalid, { class: 'btn btn-primary', type: 'button', 'data-bs-dismiss': 'modal' });
            moldalFooterClose.textContent = type === FormBuilderModal.Ok ? 'Ok' : 'Close';
            moldalFooterClose.addEventListener('click', (e) => {
                this.#modalButtonClicked(type === FormBuilderModal.Ok ? 'Ok' : 'Close');
            })
            this.#footerEl.appendChild(moldalFooterClose);
        }
        //return this.modalEl;
    }
}

class FormBuilderHelper {
    constructor() { }

    static isObjcetButNotArray(obj) {
        if (
            typeof obj === 'object' &&
            !Array.isArray(obj) &&
            obj !== null
        ) {
            return true
        }
        return false;
    }

    static isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    static jsonToObject(json) {
        try {
            return JSON.parse(json);
        } catch {
            return null;
        }
    }

    static isArray(obj) {
        if (
            typeof obj === 'object' &&
            Array.isArray(obj) &&
            obj !== null
        ) {
            return true
        }
        return false;
    }

    static isNullOrUndefined(obj) {
        return typeof (obj) === "undefined" || obj === null;
    }

    static isString(obj) {
        return typeof obj === 'string' || obj instanceof String;
    }

    static getElement(elementid) {
        let ret;
        if (FormBuilderHelper.isString(elementid)) {//check by id
            ret = document.getElementById(elementid);
        }
        return ret;
    }

    static isElement(obj) {
        let ret = !FormBuilderHelper.isNullOrUndefined(obj) && obj instanceof Element;
        if (!ret && FormBuilderHelper.isString(obj)) {//check by id
            ret = FormBuilderHelper.isNullOrUndefined(document.getElementById(obj));
        }
        return ret;
    }

    static isHTMLElement(obj) {
        let ret = !FormBuilderHelper.isNullOrUndefined(obj) && obj instanceof HTMLElement;
        if (!ret && FormBuilderHelper.isString(obj)) {//check by id
            ret = FormBuilderHelper.isNullOrUndefined(document.getElementById(obj));
        }
        return ret;
    }

    static createElement(tag, id, attributes) {
        let element = document.createElement(tag);
        if (id && id !== 'noid') {
            element.id = id;
            element.name = id;
        }

        if (FormBuilderHelper.isObjcetButNotArray(attributes)) {
            for (let [key, value] of Object.entries(attributes)) {
                element.setAttribute(key, value);
            }
        }
        return element;
    }

    static isNode(obj) {
        let ret = obj instanceof Node;
        if (!ret && FormBuilderHelper.isString(obj)) {//check by id
            ret = FormBuilderHelper.isNullOrUndefined(document.getElementById(obj));
        }
        return ret;
    }

    static isNullOrEmpty(value) {
        return (!value || value === undefined || value === '' || value.length === 0);
    };

    static throwError(key) {
        throw new Error(FormBuilderHelper.#errorDictionary[key]);
    }

    static populateOptionsFormJson(targetElement, json) {
        if (FormBuilderHelper.isHTMLElement(targetElement)) {
            let options = FormBuilderHelper.jsonToObject(json);
            if (options) {
                for (let [text, value] of Object.entries(options)) {
                    var opt = document.createElement('option');
                    opt.value = value;
                    opt.innerHTML = text;
                    targetElement.appendChild(opt);
                }
            }
        }
    }

    static populateOptions(targetElement, options) {
        if (FormBuilderHelper.isHTMLElement(targetElement) && options) {
            for (let [text, value] of Object.entries(options)) {
                var opt = document.createElement('option');
                opt.value = value;
                opt.innerHTML = text;
                targetElement.appendChild(opt);
            }
        }
    }
    static removeClassByPrefix(el, prefix) {
        let regx = new RegExp('\\b' + prefix + '.*?\\b', 'g');
        el.className = el.className.replace(regx, '');
        return el;
    };

    static removeClasses(el, cls) {
        if (el) {
            for (let c of cls.split(' ')) {
                if (el.classList.contains(c)) {
                    el.classList.remove(c);
                }
            }
        }
    };

    static replaceClass(el, clsToReplace, replaceBy) {
        if (el) {
            me.removeClasses(el, clsToReplace);
            me.addClasses(el, replaceBy);
        }
    };

    static addClasses(el, cls) {
        if (el) {
            for (let c of cls.split(' ')) {
                if (!el.classList.contains(c)) {
                    el.classList.add(c);
                }
            }
        }
    };

    static dataTransferGetData(e) {
        try {
            return JSON.parse(e.dataTransfer.getData("text"))
        } catch {
            return {};
        }
    }

    static dataTransferSetData(e, datafor, datatoset) {
        let data = JSON.stringify({ for: datafor, data: datatoset, x: e.x || e.pageX, y: e.y || e.pageY });
        e.dataTransfer.clearData();
        e.dataTransfer.setData("text", data);
    }

    static dataTransferGetPosition(e) {
        return { x: e.pageX, y: pageY };
    }

    static modalWindow = new FormBuilderModal('modalWindow');

    static #errorDictionary = {
        //builder
        "builder.invalidbuilderel": "Placeholder element does not exist.",
        "builder.missingplaceholder": "Please enter placeholder id.",
        "builder.missinginstance": "Missing or invalid FormBuilder instance.",
        //form
        "form.missingformname": "Missing Form Name",
        "form.missingcontainer": "Missing Container",
        "form.missingforminstance": "Missing Form Instance",
        "form.missingformholder": "Missing or invalid form holder",
        "form.missinglistener": "Missing listener from caller",
        //components
        "component.missingproperties": "Missing component properties",
        "component.invalidtype": "Invalid component type",
        "component.missingname": "Missing Component Name",
        "component.missingtype": "Missing Component Type",
        "component.missinglabel": "Missing Component Label",
        "component.invalidattributes": "Invalid Component attributes",
        "component.invalidstyles": "Invalid Component style",
        "component.invalideventlisteners": "Invalid Component attributes",
        "component.invalidproperties": "Invalid Component properties",

    };

    static #formDictionary = {
        //builder

        //components
        "component.label": "New Label For",
        "component.defaultclass": "mb-0 col-md-6 fb-form-component"
    };

    static getComponentPropVal(key) {
        return FormBuilderHelper.#formDictionary[`component.${key}`];
    };
    static getFormPropVal(key) {
        return FormBuilderHelper.#formDictionary[`form.${key}`];
    };
    static getBuilderPropVal(key) {
        return FormBuilderHelper.#formDictionary[`builder.${key}`];
    };
}

class ObservableClass {
    #observer;
    #observingMethod;
    constructor() {
        if (this.constructor == ObservableClass) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    setObserver(observer, observingMethod) {
        this.#observer = observer;
        this.#observingMethod = observingMethod;
    }

    get hasObserver() {
        return this.#observer && this.#observingMethod && typeof this.#observingMethod === 'function';
    }
    signalObserver(event, args) {
        if (this.#observer && this.#observingMethod && typeof this.#observingMethod === 'function') {
            this.#observingMethod(this.#observer, event, args);
        } else {
            throw new Error("Observer has not been set properly");
        }
    }
}


//form colpuments

class FormBuilderFormComponent extends ObservableClass {

    //public members
    fbComponent;
    elementControl;
    labelControl;
    metaData = {};
    container;

    constructor(formName, container, metaData, observer, observingMethod, build) {

        if (FormBuilderHelper.isNullOrEmpty(formName)) {
            return FormBuilderHelper.throwError('form.missingformname');
        }

        if (!FormBuilderHelper.isHTMLElement(container)) {
            return FormBuilderHelper.throwError('form.missingcontainer');
        }
        super();
        this.container = container;
        this.metaData = metaData || {};
        if (FormBuilderHelper.isJson(this.metaData)) {
            this.metaData = this.metaData.parse(this.metaData);
        }
        if (FormBuilderHelper.isNullOrUndefined(this.metaData)) {
            return FormBuilderHelper.throwError('form.missingproperties');
        }

        if (!FormBuilderHelper.isElement(this.metaData.type)) {
            return FormBuilderHelper.throwError('component.missingtype');
        }

        if (!FormBuilderHelper.isElement(this.metaData.name)) {
            return FormBuilderHelper.throwError('component.missingname');
        }
        //observer
        if (!FormBuilderHelper.isElement(this.metaData.name)) {
            return FormBuilderHelper.throwError('component.missingname');
        }
        this.setObserver(observer, observingMethod);
        if (build) {
            this.build();
        }
    }

    #triggerChange(event, args) {
        if (this.hasObserver) {
            this.signalObserver(event, args)
        } else {
            console.log('missing observer');
        }
    }

    get label() {
        return this.metaData.label || '';
    }

    set label(value) {
        this.metaData.label = value;
        if (this.labelControl) {
            this.labelControl.textContent = value;
        }
    }

    get value() {
        if (this.elementControl) {
            return this.elementControl.value;
        } else {
            return '';
        }
    }

    set value(value) {
        if (this.elementControl) {
            this.elementControl.value = value;
        }
    }

    get placeholder() {
        this.metaData.placeholder || '';
    }

    set placeholder(value) {
        this.metaData.placeholder = value;
        if (this.elementControl) {
            this.elementControl.setAttribute('placeholder', value);
        }
    }

    get styles() {
        return this.metaData.styles || {};
    }

    setStyle(key, value) {
        if (this.metaData.styles === undefined) {
            this.metaData.styles = {};
        }
        this.metaData.styles[key] = value;
        if (this.elementControl) {
            this.elementControl.setAttribute('style', FormBuilderFormComponent.#joinStyles(this.styles));
        }
    }

    getStyle(key) {
        let val = '';
        if (this.styles[key] !== undefined) {
            val = this.styles[key];
        }
    }

    get properties() {
        return this.metaData.properties || {};
    }

    setProperty(key, value) {
        if (this.metaData.properties === undefined) {
            this.metaData.properties = {};
        }
        this.metaData.properties[key] = value;

    }

    getProperty(key) {
        let val = '';
        if (this.properties[key] !== undefined) {
            val = this.propertiess[key];
        }
    }


    get attributes() {
        return this.metaData.attributes || {};
    }

    setAttribute(key, value) {
        if (this.metaData.attributes === undefined) {
            this.metaData.attributes = {};
        }
        this.metaData.attributes[key] = value;
        if (this.elementControl) {
            this.elementControl.setAttribute(key, value);
        }
    }


    getAttribute(key) {
        let val = '';
        if (this.attributes[key] !== undefined) {
            val = this.attributes[key];
        }
        return val;
    }

    get type() {
        return this.metaData.type || null;
    }

    get name() {
        return this.metaData.name || null;
    }

    set name(value) {
        this.metaData.name = value;
        if (this.elementControl) {
            this.elementControl.name = value;
            this.elementControl.id = value;
        }
        if (this.labelControl) {
            this.label.for = value;
        }
    }

    get eventlisteners() {
        return this.metaData.eventlisteners || {};
    };

    static getType(type) {
        switch (type) {
            case 'textfield':
                return 'text';
            default:
                return FormBuilderHelper.throwError('component.invalidtype');
        }
    }

    static getControlType(type) {
        switch (type) {
            case 'textfield':
                return 'input';
            default:
                return FormBuilderHelper.throwError('component.invalidtype');
        }
    }

    setComponentProperty(type, name, val) {
        switch (name) {
            case 'name':
                this.name = val;
                break;
            case 'label':
                this.label = val;
                break;
            default:
                switch (type) {
                    case 'attribute':
                    case 'attr':
                        this.setAttribute(name, val);
                        break;
                    case 'style':
                        this.setStyle(name, val);
                        break;
                    case 'prop':
                    case 'property':
                        this.setProperty(name, val);
                        break;
                    default:
                        this[name] = val;
                        break;
                }
                break;
        }
    }


    getComponentProperty(type, name) {
        let val = '';
        switch (type) {
            case 'attribute':
            case 'attr':
                val = this.getAttribute(name);
                break;
            case 'style':
                val = this.getStyle(name);
                break;
            case 'prop':
            case 'property':
                this.getProperty(name);
                break;
            default:
                val = this[name];
                break;
        }
        return val;
    }

    static #getNewLabel(compid) {
        return `${FormBuilderHelper.getComponentPropVal('label')} ${compid}`;
    }

    static #joinStyles(styles) {
        let style = '';
        if (FormBuilderHelper.isObjcetButNotArray(styles)) {
            for (let [key, val] of Object.entries(styles)) {
                style = `${style}${key}:${val};`;
            }
        }
        return style;
    }
    build() {
        let compId = this.name;
        let topCls = 'm-2 col-md-6 fb-form-component';
        let divId = `comp-${compId}`;

        this.fbComponent = FormBuilderHelper.createElement('div', divId, { class: topCls, tabindex: -1, draggable: true, ref: compId });
        // Label field
        let lblProps = {
            for: compId,
            class: 'form-label fb-form-label'
        }

        this.labelControl = FormBuilderHelper.createElement('label', 'noid', lblProps);

        if (FormBuilderHelper.isNullOrEmpty(this.label)) {
            this.label = FormBuilderFormComponent.#getNewLabel(this.name);
        }

        this.labelControl.textContent = this.label;

        //set class
        //default class
        let cls = 'form-control fb-form-control'
        //default attributes
        let compProps = {
            type: FormBuilderFormComponent.getType(this.type),
            placeholder: this.placeholder || ''
        }
        //set attribute
        for (let [key, attr] of Object.entries(this.attributes)) {
            switch (key.toLowerCase()) {
                case 'class':
                    cls = `${cls} ${attr}`;
                    break;
                default:
                    compProps[key] = attr;
                    break;
            }
        }
        compProps['class'] = cls;

        //set style
        let style = FormBuilderFormComponent.#joinStyles(this.styles);
        compProps['style'] = style;

        let controlId = `${this.formName}[${compId}]`;
        this.elementControl = FormBuilderHelper.createElement(FormBuilderFormComponent.getControlType(this.type), controlId, compProps);

        for (let [event, fn] of Object.entries(this.eventlisteners)) {
            this.elementControl.addEventListener(event, fn())
        }

        this.fbComponent.appendChild(this.labelControl);

        this.fbComponent.appendChild(this.elementControl);

        this.fbComponent.addEventListener('focus', () => {
            this.#triggerChange('currentComponentChanged', this);
        })

        this.elementControl.addEventListener('focus', () => {
            this.#triggerChange('currentComponentChanged', this);
        })

        this.fbComponent.addEventListener('mouseover', () => {
            document.body.style.cursor = 'all-scroll';
        })

        this.fbComponent.addEventListener('mouseout', () => {
            document.body.style.cursor = 'auto';
        })
        this.fbComponent.addEventListener('dragstart', (e) => {
            FormBuilderHelper.dataTransferSetData(e, 'move', divId);
        })
        this.fbComponent.addEventListener('drop', (e) => {
            e.preventDefault();
            let data = FormBuilderHelper.dataTransferGetData(e);
            if (data && data.for && data.data && data.for === 'move' && data.data !== e.target.id) {
                let up = (data.y - e.y || pageY) > 0;
                let draggedComponent = document.getElementById(data.data);

                if (this.container.hasChildNodes()) {
                    this.container.removeChild(draggedComponent);
                }

                if (up) {//find the top component
                    this.container.insertBefore(draggedComponent, this.fbComponent);
                } else {//find the below component
                    let nextComponent = this.fbComponent.nextSibling;
                    if (nextComponent) {
                        this.container.insertBefore(draggedComponent, nextComponent);
                    } else {
                        this.container.appendChild(draggedComponent);
                    }
                }
            }
        })
        this.container.appendChild(this.fbComponent);
        return this.fbComponent;
    }
}

//form

class FormBuilderForm extends ObservableClass {

    //public members

    #metaData;
    #compContainer;
    currentComponent;


    constructor(compContainer, metaData, observer, observingMethod) {

        if (FormBuilderHelper.isNullOrUndefined(compContainer) || !FormBuilderHelper.isHTMLElement(compContainer)) {
            return FormBuilderHelper.throwError('builder.missingplaceholder');
        }

        super();

        this.#metaData = metaData || {};
        if (FormBuilderHelper.isJson(this.#metaData)) {
            this.#metaData = this.json.parse(this.#metaData);
        }
        if (FormBuilderHelper.isNullOrEmpty(this.#metaData.formName)) {
            return FormBuilderHelper.throwError('component.missingname');
        }

        this.components = {};
        for (let [name, comp] of Object.entries(this.#metaData['components'] || {})) {
            this.components[name] = new FormBuilderFormComponent(this.name, compContainer, comp, this, this.#observingMethod, true)
        }
        this.#compContainer = compContainer;
        this.setObserver(observer, observingMethod);
    }

    get name() {
        return this.#metaData.formName;
    }

    get metaData() {
        return this.#metaData;
    }

    #observingMethod(observer, event, args) {
        //here this means callee
        if (observer.constructor === FormBuilderForm) {
            switch (event) {
                case 'currentComponentChanged':
                    observer.currentComponent = args;
                    break;
                default:
                    break;
            }
            if (observer.hasObserver) {
                observer.signalObserver(event, args);
            }
        }
    }
    generateName(type) {
        let names = this.componentNames;
        let l = type.length;
        let curIdx = (names.map((v) => {
            let idx = 0;
            if (v.length > l) {
                idx = v.slice(l).trimStart();
                if (isNaN(idx))
                    idx = 0;
            }
            return idx;
        }));
        if (curIdx && curIdx.length > 0)
            return `${type}${Math.max.apply(Math, curIdx) + 1}`;
        else
            return `${type}1`;
    }

    get componentNames() {
        return Object.keys(this.components);
    }


    removeComponent(component) {
        if (component && component.fbComponent) {
            if (this.#compContainer.hasChildNodes()) {
                let compToSelect;
                let next = component.fbComponent.nextSibling;
                if (!next) {
                    next = component.fbComponent.previousSibling;
                }
                if (next) {
                    compToSelect = next.getAttribute('ref');
                }
                this.#compContainer.removeChild(component.fbComponent);
                if (this.components.hasOwnProperty(component.name)) {
                    delete this.components[component.name];
                }
                if (compToSelect && this.components.hasOwnProperty(compToSelect)) {
                    this.components[compToSelect].fbComponent.focus();
                }
            }
        }
    }

    addComponent(type) {
        if (FormBuilderHelper.isNullOrEmpty(type)) {
            return FormBuilderHelper.throwError('component.missingtype');
        }
        let component = {};
        component.name = this.generateName(type);
        component.type = type;
        let newComponent = new FormBuilderFormComponent(this.name, this.#compContainer, component, this, this.#observingMethod, true);
        this.components[component.name] = newComponent;
        this.currentComponent = newComponent;
        return newComponent;
    }
}

//builder
class FormBuilder {

    #builderHolder;
    #formName;
    #componentsContainer;
    #theForm;
    #buildertTabPanes = {};
    #editBar;
    #currentComponent;
    #formMetaData = {}
    #editorPropElements = [];

    /**
     * Class constructor of FormBuilder.
     * 
     * @param {string} placeholder place holder for form builder
     * @param {string} formname form name
     * @param {string} formMetaData form metadata
     */
    constructor(placeholder, formname, formMetaData = null) {
        if (FormBuilderHelper.isNullOrEmpty(placeholder)) {
            FormBuilderHelper.throwError('builder.missingplaceholder');
        } else {
            this.#formName = formname ?? 'sample';

            this.#builderHolder = document.getElementById(placeholder);

            this.#formMetaData = formMetaData || {};

            if (FormBuilderHelper.isJson(this.#formMetaData)) {
                this.#formMetaData = this.json.parse(this.#formMetaData);
            }

            if (FormBuilderHelper.isNullOrEmpty(this.#formMetaData.formName)) {
                this.#formMetaData['formName'] = formname;
            }
        }
    }

    static #clsSelected = 'fb-selected-comp';

    static #fbMainId = 'fb-main';

    static #fbPanelId = 'fb-panel';

    static #floudsBuilderlId = 'flouds-builder';

    static #fbSidebarComponentsId = 'sidebar-comps';

    static #fbAreaId = 'design-area';

    static #fbPropertyBarId = 'propertybar';

    static #idEditbar = 'editbar';

    static #fbContainerId = 'design-container';

    static #fbFormContainerId = 'form-container';

    static #fbJsonContainer = 'json-container';

    static #idSidebar = 'sidebar';

    static #idArea = 'area';

    static #fbAreaCls = 'fb-design-area';

    static #fbFormCls = 'fb-design-form';

    static #compDeleteBtn = FormBuilderHelper.createElement('button', 'fb-delete-comp-btn', { class: 'btn-close fb-delete-comp-btn' });


    get #builderPane() {
        return this.#buildertTabPanes[FormBuilder.#fbContainerId];
    }

    get #formPane() {
        return this.#buildertTabPanes[FormBuilder.#fbFormContainerId];
    }

    get #jsonPane() {
        return this.#buildertTabPanes[FormBuilder.#fbJsonContainer];
    }

    buildBuilder() {
        if (this.#builderHolder) {
            this.#createBed();
        } else {
            FormBuilderHelper.throwError('builder.invalidbuilderel');
        }
    }

    #createBed() {
        //clear the placeholder
        this.#builderHolder.innerHTML = '';

        //create main div
        let buildermain = this.#createElement('div', FormBuilder.#fbMainId);

        //creat tabobjects
        let tabs = {};
        tabs[FormBuilder.#fbContainerId] = 'Builder';
        tabs[FormBuilder.#fbFormContainerId] = 'Form';
        tabs[FormBuilder.#fbJsonContainer] = 'Json';

        //add tabs
        this.#buildertTabPanes = this.#addTabPanel(buildermain, FormBuilder.#fbPanelId, tabs, FormBuilder.#fbContainerId);

        //main builder
        let builder = this.#createElement('div', FormBuilder.#floudsBuilderlId, { class: `flouds builder row formbuilder` });

        //formcomponents
        let componentBar = this.#createElement('div', FormBuilder.#fbSidebarComponentsId, { class: `col-xs-3 col-sm-3 col-md-2 formcomponents` });

        //form area
        let formarea = this.#createElement('div', FormBuilder.#fbAreaId, { class: `col-xs-6 col-sm-6 col-md-8 formarea`, ref: FormBuilder.#floudsBuilderlId });

        //property bar
        let propertyBar = this.#createElement('div', FormBuilder.#fbPropertyBarId, { class: `col-xs-3 col-sm-3 col-md-2 editbar`, ref: FormBuilder.#floudsBuilderlId });

        builder.appendChild(componentBar);

        builder.appendChild(formarea);

        builder.appendChild(propertyBar);

        this.#builderPane.appendChild(builder);

        //add form
        let form = this.#createElement('form', this.#formName);

        //append form to form pane
        this.#formPane.appendChild(form);

        //add side bar

        let sidebar = this.#getSideBar(FormBuilder.#idSidebar, FormBuilder.#fbSidebarComponentsId, 'tablist');

        componentBar.appendChild(sidebar);

        let area = this.#getBuildArea(FormBuilder.#idArea, FormBuilder.#fbAreaId);

        formarea.appendChild(area);

        //add edit bar

        this.#editBar = this.#getEditBar(FormBuilder.#idEditbar, FormBuilder.#fbPropertyBarId, 'tablist');

        propertyBar.appendChild(this.#editBar);

        //append the main to placeholder
        this.#builderHolder.appendChild(buildermain);

        this.#finalizeBuilder();
    }

    #finalizeBuilder() {
        if (this.#builderPane) {
            console.log('Valid container');
            //add the form
            this.#theForm = new FormBuilderForm(this.#componentsContainer, this.#formMetaData, this, this.#observingMethod);
            //set delete function
            FormBuilder.#compDeleteBtn.addEventListener('click', (e) => {
                FormBuilderHelper.modalWindow.setModal(this, "Delete Component", "Do you want to delete this component?", FormBuilderModal.YesNo, function (source, which) {
                    if (which === 'yes') {
                        if (source) {
                            source.#theForm.removeComponent();
                            source.#theForm.removeComponent( source.#currentComponent);
                        }
                    }
                }, null, true);
                FormBuilderHelper.modalWindow.show();
            })
        } else {
            console.log('Invalid container');
        }
    }

    #setDeleteButton(component, set) {
        if (component) {
            let firstChild = component.fbComponent.firstChild;
            if (set) {
                FormBuilderHelper.addClasses(component.fbComponent, FormBuilder.#clsSelected);
                if (FormBuilderHelper.isNullOrUndefined(firstChild)) {
                    component.fbComponent.appendChild(FormBuilder.#compDeleteBtn);
                }
                else if (firstChild !== FormBuilder.#compDeleteBtn) {
                    component.fbComponent.insertBefore(FormBuilder.#compDeleteBtn, firstChild);
                }
            } else {
                FormBuilderHelper.removeClasses(component.fbComponent, FormBuilder.#clsSelected);
                if (firstChild === FormBuilder.#compDeleteBtn) {
                    component.fbComponent.removeChild(FormBuilder.#compDeleteBtn);
                }
            }
        }
    }

    #setCurrentComponent(component) {
        if (this.#currentComponent !== component) {
            //reset
            this.#setDeleteButton(this.#currentComponent, false);
            this.#currentComponent = component;
            this.#setDeleteButton(this.#currentComponent, true);
        }
        this.#refreshEditBar();
    }

    #observingMethod(observer, event, args) {
        //here this means callee
        if (observer.constructor === FormBuilder) {
            switch (event) {
                case 'currentComponentChanged':
                    observer.#setCurrentComponent(args);
                    break;
                default:
                    break;
            }
        }
    }

    #createElement(tag, id, attributes) {
        return FormBuilderHelper.createElement(tag, id, attributes);
    }

    #createSidebarButton(type, group, text, iconcls, ref) {
        let attrs = {};
        attrs['tabindex'] = '0'
        attrs['class'] = `btn btn-outline-primary btn-sm formcomponent m-0`;
        attrs['data-type'] = type;
        attrs['data-group'] = group;
        attrs['data-key'] = type;
        attrs['comp-type'] = type;
        attrs['draggable'] = true;

        if (FormBuilderHelper.isString(ref)) {
            attrs['ref'] = `${ref}-component`;
        }
        let element = this.#createElement('span', 'noid', attrs);
        let icon = this.#createElement('i', 'noid', { class: iconcls, style: `margin-right: 5px;` });
        icon.textContent =` ${text} `;
        element.appendChild(icon);
        element.ondragstart = (e) => {
            let compType = e.target.attributes['comp-type'].value;
            console.log(compType);
            FormBuilderHelper.dataTransferSetData(e, 'add-comp', compType);
        };
        element.onclick = (e) => {
            let btn = e.currentTarget;
            if (btn) {
                this.#setCurrentComponent(this.#theForm.addComponent(btn.attributes['comp-type'].value));
                //this.#currentComponent = this.#theForm.addComponent(btn.attributes['comp-type'].value);
            }
        };
        return element;
    }

    #addTabPanel(parentEl, panelid, tabs, defaultselected) {
        let tabPanes = {}
        if (FormBuilderHelper.isElement(parentEl)) {
            if (FormBuilderHelper.isString(parentEl)) {
                parentEl = FormBuilderHelper.getElement(parentEl);
            }
            //navigation
            let nav = this.#createElement('ul', panelid + '-tab', { class: `nav nav-tabs`, role: `tablist` });

            //content
            let content = this.#createElement('div', panelid + '-content', { class: `tab-content` });

            //create tabs
            if (FormBuilderHelper.isObjcetButNotArray(tabs)) {
                for (let [key, value] of Object.entries(tabs)) {
                    let linkclass = `nav-link`;
                    let paneclass = `tabpane fade`;
                    if (key === defaultselected) {
                        linkclass = linkclass + ' active';
                        paneclass = paneclass + ' active show'
                    }
                    //tab nav
                    let navlink = this.#createElement('li', key + '-li', { class: `nav-item`, role: `presentation` });
                    let link = this.#createElement('a', 'noid', { href: `#${key}`, class: linkclass, role: `tab`, 'data-bs-toggle': `tab`, });
                    link.innerHTML = value;
                    navlink.appendChild(link);
                    nav.appendChild(navlink);

                    //content
                    let panel = this.#createElement('div', key, { class: paneclass, role: `tabpanel` });
                    tabPanes[key] = panel;
                    content.appendChild(panel);
                }
            }

            //add to panel
            parentEl.appendChild(nav);
            parentEl.appendChild(content);
        }
        return tabPanes;
    }

    #getAccordionItem(accordianid, coreid, itemdesc, def, ref, items) {
        let itempanel = `${accordianid}-panel-${coreid}`;
        let itemheader = `${accordianid}-header-${coreid}`;
        let containerid = `${accordianid}-components-${coreid}`;
        let container = `${accordianid}-container-${coreid}`;
        let accordionItem = this.#createElement('div', itempanel, { class: `accordion-item` });
        let headerItem = this.#createElement('h2', itemheader, { class: `accordion-header` });
        let btnAttrs = {};
        let itemCls = 'accordion-collapse collapse';
        let btnCls = 'accordion-button';
        if (def) {
            itemCls = itemCls + ' show';
        } else {
            btnCls = btnCls + ' collapsed';
        }
        btnAttrs.class = btnCls;
        btnAttrs.Type = 'button';
        btnAttrs['aria-controls'] = container;
        btnAttrs['aria-expanded'] = def;
        btnAttrs['data-bs-target'] = `#${container}`;
        btnAttrs['data-bs-toggle'] = 'collapse';
        btnAttrs['data-bs-parent'] = accordianid;


        let headerbtn = this.#createElement('button', `header-button-${coreid}`, btnAttrs);
        headerbtn.textContent = itemdesc;
        headerItem.appendChild(headerbtn);

        //sidebar group
        let groupAttrs = {};
        groupAttrs['class'] = itemCls;
        groupAttrs['aria-labelledby'] = itemheader;

        if (FormBuilderHelper.isString(ref)) {
            groupAttrs['ref'] = `${ref}-group`;
        }

        let groupItem = this.#createElement('div', container, groupAttrs);

        //sidebar container
        //sidebar group
        let containerAttrs = {};
        containerAttrs['class'] = 'accordion-body d-grid gap-1 no-drop p-2 w-100';

        if (FormBuilderHelper.isString(ref)) {
            containerAttrs['ref'] = `${ref}-container`;
        }


        let groupBody = this.#createElement('div', containerid, containerAttrs);

        //create tabs
        if (FormBuilderHelper.isArray(items)) {
            for (let item of items) {
                if (FormBuilderHelper.isNode(item) || FormBuilderHelper.isString(item)) {
                    groupBody.appendChild(item);
                }
            }
        }

        groupItem.appendChild(groupBody);

        accordionItem.appendChild(headerItem);

        accordionItem.appendChild(groupItem);

        return accordionItem;
    }

    #getBuildArea(areaid, ref) {
        ref = ref ?? 'component';

        let topDiv = this.#createElement('div', areaid, { class: FormBuilder.#fbAreaCls, ref: ref });
        let webDiv = this.#createElement('div', 'noid', { novalidate: ``, class: FormBuilder.#fbFormCls, ref: areaid });
        //let dragConcainer = this.#createElement('div', 'noid', { class: `${FormBuilder.#builderComponents} ${FormBuilder.#dragOntoCls} builder-form`, ref: `webform-container` });
        let dcAttrs = {};

        //dcAttrs['class'] = `drag-and-drop-alert alert alert-info no-drag`;
        dcAttrs['style'] = `text-align:center;`;
        dcAttrs['data-noattach'] = true;
        dcAttrs['data-position'] = '0';

        this.#componentsContainer = webDiv;

        topDiv.appendChild(webDiv);


        //drag drop
        topDiv.ondragover = (e) => {
            e.preventDefault();
        };

        topDiv.ondrop = (e) => {
            e.preventDefault();
            let data = FormBuilderHelper.dataTransferGetData(e);
            if (data && data.for && data.data) {
                if (data.for === 'add-comp') {
                    this.#setCurrentComponent(this.#theForm.addComponent(data.data));
                }
            }
        };

        return topDiv;
    }

    #getSideBar(sidebarid, ref, role) {
        let sidebarAttrs = {};
        sidebarAttrs['class'] = 'accordion';
        if (FormBuilderHelper.isString(ref)) {
            sidebarAttrs['ref'] = ref;
        }
        if (FormBuilderHelper.isString(role)) {
            sidebarAttrs['role'] = role;
        }
        //sidebar
        var accordian = this.#createElement('div', sidebarid, sidebarAttrs);

        //create tabs
        if (FormBuilderHelper.isObjcetButNotArray(FormBuilder.#components)) {
            for (let [key, value] of Object.entries(FormBuilder.#components)) {
                let accItems = [];
                let compButtons = value['btns'];
                if (FormBuilderHelper.isArray(compButtons)) {
                    for (let item of compButtons) {
                        let compBtn = this.#createSidebarButton(item['type'], key, item['text'], item['iconCls'], ref);
                        accItems.push(compBtn);
                    }
                }
                accordian.appendChild(this.#getAccordionItem(sidebarid, key, value['text'], value['default'], ref, accItems));
            }
        }
        return accordian;
    }

    #createProperty(propObjects, callback) {
        let propId = `prop-${propObjects.mappedProp}`;
        let mappedType = propObjects['mappedType'];
        let mappedProp = propObjects['mappedProp'];
        let propPane = this.#createElement('div', 'noid', { class: 'editor-property-pane row' });
        let nameCol = this.#createElement('div', 'noid', { class: 'editor-property-row' });
        let valueCol = this.#createElement('div', 'noid', { class: 'editor-property-row' });
        let propName = this.#createElement('label', 'noid', { class: 'editor-property-label', for: propId });
        propName.textContent = propObjects.name;
        let editorEl;
        let length = 20;
        if (!FormBuilderHelper.isNullOrUndefined(propObjects['maxlength']) && Number.isInteger(propObjects['maxlength'])) {
            length = propObjects['maxlength'];
        }
        let cls = 'editor-property';
        let elAttributes = {};
        elAttributes.class = cls;
        switch (propObjects.type) {
            case 'textfield':
                elAttributes.class =  elAttributes.class + ' form-control'
                elAttributes['maxlength'] = length;
                editorEl = this.#createElement('input', propId, elAttributes);
                break;
            case 'select':
                elAttributes.class =  elAttributes.class + ' form-select'
                editorEl = this.#createElement('select', propId, elAttributes);
                FormBuilderHelper.populateOptions(editorEl, propObjects['options']);
                if (propObjects.default) {
                    editorEl.value = propObjects.default;
                }

                break;
            default:
                elAttributes['maxlength'] = length;
                editorEl = this.#createElement('input', propId, elAttributes);
                break;
        }

        let mappedCompProp = { mappedType: mappedType, mappedProp: mappedProp, mappedElement: editorEl };
        editorEl.onchange = (e) => {
            let prop = e.currentTarget;
            if (prop && callback) {
                callback(mappedCompProp);
            }
        };
        nameCol.appendChild(propName);
        valueCol.appendChild(editorEl);
        propPane.appendChild(nameCol);
        propPane.appendChild(valueCol);
        this.#editorPropElements.push(mappedCompProp);
        return propPane;
    }

    #getEditBar(editsidebarid, ref, role) {
        let attachedComponent;
        let editbarAttrs = {};
        editbarAttrs['class'] = 'accordion';
        if (FormBuilderHelper.isString(ref)) {
            editbarAttrs['ref'] = ref;
        }
        if (FormBuilderHelper.isString(role)) {
            editbarAttrs['role'] = role;
        }
        //sidebar
        let accordian = this.#createElement('div', editsidebarid, editbarAttrs);


        if (FormBuilderHelper.isObjcetButNotArray(FormBuilder.#properties)) {
            for (let [key, value] of Object.entries(FormBuilder.#properties)) {
                let propItems = [];
                let props = value['props'];
                if (FormBuilderHelper.isArray(props)) {
                    for (let item of props) {
                        let propItem = this.#createProperty(item, (mappedCompProp) => {
                            if (this.#currentComponent) {
                                let val = mappedCompProp['mappedElement'].value;
                                let type = mappedCompProp['mappedType'];
                                let prop = mappedCompProp['mappedProp'];
                                this.#currentComponent.setComponentProperty(type, prop, val);
                            }
                        });
                        propItems.push(propItem);
                    }
                }
                accordian.appendChild(this.#getAccordionItem(editsidebarid, key, value['text'], value['default'], ref, propItems));
            }
        }

        return accordian;
    }

    #refreshEditBar() {
        for (let mappedPorpEl of this.#editorPropElements) {
            let val = '';
            if (this.#currentComponent) {
                val = this.#currentComponent.getComponentProperty(mappedPorpEl['mappedType'], mappedPorpEl['mappedProp']);
            }
            mappedPorpEl['mappedElement'].value = val;
        }
    }

    static #components = {
        "basic": {
            text: "Basic",
            default: true,
            btns: [
                {
                    "default": true,
                    "type": "textfield",
                    "text": "Text Field",
                    "iconCls": "bi bi-terminal",
                },
                {
                    "type": "textarea",
                    "text": "Text Area",
                    "iconCls": "bi bi-type",
                }
            ]
        },
        "advanced": {
            text: "Advanced",
            default: false
        },
        "layout": {
            text: "Layout",
            default: false,
            btns: [
                {
                    "default": true,
                    "type": "columns",
                    "text": "Columns",
                    "iconCls": "bi bi-window",
                },
                {
                    "type": "table",
                    "text": "Table",
                    "iconCls": "bi bi-table",
                }
            ]
        }
    };

    static #properties = {
        "display": {
            text: "Display",
            default: true,
            props: [
                {
                    mappedType: "gen",
                    mappedProp: "name",
                    name: "Name",
                    type: "textfield",
                    maxlength: 50
                },
                {
                    mappedType: "gen",
                    mappedProp: "label",
                    name: "Description",
                    type: "textfield",
                    maxlength: 50
                },
                {
                    mappedType: "gen",
                    mappedProp: "type",
                    name: "Type",
                    type: "textfield"
                },
            ]
        },
        "data": {
            text: "Data Source",
            default: false,
            props: [
                {
                    mappedType: "attr",
                    mappedProp: "data-key",
                    name: "Binding",
                    type: "textfield",
                    maxlength: 30
                },
                {
                    mappedType: "attr",
                    mappedProp: "required",
                    name: "Required",
                    type: "select",
                    default: 'false',
                    options: {
                        True: 'true',
                        False: 'false'
                    }
                }
            ]
        },
        "attributes": {
            text: "HTML Attributes",
            default: false
        }
    };
}

let domReady = function (fn) {

    if (document.readyState !== 'loading') {
        console.log('document is already ready, just execute code here');
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('document was not ready, place code here');
            fn();
        });
    }
};