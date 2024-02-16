import CommonUtils from '../utils/common-utils.js';
import ErrorHandler from '../utils/error-handler.js';
import Observer from '../base/observer.js';
import HtmlUtils from '../utils/html-utils.js';
export default class Component extends Observer {

    //public members
    fbComponent;
    elementControl;
    labelControl;
    metaData = {};
    container;

    constructor(container, metaData, observer, observingMethod, build) {

        if (!HtmlUtils.isHTMLElement(container)) {
            return ErrorHandler.throwError(ErrorHandler.errorCode.Form.MISSING_CONTAINER);
        }
        super();
        this.container = container;
        this.metaData = metaData || {};
        if (CommonUtils.isJson(this.metaData)) {
            this.metaData = this.metaData.parse(this.metaData);
        }
        if (CommonUtils.isNullOrUndefined(this.metaData)) {
            return ErrorHandler.throwError(ErrorHandler.errorCode.Form.MISSING_PROPERTIES);
        }

        if (!HtmlUtils.isElement(this.metaData.type)) {
            return ErrorHandler.throwError(ErrorHandler.errorCode.Component.MISSING_TYPE);
        }

        if (!HtmlUtils.isElement(this.metaData.name)) {
            return ErrorHandler.throwError(ErrorHandler.errorCode.Component.MISSING_NAME);
        }
        //observer
        if (!(observer instanceof Observer)) {
            return ErrorHandler.throwError(ErrorHandler.errorCode.Form.MISING_LISTENER);
        }
        this.setObserver(observer, observingMethod);
        if (build) {
            this.build();
        }
    }

    #triggerChange(event, args) {
        if (this.hasObserver) {
            this.signalObserver(event, args)
        } else {
            console.log('missing observer');
        }
    }

    get label() {
        return this.metaData.label || '';
    }

    set label(value) {
        this.metaData.label = value;
        if (this.labelControl) {
            this.labelControl.textContent = value;
        }
    }

    get value() {
        if (this.elementControl) {
            return this.elementControl.value;
        } else {
            return '';
        }
    }

    set value(value) {
        if (this.elementControl) {
            this.elementControl.value = value;
        }
    }

    get placeholder() {
        this.metaData.placeholder || '';
    }

    set placeholder(value) {
        this.metaData.placeholder = value;
        if (this.elementControl) {
            this.elementControl.setAttribute('placeholder', value);
        }
    }

    get styles() {
        return this.metaData.styles || {};
    }

    setStyle(key, value) {
        if (this.metaData.styles === undefined) {
            this.metaData.styles = {};
        }
        this.metaData.styles[key] = value;
        if (this.elementControl) {
            this.elementControl.setAttribute('style', Component.#joinStyles(this.styles));
        }
    }

    getStyle(key) {
        let val = '';
        if (this.styles[key] !== undefined) {
            val = this.styles[key];
        }
    }

    get properties() {
        return this.metaData.properties || {};
    }

    setProperty(key, value) {
        if (this.metaData.properties === undefined) {
            this.metaData.properties = {};
        }
        this.metaData.properties[key] = value;

    }

    getProperty(key) {
        let val = '';
        if (this.properties[key] !== undefined) {
            val = this.propertiess[key];
        }
    }


    get attributes() {
        return this.metaData.attributes || {};
    }

    setAttribute(key, value) {
        if (this.metaData.attributes === undefined) {
            this.metaData.attributes = {};
        }
        this.metaData.attributes[key] = value;
        if (this.elementControl) {
            this.elementControl.setAttribute(key, value);
        }
    }


    getAttribute(key) {
        let val = '';
        if (this.attributes[key] !== undefined) {
            val = this.attributes[key];
        }
        return val;
    }

    get type() {
        return this.metaData.type || null;
    }

    get name() {
        return this.metaData.name || null;
    }

    set name(value) {
        this.metaData.name = value;
        if (this.elementControl) {
            this.elementControl.name = value;
            this.elementControl.id = value;
        }
        if (this.labelControl) {
            this.label.for = value;
        }
    }

    get eventlisteners() {
        return this.metaData.eventlisteners || {};
    };

    static getType(type) {
        switch (type) {
            case 'textfield':
                return 'text';
            default:
                return ErrorHandler.throwError(ErrorHandler.errorCode.Component.INVALID_TYPE);
        }
    }

    static getControlType(type) {
        switch (type) {
            case 'textfield':
                return 'input';
            default:
                return ErrorHandler.throwError(ErrorHandler.errorCode.Component.INVALID_TYPE);
        }
    }

    setComponentProperty(type, name, val) {
        switch (name) {
            case 'name':
                this.name = val;
                break;
            case 'label':
                this.label = val;
                break;
            default:
                switch (type) {
                    case 'attribute':
                    case 'attr':
                        this.setAttribute(name, val);
                        break;
                    case 'style':
                        this.setStyle(name, val);
                        break;
                    case 'prop':
                    case 'property':
                        this.setProperty(name, val);
                        break;
                    default:
                        this[name] = val;
                        break;
                }
                break;
        }
    }


    getComponentProperty(type, name) {
        let val = '';
        switch (type) {
            case 'attribute':
            case 'attr':
                val = this.getAttribute(name);
                break;
            case 'style':
                val = this.getStyle(name);
                break;
            case 'prop':
            case 'property':
                this.getProperty(name);
                break;
            default:
                val = this[name];
                break;
        }
        return val;
    }

    static #getNewLabel(compid) {
        return `TODO - ${compid}`;
    }

    static #joinStyles(styles) {
        let style = '';
        if (CommonUtils.isObjcetButNotArray(styles)) {
            for (let [key, val] of Object.entries(styles)) {
                style = `${style}${key}:${val};`;
            }
        }
        return style;
    }
    build() {
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

        let controlId = `${this.formName}[${compId}]`;
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
    }
}