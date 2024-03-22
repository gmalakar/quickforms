import HtmlUtils from '../utils/html-utils.js';
import CommonUtils from '../utils/common-utils.js';
import Table from '../utils/table.js';
import ScriptEditor from './script-editor.js';

export default class EventTable extends Table {
    constructor(metadata) {
        super(metadata);

    }

    static #valueSet = new Event("change");

    getPopUp(id, col, colAttrs) {
        let popUpCtrl = HtmlUtils.createElement('div', 'noid', { class: 'input-group' });
        let editorEl = HtmlUtils.createElement('input', id, colAttrs);
        let btn = HtmlUtils.createIconButton({ class: 'btn btn-primary', type: 'button' }, { class: 'bi bi-three-dots-vertical' }, `btn-${id}`);
        btn.addEventListener("click", (e) => {
            switch (col.popupname) {
                case "script":
                    ScriptEditor.setEditor('Inline Script', editorEl.value, (script) => {
                        if (!CommonUtils.isNullOrEmpty(script)) {
                            editorEl.value = script;
                        } else {
                            editorEl.value = '';
                        }
                        editorEl.dispatchEvent(EventTable.#valueSet);
                    }, false);
                    break;
                default:
                    break;
            }
        });
        popUpCtrl.appendChild(editorEl);
        popUpCtrl.appendChild(btn);
        return [popUpCtrl, editorEl];
    }
}