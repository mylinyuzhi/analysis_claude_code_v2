
// @from(Ln 341439, Col 4)
wW6 = R((qRY) => {
    var gLA = XP(),
        OU4 = IW1(),
        sLY = YW6(),
        qE = F_(),
        _U4 = FLA(),
        tLY = QLA(),
        pd = qRY.elements = {},
        jg1 = Object.create(null);
    qRY.createElement = function(A, q, K) {
        var Y = jg1[q] || ARY;
        return new Y(A, q, K)
    };

    function j4(A) {
        return tLY(A, hq, pd, jg1)
    }

    function Q_(A) {
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

    function zW6(A) {
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
    var bW1 = {
            type: ["", "no-referrer", "no-referrer-when-downgrade", "same-origin", "origin", "strict-origin", "origin-when-cross-origin", "strict-origin-when-cross-origin", "unsafe-url"],
            missing: ""
        },
        eLY = {
            A: !0,
            LINK: !0,
            BUTTON: !0,
            INPUT: !0,
            SELECT: !0,
            TEXTAREA: !0,
            COMMAND: !0
        },
        GI = function(A, q, K) {
            hq.call(this, A, q, K), this._form = null
        },
        hq = qRY.HTMLElement = j4({
            superclass: OU4,
            name: "HTMLElement",
            ctor: function(q, K, Y) {
                OU4.call(this, q, K, qE.NAMESPACE.HTML, Y)
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
                        var K = this instanceof jg1.template ? this.content : this;
                        while (K.hasChildNodes()) K.removeChild(K.firstChild);
                        K.appendChild(q._asDocumentFragment())
                    }
                },
                style: {
                    get: function() {
                        if (!this._style) this._style = new sLY(this);
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
                    value: qE.nyi
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
                        if (this.tagName in eLY || this.contentEditable) return 0;
                        else return -1
                    }
                }
            },
            events: ["abort", "canplay", "canplaythrough", "change", "click", "contextmenu", "cuechange", "dblclick", "drag", "dragend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "durationchange", "emptied", "ended", "input", "invalid", "keydown", "keypress", "keyup", "loadeddata", "loadedmetadata", "loadstart", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "mousewheel", "pause", "play", "playing", "progress", "ratechange", "readystatechange", "reset", "seeked", "seeking", "select", "show", "stalled", "submit", "suspend", "timeupdate", "volumechange", "waiting", "blur", "error", "focus", "load", "scroll"]
        }),
        ARY = j4({
            name: "HTMLUnknownElement",
            ctor: function(q, K, Y) {
                hq.call(this, q, K, Y)
            }
        }),
        ZI = {
            form: {
                get: function() {
                    return this._form
                }
            }
        };
    j4({
        tag: "a",
        name: "HTMLAnchorElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        props: {
            _post_click_activation_steps: {
                value: function(A) {
                    if (this.href) this.ownerDocument.defaultView.location = this.href
                }
            }
        },
        attributes: {
            href: Q_,
            ping: String,
            download: String,
            target: String,
            rel: String,
            media: String,
            hreflang: String,
            type: String,
            referrerPolicy: bW1,
            coords: String,
            charset: String,
            name: String,
            rev: String,
            shape: String
        }
    });
    _U4._inherit(jg1.a.prototype);
    j4({
        tag: "area",
        name: "HTMLAreaElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            alt: String,
            target: String,
            download: String,
            rel: String,
            media: String,
            href: Q_,
            hreflang: String,
            type: String,
            shape: String,
            coords: String,
            ping: String,
            referrerPolicy: bW1,
            noHref: Boolean
        }
    });
    _U4._inherit(jg1.area.prototype);
    j4({
        tag: "br",
        name: "HTMLBRElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            clear: String
        }
    });
    j4({
        tag: "base",
        name: "HTMLBaseElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            target: String
        }
    });
    j4({
        tag: "body",
        name: "HTMLBodyElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
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
    j4({
        tag: "button",
        name: "HTMLButtonElement",
        ctor: function(q, K, Y) {
            GI.call(this, q, K, Y)
        },
        props: ZI,
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
            formAction: Q_,
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
    j4({
        tag: "dl",
        name: "HTMLDListElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            compact: Boolean
        }
    });
    j4({
        tag: "data",
        name: "HTMLDataElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            value: String
        }
    });
    j4({
        tag: "datalist",
        name: "HTMLDataListElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        }
    });
    j4({
        tag: "details",
        name: "HTMLDetailsElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            open: Boolean
        }
    });
    j4({
        tag: "div",
        name: "HTMLDivElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            align: String
        }
    });
    j4({
        tag: "embed",
        name: "HTMLEmbedElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            src: Q_,
            type: String,
            width: String,
            height: String,
            align: String,
            name: String
        }
    });
    j4({
        tag: "fieldset",
        name: "HTMLFieldSetElement",
        ctor: function(q, K, Y) {
            GI.call(this, q, K, Y)
        },
        props: ZI,
        attributes: {
            disabled: Boolean,
            name: String
        }
    });
    j4({
        tag: "form",
        name: "HTMLFormElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
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
    j4({
        tag: "hr",
        name: "HTMLHRElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            align: String,
            color: String,
            noShade: Boolean,
            size: String,
            width: String
        }
    });
    j4({
        tag: "head",
        name: "HTMLHeadElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        }
    });
    j4({
        tags: ["h1", "h2", "h3", "h4", "h5", "h6"],
        name: "HTMLHeadingElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            align: String
        }
    });
    j4({
        tag: "html",
        name: "HTMLHtmlElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            xmlns: Q_,
            version: String
        }
    });
    j4({
        tag: "iframe",
        name: "HTMLIFrameElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            src: Q_,
            srcdoc: String,
            name: String,
            width: String,
            height: String,
            seamless: Boolean,
            allow: Boolean,
            allowFullscreen: Boolean,
            allowUserMedia: Boolean,
            allowPaymentRequest: Boolean,
            referrerPolicy: bW1,
            loading: {
                type: ["eager", "lazy"],
                treatNullAsEmptyString: !0
            },
            align: String,
            scrolling: String,
            frameBorder: String,
            longDesc: Q_,
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
    j4({
        tag: "img",
        name: "HTMLImageElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            alt: String,
            src: Q_,
            srcset: String,
            crossOrigin: zW6,
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
            referrerPolicy: bW1,
            loading: {
                type: ["eager", "lazy"],
                missing: ""
            },
            name: String,
            lowsrc: Q_,
            align: String,
            hspace: {
                type: "unsigned long",
                default: 0
            },
            vspace: {
                type: "unsigned long",
                default: 0
            },
            longDesc: Q_,
            border: {
                type: String,
                treatNullAsEmptyString: !0
            }
        }
    });
    j4({
        tag: "input",
        name: "HTMLInputElement",
        ctor: function(q, K, Y) {
            GI.call(this, q, K, Y)
        },
        props: {
            form: ZI.form,
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
            src: Q_,
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
    j4({
        tag: "keygen",
        name: "HTMLKeygenElement",
        ctor: function(q, K, Y) {
            GI.call(this, q, K, Y)
        },
        props: ZI,
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
    j4({
        tag: "li",
        name: "HTMLLIElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            value: {
                type: "long",
                default: 0
            },
            type: String
        }
    });
    j4({
        tag: "label",
        name: "HTMLLabelElement",
        ctor: function(q, K, Y) {
            GI.call(this, q, K, Y)
        },
        props: ZI,
        attributes: {
            htmlFor: {
                name: "for",
                type: String
            }
        }
    });
    j4({
        tag: "legend",
        name: "HTMLLegendElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            align: String
        }
    });
    j4({
        tag: "link",
        name: "HTMLLinkElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            href: Q_,
            rel: String,
            media: String,
            hreflang: String,
            type: String,
            crossOrigin: zW6,
            nonce: String,
            integrity: String,
            referrerPolicy: bW1,
            imageSizes: String,
            imageSrcset: String,
            charset: String,
            rev: String,
            target: String
        }
    });
    j4({
        tag: "map",
        name: "HTMLMapElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            name: String
        }
    });
    j4({
        tag: "menu",
        name: "HTMLMenuElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
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
    j4({
        tag: "meta",
        name: "HTMLMetaElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
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
    j4({
        tag: "meter",
        name: "HTMLMeterElement",
        ctor: function(q, K, Y) {
            GI.call(this, q, K, Y)
        },
        props: ZI
    });
    j4({
        tags: ["ins", "del"],
        name: "HTMLModElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            cite: Q_,
            dateTime: String
        }
    });
    j4({
        tag: "ol",
        name: "HTMLOListElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        props: {
            _numitems: {
                get: function() {
                    var A = 0;
                    return this.childNodes.forEach(function(q) {
                        if (q.nodeType === gLA.ELEMENT_NODE && q.tagName === "LI") A++
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
    j4({
        tag: "object",
        name: "HTMLObjectElement",
        ctor: function(q, K, Y) {
            GI.call(this, q, K, Y)
        },
        props: ZI,
        attributes: {
            data: Q_,
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
            codeBase: Q_,
            codeType: String,
            border: {
                type: String,
                treatNullAsEmptyString: !0
            }
        }
    });
    j4({
        tag: "optgroup",
        name: "HTMLOptGroupElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            disabled: Boolean,
            label: String
        }
    });
    j4({
        tag: "option",
        name: "HTMLOptionElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        props: {
            form: {
                get: function() {
                    var A = this.parentNode;
                    while (A && A.nodeType === gLA.ELEMENT_NODE) {
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
    j4({
        tag: "output",
        name: "HTMLOutputElement",
        ctor: function(q, K, Y) {
            GI.call(this, q, K, Y)
        },
        props: ZI,
        attributes: {
            name: String
        }
    });
    j4({
        tag: "p",
        name: "HTMLParagraphElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            align: String
        }
    });
    j4({
        tag: "param",
        name: "HTMLParamElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            name: String,
            value: String,
            type: String,
            valueType: String
        }
    });
    j4({
        tags: ["pre", "listing", "xmp"],
        name: "HTMLPreElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            width: {
                type: "long",
                default: 0
            }
        }
    });
    j4({
        tag: "progress",
        name: "HTMLProgressElement",
        ctor: function(q, K, Y) {
            GI.call(this, q, K, Y)
        },
        props: ZI,
        attributes: {
            max: {
                type: Number,
                float: !0,
                default: 1,
                min: 0
            }
        }
    });
    j4({
        tags: ["q", "blockquote"],
        name: "HTMLQuoteElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            cite: Q_
        }
    });
    j4({
        tag: "script",
        name: "HTMLScriptElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        props: {
            text: {
                get: function() {
                    var A = "";
                    for (var q = 0, K = this.childNodes.length; q < K; q++) {
                        var Y = this.childNodes[q];
                        if (Y.nodeType === gLA.TEXT_NODE) A += Y._data
                    }
                    return A
                },
                set: function(A) {
                    if (this.removeChildren(), A !== null && A !== "") this.appendChild(this.ownerDocument.createTextNode(A))
                }
            }
        },
        attributes: {
            src: Q_,
            type: String,
            charset: String,
            referrerPolicy: bW1,
            defer: Boolean,
            async: Boolean,
            nomodule: Boolean,
            crossOrigin: zW6,
            nonce: String,
            integrity: String
        }
    });
    j4({
        tag: "select",
        name: "HTMLSelectElement",
        ctor: function(q, K, Y) {
            GI.call(this, q, K, Y)
        },
        props: {
            form: ZI.form,
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
    j4({
        tag: "span",
        name: "HTMLSpanElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        }
    });
    j4({
        tag: "style",
        name: "HTMLStyleElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            media: String,
            type: String,
            scoped: Boolean
        }
    });
    j4({
        tag: "caption",
        name: "HTMLTableCaptionElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            align: String
        }
    });
    j4({
        name: "HTMLTableCellElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
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
    j4({
        tags: ["col", "colgroup"],
        name: "HTMLTableColElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
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
    j4({
        tag: "table",
        name: "HTMLTableElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
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
    j4({
        tag: "template",
        name: "HTMLTemplateElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y), this._contentFragment = q._templateDoc.createDocumentFragment()
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
    j4({
        tag: "tr",
        name: "HTMLTableRowElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
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
    j4({
        tags: ["thead", "tfoot", "tbody"],
        name: "HTMLTableSectionElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
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
    j4({
        tag: "textarea",
        name: "HTMLTextAreaElement",
        ctor: function(q, K, Y) {
            GI.call(this, q, K, Y)
        },
        props: {
            form: ZI.form,
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
    j4({
        tag: "time",
        name: "HTMLTimeElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            dateTime: String,
            pubDate: Boolean
        }
    });
    j4({
        tag: "title",
        name: "HTMLTitleElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        props: {
            text: {
                get: function() {
                    return this.textContent
                }
            }
        }
    });
    j4({
        tag: "ul",
        name: "HTMLUListElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            type: String,
            compact: Boolean
        }
    });
    j4({
        name: "HTMLMediaElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            src: Q_,
            crossOrigin: zW6,
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
    j4({
        name: "HTMLAudioElement",
        tag: "audio",
        superclass: pd.HTMLMediaElement,
        ctor: function(q, K, Y) {
            pd.HTMLMediaElement.call(this, q, K, Y)
        }
    });
    j4({
        name: "HTMLVideoElement",
        tag: "video",
        superclass: pd.HTMLMediaElement,
        ctor: function(q, K, Y) {
            pd.HTMLMediaElement.call(this, q, K, Y)
        },
        attributes: {
            poster: Q_,
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
    j4({
        tag: "td",
        name: "HTMLTableDataCellElement",
        superclass: pd.HTMLTableCellElement,
        ctor: function(q, K, Y) {
            pd.HTMLTableCellElement.call(this, q, K, Y)
        }
    });
    j4({
        tag: "th",
        name: "HTMLTableHeaderCellElement",
        superclass: pd.HTMLTableCellElement,
        ctor: function(q, K, Y) {
            pd.HTMLTableCellElement.call(this, q, K, Y)
        }
    });
    j4({
        tag: "frameset",
        name: "HTMLFrameSetElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        }
    });
    j4({
        tag: "frame",
        name: "HTMLFrameElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        }
    });
    j4({
        tag: "canvas",
        name: "HTMLCanvasElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        props: {
            getContext: {
                value: qE.nyi
            },
            probablySupportsContext: {
                value: qE.nyi
            },
            setContext: {
                value: qE.nyi
            },
            transferControlToProxy: {
                value: qE.nyi
            },
            toDataURL: {
                value: qE.nyi
            },
            toBlob: {
                value: qE.nyi
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
    j4({
        tag: "dialog",
        name: "HTMLDialogElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        props: {
            show: {
                value: qE.nyi
            },
            showModal: {
                value: qE.nyi
            },
            close: {
                value: qE.nyi
            }
        },
        attributes: {
            open: Boolean,
            returnValue: String
        }
    });
    j4({
        tag: "menuitem",
        name: "HTMLMenuItemElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
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
            icon: Q_,
            disabled: Boolean,
            checked: Boolean,
            radiogroup: String,
            default: Boolean
        }
    });
    j4({
        tag: "source",
        name: "HTMLSourceElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            srcset: String,
            sizes: String,
            media: String,
            src: Q_,
            type: String,
            width: String,
            height: String
        }
    });
    j4({
        tag: "track",
        name: "HTMLTrackElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            src: Q_,
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
                get: qE.nyi
            },
            track: {
                get: qE.nyi
            }
        }
    });
    j4({
        tag: "font",
        name: "HTMLFontElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
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
    j4({
        tag: "dir",
        name: "HTMLDirectoryElement",
        ctor: function(q, K, Y) {
            hq.call(this, q, K, Y)
        },
        attributes: {
            compact: Boolean
        }
    });
    j4({
        tags: ["abbr", "address", "article", "aside", "b", "bdi", "bdo", "cite", "content", "code", "dd", "dfn", "dt", "em", "figcaption", "figure", "footer", "header", "hgroup", "i", "kbd", "main", "mark", "nav", "noscript", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "section", "small", "strong", "sub", "summary", "sup", "u", "var", "wbr", "acronym", "basefont", "big", "center", "nobr", "noembed", "noframes", "plaintext", "strike", "tt"]
    })
})
// @from(Ln 343064, Col 4)
dLA = R(($RY) => {
    var JU4 = IW1(),
        YRY = QLA(),
        zRY = F_(),
        wRY = YW6(),
        HRY = $RY.elements = {},
        XU4 = Object.create(null);
    $RY.createElement = function(A, q, K) {
        var Y = XU4[q] || pLA;
        return new Y(A, q, K)
    };

    function ULA(A) {
        return YRY(A, pLA, HRY, XU4)
    }
    var pLA = ULA({
        superclass: JU4,
        name: "SVGElement",
        ctor: function(q, K, Y) {
            JU4.call(this, q, K, zRY.NAMESPACE.SVG, Y)
        },
        props: {
            style: {
                get: function() {
                    if (!this._style) this._style = new wRY(this);
                    return this._style
                }
            }
        }
    });
    ULA({
        name: "SVGSVGElement",
        ctor: function(q, K, Y) {
            pLA.call(this, q, K, Y)
        },
        tag: "svg",
        props: {
            createSVGRect: {
                value: function() {
                    return $RY.createElement(this.ownerDocument, "rect", null)
                }
            }
        }
    });
    ULA({
        tags: ["a", "altGlyph", "altGlyphDef", "altGlyphItem", "animate", "animateColor", "animateMotion", "animateTransform", "circle", "clipPath", "color-profile", "cursor", "defs", "desc", "ellipse", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter", "font", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignObject", "g", "glyph", "glyphRef", "hkern", "image", "line", "linearGradient", "marker", "mask", "metadata", "missing-glyph", "mpath", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "script", "set", "stop", "style", "switch", "symbol", "text", "textPath", "title", "tref", "tspan", "use", "view", "vkern"]
    })
})
// @from(Ln 343112, Col 4)
MU4 = R((FzH, jU4) => {
    jU4.exports = {
        VALUE: 1,
        ATTR: 2,
        REMOVE_ATTR: 3,
        REMOVE: 4,
        MOVE: 5,
        INSERT: 6
    }
})
// @from(Ln 343122, Col 4)
$W6 = R((QzH, EU4) => {
    EU4.exports = Pg1;
    var tW = XP(),
        ORY = k51(),
        VU4 = lP6(),
        vt = IW1(),
        _RY = TLA(),
        JRY = ELA(),
        Mg1 = kW1(),
        XRY = LLA(),
        DRY = yLA(),
        jRY = Wg1(),
        MRY = mg4(),
        PRY = dg4(),
        PU4 = Xg1(),
        WU4 = KW6(),
        GU4 = aP6(),
        WRY = mLA(),
        HW6 = iP6(),
        cLA = wW6(),
        GRY = dLA(),
        Mz = F_(),
        uW1 = MU4(),
        mW1 = Mz.NAMESPACE,
        lLA = pP6().isApiWritable;

    function Pg1(A, q) {
        VU4.call(this), this.nodeType = tW.DOCUMENT_NODE, this.isHTML = A, this._address = q || "about:blank", this.readyState = "loading", this.implementation = new jRY(this), this.ownerDocument = null, this._contentType = A ? "text/html" : "application/xml", this.doctype = null, this.documentElement = null, this._templateDocCache = null, this._nodeIterators = null, this._nid = 1, this._nextnid = 2, this._nodes = [null, this], this.byId = Object.create(null), this.modclock = 0
    }
    var ZRY = {
            event: "Event",
            customevent: "CustomEvent",
            uievent: "UIEvent",
            mouseevent: "MouseEvent"
        },
        fRY = {
            events: "event",
            htmlevents: "event",
            mouseevents: "mouseevent",
            mutationevents: "mutationevent",
            uievents: "uievent"
        },
        BW1 = function(A, q, K) {
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

    function ZU4(A, q) {
        var K, Y, z;
        if (A === "") A = null;
        if (!HW6.isValidQName(q)) Mz.InvalidCharacterError();
        if (K = null, Y = q, z = q.indexOf(":"), z >= 0) K = q.substring(0, z), Y = q.substring(z + 1);
        if (K !== null && A === null) Mz.NamespaceError();
        if (K === "xml" && A !== mW1.XML) Mz.NamespaceError();
        if ((K === "xmlns" || q === "xmlns") && A !== mW1.XMLNS) Mz.NamespaceError();
        if (A === mW1.XMLNS && !(K === "xmlns" || q === "xmlns")) Mz.NamespaceError();
        return {
            namespace: A,
            prefix: K,
            localName: Y
        }
    }
    Pg1.prototype = Object.create(VU4.prototype, {
        _setMutationHandler: {
            value: function(A) {
                this.mutationHandler = A
            }
        },
        _dispatchRendererEvent: {
            value: function(A, q, K) {
                var Y = this._nodes[A];
                if (!Y) return;
                Y._dispatchEvent(new Mg1(q, K), !0)
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
            set: Mz.nyi
        },
        compatMode: {
            get: function() {
                return this._quirks ? "BackCompat" : "CSS1Compat"
            }
        },
        createTextNode: {
            value: function(A) {
                return new _RY(this, String(A))
            }
        },
        createComment: {
            value: function(A) {
                return new JRY(this, A)
            }
        },
        createDocumentFragment: {
            value: function() {
                return new XRY(this)
            }
        },
        createProcessingInstruction: {
            value: function(A, q) {
                if (!HW6.isValidName(A) || q.indexOf("?>") !== -1) Mz.InvalidCharacterError();
                return new DRY(this, A, q)
            }
        },
        createAttribute: {
            value: function(A) {
                if (A = String(A), !HW6.isValidName(A)) Mz.InvalidCharacterError();
                if (this.isHTML) A = Mz.toASCIILowerCase(A);
                return new vt._Attr(null, A, null, null, "")
            }
        },
        createAttributeNS: {
            value: function(A, q) {
                A = A === null || A === void 0 || A === "" ? null : String(A), q = String(q);
                var K = ZU4(A, q);
                return new vt._Attr(null, K.localName, K.prefix, K.namespace, "")
            }
        },
        createElement: {
            value: function(A) {
                if (A = String(A), !HW6.isValidName(A)) Mz.InvalidCharacterError();
                if (this.isHTML) {
                    if (/[A-Z]/.test(A)) A = Mz.toASCIILowerCase(A);
                    return cLA.createElement(this, A, null)
                } else if (this.contentType === "application/xhtml+xml") return cLA.createElement(this, A, null);
                else return new vt(this, A, null, null)
            },
            writable: lLA
        },
        createElementNS: {
            value: function(A, q) {
                A = A === null || A === void 0 || A === "" ? null : String(A), q = String(q);
                var K = ZU4(A, q);
                return this._createElementNS(K.localName, K.namespace, K.prefix)
            },
            writable: lLA
        },
        _createElementNS: {
            value: function(A, q, K) {
                if (q === mW1.HTML) return cLA.createElement(this, A, K);
                else if (q === mW1.SVG) return GRY.createElement(this, A, K);
                return new vt(this, A, q, K)
            }
        },
        createEvent: {
            value: function(q) {
                q = q.toLowerCase();
                var K = fRY[q] || q,
                    Y = WRY[ZRY[K]];
                if (Y) {
                    var z = new Y;
                    return z._initialized = !1, z
                } else Mz.NotSupportedError()
            }
        },
        createTreeWalker: {
            value: function(A, q, K) {
                if (!A) throw TypeError("root argument is required");
                if (!(A instanceof tW)) throw TypeError("root not a node");
                return q = q === void 0 ? PU4.SHOW_ALL : +q, K = K === void 0 ? null : K, new MRY(A, q, K)
            }
        },
        createNodeIterator: {
            value: function(A, q, K) {
                if (!A) throw TypeError("root argument is required");
                if (!(A instanceof tW)) throw TypeError("root not a node");
                return q = q === void 0 ? PU4.SHOW_ALL : +q, K = K === void 0 ? null : K, new PRY(A, q, K)
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
                    if (q.nodeType === tW.DOCUMENT_TYPE_NODE) this.doctype = q;
                    else if (q.nodeType === tW.ELEMENT_NODE) this.documentElement = q
            }
        },
        insertBefore: {
            value: function(q, K) {
                return tW.prototype.insertBefore.call(this, q, K), this._updateDocTypeElement(), q
            }
        },
        replaceChild: {
            value: function(q, K) {
                return tW.prototype.replaceChild.call(this, q, K), this._updateDocTypeElement(), K
            }
        },
        removeChild: {
            value: function(q) {
                return tW.prototype.removeChild.call(this, q), this._updateDocTypeElement(), q
            }
        },
        getElementById: {
            value: function(A) {
                var q = this.byId[A];
                if (!q) return null;
                if (q instanceof dd) return q.getFirst();
                return q
            }
        },
        _hasMultipleElementsWithId: {
            value: function(A) {
                return this.byId[A] instanceof dd
            }
        },
        getElementsByName: {
            value: vt.prototype.getElementsByName
        },
        getElementsByTagName: {
            value: vt.prototype.getElementsByTagName
        },
        getElementsByTagNameNS: {
            value: vt.prototype.getElementsByTagNameNS
        },
        getElementsByClassName: {
            value: vt.prototype.getElementsByClassName
        },
        adoptNode: {
            value: function(q) {
                if (q.nodeType === tW.DOCUMENT_NODE) Mz.NotSupportedError();
                if (q.nodeType === tW.ATTRIBUTE_NODE) return q;
                if (q.parentNode) q.parentNode.removeChild(q);
                if (q.ownerDocument !== this) vU4(q, this);
                return q
            }
        },
        importNode: {
            value: function(q, K) {
                return this.adoptNode(q.cloneNode(K))
            },
            writable: lLA
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
            get: Mz.nyi,
            set: Mz.nyi
        },
        referrer: {
            get: Mz.nyi
        },
        cookie: {
            get: Mz.nyi,
            set: Mz.nyi
        },
        lastModified: {
            get: Mz.nyi
        },
        location: {
            get: function() {
                return this.defaultView ? this.defaultView.location : null
            },
            set: Mz.nyi
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
        dir: BW1(function() {
            var A = this.documentElement;
            if (A && A.tagName === "HTML") return A
        }, "dir", ""),
        fgColor: BW1(function() {
            return this.body
        }, "text", ""),
        linkColor: BW1(function() {
            return this.body
        }, "link", ""),
        vlinkColor: BW1(function() {
            return this.body
        }, "vLink", ""),
        alinkColor: BW1(function() {
            return this.body
        }, "aLink", ""),
        bgColor: BW1(function() {
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
                return fU4(this.documentElement, "body")
            },
            set: Mz.nyi
        },
        head: {
            get: function() {
                return fU4(this.documentElement, "head")
            }
        },
        images: {
            get: Mz.nyi
        },
        embeds: {
            get: Mz.nyi
        },
        plugins: {
            get: Mz.nyi
        },
        links: {
            get: Mz.nyi
        },
        forms: {
            get: Mz.nyi
        },
        scripts: {
            get: Mz.nyi
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
            set: Mz.nyi
        },
        outerHTML: {
            get: function() {
                return this.serialize()
            },
            set: Mz.nyi
        },
        write: {
            value: function(A) {
                if (!this.isHTML) Mz.InvalidStateError();
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
                if (this.readyState = "interactive", this._dispatchEvent(new Mg1("readystatechange"), !0), this._dispatchEvent(new Mg1("DOMContentLoaded"), !0), this.readyState = "complete", this._dispatchEvent(new Mg1("readystatechange"), !0), this.defaultView) this.defaultView._dispatchEvent(new Mg1("load"), !0)
            }
        },
        clone: {
            value: function() {
                var q = new Pg1(this.isHTML, this._address);
                return q._quirks = this._quirks, q._contentType = this._contentType, q
            }
        },
        cloneNode: {
            value: function(q) {
                var K = tW.prototype.cloneNode.call(this, !1);
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
                    type: uW1.VALUE,
                    target: A,
                    data: A.data
                })
            }
        },
        mutateAttr: {
            value: function(A, q) {
                if (this.mutationHandler) this.mutationHandler({
                    type: uW1.ATTR,
                    target: A.ownerElement,
                    attr: A
                })
            }
        },
        mutateRemoveAttr: {
            value: function(A) {
                if (this.mutationHandler) this.mutationHandler({
                    type: uW1.REMOVE_ATTR,
                    target: A.ownerElement,
                    attr: A
                })
            }
        },
        mutateRemove: {
            value: function(A) {
                if (this.mutationHandler) this.mutationHandler({
                    type: uW1.REMOVE,
                    target: A.parentNode,
                    node: A
                });
                TU4(A)
            }
        },
        mutateInsert: {
            value: function(A) {
                if (NU4(A), this.mutationHandler) this.mutationHandler({
                    type: uW1.INSERT,
                    target: A.parentNode,
                    node: A
                })
            }
        },
        mutateMove: {
            value: function(A) {
                if (this.mutationHandler) this.mutationHandler({
                    type: uW1.MOVE,
                    target: A
                })
            }
        },
        addId: {
            value: function(q, K) {
                var Y = this.byId[q];
                if (!Y) this.byId[q] = K;
                else {
                    if (!(Y instanceof dd)) Y = new dd(Y), this.byId[q] = Y;
                    Y.add(K)
                }
            }
        },
        delId: {
            value: function(q, K) {
                var Y = this.byId[q];
                if (Mz.assert(Y), Y instanceof dd) {
                    if (Y.del(K), Y.length === 1) this.byId[q] = Y.downgrade()
                } else this.byId[q] = void 0
            }
        },
        _resolve: {
            value: function(A) {
                return new WU4(this._documentBaseURL).resolve(A)
            }
        },
        _documentBaseURL: {
            get: function() {
                var A = this._address;
                if (A === "about:blank") A = "/";
                var q = this.querySelector("base[href]");
                if (q) return new WU4(A).resolve(q.getAttribute("href"));
                return A
            }
        },
        _templateDoc: {
            get: function() {
                if (!this._templateDocCache) {
                    var A = new Pg1(this.isHTML, this._address);
                    this._templateDocCache = A._templateDocCache = A
                }
                return this._templateDocCache
            }
        },
        querySelector: {
            value: function(A) {
                return GU4(A, this)[0]
            }
        },
        querySelectorAll: {
            value: function(A) {
                var q = GU4(A, this);
                return q.item ? q : new ORY(q)
            }
        }
    });
    var VRY = ["abort", "canplay", "canplaythrough", "change", "click", "contextmenu", "cuechange", "dblclick", "drag", "dragend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "durationchange", "emptied", "ended", "input", "invalid", "keydown", "keypress", "keyup", "loadeddata", "loadedmetadata", "loadstart", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "mousewheel", "pause", "play", "playing", "progress", "ratechange", "readystatechange", "reset", "seeked", "seeking", "select", "show", "stalled", "submit", "suspend", "timeupdate", "volumechange", "waiting", "blur", "error", "focus", "load", "scroll"];
    VRY.forEach(function(A) {
        Object.defineProperty(Pg1.prototype, "on" + A, {
            get: function() {
                return this._getEventHandler(A)
            },
            set: function(q) {
                this._setEventHandler(A, q)
            }
        })
    });

    function fU4(A, q) {
        if (A && A.isHTML) {
            for (var K = A.firstChild; K !== null; K = K.nextSibling)
                if (K.nodeType === tW.ELEMENT_NODE && K.localName === q && K.namespaceURI === mW1.HTML) return K
        }
        return null
    }

    function NRY(A) {
        if (A._nid = A.ownerDocument._nextnid++, A.ownerDocument._nodes[A._nid] = A, A.nodeType === tW.ELEMENT_NODE) {
            var q = A.getAttribute("id");
            if (q) A.ownerDocument.addId(q, A);
            if (A._roothook) A._roothook()
        }
    }

    function TRY(A) {
        if (A.nodeType === tW.ELEMENT_NODE) {
            var q = A.getAttribute("id");
            if (q) A.ownerDocument.delId(q, A)
        }
        A.ownerDocument._nodes[A._nid] = void 0, A._nid = void 0
    }

    function NU4(A) {
        if (NRY(A), A.nodeType === tW.ELEMENT_NODE)
            for (var q = A.firstChild; q !== null; q = q.nextSibling) NU4(q)
    }

    function TU4(A) {
        TRY(A);
        for (var q = A.firstChild; q !== null; q = q.nextSibling) TU4(q)
    }

    function vU4(A, q) {
        if (A.ownerDocument = q, A._lastModTime = void 0, Object.prototype.hasOwnProperty.call(A, "_tagName")) A._tagName = void 0;
        for (var K = A.firstChild; K !== null; K = K.nextSibling) vU4(K, q)
    }

    function dd(A) {
        this.nodes = Object.create(null), this.nodes[A._nid] = A, this.length = 1, this.firstNode = void 0
    }
    dd.prototype.add = function(A) {
        if (!this.nodes[A._nid]) this.nodes[A._nid] = A, this.length++, this.firstNode = void 0
    };
    dd.prototype.del = function(A) {
        if (this.nodes[A._nid]) delete this.nodes[A._nid], this.length--, this.firstNode = void 0
    };
    dd.prototype.getFirst = function() {
        if (!this.firstNode) {
            var A;
            for (A in this.nodes)
                if (this.firstNode === void 0 || this.firstNode.compareDocumentPosition(this.nodes[A]) & tW.DOCUMENT_POSITION_PRECEDING) this.firstNode = this.nodes[A]
        }
        return this.firstNode
    };
    dd.prototype.downgrade = function() {
        if (this.length === 1) {
            var A;
            for (A in this.nodes) return this.nodes[A]
        }
        return this
    }
})
// @from(Ln 343765, Col 4)
_W6 = R((gzH, LU4) => {
    LU4.exports = OW6;
    var vRY = XP(),
        kU4 = VLA(),
        ERY = sP6();

    function OW6(A, q, K, Y) {
        kU4.call(this), this.nodeType = vRY.DOCUMENT_TYPE_NODE, this.ownerDocument = A || null, this.name = q, this.publicId = K || "", this.systemId = Y || ""
    }
    OW6.prototype = Object.create(kU4.prototype, {
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
                return new OW6(this.ownerDocument, this.name, this.publicId, this.systemId)
            }
        },
        isEqual: {
            value: function(q) {
                return this.name === q.name && this.publicId === q.publicId && this.systemId === q.systemId
            }
        }
    });
    Object.defineProperties(OW6.prototype, ERY)
})