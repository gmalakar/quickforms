import HtmlUtils from '../utils/html-utils.js';
import CommonUtils from '../utils/common-utils.js';
export default class Accordion {
    constructor() {

    }

    static getAccordionItem(accordianid, coreid, itemProps, ref, items, caller, createItems) {
        let itemdesc = itemProps['text'] || 'Missing Item Desc';
        let def = itemProps['default'] || false;
        let visibleFor = itemProps['visibleFor'];
        let itempanel = `${accordianid}-panel-${coreid}`;
        let itemheader = `${accordianid}-header-${coreid}`;
        let containerid = `${accordianid}-components-${coreid}`;
        let container = `${accordianid}-container-${coreid}`;
        let itemAttr = { class: 'accordion-item' };
        if (visibleFor) {
            itemAttr['visiblefor'] = visibleFor;
        }
        //item
        let accordionItem = HtmlUtils.createElement('div', itempanel, itemAttr);
        if (visibleFor) {
            accordionItem.style.display = "none";
        }

        //header
        let headerItem = HtmlUtils.createElement('h2', itemheader, { class: `accordion-header ` });

        accordionItem.appendChild(headerItem);

        let btnAttrs = {};
        let grpItemCls = 'accordion-collapse collapse';
        let btnCls = 'accordion-button fb-accordian-button';
        if (def) {
            grpItemCls = grpItemCls + ' show';
        } else {
            btnCls = btnCls + ' collapsed';
        }
        btnAttrs.class = btnCls;
        btnAttrs.Type = 'button';
        btnAttrs['aria-controls'] = container;
        btnAttrs['aria-expanded'] = def;
        btnAttrs['data-bs-target'] = `#${container}`;
        btnAttrs['data-bs-toggle'] = 'collapse';
        //button

        let headerbtn = HtmlUtils.createElement('button', `header-button-${coreid}`, btnAttrs);
        headerbtn.textContent = itemdesc;
        headerItem.appendChild(headerbtn);

        //body wrapper
        let wrapperAttrs = {};
        wrapperAttrs['class'] = grpItemCls;
        wrapperAttrs['aria-labelledby'] = itemheader;
        wrapperAttrs['data-bs-parent'] = `#${accordianid}`;;

        if (CommonUtils.isString(ref)) {
            wrapperAttrs['ref'] = `${ref}-group`;
        }

        let bodyWrapper = HtmlUtils.createElement('div', container, wrapperAttrs);

        //sidebar container
        //sidebar group
        let bodyAttrs = {};
        bodyAttrs['class'] = 'accordion-body d-grid gap-1 no-drop p-2 w-100';

        if (CommonUtils.isString(ref)) {
            bodyAttrs['ref'] = `${ref}-container`;
        }


        let accordionBody = HtmlUtils.createElement('div', containerid, bodyAttrs);

        //create tabs
        if (CommonUtils.isFunction(createItems)) {
            createItems(caller, accordionBody, items);
        }
        else if (CommonUtils.isArray(items)) {
            for (let item of items) {
                if (HtmlUtils.isNode(item) || CommonUtils.isString(item)) {
                    accordionBody.appendChild(item);
                }
            }
        }

        bodyWrapper.appendChild(accordionBody);

        accordionItem.appendChild(bodyWrapper);

        return accordionItem;
    }

}