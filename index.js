import FormBuilder from './src/fbuilder.js'

let formMetaData = {
    "name": "testform",
    "type": "form",
    "components": {
        "columns1": {
            "name": "columns1",
            "type": "columns",
            "columns": {
                "column-columns1-0": {
                    "refname": "columns1",
                    "name": "column-columns1-0",
                    "index": "0",
                    "properties": {
                        "size": "md",
                        "width": "4",
                        "offset": 0,
                        "pull": 0,
                        "push": 0
                    },
                    "type": "container",
                    "components": {
                        "textfield1": {
                            "name": "textfield1",
                            "type": "text",
                            "columns": {},
                            "caption": "Text Field"
                        }
                    }
                },
                "column-columns1-1": {
                    "refname": "columns1",
                    "name": "column-columns1-1",
                    "index": "1",
                    "properties": {
                        "size": "md",
                        "width": "4",
                        "offset": 0,
                        "pull": 0,
                        "push": 0
                    },
                    "type": "container",
                    "components": {}
                },
                "column-columns1-2": {
                    "refname": "columns1",
                    "name": "column-columns1-2",
                    "index": "2",
                    "properties": {
                        "size": "md",
                        "width": "4",
                        "offset": 0,
                        "pull": 0,
                        "push": 0
                    },
                    "type": "container",
                    "components": {}
                }
            }
        },
        "textfield2": {
            "name": "textfield2",
            "type": "text",
            "columns": {},
            "caption": "Text Field"
        },
        "textarea1": {
            "name": "textarea1",
            "type": "textarea",
            "columns": {},
            "caption": "Text Area"
        },
        "select1": {
            "name": "select1",
            "type": "select",
            "columns": {},
            "caption": "Select Field"
        },
        "checkbox2": {
            "name": "checkbox2",
            "type": "checkbox",
            "columns": {},
            "caption": "Checkbox Field"
        }
    },
    "caption": "testform",
    "class": {
        "form": "fb-form mb-2 border",
        "body": "fb-form-body",
        "title": "fb-form-title mb-0",
        "header": "fb-form-header bg-defaul"
    }
}
formMetaData['name'] = 'testform';
let formBuilder = new FormBuilder('builder-container');

formBuilder.loadFormInBuilder(formMetaData);