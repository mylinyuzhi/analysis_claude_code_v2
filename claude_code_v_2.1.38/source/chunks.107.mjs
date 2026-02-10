
// @from(Ln 265356, Col 4)
T84 = R((dEw, N84) => {
    var G84 = (A, q) => (...K) => {
            return `\x1B[${A(...K)+q}m`
        },
        Z84 = (A, q) => (...K) => {
            let Y = A(...K);
            return `\x1B[${38+q};5;${Y}m`
        },
        f84 = (A, q) => (...K) => {
            let Y = A(...K);
            return `\x1B[${38+q};2;${Y[0]};${Y[1]};${Y[2]}m`
        },
        iJ6 = (A) => A,
        V84 = (A, q, K) => [A, q, K],
        HM1 = (A, q, K) => {
            Object.defineProperty(A, q, {
                get: () => {
                    let Y = K();
                    return Object.defineProperty(A, q, {
                        value: Y,
                        enumerable: !0,
                        configurable: !0
                    }), Y
                },
                enumerable: !0,
                configurable: !0
            })
        },
        aPA, $M1 = (A, q, K, Y) => {
            if (aPA === void 0) aPA = UHA();
            let z = Y ? 10 : 0,
                w = {};
            for (let [H, $] of Object.entries(aPA)) {
                let O = H === "ansi16" ? "ansi" : H;
                if (H === q) w[O] = A(K, z);
                else if (typeof $ === "object") w[O] = A($[q], z)
            }
            return w
        };

    function zF9() {
        let A = new Map,
            q = {
                modifier: {
                    reset: [0, 0],
                    bold: [1, 22],
                    dim: [2, 22],
                    italic: [3, 23],
                    underline: [4, 24],
                    inverse: [7, 27],
                    hidden: [8, 28],
                    strikethrough: [9, 29]
                },
                color: {
                    black: [30, 39],
                    red: [31, 39],
                    green: [32, 39],
                    yellow: [33, 39],
                    blue: [34, 39],
                    magenta: [35, 39],
                    cyan: [36, 39],
                    white: [37, 39],
                    blackBright: [90, 39],
                    redBright: [91, 39],
                    greenBright: [92, 39],
                    yellowBright: [93, 39],
                    blueBright: [94, 39],
                    magentaBright: [95, 39],
                    cyanBright: [96, 39],
                    whiteBright: [97, 39]
                },
                bgColor: {
                    bgBlack: [40, 49],
                    bgRed: [41, 49],
                    bgGreen: [42, 49],
                    bgYellow: [43, 49],
                    bgBlue: [44, 49],
                    bgMagenta: [45, 49],
                    bgCyan: [46, 49],
                    bgWhite: [47, 49],
                    bgBlackBright: [100, 49],
                    bgRedBright: [101, 49],
                    bgGreenBright: [102, 49],
                    bgYellowBright: [103, 49],
                    bgBlueBright: [104, 49],
                    bgMagentaBright: [105, 49],
                    bgCyanBright: [106, 49],
                    bgWhiteBright: [107, 49]
                }
            };
        q.color.gray = q.color.blackBright, q.bgColor.bgGray = q.bgColor.bgBlackBright, q.color.grey = q.color.blackBright, q.bgColor.bgGrey = q.bgColor.bgBlackBright;
        for (let [K, Y] of Object.entries(q)) {
            for (let [z, w] of Object.entries(Y)) q[z] = {
                open: `\x1B[${w[0]}m`,
                close: `\x1B[${w[1]}m`
            }, Y[z] = q[z], A.set(w[0], w[1]);
            Object.defineProperty(q, K, {
                value: Y,
                enumerable: !1
            })
        }
        return Object.defineProperty(q, "codes", {
            value: A,
            enumerable: !1
        }), q.color.close = "\x1B[39m", q.bgColor.close = "\x1B[49m", HM1(q.color, "ansi", () => $M1(G84, "ansi16", iJ6, !1)), HM1(q.color, "ansi256", () => $M1(Z84, "ansi256", iJ6, !1)), HM1(q.color, "ansi16m", () => $M1(f84, "rgb", V84, !1)), HM1(q.bgColor, "ansi", () => $M1(G84, "ansi16", iJ6, !0)), HM1(q.bgColor, "ansi256", () => $M1(Z84, "ansi256", iJ6, !0)), HM1(q.bgColor, "ansi16m", () => $M1(f84, "rgb", V84, !0)), q
    }
    Object.defineProperty(N84, "exports", {
        enumerable: !0,
        get: zF9
    })
})
// @from(Ln 265467, Col 4)
k84 = R((cEw, E84) => {
    var wF9 = h1("os"),
        v84 = h1("tty"),
        LR = cN1(),
        {
            env: Hj
        } = process,
        _s;
    if (LR("no-color") || LR("no-colors") || LR("color=false") || LR("color=never")) _s = 0;
    else if (LR("color") || LR("colors") || LR("color=true") || LR("color=always")) _s = 1;
    if ("FORCE_COLOR" in Hj)
        if (Hj.FORCE_COLOR === "true") _s = 1;
        else if (Hj.FORCE_COLOR === "false") _s = 0;
    else _s = Hj.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(Hj.FORCE_COLOR, 10), 3);

    function sPA(A) {
        if (A === 0) return !1;
        return {
            level: A,
            hasBasic: !0,
            has256: A >= 2,
            has16m: A >= 3
        }
    }

    function tPA(A, q) {
        if (_s === 0) return 0;
        if (LR("color=16m") || LR("color=full") || LR("color=truecolor")) return 3;
        if (LR("color=256")) return 2;
        if (A && !q && _s === void 0) return 0;
        let K = _s || 0;
        if (Hj.TERM === "dumb") return K;
        if (process.platform === "win32") {
            let Y = wF9.release().split(".");
            if (Number(Y[0]) >= 10 && Number(Y[2]) >= 10586) return Number(Y[2]) >= 14931 ? 3 : 2;
            return 1
        }
        if ("CI" in Hj) {
            if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((Y) => (Y in Hj)) || Hj.CI_NAME === "codeship") return 1;
            return K
        }
        if ("TEAMCITY_VERSION" in Hj) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(Hj.TEAMCITY_VERSION) ? 1 : 0;
        if (Hj.COLORTERM === "truecolor") return 3;
        if ("TERM_PROGRAM" in Hj) {
            let Y = parseInt((Hj.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
            switch (Hj.TERM_PROGRAM) {
                case "iTerm.app":
                    return Y >= 3 ? 3 : 2;
                case "Apple_Terminal":
                    return 2
            }
        }
        if (/-256(color)?$/i.test(Hj.TERM)) return 2;
        if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(Hj.TERM)) return 1;
        if ("COLORTERM" in Hj) return 1;
        return K
    }

    function HF9(A) {
        let q = tPA(A, A && A.isTTY);
        return sPA(q)
    }
    E84.exports = {
        supportsColor: HF9,
        stdout: sPA(tPA(!0, v84.isatty(1))),
        stderr: sPA(tPA(!0, v84.isatty(2)))
    }
})
// @from(Ln 265535, Col 4)
R84 = R((lEw, L84) => {
    var $F9 = (A, q, K) => {
            let Y = A.indexOf(q);
            if (Y === -1) return A;
            let z = q.length,
                w = 0,
                H = "";
            do H += A.substr(w, Y - w) + q + K, w = Y + z, Y = A.indexOf(q, w); while (Y !== -1);
            return H += A.substr(w), H
        },
        OF9 = (A, q, K, Y) => {
            let z = 0,
                w = "";
            do {
                let H = A[Y - 1] === "\r";
                w += A.substr(z, (H ? Y - 1 : Y) - z) + q + (H ? `\r
` : `
`) + K, z = Y + 1, Y = A.indexOf(`
`, z)
            } while (Y !== -1);
            return w += A.substr(z), w
        };
    L84.exports = {
        stringReplaceAll: $F9,
        stringEncaseCRLFWithFirstIndex: OF9
    }
})
// @from(Ln 265562, Col 4)
I84 = R((iEw, h84) => {
    var _F9 = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi,
        y84 = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g,
        JF9 = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/,
        XF9 = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi,
        DF9 = new Map([
            ["n", `
`],
            ["r", "\r"],
            ["t", "\t"],
            ["b", "\b"],
            ["f", "\f"],
            ["v", "\v"],
            ["0", "\x00"],
            ["\\", "\\"],
            ["e", "\x1B"],
            ["a", "\x07"]
        ]);

    function S84(A) {
        let q = A[0] === "u",
            K = A[1] === "{";
        if (q && !K && A.length === 5 || A[0] === "x" && A.length === 3) return String.fromCharCode(parseInt(A.slice(1), 16));
        if (q && K) return String.fromCodePoint(parseInt(A.slice(2, -1), 16));
        return DF9.get(A) || A
    }

    function jF9(A, q) {
        let K = [],
            Y = q.trim().split(/\s*,\s*/g),
            z;
        for (let w of Y) {
            let H = Number(w);
            if (!Number.isNaN(H)) K.push(H);
            else if (z = w.match(JF9)) K.push(z[2].replace(XF9, ($, O, _) => O ? S84(O) : _));
            else throw Error(`Invalid Chalk template style argument: ${w} (in style '${A}')`)
        }
        return K
    }

    function MF9(A) {
        y84.lastIndex = 0;
        let q = [],
            K;
        while ((K = y84.exec(A)) !== null) {
            let Y = K[1];
            if (K[2]) {
                let z = jF9(Y, K[2]);
                q.push([Y].concat(z))
            } else q.push([Y])
        }
        return q
    }

    function C84(A, q) {
        let K = {};
        for (let z of q)
            for (let w of z.styles) K[w[0]] = z.inverse ? null : w.slice(1);
        let Y = A;
        for (let [z, w] of Object.entries(K)) {
            if (!Array.isArray(w)) continue;
            if (!(z in Y)) throw Error(`Unknown Chalk style: ${z}`);
            Y = w.length > 0 ? Y[z](...w) : Y[z]
        }
        return Y
    }
    h84.exports = (A, q) => {
        let K = [],
            Y = [],
            z = [];
        if (q.replace(_F9, (w, H, $, O, _, J) => {
                if (H) z.push(S84(H));
                else if (O) {
                    let X = z.join("");
                    z = [], Y.push(K.length === 0 ? X : C84(A, K)(X)), K.push({
                        inverse: $,
                        styles: MF9(O)
                    })
                } else if (_) {
                    if (K.length === 0) throw Error("Found extraneous } in Chalk template literal");
                    Y.push(C84(A, K)(z.join(""))), z = [], K.pop()
                } else z.push(J)
            }), Y.push(z.join("")), K.length > 0) {
            let w = `Chalk template literal is missing ${K.length} closing bracket${K.length===1?"":"s"} (\`}\`)`;
            throw Error(w)
        }
        return Y.join("")
    }
})
// @from(Ln 265651, Col 4)
g84 = R((nEw, Q84) => {
    var FB1 = T84(),
        {
            stdout: AWA,
            stderr: qWA
        } = k84(),
        {
            stringReplaceAll: PF9,
            stringEncaseCRLFWithFirstIndex: WF9
        } = R84(),
        {
            isArray: nJ6
        } = Array,
        b84 = ["ansi", "ansi", "ansi256", "ansi16m"],
        OM1 = Object.create(null),
        GF9 = (A, q = {}) => {
            if (q.level && !(Number.isInteger(q.level) && q.level >= 0 && q.level <= 3)) throw Error("The `level` option should be an integer from 0 to 3");
            let K = AWA ? AWA.level : 0;
            A.level = q.level === void 0 ? K : q.level
        };
    class u84 {
        constructor(A) {
            return B84(A)
        }
    }
    var B84 = (A) => {
        let q = {};
        return GF9(q, A), q.template = (...K) => F84(q.template, ...K), Object.setPrototypeOf(q, rJ6.prototype), Object.setPrototypeOf(q.template, q), q.template.constructor = () => {
            throw Error("`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.")
        }, q.template.Instance = u84, q.template
    };

    function rJ6(A) {
        return B84(A)
    }
    for (let [A, q] of Object.entries(FB1)) OM1[A] = {
        get() {
            let K = oJ6(this, KWA(q.open, q.close, this._styler), this._isEmpty);
            return Object.defineProperty(this, A, {
                value: K
            }), K
        }
    };
    OM1.visible = {
        get() {
            let A = oJ6(this, this._styler, !0);
            return Object.defineProperty(this, "visible", {
                value: A
            }), A
        }
    };
    var m84 = ["rgb", "hex", "keyword", "hsl", "hsv", "hwb", "ansi", "ansi256"];
    for (let A of m84) OM1[A] = {
        get() {
            let {
                level: q
            } = this;
            return function(...K) {
                let Y = KWA(FB1.color[b84[q]][A](...K), FB1.color.close, this._styler);
                return oJ6(this, Y, this._isEmpty)
            }
        }
    };
    for (let A of m84) {
        let q = "bg" + A[0].toUpperCase() + A.slice(1);
        OM1[q] = {
            get() {
                let {
                    level: K
                } = this;
                return function(...Y) {
                    let z = KWA(FB1.bgColor[b84[K]][A](...Y), FB1.bgColor.close, this._styler);
                    return oJ6(this, z, this._isEmpty)
                }
            }
        }
    }
    var ZF9 = Object.defineProperties(() => {}, {
            ...OM1,
            level: {
                enumerable: !0,
                get() {
                    return this._generator.level
                },
                set(A) {
                    this._generator.level = A
                }
            }
        }),
        KWA = (A, q, K) => {
            let Y, z;
            if (K === void 0) Y = A, z = q;
            else Y = K.openAll + A, z = q + K.closeAll;
            return {
                open: A,
                close: q,
                openAll: Y,
                closeAll: z,
                parent: K
            }
        },
        oJ6 = (A, q, K) => {
            let Y = (...z) => {
                if (nJ6(z[0]) && nJ6(z[0].raw)) return x84(Y, F84(Y, ...z));
                return x84(Y, z.length === 1 ? "" + z[0] : z.join(" "))
            };
            return Object.setPrototypeOf(Y, ZF9), Y._generator = A, Y._styler = q, Y._isEmpty = K, Y
        },
        x84 = (A, q) => {
            if (A.level <= 0 || !q) return A._isEmpty ? "" : q;
            let K = A._styler;
            if (K === void 0) return q;
            let {
                openAll: Y,
                closeAll: z
            } = K;
            if (q.indexOf("\x1B") !== -1)
                while (K !== void 0) q = PF9(q, K.close, K.open), K = K.parent;
            let w = q.indexOf(`
`);
            if (w !== -1) q = WF9(q, z, Y, w);
            return Y + q + z
        },
        ePA, F84 = (A, ...q) => {
            let [K] = q;
            if (!nJ6(K) || !nJ6(K.raw)) return q.join(" ");
            let Y = q.slice(1),
                z = [K.raw[0]];
            for (let w = 1; w < K.length; w++) z.push(String(Y[w - 1]).replace(/[{}\\]/g, "\\$&"), String(K.raw[w]));
            if (ePA === void 0) ePA = I84();
            return ePA(A, z.join(""))
        };
    Object.defineProperties(rJ6.prototype, OM1);
    var aJ6 = rJ6();
    aJ6.supportsColor = AWA;
    aJ6.stderr = rJ6({
        level: qWA ? qWA.level : 0
    });
    aJ6.stderr.supportsColor = qWA;
    Q84.exports = aJ6
})
// @from(Ln 265792, Col 4)
YWA = R((z9) => {
    var fF9 = z9 && z9.__importDefault || function(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    };
    Object.defineProperty(z9, "__esModule", {
        value: !0
    });
    z9.parse = z9.stringify = z9.toJson = z9.fromJson = z9.DEFAULT_THEME = z9.plain = void 0;
    var b_ = fF9(g84()),
        VF9 = function(A) {
            return A
        };
    z9.plain = VF9;
    z9.DEFAULT_THEME = {
        keyword: b_.default.blue,
        built_in: b_.default.cyan,
        type: b_.default.cyan.dim,
        literal: b_.default.blue,
        number: b_.default.green,
        regexp: b_.default.red,
        string: b_.default.red,
        subst: z9.plain,
        symbol: z9.plain,
        class: b_.default.blue,
        function: b_.default.yellow,
        title: z9.plain,
        params: z9.plain,
        comment: b_.default.green,
        doctag: b_.default.green,
        meta: b_.default.grey,
        "meta-keyword": z9.plain,
        "meta-string": z9.plain,
        section: z9.plain,
        tag: b_.default.grey,
        name: b_.default.blue,
        "builtin-name": z9.plain,
        attr: b_.default.cyan,
        attribute: z9.plain,
        variable: z9.plain,
        bullet: z9.plain,
        code: z9.plain,
        emphasis: b_.default.italic,
        strong: b_.default.bold,
        formula: z9.plain,
        link: b_.default.underline,
        quote: z9.plain,
        "selector-tag": z9.plain,
        "selector-id": z9.plain,
        "selector-class": z9.plain,
        "selector-attr": z9.plain,
        "selector-pseudo": z9.plain,
        "template-tag": z9.plain,
        "template-variable": z9.plain,
        addition: b_.default.green,
        deletion: b_.default.red,
        default: z9.plain
    };

    function U84(A) {
        var q = {};
        for (var K = 0, Y = Object.keys(A); K < Y.length; K++) {
            var z = Y[K],
                w = A[z];
            if (Array.isArray(w)) q[z] = w.reduce(function(H, $) {
                return $ === "plain" ? z9.plain : H[$]
            }, b_.default);
            else q[z] = b_.default[w]
        }
        return q
    }
    z9.fromJson = U84;

    function p84(A) {
        var q = {};
        for (var K = 0, Y = Object.keys(q); K < Y.length; K++) {
            var z = Y[K],
                w = q[z];
            q[z] = w._styles
        }
        return q
    }
    z9.toJson = p84;

    function NF9(A) {
        return JSON.stringify(p84(A))
    }
    z9.stringify = NF9;

    function TF9(A) {
        return U84(JSON.parse(A))
    }
    z9.parse = TF9
})
// @from(Ln 265887, Col 4)
eJ6 = R((UX) => {
    var d84 = UX && UX.__createBinding || (Object.create ? function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            Object.defineProperty(A, Y, {
                enumerable: !0,
                get: function() {
                    return q[K]
                }
            })
        } : function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            A[Y] = q[K]
        }),
        vF9 = UX && UX.__setModuleDefault || (Object.create ? function(A, q) {
            Object.defineProperty(A, "default", {
                enumerable: !0,
                value: q
            })
        } : function(A, q) {
            A.default = q
        }),
        c84 = UX && UX.__importStar || function(A) {
            if (A && A.__esModule) return A;
            var q = {};
            if (A != null) {
                for (var K in A)
                    if (K !== "default" && Object.prototype.hasOwnProperty.call(A, K)) d84(q, A, K)
            }
            return vF9(q, A), q
        },
        EF9 = UX && UX.__exportStar || function(A, q) {
            for (var K in A)
                if (K !== "default" && !Object.prototype.hasOwnProperty.call(q, K)) d84(q, A, K)
        },
        kF9 = UX && UX.__importDefault || function(A) {
            return A && A.__esModule ? A : {
                default: A
            }
        };
    Object.defineProperty(UX, "__esModule", {
        value: !0
    });
    UX.supportsLanguage = UX.listLanguages = UX.highlight = void 0;
    var tJ6 = c84(CPA()),
        LF9 = c84($84()),
        RF9 = kF9(W84()),
        sJ6 = YWA();

    function zWA(A, q, K) {
        if (q === void 0) q = {};
        switch (A.type) {
            case "text": {
                var Y = A.data;
                if (K === void 0) return (q.default || sJ6.DEFAULT_THEME.default || sJ6.plain)(Y);
                return Y
            }
            case "tag": {
                var z = /hljs-(\w+)/.exec(A.attribs.class);
                if (z) {
                    var w = z[1],
                        H = A.childNodes.map(function($) {
                            return zWA($, q, w)
                        }).join("");
                    return (q[w] || sJ6.DEFAULT_THEME[w] || sJ6.plain)(H)
                }
                return A.childNodes.map(function($) {
                    return zWA($, q)
                }).join("")
            }
        }
        throw Error("Invalid node type " + A.type)
    }

    function yF9(A, q) {
        if (q === void 0) q = {};
        var K = LF9.parseFragment(A, {
            treeAdapter: RF9.default
        });
        return K.childNodes.map(function(Y) {
            return zWA(Y, q)
        }).join("")
    }

    function l84(A, q) {
        if (q === void 0) q = {};
        var K;
        if (q.language) K = tJ6.highlight(A, {
            language: q.language,
            ignoreIllegals: q.ignoreIllegals
        }).value;
        else K = tJ6.highlightAuto(A, q.languageSubset).value;
        return yF9(K, q.theme)
    }
    UX.highlight = l84;

    function CF9() {
        return tJ6.listLanguages()
    }
    UX.listLanguages = CF9;

    function SF9(A) {
        return !!tJ6.getLanguage(A)
    }
    UX.supportsLanguage = SF9;
    UX.default = l84;
    EF9(YWA(), UX)
})
// @from(Ln 265995, Col 0)
function r84(A, q) {
    if (!Vv()) return A;
    let K = q ?? A,
        Y = H6.blue(K);
    return `${i84}${A}${n84}${Y}${i84}${n84}`
}
// @from(Ln 266001, Col 4)
i84 = "\x1B]8;;"
// @from(Ln 266002, Col 4)
n84 = "\x07"
// @from(Ln 266003, Col 4)
o84 = v(() => {
    q3();
    xo()
})
// @from(Ln 266011, Col 0)
function s84() {
    if (a84) return;
    a84 = !0, jz.use({
        tokenizer: {
            del() {
                return
            }
        }
    })
}
// @from(Ln 266022, Col 0)
function rM(A, q, K = 0, Y = null, z = null, w = !1) {
    switch (A.type) {
        case "blockquote":
            return H6.dim.italic((A.tokens ?? []).map((H) => rM(H, q, 0, null, null, w)).join(""));
        case "code": {
            if (w) return A.text + QW;
            let H = "plaintext";
            if (A.lang)
                if (AX6.supportsLanguage(A.lang)) H = A.lang;
                else h(`Language not supported while highlighting code, falling back to plaintext: ${A.lang}`);
            return AX6.highlight(A.text, {
                language: H
            }) + QW
        }
        case "codespan":
            return k8("permission", q)(A.text);
        case "em":
            return H6.italic((A.tokens ?? []).map((H) => rM(H, q, 0, null, null, w)).join(""));
        case "strong":
            return H6.bold((A.tokens ?? []).map((H) => rM(H, q, 0, null, null, w)).join(""));
        case "heading":
            switch (A.depth) {
                case 1:
                    return H6.bold.italic.underline((A.tokens ?? []).map((H) => rM(H, q, 0, null, null, w)).join("")) + QW + QW;
                case 2:
                    return H6.bold((A.tokens ?? []).map((H) => rM(H, q, 0, null, null, w)).join("")) + QW + QW;
                default:
                    return H6.bold((A.tokens ?? []).map((H) => rM(H, q, 0, null, null, w)).join("")) + QW + QW
            }
        case "hr":
            return "---";
        case "image":
            return A.href;
        case "link": {
            if (A.href.startsWith("mailto:")) return A.href.replace(/^mailto:/, "");
            return r84(A.href)
        }
        case "list":
            return A.items.map((H, $) => rM(H, q, K, A.ordered ? A.start + $ : null, A, w)).join("");
        case "list_item":
            return (A.tokens ?? []).map((H) => `${"  ".repeat(K)}${rM(H,q,K+1,Y,A,w)}`).join("");
        case "paragraph":
            return (A.tokens ?? []).map((H) => rM(H, q, 0, null, null, w)).join("") + QW;
        case "space":
            return QW;
        case "br":
            return QW;
        case "text":
            if (z?.type === "list_item") return `${Y===null?"-":xF9(K,Y)+"."} ${A.tokens?A.tokens.map((H)=>rM(H,q,K,Y,A,w)).join(""):A.text}${QW}`;
            else return A.text;
        case "table": {
            let $ = function(J) {
                    return JH(J?.map((X) => rM(X, q, 0, null, null, w)).join("") ?? "")
                },
                H = A,
                O = H.header.map((J, X) => {
                    let D = UA($(J.tokens));
                    for (let j of H.rows) {
                        let M = UA($(j[X]?.tokens));
                        D = Math.max(D, M)
                    }
                    return Math.max(D, 3)
                }),
                _ = "| ";
            return H.header.forEach((J, X) => {
                let D = J.tokens?.map((G) => rM(G, q, 0, null, null, w)).join("") ?? "",
                    j = $(J.tokens),
                    M = O[X],
                    P = H.align?.[X],
                    W;
                if (P === "center") {
                    let G = M - UA(j),
                        f = Math.floor(G / 2),
                        Z = G - f;
                    W = " ".repeat(f) + D + " ".repeat(Z)
                } else if (P === "right") {
                    let G = M - UA(j);
                    W = " ".repeat(G) + D
                } else W = D + " ".repeat(M - UA(j));
                _ += W + " | "
            }), _ = _.trimEnd() + QW, _ += "|", O.forEach((J) => {
                let X = "-".repeat(J + 2);
                _ += X + "|"
            }), _ += QW, H.rows.forEach((J) => {
                _ += "| ", J.forEach((X, D) => {
                    let j = X.tokens?.map((f) => rM(f, q, 0, null, null, w)).join("") ?? "",
                        M = $(X.tokens),
                        P = O[D],
                        W = H.align?.[D],
                        G;
                    if (W === "center") {
                        let f = P - UA(M),
                            Z = Math.floor(f / 2),
                            N = f - Z;
                        G = " ".repeat(Z) + j + " ".repeat(N)
                    } else if (W === "right") {
                        let f = P - UA(M);
                        G = " ".repeat(f) + j
                    } else G = j + " ".repeat(P - UA(M));
                    _ += G + " | "
                }), _ = _.trimEnd() + QW
            }), _ + QW
        }
        case "escape":
            return A.text;
        case "def":
        case "del":
        case "html":
            return ""
    }
    return ""
}
// @from(Ln 266135, Col 0)
function xF9(A, q) {
    switch (A) {
        case 0:
        case 1:
            return q.toString();
        case 2:
            return hF9[q - 1];
        case 3:
            return IF9[q - 1];
        default:
            return q.toString()
    }
}
// @from(Ln 266148, Col 4)
AX6
// @from(Ln 266148, Col 9)
a84 = !1
// @from(Ln 266149, Col 4)
hF9
// @from(Ln 266149, Col 9)
IF9
// @from(Ln 266150, Col 4)
wWA = v(() => {
    __6();
    N8();
    q3();
    Z6();
    XL();
    m1();
    o84();
    LY();
    AX6 = o(eJ6(), 1);
    hF9 = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "aa", "ab", "ac", "ad", "ae", "af", "ag", "ah", "ai", "aj", "ak", "al", "am", "an", "ao", "ap", "aq", "ar", "as", "at", "au", "av", "aw", "ax", "ay", "az"], IF9 = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii", "xiii", "xiv", "xv", "xvi", "xvii", "xviii", "xix", "xx", "xxi", "xxii", "xxiii", "xxiv", "xxv", "xxvi", "xxvii", "xxviii", "xxix", "xxx", "xxxi", "xxxii", "xxxiii", "xxxiv", "xxxv", "xxxvi", "xxxvii", "xxxviii", "xxxix", "xl"]
})
// @from(Ln 266163, Col 0)
function $j() {
    return v6((A) => A.settings)
}
// @from(Ln 266166, Col 4)
cp = v(() => {
    d8()
})
// @from(Ln 266170, Col 0)
function HWA(A, q) {
    if (q <= 0) return [A];
    let K = A.trimEnd(),
        z = Gr(K, q, {
            hard: !1,
            trim: !1,
            wordWrap: !0
        }).split(`
`).filter((w) => w.length > 0);
    return z.length > 0 ? z : [""]
}
// @from(Ln 266182, Col 0)
function t84({
    token: A,
    syntaxHighlightingDisabled: q = !1,
    forceWidth: K
}) {
    let [Y] = T7(), {
        columns: z
    } = Z8(), w = K ?? z;

    function H(S) {
        return S?.map((m) => rM(m, Y, 0, null, null, q)).join("") ?? ""
    }

    function $(S) {
        return JH(H(S))
    }

    function O(S) {
        let b = $(S).split(/\s+/).filter((g) => g.length > 0);
        if (b.length === 0) return KX6;
        return Math.max(...b.map((g) => UA(g)), KX6)
    }

    function _(S) {
        return Math.max(UA($(S)), KX6)
    }
    let J = A.header.map((S, m) => {
            let b = O(S.tokens);
            for (let g of A.rows) b = Math.max(b, O(g[m]?.tokens));
            return b
        }),
        X = A.header.map((S, m) => {
            let b = _(S.tokens);
            for (let g of A.rows) b = Math.max(b, _(g[m]?.tokens));
            return b
        }),
        D = A.header.length,
        j = 1 + D * 3,
        M = Math.max(w - j, D * KX6),
        P = J.reduce((S, m) => S + m, 0),
        W = X.reduce((S, m) => S + m, 0),
        f = P + j > w,
        Z;
    if (f) Z = J;
    else if (W <= M) Z = X;
    else if (P <= M) {
        let S = M - P,
            m = X.map((g, U) => g - J[U]),
            b = m.reduce((g, U) => g + U, 0);
        Z = J.map((g, U) => {
            if (b === 0) return g;
            let x = Math.floor(m[U] / b * S);
            return g + x
        })
    } else Z = J;

    function N(S, m) {
        let b = S.map((p, l) => {
                let r = H(p.tokens),
                    s = Z[l];
                return HWA(r, s)
            }),
            g = Math.max(...b.map((p) => p.length), 1),
            U = b.map((p) => Math.floor((g - p.length) / 2)),
            x = [];
        for (let p = 0; p < g; p++) {
            let l = "│";
            for (let r = 0; r < S.length; r++) {
                let s = b[r],
                    O1 = U[r],
                    T1 = p - O1,
                    N1 = T1 >= 0 && T1 < s.length ? s[T1] : "",
                    j1 = Z[r],
                    q1 = m ? "center" : A.align?.[r] ?? "left",
                    t = UA(N1),
                    J1 = Math.max(0, j1 - t),
                    D1;
                if (q1 === "center") {
                    let Z1 = Math.floor(J1 / 2),
                        E1 = J1 - Z1;
                    D1 = " ".repeat(Z1) + N1 + " ".repeat(E1)
                } else if (q1 === "right") D1 = " ".repeat(J1) + N1;
                else D1 = N1 + " ".repeat(J1);
                l += " " + D1 + " │"
            }
            x.push(l)
        }
        return x
    }

    function T(S) {
        let [m, b, g, U] = {
            top: ["┌", "─", "┬", "┐"],
            middle: ["├", "─", "┼", "┤"],
            bottom: ["└", "─", "┴", "┘"]
        } [S], x = m;
        return Z.forEach((p, l) => {
            x += b.repeat(p + 2), x += l < Z.length - 1 ? g : U
        }), x
    }

    function k() {
        let S = [],
            m = A.header.map((x) => $(x.tokens)),
            b = Math.min(w - 1, 40),
            g = "─".repeat(b),
            U = "  ";
        return A.rows.forEach((x, p) => {
            if (p > 0) S.push(g);
            x.forEach((l, r) => {
                let s = m[r] || `Column ${r+1}`,
                    T1 = H(l.tokens).trimEnd().replace(/\n+/g, " ").replace(/\s+/g, " ").trim(),
                    N1 = w - UA(s) - 3,
                    j1 = w - 2 - 1,
                    q1 = HWA(T1, Math.max(N1, 10));
                S.push(`${uF9}${s}:${BF9} ${q1[0]||""}`);
                for (let t = 1; t < q1.length; t++) {
                    let J1 = q1[t];
                    if (!J1.trim()) continue;
                    if (UA(J1) > j1) {
                        let D1 = HWA(J1, j1);
                        for (let Z1 of D1)
                            if (Z1.trim()) S.push(`  ${Z1}`)
                    } else S.push(`  ${J1}`)
                }
            })
        }), S.join(`
`)
    }
    if (f) return YX6.default.createElement(W3, null, k());
    let y = [];
    if (y.push(T("top")), y.push(...N(A.header, !0)), y.push(T("middle")), A.rows.forEach((S, m) => {
            if (y.push(...N(S, !1)), m < A.rows.length - 1) y.push(T("middle"))
        }), y.push(T("bottom")), Math.max(...y.map((S) => UA(JH(S)))) > w - bF9) return YX6.default.createElement(W3, null, k());
    return YX6.default.createElement(W3, null, y.join(`
`))
}
// @from(Ln 266319, Col 4)
YX6
// @from(Ln 266319, Col 9)
bF9 = 2
// @from(Ln 266320, Col 4)
KX6 = 3
// @from(Ln 266321, Col 4)
uF9 = "\x1B[1m"
// @from(Ln 266322, Col 4)
BF9 = "\x1B[22m"
// @from(Ln 266323, Col 4)
e84 = v(() => {
    m1();
    mq();
    wWA();
    LY();
    XL();
    DK6();
    YX6 = o(X1(), 1)
})
// @from(Ln 266336, Col 0)
function A74(A) {
    let q = e(10),
        {
            code: K,
            lang: Y,
            syntaxHighlightingDisabled: z,
            filePath: w
        } = A,
        H, $;
    if (q[0] !== K || q[1] !== w || q[2] !== Y) H = () => {
        sE7({
            code: K,
            filePath: w
        }), Ak7(w, K), c("tengu_snippet_shown", {
            hasLang: !!Y
        })
    }, $ = [K, w, Y], q[0] = K, q[1] = w, q[2] = Y, q[3] = H, q[4] = $;
    else H = q[3], $ = q[4];
    zX6.useEffect(H, $);
    let O;
    if (z) O = K;
    else {
        let X = "plaintext";
        if (Y && wX6.supportsLanguage(Y)) X = Y;
        let D;
        if (q[5] !== K || q[6] !== X) D = wX6.highlight(K, {
            language: X
        }), q[5] = K, q[6] = X, q[7] = D;
        else D = q[7];
        O = D
    }
    let _ = O + mF9,
        J;
    if (q[8] !== _) J = zX6.default.createElement(W3, null, _), q[8] = _, q[9] = J;
    else J = q[9];
    return J
}
// @from(Ln 266373, Col 4)
zX6
// @from(Ln 266373, Col 9)
wX6
// @from(Ln 266374, Col 4)
q74 = v(() => {
    i1();
    m1();
    n26();
    u6();
    zX6 = o(X1(), 1), wX6 = o(eJ6(), 1)
})
// @from(Ln 266382, Col 0)
function TJ(A) {
    let q = e(8),
        {
            children: K,
            dimColor: Y
        } = A,
        [z] = T7(),
        H = $j().syntaxHighlightingDisabled ?? !1,
        $;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) $ = aE7(), q[0] = $;
    else $ = q[0];
    let O = $;
    s84();
    let _;
    if (q[1] !== K || q[2] !== Y || q[3] !== H || q[4] !== z) {
        let J = jz.lexer(qX6(K)),
            X = [],
            D = "",
            j = new Set,
            M = [],
            P = function() {
                if (D) X.push(cK1.default.createElement(W3, {
                    key: X.length,
                    dimColor: Y
                }, D.trim())), D = ""
            };
        for (let W of J)
            if (W.type === "table") P(), X.push(cK1.default.createElement(t84, {
                key: X.length,
                token: W,
                syntaxHighlightingDisabled: H
            }));
            else if (W.type === "code" && O) {
            P();
            let G = W,
                f = tE7(G.text, j);
            M.push(f), X.push(cK1.default.createElement(A74, {
                key: X.length,
                code: G.text,
                lang: G.lang,
                syntaxHighlightingDisabled: H,
                filePath: f
            }))
        } else D = D + rM(W, z, 0, null, null, H);
        if (P(), M.length > 0) {
            let W;
            if (q[6] !== M) W = cK1.default.createElement(I, {
                key: "snippet-hints",
                flexDirection: "column"
            }, M.map(FF9)), q[6] = M, q[7] = W;
            else W = q[7];
            X.push(W)
        }
        _ = cK1.default.createElement(I, {
            flexDirection: "column"
        }, X), q[1] = K, q[2] = Y, q[3] = H, q[4] = z, q[5] = _
    } else _ = q[5];
    return _
}
// @from(Ln 266442, Col 0)
function FF9(A) {
    return cK1.default.createElement(V, {
        key: A,
        dimColor: !0
    }, A, xA.isSSH() ? "" : " (ctrl+y to copy)")
}
// @from(Ln 266448, Col 4)
cK1
// @from(Ln 266449, Col 4)
uh = v(() => {
    i1();
    __6();
    m1();
    wWA();
    cp();
    N8();
    e84();
    q74();
    n26();
    G5();
    cK1 = o(X1(), 1)
})
// @from(Ln 266463, Col 0)
function K74() {
    let A = e(1),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = QB1.createElement(HA, {
        height: 1
    }, QB1.createElement(MB, null)), A[0] = q;
    else q = A[0];
    return q
}
// @from(Ln 266472, Col 4)
QB1
// @from(Ln 266473, Col 4)
Y74 = v(() => {
    i1();
    Y01();
    eq();
    QB1 = o(X1(), 1)
})
// @from(Ln 266480, Col 0)
function HX6(A) {
    let q = e(3),
        {
            plan: K
        } = A,
        Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = Bh.createElement(V, {
        color: "subtle"
    }, "User rejected Claude's plan:"), q[0] = Y;
    else Y = q[0];
    let z;
    if (q[1] !== K) z = Bh.createElement(HA, null, Bh.createElement(I, {
        flexDirection: "column"
    }, Y, Bh.createElement(I, {
        borderStyle: "round",
        borderColor: "planMode",
        borderDimColor: !0,
        paddingX: 1,
        overflow: "hidden"
    }, Bh.createElement(TJ, null, K)))), q[1] = K, q[2] = z;
    else z = q[2];
    return z
}
// @from(Ln 266503, Col 4)
Bh
// @from(Ln 266504, Col 4)
$WA = v(() => {
    i1();
    m1();
    uh();
    eq();
    Bh = o(X1(), 1)
})
// @from(Ln 266512, Col 0)
function z74(A) {
    let q = e(2),
        {
            feedback: K
        } = A,
        Y;
    if (q[0] !== K) Y = gB1.createElement(HA, null, gB1.createElement(V, {
        color: "subtle"
    }, "Tool use rejected with user message: ", K)), q[0] = K, q[1] = Y;
    else Y = q[1];
    return Y
}
// @from(Ln 266524, Col 4)
gB1
// @from(Ln 266525, Col 4)
w74 = v(() => {
    i1();
    m1();
    eq();
    gB1 = o(X1(), 1)
})
// @from(Ln 266532, Col 0)
function H74(A) {
    let q = e(18),
        {
            progressMessagesForMessage: K,
            tool: Y,
            tools: z,
            param: w,
            verbose: H
        } = A;
    if (typeof w.content === "string" && w.content.includes(YN)) {
        let O;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) O = mh.createElement(HA, {
            height: 1
        }, mh.createElement(MB, null)), q[0] = O;
        else O = q[0];
        return O
    }
    if (typeof w.content === "string" && w.content.startsWith(OWA)) {
        let O;
        if (q[1] !== w.content) O = w.content.substring(OWA.length), q[1] = w.content, q[2] = O;
        else O = q[2];
        let _ = O,
            J;
        if (q[3] !== _) J = mh.createElement(HX6, {
            plan: _
        }), q[3] = _, q[4] = J;
        else J = q[4];
        return J
    }
    if (typeof w.content === "string" && w.content.startsWith(UB1)) {
        let O;
        if (q[5] !== w.content) O = w.content.substring(UB1.length), q[5] = w.content, q[6] = O;
        else O = q[6];
        let _ = O,
            J;
        if (q[7] !== _) J = mh.createElement(z74, {
            feedback: _
        }), q[7] = _, q[8] = J;
        else J = q[8];
        return J
    }
    if (!Y) {
        let O;
        if (q[9] !== w.content || q[10] !== H) O = mh.createElement(z5, {
            result: w.content,
            verbose: H
        }), q[9] = w.content, q[10] = H, q[11] = O;
        else O = q[11];
        return O
    }
    let $;
    if (q[12] !== w.content || q[13] !== K || q[14] !== Y || q[15] !== z || q[16] !== H) $ = Y.renderToolUseErrorMessage(w.content, {
        progressMessagesForMessage: go(K),
        tools: z,
        verbose: H
    }), q[12] = w.content, q[13] = K, q[14] = Y, q[15] = z, q[16] = H, q[17] = $;
    else $ = q[17];
    return $
}
// @from(Ln 266591, Col 4)
mh
// @from(Ln 266592, Col 4)
$74 = v(() => {
    i1();
    N8();
    Y01();
    eq();
    UO();
    $WA();
    w74();
    mh = o(X1(), 1)
})
// @from(Ln 266603, Col 0)
function O74(A) {
    let q = e(12),
        {
            input: K,
            progressMessagesForMessage: Y,
            style: z,
            tool: w,
            tools: H,
            verbose: $
        } = A,
        {
            columns: O
        } = Z8(),
        [_] = T7();
    if (!w) {
        let j;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) j = pB1.createElement(Y9, null), q[0] = j;
        else j = q[0];
        return j
    }
    let J = w.inputSchema,
        X, D;
    if (q[1] !== O || q[2] !== K || q[3] !== Y || q[4] !== z || q[5] !== _ || q[6] !== w || q[7] !== H || q[8] !== $) {
        D = Symbol.for("react.early_return_sentinel");
        A: {
            let j = J.safeParse(K);
            if (!j.success) {
                let M;
                if (q[11] === Symbol.for("react.memo_cache_sentinel")) M = pB1.createElement(Y9, null), q[11] = M;
                else M = q[11];
                D = M;
                break A
            }
            X = w.renderToolUseRejectedMessage(j.data, {
                columns: O,
                messages: [],
                tools: H,
                verbose: $,
                progressMessagesForMessage: go(Y),
                style: z,
                theme: _
            })
        }
        q[1] = O, q[2] = K, q[3] = Y, q[4] = z, q[5] = _, q[6] = w, q[7] = H, q[8] = $, q[9] = X, q[10] = D
    } else X = q[9], D = q[10];
    if (D !== Symbol.for("react.early_return_sentinel")) return D;
    return X
}
// @from(Ln 266651, Col 4)
pB1
// @from(Ln 266652, Col 4)
_74 = v(() => {
    i1();
    CX();
    mq();
    m1();
    pB1 = o(X1(), 1)
})
// @from(Ln 266660, Col 0)
function $X6(A) {
    let q = e(22),
        {
            hookEvent: K,
            lookups: Y,
            toolUseID: z,
            isTranscriptMode: w
        } = A,
        H;
    if (q[0] !== K || q[1] !== Y.inProgressHookCounts || q[2] !== z) H = Y.inProgressHookCounts.get(z)?.get(K) ?? 0, q[0] = K, q[1] = Y.inProgressHookCounts, q[2] = z, q[3] = H;
    else H = q[3];
    let $ = H,
        O = Y.resolvedHookCounts.get(z)?.get(K) ?? 0;
    if ($ === 0) return null;
    if (K === "PreToolUse" || K === "PostToolUse") {
        if (w) {
            let M;
            if (q[4] !== $) M = vJ.createElement(V, {
                dimColor: !0
            }, $, " "), q[4] = $, q[5] = M;
            else M = q[5];
            let P;
            if (q[6] !== K) P = vJ.createElement(V, {
                dimColor: !0,
                bold: !0
            }, K), q[6] = K, q[7] = P;
            else P = q[7];
            let W = $ === 1 ? " hook" : " hooks",
                G;
            if (q[8] !== W) G = vJ.createElement(V, {
                dimColor: !0
            }, W, " ran"), q[8] = W, q[9] = G;
            else G = q[9];
            let f;
            if (q[10] !== M || q[11] !== P || q[12] !== G) f = vJ.createElement(HA, null, vJ.createElement(I, {
                flexDirection: "row"
            }, M, P, G)), q[10] = M, q[11] = P, q[12] = G, q[13] = f;
            else f = q[13];
            return f
        }
        return null
    }
    if (O === $) return null;
    let _;
    if (q[14] === Symbol.for("react.memo_cache_sentinel")) _ = vJ.createElement(V, {
        dimColor: !0
    }, "Running "), q[14] = _;
    else _ = q[14];
    let J;
    if (q[15] !== K) J = vJ.createElement(V, {
        dimColor: !0,
        bold: !0
    }, K), q[15] = K, q[16] = J;
    else J = q[16];
    let X = $ === 1 ? " hook…" : " hooks…",
        D;
    if (q[17] !== X) D = vJ.createElement(V, {
        dimColor: !0
    }, X), q[17] = X, q[18] = D;
    else D = q[18];
    let j;
    if (q[19] !== J || q[20] !== D) j = vJ.createElement(HA, null, vJ.createElement(I, {
        flexDirection: "row"
    }, _, J, D)), q[19] = J, q[20] = D, q[21] = j;
    else j = q[21];
    return j
}
// @from(Ln 266727, Col 4)
vJ
// @from(Ln 266728, Col 4)
_WA = v(() => {
    i1();
    eq();
    m1();
    vJ = o(X1(), 1)
})
// @from(Ln 266734, Col 4)
J74
// @from(Ln 266734, Col 9)
lK1
// @from(Ln 266735, Col 4)
OX6 = v(() => {
    J74 = o(X1(), 1);
    lK1 = class lK1 extends J74.Component {
        constructor(A) {
            super(A);
            this.state = {
                hasError: !1
            }
        }
        static getDerivedStateFromError() {
            return {
                hasError: !0
            }
        }
        render() {
            if (this.state.hasError) return null;
            return this.props.children
        }
    }
})
// @from(Ln 266756, Col 0)
function j74(A) {
    return
}
// @from(Ln 266760, Col 0)
function M74(A) {
    return
}
// @from(Ln 266764, Col 0)
function P74() {
    for (let A of JWA) A()
}
// @from(Ln 266768, Col 0)
function W74(A) {
    return
}
// @from(Ln 266772, Col 0)
function _X6(A) {
    return
}
// @from(Ln 266776, Col 0)
function QF9(A) {
    return JWA.add(A), () => JWA.delete(A)
}
// @from(Ln 266780, Col 0)
function G74(A) {
    return X74.useSyncExternalStore(QF9, () => XWA.has(A))
}
// @from(Ln 266783, Col 4)
X74
// @from(Ln 266783, Col 9)
D74
// @from(Ln 266783, Col 14)
XWA
// @from(Ln 266783, Col 19)
JWA
// @from(Ln 266784, Col 4)
iK1 = v(() => {
    X74 = o(X1(), 1), D74 = new Map, XWA = new Set, JWA = new Set
})
// @from(Ln 266788, Col 0)
function Z74(A) {
    let q = e(29),
        {
            message: K,
            lookups: Y,
            toolUseID: z,
            progressMessagesForMessage: w,
            style: H,
            tool: $,
            tools: O,
            verbose: _,
            width: J,
            isTranscriptMode: X
        } = A,
        [D] = T7();
    if (!K.toolUseResult || !$) return null;
    let j;
    if (q[0] !== K.toolUseResult || q[1] !== w || q[2] !== H || q[3] !== D || q[4] !== $ || q[5] !== O || q[6] !== _) j = $.renderToolResultMessage(K.toolUseResult, go(w), {
        style: H,
        theme: D,
        tools: O,
        verbose: _
    }), q[0] = K.toolUseResult, q[1] = w, q[2] = H, q[3] = D, q[4] = $, q[5] = O, q[6] = _, q[7] = j;
    else j = q[7];
    let M = j;
    if (M === null) return null;
    let P;
    if (q[8] !== z) P = j74(z), q[8] = z, q[9] = P;
    else P = q[9];
    let W = P,
        G;
    if (q[10] !== z) G = M74(z), q[10] = z, q[11] = G;
    else G = q[11];
    let f = G,
        Z;
    if (q[12] !== W) Z = !1, q[12] = W, q[13] = Z;
    else Z = q[13];
    let N;
    if (q[14] !== f) N = !1, q[14] = f, q[15] = N;
    else N = q[15];
    let T;
    if (q[16] !== M || q[17] !== Z || q[18] !== N || q[19] !== J) T = lp.createElement(I, {
        flexDirection: "column",
        width: J
    }, M, Z, N), q[16] = M, q[17] = Z, q[18] = N, q[19] = J, q[20] = T;
    else T = q[20];
    let k;
    if (q[21] !== X || q[22] !== Y || q[23] !== z || q[24] !== _) k = lp.createElement(lK1, null, lp.createElement($X6, {
        hookEvent: "PostToolUse",
        lookups: Y,
        toolUseID: z,
        verbose: _,
        isTranscriptMode: X
    })), q[21] = X, q[22] = Y, q[23] = z, q[24] = _, q[25] = k;
    else k = q[25];
    let y;
    if (q[26] !== T || q[27] !== k) y = lp.createElement(I, {
        flexDirection: "column"
    }, T, k), q[26] = T, q[27] = k, q[28] = y;
    else y = q[28];
    return y
}
// @from(Ln 266850, Col 4)
lp
// @from(Ln 266851, Col 4)
f74 = v(() => {
    i1();
    m1();
    _WA();
    OX6();
    iK1();
    eq();
    lp = o(X1(), 1)
})
// @from(Ln 266861, Col 0)
function V74(A, q, K) {
    let Y = e(11),
        z;
    A: {
        let w;
        if (Y[0] !== K.toolUseByToolUseID || Y[1] !== A) w = K.toolUseByToolUseID.get(A),
        Y[0] = K.toolUseByToolUseID,
        Y[1] = A,
        Y[2] = w;
        else w = Y[2];
        let H = w;
        if (!H) {
            z = null;
            break A
        }
        let $;
        if (Y[3] !== H || Y[4] !== q) {
            let J;
            if (Y[6] !== H) J = (X) => X.name === H.name, Y[6] = H, Y[7] = J;
            else J = Y[7];
            $ = q.find(J), Y[3] = H, Y[4] = q, Y[5] = $
        } else $ = Y[5];
        let O = $;
        if (!O) {
            z = null;
            break A
        }
        let _;
        if (Y[8] !== O || Y[9] !== H) _ = {
            tool: O,
            toolUse: H
        },
        Y[8] = O,
        Y[9] = H,
        Y[10] = _;
        else _ = Y[10];z = _
    }
    return z
}
// @from(Ln 266900, Col 4)
N74 = v(() => {
    i1()
})
// @from(Ln 266904, Col 0)
function T74(A) {
    let q = e(26),
        {
            param: K,
            message: Y,
            lookups: z,
            progressMessagesForMessage: w,
            style: H,
            tools: $,
            verbose: O,
            width: _,
            isTranscriptMode: J
        } = A,
        X = V74(K.tool_use_id, $, z);
    if (!X) return null;
    if (K.content === _M1) {
        let j;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) j = ip.createElement(K74, null), q[0] = j;
        else j = q[0];
        return j
    }
    if (K.content === nK1 || K.content === YN) {
        let j = X.toolUse.input,
            M;
        if (q[1] !== z || q[2] !== w || q[3] !== H || q[4] !== j || q[5] !== X.tool || q[6] !== $ || q[7] !== O) M = ip.createElement(O74, {
            input: j,
            progressMessagesForMessage: w,
            tool: X.tool,
            tools: $,
            lookups: z,
            style: H,
            verbose: O
        }), q[1] = z, q[2] = w, q[3] = H, q[4] = j, q[5] = X.tool, q[6] = $, q[7] = O, q[8] = M;
        else M = q[8];
        return M
    }
    if (K.is_error) {
        let j;
        if (q[9] !== K || q[10] !== w || q[11] !== X.tool || q[12] !== $ || q[13] !== O) j = ip.createElement(H74, {
            progressMessagesForMessage: w,
            tool: X.tool,
            tools: $,
            param: K,
            verbose: O
        }), q[9] = K, q[10] = w, q[11] = X.tool, q[12] = $, q[13] = O, q[14] = j;
        else j = q[14];
        return j
    }
    let D;
    if (q[15] !== J || q[16] !== z || q[17] !== Y || q[18] !== w || q[19] !== H || q[20] !== X.tool || q[21] !== X.toolUse.id || q[22] !== $ || q[23] !== O || q[24] !== _) D = ip.createElement(Z74, {
        message: Y,
        lookups: z,
        toolUseID: X.toolUse.id,
        progressMessagesForMessage: w,
        style: H,
        tool: X.tool,
        tools: $,
        verbose: O,
        width: _,
        isTranscriptMode: J
    }), q[15] = J, q[16] = z, q[17] = Y, q[18] = w, q[19] = H, q[20] = X.tool, q[21] = X.toolUse.id, q[22] = $, q[23] = O, q[24] = _, q[25] = D;
    else D = q[25];
    return D
}
// @from(Ln 266968, Col 4)
ip
// @from(Ln 266969, Col 4)
v74 = v(() => {
    i1();
    N8();
    Y74();
    $74();
    _74();
    f74();
    N74();
    ip = o(X1(), 1)
})
// @from(Ln 266980, Col 0)
function k74(A) {
    let q = k_(),
        [K, Y] = Nv(A && q ? E74 : null);
    if (!A || !q) return [K, !0];
    let z = Math.floor(Y / E74) % 2 === 0;
    return [K, z]
}
// @from(Ln 266987, Col 4)
E74 = 600
// @from(Ln 266988, Col 4)
L74 = v(() => {
    m1()
})
// @from(Ln 266992, Col 0)
function rK1(A) {
    let q = e(7),
        {
            isError: K,
            isUnresolved: Y,
            shouldAnimate: z
        } = A,
        [w, H] = k74(z),
        $ = Y ? void 0 : K ? "error" : "success",
        O = !z || H || K || !Y ? gY : " ",
        _;
    if (q[0] !== $ || q[1] !== Y || q[2] !== O) _ = DWA.default.createElement(V, {
        color: $,
        dimColor: Y
    }, O), q[0] = $, q[1] = Y, q[2] = O, q[3] = _;
    else _ = q[3];
    let J;
    if (q[4] !== w || q[5] !== _) J = DWA.default.createElement(I, {
        ref: w,
        minWidth: 2
    }, _), q[4] = w, q[5] = _, q[6] = J;
    else J = q[6];
    return J
}
// @from(Ln 267016, Col 4)
DWA
// @from(Ln 267017, Col 4)
JX6 = v(() => {
    i1();
    m1();
    jW();
    L74();
    DWA = o(X1(), 1)
})
// @from(Ln 267025, Col 0)
function R74(A) {
    let q = e(64),
        {
            param: K,
            addMargin: Y,
            tools: z,
            commands: w,
            verbose: H,
            inProgressToolUseIDs: $,
            progressMessagesForMessage: O,
            shouldAnimate: _,
            shouldShowDot: J,
            inProgressToolCallCount: X,
            lookups: D,
            isTranscriptMode: j
        } = A,
        M = Z8(),
        [P] = T7(),
        W = C74(gF9),
        G = G74(K.id),
        f = !1;
    if (!z) return K1(Error(`Tools array is undefined for tool ${K.name}`)), null;
    let Z, N, T, k, y, B, S, m, b, g, U, x;
    if (q[0] !== Y || q[1] !== w || q[2] !== X || q[3] !== $ || q[4] !== !1 || q[5] !== j || q[6] !== D || q[7] !== K.id || q[8] !== K.input || q[9] !== K.name || q[10] !== W?.toolUseId || q[11] !== O || q[12] !== _ || q[13] !== J || q[14] !== M || q[15] !== P || q[16] !== z || q[17] !== H) {
        k = Symbol.for("react.early_return_sentinel");
        A: {
            let r;
            if (q[30] !== K.name) r = (a) => a.name === K.name,
            q[30] = K.name,
            q[31] = r;
            else r = q[31];
            let s = z.find(r);
            if (!s) {
                K1(Error(`Tool ${K.name} not found`)), k = null;
                break A
            }
            let O1;
            if (q[32] !== D.resolvedToolUseIDs || q[33] !== K.id) O1 = D.resolvedToolUseIDs.has(K.id),
            q[32] = D.resolvedToolUseIDs,
            q[33] = K.id,
            q[34] = O1;
            else O1 = q[34];
            let T1 = O1,
                N1;
            if (q[35] !== $ || q[36] !== T1 || q[37] !== K.id) N1 = !$.has(K.id) && !T1,
            q[35] = $,
            q[36] = T1,
            q[37] = K.id,
            q[38] = N1;
            else N1 = q[38];
            let j1 = N1,
                q1 = W?.toolUseId === K.id,
                t = s.inputSchema.safeParse(K.input),
                J1 = s.userFacingName(t.success ? t.data : void 0),
                D1 = s.userFacingNameBackgroundColor?.(t.success ? t.data : void 0);
            if (J1 === "") {
                k = null;
                break A
            }
            let Z1 = t.success ? UF9(s, t.data, {
                theme: P,
                verbose: H,
                commands: w
            }) : null;
            if (Z1 === null) {
                k = null;
                break A
            }
            N = I,
            b = "row",
            g = "space-between",
            U = Y ? 1 : 0,
            x = "100%",
            Z = I,
            T = "column";
            let E1;
            if (q[39] !== j1 || q[40] !== T1 || q[41] !== D.erroredToolUseIDs || q[42] !== K.id || q[43] !== _ || q[44] !== J) E1 = J && (j1 ? oM.default.createElement(I, {
                minWidth: 2
            }, oM.default.createElement(V, {
                dimColor: j1
            }, gY)) : oM.default.createElement(rK1, {
                shouldAnimate: _,
                isUnresolved: !T1,
                isError: D.erroredToolUseIDs.has(K.id)
            })),
            q[39] = j1,
            q[40] = T1,
            q[41] = D.erroredToolUseIDs,
            q[42] = K.id,
            q[43] = _,
            q[44] = J,
            q[45] = E1;
            else E1 = q[45];
            if (y = oM.default.createElement(I, {
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    minWidth: J1.length + (J ? 2 : 0)
                }, E1, oM.default.createElement(I, {
                    flexShrink: 0
                }, oM.default.createElement(V, {
                    bold: !0,
                    wrap: "truncate-end",
                    backgroundColor: D1,
                    color: D1 ? "inverseText" : void 0
                }, J1)), Z1 !== "" && oM.default.createElement(I, {
                    flexWrap: "nowrap"
                }, oM.default.createElement(V, null, "(", Z1, ")")), t.success && s.renderToolUseTag && s.renderToolUseTag(t.data)), q[46] !== !1 || q[47] !== j1 || q[48] !== T1) B = !T1 && !j1 && !1,
            q[46] = !1,
            q[47] = j1,
            q[48] = T1,
            q[49] = B;
            else B = q[49];S = !T1 && !j1 && (q1 ? oM.default.createElement(HA, {
                height: 1
            }, oM.default.createElement(V, {
                dimColor: !0
            }, "Waiting for permission…")) : pF9(s, z, D, K.id, O, {
                verbose: H,
                inProgressToolCallCount: X,
                isTranscriptMode: j
            }, M)),
            m = !T1 && j1 && dF9(s)
        }
        q[0] = Y, q[1] = w, q[2] = X, q[3] = $, q[4] = !1, q[5] = j, q[6] = D, q[7] = K.id, q[8] = K.input, q[9] = K.name, q[10] = W?.toolUseId, q[11] = O, q[12] = _, q[13] = J, q[14] = M, q[15] = P, q[16] = z, q[17] = H, q[18] = Z, q[19] = N, q[20] = T, q[21] = k, q[22] = y, q[23] = B, q[24] = S, q[25] = m, q[26] = b, q[27] = g, q[28] = U, q[29] = x
    } else Z = q[18], N = q[19], T = q[20], k = q[21], y = q[22], B = q[23], S = q[24], m = q[25], b = q[26], g = q[27], U = q[28], x = q[29];
    if (k !== Symbol.for("react.early_return_sentinel")) return k;
    let p;
    if (q[50] !== Z || q[51] !== T || q[52] !== y || q[53] !== B || q[54] !== S || q[55] !== m) p = oM.default.createElement(Z, {
        flexDirection: T
    }, y, B, S, m), q[50] = Z, q[51] = T, q[52] = y, q[53] = B, q[54] = S, q[55] = m, q[56] = p;
    else p = q[56];
    let l;
    if (q[57] !== N || q[58] !== p || q[59] !== b || q[60] !== g || q[61] !== U || q[62] !== x) l = oM.default.createElement(N, {
        flexDirection: b,
        justifyContent: g,
        marginTop: U,
        width: x
    }, p), q[57] = N, q[58] = p, q[59] = b, q[60] = g, q[61] = U, q[62] = x, q[63] = l;
    else l = q[63];
    return l
}
// @from(Ln 267166, Col 0)
function gF9(A) {
    return A.pendingWorkerRequest
}
// @from(Ln 267170, Col 0)
function UF9(A, q, {
    theme: K,
    verbose: Y,
    commands: z
}) {
    try {
        let w = A.inputSchema.safeParse(q);
        if (!w.success) return "";
        return A.renderToolUseMessage(w.data, {
            theme: K,
            verbose: Y,
            commands: z
        })
    } catch (w) {
        return K1(Error(`Error rendering tool use message for ${A.name}: ${w}`)), ""
    }
}
// @from(Ln 267188, Col 0)
function pF9(A, q, K, Y, z, {
    verbose: w,
    inProgressToolCallCount: H,
    isTranscriptMode: $
}, O) {
    let _ = z.filter((J) => J.data.type !== "hook_progress");
    try {
        let J = A.renderToolUseProgressMessage(_, {
            tools: q,
            verbose: w,
            terminalSize: O,
            inProgressToolCallCount: H ?? 1
        });
        return oM.default.createElement(oM.default.Fragment, null, oM.default.createElement(lK1, null, oM.default.createElement($X6, {
            hookEvent: "PreToolUse",
            lookups: K,
            toolUseID: Y,
            verbose: w,
            isTranscriptMode: $
        })), J)
    } catch (J) {
        return K1(Error(`Error rendering tool use progress message for ${A.name}: ${J}`)), null
    }
}
// @from(Ln 267213, Col 0)
function dF9(A) {
    try {
        return A.renderToolUseQueuedMessage?.()
    } catch (q) {
        return K1(Error(`Error rendering tool use queued message for ${A.name}: ${q}`)), null
    }
}
// @from(Ln 267220, Col 4)
oM
// @from(Ln 267221, Col 4)
y74 = v(() => {
    i1();
    m1();
    y6();
    JX6();
    jW();
    mq();
    _WA();
    OX6();
    d8();
    eq();
    iK1();
    oM = o(X1(), 1)
})
// @from(Ln 267236, Col 0)
function cF9() {
    if (H71() === "sonnet") {
        let {
            hasAccess: q
        } = z71();
        if (q) return {
            alias: "sonnet[1m]",
            name: "Sonnet 1M",
            multiplier: 5
        }
    }
    return null
}
// @from(Ln 267250, Col 0)
function oK1(A) {
    let q = cF9();
    if (!q) return null;
    switch (A) {
        case "warning":
            return `/model ${q.alias} for more context`;
        case "tip":
            return `Tip: You have access to ${q.name} with ${q.multiplier}x more context`;
        default:
            return null
    }
}
// @from(Ln 267262, Col 4)
XX6 = v(() => {
    e7();
    uq6()
})
// @from(Ln 267267, Col 0)
function lF9(A) {
    let q;
    try {
        q = new URL(A)
    } catch (K) {
        throw Error(`Invalid URL format: ${A}`)
    }
    if (q.protocol !== "http:" && q.protocol !== "https:") throw Error(`Invalid URL protocol: must use http:// or https://, got ${q.protocol}`)
}
// @from(Ln 267276, Col 0)
async function S74(A) {
    try {
        let q = process.platform;
        if (q === "win32") {
            let {
                code: z
            } = await IA("explorer", [A]);
            return z === 0
        }
        let K = q === "darwin" ? "open" : "xdg-open",
            {
                code: Y
            } = await IA(K, [A]);
        return Y === 0
    } catch (q) {
        return !1
    }
}
// @from(Ln 267294, Col 0)
async function zY(A) {
    try {
        lF9(A);
        let q = process.env.BROWSER,
            K = process.platform;
        if (K === "win32") {
            if (q) {
                let {
                    code: z
                } = await IA(q, [`"${A}"`]);
                return z === 0
            }
            let {
                code: Y
            } = await IA("rundll32", ["url,OpenURL", A], {});
            return Y === 0
        } else {
            let Y = q || (K === "darwin" ? "open" : "xdg-open"),
                {
                    code: z
                } = await IA(Y, [A]);
            return z === 0
        }
    } catch (q) {
        return !1
    }
}
// @from(Ln 267321, Col 4)
Oj = v(() => {
    tq()
})
// @from(Ln 267325, Col 0)
class jWA {
    localServer;
    port = 0;
    promiseResolver = null;
    promiseRejecter = null;
    expectedState = null;
    pendingResponse = null;
    callbackPath;
    constructor(A = "/callback") {
        this.localServer = h74.createServer(), this.callbackPath = A
    }
    async start(A) {
        return new Promise((q, K) => {
            this.localServer.once("error", (Y) => {
                K(Error(`Failed to start OAuth callback server: ${Y.message}`))
            }), this.localServer.listen(A ?? 0, "localhost", () => {
                let Y = this.localServer.address();
                this.port = Y.port, q(this.port)
            })
        })
    }
    getPort() {
        return this.port
    }
    hasPendingResponse() {
        return this.pendingResponse !== null
    }
    async waitForAuthorization(A, q) {
        return new Promise((K, Y) => {
            this.promiseResolver = K, this.promiseRejecter = Y, this.expectedState = A, this.startLocalListener(q)
        })
    }
    handleSuccessRedirect(A, q) {
        if (!this.pendingResponse) return;
        if (q) {
            q(this.pendingResponse, A), this.pendingResponse = null, c("tengu_oauth_automatic_redirect", {
                custom_handler: !0
            });
            return
        }
        let K = bQ(A) ? P4().CLAUDEAI_SUCCESS_URL : P4().CONSOLE_SUCCESS_URL;
        this.pendingResponse.writeHead(302, {
            Location: K
        }), this.pendingResponse.end(), this.pendingResponse = null, c("tengu_oauth_automatic_redirect", {})
    }
    handleErrorRedirect() {
        if (!this.pendingResponse) return;
        let A = P4().CLAUDEAI_SUCCESS_URL;
        this.pendingResponse.writeHead(302, {
            Location: A
        }), this.pendingResponse.end(), this.pendingResponse = null, c("tengu_oauth_automatic_redirect_error", {})
    }
    startLocalListener(A) {
        this.localServer.on("request", this.handleRedirect.bind(this)), this.localServer.on("error", this.handleError.bind(this)), A()
    }
    handleRedirect(A, q) {
        let K = new URL(A.url || "", `http://${A.headers.host||"localhost"}`);
        if (K.pathname !== this.callbackPath) {
            q.writeHead(404), q.end();
            return
        }
        let Y = K.searchParams.get("code") ?? void 0,
            z = K.searchParams.get("state") ?? void 0;
        this.validateAndRespond(Y, z, q)
    }
    validateAndRespond(A, q, K) {
        if (!A) {
            K.writeHead(400), K.end("Authorization code not found"), this.reject(Error("No authorization code received"));
            return
        }
        if (q !== this.expectedState) {
            K.writeHead(400), K.end("Invalid state parameter"), this.reject(Error("Invalid state parameter"));
            return
        }
        this.pendingResponse = K, this.resolve(A)
    }
    handleError(A) {
        K1(A), this.close(), this.reject(A)
    }
    resolve(A) {
        if (this.promiseResolver) this.promiseResolver(A), this.promiseResolver = null, this.promiseRejecter = null
    }
    reject(A) {
        if (this.promiseRejecter) this.promiseRejecter(A), this.promiseResolver = null, this.promiseRejecter = null
    }
    close() {
        if (this.pendingResponse) this.handleErrorRedirect();
        if (this.localServer) this.localServer.removeAllListeners(), this.localServer.close()
    }
}
// @from(Ln 267415, Col 4)
I74 = v(() => {
    Uz();
    y6();
    u6();
    Pk()
})
// @from(Ln 267423, Col 0)
function MWA(A) {
    return A.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}
