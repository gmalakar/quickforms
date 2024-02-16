export default class Observer {
    #observer;
    #observingMethod;
    constructor() {
        if (this.constructor == Observer) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    setObserver(observer, observingMethod) {
        this.#observer = observer;
        this.#observingMethod = observingMethod;
    }

    get hasObserver() {
        return this.#observer && this.#observingMethod && typeof this.#observingMethod === 'function';
    }

    signalObserver(event, args) {
        if (this.#observer && this.#observingMethod && typeof this.#observingMethod === 'function') {
            this.#observingMethod(this.#observer, event, args);
        } else {
            throw new Error("Observer has not been set properly");
        }
    }
}