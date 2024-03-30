import BaseElement from '../base/base-element.js';
import HtmlUtils from "../utils/html-utils.js";
import BootstrapUtils from "../utils/boostrap-utils.js";
import CommonUtils from "../utils/common-utils.js";
import ComponentUtils from "../utils/component-utils.js";

export default class DayField extends BaseElement {

    #monthCtrl;
    #dayCtrl;
    #yearCtrl;

    constructor(containingComponent) {
        super(containingComponent, 'Day');
        this.initControl();
        this.buildControl();
    }

    setOtherControls() {
        this.otherControl = HtmlUtils.createElement(
            'div',
            this.controlId,
            { class: 'input-group', role: 'group' }
        );

        let elAttrs = {};

        let cls = BaseElement.defaultControlClass(this.type);

        let bsClass = BootstrapUtils.getBSElementClass(this.type);

        if (!CommonUtils.isNullOrEmpty(bsClass)) {
            cls = `${cls} ${bsClass}`;
        }

        let elcls = this.getSchema('class', 'control');

        if (!CommonUtils.isNullOrEmpty(elcls)) {
            cls = `${cls} ${elcls}`;
        }

        elAttrs.class = cls;

        if (CommonUtils.isNullOrEmpty(elAttrs.class)) {
            elAttrs.class = BaseElement.defaultControlClass;
        }

        this.setAttrsFromSchema('attributes', 'control', elAttrs);
        this.setAttrsFromSchema('styles', 'control', elAttrs);
        this.setAttrsFromSchema('otherattributes', 'control', elAttrs);

        let monthCtrlId = `month-${this.controlId}`;
        let dayCtrlId = `day-${this.controlId}`;
        let yearCtrlId = `year-${this.controlId}`;

        elAttrs['type'] = 'month';

        this.#monthCtrl = HtmlUtils.createElement(
            ComponentUtils.getControlType('select'),
            monthCtrlId,
            elAttrs
        );

        HtmlUtils.clearOptions(this.#monthCtrl);
        //TODO
        let option = {
            '': '',
            '1': 'January',
            '2': 'February',
            '3': 'March',
            '4': 'April',
            '5': 'May',
            '6': 'June',
            '7': 'July',
            '8': 'August',
            '9': 'September',
            '10': 'October',
            '11': 'November',
            '12': 'December'
        }
        HtmlUtils.populateOptions(this.#monthCtrl, option);

        elAttrs['type'] = 'number';
        elAttrs['max'] = '31';
        elAttrs['min'] = '1';
        elAttrs['step'] = '1';

        this.#dayCtrl = HtmlUtils.createElement(
            ComponentUtils.getControlType('number'),
            dayCtrlId,
            elAttrs
        );

        elAttrs['type'] = 'number';
        elAttrs['max'] = '2050';
        elAttrs['min'] = '1900';
        elAttrs['step'] = '1';

        this.#yearCtrl = HtmlUtils.createElement(
            ComponentUtils.getControlType('number'),
            yearCtrlId,
            elAttrs
        );

        if (this.#monthCtrl && !this.elementControl.hasAttribute('autocomplete')) {
            this.#monthCtrl.setAttribute('autocomplete', 'off');
        }
        if (this.#dayCtrl && !this.elementControl.hasAttribute('autocomplete')) {
            this.#dayCtrl.setAttribute('autocomplete', 'off');
        }
        if (this.#yearCtrl && !this.elementControl.hasAttribute('autocomplete')) {
            this.#yearCtrl.setAttribute('autocomplete', 'off');
        }

        this.otherControl.appendChild(this.#monthCtrl);

        this.otherControl.appendChild(this.#dayCtrl);

        this.otherControl.appendChild(this.#yearCtrl);

    }

    resetRequired(name, val) {
        if (val) {
            this.#monthCtrl.required = true;
            this.#monthCtrl.setAttribute('aria-required', 'true');

            this.#dayCtrl.required = true;
            this.#dayCtrl.setAttribute('aria-required', 'true');

            this.#yearCtrl.required = true;
            this.#yearCtrl.setAttribute('aria-required', 'true');

            if (this.captionControl) {
                HtmlUtils.addClasses(this.captionControl, 'qf-required');
            }
        } else {
            this.#monthCtrl.removeAttribute(name);
            this.#monthCtrl.removeAttribute('aria-required');

            this.#dayCtrl.removeAttribute(name);
            this.#dayCtrl.removeAttribute('aria-required');

            this.#yearCtrl.removeAttribute(name);
            this.#yearCtrl.removeAttribute('aria-required');

            if (this.captionControl) {
                HtmlUtils.removeClasses(this.captionControl, 'qf-required');
            }
        }
    }

    setElementControl() {
        this.elementControl = HtmlUtils.createElement(
            'input',
            this.controlId,
            { type: 'hidden' }
        );

        if (!this.designmode) {
            for (let [seq, event] of Object.entries(this.getEventListenersSchema())) {
                if (event && event.event && event.script) {
                    this.elementControl.addEventListener(event.event, Function(event.script));
                }
            }
        }
        //set validation
        for (let [name, val] of Object.entries(this.getValidationSchema())) {
            if (name) {
                this.resetValidation(name, val, true);
            }
        }
    }

    afterBuild() {
        this.#monthCtrl.addEventListener("change", () => {
            this.#setDate();
        });

        this.#monthCtrl.value = '';
        this.#dayCtrl.addEventListener("change", () => {
            this.#setDate();
        });

        this.#yearCtrl.addEventListener("change", () => {
            this.#setDate();
        });

        this.elementControl.addEventListener("change", () => {
            this.#setDateToControls();
        });
    }

    static #padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    static #formatDate(month, date, year) {
        return [
            this.#padTo2Digits(month),
            this.#padTo2Digits(date),
            year,
        ].join('/');
    }

    static #isDate(date) {
        var d = new Date(date);
        return !isNaN(d.valueOf())
    }

    #setDateToControls() {
        var d = new Date(this.elementControl.value);
        if (!isNaN(d.valueOf())) {
            this.#yearCtrl.value = d.getFullYear();
            this.#dayCtrl.value = d.getDay();
            this.#monthCtrl.value = d.getMonth() + 1;
        }
    }

    #setDate() {
        let m = this.#monthCtrl.value;
        let d = this.#dayCtrl.value;
        let y = this.#yearCtrl.value;

        let date = DayField.#formatDate(m, d, y);
        if (DayField.#isDate(date)) {
            this.elementControl.value = date;
        }
    }
}