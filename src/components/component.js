import CommonUtils from "../utils/common-utils.js";
import ErrorHandler from "../utils/error-handler.js";
import HtmlUtils from "../utils/html-utils.js";
import TextField from "../elements/textfield.js";
import PasswordField from "../elements/password.js";
import NumberField from "../elements/number.js";
import TextArea from "../elements/textarea.js";
import Columns from "../elements/columns.js";
import CheckboxField from "../elements/checkbox.js";
import SelectField from "../elements/select.js";
import Panel from "../elements/panel.js";
import ButtonField from "../elements/button.js";
import Container from "./container.js";
export default class Component {
    //public members
    schema = {};
    container;
    containerControl;
    designmode;
    control;
    name;
    parentComponent;
    constructor(containingContainer, schema) {
        if (!(containingContainer instanceof Container)) {
            return ErrorHandler.throwError(
                ErrorHandler.errorCode.Form.INVALID_INSTANCE
            );
        }

        if (!HtmlUtils.isHTMLElement(containingContainer.control)) {
            return ErrorHandler.throwError(
                ErrorHandler.errorCode.Form.MISSING_CONTAINER
            );
        }

        this.container = containingContainer;
        this.containerControl = this.container.control;
        this.schema = schema || {};
        this.designmode = this.container.designmode;

        let parentComponent;

        if (this.containerControl) {
            parentComponent = HtmlUtils.findAncestor(this.containerControl, 'fb-form-component');
        }

        this.parentComponent = parentComponent || this;

        if (CommonUtils.isJson(this.schema)) {
            this.schema = JSON.parse(this.schema);
        }

        if (CommonUtils.isNullOrUndefined(this.schema)) {
            return ErrorHandler.throwError(
                ErrorHandler.errorCode.Form.MISSING_PROPERTIES
            );
        }

        if (CommonUtils.isNullOrEmpty(this.schema.type)) {
            return ErrorHandler.throwError(
                ErrorHandler.errorCode.Component.MISSING_TYPE
            );
        }

        if (CommonUtils.isNullOrEmpty(this.schema.name)) {
            return ErrorHandler.throwError(
                ErrorHandler.errorCode.Component.MISSING_NAME
            );
        }

        this.name = this.schema.name;

        this.control = Component.getComponentControl(this.schema.type, this);

        this.container.control.appendChild(this.control.componentControl);
    }

    static getComponentControl(type, containgComponent) {
        switch (type) {
            case "text":
                return new TextField(containgComponent);
            case "number":
                return new NumberField(containgComponent);
            case "password":
                return new PasswordField(containgComponent);
            case "checkbox":
                return new CheckboxField(containgComponent);
            case "textarea":
                return new TextArea(containgComponent);
            case "columns":
                return new Columns(containgComponent);
            case "select":
                return new SelectField(containgComponent);
            case "panel":
                return new Panel(containgComponent);
            case "button":
                return new ButtonField(containgComponent);
            default:
                return ErrorHandler.throwError(
                    ErrorHandler.errorCode.Component.INVALID_TYPE
                );
        }
    }

    get type() {
        return this.schema.type;
    }

    get name() {
        return this.schema.name;
    }
}
