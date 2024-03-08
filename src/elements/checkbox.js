import BaseElement from '../base/base-element.js';

export default class CheckboxField extends BaseElement {
    constructor(containingComponent) {
        super(containingComponent, 'Checkbox Field');
        this.buildControl();
    }
}