import CommonUtils from './common-utils.js';

export default class HtmlUtils {
    constructor() { }

    static #validToken = new RegExp('^[A-Za-z][A-Za-z0-9_:\.-]*$');

    static getElement(elementid) {
        let ret;
        if (CommonUtils.isString(elementid)) {//check by id
            ret = document.getElementById(elementid);
        }
        return ret;
    }

    static joinStyles(styles) {
        let style = '';
        if (CommonUtils.isObjcetButNotArray(styles)) {
            for (let [key, val] of Object.entries(styles)) {
                style = `${style}${key}:${val};`;
            }
        } else if (CommonUtils.isArray(styles)) {
            for (let s of styles) {
                style = `${style}${s['name']}:${s['value']};`;
            }
        } return style;
    }

    static isValidName(token) {
        return !CommonUtils.isNullOrEmpty(token) && HtmlUtils.#validToken.test(token);

    }
    static isElement(obj) {
        let ret = !CommonUtils.isNullOrUndefined(obj) && obj instanceof Element;
        if (!ret && CommonUtils.isString(obj)) {//check by id
            ret = !CommonUtils.isNullOrUndefined(document.getElementById(obj));
        }
        return ret;
    }

    static isHTMLElement(obj) {
        let ret = !CommonUtils.isNullOrUndefined(obj) && obj instanceof HTMLElement;
        if (!ret && CommonUtils.isString(obj)) {//check by id
            ret = !CommonUtils.isNullOrUndefined(document.getElementById(obj));
        }
        return ret;
    }

    static createElement(tag, id, attributes) {
        let element = document.createElement(tag);
        if (id && id !== 'noid') {
            element.id = id;
            element.name = id;
        }

        if (CommonUtils.isObjcetButNotArray(attributes)) {
            for (let [key, value] of Object.entries(attributes)) {
                element.setAttribute(key, value);
            }
        }
        return element;
    }

    static isNode(obj) {
        let ret = obj instanceof Node;
        if (!ret && CommonUtils.isString(obj)) {//check by id
            ret = CommonUtils.isNullOrUndefined(document.getElementById(obj));
        }
        return ret;
    }

    static populateOptionsFormJson(targetElement, json) {
        if (HtmlUtils.isHTMLElement(targetElement)) {
            let options = CommonUtils.jsonToObject(json);
            if (options) {
                for (let [text, value] of Object.entries(options)) {
                    var opt = document.createElement('option');
                    opt.value = value;
                    opt.innerHTML = text;
                    targetElement.appendChild(opt);
                }
            }
        }
    }

    static populateOptions(targetElement, options) {
        if (HtmlUtils.isHTMLElement(targetElement) && options) {
            for (let [text, value] of Object.entries(options)) {
                var opt = document.createElement('option');
                opt.value = value;
                opt.innerHTML = text;
                targetElement.appendChild(opt);
            }
        }
    }

    static populateDatalist(targetElement, options) {
        if (HtmlUtils.isHTMLElement(targetElement) && options) {
            if (CommonUtils.isJson(options)) {
                options = CommonUtils.jsonToObject(options);
            }
            if (CommonUtils.isArray(options)) {
                for (let value of options) {
                    var opt = document.createElement('option');
                    opt.value = value;
                    targetElement.appendChild(opt);
                }
            }
        }
    }
    static removeClassByPrefix(el, prefix) {
        let regx = new RegExp('\\b' + prefix + '.*?\\b', 'g');
        el.className = el.className.replace(regx, '');
        return el;
    };

    static removeClasses(el, cls) {
        if (el) {
            for (let c of cls.split(' ')) {
                if (el.classList.contains(c)) {
                    el.classList.remove(c);
                }
            }
        }
    };

    static replaceClass(el, clsToReplace, replaceBy) {
        if (el) {
            me.removeClasses(el, clsToReplace);
            me.addClasses(el, replaceBy);
        }
    };

    static addClasses(el, cls) {
        if (el) {
            for (let c of cls.split(' ')) {
                if (!el.classList.contains(c)) {
                    el.classList.add(c);
                }
            }
        }
    };

    static dataTransferGetData(e) {
        try {
            return JSON.parse(e.dataTransfer.getData("text"))
        } catch {
            return {};
        }
    }

    static dataTransferSetData(e, datafor, datatoset) {
        let data = JSON.stringify({ for: datafor, data: datatoset, x: e.x || e.pageX, y: e.y || e.pageY });
        e.dataTransfer.clearData();
        e.dataTransfer.setData("text", data);
    }

    static dataTransferGetPosition(e) {
        return { x: e.pageX, y: pageY };
    }

    static show(el) {
        if (el && HtmlUtils.isElement(el)) {
            el.style.display = "block";
        }
        else if (el && CommonUtils.isString(el)) {
            let el2 = document.getElementById(el);
            if (el2) {
                el2.style.display = "block";
            }
        };
    }

    static hide(el) {
        if (el && HtmlUtils.isElement(el)) {
            el.style.display = "none";
        }
        else if (el && CommonUtils.isString(el)) {
            let el2 = document.getElementById(el);
            if (el2) {
                el2.style.display = "none";
            }
        };
    }

    static findAncestor(el, cls) {
        while ((el = el.parentElement) && !el.classList.contains(cls));
        return el;
    }

    static removeChilds(parent) {
        if (parent) {
            while (parent.lastChild) {
                parent.removeChild(parent.lastChild);
            }
        }
    };

    static createIconButton(btnAttrs, iconAttrs, name, btntxt) {
        let btnName = name || 'noid';
        let btn = HtmlUtils.createElement('button', btnName, btnAttrs);
        if (iconAttrs) {
            let icon = HtmlUtils.createElement('i', 'noid', iconAttrs);
            if (btntxt) {
                icon.textContent = ` ${btntxt} `;
            }
            btn.appendChild(icon);
        } else {
            if (btntxt) {
                btn.textContent = ` ${btntxt} `;
            }
        }
        return btn;
    }
}