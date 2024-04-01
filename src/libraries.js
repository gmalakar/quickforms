import ScriptLoader from './utils/script-loader.js'
export default class Libraries {
    constructor() {
    }
    static loaded = false;

    static Files = [
        {
            key: 'boostrapjs',
            skipbase: true,
            crossorigin: 'anonymous',
            referrerpolicy: 'no-referrer',
            src: 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js',
            intigrity: 'sha512- X / YkDZyjTf4wyc2Vy16YGCPHwAY8rZJY + POgokZjQB2mhIRFJCckEGc6YyX9eNsPfn0PzThEuNs + uaomE5CO6A ==',
            type: 'javascript'
        },
        {
            skipbase: true,
            crossorigin: 'anonymous',
            referrerpolicy: 'no-referrer',
            key: 'boostrapcss',
            src: 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css',
            intigrity: 'sha512-b2QcS5SsA8tZodcDtGRELiGv5SaKSk1vDHDaQRda0htPYWZ6046lr3kJ5bAAQdpV2mmA/4v0wQF9MyU6/pDIAg==',
            type: 'css'
        },
        {
            key: 'boostrapicons',
            skipbase: true,
            crossorigin: 'anonymous',
            referrerpolicy: 'no-referrer',
            src: 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css',
            intigrity: 'sha512-dPXYcDub/aeb08c63jRq/k6GaKccl256JQy/AnOq7CAnEZ9FzSL9wSbcZkMp4R26vBsMLFYH4kQ67/bbV8XaCQ==',
            type: 'css'
        },
        {
            key: 'slimselect',
            skipbase: true,
            crossorigin: 'anonymous',
            referrerpolicy: 'no-referrer',
            src: 'https://cdnjs.cloudflare.com/ajax/libs/slim-select/2.8.2/slimselect.min.js',
            intigrity: 'sha512-epC0GMFGR8PG5QlzmOu8w6EXjvL+1/93qGAmsWiyZWCmkqGdV4lhoLuQJ9Mge6hsC+Wn0+M8eQ+AiW63zPQggw==',
            type: 'javascript'
        },
        {
            key: 'slimselectcss',
            skipbase: true,
            crossorigin: 'anonymous',
            referrerpolicy: 'no-referrer',
            src: 'https://cdnjs.cloudflare.com/ajax/libs/slim-select/2.8.2/slimselect.min.css',
            intigrity: 'sha512-5nyAgbkuF7NkcIydVHNRVgjpsG2k+bBtP7PHOUMwMb/0vtb4rPdxEf1sqPztb6l6T6wEfisDrzZ+vge2QM6bIg==',
            type: 'css'
        },
        {
            key: 'codemirrorjs',
            skipbase: true,
            crossorigin: 'anonymous',
            referrerpolicy: 'no-referrer',
            src: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/codemirror.min.js',
            intigrity: 'sha512-8RnEqURPUc5aqFEN04aQEiPlSAdE0jlFS/9iGgUyNtwFnSKCXhmB6ZTNl7LnDtDWKabJIASzXrzD0K+LYexU9g==',
            type: 'javascript'
        },
        {
            key: 'codemirrorjs',
            skipbase: true,
            crossorigin: 'anonymous',
            referrerpolicy: 'no-referrer',
            src: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/mode/javascript/javascript.min.js',
            intigrity: 'sha512-I6CdJdruzGtvDyvdO4YsiAq+pkWf2efgd1ZUSK2FnM/u2VuRASPC7GowWQrWyjxCZn6CT89s3ddGI+be0Ak9Fg==',
            type: 'javascript'
        },
        {
            key: 'codemirrorcss',
            skipbase: true,
            crossorigin: 'anonymous',
            referrerpolicy: 'no-referrer',
            src: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/codemirror.min.css',
            intigrity: 'sha512-uf06llspW44/LZpHzHT6qBOIVODjWtv4MxCricRxkzvopAlSWnTf6hpZTFxuuZcuNE9CBQhqE0Seu1CoRk84nQ==',
            type: 'cs'
        },
        {
            key: 'split',
            skipbase: true,
            crossorigin: 'anonymous',
            referrerpolicy: 'no-referrer',
            src: 'https://cdnjs.cloudflare.com/ajax/libs/split.js/1.6.5/split.min.js',
            intigrity: 'sha512-lNjb0qWDVvt1zfSiXufaxtlFtenve3BLbvljxuMXuSr0DE0HYp5OhX0u89uwNd6MvlX1bgJ8ulfG4JMGurs8UA==',
            type: 'javascript'
        },
        {
            key: 'imask',
            src: 'https://cdnjs.cloudflare.com/ajax/libs/imask/7.5.0/imask.min.js',
            intigrity: 'sha512-lNjb0qWDVvt1zfSiXufaxtlFtenve3BLbvljxuMXuSr0DE0HYp5OhX0u89uwNd6MvlX1bgJ8ulfG4JMGurs8UA==',
            type: 'javascript'
        },
    ];

    static load(callback) {
        if (!Libraries.loaded && Libraries.Files) {
            let js = Libraries.Files.filter((script) => script.type === 'javascript');
            let css = Libraries.Files.filter((script) => script.type === 'css');
            ScriptLoader.loadJSWithAttrs(js, () => {
                ScriptLoader.loadCssWithAttrs(css, () => {
                    Libraries.loaded = true;
                    if (callback) {
                        callback();
                    }
                });
            });
        } else {
            if (callback) {
                callback();
            }
        }

    }
}