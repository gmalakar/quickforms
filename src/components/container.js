import CommonUtils from "../utils/common-utils.js";
import HtmlUtils from "../utils/html-utils.js";
import Observer from "../base/observer.js";
import Component from "./component.js";
import Modal from "../utils/modal.js";
export default class Container extends Observer {
    containerClass = "fb-container h-100";
    #containerControl;
    #mutationObserver;
    deagControl;
    inDesignMode;
    dragControl;
    #dragName;
    formName;
    containingContainer;
    #metaData;
    allComponentNames = [];
    components = {};
    #guid;
    #currentComponent;
    #hasParentContainer = false;
    stopdrag = false;
    parentComponet;

    static #clsDesign = "fb-design-mode";

    static #clsSelected = "fb-selected-comp";

    #compDeleteBtn;

    constructor(
        formName,
        metaData,
        observer,
        observingMethod,
        parentComponent,
        indesignMode = false
    ) {
        super();
        this.#guid = CommonUtils.ShortGuid();
        this.#metaData = metaData || {};

        if (CommonUtils.isJson(this.#metaData)) {
            this.#metaData = JSON.parse(this.#metaData);
        }
        this.parentComponet = parentComponent;

        this.containingContainer = this.parentComponet ? this.parentComponet.container || this : this;

        this.setObserver(observer, observingMethod);

        this.formName = formName;
        this.inDesignMode = indesignMode;
        this.#dragName = `drag-component-${this.#guid}`;

        this.#compDeleteBtn = HtmlUtils.createElement(
            "button",
            `delete-component-${this.#guid}`,
            { class: "btn-close fb-delete-comp-btn" }
        );

        if (this.containingContainer !== this) {
            this.#hasParentContainer = true;
            this.allComponentNames = this.containingContainer.allComponentNames;
        }

        for (let [name, compMetaData] of Object.entries(
            this.#metaData["components"] || {}
        )) {
            let newComponent = new Component(this, compMetaData);
            this.components[name] = newComponent;
            this.allComponentNames.push(name);
        }
    }

    get containerControl() {
        this.control;
    }

    get componentNames() {
        return Object.keys(this.components);
    }

    get name() {
        return this.#metaData.formName;
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
        if (this.inDesignMode) {
            let len = this.length;
            if (len === 1) {
                if (this.#containerControl.contains(this.dragControl)) {
                    this.#containerControl.removeChild(this.dragControl);
                }
            } else if (len === 0) {
                if (!this.#containerControl.contains(this.dragControl)) {
                    this.#containerControl.appendChild(this.dragControl);
                }
            }
        }
    };

    controls = {};

    #config = { childList: true };

    get length() {
        return Object.keys(this.controls).length;
    }
    get control() {
        if (!this.#containerControl) {
            this.#containerControl = HtmlUtils.createElement("div", "noid", {
                novalidate: ``,
                class: this.containerClass,
                ref: this.containerName,
            });
            this.#mutationObserver = new MutationObserver(this.#nodeChanged);
            this.#mutationObserver.observe(this.#containerControl, this.#config);
            if (this.inDesignMode) {
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
                                this.addComponent(null, data.data, true);
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
                                source.removeComponent(source.#currentComponent);
                            }
                        }
                    }, null, true);
                    Modal.commonModalWindow.show();
                });
            }
        }
        return this.#containerControl;
    }

    setDesignMode(component) {
        if (this.inDesignMode) {
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
                    compToSelect = next.getAttribute("ref");
                }

                this.control.removeChild(compCtl);

                if (this.components.hasOwnProperty(component.name)) {
                    delete this.components[component.name];
                }

                CommonUtils.deleteFromArray(this.allComponentNames, component.name);

                let curComponent;

                if (compToSelect && this.components.hasOwnProperty(compToSelect)) {
                    curComponent = this.components[compToSelect];
                }
                this.setCurrentComponent(curComponent);
            }
        }
    }

    addComponent(metaData, type, setCurrent = false) {
        let compMetaData = metaData || {};
        let compType = compMetaData.type || type;

        if (CommonUtils.isNullOrEmpty(compType)) {
            return ErrorHandler.throwError(
                ErrorHandler.errorCode.Component.MISSING_TYPE
            );
        }

        if (CommonUtils.isNullOrEmpty(compMetaData.name)) {
            compMetaData.name = this.#generateName(type);
        }

        if (CommonUtils.isNullOrEmpty(compMetaData.type)) {
            compMetaData.type = compType;
        }
        let newComponent = new Component(this, compMetaData);

        if (this.inDesignMode) {
            this.setDesignMode(newComponent);
        }

        this.components[compMetaData.name] = newComponent;
        this.allComponentNames.push(newComponent.name);

        if (setCurrent) {
            this.setCurrentComponent(newComponent);
        }
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
        CommonUtils.replaceInArray(this.allComponentNames, oldname, newname);
    }
}
