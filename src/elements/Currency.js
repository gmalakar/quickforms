import BaseElement from '../base/base-element.js';
import CommonUtils from '../utils/common-utils.js';

export default class CurrencyField extends BaseElement {
    constructor(containingComponent) {
        super(containingComponent, 'Currency');
        this.initialize();
        this.initControl();
        this.buildControl();
    }
    initialize() {
        this.defaultMask = '$[0-9.,]*';
    }
}