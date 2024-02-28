import CommonUtils from '../utils/common-utils.js';
import HtmlUtils from '../utils/html-utils.js';
import Accordion from './accordion.js';
import ColumnsEditor from '../editors/columns-editor.js';
import TabControl from '../utils/tab-control.js';
import Modal from '../utils/modal.js';
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
    #formschema;
    formPropElements = [];
    compPropElements = [];
    #selectedComponent;

    constructor(formschema, ref) {
        this.#formschema = formschema;
        this.ref = ref;
        this.#guid = CommonUtils.ShortGuid();
        this.controlId = `pbar-${this.#guid}`;
        this.#formTabID = `fprop-${this.#guid}`;
        this.#compTabID = `cprop-${this.#guid}`;
        this.#compAcordID = `caccord-${this.#guid}`;
        this.#formAccordID = `faccord-${this.#guid}`;
        this.#create();
    }
    get formTab() {
        return this.#tabPanes[this.#formTabID];
    }

    get compTab() {
        return this.#tabPanes[this.#compTabID];
    }

    onCompPropChanged(target, e, mappedCompProp) {
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

    onFormPropChanged(target, e, mappedCompProp) {
        if (target.#formschema) {
            alert('here');
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
        if (this.#formschema) {
            for (let mappedPorpEl of this.formPropElements) {
                let val = '';
                if (currentComponent) {
                    val = currentComponent.control.getComponentProperty(mappedPorpEl['mappedType'], mappedPorpEl['mappedProp']);
                }
                mappedPorpEl['mappedElement'].value = val;
                mappedPorpEl['mappedElement']['oldvalue'] = val;
            }
        }
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

    static #createProp(propFor, propObjects, propElements, caller, onPropertyChanged) {
        let propId = `${propFor}-prop-${propObjects.mappedProp}`;
        let mappedType = propObjects['mappedType'];
        let mappedProp = propObjects['mappedProp'];
        let propPane = HtmlUtils.createElement('div', 'noid', { class: 'editor-property-pane row' });
        let nameCol = HtmlUtils.createElement('div', 'noid', { class: 'editor-property-row' });
        let valueCol = HtmlUtils.createElement('div', 'noid', { class: 'editor-property-row' });
        let propName = HtmlUtils.createElement('label', 'noid', { class: 'editor-property-label', for: propId });
        propName.textContent = propObjects.name;
        let editorEl;
        let groupEl;
        let length = 20;
        if (!CommonUtils.isNullOrUndefined(propObjects['maxlength']) && Number.isInteger(propObjects['maxlength'])) {
            length = propObjects['maxlength'];
        }
        let cls = 'editor-property';
        let elAttributes = {};
        if (propObjects.hasOwnProperty('attributes')) {
            elAttributes = propObjects['attributes'] || {};
        }
        let datatype = 'text'
        if (propObjects.hasOwnProperty('datatype')) {
            datatype = propObjects['datatype'];
        }
        elAttributes['type'] = datatype;
        elAttributes.class = cls;
        switch (propObjects.type) {
            case 'textfield':
                elAttributes.class = elAttributes.class + ' form-control'
                elAttributes['maxlength'] = length;
                editorEl = HtmlUtils.createElement('input', propId, elAttributes);
                break;
            case 'popup':
                groupEl = HtmlUtils.createElement('div', 'noid', { class: 'input-group' });
                elAttributes.class = elAttributes.class + ' form-control'
                elAttributes['maxlength'] = length;
                editorEl = HtmlUtils.createElement('input', propId, elAttributes);
                let btn = HtmlUtils.createIconButton({ class: 'btn btn-primary', type: 'button' }, { class: 'bi bi-three-dots-vertical' }, `btn-${propId}`);
                btn.textContent = '...';
                btn.addEventListener("click", (e) => {
                    //let params = { properties: editorEl.value, numcolumns: 3 }
                    ColumnsEditor.getEditor(editorEl).show();
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
        nameCol.appendChild(propName);
        if (groupEl) {
            valueCol.appendChild(groupEl);
        } else {
            valueCol.appendChild(editorEl);
        }
        propPane.appendChild(nameCol);
        propPane.appendChild(valueCol);
        propElements.push(mappedCompProp);
        return propPane;
    }

    #create() {
        //creat tabobjects
        let tabs = {};
        tabs[this.#formTabID] = 'Form';
        tabs[this.#compTabID] = 'Components';

        this.#tab = new TabControl(this.controlId, tabs, this.#formTabID);
        this.tabControl = this.#tab.tabControl;

        //tab panes
        this.#tabPanes = this.#tab.tabPanes;

        //form accordian      
        let formAttrs = {};
        formAttrs['class'] = 'accordion px-2 py-1';
        if (CommonUtils.isString(this.ref)) {
            formAttrs['ref'] = this.ref;
        }
        let formAccordion = HtmlUtils.createElement('div', this.#formAccordID, formAttrs);

        if (CommonUtils.isObjcetButNotArray(PropertiesBar.formProperties)) {
            for (let [key, value] of Object.entries(PropertiesBar.formProperties)) {
                let props = value['props'];
                delete value['props'];
                let me = this;
                formAccordion.appendChild(Accordion.getAccordionItem(this.#formAccordID, key, value, this.ref, props, this, function (caller, container, props) {
                    if (CommonUtils.isArray(props)) {
                        for (let item of props) {
                            let propItem = PropertiesBar.#createProp(caller.formAccordID, item, caller.formPropElements, caller, caller.onFormPropChanged);
                            container.appendChild(propItem);
                        }
                    }
                }));
            }
        }
        this.formTab.appendChild(formAccordion);

        //components tab
        let compAttrs = {};
        compAttrs['class'] = 'accordion px-2 py-1';
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
                            let propItem = PropertiesBar.#createProp(caller.compAcordID, item, caller.compPropElements, caller, caller.onCompPropChanged);
                            container.appendChild(propItem);
                        }
                    }
                }));
            }
        }

        this.compTab.appendChild(compAccordian);
    }

    static componentProperties = {
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
                    mappedProp: "caption",
                    name: "Description",
                    type: "textfield",
                    maxlength: 50
                },
                {
                    mappedType: "gen",
                    mappedProp: "type",
                    name: "Type",
                    type: "textfield",
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
        "attributes": {
            text: "HTML Attributes",
            default: false
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
                    type: "textfield",
                    maxlength: 50
                },
                {
                    mappedType: "gen",
                    mappedProp: "caption",
                    name: "Caption",
                    type: "textfield",
                    maxlength: 50
                }
            ]
        },
        "layout": {
            text: "Layout",
            default: false,
            props: [
                {
                    mappedType: "style",
                    mappedProp: "height",
                    name: "Height",
                    type: "number",
                    maxlength: 3
                },
                {
                    mappedType: "style",
                    mappedProp: "width",
                    name: "With",
                    type: "number",
                    maxlength: 3
                },

            ]
        },
        "attributes": {
            text: "HTML Attributes",
            default: false
        }
    };
}