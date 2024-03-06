export default class ScriptLoader {
    constructor() { }
    static baseurl = '';
    static loadCssWithAttrs(cssLinkConfigs, callback) {
        console.log('Loading script...');
        let count = cssLinkConfigs.length;
        const urlCallback = function (url, when) {
            --count;
            console.log(url + ' was loaded by ' + when + ' (' + count + ' more css remaining).');
            if (count < 1 && callback) {
                callback();
            }
        }
        function hasStyleSheet(csslink) {
            var has = false;
            for (var i = 0; i < document.styleSheets.length; i++) {
                has = document.styleSheets[i].href === csslink;
                if (has)
                    break;
            };
            return has;
        };
        const loadCss = function (cfg) {
            var csslink = cfg.src;
            if (csslink.startsWith('http') || (csslink.skipbase != null && (csslink.skipbase === true || csslink.skipbase === 'true'))) {
                csslink = csslink;
            } else {
                csslink = ScriptLoader.baseurl + csslink;
            }
            console.log('Loading css - ' + csslink);
            if (!hasStyleSheet(csslink)) {
                var head = document.getElementsByTagName('head')[0];
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = csslink;
                if (cfg.integrity)
                    link.integrity = cfg.integrity;
                if (cfg.crossorigin)
                    link.crossOrigin = cfg.crossorigin;
                if (cfg.referrerpolicy)
                    link.referrerpolicy = cfg.referrerpolicy;
                link.onload = urlCallback(csslink, 'onload');
                head.appendChild(link);
            } else {
                console.log('Already loaded css - ' + csslink);
            }
        }
        for (var cssConfig of cssLinkConfigs) {
            loadCss(cssConfig);
        }
    };

    static loadCss(cssLinks, callback) {
        console.log('Loading css...');
        let count = cssLinks.length;
        function hasStyleSheet(csslink) {
            var has = false;
            for (var i = 0; i < document.styleSheets.length; i++) {
                has = document.styleSheets[i].href === csslink;
                if (has)
                    break;
            };
            return has;
        };
        const urlCallback = function (csslink, when) {
            --count;
            console.log(csslink + ' was loaded by ' + when + ' (' + count + ' more css remaining).');
            if (count < 1 && callback) {
                callback();
            }
        }
        const loadCss = function (csslink) {
            if (!hasStyleSheet(csslink)) {
                var head = document.getElementsByTagName('head')[0];
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = csslink;
                link.onload = urlCallback(csslink, 'onload');
                head.appendChild(link);
            }
        };
        for (var link of cssLinks) {
            if (!link.startsWith('http')) {
                link = ScriptLoader.baseurl + link;
            };
            loadCss(link);
        }
    };

    static loadJSWithAttrs(scriptConfigs, callback) {
        console.log('Loading script...');
        let count = scriptConfigs.length;
        const urlCallback = function (url, when) {
            --count;
            console.log(url + ' was loaded by ' + when + ' (' + count + ' more scripts remaining).');
            if (count < 1 && callback) {
                callback();
            }
        }
        const loadScript = function (cfg) {
            var url = cfg.src;
            if (cfg.skipbase != null && (cfg.skipbase === true || cfg.skipbase === 'true')) {
                url = url;
            } else {
                url = ScriptLoader.baseurl + url;
            }
            console.log('Loading script - ' + url);
            var s = document.createElement('script');
            s.setAttribute('type', 'text/javascript');
            s.setAttribute('src', url);
            if (cfg.integrity)
                s.setAttribute('integrity', cfg.integrity);
            if (cfg.crossorigin)
                s.setAttribute('crossOrigin', cfg.crossorigin);
            if (cfg.referrerpolicy)
                s.setAttribute('referrerpolicy', cfg.referrerpolicy);
            s.onload = urlCallback(url, 'onload');
            if (cfg.location)
                cfg.location.appendChild(s);
            else
                document.head.appendChild(s);
        }
        for (var scriptConfig of scriptConfigs) {
            loadScript(scriptConfig);
        }
    };

    static loadJS(scripts, callback, location, skipbase) {
        console.log('Loading script...');
        let count = scripts.length;
        const urlCallback = function (url, when) {
            --count;
            console.log(url + ' was loaded by ' + when + ' (' + count + ' more scripts remaining).');
            if (count < 1 && callback) {
                callback();
            }
        }
        const loadScript = function (url) {
            if (url.startsWith('http') || (skipbase != null && skipbase === true)) {
                url = url;
            } else {
                url = ScriptLoader.baseurl + url;
            }
            console.log('Loading script - ' + url);
            var s = document.createElement('script');
            s.setAttribute('type', 'text/javascript');
            s.setAttribute('src', url);
            //s.onreadystatechange = urlCallback(url,'onreadystatechange');
            s.onload = urlCallback(url, 'onload');
            if (location)
                location.appendChild(s);
            else
                document.head.appendChild(s);
        }
        for (var script of scripts) {
            loadScript(script);
        }
    };

}