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
                    "ref": "columns1",
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
                    "ref": "columns1",
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
                    "ref": "columns1",
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
            },
            "caption": "Columns"
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
        },
        "select2": {
            "name": "select2",
            "type": "select",
            "caption": "Select Field"
        },
        "panel1": {
            "name": "panel1",
            "type": "panel",
            "components": {},
            "caption": "Panel",
            "ref": "panel1"
        },
        "groupbox3": {
            "name": "groupbox3",
            "type": "groupbox",
            "caption": "Group Box",
            "ref": "groupbox3",
            "components": {
                "text1": {
                    "name": "text1",
                    "type": "text",
                    "caption": "Text Field"
                }
            }
        },
        "table2": {
            "name": "table2",
            "type": "table",
            "caption": "Table",
            "rows": {
                "row-table2-0": {
                    "ref": "table2",
                    "name": "row-table2-0",
                    "index": "0",
                    "columns": {
                        "col-table2-0": {
                            "ref": "row-table2-0",
                            "name": "col-table2-0",
                            "index": "0",
                            "type": "container",
                            "components": {
                                "text2": {
                                    "name": "text2",
                                    "type": "text",
                                    "caption": "Text Field"
                                }
                            }
                        },
                        "col-table2-1": {
                            "ref": "row-table2-0",
                            "name": "col-table2-1",
                            "index": "1",
                            "type": "container",
                            "components": {}
                        },
                        "col-table2-2": {
                            "ref": "row-table2-0",
                            "name": "col-table2-2",
                            "index": "2",
                            "type": "container",
                            "components": {}
                        }
                    }
                },
                "row-table2-1": {
                    "ref": "table2",
                    "name": "row-table2-1",
                    "index": "1",
                    "columns": {
                        "col-table2-0": {
                            "ref": "row-table2-1",
                            "name": "col-table2-0",
                            "index": "0",
                            "type": "container",
                            "components": {}
                        },
                        "col-table2-1": {
                            "ref": "row-table2-1",
                            "name": "col-table2-1",
                            "index": "1",
                            "type": "container",
                            "components": {}
                        },
                        "col-table2-2": {
                            "ref": "row-table2-1",
                            "name": "col-table2-2",
                            "index": "2",
                            "type": "container",
                            "components": {}
                        }
                    }
                },
                "row-table2-2": {
                    "ref": "table2",
                    "name": "row-table2-2",
                    "index": "2",
                    "columns": {
                        "col-table2-0": {
                            "ref": "row-table2-2",
                            "name": "col-table2-0",
                            "index": "0",
                            "type": "container",
                            "components": {}
                        },
                        "col-table2-1": {
                            "ref": "row-table2-2",
                            "name": "col-table2-1",
                            "index": "1",
                            "type": "container",
                            "components": {}
                        },
                        "col-table2-2": {
                            "ref": "row-table2-2",
                            "name": "col-table2-2",
                            "index": "2",
                            "type": "container",
                            "components": {}
                        }
                    }
                }
            }
        }
    },
    "caption": "testform",
    "class": {
        "form": "fb-form mb-2 border",
        "body": "fb-form-body",
        "title": "fb-form-title mb-0",
        "header": "fb-form-header bg-defaul"
    },
    "ref": "self"
}
formMetaData['name'] = 'testform';
let formBuilder = new FormBuilder('builder-container');

formBuilder.loadFormInBuilder(formMetaData);