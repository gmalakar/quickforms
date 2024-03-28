import BaseElement from '../base/base-element.js';

export default class TextField extends BaseElement {
    constructor(containingComponent) {
        super(containingComponent, 'Text Field');
        this.initControl();
        this.buildControl();
    }
}