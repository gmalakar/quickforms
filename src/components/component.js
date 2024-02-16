import CommonUtils from '../utils/common-utils.js';
import ErrorHandler from '../utils/error-handler.js';
import Observer from '../base/observer.js';
import HtmlUtils from '../utils/html-utils.js';
import Form from './form.js';
import TestField from '../elements/textfield.js';
export default class Component extends Observer {

    //public members
    compMetaData = {};
    container;
    containingForm;
    inDesignMode;
    attachedControl;
    constructor(containingForm, metaData, observingMethod, inDesignMode ) {

        if (!(containingForm instanceof Form)) {
            return ErrorHandler.throwError(ErrorHandler.errorCode.Form.INVALID_INSTANCE);
        }
        if (!HtmlUtils.isHTMLElement(containingForm.compContainer)) {
            return ErrorHandler.throwError(ErrorHandler.errorCode.Form.MISSING_CONTAINER);
        }

        super();
        this.containingForm = containingForm;
        this.container = containingForm.compContainer;
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
        this.attachedControl = new TestField(this);
        this.setObserver(containingForm, observingMethod);
    }

    setAsCurrentComponent(){
        this.#triggerChange('currentComponentChanged', this );
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
        this.attachedControl.setComponentProperty(type, name, val, invalidProp );
    }


    getComponentProperty(type, name) {
        return this.attachedControl.getComponentProperty(type, name );
    }
/*     build() {
        let compId = this.name;
        let topCls = 'm-2 col-md-6 fb-form-component';
        let divId = `comp-${compId}`;

        this.fbComponent = HtmlUtils.createElement('div', divId, { class: topCls, tabindex: -1, draggable: true, ref: compId });
        // Label field
        let lblProps = {
            for: compId,
            class: 'form-label fb-form-label'
        }

        this.labelControl = HtmlUtils.createElement('label', 'noid', lblProps);

        if (CommonUtils.isNullOrEmpty(this.label)) {
            this.label = Component.#getNewLabel(this.name);
        }

        this.labelControl.textContent = this.label;

        //set class
        //default class
        let cls = 'form-control fb-form-control'
        //default attributes
        let compProps = {
            type: Component.getType(this.type),
            placeholder: this.placeholder || ''
        }
        //set attribute
        for (let [key, attr] of Object.entries(this.attributes)) {
            switch (key.toLowerCase()) {
                case 'class':
                    cls = `${cls} ${attr}`;
                    break;
                default:
                    compProps[key] = attr;
                    break;
            }
        }
        compProps['class'] = cls;

        //set style
        let style = Component.#joinStyles(this.styles);
        compProps['style'] = style;

        let controlId = `${this.containingForm.name}[${compId}]`;
        this.elementControl = HtmlUtils.createElement(Component.getControlType(this.type), controlId, compProps);

        for (let [event, fn] of Object.entries(this.eventlisteners)) {
            this.elementControl.addEventListener(event, fn())
        }

        this.fbComponent.appendChild(this.labelControl);

        this.fbComponent.appendChild(this.elementControl);

        this.fbComponent.addEventListener('focus', () => {
            this.#triggerChange('currentComponentChanged', this);
        })

        this.elementControl.addEventListener('focus', () => {
            this.#triggerChange('currentComponentChanged', this);
        })

        this.fbComponent.addEventListener('mouseover', () => {
            document.body.style.cursor = 'all-scroll';
        })

        this.fbComponent.addEventListener('mouseout', () => {
            document.body.style.cursor = 'auto';
        })
        this.fbComponent.addEventListener('dragstart', (e) => {
            HtmlUtils.dataTransferSetData(e, 'move', divId);
        })
        this.fbComponent.addEventListener('drop', (e) => {
            e.preventDefault();
            let data = HtmlUtils.dataTransferGetData(e);
            if (data && data.for && data.data && data.for === 'move' && data.data !== e.target.id) {
                let up = (data.y - e.y || pageY) > 0;
                let draggedComponent = document.getElementById(data.data);

                if (this.container.hasChildNodes()) {
                    this.container.removeChild(draggedComponent);
                }

                if (up) {//find the top component
                    this.container.insertBefore(draggedComponent, this.fbComponent);
                } else {//find the below component
                    let nextComponent = this.fbComponent.nextSibling;
                    if (nextComponent) {
                        this.container.insertBefore(draggedComponent, nextComponent);
                    } else {
                        this.container.appendChild(draggedComponent);
                    }
                }
            }
        })
        this.container.appendChild(this.fbComponent);
        return this.fbComponent;
    } */
}