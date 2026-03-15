
// @from(Ln 144501, Col 0)
function WT7(A, q, K) {
    try {
        A.setRequestHandler(yp, async (Y, z) => {
            n1(q, `Received elicitation request: ${B6(Y)}`);
            let _ = jB3(Y.params);
            d("tengu_mcp_elicitation_shown", {
                mode: _
            });
            try {
                let w = await sx6(q, Y.params, z.signal);
                if (w) return n1(q, `Elicitation resolved by hook: ${B6(w)}`), d("tengu_mcp_elicitation_response", {
                    mode: _,
                    action: w.action
                }), w;
                let O = _ === "url" && "elicitationId" in Y.params ? Y.params.elicitationId : void 0,
                    H = await new Promise((J) => {
                        let M = () => {
                            J({
                                action: "cancel"
                            })
                        };
                        if (z.signal.aborted) {
                            M();
                            return
                        }
                        let D = O ? {
                            actionLabel: "Skip confirmation"
                        } : void 0;
                        K((X) => ({
                            ...X,
                            elicitation: {
                                queue: [...X.elicitation.queue, {
                                    serverName: q,
                                    requestId: z.requestId,
                                    params: Y.params,
                                    signal: z.signal,
                                    waitingState: D,
                                    respond: (P) => {
                                        z.signal.removeEventListener("abort", M), d("tengu_mcp_elicitation_response", {
                                            mode: _,
                                            action: P.action
                                        }), J(P)
                                    }
                                }]
                            }
                        })), z.signal.addEventListener("abort", M)
                    });
                return n1(q, `Elicitation response: ${B6(H)}`), await tx6(q, H, z.signal, _, O)
            } catch (w) {
                return EY(q, `Elicitation error: ${w}`), {
                    action: "cancel"
                }
            }
        }), A.setNotificationHandler(My6, (Y) => {
            let {
                elicitationId: z
            } = Y.params;
            n1(q, `Received elicitation completion notification: ${z}`), Xm({
                message: `MCP server "${q}" confirmed elicitation ${z} complete`,
                notificationType: "elicitation_complete"
            });
            let _ = !1;
            if (K((w) => {
                    let O = JB3(w.elicitation.queue, q, z);
                    if (O === -1) return w;
                    _ = !0;
                    let $ = [...w.elicitation.queue];
                    return $[O] = {
                        ...$[O],
                        completed: !0
                    }, {
                        ...w,
                        elicitation: {
                            queue: $
                        }
                    }
                }), !_) n1(q, `Ignoring completion notification for unknown elicitation: ${z}`)
        })
    } catch {
        return
    }
}
// @from(Ln 144583, Col 0)
async function sx6(A, q, K) {
    try {
        let Y = q.mode === "url" ? "url" : "form",
            z = "url" in q ? q.url : void 0,
            _ = "elicitationId" in q ? q.elicitationId : void 0,
            {
                elicitationResponse: w,
                blockingError: O
            } = await A$8({
                serverName: A,
                message: q.message,
                requestedSchema: "requestedSchema" in q ? q.requestedSchema : void 0,
                signal: K,
                mode: Y,
                url: z,
                elicitationId: _
            });
        if (O) return {
            action: "decline"
        };
        if (w) return {
            action: w.action,
            content: w.content
        };
        return
    } catch (Y) {
        EY(A, `Elicitation hook error: ${Y}`);
        return
    }
}
// @from(Ln 144613, Col 0)
async function tx6(A, q, K, Y, z) {
    try {
        let {
            elicitationResultResponse: _,
            blockingError: w
        } = await q$8({
            serverName: A,
            action: q.action,
            content: q.content,
            signal: K,
            mode: Y,
            elicitationId: z
        });
        if (w) return Xm({
            message: `Elicitation response for server "${A}": decline`,
            notificationType: "elicitation_response"
        }), {
            action: "decline"
        };
        let O = _ ? {
            action: _.action,
            content: _.content ?? q.content
        } : q;
        return Xm({
            message: `Elicitation response for server "${A}": ${O.action}`,
            notificationType: "elicitation_response"
        }), O
    } catch (_) {
        return EY(A, `ElicitationResult hook error: ${_}`), Xm({
            message: `Elicitation response for server "${A}": ${q.action}`,
            notificationType: "elicitation_response"
        }), q
    }
}
// @from(Ln 144647, Col 4)
kw1 = E(() => {
    hD();
    V1();
    k1();
    g1();
    hw()
})
// @from(Ln 144654, Col 4)
ex6 = x((Ae_, ZT7) => {
    var MB3 = Number.MAX_SAFE_INTEGER || 9007199254740991,
        DB3 = ["major", "premajor", "minor", "preminor", "patch", "prepatch", "prerelease"];
    ZT7.exports = {
        MAX_LENGTH: 256,
        MAX_SAFE_COMPONENT_LENGTH: 16,
        MAX_SAFE_BUILD_LENGTH: 250,
        MAX_SAFE_INTEGER: MB3,
        RELEASE_TYPES: DB3,
        SEMVER_SPEC_VERSION: "2.0.0",
        FLAG_INCLUDE_PRERELEASE: 1,
        FLAG_LOOSE: 2
    }
})
// @from(Ln 144668, Col 4)
Au6 = x((qe_, GT7) => {
    var XB3 = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...A) => console.error("SEMVER", ...A) : () => {};
    GT7.exports = XB3
})
// @from(Ln 144672, Col 4)
dD6 = x((Pm, fT7) => {
    var {
        MAX_SAFE_COMPONENT_LENGTH: K$8,
        MAX_SAFE_BUILD_LENGTH: PB3,
        MAX_LENGTH: WB3
    } = ex6(), ZB3 = Au6();
    Pm = fT7.exports = {};
    var GB3 = Pm.re = [],
        fB3 = Pm.safeRe = [],
        h4 = Pm.src = [],
        TB3 = Pm.safeSrc = [],
        S4 = Pm.t = {},
        vB3 = 0,
        Y$8 = "[a-zA-Z0-9-]",
        NB3 = [
            ["\\s", 1],
            ["\\d", WB3],
            [Y$8, PB3]
        ],
        VB3 = (A) => {
            for (let [q, K] of NB3) A = A.split(`${q}*`).join(`${q}{0,${K}}`).split(`${q}+`).join(`${q}{1,${K}}`);
            return A
        },
        Q5 = (A, q, K) => {
            let Y = VB3(q),
                z = vB3++;
            ZB3(A, z, q), S4[A] = z, h4[z] = q, TB3[z] = Y, GB3[z] = new RegExp(q, K ? "g" : void 0), fB3[z] = new RegExp(Y, K ? "g" : void 0)
        };
    Q5("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    Q5("NUMERICIDENTIFIERLOOSE", "\\d+");
    Q5("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${Y$8}*`);
    Q5("MAINVERSION", `(${h4[S4.NUMERICIDENTIFIER]})\\.(${h4[S4.NUMERICIDENTIFIER]})\\.(${h4[S4.NUMERICIDENTIFIER]})`);
    Q5("MAINVERSIONLOOSE", `(${h4[S4.NUMERICIDENTIFIERLOOSE]})\\.(${h4[S4.NUMERICIDENTIFIERLOOSE]})\\.(${h4[S4.NUMERICIDENTIFIERLOOSE]})`);
    Q5("PRERELEASEIDENTIFIER", `(?:${h4[S4.NONNUMERICIDENTIFIER]}|${h4[S4.NUMERICIDENTIFIER]})`);
    Q5("PRERELEASEIDENTIFIERLOOSE", `(?:${h4[S4.NONNUMERICIDENTIFIER]}|${h4[S4.NUMERICIDENTIFIERLOOSE]})`);
    Q5("PRERELEASE", `(?:-(${h4[S4.PRERELEASEIDENTIFIER]}(?:\\.${h4[S4.PRERELEASEIDENTIFIER]})*))`);
    Q5("PRERELEASELOOSE", `(?:-?(${h4[S4.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${h4[S4.PRERELEASEIDENTIFIERLOOSE]})*))`);
    Q5("BUILDIDENTIFIER", `${Y$8}+`);
    Q5("BUILD", `(?:\\+(${h4[S4.BUILDIDENTIFIER]}(?:\\.${h4[S4.BUILDIDENTIFIER]})*))`);
    Q5("FULLPLAIN", `v?${h4[S4.MAINVERSION]}${h4[S4.PRERELEASE]}?${h4[S4.BUILD]}?`);
    Q5("FULL", `^${h4[S4.FULLPLAIN]}$`);
    Q5("LOOSEPLAIN", `[v=\\s]*${h4[S4.MAINVERSIONLOOSE]}${h4[S4.PRERELEASELOOSE]}?${h4[S4.BUILD]}?`);
    Q5("LOOSE", `^${h4[S4.LOOSEPLAIN]}$`);
    Q5("GTLT", "((?:<|>)?=?)");
    Q5("XRANGEIDENTIFIERLOOSE", `${h4[S4.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    Q5("XRANGEIDENTIFIER", `${h4[S4.NUMERICIDENTIFIER]}|x|X|\\*`);
    Q5("XRANGEPLAIN", `[v=\\s]*(${h4[S4.XRANGEIDENTIFIER]})(?:\\.(${h4[S4.XRANGEIDENTIFIER]})(?:\\.(${h4[S4.XRANGEIDENTIFIER]})(?:${h4[S4.PRERELEASE]})?${h4[S4.BUILD]}?)?)?`);
    Q5("XRANGEPLAINLOOSE", `[v=\\s]*(${h4[S4.XRANGEIDENTIFIERLOOSE]})(?:\\.(${h4[S4.XRANGEIDENTIFIERLOOSE]})(?:\\.(${h4[S4.XRANGEIDENTIFIERLOOSE]})(?:${h4[S4.PRERELEASELOOSE]})?${h4[S4.BUILD]}?)?)?`);
    Q5("XRANGE", `^${h4[S4.GTLT]}\\s*${h4[S4.XRANGEPLAIN]}$`);
    Q5("XRANGELOOSE", `^${h4[S4.GTLT]}\\s*${h4[S4.XRANGEPLAINLOOSE]}$`);
    Q5("COERCEPLAIN", `(^|[^\\d])(\\d{1,${K$8}})(?:\\.(\\d{1,${K$8}}))?(?:\\.(\\d{1,${K$8}}))?`);
    Q5("COERCE", `${h4[S4.COERCEPLAIN]}(?:$|[^\\d])`);
    Q5("COERCEFULL", h4[S4.COERCEPLAIN] + `(?:${h4[S4.PRERELEASE]})?(?:${h4[S4.BUILD]})?(?:$|[^\\d])`);
    Q5("COERCERTL", h4[S4.COERCE], !0);
    Q5("COERCERTLFULL", h4[S4.COERCEFULL], !0);
    Q5("LONETILDE", "(?:~>?)");
    Q5("TILDETRIM", `(\\s*)${h4[S4.LONETILDE]}\\s+`, !0);
    Pm.tildeTrimReplace = "$1~";
    Q5("TILDE", `^${h4[S4.LONETILDE]}${h4[S4.XRANGEPLAIN]}$`);
    Q5("TILDELOOSE", `^${h4[S4.LONETILDE]}${h4[S4.XRANGEPLAINLOOSE]}$`);
    Q5("LONECARET", "(?:\\^)");
    Q5("CARETTRIM", `(\\s*)${h4[S4.LONECARET]}\\s+`, !0);
    Pm.caretTrimReplace = "$1^";
    Q5("CARET", `^${h4[S4.LONECARET]}${h4[S4.XRANGEPLAIN]}$`);
    Q5("CARETLOOSE", `^${h4[S4.LONECARET]}${h4[S4.XRANGEPLAINLOOSE]}$`);
    Q5("COMPARATORLOOSE", `^${h4[S4.GTLT]}\\s*(${h4[S4.LOOSEPLAIN]})$|^$`);
    Q5("COMPARATOR", `^${h4[S4.GTLT]}\\s*(${h4[S4.FULLPLAIN]})$|^$`);
    Q5("COMPARATORTRIM", `(\\s*)${h4[S4.GTLT]}\\s*(${h4[S4.LOOSEPLAIN]}|${h4[S4.XRANGEPLAIN]})`, !0);
    Pm.comparatorTrimReplace = "$1$2$3";
    Q5("HYPHENRANGE", `^\\s*(${h4[S4.XRANGEPLAIN]})\\s+-\\s+(${h4[S4.XRANGEPLAIN]})\\s*$`);
    Q5("HYPHENRANGELOOSE", `^\\s*(${h4[S4.XRANGEPLAINLOOSE]})\\s+-\\s+(${h4[S4.XRANGEPLAINLOOSE]})\\s*$`);
    Q5("STAR", "(<|>)?=?\\s*\\*");
    Q5("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    Q5("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$")
})
// @from(Ln 144747, Col 4)
Ew1 = x((Ke_, TT7) => {
    var kB3 = Object.freeze({
            loose: !0
        }),
        EB3 = Object.freeze({}),
        yB3 = (A) => {
            if (!A) return EB3;
            if (typeof A !== "object") return kB3;
            return A
        };
    TT7.exports = yB3
})
// @from(Ln 144759, Col 4)
z$8 = x((Ye_, VT7) => {
    var vT7 = /^[0-9]+$/,
        NT7 = (A, q) => {
            let K = vT7.test(A),
                Y = vT7.test(q);
            if (K && Y) A = +A, q = +q;
            return A === q ? 0 : K && !Y ? -1 : Y && !K ? 1 : A < q ? -1 : 1
        },
        LB3 = (A, q) => NT7(q, A);
    VT7.exports = {
        compareIdentifiers: NT7,
        rcompareIdentifiers: LB3
    }
})
// @from(Ln 144773, Col 4)
pW = x((ze_, ET7) => {
    var yw1 = Au6(),
        {
            MAX_LENGTH: kT7,
            MAX_SAFE_INTEGER: Lw1
        } = ex6(),
        {
            safeRe: Rw1,
            t: hw1
        } = dD6(),
        RB3 = Ew1(),
        {
            compareIdentifiers: cD6
        } = z$8();
    class CC {
        constructor(A, q) {
            if (q = RB3(q), A instanceof CC)
                if (A.loose === !!q.loose && A.includePrerelease === !!q.includePrerelease) return A;
                else A = A.version;
            else if (typeof A !== "string") throw TypeError(`Invalid version. Must be a string. Got type "${typeof A}".`);
            if (A.length > kT7) throw TypeError(`version is longer than ${kT7} characters`);
            yw1("SemVer", A, q), this.options = q, this.loose = !!q.loose, this.includePrerelease = !!q.includePrerelease;
            let K = A.trim().match(q.loose ? Rw1[hw1.LOOSE] : Rw1[hw1.FULL]);
            if (!K) throw TypeError(`Invalid Version: ${A}`);
            if (this.raw = A, this.major = +K[1], this.minor = +K[2], this.patch = +K[3], this.major > Lw1 || this.major < 0) throw TypeError("Invalid major version");
            if (this.minor > Lw1 || this.minor < 0) throw TypeError("Invalid minor version");
            if (this.patch > Lw1 || this.patch < 0) throw TypeError("Invalid patch version");
            if (!K[4]) this.prerelease = [];
            else this.prerelease = K[4].split(".").map((Y) => {
                if (/^[0-9]+$/.test(Y)) {
                    let z = +Y;
                    if (z >= 0 && z < Lw1) return z
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
            if (yw1("SemVer.compare", this.version, this.options, A), !(A instanceof CC)) {
                if (typeof A === "string" && A === this.version) return 0;
                A = new CC(A, this.options)
            }
            if (A.version === this.version) return 0;
            return this.compareMain(A) || this.comparePre(A)
        }
        compareMain(A) {
            if (!(A instanceof CC)) A = new CC(A, this.options);
            return cD6(this.major, A.major) || cD6(this.minor, A.minor) || cD6(this.patch, A.patch)
        }
        comparePre(A) {
            if (!(A instanceof CC)) A = new CC(A, this.options);
            if (this.prerelease.length && !A.prerelease.length) return -1;
            else if (!this.prerelease.length && A.prerelease.length) return 1;
            else if (!this.prerelease.length && !A.prerelease.length) return 0;
            let q = 0;
            do {
                let K = this.prerelease[q],
                    Y = A.prerelease[q];
                if (yw1("prerelease compare", q, K, Y), K === void 0 && Y === void 0) return 0;
                else if (Y === void 0) return 1;
                else if (K === void 0) return -1;
                else if (K === Y) continue;
                else return cD6(K, Y)
            } while (++q)
        }
        compareBuild(A) {
            if (!(A instanceof CC)) A = new CC(A, this.options);
            let q = 0;
            do {
                let K = this.build[q],
                    Y = A.build[q];
                if (yw1("build compare", q, K, Y), K === void 0 && Y === void 0) return 0;
                else if (Y === void 0) return 1;
                else if (K === void 0) return -1;
                else if (K === Y) continue;
                else return cD6(K, Y)
            } while (++q)
        }
        inc(A, q, K) {
            if (A.startsWith("pre")) {
                if (!q && K === !1) throw Error("invalid increment argument: identifier is empty");
                if (q) {
                    let Y = `-${q}`.match(this.options.loose ? Rw1[hw1.PRERELEASELOOSE] : Rw1[hw1.PRERELEASE]);
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
                        if (cD6(this.prerelease[0], q) === 0) {
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
    ET7.exports = CC
})
// @from(Ln 144926, Col 4)
YK6 = x((_e_, LT7) => {
    var yT7 = pW(),
        hB3 = (A, q, K = !1) => {
            if (A instanceof yT7) return A;
            try {
                return new yT7(A, q)
            } catch (Y) {
                if (!K) return null;
                throw Y
            }
        };
    LT7.exports = hB3
})
// @from(Ln 144939, Col 4)
hT7 = x((we_, RT7) => {
    var SB3 = YK6(),
        CB3 = (A, q) => {
            let K = SB3(A, q);
            return K ? K.version : null
        };
    RT7.exports = CB3
})
// @from(Ln 144947, Col 4)
CT7 = x((Oe_, ST7) => {
    var IB3 = YK6(),
        bB3 = (A, q) => {
            let K = IB3(A.trim().replace(/^[=v]+/, ""), q);
            return K ? K.version : null
        };
    ST7.exports = bB3
})
// @from(Ln 144955, Col 4)
xT7 = x(($e_, bT7) => {
    var IT7 = pW(),
        xB3 = (A, q, K, Y, z) => {
            if (typeof K === "string") z = Y, Y = K, K = void 0;
            try {
                return new IT7(A instanceof IT7 ? A.version : A, K).inc(q, Y, z).version
            } catch (_) {
                return null
            }
        };
    bT7.exports = xB3
})
// @from(Ln 144967, Col 4)
BT7 = x((He_, mT7) => {
    var uT7 = YK6(),
        uB3 = (A, q) => {
            let K = uT7(A, null, !0),
                Y = uT7(q, null, !0),
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
    mT7.exports = uB3
})
// @from(Ln 144993, Col 4)
FT7 = x((je_, gT7) => {
    var mB3 = pW(),
        BB3 = (A, q) => new mB3(A, q).major;
    gT7.exports = BB3
})
// @from(Ln 144998, Col 4)
QT7 = x((Je_, pT7) => {
    var gB3 = pW(),
        FB3 = (A, q) => new gB3(A, q).minor;
    pT7.exports = FB3
})
// @from(Ln 145003, Col 4)
dT7 = x((Me_, UT7) => {
    var pB3 = pW(),
        QB3 = (A, q) => new pB3(A, q).patch;
    UT7.exports = QB3
})
// @from(Ln 145008, Col 4)
lT7 = x((De_, cT7) => {
    var UB3 = YK6(),
        dB3 = (A, q) => {
            let K = UB3(A, q);
            return K && K.prerelease.length ? K.prerelease : null
        };
    cT7.exports = dB3
})
// @from(Ln 145016, Col 4)
IL = x((Xe_, nT7) => {
    var iT7 = pW(),
        cB3 = (A, q, K) => new iT7(A, K).compare(new iT7(q, K));
    nT7.exports = cB3
})
// @from(Ln 145021, Col 4)
oT7 = x((Pe_, rT7) => {
    var lB3 = IL(),
        iB3 = (A, q, K) => lB3(q, A, K);
    rT7.exports = iB3
})
// @from(Ln 145026, Col 4)
sT7 = x((We_, aT7) => {
    var nB3 = IL(),
        rB3 = (A, q) => nB3(A, q, !0);
    aT7.exports = rB3
})
// @from(Ln 145031, Col 4)
Sw1 = x((Ze_, eT7) => {
    var tT7 = pW(),
        oB3 = (A, q, K) => {
            let Y = new tT7(A, K),
                z = new tT7(q, K);
            return Y.compare(z) || Y.compareBuild(z)
        };
    eT7.exports = oB3
})
// @from(Ln 145040, Col 4)
qv7 = x((Ge_, Av7) => {
    var aB3 = Sw1(),
        sB3 = (A, q) => A.sort((K, Y) => aB3(K, Y, q));
    Av7.exports = sB3
})
// @from(Ln 145045, Col 4)
Yv7 = x((fe_, Kv7) => {
    var tB3 = Sw1(),
        eB3 = (A, q) => A.sort((K, Y) => tB3(Y, K, q));
    Kv7.exports = eB3
})
// @from(Ln 145050, Col 4)
qu6 = x((Te_, zv7) => {
    var Ag3 = IL(),
        qg3 = (A, q, K) => Ag3(A, q, K) > 0;
    zv7.exports = qg3
})
// @from(Ln 145055, Col 4)
Cw1 = x((ve_, _v7) => {
    var Kg3 = IL(),
        Yg3 = (A, q, K) => Kg3(A, q, K) < 0;
    _v7.exports = Yg3
})
// @from(Ln 145060, Col 4)
_$8 = x((Ne_, wv7) => {
    var zg3 = IL(),
        _g3 = (A, q, K) => zg3(A, q, K) === 0;
    wv7.exports = _g3
})
// @from(Ln 145065, Col 4)
w$8 = x((Ve_, Ov7) => {
    var wg3 = IL(),
        Og3 = (A, q, K) => wg3(A, q, K) !== 0;
    Ov7.exports = Og3
})
// @from(Ln 145070, Col 4)
Iw1 = x((ke_, $v7) => {
    var $g3 = IL(),
        Hg3 = (A, q, K) => $g3(A, q, K) >= 0;
    $v7.exports = Hg3
})
// @from(Ln 145075, Col 4)
bw1 = x((Ee_, Hv7) => {
    var jg3 = IL(),
        Jg3 = (A, q, K) => jg3(A, q, K) <= 0;
    Hv7.exports = Jg3
})
// @from(Ln 145080, Col 4)
O$8 = x((ye_, jv7) => {
    var Mg3 = _$8(),
        Dg3 = w$8(),
        Xg3 = qu6(),
        Pg3 = Iw1(),
        Wg3 = Cw1(),
        Zg3 = bw1(),
        Gg3 = (A, q, K, Y) => {
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
                    return Mg3(A, K, Y);
                case "!=":
                    return Dg3(A, K, Y);
                case ">":
                    return Xg3(A, K, Y);
                case ">=":
                    return Pg3(A, K, Y);
                case "<":
                    return Wg3(A, K, Y);
                case "<=":
                    return Zg3(A, K, Y);
                default:
                    throw TypeError(`Invalid operator: ${q}`)
            }
        };
    jv7.exports = Gg3
})
// @from(Ln 145117, Col 4)
Mv7 = x((Le_, Jv7) => {
    var fg3 = pW(),
        Tg3 = YK6(),
        {
            safeRe: xw1,
            t: uw1
        } = dD6(),
        vg3 = (A, q) => {
            if (A instanceof fg3) return A;
            if (typeof A === "number") A = String(A);
            if (typeof A !== "string") return null;
            q = q || {};
            let K = null;
            if (!q.rtl) K = A.match(q.includePrerelease ? xw1[uw1.COERCEFULL] : xw1[uw1.COERCE]);
            else {
                let $ = q.includePrerelease ? xw1[uw1.COERCERTLFULL] : xw1[uw1.COERCERTL],
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
            return Tg3(`${Y}.${z}.${_}${w}${O}`, q)
        };
    Jv7.exports = vg3
})
// @from(Ln 145150, Col 4)
Pv7 = x((Re_, Xv7) => {
    class Dv7 {
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
    Xv7.exports = Dv7
})
// @from(Ln 145176, Col 4)
bL = x((he_, fv7) => {
    var Ng3 = /\s+/g;
    class Ku6 {
        constructor(A, q) {
            if (q = kg3(q), A instanceof Ku6)
                if (A.loose === !!q.loose && A.includePrerelease === !!q.includePrerelease) return A;
                else return new Ku6(A.raw, q);
            if (A instanceof $$8) return this.raw = A.value, this.set = [
                [A]
            ], this.formatted = void 0, this;
            if (this.options = q, this.loose = !!q.loose, this.includePrerelease = !!q.includePrerelease, this.raw = A.trim().replace(Ng3, " "), this.set = this.raw.split("||").map((K) => this.parseRange(K.trim())).filter((K) => K.length), !this.set.length) throw TypeError(`Invalid SemVer Range: ${this.raw}`);
            if (this.set.length > 1) {
                let K = this.set[0];
                if (this.set = this.set.filter((Y) => !Zv7(Y[0])), this.set.length === 0) this.set = [K];
                else if (this.set.length > 1) {
                    for (let Y of this.set)
                        if (Y.length === 1 && Cg3(Y[0])) {
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
            let K = ((this.options.includePrerelease && hg3) | (this.options.loose && Sg3)) + ":" + A,
                Y = Wv7.get(K);
            if (Y) return Y;
            let z = this.options.loose,
                _ = z ? Xv[pG.HYPHENRANGELOOSE] : Xv[pG.HYPHENRANGE];
            A = A.replace(_, Qg3(this.options.includePrerelease)), DO("hyphen replace", A), A = A.replace(Xv[pG.COMPARATORTRIM], yg3), DO("comparator trim", A), A = A.replace(Xv[pG.TILDETRIM], Lg3), DO("tilde trim", A), A = A.replace(Xv[pG.CARETTRIM], Rg3), DO("caret trim", A);
            let w = A.split(" ").map((j) => Ig3(j, this.options)).join(" ").split(/\s+/).map((j) => pg3(j, this.options));
            if (z) w = w.filter((j) => {
                return DO("loose invalid filter", j, this.options), !!j.match(Xv[pG.COMPARATORLOOSE])
            });
            DO("range list", w);
            let O = new Map,
                $ = w.map((j) => new $$8(j, this.options));
            for (let j of $) {
                if (Zv7(j)) return [j];
                O.set(j.value, j)
            }
            if (O.size > 1 && O.has("")) O.delete("");
            let H = [...O.values()];
            return Wv7.set(K, H), H
        }
        intersects(A, q) {
            if (!(A instanceof Ku6)) throw TypeError("a Range is required");
            return this.set.some((K) => {
                return Gv7(K, q) && A.set.some((Y) => {
                    return Gv7(Y, q) && K.every((z) => {
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
                A = new Eg3(A, this.options)
            } catch (q) {
                return !1
            }
            for (let q = 0; q < this.set.length; q++)
                if (Ug3(this.set[q], A, this.options)) return !0;
            return !1
        }
    }
    fv7.exports = Ku6;
    var Vg3 = Pv7(),
        Wv7 = new Vg3,
        kg3 = Ew1(),
        $$8 = Yu6(),
        DO = Au6(),
        Eg3 = pW(),
        {
            safeRe: Xv,
            t: pG,
            comparatorTrimReplace: yg3,
            tildeTrimReplace: Lg3,
            caretTrimReplace: Rg3
        } = dD6(),
        {
            FLAG_INCLUDE_PRERELEASE: hg3,
            FLAG_LOOSE: Sg3
        } = ex6(),
        Zv7 = (A) => A.value === "<0.0.0-0",
        Cg3 = (A) => A.value === "",
        Gv7 = (A, q) => {
            let K = !0,
                Y = A.slice(),
                z = Y.pop();
            while (K && Y.length) K = Y.every((_) => {
                return z.intersects(_, q)
            }), z = Y.pop();
            return K
        },
        Ig3 = (A, q) => {
            return DO("comp", A, q), A = ug3(A, q), DO("caret", A), A = bg3(A, q), DO("tildes", A), A = Bg3(A, q), DO("xrange", A), A = Fg3(A, q), DO("stars", A), A
        },
        QG = (A) => !A || A.toLowerCase() === "x" || A === "*",
        bg3 = (A, q) => {
            return A.trim().split(/\s+/).map((K) => xg3(K, q)).join(" ")
        },
        xg3 = (A, q) => {
            let K = q.loose ? Xv[pG.TILDELOOSE] : Xv[pG.TILDE];
            return A.replace(K, (Y, z, _, w, O) => {
                DO("tilde", A, Y, z, _, w, O);
                let $;
                if (QG(z)) $ = "";
                else if (QG(_)) $ = `>=${z}.0.0 <${+z+1}.0.0-0`;
                else if (QG(w)) $ = `>=${z}.${_}.0 <${z}.${+_+1}.0-0`;
                else if (O) DO("replaceTilde pr", O), $ = `>=${z}.${_}.${w}-${O} <${z}.${+_+1}.0-0`;
                else $ = `>=${z}.${_}.${w} <${z}.${+_+1}.0-0`;
                return DO("tilde return", $), $
            })
        },
        ug3 = (A, q) => {
            return A.trim().split(/\s+/).map((K) => mg3(K, q)).join(" ")
        },
        mg3 = (A, q) => {
            DO("caret", A, q);
            let K = q.loose ? Xv[pG.CARETLOOSE] : Xv[pG.CARET],
                Y = q.includePrerelease ? "-0" : "";
            return A.replace(K, (z, _, w, O, $) => {
                DO("caret", A, z, _, w, O, $);
                let H;
                if (QG(_)) H = "";
                else if (QG(w)) H = `>=${_}.0.0${Y} <${+_+1}.0.0-0`;
                else if (QG(O))
                    if (_ === "0") H = `>=${_}.${w}.0${Y} <${_}.${+w+1}.0-0`;
                    else H = `>=${_}.${w}.0${Y} <${+_+1}.0.0-0`;
                else if ($)
                    if (DO("replaceCaret pr", $), _ === "0")
                        if (w === "0") H = `>=${_}.${w}.${O}-${$} <${_}.${w}.${+O+1}-0`;
                        else H = `>=${_}.${w}.${O}-${$} <${_}.${+w+1}.0-0`;
                else H = `>=${_}.${w}.${O}-${$} <${+_+1}.0.0-0`;
                else if (DO("no pr"), _ === "0")
                    if (w === "0") H = `>=${_}.${w}.${O}${Y} <${_}.${w}.${+O+1}-0`;
                    else H = `>=${_}.${w}.${O}${Y} <${_}.${+w+1}.0-0`;
                else H = `>=${_}.${w}.${O} <${+_+1}.0.0-0`;
                return DO("caret return", H), H
            })
        },
        Bg3 = (A, q) => {
            return DO("replaceXRanges", A, q), A.split(/\s+/).map((K) => gg3(K, q)).join(" ")
        },
        gg3 = (A, q) => {
            A = A.trim();
            let K = q.loose ? Xv[pG.XRANGELOOSE] : Xv[pG.XRANGE];
            return A.replace(K, (Y, z, _, w, O, $) => {
                DO("xRange", A, Y, z, _, w, O, $);
                let H = QG(_),
                    j = H || QG(w),
                    J = j || QG(O),
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
                return DO("xRange return", Y), Y
            })
        },
        Fg3 = (A, q) => {
            return DO("replaceStars", A, q), A.trim().replace(Xv[pG.STAR], "")
        },
        pg3 = (A, q) => {
            return DO("replaceGTE0", A, q), A.trim().replace(Xv[q.includePrerelease ? pG.GTE0PRE : pG.GTE0], "")
        },
        Qg3 = (A) => (q, K, Y, z, _, w, O, $, H, j, J, M) => {
            if (QG(Y)) K = "";
            else if (QG(z)) K = `>=${Y}.0.0${A?"-0":""}`;
            else if (QG(_)) K = `>=${Y}.${z}.0${A?"-0":""}`;
            else if (w) K = `>=${K}`;
            else K = `>=${K}${A?"-0":""}`;
            if (QG(H)) $ = "";
            else if (QG(j)) $ = `<${+H+1}.0.0-0`;
            else if (QG(J)) $ = `<${H}.${+j+1}.0-0`;
            else if (M) $ = `<=${H}.${j}.${J}-${M}`;
            else if (A) $ = `<${H}.${j}.${+J+1}-0`;
            else $ = `<=${$}`;
            return `${K} ${$}`.trim()
        },
        Ug3 = (A, q, K) => {
            for (let Y = 0; Y < A.length; Y++)
                if (!A[Y].test(q)) return !1;
            if (q.prerelease.length && !K.includePrerelease) {
                for (let Y = 0; Y < A.length; Y++) {
                    if (DO(A[Y].semver), A[Y].semver === $$8.ANY) continue;
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
// @from(Ln 145409, Col 4)
Yu6 = x((Se_, Ev7) => {
    var zu6 = Symbol("SemVer ANY");
    class mw1 {
        static get ANY() {
            return zu6
        }
        constructor(A, q) {
            if (q = Tv7(q), A instanceof mw1)
                if (A.loose === !!q.loose) return A;
                else A = A.value;
            if (A = A.trim().split(/\s+/).join(" "), j$8("comparator", A, q), this.options = q, this.loose = !!q.loose, this.parse(A), this.semver === zu6) this.value = "";
            else this.value = this.operator + this.semver.version;
            j$8("comp", this)
        }
        parse(A) {
            let q = this.options.loose ? vv7[Nv7.COMPARATORLOOSE] : vv7[Nv7.COMPARATOR],
                K = A.match(q);
            if (!K) throw TypeError(`Invalid comparator: ${A}`);
            if (this.operator = K[1] !== void 0 ? K[1] : "", this.operator === "=") this.operator = "";
            if (!K[2]) this.semver = zu6;
            else this.semver = new Vv7(K[2], this.options.loose)
        }
        toString() {
            return this.value
        }
        test(A) {
            if (j$8("Comparator.test", A, this.options.loose), this.semver === zu6 || A === zu6) return !0;
            if (typeof A === "string") try {
                A = new Vv7(A, this.options)
            } catch (q) {
                return !1
            }
            return H$8(A, this.operator, this.semver, this.options)
        }
        intersects(A, q) {
            if (!(A instanceof mw1)) throw TypeError("a Comparator is required");
            if (this.operator === "") {
                if (this.value === "") return !0;
                return new kv7(A.value, q).test(this.value)
            } else if (A.operator === "") {
                if (A.value === "") return !0;
                return new kv7(this.value, q).test(A.semver)
            }
            if (q = Tv7(q), q.includePrerelease && (this.value === "<0.0.0-0" || A.value === "<0.0.0-0")) return !1;
            if (!q.includePrerelease && (this.value.startsWith("<0.0.0") || A.value.startsWith("<0.0.0"))) return !1;
            if (this.operator.startsWith(">") && A.operator.startsWith(">")) return !0;
            if (this.operator.startsWith("<") && A.operator.startsWith("<")) return !0;
            if (this.semver.version === A.semver.version && this.operator.includes("=") && A.operator.includes("=")) return !0;
            if (H$8(this.semver, "<", A.semver, q) && this.operator.startsWith(">") && A.operator.startsWith("<")) return !0;
            if (H$8(this.semver, ">", A.semver, q) && this.operator.startsWith("<") && A.operator.startsWith(">")) return !0;
            return !1
        }
    }
    Ev7.exports = mw1;
    var Tv7 = Ew1(),
        {
            safeRe: vv7,
            t: Nv7
        } = dD6(),
        H$8 = O$8(),
        j$8 = Au6(),
        Vv7 = pW(),
        kv7 = bL()
})
// @from(Ln 145473, Col 4)
_u6 = x((Ce_, yv7) => {
    var dg3 = bL(),
        cg3 = (A, q, K) => {
            try {
                q = new dg3(q, K)
            } catch (Y) {
                return !1
            }
            return q.test(A)
        };
    yv7.exports = cg3
})
// @from(Ln 145485, Col 4)
Rv7 = x((Ie_, Lv7) => {
    var lg3 = bL(),
        ig3 = (A, q) => new lg3(A, q).set.map((K) => K.map((Y) => Y.value).join(" ").trim().split(" "));
    Lv7.exports = ig3
})
// @from(Ln 145490, Col 4)
Sv7 = x((be_, hv7) => {
    var ng3 = pW(),
        rg3 = bL(),
        og3 = (A, q, K) => {
            let Y = null,
                z = null,
                _ = null;
            try {
                _ = new rg3(q, K)
            } catch (w) {
                return null
            }
            return A.forEach((w) => {
                if (_.test(w)) {
                    if (!Y || z.compare(w) === -1) Y = w, z = new ng3(Y, K)
                }
            }), Y
        };
    hv7.exports = og3
})
// @from(Ln 145510, Col 4)
Iv7 = x((xe_, Cv7) => {
    var ag3 = pW(),
        sg3 = bL(),
        tg3 = (A, q, K) => {
            let Y = null,
                z = null,
                _ = null;
            try {
                _ = new sg3(q, K)
            } catch (w) {
                return null
            }
            return A.forEach((w) => {
                if (_.test(w)) {
                    if (!Y || z.compare(w) === 1) Y = w, z = new ag3(Y, K)
                }
            }), Y
        };
    Cv7.exports = tg3
})
// @from(Ln 145530, Col 4)
uv7 = x((ue_, xv7) => {
    var J$8 = pW(),
        eg3 = bL(),
        bv7 = qu6(),
        AF3 = (A, q) => {
            A = new eg3(A, q);
            let K = new J$8("0.0.0");
            if (A.test(K)) return K;
            if (K = new J$8("0.0.0-0"), A.test(K)) return K;
            K = null;
            for (let Y = 0; Y < A.set.length; ++Y) {
                let z = A.set[Y],
                    _ = null;
                if (z.forEach((w) => {
                        let O = new J$8(w.semver.version);
                        switch (w.operator) {
                            case ">":
                                if (O.prerelease.length === 0) O.patch++;
                                else O.prerelease.push(0);
                                O.raw = O.format();
                            case "":
                            case ">=":
                                if (!_ || bv7(O, _)) _ = O;
                                break;
                            case "<":
                            case "<=":
                                break;
                            default:
                                throw Error(`Unexpected operation: ${w.operator}`)
                        }
                    }), _ && (!K || bv7(K, _))) K = _
            }
            if (K && A.test(K)) return K;
            return null
        };
    xv7.exports = AF3
})
// @from(Ln 145567, Col 4)
Bv7 = x((me_, mv7) => {
    var qF3 = bL(),
        KF3 = (A, q) => {
            try {
                return new qF3(A, q).range || "*"
            } catch (K) {
                return null
            }
        };
    mv7.exports = KF3
})
// @from(Ln 145578, Col 4)
Bw1 = x((Be_, Qv7) => {
    var YF3 = pW(),
        pv7 = Yu6(),
        {
            ANY: zF3
        } = pv7,
        _F3 = bL(),
        wF3 = _u6(),
        gv7 = qu6(),
        Fv7 = Cw1(),
        OF3 = bw1(),
        $F3 = Iw1(),
        HF3 = (A, q, K, Y) => {
            A = new YF3(A, Y), q = new _F3(q, Y);
            let z, _, w, O, $;
            switch (K) {
                case ">":
                    z = gv7, _ = OF3, w = Fv7, O = ">", $ = ">=";
                    break;
                case "<":
                    z = Fv7, _ = $F3, w = gv7, O = "<", $ = "<=";
                    break;
                default:
                    throw TypeError('Must provide a hilo val of "<" or ">"')
            }
            if (wF3(A, q, Y)) return !1;
            for (let H = 0; H < q.set.length; ++H) {
                let j = q.set[H],
                    J = null,
                    M = null;
                if (j.forEach((D) => {
                        if (D.semver === zF3) D = new pv7(">=0.0.0");
                        if (J = J || D, M = M || D, z(D.semver, J.semver, Y)) J = D;
                        else if (w(D.semver, M.semver, Y)) M = D
                    }), J.operator === O || J.operator === $) return !1;
                if ((!M.operator || M.operator === O) && _(A, M.semver)) return !1;
                else if (M.operator === $ && w(A, M.semver)) return !1
            }
            return !0
        };
    Qv7.exports = HF3
})
// @from(Ln 145620, Col 4)
dv7 = x((ge_, Uv7) => {
    var jF3 = Bw1(),
        JF3 = (A, q, K) => jF3(A, q, ">", K);
    Uv7.exports = JF3
})
// @from(Ln 145625, Col 4)
lv7 = x((Fe_, cv7) => {
    var MF3 = Bw1(),
        DF3 = (A, q, K) => MF3(A, q, "<", K);
    cv7.exports = DF3
})
// @from(Ln 145630, Col 4)
rv7 = x((pe_, nv7) => {
    var iv7 = bL(),
        XF3 = (A, q, K) => {
            return A = new iv7(A, K), q = new iv7(q, K), A.intersects(q, K)
        };
    nv7.exports = XF3
})
// @from(Ln 145637, Col 4)
av7 = x((Qe_, ov7) => {
    var PF3 = _u6(),
        WF3 = IL();
    ov7.exports = (A, q, K) => {
        let Y = [],
            z = null,
            _ = null,
            w = A.sort((j, J) => WF3(j, J, K));
        for (let j of w)
            if (PF3(j, q, K)) {
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
// @from(Ln 145664, Col 4)
KN7 = x((Ue_, qN7) => {
    var sv7 = bL(),
        D$8 = Yu6(),
        {
            ANY: M$8
        } = D$8,
        wu6 = _u6(),
        X$8 = IL(),
        ZF3 = (A, q, K = {}) => {
            if (A === q) return !0;
            A = new sv7(A, K), q = new sv7(q, K);
            let Y = !1;
            A: for (let z of A.set) {
                for (let _ of q.set) {
                    let w = fF3(z, _, K);
                    if (Y = Y || w !== null, w) continue A
                }
                if (Y) return !1
            }
            return !0
        },
        GF3 = [new D$8(">=0.0.0-0")],
        tv7 = [new D$8(">=0.0.0")],
        fF3 = (A, q, K) => {
            if (A === q) return !0;
            if (A.length === 1 && A[0].semver === M$8)
                if (q.length === 1 && q[0].semver === M$8) return !0;
                else if (K.includePrerelease) A = GF3;
            else A = tv7;
            if (q.length === 1 && q[0].semver === M$8)
                if (K.includePrerelease) return !0;
                else q = tv7;
            let Y = new Set,
                z, _;
            for (let D of A)
                if (D.operator === ">" || D.operator === ">=") z = ev7(z, D, K);
                else if (D.operator === "<" || D.operator === "<=") _ = AN7(_, D, K);
            else Y.add(D.semver);
            if (Y.size > 1) return null;
            let w;
            if (z && _) {
                if (w = X$8(z.semver, _.semver, K), w > 0) return null;
                else if (w === 0 && (z.operator !== ">=" || _.operator !== "<=")) return null
            }
            for (let D of Y) {
                if (z && !wu6(D, String(z), K)) return null;
                if (_ && !wu6(D, String(_), K)) return null;
                for (let X of q)
                    if (!wu6(D, String(X), K)) return !1;
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
                        if (O = ev7(z, D, K), O === D && O !== z) return !1
                    } else if (z.operator === ">=" && !wu6(z.semver, String(D), K)) return !1
                }
                if (_) {
                    if (J) {
                        if (D.semver.prerelease && D.semver.prerelease.length && D.semver.major === J.major && D.semver.minor === J.minor && D.semver.patch === J.patch) J = !1
                    }
                    if (D.operator === "<" || D.operator === "<=") {
                        if ($ = AN7(_, D, K), $ === D && $ !== _) return !1
                    } else if (_.operator === "<=" && !wu6(_.semver, String(D), K)) return !1
                }
                if (!D.operator && (_ || z) && w !== 0) return !1
            }
            if (z && H && !_ && w !== 0) return !1;
            if (_ && j && !z && w !== 0) return !1;
            if (M || J) return !1;
            return !0
        },
        ev7 = (A, q, K) => {
            if (!A) return q;
            let Y = X$8(A.semver, q.semver, K);
            return Y > 0 ? A : Y < 0 ? q : q.operator === ">" && A.operator === ">=" ? q : A
        },
        AN7 = (A, q, K) => {
            if (!A) return q;
            let Y = X$8(A.semver, q.semver, K);
            return Y < 0 ? A : Y > 0 ? q : q.operator === "<" && A.operator === "<=" ? q : A
        };
    qN7.exports = ZF3
})
// @from(Ln 145754, Col 4)
lD6 = x((de_, _N7) => {
    var P$8 = dD6(),
        YN7 = ex6(),
        TF3 = pW(),
        zN7 = z$8(),
        vF3 = YK6(),
        NF3 = hT7(),
        VF3 = CT7(),
        kF3 = xT7(),
        EF3 = BT7(),
        yF3 = FT7(),
        LF3 = QT7(),
        RF3 = dT7(),
        hF3 = lT7(),
        SF3 = IL(),
        CF3 = oT7(),
        IF3 = sT7(),
        bF3 = Sw1(),
        xF3 = qv7(),
        uF3 = Yv7(),
        mF3 = qu6(),
        BF3 = Cw1(),
        gF3 = _$8(),
        FF3 = w$8(),
        pF3 = Iw1(),
        QF3 = bw1(),
        UF3 = O$8(),
        dF3 = Mv7(),
        cF3 = Yu6(),
        lF3 = bL(),
        iF3 = _u6(),
        nF3 = Rv7(),
        rF3 = Sv7(),
        oF3 = Iv7(),
        aF3 = uv7(),
        sF3 = Bv7(),
        tF3 = Bw1(),
        eF3 = dv7(),
        Ap3 = lv7(),
        qp3 = rv7(),
        Kp3 = av7(),
        Yp3 = KN7();
    _N7.exports = {
        parse: vF3,
        valid: NF3,
        clean: VF3,
        inc: kF3,
        diff: EF3,
        major: yF3,
        minor: LF3,
        patch: RF3,
        prerelease: hF3,
        compare: SF3,
        rcompare: CF3,
        compareLoose: IF3,
        compareBuild: bF3,
        sort: xF3,
        rsort: uF3,
        gt: mF3,
        lt: BF3,
        eq: gF3,
        neq: FF3,
        gte: pF3,
        lte: QF3,
        cmp: UF3,
        coerce: dF3,
        Comparator: cF3,
        Range: lF3,
        satisfies: iF3,
        toComparators: nF3,
        maxSatisfying: rF3,
        minSatisfying: oF3,
        minVersion: aF3,
        validRange: sF3,
        outside: tF3,
        gtr: eF3,
        ltr: Ap3,
        intersects: qp3,
        simplifyRange: Kp3,
        subset: Yp3,
        SemVer: TF3,
        re: P$8.re,
        src: P$8.src,
        tokens: P$8.t,
        SEMVER_SPEC_VERSION: YN7.SEMVER_SPEC_VERSION,
        RELEASE_TYPES: YN7.RELEASE_TYPES,
        compareIdentifiers: zN7.compareIdentifiers,
        rcompareIdentifiers: zN7.rcompareIdentifiers
    }
})
// @from(Ln 145845, Col 0)
function gw1() {
    if (!W$8) W$8 = lD6();
    return W$8
}
// @from(Ln 145850, Col 0)
function UG(A, q) {
    if (typeof Bun < "u") return Bun.semver.order(A, q) === 1;
    return gw1().gt(A, q, {
        loose: !0
    })
}
// @from(Ln 145857, Col 0)
function BM(A, q) {
    if (typeof Bun < "u") return Bun.semver.order(A, q) >= 0;
    return gw1().gte(A, q, {
        loose: !0
    })
}
// @from(Ln 145864, Col 0)
function iD6(A, q) {
    if (typeof Bun < "u") return Bun.semver.order(A, q) === -1;
    return gw1().lt(A, q, {
        loose: !0
    })
}
// @from(Ln 145871, Col 0)
function Z$8(A, q) {
    if (typeof Bun < "u") return Bun.semver.satisfies(A, q);
    return gw1().satisfies(A, q, {
        loose: !0
    })
}
// @from(Ln 145877, Col 4)
W$8
// @from(Ln 145879, Col 0)
function zp3(A, q, K) {
    var Y = -1,
        z = A.length;
    if (q < 0) q = -q > z ? 0 : z + q;
    if (K = K > z ? z : K, K < 0) K += z;
    z = q > K ? 0 : K - q >>> 0, q >>>= 0;
    var _ = Array(z);
    while (++Y < z) _[Y] = A[Y + q];
    return _
}
// @from(Ln 145889, Col 4)
Fw1
// @from(Ln 145890, Col 4)
G$8 = E(() => {
    Fw1 = zp3
})
// @from(Ln 145894, Col 0)
function _p3(A, q, K) {
    var Y = A.length;
    return K = K === void 0 ? Y : K, !q && K >= Y ? A : Fw1(A, q, K)
}
// @from(Ln 145898, Col 4)
wN7
// @from(Ln 145899, Col 4)
ON7 = E(() => {
    G$8();
    wN7 = _p3
})
// @from(Ln 145904, Col 0)
function Xp3(A) {
    return Dp3.test(A)
}
// @from(Ln 145907, Col 4)
wp3 = "\\ud800-\\udfff"
// @from(Ln 145908, Col 4)
Op3 = "\\u0300-\\u036f"
// @from(Ln 145909, Col 4)
$p3 = "\\ufe20-\\ufe2f"
// @from(Ln 145910, Col 4)
Hp3 = "\\u20d0-\\u20ff"
// @from(Ln 145911, Col 4)
jp3
// @from(Ln 145911, Col 9)
Jp3 = "\\ufe0e\\ufe0f"
// @from(Ln 145912, Col 4)
Mp3 = "\\u200d"
// @from(Ln 145913, Col 4)
Dp3
// @from(Ln 145913, Col 9)
pw1
// @from(Ln 145914, Col 4)
f$8 = E(() => {
    jp3 = Op3 + $p3 + Hp3, Dp3 = RegExp("[" + Mp3 + wp3 + jp3 + Jp3 + "]");
    pw1 = Xp3
})
// @from(Ln 145919, Col 0)
function Pp3(A) {
    return A.split("")
}
// @from(Ln 145922, Col 4)
$N7
// @from(Ln 145923, Col 4)
HN7 = E(() => {
    $N7 = Pp3
})
// @from(Ln 145927, Col 0)
function Rp3(A) {
    return A.match(Lp3) || []
}
// @from(Ln 145930, Col 4)
jN7 = "\\ud800-\\udfff"
// @from(Ln 145931, Col 4)
Wp3 = "\\u0300-\\u036f"
// @from(Ln 145932, Col 4)
Zp3 = "\\ufe20-\\ufe2f"
// @from(Ln 145933, Col 4)
Gp3 = "\\u20d0-\\u20ff"
// @from(Ln 145934, Col 4)
fp3
// @from(Ln 145934, Col 9)
Tp3 = "\\ufe0e\\ufe0f"
// @from(Ln 145935, Col 4)
vp3
// @from(Ln 145935, Col 9)
T$8
// @from(Ln 145935, Col 14)
v$8 = "\\ud83c[\\udffb-\\udfff]"
// @from(Ln 145936, Col 4)
Np3
// @from(Ln 145936, Col 9)
JN7
// @from(Ln 145936, Col 14)
MN7 = "(?:\\ud83c[\\udde6-\\uddff]){2}"
// @from(Ln 145937, Col 4)
DN7 = "[\\ud800-\\udbff][\\udc00-\\udfff]"
// @from(Ln 145938, Col 4)
Vp3 = "\\u200d"
// @from(Ln 145939, Col 4)
XN7
// @from(Ln 145939, Col 9)
PN7
// @from(Ln 145939, Col 14)
kp3
// @from(Ln 145939, Col 19)
Ep3
// @from(Ln 145939, Col 24)
yp3
// @from(Ln 145939, Col 29)
Lp3
// @from(Ln 145939, Col 34)
WN7
// @from(Ln 145940, Col 4)
ZN7 = E(() => {
    fp3 = Wp3 + Zp3 + Gp3, vp3 = "[" + jN7 + "]", T$8 = "[" + fp3 + "]", Np3 = "(?:" + T$8 + "|" + v$8 + ")", JN7 = "[^" + jN7 + "]", XN7 = Np3 + "?", PN7 = "[" + Tp3 + "]?", kp3 = "(?:" + Vp3 + "(?:" + [JN7, MN7, DN7].join("|") + ")" + PN7 + XN7 + ")*", Ep3 = PN7 + XN7 + kp3, yp3 = "(?:" + [JN7 + T$8 + "?", T$8, MN7, DN7, vp3].join("|") + ")", Lp3 = RegExp(v$8 + "(?=" + v$8 + ")|" + yp3 + Ep3, "g");
    WN7 = Rp3
})
// @from(Ln 145945, Col 0)
function hp3(A) {
    return pw1(A) ? WN7(A) : $N7(A)
}
// @from(Ln 145948, Col 4)
GN7
// @from(Ln 145949, Col 4)
fN7 = E(() => {
    HN7();
    f$8();
    ZN7();
    GN7 = hp3
})
// @from(Ln 145956, Col 0)
function Sp3(A) {
    return function(q) {
        q = yw6(q);
        var K = pw1(q) ? GN7(q) : void 0,
            Y = K ? K[0] : q.charAt(0),
            z = K ? wN7(K, 1).join("") : q.slice(1);
        return Y[A]() + z
    }
}
// @from(Ln 145965, Col 4)
TN7
// @from(Ln 145966, Col 4)
vN7 = E(() => {
    ON7();
    f$8();
    fN7();
    jt6();
    TN7 = Sp3
})
// @from(Ln 145973, Col 4)
Cp3
// @from(Ln 145973, Col 9)
NN7
// @from(Ln 145974, Col 4)
VN7 = E(() => {
    vN7();
    Cp3 = TN7("toUpperCase"), NN7 = Cp3
})
// @from(Ln 145979, Col 0)
function Ip3(A) {
    return NN7(yw6(A).toLowerCase())
}
// @from(Ln 145982, Col 4)
EU
// @from(Ln 145983, Col 4)
Ou6 = E(() => {
    jt6();
    VN7();
    EU = Ip3
})
// @from(Ln 145991, Col 0)
function xp3(A) {
    let q = $u6.homedir(),
        K = [],
        Y = kN7[A.toLowerCase()];
    if (!Y) return K;
    let z = process.env.APPDATA || BP.join(q, "AppData", "Roaming"),
        _ = process.env.LOCALAPPDATA || BP.join(q, "AppData", "Local");
    switch ($u6.platform()) {
        case "darwin":
            if (K.push(BP.join(q, "Library", "Application Support", "JetBrains"), BP.join(q, "Library", "Application Support")), A.toLowerCase() === "androidstudio") K.push(BP.join(q, "Library", "Application Support", "Google"));
            break;
        case "win32":
            if (K.push(BP.join(z, "JetBrains"), BP.join(_, "JetBrains"), BP.join(z)), A.toLowerCase() === "androidstudio") K.push(BP.join(_, "Google"));
            break;
        case "linux":
            K.push(BP.join(q, ".config", "JetBrains"), BP.join(q, ".local", "share", "JetBrains"));
            for (let w of Y) K.push(BP.join(q, "." + w));
            if (A.toLowerCase() === "androidstudio") K.push(BP.join(q, ".config", "Google"));
            break;
        default:
            break
    }
    return K
}
// @from(Ln 146015, Col 0)
async function up3(A) {
    let q = [],
        K = $1(),
        Y = xp3(A),
        z = kN7[A.toLowerCase()];
    if (!z) return q;
    for (let _ of Y) try {
        let w = await K.readdir(_);
        for (let O of z) {
            let $ = new RegExp("^" + O + ".*$"),
                H = [];
            for (let j of w) {
                if (!$.test(j.name)) continue;
                try {
                    let J = BP.join(_, j.name);
                    if ((await K.stat(J)).isDirectory()) H.push(J)
                } catch {}
            }
            for (let j of H) {
                let J = $u6.platform() === "linux" ? j : BP.join(j, "plugins");
                try {
                    await K.stat(J), q.push(J)
                } catch {}
            }
        }
    } catch {
        continue
    }
    return q.filter((_, w) => q.indexOf(_) === w)
}
// @from(Ln 146045, Col 0)
async function mp3(A) {
    let q = await up3(A);
    for (let K of q) {
        let Y = BP.join(K, bp3);
        try {
            return await $1().stat(Y), !0
        } catch {}
    }
    return !1
}
// @from(Ln 146055, Col 0)
async function Bp3(A, q = !1) {
    if (!q) {
        let Y = N$8.get(A);
        if (Y) return Y
    }
    let K = mp3(A).then((Y) => {
        return V$8.set(A, Y), Y
    });
    return N$8.set(A, K), K
}
// @from(Ln 146065, Col 0)
async function EN7(A, q = !1) {
    if (q) V$8.delete(A), N$8.delete(A);
    return Bp3(A, q)
}
// @from(Ln 146070, Col 0)
function yN7(A) {
    return V$8.get(A) ?? !1
}
// @from(Ln 146073, Col 4)
bp3 = "claude-code-jetbrains-plugin"
// @from(Ln 146074, Col 4)
kN7
// @from(Ln 146074, Col 9)
V$8
// @from(Ln 146074, Col 14)
N$8
// @from(Ln 146075, Col 4)
k$8 = E(() => {
    SA();
    kN7 = {
        pycharm: ["PyCharm"],
        intellij: ["IntelliJIdea", "IdeaIC"],
        webstorm: ["WebStorm"],
        phpstorm: ["PhpStorm"],
        rubymine: ["RubyMine"],
        clion: ["CLion"],
        goland: ["GoLand"],
        rider: ["Rider"],
        datagrip: ["DataGrip"],
        appcode: ["AppCode"],
        dataspell: ["DataSpell"],
        aqua: ["Aqua"],
        gateway: ["Gateway"],
        fleet: ["Fleet"],
        androidstudio: ["AndroidStudio"]
    };
    V$8 = new Map, N$8 = new Map
})
// @from(Ln 146099, Col 0)
class nD6 {
    wslDistroName;
    constructor(A) {
        this.wslDistroName = A
    }
    toLocalPath(A) {
        if (!A) return A;
        if (this.wslDistroName) {
            let q = A.match(/^\\\\wsl(?:\.localhost|\$)\\([^\\]+)(.*)$/);
            if (q && q[1] !== this.wslDistroName) return A
        }
        try {
            return LN7("wslpath", ["-u", A], {
                encoding: "utf8",
                stdio: ["pipe", "pipe", "ignore"]
            }).trim()
        } catch {
            return A.replace(/\\/g, "/").replace(/^([A-Z]):/i, (q, K) => `/mnt/${K.toLowerCase()}`)
        }
    }
    toIDEPath(A) {
        if (!A) return A;
        try {
            return LN7("wslpath", ["-w", A], {
                encoding: "utf8",
                stdio: ["pipe", "pipe", "ignore"]
            }).trim()
        } catch {
            return A
        }
    }
}
// @from(Ln 146132, Col 0)
function RN7(A, q) {
    let K = A.match(/^\\\\wsl(?:\.localhost|\$)\\([^\\]+)(.*)$/);
    if (K) return K[1] === q;
    return !0
}
// @from(Ln 146137, Col 4)
E$8 = () => {}
// @from(Ln 146142, Col 0)
function sK(A = Fp3) {
    let q = new AbortController;
    return gp3(A, q.signal), q
}
// @from(Ln 146147, Col 0)
function pp3(A) {
    let q = this.deref();
    A.deref()?.abort(q?.signal.reason)
}
// @from(Ln 146152, Col 0)
function Qp3(A) {
    let q = this.deref(),
        K = A.deref();
    if (q && K) q.signal.removeEventListener("abort", K)
}
// @from(Ln 146158, Col 0)
function Wm(A, q) {
    let K = sK(q);
    if (A.signal.aborted) return K.abort(A.signal.reason), K;
    let Y = new WeakRef(K),
        z = new WeakRef(A),
        _ = pp3.bind(z, Y);
    return A.signal.addEventListener("abort", _, {
        once: !0
    }), K.signal.addEventListener("abort", Qp3.bind(z, new WeakRef(_)), {
        once: !0
    }), K
}
// @from(Ln 146170, Col 4)
Fp3 = 50
// @from(Ln 146171, Col 4)
U$ = () => {}
// @from(Ln 146172, Col 4)
hN7
// @from(Ln 146172, Col 9)
Up3
// @from(Ln 146172, Col 14)
A6 = function(A) {
    return Up3.H.useMemoCache(A)
}
// @from(Ln 146175, Col 4)
e6 = E(() => {
    hN7 = t(P6(), 1), Up3 = hN7.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
})
// @from(Ln 146178, Col 4)
dp3 = function() {
        return NH.Date.now()
    }
// @from(Ln 146181, Col 4)
Qw1
// @from(Ln 146182, Col 4)
SN7 = E(() => {
    oE();
    Qw1 = dp3
})
// @from(Ln 146187, Col 0)
function lp3(A) {
    var q = A.length;
    while (q-- && cp3.test(A.charAt(q)));
    return q
}
// @from(Ln 146192, Col 4)
cp3
// @from(Ln 146192, Col 9)
CN7
// @from(Ln 146193, Col 4)
IN7 = E(() => {
    cp3 = /\s/;
    CN7 = lp3
})
// @from(Ln 146198, Col 0)
function np3(A) {
    return A ? A.slice(0, CN7(A) + 1).replace(ip3, "") : A
}
// @from(Ln 146201, Col 4)
ip3
// @from(Ln 146201, Col 9)
bN7
// @from(Ln 146202, Col 4)
xN7 = E(() => {
    IN7();
    ip3 = /^\s+/;
    bN7 = np3
})
// @from(Ln 146208, Col 0)
function tp3(A) {
    if (typeof A == "number") return A;
    if (vn(A)) return uN7;
    if (A_(A)) {
        var q = typeof A.valueOf == "function" ? A.valueOf() : A;
        A = A_(q) ? q + "" : q
    }
    if (typeof A != "string") return A === 0 ? A : +A;
    A = bN7(A);
    var K = op3.test(A);
    return K || ap3.test(A) ? sp3(A.slice(2), K ? 2 : 8) : rp3.test(A) ? uN7 : +A
}
// @from(Ln 146220, Col 4)
uN7 = NaN
// @from(Ln 146221, Col 4)
rp3
// @from(Ln 146221, Col 9)
op3
// @from(Ln 146221, Col 14)
ap3
// @from(Ln 146221, Col 19)
sp3
// @from(Ln 146221, Col 24)
y$8
// @from(Ln 146222, Col 4)
mN7 = E(() => {
    xN7();
    AG();
    Sk6();
    rp3 = /^[-+]0x[0-9a-f]+$/i, op3 = /^0b[01]+$/i, ap3 = /^0o[0-7]+$/i, sp3 = parseInt;
    y$8 = tp3
})
// @from(Ln 146230, Col 0)
function KQ3(A, q, K) {
    var Y, z, _, w, O, $, H = 0,
        j = !1,
        J = !1,
        M = !0;
    if (typeof A != "function") throw TypeError(ep3);
    if (q = y$8(q) || 0, A_(K)) j = !!K.leading, J = "maxWait" in K, _ = J ? AQ3(y$8(K.maxWait) || 0, q) : _, M = "trailing" in K ? !!K.trailing : M;

    function D(V) {
        var L = Y,
            h = z;
        return Y = z = void 0, H = V, w = A.apply(h, L), w
    }

    function X(V) {
        return H = V, O = setTimeout(Z, q), j ? D(V) : w
    }

    function P(V) {
        var L = V - $,
            h = V - H,
            R = q - L;
        return J ? qQ3(R, _ - h) : R
    }

    function W(V) {
        var L = V - $,
            h = V - H;
        return $ === void 0 || L >= q || L < 0 || J && h >= _
    }

    function Z() {
        var V = Qw1();
        if (W(V)) return G(V);
        O = setTimeout(Z, P(V))
    }

    function G(V) {
        if (O = void 0, M && Y) return D(V);
        return Y = z = void 0, w
    }

    function f() {
        if (O !== void 0) clearTimeout(O);
        H = 0, Y = $ = z = O = void 0
    }

    function v() {
        return O === void 0 ? w : G(Qw1())
    }

    function N() {
        var V = Qw1(),
            L = W(V);
        if (Y = arguments, z = this, $ = V, L) {
            if (O === void 0) return X($);
            if (J) return clearTimeout(O), O = setTimeout(Z, q), D($)
        }
        if (O === void 0) O = setTimeout(Z, q);
        return w
    }
    return N.cancel = f, N.flush = v, N
}
// @from(Ln 146293, Col 4)
ep3 = "Expected a function"
// @from(Ln 146294, Col 4)
AQ3
// @from(Ln 146294, Col 9)
qQ3
// @from(Ln 146294, Col 14)
BN7
// @from(Ln 146295, Col 4)
gN7 = E(() => {
    AG();
    SN7();
    mN7();
    AQ3 = Math.max, qQ3 = Math.min;
    BN7 = KQ3
})
// @from(Ln 146303, Col 0)
function zQ3(A, q, K) {
    var Y = !0,
        z = !0;
    if (typeof A != "function") throw TypeError(YQ3);
    if (A_(K)) Y = "leading" in K ? !!K.leading : Y, z = "trailing" in K ? !!K.trailing : z;
    return BN7(A, q, {
        leading: Y,
        maxWait: q,
        trailing: z
    })
}
// @from(Ln 146314, Col 4)
YQ3 = "Expected a function"
// @from(Ln 146315, Col 4)
FN7
// @from(Ln 146316, Col 4)
pN7 = E(() => {
    gN7();
    AG();
    FN7 = zQ3
})
// @from(Ln 146322, Col 0)
function L$8(A, {
    include: q,
    exclude: K
} = {}) {
    let Y = (z) => {
        let _ = (w) => typeof w === "string" ? z === w : w.test(z);
        if (q) return q.some(_);
        if (K) return !K.some(_);
        return !0
    };
    for (let [z, _] of _Q3(A.constructor.prototype)) {
        if (_ === "constructor" || !Y(_)) continue;
        let w = Reflect.getOwnPropertyDescriptor(z, _);
        if (w && typeof w.value === "function") A[_] = A[_].bind(A)
    }
    return A
}
// @from(Ln 146339, Col 4)
_Q3 = (A) => {
    let q = new Set;
    do
        for (let K of Reflect.ownKeys(A)) q.add([A, K]); while ((A = Reflect.getPrototypeOf(A)) && A !== Object.prototype);
    return q
}
// @from(Ln 146348, Col 4)
UN7
// @from(Ln 146348, Col 9)
R$8
// @from(Ln 146348, Col 14)
wQ3 = (A) => {
        let q = new QN7,
            K = new QN7;
        q.write = (z) => {
            A("stdout", z)
        }, K.write = (z) => {
            A("stderr", z)
        };
        let Y = new console.Console(q, K);
        for (let z of UN7) R$8[z] = console[z], console[z] = Y[z];
        return () => {
            for (let z of UN7) console[z] = R$8[z];
            R$8 = {}
        }
    }
// @from(Ln 146363, Col 4)
dN7
// @from(Ln 146364, Col 4)
cN7 = E(() => {
    UN7 = ["assert", "count", "countReset", "debug", "dir", "dirxml", "error", "group", "groupCollapsed", "groupEnd", "info", "log", "table", "time", "timeEnd", "timeLog", "trace", "warn"], R$8 = {}, dN7 = wQ3
})
// @from(Ln 146368, Col 0)
function C$8(A, q) {
    var K = A.length;
    A.push(q);
    A: for (; 0 < K;) {
        var Y = K - 1 >>> 1,
            z = A[Y];
        if (0 < Uw1(z, q)) A[Y] = q, A[K] = z, K = Y;
        else break A
    }
}
// @from(Ln 146379, Col 0)
function Zm(A) {
    return A.length === 0 ? null : A[0]
}
// @from(Ln 146383, Col 0)
function iw1(A) {
    if (A.length === 0) return null;
    var q = A[0],
        K = A.pop();
    if (K !== q) {
        A[0] = K;
        A: for (var Y = 0, z = A.length, _ = z >>> 1; Y < _;) {
            var w = 2 * (Y + 1) - 1,
                O = A[w],
                $ = w + 1,
                H = A[$];
            if (0 > Uw1(O, K)) $ < z && 0 > Uw1(H, O) ? (A[Y] = H, A[$] = K, Y = $) : (A[Y] = O, A[w] = K, Y = w);
            else if ($ < z && 0 > Uw1(H, K)) A[Y] = H, A[$] = K, Y = $;
            else break A
        }
    }
    return q
}
// @from(Ln 146402, Col 0)
function Uw1(A, q) {
    var K = A.sortIndex - q.sortIndex;
    return K !== 0 ? K : A.id - q.id
}
// @from(Ln 146407, Col 0)
function cw1(A) {
    for (var q = Zm(ta); q !== null;) {
        if (q.callback === null) iw1(ta);
        else if (q.startTime <= A) iw1(ta), q.sortIndex = q.expirationTime, C$8(yU, q);
        else break;
        q = Zm(ta)
    }
}
// @from(Ln 146416, Col 0)
function B$8(A) {
    if (ju6 = !1, cw1(A), !Hu6)
        if (Zm(yU) !== null) Hu6 = !0, oD6 || (oD6 = !0, rD6());
        else {
            var q = Zm(ta);
            q !== null && g$8(B$8, q.startTime - A)
        }
}
// @from(Ln 146425, Col 0)
function oN7() {
    return m$8 ? !0 : Gm() - rN7 < $Q3 ? !1 : !0
}
// @from(Ln 146429, Col 0)
function S$8() {
    if (m$8 = !1, oD6) {
        var A = Gm();
        rN7 = A;
        var q = !0;
        try {
            A: {
                Hu6 = !1,
                ju6 && (ju6 = !1, nN7(Ju6), Ju6 = -1),
                x$8 = !0;
                var K = h$8;
                try {
                    q: {
                        cw1(A);
                        for (xL = Zm(yU); xL !== null && !(xL.expirationTime > A && oN7());) {
                            var Y = xL.callback;
                            if (typeof Y === "function") {
                                xL.callback = null, h$8 = xL.priorityLevel;
                                var z = Y(xL.expirationTime <= A);
                                if (A = Gm(), typeof z === "function") {
                                    xL.callback = z, cw1(A), q = !0;
                                    break q
                                }
                                xL === Zm(yU) && iw1(yU), cw1(A)
                            } else iw1(yU);
                            xL = Zm(yU)
                        }
                        if (xL !== null) q = !0;
                        else {
                            var _ = Zm(ta);
                            _ !== null && g$8(B$8, _.startTime - A), q = !1
                        }
                    }
                    break A
                }
                finally {
                    xL = null, h$8 = K, x$8 = !1
                }
                q = void 0
            }
        }
        finally {
            q ? rD6() : oD6 = !1
        }
    }
}
// @from(Ln 146476, Col 0)
function g$8(A, q) {
    Ju6 = iN7(function() {
        A(Gm())
    }, q)
}
// @from(Ln 146481, Col 4)
Gm = void 0
// @from(Ln 146482, Col 4)
I$8
// @from(Ln 146482, Col 9)
dw1
// @from(Ln 146482, Col 14)
b$8
// @from(Ln 146482, Col 19)
yU
// @from(Ln 146482, Col 23)
ta
// @from(Ln 146482, Col 27)
OQ3 = 1
// @from(Ln 146483, Col 4)
xL = null
// @from(Ln 146484, Col 4)
h$8 = 3
// @from(Ln 146485, Col 4)
x$8 = !1
// @from(Ln 146486, Col 4)
Hu6 = !1
// @from(Ln 146487, Col 4)
ju6 = !1
// @from(Ln 146488, Col 4)
m$8 = !1
// @from(Ln 146489, Col 4)
iN7
// @from(Ln 146489, Col 9)
nN7
// @from(Ln 146489, Col 14)
lN7
// @from(Ln 146489, Col 19)
oD6 = !1
// @from(Ln 146490, Col 4)
Ju6 = -1
// @from(Ln 146491, Col 4)
$Q3 = 5
// @from(Ln 146492, Col 4)
rN7 = -1
// @from(Ln 146493, Col 4)
rD6
// @from(Ln 146493, Col 9)
lw1
// @from(Ln 146493, Col 14)
u$8
// @from(Ln 146493, Col 19)
F$8 = 5
// @from(Ln 146494, Col 4)
p$8 = 1
// @from(Ln 146495, Col 4)
nw1 = 3
// @from(Ln 146496, Col 4)
Q$8 = 2
// @from(Ln 146497, Col 4)
U$8 = function(A) {
        A.callback = null
    }
// @from(Ln 146500, Col 4)
d$8 = function() {
        m$8 = !0
    }
// @from(Ln 146503, Col 4)
rw1 = function(A, q, K) {
        var Y = Gm();
        switch (typeof K === "object" && K !== null ? (K = K.delay, K = typeof K === "number" && 0 < K ? Y + K : Y) : K = Y, A) {
            case 1:
                var z = -1;
                break;
            case 2:
                z = 250;
                break;
            case 5:
                z = 1073741823;
                break;
            case 4:
                z = 1e4;
                break;
            default:
                z = 5000
        }
        return z = K + z, A = {
            id: OQ3++,
            callback: q,
            priorityLevel: A,
            startTime: K,
            expirationTime: z,
            sortIndex: -1
        }, K > Y ? (A.sortIndex = K, C$8(ta, A), Zm(yU) === null && A === Zm(ta) && (ju6 ? (nN7(Ju6), Ju6 = -1) : ju6 = !0, g$8(B$8, K - Y))) : (A.sortIndex = z, C$8(yU, A), Hu6 || x$8 || (Hu6 = !0, oD6 || (oD6 = !0, rD6()))), A
    }
// @from(Ln 146530, Col 4)
c$8
// @from(Ln 146531, Col 4)
sN7 = E(() => {
    if (typeof performance === "object" && typeof performance.now === "function") I$8 = performance, Gm = function() {
        return I$8.now()
    };
    else dw1 = Date, b$8 = dw1.now(), Gm = function() {
        return dw1.now() - b$8
    };
    yU = [], ta = [], iN7 = typeof setTimeout === "function" ? setTimeout : null, nN7 = typeof clearTimeout === "function" ? clearTimeout : null, lN7 = typeof setImmediate < "u" ? setImmediate : null;
    if (typeof lN7 === "function") rD6 = function() {
        lN7(S$8)
    };
    else if (typeof MessageChannel < "u") lw1 = new MessageChannel, u$8 = lw1.port2, lw1.port1.onmessage = S$8, rD6 = function() {
        u$8.postMessage(null)
    };
    else rD6 = function() {
        iN7(S$8, 0)
    };
    c$8 = oN7
})