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
        let ret = obj instanceof Element;
        if (!ret && FormBuilderHelper.isString(obj)) {//check by id
            ret = FormBuilderHelper.isNullOrUndefined(document.getElementById(obj));
        }
        return ret;
    }

    static isHTMLElement(obj) {
        let ret = obj instanceof HTMLElement;
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

    static #errorDictionary = {
        //builder
        "builder.invalidbuilderel": "Placeholder element does not exist.",
        "builder.missingplaceholder": "Please enter placeholder id.",
        //form
        "form.missingformname": "Missing form name",
        "form.error.missingformholder": "Missing or invalid form holder",
        //components
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

/****form fields */
class FormBuilderFormComponent {

    //public members
    fbComponent;
    elementControl;
    labelControl;

    constructor(formname, json = null) {
        if (FormBuilderHelper.isNullOrEmpty(formname)) {
            return FormBuilderHelper.throwError('form.missingformname');
        }
        if (!FormBuilderHelper.isElement(json.type)) {
            return FormBuilderHelper.throwError('component.missingtype');
        }

        if (!FormBuilderHelper.isElement(json.name)) {
            return FormBuilderHelper.throwError('component.missingname');
        }

        this.formname = formname || 'fb-form';
        this.type = json.type || null;
        this.name = json.name || null;
        this.label = json.label || '';
        this.placeholder = json.placeholder || '';
        this.attributes = json.attributes || {};
        this.styles = json.styles || {};
        this.eventlisteners = json.evenlisteners || {};
        this.mandatory = json.mandatory || false;
        this.properties = json.properties || null;
        this.value = (typeof json.value !== 'undefined') ? json.value : null;
    }

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


    static #getNewLabel(compid) {
        return `${FormBuilderHelper.getComponentPropVal('label')} ${compid}`;
    }

    build() {
        let compId = this.name;
        this.fbComponent = FormBuilderHelper.createElement('div', `fb-comp-${compId}`, { class: FormBuilderHelper.getComponentPropVal('defaultclass') });
        // Label field
        let lblProps = {
            htmlFor: compId,
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
            }
        }
        compProps['class'] = cls;

        //set style
        let style = '';
        for (let [key, val] of Object.entries(this.styles)) {
            cls = `${style}${key}:${val};`;
        }
        if (!FormBuilderHelper.isNullOrEmpty(style)) {
            compProps['style'] = style;
        }

        let controlId = `${this.formname}[${compId}]`;
        this.elementControl = FormBuilderHelper.createElement(FormBuilderFormComponent.getControlType(this.type), controlId, compProps);

        for (let [event, fn] of Object.entries(this.eventlisteners)) {
            this.elementControl.addEventListener(event, fn())
        }
        this.fbComponent.appendChild(this.labelControl);
        this.fbComponent.appendChild(this.elementControl);
        return this.fbComponent;
    }
}

//form

class FormBuilderForm {

    //private members
    #formHolder;

    //public members
    currentComponent;


    constructor(name, formHolder, formObj) {
        if (FormBuilderHelper.isNullOrEmpty(name)) {
            return FormBuilderHelper.throwError('form.missingformname');
        }
        if (!FormBuilderHelper.isElement(formHolder)) {
            return FormBuilderHelper.throwError('form.missingformholder');
        }
        this.name = name;
        this.#formHolder = formHolder;
        if (FormBuilderHelper.isJson(formObj)) {
            formObj = JSON.parse(formObj);
        }
        this.formObj = formObj || {};
        this.components = {};
        for (let [name, comp] of Object.entries(this.formObj['components'] || {})) {
            this.components[name] = new FormBuilderFormComponent(this.name, comp)
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
        if(curIdx && curIdx.length > 0 )
            return `${type}${Math.max.apply(Math, curIdx) + 1}`;
        else
            return `${type}1`;
    }

    get componentNames() {
        return Object.keys(this.components);
    }

    componentExists(name) {
        return componentNames.includes(name);
    }

    addNewComponent(type) {
        if (FormBuilderHelper.isNullOrEmpty(type)) {
            return FormBuilderHelper.throwError('component.missingtype');
        }
        //generate component name

        let component = {};
        component.name = this.generateName(type);
        component.type = type;
        let newComponent = new FormBuilderFormComponent(this.name, component);
        this.components[component.name] = newComponent;

        //add to builder pane
        let control = newComponent.build();
        this.#formHolder.appendChild(control);
        this.currentComponent = newComponent;
        return newComponent;
    }

}
class FormBuilder {

