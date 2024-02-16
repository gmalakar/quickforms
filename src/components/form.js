import CommonUtils from '../utils/common-utils.js';
import ErrorHandler from '../utils/error-handler.js';
import HtmlUtils from '../utils/html-utils.js';
import Observer from '../base/observer.js';
import Component from './component.js';
export default class Form extends Observer {

    //public members

    #metaData;
    #compContainer;
    currentComponent;


    constructor(compContainer, metaData, observer, observingMethod) {

        if (CommonUtils.isNullOrUndefined(compContainer) || !HtmlUtils.isHTMLElement(compContainer)) {
            return ErrorHandler.throwError(ErrorHandler.errorCode.Builder.MISSING_PLACEHOLDER);
        }

        super();

        this.#metaData = metaData || {};
        if (CommonUtils.isJson(this.#metaData)) {
            this.#metaData = this.json.parse(this.#metaData);
        }
        if (CommonUtils.isNullOrEmpty(this.#metaData.formName)) {
            return ErrorHandler.throwError(ErrorHandler.errorCode.Form.MISSING_NAME);
        }

        this.components = {};
        for (let [name, comp] of Object.entries(this.#metaData['components'] || {})) {
            this.components[name] = new Component( this.name, compContainer, comp, this, this.#observingMethod, true)
        }
        this.#compContainer = compContainer;
        this.setObserver(observer, observingMethod);
    }

    get name() {
        return this.#metaData.formName;
    }
   
    get metaData() {
        return this.#metaData;
    }

    #observingMethod(observer, event, args) {
        //here this means callee
        if (observer.constructor === Form) {
            switch (event) {
                case 'currentComponentChanged':
                    observer.currentComponent = args;
                    break;
                default:
                    break;
            }
            if (observer.hasObserver) {
                observer.signalObserver(event, args);
            }
        }
    }
    
    #generateName(type) {
        let names = this.componentNames;
        let l = type.length;
        let curIdx = (names.map((v) => {
            let idx = 0;
            if (v.length > l) {
                idx = v.slice(l).trimStart();
                if (isNaN(idx))
                    idx = 0;
            }
            return idx;
        }));
        if (curIdx && curIdx.length > 0)
            return `${type}${Math.max.apply(Math, curIdx) + 1}`;
        else
            return `${type}1`;
    }

    get componentNames() {
        return Object.keys(this.components);
    }


    removeComponent(component) {
        if (component && component.fbComponent) {
            if (this.#compContainer.hasChildNodes()) {
                let compToSelect;
                let next = component.fbComponent.nextSibling;
                if (!next) {
                    next = component.fbComponent.previousSibling;
                }
                if (next) {
                    compToSelect = next.getAttribute('ref');
                }
                this.#compContainer.removeChild(component.fbComponent);
                if (this.components.hasOwnProperty(component.name)) {
                    delete this.components[component.name];
                }
                if (compToSelect && this.components.hasOwnProperty(compToSelect)) {
                    this.components[compToSelect].fbComponent.focus();
                }
            }
        }
    }

    addComponent(type) {
        if (CommonUtils.isNullOrEmpty(type)) {
            return ErrorHandler.throwError(ErrorHandler.errorCode.Component.MISSING_TYPE);
        }
        let component = {};
        component.name = this.#generateName(type);
        component.type = type;
        let newComponent = new Component(  this.name, this.#compContainer, component, this, this.#observingMethod, true);
        this.components[component.name] = newComponent;
        this.currentComponent = newComponent;
        return newComponent;
    }
}
