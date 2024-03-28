import CommonUtils from "../utils/common-utils.js";
import BaseElement from "../base/base-element.js";
import HtmlUtils from "../utils/html-utils.js";
import Container from "../components/container.js";
import ErrorHandler from "../utils/error-handler.js";
export default class TableLayout extends BaseElement {
    defaultTableClass = "qf-component-table";
    defaultColumnClass = "qf-component-col";
    defaultRowClass = "col qf-component-row";
    #tablePrefix = "";
    #rowPrefix = "";
    #colPrefix = "";
    rows = {};
    #tablebody;
    constructor(containingComponent) {
        super(containingComponent, "Table");
        this.schema.rows = this.schema.rows || {};
        this.rows = this.schema.rows;
        this.#tablePrefix = `table-${this.name || ""}`;
        this.#rowPrefix = `row-${this.name || ""}`;
        this.#colPrefix = `col-${this.name || ""}`;

        if (!CommonUtils.isObjcetButNotArray(this.rows)) {
            return ErrorHandler.throwError(
                ErrorHandler.errorCode.Component.INVALID_COMPONENT_ARRAY
            );
        } else if (this.designmode && this.#rowLength === 0) {

            //default 3X3
            this.generateTableRows(3, 3);
        }
        if (this.designmode) {
            this.defaultColumnClass = this.defaultColumnClass + " qf-design-mode";
        }
        this.initControl();
        this.buildControl();
    }

    generateTableRows(numrows, numcols) {
        for (let i = 0; i < numrows; i++) {
            let rowid = `${this.#rowPrefix}-${i}`;
            this.rows[rowid] = {
                ref: this.containingComponent.name,
                name: rowid,
                index: `${i}`,
                columns: {}
            };
            for (let j = 0; j < numcols; j++) {
                let colid = `${this.#colPrefix}-${j}`;
                this.rows[rowid].columns[colid] = {
                    ref: rowid,
                    name: colid,
                    index: `${j}`,
                };
            }
        }
    }

    get #rowLength() {
        return Object.keys(this.rows).length;
    }

    setLabelControl() { }

    setElementControl() { }

    setOtherControls(reset) {
        if (this.#rowLength > 0) {
            let parentContainer = this.containingComponent.container;
            //create row
            if (reset && this.otherControl) {
                if (this.#tablebody) {
                    HtmlUtils.removeChilds(this.#tablebody);
                }
                HtmlUtils.removeChilds(this.otherControl);
            }
            if (!reset) {
                let tblattr = {};
                let tcls = this.defaultTableClass;
                let tblCls = this.getSchema('class', 'table')

                if (!CommonUtils.isNullOrEmpty(tblCls)) {
                    tcls = `${tcls} ${tblCls}`;
                }
                tblattr.class = tcls;
                this.setAttrsFromSchema('styles', 'table', tblattr);
                this.setAttrsFromSchema('otherattributes', 'table', tblattr);
                tblattr['ref'] = this.schema.name;

                this.otherControl = HtmlUtils.createElement("table", this.#tablePrefix, tblattr);
                this.#tablebody = HtmlUtils.createElement('tbody', 'noid');
                this.otherControl.appendChild(this.#tablebody);
            }
            let rowattr = {};
            let rcls = this.defaultRowClass;
            let rowCls = this.getSchema('class', 'row')

            if (!CommonUtils.isNullOrEmpty(rowCls)) {
                rcls = `${rcls} ${rowCls}`;
            }
            rowattr.class = rcls;
            this.setAttrsFromSchema('styles', 'row', rowattr);
            this.setAttrsFromSchema('otherattributes', 'row', rowattr);

            for (let [rname, rschema] of Object.entries(this.rows || {})) {
                //create row
                rowattr['ref'] = rschema.ref;
                rowattr['rownum'] = rschema.index;
                let row = HtmlUtils.createElement('tr', rname, rowattr);
                let colattr = {};
                let cls = this.defaultColumnClass;
                let colCls = this.getSchema('class', 'column')

                if (!CommonUtils.isNullOrEmpty(colCls)) {
                    cls = `${cls} ${colCls}`;
                }
                colattr.class = cls;
                this.setAttrsFromSchema('styles', 'column', colattr);
                this.setAttrsFromSchema('otherattributes', 'column', colattr);

                for (let [cname, cschema] of Object.entries(this.rows[rname].columns || {})) {
                    colattr['ref'] = cschema.ref;
                    colattr['rownum'] = cschema.index;
                    let col = HtmlUtils.createElement('td', cname, colattr);
                    let container = new Container(cschema, parentContainer.observer, this.containingComponent, this.designmode);
                    col.appendChild(container.control);
                    row.appendChild(col);
                }
                this.#tablebody.appendChild(row);
            }
        }
    }
}
