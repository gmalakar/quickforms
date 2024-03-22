import BaseEditor from "../base/base-editor.js";
import HtmlUtils from '../utils/html-utils.js';
import CommonUtils from "../utils/common-utils.js";
import EventTable from "./event-table.js";
export default class EventsEditor extends BaseEditor {

    static #commonModalWindow;
    static EDITOR_ID;
    #editorEl;
    #table;

    static changeEvent = new Event("change");

    constructor(title) {
        EventsEditor.EDITOR_ID = CommonUtils.ShortGuid();
        let modalMetaData = {
            id: EventsEditor.EDITOR_ID,
            title: title,
            footerclass: 'd-flex justify-content-start',
            dialogclass: 'modal-xl'
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
        let rowcount = 1;
        if (props && Object.keys(props).length > 0) {
            rowcount = Object.keys(props).length;
        }
        let tableJson = {
            name: `table-${EventsEditor.EDITOR_ID}`,
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
                        header: 'Event Name',
                        type: 'text',
                        class: 'form-control',
                        attributes: {
                            maxlength: 100,
                            'data-bind': 'eventname'
                        }
                    },
                    {
                        header: 'Event To Trigger',
                        type: 'text',
                        class: 'form-control',
                        attributes: {
                            maxlength: 100,
                            'data-bind': 'event'
                        }
                    },
                    {
                        header: 'Invoke Type',
                        type: 'select',
                        class: 'form-select',
                        attributes: {
                            maxlength: 100,
                            'data-bind': 'type'
                        },
                        options: {
                            fs: 'Form Script',
                            is: 'Inline Script'
                        },
                    },
                    {
                        header: 'Script',
                        type: 'popup',
                        class: 'form-control',
                        popupname: 'script',
                        attributes: {
                            maxlength: 100,
                            'data-bind': 'script',
                            readonly: true
                        }
                    },
                    {
                        header: 'Delete',
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
        this.#table = new EventTable(tableJson);
        EventsEditor.#commonModalWindow.setContent(this.#table.table);

        let btn = HtmlUtils.createIconButton({ class: 'btn btn-primary', type: 'button' }, { class: 'bi bi-save' }, `btn-save${EventsEditor.EDITOR_ID}`);
        btn.textContent = 'Save';
        btn.addEventListener("click", (e) => {
            EventsEditor.#commonModalWindow.hide(() => {
                this.#editorEl.value = JSON.stringify(this.#table.data);
                this.#editorEl.dispatchEvent(EventsEditor.changeEvent);
            });
        });

        EventsEditor.#commonModalWindow.setFooter(btn);
    }

    static getEditor(editorEl, title) {
        if (HtmlUtils.isHTMLElement(editorEl)) {
            if (!EventsEditor.#commonModalWindow) {
                EventsEditor.#commonModalWindow = new EventsEditor(title);
            }
            EventsEditor.#commonModalWindow.#setModal(editorEl);
            return EventsEditor.#commonModalWindow;
        }
    }
}