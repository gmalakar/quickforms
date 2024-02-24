import CommonUtils from '../utils/common-utils.js';
import ErrorHandler from '../utils/error-handler.js';
import HtmlUtils from '../utils/html-utils.js';
import Modal from '../utils/modal.js';
import Form from '../components/form.js';
import ComponentsBar from './components-bar.js';
import PropertiesBar from './properties-bar.js';
//builder
export default class Builder {

    #builderContainer;
    #formName;
    #theFormContainer;
    #buildertTabPanes = {};
    #editBar;
    #currentComponent;
    #formMetaData = {}

    /**
     * Class constructor of Builder.
     * 
     * @param {string} placeholder place holder for form builder
     * @param {string} formname form name
     * @param {string} formMetaData form metadata
     */
    constructor(placeholder, formMetaData) {
        if (CommonUtils.isNullOrEmpty(placeholder)) {
            return ErrorHandler.throwError(ErrorHandler.errorCode.Builder.MISSING_PLACEHOLDER);
        } else if (CommonUtils.isNullOrUndefined(formMetaData)) {
            return ErrorHandler.throwError(ErrorHandler.errorCode.Builder.MISSING_FORM_METADATA);
        } else if (CommonUtils.isNullOrEmpty(formMetaData.name)) {
            return ErrorHandler.throwError(ErrorHandler.errorCode.Form.MISSING_NAME);
        }
        else {
            //defaut form name
            this.#formName = formMetaData.name;

            this.#formMetaData = formMetaData;
            //builder container
            this.#builderContainer = document.getElementById(placeholder);
        }
    }

    static #fbMainId = 'fb-main';

    static #fbPanelId = 'fb-panel';

    static #floudsBuilderlId = 'flouds-builder';

    static #fbSidebarComponentsId = 'sidebar-comps';

    static #fbAreaId = 'design-area';

    static #fbPropertyBarId = 'propertybar';

    static #idEditbar = 'editbar';

    static #fbContainerId = 'design-container';

    static #fbFormContainerId = 'form-container';

    static #fbJsonContainer = 'json-container';

    static #idSidebar = 'sidebar';

    static #idArea = 'area';

    static #fbAreaCls = 'fb-design-area';


    get builderPane() {
        return this.#buildertTabPanes[Builder.#fbContainerId];
    }

    get formPane() {
        return this.#buildertTabPanes[Builder.#fbFormContainerId];
    }

    get jsonPane() {
        return this.#buildertTabPanes[Builder.#fbJsonContainer];
    }

    buildBuilder() {
        if (this.#builderContainer) {
            this.#createBed();
        } else {
            ErrorHandler.throwError('builder.invalidbuilderel');
        }
    }

    #createBed() {
        //clear the placeholder
        this.#builderContainer.innerHTML = '';

        //create main div
        let buildermain = this.#createElement('div', Builder.#fbMainId);

