import CommonUtils from "../utils/common-utils.js";
import BaseControl from "../base/base-control.js";
import HtmlUtils from "../utils/html-utils.js";
import Container from "../components/container.js";
import ErrorHandler from "../utils/error-handler.js";
export default class Columns extends BaseControl {
    defaultColumnClass = "fb-component-column";
    defaultRowClass = "row fb-component-columns";
    #coulmnPrefix = "";

    constructor(containingComponent) {
        super(containingComponent, "Columns");

        this.#coulmnPrefix = `column-${this.name || ""}`;

        if (!CommonUtils.isObjcetButNotArray(this.columns)) {
            return ErrorHandler.throwError(
                ErrorHandler.errorCode.Component.INVALID_COMPONENT_ARRAY
            );
        } else if (this.designmode && this.#columnLength === 0) {
            for (let i = 0; i < 2; i++) {
                this.addcolumn(i);
            }
        }
        if (this.designmode) {
            this.defaultColumnClass = this.defaultColumnClass + " fb-design-mode";
        }
        this.buildControl();
    }

    getComponentPropertyLocal(type, name, val) {
        if (name === 'col-props') {
            let props = {};
            for (let [key, column] of Object.entries(this.columns)) {
                props[column.index] = {
                    size: column.properties?.size || 'md',
                    width: column.properties?.width || 6,
                    offset: column.offset || 0,
                    push: column.properties?.push || 0,
                    pull: column.properties?.pull || 0
                }
            }
            return JSON.stringify(props);
        } else {
            return val;
        }
    }

    setComponentPropertyLocal(type, name, val) {
        if (name === 'col-props') {

            let props = JSON.parse(val);
            let numCols = Object.keys(props).length;
            //delete
            if (this.#columnLength > numCols && numCols > 2) {
                let colTobeDeleted = [];
                let idx = numCols - 1;
                for (let [key, column] of Object.entries(this.columns)) {
                    if (column.index === idx) {
                        colTobeDeleted[key];
                        idx++;
                    }
                }
                for (let key of colTobeDeleted) {
                    delete this.columns[key];
                }
            }
            else if (numCols > this.#columnLength) {
                for (let i = this.#columnLength - 1; i < numCols; i++) {
                    this.addcolumn(i);
                }
            }
            //set the coulmn values
            for (let [key, column] of Object.entries(this.columns)) {
                let dataRow = props[column.index];
                if (dataRow) {
                    if (!column.hasOwnProperty('properties')) {
                        column['properties'] = {};
                    }
                    column['properties']['size'] = dataRow['size'] || 'md';
                    column['properties']['width'] = dataRow['width'] || 6;
                    column['properties']['offset'] = dataRow['offset'] || 0;
                    column['properties']['pull'] = dataRow['pull'] || 0;
                    column['properties']['push'] = dataRow['push'] || 0;
                }
            }
            this.setOtherControl(true);
        }
    }

    addcolumn(idx) {
        this.columns[`${this.#coulmnPrefix}-${idx}`] = {
            refname: this.containingComponent.name,
            name: `${this.#coulmnPrefix}-${idx}`,
            index: `${idx}`,
            properties: { size: 'md', width: 6, offset: 0, pull: 0, push: 0 }
        };
    }

    get #columnLength() {
        return Object.keys(this.columns).length;
    }

    #buildColumnClass(property) {

        let size = property?.size || 'md';
        let width = property?.width || 6;
        let offset = property?.offset || 0;
        let push = property?.push || 0;
        let pull = property?.pull || 0;
        return `col-${size}-${width} col-${size}-offset-${offset} col-${size}-push-${push} col-${size}-pull-${pull}`;
    }
    setLabelControl() { }

    setElementControl() { }

    setOtherControl(reset) {
        if (this.#columnLength > 0) {
            let parentContainer = this.containingComponent.container;
            //create row
            if (reset && this.columnsControl) {
                HtmlUtils.removeChilds(this.columnsControl);
            }
            if (!reset) {
                this.columnsControl = HtmlUtils.createElement("div", this.#coulmnPrefix, {
                    class: this.defaultRowClass,
                    ref: this.schema.name,
                });
            }
            for (let [name, schema] of Object.entries(this.columns || {})) {
                let cls = this.#buildColumnClass(schema.properties);
                let column = HtmlUtils.createElement("div", name, {
                    class: this.defaultColumnClass + ' ' + cls,
                    ref: this.schema.name,
                });
                let container = new Container(schema, parentContainer.observer, this.containingComponent?.container, this.designmode);
                column.appendChild(container.control);
                this.columnsControl.appendChild(column);
            }
        }
    }
}
