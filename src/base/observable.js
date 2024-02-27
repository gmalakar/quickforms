import Observer from "./observer.js";

export default class Observable {
    observer;
    observingMethod;
    constructor() {
        if (this.constructor == Observable) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    setObserver(observer) {
        if (observer instanceof Observer) {
            this.observer = observer;
        } else {
            throw new Error("Invalid observer class.");
        }
    }

    get hasObserver() {
        return this.observer && this.observer.listener && typeof this.observer.listener === 'function';
    }

    signalObserver(event, args) {
        if (this.hasObserver) {
            this.observer.listener(this.observer.target, event, args);
        } else {
            throw new Error("Observer has not been set properly");
        }
    }
}