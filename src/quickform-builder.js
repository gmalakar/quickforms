import Builder from './builder/builder.js'
import FormContainer from './components/form-container.js'
import ScriptLoader from './utils/script-loader.js'
import QuickForm from './quickorm.js'
import Libraries from './libraries.js'
export default class QuickFormBuilder extends QuickForm {
    builder;
    buildercontainer;

    //define scripts here
    static #localCss = [
        '/src/quickform.css'
    ]

    constructor() {
        super();
        //this.loadScripts();
    }
    #loadBuilder(callback) {
        ScriptLoader.loadCss(QuickFormBuilder.#localCss, () => {
            this.builder = new Builder(this.buildercontainer);
            if (callback) {
                callback();
            }
        })
    }


    #loadLibsAndBuilder(callback) {
        Libraries.load(() => {
            this.#loadBuilder(() => {
                if (callback) {
                    callback();
                }
            });
        });
    }

    loadFormInBuilder(container, schema, callback) {
        if (!this.builder) {
            this.startBuilder(container, () => {
                setTimeout(() => {
                    this.builder.buildBuilder(schema);
                    if (callback) {
                        callback();
                    }
                }, 100);
            });
        } else {
            setTimeout(() => {
                this.builder.buildBuilder(schema);
                if (callback) {
                    callback();
                }
            }, 100);
        }
    }

    startBuilder(container, callback) {
        this.buildercontainer = container;
        this.#loadLibsAndBuilder(() => {
            console.log('builder loaded');
            if (callback) {
                callback();
            }
        });
    }

    createForm(schema) {
        return new FormContainer(schema);
    }
}