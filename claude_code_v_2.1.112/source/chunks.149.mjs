
// @from(Ln 382533, Col 4)
u58 = p((dl2, DZK) => {
    DZK.exports = WZK;
    var MZK = yQ8(),
        PZK = hQ8(),
        WwY = uQ8(),
        mQ8 = CX(),
        DwY = JQ8();

    function WZK(q) {
        this.contextObject = q
    }
    var ZwY = {
        xml: {
            "": !0,
            "1.0": !0,
            "2.0": !0
        },
        core: {
            "": !0,
            "2.0": !0
        },
        html: {
            "": !0,
            "1.0": !0,
            "2.0": !0
        },
        xhtml: {
            "": !0,
            "1.0": !0,
            "2.0": !0
        }
    };
    WZK.prototype = {
        hasFeature: function(K, _) {
            var z = ZwY[(K || "").toLowerCase()];
            return z && z[_ || ""] || !1
        },
        createDocumentType: function(K, _, z) {
            if (!DwY.isValidQName(K)) mQ8.InvalidCharacterError();
            return new PZK(this.contextObject, K, _, z)
        },
        createDocument: function(K, _, z) {
            var Y = new MZK(!1, null),
                A;
            if (_) A = Y.createElementNS(K, _);
            else A = null;
            if (z) Y.appendChild(z);
            if (A) Y.appendChild(A);
            if (K === mQ8.NAMESPACE.HTML) Y._contentType = "application/xhtml+xml";
            else if (K === mQ8.NAMESPACE.SVG) Y._contentType = "image/svg+xml";
            else Y._contentType = "application/xml";
            return Y
        },
        createHTMLDocument: function(K) {
            var _ = new MZK(!0, null);
            _.appendChild(new PZK(_, "html"));
            var z = _.createElement("html");
            _.appendChild(z);
            var Y = _.createElement("head");
            if (z.appendChild(Y), K !== void 0) {
                var A = _.createElement("title");
                Y.appendChild(A), A.appendChild(_.createTextNode(K))
            }
            return z.appendChild(_.createElement("body")), _.modclock = 1, _
        },
        mozSetOutputMutationHandler: function(q, K) {
            q.mutationHandler = K
        },
        mozGetInputMutationHandler: function(q) {
            mQ8.nyi()
        },
        mozHTMLParser: WwY
    }
})
// @from(Ln 382607, Col 4)
fZK = p((cl2, ZZK) => {
    var fwY = TQ8(),
        GwY = _57();
    ZZK.exports = D57;

    function D57(q, K) {
        this._window = q, this._href = K
    }
    D57.prototype = Object.create(GwY.prototype, {
        constructor: {
            value: D57
        },
        href: {
            get: function() {
                return this._href
            },
            set: function(q) {
                this.assign(q)
            }
        },
        assign: {
            value: function(q) {
                var K = new fwY(this._href),
                    _ = K.resolve(q);
                this._href = _
            }
        },
        replace: {
            value: function(q) {
                this.assign(q)
            }
        },
        reload: {
            value: function() {
                this.assign(this.href)
            }
        },
        toString: {
            value: function() {
                return this.href
            }
        }
    })
})
// @from(Ln 382651, Col 4)
vZK = p((ll2, GZK) => {
    var vwY = Object.create(null, {
        appCodeName: {
            value: "Mozilla"
        },
        appName: {
            value: "Netscape"
        },
        appVersion: {
            value: "4.0"
        },
        platform: {
            value: ""
        },
        product: {
            value: "Gecko"
        },
        productSub: {
            value: "20100101"
        },
        userAgent: {
            value: ""
        },
        vendor: {
            value: ""
        },
        vendorSub: {
            value: ""
        },
        taintEnabled: {
            value: function() {
                return !1
            }
        }
    });
    GZK.exports = vwY
})
// @from(Ln 382688, Col 4)
VZK = p((nl2, TZK) => {
    var TwY = {
        setTimeout,
        clearTimeout,
        setInterval,
        clearInterval
    };
    TZK.exports = TwY
})
// @from(Ln 382697, Col 4)
f57 = p((m58, kZK) => {
    var Z57 = CX();
    m58 = kZK.exports = {
        CSSStyleDeclaration: VQ8(),
        CharacterData: y58(),
        Comment: QK7(),
        DOMException: OQ8(),
        DOMImplementation: u58(),
        DOMTokenList: EK7(),
        Document: yQ8(),
        DocumentFragment: cK7(),
        DocumentType: hQ8(),
        Element: Fb6(),
        HTMLParser: uQ8(),
        NamedNodeMap: CK7(),
        Node: HG(),
        NodeList: vM6(),
        NodeFilter: S58(),
        ProcessingInstruction: nK7(),
        Text: gK7(),
        Window: G57()
    };
    Z57.merge(m58, K57());
    Z57.merge(m58, NQ8().elements);
    Z57.merge(m58, w57().elements)
})
// @from(Ln 382723, Col 4)
G57 = p((il2, NZK) => {
    var VwY = u58(),
        kwY = jK7(),
        NwY = fZK(),
        B58 = CX();
    NZK.exports = BQ8;

    function BQ8(q) {
        this.document = q || new VwY(null).createHTMLDocument(""), this.document._scripting_enabled = !0, this.document.defaultView = this, this.location = new NwY(this, this.document._address || "about:blank")
    }
    BQ8.prototype = Object.create(kwY.prototype, {
        console: {
            value: console
        },
        history: {
            value: {
                back: B58.nyi,
                forward: B58.nyi,
                go: B58.nyi
            }
        },
        navigator: {
            value: vZK()
        },
        window: {
            get: function() {
                return this
            }
        },
        self: {
            get: function() {
                return this
            }
        },
        frames: {
            get: function() {
                return this
            }
        },
        parent: {
            get: function() {
                return this
            }
        },
        top: {
            get: function() {
                return this
            }
        },
        length: {
            value: 0
        },
        frameElement: {
            value: null
        },
        opener: {
            value: null
        },
        onload: {
            get: function() {
                return this._getEventHandler("load")
            },
            set: function(q) {
                this._setEventHandler("load", q)
            }
        },
        getComputedStyle: {
            value: function(K) {
                return K.style
            }
        }
    });
    B58.expose(VZK(), BQ8);
    B58.expose(f57(), BQ8)
})
// @from(Ln 382798, Col 4)
RZK = p((EwY) => {
    var EZK = u58(),
        yZK = uQ8(),
        rl2 = G57(),
        LZK = f57();
    EwY.createDOMImplementation = function() {
        return new EZK(null)
    };
    EwY.createDocument = function(q, K) {
        if (q || K) {
            var _ = new yZK;
            return _.parse(q || "", !0), _.document()
        }
        return new EZK(null).createHTMLDocument("")
    };
    EwY.createIncrementalHTMLParser = function() {
        var q = new yZK;
        return {
            write: function(K) {
                if (K.length > 0) q.parse(K, !1, function() {
                    return !0
                })
            },
            end: function(K) {
                q.parse(K || "", !0, function() {
                    return !0
                })
            },
            process: function(K) {
                return q.parse("", !1, K)
            },
            document: function() {
                return q.document()
            }
        }
    };
    EwY.createWindow = function(q, K) {
        var _ = EwY.createDocument(q);
        if (K !== void 0) _._address = K;
        return new LZK.Window(_)
    };
    EwY.impl = LZK
})
// @from(Ln 382841, Col 4)
UZK = p((al2, gZK) => {
    function SwY(q) {
        for (var K = 1; K < arguments.length; K++) {
            var _ = arguments[K];
            for (var z in _)
                if (_.hasOwnProperty(z)) q[z] = _[z]
        }
        return q
    }

    function k57(q, K) {
        return Array(K + 1).join(q)
    }

    function CwY(q) {
        return q.replace(/^\n*/, "")
    }

    function bwY(q) {
        var K = q.length;
        while (K > 0 && q[K - 1] === `
`) K--;
        return q.substring(0, K)
    }
    var IwY = ["ADDRESS", "ARTICLE", "ASIDE", "AUDIO", "BLOCKQUOTE", "BODY", "CANVAS", "CENTER", "DD", "DIR", "DIV", "DL", "DT", "FIELDSET", "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "FRAMESET", "H1", "H2", "H3", "H4", "H5", "H6", "HEADER", "HGROUP", "HR", "HTML", "ISINDEX", "LI", "MAIN", "MENU", "NAV", "NOFRAMES", "NOSCRIPT", "OL", "OUTPUT", "P", "PRE", "SECTION", "TABLE", "TBODY", "TD", "TFOOT", "TH", "THEAD", "TR", "UL"];

    function N57(q) {
        return E57(q, IwY)
    }
    var bZK = ["AREA", "BASE", "BR", "COL", "COMMAND", "EMBED", "HR", "IMG", "INPUT", "KEYGEN", "LINK", "META", "PARAM", "SOURCE", "TRACK", "WBR"];

    function IZK(q) {
        return E57(q, bZK)
    }

    function xwY(q) {
        return uZK(q, bZK)
    }
    var xZK = ["A", "TABLE", "THEAD", "TBODY", "TFOOT", "TH", "TD", "IFRAME", "SCRIPT", "AUDIO", "VIDEO"];

    function uwY(q) {
        return E57(q, xZK)
    }

    function mwY(q) {
        return uZK(q, xZK)
    }

    function E57(q, K) {
        return K.indexOf(q.nodeName) >= 0
    }

    function uZK(q, K) {
        return q.getElementsByTagName && K.some(function(_) {
            return q.getElementsByTagName(_).length
        })
    }
    var RT = {};
    RT.paragraph = {
        filter: "p",
        replacement: function(q) {
            return `

` + q + `

`
        }
    };
    RT.lineBreak = {
        filter: "br",
        replacement: function(q, K, _) {
            return _.br + `
`
        }
    };
    RT.heading = {
        filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
        replacement: function(q, K, _) {
            var z = Number(K.nodeName.charAt(1));
            if (_.headingStyle === "setext" && z < 3) {
                var Y = k57(z === 1 ? "=" : "-", q.length);
                return `

` + q + `
` + Y + `

`
            } else return `

` + k57("#", z) + " " + q + `

`
        }
    };
    RT.blockquote = {
        filter: "blockquote",
        replacement: function(q) {
            return q = q.replace(/^\n+|\n+$/g, ""), q = q.replace(/^/gm, "> "), `

` + q + `

`
        }
    };
    RT.list = {
        filter: ["ul", "ol"],
        replacement: function(q, K) {
            var _ = K.parentNode;
            if (_.nodeName === "LI" && _.lastElementChild === K) return `
` + q;
            else return `

` + q + `

`
        }
    };
    RT.listItem = {
        filter: "li",
        replacement: function(q, K, _) {
            q = q.replace(/^\n+/, "").replace(/\n+$/, `
`).replace(/\n/gm, `
    `);
            var z = _.bulletListMarker + "   ",
                Y = K.parentNode;
            if (Y.nodeName === "OL") {
                var A = Y.getAttribute("start"),
                    O = Array.prototype.indexOf.call(Y.children, K);
                z = (A ? Number(A) + O : O + 1) + ".  "
            }
            return z + q + (K.nextSibling && !/\n$/.test(q) ? `
` : "")
        }
    };
    RT.indentedCodeBlock = {
        filter: function(q, K) {
            return K.codeBlockStyle === "indented" && q.nodeName === "PRE" && q.firstChild && q.firstChild.nodeName === "CODE"
        },
        replacement: function(q, K, _) {
            return `

    ` + K.firstChild.textContent.replace(/\n/g, `
    `) + `

`
        }
    };
    RT.fencedCodeBlock = {
        filter: function(q, K) {
            return K.codeBlockStyle === "fenced" && q.nodeName === "PRE" && q.firstChild && q.firstChild.nodeName === "CODE"
        },
        replacement: function(q, K, _) {
            var z = K.firstChild.getAttribute("class") || "",
                Y = (z.match(/language-(\S+)/) || [null, ""])[1],
                A = K.firstChild.textContent,
                O = _.fence.charAt(0),
                w = 3,
                $ = new RegExp("^" + O + "{3,}", "gm"),
                j;
            while (j = $.exec(A))
                if (j[0].length >= w) w = j[0].length + 1;
            var H = k57(O, w);
            return `

` + H + Y + `
` + A.replace(/\n$/, "") + `
` + H + `

`
        }
    };
    RT.horizontalRule = {
        filter: "hr",
        replacement: function(q, K, _) {
            return `

` + _.hr + `

`
        }
    };
    RT.inlineLink = {
        filter: function(q, K) {
            return K.linkStyle === "inlined" && q.nodeName === "A" && q.getAttribute("href")
        },
        replacement: function(q, K) {
            var _ = K.getAttribute("href");
            if (_) _ = _.replace(/([()])/g, "\\$1");
            var z = pQ8(K.getAttribute("title"));
            if (z) z = ' "' + z.replace(/"/g, "\\\"") + '"';
            return "[" + q + "](" + _ + z + ")"
        }
    };
    RT.referenceLink = {
        filter: function(q, K) {
            return K.linkStyle === "referenced" && q.nodeName === "A" && q.getAttribute("href")
        },
        replacement: function(q, K, _) {
            var z = K.getAttribute("href"),
                Y = pQ8(K.getAttribute("title"));
            if (Y) Y = ' "' + Y + '"';
            var A, O;
            switch (_.linkReferenceStyle) {
                case "collapsed":
                    A = "[" + q + "][]", O = "[" + q + "]: " + z + Y;
                    break;
                case "shortcut":
                    A = "[" + q + "]", O = "[" + q + "]: " + z + Y;
                    break;
                default:
                    var w = this.references.length + 1;
                    A = "[" + q + "][" + w + "]", O = "[" + w + "]: " + z + Y
            }
            return this.references.push(O), A
        },
        references: [],
        append: function(q) {
            var K = "";
            if (this.references.length) K = `

` + this.references.join(`
`) + `

`, this.references = [];
            return K
        }
    };
    RT.emphasis = {
        filter: ["em", "i"],
        replacement: function(q, K, _) {
            if (!q.trim()) return "";
            return _.emDelimiter + q + _.emDelimiter
        }
    };
    RT.strong = {
        filter: ["strong", "b"],
        replacement: function(q, K, _) {
            if (!q.trim()) return "";
            return _.strongDelimiter + q + _.strongDelimiter
        }
    };
    RT.code = {
        filter: function(q) {
            var K = q.previousSibling || q.nextSibling,
                _ = q.parentNode.nodeName === "PRE" && !K;
            return q.nodeName === "CODE" && !_
        },
        replacement: function(q) {
            if (!q) return "";
            q = q.replace(/\r?\n|\r/g, " ");
            var K = /^`|^ .*?[^ ].* $|`$/.test(q) ? " " : "",
                _ = "`",
                z = q.match(/`+/gm) || [];
            while (z.indexOf(_) !== -1) _ = _ + "`";
            return _ + K + q + K + _
        }
    };
    RT.image = {
        filter: "img",
        replacement: function(q, K) {
            var _ = pQ8(K.getAttribute("alt")),
                z = K.getAttribute("src") || "",
                Y = pQ8(K.getAttribute("title")),
                A = Y ? ' "' + Y + '"' : "";
            return z ? "![" + _ + "](" + z + A + ")" : ""
        }
    };

    function pQ8(q) {
        return q ? q.replace(/(\n+\s*)+/g, `
`) : ""
    }

    function mZK(q) {
        this.options = q, this._keep = [], this._remove = [], this.blankRule = {
            replacement: q.blankReplacement
        }, this.keepReplacement = q.keepReplacement, this.defaultRule = {
            replacement: q.defaultReplacement
        }, this.array = [];
        for (var K in q.rules) this.array.push(q.rules[K])
    }
    mZK.prototype = {
        add: function(q, K) {
            this.array.unshift(K)
        },
        keep: function(q) {
            this._keep.unshift({
                filter: q,
                replacement: this.keepReplacement
            })
        },
        remove: function(q) {
            this._remove.unshift({
                filter: q,
                replacement: function() {
                    return ""
                }
            })
        },
        forNode: function(q) {
            if (q.isBlank) return this.blankRule;
            var K;
            if (K = v57(this.array, q, this.options)) return K;
            if (K = v57(this._keep, q, this.options)) return K;
            if (K = v57(this._remove, q, this.options)) return K;
            return this.defaultRule
        },
        forEach: function(q) {
            for (var K = 0; K < this.array.length; K++) q(this.array[K], K)
        }
    };

    function v57(q, K, _) {
        for (var z = 0; z < q.length; z++) {
            var Y = q[z];
            if (BwY(Y, K, _)) return Y
        }
        return
    }

    function BwY(q, K, _) {
        var z = q.filter;
        if (typeof z === "string") {
            if (z === K.nodeName.toLowerCase()) return !0
        } else if (Array.isArray(z)) {
            if (z.indexOf(K.nodeName.toLowerCase()) > -1) return !0
        } else if (typeof z === "function") {
            if (z.call(q, K, _)) return !0
        } else throw TypeError("`filter` needs to be a string, array, or function")
    }

    function pwY(q) {
        var {
            element: K,
            isBlock: _,
            isVoid: z
        } = q, Y = q.isPre || function(J) {
            return J.nodeName === "PRE"
        };
        if (!K.firstChild || Y(K)) return;
        var A = null,
            O = !1,
            w = null,
            $ = SZK(w, K, Y);
        while ($ !== K) {
            if ($.nodeType === 3 || $.nodeType === 4) {
                var j = $.data.replace(/[ \r\n\t]+/g, " ");
                if ((!A || / $/.test(A.data)) && !O && j[0] === " ") j = j.substr(1);
                if (!j) {
                    $ = T57($);
                    continue
                }
                $.data = j, A = $
            } else if ($.nodeType === 1) {
                if (_($) || $.nodeName === "BR") {
                    if (A) A.data = A.data.replace(/ $/, "");
                    A = null, O = !1
                } else if (z($) || Y($)) A = null, O = !0;
                else if (A) O = !1
            } else {
                $ = T57($);
                continue
            }
            var H = SZK(w, $, Y);
            w = $, $ = H
        }
        if (A) {
            if (A.data = A.data.replace(/ $/, ""), !A.data) T57(A)
        }
    }

    function T57(q) {
        var K = q.nextSibling || q.parentNode;
        return q.parentNode.removeChild(q), K
    }

    function SZK(q, K, _) {
        if (q && q.parentNode === K || _(K)) return K.nextSibling || K.parentNode;
        return K.firstChild || K.nextSibling || K.parentNode
    }
    var BZK = typeof window < "u" ? window : {};

    function FwY() {
        var q = BZK.DOMParser,
            K = !1;
        try {
            if (new q().parseFromString("", "text/html")) K = !0
        } catch (_) {}
        return K
    }

    function gwY() {
        var q = function() {};
        {
            var K = RZK();
            q.prototype.parseFromString = function(_) {
                return K.createDocument(_)
            }
        }
        return q
    }
    var UwY = FwY() ? BZK.DOMParser : gwY();

    function QwY(q, K) {
        var _;
        if (typeof q === "string") {
            var z = dwY().parseFromString('<x-turndown id="turndown-root">' + q + "</x-turndown>", "text/html");
            _ = z.getElementById("turndown-root")
        } else _ = q.cloneNode(!0);
        return pwY({
            element: _,
            isBlock: N57,
            isVoid: IZK,
            isPre: K.preformattedCode ? cwY : null
        }), _
    }
    var V57;

    function dwY() {
        return V57 = V57 || new UwY, V57
    }

    function cwY(q) {
        return q.nodeName === "PRE" || q.nodeName === "CODE"
    }

    function lwY(q, K) {
        return q.isBlock = N57(q), q.isCode = q.nodeName === "CODE" || q.parentNode.isCode, q.isBlank = nwY(q), q.flankingWhitespace = iwY(q, K), q
    }

    function nwY(q) {
        return !IZK(q) && !uwY(q) && /^\s*$/i.test(q.textContent) && !xwY(q) && !mwY(q)
    }

    function iwY(q, K) {
        if (q.isBlock || K.preformattedCode && q.isCode) return {
            leading: "",
            trailing: ""
        };
        var _ = rwY(q.textContent);
        if (_.leadingAscii && CZK("left", q, K)) _.leading = _.leadingNonAscii;
        if (_.trailingAscii && CZK("right", q, K)) _.trailing = _.trailingNonAscii;
        return {
            leading: _.leading,
            trailing: _.trailing
        }
    }

    function rwY(q) {
        var K = q.match(/^(([ \t\r\n]*)(\s*))(?:(?=\S)[\s\S]*\S)?((\s*?)([ \t\r\n]*))$/);
        return {
            leading: K[1],
            leadingAscii: K[2],
            leadingNonAscii: K[3],
            trailing: K[4],
            trailingNonAscii: K[5],
            trailingAscii: K[6]
        }
    }

    function CZK(q, K, _) {
        var z, Y, A;
        if (q === "left") z = K.previousSibling, Y = / $/;
        else z = K.nextSibling, Y = /^ /;
        if (z) {
            if (z.nodeType === 3) A = Y.test(z.nodeValue);
            else if (_.preformattedCode && z.nodeName === "CODE") A = !1;
            else if (z.nodeType === 1 && !N57(z)) A = Y.test(z.textContent)
        }
        return A
    }
    var owY = Array.prototype.reduce,
        awY = [
            [/\\/g, "\\\\"],
            [/\*/g, "\\*"],
            [/^-/g, "\\-"],
            [/^\+ /g, "\\+ "],
            [/^(=+)/g, "\\$1"],
            [/^(#{1,6}) /g, "\\$1 "],
            [/`/g, "\\`"],
            [/^~~~/g, "\\~~~"],
            [/\[/g, "\\["],
            [/\]/g, "\\]"],
            [/^>/g, "\\>"],
            [/_/g, "\\_"],
            [/^(\d+)\. /g, "$1\\. "]
        ];

    function FQ8(q) {
        if (!(this instanceof FQ8)) return new FQ8(q);
        var K = {
            rules: RT,
            headingStyle: "setext",
            hr: "* * *",
            bulletListMarker: "*",
            codeBlockStyle: "indented",
            fence: "```",
            emDelimiter: "_",
            strongDelimiter: "**",
            linkStyle: "inlined",
            linkReferenceStyle: "full",
            br: "  ",
            preformattedCode: !1,
            blankReplacement: function(_, z) {
                return z.isBlock ? `

` : ""
            },
            keepReplacement: function(_, z) {
                return z.isBlock ? `

` + z.outerHTML + `

` : z.outerHTML
            },
            defaultReplacement: function(_, z) {
                return z.isBlock ? `

` + _ + `

` : _
            }
        };
        this.options = SwY({}, K, q), this.rules = new mZK(this.options)
    }
    FQ8.prototype = {
        turndown: function(q) {
            if (!ewY(q)) throw TypeError(q + " is not a string, or an element/document/fragment node.");
            if (q === "") return "";
            var K = pZK.call(this, new QwY(q, this.options));
            return swY.call(this, K)
        },
        use: function(q) {
            if (Array.isArray(q))
                for (var K = 0; K < q.length; K++) this.use(q[K]);
            else if (typeof q === "function") q(this);
            else throw TypeError("plugin must be a Function or an Array of Functions");
            return this
        },
        addRule: function(q, K) {
            return this.rules.add(q, K), this
        },
        keep: function(q) {
            return this.rules.keep(q), this
        },
        remove: function(q) {
            return this.rules.remove(q), this
        },
        escape: function(q) {
            return awY.reduce(function(K, _) {
                return K.replace(_[0], _[1])
            }, q)
        }
    };

    function pZK(q) {
        var K = this;
        return owY.call(q.childNodes, function(_, z) {
            z = new lwY(z, K.options);
            var Y = "";
            if (z.nodeType === 3) Y = z.isCode ? z.nodeValue : K.escape(z.nodeValue);
            else if (z.nodeType === 1) Y = twY.call(K, z);
            return FZK(_, Y)
        }, "")
    }

    function swY(q) {
        var K = this;
        return this.rules.forEach(function(_) {
            if (typeof _.append === "function") q = FZK(q, _.append(K.options))
        }), q.replace(/^[\t\r\n]+/, "").replace(/[\t\r\n\s]+$/, "")
    }

    function twY(q) {
        var K = this.rules.forNode(q),
            _ = pZK.call(this, q),
            z = q.flankingWhitespace;
        if (z.leading || z.trailing) _ = _.trim();
        return z.leading + K.replacement(_, q, this.options) + z.trailing
    }

    function FZK(q, K) {
        var _ = bwY(q),
            z = CwY(K),
            Y = Math.max(q.length - _.length, K.length - z.length),
            A = `

`.substring(0, Y);
        return _ + A + z
    }

    function ewY(q) {
        return q != null && (typeof q === "string" || q.nodeType && (q.nodeType === 1 || q.nodeType === 9 || q.nodeType === 11))
    }
    gZK.exports = FQ8
})
// @from(Ln 383437, Col 4)
iZK = {}
// @from(Ln 383450, Col 0)
function _2Y() {
    h57.clear(), R57.clear()
}
// @from(Ln 383454, Col 0)
function Y2Y() {
    return z2Y ??= Promise.resolve().then(() => K6(UZK(), 1)).then((q) => {
        let _ = new q.default;
        return _.remove(["style", "script", "noscript", "iframe"]), _
    })
}
// @from(Ln 383461, Col 0)
function S57(q) {
    try {
        let K = new URL(q);
        return KQ8(K.hostname, K.pathname)
    } catch {
        return !1
    }
}
// @from(Ln 383470, Col 0)
function cZK(q) {
    if (q.length > A2Y) return !1;
    let K;
    try {
        K = new URL(q)
    } catch {
        return !1
    }
    if (K.username || K.password) return !1;
    if (K.hostname.split(".").length < 2) return !1;
    return !0
}
// @from(Ln 383482, Col 0)
async function lZK(q) {
    if (R57.has(q)) return {
        status: "allowed"
    };
    try {
        let K = await Z1.get(`https://api.anthropic.com/api/web/domain_info?domain=${encodeURIComponent(q)}`, {
            timeout: $2Y
        });
        if (K.status === 200) {
            if (K.data.can_fetch === !0) return R57.set(q, !0), {
                status: "allowed"
            };
            return {
                status: "blocked"
            }
        }
        return {
            status: "check_failed",
            error: Error(`Domain check returned status ${K.status}`)
        }
    } catch (K) {
        return j6(K), {
            status: "check_failed",
            error: K
        }
    }
}
// @from(Ln 383510, Col 0)
function nZK(q, K) {
    try {
        let _ = new URL(q),
            z = new URL(K);
        if (z.protocol !== _.protocol) return !1;
        if (z.port !== _.port) return !1;
        if (z.username || z.password) return !1;
        let Y = (w) => w.replace(/^www\./, ""),
            A = Y(_.hostname),
            O = Y(z.hostname);
        return A === O
    } catch (_) {
        return !1
    }
}
// @from(Ln 383525, Col 0)
async function C57(q, K, _, z = 0) {
    if (z > QZK) throw Error(`Too many redirects (exceeded ${QZK})`);
    try {
        return await Z1.get(q, {
            signal: K,
            timeout: w2Y,
            maxRedirects: 0,
            responseType: "arraybuffer",
            maxContentLength: O2Y,
            headers: {
                Accept: "text/markdown, text/html, */*",
                "User-Agent": dUq()
            }
        })
    } catch (Y) {
        if (Z1.isAxiosError(Y) && Y.response && [301, 302, 307, 308].includes(Y.response.status)) {
            let A = Y.response.headers.location;
            if (!A) throw Error("Redirect missing Location header");
            let O = new URL(A, q).toString();
            if (_(q, O)) return C57(O, K, _, z + 1);
            else return {
                type: "redirect",
                originalUrl: q,
                redirectUrl: O,
                statusCode: Y.response.status
            }
        }
        if (Z1.isAxiosError(Y) && Y.response?.status === 403 && Y.response.headers["x-proxy-error"] === "blocked-by-allowlist") {
            let A = new URL(q).hostname;
            throw new dZK(A)
        }
        throw Y
    }
}
// @from(Ln 383560, Col 0)
function j2Y(q) {
    return "type" in q && q.type === "redirect"
}
// @from(Ln 383563, Col 0)
async function b57(q, K) {
    if (!cZK(q)) throw Error("Invalid URL");
    let _ = h57.get(q);
    if (_) return {
        bytes: _.bytes,
        code: _.code,
        codeText: _.codeText,
        content: _.content,
        contentType: _.contentType,
        persistedPath: _.persistedPath,
        persistedSize: _.persistedSize
    };
    let z, Y = q;
    try {
        if (z = new URL(q), z.protocol === "http:") z.protocol = "https:", Y = z.toString();
        let W = z.hostname;
        if (!y7().skipWebFetchPreflight) switch ((await lZK(W)).status) {
            case "allowed":
                break;
            case "blocked":
                throw new y57(W);
            case "check_failed":
                throw new L57(W)
        }
    } catch (W) {
        if (W instanceof y57 || W instanceof L57) throw W;
        j6(W)
    }
    let A = await C57(Y, K.signal, nZK);
    if (j2Y(A)) return A;
    let O = Buffer.from(A.data);
    A.data = null;
    let w = A.headers["content-type"] ?? "",
        $, j;
    if (TWK(w)) {
        let W = `webfetch-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
            D = await Cb6(O, w, W);
        if (!("error" in D)) $ = D.filepath, j = D.size
    }
    let H = O.length,
        J = O.toString("utf-8"),
        X, M;
    if (w.includes("text/html")) X = (await Y2Y()).turndown(J), M = Buffer.byteLength(X);
    else X = J, M = H;
    let P = {
        bytes: H,
        code: A.status,
        codeText: A.statusText,
        content: X,
        contentType: w,
        persistedPath: $,
        persistedSize: j
    };
    return h57.set(q, P, {
        size: Math.max(1, M)
    }), P
}
// @from(Ln 383620, Col 0)
async function I57(q, K, _, z, Y) {
    let A = K.length > p58 ? K.slice(0, p58) + `

[Content truncated due to length...]` : K,
        O = cH4(A, q, Y),
        w = await ov({
            systemPrompt: sK([]),
            userPrompt: O,
            signal: _,
            options: {
                querySource: "web_fetch_apply",
                agents: [],
                isNonInteractiveSession: z,
                hasAppendSystemPrompt: !1,
                mcpTools: []
            }
        });
    if (_.aborted) throw new sz;
    let {
        content: $
    } = w.message;
    if ($.length > 0) {
        let j = $[0];
        if ("text" in j) return j.text
    }
    return "No response from model"
}
// @from(Ln 383647, Col 4)
y57
// @from(Ln 383647, Col 9)
L57
// @from(Ln 383647, Col 14)
dZK
// @from(Ln 383647, Col 19)
q2Y = 900000
// @from(Ln 383648, Col 4)
K2Y = 52428800
// @from(Ln 383649, Col 4)
h57
// @from(Ln 383649, Col 9)
R57
// @from(Ln 383649, Col 14)
z2Y
// @from(Ln 383649, Col 19)
A2Y = 2000
// @from(Ln 383650, Col 4)
O2Y = 10485760
// @from(Ln 383651, Col 4)
w2Y = 60000
// @from(Ln 383652, Col 4)
$2Y = 1e4
// @from(Ln 383653, Col 4)
QZK = 10
// @from(Ln 383654, Col 4)
p58 = 1e5
// @from(Ln 383655, Col 4)
x57 = L(() => {
    CK();
    If6();
    C8();
    O2();
    m8();
    Zf();
    U8();
    zQ8();
    a1();
    KK7();
    y57 = class y57 extends Error {
        constructor(q) {
            super(`Claude Code is unable to fetch from ${q}`);
            this.name = "DomainBlockedError"
        }
    };
    L57 = class L57 extends Error {
        constructor(q) {
            super(`Unable to verify if domain ${q} is safe to fetch. This may be due to network restrictions or enterprise security policies blocking claude.ai.`);
            this.name = "DomainCheckFailedError"
        }
    };
    dZK = class dZK extends Error {
        domain;
        constructor(q) {
            super(JSON.stringify({
                error_type: "EGRESS_BLOCKED",
                domain: q,
                message: `Access to ${q} is blocked by the network egress proxy.`
            }));
            this.domain = q;
            this.name = "EgressBlockedError"
        }
    };
    h57 = new iN({
        maxSize: K2Y,
        ttl: q2Y
    }), R57 = new iN({
        max: 128,
        ttl: 300000
    })
})
// @from(Ln 383699, Col 0)
function X2Y(q) {
    try {
        let K = _Z.inputSchema.safeParse(q);
        if (!K.success) return `input:${q.toString()}`;
        let {
            url: _
        } = K.data;
        return `domain:${new URL(_).hostname}`
    } catch {
        return `input:${q.toString()}`
    }
}
// @from(Ln 383712, Col 0)
function rZK(q) {
    return [{
        type: "addRules",
        destination: "localSettings",
        rules: [{
            toolName: PH,
            ruleContent: q
        }],
        behavior: "allow"
    }]
}
// @from(Ln 383723, Col 4)
H2Y
// @from(Ln 383723, Col 9)
J2Y
// @from(Ln 383723, Col 14)
_Z
// @from(Ln 383724, Col 4)
ib6 = L(() => {
    p7();
    gq();
    c7();
    g$();
    KK7();
    GWK();
    x57();
    H2Y = C6(() => y.strictObject({
        url: y.string().url().describe("The URL to fetch content from"),
        prompt: y.string().describe("The prompt to run on the fetched content")
    })), J2Y = C6(() => y.object({
        bytes: y.number().describe("Size of the fetched content in bytes"),
        code: y.number().describe("HTTP response code"),
        codeText: y.string().describe("HTTP response code text"),
        result: y.string().describe("Processed result from applying the prompt to the content"),
        durationMs: y.number().describe("Time taken to fetch and process the content"),
        url: y.string().describe("The URL that was fetched")
    }));
    _Z = Iq({
        name: PH,
        searchHint: "fetch and extract content from a URL",
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
        async description(q) {
            let {
                url: K
            } = q;
            try {
                return `Claude wants to fetch content from ${new URL(K).hostname}`
            } catch {
                return "Claude wants to fetch content from this URL"
            }
        },
        userFacingName() {
            return "Fetch"
        },
        getToolUseSummary: _K7,
        getActivityDescription(q) {
            let K = _K7(q);
            return K ? `Fetching ${K}` : "Fetching web page"
        },
        get inputSchema() {
            return H2Y()
        },
        get outputSchema() {
            return J2Y()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(q) {
            return q.prompt ? `${q.url}: ${q.prompt}` : q.url
        },
        async checkPermissions(q, K) {
            let z = K.getAppState().toolPermissionContext;
            try {
                let {
                    url: $
                } = q, j = new URL($);
                if (KQ8(j.hostname, j.pathname)) return {
                    behavior: "allow",
                    updatedInput: q,
                    decisionReason: {
                        type: "other",
                        reason: "Preapproved host"
                    }
                }
            } catch {}
            let Y = X2Y(q),
                A = QF(z, _Z, "deny").get(Y);
            if (A) return {
                behavior: "deny",
                message: `${_Z.name} denied access to ${Y}.`,
                decisionReason: {
                    type: "rule",
                    rule: A
                }
            };
            let O = QF(z, _Z, "ask").get(Y);
            if (O) return {
                behavior: "ask",
                message: `Claude requested permissions to use ${_Z.name}, but you haven't granted it yet.`,
                decisionReason: {
                    type: "rule",
                    rule: O
                },
                suggestions: rZK(Y)
            };
            let w = QF(z, _Z, "allow").get(Y);
            if (w) return {
                behavior: "allow",
                updatedInput: q,
                decisionReason: {
                    type: "rule",
                    rule: w
                }
            };
            return {
                behavior: "ask",
                message: `Claude requested permissions to use ${_Z.name}, but you haven't granted it yet.`,
                suggestions: rZK(Y)
            }
        },
        async prompt(q) {
            return `IMPORTANT: WebFetch WILL FAIL for authenticated or private URLs. Before using this tool, check if the URL points to an authenticated service (e.g. Google Docs, Confluence, Jira, GitHub). If so, look for a specialized MCP tool that provides authenticated access.
${dH4}`
        },
        async validateInput(q) {
            let {
                url: K
            } = q;
            try {
                new URL(K)
            } catch {
                return {
                    result: !1,
                    message: `Error: Invalid URL "${K}". The URL provided could not be parsed.`,
                    meta: {
                        reason: "invalid_url"
                    },
                    errorCode: 1
                }
            }
            return {
                result: !0
            }
        },
        renderToolUseMessage: DWK,
        renderToolUseProgressMessage: ZWK,
        renderToolResultMessage: fWK,
        async call({
            url: q,
            prompt: K
        }, {
            abortController: _,
            options: {
                isNonInteractiveSession: z
            }
        }) {
            let Y = Date.now(),
                A = await b57(q, _);
            if ("type" in A && A.type === "redirect") {
                let D = A.statusCode === 301 ? "Moved Permanently" : A.statusCode === 308 ? "Permanent Redirect" : A.statusCode === 307 ? "Temporary Redirect" : "Found",
                    Z = `REDIRECT DETECTED: The URL redirects to a different host.

Original URL: ${A.originalUrl}
Redirect URL: ${A.redirectUrl}
Status: ${A.statusCode} ${D}

To complete your request, I need to fetch content from the redirected URL. Please use WebFetch again with these parameters:
- url: "${A.redirectUrl}"
- prompt: "${K}"`;
                return {
                    data: {
                        bytes: Buffer.byteLength(Z),
                        code: A.statusCode,
                        codeText: D,
                        result: Z,
                        durationMs: Date.now() - Y,
                        url: q
                    }
                }
            }
            let {
                content: O,
                bytes: w,
                code: $,
                codeText: j,
                contentType: H,
                persistedPath: J,
                persistedSize: X
            } = A, M = S57(q), P;
            if (M && H.includes("text/markdown") && O.length < p58) P = O;
            else P = await I57(K, O, _.signal, z, M);
            if (J) P += `

[Binary content (${H}, ${o4(X??w)}) also saved to ${J}]`;
            return {
                data: {
                    bytes: w,
                    code: $,
                    codeText: j,
                    result: P,
                    durationMs: Date.now() - Y,
                    url: q
                }
            }
        },
        mapToolResultToToolResultBlockParam({
            result: q
        }, K) {
            return {
                tool_use_id: K,
                type: "tool_result",
                content: q
            }
        }
    })
})
// @from(Ln 383935, Col 0)
async function oZK(q, K, _) {
    let z;
    try {
        z = await M2Y(q)
    } catch {
        return []
    }
    return (await Promise.all(z.map(async (A) => {
        if (!A.endsWith(".jsonl")) return null;
        let O = xm7(A.slice(0, -6));
        if (!O) return null;
        let w = W2Y(q, A);
        if (!K) return {
            sessionId: O,
            filePath: w,
            mtime: 0,
            projectPath: _
        };
        try {
            let $ = await P2Y(w);
            return {
                sessionId: O,
                filePath: w,
                mtime: $.mtime.getTime(),
                projectPath: _
            }
        } catch {
            return null
        }
    }))).filter((A) => A !== null)
}
// @from(Ln 383966, Col 4)
aZK = L(() => {
    zQ6();
    hm()
})
// @from(Ln 383982, Col 0)
function gQ8() {
    return f2Y(Nw(), G2Y)
}
// @from(Ln 383985, Col 0)
async function UQ8() {
    try {
        return (await eZK(gQ8())).mtimeMs
    } catch {
        return 0
    }
}
// @from(Ln 383992, Col 0)
async function qfK() {
    let q = gQ8(),
        K, _;
    try {
        let [Y, A] = await Promise.all([eZK(q), sZK(q, "utf8")]);
        K = Y.mtimeMs;
        let O = parseInt(A.trim(), 10);
        _ = Number.isFinite(O) ? O : void 0
    } catch {}
    if (K !== void 0 && Date.now() - K < v2Y) {
        if (_ !== void 0 && mT6(_)) return E(`[autoDream] lock held by live PID ${_} (mtime ${Math.round((Date.now()-K)/1000)}s ago)`), null
    }
    await tZK(Nw(), {
        recursive: !0
    }), await u57(q, String(process.pid));
    let z;
    try {
        z = await sZK(q, "utf8")
    } catch {
        return null
    }
    if (parseInt(z.trim(), 10) !== process.pid) return null;
    return K ?? 0
}
// @from(Ln 384016, Col 0)
async function QQ8(q) {
    let K = gQ8();
    try {
        if (q === 0) {
            await D2Y(K);
            return
        }
        await u57(K, "");
        let _ = q / 1000;
        await Z2Y(K, _, _)
    } catch (_) {
        E(`[autoDream] rollback failed: ${_.message} — next trigger delayed to minHours`)
    }
}
// @from(Ln 384030, Col 0)
async function KfK(q) {
    let K = e2(Y7());
    return (await oZK(K, !0)).filter((z) => z.mtime > q).map((z) => z.sessionId)
}
// @from(Ln 384034, Col 0)
async function _fK() {
    try {
        await tZK(Nw(), {
            recursive: !0
        }), await u57(gQ8(), String(process.pid))
    } catch (q) {
        E(`[autoDream] recordConsolidation write failed: ${q.message}`)
    }
}
// @from(Ln 384043, Col 4)
G2Y = ".consolidate-lock"
// @from(Ln 384044, Col 4)
v2Y = 3600000
// @from(Ln 384045, Col 4)
F58 = L(() => {
    y8();
    VY();
    K8();
    Ow6();
    aZK();
    g4()
})
// @from(Ln 384054, Col 0)
function m57(q) {
    return typeof q === "object" && q !== null && "type" in q && q.type === "dream"
}
// @from(Ln 384058, Col 0)
function zfK(q, K) {
    let _ = cR("dream"),
        z = {
            ...cf(_, "dream", "dreaming"),
            type: "dream",
            status: "running",
            skipTranscript: !0,
            phase: "starting",
            sessionsReviewing: K.sessionsReviewing,
            filesTouched: [],
            turns: [],
            abortController: K.abortController,
            priorMtime: K.priorMtime
        };
    return q.register(z), _
}
// @from(Ln 384075, Col 0)
function YfK(q, K, _, z) {
    z.update(q, (Y) => {
        let A = new Set(Y.filesTouched),
            O = _.filter((w) => !A.has(w) && A.add(w));
        if (K.text === "" && K.toolUseCount === 0 && O.length === 0) return Y;
        return {
            ...Y,
            phase: O.length > 0 ? "updating" : Y.phase,
            filesTouched: O.length > 0 ? [...Y.filesTouched, ...O] : Y.filesTouched,
            turns: Y.turns.slice(-(T2Y - 1)).concat(K)
        }
    })
}
// @from(Ln 384089, Col 0)
function AfK(q, K) {
    K.update(q, (_) => ({
        ..._,
        status: "completed",
        endTime: Date.now(),
        notified: !0,
        abortController: void 0
    })), I$(q, "completed", {
        skipTranscript: !0
    })
}
// @from(Ln 384101, Col 0)
function OfK(q, K) {
    K.update(q, (_) => ({
        ..._,
        status: "failed",
        endTime: Date.now(),
        notified: !0,
        abortController: void 0
    })), I$(q, "failed", {
        skipTranscript: !0
    })
}
// @from(Ln 384112, Col 4)
T2Y = 30
// @from(Ln 384113, Col 4)
dQ8
// @from(Ln 384114, Col 4)
cQ8 = L(() => {
    F58();
    $T();
    BP();
    dQ8 = {
        name: "DreamTask",
        type: "dream",
        async kill(q, K) {
            let _;
            if (K.update(q, (z) => {
                    if (z.status !== "running") return z;
                    return z.abortController?.abort(), _ = z.priorMtime, {
                        ...z,
                        status: "killed",
                        endTime: Date.now(),
                        notified: !0,
                        abortController: void 0
                    }
                }), _ !== void 0) I$(q, "stopped", {
                skipTranscript: !0
            }), await QQ8(_)
        }
    }
})
// @from(Ln 384139, Col 0)
function V2Y() {
    let q = [nQ8, lQ8, mX6, dQ8];
    if ($fK) q.push($fK);
    if (jfK) q.push(jfK);
    return q
}
// @from(Ln 384146, Col 0)
function HfK(q) {
    return V2Y().find((K) => K.type === q)
}
// @from(Ln 384149, Col 4)
$fK = null
// @from(Ln 384150, Col 4)
jfK = null
// @from(Ln 384151, Col 4)
JfK = L(() => {
    cQ8();
    vM();
    pl();
    Bl()
})
// @from(Ln 384158, Col 0)
function WS(q) {
    return typeof q === "object" && q !== null && "type" in q && q.type === "local_bash"
}
// @from(Ln 384161, Col 0)
async function rQ8(q, K) {
    let {
        taskRegistry: _,
        setAppState: z
    } = K, Y = _.get(q);
    if (!Y) throw new iQ8(`No task found with ID: ${q}`, "not_found");
    if (Y.status !== "running") throw new iQ8(`Task ${q} is not running (status: ${Y.status})`, "not_running");
    let A = HfK(Y.type);
    if (!A) throw new iQ8(`Unsupported task type: ${Y.type}`, "unsupported_type");
    if (await A.kill(q, _, z), WS(Y)) {
        let w = !1;
        if (_.update(q, ($) => {
                if ($.notified) return $;
                return w = !0, {
                    ...$,
                    notified: !0
                }
            }), w) I$(q, "stopped", {
            toolUseId: Y.toolUseId,
            summary: Y.description
        })
    }
    let O = WS(Y) ? Y.command : Y.description;
    return {
        taskId: q,
        taskType: Y.type,
        command: O
    }
}
// @from(Ln 384190, Col 4)
iQ8
// @from(Ln 384191, Col 4)
B57 = L(() => {
    JfK();
    BP();
    iQ8 = class iQ8 extends Error {
        code;
        constructor(q, K) {
            super(q);
            this.code = K;
            this.name = "StopTaskError"
        }
    }
})
// @from(Ln 384204, Col 0)
function PfK() {
    return ""
}
// @from(Ln 384208, Col 0)
function k2Y(q) {
    let K = q.split(`
`),
        _ = q;
    if (K.length > XfK) _ = K.slice(0, XfK).join(`
`);
    if (N1(_) > MfK) _ = RY6(_, MfK);
    return _.trim()
}
// @from(Ln 384218, Col 0)
function WfK(q, K, {
    verbose: _
}) {
    let z = q.command ?? "",
        Y = _ ? z : k2Y(z);
    return p57.default.createElement(_1, null, p57.default.createElement(T, null, Y, Y !== z ? "… · stopped" : " · stopped"))
}
// @from(Ln 384225, Col 4)
p57
// @from(Ln 384225, Col 9)
XfK = 2
// @from(Ln 384226, Col 4)
MfK = 160
// @from(Ln 384227, Col 4)
DfK = L(() => {
    GK();
    n5();
    g6();
    c7();
    p57 = K6(P6(), 1)
})
// @from(Ln 384234, Col 4)
N2Y
// @from(Ln 384234, Col 9)
E2Y
// @from(Ln 384234, Col 14)
oQ8
// @from(Ln 384235, Col 4)
F57 = L(() => {
    p7();
    gq();
    B57();
    e8();
    DfK();
    N2Y = C6(() => y.strictObject({
        task_id: y.string().optional().describe("The ID of the background task to stop"),
        shell_id: y.string().optional().describe("Deprecated: use task_id instead")
    })), E2Y = C6(() => y.object({
        message: y.string().describe("Status message about the operation"),
        task_id: y.string().describe("The ID of the task that was stopped"),
        task_type: y.string().describe("The type of the task that was stopped"),
        command: y.string().optional().describe("The command or description of the stopped task")
    })), oQ8 = Iq({
        name: RV,
        searchHint: "kill a running background task",
        aliases: ["KillShell"],
        maxResultSizeChars: 1e5,
        userFacingName: () => "Stop Task",
        get inputSchema() {
            return N2Y()
        },
        get outputSchema() {
            return E2Y()
        },
        shouldDefer: !0,
        isConcurrencySafe() {
            return !0
        },
        toAutoClassifierInput(q) {
            return q.task_id ?? q.shell_id ?? ""
        },
        async validateInput({
            task_id: q,
            shell_id: K
        }, {
            getAppState: _
        }) {
            let z = q ?? K;
            if (!z) return {
                result: !1,
                message: "Missing required parameter: task_id",
                errorCode: 1
            };
            let A = _().tasks?.[z];
            if (!A) return {
                result: !1,
                message: `No task found with ID: ${z}`,
                errorCode: 1
            };
            if (A.status !== "running") return {
                result: !1,
                message: `Task ${z} is not running (status: ${A.status})`,
                errorCode: 3
            };
            return {
                result: !0
            }
        },
        async description() {
            return "Stop a running background task by ID"
        },
        async prompt() {
            return Cg7
        },
        mapToolResultToToolResultBlockParam(q, K) {
            return {
                tool_use_id: K,
                type: "tool_result",
                content: I6(q)
            }
        },
        renderToolUseMessage: PfK,
        renderToolResultMessage: WfK,
        async call({
            task_id: q,
            shell_id: K
        }, {
            taskRegistry: _,
            setAppState: z,
            abortController: Y
        }) {
            let A = q ?? K;
            if (!A) throw Error("Missing required parameter: task_id");
            let O = await rQ8(A, {
                taskRegistry: _,
                setAppState: z
            });
            return {
                data: {
                    message: `Successfully stopped task: ${O.taskId} (${O.command})`,
                    task_id: O.taskId,
                    task_type: O.taskType,
                    command: O.command
                }
            }
        }
    })
})
// @from(Ln 384335, Col 4)
g57 = {}
// @from(Ln 384348, Col 0)
function rb6() {
    return
}
// @from(Ln 384352, Col 0)
function a96() {
    return
}
// @from(Ln 384356, Col 0)
function DS() {
    return rb6() ?? o7()?.accessToken
}
// @from(Ln 384360, Col 0)
function g58() {
    return a96() ?? r7().BASE_API_URL
}
// @from(Ln 384364, Col 0)
function U58() {
    let q = process.env.CLAUDE_REMOTE_CONTROL_SESSION_NAME_PREFIX || y2Y();
    return ZfK(q) || "remote-control"
}
// @from(Ln 384369, Col 0)
function ZfK(q) {
    return q.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}
// @from(Ln 384372, Col 4)
qn = L(() => {
    z3();
    T7()
})
// @from(Ln 384376, Col 4)
vfK = {}
// @from(Ln 384392, Col 0)
function I2Y(q) {
    let K = S2Y(q).toLowerCase();
    return b2Y[K] ?? "application/octet-stream"
}
// @from(Ln 384397, Col 0)
function GfK(q) {
    return q.replace(/[\r\n]/g, "").replaceAll("\\", "\\\\").replaceAll('"', "\\\"")
}
// @from(Ln 384401, Col 0)
function EM6(q) {
    E(`[brief:upload] ${q}`)
}
// @from(Ln 384405, Col 0)
function x2Y() {
    return a96() ?? process.env.ANTHROPIC_BASE_URL ?? r7().BASE_API_URL
}
// @from(Ln 384408, Col 0)
async function m2Y(q, K, _) {
    if (!_.replBridgeEnabled) return;
    if (K > ffK) {
        EM6(`skip ${q}: ${K} bytes exceeds ${ffK} limit`);
        return
    }
    let z = DS();
    if (!z) {
        EM6("skip: no oauth token");
        return
    }
    let Y;
    try {
        Y = await h2Y(q)
    } catch (J) {
        EM6(`read failed for ${q}: ${J}`);
        return
    }
    let O = `${x2Y()}/api/oauth/file_upload`,
        w = R2Y(q),
        $ = I2Y(w),
        j = `----FormBoundary${L2Y()}`,
        H = Buffer.concat([Buffer.from(`--${j}\r
Content-Disposition: form-data; name="file"; filename="${GfK(w)}"\r
Content-Type: ${$}\r
\r
`), Y, Buffer.from(`\r
--${j}--\r
`)]);
    try {
        let J = await Z1.post(O, H, {
            headers: {
                Authorization: `Bearer ${z}`,
                "Content-Type": `multipart/form-data; boundary=${j}`,
                "Content-Length": H.length.toString()
            },
            timeout: C2Y,
            signal: _.signal,
            validateStatus: () => !0
        });
        if (J.status !== 201) {
            EM6(`upload failed for ${q}: status=${J.status} body=${I6(J.data).slice(0,200)}`);
            return
        }
        let X = u2Y().safeParse(J.data);
        if (!X.success) {
            EM6(`unexpected response shape for ${q}: ${X.error.message}`);
            return
        }
        return EM6(`uploaded ${q} → ${X.data.file_uuid} (${K} bytes)`), X.data.file_uuid
    } catch (J) {
        EM6(`upload threw for ${q}: ${J}`);
        return
    }
}
// @from(Ln 384463, Col 4)
ffK = 31457280
// @from(Ln 384464, Col 4)
C2Y = 30000
// @from(Ln 384465, Col 4)
b2Y
// @from(Ln 384465, Col 9)
u2Y
// @from(Ln 384466, Col 4)
TfK = L(() => {
    CK();
    p7();
    qn();
    z3();
    K8();
    e8();
    b2Y = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".webp": "image/webp"
    };
    u2Y = C6(() => y.object({
        file_uuid: y.string()
    }))
})
// @from(Ln 384487, Col 0)
async function kfK(q) {
    let K = b8();
    for (let _ of q) {
        let z = Wq(_);
        try {
            if (!(await VfK(z)).isFile()) return {
                result: !1,
                message: `Attachment "${_}" is not a regular file.`,
                errorCode: 1
            }
        } catch (Y) {
            let A = Q1(Y);
            if (A === "ENOENT") return {
                result: !1,
                message: `Attachment "${_}" does not exist. Current working directory: ${K}.`,
                errorCode: 1
            };
            if (A === "EACCES" || A === "EPERM") return {
                result: !1,
                message: `Attachment "${_}" is not accessible (permission denied).`,
                errorCode: 1
            };
            throw Y
        }
    }
    return {
        result: !0
    }
}
// @from(Ln 384516, Col 0)
async function NfK(q, K) {
    let _ = [];
    for (let O of q) {
        let w = Wq(O),
            $ = await VfK(w);
        _.push({
            path: w,
            size: $.size,
            isImage: ky8.test(w)
        })
    }
    let z = K.replBridgeEnabled || S6(process.env.CLAUDE_CODE_BRIEF_UPLOAD) || !!process.env.CLAUDE_CODE_REMOTE_ENVIRONMENT_TYPE,
        {
            uploadBriefAttachment: Y
        } = await Promise.resolve().then(() => (TfK(), vfK)),
        A = await Promise.all(_.map((O) => Y(O.path, O.size, {
            replBridgeEnabled: z,
            signal: K.signal
        })));
    return _.map((O, w) => A[w] === void 0 ? O : {
        ...O,
        file_uuid: A[w]
    })
}
// @from(Ln 384540, Col 4)
EfK = L(() => {
    n7();
    Q8();
    m8();
    VE6();
    b9()
})
// @from(Ln 384547, Col 4)
Xe = {}
// @from(Ln 384553, Col 0)
function aQ8() {
    return aG() || S6(process.env.CLAUDE_CODE_BRIEF) || XD("tengu_kairos_brief", !1, B2Y)
}
// @from(Ln 384557, Col 0)
function Q57() {
    return (aG() || cL()) && aQ8()
}
// @from(Ln 384560, Col 4)
B2Y = 300000
// @from(Ln 384561, Col 4)
rF = L(() => {
    y8();
    B1();
    Q8()
})
// @from(Ln 384567, Col 0)
function yfK() {
    return ""
}
// @from(Ln 384571, Col 0)
function LfK(q, K, _) {
    let z = (q.attachments?.length ?? 0) > 0;
    if (!q.message && !z) return null;
    if (_?.isTranscriptMode) return SH.default.createElement(u, {
        flexDirection: "row",
        marginTop: 1
    }, SH.default.createElement(u, {
        minWidth: 2
    }, SH.default.createElement(T, {
        color: "text"
    }, $9)), SH.default.createElement(u, {
        flexDirection: "column"
    }, q.message ? SH.default.createElement(xw, null, q.message) : null, SH.default.createElement(d57, {
        attachments: q.attachments
    })));
    if (_?.isBriefOnly) {
        let Y = q.sentAt ? tg8(q.sentAt) : "";
        return SH.default.createElement(u, {
            flexDirection: "column",
            marginTop: 1,
            paddingLeft: 2
        }, SH.default.createElement(u, {
            flexDirection: "row"
        }, SH.default.createElement(T, {
            color: "briefLabelClaude"
        }, "Claude"), Y ? SH.default.createElement(T, {
            dimColor: !0
        }, " ", Y) : null), SH.default.createElement(u, {
            flexDirection: "column"
        }, q.message ? SH.default.createElement(xw, null, q.message) : null, SH.default.createElement(d57, {
            attachments: q.attachments
        })))
    }
    return SH.default.createElement(u, {
        flexDirection: "row",
        marginTop: 1
    }, SH.default.createElement(u, {
        minWidth: 2
    }), SH.default.createElement(u, {
        flexDirection: "column"
    }, q.message ? SH.default.createElement(xw, null, q.message) : null, SH.default.createElement(d57, {
        attachments: q.attachments
    })))
}
// @from(Ln 384616, Col 0)
function d57(q) {
    let K = s(4),
        {
            attachments: _
        } = q;
    if (!_ || _.length === 0) return null;
    let z;
    if (K[0] !== _) z = _.map(p2Y), K[0] = _, K[1] = z;
    else z = K[1];
    let Y;
    if (K[2] !== z) Y = SH.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, z), K[2] = z, K[3] = Y;
    else Y = K[3];
    return Y
}
// @from(Ln 384634, Col 0)
function p2Y(q) {
    return SH.default.createElement(u, {
        key: q.path,
        flexDirection: "row"
    }, SH.default.createElement(T, {
        dimColor: !0
    }, e6.pointerSmall, " ", q.isImage ? "[image]" : "[file]", " "), SH.default.createElement(T, null, S3(q.path)), SH.default.createElement(T, {
        dimColor: !0
    }, " (", o4(q.size), ")"))
}
// @from(Ln 384644, Col 4)
SH
// @from(Ln 384645, Col 4)
hfK = L(() => {
    o6();
    Qq();
    ry();
    A3();
    g6();
    eK();
    c7();
    Gq7();
    SH = K6(P6(), 1)
})
// @from(Ln 384656, Col 4)
F2Y
// @from(Ln 384656, Col 9)
g2Y
// @from(Ln 384656, Col 14)
RfK
// @from(Ln 384657, Col 4)
SfK = L(() => {
    p7();
    C8();
    gq();
    EfK();
    vh();
    rF();
    hfK();
    F2Y = C6(() => y.strictObject({
        message: y.string().describe("The message for the user. Supports markdown formatting."),
        attachments: y.array(y.string()).optional().describe("Optional file paths (absolute or relative to cwd) to attach. Use for photos, screenshots, diffs, logs, or any file the user should see alongside your message."),
        status: y.enum(["normal", "proactive"]).describe("Use 'proactive' when you're surfacing something the user hasn't asked for and needs to see now — task completion while they're away, a blocker you hit, an unsolicited status update. Use 'normal' when replying to something the user just said.")
    })), g2Y = C6(() => y.object({
        message: y.string().describe("The message"),
        attachments: y.array(y.object({
            path: y.string(),
            size: y.number(),
            isImage: y.boolean(),
            file_uuid: y.string().optional()
        })).optional().describe("Resolved attachment metadata"),
        sentAt: y.string().optional().describe("ISO timestamp captured at tool execution on the emitting process. Optional — resumed sessions replay pre-sentAt outputs verbatim.")
    })), RfK = Iq({
        name: U16,
        aliases: [DO1],
        searchHint: "send a message to the user — your primary visible output channel",
        maxResultSizeChars: 1e5,
        userFacingName() {
            return ""
        },
        get inputSchema() {
            return F2Y()
        },
        get outputSchema() {
            return g2Y()
        },
        isEnabled() {
            return Q57()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(q) {
            return q.message
        },
        async validateInput({
            attachments: q
        }, K) {
            if (!q || q.length === 0) return {
                result: !0
            };
            return kfK(q)
        },
        async description() {
            return ZO1
        },
        async prompt() {
            return fO1
        },
        mapToolResultToToolResultBlockParam(q, K) {
            let _ = q.attachments?.length ?? 0,
                z = _ === 0 ? "" : ` (${_} ${O7(_,"attachment")} included)`;
            return {
                tool_use_id: K,
                type: "tool_result",
                content: `Message delivered to user.${z}`
            }
        },
        renderToolUseMessage: yfK,
        renderToolResultMessage: LfK,
        async call({
            message: q,
            attachments: K,
            status: _
        }, z) {
            let Y = new Date().toISOString();
            if (d("tengu_brief_send", {
                    proactive: _ === "proactive",
                    attachment_count: K?.length ?? 0
                }), !K || K.length === 0) return {
                data: {
                    message: q,
                    sentAt: Y
                }
            };
            let A = z.getAppState(),
                O = await NfK(K, {
                    replBridgeEnabled: A.replBridgeEnabled,
                    signal: z.abortController.signal
                });
            return {
                data: {
                    message: q,
                    attachments: O,
                    sentAt: Y
                }
            }
        }
    })
})
// @from(Ln 384759, Col 0)
async function CfK() {
    let q = JJ(),
        K = await U2Y(),
        _ = K ? `gh pr edit N --body-file - <<'EOF'\\n"+body+"\\nEOF` : `git commit -F - <<'EOF'\\n"+msg+"\\nEOF`;
    if (q) return `
REPL is your **only way** to investigate — shell, file reads, and code search all happen here via the shorthands below. Edit, Write, and Agent are still available as top-level tools for direct use.

**Aim for 1-3 REPL calls per turn** — over-fetch and batch.

## Dense scripts — every char is an output token

\`\`\`javascript
o.git=sh('git status')
for(const f of (await rgf('X','src')).slice(0,5)) o[f]=cat(f,1,300)
o
\`\`\`

\`o\` is pre-declared \`{}\`; assign results directly to \`o.key\` (no \`const x=\` then repack). Promise values on \`o\` are auto-awaited — drop \`await\` unless you branch on the value. **End the script with bare \`o\`** (or a statement) to return the full object; ending on \`o.x=...\` returns just that one value. Relative paths resolve against cwd. No \`//\` comments — the \`description\` param is your comment. No blank lines, single-char vars.

## API
- \`sh(cmd,ms?)\` → stdout+stderr (merged — never write \`2>&1\` or \`2>/dev/null\`)
- \`cat(path,off?,lim?)\` → file content
- \`rg(pat,path?,{A,B,C,glob,head,type,i}?)\` → match text
- \`rgf(pat,path?,glob?)\` → matching file paths[]
- \`gl(pat,path?)\` → glob file paths[]
- \`put(path,content)\` → write file
${K?`- \\\`gh(args)\\\` → \\\`sh('gh '+args)\\\` with \\\`-R \\\${REPO}\\\` injected
`:""}- \`chdir(path)\` — set cwd for this REPL call
- \`haiku(prompt,schema?)\` — one-turn model sampling
- \`registerTool(name,desc,schema,handler)\` / \`unregisterTool\` / \`listTools\` / \`getTool\`
- \`log\` (console.log) · \`str\` (JSON.stringify) · \`shQuote(s)\`${K?" · \\`REPO\\` ('owner/name')":""}
- \`await ${J4}({…})\` / \`await ${HJ}({…})\` / \`await mcp__server__tool({…})\` (MCP tools by full name)

Shorthands never throw — \`sh\`/\`cat\`/\`rg\` return the error text on failure, \`rgf\`/\`gl\` return \`[]\`, never \`undefined\`. Permission-denied is a hard no — don't retry the same call; pivot or stop.

## Rules
- One investigation = one call. Put the next step in the code; grep→read→grep in one script. A failing inner call degrades the result, not the whole script.
- No \`import\`/\`require\`/\`process\`/Node globals — the VM context is sealed. ≥3 ops per call. Over-fetch (3-5 files, 3-4 patterns).
- Variables persist across calls. Last expression (or \`o\`) = return value. No top-level \`return\` — end with \`o\` and branch with \`if/else\` above it.
- Never re-invoke a stateful op (\`sh\`/\`Edit\`/\`put\`) to grab another field — \`git reset\`, \`rm\`, migrations run twice.
- Don't \`put()\` to a temp file just to feed a shell command — pipe via heredoc instead: \`sh("${_}")\`. Generic temp paths get clobbered by parallel agents.
`;
    return `
REPL is your programming interface to Claude Code's tools. Use it to loop, branch, and compose tool calls with code.

## How to Use

Write JavaScript that calls tools as async functions:
\`\`\`javascript
const { filenames } = await Glob({ pattern: 'src/**/*.ts' })
for (const f of filenames) {
  const { file } = await Read({ file_path: f })
  if (file.content.includes('oldName')) {
    await Edit({ file_path: f, old_string: 'oldName', new_string: 'newName', replace_all: true })
  }
}
\`\`\`

**IMPORTANT: Batch ALL operations into ONE REPL call.** Don't make multiple separate REPL calls - write a complete script that does everything.

## Available Tools

All tools work as async functions: \`Read\`, \`Write\`, \`Edit\`, \`Glob\`, \`Grep\`, \`Bash\`, etc. MCP tools are callable by their full name (e.g. \`await mcp__slack__slack_send_message({...})\`).

\`\`\`javascript
const { filenames } = await Glob({ pattern: '*.ts' })
const { file } = await Read({ file_path: 'config.json' })
await Edit({ file_path: 'foo.ts', old_string: 'old', new_string: 'new' })
const { stdout } = await Bash({ command: 'git status' })
\`\`\`

## Tips
- \`import\`/\`require\` don't work here — the vm context is sealed. For filesystem access use \`Read\`/\`Write\`/\`Glob\`; for shell use \`Bash\`.
- Use \`Promise.all()\` for parallel operations
- Variables persist across REPL calls
- Last expression is returned as the result
- \`haiku(prompt, schema?)\` — one-turn model sampling. Without schema returns text; with a JSON schema returns the parsed object.
- \`registerTool(name, desc, schema, handler)\` defines a new tool; \`unregisterTool(name)\`, \`listTools()\`, \`getTool(name)\` manage them
- \`shQuote(s)\` quotes a string for Bash — use this instead of \`JSON.stringify\` (double quotes don't protect backticks or \`$\`)
- Don't write a temp file just to feed a shell command — pipe via heredoc: \`await Bash({command: "${_}"})\`. Generic temp paths get clobbered by parallel agents.
`
}
// @from(Ln 384842, Col 0)
function bfK() {
    return JJ() ? "Execute JavaScript to read, write, edit files and run shell commands" : "Execute JavaScript code with access to Claude Code tools"
}
// @from(Ln 384845, Col 4)
U2Y
// @from(Ln 384846, Col 4)
IfK = L(() => {
    v16();
    n0();
    EP();
    U2Y = P1(async () => await oA("gh") !== null)
})
// @from(Ln 384853, Col 0)
function xfK(q) {
    let K = [];
    for (let [, _] of q) K.push(c2Y(_));
    return K
}
// @from(Ln 384859, Col 0)
function Q2Y(q) {
    let K;
    try {
        K = I6(q, null, 2)
    } catch {
        K = String(q)
    }
    return ZS.createElement(_1, null, ZS.createElement(T, null, K))
}
// @from(Ln 384869, Col 0)
function d2Y(q, {
    verbose: K
}) {
    return ZS.createElement(_1, null, ZS.createElement(T, {
        color: "error"
    }, typeof q === "string" ? q : "Error"))
}
// @from(Ln 384877, Col 0)
function c2Y(q) {
    let K = y.object({}).passthrough();
    return Iq({
        name: `eval_registered__${q.name}`,
        maxResultSizeChars: 1e5,
        async prompt() {
            return q.description
        },
        async description() {
            return q.description
        },
        inputSchema: K,
        inputJSONSchema: q.schema,
        isEnabled() {
            return !0
        },
        isConcurrencySafe() {
            return !1
        },
        isReadOnly() {
            return !1
        },
        toAutoClassifierInput(z) {
            let Y = Object.keys(z);
            return Y.length > 0 ? `${q.name}(${Y.join(", ")})` : q.name
        },
        async checkPermissions() {
            return {
                behavior: "ask",
                message: `Execute registered tool "${q.name}"`
            }
        },
        async call(z) {
            return {
                data: await q.handler(z)
            }
        },
        userFacingName() {
            return q.displayName ?? q.name
        },
        getToolUseSummary() {
            return null
        },
        mapToolResultToToolResultBlockParam(z, Y) {
            let A;
            try {
                A = I6(z)
            } catch {
                A = String(z)
            }
            return {
                tool_use_id: Y,
                type: "tool_result",
                content: A
            }
        },
        renderToolUseMessage(z) {
            try {
                let Y = I6(z, null, 2);
                return `${q.name}(${Y})`
            } catch {
                return `${q.name}(...)`
            }
        },
        renderToolResultMessage: Q2Y,
        renderToolUseRejectedMessage() {
            return ZS.createElement(_1, null, ZS.createElement(T, {
                color: "warning"
            }, "Rejected"))
        },
        renderToolUseErrorMessage: d2Y,
        renderToolUseProgressMessage() {
            return null
        }
    })
}
// @from(Ln 384953, Col 4)
ZS
// @from(Ln 384954, Col 4)
ufK = L(() => {
    p7();
    GK();
    g6();
    gq();
    e8();
    ZS = K6(P6(), 1)
})
// @from(Ln 384963, Col 0)
function l2Y() {
    if (sQ8) return sQ8;
    if (typeof Bun > "u") throw Error("unreachable: Bun required");
    return sQ8 = new Bun.Transpiler({
        loader: "js",
        replMode: !0
    }), sQ8
}
// @from(Ln 384972, Col 0)
function tQ8(q) {
    let K = l2Y().transformSync(q);
    return i2Y(K), K
}
// @from(Ln 384977, Col 0)
function i2Y(q) {
    let K = n2Y.exec(q);
    if (K) throw Error(`Module loading (${K[1]}) is not available in REPL — the vm context is sealed. ` + "Use the tool globals instead: await Bash({command: '...'}), await Read({file_path: '...'}), await Glob({pattern: '...'}), etc.")
}
// @from(Ln 384982, Col 0)
function eQ8(q) {
    return q !== null && typeof q === "object" && "value" in q ? q.value : q
}
// @from(Ln 384985, Col 4)
sQ8
// @from(Ln 384985, Col 9)
n2Y
// @from(Ln 384986, Col 4)
c57 = L(() => {
    n2Y = /\b(import|require)\s*\(/
})
// @from(Ln 384993, Col 0)
function n57(q, K) {
    function _(Y, A) {
        return async (O, w) => {
            if (typeof O !== "string") throw Error(`${Y}: prompt must be a string`);
            let $;
            if (w !== void 0) {
                let J;
                try {
                    J = n8(I6(w))
                } catch {
                    throw Error(`${Y}: schema must be JSON-serializable`)
                }
                if (J === null || typeof J !== "object" || Array.isArray(J)) throw Error(`${Y}: schema must be an object`);
                $ = l57(J)
            }
            let j = `repl_${r2Y()}`,
                H = {
                    prompt: O.slice(0, 200)
                };
            K?.({
                toolUseID: j,
                data: {
                    type: "repl_tool_call",
                    toolName: Y,
                    toolInput: H,
                    toolUseId: j,
                    phase: "start"
                }
            });
            try {
                let J = await ob6({
                        systemPrompt: sK([]),
                        userPrompt: O,
                        outputFormat: $ ? {
                            type: "json_schema",
                            schema: $
                        } : void 0,
                        signal: q.abortController.signal,
                        options: {
                            model: A(),
                            querySource: "repl_sampling",
                            agents: [],
                            isNonInteractiveSession: q.options.isNonInteractiveSession,
                            hasAppendSystemPrompt: !1,
                            mcpTools: []
                        }
                    }),
                    X = s5(J.message.content);
                if (fp(X)) throw Error(X);
                let M = $ ? n8(X) : X;
                return K?.({
                    toolUseID: j,
                    data: {
                        type: "repl_tool_call",
                        toolName: Y,
                        toolInput: H,
                        toolUseId: j,
                        phase: "complete",
                        result: M
                    }
                }), M
            } catch (J) {
                let X = J instanceof Error ? J.message : String(J);
                throw K?.({
                    toolUseID: j,
                    data: {
                        type: "repl_tool_call",
                        toolName: Y,
                        toolInput: H,
                        toolUseId: j,
                        phase: "error",
                        error: X
                    }
                }), J
            }
        }
    }
    let z = _("haiku", OM);
    return {
        haiku: z,
        opus: z,
        sonnet: z
    }
}
// @from(Ln 385078, Col 0)
function l57(q) {
    if (q === null || typeof q !== "object") return q;
    if (Array.isArray(q)) return q.map(l57);
    let K = q,
        _ = {};
    for (let z of Object.keys(K)) _[z] = l57(K[z]);
    if (_.type === "object" && !("additionalProperties" in _)) _.additionalProperties = !1;
    return _
}
// @from(Ln 385087, Col 4)
mfK = L(() => {
    O2();
    rv();
    _7();
    Sq();
    e8()
})
// @from(Ln 385095, Col 0)
function qd8(q, K, _, z) {
    if (q !== J4 && q !== IK) return null;
    if (typeof _ !== "object" || _ === null || !("file_path" in _) || typeof _.file_path !== "string") return null;
    try {
        let Y = Wq(_.file_path),
            A = z.get(Y);
        if (!A || A.offset !== void 0 || A.limit !== void 0) return null;
        let O = Av(Y);
        if (O <= A.timestamp) return null;
        let w = iC(Y);
        if (z.set(Y, {
                content: w.content,
                timestamp: O,
                offset: void 0,
                limit: void 0
            }), Ac(A, w.content)) return null;
        return E(`PostToolUse hook modified ${Y} after ${q} — re-synced readFileState`, {
            level: "info"
        }), Y4({
            type: "hook_additional_context",
            content: [`PostToolUse hook modified ${Y} after your edit (likely a formatter). Your next Edit will not fail with a stale-file error, but if its old_string targets a region the hook reformatted, Read the file first.`],
            hookName: `PostToolUse:${q}`,
            toolUseID: K,
            hookEvent: "PostToolUse"
        })
    } catch {
        return null
    }
}
// @from(Ln 385124, Col 4)
i57 = L(() => {
    u$();
    ZM();
    K8();
    eK();
    nN();
    FP();
    b9()
})
// @from(Ln 385134, Col 0)
function r57(q) {
    switch (q) {
        case "allow":
            return "allowed";
        case "deny":
            return "denied";
        default:
            return "asked for confirmation for"
    }
}
// @from(Ln 385145, Col 0)
function Me(q) {
    if (q instanceof sz) return q.message || of;
    if (!(q instanceof Error)) return String(q);
    let _ = o57(q).filter(Boolean).join(`
`).trim() || "Command failed with no output";
    if (_.length <= 1e4) return _;
    let z = 5000,
        Y = _.slice(0, z),
        A = _.slice(-z);
    return `${Y}

... [${_.length-1e4} characters truncated] ...

${A}`
}
// @from(Ln 385161, Col 0)
function o57(q) {
    if (q instanceof JV) return [`Exit code ${q.code}`, q.interrupted ? of : "", q.stderr, q.stdout];
    let K = [q.message];
    if ("stderr" in q && typeof q.stderr === "string") K.push(q.stderr);
    if ("stdout" in q && typeof q.stdout === "string") K.push(q.stdout);
    return K
}
// @from(Ln 385169, Col 0)
function BfK(q) {
    if (q.length === 0) return "";
    return q.reduce((K, _, z) => {
        let Y = String(_);
        if (typeof _ === "number") return `${String(K)}[${Y}]`;
        return z === 0 ? Y : `${String(K)}.${Y}`
    }, "")
}
// @from(Ln 385178, Col 0)
function ab6(q, K) {
    let _ = K.issues.filter((w) => w.code === "invalid_type" && w.message.includes("received undefined")).map((w) => BfK(w.path)),
        z = K.issues.filter((w) => w.code === "unrecognized_keys").flatMap((w) => w.keys),
        Y = K.issues.filter((w) => w.code === "invalid_type" && !w.message.includes("received undefined")).map((w) => {
            let $ = w,
                j = w.message.match(/received (\w+)/),
                H = j ? j[1] : "unknown";
            return {
                param: BfK(w.path),
                expected: $.expected,
                received: H
            }
        }),
        A = K.message,
        O = [];
    if (_.length > 0) {
        let w = _.map(($) => `The required parameter \`${$}\` is missing`);
        O.push(...w)
    }
    if (z.length > 0) {
        let w = z.map(($) => `An unexpected parameter \`${$}\` was provided`);
        O.push(...w)
    }
    if (Y.length > 0) {
        let w = Y.map(({
            param: $,
            expected: j,
            received: H
        }) => `The parameter \`${$}\` type is expected as \`${j}\` but provided as \`${H}\``);
        O.push(...w)
    }
    if (O.length > 0) A = `${q} failed due to the following ${O.length>1?"issues":"issue"}:
${O.join(`
`)}`;
    return A
}
// @from(Ln 385214, Col 4)
sb6 = L(() => {
    m8();
    _7()
})
// @from(Ln 385218, Col 0)
async function* Kd8(q, K, _, z, Y, A, O, w, $) {
    let j = Date.now();
    try {
        let J = q.getAppState().toolPermissionContext.mode,
            X = A;
        for await (let M of d58(K.name, _, Y, X, q, J, q.abortController.signal)) try {
            if (M.message?.type === "attachment" && M.message.attachment.type === "hook_cancelled") {
                d("tengu_post_tool_hooks_cancelled", {
                    toolName: PK(K.name),
                    queryChainId: q.queryTracking?.chainId,
                    queryDepth: q.queryTracking?.depth
                }), yield {
                    message: Y4({
                        type: "hook_cancelled",
                        hookName: `PostToolUse:${K.name}`,
                        toolUseID: _,
                        hookEvent: "PostToolUse"
                    })
                };
                continue
            }
            if (M.message && !(M.message.type === "attachment" && M.message.attachment.type === "hook_blocking_error")) yield {
                message: M.message
            };
            if (M.blockingError) yield {
                message: Y4({
                    type: "hook_blocking_error",
                    hookName: `PostToolUse:${K.name}`,
                    toolUseID: _,
                    hookEvent: "PostToolUse",
                    blockingError: M.blockingError
                })
            };
            if (M.preventContinuation) {
                yield {
                    message: Y4({
                        type: "hook_stopped_continuation",
                        message: M.stopReason || "Execution stopped by PostToolUse hook",
                        hookName: `PostToolUse:${K.name}`,
                        toolUseID: _,
                        hookEvent: "PostToolUse"
                    })
                };
                return
            }
            if (M.additionalContexts && M.additionalContexts.length > 0) yield {
                message: Y4({
                    type: "hook_additional_context",
                    content: M.additionalContexts,
                    hookName: `PostToolUse:${K.name}`,
                    toolUseID: _,
                    hookEvent: "PostToolUse"
                })
            };
            if (M.updatedMCPToolOutput && yJ(K)) X = M.updatedMCPToolOutput, yield {
                updatedMCPToolOutput: X
            }
        } catch (P) {
            let W = Date.now() - j;
            d("tengu_post_tool_hook_error", {
                messageID: z,
                toolName: PK(K.name),
                isMcp: K.isMcp ?? !1,
                duration: W,
                queryChainId: q.queryTracking?.chainId,
                queryDepth: q.queryTracking?.depth,
                ...w && {
                    mcpServerType: w
                },
                ...O && {
                    requestId: O
                }
            }), yield {
                message: Y4({
                    type: "hook_error_during_execution",
                    content: Me(P),
                    hookName: `PostToolUse:${K.name}`,
                    toolUseID: _,
                    hookEvent: "PostToolUse"
                })
            }
        }
    } catch (H) {
        j6(H)
    }
}
// @from(Ln 385304, Col 0)
async function* _d8(q, K, _, z, Y, A, O, w, $, j) {
    let H = Date.now();
    try {
        let X = q.getAppState().toolPermissionContext.mode;
        for await (let M of c58(K.name, _, Y, A, q, O, X, q.abortController.signal)) try {
            if (M.message?.type === "attachment" && M.message.attachment.type === "hook_cancelled") {
                d("tengu_post_tool_failure_hooks_cancelled", {
                    toolName: PK(K.name),
                    queryChainId: q.queryTracking?.chainId,
                    queryDepth: q.queryTracking?.depth
                }), yield {
                    message: Y4({
                        type: "hook_cancelled",
                        hookName: `PostToolUseFailure:${K.name}`,
                        toolUseID: _,
                        hookEvent: "PostToolUseFailure"
                    })
                };
                continue
            }
            if (M.message && !(M.message.type === "attachment" && M.message.attachment.type === "hook_blocking_error")) yield {
                message: M.message
            };
            if (M.blockingError) yield {
                message: Y4({
                    type: "hook_blocking_error",
                    hookName: `PostToolUseFailure:${K.name}`,
                    toolUseID: _,
                    hookEvent: "PostToolUseFailure",
                    blockingError: M.blockingError
                })
            };
            if (M.additionalContexts && M.additionalContexts.length > 0) yield {
                message: Y4({
                    type: "hook_additional_context",
                    content: M.additionalContexts,
                    hookName: `PostToolUseFailure:${K.name}`,
                    toolUseID: _,
                    hookEvent: "PostToolUseFailure"
                })
            }
        } catch (P) {
            let W = Date.now() - H;
            d("tengu_post_tool_failure_hook_error", {
                messageID: z,
                toolName: PK(K.name),
                isMcp: K.isMcp ?? !1,
                duration: W,
                queryChainId: q.queryTracking?.chainId,
                queryDepth: q.queryTracking?.depth,
                ...$ && {
                    mcpServerType: $
                },
                ...w && {
                    requestId: w
                }
            }), yield {
                message: Y4({
                    type: "hook_error_during_execution",
                    content: Me(P),
                    hookName: `PostToolUseFailure:${K.name}`,
                    toolUseID: _,
                    hookEvent: "PostToolUseFailure"
                })
            }
        }
    } catch (J) {
        j6(J)
    }
}
// @from(Ln 385374, Col 0)
async function zd8(q, K, _, z, Y, A, O) {
    let w = K.requiresUserInteraction?.(),
        $ = z.requireCanUseTool;
    if (q?.behavior === "deny") return E(`Hook denied tool use for ${K.name}`), {
        decision: q,
        input: _
    };
    if (q?.behavior !== "allow" && q?.behavior !== "ask") return {
        decision: await Y(K, _, z, A, O),
        input: _
    };
    let j = q.behavior,
        H = q.updatedInput ?? _,
        J = w && q.updatedInput !== void 0;
    if (j === "allow" && (w && !J || $)) return E(`Hook approved tool use for ${K.name}, but canUseTool is required`), {
        decision: await Y(K, H, z, A, O),
        input: H
    };
    let X = await yM6(K, H, z);
    if (X?.behavior === "deny") return E(`Hook returned '${j}' for ${K.name}, but deny rule overrides: ${X.message}`), {
        decision: X,
        input: H
    };
    if (X?.behavior === "ask") return E(`Hook returned '${j}' for ${K.name}, but ask rule/safety check requires full permission pipeline`), {
        decision: await Y(K, H, z, A, O),
        input: H
    };
    if (j === "allow") return E(J ? `Hook satisfied user interaction for ${K.name} via updatedInput` : `Hook approved tool use for ${K.name}, bypassing permission prompt`), {
        decision: q,
        input: H
    };
    return {
        decision: await Y(K, H, z, A, O, q),
        input: H
    }
}
// @from(Ln 385410, Col 0)
async function* Yd8(q, K, _, z, Y, A, O, w) {
    let $ = Date.now(),
        j, H = !1;
    try {
        let J = q.getAppState();
        for await (let X of Q58(K.name, z, _, q, J.toolPermissionContext.mode, q.abortController.signal, void 0, q.requestPrompt, K.getToolUseSummary?.(_))) try {
            if (X.message) yield {
                type: "message",
                message: {
                    message: X.message
                }
            };
            if (X.blockingError) {
                H = !0;
                let M = s57(`PreToolUse:${K.name}`, X.blockingError);
                yield {
                    type: "hookPermissionResult",
                    hookPermissionResult: {
                        behavior: "deny",
                        message: M,
                        decisionReason: {
                            type: "hook",
                            hookName: `PreToolUse:${K.name}`,
                            reason: M
                        }
                    }
                }
            }
            if (X.preventContinuation) {
                if (yield {
                        type: "preventContinuation",
                        shouldPreventContinuation: !0
                    }, X.stopReason) yield {
                    type: "stopReason",
                    stopReason: X.stopReason
                }
            }
            if (X.permissionBehavior !== void 0) {
                if (E(`Hook result has permissionBehavior=${X.permissionBehavior}`), X.permissionBehavior === "defer") {
                    j = X.hookSource || `PreToolUse:${K.name}`;
                    continue
                }
                if (X.permissionBehavior === "deny") H = !0;
                let M = {
                    type: "hook",
                    hookName: `PreToolUse:${K.name}`,
                    hookSource: X.hookSource,
                    reason: X.hookPermissionDecisionReason
                };
                if (X.permissionBehavior === "allow") yield {
                    type: "hookPermissionResult",
                    hookPermissionResult: {
                        behavior: "allow",
                        updatedInput: X.updatedInput,
                        decisionReason: M
                    }
                };
                else if (X.permissionBehavior === "ask") yield {
                    type: "hookPermissionResult",
                    hookPermissionResult: {
                        behavior: "ask",
                        updatedInput: X.updatedInput,
                        message: X.hookPermissionDecisionReason || `Hook PreToolUse:${K.name} ${r57(X.permissionBehavior)} this tool`,
                        decisionReason: M
                    }
                };
                else yield {
                    type: "hookPermissionResult",
                    hookPermissionResult: {
                        behavior: X.permissionBehavior,
                        message: X.hookPermissionDecisionReason || `Hook PreToolUse:${K.name} ${r57(X.permissionBehavior)} this tool`,
                        decisionReason: M
                    }
                }
            }
            if (X.updatedInput && X.permissionBehavior === void 0) yield {
                type: "hookUpdatedInput",
                updatedInput: X.updatedInput
            };
            if (X.additionalContexts && X.additionalContexts.length > 0) yield {
                type: "additionalContext",
                message: {
                    message: Y4({
                        type: "hook_additional_context",
                        content: X.additionalContexts,
                        hookName: `PreToolUse:${K.name}`,
                        toolUseID: z,
                        hookEvent: "PreToolUse"
                    })
                }
            };
            if (q.abortController.signal.aborted) {
                d("tengu_pre_tool_hooks_cancelled", {
                    toolName: PK(K.name),
                    queryChainId: q.queryTracking?.chainId,
                    queryDepth: q.queryTracking?.depth
                }), yield {
                    type: "message",
                    message: {
                        message: Y4({
                            type: "hook_cancelled",
                            hookName: `PreToolUse:${K.name}`,
                            toolUseID: z,
                            hookEvent: "PreToolUse"
                        })
                    }
                }, yield {
                    type: "stop"
                };
                return
            }
        } catch (M) {
            j6(M);
            let P = Date.now() - $;
            d("tengu_pre_tool_hook_error", {
                messageID: Y,
                toolName: PK(K.name),
                isMcp: K.isMcp ?? !1,
                duration: P,
                queryChainId: q.queryTracking?.chainId,
                queryDepth: q.queryTracking?.depth,
                ...O && {
                    mcpServerType: O
                },
                ...A && {
                    requestId: A
                }
            }), yield {
                type: "message",
                message: {
                    message: Y4({
                        type: "hook_error_during_execution",
                        content: Me(M),
                        hookName: `PreToolUse:${K.name}`,
                        toolUseID: z,
                        hookEvent: "PreToolUse"
                    })
                }
            }, yield {
                type: "stop"
            }
        }
    } catch (J) {
        j6(J), yield {
            type: "stop"
        };
        return
    }
    if (j && !H) yield {
        type: "defer",
        hookName: j
    }
}
// @from(Ln 385563, Col 4)
a57 = L(() => {
    C8();
    q2();
    ZM();
    K8();
    K9();
    U8();
    g$();
    sb6()
})
// @from(Ln 385577, Col 0)
function pfK(q, K) {
    return {
        error: K
    }
}
// @from(Ln 385583, Col 0)
function t57(q, K, _, z, Y) {
    let A = {},
        O = [],
        w = [...K.options.tools, ...q];
    for (let $ of q) A[$.name] = a2Y($, K, _, z, O, w, Y);
    return A
}
// @from(Ln 385591, Col 0)
function a2Y(q, K, _, z, Y, A, O) {
    let w = async ($, j) => {
        let H = j?.toolUseID ?? `repl_${o2Y()}`,
            J = (M) => {
                return Y.push({
                    id: H,
                    name: q.name,
                    input: $
                }), O?.({
                    toolUseID: H,
                    data: {
                        type: "repl_tool_call",
                        toolName: q.name,
                        toolInput: $,
                        toolUseId: H,
                        phase: "error",
                        error: M
                    }
                }), pfK(q.name, M)
            };
        O?.({
            toolUseID: H,
            data: {
                type: "repl_tool_call",
                toolName: q.name,
                toolInput: $,
                toolUseId: H,
                phase: "start"
            }
        });
        let X = $;
        try {
            let M = q.inputSchema.safeParse($);
            if (!M.success) return J(ab6(q.name, M.error));
            let P = M.data,
                W = P,
                D, Z;
            for await (let R of Yd8(K, q, P, H, z.message.id, z.requestId, void 0, void 0)) {
                if (R.type === "hookPermissionResult") D = R.hookPermissionResult;
                if (R.type === "hookUpdatedInput") W = R.updatedInput;
                if (R.type === "stopReason") Z = R.stopReason;
                if (R.type === "stop") return J(Z ?? "Blocked by PreToolUse hook")
            }
            let G = {
                    ...K,
                    options: {
                        ...K.options,
                        tools: A
                    },
                    messages: [...K.messages, ...Y.map((R) => yj({
                        content: [{
                            type: "tool_use",
                            id: R.id,
                            name: R.name,
                            input: R.input
                        }],
                        isVirtual: !0
                    }))]
                },
                f = await zd8(D, q, W, G, _, z, H),
                v = f.decision;
            if (W = f.input, v.behavior !== "allow") {
                K.onPermissionDenial?.(q, H, W);
                let R = v.behavior === "deny" ? v.message ?? "Permission denied" : "Permission denied";
                return J(`Permission denied for ${q.name}: ${R}`)
            }
            if (X = v.updatedInput ?? W, q.name === S7 && X && typeof X === "object" && "_simulatedSedEdit" in X) {
                let {
                    _simulatedSedEdit: R,
                    ...h
                } = X;
                X = h
            }
            let V = await q.call(X, {
                    ...K,
                    toolUseId: H,
                    userModified: v.userModified ?? !1,
                    fileReadingLimits: {
                        maxTokens: 1 / 0,
                        maxSizeBytes: 268435456
                    },
                    globLimits: {
                        maxResults: 25000
                    }
                }, _, z),
                k = !1;
            for await (let R of Kd8(K, q, H, z.message.id, X, V.data, z.requestId, void 0, void 0)) k = !0;
            if (k) qd8(q.name, H, X, K.readFileState);
            let N = V.data;
            if (q.isMcp && Array.isArray(V.data)) {
                let R = V.data.filter((h) => h != null && typeof h === "object" && ("type" in h) && h.type === "text" && ("text" in h) && typeof h.text === "string").map((h) => h.text);
                if (R.length === V.data.length && R.length > 0) {
                    let h = R.join(`
`);
                    try {
                        N = JSON.parse(h)
                    } catch {
                        N = h
                    }
                }
            }
            return Y.push({
                id: H,
                name: q.name,
                input: X
            }), O?.({
                toolUseID: H,
                data: {
                    type: "repl_tool_call",
                    toolName: q.name,
                    toolInput: X,
                    toolUseId: H,
                    phase: "complete",
                    result: N
                }
            }), N
        } catch (M) {
            let P = Me(M),
                W = uw8(M);
            for await (let D of _d8(K, q, H, z.message.id, X, P, W, z.requestId, void 0, void 0));
            if (O?.({
                    toolUseID: H,
                    data: {
                        type: "repl_tool_call",
                        toolName: q.name,
                        toolInput: X,
                        toolUseId: H,
                        phase: "error",
                        error: P
                    }
                }), q.name === S7 && M instanceof JV && M.hadSandboxViolation && $?.dangerouslyDisableSandbox !== !0 && Z7.isSandboxingEnabled() && Z7.areUnsandboxedCommandsAllowed()) return E("REPL Bash sandbox violation — auto-retrying unsandboxed"), w({
                ...$,
                dangerouslyDisableSandbox: !0
            }, {
                toolUseID: H
            });
            return Y.push({
                id: H,
                name: q.name,
                input: X
            }), pfK(q.name, P)
        }
    };
    return w
}
// @from(Ln 385736, Col 4)
FfK = L(() => {
    i57();
    a57();
    K8();
    m8();
    _7();
    yY();
    sb6()
})
// @from(Ln 385751, Col 0)
function K$Y() {
    let q = [],
        K = [],
        _ = 0;

    function z(A, O) {
        if (_ >= gfK) return;
        if (_ += O.length, A.push(O), _ >= gfK) A.push("[console output truncated at 50MB]")
    }

    function Y(A) {
        return A.map((O) => {
            if (typeof O === "string") return O;
            try {
                return I6(O, null, 2)
            } catch {
                return String(O)
            }
        }).join(" ")
    }
    return {
        log: (...A) => z(q, Y(A)),
        info: (...A) => z(q, Y(A)),
        debug: (...A) => z(q, Y(A)),
        error: (...A) => z(K, Y(A)),
        warn: (...A) => z(K, Y(A)),
        getStdout: () => q.join(`
`),
        getStderr: () => K.join(`
`),
        clear: () => {
            q.length = 0, K.length = 0, _ = 0
        }
    }
}
// @from(Ln 385787, Col 0)
function Ad8(q) {
    Object.setPrototypeOf(q, null);
    try {
        delete q.constructor, delete q.prototype
    } catch {}
    return q
}