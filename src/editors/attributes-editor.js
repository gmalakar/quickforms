import BaseEditor from "../base/base-editor.js";
import HtmlUtils from '../utils/html-utils.js';
import CommonUtils from "../utils/common-utils.js";
import Table from "../utils/table.js";
export default class AttributesEditor extends BaseEditor {

    static #commonModalWindow;
    static EDITOR_ID;
    #editorEl;
    #table;

    static changeEvent = new Event("change");

    constructor() {
        AttributesEditor.EDITOR_ID = CommonUtils.ShortGuid();
        let modalMetaData = {
            id: CommonUtils.COLUMN_EDITOR_ID,
            title: 'Html Attributes',
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
            name: 'table-COLUMN_EDITOR_ID',
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
                        header: 'Attribute Name',
                        type: 'textfield',
                        class: 'form-control',
                        attributes: {
                            maxlength: 50,
                            'data-bind': 'name'
                        }
                    },
                    {
                        header: 'Attribute Value',
                        type: 'textfield',
                        class: 'form-control',
                        attributes: {
                            maxlength: 50,
                            'data-bind': 'value'
                        }
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
                    }]
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
        AttributesEditor.#commonModalWindow.setContent(this.#table.table);

        let btn = HtmlUtils.createIconButton({ class: 'btn btn-primary', type: 'button' }, { class: 'bi bi-save' }, `btn-save${AttributesEditor.EDITOR_ID}`);
        btn.textContent = 'Save';
        btn.addEventListener("click", (e) => {
            AttributesEditor.#commonModalWindow.hide(() => {
                this.#editorEl.value = JSON.stringify(this.#table.data);
                this.#editorEl.dispatchEvent(AttributesEditor.changeEvent);
            });
        });

        AttributesEditor.#commonModalWindow.setFooter(btn);
    }

    static getEditor(editorEl) {
        if (HtmlUtils.isHTMLElement(editorEl)) {
            if (!AttributesEditor.#commonModalWindow) {
                AttributesEditor.#commonModalWindow = new AttributesEditor();
            }
            AttributesEditor.#commonModalWindow.#setModal(editorEl);
            return AttributesEditor.#commonModalWindow;
        }
    }
}