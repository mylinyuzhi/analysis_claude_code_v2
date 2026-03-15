
// @from(Ln 462328, Col 4)
oo8 = E(() => {
    XS();
    T1();
    k8();
    k8();
    qV6();
    s8();
    c_();
    KY();
    U4();
    T1();
    v01();
    dV();
    cVq();
    Mu();
    lx();
    $G6();
    AN();
    qV6();
    T1();
    up6();
    W0();
    Ib();
    RY();
    H1();
    u_();
    Zr();
    yG();
    rVq = e1(async () => {
        let A = Date.now();
        U1("info", "init_started"), Zq("init_function_start");
        try {
            let q = Date.now();
            vo6(), U1("info", "init_configs_enabled", {
                duration_ms: Date.now() - q
            }), Zq("init_configs_enabled");
            let K = Date.now();
            if (UVq(), dVq(), U1("info", "init_safe_env_vars_applied", {
                    duration_ms: Date.now() - K
                }), Zq("init_safe_env_vars_applied"), dN4(), Zq("init_after_graceful_shutdown"), Promise.all([Promise.resolve().then(() => (n96(), KNq)), Promise.resolve().then(() => (HA(), HNq))]).then(([_, w]) => {
                    _.initialize1PEventLogging(), w.onGrowthBookRefresh(() => {
                        _.reinitialize1PEventLoggingIfConfigChanged()
                    })
                }), Zq("init_after_1p_event_logging"), my8(), Zq("init_after_oauth_populate"), on1(), Zq("init_after_jetbrains_detection"), cQ(), kR8()) HV4();
            if (Kb()) SR8();
            Zq("init_after_remote_settings_check"), Go8();
            let Y = Date.now();
            k("[init] configureGlobalMTLS starting"), bmA(), U1("info", "init_mtls_configured", {
                duration_ms: Date.now() - Y
            }), k("[init] configureGlobalMTLS complete");
            let z = Date.now();
            if (k("[init] configureGlobalAgents starting"), BK1(), U1("info", "init_proxy_configured", {
                    duration_ms: Date.now() - z
                }), k("[init] configureGlobalAgents complete"), Zq("init_network_configured"), kjA(), E4(Ma4), E4(async () => {
                    let {
                        cleanupSessionTeams: _
                    } = await Promise.resolve().then(() => (vf(), qZ4));
                    await _()
                }), LN6()) {
                let _ = Date.now();
                await MNq(), U1("info", "init_scratchpad_created", {
                    duration_ms: Date.now() - _
                })
            }
            U1("info", "init_completed", {
                duration_ms: Date.now() - A
            }), Zq("init_function_end")
        } catch (q) {
            if (q instanceof MG) {
                if (q7()) {
                    process.stderr.write(`Configuration error in ${q.filePath}: ${q.message}
`), fK(1);
                    return
                }
                return Promise.resolve().then(() => (iVq(), lVq)).then((K) => K.showInvalidConfigDialog({
                    error: q
                }))
            } else throw q
        }
    })
})
// @from(Ln 462410, Col 0)
async function L$z() {
    if (so8 || to8) return;
    if (so8 = !0, !oVq) oVq = !0, V94(() => {
        Cr6(), KV6.forEach((q) => q())
    });
    let A = await h$z();
    if (A.length === 0) return;
    k(`Watching for changes in skill/command directories: ${A.join(", ")}...`), xF = g46.watch(A, {
        persistent: !0,
        ignoreInitial: !0,
        depth: 2,
        awaitWriteFinish: {
            stabilityThreshold: Bo6?.stabilityThreshold ?? N$z,
            pollInterval: Bo6?.pollInterval ?? V$z
        },
        ignored: (q, K) => {
            if (K && !K.isFile() && !K.isDirectory()) return !0;
            return q.split(s_6.sep).some((Y) => Y === ".git")
        },
        ignorePermissionErrors: !0,
        usePolling: y$z,
        interval: Bo6?.chokidarInterval ?? E$z,
        atomic: !0
    }), xF.on("add", ao8), xF.on("change", ao8), xF.on("unlink", ao8), GC1 = E4(async () => {
        await aVq()
    })
}
// @from(Ln 462438, Col 0)
function aVq() {
    if (to8 = !0, GC1) GC1(), GC1 = null;
    let A = Promise.resolve();
    if (xF) A = xF.close(), xF = null;
    if (uF) clearTimeout(uF), uF = null;
    return mo6.clear(), KV6.clear(), A
}
// @from(Ln 462446, Col 0)
function R$z(A) {
    return KV6.add(A), () => {
        KV6.delete(A)
    }
}
// @from(Ln 462451, Col 0)
async function h$z() {
    let A = $1(),
        q = [],
        K = Bt("userSettings", "skills");
    if (K) try {
        await A.stat(K), q.push(K)
    } catch {}
    let Y = Bt("userSettings", "commands");
    if (Y) try {
        await A.stat(Y), q.push(Y)
    } catch {}
    let z = Bt("projectSettings", "skills");
    if (z) try {
        let w = s_6.resolve(z);
        await A.stat(w), q.push(w)
    } catch {}
    let _ = Bt("projectSettings", "commands");
    if (_) try {
        let w = s_6.resolve(_);
        await A.stat(w), q.push(w)
    } catch {}
    for (let w of XT()) {
        let O = s_6.join(w, ".claude", "skills");
        try {
            await A.stat(O), q.push(O)
        } catch {}
    }
    return q
}
// @from(Ln 462481, Col 0)
function ao8(A) {
    k(`Detected skill change: ${A}`), d("tengu_skill_file_changed", {
        source: "chokidar"
    }), S$z(A)
}
// @from(Ln 462487, Col 0)
function S$z(A) {
    if (mo6.add(A), uF) clearTimeout(uF);
    uF = setTimeout(async () => {
        uF = null;
        let q = [...mo6];
        mo6.clear();
        let K = await UN6("skills", q[0]);
        if (QN6(K)) {
            k(`ConfigChange hook blocked skill reload (${q.length} paths)`);
            return
        }
        CP1(), oB(), Oc(), KV6.forEach((Y) => Y())
    }, Bo6?.reloadDebounce ?? k$z)
}
// @from(Ln 462501, Col 0)
async function C$z(A) {
    if (xF) await xF.close(), xF = null;
    if (uF) clearTimeout(uF), uF = null;
    mo6.clear(), KV6.clear(), so8 = !1, to8 = !1, Bo6 = A ?? null
}
// @from(Ln 462506, Col 4)
N$z = 1000
// @from(Ln 462507, Col 4)
V$z = 500
// @from(Ln 462508, Col 4)
k$z = 300
// @from(Ln 462509, Col 4)
E$z = 2000
// @from(Ln 462510, Col 4)
y$z
// @from(Ln 462510, Col 9)
xF = null
// @from(Ln 462511, Col 4)
uF = null
// @from(Ln 462512, Col 4)
mo6
// @from(Ln 462512, Col 9)
so8 = !1
// @from(Ln 462513, Col 4)
to8 = !1
// @from(Ln 462514, Col 4)
oVq = !1
// @from(Ln 462515, Col 4)
GC1 = null
// @from(Ln 462516, Col 4)
KV6
// @from(Ln 462516, Col 9)
Bo6 = null
// @from(Ln 462517, Col 4)
YV6
// @from(Ln 462518, Col 4)
fC1 = E(() => {
    F46();
    H1();
    KY();
    od();
    D$();
    M0();
    SA();
    T1();
    V1();
    hw();
    y$z = typeof Bun < "u", mo6 = new Set, KV6 = new Set;
    YV6 = {
        initialize: L$z,
        dispose: aVq,
        subscribe: R$z,
        resetForTesting: C$z
    }
})
// @from(Ln 462542, Col 0)
function b$z() {
    let A = process.argv[1] || "",
        q = process.execPath || process.argv[0] || "";
    if (y8() === "windows") A = A.split(tVq.sep).join(sVq.sep), q = q.split(tVq.sep).join(sVq.sep);
    let K = [A, q],
        Y = ["/build-ant/", "/build-external/", "/build-external-native/", "/build-ant-native/"];
    return K.some((z) => Y.some((_) => z.includes(_)))
}
// @from(Ln 462551, Col 0)
function u$z(A) {
    let q = `${A.name}: ${A.message}`;
    return x$z.some((K) => K.test(q))
}
// @from(Ln 462556, Col 0)
function eVq() {
    let A = process.listeners("warning");
    if (vC1 && A.includes(vC1)) return;
    if (!b$z()) process.removeAllListeners("warning");
    vC1 = (K) => {
        try {
            let Y = `${K.name}: ${K.message.slice(0,50)}`,
                z = TC1.get(Y) || 0;
            if (TC1.has(Y) || TC1.size < I$z) TC1.set(Y, z + 1);
            let _ = u$z(K);
            if (d("tengu_node_warning", {
                    is_internal: _ ? 1 : 0,
                    occurrence_count: z + 1,
                    classname: K.name,
                    ...!1
                }), t6(process.env.CLAUDE_DEBUG)) k(`${_?"[Internal Warning]":"[Warning]"} ${K.toString()}`, {
                level: "warn"
            })
        } catch {}
    }, process.on("warning", vC1)
}
// @from(Ln 462577, Col 4)
I$z = 1000
// @from(Ln 462578, Col 4)
TC1
// @from(Ln 462578, Col 9)
x$z
// @from(Ln 462578, Col 14)
vC1 = null
// @from(Ln 462579, Col 4)
Akq = E(() => {
    V1();
    H1();
    A8();
    YK();
    TC1 = new Map;
    x$z = [/MaxListenersExceededWarning.*AbortSignal/, /MaxListenersExceededWarning.*EventTarget/]
})
// @from(Ln 462587, Col 4)
go6 = x((m$z) => {
    class eo8 extends Error {
        constructor(A, q, K) {
            super(K);
            Error.captureStackTrace(this, this.constructor), this.name = this.constructor.name, this.code = q, this.exitCode = A, this.nestedError = void 0
        }
    }
    class qkq extends eo8 {
        constructor(A) {
            super(1, "commander.invalidArgument", A);
            Error.captureStackTrace(this, this.constructor), this.name = this.constructor.name
        }
    }
    m$z.CommanderError = eo8;
    m$z.InvalidArgumentError = qkq
})
// @from(Ln 462603, Col 4)
NC1 = x((Q$z) => {
    var {
        InvalidArgumentError: F$z
    } = go6();
    class Kkq {
        constructor(A, q) {
            switch (this.description = q || "", this.variadic = !1, this.parseArg = void 0, this.defaultValue = void 0, this.defaultValueDescription = void 0, this.argChoices = void 0, A[0]) {
                case "<":
                    this.required = !0, this._name = A.slice(1, -1);
                    break;
                case "[":
                    this.required = !1, this._name = A.slice(1, -1);
                    break;
                default:
                    this.required = !0, this._name = A;
                    break
            }
            if (this._name.length > 3 && this._name.slice(-3) === "...") this.variadic = !0, this._name = this._name.slice(0, -3)
        }
        name() {
            return this._name
        }
        _concatValue(A, q) {
            if (q === this.defaultValue || !Array.isArray(q)) return [A];
            return q.concat(A)
        }
        default (A, q) {
            return this.defaultValue = A, this.defaultValueDescription = q, this
        }
        argParser(A) {
            return this.parseArg = A, this
        }
        choices(A) {
            return this.argChoices = A.slice(), this.parseArg = (q, K) => {
                if (!this.argChoices.includes(q)) throw new F$z(`Allowed choices are ${this.argChoices.join(", ")}.`);
                if (this.variadic) return this._concatValue(q, K);
                return q
            }, this
        }
        argRequired() {
            return this.required = !0, this
        }
        argOptional() {
            return this.required = !1, this
        }
    }

    function p$z(A) {
        let q = A.name() + (A.variadic === !0 ? "..." : "");
        return A.required ? "<" + q + ">" : "[" + q + "]"
    }
    Q$z.Argument = Kkq;
    Q$z.humanReadableArgName = p$z
})
// @from(Ln 462657, Col 4)
Aa8 = x((l$z) => {
    var {
        humanReadableArgName: c$z
    } = NC1();
    class Ykq {
        constructor() {
            this.helpWidth = void 0, this.sortSubcommands = !1, this.sortOptions = !1, this.showGlobalOptions = !1
        }
        visibleCommands(A) {
            let q = A.commands.filter((Y) => !Y._hidden),
                K = A._getHelpCommand();
            if (K && !K._hidden) q.push(K);
            if (this.sortSubcommands) q.sort((Y, z) => {
                return Y.name().localeCompare(z.name())
            });
            return q
        }
        compareOptions(A, q) {
            let K = (Y) => {
                return Y.short ? Y.short.replace(/^-/, "") : Y.long.replace(/^--/, "")
            };
            return K(A).localeCompare(K(q))
        }
        visibleOptions(A) {
            let q = A.options.filter((Y) => !Y.hidden),
                K = A._getHelpOption();
            if (K && !K.hidden) {
                let Y = K.short && A._findOption(K.short),
                    z = K.long && A._findOption(K.long);
                if (!Y && !z) q.push(K);
                else if (K.long && !z) q.push(A.createOption(K.long, K.description));
                else if (K.short && !Y) q.push(A.createOption(K.short, K.description))
            }
            if (this.sortOptions) q.sort(this.compareOptions);
            return q
        }
        visibleGlobalOptions(A) {
            if (!this.showGlobalOptions) return [];
            let q = [];
            for (let K = A.parent; K; K = K.parent) {
                let Y = K.options.filter((z) => !z.hidden);
                q.push(...Y)
            }
            if (this.sortOptions) q.sort(this.compareOptions);
            return q
        }
        visibleArguments(A) {
            if (A._argsDescription) A.registeredArguments.forEach((q) => {
                q.description = q.description || A._argsDescription[q.name()] || ""
            });
            if (A.registeredArguments.find((q) => q.description)) return A.registeredArguments;
            return []
        }
        subcommandTerm(A) {
            let q = A.registeredArguments.map((K) => c$z(K)).join(" ");
            return A._name + (A._aliases[0] ? "|" + A._aliases[0] : "") + (A.options.length ? " [options]" : "") + (q ? " " + q : "")
        }
        optionTerm(A) {
            return A.flags
        }
        argumentTerm(A) {
            return A.name()
        }
        longestSubcommandTermLength(A, q) {
            return q.visibleCommands(A).reduce((K, Y) => {
                return Math.max(K, q.subcommandTerm(Y).length)
            }, 0)
        }
        longestOptionTermLength(A, q) {
            return q.visibleOptions(A).reduce((K, Y) => {
                return Math.max(K, q.optionTerm(Y).length)
            }, 0)
        }
        longestGlobalOptionTermLength(A, q) {
            return q.visibleGlobalOptions(A).reduce((K, Y) => {
                return Math.max(K, q.optionTerm(Y).length)
            }, 0)
        }
        longestArgumentTermLength(A, q) {
            return q.visibleArguments(A).reduce((K, Y) => {
                return Math.max(K, q.argumentTerm(Y).length)
            }, 0)
        }
        commandUsage(A) {
            let q = A._name;
            if (A._aliases[0]) q = q + "|" + A._aliases[0];
            let K = "";
            for (let Y = A.parent; Y; Y = Y.parent) K = Y.name() + " " + K;
            return K + q + " " + A.usage()
        }
        commandDescription(A) {
            return A.description()
        }
        subcommandDescription(A) {
            return A.summary() || A.description()
        }
        optionDescription(A) {
            let q = [];
            if (A.argChoices) q.push(`choices: ${A.argChoices.map((K)=>JSON.stringify(K)).join(", ")}`);
            if (A.defaultValue !== void 0) {
                if (A.required || A.optional || A.isBoolean() && typeof A.defaultValue === "boolean") q.push(`default: ${A.defaultValueDescription||JSON.stringify(A.defaultValue)}`)
            }
            if (A.presetArg !== void 0 && A.optional) q.push(`preset: ${JSON.stringify(A.presetArg)}`);
            if (A.envVar !== void 0) q.push(`env: ${A.envVar}`);
            if (q.length > 0) return `${A.description} (${q.join(", ")})`;
            return A.description
        }
        argumentDescription(A) {
            let q = [];
            if (A.argChoices) q.push(`choices: ${A.argChoices.map((K)=>JSON.stringify(K)).join(", ")}`);
            if (A.defaultValue !== void 0) q.push(`default: ${A.defaultValueDescription||JSON.stringify(A.defaultValue)}`);
            if (q.length > 0) {
                let K = `(${q.join(", ")})`;
                if (A.description) return `${A.description} ${K}`;
                return K
            }
            return A.description
        }
        formatHelp(A, q) {
            let K = q.padWidth(A, q),
                Y = q.helpWidth || 80,
                z = 2,
                _ = 2;

            function w(D, X) {
                if (X) {
                    let P = `${D.padEnd(K+2)}${X}`;
                    return q.wrap(P, Y - 2, K + 2)
                }
                return D
            }

            function O(D) {
                return D.join(`
`).replace(/^/gm, " ".repeat(2))
            }
            let $ = [`Usage: ${q.commandUsage(A)}`, ""],
                H = q.commandDescription(A);
            if (H.length > 0) $ = $.concat([q.wrap(H, Y, 0), ""]);
            let j = q.visibleArguments(A).map((D) => {
                return w(q.argumentTerm(D), q.argumentDescription(D))
            });
            if (j.length > 0) $ = $.concat(["Arguments:", O(j), ""]);
            let J = q.visibleOptions(A).map((D) => {
                return w(q.optionTerm(D), q.optionDescription(D))
            });
            if (J.length > 0) $ = $.concat(["Options:", O(J), ""]);
            if (this.showGlobalOptions) {
                let D = q.visibleGlobalOptions(A).map((X) => {
                    return w(q.optionTerm(X), q.optionDescription(X))
                });
                if (D.length > 0) $ = $.concat(["Global Options:", O(D), ""])
            }
            let M = q.visibleCommands(A).map((D) => {
                return w(q.subcommandTerm(D), q.subcommandDescription(D))
            });
            if (M.length > 0) $ = $.concat(["Commands:", O(M), ""]);
            return $.join(`
`)
        }
        padWidth(A, q) {
            return Math.max(q.longestOptionTermLength(A, q), q.longestGlobalOptionTermLength(A, q), q.longestSubcommandTermLength(A, q), q.longestArgumentTermLength(A, q))
        }
        wrap(A, q, K, Y = 40) {
            let _ = new RegExp(`[\\n][${" \\f\\t\\v   -   　\uFEFF"}]+`);
            if (A.match(_)) return A;
            let w = q - K;
            if (w < Y) return A;
            let O = A.slice(0, K),
                $ = A.slice(K).replace(`\r
`, `
`),
                H = " ".repeat(K),
                J = `\\s${"​"}`,
                M = new RegExp(`
|.{1,${w-1}}([${J}]|$)|[^${J}]+?([${J}]|$)`, "g"),
                D = $.match(M) || [];
            return O + D.map((X, P) => {
                if (X === `
`) return "";
                return (P > 0 ? H : "") + X.trimEnd()
            }).join(`
`)
        }
    }
    l$z.Help = Ykq
})
// @from(Ln 462844, Col 4)
qa8 = x((a$z) => {
    var {
        InvalidArgumentError: n$z
    } = go6();
    class zkq {
        constructor(A, q) {
            this.flags = A, this.description = q || "", this.required = A.includes("<"), this.optional = A.includes("["), this.variadic = /\w\.\.\.[>\]]$/.test(A), this.mandatory = !1;
            let K = o$z(A);
            if (this.short = K.shortFlag, this.long = K.longFlag, this.negate = !1, this.long) this.negate = this.long.startsWith("--no-");
            this.defaultValue = void 0, this.defaultValueDescription = void 0, this.presetArg = void 0, this.envVar = void 0, this.parseArg = void 0, this.hidden = !1, this.argChoices = void 0, this.conflictsWith = [], this.implied = void 0
        }
        default (A, q) {
            return this.defaultValue = A, this.defaultValueDescription = q, this
        }
        preset(A) {
            return this.presetArg = A, this
        }
        conflicts(A) {
            return this.conflictsWith = this.conflictsWith.concat(A), this
        }
        implies(A) {
            let q = A;
            if (typeof A === "string") q = {
                [A]: !0
            };
            return this.implied = Object.assign(this.implied || {}, q), this
        }
        env(A) {
            return this.envVar = A, this
        }
        argParser(A) {
            return this.parseArg = A, this
        }
        makeOptionMandatory(A = !0) {
            return this.mandatory = !!A, this
        }
        hideHelp(A = !0) {
            return this.hidden = !!A, this
        }
        _concatValue(A, q) {
            if (q === this.defaultValue || !Array.isArray(q)) return [A];
            return q.concat(A)
        }
        choices(A) {
            return this.argChoices = A.slice(), this.parseArg = (q, K) => {
                if (!this.argChoices.includes(q)) throw new n$z(`Allowed choices are ${this.argChoices.join(", ")}.`);
                if (this.variadic) return this._concatValue(q, K);
                return q
            }, this
        }
        name() {
            if (this.long) return this.long.replace(/^--/, "");
            return this.short.replace(/^-/, "")
        }
        attributeName() {
            return r$z(this.name().replace(/^no-/, ""))
        }
        is(A) {
            return this.short === A || this.long === A
        }
        isBoolean() {
            return !this.required && !this.optional && !this.negate
        }
    }
    class _kq {
        constructor(A) {
            this.positiveOptions = new Map, this.negativeOptions = new Map, this.dualOptions = new Set, A.forEach((q) => {
                if (q.negate) this.negativeOptions.set(q.attributeName(), q);
                else this.positiveOptions.set(q.attributeName(), q)
            }), this.negativeOptions.forEach((q, K) => {
                if (this.positiveOptions.has(K)) this.dualOptions.add(K)
            })
        }
        valueFromOption(A, q) {
            let K = q.attributeName();
            if (!this.dualOptions.has(K)) return !0;
            let Y = this.negativeOptions.get(K).presetArg,
                z = Y !== void 0 ? Y : !1;
            return q.negate === (z === A)
        }
    }

    function r$z(A) {
        return A.split("-").reduce((q, K) => {
            return q + K[0].toUpperCase() + K.slice(1)
        })
    }

    function o$z(A) {
        let q, K, Y = A.split(/[ |,]+/);
        if (Y.length > 1 && !/^[[<]/.test(Y[1])) q = Y.shift();
        if (K = Y.shift(), !q && /^-[^-]$/.test(K)) q = K, K = void 0;
        return {
            shortFlag: q,
            longFlag: K
        }
    }
    a$z.Option = zkq;
    a$z.DualOptions = _kq
})
// @from(Ln 462944, Col 4)
wkq = x((qHz) => {
    function e$z(A, q) {
        if (Math.abs(A.length - q.length) > 3) return Math.max(A.length, q.length);
        let K = [];
        for (let Y = 0; Y <= A.length; Y++) K[Y] = [Y];
        for (let Y = 0; Y <= q.length; Y++) K[0][Y] = Y;
        for (let Y = 1; Y <= q.length; Y++)
            for (let z = 1; z <= A.length; z++) {
                let _ = 1;
                if (A[z - 1] === q[Y - 1]) _ = 0;
                else _ = 1;
                if (K[z][Y] = Math.min(K[z - 1][Y] + 1, K[z][Y - 1] + 1, K[z - 1][Y - 1] + _), z > 1 && Y > 1 && A[z - 1] === q[Y - 2] && A[z - 2] === q[Y - 1]) K[z][Y] = Math.min(K[z][Y], K[z - 2][Y - 2] + 1)
            }
        return K[A.length][q.length]
    }

    function AHz(A, q) {
        if (!q || q.length === 0) return "";
        q = Array.from(new Set(q));
        let K = A.startsWith("--");
        if (K) A = A.slice(2), q = q.map((w) => w.slice(2));
        let Y = [],
            z = 3,
            _ = 0.4;
        if (q.forEach((w) => {
                if (w.length <= 1) return;
                let O = e$z(A, w),
                    $ = Math.max(A.length, w.length);
                if (($ - O) / $ > _) {
                    if (O < z) z = O, Y = [w];
                    else if (O === z) Y.push(w)
                }
            }), Y.sort((w, O) => w.localeCompare(O)), K) Y = Y.map((w) => `--${w}`);
        if (Y.length > 1) return `
(Did you mean one of ${Y.join(", ")}?)`;
        if (Y.length === 1) return `
(Did you mean ${Y[0]}?)`;
        return ""
    }
    qHz.suggestSimilar = AHz
})
// @from(Ln 462985, Col 4)
jkq = x(($Hz) => {
    var YHz = x6("node:events").EventEmitter,
        Ka8 = x6("node:child_process"),
        Ci = x6("node:path"),
        Ya8 = x6("node:fs"),
        Jj = x6("node:process"),
        {
            Argument: zHz,
            humanReadableArgName: _Hz
        } = NC1(),
        {
            CommanderError: za8
        } = go6(),
        {
            Help: wHz
        } = Aa8(),
        {
            Option: Okq,
            DualOptions: OHz
        } = qa8(),
        {
            suggestSimilar: $kq
        } = wkq();
    class _a8 extends YHz {
        constructor(A) {
            super();
            this.commands = [], this.options = [], this.parent = null, this._allowUnknownOption = !1, this._allowExcessArguments = !0, this.registeredArguments = [], this._args = this.registeredArguments, this.args = [], this.rawArgs = [], this.processedArgs = [], this._scriptPath = null, this._name = A || "", this._optionValues = {}, this._optionValueSources = {}, this._storeOptionsAsProperties = !1, this._actionHandler = null, this._executableHandler = !1, this._executableFile = null, this._executableDir = null, this._defaultCommandName = null, this._exitCallback = null, this._aliases = [], this._combineFlagAndOptionalValue = !0, this._description = "", this._summary = "", this._argsDescription = void 0, this._enablePositionalOptions = !1, this._passThroughOptions = !1, this._lifeCycleHooks = {}, this._showHelpAfterError = !1, this._showSuggestionAfterError = !0, this._outputConfiguration = {
                writeOut: (q) => Jj.stdout.write(q),
                writeErr: (q) => Jj.stderr.write(q),
                getOutHelpWidth: () => Jj.stdout.isTTY ? Jj.stdout.columns : void 0,
                getErrHelpWidth: () => Jj.stderr.isTTY ? Jj.stderr.columns : void 0,
                outputError: (q, K) => K(q)
            }, this._hidden = !1, this._helpOption = void 0, this._addImplicitHelpCommand = void 0, this._helpCommand = void 0, this._helpConfiguration = {}
        }
        copyInheritedSettings(A) {
            return this._outputConfiguration = A._outputConfiguration, this._helpOption = A._helpOption, this._helpCommand = A._helpCommand, this._helpConfiguration = A._helpConfiguration, this._exitCallback = A._exitCallback, this._storeOptionsAsProperties = A._storeOptionsAsProperties, this._combineFlagAndOptionalValue = A._combineFlagAndOptionalValue, this._allowExcessArguments = A._allowExcessArguments, this._enablePositionalOptions = A._enablePositionalOptions, this._showHelpAfterError = A._showHelpAfterError, this._showSuggestionAfterError = A._showSuggestionAfterError, this
        }
        _getCommandAndAncestors() {
            let A = [];
            for (let q = this; q; q = q.parent) A.push(q);
            return A
        }
        command(A, q, K) {
            let Y = q,
                z = K;
            if (typeof Y === "object" && Y !== null) z = Y, Y = null;
            z = z || {};
            let [, _, w] = A.match(/([^ ]+) *(.*)/), O = this.createCommand(_);
            if (Y) O.description(Y), O._executableHandler = !0;
            if (z.isDefault) this._defaultCommandName = O._name;
            if (O._hidden = !!(z.noHelp || z.hidden), O._executableFile = z.executableFile || null, w) O.arguments(w);
            if (this._registerCommand(O), O.parent = this, O.copyInheritedSettings(this), Y) return this;
            return O
        }
        createCommand(A) {
            return new _a8(A)
        }
        createHelp() {
            return Object.assign(new wHz, this.configureHelp())
        }
        configureHelp(A) {
            if (A === void 0) return this._helpConfiguration;
            return this._helpConfiguration = A, this
        }
        configureOutput(A) {
            if (A === void 0) return this._outputConfiguration;
            return Object.assign(this._outputConfiguration, A), this
        }
        showHelpAfterError(A = !0) {
            if (typeof A !== "string") A = !!A;
            return this._showHelpAfterError = A, this
        }
        showSuggestionAfterError(A = !0) {
            return this._showSuggestionAfterError = !!A, this
        }
        addCommand(A, q) {
            if (!A._name) throw Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
            if (q = q || {}, q.isDefault) this._defaultCommandName = A._name;
            if (q.noHelp || q.hidden) A._hidden = !0;
            return this._registerCommand(A), A.parent = this, A._checkForBrokenPassThrough(), this
        }
        createArgument(A, q) {
            return new zHz(A, q)
        }
        argument(A, q, K, Y) {
            let z = this.createArgument(A, q);
            if (typeof K === "function") z.default(Y).argParser(K);
            else z.default(K);
            return this.addArgument(z), this
        }
        arguments(A) {
            return A.trim().split(/ +/).forEach((q) => {
                this.argument(q)
            }), this
        }
        addArgument(A) {
            let q = this.registeredArguments.slice(-1)[0];
            if (q && q.variadic) throw Error(`only the last argument can be variadic '${q.name()}'`);
            if (A.required && A.defaultValue !== void 0 && A.parseArg === void 0) throw Error(`a default value for a required argument is never used: '${A.name()}'`);
            return this.registeredArguments.push(A), this
        }
        helpCommand(A, q) {
            if (typeof A === "boolean") return this._addImplicitHelpCommand = A, this;
            A = A ?? "help [command]";
            let [, K, Y] = A.match(/([^ ]+) *(.*)/), z = q ?? "display help for command", _ = this.createCommand(K);
            if (_.helpOption(!1), Y) _.arguments(Y);
            if (z) _.description(z);
            return this._addImplicitHelpCommand = !0, this._helpCommand = _, this
        }
        addHelpCommand(A, q) {
            if (typeof A !== "object") return this.helpCommand(A, q), this;
            return this._addImplicitHelpCommand = !0, this._helpCommand = A, this
        }
        _getHelpCommand() {
            if (this._addImplicitHelpCommand ?? (this.commands.length && !this._actionHandler && !this._findCommand("help"))) {
                if (this._helpCommand === void 0) this.helpCommand(void 0, void 0);
                return this._helpCommand
            }
            return null
        }
        hook(A, q) {
            let K = ["preSubcommand", "preAction", "postAction"];
            if (!K.includes(A)) throw Error(`Unexpected value for event passed to hook : '${A}'.
Expecting one of '${K.join("', '")}'`);
            if (this._lifeCycleHooks[A]) this._lifeCycleHooks[A].push(q);
            else this._lifeCycleHooks[A] = [q];
            return this
        }
        exitOverride(A) {
            if (A) this._exitCallback = A;
            else this._exitCallback = (q) => {
                if (q.code !== "commander.executeSubCommandAsync") throw q
            };
            return this
        }
        _exit(A, q, K) {
            if (this._exitCallback) this._exitCallback(new za8(A, q, K));
            Jj.exit(A)
        }
        action(A) {
            let q = (K) => {
                let Y = this.registeredArguments.length,
                    z = K.slice(0, Y);
                if (this._storeOptionsAsProperties) z[Y] = this;
                else z[Y] = this.opts();
                return z.push(this), A.apply(this, z)
            };
            return this._actionHandler = q, this
        }
        createOption(A, q) {
            return new Okq(A, q)
        }
        _callParseArg(A, q, K, Y) {
            try {
                return A.parseArg(q, K)
            } catch (z) {
                if (z.code === "commander.invalidArgument") {
                    let _ = `${Y} ${z.message}`;
                    this.error(_, {
                        exitCode: z.exitCode,
                        code: z.code
                    })
                }
                throw z
            }
        }
        _registerOption(A) {
            let q = A.short && this._findOption(A.short) || A.long && this._findOption(A.long);
            if (q) {
                let K = A.long && this._findOption(A.long) ? A.long : A.short;
                throw Error(`Cannot add option '${A.flags}'${this._name&&` to command '${this._name}'`} due to conflicting flag '${K}'
-  already used by option '${q.flags}'`)
            }
            this.options.push(A)
        }
        _registerCommand(A) {
            let q = (Y) => {
                    return [Y.name()].concat(Y.aliases())
                },
                K = q(A).find((Y) => this._findCommand(Y));
            if (K) {
                let Y = q(this._findCommand(K)).join("|"),
                    z = q(A).join("|");
                throw Error(`cannot add command '${z}' as already have command '${Y}'`)
            }
            this.commands.push(A)
        }
        addOption(A) {
            this._registerOption(A);
            let q = A.name(),
                K = A.attributeName();
            if (A.negate) {
                let z = A.long.replace(/^--no-/, "--");
                if (!this._findOption(z)) this.setOptionValueWithSource(K, A.defaultValue === void 0 ? !0 : A.defaultValue, "default")
            } else if (A.defaultValue !== void 0) this.setOptionValueWithSource(K, A.defaultValue, "default");
            let Y = (z, _, w) => {
                if (z == null && A.presetArg !== void 0) z = A.presetArg;
                let O = this.getOptionValue(K);
                if (z !== null && A.parseArg) z = this._callParseArg(A, z, O, _);
                else if (z !== null && A.variadic) z = A._concatValue(z, O);
                if (z == null)
                    if (A.negate) z = !1;
                    else if (A.isBoolean() || A.optional) z = !0;
                else z = "";
                this.setOptionValueWithSource(K, z, w)
            };
            if (this.on("option:" + q, (z) => {
                    let _ = `error: option '${A.flags}' argument '${z}' is invalid.`;
                    Y(z, _, "cli")
                }), A.envVar) this.on("optionEnv:" + q, (z) => {
                let _ = `error: option '${A.flags}' value '${z}' from env '${A.envVar}' is invalid.`;
                Y(z, _, "env")
            });
            return this
        }
        _optionEx(A, q, K, Y, z) {
            if (typeof q === "object" && q instanceof Okq) throw Error("To add an Option object use addOption() instead of option() or requiredOption()");
            let _ = this.createOption(q, K);
            if (_.makeOptionMandatory(!!A.mandatory), typeof Y === "function") _.default(z).argParser(Y);
            else if (Y instanceof RegExp) {
                let w = Y;
                Y = (O, $) => {
                    let H = w.exec(O);
                    return H ? H[0] : $
                }, _.default(z).argParser(Y)
            } else _.default(Y);
            return this.addOption(_)
        }
        option(A, q, K, Y) {
            return this._optionEx({}, A, q, K, Y)
        }
        requiredOption(A, q, K, Y) {
            return this._optionEx({
                mandatory: !0
            }, A, q, K, Y)
        }
        combineFlagAndOptionalValue(A = !0) {
            return this._combineFlagAndOptionalValue = !!A, this
        }
        allowUnknownOption(A = !0) {
            return this._allowUnknownOption = !!A, this
        }
        allowExcessArguments(A = !0) {
            return this._allowExcessArguments = !!A, this
        }
        enablePositionalOptions(A = !0) {
            return this._enablePositionalOptions = !!A, this
        }
        passThroughOptions(A = !0) {
            return this._passThroughOptions = !!A, this._checkForBrokenPassThrough(), this
        }
        _checkForBrokenPassThrough() {
            if (this.parent && this._passThroughOptions && !this.parent._enablePositionalOptions) throw Error(`passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`)
        }
        storeOptionsAsProperties(A = !0) {
            if (this.options.length) throw Error("call .storeOptionsAsProperties() before adding options");
            if (Object.keys(this._optionValues).length) throw Error("call .storeOptionsAsProperties() before setting option values");
            return this._storeOptionsAsProperties = !!A, this
        }
        getOptionValue(A) {
            if (this._storeOptionsAsProperties) return this[A];
            return this._optionValues[A]
        }
        setOptionValue(A, q) {
            return this.setOptionValueWithSource(A, q, void 0)
        }
        setOptionValueWithSource(A, q, K) {
            if (this._storeOptionsAsProperties) this[A] = q;
            else this._optionValues[A] = q;
            return this._optionValueSources[A] = K, this
        }
        getOptionValueSource(A) {
            return this._optionValueSources[A]
        }
        getOptionValueSourceWithGlobals(A) {
            let q;
            return this._getCommandAndAncestors().forEach((K) => {
                if (K.getOptionValueSource(A) !== void 0) q = K.getOptionValueSource(A)
            }), q
        }
        _prepareUserArgs(A, q) {
            if (A !== void 0 && !Array.isArray(A)) throw Error("first parameter to parse must be array or undefined");
            if (q = q || {}, A === void 0 && q.from === void 0) {
                if (Jj.versions?.electron) q.from = "electron";
                let Y = Jj.execArgv ?? [];
                if (Y.includes("-e") || Y.includes("--eval") || Y.includes("-p") || Y.includes("--print")) q.from = "eval"
            }
            if (A === void 0) A = Jj.argv;
            this.rawArgs = A.slice();
            let K;
            switch (q.from) {
                case void 0:
                case "node":
                    this._scriptPath = A[1], K = A.slice(2);
                    break;
                case "electron":
                    if (Jj.defaultApp) this._scriptPath = A[1], K = A.slice(2);
                    else K = A.slice(1);
                    break;
                case "user":
                    K = A.slice(0);
                    break;
                case "eval":
                    K = A.slice(1);
                    break;
                default:
                    throw Error(`unexpected parse option { from: '${q.from}' }`)
            }
            if (!this._name && this._scriptPath) this.nameFromFilename(this._scriptPath);
            return this._name = this._name || "program", K
        }
        parse(A, q) {
            let K = this._prepareUserArgs(A, q);
            return this._parseCommand([], K), this
        }
        async parseAsync(A, q) {
            let K = this._prepareUserArgs(A, q);
            return await this._parseCommand([], K), this
        }
        _executeSubCommand(A, q) {
            q = q.slice();
            let K = !1,
                Y = [".js", ".ts", ".tsx", ".mjs", ".cjs"];

            function z(H, j) {
                let J = Ci.resolve(H, j);
                if (Ya8.existsSync(J)) return J;
                if (Y.includes(Ci.extname(j))) return;
                let M = Y.find((D) => Ya8.existsSync(`${J}${D}`));
                if (M) return `${J}${M}`;
                return
            }
            this._checkForMissingMandatoryOptions(), this._checkForConflictingOptions();
            let _ = A._executableFile || `${this._name}-${A._name}`,
                w = this._executableDir || "";
            if (this._scriptPath) {
                let H;
                try {
                    H = Ya8.realpathSync(this._scriptPath)
                } catch (j) {
                    H = this._scriptPath
                }
                w = Ci.resolve(Ci.dirname(H), w)
            }
            if (w) {
                let H = z(w, _);
                if (!H && !A._executableFile && this._scriptPath) {
                    let j = Ci.basename(this._scriptPath, Ci.extname(this._scriptPath));
                    if (j !== this._name) H = z(w, `${j}-${A._name}`)
                }
                _ = H || _
            }
            K = Y.includes(Ci.extname(_));
            let O;
            if (Jj.platform !== "win32")
                if (K) q.unshift(_), q = Hkq(Jj.execArgv).concat(q), O = Ka8.spawn(Jj.argv[0], q, {
                    stdio: "inherit"
                });
                else O = Ka8.spawn(_, q, {
                    stdio: "inherit"
                });
            else q.unshift(_), q = Hkq(Jj.execArgv).concat(q), O = Ka8.spawn(Jj.execPath, q, {
                stdio: "inherit"
            });
            if (!O.killed)["SIGUSR1", "SIGUSR2", "SIGTERM", "SIGINT", "SIGHUP"].forEach((j) => {
                Jj.on(j, () => {
                    if (O.killed === !1 && O.exitCode === null) O.kill(j)
                })
            });
            let $ = this._exitCallback;
            O.on("close", (H) => {
                if (H = H ?? 1, !$) Jj.exit(H);
                else $(new za8(H, "commander.executeSubCommandAsync", "(close)"))
            }), O.on("error", (H) => {
                if (H.code === "ENOENT") {
                    let j = w ? `searched for local subcommand relative to directory '${w}'` : "no directory for search for local subcommand, use .executableDir() to supply a custom directory",
                        J = `'${_}' does not exist
 - if '${A._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${j}`;
                    throw Error(J)
                } else if (H.code === "EACCES") throw Error(`'${_}' not executable`);
                if (!$) Jj.exit(1);
                else {
                    let j = new za8(1, "commander.executeSubCommandAsync", "(error)");
                    j.nestedError = H, $(j)
                }
            }), this.runningCommand = O
        }
        _dispatchSubcommand(A, q, K) {
            let Y = this._findCommand(A);
            if (!Y) this.help({
                error: !0
            });
            let z;
            return z = this._chainOrCallSubCommandHook(z, Y, "preSubcommand"), z = this._chainOrCall(z, () => {
                if (Y._executableHandler) this._executeSubCommand(Y, q.concat(K));
                else return Y._parseCommand(q, K)
            }), z
        }
        _dispatchHelpCommand(A) {
            if (!A) this.help();
            let q = this._findCommand(A);
            if (q && !q._executableHandler) q.help();
            return this._dispatchSubcommand(A, [], [this._getHelpOption()?.long ?? this._getHelpOption()?.short ?? "--help"])
        }
        _checkNumberOfArguments() {
            if (this.registeredArguments.forEach((A, q) => {
                    if (A.required && this.args[q] == null) this.missingArgument(A.name())
                }), this.registeredArguments.length > 0 && this.registeredArguments[this.registeredArguments.length - 1].variadic) return;
            if (this.args.length > this.registeredArguments.length) this._excessArguments(this.args)
        }
        _processArguments() {
            let A = (K, Y, z) => {
                let _ = Y;
                if (Y !== null && K.parseArg) {
                    let w = `error: command-argument value '${Y}' is invalid for argument '${K.name()}'.`;
                    _ = this._callParseArg(K, Y, z, w)
                }
                return _
            };
            this._checkNumberOfArguments();
            let q = [];
            this.registeredArguments.forEach((K, Y) => {
                let z = K.defaultValue;
                if (K.variadic) {
                    if (Y < this.args.length) {
                        if (z = this.args.slice(Y), K.parseArg) z = z.reduce((_, w) => {
                            return A(K, w, _)
                        }, K.defaultValue)
                    } else if (z === void 0) z = []
                } else if (Y < this.args.length) {
                    if (z = this.args[Y], K.parseArg) z = A(K, z, K.defaultValue)
                }
                q[Y] = z
            }), this.processedArgs = q
        }
        _chainOrCall(A, q) {
            if (A && A.then && typeof A.then === "function") return A.then(() => q());
            return q()
        }
        _chainOrCallHooks(A, q) {
            let K = A,
                Y = [];
            if (this._getCommandAndAncestors().reverse().filter((z) => z._lifeCycleHooks[q] !== void 0).forEach((z) => {
                    z._lifeCycleHooks[q].forEach((_) => {
                        Y.push({
                            hookedCommand: z,
                            callback: _
                        })
                    })
                }), q === "postAction") Y.reverse();
            return Y.forEach((z) => {
                K = this._chainOrCall(K, () => {
                    return z.callback(z.hookedCommand, this)
                })
            }), K
        }
        _chainOrCallSubCommandHook(A, q, K) {
            let Y = A;
            if (this._lifeCycleHooks[K] !== void 0) this._lifeCycleHooks[K].forEach((z) => {
                Y = this._chainOrCall(Y, () => {
                    return z(this, q)
                })
            });
            return Y
        }
        _parseCommand(A, q) {
            let K = this.parseOptions(q);
            if (this._parseOptionsEnv(), this._parseOptionsImplied(), A = A.concat(K.operands), q = K.unknown, this.args = A.concat(q), A && this._findCommand(A[0])) return this._dispatchSubcommand(A[0], A.slice(1), q);
            if (this._getHelpCommand() && A[0] === this._getHelpCommand().name()) return this._dispatchHelpCommand(A[1]);
            if (this._defaultCommandName) return this._outputHelpIfRequested(q), this._dispatchSubcommand(this._defaultCommandName, A, q);
            if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) this.help({
                error: !0
            });
            this._outputHelpIfRequested(K.unknown), this._checkForMissingMandatoryOptions(), this._checkForConflictingOptions();
            let Y = () => {
                    if (K.unknown.length > 0) this.unknownOption(K.unknown[0])
                },
                z = `command:${this.name()}`;
            if (this._actionHandler) {
                Y(), this._processArguments();
                let _;
                if (_ = this._chainOrCallHooks(_, "preAction"), _ = this._chainOrCall(_, () => this._actionHandler(this.processedArgs)), this.parent) _ = this._chainOrCall(_, () => {
                    this.parent.emit(z, A, q)
                });
                return _ = this._chainOrCallHooks(_, "postAction"), _
            }
            if (this.parent && this.parent.listenerCount(z)) Y(), this._processArguments(), this.parent.emit(z, A, q);
            else if (A.length) {
                if (this._findCommand("*")) return this._dispatchSubcommand("*", A, q);
                if (this.listenerCount("command:*")) this.emit("command:*", A, q);
                else if (this.commands.length) this.unknownCommand();
                else Y(), this._processArguments()
            } else if (this.commands.length) Y(), this.help({
                error: !0
            });
            else Y(), this._processArguments()
        }
        _findCommand(A) {
            if (!A) return;
            return this.commands.find((q) => q._name === A || q._aliases.includes(A))
        }
        _findOption(A) {
            return this.options.find((q) => q.is(A))
        }
        _checkForMissingMandatoryOptions() {
            this._getCommandAndAncestors().forEach((A) => {
                A.options.forEach((q) => {
                    if (q.mandatory && A.getOptionValue(q.attributeName()) === void 0) A.missingMandatoryOptionValue(q)
                })
            })
        }
        _checkForConflictingLocalOptions() {
            let A = this.options.filter((K) => {
                let Y = K.attributeName();
                if (this.getOptionValue(Y) === void 0) return !1;
                return this.getOptionValueSource(Y) !== "default"
            });
            A.filter((K) => K.conflictsWith.length > 0).forEach((K) => {
                let Y = A.find((z) => K.conflictsWith.includes(z.attributeName()));
                if (Y) this._conflictingOption(K, Y)
            })
        }
        _checkForConflictingOptions() {
            this._getCommandAndAncestors().forEach((A) => {
                A._checkForConflictingLocalOptions()
            })
        }
        parseOptions(A) {
            let q = [],
                K = [],
                Y = q,
                z = A.slice();

            function _(O) {
                return O.length > 1 && O[0] === "-"
            }
            let w = null;
            while (z.length) {
                let O = z.shift();
                if (O === "--") {
                    if (Y === K) Y.push(O);
                    Y.push(...z);
                    break
                }
                if (w && !_(O)) {
                    this.emit(`option:${w.name()}`, O);
                    continue
                }
                if (w = null, _(O)) {
                    let $ = this._findOption(O);
                    if ($) {
                        if ($.required) {
                            let H = z.shift();
                            if (H === void 0) this.optionMissingArgument($);
                            this.emit(`option:${$.name()}`, H)
                        } else if ($.optional) {
                            let H = null;
                            if (z.length > 0 && !_(z[0])) H = z.shift();
                            this.emit(`option:${$.name()}`, H)
                        } else this.emit(`option:${$.name()}`);
                        w = $.variadic ? $ : null;
                        continue
                    }
                }
                if (O.length > 2 && O[0] === "-" && O[1] !== "-") {
                    let $ = this._findOption(`-${O[1]}`);
                    if ($) {
                        if ($.required || $.optional && this._combineFlagAndOptionalValue) this.emit(`option:${$.name()}`, O.slice(2));
                        else this.emit(`option:${$.name()}`), z.unshift(`-${O.slice(2)}`);
                        continue
                    }
                }
                if (/^--[^=]+=/.test(O)) {
                    let $ = O.indexOf("="),
                        H = this._findOption(O.slice(0, $));
                    if (H && (H.required || H.optional)) {
                        this.emit(`option:${H.name()}`, O.slice($ + 1));
                        continue
                    }
                }
                if (_(O)) Y = K;
                if ((this._enablePositionalOptions || this._passThroughOptions) && q.length === 0 && K.length === 0) {
                    if (this._findCommand(O)) {
                        if (q.push(O), z.length > 0) K.push(...z);
                        break
                    } else if (this._getHelpCommand() && O === this._getHelpCommand().name()) {
                        if (q.push(O), z.length > 0) q.push(...z);
                        break
                    } else if (this._defaultCommandName) {
                        if (K.push(O), z.length > 0) K.push(...z);
                        break
                    }
                }
                if (this._passThroughOptions) {
                    if (Y.push(O), z.length > 0) Y.push(...z);
                    break
                }
                Y.push(O)
            }
            return {
                operands: q,
                unknown: K
            }
        }
        opts() {
            if (this._storeOptionsAsProperties) {
                let A = {},
                    q = this.options.length;
                for (let K = 0; K < q; K++) {
                    let Y = this.options[K].attributeName();
                    A[Y] = Y === this._versionOptionName ? this._version : this[Y]
                }
                return A
            }
            return this._optionValues
        }
        optsWithGlobals() {
            return this._getCommandAndAncestors().reduce((A, q) => Object.assign(A, q.opts()), {})
        }
        error(A, q) {
            if (this._outputConfiguration.outputError(`${A}
`, this._outputConfiguration.writeErr), typeof this._showHelpAfterError === "string") this._outputConfiguration.writeErr(`${this._showHelpAfterError}
`);
            else if (this._showHelpAfterError) this._outputConfiguration.writeErr(`
`), this.outputHelp({
                error: !0
            });
            let K = q || {},
                Y = K.exitCode || 1,
                z = K.code || "commander.error";
            this._exit(Y, z, A)
        }
        _parseOptionsEnv() {
            this.options.forEach((A) => {
                if (A.envVar && A.envVar in Jj.env) {
                    let q = A.attributeName();
                    if (this.getOptionValue(q) === void 0 || ["default", "config", "env"].includes(this.getOptionValueSource(q)))
                        if (A.required || A.optional) this.emit(`optionEnv:${A.name()}`, Jj.env[A.envVar]);
                        else this.emit(`optionEnv:${A.name()}`)
                }
            })
        }
        _parseOptionsImplied() {
            let A = new OHz(this.options),
                q = (K) => {
                    return this.getOptionValue(K) !== void 0 && !["default", "implied"].includes(this.getOptionValueSource(K))
                };
            this.options.filter((K) => K.implied !== void 0 && q(K.attributeName()) && A.valueFromOption(this.getOptionValue(K.attributeName()), K)).forEach((K) => {
                Object.keys(K.implied).filter((Y) => !q(Y)).forEach((Y) => {
                    this.setOptionValueWithSource(Y, K.implied[Y], "implied")
                })
            })
        }
        missingArgument(A) {
            let q = `error: missing required argument '${A}'`;
            this.error(q, {
                code: "commander.missingArgument"
            })
        }
        optionMissingArgument(A) {
            let q = `error: option '${A.flags}' argument missing`;
            this.error(q, {
                code: "commander.optionMissingArgument"
            })
        }
        missingMandatoryOptionValue(A) {
            let q = `error: required option '${A.flags}' not specified`;
            this.error(q, {
                code: "commander.missingMandatoryOptionValue"
            })
        }
        _conflictingOption(A, q) {
            let K = (_) => {
                    let w = _.attributeName(),
                        O = this.getOptionValue(w),
                        $ = this.options.find((j) => j.negate && w === j.attributeName()),
                        H = this.options.find((j) => !j.negate && w === j.attributeName());
                    if ($ && ($.presetArg === void 0 && O === !1 || $.presetArg !== void 0 && O === $.presetArg)) return $;
                    return H || _
                },
                Y = (_) => {
                    let w = K(_),
                        O = w.attributeName();
                    if (this.getOptionValueSource(O) === "env") return `environment variable '${w.envVar}'`;
                    return `option '${w.flags}'`
                },
                z = `error: ${Y(A)} cannot be used with ${Y(q)}`;
            this.error(z, {
                code: "commander.conflictingOption"
            })
        }
        unknownOption(A) {
            if (this._allowUnknownOption) return;
            let q = "";
            if (A.startsWith("--") && this._showSuggestionAfterError) {
                let Y = [],
                    z = this;
                do {
                    let _ = z.createHelp().visibleOptions(z).filter((w) => w.long).map((w) => w.long);
                    Y = Y.concat(_), z = z.parent
                } while (z && !z._enablePositionalOptions);
                q = $kq(A, Y)
            }
            let K = `error: unknown option '${A}'${q}`;
            this.error(K, {
                code: "commander.unknownOption"
            })
        }
        _excessArguments(A) {
            if (this._allowExcessArguments) return;
            let q = this.registeredArguments.length,
                K = q === 1 ? "" : "s",
                z = `error: too many arguments${this.parent?` for '${this.name()}'`:""}. Expected ${q} argument${K} but got ${A.length}.`;
            this.error(z, {
                code: "commander.excessArguments"
            })
        }
        unknownCommand() {
            let A = this.args[0],
                q = "";
            if (this._showSuggestionAfterError) {
                let Y = [];
                this.createHelp().visibleCommands(this).forEach((z) => {
                    if (Y.push(z.name()), z.alias()) Y.push(z.alias())
                }), q = $kq(A, Y)
            }
            let K = `error: unknown command '${A}'${q}`;
            this.error(K, {
                code: "commander.unknownCommand"
            })
        }
        version(A, q, K) {
            if (A === void 0) return this._version;
            this._version = A, q = q || "-V, --version", K = K || "output the version number";
            let Y = this.createOption(q, K);
            return this._versionOptionName = Y.attributeName(), this._registerOption(Y), this.on("option:" + Y.name(), () => {
                this._outputConfiguration.writeOut(`${A}
`), this._exit(0, "commander.version", A)
            }), this
        }
        description(A, q) {
            if (A === void 0 && q === void 0) return this._description;
            if (this._description = A, q) this._argsDescription = q;
            return this
        }
        summary(A) {
            if (A === void 0) return this._summary;
            return this._summary = A, this
        }
        alias(A) {
            if (A === void 0) return this._aliases[0];
            let q = this;
            if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) q = this.commands[this.commands.length - 1];
            if (A === q._name) throw Error("Command alias can't be the same as its name");
            let K = this.parent?._findCommand(A);
            if (K) {
                let Y = [K.name()].concat(K.aliases()).join("|");
                throw Error(`cannot add alias '${A}' to command '${this.name()}' as already have command '${Y}'`)
            }
            return q._aliases.push(A), this
        }
        aliases(A) {
            if (A === void 0) return this._aliases;
            return A.forEach((q) => this.alias(q)), this
        }
        usage(A) {
            if (A === void 0) {
                if (this._usage) return this._usage;
                let q = this.registeredArguments.map((K) => {
                    return _Hz(K)
                });
                return [].concat(this.options.length || this._helpOption !== null ? "[options]" : [], this.commands.length ? "[command]" : [], this.registeredArguments.length ? q : []).join(" ")
            }
            return this._usage = A, this
        }
        name(A) {
            if (A === void 0) return this._name;
            return this._name = A, this
        }
        nameFromFilename(A) {
            return this._name = Ci.basename(A, Ci.extname(A)), this
        }
        executableDir(A) {
            if (A === void 0) return this._executableDir;
            return this._executableDir = A, this
        }
        helpInformation(A) {
            let q = this.createHelp();
            if (q.helpWidth === void 0) q.helpWidth = A && A.error ? this._outputConfiguration.getErrHelpWidth() : this._outputConfiguration.getOutHelpWidth();
            return q.formatHelp(this, q)
        }
        _getHelpContext(A) {
            A = A || {};
            let q = {
                    error: !!A.error
                },
                K;
            if (q.error) K = (Y) => this._outputConfiguration.writeErr(Y);
            else K = (Y) => this._outputConfiguration.writeOut(Y);
            return q.write = A.write || K, q.command = this, q
        }
        outputHelp(A) {
            let q;
            if (typeof A === "function") q = A, A = void 0;
            let K = this._getHelpContext(A);
            this._getCommandAndAncestors().reverse().forEach((z) => z.emit("beforeAllHelp", K)), this.emit("beforeHelp", K);
            let Y = this.helpInformation(K);
            if (q) {
                if (Y = q(Y), typeof Y !== "string" && !Buffer.isBuffer(Y)) throw Error("outputHelp callback must return a string or a Buffer")
            }
            if (K.write(Y), this._getHelpOption()?.long) this.emit(this._getHelpOption().long);
            this.emit("afterHelp", K), this._getCommandAndAncestors().forEach((z) => z.emit("afterAllHelp", K))
        }
        helpOption(A, q) {
            if (typeof A === "boolean") {
                if (A) this._helpOption = this._helpOption ?? void 0;
                else this._helpOption = null;
                return this
            }
            return A = A ?? "-h, --help", q = q ?? "display help for command", this._helpOption = this.createOption(A, q), this
        }
        _getHelpOption() {
            if (this._helpOption === void 0) this.helpOption(void 0, void 0);
            return this._helpOption
        }
        addHelpOption(A) {
            return this._helpOption = A, this
        }
        help(A) {
            this.outputHelp(A);
            let q = Jj.exitCode || 0;
            if (q === 0 && A && typeof A !== "function" && A.error) q = 1;
            this._exit(q, "commander.help", "(outputHelp)")
        }
        addHelpText(A, q) {
            let K = ["beforeAll", "before", "after", "afterAll"];
            if (!K.includes(A)) throw Error(`Unexpected value for position to addHelpText.
Expecting one of '${K.join("', '")}'`);
            let Y = `${A}Help`;
            return this.on(Y, (z) => {
                let _;
                if (typeof q === "function") _ = q({
                    error: z.error,
                    command: z.command
                });
                else _ = q;
                if (_) z.write(`${_}
`)
            }), this
        }
        _outputHelpIfRequested(A) {
            let q = this._getHelpOption();
            if (q && A.find((Y) => q.is(Y))) this.outputHelp(), this._exit(0, "commander.helpDisplayed", "(outputHelp)")
        }
    }

    function Hkq(A) {
        return A.map((q) => {
            if (!q.startsWith("--inspect")) return q;
            let K, Y = "127.0.0.1",
                z = "9229",
                _;
            if ((_ = q.match(/^(--inspect(-brk)?)$/)) !== null) K = _[1];
            else if ((_ = q.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null)
                if (K = _[1], /^\d+$/.test(_[3])) z = _[3];
                else Y = _[3];
            else if ((_ = q.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) K = _[1], Y = _[3], z = _[4];
            if (K && z !== "0") return `${K}=${Y}:${parseInt(z)+1}`;
            return q
        })
    }
    $Hz.Command = _a8
})
// @from(Ln 463861, Col 4)
Xkq = x((MHz) => {
    var {
        Argument: Jkq
    } = NC1(), {
        Command: wa8
    } = jkq(), {
        CommanderError: jHz,
        InvalidArgumentError: Mkq
    } = go6(), {
        Help: JHz
    } = Aa8(), {
        Option: Dkq
    } = qa8();
    MHz.program = new wa8;
    MHz.createCommand = (A) => new wa8(A);
    MHz.createOption = (A, q) => new Dkq(A, q);
    MHz.createArgument = (A, q) => new Jkq(A, q);
    MHz.Command = wa8;
    MHz.Option = Dkq;
    MHz.Argument = Jkq;
    MHz.Help = JHz;
    MHz.CommanderError = jHz;
    MHz.InvalidArgumentError = Mkq;
    MHz.InvalidOptionArgumentError = Mkq
})
// @from(Ln 463886, Col 4)
Wkq = x((IE, Pkq) => {
    var Yx = Xkq();
    IE = Pkq.exports = {};
    IE.program = new Yx.Command;
    IE.Argument = Yx.Argument;
    IE.Command = Yx.Command;
    IE.CommanderError = Yx.CommanderError;
    IE.Help = Yx.Help;
    IE.InvalidArgumentError = Yx.InvalidArgumentError;
    IE.InvalidOptionArgumentError = Yx.InvalidArgumentError;
    IE.Option = Yx.Option;
    IE.createCommand = (A) => new Yx.Command(A);
    IE.createOption = (A, q) => new Yx.Option(A, q);
    IE.createArgument = (A, q) => new Yx.Argument(A, q)
})
// @from(Ln 463901, Col 4)
Zkq
// @from(Ln 463901, Col 9)
zv$
// @from(Ln 463901, Col 14)
_v$
// @from(Ln 463901, Col 19)
wv$
// @from(Ln 463901, Col 24)
Ov$
// @from(Ln 463901, Col 29)
$v$
// @from(Ln 463901, Col 34)
Gkq
// @from(Ln 463901, Col 39)
Hv$
// @from(Ln 463901, Col 44)
fkq
// @from(Ln 463901, Col 49)
jv$
// @from(Ln 463901, Col 54)
VK
// @from(Ln 463901, Col 58)
Jv$
// @from(Ln 463902, Col 4)
Tkq = E(() => {
    Zkq = t(Wkq(), 1), {
        program: zv$,
        createCommand: _v$,
        createArgument: wv$,
        createOption: Ov$,
        CommanderError: $v$,
        InvalidArgumentError: Gkq,
        InvalidOptionArgumentError: Hv$,
        Command: fkq,
        Argument: jv$,
        Option: VK,
        Help: Jv$
    } = Zkq.default
})
// @from(Ln 463920, Col 0)
function yHz() {
    return process.env.ANTHROPIC_BASE_URL || process.env.CLAUDE_CODE_API_BASE_URL || "https://api.anthropic.com"
}
// @from(Ln 463924, Col 0)
function Oa8(A) {
    k(`[files-api] ${A}`, {
        level: "error"
    })
}
// @from(Ln 463930, Col 0)
function t_6(A) {
    k(`[files-api] ${A}`)
}
// @from(Ln 463933, Col 0)
async function RHz(A, q) {
    let K = "";
    for (let Y = 1; Y <= VC1; Y++) {
        let z = await q(Y);
        if (z.done) return z.value;
        if (K = z.error || `${A} failed`, t_6(`${A} attempt ${Y}/${VC1} failed: ${K}`), Y < VC1) {
            let _ = LHz * Math.pow(2, Y - 1);
            t_6(`Retrying ${A} in ${_}ms...`), await new Promise((w) => setTimeout(w, _))
        }
    }
    throw Error(`${K} after ${VC1} attempts`)
}
// @from(Ln 463945, Col 0)
async function hHz(A, q) {
    let Y = `${q.baseUrl||yHz()}/v1/files/${A}/content`,
        z = {
            Authorization: `Bearer ${q.oauthToken}`,
            "anthropic-version": EHz,
            "anthropic-beta": kHz
        };
    return t_6(`Downloading file ${A} from ${Y}`), RHz(`Download file ${A}`, async () => {
        try {
            let _ = await X8.get(Y, {
                headers: z,
                responseType: "arraybuffer",
                timeout: 60000,
                validateStatus: (w) => w < 500
            });
            if (_.status === 200) return t_6(`Downloaded file ${A} (${_.data.length} bytes)`), {
                done: !0,
                value: Buffer.from(_.data)
            };
            if (_.status === 404) throw Error(`File not found: ${A}`);
            if (_.status === 401) throw Error("Authentication failed: invalid or missing API key");
            if (_.status === 403) throw Error(`Access denied to file: ${A}`);
            return {
                done: !1,
                error: `status ${_.status}`
            }
        } catch (_) {
            if (!X8.isAxiosError(_)) throw _;
            return {
                done: !1,
                error: _.message
            }
        }
    })
}
// @from(Ln 463981, Col 0)
function SHz(A, q, K) {
    let Y = bE.normalize(K);
    if (Y.startsWith("..")) return Oa8(`Invalid file path: ${K}. Path must not traverse above workspace`), null;
    let z = bE.join(A, q, "uploads"),
        w = [bE.join(A, q, "uploads") + bE.sep, bE.sep + "uploads" + bE.sep].find(($) => Y.startsWith($)),
        O = w ? Y.slice(w.length) : Y;
    return bE.join(z, O)
}
// @from(Ln 463989, Col 0)
async function CHz(A, q) {
    let {
        fileId: K,
        relativePath: Y
    } = A, z = SHz(G1(), q.sessionId, Y);
    if (!z) return {
        fileId: K,
        path: "",
        success: !1,
        error: `Invalid file path: ${Y}`
    };
    try {
        let _ = await hHz(K, q),
            w = bE.dirname(z);
        return await Fo6.mkdir(w, {
            recursive: !0
        }), await Fo6.writeFile(z, _), t_6(`Saved file ${K} to ${z} (${_.length} bytes)`), {
            fileId: K,
            path: z,
            success: !0,
            bytesWritten: _.length
        }
    } catch (_) {
        if (Oa8(`Failed to download file ${K}: ${_1(_)}`), _ instanceof Error) _6(_);
        return {
            fileId: K,
            path: z,
            success: !1,
            error: _1(_)
        }
    }
}
// @from(Ln 464021, Col 0)
async function bHz(A, q, K) {
    let Y = Array(A.length),
        z = 0;
    async function _() {
        while (z < A.length) {
            let $ = z++,
                H = A[$];
            if (H !== void 0) Y[$] = await q(H, $)
        }
    }
    let w = [],
        O = Math.min(K, A.length);
    for (let $ = 0; $ < O; $++) w.push(_());
    return await Promise.all(w), Y
}
// @from(Ln 464036, Col 0)
async function vkq(A, q, K = IHz) {
    if (A.length === 0) return [];
    t_6(`Downloading ${A.length} file(s) for session ${q.sessionId}`);
    let Y = Date.now(),
        z = await bHz(A, async (O, $) => {
            return await CHz(O, q)
        }, K),
        _ = Date.now() - Y,
        w = z.filter((O) => O.success).length;
    return t_6(`Downloaded ${w}/${A.length} file(s) in ${_}ms`), z
}
// @from(Ln 464048, Col 0)
function Nkq(A) {
    let q = [],
        K = A.flatMap((Y) => Y.split(" ").filter(Boolean));
    for (let Y of K) {
        let z = Y.indexOf(":");
        if (z === -1) continue;
        let _ = Y.substring(0, z),
            w = Y.substring(z + 1);
        if (!_ || !w) {
            Oa8(`Invalid file spec: ${Y}. Both file_id and path are required`);
            continue
        }
        q.push({
            fileId: _,
            relativePath: w
        })
    }
    return q
}
// @from(Ln 464067, Col 4)
kHz = "files-api-2025-04-14"
// @from(Ln 464068, Col 4)
EHz = "2023-06-01"
// @from(Ln 464069, Col 4)
VC1 = 3
// @from(Ln 464070, Col 4)
LHz = 500
// @from(Ln 464071, Col 4)
IHz = 5
// @from(Ln 464072, Col 4)
$a8 = E(() => {
    kK();
    lA();
    H1();
    k1();
    V1();
    s8()
})
// @from(Ln 464080, Col 4)
Ekq = {}
// @from(Ln 464099, Col 0)
function kkq() {
    if (xE.filePath !== null) return xE.filePath;
    return null
}
// @from(Ln 464104, Col 0)
function BHz() {
    xE.filePath = null, xE.timestamp = 0
}
// @from(Ln 464108, Col 0)
function gHz() {
    let A = R1(),
        q = Ii(c8(), "projects"),
        K = Ii(q, BD(AA()));
    try {
        let Y = $1().readdirSync(K);
        return (typeof Y[0] === "string" ? Y : Y.map((w) => w.name)).filter((w) => w.startsWith(A) && w.endsWith(".cast")).sort().map((w) => Ii(K, w))
    } catch {
        return []
    }
}
// @from(Ln 464119, Col 0)
async function Qo6() {
    let A = xE.filePath;
    if (!A || xE.timestamp === 0) return;
    let q = Ii(c8(), "projects"),
        K = Ii(q, BD(AA())),
        Y = Ii(K, `${R1()}-${xE.timestamp}.cast`);
    if (A === Y) return;
    await po6?.flush();
    try {
        await uHz(A, Y), xE.filePath = Y, k(`[asciicast] Renamed recording: ${kC1(A)} → ${kC1(Y)}`)
    } catch {
        k(`[asciicast] Failed to rename recording from ${kC1(A)} to ${kC1(Y)}`)
    }
}
// @from(Ln 464134, Col 0)
function Vkq() {
    let A = process.stdout.columns || 80,
        q = process.stdout.rows || 24;
    return {
        cols: A,
        rows: q
    }
}
// @from(Ln 464142, Col 0)
async function FHz() {
    await po6?.flush()
}
// @from(Ln 464146, Col 0)
function pHz() {
    let A = kkq();
    if (!A) return;
    let {
        cols: q,
        rows: K
    } = Vkq(), Y = performance.now(), z = B6({
        version: 2,
        width: q,
        height: K,
        timestamp: Math.floor(Date.now() / 1000),
        env: {
            SHELL: process.env.SHELL || "",
            TERM: process.env.TERM || ""
        }
    });
    try {
        $1().mkdirSync(mHz(A))
    } catch {}
    $1().appendFileSync(A, z + `
`, {
        mode: 384
    });
    let _ = Promise.resolve(),
        w = sw6({
            writeFn(H) {
                let j = xE.filePath;
                if (!j) return;
                _ = _.then(() => xHz(j, H)).catch(() => {})
            },
            flushIntervalMs: 500,
            maxBufferSize: 50,
            maxBufferBytes: 10485760
        }),
        O = process.stdout.write.bind(process.stdout);
    process.stdout.write = function(H, j, J) {
        let M = (performance.now() - Y) / 1000,
            D = typeof H === "string" ? H : Buffer.from(H).toString("utf-8");
        if (w.write(B6([M, "o", D]) + `
`), typeof j === "function") return O(H, j);
        return O(H, j, J)
    };

    function $() {
        let H = (performance.now() - Y) / 1000,
            {
                cols: j,
                rows: J
            } = Vkq();
        w.write(B6([H, "r", `${j}x${J}`]) + `
`)
    }
    process.stdout.on("resize", $), po6 = {
        async flush() {
            w.flush(), await _
        },
        async dispose() {
            w.dispose(), await _, process.stdout.removeListener("resize", $), process.stdout.write = O
        }
    }, E4(async () => {
        await po6?.dispose(), po6 = null
    }), k(`[asciicast] Recording to ${A}`)
}
// @from(Ln 464209, Col 4)
xE
// @from(Ln 464209, Col 8)
po6 = null
// @from(Ln 464210, Col 4)
Uo6 = E(() => {
    KY();
    H1();
    A8();
    SA();
    F9();
    g1();
    T1();
    xE = {
        filePath: null,
        timestamp: 0
    }
})
// @from(Ln 464227, Col 0)
function Lkq() {
    let A = vF6();
    if (!A?.teamName || !A?.agentName) {
        k("[Reconnection] computeInitialTeamContext: No teammate context set (not a teammate)");
        return
    }
    let {
        teamName: q,
        agentId: K,
        agentName: Y
    } = A, z = e$(q);
    if (!z) {
        _6(Error(`[computeInitialTeamContext] Could not read team file for ${q}`));
        return
    }
    let _ = ykq(YG(), q.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase(), "config.json"),
        w = !K;
    return k(`[Reconnection] Computed initial team context for ${w?"leader":`teammate ${Y}`} in team ${q}`), {
        teamName: q,
        teamFilePath: _,
        leadAgentId: z.leadAgentId,
        selfAgentId: K,
        selfAgentName: Y,
        isLeader: w,
        teammates: {}
    }
}
// @from(Ln 464255, Col 0)
function Rkq(A, q, K) {
    let Y = e$(q);
    if (!Y) {
        _6(Error(`[initializeTeammateContextFromSession] Could not read team file for ${q} (agent: ${K})`));
        return
    }
    let z = Y.members.find((O) => O.name === K);
    if (!z) k(`[Reconnection] Member ${K} not found in team ${q} - may have been removed`);
    let _ = z?.agentId,
        w = ykq(YG(), q.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase(), "config.json");
    A((O) => ({
        ...O,
        teamContext: {
            teamName: q,
            teamFilePath: w,
            leadAgentId: Y.leadAgentId,
            selfAgentId: _,
            selfAgentName: K,
            isLeader: !1,
            teammates: {}
        }
    })), k(`[Reconnection] Initialized agent context from session for ${K} in team ${q}`)
}
// @from(Ln 464278, Col 4)
Ha8 = E(() => {
    A8();
    vf();
    H1();
    k1();
    zz()
})
// @from(Ln 464286, Col 0)
function Ikq(A) {
    hkq = A
}
// @from(Ln 464290, Col 0)
function bkq(A) {
    Skq = A
}
// @from(Ln 464294, Col 0)
function xkq(A) {
    Ckq = A
}
// @from(Ln 464298, Col 0)
function zV6(A) {
    hkq?.(A)
}
// @from(Ln 464302, Col 0)
function EC1(A) {
    Skq?.(A)
}
// @from(Ln 464306, Col 0)
function ukq(A) {
    Ckq?.(A)
}
// @from(Ln 464309, Col 4)
hkq = null
// @from(Ln 464310, Col 4)
Skq = null
// @from(Ln 464311, Col 4)
Ckq = null
// @from(Ln 464313, Col 0)
function bi({
    newState: A,
    oldState: q
}) {
    let K = q.toolPermissionContext.mode,
        Y = A.toolPermissionContext.mode;
    if (K !== Y) {
        let z = _C(K),
            _ = _C(Y);
        if (z !== _) EC1({
            permission_mode: _
        });
        ukq(Y)
    }
    if (A.mainLoopModel !== q.mainLoopModel && A.mainLoopModel === null) TA("userSettings", {
        model: void 0
    }), MW(null);
    if (A.mainLoopModel !== q.mainLoopModel && A.mainLoopModel !== null) TA("userSettings", {
        model: A.mainLoopModel
    }), MW(A.mainLoopModel);
    if (A.expandedView !== q.expandedView) {
        let z = A.expandedView === "tasks",
            _ = A.expandedView === "teammates";
        if (X1().showExpandedTodos !== z || X1().showSpinnerTree !== _) d1((w) => ({
            ...w,
            showExpandedTodos: z,
            showSpinnerTree: _
        }))
    }
    if (A.verbose !== q.verbose && X1().verbose !== A.verbose) {
        let z = A.verbose;
        d1((_) => ({
            ..._,
            verbose: z
        }))
    }
    if (A.feedbackSurvey.timeLastShown !== q.feedbackSurvey.timeLastShown && A.feedbackSurvey.timeLastShown !== null) {
        let z = A.feedbackSurvey.timeLastShown;
        d1((_) => ({
            ..._,
            feedbackSurveyState: {
                lastShownTime: z
            }
        }))
    }
    if (A.settings !== q.settings) try {
        if (rF6(), oF6(), aF6(), A.settings.env !== q.settings.env) bF()
    } catch (z) {
        _6(z instanceof Error ? z : Error(`Failed to apply settings changes: ${z}`))
    }
}
// @from(Ln 464364, Col 4)
do6 = E(() => {
    k8();
    k8();
    T1();
    i8();
    fA();
    k1();
    qV6();
    rD()
})
// @from(Ln 464374, Col 0)
class ja8 {
    frameDurations = [];
    firstRenderTime;
    lastRenderTime;
    record(A) {
        let q = performance.now();
        if (this.firstRenderTime === void 0) this.firstRenderTime = q;
        this.lastRenderTime = q, this.frameDurations.push(A)
    }
    getMetrics() {
        if (this.frameDurations.length === 0 || this.firstRenderTime === void 0 || this.lastRenderTime === void 0) return;
        let A = this.lastRenderTime - this.firstRenderTime;
        if (A <= 0) return;
        let K = this.frameDurations.length / (A / 1000),
            Y = [...this.frameDurations].sort((O, $) => $ - O),
            z = Math.max(0, Math.ceil(Y.length * 0.01) - 1),
            _ = Y[z],
            w = _ > 0 ? 1000 / _ : 0;
        return {
            averageFps: Math.round(K * 100) / 100,
            low1PctFps: Math.round(w * 100) / 100
        }
    }
}
// @from(Ln 464399, Col 0)
function Ja8(A, q) {
    let K = q / 100 * (A.length - 1),
        Y = Math.floor(K),
        z = Math.ceil(K);
    if (Y === z) return A[Y];
    return A[Y] + (A[z] - A[Y]) * (K - Y)
}
// @from(Ln 464407, Col 0)
function Ma8() {
    let A = new Map,
        q = new Map,
        K = new Map;
    return {
        increment(Y, z = 1) {
            A.set(Y, (A.get(Y) ?? 0) + z)
        },
        set(Y, z) {
            A.set(Y, z)
        },
        observe(Y, z) {
            let _ = q.get(Y);
            if (!_) _ = {
                reservoir: [],
                count: 0,
                sum: 0,
                min: z,
                max: z
            }, q.set(Y, _);
            if (_.count++, _.sum += z, z < _.min) _.min = z;
            if (z > _.max) _.max = z;
            if (_.reservoir.length < mkq) _.reservoir.push(z);
            else {
                let w = Math.floor(Math.random() * _.count);
                if (w < mkq) _.reservoir[w] = z
            }
        },
        add(Y, z) {
            let _ = K.get(Y);
            if (!_) _ = new Set, K.set(Y, _);
            _.add(z)
        },
        getAll() {
            let Y = Object.fromEntries(A);
            for (let [z, _] of q) {
                if (_.count === 0) continue;
                Y[`${z}_count`] = _.count, Y[`${z}_min`] = _.min, Y[`${z}_max`] = _.max, Y[`${z}_avg`] = _.sum / _.count;
                let w = [..._.reservoir].sort((O, $) => O - $);
                Y[`${z}_p50`] = Ja8(w, 50), Y[`${z}_p95`] = Ja8(w, 95), Y[`${z}_p99`] = Ja8(w, 99)
            }
            for (let [z, _] of K) Y[z] = _.size;
            return Y
        }
    }
}
// @from(Ln 464454, Col 0)
function Bkq(A) {
    let q = A6(7),
        {
            store: K,
            children: Y
        } = A,
        z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = Ma8(), q[0] = z;
    else z = q[0];
    let w = K ?? z,
        O, $;
    if (q[1] !== w) O = () => {
        let j = () => {
            let J = w.getAll();
            if (Object.keys(J).length > 0) c2((M) => ({
                ...M,
                lastSessionMetrics: J
            }))
        };
        return process.on("exit", j), () => {
            process.off("exit", j)
        }
    }, $ = [w], q[1] = w, q[2] = O, q[3] = $;
    else O = q[2], $ = q[3];
    e_6.useEffect(O, $);
    let H;
    if (q[4] !== Y || q[5] !== w) H = e_6.default.createElement(QHz.Provider, {
        value: w
    }, Y), q[4] = Y, q[5] = w, q[6] = H;
    else H = q[6];
    return H
}
// @from(Ln 464486, Col 4)
e_6
// @from(Ln 464486, Col 9)
mkq = 1024
// @from(Ln 464487, Col 4)
QHz
// @from(Ln 464488, Col 4)
Da8 = E(() => {
    e6();
    k8();
    e_6 = t(P6(), 1);
    QHz = e_6.createContext(null)
})
// @from(Ln 464495, Col 0)
function UHz(A, q, K, Y) {
    var z = -1,
        _ = A == null ? 0 : A.length;
    while (++z < _) {
        var w = A[z];
        q(Y, w, K(w), A)
    }
    return Y
}
// @from(Ln 464504, Col 4)
gkq
// @from(Ln 464505, Col 4)
Fkq = E(() => {
    gkq = UHz
})
// @from(Ln 464509, Col 0)
function dHz(A, q, K, Y) {
    return WL1(A, function(z, _, w) {
        q(Y, z, K(z), w)
    }), Y
}
// @from(Ln 464514, Col 4)
pkq
// @from(Ln 464515, Col 4)
Qkq = E(() => {
    cU8();
    pkq = dHz
})
// @from(Ln 464520, Col 0)
function cHz(A, q) {
    return function(K, Y) {
        var z = q_(K) ? gkq : pkq,
            _ = q ? q() : {};
        return z(K, A, Ex(Y, 2), _)
    }
}
// @from(Ln 464527, Col 4)
Ukq
// @from(Ln 464528, Col 4)
dkq = E(() => {
    Fkq();
    Qkq();
    Sw6();
    qG();
    Ukq = cHz
})
// @from(Ln 464535, Col 4)
lHz
// @from(Ln 464535, Col 9)
ckq
// @from(Ln 464536, Col 4)
lkq = E(() => {
    dkq();
    lHz = Ukq(function(A, q, K) {
        A[K ? 0 : 1].push(q)
    }, function() {
        return [
            [],
            []
        ]
    }), ckq = lHz
})
// @from(Ln 464548, Col 0)
function yC1() {
    let A = A6(1),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = Xa8.default.createElement(T, null, "MCP servers may execute code or access system resources. All tool calls require approval. Learn more in the", " ", Xa8.default.createElement(y7, {
        url: "https://code.claude.com/docs/en/mcp"
    }, "MCP documentation"), "."), A[0] = q;
    else q = A[0];
    return q
}
// @from(Ln 464557, Col 4)
Xa8
// @from(Ln 464558, Col 4)
Pa8 = E(() => {
    e6();
    i6();
    i6();
    Xa8 = t(P6(), 1)
})
// @from(Ln 464565, Col 0)
function ikq(A) {
    let q = A6(20),
        {
            serverNames: K,
            onDone: Y
        } = A,
        z;
    if (q[0] !== Y || q[1] !== K) z = function(W) {
        let Z = PA() || {},
            G = Z.enabledMcpjsonServers || [],
            f = Z.disabledMcpjsonServers || [],
            [v, N] = ckq(K, (V) => W.includes(V));
        if (d("tengu_mcp_multidialog_choice", {
                approved: v.length,
                rejected: N.length
            }), v.length > 0) {
            let V = [...new Set([...G, ...v])];
            TA("localSettings", {
                enabledMcpjsonServers: V
            })
        }
        if (N.length > 0) {
            let V = [...new Set([...f, ...N])];
            TA("localSettings", {
                disabledMcpjsonServers: V
            })
        }
        Y()
    }, q[0] = Y, q[1] = K, q[2] = z;
    else z = q[2];
    let _ = z,
        w;
    if (q[3] !== Y || q[4] !== K) w = () => {
        let W = (PA() || {}).disabledMcpjsonServers || [],
            Z = [...new Set([...W, ...K])];
        TA("localSettings", {
            disabledMcpjsonServers: Z
        }), Y()
    }, q[3] = Y, q[4] = K, q[5] = w;
    else w = q[5];
    let O = w,
        $ = `${K.length} new MCP servers found in .mcp.json`,
        H;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) H = Fh.default.createElement(yC1, null), q[6] = H;
    else H = q[6];
    let j;
    if (q[7] !== K) j = K.map(iHz), q[7] = K, q[8] = j;
    else j = q[8];
    let J;
    if (q[9] !== _ || q[10] !== K || q[11] !== j) J = Fh.default.createElement(bv6, {
        options: j,
        defaultValue: K,
        onSubmit: _
    }), q[9] = _, q[10] = K, q[11] = j, q[12] = J;
    else J = q[12];
    let M;
    if (q[13] !== O || q[14] !== $ || q[15] !== J) M = Fh.default.createElement(m8, {
        title: $,
        subtitle: "Select any you wish to enable.",
        color: "warning",
        onCancel: O,
        hideInputGuide: !0
    }, H, J), q[13] = O, q[14] = $, q[15] = J, q[16] = M;
    else M = q[16];
    let D;
    if (q[17] === Symbol.for("react.memo_cache_sentinel")) D = Fh.default.createElement(m, {
        paddingX: 1
    }, Fh.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, Fh.default.createElement(C8, null, Fh.default.createElement(a1, {
        shortcut: "Space",
        action: "select"
    }), Fh.default.createElement(a1, {
        shortcut: "Enter",
        action: "confirm"
    }), Fh.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "reject all"
    })))), q[17] = D;
    else D = q[17];
    let X;
    if (q[18] !== M) X = Fh.default.createElement(Fh.default.Fragment, null, M, D), q[18] = M, q[19] = X;
    else X = q[19];
    return X
}
// @from(Ln 464654, Col 0)
function iHz(A) {
    return {
        label: A,
        value: A
    }
}
// @from(Ln 464660, Col 4)
Fh
// @from(Ln 464661, Col 4)
nkq = E(() => {
    e6();
    i6();
    KL1();
    i8();
    lkq();
    Pa8();
    V1();
    Lq();
    OK();
    Xq();
    wq();
    Fh = t(P6(), 1)
})
// @from(Ln 464676, Col 0)
function rkq(A) {
    let q = A6(13),
        {
            serverName: K,
            onDone: Y
        } = A,
        z;
    if (q[0] !== Y || q[1] !== K) z = function(D) {
        d("tengu_mcp_dialog_choice", {
            choice: D
        });
        A: switch (D) {
            case "yes":
            case "yes_all": {
                let P = (PA() || {}).enabledMcpjsonServers || [];
                if (!P.includes(K)) TA("localSettings", {
                    enabledMcpjsonServers: [...P, K]
                });
                if (D === "yes_all") TA("localSettings", {
                    enableAllProjectMcpServers: !0
                });
                Y();
                break A
            }
            case "no": {
                let P = (PA() || {}).disabledMcpjsonServers || [];
                if (!P.includes(K)) TA("localSettings", {
                    disabledMcpjsonServers: [...P, K]
                });
                Y()
            }
        }
    }, q[0] = Y, q[1] = K, q[2] = z;
    else z = q[2];
    let _ = z,
        w = `New MCP server found in .mcp.json: ${K}`,
        O;
    if (q[3] !== _) O = () => _("no"), q[3] = _, q[4] = O;
    else O = q[4];
    let $;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) $ = LC1.default.createElement(yC1, null), q[5] = $;
    else $ = q[5];
    let H;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) H = [{
        label: "Use this and all future MCP servers in this project",
        value: "yes_all"
    }, {
        label: "Use this MCP server",
        value: "yes"
    }, {
        label: "Continue without using this MCP server",
        value: "no"
    }], q[6] = H;
    else H = q[6];
    let j;
    if (q[7] !== _) j = LC1.default.createElement(T8, {
        options: H,
        onChange: (M) => _(M),
        onCancel: () => _("no")
    }), q[7] = _, q[8] = j;
    else j = q[8];
    let J;
    if (q[9] !== w || q[10] !== O || q[11] !== j) J = LC1.default.createElement(m8, {
        title: w,
        color: "warning",
        onCancel: O
    }, $, j), q[9] = w, q[10] = O, q[11] = j, q[12] = J;
    else J = q[12];
    return J
}
// @from(Ln 464746, Col 4)
LC1
// @from(Ln 464747, Col 4)
okq = E(() => {
    e6();
    o9();
    i8();
    Pa8();
    V1();
    wq();
    LC1 = t(P6(), 1)
})
// @from(Ln 464756, Col 0)
async function akq(A) {
    let {
        servers: q
    } = dj("project"), K = Object.keys(q).filter((Y) => fW1(Y) === "pending");
    if (K.length === 0) return;
    await new Promise((Y) => {
        let z = () => void Y();
        if (K.length === 1 && K[0] !== void 0) {
            let _ = K[0];
            A.render(A26.default.createElement(Yj, null, A26.default.createElement(aj, null, A26.default.createElement(rkq, {
                serverName: _,
                onDone: z
            }))))
        } else A.render(A26.default.createElement(Yj, null, A26.default.createElement(aj, null, A26.default.createElement(ikq, {
            serverNames: K,
            onDone: z
        }))))
    })
}
// @from(Ln 464775, Col 4)
A26
// @from(Ln 464776, Col 4)
skq = E(() => {
    nkq();
    okq();
    NA();
    WZ();
    qM();
    Mg();
    A26 = t(P6(), 1)
})
// @from(Ln 464788, Col 0)
async function tkq() {
    try {
        let A = await cQ();
        if (!A) {
            k("Not in a GitHub repository, skipping path mapping update");
            return
        }
        let q = AA(),
            Y = H_(q) ?? q,
            z;
        try {
            z = nHz(Y).normalize("NFC")
        } catch {
            z = Y
        }
        let _ = A.toLowerCase(),
            O = X1().githubRepoPaths?.[_] ?? [];
        if (O[0] === z) {
            k(`Path ${z} already tracked for repo ${_}`);
            return
        }
        let $ = O.filter((j) => j !== z),
            H = [z, ...$];
        d1((j) => ({
            ...j,
            githubRepoPaths: {
                ...j.githubRepoPaths,
                [_]: H
            }
        })), k(`Added ${z} to tracked paths for repo ${_}`)
    } catch (A) {
        k(`Error updating repo path mapping: ${A}`)
    }
}
// @from(Ln 464823, Col 0)
function ekq(A) {
    let q = X1(),
        K = A.toLowerCase();
    return q.githubRepoPaths?.[K] ?? []
}
// @from(Ln 464828, Col 0)
async function AEq(A) {
    let q = await Promise.all(A.map(uK));
    return A.filter((K, Y) => q[Y])
}
// @from(Ln 464832, Col 0)
async function qEq(A, q) {
    try {
        let K = await F31(A);
        if (!K) return !1;
        let Y = m46(K);
        if (!Y) return !1;
        return Y.toLowerCase() === q.toLowerCase()
    } catch {
        return !1
    }
}
// @from(Ln 464844, Col 0)
function KEq(A, q) {
    let K = X1(),
        Y = A.toLowerCase(),
        z = K.githubRepoPaths?.[Y] ?? [],
        _ = z.filter((O) => O !== q);
    if (_.length === z.length) return;
    let w = {
        ...K.githubRepoPaths
    };
    if (_.length === 0) delete w[Y];
    else w[Y] = _;
    d1((O) => ({
        ...O,
        githubRepoPaths: w
    })), k(`Removed ${q} from tracked paths for repo ${Y}`)
}
// @from(Ln 464860, Col 4)
RC1 = E(() => {
    Z7();
    yG();
    k8();
    T1();
    H1();
    yo();
    $5()
})
// @from(Ln 464870, Col 0)
function hC1(A) {
    let q = A6(7),
        {
            children: K
        } = A,
        {
            marker: Y
        } = w86.useContext(rHz),
        z;
    if (q[0] !== Y) z = w86.default.createElement(T, {
        dimColor: !0
    }, Y), q[0] = Y, q[1] = z;
    else z = q[1];
    let _;
    if (q[2] !== K) _ = w86.default.createElement(m, {
        flexDirection: "column"
    }, K), q[2] = K, q[3] = _;
    else _ = q[3];
    let w;
    if (q[4] !== z || q[5] !== _) w = w86.default.createElement(m, {
        gap: 1
    }, z, _), q[4] = z, q[5] = _, q[6] = w;
    else w = q[6];
    return w
}
// @from(Ln 464895, Col 4)
w86
// @from(Ln 464895, Col 9)
rHz
// @from(Ln 464896, Col 4)
YEq = E(() => {
    e6();
    i6();
    w86 = t(P6(), 1), rHz = w86.createContext({
        marker: ""
    })
})
// @from(Ln 464904, Col 0)
function _Eq(A) {
    let q = A6(9),
        {
            children: K
        } = A,
        {
            marker: Y
        } = FN.useContext(zEq),
        z = 0;
    for (let $ of FN.default.Children.toArray(K)) {
        if (!FN.isValidElement($) || $.type !== hC1) continue;
        z++
    }
    let _ = String(z).length,
        w;
    if (q[0] !== K || q[1] !== _ || q[2] !== Y) {
        let $;
        if (q[4] !== _ || q[5] !== Y) $ = (H, j) => {
            if (!FN.isValidElement(H) || H.type !== hC1) return H;
            let J = `${String(j+1).padStart(_)}.`,
                M = `${Y}${J}`;
            return FN.default.createElement(zEq.Provider, {
                value: {
                    marker: M
                }
            }, FN.default.createElement(oHz.Provider, {
                value: {
                    marker: M
                }
            }, H))
        }, q[4] = _, q[5] = Y, q[6] = $;
        else $ = q[6];
        w = FN.default.Children.map(K, $), q[0] = K, q[1] = _, q[2] = Y, q[3] = w
    } else w = q[3];
    let O;
    if (q[7] !== w) O = FN.default.createElement(m, {
        flexDirection: "column"
    }, w), q[7] = w, q[8] = O;
    else O = q[8];
    return O
}
// @from(Ln 464945, Col 4)
FN
// @from(Ln 464945, Col 8)
zEq
// @from(Ln 464945, Col 13)
oHz
// @from(Ln 464945, Col 18)
SC1
// @from(Ln 464946, Col 4)
wEq = E(() => {
    e6();
    i6();
    YEq();
    FN = t(P6(), 1), zEq = FN.createContext({
        marker: ""
    }), oHz = FN.createContext({
        marker: ""
    });
    _Eq.Item = hC1;
    SC1 = _Eq
})
// @from(Ln 464958, Col 4)
OEq = {}
// @from(Ln 464963, Col 0)
function Wa8(A) {
    let q = A6(17),
        {
            customApiKeyTruncated: K,
            onDone: Y
        } = A,
        z;
    if (q[0] !== K || q[1] !== Y) z = function(P) {
        A: switch (P) {
            case "yes": {
                d1((W) => ({
                    ...W,
                    customApiKeyResponses: {
                        ...W.customApiKeyResponses,
                        approved: [...W.customApiKeyResponses?.approved ?? [], K]
                    }
                })), Y();
                break A
            }
            case "no":
                d1((W) => ({
                    ...W,
                    customApiKeyResponses: {
                        ...W.customApiKeyResponses,
                        rejected: [...W.customApiKeyResponses?.rejected ?? [], K]
                    }
                })), Y()
        }
    }, q[0] = K, q[1] = Y, q[2] = z;
    else z = q[2];
    let _ = z,
        w;
    if (q[3] !== _) w = () => _("no"), q[3] = _, q[4] = w;
    else w = q[4];
    let O;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) O = xi.default.createElement(T, {
        bold: !0
    }, "ANTHROPIC_API_KEY"), q[5] = O;
    else O = q[5];
    let $;
    if (q[6] !== K) $ = xi.default.createElement(T, null, O, xi.default.createElement(T, null, ": sk-ant-...", K)), q[6] = K, q[7] = $;
    else $ = q[7];
    let H;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) H = xi.default.createElement(T, null, "Do you want to use this API key?"), q[8] = H;
    else H = q[8];
    let j;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) j = {
        label: "Yes",
        value: "yes"
    }, q[9] = j;
    else j = q[9];
    let J;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) J = [j, {
        label: xi.default.createElement(T, null, "No (", xi.default.createElement(T, {
            bold: !0
        }, "recommended"), ")"),
        value: "no"
    }], q[10] = J;
    else J = q[10];
    let M;
    if (q[11] !== _) M = xi.default.createElement(T8, {
        defaultValue: "no",
        defaultFocusValue: "no",
        options: J,
        onChange: (X) => _(X),
        onCancel: () => _("no")
    }), q[11] = _, q[12] = M;
    else M = q[12];
    let D;
    if (q[13] !== w || q[14] !== $ || q[15] !== M) D = xi.default.createElement(m8, {
        title: "Detected a custom API key in your environment",
        color: "warning",
        onCancel: w
    }, $, H, M), q[13] = w, q[14] = $, q[15] = M, q[16] = D;
    else D = q[16];
    return D
}
// @from(Ln 465040, Col 4)
xi
// @from(Ln 465041, Col 4)
Za8 = E(() => {
    e6();
    i6();
    k8();
    o9();
    wq();
    xi = t(P6(), 1)
})
// @from(Ln 465050, Col 0)
function $Eq(A, q) {
    let [K, Y] = CC1.useState(!1);
    return CC1.useEffect(() => {
        Y(!1);
        let z = setTimeout(Y, A, !0);
        return () => clearTimeout(z)
    }, [A, q]), K
}
// @from(Ln 465058, Col 4)
CC1
// @from(Ln 465059, Col 4)
HEq = E(() => {
    CC1 = t(P6(), 1)
})
// @from(Ln 465062, Col 0)
async function aHz() {
    try {
        let A = P7(),
            q = new URL(A.TOKEN_URL),
            K = [`${A.BASE_API_URL}/api/hello`, `${q.origin}/v1/oauth/hello`],
            Y = async (w) => {
                try {
                    let O = await X8.get(w, {
                        headers: {
                            "User-Agent": Gy()
                        }
                    });
                    if (O.status !== 200) return {
                        success: !1,
                        error: `Failed to connect to ${new URL(w).hostname}: Status ${O.status}`
                    };
                    return {
                        success: !0
                    }
                } catch (O) {
                    let $ = new URL(w).hostname,
                        H = kt(O);
                    return {
                        success: !1,
                        error: `Failed to connect to ${$}: ${O instanceof Error?O.code||O.message:String(O)}`,
                        sslHint: H ?? void 0
                    }
                }
            }, _ = (await Promise.all(K.map(Y))).find((w) => !w.success);
        if (_) d("tengu_preflight_check_failed", {
            isConnectivityError: !1,
            hasErrorMessage: !!_.error,
            isSSLError: !!_.sslHint
        });
        return _ || {
            success: !0
        }
    } catch (A) {
        return _6(A), d("tengu_preflight_check_failed", {
            isConnectivityError: !0
        }), {
            success: !1,
            error: `Connectivity check error: ${A instanceof Error?A.code||A.message:String(A)}`
        }
    }
}