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

    static #createOption(item, componentsBar) {
        let type = item['type'];
        let datatype = 'text';
        if (item.hasOwnProperty('datatype')) {
            datatype = item['datatype'];
        }
        let caption = item['text'];
        let iconCls = item['iconCls'];

        let attrs = {};
        attrs['tabindex'] = '0'
        attrs['class'] = `btn border-0 btn-sm text-start`;
        attrs['data-type'] = datatype;
        attrs['comp-type'] = type;
        attrs['inputmode'] = item['inputmode'] || '';
        attrs['draggable'] = true;

        if (CommonUtils.isString(componentsBar.ref)) {
            attrs['ref'] = `${componentsBar.ref}-component`;
        }
        let element = HtmlUtils.createElement('span', 'noid', attrs);
        let icon = HtmlUtils.createElement('i', 'noid', { class: iconCls, style: 'margin-right: 5px;' });
        element.appendChild(icon);
        element.appendChild(document.createTextNode(` ${caption} `));
        element.ondragstart = (e) => {
            item['comp-type'] = e.target.attributes['comp-type'].value;
            //let compType = e.target.attributes['comp-type'].value;
            HtmlUtils.dataTransferSetData(e, 'add-comp', item);
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
        compbarAttrs['class'] = 'accordion w-100';
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
                            let propItem = ComponentsBar.#createOption(item, componentsBar);
                            container.appendChild(propItem);
                        }
                    }
                }, 'd-grid p-2'));
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
                    "type": "text",
                    "text": "Text Field",
                    "iconCls": "bi bi-terminal",
                },
                {
                    "type": "textarea",
                    "text": "Text Area",
                    "iconCls": "bi bi-type",
                },
                {
                    "type": "number",
                    "text": "Number",
                    "iconCls": "bi bi-hash",
                    "datatype": "number"
                },
                {
                    "type": "password",
                    "text": "Password",
                    "iconCls": "bi bi-asterisk",
                    "datatype": "password"
                },
                {
                    "type": "checkbox",
                    "text": "Checkbox",
                    "iconCls": "bi-check-square",
                    "datatype": "checkbox"
                },
                {
                    "type": "select",
                    "text": "Select",
                    "iconCls": "bi bi-menu-button-wide",
                    "datatype": "select"
                },
                {
                    "type": "button",
                    "text": "Button",
                    "iconCls": "bi bi-stop",
                    "datatype": "submit"
                }
            ]
        },
        "advanced": {
            text: "Advanced",
            default: false,
            btns: [
                {
                    "type": "email",
                    "text": "Email",
                    "iconCls": "bi bi-at",
                    "datatype": "email"
                },
                {
                    "type": "url",
                    "text": "Url",
                    "iconCls": "bi bi-link",
                },
                {
                    "type": "tel",
                    "text": "phone",
                    "datatype": "tel",
                    "iconCls": "bi bi-phone",
                    "inputmode": 'decimal'
                },
                {
                    "type": "address",
                    "text": "Address",
                    "iconCls": "bi bi-house"
                },
                {
                    "type": "datetime-local",
                    "text": "Date Time",
                    "iconCls": "bi bi-calendar"
                },
                {
                    "type": "day",
                    "text": "Day",
                    "iconCls": "bi bi-calendar"
                },
                {
                    "type": "time",
                    "text": "Time",
                    "iconCls": "bi bi-clock"
                },
                {
                    "type": "currency",
                    "text": "Currency",
                    "iconCls": "bi bi-currency-dollar"
                }
            ]
        },
        "layout": {
            text: "Layout",
            default: false,
            btns: [
                {
                    "default": true,
                    "type": "columns",
                    "text": "Columns",
                    "iconCls": "bi-layout-three-columns",
                },
                {
                    "type": "groupbox",
                    "text": "Group Box",
                    "iconCls": "bi bi-grid-fill",
                },
                {
                    "type": "panel",
                    "text": "Panel",
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