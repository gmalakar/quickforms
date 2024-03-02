import CommonUtils from '../utils/common-utils.js';
import HtmlUtils from '../utils/html-utils.js';
import Accordion from './accordion.js';
import ColumnsEditor from '../editors/columns-editor.js';
import NameValueEditor from '../editors/name-value-editor.js';
import TabControl from '../utils/tab-control.js';
import Modal from '../utils/modal.js';
import BootstrapUtils from '../utils/boostrap-utils.js';
export default class PropertiesBar {

    ref;
    #guid;
    controlId;
    tabControl;
    #tab;
    #formTabID;
    #compTabID;
    #compAcordID;
    #formAccordID;
    #tabPanes;
    #formcontainer;
    formPropElements = [];
    compPropElements = [];
    #selectedComponent;

    constructor(formcontainer, ref) {
        this.#formcontainer = formcontainer;
        this.ref = ref;
        this.#guid = CommonUtils.ShortGuid();
        this.controlId = `pbar-${this.#guid}`;
        this.#formTabID = `fprop-${this.#guid}`;
        this.#compTabID = `cprop-${this.#guid}`;
        this.#compAcordID = `caccord-${this.#guid}`;
        this.#formAccordID = `faccord-${this.#guid}`;
        this.#create();
        this.refreshForm();
    }
    get formTab() {
        return this.#tabPanes[this.#formTabID];
    }

    get compTab() {
        return this.#tabPanes[this.#compTabID];
    }

