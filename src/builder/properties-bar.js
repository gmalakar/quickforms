import BuilderUtils from './builder-utils.js';
import CommonUtils from '../utils/common-utils.js';
import HtmlUtils from '../utils/html-utils.js';
import Accordion from './accordion.js';
import ColumnsEditor from '../editors/columns-editor.js';

export default class PropertiesBar {
    constructor() {
    }

    static accordian;
    static #editorPropElements = [];

    static refreshEditBar(currentComponent) {
        for (let mappedPorpEl of PropertiesBar.#editorPropElements) {
            let val = '';
            if (currentComponent) {
                val = currentComponent.control.getComponentProperty(mappedPorpEl['mappedType'], mappedPorpEl['mappedProp']);
            }
            mappedPorpEl['mappedElement'].value = val;
            mappedPorpEl['mappedElement']['oldvalue'] = val;
        }
        //select all visible for
        let visibleForELs = PropertiesBar.accordian.querySelectorAll('[visiblefor]')
        for (let el of visibleForELs) {
            if (el.getAttribute('visiblefor').includes(currentComponent.type)) {
                HtmlUtils.show(el);
            } else {
                HtmlUtils.hide(el);
            }
        }
    }

    static popup(e, which) {
        alert(which);
    }
    static #createProperty(propObjects, callback) {
        let propId = `prop-${propObjects.mappedProp}`;
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
            if (prop && callback) {
                callback(e, mappedCompProp);
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
        PropertiesBar.#editorPropElements.push(mappedCompProp);
        return propPane;
    }


    static get(editsidebarid, ref, onPropertyChanged) {
        let editbarAttrs = {};
        editbarAttrs['class'] = 'accordion';
        if (CommonUtils.isString(ref)) {
            editbarAttrs['ref'] = ref;
        }
        //property bar
        PropertiesBar.accordian = HtmlUtils.createElement('div', editsidebarid, editbarAttrs);


        if (CommonUtils.isObjcetButNotArray(BuilderUtils.componentProperties)) {
            for (let [key, value] of Object.entries(BuilderUtils.componentProperties)) {
                let props = value['props'];
                delete value['props'];
                PropertiesBar.accordian.appendChild(Accordion.getAccordionItem(editsidebarid, key, value, ref, props, function (container, props) {
                    if (CommonUtils.isArray(props)) {
                        for (let item of props) {
                            let propItem = PropertiesBar.#createProperty(item, onPropertyChanged);
                            container.appendChild(propItem);
                        }
                    }
                }));
            }
        }

        return PropertiesBar.accordian;
    }
}