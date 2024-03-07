import CommonUtils from './common-utils.js';
import HtmlUtils from './html-utils.js';

export default class PanelControl {

    panel;
    id;
    header;
    body;
    title;
    footer;
    caption;

    panelClasses = { panel: ['px-2'] };

    panelStyles = {};

    panelAttributes = {};

    constructor(id, caption) {
        this.id = id;
        this.caption = caption
        this.buildPanel();
    }

    setCaption(caption) {
        this.caption = caption;
        if (this.title) {
            this.title.textContent = this.caption;
        }
    }

    setHeaderStyles(styleArray, reset = false) {
        this.#setStyles('header', styleArray, reset);
    }

    setTitleStyles(styleArray, reset = false) {
        this.#setStyles('title', styleArray, reset);
    }

    setBodyStyles(styleArray, reset = false) {
        this.#setStyles('body', styleArray, reset);
    }

    setHeaderStyles(styleArray, reset = false) {
        this.#setStyles('header', styleArray, reset);
    }

    setPanelStyles(styleArray, reset = false) {
        this.#setStyles('panel', styleArray, reset);
    }

    setPanelStyles(styleArray, reset = false) {
        this.#setStyles('panel', styleArray, reset);
    }

    setFooterStyles(styleArray, reset = false) {
        this.#setStyles('footer', styleArray, reset);
    }

    setHeaderClass(cls, reset = false) {
        this.#setClass('hesder', cls, reset);
    }

    setTitleClass(cls, reset = false) {
        this.#setClass('title', cls, reset);
    }

    setBodyClass(cls, reset = false) {
        this.#setClass('body', cls, reset);
    }

    setPanelClass(cls, reset = false) {
        this.#setClass('panel', cls, reset);
    }

    setFooterClass(cls, reset = false) {
        this.#setClass('footer', cls, reset);
    }

    setHeaderAttributes(attrsArray, reset = false) {
        this.#setAttributs('header', attrsArray, reset);
    }

    setTitleAttributes(attrsArray, reset = false) {
        this.#setAttributs('title', attrsArray, reset);
    }

    setBodyAttributes(attrsArray, reset = false) {
        this.#setAttributs('body', attrsArray), reset;
    }

    setHeaderAttributes(attrsArray, reset = false) {
        this.#setAttributs('header', attrsArray, reset);
    }

    setPanelAttributes(attrsArray, reset = false) {
        this.#setAttributs('panel', attrsArray, reset);
    }

    setPanelAttributes(attrsArray, reset = false) {
        this.#setAttributs('panel', attrsArray), reset;
    }

    setFooterAttributes(attrsArray, reset = false) {
        this.#setAttributs('footer', attrsArray, reset);
    }

    #getCrtl(type) {
        let crtl;
        switch (type) {
            case "header":
                crtl = this.header;
                break;
            case "body":
                crtl = this.body;
                break;
            case "title":
                crtl = this.title;
                break;
            case "panel":
                crtl = this.panel;
                break;
            case "footer":
                crtl = this.footer;
                break;
            default:
                break;
        }
        return crtl;
    }

    #setClass(type, cls, reset = false) {
        let crtl = this.#getCrtl(type);
        let curCls = this.panelClasses[type]
        if (!curCls && !reset) {
            curCls = [];
            this.panelClasses[type] = curCls;
        }
        if (crtl) {
            if (reset && CommonUtils.isArray(curCls)) {
                for (let key of curCls) {
                    crtl.classList.remove(key);
                }
            }
            if (cls && !CommonUtils.isArray(cls)) {
                cls = cls.split(' ');
            }
            if (CommonUtils.isArray(cls)) {
                for (let key of cls) {
                    crtl.classList.add(key);
                    if (!reset) {
                        if (!curCls.includes(key)) {
                            curCls.push(key);
                        }
                    }
                }
                if (reset) {
                    this.panelClasses[type] = cls;
                }
            }
        }
    }

    #setStyles(type, styles, reset = false) {
        let crtl = this.#getCrtl(type);
        let curStyles = this.panelStyles[type];
        if (!curStyles && !reset) {
            curStyles = [];
            this.panelStyles[type] = curStyles;
        }
        if (crtl) {
            if (reset && CommonUtils.isArray(curStyles)) {
                for (let style of curStyles) {
                    if (style.name) {
                        crtl.style.removeProperty(style.name);
                    }
                }
            }
            if (CommonUtils.isArray(styles)) {
                for (let style of styles) {
                    if (style.name) {
                        crtl.style.setProperty(style.name, style.value);
                        if (!reset) {
                            curStyles[style.name] = style.value;
                        }
                    }
                }
                if (reset) {
                    this.panelStyles[type] = styles;
                }
            }
        }
    }

    #setAttributs(type, attrs, reset = false) {
        let crtl = this.#getCrtl(type);
        let curAttrs = this.panelAttributes[type];
        if (!curAttrs && !reset) {
            curAttrs = [];
            this.panelAttributes[type] = curAttrs;
        }
        if (crtl) {
            if (reset && CommonUtils.isArray(curAttrs)) {
                for (let attr of curAttrs) {
                    if (attr.name) {
                        crtl.removeAttribute(attr.name);
                    }
                }
            }
            if (CommonUtils.isArray(attrs)) {
                for (let attr of attrs) {
                    if (attr.name) {
                        crtl.setAttribute(attr.name, attr.value);
                        if (!reset) {
                            curAttrs[attr.name] = attr.value;
                        }
                    }
                }
                if (reset) {
                    this.panelAttributes[type] = attrs;
                }
            }
        }
    }

    buildPanel() {
        this.panel = HtmlUtils.createElement(
            "div",
            this.id,
            { class: 'card' }
        );

        //header
        this.header = HtmlUtils.createElement(
            "div",
            'noid',
            { class: 'card-header' }
        );

        let ttlAttrs = {};
        ttlAttrs.class = `card-title`;

        ttlAttrs['aria-controls'] = this.id;
        ttlAttrs['aria-expanded'] = true;
        ttlAttrs['role'] = 'button';
        this.title = HtmlUtils.createElement(
            "span",
            'noid',
            ttlAttrs
        );

        this.title.textContent = this.caption;

        this.header.appendChild(this.title);

        //body
        this.body = HtmlUtils.createElement(
            "div",
            this.id,
            { class: 'card-body' }
        );

        if (this.header) {
            this.panel.appendChild(this.header);
        }

        this.panel.appendChild(this.body);

        //footer
        if (this.footer) {
            this.panel.appendChild(this.footer);
        }
    }

    resetPanel() {
        HtmlUtils.removeChilds(this.body);
        //set class
        for (let [key, cls] of Object.entries(this.panelClasses)) {
            this.#setClass(key, cls, true);
        }
        //set styles
        for (let [key, style] of Object.entries(this.panelStyles)) {
            this.#setStyles(key, style, true);
        }
        //set class
        for (let [key, attr] of Object.entries(this.panelAttributes)) {
            this.#setAttributs(key, attr, true);
        }
    }
}
