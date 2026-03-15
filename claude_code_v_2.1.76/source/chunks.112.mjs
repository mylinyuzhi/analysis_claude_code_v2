
// @from(Ln 272451, Col 4)
M04 = x((e5w, J04) => {
    var O04 = (A, q) => (...K) => {
            return `\x1B[${A(...K)+q}m`
        },
        $04 = (A, q) => (...K) => {
            let Y = A(...K);
            return `\x1B[${38+q};5;${Y}m`
        },
        H04 = (A, q) => (...K) => {
            let Y = A(...K);
            return `\x1B[${38+q};2;${Y[0]};${Y[1]};${Y[2]}m`
        },
        AZ1 = (A) => A,
        j04 = (A, q, K) => [A, q, K],
        VZ6 = (A, q, K) => {
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
        Py8, kZ6 = (A, q, K, Y) => {
            if (Py8 === void 0) Py8 = S38();
            let z = Y ? 10 : 0,
                _ = {};
            for (let [w, O] of Object.entries(Py8)) {
                let $ = w === "ansi16" ? "ansi" : w;
                if (w === q) _[$] = A(K, z);
                else if (typeof O === "object") _[$] = A(O[q], z)
            }
            return _
        };

    function lt9() {
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
            for (let [z, _] of Object.entries(Y)) q[z] = {
                open: `\x1B[${_[0]}m`,
                close: `\x1B[${_[1]}m`
            }, Y[z] = q[z], A.set(_[0], _[1]);
            Object.defineProperty(q, K, {
                value: Y,
                enumerable: !1
            })
        }
        return Object.defineProperty(q, "codes", {
            value: A,
            enumerable: !1
        }), q.color.close = "\x1B[39m", q.bgColor.close = "\x1B[49m", VZ6(q.color, "ansi", () => kZ6(O04, "ansi16", AZ1, !1)), VZ6(q.color, "ansi256", () => kZ6($04, "ansi256", AZ1, !1)), VZ6(q.color, "ansi16m", () => kZ6(H04, "rgb", j04, !1)), VZ6(q.bgColor, "ansi", () => kZ6(O04, "ansi16", AZ1, !0)), VZ6(q.bgColor, "ansi256", () => kZ6($04, "ansi256", AZ1, !0)), VZ6(q.bgColor, "ansi16m", () => kZ6(H04, "rgb", j04, !0)), q
    }
    Object.defineProperty(J04, "exports", {
        enumerable: !0,
        get: lt9
    })
})
// @from(Ln 272562, Col 4)
P04 = x((A3w, X04) => {
    var it9 = x6("os"),
        D04 = x6("tty"),
        xR = yL6(),
        {
            env: NX
        } = process,
        ve;
    if (xR("no-color") || xR("no-colors") || xR("color=false") || xR("color=never")) ve = 0;
    else if (xR("color") || xR("colors") || xR("color=true") || xR("color=always")) ve = 1;
    if ("FORCE_COLOR" in NX)
        if (NX.FORCE_COLOR === "true") ve = 1;
        else if (NX.FORCE_COLOR === "false") ve = 0;
    else ve = NX.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(NX.FORCE_COLOR, 10), 3);

    function Wy8(A) {
        if (A === 0) return !1;
        return {
            level: A,
            hasBasic: !0,
            has256: A >= 2,
            has16m: A >= 3
        }
    }

    function Zy8(A, q) {
        if (ve === 0) return 0;
        if (xR("color=16m") || xR("color=full") || xR("color=truecolor")) return 3;
        if (xR("color=256")) return 2;
        if (A && !q && ve === void 0) return 0;
        let K = ve || 0;
        if (NX.TERM === "dumb") return K;
        if (process.platform === "win32") {
            let Y = it9.release().split(".");
            if (Number(Y[0]) >= 10 && Number(Y[2]) >= 10586) return Number(Y[2]) >= 14931 ? 3 : 2;
            return 1
        }
        if ("CI" in NX) {
            if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((Y) => (Y in NX)) || NX.CI_NAME === "codeship") return 1;
            return K
        }
        if ("TEAMCITY_VERSION" in NX) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(NX.TEAMCITY_VERSION) ? 1 : 0;
        if (NX.COLORTERM === "truecolor") return 3;
        if ("TERM_PROGRAM" in NX) {
            let Y = parseInt((NX.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
            switch (NX.TERM_PROGRAM) {
                case "iTerm.app":
                    return Y >= 3 ? 3 : 2;
                case "Apple_Terminal":
                    return 2
            }
        }
        if (/-256(color)?$/i.test(NX.TERM)) return 2;
        if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(NX.TERM)) return 1;
        if ("COLORTERM" in NX) return 1;
        return K
    }

    function nt9(A) {
        let q = Zy8(A, A && A.isTTY);
        return Wy8(q)
    }
    X04.exports = {
        supportsColor: nt9,
        stdout: Wy8(Zy8(!0, D04.isatty(1))),
        stderr: Wy8(Zy8(!0, D04.isatty(2)))
    }
})
// @from(Ln 272630, Col 4)
Z04 = x((q3w, W04) => {
    var rt9 = (A, q, K) => {
            let Y = A.indexOf(q);
            if (Y === -1) return A;
            let z = q.length,
                _ = 0,
                w = "";
            do w += A.substr(_, Y - _) + q + K, _ = Y + z, Y = A.indexOf(q, _); while (Y !== -1);
            return w += A.substr(_), w
        },
        ot9 = (A, q, K, Y) => {
            let z = 0,
                _ = "";
            do {
                let w = A[Y - 1] === "\r";
                _ += A.substr(z, (w ? Y - 1 : Y) - z) + q + (w ? `\r
` : `
`) + K, z = Y + 1, Y = A.indexOf(`
`, z)
            } while (Y !== -1);
            return _ += A.substr(z), _
        };
    W04.exports = {
        stringReplaceAll: rt9,
        stringEncaseCRLFWithFirstIndex: ot9
    }
})
// @from(Ln 272657, Col 4)
N04 = x((K3w, v04) => {
    var at9 = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi,
        G04 = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g,
        st9 = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/,
        tt9 = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi,
        et9 = new Map([
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

    function T04(A) {
        let q = A[0] === "u",
            K = A[1] === "{";
        if (q && !K && A.length === 5 || A[0] === "x" && A.length === 3) return String.fromCharCode(parseInt(A.slice(1), 16));
        if (q && K) return String.fromCodePoint(parseInt(A.slice(2, -1), 16));
        return et9.get(A) || A
    }

    function Ae9(A, q) {
        let K = [],
            Y = q.trim().split(/\s*,\s*/g),
            z;
        for (let _ of Y) {
            let w = Number(_);
            if (!Number.isNaN(w)) K.push(w);
            else if (z = _.match(st9)) K.push(z[2].replace(tt9, (O, $, H) => $ ? T04($) : H));
            else throw Error(`Invalid Chalk template style argument: ${_} (in style '${A}')`)
        }
        return K
    }

    function qe9(A) {
        G04.lastIndex = 0;
        let q = [],
            K;
        while ((K = G04.exec(A)) !== null) {
            let Y = K[1];
            if (K[2]) {
                let z = Ae9(Y, K[2]);
                q.push([Y].concat(z))
            } else q.push([Y])
        }
        return q
    }

    function f04(A, q) {
        let K = {};
        for (let z of q)
            for (let _ of z.styles) K[_[0]] = z.inverse ? null : _.slice(1);
        let Y = A;
        for (let [z, _] of Object.entries(K)) {
            if (!Array.isArray(_)) continue;
            if (!(z in Y)) throw Error(`Unknown Chalk style: ${z}`);
            Y = _.length > 0 ? Y[z](..._) : Y[z]
        }
        return Y
    }
    v04.exports = (A, q) => {
        let K = [],
            Y = [],
            z = [];
        if (q.replace(at9, (_, w, O, $, H, j) => {
                if (w) z.push(T04(w));
                else if ($) {
                    let J = z.join("");
                    z = [], Y.push(K.length === 0 ? J : f04(A, K)(J)), K.push({
                        inverse: O,
                        styles: qe9($)
                    })
                } else if (H) {
                    if (K.length === 0) throw Error("Found extraneous } in Chalk template literal");
                    Y.push(f04(A, K)(z.join(""))), z = [], K.pop()
                } else z.push(j)
            }), Y.push(z.join("")), K.length > 0) {
            let _ = `Chalk template literal is missing ${K.length} closing bracket${K.length===1?"":"s"} (\`}\`)`;
            throw Error(_)
        }
        return Y.join("")
    }
})
// @from(Ln 272746, Col 4)
S04 = x((Y3w, h04) => {
    var SQ6 = M04(),
        {
            stdout: fy8,
            stderr: Ty8
        } = P04(),
        {
            stringReplaceAll: Ke9,
            stringEncaseCRLFWithFirstIndex: Ye9
        } = Z04(),
        {
            isArray: qZ1
        } = Array,
        k04 = ["ansi", "ansi", "ansi256", "ansi16m"],
        EZ6 = Object.create(null),
        ze9 = (A, q = {}) => {
            if (q.level && !(Number.isInteger(q.level) && q.level >= 0 && q.level <= 3)) throw Error("The `level` option should be an integer from 0 to 3");
            let K = fy8 ? fy8.level : 0;
            A.level = q.level === void 0 ? K : q.level
        };
    class E04 {
        constructor(A) {
            return y04(A)
        }
    }
    var y04 = (A) => {
        let q = {};
        return ze9(q, A), q.template = (...K) => R04(q.template, ...K), Object.setPrototypeOf(q, KZ1.prototype), Object.setPrototypeOf(q.template, q), q.template.constructor = () => {
            throw Error("`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.")
        }, q.template.Instance = E04, q.template
    };

    function KZ1(A) {
        return y04(A)
    }
    for (let [A, q] of Object.entries(SQ6)) EZ6[A] = {
        get() {
            let K = YZ1(this, vy8(q.open, q.close, this._styler), this._isEmpty);
            return Object.defineProperty(this, A, {
                value: K
            }), K
        }
    };
    EZ6.visible = {
        get() {
            let A = YZ1(this, this._styler, !0);
            return Object.defineProperty(this, "visible", {
                value: A
            }), A
        }
    };
    var L04 = ["rgb", "hex", "keyword", "hsl", "hsv", "hwb", "ansi", "ansi256"];
    for (let A of L04) EZ6[A] = {
        get() {
            let {
                level: q
            } = this;
            return function(...K) {
                let Y = vy8(SQ6.color[k04[q]][A](...K), SQ6.color.close, this._styler);
                return YZ1(this, Y, this._isEmpty)
            }
        }
    };
    for (let A of L04) {
        let q = "bg" + A[0].toUpperCase() + A.slice(1);
        EZ6[q] = {
            get() {
                let {
                    level: K
                } = this;
                return function(...Y) {
                    let z = vy8(SQ6.bgColor[k04[K]][A](...Y), SQ6.bgColor.close, this._styler);
                    return YZ1(this, z, this._isEmpty)
                }
            }
        }
    }
    var _e9 = Object.defineProperties(() => {}, {
            ...EZ6,
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
        vy8 = (A, q, K) => {
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
        YZ1 = (A, q, K) => {
            let Y = (...z) => {
                if (qZ1(z[0]) && qZ1(z[0].raw)) return V04(Y, R04(Y, ...z));
                return V04(Y, z.length === 1 ? "" + z[0] : z.join(" "))
            };
            return Object.setPrototypeOf(Y, _e9), Y._generator = A, Y._styler = q, Y._isEmpty = K, Y
        },
        V04 = (A, q) => {
            if (A.level <= 0 || !q) return A._isEmpty ? "" : q;
            let K = A._styler;
            if (K === void 0) return q;
            let {
                openAll: Y,
                closeAll: z
            } = K;
            if (q.indexOf("\x1B") !== -1)
                while (K !== void 0) q = Ke9(q, K.close, K.open), K = K.parent;
            let _ = q.indexOf(`
`);
            if (_ !== -1) q = Ye9(q, z, Y, _);
            return Y + q + z
        },
        Gy8, R04 = (A, ...q) => {
            let [K] = q;
            if (!qZ1(K) || !qZ1(K.raw)) return q.join(" ");
            let Y = q.slice(1),
                z = [K.raw[0]];
            for (let _ = 1; _ < K.length; _++) z.push(String(Y[_ - 1]).replace(/[{}\\]/g, "\\$&"), String(K.raw[_]));
            if (Gy8 === void 0) Gy8 = N04();
            return Gy8(A, z.join(""))
        };
    Object.defineProperties(KZ1.prototype, EZ6);
    var zZ1 = KZ1();
    zZ1.supportsColor = fy8;
    zZ1.stderr = KZ1({
        level: Ty8 ? Ty8.level : 0
    });
    zZ1.stderr.supportsColor = Ty8;
    h04.exports = zZ1
})
// @from(Ln 272887, Col 4)
Ny8 = x((o3) => {
    var we9 = o3 && o3.__importDefault || function(A) {
        return A && A.__esModule ? A : {
            default: A
        }
    };
    Object.defineProperty(o3, "__esModule", {
        value: !0
    });
    o3.parse = o3.stringify = o3.toJson = o3.fromJson = o3.DEFAULT_THEME = o3.plain = void 0;
    var qj = we9(S04()),
        Oe9 = function(A) {
            return A
        };
    o3.plain = Oe9;
    o3.DEFAULT_THEME = {
        keyword: qj.default.blue,
        built_in: qj.default.cyan,
        type: qj.default.cyan.dim,
        literal: qj.default.blue,
        number: qj.default.green,
        regexp: qj.default.red,
        string: qj.default.red,
        subst: o3.plain,
        symbol: o3.plain,
        class: qj.default.blue,
        function: qj.default.yellow,
        title: o3.plain,
        params: o3.plain,
        comment: qj.default.green,
        doctag: qj.default.green,
        meta: qj.default.grey,
        "meta-keyword": o3.plain,
        "meta-string": o3.plain,
        section: o3.plain,
        tag: qj.default.grey,
        name: qj.default.blue,
        "builtin-name": o3.plain,
        attr: qj.default.cyan,
        attribute: o3.plain,
        variable: o3.plain,
        bullet: o3.plain,
        code: o3.plain,
        emphasis: qj.default.italic,
        strong: qj.default.bold,
        formula: o3.plain,
        link: qj.default.underline,
        quote: o3.plain,
        "selector-tag": o3.plain,
        "selector-id": o3.plain,
        "selector-class": o3.plain,
        "selector-attr": o3.plain,
        "selector-pseudo": o3.plain,
        "template-tag": o3.plain,
        "template-variable": o3.plain,
        addition: qj.default.green,
        deletion: qj.default.red,
        default: o3.plain
    };

    function C04(A) {
        var q = {};
        for (var K = 0, Y = Object.keys(A); K < Y.length; K++) {
            var z = Y[K],
                _ = A[z];
            if (Array.isArray(_)) q[z] = _.reduce(function(w, O) {
                return O === "plain" ? o3.plain : w[O]
            }, qj.default);
            else q[z] = qj.default[_]
        }
        return q
    }
    o3.fromJson = C04;

    function I04(A) {
        var q = {};
        for (var K = 0, Y = Object.keys(q); K < Y.length; K++) {
            var z = Y[K],
                _ = q[z];
            q[z] = _._styles
        }
        return q
    }
    o3.toJson = I04;

    function $e9(A) {
        return JSON.stringify(I04(A))
    }
    o3.stringify = $e9;

    function He9(A) {
        return C04(JSON.parse(A))
    }
    o3.parse = He9
})
// @from(Ln 272982, Col 4)
ky8 = x((KM) => {
    var b04 = KM && KM.__createBinding || (Object.create ? function(A, q, K, Y) {
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
        je9 = KM && KM.__setModuleDefault || (Object.create ? function(A, q) {
            Object.defineProperty(A, "default", {
                enumerable: !0,
                value: q
            })
        } : function(A, q) {
            A.default = q
        }),
        x04 = KM && KM.__importStar || function(A) {
            if (A && A.__esModule) return A;
            var q = {};
            if (A != null) {
                for (var K in A)
                    if (K !== "default" && Object.prototype.hasOwnProperty.call(A, K)) b04(q, A, K)
            }
            return je9(q, A), q
        },
        Je9 = KM && KM.__exportStar || function(A, q) {
            for (var K in A)
                if (K !== "default" && !Object.prototype.hasOwnProperty.call(q, K)) b04(q, A, K)
        },
        Me9 = KM && KM.__importDefault || function(A) {
            return A && A.__esModule ? A : {
                default: A
            }
        };
    Object.defineProperty(KM, "__esModule", {
        value: !0
    });
    KM.supportsLanguage = KM.listLanguages = KM.highlight = void 0;
    var wZ1 = x04(rE8()),
        De9 = x04(sP4()),
        Xe9 = Me9(w04()),
        _Z1 = Ny8();

    function Vy8(A, q, K) {
        if (q === void 0) q = {};
        switch (A.type) {
            case "text": {
                var Y = A.data;
                if (K === void 0) return (q.default || _Z1.DEFAULT_THEME.default || _Z1.plain)(Y);
                return Y
            }
            case "tag": {
                var z = /hljs-(\w+)/.exec(A.attribs.class);
                if (z) {
                    var _ = z[1],
                        w = A.childNodes.map(function(O) {
                            return Vy8(O, q, _)
                        }).join("");
                    return (q[_] || _Z1.DEFAULT_THEME[_] || _Z1.plain)(w)
                }
                return A.childNodes.map(function(O) {
                    return Vy8(O, q)
                }).join("")
            }
        }
        throw Error("Invalid node type " + A.type)
    }

    function Pe9(A, q) {
        if (q === void 0) q = {};
        var K = De9.parseFragment(A, {
            treeAdapter: Xe9.default
        });
        return K.childNodes.map(function(Y) {
            return Vy8(Y, q)
        }).join("")
    }

    function u04(A, q) {
        if (q === void 0) q = {};
        var K;
        if (q.language) K = wZ1.highlight(A, {
            language: q.language,
            ignoreIllegals: q.ignoreIllegals
        }).value;
        else K = wZ1.highlightAuto(A, q.languageSubset).value;
        return Pe9(K, q.theme)
    }
    KM.highlight = u04;

    function We9() {
        return wZ1.listLanguages()
    }
    KM.listLanguages = We9;

    function Ze9(A) {
        return !!wZ1.getLanguage(A)
    }
    KM.supportsLanguage = Ze9;
    KM.default = u04;
    Je9(Ny8(), KM)
})
// @from(Ln 273090, Col 0)
function OZ1() {
    if (m04) return;
    m04 = !0, l9.use({
        tokenizer: {
            del() {
                return
            }
        }
    })
}
// @from(Ln 273101, Col 0)
function $Z1(A, q, K = !1) {
    return OZ1(), l9.lexer(Ne(A)).map((Y) => AD(Y, q, 0, null, null, K)).join("").trim()
}
// @from(Ln 273105, Col 0)
function AD(A, q, K = 0, Y = null, z = null, _ = !1) {
    switch (A.type) {
        case "blockquote": {
            let w = (A.tokens ?? []).map(($) => AD($, q, 0, null, null, _)).join(""),
                O = O1.dim(Lw4);
            return w.split(eM).map(($) => sY($).trim() ? `${O} ${O1.italic($)}` : $).join(eM)
        }
        case "code": {
            if (_) return A.text + eM;
            if (!Ey8) return A.text + eM;
            let w = "plaintext";
            if (A.lang)
                if (g04?.(A.lang)) w = A.lang;
                else k(`Language not supported while highlighting code, falling back to plaintext: ${A.lang}`);
            return Ey8(A.text, {
                language: w
            }) + eM
        }
        case "codespan":
            return kA("permission", q)(A.text);
        case "em":
            return O1.italic((A.tokens ?? []).map((w) => AD(w, q, 0, null, z, _)).join(""));
        case "strong":
            return O1.bold((A.tokens ?? []).map((w) => AD(w, q, 0, null, z, _)).join(""));
        case "heading":
            switch (A.depth) {
                case 1:
                    return O1.bold.italic.underline((A.tokens ?? []).map((w) => AD(w, q, 0, null, null, _)).join("")) + eM + eM;
                case 2:
                    return O1.bold((A.tokens ?? []).map((w) => AD(w, q, 0, null, null, _)).join("")) + eM + eM;
                default:
                    return O1.bold((A.tokens ?? []).map((w) => AD(w, q, 0, null, null, _)).join("")) + eM + eM
            }
        case "hr":
            return "---";
        case "image":
            return A.href;
        case "link": {
            if (A.href.startsWith("mailto:")) return A.href.replace(/^mailto:/, "");
            let w = (A.tokens ?? []).map(($) => AD($, q, 0, null, A, _)).join(""),
                O = sY(w);
            if (O && O !== A.href) return PW6(A.href, w);
            return PW6(A.href)
        }
        case "list":
            return A.items.map((w, O) => AD(w, q, K, A.ordered ? A.start + O : null, A, _)).join("");
        case "list_item":
            return (A.tokens ?? []).map((w) => `${"  ".repeat(K)}${AD(w,q,K+1,Y,A,_)}`).join("");
        case "paragraph":
            return (A.tokens ?? []).map((w) => AD(w, q, 0, null, null, _)).join("") + eM;
        case "space":
            return eM;
        case "br":
            return eM;
        case "text":
            if (z?.type === "link") return A.text;
            if (z?.type === "list_item") return `${Y===null?"-":ve9(K,Y)+"."} ${A.tokens?A.tokens.map((w)=>AD(w,q,K,Y,A,_)).join(""):B04(A.text)}${eM}`;
            return B04(A.text);
        case "table": {
            let O = function(j) {
                    return sY(j?.map((J) => AD(J, q, 0, null, null, _)).join("") ?? "")
                },
                w = A,
                $ = w.header.map((j, J) => {
                    let M = f8(O(j.tokens));
                    for (let D of w.rows) {
                        let X = f8(O(D[J]?.tokens));
                        M = Math.max(M, X)
                    }
                    return Math.max(M, 3)
                }),
                H = "| ";
            return w.header.forEach((j, J) => {
                let M = j.tokens?.map((Z) => AD(Z, q, 0, null, null, _)).join("") ?? "",
                    D = O(j.tokens),
                    X = $[J],
                    P = w.align?.[J],
                    W;
                if (P === "center") {
                    let Z = X - f8(D),
                        G = Math.floor(Z / 2),
                        f = Z - G;
                    W = " ".repeat(G) + M + " ".repeat(f)
                } else if (P === "right") {
                    let Z = X - f8(D);
                    W = " ".repeat(Z) + M
                } else W = M + " ".repeat(X - f8(D));
                H += W + " | "
            }), H = H.trimEnd() + eM, H += "|", $.forEach((j) => {
                let J = "-".repeat(j + 2);
                H += J + "|"
            }), H += eM, w.rows.forEach((j) => {
                H += "| ", j.forEach((J, M) => {
                    let D = J.tokens?.map((G) => AD(G, q, 0, null, null, _)).join("") ?? "",
                        X = O(J.tokens),
                        P = $[M],
                        W = w.align?.[M],
                        Z;
                    if (W === "center") {
                        let G = P - f8(X),
                            f = Math.floor(G / 2),
                            v = G - f;
                        Z = " ".repeat(f) + D + " ".repeat(v)
                    } else if (W === "right") {
                        let G = P - f8(X);
                        Z = " ".repeat(G) + D
                    } else Z = D + " ".repeat(P - f8(X));
                    H += Z + " | "
                }), H = H.trimEnd() + eM
            }), H + eM
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
// @from(Ln 273226, Col 0)
function B04(A) {
    if (!cG()) return A;
    let q = mC6();
    if (!q) return A;
    return A.replace(Ge9, (K, Y) => PW6(`https://github.com/${q}/issues/${Y}`, K))
}
// @from(Ln 273233, Col 0)
function ve9(A, q) {
    switch (A) {
        case 0:
        case 1:
            return q.toString();
        case 2:
            return fe9[q - 1];
        case 3:
            return Te9[q - 1];
        default:
            return q.toString()
    }
}
// @from(Ln 273246, Col 4)
Ey8
// @from(Ln 273246, Col 9)
g04
// @from(Ln 273246, Col 14)
eM = `
`
// @from(Ln 273248, Col 4)
m04 = !1
// @from(Ln 273249, Col 4)
Ge9
// @from(Ln 273249, Col 9)
fe9
// @from(Ln 273249, Col 14)
Te9
// @from(Ln 273250, Col 4)
CQ6 = E(() => {
    HF6();
    JA();
    aK();
    H1();
    LG();
    bK6();
    qw();
    sN8();
    mU();
    yG();
    q3();
    Promise.resolve().then(() => t(ky8(), 1)).then((A) => {
        Ey8 = A.highlight, g04 = A.supportsLanguage
    });
    Ge9 = /(?<!\w)#(\d{3,})\b/g;
    fe9 = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "aa", "ab", "ac", "ad", "ae", "af", "ag", "ah", "ai", "aj", "ak", "al", "am", "an", "ao", "ap", "aq", "ar", "as", "at", "au", "av", "aw", "ax", "ay", "az"], Te9 = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii", "xiii", "xiv", "xv", "xvi", "xvii", "xviii", "xix", "xx", "xxi", "xxii", "xxiii", "xxiv", "xxv", "xxvi", "xxvii", "xxviii", "xxix", "xxx", "xxxi", "xxxii", "xxxiii", "xxxiv", "xxxv", "xxxvi", "xxxvii", "xxxviii", "xxxix", "xl"]
})
// @from(Ln 273269, Col 0)
function Kj() {
    return M1((A) => A.settings)
}
// @from(Ln 273272, Col 4)
nI = E(() => {
    NA()
})
// @from(Ln 273276, Col 0)
function bQ6(A, q, K) {
    if (q <= 0) return [A];
    let Y = A.trimEnd(),
        _ = OK6(Y, q, {
            hard: K?.hard ?? !1,
            trim: !1,
            wordWrap: !0
        }).split(`
`).filter((w) => w.length > 0);
    return _.length > 0 ? _ : [""]
}
// @from(Ln 273288, Col 0)
function p04({
    token: A,
    syntaxHighlightingDisabled: q = !1,
    forceWidth: K
}) {
    let [Y] = z7(), {
        columns: z
    } = KA(), _ = K ?? z;

    function w(I) {
        return I?.map((g) => AD(g, Y, 0, null, null, q)).join("") ?? ""
    }

    function O(I) {
        return sY(w(I))
    }

    function $(I) {
        let B = O(I).split(/\s+/).filter((b) => b.length > 0);
        if (B.length === 0) return IQ6;
        return Math.max(...B.map((b) => f8(b)), IQ6)
    }

    function H(I) {
        return Math.max(f8(O(I)), IQ6)
    }
    let j = A.header.map((I, g) => {
            let B = $(I.tokens);
            for (let b of A.rows) B = Math.max(B, $(b[g]?.tokens));
            return B
        }),
        J = A.header.map((I, g) => {
            let B = H(I.tokens);
            for (let b of A.rows) B = Math.max(B, H(b[g]?.tokens));
            return B
        }),
        M = A.header.length,
        D = 1 + M * 3,
        X = Math.max(_ - D - F04, M * IQ6),
        P = j.reduce((I, g) => I + g, 0),
        W = J.reduce((I, g) => I + g, 0),
        Z = !1,
        G;
    if (W <= X) G = J;
    else if (P <= X) {
        let I = X - P,
            g = J.map((b, p) => b - j[p]),
            B = g.reduce((b, p) => b + p, 0);
        G = j.map((b, p) => {
            if (B === 0) return b;
            let Q = Math.floor(g[p] / B * I);
            return b + Q
        })
    } else {
        Z = !0;
        let I = X / P;
        G = j.map((g) => Math.max(Math.floor(g * I), IQ6))
    }

    function f() {
        let I = 1;
        for (let g = 0; g < A.header.length; g++) {
            let B = w(A.header[g].tokens),
                b = bQ6(B, G[g], {
                    hard: Z
                });
            I = Math.max(I, b.length)
        }
        for (let g of A.rows)
            for (let B = 0; B < g.length; B++) {
                let b = w(g[B]?.tokens),
                    p = bQ6(b, G[B], {
                        hard: Z
                    });
                I = Math.max(I, p.length)
            }
        return I
    }
    let N = f() > Ne9;

    function V(I, g) {
        let B = I.map((U, r) => {
                let e = w(U.tokens),
                    Y6 = G[r];
                return bQ6(e, Y6, {
                    hard: Z
                })
            }),
            b = Math.max(...B.map((U) => U.length), 1),
            p = B.map((U) => Math.floor((b - U.length) / 2)),
            Q = [];
        for (let U = 0; U < b; U++) {
            let r = "│";
            for (let e = 0; e < I.length; e++) {
                let Y6 = B[e],
                    H6 = p[e],
                    J6 = U - H6,
                    K6 = J6 >= 0 && J6 < Y6.length ? Y6[J6] : "",
                    s = G[e],
                    X6 = g ? "center" : A.align?.[e] ?? "left",
                    z6 = f8(K6),
                    N6 = Math.max(0, s - z6),
                    $6;
                if (X6 === "center") {
                    let n = Math.floor(N6 / 2),
                        o = N6 - n;
                    $6 = " ".repeat(n) + K6 + " ".repeat(o)
                } else if (X6 === "right") $6 = " ".repeat(N6) + K6;
                else $6 = K6 + " ".repeat(N6);
                r += " " + $6 + " │"
            }
            Q.push(r)
        }
        return Q
    }

    function L(I) {
        let [g, B, b, p] = {
            top: ["┌", "─", "┬", "┐"],
            middle: ["├", "─", "┼", "┤"],
            bottom: ["└", "─", "┴", "┘"]
        } [I], Q = g;
        return G.forEach((U, r) => {
            Q += B.repeat(U + 2), Q += r < G.length - 1 ? b : p
        }), Q
    }

    function h() {
        let I = [],
            g = A.header.map((Q) => O(Q.tokens)),
            B = Math.min(_ - 1, 40),
            b = "─".repeat(B),
            p = "  ";
        return A.rows.forEach((Q, U) => {
            if (U > 0) I.push(b);
            Q.forEach((r, e) => {
                let Y6 = g[e] || `Column ${e+1}`,
                    J6 = w(r.tokens).trimEnd().replace(/\n+/g, " ").replace(/\s+/g, " ").trim(),
                    K6 = _ - f8(Y6) - 3,
                    s = _ - 2 - 1,
                    X6 = bQ6(J6, Math.max(K6, 10)),
                    z6 = X6[0] || "",
                    N6;
                if (X6.length <= 1 || s <= K6) N6 = X6;
                else {
                    let $6 = X6.slice(1).map((o) => o.trim()).join(" "),
                        n = bQ6($6, s);
                    N6 = [z6, ...n]
                }
                I.push(`${Ve9}${Y6}:${ke9} ${N6[0]||""}`);
                for (let $6 = 1; $6 < N6.length; $6++) {
                    let n = N6[$6];
                    if (!n.trim()) continue;
                    I.push(`  ${n}`)
                }
            })
        }), I.join(`
`)
    }
    if (N) return HZ1.default.createElement(wK, null, h());
    let R = [];
    if (R.push(L("top")), R.push(...V(A.header, !0)), R.push(L("middle")), A.rows.forEach((I, g) => {
            if (R.push(...V(I, !1)), g < A.rows.length - 1) R.push(L("middle"))
        }), R.push(L("bottom")), Math.max(...R.map((I) => f8(sY(I)))) > _ - F04) return HZ1.default.createElement(wK, null, h());
    return HZ1.default.createElement(wK, null, R.join(`
`))
}
// @from(Ln 273455, Col 4)
HZ1
// @from(Ln 273455, Col 9)
F04 = 4
// @from(Ln 273456, Col 4)
IQ6 = 3
// @from(Ln 273457, Col 4)
Ne9 = 4
// @from(Ln 273458, Col 4)
Ve9 = "\x1B[1m"
// @from(Ln 273459, Col 4)
ke9 = "\x1B[22m"
// @from(Ln 273460, Col 4)
Q04 = E(() => {
    i6();
    _q();
    CQ6();
    q3();
    LG();
    zO1();
    HZ1 = t(P6(), 1)
})
// @from(Ln 273470, Col 0)
function U_(A) {
    let q = A6(7),
        {
            children: K,
            dimColor: Y
        } = A,
        [z] = z7(),
        w = Kj().syntaxHighlightingDisabled ?? !1;
    OZ1();
    let O;
    if (q[0] !== K || q[1] !== Y || q[2] !== w || q[3] !== z) {
        let j = l9.lexer(Ne(K));
        O = [];
        let J = "",
            M = function() {
                if (J) O.push(Zc.default.createElement(wK, {
                    key: O.length,
                    dimColor: Y
                }, J.trim())), J = ""
            };
        for (let D of j)
            if (D.type === "table") M(), O.push(Zc.default.createElement(p04, {
                key: O.length,
                token: D,
                syntaxHighlightingDisabled: w
            }));
            else J = J + AD(D, z, 0, null, null, w);
        M(), q[0] = K, q[1] = Y, q[2] = w, q[3] = z, q[4] = O
    } else O = q[4];
    let $ = O,
        H;
    if (q[5] !== $) H = Zc.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, $), q[5] = $, q[6] = H;
    else H = q[6];
    return H
}
// @from(Ln 273509, Col 0)
function U04({
    children: A
}) {
    OZ1();
    let q = Ne(A),
        K = Zc.useRef("");
    if (!q.startsWith(K.current)) K.current = "";
    let Y = K.current.length,
        z = l9.lexer(q.substring(Y)),
        _ = z.length - 1;
    while (_ >= 0 && z[_].type === "space") _--;
    let w = 0;
    for (let H = 0; H < _; H++) w += z[H].raw.length;
    if (w > 0) K.current = q.substring(0, Y + w);
    let O = K.current,
        $ = q.substring(O.length);
    return Zc.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, O && Zc.default.createElement(U_, null, O), $ && Zc.default.createElement(U_, null, $))
}
// @from(Ln 273530, Col 4)
Zc
// @from(Ln 273531, Col 4)
ov = E(() => {
    e6();
    HF6();
    i6();
    CQ6();
    nI();
    JA();
    Q04();
    Zc = t(P6(), 1)
})
// @from(Ln 273542, Col 0)
function d04() {
    let A = A6(1),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = xQ6.createElement(t1, {
        height: 1
    }, xQ6.createElement(CB, null)), A[0] = q;
    else q = A[0];
    return q
}
// @from(Ln 273551, Col 4)
xQ6
// @from(Ln 273552, Col 4)
c04 = E(() => {
    e6();
    MW6();
    iq();
    xQ6 = t(P6(), 1)
})
// @from(Ln 273559, Col 0)
function jZ1(A) {
    let q = A6(3),
        {
            plan: K
        } = A,
        Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = rI.createElement(T, {
        color: "subtle"
    }, "User rejected Claude's plan:"), q[0] = Y;
    else Y = q[0];
    let z;
    if (q[1] !== K) z = rI.createElement(t1, null, rI.createElement(m, {
        flexDirection: "column"
    }, Y, rI.createElement(m, {
        borderStyle: "round",
        borderColor: "planMode",
        paddingX: 1,
        overflow: "hidden"
    }, rI.createElement(U_, null, K)))), q[1] = K, q[2] = z;
    else z = q[2];
    return z
}
// @from(Ln 273581, Col 4)
rI
// @from(Ln 273582, Col 4)
yy8 = E(() => {
    e6();
    i6();
    ov();
    iq();
    rI = t(P6(), 1)
})
// @from(Ln 273590, Col 0)
function l04(A) {
    let q = A6(2),
        {
            feedback: K
        } = A,
        Y;
    if (q[0] !== K) Y = uQ6.createElement(t1, null, uQ6.createElement(T, {
        color: "subtle"
    }, "Tool use rejected with user message: ", K)), q[0] = K, q[1] = Y;
    else Y = q[1];
    return Y
}
// @from(Ln 273602, Col 4)
uQ6
// @from(Ln 273603, Col 4)
i04 = E(() => {
    e6();
    i6();
    iq();
    uQ6 = t(P6(), 1)
})
// @from(Ln 273610, Col 0)
function n04(A) {
    let q = A6(20),
        {
            progressMessagesForMessage: K,
            tool: Y,
            tools: z,
            param: _,
            verbose: w,
            isTranscriptMode: O
        } = A;
    if (typeof _.content === "string" && _.content.includes(P0)) {
        let H;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) H = Tf.createElement(t1, {
            height: 1
        }, Tf.createElement(CB, null)), q[0] = H;
        else H = q[0];
        return H
    }
    if (typeof _.content === "string" && _.content.startsWith(Ly8)) {
        let H;
        if (q[1] !== _.content) H = _.content.substring(Ly8.length), q[1] = _.content, q[2] = H;
        else H = q[2];
        let j = H,
            J;
        if (q[3] !== j) J = Tf.createElement(jZ1, {
            plan: j
        }), q[3] = j, q[4] = J;
        else J = q[4];
        return J
    }
    if (typeof _.content === "string" && _.content.startsWith(mQ6)) {
        let H;
        if (q[5] !== _.content) H = _.content.substring(mQ6.length), q[5] = _.content, q[6] = H;
        else H = q[6];
        let j = H,
            J;
        if (q[7] !== j) J = Tf.createElement(l04, {
            feedback: j
        }), q[7] = j, q[8] = J;
        else J = q[8];
        return J
    }
    if (typeof _.content === "string" && o04(_.content)) {
        let H;
        if (q[9] === Symbol.for("react.memo_cache_sentinel")) H = Tf.createElement(t1, {
            height: 1
        }, Tf.createElement(T, {
            dimColor: !0
        }, "Denied by auto mode classifier ", TE8, " /feedback if incorrect")), q[9] = H;
        else H = q[9];
        return H
    }
    if (!Y) {
        let H;
        if (q[10] !== _.content || q[11] !== w) H = Tf.createElement(eK, {
            result: _.content,
            verbose: w
        }), q[10] = _.content, q[11] = w, q[12] = H;
        else H = q[12];
        return H
    }
    let $;
    if (q[13] !== O || q[14] !== _.content || q[15] !== K || q[16] !== Y || q[17] !== z || q[18] !== w) $ = Y.renderToolUseErrorMessage(_.content, {
        progressMessagesForMessage: ia(K),
        tools: z,
        verbose: w,
        isTranscriptMode: O
    }), q[13] = O, q[14] = _.content, q[15] = K, q[16] = Y, q[17] = z, q[18] = w, q[19] = $;
    else $ = q[19];
    return $
}
// @from(Ln 273681, Col 4)
Tf
// @from(Ln 273682, Col 4)
r04 = E(() => {
    e6();
    JA();
    qw();
    i6();
    MW6();
    iq();
    kO();
    yy8();
    i04();
    Tf = t(P6(), 1)
})
// @from(Ln 273695, Col 0)
function a04(A) {
    let q = A6(13),
        {
            input: K,
            progressMessagesForMessage: Y,
            style: z,
            tool: _,
            tools: w,
            verbose: O,
            isTranscriptMode: $
        } = A,
        {
            columns: H
        } = KA(),
        [j] = z7();
    if (!_) {
        let X;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) X = BQ6.createElement(T3, null), q[0] = X;
        else X = q[0];
        return X
    }
    let J = _.inputSchema,
        M, D;
    if (q[1] !== H || q[2] !== K || q[3] !== $ || q[4] !== Y || q[5] !== z || q[6] !== j || q[7] !== _ || q[8] !== w || q[9] !== O) {
        D = Symbol.for("react.early_return_sentinel");
        A: {
            let X = J.safeParse(K);
            if (!X.success) {
                let P;
                if (q[12] === Symbol.for("react.memo_cache_sentinel")) P = BQ6.createElement(T3, null), q[12] = P;
                else P = q[12];
                D = P;
                break A
            }
            M = _.renderToolUseRejectedMessage(X.data, {
                columns: H,
                messages: [],
                tools: w,
                verbose: O,
                progressMessagesForMessage: ia(Y),
                style: z,
                theme: j,
                isTranscriptMode: $
            })
        }
        q[1] = H, q[2] = K, q[3] = $, q[4] = Y, q[5] = z, q[6] = j, q[7] = _, q[8] = w, q[9] = O, q[10] = M, q[11] = D
    } else M = q[10], D = q[11];
    if (D !== Symbol.for("react.early_return_sentinel")) return D;
    return M
}
// @from(Ln 273745, Col 4)
BQ6
// @from(Ln 273746, Col 4)
s04 = E(() => {
    e6();
    gj();
    _q();
    i6();
    BQ6 = t(P6(), 1)
})
// @from(Ln 273754, Col 0)
function JZ1(A) {
    let q = A6(22),
        {
            hookEvent: K,
            lookups: Y,
            toolUseID: z,
            isTranscriptMode: _
        } = A,
        w;
    if (q[0] !== K || q[1] !== Y.inProgressHookCounts || q[2] !== z) w = Y.inProgressHookCounts.get(z)?.get(K) ?? 0, q[0] = K, q[1] = Y.inProgressHookCounts, q[2] = z, q[3] = w;
    else w = q[3];
    let O = w,
        $ = Y.resolvedHookCounts.get(z)?.get(K) ?? 0;
    if (O === 0) return null;
    if (K === "PreToolUse" || K === "PostToolUse") {
        if (_) {
            let X;
            if (q[4] !== O) X = cj.createElement(T, {
                dimColor: !0
            }, O, " "), q[4] = O, q[5] = X;
            else X = q[5];
            let P;
            if (q[6] !== K) P = cj.createElement(T, {
                dimColor: !0,
                bold: !0
            }, K), q[6] = K, q[7] = P;
            else P = q[7];
            let W = O === 1 ? " hook" : " hooks",
                Z;
            if (q[8] !== W) Z = cj.createElement(T, {
                dimColor: !0
            }, W, " ran"), q[8] = W, q[9] = Z;
            else Z = q[9];
            let G;
            if (q[10] !== X || q[11] !== P || q[12] !== Z) G = cj.createElement(t1, null, cj.createElement(m, {
                flexDirection: "row"
            }, X, P, Z)), q[10] = X, q[11] = P, q[12] = Z, q[13] = G;
            else G = q[13];
            return G
        }
        return null
    }
    if ($ === O) return null;
    let H;
    if (q[14] === Symbol.for("react.memo_cache_sentinel")) H = cj.createElement(T, {
        dimColor: !0
    }, "Running "), q[14] = H;
    else H = q[14];
    let j;
    if (q[15] !== K) j = cj.createElement(T, {
        dimColor: !0,
        bold: !0
    }, K), q[15] = K, q[16] = j;
    else j = q[16];
    let J = O === 1 ? " hook…" : " hooks…",
        M;
    if (q[17] !== J) M = cj.createElement(T, {
        dimColor: !0
    }, J), q[17] = J, q[18] = M;
    else M = q[18];
    let D;
    if (q[19] !== j || q[20] !== M) D = cj.createElement(t1, null, cj.createElement(m, {
        flexDirection: "row"
    }, H, j, M)), q[19] = j, q[20] = M, q[21] = D;
    else D = q[21];
    return D
}
// @from(Ln 273821, Col 4)
cj
// @from(Ln 273822, Col 4)
Ry8 = E(() => {
    e6();
    iq();
    i6();
    cj = t(P6(), 1)
})
// @from(Ln 273828, Col 4)
t04
// @from(Ln 273828, Col 9)
y96
// @from(Ln 273829, Col 4)
MZ1 = E(() => {
    t04 = t(P6(), 1);
    y96 = class y96 extends t04.Component {
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
// @from(Ln 273850, Col 0)
function e04(A) {
    return
}
// @from(Ln 273854, Col 0)
function AW4(A, q) {
    gQ6.set(A, {
        classifier: "auto-mode",
        reason: q
    })
}
// @from(Ln 273861, Col 0)
function qW4(A) {
    let q = gQ6.get(A);
    if (!q || q.classifier !== "auto-mode") return;
    return q.reason
}
// @from(Ln 273867, Col 0)
function Sy8() {
    for (let A of hy8) A()
}
// @from(Ln 273871, Col 0)
function KW4(A) {
    DZ1.add(A), Sy8()
}
// @from(Ln 273875, Col 0)
function L96(A) {
    DZ1.delete(A), Sy8()
}
// @from(Ln 273879, Col 0)
function YW4(A) {
    return hy8.add(A), () => hy8.delete(A)
}
// @from(Ln 273883, Col 0)
function zW4(A) {
    return DZ1.has(A)
}
// @from(Ln 273887, Col 0)
function _W4(A) {
    gQ6.delete(A)
}
// @from(Ln 273891, Col 0)
function wW4() {
    gQ6.clear(), DZ1.clear(), Sy8()
}
// @from(Ln 273894, Col 4)
gQ6
// @from(Ln 273894, Col 9)
DZ1
// @from(Ln 273894, Col 14)
hy8
// @from(Ln 273895, Col 4)
Ve = E(() => {
    gQ6 = new Map, DZ1 = new Set, hy8 = new Set
})
// @from(Ln 273899, Col 0)
function OW4({
    message: A,
    lookups: q,
    toolUseID: K,
    progressMessagesForMessage: Y,
    style: z,
    tool: _,
    tools: w,
    verbose: O,
    width: $,
    isTranscriptMode: H
}) {
    let [j] = z7(), J = M1((W) => W.isBriefOnly), [M] = VX.useState(() => e04(K)), [D] = VX.useState(() => qW4(K));
    if (VX.useEffect(() => {
            _W4(K)
        }, [K]), !A.toolUseResult || !_) return null;
    let X = _.renderToolResultMessage(A.toolUseResult, ia(Y), {
        style: z,
        theme: j,
        tools: w,
        verbose: O,
        isTranscriptMode: H,
        isBriefOnly: J,
        timestamp: A.timestamp
    });
    if (X === null) return null;
    let P = _.userFacingName(void 0) === "";
    return VX.createElement(m, {
        flexDirection: "column"
    }, VX.createElement(m, {
        flexDirection: "column",
        width: P ? void 0 : $
    }, X, null, D && VX.createElement(t1, {
        height: 1
    }, VX.createElement(T, {
        dimColor: !0
    }, "Allowed by auto mode classifier"))), VX.createElement(y96, null, VX.createElement(JZ1, {
        hookEvent: "PostToolUse",
        lookups: q,
        toolUseID: K,
        verbose: O,
        isTranscriptMode: H
    })))
}
// @from(Ln 273943, Col 4)
VX
// @from(Ln 273944, Col 4)
$W4 = E(() => {
    i6();
    Ry8();
    MZ1();
    Ve();
    iq();
    NA();
    VX = t(P6(), 1)
})
// @from(Ln 273954, Col 0)
function HW4(A, q, K) {
    let Y = A6(7),
        z;
    if (Y[0] !== K.toolUseByToolUseID || Y[1] !== A || Y[2] !== q) {
        A: {
            let _ = K.toolUseByToolUseID.get(A);
            if (!_) {
                z = null;
                break A
            }
            let w = dK(q, _.name);
            if (!w) {
                z = null;
                break A
            }
            let O;
            if (Y[4] !== w || Y[5] !== _) O = {
                tool: w,
                toolUse: _
            },
            Y[4] = w,
            Y[5] = _,
            Y[6] = O;
            else O = Y[6];z = O
        }
        Y[0] = K.toolUseByToolUseID,
        Y[1] = A,
        Y[2] = q,
        Y[3] = z
    }
    else z = Y[3];
    return z
}
// @from(Ln 273987, Col 4)
jW4 = E(() => {
    e6()
})
// @from(Ln 273991, Col 0)
function JW4(A) {
    let q = A6(28),
        {
            param: K,
            message: Y,
            lookups: z,
            progressMessagesForMessage: _,
            style: w,
            tools: O,
            verbose: $,
            width: H,
            isTranscriptMode: j
        } = A,
        J = HW4(K.tool_use_id, O, z);
    if (!J) return null;
    if (typeof K.content === "string" && K.content.startsWith(R96)) {
        let D;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) D = Gc.createElement(d04, null), q[0] = D;
        else D = q[0];
        return D
    }
    if (typeof K.content === "string" && K.content.startsWith(h96) || K.content === P0) {
        let D = J.toolUse.input,
            X;
        if (q[1] !== j || q[2] !== z || q[3] !== _ || q[4] !== w || q[5] !== D || q[6] !== J.tool || q[7] !== O || q[8] !== $) X = Gc.createElement(a04, {
            input: D,
            progressMessagesForMessage: _,
            tool: J.tool,
            tools: O,
            lookups: z,
            style: w,
            verbose: $,
            isTranscriptMode: j
        }), q[1] = j, q[2] = z, q[3] = _, q[4] = w, q[5] = D, q[6] = J.tool, q[7] = O, q[8] = $, q[9] = X;
        else X = q[9];
        return X
    }
    if (K.is_error) {
        let D;
        if (q[10] !== j || q[11] !== K || q[12] !== _ || q[13] !== J.tool || q[14] !== O || q[15] !== $) D = Gc.createElement(n04, {
            progressMessagesForMessage: _,
            tool: J.tool,
            tools: O,
            param: K,
            verbose: $,
            isTranscriptMode: j
        }), q[10] = j, q[11] = K, q[12] = _, q[13] = J.tool, q[14] = O, q[15] = $, q[16] = D;
        else D = q[16];
        return D
    }
    let M;
    if (q[17] !== j || q[18] !== z || q[19] !== Y || q[20] !== _ || q[21] !== w || q[22] !== J.tool || q[23] !== J.toolUse.id || q[24] !== O || q[25] !== $ || q[26] !== H) M = Gc.createElement(OW4, {
        message: Y,
        lookups: z,
        toolUseID: J.toolUse.id,
        progressMessagesForMessage: _,
        style: w,
        tool: J.tool,
        tools: O,
        verbose: $,
        width: H,
        isTranscriptMode: j
    }), q[17] = j, q[18] = z, q[19] = Y, q[20] = _, q[21] = w, q[22] = J.tool, q[23] = J.toolUse.id, q[24] = O, q[25] = $, q[26] = H, q[27] = M;
    else M = q[27];
    return M
}
// @from(Ln 274057, Col 4)
Gc
// @from(Ln 274058, Col 4)
MW4 = E(() => {
    e6();
    JA();
    c04();
    r04();
    s04();
    $W4();
    jW4();
    Gc = t(P6(), 1)
})
// @from(Ln 274069, Col 0)
function XW4(A) {
    let q = p_(),
        [K, Y] = gJ(A && q ? DW4 : null);
    if (!A || !q) return [K, !0];
    let z = Math.floor(Y / DW4) % 2 === 0;
    return [K, z]
}
// @from(Ln 274076, Col 4)
DW4 = 600
// @from(Ln 274077, Col 4)
PW4 = E(() => {
    i6()
})
// @from(Ln 274081, Col 0)
function S96(A) {
    let q = A6(7),
        {
            isError: K,
            isUnresolved: Y,
            shouldAnimate: z
        } = A,
        [_, w] = XW4(z),
        O = Y ? void 0 : K ? "error" : "success",
        $ = !z || w || K || !Y ? I3 : " ",
        H;
    if (q[0] !== O || q[1] !== Y || q[2] !== $) H = Iy8.default.createElement(T, {
        color: O,
        dimColor: Y
    }, $), q[0] = O, q[1] = Y, q[2] = $, q[3] = H;
    else H = q[3];
    let j;
    if (q[4] !== _ || q[5] !== H) j = Iy8.default.createElement(m, {
        ref: _,
        minWidth: 2
    }, H), q[4] = _, q[5] = H, q[6] = j;
    else j = q[6];
    return j
}
// @from(Ln 274105, Col 4)
Iy8
// @from(Ln 274106, Col 4)
XZ1 = E(() => {
    e6();
    i6();
    qw();
    PW4();
    Iy8 = t(P6(), 1)
})
// @from(Ln 274114, Col 0)
function ZW4(A) {
    return WW4.useSyncExternalStore(YW4, () => zW4(A))
}
// @from(Ln 274117, Col 4)
WW4
// @from(Ln 274118, Col 4)
GW4 = E(() => {
    Ve();
    WW4 = t(P6(), 1)
})
// @from(Ln 274123, Col 0)
function fW4(A) {
    let q = A6(69),
        {
            param: K,
            addMargin: Y,
            tools: z,
            commands: _,
            verbose: w,
            inProgressToolUseIDs: O,
            progressMessagesForMessage: $,
            shouldAnimate: H,
            shouldShowDot: j,
            inProgressToolCallCount: J,
            lookups: M,
            isTranscriptMode: D
        } = A,
        X = KA(),
        [P] = z7(),
        W = FQ6(Le9),
        Z = ZW4(K.id),
        G = FQ6(ye9),
        f = FQ6(Ee9),
        v = G === "auto" || f === "auto",
        N = !1,
        V;
    if (q[0] !== K.input || q[1] !== K.name || q[2] !== z) {
        A: {
            if (!z) {
                V = null;
                break A
            }
            let a = dK(z, K.name);
            if (!a) {
                V = null;
                break A
            }
            let i = a.inputSchema.safeParse(K.input),
                l = i.success ? i.data : void 0;V = {
                tool: a,
                input: i,
                userFacingToolName: a.userFacingName(l),
                userFacingToolNameBackgroundColor: a.userFacingNameBackgroundColor?.(l)
            }
        }
        q[0] = K.input,
        q[1] = K.name,
        q[2] = z,
        q[3] = V
    }
    else V = q[3];
    let L = V;
    if (!L) return _6(Error(z ? `Tool ${K.name} not found` : `Tools array is undefined for tool ${K.name}`)), null;
    let {
        tool: h,
        input: R,
        userFacingToolName: u,
        userFacingToolNameBackgroundColor: I
    } = L, g;
    if (q[4] !== M.resolvedToolUseIDs || q[5] !== K.id) g = M.resolvedToolUseIDs.has(K.id), q[4] = M.resolvedToolUseIDs, q[5] = K.id, q[6] = g;
    else g = q[6];
    let B = g,
        b;
    if (q[7] !== O || q[8] !== B || q[9] !== K.id) b = !O.has(K.id) && !B, q[7] = O, q[8] = B, q[9] = K.id, q[10] = b;
    else b = q[10];
    let p = b,
        Q = W?.toolUseId === K.id;
    if (u === "") return null;
    let U;
    if (q[11] !== _ || q[12] !== R.data || q[13] !== R.success || q[14] !== P || q[15] !== h || q[16] !== w) U = R.success ? Re9(h, R.data, {
        theme: P,
        verbose: w,
        commands: _
    }) : null, q[11] = _, q[12] = R.data, q[13] = R.success, q[14] = P, q[15] = h, q[16] = w, q[17] = U;
    else U = q[17];
    let r = U;
    if (r === null) return null;
    let e = Y ? 1 : 0,
        Y6 = f8(u) + (j ? 2 : 0),
        H6;
    if (q[18] !== p || q[19] !== B || q[20] !== M.erroredToolUseIDs || q[21] !== K.id || q[22] !== H || q[23] !== j) H6 = j && (p ? lj.default.createElement(m, {
        minWidth: 2
    }, lj.default.createElement(T, {
        dimColor: p
    }, I3)) : lj.default.createElement(S96, {
        shouldAnimate: H,
        isUnresolved: !B,
        isError: M.erroredToolUseIDs.has(K.id)
    })), q[18] = p, q[19] = B, q[20] = M.erroredToolUseIDs, q[21] = K.id, q[22] = H, q[23] = j, q[24] = H6;
    else H6 = q[24];
    let J6 = I ? "inverseText" : void 0,
        K6;
    if (q[25] !== J6 || q[26] !== u || q[27] !== I) K6 = lj.default.createElement(m, {
        flexShrink: 0
    }, lj.default.createElement(T, {
        bold: !0,
        wrap: "truncate-end",
        backgroundColor: I,
        color: J6
    }, u)), q[25] = J6, q[26] = u, q[27] = I, q[28] = K6;
    else K6 = q[28];
    let s;
    if (q[29] !== K.id || q[30] !== r || q[31] !== w) s = r !== "" && lj.default.createElement(m, {
        flexWrap: "nowrap"
    }, lj.default.createElement(T, null, "(", lj.default.createElement(Ce9, {
        toolUseId: K.id,
        verbose: w,
        fallback: r
    }), ")")), q[29] = K.id, q[30] = r, q[31] = w, q[32] = s;
    else s = q[32];
    let X6;
    if (q[33] !== R.data || q[34] !== R.success || q[35] !== h) X6 = R.success && h.renderToolUseTag && h.renderToolUseTag(R.data), q[33] = R.data, q[34] = R.success, q[35] = h, q[36] = X6;
    else X6 = q[36];
    let z6;
    if (q[37] !== s || q[38] !== X6 || q[39] !== Y6 || q[40] !== H6 || q[41] !== K6) z6 = lj.default.createElement(m, {
        flexDirection: "row",
        flexWrap: "nowrap",
        minWidth: Y6
    }, H6, K6, s, X6), q[37] = s, q[38] = X6, q[39] = Y6, q[40] = H6, q[41] = K6, q[42] = z6;
    else z6 = q[42];
    let N6;
    if (q[43] !== J || q[44] !== v || q[45] !== !1 || q[46] !== p || q[47] !== B || q[48] !== D || q[49] !== Q || q[50] !== M || q[51] !== K.id || q[52] !== $ || q[53] !== X || q[54] !== h || q[55] !== z || q[56] !== w) N6 = !B && !p && (Q ? lj.default.createElement(t1, {
        height: 1
    }, lj.default.createElement(T, {
        dimColor: !0
    }, "Waiting for permission…")) : he9(h, z, M, K.id, $, {
        verbose: w,
        inProgressToolCallCount: J,
        isTranscriptMode: D
    }, X)), q[43] = J, q[44] = v, q[45] = !1, q[46] = p, q[47] = B, q[48] = D, q[49] = Q, q[50] = M, q[51] = K.id, q[52] = $, q[53] = X, q[54] = h, q[55] = z, q[56] = w, q[57] = N6;
    else N6 = q[57];
    let $6;
    if (q[58] !== p || q[59] !== B || q[60] !== h) $6 = !B && p && Se9(h), q[58] = p, q[59] = B, q[60] = h, q[61] = $6;
    else $6 = q[61];
    let n;
    if (q[62] !== z6 || q[63] !== N6 || q[64] !== $6) n = lj.default.createElement(m, {
        flexDirection: "column"
    }, z6, N6, $6), q[62] = z6, q[63] = N6, q[64] = $6, q[65] = n;
    else n = q[65];
    let o;
    if (q[66] !== n || q[67] !== e) o = lj.default.createElement(m, {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: e,
        width: "100%"
    }, n), q[66] = n, q[67] = e, q[68] = o;
    else o = q[68];
    return o
}
// @from(Ln 274272, Col 0)
function Ee9(A) {
    return A.toolPermissionContext.prePlanMode
}
// @from(Ln 274276, Col 0)
function ye9(A) {
    return A.toolPermissionContext.mode
}
// @from(Ln 274280, Col 0)
function Le9(A) {
    return A.pendingWorkerRequest
}
// @from(Ln 274284, Col 0)
function Re9(A, q, {
    theme: K,
    verbose: Y,
    commands: z
}) {
    try {
        let _ = A.inputSchema.safeParse(q);
        if (!_.success) return "";
        return A.renderToolUseMessage(_.data, {
            theme: K,
            verbose: Y,
            commands: z
        })
    } catch (_) {
        return _6(Error(`Error rendering tool use message for ${A.name}: ${_}`)), ""
    }
}
// @from(Ln 274302, Col 0)
function he9(A, q, K, Y, z, {
    verbose: _,
    inProgressToolCallCount: w,
    isTranscriptMode: O
}, $) {
    let H = z.filter((j) => j.data.type !== "hook_progress");
    try {
        let j = A.renderToolUseProgressMessage(H, {
            tools: q,
            verbose: _,
            terminalSize: $,
            inProgressToolCallCount: w ?? 1,
            isTranscriptMode: O
        });
        return lj.default.createElement(lj.default.Fragment, null, lj.default.createElement(y96, null, lj.default.createElement(JZ1, {
            hookEvent: "PreToolUse",
            lookups: K,
            toolUseID: Y,
            verbose: _,
            isTranscriptMode: O
        })), j)
    } catch (j) {
        return _6(Error(`Error rendering tool use progress message for ${A.name}: ${j}`)), null
    }
}
// @from(Ln 274328, Col 0)
function Se9(A) {
    try {
        return A.renderToolUseQueuedMessage?.()
    } catch (q) {
        return _6(Error(`Error rendering tool use queued message for ${A.name}: ${q}`)), null
    }
}
// @from(Ln 274336, Col 0)
function Ce9(A) {
    let q = A6(6),
        {
            toolUseId: K,
            verbose: Y,
            fallback: z
        } = A,
        _;
    if (q[0] !== K) _ = ($) => $.computerActionLabels?.[K], q[0] = K, q[1] = _;
    else _ = q[1];
    let w = FQ6(_);
    if (!w) return z;
    let O;
    if (q[2] !== w || q[3] !== z || q[4] !== Y) O = Y ? lj.default.createElement(lj.default.Fragment, null, z, lj.default.createElement(T, null, " ", "·", " "), w) : w, q[2] = w, q[3] = z, q[4] = Y, q[5] = O;
    else O = q[5];
    return O
}
// @from(Ln 274353, Col 4)
lj
// @from(Ln 274354, Col 4)
TW4 = E(() => {
    e6();
    i6();
    q3();
    k1();
    XZ1();
    qw();
    _q();
    Ry8();
    MZ1();
    NA();
    iq();
    GW4();
    lj = t(P6(), 1)
})
// @from(Ln 274370, Col 0)
function vW4() {
    let A = X1().cachedExtraUsageDisabledReason;
    if (A === void 0) return !1;
    if (A === null) return !0;
    switch (A) {
        case "out_of_credits":
            return !0;
        case "overage_not_provisioned":
        case "org_level_disabled":
        case "org_level_disabled_until":
        case "seat_tier_level_disabled":
        case "member_level_disabled":
        case "seat_tier_zero_credit_limit":
        case "group_zero_credit_limit":
        case "member_zero_credit_limit":
        case "org_service_level_disabled":
        case "org_service_zero_credit_limit":
        case "no_limits_configured":
        case "unknown":
            return !1;
        default:
            return !1
    }
}
// @from(Ln 274395, Col 0)
function fc() {
    if (ke()) return !1;
    if (iA()) return vW4();
    return !0
}
// @from(Ln 274401, Col 0)
function Tc() {
    if (ke()) return !1;
    if (iA()) return vW4();
    return !0
}
// @from(Ln 274406, Col 4)
PZ1 = E(() => {
    fA();
    k8();
    xJ()
})
// @from(Ln 274412, Col 0)
function Ie9() {
    let A = uR();
    if (A === "opus" && fc()) return {
        alias: "opus[1m]",
        name: "Opus 1M",
        multiplier: 5
    };
    else if (A === "sonnet" && Tc()) return {
        alias: "sonnet[1m]",
        name: "Sonnet 1M",
        multiplier: 5
    };
    return null
}
// @from(Ln 274427, Col 0)
function LZ6(A) {
    let q = Ie9();
    if (!q) return null;
    switch (A) {
        case "warning":
            return `/model ${q.alias}`;
        case "tip":
            return `Tip: You have access to ${q.name} with ${q.multiplier}x more context`;
        default:
            return null
    }
}
// @from(Ln 274439, Col 4)
WZ1 = E(() => {
    PZ1();
    z4()
})
// @from(Ln 274443, Col 0)
async function xe9() {
    let A = y8(),
        q = be9[A];
    for (let K of q) try {
        let Y = K.split(" ")[0];
        return await q9(A === "windows" ? "where" : "which", [Y], {
            timeout: 1000,
            reject: !0
        }), K
    } catch {
        continue
    }
    return null
}
// @from(Ln 274457, Col 0)
async function NW4() {
    if (!process.stdout.isTTY) return !1;
    try {
        if ((await q9("tput", ["Ms"], {
                timeout: 1000,
                reject: !0
            })).stdout.includes("]52")) return !0
    } catch {}
    let A = ["ITERM_SESSION_ID", "WT_SESSION", "KONSOLE_VERSION"];
    for (let q of A)
        if (process.env[q]) return !0;
    return !1
}
// @from(Ln 274470, Col 0)
async function ue9() {
    if (oI !== null) return oI;
    let A = !!(process.env.SSH_CLIENT || process.env.SSH_TTY),
        q = await NW4(),
        K = await xe9();
    ZZ1 = K;
    let Y = K !== null;
    if (A && q) oI = "osc52";
    else if (A && Y) oI = "native";
    else if (A && process.stdout.isTTY) oI = "osc52";
    else if (!A && Y) oI = "native";
    else if (q) oI = "osc52";
    else oI = "none";
    return oI
}
// @from(Ln 274486, Col 0)
function me9(A) {
    if (process.env.TMUX) return `\x1BPtmux;${A.replaceAll("\x1B","\x1B\x1B")}\x1B\\`;
    if (process.env.STY) return `\x1BP${A}\x1B\\`;
    return A
}
// @from(Ln 274491, Col 0)
async function Be9(A) {
    if (!process.stdout.isTTY) return !1;
    try {
        let K = `\x1B]52;c;${Buffer.from(A).toString("base64")}\x07`,
            Y = me9(K),
            {
                promise: z,
                resolve: _,
                reject: w
            } = Promise.withResolvers();
        return process.stdout.write(Y, (O) => O ? w(O) : _()), await z, !0
    } catch (q) {
        return _6(Error(`Failed to copy via OSC52: ${q}`)), oI = ZZ1 ? "native" : "none", !1
    }
}
// @from(Ln 274506, Col 0)
async function ge9(A, q) {
    try {
        return await q9(q, {
            input: A,
            shell: !0,
            reject: !0
        }), !0
    } catch (K) {
        return _6(Error(`Failed to execute clipboard command "${q}": ${K}`)), oI = await NW4() ? "osc52" : "none", !1
    }
}
// @from(Ln 274517, Col 0)
async function ZZ(A) {
    switch (await ue9()) {
        case "osc52":
            return Be9(A);
        case "native":
            if (ZZ1) return ge9(A, ZZ1);
            return !1;
        case "none":
            return _6(Error("No clipboard method available")), !1
    }
}
// @from(Ln 274529, Col 0)
function C96() {
    let A = y8();
    if (!!(process.env.SSH_CLIENT || process.env.SSH_TTY)) return "Failed to copy to clipboard. Over SSH, clipboard access requires a terminal that supports OSC52 (iTerm2, Kitty, Ghostty, WezTerm, Alacritty, etc.). If using tmux, ensure `set-clipboard` is enabled and `allow-passthrough` is on.";
    return {
        macos: "Failed to copy to clipboard. Make sure the `pbcopy` command is available on your system and try again.",
        windows: "Failed to copy to clipboard. Make sure `powershell` or `clip` is available on your system and try again.",
        wsl: "Failed to copy to clipboard. Make sure `powershell.exe` or `clip.exe` is available in your WSL environment and try again.",
        linux: "Failed to copy to clipboard. Make sure `xclip` or `wl-copy` is installed on your system and try again.",
        unknown: "Failed to copy to clipboard. Make sure `xclip` or `wl-copy` is installed on your system and try again."
    } [A]
}
// @from(Ln 274540, Col 4)
be9
// @from(Ln 274540, Col 9)
oI = null
// @from(Ln 274541, Col 4)
ZZ1 = null
// @from(Ln 274542, Col 4)
vc = E(() => {
    WW();
    k1();
    YK();
    be9 = {
        macos: ["pbcopy"],
        linux: ["xclip -selection clipboard", "wl-copy"],
        wsl: ["powershell.exe -NoProfile -Command '[Console]::InputEncoding=[Text.Encoding]::UTF8;Set-Clipboard([Console]::In.ReadToEnd())'", "clip.exe"],
        windows: ['powershell -NoProfile -Command "[Console]::InputEncoding=[Text.Encoding]::UTF8;Set-Clipboard([Console]::In.ReadToEnd())"', "clip"],
        unknown: ["xclip -selection clipboard", "wl-copy"]
    }
})
// @from(Ln 274555, Col 0)
function Fe9(A) {
    let q;
    try {
        q = new URL(A)
    } catch (K) {
        throw Error(`Invalid URL format: ${A}`)
    }
    if (q.protocol !== "http:" && q.protocol !== "https:") throw Error(`Invalid URL protocol: must use http:// or https://, got ${q.protocol}`)
}
// @from(Ln 274564, Col 0)
async function VW4(A) {
    try {
        let q = process.platform;
        if (q === "win32") {
            let {
                code: z
            } = await z8("explorer", [A]);
            return z === 0
        }
        let K = q === "darwin" ? "open" : "xdg-open",
            {
                code: Y
            } = await z8(K, [A]);
        return Y === 0
    } catch (q) {
        return !1
    }
}
// @from(Ln 274582, Col 0)
async function R9(A) {
    try {
        Fe9(A);
        let q = process.env.BROWSER,
            K = process.platform;
        if (K === "win32") {
            if (q) {
                let {
                    code: z
                } = await z8(q, [`"${A}"`]);
                return z === 0
            }
            let {
                code: Y
            } = await z8("rundll32", ["url,OpenURL", A], {});
            return Y === 0
        } else {
            let Y = q || (K === "darwin" ? "open" : "xdg-open"),
                {
                    code: z
                } = await z8(Y, [A]);
            return z === 0
        }
    } catch (q) {
        return !1
    }
}
// @from(Ln 274609, Col 4)
kX = E(() => {
    Eq()
})
// @from(Ln 274612, Col 0)
async function kW4() {
    let q = X1().oauthAccount?.accountUuid,
        K = RV();
    if (!q || !K) return;
    let Y = `${P7().BASE_API_URL}/api/claude_cli_profile`;
    try {
        return (await X8.get(Y, {
            headers: {
                "x-api-key": K,
                "anthropic-beta": DP
            },
            params: {
                account_uuid: q
            },
            timeout: 1e4
        })).data
    } catch (z) {
        _6(z)
    }
}
// @from(Ln 274632, Col 0)
async function Kg(A) {
    let q = `${P7().BASE_API_URL}/api/oauth/profile`;
    try {
        return (await X8.get(q, {
            headers: {
                Authorization: `Bearer ${A}`,
                "Content-Type": "application/json"
            },
            timeout: 1e4
        })).data
    } catch (K) {
        _6(K)
    }
}
// @from(Ln 274646, Col 4)
RZ6 = E(() => {
    kK();
    F5();
    fA();
    k8();
    k1()
})
// @from(Ln 274653, Col 4)
SZ6 = {}
// @from(Ln 274669, Col 0)
function aI(A) {
    return Boolean(A?.includes(ZV))
}
// @from(Ln 274673, Col 0)
function pQ6(A) {
    return A?.split(" ").filter(Boolean) ?? []
}
// @from(Ln 274677, Col 0)
function GZ1({
    codeChallenge: A,
    state: q,
    port: K,
    isManual: Y,
    loginWithClaudeAi: z,
    inferenceOnly: _,
    orgUUID: w,
    loginHint: O,
    loginMethod: $
}) {
    let H = z ? P7().CLAUDE_AI_AUTHORIZE_URL : P7().CONSOLE_AUTHORIZE_URL,
        j = new URL(H);
    j.searchParams.append("code", "true"), j.searchParams.append("client_id", P7().CLIENT_ID), j.searchParams.append("response_type", "code"), j.searchParams.append("redirect_uri", Y ? P7().MANUAL_REDIRECT_URL : `http://localhost:${K}/callback`);
    let J = _ ? [ZV] : ed1;
    if (j.searchParams.append("scope", J.join(" ")), j.searchParams.append("code_challenge", A), j.searchParams.append("code_challenge_method", "S256"), j.searchParams.append("state", q), w) j.searchParams.append("orgUUID", w);
    if (O) j.searchParams.append("login_hint", O);
    if ($) j.searchParams.append("login_method", $);
    return j.toString()
}
// @from(Ln 274697, Col 0)
async function by8(A, q, K, Y, z = !1, _) {
    let w = {
        grant_type: "authorization_code",
        code: A,
        redirect_uri: z ? P7().MANUAL_REDIRECT_URL : `http://localhost:${Y}/callback`,
        client_id: P7().CLIENT_ID,
        code_verifier: K,
        state: q
    };
    if (_ !== void 0) w.expires_in = _;
    let O = await X8.post(P7().TOKEN_URL, w, {
        headers: {
            "Content-Type": "application/json"
        },
        timeout: 15000
    });
    if (O.status !== 200) throw Error(O.status === 401 ? "Authentication failed: Invalid authorization code" : `Token exchange failed (${O.status}): ${O.statusText}`);
    return d("tengu_oauth_token_exchange_success", {}), O.data
}
// @from(Ln 274716, Col 0)
async function QQ6(A, {
    scopes: q
} = {}) {
    let K = {
        grant_type: "refresh_token",
        refresh_token: A,
        client_id: P7().CLIENT_ID,
        scope: ((q?.length) ? q : U11).join(" ")
    };
    try {
        let Y = await X8.post(P7().TOKEN_URL, K, {
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 15000
        });
        if (Y.status !== 200) throw Error(`Token refresh failed: ${Y.statusText}`);
        let z = Y.data,
            {
                access_token: _,
                refresh_token: w = A,
                expires_in: O
            } = z,
            $ = Date.now() + O * 1000,
            H = pQ6(z.scope);
        d("tengu_oauth_token_refresh_success", {});
        let j = X1(),
            J = sA(),
            D = j.oauthAccount?.billingType !== void 0 && j.oauthAccount?.accountCreatedAt !== void 0 && j.oauthAccount?.subscriptionCreatedAt !== void 0 && J?.subscriptionType != null && J?.rateLimitTier != null ? null : await fZ1(_);
        if (D && j.oauthAccount) {
            let X = {};
            if (D.displayName !== void 0) X.displayName = D.displayName;
            if (typeof D.hasExtraUsageEnabled === "boolean") X.hasExtraUsageEnabled = D.hasExtraUsageEnabled;
            if (D.billingType !== null) X.billingType = D.billingType;
            if (D.accountCreatedAt !== void 0) X.accountCreatedAt = D.accountCreatedAt;
            if (D.subscriptionCreatedAt !== void 0) X.subscriptionCreatedAt = D.subscriptionCreatedAt;
            if (Object.keys(X).length > 0) d1((P) => ({
                ...P,
                oauthAccount: P.oauthAccount ? {
                    ...P.oauthAccount,
                    ...X
                } : P.oauthAccount
            }))
        }
        return {
            accessToken: _,
            refreshToken: w,
            expiresAt: $,
            scopes: H,
            subscriptionType: D?.subscriptionType ?? J?.subscriptionType ?? null,
            rateLimitTier: D?.rateLimitTier ?? J?.rateLimitTier ?? null,
            profile: D?.rawProfile,
            tokenAccount: z.account ? {
                uuid: z.account.uuid,
                emailAddress: z.account.email_address,
                organizationUuid: z.organization?.uuid
            } : void 0
        }
    } catch (Y) {
        let z = X8.isAxiosError(Y) && Y.response?.data ? JSON.stringify(Y.response.data) : void 0;
        throw d("tengu_oauth_token_refresh_failure", {
            error: Y.message,
            ...z && {
                responseBody: z
            }
        }), Y
    }
}
// @from(Ln 274784, Col 0)
async function xy8(A) {
    let q = await X8.get(P7().ROLES_URL, {
        headers: {
            Authorization: `Bearer ${A}`
        }
    });
    if (q.status !== 200) throw Error(`Failed to fetch user roles: ${q.statusText}`);
    let K = q.data;
    if (!X1().oauthAccount) throw Error("OAuth account information not found in config");
    d1((z) => ({
        ...z,
        oauthAccount: z.oauthAccount ? {
            ...z.oauthAccount,
            organizationRole: K.organization_role,
            workspaceRole: K.workspace_role,
            organizationName: K.organization_name
        } : z.oauthAccount
    })), d("tengu_oauth_roles_stored", {
        org_role: K.organization_role
    })
}
// @from(Ln 274805, Col 0)
async function uy8(A) {
    try {
        let q = await X8.post(P7().API_KEY_URL, null, {
                headers: {
                    Authorization: `Bearer ${A}`
                }
            }),
            K = q.data?.raw_key;
        if (K) return await By8(K), d("tengu_oauth_api_key", {
            status: "success",
            statusCode: q.status
        }), K;
        return null
    } catch (q) {
        throw d("tengu_oauth_api_key", {
            status: "failure",
            error: q instanceof Error ? q.message : String(q)
        }), q
    }
}
// @from(Ln 274826, Col 0)
function Yg(A) {
    if (A === null) return !1;
    let q = 300000;
    return Date.now() + q >= A
}
// @from(Ln 274831, Col 0)
async function fZ1(A) {
    let q = await Kg(A),
        K = q?.organization?.organization_type,
        Y = null;
    switch (K) {
        case "claude_max":
            Y = "max";
            break;
        case "claude_pro":
            Y = "pro";
            break;
        case "claude_enterprise":
            Y = "enterprise";
            break;
        case "claude_team":
            Y = "team";
            break;
        default:
            Y = null;
            break
    }
    let z = {
        subscriptionType: Y,
        rateLimitTier: q?.organization?.rate_limit_tier ?? null,
        hasExtraUsageEnabled: q?.organization?.has_extra_usage_enabled ?? null,
        billingType: q?.organization?.billing_type ?? null
    };
    if (q?.account?.display_name) z.displayName = q.account.display_name;
    if (q?.account?.created_at) z.accountCreatedAt = q.account.created_at;
    if (q?.organization?.subscription_created_at) z.subscriptionCreatedAt = q.organization.subscription_created_at;
    return d("tengu_oauth_profile_fetch_success", {}), {
        ...z,
        rawProfile: q
    }
}
// @from(Ln 274866, Col 0)
async function mR() {
    let q = X1().oauthAccount?.organizationUuid;
    if (q) return q;
    let K = sA()?.accessToken;
    if (K === void 0 || !XG()) return null;
    let z = (await Kg(K))?.organization?.uuid;
    if (!z) return null;
    return z
}
// @from(Ln 274875, Col 0)
async function my8() {
    let A = process.env.CLAUDE_CODE_ACCOUNT_UUID,
        q = process.env.CLAUDE_CODE_USER_EMAIL,
        K = process.env.CLAUDE_CODE_ORGANIZATION_UUID,
        Y = Boolean(A && q && K);
    if (A && q && K) {
        if (!X1().oauthAccount) hZ6({
            accountUuid: A,
            emailAddress: q,
            organizationUuid: K
        })
    }
    await dz();
    let z = X1();
    if (z.oauthAccount && z.oauthAccount.billingType !== void 0 && z.oauthAccount.accountCreatedAt !== void 0 && z.oauthAccount.subscriptionCreatedAt !== void 0 || !iA() || !XG()) return !1;
    let _ = sA();
    if (_?.accessToken) {
        let w = await Kg(_.accessToken);
        if (w) {
            if (Y) k("OAuth profile fetch succeeded, overriding env var account info", {
                level: "info"
            });
            return hZ6({
                accountUuid: w.account.uuid,
                emailAddress: w.account.email,
                organizationUuid: w.organization.uuid,
                displayName: w.account.display_name || void 0,
                hasExtraUsageEnabled: w.organization.has_extra_usage_enabled ?? !1,
                billingType: w.organization.billing_type ?? void 0,
                accountCreatedAt: w.account.created_at,
                subscriptionCreatedAt: w.organization.subscription_created_at ?? void 0
            }), !0
        }
    }
    return !1
}
// @from(Ln 274912, Col 0)
function hZ6({
    accountUuid: A,
    emailAddress: q,
    organizationUuid: K,
    displayName: Y,
    hasExtraUsageEnabled: z,
    billingType: _,
    accountCreatedAt: w,
    subscriptionCreatedAt: O
}) {
    let $ = {
        accountUuid: A,
        emailAddress: q,
        organizationUuid: K,
        hasExtraUsageEnabled: z,
        billingType: _,
        accountCreatedAt: w,
        subscriptionCreatedAt: O
    };
    if (Y) $.displayName = Y;
    d1((H) => {
        if (H.oauthAccount?.accountUuid === $.accountUuid && H.oauthAccount?.emailAddress === $.emailAddress && H.oauthAccount?.organizationUuid === $.organizationUuid && H.oauthAccount?.displayName === $.displayName && H.oauthAccount?.hasExtraUsageEnabled === $.hasExtraUsageEnabled && H.oauthAccount?.billingType === $.billingType && H.oauthAccount?.accountCreatedAt === $.accountCreatedAt && H.oauthAccount?.subscriptionCreatedAt === $.subscriptionCreatedAt) return H;
        return {
            ...H,
            oauthAccount: $
        }
    })
}
// @from(Ln 274940, Col 4)
W0 = E(() => {
    kK();
    F5();
    V1();
    k8();
    fA();
    RZ6();
    H1()
})
// @from(Ln 274950, Col 0)
class gy8 {
    localServer;
    port = 0;
    promiseResolver = null;
    promiseRejecter = null;
    expectedState = null;
    pendingResponse = null;
    callbackPath;
    constructor(A = "/callback") {
        this.localServer = EW4.createServer(), this.callbackPath = A
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
            q(this.pendingResponse, A), this.pendingResponse = null, d("tengu_oauth_automatic_redirect", {
                custom_handler: !0
            });
            return
        }
        let K = aI(A) ? P7().CLAUDEAI_SUCCESS_URL : P7().CONSOLE_SUCCESS_URL;
        this.pendingResponse.writeHead(302, {
            Location: K
        }), this.pendingResponse.end(), this.pendingResponse = null, d("tengu_oauth_automatic_redirect", {})
    }
    handleErrorRedirect() {
        if (!this.pendingResponse) return;
        let A = P7().CLAUDEAI_SUCCESS_URL;
        this.pendingResponse.writeHead(302, {
            Location: A
        }), this.pendingResponse.end(), this.pendingResponse = null, d("tengu_oauth_automatic_redirect_error", {})
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
        _6(A), this.close(), this.reject(A)
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
// @from(Ln 275040, Col 4)
yW4 = E(() => {
    F5();
    k1();
    V1();
    W0()
})
// @from(Ln 275048, Col 0)
function Fy8(A) {
    return A.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}
// @from(Ln 275052, Col 0)
function LW4() {
    return Fy8(UQ6.randomBytes(32))
}
// @from(Ln 275056, Col 0)
function RW4(A) {
    let q = UQ6.createHash("sha256");
    return q.update(A), Fy8(q.digest())
}
// @from(Ln 275061, Col 0)
function hW4() {
    return Fy8(UQ6.randomBytes(32))
}
// @from(Ln 275064, Col 4)
SW4 = () => {}
// @from(Ln 275065, Col 0)
class I96 {
    codeVerifier;
    authCodeListener = null;
    port = null;
    manualAuthCodeResolver = null;
    constructor() {
        this.codeVerifier = LW4()
    }
    async startOAuthFlow(A, q) {
        this.authCodeListener = new gy8, this.port = await this.authCodeListener.start();
        let K = RW4(this.codeVerifier),
            Y = hW4(),
            z = {
                codeChallenge: K,
                state: Y,
                port: this.port,
                loginWithClaudeAi: q?.loginWithClaudeAi,
                inferenceOnly: q?.inferenceOnly,
                orgUUID: q?.orgUUID,
                loginHint: q?.loginHint,
                loginMethod: q?.loginMethod
            },
            _ = GZ1({
                ...z,
                isManual: !0
            }),
            w = GZ1({
                ...z,
                isManual: !1
            }),
            O = await this.waitForAuthorizationCode(Y, async () => {
                await A(_), await R9(w)
            }),
            $ = this.authCodeListener?.hasPendingResponse() ?? !1;
        d("tengu_oauth_auth_code_received", {
            automatic: $
        });
        try {
            let H = await by8(O, Y, this.codeVerifier, this.port, !$, q?.expiresIn),
                j = await fZ1(H.access_token);
            if ($) {
                let J = pQ6(H.scope);
                this.authCodeListener?.handleSuccessRedirect(J)
            }
            return this.formatTokens(H, j.subscriptionType, j.rateLimitTier, j.rawProfile)
        } catch (H) {
            if ($) this.authCodeListener?.handleErrorRedirect();
            throw H
        } finally {
            this.authCodeListener?.close()
        }
    }
    async waitForAuthorizationCode(A, q) {
        return new Promise((K, Y) => {
            this.manualAuthCodeResolver = K, this.authCodeListener?.waitForAuthorization(A, q).then((z) => {
                this.manualAuthCodeResolver = null, K(z)
            }).catch((z) => {
                this.manualAuthCodeResolver = null, Y(z)
            })
        })
    }
    handleManualAuthCodeInput(A) {
        if (this.manualAuthCodeResolver) this.manualAuthCodeResolver(A.authorizationCode), this.manualAuthCodeResolver = null, this.authCodeListener?.close()
    }
    formatTokens(A, q, K, Y) {
        return {
            accessToken: A.access_token,
            refreshToken: A.refresh_token,
            expiresAt: Date.now() + A.expires_in * 1000,
            scopes: pQ6(A.scope),
            subscriptionType: q,
            rateLimitTier: K,
            profile: Y,
            tokenAccount: A.account ? {
                uuid: A.account.uuid,
                emailAddress: A.account.email_address,
                organizationUuid: A.organization?.uuid
            } : void 0
        }
    }
    cleanup() {
        this.authCodeListener?.close(), this.manualAuthCodeResolver = null
    }
}
// @from(Ln 275149, Col 4)
TZ1 = E(() => {
    kX();
    yW4();
    SW4();
    W0();
    V1()
})
// @from(Ln 275157, Col 0)
function de9(A, q) {
    return A + Qe9(Ue9() * (q - A + 1))
}
// @from(Ln 275160, Col 4)
Qe9
// @from(Ln 275160, Col 9)
Ue9
// @from(Ln 275160, Col 14)
CW4
// @from(Ln 275161, Col 4)
IW4 = E(() => {
    Qe9 = Math.floor, Ue9 = Math.random;
    CW4 = de9
})
// @from(Ln 275166, Col 0)
function ce9(A) {
    var q = A.length;
    return q ? A[CW4(0, q - 1)] : void 0
}
// @from(Ln 275170, Col 4)
vZ1
// @from(Ln 275171, Col 4)
py8 = E(() => {
    IW4();
    vZ1 = ce9
})
// @from(Ln 275176, Col 0)
function le9(A, q) {
    return Ew6(q, function(K) {
        return A[K]
    })
}
// @from(Ln 275181, Col 4)
bW4
// @from(Ln 275182, Col 4)
xW4 = E(() => {
    Ht6();
    bW4 = le9
})
// @from(Ln 275187, Col 0)
function ie9(A) {
    return A == null ? [] : bW4(A, aE(A))
}
// @from(Ln 275190, Col 4)
uW4
// @from(Ln 275191, Col 4)
mW4 = E(() => {
    xW4();
    d86();
    uW4 = ie9
})
// @from(Ln 275197, Col 0)
function ne9(A) {
    return vZ1(uW4(A))
}
// @from(Ln 275200, Col 4)
BW4
// @from(Ln 275201, Col 4)
gW4 = E(() => {
    py8();
    mW4();
    BW4 = ne9
})
// @from(Ln 275207, Col 0)
function re9(A) {
    var q = q_(A) ? vZ1 : BW4;
    return q(A)
}
// @from(Ln 275211, Col 4)
YM
// @from(Ln 275212, Col 4)
Nc = E(() => {
    py8();
    gW4();
    qG();
    YM = re9
})
// @from(Ln 275218, Col 0)
class zg {
    activeOperations = new Set;
    lastUserActivityTime = 0;
    lastCLIRecordedTime;
    isCLIActive = !1;
    USER_ACTIVITY_TIMEOUT_MS = 5000;
    getNow;
    getActiveTimeCounter;
    static instance = null;
    constructor(A) {
        this.getNow = A?.getNow ?? (() => Date.now()), this.getActiveTimeCounter = A?.getActiveTimeCounter ?? Gu1, this.lastCLIRecordedTime = this.getNow()
    }
    static getInstance() {
        if (!zg.instance) zg.instance = new zg;
        return zg.instance
    }
    static resetInstance() {
        zg.instance = null
    }
    static createInstance(A) {
        return zg.instance = new zg(A), zg.instance
    }
    recordUserActivity() {
        if (!this.isCLIActive && this.lastUserActivityTime !== 0) {
            let q = (this.getNow() - this.lastUserActivityTime) / 1000;
            if (q > 0) {
                let K = this.getActiveTimeCounter();
                if (K) {
                    let Y = this.USER_ACTIVITY_TIMEOUT_MS / 1000;
                    if (q < Y) K.add(q, {
                        type: "user"
                    })
                }
            }
        }
        this.lastUserActivityTime = this.getNow()
    }
    startCLIActivity(A) {
        if (this.activeOperations.has(A)) this.endCLIActivity(A);
        let q = this.activeOperations.size === 0;
        if (this.activeOperations.add(A), q) this.isCLIActive = !0, this.lastCLIRecordedTime = this.getNow()
    }
    endCLIActivity(A) {
        if (this.activeOperations.delete(A), this.activeOperations.size === 0) {
            let q = this.getNow(),
                K = (q - this.lastCLIRecordedTime) / 1000;
            if (K > 0) {
                let Y = this.getActiveTimeCounter();
                if (Y) Y.add(K, {
                    type: "cli"
                })
            }
            this.lastCLIRecordedTime = q, this.isCLIActive = !1
        }
    }
    async trackOperation(A, q) {
        this.startCLIActivity(A);
        try {
            return await q()
        } finally {
            this.endCLIActivity(A)
        }
    }
    getActivityStates() {
        return {
            isUserActive: (this.getNow() - this.lastUserActivityTime) / 1000 < this.USER_ACTIVITY_TIMEOUT_MS / 1000,
            isCLIActive: this.isCLIActive,
            activeOperationCount: this.activeOperations.size
        }
    }
}
// @from(Ln 275289, Col 4)
b96
// @from(Ln 275290, Col 4)
Qy8 = E(() => {
    T1();
    b96 = zg.getInstance()
})
// @from(Ln 275295, Col 0)
function x96() {
    let q = mA().spinnerVerbs;
    if (!q) return Uy8;
    if (q.mode === "replace") return q.verbs.length > 0 ? q.verbs : Uy8;
    return [...Uy8, ...q.verbs]
}
// @from(Ln 275301, Col 4)
Uy8
// @from(Ln 275302, Col 4)
NZ1 = E(() => {
    i8();
    Uy8 = ["Accomplishing", "Actioning", "Actualizing", "Architecting", "Baking", "Beaming", "Beboppin'", "Befuddling", "Billowing", "Blanching", "Bloviating", "Boogieing", "Boondoggling", "Booping", "Bootstrapping", "Brewing", "Bunning", "Burrowing", "Calculating", "Canoodling", "Caramelizing", "Cascading", "Catapulting", "Cerebrating", "Channeling", "Channelling", "Choreographing", "Churning", "Clauding", "Coalescing", "Cogitating", "Combobulating", "Composing", "Computing", "Concocting", "Considering", "Contemplating", "Cooking", "Crafting", "Creating", "Crunching", "Crystallizing", "Cultivating", "Deciphering", "Deliberating", "Determining", "Dilly-dallying", "Discombobulating", "Doing", "Doodling", "Drizzling", "Ebbing", "Effecting", "Elucidating", "Embellishing", "Enchanting", "Envisioning", "Evaporating", "Fermenting", "Fiddle-faddling", "Finagling", "Flambéing", "Flibbertigibbeting", "Flowing", "Flummoxing", "Fluttering", "Forging", "Forming", "Frolicking", "Frosting", "Gallivanting", "Galloping", "Garnishing", "Generating", "Gesticulating", "Germinating", "Gitifying", "Grooving", "Gusting", "Harmonizing", "Hashing", "Hatching", "Herding", "Honking", "Hullaballooing", "Hyperspacing", "Ideating", "Imagining", "Improvising", "Incubating", "Inferring", "Infusing", "Ionizing", "Jitterbugging", "Julienning", "Kneading", "Leavening", "Levitating", "Lollygagging", "Manifesting", "Marinating", "Meandering", "Metamorphosing", "Misting", "Moonwalking", "Moseying", "Mulling", "Mustering", "Musing", "Nebulizing", "Nesting", "Newspapering", "Noodling", "Nucleating", "Orbiting", "Orchestrating", "Osmosing", "Perambulating", "Percolating", "Perusing", "Philosophising", "Photosynthesizing", "Pollinating", "Pondering", "Pontificating", "Pouncing", "Precipitating", "Prestidigitating", "Processing", "Proofing", "Propagating", "Puttering", "Puzzling", "Quantumizing", "Razzle-dazzling", "Razzmatazzing", "Recombobulating", "Reticulating", "Roosting", "Ruminating", "Sautéing", "Scampering", "Schlepping", "Scurrying", "Seasoning", "Shenaniganing", "Shimmying", "Simmering", "Skedaddling", "Sketching", "Slithering", "Smooshing", "Sock-hopping", "Spelunking", "Spinning", "Sprouting", "Stewing", "Sublimating", "Swirling", "Swooping", "Symbioting", "Synthesizing", "Tempering", "Thinking", "Thundering", "Tinkering", "Tomfoolering", "Topsy-turvying", "Transfiguring", "Transmuting", "Twisting", "Undulating", "Unfurling", "Unravelling", "Vibing", "Waddling", "Wandering", "Warping", "Whatchamacalliting", "Whirlpooling", "Whirring", "Whisking", "Wibbling", "Working", "Wrangling", "Zesting", "Zigzagging"]
})
// @from(Ln 275307, Col 0)
function dQ6(A, q) {
    let K = parseInt(A.id, 10),
        Y = parseInt(q.id, 10);
    if (!isNaN(K) && !isNaN(Y)) return K - Y;
    return A.id.localeCompare(q.id)
}
// @from(Ln 275314, Col 0)
function VZ1({
    tasks: A,
    isStandalone: q = !1
}) {
    let K = M1((h) => h.teamContext),
        Y = M1((h) => h.tasks),
        [, z] = pq.useState(0),
        {
            rows: _,
            columns: w
        } = KA(),
        O = pq.useRef(new Map),
        $ = pq.useRef(null);
    if ($.current === null) $.current = new Set(A.filter((h) => h.status === "completed").map((h) => h.id));
    let H = _ <= 10 ? 0 : Math.min(10, Math.max(3, _ - 14)),
        j = new Set(A.filter((h) => h.status === "completed").map((h) => h.id)),
        J = Date.now();
    for (let h of j)
        if (!$.current.has(h)) O.current.set(h, J);
    for (let h of O.current.keys())
        if (!j.has(h)) O.current.delete(h);
    if ($.current = j, pq.useEffect(() => {
            if (O.current.size === 0) return;
            let h = Date.now(),
                R = 1 / 0;
            for (let I of O.current.values()) {
                let g = I + FW4;
                if (g > h && g < R) R = g
            }
            if (R === 1 / 0) return;
            let u = setTimeout((I) => I((g) => g + 1), R - h, z);
            return () => clearTimeout(u)
        }, [A]), !r$()) return null;
    if (A.length === 0) return null;
    let M = {};
    if (E7() && K?.teammates) {
        for (let h of Object.values(K.teammates))
            if (h.color) {
                let R = t$[h.color];
                if (R) M[h.name] = R
            }
    }
    let D = {},
        X = new Set;
    if (E7()) {
        for (let h of Object.values(Y))
            if (M$(h) && h.status === "running") {
                X.add(h.identity.agentName), X.add(h.identity.agentId);
                let R = h.progress?.recentActivities,
                    u = (R && rt(R)) ?? h.progress?.lastActivity?.activityDescription;
                if (u) D[h.identity.agentName] = u, D[h.identity.agentId] = u
            }
    }
    let P = A.filter((h) => h.status === "completed").length,
        W = A.filter((h) => h.status === "pending").length,
        Z = A.length - P - W,
        G = new Set(A.filter((h) => h.status !== "completed").map((h) => h.id)),
        f = A.length > H,
        v, N;
    if (f) {
        let h = [],
            R = [];
        for (let B of A.filter((b) => b.status === "completed")) {
            let b = O.current.get(B.id);
            if (b && J - b < FW4) h.push(B);
            else R.push(B)
        }
        h.sort(dQ6), R.sort(dQ6);
        let u = A.filter((B) => B.status === "in_progress").sort(dQ6),
            I = A.filter((B) => B.status === "pending").sort((B, b) => {
                let p = B.blockedBy.some((U) => G.has(U)),
                    Q = b.blockedBy.some((U) => G.has(U));
                if (p !== Q) return p ? 1 : -1;
                return dQ6(B, b)
            }),
            g = [...h, ...u, ...I, ...R];
        v = g.slice(0, H), N = g.slice(H)
    } else v = [...A].sort(dQ6), N = [];
    let V = "";
    if (N.length > 0) {
        let h = [],
            R = N.filter((g) => g.status === "pending").length,
            u = N.filter((g) => g.status === "in_progress").length,
            I = N.filter((g) => g.status === "completed").length;
        if (u > 0) h.push(`${u} in progress`);
        if (R > 0) h.push(`${R} pending`);
        if (I > 0) h.push(`${I} completed`);
        V = ` … +${h.join(", ")}`
    }
    let L = pq.createElement(pq.Fragment, null, v.map((h) => pq.createElement(ae9, {
        key: h.id,
        task: h,
        ownerColor: h.owner ? M[h.owner] : void 0,
        openBlockers: h.blockedBy.filter((R) => G.has(R)),
        activity: h.owner ? D[h.owner] : void 0,
        ownerActive: h.owner ? X.has(h.owner) : !1,
        columns: w
    })), H > 0 && V && pq.createElement(T, {
        dimColor: !0
    }, V));
    if (q) return pq.createElement(m, {
        flexDirection: "column",
        marginTop: 1,
        marginLeft: 2
    }, pq.createElement(m, null, pq.createElement(T, {
        dimColor: !0
    }, pq.createElement(T, {
        bold: !0
    }, A.length), " tasks (", pq.createElement(T, {
        bold: !0
    }, P), " done, ", Z > 0 && pq.createElement(pq.Fragment, null, pq.createElement(T, {
        bold: !0
    }, Z), " in progress, "), pq.createElement(T, {
        bold: !0
    }, W), " open)")), L);
    return pq.createElement(m, {
        flexDirection: "column"
    }, L)
}
// @from(Ln 275434, Col 0)
function oe9(A) {
    switch (A) {
        case "completed":
            return {
                icon: a6.tick, color: "success"
            };
        case "in_progress":
            return {
                icon: a6.squareSmallFilled, color: "claude"
            };
        case "pending":
            return {
                icon: a6.squareSmall, color: void 0
            }
    }
}