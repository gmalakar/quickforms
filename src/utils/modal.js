import HtmlUtils from './html-utils.js';
import CommonUtils from './common-utils.js';

export default class Modal {
    modalid;
    #modalEl;
    #titleEl;
    #messageEl;
    #footerEl;
    #bootstrapModal;
    #response;
    #caller;

    static YesNo = 'YN';
    static OkCancel = 'OC';
    static Ok = 'OK';
    static COMMON_MODAL_ID = CommonUtils.ShortGuid();

    constructor(id) {
        this.modalid = id;
    }

    hide() {
        if (this.#bootstrapModal) {
            this.#bootstrapModal.hide();
        }
    };

    show() {
        if (this.#bootstrapModal) {
            this.#bootstrapModal.show();
        }
    };

    #modalButtonClicked(which) {
        if (this.#response && typeof this.#response === 'function') {
            this.#response(this.#caller, which);
        }
    }
    setModal(caller, title, message, type, callback, messageClass, reset = false) {
        this.#caller = caller;
        this.#response = callback;
        if (!this.#modalEl || reset) {
            if (this.#bootstrapModal) {
                this.#bootstrapModal.dispose();
            }
            let titleId = 'title-' + this.modalid;
            let btnId = 'btnModalMessage-' + this.modalid;
            let messageId = 'message-' + this.modalid;

            let footerId = 'footer-' + this.modalid;

            let modal = HtmlUtils.createElement('div', this.modalid, {
                class: 'modal fade',
                role: 'dialog', 'data-bs-backdrop': 'static', 'data-backdrop': 'static', 'data-bs-keyboard': false, 'data-keyboard': false, tabindex: '-1',
                'aria-labelledby': titleId, 'aria-hidden': true
            });
            let modalDialog = HtmlUtils.createElement('div', 'noid', { class: 'modal-dialog' });
            let modalContent = HtmlUtils.createElement('div', 'noid', { class: 'modal-content' });
            let modalHeader = HtmlUtils.createElement('div', 'noid', { class: 'modal-header' });
            let moldalTitle = HtmlUtils.createElement('h5', titleId, { class: 'modal-title' });
            let moldalClose = HtmlUtils.createElement('button', btnId, { class: 'btn-close', type: 'button', 'data-bs-dismiss': 'modal', 'aria-label': 'Close' });
            modalHeader.appendChild(moldalTitle);
            modalHeader.appendChild(moldalClose);
            this.#titleEl = moldalTitle;

            let moldalBody = HtmlUtils.createElement('div', 'noid', { class: 'modal-body' });
            let moldalMessage = HtmlUtils.createElement('p', messageId, { class: 'text-success' });
            moldalBody.appendChild(moldalMessage);
            this.#messageEl = moldalMessage;

            this.#footerEl = HtmlUtils.createElement('div', footerId, { class: 'modal-footer' });
            modalContent.appendChild(modalHeader);
            modalContent.appendChild(moldalBody);
            modalContent.appendChild(this.#footerEl);

            modalDialog.appendChild(modalContent);
            modal.appendChild(modalDialog);
            this.#modalEl = modal;
            this.#bootstrapModal = new bootstrap.Modal(this.#modalEl, {});
        }
        this.#titleEl.innerHTML = title;
        this.#messageEl.innerHTML = message;
        this.#footerEl.innerHTML = '';

        if (messageClass && CommonUtils.isString(messageClass)) {
            this.#messageEl.className = messageClass;
        } else {
            this.#messageEl.className = 'text-success';
        }
        if (type === Modal.YesNo || type === Modal.OkCancel) {
            let moldalFooterYes = HtmlUtils.createElement('button', 'footer-btn-yes' + this.modalid, { class: 'btn btn-primary', type: 'button', 'data-bs-dismiss': 'modal' });
            moldalFooterYes.textContent = type === Modal.YesNo ? 'Yes' : 'Ok';
            moldalFooterYes.addEventListener('click', (e) => {
                this.#modalButtonClicked('yes');
            })
            this.#footerEl.appendChild(moldalFooterYes);
            let moldalFooterNo = HtmlUtils.createElement('button', 'footer-btn-no' + this.modalid, { class: 'btn btn-primary', type: 'button', 'data-bs-dismiss': 'modal' });
            moldalFooterNo.textContent = type === Modal.YesNo ? 'No' : 'Cancel';;
            moldalFooterNo.addEventListener('click', (e) => {
                this.#modalButtonClicked('no');
            })
            this.#footerEl.appendChild(moldalFooterNo);
        } else {
            let moldalFooterClose = HtmlUtils.createElement('button', 'footer-btn-close' + this.modalid, { class: 'btn btn-primary', type: 'button', 'data-bs-dismiss': 'modal' });
            moldalFooterClose.textContent = type === Modal.Ok ? 'Ok' : 'Close';
            moldalFooterClose.addEventListener('click', (e) => {
                this.#modalButtonClicked(type === Modal.Ok ? 'Ok' : 'Close');
            })
            this.#footerEl.appendChild(moldalFooterClose);
        }
        //return this.modalEl;
    }
    //common static modal window
    static commonModalWindow = new Modal(Modal.COMMON_MODAL_ID)
}