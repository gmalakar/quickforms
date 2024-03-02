import BaseControl from '../base/base-control.js';
import HtmlUtils from '../utils/html-utils.js';

export default class SelectField extends BaseControl {
    datalist;
    listid;

    constructor(containingComponent) {
        super(containingComponent, 'Select Field');
        this.listid = `list-${this.containingContainer.formName}-${this.name}`;
        this.buildControl();
    }

    setOtherControl() {
        if (this.elementControl) {
            this.elementControl.setAttribute("list", this.listid);
        }
        this.datalist = HtmlUtils.createElement('datalist', this.listid);
        let option = ['set options to select']
        HtmlUtils.populateDatalist(this.datalist, option);
    }

    buildOtherControl() {
        if (this.componentControl) {
            this.componentControl.appendChild(this.datalist);
        }
    }
}