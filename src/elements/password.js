import BaseElement from '../base/base-element.js';

export default class PasswordField extends BaseElement {
    constructor(containingComponent) {
        super(containingComponent, 'Password Field');
        this.initControl();
        this.buildControl();
    }
}