import Builder from './builder/builder.js'
import FormContainer from './components/form-container.js'
import ScriptLoader from './utils/script-loader.js'
export default class FormBuilder {
    builder;
    buildercontainer;

    //define scripts here
    static #localCss = [
        '/src/css/formbuilder.css'
    ]

    constructor(buildercontainer) {
        this.buildercontainer = buildercontainer;
        this.loadScripts();
    }

    loadScripts() {
        ScriptLoader.loadCss(FormBuilder.#localCss, () => {
            setTimeout(() => {
                this.builder = new Builder(this.buildercontainer);
            }, 100);
        })
    }

    static #domReady(fn) {
        window.onload = function (e) {
            fn();
        }
    }

    #afterLoad() {
        FormBuilder.#domReady(() => {
            let selectCtrls = document.getElementsByClassName('slim-select')
            for (let el of selectCtrls) {
                new SlimSelect({
                    select: el.id
                })
            }
        })
    }
    loadFormInBuilder(schema, callback) {
        this.builder = new Builder(this.buildercontainer);
        this.builder.buildBuilder(schema);
        //this.#afterLoad();
        if (callback) {
            callback();
        }
    }

    getForm(schema) {
        return new FormContainer(schema);
    }
}