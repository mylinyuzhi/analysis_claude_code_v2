
// @from(Ln 141237, Col 4)
WW = R((bZ2, b77) => {
    var Y36 = rC1(),
        {
            MAX_LENGTH: x77,
            MAX_SAFE_INTEGER: z36
        } = nC1(),
        {
            safeRe: w36,
            t: H36
        } = vJ1(),
        GT5 = K36(),
        {
            compareIdentifiers: EJ1
        } = uqA();
    class WS {
        constructor(A, q) {
            if (q = GT5(q), A instanceof WS)
                if (A.loose === !!q.loose && A.includePrerelease === !!q.includePrerelease) return A;
                else A = A.version;
            else if (typeof A !== "string") throw TypeError(`Invalid version. Must be a string. Got type "${typeof A}".`);
            if (A.length > x77) throw TypeError(`version is longer than ${x77} characters`);
            Y36("SemVer", A, q), this.options = q, this.loose = !!q.loose, this.includePrerelease = !!q.includePrerelease;
            let K = A.trim().match(q.loose ? w36[H36.LOOSE] : w36[H36.FULL]);
            if (!K) throw TypeError(`Invalid Version: ${A}`);
            if (this.raw = A, this.major = +K[1], this.minor = +K[2], this.patch = +K[3], this.major > z36 || this.major < 0) throw TypeError("Invalid major version");
            if (this.minor > z36 || this.minor < 0) throw TypeError("Invalid minor version");
            if (this.patch > z36 || this.patch < 0) throw TypeError("Invalid patch version");
            if (!K[4]) this.prerelease = [];
            else this.prerelease = K[4].split(".").map((Y) => {
                if (/^[0-9]+$/.test(Y)) {
                    let z = +Y;
                    if (z >= 0 && z < z36) return z
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
            if (Y36("SemVer.compare", this.version, this.options, A), !(A instanceof WS)) {
                if (typeof A === "string" && A === this.version) return 0;
                A = new WS(A, this.options)
            }
            if (A.version === this.version) return 0;
            return this.compareMain(A) || this.comparePre(A)
        }
        compareMain(A) {
            if (!(A instanceof WS)) A = new WS(A, this.options);
            return EJ1(this.major, A.major) || EJ1(this.minor, A.minor) || EJ1(this.patch, A.patch)
        }
        comparePre(A) {
            if (!(A instanceof WS)) A = new WS(A, this.options);
            if (this.prerelease.length && !A.prerelease.length) return -1;
            else if (!this.prerelease.length && A.prerelease.length) return 1;
            else if (!this.prerelease.length && !A.prerelease.length) return 0;
            let q = 0;
            do {
                let K = this.prerelease[q],
                    Y = A.prerelease[q];
                if (Y36("prerelease compare", q, K, Y), K === void 0 && Y === void 0) return 0;
                else if (Y === void 0) return 1;
                else if (K === void 0) return -1;
                else if (K === Y) continue;
                else return EJ1(K, Y)
            } while (++q)
        }
        compareBuild(A) {
            if (!(A instanceof WS)) A = new WS(A, this.options);
            let q = 0;
            do {
                let K = this.build[q],
                    Y = A.build[q];
                if (Y36("build compare", q, K, Y), K === void 0 && Y === void 0) return 0;
                else if (Y === void 0) return 1;
                else if (K === void 0) return -1;
                else if (K === Y) continue;
                else return EJ1(K, Y)
            } while (++q)
        }
        inc(A, q, K) {
            if (A.startsWith("pre")) {
                if (!q && K === !1) throw Error("invalid increment argument: identifier is empty");
                if (q) {
                    let Y = `-${q}`.match(this.options.loose ? w36[H36.PRERELEASELOOSE] : w36[H36.PRERELEASE]);
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
                        if (EJ1(this.prerelease[0], q) === 0) {
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
    b77.exports = WS
})
// @from(Ln 141390, Col 4)
E71 = R((uZ2, B77) => {
    var u77 = WW(),
        ZT5 = (A, q, K = !1) => {
            if (A instanceof u77) return A;
            try {
                return new u77(A, q)
            } catch (Y) {
                if (!K) return null;
                throw Y
            }
        };
    B77.exports = ZT5
})
// @from(Ln 141403, Col 4)
F77 = R((BZ2, m77) => {
    var fT5 = E71(),
        VT5 = (A, q) => {
            let K = fT5(A, q);
            return K ? K.version : null
        };
    m77.exports = VT5
})
// @from(Ln 141411, Col 4)
g77 = R((mZ2, Q77) => {
    var NT5 = E71(),
        TT5 = (A, q) => {
            let K = NT5(A.trim().replace(/^[=v]+/, ""), q);
            return K ? K.version : null
        };
    Q77.exports = TT5
})
// @from(Ln 141419, Col 4)
d77 = R((FZ2, p77) => {
    var U77 = WW(),
        vT5 = (A, q, K, Y, z) => {
            if (typeof K === "string") z = Y, Y = K, K = void 0;
            try {
                return new U77(A instanceof U77 ? A.version : A, K).inc(q, Y, z).version
            } catch (w) {
                return null
            }
        };
    p77.exports = vT5
})
// @from(Ln 141431, Col 4)
i77 = R((QZ2, l77) => {
    var c77 = E71(),
        ET5 = (A, q) => {
            let K = c77(A, null, !0),
                Y = c77(q, null, !0),
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
    l77.exports = ET5
})
// @from(Ln 141457, Col 4)
r77 = R((gZ2, n77) => {
    var kT5 = WW(),
        LT5 = (A, q) => new kT5(A, q).major;
    n77.exports = LT5
})
// @from(Ln 141462, Col 4)
a77 = R((UZ2, o77) => {
    var RT5 = WW(),
        yT5 = (A, q) => new RT5(A, q).minor;
    o77.exports = yT5
})
// @from(Ln 141467, Col 4)
t77 = R((pZ2, s77) => {
    var CT5 = WW(),
        ST5 = (A, q) => new CT5(A, q).patch;
    s77.exports = ST5
})
// @from(Ln 141472, Col 4)
A47 = R((dZ2, e77) => {
    var hT5 = E71(),
        IT5 = (A, q) => {
            let K = hT5(A, q);
            return K && K.prerelease.length ? K.prerelease : null
        };
    e77.exports = IT5
})
// @from(Ln 141480, Col 4)
NL = R((cZ2, K47) => {
    var q47 = WW(),
        xT5 = (A, q, K) => new q47(A, K).compare(new q47(q, K));
    K47.exports = xT5
})
// @from(Ln 141485, Col 4)
z47 = R((lZ2, Y47) => {
    var bT5 = NL(),
        uT5 = (A, q, K) => bT5(q, A, K);
    Y47.exports = uT5
})
// @from(Ln 141490, Col 4)
H47 = R((iZ2, w47) => {
    var BT5 = NL(),
        mT5 = (A, q) => BT5(A, q, !0);
    w47.exports = mT5
})
// @from(Ln 141495, Col 4)
$36 = R((nZ2, O47) => {
    var $47 = WW(),
        FT5 = (A, q, K) => {
            let Y = new $47(A, K),
                z = new $47(q, K);
            return Y.compare(z) || Y.compareBuild(z)
        };
    O47.exports = FT5
})
// @from(Ln 141504, Col 4)
J47 = R((rZ2, _47) => {
    var QT5 = $36(),
        gT5 = (A, q) => A.sort((K, Y) => QT5(K, Y, q));
    _47.exports = gT5
})
// @from(Ln 141509, Col 4)
D47 = R((oZ2, X47) => {
    var UT5 = $36(),
        pT5 = (A, q) => A.sort((K, Y) => UT5(Y, K, q));
    X47.exports = pT5
})
// @from(Ln 141514, Col 4)
oC1 = R((aZ2, j47) => {
    var dT5 = NL(),
        cT5 = (A, q, K) => dT5(A, q, K) > 0;
    j47.exports = cT5
})
// @from(Ln 141519, Col 4)
O36 = R((sZ2, M47) => {
    var lT5 = NL(),
        iT5 = (A, q, K) => lT5(A, q, K) < 0;
    M47.exports = iT5
})
// @from(Ln 141524, Col 4)
BqA = R((tZ2, P47) => {
    var nT5 = NL(),
        rT5 = (A, q, K) => nT5(A, q, K) === 0;
    P47.exports = rT5
})
// @from(Ln 141529, Col 4)
mqA = R((eZ2, W47) => {
    var oT5 = NL(),
        aT5 = (A, q, K) => oT5(A, q, K) !== 0;
    W47.exports = aT5
})
// @from(Ln 141534, Col 4)
_36 = R((Af2, G47) => {
    var sT5 = NL(),
        tT5 = (A, q, K) => sT5(A, q, K) >= 0;
    G47.exports = tT5
})
// @from(Ln 141539, Col 4)
J36 = R((qf2, Z47) => {
    var eT5 = NL(),
        Av5 = (A, q, K) => eT5(A, q, K) <= 0;
    Z47.exports = Av5
})
// @from(Ln 141544, Col 4)
FqA = R((Kf2, f47) => {
    var qv5 = BqA(),
        Kv5 = mqA(),
        Yv5 = oC1(),
        zv5 = _36(),
        wv5 = O36(),
        Hv5 = J36(),
        $v5 = (A, q, K, Y) => {
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
                    return qv5(A, K, Y);
                case "!=":
                    return Kv5(A, K, Y);
                case ">":
                    return Yv5(A, K, Y);
                case ">=":
                    return zv5(A, K, Y);
                case "<":
                    return wv5(A, K, Y);
                case "<=":
                    return Hv5(A, K, Y);
                default:
                    throw TypeError(`Invalid operator: ${q}`)
            }
        };
    f47.exports = $v5
})
// @from(Ln 141581, Col 4)
N47 = R((Yf2, V47) => {
    var Ov5 = WW(),
        _v5 = E71(),
        {
            safeRe: X36,
            t: D36
        } = vJ1(),
        Jv5 = (A, q) => {
            if (A instanceof Ov5) return A;
            if (typeof A === "number") A = String(A);
            if (typeof A !== "string") return null;
            q = q || {};
            let K = null;
            if (!q.rtl) K = A.match(q.includePrerelease ? X36[D36.COERCEFULL] : X36[D36.COERCE]);
            else {
                let O = q.includePrerelease ? X36[D36.COERCERTLFULL] : X36[D36.COERCERTL],
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
            return _v5(`${Y}.${z}.${w}${H}${$}`, q)
        };
    V47.exports = Jv5
})
// @from(Ln 141614, Col 4)
E47 = R((zf2, v47) => {
    class T47 {
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
    v47.exports = T47
})
// @from(Ln 141640, Col 4)
TL = R((wf2, y47) => {
    var Xv5 = /\s+/g;
    class aC1 {
        constructor(A, q) {
            if (q = jv5(q), A instanceof aC1)
                if (A.loose === !!q.loose && A.includePrerelease === !!q.includePrerelease) return A;
                else return new aC1(A.raw, q);
            if (A instanceof QqA) return this.raw = A.value, this.set = [
                [A]
            ], this.formatted = void 0, this;
            if (this.options = q, this.loose = !!q.loose, this.includePrerelease = !!q.includePrerelease, this.raw = A.trim().replace(Xv5, " "), this.set = this.raw.split("||").map((K) => this.parseRange(K.trim())).filter((K) => K.length), !this.set.length) throw TypeError(`Invalid SemVer Range: ${this.raw}`);
            if (this.set.length > 1) {
                let K = this.set[0];
                if (this.set = this.set.filter((Y) => !L47(Y[0])), this.set.length === 0) this.set = [K];
                else if (this.set.length > 1) {
                    for (let Y of this.set)
                        if (Y.length === 1 && Vv5(Y[0])) {
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
            let K = ((this.options.includePrerelease && Zv5) | (this.options.loose && fv5)) + ":" + A,
                Y = k47.get(K);
            if (Y) return Y;
            let z = this.options.loose,
                w = z ? vV[lG.HYPHENRANGELOOSE] : vV[lG.HYPHENRANGE];
            A = A.replace(w, Sv5(this.options.includePrerelease)), nH("hyphen replace", A), A = A.replace(vV[lG.COMPARATORTRIM], Pv5), nH("comparator trim", A), A = A.replace(vV[lG.TILDETRIM], Wv5), nH("tilde trim", A), A = A.replace(vV[lG.CARETTRIM], Gv5), nH("caret trim", A);
            let H = A.split(" ").map((J) => Nv5(J, this.options)).join(" ").split(/\s+/).map((J) => Cv5(J, this.options));
            if (z) H = H.filter((J) => {
                return nH("loose invalid filter", J, this.options), !!J.match(vV[lG.COMPARATORLOOSE])
            });
            nH("range list", H);
            let $ = new Map,
                O = H.map((J) => new QqA(J, this.options));
            for (let J of O) {
                if (L47(J)) return [J];
                $.set(J.value, J)
            }
            if ($.size > 1 && $.has("")) $.delete("");
            let _ = [...$.values()];
            return k47.set(K, _), _
        }
        intersects(A, q) {
            if (!(A instanceof aC1)) throw TypeError("a Range is required");
            return this.set.some((K) => {
                return R47(K, q) && A.set.some((Y) => {
                    return R47(Y, q) && K.every((z) => {
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
                A = new Mv5(A, this.options)
            } catch (q) {
                return !1
            }
            for (let q = 0; q < this.set.length; q++)
                if (hv5(this.set[q], A, this.options)) return !0;
            return !1
        }
    }
    y47.exports = aC1;
    var Dv5 = E47(),
        k47 = new Dv5,
        jv5 = K36(),
        QqA = sC1(),
        nH = rC1(),
        Mv5 = WW(),
        {
            safeRe: vV,
            t: lG,
            comparatorTrimReplace: Pv5,
            tildeTrimReplace: Wv5,
            caretTrimReplace: Gv5
        } = vJ1(),
        {
            FLAG_INCLUDE_PRERELEASE: Zv5,
            FLAG_LOOSE: fv5
        } = nC1(),
        L47 = (A) => A.value === "<0.0.0-0",
        Vv5 = (A) => A.value === "",
        R47 = (A, q) => {
            let K = !0,
                Y = A.slice(),
                z = Y.pop();
            while (K && Y.length) K = Y.every((w) => {
                return z.intersects(w, q)
            }), z = Y.pop();
            return K
        },
        Nv5 = (A, q) => {
            return nH("comp", A, q), A = Ev5(A, q), nH("caret", A), A = Tv5(A, q), nH("tildes", A), A = Lv5(A, q), nH("xrange", A), A = yv5(A, q), nH("stars", A), A
        },
        iG = (A) => !A || A.toLowerCase() === "x" || A === "*",
        Tv5 = (A, q) => {
            return A.trim().split(/\s+/).map((K) => vv5(K, q)).join(" ")
        },
        vv5 = (A, q) => {
            let K = q.loose ? vV[lG.TILDELOOSE] : vV[lG.TILDE];
            return A.replace(K, (Y, z, w, H, $) => {
                nH("tilde", A, Y, z, w, H, $);
                let O;
                if (iG(z)) O = "";
                else if (iG(w)) O = `>=${z}.0.0 <${+z+1}.0.0-0`;
                else if (iG(H)) O = `>=${z}.${w}.0 <${z}.${+w+1}.0-0`;
                else if ($) nH("replaceTilde pr", $), O = `>=${z}.${w}.${H}-${$} <${z}.${+w+1}.0-0`;
                else O = `>=${z}.${w}.${H} <${z}.${+w+1}.0-0`;
                return nH("tilde return", O), O
            })
        },
        Ev5 = (A, q) => {
            return A.trim().split(/\s+/).map((K) => kv5(K, q)).join(" ")
        },
        kv5 = (A, q) => {
            nH("caret", A, q);
            let K = q.loose ? vV[lG.CARETLOOSE] : vV[lG.CARET],
                Y = q.includePrerelease ? "-0" : "";
            return A.replace(K, (z, w, H, $, O) => {
                nH("caret", A, z, w, H, $, O);
                let _;
                if (iG(w)) _ = "";
                else if (iG(H)) _ = `>=${w}.0.0${Y} <${+w+1}.0.0-0`;
                else if (iG($))
                    if (w === "0") _ = `>=${w}.${H}.0${Y} <${w}.${+H+1}.0-0`;
                    else _ = `>=${w}.${H}.0${Y} <${+w+1}.0.0-0`;
                else if (O)
                    if (nH("replaceCaret pr", O), w === "0")
                        if (H === "0") _ = `>=${w}.${H}.${$}-${O} <${w}.${H}.${+$+1}-0`;
                        else _ = `>=${w}.${H}.${$}-${O} <${w}.${+H+1}.0-0`;
                else _ = `>=${w}.${H}.${$}-${O} <${+w+1}.0.0-0`;
                else if (nH("no pr"), w === "0")
                    if (H === "0") _ = `>=${w}.${H}.${$}${Y} <${w}.${H}.${+$+1}-0`;
                    else _ = `>=${w}.${H}.${$}${Y} <${w}.${+H+1}.0-0`;
                else _ = `>=${w}.${H}.${$} <${+w+1}.0.0-0`;
                return nH("caret return", _), _
            })
        },
        Lv5 = (A, q) => {
            return nH("replaceXRanges", A, q), A.split(/\s+/).map((K) => Rv5(K, q)).join(" ")
        },
        Rv5 = (A, q) => {
            A = A.trim();
            let K = q.loose ? vV[lG.XRANGELOOSE] : vV[lG.XRANGE];
            return A.replace(K, (Y, z, w, H, $, O) => {
                nH("xRange", A, Y, z, w, H, $, O);
                let _ = iG(w),
                    J = _ || iG(H),
                    X = J || iG($),
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
                return nH("xRange return", Y), Y
            })
        },
        yv5 = (A, q) => {
            return nH("replaceStars", A, q), A.trim().replace(vV[lG.STAR], "")
        },
        Cv5 = (A, q) => {
            return nH("replaceGTE0", A, q), A.trim().replace(vV[q.includePrerelease ? lG.GTE0PRE : lG.GTE0], "")
        },
        Sv5 = (A) => (q, K, Y, z, w, H, $, O, _, J, X, D) => {
            if (iG(Y)) K = "";
            else if (iG(z)) K = `>=${Y}.0.0${A?"-0":""}`;
            else if (iG(w)) K = `>=${Y}.${z}.0${A?"-0":""}`;
            else if (H) K = `>=${K}`;
            else K = `>=${K}${A?"-0":""}`;
            if (iG(_)) O = "";
            else if (iG(J)) O = `<${+_+1}.0.0-0`;
            else if (iG(X)) O = `<${_}.${+J+1}.0-0`;
            else if (D) O = `<=${_}.${J}.${X}-${D}`;
            else if (A) O = `<${_}.${J}.${+X+1}-0`;
            else O = `<=${O}`;
            return `${K} ${O}`.trim()
        },
        hv5 = (A, q, K) => {
            for (let Y = 0; Y < A.length; Y++)
                if (!A[Y].test(q)) return !1;
            if (q.prerelease.length && !K.includePrerelease) {
                for (let Y = 0; Y < A.length; Y++) {
                    if (nH(A[Y].semver), A[Y].semver === QqA.ANY) continue;
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
// @from(Ln 141873, Col 4)
sC1 = R((Hf2, b47) => {
    var tC1 = Symbol("SemVer ANY");
    class j36 {
        static get ANY() {
            return tC1
        }
        constructor(A, q) {
            if (q = C47(q), A instanceof j36)
                if (A.loose === !!q.loose) return A;
                else A = A.value;
            if (A = A.trim().split(/\s+/).join(" "), UqA("comparator", A, q), this.options = q, this.loose = !!q.loose, this.parse(A), this.semver === tC1) this.value = "";
            else this.value = this.operator + this.semver.version;
            UqA("comp", this)
        }
        parse(A) {
            let q = this.options.loose ? S47[h47.COMPARATORLOOSE] : S47[h47.COMPARATOR],
                K = A.match(q);
            if (!K) throw TypeError(`Invalid comparator: ${A}`);
            if (this.operator = K[1] !== void 0 ? K[1] : "", this.operator === "=") this.operator = "";
            if (!K[2]) this.semver = tC1;
            else this.semver = new I47(K[2], this.options.loose)
        }
        toString() {
            return this.value
        }
        test(A) {
            if (UqA("Comparator.test", A, this.options.loose), this.semver === tC1 || A === tC1) return !0;
            if (typeof A === "string") try {
                A = new I47(A, this.options)
            } catch (q) {
                return !1
            }
            return gqA(A, this.operator, this.semver, this.options)
        }
        intersects(A, q) {
            if (!(A instanceof j36)) throw TypeError("a Comparator is required");
            if (this.operator === "") {
                if (this.value === "") return !0;
                return new x47(A.value, q).test(this.value)
            } else if (A.operator === "") {
                if (A.value === "") return !0;
                return new x47(this.value, q).test(A.semver)
            }
            if (q = C47(q), q.includePrerelease && (this.value === "<0.0.0-0" || A.value === "<0.0.0-0")) return !1;
            if (!q.includePrerelease && (this.value.startsWith("<0.0.0") || A.value.startsWith("<0.0.0"))) return !1;
            if (this.operator.startsWith(">") && A.operator.startsWith(">")) return !0;
            if (this.operator.startsWith("<") && A.operator.startsWith("<")) return !0;
            if (this.semver.version === A.semver.version && this.operator.includes("=") && A.operator.includes("=")) return !0;
            if (gqA(this.semver, "<", A.semver, q) && this.operator.startsWith(">") && A.operator.startsWith("<")) return !0;
            if (gqA(this.semver, ">", A.semver, q) && this.operator.startsWith("<") && A.operator.startsWith(">")) return !0;
            return !1
        }
    }
    b47.exports = j36;
    var C47 = K36(),
        {
            safeRe: S47,
            t: h47
        } = vJ1(),
        gqA = FqA(),
        UqA = rC1(),
        I47 = WW(),
        x47 = TL()
})
// @from(Ln 141937, Col 4)
eC1 = R(($f2, u47) => {
    var Iv5 = TL(),
        xv5 = (A, q, K) => {
            try {
                q = new Iv5(q, K)
            } catch (Y) {
                return !1
            }
            return q.test(A)
        };
    u47.exports = xv5
})
// @from(Ln 141949, Col 4)
m47 = R((Of2, B47) => {
    var bv5 = TL(),
        uv5 = (A, q) => new bv5(A, q).set.map((K) => K.map((Y) => Y.value).join(" ").trim().split(" "));
    B47.exports = uv5
})
// @from(Ln 141954, Col 4)
Q47 = R((_f2, F47) => {
    var Bv5 = WW(),
        mv5 = TL(),
        Fv5 = (A, q, K) => {
            let Y = null,
                z = null,
                w = null;
            try {
                w = new mv5(q, K)
            } catch (H) {
                return null
            }
            return A.forEach((H) => {
                if (w.test(H)) {
                    if (!Y || z.compare(H) === -1) Y = H, z = new Bv5(Y, K)
                }
            }), Y
        };
    F47.exports = Fv5
})
// @from(Ln 141974, Col 4)
U47 = R((Jf2, g47) => {
    var Qv5 = WW(),
        gv5 = TL(),
        Uv5 = (A, q, K) => {
            let Y = null,
                z = null,
                w = null;
            try {
                w = new gv5(q, K)
            } catch (H) {
                return null
            }
            return A.forEach((H) => {
                if (w.test(H)) {
                    if (!Y || z.compare(H) === 1) Y = H, z = new Qv5(Y, K)
                }
            }), Y
        };
    g47.exports = Uv5
})
// @from(Ln 141994, Col 4)
c47 = R((Xf2, d47) => {
    var pqA = WW(),
        pv5 = TL(),
        p47 = oC1(),
        dv5 = (A, q) => {
            A = new pv5(A, q);
            let K = new pqA("0.0.0");
            if (A.test(K)) return K;
            if (K = new pqA("0.0.0-0"), A.test(K)) return K;
            K = null;
            for (let Y = 0; Y < A.set.length; ++Y) {
                let z = A.set[Y],
                    w = null;
                if (z.forEach((H) => {
                        let $ = new pqA(H.semver.version);
                        switch (H.operator) {
                            case ">":
                                if ($.prerelease.length === 0) $.patch++;
                                else $.prerelease.push(0);
                                $.raw = $.format();
                            case "":
                            case ">=":
                                if (!w || p47($, w)) w = $;
                                break;
                            case "<":
                            case "<=":
                                break;
                            default:
                                throw Error(`Unexpected operation: ${H.operator}`)
                        }
                    }), w && (!K || p47(K, w))) K = w
            }
            if (K && A.test(K)) return K;
            return null
        };
    d47.exports = dv5
})
// @from(Ln 142031, Col 4)
i47 = R((Df2, l47) => {
    var cv5 = TL(),
        lv5 = (A, q) => {
            try {
                return new cv5(A, q).range || "*"
            } catch (K) {
                return null
            }
        };
    l47.exports = lv5
})
// @from(Ln 142042, Col 4)
M36 = R((jf2, a47) => {
    var iv5 = WW(),
        o47 = sC1(),
        {
            ANY: nv5
        } = o47,
        rv5 = TL(),
        ov5 = eC1(),
        n47 = oC1(),
        r47 = O36(),
        av5 = J36(),
        sv5 = _36(),
        tv5 = (A, q, K, Y) => {
            A = new iv5(A, Y), q = new rv5(q, Y);
            let z, w, H, $, O;
            switch (K) {
                case ">":
                    z = n47, w = av5, H = r47, $ = ">", O = ">=";
                    break;
                case "<":
                    z = r47, w = sv5, H = n47, $ = "<", O = "<=";
                    break;
                default:
                    throw TypeError('Must provide a hilo val of "<" or ">"')
            }
            if (ov5(A, q, Y)) return !1;
            for (let _ = 0; _ < q.set.length; ++_) {
                let J = q.set[_],
                    X = null,
                    D = null;
                if (J.forEach((j) => {
                        if (j.semver === nv5) j = new o47(">=0.0.0");
                        if (X = X || j, D = D || j, z(j.semver, X.semver, Y)) X = j;
                        else if (H(j.semver, D.semver, Y)) D = j
                    }), X.operator === $ || X.operator === O) return !1;
                if ((!D.operator || D.operator === $) && w(A, D.semver)) return !1;
                else if (D.operator === O && H(A, D.semver)) return !1
            }
            return !0
        };
    a47.exports = tv5
})
// @from(Ln 142084, Col 4)
t47 = R((Mf2, s47) => {
    var ev5 = M36(),
        AE5 = (A, q, K) => ev5(A, q, ">", K);
    s47.exports = AE5
})
// @from(Ln 142089, Col 4)
Aq7 = R((Pf2, e47) => {
    var qE5 = M36(),
        KE5 = (A, q, K) => qE5(A, q, "<", K);
    e47.exports = KE5
})
// @from(Ln 142094, Col 4)
Yq7 = R((Wf2, Kq7) => {
    var qq7 = TL(),
        YE5 = (A, q, K) => {
            return A = new qq7(A, K), q = new qq7(q, K), A.intersects(q, K)
        };
    Kq7.exports = YE5
})
// @from(Ln 142101, Col 4)
wq7 = R((Gf2, zq7) => {
    var zE5 = eC1(),
        wE5 = NL();
    zq7.exports = (A, q, K) => {
        let Y = [],
            z = null,
            w = null,
            H = A.sort((J, X) => wE5(J, X, K));
        for (let J of H)
            if (zE5(J, q, K)) {
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
// @from(Ln 142128, Col 4)
Xq7 = R((Zf2, Jq7) => {
    var Hq7 = TL(),
        cqA = sC1(),
        {
            ANY: dqA
        } = cqA,
        AS1 = eC1(),
        lqA = NL(),
        HE5 = (A, q, K = {}) => {
            if (A === q) return !0;
            A = new Hq7(A, K), q = new Hq7(q, K);
            let Y = !1;
            A: for (let z of A.set) {
                for (let w of q.set) {
                    let H = OE5(z, w, K);
                    if (Y = Y || H !== null, H) continue A
                }
                if (Y) return !1
            }
            return !0
        },
        $E5 = [new cqA(">=0.0.0-0")],
        $q7 = [new cqA(">=0.0.0")],
        OE5 = (A, q, K) => {
            if (A === q) return !0;
            if (A.length === 1 && A[0].semver === dqA)
                if (q.length === 1 && q[0].semver === dqA) return !0;
                else if (K.includePrerelease) A = $E5;
            else A = $q7;
            if (q.length === 1 && q[0].semver === dqA)
                if (K.includePrerelease) return !0;
                else q = $q7;
            let Y = new Set,
                z, w;
            for (let j of A)
                if (j.operator === ">" || j.operator === ">=") z = Oq7(z, j, K);
                else if (j.operator === "<" || j.operator === "<=") w = _q7(w, j, K);
            else Y.add(j.semver);
            if (Y.size > 1) return null;
            let H;
            if (z && w) {
                if (H = lqA(z.semver, w.semver, K), H > 0) return null;
                else if (H === 0 && (z.operator !== ">=" || w.operator !== "<=")) return null
            }
            for (let j of Y) {
                if (z && !AS1(j, String(z), K)) return null;
                if (w && !AS1(j, String(w), K)) return null;
                for (let M of q)
                    if (!AS1(j, String(M), K)) return !1;
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
                        if ($ = Oq7(z, j, K), $ === j && $ !== z) return !1
                    } else if (z.operator === ">=" && !AS1(z.semver, String(j), K)) return !1
                }
                if (w) {
                    if (X) {
                        if (j.semver.prerelease && j.semver.prerelease.length && j.semver.major === X.major && j.semver.minor === X.minor && j.semver.patch === X.patch) X = !1
                    }
                    if (j.operator === "<" || j.operator === "<=") {
                        if (O = _q7(w, j, K), O === j && O !== w) return !1
                    } else if (w.operator === "<=" && !AS1(w.semver, String(j), K)) return !1
                }
                if (!j.operator && (w || z) && H !== 0) return !1
            }
            if (z && _ && !w && H !== 0) return !1;
            if (w && J && !z && H !== 0) return !1;
            if (D || X) return !1;
            return !0
        },
        Oq7 = (A, q, K) => {
            if (!A) return q;
            let Y = lqA(A.semver, q.semver, K);
            return Y > 0 ? A : Y < 0 ? q : q.operator === ">" && A.operator === ">=" ? q : A
        },
        _q7 = (A, q, K) => {
            if (!A) return q;
            let Y = lqA(A.semver, q.semver, K);
            return Y < 0 ? A : Y > 0 ? q : q.operator === "<" && A.operator === "<=" ? q : A
        };
    Jq7.exports = HE5
})
// @from(Ln 142218, Col 4)
GS = R((ff2, Mq7) => {
    var iqA = vJ1(),
        Dq7 = nC1(),
        _E5 = WW(),
        jq7 = uqA(),
        JE5 = E71(),
        XE5 = F77(),
        DE5 = g77(),
        jE5 = d77(),
        ME5 = i77(),
        PE5 = r77(),
        WE5 = a77(),
        GE5 = t77(),
        ZE5 = A47(),
        fE5 = NL(),
        VE5 = z47(),
        NE5 = H47(),
        TE5 = $36(),
        vE5 = J47(),
        EE5 = D47(),
        kE5 = oC1(),
        LE5 = O36(),
        RE5 = BqA(),
        yE5 = mqA(),
        CE5 = _36(),
        SE5 = J36(),
        hE5 = FqA(),
        IE5 = N47(),
        xE5 = sC1(),
        bE5 = TL(),
        uE5 = eC1(),
        BE5 = m47(),
        mE5 = Q47(),
        FE5 = U47(),
        QE5 = c47(),
        gE5 = i47(),
        UE5 = M36(),
        pE5 = t47(),
        dE5 = Aq7(),
        cE5 = Yq7(),
        lE5 = wq7(),
        iE5 = Xq7();
    Mq7.exports = {
        parse: JE5,
        valid: XE5,
        clean: DE5,
        inc: jE5,
        diff: ME5,
        major: PE5,
        minor: WE5,
        patch: GE5,
        prerelease: ZE5,
        compare: fE5,
        rcompare: VE5,
        compareLoose: NE5,
        compareBuild: TE5,
        sort: vE5,
        rsort: EE5,
        gt: kE5,
        lt: LE5,
        eq: RE5,
        neq: yE5,
        gte: CE5,
        lte: SE5,
        cmp: hE5,
        coerce: IE5,
        Comparator: xE5,
        Range: bE5,
        satisfies: uE5,
        toComparators: BE5,
        maxSatisfying: mE5,
        minSatisfying: FE5,
        minVersion: QE5,
        validRange: gE5,
        outside: UE5,
        gtr: pE5,
        ltr: dE5,
        intersects: cE5,
        simplifyRange: lE5,
        subset: iE5,
        SemVer: _E5,
        re: iqA.re,
        src: iqA.src,
        tokens: iqA.t,
        SEMVER_SPEC_VERSION: Dq7.SEMVER_SPEC_VERSION,
        RELEASE_TYPES: Dq7.RELEASE_TYPES,
        compareIdentifiers: jq7.compareIdentifiers,
        rcompareIdentifiers: jq7.rcompareIdentifiers
    }
})
// @from(Ln 142308, Col 4)
nqA
// @from(Ln 142308, Col 9)
nE5
// @from(Ln 142308, Col 14)
rE5
// @from(Ln 142308, Col 19)
oE5
// @from(Ln 142308, Col 24)
kJ1
// @from(Ln 142309, Col 4)
P36 = v(() => {
    x3();
    nqA = o(GS(), 1), nE5 = eA() === "windows" ? "alt+v" : "ctrl+v", rE5 = eA() !== "windows" || (s21() ? nqA.default.satisfies(process.versions.bun, ">=1.2.23") : nqA.default.satisfies(process.versions.node, ">=22.17.0 <23.0.0 || >=24.2.0")), oE5 = rE5 ? "shift+tab" : "meta+m", kJ1 = [{
        context: "Global",
        bindings: {
            "ctrl+c": "app:interrupt",
            "ctrl+d": "app:exit",
            "ctrl+t": "app:toggleTodos",
            "ctrl+o": "app:toggleTranscript",
            "ctrl+shift+o": "app:toggleTeammatePreview",
            "ctrl+r": "history:search",
            ...{},
            ...{}
        }
    }, {
        context: "Chat",
        bindings: {
            escape: "chat:cancel",
            [oE5]: "chat:cycleMode",
            "meta+p": "chat:modelPicker",
            "meta+t": "chat:thinkingToggle",
            enter: "chat:submit",
            up: "history:previous",
            down: "history:next",
            "ctrl+_": "chat:undo",
            "ctrl+shift+-": "chat:undo",
            "ctrl+g": "chat:externalEditor",
            "ctrl+s": "chat:stash",
            [nE5]: "chat:imagePaste",
            ...{}
        }
    }, {
        context: "Autocomplete",
        bindings: {
            tab: "autocomplete:accept",
            escape: "autocomplete:dismiss",
            up: "autocomplete:previous",
            down: "autocomplete:next"
        }
    }, {
        context: "Settings",
        bindings: {
            escape: "confirm:no",
            up: "select:previous",
            down: "select:next",
            k: "select:previous",
            j: "select:next",
            "ctrl+p": "select:previous",
            "ctrl+n": "select:next",
            enter: "select:accept",
            space: "select:accept",
            "/": "settings:search",
            r: "settings:retry"
        }
    }, {
        context: "Confirmation",
        bindings: {
            y: "confirm:yes",
            n: "confirm:no",
            enter: "confirm:yes",
            escape: "confirm:no",
            up: "confirm:previous",
            down: "confirm:next",
            tab: "confirm:nextField",
            space: "confirm:toggle",
            "shift+tab": "confirm:cycleMode",
            "ctrl+e": "confirm:toggleExplanation",
            "ctrl+d": "permission:toggleDebug"
        }
    }, {
        context: "Tabs",
        bindings: {
            tab: "tabs:next",
            "shift+tab": "tabs:previous",
            right: "tabs:next",
            left: "tabs:previous"
        }
    }, {
        context: "Transcript",
        bindings: {
            "ctrl+e": "transcript:toggleShowAll",
            "ctrl+c": "transcript:exit",
            escape: "transcript:exit"
        }
    }, {
        context: "HistorySearch",
        bindings: {
            "ctrl+r": "historySearch:next",
            escape: "historySearch:accept",
            tab: "historySearch:accept",
            "ctrl+c": "historySearch:cancel",
            enter: "historySearch:execute"
        }
    }, {
        context: "Task",
        bindings: {
            "ctrl+b": "task:background"
        }
    }, {
        context: "ThemePicker",
        bindings: {
            "ctrl+t": "theme:toggleSyntaxHighlighting"
        }
    }, {
        context: "Help",
        bindings: {
            escape: "help:dismiss"
        }
    }, {
        context: "Attachments",
        bindings: {
            right: "attachments:next",
            left: "attachments:previous",
            backspace: "attachments:remove",
            delete: "attachments:remove",
            down: "attachments:exit",
            escape: "attachments:exit"
        }
    }, {
        context: "Footer",
        bindings: {
            right: "footer:next",
            left: "footer:previous",
            enter: "footer:openSelected",
            escape: "footer:clearSelection"
        }
    }, {
        context: "MessageSelector",
        bindings: {
            up: "messageSelector:up",
            down: "messageSelector:down",
            k: "messageSelector:up",
            j: "messageSelector:down",
            "ctrl+up": "messageSelector:top",
            "shift+up": "messageSelector:top",
            "meta+up": "messageSelector:top",
            "shift+k": "messageSelector:top",
            "ctrl+down": "messageSelector:bottom",
            "shift+down": "messageSelector:bottom",
            "meta+down": "messageSelector:bottom",
            "shift+j": "messageSelector:bottom",
            enter: "messageSelector:select"
        }
    }, {
        context: "DiffDialog",
        bindings: {
            escape: "diff:dismiss",
            left: "diff:previousSource",
            right: "diff:nextSource",
            up: "diff:previousFile",
            down: "diff:nextFile",
            enter: "diff:viewDetails"
        }
    }, {
        context: "ModelPicker",
        bindings: {
            left: "modelPicker:decreaseEffort",
            right: "modelPicker:increaseEffort"
        }
    }, {
        context: "Select",
        bindings: {
            up: "select:previous",
            down: "select:next",
            j: "select:next",
            k: "select:previous",
            "ctrl+n": "select:next",
            "ctrl+p": "select:previous",
            enter: "select:accept",
            escape: "select:cancel"
        }
    }, {
        context: "Plugin",
        bindings: {
            space: "plugin:toggle",
            i: "plugin:install"
        }
    }]
})
// @from(Ln 142489, Col 0)
function Wq7() {
    let A = eA(),
        q = [...qS1, ...rqA];
    if (A === "macos") q.push(...oqA);
    return q
}
// @from(Ln 142496, Col 0)
function k71(A) {
    let q = A.split("+"),
        K = [],
        Y = "";
    for (let z of q) {
        let H = z.trim().toLowerCase();
        if (["ctrl", "control", "alt", "opt", "option", "meta", "cmd", "command", "shift"].includes(H))
            if (H === "control") K.push("ctrl");
            else if (H === "option" || H === "opt") K.push("alt");
        else if (H === "command" || H === "cmd") K.push("cmd");
        else K.push(H);
        else Y = H
    }
    return K.sort(), [...K, Y].join("+")
}
// @from(Ln 142511, Col 4)
qS1
// @from(Ln 142511, Col 9)
rqA
// @from(Ln 142511, Col 14)
oqA
// @from(Ln 142512, Col 4)
W36 = v(() => {
    x3();
    qS1 = [{
        key: "ctrl+c",
        reason: "Cannot be rebound - used for interrupt/exit (hardcoded)",
        severity: "error"
    }, {
        key: "ctrl+d",
        reason: "Cannot be rebound - used for exit (hardcoded)",
        severity: "error"
    }, {
        key: "ctrl+m",
        reason: "Cannot be rebound - identical to Enter in terminals (both send CR)",
        severity: "error"
    }], rqA = [{
        key: "ctrl+z",
        reason: "Unix process suspend (SIGTSTP)",
        severity: "warning"
    }, {
        key: "ctrl+\\",
        reason: "Terminal quit signal (SIGQUIT)",
        severity: "error"
    }], oqA = [{
        key: "cmd+c",
        reason: "macOS system copy",
        severity: "error"
    }, {
        key: "cmd+v",
        reason: "macOS system paste",
        severity: "error"
    }, {
        key: "cmd+x",
        reason: "macOS system cut",
        severity: "error"
    }, {
        key: "cmd+q",
        reason: "macOS quit application",
        severity: "error"
    }, {
        key: "cmd+w",
        reason: "macOS close window/tab",
        severity: "error"
    }, {
        key: "cmd+tab",
        reason: "macOS app switcher",
        severity: "error"
    }, {
        key: "cmd+space",
        reason: "macOS Spotlight",
        severity: "error"
    }]
})
// @from(Ln 142565, Col 0)
function aE5(A) {
    if (typeof A !== "object" || A === null) return !1;
    let q = A;
    return typeof q.context === "string" && typeof q.bindings === "object" && q.bindings !== null
}
// @from(Ln 142571, Col 0)
function sE5(A) {
    return Array.isArray(A) && A.every(aE5)
}
// @from(Ln 142575, Col 0)
function tE5(A) {
    return Gq7.includes(A)
}
// @from(Ln 142579, Col 0)
function eE5(A) {
    let q = A.toLowerCase().split("+");
    for (let Y of q)
        if (!Y.trim()) return {
            type: "parse_error",
            severity: "error",
            message: `Empty key part in "${A}"`,
            key: A,
            suggestion: 'Remove extra "+" characters'
        };
    let K = iC1(A);
    if (!K.key && !K.ctrl && !K.alt && !K.shift && !K.meta) return {
        type: "parse_error",
        severity: "error",
        message: `Could not parse keystroke "${A}"`,
        key: A
    };
    return null
}
// @from(Ln 142599, Col 0)
function Ak5(A, q) {
    let K = [];
    if (typeof A !== "object" || A === null) return K.push({
        type: "parse_error",
        severity: "error",
        message: `Keybinding block ${q+1} is not an object`
    }), K;
    let Y = A,
        z = Y.context,
        w;
    if (typeof z !== "string") K.push({
        type: "parse_error",
        severity: "error",
        message: `Keybinding block ${q+1} missing "context" field`
    });
    else if (!tE5(z)) K.push({
        type: "invalid_context",
        severity: "error",
        message: `Unknown context "${z}"`,
        context: z,
        suggestion: `Valid contexts: ${Gq7.join(", ")}`
    });
    else w = z;
    if (typeof Y.bindings !== "object" || Y.bindings === null) return K.push({
        type: "parse_error",
        severity: "error",
        message: `Keybinding block ${q+1} missing "bindings" field`
    }), K;
    let H = Y.bindings;
    for (let [$, O] of Object.entries(H)) {
        let _ = eE5($);
        if (_) _.context = w, K.push(_);
        if (O !== null && typeof O !== "string") K.push({
            type: "invalid_action",
            severity: "error",
            message: `Invalid action for "${$}": must be a string or null`,
            key: $,
            context: w
        });
        else if (typeof O === "string" && O.startsWith("command:")) {
            if (!/^command:[a-zA-Z0-9:\-_]+$/.test(O)) K.push({
                type: "invalid_action",
                severity: "warning",
                message: `Invalid command binding "${O}" for "${$}": command name may only contain alphanumeric characters, colons, hyphens, and underscores`,
                key: $,
                context: w,
                action: O
            });
            if (w && w !== "Chat") K.push({
                type: "invalid_action",
                severity: "warning",
                message: `Command binding "${O}" must be in "Chat" context, not "${w}"`,
                key: $,
                context: w,
                action: O,
                suggestion: 'Move this binding to a block with "context": "Chat"'
            })
        }
    }
    return K
}
// @from(Ln 142661, Col 0)
function aqA(A) {
    let q = [],
        K = /"bindings"\s*:\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g,
        Y;
    while ((Y = K.exec(A)) !== null) {
        let z = Y[1];
        if (!z) continue;
        let $ = A.slice(0, Y.index).match(/"context"\s*:\s*"([^"]+)"[^{]*$/)?.[1] ?? "unknown",
            O = /"([^"]+)"\s*:/g,
            _ = new Map,
            J;
        while ((J = O.exec(z)) !== null) {
            let X = J[1];
            if (!X) continue;
            let D = (_.get(X) ?? 0) + 1;
            if (_.set(X, D), D === 2) q.push({
                type: "duplicate",
                severity: "warning",
                message: `Duplicate key "${X}" in ${$} bindings`,
                key: X,
                context: $,
                suggestion: "This key appears multiple times in the same context. JSON uses the last value, earlier values are ignored."
            })
        }
    }
    return q
}
// @from(Ln 142689, Col 0)
function qk5(A) {
    let q = [];
    if (!Array.isArray(A)) return q.push({
        type: "parse_error",
        severity: "error",
        message: "keybindings.json must contain an array",
        suggestion: "Wrap your bindings in [ ]"
    }), q;
    for (let K = 0; K < A.length; K++) q.push(...Ak5(A[K], K));
    return q
}
// @from(Ln 142701, Col 0)
function Kk5(A) {
    let q = [],
        K = new Map;
    for (let Y of A) {
        let z = K.get(Y.context) ?? new Map;
        K.set(Y.context, z);
        for (let [w, H] of Object.entries(Y.bindings)) {
            let $ = k71(w),
                O = z.get($);
            if (O && O !== H) q.push({
                type: "duplicate",
                severity: "warning",
                message: `Duplicate binding "${w}" in ${Y.context} context`,
                key: w,
                context: Y.context,
                action: H ?? "null (unbind)",
                suggestion: `Previously bound to "${O}". Only the last binding will be used.`
            });
            z.set($, H ?? "null")
        }
    }
    return q
}
// @from(Ln 142725, Col 0)
function Yk5(A) {
    let q = [],
        K = Wq7();
    for (let Y of A) {
        let z = oK6(Y.chord),
            w = k71(z);
        for (let H of K)
            if (k71(H.key) === w) q.push({
                type: "reserved",
                severity: H.severity,
                message: `"${z}" may not work: ${H.reason}`,
                key: z,
                context: Y.context,
                action: Y.action ?? void 0
            })
    }
    return q
}
// @from(Ln 142744, Col 0)
function zk5(A) {
    let q = [];
    for (let K of A)
        for (let [Y, z] of Object.entries(K.bindings)) {
            let w = Y.split(" ").map((H) => iC1(H));
            q.push({
                chord: w,
                action: z,
                context: K.context
            })
        }
    return q
}
// @from(Ln 142758, Col 0)
function sqA(A, q) {
    let K = [];
    if (K.push(...qk5(A)), sE5(A)) {
        K.push(...Kk5(A));
        let z = zk5(A);
        K.push(...Yk5(z))
    }
    let Y = new Set;
    return K.filter((z) => {
        let w = `${z.type}:${z.key}:${z.context}`;
        if (Y.has(w)) return !1;
        return Y.add(w), !0
    })
}
// @from(Ln 142772, Col 4)
Gq7
// @from(Ln 142773, Col 4)
Zq7 = v(() => {
    W36();
    Gq7 = ["Global", "Chat", "Autocomplete", "Confirmation", "Help", "Transcript", "HistorySearch", "Task", "ThemePicker", "Settings", "Tabs", "Attachments", "Footer", "MessageSelector", "DiffDialog", "ModelPicker", "Select", "Plugin"]
})
// @from(Ln 142789, Col 0)
function Hv() {
    return x8("tengu_keybinding_customization_release", !1)
}
// @from(Ln 142793, Col 0)
function vq7(A) {
    let q = new Date().toISOString().slice(0, 10);
    if (Vq7 === q) return;
    Vq7 = q, c("tengu_custom_keybindings_loaded", {
        user_binding_count: A
    })
}
// @from(Ln 142801, Col 0)
function Dk5(A) {
    return typeof A === "object" && A !== null && "code" in A && typeof A.code === "string"
}
// @from(Ln 142805, Col 0)
function jk5(A) {
    if (typeof A !== "object" || A === null) return !1;
    let q = A;
    return typeof q.context === "string" && typeof q.bindings === "object" && q.bindings !== null
}
// @from(Ln 142811, Col 0)
function Eq7(A) {
    return Array.isArray(A) && A.every(jk5)
}
// @from(Ln 142815, Col 0)
function R71() {
    return Ok5(O8(), "keybindings.json")
}
// @from(Ln 142819, Col 0)
function tqA() {
    return aK6(kJ1)
}
// @from(Ln 142822, Col 0)
async function Mk5() {
    let A = tqA();
    if (!Hv()) return {
        bindings: A,
        warnings: []
    };
    let q = R71();
    try {
        let K = await wk5(q, "utf-8"),
            Y = _A(K),
            z;
        if (typeof Y === "object" && Y !== null && "bindings" in Y) z = Y.bindings;
        else return h('[keybindings] Invalid keybindings.json: keybindings.json must have a "bindings" array'), {
            bindings: A,
            warnings: [{
                type: "parse_error",
                severity: "error",
                message: 'keybindings.json must have a "bindings" array',
                suggestion: 'Use format: { "bindings": [ ... ] }'
            }]
        };
        if (!Eq7(z)) {
            let _ = !Array.isArray(z) ? '"bindings" must be an array' : "keybindings.json contains invalid block structure",
                J = !Array.isArray(z) ? 'Set "bindings" to an array of keybinding blocks' : 'Each block must have "context" (string) and "bindings" (object)';
            return h(`[keybindings] Invalid keybindings.json: ${_}`), {
                bindings: A,
                warnings: [{
                    type: "parse_error",
                    severity: "error",
                    message: _,
                    suggestion: J
                }]
            }
        }
        let w = aK6(z);
        h(`[keybindings] Loaded ${w.length} user bindings from ${q}`);
        let H = [...A, ...w];
        vq7(w.length);
        let O = [...aqA(K), ...sqA(z, H)];
        if (O.length > 0) h(`[keybindings] Found ${O.length} validation issue(s)`);
        return {
            bindings: H,
            warnings: O
        }
    } catch (K) {
        if (Dk5(K) && K.code === "ENOENT") return {
            bindings: A,
            warnings: []
        };
        return h(`[keybindings] Error loading ${q}: ${K instanceof Error?K.message:String(K)}`), {
            bindings: A,
            warnings: [{
                type: "parse_error",
                severity: "error",
                message: `Failed to parse keybindings.json: ${K instanceof Error?K.message:String(K)}`
            }]
        }
    }
}
// @from(Ln 142882, Col 0)
function kq7() {
    if (ZM) return ZM;
    return YS1().bindings
}
// @from(Ln 142887, Col 0)
function YS1() {
    if (ZM) return {
        bindings: ZM,
        warnings: GW
    };
    let A = tqA();
    if (!Hv()) return ZM = A, GW = [], {
        bindings: ZM,
        warnings: GW
    };
    let q = R71();
    try {
        let K = $k5(q, "utf-8"),
            Y = _A(K),
            z;
        if (typeof Y === "object" && Y !== null && "bindings" in Y) z = Y.bindings;
        else return ZM = A, GW = [{
            type: "parse_error",
            severity: "error",
            message: 'keybindings.json must have a "bindings" array',
            suggestion: 'Use format: { "bindings": [ ... ] }'
        }], {
            bindings: ZM,
            warnings: GW
        };
        if (!Eq7(z)) {
            let $ = !Array.isArray(z) ? '"bindings" must be an array' : "keybindings.json contains invalid block structure",
                O = !Array.isArray(z) ? 'Set "bindings" to an array of keybinding blocks' : 'Each block must have "context" (string) and "bindings" (object)';
            return ZM = A, GW = [{
                type: "parse_error",
                severity: "error",
                message: $,
                suggestion: O
            }], {
                bindings: ZM,
                warnings: GW
            }
        }
        let w = aK6(z);
        if (h(`[keybindings] Loaded ${w.length} user bindings from ${q}`), ZM = [...A, ...w], vq7(w.length), GW = [...aqA(K), ...sqA(z, ZM)], GW.length > 0) h(`[keybindings] Found ${GW.length} validation issue(s)`);
        return {
            bindings: ZM,
            warnings: GW
        }
    } catch {
        return ZM = A, GW = [], {
            bindings: ZM,
            warnings: GW
        }
    }
}
// @from(Ln 142938, Col 0)
async function Lq7() {
    if (fq7 || Tq7) return;
    if (!Hv()) {
        h("[keybindings] Skipping file watcher - user customization disabled");
        return
    }
    let A = R71(),
        q = _k5(A);
    try {
        if (!(await Hk5(q)).isDirectory()) {
            h(`[keybindings] Not watching: ${q} is not a directory`);
            return
        }
    } catch {
        h(`[keybindings] Not watching: ${q} does not exist`);
        return
    }
    fq7 = !0, h(`[keybindings] Watching for changes to ${A}`), L71 = wH1.watch(A, {
        persistent: !0,
        ignoreInitial: !0,
        awaitWriteFinish: {
            stabilityThreshold: Jk5,
            pollInterval: Xk5
        },
        ignorePermissionErrors: !0,
        usePolling: !1,
        atomic: !0
    }), L71.on("add", Nq7), L71.on("change", Nq7), L71.on("unlink", Wk5), Tq(async () => Pk5())
}
// @from(Ln 142968, Col 0)
function Pk5() {
    if (Tq7 = !0, L71) L71.close(), L71 = null;
    KS1.clear()
}
// @from(Ln 142973, Col 0)
function Rq7(A) {
    return KS1.add(A), () => {
        KS1.delete(A)
    }
}
// @from(Ln 142978, Col 0)
async function Nq7(A) {
    h(`[keybindings] Detected change to ${A}`);
    try {
        let q = await Mk5();
        ZM = q.bindings, GW = q.warnings, KS1.forEach((K) => K(q))
    } catch (q) {
        h(`[keybindings] Error reloading: ${q instanceof Error?q.message:String(q)}`)
    }
}
// @from(Ln 142987, Col 0)
async function Wk5(A) {
    h(`[keybindings] Detected deletion of ${A}`);
    let q = tqA();
    ZM = q, GW = [], KS1.forEach((K) => K({
        bindings: q,
        warnings: []
    }))
}
// @from(Ln 142996, Col 0)
function yq7() {
    return GW
}
// @from(Ln 142999, Col 4)
Jk5 = 500
// @from(Ln 143000, Col 4)
Xk5 = 200
// @from(Ln 143001, Col 4)
L71 = null
// @from(Ln 143002, Col 4)
fq7 = !1
// @from(Ln 143003, Col 4)
Tq7 = !1
// @from(Ln 143004, Col 4)
ZM = null
// @from(Ln 143005, Col 4)
GW
// @from(Ln 143005, Col 8)
KS1
// @from(Ln 143005, Col 13)
Vq7 = null
// @from(Ln 143006, Col 4)
AU = v(() => {
    ds1();
    hA();
    Z6();
    Tz();
    m6();
    U4();
    u6();
    P36();
    Zq7();
    GW = [], KS1 = new Set
})
// @from(Ln 143019, Col 0)
function RK(A, q, K) {
    let Y = VL(),
        z = Y?.getDisplayText(A, q),
        w = z === void 0,
        H = Y ? "action_not_found" : "no_context",
        $ = G36.useRef(!1);
    return G36.useEffect(() => {
        if (w && !$.current) $.current = !0, c("tengu_keybinding_fallback_used", {
            action: A,
            context: q,
            fallback: K,
            reason: H
        })
    }, [w, A, q, K, H]), w ? K : z
}
// @from(Ln 143035, Col 0)
function m0(A, q, K) {
    let Y = kq7(),
        z = sK6(A, q, Y);
    if (z === void 0) {
        let w = `${A}:${q}`;
        if (!Cq7.has(w)) Cq7.add(w), c("tengu_keybinding_fallback_used", {
            action: A,
            context: q,
            fallback: K,
            reason: "action_not_found"
        });
        return K
    }
    return z
}
// @from(Ln 143050, Col 4)
G36
// @from(Ln 143050, Col 9)
Cq7
// @from(Ln 143051, Col 4)
s2 = v(() => {
    eg();
    AU();
    eK6();
    u6();
    G36 = o(X1(), 1);
    Cq7 = new Set
})
// @from(Ln 143059, Col 4)
eqA
// @from(Ln 143060, Col 4)
Sq7 = v(() => {
    i7();
    eqA = u.object({
        restrictions: u.record(u.string(), u.object({
            allowed: u.boolean()
        }))
    })
})
// @from(Ln 143068, Col 4)
qKA = R((of2, f36) => {
    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    var hq7, Iq7, xq7, bq7, uq7, Bq7, mq7, Fq7, Qq7, Z36, AKA, gq7, Uq7, LJ1, pq7, dq7, cq7, lq7, iq7, nq7, rq7, oq7, aq7;
    (function(A) {
        var q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
        if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(Y) {
            A(K(q, K(Y)))
        });
        else if (typeof f36 === "object" && typeof of2 === "object") A(K(q, K(of2)));
        else A(K(q));

        function K(Y, z) {
            if (Y !== q)
                if (typeof Object.create === "function") Object.defineProperty(Y, "__esModule", {
                    value: !0
                });
                else Y.__esModule = !0;
            return function(w, H) {
                return Y[w] = z ? z(w, H) : H
            }
        }
    })(function(A) {
        var q = Object.setPrototypeOf || {
            __proto__: []
        }
        instanceof Array && function(K, Y) {
            K.__proto__ = Y
        } || function(K, Y) {
            for (var z in Y)
                if (Y.hasOwnProperty(z)) K[z] = Y[z]
        };
        hq7 = function(K, Y) {
            q(K, Y);

            function z() {
                this.constructor = K
            }
            K.prototype = Y === null ? Object.create(Y) : (z.prototype = Y.prototype, new z)
        }, Iq7 = Object.assign || function(K) {
            for (var Y, z = 1, w = arguments.length; z < w; z++) {
                Y = arguments[z];
                for (var H in Y)
                    if (Object.prototype.hasOwnProperty.call(Y, H)) K[H] = Y[H]
            }
            return K
        }, xq7 = function(K, Y) {
            var z = {};
            for (var w in K)
                if (Object.prototype.hasOwnProperty.call(K, w) && Y.indexOf(w) < 0) z[w] = K[w];
            if (K != null && typeof Object.getOwnPropertySymbols === "function") {
                for (var H = 0, w = Object.getOwnPropertySymbols(K); H < w.length; H++)
                    if (Y.indexOf(w[H]) < 0 && Object.prototype.propertyIsEnumerable.call(K, w[H])) z[w[H]] = K[w[H]]
            }
            return z
        }, bq7 = function(K, Y, z, w) {
            var H = arguments.length,
                $ = H < 3 ? Y : w === null ? w = Object.getOwnPropertyDescriptor(Y, z) : w,
                O;
            if (typeof Reflect === "object" && typeof Reflect.decorate === "function") $ = Reflect.decorate(K, Y, z, w);
            else
                for (var _ = K.length - 1; _ >= 0; _--)
                    if (O = K[_]) $ = (H < 3 ? O($) : H > 3 ? O(Y, z, $) : O(Y, z)) || $;
            return H > 3 && $ && Object.defineProperty(Y, z, $), $
        }, uq7 = function(K, Y) {
            return function(z, w) {
                Y(z, w, K)
            }
        }, Bq7 = function(K, Y) {
            if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(K, Y)
        }, mq7 = function(K, Y, z, w) {
            function H($) {
                return $ instanceof z ? $ : new z(function(O) {
                    O($)
                })
            }
            return new(z || (z = Promise))(function($, O) {
                function _(D) {
                    try {
                        X(w.next(D))
                    } catch (j) {
                        O(j)
                    }
                }

                function J(D) {
                    try {
                        X(w.throw(D))
                    } catch (j) {
                        O(j)
                    }
                }

                function X(D) {
                    D.done ? $(D.value) : H(D.value).then(_, J)
                }
                X((w = w.apply(K, Y || [])).next())
            })
        }, Fq7 = function(K, Y) {
            var z = {
                    label: 0,
                    sent: function() {
                        if ($[0] & 1) throw $[1];
                        return $[1]
                    },
                    trys: [],
                    ops: []
                },
                w, H, $, O;
            return O = {
                next: _(0),
                throw: _(1),
                return: _(2)
            }, typeof Symbol === "function" && (O[Symbol.iterator] = function() {
                return this
            }), O;

            function _(X) {
                return function(D) {
                    return J([X, D])
                }
            }

            function J(X) {
                if (w) throw TypeError("Generator is already executing.");
                while (z) try {
                    if (w = 1, H && ($ = X[0] & 2 ? H.return : X[0] ? H.throw || (($ = H.return) && $.call(H), 0) : H.next) && !($ = $.call(H, X[1])).done) return $;
                    if (H = 0, $) X = [X[0] & 2, $.value];
                    switch (X[0]) {
                        case 0:
                        case 1:
                            $ = X;
                            break;
                        case 4:
                            return z.label++, {
                                value: X[1],
                                done: !1
                            };
                        case 5:
                            z.label++, H = X[1], X = [0];
                            continue;
                        case 7:
                            X = z.ops.pop(), z.trys.pop();
                            continue;
                        default:
                            if (($ = z.trys, !($ = $.length > 0 && $[$.length - 1])) && (X[0] === 6 || X[0] === 2)) {
                                z = 0;
                                continue
                            }
                            if (X[0] === 3 && (!$ || X[1] > $[0] && X[1] < $[3])) {
                                z.label = X[1];
                                break
                            }
                            if (X[0] === 6 && z.label < $[1]) {
                                z.label = $[1], $ = X;
                                break
                            }
                            if ($ && z.label < $[2]) {
                                z.label = $[2], z.ops.push(X);
                                break
                            }
                            if ($[2]) z.ops.pop();
                            z.trys.pop();
                            continue
                    }
                    X = Y.call(K, z)
                } catch (D) {
                    X = [6, D], H = 0
                } finally {
                    w = $ = 0
                }
                if (X[0] & 5) throw X[1];
                return {
                    value: X[0] ? X[1] : void 0,
                    done: !0
                }
            }
        }, aq7 = function(K, Y, z, w) {
            if (w === void 0) w = z;
            K[w] = Y[z]
        }, Qq7 = function(K, Y) {
            for (var z in K)
                if (z !== "default" && !Y.hasOwnProperty(z)) Y[z] = K[z]
        }, Z36 = function(K) {
            var Y = typeof Symbol === "function" && Symbol.iterator,
                z = Y && K[Y],
                w = 0;
            if (z) return z.call(K);
            if (K && typeof K.length === "number") return {
                next: function() {
                    if (K && w >= K.length) K = void 0;
                    return {
                        value: K && K[w++],
                        done: !K
                    }
                }
            };
            throw TypeError(Y ? "Object is not iterable." : "Symbol.iterator is not defined.")
        }, AKA = function(K, Y) {
            var z = typeof Symbol === "function" && K[Symbol.iterator];
            if (!z) return K;
            var w = z.call(K),
                H, $ = [],
                O;
            try {
                while ((Y === void 0 || Y-- > 0) && !(H = w.next()).done) $.push(H.value)
            } catch (_) {
                O = {
                    error: _
                }
            } finally {
                try {
                    if (H && !H.done && (z = w.return)) z.call(w)
                } finally {
                    if (O) throw O.error
                }
            }
            return $
        }, gq7 = function() {
            for (var K = [], Y = 0; Y < arguments.length; Y++) K = K.concat(AKA(arguments[Y]));
            return K
        }, Uq7 = function() {
            for (var K = 0, Y = 0, z = arguments.length; Y < z; Y++) K += arguments[Y].length;
            for (var w = Array(K), H = 0, Y = 0; Y < z; Y++)
                for (var $ = arguments[Y], O = 0, _ = $.length; O < _; O++, H++) w[H] = $[O];
            return w
        }, LJ1 = function(K) {
            return this instanceof LJ1 ? (this.v = K, this) : new LJ1(K)
        }, pq7 = function(K, Y, z) {
            if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
            var w = z.apply(K, Y || []),
                H, $ = [];
            return H = {}, O("next"), O("throw"), O("return"), H[Symbol.asyncIterator] = function() {
                return this
            }, H;

            function O(M) {
                if (w[M]) H[M] = function(P) {
                    return new Promise(function(W, G) {
                        $.push([M, P, W, G]) > 1 || _(M, P)
                    })
                }
            }

            function _(M, P) {
                try {
                    J(w[M](P))
                } catch (W) {
                    j($[0][3], W)
                }
            }

            function J(M) {
                M.value instanceof LJ1 ? Promise.resolve(M.value.v).then(X, D) : j($[0][2], M)
            }

            function X(M) {
                _("next", M)
            }

            function D(M) {
                _("throw", M)
            }

            function j(M, P) {
                if (M(P), $.shift(), $.length) _($[0][0], $[0][1])
            }
        }, dq7 = function(K) {
            var Y, z;
            return Y = {}, w("next"), w("throw", function(H) {
                throw H
            }), w("return"), Y[Symbol.iterator] = function() {
                return this
            }, Y;

            function w(H, $) {
                Y[H] = K[H] ? function(O) {
                    return (z = !z) ? {
                        value: LJ1(K[H](O)),
                        done: H === "return"
                    } : $ ? $(O) : O
                } : $
            }
        }, cq7 = function(K) {
            if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
            var Y = K[Symbol.asyncIterator],
                z;
            return Y ? Y.call(K) : (K = typeof Z36 === "function" ? Z36(K) : K[Symbol.iterator](), z = {}, w("next"), w("throw"), w("return"), z[Symbol.asyncIterator] = function() {
                return this
            }, z);

            function w($) {
                z[$] = K[$] && function(O) {
                    return new Promise(function(_, J) {
                        O = K[$](O), H(_, J, O.done, O.value)
                    })
                }
            }

            function H($, O, _, J) {
                Promise.resolve(J).then(function(X) {
                    $({
                        value: X,
                        done: _
                    })
                }, O)
            }
        }, lq7 = function(K, Y) {
            if (Object.defineProperty) Object.defineProperty(K, "raw", {
                value: Y
            });
            else K.raw = Y;
            return K
        }, iq7 = function(K) {
            if (K && K.__esModule) return K;
            var Y = {};
            if (K != null) {
                for (var z in K)
                    if (Object.hasOwnProperty.call(K, z)) Y[z] = K[z]
            }
            return Y.default = K, Y
        }, nq7 = function(K) {
            return K && K.__esModule ? K : {
                default: K
            }
        }, rq7 = function(K, Y) {
            if (!Y.has(K)) throw TypeError("attempted to get private field on non-instance");
            return Y.get(K)
        }, oq7 = function(K, Y, z) {
            if (!Y.has(K)) throw TypeError("attempted to set private field on non-instance");
            return Y.set(K, z), z
        }, A("__extends", hq7), A("__assign", Iq7), A("__rest", xq7), A("__decorate", bq7), A("__param", uq7), A("__metadata", Bq7), A("__awaiter", mq7), A("__generator", Fq7), A("__exportStar", Qq7), A("__createBinding", aq7), A("__values", Z36), A("__read", AKA), A("__spread", gq7), A("__spreadArrays", Uq7), A("__await", LJ1), A("__asyncGenerator", pq7), A("__asyncDelegator", dq7), A("__asyncValues", cq7), A("__makeTemplateObject", lq7), A("__importStar", iq7), A("__importDefault", nq7), A("__classPrivateFieldGet", rq7), A("__classPrivateFieldSet", oq7)
    })
})
// @from(Ln 143414, Col 4)
KKA = R((sq7) => {
    Object.defineProperty(sq7, "__esModule", {
        value: !0
    });
    sq7.MAX_HASHABLE_LENGTH = sq7.INIT = sq7.KEY = sq7.DIGEST_LENGTH = sq7.BLOCK_SIZE = void 0;
    sq7.BLOCK_SIZE = 64;
    sq7.DIGEST_LENGTH = 32;
    sq7.KEY = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]);
    sq7.INIT = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225];
    sq7.MAX_HASHABLE_LENGTH = Math.pow(2, 53) - 1
})
// @from(Ln 143425, Col 4)
qK7 = R((eq7) => {
    Object.defineProperty(eq7, "__esModule", {
        value: !0
    });
    eq7.RawSha256 = void 0;
    var vL = KKA(),
        Nk5 = function() {
            function A() {
                this.state = Int32Array.from(vL.INIT), this.temp = new Int32Array(64), this.buffer = new Uint8Array(64), this.bufferLength = 0, this.bytesHashed = 0, this.finished = !1
            }
            return A.prototype.update = function(q) {
                if (this.finished) throw Error("Attempted to update an already finished hash.");
                var K = 0,
                    Y = q.byteLength;
                if (this.bytesHashed += Y, this.bytesHashed * 8 > vL.MAX_HASHABLE_LENGTH) throw Error("Cannot hash more than 2^53 - 1 bits");
                while (Y > 0)
                    if (this.buffer[this.bufferLength++] = q[K++], Y--, this.bufferLength === vL.BLOCK_SIZE) this.hashBuffer(), this.bufferLength = 0
            }, A.prototype.digest = function() {
                if (!this.finished) {
                    var q = this.bytesHashed * 8,
                        K = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength),
                        Y = this.bufferLength;
                    if (K.setUint8(this.bufferLength++, 128), Y % vL.BLOCK_SIZE >= vL.BLOCK_SIZE - 8) {
                        for (var z = this.bufferLength; z < vL.BLOCK_SIZE; z++) K.setUint8(z, 0);
                        this.hashBuffer(), this.bufferLength = 0
                    }
                    for (var z = this.bufferLength; z < vL.BLOCK_SIZE - 8; z++) K.setUint8(z, 0);
                    K.setUint32(vL.BLOCK_SIZE - 8, Math.floor(q / 4294967296), !0), K.setUint32(vL.BLOCK_SIZE - 4, q), this.hashBuffer(), this.finished = !0
                }
                var w = new Uint8Array(vL.DIGEST_LENGTH);
                for (var z = 0; z < 8; z++) w[z * 4] = this.state[z] >>> 24 & 255, w[z * 4 + 1] = this.state[z] >>> 16 & 255, w[z * 4 + 2] = this.state[z] >>> 8 & 255, w[z * 4 + 3] = this.state[z] >>> 0 & 255;
                return w
            }, A.prototype.hashBuffer = function() {
                var q = this,
                    K = q.buffer,
                    Y = q.state,
                    z = Y[0],
                    w = Y[1],
                    H = Y[2],
                    $ = Y[3],
                    O = Y[4],
                    _ = Y[5],
                    J = Y[6],
                    X = Y[7];
                for (var D = 0; D < vL.BLOCK_SIZE; D++) {
                    if (D < 16) this.temp[D] = (K[D * 4] & 255) << 24 | (K[D * 4 + 1] & 255) << 16 | (K[D * 4 + 2] & 255) << 8 | K[D * 4 + 3] & 255;
                    else {
                        var j = this.temp[D - 2],
                            M = (j >>> 17 | j << 15) ^ (j >>> 19 | j << 13) ^ j >>> 10;
                        j = this.temp[D - 15];
                        var P = (j >>> 7 | j << 25) ^ (j >>> 18 | j << 14) ^ j >>> 3;
                        this.temp[D] = (M + this.temp[D - 7] | 0) + (P + this.temp[D - 16] | 0)
                    }
                    var W = (((O >>> 6 | O << 26) ^ (O >>> 11 | O << 21) ^ (O >>> 25 | O << 7)) + (O & _ ^ ~O & J) | 0) + (X + (vL.KEY[D] + this.temp[D] | 0) | 0) | 0,
                        G = ((z >>> 2 | z << 30) ^ (z >>> 13 | z << 19) ^ (z >>> 22 | z << 10)) + (z & w ^ z & H ^ w & H) | 0;
                    X = J, J = _, _ = O, O = $ + W | 0, $ = H, H = w, w = z, z = W + G | 0
                }
                Y[0] += z, Y[1] += w, Y[2] += H, Y[3] += $, Y[4] += O, Y[5] += _, Y[6] += J, Y[7] += X
            }, A
        }();
    eq7.RawSha256 = Nk5
})
// @from(Ln 143487, Col 4)
zK7 = R((KK7) => {
    Object.defineProperty(KK7, "__esModule", {
        value: !0
    });
    KK7.toUtf8 = KK7.fromUtf8 = void 0;
    var Tk5 = (A) => {
        let q = [];
        for (let K = 0, Y = A.length; K < Y; K++) {
            let z = A.charCodeAt(K);
            if (z < 128) q.push(z);
            else if (z < 2048) q.push(z >> 6 | 192, z & 63 | 128);
            else if (K + 1 < A.length && (z & 64512) === 55296 && (A.charCodeAt(K + 1) & 64512) === 56320) {
                let w = 65536 + ((z & 1023) << 10) + (A.charCodeAt(++K) & 1023);
                q.push(w >> 18 | 240, w >> 12 & 63 | 128, w >> 6 & 63 | 128, w & 63 | 128)
            } else q.push(z >> 12 | 224, z >> 6 & 63 | 128, z & 63 | 128)
        }
        return Uint8Array.from(q)
    };
    KK7.fromUtf8 = Tk5;
    var vk5 = (A) => {
        let q = "";
        for (let K = 0, Y = A.length; K < Y; K++) {
            let z = A[K];
            if (z < 128) q += String.fromCharCode(z);
            else if (192 <= z && z < 224) {
                let w = A[++K];
                q += String.fromCharCode((z & 31) << 6 | w & 63)
            } else if (240 <= z && z < 365) {
                let H = "%" + [z, A[++K], A[++K], A[++K]].map(($) => $.toString(16)).join("%");
                q += decodeURIComponent(H)
            } else q += String.fromCharCode((z & 15) << 12 | (A[++K] & 63) << 6 | A[++K] & 63)
        }
        return q
    };
    KK7.toUtf8 = vk5
})
// @from(Ln 143523, Col 4)
$K7 = R((wK7) => {
    Object.defineProperty(wK7, "__esModule", {
        value: !0
    });
    wK7.toUtf8 = wK7.fromUtf8 = void 0;

    function kk5(A) {
        return new TextEncoder().encode(A)
    }
    wK7.fromUtf8 = kk5;

    function Lk5(A) {
        return new TextDecoder("utf-8").decode(A)
    }
    wK7.toUtf8 = Lk5
})
// @from(Ln 143539, Col 4)
YKA = R((JK7) => {
    Object.defineProperty(JK7, "__esModule", {
        value: !0
    });
    JK7.toUtf8 = JK7.fromUtf8 = void 0;
    var OK7 = zK7(),
        _K7 = $K7(),
        yk5 = (A) => typeof TextEncoder === "function" ? (0, _K7.fromUtf8)(A) : (0, OK7.fromUtf8)(A);
    JK7.fromUtf8 = yk5;
    var Ck5 = (A) => typeof TextDecoder === "function" ? (0, _K7.toUtf8)(A) : (0, OK7.toUtf8)(A);
    JK7.toUtf8 = Ck5
})
// @from(Ln 143551, Col 4)
MK7 = R((DK7) => {
    Object.defineProperty(DK7, "__esModule", {
        value: !0
    });
    DK7.convertToBuffer = void 0;
    var hk5 = YKA(),
        Ik5 = typeof Buffer < "u" && Buffer.from ? function(A) {
            return Buffer.from(A, "utf8")
        } : hk5.fromUtf8;

    function xk5(A) {
        if (A instanceof Uint8Array) return A;
        if (typeof A === "string") return Ik5(A);
        if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        return new Uint8Array(A)
    }
    DK7.convertToBuffer = xk5
})
// @from(Ln 143569, Col 4)
GK7 = R((PK7) => {
    Object.defineProperty(PK7, "__esModule", {
        value: !0
    });
    PK7.isEmptyData = void 0;

    function bk5(A) {
        if (typeof A === "string") return A.length === 0;
        return A.byteLength === 0
    }
    PK7.isEmptyData = bk5
})
// @from(Ln 143581, Col 4)
VK7 = R((ZK7) => {
    Object.defineProperty(ZK7, "__esModule", {
        value: !0
    });
    ZK7.numToUint8 = void 0;

    function uk5(A) {
        return new Uint8Array([(A & 4278190080) >> 24, (A & 16711680) >> 16, (A & 65280) >> 8, A & 255])
    }
    ZK7.numToUint8 = uk5
})
// @from(Ln 143592, Col 4)
vK7 = R((NK7) => {
    Object.defineProperty(NK7, "__esModule", {
        value: !0
    });
    NK7.uint32ArrayFrom = void 0;

    function Bk5(A) {
        if (!Uint32Array.from) {
            var q = new Uint32Array(A.length),
                K = 0;
            while (K < A.length) q[K] = A[K], K += 1;
            return q
        }
        return Uint32Array.from(A)
    }
    NK7.uint32ArrayFrom = Bk5
})
// @from(Ln 143609, Col 4)
EK7 = R((RJ1) => {
    Object.defineProperty(RJ1, "__esModule", {
        value: !0
    });
    RJ1.uint32ArrayFrom = RJ1.numToUint8 = RJ1.isEmptyData = RJ1.convertToBuffer = void 0;
    var mk5 = MK7();
    Object.defineProperty(RJ1, "convertToBuffer", {
        enumerable: !0,
        get: function() {
            return mk5.convertToBuffer
        }
    });
    var Fk5 = GK7();
    Object.defineProperty(RJ1, "isEmptyData", {
        enumerable: !0,
        get: function() {
            return Fk5.isEmptyData
        }
    });
    var Qk5 = VK7();
    Object.defineProperty(RJ1, "numToUint8", {
        enumerable: !0,
        get: function() {
            return Qk5.numToUint8
        }
    });
    var gk5 = vK7();
    Object.defineProperty(RJ1, "uint32ArrayFrom", {
        enumerable: !0,
        get: function() {
            return gk5.uint32ArrayFrom
        }
    })
})
// @from(Ln 143643, Col 4)
yK7 = R((LK7) => {
    Object.defineProperty(LK7, "__esModule", {
        value: !0
    });
    LK7.Sha256 = void 0;
    var kK7 = qKA(),
        N36 = KKA(),
        V36 = qK7(),
        zKA = EK7(),
        pk5 = function() {
            function A(q) {
                this.secret = q, this.hash = new V36.RawSha256, this.reset()
            }
            return A.prototype.update = function(q) {
                if ((0, zKA.isEmptyData)(q) || this.error) return;
                try {
                    this.hash.update((0, zKA.convertToBuffer)(q))
                } catch (K) {
                    this.error = K
                }
            }, A.prototype.digestSync = function() {
                if (this.error) throw this.error;
                if (this.outer) {
                    if (!this.outer.finished) this.outer.update(this.hash.digest());
                    return this.outer.digest()
                }
                return this.hash.digest()
            }, A.prototype.digest = function() {
                return kK7.__awaiter(this, void 0, void 0, function() {
                    return kK7.__generator(this, function(q) {
                        return [2, this.digestSync()]
                    })
                })
            }, A.prototype.reset = function() {
                if (this.hash = new V36.RawSha256, this.secret) {
                    this.outer = new V36.RawSha256;
                    var q = dk5(this.secret),
                        K = new Uint8Array(N36.BLOCK_SIZE);
                    K.set(q);
                    for (var Y = 0; Y < N36.BLOCK_SIZE; Y++) q[Y] ^= 54, K[Y] ^= 92;
                    this.hash.update(q), this.outer.update(K);
                    for (var Y = 0; Y < q.byteLength; Y++) q[Y] = 0
                }
            }, A
        }();
    LK7.Sha256 = pk5;

    function dk5(A) {
        var q = (0, zKA.convertToBuffer)(A);
        if (q.byteLength > N36.BLOCK_SIZE) {
            var K = new V36.RawSha256;
            K.update(q), q = K.digest()
        }
        var Y = new Uint8Array(N36.BLOCK_SIZE);
        return Y.set(q), Y
    }
})
// @from(Ln 143700, Col 4)
CK7 = R((wKA) => {
    Object.defineProperty(wKA, "__esModule", {
        value: !0
    });
    var ck5 = qKA();
    ck5.__exportStar(yK7(), wKA)
})
// @from(Ln 143707, Col 4)
QK7 = R((XV2, FK7) => {
    var {
        defineProperty: T36,
        getOwnPropertyDescriptor: lk5,
        getOwnPropertyNames: ik5
    } = Object, nk5 = Object.prototype.hasOwnProperty, v36 = (A, q) => T36(A, "name", {
        value: q,
        configurable: !0
    }), rk5 = (A, q) => {
        for (var K in q) T36(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, ok5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of ik5(q))
                if (!nk5.call(A, z) && z !== K) T36(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = lk5(q, z)) || Y.enumerable
                })
        }
        return A
    }, ak5 = (A) => ok5(T36({}, "__esModule", {
        value: !0
    }), A), SK7 = {};
    rk5(SK7, {
        AlgorithmId: () => bK7,
        EndpointURLScheme: () => xK7,
        FieldPosition: () => uK7,
        HttpApiKeyAuthLocation: () => IK7,
        HttpAuthLocation: () => hK7,
        IniSectionType: () => BK7,
        RequestHandlerProtocol: () => mK7,
        SMITHY_CONTEXT_KEY: () => qL5,
        getDefaultClientConfiguration: () => ek5,
        resolveDefaultRuntimeConfig: () => AL5
    });
    FK7.exports = ak5(SK7);
    var hK7 = ((A) => {
            return A.HEADER = "header", A.QUERY = "query", A
        })(hK7 || {}),
        IK7 = ((A) => {
            return A.HEADER = "header", A.QUERY = "query", A
        })(IK7 || {}),
        xK7 = ((A) => {
            return A.HTTP = "http", A.HTTPS = "https", A
        })(xK7 || {}),
        bK7 = ((A) => {
            return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
        })(bK7 || {}),
        sk5 = v36((A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => "sha256",
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => "md5",
                checksumConstructor: () => A.md5
            });
            return {
                addChecksumAlgorithm(K) {
                    q.push(K)
                },
                checksumAlgorithms() {
                    return q
                }
            }
        }, "getChecksumConfiguration"),
        tk5 = v36((A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        }, "resolveChecksumRuntimeConfig"),
        ek5 = v36((A) => {
            return sk5(A)
        }, "getDefaultClientConfiguration"),
        AL5 = v36((A) => {
            return tk5(A)
        }, "resolveDefaultRuntimeConfig"),
        uK7 = ((A) => {
            return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
        })(uK7 || {}),
        qL5 = "__smithy_context",
        BK7 = ((A) => {
            return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
        })(BK7 || {}),
        mK7 = ((A) => {
            return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
        })(mK7 || {})
})
// @from(Ln 143799, Col 4)
lK7 = R((DV2, cK7) => {
    var {
        defineProperty: E36,
        getOwnPropertyDescriptor: KL5,
        getOwnPropertyNames: YL5
    } = Object, zL5 = Object.prototype.hasOwnProperty, Cr = (A, q) => E36(A, "name", {
        value: q,
        configurable: !0
    }), wL5 = (A, q) => {
        for (var K in q) E36(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, HL5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of YL5(q))
                if (!zL5.call(A, z) && z !== K) E36(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = KL5(q, z)) || Y.enumerable
                })
        }
        return A
    }, $L5 = (A) => HL5(E36({}, "__esModule", {
        value: !0
    }), A), gK7 = {};
    wL5(gK7, {
        Field: () => JL5,
        Fields: () => XL5,
        HttpRequest: () => DL5,
        HttpResponse: () => jL5,
        IHttpRequest: () => UK7.HttpRequest,
        getHttpHandlerExtensionConfiguration: () => OL5,
        isValidHostname: () => dK7,
        resolveHttpHandlerRuntimeConfig: () => _L5
    });
    cK7.exports = $L5(gK7);
    var OL5 = Cr((A) => {
            return {
                setHttpHandler(q) {
                    A.httpHandler = q
                },
                httpHandler() {
                    return A.httpHandler
                },
                updateHttpClientConfig(q, K) {
                    A.httpHandler?.updateHttpClientConfig(q, K)
                },
                httpHandlerConfigs() {
                    return A.httpHandler.httpHandlerConfigs()
                }
            }
        }, "getHttpHandlerExtensionConfiguration"),
        _L5 = Cr((A) => {
            return {
                httpHandler: A.httpHandler()
            }
        }, "resolveHttpHandlerRuntimeConfig"),
        UK7 = QK7(),
        JL5 = class {
            static {
                Cr(this, "Field")
            }
            constructor({
                name: A,
                kind: q = UK7.FieldPosition.HEADER,
                values: K = []
            }) {
                this.name = A, this.kind = q, this.values = K
            }
            add(A) {
                this.values.push(A)
            }
            set(A) {
                this.values = A
            }
            remove(A) {
                this.values = this.values.filter((q) => q !== A)
            }
            toString() {
                return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
            }
            get() {
                return this.values
            }
        },
        XL5 = class {
            constructor({
                fields: A = [],
                encoding: q = "utf-8"
            }) {
                this.entries = {}, A.forEach(this.setField.bind(this)), this.encoding = q
            }
            static {
                Cr(this, "Fields")
            }
            setField(A) {
                this.entries[A.name.toLowerCase()] = A
            }
            getField(A) {
                return this.entries[A.toLowerCase()]
            }
            removeField(A) {
                delete this.entries[A.toLowerCase()]
            }
            getByType(A) {
                return Object.values(this.entries).filter((q) => q.kind === A)
            }
        },
        DL5 = class A {
            static {
                Cr(this, "HttpRequest")
            }
            constructor(q) {
                this.method = q.method || "GET", this.hostname = q.hostname || "localhost", this.port = q.port, this.query = q.query || {}, this.headers = q.headers || {}, this.body = q.body, this.protocol = q.protocol ? q.protocol.slice(-1) !== ":" ? `${q.protocol}:` : q.protocol : "https:", this.path = q.path ? q.path.charAt(0) !== "/" ? `/${q.path}` : q.path : "/", this.username = q.username, this.password = q.password, this.fragment = q.fragment
            }
            static clone(q) {
                let K = new A({
                    ...q,
                    headers: {
                        ...q.headers
                    }
                });
                if (K.query) K.query = pK7(K.query);
                return K
            }
            static isInstance(q) {
                if (!q) return !1;
                let K = q;
                return "method" in K && "protocol" in K && "hostname" in K && "path" in K && typeof K.query === "object" && typeof K.headers === "object"
            }
            clone() {
                return A.clone(this)
            }
        };

    function pK7(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    Cr(pK7, "cloneQuery");
    var jL5 = class {
        static {
            Cr(this, "HttpResponse")
        }
        constructor(A) {
            this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return typeof q.statusCode === "number" && typeof q.headers === "object"
        }
    };

    function dK7(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    Cr(dK7, "isValidHostname")
})
// @from(Ln 143963, Col 4)
oK7 = R((WV2, rK7) => {
    var {
        defineProperty: k36,
        getOwnPropertyDescriptor: ML5,
        getOwnPropertyNames: PL5
    } = Object, WL5 = Object.prototype.hasOwnProperty, HKA = (A, q) => k36(A, "name", {
        value: q,
        configurable: !0
    }), GL5 = (A, q) => {
        for (var K in q) k36(A, K, {
            get: q[K],
            enumerable: !0
        })
    }, ZL5 = (A, q, K, Y) => {
        if (q && typeof q === "object" || typeof q === "function") {
            for (let z of PL5(q))
                if (!WL5.call(A, z) && z !== K) k36(A, z, {
                    get: () => q[z],
                    enumerable: !(Y = ML5(q, z)) || Y.enumerable
                })
        }
        return A
    }, fL5 = (A) => ZL5(k36({}, "__esModule", {
        value: !0
    }), A), iK7 = {};
    GL5(iK7, {
        escapeUri: () => nK7,
        escapeUriPath: () => NL5
    });
    rK7.exports = fL5(iK7);
    var nK7 = HKA((A) => encodeURIComponent(A).replace(/[!'()*]/g, VL5), "escapeUri"),
        VL5 = HKA((A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`, "hexEncode"),
        NL5 = HKA((A) => A.split("/").map(nK7).join("/"), "escapeUriPath")
})