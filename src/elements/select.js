import BaseControl from '../base/base-control.js';
import CommonUtils from '../utils/common-utils.js';
import HtmlUtils from '../utils/html-utils.js';

export default class SelectField extends BaseControl {

    slimSelectFilter;
    constructor(containingComponent) {
        super(containingComponent, 'Select Field');
        this.buildControl();
    }

    setOtherControls() {
    }

    buildOtherControls() {
        if (this.elementControl) {
            let option = { 'Set Options': 'S', 'Set Options2': 'S2' }
            HtmlUtils.populateOptions(this.elementControl, option);
            this.slimSelectFilter = new SlimSelect({
                select: this.elementControl
            })
        }
    }
}