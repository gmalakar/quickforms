export default class Observer {
    target;
    listener;
    constructor(observer, listener) {
        this.target = observer;
        this.listener = listener;
    }
}