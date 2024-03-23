import FormContainer from './components/form-container.js'
export default class QuickForm {
    constructor() {
    }

    createForm(schema) {
        return new FormContainer(schema);
    }
}