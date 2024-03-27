import HtmlUtils from './html-utils.js';
import CommonUtils from './common-utils.js';
import ScriptEditor from '../editors/script-editor.js';

export default class Table {
    metadata;
    row;
    column = [];
    columns;
    tablename;
    initRowCount = 0;
    tableHeader;
    tableBody;
    headerRow;
    rows = {};
    #table;
    rowheader = false;
    headerdesc = '#';
    headerprefix = ''
    #tablecls = 'qf-table table ';
    #tdcls = 'qf-table-cell';
    #trcls = 'qf-table-row';
    #hdrcls = 'qf-table-header';
    footer = {};
    tablefooter;
    data = {};

    constructor(metadata) {

        if (CommonUtils.isJson(metadata)) {
            metadata = CommonUtils.jsonToObject(metadata);
        }
        if ((!CommonUtils.isObjcetButNotArray(metadata))) {
            throw new Error('Invalid table metadata');
        }

        this.metadata = metadata;

        if (!this.metadata.hasOwnProperty('name')) {
            throw new Error('missing table name');
        }

        if (this.metadata.hasOwnProperty('class')) {
            this.#tablecls = `${this.#tablecls} ${this.metadata['class']}`;
        }

        if (this.metadata.hasOwnProperty('headerclass')) {
            this.#hdrcls = `${this.#hdrcls} ${this.metadata['headerclass']}`;
        }

        this.tablename = this.metadata['name'];
        this.row = metadata['row'];

        if (!CommonUtils.isObjcetButNotArray(metadata['column'])) {
            throw new Error('Invalid column metadata');
        }

        this.column = metadata['column'];

        if (this.column.hasOwnProperty('columns') && CommonUtils.isArray(this.column['columns'])) {
            this.columns = this.column['columns'];
        }

        if (this.column.hasOwnProperty('class')) {
            this.#tdcls = `${this.#tdcls} ${this.column['class']}`;
        }

        if (this.column.length <= 0) {
            throw new Error('Invalid columns specification');
        }

        //intitial row count
        if (this.row.hasOwnProperty('rowcount') && Number.isInteger(this.row['rowcount'])) {
            this.initRowCount = this.row['rowcount'];
        }

        if (this.row.hasOwnProperty('rowheader') && CommonUtils.isBoolean(this.row['rowheader'])) {
            this.rowheader = this.row['rowheader'];
        }

        if (this.row.hasOwnProperty('desc')) {
            this.headerdesc = this.row['desc'];
        }

        if (this.row.hasOwnProperty('prefix')) {
            this.headerprefix = this.row['prefix'];
        }

        if (this.row.hasOwnProperty('class')) {
            this.#trcls = `${this.#trcls} ${this.row['class']}`;
        }

        if (this.metadata.hasOwnProperty('footer')) {
            if (!CommonUtils.isObjcetButNotArray(metadata['footer'])) {
                throw new Error('Invalid footer metadata');
            }
            this.footer = this.metadata['footer'];
        }

        if (this.metadata.hasOwnProperty('data')) {
            if (CommonUtils.isObjcetButNotArray(metadata['data'])) {
                this.data = this.metadata['data'];
            }
        }
    }

    get table() {
        if (!this.#table) {
            this.#table = HtmlUtils.createElement('table', this.tablename, { class: this.#tablecls });
            this.createHeader();
            this.createBody();
            this.createFooter();
            this.#table.appendChild(this.tableHeader);
            this.#table.appendChild(this.tableBody);

            if (this.tablefooter) {
                this.#table.appendChild(this.tablefooter);
            }
        }
        return this.#table;
    }

    get tableHeaderName() {
        return `header-${this.tablename}`;
    }

    get tableFooterName() {
        return `footer-${this.tablename}`;
    }

    get bodyName() {
        return `body-${this.tablename}`;
    }

    get headerRowName() {
        return `header-row-${this.tablename}`;
    }

    get footerRowName() {
        return `footer-row-${this.tablename}`;
    }

    get rowPrefix() {
        return `row-${this.tablename}`;
    }

    get columnPrefix() {
        return `col-${this.tablename}`;
    }

    get ColumnPrefix() {

        return `header-th-${this.tablename}`;
    }

    headerColumnName(idx) {
        return `${this.ColumnPrefix}-${idx}`;
    }

    headerRowName(r) {
        return `${this.ColumnPrefix}-rownum-${r}`;
    }

    footerRowName(idx) {
        return `footer-rownum-${idx}`;
    }

    rowName(r) {
        return `${this.rowPrefix}-${r}`;
    }

