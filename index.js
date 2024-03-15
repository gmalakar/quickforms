import EasyFormsBuilder from '../src/easyforms-builder.js'

let formBuilder = new EasyFormsBuilder('builder-container');
formBuilder.setBootstrapJS('https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js',
    'sha512-X/YkDZyjTf4wyc2Vy16YGCPHwAY8rZJY+POgokZjQB2mhIRFJCckEGc6YyX9eNsPfn0PzThEuNs+uaomE5CO6A==');
formBuilder.setBootstrapCss('https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css',
    'sha512-b2QcS5SsA8tZodcDtGRELiGv5SaKSk1vDHDaQRda0htPYWZ6046lr3kJ5bAAQdpV2mmA/4v0wQF9MyU6/pDIAg==');
formBuilder.setBootstrapIcons('https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css',
    'sha512-dPXYcDub/aeb08c63jRq/k6GaKccl256JQy/AnOq7CAnEZ9FzSL9wSbcZkMp4R26vBsMLFYH4kQ67/bbV8XaCQ==');
formBuilder.setOtherRequiredScripts([{
    type: 'javascript',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/slim-select/2.8.2/slimselect.min.js',
    integrity: 'sha512-epC0GMFGR8PG5QlzmOu8w6EXjvL+1/93qGAmsWiyZWCmkqGdV4lhoLuQJ9Mge6hsC+Wn0+M8eQ+AiW63zPQggw=='
}, {
    type: 'css',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/slim-select/2.8.2/slimselect.min.css',
    integrity: 'sha512-5nyAgbkuF7NkcIydVHNRVgjpsG2k+bBtP7PHOUMwMb/0vtb4rPdxEf1sqPztb6l6T6wEfisDrzZ+vge2QM6bIg=='
},
{
    type: 'javascript',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/codemirror.min.js',
    integrity: 'sha512-8RnEqURPUc5aqFEN04aQEiPlSAdE0jlFS/9iGgUyNtwFnSKCXhmB6ZTNl7LnDtDWKabJIASzXrzD0K+LYexU9g=='
}, {
    type: 'javascript',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/mode/javascript/javascript.min.js',
    integrity: 'sha512-I6CdJdruzGtvDyvdO4YsiAq+pkWf2efgd1ZUSK2FnM/u2VuRASPC7GowWQrWyjxCZn6CT89s3ddGI+be0Ak9Fg=='
}, {
    type: 'css',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/codemirror.min.css',
    integrity: 'sha512-uf06llspW44/LZpHzHT6qBOIVODjWtv4MxCricRxkzvopAlSWnTf6hpZTFxuuZcuNE9CBQhqE0Seu1CoRk84nQ=='
}
]);
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
//formBuilder.startBuilder();
formBuilder.loadFormInBuilder(formMetaData);