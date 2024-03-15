import BaseEditor from "../base/base-editor.js";
import HtmlUtils from '../utils/html-utils.js';
import CommonUtils from "../utils/common-utils.js";
import Table from "../utils/table.js";
export default class ColumnsEditor extends BaseEditor {

    static #commonModalWindow;
    static COLUMN_EDITOR_ID;
    #editorEl;
    #table;

    static changeEvent = new Event("change");

    constructor() {
        ColumnsEditor.COLUMN_EDITOR_ID = CommonUtils.ShortGuid();
        let modalMetaData = {
            id: ColumnsEditor.COLUMN_EDITOR_ID,
            title: 'Columns Properties',
            footerclass: 'd-flex justify-content-start'
        }
        super(modalMetaData);
    }

    #deleteButtonAction = (e, r, c) => {
        this.#table.deleteRow(r);
    }

    #setModal(editorEl) {
        this.#editorEl = editorEl;
        let val = editorEl.value;
        let props = {};
        if (CommonUtils.isJson) {
            props = CommonUtils.jsonToObject(val);
        }
        let rowcount = 2;
        if (props && Object.keys(props).length > 0) {
            rowcount = Object.keys(props).length;
        }
        let tableJson = {
            name: `table-${this.COLUMN_EDITOR_ID}`,
            class: 'datagrid-table table-bordered table-fit',
            addrowbutton: {
                text: 'Add',
                iconclass: 'bi bi-plus-square',
                class: 'btn btn-primary',
            },
            row: {
                rowcount: rowcount,
                rowheader: true,
                desc: '#',
                prefix: 'header'
            },
            column: {
                columns: [
                    {
                        header: 'Size',
                        type: 'select',
                        class: 'form-select',
                        attributes: {
                            maxlength: 2,
                            'data-bind': 'size'
                        },
                        options: {
                            xs: 'xs',
                            sm: 'sm',
                            md: 'md'
                        },
                        default: 'md'
                    },
                    {
                        header: 'With',
                        type: 'text',
                        class: 'form-control',
                        attributes: {
                            maxlength: 3,
                            'data-bind': 'width',
                            type: 'number',
                            min: 0,
                            max: 20
                        },
                        default: 6
                    },
                    {
                        header: 'Offset',
                        type: 'text',
                        class: 'form-control',
                        attributes: {
                            maxlength: 2,
                            'data-bind': 'offset',
                            type: 'number',
                            min: 0,
                            max: 1000
                        },
                        default: 0
                    },
                    {
                        header: 'Push',
                        type: 'text',
                        class: 'form-control',
                        attributes: {
                            maxlength: 2,
                            'data-bind': 'push',
                            type: 'number',
                            min: 0,
                            max: 1000
                        },
                        default: 0
                    },
                    {
                        header: 'Pull',
                        type: 'text',
                        class: 'form-control',
                        attributes: {
                            maxlength: 2,
                            'data-bind': 'pull',
                            type: 'number',
                            min: 0,
                            max: 1000
                        },
                        default: 0
                    },
                    {
                        header: 'Delete Row',
                        type: 'button',
                        attributes: {
                            iconclass: "bi bi-trash",
                            class: "btn btn-primary",
                            action: ""
                        },
                        eventName: 'click',
                        eventAction: this.#deleteButtonAction
                    }
                ]
            },
            footer: {
                addrowbutton: {
                    text: 'Add',
                    iconclass: 'bi bi-plus-square',
                    class: 'btn btn-primary',
                },
            }

        }

        let data = {};
        //set the value
        if (props && Object.keys(props).length > 0) {
            for (let [key, value] of Object.entries(props)) {
                data[key] = value;
            }
        }
        tableJson['data'] = data;
        this.#table = new Table(tableJson);
        ColumnsEditor.#commonModalWindow.setContent(this.#table.table);

        let btn = HtmlUtils.createIconButton({ class: 'btn btn-primary', type: 'button' }, { class: 'bi bi-save' }, `btn-save${ColumnsEditor.COLUMN_EDITOR_ID}`);
        btn.textContent = 'Save';
        btn.addEventListener("click", (e) => {
            ColumnsEditor.#commonModalWindow.hide(() => {
                this.#editorEl.value = JSON.stringify(this.#table.data);
                this.#editorEl.dispatchEvent(ColumnsEditor.changeEvent);
            });
        });

        ColumnsEditor.#commonModalWindow.setFooter(btn);
    }

    static getEditor(editorEl) {
        if (HtmlUtils.isHTMLElement(editorEl)) {
            if (!ColumnsEditor.#commonModalWindow) {
                ColumnsEditor.#commonModalWindow = new ColumnsEditor();
            }
            ColumnsEditor.#commonModalWindow.#setModal(editorEl);
            return ColumnsEditor.#commonModalWindow;
        }
    }
}