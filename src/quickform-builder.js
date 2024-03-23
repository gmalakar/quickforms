import Builder from './builder/builder.js'
import FormContainer from './components/form-container.js'
import ScriptLoader from './utils/script-loader.js'
import CommonUtils from './utils/common-utils.js'
import QuickForm from './quickorm.js'
export default class QuickFormBuilder extends QuickForm {
    builder;
    buildercontainer;
    #boostrapJS;
    #boostrapCSS;
    #boostrapICONS;
    #otherScripts;

    //define scripts here
    static #localCss = [
        '/src/quickform.css'
    ]

    constructor(buildercontainer) {
        super();
        this.buildercontainer = buildercontainer;
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
    #loadOtherScripts(callback) {
        if (this.#otherScripts && CommonUtils.isArray(this.#otherScripts)) {
            let js = this.#otherScripts.filter((script) => script.type === 'javascript');
            let css = this.#otherScripts.filter((script) => script.type === 'css');
            ScriptLoader.loadJSWithAttrs(js, () => {
                ScriptLoader.loadCssWithAttrs(css, () => {
                    if (callback) {
                        callback();
                    }
                });
            });
        } else {
            if (callback) {
                callback();
            }
        }

    }

    #loadScriptsAndBuilder(callback) {
        if (this.#boostrapJS && this.#boostrapCSS && this.#boostrapICONS) {
            ScriptLoader.loadJSWithAttrs([this.#boostrapJS], () => {
                ScriptLoader.loadCssWithAttrs([this.#boostrapCSS, this.#boostrapICONS], () => {
                    this.#loadOtherScripts(() => {
                        this.#loadBuilder(() => {
                            if (callback) {
                                callback();
                            }
                        });
                    })
                });
            });
        } else {
            this.#loadBuilder(() => {
                if (callback) {
                    callback();
                }
            });
        }
    }

    setOtherRequiredScripts(scriptArray) {
        this.#otherScripts = scriptArray;
    }

    setBootstrapJS(src, integrity, crossorigin = 'anonymous', referrerpolicy = 'no-referrer') {
        this.#boostrapJS = { skipbase: true };
        this.#boostrapJS.src = src;
        this.#boostrapJS.integrity = integrity;
        this.#boostrapJS.crossorigin = crossorigin;
        this.#boostrapJS.referrerpolicy = referrerpolicy;
    }

    setBootstrapCss(src, integrity, crossorigin = 'anonymous', referrerpolicy = 'no-referrer') {
        this.#boostrapCSS = { skipbase: true };
        this.#boostrapCSS.src = src;
        this.#boostrapCSS.integrity = integrity;
        this.#boostrapCSS.crossorigin = crossorigin;
        this.#boostrapCSS.referrerpolicy = referrerpolicy;
    }

    setBootstrapIcons(src, integrity, crossorigin = 'anonymous', referrerpolicy = 'no-referrer') {
        this.#boostrapICONS = { skipbase: true };
        this.#boostrapICONS.src = src;
        this.#boostrapICONS.integrity = integrity;
        this.#boostrapICONS.crossorigin = crossorigin;
        this.#boostrapICONS.referrerpolicy = referrerpolicy;
    }

    loadFormInBuilder(schema, callback) {
        if (!this.builder) {
            this.startBuilder(() => {
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

    startBuilder(callback) {
        this.#loadScriptsAndBuilder(() => {
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