import CommonUtils from '../utils/common-utils.js';
import ErrorHandler from '../utils/error-handler.js';
import HtmlUtils from '../utils/html-utils.js';
import FormContainer from '../components/form-container.js';
import ComponentsBar from './components-bar.js';
import PropertiesBar from './properties-bar.js';
import Observer from '../base/observer.js';
import TabControl from '../utils/tab-control.js';
//builder
export default class Builder {

    #builderContainer;
    #formname;
    #theFormContainer;
    #buildertTabPanes = {};
    #editBar;
    #compBar;
    #currentComponent;
    #formschema = {}
    #jsonHolder;
    #guid;
    /**
     * Class constructor of Builder.
     * 
     * @param {string} placeholder place holder for form builder
     * @param {string} formname form name
     * @param {string} formschema form metadata
     */
    constructor(placeholder, formschema) {
        if (CommonUtils.isNullOrEmpty(placeholder)) {
            return ErrorHandler.throwError(ErrorHandler.errorCode.Builder.MISSING_PLACEHOLDER);
        } else if (CommonUtils.isNullOrUndefined(formschema)) {
            return ErrorHandler.throwError(ErrorHandler.errorCode.Builder.MISSING_FORM_METADATA);
        } else if (CommonUtils.isNullOrEmpty(formschema.name)) {
            return ErrorHandler.throwError(ErrorHandler.errorCode.Form.MISSING_NAME);
        }
        else {
            this.#guid = CommonUtils.ShortGuid();
            //defaut form name
            this.#formname = formschema.name;

            this.#formschema = formschema;
            //builder container
            this.#builderContainer = document.getElementById(placeholder);
        }
    }

    get builderPane() {
        return this.#buildertTabPanes[this.#containerId];
    }

    get formPane() {
        return this.#buildertTabPanes[this.#formContainerId];
    }

    get jsonPane() {
        return this.#buildertTabPanes[this.#jsonContainerId];
    }

    buildBuilder() {
        if (this.#builderContainer) {
            this.#createBed();
        } else {
            ErrorHandler.throwError('builder.invalidbuilderel');
        }
    }

    #makeUniqueId(id) {
        return `${id}-${this.#guid}`;
    }

    get #containerId() {
        return this.#makeUniqueId('design-container');
    }

    get #formContainerId() {
        return this.#makeUniqueId('form-container');
    }

    get #jsonContainerId() {
        return this.#makeUniqueId('json-container');
    }

    get #builderId() {
        return this.#makeUniqueId('fb-builder');
    }

    get #sideCompId() {
        return this.#makeUniqueId('sidebar-comps');
    }

    get #designAreaId() {
        return this.#makeUniqueId('design-area');
    }

    get #propertyId() {
        return this.#makeUniqueId('propbar');
    }

    get #areaId() {
        return this.#makeUniqueId('area');
    }


    get #mainTabId() {
        return this.#makeUniqueId('main-tab');
    }

    get #jsonSchemaId() {
        return this.#makeUniqueId('json-schema');
    }

    #createBed() {


        //clear the placeholder
        this.#builderContainer.innerHTML = '';

        //creat tabobjects
        let tabs = {};
        tabs[this.#containerId] = 'Builder';
        tabs[this.#formContainerId] = 'Form';
        tabs[this.#jsonContainerId] = 'Json';

        let tabcontrol = new TabControl(this.#mainTabId, tabs, this.#containerId);
        let buildermain = tabcontrol.tabControl;

        //tab panes
        this.#buildertTabPanes = tabcontrol.tabPanes;

        //main builder
        let builder = this.#createElement('div', this.#builderId, { class: `fb-builder row p-0` });


        //components bar
        let componentBar = this.#createElement('div', this.#sideCompId, { class: `col-xs-3 col-sm-3 col-md-2 p-0 fb-component-bar` });

        //form design area
        let formArea = this.#createElement('div', this.#designAreaId, { class: `col-xs-6 col-sm-6 col-md-8 p-0 fb-form-area`, ref: this.#builderId });

        //property bar
        let propertyBar = this.#createElement('div', this.#propertyId, { class: `col-xs-3 col-sm-3 col-md-2 p-0 fb-property-bar`, ref: this.#builderId });

        //append components bar
        builder.appendChild(componentBar);

        //appened form area
        builder.appendChild(formArea);

        //append property bar
        builder.appendChild(propertyBar);

        //add designer
        //add container holder
        let formContainerHolder = this.#createElement('div', this.#areaId, { class: 'fb-design-area m-2', ref: this.#designAreaId });

        //add form container
        this.#theFormContainer = new FormContainer(this.#formschema, new Observer(this, Builder.#listener), true);

        //append the contaioner
        formContainerHolder.appendChild(this.#theFormContainer.formControl);

        formArea.appendChild(formContainerHolder);

        //add form
        let form = this.#createElement('form', this.#formname);

        //append form to form pane
        this.formPane.appendChild(form);

        //component bar
        this.#compBar = new ComponentsBar(this.#theFormContainer, this.#sideCompId);


        componentBar.appendChild(this.#compBar.control);

        //property bar
        this.#editBar = new PropertiesBar(this.#theFormContainer, this.#propertyId);

        propertyBar.appendChild(this.#editBar.tabControl);

        //append the main to placeholder
        this.#builderContainer.appendChild(buildermain);

        //appened builder
        this.builderPane.appendChild(builder);

        //append json schema

        this.#jsonHolder = this.#createElement('pre', this.#jsonSchemaId, { class: `fb-json-holder` });

        this.jsonPane.appendChild(this.#jsonHolder);

        this.#finalizeBuilder();
    }

    #finalizeBuilder() {
        if (this.builderPane) {
            console.log('Valid container');
        } else {
            console.log('Invalid container');
        }
    }

    static #listener(target, event, args) {
        if (target instanceof Builder) {
            switch (event) {
                case 'currentComponentChanged':
                    target.#editBar.refreshComponent(args);
                    target.#compBar.setCurrentContainer(args ? target.#theFormContainer : args.container);
                    target.#currentComponent = args;
                    break;
                case 'schemachanged':
                    let json = target.#theFormContainer.getJSONSchema();
                    target.#jsonHolder.innerHTML = target.#theFormContainer.getJSONSchema();
                    break;
                default:
                    break;
            }
        }
    }

    #createElement(tag, id, attributes) {
        return HtmlUtils.createElement(tag, id, attributes);
    }
}