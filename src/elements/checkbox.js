import BaseControl from '../base/base-control.js';

export default class CheckboxField extends BaseControl {
    constructor(containingComponent) {
        super(containingComponent, 'Checkbox Field');
        this.buildControl();
    }
}