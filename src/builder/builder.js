import CommonUtils from '../utils/common-utils.js';
import ErrorHandler from '../utils/error-handler.js';
import HtmlUtils from '../utils/html-utils.js';
import Modal from '../utils/modal.js';
import Form from '../components/form.js';
import ComponentsBar from './components-bar.js';
import PropertiesBar from './properties-bar.js';
//builder
export default class Builder {

    #builderHolder;
    #formName;
    #componentsContainer;
    #theForm;
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
    constructor(placeholder, formname, formMetaData = null) {
        if (CommonUtils.isNullOrEmpty(placeholder)) {
            ErrorHandler.throwError(ErrorHandler.errorCode.Builder.MISSING_PLACEHOLDER);
        } else {
            this.#formName = formname ?? 'sample';

            this.#builderHolder = document.getElementById(placeholder);

            this.#formMetaData = formMetaData || {};

            if (CommonUtils.isJson(this.#formMetaData)) {
                this.#formMetaData = CommonUtils.jsonToObject(this.#formMetaData);
            }

            if (CommonUtils.isNullOrEmpty(this.#formMetaData.formName)) {
                this.#formMetaData['formName'] = formname;
            }
        }
    }

    static #clsSelected = 'fb-selected-comp';

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

    static #fbFormCls = 'fb-design-form';

    static #compDeleteBtn = HtmlUtils.createElement('button', 'fb-delete-comp-btn', { class: 'btn-close fb-delete-comp-btn' });


    get #builderPane() {
        return this.#buildertTabPanes[Builder.#fbContainerId];
    }

    get #formPane() {
        return this.#buildertTabPanes[Builder.#fbFormContainerId];
    }

