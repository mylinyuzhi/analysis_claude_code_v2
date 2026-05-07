
// @from(Ln 286011, Col 4)
Wd4 = p((Gaw, Pd4) => {
    function To1(q) {
        if (q instanceof Map) q.clear = q.delete = q.set = function() {
            throw Error("map is read-only")
        };
        else if (q instanceof Set) q.add = q.clear = q.delete = function() {
            throw Error("set is read-only")
        };
        return Object.freeze(q), Object.getOwnPropertyNames(q).forEach(function(K) {
            var _ = q[K];
            if (typeof _ == "object" && !Object.isFrozen(_)) To1(_)
        }), q
    }
    var Ad4 = To1,
        ykz = To1;
    Ad4.default = ykz;
    class Go1 {
        constructor(q) {
            if (q.data === void 0) q.data = {};
            this.data = q.data, this.isMatchIgnored = !1
        }
        ignoreMatch() {
            this.isMatchIgnored = !0
        }
    }

    function ER6(q) {
        return q.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;")
    }

    function z36(q, ...K) {
        let _ = Object.create(null);
        for (let z in q) _[z] = q[z];
        return K.forEach(function(z) {
            for (let Y in z) _[Y] = z[Y]
        }), _
    }
    var Lkz = "</span>",
        eQ4 = (q) => {
            return !!q.kind
        };
    class Od4 {
        constructor(q, K) {
            this.buffer = "", this.classPrefix = K.classPrefix, q.walk(this)
        }
        addText(q) {
            this.buffer += ER6(q)
        }
        openNode(q) {
            if (!eQ4(q)) return;
            let K = q.kind;
            if (!q.sublanguage) K = `${this.classPrefix}${K}`;
            this.span(K)
        }
        closeNode(q) {
            if (!eQ4(q)) return;
            this.buffer += Lkz
        }
        value() {
            return this.buffer
        }
        span(q) {
            this.buffer += `<span class="${q}">`
        }
    }
    class Vo1 {
        constructor() {
            this.rootNode = {
                children: []
            }, this.stack = [this.rootNode]
        }
        get top() {
            return this.stack[this.stack.length - 1]
        }
        get root() {
            return this.rootNode
        }
        add(q) {
            this.top.children.push(q)
        }
        openNode(q) {
            let K = {
                kind: q,
                children: []
            };
            this.add(K), this.stack.push(K)
        }
        closeNode() {
            if (this.stack.length > 1) return this.stack.pop();
            return
        }
        closeAllNodes() {
            while (this.closeNode());
        }
        toJSON() {
            return JSON.stringify(this.rootNode, null, 4)
        }
        walk(q) {
            return this.constructor._walk(q, this.rootNode)
        }
        static _walk(q, K) {
            if (typeof K === "string") q.addText(K);
            else if (K.children) q.openNode(K), K.children.forEach((_) => this._walk(q, _)), q.closeNode(K);
            return q
        }
        static _collapse(q) {
            if (typeof q === "string") return;
            if (!q.children) return;
            if (q.children.every((K) => typeof K === "string")) q.children = [q.children.join("")];
            else q.children.forEach((K) => {
                Vo1._collapse(K)
            })
        }
    }
    class wd4 extends Vo1 {
        constructor(q) {
            super();
            this.options = q
        }
        addKeyword(q, K) {
            if (q === "") return;
            this.openNode(K), this.addText(q), this.closeNode()
        }
        addText(q) {
            if (q === "") return;
            this.add(q)
        }
        addSublanguage(q, K) {
            let _ = q.root;
            _.kind = K, _.sublanguage = !0, this.add(_)
        }
        toHTML() {
            return new Od4(this, this.options).value()
        }
        finalize() {
            return !0
        }
    }

    function hkz(q) {
        return new RegExp(q.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "m")
    }

    function q78(q) {
        if (!q) return null;
        if (typeof q === "string") return q;
        return q.source
    }

    function Rkz(...q) {
        return q.map((_) => q78(_)).join("")
    }

    function Skz(...q) {
        return "(" + q.map((_) => q78(_)).join("|") + ")"
    }

    function Ckz(q) {
        return new RegExp(q.toString() + "|").exec("").length - 1
    }

    function bkz(q, K) {
        let _ = q && q.exec(K);
        return _ && _.index === 0
    }
    var Ikz = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;

    function xkz(q, K = "|") {
        let _ = 0;
        return q.map((z) => {
            _ += 1;
            let Y = _,
                A = q78(z),
                O = "";
            while (A.length > 0) {
                let w = Ikz.exec(A);
                if (!w) {
                    O += A;
                    break
                }
                if (O += A.substring(0, w.index), A = A.substring(w.index + w[0].length), w[0][0] === "\\" && w[1]) O += "\\" + String(Number(w[1]) + Y);
                else if (O += w[0], w[0] === "(") _++
            }
            return O
        }).map((z) => `(${z})`).join(K)
    }
    var ukz = /\b\B/,
        $d4 = "[a-zA-Z]\\w*",
        ko1 = "[a-zA-Z_]\\w*",
        No1 = "\\b\\d+(\\.\\d+)?",
        jd4 = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",
        Hd4 = "\\b(0b[01]+)",
        mkz = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
        Bkz = (q = {}) => {
            let K = /^#![ ]*\//;
            if (q.binary) q.begin = Rkz(K, /.*\b/, q.binary, /\b.*/);
            return z36({
                className: "meta",
                begin: K,
                end: /$/,
                relevance: 0,
                "on:begin": (_, z) => {
                    if (_.index !== 0) z.ignoreMatch()
                }
            }, q)
        },
        K78 = {
            begin: "\\\\[\\s\\S]",
            relevance: 0
        },
        pkz = {
            className: "string",
            begin: "'",
            end: "'",
            illegal: "\\n",
            contains: [K78]
        },
        Fkz = {
            className: "string",
            begin: '"',
            end: '"',
            illegal: "\\n",
            contains: [K78]
        },
        Jd4 = {
            begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
        },
        Yu8 = function(q, K, _ = {}) {
            let z = z36({
                className: "comment",
                begin: q,
                end: K,
                contains: []
            }, _);
            return z.contains.push(Jd4), z.contains.push({
                className: "doctag",
                begin: "(?:TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):",
                relevance: 0
            }), z
        },
        gkz = Yu8("//", "$"),
        Ukz = Yu8("/\\*", "\\*/"),
        Qkz = Yu8("#", "$"),
        dkz = {
            className: "number",
            begin: No1,
            relevance: 0
        },
        ckz = {
            className: "number",
            begin: jd4,
            relevance: 0
        },
        lkz = {
            className: "number",
            begin: Hd4,
            relevance: 0
        },
        nkz = {
            className: "number",
            begin: No1 + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
            relevance: 0
        },
        ikz = {
            begin: /(?=\/[^/\n]*\/)/,
            contains: [{
                className: "regexp",
                begin: /\//,
                end: /\/[gimuy]*/,
                illegal: /\n/,
                contains: [K78, {
                    begin: /\[/,
                    end: /\]/,
                    relevance: 0,
                    contains: [K78]
                }]
            }]
        },
        rkz = {
            className: "title",
            begin: $d4,
            relevance: 0
        },
        okz = {
            className: "title",
            begin: ko1,
            relevance: 0
        },
        akz = {
            begin: "\\.\\s*" + ko1,
            relevance: 0
        },
        skz = function(q) {
            return Object.assign(q, {
                "on:begin": (K, _) => {
                    _.data._beginMatch = K[1]
                },
                "on:end": (K, _) => {
                    if (_.data._beginMatch !== K[1]) _.ignoreMatch()
                }
            })
        },
        zu8 = Object.freeze({
            __proto__: null,
            MATCH_NOTHING_RE: ukz,
            IDENT_RE: $d4,
            UNDERSCORE_IDENT_RE: ko1,
            NUMBER_RE: No1,
            C_NUMBER_RE: jd4,
            BINARY_NUMBER_RE: Hd4,
            RE_STARTERS_RE: mkz,
            SHEBANG: Bkz,
            BACKSLASH_ESCAPE: K78,
            APOS_STRING_MODE: pkz,
            QUOTE_STRING_MODE: Fkz,
            PHRASAL_WORDS_MODE: Jd4,
            COMMENT: Yu8,
            C_LINE_COMMENT_MODE: gkz,
            C_BLOCK_COMMENT_MODE: Ukz,
            HASH_COMMENT_MODE: Qkz,
            NUMBER_MODE: dkz,
            C_NUMBER_MODE: ckz,
            BINARY_NUMBER_MODE: lkz,
            CSS_NUMBER_MODE: nkz,
            REGEXP_MODE: ikz,
            TITLE_MODE: rkz,
            UNDERSCORE_TITLE_MODE: okz,
            METHOD_GUARD: akz,
            END_SAME_AS_BEGIN: skz
        });

    function tkz(q, K) {
        if (q.input[q.index - 1] === ".") K.ignoreMatch()
    }

    function ekz(q, K) {
        if (!K) return;
        if (!q.beginKeywords) return;
        if (q.begin = "\\b(" + q.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", q.__beforeBegin = tkz, q.keywords = q.keywords || q.beginKeywords, delete q.beginKeywords, q.relevance === void 0) q.relevance = 0
    }

    function qNz(q, K) {
        if (!Array.isArray(q.illegal)) return;
        q.illegal = Skz(...q.illegal)
    }

    function KNz(q, K) {
        if (!q.match) return;
        if (q.begin || q.end) throw Error("begin & end are not supported with match");
        q.begin = q.match, delete q.match
    }

    function _Nz(q, K) {
        if (q.relevance === void 0) q.relevance = 1
    }
    var zNz = ["of", "and", "for", "in", "not", "or", "if", "then", "parent", "list", "value"],
        YNz = "keyword";

    function Xd4(q, K, _ = YNz) {
        let z = {};
        if (typeof q === "string") Y(_, q.split(" "));
        else if (Array.isArray(q)) Y(_, q);
        else Object.keys(q).forEach(function(A) {
            Object.assign(z, Xd4(q[A], K, A))
        });
        return z;

        function Y(A, O) {
            if (K) O = O.map((w) => w.toLowerCase());
            O.forEach(function(w) {
                let $ = w.split("|");
                z[$[0]] = [A, ANz($[0], $[1])]
            })
        }
    }

    function ANz(q, K) {
        if (K) return Number(K);
        return ONz(q) ? 0 : 1
    }

    function ONz(q) {
        return zNz.includes(q.toLowerCase())
    }

    function wNz(q, {
        plugins: K
    }) {
        function _(w, $) {
            return new RegExp(q78(w), "m" + (q.case_insensitive ? "i" : "") + ($ ? "g" : ""))
        }
        class z {
            constructor() {
                this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0
            }
            addRule(w, $) {
                $.position = this.position++, this.matchIndexes[this.matchAt] = $, this.regexes.push([$, w]), this.matchAt += Ckz(w) + 1
            }
            compile() {
                if (this.regexes.length === 0) this.exec = () => null;
                let w = this.regexes.map(($) => $[1]);
                this.matcherRe = _(xkz(w), !0), this.lastIndex = 0
            }
            exec(w) {
                this.matcherRe.lastIndex = this.lastIndex;
                let $ = this.matcherRe.exec(w);
                if (!$) return null;
                let j = $.findIndex((J, X) => X > 0 && J !== void 0),
                    H = this.matchIndexes[j];
                return $.splice(0, j), Object.assign($, H)
            }
        }
        class Y {
            constructor() {
                this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0
            }
            getMatcher(w) {
                if (this.multiRegexes[w]) return this.multiRegexes[w];
                let $ = new z;
                return this.rules.slice(w).forEach(([j, H]) => $.addRule(j, H)), $.compile(), this.multiRegexes[w] = $, $
            }
            resumingScanAtSamePosition() {
                return this.regexIndex !== 0
            }
            considerAll() {
                this.regexIndex = 0
            }
            addRule(w, $) {
                if (this.rules.push([w, $]), $.type === "begin") this.count++
            }
            exec(w) {
                let $ = this.getMatcher(this.regexIndex);
                $.lastIndex = this.lastIndex;
                let j = $.exec(w);
                if (this.resumingScanAtSamePosition())
                    if (j && j.index === this.lastIndex);
                    else {
                        let H = this.getMatcher(0);
                        H.lastIndex = this.lastIndex + 1, j = H.exec(w)
                    } if (j) {
                    if (this.regexIndex += j.position + 1, this.regexIndex === this.count) this.considerAll()
                }
                return j
            }
        }

        function A(w) {
            let $ = new Y;
            if (w.contains.forEach((j) => $.addRule(j.begin, {
                    rule: j,
                    type: "begin"
                })), w.terminatorEnd) $.addRule(w.terminatorEnd, {
                type: "end"
            });
            if (w.illegal) $.addRule(w.illegal, {
                type: "illegal"
            });
            return $
        }

        function O(w, $) {
            let j = w;
            if (w.isCompiled) return j;
            [KNz].forEach((J) => J(w, $)), q.compilerExtensions.forEach((J) => J(w, $)), w.__beforeBegin = null, [ekz, qNz, _Nz].forEach((J) => J(w, $)), w.isCompiled = !0;
            let H = null;
            if (typeof w.keywords === "object") H = w.keywords.$pattern, delete w.keywords.$pattern;
            if (w.keywords) w.keywords = Xd4(w.keywords, q.case_insensitive);
            if (w.lexemes && H) throw Error("ERR: Prefer `keywords.$pattern` to `mode.lexemes`, BOTH are not allowed. (see mode reference) ");
            if (H = H || w.lexemes || /\w+/, j.keywordPatternRe = _(H, !0), $) {
                if (!w.begin) w.begin = /\B|\b/;
                if (j.beginRe = _(w.begin), w.endSameAsBegin) w.end = w.begin;
                if (!w.end && !w.endsWithParent) w.end = /\B|\b/;
                if (w.end) j.endRe = _(w.end);
                if (j.terminatorEnd = q78(w.end) || "", w.endsWithParent && $.terminatorEnd) j.terminatorEnd += (w.end ? "|" : "") + $.terminatorEnd
            }
            if (w.illegal) j.illegalRe = _(w.illegal);
            if (!w.contains) w.contains = [];
            if (w.contains = [].concat(...w.contains.map(function(J) {
                    return $Nz(J === "self" ? w : J)
                })), w.contains.forEach(function(J) {
                    O(J, j)
                }), w.starts) O(w.starts, $);
            return j.matcher = A(j), j
        }
        if (!q.compilerExtensions) q.compilerExtensions = [];
        if (q.contains && q.contains.includes("self")) throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
        return q.classNameAliases = z36(q.classNameAliases || {}), O(q)
    }

    function Md4(q) {
        if (!q) return !1;
        return q.endsWithParent || Md4(q.starts)
    }

    function $Nz(q) {
        if (q.variants && !q.cachedVariants) q.cachedVariants = q.variants.map(function(K) {
            return z36(q, {
                variants: null
            }, K)
        });
        if (q.cachedVariants) return q.cachedVariants;
        if (Md4(q)) return z36(q, {
            starts: q.starts ? z36(q.starts) : null
        });
        if (Object.isFrozen(q)) return z36(q);
        return q
    }
    var jNz = "10.7.3";

    function HNz(q) {
        return Boolean(q || q === "")
    }

    function JNz(q) {
        let K = {
            props: ["language", "code", "autodetect"],
            data: function() {
                return {
                    detectedLanguage: "",
                    unknownLanguage: !1
                }
            },
            computed: {
                className() {
                    if (this.unknownLanguage) return "";
                    return "hljs " + this.detectedLanguage
                },
                highlighted() {
                    if (!this.autoDetect && !q.getLanguage(this.language)) return console.warn(`The language "${this.language}" you specified could not be found.`), this.unknownLanguage = !0, ER6(this.code);
                    let z = {};
                    if (this.autoDetect) z = q.highlightAuto(this.code), this.detectedLanguage = z.language;
                    else z = q.highlight(this.language, this.code, this.ignoreIllegals), this.detectedLanguage = this.language;
                    return z.value
                },
                autoDetect() {
                    return !this.language || HNz(this.autodetect)
                },
                ignoreIllegals() {
                    return !0
                }
            },
            render(z) {
                return z("pre", {}, [z("code", {
                    class: this.className,
                    domProps: {
                        innerHTML: this.highlighted
                    }
                })])
            }
        };
        return {
            Component: K,
            VuePlugin: {
                install(z) {
                    z.component("highlightjs", K)
                }
            }
        }
    }
    var XNz = {
        "after:highlightElement": ({
            el: q,
            result: K,
            text: _
        }) => {
            let z = qd4(q);
            if (!z.length) return;
            let Y = document.createElement("div");
            Y.innerHTML = K.value, K.value = MNz(z, qd4(Y), _)
        }
    };

    function vo1(q) {
        return q.nodeName.toLowerCase()
    }

    function qd4(q) {
        let K = [];
        return function _(z, Y) {
            for (let A = z.firstChild; A; A = A.nextSibling)
                if (A.nodeType === 3) Y += A.nodeValue.length;
                else if (A.nodeType === 1) {
                if (K.push({
                        event: "start",
                        offset: Y,
                        node: A
                    }), Y = _(A, Y), !vo1(A).match(/br|hr|img|input/)) K.push({
                    event: "stop",
                    offset: Y,
                    node: A
                })
            }
            return Y
        }(q, 0), K
    }

    function MNz(q, K, _) {
        let z = 0,
            Y = "",
            A = [];

        function O() {
            if (!q.length || !K.length) return q.length ? q : K;
            if (q[0].offset !== K[0].offset) return q[0].offset < K[0].offset ? q : K;
            return K[0].event === "start" ? q : K
        }

        function w(H) {
            function J(X) {
                return " " + X.nodeName + '="' + ER6(X.value) + '"'
            }
            Y += "<" + vo1(H) + [].map.call(H.attributes, J).join("") + ">"
        }

        function $(H) {
            Y += "</" + vo1(H) + ">"
        }

        function j(H) {
            (H.event === "start" ? w : $)(H.node)
        }
        while (q.length || K.length) {
            let H = O();
            if (Y += ER6(_.substring(z, H[0].offset)), z = H[0].offset, H === q) {
                A.reverse().forEach($);
                do j(H.splice(0, 1)[0]), H = O(); while (H === q && H.length && H[0].offset === z);
                A.reverse().forEach(w)
            } else {
                if (H[0].event === "start") A.push(H[0].node);
                else A.pop();
                j(H.splice(0, 1)[0])
            }
        }
        return Y + ER6(_.substr(z))
    }
    var Kd4 = {},
        Zo1 = (q) => {
            console.error(q)
        },
        _d4 = (q, ...K) => {
            console.log(`WARN: ${q}`, ...K)
        },
        ux = (q, K) => {
            if (Kd4[`${q}/${K}`]) return;
            console.log(`Deprecated as of ${q}. ${K}`), Kd4[`${q}/${K}`] = !0
        },
        fo1 = ER6,
        zd4 = z36,
        Yd4 = Symbol("nomatch"),
        PNz = function(q) {
            let K = Object.create(null),
                _ = Object.create(null),
                z = [],
                Y = !0,
                A = /(^(<[^>]+>|\t|)+|\n)/gm,
                O = "Could not find the language '{}', did you forget to load/include a language module?",
                w = {
                    disableAutodetect: !0,
                    name: "Plain text",
                    contains: []
                },
                $ = {
                    noHighlightRe: /^(no-?highlight)$/i,
                    languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
                    classPrefix: "hljs-",
                    tabReplace: null,
                    useBR: !1,
                    languages: null,
                    __emitter: wd4
                };

            function j(e) {
                return $.noHighlightRe.test(e)
            }

            function H(e) {
                let i = e.className + " ";
                i += e.parentNode ? e.parentNode.className : "";
                let O6 = $.languageDetectRe.exec(i);
                if (O6) {
                    let J6 = F(O6[1]);
                    if (!J6) _d4(O.replace("{}", O6[1])), _d4("Falling back to no-highlight mode for this block.", e);
                    return J6 ? O6[1] : "no-highlight"
                }
                return i.split(/\s+/).find((J6) => j(J6) || F(J6))
            }

            function J(e, i, O6, J6) {
                let $6 = "",
                    H6 = "";
                if (typeof i === "object") $6 = e, O6 = i.ignoreIllegals, H6 = i.language, J6 = void 0;
                else ux("10.7.0", "highlight(lang, code, ...args) has been deprecated."), ux("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), H6 = e, $6 = i;
                let q6 = {
                    code: $6,
                    language: H6
                };
                l("before:highlight", q6);
                let o = q6.result ? q6.result : X(q6.language, q6.code, O6, J6);
                return o.code = q6.code, l("after:highlight", o), o
            }

            function X(e, i, O6, J6) {
                function $6(p6, q8) {
                    let L8 = f6.case_insensitive ? q8[0].toLowerCase() : q8[0];
                    return Object.prototype.hasOwnProperty.call(p6.keywords, L8) && p6.keywords[L8]
                }

                function H6() {
                    if (!T6.keywords) {
                        L6.addText(y6);
                        return
                    }
                    let p6 = 0;
                    T6.keywordPatternRe.lastIndex = 0;
                    let q8 = T6.keywordPatternRe.exec(y6),
                        L8 = "";
                    while (q8) {
                        L8 += y6.substring(p6, q8.index);
                        let w8 = $6(T6, q8);
                        if (w8) {
                            let [x8, a6] = w8;
                            if (L6.addText(L8), L8 = "", c6 += a6, x8.startsWith("_")) L8 += q8[0];
                            else {
                                let D8 = f6.classNameAliases[x8] || x8;
                                L6.addKeyword(q8[0], D8)
                            }
                        } else L8 += q8[0];
                        p6 = T6.keywordPatternRe.lastIndex, q8 = T6.keywordPatternRe.exec(y6)
                    }
                    L8 += y6.substr(p6), L6.addText(L8)
                }

                function q6() {
                    if (y6 === "") return;
                    let p6 = null;
                    if (typeof T6.subLanguage === "string") {
                        if (!K[T6.subLanguage]) {
                            L6.addText(y6);
                            return
                        }
                        p6 = X(T6.subLanguage, y6, !0, v6[T6.subLanguage]), v6[T6.subLanguage] = p6.top
                    } else p6 = P(y6, T6.subLanguage.length ? T6.subLanguage : null);
                    if (T6.relevance > 0) c6 += p6.relevance;
                    L6.addSublanguage(p6.emitter, p6.language)
                }

                function o() {
                    if (T6.subLanguage != null) q6();
                    else H6();
                    y6 = ""
                }

                function _6(p6) {
                    if (p6.className) L6.openNode(f6.classNameAliases[p6.className] || p6.className);
                    return T6 = Object.create(p6, {
                        parent: {
                            value: T6
                        }
                    }), T6
                }

                function r(p6, q8, L8) {
                    let w8 = bkz(p6.endRe, L8);
                    if (w8) {
                        if (p6["on:end"]) {
                            let x8 = new Go1(p6);
                            if (p6["on:end"](q8, x8), x8.isMatchIgnored) w8 = !1
                        }
                        if (w8) {
                            while (p6.endsParent && p6.parent) p6 = p6.parent;
                            return p6
                        }
                    }
                    if (p6.endsWithParent) return r(p6.parent, q8, L8)
                }

                function t(p6) {
                    if (T6.matcher.regexIndex === 0) return y6 += p6[0], 1;
                    else return R6 = !0, 0
                }

                function Y6(p6) {
                    let q8 = p6[0],
                        L8 = p6.rule,
                        w8 = new Go1(L8),
                        x8 = [L8.__beforeBegin, L8["on:begin"]];
                    for (let a6 of x8) {
                        if (!a6) continue;
                        if (a6(p6, w8), w8.isMatchIgnored) return t(q8)
                    }
                    if (L8 && L8.endSameAsBegin) L8.endRe = hkz(q8);
                    if (L8.skip) y6 += q8;
                    else {
                        if (L8.excludeBegin) y6 += q8;
                        if (o(), !L8.returnBegin && !L8.excludeBegin) y6 = q8
                    }
                    return _6(L8), L8.returnBegin ? 0 : q8.length
                }

                function X6(p6) {
                    let q8 = p6[0],
                        L8 = i.substr(p6.index),
                        w8 = r(T6, p6, L8);
                    if (!w8) return Yd4;
                    let x8 = T6;
                    if (x8.skip) y6 += q8;
                    else {
                        if (!(x8.returnEnd || x8.excludeEnd)) y6 += q8;
                        if (o(), x8.excludeEnd) y6 = q8
                    }
                    do {
                        if (T6.className) L6.closeNode();
                        if (!T6.skip && !T6.subLanguage) c6 += T6.relevance;
                        T6 = T6.parent
                    } while (T6 !== w8.parent);
                    if (w8.starts) {
                        if (w8.endSameAsBegin) w8.starts.endRe = w8.endRe;
                        _6(w8.starts)
                    }
                    return x8.returnEnd ? 0 : q8.length
                }

                function M6() {
                    let p6 = [];
                    for (let q8 = T6; q8 !== f6; q8 = q8.parent)
                        if (q8.className) p6.unshift(q8.className);
                    p6.forEach((q8) => L6.openNode(q8))
                }
                let W6 = {};

                function V6(p6, q8) {
                    let L8 = q8 && q8[0];
                    if (y6 += p6, L8 == null) return o(), 0;
                    if (W6.type === "begin" && q8.type === "end" && W6.index === q8.index && L8 === "") {
                        if (y6 += i.slice(q8.index, q8.index + 1), !Y) {
                            let w8 = Error("0 width match regex");
                            throw w8.languageName = e, w8.badRule = W6.rule, w8
                        }
                        return 1
                    }
                    if (W6 = q8, q8.type === "begin") return Y6(q8);
                    else if (q8.type === "illegal" && !O6) {
                        let w8 = Error('Illegal lexeme "' + L8 + '" for mode "' + (T6.className || "<unnamed>") + '"');
                        throw w8.mode = T6, w8
                    } else if (q8.type === "end") {
                        let w8 = X6(q8);
                        if (w8 !== Yd4) return w8
                    }
                    if (q8.type === "illegal" && L8 === "") return 1;
                    if (N8 > 1e5 && N8 > q8.index * 3) throw Error("potential infinite loop, way more iterations than matches");
                    return y6 += L8, L8.length
                }
                let f6 = F(e);
                if (!f6) throw Zo1(O.replace("{}", e)), Error('Unknown language: "' + e + '"');
                let G6 = wNz(f6, {
                        plugins: z
                    }),
                    k6 = "",
                    T6 = J6 || G6,
                    v6 = {},
                    L6 = new $.__emitter($);
                M6();
                let y6 = "",
                    c6 = 0,
                    Z8 = 0,
                    N8 = 0,
                    R6 = !1;
                try {
                    T6.matcher.considerAll();
                    for (;;) {
                        if (N8++, R6) R6 = !1;
                        else T6.matcher.considerAll();
                        T6.matcher.lastIndex = Z8;
                        let p6 = T6.matcher.exec(i);
                        if (!p6) break;
                        let q8 = i.substring(Z8, p6.index),
                            L8 = V6(q8, p6);
                        Z8 = p6.index + L8
                    }
                    return V6(i.substr(Z8)), L6.closeAllNodes(), L6.finalize(), k6 = L6.toHTML(), {
                        relevance: Math.floor(c6),
                        value: k6,
                        language: e,
                        illegal: !1,
                        emitter: L6,
                        top: T6
                    }
                } catch (p6) {
                    if (p6.message && p6.message.includes("Illegal")) return {
                        illegal: !0,
                        illegalBy: {
                            msg: p6.message,
                            context: i.slice(Z8 - 100, Z8 + 100),
                            mode: p6.mode
                        },
                        sofar: k6,
                        relevance: 0,
                        value: fo1(i),
                        emitter: L6
                    };
                    else if (Y) return {
                        illegal: !1,
                        relevance: 0,
                        value: fo1(i),
                        emitter: L6,
                        language: e,
                        top: T6,
                        errorRaised: p6
                    };
                    else throw p6
                }
            }

            function M(e) {
                let i = {
                    relevance: 0,
                    emitter: new $.__emitter($),
                    value: fo1(e),
                    illegal: !1,
                    top: w
                };
                return i.emitter.addText(e), i
            }

            function P(e, i) {
                i = i || $.languages || Object.keys(K);
                let O6 = M(e),
                    J6 = i.filter(F).filter(g).map((_6) => X(_6, e, !1));
                J6.unshift(O6);
                let $6 = J6.sort((_6, r) => {
                        if (_6.relevance !== r.relevance) return r.relevance - _6.relevance;
                        if (_6.language && r.language) {
                            if (F(_6.language).supersetOf === r.language) return 1;
                            else if (F(r.language).supersetOf === _6.language) return -1
                        }
                        return 0
                    }),
                    [H6, q6] = $6,
                    o = H6;
                return o.second_best = q6, o
            }

            function W(e) {
                if (!($.tabReplace || $.useBR)) return e;
                return e.replace(A, (i) => {
                    if (i === `
`) return $.useBR ? "<br>" : i;
                    else if ($.tabReplace) return i.replace(/\t/g, $.tabReplace);
                    return i
                })
            }

            function D(e, i, O6) {
                let J6 = i ? _[i] : O6;
                if (e.classList.add("hljs"), J6) e.classList.add(J6)
            }
            let Z = {
                    "before:highlightElement": ({
                        el: e
                    }) => {
                        if ($.useBR) e.innerHTML = e.innerHTML.replace(/\n/g, "").replace(/<br[ /]*>/g, `
`)
                    },
                    "after:highlightElement": ({
                        result: e
                    }) => {
                        if ($.useBR) e.value = e.value.replace(/\n/g, "<br>")
                    }
                },
                G = /^(<[^>]+>|\t)+/gm,
                f = {
                    "after:highlightElement": ({
                        result: e
                    }) => {
                        if ($.tabReplace) e.value = e.value.replace(G, (i) => i.replace(/\t/g, $.tabReplace))
                    }
                };

            function v(e) {
                let i = null,
                    O6 = H(e);
                if (j(O6)) return;
                l("before:highlightElement", {
                    el: e,
                    language: O6
                }), i = e;
                let J6 = i.textContent,
                    $6 = O6 ? J(J6, {
                        language: O6,
                        ignoreIllegals: !0
                    }) : P(J6);
                if (l("after:highlightElement", {
                        el: e,
                        result: $6,
                        text: J6
                    }), e.innerHTML = $6.value, D(e, O6, $6.language), e.result = {
                        language: $6.language,
                        re: $6.relevance,
                        relavance: $6.relevance
                    }, $6.second_best) e.second_best = {
                    language: $6.second_best.language,
                    re: $6.second_best.relevance,
                    relavance: $6.second_best.relevance
                }
            }

            function V(e) {
                if (e.useBR) ux("10.3.0", "'useBR' will be removed entirely in v11.0"), ux("10.3.0", "Please see https://github.com/highlightjs/highlight.js/issues/2559");
                $ = zd4($, e)
            }
            let k = () => {
                if (k.called) return;
                k.called = !0, ux("10.6.0", "initHighlighting() is deprecated.  Use highlightAll() instead."), document.querySelectorAll("pre code").forEach(v)
            };

            function N() {
                ux("10.6.0", "initHighlightingOnLoad() is deprecated.  Use highlightAll() instead."), R = !0
            }
            let R = !1;

            function h() {
                if (document.readyState === "loading") {
                    R = !0;
                    return
                }
                document.querySelectorAll("pre code").forEach(v)
            }

            function C() {
                if (R) h()
            }
            if (typeof window < "u" && window.addEventListener) window.addEventListener("DOMContentLoaded", C, !1);

            function x(e, i) {
                let O6 = null;
                try {
                    O6 = i(q)
                } catch (J6) {
                    if (Zo1("Language definition for '{}' could not be registered.".replace("{}", e)), !Y) throw J6;
                    else Zo1(J6);
                    O6 = w
                }
                if (!O6.name) O6.name = e;
                if (K[e] = O6, O6.rawDefinition = i.bind(null, q), O6.aliases) U(O6.aliases, {
                    languageName: e
                })
            }

            function B(e) {
                delete K[e];
                for (let i of Object.keys(_))
                    if (_[i] === e) delete _[i]
            }

            function m() {
                return Object.keys(K)
            }

            function S(e) {
                ux("10.4.0", "requireLanguage will be removed entirely in v11."), ux("10.4.0", "Please see https://github.com/highlightjs/highlight.js/pull/2844");
                let i = F(e);
                if (i) return i;
                throw Error("The '{}' language is required, but not loaded.".replace("{}", e))
            }

            function F(e) {
                return e = (e || "").toLowerCase(), K[e] || K[_[e]]
            }

            function U(e, {
                languageName: i
            }) {
                if (typeof e === "string") e = [e];
                e.forEach((O6) => {
                    _[O6.toLowerCase()] = i
                })
            }

            function g(e) {
                let i = F(e);
                return i && !i.disableAutodetect
            }

            function c(e) {
                if (e["before:highlightBlock"] && !e["before:highlightElement"]) e["before:highlightElement"] = (i) => {
                    e["before:highlightBlock"](Object.assign({
                        block: i.el
                    }, i))
                };
                if (e["after:highlightBlock"] && !e["after:highlightElement"]) e["after:highlightElement"] = (i) => {
                    e["after:highlightBlock"](Object.assign({
                        block: i.el
                    }, i))
                }
            }

            function n(e) {
                c(e), z.push(e)
            }

            function l(e, i) {
                let O6 = e;
                z.forEach(function(J6) {
                    if (J6[O6]) J6[O6](i)
                })
            }

            function z6(e) {
                return ux("10.2.0", "fixMarkup will be removed entirely in v11.0"), ux("10.2.0", "Please see https://github.com/highlightjs/highlight.js/issues/2534"), W(e)
            }

            function A6(e) {
                return ux("10.7.0", "highlightBlock will be removed entirely in v12.0"), ux("10.7.0", "Please use highlightElement now."), v(e)
            }
            Object.assign(q, {
                highlight: J,
                highlightAuto: P,
                highlightAll: h,
                fixMarkup: z6,
                highlightElement: v,
                highlightBlock: A6,
                configure: V,
                initHighlighting: k,
                initHighlightingOnLoad: N,
                registerLanguage: x,
                unregisterLanguage: B,
                listLanguages: m,
                getLanguage: F,
                registerAliases: U,
                requireLanguage: S,
                autoDetection: g,
                inherit: zd4,
                addPlugin: n,
                vuePlugin: JNz(q).VuePlugin
            }), q.debugMode = function() {
                Y = !1
            }, q.safeMode = function() {
                Y = !0
            }, q.versionString = jNz;
            for (let e in zu8)
                if (typeof zu8[e] === "object") Ad4(zu8[e]);
            return Object.assign(q, zu8), q.addPlugin(Z), q.addPlugin(XNz), q.addPlugin(f), q
        },
        WNz = PNz({});
    Pd4.exports = WNz
})
// @from(Ln 287159, Col 0)
function yR6() {
    if (Eo1) return Eo1;
    let q = Wd4(),
        K = "default" in q && q.default ? q.default : q;
    return Hu4(K), Eo1 = K, K
}
// @from(Ln 287166, Col 0)
function DNz(q) {
    return q.default ?? q
}
// @from(Ln 287170, Col 0)
function ck(q) {
    let K = yR6(),
        _ = q.toLowerCase(),
        z = Object.prototype.hasOwnProperty.call(Wo1, _) ? _ : Object.prototype.hasOwnProperty.call(Do1, _) ? Do1[_] : null;
    if (z !== null) {
        if (Zd4.has(z)) return null;
        if (!Dd4.has(z)) {
            let Y = Wo1[z];
            if (typeof Y !== "function") return null;
            try {
                K.registerLanguage(z, DNz(Y()))
            } catch (A) {
                return Zd4.add(z), j6(A), null
            }
            Dd4.add(z);
            for (let A of sQ4[z] ?? []) ck(A)
        }
        return z
    }
    return K.getLanguage(_) ? _ : null
}
// @from(Ln 287191, Col 4)
Eo1 = null
// @from(Ln 287192, Col 4)
Dd4
// @from(Ln 287192, Col 9)
Zd4
// @from(Ln 287193, Col 4)
yo1 = L(() => {
    Ju4();
    tQ4();
    U8();
    Dd4 = new Set, Zd4 = new Set
})
// @from(Ln 287203, Col 0)
function Gd4(q) {
    if (typeof q === "string") return q;
    let K = q.children.map(Gd4).join(""),
        _ = q.scope ?? q.kind,
        z = _ ? fNz[_.replace(/^hljs-/, "")] : void 0;
    return z ? z(K) : K
}
// @from(Ln 287211, Col 0)
function GNz(q, K) {
    let _ = K?.language;
    if (!_) return q;
    let z;
    try {
        let O = ck(_);
        if (!O) return q;
        z = yR6().highlight(q, {
            language: O,
            ignoreIllegals: !0
        })
    } catch {
        return q
    }
    let Y = z._emitter ?? z.emitter,
        A = Y?.rootNode ?? Y?.root;
    if (!A || typeof A === "string") return q;
    return A.children.map(Gd4).join("")
}
// @from(Ln 287231, Col 0)
function vNz(q) {
    return ck(q) !== null
}
// @from(Ln 287235, Col 0)
function Y36() {
    return fd4 ??= Promise.resolve(TNz), fd4
}
// @from(Ln 287238, Col 0)
async function Au8(q) {
    let K = ZNz(q).slice(1);
    if (!K) return "unknown";
    let _ = ck(K);
    if (!_) return "unknown";
    return yR6().getLanguage(_)?.name ?? "unknown"
}
// @from(Ln 287245, Col 4)
fNz
// @from(Ln 287245, Col 9)
TNz
// @from(Ln 287245, Col 14)
fd4
// @from(Ln 287246, Col 4)
fJ6 = L(() => {
    Y3();
    yo1();
    fNz = {
        keyword: Y8.blue,
        built_in: Y8.cyan,
        type: Y8.cyan.dim,
        literal: Y8.blue,
        number: Y8.green,
        regexp: Y8.red,
        string: Y8.red,
        subst: Y8.reset,
        symbol: Y8.reset,
        class: Y8.blue,
        function: Y8.yellow,
        title: Y8.reset,
        params: Y8.reset,
        comment: Y8.green,
        doctag: Y8.green,
        meta: Y8.grey,
        "meta-keyword": Y8.reset,
        "meta-string": Y8.reset,
        section: Y8.reset,
        tag: Y8.grey,
        name: Y8.blue,
        attr: Y8.cyan,
        attribute: Y8.reset,
        variable: Y8.reset,
        bullet: Y8.reset,
        code: Y8.reset,
        emphasis: Y8.italic,
        strong: Y8.bold,
        link: Y8.underline,
        quote: Y8.reset,
        addition: Y8.green,
        deletion: Y8.red
    };
    TNz = {
        highlight: GNz,
        supportsLanguage: vNz
    }
})
// @from(Ln 287289, Col 0)
function ho1(q) {
    return VNz.includes(q)
}
// @from(Ln 287292, Col 0)
async function Ro1(q, K, _, z) {
    let Y;
    if (q.getPath && K) {
        let A = q.inputSchema.safeParse(K);
        if (A.success) {
            let O = q.getPath(A.data);
            if (O) Y = await Au8(O)
        }
    }
    return {
        decision: _,
        source: z,
        tool_name: q.name,
        ...Y && {
            language: Y
        }
    }
}
// @from(Ln 287311, Col 0)
function kNz(q) {
    if (q.type === "classifier") return "classifier";
    switch (q.type) {
        case "hook":
            return "hook";
        case "user":
            return q.permanent ? "user_permanent" : "user_temporary";
        case "user_abort":
            return "user_abort";
        case "user_reject":
            return "user_reject";
        default:
            return "unknown"
    }
}
// @from(Ln 287327, Col 0)
function LR6(q, K, _) {
    return {
        messageID: q,
        toolName: PK(K),
        sandboxEnabled: Z7.isSandboxingEnabled(),
        ..._ !== void 0 && {
            waiting_for_user_permission_ms: _
        }
    }
}
// @from(Ln 287338, Col 0)
function NNz(q, K, _, z) {
    if (_ === "config") {
        d("tengu_tool_use_granted_in_config", LR6(K, q.name, void 0));
        return
    }
    if (_.type === "classifier") {
        d("tengu_tool_use_granted_by_classifier", LR6(K, q.name, z));
        return
    }
    switch (_.type) {
        case "user":
            d(_.permanent ? "tengu_tool_use_granted_in_prompt_permanent" : "tengu_tool_use_granted_in_prompt_temporary", LR6(K, q.name, z));
            break;
        case "hook":
            d("tengu_tool_use_granted_by_permission_hook", {
                ...LR6(K, q.name, z),
                permanent: _.permanent ?? !1
            });
            break;
        default:
            break
    }
}
// @from(Ln 287362, Col 0)
function ENz(q, K, _, z) {
    if (_ === "config") {
        d("tengu_tool_use_denied_in_config", LR6(K, q.name, void 0));
        return
    }
    d("tengu_tool_use_rejected_in_prompt", {
        ...LR6(K, q.name, z),
        ..._.type === "hook" ? {
            isHook: !0
        } : {
            hasFeedback: _.type === "user_reject" ? _.hasFeedback : !1
        }
    })
}
// @from(Ln 287377, Col 0)
function Ou8(q, K, _) {
    let {
        tool: z,
        input: Y,
        toolUseContext: A,
        messageId: O,
        toolUseID: w
    } = q, {
        decision: $,
        source: j
    } = K, H = _ !== void 0 ? Date.now() - _ : void 0;
    if (K.decision === "accept") NNz(z, O, K.source, H);
    else ENz(z, O, K.source, H);
    let J = j === "config" ? "config" : kNz(j);
    if (ho1(z.name)) Ro1(z, Y, $, J).then((X) => rB6()?.add(1, X));
    if (!A.toolDecisions) A.toolDecisions = new Map;
    A.toolDecisions.set(w, {
        source: J,
        decision: $,
        timestamp: Date.now()
    }), Xz("tool_decision", {
        decision: $,
        source: J,
        tool_name: PK(z.name)
    })
}
// @from(Ln 287403, Col 4)
VNz
// @from(Ln 287404, Col 4)
wu8 = L(() => {
    C8();
    q2();
    y8();
    fJ6();
    yY();
    uf();
    VNz = ["Edit", "Write", "NotebookEdit"]
})
// @from(Ln 287414, Col 0)
function _78() {
    return {
        map: new Map,
        nextId: 1
    }
}
// @from(Ln 287421, Col 0)
function A36() {
    return u8("tengu_velvet_anchor", !1)
}
// @from(Ln 287425, Col 0)
function vd4(q, K) {
    let _ = `b${q.nextId++}`;
    return q.map.set(_, K), _
}
// @from(Ln 287430, Col 0)
function Td4(q, K) {
    let _ = q?.map.get(K);
    if (_ !== void 0) return {
        command: _
    };
    let z = q ? Array.from(q.map.keys()) : [],
        Y = z.length > 0 ? z.join(", ") : "none";
    return {
        error: `Unknown rerun alias '${K}'. Valid aliases this session: ${Y}. Provide {command: "..."} instead.`
    }
}
// @from(Ln 287442, Col 0)
function So1(q) {
    return `[rerun: ${q}]`
}
// @from(Ln 287445, Col 4)
hR6 = L(() => {
    B1()
})
// @from(Ln 287449, Col 0)
function RR6(q, K = "") {
    return new RegExp(`\\bgit(?:\\s+-[cC]\\s+\\S+|\\s+--\\S+=\\S+)*\\s+${q}\\b${K}`)
}
// @from(Ln 287453, Col 0)
function yd4(q) {
    let K = q.match(/https:\/\/github\.com\/([^/]+\/[^/]+)\/pull\/(\d+)/);
    if (K?.[1] && K?.[2]) return {
        prNumber: parseInt(K[2], 10),
        prUrl: q,
        prRepository: K[1]
    };
    return null
}
// @from(Ln 287463, Col 0)
function Ld4(q) {
    let K = q.match(/https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/pull\/\d+/);
    return K ? yd4(K[0]) : null
}
// @from(Ln 287468, Col 0)
function bo1(q) {
    return q.match(/\[[\w./-]+(?: \(root-commit\))? ([0-9a-f]+)\]/)?.[1]
}
// @from(Ln 287472, Col 0)
function SNz(q) {
    return q.match(/^\s*[+\-*!= ]?\s*(?:\[new branch\]|\S+\.\.+\S+)\s+\S+\s*->\s*(\S+)/m)?.[1]
}
// @from(Ln 287476, Col 0)
function CNz(q) {
    let K = q.match(/[Pp]ull request (?:\S+#)?#?(\d+)/);
    return K?.[1] ? parseInt(K[1], 10) : void 0
}
// @from(Ln 287481, Col 0)
function Vd4(q, K) {
    let _ = q.split(RR6(K))[1];
    if (!_) return;
    for (let z of _.trim().split(/\s+/)) {
        if (/^[&|;><]/.test(z)) break;
        if (z.startsWith("-")) continue;
        return z
    }
    return
}
// @from(Ln 287492, Col 0)
function hd4(q, K) {
    let _ = {},
        z = yNz.test(q);
    if (Nd4.test(q) || z) {
        let A = bo1(K);
        if (A) _.commit = {
            sha: A.slice(0, 6),
            kind: z ? "cherry-picked" : /--amend\b/.test(q) ? "amended" : "committed"
        }
    }
    if (Co1.test(q)) {
        let A = SNz(K);
        if (A) _.push = {
            branch: A
        }
    }
    if (LNz.test(q) && /(Fast-forward|Merge made by)/.test(K)) {
        let A = Vd4(q, "merge");
        if (A) _.branch = {
            ref: A,
            action: "merged"
        }
    }
    if (hNz.test(q) && /Successfully rebased/.test(K)) {
        let A = Vd4(q, "rebase");
        if (A) _.branch = {
            ref: A,
            action: "rebased"
        }
    }
    let Y = Ed4.find((A) => A.re.test(q))?.action;
    if (Y) {
        let A = Ld4(K);
        if (A) _.pr = {
            number: A.prNumber,
            url: A.prUrl,
            action: Y
        };
        else {
            let O = CNz(K);
            if (O) _.pr = {
                number: O,
                action: Y
            }
        }
    }
    return _
}
// @from(Ln 287541, Col 0)
function $u8(q, K, _) {
    if (K !== 0) return;
    if (Nd4.test(q)) {
        if (d("tengu_git_operation", {
                operation: "commit"
            }), q.match(/--amend\b/)) d("tengu_git_operation", {
            operation: "commit_amend"
        });
        q81()?.add(1)
    }
    if (Co1.test(q)) d("tengu_git_operation", {
        operation: "push"
    });
    let Y = Ed4.find(($) => $.re.test(q));
    if (Y) d("tengu_git_operation", {
        operation: Y.op
    });
    if (Y?.action === "created") {
        if (iB6()?.add(1), _) {
            let $ = Ld4(_);
            if ($) Rd4($)
        }
    }
    let A = q.match(RNz);
    if (A?.[1]) kd4(A[1]).catch(() => {});
    else if (Co1.test(q) && !Y) kd4().catch(() => {});
    if (q.match(/\bglab\s+mr\s+create\b/)) d("tengu_git_operation", {
        operation: "pr_create"
    }), iB6()?.add(1);
    let O = q.match(/\bcurl\b/) && (q.match(/-X\s*POST\b/i) || q.match(/--request\s*=?\s*POST\b/i) || q.match(/\s-d\s/)),
        w = q.match(/https?:\/\/[^\s'"]*\/(pulls|pull-requests|merge[-_]requests)(?!\/\d)/i);
    if (O && w) d("tengu_git_operation", {
        operation: "pr_create"
    }), iB6()?.add(1)
}
// @from(Ln 287576, Col 0)
async function Rd4(q) {
    let [{
        linkSessionToPR: K
    }, {
        getSessionId: _
    }] = await Promise.all([Promise.resolve().then(() => (g4(), Ub8)), Promise.resolve().then(() => (y8(), CD6))]), z = _();
    if (!z) return;
    await K(z, q.prNumber, q.prUrl, q.prRepository)
}
// @from(Ln 287585, Col 0)
async function kd4(q) {
    let K = ["pr", "view", ...q ? [q] : [], "--json", "url"],
        {
            code: _,
            stdout: z
        } = await w1("gh", K, {
            timeout: 5000,
            preserveOutputOnError: !1,
            useCwd: !0
        });
    if (_ !== 0) return;
    let Y = n8(z)?.url;
    if (!Y) return;
    let A = yd4(Y);
    if (A) await Rd4(A)
}
// @from(Ln 287601, Col 4)
Nd4
// @from(Ln 287601, Col 9)
Co1
// @from(Ln 287601, Col 14)
yNz
// @from(Ln 287601, Col 19)
LNz
// @from(Ln 287601, Col 24)
hNz
// @from(Ln 287601, Col 29)
RNz
// @from(Ln 287601, Col 34)
Ed4
// @from(Ln 287602, Col 4)
z78 = L(() => {
    y8();
    C8();
    Q4();
    e8();
    Nd4 = RR6("commit"), Co1 = RR6("push"), yNz = RR6("cherry-pick"), LNz = RR6("merge", "(?!-)"), hNz = RR6("rebase"), RNz = /\bgh\s+pr\s+checkout\b[^&|;]*\s(\d+)(?=\s|$|[&|;])/, Ed4 = [{
        re: /\bgh\s+pr\s+create\b/,
        action: "created",
        op: "pr_create"
    }, {
        re: /\bgh\s+pr\s+edit\b/,
        action: "edited",
        op: "pr_edit"
    }, {
        re: /\bgh\s+pr\s+merge\b/,
        action: "merged",
        op: "pr_merge"
    }, {
        re: /\bgh\s+pr\s+comment\b/,
        action: "commented",
        op: "pr_comment"
    }, {
        re: /\bgh\s+pr\s+close\b/,
        action: "closed",
        op: "pr_close"
    }, {
        re: /\bgh\s+pr\s+ready\b/,
        action: "ready",
        op: "pr_ready"
    }]
})
// @from(Ln 287634, Col 0)
function ju8(q, K) {
    if (K) return q ? `agent:builtin:${q}` : "agent:default";
    else return "agent:custom"
}
// @from(Ln 287639, Col 0)
function Y78() {
    let K = y7()?.outputStyle ?? lk;
    if (K === lk) return "repl_main_thread";
    return K in GJ6 ? `repl_main_thread:outputStyle:${K}` : "repl_main_thread:outputStyle:custom"
}
// @from(Ln 287644, Col 4)
Hu8 = L(() => {
    ec();
    a1()
})
// @from(Ln 287649, Col 0)
function INz(q) {
    return `Describe your most recent action in 3-5 words using present tense (-ing). Name the file or function, not the branch. Do not use tools.
${q?`
Previous: "${q}" — say something NEW.
`:""}
Good: "Reading runAgent.ts"
Good: "Fixing null check in validate.ts"
Good: "Running auth module tests"
Good: "Adding retry logic to fetchUser"

Bad (past tense): "Analyzed the branch diff"
Bad (too vague): "Investigating the issue"
Bad (too long): "Reviewing full branch diff and AgentTool.tsx integration"
Bad (branch name): "Analyzed adam/background-summary branch diff"`
}
// @from(Ln 287665, Col 0)
function A78(q, K, _, z) {
    let {
        forkContextMessages: Y,
        ...A
    } = _, O = null, w = null, $ = !1, j = null;
    async function H() {
        if ($) return;
        E(`[AgentSummary] Timer fired for agent ${K}`);
        try {
            let M = await O36(K);
            if (!M || M.messages.length < 3) {
                E(`[AgentSummary] Skipping summary for ${q}: not enough messages (${M?.messages.length??0})`);
                return
            }
            let P = xo1(M.messages),
                W = {
                    ...A,
                    forkContextMessages: P
                };
            E(`[AgentSummary] Forking for summary, ${P.length} messages in context`), O = new AbortController;
            let D = async () => ({
                behavior: "deny",
                message: "No tools needed for summary",
                decisionReason: {
                    type: "other",
                    reason: "summary only"
                }
            }), Z = await rP({
                promptMessages: [t8({
                    content: INz(j)
                })],
                cacheSafeParams: W,
                canUseTool: D,
                querySource: "agent_summary",
                forkLabel: "agent_summary",
                overrides: {
                    abortController: O
                },
                skipTranscript: !0
            });
            if ($) return;
            for (let G of Z.messages) {
                if (G.type !== "assistant") continue;
                if (G.isApiErrorMessage) {
                    E(`[AgentSummary] Skipping API error message for ${q}`);
                    continue
                }
                let f = G.message.content.find((v) => v.type === "text");
                if (f?.type === "text" && f.text.trim()) {
                    let v = f.text.trim();
                    E(`[AgentSummary] Summary result for ${q}: ${v}`), j = v, Sd4(q, v, z);
                    break
                }
            }
        } catch (M) {
            if (!$ && M instanceof Error) j6(M)
        } finally {
            if (O = null, !$) J()
        }
    }

    function J() {
        if ($) return;
        w = setTimeout(H, bNz)
    }

    function X() {
        if (E(`[AgentSummary] Stopping summarization for ${q}`), $ = !0, w) clearTimeout(w), w = null;
        if (O) O.abort(), O = null
    }
    return J(), {
        stop: X
    }
}
// @from(Ln 287739, Col 4)
bNz = 30000
// @from(Ln 287740, Col 4)
Io1 = L(() => {
    vM();
    vJ6();
    K8();
    lf();
    U8();
    _7();
    g4()
})
// @from(Ln 287749, Col 4)
xNz
// @from(Ln 287749, Col 9)
uNz
// @from(Ln 287749, Col 14)
SR6
// @from(Ln 287750, Col 4)
uo1 = L(() => {
    p7();
    xNz = C6(() => y.enum(["pending", "in_progress", "completed"])), uNz = C6(() => y.object({
        content: y.string().min(1, "Content cannot be empty"),
        status: xNz(),
        activeForm: y.string().min(1, "Active form cannot be empty")
    })), SR6 = C6(() => y.array(uNz()))
})
// @from(Ln 287758, Col 4)
Cd4
// @from(Ln 287758, Col 9)
bd4 = "Update the todo list for the current session. To be used proactively and often to track progress and pending tasks. Make sure that at least one task is in_progress at all times. Always provide both content (imperative) and activeForm (present continuous) for each task."
// @from(Ln 287759, Col 4)
Id4 = L(() => {
    Cd4 = `Use this tool to create and manage a structured task list for your current coding session. This helps you track progress, organize complex tasks, and demonstrate thoroughness to the user.
It also helps the user understand the progress of the task and overall progress of their requests.

## When to Use This Tool
Use this tool proactively in these scenarios:

1. Complex multi-step tasks - When a task requires 3 or more distinct steps or actions
2. Non-trivial and complex tasks - Tasks that require careful planning or multiple operations
3. User explicitly requests todo list - When the user directly asks you to use the todo list
4. User provides multiple tasks - When users provide a list of things to be done (numbered or comma-separated)
5. After receiving new instructions - Immediately capture user requirements as todos
6. When you start working on a task - Mark it as in_progress BEFORE beginning work. Ideally you should only have one todo as in_progress at a time
7. After completing a task - Mark it as completed and add any new follow-up tasks discovered during implementation

## When NOT to Use This Tool

Skip using this tool when:
1. There is only a single, straightforward task
2. The task is trivial and tracking it provides no organizational benefit
3. The task can be completed in less than 3 trivial steps
4. The task is purely conversational or informational

NOTE that you should not use this tool if there is only one trivial task to do. In this case you are better off just doing the task directly.

## Examples of When to Use the Todo List

<example>
User: I want to add a dark mode toggle to the application settings. Make sure you run the tests and build when you're done!
Assistant: *Creates todo list with the following items:*
1. Creating dark mode toggle component in Settings page
2. Adding dark mode state management (context/store)
3. Implementing CSS-in-JS styles for dark theme
4. Updating existing components to support theme switching
5. Running tests and build process, addressing any failures or errors that occur
*Begins working on the first task*

<reasoning>
The assistant used the todo list because:
1. Adding dark mode is a multi-step feature requiring UI, state management, and styling changes
2. The user explicitly requested tests and build be run afterward
3. The assistant inferred that tests and build need to pass by adding "Ensure tests and build succeed" as the final task
</reasoning>
</example>

<example>
User: Help me rename the function getCwd to getCurrentWorkingDirectory across my project
Assistant: *Uses grep or search tools to locate all instances of getCwd in the codebase*
I've found 15 instances of 'getCwd' across 8 different files.
*Creates todo list with specific items for each file that needs updating*

<reasoning>
The assistant used the todo list because:
1. First, the assistant searched to understand the scope of the task
2. Upon finding multiple occurrences across different files, it determined this was a complex task with multiple steps
3. The todo list helps ensure every instance is tracked and updated systematically
4. This approach prevents missing any occurrences and maintains code consistency
</reasoning>
</example>


<example>
User: I need to implement these features for my e-commerce site: user registration, product catalog, shopping cart, and checkout flow.
Assistant: *Creates a todo list breaking down each feature into specific tasks based on the project architecture*
Let's start with user registration. This will involve creating database models, API endpoints, and frontend forms that integrate with your existing authentication system.

<reasoning>
The assistant used the todo list because:
1. The user provided multiple complex features to implement in a comma separated list
2. The todo list helps organize these large features into manageable tasks
3. This approach allows for tracking progress across the entire implementation
</reasoning>
</example>

<example>
User: Can you help optimize my React application? It's rendering slowly and has performance issues.
Assistant: *Reviews component structure, render patterns, state management, and data fetching*
After analyzing your codebase, I've identified several performance issues.
*Creates todo list with items like: 1) Implementing memoization for expensive calculations in ProductList, 2) Adding virtualization for long lists in Dashboard, 3) Optimizing image loading in Gallery component, 4) Fixing state update loops in ShoppingCart, 5) Reviewing bundle size and implementing code splitting*
Let's start by implementing memoization for the expensive calculations in your ProductList component.

<reasoning>
The assistant used the todo list because:
1. First, the assistant examined the codebase to identify specific performance issues
2. Based on this analysis, it identified multiple optimization opportunities
3. Performance optimization is a non-trivial task requiring multiple steps
4. The todo list helps methodically track improvements across different components
5. This systematic approach ensures all performance bottlenecks are addressed
</reasoning>
</example>

## Examples of When NOT to Use the Todo List

<example>
User: How do I print 'Hello World' in Python?
Assistant: In Python, you can print "Hello World" with this simple code:

python
print("Hello World")

This will output the text "Hello World" to the console when executed.

<reasoning>
The assistant did not use the todo list because this is a single, trivial task that can be completed in one step. There's no need to track multiple tasks or steps for such a straightforward request.
</reasoning>
</example>

<example>
User: What does the git status command do?
Assistant: The git status command shows the current state of your working directory and staging area. It displays which changes have been staged, which haven't, and which files aren't being tracked by Git. This is a fundamental command for understanding the current state of your repository before making commits.

<reasoning>
The assistant did not use the todo list because this is an informational request with no actual coding task to complete. The user is simply asking for an explanation, not for the assistant to perform multiple steps or tasks.
</reasoning>
</example>

<example>
User: Can you add a comment to the calculateTotal function to explain what it does?
Assistant: Sure, let me add a comment to the calculateTotal function to explain what it does.
* Uses the ${J4} tool to add a comment to the calculateTotal function *

<reasoning>
The assistant did not use the todo list because this is a single, straightforward task confined to one location in the code. Adding a comment doesn't require tracking multiple steps or systematic organization.
</reasoning>
</example>

<example>
User: Run npm install for me and tell me what happens.
Assistant: I'll run the npm install command for you.

*Executes: npm install*

The command completed successfully. Here's the output:
[Output of npm install command]

All dependencies have been installed according to your package.json file.

<reasoning>
The assistant did not use the todo list because this is a single command execution with immediate results. There are no multiple steps to track or organize, making the todo list unnecessary for this straightforward task.
</reasoning>
</example>

## Task States and Management

1. **Task States**: Use these states to track progress:
   - pending: Task not yet started
   - in_progress: Currently working on (limit to ONE task at a time)
   - completed: Task finished successfully

   **IMPORTANT**: Task descriptions must have two forms:
   - content: The imperative form describing what needs to be done (e.g., "Run tests", "Build the project")
   - activeForm: The present continuous form shown during execution (e.g., "Running tests", "Building the project")

2. **Task Management**:
   - Update task status in real-time as you work
   - Mark tasks complete IMMEDIATELY after finishing (don't batch completions)
   - Exactly ONE task must be in_progress at any time (not less, not more)
   - Complete current tasks before starting new ones
   - Remove tasks that are no longer relevant from the list entirely

3. **Task Completion Requirements**:
   - ONLY mark a task as completed when you have FULLY accomplished it
   - If you encounter errors, blockers, or cannot finish, keep the task as in_progress
   - When blocked, create a new task describing what needs to be resolved
   - Never mark a task as completed if:
     - Tests are failing
     - Implementation is partial
     - You encountered unresolved errors
     - You couldn't find necessary files or dependencies

4. **Task Breakdown**:
   - Create specific, actionable items
   - Break complex tasks into smaller, manageable steps
   - Use clear, descriptive task names
   - Always provide both forms:
     - content: "Fix authentication bug"
     - activeForm: "Fixing authentication bug"

When in doubt, use this tool. Being proactive with task management demonstrates attentiveness and ensures you complete all requirements successfully.
`
})
// @from(Ln 287940, Col 4)
mNz
// @from(Ln 287940, Col 9)
BNz
// @from(Ln 287940, Col 14)
YF
// @from(Ln 287941, Col 4)
O78 = L(() => {
    p7();
    y8();
    B1();
    gq();
    PX();
    uo1();
    sY();
    Id4();
    mNz = C6(() => y.strictObject({
        todos: SR6().describe("The updated todo list")
    })), BNz = C6(() => y.object({
        oldTodos: SR6().describe("The todo list before the update"),
        newTodos: SR6().describe("The todo list after the update"),
        verificationNudgeNeeded: y.boolean().optional()
    })), YF = Iq({
        name: Vy,
        searchHint: "manage the session task checklist",
        maxResultSizeChars: 1e5,
        strict: !0,
        async description() {
            return bd4
        },
        async prompt() {
            return Cd4
        },
        get inputSchema() {
            return mNz()
        },
        get outputSchema() {
            return BNz()
        },
        userFacingName() {
            return ""
        },
        shouldDefer: !0,
        isEnabled() {
            return !kJ()
        },
        toAutoClassifierInput(q) {
            return `${q.todos.length} items`
        },
        async checkPermissions(q) {
            return {
                behavior: "allow",
                updatedInput: q
            }
        },
        renderToolUseMessage() {
            return null
        },
        async call({
            todos: q
        }, K) {
            let _ = K.getAppState(),
                z = K.agentId ?? I8(),
                Y = _.todos[z] ?? [],
                O = q.every(($) => $.status === "completed") ? [] : q,
                w = !1;
            return K.setAppState(($) => ({
                ...$,
                todos: {
                    ...$.todos,
                    [z]: O
                }
            })), {
                data: {
                    oldTodos: Y,
                    newTodos: q,
                    verificationNudgeNeeded: w
                }
            }
        },
        mapToolResultToToolResultBlockParam({
            verificationNudgeNeeded: q
        }, K) {
            let z = q ? `

NOTE: You just closed out 3+ tasks and none of them was a verification step. Before writing your final summary, spawn the verification agent (subagent_type="${vX8}"). You cannot self-assign PARTIAL by listing caveats in your summary — only the verifier issues a verdict.` : "";
            return {
                tool_use_id: K,
                type: "tool_result",
                content: "Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable" + z
            }
        }
    })
})
// @from(Ln 288028, Col 4)
CR6 = {}
// @from(Ln 288046, Col 0)
function Ju8(q) {
    if (!Z1.isAxiosError(q)) return !1;
    if (!q.response) return !0;
    if (q.response.status >= 500) return !0;
    return !1
}
// @from(Ln 288052, Col 0)
async function Xu8(q, K) {
    let _;
    for (let z = 0; z <= mo1; z++) try {
        return await Z1.get(q, K)
    } catch (Y) {
        if (_ = Y, !Ju8(Y)) throw Y;
        if (z >= mo1) throw E(`Teleport request failed after ${z+1} attempts: ${b6(Y)}`), Y;
        let A = xd4[z] ?? 2000;
        E(`Teleport request failed (attempt ${z+1}/${mo1+1}), retrying in ${A}ms: ${b6(Y)}`), await l7(A)
    }
    throw _
}
// @from(Ln 288064, Col 0)
async function TX() {
    let q = o7()?.accessToken;
    if (q === void 0) throw Error("Claude Code web sessions require authentication with a Claude.ai account. API key authentication is not sufficient. Please run /login to authenticate, or check your authentication status with /status.");
    let K = await zD();
    if (!K) throw Error("Unable to get organization UUID");
    return {
        accessToken: q,
        orgUUID: K
    }
}
// @from(Ln 288074, Col 0)
async function Bo1() {
    let {
        accessToken: q,
        orgUUID: K
    } = await TX(), _ = `${r7().BASE_API_URL}/v1/sessions`;
    try {
        let z = {
                ...bA(q),
                "anthropic-beta": "ccr-byoc-2025-07-29",
                "x-organization-uuid": K
            },
            Y = await Xu8(_, {
                headers: z
            });
        if (Y.status !== 200) throw Error(`Failed to fetch code sessions: ${Y.statusText}`);
        return Y.data.data.map((O) => {
            let w = O.session_context.sources.find((j) => j.type === "git_repository"),
                $ = null;
            if (w?.url) {
                let j = uA6(w.url);
                if (j) {
                    let [H, J] = j.split("/");
                    if (H && J) $ = {
                        name: J,
                        owner: {
                            login: H
                        },
                        default_branch: w.revision || void 0
                    }
                }
            }
            return {
                id: O.id,
                title: O.title || "Untitled",
                description: "",
                status: O.session_status,
                repo: $,
                turns: [],
                created_at: O.created_at,
                updated_at: O.updated_at
            }
        })
    } catch (z) {
        let Y = r1(z);
        throw j6(Y), z
    }
}
// @from(Ln 288122, Col 0)
function bA(q) {
    return {
        Authorization: `Bearer ${q}`,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01"
    }
}
// @from(Ln 288129, Col 0)
async function w36(q) {
    let {
        accessToken: K,
        orgUUID: _
    } = await TX(), z = `${r7().BASE_API_URL}/v1/sessions/${q}`, Y = {
        ...bA(K),
        "anthropic-beta": "ccr-byoc-2025-07-29",
        "x-organization-uuid": _
    }, A = await Z1.get(z, {
        headers: Y,
        timeout: 15000,
        validateStatus: (O) => O < 500
    });
    if (A.status !== 200) {
        let w = A.data?.error?.message;
        if (A.status === 404) throw Error(`Session not found: ${q}`);
        if (A.status === 401) throw Error("Session expired. Please run /login to sign in again.");
        throw Error(w || `Failed to fetch session: ${A.status} ${A.statusText}`)
    }
    return A.data
}
// @from(Ln 288151, Col 0)
function Mu8(q) {
    return q.session_context.outcomes?.find((_) => _.type === "git_repository")?.git_info?.branches[0]
}
// @from(Ln 288154, Col 0)
async function po1(q, K, _) {
    try {
        let {
            accessToken: z,
            orgUUID: Y
        } = await TX(), A = `${r7().BASE_API_URL}/v1/sessions/${q}/events`, O = {
            ...bA(z),
            "anthropic-beta": "ccr-byoc-2025-07-29",
            "x-organization-uuid": Y
        }, $ = {
            events: [{
                uuid: _?.uuid ?? pNz(),
                session_id: q,
                type: "user",
                parent_tool_use_id: null,
                message: {
                    role: "user",
                    content: K
                }
            }]
        };
        E(`[sendEventToRemoteSession] Sending event to session ${q}`);
        let j = await Z1.post(A, $, {
            headers: O,
            validateStatus: (H) => H < 500,
            timeout: 30000
        });
        if (j.status === 200 || j.status === 201) return E(`[sendEventToRemoteSession] Successfully sent event to session ${q}`), !0;
        return E(`[sendEventToRemoteSession] Failed with status ${j.status}: ${I6(j.data)}`), !1
    } catch (z) {
        return E(`[sendEventToRemoteSession] Error: ${b6(z)}`), !1
    }
}
// @from(Ln 288187, Col 0)
async function Fo1(q, K) {
    try {
        let {
            accessToken: _,
            orgUUID: z
        } = await TX(), Y = `${r7().BASE_API_URL}/v1/sessions/${q}`, A = {
            ...bA(_),
            "anthropic-beta": "ccr-byoc-2025-07-29",
            "x-organization-uuid": z
        };
        E(`[updateSessionTitle] Updating title for session ${q}: "${K}"`);
        let O = await Z1.patch(Y, {
            title: K
        }, {
            headers: A,
            validateStatus: (w) => w < 500
        });
        if (O.status === 200) return E(`[updateSessionTitle] Successfully updated title for session ${q}`), !0;
        return E(`[updateSessionTitle] Failed with status ${O.status}: ${I6(O.data)}`), !1
    } catch (_) {
        return E(`[updateSessionTitle] Error: ${b6(_)}`), !1
    }
}
// @from(Ln 288210, Col 4)
xd4
// @from(Ln 288210, Col 9)
mo1
// @from(Ln 288210, Col 14)
FNz = "ccr-byoc-2025-07-29"
// @from(Ln 288211, Col 4)
gNz
// @from(Ln 288212, Col 4)
VX = L(() => {
    CK();
    z3();
    YD();
    p7();
    T7();
    K8();
    gZ();
    m8();
    U8();
    e8();
    xd4 = [2000, 4000, 8000, 16000], mo1 = xd4.length;
    gNz = C6(() => fK.object({
        id: fK.string(),
        title: fK.string(),
        description: fK.string(),
        status: fK.enum(["idle", "working", "waiting", "completed", "archived", "cancelled", "rejected"]),
        repo: fK.object({
            name: fK.string(),
            owner: fK.object({
                login: fK.string()
            }),
            default_branch: fK.string().optional()
        }).nullable(),
        turns: fK.array(fK.string()),
        created_at: fK.string(),
        updated_at: fK.string()
    }))
})
// @from(Ln 288241, Col 0)
async function AF() {
    let q = o7()?.accessToken;
    if (!q) throw Error("Claude Code web sessions require authentication with a Claude.ai account. API key authentication is not sufficient. Please run /login to authenticate, or check your authentication status with /status.");
    let K = await zD();
    if (!K) throw Error("Unable to get organization UUID");
    let _ = `${r7().BASE_API_URL}/v1/environment_providers`;
    try {
        let z = {
                ...bA(q),
                "x-organization-uuid": K
            },
            Y = await Z1.get(_, {
                headers: z,
                timeout: 15000
            });
        if (Y.status !== 200) throw Error(`Failed to fetch environments: ${Y.status} ${Y.statusText}`);
        return Y.data.environments
    } catch (z) {
        let Y = r1(z);
        throw j6(Y), Y
    }
}
// @from(Ln 288263, Col 0)
async function bR6(q = "Default", K) {
    let _ = o7()?.accessToken;
    if (!_) throw Error("No access token available");
    let z = await zD();
    if (!z) throw Error("Unable to get organization UUID");
    let Y = `${r7().BASE_API_URL}/v1/environment_providers/cloud/create`;
    return (await Z1.post(Y, {
        name: q,
        kind: "anthropic_cloud",
        description: "Default - trusted network access",
        config: {
            environment_type: "anthropic",
            cwd: "/home/user",
            init_script: null,
            environment: {},
            languages: [{
                name: "python",
                version: "3.11"
            }, {
                name: "node",
                version: "20"
            }],
            network_config: {
                allowed_hosts: [],
                allow_default_hosts: !0
            }
        }
    }, {
        headers: {
            ...bA(_),
            "anthropic-beta": "ccr-byoc-2025-07-29",
            "x-organization-uuid": z
        },
        timeout: 15000,
        signal: K
    })).data
}
// @from(Ln 288300, Col 4)
IR6 = L(() => {
    CK();
    z3();
    YD();
    T7();
    m8();
    U8();
    VX()
})
// @from(Ln 288309, Col 0)
async function Pu8() {
    if (!i7()) return !1;
    return _Y()
}
// @from(Ln 288313, Col 0)
async function ud4() {
    return await if6({
        ignoreUntracked: !0
    })
}
// @from(Ln 288318, Col 0)
async function md4() {
    try {
        return await AF()
    } catch (q) {
        if (Z1.isAxiosError(q) && q.response?.status === 401) throw q;
        return E(`fetchRemoteEnvironmentsForEligibility failed: ${b6(q)}`), null
    }
}
// @from(Ln 288327, Col 0)
function Wu8() {
    return ez(b8()) !== null
}
// @from(Ln 288330, Col 0)
async function TJ6(q, K, _) {
    try {
        let z = o7()?.accessToken;
        if (!z) return E("checkGithubAppInstalled: No access token found, assuming app not installed"), !1;
        let Y = await zD();
        if (!Y) return E("checkGithubAppInstalled: No org UUID found, assuming app not installed"), !1;
        let A = `${r7().BASE_API_URL}/api/oauth/organizations/${Y}/code/repos/${q}/${K}`,
            O = {
                ...bA(z),
                "x-organization-uuid": Y
            };
        E(`Checking GitHub app installation for ${q}/${K}`);
        let w = await Z1.get(A, {
            headers: O,
            timeout: 15000,
            signal: _
        });
        if (w.status === 200) {
            if (w.data.status) {
                let $ = w.data.status.app_installed;
                return E(`GitHub app ${$?"is":"is not"} installed on ${q}/${K}`), $
            }
            return E(`GitHub app is not installed on ${q}/${K} (status is null)`), !1
        }
        return E(`checkGithubAppInstalled: Unexpected response status ${w.status}`), !1
    } catch (z) {
        if (Z1.isAxiosError(z)) {
            let Y = z.response?.status;
            if (Y && Y >= 400 && Y < 500) return E(`checkGithubAppInstalled: Got ${Y} error, app likely not installed on ${q}/${K}`), !1
        }
        return E(`checkGithubAppInstalled error: ${b6(z)}`), !1
    }
}
// @from(Ln 288363, Col 0)
async function UNz() {
    try {
        let q = o7()?.accessToken;
        if (!q) return E("checkGithubTokenSynced: No access token found"), !1;
        let K = await zD();
        if (!K) return E("checkGithubTokenSynced: No org UUID found"), !1;
        let _ = `${r7().BASE_API_URL}/api/oauth/organizations/${K}/sync/github/auth`,
            z = {
                ...bA(q),
                "x-organization-uuid": K
            };
        E("Checking if GitHub token is synced via web-setup");
        let Y = await Z1.get(_, {
                headers: z,
                timeout: 15000
            }),
            A = Y.status === 200 && Y.data?.is_authenticated === !0;
        return E(`GitHub token synced: ${A} (status=${Y.status}, data=${JSON.stringify(Y.data)})`), A
    } catch (q) {
        if (Z1.isAxiosError(q)) {
            let K = q.response?.status;
            if (K && K >= 400 && K < 500) return E(`checkGithubTokenSynced: Got ${K}, token not synced`), !1
        }
        return E(`checkGithubTokenSynced error: ${b6(q)}`), !1
    }
}
// @from(Ln 288389, Col 0)
async function Bd4(q, K) {
    if (await TJ6(q, K)) return {
        hasAccess: !0,
        method: "github-app"
    };
    if (u8("tengu_cobalt_lantern", !1) && await UNz()) return {
        hasAccess: !0,
        method: "token-sync"
    };
    return {
        hasAccess: !1,
        method: "none"
    }
}
// @from(Ln 288403, Col 4)
xR6 = L(() => {
    CK();
    z3();
    YD();
    B1();
    T7();
    n7();
    K8();
    gZ();
    m8();
    pK();
    VX();
    IR6()
})
// @from(Ln 288417, Col 0)
async function pd4({
    skipBundle: q = !1
} = {}) {
    let K = [];
    if (!N5("allow_remote_sessions")) return K.push({
        type: "policy_blocked"
    }), K;
    let [_, z] = await Promise.all([Pu8(), oN()]), Y = null;
    if (_) K.push({
        type: "not_logged_in"
    });
    else try {
        Y = await md4()
    } catch {
        K.push({
            type: "not_logged_in"
        })
    }
    let A = v7()?.remote?.defaultEnvironmentId,
        O = A !== void 0 && Y !== null && Y.some(($) => $.environment_id === A && $.kind === "byoc"),
        w = !q && (S6(process.env.CCR_FORCE_BUNDLE) || S6(process.env.CCR_ENABLE_BUNDLE) || await gv("tengu_ccr_bundle_seed_enabled"));
    if (!Wu8()) K.push({
        type: "not_in_git_repo"
    });
    else if (w);
    else if (z === null) K.push({
        type: "no_git_remote"
    });
    else if (!O && z.host === "github.com") {
        if (!await TJ6(z.owner, z.name)) K.push({
            type: "github_app_not_installed"
        })
    }
    return K
}
// @from(Ln 288452, Col 4)
Fd4 = L(() => {
    B1();
    J2();
    gZ();
    Q8();
    a1();
    xR6()
})
// @from(Ln 288460, Col 4)
co1 = {}
// @from(Ln 288472, Col 0)
function mx() {
    return Qo1() && u8("tengu_ccr_bridge", !1)
}
// @from(Ln 288475, Col 0)
async function go1() {
    return Qo1() && await gv("tengu_ccr_bridge")
}
// @from(Ln 288478, Col 0)
async function Uo1() {
    if (!Qo1()) return "Remote Control requires a claude.ai subscription. Run `claude auth login` to sign in with your claude.ai account.";
    if (!QNz()) return "Remote Control requires a full-scope login token. Long-lived tokens (from `claude setup-token` or CLAUDE_CODE_OAUTH_TOKEN) are limited to inference-only for security reasons. Run `claude auth login` to use Remote Control.";
    if (!dNz()?.organizationUuid) return "Unable to determine your organization for Remote Control eligibility. Run `claude auth login` to refresh your account information.";
    if (!await gv("tengu_ccr_bridge")) return "Remote Control is not yet enabled for your account.";
    return null
}
// @from(Ln 288486, Col 0)
function Qo1() {
    try {
        return i7()
    } catch {
        return !1
    }
}
// @from(Ln 288494, Col 0)
function QNz() {
    try {
        return AD()
    } catch {
        return !1
    }
}
// @from(Ln 288502, Col 0)
function dNz() {
    try {
        return k_()
    } catch {
        return
    }
}
// @from(Ln 288510, Col 0)
function do1() {
    return u8("tengu_bridge_repl_v2_cse_shim_enabled", !0)
}
// @from(Ln 288514, Col 0)
function cNz() {
    let q = Fv("tengu_bridge_min_version", {
        minVersion: "0.0.0"
    });
    if (q.minVersion && Qa({
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.VERSION, q.minVersion)) return `Your version of Claude Code (${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION}) is too old for Remote Control.
Version ${q.minVersion} or higher is required. Run \`claude update\` to update.`;
    return null
}
// @from(Ln 288530, Col 0)
function lNz() {
    if ($36()) return !0;
    return !1
}
// @from(Ln 288535, Col 0)
function $36() {
    return !1
}
// @from(Ln 288539, Col 0)
function nNz() {
    return !1
}
// @from(Ln 288542, Col 4)
aR = L(() => {
    B1();
    T7();
    Q8()
})
// @from(Ln 288547, Col 4)
oo1 = {}
// @from(Ln 288560, Col 0)
function Ud4() {
    return J2(), B7(Du8)
}
// @from(Ln 288564, Col 0)
function w78() {
    if (!u8(lo1, !1)) return !1;
    return Ud4().isPolicyAllowed(no1)
}
// @from(Ln 288569, Col 0)
function VJ6() {
    if (!w78()) return;
    return $78()
}
// @from(Ln 288574, Col 0)
function j78() {
    $78.cache?.clear?.()
}
// @from(Ln 288578, Col 0)
function io1() {
    let q = t3();
    try {
        let K = q.read();
        if (K?.trustedDeviceToken) delete K.trustedDeviceToken, q.update(K)
    } catch {}
    $78.cache?.clear?.()
}
// @from(Ln 288586, Col 0)
async function ro1() {
    try {
        if (!await gv(lo1)) {
            E(`[trusted-device] Gate ${lo1} is off, skipping enrollment`);
            return
        }
        if (process.env.CLAUDE_TRUSTED_DEVICE_TOKEN) {
            E("[trusted-device] CLAUDE_TRUSTED_DEVICE_TOKEN env var is set, skipping enrollment (env var takes precedence)");
            return
        }
        let q = Ud4();
        if (await q.waitForPolicyLimitsToLoad(), !q.isPolicyAllowed(no1)) {
            E(`[trusted-device] Org has not enabled ${no1}, skipping enrollment`);
            return
        }
        let {
            getClaudeAIOAuthTokens: K
        } = (T7(), B7(zR)), _ = K()?.accessToken;
        if (!_) {
            E("[trusted-device] No OAuth token, skipping enrollment");
            return
        }
        let z = t3();
        if (o3()) {
            E("[trusted-device] Essential traffic only, skipping enrollment");
            return
        }
        let Y = r7().BASE_API_URL,
            A;
        try {
            A = await Z1.post(`${Y}/api/auth/trusted_devices`, {
                display_name: `Claude Code on ${iNz()} · ${process.platform}`
            }, {
                headers: {
                    Authorization: `Bearer ${_}`,
                    "Content-Type": "application/json"
                },
                timeout: 1e4,
                validateStatus: (w) => w < 500
            })
        } catch (w) {
            E(`[trusted-device] Enrollment request failed: ${b6(w)}`);
            return
        }
        if (A.status !== 200 && A.status !== 201) {
            E(`[trusted-device] Enrollment failed ${A.status}: ${I6(A.data).slice(0,200)}`);
            return
        }
        let O = A.data?.device_token;
        if (!O || typeof O !== "string") {
            E("[trusted-device] Enrollment response missing device_token field");
            return
        }
        try {
            let w = z.read();
            if (!w) {
                E("[trusted-device] Cannot read storage, skipping token persist");
                return
            }
            w.trustedDeviceToken = O;
            let $ = z.update(w);
            if (!$.success) {
                E(`[trusted-device] Failed to persist token: ${$.warning??"unknown"}`);
                return
            }
            $78.cache?.clear?.(), E(`[trusted-device] Enrolled device_id=${A.data.device_id??"unknown"}`)
        } catch (w) {
            E(`[trusted-device] Storage write failed: ${b6(w)}`)
        }
    } catch (q) {
        E(`[trusted-device] Enrollment error: ${b6(q)}`)
    }
}
// @from(Ln 288659, Col 4)
lo1 = "tengu_sessions_elevated_auth_enforcement"
// @from(Ln 288660, Col 4)
no1 = "require_trusted_devices"
// @from(Ln 288661, Col 4)
$78
// @from(Ln 288662, Col 4)
kJ6 = L(() => {
    CK();
    U4();
    z3();
    B1();
    K8();
    m8();
    G$();
    _46();
    e8();
    $78 = P1(() => {
        let q = process.env.CLAUDE_TRUSTED_DEVICE_TOKEN;
        if (q) return q;
        return t3().read()?.trustedDeviceToken
    })
})
// @from(Ln 288678, Col 0)
async function ao1() {
    try {
        await Wa(() => {
            let q = OH();
            if (q.error) throw Error(`Failed to get auth headers: ${q.error}`);
            return Z1.post(`${r7().BASE_API_URL}/api/oauth/account/grove_notice_viewed`, {}, {
                headers: {
                    ...q.headers,
                    "User-Agent": yA()
                }
            })
        }), OF.cache.clear?.()
    } catch (q) {
        j6(q)
    }
}
// @from(Ln 288694, Col 0)
async function Zu8(q) {
    try {
        await Wa(() => {
            let K = OH();
            if (K.error) throw Error(`Failed to get auth headers: ${K.error}`);
            return Z1.patch(`${r7().BASE_API_URL}/api/oauth/account/settings`, {
                grove_enabled: q
            }, {
                headers: {
                    ...K.headers,
                    "User-Agent": yA()
                }
            })
        }), OF.cache.clear?.()
    } catch (K) {
        j6(K)
    }
}
// @from(Ln 288712, Col 0)
async function uR6() {
    if (!u26()) return !1;
    let q = k_()?.accountUuid;
    if (!q) return !1;
    let _ = H8().groveConfigCache?.[q],
        z = Date.now();
    if (!_) return E("Grove: No cache, fetching config in background (dialog skipped this session)"), Qd4(q), !1;
    if (z - _.timestamp > dd4) return E("Grove: Cache stale, returning cached data and refreshing in background"), Qd4(q), _.grove_enabled;
    return E("Grove: Using fresh cached config"), _.grove_enabled
}
// @from(Ln 288722, Col 0)
async function Qd4(q) {
    try {
        let K = await j36();
        if (!K.success) return;
        let _ = K.data.grove_enabled,
            z = H8().groveConfigCache?.[q];
        if (z?.grove_enabled === _ && Date.now() - z.timestamp <= dd4) return;
        d8((Y) => ({
            ...Y,
            groveConfigCache: {
                ...Y.groveConfigCache,
                [q]: {
                    grove_enabled: _,
                    timestamp: Date.now()
                }
            }
        }))
    } catch (K) {
        E(`Grove: Failed to fetch and store config: ${K}`)
    }
}
// @from(Ln 288744, Col 0)
function so1(q, K, _) {
    if (!q.success || !K.success) return !1;
    let z = q.data,
        Y = K.data;
    if (z.grove_enabled !== null) return !1;
    if (_) return !0;
    if (!Y.notice_is_grace_period) return !0;
    let O = Y.notice_reminder_frequency;
    if (O !== null && z.grove_notice_viewed_at) {
        let w = new Date(z.grove_notice_viewed_at).getTime();
        if (isNaN(w)) return j6(Error(`Invalid grove_notice_viewed_at from API: ${z.grove_notice_viewed_at}`)), !0;
        return Math.floor((Date.now() - w) / 86400000) >= O
    } else {
        let w = z.grove_notice_viewed_at;
        return w === null || w === void 0
    }
}
// @from(Ln 288761, Col 0)
async function cd4() {
    let [q, K] = await Promise.all([OF(), j36()]);
    if (so1(q, K, !1)) {
        let z = K.success ? K.data : null;
        if (d("tengu_grove_print_viewed", {
                dismissable: z?.notice_is_grace_period
            }), z === null || z.notice_is_grace_period) tD6(`
An update to our Consumer Terms and Privacy Policy will take effect on October 8, 2025. Run \`claude\` to review the updated terms.

`), await ao1();
        else tD6(`
[ACTION REQUIRED] An update to our Consumer Terms and Privacy Policy has taken effect on October 8, 2025. You must run \`claude\` to review the updated terms.

`), await WK(1)
    }
}
// @from(Ln 288777, Col 4)
dd4 = 86400000
// @from(Ln 288778, Col 4)
OF
// @from(Ln 288778, Col 8)
j36
// @from(Ln 288779, Col 4)
mR6 = L(() => {
    CK();
    U4();
    C8();
    T7();
    K8();
    CY();
    G$();
    z3();
    h1();
    Zf();
    U8();
    OF = P1(async () => {
        if (o3()) return {
            success: !1
        };
        try {
            return {
                success: !0,
                data: (await Wa(() => {
                    let K = OH();
                    if (K.error) throw Error(`Failed to get auth headers: ${K.error}`);
                    return Z1.get(`${r7().BASE_API_URL}/api/oauth/account/settings`, {
                        headers: {
                            ...K.headers,
                            "User-Agent": yA()
                        }
                    })
                })).data
            }
        } catch (q) {
            return j6(q), OF.cache.clear?.(), {
                success: !1
            }
        }
    });
    j36 = P1(async () => {
        if (o3()) return {
            success: !1
        };
        try {
            let q = await Wa(() => {
                    let A = OH();
                    if (A.error) throw Error(`Failed to get auth headers: ${A.error}`);
                    return Z1.get(`${r7().BASE_API_URL}/api/claude_code_grove`, {
                        headers: {
                            ...A.headers,
                            "User-Agent": OI()
                        },
                        timeout: 3000
                    })
                }),
                {
                    grove_enabled: K,
                    domain_excluded: _,
                    notice_is_grace_period: z,
                    notice_reminder_frequency: Y
                } = q.data;
            return {
                success: !0,
                data: {
                    grove_enabled: K,
                    domain_excluded: _ ?? !1,
                    notice_is_grace_period: z ?? !0,
                    notice_reminder_frequency: Y
                }
            }
        } catch (q) {
            return E(`Failed to fetch Grove notice config: ${q}`), {
                success: !1
            }
        }
    })
})
// @from(Ln 288857, Col 0)
function ld4({
    isDisabled: q = !1,
    visibleOptionCount: K = 5,
    options: _,
    defaultValue: z = [],
    onChange: Y,
    onCancel: A,
    onFocus: O,
    focusValue: w,
    submitButtonText: $,
    onSubmit: j,
    onDownFromLastItem: H,
    onUpFromFirstItem: J,
    initialFocusLast: X,
    hideIndexes: M = !1
}) {
    let [P, W] = H36.useState(z), [D, Z] = H36.useState(!1), [G, f] = H36.useState(_);
    if (_ !== G && !rNz(_, G)) W(z), f(_);
    let [v, V] = H36.useState(() => {
        let C = new Map;
        return _.forEach((x) => {
            if (x.type === "input" && x.initialValue) C.set(x.value, x.initialValue)
        }), C
    }), k = H36.useCallback((C) => {
        let x = typeof C === "function" ? C(P) : C;
        W(x), Y?.(x)
    }, [P, Y]), N = ey8({
        visibleOptionCount: K,
        options: _,
        initialFocusValue: X ? _[_.length - 1]?.value : void 0,
        onFocus: O,
        focusValue: w
    });
    A2("multi-select");
    let R = H36.useCallback((C, x) => {
        V((m) => {
            let S = new Map(m);
            return S.set(C, x), S
        });
        let B = _.find((m) => m.value === C);
        if (B && B.type === "input") B.onChange(x);
        k((m) => {
            if (x) {
                if (!m.includes(C)) return [...m, C];
                return m
            } else return m.filter((S) => S !== C)
        })
    }, [_, k]);
    return {
        ...N,
        selectedValues: P,
        inputValues: v,
        isSubmitFocused: D,
        updateInputValue: R,
        onCancel: A,
        handleKeyDown: (C) => {
            if (q) return;
            let x = eH8(C.key),
                m = _.find((F) => F.value === N.focusedValue)?.type === "input";
            if (m) {
                if (!(C.key === "up" || C.key === "down" || C.key === "escape" || C.key === "tab" || C.key === "return" || C.ctrl && (C.key === "n" || C.key === "p" || C.key === "return"))) return
            }
            let S = _[_.length - 1]?.value;
            if (C.key === "tab" && !C.shift) {
                if (C.preventDefault(), $ && j && N.focusedValue === S && !D) Z(!0);
                else if (!D) N.focusNextOption();
                return
            }
            if (C.key === "tab" && C.shift) {
                if (C.preventDefault(), $ && j && D) Z(!1), N.focusOption(S);
                else N.focusPreviousOption();
                return
            }
            if (C.key === "down" || C.ctrl && C.key === "n" || !C.ctrl && !C.shift && C.key === "j") {
                if (C.preventDefault(), D && H) H();
                else if ($ && j && N.focusedValue === S && !D) Z(!0);
                else if (!$ && H && N.focusedValue === S) H();
                else if (!D) N.focusNextOption();
                return
            }
            if (C.key === "up" || C.ctrl && C.key === "p" || !C.ctrl && !C.shift && C.key === "k") {
                if (C.preventDefault(), $ && j && D) Z(!1), N.focusOption(S);
                else if (J && N.focusedValue === _[0]?.value) J();
                else N.focusPreviousOption();
                return
            }
            if (C.key === "pagedown") {
                C.preventDefault(), N.focusNextPage();
                return
            }
            if (C.key === "pageup") {
                C.preventDefault(), N.focusPreviousPage();
                return
            }
            if (C.key === "return" || VA6(C.key) === " ") {
                if (C.preventDefault(), C.ctrl && C.key === "return" && m && j) {
                    j(P);
                    return
                }
                if (D && j) {
                    j(P);
                    return
                }
                if (C.key === "return" && !$ && j) {
                    j(P);
                    return
                }
                if (N.focusedValue !== void 0) {
                    let F = P.includes(N.focusedValue) ? P.filter((U) => U !== N.focusedValue) : [...P, N.focusedValue];
                    k(F)
                }
                return
            }
            if (!M && /^[0-9]$/.test(x)) {
                C.preventDefault();
                let F = parseInt(x) - 1;
                if (F >= 0 && F < _.length) {
                    let U = _[F].value,
                        g = P.includes(U) ? P.filter((c) => c !== U) : [...P, U];
                    k(g)
                }
                return
            }
            if (C.key === "escape") A(), C.stopImmediatePropagation()
        }
    }
}
// @from(Ln 288984, Col 4)
H36