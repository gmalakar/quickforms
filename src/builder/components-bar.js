import BuilderUtils from './builder-utils.js';
import CommonUtils from '../utils/common-utils.js';
import HtmlUtils from '../utils/html-utils.js';
import Accordion from './accordion.js';
export default class ComponentsBar{
    constructor(){
    }

    static #createOption(type, group, text, iconcls, ref, optionOnClick) {
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
        let element =  HtmlUtils.createElement('span', 'noid', attrs);
        let icon =  HtmlUtils.createElement('i', 'noid', { class: iconcls, style: `margin-right: 5px;` });
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
                optionOnClick(btn, btn.attributes['comp-type'].value );
                //this.#setCurrentComponent(this.#theForm.addComponent(btn.attributes['comp-type'].value));
                //this.#currentComponent = this.#theForm.addComponent(btn.attributes['comp-type'].value);
            }
        };
        return element;
    }
    
    static get(barId, ref, optionOnClick) {
        let sidebarAttrs = {};
        sidebarAttrs['class'] = 'accordion';
        if (CommonUtils.isString(ref)) {
            sidebarAttrs['ref'] = ref;
        }
        //sidebar
        var accordian = HtmlUtils.createElement('div', barId, sidebarAttrs);

        //create tabs
        if (CommonUtils.isObjcetButNotArray(BuilderUtils.componentTypes)) {
            for (let [key, value] of Object.entries(BuilderUtils.componentTypes)) {
                let accItems = [];
                let compButtons = value['btns'];
                if (CommonUtils.isArray(compButtons)) {
                    for (let item of compButtons) {
                        let compBtn = ComponentsBar.#createOption(item['type'], key, item['text'], item['iconCls'], ref, optionOnClick);
                        accItems.push(compBtn);
                    }
                }
                accordian.appendChild(Accordion.getAccordionItem(barId, key, value['text'], value['default'], ref, accItems));
            }
        }
        return accordian;
    }
}