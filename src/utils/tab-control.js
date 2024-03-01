import HtmlUtils from './html-utils.js';
import CommonUtils from './common-utils.js';
export default class TabControl {

    panelid = 'tab-panel';
    tabControlID;
    tabs;
    defaultTab;
    tabControl;
    tabPanes = {};
    #tabLinks = {}

    constructor(id, tabs, defaultTab) {
        this.tabControlID = id;
        this.panelid = `panel-${id}`;
        this.tabs = tabs;
        this.defaultTab = defaultTab;
        this.#createTab();
    }

    #createTab() {
        //tabcontrol
        this.tabControl = HtmlUtils.createElement('div', this.tabControlID);

        //navigation
        let nav = HtmlUtils.createElement('ul', this.panelid + '-tab', { class: `nav nav-tabs`, role: `tablist` });

        //content
        let content = HtmlUtils.createElement('div', this.panelid + '-content', { class: `tab-content` });

        //create tabs
        if (CommonUtils.isObjcetButNotArray(this.tabs)) {
            for (let [key, value] of Object.entries(this.tabs)) {
                let linkclass = `nav-link`;
                let paneclass = `tab-pane fade container-fluid`;
                if (key === this.defaultTab) {
                    linkclass = linkclass + ' active';
                    paneclass = paneclass + ' active show'
                }
                //tab nav
                let caption = value.caption ?? 'No Caption';
                let navlink = HtmlUtils.createElement('li', key + '-li', { class: `nav-item`, role: `presentation` });
                let tabid = key + '-tab';
                let link = HtmlUtils.createElement('a', tabid, { href: `#${key}`, class: linkclass, role: `tab`, 'data-bs-toggle': `tab`, });
                this.#tabLinks[key] = link;
                link.innerHTML = caption;
                if (value.click) {
                    link.addEventListener('click', value.click);
                }
                navlink.appendChild(link);
                nav.appendChild(navlink);

                //content
                let panel = HtmlUtils.createElement('div', key, { class: paneclass, role: `tabpanel`, 'area-labelledb': tabid, tabindex: '0' });
                this.tabPanes[key] = panel;
                content.appendChild(panel);
            }
        }

        //add to panel
        this.tabControl.appendChild(nav);
        this.tabControl.appendChild(content);
    }

    show(tabid) {
        let tabToShow = this.#tabLinks[tabid];
        if (tabToShow) {
            tabToShow.click();
        }
    }
}