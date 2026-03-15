
// @from(Ln 223127, Col 4)
a06 = x((rB2, q74) => {
    var SX1 = bF6(),
        {
            MAX_LENGTH: A74,
            MAX_SAFE_INTEGER: CX1
        } = RX1(),
        {
            safeRe: IX1,
            t: bX1
        } = xF6(),
        $k9 = hX1(),
        {
            compareIdentifiers: aT8
        } = eA4();
    class TI {
        constructor(A, q) {
            if (q = $k9(q), A instanceof TI)
                if (A.loose === !!q.loose && A.includePrerelease === !!q.includePrerelease) return A;
                else A = A.version;
            else if (typeof A !== "string") throw TypeError(`Invalid version. Must be a string. Got type "${typeof A}".`);
            if (A.length > A74) throw TypeError(`version is longer than ${A74} characters`);
            SX1("SemVer", A, q), this.options = q, this.loose = !!q.loose, this.includePrerelease = !!q.includePrerelease;
            let K = A.trim().match(q.loose ? IX1[bX1.LOOSE] : IX1[bX1.FULL]);
            if (!K) throw TypeError(`Invalid Version: ${A}`);
            if (this.raw = A, this.major = +K[1], this.minor = +K[2], this.patch = +K[3], this.major > CX1 || this.major < 0) throw TypeError("Invalid major version");
            if (this.minor > CX1 || this.minor < 0) throw TypeError("Invalid minor version");
            if (this.patch > CX1 || this.patch < 0) throw TypeError("Invalid patch version");
            if (!K[4]) this.prerelease = [];
            else this.prerelease = K[4].split(".").map((Y) => {
                if (/^[0-9]+$/.test(Y)) {
                    let z = +Y;
                    if (z >= 0 && z < CX1) return z
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
            if (SX1("SemVer.compare", this.version, this.options, A), !(A instanceof TI)) {
                if (typeof A === "string" && A === this.version) return 0;
                A = new TI(A, this.options)
            }
            if (A.version === this.version) return 0;
            return this.compareMain(A) || this.comparePre(A)
        }
        compareMain(A) {
            if (!(A instanceof TI)) A = new TI(A, this.options);
            if (this.major < A.major) return -1;
            if (this.major > A.major) return 1;
            if (this.minor < A.minor) return -1;
            if (this.minor > A.minor) return 1;
            if (this.patch < A.patch) return -1;
            if (this.patch > A.patch) return 1;
            return 0
        }
        comparePre(A) {
            if (!(A instanceof TI)) A = new TI(A, this.options);
            if (this.prerelease.length && !A.prerelease.length) return -1;
            else if (!this.prerelease.length && A.prerelease.length) return 1;
            else if (!this.prerelease.length && !A.prerelease.length) return 0;
            let q = 0;
            do {
                let K = this.prerelease[q],
                    Y = A.prerelease[q];
                if (SX1("prerelease compare", q, K, Y), K === void 0 && Y === void 0) return 0;
                else if (Y === void 0) return 1;
                else if (K === void 0) return -1;
                else if (K === Y) continue;
                else return aT8(K, Y)
            } while (++q)
        }
        compareBuild(A) {
            if (!(A instanceof TI)) A = new TI(A, this.options);
            let q = 0;
            do {
                let K = this.build[q],
                    Y = A.build[q];
                if (SX1("build compare", q, K, Y), K === void 0 && Y === void 0) return 0;
                else if (Y === void 0) return 1;
                else if (K === void 0) return -1;
                else if (K === Y) continue;
                else return aT8(K, Y)
            } while (++q)
        }
        inc(A, q, K) {
            if (A.startsWith("pre")) {
                if (!q && K === !1) throw Error("invalid increment argument: identifier is empty");
                if (q) {
                    let Y = `-${q}`.match(this.options.loose ? IX1[bX1.PRERELEASELOOSE] : IX1[bX1.PRERELEASE]);
                    if (!Y || Y[1] !== q) throw Error(`invalid identifier: ${q}`)
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
                        if (aT8(this.prerelease[0], q) === 0) {
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
    q74.exports = TI
})
// @from(Ln 223286, Col 4)
z74 = x((oB2, Y74) => {
    var K74 = a06(),
        Hk9 = (A, q, K = !1) => {
            if (A instanceof K74) return A;
            try {
                return new K74(A, q)
            } catch (Y) {
                if (!K) return null;
                throw Y
            }
        };
    Y74.exports = Hk9
})
// @from(Ln 223299, Col 4)
w74 = x((aB2, _74) => {
    var jk9 = a06(),
        Jk9 = z74(),
        {
            safeRe: xX1,
            t: uX1
        } = xF6(),
        Mk9 = (A, q) => {
            if (A instanceof jk9) return A;
            if (typeof A === "number") A = String(A);
            if (typeof A !== "string") return null;
            q = q || {};
            let K = null;
            if (!q.rtl) K = A.match(q.includePrerelease ? xX1[uX1.COERCEFULL] : xX1[uX1.COERCE]);
            else {
                let $ = q.includePrerelease ? xX1[uX1.COERCERTLFULL] : xX1[uX1.COERCERTL],
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
            return Jk9(`${Y}.${z}.${_}${w}${O}`, q)
        };
    _74.exports = Mk9
})
// @from(Ln 223332, Col 4)
Z36 = x((sB2, $74) => {
    var O74 = a06(),
        Dk9 = (A, q, K) => new O74(A, K).compare(new O74(q, K));
    $74.exports = Dk9
})
// @from(Ln 223337, Col 4)
sT8 = x((tB2, H74) => {
    var Xk9 = Z36(),
        Pk9 = (A, q, K) => Xk9(A, q, K) >= 0;
    H74.exports = Pk9
})
// @from(Ln 223342, Col 4)
M74 = x((eB2, J74) => {
    class j74 {
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
    J74.exports = j74
})
// @from(Ln 223368, Col 4)
X74 = x((Ag2, D74) => {
    var Wk9 = Z36(),
        Zk9 = (A, q, K) => Wk9(A, q, K) === 0;
    D74.exports = Zk9
})
// @from(Ln 223373, Col 4)
W74 = x((qg2, P74) => {
    var Gk9 = Z36(),
        fk9 = (A, q, K) => Gk9(A, q, K) !== 0;
    P74.exports = fk9
})
// @from(Ln 223378, Col 4)
G74 = x((Kg2, Z74) => {
    var Tk9 = Z36(),
        vk9 = (A, q, K) => Tk9(A, q, K) > 0;
    Z74.exports = vk9
})
// @from(Ln 223383, Col 4)
T74 = x((Yg2, f74) => {
    var Nk9 = Z36(),
        Vk9 = (A, q, K) => Nk9(A, q, K) < 0;
    f74.exports = Vk9
})
// @from(Ln 223388, Col 4)
N74 = x((zg2, v74) => {
    var kk9 = Z36(),
        Ek9 = (A, q, K) => kk9(A, q, K) <= 0;
    v74.exports = Ek9
})
// @from(Ln 223393, Col 4)
k74 = x((_g2, V74) => {
    var yk9 = X74(),
        Lk9 = W74(),
        Rk9 = G74(),
        hk9 = sT8(),
        Sk9 = T74(),
        Ck9 = N74(),
        Ik9 = (A, q, K, Y) => {
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
                    return yk9(A, K, Y);
                case "!=":
                    return Lk9(A, K, Y);
                case ">":
                    return Rk9(A, K, Y);
                case ">=":
                    return hk9(A, K, Y);
                case "<":
                    return Sk9(A, K, Y);
                case "<=":
                    return Ck9(A, K, Y);
                default:
                    throw TypeError(`Invalid operator: ${q}`)
            }
        };
    V74.exports = Ik9
})
// @from(Ln 223430, Col 4)
C74 = x((wg2, S74) => {
    var uF6 = Symbol("SemVer ANY");
    class mX1 {
        static get ANY() {
            return uF6
        }
        constructor(A, q) {
            if (q = E74(q), A instanceof mX1)
                if (A.loose === !!q.loose) return A;
                else A = A.value;
            if (A = A.trim().split(/\s+/).join(" "), eT8("comparator", A, q), this.options = q, this.loose = !!q.loose, this.parse(A), this.semver === uF6) this.value = "";
            else this.value = this.operator + this.semver.version;
            eT8("comp", this)
        }
        parse(A) {
            let q = this.options.loose ? y74[L74.COMPARATORLOOSE] : y74[L74.COMPARATOR],
                K = A.match(q);
            if (!K) throw TypeError(`Invalid comparator: ${A}`);
            if (this.operator = K[1] !== void 0 ? K[1] : "", this.operator === "=") this.operator = "";
            if (!K[2]) this.semver = uF6;
            else this.semver = new R74(K[2], this.options.loose)
        }
        toString() {
            return this.value
        }
        test(A) {
            if (eT8("Comparator.test", A, this.options.loose), this.semver === uF6 || A === uF6) return !0;
            if (typeof A === "string") try {
                A = new R74(A, this.options)
            } catch (q) {
                return !1
            }
            return tT8(A, this.operator, this.semver, this.options)
        }
        intersects(A, q) {
            if (!(A instanceof mX1)) throw TypeError("a Comparator is required");
            if (this.operator === "") {
                if (this.value === "") return !0;
                return new h74(A.value, q).test(this.value)
            } else if (A.operator === "") {
                if (A.value === "") return !0;
                return new h74(this.value, q).test(A.semver)
            }
            if (q = E74(q), q.includePrerelease && (this.value === "<0.0.0-0" || A.value === "<0.0.0-0")) return !1;
            if (!q.includePrerelease && (this.value.startsWith("<0.0.0") || A.value.startsWith("<0.0.0"))) return !1;
            if (this.operator.startsWith(">") && A.operator.startsWith(">")) return !0;
            if (this.operator.startsWith("<") && A.operator.startsWith("<")) return !0;
            if (this.semver.version === A.semver.version && this.operator.includes("=") && A.operator.includes("=")) return !0;
            if (tT8(this.semver, "<", A.semver, q) && this.operator.startsWith(">") && A.operator.startsWith("<")) return !0;
            if (tT8(this.semver, ">", A.semver, q) && this.operator.startsWith("<") && A.operator.startsWith(">")) return !0;
            return !1
        }
    }
    S74.exports = mX1;
    var E74 = hX1(),
        {
            safeRe: y74,
            t: L74
        } = xF6(),
        tT8 = k74(),
        eT8 = bF6(),
        R74 = a06(),
        h74 = Av8()
})
// @from(Ln 223494, Col 4)
Av8 = x((Og2, u74) => {
    var bk9 = /\s+/g;
    class mF6 {
        constructor(A, q) {
            if (q = uk9(q), A instanceof mF6)
                if (A.loose === !!q.loose && A.includePrerelease === !!q.includePrerelease) return A;
                else return new mF6(A.raw, q);
            if (A instanceof qv8) return this.raw = A.value, this.set = [
                [A]
            ], this.formatted = void 0, this;
            if (this.options = q, this.loose = !!q.loose, this.includePrerelease = !!q.includePrerelease, this.raw = A.trim().replace(bk9, " "), this.set = this.raw.split("||").map((K) => this.parseRange(K.trim())).filter((K) => K.length), !this.set.length) throw TypeError(`Invalid SemVer Range: ${this.raw}`);
            if (this.set.length > 1) {
                let K = this.set[0];
                if (this.set = this.set.filter((Y) => !b74(Y[0])), this.set.length === 0) this.set = [K];
                else if (this.set.length > 1) {
                    for (let Y of this.set)
                        if (Y.length === 1 && Uk9(Y[0])) {
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
            let K = ((this.options.includePrerelease && pk9) | (this.options.loose && Qk9)) + ":" + A,
                Y = I74.get(K);
            if (Y) return Y;
            let z = this.options.loose,
                _ = z ? Df[YZ.HYPHENRANGELOOSE] : Df[YZ.HYPHENRANGE];
            A = A.replace(_, tk9(this.options.includePrerelease)), NO("hyphen replace", A), A = A.replace(Df[YZ.COMPARATORTRIM], Bk9), NO("comparator trim", A), A = A.replace(Df[YZ.TILDETRIM], gk9), NO("tilde trim", A), A = A.replace(Df[YZ.CARETTRIM], Fk9), NO("caret trim", A);
            let w = A.split(" ").map((j) => dk9(j, this.options)).join(" ").split(/\s+/).map((j) => sk9(j, this.options));
            if (z) w = w.filter((j) => {
                return NO("loose invalid filter", j, this.options), !!j.match(Df[YZ.COMPARATORLOOSE])
            });
            NO("range list", w);
            let O = new Map,
                $ = w.map((j) => new qv8(j, this.options));
            for (let j of $) {
                if (b74(j)) return [j];
                O.set(j.value, j)
            }
            if (O.size > 1 && O.has("")) O.delete("");
            let H = [...O.values()];
            return I74.set(K, H), H
        }
        intersects(A, q) {
            if (!(A instanceof mF6)) throw TypeError("a Range is required");
            return this.set.some((K) => {
                return x74(K, q) && A.set.some((Y) => {
                    return x74(Y, q) && K.every((z) => {
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
                A = new mk9(A, this.options)
            } catch (q) {
                return !1
            }
            for (let q = 0; q < this.set.length; q++)
                if (ek9(this.set[q], A, this.options)) return !0;
            return !1
        }
    }
    u74.exports = mF6;
    var xk9 = M74(),
        I74 = new xk9,
        uk9 = hX1(),
        qv8 = C74(),
        NO = bF6(),
        mk9 = a06(),
        {
            safeRe: Df,
            t: YZ,
            comparatorTrimReplace: Bk9,
            tildeTrimReplace: gk9,
            caretTrimReplace: Fk9
        } = xF6(),
        {
            FLAG_INCLUDE_PRERELEASE: pk9,
            FLAG_LOOSE: Qk9
        } = RX1(),
        b74 = (A) => A.value === "<0.0.0-0",
        Uk9 = (A) => A.value === "",
        x74 = (A, q) => {
            let K = !0,
                Y = A.slice(),
                z = Y.pop();
            while (K && Y.length) K = Y.every((_) => {
                return z.intersects(_, q)
            }), z = Y.pop();
            return K
        },
        dk9 = (A, q) => {
            return A = A.replace(Df[YZ.BUILD], ""), NO("comp", A, q), A = ik9(A, q), NO("caret", A), A = ck9(A, q), NO("tildes", A), A = rk9(A, q), NO("xrange", A), A = ak9(A, q), NO("stars", A), A
        },
        Xf = (A) => !A || A.toLowerCase() === "x" || A === "*",
        ck9 = (A, q) => {
            return A.trim().split(/\s+/).map((K) => lk9(K, q)).join(" ")
        },
        lk9 = (A, q) => {
            let K = q.loose ? Df[YZ.TILDELOOSE] : Df[YZ.TILDE];
            return A.replace(K, (Y, z, _, w, O) => {
                NO("tilde", A, Y, z, _, w, O);
                let $;
                if (Xf(z)) $ = "";
                else if (Xf(_)) $ = `>=${z}.0.0 <${+z+1}.0.0-0`;
                else if (Xf(w)) $ = `>=${z}.${_}.0 <${z}.${+_+1}.0-0`;
                else if (O) NO("replaceTilde pr", O), $ = `>=${z}.${_}.${w}-${O} <${z}.${+_+1}.0-0`;
                else $ = `>=${z}.${_}.${w} <${z}.${+_+1}.0-0`;
                return NO("tilde return", $), $
            })
        },
        ik9 = (A, q) => {
            return A.trim().split(/\s+/).map((K) => nk9(K, q)).join(" ")
        },
        nk9 = (A, q) => {
            NO("caret", A, q);
            let K = q.loose ? Df[YZ.CARETLOOSE] : Df[YZ.CARET],
                Y = q.includePrerelease ? "-0" : "";
            return A.replace(K, (z, _, w, O, $) => {
                NO("caret", A, z, _, w, O, $);
                let H;
                if (Xf(_)) H = "";
                else if (Xf(w)) H = `>=${_}.0.0${Y} <${+_+1}.0.0-0`;
                else if (Xf(O))
                    if (_ === "0") H = `>=${_}.${w}.0${Y} <${_}.${+w+1}.0-0`;
                    else H = `>=${_}.${w}.0${Y} <${+_+1}.0.0-0`;
                else if ($)
                    if (NO("replaceCaret pr", $), _ === "0")
                        if (w === "0") H = `>=${_}.${w}.${O}-${$} <${_}.${w}.${+O+1}-0`;
                        else H = `>=${_}.${w}.${O}-${$} <${_}.${+w+1}.0-0`;
                else H = `>=${_}.${w}.${O}-${$} <${+_+1}.0.0-0`;
                else if (NO("no pr"), _ === "0")
                    if (w === "0") H = `>=${_}.${w}.${O}${Y} <${_}.${w}.${+O+1}-0`;
                    else H = `>=${_}.${w}.${O}${Y} <${_}.${+w+1}.0-0`;
                else H = `>=${_}.${w}.${O} <${+_+1}.0.0-0`;
                return NO("caret return", H), H
            })
        },
        rk9 = (A, q) => {
            return NO("replaceXRanges", A, q), A.split(/\s+/).map((K) => ok9(K, q)).join(" ")
        },
        ok9 = (A, q) => {
            A = A.trim();
            let K = q.loose ? Df[YZ.XRANGELOOSE] : Df[YZ.XRANGE];
            return A.replace(K, (Y, z, _, w, O, $) => {
                NO("xRange", A, Y, z, _, w, O, $);
                let H = Xf(_),
                    j = H || Xf(w),
                    J = j || Xf(O),
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
                return NO("xRange return", Y), Y
            })
        },
        ak9 = (A, q) => {
            return NO("replaceStars", A, q), A.trim().replace(Df[YZ.STAR], "")
        },
        sk9 = (A, q) => {
            return NO("replaceGTE0", A, q), A.trim().replace(Df[q.includePrerelease ? YZ.GTE0PRE : YZ.GTE0], "")
        },
        tk9 = (A) => (q, K, Y, z, _, w, O, $, H, j, J, M) => {
            if (Xf(Y)) K = "";
            else if (Xf(z)) K = `>=${Y}.0.0${A?"-0":""}`;
            else if (Xf(_)) K = `>=${Y}.${z}.0${A?"-0":""}`;
            else if (w) K = `>=${K}`;
            else K = `>=${K}${A?"-0":""}`;
            if (Xf(H)) $ = "";
            else if (Xf(j)) $ = `<${+H+1}.0.0-0`;
            else if (Xf(J)) $ = `<${H}.${+j+1}.0-0`;
            else if (M) $ = `<=${H}.${j}.${J}-${M}`;
            else if (A) $ = `<${H}.${j}.${+J+1}-0`;
            else $ = `<=${$}`;
            return `${K} ${$}`.trim()
        },
        ek9 = (A, q, K) => {
            for (let Y = 0; Y < A.length; Y++)
                if (!A[Y].test(q)) return !1;
            if (q.prerelease.length && !K.includePrerelease) {
                for (let Y = 0; Y < A.length; Y++) {
                    if (NO(A[Y].semver), A[Y].semver === qv8.ANY) continue;
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
// @from(Ln 223727, Col 4)
B74 = x(($g2, m74) => {
    var AE9 = Av8(),
        qE9 = (A, q, K) => {
            try {
                q = new AE9(q, K)
            } catch (Y) {
                return !1
            }
            return q.test(A)
        };
    m74.exports = qE9
})
// @from(Ln 223739, Col 4)
Kv8 = x((Hg2, KE9) => {
    KE9.exports = {
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
// @from(Ln 223836, Col 4)
zv8 = x((jg2, n74) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var {
        spawnSync: BX1
    } = x6("node:child_process"), {
        createHash: YE9
    } = x6("node:crypto"), Q74 = w74(), zE9 = sT8(), _E9 = B74(), g74 = LX1(), {
        config: wE9,
        engines: F74,
        optionalDependencies: OE9
    } = Kv8(), $E9 = process.env.npm_package_config_libvips || wE9.libvips, U74 = Q74($E9).version, HE9 = ["darwin-arm64", "darwin-x64", "linux-arm", "linux-arm64", "linux-ppc64", "linux-riscv64", "linux-s390x", "linux-x64", "linuxmusl-arm64", "linuxmusl-x64", "win32-arm64", "win32-ia32", "win32-x64"], gX1 = {
        encoding: "utf8",
        shell: !0
    }, jE9 = (A) => {
        if (A instanceof Error) console.error(`sharp: Installation error: ${A.message}`);
        else console.log(`sharp: ${A}`)
    }, d74 = () => g74.isNonGlibcLinuxSync() ? g74.familySync() : "", JE9 = () => `${process.platform}${d74()}-${process.arch}`, s06 = () => {
        if (c74()) return "wasm32";
        let {
            npm_config_arch: A,
            npm_config_platform: q,
            npm_config_libc: K
        } = process.env, Y = typeof K === "string" ? K : d74();
        return `${q||process.platform}${Y}-${A||process.arch}`
    }, ME9 = () => {
        try {
            return x6(`@img/sharp-libvips-dev-${s06()}/include`)
        } catch {
            try {
                return (() => {
                    throw new Error("Cannot require module " + "@img/sharp-libvips-dev/include");
                })()
            } catch {}
        }
        return ""
    }, DE9 = () => {
        try {
            return (() => {
                throw new Error("Cannot require module " + "@img/sharp-libvips-dev/cplusplus");
            })()
        } catch {}
        return ""
    }, XE9 = () => {
        try {
            return x6(`@img/sharp-libvips-dev-${s06()}/lib`)
        } catch {
            try {
                return x6(`@img/sharp-libvips-${s06()}/lib`)
            } catch {}
        }
        return ""
    }, PE9 = () => {
        if (process.release?.name === "node" && process.versions) {
            if (!_E9(process.versions.node, F74.node)) return {
                found: process.versions.node,
                expected: F74.node
            }
        }
    }, c74 = () => {
        let {
            CC: A
        } = process.env;
        return Boolean(A?.endsWith("/emcc"))
    }, WE9 = () => {
        if (process.platform === "darwin" && process.arch === "x64") return (BX1("sysctl sysctl.proc_translated", gX1).stdout || "").trim() === "sysctl.proc_translated: 1";
        return !1
    }, p74 = (A) => YE9("sha512").update(A).digest("hex"), ZE9 = () => {
        try {
            let A = p74(`imgsharp-libvips-${s06()}`),
                q = Q74(OE9[`@img/sharp-libvips-${s06()}`], {
                    includePrerelease: !0
                }).version;
            return p74(`${A}npm:${q}`).slice(0, 10)
        } catch {}
        return ""
    }, GE9 = () => BX1(`node-gyp rebuild --directory=src ${c74()?"--nodedir=emscripten":""}`, {
        ...gX1,
        stdio: "inherit"
    }).status, l74 = () => {
        if (process.platform !== "win32") return (BX1("pkg-config --modversion vips-cpp", {
            ...gX1,
            env: {
                ...process.env,
                PKG_CONFIG_PATH: i74()
            }
        }).stdout || "").trim();
        else return ""
    }, i74 = () => {
        if (process.platform !== "win32") return [(BX1('which brew >/dev/null 2>&1 && brew environment --plain | grep PKG_CONFIG_LIBDIR | cut -d" " -f2', gX1).stdout || "").trim(), process.env.PKG_CONFIG_PATH, "/usr/local/lib/pkgconfig", "/usr/lib/pkgconfig", "/usr/local/libdata/pkgconfig", "/usr/libdata/pkgconfig"].filter(Boolean).join(":");
        else return ""
    }, Yv8 = (A, q, K) => {
        if (K) K(`Detected ${q}, skipping search for globally-installed libvips`);
        return A
    }, fE9 = (A) => {
        if (Boolean(process.env.SHARP_IGNORE_GLOBAL_LIBVIPS) === !0) return Yv8(!1, "SHARP_IGNORE_GLOBAL_LIBVIPS", A);
        if (Boolean(process.env.SHARP_FORCE_GLOBAL_LIBVIPS) === !0) return Yv8(!0, "SHARP_FORCE_GLOBAL_LIBVIPS", A);
        if (WE9()) return Yv8(!1, "Rosetta", A);
        let q = l74();
        return !!q && zE9(q, U74)
    };
    n74.exports = {
        minimumLibvipsVersion: U74,
        prebuiltPlatforms: HE9,
        buildPlatformArch: s06,
        buildSharpLibvipsIncludeDir: ME9,
        buildSharpLibvipsCPlusPlusDir: DE9,
        buildSharpLibvipsLibDir: XE9,
        isUnsupportedNodeRuntime: PE9,
        runtimePlatformArch: JE9,
        log: jE9,
        yarnLocator: ZE9,
        spawnRebuild: GE9,
        globalLibvipsVersion: l74,
        pkgConfigPath: i74,
        useGlobalLibvips: fE9
    }
})
// @from(Ln 223956, Col 4)
gF6 = x((Mg2, o74) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var {
        familySync: TE9,
        versionSync: vE9
    } = LX1(), {
        runtimePlatformArch: NE9,
        isUnsupportedNodeRuntime: r74,
        prebuiltPlatforms: VE9,
        minimumLibvipsVersion: kE9
    } = zv8(), G36 = NE9(), EE9 = [`../src/build/Release/sharp-${G36}.node`, "../src/build/Release/sharp-wasm32.node", `@img/sharp-${G36}/sharp.node`, "@img/sharp-wasm32/sharp.node"], _v8, t06, BF6 = [];
    for (_v8 of EE9) try {
        t06 = x6(_v8);
        break
    } catch (A) {
        BF6.push(A)
    }
    if (t06 && _v8.startsWith("@img/sharp-linux-x64") && !t06._isUsingX64V2()) {
        let A = Error("Prebuilt binaries for linux-x64 require v2 microarchitecture");
        A.code = "Unsupported CPU", BF6.push(A), t06 = null
    }
    if (t06) o74.exports = t06;
    else {
        let [A, q, K] = ["linux", "darwin", "win32"].map((_) => G36.startsWith(_)), Y = [`Could not load the "sharp" module using the ${G36} runtime`];
        BF6.forEach((_) => {
            if (_.code !== "MODULE_NOT_FOUND") Y.push(`${_.code}: ${_.message}`)
        });
        let z = BF6.map((_) => _.message).join(" ");
        if (Y.push("Possible solutions:"), r74()) {
            let {
                found: _,
                expected: w
            } = r74();
            Y.push("- Please upgrade Node.js:", `    Found ${_}`, `    Requires ${w}`)
        } else if (VE9.includes(G36)) {
            let [_, w] = G36.split("-"), O = _.endsWith("musl") ? " --libc=musl" : "";
            Y.push("- Ensure optional dependencies can be installed:", "    npm install --include=optional sharp", "- Ensure your package manager supports multi-platform installation:", "    See https://sharp.pixelplumbing.com/install#cross-platform", "- Add platform-specific dependencies:", `    npm install --os=${_.replace("musl","")}${O} --cpu=${w} sharp`)
        } else Y.push(`- Manually install libvips >= ${kE9}`, "- Add experimental WebAssembly-based dependencies:", "    npm install --cpu=wasm32 sharp", "    npm install @img/sharp-wasm32");
        if (A && /(symbol not found|CXXABI_)/i.test(z)) try {
            let {
                config: _
            } = x6(`@img/sharp-libvips-${G36}/package`), w = `${TE9()} ${vE9()}`, O = `${_.musl?"musl":"glibc"} ${_.musl||_.glibc}`;
            Y.push("- Update your OS:", `    Found ${w}`, `    Requires ${O}`)
        } catch (_) {}
        if (A && /\/snap\/core[0-9]{2}/.test(z)) Y.push("- Remove the Node.js Snap, which does not support native modules", "    snap remove node");
        if (q && /Incompatible library version/.test(z)) Y.push("- Update Homebrew:", "    brew update && brew upgrade vips");
        if (BF6.some((_) => _.code === "ERR_DLOPEN_DISABLED")) Y.push("- Run Node.js without using the --no-addons flag");
        if (K && /The specified procedure could not be found/.test(z)) Y.push("- Using the canvas package on Windows?", "    See https://sharp.pixelplumbing.com/install#canvas-and-windows", "- Check for outdated versions of sharp in the dependency tree:", "    npm ls sharp");
        throw Y.push("- Consult the installation documentation:", "    See https://sharp.pixelplumbing.com/install"), Error(Y.join(`
`))
    }
})
// @from(Ln 224011, Col 4)
s74 = x((Xg2, a74) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var yE9 = x6("node:util"),
        wv8 = x6("node:stream"),
        LE9 = GB();
    gF6();
    var RE9 = yE9.debuglog("sharp"),
        hE9 = (A) => {
            f36.queue.emit("change", A)
        },
        f36 = function(A, q) {
            if (arguments.length === 1 && !LE9.defined(A)) throw Error("Invalid input");
            if (!(this instanceof f36)) return new f36(A, q);
            return wv8.Duplex.call(this), this.options = {
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
                debuglog: (K) => {
                    this.emit("warning", K), RE9(K)
                },
                queueListener: hE9
            }, this.options.input = this._createInputDescriptor(A, q, {
                allowStream: !0
            }), this
        };
    Object.setPrototypeOf(f36.prototype, wv8.Duplex.prototype);
    Object.setPrototypeOf(f36, wv8.Duplex);

    function SE9() {
        let A = this.constructor.call(),
            {
                debuglog: q,
                queueListener: K,
                ...Y
            } = this.options;
        if (A.options = structuredClone(Y), A.options.debuglog = q, A.options.queueListener = K, this._isStreamInput()) this.on("finish", () => {
            this._flattenBufferIn(), A.options.input.buffer = this.options.input.buffer, A.emit("finish")
        });
        return A
    }
    Object.assign(f36.prototype, {
        clone: SE9
    });
    a74.exports = f36
})
// @from(Ln 224230, Col 4)
A44 = x((Pg2, e74) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var o1 = GB(),
        yt = gF6(),
        CE9 = {
            left: "low",
            top: "low",
            low: "low",
            center: "centre",
            centre: "centre",
            right: "high",
            bottom: "high",
            high: "high"
        },
        IE9 = ["failOn", "limitInputPixels", "unlimited", "animated", "autoOrient", "density", "ignoreIcc", "page", "pages", "sequentialRead", "jp2", "openSlide", "pdf", "raw", "svg", "tiff", "failOnError", "openSlideLevel", "pdfBackground", "tiffSubifd"];

    function t74(A) {
        let q = IE9.filter((K) => o1.defined(A[K])).map((K) => [K, A[K]]);
        return q.length ? Object.fromEntries(q) : void 0
    }

    function bE9(A, q, K) {
        let Y = {
            autoOrient: !1,
            failOn: "warning",
            limitInputPixels: 268402689,
            ignoreIcc: !1,
            unlimited: !1,
            sequentialRead: !0
        };
        if (o1.string(A)) Y.file = A;
        else if (o1.buffer(A)) {
            if (A.length === 0) throw Error("Input Buffer is empty");
            Y.buffer = A
        } else if (o1.arrayBuffer(A)) {
            if (A.byteLength === 0) throw Error("Input bit Array is empty");
            Y.buffer = Buffer.from(A, 0, A.byteLength)
        } else if (o1.typedArray(A)) {
            if (A.length === 0) throw Error("Input Bit Array is empty");
            Y.buffer = Buffer.from(A.buffer, A.byteOffset, A.byteLength)
        } else if (o1.plainObject(A) && !o1.defined(q)) {
            if (q = A, t74(q)) Y.buffer = []
        } else if (!o1.defined(A) && !o1.defined(q) && o1.object(K) && K.allowStream) Y.buffer = [];
        else if (Array.isArray(A))
            if (A.length > 1)
                if (!this.options.joining) this.options.joining = !0, this.options.join = A.map((z) => this._createInputDescriptor(z));
                else throw Error("Recursive join is unsupported");
        else throw Error("Expected at least two images to join");
        else throw Error(`Unsupported input '${A}' of type ${typeof A}${o1.defined(q)?` when also providing options of type ${typeof q}`:""}`);
        if (o1.object(q)) {
            if (o1.defined(q.failOnError))
                if (o1.bool(q.failOnError)) Y.failOn = q.failOnError ? "warning" : "none";
                else throw o1.invalidParameterError("failOnError", "boolean", q.failOnError);
            if (o1.defined(q.failOn))
                if (o1.string(q.failOn) && o1.inArray(q.failOn, ["none", "truncated", "error", "warning"])) Y.failOn = q.failOn;
                else throw o1.invalidParameterError("failOn", "one of: none, truncated, error, warning", q.failOn);
            if (o1.defined(q.autoOrient))
                if (o1.bool(q.autoOrient)) Y.autoOrient = q.autoOrient;
                else throw o1.invalidParameterError("autoOrient", "boolean", q.autoOrient);
            if (o1.defined(q.density))
                if (o1.inRange(q.density, 1, 1e5)) Y.density = q.density;
                else throw o1.invalidParameterError("density", "number between 1 and 100000", q.density);
            if (o1.defined(q.ignoreIcc))
                if (o1.bool(q.ignoreIcc)) Y.ignoreIcc = q.ignoreIcc;
                else throw o1.invalidParameterError("ignoreIcc", "boolean", q.ignoreIcc);
            if (o1.defined(q.limitInputPixels))
                if (o1.bool(q.limitInputPixels)) Y.limitInputPixels = q.limitInputPixels ? 268402689 : 0;
                else if (o1.integer(q.limitInputPixels) && o1.inRange(q.limitInputPixels, 0, Number.MAX_SAFE_INTEGER)) Y.limitInputPixels = q.limitInputPixels;
            else throw o1.invalidParameterError("limitInputPixels", "positive integer", q.limitInputPixels);
            if (o1.defined(q.unlimited))
                if (o1.bool(q.unlimited)) Y.unlimited = q.unlimited;
                else throw o1.invalidParameterError("unlimited", "boolean", q.unlimited);
            if (o1.defined(q.sequentialRead))
                if (o1.bool(q.sequentialRead)) Y.sequentialRead = q.sequentialRead;
                else throw o1.invalidParameterError("sequentialRead", "boolean", q.sequentialRead);
            if (o1.defined(q.raw)) {
                if (o1.object(q.raw) && o1.integer(q.raw.width) && q.raw.width > 0 && o1.integer(q.raw.height) && q.raw.height > 0 && o1.integer(q.raw.channels) && o1.inRange(q.raw.channels, 1, 4)) switch (Y.rawWidth = q.raw.width, Y.rawHeight = q.raw.height, Y.rawChannels = q.raw.channels, A.constructor) {
                    case Uint8Array:
                    case Uint8ClampedArray:
                        Y.rawDepth = "uchar";
                        break;
                    case Int8Array:
                        Y.rawDepth = "char";
                        break;
                    case Uint16Array:
                        Y.rawDepth = "ushort";
                        break;
                    case Int16Array:
                        Y.rawDepth = "short";
                        break;
                    case Uint32Array:
                        Y.rawDepth = "uint";
                        break;
                    case Int32Array:
                        Y.rawDepth = "int";
                        break;
                    case Float32Array:
                        Y.rawDepth = "float";
                        break;
                    case Float64Array:
                        Y.rawDepth = "double";
                        break;
                    default:
                        Y.rawDepth = "uchar";
                        break
                } else throw Error("Expected width, height and channels for raw pixel input");
                if (Y.rawPremultiplied = !1, o1.defined(q.raw.premultiplied))
                    if (o1.bool(q.raw.premultiplied)) Y.rawPremultiplied = q.raw.premultiplied;
                    else throw o1.invalidParameterError("raw.premultiplied", "boolean", q.raw.premultiplied);
                if (Y.rawPageHeight = 0, o1.defined(q.raw.pageHeight))
                    if (o1.integer(q.raw.pageHeight) && q.raw.pageHeight > 0 && q.raw.pageHeight <= q.raw.height) {
                        if (q.raw.height % q.raw.pageHeight !== 0) throw Error(`Expected raw.height ${q.raw.height} to be a multiple of raw.pageHeight ${q.raw.pageHeight}`);
                        Y.rawPageHeight = q.raw.pageHeight
                    } else throw o1.invalidParameterError("raw.pageHeight", "positive integer", q.raw.pageHeight)
            }
            if (o1.defined(q.animated))
                if (o1.bool(q.animated)) Y.pages = q.animated ? -1 : 1;
                else throw o1.invalidParameterError("animated", "boolean", q.animated);
            if (o1.defined(q.pages))
                if (o1.integer(q.pages) && o1.inRange(q.pages, -1, 1e5)) Y.pages = q.pages;
                else throw o1.invalidParameterError("pages", "integer between -1 and 100000", q.pages);
            if (o1.defined(q.page))
                if (o1.integer(q.page) && o1.inRange(q.page, 0, 1e5)) Y.page = q.page;
                else throw o1.invalidParameterError("page", "integer between 0 and 100000", q.page);
            if (o1.object(q.openSlide) && o1.defined(q.openSlide.level))
                if (o1.integer(q.openSlide.level) && o1.inRange(q.openSlide.level, 0, 256)) Y.openSlideLevel = q.openSlide.level;
                else throw o1.invalidParameterError("openSlide.level", "integer between 0 and 256", q.openSlide.level);
            else if (o1.defined(q.level))
                if (o1.integer(q.level) && o1.inRange(q.level, 0, 256)) Y.openSlideLevel = q.level;
                else throw o1.invalidParameterError("level", "integer between 0 and 256", q.level);
            if (o1.object(q.tiff) && o1.defined(q.tiff.subifd))
                if (o1.integer(q.tiff.subifd) && o1.inRange(q.tiff.subifd, -1, 1e5)) Y.tiffSubifd = q.tiff.subifd;
                else throw o1.invalidParameterError("tiff.subifd", "integer between -1 and 100000", q.tiff.subifd);
            else if (o1.defined(q.subifd))
                if (o1.integer(q.subifd) && o1.inRange(q.subifd, -1, 1e5)) Y.tiffSubifd = q.subifd;
                else throw o1.invalidParameterError("subifd", "integer between -1 and 100000", q.subifd);
            if (o1.object(q.svg)) {
                if (o1.defined(q.svg.stylesheet))
                    if (o1.string(q.svg.stylesheet)) Y.svgStylesheet = q.svg.stylesheet;
                    else throw o1.invalidParameterError("svg.stylesheet", "string", q.svg.stylesheet);
                if (o1.defined(q.svg.highBitdepth))
                    if (o1.bool(q.svg.highBitdepth)) Y.svgHighBitdepth = q.svg.highBitdepth;
                    else throw o1.invalidParameterError("svg.highBitdepth", "boolean", q.svg.highBitdepth)
            }
            if (o1.object(q.pdf) && o1.defined(q.pdf.background)) Y.pdfBackground = this._getBackgroundColourOption(q.pdf.background);
            else if (o1.defined(q.pdfBackground)) Y.pdfBackground = this._getBackgroundColourOption(q.pdfBackground);
            if (o1.object(q.jp2) && o1.defined(q.jp2.oneshot))
                if (o1.bool(q.jp2.oneshot)) Y.jp2Oneshot = q.jp2.oneshot;
                else throw o1.invalidParameterError("jp2.oneshot", "boolean", q.jp2.oneshot);
            if (o1.defined(q.create))
                if (o1.object(q.create) && o1.integer(q.create.width) && q.create.width > 0 && o1.integer(q.create.height) && q.create.height > 0 && o1.integer(q.create.channels)) {
                    if (Y.createWidth = q.create.width, Y.createHeight = q.create.height, Y.createChannels = q.create.channels, Y.createPageHeight = 0, o1.defined(q.create.pageHeight))
                        if (o1.integer(q.create.pageHeight) && q.create.pageHeight > 0 && q.create.pageHeight <= q.create.height) {
                            if (q.create.height % q.create.pageHeight !== 0) throw Error(`Expected create.height ${q.create.height} to be a multiple of create.pageHeight ${q.create.pageHeight}`);
                            Y.createPageHeight = q.create.pageHeight
                        } else throw o1.invalidParameterError("create.pageHeight", "positive integer", q.create.pageHeight);
                    if (o1.defined(q.create.noise)) {
                        if (!o1.object(q.create.noise)) throw Error("Expected noise to be an object");
                        if (q.create.noise.type !== "gaussian") throw Error("Only gaussian noise is supported at the moment");
                        if (Y.createNoiseType = q.create.noise.type, !o1.inRange(q.create.channels, 1, 4)) throw o1.invalidParameterError("create.channels", "number between 1 and 4", q.create.channels);
                        if (Y.createNoiseMean = 128, o1.defined(q.create.noise.mean))
                            if (o1.number(q.create.noise.mean) && o1.inRange(q.create.noise.mean, 0, 1e4)) Y.createNoiseMean = q.create.noise.mean;
                            else throw o1.invalidParameterError("create.noise.mean", "number between 0 and 10000", q.create.noise.mean);
                        if (Y.createNoiseSigma = 30, o1.defined(q.create.noise.sigma))
                            if (o1.number(q.create.noise.sigma) && o1.inRange(q.create.noise.sigma, 0, 1e4)) Y.createNoiseSigma = q.create.noise.sigma;
                            else throw o1.invalidParameterError("create.noise.sigma", "number between 0 and 10000", q.create.noise.sigma)
                    } else if (o1.defined(q.create.background)) {
                        if (!o1.inRange(q.create.channels, 3, 4)) throw o1.invalidParameterError("create.channels", "number between 3 and 4", q.create.channels);
                        Y.createBackground = this._getBackgroundColourOption(q.create.background)
                    } else throw Error("Expected valid noise or background to create a new input image");
                    delete Y.buffer
                } else throw Error("Expected valid width, height and channels to create a new input image");
            if (o1.defined(q.text))
                if (o1.object(q.text) && o1.string(q.text.text)) {
                    if (Y.textValue = q.text.text, o1.defined(q.text.height) && o1.defined(q.text.dpi)) throw Error("Expected only one of dpi or height");
                    if (o1.defined(q.text.font))
                        if (o1.string(q.text.font)) Y.textFont = q.text.font;
                        else throw o1.invalidParameterError("text.font", "string", q.text.font);
                    if (o1.defined(q.text.fontfile))
                        if (o1.string(q.text.fontfile)) Y.textFontfile = q.text.fontfile;
                        else throw o1.invalidParameterError("text.fontfile", "string", q.text.fontfile);
                    if (o1.defined(q.text.width))
                        if (o1.integer(q.text.width) && q.text.width > 0) Y.textWidth = q.text.width;
                        else throw o1.invalidParameterError("text.width", "positive integer", q.text.width);
                    if (o1.defined(q.text.height))
                        if (o1.integer(q.text.height) && q.text.height > 0) Y.textHeight = q.text.height;
                        else throw o1.invalidParameterError("text.height", "positive integer", q.text.height);
                    if (o1.defined(q.text.align))
                        if (o1.string(q.text.align) && o1.string(this.constructor.align[q.text.align])) Y.textAlign = this.constructor.align[q.text.align];
                        else throw o1.invalidParameterError("text.align", "valid alignment", q.text.align);
                    if (o1.defined(q.text.justify))
                        if (o1.bool(q.text.justify)) Y.textJustify = q.text.justify;
                        else throw o1.invalidParameterError("text.justify", "boolean", q.text.justify);
                    if (o1.defined(q.text.dpi))
                        if (o1.integer(q.text.dpi) && o1.inRange(q.text.dpi, 1, 1e6)) Y.textDpi = q.text.dpi;
                        else throw o1.invalidParameterError("text.dpi", "integer between 1 and 1000000", q.text.dpi);
                    if (o1.defined(q.text.rgba))
                        if (o1.bool(q.text.rgba)) Y.textRgba = q.text.rgba;
                        else throw o1.invalidParameterError("text.rgba", "bool", q.text.rgba);
                    if (o1.defined(q.text.spacing))
                        if (o1.integer(q.text.spacing) && o1.inRange(q.text.spacing, -1e6, 1e6)) Y.textSpacing = q.text.spacing;
                        else throw o1.invalidParameterError("text.spacing", "integer between -1000000 and 1000000", q.text.spacing);
                    if (o1.defined(q.text.wrap))
                        if (o1.string(q.text.wrap) && o1.inArray(q.text.wrap, ["word", "char", "word-char", "none"])) Y.textWrap = q.text.wrap;
                        else throw o1.invalidParameterError("text.wrap", "one of: word, char, word-char, none", q.text.wrap);
                    delete Y.buffer
                } else throw Error("Expected a valid string to create an image with text.");
            if (o1.defined(q.join))
                if (o1.defined(this.options.join)) {
                    if (o1.defined(q.join.animated))
                        if (o1.bool(q.join.animated)) Y.joinAnimated = q.join.animated;
                        else throw o1.invalidParameterError("join.animated", "boolean", q.join.animated);
                    if (o1.defined(q.join.across))
                        if (o1.integer(q.join.across) && o1.inRange(q.join.across, 1, 1e6)) Y.joinAcross = q.join.across;
                        else throw o1.invalidParameterError("join.across", "integer between 1 and 100000", q.join.across);
                    if (o1.defined(q.join.shim))
                        if (o1.integer(q.join.shim) && o1.inRange(q.join.shim, 0, 1e6)) Y.joinShim = q.join.shim;
                        else throw o1.invalidParameterError("join.shim", "integer between 0 and 100000", q.join.shim);
                    if (o1.defined(q.join.background)) Y.joinBackground = this._getBackgroundColourOption(q.join.background);
                    if (o1.defined(q.join.halign))
                        if (o1.string(q.join.halign) && o1.string(this.constructor.align[q.join.halign])) Y.joinHalign = this.constructor.align[q.join.halign];
                        else throw o1.invalidParameterError("join.halign", "valid alignment", q.join.halign);
                    if (o1.defined(q.join.valign))
                        if (o1.string(q.join.valign) && o1.string(this.constructor.align[q.join.valign])) Y.joinValign = this.constructor.align[q.join.valign];
                        else throw o1.invalidParameterError("join.valign", "valid alignment", q.join.valign)
                } else throw Error("Expected input to be an array of images to join")
        } else if (o1.defined(q)) throw Error(`Invalid input options ${q}`);
        return Y
    }

    function xE9(A, q, K) {
        if (Array.isArray(this.options.input.buffer))
            if (o1.buffer(A)) {
                if (this.options.input.buffer.length === 0) this.on("finish", () => {
                    this.streamInFinished = !0
                });
                this.options.input.buffer.push(A), K()
            } else K(Error("Non-Buffer data on Writable Stream"));
        else K(Error("Unexpected data on Writable Stream"))
    }

    function uE9() {
        if (this._isStreamInput()) this.options.input.buffer = Buffer.concat(this.options.input.buffer)
    }

    function mE9() {
        return Array.isArray(this.options.input.buffer)
    }

    function BE9(A) {
        let q = Error();
        if (o1.fn(A)) {
            if (this._isStreamInput()) this.on("finish", () => {
                this._flattenBufferIn(), yt.metadata(this.options, (K, Y) => {
                    if (K) A(o1.nativeError(K, q));
                    else A(null, Y)
                })
            });
            else yt.metadata(this.options, (K, Y) => {
                if (K) A(o1.nativeError(K, q));
                else A(null, Y)
            });
            return this
        } else if (this._isStreamInput()) return new Promise((K, Y) => {
            let z = () => {
                this._flattenBufferIn(), yt.metadata(this.options, (_, w) => {
                    if (_) Y(o1.nativeError(_, q));
                    else K(w)
                })
            };
            if (this.writableFinished) z();
            else this.once("finish", z)
        });
        else return new Promise((K, Y) => {
            yt.metadata(this.options, (z, _) => {
                if (z) Y(o1.nativeError(z, q));
                else K(_)
            })
        })
    }

    function gE9(A) {
        let q = Error();
        if (o1.fn(A)) {
            if (this._isStreamInput()) this.on("finish", () => {
                this._flattenBufferIn(), yt.stats(this.options, (K, Y) => {
                    if (K) A(o1.nativeError(K, q));
                    else A(null, Y)
                })
            });
            else yt.stats(this.options, (K, Y) => {
                if (K) A(o1.nativeError(K, q));
                else A(null, Y)
            });
            return this
        } else if (this._isStreamInput()) return new Promise((K, Y) => {
            this.on("finish", function() {
                this._flattenBufferIn(), yt.stats(this.options, (z, _) => {
                    if (z) Y(o1.nativeError(z, q));
                    else K(_)
                })
            })
        });
        else return new Promise((K, Y) => {
            yt.stats(this.options, (z, _) => {
                if (z) Y(o1.nativeError(z, q));
                else K(_)
            })
        })
    }
    e74.exports = (A) => {
        Object.assign(A.prototype, {
            _inputOptionsFromObject: t74,
            _createInputDescriptor: bE9,
            _write: xE9,
            _flattenBufferIn: uE9,
            _isStreamInput: mE9,
            metadata: BE9,
            stats: gE9
        }), A.align = CE9
    }
})
// @from(Ln 224555, Col 4)
w44 = x((Wg2, _44) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var vq = GB(),
        K44 = {
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
        Y44 = {
            top: 1,
            right: 2,
            bottom: 3,
            left: 4,
            "right top": 5,
            "right bottom": 6,
            "left bottom": 7,
            "left top": 8
        },
        q44 = {
            background: "background",
            copy: "copy",
            repeat: "repeat",
            mirror: "mirror"
        },
        z44 = {
            entropy: 16,
            attention: 17
        },
        Ov8 = {
            nearest: "nearest",
            linear: "linear",
            cubic: "cubic",
            mitchell: "mitchell",
            lanczos2: "lanczos2",
            lanczos3: "lanczos3",
            mks2013: "mks2013",
            mks2021: "mks2021"
        },
        FE9 = {
            contain: "contain",
            cover: "cover",
            fill: "fill",
            inside: "inside",
            outside: "outside"
        },
        pE9 = {
            contain: "embed",
            cover: "crop",
            fill: "ignore_aspect",
            inside: "max",
            outside: "min"
        };

    function $v8(A) {
        return A.angle % 360 !== 0 || A.rotationAngle !== 0
    }

    function FX1(A) {
        return A.width !== -1 || A.height !== -1
    }

    function QE9(A, q, K) {
        if (FX1(this.options)) this.options.debuglog("ignoring previous resize options");
        if (this.options.widthPost !== -1) this.options.debuglog("operation order will be: extract, resize, extract");
        if (vq.defined(A))
            if (vq.object(A) && !vq.defined(K)) K = A;
            else if (vq.integer(A) && A > 0) this.options.width = A;
        else throw vq.invalidParameterError("width", "positive integer", A);
        else this.options.width = -1;
        if (vq.defined(q))
            if (vq.integer(q) && q > 0) this.options.height = q;
            else throw vq.invalidParameterError("height", "positive integer", q);
        else this.options.height = -1;
        if (vq.object(K)) {
            if (vq.defined(K.width))
                if (vq.integer(K.width) && K.width > 0) this.options.width = K.width;
                else throw vq.invalidParameterError("width", "positive integer", K.width);
            if (vq.defined(K.height))
                if (vq.integer(K.height) && K.height > 0) this.options.height = K.height;
                else throw vq.invalidParameterError("height", "positive integer", K.height);
            if (vq.defined(K.fit)) {
                let Y = pE9[K.fit];
                if (vq.string(Y)) this.options.canvas = Y;
                else throw vq.invalidParameterError("fit", "valid fit", K.fit)
            }
            if (vq.defined(K.position)) {
                let Y = vq.integer(K.position) ? K.position : z44[K.position] || Y44[K.position] || K44[K.position];
                if (vq.integer(Y) && (vq.inRange(Y, 0, 8) || vq.inRange(Y, 16, 17))) this.options.position = Y;
                else throw vq.invalidParameterError("position", "valid position/gravity/strategy", K.position)
            }
            if (this._setBackgroundColourOption("resizeBackground", K.background), vq.defined(K.kernel))
                if (vq.string(Ov8[K.kernel])) this.options.kernel = Ov8[K.kernel];
                else throw vq.invalidParameterError("kernel", "valid kernel name", K.kernel);
            if (vq.defined(K.withoutEnlargement)) this._setBooleanOption("withoutEnlargement", K.withoutEnlargement);
            if (vq.defined(K.withoutReduction)) this._setBooleanOption("withoutReduction", K.withoutReduction);
            if (vq.defined(K.fastShrinkOnLoad)) this._setBooleanOption("fastShrinkOnLoad", K.fastShrinkOnLoad)
        }
        if ($v8(this.options) && FX1(this.options)) this.options.rotateBefore = !0;
        return this
    }

    function UE9(A) {
        if (vq.integer(A) && A > 0) this.options.extendTop = A, this.options.extendBottom = A, this.options.extendLeft = A, this.options.extendRight = A;
        else if (vq.object(A)) {
            if (vq.defined(A.top))
                if (vq.integer(A.top) && A.top >= 0) this.options.extendTop = A.top;
                else throw vq.invalidParameterError("top", "positive integer", A.top);
            if (vq.defined(A.bottom))
                if (vq.integer(A.bottom) && A.bottom >= 0) this.options.extendBottom = A.bottom;
                else throw vq.invalidParameterError("bottom", "positive integer", A.bottom);
            if (vq.defined(A.left))
                if (vq.integer(A.left) && A.left >= 0) this.options.extendLeft = A.left;
                else throw vq.invalidParameterError("left", "positive integer", A.left);
            if (vq.defined(A.right))
                if (vq.integer(A.right) && A.right >= 0) this.options.extendRight = A.right;
                else throw vq.invalidParameterError("right", "positive integer", A.right);
            if (this._setBackgroundColourOption("extendBackground", A.background), vq.defined(A.extendWith))
                if (vq.string(q44[A.extendWith])) this.options.extendWith = q44[A.extendWith];
                else throw vq.invalidParameterError("extendWith", "one of: background, copy, repeat, mirror", A.extendWith)
        } else throw vq.invalidParameterError("extend", "integer or object", A);
        return this
    }

    function dE9(A) {
        let q = FX1(this.options) || this.options.widthPre !== -1 ? "Post" : "Pre";
        if (this.options[`width${q}`] !== -1) this.options.debuglog("ignoring previous extract options");
        if (["left", "top", "width", "height"].forEach(function(K) {
                let Y = A[K];
                if (vq.integer(Y) && Y >= 0) this.options[K + (K === "left" || K === "top" ? "Offset" : "") + q] = Y;
                else throw vq.invalidParameterError(K, "integer", Y)
            }, this), $v8(this.options) && !FX1(this.options)) {
            if (this.options.widthPre === -1 || this.options.widthPost === -1) this.options.rotateBefore = !0
        }
        if (this.options.input.autoOrient) this.options.orientBefore = !0;
        return this
    }

    function cE9(A) {
        if (this.options.trimThreshold = 10, vq.defined(A))
            if (vq.object(A)) {
                if (vq.defined(A.background)) this._setBackgroundColourOption("trimBackground", A.background);
                if (vq.defined(A.threshold))
                    if (vq.number(A.threshold) && A.threshold >= 0) this.options.trimThreshold = A.threshold;
                    else throw vq.invalidParameterError("threshold", "positive number", A.threshold);
                if (vq.defined(A.lineArt)) this._setBooleanOption("trimLineArt", A.lineArt)
            } else throw vq.invalidParameterError("trim", "object", A);
        if ($v8(this.options)) this.options.rotateBefore = !0;
        return this
    }
    _44.exports = (A) => {
        Object.assign(A.prototype, {
            resize: QE9,
            extend: UE9,
            extract: dE9,
            trim: cE9
        }), A.gravity = K44, A.strategy = z44, A.kernel = Ov8, A.fit = FE9, A.position = Y44
    }
})
// @from(Ln 224723, Col 4)
$44 = x((Zg2, O44) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var P2 = GB(),
        Hv8 = {
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

    function lE9(A) {
        if (!Array.isArray(A)) throw P2.invalidParameterError("images to composite", "array", A);
        return this.options.composite = A.map((q) => {
            if (!P2.object(q)) throw P2.invalidParameterError("image to composite", "object", q);
            let K = this._inputOptionsFromObject(q),
                Y = {
                    input: this._createInputDescriptor(q.input, K, {
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
            if (P2.defined(q.blend))
                if (P2.string(Hv8[q.blend])) Y.blend = Hv8[q.blend];
                else throw P2.invalidParameterError("blend", "valid blend name", q.blend);
            if (P2.defined(q.tile))
                if (P2.bool(q.tile)) Y.tile = q.tile;
                else throw P2.invalidParameterError("tile", "boolean", q.tile);
            if (P2.defined(q.left))
                if (P2.integer(q.left)) Y.left = q.left;
                else throw P2.invalidParameterError("left", "integer", q.left);
            if (P2.defined(q.top))
                if (P2.integer(q.top)) Y.top = q.top;
                else throw P2.invalidParameterError("top", "integer", q.top);
            if (P2.defined(q.top) !== P2.defined(q.left)) throw Error("Expected both left and top to be set");
            else Y.hasOffset = P2.integer(q.top) && P2.integer(q.left);
            if (P2.defined(q.gravity))
                if (P2.integer(q.gravity) && P2.inRange(q.gravity, 0, 8)) Y.gravity = q.gravity;
                else if (P2.string(q.gravity) && P2.integer(this.constructor.gravity[q.gravity])) Y.gravity = this.constructor.gravity[q.gravity];
            else throw P2.invalidParameterError("gravity", "valid gravity", q.gravity);
            if (P2.defined(q.premultiplied))
                if (P2.bool(q.premultiplied)) Y.premultiplied = q.premultiplied;
                else throw P2.invalidParameterError("premultiplied", "boolean", q.premultiplied);
            return Y
        }), this
    }
    O44.exports = (A) => {
        A.prototype.composite = lE9, A.blend = Hv8
    }
})
// @from(Ln 224804, Col 4)
D44 = x((Gg2, M44) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var P8 = GB(),
        H44 = {
            integer: "integer",
            float: "float",
            approximate: "approximate"
        };

    function iE9(A, q) {
        if (!P8.defined(A)) return this.autoOrient();
        if (this.options.angle || this.options.rotationAngle) this.options.debuglog("ignoring previous rotate options"), this.options.angle = 0, this.options.rotationAngle = 0;
        if (P8.integer(A) && !(A % 90)) this.options.angle = A;
        else if (P8.number(A)) {
            if (this.options.rotationAngle = A, P8.object(q) && q.background) this._setBackgroundColourOption("rotationBackground", q.background)
        } else throw P8.invalidParameterError("angle", "numeric", A);
        return this
    }

    function nE9() {
        return this.options.input.autoOrient = !0, this
    }

    function rE9(A) {
        return this.options.flip = P8.bool(A) ? A : !0, this
    }

    function oE9(A) {
        return this.options.flop = P8.bool(A) ? A : !0, this
    }

    function aE9(A, q) {
        let K = [].concat(...A);
        if (K.length === 4 && K.every(P8.number)) this.options.affineMatrix = K;
        else throw P8.invalidParameterError("matrix", "1x4 or 2x2 array", A);
        if (P8.defined(q))
            if (P8.object(q)) {
                if (this._setBackgroundColourOption("affineBackground", q.background), P8.defined(q.idx))
                    if (P8.number(q.idx)) this.options.affineIdx = q.idx;
                    else throw P8.invalidParameterError("options.idx", "number", q.idx);
                if (P8.defined(q.idy))
                    if (P8.number(q.idy)) this.options.affineIdy = q.idy;
                    else throw P8.invalidParameterError("options.idy", "number", q.idy);
                if (P8.defined(q.odx))
                    if (P8.number(q.odx)) this.options.affineOdx = q.odx;
                    else throw P8.invalidParameterError("options.odx", "number", q.odx);
                if (P8.defined(q.ody))
                    if (P8.number(q.ody)) this.options.affineOdy = q.ody;
                    else throw P8.invalidParameterError("options.ody", "number", q.ody);
                if (P8.defined(q.interpolator))
                    if (P8.inArray(q.interpolator, Object.values(this.constructor.interpolators))) this.options.affineInterpolator = q.interpolator;
                    else throw P8.invalidParameterError("options.interpolator", "valid interpolator name", q.interpolator)
            } else throw P8.invalidParameterError("options", "object", q);
        return this
    }

    function sE9(A, q, K) {
        if (!P8.defined(A)) this.options.sharpenSigma = -1;
        else if (P8.bool(A)) this.options.sharpenSigma = A ? -1 : 0;
        else if (P8.number(A) && P8.inRange(A, 0.01, 1e4)) {
            if (this.options.sharpenSigma = A, P8.defined(q))
                if (P8.number(q) && P8.inRange(q, 0, 1e4)) this.options.sharpenM1 = q;
                else throw P8.invalidParameterError("flat", "number between 0 and 10000", q);
            if (P8.defined(K))
                if (P8.number(K) && P8.inRange(K, 0, 1e4)) this.options.sharpenM2 = K;
                else throw P8.invalidParameterError("jagged", "number between 0 and 10000", K)
        } else if (P8.plainObject(A)) {
            if (P8.number(A.sigma) && P8.inRange(A.sigma, 0.000001, 10)) this.options.sharpenSigma = A.sigma;
            else throw P8.invalidParameterError("options.sigma", "number between 0.000001 and 10", A.sigma);
            if (P8.defined(A.m1))
                if (P8.number(A.m1) && P8.inRange(A.m1, 0, 1e6)) this.options.sharpenM1 = A.m1;
                else throw P8.invalidParameterError("options.m1", "number between 0 and 1000000", A.m1);
            if (P8.defined(A.m2))
                if (P8.number(A.m2) && P8.inRange(A.m2, 0, 1e6)) this.options.sharpenM2 = A.m2;
                else throw P8.invalidParameterError("options.m2", "number between 0 and 1000000", A.m2);
            if (P8.defined(A.x1))
                if (P8.number(A.x1) && P8.inRange(A.x1, 0, 1e6)) this.options.sharpenX1 = A.x1;
                else throw P8.invalidParameterError("options.x1", "number between 0 and 1000000", A.x1);
            if (P8.defined(A.y2))
                if (P8.number(A.y2) && P8.inRange(A.y2, 0, 1e6)) this.options.sharpenY2 = A.y2;
                else throw P8.invalidParameterError("options.y2", "number between 0 and 1000000", A.y2);
            if (P8.defined(A.y3))
                if (P8.number(A.y3) && P8.inRange(A.y3, 0, 1e6)) this.options.sharpenY3 = A.y3;
                else throw P8.invalidParameterError("options.y3", "number between 0 and 1000000", A.y3)
        } else throw P8.invalidParameterError("sigma", "number between 0.01 and 10000", A);
        return this
    }

    function tE9(A) {
        if (!P8.defined(A)) this.options.medianSize = 3;
        else if (P8.integer(A) && P8.inRange(A, 1, 1000)) this.options.medianSize = A;
        else throw P8.invalidParameterError("size", "integer between 1 and 1000", A);
        return this
    }

    function eE9(A) {
        let q;
        if (P8.number(A)) q = A;
        else if (P8.plainObject(A)) {
            if (!P8.number(A.sigma)) throw P8.invalidParameterError("options.sigma", "number between 0.3 and 1000", q);
            if (q = A.sigma, "precision" in A)
                if (P8.string(H44[A.precision])) this.options.precision = H44[A.precision];
                else throw P8.invalidParameterError("precision", "one of: integer, float, approximate", A.precision);
            if ("minAmplitude" in A)
                if (P8.number(A.minAmplitude) && P8.inRange(A.minAmplitude, 0.001, 1)) this.options.minAmpl = A.minAmplitude;
                else throw P8.invalidParameterError("minAmplitude", "number between 0.001 and 1", A.minAmplitude)
        }
        if (!P8.defined(A)) this.options.blurSigma = -1;
        else if (P8.bool(A)) this.options.blurSigma = A ? -1 : 0;
        else if (P8.number(q) && P8.inRange(q, 0.3, 1000)) this.options.blurSigma = q;
        else throw P8.invalidParameterError("sigma", "number between 0.3 and 1000", q);
        return this
    }

    function j44(A) {
        if (!P8.defined(A)) this.options.dilateWidth = 1;
        else if (P8.integer(A) && A > 0) this.options.dilateWidth = A;
        else throw P8.invalidParameterError("dilate", "positive integer", j44);
        return this
    }

    function J44(A) {
        if (!P8.defined(A)) this.options.erodeWidth = 1;
        else if (P8.integer(A) && A > 0) this.options.erodeWidth = A;
        else throw P8.invalidParameterError("erode", "positive integer", J44);
        return this
    }

    function Ay9(A) {
        if (this.options.flatten = P8.bool(A) ? A : !0, P8.object(A)) this._setBackgroundColourOption("flattenBackground", A.background);
        return this
    }

    function qy9() {
        return this.options.unflatten = !0, this
    }

    function Ky9(A, q) {
        if (!P8.defined(A)) this.options.gamma = 2.2;
        else if (P8.number(A) && P8.inRange(A, 1, 3)) this.options.gamma = A;
        else throw P8.invalidParameterError("gamma", "number between 1.0 and 3.0", A);
        if (!P8.defined(q)) this.options.gammaOut = this.options.gamma;
        else if (P8.number(q) && P8.inRange(q, 1, 3)) this.options.gammaOut = q;
        else throw P8.invalidParameterError("gammaOut", "number between 1.0 and 3.0", q);
        return this
    }

    function Yy9(A) {
        if (this.options.negate = P8.bool(A) ? A : !0, P8.plainObject(A) && "alpha" in A)
            if (!P8.bool(A.alpha)) throw P8.invalidParameterError("alpha", "should be boolean value", A.alpha);
            else this.options.negateAlpha = A.alpha;
        return this
    }

    function zy9(A) {
        if (P8.plainObject(A)) {
            if (P8.defined(A.lower))
                if (P8.number(A.lower) && P8.inRange(A.lower, 0, 99)) this.options.normaliseLower = A.lower;
                else throw P8.invalidParameterError("lower", "number between 0 and 99", A.lower);
            if (P8.defined(A.upper))
                if (P8.number(A.upper) && P8.inRange(A.upper, 1, 100)) this.options.normaliseUpper = A.upper;
                else throw P8.invalidParameterError("upper", "number between 1 and 100", A.upper)
        }
        if (this.options.normaliseLower >= this.options.normaliseUpper) throw P8.invalidParameterError("range", "lower to be less than upper", `${this.options.normaliseLower} >= ${this.options.normaliseUpper}`);
        return this.options.normalise = !0, this
    }

    function _y9(A) {
        return this.normalise(A)
    }

    function wy9(A) {
        if (P8.plainObject(A)) {
            if (P8.integer(A.width) && A.width > 0) this.options.claheWidth = A.width;
            else throw P8.invalidParameterError("width", "integer greater than zero", A.width);
            if (P8.integer(A.height) && A.height > 0) this.options.claheHeight = A.height;
            else throw P8.invalidParameterError("height", "integer greater than zero", A.height);
            if (P8.defined(A.maxSlope))
                if (P8.integer(A.maxSlope) && P8.inRange(A.maxSlope, 0, 100)) this.options.claheMaxSlope = A.maxSlope;
                else throw P8.invalidParameterError("maxSlope", "integer between 0 and 100", A.maxSlope)
        } else throw P8.invalidParameterError("options", "plain object", A);
        return this
    }

    function Oy9(A) {
        if (!P8.object(A) || !Array.isArray(A.kernel) || !P8.integer(A.width) || !P8.integer(A.height) || !P8.inRange(A.width, 3, 1001) || !P8.inRange(A.height, 3, 1001) || A.height * A.width !== A.kernel.length) throw Error("Invalid convolution kernel");
        if (!P8.integer(A.scale)) A.scale = A.kernel.reduce((q, K) => q + K, 0);
        if (A.scale < 1) A.scale = 1;
        if (!P8.integer(A.offset)) A.offset = 0;
        return this.options.convKernel = A, this
    }

    function $y9(A, q) {
        if (!P8.defined(A)) this.options.threshold = 128;
        else if (P8.bool(A)) this.options.threshold = A ? 128 : 0;
        else if (P8.integer(A) && P8.inRange(A, 0, 255)) this.options.threshold = A;
        else throw P8.invalidParameterError("threshold", "integer between 0 and 255", A);
        if (!P8.object(q) || q.greyscale === !0 || q.grayscale === !0) this.options.thresholdGrayscale = !0;
        else this.options.thresholdGrayscale = !1;
        return this
    }

    function Hy9(A, q, K) {
        if (this.options.boolean = this._createInputDescriptor(A, K), P8.string(q) && P8.inArray(q, ["and", "or", "eor"])) this.options.booleanOp = q;
        else throw P8.invalidParameterError("operator", "one of: and, or, eor", q);
        return this
    }

    function jy9(A, q) {
        if (!P8.defined(A) && P8.number(q)) A = 1;
        else if (P8.number(A) && !P8.defined(q)) q = 0;
        if (!P8.defined(A)) this.options.linearA = [];
        else if (P8.number(A)) this.options.linearA = [A];
        else if (Array.isArray(A) && A.length && A.every(P8.number)) this.options.linearA = A;
        else throw P8.invalidParameterError("a", "number or array of numbers", A);
        if (!P8.defined(q)) this.options.linearB = [];
        else if (P8.number(q)) this.options.linearB = [q];
        else if (Array.isArray(q) && q.length && q.every(P8.number)) this.options.linearB = q;
        else throw P8.invalidParameterError("b", "number or array of numbers", q);
        if (this.options.linearA.length !== this.options.linearB.length) throw Error("Expected a and b to be arrays of the same length");
        return this
    }

    function Jy9(A) {
        if (!Array.isArray(A)) throw P8.invalidParameterError("inputMatrix", "array", A);
        if (A.length !== 3 && A.length !== 4) throw P8.invalidParameterError("inputMatrix", "3x3 or 4x4 array", A.length);
        let q = A.flat().map(Number);
        if (q.length !== 9 && q.length !== 16) throw P8.invalidParameterError("inputMatrix", "cardinality of 9 or 16", q.length);
        return this.options.recombMatrix = q, this
    }

    function My9(A) {
        if (!P8.plainObject(A)) throw P8.invalidParameterError("options", "plain object", A);
        if ("brightness" in A)
            if (P8.number(A.brightness) && A.brightness >= 0) this.options.brightness = A.brightness;
            else throw P8.invalidParameterError("brightness", "number above zero", A.brightness);
        if ("saturation" in A)
            if (P8.number(A.saturation) && A.saturation >= 0) this.options.saturation = A.saturation;
            else throw P8.invalidParameterError("saturation", "number above zero", A.saturation);
        if ("hue" in A)
            if (P8.integer(A.hue)) this.options.hue = A.hue % 360;
            else throw P8.invalidParameterError("hue", "number", A.hue);
        if ("lightness" in A)
            if (P8.number(A.lightness)) this.options.lightness = A.lightness;
            else throw P8.invalidParameterError("lightness", "number", A.lightness);
        return this
    }
    M44.exports = (A) => {
        Object.assign(A.prototype, {
            autoOrient: nE9,
            rotate: iE9,
            flip: rE9,
            flop: oE9,
            affine: aE9,
            sharpen: sE9,
            erode: J44,
            dilate: j44,
            median: tE9,
            blur: eE9,
            flatten: Ay9,
            unflatten: qy9,
            gamma: Ky9,
            negate: Yy9,
            normalise: zy9,
            normalize: _y9,
            clahe: wy9,
            convolve: Oy9,
            threshold: $y9,
            boolean: Hy9,
            linear: jy9,
            recomb: Jy9,
            modulate: My9
        })
    }
})