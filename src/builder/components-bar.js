import CommonUtils from '../utils/common-utils.js';
import HtmlUtils from '../utils/html-utils.js';
import Accordion from './accordion.js';
export default class ComponentsBar {

    ref;
    #compbarId;
    selectedContainer;
    control;

    constructor(formcontainer, ref) {
        this.selectedContainer = formcontainer;
        this.ref = ref;
        this.#compbarId = `compbar-${CommonUtils.ShortGuid()}`;
        this.#create();
    }

    static #createOption(type, group, text, iconcls, componentsBar) {
        let attrs = {};
        attrs['tabindex'] = '0'
        attrs['class'] = `btn btn-outline-primary btn-sm m-0`;
        attrs['data-type'] = type;
        attrs['data-group'] = group;
        attrs['data-key'] = type;
        attrs['comp-type'] = type;
        attrs['draggable'] = true;

        if (CommonUtils.isString(componentsBar.ref)) {
            attrs['ref'] = `${componentsBar.ref}-component`;
        }
        let element = HtmlUtils.createElement('span', 'noid', attrs);
        let icon = HtmlUtils.createElement('i', 'noid', { class: iconcls, style: `margin-right: 5px;` });
        element.textContent = ` ${text} `;
        element.appendChild(icon);
        element.ondragstart = (e) => {
            let compType = e.target.attributes['comp-type'].value;
            console.log(compType);
            HtmlUtils.dataTransferSetData(e, 'add-comp', compType);
        };
        element.onclick = (e) => {
            let btn = e.currentTarget;
            if (btn) {
                if (componentsBar) {
                    componentsBar.addComponent(btn.attributes['comp-type'].value);
                }
            }
        };
        return element;
    }

    addComponent(type) {
        if (this.selectedContainer) {
            this.selectedContainer.addComponent(type, true);
        }
    }

    setCurrentContainer(container) {
        this.selectedContainer = container;
    }

    #create() {
        let compbarAttrs = {};
        compbarAttrs['class'] = 'accordion px-2 py-1';
        if (CommonUtils.isString(this.ref)) {
            compbarAttrs['ref'] = this.ref;
        }
        //sidebar
        this.control = HtmlUtils.createElement('div', this.#compbarId, compbarAttrs);

        //create tabs
        if (CommonUtils.isObjcetButNotArray(ComponentsBar.componentTypes)) {
            for (let [key, value] of Object.entries(ComponentsBar.componentTypes)) {
                let compButtons = value['btns'];
                delete value['btns'];
                this.control.appendChild(Accordion.getAccordionItem(this.#compbarId, key, value, this.ref, compButtons, this, function (componentsBar, container, props) {
                    if (CommonUtils.isArray(props)) {
                        for (let item of props) {
                            let propItem = ComponentsBar.#createOption(item['type'], key, item['text'], item['iconCls'], componentsBar);
                            container.appendChild(propItem);
                        }
                    }
                }));
            }
        }
    }

    static componentTypes = {
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
}