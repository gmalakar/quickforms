import BaseControl from '../base/base-control.js';

export default class TextField extends BaseControl {
    constructor(containingComponent) {
        super(containingComponent, 'Text Field');
        this.buildControl();
    }
}