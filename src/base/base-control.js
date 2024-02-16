import CommonUtils from '../utils/common-utils.js';
import HtmlUtils from '../utils/html-utils.js';
import ComponentUtils from '../utils/comp-utils.js';
export default class BaseControl {

    captionControl;

    componentControl;

    elementControl;

    componentClass = 'm-2 col-md-6 fb-form-component';

    labelClass = 'form-label fb-form-label';

    elementClass = 'form-control fb-form-control';

    containingComponent;

    compMetaData = {};

    defaultCaptionn;

    #compControlId;

    constructor(containingComponent, defaultCaption ='Base Element') {
        if (this.constructor === BaseControl) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.defaultCaptionn = defaultCaption;
        this.containingComponent = containingComponent;
        this.compMetaData = containingComponent.compMetaData || {};
        this.#compControlId  = `comp-${this.name}`
        this.buildControl();
    }

    get containingForm() {
        return this.containingComponent.containingForm;
    };

    get container() {
        return this.containingComponent.container;
    };

    get caption() {
        return this.compMetaData.caption || '';
    }

    set caption(value) {
        this.compMetaData.caption = value;
        if (this.captionControl) {
            this.captionControl.textContent = value;
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
        this.compMetaData.placeholder || '';
    }

    set placeholder(value) {
        this.compMetaData.placeholder = value;
        if (this.elementControl) {
            this.elementControl.setAttribute('placeholder', value);
        }
    }

    get styles() {
        return this.compMetaData.styles || {};
    }

    setStyle(key, value) {
        if (this.compMetaData.styles === undefined) {
            this.compMetaData.styles = {};
        }
        this.compMetaData.styles[key] = value;
        if (this.elementControl) {
            this.elementControl.setAttribute('style', HtmlUtils.joinStyles(value));
        }
    }

    getStyle(key) {
        let val = '';
        if (this.styles[key] !== undefined) {
            val = this.styles[key];
        }
    }

    get properties() {
        return this.compMetaData.properties || {};
    }

    setProperty(key, value) {
        if (this.compMetaData.properties === undefined) {
            this.compMetaData.properties = {};
        }
        this.compMetaData.properties[key] = value;

    }

    getProperty(key) {
        let val = '';
        if (this.properties[key] !== undefined) {
            val = this.propertiess[key];
        }
    }

    get attributes() {
        return this.compMetaData.attributes || {};
    }

    setAttribute(key, value) {
        if (this.compMetaData.attributes === undefined) {
            this.compMetaData.attributes = {};
        }
        this.compMetaData.attributes[key] = value;
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
        return this.compMetaData.type || null;
    }

    get name() {
        return this.compMetaData.name || null;
    }

    set name(value) {
        let oldName = this.compMetaData.name;
        this.compMetaData.name = value;
        if (this.elementControl) {
            value = `${this.containingForm.name}[${value}]`;
            this.elementControl.name = value;
            this.elementControl.id = value;
        }
        if (this.captionControl) {
            this.captionControl.for = value;
        }
        //delete old and add new
        delete this.containingForm.componentNames[oldName];
        this.containingForm.componentNames[this.name] = this;
    }

    get eventlisteners() {
        return this.compMetaData.eventlisteners || {};
    };

    #checkIfUsedByOtherComponent(newname) {
        let component = this.containingForm.components[newname];
        return component && component != this;
    }

    //invalidProp is a callback with message
    setComponentProperty(type, name, val, invalidProp) {
        let invalidMsg = '';
        switch (name) {
            case 'name':
                if (this.compMetaData.name !== val) { //changed
                    if (!HtmlUtils.isValidName(val)) {
                        invalidMsg = ErrorHandler.errorCode.Component.INVALID_NAME;
                    }
                    else if (this.#checkIfUsedByOtherComponent(val)) {
                        invalidMsg = ErrorHandler.errorCode.Component.USED_NAME;
                    } else {
                        this.name = val;
                    }
                }
                break;
            case 'caption':
                this.caption = val;
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

        if (!CommonUtils.isNullOrEmpty(invalidProp)) {
            invalidProp(invalidMsg);
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

    setCompControl() {
        this.componentControl = HtmlUtils.createElement('div', this.#compControlId, { class: this.componentClass, tabindex: -1, draggable: true, ref: this.name });
    }

    setLabelControl() {
        let lblProps = {
            for: this.name,
            class: this.labelClass
        }

        this.captionControl = HtmlUtils.createElement('label', 'noid', lblProps);
        if( CommonUtils.isNullOrEmpty(this.compMetaData.caption)){
            this.caption = this.defaultCaptionn;
        }else{
            this.caption = this.compMetaData.caption;
        }
    }

    setElementControl() {
        //set class
        //default class
        let cls = this.elementClass;
        //default attributes
        let compProps = {
            type: ComponentUtils.getType(this.type),
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
        let style = HtmlUtils.joinStyles(this.styles);

        compProps['style'] = style;

        let controlId = `${this.containingForm.name}[${this.name}]`;

        this.elementControl = HtmlUtils.createElement(ComponentUtils.getControlType(this.type), controlId, compProps);

        for (let [event, fn] of Object.entries(this.eventlisteners)) {
            this.elementControl.addEventListener(event, fn())
        }

    }

    setDesignMode() {
        if (this.containingComponent.inDesignMode) {

            this.componentControl.addEventListener('focus', () => {
                this.containingComponent.setAsCurrentComponent();
            })

            this.elementControl.addEventListener('focus', () => {
                this.containingComponent.setAsCurrentComponent();
            })

            this.componentControl.addEventListener('mouseover', () => {
                document.body.style.cursor = 'all-scroll';
            })

            this.componentControl.addEventListener('mouseout', () => {
                document.body.style.cursor = 'auto';
            })
            this.componentControl.addEventListener('dragstart', (e) => {
                HtmlUtils.dataTransferSetData(e, 'move', this.#compControlId);
            })
            //drag & drop
            this.componentControl.addEventListener('drop', (e) => {
                e.preventDefault();
                let data = HtmlUtils.dataTransferGetData(e);
                if (data && data.for && data.data && data.for === 'move' && data.data !== e.target.id) {
                    let up = (data.y - e.y || pageY) > 0;
                    let draggedComponent = document.getElementById(data.data);

                    if (this.container.hasChildNodes()) {
                        this.container.removeChild(draggedComponent);
                    }

                    if (up) {//find the top component
                        this.container.insertBefore(draggedComponent, this.componentControl);
                    } else {//find the below component
                        let nextComponent = this.componentControl.nextSibling;
                        if (nextComponent) {
                            this.container.insertBefore(draggedComponent, nextComponent);
                        } else {
                            this.container.appendChild(draggedComponent);
                        }
                    }
                }
            })
        }
    }
    buildControl() {

        this.setCompControl();

        this.setLabelControl();

        this.setElementControl();

        this.componentControl.appendChild(this.captionControl);

        this.componentControl.appendChild(this.elementControl);

        this.setDesignMode();

        this.container.appendChild(this.componentControl);
    }
}