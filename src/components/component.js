import CommonUtils from '../utils/common-utils.js';
import ErrorHandler from '../utils/error-handler.js';
import Observer from '../base/observer.js';
import HtmlUtils from '../utils/html-utils.js';
import Form from './form.js';
import TextField from '../elements/textfield.js';
import TextArea from '../elements/textarea.js';
import Columns from '../elements/columns.js';
import Container from './container.js';
export default class Component extends Observer {

    //public members
    compMetaData = {};
    containingForm;
    container;
    containerControl;
    inDesignMode;
    attachedControl;
    constructor(containingForm, metaData, observingMethod, inDesignMode) {

        if (!(containingForm instanceof Form)) {
            return ErrorHandler.throwError(ErrorHandler.errorCode.Form.INVALID_INSTANCE);
        }

        if (!(containingForm.container instanceof Container)) {
            return ErrorHandler.throwError(ErrorHandler.errorCode.Form.INVALID_INSTANCE);
        }

        if (!HtmlUtils.isHTMLElement(containingForm.container.control)) {
            return ErrorHandler.throwError(ErrorHandler.errorCode.Form.MISSING_CONTAINER);
        }
        
        super();
        this.containingForm = containingForm;
        this.container = containingForm.container;
        this.containerControl = this.container.control;
        this.compMetaData = metaData || {};

        this.inDesignMode = inDesignMode;
        if (CommonUtils.isJson(this.compMetaData)) {
            this.metaData = this.compMetaData.parse(this.compMetaData);
        }
        if (CommonUtils.isNullOrUndefined(this.compMetaData)) {
            return ErrorHandler.throwError(ErrorHandler.errorCode.Form.MISSING_PROPERTIES);
        }

        if (!HtmlUtils.isElement(this.compMetaData.type)) {
            return ErrorHandler.throwError(ErrorHandler.errorCode.Component.MISSING_TYPE);
        }

        if (!HtmlUtils.isElement(this.compMetaData.name)) {
            return ErrorHandler.throwError(ErrorHandler.errorCode.Component.MISSING_NAME);
        }
        //observer
        if (!(containingForm instanceof Observer)) {
            return ErrorHandler.throwError(ErrorHandler.errorCode.Form.MISING_LISTENER);
        }
        this.attachedControl = Component.getComponentControl(this.compMetaData.type, this);
        this.setObserver(containingForm, observingMethod);
    }

    setAsCurrentComponent() {
        this.#triggerChange('currentComponentChanged', this);
    }

    #triggerChange(event, args) {
        if (this.hasObserver) {
            this.signalObserver(event, args)
        } else {
            console.log('missing observer');
        }
    }
    //invalidProp is a callback with message
    setComponentProperty(type, name, val, invalidProp) {
        this.attachedControl.setComponentProperty(type, name, val, invalidProp);
    }


    getComponentProperty(type, name) {
        return this.attachedControl.getComponentProperty(type, name);
    }

    static getComponentControl(type, containgComponent) {
        switch (type) {
            case 'textfield':
                return new TextField(containgComponent);
            case 'textarea':
                return new TextArea(containgComponent);
            case 'columns':
                return new Columns(containgComponent);;
            default:
                return ErrorHandler.throwError(ErrorHandler.errorCode.Component.INVALID_TYPE);
        }
    }
}