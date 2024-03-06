import BaseControl from "../base/base-control.js";
import PanelControl from "../utils/panel-control.js";
import Container from "../components/container.js";
export default class Panel extends BaseControl {
    panel;
    #container;
    constructor(containingComponent) {
        super(containingComponent, "Panel");
        if (this.designmode) {
            this.defaultColumnClass = this.defaultColumnClass + " fb-design-mode";
        }
        this.buildControl();
    }
    setLabelControl() { }

    setElementControl() { }

    setOtherControls(reset) {
        let parentContainer = this.containingComponent.container;
        this.panel = new PanelControl(this.name, "Panel")
        this.otherControl = this.panel.body;
        this.#container = new Container(this.schema, parentContainer.observer, this.containingComponent?.container, this.designmode);
        this.otherControl.appendChild(this.#container.control);
    }
}