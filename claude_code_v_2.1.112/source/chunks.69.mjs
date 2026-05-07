
// @from(Ln 180860, Col 0)
function d34(q, K, _, z) {
    if (!q.anchor) return !1;
    let Y = (q.virtualAnchorRow ?? q.anchor.row) + K,
        A = q.focus ? (q.virtualFocusRow ?? q.focus.row) + K : void 0;
    if (Y < _ && A !== void 0 && A < _) return ga6(q), !0;
    if (q.anchor = {
            col: q.anchor.col,
            row: lE(Y, _, z)
        }, q.focus && A !== void 0) q.focus = {
        col: q.focus.col,
        row: lE(A, _, z)
    };
    if (q.virtualAnchorRow = Y < _ || Y > z ? Y : void 0, q.virtualFocusRow = A !== void 0 && (A < _ || A > z) ? A : void 0, q.anchorSpan) {
        let O = (w) => ({
            col: w.col,
            row: lE(w.row + K, _, z)
        });
        q.anchorSpan = {
            lo: O(q.anchorSpan.lo),
            hi: O(q.anchorSpan.hi),
            kind: q.anchorSpan.kind
        }
    }
    return !1
}
// @from(Ln 180886, Col 0)
function kI(q) {
    return q.anchor !== null && q.focus !== null
}
// @from(Ln 180890, Col 0)
function yx1(q) {
    if (!q.anchor || !q.focus) return null;
    return Ex1(q.anchor, q.focus) <= 0 ? {
        start: q.anchor,
        end: q.focus
    } : {
        start: q.focus,
        end: q.anchor
    }
}
// @from(Ln 180901, Col 0)
function c34(q, K, _, z) {
    let Y = q.noSelect,
        A = K * q.width,
        O = q.softWrap[K],
        $ = (K + 1 < q.height ? q.softWrap[K + 1] : 0) >>> 16,
        j = $ > 0 ? Math.min(z, $ - 1) : z,
        H = O !== 0 ? Math.max(_, O & 65535) : _,
        J = "";
    for (let X = H; X <= j; X++) {
        if (Y[A + X] === 1) continue;
        let M = Tf(q, X, K);
        if (!M) continue;
        if (M.width === 2 || M.width === 3) continue;
        J += M.char
    }
    return $ > 0 ? J : J.replace(/\s+$/, "")
}
// @from(Ln 180919, Col 0)
function Nx1(q, K, _) {
    if (_ && q.length > 0) q[q.length - 1] += K;
    else q.push(K)
}
// @from(Ln 180924, Col 0)
function l34(q, K) {
    let _ = yx1(q);
    if (!_) return "";
    let {
        start: z,
        end: Y
    } = _, A = K.softWrap, O = [];
    for (let w = 0; w < q.scrolledOffAbove.length; w++) Nx1(O, q.scrolledOffAbove[w], q.scrolledOffAboveSW[w]);
    for (let w = z.row; w <= Y.row; w++) {
        let $ = w === z.row ? z.col : 0,
            j = w === Y.row ? Y.col : K.width - 1;
        Nx1(O, c34(K, w, $, j), A[w] > 0)
    }
    for (let w = 0; w < q.scrolledOffBelow.length; w++) Nx1(O, q.scrolledOffBelow[w], q.scrolledOffBelowSW[w]);
    return O.join(`
`)
}
// @from(Ln 180942, Col 0)
function qE8(q, K, _, z, Y) {
    let A = yx1(q);
    if (!A || _ > z) return;
    let {
        start: O,
        end: w
    } = A, $ = Math.max(_, O.row), j = Math.min(z, w.row);
    if ($ > j) return;
    let {
        width: H,
        softWrap: J
    } = K, X = [], M = [];
    for (let P = $; P <= j; P++) {
        let W = P === O.row ? O.col : 0,
            D = P === w.row ? w.col : H - 1;
        X.push(c34(K, P, W, D)), M.push(J[P] > 0)
    }
    if (Y === "above") {
        if (q.scrolledOffAbove.push(...X), q.scrolledOffAboveSW.push(...M), q.anchor && q.anchor.row === O.row && $ === O.row) {
            if (q.anchor = {
                    col: 0,
                    row: q.anchor.row
                }, q.anchorSpan) q.anchorSpan = {
                kind: q.anchorSpan.kind,
                lo: {
                    col: 0,
                    row: q.anchorSpan.lo.row
                },
                hi: {
                    col: H - 1,
                    row: q.anchorSpan.hi.row
                }
            }
        }
    } else if (q.scrolledOffBelow.unshift(...X), q.scrolledOffBelowSW.unshift(...M), q.anchor && q.anchor.row === w.row && j === w.row) {
        if (q.anchor = {
                col: H - 1,
                row: q.anchor.row
            }, q.anchorSpan) q.anchorSpan = {
            kind: q.anchorSpan.kind,
            lo: {
                col: 0,
                row: q.anchorSpan.lo.row
            },
            hi: {
                col: H - 1,
                row: q.anchorSpan.hi.row
            }
        }
    }
}
// @from(Ln 180994, Col 0)
function n34(q, K, _) {
    let z = yx1(K);
    if (!z) return;
    let {
        start: Y,
        end: A
    } = z, O = q.width, w = q.noSelect;
    for (let $ = Y.row; $ <= A.row && $ < q.height; $++) {
        let j = $ === Y.row ? Y.col : 0,
            H = $ === A.row ? Math.min(A.col, O - 1) : O - 1,
            J = $ * O;
        for (let X = j; X <= H; X++) {
            let M = J + X;
            if (w[M] === 1) continue;
            let P = Ua(q, M);
            EN6(q, X, $, _.withSelectionBg(P.styleId))
        }
    }
}
// @from(Ln 181013, Col 4)
iS_
// @from(Ln 181013, Col 9)
rS_
// @from(Ln 181014, Col 4)
KE8 = L(() => {
    y$6();
    Xd();
    iS_ = /[\p{L}\p{N}_/.\-+~\\]/u;
    rS_ = new Set([..."<>\"'` "])
})
// @from(Ln 181020, Col 4)
Ua6 = p((E1w, i34) => {
    var oS_ = Number.MAX_SAFE_INTEGER || 9007199254740991,
        aS_ = ["major", "premajor", "minor", "preminor", "patch", "prepatch", "prerelease"];
    i34.exports = {
        MAX_LENGTH: 256,
        MAX_SAFE_COMPONENT_LENGTH: 16,
        MAX_SAFE_BUILD_LENGTH: 250,
        MAX_SAFE_INTEGER: oS_,
        RELEASE_TYPES: aS_,
        SEMVER_SPEC_VERSION: "2.0.0",
        FLAG_INCLUDE_PRERELEASE: 1,
        FLAG_LOOSE: 2
    }
})
// @from(Ln 181034, Col 4)
Qa6 = p((y1w, r34) => {
    var sS_ = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...q) => console.error("SEMVER", ...q) : () => {};
    r34.exports = sS_
})
// @from(Ln 181038, Col 4)
LN6 = p((Md, o34) => {
    var {
        MAX_SAFE_COMPONENT_LENGTH: Lx1,
        MAX_SAFE_BUILD_LENGTH: tS_,
        MAX_LENGTH: eS_
    } = Ua6(), qC_ = Qa6();
    Md = o34.exports = {};
    var KC_ = Md.re = [],
        _C_ = Md.safeRe = [],
        OK = Md.src = [],
        zC_ = Md.safeSrc = [],
        wK = Md.t = {},
        YC_ = 0,
        hx1 = "[a-zA-Z0-9-]",
        AC_ = [
            ["\\s", 1],
            ["\\d", eS_],
            [hx1, tS_]
        ],
        OC_ = (q) => {
            for (let [K, _] of AC_) q = q.split(`${K}*`).join(`${K}{0,${_}}`).split(`${K}+`).join(`${K}{1,${_}}`);
            return q
        },
        r9 = (q, K, _) => {
            let z = OC_(K),
                Y = YC_++;
            qC_(q, Y, K), wK[q] = Y, OK[Y] = K, zC_[Y] = z, KC_[Y] = new RegExp(K, _ ? "g" : void 0), _C_[Y] = new RegExp(z, _ ? "g" : void 0)
        };
    r9("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    r9("NUMERICIDENTIFIERLOOSE", "\\d+");
    r9("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${hx1}*`);
    r9("MAINVERSION", `(${OK[wK.NUMERICIDENTIFIER]})\\.(${OK[wK.NUMERICIDENTIFIER]})\\.(${OK[wK.NUMERICIDENTIFIER]})`);
    r9("MAINVERSIONLOOSE", `(${OK[wK.NUMERICIDENTIFIERLOOSE]})\\.(${OK[wK.NUMERICIDENTIFIERLOOSE]})\\.(${OK[wK.NUMERICIDENTIFIERLOOSE]})`);
    r9("PRERELEASEIDENTIFIER", `(?:${OK[wK.NONNUMERICIDENTIFIER]}|${OK[wK.NUMERICIDENTIFIER]})`);
    r9("PRERELEASEIDENTIFIERLOOSE", `(?:${OK[wK.NONNUMERICIDENTIFIER]}|${OK[wK.NUMERICIDENTIFIERLOOSE]})`);
    r9("PRERELEASE", `(?:-(${OK[wK.PRERELEASEIDENTIFIER]}(?:\\.${OK[wK.PRERELEASEIDENTIFIER]})*))`);
    r9("PRERELEASELOOSE", `(?:-?(${OK[wK.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${OK[wK.PRERELEASEIDENTIFIERLOOSE]})*))`);
    r9("BUILDIDENTIFIER", `${hx1}+`);
    r9("BUILD", `(?:\\+(${OK[wK.BUILDIDENTIFIER]}(?:\\.${OK[wK.BUILDIDENTIFIER]})*))`);
    r9("FULLPLAIN", `v?${OK[wK.MAINVERSION]}${OK[wK.PRERELEASE]}?${OK[wK.BUILD]}?`);
    r9("FULL", `^${OK[wK.FULLPLAIN]}$`);
    r9("LOOSEPLAIN", `[v=\\s]*${OK[wK.MAINVERSIONLOOSE]}${OK[wK.PRERELEASELOOSE]}?${OK[wK.BUILD]}?`);
    r9("LOOSE", `^${OK[wK.LOOSEPLAIN]}$`);
    r9("GTLT", "((?:<|>)?=?)");
    r9("XRANGEIDENTIFIERLOOSE", `${OK[wK.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    r9("XRANGEIDENTIFIER", `${OK[wK.NUMERICIDENTIFIER]}|x|X|\\*`);
    r9("XRANGEPLAIN", `[v=\\s]*(${OK[wK.XRANGEIDENTIFIER]})(?:\\.(${OK[wK.XRANGEIDENTIFIER]})(?:\\.(${OK[wK.XRANGEIDENTIFIER]})(?:${OK[wK.PRERELEASE]})?${OK[wK.BUILD]}?)?)?`);
    r9("XRANGEPLAINLOOSE", `[v=\\s]*(${OK[wK.XRANGEIDENTIFIERLOOSE]})(?:\\.(${OK[wK.XRANGEIDENTIFIERLOOSE]})(?:\\.(${OK[wK.XRANGEIDENTIFIERLOOSE]})(?:${OK[wK.PRERELEASELOOSE]})?${OK[wK.BUILD]}?)?)?`);
    r9("XRANGE", `^${OK[wK.GTLT]}\\s*${OK[wK.XRANGEPLAIN]}$`);
    r9("XRANGELOOSE", `^${OK[wK.GTLT]}\\s*${OK[wK.XRANGEPLAINLOOSE]}$`);
    r9("COERCEPLAIN", `(^|[^\\d])(\\d{1,${Lx1}})(?:\\.(\\d{1,${Lx1}}))?(?:\\.(\\d{1,${Lx1}}))?`);
    r9("COERCE", `${OK[wK.COERCEPLAIN]}(?:$|[^\\d])`);
    r9("COERCEFULL", OK[wK.COERCEPLAIN] + `(?:${OK[wK.PRERELEASE]})?(?:${OK[wK.BUILD]})?(?:$|[^\\d])`);
    r9("COERCERTL", OK[wK.COERCE], !0);
    r9("COERCERTLFULL", OK[wK.COERCEFULL], !0);
    r9("LONETILDE", "(?:~>?)");
    r9("TILDETRIM", `(\\s*)${OK[wK.LONETILDE]}\\s+`, !0);
    Md.tildeTrimReplace = "$1~";
    r9("TILDE", `^${OK[wK.LONETILDE]}${OK[wK.XRANGEPLAIN]}$`);
    r9("TILDELOOSE", `^${OK[wK.LONETILDE]}${OK[wK.XRANGEPLAINLOOSE]}$`);
    r9("LONECARET", "(?:\\^)");
    r9("CARETTRIM", `(\\s*)${OK[wK.LONECARET]}\\s+`, !0);
    Md.caretTrimReplace = "$1^";
    r9("CARET", `^${OK[wK.LONECARET]}${OK[wK.XRANGEPLAIN]}$`);
    r9("CARETLOOSE", `^${OK[wK.LONECARET]}${OK[wK.XRANGEPLAINLOOSE]}$`);
    r9("COMPARATORLOOSE", `^${OK[wK.GTLT]}\\s*(${OK[wK.LOOSEPLAIN]})$|^$`);
    r9("COMPARATOR", `^${OK[wK.GTLT]}\\s*(${OK[wK.FULLPLAIN]})$|^$`);
    r9("COMPARATORTRIM", `(\\s*)${OK[wK.GTLT]}\\s*(${OK[wK.LOOSEPLAIN]}|${OK[wK.XRANGEPLAIN]})`, !0);
    Md.comparatorTrimReplace = "$1$2$3";
    r9("HYPHENRANGE", `^\\s*(${OK[wK.XRANGEPLAIN]})\\s+-\\s+(${OK[wK.XRANGEPLAIN]})\\s*$`);
    r9("HYPHENRANGELOOSE", `^\\s*(${OK[wK.XRANGEPLAINLOOSE]})\\s+-\\s+(${OK[wK.XRANGEPLAINLOOSE]})\\s*$`);
    r9("STAR", "(<|>)?=?\\s*\\*");
    r9("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    r9("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$")
})
// @from(Ln 181113, Col 4)
_E8 = p((L1w, a34) => {
    var wC_ = Object.freeze({
            loose: !0
        }),
        $C_ = Object.freeze({}),
        jC_ = (q) => {
            if (!q) return $C_;
            if (typeof q !== "object") return wC_;
            return q
        };
    a34.exports = jC_
})
// @from(Ln 181125, Col 4)
Rx1 = p((h1w, e34) => {
    var s34 = /^[0-9]+$/,
        t34 = (q, K) => {
            let _ = s34.test(q),
                z = s34.test(K);
            if (_ && z) q = +q, K = +K;
            return q === K ? 0 : _ && !z ? -1 : z && !_ ? 1 : q < K ? -1 : 1
        },
        HC_ = (q, K) => t34(K, q);
    e34.exports = {
        compareIdentifiers: t34,
        rcompareIdentifiers: HC_
    }
})
// @from(Ln 181139, Col 4)
dv = p((R1w, K94) => {
    var zE8 = Qa6(),
        {
            MAX_LENGTH: q94,
            MAX_SAFE_INTEGER: YE8
        } = Ua6(),
        {
            safeRe: AE8,
            t: OE8
        } = LN6(),
        JC_ = _E8(),
        {
            compareIdentifiers: hN6
        } = Rx1();
    class oB {
        constructor(q, K) {
            if (K = JC_(K), q instanceof oB)
                if (q.loose === !!K.loose && q.includePrerelease === !!K.includePrerelease) return q;
                else q = q.version;
            else if (typeof q !== "string") throw TypeError(`Invalid version. Must be a string. Got type "${typeof q}".`);
            if (q.length > q94) throw TypeError(`version is longer than ${q94} characters`);
            zE8("SemVer", q, K), this.options = K, this.loose = !!K.loose, this.includePrerelease = !!K.includePrerelease;
            let _ = q.trim().match(K.loose ? AE8[OE8.LOOSE] : AE8[OE8.FULL]);
            if (!_) throw TypeError(`Invalid Version: ${q}`);
            if (this.raw = q, this.major = +_[1], this.minor = +_[2], this.patch = +_[3], this.major > YE8 || this.major < 0) throw TypeError("Invalid major version");
            if (this.minor > YE8 || this.minor < 0) throw TypeError("Invalid minor version");
            if (this.patch > YE8 || this.patch < 0) throw TypeError("Invalid patch version");
            if (!_[4]) this.prerelease = [];
            else this.prerelease = _[4].split(".").map((z) => {
                if (/^[0-9]+$/.test(z)) {
                    let Y = +z;
                    if (Y >= 0 && Y < YE8) return Y
                }
                return z
            });
            this.build = _[5] ? _[5].split(".") : [], this.format()
        }
        format() {
            if (this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length) this.version += `-${this.prerelease.join(".")}`;
            return this.version
        }
        toString() {
            return this.version
        }
        compare(q) {
            if (zE8("SemVer.compare", this.version, this.options, q), !(q instanceof oB)) {
                if (typeof q === "string" && q === this.version) return 0;
                q = new oB(q, this.options)
            }
            if (q.version === this.version) return 0;
            return this.compareMain(q) || this.comparePre(q)
        }
        compareMain(q) {
            if (!(q instanceof oB)) q = new oB(q, this.options);
            return hN6(this.major, q.major) || hN6(this.minor, q.minor) || hN6(this.patch, q.patch)
        }
        comparePre(q) {
            if (!(q instanceof oB)) q = new oB(q, this.options);
            if (this.prerelease.length && !q.prerelease.length) return -1;
            else if (!this.prerelease.length && q.prerelease.length) return 1;
            else if (!this.prerelease.length && !q.prerelease.length) return 0;
            let K = 0;
            do {
                let _ = this.prerelease[K],
                    z = q.prerelease[K];
                if (zE8("prerelease compare", K, _, z), _ === void 0 && z === void 0) return 0;
                else if (z === void 0) return 1;
                else if (_ === void 0) return -1;
                else if (_ === z) continue;
                else return hN6(_, z)
            } while (++K)
        }
        compareBuild(q) {
            if (!(q instanceof oB)) q = new oB(q, this.options);
            let K = 0;
            do {
                let _ = this.build[K],
                    z = q.build[K];
                if (zE8("build compare", K, _, z), _ === void 0 && z === void 0) return 0;
                else if (z === void 0) return 1;
                else if (_ === void 0) return -1;
                else if (_ === z) continue;
                else return hN6(_, z)
            } while (++K)
        }
        inc(q, K, _) {
            if (q.startsWith("pre")) {
                if (!K && _ === !1) throw Error("invalid increment argument: identifier is empty");
                if (K) {
                    let z = `-${K}`.match(this.options.loose ? AE8[OE8.PRERELEASELOOSE] : AE8[OE8.PRERELEASE]);
                    if (!z || z[1] !== K) throw Error(`invalid identifier: ${K}`)
                }
            }
            switch (q) {
                case "premajor":
                    this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", K, _);
                    break;
                case "preminor":
                    this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", K, _);
                    break;
                case "prepatch":
                    this.prerelease.length = 0, this.inc("patch", K, _), this.inc("pre", K, _);
                    break;
                case "prerelease":
                    if (this.prerelease.length === 0) this.inc("patch", K, _);
                    this.inc("pre", K, _);
                    break;
                case "release":
                    if (this.prerelease.length === 0) throw Error(`version ${this.raw} is not a prerelease`);
                    this.prerelease.length = 0;
                    break;
                case "major":
                    if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) this.major++;
                    this.minor = 0, this.patch = 0, this.prerelease = [];
                    break;
                case "minor":
                    if (this.patch !== 0 || this.prerelease.length === 0) this.minor++;
                    this.patch = 0, this.prerelease = [];
                    break;
                case "patch":
                    if (this.prerelease.length === 0) this.patch++;
                    this.prerelease = [];
                    break;
                case "pre": {
                    let z = Number(_) ? 1 : 0;
                    if (this.prerelease.length === 0) this.prerelease = [z];
                    else {
                        let Y = this.prerelease.length;
                        while (--Y >= 0)
                            if (typeof this.prerelease[Y] === "number") this.prerelease[Y]++, Y = -2;
                        if (Y === -1) {
                            if (K === this.prerelease.join(".") && _ === !1) throw Error("invalid increment argument: identifier already exists");
                            this.prerelease.push(z)
                        }
                    }
                    if (K) {
                        let Y = [K, z];
                        if (_ === !1) Y = [K];
                        if (hN6(this.prerelease[0], K) === 0) {
                            if (isNaN(this.prerelease[1])) this.prerelease = Y
                        } else this.prerelease = Y
                    }
                    break
                }
                default:
                    throw Error(`invalid increment argument: ${q}`)
            }
            if (this.raw = this.format(), this.build.length) this.raw += `+${this.build.join(".")}`;
            return this
        }
    }
    K94.exports = oB
})
// @from(Ln 181292, Col 4)
h$6 = p((S1w, z94) => {
    var _94 = dv(),
        XC_ = (q, K, _ = !1) => {
            if (q instanceof _94) return q;
            try {
                return new _94(q, K)
            } catch (z) {
                if (!_) return null;
                throw z
            }
        };
    z94.exports = XC_
})
// @from(Ln 181305, Col 4)
A94 = p((C1w, Y94) => {
    var MC_ = h$6(),
        PC_ = (q, K) => {
            let _ = MC_(q, K);
            return _ ? _.version : null
        };
    Y94.exports = PC_
})
// @from(Ln 181313, Col 4)
w94 = p((b1w, O94) => {
    var WC_ = h$6(),
        DC_ = (q, K) => {
            let _ = WC_(q.trim().replace(/^[=v]+/, ""), K);
            return _ ? _.version : null
        };
    O94.exports = DC_
})
// @from(Ln 181321, Col 4)
H94 = p((I1w, j94) => {
    var $94 = dv(),
        ZC_ = (q, K, _, z, Y) => {
            if (typeof _ === "string") Y = z, z = _, _ = void 0;
            try {
                return new $94(q instanceof $94 ? q.version : q, _).inc(K, z, Y).version
            } catch (A) {
                return null
            }
        };
    j94.exports = ZC_
})
// @from(Ln 181333, Col 4)
M94 = p((x1w, X94) => {
    var J94 = h$6(),
        fC_ = (q, K) => {
            let _ = J94(q, null, !0),
                z = J94(K, null, !0),
                Y = _.compare(z);
            if (Y === 0) return null;
            let A = Y > 0,
                O = A ? _ : z,
                w = A ? z : _,
                $ = !!O.prerelease.length;
            if (!!w.prerelease.length && !$) {
                if (!w.patch && !w.minor) return "major";
                if (w.compareMain(O) === 0) {
                    if (w.minor && !w.patch) return "minor";
                    return "patch"
                }
            }
            let H = $ ? "pre" : "";
            if (_.major !== z.major) return H + "major";
            if (_.minor !== z.minor) return H + "minor";
            if (_.patch !== z.patch) return H + "patch";
            return "prerelease"
        };
    X94.exports = fC_
})
// @from(Ln 181359, Col 4)
W94 = p((u1w, P94) => {
    var GC_ = dv(),
        vC_ = (q, K) => new GC_(q, K).major;
    P94.exports = vC_
})
// @from(Ln 181364, Col 4)
Z94 = p((m1w, D94) => {
    var TC_ = dv(),
        VC_ = (q, K) => new TC_(q, K).minor;
    D94.exports = VC_
})
// @from(Ln 181369, Col 4)
G94 = p((B1w, f94) => {
    var kC_ = dv(),
        NC_ = (q, K) => new kC_(q, K).patch;
    f94.exports = NC_
})
// @from(Ln 181374, Col 4)
T94 = p((p1w, v94) => {
    var EC_ = h$6(),
        yC_ = (q, K) => {
            let _ = EC_(q, K);
            return _ && _.prerelease.length ? _.prerelease : null
        };
    v94.exports = yC_
})
// @from(Ln 181382, Col 4)
NI = p((F1w, k94) => {
    var V94 = dv(),
        LC_ = (q, K, _) => new V94(q, _).compare(new V94(K, _));
    k94.exports = LC_
})
// @from(Ln 181387, Col 4)
E94 = p((g1w, N94) => {
    var hC_ = NI(),
        RC_ = (q, K, _) => hC_(K, q, _);
    N94.exports = RC_
})
// @from(Ln 181392, Col 4)
L94 = p((U1w, y94) => {
    var SC_ = NI(),
        CC_ = (q, K) => SC_(q, K, !0);
    y94.exports = CC_
})
// @from(Ln 181397, Col 4)
wE8 = p((Q1w, R94) => {
    var h94 = dv(),
        bC_ = (q, K, _) => {
            let z = new h94(q, _),
                Y = new h94(K, _);
            return z.compare(Y) || z.compareBuild(Y)
        };
    R94.exports = bC_
})
// @from(Ln 181406, Col 4)
C94 = p((d1w, S94) => {
    var IC_ = wE8(),
        xC_ = (q, K) => q.sort((_, z) => IC_(_, z, K));
    S94.exports = xC_
})
// @from(Ln 181411, Col 4)
I94 = p((c1w, b94) => {
    var uC_ = wE8(),
        mC_ = (q, K) => q.sort((_, z) => uC_(z, _, K));
    b94.exports = mC_
})
// @from(Ln 181416, Col 4)
da6 = p((l1w, x94) => {
    var BC_ = NI(),
        pC_ = (q, K, _) => BC_(q, K, _) > 0;
    x94.exports = pC_
})
// @from(Ln 181421, Col 4)
$E8 = p((n1w, u94) => {
    var FC_ = NI(),
        gC_ = (q, K, _) => FC_(q, K, _) < 0;
    u94.exports = gC_
})
// @from(Ln 181426, Col 4)
Sx1 = p((i1w, m94) => {
    var UC_ = NI(),
        QC_ = (q, K, _) => UC_(q, K, _) === 0;
    m94.exports = QC_
})
// @from(Ln 181431, Col 4)
Cx1 = p((r1w, B94) => {
    var dC_ = NI(),
        cC_ = (q, K, _) => dC_(q, K, _) !== 0;
    B94.exports = cC_
})
// @from(Ln 181436, Col 4)
jE8 = p((o1w, p94) => {
    var lC_ = NI(),
        nC_ = (q, K, _) => lC_(q, K, _) >= 0;
    p94.exports = nC_
})
// @from(Ln 181441, Col 4)
HE8 = p((a1w, F94) => {
    var iC_ = NI(),
        rC_ = (q, K, _) => iC_(q, K, _) <= 0;
    F94.exports = rC_
})
// @from(Ln 181446, Col 4)
bx1 = p((s1w, g94) => {
    var oC_ = Sx1(),
        aC_ = Cx1(),
        sC_ = da6(),
        tC_ = jE8(),
        eC_ = $E8(),
        qb_ = HE8(),
        Kb_ = (q, K, _, z) => {
            switch (K) {
                case "===":
                    if (typeof q === "object") q = q.version;
                    if (typeof _ === "object") _ = _.version;
                    return q === _;
                case "!==":
                    if (typeof q === "object") q = q.version;
                    if (typeof _ === "object") _ = _.version;
                    return q !== _;
                case "":
                case "=":
                case "==":
                    return oC_(q, _, z);
                case "!=":
                    return aC_(q, _, z);
                case ">":
                    return sC_(q, _, z);
                case ">=":
                    return tC_(q, _, z);
                case "<":
                    return eC_(q, _, z);
                case "<=":
                    return qb_(q, _, z);
                default:
                    throw TypeError(`Invalid operator: ${K}`)
            }
        };
    g94.exports = Kb_
})
// @from(Ln 181483, Col 4)
Q94 = p((t1w, U94) => {
    var _b_ = dv(),
        zb_ = h$6(),
        {
            safeRe: JE8,
            t: XE8
        } = LN6(),
        Yb_ = (q, K) => {
            if (q instanceof _b_) return q;
            if (typeof q === "number") q = String(q);
            if (typeof q !== "string") return null;
            K = K || {};
            let _ = null;
            if (!K.rtl) _ = q.match(K.includePrerelease ? JE8[XE8.COERCEFULL] : JE8[XE8.COERCE]);
            else {
                let $ = K.includePrerelease ? JE8[XE8.COERCERTLFULL] : JE8[XE8.COERCERTL],
                    j;
                while ((j = $.exec(q)) && (!_ || _.index + _[0].length !== q.length)) {
                    if (!_ || j.index + j[0].length !== _.index + _[0].length) _ = j;
                    $.lastIndex = j.index + j[1].length + j[2].length
                }
                $.lastIndex = -1
            }
            if (_ === null) return null;
            let z = _[2],
                Y = _[3] || "0",
                A = _[4] || "0",
                O = K.includePrerelease && _[5] ? `-${_[5]}` : "",
                w = K.includePrerelease && _[6] ? `+${_[6]}` : "";
            return zb_(`${z}.${Y}.${A}${O}${w}`, K)
        };
    U94.exports = Yb_
})
// @from(Ln 181516, Col 4)
l94 = p((e1w, c94) => {
    class d94 {
        constructor() {
            this.max = 1000, this.map = new Map
        }
        get(q) {
            let K = this.map.get(q);
            if (K === void 0) return;
            else return this.map.delete(q), this.map.set(q, K), K
        }
        delete(q) {
            return this.map.delete(q)
        }
        set(q, K) {
            if (!this.delete(q) && K !== void 0) {
                if (this.map.size >= this.max) {
                    let z = this.map.keys().next().value;
                    this.delete(z)
                }
                this.map.set(q, K)
            }
            return this
        }
    }
    c94.exports = d94
})
// @from(Ln 181542, Col 4)
EI = p((q7w, o94) => {
    var Ab_ = /\s+/g;
    class ca6 {
        constructor(q, K) {
            if (K = wb_(K), q instanceof ca6)
                if (q.loose === !!K.loose && q.includePrerelease === !!K.includePrerelease) return q;
                else return new ca6(q.raw, K);
            if (q instanceof Ix1) return this.raw = q.value, this.set = [
                [q]
            ], this.formatted = void 0, this;
            if (this.options = K, this.loose = !!K.loose, this.includePrerelease = !!K.includePrerelease, this.raw = q.trim().replace(Ab_, " "), this.set = this.raw.split("||").map((_) => this.parseRange(_.trim())).filter((_) => _.length), !this.set.length) throw TypeError(`Invalid SemVer Range: ${this.raw}`);
            if (this.set.length > 1) {
                let _ = this.set[0];
                if (this.set = this.set.filter((z) => !i94(z[0])), this.set.length === 0) this.set = [_];
                else if (this.set.length > 1) {
                    for (let z of this.set)
                        if (z.length === 1 && Pb_(z[0])) {
                            this.set = [z];
                            break
                        }
                }
            }
            this.formatted = void 0
        }
        get range() {
            if (this.formatted === void 0) {
                this.formatted = "";
                for (let q = 0; q < this.set.length; q++) {
                    if (q > 0) this.formatted += "||";
                    let K = this.set[q];
                    for (let _ = 0; _ < K.length; _++) {
                        if (_ > 0) this.formatted += " ";
                        this.formatted += K[_].toString().trim()
                    }
                }
            }
            return this.formatted
        }
        format() {
            return this.range
        }
        toString() {
            return this.range
        }
        parseRange(q) {
            let _ = ((this.options.includePrerelease && Xb_) | (this.options.loose && Mb_)) + ":" + q,
                z = n94.get(_);
            if (z) return z;
            let Y = this.options.loose,
                A = Y ? nE[_k.HYPHENRANGELOOSE] : nE[_k.HYPHENRANGE];
            q = q.replace(A, Nb_(this.options.includePrerelease)), Mj("hyphen replace", q), q = q.replace(nE[_k.COMPARATORTRIM], jb_), Mj("comparator trim", q), q = q.replace(nE[_k.TILDETRIM], Hb_), Mj("tilde trim", q), q = q.replace(nE[_k.CARETTRIM], Jb_), Mj("caret trim", q);
            let O = q.split(" ").map((H) => Wb_(H, this.options)).join(" ").split(/\s+/).map((H) => kb_(H, this.options));
            if (Y) O = O.filter((H) => {
                return Mj("loose invalid filter", H, this.options), !!H.match(nE[_k.COMPARATORLOOSE])
            });
            Mj("range list", O);
            let w = new Map,
                $ = O.map((H) => new Ix1(H, this.options));
            for (let H of $) {
                if (i94(H)) return [H];
                w.set(H.value, H)
            }
            if (w.size > 1 && w.has("")) w.delete("");
            let j = [...w.values()];
            return n94.set(_, j), j
        }
        intersects(q, K) {
            if (!(q instanceof ca6)) throw TypeError("a Range is required");
            return this.set.some((_) => {
                return r94(_, K) && q.set.some((z) => {
                    return r94(z, K) && _.every((Y) => {
                        return z.every((A) => {
                            return Y.intersects(A, K)
                        })
                    })
                })
            })
        }
        test(q) {
            if (!q) return !1;
            if (typeof q === "string") try {
                q = new $b_(q, this.options)
            } catch (K) {
                return !1
            }
            for (let K = 0; K < this.set.length; K++)
                if (Eb_(this.set[K], q, this.options)) return !0;
            return !1
        }
    }
    o94.exports = ca6;
    var Ob_ = l94(),
        n94 = new Ob_,
        wb_ = _E8(),
        Ix1 = la6(),
        Mj = Qa6(),
        $b_ = dv(),
        {
            safeRe: nE,
            t: _k,
            comparatorTrimReplace: jb_,
            tildeTrimReplace: Hb_,
            caretTrimReplace: Jb_
        } = LN6(),
        {
            FLAG_INCLUDE_PRERELEASE: Xb_,
            FLAG_LOOSE: Mb_
        } = Ua6(),
        i94 = (q) => q.value === "<0.0.0-0",
        Pb_ = (q) => q.value === "",
        r94 = (q, K) => {
            let _ = !0,
                z = q.slice(),
                Y = z.pop();
            while (_ && z.length) _ = z.every((A) => {
                return Y.intersects(A, K)
            }), Y = z.pop();
            return _
        },
        Wb_ = (q, K) => {
            return Mj("comp", q, K), q = fb_(q, K), Mj("caret", q), q = Db_(q, K), Mj("tildes", q), q = vb_(q, K), Mj("xrange", q), q = Vb_(q, K), Mj("stars", q), q
        },
        zk = (q) => !q || q.toLowerCase() === "x" || q === "*",
        Db_ = (q, K) => {
            return q.trim().split(/\s+/).map((_) => Zb_(_, K)).join(" ")
        },
        Zb_ = (q, K) => {
            let _ = K.loose ? nE[_k.TILDELOOSE] : nE[_k.TILDE];
            return q.replace(_, (z, Y, A, O, w) => {
                Mj("tilde", q, z, Y, A, O, w);
                let $;
                if (zk(Y)) $ = "";
                else if (zk(A)) $ = `>=${Y}.0.0 <${+Y+1}.0.0-0`;
                else if (zk(O)) $ = `>=${Y}.${A}.0 <${Y}.${+A+1}.0-0`;
                else if (w) Mj("replaceTilde pr", w), $ = `>=${Y}.${A}.${O}-${w} <${Y}.${+A+1}.0-0`;
                else $ = `>=${Y}.${A}.${O} <${Y}.${+A+1}.0-0`;
                return Mj("tilde return", $), $
            })
        },
        fb_ = (q, K) => {
            return q.trim().split(/\s+/).map((_) => Gb_(_, K)).join(" ")
        },
        Gb_ = (q, K) => {
            Mj("caret", q, K);
            let _ = K.loose ? nE[_k.CARETLOOSE] : nE[_k.CARET],
                z = K.includePrerelease ? "-0" : "";
            return q.replace(_, (Y, A, O, w, $) => {
                Mj("caret", q, Y, A, O, w, $);
                let j;
                if (zk(A)) j = "";
                else if (zk(O)) j = `>=${A}.0.0${z} <${+A+1}.0.0-0`;
                else if (zk(w))
                    if (A === "0") j = `>=${A}.${O}.0${z} <${A}.${+O+1}.0-0`;
                    else j = `>=${A}.${O}.0${z} <${+A+1}.0.0-0`;
                else if ($)
                    if (Mj("replaceCaret pr", $), A === "0")
                        if (O === "0") j = `>=${A}.${O}.${w}-${$} <${A}.${O}.${+w+1}-0`;
                        else j = `>=${A}.${O}.${w}-${$} <${A}.${+O+1}.0-0`;
                else j = `>=${A}.${O}.${w}-${$} <${+A+1}.0.0-0`;
                else if (Mj("no pr"), A === "0")
                    if (O === "0") j = `>=${A}.${O}.${w}${z} <${A}.${O}.${+w+1}-0`;
                    else j = `>=${A}.${O}.${w}${z} <${A}.${+O+1}.0-0`;
                else j = `>=${A}.${O}.${w} <${+A+1}.0.0-0`;
                return Mj("caret return", j), j
            })
        },
        vb_ = (q, K) => {
            return Mj("replaceXRanges", q, K), q.split(/\s+/).map((_) => Tb_(_, K)).join(" ")
        },
        Tb_ = (q, K) => {
            q = q.trim();
            let _ = K.loose ? nE[_k.XRANGELOOSE] : nE[_k.XRANGE];
            return q.replace(_, (z, Y, A, O, w, $) => {
                Mj("xRange", q, z, Y, A, O, w, $);
                let j = zk(A),
                    H = j || zk(O),
                    J = H || zk(w),
                    X = J;
                if (Y === "=" && X) Y = "";
                if ($ = K.includePrerelease ? "-0" : "", j)
                    if (Y === ">" || Y === "<") z = "<0.0.0-0";
                    else z = "*";
                else if (Y && X) {
                    if (H) O = 0;
                    if (w = 0, Y === ">")
                        if (Y = ">=", H) A = +A + 1, O = 0, w = 0;
                        else O = +O + 1, w = 0;
                    else if (Y === "<=")
                        if (Y = "<", H) A = +A + 1;
                        else O = +O + 1;
                    if (Y === "<") $ = "-0";
                    z = `${Y+A}.${O}.${w}${$}`
                } else if (H) z = `>=${A}.0.0${$} <${+A+1}.0.0-0`;
                else if (J) z = `>=${A}.${O}.0${$} <${A}.${+O+1}.0-0`;
                return Mj("xRange return", z), z
            })
        },
        Vb_ = (q, K) => {
            return Mj("replaceStars", q, K), q.trim().replace(nE[_k.STAR], "")
        },
        kb_ = (q, K) => {
            return Mj("replaceGTE0", q, K), q.trim().replace(nE[K.includePrerelease ? _k.GTE0PRE : _k.GTE0], "")
        },
        Nb_ = (q) => (K, _, z, Y, A, O, w, $, j, H, J, X) => {
            if (zk(z)) _ = "";
            else if (zk(Y)) _ = `>=${z}.0.0${q?"-0":""}`;
            else if (zk(A)) _ = `>=${z}.${Y}.0${q?"-0":""}`;
            else if (O) _ = `>=${_}`;
            else _ = `>=${_}${q?"-0":""}`;
            if (zk(j)) $ = "";
            else if (zk(H)) $ = `<${+j+1}.0.0-0`;
            else if (zk(J)) $ = `<${j}.${+H+1}.0-0`;
            else if (X) $ = `<=${j}.${H}.${J}-${X}`;
            else if (q) $ = `<${j}.${H}.${+J+1}-0`;
            else $ = `<=${$}`;
            return `${_} ${$}`.trim()
        },
        Eb_ = (q, K, _) => {
            for (let z = 0; z < q.length; z++)
                if (!q[z].test(K)) return !1;
            if (K.prerelease.length && !_.includePrerelease) {
                for (let z = 0; z < q.length; z++) {
                    if (Mj(q[z].semver), q[z].semver === Ix1.ANY) continue;
                    if (q[z].semver.prerelease.length > 0) {
                        let Y = q[z].semver;
                        if (Y.major === K.major && Y.minor === K.minor && Y.patch === K.patch) return !0
                    }
                }
                return !1
            }
            return !0
        }
})
// @from(Ln 181775, Col 4)
la6 = p((K7w, K_4) => {
    var na6 = Symbol("SemVer ANY");
    class ME8 {
        static get ANY() {
            return na6
        }
        constructor(q, K) {
            if (K = a94(K), q instanceof ME8)
                if (q.loose === !!K.loose) return q;
                else q = q.value;
            if (q = q.trim().split(/\s+/).join(" "), ux1("comparator", q, K), this.options = K, this.loose = !!K.loose, this.parse(q), this.semver === na6) this.value = "";
            else this.value = this.operator + this.semver.version;
            ux1("comp", this)
        }
        parse(q) {
            let K = this.options.loose ? s94[t94.COMPARATORLOOSE] : s94[t94.COMPARATOR],
                _ = q.match(K);
            if (!_) throw TypeError(`Invalid comparator: ${q}`);
            if (this.operator = _[1] !== void 0 ? _[1] : "", this.operator === "=") this.operator = "";
            if (!_[2]) this.semver = na6;
            else this.semver = new e94(_[2], this.options.loose)
        }
        toString() {
            return this.value
        }
        test(q) {
            if (ux1("Comparator.test", q, this.options.loose), this.semver === na6 || q === na6) return !0;
            if (typeof q === "string") try {
                q = new e94(q, this.options)
            } catch (K) {
                return !1
            }
            return xx1(q, this.operator, this.semver, this.options)
        }
        intersects(q, K) {
            if (!(q instanceof ME8)) throw TypeError("a Comparator is required");
            if (this.operator === "") {
                if (this.value === "") return !0;
                return new q_4(q.value, K).test(this.value)
            } else if (q.operator === "") {
                if (q.value === "") return !0;
                return new q_4(this.value, K).test(q.semver)
            }
            if (K = a94(K), K.includePrerelease && (this.value === "<0.0.0-0" || q.value === "<0.0.0-0")) return !1;
            if (!K.includePrerelease && (this.value.startsWith("<0.0.0") || q.value.startsWith("<0.0.0"))) return !1;
            if (this.operator.startsWith(">") && q.operator.startsWith(">")) return !0;
            if (this.operator.startsWith("<") && q.operator.startsWith("<")) return !0;
            if (this.semver.version === q.semver.version && this.operator.includes("=") && q.operator.includes("=")) return !0;
            if (xx1(this.semver, "<", q.semver, K) && this.operator.startsWith(">") && q.operator.startsWith("<")) return !0;
            if (xx1(this.semver, ">", q.semver, K) && this.operator.startsWith("<") && q.operator.startsWith(">")) return !0;
            return !1
        }
    }
    K_4.exports = ME8;
    var a94 = _E8(),
        {
            safeRe: s94,
            t: t94
        } = LN6(),
        xx1 = bx1(),
        ux1 = Qa6(),
        e94 = dv(),
        q_4 = EI()
})
// @from(Ln 181839, Col 4)
ia6 = p((_7w, __4) => {
    var yb_ = EI(),
        Lb_ = (q, K, _) => {
            try {
                K = new yb_(K, _)
            } catch (z) {
                return !1
            }
            return K.test(q)
        };
    __4.exports = Lb_
})
// @from(Ln 181851, Col 4)
Y_4 = p((z7w, z_4) => {
    var hb_ = EI(),
        Rb_ = (q, K) => new hb_(q, K).set.map((_) => _.map((z) => z.value).join(" ").trim().split(" "));
    z_4.exports = Rb_
})
// @from(Ln 181856, Col 4)
O_4 = p((Y7w, A_4) => {
    var Sb_ = dv(),
        Cb_ = EI(),
        bb_ = (q, K, _) => {
            let z = null,
                Y = null,
                A = null;
            try {
                A = new Cb_(K, _)
            } catch (O) {
                return null
            }
            return q.forEach((O) => {
                if (A.test(O)) {
                    if (!z || Y.compare(O) === -1) z = O, Y = new Sb_(z, _)
                }
            }), z
        };
    A_4.exports = bb_
})
// @from(Ln 181876, Col 4)
$_4 = p((A7w, w_4) => {
    var Ib_ = dv(),
        xb_ = EI(),
        ub_ = (q, K, _) => {
            let z = null,
                Y = null,
                A = null;
            try {
                A = new xb_(K, _)
            } catch (O) {
                return null
            }
            return q.forEach((O) => {
                if (A.test(O)) {
                    if (!z || Y.compare(O) === 1) z = O, Y = new Ib_(z, _)
                }
            }), z
        };
    w_4.exports = ub_
})
// @from(Ln 181896, Col 4)
J_4 = p((O7w, H_4) => {
    var mx1 = dv(),
        mb_ = EI(),
        j_4 = da6(),
        Bb_ = (q, K) => {
            q = new mb_(q, K);
            let _ = new mx1("0.0.0");
            if (q.test(_)) return _;
            if (_ = new mx1("0.0.0-0"), q.test(_)) return _;
            _ = null;
            for (let z = 0; z < q.set.length; ++z) {
                let Y = q.set[z],
                    A = null;
                if (Y.forEach((O) => {
                        let w = new mx1(O.semver.version);
                        switch (O.operator) {
                            case ">":
                                if (w.prerelease.length === 0) w.patch++;
                                else w.prerelease.push(0);
                                w.raw = w.format();
                            case "":
                            case ">=":
                                if (!A || j_4(w, A)) A = w;
                                break;
                            case "<":
                            case "<=":
                                break;
                            default:
                                throw Error(`Unexpected operation: ${O.operator}`)
                        }
                    }), A && (!_ || j_4(_, A))) _ = A
            }
            if (_ && q.test(_)) return _;
            return null
        };
    H_4.exports = Bb_
})
// @from(Ln 181933, Col 4)
M_4 = p((w7w, X_4) => {
    var pb_ = EI(),
        Fb_ = (q, K) => {
            try {
                return new pb_(q, K).range || "*"
            } catch (_) {
                return null
            }
        };
    X_4.exports = Fb_
})
// @from(Ln 181944, Col 4)
PE8 = p(($7w, Z_4) => {
    var gb_ = dv(),
        D_4 = la6(),
        {
            ANY: Ub_
        } = D_4,
        Qb_ = EI(),
        db_ = ia6(),
        P_4 = da6(),
        W_4 = $E8(),
        cb_ = HE8(),
        lb_ = jE8(),
        nb_ = (q, K, _, z) => {
            q = new gb_(q, z), K = new Qb_(K, z);
            let Y, A, O, w, $;
            switch (_) {
                case ">":
                    Y = P_4, A = cb_, O = W_4, w = ">", $ = ">=";
                    break;
                case "<":
                    Y = W_4, A = lb_, O = P_4, w = "<", $ = "<=";
                    break;
                default:
                    throw TypeError('Must provide a hilo val of "<" or ">"')
            }
            if (db_(q, K, z)) return !1;
            for (let j = 0; j < K.set.length; ++j) {
                let H = K.set[j],
                    J = null,
                    X = null;
                if (H.forEach((M) => {
                        if (M.semver === Ub_) M = new D_4(">=0.0.0");
                        if (J = J || M, X = X || M, Y(M.semver, J.semver, z)) J = M;
                        else if (O(M.semver, X.semver, z)) X = M
                    }), J.operator === w || J.operator === $) return !1;
                if ((!X.operator || X.operator === w) && A(q, X.semver)) return !1;
                else if (X.operator === $ && O(q, X.semver)) return !1
            }
            return !0
        };
    Z_4.exports = nb_
})
// @from(Ln 181986, Col 4)
G_4 = p((j7w, f_4) => {
    var ib_ = PE8(),
        rb_ = (q, K, _) => ib_(q, K, ">", _);
    f_4.exports = rb_
})
// @from(Ln 181991, Col 4)
T_4 = p((H7w, v_4) => {
    var ob_ = PE8(),
        ab_ = (q, K, _) => ob_(q, K, "<", _);
    v_4.exports = ab_
})
// @from(Ln 181996, Col 4)
N_4 = p((J7w, k_4) => {
    var V_4 = EI(),
        sb_ = (q, K, _) => {
            return q = new V_4(q, _), K = new V_4(K, _), q.intersects(K, _)
        };
    k_4.exports = sb_
})
// @from(Ln 182003, Col 4)
y_4 = p((X7w, E_4) => {
    var tb_ = ia6(),
        eb_ = NI();
    E_4.exports = (q, K, _) => {
        let z = [],
            Y = null,
            A = null,
            O = q.sort((H, J) => eb_(H, J, _));
        for (let H of O)
            if (tb_(H, K, _)) {
                if (A = H, !Y) Y = H
            } else {
                if (A) z.push([Y, A]);
                A = null, Y = null
            } if (Y) z.push([Y, null]);
        let w = [];
        for (let [H, J] of z)
            if (H === J) w.push(H);
            else if (!J && H === O[0]) w.push("*");
        else if (!J) w.push(`>=${H}`);
        else if (H === O[0]) w.push(`<=${J}`);
        else w.push(`${H} - ${J}`);
        let $ = w.join(" || "),
            j = typeof K.raw === "string" ? K.raw : String(K);
        return $.length < j.length ? $ : K
    }
})
// @from(Ln 182030, Col 4)
b_4 = p((M7w, C_4) => {
    var L_4 = EI(),
        px1 = la6(),
        {
            ANY: Bx1
        } = px1,
        ra6 = ia6(),
        Fx1 = NI(),
        qI_ = (q, K, _ = {}) => {
            if (q === K) return !0;
            q = new L_4(q, _), K = new L_4(K, _);
            let z = !1;
            q: for (let Y of q.set) {
                for (let A of K.set) {
                    let O = _I_(Y, A, _);
                    if (z = z || O !== null, O) continue q
                }
                if (z) return !1
            }
            return !0
        },
        KI_ = [new px1(">=0.0.0-0")],
        h_4 = [new px1(">=0.0.0")],
        _I_ = (q, K, _) => {
            if (q === K) return !0;
            if (q.length === 1 && q[0].semver === Bx1)
                if (K.length === 1 && K[0].semver === Bx1) return !0;
                else if (_.includePrerelease) q = KI_;
            else q = h_4;
            if (K.length === 1 && K[0].semver === Bx1)
                if (_.includePrerelease) return !0;
                else K = h_4;
            let z = new Set,
                Y, A;
            for (let M of q)
                if (M.operator === ">" || M.operator === ">=") Y = R_4(Y, M, _);
                else if (M.operator === "<" || M.operator === "<=") A = S_4(A, M, _);
            else z.add(M.semver);
            if (z.size > 1) return null;
            let O;
            if (Y && A) {
                if (O = Fx1(Y.semver, A.semver, _), O > 0) return null;
                else if (O === 0 && (Y.operator !== ">=" || A.operator !== "<=")) return null
            }
            for (let M of z) {
                if (Y && !ra6(M, String(Y), _)) return null;
                if (A && !ra6(M, String(A), _)) return null;
                for (let P of K)
                    if (!ra6(M, String(P), _)) return !1;
                return !0
            }
            let w, $, j, H, J = A && !_.includePrerelease && A.semver.prerelease.length ? A.semver : !1,
                X = Y && !_.includePrerelease && Y.semver.prerelease.length ? Y.semver : !1;
            if (J && J.prerelease.length === 1 && A.operator === "<" && J.prerelease[0] === 0) J = !1;
            for (let M of K) {
                if (H = H || M.operator === ">" || M.operator === ">=", j = j || M.operator === "<" || M.operator === "<=", Y) {
                    if (X) {
                        if (M.semver.prerelease && M.semver.prerelease.length && M.semver.major === X.major && M.semver.minor === X.minor && M.semver.patch === X.patch) X = !1
                    }
                    if (M.operator === ">" || M.operator === ">=") {
                        if (w = R_4(Y, M, _), w === M && w !== Y) return !1
                    } else if (Y.operator === ">=" && !ra6(Y.semver, String(M), _)) return !1
                }
                if (A) {
                    if (J) {
                        if (M.semver.prerelease && M.semver.prerelease.length && M.semver.major === J.major && M.semver.minor === J.minor && M.semver.patch === J.patch) J = !1
                    }
                    if (M.operator === "<" || M.operator === "<=") {
                        if ($ = S_4(A, M, _), $ === M && $ !== A) return !1
                    } else if (A.operator === "<=" && !ra6(A.semver, String(M), _)) return !1
                }
                if (!M.operator && (A || Y) && O !== 0) return !1
            }
            if (Y && j && !A && O !== 0) return !1;
            if (A && H && !Y && O !== 0) return !1;
            if (X || J) return !1;
            return !0
        },
        R_4 = (q, K, _) => {
            if (!q) return K;
            let z = Fx1(q.semver, K.semver, _);
            return z > 0 ? q : z < 0 ? K : K.operator === ">" && q.operator === ">=" ? K : q
        },
        S_4 = (q, K, _) => {
            if (!q) return K;
            let z = Fx1(q.semver, K.semver, _);
            return z < 0 ? q : z > 0 ? K : K.operator === "<" && q.operator === "<=" ? K : q
        };
    C_4.exports = qI_
})
// @from(Ln 182120, Col 4)
Pd = p((P7w, u_4) => {
    var gx1 = LN6(),
        I_4 = Ua6(),
        zI_ = dv(),
        x_4 = Rx1(),
        YI_ = h$6(),
        AI_ = A94(),
        OI_ = w94(),
        wI_ = H94(),
        $I_ = M94(),
        jI_ = W94(),
        HI_ = Z94(),
        JI_ = G94(),
        XI_ = T94(),
        MI_ = NI(),
        PI_ = E94(),
        WI_ = L94(),
        DI_ = wE8(),
        ZI_ = C94(),
        fI_ = I94(),
        GI_ = da6(),
        vI_ = $E8(),
        TI_ = Sx1(),
        VI_ = Cx1(),
        kI_ = jE8(),
        NI_ = HE8(),
        EI_ = bx1(),
        yI_ = Q94(),
        LI_ = la6(),
        hI_ = EI(),
        RI_ = ia6(),
        SI_ = Y_4(),
        CI_ = O_4(),
        bI_ = $_4(),
        II_ = J_4(),
        xI_ = M_4(),
        uI_ = PE8(),
        mI_ = G_4(),
        BI_ = T_4(),
        pI_ = N_4(),
        FI_ = y_4(),
        gI_ = b_4();
    u_4.exports = {
        parse: YI_,
        valid: AI_,
        clean: OI_,
        inc: wI_,
        diff: $I_,
        major: jI_,
        minor: HI_,
        patch: JI_,
        prerelease: XI_,
        compare: MI_,
        rcompare: PI_,
        compareLoose: WI_,
        compareBuild: DI_,
        sort: ZI_,
        rsort: fI_,
        gt: GI_,
        lt: vI_,
        eq: TI_,
        neq: VI_,
        gte: kI_,
        lte: NI_,
        cmp: EI_,
        coerce: yI_,
        Comparator: LI_,
        Range: hI_,
        satisfies: RI_,
        toComparators: SI_,
        maxSatisfying: CI_,
        minSatisfying: bI_,
        minVersion: II_,
        validRange: xI_,
        outside: uI_,
        gtr: mI_,
        ltr: BI_,
        intersects: pI_,
        simplifyRange: FI_,
        subset: gI_,
        SemVer: zI_,
        re: gx1.re,
        src: gx1.src,
        tokens: gx1.t,
        SEMVER_SPEC_VERSION: I_4.SEMVER_SPEC_VERSION,
        RELEASE_TYPES: I_4.RELEASE_TYPES,
        compareIdentifiers: x_4.compareIdentifiers,
        rcompareIdentifiers: x_4.rcompareIdentifiers
    }
})
// @from(Ln 182211, Col 0)
function WE8() {
    if (!Ux1) Ux1 = Pd();
    return Ux1
}
// @from(Ln 182216, Col 0)
function RP(q, K) {
    if (typeof Bun < "u") return Bun.semver.order(q, K) === 1;
    return WE8().gt(q, K, {
        loose: !0
    })
}
// @from(Ln 182223, Col 0)
function QW(q, K) {
    if (typeof Bun < "u") return Bun.semver.order(q, K) >= 0;
    return WE8().gte(q, K, {
        loose: !0
    })
}
// @from(Ln 182230, Col 0)
function Qa(q, K) {
    if (typeof Bun < "u") return Bun.semver.order(q, K) === -1;
    return WE8().lt(q, K, {
        loose: !0
    })
}
// @from(Ln 182237, Col 0)
function Qx1(q, K) {
    if (typeof Bun < "u") return Bun.semver.satisfies(q, K);
    return WE8().satisfies(q, K, {
        loose: !0
    })
}
// @from(Ln 182243, Col 4)
Ux1
// @from(Ln 182245, Col 0)
function QI_() {
    return process.platform === "win32" && !!process.env.WT_SESSION
}
// @from(Ln 182249, Col 0)
function dI_() {
    if (process.env.TERM_PROGRAM === "mintty") return !0;
    if (process.platform === "win32" && process.env.MSYSTEM) return !0;
    return !1
}
// @from(Ln 182255, Col 0)
function cI_() {
    if (QI_()) return !0;
    if (process.platform === "win32" && process.env.TERM_PROGRAM === "vscode" && process.env.TERM_PROGRAM_VERSION) return !0;
    if (dI_()) return !0;
    return !1
}
// @from(Ln 182262, Col 0)
function dx1(q = !1) {
    if (process.platform === "win32")
        if (cI_()) return q ? Od + fI : Od + db1 + fI;
        else return Od + UI_;
    return q ? Od + fI : Od + db1 + fI
}
// @from(Ln 182268, Col 4)
UI_
// @from(Ln 182268, Col 9)
Z7w
// @from(Ln 182269, Col 4)
m_4 = L(() => {
    GI();
    UI_ = LA(0, "f");
    Z7w = dx1()
})
// @from(Ln 182275, Col 0)
function Wd(q) {
    return LA(`?${q}h`)
}
// @from(Ln 182279, Col 0)
function Dd(q) {
    return LA(`?${q}l`)
}
// @from(Ln 182282, Col 4)
yw
// @from(Ln 182282, Col 8)
B_4
// @from(Ln 182282, Col 13)
p_4
// @from(Ln 182282, Col 18)
F_4
// @from(Ln 182282, Col 23)
RN6
// @from(Ln 182282, Col 28)
cx1
// @from(Ln 182282, Col 33)
R$6
// @from(Ln 182282, Col 38)
g_4
// @from(Ln 182282, Col 43)
SN6
// @from(Ln 182282, Col 48)
aB
// @from(Ln 182282, Col 52)
CN6
// @from(Ln 182282, Col 57)
oa6
// @from(Ln 182282, Col 62)
bN6
// @from(Ln 182282, Col 67)
S$6
// @from(Ln 182282, Col 72)
da
// @from(Ln 182283, Col 4)
R46 = L(() => {
    GI();
    yw = {
        CURSOR_VISIBLE: 25,
        ALT_SCREEN: 47,
        ALT_SCREEN_CLEAR: 1049,
        MOUSE_NORMAL: 1000,
        MOUSE_BUTTON: 1002,
        MOUSE_ANY: 1003,
        MOUSE_SGR: 1006,
        FOCUS_EVENTS: 1004,
        BRACKETED_PASTE: 2004,
        THEME_NOTIFY: 2031,
        SYNCHRONIZED_UPDATE: 2026
    };
    B_4 = Wd(yw.SYNCHRONIZED_UPDATE), p_4 = Dd(yw.SYNCHRONIZED_UPDATE), F_4 = Wd(yw.BRACKETED_PASTE), RN6 = Dd(yw.BRACKETED_PASTE), cx1 = Wd(yw.FOCUS_EVENTS), R$6 = Dd(yw.FOCUS_EVENTS), g_4 = Wd(yw.THEME_NOTIFY), SN6 = Dd(yw.THEME_NOTIFY), aB = Wd(yw.CURSOR_VISIBLE), CN6 = Dd(yw.CURSOR_VISIBLE), oa6 = Wd(yw.ALT_SCREEN_CLEAR), bN6 = Dd(yw.ALT_SCREEN_CLEAR), S$6 = Wd(yw.MOUSE_NORMAL) + Wd(yw.MOUSE_BUTTON) + Wd(yw.MOUSE_ANY) + Wd(yw.MOUSE_SGR), da = Dd(yw.MOUSE_SGR) + Dd(yw.MOUSE_ANY) + Dd(yw.MOUSE_BUTTON) + Dd(yw.MOUSE_NORMAL)
})
// @from(Ln 182301, Col 0)
function Q_4() {
    if (!process.stdout.isTTY) return !1;
    if (process.env.WT_SESSION) return !1;
    if (process.env.ConEmuANSI || process.env.ConEmuPID || process.env.ConEmuTask) return !0;
    let q = U_4.coerce(process.env.TERM_PROGRAM_VERSION);
    if (!q) return !1;
    if (process.env.TERM_PROGRAM === "ghostty") return QW(q.version, "1.2.0");
    if (process.env.TERM_PROGRAM === "iTerm.app") return QW(q.version, "3.6.6");
    return !1
}
// @from(Ln 182312, Col 0)
function IN6() {
    if (process.env.TMUX) return !1;
    let q = process.env.TERM_PROGRAM,
        K = process.env.TERM;
    if (q === "iTerm.app" || q === "WezTerm" || q === "WarpTerminal" || q === "ghostty" || q === "contour" || q === "vscode" || q === "alacritty" || q === "mintty" || q === "rio" || q === "Tabby") return !0;
    if (parseInt(process.env.KONSOLE_VERSION ?? "", 10) >= 211200) return !0;
    if (K?.includes("kitty") || process.env.KITTY_WINDOW_ID) return !0;
    if (K === "xterm-ghostty") return !0;
    if (K?.startsWith("foot")) return !0;
    if (K?.includes("alacritty")) return !0;
    if (process.env.ZED_TERM) return !0;
    if (process.env.WT_SESSION) return !0;
    let _ = process.env.VTE_VERSION;
    if (_) {
        if (parseInt(_, 10) >= 6800) return !0
    }
    return !1
}
// @from(Ln 182331, Col 0)
function d_4(q) {
    if (lx1 === void 0) lx1 = q
}
// @from(Ln 182335, Col 0)
function ca() {
    if (process.env.TERM_PROGRAM === "vscode") return !0;
    return lx1?.startsWith("xterm.js") ?? !1
}
// @from(Ln 182340, Col 0)
function aa6(q) {
    return lI_.includes(q ?? X7.terminal ?? "")
}
// @from(Ln 182344, Col 0)
function c_4() {
    return process.platform === "win32" || !!process.env.WT_SESSION
}
// @from(Ln 182348, Col 0)
function nI_() {
    return IN6() && process.env.ZELLIJ == null
}
// @from(Ln 182352, Col 0)
function nx1(q, K, _ = !1) {
    if (K.length === 0) return;
    let z = !_,
        Y = z ? B_4 : "";
    for (let A of K) switch (A.type) {
        case "stdout":
            Y += A.content;
            break;
        case "clear":
            if (A.count > 0) Y += c44(A.count);
            break;
        case "clearTerminal":
            Y += dx1(!A.altScreen);
            break;
        case "cursorHide":
            Y += CN6;
            break;
        case "cursorShow":
            Y += aB;
            break;
        case "cursorMove":
            Y += P$6(A.x, A.y);
            break;
        case "cursorTo":
            Y += d44(A.col);
            break;
        case "carriageReturn":
            Y += "\r";
            break;
        case "hyperlink":
            Y += YN8(A.uri);
            break;
        case "styleStr":
            Y += A.str;
            break
    }
    if (z) Y += p_4;
    q.stdout.write(Y)
}
// @from(Ln 182391, Col 4)
U_4
// @from(Ln 182391, Col 9)
lx1
// @from(Ln 182391, Col 14)
lI_
// @from(Ln 182391, Col 19)
L7w
// @from(Ln 182391, Col 24)
DE8
// @from(Ln 182392, Col 4)
la = L(() => {
    D_();
    m_4();
    GI();
    R46();
    HX();
    U_4 = K6(Pd(), 1);
    lI_ = ["iTerm.app", "kitty", "WezTerm", "ghostty", "tmux", "windows-terminal", "WarpTerminal"];
    L7w = IN6();
    DE8 = nI_()
})
// @from(Ln 182404, Col 0)
function ox1(q) {
    rx1 = q ? "focused" : "blurred", c61(q);
    for (let K of ix1) K();
    if (!q) {
        for (let K of l_4) K();
        l_4.clear()
    }
}
// @from(Ln 182413, Col 0)
function xN6() {
    return rx1 !== "blurred"
}
// @from(Ln 182417, Col 0)
function sa6() {
    return rx1
}
// @from(Ln 182421, Col 0)
function ta6(q) {
    return ix1.add(q), () => {
        ix1.delete(q)
    }
}
// @from(Ln 182426, Col 4)
rx1 = "unknown"
// @from(Ln 182427, Col 4)
l_4
// @from(Ln 182427, Col 9)
ix1
// @from(Ln 182428, Col 4)
uN6 = L(() => {
    y8();
    l_4 = new Set, ix1 = new Set
})
// @from(Ln 182432, Col 4)
n_4
// @from(Ln 182432, Col 9)
i_4
// @from(Ln 182432, Col 14)
mN6
// @from(Ln 182433, Col 4)
ZE8 = L(() => {
    n_4 = K6(P6(), 1), i_4 = n_4.createContext({
        exit() {},
        focusManager: null,
        rootNode: null
    });
    i_4.displayName = "InternalAppContext";
    mN6 = i_4
})
// @from(Ln 182442, Col 4)
C$6 = 16
// @from(Ln 182444, Col 0)
function r_4(q) {
    let K = s(6),
        {
            children: _
        } = q,
        z = b$6.useSyncExternalStore(ta6, xN6),
        Y = b$6.useSyncExternalStore(ta6, sa6),
        A;
    if (K[0] !== z || K[1] !== Y) A = {
        isTerminalFocused: z,
        terminalFocusState: Y
    }, K[0] = z, K[1] = Y, K[2] = A;
    else A = K[2];
    let O = A,
        w;
    if (K[3] !== _ || K[4] !== O) w = b$6.default.createElement(ax1.Provider, {
        value: O
    }, _), K[3] = _, K[4] = O, K[5] = w;
    else w = K[5];
    return w
}
// @from(Ln 182465, Col 4)
b$6
// @from(Ln 182465, Col 9)
ax1
// @from(Ln 182465, Col 14)
o_4
// @from(Ln 182466, Col 4)
sx1 = L(() => {
    o6();
    uN6();
    b$6 = K6(P6(), 1), ax1 = b$6.createContext({
        isTerminalFocused: !0,
        terminalFocusState: "unknown"
    });
    ax1.displayName = "TerminalFocusContext";
    o_4 = ax1
})
// @from(Ln 182477, Col 0)
function K2() {
    let {
        isTerminalFocused: q
    } = a_4.useContext(o_4);
    return q
}
// @from(Ln 182483, Col 4)
a_4
// @from(Ln 182484, Col 4)
ea6 = L(() => {
    sx1();
    a_4 = K6(P6(), 1)
})
// @from(Ln 182489, Col 0)
function iI_(q) {
    let K = new Map,
        _ = null,
        z = q,
        Y = 0,
        A = 0;

    function O() {
        A = Date.now() - Y;
        for (let $ of K.keys()) $()
    }

    function w() {
        if ([...K.values()].some(Boolean)) {
            if (_) clearInterval(_), _ = null;
            if (Y === 0) Y = Date.now();
            _ = setInterval(O, z)
        } else if (_) clearInterval(_), _ = null
    }
    return {
        subscribe($, j) {
            return K.set($, j), w(), () => {
                K.delete($), w()
            }
        },
        now() {
            if (Y === 0) Y = Date.now();
            if (_ && A) return A;
            return Date.now() - Y
        },
        setTickInterval($) {
            if ($ === z) return;
            z = $, w()
        }
    }
}
// @from(Ln 182526, Col 0)
function s_4(q) {
    let K = s(7),
        {
            children: _
        } = q,
        [z] = S46.useState(oI_),
        Y = K2(),
        A, O;
    if (K[0] !== z || K[1] !== Y) A = () => {
        z.setTickInterval(Y ? C$6 : rI_)
    }, O = [z, Y], K[0] = z, K[1] = Y, K[2] = A, K[3] = O;
    else A = K[2], O = K[3];
    S46.useEffect(A, O);
    let w;
    if (K[4] !== _ || K[5] !== z) w = S46.default.createElement(BN6.Provider, {
        value: z
    }, _), K[4] = _, K[5] = z, K[6] = w;
    else w = K[6];
    return w
}
// @from(Ln 182547, Col 0)
function oI_() {
    return iI_(C$6)
}
// @from(Ln 182550, Col 4)
S46
// @from(Ln 182550, Col 9)
BN6
// @from(Ln 182550, Col 14)
rI_
// @from(Ln 182551, Col 4)
fE8 = L(() => {
    o6();
    ea6();
    S46 = K6(P6(), 1);
    BN6 = S46.createContext(null), rI_ = C$6 * 2
})
// @from(Ln 182557, Col 4)
t_4
// @from(Ln 182557, Col 9)
aI_
// @from(Ln 182557, Col 14)
GE8
// @from(Ln 182558, Col 4)
tx1 = L(() => {
    t_4 = K6(P6(), 1), aI_ = t_4.createContext(() => {}), GE8 = aI_
})
// @from(Ln 182561, Col 4)
sI_ = (q, K = 2) => {
        return q.replace(/^\t+/gm, (_) => " ".repeat(_.length * K))
    }
// @from(Ln 182564, Col 4)
e_4
// @from(Ln 182565, Col 4)
qz4 = L(() => {
    e_4 = sI_
})
// @from(Ln 182568, Col 4)
tI_ = (q, K) => {
        let _ = [],
            z = q - K,
            Y = q + K;
        for (let A = z; A <= Y; A++) _.push(A);
        return _
    }
// @from(Ln 182575, Col 4)
eI_ = (q, K, _ = {}) => {
        var z;
        if (typeof q !== "string") throw TypeError("Source code is missing.");
        if (!K || K < 1) throw TypeError("Line number must start from `1`.");
        let Y = e_4(q).split(/\r?\n/);
        if (K > Y.length) return;
        return tI_(K, (z = _.around) !== null && z !== void 0 ? z : 3).filter((A) => Y[A - 1] !== void 0).map((A) => ({
            line: A,
            value: Y[A - 1]
        }))
    }
// @from(Ln 182586, Col 4)
Kz4
// @from(Ln 182587, Col 4)
_z4 = L(() => {
    qz4();
    Kz4 = eI_
})
// @from(Ln 182591, Col 4)
Yz4 = p((i7w, zz4) => {
    var qx_ = /[|\\{}()[\]^$+*?.-]/g;
    zz4.exports = (q) => {
        if (typeof q !== "string") throw TypeError("Expected a string");
        return q.replace(qx_, "\\$&")
    }
})
// @from(Ln 182598, Col 4)
$z4 = p((r7w, wz4) => {
    var Kx_ = Yz4(),
        _x_ = typeof process === "object" && process && typeof process.cwd === "function" ? process.cwd() : ".",
        Oz4 = [].concat(d6("module").builtinModules, "bootstrap_node", "node").map((q) => new RegExp(`(?:\\((?:node:)?${q}(?:\\.js)?:\\d+:\\d+\\)$|^\\s*at (?:node:)?${q}(?:\\.js)?:\\d+:\\d+$)`));
    Oz4.push(/\((?:node:)?internal\/[^:]+:\d+:\d+\)$/, /\s*at (?:node:)?internal\/[^:]+:\d+:\d+$/, /\/\.node-spawn-wrap-\w+-\w+\/node:\d+:\d+\)?$/);
    class ex1 {
        constructor(q) {
            if (q = {
                    ignoredPackages: [],
                    ...q
                }, "internals" in q === !1) q.internals = ex1.nodeInternals();
            if ("cwd" in q === !1) q.cwd = _x_;
            this._cwd = q.cwd.replace(/\\/g, "/"), this._internals = [].concat(q.internals, zx_(q.ignoredPackages)), this._wrapCallSite = q.wrapCallSite || !1
        }
        static nodeInternals() {
            return [...Oz4]
        }
        clean(q, K = 0) {
            if (K = " ".repeat(K), !Array.isArray(q)) q = q.split(`
`);
            if (!/^\s*at /.test(q[0]) && /^\s*at /.test(q[1])) q = q.slice(1);
            let _ = !1,
                z = null,
                Y = [];
            return q.forEach((A) => {
                if (A = A.replace(/\\/g, "/"), this._internals.some((w) => w.test(A))) return;
                let O = /^\s*at /.test(A);
                if (_) A = A.trimEnd().replace(/^(\s+)at /, "$1");
                else if (A = A.trim(), O) A = A.slice(3);
                if (A = A.replace(`${this._cwd}/`, ""), A)
                    if (O) {
                        if (z) Y.push(z), z = null;
                        Y.push(A)
                    } else _ = !0, z = A
            }), Y.map((A) => `${K}${A}
`).join("")
        }
        captureString(q, K = this.captureString) {
            if (typeof q === "function") K = q, q = 1 / 0;
            let {
                stackTraceLimit: _
            } = Error;
            if (q) Error.stackTraceLimit = q;
            let z = {};
            Error.captureStackTrace(z, K);
            let {
                stack: Y
            } = z;
            return Error.stackTraceLimit = _, this.clean(Y)
        }
        capture(q, K = this.capture) {
            if (typeof q === "function") K = q, q = 1 / 0;
            let {
                prepareStackTrace: _,
                stackTraceLimit: z
            } = Error;
            if (Error.prepareStackTrace = (O, w) => {
                    if (this._wrapCallSite) return w.map(this._wrapCallSite);
                    return w
                }, q) Error.stackTraceLimit = q;
            let Y = {};
            Error.captureStackTrace(Y, K);
            let {
                stack: A
            } = Y;
            return Object.assign(Error, {
                prepareStackTrace: _,
                stackTraceLimit: z
            }), A
        }
        at(q = this.at) {
            let [K] = this.capture(1, q);
            if (!K) return {};
            let _ = {
                line: K.getLineNumber(),
                column: K.getColumnNumber()
            };
            if (Az4(_, K.getFileName(), this._cwd), K.isConstructor()) Object.defineProperty(_, "constructor", {
                value: !0,
                configurable: !0
            });
            if (K.isEval()) _.evalOrigin = K.getEvalOrigin();
            if (K.isNative()) _.native = !0;
            let z;
            try {
                z = K.getTypeName()
            } catch (O) {}
            if (z && z !== "Object" && z !== "[object Object]") _.type = z;
            let Y = K.getFunctionName();
            if (Y) _.function = Y;
            let A = K.getMethodName();
            if (A && Y !== A) _.method = A;
            return _
        }
        parseLine(q) {
            let K = q && q.match(Yx_);
            if (!K) return null;
            let _ = K[1] === "new",
                z = K[2],
                Y = K[3],
                A = K[4],
                O = Number(K[5]),
                w = Number(K[6]),
                $ = K[7],
                j = K[8],
                H = K[9],
                J = K[10] === "native",
                X = K[11] === ")",
                M, P = {};
            if (j) P.line = Number(j);
            if (H) P.column = Number(H);
            if (X && $) {
                let W = 0;
                for (let D = $.length - 1; D > 0; D--)
                    if ($.charAt(D) === ")") W++;
                    else if ($.charAt(D) === "(" && $.charAt(D - 1) === " ") {
                    if (W--, W === -1 && $.charAt(D - 1) === " ") {
                        let Z = $.slice(0, D - 1);
                        $ = $.slice(D + 1), z += ` (${Z}`;
                        break
                    }
                }
            }
            if (z) {
                let W = z.match(Ax_);
                if (W) z = W[1], M = W[2]
            }
            if (Az4(P, $, this._cwd), _) Object.defineProperty(P, "constructor", {
                value: !0,
                configurable: !0
            });
            if (Y) P.evalOrigin = Y, P.evalLine = O, P.evalColumn = w, P.evalFile = A && A.replace(/\\/g, "/");
            if (J) P.native = !0;
            if (z) P.function = z;
            if (M && z !== M) P.method = M;
            return P
        }
    }

    function Az4(q, K, _) {
        if (K) {
            if (K = K.replace(/\\/g, "/"), K.startsWith(`${_}/`)) K = K.slice(_.length + 1);
            q.file = K
        }
    }

    function zx_(q) {
        if (q.length === 0) return [];
        let K = q.map((_) => Kx_(_));
        return new RegExp(`[/\\\\]node_modules[/\\\\](?:${K.join("|")})[/\\\\][^:]+:\\d+:\\d+`)
    }
    var Yx_ = new RegExp("^(?:\\s*at )?(?:(new) )?(?:(.*?) \\()?(?:eval at ([^ ]+) \\((.+?):(\\d+):(\\d+)\\), )?(?:(.+?):(\\d+):(\\d+)|(native))(\\)?)$"),
        Ax_ = /^(.*?) \[as (.*?)\]$/;
    wz4.exports = ex1
})
// @from(Ln 182754, Col 0)
function Ox_(q) {
    let K = s(52),
        _, z, Y, A, O, w, $, j, H, J, X, M, P, W, D, Z, G, f, v, V, k, N, R;
    if (K[0] !== q) {
        let {
            children: m,
            flexWrap: S,
            flexDirection: F,
            flexGrow: U,
            flexShrink: g,
            ref: c,
            tabIndex: n,
            autoFocus: l,
            onClick: z6,
            onFocus: A6,
            onFocusCapture: e,
            onBlur: i,
            onBlurCapture: O6,
            onMouseEnter: J6,
            onMouseLeave: $6,
            hoverIgnoresBlankCells: H6,
            onKeyDown: q6,
            onKeyDownCapture: o,
            onPaste: _6,
            onPasteCapture: r,
            onWheel: t,
            onWheelCapture: Y6,
            ...X6
        } = q;
        if (z = m, k = c, R = n, _ = l, J = z6, X = A6, M = e, j = i, H = O6, D = J6, Z = $6, $ = H6, P = q6, W = o, G = _6, f = r, v = t, V = Y6, N = X6, w = S === void 0 ? "nowrap" : S, Y = F === void 0 ? "row" : F, A = U === void 0 ? 0 : U, O = g === void 0 ? 1 : g, MJ(N.margin, "margin"), MJ(N.marginX, "marginX"), MJ(N.marginY, "marginY"), MJ(N.marginTop, "marginTop"), MJ(N.marginBottom, "marginBottom"), N.marginLeft !== "auto") MJ(N.marginLeft, "marginLeft");
        if (N.marginRight !== "auto") MJ(N.marginRight, "marginRight");
        MJ(N.padding, "padding"), MJ(N.paddingX, "paddingX"), MJ(N.paddingY, "paddingY"), MJ(N.paddingTop, "paddingTop"), MJ(N.paddingBottom, "paddingBottom"), MJ(N.paddingLeft, "paddingLeft"), MJ(N.paddingRight, "paddingRight"), MJ(N.gap, "gap"), MJ(N.columnGap, "columnGap"), MJ(N.rowGap, "rowGap"), K[0] = q, K[1] = _, K[2] = z, K[3] = Y, K[4] = A, K[5] = O, K[6] = w, K[7] = $, K[8] = j, K[9] = H, K[10] = J, K[11] = X, K[12] = M, K[13] = P, K[14] = W, K[15] = D, K[16] = Z, K[17] = G, K[18] = f, K[19] = v, K[20] = V, K[21] = k, K[22] = N, K[23] = R
    } else _ = K[1], z = K[2], Y = K[3], A = K[4], O = K[5], w = K[6], $ = K[7], j = K[8], H = K[9], J = K[10], X = K[11], M = K[12], P = K[13], W = K[14], D = K[15], Z = K[16], G = K[17], f = K[18], v = K[19], V = K[20], k = K[21], N = K[22], R = K[23];
    let h = N.overflowX ?? N.overflow ?? "visible",
        C = N.overflowY ?? N.overflow ?? "visible",
        x;
    if (K[24] !== Y || K[25] !== A || K[26] !== O || K[27] !== w || K[28] !== N || K[29] !== h || K[30] !== C) x = {
        flexWrap: w,
        flexDirection: Y,
        flexGrow: A,
        flexShrink: O,
        ...N,
        overflowX: h,
        overflowY: C
    }, K[24] = Y, K[25] = A, K[26] = O, K[27] = w, K[28] = N, K[29] = h, K[30] = C, K[31] = x;
    else x = K[31];
    let B;
    if (K[32] !== _ || K[33] !== z || K[34] !== $ || K[35] !== j || K[36] !== H || K[37] !== J || K[38] !== X || K[39] !== M || K[40] !== P || K[41] !== W || K[42] !== D || K[43] !== Z || K[44] !== G || K[45] !== f || K[46] !== v || K[47] !== V || K[48] !== k || K[49] !== x || K[50] !== R) B = jz4.default.createElement("ink-box", {
        ref: k,
        tabIndex: R,
        autoFocus: _,
        onClick: J,
        onFocus: X,
        onFocusCapture: M,
        onBlur: j,
        onBlurCapture: H,
        onMouseEnter: D,
        onMouseLeave: Z,
        hoverIgnoresBlankCells: $,
        onKeyDown: P,
        onKeyDownCapture: W,
        onPaste: G,
        onPasteCapture: f,
        onWheel: v,
        onWheelCapture: V,
        style: x
    }, z), K[32] = _, K[33] = z, K[34] = $, K[35] = j, K[36] = H, K[37] = J, K[38] = X, K[39] = M, K[40] = P, K[41] = W, K[42] = D, K[43] = Z, K[44] = G, K[45] = f, K[46] = v, K[47] = V, K[48] = k, K[49] = x, K[50] = R, K[51] = B;
    else B = K[51];
    return B
}
// @from(Ln 182824, Col 4)
jz4
// @from(Ln 182824, Col 9)
JH
// @from(Ln 182825, Col 4)
na = L(() => {
    o6();
    Gx1();
    jz4 = K6(P6(), 1);
    JH = Ox_
})
// @from(Ln 182832, Col 0)
function hA(q) {
    let K = s(29),
        {
            color: _,
            backgroundColor: z,
            bold: Y,
            dim: A,
            italic: O,
            underline: w,
            strikethrough: $,
            inverse: j,
            wrap: H,
            children: J
        } = q,
        X = O === void 0 ? !1 : O,
        M = w === void 0 ? !1 : w,
        P = $ === void 0 ? !1 : $,
        W = j === void 0 ? !1 : j,
        D = H === void 0 ? "wrap" : H;
    if (J === void 0 || J === null) return null;
    let Z;
    if (K[0] !== _) Z = _ && {
        color: _
    }, K[0] = _, K[1] = Z;
    else Z = K[1];
    let G;
    if (K[2] !== z) G = z && {
        backgroundColor: z
    }, K[2] = z, K[3] = G;
    else G = K[3];
    let f;
    if (K[4] !== A) f = A && {
        dim: A
    }, K[4] = A, K[5] = f;
    else f = K[5];
    let v;
    if (K[6] !== Y) v = Y && {
        bold: Y
    }, K[6] = Y, K[7] = v;
    else v = K[7];
    let V;
    if (K[8] !== X) V = X && {
        italic: X
    }, K[8] = X, K[9] = V;
    else V = K[9];
    let k;
    if (K[10] !== M) k = M && {
        underline: M
    }, K[10] = M, K[11] = k;
    else k = K[11];
    let N;
    if (K[12] !== P) N = P && {
        strikethrough: P
    }, K[12] = P, K[13] = N;
    else N = K[13];
    let R;
    if (K[14] !== W) R = W && {
        inverse: W
    }, K[14] = W, K[15] = R;
    else R = K[15];
    let h;
    if (K[16] !== V || K[17] !== k || K[18] !== N || K[19] !== R || K[20] !== Z || K[21] !== G || K[22] !== f || K[23] !== v) h = {
        ...Z,
        ...G,
        ...f,
        ...v,
        ...V,
        ...k,
        ...N,
        ...R
    }, K[16] = V, K[17] = k, K[18] = N, K[19] = R, K[20] = Z, K[21] = G, K[22] = f, K[23] = v, K[24] = h;
    else h = K[24];
    let C = h,
        x = wx_[D],
        B;
    if (K[25] !== J || K[26] !== x || K[27] !== C) B = Hz4.default.createElement("ink-text", {
        style: x,
        textStyles: C
    }, J), K[25] = J, K[26] = x, K[27] = C, K[28] = B;
    else B = K[28];
    return B
}
// @from(Ln 182914, Col 4)
Hz4
// @from(Ln 182914, Col 9)
wx_
// @from(Ln 182915, Col 4)
I$6 = L(() => {
    o6();
    Hz4 = K6(P6(), 1), wx_ = {
        wrap: {
            flexGrow: 0,
            flexShrink: 1,
            flexDirection: "row",
            textWrap: "wrap"
        },
        "wrap-trim": {
            flexGrow: 0,
            flexShrink: 1,
            flexDirection: "row",
            textWrap: "wrap-trim"
        },
        end: {
            flexGrow: 0,
            flexShrink: 1,
            flexDirection: "row",
            textWrap: "end"
        },
        middle: {
            flexGrow: 0,
            flexShrink: 1,
            flexDirection: "row",
            textWrap: "middle"
        },
        "truncate-end": {
            flexGrow: 0,
            flexShrink: 1,
            flexDirection: "row",
            textWrap: "truncate-end"
        },
        truncate: {
            flexGrow: 0,
            flexShrink: 1,
            flexDirection: "row",
            textWrap: "truncate"
        },
        "truncate-middle": {
            flexGrow: 0,
            flexShrink: 1,
            flexDirection: "row",
            textWrap: "truncate-middle"
        },
        "truncate-start": {
            flexGrow: 0,
            flexShrink: 1,
            flexDirection: "row",
            textWrap: "truncate-start"
        }
    }
})
// @from(Ln 182972, Col 0)
function Xz4() {
    return jx_ ??= new qu1.default({
        cwd: process.cwd(),
        internals: qu1.default.nodeInternals()
    })
}
// @from(Ln 182979, Col 0)
function Ku1({
    error: q
}) {
    let K = q.stack ? q.stack.split(`
`).slice(1) : void 0,
        _ = K ? Xz4().parseLine(K[0]) : void 0,
        z = Jz4(_?.file),
        Y, A = 0;
    if (z && _?.line) try {
        let O = $x_(z, "utf8");
        if (Y = Kz4(O, _.line), Y)
            for (let {
                    line: w
                }
                of Y) A = Math.max(A, String(w).length)
    } catch {}
    return SP.default.createElement(JH, {
        flexDirection: "column",
        padding: 1
    }, SP.default.createElement(JH, null, SP.default.createElement(hA, {
        backgroundColor: "ansi:red",
        color: "ansi:white"
    }, " ", "ERROR", " "), SP.default.createElement(hA, null, " ", q.message)), _ && z && SP.default.createElement(JH, {
        marginTop: 1
    }, SP.default.createElement(hA, {
        dim: !0
    }, z, ":", _.line, ":", _.column)), _ && Y && SP.default.createElement(JH, {
        marginTop: 1,
        flexDirection: "column"
    }, Y.map(({
        line: O,
        value: w
    }) => SP.default.createElement(JH, {
        key: O
    }, SP.default.createElement(JH, {
        width: A + 1
    }, SP.default.createElement(hA, {
        dim: O !== _.line,
        backgroundColor: O === _.line ? "ansi:red" : void 0,
        color: O === _.line ? "ansi:white" : void 0
    }, String(O).padStart(A, " "), ":")), SP.default.createElement(hA, {
        key: O,
        backgroundColor: O === _.line ? "ansi:red" : void 0,
        color: O === _.line ? "ansi:white" : void 0
    }, " " + w)))), q.stack && SP.default.createElement(JH, {
        marginTop: 1,
        flexDirection: "column"
    }, q.stack.split(`
`).slice(1).map((O) => {
        let w = Xz4().parseLine(O);
        if (!w) return SP.default.createElement(JH, {
            key: O
        }, SP.default.createElement(hA, {
            dim: !0
        }, "- "), SP.default.createElement(hA, {
            bold: !0
        }, O));
        return SP.default.createElement(JH, {
            key: O
        }, SP.default.createElement(hA, {
            dim: !0
        }, "- "), SP.default.createElement(hA, {
            bold: !0
        }, w.function), SP.default.createElement(hA, {
            dim: !0
        }, " ", "(", Jz4(w.file) ?? "", ":", w.line, ":", w.column, ")"))
    })))
}
// @from(Ln 183047, Col 4)
SP
// @from(Ln 183047, Col 8)
qu1
// @from(Ln 183047, Col 13)
Jz4 = (q) => {
        return q?.replace(`file://${process.cwd()}/`, "")
    }
// @from(Ln 183050, Col 4)
jx_
// @from(Ln 183051, Col 4)
Mz4 = L(() => {
    _z4();
    na();
    I$6();
    SP = K6(P6(), 1), qu1 = K6($z4(), 1)
})
// @from(Ln 183057, Col 4)
Pz4
// @from(Ln 183057, Col 9)
C46
// @from(Ln 183058, Col 4)
qs6 = L(() => {
    Pz4 = K6(P6(), 1), C46 = Pz4.createContext(null)
})
// @from(Ln 183062, Col 0)
function Xx_(q, K, _, z) {
    if (K.some((Y) => Y.kind === "key" && Y.sequence !== cb1 && Y.sequence !== lb1 || Y.kind === "mouse" && !((Y.button & 32) !== 0 && (Y.button & 3) === 3))) hi();
    for (let Y of K) {
        if (Y.kind === "response") {
            if (Y.response.type === "themeNotify") {
                OK4();
                continue
            }
            q.querier?.onResponse(Y.response);
            continue
        }
        if (Y.kind === "mouse") {
            Mx_(q, Y);
            continue
        }
        let A = Y.sequence;
        if (A === cb1) {
            q.handleTerminalFocus(!0);
            let w = new PN6("terminalfocus");
            q.internal_eventEmitter.emit("terminalfocus", w);
            continue
        }
        if (A === lb1) {
            if (q.handleTerminalFocus(!1), q.props.selection.isDragging) yN6(q.props.selection), q.props.onSelectionChange();
            let w = new PN6("terminalblur");
            q.internal_eventEmitter.emit("terminalblur", w);
            continue
        }
        if (!xN6()) ox1(!0);
        if (Y.name === "z" && Y.ctrl) {
            let w = {
                claimed: !1
            };
            if (q.internal_eventEmitter.emit("pre-suspend", w), w.claimed) continue;
            if (Hx_) {
                q.handleSuspend();
                continue
            }
        }
        if (!Y.isPasted) q.handleInput(A);
        let O = new Ta6(Y);
        if (q.internal_eventEmitter.emit("input", O), Y.isPasted) q.props.dispatchPasteEvent(Y.sequence ?? "");
        else if (Y.name === "wheelup" || Y.name === "wheeldown" || Y.name === "mouse") {
            if (Y.name !== "mouse") q.props.dispatchWheelEvent(Y)
        } else if (!O.didStopImmediatePropagation()) q.props.dispatchKeyboardEvent(Y)
    }
}
// @from(Ln 183110, Col 0)
function Mx_(q, K) {
    let _ = q.props.selection,
        z = K.col - 1,
        Y = K.row - 1,
        A = K.button & 3;
    if (K.action === "press") {
        if ((K.button & 32) !== 0 && A === 3) {
            if (_.isDragging) yN6(_), q.props.onSelectionChange();
            if (z === q.lastHoverCol && Y === q.lastHoverRow) return;
            q.lastHoverCol = z, q.lastHoverRow = Y, q.props.onHoverAt(z, Y);
            return
        }
        if (A !== 0) {
            q.clickCount = 0;
            return
        }
        if ((K.button & 32) !== 0) {
            q.props.onSelectionDrag(z, Y);
            return
        }
        if (_.isDragging) yN6(_), q.props.onSelectionChange();
        let O = Date.now(),
            w = O - q.lastClickTime < Wz4 && Math.abs(z - q.lastClickCol) <= Dz4 && Math.abs(Y - q.lastClickRow) <= Dz4;
        if (q.clickCount = w ? q.clickCount + 1 : 1, q.lastClickTime = O, q.lastClickCol = z, q.lastClickRow = Y, q.clickCount >= 2) {
            if (q.pendingHyperlinkTimer) clearTimeout(q.pendingHyperlinkTimer), q.pendingHyperlinkTimer = null;
            let $ = q.clickCount === 2 ? 2 : 3;
            q.props.onMultiClick(z, Y, $);
            return
        }
        tN8(_, z, Y), _.lastPressHadAlt = (K.button & 8) !== 0, q.props.onSelectionChange();
        return
    }
    if (A !== 0) {
        if (!_.isDragging) return;
        yN6(_), q.props.onSelectionChange();
        return
    }
    if (yN6(_), !kI(_) && _.anchor) {
        if (!q.props.onClickAt(z, Y)) {
            let O = q.props.getHyperlinkAt(z, Y);
            if (O && process.env.TERM_PROGRAM !== "vscode" && !ca()) {
                if (q.pendingHyperlinkTimer) clearTimeout(q.pendingHyperlinkTimer);
                q.pendingHyperlinkTimer = setTimeout((w, $) => {
                    w.pendingHyperlinkTimer = null, w.props.onOpenHyperlink($)
                }, Wz4, q, O)
            }
        }
    }
    q.props.onSelectionChange()
}
// @from(Ln 183160, Col 4)
Zd
// @from(Ln 183160, Col 8)
Hx_
// @from(Ln 183160, Col 13)
Jx_ = 5000
// @from(Ln 183161, Col 4)
Wz4 = 500
// @from(Ln 183162, Col 4)
Dz4 = 1
// @from(Ln 183163, Col 4)
vE8
// @from(Ln 183164, Col 4)
Zz4 = L(() => {
    y8();
    K8();
    Ga6();
    Q8();
    Q4();
    U8();
    qN8();
    GI1();
    vI1();
    fI1();
    xa6();
    KE8();
    la();
    uN6();
    rb1();
    ab1();
    GI();
    R46();
    ZE8();
    fE8();
    tx1();
    Mz4();
    wa6();
    sx1();
    qs6();
    Zd = K6(P6(), 1), Hx_ = process.platform !== "win32";
    vE8 = class vE8 extends Zd.PureComponent {
        static displayName = "InternalApp";
        static getDerivedStateFromError(q) {
            return {
                error: q
            }
        }
        state = {
            error: void 0
        };
        rawModeEnabledCount = 0;
        internal_eventEmitter = new M$6;
        keyParseState = Y54;
        incompleteEscapeTimer = null;
        NORMAL_TIMEOUT = 50;
        PASTE_TIMEOUT = 500;
        querier = this.props.stdout.isTTY && this.props.stdin.isTTY ? new ib1(this.props.stdout) : null;
        lastClickTime = 0;
        lastClickCol = -1;
        lastClickRow = -1;
        clickCount = 0;
        pendingHyperlinkTimer = null;
        lastHoverCol = -1;
        lastHoverRow = -1;
        lastStdinTime = Date.now();
        isRawModeSupported() {
            return this.props.stdin.isTTY
        }
        render() {
            return Zd.default.createElement(C46.Provider, {
                value: {
                    columns: this.props.terminalColumns,
                    rows: this.props.terminalRows
                }
            }, Zd.default.createElement(mN6.Provider, {
                value: {
                    exit: this.handleExit,
                    focusManager: this.props.focusManager,
                    rootNode: this.props.rootNode
                }
            }, Zd.default.createElement(Ca.Provider, {
                value: {
                    stdin: this.props.stdin,
                    setRawMode: this.handleSetRawMode,
                    isRawModeSupported: this.isRawModeSupported(),
                    internal_exitOnCtrlC: this.props.exitOnCtrlC,
                    internal_eventEmitter: this.internal_eventEmitter,
                    internal_querier: this.querier
                }
            }, Zd.default.createElement(r_4, null, Zd.default.createElement(s_4, null, Zd.default.createElement(GE8.Provider, {
                value: this.props.onCursorDeclaration ?? (() => {})
            }, this.state.error ? Zd.default.createElement(Ku1, {
                error: this.state.error
            }) : this.props.children))))))
        }
        componentDidMount() {
            let q = this.props.rootNode,
                K = q._pendingRawModeDelta ?? 0;
            q._pendingRawModeDelta = 0;
            for (let _ = 0; _ < K; _++) this.handleSetRawMode(!0);
            for (let _ = 0; _ > K; _--) this.handleSetRawMode(!1);
            q.setRawMode = this.handleSetRawMode
        }
        componentWillUnmount() {
            if (this.props.rootNode.setRawMode = void 0, this.props.stdout.isTTY) this.props.stdout.write(aB);
            if (this.incompleteEscapeTimer) clearTimeout(this.incompleteEscapeTimer), this.incompleteEscapeTimer = null;
            if (this.pendingHyperlinkTimer) clearTimeout(this.pendingHyperlinkTimer), this.pendingHyperlinkTimer = null;
            if (this.isRawModeSupported())
                while (this.rawModeEnabledCount > 0) this.handleSetRawMode(!1)
        }
        componentDidCatch(q) {
            this.handleExit(q)
        }
        handleSetRawMode = (q) => {
            let {
                stdin: K
            } = this.props;
            if (!this.isRawModeSupported())
                if (K === process.stdin) throw Error(`Raw mode is not supported on the current process.stdin, which Ink uses as input stream by default.
Read about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported`);
                else throw Error(`Raw mode is not supported on the stdin provided to Ink.
Read about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported`);
            if (K.setEncoding("utf8"), q) {
                if (this.rawModeEnabledCount === 0) {
                    if (v46(), this.props.onRawModeEnter?.(), K.ref(), K.setRawMode(!0), K.addListener("readable", this.handleReadable), this.props.stdout.write(F_4), this.props.stdout.write(cx1), this.props.stdout.write(g_4), aa6()) this.props.stdout.write(ja6), this.props.stdout.write(Ha6);
                    setImmediate(() => {
                        if (!this.querier) return;
                        Promise.all([this.querier.send(YK4()), this.querier.flush()]).then(async ([_]) => {
                            if (_) {
                                let z = _.name;
                                if (process.env.TMUX && z.startsWith("tmux ")) {
                                    let {
                                        stdout: Y
                                    } = await w1("tmux", ["display-message", "-p", "#{client_termtype}"], {
                                        timeout: 1000,
                                        useCwd: !1
                                    }), A = Y.trim();
                                    if (A) z = A
                                }
                                d_4(z), E(`XTVERSION: terminal identified as "${z}"`)
                            } else E("XTVERSION: no reply (terminal ignored query)");
                            E(`DECSTBM: ${DE8?"enabled":"gated"} (TMUX=${process.env.TMUX?"set":"unset"} ZELLIJ=${process.env.ZELLIJ!=null?"set":"unset"} TERM_PROGRAM=${process.env.TERM_PROGRAM??"unset"} TERM=${process.env.TERM??"unset"})`)
                        })
                    })
                }
                this.rawModeEnabledCount++;
                return
            }
            if (this.rawModeEnabledCount <= 0) return;
            if (--this.rawModeEnabledCount === 0) this.props.stdout.write(W$6), this.props.stdout.write(ba), this.props.stdout.write(R$6), this.props.stdout.write(SN6), this.props.stdout.write(RN6), K.setRawMode(!1), K.removeListener("readable", this.handleReadable), K.unref()
        };
        flushIncomplete = () => {
            if (this.incompleteEscapeTimer = null, !this.keyParseState.incomplete) return;
            if (this.props.stdin.readableLength > 0) {
                this.incompleteEscapeTimer = setTimeout(this.flushIncomplete, this.NORMAL_TIMEOUT);
                return
            }
            this.processInput(null)
        };
        processInput = (q) => {
            let [K, _] = A54(this.keyParseState, q);
            if (this.keyParseState = _, K.length > 0) Jd.discreteUpdates(Xx_, this, K, void 0, void 0);
            if (this.keyParseState.incomplete) {
                if (this.incompleteEscapeTimer) clearTimeout(this.incompleteEscapeTimer);
                this.incompleteEscapeTimer = setTimeout(this.flushIncomplete, this.keyParseState.mode === "IN_PASTE" ? this.PASTE_TIMEOUT : this.NORMAL_TIMEOUT)
            }
        };
        handleReadable = () => {
            let q = Date.now();
            if (q - this.lastStdinTime > Jx_) this.props.onStdinResume?.();
            this.lastStdinTime = q;
            try {
                let K;
                while ((K = this.props.stdin.read()) !== null) this.processInput(K)
            } catch (K) {
                j6(K);
                let {
                    stdin: _
                } = this.props;
                if (this.rawModeEnabledCount > 0 && !_.listeners("readable").includes(this.handleReadable)) E("handleReadable: re-attaching stdin readable listener after error recovery", {
                    level: "warn"
                }), _.addListener("readable", this.handleReadable)
            }
        };
        handleInput = (q) => {
            if (q === "\x03" && this.props.exitOnCtrlC) this.handleExit()
        };
        handleExit = (q) => {
            if (this.isRawModeSupported()) this.handleSetRawMode(!1);
            this.props.onExit(q)
        };
        handleTerminalFocus = (q) => {
            ox1(q)
        };
        handleSuspend = () => {
            if (!this.isRawModeSupported()) return;
            let q = this.rawModeEnabledCount;
            while (this.rawModeEnabledCount > 0) this.handleSetRawMode(!1);
            if (this.props.stdout.isTTY) this.props.stdout.write(aB + R$6 + da);
            this.internal_eventEmitter.emit("suspend");
            let K = () => {
                for (let _ = 0; _ < q; _++)
                    if (this.isRawModeSupported()) this.handleSetRawMode(!0);
                if (this.props.stdout.isTTY) {
                    if (!S6(process.env.CLAUDE_CODE_ACCESSIBILITY)) this.props.stdout.write(CN6);
                    this.props.stdout.write(cx1)
                }
                this.internal_eventEmitter.emit("resume"), process.removeListener("SIGCONT", K)
            };
            process.on("SIGCONT", K), process.kill(process.pid, "SIGSTOP")
        }
    }
})
// @from(Ln 183365, Col 0)
function Px_(q) {
    let K = q.sequence ?? "",
        _ = q.name ?? "";
    if (_ === "space") return " ";
    if (q.ctrl) return _;
    if (K.length === 1) {
        let z = K.charCodeAt(0);
        if (z >= 32 && z !== 127) return K
    }
    if (_) return _;
    if (K.charCodeAt(0) === 27) return "";
    if (/^(\[<\d[\d;]*[Mm]?)+$/.test(K)) return "";
    return K
}
// @from(Ln 183379, Col 4)
Ks6
// @from(Ln 183380, Col 4)
_u1 = L(() => {
    ba6();
    Ks6 = class Ks6 extends Fa {
        key;
        name;
        ctrl;
        shift;
        meta;
        superKey;
        fn;
        constructor(q) {
            super("keydown", {
                bubbles: !0,
                cancelable: !0
            });
            this.key = Px_(q), this.name = q.name ?? "", this.ctrl = q.ctrl, this.shift = q.shift, this.meta = q.meta || q.option, this.superKey = q.super, this.fn = q.fn
        }
    }
})
// @from(Ln 183399, Col 4)
zu1
// @from(Ln 183400, Col 4)
fz4 = L(() => {
    ba6();
    zu1 = class zu1 extends Fa {
        text;
        constructor(q) {
            super("paste", {
                bubbles: !0,
                cancelable: !0
            });
            this.text = q
        }
    }
})
// @from(Ln 183413, Col 4)
Yu1
// @from(Ln 183414, Col 4)
Gz4 = L(() => {
    ba6();
    Yu1 = class Yu1 extends Fa {
        deltaY;
        deltaX;
        ctrl;
        shift;
        meta;
        constructor(q, K) {
            super("wheel", {
                bubbles: !0,
                cancelable: !0
            });
            this.deltaY = q, this.deltaX = K.deltaX ?? 0, this.ctrl = K.ctrl ?? !1, this.shift = K.shift ?? !1, this.meta = K.meta ?? !1
        }
    }
})
// @from(Ln 183432, Col 0)
function b46(q, K, _, z, Y) {
    return {
        screen: ga(0, 0, _, z, Y),
        viewport: {
            width: K,
            height: q
        },
        cursor: {
            x: 0,
            y: 0,
            visible: !0
        }
    }
}
// @from(Ln 183446, Col 4)
vz4 = L(() => {
    Xd()
})
// @from(Ln 183449, Col 4)
_s6
// @from(Ln 183450, Col 4)
Au1 = L(() => {
    _s6 = class _s6 extends OR {
        col;
        row;
        localCol = 0;
        localRow = 0;
        cellIsBlank;
        hyperlinkUrl;
        defaultAllowed = !1;
        allowDefault() {
            this.defaultAllowed = !0
        }
        constructor(q, K, _, z) {
            super();
            this.col = q, this.row = K, this.cellIsBlank = _, this.hyperlinkUrl = z
        }
    }
})
// @from(Ln 183469, Col 0)
function Ou1(q, K, _) {
    let z = S$.get(q);
    if (!z) return null;
    let Y = K >= z.x && K < z.x + z.width && _ >= z.y && _ < z.y + z.height;
    if (!Y && !q.hasAbsoluteDescendant) return null;
    let A = null,
        O = !1;
    for (let w = q.childNodes.length - 1; w >= 0; w--) {
        let $ = q.childNodes[w];
        if ($.nodeName === "#text") continue;
        let j = S$.get($);
        if (!j) continue;
        let H = K >= j.x && K < j.x + j.width && _ >= j.y && _ < j.y + j.height;
        if (!H && !$.hasAbsoluteDescendant) continue;
        if (A !== null && H) continue;
        let J = Ou1($, K, _);
        if (!J) continue;
        let X = !H;
        if (A === null || X && !O) A = J, O = X;
        if (O) break
    }
    return A ?? (Y ? q : null)
}
// @from(Ln 183493, Col 0)
function Tz4(q, K, _, z = !1, Y) {
    let A = Ou1(q, K, _) ?? void 0;
    if (!A) return !1;
    if (q.focusManager) {
        let $ = A;
        while ($) {
            if (typeof $.attributes.tabIndex === "number") {
                q.focusManager.handleClickFocus($);
                break
            }
            $ = $.parentNode
        }
    }
    let O = new _s6(K, _, z, Y),
        w = !1;
    while (A) {
        let $ = A._eventHandlers?.onClick;
        if ($) {
            let j = S$.get(A);
            if (j) O.localCol = K - j.x, O.localRow = _ - j.y;
            if (O.defaultAllowed = !1, $(O), O.didStopImmediatePropagation()) return !O.defaultAllowed;
            if (!O.defaultAllowed) w = !0
        }
        A = A.parentNode
    }
    return w
}
// @from(Ln 183521, Col 0)
function Vz4(q, K, _, z, Y = !1) {
    let A = new Set,
        O = Ou1(q, K, _) ?? void 0;
    while (O) {
        let w = O._eventHandlers;
        if ((w?.onMouseEnter || w?.onMouseLeave) && !(Y && O.attributes.hoverIgnoresBlankCells)) A.add(O);
        O = O.parentNode
    }
    for (let w of z)
        if (!A.has(w)) {
            if (z.delete(w), w.parentNode) w._eventHandlers?.onMouseLeave?.()
        } for (let w of A)
        if (!z.has(w)) z.add(w), w._eventHandlers?.onMouseEnter?.()
}
// @from(Ln 183535, Col 4)
kz4 = L(() => {
    Au1();
    v$6()
})
// @from(Ln 183539, Col 4)
Wx_
// @from(Ln 183539, Col 9)
KO
// @from(Ln 183540, Col 4)
Yk = L(() => {
    Wx_ = new Map, KO = Wx_
})