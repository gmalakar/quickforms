import CommonUtils from "../utils/common-utils.js";
import HtmlUtils from "../utils/html-utils.js";
import Observable from "../base/observable.js";
import Component from "./component.js";
import Modal from "../utils/modal.js";
import ErrorHandler from "../utils/error-handler.js";
export default class Container extends Observable {
    containerClass = "fb-container h-100";
    #containerControl;
    #mutationObserver;
    deagControl;
    designmode;
    #dragName;
    containingContainer;
    #containingComponent;
    containerSchema;
    allComponentNames = [];
    allComponents = {}
    components = {};
    #guid;
    #currentComponent;
    #hasParentContainer = false;
    stopdrag = false;
    observer;
    formName;
    schema;
    name;

    static #clsDesign = "fb-design-mode";

    static #clsSelected = "fb-selected-comp";

    #compDeleteBtn;

    constructor(schema, observer, containingComponent, designmode = false) {
        super();
        this.#guid = CommonUtils.ShortGuid();
        schema = schema || {};

        if (CommonUtils.isJson(schema)) {
            schema = JSON.parse(schema);
        }

        if (!schema.hasOwnProperty('name')) {
            return ErrorHandler.throwError(
                ErrorHandler.errorCode.Component.MISSING_CONTAINER
            );
        }

        if (!schema.hasOwnProperty('ref')) {
            schema['ref'] = containingComponent?.name || 'self';
        }

        if (!schema.hasOwnProperty('type')) {
            schema['type'] = "container";
        }

        if (!schema.hasOwnProperty('components')) {
            schema['components'] = {};
        }
        this.#containingComponent = containingComponent;

        this.schema = schema;

        this.containingContainer = containingComponent?.container || this

        this.designmode = designmode;

        if (this.designmode) {
            this.observer = observer;

            this.setObserver(observer);

            this.#compDeleteBtn = HtmlUtils.createElement(
                "button",
                `delete-component-${this.#guid}`,
                { class: "btn-close fb-delete-comp-btn" }
            );

            this.#dragName = `drag-component-${this.#guid}`;

        }
        this.initContainer();
    }

    refreshContainer() {
        HtmlUtils.removeChilds(this.#containerControl);
        this.allComponentNames = [];
        this.allComponents = {};
        this.components = {};
        this.initContainer();
    }

    initContainer() {
        this.containerSchema = this.schema['components'];

        this.name = this.schema['name'];

        if (this.containingContainer === this) {
            this.formName = this.schema['name'];
        } else {
            this.formName = this.containingContainer.formName;
        }

        if (this.containingContainer !== this) {
            this.#hasParentContainer = true;
            this.allComponentNames = this.containingContainer.allComponentNames;
            this.allComponents = this.containingContainer.allComponents;
        }

        for (let [name, compschema] of Object.entries(
            this.compContainer || {}
        )) {
            this.setComponent(compschema);
        }
    }

    get containerControl() {
        this.control;
    }

    get componentNames() {
        return Object.keys(this.components);
    }

    // Callback function to execute when mutations are observed
    #nodeChanged = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    //node added
                    let control = mutation.addedNodes[0];
                    if (!control.hasAttribute("data-noattach")) {
                        this.controls[control.name] = control;
                    }
                } else if (mutation.removedNodes && mutation.removedNodes.length > 0) {
                    //node removed
                    let control = mutation.removedNodes[0];
                    if (this.controls.hasOwnProperty(control.name)) {
                        delete this.controls[control.name];
                    }
                }
            }
        }
        if (this.designmode) {
            let len = this.length;
            if (len >= 1) {
                if (this.#containerControl.contains(this.dragControl)) {
                    this.#containerControl.removeChild(this.dragControl);
                }
            } else if (len === 0) {
                if (!this.#containerControl.contains(this.dragControl)) {
                    this.#containerControl.appendChild(this.dragControl);
                }
            }
        }
        console.log('nodechange')
        this.#triggerChange("schemachanged");
    };

    controls = {};

    #config = { attributes: true, childList: true };

    get length() {
        return Object.keys(this.controls).length;
    }

    get control() {
        if (!this.#containerControl) {
            this.#containerControl = HtmlUtils.createElement("div", "noid", {
                class: this.containerClass,
                ref: this.name,
            });
            if (this.designmode) {
                //drag drop
                this.#containerControl.ondragover = (e) => {
                    e.preventDefault();
                };
                this.#containerControl.ondrop = (e) => {
                    if (this.containingContainer !== this) {
                        this.containingContainer.stopdrag = true;
                    }
                    if (!this.stopdrag) {
                        e.preventDefault();
                        let data = HtmlUtils.dataTransferGetData(e);
                        if (data && data.for && data.data) {
                            if (data.for === "add-comp") {
                                this.addComponent(data.data, true);
                            }
                        }
                    }
                    this.stopdrag = false;
                };
                this.dragControl = HtmlUtils.createElement("div", this.#dragName, {
                    class: "p-2 m-2 fb-drag-drop-indication",
                    "data-noattach": true,
                    "data-position": "0",
                    style: "text-align:center;",
                });
                this.dragControl.innerHTML = "Drag and Drop your from component here!";
                this.#containerControl.appendChild(this.dragControl);
                //set delete function
                this.#compDeleteBtn.addEventListener("click", (e) => {
                    Modal.commonModalWindow.setModal(this, "Delete Component", "Do you want to delete this component?", Modal.YesNo, function (source, which) {
                        if (which === 'yes') {
                            if (source) {
                                source.removeComponent(source.currentComponent);
                            }
                        }
                    }, null, false);
                    Modal.commonModalWindow.show();
                });
                this.#mutationObserver = new MutationObserver(this.#nodeChanged);
                this.#mutationObserver.observe(this.#containerControl, this.#config);
            }
        }
        return this.#containerControl;
    }


    getJSONSchema() {
        return JSON.stringify(this.containerSchema, null, 2)
    }

    setDesignMode(component) {
        if (this.designmode) {
            let attachedControl = component.control;

            if (attachedControl) {
                if (attachedControl.componentControl) {
                    attachedControl.componentControl.addEventListener("focus", () => {
                        this.setCurrentComponent(component);
                    });

                    attachedControl.componentControl.addEventListener("mouseover", () => {
                        document.body.style.cursor = "all-scroll";
                    });

                    attachedControl.componentControl.addEventListener("mouseout", () => {
                        document.body.style.cursor = "auto";
                    });
                    attachedControl.componentControl.addEventListener(
                        "dragstart",
                        (e) => {
                            HtmlUtils.dataTransferSetData(e, "move", component.name);
                        }
                    );

                    //drag & drop
                    attachedControl.componentControl.addEventListener("drop", (e) => {
                        e.preventDefault();
                        let data = HtmlUtils.dataTransferGetData(e);
                        if (
                            data &&
                            data.for &&
                            data.data &&
                            data.for === "move" &&
                            data.data !== e.target.id
                        ) {
                            let up = (data.y - e.y || pageY) > 0;
                            let draggedComponent = document.getElementById(data.data);

                            if (this.control.hasChildNodes()) {
                                this.control.removeChild(draggedComponent);
                            }

                            if (up) {
                                //find the top component
                                this.control.insertBefore(draggedComponent, e.currentTarget);
                            } else {
                                //find the below component
                                let nextComponent = e.currentTarget.nextSibling;
                                if (nextComponent) {
                                    this.control.insertBefore(draggedComponent, nextComponent);
                                } else {
                                    this.control.appendChild(draggedComponent);
                                }
                            }
                        }
                    });
                }
                if (attachedControl.elementControl) {
                    {
                        attachedControl.elementControl.addEventListener("focus", () => {
                            this.setCurrentComponent(component);
                        });
                    }
                }
            }
        }
    }

    setDeleteButton(component, set) {
        if (component) {
            let compControl = component.control.componentControl;
            if (compControl) {
                let firstChild = compControl.firstChild;
                if (set) {
                    HtmlUtils.removeClasses(compControl, Container.#clsDesign);
                    HtmlUtils.addClasses(compControl, Container.#clsSelected);
                    if (CommonUtils.isNullOrUndefined(firstChild)) {
                        compControl.appendChild(this.#compDeleteBtn);
                    } else if (firstChild !== this.#compDeleteBtn) {
                        compControl.insertBefore(this.#compDeleteBtn, firstChild);
                    }
                } else {
                    HtmlUtils.addClasses(compControl, Container.#clsDesign);
                    HtmlUtils.removeClasses(compControl, Container.#clsSelected);
                    if (firstChild === this.#compDeleteBtn) {
                        compControl.removeChild(this.#compDeleteBtn);
                    }
                }
            }
        }
    }

    get currentComponent() {
        return this.#hasParentContainer
            ? this.containingContainer.currentComponent
            : this.#currentComponent;
    }

    set currentComponent(value) {
        if (this.#hasParentContainer) {
            this.containingContainer.currentComponent = value;
        } else {
            this.#currentComponent = value;
        }
    }

    setCurrentComponent(component) {
        if (this.currentComponent !== component) {
            //reset
            if (this.currentComponent) {
                this.currentComponent.container.setDeleteButton(
                    this.currentComponent,
                    false
                );
            }
            this.currentComponent = component;
            if (this.currentComponent) {
                this.currentComponent.container.setDeleteButton(
                    this.currentComponent,
                    true
                );
            }
            this.#triggerChange("currentComponentChanged", component);
        }
    }

    #triggerChange(event, args) {
        if (this.hasObserver) {
            this.signalObserver(event, args);
        } else {
            console.log("missing observer");
        }
    }

    #generateName(type) {
        let names = this.allComponentNames;
        let l = type.length;
        let curIdx = names.map((v) => {
            let idx = 0;
            if (v.length > l) {
                idx = v.slice(l).trimStart();
                if (isNaN(idx)) idx = 0;
            }
            return idx;
        });
        if (curIdx && curIdx.length > 0)
            return `${type}${Math.max.apply(Math, curIdx) + 1}`;
        else return `${type}1`;
    }

    removeComponent(component) {
        let compCtl = component && component.control.componentControl;
        if (compCtl) {
            if (compCtl.hasChildNodes()) {
                let compToSelect;

                let next = compCtl.nextSibling;

                if (!next) {
                    next = compCtl.previousSibling;
                }

                if (next) {
                    compToSelect = next.getAttribute('ref');
                } else { //try 
                    compToSelect = this.schema['ref'];
                }

                this.control.removeChild(compCtl);

                if (this.components.hasOwnProperty(component.name)) {
                    delete this.components[component.name];
                }
                //remove from schema
                this.tryRemoveSchema(component.name);
                CommonUtils.deleteFromArray(this.allComponentNames, component.name);

                if (this.allComponents.hasOwnProperty(component.name)) {
                    delete this.allComponents[component.name];
                }
                let curComponent;

                if (compToSelect && this.allComponents.hasOwnProperty(compToSelect)) {
                    curComponent = this.allComponents[compToSelect];
                }
                if (!curComponent) {
                    curComponent = this.#containingComponent;
                }

                this.setCurrentComponent(curComponent);
            }
        }
    }

    get compContainer() {
        return this.containerSchema;
    }

    tryAddSchema(name, schema) {
        this.compContainer[name] = schema;
    }

    tryRemoveSchema(name) {
        let pComponents = this.compContainer;
        if (pComponents.hasOwnProperty(name)) {
            delete pComponents[name];
        }
    }

    tryChangeSchemaName(oldname, newname) {
        let pComponents = this.compContainer;

        if (pComponents.hasOwnProperty(oldname)) {
            let compSchema = pComponents[oldname];
            delete pComponents[oldname];
            //add new one
            pComponents[newname] = compSchema;
        }
    }

    addComponent(type, setCurrent = false) {
        let componentSchema = {};
        if (CommonUtils.isNullOrEmpty(type)) {
            return ErrorHandler.throwError(
                ErrorHandler.errorCode.Component.MISSING_TYPE
            );
        }
        componentSchema.name = this.#generateName(type);
        componentSchema.type = type;
        this.tryAddSchema(componentSchema.name, componentSchema);

        let newComponent = this.setComponent(componentSchema);

        if (setCurrent) {
            this.setCurrentComponent(newComponent);
        }
        return newComponent;
    }

    setComponent(componentSchema) {

        let newComponent = new Component(this, componentSchema);

        if (this.designmode) {
            this.setDesignMode(newComponent);
        }

        this.components[componentSchema.name] = newComponent;

        this.allComponentNames.push(newComponent.name);

        this.allComponents[newComponent.name] = newComponent;

        return newComponent;
    }

    changeName(oldname, newname) {
        if (this.controls.hasOwnProperty(oldname)) {
            let control = this.controls[oldname];
            delete this.controls[oldname];
            //add new one
            this.controls[newname] = control;
        }
        if (this.components.hasOwnProperty(oldname)) {
            let comp = this.components[oldname];
            delete this.components[oldname];
            //add new one
            this.components[newname] = comp;
        }
        this.tryChangeSchemaName(oldname, newname);

        CommonUtils.replaceInArray(this.allComponentNames, oldname, newname);


        if (this.allComponents.hasOwnProperty(oldname)) {
            let comp = this.allComponents[oldname];
            delete this.allComponents[oldname];
            this.allComponents[oldname]
            //add new one
            this.allComponents[newname] = comp;
        }

    }

    propertyChanged(name) {
        console.log(`property ${name} is changed`)
        this.#triggerChange("schemachanged");
    }
}
