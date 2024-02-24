import Container from './container.js';
export default class Form extends Container {

    constructor(formname, metaData, observer, observingMethod, indDsigMode = false) {

        super(formname, metaData, observer, observingMethod, null, indDsigMode);
    }
}
