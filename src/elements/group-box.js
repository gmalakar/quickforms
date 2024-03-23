import BaseElement from "../base/base-element.js";
import Container from "../components/container.js";
import HtmlUtils from "../utils/html-utils.js";
import ComponentUtils from "../utils/component-utils.js";
export default class GroupBox extends BaseElement {
    panel;
    #container;
    constructor(containingComponent) {
        super(containingComponent, "Group Box");
        if (this.designmode) {
            this.defaultColumnClass = this.defaultColumnClass + " qf-design-mode";
        }
        this.buildControl();
    }
    setLabelControl() {
        let lblAttrs = {};
        lblAttrs.class = `qf-groupbox-legend ${this.getClassSchema('label')}`;

        this.setStyle('lable', lblAttrs);
        this.setAttrs('lable', lblAttrs);
        this.captionControl = HtmlUtils.createElement(ComponentUtils.getLabelType(this.type), "noid", lblAttrs);
        this.setCaption(this.schema.caption);
    }

    setElementControl() {
    }
    setOtherControls() {
        let elAttrs = {};
        elAttrs.class = `border border-1 qf-groupbox ${this.getClassSchema('control')}`;

        this.setStyle('control', elAttrs);
        this.setAttrs('control', elAttrs);
        this.otherControl = HtmlUtils.createElement(
            ComponentUtils.getControlType(this.type),
            'noid',
            elAttrs
        );

        /*         for (let [event, fn] of Object.entries(this.eventlisteners)) {
                    this.otherControl.addEventListener(event, fn());
                } */

        let parentContainer = this.containingComponent.container;
        this.#container = new Container(this.schema, parentContainer.observer, this.containingComponent, this.designmode);
    }

    setControls() {
        if (this.otherControl) {
            if (this.captionControl) {
                this.otherControl.appendChild(this.captionControl);
            }
            if (this.#container) {
                this.otherControl.appendChild(this.#container.control);
            }
            this.componentControl.appendChild(this.otherControl);
        }
        this.containerControl.appendChild(this.componentControl);
    }
}