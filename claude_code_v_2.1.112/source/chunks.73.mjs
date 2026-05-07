
// @from(Ln 192037, Col 4)
XO4 = p((g_w, JO4) => {
    var qp_ = (q) => {
        if (q.length < 64) return null;
        if (q.readUInt32BE(0) !== 2135247942) return null;
        if (q.readUInt8(4) !== 2) return null;
        if (q.readUInt8(5) !== 1) return null;
        let K = q.readUInt32LE(32),
            _ = q.readUInt16LE(54),
            z = q.readUInt16LE(56);
        for (let Y = 0; Y < z; Y++) {
            let A = K + Y * _;
            if (q.readUInt32LE(A) === 3) {
                let w = q.readUInt32LE(A + 8),
                    $ = q.readUInt32LE(A + 32);
                return q.subarray(w, w + $).toString().replace(/\0.*$/g, "")
            }
        }
        return null
    };
    JO4.exports = {
        interpreterPath: qp_
    }
})
// @from(Ln 192060, Col 4)
Ay8 = p((U_w, RO4) => {
    var PO4 = d6("child_process"),
        {
            isLinux: $E6,
            getReport: WO4
        } = $O4(),
        {
            LDD_PATH: Yy8,
            SELF_PATH: DO4,
            readFile: Xm1,
            readFileSync: Mm1
        } = HO4(),
        {
            interpreterPath: ZO4
        } = XO4(),
        hd, Rd, Sd, p46 = "",
        fO4 = () => {
            if (!p46) return new Promise((q) => {
                PO4.exec("getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true", (K, _) => {
                    p46 = K ? " " : _, q(p46)
                })
            });
            return p46
        },
        GO4 = () => {
            if (!p46) try {
                p46 = PO4.execSync("getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true", {
                    encoding: "utf8"
                })
            } catch (q) {
                p46 = " "
            }
            return p46
        },
        sa = "glibc",
        vO4 = /LIBC[a-z0-9 \-).]*?(\d+\.\d+)/i,
        Q$6 = "musl",
        Kp_ = (q) => q.includes("libc.musl-") || q.includes("ld-musl-"),
        TO4 = () => {
            let q = WO4();
            if (q.header && q.header.glibcVersionRuntime) return sa;
            if (Array.isArray(q.sharedObjects)) {
                if (q.sharedObjects.some(Kp_)) return Q$6
            }
            return null
        },
        VO4 = (q) => {
            let [K, _] = q.split(/[\r\n]+/);
            if (K && K.includes(sa)) return sa;
            if (_ && _.includes(Q$6)) return Q$6;
            return null
        },
        kO4 = (q) => {
            if (q) {
                if (q.includes("/ld-musl-")) return Q$6;
                else if (q.includes("/ld-linux-")) return sa
            }
            return null
        },
        NO4 = (q) => {
            if (q = q.toString(), q.includes("musl")) return Q$6;
            if (q.includes("GNU C Library")) return sa;
            return null
        },
        _p_ = async () => {
            if (Rd !== void 0) return Rd;
            Rd = null;
            try {
                let q = await Xm1(Yy8);
                Rd = NO4(q)
            } catch (q) {}
            return Rd
        }, zp_ = () => {
            if (Rd !== void 0) return Rd;
            Rd = null;
            try {
                let q = Mm1(Yy8);
                Rd = NO4(q)
            } catch (q) {}
            return Rd
        }, Yp_ = async () => {
            if (hd !== void 0) return hd;
            hd = null;
            try {
                let q = await Xm1(DO4),
                    K = ZO4(q);
                hd = kO4(K)
            } catch (q) {}
            return hd
        }, Ap_ = () => {
            if (hd !== void 0) return hd;
            hd = null;
            try {
                let q = Mm1(DO4),
                    K = ZO4(q);
                hd = kO4(K)
            } catch (q) {}
            return hd
        }, EO4 = async () => {
            let q = null;
            if ($E6()) {
                if (q = await Yp_(), !q) {
                    if (q = await _p_(), !q) q = TO4();
                    if (!q) {
                        let K = await fO4();
                        q = VO4(K)
                    }
                }
            }
            return q
        }, yO4 = () => {
            let q = null;
            if ($E6()) {
                if (q = Ap_(), !q) {
                    if (q = zp_(), !q) q = TO4();
                    if (!q) {
                        let K = GO4();
                        q = VO4(K)
                    }
                }
            }
            return q
        }, Op_ = async () => $E6() && await EO4() !== sa, wp_ = () => $E6() && yO4() !== sa, $p_ = async () => {
            if (Sd !== void 0) return Sd;
            Sd = null;
            try {
                let K = (await Xm1(Yy8)).match(vO4);
                if (K) Sd = K[1]
            } catch (q) {}
            return Sd
        }, jp_ = () => {
            if (Sd !== void 0) return Sd;
            Sd = null;
            try {
                let K = Mm1(Yy8).match(vO4);
                if (K) Sd = K[1]
            } catch (q) {}
            return Sd
        }, LO4 = () => {
            let q = WO4();
            if (q.header && q.header.glibcVersionRuntime) return q.header.glibcVersionRuntime;
            return null
        }, MO4 = (q) => q.trim().split(/\s+/)[1], hO4 = (q) => {
            let [K, _, z] = q.split(/[\r\n]+/);
            if (K && K.includes(sa)) return MO4(K);
            if (_ && z && _.includes(Q$6)) return MO4(z);
            return null
        }, Hp_ = async () => {
            let q = null;
            if ($E6()) {
                if (q = await $p_(), !q) q = LO4();
                if (!q) {
                    let K = await fO4();
                    q = hO4(K)
                }
            }
            return q
        }, Jp_ = () => {
            let q = null;
            if ($E6()) {
                if (q = jp_(), !q) q = LO4();
                if (!q) {
                    let K = GO4();
                    q = hO4(K)
                }
            }
            return q
        };
    RO4.exports = {
        GLIBC: sa,
        MUSL: Q$6,
        family: EO4,
        familySync: yO4,
        isNonGlibcLinux: Op_,
        isNonGlibcLinuxSync: wp_,
        version: Hp_,
        versionSync: Jp_
    }
})
// @from(Ln 192239, Col 4)
Gs6 = p((Q_w, SO4) => {
    var Xp_ = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...q) => console.error("SEMVER", ...q) : () => {};
    SO4.exports = Xp_
})
// @from(Ln 192243, Col 4)
Oy8 = p((d_w, CO4) => {
    var Mp_ = Number.MAX_SAFE_INTEGER || 9007199254740991,
        Pp_ = ["major", "premajor", "minor", "preminor", "patch", "prepatch", "prerelease"];
    CO4.exports = {
        MAX_LENGTH: 256,
        MAX_SAFE_COMPONENT_LENGTH: 16,
        MAX_SAFE_BUILD_LENGTH: 250,
        MAX_SAFE_INTEGER: Mp_,
        RELEASE_TYPES: Pp_,
        SEMVER_SPEC_VERSION: "2.0.0",
        FLAG_INCLUDE_PRERELEASE: 1,
        FLAG_LOOSE: 2
    }
})
// @from(Ln 192257, Col 4)
vs6 = p((Cd, bO4) => {
    var {
        MAX_SAFE_COMPONENT_LENGTH: Pm1,
        MAX_SAFE_BUILD_LENGTH: Wp_,
        MAX_LENGTH: Dp_
    } = Oy8(), Zp_ = Gs6();
    Cd = bO4.exports = {};
    var fp_ = Cd.re = [],
        Gp_ = Cd.safeRe = [],
        $K = Cd.src = [],
        vp_ = Cd.safeSrc = [],
        jK = Cd.t = {},
        Tp_ = 0,
        Wm1 = "[a-zA-Z0-9-]",
        Vp_ = [
            ["\\s", 1],
            ["\\d", Dp_],
            [Wm1, Wp_]
        ],
        kp_ = (q) => {
            for (let [K, _] of Vp_) q = q.split(`${K}*`).join(`${K}{0,${_}}`).split(`${K}+`).join(`${K}{1,${_}}`);
            return q
        },
        o9 = (q, K, _) => {
            let z = kp_(K),
                Y = Tp_++;
            Zp_(q, Y, K), jK[q] = Y, $K[Y] = K, vp_[Y] = z, fp_[Y] = new RegExp(K, _ ? "g" : void 0), Gp_[Y] = new RegExp(z, _ ? "g" : void 0)
        };
    o9("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    o9("NUMERICIDENTIFIERLOOSE", "\\d+");
    o9("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${Wm1}*`);
    o9("MAINVERSION", `(${$K[jK.NUMERICIDENTIFIER]})\\.(${$K[jK.NUMERICIDENTIFIER]})\\.(${$K[jK.NUMERICIDENTIFIER]})`);
    o9("MAINVERSIONLOOSE", `(${$K[jK.NUMERICIDENTIFIERLOOSE]})\\.(${$K[jK.NUMERICIDENTIFIERLOOSE]})\\.(${$K[jK.NUMERICIDENTIFIERLOOSE]})`);
    o9("PRERELEASEIDENTIFIER", `(?:${$K[jK.NONNUMERICIDENTIFIER]}|${$K[jK.NUMERICIDENTIFIER]})`);
    o9("PRERELEASEIDENTIFIERLOOSE", `(?:${$K[jK.NONNUMERICIDENTIFIER]}|${$K[jK.NUMERICIDENTIFIERLOOSE]})`);
    o9("PRERELEASE", `(?:-(${$K[jK.PRERELEASEIDENTIFIER]}(?:\\.${$K[jK.PRERELEASEIDENTIFIER]})*))`);
    o9("PRERELEASELOOSE", `(?:-?(${$K[jK.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${$K[jK.PRERELEASEIDENTIFIERLOOSE]})*))`);
    o9("BUILDIDENTIFIER", `${Wm1}+`);
    o9("BUILD", `(?:\\+(${$K[jK.BUILDIDENTIFIER]}(?:\\.${$K[jK.BUILDIDENTIFIER]})*))`);
    o9("FULLPLAIN", `v?${$K[jK.MAINVERSION]}${$K[jK.PRERELEASE]}?${$K[jK.BUILD]}?`);
    o9("FULL", `^${$K[jK.FULLPLAIN]}$`);
    o9("LOOSEPLAIN", `[v=\\s]*${$K[jK.MAINVERSIONLOOSE]}${$K[jK.PRERELEASELOOSE]}?${$K[jK.BUILD]}?`);
    o9("LOOSE", `^${$K[jK.LOOSEPLAIN]}$`);
    o9("GTLT", "((?:<|>)?=?)");
    o9("XRANGEIDENTIFIERLOOSE", `${$K[jK.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    o9("XRANGEIDENTIFIER", `${$K[jK.NUMERICIDENTIFIER]}|x|X|\\*`);
    o9("XRANGEPLAIN", `[v=\\s]*(${$K[jK.XRANGEIDENTIFIER]})(?:\\.(${$K[jK.XRANGEIDENTIFIER]})(?:\\.(${$K[jK.XRANGEIDENTIFIER]})(?:${$K[jK.PRERELEASE]})?${$K[jK.BUILD]}?)?)?`);
    o9("XRANGEPLAINLOOSE", `[v=\\s]*(${$K[jK.XRANGEIDENTIFIERLOOSE]})(?:\\.(${$K[jK.XRANGEIDENTIFIERLOOSE]})(?:\\.(${$K[jK.XRANGEIDENTIFIERLOOSE]})(?:${$K[jK.PRERELEASELOOSE]})?${$K[jK.BUILD]}?)?)?`);
    o9("XRANGE", `^${$K[jK.GTLT]}\\s*${$K[jK.XRANGEPLAIN]}$`);
    o9("XRANGELOOSE", `^${$K[jK.GTLT]}\\s*${$K[jK.XRANGEPLAINLOOSE]}$`);
    o9("COERCEPLAIN", `(^|[^\\d])(\\d{1,${Pm1}})(?:\\.(\\d{1,${Pm1}}))?(?:\\.(\\d{1,${Pm1}}))?`);
    o9("COERCE", `${$K[jK.COERCEPLAIN]}(?:$|[^\\d])`);
    o9("COERCEFULL", $K[jK.COERCEPLAIN] + `(?:${$K[jK.PRERELEASE]})?(?:${$K[jK.BUILD]})?(?:$|[^\\d])`);
    o9("COERCERTL", $K[jK.COERCE], !0);
    o9("COERCERTLFULL", $K[jK.COERCEFULL], !0);
    o9("LONETILDE", "(?:~>?)");
    o9("TILDETRIM", `(\\s*)${$K[jK.LONETILDE]}\\s+`, !0);
    Cd.tildeTrimReplace = "$1~";
    o9("TILDE", `^${$K[jK.LONETILDE]}${$K[jK.XRANGEPLAIN]}$`);
    o9("TILDELOOSE", `^${$K[jK.LONETILDE]}${$K[jK.XRANGEPLAINLOOSE]}$`);
    o9("LONECARET", "(?:\\^)");
    o9("CARETTRIM", `(\\s*)${$K[jK.LONECARET]}\\s+`, !0);
    Cd.caretTrimReplace = "$1^";
    o9("CARET", `^${$K[jK.LONECARET]}${$K[jK.XRANGEPLAIN]}$`);
    o9("CARETLOOSE", `^${$K[jK.LONECARET]}${$K[jK.XRANGEPLAINLOOSE]}$`);
    o9("COMPARATORLOOSE", `^${$K[jK.GTLT]}\\s*(${$K[jK.LOOSEPLAIN]})$|^$`);
    o9("COMPARATOR", `^${$K[jK.GTLT]}\\s*(${$K[jK.FULLPLAIN]})$|^$`);
    o9("COMPARATORTRIM", `(\\s*)${$K[jK.GTLT]}\\s*(${$K[jK.LOOSEPLAIN]}|${$K[jK.XRANGEPLAIN]})`, !0);
    Cd.comparatorTrimReplace = "$1$2$3";
    o9("HYPHENRANGE", `^\\s*(${$K[jK.XRANGEPLAIN]})\\s+-\\s+(${$K[jK.XRANGEPLAIN]})\\s*$`);
    o9("HYPHENRANGELOOSE", `^\\s*(${$K[jK.XRANGEPLAINLOOSE]})\\s+-\\s+(${$K[jK.XRANGEPLAINLOOSE]})\\s*$`);
    o9("STAR", "(<|>)?=?\\s*\\*");
    o9("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    o9("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$")
})
// @from(Ln 192332, Col 4)
wy8 = p((c_w, IO4) => {
    var Np_ = Object.freeze({
            loose: !0
        }),
        Ep_ = Object.freeze({}),
        yp_ = (q) => {
            if (!q) return Ep_;
            if (typeof q !== "object") return Np_;
            return q
        };
    IO4.exports = yp_
})
// @from(Ln 192344, Col 4)
BO4 = p((l_w, mO4) => {
    var xO4 = /^[0-9]+$/,
        uO4 = (q, K) => {
            if (typeof q === "number" && typeof K === "number") return q === K ? 0 : q < K ? -1 : 1;
            let _ = xO4.test(q),
                z = xO4.test(K);
            if (_ && z) q = +q, K = +K;
            return q === K ? 0 : _ && !z ? -1 : z && !_ ? 1 : q < K ? -1 : 1
        },
        Lp_ = (q, K) => uO4(K, q);
    mO4.exports = {
        compareIdentifiers: uO4,
        rcompareIdentifiers: Lp_
    }
})
// @from(Ln 192359, Col 4)
jE6 = p((n_w, FO4) => {
    var $y8 = Gs6(),
        {
            MAX_LENGTH: pO4,
            MAX_SAFE_INTEGER: jy8
        } = Oy8(),
        {
            safeRe: Hy8,
            t: Jy8
        } = vs6(),
        hp_ = wy8(),
        {
            compareIdentifiers: Dm1
        } = BO4();
    class Yp {
        constructor(q, K) {
            if (K = hp_(K), q instanceof Yp)
                if (q.loose === !!K.loose && q.includePrerelease === !!K.includePrerelease) return q;
                else q = q.version;
            else if (typeof q !== "string") throw TypeError(`Invalid version. Must be a string. Got type "${typeof q}".`);
            if (q.length > pO4) throw TypeError(`version is longer than ${pO4} characters`);
            $y8("SemVer", q, K), this.options = K, this.loose = !!K.loose, this.includePrerelease = !!K.includePrerelease;
            let _ = q.trim().match(K.loose ? Hy8[Jy8.LOOSE] : Hy8[Jy8.FULL]);
            if (!_) throw TypeError(`Invalid Version: ${q}`);
            if (this.raw = q, this.major = +_[1], this.minor = +_[2], this.patch = +_[3], this.major > jy8 || this.major < 0) throw TypeError("Invalid major version");
            if (this.minor > jy8 || this.minor < 0) throw TypeError("Invalid minor version");
            if (this.patch > jy8 || this.patch < 0) throw TypeError("Invalid patch version");
            if (!_[4]) this.prerelease = [];
            else this.prerelease = _[4].split(".").map((z) => {
                if (/^[0-9]+$/.test(z)) {
                    let Y = +z;
                    if (Y >= 0 && Y < jy8) return Y
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
            if ($y8("SemVer.compare", this.version, this.options, q), !(q instanceof Yp)) {
                if (typeof q === "string" && q === this.version) return 0;
                q = new Yp(q, this.options)
            }
            if (q.version === this.version) return 0;
            return this.compareMain(q) || this.comparePre(q)
        }
        compareMain(q) {
            if (!(q instanceof Yp)) q = new Yp(q, this.options);
            if (this.major < q.major) return -1;
            if (this.major > q.major) return 1;
            if (this.minor < q.minor) return -1;
            if (this.minor > q.minor) return 1;
            if (this.patch < q.patch) return -1;
            if (this.patch > q.patch) return 1;
            return 0
        }
        comparePre(q) {
            if (!(q instanceof Yp)) q = new Yp(q, this.options);
            if (this.prerelease.length && !q.prerelease.length) return -1;
            else if (!this.prerelease.length && q.prerelease.length) return 1;
            else if (!this.prerelease.length && !q.prerelease.length) return 0;
            let K = 0;
            do {
                let _ = this.prerelease[K],
                    z = q.prerelease[K];
                if ($y8("prerelease compare", K, _, z), _ === void 0 && z === void 0) return 0;
                else if (z === void 0) return 1;
                else if (_ === void 0) return -1;
                else if (_ === z) continue;
                else return Dm1(_, z)
            } while (++K)
        }
        compareBuild(q) {
            if (!(q instanceof Yp)) q = new Yp(q, this.options);
            let K = 0;
            do {
                let _ = this.build[K],
                    z = q.build[K];
                if ($y8("build compare", K, _, z), _ === void 0 && z === void 0) return 0;
                else if (z === void 0) return 1;
                else if (_ === void 0) return -1;
                else if (_ === z) continue;
                else return Dm1(_, z)
            } while (++K)
        }
        inc(q, K, _) {
            if (q.startsWith("pre")) {
                if (!K && _ === !1) throw Error("invalid increment argument: identifier is empty");
                if (K) {
                    let z = `-${K}`.match(this.options.loose ? Hy8[Jy8.PRERELEASELOOSE] : Hy8[Jy8.PRERELEASE]);
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
                        if (Dm1(this.prerelease[0], K) === 0) {
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
    FO4.exports = Yp
})
// @from(Ln 192518, Col 4)
QO4 = p((i_w, UO4) => {
    var gO4 = jE6(),
        Rp_ = (q, K, _ = !1) => {
            if (q instanceof gO4) return q;
            try {
                return new gO4(q, K)
            } catch (z) {
                if (!_) return null;
                throw z
            }
        };
    UO4.exports = Rp_
})
// @from(Ln 192531, Col 4)
cO4 = p((r_w, dO4) => {
    var Sp_ = jE6(),
        Cp_ = QO4(),
        {
            safeRe: Xy8,
            t: My8
        } = vs6(),
        bp_ = (q, K) => {
            if (q instanceof Sp_) return q;
            if (typeof q === "number") q = String(q);
            if (typeof q !== "string") return null;
            K = K || {};
            let _ = null;
            if (!K.rtl) _ = q.match(K.includePrerelease ? Xy8[My8.COERCEFULL] : Xy8[My8.COERCE]);
            else {
                let $ = K.includePrerelease ? Xy8[My8.COERCERTLFULL] : Xy8[My8.COERCERTL],
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
            return Cp_(`${z}.${Y}.${A}${O}${w}`, K)
        };
    dO4.exports = bp_
})
// @from(Ln 192564, Col 4)
d$6 = p((o_w, nO4) => {
    var lO4 = jE6(),
        Ip_ = (q, K, _) => new lO4(q, _).compare(new lO4(K, _));
    nO4.exports = Ip_
})
// @from(Ln 192569, Col 4)
Zm1 = p((a_w, iO4) => {
    var xp_ = d$6(),
        up_ = (q, K, _) => xp_(q, K, _) >= 0;
    iO4.exports = up_
})
// @from(Ln 192574, Col 4)
aO4 = p((s_w, oO4) => {
    class rO4 {
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
    oO4.exports = rO4
})
// @from(Ln 192600, Col 4)
tO4 = p((t_w, sO4) => {
    var mp_ = d$6(),
        Bp_ = (q, K, _) => mp_(q, K, _) === 0;
    sO4.exports = Bp_
})
// @from(Ln 192605, Col 4)
qw4 = p((e_w, eO4) => {
    var pp_ = d$6(),
        Fp_ = (q, K, _) => pp_(q, K, _) !== 0;
    eO4.exports = Fp_
})
// @from(Ln 192610, Col 4)
_w4 = p((qzw, Kw4) => {
    var gp_ = d$6(),
        Up_ = (q, K, _) => gp_(q, K, _) > 0;
    Kw4.exports = Up_
})
// @from(Ln 192615, Col 4)
Yw4 = p((Kzw, zw4) => {
    var Qp_ = d$6(),
        dp_ = (q, K, _) => Qp_(q, K, _) < 0;
    zw4.exports = dp_
})
// @from(Ln 192620, Col 4)
Ow4 = p((_zw, Aw4) => {
    var cp_ = d$6(),
        lp_ = (q, K, _) => cp_(q, K, _) <= 0;
    Aw4.exports = lp_
})
// @from(Ln 192625, Col 4)
$w4 = p((zzw, ww4) => {
    var np_ = tO4(),
        ip_ = qw4(),
        rp_ = _w4(),
        op_ = Zm1(),
        ap_ = Yw4(),
        sp_ = Ow4(),
        tp_ = (q, K, _, z) => {
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
                    return np_(q, _, z);
                case "!=":
                    return ip_(q, _, z);
                case ">":
                    return rp_(q, _, z);
                case ">=":
                    return op_(q, _, z);
                case "<":
                    return ap_(q, _, z);
                case "<=":
                    return sp_(q, _, z);
                default:
                    throw TypeError(`Invalid operator: ${K}`)
            }
        };
    ww4.exports = tp_
})
// @from(Ln 192662, Col 4)
Ww4 = p((Yzw, Pw4) => {
    var Ts6 = Symbol("SemVer ANY");
    class Py8 {
        static get ANY() {
            return Ts6
        }
        constructor(q, K) {
            if (K = jw4(K), q instanceof Py8)
                if (q.loose === !!K.loose) return q;
                else q = q.value;
            if (q = q.trim().split(/\s+/).join(" "), Gm1("comparator", q, K), this.options = K, this.loose = !!K.loose, this.parse(q), this.semver === Ts6) this.value = "";
            else this.value = this.operator + this.semver.version;
            Gm1("comp", this)
        }
        parse(q) {
            let K = this.options.loose ? Hw4[Jw4.COMPARATORLOOSE] : Hw4[Jw4.COMPARATOR],
                _ = q.match(K);
            if (!_) throw TypeError(`Invalid comparator: ${q}`);
            if (this.operator = _[1] !== void 0 ? _[1] : "", this.operator === "=") this.operator = "";
            if (!_[2]) this.semver = Ts6;
            else this.semver = new Xw4(_[2], this.options.loose)
        }
        toString() {
            return this.value
        }
        test(q) {
            if (Gm1("Comparator.test", q, this.options.loose), this.semver === Ts6 || q === Ts6) return !0;
            if (typeof q === "string") try {
                q = new Xw4(q, this.options)
            } catch (K) {
                return !1
            }
            return fm1(q, this.operator, this.semver, this.options)
        }
        intersects(q, K) {
            if (!(q instanceof Py8)) throw TypeError("a Comparator is required");
            if (this.operator === "") {
                if (this.value === "") return !0;
                return new Mw4(q.value, K).test(this.value)
            } else if (q.operator === "") {
                if (q.value === "") return !0;
                return new Mw4(this.value, K).test(q.semver)
            }
            if (K = jw4(K), K.includePrerelease && (this.value === "<0.0.0-0" || q.value === "<0.0.0-0")) return !1;
            if (!K.includePrerelease && (this.value.startsWith("<0.0.0") || q.value.startsWith("<0.0.0"))) return !1;
            if (this.operator.startsWith(">") && q.operator.startsWith(">")) return !0;
            if (this.operator.startsWith("<") && q.operator.startsWith("<")) return !0;
            if (this.semver.version === q.semver.version && this.operator.includes("=") && q.operator.includes("=")) return !0;
            if (fm1(this.semver, "<", q.semver, K) && this.operator.startsWith(">") && q.operator.startsWith("<")) return !0;
            if (fm1(this.semver, ">", q.semver, K) && this.operator.startsWith("<") && q.operator.startsWith(">")) return !0;
            return !1
        }
    }
    Pw4.exports = Py8;
    var jw4 = wy8(),
        {
            safeRe: Hw4,
            t: Jw4
        } = vs6(),
        fm1 = $w4(),
        Gm1 = Gs6(),
        Xw4 = jE6(),
        Mw4 = vm1()
})
// @from(Ln 192726, Col 4)
vm1 = p((Azw, Gw4) => {
    var ep_ = /\s+/g;
    class Vs6 {
        constructor(q, K) {
            if (K = KF_(K), q instanceof Vs6)
                if (q.loose === !!K.loose && q.includePrerelease === !!K.includePrerelease) return q;
                else return new Vs6(q.raw, K);
            if (q instanceof Tm1) return this.raw = q.value, this.set = [
                [q]
            ], this.formatted = void 0, this;
            if (this.options = K, this.loose = !!K.loose, this.includePrerelease = !!K.includePrerelease, this.raw = q.trim().replace(ep_, " "), this.set = this.raw.split("||").map((_) => this.parseRange(_.trim())).filter((_) => _.length), !this.set.length) throw TypeError(`Invalid SemVer Range: ${this.raw}`);
            if (this.set.length > 1) {
                let _ = this.set[0];
                if (this.set = this.set.filter((z) => !Zw4(z[0])), this.set.length === 0) this.set = [_];
                else if (this.set.length > 1) {
                    for (let z of this.set)
                        if (z.length === 1 && $F_(z[0])) {
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
            let _ = ((this.options.includePrerelease && OF_) | (this.options.loose && wF_)) + ":" + q,
                z = Dw4.get(_);
            if (z) return z;
            let Y = this.options.loose,
                A = Y ? $k[cv.HYPHENRANGELOOSE] : $k[cv.HYPHENRANGE];
            q = q.replace(A, fF_(this.options.includePrerelease)), Wj("hyphen replace", q), q = q.replace($k[cv.COMPARATORTRIM], zF_), Wj("comparator trim", q), q = q.replace($k[cv.TILDETRIM], YF_), Wj("tilde trim", q), q = q.replace($k[cv.CARETTRIM], AF_), Wj("caret trim", q);
            let O = q.split(" ").map((H) => jF_(H, this.options)).join(" ").split(/\s+/).map((H) => ZF_(H, this.options));
            if (Y) O = O.filter((H) => {
                return Wj("loose invalid filter", H, this.options), !!H.match($k[cv.COMPARATORLOOSE])
            });
            Wj("range list", O);
            let w = new Map,
                $ = O.map((H) => new Tm1(H, this.options));
            for (let H of $) {
                if (Zw4(H)) return [H];
                w.set(H.value, H)
            }
            if (w.size > 1 && w.has("")) w.delete("");
            let j = [...w.values()];
            return Dw4.set(_, j), j
        }
        intersects(q, K) {
            if (!(q instanceof Vs6)) throw TypeError("a Range is required");
            return this.set.some((_) => {
                return fw4(_, K) && q.set.some((z) => {
                    return fw4(z, K) && _.every((Y) => {
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
                q = new _F_(q, this.options)
            } catch (K) {
                return !1
            }
            for (let K = 0; K < this.set.length; K++)
                if (GF_(this.set[K], q, this.options)) return !0;
            return !1
        }
    }
    Gw4.exports = Vs6;
    var qF_ = aO4(),
        Dw4 = new qF_,
        KF_ = wy8(),
        Tm1 = Ww4(),
        Wj = Gs6(),
        _F_ = jE6(),
        {
            safeRe: $k,
            t: cv,
            comparatorTrimReplace: zF_,
            tildeTrimReplace: YF_,
            caretTrimReplace: AF_
        } = vs6(),
        {
            FLAG_INCLUDE_PRERELEASE: OF_,
            FLAG_LOOSE: wF_
        } = Oy8(),
        Zw4 = (q) => q.value === "<0.0.0-0",
        $F_ = (q) => q.value === "",
        fw4 = (q, K) => {
            let _ = !0,
                z = q.slice(),
                Y = z.pop();
            while (_ && z.length) _ = z.every((A) => {
                return Y.intersects(A, K)
            }), Y = z.pop();
            return _
        },
        jF_ = (q, K) => {
            return q = q.replace($k[cv.BUILD], ""), Wj("comp", q, K), q = XF_(q, K), Wj("caret", q), q = HF_(q, K), Wj("tildes", q), q = PF_(q, K), Wj("xrange", q), q = DF_(q, K), Wj("stars", q), q
        },
        jk = (q) => !q || q.toLowerCase() === "x" || q === "*",
        HF_ = (q, K) => {
            return q.trim().split(/\s+/).map((_) => JF_(_, K)).join(" ")
        },
        JF_ = (q, K) => {
            let _ = K.loose ? $k[cv.TILDELOOSE] : $k[cv.TILDE];
            return q.replace(_, (z, Y, A, O, w) => {
                Wj("tilde", q, z, Y, A, O, w);
                let $;
                if (jk(Y)) $ = "";
                else if (jk(A)) $ = `>=${Y}.0.0 <${+Y+1}.0.0-0`;
                else if (jk(O)) $ = `>=${Y}.${A}.0 <${Y}.${+A+1}.0-0`;
                else if (w) Wj("replaceTilde pr", w), $ = `>=${Y}.${A}.${O}-${w} <${Y}.${+A+1}.0-0`;
                else $ = `>=${Y}.${A}.${O} <${Y}.${+A+1}.0-0`;
                return Wj("tilde return", $), $
            })
        },
        XF_ = (q, K) => {
            return q.trim().split(/\s+/).map((_) => MF_(_, K)).join(" ")
        },
        MF_ = (q, K) => {
            Wj("caret", q, K);
            let _ = K.loose ? $k[cv.CARETLOOSE] : $k[cv.CARET],
                z = K.includePrerelease ? "-0" : "";
            return q.replace(_, (Y, A, O, w, $) => {
                Wj("caret", q, Y, A, O, w, $);
                let j;
                if (jk(A)) j = "";
                else if (jk(O)) j = `>=${A}.0.0${z} <${+A+1}.0.0-0`;
                else if (jk(w))
                    if (A === "0") j = `>=${A}.${O}.0${z} <${A}.${+O+1}.0-0`;
                    else j = `>=${A}.${O}.0${z} <${+A+1}.0.0-0`;
                else if ($)
                    if (Wj("replaceCaret pr", $), A === "0")
                        if (O === "0") j = `>=${A}.${O}.${w}-${$} <${A}.${O}.${+w+1}-0`;
                        else j = `>=${A}.${O}.${w}-${$} <${A}.${+O+1}.0-0`;
                else j = `>=${A}.${O}.${w}-${$} <${+A+1}.0.0-0`;
                else if (Wj("no pr"), A === "0")
                    if (O === "0") j = `>=${A}.${O}.${w}${z} <${A}.${O}.${+w+1}-0`;
                    else j = `>=${A}.${O}.${w}${z} <${A}.${+O+1}.0-0`;
                else j = `>=${A}.${O}.${w} <${+A+1}.0.0-0`;
                return Wj("caret return", j), j
            })
        },
        PF_ = (q, K) => {
            return Wj("replaceXRanges", q, K), q.split(/\s+/).map((_) => WF_(_, K)).join(" ")
        },
        WF_ = (q, K) => {
            q = q.trim();
            let _ = K.loose ? $k[cv.XRANGELOOSE] : $k[cv.XRANGE];
            return q.replace(_, (z, Y, A, O, w, $) => {
                Wj("xRange", q, z, Y, A, O, w, $);
                let j = jk(A),
                    H = j || jk(O),
                    J = H || jk(w),
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
                return Wj("xRange return", z), z
            })
        },
        DF_ = (q, K) => {
            return Wj("replaceStars", q, K), q.trim().replace($k[cv.STAR], "")
        },
        ZF_ = (q, K) => {
            return Wj("replaceGTE0", q, K), q.trim().replace($k[K.includePrerelease ? cv.GTE0PRE : cv.GTE0], "")
        },
        fF_ = (q) => (K, _, z, Y, A, O, w, $, j, H, J, X) => {
            if (jk(z)) _ = "";
            else if (jk(Y)) _ = `>=${z}.0.0${q?"-0":""}`;
            else if (jk(A)) _ = `>=${z}.${Y}.0${q?"-0":""}`;
            else if (O) _ = `>=${_}`;
            else _ = `>=${_}${q?"-0":""}`;
            if (jk(j)) $ = "";
            else if (jk(H)) $ = `<${+j+1}.0.0-0`;
            else if (jk(J)) $ = `<${j}.${+H+1}.0-0`;
            else if (X) $ = `<=${j}.${H}.${J}-${X}`;
            else if (q) $ = `<${j}.${H}.${+J+1}-0`;
            else $ = `<=${$}`;
            return `${_} ${$}`.trim()
        },
        GF_ = (q, K, _) => {
            for (let z = 0; z < q.length; z++)
                if (!q[z].test(K)) return !1;
            if (K.prerelease.length && !_.includePrerelease) {
                for (let z = 0; z < q.length; z++) {
                    if (Wj(q[z].semver), q[z].semver === Tm1.ANY) continue;
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
// @from(Ln 192959, Col 4)
Tw4 = p((Ozw, vw4) => {
    var vF_ = vm1(),
        TF_ = (q, K, _) => {
            try {
                K = new vF_(K, _)
            } catch (z) {
                return !1
            }
            return K.test(q)
        };
    vw4.exports = TF_
})
// @from(Ln 192971, Col 4)
Vm1 = p((wzw, VF_) => {
    VF_.exports = {
        name: "sharp",
        description: "High performance Node.js image processing, the fastest module to resize JPEG, PNG, WebP, GIF, AVIF and TIFF images",
        version: "0.34.5",
        author: "Lovell Fuller <npm@lovell.info>",
        homepage: "https://sharp.pixelplumbing.com",
        contributors: ["Pierre Inglebert <pierre.inglebert@gmail.com>", "Jonathan Ong <jonathanrichardong@gmail.com>", "Chanon Sajjamanochai <chanon.s@gmail.com>", "Juliano Julio <julianojulio@gmail.com>", "Daniel Gasienica <daniel@gasienica.ch>", "Julian Walker <julian@fiftythree.com>", "Amit Pitaru <pitaru.amit@gmail.com>", "Brandon Aaron <hello.brandon@aaron.sh>", "Andreas Lind <andreas@one.com>", "Maurus Cuelenaere <mcuelenaere@gmail.com>", "Linus Unnebäck <linus@folkdatorn.se>", "Victor Mateevitsi <mvictoras@gmail.com>", "Alaric Holloway <alaric.holloway@gmail.com>", "Bernhard K. Weisshuhn <bkw@codingforce.com>", "Chris Riley <criley@primedia.com>", "David Carley <dacarley@gmail.com>", "John Tobin <john@limelightmobileinc.com>", "Kenton Gray <kentongray@gmail.com>", "Felix Bünemann <Felix.Buenemann@gmail.com>", "Samy Al Zahrani <samyalzahrany@gmail.com>", "Chintan Thakkar <lemnisk8@gmail.com>", "F. Orlando Galashan <frulo@gmx.de>", "Kleis Auke Wolthuizen <info@kleisauke.nl>", "Matt Hirsch <mhirsch@media.mit.edu>", "Matthias Thoemmes <thoemmes@gmail.com>", "Patrick Paskaris <patrick@paskaris.gr>", "Jérémy Lal <kapouer@melix.org>", "Rahul Nanwani <r.nanwani@gmail.com>", "Alice Monday <alice0meta@gmail.com>", "Kristo Jorgenson <kristo.jorgenson@gmail.com>", "YvesBos <yves_bos@outlook.com>", "Guy Maliar <guy@tailorbrands.com>", "Nicolas Coden <nicolas@ncoden.fr>", "Matt Parrish <matt.r.parrish@gmail.com>", "Marcel Bretschneider <marcel.bretschneider@gmail.com>", "Matthew McEachen <matthew+github@mceachen.org>", "Jarda Kotěšovec <jarda.kotesovec@gmail.com>", "Kenric D'Souza <kenric.dsouza@gmail.com>", "Oleh Aleinyk <oleg.aleynik@gmail.com>", "Marcel Bretschneider <marcel.bretschneider@gmail.com>", "Andrea Bianco <andrea.bianco@unibas.ch>", "Rik Heywood <rik@rik.org>", "Thomas Parisot <hi@oncletom.io>", "Nathan Graves <nathanrgraves+github@gmail.com>", "Tom Lokhorst <tom@lokhorst.eu>", "Espen Hovlandsdal <espen@hovlandsdal.com>", "Sylvain Dumont <sylvain.dumont35@gmail.com>", "Alun Davies <alun.owain.davies@googlemail.com>", "Aidan Hoolachan <ajhoolachan21@gmail.com>", "Axel Eirola <axel.eirola@iki.fi>", "Freezy <freezy@xbmc.org>", "Daiz <taneli.vatanen@gmail.com>", "Julian Aubourg <j@ubourg.net>", "Keith Belovay <keith@picthrive.com>", "Michael B. Klein <mbklein@gmail.com>", "Jordan Prudhomme <jordan@raboland.fr>", "Ilya Ovdin <iovdin@gmail.com>", "Andargor <andargor@yahoo.com>", "Paul Neave <paul.neave@gmail.com>", "Brendan Kennedy <brenwken@gmail.com>", "Brychan Bennett-Odlum <git@brychan.io>", "Edward Silverton <e.silverton@gmail.com>", "Roman Malieiev <aromaleev@gmail.com>", "Tomas Szabo <tomas.szabo@deftomat.com>", "Robert O'Rourke <robert@o-rourke.org>", "Guillermo Alfonso Varela Chouciño <guillevch@gmail.com>", "Christian Flintrup <chr@gigahost.dk>", "Manan Jadhav <manan@motionden.com>", "Leon Radley <leon@radley.se>", "alza54 <alza54@thiocod.in>", "Jacob Smith <jacob@frende.me>", "Michael Nutt <michael@nutt.im>", "Brad Parham <baparham@gmail.com>", "Taneli Vatanen <taneli.vatanen@gmail.com>", "Joris Dugué <zaruike10@gmail.com>", "Chris Banks <christopher.bradley.banks@gmail.com>", "Ompal Singh <ompal.hitm09@gmail.com>", "Brodan <christopher.hranj@gmail.com>", "Ankur Parihar <ankur.github@gmail.com>", "Brahim Ait elhaj <brahima@gmail.com>", "Mart Jansink <m.jansink@gmail.com>", "Lachlan Newman <lachnewman007@gmail.com>", "Dennis Beatty <dennis@dcbeatty.com>", "Ingvar Stepanyan <me@rreverser.com>", "Don Denton <don@happycollision.com>"],
        scripts: {
            build: "node install/build.js",
            install: "node install/check.js || npm run build",
            clean: "rm -rf src/build/ .nyc_output/ coverage/ test/fixtures/output.*",
            test: "npm run lint && npm run test-unit",
            lint: "npm run lint-cpp && npm run lint-js && npm run lint-types",
            "lint-cpp": "cpplint --quiet src/*.h src/*.cc",
            "lint-js": "biome lint",
            "lint-types": "tsd --files ./test/types/sharp.test-d.ts",
            "test-leak": "./test/leak/leak.sh",
            "test-unit": "node --experimental-test-coverage test/unit.mjs",
            "package-from-local-build": "node npm/from-local-build.js",
            "package-release-notes": "node npm/release-notes.js",
            "docs-build": "node docs/build.mjs",
            "docs-serve": "cd docs && npm start",
            "docs-publish": "cd docs && npm run build && npx firebase-tools deploy --project pixelplumbing --only hosting:pixelplumbing-sharp"
        },
        type: "commonjs",
        main: "lib/index.js",
        types: "lib/index.d.ts",
        files: ["install", "lib", "src/*.{cc,h,gyp}"],
        repository: {
            type: "git",
            url: "git://github.com/lovell/sharp.git"
        },
        keywords: ["jpeg", "png", "webp", "avif", "tiff", "gif", "svg", "jp2", "dzi", "image", "resize", "thumbnail", "crop", "embed", "libvips", "vips"],
        dependencies: {
            "@img/colour": "^1.0.0",
            "detect-libc": "^2.1.2",
            semver: "^7.7.3"
        },
        optionalDependencies: {
            "@img/sharp-darwin-arm64": "0.34.5",
            "@img/sharp-darwin-x64": "0.34.5",
            "@img/sharp-libvips-darwin-arm64": "1.2.4",
            "@img/sharp-libvips-darwin-x64": "1.2.4",
            "@img/sharp-libvips-linux-arm": "1.2.4",
            "@img/sharp-libvips-linux-arm64": "1.2.4",
            "@img/sharp-libvips-linux-ppc64": "1.2.4",
            "@img/sharp-libvips-linux-riscv64": "1.2.4",
            "@img/sharp-libvips-linux-s390x": "1.2.4",
            "@img/sharp-libvips-linux-x64": "1.2.4",
            "@img/sharp-libvips-linuxmusl-arm64": "1.2.4",
            "@img/sharp-libvips-linuxmusl-x64": "1.2.4",
            "@img/sharp-linux-arm": "0.34.5",
            "@img/sharp-linux-arm64": "0.34.5",
            "@img/sharp-linux-ppc64": "0.34.5",
            "@img/sharp-linux-riscv64": "0.34.5",
            "@img/sharp-linux-s390x": "0.34.5",
            "@img/sharp-linux-x64": "0.34.5",
            "@img/sharp-linuxmusl-arm64": "0.34.5",
            "@img/sharp-linuxmusl-x64": "0.34.5",
            "@img/sharp-wasm32": "0.34.5",
            "@img/sharp-win32-arm64": "0.34.5",
            "@img/sharp-win32-ia32": "0.34.5",
            "@img/sharp-win32-x64": "0.34.5"
        },
        devDependencies: {
            "@biomejs/biome": "^2.3.4",
            "@cpplint/cli": "^0.1.0",
            "@emnapi/runtime": "^1.7.0",
            "@img/sharp-libvips-dev": "1.2.4",
            "@img/sharp-libvips-dev-wasm32": "1.2.4",
            "@img/sharp-libvips-win32-arm64": "1.2.4",
            "@img/sharp-libvips-win32-ia32": "1.2.4",
            "@img/sharp-libvips-win32-x64": "1.2.4",
            "@types/node": "*",
            emnapi: "^1.7.0",
            "exif-reader": "^2.0.2",
            "extract-zip": "^2.0.1",
            icc: "^3.0.0",
            "jsdoc-to-markdown": "^9.1.3",
            "node-addon-api": "^8.5.0",
            "node-gyp": "^11.5.0",
            "tar-fs": "^3.1.1",
            tsd: "^0.33.0"
        },
        license: "Apache-2.0",
        engines: {
            node: "^18.17.0 || ^20.3.0 || >=21.0.0"
        },
        config: {
            libvips: ">=8.17.3"
        },
        funding: {
            url: "https://opencollective.com/libvips"
        }
    }
})
// @from(Ln 193068, Col 4)
Nm1 = p(($zw, Cw4) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var {
        spawnSync: Wy8
    } = d6("node:child_process"), {
        createHash: kF_
    } = d6("node:crypto"), Ew4 = cO4(), NF_ = Zm1(), EF_ = Tw4(), Vw4 = Ay8(), {
        config: yF_,
        engines: kw4,
        optionalDependencies: LF_
    } = Vm1(), hF_ = process.env.npm_package_config_libvips || yF_.libvips, yw4 = Ew4(hF_).version, RF_ = ["darwin-arm64", "darwin-x64", "linux-arm", "linux-arm64", "linux-ppc64", "linux-riscv64", "linux-s390x", "linux-x64", "linuxmusl-arm64", "linuxmusl-x64", "win32-arm64", "win32-ia32", "win32-x64"], Dy8 = {
        encoding: "utf8",
        shell: !0
    }, SF_ = (q) => {
        if (q instanceof Error) console.error(`sharp: Installation error: ${q.message}`);
        else console.log(`sharp: ${q}`)
    }, Lw4 = () => Vw4.isNonGlibcLinuxSync() ? Vw4.familySync() : "", CF_ = () => `${process.platform}${Lw4()}-${process.arch}`, HE6 = () => {
        if (hw4()) return "wasm32";
        let {
            npm_config_arch: q,
            npm_config_platform: K,
            npm_config_libc: _
        } = process.env, z = typeof _ === "string" ? _ : Lw4();
        return `${K||process.platform}${z}-${q||process.arch}`
    }, bF_ = () => {
        try {
            return d6(`@img/sharp-libvips-dev-${HE6()}/include`)
        } catch {
            try {
                return (() => {
                    throw new Error("Cannot require module " + "@img/sharp-libvips-dev/include");
                })()
            } catch {}
        }
        return ""
    }, IF_ = () => {
        try {
            return (() => {
                throw new Error("Cannot require module " + "@img/sharp-libvips-dev/cplusplus");
            })()
        } catch {}
        return ""
    }, xF_ = () => {
        try {
            return d6(`@img/sharp-libvips-dev-${HE6()}/lib`)
        } catch {
            try {
                return d6(`@img/sharp-libvips-${HE6()}/lib`)
            } catch {}
        }
        return ""
    }, uF_ = () => {
        if (process.release?.name === "node" && process.versions) {
            if (!EF_(process.versions.node, kw4.node)) return {
                found: process.versions.node,
                expected: kw4.node
            }
        }
    }, hw4 = () => {
        let {
            CC: q
        } = process.env;
        return Boolean(q?.endsWith("/emcc"))
    }, mF_ = () => {
        if (process.platform === "darwin" && process.arch === "x64") return (Wy8("sysctl sysctl.proc_translated", Dy8).stdout || "").trim() === "sysctl.proc_translated: 1";
        return !1
    }, Nw4 = (q) => kF_("sha512").update(q).digest("hex"), BF_ = () => {
        try {
            let q = Nw4(`imgsharp-libvips-${HE6()}`),
                K = Ew4(LF_[`@img/sharp-libvips-${HE6()}`], {
                    includePrerelease: !0
                }).version;
            return Nw4(`${q}npm:${K}`).slice(0, 10)
        } catch {}
        return ""
    }, pF_ = () => Wy8(`node-gyp rebuild --directory=src ${hw4()?"--nodedir=emscripten":""}`, {
        ...Dy8,
        stdio: "inherit"
    }).status, Rw4 = () => {
        if (process.platform !== "win32") return (Wy8("pkg-config --modversion vips-cpp", {
            ...Dy8,
            env: {
                ...process.env,
                PKG_CONFIG_PATH: Sw4()
            }
        }).stdout || "").trim();
        else return ""
    }, Sw4 = () => {
        if (process.platform !== "win32") return [(Wy8('which brew >/dev/null 2>&1 && brew environment --plain | grep PKG_CONFIG_LIBDIR | cut -d" " -f2', Dy8).stdout || "").trim(), process.env.PKG_CONFIG_PATH, "/usr/local/lib/pkgconfig", "/usr/lib/pkgconfig", "/usr/local/libdata/pkgconfig", "/usr/libdata/pkgconfig"].filter(Boolean).join(":");
        else return ""
    }, km1 = (q, K, _) => {
        if (_) _(`Detected ${K}, skipping search for globally-installed libvips`);
        return q
    }, FF_ = (q) => {
        if (Boolean(process.env.SHARP_IGNORE_GLOBAL_LIBVIPS) === !0) return km1(!1, "SHARP_IGNORE_GLOBAL_LIBVIPS", q);
        if (Boolean(process.env.SHARP_FORCE_GLOBAL_LIBVIPS) === !0) return km1(!0, "SHARP_FORCE_GLOBAL_LIBVIPS", q);
        if (mF_()) return km1(!1, "Rosetta", q);
        let K = Rw4();
        return !!K && NF_(K, yw4)
    };
    Cw4.exports = {
        minimumLibvipsVersion: yw4,
        prebuiltPlatforms: RF_,
        buildPlatformArch: HE6,
        buildSharpLibvipsIncludeDir: bF_,
        buildSharpLibvipsCPlusPlusDir: IF_,
        buildSharpLibvipsLibDir: xF_,
        isUnsupportedNodeRuntime: uF_,
        runtimePlatformArch: CF_,
        log: SF_,
        yarnLocator: BF_,
        spawnRebuild: pF_,
        globalLibvipsVersion: Rw4,
        pkgConfigPath: Sw4,
        useGlobalLibvips: FF_
    }
})
// @from(Ln 193188, Col 4)
Ns6 = p((Hzw, Iw4) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var {
        familySync: gF_,
        versionSync: UF_
    } = Ay8(), {
        runtimePlatformArch: QF_,
        isUnsupportedNodeRuntime: bw4,
        prebuiltPlatforms: dF_,
        minimumLibvipsVersion: cF_
    } = Nm1(), c$6 = QF_(), lF_ = [`../src/build/Release/sharp-${c$6}.node`, "../src/build/Release/sharp-wasm32.node", `@img/sharp-${c$6}/sharp.node`, "@img/sharp-wasm32/sharp.node"], Em1, JE6, ks6 = [];
    for (Em1 of lF_) try {
        JE6 = d6(Em1);
        break
    } catch (q) {
        ks6.push(q)
    }
    if (JE6 && Em1.startsWith("@img/sharp-linux-x64") && !JE6._isUsingX64V2()) {
        let q = Error("Prebuilt binaries for linux-x64 require v2 microarchitecture");
        q.code = "Unsupported CPU", ks6.push(q), JE6 = null
    }
    if (JE6) Iw4.exports = JE6;
    else {
        let [q, K, _] = ["linux", "darwin", "win32"].map((A) => c$6.startsWith(A)), z = [`Could not load the "sharp" module using the ${c$6} runtime`];
        ks6.forEach((A) => {
            if (A.code !== "MODULE_NOT_FOUND") z.push(`${A.code}: ${A.message}`)
        });
        let Y = ks6.map((A) => A.message).join(" ");
        if (z.push("Possible solutions:"), bw4()) {
            let {
                found: A,
                expected: O
            } = bw4();
            z.push("- Please upgrade Node.js:", `    Found ${A}`, `    Requires ${O}`)
        } else if (dF_.includes(c$6)) {
            let [A, O] = c$6.split("-"), w = A.endsWith("musl") ? " --libc=musl" : "";
            z.push("- Ensure optional dependencies can be installed:", "    npm install --include=optional sharp", "- Ensure your package manager supports multi-platform installation:", "    See https://sharp.pixelplumbing.com/install#cross-platform", "- Add platform-specific dependencies:", `    npm install --os=${A.replace("musl","")}${w} --cpu=${O} sharp`)
        } else z.push(`- Manually install libvips >= ${cF_}`, "- Add experimental WebAssembly-based dependencies:", "    npm install --cpu=wasm32 sharp", "    npm install @img/sharp-wasm32");
        if (q && /(symbol not found|CXXABI_)/i.test(Y)) try {
            let {
                config: A
            } = d6(`@img/sharp-libvips-${c$6}/package`), O = `${gF_()} ${UF_()}`, w = `${A.musl?"musl":"glibc"} ${A.musl||A.glibc}`;
            z.push("- Update your OS:", `    Found ${O}`, `    Requires ${w}`)
        } catch (A) {}
        if (q && /\/snap\/core[0-9]{2}/.test(Y)) z.push("- Remove the Node.js Snap, which does not support native modules", "    snap remove node");
        if (K && /Incompatible library version/.test(Y)) z.push("- Update Homebrew:", "    brew update && brew upgrade vips");
        if (ks6.some((A) => A.code === "ERR_DLOPEN_DISABLED")) z.push("- Run Node.js without using the --no-addons flag");
        if (_ && /The specified procedure could not be found/.test(Y)) z.push("- Using the canvas package on Windows?", "    See https://sharp.pixelplumbing.com/install#canvas-and-windows", "- Check for outdated versions of sharp in the dependency tree:", "    npm ls sharp");
        throw z.push("- Consult the installation documentation:", "    See https://sharp.pixelplumbing.com/install"), Error(z.join(`
`))
    }
})
// @from(Ln 193243, Col 4)
uw4 = p((Xzw, xw4) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var nF_ = d6("node:util"),
        ym1 = d6("node:stream"),
        iF_ = Ld();
    Ns6();
    var rF_ = nF_.debuglog("sharp"),
        oF_ = (q) => {
            l$6.queue.emit("change", q)
        },
        l$6 = function(q, K) {
            if (arguments.length === 1 && !iF_.defined(q)) throw Error("Invalid input");
            if (!(this instanceof l$6)) return new l$6(q, K);
            return ym1.Duplex.call(this), this.options = {
                topOffsetPre: -1,
                leftOffsetPre: -1,
                widthPre: -1,
                heightPre: -1,
                topOffsetPost: -1,
                leftOffsetPost: -1,
                widthPost: -1,
                heightPost: -1,
                width: -1,
                height: -1,
                canvas: "crop",
                position: 0,
                resizeBackground: [0, 0, 0, 255],
                angle: 0,
                rotationAngle: 0,
                rotationBackground: [0, 0, 0, 255],
                rotateBefore: !1,
                orientBefore: !1,
                flip: !1,
                flop: !1,
                extendTop: 0,
                extendBottom: 0,
                extendLeft: 0,
                extendRight: 0,
                extendBackground: [0, 0, 0, 255],
                extendWith: "background",
                withoutEnlargement: !1,
                withoutReduction: !1,
                affineMatrix: [],
                affineBackground: [0, 0, 0, 255],
                affineIdx: 0,
                affineIdy: 0,
                affineOdx: 0,
                affineOdy: 0,
                affineInterpolator: this.constructor.interpolators.bilinear,
                kernel: "lanczos3",
                fastShrinkOnLoad: !0,
                tint: [-1, 0, 0, 0],
                flatten: !1,
                flattenBackground: [0, 0, 0],
                unflatten: !1,
                negate: !1,
                negateAlpha: !0,
                medianSize: 0,
                blurSigma: 0,
                precision: "integer",
                minAmpl: 0.2,
                sharpenSigma: 0,
                sharpenM1: 1,
                sharpenM2: 2,
                sharpenX1: 2,
                sharpenY2: 10,
                sharpenY3: 20,
                threshold: 0,
                thresholdGrayscale: !0,
                trimBackground: [],
                trimThreshold: -1,
                trimLineArt: !1,
                dilateWidth: 0,
                erodeWidth: 0,
                gamma: 0,
                gammaOut: 0,
                greyscale: !1,
                normalise: !1,
                normaliseLower: 1,
                normaliseUpper: 99,
                claheWidth: 0,
                claheHeight: 0,
                claheMaxSlope: 3,
                brightness: 1,
                saturation: 1,
                hue: 0,
                lightness: 0,
                booleanBufferIn: null,
                booleanFileIn: "",
                joinChannelIn: [],
                extractChannel: -1,
                removeAlpha: !1,
                ensureAlpha: -1,
                colourspace: "srgb",
                colourspacePipeline: "last",
                composite: [],
                fileOut: "",
                formatOut: "input",
                streamOut: !1,
                keepMetadata: 0,
                withMetadataOrientation: -1,
                withMetadataDensity: 0,
                withIccProfile: "",
                withExif: {},
                withExifMerge: !0,
                withXmp: "",
                resolveWithObject: !1,
                loop: -1,
                delay: [],
                jpegQuality: 80,
                jpegProgressive: !1,
                jpegChromaSubsampling: "4:2:0",
                jpegTrellisQuantisation: !1,
                jpegOvershootDeringing: !1,
                jpegOptimiseScans: !1,
                jpegOptimiseCoding: !0,
                jpegQuantisationTable: 0,
                pngProgressive: !1,
                pngCompressionLevel: 6,
                pngAdaptiveFiltering: !1,
                pngPalette: !1,
                pngQuality: 100,
                pngEffort: 7,
                pngBitdepth: 8,
                pngDither: 1,
                jp2Quality: 80,
                jp2TileHeight: 512,
                jp2TileWidth: 512,
                jp2Lossless: !1,
                jp2ChromaSubsampling: "4:4:4",
                webpQuality: 80,
                webpAlphaQuality: 100,
                webpLossless: !1,
                webpNearLossless: !1,
                webpSmartSubsample: !1,
                webpSmartDeblock: !1,
                webpPreset: "default",
                webpEffort: 4,
                webpMinSize: !1,
                webpMixed: !1,
                gifBitdepth: 8,
                gifEffort: 7,
                gifDither: 1,
                gifInterFrameMaxError: 0,
                gifInterPaletteMaxError: 3,
                gifKeepDuplicateFrames: !1,
                gifReuse: !0,
                gifProgressive: !1,
                tiffQuality: 80,
                tiffCompression: "jpeg",
                tiffBigtiff: !1,
                tiffPredictor: "horizontal",
                tiffPyramid: !1,
                tiffMiniswhite: !1,
                tiffBitdepth: 8,
                tiffTile: !1,
                tiffTileHeight: 256,
                tiffTileWidth: 256,
                tiffXres: 1,
                tiffYres: 1,
                tiffResolutionUnit: "inch",
                heifQuality: 50,
                heifLossless: !1,
                heifCompression: "av1",
                heifEffort: 4,
                heifChromaSubsampling: "4:4:4",
                heifBitdepth: 8,
                jxlDistance: 1,
                jxlDecodingTier: 0,
                jxlEffort: 7,
                jxlLossless: !1,
                rawDepth: "uchar",
                tileSize: 256,
                tileOverlap: 0,
                tileContainer: "fs",
                tileLayout: "dz",
                tileFormat: "last",
                tileDepth: "last",
                tileAngle: 0,
                tileSkipBlanks: -1,
                tileBackground: [255, 255, 255, 255],
                tileCentre: !1,
                tileId: "https://example.com/iiif",
                tileBasename: "",
                timeoutSeconds: 0,
                linearA: [],
                linearB: [],
                pdfBackground: [255, 255, 255, 255],
                debuglog: (_) => {
                    this.emit("warning", _), rF_(_)
                },
                queueListener: oF_
            }, this.options.input = this._createInputDescriptor(q, K, {
                allowStream: !0
            }), this
        };
    Object.setPrototypeOf(l$6.prototype, ym1.Duplex.prototype);
    Object.setPrototypeOf(l$6, ym1.Duplex);

    function aF_() {
        let q = this.constructor.call(),
            {
                debuglog: K,
                queueListener: _,
                ...z
            } = this.options;
        if (q.options = structuredClone(z), q.options.debuglog = K, q.options.queueListener = _, this._isStreamInput()) this.on("finish", () => {
            this._flattenBufferIn(), q.options.input.buffer = this.options.input.buffer, q.emit("finish")
        });
        return q
    }
    Object.assign(l$6.prototype, {
        clone: aF_
    });
    xw4.exports = l$6
})
// @from(Ln 193462, Col 4)
pw4 = p((Mzw, Bw4) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var k1 = Ld(),
        F46 = Ns6(),
        sF_ = {
            left: "low",
            top: "low",
            low: "low",
            center: "centre",
            centre: "centre",
            right: "high",
            bottom: "high",
            high: "high"
        },
        tF_ = ["failOn", "limitInputPixels", "unlimited", "animated", "autoOrient", "density", "ignoreIcc", "page", "pages", "sequentialRead", "jp2", "openSlide", "pdf", "raw", "svg", "tiff", "failOnError", "openSlideLevel", "pdfBackground", "tiffSubifd"];

    function mw4(q) {
        let K = tF_.filter((_) => k1.defined(q[_])).map((_) => [_, q[_]]);
        return K.length ? Object.fromEntries(K) : void 0
    }

    function eF_(q, K, _) {
        let z = {
            autoOrient: !1,
            failOn: "warning",
            limitInputPixels: 268402689,
            ignoreIcc: !1,
            unlimited: !1,
            sequentialRead: !0
        };
        if (k1.string(q)) z.file = q;
        else if (k1.buffer(q)) {
            if (q.length === 0) throw Error("Input Buffer is empty");
            z.buffer = q
        } else if (k1.arrayBuffer(q)) {
            if (q.byteLength === 0) throw Error("Input bit Array is empty");
            z.buffer = Buffer.from(q, 0, q.byteLength)
        } else if (k1.typedArray(q)) {
            if (q.length === 0) throw Error("Input Bit Array is empty");
            z.buffer = Buffer.from(q.buffer, q.byteOffset, q.byteLength)
        } else if (k1.plainObject(q) && !k1.defined(K)) {
            if (K = q, mw4(K)) z.buffer = []
        } else if (!k1.defined(q) && !k1.defined(K) && k1.object(_) && _.allowStream) z.buffer = [];
        else if (Array.isArray(q))
            if (q.length > 1)
                if (!this.options.joining) this.options.joining = !0, this.options.join = q.map((Y) => this._createInputDescriptor(Y));
                else throw Error("Recursive join is unsupported");
        else throw Error("Expected at least two images to join");
        else throw Error(`Unsupported input '${q}' of type ${typeof q}${k1.defined(K)?` when also providing options of type ${typeof K}`:""}`);
        if (k1.object(K)) {
            if (k1.defined(K.failOnError))
                if (k1.bool(K.failOnError)) z.failOn = K.failOnError ? "warning" : "none";
                else throw k1.invalidParameterError("failOnError", "boolean", K.failOnError);
            if (k1.defined(K.failOn))
                if (k1.string(K.failOn) && k1.inArray(K.failOn, ["none", "truncated", "error", "warning"])) z.failOn = K.failOn;
                else throw k1.invalidParameterError("failOn", "one of: none, truncated, error, warning", K.failOn);
            if (k1.defined(K.autoOrient))
                if (k1.bool(K.autoOrient)) z.autoOrient = K.autoOrient;
                else throw k1.invalidParameterError("autoOrient", "boolean", K.autoOrient);
            if (k1.defined(K.density))
                if (k1.inRange(K.density, 1, 1e5)) z.density = K.density;
                else throw k1.invalidParameterError("density", "number between 1 and 100000", K.density);
            if (k1.defined(K.ignoreIcc))
                if (k1.bool(K.ignoreIcc)) z.ignoreIcc = K.ignoreIcc;
                else throw k1.invalidParameterError("ignoreIcc", "boolean", K.ignoreIcc);
            if (k1.defined(K.limitInputPixels))
                if (k1.bool(K.limitInputPixels)) z.limitInputPixels = K.limitInputPixels ? 268402689 : 0;
                else if (k1.integer(K.limitInputPixels) && k1.inRange(K.limitInputPixels, 0, Number.MAX_SAFE_INTEGER)) z.limitInputPixels = K.limitInputPixels;
            else throw k1.invalidParameterError("limitInputPixels", "positive integer", K.limitInputPixels);
            if (k1.defined(K.unlimited))
                if (k1.bool(K.unlimited)) z.unlimited = K.unlimited;
                else throw k1.invalidParameterError("unlimited", "boolean", K.unlimited);
            if (k1.defined(K.sequentialRead))
                if (k1.bool(K.sequentialRead)) z.sequentialRead = K.sequentialRead;
                else throw k1.invalidParameterError("sequentialRead", "boolean", K.sequentialRead);
            if (k1.defined(K.raw)) {
                if (k1.object(K.raw) && k1.integer(K.raw.width) && K.raw.width > 0 && k1.integer(K.raw.height) && K.raw.height > 0 && k1.integer(K.raw.channels) && k1.inRange(K.raw.channels, 1, 4)) switch (z.rawWidth = K.raw.width, z.rawHeight = K.raw.height, z.rawChannels = K.raw.channels, q.constructor) {
                    case Uint8Array:
                    case Uint8ClampedArray:
                        z.rawDepth = "uchar";
                        break;
                    case Int8Array:
                        z.rawDepth = "char";
                        break;
                    case Uint16Array:
                        z.rawDepth = "ushort";
                        break;
                    case Int16Array:
                        z.rawDepth = "short";
                        break;
                    case Uint32Array:
                        z.rawDepth = "uint";
                        break;
                    case Int32Array:
                        z.rawDepth = "int";
                        break;
                    case Float32Array:
                        z.rawDepth = "float";
                        break;
                    case Float64Array:
                        z.rawDepth = "double";
                        break;
                    default:
                        z.rawDepth = "uchar";
                        break
                } else throw Error("Expected width, height and channels for raw pixel input");
                if (z.rawPremultiplied = !1, k1.defined(K.raw.premultiplied))
                    if (k1.bool(K.raw.premultiplied)) z.rawPremultiplied = K.raw.premultiplied;
                    else throw k1.invalidParameterError("raw.premultiplied", "boolean", K.raw.premultiplied);
                if (z.rawPageHeight = 0, k1.defined(K.raw.pageHeight))
                    if (k1.integer(K.raw.pageHeight) && K.raw.pageHeight > 0 && K.raw.pageHeight <= K.raw.height) {
                        if (K.raw.height % K.raw.pageHeight !== 0) throw Error(`Expected raw.height ${K.raw.height} to be a multiple of raw.pageHeight ${K.raw.pageHeight}`);
                        z.rawPageHeight = K.raw.pageHeight
                    } else throw k1.invalidParameterError("raw.pageHeight", "positive integer", K.raw.pageHeight)
            }
            if (k1.defined(K.animated))
                if (k1.bool(K.animated)) z.pages = K.animated ? -1 : 1;
                else throw k1.invalidParameterError("animated", "boolean", K.animated);
            if (k1.defined(K.pages))
                if (k1.integer(K.pages) && k1.inRange(K.pages, -1, 1e5)) z.pages = K.pages;
                else throw k1.invalidParameterError("pages", "integer between -1 and 100000", K.pages);
            if (k1.defined(K.page))
                if (k1.integer(K.page) && k1.inRange(K.page, 0, 1e5)) z.page = K.page;
                else throw k1.invalidParameterError("page", "integer between 0 and 100000", K.page);
            if (k1.object(K.openSlide) && k1.defined(K.openSlide.level))
                if (k1.integer(K.openSlide.level) && k1.inRange(K.openSlide.level, 0, 256)) z.openSlideLevel = K.openSlide.level;
                else throw k1.invalidParameterError("openSlide.level", "integer between 0 and 256", K.openSlide.level);
            else if (k1.defined(K.level))
                if (k1.integer(K.level) && k1.inRange(K.level, 0, 256)) z.openSlideLevel = K.level;
                else throw k1.invalidParameterError("level", "integer between 0 and 256", K.level);
            if (k1.object(K.tiff) && k1.defined(K.tiff.subifd))
                if (k1.integer(K.tiff.subifd) && k1.inRange(K.tiff.subifd, -1, 1e5)) z.tiffSubifd = K.tiff.subifd;
                else throw k1.invalidParameterError("tiff.subifd", "integer between -1 and 100000", K.tiff.subifd);
            else if (k1.defined(K.subifd))
                if (k1.integer(K.subifd) && k1.inRange(K.subifd, -1, 1e5)) z.tiffSubifd = K.subifd;
                else throw k1.invalidParameterError("subifd", "integer between -1 and 100000", K.subifd);
            if (k1.object(K.svg)) {
                if (k1.defined(K.svg.stylesheet))
                    if (k1.string(K.svg.stylesheet)) z.svgStylesheet = K.svg.stylesheet;
                    else throw k1.invalidParameterError("svg.stylesheet", "string", K.svg.stylesheet);
                if (k1.defined(K.svg.highBitdepth))
                    if (k1.bool(K.svg.highBitdepth)) z.svgHighBitdepth = K.svg.highBitdepth;
                    else throw k1.invalidParameterError("svg.highBitdepth", "boolean", K.svg.highBitdepth)
            }
            if (k1.object(K.pdf) && k1.defined(K.pdf.background)) z.pdfBackground = this._getBackgroundColourOption(K.pdf.background);
            else if (k1.defined(K.pdfBackground)) z.pdfBackground = this._getBackgroundColourOption(K.pdfBackground);
            if (k1.object(K.jp2) && k1.defined(K.jp2.oneshot))
                if (k1.bool(K.jp2.oneshot)) z.jp2Oneshot = K.jp2.oneshot;
                else throw k1.invalidParameterError("jp2.oneshot", "boolean", K.jp2.oneshot);
            if (k1.defined(K.create))
                if (k1.object(K.create) && k1.integer(K.create.width) && K.create.width > 0 && k1.integer(K.create.height) && K.create.height > 0 && k1.integer(K.create.channels)) {
                    if (z.createWidth = K.create.width, z.createHeight = K.create.height, z.createChannels = K.create.channels, z.createPageHeight = 0, k1.defined(K.create.pageHeight))
                        if (k1.integer(K.create.pageHeight) && K.create.pageHeight > 0 && K.create.pageHeight <= K.create.height) {
                            if (K.create.height % K.create.pageHeight !== 0) throw Error(`Expected create.height ${K.create.height} to be a multiple of create.pageHeight ${K.create.pageHeight}`);
                            z.createPageHeight = K.create.pageHeight
                        } else throw k1.invalidParameterError("create.pageHeight", "positive integer", K.create.pageHeight);
                    if (k1.defined(K.create.noise)) {
                        if (!k1.object(K.create.noise)) throw Error("Expected noise to be an object");
                        if (K.create.noise.type !== "gaussian") throw Error("Only gaussian noise is supported at the moment");
                        if (z.createNoiseType = K.create.noise.type, !k1.inRange(K.create.channels, 1, 4)) throw k1.invalidParameterError("create.channels", "number between 1 and 4", K.create.channels);
                        if (z.createNoiseMean = 128, k1.defined(K.create.noise.mean))
                            if (k1.number(K.create.noise.mean) && k1.inRange(K.create.noise.mean, 0, 1e4)) z.createNoiseMean = K.create.noise.mean;
                            else throw k1.invalidParameterError("create.noise.mean", "number between 0 and 10000", K.create.noise.mean);
                        if (z.createNoiseSigma = 30, k1.defined(K.create.noise.sigma))
                            if (k1.number(K.create.noise.sigma) && k1.inRange(K.create.noise.sigma, 0, 1e4)) z.createNoiseSigma = K.create.noise.sigma;
                            else throw k1.invalidParameterError("create.noise.sigma", "number between 0 and 10000", K.create.noise.sigma)
                    } else if (k1.defined(K.create.background)) {
                        if (!k1.inRange(K.create.channels, 3, 4)) throw k1.invalidParameterError("create.channels", "number between 3 and 4", K.create.channels);
                        z.createBackground = this._getBackgroundColourOption(K.create.background)
                    } else throw Error("Expected valid noise or background to create a new input image");
                    delete z.buffer
                } else throw Error("Expected valid width, height and channels to create a new input image");
            if (k1.defined(K.text))
                if (k1.object(K.text) && k1.string(K.text.text)) {
                    if (z.textValue = K.text.text, k1.defined(K.text.height) && k1.defined(K.text.dpi)) throw Error("Expected only one of dpi or height");
                    if (k1.defined(K.text.font))
                        if (k1.string(K.text.font)) z.textFont = K.text.font;
                        else throw k1.invalidParameterError("text.font", "string", K.text.font);
                    if (k1.defined(K.text.fontfile))
                        if (k1.string(K.text.fontfile)) z.textFontfile = K.text.fontfile;
                        else throw k1.invalidParameterError("text.fontfile", "string", K.text.fontfile);
                    if (k1.defined(K.text.width))
                        if (k1.integer(K.text.width) && K.text.width > 0) z.textWidth = K.text.width;
                        else throw k1.invalidParameterError("text.width", "positive integer", K.text.width);
                    if (k1.defined(K.text.height))
                        if (k1.integer(K.text.height) && K.text.height > 0) z.textHeight = K.text.height;
                        else throw k1.invalidParameterError("text.height", "positive integer", K.text.height);
                    if (k1.defined(K.text.align))
                        if (k1.string(K.text.align) && k1.string(this.constructor.align[K.text.align])) z.textAlign = this.constructor.align[K.text.align];
                        else throw k1.invalidParameterError("text.align", "valid alignment", K.text.align);
                    if (k1.defined(K.text.justify))
                        if (k1.bool(K.text.justify)) z.textJustify = K.text.justify;
                        else throw k1.invalidParameterError("text.justify", "boolean", K.text.justify);
                    if (k1.defined(K.text.dpi))
                        if (k1.integer(K.text.dpi) && k1.inRange(K.text.dpi, 1, 1e6)) z.textDpi = K.text.dpi;
                        else throw k1.invalidParameterError("text.dpi", "integer between 1 and 1000000", K.text.dpi);
                    if (k1.defined(K.text.rgba))
                        if (k1.bool(K.text.rgba)) z.textRgba = K.text.rgba;
                        else throw k1.invalidParameterError("text.rgba", "bool", K.text.rgba);
                    if (k1.defined(K.text.spacing))
                        if (k1.integer(K.text.spacing) && k1.inRange(K.text.spacing, -1e6, 1e6)) z.textSpacing = K.text.spacing;
                        else throw k1.invalidParameterError("text.spacing", "integer between -1000000 and 1000000", K.text.spacing);
                    if (k1.defined(K.text.wrap))
                        if (k1.string(K.text.wrap) && k1.inArray(K.text.wrap, ["word", "char", "word-char", "none"])) z.textWrap = K.text.wrap;
                        else throw k1.invalidParameterError("text.wrap", "one of: word, char, word-char, none", K.text.wrap);
                    delete z.buffer
                } else throw Error("Expected a valid string to create an image with text.");
            if (k1.defined(K.join))
                if (k1.defined(this.options.join)) {
                    if (k1.defined(K.join.animated))
                        if (k1.bool(K.join.animated)) z.joinAnimated = K.join.animated;
                        else throw k1.invalidParameterError("join.animated", "boolean", K.join.animated);
                    if (k1.defined(K.join.across))
                        if (k1.integer(K.join.across) && k1.inRange(K.join.across, 1, 1e6)) z.joinAcross = K.join.across;
                        else throw k1.invalidParameterError("join.across", "integer between 1 and 100000", K.join.across);
                    if (k1.defined(K.join.shim))
                        if (k1.integer(K.join.shim) && k1.inRange(K.join.shim, 0, 1e6)) z.joinShim = K.join.shim;
                        else throw k1.invalidParameterError("join.shim", "integer between 0 and 100000", K.join.shim);
                    if (k1.defined(K.join.background)) z.joinBackground = this._getBackgroundColourOption(K.join.background);
                    if (k1.defined(K.join.halign))
                        if (k1.string(K.join.halign) && k1.string(this.constructor.align[K.join.halign])) z.joinHalign = this.constructor.align[K.join.halign];
                        else throw k1.invalidParameterError("join.halign", "valid alignment", K.join.halign);
                    if (k1.defined(K.join.valign))
                        if (k1.string(K.join.valign) && k1.string(this.constructor.align[K.join.valign])) z.joinValign = this.constructor.align[K.join.valign];
                        else throw k1.invalidParameterError("join.valign", "valid alignment", K.join.valign)
                } else throw Error("Expected input to be an array of images to join")
        } else if (k1.defined(K)) throw Error(`Invalid input options ${K}`);
        return z
    }

    function qg_(q, K, _) {
        if (Array.isArray(this.options.input.buffer))
            if (k1.buffer(q)) {
                if (this.options.input.buffer.length === 0) this.on("finish", () => {
                    this.streamInFinished = !0
                });
                this.options.input.buffer.push(q), _()
            } else _(Error("Non-Buffer data on Writable Stream"));
        else _(Error("Unexpected data on Writable Stream"))
    }

    function Kg_() {
        if (this._isStreamInput()) this.options.input.buffer = Buffer.concat(this.options.input.buffer)
    }

    function _g_() {
        return Array.isArray(this.options.input.buffer)
    }

    function zg_(q) {
        let K = Error();
        if (k1.fn(q)) {
            if (this._isStreamInput()) this.on("finish", () => {
                this._flattenBufferIn(), F46.metadata(this.options, (_, z) => {
                    if (_) q(k1.nativeError(_, K));
                    else q(null, z)
                })
            });
            else F46.metadata(this.options, (_, z) => {
                if (_) q(k1.nativeError(_, K));
                else q(null, z)
            });
            return this
        } else if (this._isStreamInput()) return new Promise((_, z) => {
            let Y = () => {
                this._flattenBufferIn(), F46.metadata(this.options, (A, O) => {
                    if (A) z(k1.nativeError(A, K));
                    else _(O)
                })
            };
            if (this.writableFinished) Y();
            else this.once("finish", Y)
        });
        else return new Promise((_, z) => {
            F46.metadata(this.options, (Y, A) => {
                if (Y) z(k1.nativeError(Y, K));
                else _(A)
            })
        })
    }

    function Yg_(q) {
        let K = Error();
        if (k1.fn(q)) {
            if (this._isStreamInput()) this.on("finish", () => {
                this._flattenBufferIn(), F46.stats(this.options, (_, z) => {
                    if (_) q(k1.nativeError(_, K));
                    else q(null, z)
                })
            });
            else F46.stats(this.options, (_, z) => {
                if (_) q(k1.nativeError(_, K));
                else q(null, z)
            });
            return this
        } else if (this._isStreamInput()) return new Promise((_, z) => {
            this.on("finish", function() {
                this._flattenBufferIn(), F46.stats(this.options, (Y, A) => {
                    if (Y) z(k1.nativeError(Y, K));
                    else _(A)
                })
            })
        });
        else return new Promise((_, z) => {
            F46.stats(this.options, (Y, A) => {
                if (Y) z(k1.nativeError(Y, K));
                else _(A)
            })
        })
    }
    Bw4.exports = (q) => {
        Object.assign(q.prototype, {
            _inputOptionsFromObject: mw4,
            _createInputDescriptor: eF_,
            _write: qg_,
            _flattenBufferIn: Kg_,
            _isStreamInput: _g_,
            metadata: zg_,
            stats: Yg_
        }), q.align = sF_
    }
})
// @from(Ln 193787, Col 4)
cw4 = p((Pzw, dw4) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var _5 = Ld(),
        gw4 = {
            center: 0,
            centre: 0,
            north: 1,
            east: 2,
            south: 3,
            west: 4,
            northeast: 5,
            southeast: 6,
            southwest: 7,
            northwest: 8
        },
        Uw4 = {
            top: 1,
            right: 2,
            bottom: 3,
            left: 4,
            "right top": 5,
            "right bottom": 6,
            "left bottom": 7,
            "left top": 8
        },
        Fw4 = {
            background: "background",
            copy: "copy",
            repeat: "repeat",
            mirror: "mirror"
        },
        Qw4 = {
            entropy: 16,
            attention: 17
        },
        Lm1 = {
            nearest: "nearest",
            linear: "linear",
            cubic: "cubic",
            mitchell: "mitchell",
            lanczos2: "lanczos2",
            lanczos3: "lanczos3",
            mks2013: "mks2013",
            mks2021: "mks2021"
        },
        Ag_ = {
            contain: "contain",
            cover: "cover",
            fill: "fill",
            inside: "inside",
            outside: "outside"
        },
        Og_ = {
            contain: "embed",
            cover: "crop",
            fill: "ignore_aspect",
            inside: "max",
            outside: "min"
        };

    function hm1(q) {
        return q.angle % 360 !== 0 || q.rotationAngle !== 0
    }

    function Zy8(q) {
        return q.width !== -1 || q.height !== -1
    }

    function wg_(q, K, _) {
        if (Zy8(this.options)) this.options.debuglog("ignoring previous resize options");
        if (this.options.widthPost !== -1) this.options.debuglog("operation order will be: extract, resize, extract");
        if (_5.defined(q))
            if (_5.object(q) && !_5.defined(_)) _ = q;
            else if (_5.integer(q) && q > 0) this.options.width = q;
        else throw _5.invalidParameterError("width", "positive integer", q);
        else this.options.width = -1;
        if (_5.defined(K))
            if (_5.integer(K) && K > 0) this.options.height = K;
            else throw _5.invalidParameterError("height", "positive integer", K);
        else this.options.height = -1;
        if (_5.object(_)) {
            if (_5.defined(_.width))
                if (_5.integer(_.width) && _.width > 0) this.options.width = _.width;
                else throw _5.invalidParameterError("width", "positive integer", _.width);
            if (_5.defined(_.height))
                if (_5.integer(_.height) && _.height > 0) this.options.height = _.height;
                else throw _5.invalidParameterError("height", "positive integer", _.height);
            if (_5.defined(_.fit)) {
                let z = Og_[_.fit];
                if (_5.string(z)) this.options.canvas = z;
                else throw _5.invalidParameterError("fit", "valid fit", _.fit)
            }
            if (_5.defined(_.position)) {
                let z = _5.integer(_.position) ? _.position : Qw4[_.position] || Uw4[_.position] || gw4[_.position];
                if (_5.integer(z) && (_5.inRange(z, 0, 8) || _5.inRange(z, 16, 17))) this.options.position = z;
                else throw _5.invalidParameterError("position", "valid position/gravity/strategy", _.position)
            }
            if (this._setBackgroundColourOption("resizeBackground", _.background), _5.defined(_.kernel))
                if (_5.string(Lm1[_.kernel])) this.options.kernel = Lm1[_.kernel];
                else throw _5.invalidParameterError("kernel", "valid kernel name", _.kernel);
            if (_5.defined(_.withoutEnlargement)) this._setBooleanOption("withoutEnlargement", _.withoutEnlargement);
            if (_5.defined(_.withoutReduction)) this._setBooleanOption("withoutReduction", _.withoutReduction);
            if (_5.defined(_.fastShrinkOnLoad)) this._setBooleanOption("fastShrinkOnLoad", _.fastShrinkOnLoad)
        }
        if (hm1(this.options) && Zy8(this.options)) this.options.rotateBefore = !0;
        return this
    }

    function $g_(q) {
        if (_5.integer(q) && q > 0) this.options.extendTop = q, this.options.extendBottom = q, this.options.extendLeft = q, this.options.extendRight = q;
        else if (_5.object(q)) {
            if (_5.defined(q.top))
                if (_5.integer(q.top) && q.top >= 0) this.options.extendTop = q.top;
                else throw _5.invalidParameterError("top", "positive integer", q.top);
            if (_5.defined(q.bottom))
                if (_5.integer(q.bottom) && q.bottom >= 0) this.options.extendBottom = q.bottom;
                else throw _5.invalidParameterError("bottom", "positive integer", q.bottom);
            if (_5.defined(q.left))
                if (_5.integer(q.left) && q.left >= 0) this.options.extendLeft = q.left;
                else throw _5.invalidParameterError("left", "positive integer", q.left);
            if (_5.defined(q.right))
                if (_5.integer(q.right) && q.right >= 0) this.options.extendRight = q.right;
                else throw _5.invalidParameterError("right", "positive integer", q.right);
            if (this._setBackgroundColourOption("extendBackground", q.background), _5.defined(q.extendWith))
                if (_5.string(Fw4[q.extendWith])) this.options.extendWith = Fw4[q.extendWith];
                else throw _5.invalidParameterError("extendWith", "one of: background, copy, repeat, mirror", q.extendWith)
        } else throw _5.invalidParameterError("extend", "integer or object", q);
        return this
    }

    function jg_(q) {
        let K = Zy8(this.options) || this.options.widthPre !== -1 ? "Post" : "Pre";
        if (this.options[`width${K}`] !== -1) this.options.debuglog("ignoring previous extract options");
        if (["left", "top", "width", "height"].forEach(function(_) {
                let z = q[_];
                if (_5.integer(z) && z >= 0) this.options[_ + (_ === "left" || _ === "top" ? "Offset" : "") + K] = z;
                else throw _5.invalidParameterError(_, "integer", z)
            }, this), hm1(this.options) && !Zy8(this.options)) {
            if (this.options.widthPre === -1 || this.options.widthPost === -1) this.options.rotateBefore = !0
        }
        if (this.options.input.autoOrient) this.options.orientBefore = !0;
        return this
    }

    function Hg_(q) {
        if (this.options.trimThreshold = 10, _5.defined(q))
            if (_5.object(q)) {
                if (_5.defined(q.background)) this._setBackgroundColourOption("trimBackground", q.background);
                if (_5.defined(q.threshold))
                    if (_5.number(q.threshold) && q.threshold >= 0) this.options.trimThreshold = q.threshold;
                    else throw _5.invalidParameterError("threshold", "positive number", q.threshold);
                if (_5.defined(q.lineArt)) this._setBooleanOption("trimLineArt", q.lineArt)
            } else throw _5.invalidParameterError("trim", "object", q);
        if (hm1(this.options)) this.options.rotateBefore = !0;
        return this
    }
    dw4.exports = (q) => {
        Object.assign(q.prototype, {
            resize: wg_,
            extend: $g_,
            extract: jg_,
            trim: Hg_
        }), q.gravity = gw4, q.strategy = Qw4, q.kernel = Lm1, q.fit = Ag_, q.position = Uw4
    }
})
// @from(Ln 193955, Col 4)
nw4 = p((Wzw, lw4) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var _2 = Ld(),
        Rm1 = {
            clear: "clear",
            source: "source",
            over: "over",
            in: "in",
            out: "out",
            atop: "atop",
            dest: "dest",
            "dest-over": "dest-over",
            "dest-in": "dest-in",
            "dest-out": "dest-out",
            "dest-atop": "dest-atop",
            xor: "xor",
            add: "add",
            saturate: "saturate",
            multiply: "multiply",
            screen: "screen",
            overlay: "overlay",
            darken: "darken",
            lighten: "lighten",
            "colour-dodge": "colour-dodge",
            "color-dodge": "colour-dodge",
            "colour-burn": "colour-burn",
            "color-burn": "colour-burn",
            "hard-light": "hard-light",
            "soft-light": "soft-light",
            difference: "difference",
            exclusion: "exclusion"
        };

    function Jg_(q) {
        if (!Array.isArray(q)) throw _2.invalidParameterError("images to composite", "array", q);
        return this.options.composite = q.map((K) => {
            if (!_2.object(K)) throw _2.invalidParameterError("image to composite", "object", K);
            let _ = this._inputOptionsFromObject(K),
                z = {
                    input: this._createInputDescriptor(K.input, _, {
                        allowStream: !1
                    }),
                    blend: "over",
                    tile: !1,
                    left: 0,
                    top: 0,
                    hasOffset: !1,
                    gravity: 0,
                    premultiplied: !1
                };
            if (_2.defined(K.blend))
                if (_2.string(Rm1[K.blend])) z.blend = Rm1[K.blend];
                else throw _2.invalidParameterError("blend", "valid blend name", K.blend);
            if (_2.defined(K.tile))
                if (_2.bool(K.tile)) z.tile = K.tile;
                else throw _2.invalidParameterError("tile", "boolean", K.tile);
            if (_2.defined(K.left))
                if (_2.integer(K.left)) z.left = K.left;
                else throw _2.invalidParameterError("left", "integer", K.left);
            if (_2.defined(K.top))
                if (_2.integer(K.top)) z.top = K.top;
                else throw _2.invalidParameterError("top", "integer", K.top);
            if (_2.defined(K.top) !== _2.defined(K.left)) throw Error("Expected both left and top to be set");
            else z.hasOffset = _2.integer(K.top) && _2.integer(K.left);
            if (_2.defined(K.gravity))
                if (_2.integer(K.gravity) && _2.inRange(K.gravity, 0, 8)) z.gravity = K.gravity;
                else if (_2.string(K.gravity) && _2.integer(this.constructor.gravity[K.gravity])) z.gravity = this.constructor.gravity[K.gravity];
            else throw _2.invalidParameterError("gravity", "valid gravity", K.gravity);
            if (_2.defined(K.premultiplied))
                if (_2.bool(K.premultiplied)) z.premultiplied = K.premultiplied;
                else throw _2.invalidParameterError("premultiplied", "boolean", K.premultiplied);
            return z
        }), this
    }
    lw4.exports = (q) => {
        q.prototype.composite = Jg_, q.blend = Rm1
    }
})