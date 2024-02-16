import HtmlUtils from '../utils/html-utils.js';
import CommonUtils from '../utils/common-utils.js';
export default class Accordion{
    constructor(){

    }
    
    static  getAccordionItem(accordianid, coreid, itemdesc, def, ref, items) {
        let itempanel = `${accordianid}-panel-${coreid}`;
        let itemheader = `${accordianid}-header-${coreid}`;
        let containerid = `${accordianid}-components-${coreid}`;
        let container = `${accordianid}-container-${coreid}`;
        let accordionItem = HtmlUtils.createElement('div', itempanel, { class: `accordion-item` });
        let headerItem = HtmlUtils.createElement('h2', itemheader, { class: `accordion-header` });
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


        let headerbtn = HtmlUtils.createElement('button', `header-button-${coreid}`, btnAttrs);
        headerbtn.textContent = itemdesc;
        headerItem.appendChild(headerbtn);

        //sidebar group
        let groupAttrs = {};
        groupAttrs['class'] = itemCls;
        groupAttrs['aria-labelledby'] = itemheader;

        if (CommonUtils.isString(ref)) {
            groupAttrs['ref'] = `${ref}-group`;
        }

        let groupItem = HtmlUtils.createElement('div', container, groupAttrs);

        //sidebar container
        //sidebar group
        let containerAttrs = {};
        containerAttrs['class'] = 'accordion-body d-grid gap-1 no-drop p-2 w-100';

        if (CommonUtils.isString(ref)) {
            containerAttrs['ref'] = `${ref}-container`;
        }


        let groupBody = HtmlUtils.createElement('div', containerid, containerAttrs);

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

}