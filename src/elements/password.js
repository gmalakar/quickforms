import BaseControl from '../base/base-control.js';

export default class PasswordField extends BaseControl {
    constructor(containingComponent) {
        super(containingComponent, 'Password Field');
        this.buildControl();
    }
}