    static onCompPropChanged(target, e, mappedCompProp) {
        if (target.#selectedComponent) {
            let val = mappedCompProp['mappedElement'].value;
            let oldval = mappedCompProp['mappedElement']['oldvalue'];
            let type = mappedCompProp['mappedType'];
            let prop = mappedCompProp['mappedProp'];
            target.#selectedComponent.control.setComponentProperty(type, prop, val, (msg) => {
                if (!CommonUtils.isNullOrEmpty(msg)) {
                    Modal.commonModalWindow.setModal(target, "Invalid Component", msg, Modal.Ok, function (source, which) {
                        if (e.target) {
                            e.target.value = oldval;
                            e.target.focus();
                        }
                    }, 'text-danger', true);
                    Modal.commonModalWindow.show();
                }
            });
        }
    }

    static onFormPropChanged(target, e, mappedCompProp) {
        if (target.#formcontainer) {
            let val = mappedCompProp['mappedElement'].value;
            let oldval = mappedCompProp['mappedElement']['oldvalue'];
            let type = mappedCompProp['mappedType'];
            let prop = mappedCompProp['mappedProp'];
            target.#formcontainer.setFormProperty(type, prop, val, (msg) => {
                if (!CommonUtils.isNullOrEmpty(msg)) {
                    Modal.commonModalWindow.setModal(target, "Invalid Form Property", msg, Modal.Ok, function (source, which) {
                        if (e.target) {
                            e.target.value = oldval;
                            e.target.focus();
                        }
                    }, 'text-danger', true);
                    Modal.commonModalWindow.show();
                }
            });
        }
    }

    refreshComponent(currentComponent) {
        this.#selectedComponent = currentComponent;
        for (let mappedPorpEl of this.compPropElements) {
            let val = '';
            if (currentComponent) {
                val = currentComponent.control.getComponentProperty(mappedPorpEl['mappedType'], mappedPorpEl['mappedProp']);
            }
            mappedPorpEl['mappedElement'].value = val;
            mappedPorpEl['mappedElement']['oldvalue'] = val;
        }
        //select all visible for
        if (currentComponent) {
            let visibleForELs = this.compTab.querySelectorAll('[visiblefor]')
            for (let el of visibleForELs) {
                if (el.getAttribute('visiblefor').includes(currentComponent.type)) {
                    HtmlUtils.show(el);
                } else {
                    HtmlUtils.hide(el);
                }
            }
        }
        this.#tab.show(this.#compTabID);
    }

    refreshForm() {
        if (this.#formcontainer) {
            for (let mappedPorpEl of this.formPropElements) {
                let val = this.#formcontainer.getFormProperty(mappedPorpEl['mappedType'], mappedPorpEl['mappedProp']);
                mappedPorpEl['mappedElement'].value = val;
                mappedPorpEl['mappedElement']['oldvalue'] = val;
            }
        }
        this.#tab.show(this.#formTabID);
    }

    static #getEditorClass(type) {
        let cls = 'fb-editor-property';
        switch (type) {
            case "checkbox":
            case "radio":
                cls = 'fb-editor-property-check';
                break;
            default:
                break;
        }
        return cls;
    }

    static #createProp(propFor, propObjects, propElements, caller, onPropertyChanged) {
        let datatype = 'text'
        if (propObjects.hasOwnProperty('datatype')) {
            datatype = propObjects['datatype'];
        }
        let propId = `${propFor}-prop-${propObjects.mappedProp}`;
        let mappedType = propObjects['mappedType'];
        let mappedProp = propObjects['mappedProp'];
        let compClass = BootstrapUtils.getBSComponentClass(datatype);
        let labelClass = BootstrapUtils.getBSlabelClass(datatype);
        let elClass = BootstrapUtils.getBSElementClass(datatype);
        let propPane = HtmlUtils.createElement('div', 'noid', { class: `editor-property-pane ${BootstrapUtils.getBSRowOrColClass(datatype)}` });
        let valueCol = HtmlUtils.createElement('div', 'noid', { class: `editor-property-row p-1 ${compClass}` });
        let propName = HtmlUtils.createElement('label', 'noid', { class: `editor-property-label ${labelClass}`, for: propId });
        propName.textContent = propObjects.name;
        valueCol.appendChild(propName);
        let editorEl;
        let groupEl;
        let length = 20;
        if (!CommonUtils.isNullOrUndefined(propObjects['maxlength']) && Number.isInteger(propObjects['maxlength'])) {
            length = propObjects['maxlength'];
        }
        let cls = `${elClass} ${PropertiesBar.#getEditorClass(datatype)}`;
        let elAttributes = {};
        if (propObjects.hasOwnProperty('attributes')) {
            elAttributes = propObjects['attributes'] || {};
        }

        elAttributes['type'] = datatype;
        elAttributes.class = cls;
        switch (propObjects.type) {
            case 'input':
                elAttributes.class = cls;
                elAttributes['maxlength'] = length;
                editorEl = HtmlUtils.createElement('input', propId, elAttributes);
                break;
            case 'popup':
                groupEl = HtmlUtils.createElement('div', 'noid', { class: 'input-group' });
                elAttributes.class = elAttributes.class + ' form-control'
                elAttributes['maxlength'] = length;
                editorEl = HtmlUtils.createElement('input', propId, elAttributes);
                let btn = HtmlUtils.createIconButton({ class: 'btn btn-primary btn-sm m-0 fb-editor-property-btn', type: 'button' }, { class: 'bi bi-three-dots-vertical' }, `btn-${propId}`);
                //btn.textContent = '...';
                btn.addEventListener("click", (e) => {
                    switch (propObjects.popupname) {
                        case "columns":
                            ColumnsEditor.getEditor(editorEl).show();
                            break;
                        case "attributes":
                            NameValueEditor.getEditor(editorEl, 'Attributes').show();
                            break;
                        case "styles":
                            NameValueEditor.getEditor(editorEl, 'Styles').show();
                            break;
                        default:
                            break;
                    }
                });
                groupEl.appendChild(editorEl);
                groupEl.appendChild(btn);
                break;
            case 'select':
                elAttributes.class = elAttributes.class + ' form-select'
                editorEl = HtmlUtils.createElement('select', propId, elAttributes);
                HtmlUtils.populateOptions(editorEl, propObjects['options']);
                if (propObjects.default) {
                    editorEl.value = propObjects.default;
                }
                break;
            default:
                elAttributes['maxlength'] = length;
                editorEl = HtmlUtils.createElement('input', propId, elAttributes);
                break;
        }

        if (propObjects.hasOwnProperty('default')) {
            editorEl.value = propObjects['default'];
        }
        if (propObjects.hasOwnProperty('readonly')) {
            editorEl.readOnly = true;
        }
        let mappedCompProp = { mappedType: mappedType, mappedProp: mappedProp, mappedElement: editorEl };
        editorEl.onchange = (e) => {
            let prop = e.currentTarget;
            if (prop && onPropertyChanged) {
                onPropertyChanged(caller, e, mappedCompProp);
            }
        };

        if (groupEl) {
            valueCol.appendChild(groupEl);
        } else {
            valueCol.appendChild(editorEl);
        }

        propPane.appendChild(valueCol);
        propElements.push(mappedCompProp);
        return propPane;
    }

    #create() {
        //creat tabobjects
        let tabs = {};
        tabs[this.#formTabID] = { caption: 'Form', 'paneclass': 'p-1' };
        tabs[this.#compTabID] = { caption: 'Component', 'paneclass': 'p-1' };

        this.#tab = new TabControl(this.controlId, tabs, this.#formTabID);
        this.tabControl = this.#tab.tabControl;

        //tab panes
        this.#tabPanes = this.#tab.tabPanes;

        //form accordian      
        let formAttrs = {};
        formAttrs['class'] = 'accordion accordion-flush p-0';
        if (CommonUtils.isString(this.ref)) {
            formAttrs['ref'] = this.ref;
        }
        let formAccordion = HtmlUtils.createElement('div', this.#formAccordID, formAttrs);

        if (CommonUtils.isObjcetButNotArray(PropertiesBar.formProperties)) {
            for (let [key, value] of Object.entries(PropertiesBar.formProperties)) {
                let props = value['props'];
                delete value['props'];
                formAccordion.appendChild(Accordion.getAccordionItem(this.#formAccordID, key, value, this.ref, props, this, function (caller, container, props) {
                    if (CommonUtils.isArray(props)) {
                        for (let item of props) {
                            let propItem = PropertiesBar.#createProp(`${caller.#formAccordID}-${key}`, item, caller.formPropElements, caller, PropertiesBar.onFormPropChanged);
                            container.appendChild(propItem);
                        }
                    }
                }));
            }
        }
        this.formTab.appendChild(formAccordion);

        //components tab
        let compAttrs = {};
        compAttrs['class'] = 'accordion accordion-flush py-2';
        if (CommonUtils.isString(this.ref)) {
            compAttrs['ref'] = this.ref;
        }
        //property bar
        let compAccordian = HtmlUtils.createElement('div', this.#compAcordID, compAttrs);

        if (CommonUtils.isObjcetButNotArray(PropertiesBar.componentProperties)) {
            for (let [key, value] of Object.entries(PropertiesBar.componentProperties)) {
                let props = value['props'];
                delete value['props'];
                compAccordian.appendChild(Accordion.getAccordionItem(this.#compAcordID, key, value, this.ref, props, this, function (caller, container, props) {
                    if (CommonUtils.isArray(props)) {
                        for (let item of props) {
                            let propItem = PropertiesBar.#createProp(`${caller.#compAcordID}-${key}`, item, caller.compPropElements, caller, PropertiesBar.onCompPropChanged);
                            container.appendChild(propItem);
                        }
                    }
                }));
            }
        }

        this.compTab.appendChild(compAccordian);
    }

    static componentProperties = {
        "design": {
            text: "Design",
            default: true,
            props: [
                {
                    mappedType: "gen",
                    mappedProp: "name",
                    name: "Name",
                    type: "input",
                    maxlength: 50
                },
                {
                    mappedType: "gen",
                    mappedProp: "caption",
                    name: "Description",
                    type: "input",
                    maxlength: 50
                },
                {
                    mappedType: "gen",
                    mappedProp: "type",
                    name: "Type",
                    type: "input",
                    attributes: {
                        readonly: true
                    }
                }
            ]
        },
        "data": {
            text: "Data Source",
            default: false,
            props: [
                {
                    mappedType: "data",
                    mappedProp: "data-key",
                    name: "Binding",
                    type: "input",
                    maxlength: 30
                },
                {
                    mappedType: "data",
                    mappedProp: "required",
                    name: "Required",
                    type: "input",
                    datatype: "checkbox",
                    default: 'false',

                },
                {
                    mappedType: "data",
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
        "class": {
            text: "Class",
            default: false,
            props: [
                {
                    mappedType: "class",
                    mappedProp: "component",
                    name: "Component",
                    type: "input",
                    maxlength: 50
                },
                {
                    mappedType: "class",
                    mappedProp: "label",
                    name: "Caption",
                    type: "input",
                    maxlength: 50
                },
                {
                    mappedType: "class",
                    mappedProp: "control",
                    name: "Element",
                    type: "input",
                    maxlength: 50
                }
            ]
        },
        "columns": {
            text: "Columns Props",
            default: false,
            visibleFor: 'columns',
            props: [
                {
                    mappedType: "prop",
                    mappedProp: "col-props",
                    name: "Properties",
                    type: "popup",
                    popupname: 'columns',
                    default: 'false',
                    readonly: true
                }
            ]
        },
        "styles": {
            text: "Styles",
            default: false,
            props: [
                {
                    mappedType: "style",
                    mappedProp: "component",
                    name: "Component",
                    type: "popup",
                    popupname: 'attributes',
                    readonly: true
                },
                {
                    mappedType: "style",
                    mappedProp: "label",
                    name: "Caption",
                    type: "popup",
                    popupname: 'attributes',
                    readonly: true
                },
                {
                    mappedType: "style",
                    mappedProp: "control",
                    name: "Element",
                    type: "popup",
                    popupname: 'attributes',
                    readonly: true
                }
            ]
        },
        "attributes": {
            text: "Attributes",
            default: false,
            props: [
                {
                    mappedType: "attr",
                    mappedProp: "component",
                    name: "Component",
                    type: "popup",
                    popupname: 'attributes',
                    readonly: true
                },
                {
                    mappedType: "attr",
                    mappedProp: "label",
                    name: "Caption",
                    type: "popup",
                    popupname: 'attributes',
                    readonly: true
                },
                {
                    mappedType: "attr",
                    mappedProp: "control",
                    name: "Element",
                    type: "popup",
                    popupname: 'attributes',
                    readonly: true
                }

            ]
        }
    };

    static formProperties = {
        "design": {
            text: "Design",
            default: true,
            props: [
                {
                    mappedType: "gen",
                    mappedProp: "name",
                    name: "Name",
                    type: "input",
                    maxlength: 50
                },
                {
                    mappedType: "gen",
                    mappedProp: "caption",
                    name: "Caption",
                    type: "input",
                    maxlength: 50
                }
            ]
        },
        "layout": {
            text: "Layout",
            default: false,
            props: [
                {
                    mappedType: "layout",
                    mappedProp: "height",
                    name: "Height",
                    type: "input",
                    maxlength: 6
                },
                {
                    mappedType: "layout",
                    mappedProp: "width",
                    name: "With",
                    type: "input",
                    maxlength: 6
                },

            ]
        },
        "class": {
            text: "Class",
            default: false,
            props: [
                {
                    mappedType: "class",
                    mappedProp: "form",
                    name: "Form Class",
                    type: "input",
                    maxlength: 50
                },
                {
                    mappedType: "class",
                    mappedProp: "header",
                    name: "Header Class",
                    type: "input",
                    maxlength: 50
                },
                {
                    mappedType: "class",
                    mappedProp: "body",
                    name: "Body Class",
                    type: "input",
                    maxlength: 50
                },
                {
                    mappedType: "class",
                    mappedProp: "title",
                    name: "Title Class",
                    type: "input",
                    maxlength: 50
                },

            ]
        },
        "styles": {
            text: "Styles",
            default: false,
            props: [
                {
                    mappedType: "style",
                    mappedProp: "form",
                    name: "Form Style",
                    type: "popup",
                    popupname: 'attributes',
                    readonly: true
                },
                {
                    mappedType: "style",
                    mappedProp: "header",
                    name: "Header Style",
                    type: "popup",
                    popupname: 'attributes',
                    readonly: true
                },
                {
                    mappedType: "style",
                    mappedProp: "body",
                    name: "Body Style",
                    type: "popup",
                    popupname: 'attributes',
                    readonly: true
                },
                {
                    mappedType: "style",
                    mappedProp: "title",
                    name: "Title Style",
                    type: "popup",
                    popupname: 'attributes',
                    readonly: true
                },
            ]
        },
        "attributes": {
            text: "Attributes",
            default: false,
            props: [
                {
                    mappedType: "attr",
                    mappedProp: "form",
                    name: "Form Attributes",
                    type: "popup",
                    popupname: 'attributes',
                    readonly: true
                },
                {
                    mappedType: "attr",
                    mappedProp: "header",
                    name: "Header Attributes",
                    type: "popup",
                    popupname: 'attributes',
                    readonly: true
                },
                {
                    mappedType: "attr",
                    mappedProp: "body",
                    name: "Body Attributes",
                    type: "popup",
                    popupname: 'attributes',
                    readonly: true
                },
                {
                    mappedType: "attr",
                    mappedProp: "title",
                    name: "Title Attributes",
                    type: "popup",
                    popupname: 'attributes',
                    readonly: true
                },

            ]
        }
    };
}