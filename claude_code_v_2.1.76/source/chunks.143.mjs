
// @from(Ln 360563, Col 4)
il6 = x((Zow, G6q) => {
    G6q.exports = Z6q;
    var P6q = kk1(),
        W6q = yk1(),
        mSY = bk1(),
        xk1 = Hj(),
        BSY = Hk1();

    function Z6q(A) {
        this.contextObject = A
    }
    var gSY = {
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
    Z6q.prototype = {
        hasFeature: function(q, K) {
            var Y = gSY[(q || "").toLowerCase()];
            return Y && Y[K || ""] || !1
        },
        createDocumentType: function(q, K, Y) {
            if (!BSY.isValidQName(q)) xk1.InvalidCharacterError();
            return new W6q(this.contextObject, q, K, Y)
        },
        createDocument: function(q, K, Y) {
            var z = new P6q(!1, null),
                _;
            if (K) _ = z.createElementNS(q, K);
            else _ = null;
            if (Y) z.appendChild(Y);
            if (_) z.appendChild(_);
            if (q === xk1.NAMESPACE.HTML) z._contentType = "application/xhtml+xml";
            else if (q === xk1.NAMESPACE.SVG) z._contentType = "image/svg+xml";
            else z._contentType = "application/xml";
            return z
        },
        createHTMLDocument: function(q) {
            var K = new P6q(!0, null);
            K.appendChild(new W6q(K, "html"));
            var Y = K.createElement("html");
            K.appendChild(Y);
            var z = K.createElement("head");
            if (Y.appendChild(z), q !== void 0) {
                var _ = K.createElement("title");
                z.appendChild(_), _.appendChild(K.createTextNode(q))
            }
            return Y.appendChild(K.createElement("body")), K.modclock = 1, K
        },
        mozSetOutputMutationHandler: function(A, q) {
            A.mutationHandler = q
        },
        mozGetInputMutationHandler: function(A) {
            xk1.nyi()
        },
        mozHTMLParser: mSY
    }
})
// @from(Ln 360637, Col 4)
T6q = x((Gow, f6q) => {
    var FSY = fk1(),
        pSY = Og8();
    f6q.exports = vg8;

    function vg8(A, q) {
        this._window = A, this._href = q
    }
    vg8.prototype = Object.create(pSY.prototype, {
        constructor: {
            value: vg8
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
                var q = new FSY(this._href),
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
// @from(Ln 360681, Col 4)
N6q = x((fow, v6q) => {
    var QSY = Object.create(null, {
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
    v6q.exports = QSY
})
// @from(Ln 360718, Col 4)
k6q = x((Tow, V6q) => {
    var USY = {
        setTimeout,
        clearTimeout,
        setInterval,
        clearInterval
    };
    V6q.exports = USY
})
// @from(Ln 360727, Col 4)
Vg8 = x((nl6, E6q) => {
    var Ng8 = Hj();
    nl6 = E6q.exports = {
        CSSStyleDeclaration: Tk1(),
        CharacterData: Bl6(),
        Comment: nB8(),
        DOMException: zk1(),
        DOMImplementation: il6(),
        DOMTokenList: SB8(),
        Document: kk1(),
        DocumentFragment: oB8(),
        DocumentType: yk1(),
        Element: DT6(),
        HTMLParser: bk1(),
        NamedNodeMap: mB8(),
        Node: u0(),
        NodeList: Tz6(),
        NodeFilter: Ql6(),
        ProcessingInstruction: sB8(),
        Text: lB8(),
        Window: kg8()
    };
    Ng8.merge(nl6, wg8());
    Ng8.merge(nl6, Nk1().elements);
    Ng8.merge(nl6, Mg8().elements)
})
// @from(Ln 360753, Col 4)
kg8 = x((vow, y6q) => {
    var dSY = il6(),
        cSY = XB8(),
        lSY = T6q(),
        rl6 = Hj();
    y6q.exports = uk1;

    function uk1(A) {
        this.document = A || new dSY(null).createHTMLDocument(""), this.document._scripting_enabled = !0, this.document.defaultView = this, this.location = new lSY(this, this.document._address || "about:blank")
    }
    uk1.prototype = Object.create(cSY.prototype, {
        console: {
            value: console
        },
        history: {
            value: {
                back: rl6.nyi,
                forward: rl6.nyi,
                go: rl6.nyi
            }
        },
        navigator: {
            value: N6q()
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
    rl6.expose(k6q(), uk1);
    rl6.expose(Vg8(), uk1)
})
// @from(Ln 360828, Col 4)
C6q = x((iSY) => {
    var L6q = il6(),
        R6q = bk1(),
        Now = kg8(),
        h6q = Vg8();
    iSY.createDOMImplementation = function() {
        return new L6q(null)
    };
    iSY.createDocument = function(A, q) {
        if (A || q) {
            var K = new R6q;
            return K.parse(A || "", !0), K.document()
        }
        return new L6q(null).createHTMLDocument("")
    };
    iSY.createIncrementalHTMLParser = function() {
        var A = new R6q;
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
    iSY.createWindow = function(A, q) {
        var K = iSY.createDocument(A);
        if (q !== void 0) K._address = q;
        return new h6q.Window(K)
    };
    iSY.impl = h6q
})
// @from(Ln 360871, Col 4)
d6q = x((kow, U6q) => {
    function sSY(A) {
        for (var q = 1; q < arguments.length; q++) {
            var K = arguments[q];
            for (var Y in K)
                if (K.hasOwnProperty(Y)) A[Y] = K[Y]
        }
        return A
    }

    function Rg8(A, q) {
        return Array(q + 1).join(A)
    }

    function tSY(A) {
        return A.replace(/^\n*/, "")
    }

    function eSY(A) {
        var q = A.length;
        while (q > 0 && A[q - 1] === `
`) q--;
        return A.substring(0, q)
    }
    var ACY = ["ADDRESS", "ARTICLE", "ASIDE", "AUDIO", "BLOCKQUOTE", "BODY", "CANVAS", "CENTER", "DD", "DIR", "DIV", "DL", "DT", "FIELDSET", "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "FRAMESET", "H1", "H2", "H3", "H4", "H5", "H6", "HEADER", "HGROUP", "HR", "HTML", "ISINDEX", "LI", "MAIN", "MENU", "NAV", "NOFRAMES", "NOSCRIPT", "OL", "OUTPUT", "P", "PRE", "SECTION", "TABLE", "TBODY", "TD", "TFOOT", "TH", "THEAD", "TR", "UL"];

    function hg8(A) {
        return Sg8(A, ACY)
    }
    var x6q = ["AREA", "BASE", "BR", "COL", "COMMAND", "EMBED", "HR", "IMG", "INPUT", "KEYGEN", "LINK", "META", "PARAM", "SOURCE", "TRACK", "WBR"];

    function u6q(A) {
        return Sg8(A, x6q)
    }

    function qCY(A) {
        return B6q(A, x6q)
    }
    var m6q = ["A", "TABLE", "THEAD", "TBODY", "TFOOT", "TH", "TD", "IFRAME", "SCRIPT", "AUDIO", "VIDEO"];

    function KCY(A) {
        return Sg8(A, m6q)
    }

    function YCY(A) {
        return B6q(A, m6q)
    }

    function Sg8(A, q) {
        return q.indexOf(A.nodeName) >= 0
    }

    function B6q(A, q) {
        return A.getElementsByTagName && q.some(function(K) {
            return A.getElementsByTagName(K).length
        })
    }
    var mZ = {};
    mZ.paragraph = {
        filter: "p",
        replacement: function(A) {
            return `

` + A + `

`
        }
    };
    mZ.lineBreak = {
        filter: "br",
        replacement: function(A, q, K) {
            return K.br + `
`
        }
    };
    mZ.heading = {
        filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
        replacement: function(A, q, K) {
            var Y = Number(q.nodeName.charAt(1));
            if (K.headingStyle === "setext" && Y < 3) {
                var z = Rg8(Y === 1 ? "=" : "-", A.length);
                return `

` + A + `
` + z + `

`
            } else return `

` + Rg8("#", Y) + " " + A + `

`
        }
    };
    mZ.blockquote = {
        filter: "blockquote",
        replacement: function(A) {
            return A = A.replace(/^\n+|\n+$/g, ""), A = A.replace(/^/gm, "> "), `

` + A + `

`
        }
    };
    mZ.list = {
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
    mZ.listItem = {
        filter: "li",
        replacement: function(A, q, K) {
            A = A.replace(/^\n+/, "").replace(/\n+$/, `
`).replace(/\n/gm, `
    `);
            var Y = K.bulletListMarker + "   ",
                z = q.parentNode;
            if (z.nodeName === "OL") {
                var _ = z.getAttribute("start"),
                    w = Array.prototype.indexOf.call(z.children, q);
                Y = (_ ? Number(_) + w : w + 1) + ".  "
            }
            return Y + A + (q.nextSibling && !/\n$/.test(A) ? `
` : "")
        }
    };
    mZ.indentedCodeBlock = {
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
    mZ.fencedCodeBlock = {
        filter: function(A, q) {
            return q.codeBlockStyle === "fenced" && A.nodeName === "PRE" && A.firstChild && A.firstChild.nodeName === "CODE"
        },
        replacement: function(A, q, K) {
            var Y = q.firstChild.getAttribute("class") || "",
                z = (Y.match(/language-(\S+)/) || [null, ""])[1],
                _ = q.firstChild.textContent,
                w = K.fence.charAt(0),
                O = 3,
                $ = new RegExp("^" + w + "{3,}", "gm"),
                H;
            while (H = $.exec(_))
                if (H[0].length >= O) O = H[0].length + 1;
            var j = Rg8(w, O);
            return `

` + j + z + `
` + _.replace(/\n$/, "") + `
` + j + `

`
        }
    };
    mZ.horizontalRule = {
        filter: "hr",
        replacement: function(A, q, K) {
            return `

` + K.hr + `

`
        }
    };
    mZ.inlineLink = {
        filter: function(A, q) {
            return q.linkStyle === "inlined" && A.nodeName === "A" && A.getAttribute("href")
        },
        replacement: function(A, q) {
            var K = q.getAttribute("href");
            if (K) K = K.replace(/([()])/g, "\\$1");
            var Y = mk1(q.getAttribute("title"));
            if (Y) Y = ' "' + Y.replace(/"/g, "\\\"") + '"';
            return "[" + A + "](" + K + Y + ")"
        }
    };
    mZ.referenceLink = {
        filter: function(A, q) {
            return q.linkStyle === "referenced" && A.nodeName === "A" && A.getAttribute("href")
        },
        replacement: function(A, q, K) {
            var Y = q.getAttribute("href"),
                z = mk1(q.getAttribute("title"));
            if (z) z = ' "' + z + '"';
            var _, w;
            switch (K.linkReferenceStyle) {
                case "collapsed":
                    _ = "[" + A + "][]", w = "[" + A + "]: " + Y + z;
                    break;
                case "shortcut":
                    _ = "[" + A + "]", w = "[" + A + "]: " + Y + z;
                    break;
                default:
                    var O = this.references.length + 1;
                    _ = "[" + A + "][" + O + "]", w = "[" + O + "]: " + Y + z
            }
            return this.references.push(w), _
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
    mZ.emphasis = {
        filter: ["em", "i"],
        replacement: function(A, q, K) {
            if (!A.trim()) return "";
            return K.emDelimiter + A + K.emDelimiter
        }
    };
    mZ.strong = {
        filter: ["strong", "b"],
        replacement: function(A, q, K) {
            if (!A.trim()) return "";
            return K.strongDelimiter + A + K.strongDelimiter
        }
    };
    mZ.code = {
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
    mZ.image = {
        filter: "img",
        replacement: function(A, q) {
            var K = mk1(q.getAttribute("alt")),
                Y = q.getAttribute("src") || "",
                z = mk1(q.getAttribute("title")),
                _ = z ? ' "' + z + '"' : "";
            return Y ? "![" + K + "](" + Y + _ + ")" : ""
        }
    };

    function mk1(A) {
        return A ? A.replace(/(\n+\s*)+/g, `
`) : ""
    }

    function g6q(A) {
        this.options = A, this._keep = [], this._remove = [], this.blankRule = {
            replacement: A.blankReplacement
        }, this.keepReplacement = A.keepReplacement, this.defaultRule = {
            replacement: A.defaultReplacement
        }, this.array = [];
        for (var q in A.rules) this.array.push(A.rules[q])
    }
    g6q.prototype = {
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
            if (q = Eg8(this.array, A, this.options)) return q;
            if (q = Eg8(this._keep, A, this.options)) return q;
            if (q = Eg8(this._remove, A, this.options)) return q;
            return this.defaultRule
        },
        forEach: function(A) {
            for (var q = 0; q < this.array.length; q++) A(this.array[q], q)
        }
    };

    function Eg8(A, q, K) {
        for (var Y = 0; Y < A.length; Y++) {
            var z = A[Y];
            if (zCY(z, q, K)) return z
        }
        return
    }

    function zCY(A, q, K) {
        var Y = A.filter;
        if (typeof Y === "string") {
            if (Y === q.nodeName.toLowerCase()) return !0
        } else if (Array.isArray(Y)) {
            if (Y.indexOf(q.nodeName.toLowerCase()) > -1) return !0
        } else if (typeof Y === "function") {
            if (Y.call(A, q, K)) return !0
        } else throw TypeError("`filter` needs to be a string, array, or function")
    }

    function _CY(A) {
        var {
            element: q,
            isBlock: K,
            isVoid: Y
        } = A, z = A.isPre || function(J) {
            return J.nodeName === "PRE"
        };
        if (!q.firstChild || z(q)) return;
        var _ = null,
            w = !1,
            O = null,
            $ = I6q(O, q, z);
        while ($ !== q) {
            if ($.nodeType === 3 || $.nodeType === 4) {
                var H = $.data.replace(/[ \r\n\t]+/g, " ");
                if ((!_ || / $/.test(_.data)) && !w && H[0] === " ") H = H.substr(1);
                if (!H) {
                    $ = yg8($);
                    continue
                }
                $.data = H, _ = $
            } else if ($.nodeType === 1) {
                if (K($) || $.nodeName === "BR") {
                    if (_) _.data = _.data.replace(/ $/, "");
                    _ = null, w = !1
                } else if (Y($) || z($)) _ = null, w = !0;
                else if (_) w = !1
            } else {
                $ = yg8($);
                continue
            }
            var j = I6q(O, $, z);
            O = $, $ = j
        }
        if (_) {
            if (_.data = _.data.replace(/ $/, ""), !_.data) yg8(_)
        }
    }

    function yg8(A) {
        var q = A.nextSibling || A.parentNode;
        return A.parentNode.removeChild(A), q
    }

    function I6q(A, q, K) {
        if (A && A.parentNode === q || K(q)) return q.nextSibling || q.parentNode;
        return q.firstChild || q.nextSibling || q.parentNode
    }
    var F6q = typeof window < "u" ? window : {};

    function wCY() {
        var A = F6q.DOMParser,
            q = !1;
        try {
            if (new A().parseFromString("", "text/html")) q = !0
        } catch (K) {}
        return q
    }

    function OCY() {
        var A = function() {};
        {
            var q = C6q();
            A.prototype.parseFromString = function(K) {
                return q.createDocument(K)
            }
        }
        return A
    }
    var $CY = wCY() ? F6q.DOMParser : OCY();

    function HCY(A, q) {
        var K;
        if (typeof A === "string") {
            var Y = jCY().parseFromString('<x-turndown id="turndown-root">' + A + "</x-turndown>", "text/html");
            K = Y.getElementById("turndown-root")
        } else K = A.cloneNode(!0);
        return _CY({
            element: K,
            isBlock: hg8,
            isVoid: u6q,
            isPre: q.preformattedCode ? JCY : null
        }), K
    }
    var Lg8;

    function jCY() {
        return Lg8 = Lg8 || new $CY, Lg8
    }

    function JCY(A) {
        return A.nodeName === "PRE" || A.nodeName === "CODE"
    }

    function MCY(A, q) {
        return A.isBlock = hg8(A), A.isCode = A.nodeName === "CODE" || A.parentNode.isCode, A.isBlank = DCY(A), A.flankingWhitespace = XCY(A, q), A
    }

    function DCY(A) {
        return !u6q(A) && !KCY(A) && /^\s*$/i.test(A.textContent) && !qCY(A) && !YCY(A)
    }

    function XCY(A, q) {
        if (A.isBlock || q.preformattedCode && A.isCode) return {
            leading: "",
            trailing: ""
        };
        var K = PCY(A.textContent);
        if (K.leadingAscii && b6q("left", A, q)) K.leading = K.leadingNonAscii;
        if (K.trailingAscii && b6q("right", A, q)) K.trailing = K.trailingNonAscii;
        return {
            leading: K.leading,
            trailing: K.trailing
        }
    }

    function PCY(A) {
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

    function b6q(A, q, K) {
        var Y, z, _;
        if (A === "left") Y = q.previousSibling, z = / $/;
        else Y = q.nextSibling, z = /^ /;
        if (Y) {
            if (Y.nodeType === 3) _ = z.test(Y.nodeValue);
            else if (K.preformattedCode && Y.nodeName === "CODE") _ = !1;
            else if (Y.nodeType === 1 && !hg8(Y)) _ = z.test(Y.textContent)
        }
        return _
    }
    var WCY = Array.prototype.reduce,
        ZCY = [
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

    function Bk1(A) {
        if (!(this instanceof Bk1)) return new Bk1(A);
        var q = {
            rules: mZ,
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
        this.options = sSY({}, q, A), this.rules = new g6q(this.options)
    }
    Bk1.prototype = {
        turndown: function(A) {
            if (!TCY(A)) throw TypeError(A + " is not a string, or an element/document/fragment node.");
            if (A === "") return "";
            var q = p6q.call(this, new HCY(A, this.options));
            return GCY.call(this, q)
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
            return ZCY.reduce(function(q, K) {
                return q.replace(K[0], K[1])
            }, A)
        }
    };

    function p6q(A) {
        var q = this;
        return WCY.call(A.childNodes, function(K, Y) {
            Y = new MCY(Y, q.options);
            var z = "";
            if (Y.nodeType === 3) z = Y.isCode ? Y.nodeValue : q.escape(Y.nodeValue);
            else if (Y.nodeType === 1) z = fCY.call(q, Y);
            return Q6q(K, z)
        }, "")
    }

    function GCY(A) {
        var q = this;
        return this.rules.forEach(function(K) {
            if (typeof K.append === "function") A = Q6q(A, K.append(q.options))
        }), A.replace(/^[\t\r\n]+/, "").replace(/[\t\r\n\s]+$/, "")
    }

    function fCY(A) {
        var q = this.rules.forNode(A),
            K = p6q.call(this, A),
            Y = A.flankingWhitespace;
        if (Y.leading || Y.trailing) K = K.trim();
        return Y.leading + q.replacement(K, A, this.options) + Y.trailing
    }

    function Q6q(A, q) {
        var K = eSY(A),
            Y = tSY(q),
            z = Math.max(A.length - K.length, q.length - Y.length),
            _ = `

`.substring(0, z);
        return K + _ + Y
    }

    function TCY(A) {
        return A != null && (typeof A === "string" || A.nodeType && (A.nodeType === 1 || A.nodeType === 9 || A.nodeType === 11))
    }
    U6q.exports = Bk1
})
// @from(Ln 361467, Col 4)
r6q = {}
// @from(Ln 361480, Col 0)
function VCY() {
    bg8.clear(), xg8.clear()
}
// @from(Ln 361484, Col 0)
function ug8(A) {
    try {
        let q = new URL(A),
            K = q.hostname,
            Y = q.pathname;
        for (let z of eV1)
            if (z.includes("/")) {
                let [_, ...w] = z.split("/"), O = "/" + w.join("/");
                if (K === _ && Y.startsWith(O)) return !0
            } else if (K === z) return !0;
        return !1
    } catch {
        return !1
    }
}
// @from(Ln 361500, Col 0)
function l6q(A) {
    if (A.length > kCY) return !1;
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
// @from(Ln 361512, Col 0)
async function i6q(A) {
    if (xg8.has(A)) return {
        status: "allowed"
    };
    try {
        let q = await X8.get(`https://api.anthropic.com/api/web/domain_info?domain=${encodeURIComponent(A)}`, {
            timeout: LCY
        });
        if (q.status === 200) {
            if (q.data.can_fetch === !0) return xg8.set(A, !0), {
                status: "allowed"
            };
            return {
                status: "blocked"
            }
        }
        return {
            status: "check_failed",
            error: Error(`Domain check returned status ${q.status}`)
        }
    } catch (q) {
        return _6(q), {
            status: "check_failed",
            error: q
        }
    }
}
// @from(Ln 361540, Col 0)
function n6q(A, q) {
    try {
        let K = new URL(A),
            Y = new URL(q);
        if (Y.protocol !== K.protocol) return !1;
        if (Y.port !== K.port) return !1;
        if (Y.username || Y.password) return !1;
        let z = (O) => O.replace(/^www\./, ""),
            _ = z(K.hostname),
            w = z(Y.hostname);
        return _ === w
    } catch (K) {
        return !1
    }
}
// @from(Ln 361555, Col 0)
async function mg8(A, q, K) {
    try {
        return await X8.get(A, {
            signal: q,
            timeout: yCY,
            maxRedirects: 0,
            responseType: "arraybuffer",
            maxContentLength: ECY,
            headers: {
                Accept: "text/markdown, text/html, */*"
            }
        })
    } catch (Y) {
        if (X8.isAxiosError(Y) && Y.response && [301, 302, 307, 308].includes(Y.response.status)) {
            let z = Y.response.headers.location;
            if (!z) throw Error("Redirect missing Location header");
            let _ = new URL(z, A).toString();
            if (K(A, _)) return mg8(_, q, K);
            else return {
                type: "redirect",
                originalUrl: A,
                redirectUrl: _,
                statusCode: Y.response.status
            }
        }
        if (X8.isAxiosError(Y) && Y.response?.status === 403 && Y.response.headers["x-proxy-error"] === "blocked-by-allowlist") {
            let z = new URL(A).hostname;
            throw new c6q(z)
        }
        throw Y
    }
}
// @from(Ln 361588, Col 0)
function RCY(A) {
    return "type" in A && A.type === "redirect"
}
// @from(Ln 361591, Col 0)
async function Bg8(A, q) {
    if (!l6q(A)) throw Error("Invalid URL");
    let K = bg8.get(A);
    if (K) return {
        bytes: K.bytes,
        code: K.code,
        codeText: K.codeText,
        content: K.content,
        contentType: K.contentType,
        persistedPath: K.persistedPath,
        persistedSize: K.persistedSize
    };
    let Y, z = A;
    try {
        if (Y = new URL(A), Y.protocol === "http:") Y.protocol = "https:", z = Y.toString();
        let X = Y.hostname;
        if (!PA().skipWebFetchPreflight) switch ((await i6q(X)).status) {
            case "allowed":
                break;
            case "blocked":
                throw new Cg8(X);
            case "check_failed":
                throw new Ig8(X)
        }
    } catch (X) {
        if (_6(X), X instanceof Cg8 || X instanceof Ig8) throw X
    }
    let _ = await mg8(z, q.signal, n6q);
    if (RCY(_)) return _;
    let w = Buffer.from(_.data),
        O = _.headers["content-type"] ?? "",
        $, H;
    if (Vs4(O)) {
        let X = `webfetch-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
            P = await _T6(w, O, X);
        if (!("error" in P)) $ = P.filepath, H = P.size
    }
    let j = w.toString("utf-8"),
        J = Buffer.byteLength(j),
        M;
    if (O.includes("text/html")) {
        let {
            default: X
        } = await Promise.resolve().then(() => t(d6q(), 1));
        M = new X().turndown(j)
    } else M = j;
    let D = {
        bytes: J,
        code: _.status,
        codeText: _.statusText,
        content: M,
        contentType: O,
        persistedPath: $,
        persistedSize: H
    };
    return bg8.set(A, D), D
}
// @from(Ln 361648, Col 0)
async function gg8(A, q, K, Y, z) {
    let _ = q.length > ol6 ? q.slice(0, ol6) + `

[Content truncated due to length...]` : q,
        w = XG7(_, A, z),
        O = await WX({
            systemPrompt: uq([]),
            userPrompt: w,
            signal: K,
            options: {
                querySource: "web_fetch_apply",
                agents: [],
                isNonInteractiveSession: Y,
                hasAppendSystemPrompt: !1,
                mcpTools: []
            }
        });
    if (K.aborted) throw new oY;
    let {
        content: $
    } = O.message;
    if ($.length > 0) {
        let H = $[0];
        if ("text" in H) return H.text
    }
    return "No response from model"
}
// @from(Ln 361675, Col 4)
Cg8
// @from(Ln 361675, Col 9)
Ig8
// @from(Ln 361675, Col 14)
c6q
// @from(Ln 361675, Col 19)
vCY = 900000
// @from(Ln 361676, Col 4)
NCY = 52428800
// @from(Ln 361677, Col 4)
bg8
// @from(Ln 361677, Col 9)
xg8
// @from(Ln 361677, Col 14)
kCY = 2000
// @from(Ln 361678, Col 4)
ECY = 10485760
// @from(Ln 361679, Col 4)
yCY = 60000
// @from(Ln 361680, Col 4)
LCY = 1e4
// @from(Ln 361681, Col 4)
ol6 = 1e5
// @from(Ln 361682, Col 4)
Fg8 = E(() => {
    kK();
    I$6();
    gw();
    V1();
    s8();
    k1();
    i8();
    HB8();
    qk1();
    Cg8 = class Cg8 extends Error {
        constructor(A) {
            super(`Claude Code is unable to fetch from ${A}`);
            this.name = "DomainBlockedError"
        }
    };
    Ig8 = class Ig8 extends Error {
        constructor(A) {
            super(`Unable to verify if domain ${A} is safe to fetch. This may be due to network restrictions or enterprise security policies blocking claude.ai.`);
            this.name = "DomainCheckFailedError"
        }
    };
    c6q = class c6q extends Error {
        domain;
        constructor(A) {
            super(JSON.stringify({
                error_type: "EGRESS_BLOCKED",
                domain: A,
                message: `Access to ${A} is blocked by the network egress proxy.`
            }));
            this.domain = A;
            this.name = "EgressBlockedError"
        }
    };
    bg8 = new kT({
        maxSize: NCY,
        sizeCalculation: (A) => Math.max(1, Buffer.byteLength(A.content)),
        ttl: vCY
    }), xg8 = new kT({
        max: 128,
        ttl: 300000
    })
})
// @from(Ln 361726, Col 0)
function o6q({
    url: A,
    prompt: q
}, {
    verbose: K
}) {
    if (!A) return null;
    if (K) return `url: "${A}"${K&&q?`, prompt: "${q}"`:""}`;
    return A
}
// @from(Ln 361737, Col 0)
function a6q() {
    return WN.default.createElement(T3, null)
}
// @from(Ln 361741, Col 0)
function s6q(A, {
    verbose: q
}) {
    return WN.default.createElement(eK, {
        result: A,
        verbose: q
    })
}
// @from(Ln 361750, Col 0)
function t6q() {
    return WN.default.createElement(t1, {
        height: 1
    }, WN.default.createElement(T, {
        dimColor: !0
    }, "Fetching…"))
}
// @from(Ln 361758, Col 0)
function e6q({
    bytes: A,
    code: q,
    codeText: K,
    result: Y
}, z, {
    verbose: _
}) {
    let w = xq(A);
    if (_) return WN.default.createElement(m, {
        flexDirection: "column"
    }, WN.default.createElement(t1, {
        height: 1
    }, WN.default.createElement(T, null, "Received ", WN.default.createElement(T, {
        bold: !0
    }, w), " (", q, " ", K, ")")), WN.default.createElement(m, {
        flexDirection: "column"
    }, WN.default.createElement(T, null, Y)));
    return WN.default.createElement(t1, {
        height: 1
    }, WN.default.createElement(T, null, "Received ", WN.default.createElement(T, {
        bold: !0
    }, w), " (", q, " ", K, ")"))
}
// @from(Ln 361783, Col 0)
function pg8(A) {
    if (!A?.url) return null;
    return R3(A.url, EI)
}
// @from(Ln 361787, Col 4)
WN
// @from(Ln 361788, Col 4)
A1q = E(() => {
    i6();
    iq();
    gj();
    kO();
    Z7();
    M4();
    WN = t(P6(), 1)
})
// @from(Ln 361798, Col 0)
function CCY(A) {
    try {
        let q = BX.inputSchema.safeParse(A);
        if (!q.success) return `input:${A.toString()}`;
        let {
            url: K
        } = q.data;
        return `domain:${new URL(K).hostname}`
    } catch {
        return `input:${A.toString()}`
    }
}
// @from(Ln 361811, Col 0)
function q1q(A) {
    return [{
        type: "addRules",
        destination: "localSettings",
        rules: [{
            toolName: sO,
            ruleContent: A
        }],
        behavior: "allow"
    }]
}
// @from(Ln 361822, Col 4)
hCY
// @from(Ln 361822, Col 9)
SCY
// @from(Ln 361822, Col 14)
BX
// @from(Ln 361823, Col 4)
vT6 = E(() => {
    K7();
    Fg8();
    Z7();
    Bj();
    HB8();
    A1q();
    hCY = F6(() => C.strictObject({
        url: C.string().url().describe("The URL to fetch content from"),
        prompt: C.string().describe("The prompt to run on the fetched content")
    })), SCY = F6(() => C.object({
        bytes: C.number().describe("Size of the fetched content in bytes"),
        code: C.number().describe("HTTP response code"),
        codeText: C.string().describe("HTTP response code text"),
        result: C.string().describe("Processed result from applying the prompt to the content"),
        durationMs: C.number().describe("Time taken to fetch and process the content"),
        url: C.string().describe("The URL that was fetched")
    }));
    BX = {
        name: sO,
        searchHint: "fetch and extract content from a URL",
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
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
        getToolUseSummary: pg8,
        getActivityDescription(A) {
            let q = pg8(A);
            return q ? `Fetching ${q}` : "Fetching web page"
        },
        isEnabled() {
            return !0
        },
        get inputSchema() {
            return hCY()
        },
        get outputSchema() {
            return SCY()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(A) {
            return A.url
        },
        async checkPermissions(A, q) {
            let Y = q.getAppState().toolPermissionContext;
            try {
                let {
                    url: $
                } = A, H = new URL($), j = H.hostname, J = H.pathname;
                for (let M of eV1)
                    if (M.includes("/")) {
                        let [D, ...X] = M.split("/"), P = "/" + X.join("/");
                        if (j === D && J.startsWith(P)) return {
                            behavior: "allow",
                            updatedInput: A,
                            decisionReason: {
                                type: "other",
                                reason: "Preapproved host and path"
                            }
                        }
                    } else if (j === M) return {
                    behavior: "allow",
                    updatedInput: A,
                    decisionReason: {
                        type: "other",
                        reason: "Preapproved host"
                    }
                }
            } catch {}
            let z = CCY(A),
                _ = Sb(Y, BX, "deny").get(z);
            if (_) return {
                behavior: "deny",
                message: `${BX.name} denied access to ${z}.`,
                decisionReason: {
                    type: "rule",
                    rule: _
                }
            };
            let w = Sb(Y, BX, "ask").get(z);
            if (w) return {
                behavior: "ask",
                message: `Claude requested permissions to use ${BX.name}, but you haven't granted it yet.`,
                decisionReason: {
                    type: "rule",
                    rule: w
                },
                suggestions: q1q(z)
            };
            let O = Sb(Y, BX, "allow").get(z);
            if (O) return {
                behavior: "allow",
                updatedInput: A,
                decisionReason: {
                    type: "rule",
                    rule: O
                }
            };
            return {
                behavior: "ask",
                message: `Claude requested permissions to use ${BX.name}, but you haven't granted it yet.`,
                suggestions: q1q(z)
            }
        },
        async prompt(A) {
            return `IMPORTANT: WebFetch WILL FAIL for authenticated or private URLs. Before using this tool, check if the URL points to an authenticated service (e.g. Google Docs, Confluence, Jira, GitHub). If so, look for a specialized MCP tool that provides authenticated access.
${DG7}`
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
        renderToolUseMessage: o6q,
        renderToolUseRejectedMessage: a6q,
        renderToolUseErrorMessage: s6q,
        renderToolUseProgressMessage: t6q,
        renderToolResultMessage: e6q,
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
                _ = await Bg8(A, K);
            if ("type" in _ && _.type === "redirect") {
                let W = _.statusCode === 301 ? "Moved Permanently" : _.statusCode === 308 ? "Permanent Redirect" : _.statusCode === 307 ? "Temporary Redirect" : "Found",
                    Z = `REDIRECT DETECTED: The URL redirects to a different host.

Original URL: ${_.originalUrl}
Redirect URL: ${_.redirectUrl}
Status: ${_.statusCode} ${W}

To complete your request, I need to fetch content from the redirected URL. Please use WebFetch again with these parameters:
- url: "${_.redirectUrl}"
- prompt: "${q}"`;
                return {
                    data: {
                        bytes: Buffer.byteLength(Z),
                        code: _.statusCode,
                        codeText: W,
                        result: Z,
                        durationMs: Date.now() - z,
                        url: A
                    }
                }
            }
            let {
                content: w,
                bytes: O,
                code: $,
                codeText: H,
                contentType: j,
                persistedPath: J,
                persistedSize: M
            } = _, D = ug8(A), X;
            if (D && j.includes("text/markdown") && w.length < ol6) X = w;
            else X = await gg8(q, w, K.signal, Y, D);
            if (J) X += `

[Binary content (${j}, ${xq(M??O)}) also saved to ${J}]`;
            return {
                data: {
                    bytes: O,
                    code: $,
                    codeText: H,
                    result: X,
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
// @from(Ln 362042, Col 0)
function ICY() {
    return [Lf6, Fk1, Fn4]
}
// @from(Ln 362046, Col 0)
function gk1(A) {
    return ICY().find((q) => q.type === A)
}
// @from(Ln 362049, Col 4)
Qg8 = E(() => {
    Rf6();
    Vb();
    GV1()
})
// @from(Ln 362055, Col 0)
function z1q() {
    return ""
}
// @from(Ln 362059, Col 0)
function _1q() {
    return null
}
// @from(Ln 362063, Col 0)
function w1q() {
    return al6.default.createElement(T3, null)
}
// @from(Ln 362067, Col 0)
function O1q(A, {
    verbose: q
}) {
    return al6.default.createElement(eK, {
        result: A,
        verbose: q
    })
}
// @from(Ln 362076, Col 0)
function bCY(A) {
    let q = A.split(`
`),
        K = A;
    if (q.length > K1q) K = q.slice(0, K1q).join(`
`);
    if (f8(K) > Y1q) K = kJ6(K, Y1q);
    return K.trim()
}
// @from(Ln 362086, Col 0)
function $1q(A, q, {
    verbose: K
}) {
    if (e2()) return null;
    let Y = A.command ?? "",
        z = K ? Y : bCY(Y);
    return al6.default.createElement(t1, null, al6.default.createElement(T, null, z, z !== Y ? "… · stopped" : " · stopped"))
}
// @from(Ln 362094, Col 4)
al6
// @from(Ln 362094, Col 9)
K1q = 2
// @from(Ln 362095, Col 4)
Y1q = 160
// @from(Ln 362096, Col 4)
H1q = E(() => {
    i6();
    q3();
    M4();
    gj();
    kO();
    iq();
    Fv();
    al6 = t(P6(), 1)
})
// @from(Ln 362106, Col 0)
async function Qk1(A, q) {
    let {
        abortController: K,
        getAppState: Y,
        setAppState: z
    } = q, w = Y().tasks?.[A];
    if (!w) throw new pk1(`No task found with ID: ${A}`, "not_found");
    if (w.status !== "running") throw new pk1(`Task ${A} is not running (status: ${w.status})`, "not_running");
    let O = gk1(w.type);
    if (!O) throw new pk1(`Unsupported task type: ${w.type}`, "unsupported_type");
    await O.kill(A, {
        abortController: K,
        getAppState: Y,
        setAppState: z
    }), z((H) => {
        let j = H.tasks[A];
        if (!j || j.notified) return H;
        return {
            ...H,
            tasks: {
                ...H.tasks,
                [A]: {
                    ...j,
                    notified: !0
                }
            }
        }
    });
    let $ = Gf(w) ? w.command : w.description;
    return {
        taskId: A,
        taskType: w.type,
        command: $
    }
}
// @from(Ln 362141, Col 4)
pk1
// @from(Ln 362142, Col 4)
Ug8 = E(() => {
    Qg8();
    pk1 = class pk1 extends Error {
        code;
        constructor(A, q) {
            super(A);
            this.code = q;
            this.name = "StopTaskError"
        }
    }
})
// @from(Ln 362153, Col 4)
xCY
// @from(Ln 362153, Col 9)
uCY
// @from(Ln 362153, Col 14)
Uk1
// @from(Ln 362154, Col 4)
dg8 = E(() => {
    K7();
    Qg8();
    H1q();
    g1();
    Fv();
    Ug8();
    xCY = F6(() => C.strictObject({
        task_id: C.string().optional().describe("The ID of the background task to stop"),
        shell_id: C.string().optional().describe("Deprecated: use task_id instead")
    })), uCY = F6(() => C.object({
        message: C.string().describe("Status message about the operation"),
        task_id: C.string().describe("The ID of the task that was stopped"),
        task_type: C.string().describe("The type of the task that was stopped"),
        command: C.string().optional().describe("The command or description of the stopped task")
    })), Uk1 = {
        name: OC,
        searchHint: "kill a running background task",
        aliases: ["KillShell"],
        maxResultSizeChars: 1e5,
        userFacingName: () => e2() ? "" : "Stop Task",
        get inputSchema() {
            return xCY()
        },
        get outputSchema() {
            return uCY()
        },
        shouldDefer: !0,
        isEnabled() {
            return !0
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !1
        },
        toAutoClassifierInput(A) {
            return A.task_id ?? A.shell_id ?? ""
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
            let _ = K().tasks?.[Y];
            if (!_) return {
                result: !1,
                message: `No task found with ID: ${Y}`,
                errorCode: 1
            };
            if (!gk1(_.type)) return {
                result: !1,
                message: `Task ${Y} has unsupported type: ${_.type}`,
                errorCode: 2
            };
            if (_.status !== "running") return {
                result: !1,
                message: `Task ${Y} is not running (status: ${_.status})`,
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
            return G57
        },
        mapToolResultToToolResultBlockParam(A, q) {
            return {
                tool_use_id: q,
                type: "tool_result",
                content: B6(A)
            }
        },
        renderToolUseMessage: z1q,
        renderToolUseProgressMessage: _1q,
        renderToolUseRejectedMessage: w1q,
        renderToolUseErrorMessage: O1q,
        renderToolResultMessage: $1q,
        async call({
            task_id: A,
            shell_id: q
        }, {
            getAppState: K,
            setAppState: Y,
            abortController: z
        }) {
            let _ = A ?? q;
            if (!_) throw Error("Missing required parameter: task_id");
            let w = await Qk1(_, {
                abortController: z,
                getAppState: K,
                setAppState: Y
            });
            return {
                data: {
                    message: `Successfully stopped task: ${w.taskId} (${w.command})`,
                    task_id: w.taskId,
                    task_type: w.taskType,
                    command: w.command
                }
            }
        }
    }
})
// @from(Ln 362277, Col 0)
function mCY() {
    return Io("TASK_MAX_OUTPUT_LENGTH", process.env.TASK_MAX_OUTPUT_LENGTH, lg8, cg8).effective
}
// @from(Ln 362281, Col 0)
function j1q(A, q) {
    let K = mCY();
    if (A.length <= K) return {
        content: A,
        wasTruncated: !1
    };
    let z = `[Truncated. Full output: ${g2(q)}]

`,
        _ = K - z.length,
        w = A.slice(-_);
    return {
        content: z + w,
        wasTruncated: !0
    }
}
// @from(Ln 362297, Col 4)
cg8 = 160000
// @from(Ln 362298, Col 4)
lg8 = 32000
// @from(Ln 362299, Col 4)
ig8 = E(() => {
    rC6();
    SM()
})
// @from(Ln 362303, Col 0)
async function dk1(A) {
    let q;
    if (A.type === "local_bash") {
        let z = A.shellCommand?.taskOutput;
        if (z) {
            let _ = await z.getStdout(),
                w = z.getStderr();
            q = [_, w].filter(Boolean).join(`
`)
        } else q = await z38(A.id)
    } else q = await z38(A.id);
    let K = {
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
        let Y = A,
            z = Y.result?.content.filter((_) => _.type === "text").map((_) => _.text).join(`
`);
        return {
            ...K,
            prompt: Y.prompt,
            result: z || q,
            output: z || q,
            error: Y.error
        }
    }
    if (A.type === "remote_agent") return {
        ...K,
        prompt: A.command
    };
    return K
}
// @from(Ln 362343, Col 0)
async function gCY(A, q, K, Y) {
    let z = Date.now();
    while (Date.now() - z < K) {
        if (Y?.signal.aborted) throw new oY;
        let O = q().tasks?.[A];
        if (!O) return null;
        if (O.status !== "running" && O.status !== "pending") return O;
        await new Promise(($) => setTimeout($, 100))
    }
    return q().tasks?.[A] ?? null
}
// @from(Ln 362355, Col 0)
function FCY(A) {
    let q = A6(56),
        {
            content: K,
            verbose: Y,
            theme: z
        } = A,
        _ = Y === void 0 ? !1 : Y,
        w = Rq("app:toggleTranscript", "Global", "ctrl+o"),
        O;
    if (q[0] !== K) O = typeof K === "string" ? i1(K) : K, q[0] = K, q[1] = O;
    else O = q[1];
    let $ = O;
    if (!$.task) {
        let D;
        if (q[2] === Symbol.for("react.memo_cache_sentinel")) D = s3.default.createElement(t1, null, s3.default.createElement(T, {
            dimColor: !0
        }, "No task output available")), q[2] = D;
        else D = q[2];
        return D
    }
    let {
        task: H
    } = $;
    if (H.task_type === "local_bash") {
        let D;
        if (q[3] !== H.error || q[4] !== H.output) D = {
            stdout: H.output,
            stderr: "",
            isImage: !1,
            dangerouslyDisableSandbox: !0,
            returnCodeInterpretation: H.error
        }, q[3] = H.error, q[4] = H.output, q[5] = D;
        else D = q[5];
        let X = D,
            P;
        if (q[6] !== X || q[7] !== _) P = s3.default.createElement(gY6, {
            content: X,
            verbose: _
        }), q[6] = X, q[7] = _, q[8] = P;
        else P = q[8];
        return P
    }
    if (H.task_type === "local_agent") {
        let D;
        if (q[9] !== H.result) D = H.result ? H.result.split(`
`).length : 0, q[9] = H.result, q[10] = D;
        else D = q[10];
        let X = D;
        if ($.retrieval_status === "success") {
            if (_) {
                let Z;
                if (q[11] !== X || q[12] !== H.description) Z = s3.default.createElement(T, null, H.description, " (", X, " lines)"), q[11] = X, q[12] = H.description, q[13] = Z;
                else Z = q[13];
                let G;
                if (q[14] !== H.prompt || q[15] !== z) G = H.prompt && s3.default.createElement(Cc6, {
                    prompt: H.prompt,
                    theme: z,
                    dim: !0
                }), q[14] = H.prompt, q[15] = z, q[16] = G;
                else G = q[16];
                let f;
                if (q[17] !== H.result || q[18] !== z) f = H.result && s3.default.createElement(m, {
                    marginTop: 1
                }, s3.default.createElement(Cx8, {
                    content: [{
                        type: "text",
                        text: H.result
                    }],
                    theme: z
                })), q[17] = H.result, q[18] = z, q[19] = f;
                else f = q[19];
                let v;
                if (q[20] !== H.error) v = H.error && s3.default.createElement(m, {
                    flexDirection: "column",
                    marginTop: 1
                }, s3.default.createElement(T, {
                    color: "error",
                    bold: !0
                }, "Error:"), s3.default.createElement(m, {
                    paddingLeft: 2
                }, s3.default.createElement(T, {
                    color: "error"
                }, H.error))), q[20] = H.error, q[21] = v;
                else v = q[21];
                let N;
                if (q[22] !== G || q[23] !== f || q[24] !== v) N = s3.default.createElement(m, {
                    flexDirection: "column",
                    paddingLeft: 2,
                    marginTop: 1
                }, G, f, v), q[22] = G, q[23] = f, q[24] = v, q[25] = N;
                else N = q[25];
                let V;
                if (q[26] !== Z || q[27] !== N) V = s3.default.createElement(m, {
                    flexDirection: "column"
                }, Z, N), q[26] = Z, q[27] = N, q[28] = V;
                else V = q[28];
                return V
            }
            let W;
            if (q[29] !== w) W = s3.default.createElement(t1, null, s3.default.createElement(T, {
                dimColor: !0
            }, "Read output (", w, " to expand)")), q[29] = w, q[30] = W;
            else W = q[30];
            return W
        }
        if ($.retrieval_status === "timeout" || H.status === "running") {
            let W;
            if (q[31] === Symbol.for("react.memo_cache_sentinel")) W = s3.default.createElement(t1, null, s3.default.createElement(T, {
                dimColor: !0
            }, "Task is still running…")), q[31] = W;
            else W = q[31];
            return W
        }
        if ($.retrieval_status === "not_ready") {
            let W;
            if (q[32] === Symbol.for("react.memo_cache_sentinel")) W = s3.default.createElement(t1, null, s3.default.createElement(T, {
                dimColor: !0
            }, "Task is still running…")), q[32] = W;
            else W = q[32];
            return W
        }
        let P;
        if (q[33] === Symbol.for("react.memo_cache_sentinel")) P = s3.default.createElement(t1, null, s3.default.createElement(T, {
            dimColor: !0
        }, "Task not ready")), q[33] = P;
        else P = q[33];
        return P
    }
    if (H.task_type === "remote_agent") {
        let D;
        if (q[34] !== H.description || q[35] !== H.status) D = s3.default.createElement(T, null, "  ", H.description, " [", H.status, "]"), q[34] = H.description, q[35] = H.status, q[36] = D;
        else D = q[36];
        let X;
        if (q[37] !== H.output || q[38] !== _) X = H.output && _ && s3.default.createElement(m, {
            paddingLeft: 4,
            marginTop: 1
        }, s3.default.createElement(T, null, H.output)), q[37] = H.output, q[38] = _, q[39] = X;
        else X = q[39];
        let P;
        if (q[40] !== w || q[41] !== H.output || q[42] !== _) P = !_ && H.output && s3.default.createElement(T, {
            dimColor: !0
        }, "     ", "(", w, " to expand)"), q[40] = w, q[41] = H.output, q[42] = _, q[43] = P;
        else P = q[43];
        let W;
        if (q[44] !== D || q[45] !== X || q[46] !== P) W = s3.default.createElement(m, {
            flexDirection: "column"
        }, D, X, P), q[44] = D, q[45] = X, q[46] = P, q[47] = W;
        else W = q[47];
        return W
    }
    let j;
    if (q[48] !== H.description || q[49] !== H.status) j = s3.default.createElement(T, null, "  ", H.description, " [", H.status, "]"), q[48] = H.description, q[49] = H.status, q[50] = j;
    else j = q[50];
    let J;
    if (q[51] !== H.output) J = H.output && s3.default.createElement(m, {
        paddingLeft: 4
    }, s3.default.createElement(T, null, H.output.slice(0, 500))), q[51] = H.output, q[52] = J;
    else J = q[52];
    let M;
    if (q[53] !== j || q[54] !== J) M = s3.default.createElement(m, {
        flexDirection: "column"
    }, j, J), q[53] = j, q[54] = J, q[55] = M;
    else M = q[55];
    return M
}
// @from(Ln 362521, Col 4)
s3
// @from(Ln 362521, Col 8)
BCY
// @from(Ln 362521, Col 13)
ck1
// @from(Ln 362522, Col 4)
ng8 = E(() => {
    e6();
    K7();
    dq6();
    i6();
    s8();
    gj();
    kO();
    iq();
    SM();
    O0();
    cv1();
    wN1();
    g1();
    ig8();
    Rj();
    s3 = t(P6(), 1), BCY = F6(() => C.strictObject({
        task_id: C.string().describe("The task ID to get output from"),
        block: YX(C.boolean().default(!0)).describe("Whether to wait for completion"),
        timeout: C.number().min(0).max(600000).default(30000).describe("Max wait time in ms")
    }));
    ck1 = {
        name: $C,
        searchHint: "read output/logs from a background task",
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
        aliases: ["AgentOutputTool", "BashOutputTool"],
        userFacingName() {
            return "Task Output"
        },
        get inputSchema() {
            return BCY()
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
        toAutoClassifierInput(A) {
            return A.task_id
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
            if (!q().tasks?.[A]) return {
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
                task_id: _,
                block: w,
                timeout: O
            } = A, H = q.getAppState().tasks?.[_];
            if (!H) throw Error(`No task found with ID: ${_}`);
            if (!w) {
                if (H.status !== "running" && H.status !== "pending") return i9(_, q.setAppState, (J) => ({
                    ...J,
                    notified: !0
                })), {
                    data: {
                        retrieval_status: "success",
                        task: await dk1(H)
                    }
                };
                return {
                    data: {
                        retrieval_status: "not_ready",
                        task: await dk1(H)
                    }
                }
            }
            if (z) z({
                toolUseID: `task-output-waiting-${Date.now()}`,
                data: {
                    type: "waiting_for_task",
                    taskDescription: H.description,
                    taskType: H.type
                }
            });
            let j = await gCY(_, q.getAppState, O, q.abortController);
            if (!j) return {
                data: {
                    retrieval_status: "timeout",
                    task: null
                }
            };
            if (j.status === "running" || j.status === "pending") return {
                data: {
                    retrieval_status: "timeout",
                    task: await dk1(j)
                }
            };
            return i9(_, q.setAppState, (J) => ({
                ...J,
                notified: !0
            })), {
                data: {
                    retrieval_status: "success",
                    task: await dk1(j)
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
                    } = j1q(A.task.output, A.task.task_id);
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
            return s3.default.createElement(T, {
                dimColor: !0
            }, " ", A.task_id)
        },
        renderToolUseProgressMessage(A) {
            let K = A[A.length - 1]?.data;
            return s3.default.createElement(m, {
                flexDirection: "column"
            }, K?.taskDescription && s3.default.createElement(T, null, "  ", K.taskDescription), s3.default.createElement(T, null, "     Waiting for task", " ", s3.default.createElement(T, {
                dimColor: !0
            }, "(esc to give additional instructions)")))
        },
        renderToolResultMessage(A, q, {
            verbose: K,
            theme: Y
        }) {
            return s3.default.createElement(FCY, {
                content: A,
                verbose: K,
                theme: Y
            })
        },
        renderToolUseRejectedMessage() {
            return s3.default.createElement(T3, null)
        },
        renderToolUseErrorMessage(A, {
            verbose: q
        }) {
            return s3.default.createElement(eK, {
                result: A,
                verbose: q
            })
        }
    }
})
// @from(Ln 362726, Col 0)
function pCY(A) {
    let q = 0,
        K = 0;
    for (let Y of A)
        if (Y != null && typeof Y !== "string") q++, K += Y.content?.length ?? 0;
    return {
        searchCount: q,
        totalResultCount: K
    }
}
// @from(Ln 362737, Col 0)
function J1q({
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
// @from(Ln 362754, Col 0)
function M1q() {
    return tg.default.createElement(T3, null)
}
// @from(Ln 362758, Col 0)
function D1q(A, {
    verbose: q
}) {
    return tg.default.createElement(eK, {
        result: A,
        verbose: q
    })
}
// @from(Ln 362767, Col 0)
function X1q(A) {
    if (A.length === 0) return null;
    let q = A[A.length - 1];
    if (!q?.data) return null;
    let K = q.data;
    switch (K.type) {
        case "query_update":
            return tg.default.createElement(t1, null, tg.default.createElement(T, {
                dimColor: !0
            }, "Searching: ", K.query));
        case "search_results_received":
            return tg.default.createElement(t1, null, tg.default.createElement(T, {
                dimColor: !0
            }, "Found ", K.resultCount, ' results for "', K.query, '"'));
        default:
            return null
    }
}
// @from(Ln 362786, Col 0)
function P1q(A) {
    let {
        searchCount: q
    } = pCY(A.results ?? []), K = A.durationSeconds >= 1 ? `${Math.round(A.durationSeconds)}s` : `${Math.round(A.durationSeconds*1000)}ms`;
    return tg.default.createElement(m, {
        justifyContent: "space-between",
        width: "100%"
    }, tg.default.createElement(t1, {
        height: 1
    }, tg.default.createElement(T, null, "Did ", q, " search", q !== 1 ? "es" : "", " in ", K)))
}
// @from(Ln 362798, Col 0)
function rg8(A) {
    if (!A?.query) return null;
    return R3(A.query, EI)
}
// @from(Ln 362802, Col 4)
tg
// @from(Ln 362803, Col 4)
W1q = E(() => {
    i6();
    iq();
    gj();
    kO();
    M4();
    tg = t(P6(), 1)
})
// @from(Ln 362812, Col 0)
function lCY(A, q, K) {
    let Y = [],
        z = "",
        _ = !0;
    for (let w of A) {
        if (w.type === "server_tool_use") {
            if (_) {
                if (_ = !1, z.trim().length > 0) Y.push(z.trim());
                z = ""
            }
            continue
        }
        if (w.type === "web_search_tool_result") {
            if (!Array.isArray(w.content)) {
                let $ = `Web search error: ${w.content.error_code}`;
                _6(Error($)), Y.push($);
                continue
            }
            let O = w.content.map(($) => ({
                title: $.title,
                url: $.url
            }));
            Y.push({
                tool_use_id: w.tool_use_id,
                content: O
            })
        }
        if (w.type === "text")
            if (_) z += w.text;
            else _ = !0, z = w.text
    }
    if (z.length) Y.push(z.trim());
    return {
        query: q,
        results: Y,
        durationSeconds: K
    }
}
// @from(Ln 362850, Col 4)
QCY
// @from(Ln 362850, Col 9)
UCY
// @from(Ln 362850, Col 14)
dCY
// @from(Ln 362850, Col 19)
cCY = (A) => {
        return {
            type: "web_search_20250305",
            name: "web_search",
            allowed_domains: A.allowed_domains,
            blocked_domains: A.blocked_domains,
            max_uses: 8
        }
    }
// @from(Ln 362859, Col 4)
lk1
// @from(Ln 362860, Col 4)
og8 = E(() => {
    K7();
    cq6();
    gw();
    JA();
    z4();
    HA();
    Nz();
    k1();
    W1q();
    g1();
    QCY = F6(() => C.strictObject({
        query: C.string().min(2).describe("The search query to use"),
        allowed_domains: C.array(C.string()).optional().describe("Only include search results from these domains"),
        blocked_domains: C.array(C.string()).optional().describe("Never include search results from these domains")
    })), UCY = F6(() => {
        let A = C.object({
            title: C.string().describe("The title of the search result"),
            url: C.string().describe("The URL of the search result")
        });
        return C.object({
            tool_use_id: C.string().describe("ID of the tool use"),
            content: C.array(A).describe("Array of search hits")
        })
    }), dCY = F6(() => C.object({
        query: C.string().describe("The search query that was executed"),
        results: C.array(C.union([UCY(), C.string()])).describe("Search results and/or text commentary from the model"),
        durationSeconds: C.number().describe("Time taken to complete the search operation")
    }));
    lk1 = {
        name: jv,
        searchHint: "search the web for current information",
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
        async description(A) {
            return `Claude wants to search the web for: ${A.query}`
        },
        userFacingName() {
            return "Web Search"
        },
        getToolUseSummary: rg8,
        getActivityDescription(A) {
            let q = rg8(A);
            return q ? `Searching for ${q}` : "Searching the web"
        },
        isEnabled() {
            let A = QA(),
                q = cK();
            if (A === "firstParty") return !0;
            if (A === "vertex") return q.includes("claude-opus-4") || q.includes("claude-sonnet-4") || q.includes("claude-haiku-4");
            if (A === "foundry") return !0;
            return !1
        },
        get inputSchema() {
            return QCY()
        },
        get outputSchema() {
            return dCY()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(A) {
            return A.query
        },
        async checkPermissions(A) {
            return {
                behavior: "passthrough",
                message: "WebSearchTool requires permission.",
                suggestions: [{
                    type: "addRules",
                    rules: [{
                        toolName: jv
                    }],
                    behavior: "allow",
                    destination: "localSettings"
                }]
            }
        },
        async prompt() {
            return uG7()
        },
        renderToolUseMessage: J1q,
        renderToolUseRejectedMessage: M1q,
        renderToolUseErrorMessage: D1q,
        renderToolUseProgressMessage: X1q,
        renderToolResultMessage: P1q,
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
            let _ = performance.now(),
                {
                    query: w
                } = A,
                O = p1({
                    content: "Perform a web search for the query: " + w
                }),
                $ = cCY(A),
                H = w8("tengu_plum_vx3", !1),
                j = q.getAppState(),
                J = NT6({
                    messages: [O],
                    systemPrompt: uq(["You are an assistant for performing a web search tool use"]),
                    thinkingConfig: H ? {
                        type: "disabled"
                    } : q.options.thinkingConfig,
                    tools: [],
                    signal: q.abortController.signal,
                    options: {
                        getToolPermissionContext: async () => j.toolPermissionContext,
                        model: H ? lH() : q.options.mainLoopModel,
                        toolChoice: H ? {
                            type: "tool",
                            name: "web_search"
                        } : void 0,
                        isNonInteractiveSession: q.options.isNonInteractiveSession,
                        hasAppendSystemPrompt: !!q.options.appendSystemPrompt,
                        extraToolSchemas: [$],
                        querySource: "web_search_tool",
                        agents: q.options.agentDefinitions.activeAgents,
                        mcpTools: [],
                        agentId: q.agentId,
                        effortValue: j.effortValue
                    }
                }),
                M = [],
                D = null,
                X = "",
                P = 0,
                W = new Map;
            for await (let V of J) {
                if (M.push(V), V.type === "stream_event" && V.event?.type === "content_block_start") {
                    let L = V.event.content_block;
                    if (L && L.type === "server_tool_use") {
                        D = L.id, X = "";
                        continue
                    }
                }
                if (D && V.type === "stream_event" && V.event?.type === "content_block_delta") {
                    let L = V.event.delta;
                    if (L?.type === "input_json_delta" && L.partial_json) {
                        X += L.partial_json;
                        try {
                            let h = X.match(/"query"\s*:\s*"((?:[^"\\]|\\.)*)"/);
                            if (h && h[1]) {
                                let R = i1('"' + h[1] + '"');
                                if (!W.has(D) || W.get(D) !== R) {
                                    if (W.set(D, R), P++, z) z({
                                        toolUseID: `search-progress-${P}`,
                                        data: {
                                            type: "query_update",
                                            query: R
                                        }
                                    })
                                }
                            }
                        } catch {}
                    }
                }
                if (V.type === "stream_event" && V.event?.type === "content_block_start") {
                    let L = V.event.content_block;
                    if (L && L.type === "web_search_tool_result") {
                        let h = L.tool_use_id,
                            R = W.get(h) || w,
                            u = L.content;
                        if (P++, z) z({
                            toolUseID: h || `search-progress-${P}`,
                            data: {
                                type: "search_results_received",
                                resultCount: Array.isArray(u) ? u.length : 0,
                                query: R
                            }
                        })
                    }
                }
            }
            let G = M.filter((V) => V.type === "assistant").flatMap((V) => V.message.content),
                v = (performance.now() - _) / 1000;
            return {
                data: lCY(G, w, v)
            }
        },
        mapToolResultToToolResultBlockParam(A, q) {
            let {
                query: K,
                results: Y
            } = A, z = `Web search results for query: "${K}"

`;
            return (Y ?? []).forEach((_) => {
                if (_ == null) return;
                if (typeof _ === "string") z += _ + `

`;
                else if (_.content?.length > 0) z += `Links: ${B6(_.content)}

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
// @from(Ln 363090, Col 4)
Z1q = `Use this tool when you are in plan mode and have finished writing your plan to the plan file and are ready for user approval.

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
// @from(Ln 363115, Col 0)
function G1q() {
    return null
}
// @from(Ln 363119, Col 0)
function f1q() {
    return null
}
// @from(Ln 363123, Col 0)
function T1q(A, q, {
    theme: K
}) {
    let {
        plan: Y,
        filePath: z
    } = A, _ = !Y || Y.trim() === "", w = z ? $K(z) : "", O = A.awaitingLeaderApproval;
    if (_) return N5.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, N5.createElement(m, {
        flexDirection: "row"
    }, N5.createElement(T, {
        color: kG("plan")
    }, I3), N5.createElement(T, null, " Exited plan mode")));
    if (O) return N5.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, N5.createElement(m, {
        flexDirection: "row"
    }, N5.createElement(T, {
        color: kG("plan")
    }, I3), N5.createElement(T, null, " Plan submitted for team lead approval")), N5.createElement(t1, null, N5.createElement(m, {
        flexDirection: "column"
    }, z && N5.createElement(T, {
        dimColor: !0
    }, "Plan file: ", w), N5.createElement(T, {
        dimColor: !0
    }, "Waiting for team lead to review and approve..."))));
    return N5.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, N5.createElement(m, {
        flexDirection: "row"
    }, N5.createElement(T, {
        color: kG("plan")
    }, I3), N5.createElement(T, null, " User approved Claude's plan")), N5.createElement(t1, null, N5.createElement(m, {
        flexDirection: "column"
    }, z && N5.createElement(T, {
        dimColor: !0
    }, "Plan saved to: ", w, " · /plan to edit"), N5.createElement(U_, null, Y))))
}
// @from(Ln 363166, Col 0)
function v1q({
    plan: A
}, {
    theme: q
}) {
    let K = A ?? sJ() ?? "No plan found";
    return N5.createElement(m, {
        flexDirection: "column"
    }, N5.createElement(jZ1, {
        plan: K
    }))
}
// @from(Ln 363179, Col 0)
function N1q() {
    return null
}
// @from(Ln 363182, Col 4)
N5
// @from(Ln 363183, Col 4)
V1q = E(() => {
    i6();
    ov();
    iq();
    qw();
    yy8();
    rD();
    rH();
    Z7();
    N5 = t(P6(), 1)
})
// @from(Ln 363195, Col 0)
function ik1(A, q) {
    for (let K of Object.values(q.tasks))
        if (M$(K) && K.identity.agentName === A) return K.id;
    return
}
// @from(Ln 363201, Col 0)
function ag8(A, q, K) {
    i9(A, q, (Y) => ({
        ...Y,
        awaitingPlanApproval: K
    }))
}
// @from(Ln 363208, Col 0)
function k1q(A, q, K) {
    ag8(A, K, !1)
}
// @from(Ln 363211, Col 4)
sg8 = E(() => {
    qH();
    O0()
})
// @from(Ln 363215, Col 4)
VT6 = {}
// @from(Ln 363226, Col 0)
function qF8(A) {
    tg8 = A
}
// @from(Ln 363230, Col 0)
function iCY() {
    return tg8
}
// @from(Ln 363234, Col 0)
function nCY(A) {
    eg8 = A
}
// @from(Ln 363238, Col 0)
function rCY() {
    return eg8
}
// @from(Ln 363242, Col 0)
function oCY(A) {
    AF8 = A
}
// @from(Ln 363246, Col 0)
function aCY() {
    return AF8
}
// @from(Ln 363250, Col 0)
function sCY() {
    tg8 = !1, eg8 = !1, AF8 = !1
}
// @from(Ln 363253, Col 4)
tg8 = !1
// @from(Ln 363254, Col 4)
eg8 = !1
// @from(Ln 363255, Col 4)
AF8 = !1
// @from(Ln 363256, Col 4)
tCY
// @from(Ln 363256, Col 9)
sl6
// @from(Ln 363256, Col 14)
eCY
// @from(Ln 363256, Col 19)
E1q
// @from(Ln 363256, Col 24)
dsw
// @from(Ln 363256, Col 29)
AIY
// @from(Ln 363256, Col 34)
zD
// @from(Ln 363257, Col 4)
tl6 = E(() => {
    K7();
    V1q();
    rH();
    g1();
    Qz();
    zz();
    qH();
    sg8();
    H1();
    V1();
    T1();
    tCY = k4(VT6), sl6 = (rJ(), k4(y1q)), eCY = F6(() => C.object({
        tool: C.enum(["Bash"]).describe("The tool this prompt applies to"),
        prompt: C.string().describe('Semantic description of the action, e.g. "run tests", "install dependencies"')
    })), E1q = F6(() => C.strictObject({
        allowedPrompts: C.array(eCY()).optional().describe("Prompt-based permissions needed to implement the plan. These describe categories of actions rather than specific commands.")
    }).passthrough()), dsw = F6(() => E1q().extend({
        plan: C.string().optional().describe("The plan content (injected by normalizeToolInput from disk)"),
        planFilePath: C.string().optional().describe("The plan file path (injected by normalizeToolInput)")
    })), AIY = F6(() => C.object({
        plan: C.string().nullable().describe("The plan that was presented to the user"),
        isAgent: C.boolean(),
        filePath: C.string().optional().describe("The file path where the plan was saved"),
        hasTaskTool: C.boolean().optional().describe("Whether the Agent tool is available in the current context"),
        awaitingLeaderApproval: C.boolean().optional().describe("When true, the teammate has sent a plan approval request to the team leader"),
        requestId: C.string().optional().describe("Unique identifier for the plan approval request"),
        isUltraplan: C.boolean().optional().describe("Whether this plan was generated by an ultraplan remote session")
    })), zD = {
        name: aJ,
        searchHint: "present plan for approval and start coding (plan mode only)",
        maxResultSizeChars: 1e5,
        async description() {
            return "Prompts the user to exit plan mode and start coding"
        },
        async prompt() {
            return Z1q
        },
        get inputSchema() {
            return E1q()
        },
        get outputSchema() {
            return AIY()
        },
        userFacingName() {
            return ""
        },
        shouldDefer: !0,
        isEnabled() {
            return !0
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !1
        },
        toAutoClassifierInput() {
            return ""
        },
        requiresUserInteraction() {
            if ($Y()) return !1;
            return !0
        },
        async validateInput(A, {
            getAppState: q,
            options: K
        }) {
            if ($Y()) return {
                result: !0
            };
            let Y = q().toolPermissionContext.mode;
            if (Y !== "plan") return d("tengu_exit_plan_mode_called_outside_plan", {
                model: K.mainLoopModel,
                mode: Y,
                hasExitedPlanModeInSession: nk6()
            }), {
                result: !1,
                message: "You are not in plan mode. This tool is only for exiting plan mode after writing a plan. If your plan was already approved, continue with implementation.",
                errorCode: 1
            };
            return {
                result: !0
            }
        },
        async checkPermissions(A, q) {
            if ($Y()) return {
                behavior: "allow",
                updatedInput: A
            };
            return {
                behavior: "ask",
                message: "Exit plan mode?",
                updatedInput: A
            }
        },
        renderToolUseMessage: G1q,
        renderToolUseProgressMessage: f1q,
        renderToolResultMessage: T1q,
        renderToolUseRejectedMessage: v1q,
        renderToolUseErrorMessage: N1q,
        async call(A, q) {
            let K = !!q.agentId,
                Y = Fj(q.agentId),
                z = sJ(q.agentId);
            if ($Y() && NF6()) {
                if (!z) throw Error(`No plan file found at ${Y}. Please write your plan to this file before calling ExitPlanMode.`);
                let H = i3() || "unknown",
                    j = l5(),
                    J = bZ6("plan_approval", ak(H, j || "default")),
                    M = {
                        type: "plan_approval_request",
                        from: H,
                        timestamp: new Date().toISOString(),
                        planFilePath: Y,
                        planContent: z,
                        requestId: J
                    };
                await x3("team-lead", {
                    from: H,
                    text: B6(M),
                    timestamp: new Date().toISOString()
                }, j);
                let D = q.getAppState(),
                    X = ik1(H, D);
                if (X) ag8(X, q.setAppState, !0);
                return {
                    data: {
                        plan: z,
                        isAgent: !0,
                        filePath: Y,
                        awaitingLeaderApproval: !0,
                        requestId: J
                    }
                }
            }
            let _ = q.getAppState(),
                w = _.toolPermissionContext.prePlanMode === "ultraplan",
                O = null;
            {
                let H = _.toolPermissionContext.prePlanMode ?? "default",
                    j = H === "ultraplan" ? "default" : H;
                if ((j === "auto" || !1) && !(sl6?.isAutoModeGateEnabled() ?? !1)) {
                    let M = sl6?.getAutoModeUnavailableReason() ?? "circuit-breaker";
                    O = sl6?.getAutoModeUnavailableNotification(M) ?? "auto mode unavailable", k(`[auto-mode gate @ ExitPlanModeV2Tool] prePlanMode=${j} but gate is off (reason=${M}) — falling back to default on plan exit`, {
                        level: "warn"
                    })
                }
            }
            if (O) q.addNotification?.({
                key: "auto-mode-gate-plan-exit-fallback",
                text: `plan exit → default · ${O}`,
                priority: "immediate",
                color: "warning",
                timeoutMs: 1e4
            });
            q.setAppState((H) => {
                if (H.toolPermissionContext.mode !== "plan") return H;
                HV(!0), JS(!0);
                let j = H.toolPermissionContext.prePlanMode ?? "default",
                    J = j === "ultraplan" ? "default" : j;
                {
                    if ((J === "auto" || !1) && !(sl6?.isAutoModeGateEnabled() ?? !1)) J = "default";
                    let X = J === "auto" || !1;
                    if (tCY?.setAutoModeActive(X), j === "auto" && J !== "auto") MS(!0)
                }
                let M = J !== "auto" ? sl6?.restoreDangerousPermissions(H.toolPermissionContext) ?? H.toolPermissionContext : H.toolPermissionContext;
                return {
                    ...H,
                    toolPermissionContext: {
                        ...M,
                        mode: J,
                        prePlanMode: void 0
                    }
                }
            });
            let $ = E7() && q.options.tools.some((H) => z3(H, r4));
            return {
                data: {
                    plan: z,
                    isAgent: K,
                    filePath: Y,
                    hasTaskTool: $ || void 0,
                    isUltraplan: w || void 0
                }
            }
        },
        mapToolResultToToolResultBlockParam({
            isAgent: A,
            plan: q,
            filePath: K,
            hasTaskTool: Y,
            awaitingLeaderApproval: z,
            requestId: _,
            isUltraplan: w
        }, O) {
            if (z) return {
                type: "tool_result",
                content: `Your plan has been submitted to the team lead for approval.

Plan file: ${K}

**What happens next:**
1. Wait for the team lead to review your plan
2. You will receive a message in your inbox with approval/rejection
3. If approved, you can proceed with implementation
4. If rejected, refine your plan based on the feedback

**Important:** Do NOT proceed until you receive approval. Check your inbox for response.

Request ID: ${_}`,
                tool_use_id: O
            };
            if (A) return {
                type: "tool_result",
                content: 'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"',
                tool_use_id: O
            };
            if (!q || q.trim() === "") return {
                type: "tool_result",
                content: "User has approved exiting plan mode. You can now proceed.",
                tool_use_id: O
            };
            if (w) return {
                type: "tool_result",
                content: "User has reviewed the ultraplan. There is nothing else to do. Respond with a brief summary of the plan.",
                tool_use_id: O
            };
            let $ = Y ? `

If this plan can be broken down into multiple independent tasks, consider using the ${SI} tool to create a team and parallelize the work.` : "";
            return {
                type: "tool_result",
                content: `User has approved your plan. You can now start coding. Start with updating your todo list if applicable

Your plan has been saved to: ${K}
You can refer back to it if needed during implementation.${$}

## Approved Plan:
${q}`,
                tool_use_id: O
            }
        }
    }
})
// @from(Ln 363502, Col 4)
nsw
// @from(Ln 363503, Col 4)
L1q = E(() => {
    K7();
    nsw = F6(() => C.strictObject({}))
})
// @from(Ln 363508, Col 0)
function _IY(A) {
    let q = A6(3),
        {
            answers: K
        } = A,
        Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = wH.createElement(m, {
        flexDirection: "row"
    }, wH.createElement(T, {
        color: kG("default")
    }, I3, " "), wH.createElement(T, null, "User answered Claude's questions:")), q[0] = Y;
    else Y = q[0];
    let z;
    if (q[1] !== K) z = wH.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, Y, wH.createElement(t1, null, wH.createElement(m, {
        flexDirection: "column"
    }, Object.entries(K).map(wIY)))), q[1] = K, q[2] = z;
    else z = q[2];
    return z
}
// @from(Ln 363531, Col 0)
function wIY(A) {
    let [q, K] = A;
    return wH.createElement(T, {
        key: q,
        color: "inactive"
    }, "· ", q, " → ", K)
}
// @from(Ln 363539, Col 0)
function OIY(A) {
    if (A === void 0) return null;
    if (/<\s*(html|body|!doctype)\b/i.test(A)) return "preview must be an HTML fragment, not a full document (no <html>, <body>, or <!DOCTYPE>)";
    if (/<\s*(script|style)\b/i.test(A)) return "preview must not contain <script> or <style> tags. Use inline styles via the style attribute if needed.";
    if (!/<[a-z][^>]*>/i.test(A)) return 'preview must contain HTML (previewFormat is set to "html"). Wrap content in a tag like <div> or <pre>.';
    return null
}
// @from(Ln 363546, Col 4)
wH
// @from(Ln 363546, Col 8)
qIY
// @from(Ln 363546, Col 13)
h1q
// @from(Ln 363546, Col 18)
S1q
// @from(Ln 363546, Col 23)
R1q
// @from(Ln 363546, Col 28)
KIY
// @from(Ln 363546, Col 33)
YIY
// @from(Ln 363546, Col 38)
zIY
// @from(Ln 363546, Col 43)
kT6
// @from(Ln 363547, Col 4)
nk1 = E(() => {
    e6();
    K7();
    i6();
    iq();
    qw();
    ct();
    rD();
    T1();
    wH = t(P6(), 1), qIY = F6(() => C.object({
        label: C.string().describe("The display text for this option that the user will see and select. Should be concise (1-5 words) and clearly describe the choice."),
        description: C.string().describe("Explanation of what this option means or what will happen if chosen. Useful for providing context about trade-offs or implications."),
        preview: C.string().optional().describe("Optional preview content rendered when this option is focused. Use for mockups, code snippets, or visual comparisons that help users compare options. See the tool description for the expected content format.")
    })), h1q = F6(() => C.object({
        question: C.string().describe('The complete question to ask the user. Should be clear, specific, and end with a question mark. Example: "Which library should we use for date formatting?" If multiSelect is true, phrase it accordingly, e.g. "Which features do you want to enable?"'),
        header: C.string().describe(`Very short label displayed as a chip/tag (max ${$Y4} chars). Examples: "Auth method", "Library", "Approach".`),
        options: C.array(qIY()).min(2).max(4).describe("The available choices for this question. Must have 2-4 options. Each option should be a distinct, mutually exclusive choice (unless multiSelect is enabled). There should be no 'Other' option, that will be provided automatically."),
        multiSelect: C.boolean().default(!1).describe("Set to true to allow the user to select multiple options instead of just one. Use when choices are not mutually exclusive.")
    })), S1q = F6(() => {
        let A = C.object({
            preview: C.string().optional().describe("The preview content of the selected option, if the question used previews."),
            notes: C.string().optional().describe("Free-text notes the user added to their selection.")
        });
        return C.record(C.string(), A).optional().describe("Optional per-question annotations from the user (e.g., notes on preview selections). Keyed by question text.")
    }), R1q = {
        check: (A) => {
            let q = A.questions.map((K) => K.question);
            if (q.length !== new Set(q).size) return !1;
            for (let K of A.questions) {
                let Y = K.options.map((z) => z.label);
                if (Y.length !== new Set(Y).size) return !1
            }
            return !0
        },
        message: "Question texts must be unique, option labels must be unique within each question"
    }, KIY = F6(() => ({
        answers: C.record(C.string(), C.string()).optional().describe("User answers collected by the permission component"),
        annotations: S1q(),
        metadata: C.object({
            source: C.string().optional().describe('Optional identifier for the source of this question (e.g., "remember" for /remember command). Used for analytics tracking.')
        }).optional().describe("Optional metadata for tracking and analytics purposes. Not displayed to user.")
    })), YIY = F6(() => C.strictObject({
        questions: C.array(h1q()).min(1).max(4).describe("Questions to ask the user (1-4 questions)"),
        ...KIY()
    }).refine(R1q.check, {
        message: R1q.message
    })), zIY = F6(() => C.object({
        questions: C.array(h1q()).describe("The questions that were asked"),
        answers: C.record(C.string(), C.string()).describe("The answers provided by the user (question text -> answer string; multi-select answers are comma-separated)"),
        annotations: S1q()
    }));
    kT6 = {
        name: Fw,
        searchHint: "prompt the user with a multiple-choice question",
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
        async description() {
            return HY4
        },
        async prompt() {
            let A = kt6();
            if (A === void 0) return yV8;
            return yV8 + jY4[A]
        },
        get inputSchema() {
            return YIY()
        },
        get outputSchema() {
            return zIY()
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
        toAutoClassifierInput(A) {
            return A.questions.map((q) => q.question).join(" | ")
        },
        requiresUserInteraction() {
            return !0
        },
        async validateInput({
            questions: A
        }) {
            if (kt6() !== "html") return {
                result: !0
            };
            for (let q of A)
                for (let K of q.options) {
                    let Y = OIY(K.preview);
                    if (Y) return {
                        result: !1,
                        message: `Option "${K.label}" in question "${q.question}": ${Y}`,
                        errorCode: 1
                    }
                }
            return {
                result: !0
            }
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
            return wH.createElement(_IY, {
                answers: A
            })
        },
        renderToolUseRejectedMessage() {
            return wH.createElement(m, {
                flexDirection: "row",
                marginTop: 1
            }, wH.createElement(T, {
                color: kG("default")
            }, I3, " "), wH.createElement(T, null, "User declined to answer questions"))
        },
        renderToolUseErrorMessage() {
            return null
        },
        async call({
            questions: A,
            answers: q = {},
            annotations: K
        }, Y) {
            return {
                data: {
                    questions: A,
                    answers: q,
                    ...K && {
                        annotations: K
                    }
                }
            }
        },
        mapToolResultToToolResultBlockParam({
            answers: A,
            annotations: q
        }, K) {
            return {
                type: "tool_result",
                content: `User has answered your questions: ${Object.entries(A).map(([z,_])=>{let w=q?.[z],O=[`"${z}"="${_}"`];if(w?.preview)O.push(`selected preview:
${w.preview}`);if(w?.notes)O.push(`user notes: ${w.notes}`);return O.join(" ")}).join(", ")}. You can now continue with the user's answers in mind.`,
                tool_use_id: K
            }
        }
    }
})
// @from(Ln 363713, Col 4)
C1q