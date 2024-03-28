import BaseElement from '../base/base-element.js';

export default class ButtonField extends BaseElement {
    constructor(containingComponent) {
        super(containingComponent, 'Button');
        this.initControl();
        this.buildControl();
    }
    //btn btn-primary btn-md
    initControl() {
        if (!this.getSchema('class', 'control')) {
            this.setSchema('class', 'control', 'btn-primary btn-md');
        }
    }
    setLabelControl() { }

    setCaption(value) {
        this.schema.caption = value;
        if (this.elementControl) {
            this.elementControl.textContent = this.caption;
        }
    }

    setOtherControls() {
        if (this.elementControl) {
            this.elementControl.textContent = this.schema.caption;
        }
    }
}