    get #jsonPane() {
        return this.#buildertTabPanes[Builder.#fbJsonContainer];
    }

    buildBuilder() {
        if (this.#builderHolder) {
            this.#createBed();
        } else {
            ErrorHandler.throwError('builder.invalidbuilderel');
        }
    }

    #createBed() {
        //clear the placeholder
        this.#builderHolder.innerHTML = '';

        //create main div
        let buildermain = this.#createElement('div', Builder.#fbMainId );

        //creat tabobjects
        let tabs = {};
        tabs[Builder.#fbContainerId] = 'Builder';
        tabs[Builder.#fbFormContainerId] = 'Form';
        tabs[Builder.#fbJsonContainer] = 'Json';

        //add tabs
        this.#buildertTabPanes = this.#addTabPanel(buildermain, Builder.#fbPanelId, tabs, Builder.#fbContainerId);

        //main builder
        let builder = this.#createElement('div', Builder.#floudsBuilderlId, { class: `flouds builder row Builder` });

        //formcomponents
        let componentBar = this.#createElement('div', Builder.#fbSidebarComponentsId, { class: `col-xs-3 col-sm-3 col-md-2 fb-component-bar` });

        //form area
        let formarea = this.#createElement('div', Builder.#fbAreaId, { class: `col-xs-6 col-sm-6 col-md-8 formarea`, ref: Builder.#floudsBuilderlId });

        //property bar
        let propertyBar = this.#createElement('div', Builder.#fbPropertyBarId, { class: `col-xs-3 col-sm-3 col-md-2 fb-property-bar`, ref: Builder.#floudsBuilderlId });

        builder.appendChild(componentBar);

        builder.appendChild(formarea);

        builder.appendChild(propertyBar);

        this.#builderPane.appendChild(builder);

        //add form
        let form = this.#createElement('form', this.#formName);

        //append form to form pane
        this.#formPane.appendChild(form);

        //add side bar

        let sidebar = ComponentsBar.get(Builder.#idSidebar, Builder.#fbSidebarComponentsId, (source, type)=>{
            this.#setCurrentComponent(this.#theForm.addComponent(type));
        } );

        componentBar.appendChild(sidebar);

        let area = this.#getBuildArea(Builder.#idArea, Builder.#fbAreaId);

        formarea.appendChild(area);

        //add edit bar

        this.#editBar = PropertiesBar.get (Builder.#idEditbar, Builder.#fbPropertyBarId, (e, mappedCompProp)=>{
            if (this.#currentComponent) {
                let val = mappedCompProp['mappedElement'].value;
                let type = mappedCompProp['mappedType'];
                let prop = mappedCompProp['mappedProp'];
                this.#currentComponent.setComponentProperty(type, prop, val);
            }            
        });

        propertyBar.appendChild(this.#editBar);

        //append the main to placeholder
        this.#builderHolder.appendChild(buildermain);

        this.#finalizeBuilder();
    }

    #finalizeBuilder() {
        if (this.#builderPane) {
            console.log('Valid container');
            //add the form
            this.#theForm = new Form(this.#componentsContainer, this.#formMetaData, this, this.#observingMethod);
            //set delete function
            Builder.#compDeleteBtn.addEventListener('click', (e) => {
                Modal.commonModalWindow.setModal(this, "Delete Component", "Do you want to delete this component?", Modal.YesNo, function (source, which) {
                    if (which === 'yes') {
                        if (source) {
                            source.#theForm.removeComponent();
                            source.#theForm.removeComponent( source.#currentComponent);
                        }
                    }
                }, null, true);
                Modal.commonModalWindow.show();
            })
        } else {
            console.log('Invalid container');
        }
    }

    #setDeleteButton(component, set) {
        if (component) {
            let firstChild = component.fbComponent.firstChild;
            if (set) {
                HtmlUtils.addClasses(component.fbComponent, Builder.#clsSelected);
                if (CommonUtils.isNullOrUndefined(firstChild)) {
                    component.fbComponent.appendChild(Builder.#compDeleteBtn);
                }
                else if (firstChild !== Builder.#compDeleteBtn) {
                    component.fbComponent.insertBefore(Builder.#compDeleteBtn, firstChild);
                }
            } else {
                HtmlUtils.removeClasses(component.fbComponent, Builder.#clsSelected);
                if (firstChild === Builder.#compDeleteBtn) {
                    component.fbComponent.removeChild(Builder.#compDeleteBtn);
                }
            }
        }
    }

    #setCurrentComponent(component) {
        if (this.#currentComponent !== component) {
            //reset
            this.#setDeleteButton(this.#currentComponent, false);
            this.#currentComponent = component;
            this.#setDeleteButton(this.#currentComponent, true);
        }
        PropertiesBar.refreshEditBar( this.#currentComponent );
    }

    #observingMethod(observer, event, args) {
        //here this means callee
        if (observer.constructor === Builder) {
            switch (event) {
                case 'currentComponentChanged':
                    observer.#setCurrentComponent(args);
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

    #getBuildArea(areaid, ref) {
        ref = ref ?? 'component';

        let topDiv = this.#createElement('div', areaid, { class: Builder.#fbAreaCls, ref: ref });
        let webDiv = this.#createElement('div', 'noid', { novalidate: ``, class: Builder.#fbFormCls, ref: areaid });
        //let dragConcainer = this.#createElement('div', 'noid', { class: `${Builder.#builderComponents} ${Builder.#dragOntoCls} builder-form`, ref: `webform-container` });
        let dcAttrs = {};

        //dcAttrs['class'] = `drag-and-drop-alert alert alert-info no-drag`;
        dcAttrs['style'] = `text-align:center;`;
        dcAttrs['data-noattach'] = true;
        dcAttrs['data-position'] = '0';

        this.#componentsContainer = webDiv;

        topDiv.appendChild(webDiv);


        //drag drop
        topDiv.ondragover = (e) => {
            e.preventDefault();
        };

        topDiv.ondrop = (e) => {
            e.preventDefault();
            let data = HtmlUtils.dataTransferGetData(e);
            if (data && data.for && data.data) {
                if (data.for === 'add-comp') {
                    this.#setCurrentComponent(this.#theForm.addComponent(data.data));
                }
            }
        };

        return topDiv;
    }
}