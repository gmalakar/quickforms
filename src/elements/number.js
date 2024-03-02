import BaseControl from '../base/base-control.js';

export default class NumberField extends BaseControl {
    constructor(containingComponent) {
        super(containingComponent, 'Number Field');
        this.buildControl();
    }
}