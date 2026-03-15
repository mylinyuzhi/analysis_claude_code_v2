
// @from(Ln 185009, Col 4)
I08 = x((Fv2, Zd7) => {
    var j_9 = QJ1();
    Zd7.exports = function(A, q) {
        q = q || {};
        var K = j_9.decode(A, q);
        if (!K) return null;
        var Y = K.payload;
        if (typeof Y === "string") try {
            var z = JSON.parse(Y);
            if (z !== null && typeof z === "object") Y = z
        } catch (_) {}
        if (q.complete === !0) return {
            header: K.header,
            payload: Y,
            signature: K.signature
        };
        return Y
    }
})
// @from(Ln 185028, Col 4)
eB6 = x((pv2, Gd7) => {
    var UJ1 = function(A, q) {
        if (Error.call(this, A), Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
        if (this.name = "JsonWebTokenError", this.message = A, q) this.inner = q
    };
    UJ1.prototype = Object.create(Error.prototype);
    UJ1.prototype.constructor = UJ1;
    Gd7.exports = UJ1
})
// @from(Ln 185037, Col 4)
b08 = x((Qv2, Td7) => {
    var fd7 = eB6(),
        dJ1 = function(A, q) {
            fd7.call(this, A), this.name = "NotBeforeError", this.date = q
        };
    dJ1.prototype = Object.create(fd7.prototype);
    dJ1.prototype.constructor = dJ1;
    Td7.exports = dJ1
})
// @from(Ln 185046, Col 4)
x08 = x((Uv2, Nd7) => {
    var vd7 = eB6(),
        cJ1 = function(A, q) {
            vd7.call(this, A), this.name = "TokenExpiredError", this.expiredAt = q
        };
    cJ1.prototype = Object.create(vd7.prototype);
    cJ1.prototype.constructor = cJ1;
    Nd7.exports = cJ1
})
// @from(Ln 185055, Col 4)
u08 = x((dv2, Vd7) => {
    var J_9 = mc1();
    Vd7.exports = function(A, q) {
        var K = q || Math.floor(Date.now() / 1000);
        if (typeof A === "string") {
            var Y = J_9(A);
            if (typeof Y > "u") return;
            return Math.floor(K + Y / 1000)
        } else if (typeof A === "number") return K + A;
        else return
    }
})
// @from(Ln 185067, Col 4)
Ag6 = x((cv2, kd7) => {
    var M_9 = Number.MAX_SAFE_INTEGER || 9007199254740991,
        D_9 = ["major", "premajor", "minor", "preminor", "patch", "prepatch", "prerelease"];
    kd7.exports = {
        MAX_LENGTH: 256,
        MAX_SAFE_COMPONENT_LENGTH: 16,
        MAX_SAFE_BUILD_LENGTH: 250,
        MAX_SAFE_INTEGER: M_9,
        RELEASE_TYPES: D_9,
        SEMVER_SPEC_VERSION: "2.0.0",
        FLAG_INCLUDE_PRERELEASE: 1,
        FLAG_LOOSE: 2
    }
})
// @from(Ln 185081, Col 4)
qg6 = x((lv2, Ed7) => {
    var X_9 = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...A) => console.error("SEMVER", ...A) : () => {};
    Ed7.exports = X_9
})
// @from(Ln 185085, Col 4)
pP6 = x((em, yd7) => {
    var {
        MAX_SAFE_COMPONENT_LENGTH: m08,
        MAX_SAFE_BUILD_LENGTH: P_9,
        MAX_LENGTH: W_9
    } = Ag6(), Z_9 = qg6();
    em = yd7.exports = {};
    var G_9 = em.re = [],
        f_9 = em.safeRe = [],
        C4 = em.src = [],
        T_9 = em.safeSrc = [],
        I4 = em.t = {},
        v_9 = 0,
        B08 = "[a-zA-Z0-9-]",
        N_9 = [
            ["\\s", 1],
            ["\\d", W_9],
            [B08, P_9]
        ],
        V_9 = (A) => {
            for (let [q, K] of N_9) A = A.split(`${q}*`).join(`${q}{0,${K}}`).split(`${q}+`).join(`${q}{1,${K}}`);
            return A
        },
        d5 = (A, q, K) => {
            let Y = V_9(q),
                z = v_9++;
            Z_9(A, z, q), I4[A] = z, C4[z] = q, T_9[z] = Y, G_9[z] = new RegExp(q, K ? "g" : void 0), f_9[z] = new RegExp(Y, K ? "g" : void 0)
        };
    d5("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    d5("NUMERICIDENTIFIERLOOSE", "\\d+");
    d5("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${B08}*`);
    d5("MAINVERSION", `(${C4[I4.NUMERICIDENTIFIER]})\\.(${C4[I4.NUMERICIDENTIFIER]})\\.(${C4[I4.NUMERICIDENTIFIER]})`);
    d5("MAINVERSIONLOOSE", `(${C4[I4.NUMERICIDENTIFIERLOOSE]})\\.(${C4[I4.NUMERICIDENTIFIERLOOSE]})\\.(${C4[I4.NUMERICIDENTIFIERLOOSE]})`);
    d5("PRERELEASEIDENTIFIER", `(?:${C4[I4.NUMERICIDENTIFIER]}|${C4[I4.NONNUMERICIDENTIFIER]})`);
    d5("PRERELEASEIDENTIFIERLOOSE", `(?:${C4[I4.NUMERICIDENTIFIERLOOSE]}|${C4[I4.NONNUMERICIDENTIFIER]})`);
    d5("PRERELEASE", `(?:-(${C4[I4.PRERELEASEIDENTIFIER]}(?:\\.${C4[I4.PRERELEASEIDENTIFIER]})*))`);
    d5("PRERELEASELOOSE", `(?:-?(${C4[I4.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${C4[I4.PRERELEASEIDENTIFIERLOOSE]})*))`);
    d5("BUILDIDENTIFIER", `${B08}+`);
    d5("BUILD", `(?:\\+(${C4[I4.BUILDIDENTIFIER]}(?:\\.${C4[I4.BUILDIDENTIFIER]})*))`);
    d5("FULLPLAIN", `v?${C4[I4.MAINVERSION]}${C4[I4.PRERELEASE]}?${C4[I4.BUILD]}?`);
    d5("FULL", `^${C4[I4.FULLPLAIN]}$`);
    d5("LOOSEPLAIN", `[v=\\s]*${C4[I4.MAINVERSIONLOOSE]}${C4[I4.PRERELEASELOOSE]}?${C4[I4.BUILD]}?`);
    d5("LOOSE", `^${C4[I4.LOOSEPLAIN]}$`);
    d5("GTLT", "((?:<|>)?=?)");
    d5("XRANGEIDENTIFIERLOOSE", `${C4[I4.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    d5("XRANGEIDENTIFIER", `${C4[I4.NUMERICIDENTIFIER]}|x|X|\\*`);
    d5("XRANGEPLAIN", `[v=\\s]*(${C4[I4.XRANGEIDENTIFIER]})(?:\\.(${C4[I4.XRANGEIDENTIFIER]})(?:\\.(${C4[I4.XRANGEIDENTIFIER]})(?:${C4[I4.PRERELEASE]})?${C4[I4.BUILD]}?)?)?`);
    d5("XRANGEPLAINLOOSE", `[v=\\s]*(${C4[I4.XRANGEIDENTIFIERLOOSE]})(?:\\.(${C4[I4.XRANGEIDENTIFIERLOOSE]})(?:\\.(${C4[I4.XRANGEIDENTIFIERLOOSE]})(?:${C4[I4.PRERELEASELOOSE]})?${C4[I4.BUILD]}?)?)?`);
    d5("XRANGE", `^${C4[I4.GTLT]}\\s*${C4[I4.XRANGEPLAIN]}$`);
    d5("XRANGELOOSE", `^${C4[I4.GTLT]}\\s*${C4[I4.XRANGEPLAINLOOSE]}$`);
    d5("COERCEPLAIN", `(^|[^\\d])(\\d{1,${m08}})(?:\\.(\\d{1,${m08}}))?(?:\\.(\\d{1,${m08}}))?`);
    d5("COERCE", `${C4[I4.COERCEPLAIN]}(?:$|[^\\d])`);
    d5("COERCEFULL", C4[I4.COERCEPLAIN] + `(?:${C4[I4.PRERELEASE]})?(?:${C4[I4.BUILD]})?(?:$|[^\\d])`);
    d5("COERCERTL", C4[I4.COERCE], !0);
    d5("COERCERTLFULL", C4[I4.COERCEFULL], !0);
    d5("LONETILDE", "(?:~>?)");
    d5("TILDETRIM", `(\\s*)${C4[I4.LONETILDE]}\\s+`, !0);
    em.tildeTrimReplace = "$1~";
    d5("TILDE", `^${C4[I4.LONETILDE]}${C4[I4.XRANGEPLAIN]}$`);
    d5("TILDELOOSE", `^${C4[I4.LONETILDE]}${C4[I4.XRANGEPLAINLOOSE]}$`);
    d5("LONECARET", "(?:\\^)");
    d5("CARETTRIM", `(\\s*)${C4[I4.LONECARET]}\\s+`, !0);
    em.caretTrimReplace = "$1^";
    d5("CARET", `^${C4[I4.LONECARET]}${C4[I4.XRANGEPLAIN]}$`);
    d5("CARETLOOSE", `^${C4[I4.LONECARET]}${C4[I4.XRANGEPLAINLOOSE]}$`);
    d5("COMPARATORLOOSE", `^${C4[I4.GTLT]}\\s*(${C4[I4.LOOSEPLAIN]})$|^$`);
    d5("COMPARATOR", `^${C4[I4.GTLT]}\\s*(${C4[I4.FULLPLAIN]})$|^$`);
    d5("COMPARATORTRIM", `(\\s*)${C4[I4.GTLT]}\\s*(${C4[I4.LOOSEPLAIN]}|${C4[I4.XRANGEPLAIN]})`, !0);
    em.comparatorTrimReplace = "$1$2$3";
    d5("HYPHENRANGE", `^\\s*(${C4[I4.XRANGEPLAIN]})\\s+-\\s+(${C4[I4.XRANGEPLAIN]})\\s*$`);
    d5("HYPHENRANGELOOSE", `^\\s*(${C4[I4.XRANGEPLAINLOOSE]})\\s+-\\s+(${C4[I4.XRANGEPLAINLOOSE]})\\s*$`);
    d5("STAR", "(<|>)?=?\\s*\\*");
    d5("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    d5("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$")
})
// @from(Ln 185160, Col 4)
lJ1 = x((iv2, Ld7) => {
    var k_9 = Object.freeze({
            loose: !0
        }),
        E_9 = Object.freeze({}),
        y_9 = (A) => {
            if (!A) return E_9;
            if (typeof A !== "object") return k_9;
            return A
        };
    Ld7.exports = y_9
})
// @from(Ln 185172, Col 4)
g08 = x((nv2, Sd7) => {
    var Rd7 = /^[0-9]+$/,
        hd7 = (A, q) => {
            let K = Rd7.test(A),
                Y = Rd7.test(q);
            if (K && Y) A = +A, q = +q;
            return A === q ? 0 : K && !Y ? -1 : Y && !K ? 1 : A < q ? -1 : 1
        },
        L_9 = (A, q) => hd7(q, A);
    Sd7.exports = {
        compareIdentifiers: hd7,
        rcompareIdentifiers: L_9
    }
})
// @from(Ln 185186, Col 4)
rW = x((rv2, xd7) => {
    var iJ1 = qg6(),
        {
            MAX_LENGTH: Cd7,
            MAX_SAFE_INTEGER: nJ1
        } = Ag6(),
        {
            safeRe: Id7,
            safeSrc: bd7,
            t: rJ1
        } = pP6(),
        R_9 = lJ1(),
        {
            compareIdentifiers: QP6
        } = g08();
    class sC {
        constructor(A, q) {
            if (q = R_9(q), A instanceof sC)
                if (A.loose === !!q.loose && A.includePrerelease === !!q.includePrerelease) return A;
                else A = A.version;
            else if (typeof A !== "string") throw TypeError(`Invalid version. Must be a string. Got type "${typeof A}".`);
            if (A.length > Cd7) throw TypeError(`version is longer than ${Cd7} characters`);
            iJ1("SemVer", A, q), this.options = q, this.loose = !!q.loose, this.includePrerelease = !!q.includePrerelease;
            let K = A.trim().match(q.loose ? Id7[rJ1.LOOSE] : Id7[rJ1.FULL]);
            if (!K) throw TypeError(`Invalid Version: ${A}`);
            if (this.raw = A, this.major = +K[1], this.minor = +K[2], this.patch = +K[3], this.major > nJ1 || this.major < 0) throw TypeError("Invalid major version");
            if (this.minor > nJ1 || this.minor < 0) throw TypeError("Invalid minor version");
            if (this.patch > nJ1 || this.patch < 0) throw TypeError("Invalid patch version");
            if (!K[4]) this.prerelease = [];
            else this.prerelease = K[4].split(".").map((Y) => {
                if (/^[0-9]+$/.test(Y)) {
                    let z = +Y;
                    if (z >= 0 && z < nJ1) return z
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
            if (iJ1("SemVer.compare", this.version, this.options, A), !(A instanceof sC)) {
                if (typeof A === "string" && A === this.version) return 0;
                A = new sC(A, this.options)
            }
            if (A.version === this.version) return 0;
            return this.compareMain(A) || this.comparePre(A)
        }
        compareMain(A) {
            if (!(A instanceof sC)) A = new sC(A, this.options);
            return QP6(this.major, A.major) || QP6(this.minor, A.minor) || QP6(this.patch, A.patch)
        }
        comparePre(A) {
            if (!(A instanceof sC)) A = new sC(A, this.options);
            if (this.prerelease.length && !A.prerelease.length) return -1;
            else if (!this.prerelease.length && A.prerelease.length) return 1;
            else if (!this.prerelease.length && !A.prerelease.length) return 0;
            let q = 0;
            do {
                let K = this.prerelease[q],
                    Y = A.prerelease[q];
                if (iJ1("prerelease compare", q, K, Y), K === void 0 && Y === void 0) return 0;
                else if (Y === void 0) return 1;
                else if (K === void 0) return -1;
                else if (K === Y) continue;
                else return QP6(K, Y)
            } while (++q)
        }
        compareBuild(A) {
            if (!(A instanceof sC)) A = new sC(A, this.options);
            let q = 0;
            do {
                let K = this.build[q],
                    Y = A.build[q];
                if (iJ1("build compare", q, K, Y), K === void 0 && Y === void 0) return 0;
                else if (Y === void 0) return 1;
                else if (K === void 0) return -1;
                else if (K === Y) continue;
                else return QP6(K, Y)
            } while (++q)
        }
        inc(A, q, K) {
            if (A.startsWith("pre")) {
                if (!q && K === !1) throw Error("invalid increment argument: identifier is empty");
                if (q) {
                    let Y = new RegExp(`^${this.options.loose?bd7[rJ1.PRERELEASELOOSE]:bd7[rJ1.PRERELEASE]}$`),
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
                        if (QP6(this.prerelease[0], q) === 0) {
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
    xd7.exports = sC
})
// @from(Ln 185341, Col 4)
u56 = x((ov2, md7) => {
    var ud7 = rW(),
        h_9 = (A, q, K = !1) => {
            if (A instanceof ud7) return A;
            try {
                return new ud7(A, q)
            } catch (Y) {
                if (!K) return null;
                throw Y
            }
        };
    md7.exports = h_9
})
// @from(Ln 185354, Col 4)
gd7 = x((av2, Bd7) => {
    var S_9 = u56(),
        C_9 = (A, q) => {
            let K = S_9(A, q);
            return K ? K.version : null
        };
    Bd7.exports = C_9
})
// @from(Ln 185362, Col 4)
pd7 = x((sv2, Fd7) => {
    var I_9 = u56(),
        b_9 = (A, q) => {
            let K = I_9(A.trim().replace(/^[=v]+/, ""), q);
            return K ? K.version : null
        };
    Fd7.exports = b_9
})
// @from(Ln 185370, Col 4)
dd7 = x((tv2, Ud7) => {
    var Qd7 = rW(),
        x_9 = (A, q, K, Y, z) => {
            if (typeof K === "string") z = Y, Y = K, K = void 0;
            try {
                return new Qd7(A instanceof Qd7 ? A.version : A, K).inc(q, Y, z).version
            } catch (_) {
                return null
            }
        };
    Ud7.exports = x_9
})
// @from(Ln 185382, Col 4)
id7 = x((ev2, ld7) => {
    var cd7 = u56(),
        u_9 = (A, q) => {
            let K = cd7(A, null, !0),
                Y = cd7(q, null, !0),
                z = K.compare(Y);
            if (z === 0) return null;
            let _ = z > 0,
                w = _ ? K : Y,
                O = _ ? Y : K,
                $ = !!w.prerelease.length;
            if (!!O.prerelease.length && !$) {
                if (!O.patch && !O.minor) return "major";
                if (O.compareMain(w) === 0) {
                    if (O.minor && !O.patch) return "minor";
                    return "patch"
                }
            }
            let j = $ ? "pre" : "";
            if (K.major !== Y.major) return j + "major";
            if (K.minor !== Y.minor) return j + "minor";
            if (K.patch !== Y.patch) return j + "patch";
            return "prerelease"
        };
    ld7.exports = u_9
})
// @from(Ln 185408, Col 4)
rd7 = x((AN2, nd7) => {
    var m_9 = rW(),
        B_9 = (A, q) => new m_9(A, q).major;
    nd7.exports = B_9
})
// @from(Ln 185413, Col 4)
ad7 = x((qN2, od7) => {
    var g_9 = rW(),
        F_9 = (A, q) => new g_9(A, q).minor;
    od7.exports = F_9
})
// @from(Ln 185418, Col 4)
td7 = x((KN2, sd7) => {
    var p_9 = rW(),
        Q_9 = (A, q) => new p_9(A, q).patch;
    sd7.exports = Q_9
})
// @from(Ln 185423, Col 4)
Ac7 = x((YN2, ed7) => {
    var U_9 = u56(),
        d_9 = (A, q) => {
            let K = U_9(A, q);
            return K && K.prerelease.length ? K.prerelease : null
        };
    ed7.exports = d_9
})
// @from(Ln 185431, Col 4)
nL = x((zN2, Kc7) => {
    var qc7 = rW(),
        c_9 = (A, q, K) => new qc7(A, K).compare(new qc7(q, K));
    Kc7.exports = c_9
})
// @from(Ln 185436, Col 4)
zc7 = x((_N2, Yc7) => {
    var l_9 = nL(),
        i_9 = (A, q, K) => l_9(q, A, K);
    Yc7.exports = i_9
})
// @from(Ln 185441, Col 4)
wc7 = x((wN2, _c7) => {
    var n_9 = nL(),
        r_9 = (A, q) => n_9(A, q, !0);
    _c7.exports = r_9
})
// @from(Ln 185446, Col 4)
oJ1 = x((ON2, $c7) => {
    var Oc7 = rW(),
        o_9 = (A, q, K) => {
            let Y = new Oc7(A, K),
                z = new Oc7(q, K);
            return Y.compare(z) || Y.compareBuild(z)
        };
    $c7.exports = o_9
})
// @from(Ln 185455, Col 4)
jc7 = x(($N2, Hc7) => {
    var a_9 = oJ1(),
        s_9 = (A, q) => A.sort((K, Y) => a_9(K, Y, q));
    Hc7.exports = s_9
})
// @from(Ln 185460, Col 4)
Mc7 = x((HN2, Jc7) => {
    var t_9 = oJ1(),
        e_9 = (A, q) => A.sort((K, Y) => t_9(Y, K, q));
    Jc7.exports = e_9
})
// @from(Ln 185465, Col 4)
Kg6 = x((jN2, Dc7) => {
    var A29 = nL(),
        q29 = (A, q, K) => A29(A, q, K) > 0;
    Dc7.exports = q29
})
// @from(Ln 185470, Col 4)
aJ1 = x((JN2, Xc7) => {
    var K29 = nL(),
        Y29 = (A, q, K) => K29(A, q, K) < 0;
    Xc7.exports = Y29
})
// @from(Ln 185475, Col 4)
F08 = x((MN2, Pc7) => {
    var z29 = nL(),
        _29 = (A, q, K) => z29(A, q, K) === 0;
    Pc7.exports = _29
})
// @from(Ln 185480, Col 4)
p08 = x((DN2, Wc7) => {
    var w29 = nL(),
        O29 = (A, q, K) => w29(A, q, K) !== 0;
    Wc7.exports = O29
})
// @from(Ln 185485, Col 4)
sJ1 = x((XN2, Zc7) => {
    var $29 = nL(),
        H29 = (A, q, K) => $29(A, q, K) >= 0;
    Zc7.exports = H29
})
// @from(Ln 185490, Col 4)
tJ1 = x((PN2, Gc7) => {
    var j29 = nL(),
        J29 = (A, q, K) => j29(A, q, K) <= 0;
    Gc7.exports = J29
})
// @from(Ln 185495, Col 4)
Q08 = x((WN2, fc7) => {
    var M29 = F08(),
        D29 = p08(),
        X29 = Kg6(),
        P29 = sJ1(),
        W29 = aJ1(),
        Z29 = tJ1(),
        G29 = (A, q, K, Y) => {
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
                    return M29(A, K, Y);
                case "!=":
                    return D29(A, K, Y);
                case ">":
                    return X29(A, K, Y);
                case ">=":
                    return P29(A, K, Y);
                case "<":
                    return W29(A, K, Y);
                case "<=":
                    return Z29(A, K, Y);
                default:
                    throw TypeError(`Invalid operator: ${q}`)
            }
        };
    fc7.exports = G29
})
// @from(Ln 185532, Col 4)
vc7 = x((ZN2, Tc7) => {
    var f29 = rW(),
        T29 = u56(),
        {
            safeRe: eJ1,
            t: AM1
        } = pP6(),
        v29 = (A, q) => {
            if (A instanceof f29) return A;
            if (typeof A === "number") A = String(A);
            if (typeof A !== "string") return null;
            q = q || {};
            let K = null;
            if (!q.rtl) K = A.match(q.includePrerelease ? eJ1[AM1.COERCEFULL] : eJ1[AM1.COERCE]);
            else {
                let $ = q.includePrerelease ? eJ1[AM1.COERCERTLFULL] : eJ1[AM1.COERCERTL],
                    H;
                while ((H = $.exec(A)) && (!K || K.index + K[0].length !== A.length)) {
                    if (!K || H.index + H[0].length !== K.index + K[0].length) K = H;
                    $.lastIndex = H.index + H[1].length + H[2].length
                }
                $.lastIndex = -1
            }
            if (K === null) return null;
            let Y = K[2],
                z = K[3] || "0",
                _ = K[4] || "0",
                w = q.includePrerelease && K[5] ? `-${K[5]}` : "",
                O = q.includePrerelease && K[6] ? `+${K[6]}` : "";
            return T29(`${Y}.${z}.${_}${w}${O}`, q)
        };
    Tc7.exports = v29
})
// @from(Ln 185565, Col 4)
kc7 = x((GN2, Vc7) => {
    class Nc7 {
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
    Vc7.exports = Nc7
})
// @from(Ln 185591, Col 4)
rL = x((fN2, Rc7) => {
    var N29 = /\s+/g;
    class Yg6 {
        constructor(A, q) {
            if (q = k29(q), A instanceof Yg6)
                if (A.loose === !!q.loose && A.includePrerelease === !!q.includePrerelease) return A;
                else return new Yg6(A.raw, q);
            if (A instanceof U08) return this.raw = A.value, this.set = [
                [A]
            ], this.formatted = void 0, this;
            if (this.options = q, this.loose = !!q.loose, this.includePrerelease = !!q.includePrerelease, this.raw = A.trim().replace(N29, " "), this.set = this.raw.split("||").map((K) => this.parseRange(K.trim())).filter((K) => K.length), !this.set.length) throw TypeError(`Invalid SemVer Range: ${this.raw}`);
            if (this.set.length > 1) {
                let K = this.set[0];
                if (this.set = this.set.filter((Y) => !yc7(Y[0])), this.set.length === 0) this.set = [K];
                else if (this.set.length > 1) {
                    for (let Y of this.set)
                        if (Y.length === 1 && C29(Y[0])) {
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
            let K = ((this.options.includePrerelease && h29) | (this.options.loose && S29)) + ":" + A,
                Y = Ec7.get(K);
            if (Y) return Y;
            let z = this.options.loose,
                _ = z ? Lv[qf.HYPHENRANGELOOSE] : Lv[qf.HYPHENRANGE];
            A = A.replace(_, Q29(this.options.includePrerelease)), TO("hyphen replace", A), A = A.replace(Lv[qf.COMPARATORTRIM], y29), TO("comparator trim", A), A = A.replace(Lv[qf.TILDETRIM], L29), TO("tilde trim", A), A = A.replace(Lv[qf.CARETTRIM], R29), TO("caret trim", A);
            let w = A.split(" ").map((j) => I29(j, this.options)).join(" ").split(/\s+/).map((j) => p29(j, this.options));
            if (z) w = w.filter((j) => {
                return TO("loose invalid filter", j, this.options), !!j.match(Lv[qf.COMPARATORLOOSE])
            });
            TO("range list", w);
            let O = new Map,
                $ = w.map((j) => new U08(j, this.options));
            for (let j of $) {
                if (yc7(j)) return [j];
                O.set(j.value, j)
            }
            if (O.size > 1 && O.has("")) O.delete("");
            let H = [...O.values()];
            return Ec7.set(K, H), H
        }
        intersects(A, q) {
            if (!(A instanceof Yg6)) throw TypeError("a Range is required");
            return this.set.some((K) => {
                return Lc7(K, q) && A.set.some((Y) => {
                    return Lc7(Y, q) && K.every((z) => {
                        return Y.every((_) => {
                            return z.intersects(_, q)
                        })
                    })
                })
            })
        }
        test(A) {
            if (!A) return !1;
            if (typeof A === "string") try {
                A = new E29(A, this.options)
            } catch (q) {
                return !1
            }
            for (let q = 0; q < this.set.length; q++)
                if (U29(this.set[q], A, this.options)) return !0;
            return !1
        }
    }
    Rc7.exports = Yg6;
    var V29 = kc7(),
        Ec7 = new V29,
        k29 = lJ1(),
        U08 = zg6(),
        TO = qg6(),
        E29 = rW(),
        {
            safeRe: Lv,
            t: qf,
            comparatorTrimReplace: y29,
            tildeTrimReplace: L29,
            caretTrimReplace: R29
        } = pP6(),
        {
            FLAG_INCLUDE_PRERELEASE: h29,
            FLAG_LOOSE: S29
        } = Ag6(),
        yc7 = (A) => A.value === "<0.0.0-0",
        C29 = (A) => A.value === "",
        Lc7 = (A, q) => {
            let K = !0,
                Y = A.slice(),
                z = Y.pop();
            while (K && Y.length) K = Y.every((_) => {
                return z.intersects(_, q)
            }), z = Y.pop();
            return K
        },
        I29 = (A, q) => {
            return TO("comp", A, q), A = u29(A, q), TO("caret", A), A = b29(A, q), TO("tildes", A), A = B29(A, q), TO("xrange", A), A = F29(A, q), TO("stars", A), A
        },
        Kf = (A) => !A || A.toLowerCase() === "x" || A === "*",
        b29 = (A, q) => {
            return A.trim().split(/\s+/).map((K) => x29(K, q)).join(" ")
        },
        x29 = (A, q) => {
            let K = q.loose ? Lv[qf.TILDELOOSE] : Lv[qf.TILDE];
            return A.replace(K, (Y, z, _, w, O) => {
                TO("tilde", A, Y, z, _, w, O);
                let $;
                if (Kf(z)) $ = "";
                else if (Kf(_)) $ = `>=${z}.0.0 <${+z+1}.0.0-0`;
                else if (Kf(w)) $ = `>=${z}.${_}.0 <${z}.${+_+1}.0-0`;
                else if (O) TO("replaceTilde pr", O), $ = `>=${z}.${_}.${w}-${O} <${z}.${+_+1}.0-0`;
                else $ = `>=${z}.${_}.${w} <${z}.${+_+1}.0-0`;
                return TO("tilde return", $), $
            })
        },
        u29 = (A, q) => {
            return A.trim().split(/\s+/).map((K) => m29(K, q)).join(" ")
        },
        m29 = (A, q) => {
            TO("caret", A, q);
            let K = q.loose ? Lv[qf.CARETLOOSE] : Lv[qf.CARET],
                Y = q.includePrerelease ? "-0" : "";
            return A.replace(K, (z, _, w, O, $) => {
                TO("caret", A, z, _, w, O, $);
                let H;
                if (Kf(_)) H = "";
                else if (Kf(w)) H = `>=${_}.0.0${Y} <${+_+1}.0.0-0`;
                else if (Kf(O))
                    if (_ === "0") H = `>=${_}.${w}.0${Y} <${_}.${+w+1}.0-0`;
                    else H = `>=${_}.${w}.0${Y} <${+_+1}.0.0-0`;
                else if ($)
                    if (TO("replaceCaret pr", $), _ === "0")
                        if (w === "0") H = `>=${_}.${w}.${O}-${$} <${_}.${w}.${+O+1}-0`;
                        else H = `>=${_}.${w}.${O}-${$} <${_}.${+w+1}.0-0`;
                else H = `>=${_}.${w}.${O}-${$} <${+_+1}.0.0-0`;
                else if (TO("no pr"), _ === "0")
                    if (w === "0") H = `>=${_}.${w}.${O}${Y} <${_}.${w}.${+O+1}-0`;
                    else H = `>=${_}.${w}.${O}${Y} <${_}.${+w+1}.0-0`;
                else H = `>=${_}.${w}.${O} <${+_+1}.0.0-0`;
                return TO("caret return", H), H
            })
        },
        B29 = (A, q) => {
            return TO("replaceXRanges", A, q), A.split(/\s+/).map((K) => g29(K, q)).join(" ")
        },
        g29 = (A, q) => {
            A = A.trim();
            let K = q.loose ? Lv[qf.XRANGELOOSE] : Lv[qf.XRANGE];
            return A.replace(K, (Y, z, _, w, O, $) => {
                TO("xRange", A, Y, z, _, w, O, $);
                let H = Kf(_),
                    j = H || Kf(w),
                    J = j || Kf(O),
                    M = J;
                if (z === "=" && M) z = "";
                if ($ = q.includePrerelease ? "-0" : "", H)
                    if (z === ">" || z === "<") Y = "<0.0.0-0";
                    else Y = "*";
                else if (z && M) {
                    if (j) w = 0;
                    if (O = 0, z === ">")
                        if (z = ">=", j) _ = +_ + 1, w = 0, O = 0;
                        else w = +w + 1, O = 0;
                    else if (z === "<=")
                        if (z = "<", j) _ = +_ + 1;
                        else w = +w + 1;
                    if (z === "<") $ = "-0";
                    Y = `${z+_}.${w}.${O}${$}`
                } else if (j) Y = `>=${_}.0.0${$} <${+_+1}.0.0-0`;
                else if (J) Y = `>=${_}.${w}.0${$} <${_}.${+w+1}.0-0`;
                return TO("xRange return", Y), Y
            })
        },
        F29 = (A, q) => {
            return TO("replaceStars", A, q), A.trim().replace(Lv[qf.STAR], "")
        },
        p29 = (A, q) => {
            return TO("replaceGTE0", A, q), A.trim().replace(Lv[q.includePrerelease ? qf.GTE0PRE : qf.GTE0], "")
        },
        Q29 = (A) => (q, K, Y, z, _, w, O, $, H, j, J, M) => {
            if (Kf(Y)) K = "";
            else if (Kf(z)) K = `>=${Y}.0.0${A?"-0":""}`;
            else if (Kf(_)) K = `>=${Y}.${z}.0${A?"-0":""}`;
            else if (w) K = `>=${K}`;
            else K = `>=${K}${A?"-0":""}`;
            if (Kf(H)) $ = "";
            else if (Kf(j)) $ = `<${+H+1}.0.0-0`;
            else if (Kf(J)) $ = `<${H}.${+j+1}.0-0`;
            else if (M) $ = `<=${H}.${j}.${J}-${M}`;
            else if (A) $ = `<${H}.${j}.${+J+1}-0`;
            else $ = `<=${$}`;
            return `${K} ${$}`.trim()
        },
        U29 = (A, q, K) => {
            for (let Y = 0; Y < A.length; Y++)
                if (!A[Y].test(q)) return !1;
            if (q.prerelease.length && !K.includePrerelease) {
                for (let Y = 0; Y < A.length; Y++) {
                    if (TO(A[Y].semver), A[Y].semver === U08.ANY) continue;
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
// @from(Ln 185824, Col 4)
zg6 = x((TN2, xc7) => {
    var _g6 = Symbol("SemVer ANY");
    class qM1 {
        static get ANY() {
            return _g6
        }
        constructor(A, q) {
            if (q = hc7(q), A instanceof qM1)
                if (A.loose === !!q.loose) return A;
                else A = A.value;
            if (A = A.trim().split(/\s+/).join(" "), c08("comparator", A, q), this.options = q, this.loose = !!q.loose, this.parse(A), this.semver === _g6) this.value = "";
            else this.value = this.operator + this.semver.version;
            c08("comp", this)
        }
        parse(A) {
            let q = this.options.loose ? Sc7[Cc7.COMPARATORLOOSE] : Sc7[Cc7.COMPARATOR],
                K = A.match(q);
            if (!K) throw TypeError(`Invalid comparator: ${A}`);
            if (this.operator = K[1] !== void 0 ? K[1] : "", this.operator === "=") this.operator = "";
            if (!K[2]) this.semver = _g6;
            else this.semver = new Ic7(K[2], this.options.loose)
        }
        toString() {
            return this.value
        }
        test(A) {
            if (c08("Comparator.test", A, this.options.loose), this.semver === _g6 || A === _g6) return !0;
            if (typeof A === "string") try {
                A = new Ic7(A, this.options)
            } catch (q) {
                return !1
            }
            return d08(A, this.operator, this.semver, this.options)
        }
        intersects(A, q) {
            if (!(A instanceof qM1)) throw TypeError("a Comparator is required");
            if (this.operator === "") {
                if (this.value === "") return !0;
                return new bc7(A.value, q).test(this.value)
            } else if (A.operator === "") {
                if (A.value === "") return !0;
                return new bc7(this.value, q).test(A.semver)
            }
            if (q = hc7(q), q.includePrerelease && (this.value === "<0.0.0-0" || A.value === "<0.0.0-0")) return !1;
            if (!q.includePrerelease && (this.value.startsWith("<0.0.0") || A.value.startsWith("<0.0.0"))) return !1;
            if (this.operator.startsWith(">") && A.operator.startsWith(">")) return !0;
            if (this.operator.startsWith("<") && A.operator.startsWith("<")) return !0;
            if (this.semver.version === A.semver.version && this.operator.includes("=") && A.operator.includes("=")) return !0;
            if (d08(this.semver, "<", A.semver, q) && this.operator.startsWith(">") && A.operator.startsWith("<")) return !0;
            if (d08(this.semver, ">", A.semver, q) && this.operator.startsWith("<") && A.operator.startsWith(">")) return !0;
            return !1
        }
    }
    xc7.exports = qM1;
    var hc7 = lJ1(),
        {
            safeRe: Sc7,
            t: Cc7
        } = pP6(),
        d08 = Q08(),
        c08 = qg6(),
        Ic7 = rW(),
        bc7 = rL()
})
// @from(Ln 185888, Col 4)
wg6 = x((vN2, uc7) => {
    var d29 = rL(),
        c29 = (A, q, K) => {
            try {
                q = new d29(q, K)
            } catch (Y) {
                return !1
            }
            return q.test(A)
        };
    uc7.exports = c29
})
// @from(Ln 185900, Col 4)
Bc7 = x((NN2, mc7) => {
    var l29 = rL(),
        i29 = (A, q) => new l29(A, q).set.map((K) => K.map((Y) => Y.value).join(" ").trim().split(" "));
    mc7.exports = i29
})
// @from(Ln 185905, Col 4)
Fc7 = x((VN2, gc7) => {
    var n29 = rW(),
        r29 = rL(),
        o29 = (A, q, K) => {
            let Y = null,
                z = null,
                _ = null;
            try {
                _ = new r29(q, K)
            } catch (w) {
                return null
            }
            return A.forEach((w) => {
                if (_.test(w)) {
                    if (!Y || z.compare(w) === -1) Y = w, z = new n29(Y, K)
                }
            }), Y
        };
    gc7.exports = o29
})
// @from(Ln 185925, Col 4)
Qc7 = x((kN2, pc7) => {
    var a29 = rW(),
        s29 = rL(),
        t29 = (A, q, K) => {
            let Y = null,
                z = null,
                _ = null;
            try {
                _ = new s29(q, K)
            } catch (w) {
                return null
            }
            return A.forEach((w) => {
                if (_.test(w)) {
                    if (!Y || z.compare(w) === 1) Y = w, z = new a29(Y, K)
                }
            }), Y
        };
    pc7.exports = t29
})
// @from(Ln 185945, Col 4)
cc7 = x((EN2, dc7) => {
    var l08 = rW(),
        e29 = rL(),
        Uc7 = Kg6(),
        Aw9 = (A, q) => {
            A = new e29(A, q);
            let K = new l08("0.0.0");
            if (A.test(K)) return K;
            if (K = new l08("0.0.0-0"), A.test(K)) return K;
            K = null;
            for (let Y = 0; Y < A.set.length; ++Y) {
                let z = A.set[Y],
                    _ = null;
                if (z.forEach((w) => {
                        let O = new l08(w.semver.version);
                        switch (w.operator) {
                            case ">":
                                if (O.prerelease.length === 0) O.patch++;
                                else O.prerelease.push(0);
                                O.raw = O.format();
                            case "":
                            case ">=":
                                if (!_ || Uc7(O, _)) _ = O;
                                break;
                            case "<":
                            case "<=":
                                break;
                            default:
                                throw Error(`Unexpected operation: ${w.operator}`)
                        }
                    }), _ && (!K || Uc7(K, _))) K = _
            }
            if (K && A.test(K)) return K;
            return null
        };
    dc7.exports = Aw9
})
// @from(Ln 185982, Col 4)
ic7 = x((yN2, lc7) => {
    var qw9 = rL(),
        Kw9 = (A, q) => {
            try {
                return new qw9(A, q).range || "*"
            } catch (K) {
                return null
            }
        };
    lc7.exports = Kw9
})
// @from(Ln 185993, Col 4)
KM1 = x((LN2, ac7) => {
    var Yw9 = rW(),
        oc7 = zg6(),
        {
            ANY: zw9
        } = oc7,
        _w9 = rL(),
        ww9 = wg6(),
        nc7 = Kg6(),
        rc7 = aJ1(),
        Ow9 = tJ1(),
        $w9 = sJ1(),
        Hw9 = (A, q, K, Y) => {
            A = new Yw9(A, Y), q = new _w9(q, Y);
            let z, _, w, O, $;
            switch (K) {
                case ">":
                    z = nc7, _ = Ow9, w = rc7, O = ">", $ = ">=";
                    break;
                case "<":
                    z = rc7, _ = $w9, w = nc7, O = "<", $ = "<=";
                    break;
                default:
                    throw TypeError('Must provide a hilo val of "<" or ">"')
            }
            if (ww9(A, q, Y)) return !1;
            for (let H = 0; H < q.set.length; ++H) {
                let j = q.set[H],
                    J = null,
                    M = null;
                if (j.forEach((D) => {
                        if (D.semver === zw9) D = new oc7(">=0.0.0");
                        if (J = J || D, M = M || D, z(D.semver, J.semver, Y)) J = D;
                        else if (w(D.semver, M.semver, Y)) M = D
                    }), J.operator === O || J.operator === $) return !1;
                if ((!M.operator || M.operator === O) && _(A, M.semver)) return !1;
                else if (M.operator === $ && w(A, M.semver)) return !1
            }
            return !0
        };
    ac7.exports = Hw9
})
// @from(Ln 186035, Col 4)
tc7 = x((RN2, sc7) => {
    var jw9 = KM1(),
        Jw9 = (A, q, K) => jw9(A, q, ">", K);
    sc7.exports = Jw9
})
// @from(Ln 186040, Col 4)
Al7 = x((hN2, ec7) => {
    var Mw9 = KM1(),
        Dw9 = (A, q, K) => Mw9(A, q, "<", K);
    ec7.exports = Dw9
})
// @from(Ln 186045, Col 4)
Yl7 = x((SN2, Kl7) => {
    var ql7 = rL(),
        Xw9 = (A, q, K) => {
            return A = new ql7(A, K), q = new ql7(q, K), A.intersects(q, K)
        };
    Kl7.exports = Xw9
})
// @from(Ln 186052, Col 4)
_l7 = x((CN2, zl7) => {
    var Pw9 = wg6(),
        Ww9 = nL();
    zl7.exports = (A, q, K) => {
        let Y = [],
            z = null,
            _ = null,
            w = A.sort((j, J) => Ww9(j, J, K));
        for (let j of w)
            if (Pw9(j, q, K)) {
                if (_ = j, !z) z = j
            } else {
                if (_) Y.push([z, _]);
                _ = null, z = null
            } if (z) Y.push([z, null]);
        let O = [];
        for (let [j, J] of Y)
            if (j === J) O.push(j);
            else if (!J && j === w[0]) O.push("*");
        else if (!J) O.push(`>=${j}`);
        else if (j === w[0]) O.push(`<=${J}`);
        else O.push(`${j} - ${J}`);
        let $ = O.join(" || "),
            H = typeof q.raw === "string" ? q.raw : String(q);
        return $.length < H.length ? $ : q
    }
})
// @from(Ln 186079, Col 4)
Jl7 = x((IN2, jl7) => {
    var wl7 = rL(),
        n08 = zg6(),
        {
            ANY: i08
        } = n08,
        Og6 = wg6(),
        r08 = nL(),
        Zw9 = (A, q, K = {}) => {
            if (A === q) return !0;
            A = new wl7(A, K), q = new wl7(q, K);
            let Y = !1;
            A: for (let z of A.set) {
                for (let _ of q.set) {
                    let w = fw9(z, _, K);
                    if (Y = Y || w !== null, w) continue A
                }
                if (Y) return !1
            }
            return !0
        },
        Gw9 = [new n08(">=0.0.0-0")],
        Ol7 = [new n08(">=0.0.0")],
        fw9 = (A, q, K) => {
            if (A === q) return !0;
            if (A.length === 1 && A[0].semver === i08)
                if (q.length === 1 && q[0].semver === i08) return !0;
                else if (K.includePrerelease) A = Gw9;
            else A = Ol7;
            if (q.length === 1 && q[0].semver === i08)
                if (K.includePrerelease) return !0;
                else q = Ol7;
            let Y = new Set,
                z, _;
            for (let D of A)
                if (D.operator === ">" || D.operator === ">=") z = $l7(z, D, K);
                else if (D.operator === "<" || D.operator === "<=") _ = Hl7(_, D, K);
            else Y.add(D.semver);
            if (Y.size > 1) return null;
            let w;
            if (z && _) {
                if (w = r08(z.semver, _.semver, K), w > 0) return null;
                else if (w === 0 && (z.operator !== ">=" || _.operator !== "<=")) return null
            }
            for (let D of Y) {
                if (z && !Og6(D, String(z), K)) return null;
                if (_ && !Og6(D, String(_), K)) return null;
                for (let X of q)
                    if (!Og6(D, String(X), K)) return !1;
                return !0
            }
            let O, $, H, j, J = _ && !K.includePrerelease && _.semver.prerelease.length ? _.semver : !1,
                M = z && !K.includePrerelease && z.semver.prerelease.length ? z.semver : !1;
            if (J && J.prerelease.length === 1 && _.operator === "<" && J.prerelease[0] === 0) J = !1;
            for (let D of q) {
                if (j = j || D.operator === ">" || D.operator === ">=", H = H || D.operator === "<" || D.operator === "<=", z) {
                    if (M) {
                        if (D.semver.prerelease && D.semver.prerelease.length && D.semver.major === M.major && D.semver.minor === M.minor && D.semver.patch === M.patch) M = !1
                    }
                    if (D.operator === ">" || D.operator === ">=") {
                        if (O = $l7(z, D, K), O === D && O !== z) return !1
                    } else if (z.operator === ">=" && !Og6(z.semver, String(D), K)) return !1
                }
                if (_) {
                    if (J) {
                        if (D.semver.prerelease && D.semver.prerelease.length && D.semver.major === J.major && D.semver.minor === J.minor && D.semver.patch === J.patch) J = !1
                    }
                    if (D.operator === "<" || D.operator === "<=") {
                        if ($ = Hl7(_, D, K), $ === D && $ !== _) return !1
                    } else if (_.operator === "<=" && !Og6(_.semver, String(D), K)) return !1
                }
                if (!D.operator && (_ || z) && w !== 0) return !1
            }
            if (z && H && !_ && w !== 0) return !1;
            if (_ && j && !z && w !== 0) return !1;
            if (M || J) return !1;
            return !0
        },
        $l7 = (A, q, K) => {
            if (!A) return q;
            let Y = r08(A.semver, q.semver, K);
            return Y > 0 ? A : Y < 0 ? q : q.operator === ">" && A.operator === ">=" ? q : A
        },
        Hl7 = (A, q, K) => {
            if (!A) return q;
            let Y = r08(A.semver, q.semver, K);
            return Y < 0 ? A : Y > 0 ? q : q.operator === "<" && A.operator === "<=" ? q : A
        };
    jl7.exports = Zw9
})
// @from(Ln 186169, Col 4)
YM1 = x((bN2, Xl7) => {
    var o08 = pP6(),
        Ml7 = Ag6(),
        Tw9 = rW(),
        Dl7 = g08(),
        vw9 = u56(),
        Nw9 = gd7(),
        Vw9 = pd7(),
        kw9 = dd7(),
        Ew9 = id7(),
        yw9 = rd7(),
        Lw9 = ad7(),
        Rw9 = td7(),
        hw9 = Ac7(),
        Sw9 = nL(),
        Cw9 = zc7(),
        Iw9 = wc7(),
        bw9 = oJ1(),
        xw9 = jc7(),
        uw9 = Mc7(),
        mw9 = Kg6(),
        Bw9 = aJ1(),
        gw9 = F08(),
        Fw9 = p08(),
        pw9 = sJ1(),
        Qw9 = tJ1(),
        Uw9 = Q08(),
        dw9 = vc7(),
        cw9 = zg6(),
        lw9 = rL(),
        iw9 = wg6(),
        nw9 = Bc7(),
        rw9 = Fc7(),
        ow9 = Qc7(),
        aw9 = cc7(),
        sw9 = ic7(),
        tw9 = KM1(),
        ew9 = tc7(),
        AO9 = Al7(),
        qO9 = Yl7(),
        KO9 = _l7(),
        YO9 = Jl7();
    Xl7.exports = {
        parse: vw9,
        valid: Nw9,
        clean: Vw9,
        inc: kw9,
        diff: Ew9,
        major: yw9,
        minor: Lw9,
        patch: Rw9,
        prerelease: hw9,
        compare: Sw9,
        rcompare: Cw9,
        compareLoose: Iw9,
        compareBuild: bw9,
        sort: xw9,
        rsort: uw9,
        gt: mw9,
        lt: Bw9,
        eq: gw9,
        neq: Fw9,
        gte: pw9,
        lte: Qw9,
        cmp: Uw9,
        coerce: dw9,
        Comparator: cw9,
        Range: lw9,
        satisfies: iw9,
        toComparators: nw9,
        maxSatisfying: rw9,
        minSatisfying: ow9,
        minVersion: aw9,
        validRange: sw9,
        outside: tw9,
        gtr: ew9,
        ltr: AO9,
        intersects: qO9,
        simplifyRange: KO9,
        subset: YO9,
        SemVer: Tw9,
        re: o08.re,
        src: o08.src,
        tokens: o08.t,
        SEMVER_SPEC_VERSION: Ml7.SEMVER_SPEC_VERSION,
        RELEASE_TYPES: Ml7.RELEASE_TYPES,
        compareIdentifiers: Dl7.compareIdentifiers,
        rcompareIdentifiers: Dl7.rcompareIdentifiers
    }
})
// @from(Ln 186259, Col 4)
Wl7 = x((xN2, Pl7) => {
    var zO9 = YM1();
    Pl7.exports = zO9.satisfies(process.version, ">=15.7.0")
})
// @from(Ln 186263, Col 4)
Gl7 = x((uN2, Zl7) => {
    var _O9 = YM1();
    Zl7.exports = _O9.satisfies(process.version, ">=16.9.0")
})
// @from(Ln 186267, Col 4)
a08 = x((mN2, fl7) => {
    var wO9 = Wl7(),
        OO9 = Gl7(),
        $O9 = {
            ec: ["ES256", "ES384", "ES512"],
            rsa: ["RS256", "PS256", "RS384", "PS384", "RS512", "PS512"],
            "rsa-pss": ["PS256", "PS384", "PS512"]
        },
        HO9 = {
            ES256: "prime256v1",
            ES384: "secp384r1",
            ES512: "secp521r1"
        };
    fl7.exports = function(A, q) {
        if (!A || !q) return;
        let K = q.asymmetricKeyType;
        if (!K) return;
        let Y = $O9[K];
        if (!Y) throw Error(`Unknown key type "${K}".`);
        if (!Y.includes(A)) throw Error(`"alg" parameter for "${K}" key type must be one of: ${Y.join(", ")}.`);
        if (wO9) switch (K) {
            case "ec":
                let z = q.asymmetricKeyDetails.namedCurve,
                    _ = HO9[A];
                if (z !== _) throw Error(`"alg" parameter "${A}" requires curve "${_}".`);
                break;
            case "rsa-pss":
                if (OO9) {
                    let w = parseInt(A.slice(-3), 10),
                        {
                            hashAlgorithm: O,
                            mgf1HashAlgorithm: $,
                            saltLength: H
                        } = q.asymmetricKeyDetails;
                    if (O !== `sha${w}` || $ !== O) throw Error(`Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${A}.`);
                    if (H !== void 0 && H > w >> 3) throw Error(`Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${A}.`)
                }
                break
        }
    }
})
// @from(Ln 186308, Col 4)
s08 = x((BN2, Tl7) => {
    var jO9 = YM1();
    Tl7.exports = jO9.satisfies(process.version, "^6.12.0 || >=8.0.0")
})
// @from(Ln 186312, Col 4)
Vl7 = x((gN2, Nl7) => {
    var xw = eB6(),
        JO9 = b08(),
        vl7 = x08(),
        MO9 = I08(),
        DO9 = u08(),
        XO9 = a08(),
        PO9 = s08(),
        WO9 = QJ1(),
        {
            KeyObject: ZO9,
            createSecretKey: GO9,
            createPublicKey: fO9
        } = x6("crypto"),
        t08 = ["RS256", "RS384", "RS512"],
        TO9 = ["ES256", "ES384", "ES512"],
        e08 = ["RS256", "RS384", "RS512"],
        vO9 = ["HS256", "HS384", "HS512"];
    if (PO9) t08.splice(t08.length, 0, "PS256", "PS384", "PS512"), e08.splice(e08.length, 0, "PS256", "PS384", "PS512");
    Nl7.exports = function(A, q, K, Y) {
        if (typeof K === "function" && !Y) Y = K, K = {};
        if (!K) K = {};
        K = Object.assign({}, K);
        let z;
        if (Y) z = Y;
        else z = function(j, J) {
            if (j) throw j;
            return J
        };
        if (K.clockTimestamp && typeof K.clockTimestamp !== "number") return z(new xw("clockTimestamp must be a number"));
        if (K.nonce !== void 0 && (typeof K.nonce !== "string" || K.nonce.trim() === "")) return z(new xw("nonce must be a non-empty string"));
        if (K.allowInvalidAsymmetricKeyTypes !== void 0 && typeof K.allowInvalidAsymmetricKeyTypes !== "boolean") return z(new xw("allowInvalidAsymmetricKeyTypes must be a boolean"));
        let _ = K.clockTimestamp || Math.floor(Date.now() / 1000);
        if (!A) return z(new xw("jwt must be provided"));
        if (typeof A !== "string") return z(new xw("jwt must be a string"));
        let w = A.split(".");
        if (w.length !== 3) return z(new xw("jwt malformed"));
        let O;
        try {
            O = MO9(A, {
                complete: !0
            })
        } catch (j) {
            return z(j)
        }
        if (!O) return z(new xw("invalid token"));
        let $ = O.header,
            H;
        if (typeof q === "function") {
            if (!Y) return z(new xw("verify must be called asynchronous if secret or public key is provided as a callback"));
            H = q
        } else H = function(j, J) {
            return J(null, q)
        };
        return H($, function(j, J) {
            if (j) return z(new xw("error in secret or public key callback: " + j.message));
            let M = w[2].trim() !== "";
            if (!M && J) return z(new xw("jwt signature is required"));
            if (M && !J) return z(new xw("secret or public key must be provided"));
            if (!M && !K.algorithms) return z(new xw('please specify "none" in "algorithms" to verify unsigned tokens'));
            if (J != null && !(J instanceof ZO9)) try {
                J = fO9(J)
            } catch (P) {
                try {
                    J = GO9(typeof J === "string" ? Buffer.from(J) : J)
                } catch (W) {
                    return z(new xw("secretOrPublicKey is not valid key material"))
                }
            }
            if (!K.algorithms)
                if (J.type === "secret") K.algorithms = vO9;
                else if (["rsa", "rsa-pss"].includes(J.asymmetricKeyType)) K.algorithms = e08;
            else if (J.asymmetricKeyType === "ec") K.algorithms = TO9;
            else K.algorithms = t08;
            if (K.algorithms.indexOf(O.header.alg) === -1) return z(new xw("invalid algorithm"));
            if ($.alg.startsWith("HS") && J.type !== "secret") return z(new xw(`secretOrPublicKey must be a symmetric key when using ${$.alg}`));
            else if (/^(?:RS|PS|ES)/.test($.alg) && J.type !== "public") return z(new xw(`secretOrPublicKey must be an asymmetric key when using ${$.alg}`));
            if (!K.allowInvalidAsymmetricKeyTypes) try {
                XO9($.alg, J)
            } catch (P) {
                return z(P)
            }
            let D;
            try {
                D = WO9.verify(A, O.header.alg, J)
            } catch (P) {
                return z(P)
            }
            if (!D) return z(new xw("invalid signature"));
            let X = O.payload;
            if (typeof X.nbf < "u" && !K.ignoreNotBefore) {
                if (typeof X.nbf !== "number") return z(new xw("invalid nbf value"));
                if (X.nbf > _ + (K.clockTolerance || 0)) return z(new JO9("jwt not active", new Date(X.nbf * 1000)))
            }
            if (typeof X.exp < "u" && !K.ignoreExpiration) {
                if (typeof X.exp !== "number") return z(new xw("invalid exp value"));
                if (_ >= X.exp + (K.clockTolerance || 0)) return z(new vl7("jwt expired", new Date(X.exp * 1000)))
            }
            if (K.audience) {
                let P = Array.isArray(K.audience) ? K.audience : [K.audience];
                if (!(Array.isArray(X.aud) ? X.aud : [X.aud]).some(function(G) {
                        return P.some(function(f) {
                            return f instanceof RegExp ? f.test(G) : f === G
                        })
                    })) return z(new xw("jwt audience invalid. expected: " + P.join(" or ")))
            }
            if (K.issuer) {
                if (typeof K.issuer === "string" && X.iss !== K.issuer || Array.isArray(K.issuer) && K.issuer.indexOf(X.iss) === -1) return z(new xw("jwt issuer invalid. expected: " + K.issuer))
            }
            if (K.subject) {
                if (X.sub !== K.subject) return z(new xw("jwt subject invalid. expected: " + K.subject))
            }
            if (K.jwtid) {
                if (X.jti !== K.jwtid) return z(new xw("jwt jwtid invalid. expected: " + K.jwtid))
            }
            if (K.nonce) {
                if (X.nonce !== K.nonce) return z(new xw("jwt nonce invalid. expected: " + K.nonce))
            }
            if (K.maxAge) {
                if (typeof X.iat !== "number") return z(new xw("iat required when maxAge is specified"));
                let P = DO9(K.maxAge, X.iat);
                if (typeof P > "u") return z(new xw('"maxAge" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
                if (_ >= P + (K.clockTolerance || 0)) return z(new vl7("maxAge exceeded", new Date(P * 1000)))
            }
            if (K.complete === !0) {
                let P = O.signature;
                return z(null, {
                    header: $,
                    payload: X,
                    signature: P
                })
            }
            return z(null, X)
        })
    }
})
// @from(Ln 186448, Col 4)
hl7 = x((FN2, Rl7) => {
    var kl7 = 1 / 0,
        yl7 = 9007199254740991,
        NO9 = 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        El7 = NaN,
        VO9 = "[object Arguments]",
        kO9 = "[object Function]",
        EO9 = "[object GeneratorFunction]",
        yO9 = "[object String]",
        LO9 = "[object Symbol]",
        RO9 = /^\s+|\s+$/g,
        hO9 = /^[-+]0x[0-9a-f]+$/i,
        SO9 = /^0b[01]+$/i,
        CO9 = /^0o[0-7]+$/i,
        IO9 = /^(?:0|[1-9]\d*)$/,
        bO9 = parseInt;

    function xO9(A, q) {
        var K = -1,
            Y = A ? A.length : 0,
            z = Array(Y);
        while (++K < Y) z[K] = q(A[K], K, A);
        return z
    }

    function uO9(A, q, K, Y) {
        var z = A.length,
            _ = K + (Y ? 1 : -1);
        while (Y ? _-- : ++_ < z)
            if (q(A[_], _, A)) return _;
        return -1
    }

    function mO9(A, q, K) {
        if (q !== q) return uO9(A, BO9, K);
        var Y = K - 1,
            z = A.length;
        while (++Y < z)
            if (A[Y] === q) return Y;
        return -1
    }

    function BO9(A) {
        return A !== A
    }

    function gO9(A, q) {
        var K = -1,
            Y = Array(A);
        while (++K < A) Y[K] = q(K);
        return Y
    }

    function FO9(A, q) {
        return xO9(q, function(K) {
            return A[K]
        })
    }

    function pO9(A, q) {
        return function(K) {
            return A(q(K))
        }
    }
    var zM1 = Object.prototype,
        qW8 = zM1.hasOwnProperty,
        _M1 = zM1.toString,
        QO9 = zM1.propertyIsEnumerable,
        UO9 = pO9(Object.keys, Object),
        dO9 = Math.max;

    function cO9(A, q) {
        var K = Ll7(A) || oO9(A) ? gO9(A.length, String) : [],
            Y = K.length,
            z = !!Y;
        for (var _ in A)
            if ((q || qW8.call(A, _)) && !(z && (_ == "length" || iO9(_, Y)))) K.push(_);
        return K
    }

    function lO9(A) {
        if (!nO9(A)) return UO9(A);
        var q = [];
        for (var K in Object(A))
            if (qW8.call(A, K) && K != "constructor") q.push(K);
        return q
    }

    function iO9(A, q) {
        return q = q == null ? yl7 : q, !!q && (typeof A == "number" || IO9.test(A)) && (A > -1 && A % 1 == 0 && A < q)
    }

    function nO9(A) {
        var q = A && A.constructor,
            K = typeof q == "function" && q.prototype || zM1;
        return A === K
    }

    function rO9(A, q, K, Y) {
        A = KW8(A) ? A : _$9(A), K = K && !Y ? K$9(K) : 0;
        var z = A.length;
        if (K < 0) K = dO9(z + K, 0);
        return eO9(A) ? K <= z && A.indexOf(q, K) > -1 : !!z && mO9(A, q, K) > -1
    }

    function oO9(A) {
        return aO9(A) && qW8.call(A, "callee") && (!QO9.call(A, "callee") || _M1.call(A) == VO9)
    }
    var Ll7 = Array.isArray;

    function KW8(A) {
        return A != null && tO9(A.length) && !sO9(A)
    }

    function aO9(A) {
        return YW8(A) && KW8(A)
    }

    function sO9(A) {
        var q = AW8(A) ? _M1.call(A) : "";
        return q == kO9 || q == EO9
    }

    function tO9(A) {
        return typeof A == "number" && A > -1 && A % 1 == 0 && A <= yl7
    }

    function AW8(A) {
        var q = typeof A;
        return !!A && (q == "object" || q == "function")
    }

    function YW8(A) {
        return !!A && typeof A == "object"
    }

    function eO9(A) {
        return typeof A == "string" || !Ll7(A) && YW8(A) && _M1.call(A) == yO9
    }

    function A$9(A) {
        return typeof A == "symbol" || YW8(A) && _M1.call(A) == LO9
    }

    function q$9(A) {
        if (!A) return A === 0 ? A : 0;
        if (A = Y$9(A), A === kl7 || A === -kl7) {
            var q = A < 0 ? -1 : 1;
            return q * NO9
        }
        return A === A ? A : 0
    }

    function K$9(A) {
        var q = q$9(A),
            K = q % 1;
        return q === q ? K ? q - K : q : 0
    }

    function Y$9(A) {
        if (typeof A == "number") return A;
        if (A$9(A)) return El7;
        if (AW8(A)) {
            var q = typeof A.valueOf == "function" ? A.valueOf() : A;
            A = AW8(q) ? q + "" : q
        }
        if (typeof A != "string") return A === 0 ? A : +A;
        A = A.replace(RO9, "");
        var K = SO9.test(A);
        return K || CO9.test(A) ? bO9(A.slice(2), K ? 2 : 8) : hO9.test(A) ? El7 : +A
    }

    function z$9(A) {
        return KW8(A) ? cO9(A) : lO9(A)
    }

    function _$9(A) {
        return A ? FO9(A, z$9(A)) : []
    }
    Rl7.exports = rO9
})
// @from(Ln 186629, Col 4)
Cl7 = x((pN2, Sl7) => {
    var w$9 = "[object Boolean]",
        O$9 = Object.prototype,
        $$9 = O$9.toString;

    function H$9(A) {
        return A === !0 || A === !1 || j$9(A) && $$9.call(A) == w$9
    }

    function j$9(A) {
        return !!A && typeof A == "object"
    }
    Sl7.exports = H$9
})
// @from(Ln 186643, Col 4)
ml7 = x((QN2, ul7) => {
    var Il7 = 1 / 0,
        J$9 = 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        bl7 = NaN,
        M$9 = "[object Symbol]",
        D$9 = /^\s+|\s+$/g,
        X$9 = /^[-+]0x[0-9a-f]+$/i,
        P$9 = /^0b[01]+$/i,
        W$9 = /^0o[0-7]+$/i,
        Z$9 = parseInt,
        G$9 = Object.prototype,
        f$9 = G$9.toString;

    function T$9(A) {
        return typeof A == "number" && A == k$9(A)
    }

    function xl7(A) {
        var q = typeof A;
        return !!A && (q == "object" || q == "function")
    }

    function v$9(A) {
        return !!A && typeof A == "object"
    }

    function N$9(A) {
        return typeof A == "symbol" || v$9(A) && f$9.call(A) == M$9
    }

    function V$9(A) {
        if (!A) return A === 0 ? A : 0;
        if (A = E$9(A), A === Il7 || A === -Il7) {
            var q = A < 0 ? -1 : 1;
            return q * J$9
        }
        return A === A ? A : 0
    }

    function k$9(A) {
        var q = V$9(A),
            K = q % 1;
        return q === q ? K ? q - K : q : 0
    }

    function E$9(A) {
        if (typeof A == "number") return A;
        if (N$9(A)) return bl7;
        if (xl7(A)) {
            var q = typeof A.valueOf == "function" ? A.valueOf() : A;
            A = xl7(q) ? q + "" : q
        }
        if (typeof A != "string") return A === 0 ? A : +A;
        A = A.replace(D$9, "");
        var K = P$9.test(A);
        return K || W$9.test(A) ? Z$9(A.slice(2), K ? 2 : 8) : X$9.test(A) ? bl7 : +A
    }
    ul7.exports = T$9
})
// @from(Ln 186702, Col 4)
gl7 = x((UN2, Bl7) => {
    var y$9 = "[object Number]",
        L$9 = Object.prototype,
        R$9 = L$9.toString;

    function h$9(A) {
        return !!A && typeof A == "object"
    }

    function S$9(A) {
        return typeof A == "number" || h$9(A) && R$9.call(A) == y$9
    }
    Bl7.exports = S$9
})
// @from(Ln 186716, Col 4)
Ul7 = x((dN2, Ql7) => {
    var C$9 = "[object Object]";

    function I$9(A) {
        var q = !1;
        if (A != null && typeof A.toString != "function") try {
            q = !!(A + "")
        } catch (K) {}
        return q
    }

    function b$9(A, q) {
        return function(K) {
            return A(q(K))
        }
    }
    var x$9 = Function.prototype,
        Fl7 = Object.prototype,
        pl7 = x$9.toString,
        u$9 = Fl7.hasOwnProperty,
        m$9 = pl7.call(Object),
        B$9 = Fl7.toString,
        g$9 = b$9(Object.getPrototypeOf, Object);

    function F$9(A) {
        return !!A && typeof A == "object"
    }

    function p$9(A) {
        if (!F$9(A) || B$9.call(A) != C$9 || I$9(A)) return !1;
        var q = g$9(A);
        if (q === null) return !0;
        var K = u$9.call(q, "constructor") && q.constructor;
        return typeof K == "function" && K instanceof K && pl7.call(K) == m$9
    }
    Ql7.exports = p$9
})
// @from(Ln 186753, Col 4)
cl7 = x((cN2, dl7) => {
    var Q$9 = "[object String]",
        U$9 = Object.prototype,
        d$9 = U$9.toString,
        c$9 = Array.isArray;

    function l$9(A) {
        return !!A && typeof A == "object"
    }

    function i$9(A) {
        return typeof A == "string" || !c$9(A) && l$9(A) && d$9.call(A) == Q$9
    }
    dl7.exports = i$9
})
// @from(Ln 186768, Col 4)
ol7 = x((lN2, rl7) => {
    var n$9 = "Expected a function",
        ll7 = 1 / 0,
        r$9 = 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        il7 = NaN,
        o$9 = "[object Symbol]",
        a$9 = /^\s+|\s+$/g,
        s$9 = /^[-+]0x[0-9a-f]+$/i,
        t$9 = /^0b[01]+$/i,
        e$9 = /^0o[0-7]+$/i,
        AH9 = parseInt,
        qH9 = Object.prototype,
        KH9 = qH9.toString;

    function YH9(A, q) {
        var K;
        if (typeof q != "function") throw TypeError(n$9);
        return A = $H9(A),
            function() {
                if (--A > 0) K = q.apply(this, arguments);
                if (A <= 1) q = void 0;
                return K
            }
    }

    function zH9(A) {
        return YH9(2, A)
    }

    function nl7(A) {
        var q = typeof A;
        return !!A && (q == "object" || q == "function")
    }

    function _H9(A) {
        return !!A && typeof A == "object"
    }

    function wH9(A) {
        return typeof A == "symbol" || _H9(A) && KH9.call(A) == o$9
    }

    function OH9(A) {
        if (!A) return A === 0 ? A : 0;
        if (A = HH9(A), A === ll7 || A === -ll7) {
            var q = A < 0 ? -1 : 1;
            return q * r$9
        }
        return A === A ? A : 0
    }

    function $H9(A) {
        var q = OH9(A),
            K = q % 1;
        return q === q ? K ? q - K : q : 0
    }

    function HH9(A) {
        if (typeof A == "number") return A;
        if (wH9(A)) return il7;
        if (nl7(A)) {
            var q = typeof A.valueOf == "function" ? A.valueOf() : A;
            A = nl7(q) ? q + "" : q
        }
        if (typeof A != "string") return A === 0 ? A : +A;
        A = A.replace(a$9, "");
        var K = t$9.test(A);
        return K || e$9.test(A) ? AH9(A.slice(2), K ? 2 : 8) : s$9.test(A) ? il7 : +A
    }
    rl7.exports = zH9
})
// @from(Ln 186839, Col 4)
zi7 = x((iN2, Yi7) => {
    var al7 = u08(),
        jH9 = s08(),
        JH9 = a08(),
        sl7 = QJ1(),
        MH9 = hl7(),
        wM1 = Cl7(),
        tl7 = ml7(),
        zW8 = gl7(),
        Ai7 = Ul7(),
        ns = cl7(),
        DH9 = ol7(),
        {
            KeyObject: XH9,
            createSecretKey: PH9,
            createPrivateKey: WH9
        } = x6("crypto"),
        qi7 = ["RS256", "RS384", "RS512", "ES256", "ES384", "ES512", "HS256", "HS384", "HS512", "none"];
    if (jH9) qi7.splice(3, 0, "PS256", "PS384", "PS512");
    var ZH9 = {
            expiresIn: {
                isValid: function(A) {
                    return tl7(A) || ns(A) && A
                },
                message: '"expiresIn" should be a number of seconds or string representing a timespan'
            },
            notBefore: {
                isValid: function(A) {
                    return tl7(A) || ns(A) && A
                },
                message: '"notBefore" should be a number of seconds or string representing a timespan'
            },
            audience: {
                isValid: function(A) {
                    return ns(A) || Array.isArray(A)
                },
                message: '"audience" must be a string or array'
            },
            algorithm: {
                isValid: MH9.bind(null, qi7),
                message: '"algorithm" must be a valid string enum value'
            },
            header: {
                isValid: Ai7,
                message: '"header" must be an object'
            },
            encoding: {
                isValid: ns,
                message: '"encoding" must be a string'
            },
            issuer: {
                isValid: ns,
                message: '"issuer" must be a string'
            },
            subject: {
                isValid: ns,
                message: '"subject" must be a string'
            },
            jwtid: {
                isValid: ns,
                message: '"jwtid" must be a string'
            },
            noTimestamp: {
                isValid: wM1,
                message: '"noTimestamp" must be a boolean'
            },
            keyid: {
                isValid: ns,
                message: '"keyid" must be a string'
            },
            mutatePayload: {
                isValid: wM1,
                message: '"mutatePayload" must be a boolean'
            },
            allowInsecureKeySizes: {
                isValid: wM1,
                message: '"allowInsecureKeySizes" must be a boolean'
            },
            allowInvalidAsymmetricKeyTypes: {
                isValid: wM1,
                message: '"allowInvalidAsymmetricKeyTypes" must be a boolean'
            }
        },
        GH9 = {
            iat: {
                isValid: zW8,
                message: '"iat" should be a number of seconds'
            },
            exp: {
                isValid: zW8,
                message: '"exp" should be a number of seconds'
            },
            nbf: {
                isValid: zW8,
                message: '"nbf" should be a number of seconds'
            }
        };

    function Ki7(A, q, K, Y) {
        if (!Ai7(K)) throw Error('Expected "' + Y + '" to be a plain object.');
        Object.keys(K).forEach(function(z) {
            let _ = A[z];
            if (!_) {
                if (!q) throw Error('"' + z + '" is not allowed in "' + Y + '"');
                return
            }
            if (!_.isValid(K[z])) throw Error(_.message)
        })
    }

    function fH9(A) {
        return Ki7(ZH9, !1, A, "options")
    }

    function TH9(A) {
        return Ki7(GH9, !0, A, "payload")
    }
    var el7 = {
            audience: "aud",
            issuer: "iss",
            subject: "sub",
            jwtid: "jti"
        },
        vH9 = ["expiresIn", "notBefore", "noTimestamp", "audience", "issuer", "subject", "jwtid"];
    Yi7.exports = function(A, q, K, Y) {
        if (typeof K === "function") Y = K, K = {};
        else K = K || {};
        let z = typeof A === "object" && !Buffer.isBuffer(A),
            _ = Object.assign({
                alg: K.algorithm || "HS256",
                typ: z ? "JWT" : void 0,
                kid: K.keyid
            }, K.header);

        function w(H) {
            if (Y) return Y(H);
            throw H
        }
        if (!q && K.algorithm !== "none") return w(Error("secretOrPrivateKey must have a value"));
        if (q != null && !(q instanceof XH9)) try {
            q = WH9(q)
        } catch (H) {
            try {
                q = PH9(typeof q === "string" ? Buffer.from(q) : q)
            } catch (j) {
                return w(Error("secretOrPrivateKey is not valid key material"))
            }
        }
        if (_.alg.startsWith("HS") && q.type !== "secret") return w(Error(`secretOrPrivateKey must be a symmetric key when using ${_.alg}`));
        else if (/^(?:RS|PS|ES)/.test(_.alg)) {
            if (q.type !== "private") return w(Error(`secretOrPrivateKey must be an asymmetric key when using ${_.alg}`));
            if (!K.allowInsecureKeySizes && !_.alg.startsWith("ES") && q.asymmetricKeyDetails !== void 0 && q.asymmetricKeyDetails.modulusLength < 2048) return w(Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${_.alg}`))
        }
        if (typeof A > "u") return w(Error("payload is required"));
        else if (z) {
            try {
                TH9(A)
            } catch (H) {
                return w(H)
            }
            if (!K.mutatePayload) A = Object.assign({}, A)
        } else {
            let H = vH9.filter(function(j) {
                return typeof K[j] < "u"
            });
            if (H.length > 0) return w(Error("invalid " + H.join(",") + " option for " + typeof A + " payload"))
        }
        if (typeof A.exp < "u" && typeof K.expiresIn < "u") return w(Error('Bad "options.expiresIn" option the payload already has an "exp" property.'));
        if (typeof A.nbf < "u" && typeof K.notBefore < "u") return w(Error('Bad "options.notBefore" option the payload already has an "nbf" property.'));
        try {
            fH9(K)
        } catch (H) {
            return w(H)
        }
        if (!K.allowInvalidAsymmetricKeyTypes) try {
            JH9(_.alg, q)
        } catch (H) {
            return w(H)
        }
        let O = A.iat || Math.floor(Date.now() / 1000);
        if (K.noTimestamp) delete A.iat;
        else if (z) A.iat = O;
        if (typeof K.notBefore < "u") {
            try {
                A.nbf = al7(K.notBefore, O)
            } catch (H) {
                return w(H)
            }
            if (typeof A.nbf > "u") return w(Error('"notBefore" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'))
        }
        if (typeof K.expiresIn < "u" && typeof A === "object") {
            try {
                A.exp = al7(K.expiresIn, O)
            } catch (H) {
                return w(H)
            }
            if (typeof A.exp > "u") return w(Error('"expiresIn" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'))
        }
        Object.keys(el7).forEach(function(H) {
            let j = el7[H];
            if (typeof K[H] < "u") {
                if (typeof A[j] < "u") return w(Error('Bad "options.' + H + '" option. The payload already has an "' + j + '" property.'));
                A[j] = K[H]
            }
        });
        let $ = K.encoding || "utf8";
        if (typeof Y === "function") Y = Y && DH9(Y), sl7.createSign({
            header: _,
            privateKey: q,
            payload: A,
            encoding: $
        }).once("error", Y).once("done", function(H) {
            if (!K.allowInsecureKeySizes && /^(?:RS|PS)/.test(_.alg) && H.length < 256) return Y(Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${_.alg}`));
            Y(null, H)
        });
        else {
            let H = sl7.sign({
                header: _,
                payload: A,
                secret: q,
                encoding: $
            });
            if (!K.allowInsecureKeySizes && /^(?:RS|PS)/.test(_.alg) && H.length < 256) throw Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${_.alg}`);
            return H
        }
    }
})
// @from(Ln 187066, Col 4)
wi7 = x((nN2, _i7) => {
    _i7.exports = {
        decode: I08(),
        verify: Vl7(),
        sign: zi7(),
        JsonWebTokenError: eB6(),
        NotBeforeError: b08(),
        TokenExpiredError: x08()
    }
})
// @from(Ln 187076, Col 0)
class tC {
    static fromAssertion(A) {
        let q = new tC;
        return q.jwt = A, q
    }
    static fromCertificate(A, q, K) {
        let Y = new tC;
        if (Y.privateKey = q, Y.thumbprint = A, Y.useSha256 = !1, K) Y.publicCertificate = this.parseCertificate(K);
        return Y
    }
    static fromCertificateWithSha256Thumbprint(A, q, K) {
        let Y = new tC;
        if (Y.privateKey = q, Y.thumbprint = A, Y.useSha256 = !0, K) Y.publicCertificate = this.parseCertificate(K);
        return Y
    }
    getJwt(A, q, K) {
        if (this.privateKey && this.thumbprint) {
            if (this.jwt && !this.isExpired() && q === this.issuer && K === this.jwtAudience) return this.jwt;
            return this.createJwt(A, q, K)
        }
        if (this.jwt) return this.jwt;
        throw t8(j2.invalidAssertion)
    }
    createJwt(A, q, K) {
        this.issuer = q, this.jwtAudience = K;
        let Y = ZO.nowSeconds();
        this.expirationTime = Y + 600;
        let _ = {
                alg: this.useSha256 ? lL.PSS_256 : lL.RSA_256
            },
            w = this.useSha256 ? lL.X5T_256 : lL.X5T;
        if (Object.assign(_, {
                [w]: yv.base64EncodeUrl(this.thumbprint, cP.HEX)
            }), this.publicCertificate) Object.assign(_, {
            [lL.X5C]: this.publicCertificate
        });
        let O = {
            [lL.AUDIENCE]: this.jwtAudience,
            [lL.EXPIRATION_TIME]: this.expirationTime,
            [lL.ISSUER]: this.issuer,
            [lL.SUBJECT]: this.issuer,
            [lL.NOT_BEFORE]: Y,
            [lL.JWT_ID]: A.createNewGuid()
        };
        return this.jwt = Oi7.default.sign(O, this.privateKey, {
            header: _
        }), this.jwt
    }
    isExpired() {
        return this.expirationTime < ZO.nowSeconds()
    }
    static parseCertificate(A) {
        let q = /-----BEGIN CERTIFICATE-----\r*\n(.+?)\r*\n-----END CERTIFICATE-----/gs,
            K = [],
            Y;
        while ((Y = q.exec(A)) !== null) K.push(Y[1].replace(/\r*\n/g, S8.EMPTY_STRING));
        return K
    }
}
// @from(Ln 187135, Col 4)
Oi7
// @from(Ln 187136, Col 4)
OM1 = E(() => {
    X_();
    iB6();
    fO();
    Oi7 = t(wi7(), 1); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 187142, Col 4)
$M1 = "@azure/msal-node"
// @from(Ln 187143, Col 4)
eC = "3.8.1"
// @from(Ln 187144, Col 4)
UP6 = E(() => {
    /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Ln 187146, Col 4)
$g6
// @from(Ln 187147, Col 4)
_W8 = E(() => {
    X_(); /*! @azure/msal-node v3.8.1 2025-10-29 */
    $g6 = class $g6 extends nW {
        constructor(A) {
            super(A)
        }
        async acquireToken(A) {
            this.logger.info("in acquireToken call in username-password client");
            let q = ZO.nowSeconds(),
                K = await this.executeTokenRequest(this.authority, A),
                Y = new dH(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
            return Y.validateTokenResponse(K.body), Y.handleServerTokenResponse(K.body, this.authority, q, A)
        }
        async executeTokenRequest(A, q) {
            let K = this.createTokenQueryParameters(q),
                Y = U5.appendQueryString(A.tokenEndpoint, K),
                z = await this.createTokenRequestBody(q),
                _ = this.createTokenRequestHeaders({
                    credential: q.username,
                    type: aG.UPN
                }),
                w = {
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
            return this.executePostToTokenEndpoint(Y, z, _, w, q.correlationId)
        }
        async createTokenRequestBody(A) {
            let q = new Map;
            if (q4.addClientId(q, this.config.authOptions.clientId), q4.addUsername(q, A.username), q4.addPassword(q, A.password), q4.addScopes(q, A.scopes), q4.addResponseType(q, PP6.IDTOKEN_TOKEN), q4.addGrantType(q, Vv.RESOURCE_OWNER_PASSWORD_GRANT), q4.addClientInfo(q), q4.addLibraryInfo(q, this.config.libraryInfo), q4.addApplicationTelemetry(q, this.config.telemetry.application), q4.addThrottling(q), this.serverTelemetryManager) q4.addServerTelemetry(q, this.serverTelemetryManager);
            let K = A.correlationId || this.config.cryptoInterface.createNewGuid();
            if (q4.addCorrelationId(q, K), this.config.clientCredentials.clientSecret) q4.addClientSecret(q, this.config.clientCredentials.clientSecret);
            let Y = this.config.clientCredentials.clientAssertion;
            if (Y) q4.addClientAssertion(q, await eG(Y.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), q4.addClientAssertionType(q, Y.assertionType);
            if (!i2.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) q4.addClaims(q, A.claims, this.config.authOptions.clientCapabilities);
            if (this.config.systemOptions.preventCorsPreflight && A.username) q4.addCcsUpn(q, A.username);
            return lP.mapToQueryString(q)
        }
    }
})
// @from(Ln 187195, Col 0)
function $i7(A, q, K, Y) {
    let z = gB6.getStandardAuthorizeRequestParameters({
        ...A.auth,
        authority: q,
        redirectUri: K.redirectUri || ""
    }, K, Y);
    if (q4.addLibraryInfo(z, {
            sku: Af.MSAL_SKU,
            version: eC,
            cpu: process.arch || "",
            os: process.platform || ""
        }), A.auth.protocolMode !== iW.OIDC) q4.addApplicationTelemetry(z, A.telemetry.application);
    if (q4.addResponseType(z, PP6.CODE), K.codeChallenge && K.codeChallengeMethod) q4.addCodeChallengeParams(z, K.codeChallenge, K.codeChallengeMethod);
    return q4.addExtraQueryParameters(z, K.extraQueryParameters || {}), gB6.getAuthorizeUrl(q, z, A.auth.encodeExtraQueryParams, K.extraQueryParameters)
}
// @from(Ln 187210, Col 4)
Hi7 = E(() => {
    X_();
    fO();
    UP6(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 187215, Col 0)
class m56 {
    constructor(A) {
        this.config = bQ7(A), this.cryptoProvider = new $d, this.logger = new kv(this.config.system.loggerOptions, $M1, eC), this.storage = new b56(this.logger, this.config.auth.clientId, this.cryptoProvider, aP8(this.config.auth)), this.tokenCache = new oB6(this.storage, this.logger, this.config.cache.cachePlugin)
    }
    async getAuthCodeUrl(A) {
        this.logger.info("getAuthCodeUrl called", A.correlationId);
        let q = {
                ...A,
                ...await this.initializeBaseRequest(A),
                responseMode: A.responseMode || cm.QUERY,
                authenticationScheme: k9.BEARER,
                state: A.state || "",
                nonce: A.nonce || ""
            },
            K = await this.createAuthority(q.authority, q.correlationId, void 0, A.azureCloudOptions);
        return $i7(this.config, K, q, this.logger)
    }
    async acquireTokenByCode(A, q) {
        if (this.logger.info("acquireTokenByCode called"), A.state && q) this.logger.info("acquireTokenByCode - validating state"), this.validateState(A.state, q.state || ""), q = {
            ...q,
            state: ""
        };
        let K = {
                ...A,
                ...await this.initializeBaseRequest(A),
                authenticationScheme: k9.BEARER
            },
            Y = this.initializeServerTelemetryManager(wd.acquireTokenByCode, K.correlationId);
        try {
            let z = await this.createAuthority(K.authority, K.correlationId, void 0, A.azureCloudOptions),
                _ = await this.buildOauthClientConfiguration(z, K.correlationId, K.redirectUri, Y),
                w = new JJ1(_);
            return this.logger.verbose("Auth code client created", K.correlationId), await w.acquireToken(K, q)
        } catch (z) {
            if (z instanceof T5) z.setCorrelationId(K.correlationId);
            throw Y.cacheFailedRequest(z), z
        }
    }
    async acquireTokenByRefreshToken(A) {
        this.logger.info("acquireTokenByRefreshToken called", A.correlationId);
        let q = {
                ...A,
                ...await this.initializeBaseRequest(A),
                authenticationScheme: k9.BEARER
            },
            K = this.initializeServerTelemetryManager(wd.acquireTokenByRefreshToken, q.correlationId);
        try {
            let Y = await this.createAuthority(q.authority, q.correlationId, void 0, A.azureCloudOptions),
                z = await this.buildOauthClientConfiguration(Y, q.correlationId, q.redirectUri || "", K),
                _ = new uP6(z);
            return this.logger.verbose("Refresh token client created", q.correlationId), await _.acquireToken(q)
        } catch (Y) {
            if (Y instanceof T5) Y.setCorrelationId(q.correlationId);
            throw K.cacheFailedRequest(Y), Y
        }
    }
    async acquireTokenSilent(A) {
        let q = {
                ...A,
                ...await this.initializeBaseRequest(A),
                forceRefresh: A.forceRefresh || !1
            },
            K = this.initializeServerTelemetryManager(wd.acquireTokenSilent, q.correlationId, q.forceRefresh);
        try {
            let Y = await this.createAuthority(q.authority, q.correlationId, void 0, A.azureCloudOptions),
                z = await this.buildOauthClientConfiguration(Y, q.correlationId, q.redirectUri || "", K),
                _ = new MJ1(z);
            this.logger.verbose("Silent flow client created", q.correlationId);
            try {
                return await this.tokenCache.overwriteCache(), await this.acquireCachedTokenSilent(q, _, z)
            } catch (w) {
                if (w instanceof xs && w.errorCode === j2.tokenRefreshRequired) return new uP6(z).acquireTokenByRefreshToken(q);
                throw w
            }
        } catch (Y) {
            if (Y instanceof T5) Y.setCorrelationId(q.correlationId);
            throw K.cacheFailedRequest(Y), Y
        }
    }
    async acquireCachedTokenSilent(A, q, K) {
        let [Y, z] = await q.acquireCachedToken({
            ...A,
            scopes: A.scopes?.length ? A.scopes : [...lW]
        });
        if (z === l2.PROACTIVELY_REFRESHED) {
            this.logger.info("ClientApplication:acquireCachedTokenSilent - Cached access token's refreshOn property has been exceeded'. It's not expired, but must be refreshed.");
            let _ = new uP6(K);
            try {
                await _.acquireTokenByRefreshToken(A)
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
            K = this.initializeServerTelemetryManager(wd.acquireTokenByUsernamePassword, q.correlationId);
        try {
            let Y = await this.createAuthority(q.authority, q.correlationId, void 0, A.azureCloudOptions),
                z = await this.buildOauthClientConfiguration(Y, q.correlationId, "", K),
                _ = new $g6(z);
            return this.logger.verbose("Username password client created", q.correlationId), await _.acquireToken(q)
        } catch (Y) {
            if (Y instanceof T5) Y.setCorrelationId(q.correlationId);
            throw K.cacheFailedRequest(Y), Y
        }
    }
    getTokenCache() {
        return this.logger.info("getTokenCache called"), this.tokenCache
    }
    validateState(A, q) {
        if (!A) throw O$.createStateNotFoundError();
        if (A !== q) throw t8(j2.stateMismatch)
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
                sku: Af.MSAL_SKU,
                version: eC,
                cpu: process.arch || S8.EMPTY_STRING,
                os: process.platform || S8.EMPTY_STRING
            },
            telemetry: this.config.telemetry,
            persistencePlugin: this.config.cache.cachePlugin,
            serializableCache: this.tokenCache
        }
    }
    async getClientAssertion(A) {
        if (this.developerProvidedClientAssertion) this.clientAssertion = tC.fromAssertion(await eG(this.developerProvidedClientAssertion, this.config.auth.clientId, A.tokenEndpoint));
        return this.clientAssertion && {
            assertion: this.clientAssertion.getJwt(this.cryptoProvider, this.config.auth.clientId, A.tokenEndpoint),
            assertionType: Af.JWT_BEARER_ASSERTION_TYPE
        }
    }
    async initializeBaseRequest(A) {
        if (this.logger.verbose("initializeRequestScopes called", A.correlationId), A.authenticationScheme && A.authenticationScheme === k9.POP) this.logger.verbose("Authentication Scheme 'pop' is not supported yet, setting Authentication Scheme to 'Bearer' for request", A.correlationId);
        if (A.authenticationScheme = k9.BEARER, this.config.cache.claimsBasedCachingEnabled && A.claims && !i2.isEmptyObj(A.claims)) A.requestedClaimsHash = await this.cryptoProvider.hashString(A.claims);
        return {
            ...A,
            scopes: [...A && A.scopes || [], ...lW],
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
        return new cs(Y, this.storage)
    }
    async createAuthority(A, q, K, Y) {
        this.logger.verbose("createAuthority called", q);
        let z = dM.generateAuthority(A, Y || this.config.auth.azureCloudOptions),
            _ = {
                protocolMode: this.config.auth.protocolMode,
                knownAuthorities: this.config.auth.knownAuthorities,
                cloudDiscoveryMetadata: this.config.auth.cloudDiscoveryMetadata,
                authorityMetadata: this.config.auth.authorityMetadata,
                azureRegionConfiguration: K,
                skipAuthorityMetadataCache: this.config.auth.skipAuthorityMetadataCache
            };
        return ej1.createDiscoveredInstance(z, this.config.system.networkClient, this.storage, _, this.logger, q)
    }
    clearCache() {
        this.storage.clear()
    }
}
// @from(Ln 187417, Col 4)
HM1 = E(() => {
    X_();
    J08();
    nB6();
    SJ1();
    fO();
    T08();
    OM1();
    UP6();
    UB6();
    _W8();
    Hi7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 187431, Col 0)
class wW8 {
    async listenForAuthCode(A, q) {
        if (this.server) throw O$.createLoopbackServerAlreadyExistsError();
        return new Promise((K, Y) => {
            this.server = NH9.createServer((z, _) => {
                let w = z.url;
                if (!w) {
                    _.end(q || "Error occurred loading redirectUrl"), Y(O$.createUnableToLoadRedirectUrlError());
                    return
                } else if (w === S8.FORWARD_SLASH) {
                    _.end(A || "Auth code was successfully acquired. You can close this window now.");
                    return
                }
                let O = this.getRedirectUri(),
                    $ = new URL(w, O),
                    H = lP.getDeserializedResponse($.search) || {};
                if (H.code) _.writeHead(f5.REDIRECT, {
                    location: O
                }), _.end();
                if (H.error) _.end(q || `Error occurred: ${H.error}`);
                K(H)
            }), this.server.listen(0, "127.0.0.1")
        })
    }
    getRedirectUri() {
        if (!this.server || !this.server.listening) throw O$.createNoLoopbackServerExistsError();
        let A = this.server.address();
        if (!A || typeof A === "string" || !A.port) throw this.closeServer(), O$.createInvalidLoopbackAddressTypeError();
        let q = A && A.port;
        return `${Af.HTTP_PROTOCOL}${Af.LOCALHOST}:${q}`
    }
    closeServer() {
        if (this.server) {
            if (this.server.close(), typeof this.server.closeAllConnections === "function") this.server.closeAllConnections();
            this.server.unref(), this.server = void 0
        }
    }
}
// @from(Ln 187469, Col 4)
ji7 = E(() => {
    X_();
    UB6();
    fO(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Ln 187474, Col 4)
Hg6