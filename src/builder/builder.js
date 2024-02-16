import CommonUtils from '../utils/common-utils.js';
import ErrorHandler from '../utils/error-handler.js';
import HtmlUtils from '../utils/html-utils.js';
import Modal from '../utils/modal.js';
import Form from '../components/form.js';

//builder
export default class Builder {

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
     * Class constructor of Builder.
     * 
     * @param {string} placeholder place holder for form builder
     * @param {string} formname form name
     * @param {string} formMetaData form metadata
     */
    constructor(placeholder, formname, formMetaData = null) {
        if (CommonUtils.isNullOrEmpty(placeholder)) {
            ErrorHandler.throwError(ErrorHandler.errorCode.Builder.MISSING_PLACEHOLDER);
        } else {
            this.#formName = formname ?? 'sample';

            this.#builderHolder = document.getElementById(placeholder);

            this.#formMetaData = formMetaData || {};

            if (CommonUtils.isJson(this.#formMetaData)) {
                this.#formMetaData = CommonUtils.jsonToObject(this.#formMetaData);
            }

            if (CommonUtils.isNullOrEmpty(this.#formMetaData.formName)) {
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

    static #compDeleteBtn = HtmlUtils.createElement('button', 'fb-delete-comp-btn', { class: 'btn-close fb-delete-comp-btn' });


    get #builderPane() {
        return this.#buildertTabPanes[Builder.#fbContainerId];
    }

    get #formPane() {
        return this.#buildertTabPanes[Builder.#fbFormContainerId];
    }

    get #jsonPane() {
        return this.#buildertTabPanes[Builder.#fbJsonContainer];
    }

    buildBuilder() {
        if (this.#builderHolder) {
            this.#createBed();
        } else {
            ErrorHandler.throwError('builder.invalidbuilderel');
        }
    }

    #createBed() {
        //clear the placeholder
        this.#builderHolder.innerHTML = '';

        //create main div
        let buildermain = this.#createElement('div', Builder.#fbMainId);

        //creat tabobjects
        let tabs = {};
        tabs[Builder.#fbContainerId] = 'Builder';
        tabs[Builder.#fbFormContainerId] = 'Form';
        tabs[Builder.#fbJsonContainer] = 'Json';

        //add tabs
        this.#buildertTabPanes = this.#addTabPanel(buildermain, Builder.#fbPanelId, tabs, Builder.#fbContainerId);

        //main builder
        let builder = this.#createElement('div', Builder.#floudsBuilderlId, { class: `flouds builder row Builder` });

        //formcomponents
        let componentBar = this.#createElement('div', Builder.#fbSidebarComponentsId, { class: `col-xs-3 col-sm-3 col-md-2 formcomponents` });

        //form area
        let formarea = this.#createElement('div', Builder.#fbAreaId, { class: `col-xs-6 col-sm-6 col-md-8 formarea`, ref: Builder.#floudsBuilderlId });

        //property bar
        let propertyBar = this.#createElement('div', Builder.#fbPropertyBarId, { class: `col-xs-3 col-sm-3 col-md-2 editbar`, ref: Builder.#floudsBuilderlId });

        builder.appendChild(componentBar);

        builder.appendChild(formarea);

        builder.appendChild(propertyBar);

        this.#builderPane.appendChild(builder);

        //add form
        let form = this.#createElement('form', this.#formName);

        //append form to form pane
        this.#formPane.appendChild(form);

        //add side bar

        let sidebar = this.#getSideBar(Builder.#idSidebar, Builder.#fbSidebarComponentsId, 'tablist');

        componentBar.appendChild(sidebar);

        let area = this.#getBuildArea(Builder.#idArea, Builder.#fbAreaId);

        formarea.appendChild(area);

        //add edit bar

        this.#editBar = this.#getEditBar(Builder.#idEditbar, Builder.#fbPropertyBarId, 'tablist');

        propertyBar.appendChild(this.#editBar);

        //append the main to placeholder
        this.#builderHolder.appendChild(buildermain);

        this.#finalizeBuilder();
    }

    #finalizeBuilder() {
        if (this.#builderPane) {
            console.log('Valid container');
            //add the form
            this.#theForm = new Form(this.#componentsContainer, this.#formMetaData, this, this.#observingMethod);
            //set delete function
            Builder.#compDeleteBtn.addEventListener('click', (e) => {
                Modal.commonModalWindow.setModal(this, "Delete Component", "Do you want to delete this component?", Modal.YesNo, function (source, which) {
                    if (which === 'yes') {
                        if (source) {
                            source.#theForm.removeComponent();
                            source.#theForm.removeComponent( source.#currentComponent);
                        }
                    }
                }, null, true);
                Modal.commonModalWindow.show();
            })
        } else {
            console.log('Invalid container');
        }
    }

    #setDeleteButton(component, set) {
        if (component) {
            let firstChild = component.fbComponent.firstChild;
            if (set) {
                HtmlUtils.addClasses(component.fbComponent, Builder.#clsSelected);
                if (CommonUtils.isNullOrUndefined(firstChild)) {
                    component.fbComponent.appendChild(Builder.#compDeleteBtn);
                }
                else if (firstChild !== Builder.#compDeleteBtn) {
                    component.fbComponent.insertBefore(Builder.#compDeleteBtn, firstChild);
                }
            } else {
                HtmlUtils.removeClasses(component.fbComponent, Builder.#clsSelected);
                if (firstChild === Builder.#compDeleteBtn) {
                    component.fbComponent.removeChild(Builder.#compDeleteBtn);
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
        if (observer.constructor === Builder) {
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
        return HtmlUtils.createElement(tag, id, attributes);
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

        if (CommonUtils.isString(ref)) {
            attrs['ref'] = `${ref}-component`;
        }
        let element = this.#createElement('span', 'noid', attrs);
        let icon = this.#createElement('i', 'noid', { class: iconcls, style: `margin-right: 5px;` });
        icon.textContent =` ${text} `;
        element.appendChild(icon);
        element.ondragstart = (e) => {
            let compType = e.target.attributes['comp-type'].value;
            console.log(compType);
            HtmlUtils.dataTransferSetData(e, 'add-comp', compType);
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
        if (HtmlUtils.isElement(parentEl)) {
            if (CommonUtils.isString(parentEl)) {
                parentEl = HtmlUtils.getElement(parentEl);
            }
            //navigation
            let nav = this.#createElement('ul', panelid + '-tab', { class: `nav nav-tabs`, role: `tablist` });

            //content
            let content = this.#createElement('div', panelid + '-content', { class: `tab-content` });

            //create tabs
            if (CommonUtils.isObjcetButNotArray(tabs)) {
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

        if (CommonUtils.isString(ref)) {
            groupAttrs['ref'] = `${ref}-group`;
        }

        let groupItem = this.#createElement('div', container, groupAttrs);

        //sidebar container
        //sidebar group
        let containerAttrs = {};
        containerAttrs['class'] = 'accordion-body d-grid gap-1 no-drop p-2 w-100';

        if (CommonUtils.isString(ref)) {
            containerAttrs['ref'] = `${ref}-container`;
        }


        let groupBody = this.#createElement('div', containerid, containerAttrs);

        //create tabs
        if (CommonUtils.isArray(items)) {
            for (let item of items) {
                if (HtmlUtils.isNode(item) || CommonUtils.isString(item)) {
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

        let topDiv = this.#createElement('div', areaid, { class: Builder.#fbAreaCls, ref: ref });
        let webDiv = this.#createElement('div', 'noid', { novalidate: ``, class: Builder.#fbFormCls, ref: areaid });
        //let dragConcainer = this.#createElement('div', 'noid', { class: `${Builder.#builderComponents} ${Builder.#dragOntoCls} builder-form`, ref: `webform-container` });
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
            let data = HtmlUtils.dataTransferGetData(e);
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
        if (CommonUtils.isString(ref)) {
            sidebarAttrs['ref'] = ref;
        }
        if (CommonUtils.isString(role)) {
            sidebarAttrs['role'] = role;
        }
        //sidebar
        var accordian = this.#createElement('div', sidebarid, sidebarAttrs);

        //create tabs
        if (CommonUtils.isObjcetButNotArray(Builder.#components)) {
            for (let [key, value] of Object.entries(Builder.#components)) {
                let accItems = [];
                let compButtons = value['btns'];
                if (CommonUtils.isArray(compButtons)) {
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
        if (!CommonUtils.isNullOrUndefined(propObjects['maxlength']) && Number.isInteger(propObjects['maxlength'])) {
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
                HtmlUtils.populateOptions(editorEl, propObjects['options']);
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
        if (CommonUtils.isString(ref)) {
            editbarAttrs['ref'] = ref;
        }
        if (CommonUtils.isString(role)) {
            editbarAttrs['role'] = role;
        }
        //sidebar
        let accordian = this.#createElement('div', editsidebarid, editbarAttrs);


        if (CommonUtils.isObjcetButNotArray(Builder.#properties)) {
            for (let [key, value] of Object.entries(Builder.#properties)) {
                let propItems = [];
                let props = value['props'];
                if (CommonUtils.isArray(props)) {
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