    //private members
    #placeholder;
    #builderHolder;
    #formname;
    #buildserComponentsPane;
    #theForm;

    //public members
    formJson = {}

    #buildertTabPanes = {};

    /**
     * Class constructor.
     * 
     * @param {string} placeholder place holder for form builder
     */
    constructor(placeholder, formname, formJson = null) {
        if (placeholder) {
            this.#formname = formname ?? 'sample';
            this.#placeholder = placeholder;
            this.#builderHolder = document.getElementById(this.#placeholder);
            this.formJson = formJson || {};
        } else {
            FormBuilderHelper.throwError('builder.missingplaceholder');
        }
    }

    static #fbMainId = 'fb-main';

    static #fbPanelId = 'fb-panel';

    static #floudsBuilderlId = 'flouds-builder';

    static #fbSidebarComponentsId = 'fb-sidebar-components';

    static #fbAreaId = 'fb-area';

    static #fbPropertyBarId = 'fb-propertybar';

    static #idEditbar = 'fb-eiditbar';

    static #refEditbar = 'fb-propertybar';

    static #fbContainerId = 'fb-container';

    static #fbFormContainerId = 'fb-form-container';

    static #fbJsonContainer = 'fb-json-container';

    static #basicComponents = 'basic';

    static #advanceComponents = 'advance';

    static #refSidebar = 'fb-sidebar';

    static #refArea = 'fb-area';

    static #idSidebar = 'fb-sidebar';

    static #idArea = 'fb-area';

    //drag clases
    static #dragCopyCls = 'fb-drag-copy';

    static #dragOntoCls = 'fb-drag-onto';

    static #dragComponentRef = 'fb-drag-component';

    //builder classes
    static #fbComponentCls = 'fb-component';

    static #fbFormCls = 'fb-form';

    static #builderComponents = 'builder-components';

    static #builderComponent = 'builder-component';


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
        let formarea = this.#createElement('div', FormBuilder.#fbAreaId, { class: `col-xs-6 col-sm-6 col-md-8 formarea`, ref: `form` });

        //property bar
        let propertyBar = this.#createElement('div', FormBuilder.#fbPropertyBarId, { class: `col-xs-3 col-sm-3 col-md-2 editbar`, ref: `editbar` });

        builder.appendChild(componentBar);

        builder.appendChild(formarea);

        builder.appendChild(propertyBar);

        this.#builderPane.appendChild(builder);

        //add form
        let form = this.#createElement('form', this.#formname);

        //append form to form pane
        this.#formPane.appendChild(form);

        //add side bar

        let sidebar = this.#getSideBar(FormBuilder.#idSidebar, FormBuilder.#refSidebar, 'tablist');

        componentBar.appendChild(sidebar);

        let area = this.#getBuildArea(FormBuilder.#idArea, FormBuilder.#refArea);

        formarea.appendChild(area);

        //add edit bar

        let edit = this.#getEditBar(FormBuilder.#idEditbar, FormBuilder.#refEditbar, 'tablist');

        propertyBar.appendChild(edit);

        //append the main to placeholder
        this.#builderHolder.appendChild(buildermain);

        this.#finalizeBuilder();
    }