    cellName(r, c) {
        return `${this.columnPrefix}-${r}-${c}`;
    }

    editControlName(r, c) {
        return `edit-${this.cellName(r, c)}`;
    }

    btnControlName(r, c) {
        return `btn-${this.cellName(r, c)}`;
    }

    appendRow() {
        let row = this.createRow(this.rowCount);
        this.tableBody.appendChild(row);
    }

    appendColumn(colInfo) {
        if (!CommonUtils.isObjcetButNotArray(colInfo)) {
            throw new Error('Invalid column properties');
        }
        if (CommonUtils.isJson(colInfo)) {
            colInfo = CommonUtils.jsonToObject(colInfo);
        }
        let colCount = this.columns.length;
        //add to columns
        this.columns.push(colInfo);
        let th = HtmlUtils.createElement('th', this.headerColumnName(colCount), { scope: 'col' });
        if (colInfo.hasOwnProperty('header')) {
            th.innerHTML = colInfo['header'];
        }
        this.headerRow.appendChild(th);
        for (let r = 0; r < this.rowCount; r++) //create rows
        {
            let row = this.getRow(r);
            row.appendChild(this.createColumn(r, colCount));
        }
    }

    getCell(r, c) {
        return document.getElementById(this.cellName(r, c));
    }

    setCellContent(cell, val) {
        if (cell) {
            if (CommonUtils.isString(val)) {
                cell.innerHTML = val;
            }
            else if (HtmlUtils.isHTMLElement(val)) {
                cell.innerHTML = '';
                cell.appendChild(val);
            }
        }
    }

