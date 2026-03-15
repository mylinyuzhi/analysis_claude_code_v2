
// @from(Ln 350749, Col 4)
Og8 = x((wow, Ve4) => {
    var mX = fk1();
    Ve4.exports = Ul6;

    function Ul6() {}
    Ul6.prototype = Object.create(Object.prototype, {
        _url: {
            get: function() {
                return new mX(this.href)
            }
        },
        protocol: {
            get: function() {
                var A = this._url;
                if (A && A.scheme) return A.scheme + ":";
                else return ":"
            },
            set: function(A) {
                var q = this.href,
                    K = new mX(q);
                if (K.isAbsolute()) {
                    if (A = A.replace(/:+$/, ""), A = A.replace(/[^-+\.a-zA-Z0-9]/g, mX.percentEncode), A.length > 0) K.scheme = A, q = K.toString()
                }
                this.href = q
            }
        },
        host: {
            get: function() {
                var A = this._url;
                if (A.isAbsolute() && A.isAuthorityBased()) return A.host + (A.port ? ":" + A.port : "");
                else return ""
            },
            set: function(A) {
                var q = this.href,
                    K = new mX(q);
                if (K.isAbsolute() && K.isAuthorityBased()) {
                    if (A = A.replace(/[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g, mX.percentEncode), A.length > 0) K.host = A, delete K.port, q = K.toString()
                }
                this.href = q
            }
        },
        hostname: {
            get: function() {
                var A = this._url;
                if (A.isAbsolute() && A.isAuthorityBased()) return A.host;
                else return ""
            },
            set: function(A) {
                var q = this.href,
                    K = new mX(q);
                if (K.isAbsolute() && K.isAuthorityBased()) {
                    if (A = A.replace(/^\/+/, ""), A = A.replace(/[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g, mX.percentEncode), A.length > 0) K.host = A, q = K.toString()
                }
                this.href = q
            }
        },
        port: {
            get: function() {
                var A = this._url;
                if (A.isAbsolute() && A.isAuthorityBased() && A.port !== void 0) return A.port;
                else return ""
            },
            set: function(A) {
                var q = this.href,
                    K = new mX(q);
                if (K.isAbsolute() && K.isAuthorityBased()) {
                    if (A = "" + A, A = A.replace(/[^0-9].*$/, ""), A = A.replace(/^0+/, ""), A.length === 0) A = "0";
                    if (parseInt(A, 10) <= 65535) K.port = A, q = K.toString()
                }
                this.href = q
            }
        },
        pathname: {
            get: function() {
                var A = this._url;
                if (A.isAbsolute() && A.isHierarchical()) return A.path;
                else return ""
            },
            set: function(A) {
                var q = this.href,
                    K = new mX(q);
                if (K.isAbsolute() && K.isHierarchical()) {
                    if (A.charAt(0) !== "/") A = "/" + A;
                    A = A.replace(/[^-+\._~!$&'()*,;:=@\/a-zA-Z0-9]/g, mX.percentEncode), K.path = A, q = K.toString()
                }
                this.href = q
            }
        },
        search: {
            get: function() {
                var A = this._url;
                if (A.isAbsolute() && A.isHierarchical() && A.query !== void 0) return "?" + A.query;
                else return ""
            },
            set: function(A) {
                var q = this.href,
                    K = new mX(q);
                if (K.isAbsolute() && K.isHierarchical()) {
                    if (A.charAt(0) === "?") A = A.substring(1);
                    A = A.replace(/[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g, mX.percentEncode), K.query = A, q = K.toString()
                }
                this.href = q
            }
        },
        hash: {
            get: function() {
                var A = this._url;
                if (A == null || A.fragment == null || A.fragment === "") return "";
                else return "#" + A.fragment
            },
            set: function(A) {
                var q = this.href,
                    K = new mX(q);
                if (A.charAt(0) === "#") A = A.substring(1);
                A = A.replace(/[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g, mX.percentEncode), K.fragment = A, q = K.toString(), this.href = q
            }
        },
        username: {
            get: function() {
                var A = this._url;
                return A.username || ""
            },
            set: function(A) {
                var q = this.href,
                    K = new mX(q);
                if (K.isAbsolute()) A = A.replace(/[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\:]/g, mX.percentEncode), K.username = A, q = K.toString();
                this.href = q
            }
        },
        password: {
            get: function() {
                var A = this._url;
                return A.password || ""
            },
            set: function(A) {
                var q = this.href,
                    K = new mX(q);
                if (K.isAbsolute()) {
                    if (A === "") K.password = null;
                    else A = A.replace(/[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\]/g, mX.percentEncode), K.password = A;
                    q = K.toString()
                }
                this.href = q
            }
        },
        origin: {
            get: function() {
                var A = this._url;
                if (A == null) return "";
                var q = function(K) {
                    var Y = [A.scheme, A.host, +A.port || K];
                    return Y[0] + "://" + Y[1] + (Y[2] === K ? "" : ":" + Y[2])
                };
                switch (A.scheme) {
                    case "ftp":
                        return q(21);
                    case "gopher":
                        return q(70);
                    case "http":
                    case "ws":
                        return q(80);
                    case "https":
                    case "wss":
                        return q(443);
                    default:
                        return A.scheme + "://"
                }
            }
        }
    });
    Ul6._inherit = function(A) {
        Object.getOwnPropertyNames(Ul6.prototype).forEach(function(q) {
            if (q === "constructor" || q === "href") return;
            var K = Object.getOwnPropertyDescriptor(Ul6.prototype, q);
            Object.defineProperty(A, q, K)
        })
    }
})
// @from(Ln 350927, Col 4)
$g8 = x((Oow, ye4) => {
    var ke4 = RB8(),
        ghY = _k1().isApiWritable;
    ye4.exports = function(A, q, K, Y) {
        var z = A.ctor;
        if (z) {
            var _ = A.props || {};
            if (A.attributes)
                for (var w in A.attributes) {
                    var O = A.attributes[w];
                    if (typeof O !== "object" || Array.isArray(O)) O = {
                        type: O
                    };
                    if (!O.name) O.name = w.toLowerCase();
                    _[w] = ke4.property(O)
                }
            if (_.constructor = {
                    value: z,
                    writable: ghY
                }, z.prototype = Object.create((A.superclass || q).prototype, _), A.events) phY(z, A.events);
            K[A.name] = z
        } else z = q;
        return (A.tags || A.tag && [A.tag] || []).forEach(function($) {
            Y[$] = z
        }), z
    };

    function Ee4(A, q, K, Y) {
        this.body = A, this.document = q, this.form = K, this.element = Y
    }
    Ee4.prototype.build = function() {
        return () => {}
    };

    function FhY(A, q, K, Y) {
        var z = A.ownerDocument || Object.create(null),
            _ = A.form || Object.create(null);
        A[q] = new Ee4(Y, z, _, A).build()
    }

    function phY(A, q) {
        var K = A.prototype;
        q.forEach(function(Y) {
            Object.defineProperty(K, "on" + Y, {
                get: function() {
                    return this._getEventHandler(Y)
                },
                set: function(z) {
                    this._setEventHandler(Y, z)
                }
            }), ke4.registerChangeHandler(A, "on" + Y, FhY)
        })
    }
})
// @from(Ln 350981, Col 4)
Nk1 = x((lhY) => {
    var Hg8 = u0(),
        Le4 = DT6(),
        QhY = Tk1(),
        WE = Hj(),
        Re4 = Og8(),
        UhY = $g8(),
        El = lhY.elements = {},
        dl6 = Object.create(null);
    lhY.createElement = function(A, q, K) {
        var Y = dl6[q] || chY;
        return new Y(A, q, K)
    };

    function O4(A) {
        return UhY(A, kq, El, dl6)
    }

    function jj(A) {
        return {
            get: function() {
                var q = this._getattr(A);
                if (q === null) return "";
                var K = this.doc._resolve(q);
                return K === null ? q : K
            },
            set: function(q) {
                this._setattr(A, q)
            }
        }
    }

    function vk1(A) {
        return {
            get: function() {
                var q = this._getattr(A);
                if (q === null) return null;
                if (q.toLowerCase() === "use-credentials") return "use-credentials";
                return "anonymous"
            },
            set: function(q) {
                if (q === null || q === void 0) this.removeAttribute(A);
                else this._setattr(A, q)
            }
        }
    }
    var PT6 = {
            type: ["", "no-referrer", "no-referrer-when-downgrade", "same-origin", "origin", "strict-origin", "origin-when-cross-origin", "strict-origin-when-cross-origin", "unsafe-url"],
            missing: ""
        },
        dhY = {
            A: !0,
            LINK: !0,
            BUTTON: !0,
            INPUT: !0,
            SELECT: !0,
            TEXTAREA: !0,
            COMMAND: !0
        },
        ub = function(A, q, K) {
            kq.call(this, A, q, K), this._form = null
        },
        kq = lhY.HTMLElement = O4({
            superclass: Le4,
            name: "HTMLElement",
            ctor: function(q, K, Y) {
                Le4.call(this, q, K, WE.NAMESPACE.HTML, Y)
            },
            props: {
                dangerouslySetInnerHTML: {
                    set: function(A) {
                        this._innerHTML = A
                    }
                },
                innerHTML: {
                    get: function() {
                        return this.serialize()
                    },
                    set: function(A) {
                        var q = this.ownerDocument.implementation.mozHTMLParser(this.ownerDocument._address, this);
                        q.parse(A === null ? "" : String(A), !0);
                        var K = this instanceof dl6.template ? this.content : this;
                        while (K.hasChildNodes()) K.removeChild(K.firstChild);
                        K.appendChild(q._asDocumentFragment())
                    }
                },
                style: {
                    get: function() {
                        if (!this._style) this._style = new QhY(this);
                        return this._style
                    },
                    set: function(A) {
                        if (A === null || A === void 0) A = "";
                        this._setattr("style", String(A))
                    }
                },
                blur: {
                    value: function() {}
                },
                focus: {
                    value: function() {}
                },
                forceSpellCheck: {
                    value: function() {}
                },
                click: {
                    value: function() {
                        if (this._click_in_progress) return;
                        this._click_in_progress = !0;
                        try {
                            if (this._pre_click_activation_steps) this._pre_click_activation_steps();
                            var A = this.ownerDocument.createEvent("MouseEvent");
                            A.initMouseEvent("click", !0, !0, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, !1, !1, !1, !1, 0, null);
                            var q = this.dispatchEvent(A);
                            if (q) {
                                if (this._post_click_activation_steps) this._post_click_activation_steps(A)
                            } else if (this._cancelled_activation_steps) this._cancelled_activation_steps()
                        } finally {
                            this._click_in_progress = !1
                        }
                    }
                },
                submit: {
                    value: WE.nyi
                }
            },
            attributes: {
                title: String,
                lang: String,
                dir: {
                    type: ["ltr", "rtl", "auto"],
                    missing: ""
                },
                draggable: {
                    type: ["true", "false"],
                    treatNullAsEmptyString: !0
                },
                spellcheck: {
                    type: ["true", "false"],
                    missing: ""
                },
                enterKeyHint: {
                    type: ["enter", "done", "go", "next", "previous", "search", "send"],
                    missing: ""
                },
                autoCapitalize: {
                    type: ["off", "on", "none", "sentences", "words", "characters"],
                    missing: ""
                },
                autoFocus: Boolean,
                accessKey: String,
                nonce: String,
                hidden: Boolean,
                translate: {
                    type: ["no", "yes"],
                    missing: ""
                },
                tabIndex: {
                    type: "long",
                    default: function() {
                        if (this.tagName in dhY || this.contentEditable) return 0;
                        else return -1
                    }
                }
            },
            events: ["abort", "canplay", "canplaythrough", "change", "click", "contextmenu", "cuechange", "dblclick", "drag", "dragend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "durationchange", "emptied", "ended", "input", "invalid", "keydown", "keypress", "keyup", "loadeddata", "loadedmetadata", "loadstart", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "mousewheel", "pause", "play", "playing", "progress", "ratechange", "readystatechange", "reset", "seeked", "seeking", "select", "show", "stalled", "submit", "suspend", "timeupdate", "volumechange", "waiting", "blur", "error", "focus", "load", "scroll"]
        }),
        chY = O4({
            name: "HTMLUnknownElement",
            ctor: function(q, K, Y) {
                kq.call(this, q, K, Y)
            }
        }),
        mb = {
            form: {
                get: function() {
                    return this._form
                }
            }
        };
    O4({
        tag: "a",
        name: "HTMLAnchorElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        props: {
            _post_click_activation_steps: {
                value: function(A) {
                    if (this.href) this.ownerDocument.defaultView.location = this.href
                }
            }
        },
        attributes: {
            href: jj,
            ping: String,
            download: String,
            target: String,
            rel: String,
            media: String,
            hreflang: String,
            type: String,
            referrerPolicy: PT6,
            coords: String,
            charset: String,
            name: String,
            rev: String,
            shape: String
        }
    });
    Re4._inherit(dl6.a.prototype);
    O4({
        tag: "area",
        name: "HTMLAreaElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            alt: String,
            target: String,
            download: String,
            rel: String,
            media: String,
            href: jj,
            hreflang: String,
            type: String,
            shape: String,
            coords: String,
            ping: String,
            referrerPolicy: PT6,
            noHref: Boolean
        }
    });
    Re4._inherit(dl6.area.prototype);
    O4({
        tag: "br",
        name: "HTMLBRElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            clear: String
        }
    });
    O4({
        tag: "base",
        name: "HTMLBaseElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            target: String
        }
    });
    O4({
        tag: "body",
        name: "HTMLBodyElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        events: ["afterprint", "beforeprint", "beforeunload", "blur", "error", "focus", "hashchange", "load", "message", "offline", "online", "pagehide", "pageshow", "popstate", "resize", "scroll", "storage", "unload"],
        attributes: {
            text: {
                type: String,
                treatNullAsEmptyString: !0
            },
            link: {
                type: String,
                treatNullAsEmptyString: !0
            },
            vLink: {
                type: String,
                treatNullAsEmptyString: !0
            },
            aLink: {
                type: String,
                treatNullAsEmptyString: !0
            },
            bgColor: {
                type: String,
                treatNullAsEmptyString: !0
            },
            background: String
        }
    });
    O4({
        tag: "button",
        name: "HTMLButtonElement",
        ctor: function(q, K, Y) {
            ub.call(this, q, K, Y)
        },
        props: mb,
        attributes: {
            name: String,
            value: String,
            disabled: Boolean,
            autofocus: Boolean,
            type: {
                type: ["submit", "reset", "button", "menu"],
                missing: "submit"
            },
            formTarget: String,
            formAction: jj,
            formNoValidate: Boolean,
            formMethod: {
                type: ["get", "post", "dialog"],
                invalid: "get",
                missing: ""
            },
            formEnctype: {
                type: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"],
                invalid: "application/x-www-form-urlencoded",
                missing: ""
            }
        }
    });
    O4({
        tag: "dl",
        name: "HTMLDListElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            compact: Boolean
        }
    });
    O4({
        tag: "data",
        name: "HTMLDataElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            value: String
        }
    });
    O4({
        tag: "datalist",
        name: "HTMLDataListElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        }
    });
    O4({
        tag: "details",
        name: "HTMLDetailsElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            open: Boolean
        }
    });
    O4({
        tag: "div",
        name: "HTMLDivElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            align: String
        }
    });
    O4({
        tag: "embed",
        name: "HTMLEmbedElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            src: jj,
            type: String,
            width: String,
            height: String,
            align: String,
            name: String
        }
    });
    O4({
        tag: "fieldset",
        name: "HTMLFieldSetElement",
        ctor: function(q, K, Y) {
            ub.call(this, q, K, Y)
        },
        props: mb,
        attributes: {
            disabled: Boolean,
            name: String
        }
    });
    O4({
        tag: "form",
        name: "HTMLFormElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            action: String,
            autocomplete: {
                type: ["on", "off"],
                missing: "on"
            },
            name: String,
            acceptCharset: {
                name: "accept-charset"
            },
            target: String,
            noValidate: Boolean,
            method: {
                type: ["get", "post", "dialog"],
                invalid: "get",
                missing: "get"
            },
            enctype: {
                type: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"],
                invalid: "application/x-www-form-urlencoded",
                missing: "application/x-www-form-urlencoded"
            },
            encoding: {
                name: "enctype",
                type: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"],
                invalid: "application/x-www-form-urlencoded",
                missing: "application/x-www-form-urlencoded"
            }
        }
    });
    O4({
        tag: "hr",
        name: "HTMLHRElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            align: String,
            color: String,
            noShade: Boolean,
            size: String,
            width: String
        }
    });
    O4({
        tag: "head",
        name: "HTMLHeadElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        }
    });
    O4({
        tags: ["h1", "h2", "h3", "h4", "h5", "h6"],
        name: "HTMLHeadingElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            align: String
        }
    });
    O4({
        tag: "html",
        name: "HTMLHtmlElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            xmlns: jj,
            version: String
        }
    });
    O4({
        tag: "iframe",
        name: "HTMLIFrameElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            src: jj,
            srcdoc: String,
            name: String,
            width: String,
            height: String,
            seamless: Boolean,
            allow: Boolean,
            allowFullscreen: Boolean,
            allowUserMedia: Boolean,
            allowPaymentRequest: Boolean,
            referrerPolicy: PT6,
            loading: {
                type: ["eager", "lazy"],
                treatNullAsEmptyString: !0
            },
            align: String,
            scrolling: String,
            frameBorder: String,
            longDesc: jj,
            marginHeight: {
                type: String,
                treatNullAsEmptyString: !0
            },
            marginWidth: {
                type: String,
                treatNullAsEmptyString: !0
            }
        }
    });
    O4({
        tag: "img",
        name: "HTMLImageElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            alt: String,
            src: jj,
            srcset: String,
            crossOrigin: vk1,
            useMap: String,
            isMap: Boolean,
            sizes: String,
            height: {
                type: "unsigned long",
                default: 0
            },
            width: {
                type: "unsigned long",
                default: 0
            },
            referrerPolicy: PT6,
            loading: {
                type: ["eager", "lazy"],
                missing: ""
            },
            name: String,
            lowsrc: jj,
            align: String,
            hspace: {
                type: "unsigned long",
                default: 0
            },
            vspace: {
                type: "unsigned long",
                default: 0
            },
            longDesc: jj,
            border: {
                type: String,
                treatNullAsEmptyString: !0
            }
        }
    });
    O4({
        tag: "input",
        name: "HTMLInputElement",
        ctor: function(q, K, Y) {
            ub.call(this, q, K, Y)
        },
        props: {
            form: mb.form,
            _post_click_activation_steps: {
                value: function(A) {
                    if (this.type === "checkbox") this.checked = !this.checked;
                    else if (this.type === "radio") {
                        var q = this.form.getElementsByName(this.name);
                        for (var K = q.length - 1; K >= 0; K--) {
                            var Y = q[K];
                            Y.checked = Y === this
                        }
                    }
                }
            }
        },
        attributes: {
            name: String,
            disabled: Boolean,
            autofocus: Boolean,
            accept: String,
            alt: String,
            max: String,
            min: String,
            pattern: String,
            placeholder: String,
            step: String,
            dirName: String,
            defaultValue: {
                name: "value"
            },
            multiple: Boolean,
            required: Boolean,
            readOnly: Boolean,
            checked: Boolean,
            value: String,
            src: jj,
            defaultChecked: {
                name: "checked",
                type: Boolean
            },
            size: {
                type: "unsigned long",
                default: 20,
                min: 1,
                setmin: 1
            },
            width: {
                type: "unsigned long",
                min: 0,
                setmin: 0,
                default: 0
            },
            height: {
                type: "unsigned long",
                min: 0,
                setmin: 0,
                default: 0
            },
            minLength: {
                type: "unsigned long",
                min: 0,
                setmin: 0,
                default: -1
            },
            maxLength: {
                type: "unsigned long",
                min: 0,
                setmin: 0,
                default: -1
            },
            autocomplete: String,
            type: {
                type: ["text", "hidden", "search", "tel", "url", "email", "password", "datetime", "date", "month", "week", "time", "datetime-local", "number", "range", "color", "checkbox", "radio", "file", "submit", "image", "reset", "button"],
                missing: "text"
            },
            formTarget: String,
            formNoValidate: Boolean,
            formMethod: {
                type: ["get", "post"],
                invalid: "get",
                missing: ""
            },
            formEnctype: {
                type: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"],
                invalid: "application/x-www-form-urlencoded",
                missing: ""
            },
            inputMode: {
                type: ["verbatim", "latin", "latin-name", "latin-prose", "full-width-latin", "kana", "kana-name", "katakana", "numeric", "tel", "email", "url"],
                missing: ""
            },
            align: String,
            useMap: String
        }
    });
    O4({
        tag: "keygen",
        name: "HTMLKeygenElement",
        ctor: function(q, K, Y) {
            ub.call(this, q, K, Y)
        },
        props: mb,
        attributes: {
            name: String,
            disabled: Boolean,
            autofocus: Boolean,
            challenge: String,
            keytype: {
                type: ["rsa"],
                missing: ""
            }
        }
    });
    O4({
        tag: "li",
        name: "HTMLLIElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            value: {
                type: "long",
                default: 0
            },
            type: String
        }
    });
    O4({
        tag: "label",
        name: "HTMLLabelElement",
        ctor: function(q, K, Y) {
            ub.call(this, q, K, Y)
        },
        props: mb,
        attributes: {
            htmlFor: {
                name: "for",
                type: String
            }
        }
    });
    O4({
        tag: "legend",
        name: "HTMLLegendElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            align: String
        }
    });
    O4({
        tag: "link",
        name: "HTMLLinkElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            href: jj,
            rel: String,
            media: String,
            hreflang: String,
            type: String,
            crossOrigin: vk1,
            nonce: String,
            integrity: String,
            referrerPolicy: PT6,
            imageSizes: String,
            imageSrcset: String,
            charset: String,
            rev: String,
            target: String
        }
    });
    O4({
        tag: "map",
        name: "HTMLMapElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            name: String
        }
    });
    O4({
        tag: "menu",
        name: "HTMLMenuElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            type: {
                type: ["context", "popup", "toolbar"],
                missing: "toolbar"
            },
            label: String,
            compact: Boolean
        }
    });
    O4({
        tag: "meta",
        name: "HTMLMetaElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            name: String,
            content: String,
            httpEquiv: {
                name: "http-equiv",
                type: String
            },
            scheme: String
        }
    });
    O4({
        tag: "meter",
        name: "HTMLMeterElement",
        ctor: function(q, K, Y) {
            ub.call(this, q, K, Y)
        },
        props: mb
    });
    O4({
        tags: ["ins", "del"],
        name: "HTMLModElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            cite: jj,
            dateTime: String
        }
    });
    O4({
        tag: "ol",
        name: "HTMLOListElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        props: {
            _numitems: {
                get: function() {
                    var A = 0;
                    return this.childNodes.forEach(function(q) {
                        if (q.nodeType === Hg8.ELEMENT_NODE && q.tagName === "LI") A++
                    }), A
                }
            }
        },
        attributes: {
            type: String,
            reversed: Boolean,
            start: {
                type: "long",
                default: function() {
                    if (this.reversed) return this._numitems;
                    else return 1
                }
            },
            compact: Boolean
        }
    });
    O4({
        tag: "object",
        name: "HTMLObjectElement",
        ctor: function(q, K, Y) {
            ub.call(this, q, K, Y)
        },
        props: mb,
        attributes: {
            data: jj,
            type: String,
            name: String,
            useMap: String,
            typeMustMatch: Boolean,
            width: String,
            height: String,
            align: String,
            archive: String,
            code: String,
            declare: Boolean,
            hspace: {
                type: "unsigned long",
                default: 0
            },
            standby: String,
            vspace: {
                type: "unsigned long",
                default: 0
            },
            codeBase: jj,
            codeType: String,
            border: {
                type: String,
                treatNullAsEmptyString: !0
            }
        }
    });
    O4({
        tag: "optgroup",
        name: "HTMLOptGroupElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            disabled: Boolean,
            label: String
        }
    });
    O4({
        tag: "option",
        name: "HTMLOptionElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        props: {
            form: {
                get: function() {
                    var A = this.parentNode;
                    while (A && A.nodeType === Hg8.ELEMENT_NODE) {
                        if (A.localName === "select") return A.form;
                        A = A.parentNode
                    }
                }
            },
            value: {
                get: function() {
                    return this._getattr("value") || this.text
                },
                set: function(A) {
                    this._setattr("value", A)
                }
            },
            text: {
                get: function() {
                    return this.textContent.replace(/[ \t\n\f\r]+/g, " ").trim()
                },
                set: function(A) {
                    this.textContent = A
                }
            }
        },
        attributes: {
            disabled: Boolean,
            defaultSelected: {
                name: "selected",
                type: Boolean
            },
            label: String
        }
    });
    O4({
        tag: "output",
        name: "HTMLOutputElement",
        ctor: function(q, K, Y) {
            ub.call(this, q, K, Y)
        },
        props: mb,
        attributes: {
            name: String
        }
    });
    O4({
        tag: "p",
        name: "HTMLParagraphElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            align: String
        }
    });
    O4({
        tag: "param",
        name: "HTMLParamElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            name: String,
            value: String,
            type: String,
            valueType: String
        }
    });
    O4({
        tags: ["pre", "listing", "xmp"],
        name: "HTMLPreElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            width: {
                type: "long",
                default: 0
            }
        }
    });
    O4({
        tag: "progress",
        name: "HTMLProgressElement",
        ctor: function(q, K, Y) {
            ub.call(this, q, K, Y)
        },
        props: mb,
        attributes: {
            max: {
                type: Number,
                float: !0,
                default: 1,
                min: 0
            }
        }
    });
    O4({
        tags: ["q", "blockquote"],
        name: "HTMLQuoteElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            cite: jj
        }
    });
    O4({
        tag: "script",
        name: "HTMLScriptElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        props: {
            text: {
                get: function() {
                    var A = "";
                    for (var q = 0, K = this.childNodes.length; q < K; q++) {
                        var Y = this.childNodes[q];
                        if (Y.nodeType === Hg8.TEXT_NODE) A += Y._data
                    }
                    return A
                },
                set: function(A) {
                    if (this.removeChildren(), A !== null && A !== "") this.appendChild(this.ownerDocument.createTextNode(A))
                }
            }
        },
        attributes: {
            src: jj,
            type: String,
            charset: String,
            referrerPolicy: PT6,
            defer: Boolean,
            async: Boolean,
            nomodule: Boolean,
            crossOrigin: vk1,
            nonce: String,
            integrity: String
        }
    });
    O4({
        tag: "select",
        name: "HTMLSelectElement",
        ctor: function(q, K, Y) {
            ub.call(this, q, K, Y)
        },
        props: {
            form: mb.form,
            options: {
                get: function() {
                    return this.getElementsByTagName("option")
                }
            }
        },
        attributes: {
            autocomplete: String,
            name: String,
            disabled: Boolean,
            autofocus: Boolean,
            multiple: Boolean,
            required: Boolean,
            size: {
                type: "unsigned long",
                default: 0
            }
        }
    });
    O4({
        tag: "span",
        name: "HTMLSpanElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        }
    });
    O4({
        tag: "style",
        name: "HTMLStyleElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            media: String,
            type: String,
            scoped: Boolean
        }
    });
    O4({
        tag: "caption",
        name: "HTMLTableCaptionElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            align: String
        }
    });
    O4({
        name: "HTMLTableCellElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            colSpan: {
                type: "unsigned long",
                default: 1
            },
            rowSpan: {
                type: "unsigned long",
                default: 1
            },
            scope: {
                type: ["row", "col", "rowgroup", "colgroup"],
                missing: ""
            },
            abbr: String,
            align: String,
            axis: String,
            height: String,
            width: String,
            ch: {
                name: "char",
                type: String
            },
            chOff: {
                name: "charoff",
                type: String
            },
            noWrap: Boolean,
            vAlign: String,
            bgColor: {
                type: String,
                treatNullAsEmptyString: !0
            }
        }
    });
    O4({
        tags: ["col", "colgroup"],
        name: "HTMLTableColElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            span: {
                type: "limited unsigned long with fallback",
                default: 1,
                min: 1
            },
            align: String,
            ch: {
                name: "char",
                type: String
            },
            chOff: {
                name: "charoff",
                type: String
            },
            vAlign: String,
            width: String
        }
    });
    O4({
        tag: "table",
        name: "HTMLTableElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        props: {
            rows: {
                get: function() {
                    return this.getElementsByTagName("tr")
                }
            }
        },
        attributes: {
            align: String,
            border: String,
            frame: String,
            rules: String,
            summary: String,
            width: String,
            bgColor: {
                type: String,
                treatNullAsEmptyString: !0
            },
            cellPadding: {
                type: String,
                treatNullAsEmptyString: !0
            },
            cellSpacing: {
                type: String,
                treatNullAsEmptyString: !0
            }
        }
    });
    O4({
        tag: "template",
        name: "HTMLTemplateElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y), this._contentFragment = q._templateDoc.createDocumentFragment()
        },
        props: {
            content: {
                get: function() {
                    return this._contentFragment
                }
            },
            serialize: {
                value: function() {
                    return this.content.serialize()
                }
            }
        }
    });
    O4({
        tag: "tr",
        name: "HTMLTableRowElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        props: {
            cells: {
                get: function() {
                    return this.querySelectorAll("td,th")
                }
            }
        },
        attributes: {
            align: String,
            ch: {
                name: "char",
                type: String
            },
            chOff: {
                name: "charoff",
                type: String
            },
            vAlign: String,
            bgColor: {
                type: String,
                treatNullAsEmptyString: !0
            }
        }
    });
    O4({
        tags: ["thead", "tfoot", "tbody"],
        name: "HTMLTableSectionElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        props: {
            rows: {
                get: function() {
                    return this.getElementsByTagName("tr")
                }
            }
        },
        attributes: {
            align: String,
            ch: {
                name: "char",
                type: String
            },
            chOff: {
                name: "charoff",
                type: String
            },
            vAlign: String
        }
    });
    O4({
        tag: "textarea",
        name: "HTMLTextAreaElement",
        ctor: function(q, K, Y) {
            ub.call(this, q, K, Y)
        },
        props: {
            form: mb.form,
            type: {
                get: function() {
                    return "textarea"
                }
            },
            defaultValue: {
                get: function() {
                    return this.textContent
                },
                set: function(A) {
                    this.textContent = A
                }
            },
            value: {
                get: function() {
                    return this.defaultValue
                },
                set: function(A) {
                    this.defaultValue = A
                }
            },
            textLength: {
                get: function() {
                    return this.value.length
                }
            }
        },
        attributes: {
            autocomplete: String,
            name: String,
            disabled: Boolean,
            autofocus: Boolean,
            placeholder: String,
            wrap: String,
            dirName: String,
            required: Boolean,
            readOnly: Boolean,
            rows: {
                type: "limited unsigned long with fallback",
                default: 2
            },
            cols: {
                type: "limited unsigned long with fallback",
                default: 20
            },
            maxLength: {
                type: "unsigned long",
                min: 0,
                setmin: 0,
                default: -1
            },
            minLength: {
                type: "unsigned long",
                min: 0,
                setmin: 0,
                default: -1
            },
            inputMode: {
                type: ["verbatim", "latin", "latin-name", "latin-prose", "full-width-latin", "kana", "kana-name", "katakana", "numeric", "tel", "email", "url"],
                missing: ""
            }
        }
    });
    O4({
        tag: "time",
        name: "HTMLTimeElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            dateTime: String,
            pubDate: Boolean
        }
    });
    O4({
        tag: "title",
        name: "HTMLTitleElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        props: {
            text: {
                get: function() {
                    return this.textContent
                }
            }
        }
    });
    O4({
        tag: "ul",
        name: "HTMLUListElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            type: String,
            compact: Boolean
        }
    });
    O4({
        name: "HTMLMediaElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            src: jj,
            crossOrigin: vk1,
            preload: {
                type: ["metadata", "none", "auto", {
                    value: "",
                    alias: "auto"
                }],
                missing: "auto"
            },
            loop: Boolean,
            autoplay: Boolean,
            mediaGroup: String,
            controls: Boolean,
            defaultMuted: {
                name: "muted",
                type: Boolean
            }
        }
    });
    O4({
        name: "HTMLAudioElement",
        tag: "audio",
        superclass: El.HTMLMediaElement,
        ctor: function(q, K, Y) {
            El.HTMLMediaElement.call(this, q, K, Y)
        }
    });
    O4({
        name: "HTMLVideoElement",
        tag: "video",
        superclass: El.HTMLMediaElement,
        ctor: function(q, K, Y) {
            El.HTMLMediaElement.call(this, q, K, Y)
        },
        attributes: {
            poster: jj,
            width: {
                type: "unsigned long",
                min: 0,
                default: 0
            },
            height: {
                type: "unsigned long",
                min: 0,
                default: 0
            }
        }
    });
    O4({
        tag: "td",
        name: "HTMLTableDataCellElement",
        superclass: El.HTMLTableCellElement,
        ctor: function(q, K, Y) {
            El.HTMLTableCellElement.call(this, q, K, Y)
        }
    });
    O4({
        tag: "th",
        name: "HTMLTableHeaderCellElement",
        superclass: El.HTMLTableCellElement,
        ctor: function(q, K, Y) {
            El.HTMLTableCellElement.call(this, q, K, Y)
        }
    });
    O4({
        tag: "frameset",
        name: "HTMLFrameSetElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        }
    });
    O4({
        tag: "frame",
        name: "HTMLFrameElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        }
    });
    O4({
        tag: "canvas",
        name: "HTMLCanvasElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        props: {
            getContext: {
                value: WE.nyi
            },
            probablySupportsContext: {
                value: WE.nyi
            },
            setContext: {
                value: WE.nyi
            },
            transferControlToProxy: {
                value: WE.nyi
            },
            toDataURL: {
                value: WE.nyi
            },
            toBlob: {
                value: WE.nyi
            }
        },
        attributes: {
            width: {
                type: "unsigned long",
                default: 300
            },
            height: {
                type: "unsigned long",
                default: 150
            }
        }
    });
    O4({
        tag: "dialog",
        name: "HTMLDialogElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        props: {
            show: {
                value: WE.nyi
            },
            showModal: {
                value: WE.nyi
            },
            close: {
                value: WE.nyi
            }
        },
        attributes: {
            open: Boolean,
            returnValue: String
        }
    });
    O4({
        tag: "menuitem",
        name: "HTMLMenuItemElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        props: {
            _label: {
                get: function() {
                    var A = this._getattr("label");
                    if (A !== null && A !== "") return A;
                    return A = this.textContent, A.replace(/[ \t\n\f\r]+/g, " ").trim()
                }
            },
            label: {
                get: function() {
                    var A = this._getattr("label");
                    if (A !== null) return A;
                    return this._label
                },
                set: function(A) {
                    this._setattr("label", A)
                }
            }
        },
        attributes: {
            type: {
                type: ["command", "checkbox", "radio"],
                missing: "command"
            },
            icon: jj,
            disabled: Boolean,
            checked: Boolean,
            radiogroup: String,
            default: Boolean
        }
    });
    O4({
        tag: "source",
        name: "HTMLSourceElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            srcset: String,
            sizes: String,
            media: String,
            src: jj,
            type: String,
            width: String,
            height: String
        }
    });
    O4({
        tag: "track",
        name: "HTMLTrackElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            src: jj,
            srclang: String,
            label: String,
            default: Boolean,
            kind: {
                type: ["subtitles", "captions", "descriptions", "chapters", "metadata"],
                missing: "subtitles",
                invalid: "metadata"
            }
        },
        props: {
            NONE: {
                get: function() {
                    return 0
                }
            },
            LOADING: {
                get: function() {
                    return 1
                }
            },
            LOADED: {
                get: function() {
                    return 2
                }
            },
            ERROR: {
                get: function() {
                    return 3
                }
            },
            readyState: {
                get: WE.nyi
            },
            track: {
                get: WE.nyi
            }
        }
    });
    O4({
        tag: "font",
        name: "HTMLFontElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            color: {
                type: String,
                treatNullAsEmptyString: !0
            },
            face: {
                type: String
            },
            size: {
                type: String
            }
        }
    });
    O4({
        tag: "dir",
        name: "HTMLDirectoryElement",
        ctor: function(q, K, Y) {
            kq.call(this, q, K, Y)
        },
        attributes: {
            compact: Boolean
        }
    });
    O4({
        tags: ["abbr", "address", "article", "aside", "b", "bdi", "bdo", "cite", "content", "code", "dd", "dfn", "dt", "em", "figcaption", "figure", "footer", "header", "hgroup", "i", "kbd", "main", "mark", "nav", "noscript", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "section", "small", "strong", "sub", "summary", "sup", "u", "var", "wbr", "acronym", "basefont", "big", "center", "nobr", "noembed", "noframes", "plaintext", "strike", "tt"]
    })
})
// @from(Ln 352606, Col 4)
Mg8 = x((shY) => {
    var he4 = DT6(),
        nhY = $g8(),
        rhY = Hj(),
        ohY = Tk1(),
        ahY = shY.elements = {},
        Se4 = Object.create(null);
    shY.createElement = function(A, q, K) {
        var Y = Se4[q] || Jg8;
        return new Y(A, q, K)
    };

    function jg8(A) {
        return nhY(A, Jg8, ahY, Se4)
    }
    var Jg8 = jg8({
        superclass: he4,
        name: "SVGElement",
        ctor: function(q, K, Y) {
            he4.call(this, q, K, rhY.NAMESPACE.SVG, Y)
        },
        props: {
            style: {
                get: function() {
                    if (!this._style) this._style = new ohY(this);
                    return this._style
                }
            }
        }
    });
    jg8({
        name: "SVGSVGElement",
        ctor: function(q, K, Y) {
            Jg8.call(this, q, K, Y)
        },
        tag: "svg",
        props: {
            createSVGRect: {
                value: function() {
                    return shY.createElement(this.ownerDocument, "rect", null)
                }
            }
        }
    });
    jg8({
        tags: ["a", "altGlyph", "altGlyphDef", "altGlyphItem", "animate", "animateColor", "animateMotion", "animateTransform", "circle", "clipPath", "color-profile", "cursor", "defs", "desc", "ellipse", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter", "font", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignObject", "g", "glyph", "glyphRef", "hkern", "image", "line", "linearGradient", "marker", "mask", "metadata", "missing-glyph", "mpath", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "script", "set", "stop", "style", "switch", "symbol", "text", "textPath", "title", "tref", "tspan", "use", "view", "vkern"]
    })
})
// @from(Ln 352654, Col 4)
be4 = x((Dow, Ie4) => {
    Ie4.exports = {
        VALUE: 1,
        ATTR: 2,
        REMOVE_ATTR: 3,
        REMOVE: 4,
        MOVE: 5,
        INSERT: 6
    }
})
// @from(Ln 352664, Col 4)
kk1 = x((Xow, de4) => {
    de4.exports = ll6;
    var bZ = u0(),
        thY = Tz6(),
        Fe4 = $k1(),
        a66 = DT6(),
        ehY = lB8(),
        ASY = nB8(),
        cl6 = wT6(),
        qSY = oB8(),
        KSY = sB8(),
        YSY = il6(),
        zSY = Ke4(),
        _SY = $e4(),
        xe4 = Ql6(),
        ue4 = fk1(),
        me4 = Dk1(),
        wSY = wg8(),
        Vk1 = Hk1(),
        Dg8 = Nk1(),
        OSY = Mg8(),
        Sz = Hj(),
        WT6 = be4(),
        GT6 = Sz.NAMESPACE,
        Xg8 = _k1().isApiWritable;

    function ll6(A, q) {
        Fe4.call(this), this.nodeType = bZ.DOCUMENT_NODE, this.isHTML = A, this._address = q || "about:blank", this.readyState = "loading", this.implementation = new YSY(this), this.ownerDocument = null, this._contentType = A ? "text/html" : "application/xml", this.doctype = null, this.documentElement = null, this._templateDocCache = null, this._nodeIterators = null, this._nid = 1, this._nextnid = 2, this._nodes = [null, this], this.byId = Object.create(null), this.modclock = 0
    }
    var $SY = {
            event: "Event",
            customevent: "CustomEvent",
            uievent: "UIEvent",
            mouseevent: "MouseEvent"
        },
        HSY = {
            events: "event",
            htmlevents: "event",
            mouseevents: "mouseevent",
            mutationevents: "mutationevent",
            uievents: "uievent"
        },
        ZT6 = function(A, q, K) {
            return {
                get: function() {
                    var Y = A.call(this);
                    if (Y) return Y[q];
                    return K
                },
                set: function(Y) {
                    var z = A.call(this);
                    if (z) z[q] = Y
                }
            }
        };

    function Be4(A, q) {
        var K, Y, z;
        if (A === "") A = null;
        if (!Vk1.isValidQName(q)) Sz.InvalidCharacterError();
        if (K = null, Y = q, z = q.indexOf(":"), z >= 0) K = q.substring(0, z), Y = q.substring(z + 1);
        if (K !== null && A === null) Sz.NamespaceError();
        if (K === "xml" && A !== GT6.XML) Sz.NamespaceError();
        if ((K === "xmlns" || q === "xmlns") && A !== GT6.XMLNS) Sz.NamespaceError();
        if (A === GT6.XMLNS && !(K === "xmlns" || q === "xmlns")) Sz.NamespaceError();
        return {
            namespace: A,
            prefix: K,
            localName: Y
        }
    }
    ll6.prototype = Object.create(Fe4.prototype, {
        _setMutationHandler: {
            value: function(A) {
                this.mutationHandler = A
            }
        },
        _dispatchRendererEvent: {
            value: function(A, q, K) {
                var Y = this._nodes[A];
                if (!Y) return;
                Y._dispatchEvent(new cl6(q, K), !0)
            }
        },
        nodeName: {
            value: "#document"
        },
        nodeValue: {
            get: function() {
                return null
            },
            set: function() {}
        },
        documentURI: {
            get: function() {
                return this._address
            },
            set: Sz.nyi
        },
        compatMode: {
            get: function() {
                return this._quirks ? "BackCompat" : "CSS1Compat"
            }
        },
        createTextNode: {
            value: function(A) {
                return new ehY(this, String(A))
            }
        },
        createComment: {
            value: function(A) {
                return new ASY(this, A)
            }
        },
        createDocumentFragment: {
            value: function() {
                return new qSY(this)
            }
        },
        createProcessingInstruction: {
            value: function(A, q) {
                if (!Vk1.isValidName(A) || q.indexOf("?>") !== -1) Sz.InvalidCharacterError();
                return new KSY(this, A, q)
            }
        },
        createAttribute: {
            value: function(A) {
                if (A = String(A), !Vk1.isValidName(A)) Sz.InvalidCharacterError();
                if (this.isHTML) A = Sz.toASCIILowerCase(A);
                return new a66._Attr(null, A, null, null, "")
            }
        },
        createAttributeNS: {
            value: function(A, q) {
                A = A === null || A === void 0 || A === "" ? null : String(A), q = String(q);
                var K = Be4(A, q);
                return new a66._Attr(null, K.localName, K.prefix, K.namespace, "")
            }
        },
        createElement: {
            value: function(A) {
                if (A = String(A), !Vk1.isValidName(A)) Sz.InvalidCharacterError();
                if (this.isHTML) {
                    if (/[A-Z]/.test(A)) A = Sz.toASCIILowerCase(A);
                    return Dg8.createElement(this, A, null)
                } else if (this.contentType === "application/xhtml+xml") return Dg8.createElement(this, A, null);
                else return new a66(this, A, null, null)
            },
            writable: Xg8
        },
        createElementNS: {
            value: function(A, q) {
                A = A === null || A === void 0 || A === "" ? null : String(A), q = String(q);
                var K = Be4(A, q);
                return this._createElementNS(K.localName, K.namespace, K.prefix)
            },
            writable: Xg8
        },
        _createElementNS: {
            value: function(A, q, K) {
                if (q === GT6.HTML) return Dg8.createElement(this, A, K);
                else if (q === GT6.SVG) return OSY.createElement(this, A, K);
                return new a66(this, A, q, K)
            }
        },
        createEvent: {
            value: function(q) {
                q = q.toLowerCase();
                var K = HSY[q] || q,
                    Y = wSY[$SY[K]];
                if (Y) {
                    var z = new Y;
                    return z._initialized = !1, z
                } else Sz.NotSupportedError()
            }
        },
        createTreeWalker: {
            value: function(A, q, K) {
                if (!A) throw TypeError("root argument is required");
                if (!(A instanceof bZ)) throw TypeError("root not a node");
                return q = q === void 0 ? xe4.SHOW_ALL : +q, K = K === void 0 ? null : K, new zSY(A, q, K)
            }
        },
        createNodeIterator: {
            value: function(A, q, K) {
                if (!A) throw TypeError("root argument is required");
                if (!(A instanceof bZ)) throw TypeError("root not a node");
                return q = q === void 0 ? xe4.SHOW_ALL : +q, K = K === void 0 ? null : K, new _SY(A, q, K)
            }
        },
        _attachNodeIterator: {
            value: function(A) {
                if (!this._nodeIterators) this._nodeIterators = [];
                this._nodeIterators.push(A)
            }
        },
        _detachNodeIterator: {
            value: function(A) {
                var q = this._nodeIterators.indexOf(A);
                this._nodeIterators.splice(q, 1)
            }
        },
        _preremoveNodeIterators: {
            value: function(A) {
                if (this._nodeIterators) this._nodeIterators.forEach(function(q) {
                    q._preremove(A)
                })
            }
        },
        _updateDocTypeElement: {
            value: function() {
                this.doctype = this.documentElement = null;
                for (var q = this.firstChild; q !== null; q = q.nextSibling)
                    if (q.nodeType === bZ.DOCUMENT_TYPE_NODE) this.doctype = q;
                    else if (q.nodeType === bZ.ELEMENT_NODE) this.documentElement = q
            }
        },
        insertBefore: {
            value: function(q, K) {
                return bZ.prototype.insertBefore.call(this, q, K), this._updateDocTypeElement(), q
            }
        },
        replaceChild: {
            value: function(q, K) {
                return bZ.prototype.replaceChild.call(this, q, K), this._updateDocTypeElement(), K
            }
        },
        removeChild: {
            value: function(q) {
                return bZ.prototype.removeChild.call(this, q), this._updateDocTypeElement(), q
            }
        },
        getElementById: {
            value: function(A) {
                var q = this.byId[A];
                if (!q) return null;
                if (q instanceof yl) return q.getFirst();
                return q
            }
        },
        _hasMultipleElementsWithId: {
            value: function(A) {
                return this.byId[A] instanceof yl
            }
        },
        getElementsByName: {
            value: a66.prototype.getElementsByName
        },
        getElementsByTagName: {
            value: a66.prototype.getElementsByTagName
        },
        getElementsByTagNameNS: {
            value: a66.prototype.getElementsByTagNameNS
        },
        getElementsByClassName: {
            value: a66.prototype.getElementsByClassName
        },
        adoptNode: {
            value: function(q) {
                if (q.nodeType === bZ.DOCUMENT_NODE) Sz.NotSupportedError();
                if (q.nodeType === bZ.ATTRIBUTE_NODE) return q;
                if (q.parentNode) q.parentNode.removeChild(q);
                if (q.ownerDocument !== this) Ue4(q, this);
                return q
            }
        },
        importNode: {
            value: function(q, K) {
                return this.adoptNode(q.cloneNode(K))
            },
            writable: Xg8
        },
        origin: {
            get: function() {
                return null
            }
        },
        characterSet: {
            get: function() {
                return "UTF-8"
            }
        },
        contentType: {
            get: function() {
                return this._contentType
            }
        },
        URL: {
            get: function() {
                return this._address
            }
        },
        domain: {
            get: Sz.nyi,
            set: Sz.nyi
        },
        referrer: {
            get: Sz.nyi
        },
        cookie: {
            get: Sz.nyi,
            set: Sz.nyi
        },
        lastModified: {
            get: Sz.nyi
        },
        location: {
            get: function() {
                return this.defaultView ? this.defaultView.location : null
            },
            set: Sz.nyi
        },
        _titleElement: {
            get: function() {
                return this.getElementsByTagName("title").item(0) || null
            }
        },
        title: {
            get: function() {
                var A = this._titleElement,
                    q = A ? A.textContent : "";
                return q.replace(/[ \t\n\r\f]+/g, " ").replace(/(^ )|( $)/g, "")
            },
            set: function(A) {
                var q = this._titleElement,
                    K = this.head;
                if (!q && !K) return;
                if (!q) q = this.createElement("title"), K.appendChild(q);
                q.textContent = A
            }
        },
        dir: ZT6(function() {
            var A = this.documentElement;
            if (A && A.tagName === "HTML") return A
        }, "dir", ""),
        fgColor: ZT6(function() {
            return this.body
        }, "text", ""),
        linkColor: ZT6(function() {
            return this.body
        }, "link", ""),
        vlinkColor: ZT6(function() {
            return this.body
        }, "vLink", ""),
        alinkColor: ZT6(function() {
            return this.body
        }, "aLink", ""),
        bgColor: ZT6(function() {
            return this.body
        }, "bgColor", ""),
        charset: {
            get: function() {
                return this.characterSet
            }
        },
        inputEncoding: {
            get: function() {
                return this.characterSet
            }
        },
        scrollingElement: {
            get: function() {
                return this._quirks ? this.body : this.documentElement
            }
        },
        body: {
            get: function() {
                return ge4(this.documentElement, "body")
            },
            set: Sz.nyi
        },
        head: {
            get: function() {
                return ge4(this.documentElement, "head")
            }
        },
        images: {
            get: Sz.nyi
        },
        embeds: {
            get: Sz.nyi
        },
        plugins: {
            get: Sz.nyi
        },
        links: {
            get: Sz.nyi
        },
        forms: {
            get: Sz.nyi
        },
        scripts: {
            get: Sz.nyi
        },
        applets: {
            get: function() {
                return []
            }
        },
        activeElement: {
            get: function() {
                return null
            }
        },
        innerHTML: {
            get: function() {
                return this.serialize()
            },
            set: Sz.nyi
        },
        outerHTML: {
            get: function() {
                return this.serialize()
            },
            set: Sz.nyi
        },
        write: {
            value: function(A) {
                if (!this.isHTML) Sz.InvalidStateError();
                if (!this._parser) return;
                if (!this._parser);
                var q = arguments.join("");
                this._parser.parse(q)
            }
        },
        writeln: {
            value: function(q) {
                this.write(Array.prototype.join.call(arguments, "") + `
`)
            }
        },
        open: {
            value: function() {
                this.documentElement = null
            }
        },
        close: {
            value: function() {
                if (this.readyState = "interactive", this._dispatchEvent(new cl6("readystatechange"), !0), this._dispatchEvent(new cl6("DOMContentLoaded"), !0), this.readyState = "complete", this._dispatchEvent(new cl6("readystatechange"), !0), this.defaultView) this.defaultView._dispatchEvent(new cl6("load"), !0)
            }
        },
        clone: {
            value: function() {
                var q = new ll6(this.isHTML, this._address);
                return q._quirks = this._quirks, q._contentType = this._contentType, q
            }
        },
        cloneNode: {
            value: function(q) {
                var K = bZ.prototype.cloneNode.call(this, !1);
                if (q)
                    for (var Y = this.firstChild; Y !== null; Y = Y.nextSibling) K._appendChild(K.importNode(Y, !0));
                return K._updateDocTypeElement(), K
            }
        },
        isEqual: {
            value: function(q) {
                return !0
            }
        },
        mutateValue: {
            value: function(A) {
                if (this.mutationHandler) this.mutationHandler({
                    type: WT6.VALUE,
                    target: A,
                    data: A.data
                })
            }
        },
        mutateAttr: {
            value: function(A, q) {
                if (this.mutationHandler) this.mutationHandler({
                    type: WT6.ATTR,
                    target: A.ownerElement,
                    attr: A
                })
            }
        },
        mutateRemoveAttr: {
            value: function(A) {
                if (this.mutationHandler) this.mutationHandler({
                    type: WT6.REMOVE_ATTR,
                    target: A.ownerElement,
                    attr: A
                })
            }
        },
        mutateRemove: {
            value: function(A) {
                if (this.mutationHandler) this.mutationHandler({
                    type: WT6.REMOVE,
                    target: A.parentNode,
                    node: A
                });
                Qe4(A)
            }
        },
        mutateInsert: {
            value: function(A) {
                if (pe4(A), this.mutationHandler) this.mutationHandler({
                    type: WT6.INSERT,
                    target: A.parentNode,
                    node: A
                })
            }
        },
        mutateMove: {
            value: function(A) {
                if (this.mutationHandler) this.mutationHandler({
                    type: WT6.MOVE,
                    target: A
                })
            }
        },
        addId: {
            value: function(q, K) {
                var Y = this.byId[q];
                if (!Y) this.byId[q] = K;
                else {
                    if (!(Y instanceof yl)) Y = new yl(Y), this.byId[q] = Y;
                    Y.add(K)
                }
            }
        },
        delId: {
            value: function(q, K) {
                var Y = this.byId[q];
                if (Sz.assert(Y), Y instanceof yl) {
                    if (Y.del(K), Y.length === 1) this.byId[q] = Y.downgrade()
                } else this.byId[q] = void 0
            }
        },
        _resolve: {
            value: function(A) {
                return new ue4(this._documentBaseURL).resolve(A)
            }
        },
        _documentBaseURL: {
            get: function() {
                var A = this._address;
                if (A === "about:blank") A = "/";
                var q = this.querySelector("base[href]");
                if (q) return new ue4(A).resolve(q.getAttribute("href"));
                return A
            }
        },
        _templateDoc: {
            get: function() {
                if (!this._templateDocCache) {
                    var A = new ll6(this.isHTML, this._address);
                    this._templateDocCache = A._templateDocCache = A
                }
                return this._templateDocCache
            }
        },
        querySelector: {
            value: function(A) {
                return me4(A, this)[0]
            }
        },
        querySelectorAll: {
            value: function(A) {
                var q = me4(A, this);
                return q.item ? q : new thY(q)
            }
        }
    });
    var jSY = ["abort", "canplay", "canplaythrough", "change", "click", "contextmenu", "cuechange", "dblclick", "drag", "dragend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "durationchange", "emptied", "ended", "input", "invalid", "keydown", "keypress", "keyup", "loadeddata", "loadedmetadata", "loadstart", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "mousewheel", "pause", "play", "playing", "progress", "ratechange", "readystatechange", "reset", "seeked", "seeking", "select", "show", "stalled", "submit", "suspend", "timeupdate", "volumechange", "waiting", "blur", "error", "focus", "load", "scroll"];
    jSY.forEach(function(A) {
        Object.defineProperty(ll6.prototype, "on" + A, {
            get: function() {
                return this._getEventHandler(A)
            },
            set: function(q) {
                this._setEventHandler(A, q)
            }
        })
    });

    function ge4(A, q) {
        if (A && A.isHTML) {
            for (var K = A.firstChild; K !== null; K = K.nextSibling)
                if (K.nodeType === bZ.ELEMENT_NODE && K.localName === q && K.namespaceURI === GT6.HTML) return K
        }
        return null
    }

    function JSY(A) {
        if (A._nid = A.ownerDocument._nextnid++, A.ownerDocument._nodes[A._nid] = A, A.nodeType === bZ.ELEMENT_NODE) {
            var q = A.getAttribute("id");
            if (q) A.ownerDocument.addId(q, A);
            if (A._roothook) A._roothook()
        }
    }

    function MSY(A) {
        if (A.nodeType === bZ.ELEMENT_NODE) {
            var q = A.getAttribute("id");
            if (q) A.ownerDocument.delId(q, A)
        }
        A.ownerDocument._nodes[A._nid] = void 0, A._nid = void 0
    }

    function pe4(A) {
        if (JSY(A), A.nodeType === bZ.ELEMENT_NODE)
            for (var q = A.firstChild; q !== null; q = q.nextSibling) pe4(q)
    }

    function Qe4(A) {
        MSY(A);
        for (var q = A.firstChild; q !== null; q = q.nextSibling) Qe4(q)
    }

    function Ue4(A, q) {
        if (A.ownerDocument = q, A._lastModTime = void 0, Object.prototype.hasOwnProperty.call(A, "_tagName")) A._tagName = void 0;
        for (var K = A.firstChild; K !== null; K = K.nextSibling) Ue4(K, q)
    }

    function yl(A) {
        this.nodes = Object.create(null), this.nodes[A._nid] = A, this.length = 1, this.firstNode = void 0
    }
    yl.prototype.add = function(A) {
        if (!this.nodes[A._nid]) this.nodes[A._nid] = A, this.length++, this.firstNode = void 0
    };
    yl.prototype.del = function(A) {
        if (this.nodes[A._nid]) delete this.nodes[A._nid], this.length--, this.firstNode = void 0
    };
    yl.prototype.getFirst = function() {
        if (!this.firstNode) {
            var A;
            for (A in this.nodes)
                if (this.firstNode === void 0 || this.firstNode.compareDocumentPosition(this.nodes[A]) & bZ.DOCUMENT_POSITION_PRECEDING) this.firstNode = this.nodes[A]
        }
        return this.firstNode
    };
    yl.prototype.downgrade = function() {
        if (this.length === 1) {
            var A;
            for (A in this.nodes) return this.nodes[A]
        }
        return this
    }
})
// @from(Ln 353307, Col 4)
yk1 = x((Pow, le4) => {
    le4.exports = Ek1;
    var DSY = u0(),
        ce4 = dB8(),
        XSY = Xk1();

    function Ek1(A, q, K, Y) {
        ce4.call(this), this.nodeType = DSY.DOCUMENT_TYPE_NODE, this.ownerDocument = A || null, this.name = q, this.publicId = K || "", this.systemId = Y || ""
    }
    Ek1.prototype = Object.create(ce4.prototype, {
        nodeName: {
            get: function() {
                return this.name
            }
        },
        nodeValue: {
            get: function() {
                return null
            },
            set: function() {}
        },
        clone: {
            value: function() {
                return new Ek1(this.ownerDocument, this.name, this.publicId, this.systemId)
            }
        },
        isEqual: {
            value: function(q) {
                return this.name === q.name && this.publicId === q.publicId && this.systemId === q.systemId
            }
        }
    });
    Object.defineProperties(Ek1.prototype, XSY)
})