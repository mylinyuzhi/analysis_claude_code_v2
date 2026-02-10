
// @from(Ln 351021, Col 4)
Wg1 = R((pzH, eU4) => {
    eU4.exports = tU4;
    var aU4 = $W6(),
        sU4 = _W6(),
        iRY = WW6(),
        GW6 = F_(),
        nRY = iP6();

    function tU4(A) {
        this.contextObject = A
    }
    var rRY = {
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
    tU4.prototype = {
        hasFeature: function(q, K) {
            var Y = rRY[(q || "").toLowerCase()];
            return Y && Y[K || ""] || !1
        },
        createDocumentType: function(q, K, Y) {
            if (!nRY.isValidQName(q)) GW6.InvalidCharacterError();
            return new sU4(this.contextObject, q, K, Y)
        },
        createDocument: function(q, K, Y) {
            var z = new aU4(!1, null),
                w;
            if (K) w = z.createElementNS(q, K);
            else w = null;
            if (Y) z.appendChild(Y);
            if (w) z.appendChild(w);
            if (q === GW6.NAMESPACE.HTML) z._contentType = "application/xhtml+xml";
            else if (q === GW6.NAMESPACE.SVG) z._contentType = "image/svg+xml";
            else z._contentType = "application/xml";
            return z
        },
        createHTMLDocument: function(q) {
            var K = new aU4(!0, null);
            K.appendChild(new sU4(K, "html"));
            var Y = K.createElement("html");
            K.appendChild(Y);
            var z = K.createElement("head");
            if (Y.appendChild(z), q !== void 0) {
                var w = K.createElement("title");
                z.appendChild(w), w.appendChild(K.createTextNode(q))
            }
            return Y.appendChild(K.createElement("body")), K.modclock = 1, K
        },
        mozSetOutputMutationHandler: function(A, q) {
            A.mutationHandler = q
        },
        mozGetInputMutationHandler: function(A) {
            GW6.nyi()
        },
        mozHTMLParser: iRY
    }
})
// @from(Ln 351095, Col 4)
qp4 = R((dzH, Ap4) => {
    var oRY = KW6(),
        aRY = FLA();
    Ap4.exports = tLA;

    function tLA(A, q) {
        this._window = A, this._href = q
    }
    tLA.prototype = Object.create(aRY.prototype, {
        constructor: {
            value: tLA
        },
        href: {
            get: function() {
                return this._href
            },
            set: function(A) {
                this.assign(A)
            }
        },
        assign: {
            value: function(A) {
                var q = new oRY(this._href),
                    K = q.resolve(A);
                this._href = K
            }
        },
        replace: {
            value: function(A) {
                this.assign(A)
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
// @from(Ln 351139, Col 4)
Yp4 = R((czH, Kp4) => {
    var sRY = Object.create(null, {
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
    Kp4.exports = sRY
})
// @from(Ln 351176, Col 4)
wp4 = R((lzH, zp4) => {
    var tRY = {
        setTimeout,
        clearTimeout,
        setInterval,
        clearInterval
    };
    zp4.exports = tRY
})
// @from(Ln 351185, Col 4)
ARA = R((Gg1, Hp4) => {
    var eLA = F_();
    Gg1 = Hp4.exports = {
        CSSStyleDeclaration: YW6(),
        CharacterData: $g1(),
        Comment: ELA(),
        DOMException: UP6(),
        DOMImplementation: Wg1(),
        DOMTokenList: $LA(),
        Document: $W6(),
        DocumentFragment: LLA(),
        DocumentType: _W6(),
        Element: IW1(),
        HTMLParser: WW6(),
        NamedNodeMap: jLA(),
        Node: XP(),
        NodeList: k51(),
        NodeFilter: Xg1(),
        ProcessingInstruction: yLA(),
        Text: TLA(),
        Window: qRA()
    };
    eLA.merge(Gg1, mLA());
    eLA.merge(Gg1, wW6().elements);
    eLA.merge(Gg1, dLA().elements)
})
// @from(Ln 351211, Col 4)
qRA = R((izH, $p4) => {
    var eRY = Wg1(),
        AyY = lkA(),
        qyY = qp4(),
        Zg1 = F_();
    $p4.exports = ZW6;

    function ZW6(A) {
        this.document = A || new eRY(null).createHTMLDocument(""), this.document._scripting_enabled = !0, this.document.defaultView = this, this.location = new qyY(this, this.document._address || "about:blank")
    }
    ZW6.prototype = Object.create(AyY.prototype, {
        console: {
            value: console
        },
        history: {
            value: {
                back: Zg1.nyi,
                forward: Zg1.nyi,
                go: Zg1.nyi
            }
        },
        navigator: {
            value: Yp4()
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
            set: function(A) {
                this._setEventHandler("load", A)
            }
        },
        getComputedStyle: {
            value: function(q) {
                return q.style
            }
        }
    });
    Zg1.expose(wp4(), ZW6);
    Zg1.expose(ARA(), ZW6)
})
// @from(Ln 351286, Col 4)
Dp4 = R((KyY) => {
    var Op4 = Wg1(),
        _p4 = WW6(),
        nzH = qRA(),
        Jp4 = ARA();
    KyY.createDOMImplementation = function() {
        return new Op4(null)
    };
    KyY.createDocument = function(A, q) {
        if (A || q) {
            var K = new _p4;
            return K.parse(A || "", !0), K.document()
        }
        return new Op4(null).createHTMLDocument("")
    };
    KyY.createIncrementalHTMLParser = function() {
        var A = new _p4;
        return {
            write: function(q) {
                if (q.length > 0) A.parse(q, !1, function() {
                    return !0
                })
            },
            end: function(q) {
                A.parse(q || "", !0, function() {
                    return !0
                })
            },
            process: function(q) {
                return A.parse("", !1, q)
            },
            document: function() {
                return A.document()
            }
        }
    };
    KyY.createWindow = function(A, q) {
        var K = KyY.createDocument(A);
        if (q !== void 0) K._address = q;
        return new Jp4.Window(K)
    };
    KyY.impl = Jp4
})
// @from(Ln 351329, Col 4)
Ep4 = R((ozH, vp4) => {
    function $yY(A) {
        for (var q = 1; q < arguments.length; q++) {
            var K = arguments[q];
            for (var Y in K)
                if (K.hasOwnProperty(Y)) A[Y] = K[Y]
        }
        return A
    }

    function wRA(A, q) {
        return Array(q + 1).join(A)
    }

    function OyY(A) {
        return A.replace(/^\n*/, "")
    }

    function _yY(A) {
        var q = A.length;
        while (q > 0 && A[q - 1] === `
`) q--;
        return A.substring(0, q)
    }
    var JyY = ["ADDRESS", "ARTICLE", "ASIDE", "AUDIO", "BLOCKQUOTE", "BODY", "CANVAS", "CENTER", "DD", "DIR", "DIV", "DL", "DT", "FIELDSET", "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "FRAMESET", "H1", "H2", "H3", "H4", "H5", "H6", "HEADER", "HGROUP", "HR", "HTML", "ISINDEX", "LI", "MAIN", "MENU", "NAV", "NOFRAMES", "NOSCRIPT", "OL", "OUTPUT", "P", "PRE", "SECTION", "TABLE", "TBODY", "TD", "TFOOT", "TH", "THEAD", "TR", "UL"];

    function HRA(A) {
        return $RA(A, JyY)
    }
    var Pp4 = ["AREA", "BASE", "BR", "COL", "COMMAND", "EMBED", "HR", "IMG", "INPUT", "KEYGEN", "LINK", "META", "PARAM", "SOURCE", "TRACK", "WBR"];

    function Wp4(A) {
        return $RA(A, Pp4)
    }

    function XyY(A) {
        return Zp4(A, Pp4)
    }
    var Gp4 = ["A", "TABLE", "THEAD", "TBODY", "TFOOT", "TH", "TD", "IFRAME", "SCRIPT", "AUDIO", "VIDEO"];

    function DyY(A) {
        return $RA(A, Gp4)
    }

    function jyY(A) {
        return Zp4(A, Gp4)
    }

    function $RA(A, q) {
        return q.indexOf(A.nodeName) >= 0
    }

    function Zp4(A, q) {
        return A.getElementsByTagName && q.some(function(K) {
            return A.getElementsByTagName(K).length
        })
    }
    var qG = {};
    qG.paragraph = {
        filter: "p",
        replacement: function(A) {
            return `

` + A + `

`
        }
    };
    qG.lineBreak = {
        filter: "br",
        replacement: function(A, q, K) {
            return K.br + `
`
        }
    };
    qG.heading = {
        filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
        replacement: function(A, q, K) {
            var Y = Number(q.nodeName.charAt(1));
            if (K.headingStyle === "setext" && Y < 3) {
                var z = wRA(Y === 1 ? "=" : "-", A.length);
                return `

` + A + `
` + z + `

`
            } else return `

` + wRA("#", Y) + " " + A + `

`
        }
    };
    qG.blockquote = {
        filter: "blockquote",
        replacement: function(A) {
            return A = A.replace(/^\n+|\n+$/g, ""), A = A.replace(/^/gm, "> "), `

` + A + `

`
        }
    };
    qG.list = {
        filter: ["ul", "ol"],
        replacement: function(A, q) {
            var K = q.parentNode;
            if (K.nodeName === "LI" && K.lastElementChild === q) return `
` + A;
            else return `

` + A + `

`
        }
    };
    qG.listItem = {
        filter: "li",
        replacement: function(A, q, K) {
            A = A.replace(/^\n+/, "").replace(/\n+$/, `
`).replace(/\n/gm, `
    `);
            var Y = K.bulletListMarker + "   ",
                z = q.parentNode;
            if (z.nodeName === "OL") {
                var w = z.getAttribute("start"),
                    H = Array.prototype.indexOf.call(z.children, q);
                Y = (w ? Number(w) + H : H + 1) + ".  "
            }
            return Y + A + (q.nextSibling && !/\n$/.test(A) ? `
` : "")
        }
    };
    qG.indentedCodeBlock = {
        filter: function(A, q) {
            return q.codeBlockStyle === "indented" && A.nodeName === "PRE" && A.firstChild && A.firstChild.nodeName === "CODE"
        },
        replacement: function(A, q, K) {
            return `

    ` + q.firstChild.textContent.replace(/\n/g, `
    `) + `

`
        }
    };
    qG.fencedCodeBlock = {
        filter: function(A, q) {
            return q.codeBlockStyle === "fenced" && A.nodeName === "PRE" && A.firstChild && A.firstChild.nodeName === "CODE"
        },
        replacement: function(A, q, K) {
            var Y = q.firstChild.getAttribute("class") || "",
                z = (Y.match(/language-(\S+)/) || [null, ""])[1],
                w = q.firstChild.textContent,
                H = K.fence.charAt(0),
                $ = 3,
                O = new RegExp("^" + H + "{3,}", "gm"),
                _;
            while (_ = O.exec(w))
                if (_[0].length >= $) $ = _[0].length + 1;
            var J = wRA(H, $);
            return `

` + J + z + `
` + w.replace(/\n$/, "") + `
` + J + `

`
        }
    };
    qG.horizontalRule = {
        filter: "hr",
        replacement: function(A, q, K) {
            return `

` + K.hr + `

`
        }
    };
    qG.inlineLink = {
        filter: function(A, q) {
            return q.linkStyle === "inlined" && A.nodeName === "A" && A.getAttribute("href")
        },
        replacement: function(A, q) {
            var K = q.getAttribute("href");
            if (K) K = K.replace(/([()])/g, "\\$1");
            var Y = fW6(q.getAttribute("title"));
            if (Y) Y = ' "' + Y.replace(/"/g, "\\\"") + '"';
            return "[" + A + "](" + K + Y + ")"
        }
    };
    qG.referenceLink = {
        filter: function(A, q) {
            return q.linkStyle === "referenced" && A.nodeName === "A" && A.getAttribute("href")
        },
        replacement: function(A, q, K) {
            var Y = q.getAttribute("href"),
                z = fW6(q.getAttribute("title"));
            if (z) z = ' "' + z + '"';
            var w, H;
            switch (K.linkReferenceStyle) {
                case "collapsed":
                    w = "[" + A + "][]", H = "[" + A + "]: " + Y + z;
                    break;
                case "shortcut":
                    w = "[" + A + "]", H = "[" + A + "]: " + Y + z;
                    break;
                default:
                    var $ = this.references.length + 1;
                    w = "[" + A + "][" + $ + "]", H = "[" + $ + "]: " + Y + z
            }
            return this.references.push(H), w
        },
        references: [],
        append: function(A) {
            var q = "";
            if (this.references.length) q = `

` + this.references.join(`
`) + `

`, this.references = [];
            return q
        }
    };
    qG.emphasis = {
        filter: ["em", "i"],
        replacement: function(A, q, K) {
            if (!A.trim()) return "";
            return K.emDelimiter + A + K.emDelimiter
        }
    };
    qG.strong = {
        filter: ["strong", "b"],
        replacement: function(A, q, K) {
            if (!A.trim()) return "";
            return K.strongDelimiter + A + K.strongDelimiter
        }
    };
    qG.code = {
        filter: function(A) {
            var q = A.previousSibling || A.nextSibling,
                K = A.parentNode.nodeName === "PRE" && !q;
            return A.nodeName === "CODE" && !K
        },
        replacement: function(A) {
            if (!A) return "";
            A = A.replace(/\r?\n|\r/g, " ");
            var q = /^`|^ .*?[^ ].* $|`$/.test(A) ? " " : "",
                K = "`",
                Y = A.match(/`+/gm) || [];
            while (Y.indexOf(K) !== -1) K = K + "`";
            return K + q + A + q + K
        }
    };
    qG.image = {
        filter: "img",
        replacement: function(A, q) {
            var K = fW6(q.getAttribute("alt")),
                Y = q.getAttribute("src") || "",
                z = fW6(q.getAttribute("title")),
                w = z ? ' "' + z + '"' : "";
            return Y ? "![" + K + "](" + Y + w + ")" : ""
        }
    };

    function fW6(A) {
        return A ? A.replace(/(\n+\s*)+/g, `
`) : ""
    }

    function fp4(A) {
        this.options = A, this._keep = [], this._remove = [], this.blankRule = {
            replacement: A.blankReplacement
        }, this.keepReplacement = A.keepReplacement, this.defaultRule = {
            replacement: A.defaultReplacement
        }, this.array = [];
        for (var q in A.rules) this.array.push(A.rules[q])
    }
    fp4.prototype = {
        add: function(A, q) {
            this.array.unshift(q)
        },
        keep: function(A) {
            this._keep.unshift({
                filter: A,
                replacement: this.keepReplacement
            })
        },
        remove: function(A) {
            this._remove.unshift({
                filter: A,
                replacement: function() {
                    return ""
                }
            })
        },
        forNode: function(A) {
            if (A.isBlank) return this.blankRule;
            var q;
            if (q = KRA(this.array, A, this.options)) return q;
            if (q = KRA(this._keep, A, this.options)) return q;
            if (q = KRA(this._remove, A, this.options)) return q;
            return this.defaultRule
        },
        forEach: function(A) {
            for (var q = 0; q < this.array.length; q++) A(this.array[q], q)
        }
    };

    function KRA(A, q, K) {
        for (var Y = 0; Y < A.length; Y++) {
            var z = A[Y];
            if (MyY(z, q, K)) return z
        }
        return
    }

    function MyY(A, q, K) {
        var Y = A.filter;
        if (typeof Y === "string") {
            if (Y === q.nodeName.toLowerCase()) return !0
        } else if (Array.isArray(Y)) {
            if (Y.indexOf(q.nodeName.toLowerCase()) > -1) return !0
        } else if (typeof Y === "function") {
            if (Y.call(A, q, K)) return !0
        } else throw TypeError("`filter` needs to be a string, array, or function")
    }

    function PyY(A) {
        var {
            element: q,
            isBlock: K,
            isVoid: Y
        } = A, z = A.isPre || function(X) {
            return X.nodeName === "PRE"
        };
        if (!q.firstChild || z(q)) return;
        var w = null,
            H = !1,
            $ = null,
            O = jp4($, q, z);
        while (O !== q) {
            if (O.nodeType === 3 || O.nodeType === 4) {
                var _ = O.data.replace(/[ \r\n\t]+/g, " ");
                if ((!w || / $/.test(w.data)) && !H && _[0] === " ") _ = _.substr(1);
                if (!_) {
                    O = YRA(O);
                    continue
                }
                O.data = _, w = O
            } else if (O.nodeType === 1) {
                if (K(O) || O.nodeName === "BR") {
                    if (w) w.data = w.data.replace(/ $/, "");
                    w = null, H = !1
                } else if (Y(O) || z(O)) w = null, H = !0;
                else if (w) H = !1
            } else {
                O = YRA(O);
                continue
            }
            var J = jp4($, O, z);
            $ = O, O = J
        }
        if (w) {
            if (w.data = w.data.replace(/ $/, ""), !w.data) YRA(w)
        }
    }

    function YRA(A) {
        var q = A.nextSibling || A.parentNode;
        return A.parentNode.removeChild(A), q
    }

    function jp4(A, q, K) {
        if (A && A.parentNode === q || K(q)) return q.nextSibling || q.parentNode;
        return q.firstChild || q.nextSibling || q.parentNode
    }
    var Vp4 = typeof window < "u" ? window : {};

    function WyY() {
        var A = Vp4.DOMParser,
            q = !1;
        try {
            if (new A().parseFromString("", "text/html")) q = !0
        } catch (K) {}
        return q
    }

    function GyY() {
        var A = function() {};
        {
            var q = Dp4();
            A.prototype.parseFromString = function(K) {
                return q.createDocument(K)
            }
        }
        return A
    }
    var ZyY = WyY() ? Vp4.DOMParser : GyY();

    function fyY(A, q) {
        var K;
        if (typeof A === "string") {
            var Y = VyY().parseFromString('<x-turndown id="turndown-root">' + A + "</x-turndown>", "text/html");
            K = Y.getElementById("turndown-root")
        } else K = A.cloneNode(!0);
        return PyY({
            element: K,
            isBlock: HRA,
            isVoid: Wp4,
            isPre: q.preformattedCode ? NyY : null
        }), K
    }
    var zRA;

    function VyY() {
        return zRA = zRA || new ZyY, zRA
    }

    function NyY(A) {
        return A.nodeName === "PRE" || A.nodeName === "CODE"
    }

    function TyY(A, q) {
        return A.isBlock = HRA(A), A.isCode = A.nodeName === "CODE" || A.parentNode.isCode, A.isBlank = vyY(A), A.flankingWhitespace = EyY(A, q), A
    }

    function vyY(A) {
        return !Wp4(A) && !DyY(A) && /^\s*$/i.test(A.textContent) && !XyY(A) && !jyY(A)
    }

    function EyY(A, q) {
        if (A.isBlock || q.preformattedCode && A.isCode) return {
            leading: "",
            trailing: ""
        };
        var K = kyY(A.textContent);
        if (K.leadingAscii && Mp4("left", A, q)) K.leading = K.leadingNonAscii;
        if (K.trailingAscii && Mp4("right", A, q)) K.trailing = K.trailingNonAscii;
        return {
            leading: K.leading,
            trailing: K.trailing
        }
    }

    function kyY(A) {
        var q = A.match(/^(([ \t\r\n]*)(\s*))(?:(?=\S)[\s\S]*\S)?((\s*?)([ \t\r\n]*))$/);
        return {
            leading: q[1],
            leadingAscii: q[2],
            leadingNonAscii: q[3],
            trailing: q[4],
            trailingNonAscii: q[5],
            trailingAscii: q[6]
        }
    }

    function Mp4(A, q, K) {
        var Y, z, w;
        if (A === "left") Y = q.previousSibling, z = / $/;
        else Y = q.nextSibling, z = /^ /;
        if (Y) {
            if (Y.nodeType === 3) w = z.test(Y.nodeValue);
            else if (K.preformattedCode && Y.nodeName === "CODE") w = !1;
            else if (Y.nodeType === 1 && !HRA(Y)) w = z.test(Y.textContent)
        }
        return w
    }
    var LyY = Array.prototype.reduce,
        RyY = [
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

    function VW6(A) {
        if (!(this instanceof VW6)) return new VW6(A);
        var q = {
            rules: qG,
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
            blankReplacement: function(K, Y) {
                return Y.isBlock ? `

` : ""
            },
            keepReplacement: function(K, Y) {
                return Y.isBlock ? `

` + Y.outerHTML + `

` : Y.outerHTML
            },
            defaultReplacement: function(K, Y) {
                return Y.isBlock ? `

` + K + `

` : K
            }
        };
        this.options = $yY({}, q, A), this.rules = new fp4(this.options)
    }
    VW6.prototype = {
        turndown: function(A) {
            if (!SyY(A)) throw TypeError(A + " is not a string, or an element/document/fragment node.");
            if (A === "") return "";
            var q = Np4.call(this, new fyY(A, this.options));
            return yyY.call(this, q)
        },
        use: function(A) {
            if (Array.isArray(A))
                for (var q = 0; q < A.length; q++) this.use(A[q]);
            else if (typeof A === "function") A(this);
            else throw TypeError("plugin must be a Function or an Array of Functions");
            return this
        },
        addRule: function(A, q) {
            return this.rules.add(A, q), this
        },
        keep: function(A) {
            return this.rules.keep(A), this
        },
        remove: function(A) {
            return this.rules.remove(A), this
        },
        escape: function(A) {
            return RyY.reduce(function(q, K) {
                return q.replace(K[0], K[1])
            }, A)
        }
    };

    function Np4(A) {
        var q = this;
        return LyY.call(A.childNodes, function(K, Y) {
            Y = new TyY(Y, q.options);
            var z = "";
            if (Y.nodeType === 3) z = Y.isCode ? Y.nodeValue : q.escape(Y.nodeValue);
            else if (Y.nodeType === 1) z = CyY.call(q, Y);
            return Tp4(K, z)
        }, "")
    }

    function yyY(A) {
        var q = this;
        return this.rules.forEach(function(K) {
            if (typeof K.append === "function") A = Tp4(A, K.append(q.options))
        }), A.replace(/^[\t\r\n]+/, "").replace(/[\t\r\n\s]+$/, "")
    }

    function CyY(A) {
        var q = this.rules.forNode(A),
            K = Np4.call(this, A),
            Y = A.flankingWhitespace;
        if (Y.leading || Y.trailing) K = K.trim();
        return Y.leading + q.replacement(K, A, this.options) + Y.trailing
    }

    function Tp4(A, q) {
        var K = _yY(A),
            Y = OyY(q),
            z = Math.max(A.length - K.length, q.length - Y.length),
            w = `

`.substring(0, z);
        return K + w + Y
    }

    function SyY(A) {
        return A != null && (typeof A === "string" || A.nodeType && (A.nodeType === 1 || A.nodeType === 9 || A.nodeType === 11))
    }
    vp4.exports = VW6
})
// @from(Ln 351925, Col 4)
NW6
// @from(Ln 351926, Col 4)
ORA = v(() => {
    NW6 = new Set(["platform.claude.com", "code.claude.com", "modelcontextprotocol.io", "github.com/anthropics", "agentskills.io", "docs.python.org", "en.cppreference.com", "docs.oracle.com", "learn.microsoft.com", "developer.mozilla.org", "go.dev", "pkg.go.dev", "www.php.net", "docs.swift.org", "kotlinlang.org", "ruby-doc.org", "doc.rust-lang.org", "www.typescriptlang.org", "react.dev", "angular.io", "vuejs.org", "nextjs.org", "expressjs.com", "nodejs.org", "bun.sh", "jquery.com", "getbootstrap.com", "tailwindcss.com", "d3js.org", "threejs.org", "redux.js.org", "webpack.js.org", "jestjs.io", "reactrouter.com", "docs.djangoproject.com", "flask.palletsprojects.com", "fastapi.tiangolo.com", "pandas.pydata.org", "numpy.org", "www.tensorflow.org", "pytorch.org", "scikit-learn.org", "matplotlib.org", "requests.readthedocs.io", "jupyter.org", "laravel.com", "symfony.com", "wordpress.org", "docs.spring.io", "hibernate.org", "tomcat.apache.org", "gradle.org", "maven.apache.org", "asp.net", "dotnet.microsoft.com", "nuget.org", "blazor.net", "reactnative.dev", "docs.flutter.dev", "developer.apple.com", "developer.android.com", "keras.io", "spark.apache.org", "huggingface.co", "www.kaggle.com", "www.mongodb.com", "redis.io", "www.postgresql.org", "dev.mysql.com", "www.sqlite.org", "graphql.org", "prisma.io", "docs.aws.amazon.com", "cloud.google.com", "learn.microsoft.com", "kubernetes.io", "www.docker.com", "www.terraform.io", "www.ansible.com", "vercel.com/docs", "docs.netlify.com", "devcenter.heroku.com/", "cypress.io", "selenium.dev", "docs.unity.com", "docs.unrealengine.com", "git-scm.com", "nginx.org", "httpd.apache.org"])
})
// @from(Ln 351930, Col 0)
function Rp4(A) {
    try {
        let q = new URL(A),
            K = q.hostname,
            Y = q.pathname;
        for (let z of NW6)
            if (z.includes("/")) {
                let [w, ...H] = z.split("/"), $ = "/" + H.join("/");
                if (K === w && Y.startsWith($)) return !0
            } else if (K === z) return !0;
        return !1
    } catch {
        return !1
    }
}
// @from(Ln 351946, Col 0)
function uyY(A) {
    if (A.length > xyY) return !1;
    let q;
    try {
        q = new URL(A)
    } catch {
        return !1
    }
    if (q.username || q.password) return !1;
    if (q.hostname.split(".").length < 2) return !1;
    return !0
}
// @from(Ln 351958, Col 0)
async function ByY(A) {
    try {
        let q = await sA.get(`https://api.anthropic.com/api/web/domain_info?domain=${encodeURIComponent(A)}`);
        if (q.status === 200) return q.data.can_fetch === !0 ? {
            status: "allowed"
        } : {
            status: "blocked"
        };
        return {
            status: "check_failed",
            error: Error(`Domain check returned status ${q.status}`)
        }
    } catch (q) {
        return K1(q), {
            status: "check_failed",
            error: q
        }
    }
}
// @from(Ln 351978, Col 0)
function myY(A, q) {
    try {
        let K = new URL(A),
            Y = new URL(q);
        if (Y.protocol !== K.protocol) return !1;
        if (Y.port !== K.port) return !1;
        if (Y.username || Y.password) return !1;
        let z = ($) => $.replace(/^www\./, ""),
            w = z(K.hostname),
            H = z(Y.hostname);
        return w === H
    } catch (K) {
        return !1
    }
}
// @from(Ln 351993, Col 0)
async function yp4(A, q, K) {
    try {
        return await sA.get(A, {
            signal: q,
            maxRedirects: 0,
            responseType: "arraybuffer",
            maxContentLength: byY,
            headers: {
                Accept: "text/markdown, text/html, */*"
            }
        })
    } catch (Y) {
        if (sA.isAxiosError(Y) && Y.response && [301, 302, 307, 308].includes(Y.response.status)) {
            let z = Y.response.headers.location;
            if (!z) throw Error("Redirect missing Location header");
            let w = new URL(z, A).toString();
            if (K(A, w)) return yp4(w, q, K);
            else return {
                type: "redirect",
                originalUrl: A,
                redirectUrl: w,
                statusCode: Y.response.status
            }
        }
        throw Y
    }
}
// @from(Ln 352021, Col 0)
function FyY(A) {
    return "type" in A && A.type === "redirect"
}
// @from(Ln 352024, Col 0)
async function Cp4(A, q) {
    if (!uyY(A)) throw Error("Invalid URL");
    let K = kp4.get(A);
    if (K) return {
        bytes: K.bytes,
        code: K.code,
        codeText: K.codeText,
        content: K.content,
        contentType: K.contentType
    };
    let Y, z = A;
    try {
        if (Y = new URL(A), Y.protocol === "http:") Y.protocol = "https:", z = Y.toString();
        let J = Y.hostname;
        if (!C8().skipWebFetchPreflight) switch ((await ByY(J)).status) {
            case "allowed":
                break;
            case "blocked":
                throw new _RA(J);
            case "check_failed":
                throw new JRA(J)
        }
    } catch (J) {
        if (K1(J), J instanceof _RA || J instanceof JRA) throw J
    }
    let w = await yp4(z, q.signal, myY);
    if (FyY(w)) return w;
    let H = Buffer.from(w.data).toString("utf-8"),
        $ = w.headers["content-type"] ?? "",
        O = Buffer.byteLength(H),
        _;
    if ($.includes("text/html")) _ = new Lp4.default().turndown(H);
    else _ = H;
    return kp4.set(A, {
        bytes: O,
        code: w.status,
        codeText: w.statusText,
        content: _,
        contentType: $
    }), {
        code: w.status,
        codeText: w.statusText,
        content: _,
        contentType: $,
        bytes: O
    }
}
// @from(Ln 352071, Col 0)
async function Sp4(A, q, K, Y, z) {
    let w = q.length > TW6 ? q.slice(0, TW6) + `

[Content truncated due to length...]` : q,
        H = Ue8(w, A, z),
        $ = await SX({
            systemPrompt: [],
            userPrompt: H,
            signal: K,
            options: {
                querySource: "web_fetch_apply",
                agents: [],
                isNonInteractiveSession: Y,
                hasAppendSystemPrompt: !1,
                mcpTools: []
            }
        });
    if (K.aborted) throw new dz;
    let {
        content: O
    } = $.message;
    if (O.length > 0) {
        let _ = O[0];
        if ("text" in _) return _.text
    }
    return "No response from model"
}
// @from(Ln 352098, Col 4)
Lp4
// @from(Ln 352098, Col 9)
_RA
// @from(Ln 352098, Col 14)
JRA
// @from(Ln 352098, Col 19)
hyY = 900000
// @from(Ln 352099, Col 4)
IyY = 52428800
// @from(Ln 352100, Col 4)
kp4
// @from(Ln 352100, Col 9)
xyY = 2000
// @from(Ln 352101, Col 4)
byY = 10485760
// @from(Ln 352102, Col 4)
TW6 = 1e5
// @from(Ln 352103, Col 4)
hp4 = v(() => {
    y5();
    kw1();
    yw();
    u6();
    qH();
    y6();
    p8();
    ORA();
    Lp4 = o(Ep4(), 1);
    _RA = class _RA extends Error {
        constructor(A) {
            super(`Claude Code is unable to fetch from ${A}`);
            this.name = "DomainBlockedError"
        }
    };
    JRA = class JRA extends Error {
        constructor(A) {
            super(`Unable to verify if domain ${A} is safe to fetch. This may be due to network restrictions or enterprise security policies blocking claude.ai.`);
            this.name = "DomainCheckFailedError"
        }
    };
    kp4 = new ZT({
        maxSize: IyY,
        sizeCalculation: (A) => Buffer.byteLength(A.content),
        ttl: hyY
    })
})
// @from(Ln 352132, Col 0)
function Ip4({
    url: A,
    prompt: q
}, {
    verbose: K
}) {
    if (!A) return null;
    if (K) return `url: "${A}"${K&&q?`, prompt: "${q}"`:""}`;
    return A
}
// @from(Ln 352143, Col 0)
function xp4() {
    return vN.default.createElement(Y9, null)
}
// @from(Ln 352147, Col 0)
function bp4(A, {
    verbose: q
}) {
    return vN.default.createElement(z5, {
        result: A,
        verbose: q
    })
}
// @from(Ln 352156, Col 0)
function up4() {
    return vN.default.createElement(HA, {
        height: 1
    }, vN.default.createElement(V, {
        dimColor: !0
    }, "Fetching…"))
}
// @from(Ln 352164, Col 0)
function Bp4({
    bytes: A,
    code: q,
    codeText: K,
    result: Y
}, z, {
    verbose: w
}) {
    let H = L2(A);
    if (w) return vN.default.createElement(I, {
        flexDirection: "column"
    }, vN.default.createElement(HA, {
        height: 1
    }, vN.default.createElement(V, null, "Received ", vN.default.createElement(V, {
        bold: !0
    }, H), " (", q, " ", K, ")")), vN.default.createElement(I, {
        flexDirection: "column"
    }, vN.default.createElement(V, null, Y)));
    return vN.default.createElement(HA, {
        height: 1
    }, vN.default.createElement(V, null, "Received ", vN.default.createElement(V, {
        bold: !0
    }, H), " (", q, " ", K, ")"))
}
// @from(Ln 352189, Col 0)
function XRA(A) {
    if (!A?.url) return null;
    return DY(A.url, sS)
}
// @from(Ln 352193, Col 4)
vN
// @from(Ln 352194, Col 4)
mp4 = v(() => {
    m1();
    eq();
    CX();
    UO();
    wq();
    vq();
    vN = o(X1(), 1)
})
// @from(Ln 352204, Col 0)
function UyY(A) {
    try {
        let q = Vj.inputSchema.safeParse(A);
        if (!q.success) return `input:${A.toString()}`;
        let {
            url: K
        } = q.data;
        return `domain:${new URL(K).hostname}`
    } catch {
        return `input:${A.toString()}`
    }
}
// @from(Ln 352217, Col 0)
function Fp4(A) {
    return [{
        type: "addRules",
        destination: "localSettings",
        rules: [{
            toolName: xO,
            ruleContent: A
        }],
        behavior: "allow"
    }]
}
// @from(Ln 352228, Col 4)
QyY
// @from(Ln 352228, Col 9)
gyY
// @from(Ln 352228, Col 14)
Vj
// @from(Ln 352229, Col 4)
gW1 = v(() => {
    i7();
    la();
    hp4();
    PJ();
    ORA();
    mp4();
    QyY = z7(() => u.strictObject({
        url: u.string().url().describe("The URL to fetch content from"),
        prompt: u.string().describe("The prompt to run on the fetched content")
    })), gyY = z7(() => u.object({
        bytes: u.number().describe("Size of the fetched content in bytes"),
        code: u.number().describe("HTTP response code"),
        codeText: u.string().describe("HTTP response code text"),
        result: u.string().describe("Processed result from applying the prompt to the content"),
        durationMs: u.number().describe("Time taken to fetch and process the content"),
        url: u.string().describe("The URL that was fetched")
    }));
    Vj = {
        name: xO,
        maxResultSizeChars: 1e5,
        async description(A) {
            let {
                url: q
            } = A;
            try {
                return `Claude wants to fetch content from ${new URL(q).hostname}`
            } catch {
                return "Claude wants to fetch content from this URL"
            }
        },
        userFacingName() {
            return "Fetch"
        },
        getToolUseSummary: XRA,
        getActivityDescription(A) {
            let q = XRA(A);
            return q ? `Fetching ${q}` : "Fetching web page"
        },
        isEnabled() {
            return !0
        },
        get inputSchema() {
            return QyY()
        },
        get outputSchema() {
            return gyY()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        async checkPermissions(A, q) {
            let Y = (await q.getAppState()).toolPermissionContext;
            try {
                let {
                    url: O
                } = A, _ = new URL(O), J = _.hostname, X = _.pathname;
                for (let D of NW6)
                    if (D.includes("/")) {
                        let [j, ...M] = D.split("/"), P = "/" + M.join("/");
                        if (J === j && X.startsWith(P)) return {
                            behavior: "allow",
                            updatedInput: A,
                            decisionReason: {
                                type: "other",
                                reason: "Preapproved host and path"
                            }
                        }
                    } else if (J === D) return {
                    behavior: "allow",
                    updatedInput: A,
                    decisionReason: {
                        type: "other",
                        reason: "Preapproved host"
                    }
                }
            } catch {}
            let z = UyY(A),
                w = XI(Y, Vj, "deny").get(z);
            if (w) return {
                behavior: "deny",
                message: `${Vj.name} denied access to ${z}.`,
                decisionReason: {
                    type: "rule",
                    rule: w
                }
            };
            let H = XI(Y, Vj, "ask").get(z);
            if (H) return {
                behavior: "ask",
                message: `Claude requested permissions to use ${Vj.name}, but you haven't granted it yet.`,
                decisionReason: {
                    type: "rule",
                    rule: H
                },
                suggestions: Fp4(z)
            };
            let $ = XI(Y, Vj, "allow").get(z);
            if ($) return {
                behavior: "allow",
                updatedInput: A,
                decisionReason: {
                    type: "rule",
                    rule: $
                }
            };
            return {
                behavior: "ask",
                message: `Claude requested permissions to use ${Vj.name}, but you haven't granted it yet.`,
                suggestions: Fp4(z)
            }
        },
        async prompt({
            tools: A
        }) {
            if (A.some((q) => q.name === dM)) return `IMPORTANT: WebFetch WILL FAIL for authenticated or private URLs. Before using this tool, check if the URL points to an authenticated service (e.g. Google Docs, Confluence, Jira, GitHub). If so, you MUST use ${dM} first to find a specialized tool that provides authenticated access.
${c8A}`;
            return c8A
        },
        async validateInput(A) {
            let {
                url: q
            } = A;
            try {
                new URL(q)
            } catch {
                return {
                    result: !1,
                    message: `Error: Invalid URL "${q}". The URL provided could not be parsed.`,
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
        renderToolUseMessage: Ip4,
        renderToolUseRejectedMessage: xp4,
        renderToolUseErrorMessage: bp4,
        renderToolUseProgressMessage: up4,
        renderToolResultMessage: Bp4,
        async call({
            url: A,
            prompt: q
        }, {
            abortController: K,
            options: {
                isNonInteractiveSession: Y
            }
        }) {
            let z = Date.now(),
                w = await Cp4(A, K);
            if ("type" in w && w.type === "redirect") {
                let M = w.statusCode === 301 ? "Moved Permanently" : w.statusCode === 308 ? "Permanent Redirect" : w.statusCode === 307 ? "Temporary Redirect" : "Found",
                    P = `REDIRECT DETECTED: The URL redirects to a different host.

Original URL: ${w.originalUrl}
Redirect URL: ${w.redirectUrl}
Status: ${w.statusCode} ${M}

To complete your request, I need to fetch content from the redirected URL. Please use WebFetch again with these parameters:
- url: "${w.redirectUrl}"
- prompt: "${q}"`;
                return {
                    data: {
                        bytes: Buffer.byteLength(P),
                        code: w.statusCode,
                        codeText: M,
                        result: P,
                        durationMs: Date.now() - z,
                        url: A
                    }
                }
            }
            let {
                content: H,
                bytes: $,
                code: O,
                codeText: _,
                contentType: J
            } = w, X = Rp4(A), D;
            if (X && J.includes("text/markdown") && H.length < TW6) D = H;
            else D = await Sp4(q, H, K.signal, Y, X);
            return {
                data: {
                    bytes: $,
                    code: O,
                    codeText: _,
                    result: D,
                    durationMs: Date.now() - z,
                    url: A
                }
            }
        },
        mapToolResultToToolResultBlockParam({
            result: A
        }, q) {
            return {
                tool_use_id: q,
                type: "tool_result",
                content: A
            }
        }
    }
})
// @from(Ln 352441, Col 0)
function Up4() {
    return ""
}
// @from(Ln 352445, Col 0)
function pp4() {
    return null
}
// @from(Ln 352449, Col 0)
function dp4() {
    return fg1.default.createElement(Y9, null)
}
// @from(Ln 352453, Col 0)
function cp4(A, {
    verbose: q
}) {
    return fg1.default.createElement(z5, {
        result: A,
        verbose: q
    })
}
// @from(Ln 352462, Col 0)
function pyY(A) {
    let q = A.split(`
`),
        K = A;
    if (q.length > Qp4) K = q.slice(0, Qp4).join(`
`);
    if (UA(K) > gp4) K = B_1(K, gp4);
    return K.trim()
}
// @from(Ln 352472, Col 0)
function lp4(A, q, {
    verbose: K
}) {
    if (KY()) return null;
    let Y = A.command ?? "",
        z = K ? Y : pyY(Y);
    return fg1.default.createElement(HA, null, fg1.default.createElement(V, null, z, z !== Y ? "… · stopped" : " · stopped"))
}
// @from(Ln 352480, Col 4)
fg1
// @from(Ln 352480, Col 9)
Qp4 = 2
// @from(Ln 352481, Col 4)
gp4 = 160
// @from(Ln 352482, Col 4)
ip4 = v(() => {
    m1();
    LY();
    vq();
    CX();
    UO();
    eq();
    cM();
    fg1 = o(X1(), 1)
})
// @from(Ln 352492, Col 4)
dyY
// @from(Ln 352492, Col 9)
cyY
// @from(Ln 352492, Col 14)
vW6
// @from(Ln 352493, Col 4)
DRA = v(() => {
    i7();
    jRA();
    ip4();
    m6();
    kK1();
    cM();
    dyY = z7(() => u.strictObject({
        task_id: u.string().optional().describe("The ID of the background task to stop"),
        shell_id: u.string().optional().describe("Deprecated: use task_id instead")
    })), cyY = z7(() => u.object({
        message: u.string().describe("Status message about the operation"),
        task_id: u.string().describe("The ID of the task that was stopped"),
        task_type: u.string().describe("The type of the task that was stopped"),
        command: u.string().optional().describe("The command or description of the stopped task")
    })), vW6 = {
        name: bj1,
        aliases: ["KillShell"],
        maxResultSizeChars: 1e5,
        userFacingName: () => KY() ? "" : "Stop Task",
        get inputSchema() {
            return dyY()
        },
        get outputSchema() {
            return cyY()
        },
        isEnabled() {
            return !0
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !1
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        async validateInput({
            task_id: A,
            shell_id: q
        }, {
            getAppState: K
        }) {
            let Y = A ?? q;
            if (!Y) return {
                result: !1,
                message: "Missing required parameter: task_id",
                errorCode: 1
            };
            let w = (await K()).tasks?.[Y];
            if (!w) return {
                result: !1,
                message: `No task found with ID: ${Y}`,
                errorCode: 1
            };
            if (!Vg1(w.type)) return {
                result: !1,
                message: `Task ${Y} has unsupported type: ${w.type}`,
                errorCode: 2
            };
            if (w.status !== "running") return {
                result: !1,
                message: `Task ${Y} is not running (status: ${w.status})`,
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
            return mp7
        },
        mapToolResultToToolResultBlockParam(A, q) {
            return {
                tool_use_id: q,
                type: "tool_result",
                content: Q1(A)
            }
        },
        renderToolUseMessage: Up4,
        renderToolUseProgressMessage: pp4,
        renderToolUseRejectedMessage: dp4,
        renderToolUseErrorMessage: cp4,
        renderToolResultMessage: lp4,
        async call({
            task_id: A,
            shell_id: q
        }, {
            getAppState: K,
            setAppState: Y,
            abortController: z
        }) {
            let w = A ?? q;
            if (!w) throw Error("Missing required parameter: task_id");
            let $ = (await K()).tasks?.[w];
            if (!$) throw Error(`No task found with ID: ${w}`);
            if ($.status !== "running") throw Error(`Task ${w} is not running, so cannot be stopped (status: ${$.status})`);
            let O = Vg1($.type);
            if (!O) throw Error(`Unsupported task type: ${$.type}`);
            await O.kill(w, {
                abortController: z,
                getAppState: K,
                setAppState: Y
            }), Y((J) => {
                let X = J.tasks[w];
                if (!X || X.notified) return J;
                return {
                    ...J,
                    tasks: {
                        ...J.tasks,
                        [w]: {
                            ...X,
                            notified: !0
                        }
                    }
                }
            });
            let _ = oB($) ? $.command : $.description;
            return {
                data: {
                    message: `Successfully stopped task: ${w} (${_})`,
                    task_id: w,
                    task_type: $.type,
                    command: _
                }
            }
        }
    }
})
// @from(Ln 352630, Col 0)
function lyY() {
    let A = IcA.validate(process.env.TASK_MAX_OUTPUT_LENGTH);
    if (A.status === "capped") h(`TASK_MAX_OUTPUT_LENGTH ${A.message}`);
    return A.effective
}
// @from(Ln 352636, Col 0)
function Ng1(A, q) {
    let K = lyY();
    if (A.length <= K) return {
        content: A,
        wasTruncated: !1
    };
    let z = `[Truncated. Full output: ${ww(q)}]

`,
        w = K - z.length,
        H = A.slice(-w);
    return {
        content: z + H,
        wasTruncated: !0
    }
}
// @from(Ln 352652, Col 4)
MRA = v(() => {
    aV1();
    hZ();
    Z6()
})
// @from(Ln 352658, Col 0)
function EW6(A) {
    let q = M_6(A.id),
        K = {
            task_id: A.id,
            task_type: A.type,
            status: A.status,
            description: A.description,
            output: q
        };
    if (A.type === "local_bash") return {
        ...K,
        exitCode: A.result?.code ?? null
    };
    if (A.type === "local_agent") {
        let Y = A;
        return {
            ...K,
            prompt: Y.prompt,
            result: q,
            error: Y.error
        }
    }
    if (A.type === "remote_agent") return {
        ...K,
        prompt: A.command
    };
    return K
}
// @from(Ln 352686, Col 0)
async function nyY(A, q, K, Y) {
    let z = Date.now();
    while (Date.now() - z < K) {
        if (Y?.signal.aborted) throw new dz;
        let $ = (await q()).tasks?.[A];
        if (!$) return null;
        if ($.status !== "running" && $.status !== "pending") return $;
        await new Promise((O) => setTimeout(O, 100))
    }
    return (await q()).tasks?.[A] ?? null
}
// @from(Ln 352698, Col 0)
function ryY(A) {
    let q = e(56),
        {
            content: K,
            verbose: Y,
            theme: z
        } = A,
        w = Y === void 0 ? !1 : Y,
        H = RK("app:toggleTranscript", "Global", "ctrl+o"),
        $;
    if (q[0] !== K) $ = typeof K === "string" ? _A(K) : K, q[0] = K, q[1] = $;
    else $ = q[1];
    let O = $;
    if (!O.task) {
        let j;
        if (q[2] === Symbol.for("react.memo_cache_sentinel")) j = H9.default.createElement(HA, null, H9.default.createElement(V, {
            dimColor: !0
        }, "No task output available")), q[2] = j;
        else j = q[2];
        return j
    }
    let {
        task: _
    } = O;
    if (_.task_type === "local_bash") {
        let j;
        if (q[3] !== _.error || q[4] !== _.output) j = {
            stdout: _.output,
            stderr: "",
            isImage: !1,
            dangerouslyDisableSandbox: !0,
            returnCodeInterpretation: _.error
        }, q[3] = _.error, q[4] = _.output, q[5] = j;
        else j = q[5];
        let M = j,
            P;
        if (q[6] !== M || q[7] !== w) P = H9.default.createElement(q51, {
            content: M,
            verbose: w
        }), q[6] = M, q[7] = w, q[8] = P;
        else P = q[8];
        return P
    }
    if (_.task_type === "local_agent") {
        let j;
        if (q[9] !== _.result) j = _.result ? _.result.split(`
`).length : 0, q[9] = _.result, q[10] = j;
        else j = q[10];
        let M = j;
        if (O.retrieval_status === "success") {
            if (w) {
                let G;
                if (q[11] !== M || q[12] !== _.description) G = H9.default.createElement(V, null, _.description, " (", M, " lines)"), q[11] = M, q[12] = _.description, q[13] = G;
                else G = q[13];
                let f;
                if (q[14] !== _.prompt || q[15] !== z) f = _.prompt && H9.default.createElement(fQ1, {
                    prompt: _.prompt,
                    theme: z,
                    dim: !0
                }), q[14] = _.prompt, q[15] = z, q[16] = f;
                else f = q[16];
                let Z;
                if (q[17] !== _.result || q[18] !== z) Z = _.result && H9.default.createElement(I, {
                    marginTop: 1
                }, H9.default.createElement(nvA, {
                    content: [{
                        type: "text",
                        text: _.result
                    }],
                    theme: z
                })), q[17] = _.result, q[18] = z, q[19] = Z;
                else Z = q[19];
                let N;
                if (q[20] !== _.error) N = _.error && H9.default.createElement(I, {
                    flexDirection: "column",
                    marginTop: 1
                }, H9.default.createElement(V, {
                    color: "error",
                    bold: !0
                }, "Error:"), H9.default.createElement(I, {
                    paddingLeft: 2
                }, H9.default.createElement(V, {
                    color: "error"
                }, _.error))), q[20] = _.error, q[21] = N;
                else N = q[21];
                let T;
                if (q[22] !== f || q[23] !== Z || q[24] !== N) T = H9.default.createElement(I, {
                    flexDirection: "column",
                    paddingLeft: 2,
                    marginTop: 1
                }, f, Z, N), q[22] = f, q[23] = Z, q[24] = N, q[25] = T;
                else T = q[25];
                let k;
                if (q[26] !== G || q[27] !== T) k = H9.default.createElement(I, {
                    flexDirection: "column"
                }, G, T), q[26] = G, q[27] = T, q[28] = k;
                else k = q[28];
                return k
            }
            let W;
            if (q[29] !== H) W = H9.default.createElement(HA, null, H9.default.createElement(V, {
                dimColor: !0
            }, "Read output (", H, " to expand)")), q[29] = H, q[30] = W;
            else W = q[30];
            return W
        }
        if (O.retrieval_status === "timeout" || _.status === "running") {
            let W;
            if (q[31] === Symbol.for("react.memo_cache_sentinel")) W = H9.default.createElement(HA, null, H9.default.createElement(V, {
                dimColor: !0
            }, "Task is still running…")), q[31] = W;
            else W = q[31];
            return W
        }
        if (O.retrieval_status === "not_ready") {
            let W;
            if (q[32] === Symbol.for("react.memo_cache_sentinel")) W = H9.default.createElement(HA, null, H9.default.createElement(V, {
                dimColor: !0
            }, "Task is still running…")), q[32] = W;
            else W = q[32];
            return W
        }
        let P;
        if (q[33] === Symbol.for("react.memo_cache_sentinel")) P = H9.default.createElement(HA, null, H9.default.createElement(V, {
            dimColor: !0
        }, "Task not ready")), q[33] = P;
        else P = q[33];
        return P
    }
    if (_.task_type === "remote_agent") {
        let j;
        if (q[34] !== _.description || q[35] !== _.status) j = H9.default.createElement(V, null, "  ", _.description, " [", _.status, "]"), q[34] = _.description, q[35] = _.status, q[36] = j;
        else j = q[36];
        let M;
        if (q[37] !== _.output || q[38] !== w) M = _.output && w && H9.default.createElement(I, {
            paddingLeft: 4,
            marginTop: 1
        }, H9.default.createElement(V, null, _.output)), q[37] = _.output, q[38] = w, q[39] = M;
        else M = q[39];
        let P;
        if (q[40] !== H || q[41] !== _.output || q[42] !== w) P = !w && _.output && H9.default.createElement(V, {
            dimColor: !0
        }, "     ", "(", H, " to expand)"), q[40] = H, q[41] = _.output, q[42] = w, q[43] = P;
        else P = q[43];
        let W;
        if (q[44] !== j || q[45] !== M || q[46] !== P) W = H9.default.createElement(I, {
            flexDirection: "column"
        }, j, M, P), q[44] = j, q[45] = M, q[46] = P, q[47] = W;
        else W = q[47];
        return W
    }
    let J;
    if (q[48] !== _.description || q[49] !== _.status) J = H9.default.createElement(V, null, "  ", _.description, " [", _.status, "]"), q[48] = _.description, q[49] = _.status, q[50] = J;
    else J = q[50];
    let X;
    if (q[51] !== _.output) X = _.output && H9.default.createElement(I, {
        paddingLeft: 4
    }, H9.default.createElement(V, null, _.output.slice(0, 500))), q[51] = _.output, q[52] = X;
    else X = q[52];
    let D;
    if (q[53] !== J || q[54] !== X) D = H9.default.createElement(I, {
        flexDirection: "column"
    }, J, X), q[53] = J, q[54] = X, q[55] = D;
    else D = q[55];
    return D
}
// @from(Ln 352864, Col 4)
H9
// @from(Ln 352864, Col 8)
iyY
// @from(Ln 352864, Col 13)
kW6
// @from(Ln 352865, Col 4)
PRA = v(() => {
    i1();
    i7();
    m1();
    qH();
    CX();
    UO();
    eq();
    hZ();
    GR();
    PM6();
    hM6();
    m6();
    MRA();
    s2();
    H9 = o(X1(), 1), iyY = z7(() => u.strictObject({
        task_id: u.string().describe("The task ID to get output from"),
        block: u.boolean().default(!0).describe("Whether to wait for completion"),
        timeout: u.number().min(0).max(600000).default(30000).describe("Max wait time in ms")
    }));
    kW6 = {
        name: uj1,
        maxResultSizeChars: 1e5,
        aliases: ["AgentOutputTool", "BashOutputTool"],
        userFacingName() {
            return "Task Output"
        },
        get inputSchema() {
            return iyY()
        },
        async description() {
            return "Retrieves output from a running or completed task"
        },
        isConcurrencySafe(A) {
            return this.isReadOnly(A)
        },
        isEnabled() {
            return !0
        },
        isReadOnly(A) {
            return !0
        },
        async checkPermissions(A, q) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        async prompt() {
            return `- Retrieves output from a running or completed task (background shell, agent, or remote session)
- Takes a task_id parameter identifying the task
- Returns the task output along with status information
- Use block=true (default) to wait for task completion
- Use block=false for non-blocking check of current status
- Task IDs can be found using the /tasks command
- Works with all task types: background shells, async agents, and remote sessions`
        },
        async validateInput({
            task_id: A
        }, {
            getAppState: q
        }) {
            if (!A) return {
                result: !1,
                message: "Task ID is required",
                errorCode: 1
            };
            if (!(await q()).tasks?.[A]) return {
                result: !1,
                message: `No task found with ID: ${A}`,
                errorCode: 2
            };
            return {
                result: !0
            }
        },
        async call(A, q, K, Y, z) {
            let {
                task_id: w,
                block: H,
                timeout: $
            } = A, _ = (await q.getAppState()).tasks?.[w];
            if (!_) throw Error(`No task found with ID: ${w}`);
            if (!H) {
                if (_.status !== "running" && _.status !== "pending") return c5(w, q.setAppState, (X) => ({
                    ...X,
                    notified: !0
                })), {
                    data: {
                        retrieval_status: "success",
                        task: EW6(_)
                    }
                };
                return {
                    data: {
                        retrieval_status: "not_ready",
                        task: EW6(_)
                    }
                }
            }
            if (z) z({
                toolUseID: `task-output-waiting-${Date.now()}`,
                data: {
                    type: "waiting_for_task",
                    taskDescription: _.description,
                    taskType: _.type
                }
            });
            let J = await nyY(w, q.getAppState, $, q.abortController);
            if (!J) return {
                data: {
                    retrieval_status: "timeout",
                    task: null
                }
            };
            if (J.status === "running" || J.status === "pending") return {
                data: {
                    retrieval_status: "timeout",
                    task: EW6(J)
                }
            };
            return c5(w, q.setAppState, (X) => ({
                ...X,
                notified: !0
            })), {
                data: {
                    retrieval_status: "success",
                    task: EW6(J)
                }
            }
        },
        mapToolResultToToolResultBlockParam(A, q) {
            let K = [];
            if (K.push(`<retrieval_status>${A.retrieval_status}</retrieval_status>`), A.task) {
                if (K.push(`<task_id>${A.task.task_id}</task_id>`), K.push(`<task_type>${A.task.task_type}</task_type>`), K.push(`<status>${A.task.status}</status>`), A.task.exitCode !== void 0 && A.task.exitCode !== null) K.push(`<exit_code>${A.task.exitCode}</exit_code>`);
                if (A.task.output?.trim()) {
                    let {
                        content: Y
                    } = Ng1(A.task.output, A.task.task_id);
                    K.push(`<output>
${Y.trimEnd()}
</output>`)
                }
                if (A.task.error) K.push(`<error>${A.task.error}</error>`)
            }
            return {
                tool_use_id: q,
                type: "tool_result",
                content: K.join(`

`)
            }
        },
        renderToolUseMessage(A) {
            let {
                block: q = !0
            } = A;
            if (!q) return "non-blocking";
            return ""
        },
        renderToolUseTag(A) {
            if (!A.task_id) return null;
            return H9.default.createElement(V, {
                dimColor: !0
            }, " ", A.task_id)
        },
        renderToolUseProgressMessage(A) {
            let K = A[A.length - 1]?.data;
            return H9.default.createElement(I, {
                flexDirection: "column"
            }, K?.taskDescription && H9.default.createElement(V, null, "  ", K.taskDescription), H9.default.createElement(V, null, "     Waiting for task", " ", H9.default.createElement(V, {
                dimColor: !0
            }, "(esc to give additional instructions)")))
        },
        renderToolResultMessage(A, q, {
            verbose: K,
            theme: Y
        }) {
            return H9.default.createElement(ryY, {
                content: A,
                verbose: K,
                theme: Y
            })
        },
        renderToolUseRejectedMessage() {
            return H9.default.createElement(Y9, null)
        },
        renderToolUseErrorMessage(A, {
            verbose: q
        }) {
            return H9.default.createElement(z5, {
                result: A,
                verbose: q
            })
        }
    }
})
// @from(Ln 353063, Col 0)
function oyY(A) {
    let q = 0,
        K = 0;
    for (let Y of A)
        if (typeof Y !== "string") q++, K += Y.content.length;
    return {
        searchCount: q,
        totalResultCount: K
    }
}
// @from(Ln 353074, Col 0)
function np4({
    query: A,
    allowed_domains: q,
    blocked_domains: K
}, {
    verbose: Y
}) {
    if (!A) return null;
    let z = "";
    if (A) z += `"${A}"`;
    if (Y) {
        if (q && q.length > 0) z += `, only allowing domains: ${q.join(", ")}`;
        if (K && K.length > 0) z += `, blocking domains: ${K.join(", ")}`
    }
    return z
}
// @from(Ln 353091, Col 0)
function rp4() {
    return hm.default.createElement(Y9, null)
}
// @from(Ln 353095, Col 0)
function op4(A, {
    verbose: q
}) {
    return hm.default.createElement(z5, {
        result: A,
        verbose: q
    })
}
// @from(Ln 353104, Col 0)
function ap4(A) {
    if (A.length === 0) return null;
    let q = A[A.length - 1];
    if (!q?.data) return null;
    let K = q.data;
    switch (K.type) {
        case "query_update":
            return hm.default.createElement(HA, null, hm.default.createElement(V, {
                dimColor: !0
            }, "Searching: ", K.query));
        case "search_results_received":
            return hm.default.createElement(HA, null, hm.default.createElement(V, {
                dimColor: !0
            }, "Found ", K.resultCount, ' results for "', K.query, '"'));
        default:
            return null
    }
}
// @from(Ln 353123, Col 0)
function sp4(A) {
    let {
        searchCount: q
    } = oyY(A.results), K = A.durationSeconds >= 1 ? `${Math.round(A.durationSeconds)}s` : `${Math.round(A.durationSeconds*1000)}ms`;
    return hm.default.createElement(I, {
        justifyContent: "space-between",
        width: "100%"
    }, hm.default.createElement(HA, {
        height: 1
    }, hm.default.createElement(V, null, "Did ", q, " search", q !== 1 ? "es" : "", " in ", K)))
}
// @from(Ln 353135, Col 0)
function WRA(A) {
    if (!A?.query) return null;
    return DY(A.query, sS)
}
// @from(Ln 353139, Col 4)
hm
// @from(Ln 353140, Col 4)
tp4 = v(() => {
    m1();
    eq();
    CX();
    UO();
    vq();
    hm = o(X1(), 1)
})
// @from(Ln 353149, Col 0)
function qCY(A, q, K) {
    let Y = [],
        z = "",
        w = !0;
    for (let H of A) {
        if (H.type === "server_tool_use") {
            if (w) {
                if (w = !1, z.trim().length > 0) Y.push(z.trim());
                z = ""
            }
            continue
        }
        if (H.type === "web_search_tool_result") {
            if (!Array.isArray(H.content)) {
                let O = `Web search error: ${H.content.error_code}`;
                K1(Error(O)), Y.push(O);
                continue
            }
            let $ = H.content.map((O) => ({
                title: O.title,
                url: O.url
            }));
            Y.push({
                tool_use_id: H.tool_use_id,
                content: $
            })
        }
        if (H.type === "text")
            if (w) z += H.text;
            else w = !0, z = H.text
    }
    if (z.length) Y.push(z.trim());
    return {
        query: q,
        results: Y,
        durationSeconds: K
    }
}
// @from(Ln 353187, Col 4)
ayY
// @from(Ln 353187, Col 9)
syY
// @from(Ln 353187, Col 14)
tyY
// @from(Ln 353187, Col 19)
eyY
// @from(Ln 353187, Col 24)
ACY = (A) => {
        return {
            type: "web_search_20250305",
            name: "web_search",
            allowed_domains: A.allowed_domains,
            blocked_domains: A.blocked_domains,
            max_uses: 8
        }
    }
// @from(Ln 353196, Col 4)
LW6
// @from(Ln 353197, Col 4)
GRA = v(() => {
    i7();
    t81();
    yw();
    N8();
    e7();
    U4();
    UH();
    y6();
    tp4();
    m6();
    ayY = z7(() => u.strictObject({
        query: u.string().min(2).describe("The search query to use"),
        allowed_domains: u.array(u.string()).optional().describe("Only include search results from these domains"),
        blocked_domains: u.array(u.string()).optional().describe("Never include search results from these domains")
    })), syY = u.object({
        title: u.string().describe("The title of the search result"),
        url: u.string().describe("The URL of the search result")
    }), tyY = u.object({
        tool_use_id: u.string().describe("ID of the tool use"),
        content: u.array(syY).describe("Array of search hits")
    }), eyY = z7(() => u.object({
        query: u.string().describe("The search query that was executed"),
        results: u.array(u.union([tyY, u.string()])).describe("Search results and/or text commentary from the model"),
        durationSeconds: u.number().describe("Time taken to complete the search operation")
    }));
    LW6 = {
        name: JL,
        maxResultSizeChars: 1e5,
        async description(A) {
            return `Claude wants to search the web for: ${A.query}`
        },
        userFacingName() {
            return "Web Search"
        },
        getToolUseSummary: WRA,
        getActivityDescription(A) {
            let q = WRA(A);
            return q ? `Searching for ${q}` : "Searching the web"
        },
        isEnabled() {
            let A = E4(),
                q = l3();
            if (A === "firstParty") return !0;
            if (A === "vertex") return q.includes("claude-opus-4") || q.includes("claude-sonnet-4") || q.includes("claude-haiku-4");
            if (A === "foundry") return !0;
            return !1
        },
        get inputSchema() {
            return ayY()
        },
        get outputSchema() {
            return eyY()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        async checkPermissions(A) {
            return {
                behavior: "passthrough",
                message: "WebSearchTool requires permission."
            }
        },
        async prompt() {
            return O17()
        },
        renderToolUseMessage: np4,
        renderToolUseRejectedMessage: rp4,
        renderToolUseErrorMessage: op4,
        renderToolUseProgressMessage: ap4,
        renderToolResultMessage: sp4,
        async validateInput(A) {
            let {
                query: q,
                allowed_domains: K,
                blocked_domains: Y
            } = A;
            if (!q.length) return {
                result: !1,
                message: "Error: Missing query",
                errorCode: 1
            };
            if (K?.length && Y?.length) return {
                result: !1,
                message: "Error: Cannot specify both allowed_domains and blocked_domains in the same request",
                errorCode: 2
            };
            return {
                result: !0
            }
        },
        async call(A, q, K, Y, z) {
            let w = performance.now(),
                {
                    query: H
                } = A,
                $ = c6({
                    content: "Perform a web search for the query: " + H
                }),
                O = ACY(A),
                _ = x8("tengu_plum_vx3", !1),
                J = await q.getAppState(),
                X = UW1({
                    messages: [$],
                    systemPrompt: ["You are an assistant for performing a web search tool use"],
                    maxThinkingTokens: _ ? 0 : q.options.maxThinkingTokens,
                    tools: [],
                    signal: q.abortController.signal,
                    options: {
                        getToolPermissionContext: async () => J.toolPermissionContext,
                        model: _ ? _J() : q.options.mainLoopModel,
                        toolChoice: _ ? {
                            type: "tool",
                            name: "web_search"
                        } : void 0,
                        isNonInteractiveSession: q.options.isNonInteractiveSession,
                        hasAppendSystemPrompt: !!q.options.appendSystemPrompt,
                        extraToolSchemas: [O],
                        querySource: "web_search_tool",
                        agents: q.options.agentDefinitions.activeAgents,
                        mcpTools: [],
                        agentId: q.agentId,
                        effortValue: J.effortValue
                    }
                }),
                D = [],
                j = null,
                M = "",
                P = 0,
                W = new Map;
            for await (let k of X) {
                if (D.push(k), k.type === "stream_event" && k.event?.type === "content_block_start") {
                    let y = k.event.content_block;
                    if (y && y.type === "server_tool_use") {
                        j = y.id, M = "";
                        continue
                    }
                }
                if (j && k.type === "stream_event" && k.event?.type === "content_block_delta") {
                    let y = k.event.delta;
                    if (y?.type === "input_json_delta" && y.partial_json) {
                        M += y.partial_json;
                        try {
                            let B = M.match(/"query"\s*:\s*"((?:[^"\\]|\\.)*)"/);
                            if (B && B[1]) {
                                let S = _A('"' + B[1] + '"');
                                if (!W.has(j) || W.get(j) !== S) {
                                    if (W.set(j, S), P++, z) z({
                                        toolUseID: `search-progress-${P}`,
                                        data: {
                                            type: "query_update",
                                            query: S
                                        }
                                    })
                                }
                            }
                        } catch {}
                    }
                }
                if (k.type === "stream_event" && k.event?.type === "content_block_start") {
                    let y = k.event.content_block;
                    if (y && y.type === "web_search_tool_result") {
                        let B = y.tool_use_id,
                            S = W.get(B) || H,
                            m = y.content;
                        if (P++, z) z({
                            toolUseID: B || `search-progress-${P}`,
                            data: {
                                type: "search_results_received",
                                resultCount: Array.isArray(m) ? m.length : 0,
                                query: S
                            }
                        })
                    }
                }
            }
            let f = D.filter((k) => k.type === "assistant").flatMap((k) => k.message.content),
                N = (performance.now() - w) / 1000;
            return {
                data: qCY(f, H, N)
            }
        },
        mapToolResultToToolResultBlockParam(A, q) {
            let {
                query: K,
                results: Y
            } = A, z = `Web search results for query: "${K}"

`;
            return Y.forEach((w) => {
                if (typeof w === "string") z += w + `

`;
                else if (w.content.length > 0) z += `Links: ${Q1(w.content)}

`;
                else z += `No links found.

`
            }), z += `
REMINDER: You MUST include the sources above in your response to the user using markdown hyperlinks.`, {
                tool_use_id: q,
                type: "tool_result",
                content: z.trim()
            }
        }
    }
})
// @from(Ln 353408, Col 4)
ep4 = `Use this tool when you are in plan mode and have finished writing your plan to the plan file and are ready for user approval.

## How This Tool Works
- You should have already written your plan to the plan file specified in the plan mode system message
- This tool does NOT take the plan content as a parameter - it will read the plan from the file you wrote
- This tool simply signals that you're done planning and ready for the user to review and approve
- The user will see the contents of your plan file when they review it

## When to Use This Tool
IMPORTANT: Only use this tool when the task requires planning the implementation steps of a task that requires writing code. For research tasks where you're gathering information, searching files, reading files or in general trying to understand the codebase - do NOT use this tool.

## Before Using This Tool
Ensure your plan is complete and unambiguous:
- If you have unresolved questions about requirements or approach, use AskUserQuestion first (in earlier phases)
- Once your plan is finalized, use THIS tool to request approval

**Important:** Do NOT use AskUserQuestion to ask "Is this plan okay?" or "Should I proceed?" - that's exactly what THIS tool does. ExitPlanMode inherently requests user approval of your plan.

## Examples

1. Initial task: "Search for and understand the implementation of vim mode in the codebase" - Do not use the exit plan mode tool because you are not planning the implementation steps of a task.
2. Initial task: "Help me implement yank mode for vim" - Use the exit plan mode tool after you have finished planning the implementation steps of the task.
3. Initial task: "Add a new feature to handle user authentication" - If unsure about auth method (OAuth, JWT, etc.), use AskUserQuestion first, then use exit plan mode tool after clarifying the approach.
`
// @from(Ln 353433, Col 0)
function Ad4() {
    return null
}
// @from(Ln 353437, Col 0)
function qd4() {
    return null
}
// @from(Ln 353441, Col 0)
function Kd4(A, q, {
    theme: K
}) {
    let {
        plan: Y,
        filePath: z,
        pushToRemote: w,
        remoteSessionUrl: H
    } = A, $ = !Y || Y.trim() === "", O = z ? L3(z) : "", _ = A.awaitingLeaderApproval;
    if ($) return Dq.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, Dq.createElement(I, {
        flexDirection: "row"
    }, Dq.createElement(V, {
        color: cP("plan")
    }, gY), Dq.createElement(V, null, " Exited plan mode")));
    if (w && H) return Dq.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, Dq.createElement(I, {
        flexDirection: "row"
    }, Dq.createElement(V, {
        color: cP("plan")
    }, gY), Dq.createElement(V, null, " Pushed plan to Claude Code on the web")), Dq.createElement(HA, null, Dq.createElement(I, {
        flexDirection: "column"
    }, Dq.createElement(V, {
        dimColor: !0
    }, "This task is now running in the background."), Dq.createElement(V, {
        dimColor: !0
    }, "Monitor it with /tasks or at ", H))));
    if (_) return Dq.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, Dq.createElement(I, {
        flexDirection: "row"
    }, Dq.createElement(V, {
        color: cP("plan")
    }, gY), Dq.createElement(V, null, " Plan submitted for team lead approval")), Dq.createElement(HA, null, Dq.createElement(I, {
        flexDirection: "column"
    }, z && Dq.createElement(V, {
        dimColor: !0
    }, "Plan file: ", O), Dq.createElement(V, {
        dimColor: !0
    }, "Waiting for team lead to review and approve..."))));
    return Dq.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, Dq.createElement(I, {
        flexDirection: "row"
    }, Dq.createElement(V, {
        color: cP("plan")
    }, gY), Dq.createElement(V, null, " User approved Claude's plan")), Dq.createElement(HA, null, Dq.createElement(I, {
        flexDirection: "column"
    }, z && Dq.createElement(V, {
        dimColor: !0
    }, "Plan saved to: ", O, " · /plan to edit"), Dq.createElement(TJ, null, Y))))
}
// @from(Ln 353500, Col 0)
function Yd4({
    plan: A
}, {
    theme: q
}) {
    let K = A ?? pD() ?? "No plan found";
    return Dq.createElement(I, {
        flexDirection: "column"
    }, Dq.createElement(HX6, {
        plan: K
    }))
}
// @from(Ln 353513, Col 0)
function zd4() {
    return null
}
// @from(Ln 353516, Col 4)
Dq
// @from(Ln 353517, Col 4)
wd4 = v(() => {
    m1();
    uh();
    eq();
    jW();
    $WA();
    oj();
    mX();
    wq();
    Dq = o(X1(), 1)
})
// @from(Ln 353529, Col 0)
function Hd4(A, q) {
    for (let K of Object.values(q.tasks))
        if (pO(K) && K.identity.agentName === A) return K.id;
    return
}
// @from(Ln 353535, Col 0)
function $d4(A, q, K) {
    c5(A, q, (Y) => ({
        ...Y,
        awaitingPlanApproval: K
    }))
}
// @from(Ln 353541, Col 4)
Od4 = v(() => {
    H$();
    GR()
})
// @from(Ln 353545, Col 4)
KCY
// @from(Ln 353545, Col 9)
_d4
// @from(Ln 353545, Col 14)
zHH
// @from(Ln 353545, Col 19)
YCY
// @from(Ln 353545, Col 24)
Nj
// @from(Ln 353546, Col 4)
Tg1 = v(() => {
    i7();
    wd4();
    mX();
    m6();
    S9();
    Cz();
    H$();
    Od4();
    pW1();
    B6();
    KCY = u.object({
        tool: u.enum(["Bash"]).describe("The tool this prompt applies to"),
        prompt: u.string().describe('Semantic description of the action, e.g. "run tests", "install dependencies"')
    }), _d4 = z7(() => u.strictObject({
        allowedPrompts: u.array(KCY).optional().describe("Prompt-based permissions needed to implement the plan. These describe categories of actions rather than specific commands."),
        pushToRemote: u.boolean().optional().describe("Whether to push the plan to a remote Claude.ai session"),
        remoteSessionId: u.string().optional().describe("The remote session ID if pushed to remote"),
        remoteSessionUrl: u.string().optional().describe("The remote session URL if pushed to remote"),
        remoteSessionTitle: u.string().optional().describe("The remote session title if pushed to remote")
    }).passthrough()), zHH = z7(() => _d4().extend({
        plan: u.string().optional().describe("The plan content (injected by normalizeToolInput from disk)")
    })), YCY = z7(() => u.object({
        plan: u.string().nullable().describe("The plan that was presented to the user"),
        isAgent: u.boolean(),
        filePath: u.string().optional().describe("The file path where the plan was saved"),
        pushToRemote: u.boolean().optional().describe("Whether the plan was pushed to a remote session"),
        remoteSessionId: u.string().optional().describe("The remote session ID"),
        remoteSessionUrl: u.string().optional().describe("The remote session URL"),
        hasTaskTool: u.boolean().optional().describe("Whether the Task tool is available in the current context"),
        awaitingLeaderApproval: u.boolean().optional().describe("When true, the teammate has sent a plan approval request to the team leader"),
        requestId: u.string().optional().describe("Unique identifier for the plan approval request")
    })), Nj = {
        name: bW,
        maxResultSizeChars: 1e5,
        async description() {
            return "Prompts the user to exit plan mode and start coding"
        },
        async prompt() {
            return ep4
        },
        get inputSchema() {
            return _d4()
        },
        get outputSchema() {
            return YCY()
        },
        userFacingName() {
            return ""
        },
        isEnabled() {
            return !0
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !1
        },
        requiresUserInteraction() {
            if (Dz()) return !1;
            return !0
        },
        async checkPermissions(A) {
            if (Dz()) return {
                behavior: "allow",
                updatedInput: A
            };
            return {
                behavior: "ask",
                message: "Exit plan mode?",
                updatedInput: A
            }
        },
        renderToolUseMessage: Ad4,
        renderToolUseProgressMessage: qd4,
        renderToolResultMessage: Kd4,
        renderToolUseRejectedMessage: Yd4,
        renderToolUseErrorMessage: zd4,
        async call(A, q) {
            let K = !!q.agentId,
                Y = uW(q.agentId),
                z = pD(q.agentId);
            if (Dz() && MC1()) {
                if (!z) throw Error(`No plan file found at ${Y}. Please write your plan to this file before calling ExitPlanMode.`);
                let H = g5() || "unknown",
                    $ = i3(),
                    O = vP1("plan_approval", pv(H, $ || "default")),
                    _ = {
                        type: "plan_approval_request",
                        from: H,
                        timestamp: new Date().toISOString(),
                        planFilePath: Y,
                        planContent: z,
                        requestId: O
                    };
                f9("team-lead", {
                    from: H,
                    text: Q1(_),
                    timestamp: new Date().toISOString()
                }, $);
                let J = await q.getAppState(),
                    X = Hd4(H, J);
                if (X) $d4(X, q.setAppState, !0);
                return {
                    data: {
                        plan: z,
                        isAgent: !0,
                        filePath: Y,
                        awaitingLeaderApproval: !0,
                        requestId: O
                    }
                }
            }
            if (A.pushToRemote && A.remoteSessionId) vg1({
                session: {
                    id: A.remoteSessionId,
                    title: A.remoteSessionTitle || "Remote task"
                },
                command: z || "",
                context: q
            });
            q.setAppState((H) => {
                if (H.toolPermissionContext.mode !== "plan") return H;
                OT(!0), kx(!0);
                let $ = H.toolPermissionContext.prePlanMode ?? "default";
                return {
                    ...H,
                    toolPermissionContext: {
                        ...H.toolPermissionContext,
                        mode: $,
                        prePlanMode: void 0
                    }
                }
            });
            let w = l8() && q.options.tools.some((H) => H.name === fK);
            return {
                data: {
                    plan: z,
                    isAgent: K,
                    filePath: Y,
                    pushToRemote: A.pushToRemote,
                    remoteSessionId: A.remoteSessionId,
                    remoteSessionUrl: A.remoteSessionUrl,
                    hasTaskTool: w || void 0
                }
            }
        },
        mapToolResultToToolResultBlockParam({
            isAgent: A,
            plan: q,
            filePath: K,
            pushToRemote: Y,
            remoteSessionId: z,
            remoteSessionUrl: w,
            hasTaskTool: H,
            awaitingLeaderApproval: $,
            requestId: O
        }, _) {
            if (Y && z) return {
                type: "tool_result",
                content: "Plan pushed to remote session. The URL is already displayed to the user, so do not repeat it.",
                tool_use_id: _
            };
            if ($) return {
                type: "tool_result",
                content: `Your plan has been submitted to the team lead for approval.

Plan file: ${K}

**What happens next:**
1. Wait for the team lead to review your plan
2. You will receive a message in your inbox with approval/rejection
3. If approved, you can proceed with implementation
4. If rejected, refine your plan based on the feedback

**Important:** Do NOT proceed until you receive approval. Check your inbox for response.

Request ID: ${O}`,
                tool_use_id: _
            };
            if (A) return {
                type: "tool_result",
                content: 'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"',
                tool_use_id: _
            };
            if (!q || q.trim() === "") return {
                type: "tool_result",
                content: "User has approved exiting plan mode. You can now proceed.",
                tool_use_id: _
            };
            let J = H ? `

If this plan can be broken down into multiple independent tasks, consider using the ${vh} tool to create a team and parallelize the work.` : "";
            return {
                type: "tool_result",
                content: `User has approved your plan. You can now start coding. Start with updating your todo list if applicable

Your plan has been saved to: ${K}
You can refer back to it if needed during implementation.${J}

## Approved Plan:
${q}`,
                tool_use_id: _
            }
        }
    }
})
// @from(Ln 353754, Col 4)
$HH
// @from(Ln 353755, Col 4)
Jd4 = v(() => {
    i7();
    $HH = u.strictObject({})
})
// @from(Ln 353760, Col 0)
function $CY(A) {
    let q = e(3),
        {
            answers: K
        } = A,
        Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = aO.createElement(I, {
        flexDirection: "row"
    }, aO.createElement(V, {
        color: cP("default")
    }, gY, " "), aO.createElement(V, null, "User answered Claude's questions:")), q[0] = Y;
    else Y = q[0];
    let z;
    if (q[1] !== K) z = aO.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, Y, aO.createElement(HA, null, aO.createElement(I, {
        flexDirection: "column"
    }, Object.entries(K).map(OCY)))), q[1] = K, q[2] = z;
    else z = q[2];
    return z
}
// @from(Ln 353783, Col 0)
function OCY(A) {
    let [q, K] = A;
    return aO.createElement(V, {
        key: q,
        color: "inactive"
    }, "· ", q, " → ", K)
}
// @from(Ln 353790, Col 4)
aO
// @from(Ln 353790, Col 8)
zCY
// @from(Ln 353790, Col 13)
Xd4
// @from(Ln 353790, Col 18)
wCY
// @from(Ln 353790, Col 23)
HCY
// @from(Ln 353790, Col 28)
dW1
// @from(Ln 353791, Col 4)
RW6 = v(() => {
    i1();
    i7();
    m1();
    eq();
    jW();
    oj();
    aO = o(X1(), 1), zCY = u.object({
        label: u.string().describe("The display text for this option that the user will see and select. Should be concise (1-5 words) and clearly describe the choice."),
        description: u.string().describe("Explanation of what this option means or what will happen if chosen. Useful for providing context about trade-offs or implications.")
    }), Xd4 = u.object({
        question: u.string().describe('The complete question to ask the user. Should be clear, specific, and end with a question mark. Example: "Which library should we use for date formatting?" If multiSelect is true, phrase it accordingly, e.g. "Which features do you want to enable?"'),
        header: u.string().describe(`Very short label displayed as a chip/tag (max ${Fp7} chars). Examples: "Auth method", "Library", "Approach".`),
        options: u.array(zCY).min(2).max(4).describe("The available choices for this question. Must have 2-4 options. Each option should be a distinct, mutually exclusive choice (unless multiSelect is enabled). There should be no 'Other' option, that will be provided automatically."),
        multiSelect: u.boolean().default(!1).describe("Set to true to allow the user to select multiple options instead of just one. Use when choices are not mutually exclusive.")
    }), wCY = z7(() => u.strictObject({
        questions: u.array(Xd4).min(1).max(4).describe("Questions to ask the user (1-4 questions)"),
        answers: u.record(u.string(), u.string()).optional().describe("User answers collected by the permission component"),
        metadata: u.object({
            source: u.string().optional().describe('Optional identifier for the source of this question (e.g., "remember" for /remember command). Used for analytics tracking.')
        }).optional().describe("Optional metadata for tracking and analytics purposes. Not displayed to user.")
    }).refine((A) => {
        let q = A.questions.map((K) => K.question);
        if (q.length !== new Set(q).size) return !1;
        for (let K of A.questions) {
            let Y = K.options.map((z) => z.label);
            if (Y.length !== new Set(Y).size) return !1
        }
        return !0
    }, {
        message: "Question texts must be unique, option labels must be unique within each question"
    })), HCY = z7(() => u.object({
        questions: u.array(Xd4).describe("The questions that were asked"),
        answers: u.record(u.string(), u.string()).describe("The answers provided by the user (question text -> answer string; multi-select answers are comma-separated)")
    }));
    dW1 = {
        name: TH,
        maxResultSizeChars: 1e5,
        async description() {
            return Qp7
        },
        async prompt() {
            return gp7
        },
        get inputSchema() {
            return wCY()
        },
        get outputSchema() {
            return HCY()
        },
        userFacingName() {
            return ""
        },
        isEnabled() {
            return !0
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        requiresUserInteraction() {
            return !0
        },
        async checkPermissions(A) {
            return {
                behavior: "ask",
                message: "Answer questions?",
                updatedInput: A
            }
        },
        renderToolUseMessage() {
            return null
        },
        renderToolUseProgressMessage() {
            return null
        },
        renderToolResultMessage({
            answers: A
        }, q) {
            return aO.createElement($CY, {
                answers: A
            })
        },
        renderToolUseRejectedMessage() {
            return aO.createElement(I, {
                flexDirection: "row",
                marginTop: 1
            }, aO.createElement(V, {
                color: cP("default")
            }, gY, " "), aO.createElement(V, null, "User declined to answer questions"))
        },
        renderToolUseErrorMessage() {
            return null
        },
        async call({
            questions: A,
            answers: q = {}
        }, K) {
            return {
                data: {
                    questions: A,
                    answers: q
                }
            }
        },
        mapToolResultToToolResultBlockParam({
            answers: A
        }, q) {
            return {
                type: "tool_result",
                content: `User has answered your questions: ${Object.entries(A).map(([Y,z])=>`"${Y}"="${z}"`).join(", ")}. You can now continue with the user's answers in mind.`,
                tool_use_id: q
            }
        }
    }
})
// @from(Ln 353909, Col 4)
_CY
// @from(Ln 353909, Col 9)
JCY
// @from(Ln 353909, Col 14)
XCY
// @from(Ln 353909, Col 19)
DCY
// @from(Ln 353909, Col 24)
jCY
// @from(Ln 353909, Col 29)
MCY
// @from(Ln 353909, Col 34)
PCY
// @from(Ln 353909, Col 39)
WCY
// @from(Ln 353909, Col 44)
GCY
// @from(Ln 353909, Col 49)
Dd4
// @from(Ln 353910, Col 4)
jd4 = v(() => {
    i7();
    _CY = u.strictObject({
        operation: u.literal("goToDefinition"),
        filePath: u.string().describe("The absolute or relative path to the file"),
        line: u.number().int().positive().describe("The line number (1-based, as shown in editors)"),
        character: u.number().int().positive().describe("The character offset (1-based, as shown in editors)")
    }), JCY = u.strictObject({
        operation: u.literal("findReferences"),
        filePath: u.string().describe("The absolute or relative path to the file"),
        line: u.number().int().positive().describe("The line number (1-based, as shown in editors)"),
        character: u.number().int().positive().describe("The character offset (1-based, as shown in editors)")
    }), XCY = u.strictObject({
        operation: u.literal("hover"),
        filePath: u.string().describe("The absolute or relative path to the file"),
        line: u.number().int().positive().describe("The line number (1-based, as shown in editors)"),
        character: u.number().int().positive().describe("The character offset (1-based, as shown in editors)")
    }), DCY = u.strictObject({
        operation: u.literal("documentSymbol"),
        filePath: u.string().describe("The absolute or relative path to the file"),
        line: u.number().int().positive().describe("The line number (1-based, as shown in editors)"),
        character: u.number().int().positive().describe("The character offset (1-based, as shown in editors)")
    }), jCY = u.strictObject({
        operation: u.literal("workspaceSymbol"),
        filePath: u.string().describe("The absolute or relative path to the file"),
        line: u.number().int().positive().describe("The line number (1-based, as shown in editors)"),
        character: u.number().int().positive().describe("The character offset (1-based, as shown in editors)")
    }), MCY = u.strictObject({
        operation: u.literal("goToImplementation"),
        filePath: u.string().describe("The absolute or relative path to the file"),
        line: u.number().int().positive().describe("The line number (1-based, as shown in editors)"),
        character: u.number().int().positive().describe("The character offset (1-based, as shown in editors)")
    }), PCY = u.strictObject({
        operation: u.literal("prepareCallHierarchy"),
        filePath: u.string().describe("The absolute or relative path to the file"),
        line: u.number().int().positive().describe("The line number (1-based, as shown in editors)"),
        character: u.number().int().positive().describe("The character offset (1-based, as shown in editors)")
    }), WCY = u.strictObject({
        operation: u.literal("incomingCalls"),
        filePath: u.string().describe("The absolute or relative path to the file"),
        line: u.number().int().positive().describe("The line number (1-based, as shown in editors)"),
        character: u.number().int().positive().describe("The character offset (1-based, as shown in editors)")
    }), GCY = u.strictObject({
        operation: u.literal("outgoingCalls"),
        filePath: u.string().describe("The absolute or relative path to the file"),
        line: u.number().int().positive().describe("The line number (1-based, as shown in editors)"),
        character: u.number().int().positive().describe("The character offset (1-based, as shown in editors)")
    }), Dd4 = u.discriminatedUnion("operation", [_CY, JCY, XCY, DCY, jCY, MCY, PCY, WCY, GCY])
})
// @from(Ln 353963, Col 0)
function Eg1(A, q) {
    if (!A) return h("formatUri called with undefined URI - indicates malformed LSP server response", {
        level: "warn"
    }), "<unknown location>";
    let K = A.replace(/^file:\/\//, "");
    if (/^\/[A-Za-z]:/.test(K)) K = K.slice(1);
    try {
        K = decodeURIComponent(K)
    } catch (Y) {
        let z = Y instanceof Error ? Y.message : String(Y);
        h(`Failed to decode LSP URI '${A}': ${z}. Using un-decoded path: ${K}`, {
            level: "warn"
        })
    }
    if (q) {
        let Y = ZCY(q, K).replaceAll("\\", "/");
        if (Y.length < K.length && !Y.startsWith("../../")) return Y
    }
    return K.replaceAll("\\", "/")
}
// @from(Ln 353984, Col 0)
function Gd4(A, q) {
    let K = new Map;
    for (let Y of A) {
        let z = "uri" in Y ? Y.uri : Y.location.uri,
            w = Eg1(z, q),
            H = K.get(w);
        if (H) H.push(Y);
        else K.set(w, [Y])
    }
    return K
}
// @from(Ln 353996, Col 0)
function yW6(A, q) {
    let K = Eg1(A.uri, q),
        Y = A.range.start.line + 1,
        z = A.range.start.character + 1;
    return `${K}:${Y}:${z}`
}
// @from(Ln 354003, Col 0)
function Md4(A) {
    return {
        uri: A.targetUri,
        range: A.targetSelectionRange || A.targetRange
    }
}
// @from(Ln 354010, Col 0)
function Pd4(A) {
    return "targetUri" in A
}
// @from(Ln 354014, Col 0)
function ZRA(A, q) {
    if (!A) return "No definition found. This may occur if the cursor is not on a symbol, or if the definition is in an external library not indexed by the LSP server.";
    if (Array.isArray(A)) {
        let Y = A.map(($) => Pd4($) ? Md4($) : $),
            z = Y.filter(($) => !$ || !$.uri);
        if (z.length > 0) h(`formatGoToDefinitionResult: Filtering out ${z.length} invalid location(s) - this should have been caught earlier`, {
            level: "warn"
        });
        let w = Y.filter(($) => $ && $.uri);
        if (w.length === 0) return "No definition found. This may occur if the cursor is not on a symbol, or if the definition is in an external library not indexed by the LSP server.";
        if (w.length === 1) return `Defined in ${yW6(w[0],q)}`;
        let H = w.map(($) => `  ${yW6($,q)}`).join(`
`);
        return `Found ${w.length} definitions:
${H}`
    }
    let K = Pd4(A) ? Md4(A) : A;
    return `Defined in ${yW6(K,q)}`
}