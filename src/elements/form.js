import BaseControl from "../base/base-control.js";
export default class Form extends BaseControl {

    constructor(containingComponent) {
        super(containingComponent, "From");

        if (this.designmode) {
            this.defaultColumnClass = this.defaultColumnClass + " qf-design-mode";
        }
        this.buildControl();
    }
    setLabelControl() { }

    setElementControl() { }
}