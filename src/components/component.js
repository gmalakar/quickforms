import CommonUtils from "../utils/common-utils.js";
import ErrorHandler from "../utils/error-handler.js";
import HtmlUtils from "../utils/html-utils.js";
import TextField from "../elements/textfield.js";
import TextArea from "../elements/textarea.js";
import Columns from "../elements/columns.js";
import Container from "./container.js";
export default class Component {
    //public members
    compMetaData = {};
    container;
    containerControl;
    inDesignMode;
    control;
    name;
    parentComponent;
    constructor(containingContainer, metaData) {
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
        this.compMetaData = metaData || {};
        this.inDesignMode = this.container.inDesignMode;

        let parentComponent;

        if (this.containerControl) {
            parentComponent = HtmlUtils.findAncestor(this.containerControl, 'fb-form-component');
        }

        this.parentComponent = parentComponent || this;

        if (CommonUtils.isJson(this.compMetaData)) {
            this.compMetaData = JSON.parse(this.compMetaData);
        }

        if (CommonUtils.isNullOrUndefined(this.compMetaData)) {
            return ErrorHandler.throwError(
                ErrorHandler.errorCode.Form.MISSING_PROPERTIES
            );
        }

        if (CommonUtils.isNullOrEmpty(this.compMetaData.type)) {
            return ErrorHandler.throwError(
                ErrorHandler.errorCode.Component.MISSING_TYPE
            );
        }

        if (CommonUtils.isNullOrEmpty(this.compMetaData.name)) {
            return ErrorHandler.throwError(
                ErrorHandler.errorCode.Component.MISSING_NAME
            );
        }

        this.name = this.compMetaData.name;

        this.control = Component.getComponentControl(this.compMetaData.type, this);

        this.container.control.appendChild(this.control.componentControl);
    }

    static getComponentControl(type, containgComponent) {
        switch (type) {
            case "textfield":
                return new TextField(containgComponent);
            case "textarea":
                return new TextArea(containgComponent);
            case "columns":
                return new Columns(containgComponent);
            default:
                return ErrorHandler.throwError(
                    ErrorHandler.errorCode.Component.INVALID_TYPE
                );
        }
    }

    get type() {
        return this.compMetaData.type;
    }

    get name() {
        return this.compMetaData.name;
    }
}
