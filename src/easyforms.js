import FormContainer from './components/form-container.js'
export default class EasyForms {
    constructor() {
    }

    getForm(schema) {
        return new FormContainer(schema);
    }
}