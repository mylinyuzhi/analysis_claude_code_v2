
// @from(Ln 372951, Col 4)
NQ8 = p((NOY) => {
    var Y57 = HG(),
        EDK = Fb6(),
        vOY = VQ8(),
        PS = CX(),
        yDK = _57(),
        TOY = z57(),
        He = NOY.elements = {},
        b58 = Object.create(null);
    NOY.createElement = function(q, K, _) {
        var z = b58[K] || kOY;
        return new z(q, K, _)
    };

    function m4(q) {
        return TOY(q, O5, He, b58)
    }

    function bX(q) {
        return {
            get: function() {
                var K = this._getattr(q);
                if (K === null) return "";
                var _ = this.doc._resolve(K);
                return _ === null ? K : _
            },
            set: function(K) {
                this._setattr(q, K)
            }
        }
    }

    function kQ8(q) {
        return {
            get: function() {
                var K = this._getattr(q);
                if (K === null) return null;
                if (K.toLowerCase() === "use-credentials") return "use-credentials";
                return "anonymous"
            },
            set: function(K) {
                if (K === null || K === void 0) this.removeAttribute(q);
                else this._setattr(q, K)
            }
        }
    }
    var Ub6 = {
            type: ["", "no-referrer", "no-referrer-when-downgrade", "same-origin", "origin", "strict-origin", "origin-when-cross-origin", "strict-origin-when-cross-origin", "unsafe-url"],
            missing: ""
        },
        VOY = {
            A: !0,
            LINK: !0,
            BUTTON: !0,
            INPUT: !0,
            SELECT: !0,
            TEXTAREA: !0,
            COMMAND: !0
        },
        nF = function(q, K, _) {
            O5.call(this, q, K, _), this._form = null
        },
        O5 = NOY.HTMLElement = m4({
            superclass: EDK,
            name: "HTMLElement",
            ctor: function(K, _, z) {
                EDK.call(this, K, _, PS.NAMESPACE.HTML, z)
            },
            props: {
                dangerouslySetInnerHTML: {
                    set: function(q) {
                        this._innerHTML = q
                    }
                },
                innerHTML: {
                    get: function() {
                        return this.serialize()
                    },
                    set: function(q) {
                        var K = this.ownerDocument.implementation.mozHTMLParser(this.ownerDocument._address, this);
                        K.parse(q === null ? "" : String(q), !0);
                        var _ = this instanceof b58.template ? this.content : this;
                        while (_.hasChildNodes()) _.removeChild(_.firstChild);
                        _.appendChild(K._asDocumentFragment())
                    }
                },
                style: {
                    get: function() {
                        if (!this._style) this._style = new vOY(this);
                        return this._style
                    },
                    set: function(q) {
                        if (q === null || q === void 0) q = "";
                        this._setattr("style", String(q))
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
                            var q = this.ownerDocument.createEvent("MouseEvent");
                            q.initMouseEvent("click", !0, !0, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, !1, !1, !1, !1, 0, null);
                            var K = this.dispatchEvent(q);
                            if (K) {
                                if (this._post_click_activation_steps) this._post_click_activation_steps(q)
                            } else if (this._cancelled_activation_steps) this._cancelled_activation_steps()
                        } finally {
                            this._click_in_progress = !1
                        }
                    }
                },
                submit: {
                    value: PS.nyi
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
                        if (this.tagName in VOY || this.contentEditable) return 0;
                        else return -1
                    }
                }
            },
            events: ["abort", "canplay", "canplaythrough", "change", "click", "contextmenu", "cuechange", "dblclick", "drag", "dragend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "durationchange", "emptied", "ended", "input", "invalid", "keydown", "keypress", "keyup", "loadeddata", "loadedmetadata", "loadstart", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "mousewheel", "pause", "play", "playing", "progress", "ratechange", "readystatechange", "reset", "seeked", "seeking", "select", "show", "stalled", "submit", "suspend", "timeupdate", "volumechange", "waiting", "blur", "error", "focus", "load", "scroll"]
        }),
        kOY = m4({
            name: "HTMLUnknownElement",
            ctor: function(K, _, z) {
                O5.call(this, K, _, z)
            }
        }),
        iF = {
            form: {
                get: function() {
                    return this._form
                }
            }
        };
    m4({
        tag: "a",
        name: "HTMLAnchorElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        props: {
            _post_click_activation_steps: {
                value: function(q) {
                    if (this.href) this.ownerDocument.defaultView.location = this.href
                }
            }
        },
        attributes: {
            href: bX,
            ping: String,
            download: String,
            target: String,
            rel: String,
            media: String,
            hreflang: String,
            type: String,
            referrerPolicy: Ub6,
            coords: String,
            charset: String,
            name: String,
            rev: String,
            shape: String
        }
    });
    yDK._inherit(b58.a.prototype);
    m4({
        tag: "area",
        name: "HTMLAreaElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            alt: String,
            target: String,
            download: String,
            rel: String,
            media: String,
            href: bX,
            hreflang: String,
            type: String,
            shape: String,
            coords: String,
            ping: String,
            referrerPolicy: Ub6,
            noHref: Boolean
        }
    });
    yDK._inherit(b58.area.prototype);
    m4({
        tag: "br",
        name: "HTMLBRElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            clear: String
        }
    });
    m4({
        tag: "base",
        name: "HTMLBaseElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            target: String
        }
    });
    m4({
        tag: "body",
        name: "HTMLBodyElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
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
    m4({
        tag: "button",
        name: "HTMLButtonElement",
        ctor: function(K, _, z) {
            nF.call(this, K, _, z)
        },
        props: iF,
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
            formAction: bX,
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
    m4({
        tag: "dl",
        name: "HTMLDListElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            compact: Boolean
        }
    });
    m4({
        tag: "data",
        name: "HTMLDataElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            value: String
        }
    });
    m4({
        tag: "datalist",
        name: "HTMLDataListElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        }
    });
    m4({
        tag: "details",
        name: "HTMLDetailsElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            open: Boolean
        }
    });
    m4({
        tag: "div",
        name: "HTMLDivElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            align: String
        }
    });
    m4({
        tag: "embed",
        name: "HTMLEmbedElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            src: bX,
            type: String,
            width: String,
            height: String,
            align: String,
            name: String
        }
    });
    m4({
        tag: "fieldset",
        name: "HTMLFieldSetElement",
        ctor: function(K, _, z) {
            nF.call(this, K, _, z)
        },
        props: iF,
        attributes: {
            disabled: Boolean,
            name: String
        }
    });
    m4({
        tag: "form",
        name: "HTMLFormElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
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
    m4({
        tag: "hr",
        name: "HTMLHRElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            align: String,
            color: String,
            noShade: Boolean,
            size: String,
            width: String
        }
    });
    m4({
        tag: "head",
        name: "HTMLHeadElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        }
    });
    m4({
        tags: ["h1", "h2", "h3", "h4", "h5", "h6"],
        name: "HTMLHeadingElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            align: String
        }
    });
    m4({
        tag: "html",
        name: "HTMLHtmlElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            xmlns: bX,
            version: String
        }
    });
    m4({
        tag: "iframe",
        name: "HTMLIFrameElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            src: bX,
            srcdoc: String,
            name: String,
            width: String,
            height: String,
            seamless: Boolean,
            allow: Boolean,
            allowFullscreen: Boolean,
            allowUserMedia: Boolean,
            allowPaymentRequest: Boolean,
            referrerPolicy: Ub6,
            loading: {
                type: ["eager", "lazy"],
                treatNullAsEmptyString: !0
            },
            align: String,
            scrolling: String,
            frameBorder: String,
            longDesc: bX,
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
    m4({
        tag: "img",
        name: "HTMLImageElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            alt: String,
            src: bX,
            srcset: String,
            crossOrigin: kQ8,
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
            referrerPolicy: Ub6,
            loading: {
                type: ["eager", "lazy"],
                missing: ""
            },
            name: String,
            lowsrc: bX,
            align: String,
            hspace: {
                type: "unsigned long",
                default: 0
            },
            vspace: {
                type: "unsigned long",
                default: 0
            },
            longDesc: bX,
            border: {
                type: String,
                treatNullAsEmptyString: !0
            }
        }
    });
    m4({
        tag: "input",
        name: "HTMLInputElement",
        ctor: function(K, _, z) {
            nF.call(this, K, _, z)
        },
        props: {
            form: iF.form,
            _post_click_activation_steps: {
                value: function(q) {
                    if (this.type === "checkbox") this.checked = !this.checked;
                    else if (this.type === "radio") {
                        var K = this.form.getElementsByName(this.name);
                        for (var _ = K.length - 1; _ >= 0; _--) {
                            var z = K[_];
                            z.checked = z === this
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
            src: bX,
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
    m4({
        tag: "keygen",
        name: "HTMLKeygenElement",
        ctor: function(K, _, z) {
            nF.call(this, K, _, z)
        },
        props: iF,
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
    m4({
        tag: "li",
        name: "HTMLLIElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            value: {
                type: "long",
                default: 0
            },
            type: String
        }
    });
    m4({
        tag: "label",
        name: "HTMLLabelElement",
        ctor: function(K, _, z) {
            nF.call(this, K, _, z)
        },
        props: iF,
        attributes: {
            htmlFor: {
                name: "for",
                type: String
            }
        }
    });
    m4({
        tag: "legend",
        name: "HTMLLegendElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            align: String
        }
    });
    m4({
        tag: "link",
        name: "HTMLLinkElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            href: bX,
            rel: String,
            media: String,
            hreflang: String,
            type: String,
            crossOrigin: kQ8,
            nonce: String,
            integrity: String,
            referrerPolicy: Ub6,
            imageSizes: String,
            imageSrcset: String,
            charset: String,
            rev: String,
            target: String
        }
    });
    m4({
        tag: "map",
        name: "HTMLMapElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            name: String
        }
    });
    m4({
        tag: "menu",
        name: "HTMLMenuElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
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
    m4({
        tag: "meta",
        name: "HTMLMetaElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
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
    m4({
        tag: "meter",
        name: "HTMLMeterElement",
        ctor: function(K, _, z) {
            nF.call(this, K, _, z)
        },
        props: iF
    });
    m4({
        tags: ["ins", "del"],
        name: "HTMLModElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            cite: bX,
            dateTime: String
        }
    });
    m4({
        tag: "ol",
        name: "HTMLOListElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        props: {
            _numitems: {
                get: function() {
                    var q = 0;
                    return this.childNodes.forEach(function(K) {
                        if (K.nodeType === Y57.ELEMENT_NODE && K.tagName === "LI") q++
                    }), q
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
    m4({
        tag: "object",
        name: "HTMLObjectElement",
        ctor: function(K, _, z) {
            nF.call(this, K, _, z)
        },
        props: iF,
        attributes: {
            data: bX,
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
            codeBase: bX,
            codeType: String,
            border: {
                type: String,
                treatNullAsEmptyString: !0
            }
        }
    });
    m4({
        tag: "optgroup",
        name: "HTMLOptGroupElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            disabled: Boolean,
            label: String
        }
    });
    m4({
        tag: "option",
        name: "HTMLOptionElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        props: {
            form: {
                get: function() {
                    var q = this.parentNode;
                    while (q && q.nodeType === Y57.ELEMENT_NODE) {
                        if (q.localName === "select") return q.form;
                        q = q.parentNode
                    }
                }
            },
            value: {
                get: function() {
                    return this._getattr("value") || this.text
                },
                set: function(q) {
                    this._setattr("value", q)
                }
            },
            text: {
                get: function() {
                    return this.textContent.replace(/[ \t\n\f\r]+/g, " ").trim()
                },
                set: function(q) {
                    this.textContent = q
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
    m4({
        tag: "output",
        name: "HTMLOutputElement",
        ctor: function(K, _, z) {
            nF.call(this, K, _, z)
        },
        props: iF,
        attributes: {
            name: String
        }
    });
    m4({
        tag: "p",
        name: "HTMLParagraphElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            align: String
        }
    });
    m4({
        tag: "param",
        name: "HTMLParamElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            name: String,
            value: String,
            type: String,
            valueType: String
        }
    });
    m4({
        tags: ["pre", "listing", "xmp"],
        name: "HTMLPreElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            width: {
                type: "long",
                default: 0
            }
        }
    });
    m4({
        tag: "progress",
        name: "HTMLProgressElement",
        ctor: function(K, _, z) {
            nF.call(this, K, _, z)
        },
        props: iF,
        attributes: {
            max: {
                type: Number,
                float: !0,
                default: 1,
                min: 0
            }
        }
    });
    m4({
        tags: ["q", "blockquote"],
        name: "HTMLQuoteElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            cite: bX
        }
    });
    m4({
        tag: "script",
        name: "HTMLScriptElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        props: {
            text: {
                get: function() {
                    var q = "";
                    for (var K = 0, _ = this.childNodes.length; K < _; K++) {
                        var z = this.childNodes[K];
                        if (z.nodeType === Y57.TEXT_NODE) q += z._data
                    }
                    return q
                },
                set: function(q) {
                    if (this.removeChildren(), q !== null && q !== "") this.appendChild(this.ownerDocument.createTextNode(q))
                }
            }
        },
        attributes: {
            src: bX,
            type: String,
            charset: String,
            referrerPolicy: Ub6,
            defer: Boolean,
            async: Boolean,
            nomodule: Boolean,
            crossOrigin: kQ8,
            nonce: String,
            integrity: String
        }
    });
    m4({
        tag: "select",
        name: "HTMLSelectElement",
        ctor: function(K, _, z) {
            nF.call(this, K, _, z)
        },
        props: {
            form: iF.form,
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
    m4({
        tag: "span",
        name: "HTMLSpanElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        }
    });
    m4({
        tag: "style",
        name: "HTMLStyleElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            media: String,
            type: String,
            scoped: Boolean
        }
    });
    m4({
        tag: "caption",
        name: "HTMLTableCaptionElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            align: String
        }
    });
    m4({
        name: "HTMLTableCellElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
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
    m4({
        tags: ["col", "colgroup"],
        name: "HTMLTableColElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
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
    m4({
        tag: "table",
        name: "HTMLTableElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
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
    m4({
        tag: "template",
        name: "HTMLTemplateElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z), this._contentFragment = K._templateDoc.createDocumentFragment()
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
    m4({
        tag: "tr",
        name: "HTMLTableRowElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
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
    m4({
        tags: ["thead", "tfoot", "tbody"],
        name: "HTMLTableSectionElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
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
    m4({
        tag: "textarea",
        name: "HTMLTextAreaElement",
        ctor: function(K, _, z) {
            nF.call(this, K, _, z)
        },
        props: {
            form: iF.form,
            type: {
                get: function() {
                    return "textarea"
                }
            },
            defaultValue: {
                get: function() {
                    return this.textContent
                },
                set: function(q) {
                    this.textContent = q
                }
            },
            value: {
                get: function() {
                    return this.defaultValue
                },
                set: function(q) {
                    this.defaultValue = q
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
    m4({
        tag: "time",
        name: "HTMLTimeElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            dateTime: String,
            pubDate: Boolean
        }
    });
    m4({
        tag: "title",
        name: "HTMLTitleElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        props: {
            text: {
                get: function() {
                    return this.textContent
                }
            }
        }
    });
    m4({
        tag: "ul",
        name: "HTMLUListElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            type: String,
            compact: Boolean
        }
    });
    m4({
        name: "HTMLMediaElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            src: bX,
            crossOrigin: kQ8,
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
    m4({
        name: "HTMLAudioElement",
        tag: "audio",
        superclass: He.HTMLMediaElement,
        ctor: function(K, _, z) {
            He.HTMLMediaElement.call(this, K, _, z)
        }
    });
    m4({
        name: "HTMLVideoElement",
        tag: "video",
        superclass: He.HTMLMediaElement,
        ctor: function(K, _, z) {
            He.HTMLMediaElement.call(this, K, _, z)
        },
        attributes: {
            poster: bX,
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
    m4({
        tag: "td",
        name: "HTMLTableDataCellElement",
        superclass: He.HTMLTableCellElement,
        ctor: function(K, _, z) {
            He.HTMLTableCellElement.call(this, K, _, z)
        }
    });
    m4({
        tag: "th",
        name: "HTMLTableHeaderCellElement",
        superclass: He.HTMLTableCellElement,
        ctor: function(K, _, z) {
            He.HTMLTableCellElement.call(this, K, _, z)
        }
    });
    m4({
        tag: "frameset",
        name: "HTMLFrameSetElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        }
    });
    m4({
        tag: "frame",
        name: "HTMLFrameElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        }
    });
    m4({
        tag: "canvas",
        name: "HTMLCanvasElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        props: {
            getContext: {
                value: PS.nyi
            },
            probablySupportsContext: {
                value: PS.nyi
            },
            setContext: {
                value: PS.nyi
            },
            transferControlToProxy: {
                value: PS.nyi
            },
            toDataURL: {
                value: PS.nyi
            },
            toBlob: {
                value: PS.nyi
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
    m4({
        tag: "dialog",
        name: "HTMLDialogElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        props: {
            show: {
                value: PS.nyi
            },
            showModal: {
                value: PS.nyi
            },
            close: {
                value: PS.nyi
            }
        },
        attributes: {
            open: Boolean,
            returnValue: String
        }
    });
    m4({
        tag: "menuitem",
        name: "HTMLMenuItemElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        props: {
            _label: {
                get: function() {
                    var q = this._getattr("label");
                    if (q !== null && q !== "") return q;
                    return q = this.textContent, q.replace(/[ \t\n\f\r]+/g, " ").trim()
                }
            },
            label: {
                get: function() {
                    var q = this._getattr("label");
                    if (q !== null) return q;
                    return this._label
                },
                set: function(q) {
                    this._setattr("label", q)
                }
            }
        },
        attributes: {
            type: {
                type: ["command", "checkbox", "radio"],
                missing: "command"
            },
            icon: bX,
            disabled: Boolean,
            checked: Boolean,
            radiogroup: String,
            default: Boolean
        }
    });
    m4({
        tag: "source",
        name: "HTMLSourceElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            srcset: String,
            sizes: String,
            media: String,
            src: bX,
            type: String,
            width: String,
            height: String
        }
    });
    m4({
        tag: "track",
        name: "HTMLTrackElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            src: bX,
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
                get: PS.nyi
            },
            track: {
                get: PS.nyi
            }
        }
    });
    m4({
        tag: "font",
        name: "HTMLFontElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
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
    m4({
        tag: "dir",
        name: "HTMLDirectoryElement",
        ctor: function(K, _, z) {
            O5.call(this, K, _, z)
        },
        attributes: {
            compact: Boolean
        }
    });
    m4({
        tags: ["abbr", "address", "article", "aside", "b", "bdi", "bdo", "cite", "content", "code", "dd", "dfn", "dt", "em", "figcaption", "figure", "footer", "header", "hgroup", "i", "kbd", "main", "mark", "nav", "noscript", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "section", "small", "strong", "sub", "summary", "sup", "u", "var", "wbr", "acronym", "basefont", "big", "center", "nobr", "noembed", "noframes", "plaintext", "strike", "tt"]
    })
})
// @from(Ln 374576, Col 4)
w57 = p((SOY) => {
    var LDK = Fb6(),
        yOY = z57(),
        LOY = CX(),
        hOY = VQ8(),
        ROY = SOY.elements = {},
        hDK = Object.create(null);
    SOY.createElement = function(q, K, _) {
        var z = hDK[K] || O57;
        return new z(q, K, _)
    };

    function A57(q) {
        return yOY(q, O57, ROY, hDK)
    }
    var O57 = A57({
        superclass: LDK,
        name: "SVGElement",
        ctor: function(K, _, z) {
            LDK.call(this, K, _, LOY.NAMESPACE.SVG, z)
        },
        props: {
            style: {
                get: function() {
                    if (!this._style) this._style = new hOY(this);
                    return this._style
                }
            }
        }
    });
    A57({
        name: "SVGSVGElement",
        ctor: function(K, _, z) {
            O57.call(this, K, _, z)
        },
        tag: "svg",
        props: {
            createSVGRect: {
                value: function() {
                    return SOY.createElement(this.ownerDocument, "rect", null)
                }
            }
        }
    });
    A57({
        tags: ["a", "altGlyph", "altGlyphDef", "altGlyphItem", "animate", "animateColor", "animateMotion", "animateTransform", "circle", "clipPath", "color-profile", "cursor", "defs", "desc", "ellipse", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter", "font", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignObject", "g", "glyph", "glyphRef", "hkern", "image", "line", "linearGradient", "marker", "mask", "metadata", "missing-glyph", "mpath", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "script", "set", "stop", "style", "switch", "symbol", "text", "textPath", "title", "tref", "tspan", "use", "view", "vkern"]
    })
})
// @from(Ln 374624, Col 4)
CDK = p((Fl2, SDK) => {
    SDK.exports = {
        VALUE: 1,
        ATTR: 2,
        REMOVE_ATTR: 3,
        REMOVE: 4,
        MOVE: 5,
        INSERT: 6
    }
})
// @from(Ln 374634, Col 4)
yQ8 = p((gl2, UDK) => {
    UDK.exports = x58;
    var yT = HG(),
        COY = vM6(),
        BDK = HQ8(),
        o96 = Fb6(),
        bOY = gK7(),
        IOY = QK7(),
        I58 = bb6(),
        xOY = cK7(),
        uOY = nK7(),
        mOY = u58(),
        BOY = qDK(),
        pOY = ODK(),
        bDK = S58(),
        IDK = TQ8(),
        xDK = WQ8(),
        FOY = K57(),
        EQ8 = JQ8(),
        $57 = NQ8(),
        gOY = w57(),
        wO = CX(),
        Qb6 = CDK(),
        cb6 = wO.NAMESPACE,
        j57 = wQ8().isApiWritable;

    function x58(q, K) {
        BDK.call(this), this.nodeType = yT.DOCUMENT_NODE, this.isHTML = q, this._address = K || "about:blank", this.readyState = "loading", this.implementation = new mOY(this), this.ownerDocument = null, this._contentType = q ? "text/html" : "application/xml", this.doctype = null, this.documentElement = null, this._templateDocCache = null, this._nodeIterators = null, this._nid = 1, this._nextnid = 2, this._nodes = [null, this], this.byId = Object.create(null), this.modclock = 0
    }
    var UOY = {
            event: "Event",
            customevent: "CustomEvent",
            uievent: "UIEvent",
            mouseevent: "MouseEvent"
        },
        QOY = {
            events: "event",
            htmlevents: "event",
            mouseevents: "mouseevent",
            mutationevents: "mutationevent",
            uievents: "uievent"
        },
        db6 = function(q, K, _) {
            return {
                get: function() {
                    var z = q.call(this);
                    if (z) return z[K];
                    return _
                },
                set: function(z) {
                    var Y = q.call(this);
                    if (Y) Y[K] = z
                }
            }
        };

    function uDK(q, K) {
        var _, z, Y;
        if (q === "") q = null;
        if (!EQ8.isValidQName(K)) wO.InvalidCharacterError();
        if (_ = null, z = K, Y = K.indexOf(":"), Y >= 0) _ = K.substring(0, Y), z = K.substring(Y + 1);
        if (_ !== null && q === null) wO.NamespaceError();
        if (_ === "xml" && q !== cb6.XML) wO.NamespaceError();
        if ((_ === "xmlns" || K === "xmlns") && q !== cb6.XMLNS) wO.NamespaceError();
        if (q === cb6.XMLNS && !(_ === "xmlns" || K === "xmlns")) wO.NamespaceError();
        return {
            namespace: q,
            prefix: _,
            localName: z
        }
    }
    x58.prototype = Object.create(BDK.prototype, {
        _setMutationHandler: {
            value: function(q) {
                this.mutationHandler = q
            }
        },
        _dispatchRendererEvent: {
            value: function(q, K, _) {
                var z = this._nodes[q];
                if (!z) return;
                z._dispatchEvent(new I58(K, _), !0)
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
            set: wO.nyi
        },
        compatMode: {
            get: function() {
                return this._quirks ? "BackCompat" : "CSS1Compat"
            }
        },
        createTextNode: {
            value: function(q) {
                return new bOY(this, String(q))
            }
        },
        createComment: {
            value: function(q) {
                return new IOY(this, q)
            }
        },
        createDocumentFragment: {
            value: function() {
                return new xOY(this)
            }
        },
        createProcessingInstruction: {
            value: function(q, K) {
                if (!EQ8.isValidName(q) || K.indexOf("?>") !== -1) wO.InvalidCharacterError();
                return new uOY(this, q, K)
            }
        },
        createAttribute: {
            value: function(q) {
                if (q = String(q), !EQ8.isValidName(q)) wO.InvalidCharacterError();
                if (this.isHTML) q = wO.toASCIILowerCase(q);
                return new o96._Attr(null, q, null, null, "")
            }
        },
        createAttributeNS: {
            value: function(q, K) {
                q = q === null || q === void 0 || q === "" ? null : String(q), K = String(K);
                var _ = uDK(q, K);
                return new o96._Attr(null, _.localName, _.prefix, _.namespace, "")
            }
        },
        createElement: {
            value: function(q) {
                if (q = String(q), !EQ8.isValidName(q)) wO.InvalidCharacterError();
                if (this.isHTML) {
                    if (/[A-Z]/.test(q)) q = wO.toASCIILowerCase(q);
                    return $57.createElement(this, q, null)
                } else if (this.contentType === "application/xhtml+xml") return $57.createElement(this, q, null);
                else return new o96(this, q, null, null)
            },
            writable: j57
        },
        createElementNS: {
            value: function(q, K) {
                q = q === null || q === void 0 || q === "" ? null : String(q), K = String(K);
                var _ = uDK(q, K);
                return this._createElementNS(_.localName, _.namespace, _.prefix)
            },
            writable: j57
        },
        _createElementNS: {
            value: function(q, K, _) {
                if (K === cb6.HTML) return $57.createElement(this, q, _);
                else if (K === cb6.SVG) return gOY.createElement(this, q, _);
                return new o96(this, q, K, _)
            }
        },
        createEvent: {
            value: function(K) {
                K = K.toLowerCase();
                var _ = QOY[K] || K,
                    z = FOY[UOY[_]];
                if (z) {
                    var Y = new z;
                    return Y._initialized = !1, Y
                } else wO.NotSupportedError()
            }
        },
        createTreeWalker: {
            value: function(q, K, _) {
                if (!q) throw TypeError("root argument is required");
                if (!(q instanceof yT)) throw TypeError("root not a node");
                return K = K === void 0 ? bDK.SHOW_ALL : +K, _ = _ === void 0 ? null : _, new BOY(q, K, _)
            }
        },
        createNodeIterator: {
            value: function(q, K, _) {
                if (!q) throw TypeError("root argument is required");
                if (!(q instanceof yT)) throw TypeError("root not a node");
                return K = K === void 0 ? bDK.SHOW_ALL : +K, _ = _ === void 0 ? null : _, new pOY(q, K, _)
            }
        },
        _attachNodeIterator: {
            value: function(q) {
                if (!this._nodeIterators) this._nodeIterators = [];
                this._nodeIterators.push(q)
            }
        },
        _detachNodeIterator: {
            value: function(q) {
                var K = this._nodeIterators.indexOf(q);
                this._nodeIterators.splice(K, 1)
            }
        },
        _preremoveNodeIterators: {
            value: function(q) {
                if (this._nodeIterators) this._nodeIterators.forEach(function(K) {
                    K._preremove(q)
                })
            }
        },
        _updateDocTypeElement: {
            value: function() {
                this.doctype = this.documentElement = null;
                for (var K = this.firstChild; K !== null; K = K.nextSibling)
                    if (K.nodeType === yT.DOCUMENT_TYPE_NODE) this.doctype = K;
                    else if (K.nodeType === yT.ELEMENT_NODE) this.documentElement = K
            }
        },
        insertBefore: {
            value: function(K, _) {
                return yT.prototype.insertBefore.call(this, K, _), this._updateDocTypeElement(), K
            }
        },
        replaceChild: {
            value: function(K, _) {
                return yT.prototype.replaceChild.call(this, K, _), this._updateDocTypeElement(), _
            }
        },
        removeChild: {
            value: function(K) {
                return yT.prototype.removeChild.call(this, K), this._updateDocTypeElement(), K
            }
        },
        getElementById: {
            value: function(q) {
                var K = this.byId[q];
                if (!K) return null;
                if (K instanceof Je) return K.getFirst();
                return K
            }
        },
        _hasMultipleElementsWithId: {
            value: function(q) {
                return this.byId[q] instanceof Je
            }
        },
        getElementsByName: {
            value: o96.prototype.getElementsByName
        },
        getElementsByTagName: {
            value: o96.prototype.getElementsByTagName
        },
        getElementsByTagNameNS: {
            value: o96.prototype.getElementsByTagNameNS
        },
        getElementsByClassName: {
            value: o96.prototype.getElementsByClassName
        },
        adoptNode: {
            value: function(K) {
                if (K.nodeType === yT.DOCUMENT_NODE) wO.NotSupportedError();
                if (K.nodeType === yT.ATTRIBUTE_NODE) return K;
                if (K.parentNode) K.parentNode.removeChild(K);
                if (K.ownerDocument !== this) gDK(K, this);
                return K
            }
        },
        importNode: {
            value: function(K, _) {
                return this.adoptNode(K.cloneNode(_))
            },
            writable: j57
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
            get: wO.nyi,
            set: wO.nyi
        },
        referrer: {
            get: wO.nyi
        },
        cookie: {
            get: wO.nyi,
            set: wO.nyi
        },
        lastModified: {
            get: wO.nyi
        },
        location: {
            get: function() {
                return this.defaultView ? this.defaultView.location : null
            },
            set: wO.nyi
        },
        _titleElement: {
            get: function() {
                return this.getElementsByTagName("title").item(0) || null
            }
        },
        title: {
            get: function() {
                var q = this._titleElement,
                    K = q ? q.textContent : "";
                return K.replace(/[ \t\n\r\f]+/g, " ").replace(/(^ )|( $)/g, "")
            },
            set: function(q) {
                var K = this._titleElement,
                    _ = this.head;
                if (!K && !_) return;
                if (!K) K = this.createElement("title"), _.appendChild(K);
                K.textContent = q
            }
        },
        dir: db6(function() {
            var q = this.documentElement;
            if (q && q.tagName === "HTML") return q
        }, "dir", ""),
        fgColor: db6(function() {
            return this.body
        }, "text", ""),
        linkColor: db6(function() {
            return this.body
        }, "link", ""),
        vlinkColor: db6(function() {
            return this.body
        }, "vLink", ""),
        alinkColor: db6(function() {
            return this.body
        }, "aLink", ""),
        bgColor: db6(function() {
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
                return mDK(this.documentElement, "body")
            },
            set: wO.nyi
        },
        head: {
            get: function() {
                return mDK(this.documentElement, "head")
            }
        },
        images: {
            get: wO.nyi
        },
        embeds: {
            get: wO.nyi
        },
        plugins: {
            get: wO.nyi
        },
        links: {
            get: wO.nyi
        },
        forms: {
            get: wO.nyi
        },
        scripts: {
            get: wO.nyi
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
            set: wO.nyi
        },
        outerHTML: {
            get: function() {
                return this.serialize()
            },
            set: wO.nyi
        },
        write: {
            value: function(q) {
                if (!this.isHTML) wO.InvalidStateError();
                if (!this._parser) return;
                if (!this._parser);
                var K = arguments.join("");
                this._parser.parse(K)
            }
        },
        writeln: {
            value: function(K) {
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
                if (this.readyState = "interactive", this._dispatchEvent(new I58("readystatechange"), !0), this._dispatchEvent(new I58("DOMContentLoaded"), !0), this.readyState = "complete", this._dispatchEvent(new I58("readystatechange"), !0), this.defaultView) this.defaultView._dispatchEvent(new I58("load"), !0)
            }
        },
        clone: {
            value: function() {
                var K = new x58(this.isHTML, this._address);
                return K._quirks = this._quirks, K._contentType = this._contentType, K
            }
        },
        cloneNode: {
            value: function(K) {
                var _ = yT.prototype.cloneNode.call(this, !1);
                if (K)
                    for (var z = this.firstChild; z !== null; z = z.nextSibling) _._appendChild(_.importNode(z, !0));
                return _._updateDocTypeElement(), _
            }
        },
        isEqual: {
            value: function(K) {
                return !0
            }
        },
        mutateValue: {
            value: function(q) {
                if (this.mutationHandler) this.mutationHandler({
                    type: Qb6.VALUE,
                    target: q,
                    data: q.data
                })
            }
        },
        mutateAttr: {
            value: function(q, K) {
                if (this.mutationHandler) this.mutationHandler({
                    type: Qb6.ATTR,
                    target: q.ownerElement,
                    attr: q
                })
            }
        },
        mutateRemoveAttr: {
            value: function(q) {
                if (this.mutationHandler) this.mutationHandler({
                    type: Qb6.REMOVE_ATTR,
                    target: q.ownerElement,
                    attr: q
                })
            }
        },
        mutateRemove: {
            value: function(q) {
                if (this.mutationHandler) this.mutationHandler({
                    type: Qb6.REMOVE,
                    target: q.parentNode,
                    node: q
                });
                FDK(q)
            }
        },
        mutateInsert: {
            value: function(q) {
                if (pDK(q), this.mutationHandler) this.mutationHandler({
                    type: Qb6.INSERT,
                    target: q.parentNode,
                    node: q
                })
            }
        },
        mutateMove: {
            value: function(q) {
                if (this.mutationHandler) this.mutationHandler({
                    type: Qb6.MOVE,
                    target: q
                })
            }
        },
        addId: {
            value: function(K, _) {
                var z = this.byId[K];
                if (!z) this.byId[K] = _;
                else {
                    if (!(z instanceof Je)) z = new Je(z), this.byId[K] = z;
                    z.add(_)
                }
            }
        },
        delId: {
            value: function(K, _) {
                var z = this.byId[K];
                if (wO.assert(z), z instanceof Je) {
                    if (z.del(_), z.length === 1) this.byId[K] = z.downgrade()
                } else this.byId[K] = void 0
            }
        },
        _resolve: {
            value: function(q) {
                return new IDK(this._documentBaseURL).resolve(q)
            }
        },
        _documentBaseURL: {
            get: function() {
                var q = this._address;
                if (q === "about:blank") q = "/";
                var K = this.querySelector("base[href]");
                if (K) return new IDK(q).resolve(K.getAttribute("href"));
                return q
            }
        },
        _templateDoc: {
            get: function() {
                if (!this._templateDocCache) {
                    var q = new x58(this.isHTML, this._address);
                    this._templateDocCache = q._templateDocCache = q
                }
                return this._templateDocCache
            }
        },
        querySelector: {
            value: function(q) {
                return xDK(q, this)[0]
            }
        },
        querySelectorAll: {
            value: function(q) {
                var K = xDK(q, this);
                return K.item ? K : new COY(K)
            }
        }
    });
    var dOY = ["abort", "canplay", "canplaythrough", "change", "click", "contextmenu", "cuechange", "dblclick", "drag", "dragend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "durationchange", "emptied", "ended", "input", "invalid", "keydown", "keypress", "keyup", "loadeddata", "loadedmetadata", "loadstart", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "mousewheel", "pause", "play", "playing", "progress", "ratechange", "readystatechange", "reset", "seeked", "seeking", "select", "show", "stalled", "submit", "suspend", "timeupdate", "volumechange", "waiting", "blur", "error", "focus", "load", "scroll"];
    dOY.forEach(function(q) {
        Object.defineProperty(x58.prototype, "on" + q, {
            get: function() {
                return this._getEventHandler(q)
            },
            set: function(K) {
                this._setEventHandler(q, K)
            }
        })
    });

    function mDK(q, K) {
        if (q && q.isHTML) {
            for (var _ = q.firstChild; _ !== null; _ = _.nextSibling)
                if (_.nodeType === yT.ELEMENT_NODE && _.localName === K && _.namespaceURI === cb6.HTML) return _
        }
        return null
    }

    function cOY(q) {
        if (q._nid = q.ownerDocument._nextnid++, q.ownerDocument._nodes[q._nid] = q, q.nodeType === yT.ELEMENT_NODE) {
            var K = q.getAttribute("id");
            if (K) q.ownerDocument.addId(K, q);
            if (q._roothook) q._roothook()
        }
    }

    function lOY(q) {
        if (q.nodeType === yT.ELEMENT_NODE) {
            var K = q.getAttribute("id");
            if (K) q.ownerDocument.delId(K, q)
        }
        q.ownerDocument._nodes[q._nid] = void 0, q._nid = void 0
    }

    function pDK(q) {
        if (cOY(q), q.nodeType === yT.ELEMENT_NODE)
            for (var K = q.firstChild; K !== null; K = K.nextSibling) pDK(K)
    }

    function FDK(q) {
        lOY(q);
        for (var K = q.firstChild; K !== null; K = K.nextSibling) FDK(K)
    }

    function gDK(q, K) {
        if (q.ownerDocument = K, q._lastModTime = void 0, Object.prototype.hasOwnProperty.call(q, "_tagName")) q._tagName = void 0;
        for (var _ = q.firstChild; _ !== null; _ = _.nextSibling) gDK(_, K)
    }

    function Je(q) {
        this.nodes = Object.create(null), this.nodes[q._nid] = q, this.length = 1, this.firstNode = void 0
    }
    Je.prototype.add = function(q) {
        if (!this.nodes[q._nid]) this.nodes[q._nid] = q, this.length++, this.firstNode = void 0
    };
    Je.prototype.del = function(q) {
        if (this.nodes[q._nid]) delete this.nodes[q._nid], this.length--, this.firstNode = void 0
    };
    Je.prototype.getFirst = function() {
        if (!this.firstNode) {
            var q;
            for (q in this.nodes)
                if (this.firstNode === void 0 || this.firstNode.compareDocumentPosition(this.nodes[q]) & yT.DOCUMENT_POSITION_PRECEDING) this.firstNode = this.nodes[q]
        }
        return this.firstNode
    };
    Je.prototype.downgrade = function() {
        if (this.length === 1) {
            var q;
            for (q in this.nodes) return this.nodes[q]
        }
        return this
    }
})
// @from(Ln 375277, Col 4)
hQ8 = p((Ul2, dDK) => {
    dDK.exports = LQ8;
    var nOY = HG(),
        QDK = pK7(),
        iOY = DQ8();

    function LQ8(q, K, _, z) {
        QDK.call(this), this.nodeType = nOY.DOCUMENT_TYPE_NODE, this.ownerDocument = q || null, this.name = K, this.publicId = _ || "", this.systemId = z || ""
    }
    LQ8.prototype = Object.create(QDK.prototype, {
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
                return new LQ8(this.ownerDocument, this.name, this.publicId, this.systemId)
            }
        },
        isEqual: {
            value: function(K) {
                return this.name === K.name && this.publicId === K.publicId && this.systemId === K.systemId
            }
        }
    });
    Object.defineProperties(LQ8.prototype, iOY)
})