import HtmlUtils from '../utils/html-utils.js';
export default class Container {

  containerClass = 'fb-container'
  refId;
  containerControl;
  #observer;

  constructor(refId) {
    this.refId = refId;
  }

  // Callback function to execute when mutations are observed
  #nodeChanged = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          //node added
          let control = mutation.addedNodes[0];
          this.controls[control.name] = control;

        }
        else if (mutation.removedNodes && mutation.removedNodes.length > 0) {
          //node removed
          let control = mutation.removedNodes[0];
          if (this.controls.hasOwnProperty(control.name)) {
            delete this.controls[control.name];
          }
        }
      }
    }
  };

  controls = {}

  #config = { childList: true };
  get control() {

    if (!this.containerControl) {
      this.containerControl = HtmlUtils.createElement('div', 'noid', { novalidate: ``, class: this.containerClass, ref: this.refId });
      this.#observer = new MutationObserver(this.#nodeChanged);
      this.#observer.observe(this.containerControl, this.#config);
    }
    return this.containerControl;
  }

  changeName(oldname, newname){
    if (this.controls.hasOwnProperty(oldname)) {
      let control = this.controls[oldname];
      delete this.controls[oldname];
      //add new one
      this.controls[newname] = control;
    }
  }
}