
// @from(Ln 159806, Col 4)
xYA = R((cu2, e_7) => {
    var qQ5 = PY6();
    e_7.exports = function(A, q) {
        q = q || {};
        var K = qQ5.decode(A, q);
        if (!K) return null;
        var Y = K.payload;
        if (typeof Y === "string") try {
            var z = JSON.parse(Y);
            if (z !== null && typeof z === "object") Y = z
        } catch (w) {}
        if (q.complete === !0) return {
            header: K.header,
            payload: Y,
            signature: K.signature
        };
        return Y
    }
})
// @from(Ln 159825, Col 4)
YI1 = R((lu2, AJ7) => {
    var WY6 = function(A, q) {
        if (Error.call(this, A), Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
        if (this.name = "JsonWebTokenError", this.message = A, q) this.inner = q
    };
    WY6.prototype = Object.create(Error.prototype);
    WY6.prototype.constructor = WY6;
    AJ7.exports = WY6
})
// @from(Ln 159834, Col 4)
bYA = R((iu2, KJ7) => {
    var qJ7 = YI1(),
        GY6 = function(A, q) {
            qJ7.call(this, A), this.name = "NotBeforeError", this.date = q
        };
    GY6.prototype = Object.create(qJ7.prototype);
    GY6.prototype.constructor = GY6;
    KJ7.exports = GY6
})
// @from(Ln 159843, Col 4)
uYA = R((nu2, zJ7) => {
    var YJ7 = YI1(),
        ZY6 = function(A, q) {
            YJ7.call(this, A), this.name = "TokenExpiredError", this.expiredAt = q
        };
    ZY6.prototype = Object.create(YJ7.prototype);
    ZY6.prototype.constructor = ZY6;
    zJ7.exports = ZY6
})
// @from(Ln 159852, Col 4)
BYA = R((ru2, wJ7) => {
    var KQ5 = xS6();
    wJ7.exports = function(A, q) {
        var K = q || Math.floor(Date.now() / 1000);
        if (typeof A === "string") {
            var Y = KQ5(A);
            if (typeof Y > "u") return;
            return Math.floor(K + Y / 1000)
        } else if (typeof A === "number") return K + A;
        else return
    }
})
// @from(Ln 159864, Col 4)
zI1 = R((ou2, HJ7) => {
    var YQ5 = Number.MAX_SAFE_INTEGER || 9007199254740991,
        zQ5 = ["major", "premajor", "minor", "preminor", "patch", "prepatch", "prerelease"];
    HJ7.exports = {
        MAX_LENGTH: 256,
        MAX_SAFE_COMPONENT_LENGTH: 16,
        MAX_SAFE_BUILD_LENGTH: 250,
        MAX_SAFE_INTEGER: YQ5,
        RELEASE_TYPES: zQ5,
        SEMVER_SPEC_VERSION: "2.0.0",
        FLAG_INCLUDE_PRERELEASE: 1,
        FLAG_LOOSE: 2
    }
})
// @from(Ln 159878, Col 4)
wI1 = R((au2, $J7) => {
    var wQ5 = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...A) => console.error("SEMVER", ...A) : () => {};
    $J7.exports = wQ5
})
// @from(Ln 159882, Col 4)
ZX1 = R((Fu, OJ7) => {
    var {
        MAX_SAFE_COMPONENT_LENGTH: mYA,
        MAX_SAFE_BUILD_LENGTH: HQ5,
        MAX_LENGTH: $Q5
    } = zI1(), OQ5 = wI1();
    Fu = OJ7.exports = {};
    var _Q5 = Fu.re = [],
        JQ5 = Fu.safeRe = [],
        b4 = Fu.src = [],
        XQ5 = Fu.safeSrc = [],
        u4 = Fu.t = {},
        DQ5 = 0,
        FYA = "[a-zA-Z0-9-]",
        jQ5 = [
            ["\\s", 1],
            ["\\d", $Q5],
            [FYA, HQ5]
        ],
        MQ5 = (A) => {
            for (let [q, K] of jQ5) A = A.split(`${q}*`).join(`${q}{0,${K}}`).split(`${q}+`).join(`${q}{1,${K}}`);
            return A
        },
        q5 = (A, q, K) => {
            let Y = MQ5(q),
                z = DQ5++;
            OQ5(A, z, q), u4[A] = z, b4[z] = q, XQ5[z] = Y, _Q5[z] = new RegExp(q, K ? "g" : void 0), JQ5[z] = new RegExp(Y, K ? "g" : void 0)
        };
    q5("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    q5("NUMERICIDENTIFIERLOOSE", "\\d+");
    q5("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${FYA}*`);
    q5("MAINVERSION", `(${b4[u4.NUMERICIDENTIFIER]})\\.(${b4[u4.NUMERICIDENTIFIER]})\\.(${b4[u4.NUMERICIDENTIFIER]})`);
    q5("MAINVERSIONLOOSE", `(${b4[u4.NUMERICIDENTIFIERLOOSE]})\\.(${b4[u4.NUMERICIDENTIFIERLOOSE]})\\.(${b4[u4.NUMERICIDENTIFIERLOOSE]})`);
    q5("PRERELEASEIDENTIFIER", `(?:${b4[u4.NUMERICIDENTIFIER]}|${b4[u4.NONNUMERICIDENTIFIER]})`);
    q5("PRERELEASEIDENTIFIERLOOSE", `(?:${b4[u4.NUMERICIDENTIFIERLOOSE]}|${b4[u4.NONNUMERICIDENTIFIER]})`);
    q5("PRERELEASE", `(?:-(${b4[u4.PRERELEASEIDENTIFIER]}(?:\\.${b4[u4.PRERELEASEIDENTIFIER]})*))`);
    q5("PRERELEASELOOSE", `(?:-?(${b4[u4.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${b4[u4.PRERELEASEIDENTIFIERLOOSE]})*))`);
    q5("BUILDIDENTIFIER", `${FYA}+`);
    q5("BUILD", `(?:\\+(${b4[u4.BUILDIDENTIFIER]}(?:\\.${b4[u4.BUILDIDENTIFIER]})*))`);
    q5("FULLPLAIN", `v?${b4[u4.MAINVERSION]}${b4[u4.PRERELEASE]}?${b4[u4.BUILD]}?`);
    q5("FULL", `^${b4[u4.FULLPLAIN]}$`);
    q5("LOOSEPLAIN", `[v=\\s]*${b4[u4.MAINVERSIONLOOSE]}${b4[u4.PRERELEASELOOSE]}?${b4[u4.BUILD]}?`);
    q5("LOOSE", `^${b4[u4.LOOSEPLAIN]}$`);
    q5("GTLT", "((?:<|>)?=?)");
    q5("XRANGEIDENTIFIERLOOSE", `${b4[u4.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    q5("XRANGEIDENTIFIER", `${b4[u4.NUMERICIDENTIFIER]}|x|X|\\*`);
    q5("XRANGEPLAIN", `[v=\\s]*(${b4[u4.XRANGEIDENTIFIER]})(?:\\.(${b4[u4.XRANGEIDENTIFIER]})(?:\\.(${b4[u4.XRANGEIDENTIFIER]})(?:${b4[u4.PRERELEASE]})?${b4[u4.BUILD]}?)?)?`);
    q5("XRANGEPLAINLOOSE", `[v=\\s]*(${b4[u4.XRANGEIDENTIFIERLOOSE]})(?:\\.(${b4[u4.XRANGEIDENTIFIERLOOSE]})(?:\\.(${b4[u4.XRANGEIDENTIFIERLOOSE]})(?:${b4[u4.PRERELEASELOOSE]})?${b4[u4.BUILD]}?)?)?`);
    q5("XRANGE", `^${b4[u4.GTLT]}\\s*${b4[u4.XRANGEPLAIN]}$`);
    q5("XRANGELOOSE", `^${b4[u4.GTLT]}\\s*${b4[u4.XRANGEPLAINLOOSE]}$`);
    q5("COERCEPLAIN", `(^|[^\\d])(\\d{1,${mYA}})(?:\\.(\\d{1,${mYA}}))?(?:\\.(\\d{1,${mYA}}))?`);
    q5("COERCE", `${b4[u4.COERCEPLAIN]}(?:$|[^\\d])`);
    q5("COERCEFULL", b4[u4.COERCEPLAIN] + `(?:${b4[u4.PRERELEASE]})?(?:${b4[u4.BUILD]})?(?:$|[^\\d])`);
    q5("COERCERTL", b4[u4.COERCE], !0);
    q5("COERCERTLFULL", b4[u4.COERCEFULL], !0);
    q5("LONETILDE", "(?:~>?)");
    q5("TILDETRIM", `(\\s*)${b4[u4.LONETILDE]}\\s+`, !0);
    Fu.tildeTrimReplace = "$1~";
    q5("TILDE", `^${b4[u4.LONETILDE]}${b4[u4.XRANGEPLAIN]}$`);
    q5("TILDELOOSE", `^${b4[u4.LONETILDE]}${b4[u4.XRANGEPLAINLOOSE]}$`);
    q5("LONECARET", "(?:\\^)");
    q5("CARETTRIM", `(\\s*)${b4[u4.LONECARET]}\\s+`, !0);
    Fu.caretTrimReplace = "$1^";
    q5("CARET", `^${b4[u4.LONECARET]}${b4[u4.XRANGEPLAIN]}$`);
    q5("CARETLOOSE", `^${b4[u4.LONECARET]}${b4[u4.XRANGEPLAINLOOSE]}$`);
    q5("COMPARATORLOOSE", `^${b4[u4.GTLT]}\\s*(${b4[u4.LOOSEPLAIN]})$|^$`);
    q5("COMPARATOR", `^${b4[u4.GTLT]}\\s*(${b4[u4.FULLPLAIN]})$|^$`);
    q5("COMPARATORTRIM", `(\\s*)${b4[u4.GTLT]}\\s*(${b4[u4.LOOSEPLAIN]}|${b4[u4.XRANGEPLAIN]})`, !0);
    Fu.comparatorTrimReplace = "$1$2$3";
    q5("HYPHENRANGE", `^\\s*(${b4[u4.XRANGEPLAIN]})\\s+-\\s+(${b4[u4.XRANGEPLAIN]})\\s*$`);
    q5("HYPHENRANGELOOSE", `^\\s*(${b4[u4.XRANGEPLAINLOOSE]})\\s+-\\s+(${b4[u4.XRANGEPLAINLOOSE]})\\s*$`);
    q5("STAR", "(<|>)?=?\\s*\\*");
    q5("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    q5("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$")
})
// @from(Ln 159957, Col 4)
fY6 = R((su2, _J7) => {
    var PQ5 = Object.freeze({
            loose: !0
        }),
        WQ5 = Object.freeze({}),
        GQ5 = (A) => {
            if (!A) return WQ5;
            if (typeof A !== "object") return PQ5;
            return A
        };
    _J7.exports = GQ5
})
// @from(Ln 159969, Col 4)
QYA = R((tu2, DJ7) => {
    var JJ7 = /^[0-9]+$/,
        XJ7 = (A, q) => {
            let K = JJ7.test(A),
                Y = JJ7.test(q);
            if (K && Y) A = +A, q = +q;
            return A === q ? 0 : K && !Y ? -1 : Y && !K ? 1 : A < q ? -1 : 1
        },
        ZQ5 = (A, q) => XJ7(q, A);
    DJ7.exports = {
        compareIdentifiers: XJ7,
        rcompareIdentifiers: ZQ5
    }
})
// @from(Ln 159983, Col 4)
NW = R((eu2, WJ7) => {
    var VY6 = wI1(),
        {
            MAX_LENGTH: jJ7,
            MAX_SAFE_INTEGER: NY6
        } = zI1(),
        {
            safeRe: MJ7,
            safeSrc: PJ7,
            t: TY6
        } = ZX1(),
        fQ5 = fY6(),
        {
            compareIdentifiers: fX1
        } = QYA();
    class LS {
        constructor(A, q) {
            if (q = fQ5(q), A instanceof LS)
                if (A.loose === !!q.loose && A.includePrerelease === !!q.includePrerelease) return A;
                else A = A.version;
            else if (typeof A !== "string") throw TypeError(`Invalid version. Must be a string. Got type "${typeof A}".`);
            if (A.length > jJ7) throw TypeError(`version is longer than ${jJ7} characters`);
            VY6("SemVer", A, q), this.options = q, this.loose = !!q.loose, this.includePrerelease = !!q.includePrerelease;
            let K = A.trim().match(q.loose ? MJ7[TY6.LOOSE] : MJ7[TY6.FULL]);
            if (!K) throw TypeError(`Invalid Version: ${A}`);
            if (this.raw = A, this.major = +K[1], this.minor = +K[2], this.patch = +K[3], this.major > NY6 || this.major < 0) throw TypeError("Invalid major version");
            if (this.minor > NY6 || this.minor < 0) throw TypeError("Invalid minor version");
            if (this.patch > NY6 || this.patch < 0) throw TypeError("Invalid patch version");
            if (!K[4]) this.prerelease = [];
            else this.prerelease = K[4].split(".").map((Y) => {
                if (/^[0-9]+$/.test(Y)) {
                    let z = +Y;
                    if (z >= 0 && z < NY6) return z
                }
                return Y
            });
            this.build = K[5] ? K[5].split(".") : [], this.format()
        }
        format() {
            if (this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length) this.version += `-${this.prerelease.join(".")}`;
            return this.version
        }
        toString() {
            return this.version
        }
        compare(A) {
            if (VY6("SemVer.compare", this.version, this.options, A), !(A instanceof LS)) {
                if (typeof A === "string" && A === this.version) return 0;
                A = new LS(A, this.options)
            }
            if (A.version === this.version) return 0;
            return this.compareMain(A) || this.comparePre(A)
        }
        compareMain(A) {
            if (!(A instanceof LS)) A = new LS(A, this.options);
            return fX1(this.major, A.major) || fX1(this.minor, A.minor) || fX1(this.patch, A.patch)
        }
        comparePre(A) {
            if (!(A instanceof LS)) A = new LS(A, this.options);
            if (this.prerelease.length && !A.prerelease.length) return -1;
            else if (!this.prerelease.length && A.prerelease.length) return 1;
            else if (!this.prerelease.length && !A.prerelease.length) return 0;
            let q = 0;
            do {
                let K = this.prerelease[q],
                    Y = A.prerelease[q];
                if (VY6("prerelease compare", q, K, Y), K === void 0 && Y === void 0) return 0;
                else if (Y === void 0) return 1;
                else if (K === void 0) return -1;
                else if (K === Y) continue;
                else return fX1(K, Y)
            } while (++q)
        }
        compareBuild(A) {
            if (!(A instanceof LS)) A = new LS(A, this.options);
            let q = 0;
            do {
                let K = this.build[q],
                    Y = A.build[q];
                if (VY6("build compare", q, K, Y), K === void 0 && Y === void 0) return 0;
                else if (Y === void 0) return 1;
                else if (K === void 0) return -1;
                else if (K === Y) continue;
                else return fX1(K, Y)
            } while (++q)
        }
        inc(A, q, K) {
            if (A.startsWith("pre")) {
                if (!q && K === !1) throw Error("invalid increment argument: identifier is empty");
                if (q) {
                    let Y = new RegExp(`^${this.options.loose?PJ7[TY6.PRERELEASELOOSE]:PJ7[TY6.PRERELEASE]}$`),
                        z = `-${q}`.match(Y);
                    if (!z || z[1] !== q) throw Error(`invalid identifier: ${q}`)
                }
            }
            switch (A) {
                case "premajor":
                    this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", q, K);
                    break;
                case "preminor":
                    this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", q, K);
                    break;
                case "prepatch":
                    this.prerelease.length = 0, this.inc("patch", q, K), this.inc("pre", q, K);
                    break;
                case "prerelease":
                    if (this.prerelease.length === 0) this.inc("patch", q, K);
                    this.inc("pre", q, K);
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
                    let Y = Number(K) ? 1 : 0;
                    if (this.prerelease.length === 0) this.prerelease = [Y];
                    else {
                        let z = this.prerelease.length;
                        while (--z >= 0)
                            if (typeof this.prerelease[z] === "number") this.prerelease[z]++, z = -2;
                        if (z === -1) {
                            if (q === this.prerelease.join(".") && K === !1) throw Error("invalid increment argument: identifier already exists");
                            this.prerelease.push(Y)
                        }
                    }
                    if (q) {
                        let z = [q, Y];
                        if (K === !1) z = [q];
                        if (fX1(this.prerelease[0], q) === 0) {
                            if (isNaN(this.prerelease[1])) this.prerelease = z
                        } else this.prerelease = z
                    }
                    break
                }
                default:
                    throw Error(`invalid increment argument: ${A}`)
            }
            if (this.raw = this.format(), this.build.length) this.raw += `+${this.build.join(".")}`;
            return this
        }
    }
    WJ7.exports = LS
})
// @from(Ln 160138, Col 4)
y41 = R((AB2, ZJ7) => {
    var GJ7 = NW(),
        VQ5 = (A, q, K = !1) => {
            if (A instanceof GJ7) return A;
            try {
                return new GJ7(A, q)
            } catch (Y) {
                if (!K) return null;
                throw Y
            }
        };
    ZJ7.exports = VQ5
})
// @from(Ln 160151, Col 4)
VJ7 = R((qB2, fJ7) => {
    var NQ5 = y41(),
        TQ5 = (A, q) => {
            let K = NQ5(A, q);
            return K ? K.version : null
        };
    fJ7.exports = TQ5
})
// @from(Ln 160159, Col 4)
TJ7 = R((KB2, NJ7) => {
    var vQ5 = y41(),
        EQ5 = (A, q) => {
            let K = vQ5(A.trim().replace(/^[=v]+/, ""), q);
            return K ? K.version : null
        };
    NJ7.exports = EQ5
})
// @from(Ln 160167, Col 4)
kJ7 = R((YB2, EJ7) => {
    var vJ7 = NW(),
        kQ5 = (A, q, K, Y, z) => {
            if (typeof K === "string") z = Y, Y = K, K = void 0;
            try {
                return new vJ7(A instanceof vJ7 ? A.version : A, K).inc(q, Y, z).version
            } catch (w) {
                return null
            }
        };
    EJ7.exports = kQ5
})
// @from(Ln 160179, Col 4)
yJ7 = R((zB2, RJ7) => {
    var LJ7 = y41(),
        LQ5 = (A, q) => {
            let K = LJ7(A, null, !0),
                Y = LJ7(q, null, !0),
                z = K.compare(Y);
            if (z === 0) return null;
            let w = z > 0,
                H = w ? K : Y,
                $ = w ? Y : K,
                O = !!H.prerelease.length;
            if (!!$.prerelease.length && !O) {
                if (!$.patch && !$.minor) return "major";
                if ($.compareMain(H) === 0) {
                    if ($.minor && !$.patch) return "minor";
                    return "patch"
                }
            }
            let J = O ? "pre" : "";
            if (K.major !== Y.major) return J + "major";
            if (K.minor !== Y.minor) return J + "minor";
            if (K.patch !== Y.patch) return J + "patch";
            return "prerelease"
        };
    RJ7.exports = LQ5
})
// @from(Ln 160205, Col 4)
SJ7 = R((wB2, CJ7) => {
    var RQ5 = NW(),
        yQ5 = (A, q) => new RQ5(A, q).major;
    CJ7.exports = yQ5
})
// @from(Ln 160210, Col 4)
IJ7 = R((HB2, hJ7) => {
    var CQ5 = NW(),
        SQ5 = (A, q) => new CQ5(A, q).minor;
    hJ7.exports = SQ5
})
// @from(Ln 160215, Col 4)
bJ7 = R(($B2, xJ7) => {
    var hQ5 = NW(),
        IQ5 = (A, q) => new hQ5(A, q).patch;
    xJ7.exports = IQ5
})
// @from(Ln 160220, Col 4)
BJ7 = R((OB2, uJ7) => {
    var xQ5 = y41(),
        bQ5 = (A, q) => {
            let K = xQ5(A, q);
            return K && K.prerelease.length ? K.prerelease : null
        };
    uJ7.exports = bQ5
})
// @from(Ln 160228, Col 4)
hL = R((_B2, FJ7) => {
    var mJ7 = NW(),
        uQ5 = (A, q, K) => new mJ7(A, K).compare(new mJ7(q, K));
    FJ7.exports = uQ5
})
// @from(Ln 160233, Col 4)
gJ7 = R((JB2, QJ7) => {
    var BQ5 = hL(),
        mQ5 = (A, q, K) => BQ5(q, A, K);
    QJ7.exports = mQ5
})
// @from(Ln 160238, Col 4)
pJ7 = R((XB2, UJ7) => {
    var FQ5 = hL(),
        QQ5 = (A, q) => FQ5(A, q, !0);
    UJ7.exports = QQ5
})
// @from(Ln 160243, Col 4)
vY6 = R((DB2, cJ7) => {
    var dJ7 = NW(),
        gQ5 = (A, q, K) => {
            let Y = new dJ7(A, K),
                z = new dJ7(q, K);
            return Y.compare(z) || Y.compareBuild(z)
        };
    cJ7.exports = gQ5
})
// @from(Ln 160252, Col 4)
iJ7 = R((jB2, lJ7) => {
    var UQ5 = vY6(),
        pQ5 = (A, q) => A.sort((K, Y) => UQ5(K, Y, q));
    lJ7.exports = pQ5
})
// @from(Ln 160257, Col 4)
rJ7 = R((MB2, nJ7) => {
    var dQ5 = vY6(),
        cQ5 = (A, q) => A.sort((K, Y) => dQ5(Y, K, q));
    nJ7.exports = cQ5
})
// @from(Ln 160262, Col 4)
HI1 = R((PB2, oJ7) => {
    var lQ5 = hL(),
        iQ5 = (A, q, K) => lQ5(A, q, K) > 0;
    oJ7.exports = iQ5
})
// @from(Ln 160267, Col 4)
EY6 = R((WB2, aJ7) => {
    var nQ5 = hL(),
        rQ5 = (A, q, K) => nQ5(A, q, K) < 0;
    aJ7.exports = rQ5
})
// @from(Ln 160272, Col 4)
gYA = R((GB2, sJ7) => {
    var oQ5 = hL(),
        aQ5 = (A, q, K) => oQ5(A, q, K) === 0;
    sJ7.exports = aQ5
})
// @from(Ln 160277, Col 4)
UYA = R((ZB2, tJ7) => {
    var sQ5 = hL(),
        tQ5 = (A, q, K) => sQ5(A, q, K) !== 0;
    tJ7.exports = tQ5
})
// @from(Ln 160282, Col 4)
kY6 = R((fB2, eJ7) => {
    var eQ5 = hL(),
        Ag5 = (A, q, K) => eQ5(A, q, K) >= 0;
    eJ7.exports = Ag5
})
// @from(Ln 160287, Col 4)
LY6 = R((VB2, AX7) => {
    var qg5 = hL(),
        Kg5 = (A, q, K) => qg5(A, q, K) <= 0;
    AX7.exports = Kg5
})
// @from(Ln 160292, Col 4)
pYA = R((NB2, qX7) => {
    var Yg5 = gYA(),
        zg5 = UYA(),
        wg5 = HI1(),
        Hg5 = kY6(),
        $g5 = EY6(),
        Og5 = LY6(),
        _g5 = (A, q, K, Y) => {
            switch (q) {
                case "===":
                    if (typeof A === "object") A = A.version;
                    if (typeof K === "object") K = K.version;
                    return A === K;
                case "!==":
                    if (typeof A === "object") A = A.version;
                    if (typeof K === "object") K = K.version;
                    return A !== K;
                case "":
                case "=":
                case "==":
                    return Yg5(A, K, Y);
                case "!=":
                    return zg5(A, K, Y);
                case ">":
                    return wg5(A, K, Y);
                case ">=":
                    return Hg5(A, K, Y);
                case "<":
                    return $g5(A, K, Y);
                case "<=":
                    return Og5(A, K, Y);
                default:
                    throw TypeError(`Invalid operator: ${q}`)
            }
        };
    qX7.exports = _g5
})
// @from(Ln 160329, Col 4)
YX7 = R((TB2, KX7) => {
    var Jg5 = NW(),
        Xg5 = y41(),
        {
            safeRe: RY6,
            t: yY6
        } = ZX1(),
        Dg5 = (A, q) => {
            if (A instanceof Jg5) return A;
            if (typeof A === "number") A = String(A);
            if (typeof A !== "string") return null;
            q = q || {};
            let K = null;
            if (!q.rtl) K = A.match(q.includePrerelease ? RY6[yY6.COERCEFULL] : RY6[yY6.COERCE]);
            else {
                let O = q.includePrerelease ? RY6[yY6.COERCERTLFULL] : RY6[yY6.COERCERTL],
                    _;
                while ((_ = O.exec(A)) && (!K || K.index + K[0].length !== A.length)) {
                    if (!K || _.index + _[0].length !== K.index + K[0].length) K = _;
                    O.lastIndex = _.index + _[1].length + _[2].length
                }
                O.lastIndex = -1
            }
            if (K === null) return null;
            let Y = K[2],
                z = K[3] || "0",
                w = K[4] || "0",
                H = q.includePrerelease && K[5] ? `-${K[5]}` : "",
                $ = q.includePrerelease && K[6] ? `+${K[6]}` : "";
            return Xg5(`${Y}.${z}.${w}${H}${$}`, q)
        };
    KX7.exports = Dg5
})
// @from(Ln 160362, Col 4)
HX7 = R((vB2, wX7) => {
    class zX7 {
        constructor() {
            this.max = 1000, this.map = new Map
        }
        get(A) {
            let q = this.map.get(A);
            if (q === void 0) return;
            else return this.map.delete(A), this.map.set(A, q), q
        }
        delete(A) {
            return this.map.delete(A)
        }
        set(A, q) {
            if (!this.delete(A) && q !== void 0) {
                if (this.map.size >= this.max) {
                    let Y = this.map.keys().next().value;
                    this.delete(Y)
                }
                this.map.set(A, q)
            }
            return this
        }
    }
    wX7.exports = zX7
})
// @from(Ln 160388, Col 4)
IL = R((EB2, JX7) => {
    var jg5 = /\s+/g;
    class $I1 {
        constructor(A, q) {
            if (q = Pg5(q), A instanceof $I1)
                if (A.loose === !!q.loose && A.includePrerelease === !!q.includePrerelease) return A;
                else return new $I1(A.raw, q);
            if (A instanceof dYA) return this.raw = A.value, this.set = [
                [A]
            ], this.formatted = void 0, this;
            if (this.options = q, this.loose = !!q.loose, this.includePrerelease = !!q.includePrerelease, this.raw = A.trim().replace(jg5, " "), this.set = this.raw.split("||").map((K) => this.parseRange(K.trim())).filter((K) => K.length), !this.set.length) throw TypeError(`Invalid SemVer Range: ${this.raw}`);
            if (this.set.length > 1) {
                let K = this.set[0];
                if (this.set = this.set.filter((Y) => !OX7(Y[0])), this.set.length === 0) this.set = [K];
                else if (this.set.length > 1) {
                    for (let Y of this.set)
                        if (Y.length === 1 && Tg5(Y[0])) {
                            this.set = [Y];
                            break
                        }
                }
            }
            this.formatted = void 0
        }
        get range() {
            if (this.formatted === void 0) {
                this.formatted = "";
                for (let A = 0; A < this.set.length; A++) {
                    if (A > 0) this.formatted += "||";
                    let q = this.set[A];
                    for (let K = 0; K < q.length; K++) {
                        if (K > 0) this.formatted += " ";
                        this.formatted += q[K].toString().trim()
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
        parseRange(A) {
            let K = ((this.options.includePrerelease && Vg5) | (this.options.loose && Ng5)) + ":" + A,
                Y = $X7.get(K);
            if (Y) return Y;
            let z = this.options.loose,
                w = z ? hV[AZ.HYPHENRANGELOOSE] : hV[AZ.HYPHENRANGE];
            A = A.replace(w, Ig5(this.options.includePrerelease)), tH("hyphen replace", A), A = A.replace(hV[AZ.COMPARATORTRIM], Gg5), tH("comparator trim", A), A = A.replace(hV[AZ.TILDETRIM], Zg5), tH("tilde trim", A), A = A.replace(hV[AZ.CARETTRIM], fg5), tH("caret trim", A);
            let H = A.split(" ").map((J) => vg5(J, this.options)).join(" ").split(/\s+/).map((J) => hg5(J, this.options));
            if (z) H = H.filter((J) => {
                return tH("loose invalid filter", J, this.options), !!J.match(hV[AZ.COMPARATORLOOSE])
            });
            tH("range list", H);
            let $ = new Map,
                O = H.map((J) => new dYA(J, this.options));
            for (let J of O) {
                if (OX7(J)) return [J];
                $.set(J.value, J)
            }
            if ($.size > 1 && $.has("")) $.delete("");
            let _ = [...$.values()];
            return $X7.set(K, _), _
        }
        intersects(A, q) {
            if (!(A instanceof $I1)) throw TypeError("a Range is required");
            return this.set.some((K) => {
                return _X7(K, q) && A.set.some((Y) => {
                    return _X7(Y, q) && K.every((z) => {
                        return Y.every((w) => {
                            return z.intersects(w, q)
                        })
                    })
                })
            })
        }
        test(A) {
            if (!A) return !1;
            if (typeof A === "string") try {
                A = new Wg5(A, this.options)
            } catch (q) {
                return !1
            }
            for (let q = 0; q < this.set.length; q++)
                if (xg5(this.set[q], A, this.options)) return !0;
            return !1
        }
    }
    JX7.exports = $I1;
    var Mg5 = HX7(),
        $X7 = new Mg5,
        Pg5 = fY6(),
        dYA = OI1(),
        tH = wI1(),
        Wg5 = NW(),
        {
            safeRe: hV,
            t: AZ,
            comparatorTrimReplace: Gg5,
            tildeTrimReplace: Zg5,
            caretTrimReplace: fg5
        } = ZX1(),
        {
            FLAG_INCLUDE_PRERELEASE: Vg5,
            FLAG_LOOSE: Ng5
        } = zI1(),
        OX7 = (A) => A.value === "<0.0.0-0",
        Tg5 = (A) => A.value === "",
        _X7 = (A, q) => {
            let K = !0,
                Y = A.slice(),
                z = Y.pop();
            while (K && Y.length) K = Y.every((w) => {
                return z.intersects(w, q)
            }), z = Y.pop();
            return K
        },
        vg5 = (A, q) => {
            return tH("comp", A, q), A = Lg5(A, q), tH("caret", A), A = Eg5(A, q), tH("tildes", A), A = yg5(A, q), tH("xrange", A), A = Sg5(A, q), tH("stars", A), A
        },
        qZ = (A) => !A || A.toLowerCase() === "x" || A === "*",
        Eg5 = (A, q) => {
            return A.trim().split(/\s+/).map((K) => kg5(K, q)).join(" ")
        },
        kg5 = (A, q) => {
            let K = q.loose ? hV[AZ.TILDELOOSE] : hV[AZ.TILDE];
            return A.replace(K, (Y, z, w, H, $) => {
                tH("tilde", A, Y, z, w, H, $);
                let O;
                if (qZ(z)) O = "";
                else if (qZ(w)) O = `>=${z}.0.0 <${+z+1}.0.0-0`;
                else if (qZ(H)) O = `>=${z}.${w}.0 <${z}.${+w+1}.0-0`;
                else if ($) tH("replaceTilde pr", $), O = `>=${z}.${w}.${H}-${$} <${z}.${+w+1}.0-0`;
                else O = `>=${z}.${w}.${H} <${z}.${+w+1}.0-0`;
                return tH("tilde return", O), O
            })
        },
        Lg5 = (A, q) => {
            return A.trim().split(/\s+/).map((K) => Rg5(K, q)).join(" ")
        },
        Rg5 = (A, q) => {
            tH("caret", A, q);
            let K = q.loose ? hV[AZ.CARETLOOSE] : hV[AZ.CARET],
                Y = q.includePrerelease ? "-0" : "";
            return A.replace(K, (z, w, H, $, O) => {
                tH("caret", A, z, w, H, $, O);
                let _;
                if (qZ(w)) _ = "";
                else if (qZ(H)) _ = `>=${w}.0.0${Y} <${+w+1}.0.0-0`;
                else if (qZ($))
                    if (w === "0") _ = `>=${w}.${H}.0${Y} <${w}.${+H+1}.0-0`;
                    else _ = `>=${w}.${H}.0${Y} <${+w+1}.0.0-0`;
                else if (O)
                    if (tH("replaceCaret pr", O), w === "0")
                        if (H === "0") _ = `>=${w}.${H}.${$}-${O} <${w}.${H}.${+$+1}-0`;
                        else _ = `>=${w}.${H}.${$}-${O} <${w}.${+H+1}.0-0`;
                else _ = `>=${w}.${H}.${$}-${O} <${+w+1}.0.0-0`;
                else if (tH("no pr"), w === "0")
                    if (H === "0") _ = `>=${w}.${H}.${$}${Y} <${w}.${H}.${+$+1}-0`;
                    else _ = `>=${w}.${H}.${$}${Y} <${w}.${+H+1}.0-0`;
                else _ = `>=${w}.${H}.${$} <${+w+1}.0.0-0`;
                return tH("caret return", _), _
            })
        },
        yg5 = (A, q) => {
            return tH("replaceXRanges", A, q), A.split(/\s+/).map((K) => Cg5(K, q)).join(" ")
        },
        Cg5 = (A, q) => {
            A = A.trim();
            let K = q.loose ? hV[AZ.XRANGELOOSE] : hV[AZ.XRANGE];
            return A.replace(K, (Y, z, w, H, $, O) => {
                tH("xRange", A, Y, z, w, H, $, O);
                let _ = qZ(w),
                    J = _ || qZ(H),
                    X = J || qZ($),
                    D = X;
                if (z === "=" && D) z = "";
                if (O = q.includePrerelease ? "-0" : "", _)
                    if (z === ">" || z === "<") Y = "<0.0.0-0";
                    else Y = "*";
                else if (z && D) {
                    if (J) H = 0;
                    if ($ = 0, z === ">")
                        if (z = ">=", J) w = +w + 1, H = 0, $ = 0;
                        else H = +H + 1, $ = 0;
                    else if (z === "<=")
                        if (z = "<", J) w = +w + 1;
                        else H = +H + 1;
                    if (z === "<") O = "-0";
                    Y = `${z+w}.${H}.${$}${O}`
                } else if (J) Y = `>=${w}.0.0${O} <${+w+1}.0.0-0`;
                else if (X) Y = `>=${w}.${H}.0${O} <${w}.${+H+1}.0-0`;
                return tH("xRange return", Y), Y
            })
        },
        Sg5 = (A, q) => {
            return tH("replaceStars", A, q), A.trim().replace(hV[AZ.STAR], "")
        },
        hg5 = (A, q) => {
            return tH("replaceGTE0", A, q), A.trim().replace(hV[q.includePrerelease ? AZ.GTE0PRE : AZ.GTE0], "")
        },
        Ig5 = (A) => (q, K, Y, z, w, H, $, O, _, J, X, D) => {
            if (qZ(Y)) K = "";
            else if (qZ(z)) K = `>=${Y}.0.0${A?"-0":""}`;
            else if (qZ(w)) K = `>=${Y}.${z}.0${A?"-0":""}`;
            else if (H) K = `>=${K}`;
            else K = `>=${K}${A?"-0":""}`;
            if (qZ(_)) O = "";
            else if (qZ(J)) O = `<${+_+1}.0.0-0`;
            else if (qZ(X)) O = `<${_}.${+J+1}.0-0`;
            else if (D) O = `<=${_}.${J}.${X}-${D}`;
            else if (A) O = `<${_}.${J}.${+X+1}-0`;
            else O = `<=${O}`;
            return `${K} ${O}`.trim()
        },
        xg5 = (A, q, K) => {
            for (let Y = 0; Y < A.length; Y++)
                if (!A[Y].test(q)) return !1;
            if (q.prerelease.length && !K.includePrerelease) {
                for (let Y = 0; Y < A.length; Y++) {
                    if (tH(A[Y].semver), A[Y].semver === dYA.ANY) continue;
                    if (A[Y].semver.prerelease.length > 0) {
                        let z = A[Y].semver;
                        if (z.major === q.major && z.minor === q.minor && z.patch === q.patch) return !0
                    }
                }
                return !1
            }
            return !0
        }
})
// @from(Ln 160621, Col 4)
OI1 = R((kB2, WX7) => {
    var _I1 = Symbol("SemVer ANY");
    class CY6 {
        static get ANY() {
            return _I1
        }
        constructor(A, q) {
            if (q = XX7(q), A instanceof CY6)
                if (A.loose === !!q.loose) return A;
                else A = A.value;
            if (A = A.trim().split(/\s+/).join(" "), lYA("comparator", A, q), this.options = q, this.loose = !!q.loose, this.parse(A), this.semver === _I1) this.value = "";
            else this.value = this.operator + this.semver.version;
            lYA("comp", this)
        }
        parse(A) {
            let q = this.options.loose ? DX7[jX7.COMPARATORLOOSE] : DX7[jX7.COMPARATOR],
                K = A.match(q);
            if (!K) throw TypeError(`Invalid comparator: ${A}`);
            if (this.operator = K[1] !== void 0 ? K[1] : "", this.operator === "=") this.operator = "";
            if (!K[2]) this.semver = _I1;
            else this.semver = new MX7(K[2], this.options.loose)
        }
        toString() {
            return this.value
        }
        test(A) {
            if (lYA("Comparator.test", A, this.options.loose), this.semver === _I1 || A === _I1) return !0;
            if (typeof A === "string") try {
                A = new MX7(A, this.options)
            } catch (q) {
                return !1
            }
            return cYA(A, this.operator, this.semver, this.options)
        }
        intersects(A, q) {
            if (!(A instanceof CY6)) throw TypeError("a Comparator is required");
            if (this.operator === "") {
                if (this.value === "") return !0;
                return new PX7(A.value, q).test(this.value)
            } else if (A.operator === "") {
                if (A.value === "") return !0;
                return new PX7(this.value, q).test(A.semver)
            }
            if (q = XX7(q), q.includePrerelease && (this.value === "<0.0.0-0" || A.value === "<0.0.0-0")) return !1;
            if (!q.includePrerelease && (this.value.startsWith("<0.0.0") || A.value.startsWith("<0.0.0"))) return !1;
            if (this.operator.startsWith(">") && A.operator.startsWith(">")) return !0;
            if (this.operator.startsWith("<") && A.operator.startsWith("<")) return !0;
            if (this.semver.version === A.semver.version && this.operator.includes("=") && A.operator.includes("=")) return !0;
            if (cYA(this.semver, "<", A.semver, q) && this.operator.startsWith(">") && A.operator.startsWith("<")) return !0;
            if (cYA(this.semver, ">", A.semver, q) && this.operator.startsWith("<") && A.operator.startsWith(">")) return !0;
            return !1
        }
    }
    WX7.exports = CY6;
    var XX7 = fY6(),
        {
            safeRe: DX7,
            t: jX7
        } = ZX1(),
        cYA = pYA(),
        lYA = wI1(),
        MX7 = NW(),
        PX7 = IL()
})
// @from(Ln 160685, Col 4)
JI1 = R((LB2, GX7) => {
    var bg5 = IL(),
        ug5 = (A, q, K) => {
            try {
                q = new bg5(q, K)
            } catch (Y) {
                return !1
            }
            return q.test(A)
        };
    GX7.exports = ug5
})
// @from(Ln 160697, Col 4)
fX7 = R((RB2, ZX7) => {
    var Bg5 = IL(),
        mg5 = (A, q) => new Bg5(A, q).set.map((K) => K.map((Y) => Y.value).join(" ").trim().split(" "));
    ZX7.exports = mg5
})
// @from(Ln 160702, Col 4)
NX7 = R((yB2, VX7) => {
    var Fg5 = NW(),
        Qg5 = IL(),
        gg5 = (A, q, K) => {
            let Y = null,
                z = null,
                w = null;
            try {
                w = new Qg5(q, K)
            } catch (H) {
                return null
            }
            return A.forEach((H) => {
                if (w.test(H)) {
                    if (!Y || z.compare(H) === -1) Y = H, z = new Fg5(Y, K)
                }
            }), Y
        };
    VX7.exports = gg5
})
// @from(Ln 160722, Col 4)
vX7 = R((CB2, TX7) => {
    var Ug5 = NW(),
        pg5 = IL(),
        dg5 = (A, q, K) => {
            let Y = null,
                z = null,
                w = null;
            try {
                w = new pg5(q, K)
            } catch (H) {
                return null
            }
            return A.forEach((H) => {
                if (w.test(H)) {
                    if (!Y || z.compare(H) === 1) Y = H, z = new Ug5(Y, K)
                }
            }), Y
        };
    TX7.exports = dg5
})
// @from(Ln 160742, Col 4)
LX7 = R((SB2, kX7) => {
    var iYA = NW(),
        cg5 = IL(),
        EX7 = HI1(),
        lg5 = (A, q) => {
            A = new cg5(A, q);
            let K = new iYA("0.0.0");
            if (A.test(K)) return K;
            if (K = new iYA("0.0.0-0"), A.test(K)) return K;
            K = null;
            for (let Y = 0; Y < A.set.length; ++Y) {
                let z = A.set[Y],
                    w = null;
                if (z.forEach((H) => {
                        let $ = new iYA(H.semver.version);
                        switch (H.operator) {
                            case ">":
                                if ($.prerelease.length === 0) $.patch++;
                                else $.prerelease.push(0);
                                $.raw = $.format();
                            case "":
                            case ">=":
                                if (!w || EX7($, w)) w = $;
                                break;
                            case "<":
                            case "<=":
                                break;
                            default:
                                throw Error(`Unexpected operation: ${H.operator}`)
                        }
                    }), w && (!K || EX7(K, w))) K = w
            }
            if (K && A.test(K)) return K;
            return null
        };
    kX7.exports = lg5
})
// @from(Ln 160779, Col 4)
yX7 = R((hB2, RX7) => {
    var ig5 = IL(),
        ng5 = (A, q) => {
            try {
                return new ig5(A, q).range || "*"
            } catch (K) {
                return null
            }
        };
    RX7.exports = ng5
})
// @from(Ln 160790, Col 4)
SY6 = R((IB2, IX7) => {
    var rg5 = NW(),
        hX7 = OI1(),
        {
            ANY: og5
        } = hX7,
        ag5 = IL(),
        sg5 = JI1(),
        CX7 = HI1(),
        SX7 = EY6(),
        tg5 = LY6(),
        eg5 = kY6(),
        AU5 = (A, q, K, Y) => {
            A = new rg5(A, Y), q = new ag5(q, Y);
            let z, w, H, $, O;
            switch (K) {
                case ">":
                    z = CX7, w = tg5, H = SX7, $ = ">", O = ">=";
                    break;
                case "<":
                    z = SX7, w = eg5, H = CX7, $ = "<", O = "<=";
                    break;
                default:
                    throw TypeError('Must provide a hilo val of "<" or ">"')
            }
            if (sg5(A, q, Y)) return !1;
            for (let _ = 0; _ < q.set.length; ++_) {
                let J = q.set[_],
                    X = null,
                    D = null;
                if (J.forEach((j) => {
                        if (j.semver === og5) j = new hX7(">=0.0.0");
                        if (X = X || j, D = D || j, z(j.semver, X.semver, Y)) X = j;
                        else if (H(j.semver, D.semver, Y)) D = j
                    }), X.operator === $ || X.operator === O) return !1;
                if ((!D.operator || D.operator === $) && w(A, D.semver)) return !1;
                else if (D.operator === O && H(A, D.semver)) return !1
            }
            return !0
        };
    IX7.exports = AU5
})
// @from(Ln 160832, Col 4)
bX7 = R((xB2, xX7) => {
    var qU5 = SY6(),
        KU5 = (A, q, K) => qU5(A, q, ">", K);
    xX7.exports = KU5
})
// @from(Ln 160837, Col 4)
BX7 = R((bB2, uX7) => {
    var YU5 = SY6(),
        zU5 = (A, q, K) => YU5(A, q, "<", K);
    uX7.exports = zU5
})
// @from(Ln 160842, Col 4)
QX7 = R((uB2, FX7) => {
    var mX7 = IL(),
        wU5 = (A, q, K) => {
            return A = new mX7(A, K), q = new mX7(q, K), A.intersects(q, K)
        };
    FX7.exports = wU5
})
// @from(Ln 160849, Col 4)
UX7 = R((BB2, gX7) => {
    var HU5 = JI1(),
        $U5 = hL();
    gX7.exports = (A, q, K) => {
        let Y = [],
            z = null,
            w = null,
            H = A.sort((J, X) => $U5(J, X, K));
        for (let J of H)
            if (HU5(J, q, K)) {
                if (w = J, !z) z = J
            } else {
                if (w) Y.push([z, w]);
                w = null, z = null
            } if (z) Y.push([z, null]);
        let $ = [];
        for (let [J, X] of Y)
            if (J === X) $.push(J);
            else if (!X && J === H[0]) $.push("*");
        else if (!X) $.push(`>=${J}`);
        else if (J === H[0]) $.push(`<=${X}`);
        else $.push(`${J} - ${X}`);
        let O = $.join(" || "),
            _ = typeof q.raw === "string" ? q.raw : String(q);
        return O.length < _.length ? O : q
    }
})
// @from(Ln 160876, Col 4)
nX7 = R((mB2, iX7) => {
    var pX7 = IL(),
        rYA = OI1(),
        {
            ANY: nYA
        } = rYA,
        XI1 = JI1(),
        oYA = hL(),
        OU5 = (A, q, K = {}) => {
            if (A === q) return !0;
            A = new pX7(A, K), q = new pX7(q, K);
            let Y = !1;
            A: for (let z of A.set) {
                for (let w of q.set) {
                    let H = JU5(z, w, K);
                    if (Y = Y || H !== null, H) continue A
                }
                if (Y) return !1
            }
            return !0
        },
        _U5 = [new rYA(">=0.0.0-0")],
        dX7 = [new rYA(">=0.0.0")],
        JU5 = (A, q, K) => {
            if (A === q) return !0;
            if (A.length === 1 && A[0].semver === nYA)
                if (q.length === 1 && q[0].semver === nYA) return !0;
                else if (K.includePrerelease) A = _U5;
            else A = dX7;
            if (q.length === 1 && q[0].semver === nYA)
                if (K.includePrerelease) return !0;
                else q = dX7;
            let Y = new Set,
                z, w;
            for (let j of A)
                if (j.operator === ">" || j.operator === ">=") z = cX7(z, j, K);
                else if (j.operator === "<" || j.operator === "<=") w = lX7(w, j, K);
            else Y.add(j.semver);
            if (Y.size > 1) return null;
            let H;
            if (z && w) {
                if (H = oYA(z.semver, w.semver, K), H > 0) return null;
                else if (H === 0 && (z.operator !== ">=" || w.operator !== "<=")) return null
            }
            for (let j of Y) {
                if (z && !XI1(j, String(z), K)) return null;
                if (w && !XI1(j, String(w), K)) return null;
                for (let M of q)
                    if (!XI1(j, String(M), K)) return !1;
                return !0
            }
            let $, O, _, J, X = w && !K.includePrerelease && w.semver.prerelease.length ? w.semver : !1,
                D = z && !K.includePrerelease && z.semver.prerelease.length ? z.semver : !1;
            if (X && X.prerelease.length === 1 && w.operator === "<" && X.prerelease[0] === 0) X = !1;
            for (let j of q) {
                if (J = J || j.operator === ">" || j.operator === ">=", _ = _ || j.operator === "<" || j.operator === "<=", z) {
                    if (D) {
                        if (j.semver.prerelease && j.semver.prerelease.length && j.semver.major === D.major && j.semver.minor === D.minor && j.semver.patch === D.patch) D = !1
                    }
                    if (j.operator === ">" || j.operator === ">=") {
                        if ($ = cX7(z, j, K), $ === j && $ !== z) return !1
                    } else if (z.operator === ">=" && !XI1(z.semver, String(j), K)) return !1
                }
                if (w) {
                    if (X) {
                        if (j.semver.prerelease && j.semver.prerelease.length && j.semver.major === X.major && j.semver.minor === X.minor && j.semver.patch === X.patch) X = !1
                    }
                    if (j.operator === "<" || j.operator === "<=") {
                        if (O = lX7(w, j, K), O === j && O !== w) return !1
                    } else if (w.operator === "<=" && !XI1(w.semver, String(j), K)) return !1
                }
                if (!j.operator && (w || z) && H !== 0) return !1
            }
            if (z && _ && !w && H !== 0) return !1;
            if (w && J && !z && H !== 0) return !1;
            if (D || X) return !1;
            return !0
        },
        cX7 = (A, q, K) => {
            if (!A) return q;
            let Y = oYA(A.semver, q.semver, K);
            return Y > 0 ? A : Y < 0 ? q : q.operator === ">" && A.operator === ">=" ? q : A
        },
        lX7 = (A, q, K) => {
            if (!A) return q;
            let Y = oYA(A.semver, q.semver, K);
            return Y < 0 ? A : Y > 0 ? q : q.operator === "<" && A.operator === "<=" ? q : A
        };
    iX7.exports = OU5
})
// @from(Ln 160966, Col 4)
hY6 = R((FB2, aX7) => {
    var aYA = ZX1(),
        rX7 = zI1(),
        XU5 = NW(),
        oX7 = QYA(),
        DU5 = y41(),
        jU5 = VJ7(),
        MU5 = TJ7(),
        PU5 = kJ7(),
        WU5 = yJ7(),
        GU5 = SJ7(),
        ZU5 = IJ7(),
        fU5 = bJ7(),
        VU5 = BJ7(),
        NU5 = hL(),
        TU5 = gJ7(),
        vU5 = pJ7(),
        EU5 = vY6(),
        kU5 = iJ7(),
        LU5 = rJ7(),
        RU5 = HI1(),
        yU5 = EY6(),
        CU5 = gYA(),
        SU5 = UYA(),
        hU5 = kY6(),
        IU5 = LY6(),
        xU5 = pYA(),
        bU5 = YX7(),
        uU5 = OI1(),
        BU5 = IL(),
        mU5 = JI1(),
        FU5 = fX7(),
        QU5 = NX7(),
        gU5 = vX7(),
        UU5 = LX7(),
        pU5 = yX7(),
        dU5 = SY6(),
        cU5 = bX7(),
        lU5 = BX7(),
        iU5 = QX7(),
        nU5 = UX7(),
        rU5 = nX7();
    aX7.exports = {
        parse: DU5,
        valid: jU5,
        clean: MU5,
        inc: PU5,
        diff: WU5,
        major: GU5,
        minor: ZU5,
        patch: fU5,
        prerelease: VU5,
        compare: NU5,
        rcompare: TU5,
        compareLoose: vU5,
        compareBuild: EU5,
        sort: kU5,
        rsort: LU5,
        gt: RU5,
        lt: yU5,
        eq: CU5,
        neq: SU5,
        gte: hU5,
        lte: IU5,
        cmp: xU5,
        coerce: bU5,
        Comparator: uU5,
        Range: BU5,
        satisfies: mU5,
        toComparators: FU5,
        maxSatisfying: QU5,
        minSatisfying: gU5,
        minVersion: UU5,
        validRange: pU5,
        outside: dU5,
        gtr: cU5,
        ltr: lU5,
        intersects: iU5,
        simplifyRange: nU5,
        subset: rU5,
        SemVer: XU5,
        re: aYA.re,
        src: aYA.src,
        tokens: aYA.t,
        SEMVER_SPEC_VERSION: rX7.SEMVER_SPEC_VERSION,
        RELEASE_TYPES: rX7.RELEASE_TYPES,
        compareIdentifiers: oX7.compareIdentifiers,
        rcompareIdentifiers: oX7.rcompareIdentifiers
    }
})
// @from(Ln 161056, Col 4)
tX7 = R((QB2, sX7) => {
    var oU5 = hY6();
    sX7.exports = oU5.satisfies(process.version, ">=15.7.0")
})
// @from(Ln 161060, Col 4)
AD7 = R((gB2, eX7) => {
    var aU5 = hY6();
    eX7.exports = aU5.satisfies(process.version, ">=16.9.0")
})
// @from(Ln 161064, Col 4)
sYA = R((UB2, qD7) => {
    var sU5 = tX7(),
        tU5 = AD7(),
        eU5 = {
            ec: ["ES256", "ES384", "ES512"],
            rsa: ["RS256", "PS256", "RS384", "PS384", "RS512", "PS512"],
            "rsa-pss": ["PS256", "PS384", "PS512"]
        },
        Ap5 = {
            ES256: "prime256v1",
            ES384: "secp384r1",
            ES512: "secp521r1"
        };
    qD7.exports = function(A, q) {
        if (!A || !q) return;
        let K = q.asymmetricKeyType;
        if (!K) return;
        let Y = eU5[K];
        if (!Y) throw Error(`Unknown key type "${K}".`);
        if (!Y.includes(A)) throw Error(`"alg" parameter for "${K}" key type must be one of: ${Y.join(", ")}.`);
        if (sU5) switch (K) {
            case "ec":
                let z = q.asymmetricKeyDetails.namedCurve,
                    w = Ap5[A];
                if (z !== w) throw Error(`"alg" parameter "${A}" requires curve "${w}".`);
                break;
            case "rsa-pss":
                if (tU5) {
                    let H = parseInt(A.slice(-3), 10),
                        {
                            hashAlgorithm: $,
                            mgf1HashAlgorithm: O,
                            saltLength: _
                        } = q.asymmetricKeyDetails;
                    if ($ !== `sha${H}` || O !== $) throw Error(`Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${A}.`);
                    if (_ !== void 0 && _ > H >> 3) throw Error(`Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${A}.`)
                }
                break
        }
    }
})
// @from(Ln 161105, Col 4)
tYA = R((pB2, KD7) => {
    var qp5 = hY6();
    KD7.exports = qp5.satisfies(process.version, "^6.12.0 || >=8.0.0")
})
// @from(Ln 161109, Col 4)
wD7 = R((dB2, zD7) => {
    var GH = YI1(),
        Kp5 = bYA(),
        YD7 = uYA(),
        Yp5 = xYA(),
        zp5 = BYA(),
        wp5 = sYA(),
        Hp5 = tYA(),
        $p5 = PY6(),
        {
            KeyObject: Op5,
            createSecretKey: _p5,
            createPublicKey: Jp5
        } = h1("crypto"),
        eYA = ["RS256", "RS384", "RS512"],
        Xp5 = ["ES256", "ES384", "ES512"],
        AzA = ["RS256", "RS384", "RS512"],
        Dp5 = ["HS256", "HS384", "HS512"];
    if (Hp5) eYA.splice(eYA.length, 0, "PS256", "PS384", "PS512"), AzA.splice(AzA.length, 0, "PS256", "PS384", "PS512");
    zD7.exports = function(A, q, K, Y) {
        if (typeof K === "function" && !Y) Y = K, K = {};
        if (!K) K = {};
        K = Object.assign({}, K);
        let z;
        if (Y) z = Y;
        else z = function(J, X) {
            if (J) throw J;
            return X
        };
        if (K.clockTimestamp && typeof K.clockTimestamp !== "number") return z(new GH("clockTimestamp must be a number"));
        if (K.nonce !== void 0 && (typeof K.nonce !== "string" || K.nonce.trim() === "")) return z(new GH("nonce must be a non-empty string"));
        if (K.allowInvalidAsymmetricKeyTypes !== void 0 && typeof K.allowInvalidAsymmetricKeyTypes !== "boolean") return z(new GH("allowInvalidAsymmetricKeyTypes must be a boolean"));
        let w = K.clockTimestamp || Math.floor(Date.now() / 1000);
        if (!A) return z(new GH("jwt must be provided"));
        if (typeof A !== "string") return z(new GH("jwt must be a string"));
        let H = A.split(".");
        if (H.length !== 3) return z(new GH("jwt malformed"));
        let $;
        try {
            $ = Yp5(A, {
                complete: !0
            })
        } catch (J) {
            return z(J)
        }
        if (!$) return z(new GH("invalid token"));
        let O = $.header,
            _;
        if (typeof q === "function") {
            if (!Y) return z(new GH("verify must be called asynchronous if secret or public key is provided as a callback"));
            _ = q
        } else _ = function(J, X) {
            return X(null, q)
        };
        return _(O, function(J, X) {
            if (J) return z(new GH("error in secret or public key callback: " + J.message));
            let D = H[2].trim() !== "";
            if (!D && X) return z(new GH("jwt signature is required"));
            if (D && !X) return z(new GH("secret or public key must be provided"));
            if (!D && !K.algorithms) return z(new GH('please specify "none" in "algorithms" to verify unsigned tokens'));
            if (X != null && !(X instanceof Op5)) try {
                X = Jp5(X)
            } catch (P) {
                try {
                    X = _p5(typeof X === "string" ? Buffer.from(X) : X)
                } catch (W) {
                    return z(new GH("secretOrPublicKey is not valid key material"))
                }
            }
            if (!K.algorithms)
                if (X.type === "secret") K.algorithms = Dp5;
                else if (["rsa", "rsa-pss"].includes(X.asymmetricKeyType)) K.algorithms = AzA;
            else if (X.asymmetricKeyType === "ec") K.algorithms = Xp5;
            else K.algorithms = eYA;
            if (K.algorithms.indexOf($.header.alg) === -1) return z(new GH("invalid algorithm"));
            if (O.alg.startsWith("HS") && X.type !== "secret") return z(new GH(`secretOrPublicKey must be a symmetric key when using ${O.alg}`));
            else if (/^(?:RS|PS|ES)/.test(O.alg) && X.type !== "public") return z(new GH(`secretOrPublicKey must be an asymmetric key when using ${O.alg}`));
            if (!K.allowInvalidAsymmetricKeyTypes) try {
                wp5(O.alg, X)
            } catch (P) {
                return z(P)
            }
            let j;
            try {
                j = $p5.verify(A, $.header.alg, X)
            } catch (P) {
                return z(P)
            }
            if (!j) return z(new GH("invalid signature"));
            let M = $.payload;
            if (typeof M.nbf < "u" && !K.ignoreNotBefore) {
                if (typeof M.nbf !== "number") return z(new GH("invalid nbf value"));
                if (M.nbf > w + (K.clockTolerance || 0)) return z(new Kp5("jwt not active", new Date(M.nbf * 1000)))
            }
            if (typeof M.exp < "u" && !K.ignoreExpiration) {
                if (typeof M.exp !== "number") return z(new GH("invalid exp value"));
                if (w >= M.exp + (K.clockTolerance || 0)) return z(new YD7("jwt expired", new Date(M.exp * 1000)))
            }
            if (K.audience) {
                let P = Array.isArray(K.audience) ? K.audience : [K.audience];
                if (!(Array.isArray(M.aud) ? M.aud : [M.aud]).some(function(f) {
                        return P.some(function(Z) {
                            return Z instanceof RegExp ? Z.test(f) : Z === f
                        })
                    })) return z(new GH("jwt audience invalid. expected: " + P.join(" or ")))
            }
            if (K.issuer) {
                if (typeof K.issuer === "string" && M.iss !== K.issuer || Array.isArray(K.issuer) && K.issuer.indexOf(M.iss) === -1) return z(new GH("jwt issuer invalid. expected: " + K.issuer))
            }
            if (K.subject) {
                if (M.sub !== K.subject) return z(new GH("jwt subject invalid. expected: " + K.subject))
            }
            if (K.jwtid) {
                if (M.jti !== K.jwtid) return z(new GH("jwt jwtid invalid. expected: " + K.jwtid))
            }
            if (K.nonce) {
                if (M.nonce !== K.nonce) return z(new GH("jwt nonce invalid. expected: " + K.nonce))
            }
            if (K.maxAge) {
                if (typeof M.iat !== "number") return z(new GH("iat required when maxAge is specified"));
                let P = zp5(K.maxAge, M.iat);
                if (typeof P > "u") return z(new GH('"maxAge" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
                if (w >= P + (K.clockTolerance || 0)) return z(new YD7("maxAge exceeded", new Date(P * 1000)))
            }
            if (K.complete === !0) {
                let P = $.signature;
                return z(null, {
                    header: O,
                    payload: M,
                    signature: P
                })
            }
            return z(null, M)
        })
    }
})
// @from(Ln 161245, Col 4)
XD7 = R((cB2, JD7) => {
    var HD7 = 1 / 0,
        OD7 = 9007199254740991,
        jp5 = 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        $D7 = NaN,
        Mp5 = "[object Arguments]",
        Pp5 = "[object Function]",
        Wp5 = "[object GeneratorFunction]",
        Gp5 = "[object String]",
        Zp5 = "[object Symbol]",
        fp5 = /^\s+|\s+$/g,
        Vp5 = /^[-+]0x[0-9a-f]+$/i,
        Np5 = /^0b[01]+$/i,
        Tp5 = /^0o[0-7]+$/i,
        vp5 = /^(?:0|[1-9]\d*)$/,
        Ep5 = parseInt;

    function kp5(A, q) {
        var K = -1,
            Y = A ? A.length : 0,
            z = Array(Y);
        while (++K < Y) z[K] = q(A[K], K, A);
        return z
    }

    function Lp5(A, q, K, Y) {
        var z = A.length,
            w = K + (Y ? 1 : -1);
        while (Y ? w-- : ++w < z)
            if (q(A[w], w, A)) return w;
        return -1
    }

    function Rp5(A, q, K) {
        if (q !== q) return Lp5(A, yp5, K);
        var Y = K - 1,
            z = A.length;
        while (++Y < z)
            if (A[Y] === q) return Y;
        return -1
    }

    function yp5(A) {
        return A !== A
    }

    function Cp5(A, q) {
        var K = -1,
            Y = Array(A);
        while (++K < A) Y[K] = q(K);
        return Y
    }

    function Sp5(A, q) {
        return kp5(q, function(K) {
            return A[K]
        })
    }

    function hp5(A, q) {
        return function(K) {
            return A(q(K))
        }
    }
    var IY6 = Object.prototype,
        KzA = IY6.hasOwnProperty,
        xY6 = IY6.toString,
        Ip5 = IY6.propertyIsEnumerable,
        xp5 = hp5(Object.keys, Object),
        bp5 = Math.max;

    function up5(A, q) {
        var K = _D7(A) || gp5(A) ? Cp5(A.length, String) : [],
            Y = K.length,
            z = !!Y;
        for (var w in A)
            if ((q || KzA.call(A, w)) && !(z && (w == "length" || mp5(w, Y)))) K.push(w);
        return K
    }

    function Bp5(A) {
        if (!Fp5(A)) return xp5(A);
        var q = [];
        for (var K in Object(A))
            if (KzA.call(A, K) && K != "constructor") q.push(K);
        return q
    }

    function mp5(A, q) {
        return q = q == null ? OD7 : q, !!q && (typeof A == "number" || vp5.test(A)) && (A > -1 && A % 1 == 0 && A < q)
    }

    function Fp5(A) {
        var q = A && A.constructor,
            K = typeof q == "function" && q.prototype || IY6;
        return A === K
    }

    function Qp5(A, q, K, Y) {
        A = YzA(A) ? A : ap5(A), K = K && !Y ? np5(K) : 0;
        var z = A.length;
        if (K < 0) K = bp5(z + K, 0);
        return cp5(A) ? K <= z && A.indexOf(q, K) > -1 : !!z && Rp5(A, q, K) > -1
    }

    function gp5(A) {
        return Up5(A) && KzA.call(A, "callee") && (!Ip5.call(A, "callee") || xY6.call(A) == Mp5)
    }
    var _D7 = Array.isArray;

    function YzA(A) {
        return A != null && dp5(A.length) && !pp5(A)
    }

    function Up5(A) {
        return zzA(A) && YzA(A)
    }

    function pp5(A) {
        var q = qzA(A) ? xY6.call(A) : "";
        return q == Pp5 || q == Wp5
    }

    function dp5(A) {
        return typeof A == "number" && A > -1 && A % 1 == 0 && A <= OD7
    }

    function qzA(A) {
        var q = typeof A;
        return !!A && (q == "object" || q == "function")
    }

    function zzA(A) {
        return !!A && typeof A == "object"
    }

    function cp5(A) {
        return typeof A == "string" || !_D7(A) && zzA(A) && xY6.call(A) == Gp5
    }

    function lp5(A) {
        return typeof A == "symbol" || zzA(A) && xY6.call(A) == Zp5
    }

    function ip5(A) {
        if (!A) return A === 0 ? A : 0;
        if (A = rp5(A), A === HD7 || A === -HD7) {
            var q = A < 0 ? -1 : 1;
            return q * jp5
        }
        return A === A ? A : 0
    }

    function np5(A) {
        var q = ip5(A),
            K = q % 1;
        return q === q ? K ? q - K : q : 0
    }

    function rp5(A) {
        if (typeof A == "number") return A;
        if (lp5(A)) return $D7;
        if (qzA(A)) {
            var q = typeof A.valueOf == "function" ? A.valueOf() : A;
            A = qzA(q) ? q + "" : q
        }
        if (typeof A != "string") return A === 0 ? A : +A;
        A = A.replace(fp5, "");
        var K = Np5.test(A);
        return K || Tp5.test(A) ? Ep5(A.slice(2), K ? 2 : 8) : Vp5.test(A) ? $D7 : +A
    }

    function op5(A) {
        return YzA(A) ? up5(A) : Bp5(A)
    }

    function ap5(A) {
        return A ? Sp5(A, op5(A)) : []
    }
    JD7.exports = Qp5
})
// @from(Ln 161426, Col 4)
jD7 = R((lB2, DD7) => {
    var sp5 = "[object Boolean]",
        tp5 = Object.prototype,
        ep5 = tp5.toString;

    function Ad5(A) {
        return A === !0 || A === !1 || qd5(A) && ep5.call(A) == sp5
    }

    function qd5(A) {
        return !!A && typeof A == "object"
    }
    DD7.exports = Ad5
})
// @from(Ln 161440, Col 4)
ZD7 = R((iB2, GD7) => {
    var MD7 = 1 / 0,
        Kd5 = 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        PD7 = NaN,
        Yd5 = "[object Symbol]",
        zd5 = /^\s+|\s+$/g,
        wd5 = /^[-+]0x[0-9a-f]+$/i,
        Hd5 = /^0b[01]+$/i,
        $d5 = /^0o[0-7]+$/i,
        Od5 = parseInt,
        _d5 = Object.prototype,
        Jd5 = _d5.toString;

    function Xd5(A) {
        return typeof A == "number" && A == Pd5(A)
    }

    function WD7(A) {
        var q = typeof A;
        return !!A && (q == "object" || q == "function")
    }

    function Dd5(A) {
        return !!A && typeof A == "object"
    }

    function jd5(A) {
        return typeof A == "symbol" || Dd5(A) && Jd5.call(A) == Yd5
    }

    function Md5(A) {
        if (!A) return A === 0 ? A : 0;
        if (A = Wd5(A), A === MD7 || A === -MD7) {
            var q = A < 0 ? -1 : 1;
            return q * Kd5
        }
        return A === A ? A : 0
    }

    function Pd5(A) {
        var q = Md5(A),
            K = q % 1;
        return q === q ? K ? q - K : q : 0
    }

    function Wd5(A) {
        if (typeof A == "number") return A;
        if (jd5(A)) return PD7;
        if (WD7(A)) {
            var q = typeof A.valueOf == "function" ? A.valueOf() : A;
            A = WD7(q) ? q + "" : q
        }
        if (typeof A != "string") return A === 0 ? A : +A;
        A = A.replace(zd5, "");
        var K = Hd5.test(A);
        return K || $d5.test(A) ? Od5(A.slice(2), K ? 2 : 8) : wd5.test(A) ? PD7 : +A
    }
    GD7.exports = Xd5
})
// @from(Ln 161499, Col 4)
VD7 = R((nB2, fD7) => {
    var Gd5 = "[object Number]",
        Zd5 = Object.prototype,
        fd5 = Zd5.toString;

    function Vd5(A) {
        return !!A && typeof A == "object"
    }

    function Nd5(A) {
        return typeof A == "number" || Vd5(A) && fd5.call(A) == Gd5
    }
    fD7.exports = Nd5
})
// @from(Ln 161513, Col 4)
ED7 = R((rB2, vD7) => {
    var Td5 = "[object Object]";

    function vd5(A) {
        var q = !1;
        if (A != null && typeof A.toString != "function") try {
            q = !!(A + "")
        } catch (K) {}
        return q
    }

    function Ed5(A, q) {
        return function(K) {
            return A(q(K))
        }
    }
    var kd5 = Function.prototype,
        ND7 = Object.prototype,
        TD7 = kd5.toString,
        Ld5 = ND7.hasOwnProperty,
        Rd5 = TD7.call(Object),
        yd5 = ND7.toString,
        Cd5 = Ed5(Object.getPrototypeOf, Object);

    function Sd5(A) {
        return !!A && typeof A == "object"
    }

    function hd5(A) {
        if (!Sd5(A) || yd5.call(A) != Td5 || vd5(A)) return !1;
        var q = Cd5(A);
        if (q === null) return !0;
        var K = Ld5.call(q, "constructor") && q.constructor;
        return typeof K == "function" && K instanceof K && TD7.call(K) == Rd5
    }
    vD7.exports = hd5
})
// @from(Ln 161550, Col 4)
LD7 = R((oB2, kD7) => {
    var Id5 = "[object String]",
        xd5 = Object.prototype,
        bd5 = xd5.toString,
        ud5 = Array.isArray;

    function Bd5(A) {
        return !!A && typeof A == "object"
    }

    function md5(A) {
        return typeof A == "string" || !ud5(A) && Bd5(A) && bd5.call(A) == Id5
    }
    kD7.exports = md5
})
// @from(Ln 161565, Col 4)
hD7 = R((aB2, SD7) => {
    var Fd5 = "Expected a function",
        RD7 = 1 / 0,
        Qd5 = 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        yD7 = NaN,
        gd5 = "[object Symbol]",
        Ud5 = /^\s+|\s+$/g,
        pd5 = /^[-+]0x[0-9a-f]+$/i,
        dd5 = /^0b[01]+$/i,
        cd5 = /^0o[0-7]+$/i,
        ld5 = parseInt,
        id5 = Object.prototype,
        nd5 = id5.toString;

    function rd5(A, q) {
        var K;
        if (typeof q != "function") throw TypeError(Fd5);
        return A = ed5(A),
            function() {
                if (--A > 0) K = q.apply(this, arguments);
                if (A <= 1) q = void 0;
                return K
            }
    }

    function od5(A) {
        return rd5(2, A)
    }

    function CD7(A) {
        var q = typeof A;
        return !!A && (q == "object" || q == "function")
    }

    function ad5(A) {
        return !!A && typeof A == "object"
    }

    function sd5(A) {
        return typeof A == "symbol" || ad5(A) && nd5.call(A) == gd5
    }

    function td5(A) {
        if (!A) return A === 0 ? A : 0;
        if (A = Ac5(A), A === RD7 || A === -RD7) {
            var q = A < 0 ? -1 : 1;
            return q * Qd5
        }
        return A === A ? A : 0
    }

    function ed5(A) {
        var q = td5(A),
            K = q % 1;
        return q === q ? K ? q - K : q : 0
    }

    function Ac5(A) {
        if (typeof A == "number") return A;
        if (sd5(A)) return yD7;
        if (CD7(A)) {
            var q = typeof A.valueOf == "function" ? A.valueOf() : A;
            A = CD7(q) ? q + "" : q
        }
        if (typeof A != "string") return A === 0 ? A : +A;
        A = A.replace(Ud5, "");
        var K = dd5.test(A);
        return K || cd5.test(A) ? ld5(A.slice(2), K ? 2 : 8) : pd5.test(A) ? yD7 : +A
    }
    SD7.exports = od5
})
// @from(Ln 161636, Col 4)
gD7 = R((sB2, QD7) => {
    var ID7 = BYA(),
        qc5 = tYA(),
        Kc5 = sYA(),
        xD7 = PY6(),
        Yc5 = XD7(),
        bY6 = jD7(),
        bD7 = ZD7(),
        wzA = VD7(),
        BD7 = ED7(),
        wo = LD7(),
        zc5 = hD7(),
        {
            KeyObject: wc5,
            createSecretKey: Hc5,
            createPrivateKey: $c5
        } = h1("crypto"),
        mD7 = ["RS256", "RS384", "RS512", "ES256", "ES384", "ES512", "HS256", "HS384", "HS512", "none"];
    if (qc5) mD7.splice(3, 0, "PS256", "PS384", "PS512");
    var Oc5 = {
            expiresIn: {
                isValid: function(A) {
                    return bD7(A) || wo(A) && A
                },
                message: '"expiresIn" should be a number of seconds or string representing a timespan'
            },
            notBefore: {
                isValid: function(A) {
                    return bD7(A) || wo(A) && A
                },
                message: '"notBefore" should be a number of seconds or string representing a timespan'
            },
            audience: {
                isValid: function(A) {
                    return wo(A) || Array.isArray(A)
                },
                message: '"audience" must be a string or array'
            },
            algorithm: {
                isValid: Yc5.bind(null, mD7),
                message: '"algorithm" must be a valid string enum value'
            },
            header: {
                isValid: BD7,
                message: '"header" must be an object'
            },
            encoding: {
                isValid: wo,
                message: '"encoding" must be a string'
            },
            issuer: {
                isValid: wo,
                message: '"issuer" must be a string'
            },
            subject: {
                isValid: wo,
                message: '"subject" must be a string'
            },
            jwtid: {
                isValid: wo,
                message: '"jwtid" must be a string'
            },
            noTimestamp: {
                isValid: bY6,
                message: '"noTimestamp" must be a boolean'
            },
            keyid: {
                isValid: wo,
                message: '"keyid" must be a string'
            },
            mutatePayload: {
                isValid: bY6,
                message: '"mutatePayload" must be a boolean'
            },
            allowInsecureKeySizes: {
                isValid: bY6,
                message: '"allowInsecureKeySizes" must be a boolean'
            },
            allowInvalidAsymmetricKeyTypes: {
                isValid: bY6,
                message: '"allowInvalidAsymmetricKeyTypes" must be a boolean'
            }
        },
        _c5 = {
            iat: {
                isValid: wzA,
                message: '"iat" should be a number of seconds'
            },
            exp: {
                isValid: wzA,
                message: '"exp" should be a number of seconds'
            },
            nbf: {
                isValid: wzA,
                message: '"nbf" should be a number of seconds'
            }
        };

    function FD7(A, q, K, Y) {
        if (!BD7(K)) throw Error('Expected "' + Y + '" to be a plain object.');
        Object.keys(K).forEach(function(z) {
            let w = A[z];
            if (!w) {
                if (!q) throw Error('"' + z + '" is not allowed in "' + Y + '"');
                return
            }
            if (!w.isValid(K[z])) throw Error(w.message)
        })
    }

    function Jc5(A) {
        return FD7(Oc5, !1, A, "options")
    }

    function Xc5(A) {
        return FD7(_c5, !0, A, "payload")
    }
    var uD7 = {
            audience: "aud",
            issuer: "iss",
            subject: "sub",
            jwtid: "jti"
        },
        Dc5 = ["expiresIn", "notBefore", "noTimestamp", "audience", "issuer", "subject", "jwtid"];
    QD7.exports = function(A, q, K, Y) {
        if (typeof K === "function") Y = K, K = {};
        else K = K || {};
        let z = typeof A === "object" && !Buffer.isBuffer(A),
            w = Object.assign({
                alg: K.algorithm || "HS256",
                typ: z ? "JWT" : void 0,
                kid: K.keyid
            }, K.header);

        function H(_) {
            if (Y) return Y(_);
            throw _
        }
        if (!q && K.algorithm !== "none") return H(Error("secretOrPrivateKey must have a value"));
        if (q != null && !(q instanceof wc5)) try {
            q = $c5(q)
        } catch (_) {
            try {
                q = Hc5(typeof q === "string" ? Buffer.from(q) : q)
            } catch (J) {
                return H(Error("secretOrPrivateKey is not valid key material"))
            }
        }
        if (w.alg.startsWith("HS") && q.type !== "secret") return H(Error(`secretOrPrivateKey must be a symmetric key when using ${w.alg}`));
        else if (/^(?:RS|PS|ES)/.test(w.alg)) {
            if (q.type !== "private") return H(Error(`secretOrPrivateKey must be an asymmetric key when using ${w.alg}`));
            if (!K.allowInsecureKeySizes && !w.alg.startsWith("ES") && q.asymmetricKeyDetails !== void 0 && q.asymmetricKeyDetails.modulusLength < 2048) return H(Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${w.alg}`))
        }
        if (typeof A > "u") return H(Error("payload is required"));
        else if (z) {
            try {
                Xc5(A)
            } catch (_) {
                return H(_)
            }
            if (!K.mutatePayload) A = Object.assign({}, A)
        } else {
            let _ = Dc5.filter(function(J) {
                return typeof K[J] < "u"
            });
            if (_.length > 0) return H(Error("invalid " + _.join(",") + " option for " + typeof A + " payload"))
        }
        if (typeof A.exp < "u" && typeof K.expiresIn < "u") return H(Error('Bad "options.expiresIn" option the payload already has an "exp" property.'));
        if (typeof A.nbf < "u" && typeof K.notBefore < "u") return H(Error('Bad "options.notBefore" option the payload already has an "nbf" property.'));
        try {
            Jc5(K)
        } catch (_) {
            return H(_)
        }
        if (!K.allowInvalidAsymmetricKeyTypes) try {
            Kc5(w.alg, q)
        } catch (_) {
            return H(_)
        }
        let $ = A.iat || Math.floor(Date.now() / 1000);
        if (K.noTimestamp) delete A.iat;
        else if (z) A.iat = $;
        if (typeof K.notBefore < "u") {
            try {
                A.nbf = ID7(K.notBefore, $)
            } catch (_) {
                return H(_)
            }
            if (typeof A.nbf > "u") return H(Error('"notBefore" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'))
        }
        if (typeof K.expiresIn < "u" && typeof A === "object") {
            try {
                A.exp = ID7(K.expiresIn, $)
            } catch (_) {
                return H(_)
            }
            if (typeof A.exp > "u") return H(Error('"expiresIn" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'))
        }
        Object.keys(uD7).forEach(function(_) {
            let J = uD7[_];
            if (typeof K[_] < "u") {
                if (typeof A[J] < "u") return H(Error('Bad "options.' + _ + '" option. The payload already has an "' + J + '" property.'));
                A[J] = K[_]
            }
        });
        let O = K.encoding || "utf8";
        if (typeof Y === "function") Y = Y && zc5(Y), xD7.createSign({
            header: w,
            privateKey: q,
            payload: A,
            encoding: O
        }).once("error", Y).once("done", function(_) {
            if (!K.allowInsecureKeySizes && /^(?:RS|PS)/.test(w.alg) && _.length < 256) return Y(Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${w.alg}`));
            Y(null, _)
        });
        else {
            let _ = xD7.sign({
                header: w,
                payload: A,
                secret: q,
                encoding: O
            });
            if (!K.allowInsecureKeySizes && /^(?:RS|PS)/.test(w.alg) && _.length < 256) throw Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${w.alg}`);
            return _
        }
    }
})
// @from(Ln 161863, Col 4)
pD7 = R((tB2, UD7) => {
    UD7.exports = {
        decode: xYA(),
        verify: wD7(),
        sign: gD7(),
        JsonWebTokenError: YI1(),
        NotBeforeError: bYA(),
        TokenExpiredError: uYA()
    }
})
// @from(Ln 161873, Col 0)
class RS {
    static fromAssertion(A) {
        let q = new RS;
        return q.jwt = A, q
    }
    static fromCertificate(A, q, K) {
        let Y = new RS;
        if (Y.privateKey = q, Y.thumbprint = A, Y.useSha256 = !1, K) Y.publicCertificate = this.parseCertificate(K);
        return Y
    }
    static fromCertificateWithSha256Thumbprint(A, q, K) {
        let Y = new RS;
        if (Y.privateKey = q, Y.thumbprint = A, Y.useSha256 = !0, K) Y.publicCertificate = this.parseCertificate(K);
        return Y
    }
    getJwt(A, q, K) {
        if (this.privateKey && this.thumbprint) {
            if (this.jwt && !this.isExpired() && q === this.issuer && K === this.jwtAudience) return this.jwt;
            return this.createJwt(A, q, K)
        }
        if (this.jwt) return this.jwt;
        throw Y8(e2.invalidAssertion)
    }
    createJwt(A, q, K) {
        this.issuer = q, this.jwtAudience = K;
        let Y = oH.nowSeconds();
        this.expirationTime = Y + 600;
        let w = {
                alg: this.useSha256 ? CL.PSS_256 : CL.RSA_256
            },
            H = this.useSha256 ? CL.X5T_256 : CL.X5T;
        if (Object.assign(w, {
                [H]: SV.base64EncodeUrl(this.thumbprint, VM.HEX)
            }), this.publicCertificate) Object.assign(w, {
            [CL.X5C]: this.publicCertificate
        });
        let $ = {
            [CL.AUDIENCE]: this.jwtAudience,
            [CL.EXPIRATION_TIME]: this.expirationTime,
            [CL.ISSUER]: this.issuer,
            [CL.SUBJECT]: this.issuer,
            [CL.NOT_BEFORE]: Y,
            [CL.JWT_ID]: A.createNewGuid()
        };
        return this.jwt = dD7.default.sign($, this.privateKey, {
            header: w
        }), this.jwt
    }
    isExpired() {
        return this.expirationTime < oH.nowSeconds()
    }
    static parseCertificate(A) {
        let q = /-----BEGIN CERTIFICATE-----\r*\n(.+?)\r*\n-----END CERTIFICATE-----/gs,
            K = [],
            Y;
        while ((Y = q.exec(A)) !== null) K.push(Y[1].replace(/\r*\n/g, uA.EMPTY_STRING));
        return K
    }
}
// @from(Ln 161932, Col 4)
dD7
// @from(Ln 161933, Col 4)
uY6 = v(() => {
    ez();
    ah1();
    sH();
    dD7 = o(pD7(), 1); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 161939, Col 4)
BY6 = "@azure/msal-node"
// @from(Ln 161940, Col 4)
yS = "3.8.1"
// @from(Ln 161941, Col 4)
VX1 = v(() => {
    /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Ln 161943, Col 4)
DI1
// @from(Ln 161944, Col 4)
HzA = v(() => {
    ez(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    DI1 = class DI1 extends VW {
        constructor(A) {
            super(A)
        }
        async acquireToken(A) {
            this.logger.info("in acquireToken call in username-password client");
            let q = oH.nowSeconds(),
                K = await this.executeTokenRequest(this.authority, A),
                Y = new R_(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
            return Y.validateTokenResponse(K.body), Y.handleServerTokenResponse(K.body, this.authority, q, A)
        }
        async executeTokenRequest(A, q) {
            let K = this.createTokenQueryParameters(q),
                Y = A5.appendQueryString(A.tokenEndpoint, K),
                z = await this.createTokenRequestBody(q),
                w = this.createTokenRequestHeaders({
                    credential: q.username,
                    type: oG.UPN
                }),
                H = {
                    clientId: this.config.authOptions.clientId,
                    authority: A.canonicalAuthority,
                    scopes: q.scopes,
                    claims: q.claims,
                    authenticationScheme: q.authenticationScheme,
                    resourceRequestMethod: q.resourceRequestMethod,
                    resourceRequestUri: q.resourceRequestUri,
                    shrClaims: q.shrClaims,
                    sshKid: q.sshKid
                };
            return this.executePostToTokenEndpoint(Y, z, w, H, q.correlationId)
        }
        async createTokenRequestBody(A) {
            let q = new Map;
            if ($4.addClientId(q, this.config.authOptions.clientId), $4.addUsername(q, A.username), $4.addPassword(q, A.password), $4.addScopes(q, A.scopes), $4.addResponseType(q, nJ1.IDTOKEN_TOKEN), $4.addGrantType(q, RV.RESOURCE_OWNER_PASSWORD_GRANT), $4.addClientInfo(q), $4.addLibraryInfo(q, this.config.libraryInfo), $4.addApplicationTelemetry(q, this.config.telemetry.application), $4.addThrottling(q), this.serverTelemetryManager) $4.addServerTelemetry(q, this.serverTelemetryManager);
            let K = A.correlationId || this.config.cryptoInterface.createNewGuid();
            if ($4.addCorrelationId(q, K), this.config.clientCredentials.clientSecret) $4.addClientSecret(q, this.config.clientCredentials.clientSecret);
            let Y = this.config.clientCredentials.clientAssertion;
            if (Y) $4.addClientAssertion(q, await tG(Y.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), $4.addClientAssertionType(q, Y.assertionType);
            if (!kw.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) $4.addClaims(q, A.claims, this.config.authOptions.clientCapabilities);
            if (this.config.systemOptions.preventCorsPreflight && A.username) $4.addCcsUpn(q, A.username);
            return NM.mapToQueryString(q)
        }
    }
})
// @from(Ln 161992, Col 0)
function cD7(A, q, K, Y) {
    let z = ph1.getStandardAuthorizeRequestParameters({
        ...A.auth,
        authority: q,
        redirectUri: K.redirectUri || ""
    }, K, Y);
    if ($4.addLibraryInfo(z, {
            sku: eG.MSAL_SKU,
            version: yS,
            cpu: process.arch || "",
            os: process.platform || ""
        }), A.auth.protocolMode !== fW.OIDC) $4.addApplicationTelemetry(z, A.telemetry.application);
    if ($4.addResponseType(z, nJ1.CODE), K.codeChallenge && K.codeChallengeMethod) $4.addCodeChallengeParams(z, K.codeChallenge, K.codeChallengeMethod);
    return $4.addExtraQueryParameters(z, K.extraQueryParameters || {}), ph1.getAuthorizeUrl(q, z, A.auth.encodeExtraQueryParams, K.extraQueryParameters)
}
// @from(Ln 162007, Col 4)
lD7 = v(() => {
    ez();
    sH();
    VX1(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 162012, Col 0)
class C41 {
    constructor(A) {
        this.config = PO7(A), this.cryptoProvider = new TU, this.logger = new yV(this.config.system.loggerOptions, BY6, yS), this.storage = new L41(this.logger, this.config.auth.clientId, this.cryptoProvider, s9A(this.config.auth)), this.tokenCache = new eh1(this.storage, this.logger, this.config.cache.cachePlugin)
    }
    async getAuthCodeUrl(A) {
        this.logger.info("getAuthCodeUrl called", A.correlationId);
        let q = {
                ...A,
                ...await this.initializeBaseRequest(A),
                responseMode: A.responseMode || Cu.QUERY,
                authenticationScheme: b9.BEARER,
                state: A.state || "",
                nonce: A.nonce || ""
            },
            K = await this.createAuthority(q.authority, q.correlationId, void 0, A.azureCloudOptions);
        return cD7(this.config, K, q, this.logger)
    }
    async acquireTokenByCode(A, q) {
        if (this.logger.info("acquireTokenByCode called"), A.state && q) this.logger.info("acquireTokenByCode - validating state"), this.validateState(A.state, q.state || ""), q = {
            ...q,
            state: ""
        };
        let K = {
                ...A,
                ...await this.initializeBaseRequest(A),
                authenticationScheme: b9.BEARER
            },
            Y = this.initializeServerTelemetryManager(VU.acquireTokenByCode, K.correlationId);
        try {
            let z = await this.createAuthority(K.authority, K.correlationId, void 0, A.azureCloudOptions),
                w = await this.buildOauthClientConfiguration(z, K.correlationId, K.redirectUri, Y),
                H = new Q96(w);
            return this.logger.verbose("Auth code client created", K.correlationId), await H.acquireToken(K, q)
        } catch (z) {
            if (z instanceof m3) z.setCorrelationId(K.correlationId);
            throw Y.cacheFailedRequest(z), z
        }
    }
    async acquireTokenByRefreshToken(A) {
        this.logger.info("acquireTokenByRefreshToken called", A.correlationId);
        let q = {
                ...A,
                ...await this.initializeBaseRequest(A),
                authenticationScheme: b9.BEARER
            },
            K = this.initializeServerTelemetryManager(VU.acquireTokenByRefreshToken, q.correlationId);
        try {
            let Y = await this.createAuthority(q.authority, q.correlationId, void 0, A.azureCloudOptions),
                z = await this.buildOauthClientConfiguration(Y, q.correlationId, q.redirectUri || "", K),
                w = new jX1(z);
            return this.logger.verbose("Refresh token client created", q.correlationId), await w.acquireToken(q)
        } catch (Y) {
            if (Y instanceof m3) Y.setCorrelationId(q.correlationId);
            throw K.cacheFailedRequest(Y), Y
        }
    }
    async acquireTokenSilent(A) {
        let q = {
                ...A,
                ...await this.initializeBaseRequest(A),
                forceRefresh: A.forceRefresh || !1
            },
            K = this.initializeServerTelemetryManager(VU.acquireTokenSilent, q.correlationId, q.forceRefresh);
        try {
            let Y = await this.createAuthority(q.authority, q.correlationId, void 0, A.azureCloudOptions),
                z = await this.buildOauthClientConfiguration(Y, q.correlationId, q.redirectUri || "", K),
                w = new g96(z);
            this.logger.verbose("Silent flow client created", q.correlationId);
            try {
                return await this.tokenCache.overwriteCache(), await this.acquireCachedTokenSilent(q, w, z)
            } catch (H) {
                if (H instanceof ir && H.errorCode === e2.tokenRefreshRequired) return new jX1(z).acquireTokenByRefreshToken(q);
                throw H
            }
        } catch (Y) {
            if (Y instanceof m3) Y.setCorrelationId(q.correlationId);
            throw K.cacheFailedRequest(Y), Y
        }
    }
    async acquireCachedTokenSilent(A, q, K) {
        let [Y, z] = await q.acquireCachedToken({
            ...A,
            scopes: A.scopes?.length ? A.scopes : [...ZW]
        });
        if (z === Ew.PROACTIVELY_REFRESHED) {
            this.logger.info("ClientApplication:acquireCachedTokenSilent - Cached access token's refreshOn property has been exceeded'. It's not expired, but must be refreshed.");
            let w = new jX1(K);
            try {
                await w.acquireTokenByRefreshToken(A)
            } catch {}
        }
        return Y
    }
    async acquireTokenByUsernamePassword(A) {
        this.logger.info("acquireTokenByUsernamePassword called", A.correlationId);
        let q = {
                ...A,
                ...await this.initializeBaseRequest(A)
            },
            K = this.initializeServerTelemetryManager(VU.acquireTokenByUsernamePassword, q.correlationId);
        try {
            let Y = await this.createAuthority(q.authority, q.correlationId, void 0, A.azureCloudOptions),
                z = await this.buildOauthClientConfiguration(Y, q.correlationId, "", K),
                w = new DI1(z);
            return this.logger.verbose("Username password client created", q.correlationId), await w.acquireToken(q)
        } catch (Y) {
            if (Y instanceof m3) Y.setCorrelationId(q.correlationId);
            throw K.cacheFailedRequest(Y), Y
        }
    }
    getTokenCache() {
        return this.logger.info("getTokenCache called"), this.tokenCache
    }
    validateState(A, q) {
        if (!A) throw Q$.createStateNotFoundError();
        if (A !== q) throw Y8(e2.stateMismatch)
    }
    getLogger() {
        return this.logger
    }
    setLogger(A) {
        this.logger = A
    }
    async buildOauthClientConfiguration(A, q, K, Y) {
        return this.logger.verbose("buildOauthClientConfiguration called", q), this.logger.info(`Building oauth client configuration with the following authority: ${A.tokenEndpoint}.`, q), Y?.updateRegionDiscoveryMetadata(A.regionDiscoveryMetadata), {
            authOptions: {
                clientId: this.config.auth.clientId,
                authority: A,
                clientCapabilities: this.config.auth.clientCapabilities,
                redirectUri: K
            },
            loggerOptions: {
                logLevel: this.config.system.loggerOptions.logLevel,
                loggerCallback: this.config.system.loggerOptions.loggerCallback,
                piiLoggingEnabled: this.config.system.loggerOptions.piiLoggingEnabled,
                correlationId: q
            },
            cacheOptions: {
                claimsBasedCachingEnabled: this.config.cache.claimsBasedCachingEnabled
            },
            cryptoInterface: this.cryptoProvider,
            networkInterface: this.config.system.networkClient,
            storageInterface: this.storage,
            serverTelemetryManager: Y,
            clientCredentials: {
                clientSecret: this.clientSecret,
                clientAssertion: await this.getClientAssertion(A)
            },
            libraryInfo: {
                sku: eG.MSAL_SKU,
                version: yS,
                cpu: process.arch || uA.EMPTY_STRING,
                os: process.platform || uA.EMPTY_STRING
            },
            telemetry: this.config.telemetry,
            persistencePlugin: this.config.cache.cachePlugin,
            serializableCache: this.tokenCache
        }
    }
    async getClientAssertion(A) {
        if (this.developerProvidedClientAssertion) this.clientAssertion = RS.fromAssertion(await tG(this.developerProvidedClientAssertion, this.config.auth.clientId, A.tokenEndpoint));
        return this.clientAssertion && {
            assertion: this.clientAssertion.getJwt(this.cryptoProvider, this.config.auth.clientId, A.tokenEndpoint),
            assertionType: eG.JWT_BEARER_ASSERTION_TYPE
        }
    }
    async initializeBaseRequest(A) {
        if (this.logger.verbose("initializeRequestScopes called", A.correlationId), A.authenticationScheme && A.authenticationScheme === b9.POP) this.logger.verbose("Authentication Scheme 'pop' is not supported yet, setting Authentication Scheme to 'Bearer' for request", A.correlationId);
        if (A.authenticationScheme = b9.BEARER, this.config.cache.claimsBasedCachingEnabled && A.claims && !kw.isEmptyObj(A.claims)) A.requestedClaimsHash = await this.cryptoProvider.hashString(A.claims);
        return {
            ...A,
            scopes: [...A && A.scopes || [], ...ZW],
            correlationId: A && A.correlationId || this.cryptoProvider.createNewGuid(),
            authority: A.authority || this.config.auth.authority
        }
    }
    initializeServerTelemetryManager(A, q, K) {
        let Y = {
            clientId: this.config.auth.clientId,
            correlationId: q,
            apiId: A,
            forceRefresh: K || !1
        };
        return new Ko(Y, this.storage)
    }
    async createAuthority(A, q, K, Y) {
        this.logger.verbose("createAuthority called", q);
        let z = mD.generateAuthority(A, Y || this.config.auth.azureCloudOptions),
            w = {
                protocolMode: this.config.auth.protocolMode,
                knownAuthorities: this.config.auth.knownAuthorities,
                cloudDiscoveryMetadata: this.config.auth.cloudDiscoveryMetadata,
                authorityMetadata: this.config.auth.authorityMetadata,
                azureRegionConfiguration: K,
                skipAuthorityMetadataCache: this.config.auth.skipAuthorityMetadataCache
            };
        return R96.createDiscoveredInstance(z, this.config.system.networkClient, this.storage, w, this.logger, q)
    }
    clearCache() {
        this.storage.clear()
    }
}
// @from(Ln 162214, Col 4)
mY6 = v(() => {
    ez();
    DYA();
    sh1();
    zY6();
    sH();
    NYA();
    uY6();
    VX1();
    ih1();
    HzA();
    lD7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 162228, Col 0)
class $zA {
    async listenForAuthCode(A, q) {
        if (this.server) throw Q$.createLoopbackServerAlreadyExistsError();
        return new Promise((K, Y) => {
            this.server = jc5.createServer((z, w) => {
                let H = z.url;
                if (!H) {
                    w.end(q || "Error occurred loading redirectUrl"), Y(Q$.createUnableToLoadRedirectUrlError());
                    return
                } else if (H === uA.FORWARD_SLASH) {
                    w.end(A || "Auth code was successfully acquired. You can close this window now.");
                    return
                }
                let $ = this.getRedirectUri(),
                    O = new URL(H, $),
                    _ = NM.getDeserializedResponse(O.search) || {};
                if (_.code) w.writeHead(B3.REDIRECT, {
                    location: $
                }), w.end();
                if (_.error) w.end(q || `Error occurred: ${_.error}`);
                K(_)
            }), this.server.listen(0, "127.0.0.1")
        })
    }
    getRedirectUri() {
        if (!this.server || !this.server.listening) throw Q$.createNoLoopbackServerExistsError();
        let A = this.server.address();
        if (!A || typeof A === "string" || !A.port) throw this.closeServer(), Q$.createInvalidLoopbackAddressTypeError();
        let q = A && A.port;
        return `${eG.HTTP_PROTOCOL}${eG.LOCALHOST}:${q}`
    }
    closeServer() {
        if (this.server) {
            if (this.server.close(), typeof this.server.closeAllConnections === "function") this.server.closeAllConnections();
            this.server.unref(), this.server = void 0
        }
    }
}
// @from(Ln 162266, Col 4)
iD7 = v(() => {
    ez();
    ih1();
    sH(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 162271, Col 4)
jI1