    #updateData(r, datafield, val) {
        if (!this.data.hasOwnProperty(r)) {
            this.data[r] = {};
        }
        this.data[r][datafield] = val;
    }

    #getData(r, datafield, dafault) {
        let val = '';
        if (this.data.hasOwnProperty(r) && this.data[r].hasOwnProperty(datafield)) {
            val = this.data[r][datafield];
        }
        if (dafault && CommonUtils.isNullOrEmpty(val)) {
            val = dafault;
        }
        return val;
    }

    #resetAfterDelete(rowid) {
        if (this.rowCount === 0) {
            this.data = {};
        } else {

            let nextrowid = Number(rowid) + 1;
            if (nextrowid <= this.rowCount) {
                for (let i = nextrowid; i <= this.rowCount + 1; i++) {
                    let oldName = this.rowName(i);
                    let rowToFix = this.rows[oldName];
                    let r = i - 1;
                    if (rowToFix) {
                        let rowname = this.rowName(r);
                        this.#updateCtlId(rowToFix, rowname);
                        rowToFix.setAttribute('rownum', r);
                        let c = 0;
                        for (let cell of rowToFix.children) {
                            let cellType = cell.getAttribute('cell-type');
                            let newName = this.cellName(r, c);
                            let newEditName = this.editControlName(r, c);
                            let newBtnName = this.btnControlName(r, c);
                            let oldEditName = this.editControlName(i, c);
                            let oldBtnName = this.btnControlName(i, c);
                            if (cellType) {
                                switch (cellType) {
                                    case "rowheader":
                                        newName = this.headerRowName(r);
                                        cell.innerHTML = i;
                                        break;
                                    case "button":
                                        let btn = document.getElementById(oldBtnName);
                                        if (btn) {
                                            this.#updateCtlId(btn, newBtnName);
                                            btn.setAttribute('rownum', r);
                                            btn.setAttribute('colnum', c);
                                        }
                                        break;
                                    default:
                                        let edit = document.getElementById(oldEditName);
                                        if (edit) {
                                            this.#updateCtlId(edit, newEditName);
                                            edit.setAttribute('rownum', r);
                                            edit.setAttribute('colnum', c);
                                        }
                                        break;
                                }
                            }
                            this.#updateCtlId(cell, newName);
                            cell.setAttribute('colnum', c);
                            if (!cellType || cellType !== 'rowheader') {
                                c++;
                            }
                        }
                        delete this.rows[oldName];
                        this.rows[rowname] = rowToFix;
                    }
                    let datarow = this.data[i];
                    if (datarow) {
                        delete this.data[i];
                        this.data[r] = datarow;
                    }
                }
            }
        }
    }

    #updateCtlId(ctl, newname) {
        ctl.id = newname;
        ctl.name = newname;
    }

    setValue(r, c, val) {
        let cell = this.getCell(r, c);
        //check if cell has html control
        let editCtl = document.getElementById(this.editControlName(r, c));
        if (editCtl) {
            editCtl.value = val;
        } else {
            cell.innerHTML = val;
        }
    }

    getValue(r, c) {
        let cell = this.getCell(r, c);
        //check if cell has html control
        let editCtl = document.getElementById(this.editControlName(r, c));
        if (editCtl) {
            return editCtl.value;
        } else {
            return cell.innerHTML;
        }
    }
    deleteCel() {
        let rowid = this.rowCount - 1;
        let row = this.getRow(rowid);
        this.tableBody.removeChild(row);
        delete this.rows[this.rowName(rowid)];
    }

    deleteLastRow() {
        let rowid = this.rowCount - 1;
        let row = this.getRow(rowid);
        this.tableBody.removeChild(row);
        delete this.rows[this.rowName(rowid)];
    }

    deleteRow(rowIdx) {
        let row = this.getRow(rowIdx);
        this.tableBody.removeChild(row);
        delete this.rows[this.rowName(rowIdx)];
        this.#resetAfterDelete(rowIdx);
    }

    getRow(idx) {
        return this.rows[this.rowName(idx)];
    }

    static #getControlType(type) {
        switch (type) {
            case 'text':
            case 'password':
            case 'number':
            case 'checkbox':
                return 'input';
            case 'select':
                return 'select';
            case 'textarea':
                return 'textarea';
            case 'button':
                return 'button';
            default:
                return ErrorHandler.throwError(ErrorHandler.errorCode.Component.INVALID_TYPE);
        }
    }

    static #getElementControl(id, type, elAttrs, options) {
        elAttrs['type'] = type;
        var el = HtmlUtils.createElement(
            Table.#getControlType(type),
            id,
            elAttrs
        );
        if (type === 'select') {
            HtmlUtils.populateOptions(el, options);
        }
        return el;
    }

    //return object having main ctrl and input control
    getPopUp(id, col, colAttrs) {
        throw new Error('Not implemented');
    }
    createColumn(r, c) {
        let col = this.columns[c];
        let name = this.cellName(r, c);
        let editName = `${this.editControlName(r, c)}`;
        let td = HtmlUtils.createElement('td', name, { class: this.#tdcls, 'bind-ctrl': editName, 'data-type': col.type, 'cell-type': col.type, ref: 'datagrid-columns', colnum: c });
        let colAttributes = col.attributes || {};
        let eventName = col.eventName;
        let eventAction = col.eventAction;
        colAttributes['ref'] = 'datagrid-columns-edit';
        colAttributes['data-type'] = col.type;
        colAttributes['rownum'] = r;
        colAttributes['colnum'] = c;

        if (col.hasOwnProperty('class')) {
            colAttributes['class'] = col.class;
        }

        let tdChild;
        let editCtrl;

        switch (col.type) {
            case "button":
                let btnName = `${this.btnControlName(r, c)}`;
                let cls = colAttributes.class;
                let iconclass = colAttributes.iconclass;
                let btntxt = colAttributes.text;
                let btnAttr = { rownum: r, colnum: c, type: 'button' };
                if (cls) {
                    btnAttr['class'] = cls;
                }
                tdChild = HtmlUtils.createElement('button', btnName, btnAttr);
                if (iconclass) {
                    let icon = HtmlUtils.createElement('i', 'noid', { class: iconclass });
                    if (btntxt) {
                        icon.textContent = ` ${btntxt} `;
                    }
                    tdChild.appendChild(icon);
                } else {
                    if (btntxt) {
                        tdChild.textContent = ` ${btntxt} `;
                    }
                }
                break;
            case 'popup':
                colAttributes['class'] = `${colAttributes['class']} qf-table-control`;
                let ctrl = this.getPopUp(editName, col, colAttributes);
                if (ctrl && CommonUtils.isArray(ctrl)) {
                    tdChild = ctrl[0];
                    editCtrl = ctrl[1];
                }
                break;
            default:
                colAttributes['class'] = `${colAttributes['class']} qf-table-control`;
                tdChild = Table.#getElementControl(editName, col.type, colAttributes, col['options']);
                editCtrl = tdChild;
                break;
        }



        if (eventName && eventAction) {
            //set delete function
            tdChild.addEventListener(eventName, (e) => {
                let target = e.currentTarget;
                if (target) {
                    let r = target.getAttribute('rownum');
                    let c = target.getAttribute('colnum');
                    eventAction(e, r, c);
                }
            });
        }

        if (tdChild && colAttributes.hasOwnProperty('data-bind')) {
            //set the data
            let bindField = colAttributes['data-bind'];
            let dafault = '';
            if (col.hasOwnProperty('default')) {
                dafault = col.default;
            }
            if (editCtrl) {
                editCtrl.value = this.#getData(r, bindField, dafault);
                editCtrl.addEventListener('change', (e) => {
                    this.#updateData(r, bindField, e.currentTarget.value);
                });
            }
        }
        this.setCellContent(td, tdChild)
        return td;
    }

    createRow(r) {
        let rowid = this.rowName(r);
        let row = HtmlUtils.createElement('tr', this.rowName(r), { class: this.#trcls, ref: 'datagrid-columns-row', rownum: r });
        if (this.rowheader) {
            let headerCol = HtmlUtils.createElement('th', this.headerRowName(r), { class: this.#hdrcls, scope: 'row', 'cell-type': 'rowheader' });
            headerCol.innerHTML = r + 1;
            row.appendChild(headerCol);
        }
        for (let col = 0; col < this.columns.length; col++) //create cols
        {
            row.appendChild(this.createColumn(r, col));
        }
        this.rows[rowid] = row;
        return row;
    }

    get rowCount() {
        return Object.keys(this.rows).length;
    }

    createHeader() {
        //create header
        if (!this.tableHeader) {
            this.tableHeader = HtmlUtils.createElement('thead', this.tableHeaderName);
            this.headerRow = HtmlUtils.createElement('tr', this.headerRowName);
            if (this.rowheader) {
                let rowNumHeader = HtmlUtils.createElement('th', this.headerRowName(), { scope: 'col' });
                rowNumHeader.innerHTML = this.headerdesc;
                this.headerRow.appendChild(rowNumHeader);
            }
            for (let col = 0; col < this.columns.length; col++) //create cols
            {
                let th = HtmlUtils.createElement('th', this.headerColumnName(col), { scope: 'col' });
                let colInfo = this.columns[col];
                if (colInfo.hasOwnProperty('header')) {
                    th.innerHTML = colInfo['header'];
                }
                this.headerRow.appendChild(th);
            }
            this.tableHeader.appendChild(this.headerRow);
        }
    }

    createBody() {
        //use initial row count
        if (!this.tableBody && this.initRowCount > 0) {
            this.tableBody = HtmlUtils.createElement('tbody', this.bodyName, { class: 'datagrid-columns', 'data-key': 'datagrid-columns', 'ref': 'datagrid-columns-tbody' });
            for (let r = 0; r < this.initRowCount; r++) //create rows
            {
                let row = this.createRow(r);
                this.tableBody.appendChild(row);
            }
        }
    }

    createFooter() {
        //create header
        if (!this.tablefooter && this.footer && Object.keys(this.footer).length > 0) {
            this.tablefooter = HtmlUtils.createElement('tfoot', this.tableFooterName);
            let colspan = this.columns.length;
            if (this.rowheader) {
                colspan++;
            }
            let frow = HtmlUtils.createElement('tr', this.footerRowName);
            if (this.footer.hasOwnProperty('addrowbutton')) {
                let btnProps = this.footer['addrowbutton'];
                let fcol = HtmlUtils.createElement('td', this.footerRowName(0), { colspan: colspan });
                let btnName = `add-btn-${this.tablename}`;
                let cls;
                if (btnProps.hasOwnProperty('class')) {
                    cls = btnProps['class'];
                } else {
                    cls = 'btn btn-primary'
                }
                let iconclass;
                if (btnProps.hasOwnProperty('iconclass')) {
                    iconclass = btnProps['iconclass'];
                } else {
                    iconclass = 'bi bi-plus-square'
                }
                let btntxt;
                if (btnProps.hasOwnProperty('text')) {
                    btntxt = btnProps['text'];
                }

                let btnAttr = {};
                if (cls) {
                    btnAttr['class'] = cls;
                }
                let addbtn = HtmlUtils.createElement('button', btnName, btnAttr);
                if (iconclass) {
                    let icon = HtmlUtils.createElement('i', 'noid', { class: iconclass });
                    if (btntxt) {
                        icon.textContent = ` ${btntxt} `;
                    }
                    addbtn.appendChild(icon);
                } else {
                    if (btntxt) {
                        addbtn.textContent = ` ${btntxt} `;
                    }
                }
                addbtn.addEventListener('click', (e) => {
                    this.appendRow();
                });
                fcol.appendChild(addbtn);
                frow.appendChild(fcol);
            }
            this.tablefooter.appendChild(frow);
        }
    }
}