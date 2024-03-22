import HtmlUtils from '../utils/html-utils.js';
import CommonUtils from '../utils/common-utils.js';

export default class BaseEditor {
    modalid;
    #modalEl;
    #titleEl;
    #footerEl;
    #bootstrapModal;
    #metadata;
    modalContainer;
    modalBody;
    #headerclass = '';
    #footerclass = '';
    #dialogclass = 'modal-lg';
    #contentclass = '';
    #bodyclass = '';
    #containerclass = '';
    #containertype = 'div'
    containerid;

    constructor(modalMetada) {
        if (CommonUtils.isNullOrUndefined(modalMetada)) {
            throw new Error('invalid model metadata!');
        }

        if (CommonUtils.isJson(modalMetada)) {
            modalMetada = CommonUtils.jsonToObject(this.metadatamodalMetada);
        }

        this.#metadata = modalMetada;

        if (this.#metadata.hasOwnProperty('id')) {
            this.modalid = this.#metadata['id'];
        } else {
            this.modalid = CommonUtils.ShortGuid();
        }

        if (this.#metadata.hasOwnProperty('dialogclass')) {
            this.#dialogclass = this.#metadata['dialogclass'];
        }

        if (this.#metadata.hasOwnProperty('bodyclass')) {
            this.#bodyclass = this.#metadata['bodyclass'];
        }

        if (this.#metadata.hasOwnProperty('contentclass')) {
            this.#contentclass = this.#metadata['contentclass'];
        }

        if (this.#metadata.hasOwnProperty('containertype')) {
            this.#containertype = this.#metadata['containertype'];
        }

        if (this.#metadata.hasOwnProperty('containerclass')) {
            this.#containerclass = this.#metadata['containerclass'];
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

    containerAdded(containerid) {
    }

    onHide() {
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
                } else if (CommonUtils.isArray(footer)) {
                    HtmlUtils.removeChilds(this.#footerEl);
                    for (let ctl of footer) {
                        this.#footerEl.appendChild(ctl);
                    }
                }
            }
        }
    }

    getContentHolder() {
        return this.modalContainer;
    }

    setModalContainerClasses(classes) {
        if (this.modalContainer) {
            HtmlUtils.addClasses(this.modalContainer, classes);
        }
    }
    setContent(content) {
        if (!CommonUtils.isNullOrUndefined(content)) {
            if (this.modalContainer) {
                if (CommonUtils.isString(content)) {
                    this.modalContainer.innerHTML = content;
                } else if (HtmlUtils.isHTMLElement(content)) {
                    this.modalContainer.replaceChildren(content);
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

    show(callback) {
        if (this.#bootstrapModal) {
            this.#bootstrapModal.show();
            if (callback) {
                callback();
            }
        }
    };

    appendToBody(ctl) {
        if (!CommonUtils.isNullOrUndefined(ctl)) {
            if (this.modalBody) {
                if (CommonUtils.isString(ctl)) {
                    this.modalBody.innerHTML = ctl;
                } else if (HtmlUtils.isHTMLElement(ctl)) {
                    this.modalBody.appendChild(ctl);
                }
            }
        }
    }

    #createModal(reset = false) {
        if (!this.#modalEl || reset) {
            let titleId = 'title-' + this.modalid;
            let btnId = 'btnModalMessage-' + this.modalid;
            let footerId = 'footer-' + this.modalid;
            this.containerid = 'container-' + this.modalid;

            let modal = HtmlUtils.createElement('div', this.modalid, {
                class: 'modal fade',
                role: 'dialog', 'data-bs-backdrop': 'static', 'data-backdrop': 'static', 'data-bs-keyboard': false, 'data-keyboard': false, tabindex: '-1',
                'aria-labelledby': titleId, 'aria-hidden': true
            });
            let modalDialog = HtmlUtils.createElement('div', 'noid', { class: `modal-dialog ${this.#dialogclass}` });
            let modalContent = HtmlUtils.createElement('div', 'noid', { class: `modal-content ef-editor ${this.#contentclass}` });

            modalDialog.appendChild(modalContent);

            let modalHeader = HtmlUtils.createElement('div', 'noid', { class: `modal-header ${this.#headerclass}` });
            let moldalTitle = HtmlUtils.createElement('h5', titleId, { class: 'modal-title' });
            let moldalClose = HtmlUtils.createElement('button', btnId, { class: 'btn-close', type: 'button', 'data-bs-dismiss': 'modal', 'aria-label': 'Close' });
            modalHeader.appendChild(moldalTitle);
            modalHeader.appendChild(moldalClose);
            this.#titleEl = moldalTitle;

            this.modalBody = HtmlUtils.createElement(this.#containertype, 'noid', { class: `modal-body row ${this.#bodyclass}` });
            this.modalContainer = HtmlUtils.createElement('div', this.containerid, { class: `modal-container ${this.#containerclass}` });
            this.modalBody.appendChild(this.modalContainer);
            this.#footerEl = HtmlUtils.createElement('div', footerId, { class: `modal-footer ${this.#footerclass}` });
            modalContent.appendChild(modalHeader);
            modalContent.appendChild(this.modalBody);
            modalContent.appendChild(this.#footerEl);
            modal.appendChild(modalDialog);
            this.#modalEl = modal;
            this.#bootstrapModal = new bootstrap.Modal(this.#modalEl, {});
            modal.addEventListener('shown.bs.modal', () => {
                this.containerAdded(this.containerid)
            });
            modal.addEventListener('hide.bs.modal', () => {
                this.onHide()
            });
        }
    }
}