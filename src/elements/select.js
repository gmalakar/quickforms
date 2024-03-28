import BaseElement from '../base/base-element.js';
import CommonUtils from '../utils/common-utils.js';
import HtmlUtils from '../utils/html-utils.js';

export default class SelectField extends BaseElement {

    slimSelectFilter;
    constructor(containingComponent) {
        super(containingComponent, 'Select Field');
        this.initControl();
        this.buildControl();
    }

    afterBuild() {
        this.#setSlimSelect();
    }

    #setSlimSelect() {
        if (this.elementControl) {
            if (this.slimSelectFilter) {
                this.slimSelectFilter.destroy();
                this.slimSelectFilter = null;
            }
            HtmlUtils.clearOptions(this.elementControl);
            //TODO
            let option = { 'S': 'Set Options', 'S2': 'Set Options2' }
            HtmlUtils.populateOptions(this.elementControl, option);
            this.slimSelectFilter = new SlimSelect({
                select: this.elementControl
            })
        }
    }

    resetControl(name) {
        let ctrl = this.getControl(name);
        //reset slim select
        if (ctrl && ctrl === this.elementControl) {
            this.#setSlimSelect();
        }
    }
}