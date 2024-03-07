import BaseControl from '../base/base-control.js';

export default class ButtonField extends BaseControl {
    constructor(containingComponent) {
        super(containingComponent, 'Button');
        this.buildControl();
    }
    //btn btn-primary btn-md
    initControl() {
        if (!this.getClassSchema('element')) {
            this.setClassSchema('element', 'btn-primary btn-md');
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