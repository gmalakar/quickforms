export default class BuilderUtils{
    constructor() {       
    }

    static componentTypes = {
        "basic": {
            text: "Basic",
            default: true,
            btns: [
                {
                    "default": true,
                    "type": "textfield",
                    "text": "Text Field",
                    "iconCls": "bi bi-terminal",
                },
                {
                    "type": "textarea",
                    "text": "Text Area",
                    "iconCls": "bi bi-type",
                }
            ]
        },
        "advanced": {
            text: "Advanced",
            default: false
        },
        "layout": {
            text: "Layout",
            default: false,
            btns: [
                {
                    "default": true,
                    "type": "columns",
                    "text": "Columns",
                    "iconCls": "bi bi-window",
                },
                {
                    "type": "table",
                    "text": "Table",
                    "iconCls": "bi bi-table",
                }
            ]
        }
    };

    static componentProperties = {
        "display": {
            text: "Display",
            default: true,
            props: [
                {
                    mappedType: "gen",
                    mappedProp: "name",
                    name: "Name",
                    type: "textfield",
                    maxlength: 50
                },
                {
                    mappedType: "gen",
                    mappedProp: "label",
                    name: "Description",
                    type: "textfield",
                    maxlength: 50
                },
                {
                    mappedType: "gen",
                    mappedProp: "type",
                    name: "Type",
                    type: "textfield"
                },
            ]
        },
        "data": {
            text: "Data Source",
            default: false,
            props: [
                {
                    mappedType: "attr",
                    mappedProp: "data-key",
                    name: "Binding",
                    type: "textfield",
                    maxlength: 30
                },
                {
                    mappedType: "attr",
                    mappedProp: "required",
                    name: "Required",
                    type: "select",
                    default: 'false',
                    options: {
                        True: 'true',
                        False: 'false'
                    }
                }
            ]
        },
        "attributes": {
            text: "HTML Attributes",
            default: false
        }
    };
}