    #finalizeBuilder() {
        if (this.#builderPane) {
            console.log('Valid container');
            //add the form
            this.#theForm = new FormBuilderForm(this.#formname, this.#buildserComponentsPane, this.formJson);
        } else {
            console.log('Invalid container');
        }
    }

    #createElement(tag, id, attributes) {
        return FormBuilderHelper.createElement(tag, id, attributes);
    }

    #createSidebarButton(type, group, text, iconcls, ref) {
        let attrs = {};
        attrs['tabindex'] = '0'
        attrs['class'] = `btn btn-outline-primary btn-sm formcomponent ${FormBuilder.#dragCopyCls} m-0`;
        attrs['data-type'] = type;
        attrs['data-group'] = group;
        attrs['data-key'] = type;
        attrs['comp-type'] = type;
        if (FormBuilderHelper.isString(ref)) {
            attrs['ref'] = `${ref}-component`;
        }
        let element = this.#createElement('span', 'noid', attrs);
        let icon = this.#createElement('i', 'noid', { class: iconcls, style: `margin-right: 5px;` });
        icon.textContent = text;
        element.appendChild(icon);
        element.onclick = (e) => {
            let btn = e.currentTarget;
            if (btn) {
                let compoment = this.#theForm.addNewComponent(btn.attributes['comp-type'].value);
                //this.#buildserComponentsPane.appendChild(compoment.build());
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

    #getAccordionItem(sidebarid, coreid, itemdesc, def, ref, items) {
        let sidebarpanel = `${sidebarid}-panel-${coreid}`;
        let sidebarheader = `${sidebarid}-header-${coreid}`;
        let containerid = `${sidebarid}-components-${coreid}`;
        let container = `${sidebarid}-container-${coreid}`;
        let accordionItem = this.#createElement('div', sidebarpanel, { class: `accordion-item` });
        let headerItem = this.#createElement('h2', sidebarheader, { class: `accordion-header` });
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
        btnAttrs['data-bs-parent'] = sidebarid;


        let headerbtn = this.#createElement('button', `header-button-${coreid}`, btnAttrs);
        headerbtn.textContent = itemdesc;
        headerItem.appendChild(headerbtn);

        //sidebar group
        let groupAttrs = {};
        groupAttrs['class'] = itemCls;
        groupAttrs['aria-labelledby'] = sidebarheader;

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

    #getBuildArea(areaid, ref, role) {
        ref = ref ?? 'component';

        let topDiv = this.#createElement('div', areaid, { class: FormBuilder.#fbComponentCls, ref: ref });
        let webDiv = this.#createElement('div', 'noid', { novalidate: ``, class: FormBuilder.#fbFormCls, ref: `webform` });
        let dragConcainer = this.#createElement('div', 'noid', { class: `${FormBuilder.#builderComponents} ${FormBuilder.#dragOntoCls} fb-builder-form`, ref: `webform-container` });
        let dcAttrs = {};

        dcAttrs['class'] = `drag-and-drop-alert alert alert-info no-drag`;
        dcAttrs['style'] = `text-align:center;`;
        dcAttrs['data-noattach'] = true;
        dcAttrs['data-position'] = '0';
        dcAttrs['role'] = 'alert';

        let dragContainer = this.#createElement('div', 'noid', dcAttrs);
        dragContainer.innerHTML = 'Drag and Drop a form component';

        //append drag container
        dragConcainer.appendChild(dragContainer);

        this.#buildserComponentsPane = webDiv;

        //let dragComponent = this.#createElement('div', 'noid', dcAttrs);

        //append build div
        webDiv.appendChild(dragConcainer);

        //append drag container
        topDiv.appendChild(webDiv);

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

    #getEditBar(editsidebarid, ref, role) {
        let editbarAttrs = {};
        editbarAttrs['class'] = 'accordion';
        if (FormBuilderHelper.isString(ref)) {
            editbarAttrs['ref'] = ref;
        }
        if (FormBuilderHelper.isString(role)) {
            editbarAttrs['role'] = role;
        }
        //sidebar
        var accordian = this.#createElement('div', editsidebarid, editbarAttrs);

        //create tabs
        if (FormBuilderHelper.isObjcetButNotArray(FormBuilder.#attributes)) {
            for (let [key, value] of Object.entries(FormBuilder.#attributes)) {
                let accItems = [];
                /*TODO
                let compButtons = value['btns'];
                if (FormBuilderHelper.isArray(compButtons)) {
                    for (let item of compButtons) {
                        let compBtn = this.#createSidebarButton(item['type'], key, item['text'], item['iconCls'], ref);
                        accItems.push(compBtn);
                    }
                }
                */
                accordian.appendChild(this.#getAccordionItem(editsidebarid, key, value['text'], value['default'], ref, accItems));
            }
        }
        return accordian;
    }

    #domReady(fn) {
        if (document.readyState !== 'loading') {
            console.log('document is already ready in FormBuilder, just execute code here');
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('document was not ready FormBuilder, place code here');
                fn();
            });
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
        }
    };

    static #attributes = {
        "display": {
            text: "Display",
            default: true
        },
        "data": {
            display: "Data Source",
            default: false
        },
        "attributes": {
            display: "HTML Attributes",
            default: false
        }
    };

    // Do not leave a trailing comma on the last dictionary element. This can produce errors on external services
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