import CommonUtils from "../utils/common-utils.js";
import BaseControl from "../base/base-control.js";
import HtmlUtils from "../utils/html-utils.js";
import Container from "../components/container.js";
import ErrorHandler from "../utils/error-handler.js";
export default class Columns extends BaseControl {
    defaultColumnClass =
        "col-md-6 col-md-offset-0 col-md-push-0 col-md-pull-0 fb-component-column";
    defaultRowClass = "row fb-component-columns";
    #coulmnPrefix = "";

    constructor(containingComponent) {
        super(containingComponent, "Columns");

        this.#coulmnPrefix = `column-${this.name || ""}`;

        if (!CommonUtils.isObjcetButNotArray(this.columns)) {
            return ErrorHandler.throwError(
                ErrorHandler.errorCode.Component.INVALID_COMPONENT_ARRAY
            );
        } else this.inDesignMode && this.#columnLength === 0;
        {
            //add default blank components
            this.columns[`${this.#coulmnPrefix}-${0}`] = {
                refname: containingComponent.name,
                name: `${this.#coulmnPrefix}-${0}`,
            };

            this.columns[`${this.#coulmnPrefix}-${1}`] = {
                refname: containingComponent.name,
                name: `${this.#coulmnPrefix}-${1}`,
            };
        }
        if (this.inDesignMode) {
            this.defaultColumnClass = this.defaultColumnClass + " fb-design-mode";
        }
        this.buildControl();
    }

    get #columnLength() {
        return Object.keys(this.columns).length;
    }
    setLabelControl() { }
    setColumnsControl() {
        if (this.#columnLength > 0) {
            let parentContainer = this.containingComponent.container;
            //create row
            this.columnsControl = HtmlUtils.createElement("div", this.#coulmnPrefix, {
                class: this.defaultRowClass,
                ref: this.compMetaData.name,
            });
            for (let [name, metaData] of Object.entries(this.columns || {})) {
                let column = HtmlUtils.createElement("div", name, {
                    class: this.defaultColumnClass,
                    ref: this.compMetaData.name,
                });
                let container = new Container(
                    parentContainer.formName,
                    metaData,
                    parentContainer.observer,
                    parentContainer.observingMethod,
                    this.containingComponent,
                    this.inDesignMode
                );
                column.appendChild(container.control);
                this.columnsControl.appendChild(column);
            }
        }
    }
}
