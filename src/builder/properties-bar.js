import BuilderUtils from './builder-utils.js';
import CommonUtils from '../utils/common-utils.js';
import HtmlUtils from '../utils/html-utils.js';
import Accordion from './accordion.js';
export default class PropertiesBar{
    constructor(){
    }

    static #editorPropElements = [];

    static refreshEditBar( currentComponent ) {
        for (let mappedPorpEl of PropertiesBar.#editorPropElements) {
            let val = '';
            if (currentComponent) {
                val = currentComponent.getComponentProperty(mappedPorpEl['mappedType'], mappedPorpEl['mappedProp']);
            }
            mappedPorpEl['mappedElement'].value = val;
            mappedPorpEl['mappedElement']['oldvalue'] = val;
        }
    }
    
    static #createProperty(propObjects, callback) {
        let propId = `prop-${propObjects.mappedProp}`;
        let mappedType = propObjects['mappedType'];
        let mappedProp = propObjects['mappedProp'];
        let propPane =  HtmlUtils.createElement('div', 'noid', { class: 'editor-property-pane row' });
        let nameCol =  HtmlUtils.createElement('div', 'noid', { class: 'editor-property-row' });
        let valueCol =  HtmlUtils.createElement('div', 'noid', { class: 'editor-property-row' });
        let propName =  HtmlUtils.createElement('label', 'noid', { class: 'editor-property-label', for: propId });
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
                editorEl =  HtmlUtils.createElement('input', propId, elAttributes);
                break;
            case 'select':
                elAttributes.class =  elAttributes.class + ' form-select'
                editorEl =  HtmlUtils.createElement('select', propId, elAttributes);
                HtmlUtils.populateOptions(editorEl, propObjects['options']);
                if (propObjects.default) {
                    editorEl.value = propObjects.default;
                }

                break;
            default:
                elAttributes['maxlength'] = length;
                editorEl =  HtmlUtils.createElement('input', propId, elAttributes);
                break;
        }

        let mappedCompProp = { mappedType: mappedType, mappedProp: mappedProp, mappedElement: editorEl };
        editorEl.onchange = (e) => {
            let prop = e.currentTarget;
            if (prop && callback) {
                callback(e, mappedCompProp);
            }
        };
        nameCol.appendChild(propName);
        valueCol.appendChild(editorEl);
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
        let accordian = HtmlUtils.createElement('div', editsidebarid, editbarAttrs);


        if (CommonUtils.isObjcetButNotArray(BuilderUtils.componentProperties)) {
            for (let [key, value] of Object.entries(BuilderUtils.componentProperties)) {
                let propItems = [];
                let props = value['props'];
                if (CommonUtils.isArray(props)) {
                    for (let item of props) {
                        let propItem = PropertiesBar.#createProperty(item, onPropertyChanged);
                        propItems.push(propItem);
                    }
                }
                accordian.appendChild(Accordion.getAccordionItem(editsidebarid, key, value['text'], value['default'], ref, propItems));
            }
        }

        return accordian;
    }
}