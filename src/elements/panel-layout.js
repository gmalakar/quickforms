import BaseElement from "../base/base-element.js";
import Panel from "../utils/panel.js";
import Container from "../components/container.js";
export default class PanelLayout extends BaseElement {
    panel;
    #container;
    constructor(containingComponent) {
        super(containingComponent, "Panel");
        if (this.designmode) {
            this.defaultColumnClass = this.defaultColumnClass + " fb-design-mode";
        }
        this.buildControl();
    }

    setCaption(value) {
        this.schema.caption = value;
        if (this.panel) {
            this.panel.setCaption(value);
        }
    }
    setLabelControl() { }

    setElementControl() { }

    setOtherControls(reset) {
        let parentContainer = this.containingComponent.container;
        this.panel = new Panel(this.name, "Panel")
        this.panel.setPanelClass(['p-0']);

        this.otherControl = this.panel.panel;
        this.#container = new Container(this.schema, parentContainer.observer, this.containingComponent, this.designmode);
        this.panel.body.appendChild(this.#container.control);
        this.setCaption(this.schema.caption);
    }
}