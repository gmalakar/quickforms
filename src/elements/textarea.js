import BaseElement from '../base/base-element.js';

export default class TextArea extends BaseElement {
    constructor(containingComponent) {
        super(containingComponent, 'Text Area');
        this.initControl();
        this.buildControl();
    }

    afterBuild() {
        if (this.elementControl && !this.elementControl.hasAttribute('rows')) {
            this.elementControl.setAttribute('rows', 3);
        }
    }
}