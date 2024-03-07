export default class BootstrapUtils {
    constructor() {
    }
    static getBSComponentClass(type) {
        let cls = '';
        switch (type) {
            case "checkbox":
            case "radio":
                cls = 'form-check';
                break;
            default:
                break;
        }
        return cls;
    }

    static getBSElementClass(type) {
        let cls = 'form-control';
        switch (type) {
            case "checkbox":
            case "radio":
                cls = 'form-check-input align-middle';
                break;
            case "button":
                cls = 'btn';
                break;
            default:
                break;
        }
        return cls;
    }

    static getBSlabelClass(type) {
        let cls = 'form-label';
        switch (type) {
            case "checkbox":
            case "radio":
                cls = 'form-check-label align-middle';
                break;
            default:
                break;
        }
        return cls;
    }
    static getBSRowOrColClass(type) {
        let cls = 'row';
        switch (type) {
            case "checkbox":
            case "radio":
                cls = 'col';
                break;
            default:
                break;
        }
        return cls;
    }
}