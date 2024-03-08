import BaseElement from '../base/base-element.js';

export default class NumberField extends BaseElement {
    constructor(containingComponent) {
        super(containingComponent, 'Number Field');
        this.buildControl();
    }
}