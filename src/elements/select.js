import BaseElement from '../base/base-element.js';
import CommonUtils from '../utils/common-utils.js';
import HtmlUtils from '../utils/html-utils.js';

export default class SelectField extends BaseElement {

    slimSelectFilter;
    constructor(containingComponent) {
        super(containingComponent, 'Select Field');
        this.buildControl();
    }

    afterBuild() {
        if (this.elementControl && !this.slimSelectFilter) {
            let option = { 'Set Options': 'S', 'Set Options2': 'S2' }
            HtmlUtils.populateOptions(this.elementControl, option);
            this.slimSelectFilter = new SlimSelect({
                select: this.elementControl
            })
        }
    }
}