// @from(Ln 267427, Col 0)
function x74() {
    return MWA(dB1.randomBytes(32))
}
// @from(Ln 267431, Col 0)
function b74(A) {
    let q = dB1.createHash("sha256");
    return q.update(A), MWA(q.digest())
}
// @from(Ln 267436, Col 0)
function u74() {
    return MWA(dB1.randomBytes(32))
}
// @from(Ln 267439, Col 4)
B74 = () => {}
// @from(Ln 267441, Col 0)
function BZ() {
    return J6(process.env.CLAUDE_CODE_USE_BEDROCK) || J6(process.env.CLAUDE_CODE_USE_VERTEX) || J6(process.env.CLAUDE_CODE_USE_FOUNDRY) || !!process.env.DISABLE_TELEMETRY || !!process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC
}
// @from(Ln 267444, Col 4)
Js = v(() => {
    hA()
})
// @from(Ln 267447, Col 4)
F74 = R((m74) => {
    Object.defineProperty(m74, "__esModule", {
        value: !0
    });
    m74.SeverityNumber = void 0;
    var nF9;
    (function(A) {
        A[A.UNSPECIFIED = 0] = "UNSPECIFIED", A[A.TRACE = 1] = "TRACE", A[A.TRACE2 = 2] = "TRACE2", A[A.TRACE3 = 3] = "TRACE3", A[A.TRACE4 = 4] = "TRACE4", A[A.DEBUG = 5] = "DEBUG", A[A.DEBUG2 = 6] = "DEBUG2", A[A.DEBUG3 = 7] = "DEBUG3", A[A.DEBUG4 = 8] = "DEBUG4", A[A.INFO = 9] = "INFO", A[A.INFO2 = 10] = "INFO2", A[A.INFO3 = 11] = "INFO3", A[A.INFO4 = 12] = "INFO4", A[A.WARN = 13] = "WARN", A[A.WARN2 = 14] = "WARN2", A[A.WARN3 = 15] = "WARN3", A[A.WARN4 = 16] = "WARN4", A[A.ERROR = 17] = "ERROR", A[A.ERROR2 = 18] = "ERROR2", A[A.ERROR3 = 19] = "ERROR3", A[A.ERROR4 = 20] = "ERROR4", A[A.FATAL = 21] = "FATAL", A[A.FATAL2 = 22] = "FATAL2", A[A.FATAL3 = 23] = "FATAL3", A[A.FATAL4 = 24] = "FATAL4"
    })(nF9 = m74.SeverityNumber || (m74.SeverityNumber = {}))
})
// @from(Ln 267457, Col 4)
DX6 = R((Q74) => {
    Object.defineProperty(Q74, "__esModule", {
        value: !0
    });
    Q74.NOOP_LOGGER = Q74.NoopLogger = void 0;
    class WWA {
        emit(A) {}
    }
    Q74.NoopLogger = WWA;
    Q74.NOOP_LOGGER = new WWA
})
// @from(Ln 267468, Col 4)
ZWA = R((U74) => {
    Object.defineProperty(U74, "__esModule", {
        value: !0
    });
    U74.NOOP_LOGGER_PROVIDER = U74.NoopLoggerProvider = void 0;
    var oF9 = DX6();
    class GWA {
        getLogger(A, q, K) {
            return new oF9.NoopLogger
        }
    }
    U74.NoopLoggerProvider = GWA;
    U74.NOOP_LOGGER_PROVIDER = new GWA
})
// @from(Ln 267482, Col 4)
i74 = R((c74) => {
    Object.defineProperty(c74, "__esModule", {
        value: !0
    });
    c74.ProxyLogger = void 0;
    var sF9 = DX6();
    class d74 {
        constructor(A, q, K, Y) {
            this._provider = A, this.name = q, this.version = K, this.options = Y
        }
        emit(A) {
            this._getLogger().emit(A)
        }
        _getLogger() {
            if (this._delegate) return this._delegate;
            let A = this._provider._getDelegateLogger(this.name, this.version, this.options);
            if (!A) return sF9.NOOP_LOGGER;
            return this._delegate = A, this._delegate
        }
    }
    c74.ProxyLogger = d74
})
// @from(Ln 267504, Col 4)
fWA = R((r74) => {
    Object.defineProperty(r74, "__esModule", {
        value: !0
    });
    r74.ProxyLoggerProvider = void 0;
    var tF9 = ZWA(),
        eF9 = i74();
    class n74 {
        getLogger(A, q, K) {
            var Y;
            return (Y = this._getDelegateLogger(A, q, K)) !== null && Y !== void 0 ? Y : new eF9.ProxyLogger(this, A, q, K)
        }
        _getDelegate() {
            var A;
            return (A = this._delegate) !== null && A !== void 0 ? A : tF9.NOOP_LOGGER_PROVIDER
        }
        _setDelegate(A) {
            this._delegate = A
        }
        _getDelegateLogger(A, q, K) {
            var Y;
            return (Y = this._delegate) === null || Y === void 0 ? void 0 : Y.getLogger(A, q, K)
        }
    }
    r74.ProxyLoggerProvider = n74
})
// @from(Ln 267530, Col 4)
t74 = R((a74) => {
    Object.defineProperty(a74, "__esModule", {
        value: !0
    });
    a74._globalThis = void 0;
    a74._globalThis = typeof globalThis === "object" ? globalThis : global
})
// @from(Ln 267537, Col 4)
e74 = R((VWA) => {
    Object.defineProperty(VWA, "__esModule", {
        value: !0
    });
    VWA._globalThis = void 0;
    var AQ9 = t74();
    Object.defineProperty(VWA, "_globalThis", {
        enumerable: !0,
        get: function() {
            return AQ9._globalThis
        }
    })
})
// @from(Ln 267550, Col 4)
A44 = R((NWA) => {
    Object.defineProperty(NWA, "__esModule", {
        value: !0
    });
    NWA._globalThis = void 0;
    var KQ9 = e74();
    Object.defineProperty(NWA, "_globalThis", {
        enumerable: !0,
        get: function() {
            return KQ9._globalThis
        }
    })
})
// @from(Ln 267563, Col 4)
Y44 = R((q44) => {
    Object.defineProperty(q44, "__esModule", {
        value: !0
    });
    q44.API_BACKWARDS_COMPATIBILITY_VERSION = q44.makeGetter = q44._global = q44.GLOBAL_LOGS_API_KEY = void 0;
    var zQ9 = A44();
    q44.GLOBAL_LOGS_API_KEY = Symbol.for("io.opentelemetry.js.api.logs");
    q44._global = zQ9._globalThis;

    function wQ9(A, q, K) {
        return (Y) => Y === A ? q : K
    }
    q44.makeGetter = wQ9;
    q44.API_BACKWARDS_COMPATIBILITY_VERSION = 1
})
// @from(Ln 267578, Col 4)
$44 = R((w44) => {
    Object.defineProperty(w44, "__esModule", {
        value: !0
    });
    w44.LogsAPI = void 0;
    var RR = Y44(),
        _Q9 = ZWA(),
        z44 = fWA();
    class TWA {
        constructor() {
            this._proxyLoggerProvider = new z44.ProxyLoggerProvider
        }
        static getInstance() {
            if (!this._instance) this._instance = new TWA;
            return this._instance
        }
        setGlobalLoggerProvider(A) {
            if (RR._global[RR.GLOBAL_LOGS_API_KEY]) return this.getLoggerProvider();
            return RR._global[RR.GLOBAL_LOGS_API_KEY] = (0, RR.makeGetter)(RR.API_BACKWARDS_COMPATIBILITY_VERSION, A, _Q9.NOOP_LOGGER_PROVIDER), this._proxyLoggerProvider._setDelegate(A), A
        }
        getLoggerProvider() {
            var A, q;
            return (q = (A = RR._global[RR.GLOBAL_LOGS_API_KEY]) === null || A === void 0 ? void 0 : A.call(RR._global, RR.API_BACKWARDS_COMPATIBILITY_VERSION)) !== null && q !== void 0 ? q : this._proxyLoggerProvider
        }
        getLogger(A, q, K) {
            return this.getLoggerProvider().getLogger(A, q, K)
        }
        disable() {
            delete RR._global[RR.GLOBAL_LOGS_API_KEY], this._proxyLoggerProvider = new z44.ProxyLoggerProvider
        }
    }
    w44.LogsAPI = TWA
})
// @from(Ln 267611, Col 4)
vWA = R((JM1) => {
    Object.defineProperty(JM1, "__esModule", {
        value: !0
    });
    JM1.logs = JM1.ProxyLoggerProvider = JM1.NoopLogger = JM1.NOOP_LOGGER = JM1.SeverityNumber = void 0;
    var JQ9 = F74();
    Object.defineProperty(JM1, "SeverityNumber", {
        enumerable: !0,
        get: function() {
            return JQ9.SeverityNumber
        }
    });
    var O44 = DX6();
    Object.defineProperty(JM1, "NOOP_LOGGER", {
        enumerable: !0,
        get: function() {
            return O44.NOOP_LOGGER
        }
    });
    Object.defineProperty(JM1, "NoopLogger", {
        enumerable: !0,
        get: function() {
            return O44.NoopLogger
        }
    });
    var XQ9 = fWA();
    Object.defineProperty(JM1, "ProxyLoggerProvider", {
        enumerable: !0,
        get: function() {
            return XQ9.ProxyLoggerProvider
        }
    });
    var DQ9 = $44();
    JM1.logs = DQ9.LogsAPI.getInstance()
})
// @from(Ln 267646, Col 4)
cB1 = R((J44) => {
    Object.defineProperty(J44, "__esModule", {
        value: !0
    });
    J44.isTracingSuppressed = J44.unsuppressTracing = J44.suppressTracing = void 0;
    var jQ9 = Fq(),
        EWA = (0, jQ9.createContextKey)("OpenTelemetry SDK Context Key SUPPRESS_TRACING");

    function MQ9(A) {
        return A.setValue(EWA, !0)
    }
    J44.suppressTracing = MQ9;

    function PQ9(A) {
        return A.deleteValue(EWA)
    }
    J44.unsuppressTracing = PQ9;

    function WQ9(A) {
        return A.getValue(EWA) === !0
    }
    J44.isTracingSuppressed = WQ9
})
// @from(Ln 267669, Col 4)
kWA = R((D44) => {
    Object.defineProperty(D44, "__esModule", {
        value: !0
    });
    D44.BAGGAGE_MAX_TOTAL_LENGTH = D44.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = D44.BAGGAGE_MAX_NAME_VALUE_PAIRS = D44.BAGGAGE_HEADER = D44.BAGGAGE_ITEMS_SEPARATOR = D44.BAGGAGE_PROPERTIES_SEPARATOR = D44.BAGGAGE_KEY_PAIR_SEPARATOR = void 0;
    D44.BAGGAGE_KEY_PAIR_SEPARATOR = "=";
    D44.BAGGAGE_PROPERTIES_SEPARATOR = ";";
    D44.BAGGAGE_ITEMS_SEPARATOR = ",";
    D44.BAGGAGE_HEADER = "baggage";
    D44.BAGGAGE_MAX_NAME_VALUE_PAIRS = 180;
    D44.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = 4096;
    D44.BAGGAGE_MAX_TOTAL_LENGTH = 8192
})
// @from(Ln 267682, Col 4)
LWA = R((P44) => {
    Object.defineProperty(P44, "__esModule", {
        value: !0
    });
    P44.parseKeyPairsIntoRecord = P44.parsePairKeyValue = P44.getKeyPairs = P44.serializeKeyPairs = void 0;
    var kQ9 = Fq(),
        aK1 = kWA();

    function LQ9(A) {
        return A.reduce((q, K) => {
            let Y = `${q}${q!==""?aK1.BAGGAGE_ITEMS_SEPARATOR:""}${K}`;
            return Y.length > aK1.BAGGAGE_MAX_TOTAL_LENGTH ? q : Y
        }, "")
    }
    P44.serializeKeyPairs = LQ9;

    function RQ9(A) {
        return A.getAllEntries().map(([q, K]) => {
            let Y = `${encodeURIComponent(q)}=${encodeURIComponent(K.value)}`;
            if (K.metadata !== void 0) Y += aK1.BAGGAGE_PROPERTIES_SEPARATOR + K.metadata.toString();
            return Y
        })
    }
    P44.getKeyPairs = RQ9;

    function M44(A) {
        let q = A.split(aK1.BAGGAGE_PROPERTIES_SEPARATOR);
        if (q.length <= 0) return;
        let K = q.shift();
        if (!K) return;
        let Y = K.indexOf(aK1.BAGGAGE_KEY_PAIR_SEPARATOR);
        if (Y <= 0) return;
        let z = decodeURIComponent(K.substring(0, Y).trim()),
            w = decodeURIComponent(K.substring(Y + 1).trim()),
            H;
        if (q.length > 0) H = (0, kQ9.baggageEntryMetadataFromString)(q.join(aK1.BAGGAGE_PROPERTIES_SEPARATOR));
        return {
            key: z,
            value: w,
            metadata: H
        }
    }
    P44.parsePairKeyValue = M44;

    function yQ9(A) {
        let q = {};
        if (typeof A === "string" && A.length > 0) A.split(aK1.BAGGAGE_ITEMS_SEPARATOR).forEach((K) => {
            let Y = M44(K);
            if (Y !== void 0 && Y.value.length > 0) q[Y.key] = Y.value
        });
        return q
    }
    P44.parseKeyPairsIntoRecord = yQ9
})
// @from(Ln 267736, Col 4)
V44 = R((Z44) => {
    Object.defineProperty(Z44, "__esModule", {
        value: !0
    });
    Z44.W3CBaggagePropagator = void 0;
    var RWA = Fq(),
        IQ9 = cB1(),
        sK1 = kWA(),
        yWA = LWA();
    class G44 {
        inject(A, q, K) {
            let Y = RWA.propagation.getBaggage(A);
            if (!Y || (0, IQ9.isTracingSuppressed)(A)) return;
            let z = (0, yWA.getKeyPairs)(Y).filter((H) => {
                    return H.length <= sK1.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS
                }).slice(0, sK1.BAGGAGE_MAX_NAME_VALUE_PAIRS),
                w = (0, yWA.serializeKeyPairs)(z);
            if (w.length > 0) K.set(q, sK1.BAGGAGE_HEADER, w)
        }
        extract(A, q, K) {
            let Y = K.get(q, sK1.BAGGAGE_HEADER),
                z = Array.isArray(Y) ? Y.join(sK1.BAGGAGE_ITEMS_SEPARATOR) : Y;
            if (!z) return A;
            let w = {};
            if (z.length === 0) return A;
            if (z.split(sK1.BAGGAGE_ITEMS_SEPARATOR).forEach(($) => {
                    let O = (0, yWA.parsePairKeyValue)($);
                    if (O) {
                        let _ = {
                            value: O.value
                        };
                        if (O.metadata) _.metadata = O.metadata;
                        w[O.key] = _
                    }
                }), Object.entries(w).length === 0) return A;
            return RWA.propagation.setBaggage(A, RWA.propagation.createBaggage(w))
        }
        fields() {
            return [sK1.BAGGAGE_HEADER]
        }
    }
    Z44.W3CBaggagePropagator = G44
})
// @from(Ln 267779, Col 4)
E44 = R((T44) => {
    Object.defineProperty(T44, "__esModule", {
        value: !0
    });
    T44.AnchoredClock = void 0;
    class N44 {
        _monotonicClock;
        _epochMillis;
        _performanceMillis;
        constructor(A, q) {
            this._monotonicClock = q, this._epochMillis = A.now(), this._performanceMillis = q.now()
        }
        now() {
            let A = this._monotonicClock.now() - this._performanceMillis;
            return this._epochMillis + A
        }
    }
    T44.AnchoredClock = N44
})
// @from(Ln 267798, Col 4)
h44 = R((C44) => {
    Object.defineProperty(C44, "__esModule", {
        value: !0
    });
    C44.isAttributeValue = C44.isAttributeKey = C44.sanitizeAttributes = void 0;
    var k44 = Fq();

    function xQ9(A) {
        let q = {};
        if (typeof A !== "object" || A == null) return q;
        for (let K in A) {
            if (!Object.prototype.hasOwnProperty.call(A, K)) continue;
            if (!L44(K)) {
                k44.diag.warn(`Invalid attribute key: ${K}`);
                continue
            }
            let Y = A[K];
            if (!R44(Y)) {
                k44.diag.warn(`Invalid attribute value set for key: ${K}`);
                continue
            }
            if (Array.isArray(Y)) q[K] = Y.slice();
            else q[K] = Y
        }
        return q
    }
    C44.sanitizeAttributes = xQ9;

    function L44(A) {
        return typeof A === "string" && A !== ""
    }
    C44.isAttributeKey = L44;

    function R44(A) {
        if (A == null) return !0;
        if (Array.isArray(A)) return bQ9(A);
        return y44(typeof A)
    }
    C44.isAttributeValue = R44;

    function bQ9(A) {
        let q;
        for (let K of A) {
            if (K == null) continue;
            let Y = typeof K;
            if (Y === q) continue;
            if (!q) {
                if (y44(Y)) {
                    q = Y;
                    continue
                }
                return !1
            }
            return !1
        }
        return !0
    }

    function y44(A) {
        switch (A) {
            case "number":
            case "boolean":
            case "string":
                return !0
        }
        return !1
    }
})
// @from(Ln 267866, Col 4)
CWA = R((I44) => {
    Object.defineProperty(I44, "__esModule", {
        value: !0
    });
    I44.loggingErrorHandler = void 0;
    var mQ9 = Fq();

    function FQ9() {
        return (A) => {
            mQ9.diag.error(QQ9(A))
        }
    }
    I44.loggingErrorHandler = FQ9;

    function QQ9(A) {
        if (typeof A === "string") return A;
        else return JSON.stringify(gQ9(A))
    }

    function gQ9(A) {
        let q = {},
            K = A;
        while (K !== null) Object.getOwnPropertyNames(K).forEach((Y) => {
            if (q[Y]) return;
            let z = K[Y];
            if (z) q[Y] = String(z)
        }), K = Object.getPrototypeOf(K);
        return q
    }
})
// @from(Ln 267896, Col 4)
m44 = R((u44) => {
    Object.defineProperty(u44, "__esModule", {
        value: !0
    });
    u44.globalErrorHandler = u44.setGlobalErrorHandler = void 0;
    var UQ9 = CWA(),
        b44 = (0, UQ9.loggingErrorHandler)();

    function pQ9(A) {
        b44 = A
    }
    u44.setGlobalErrorHandler = pQ9;

    function dQ9(A) {
        try {
            b44(A)
        } catch {}
    }
    u44.globalErrorHandler = dQ9
})
// @from(Ln 267916, Col 4)
d44 = R((U44) => {
    Object.defineProperty(U44, "__esModule", {
        value: !0
    });
    U44.getStringListFromEnv = U44.getBooleanFromEnv = U44.getStringFromEnv = U44.getNumberFromEnv = void 0;
    var F44 = Fq(),
        Q44 = h1("util");

    function lQ9(A) {
        let q = process.env[A];
        if (q == null || q.trim() === "") return;
        let K = Number(q);
        if (isNaN(K)) {
            F44.diag.warn(`Unknown value ${(0,Q44.inspect)(q)} for ${A}, expected a number, using defaults`);
            return
        }
        return K
    }
    U44.getNumberFromEnv = lQ9;

    function g44(A) {
        let q = process.env[A];
        if (q == null || q.trim() === "") return;
        return q
    }
    U44.getStringFromEnv = g44;

    function iQ9(A) {
        let q = process.env[A]?.trim().toLowerCase();
        if (q == null || q === "") return !1;
        if (q === "true") return !0;
        else if (q === "false") return !1;
        else return F44.diag.warn(`Unknown value ${(0,Q44.inspect)(q)} for ${A}, expected 'true' or 'false', falling back to 'false' (default)`), !1
    }
    U44.getBooleanFromEnv = iQ9;

    function nQ9(A) {
        return g44(A)?.split(",").map((q) => q.trim()).filter((q) => q !== "")
    }
    U44.getStringListFromEnv = nQ9
})
// @from(Ln 267957, Col 4)
i44 = R((c44) => {
    Object.defineProperty(c44, "__esModule", {
        value: !0
    });
    c44._globalThis = void 0;
    c44._globalThis = typeof globalThis === "object" ? globalThis : global
})
// @from(Ln 267964, Col 4)
o44 = R((n44) => {
    Object.defineProperty(n44, "__esModule", {
        value: !0
    });
    n44.otperformance = void 0;
    var sQ9 = h1("perf_hooks");
    n44.otperformance = sQ9.performance
})
// @from(Ln 267972, Col 4)
t44 = R((a44) => {
    Object.defineProperty(a44, "__esModule", {
        value: !0
    });
    a44.VERSION = void 0;
    a44.VERSION = "2.2.0"
})
// @from(Ln 267979, Col 4)
SWA = R((e44) => {
    Object.defineProperty(e44, "__esModule", {
        value: !0
    });
    e44.createConstMap = void 0;

    function tQ9(A) {
        let q = {},
            K = A.length;
        for (let Y = 0; Y < K; Y++) {
            let z = A[Y];
            if (z) q[String(z).toUpperCase().replace(/[-.]/g, "_")] = z
        }
        return q
    }
    e44.createConstMap = tQ9
})