import HtmlUtils from '../utils/html-utils.js';
import CommonUtils from '../utils/common-utils.js';

export default class BaseEditor {
    #modalid;
    #modalEl;
    #titleEl;
    #footerEl;
    #bootstrapModal;
    #metadata;
    #modalContainer;
    #headerclass = '';
    #footerclass = '';
    constructor(modalMetada) {
        if (CommonUtils.isNullOrUndefined(modalMetada)) {
            throw new Error('invalid model metadata!');
        }

        if (CommonUtils.isJson(modalMetada)) {
            modalMetada = CommonUtils.jsonToObject(this.metadatamodalMetada);
        }

        this.#metadata = modalMetada;

        if (this.#metadata.hasOwnProperty('id')) {
            this.#modalid = this.#metadata['id'];
        } else {
            this.#modalid = CommonUtils.ShortGuid();
        }

        if (this.#metadata.hasOwnProperty('footerclass')) {
            this.#footerclass = this.#metadata['footerclass'];
        }


        if (this.#metadata.hasOwnProperty('headerclass')) {
            this.#headerclass = this.#metadata['headerclass'];
        }

        this.#createModal();

        if (this.#metadata.hasOwnProperty('title')) {
            this.setTitle(this.#metadata['title']);
        }

    }

    setTitle(title) {
        if (this.#titleEl) {
            this.#titleEl.innerHTML = title;
        }
    }

    setFooter(footer) {
        if (!CommonUtils.isNullOrUndefined(footer)) {
            if (this.#footerEl) {
                if (CommonUtils.isString(footer)) {
                    this.#footerEl.innerHTML = footer;
                } else if (HtmlUtils.isHTMLElement(footer)) {
                    this.#footerEl.replaceChildren(footer);
                }
            }
        }
    }

    setContent(content) {
        if (!CommonUtils.isNullOrUndefined(content)) {
            if (this.#modalContainer) {
                if (CommonUtils.isString(content)) {
                    this.#modalContainer.innerHTML = content;
                } else if (HtmlUtils.isHTMLElement(content)) {
                    this.#modalContainer.replaceChildren(content);
                }
            }
        }
    }

    hide(callback) {
        if (this.#bootstrapModal) {
            this.#bootstrapModal.hide();
            if (callback) {
                callback();
            }
        }
    };

    show() {
        if (this.#bootstrapModal) {
            this.#bootstrapModal.show();
        }
    };

    #createModal(reset = false) {
        if (!this.#modalEl || reset) {
            let titleId = 'title-' + this.#modalid;
            let btnId = 'btnModalMessage-' + this.#modalid;
            let footerId = 'footer-' + this.#modalid;

            let modal = HtmlUtils.createElement('div', this.#modalid, {
                class: 'modal fade',
                role: 'dialog', 'data-bs-backdrop': 'static', 'data-backdrop': 'static', 'data-bs-keyboard': false, 'data-keyboard': false, tabindex: '-1',
                'aria-labelledby': titleId, 'aria-hidden': true
            });
            let modalDialog = HtmlUtils.createElement('div', 'noid', { class: `modal-dialog ` });
            let modalContent = HtmlUtils.createElement('div', 'noid', { class: 'modal-content fb-editor' });
            let modalHeader = HtmlUtils.createElement('div', 'noid', { class: `modal-header ${this.#headerclass}` });
            let moldalTitle = HtmlUtils.createElement('h5', titleId, { class: 'modal-title' });
            let moldalClose = HtmlUtils.createElement('button', btnId, { class: 'btn-close', type: 'button', 'data-bs-dismiss': 'modal', 'aria-label': 'Close' });
            modalHeader.appendChild(moldalTitle);
            modalHeader.appendChild(moldalClose);
            this.#titleEl = moldalTitle;

            let body = HtmlUtils.createElement('div', 'noid', { class: 'modal-body ' });
            this.#modalContainer = HtmlUtils.createElement('div', 'noid', { class: 'container' });
            body.appendChild(this.#modalContainer);
            this.#footerEl = HtmlUtils.createElement('div', footerId, { class: `modal-footer ${this.#footerclass}` });
            modalContent.appendChild(modalHeader);
            modalContent.appendChild(body);
            modalContent.appendChild(this.#footerEl);

            modalDialog.appendChild(modalContent);
            modal.appendChild(modalDialog);
            this.#modalEl = modal;
            this.#bootstrapModal = new bootstrap.Modal(this.#modalEl, {});
        }
    }
}