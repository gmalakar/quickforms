import Container from './container.js';

export default class Form extends Container {

    constructor(schema, observer, designmode = false) {

        super(schema, observer, null, designmode);
    }

}
