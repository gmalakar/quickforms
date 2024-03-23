import HtmlUtils from '../utils/html-utils.js';
import CommonUtils from '../utils/common-utils.js';
export default class Accordion {
    constructor() {
    }

    static getAccordionItem(id, coreid, itemProps, ref, items, caller, createItems, bodycls) {
        let itemdesc = itemProps['text'] || 'Missing Item Desc';
        let def = itemProps['default'] || false;
        let visiblefor = itemProps['visiblefor'];
        let notvisiblefor = itemProps['notvisiblefor'];
        let itempanel = `${id}-panel-${coreid}`;
        let itemheader = `${id}-header-${coreid}`;
        let containerid = `${id}-components-${coreid}`;
        let container = `${id}-container-${coreid}`;
        let itemAttr = { class: 'accordion-item' };
        if (visiblefor) {
            itemAttr['visiblefor'] = visiblefor;
        }
        if (notvisiblefor) {
            itemAttr['notvisiblefor'] = notvisiblefor;
        }
        //item
        let accordionItem = HtmlUtils.createElement('div', itempanel, itemAttr);

        //header
        let headerItem = HtmlUtils.createElement('span', itemheader, { class: `accordion-header ` });

        accordionItem.appendChild(headerItem);

        let btnAttrs = {};
        let grpItemCls = 'accordion-collapse collapse';
        let btnCls = 'accordion-button qf-accordian-button';
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
        wrapperAttrs['data-bs-parent'] = `#${id}`;;

        if (CommonUtils.isString(ref)) {
            wrapperAttrs['ref'] = `${ref}-group`;
        }

        let bodyWrapper = HtmlUtils.createElement('div', container, wrapperAttrs);

        //sidebar container
        //sidebar group
        let bodyAttrs = {};
        if (CommonUtils.isNullOrEmpty(bodycls)) {
            bodycls = 'd-grid gap-1 p-2';
        }
        bodyAttrs['class'] = `accordion-body ${bodycls}`;

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