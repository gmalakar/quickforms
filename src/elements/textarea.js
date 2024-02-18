import BaseControl from '../base/base-control.js';

export default class TextArea extends BaseControl {
    constructor(containingComponent) {
        super(containingComponent, 'Text Area');
        this.buildControl();
    }
}