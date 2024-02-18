import CommonUtils from '../utils/common-utils.js';
import BaseControl from '../base/base-control.js';
import HtmlUtils from '../utils/html-utils.js';
export default class Columns extends BaseControl {
    constructor(containingComponent) {
        super(containingComponent, 'Columns');
        this.buildControl();
    }

    setLabelControl() {
        let lblProps = {
            for: this.name,
            class: this.labelClass
        }

        this.captionControl = HtmlUtils.createElement('label', 'noid', lblProps);
        if( CommonUtils.isNullOrEmpty(this.compMetaData.caption)){
            this.caption = 'sdsdsdfsdfsdf';
        }else{
            this.caption = 'No Label';
        }
    }
}