import BaseElement from '../base/base-element.js';

export default class PhoneNumberField extends BaseElement {
    constructor(containingComponent) {
        super(containingComponent, 'Phone Number');
        this.initialize();
        this.initControl();
        this.buildControl();
    }
    initialize() {
        this.defaultPlacehHolder = '(___) ___-____';
        this.defaultMask = '(999) 999-9999';
    }
}