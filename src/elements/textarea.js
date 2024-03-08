import BaseElement from '../base/base-element.js';

export default class TextArea extends BaseElement {
    constructor(containingComponent) {
        super(containingComponent, 'Text Area');
        this.buildControl();
    }
}