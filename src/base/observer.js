export default class Observer {
    observer;
    listener;
    constructor(observer, listener) {
        this.observer = observer;
        this.listener = listener;
    }
}