        //creat tabobjects
        let tabs = {};
        tabs[Builder.#fbContainerId] = 'Builder';
        tabs[Builder.#fbFormContainerId] = 'Form';
        tabs[Builder.#fbJsonContainer] = 'Json';

        //add tabs
        this.#buildertTabPanes = this.#addTabPanel(buildermain, Builder.#fbPanelId, tabs, Builder.#fbContainerId);

        //main builder
        let builder = this.#createElement('div', Builder.#floudsBuilderlId, { class: `flouds builder row Builder` });

        //components bar
        let componentBar = this.#createElement('div', Builder.#fbSidebarComponentsId, { class: `col-xs-3 col-sm-3 col-md-2 fb-component-bar` });

        //form design area
        let formArea = this.#createElement('div', Builder.#fbAreaId, { class: `col-xs-6 col-sm-6 col-md-8 fb-form-area`, ref: Builder.#floudsBuilderlId });

        //property bar
        let propertyBar = this.#createElement('div', Builder.#fbPropertyBarId, { class: `col-xs-3 col-sm-3 col-md-2 fb-property-bar`, ref: Builder.#floudsBuilderlId });

        //append components bar
        builder.appendChild(componentBar);

        //appened form area
        builder.appendChild(formArea);

        //append property bar
        builder.appendChild(propertyBar);

        //add designer
        //add container holder
        let formContainerHolder = this.#createElement('div', Builder.#idArea, { class: Builder.#fbAreaCls, ref: Builder.#fbAreaId });

        //add form container
        this.#theFormContainer = new Form(this.#formName, this.#formMetaData, this, this.#observingMethod, true);

        //append the contaioner
        formContainerHolder.appendChild(this.#theFormContainer.control);

        //add form
        let form = this.#createElement('form', this.#formName);

        //append form to form pane
        this.formPane.appendChild(form);

        //add side bar

        let sidebar = ComponentsBar.get(Builder.#idSidebar, Builder.#fbSidebarComponentsId, (source, type) => {
            this.#theFormContainer.addComponent(null, type, true);
        });

        componentBar.appendChild(sidebar);

        formArea.appendChild(formContainerHolder);

        //add edit bar
        this.#editBar = PropertiesBar.get(Builder.#idEditbar, Builder.#fbPropertyBarId, (e, mappedCompProp) => {
            if (this.#currentComponent) {
                let val = mappedCompProp['mappedElement'].value;
                let oldval = mappedCompProp['mappedElement']['oldvalue'];
                let type = mappedCompProp['mappedType'];
                let prop = mappedCompProp['mappedProp'];
                this.#currentComponent.control.setComponentProperty(type, prop, val, (msg) => {
                    if (!CommonUtils.isNullOrEmpty(msg)) {
                        Modal.commonModalWindow.setModal(this, "Invalid Component", msg, Modal.Ok, function (source, which) {
                            if (e.target) {
                                e.target.value = oldval;
                                e.target.focus();
                            }
                        }, 'text-danger', true);
                        Modal.commonModalWindow.show();
                    }
                });
            }
        });

        propertyBar.appendChild(this.#editBar);

        //append the main to placeholder
        this.#builderContainer.appendChild(buildermain);

        //appened builder
        this.builderPane.appendChild(builder);

        this.#finalizeBuilder();
    }

    #finalizeBuilder() {
        if (this.builderPane) {
            console.log('Valid container');
        } else {
            console.log('Invalid container');
        }
    }

    #observingMethod(observer, event, args) {
        //here this means callee
        if (observer.constructor === Builder) {
            switch (event) {
                case 'currentComponentChanged':
                    PropertiesBar.refreshEditBar(args);
                    observer.#currentComponent = args;
                    break;
                default:
                    break;
            }
        }
    }

    #createElement(tag, id, attributes) {
        return HtmlUtils.createElement(tag, id, attributes);
    }

    #addTabPanel(parentEl, panelid, tabs, defaultselected) {
        let tabPanes = {}
        if (HtmlUtils.isElement(parentEl)) {
            if (CommonUtils.isString(parentEl)) {
                parentEl = HtmlUtils.getElement(parentEl);
            }
            //navigation
            let nav = this.#createElement('ul', panelid + '-tab', { class: `nav nav-tabs`, role: `tablist` });

            //content
            let content = this.#createElement('div', panelid + '-content', { class: `tab-content` });

            //create tabs
            if (CommonUtils.isObjcetButNotArray(tabs)) {
                for (let [key, value] of Object.entries(tabs)) {
                    let linkclass = `nav-link`;
                    let paneclass = `tabpane fade`;
                    if (key === defaultselected) {
                        linkclass = linkclass + ' active';
                        paneclass = paneclass + ' active show'
                    }
                    //tab nav
                    let navlink = this.#createElement('li', key + '-li', { class: `nav-item`, role: `presentation` });
                    let link = this.#createElement('a', 'noid', { href: `#${key}`, class: linkclass, role: `tab`, 'data-bs-toggle': `tab`, });
                    link.innerHTML = value;
                    navlink.appendChild(link);
                    nav.appendChild(navlink);

                    //content
                    let panel = this.#createElement('div', key, { class: paneclass, role: `tabpanel` });
                    tabPanes[key] = panel;
                    content.appendChild(panel);
                }
            }

            //add to panel
            parentEl.appendChild(nav);
            parentEl.appendChild(content);
        }
        return tabPanes;
    }
}