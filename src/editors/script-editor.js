import BaseEditor from "../base/base-editor.js";
import HtmlUtils from '../utils/html-utils.js';
import CommonUtils from "../utils/common-utils.js";
export default class ScriptEditor extends BaseEditor {

    static #commonModalWindow;
    static EDITOR_ID;
    #codeMirrorJS;
    #codeMirrorCss;
    #codeMirror;
    reloadBtn;
    runStatus;
    #oldLog = console.log;
    #onsave;
    #script = `var easyFormsScript = function () {
  /*
  example:
  const myMethod(param){
  }

  invoke:
   easyFormsScript.myMethod(param);
   */
  //dont change the format
  //add your code below
}`;

    constructor(title, script, onsave, defaultscript = true) {
        ScriptEditor.EDITOR_ID = CommonUtils.ShortGuid();
        let modalMetaData = {
            id: ScriptEditor.EDITOR_ID,
            title: title,
            footerclass: 'd-flex justify-content-start',
            containerclass: 'script-editor border',
            dialogclass: 'modal-xl'
        }
        super(modalMetaData);
        this.#onsave = onsave;
        this.setScript(script, defaultscript);
        this.setConsoleLog();
    }

    setScript(script, defaultscript = true) {
        if (!defaultscript) {
            this.#script = '';
        }
        if (!CommonUtils.isNullOrEmpty(script)) {
            this.#script = script;
        }
        if (this.#codeMirror) {
            this.#codeMirror.doc.setValue(this.#script);
        }
    }
    evalJS() {
        let script = this.#codeMirror.getValue();
        try {
            eval(script);
            console.log('')
            return true;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    onHide() {
        console.log = this.#oldLog;
    }

    setConsoleLog() {
        console.log = (message) => {
            if (this.runStatus) {
                this.runStatus.replaceChildren(document.createTextNode(` ${message} `));
            }
        };
    }
    containerAdded(containerid) {

        this.refreshEditor(containerid);
    }

    refreshEditor(containerid) {
        if (!this.#codeMirror) {

            this.#codeMirror = CodeMirror(ScriptEditor.#commonModalWindow.getContentHolder(), {
                lineNumbers: true,
                tabSize: 2,
                value: this.#script,
                mode: 'javascript',
                closeBrackets: true
            });

            this.#codeMirror.focus();
            //this.#codeMirror.refresh();
        }
    }

    setCodeMirrorJS(src, integrity, crossorigin = 'anonymous', referrerpolicy = 'no-referrer') {
        this.#codeMirrorJS = { skipbase: true };
        this.#codeMirrorJS.src = src;
        this.#codeMirrorJS.integrity = integrity;
        this.#codeMirrorJS.crossorigin = crossorigin;
        this.#codeMirrorJS.referrerpolicy = referrerpolicy;
    }

    setCodeMirrorCss(src, integrity, crossorigin = 'anonymous', referrerpolicy = 'no-referrer') {
        this.#codeMirrorCss = { skipbase: true };
        this.#codeMirrorCss.src = src;
        this.#codeMirrorCss.integrity = integrity;
        this.#codeMirrorCss.crossorigin = crossorigin;
        this.#codeMirrorCss.referrerpolicy = referrerpolicy;
    }

    setModal() {
        if (!this.#codeMirror) {
            let btn = HtmlUtils.createIconButton({ class: 'btn btn-primary', type: 'button' }, { class: 'bi bi-save' }, `btn-save${ScriptEditor.EDITOR_ID}`);
            btn.textContent = 'Save';
            btn.addEventListener("click", (e) => {
                if (this.evalJS()) {
                    ScriptEditor.#commonModalWindow.hide(() => {
                        if (this.#onsave) {
                            this.#onsave(this.#codeMirror.getValue());
                        }
                        //this.#editorEl.value = this.#codeMirror.getValue();
                    });
                }
            });
            this.reloadBtn = HtmlUtils.createIconButton({ class: 'btn btn-primary', type: 'button' }, { class: 'bi bi-save' }, `btn-save${ScriptEditor.EDITOR_ID}`);
            this.reloadBtn.textContent = 'Run';
            this.reloadBtn.addEventListener("click", (e) => {
                this.evalJS();
            });

            this.runStatus = HtmlUtils.createElement('div', 'status-' + this.modalid, { class: `border script-editor-status` });

            this.appendToBody(this.runStatus);
            ScriptEditor.#commonModalWindow.setFooter([btn, this.reloadBtn]);
        }
    }

    static setEditor(title, script, onsave, defaultscript = true) {
        if (!ScriptEditor.#commonModalWindow) {
            ScriptEditor.#commonModalWindow = new ScriptEditor(title, script, onsave, defaultscript);
        } else {
            ScriptEditor.#commonModalWindow.setScript(script, defaultscript);
        }
        setTimeout(() => {
            ScriptEditor.#commonModalWindow.setModal();
            ScriptEditor.#commonModalWindow.show();
        }, 100);
    }
}