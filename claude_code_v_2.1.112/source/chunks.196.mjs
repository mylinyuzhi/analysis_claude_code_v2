
// @from(Ln 509290, Col 0)
function D1A(q) {
    let K = () => {};
    return {
        printBanner: (_, z) => q(`registered environmentId=${z} dir=${_.dir} spawnMode=${_.spawnMode} capacity=${_.maxSessions}`),
        logSessionStart: (_, z) => q(`session start ${_}`),
        logSessionComplete: (_, z) => q(`session complete ${_} (${z}ms)`),
        logSessionFailed: (_, z) => q(`session failed ${_}: ${z}`),
        logStatus: q,
        logVerbose: q,
        logError: (_) => q(`error: ${_}`),
        logReconnected: (_) => q(`reconnected after ${_}ms`),
        addSession: (_, z) => q(`session attached ${_}`),
        removeSession: (_) => q(`session detached ${_}`),
        updateIdleStatus: K,
        updateReconnectingStatus: K,
        updateSessionStatus: K,
        updateSessionActivity: K,
        updateSessionCount: K,
        updateFailedStatus: K,
        setSpawnModeDisplay: K,
        setRepoInfo: K,
        setDebugLogPath: K,
        setAttached: K,
        setSessionTitle: K,
        clearStatus: K,
        toggleQr: K,
        refreshDisplay: K
    }
}
// @from(Ln 509319, Col 4)
z1A
// @from(Ln 509319, Col 9)
Y1A = 1000
// @from(Ln 509320, Col 4)
S15 = 32
// @from(Ln 509321, Col 4)
O1A
// @from(Ln 509321, Col 9)
w1A
// @from(Ln 509321, Col 14)
J1A = 80
// @from(Ln 509322, Col 4)
Sz8
// @from(Ln 509323, Col 4)
cJ7 = L(() => {
    J$6();
    BB();
    B1();
    C8();
    Na8();
    K8();
    VA();
    Q8();
    m8();
    c7();
    U8();
    cW();
    S88();
    tD();
    Lj7();
    qn();
    $96();
    j15();
    Qe();
    ya8();
    CJ7();
    Z15();
    kJ6();
    Ra8();
    z1A = {
        connInitialMs: 2000,
        connCapMs: 120000,
        connGiveUpMs: 600000,
        generalInitialMs: 500,
        generalCapMs: 30000,
        generalGiveUpMs: 600000
    };
    O1A = new Set(["ECONNREFUSED", "ECONNRESET", "ETIMEDOUT", "ENETUNREACH", "EHOSTUNREACH"]);
    w1A = ["session", "same-dir", "worktree"];
    Sz8 = class Sz8 extends Error {
        constructor(q) {
            super(q);
            this.name = "BridgeHeadlessPermanentError"
        }
    }
})
// @from(Ln 509365, Col 4)
Cz8 = p((Z1A) => {
    class lJ7 extends Error {
        constructor(q, K, _) {
            super(_);
            Error.captureStackTrace(this, this.constructor), this.name = this.constructor.name, this.code = K, this.exitCode = q, this.nestedError = void 0
        }
    }
    class m15 extends lJ7 {
        constructor(q) {
            super(1, "commander.invalidArgument", q);
            Error.captureStackTrace(this, this.constructor), this.name = this.constructor.name
        }
    }
    Z1A.CommanderError = lJ7;
    Z1A.InvalidArgumentError = m15
})
// @from(Ln 509381, Col 4)
ua8 = p((V1A) => {
    var {
        InvalidArgumentError: v1A
    } = Cz8();
    class B15 {
        constructor(q, K) {
            switch (this.description = K || "", this.variadic = !1, this.parseArg = void 0, this.defaultValue = void 0, this.defaultValueDescription = void 0, this.argChoices = void 0, q[0]) {
                case "<":
                    this.required = !0, this._name = q.slice(1, -1);
                    break;
                case "[":
                    this.required = !1, this._name = q.slice(1, -1);
                    break;
                default:
                    this.required = !0, this._name = q;
                    break
            }
            if (this._name.length > 3 && this._name.slice(-3) === "...") this.variadic = !0, this._name = this._name.slice(0, -3)
        }
        name() {
            return this._name
        }
        _concatValue(q, K) {
            if (K === this.defaultValue || !Array.isArray(K)) return [q];
            return K.concat(q)
        }
        default (q, K) {
            return this.defaultValue = q, this.defaultValueDescription = K, this
        }
        argParser(q) {
            return this.parseArg = q, this
        }
        choices(q) {
            return this.argChoices = q.slice(), this.parseArg = (K, _) => {
                if (!this.argChoices.includes(K)) throw new v1A(`Allowed choices are ${this.argChoices.join(", ")}.`);
                if (this.variadic) return this._concatValue(K, _);
                return K
            }, this
        }
        argRequired() {
            return this.required = !0, this
        }
        argOptional() {
            return this.required = !1, this
        }
    }

    function T1A(q) {
        let K = q.name() + (q.variadic === !0 ? "..." : "");
        return q.required ? "<" + K + ">" : "[" + K + "]"
    }
    V1A.Argument = B15;
    V1A.humanReadableArgName = T1A
})
// @from(Ln 509435, Col 4)
nJ7 = p((y1A) => {
    var {
        humanReadableArgName: E1A
    } = ua8();
    class p15 {
        constructor() {
            this.helpWidth = void 0, this.sortSubcommands = !1, this.sortOptions = !1, this.showGlobalOptions = !1
        }
        visibleCommands(q) {
            let K = q.commands.filter((z) => !z._hidden),
                _ = q._getHelpCommand();
            if (_ && !_._hidden) K.push(_);
            if (this.sortSubcommands) K.sort((z, Y) => {
                return z.name().localeCompare(Y.name())
            });
            return K
        }
        compareOptions(q, K) {
            let _ = (z) => {
                return z.short ? z.short.replace(/^-/, "") : z.long.replace(/^--/, "")
            };
            return _(q).localeCompare(_(K))
        }
        visibleOptions(q) {
            let K = q.options.filter((z) => !z.hidden),
                _ = q._getHelpOption();
            if (_ && !_.hidden) {
                let z = _.short && q._findOption(_.short),
                    Y = _.long && q._findOption(_.long);
                if (!z && !Y) K.push(_);
                else if (_.long && !Y) K.push(q.createOption(_.long, _.description));
                else if (_.short && !z) K.push(q.createOption(_.short, _.description))
            }
            if (this.sortOptions) K.sort(this.compareOptions);
            return K
        }
        visibleGlobalOptions(q) {
            if (!this.showGlobalOptions) return [];
            let K = [];
            for (let _ = q.parent; _; _ = _.parent) {
                let z = _.options.filter((Y) => !Y.hidden);
                K.push(...z)
            }
            if (this.sortOptions) K.sort(this.compareOptions);
            return K
        }
        visibleArguments(q) {
            if (q._argsDescription) q.registeredArguments.forEach((K) => {
                K.description = K.description || q._argsDescription[K.name()] || ""
            });
            if (q.registeredArguments.find((K) => K.description)) return q.registeredArguments;
            return []
        }
        subcommandTerm(q) {
            let K = q.registeredArguments.map((_) => E1A(_)).join(" ");
            return q._name + (q._aliases[0] ? "|" + q._aliases[0] : "") + (q.options.length ? " [options]" : "") + (K ? " " + K : "")
        }
        optionTerm(q) {
            return q.flags
        }
        argumentTerm(q) {
            return q.name()
        }
        longestSubcommandTermLength(q, K) {
            return K.visibleCommands(q).reduce((_, z) => {
                return Math.max(_, K.subcommandTerm(z).length)
            }, 0)
        }
        longestOptionTermLength(q, K) {
            return K.visibleOptions(q).reduce((_, z) => {
                return Math.max(_, K.optionTerm(z).length)
            }, 0)
        }
        longestGlobalOptionTermLength(q, K) {
            return K.visibleGlobalOptions(q).reduce((_, z) => {
                return Math.max(_, K.optionTerm(z).length)
            }, 0)
        }
        longestArgumentTermLength(q, K) {
            return K.visibleArguments(q).reduce((_, z) => {
                return Math.max(_, K.argumentTerm(z).length)
            }, 0)
        }
        commandUsage(q) {
            let K = q._name;
            if (q._aliases[0]) K = K + "|" + q._aliases[0];
            let _ = "";
            for (let z = q.parent; z; z = z.parent) _ = z.name() + " " + _;
            return _ + K + " " + q.usage()
        }
        commandDescription(q) {
            return q.description()
        }
        subcommandDescription(q) {
            return q.summary() || q.description()
        }
        optionDescription(q) {
            let K = [];
            if (q.argChoices) K.push(`choices: ${q.argChoices.map((_)=>JSON.stringify(_)).join(", ")}`);
            if (q.defaultValue !== void 0) {
                if (q.required || q.optional || q.isBoolean() && typeof q.defaultValue === "boolean") K.push(`default: ${q.defaultValueDescription||JSON.stringify(q.defaultValue)}`)
            }
            if (q.presetArg !== void 0 && q.optional) K.push(`preset: ${JSON.stringify(q.presetArg)}`);
            if (q.envVar !== void 0) K.push(`env: ${q.envVar}`);
            if (K.length > 0) return `${q.description} (${K.join(", ")})`;
            return q.description
        }
        argumentDescription(q) {
            let K = [];
            if (q.argChoices) K.push(`choices: ${q.argChoices.map((_)=>JSON.stringify(_)).join(", ")}`);
            if (q.defaultValue !== void 0) K.push(`default: ${q.defaultValueDescription||JSON.stringify(q.defaultValue)}`);
            if (K.length > 0) {
                let _ = `(${K.join(", ")})`;
                if (q.description) return `${q.description} ${_}`;
                return _
            }
            return q.description
        }
        formatHelp(q, K) {
            let _ = K.padWidth(q, K),
                z = K.helpWidth || 80,
                Y = 2,
                A = 2;

            function O(M, P) {
                if (P) {
                    let W = `${M.padEnd(_+2)}${P}`;
                    return K.wrap(W, z - 2, _ + 2)
                }
                return M
            }

            function w(M) {
                return M.join(`
`).replace(/^/gm, " ".repeat(2))
            }
            let $ = [`Usage: ${K.commandUsage(q)}`, ""],
                j = K.commandDescription(q);
            if (j.length > 0) $ = $.concat([K.wrap(j, z, 0), ""]);
            let H = K.visibleArguments(q).map((M) => {
                return O(K.argumentTerm(M), K.argumentDescription(M))
            });
            if (H.length > 0) $ = $.concat(["Arguments:", w(H), ""]);
            let J = K.visibleOptions(q).map((M) => {
                return O(K.optionTerm(M), K.optionDescription(M))
            });
            if (J.length > 0) $ = $.concat(["Options:", w(J), ""]);
            if (this.showGlobalOptions) {
                let M = K.visibleGlobalOptions(q).map((P) => {
                    return O(K.optionTerm(P), K.optionDescription(P))
                });
                if (M.length > 0) $ = $.concat(["Global Options:", w(M), ""])
            }
            let X = K.visibleCommands(q).map((M) => {
                return O(K.subcommandTerm(M), K.subcommandDescription(M))
            });
            if (X.length > 0) $ = $.concat(["Commands:", w(X), ""]);
            return $.join(`
`)
        }
        padWidth(q, K) {
            return Math.max(K.longestOptionTermLength(q, K), K.longestGlobalOptionTermLength(q, K), K.longestSubcommandTermLength(q, K), K.longestArgumentTermLength(q, K))
        }
        wrap(q, K, _, z = 40) {
            let A = new RegExp(`[\\n][${" \\f\\t\\v   -   　\uFEFF"}]+`);
            if (q.match(A)) return q;
            let O = K - _;
            if (O < z) return q;
            let w = q.slice(0, _),
                $ = q.slice(_).replace(`\r
`, `
`),
                j = " ".repeat(_),
                J = `\\s${"​"}`,
                X = new RegExp(`
|.{1,${O-1}}([${J}]|$)|[^${J}]+?([${J}]|$)`, "g"),
                M = $.match(X) || [];
            return w + M.map((P, W) => {
                if (P === `
`) return "";
                return (W > 0 ? j : "") + P.trimEnd()
            }).join(`
`)
        }
    }
    y1A.Help = p15
})
// @from(Ln 509622, Col 4)
iJ7 = p((C1A) => {
    var {
        InvalidArgumentError: h1A
    } = Cz8();
    class F15 {
        constructor(q, K) {
            this.flags = q, this.description = K || "", this.required = q.includes("<"), this.optional = q.includes("["), this.variadic = /\w\.\.\.[>\]]$/.test(q), this.mandatory = !1;
            let _ = S1A(q);
            if (this.short = _.shortFlag, this.long = _.longFlag, this.negate = !1, this.long) this.negate = this.long.startsWith("--no-");
            this.defaultValue = void 0, this.defaultValueDescription = void 0, this.presetArg = void 0, this.envVar = void 0, this.parseArg = void 0, this.hidden = !1, this.argChoices = void 0, this.conflictsWith = [], this.implied = void 0
        }
        default (q, K) {
            return this.defaultValue = q, this.defaultValueDescription = K, this
        }
        preset(q) {
            return this.presetArg = q, this
        }
        conflicts(q) {
            return this.conflictsWith = this.conflictsWith.concat(q), this
        }
        implies(q) {
            let K = q;
            if (typeof q === "string") K = {
                [q]: !0
            };
            return this.implied = Object.assign(this.implied || {}, K), this
        }
        env(q) {
            return this.envVar = q, this
        }
        argParser(q) {
            return this.parseArg = q, this
        }
        makeOptionMandatory(q = !0) {
            return this.mandatory = !!q, this
        }
        hideHelp(q = !0) {
            return this.hidden = !!q, this
        }
        _concatValue(q, K) {
            if (K === this.defaultValue || !Array.isArray(K)) return [q];
            return K.concat(q)
        }
        choices(q) {
            return this.argChoices = q.slice(), this.parseArg = (K, _) => {
                if (!this.argChoices.includes(K)) throw new h1A(`Allowed choices are ${this.argChoices.join(", ")}.`);
                if (this.variadic) return this._concatValue(K, _);
                return K
            }, this
        }
        name() {
            if (this.long) return this.long.replace(/^--/, "");
            return this.short.replace(/^-/, "")
        }
        attributeName() {
            return R1A(this.name().replace(/^no-/, ""))
        }
        is(q) {
            return this.short === q || this.long === q
        }
        isBoolean() {
            return !this.required && !this.optional && !this.negate
        }
    }
    class g15 {
        constructor(q) {
            this.positiveOptions = new Map, this.negativeOptions = new Map, this.dualOptions = new Set, q.forEach((K) => {
                if (K.negate) this.negativeOptions.set(K.attributeName(), K);
                else this.positiveOptions.set(K.attributeName(), K)
            }), this.negativeOptions.forEach((K, _) => {
                if (this.positiveOptions.has(_)) this.dualOptions.add(_)
            })
        }
        valueFromOption(q, K) {
            let _ = K.attributeName();
            if (!this.dualOptions.has(_)) return !0;
            let z = this.negativeOptions.get(_).presetArg,
                Y = z !== void 0 ? z : !1;
            return K.negate === (Y === q)
        }
    }

    function R1A(q) {
        return q.split("-").reduce((K, _) => {
            return K + _[0].toUpperCase() + _.slice(1)
        })
    }

    function S1A(q) {
        let K, _, z = q.split(/[ |,]+/);
        if (z.length > 1 && !/^[[<]/.test(z[1])) K = z.shift();
        if (_ = z.shift(), !K && /^-[^-]$/.test(_)) K = _, _ = void 0;
        return {
            shortFlag: K,
            longFlag: _
        }
    }
    C1A.Option = F15;
    C1A.DualOptions = g15
})
// @from(Ln 509722, Col 4)
U15 = p((m1A) => {
    function x1A(q, K) {
        if (Math.abs(q.length - K.length) > 3) return Math.max(q.length, K.length);
        let _ = [];
        for (let z = 0; z <= q.length; z++) _[z] = [z];
        for (let z = 0; z <= K.length; z++) _[0][z] = z;
        for (let z = 1; z <= K.length; z++)
            for (let Y = 1; Y <= q.length; Y++) {
                let A = 1;
                if (q[Y - 1] === K[z - 1]) A = 0;
                else A = 1;
                if (_[Y][z] = Math.min(_[Y - 1][z] + 1, _[Y][z - 1] + 1, _[Y - 1][z - 1] + A), Y > 1 && z > 1 && q[Y - 1] === K[z - 2] && q[Y - 2] === K[z - 1]) _[Y][z] = Math.min(_[Y][z], _[Y - 2][z - 2] + 1)
            }
        return _[q.length][K.length]
    }

    function u1A(q, K) {
        if (!K || K.length === 0) return "";
        K = Array.from(new Set(K));
        let _ = q.startsWith("--");
        if (_) q = q.slice(2), K = K.map((O) => O.slice(2));
        let z = [],
            Y = 3,
            A = 0.4;
        if (K.forEach((O) => {
                if (O.length <= 1) return;
                let w = x1A(q, O),
                    $ = Math.max(q.length, O.length);
                if (($ - w) / $ > A) {
                    if (w < Y) Y = w, z = [O];
                    else if (w === Y) z.push(O)
                }
            }), z.sort((O, w) => O.localeCompare(w)), _) z = z.map((O) => `--${O}`);
        if (z.length > 1) return `
(Did you mean one of ${z.join(", ")}?)`;
        if (z.length === 1) return `
(Did you mean ${z[0]}?)`;
        return ""
    }
    m1A.suggestSimilar = u1A
})
// @from(Ln 509763, Col 4)
l15 = p((d1A) => {
    var p1A = d6("node:events").EventEmitter,
        rJ7 = d6("node:child_process"),
        v66 = d6("node:path"),
        oJ7 = d6("node:fs"),
        pX = d6("node:process"),
        {
            Argument: F1A,
            humanReadableArgName: g1A
        } = ua8(),
        {
            CommanderError: aJ7
        } = Cz8(),
        {
            Help: U1A
        } = nJ7(),
        {
            Option: Q15,
            DualOptions: Q1A
        } = iJ7(),
        {
            suggestSimilar: d15
        } = U15();
    class sJ7 extends p1A {
        constructor(q) {
            super();
            this.commands = [], this.options = [], this.parent = null, this._allowUnknownOption = !1, this._allowExcessArguments = !0, this.registeredArguments = [], this._args = this.registeredArguments, this.args = [], this.rawArgs = [], this.processedArgs = [], this._scriptPath = null, this._name = q || "", this._optionValues = {}, this._optionValueSources = {}, this._storeOptionsAsProperties = !1, this._actionHandler = null, this._executableHandler = !1, this._executableFile = null, this._executableDir = null, this._defaultCommandName = null, this._exitCallback = null, this._aliases = [], this._combineFlagAndOptionalValue = !0, this._description = "", this._summary = "", this._argsDescription = void 0, this._enablePositionalOptions = !1, this._passThroughOptions = !1, this._lifeCycleHooks = {}, this._showHelpAfterError = !1, this._showSuggestionAfterError = !0, this._outputConfiguration = {
                writeOut: (K) => pX.stdout.write(K),
                writeErr: (K) => pX.stderr.write(K),
                getOutHelpWidth: () => pX.stdout.isTTY ? pX.stdout.columns : void 0,
                getErrHelpWidth: () => pX.stderr.isTTY ? pX.stderr.columns : void 0,
                outputError: (K, _) => _(K)
            }, this._hidden = !1, this._helpOption = void 0, this._addImplicitHelpCommand = void 0, this._helpCommand = void 0, this._helpConfiguration = {}
        }
        copyInheritedSettings(q) {
            return this._outputConfiguration = q._outputConfiguration, this._helpOption = q._helpOption, this._helpCommand = q._helpCommand, this._helpConfiguration = q._helpConfiguration, this._exitCallback = q._exitCallback, this._storeOptionsAsProperties = q._storeOptionsAsProperties, this._combineFlagAndOptionalValue = q._combineFlagAndOptionalValue, this._allowExcessArguments = q._allowExcessArguments, this._enablePositionalOptions = q._enablePositionalOptions, this._showHelpAfterError = q._showHelpAfterError, this._showSuggestionAfterError = q._showSuggestionAfterError, this
        }
        _getCommandAndAncestors() {
            let q = [];
            for (let K = this; K; K = K.parent) q.push(K);
            return q
        }
        command(q, K, _) {
            let z = K,
                Y = _;
            if (typeof z === "object" && z !== null) Y = z, z = null;
            Y = Y || {};
            let [, A, O] = q.match(/([^ ]+) *(.*)/), w = this.createCommand(A);
            if (z) w.description(z), w._executableHandler = !0;
            if (Y.isDefault) this._defaultCommandName = w._name;
            if (w._hidden = !!(Y.noHelp || Y.hidden), w._executableFile = Y.executableFile || null, O) w.arguments(O);
            if (this._registerCommand(w), w.parent = this, w.copyInheritedSettings(this), z) return this;
            return w
        }
        createCommand(q) {
            return new sJ7(q)
        }
        createHelp() {
            return Object.assign(new U1A, this.configureHelp())
        }
        configureHelp(q) {
            if (q === void 0) return this._helpConfiguration;
            return this._helpConfiguration = q, this
        }
        configureOutput(q) {
            if (q === void 0) return this._outputConfiguration;
            return Object.assign(this._outputConfiguration, q), this
        }
        showHelpAfterError(q = !0) {
            if (typeof q !== "string") q = !!q;
            return this._showHelpAfterError = q, this
        }
        showSuggestionAfterError(q = !0) {
            return this._showSuggestionAfterError = !!q, this
        }
        addCommand(q, K) {
            if (!q._name) throw Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
            if (K = K || {}, K.isDefault) this._defaultCommandName = q._name;
            if (K.noHelp || K.hidden) q._hidden = !0;
            return this._registerCommand(q), q.parent = this, q._checkForBrokenPassThrough(), this
        }
        createArgument(q, K) {
            return new F1A(q, K)
        }
        argument(q, K, _, z) {
            let Y = this.createArgument(q, K);
            if (typeof _ === "function") Y.default(z).argParser(_);
            else Y.default(_);
            return this.addArgument(Y), this
        }
        arguments(q) {
            return q.trim().split(/ +/).forEach((K) => {
                this.argument(K)
            }), this
        }
        addArgument(q) {
            let K = this.registeredArguments.slice(-1)[0];
            if (K && K.variadic) throw Error(`only the last argument can be variadic '${K.name()}'`);
            if (q.required && q.defaultValue !== void 0 && q.parseArg === void 0) throw Error(`a default value for a required argument is never used: '${q.name()}'`);
            return this.registeredArguments.push(q), this
        }
        helpCommand(q, K) {
            if (typeof q === "boolean") return this._addImplicitHelpCommand = q, this;
            q = q ?? "help [command]";
            let [, _, z] = q.match(/([^ ]+) *(.*)/), Y = K ?? "display help for command", A = this.createCommand(_);
            if (A.helpOption(!1), z) A.arguments(z);
            if (Y) A.description(Y);
            return this._addImplicitHelpCommand = !0, this._helpCommand = A, this
        }
        addHelpCommand(q, K) {
            if (typeof q !== "object") return this.helpCommand(q, K), this;
            return this._addImplicitHelpCommand = !0, this._helpCommand = q, this
        }
        _getHelpCommand() {
            if (this._addImplicitHelpCommand ?? (this.commands.length && !this._actionHandler && !this._findCommand("help"))) {
                if (this._helpCommand === void 0) this.helpCommand(void 0, void 0);
                return this._helpCommand
            }
            return null
        }
        hook(q, K) {
            let _ = ["preSubcommand", "preAction", "postAction"];
            if (!_.includes(q)) throw Error(`Unexpected value for event passed to hook : '${q}'.
Expecting one of '${_.join("', '")}'`);
            if (this._lifeCycleHooks[q]) this._lifeCycleHooks[q].push(K);
            else this._lifeCycleHooks[q] = [K];
            return this
        }
        exitOverride(q) {
            if (q) this._exitCallback = q;
            else this._exitCallback = (K) => {
                if (K.code !== "commander.executeSubCommandAsync") throw K
            };
            return this
        }
        _exit(q, K, _) {
            if (this._exitCallback) this._exitCallback(new aJ7(q, K, _));
            pX.exit(q)
        }
        action(q) {
            let K = (_) => {
                let z = this.registeredArguments.length,
                    Y = _.slice(0, z);
                if (this._storeOptionsAsProperties) Y[z] = this;
                else Y[z] = this.opts();
                return Y.push(this), q.apply(this, Y)
            };
            return this._actionHandler = K, this
        }
        createOption(q, K) {
            return new Q15(q, K)
        }
        _callParseArg(q, K, _, z) {
            try {
                return q.parseArg(K, _)
            } catch (Y) {
                if (Y.code === "commander.invalidArgument") {
                    let A = `${z} ${Y.message}`;
                    this.error(A, {
                        exitCode: Y.exitCode,
                        code: Y.code
                    })
                }
                throw Y
            }
        }
        _registerOption(q) {
            let K = q.short && this._findOption(q.short) || q.long && this._findOption(q.long);
            if (K) {
                let _ = q.long && this._findOption(q.long) ? q.long : q.short;
                throw Error(`Cannot add option '${q.flags}'${this._name&&` to command '${this._name}'`} due to conflicting flag '${_}'
-  already used by option '${K.flags}'`)
            }
            this.options.push(q)
        }
        _registerCommand(q) {
            let K = (z) => {
                    return [z.name()].concat(z.aliases())
                },
                _ = K(q).find((z) => this._findCommand(z));
            if (_) {
                let z = K(this._findCommand(_)).join("|"),
                    Y = K(q).join("|");
                throw Error(`cannot add command '${Y}' as already have command '${z}'`)
            }
            this.commands.push(q)
        }
        addOption(q) {
            this._registerOption(q);
            let K = q.name(),
                _ = q.attributeName();
            if (q.negate) {
                let Y = q.long.replace(/^--no-/, "--");
                if (!this._findOption(Y)) this.setOptionValueWithSource(_, q.defaultValue === void 0 ? !0 : q.defaultValue, "default")
            } else if (q.defaultValue !== void 0) this.setOptionValueWithSource(_, q.defaultValue, "default");
            let z = (Y, A, O) => {
                if (Y == null && q.presetArg !== void 0) Y = q.presetArg;
                let w = this.getOptionValue(_);
                if (Y !== null && q.parseArg) Y = this._callParseArg(q, Y, w, A);
                else if (Y !== null && q.variadic) Y = q._concatValue(Y, w);
                if (Y == null)
                    if (q.negate) Y = !1;
                    else if (q.isBoolean() || q.optional) Y = !0;
                else Y = "";
                this.setOptionValueWithSource(_, Y, O)
            };
            if (this.on("option:" + K, (Y) => {
                    let A = `error: option '${q.flags}' argument '${Y}' is invalid.`;
                    z(Y, A, "cli")
                }), q.envVar) this.on("optionEnv:" + K, (Y) => {
                let A = `error: option '${q.flags}' value '${Y}' from env '${q.envVar}' is invalid.`;
                z(Y, A, "env")
            });
            return this
        }
        _optionEx(q, K, _, z, Y) {
            if (typeof K === "object" && K instanceof Q15) throw Error("To add an Option object use addOption() instead of option() or requiredOption()");
            let A = this.createOption(K, _);
            if (A.makeOptionMandatory(!!q.mandatory), typeof z === "function") A.default(Y).argParser(z);
            else if (z instanceof RegExp) {
                let O = z;
                z = (w, $) => {
                    let j = O.exec(w);
                    return j ? j[0] : $
                }, A.default(Y).argParser(z)
            } else A.default(z);
            return this.addOption(A)
        }
        option(q, K, _, z) {
            return this._optionEx({}, q, K, _, z)
        }
        requiredOption(q, K, _, z) {
            return this._optionEx({
                mandatory: !0
            }, q, K, _, z)
        }
        combineFlagAndOptionalValue(q = !0) {
            return this._combineFlagAndOptionalValue = !!q, this
        }
        allowUnknownOption(q = !0) {
            return this._allowUnknownOption = !!q, this
        }
        allowExcessArguments(q = !0) {
            return this._allowExcessArguments = !!q, this
        }
        enablePositionalOptions(q = !0) {
            return this._enablePositionalOptions = !!q, this
        }
        passThroughOptions(q = !0) {
            return this._passThroughOptions = !!q, this._checkForBrokenPassThrough(), this
        }
        _checkForBrokenPassThrough() {
            if (this.parent && this._passThroughOptions && !this.parent._enablePositionalOptions) throw Error(`passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`)
        }
        storeOptionsAsProperties(q = !0) {
            if (this.options.length) throw Error("call .storeOptionsAsProperties() before adding options");
            if (Object.keys(this._optionValues).length) throw Error("call .storeOptionsAsProperties() before setting option values");
            return this._storeOptionsAsProperties = !!q, this
        }
        getOptionValue(q) {
            if (this._storeOptionsAsProperties) return this[q];
            return this._optionValues[q]
        }
        setOptionValue(q, K) {
            return this.setOptionValueWithSource(q, K, void 0)
        }
        setOptionValueWithSource(q, K, _) {
            if (this._storeOptionsAsProperties) this[q] = K;
            else this._optionValues[q] = K;
            return this._optionValueSources[q] = _, this
        }
        getOptionValueSource(q) {
            return this._optionValueSources[q]
        }
        getOptionValueSourceWithGlobals(q) {
            let K;
            return this._getCommandAndAncestors().forEach((_) => {
                if (_.getOptionValueSource(q) !== void 0) K = _.getOptionValueSource(q)
            }), K
        }
        _prepareUserArgs(q, K) {
            if (q !== void 0 && !Array.isArray(q)) throw Error("first parameter to parse must be array or undefined");
            if (K = K || {}, q === void 0 && K.from === void 0) {
                if (pX.versions?.electron) K.from = "electron";
                let z = pX.execArgv ?? [];
                if (z.includes("-e") || z.includes("--eval") || z.includes("-p") || z.includes("--print")) K.from = "eval"
            }
            if (q === void 0) q = pX.argv;
            this.rawArgs = q.slice();
            let _;
            switch (K.from) {
                case void 0:
                case "node":
                    this._scriptPath = q[1], _ = q.slice(2);
                    break;
                case "electron":
                    if (pX.defaultApp) this._scriptPath = q[1], _ = q.slice(2);
                    else _ = q.slice(1);
                    break;
                case "user":
                    _ = q.slice(0);
                    break;
                case "eval":
                    _ = q.slice(1);
                    break;
                default:
                    throw Error(`unexpected parse option { from: '${K.from}' }`)
            }
            if (!this._name && this._scriptPath) this.nameFromFilename(this._scriptPath);
            return this._name = this._name || "program", _
        }
        parse(q, K) {
            let _ = this._prepareUserArgs(q, K);
            return this._parseCommand([], _), this
        }
        async parseAsync(q, K) {
            let _ = this._prepareUserArgs(q, K);
            return await this._parseCommand([], _), this
        }
        _executeSubCommand(q, K) {
            K = K.slice();
            let _ = !1,
                z = [".js", ".ts", ".tsx", ".mjs", ".cjs"];

            function Y(j, H) {
                let J = v66.resolve(j, H);
                if (oJ7.existsSync(J)) return J;
                if (z.includes(v66.extname(H))) return;
                let X = z.find((M) => oJ7.existsSync(`${J}${M}`));
                if (X) return `${J}${X}`;
                return
            }
            this._checkForMissingMandatoryOptions(), this._checkForConflictingOptions();
            let A = q._executableFile || `${this._name}-${q._name}`,
                O = this._executableDir || "";
            if (this._scriptPath) {
                let j;
                try {
                    j = oJ7.realpathSync(this._scriptPath)
                } catch (H) {
                    j = this._scriptPath
                }
                O = v66.resolve(v66.dirname(j), O)
            }
            if (O) {
                let j = Y(O, A);
                if (!j && !q._executableFile && this._scriptPath) {
                    let H = v66.basename(this._scriptPath, v66.extname(this._scriptPath));
                    if (H !== this._name) j = Y(O, `${H}-${q._name}`)
                }
                A = j || A
            }
            _ = z.includes(v66.extname(A));
            let w;
            if (pX.platform !== "win32")
                if (_) K.unshift(A), K = c15(pX.execArgv).concat(K), w = rJ7.spawn(pX.argv[0], K, {
                    stdio: "inherit"
                });
                else w = rJ7.spawn(A, K, {
                    stdio: "inherit"
                });
            else K.unshift(A), K = c15(pX.execArgv).concat(K), w = rJ7.spawn(pX.execPath, K, {
                stdio: "inherit"
            });
            if (!w.killed)["SIGUSR1", "SIGUSR2", "SIGTERM", "SIGINT", "SIGHUP"].forEach((H) => {
                pX.on(H, () => {
                    if (w.killed === !1 && w.exitCode === null) w.kill(H)
                })
            });
            let $ = this._exitCallback;
            w.on("close", (j) => {
                if (j = j ?? 1, !$) pX.exit(j);
                else $(new aJ7(j, "commander.executeSubCommandAsync", "(close)"))
            }), w.on("error", (j) => {
                if (j.code === "ENOENT") {
                    let H = O ? `searched for local subcommand relative to directory '${O}'` : "no directory for search for local subcommand, use .executableDir() to supply a custom directory",
                        J = `'${A}' does not exist
 - if '${q._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${H}`;
                    throw Error(J)
                } else if (j.code === "EACCES") throw Error(`'${A}' not executable`);
                if (!$) pX.exit(1);
                else {
                    let H = new aJ7(1, "commander.executeSubCommandAsync", "(error)");
                    H.nestedError = j, $(H)
                }
            }), this.runningCommand = w
        }
        _dispatchSubcommand(q, K, _) {
            let z = this._findCommand(q);
            if (!z) this.help({
                error: !0
            });
            let Y;
            return Y = this._chainOrCallSubCommandHook(Y, z, "preSubcommand"), Y = this._chainOrCall(Y, () => {
                if (z._executableHandler) this._executeSubCommand(z, K.concat(_));
                else return z._parseCommand(K, _)
            }), Y
        }
        _dispatchHelpCommand(q) {
            if (!q) this.help();
            let K = this._findCommand(q);
            if (K && !K._executableHandler) K.help();
            return this._dispatchSubcommand(q, [], [this._getHelpOption()?.long ?? this._getHelpOption()?.short ?? "--help"])
        }
        _checkNumberOfArguments() {
            if (this.registeredArguments.forEach((q, K) => {
                    if (q.required && this.args[K] == null) this.missingArgument(q.name())
                }), this.registeredArguments.length > 0 && this.registeredArguments[this.registeredArguments.length - 1].variadic) return;
            if (this.args.length > this.registeredArguments.length) this._excessArguments(this.args)
        }
        _processArguments() {
            let q = (_, z, Y) => {
                let A = z;
                if (z !== null && _.parseArg) {
                    let O = `error: command-argument value '${z}' is invalid for argument '${_.name()}'.`;
                    A = this._callParseArg(_, z, Y, O)
                }
                return A
            };
            this._checkNumberOfArguments();
            let K = [];
            this.registeredArguments.forEach((_, z) => {
                let Y = _.defaultValue;
                if (_.variadic) {
                    if (z < this.args.length) {
                        if (Y = this.args.slice(z), _.parseArg) Y = Y.reduce((A, O) => {
                            return q(_, O, A)
                        }, _.defaultValue)
                    } else if (Y === void 0) Y = []
                } else if (z < this.args.length) {
                    if (Y = this.args[z], _.parseArg) Y = q(_, Y, _.defaultValue)
                }
                K[z] = Y
            }), this.processedArgs = K
        }
        _chainOrCall(q, K) {
            if (q && q.then && typeof q.then === "function") return q.then(() => K());
            return K()
        }
        _chainOrCallHooks(q, K) {
            let _ = q,
                z = [];
            if (this._getCommandAndAncestors().reverse().filter((Y) => Y._lifeCycleHooks[K] !== void 0).forEach((Y) => {
                    Y._lifeCycleHooks[K].forEach((A) => {
                        z.push({
                            hookedCommand: Y,
                            callback: A
                        })
                    })
                }), K === "postAction") z.reverse();
            return z.forEach((Y) => {
                _ = this._chainOrCall(_, () => {
                    return Y.callback(Y.hookedCommand, this)
                })
            }), _
        }
        _chainOrCallSubCommandHook(q, K, _) {
            let z = q;
            if (this._lifeCycleHooks[_] !== void 0) this._lifeCycleHooks[_].forEach((Y) => {
                z = this._chainOrCall(z, () => {
                    return Y(this, K)
                })
            });
            return z
        }
        _parseCommand(q, K) {
            let _ = this.parseOptions(K);
            if (this._parseOptionsEnv(), this._parseOptionsImplied(), q = q.concat(_.operands), K = _.unknown, this.args = q.concat(K), q && this._findCommand(q[0])) return this._dispatchSubcommand(q[0], q.slice(1), K);
            if (this._getHelpCommand() && q[0] === this._getHelpCommand().name()) return this._dispatchHelpCommand(q[1]);
            if (this._defaultCommandName) return this._outputHelpIfRequested(K), this._dispatchSubcommand(this._defaultCommandName, q, K);
            if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) this.help({
                error: !0
            });
            this._outputHelpIfRequested(_.unknown), this._checkForMissingMandatoryOptions(), this._checkForConflictingOptions();
            let z = () => {
                    if (_.unknown.length > 0) this.unknownOption(_.unknown[0])
                },
                Y = `command:${this.name()}`;
            if (this._actionHandler) {
                z(), this._processArguments();
                let A;
                if (A = this._chainOrCallHooks(A, "preAction"), A = this._chainOrCall(A, () => this._actionHandler(this.processedArgs)), this.parent) A = this._chainOrCall(A, () => {
                    this.parent.emit(Y, q, K)
                });
                return A = this._chainOrCallHooks(A, "postAction"), A
            }
            if (this.parent && this.parent.listenerCount(Y)) z(), this._processArguments(), this.parent.emit(Y, q, K);
            else if (q.length) {
                if (this._findCommand("*")) return this._dispatchSubcommand("*", q, K);
                if (this.listenerCount("command:*")) this.emit("command:*", q, K);
                else if (this.commands.length) this.unknownCommand();
                else z(), this._processArguments()
            } else if (this.commands.length) z(), this.help({
                error: !0
            });
            else z(), this._processArguments()
        }
        _findCommand(q) {
            if (!q) return;
            return this.commands.find((K) => K._name === q || K._aliases.includes(q))
        }
        _findOption(q) {
            return this.options.find((K) => K.is(q))
        }
        _checkForMissingMandatoryOptions() {
            this._getCommandAndAncestors().forEach((q) => {
                q.options.forEach((K) => {
                    if (K.mandatory && q.getOptionValue(K.attributeName()) === void 0) q.missingMandatoryOptionValue(K)
                })
            })
        }
        _checkForConflictingLocalOptions() {
            let q = this.options.filter((_) => {
                let z = _.attributeName();
                if (this.getOptionValue(z) === void 0) return !1;
                return this.getOptionValueSource(z) !== "default"
            });
            q.filter((_) => _.conflictsWith.length > 0).forEach((_) => {
                let z = q.find((Y) => _.conflictsWith.includes(Y.attributeName()));
                if (z) this._conflictingOption(_, z)
            })
        }
        _checkForConflictingOptions() {
            this._getCommandAndAncestors().forEach((q) => {
                q._checkForConflictingLocalOptions()
            })
        }
        parseOptions(q) {
            let K = [],
                _ = [],
                z = K,
                Y = q.slice();

            function A(w) {
                return w.length > 1 && w[0] === "-"
            }
            let O = null;
            while (Y.length) {
                let w = Y.shift();
                if (w === "--") {
                    if (z === _) z.push(w);
                    z.push(...Y);
                    break
                }
                if (O && !A(w)) {
                    this.emit(`option:${O.name()}`, w);
                    continue
                }
                if (O = null, A(w)) {
                    let $ = this._findOption(w);
                    if ($) {
                        if ($.required) {
                            let j = Y.shift();
                            if (j === void 0) this.optionMissingArgument($);
                            this.emit(`option:${$.name()}`, j)
                        } else if ($.optional) {
                            let j = null;
                            if (Y.length > 0 && !A(Y[0])) j = Y.shift();
                            this.emit(`option:${$.name()}`, j)
                        } else this.emit(`option:${$.name()}`);
                        O = $.variadic ? $ : null;
                        continue
                    }
                }
                if (w.length > 2 && w[0] === "-" && w[1] !== "-") {
                    let $ = this._findOption(`-${w[1]}`);
                    if ($) {
                        if ($.required || $.optional && this._combineFlagAndOptionalValue) this.emit(`option:${$.name()}`, w.slice(2));
                        else this.emit(`option:${$.name()}`), Y.unshift(`-${w.slice(2)}`);
                        continue
                    }
                }
                if (/^--[^=]+=/.test(w)) {
                    let $ = w.indexOf("="),
                        j = this._findOption(w.slice(0, $));
                    if (j && (j.required || j.optional)) {
                        this.emit(`option:${j.name()}`, w.slice($ + 1));
                        continue
                    }
                }
                if (A(w)) z = _;
                if ((this._enablePositionalOptions || this._passThroughOptions) && K.length === 0 && _.length === 0) {
                    if (this._findCommand(w)) {
                        if (K.push(w), Y.length > 0) _.push(...Y);
                        break
                    } else if (this._getHelpCommand() && w === this._getHelpCommand().name()) {
                        if (K.push(w), Y.length > 0) K.push(...Y);
                        break
                    } else if (this._defaultCommandName) {
                        if (_.push(w), Y.length > 0) _.push(...Y);
                        break
                    }
                }
                if (this._passThroughOptions) {
                    if (z.push(w), Y.length > 0) z.push(...Y);
                    break
                }
                z.push(w)
            }
            return {
                operands: K,
                unknown: _
            }
        }
        opts() {
            if (this._storeOptionsAsProperties) {
                let q = {},
                    K = this.options.length;
                for (let _ = 0; _ < K; _++) {
                    let z = this.options[_].attributeName();
                    q[z] = z === this._versionOptionName ? this._version : this[z]
                }
                return q
            }
            return this._optionValues
        }
        optsWithGlobals() {
            return this._getCommandAndAncestors().reduce((q, K) => Object.assign(q, K.opts()), {})
        }
        error(q, K) {
            if (this._outputConfiguration.outputError(`${q}
`, this._outputConfiguration.writeErr), typeof this._showHelpAfterError === "string") this._outputConfiguration.writeErr(`${this._showHelpAfterError}
`);
            else if (this._showHelpAfterError) this._outputConfiguration.writeErr(`
`), this.outputHelp({
                error: !0
            });
            let _ = K || {},
                z = _.exitCode || 1,
                Y = _.code || "commander.error";
            this._exit(z, Y, q)
        }
        _parseOptionsEnv() {
            this.options.forEach((q) => {
                if (q.envVar && q.envVar in pX.env) {
                    let K = q.attributeName();
                    if (this.getOptionValue(K) === void 0 || ["default", "config", "env"].includes(this.getOptionValueSource(K)))
                        if (q.required || q.optional) this.emit(`optionEnv:${q.name()}`, pX.env[q.envVar]);
                        else this.emit(`optionEnv:${q.name()}`)
                }
            })
        }
        _parseOptionsImplied() {
            let q = new Q1A(this.options),
                K = (_) => {
                    return this.getOptionValue(_) !== void 0 && !["default", "implied"].includes(this.getOptionValueSource(_))
                };
            this.options.filter((_) => _.implied !== void 0 && K(_.attributeName()) && q.valueFromOption(this.getOptionValue(_.attributeName()), _)).forEach((_) => {
                Object.keys(_.implied).filter((z) => !K(z)).forEach((z) => {
                    this.setOptionValueWithSource(z, _.implied[z], "implied")
                })
            })
        }
        missingArgument(q) {
            let K = `error: missing required argument '${q}'`;
            this.error(K, {
                code: "commander.missingArgument"
            })
        }
        optionMissingArgument(q) {
            let K = `error: option '${q.flags}' argument missing`;
            this.error(K, {
                code: "commander.optionMissingArgument"
            })
        }
        missingMandatoryOptionValue(q) {
            let K = `error: required option '${q.flags}' not specified`;
            this.error(K, {
                code: "commander.missingMandatoryOptionValue"
            })
        }
        _conflictingOption(q, K) {
            let _ = (A) => {
                    let O = A.attributeName(),
                        w = this.getOptionValue(O),
                        $ = this.options.find((H) => H.negate && O === H.attributeName()),
                        j = this.options.find((H) => !H.negate && O === H.attributeName());
                    if ($ && ($.presetArg === void 0 && w === !1 || $.presetArg !== void 0 && w === $.presetArg)) return $;
                    return j || A
                },
                z = (A) => {
                    let O = _(A),
                        w = O.attributeName();
                    if (this.getOptionValueSource(w) === "env") return `environment variable '${O.envVar}'`;
                    return `option '${O.flags}'`
                },
                Y = `error: ${z(q)} cannot be used with ${z(K)}`;
            this.error(Y, {
                code: "commander.conflictingOption"
            })
        }
        unknownOption(q) {
            if (this._allowUnknownOption) return;
            let K = "";
            if (q.startsWith("--") && this._showSuggestionAfterError) {
                let z = [],
                    Y = this;
                do {
                    let A = Y.createHelp().visibleOptions(Y).filter((O) => O.long).map((O) => O.long);
                    z = z.concat(A), Y = Y.parent
                } while (Y && !Y._enablePositionalOptions);
                K = d15(q, z)
            }
            let _ = `error: unknown option '${q}'${K}`;
            this.error(_, {
                code: "commander.unknownOption"
            })
        }
        _excessArguments(q) {
            if (this._allowExcessArguments) return;
            let K = this.registeredArguments.length,
                _ = K === 1 ? "" : "s",
                Y = `error: too many arguments${this.parent?` for '${this.name()}'`:""}. Expected ${K} argument${_} but got ${q.length}.`;
            this.error(Y, {
                code: "commander.excessArguments"
            })
        }
        unknownCommand() {
            let q = this.args[0],
                K = "";
            if (this._showSuggestionAfterError) {
                let z = [];
                this.createHelp().visibleCommands(this).forEach((Y) => {
                    if (z.push(Y.name()), Y.alias()) z.push(Y.alias())
                }), K = d15(q, z)
            }
            let _ = `error: unknown command '${q}'${K}`;
            this.error(_, {
                code: "commander.unknownCommand"
            })
        }
        version(q, K, _) {
            if (q === void 0) return this._version;
            this._version = q, K = K || "-V, --version", _ = _ || "output the version number";
            let z = this.createOption(K, _);
            return this._versionOptionName = z.attributeName(), this._registerOption(z), this.on("option:" + z.name(), () => {
                this._outputConfiguration.writeOut(`${q}
`), this._exit(0, "commander.version", q)
            }), this
        }
        description(q, K) {
            if (q === void 0 && K === void 0) return this._description;
            if (this._description = q, K) this._argsDescription = K;
            return this
        }
        summary(q) {
            if (q === void 0) return this._summary;
            return this._summary = q, this
        }
        alias(q) {
            if (q === void 0) return this._aliases[0];
            let K = this;
            if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) K = this.commands[this.commands.length - 1];
            if (q === K._name) throw Error("Command alias can't be the same as its name");
            let _ = this.parent?._findCommand(q);
            if (_) {
                let z = [_.name()].concat(_.aliases()).join("|");
                throw Error(`cannot add alias '${q}' to command '${this.name()}' as already have command '${z}'`)
            }
            return K._aliases.push(q), this
        }
        aliases(q) {
            if (q === void 0) return this._aliases;
            return q.forEach((K) => this.alias(K)), this
        }
        usage(q) {
            if (q === void 0) {
                if (this._usage) return this._usage;
                let K = this.registeredArguments.map((_) => {
                    return g1A(_)
                });
                return [].concat(this.options.length || this._helpOption !== null ? "[options]" : [], this.commands.length ? "[command]" : [], this.registeredArguments.length ? K : []).join(" ")
            }
            return this._usage = q, this
        }
        name(q) {
            if (q === void 0) return this._name;
            return this._name = q, this
        }
        nameFromFilename(q) {
            return this._name = v66.basename(q, v66.extname(q)), this
        }
        executableDir(q) {
            if (q === void 0) return this._executableDir;
            return this._executableDir = q, this
        }
        helpInformation(q) {
            let K = this.createHelp();
            if (K.helpWidth === void 0) K.helpWidth = q && q.error ? this._outputConfiguration.getErrHelpWidth() : this._outputConfiguration.getOutHelpWidth();
            return K.formatHelp(this, K)
        }
        _getHelpContext(q) {
            q = q || {};
            let K = {
                    error: !!q.error
                },
                _;
            if (K.error) _ = (z) => this._outputConfiguration.writeErr(z);
            else _ = (z) => this._outputConfiguration.writeOut(z);
            return K.write = q.write || _, K.command = this, K
        }
        outputHelp(q) {
            let K;
            if (typeof q === "function") K = q, q = void 0;
            let _ = this._getHelpContext(q);
            this._getCommandAndAncestors().reverse().forEach((Y) => Y.emit("beforeAllHelp", _)), this.emit("beforeHelp", _);
            let z = this.helpInformation(_);
            if (K) {
                if (z = K(z), typeof z !== "string" && !Buffer.isBuffer(z)) throw Error("outputHelp callback must return a string or a Buffer")
            }
            if (_.write(z), this._getHelpOption()?.long) this.emit(this._getHelpOption().long);
            this.emit("afterHelp", _), this._getCommandAndAncestors().forEach((Y) => Y.emit("afterAllHelp", _))
        }
        helpOption(q, K) {
            if (typeof q === "boolean") {
                if (q) this._helpOption = this._helpOption ?? void 0;
                else this._helpOption = null;
                return this
            }
            return q = q ?? "-h, --help", K = K ?? "display help for command", this._helpOption = this.createOption(q, K), this
        }
        _getHelpOption() {
            if (this._helpOption === void 0) this.helpOption(void 0, void 0);
            return this._helpOption
        }
        addHelpOption(q) {
            return this._helpOption = q, this
        }
        help(q) {
            this.outputHelp(q);
            let K = pX.exitCode || 0;
            if (K === 0 && q && typeof q !== "function" && q.error) K = 1;
            this._exit(K, "commander.help", "(outputHelp)")
        }
        addHelpText(q, K) {
            let _ = ["beforeAll", "before", "after", "afterAll"];
            if (!_.includes(q)) throw Error(`Unexpected value for position to addHelpText.
Expecting one of '${_.join("', '")}'`);
            let z = `${q}Help`;
            return this.on(z, (Y) => {
                let A;
                if (typeof K === "function") A = K({
                    error: Y.error,
                    command: Y.command
                });
                else A = K;
                if (A) Y.write(`${A}
`)
            }), this
        }
        _outputHelpIfRequested(q) {
            let K = this._getHelpOption();
            if (K && q.find((z) => K.is(z))) this.outputHelp(), this._exit(0, "commander.helpDisplayed", "(outputHelp)")
        }
    }

    function c15(q) {
        return q.map((K) => {
            if (!K.startsWith("--inspect")) return K;
            let _, z = "127.0.0.1",
                Y = "9229",
                A;
            if ((A = K.match(/^(--inspect(-brk)?)$/)) !== null) _ = A[1];
            else if ((A = K.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null)
                if (_ = A[1], /^\d+$/.test(A[3])) Y = A[3];
                else z = A[3];
            else if ((A = K.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) _ = A[1], z = A[3], Y = A[4];
            if (_ && Y !== "0") return `${_}=${z}:${parseInt(Y)+1}`;
            return K
        })
    }
    d1A.Command = sJ7
})
// @from(Ln 510639, Col 4)
o15 = p((i1A) => {
    var {
        Argument: n15
    } = ua8(), {
        Command: tJ7
    } = l15(), {
        CommanderError: l1A,
        InvalidArgumentError: i15
    } = Cz8(), {
        Help: n1A
    } = nJ7(), {
        Option: r15
    } = iJ7();
    i1A.program = new tJ7;
    i1A.createCommand = (q) => new tJ7(q);
    i1A.createOption = (q, K) => new r15(q, K);
    i1A.createArgument = (q, K) => new n15(q, K);
    i1A.Command = tJ7;
    i1A.Option = r15;
    i1A.Argument = n15;
    i1A.Help = n1A;
    i1A.CommanderError = l1A;
    i1A.InvalidArgumentError = i15;
    i1A.InvalidOptionArgumentError = i15
})
// @from(Ln 510664, Col 4)
s15 = p((cS, a15) => {
    var Zg = o15();
    cS = a15.exports = {};
    cS.program = new Zg.Command;
    cS.Argument = Zg.Argument;
    cS.Command = Zg.Command;
    cS.CommanderError = Zg.CommanderError;
    cS.Help = Zg.Help;
    cS.InvalidArgumentError = Zg.InvalidArgumentError;
    cS.InvalidOptionArgumentError = Zg.InvalidArgumentError;
    cS.Option = Zg.Option;
    cS.createCommand = (q) => new Zg.Command(q);
    cS.createOption = (q, K) => new Zg.Option(q, K);
    cS.createArgument = (q, K) => new Zg.Argument(q, K)
})
// @from(Ln 510679, Col 4)
t15
// @from(Ln 510679, Col 9)
tdj
// @from(Ln 510679, Col 14)
edj
// @from(Ln 510679, Col 19)
qcj
// @from(Ln 510679, Col 24)
Kcj
// @from(Ln 510679, Col 29)
_cj
// @from(Ln 510679, Col 34)
e15
// @from(Ln 510679, Col 39)
zcj
// @from(Ln 510679, Col 44)
q75
// @from(Ln 510679, Col 49)
Ycj
// @from(Ln 510679, Col 54)
q3
// @from(Ln 510679, Col 58)
Acj
// @from(Ln 510680, Col 4)
eJ7 = L(() => {
    t15 = K6(s15(), 1), {
        program: tdj,
        createCommand: edj,
        createArgument: qcj,
        createOption: Kcj,
        CommanderError: _cj,
        InvalidArgumentError: e15,
        InvalidOptionArgumentError: zcj,
        Command: q75,
        Argument: Ycj,
        Option: q3,
        Help: Acj
    } = t15.default
})
// @from(Ln 510696, Col 0)
function tq(q) {
    if (q) console.error(Y8.red(q));
    process.exit(1);
    return
}
// @from(Ln 510702, Col 0)
function Iu(q) {
    if (q) process.stdout.write(q + `
`);
    process.exit(0);
    return
}
// @from(Ln 510709, Col 0)
function Dz6(q) {
    process.stderr.write(Y8.yellow(q) + `
`)
}
// @from(Ln 510713, Col 4)
yW6 = L(() => {
    Y3()
})
// @from(Ln 510717, Col 0)
function _75() {
    if (K75) return;
    if (K75 = !0, S6(process.env.CLAUDE_CODE_USE_BEDROCK) || S6(process.env.CLAUDE_CODE_USE_VERTEX) || S6(process.env.CLAUDE_CODE_USE_FOUNDRY) || S6(process.env.CLAUDE_CODE_USE_ANTHROPIC_AWS) || S6(process.env.CLAUDE_CODE_USE_MANTLE)) return;
    if (process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy || process.env.ANTHROPIC_UNIX_SOCKET || process.env.CLAUDE_CODE_CLIENT_CERT || process.env.CLAUDE_CODE_CLIENT_KEY) return;
    let q = process.env.ANTHROPIC_BASE_URL || r7().BASE_API_URL;
    fetch(q, {
        method: "HEAD",
        signal: AbortSignal.timeout(1e4)
    }).catch(() => {})
}
// @from(Ln 510727, Col 4)
K75 = !1
// @from(Ln 510728, Col 4)
z75 = L(() => {
    z3();
    Q8()
})
// @from(Ln 510733, Col 0)
function Y75() {
    if (process.env.NODE_EXTRA_CA_CERTS) return;
    let q = A7A();
    if (q) process.env.NODE_EXTRA_CA_CERTS = q, E(`CA certs: Applied NODE_EXTRA_CA_CERTS from config to process.env: ${q}`)
}
// @from(Ln 510739, Col 0)
function A7A() {
    try {
        let K = H8()?.env,
            z = (L2("userSettings") ? E1("userSettings") : void 0)?.env;
        E(`CA certs: Config fallback - globalEnv keys: ${K?Object.keys(K).join(","):"none"}, settingsEnv keys: ${z?Object.keys(z).join(","):"none"}`);
        let Y = z?.NODE_EXTRA_CA_CERTS || K?.NODE_EXTRA_CA_CERTS;
        if (Y) E(`CA certs: Found NODE_EXTRA_CA_CERTS in config/settings: ${Y}`);
        return Y
    } catch (q) {
        E(`CA certs: Config fallback failed: ${q}`, {
            level: "error"
        });
        return
    }
}
// @from(Ln 510754, Col 4)
A75 = L(() => {
    h1();
    K8();
    aY();
    a1()
})
// @from(Ln 510761, Col 0)
function O7A(q) {
    if (!q || !process.env.ANTHROPIC_UNIX_SOCKET) return q || {};
    let {
        ANTHROPIC_UNIX_SOCKET: K,
        ANTHROPIC_BASE_URL: _,
        ANTHROPIC_API_KEY: z,
        ANTHROPIC_AUTH_TOKEN: Y,
        CLAUDE_CODE_OAUTH_TOKEN: A,
        ...O
    } = q;
    return O
}
// @from(Ln 510774, Col 0)
function w7A(q) {
    if (!q) return {};
    if (!S6(process.env.CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST)) return q;
    let K = {};
    for (let [_, z] of Object.entries(q))
        if (!id4(_)) K[_] = z;
    return K
}
// @from(Ln 510783, Col 0)
function $7A(q) {
    if (!q || !ma8) return q || {};
    let K = {};
    for (let [_, z] of Object.entries(q))
        if (!ma8.has(_)) K[_] = z;
    return K
}
// @from(Ln 510791, Col 0)
function gu6(q) {
    return $7A(w7A(O7A(q)))
}
// @from(Ln 510795, Col 0)
function O75() {
    if (ma8 === void 0) ma8 = process.env.CLAUDE_CODE_ENTRYPOINT === "claude-desktop" ? new Set(Object.keys(process.env)) : null;
    Object.assign(process.env, gu6(H8().env));
    for (let K of j7A) {
        if (K === "policySettings") continue;
        if (!L2(K)) continue;
        Object.assign(process.env, gu6(E1(K)?.env))
    }
    PF(), Object.assign(process.env, gu6(E1("policySettings")?.env));
    let q = gu6(y7()?.env);
    for (let [K, _] of Object.entries(q))
        if (BR6.has(K.toUpperCase())) process.env[K] = _
}
// @from(Ln 510809, Col 0)
function Fn() {
    Object.assign(process.env, gu6(H8().env)), Object.assign(process.env, gu6(y7()?.env)), EU7(), fs7(), nP1(), Yl6()
}
// @from(Ln 510812, Col 4)
ma8
// @from(Ln 510812, Col 9)
j7A
// @from(Ln 510813, Col 4)
bz8 = L(() => {
    La1();
    cQ6();
    h1();
    Q8();
    fu8();
    Qm();
    _M();
    aY();
    a1();
    j7A = ["userSettings", "flagSettings", "policySettings"]
})
// @from(Ln 510829, Col 0)
function KX7(q) {
    let K = q.length,
        _ = [],
        z = K;
    while (z > 127) _.push(z & 127 | 128), z >>>= 7;
    _.push(z);
    let Y = new Uint8Array(1 + _.length + K);
    return Y[0] = 10, Y.set(_, 1), Y.set(q, 1 + _.length), Y
}
// @from(Ln 510839, Col 0)
function X7A(q) {
    if (q.length === 0) return new Uint8Array(0);
    if (q[0] !== 10) return null;
    let K = 0,
        _ = 0,
        z = 1;
    while (z < q.length) {
        let Y = q[z];
        if (K |= (Y & 127) << _, z++, (Y & 128) === 0) break;
        if (_ += 7, _ > 28) return null
    }
    if (z + K > q.length) return null;
    return q.subarray(z, z + K)
}
// @from(Ln 510854, Col 0)
function $75() {
    return {
        connectBuf: Buffer.alloc(0),
        pending: [],
        wsOpen: !1,
        established: !1,
        closed: !1
    }
}
// @from(Ln 510863, Col 0)
async function j75(q) {
    let K = "Basic " + Buffer.from(`${q.sessionId}:${q.token}`).toString("base64"),
        _ = `Bearer ${q.token}`,
        z = typeof Bun < "u" ? M7A(q.wsUrl, K, _) : await P7A(q.wsUrl, K, _);
    return E(`[upstreamproxy] relay listening on 127.0.0.1:${z.port}`), z
}
// @from(Ln 510870, Col 0)
function M7A(q, K, _) {
    let z = Bun.listen({
        hostname: "127.0.0.1",
        port: 0,
        socket: {
            open(Y) {
                Y.data = {
                    ...$75(),
                    writeBuf: [],
                    endAfterDrain: !1
                }
            },
            data(Y, A) {
                let O = Y.data;
                if (O.closed) return;
                H75({
                    write: ($) => {
                        let j = typeof $ === "string" ? Buffer.from($, "utf8") : $;
                        if (O.writeBuf.length > 0) {
                            O.writeBuf.push(j);
                            return
                        }
                        let H = Y.write(j);
                        if (H < j.length) O.writeBuf.push(j.subarray(H))
                    },
                    end: () => {
                        if (O.writeBuf.length > 0) {
                            O.endAfterDrain = !0;
                            return
                        }
                        Y.end()
                    }
                }, O, A, q, K, _)
            },
            drain(Y) {
                let A = Y.data;
                while (A.writeBuf.length > 0) {
                    let O = A.writeBuf[0],
                        w = Y.write(O);
                    if (w < O.length) {
                        A.writeBuf[0] = O.subarray(w);
                        return
                    }
                    A.writeBuf.shift()
                }
                if (A.endAfterDrain) A.endAfterDrain = !1, Y.end()
            },
            close(Y) {
                Uu6(Y.data)
            },
            error(Y, A) {
                E(`[upstreamproxy] client socket error: ${A.message}`), Uu6(Y.data)
            }
        }
    });
    return {
        port: z.port,
        stop: () => z.stop(!0)
    }
}
// @from(Ln 510930, Col 0)
async function P7A(q, K, _) {
    qX7 = (await Promise.resolve().then(() => (xY6(), fF6))).default;
    let z = new WeakMap,
        Y = H7A((A) => {
            let O = $75();
            z.set(A, O);
            let w = {
                write: ($) => {
                    A.write(typeof $ === "string" ? $ : Buffer.from($))
                },
                end: () => A.end()
            };
            A.on("data", ($) => H75(w, O, $, q, K, _)), A.on("close", () => Uu6(z.get(A))), A.on("error", ($) => {
                E(`[upstreamproxy] client socket error: ${$.message}`), Uu6(z.get(A))
            })
        });
    return new Promise((A, O) => {
        Y.once("error", O), Y.listen(0, "127.0.0.1", () => {
            let w = Y.address();
            if (w === null || typeof w === "string") {
                O(Error("upstreamproxy: server has no TCP address"));
                return
            }
            A({
                port: w.port,
                stop: () => Y.close()
            })
        })
    })
}
// @from(Ln 510961, Col 0)
function H75(q, K, _, z, Y, A) {
    if (!K.ws) {
        K.connectBuf = Buffer.concat([K.connectBuf, _]);
        let O = K.connectBuf.indexOf(`\r
\r
`);
        if (O === -1) {
            if (K.connectBuf.length > 8192) q.write(`HTTP/1.1 400 Bad Request\r
\r
`), q.end();
            return
        }
        let w = K.connectBuf.subarray(0, O).toString("utf8"),
            $ = i5(w, `\r
`);
        if (!$.match(/^CONNECT\s+(\S+)\s+HTTP\/1\.[01]$/i)) {
            q.write(`HTTP/1.1 405 Method Not Allowed\r
\r
`), q.end();
            return
        }
        let H = K.connectBuf.subarray(O + 4);
        if (H.length > 0) K.pending.push(Buffer.from(H));
        K.connectBuf = Buffer.alloc(0), W7A(q, K, $, z, Y, A);
        return
    }
    if (!K.wsOpen) {
        K.pending.push(Buffer.from(_));
        return
    }
    J75(K.ws, _)
}
// @from(Ln 510994, Col 0)
function W7A(q, K, _, z, Y, A) {
    let O = {
            "Content-Type": "application/proto",
            Authorization: A
        },
        w;
    if (qX7) w = new qX7(z, {
        headers: O,
        agent: vb(z),
        ...OE()
    });
    else w = new globalThis.WebSocket(z, {
        headers: O,
        proxy: Tb(z),
        tls: OE() || void 0
    });
    w.binaryType = "arraybuffer", K.ws = w, w.onopen = () => {
        let $ = `${_}\r
Proxy-Authorization: ${Y}\r
\r
`;
        w.send(KX7(Buffer.from($, "utf8"))), K.wsOpen = !0;
        for (let j of K.pending) J75(w, j);
        K.pending = [], K.pinger = setInterval(D7A, J7A, w)
    }, w.onmessage = ($) => {
        let j = $.data instanceof ArrayBuffer ? new Uint8Array($.data) : new Uint8Array(Buffer.from($.data)),
            H = X7A(j);
        if (H && H.length > 0) K.established = !0, q.write(H)
    }, w.onerror = ($) => {
        let j = "message" in $ ? String($.message) : "websocket error";
        if (E(`[upstreamproxy] ws error: ${j}`), K.closed) return;
        if (K.closed = !0, !K.established) q.write(`HTTP/1.1 502 Bad Gateway\r
\r
`);
        q.end(), Uu6(K)
    }, w.onclose = () => {
        if (K.closed) return;
        K.closed = !0, q.end(), Uu6(K)
    }
}
// @from(Ln 511035, Col 0)
function D7A(q) {
    if (q.readyState === WebSocket.OPEN) q.send(KX7(new Uint8Array(0)))
}
// @from(Ln 511039, Col 0)
function J75(q, K) {
    if (q.readyState !== WebSocket.OPEN) return;
    for (let _ = 0; _ < K.length; _ += w75) {
        let z = K.subarray(_, _ + w75);
        q.send(KX7(z))
    }
}
// @from(Ln 511047, Col 0)
function Uu6(q) {
    if (!q) return;
    if (q.pinger) clearInterval(q.pinger);
    if (q.ws && q.ws.readyState <= WebSocket.OPEN) try {
        q.ws.close()
    } catch {}
    q.ws = void 0
}
// @from(Ln 511055, Col 4)
qX7
// @from(Ln 511055, Col 9)
w75 = 524288
// @from(Ln 511056, Col 4)
J7A = 30000
// @from(Ln 511057, Col 4)
X75 = L(() => {
    K8();
    Qm();
    _M()
})
// @from(Ln 511062, Col 4)
G75 = {}
// @from(Ln 511081, Col 0)
async function G7A(q) {
    if (!S6(process.env.CLAUDE_CODE_REMOTE)) return nT;
    if (!S6(process.env.CCR_UPSTREAM_PROXY_ENABLED)) return nT;
    let K = process.env.CLAUDE_CODE_REMOTE_SESSION_ID;
    if (!K) return E("[upstreamproxy] CLAUDE_CODE_REMOTE_SESSION_ID unset; proxy disabled", {
        level: "warn"
    }), nT;
    let _ = q?.tokenPath ?? f75,
        z = await V7A(_),
        Y = z.existed,
        A = z.token;
    if (!A) A = qW();
    if (!A) return E("[upstreamproxy] no session token; proxy disabled"), nT;
    E(`[upstreamproxy] token via ${Y?_:"sessionIngressAuth"}`), k7A();
    let O = q?.ccrBaseUrl ?? process.env.ANTHROPIC_BASE_URL ?? "https://api.anthropic.com",
        w = q?.caBundlePath ?? Ba8(M75(), ".ccr", "ca-bundle.crt");
    if (!await N7A(O, q?.systemCaPath ?? f7A, w)) return nT;
    await E7A(q?.awsConfigPath ?? Ba8(M75(), ".aws", "config"));
    try {
        let j = O.replace(/^http/, "ws") + "/v1/code/upstreamproxy/ws",
            H = await j75({
                wsUrl: j,
                sessionId: K,
                token: A
            });
        if (eq(async () => H.stop()), nT = {
                enabled: !0,
                port: H.port,
                caBundlePath: w
            }, E(`[upstreamproxy] enabled on 127.0.0.1:${H.port}`), Y) await Z7A(_).catch(() => {
            E("[upstreamproxy] token file unlink failed", {
                level: "warn"
            })
        })
    } catch (j) {
        E(`[upstreamproxy] relay start failed: ${j instanceof Error?j.message:String(j)}; proxy disabled`, {
            level: "warn"
        })
    }
    return nT
}
// @from(Ln 511123, Col 0)
function v7A() {
    if (!nT.enabled || !nT.port || !nT.caBundlePath) {
        if (process.env.HTTPS_PROXY && process.env.SSL_CERT_FILE) {
            let K = {};
            for (let _ of ["HTTPS_PROXY", "https_proxy", "NO_PROXY", "no_proxy", "SSL_CERT_FILE", "NODE_EXTRA_CA_CERTS", "REQUESTS_CA_BUNDLE", "CURL_CA_BUNDLE", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "GH_TOKEN", "GITHUB_TOKEN"])
                if (process.env[_]) K[_] = process.env[_];
            return K
        }
        return {}
    }
    let q = `http://127.0.0.1:${nT.port}`;
    return {
        HTTPS_PROXY: q,
        https_proxy: q,
        NO_PROXY: P75,
        no_proxy: P75,
        SSL_CERT_FILE: nT.caBundlePath,
        NODE_EXTRA_CA_CERTS: nT.caBundlePath,
        REQUESTS_CA_BUNDLE: nT.caBundlePath,
        CURL_CA_BUNDLE: nT.caBundlePath,
        AWS_ACCESS_KEY_ID: "proxy-injected",
        AWS_SECRET_ACCESS_KEY: "proxy-injected",
        GH_TOKEN: "proxy-injected",
        GITHUB_TOKEN: "proxy-injected"
    }
}
// @from(Ln 511150, Col 0)
function T7A() {
    nT = {
        enabled: !1
    }
}
// @from(Ln 511155, Col 0)
async function V7A(q) {
    try {
        return {
            existed: !0,
            token: (await D75(q, "utf8")).trim() || null
        }
    } catch (K) {
        if (t1(K)) return {
            existed: !1,
            token: null
        };
        return E(`[upstreamproxy] token read failed: ${K instanceof Error?K.message:String(K)}`, {
            level: "warn"
        }), {
            existed: !1,
            token: null
        }
    }
}
// @from(Ln 511175, Col 0)
function k7A() {
    if (process.platform !== "linux" || typeof Bun > "u") return;
    try {
        let K = d6("bun:ffi").dlopen("libc.so.6", {
                prctl: {
                    args: ["int", "u64", "u64", "u64", "u64"],
                    returns: "int"
                }
            }),
            _ = 4;
        if (K.symbols.prctl(4, 0n, 0n, 0n, 0n) !== 0) E("[upstreamproxy] prctl(PR_SET_DUMPABLE,0) returned nonzero", {
            level: "warn"
        })
    } catch (q) {
        E(`[upstreamproxy] prctl unavailable: ${q instanceof Error?q.message:String(q)}`, {
            level: "warn"
        })
    }
}
// @from(Ln 511194, Col 0)
async function N7A(q, K, _) {
    try {
        let z = await fetch(`${q}/v1/code/upstreamproxy/ca-cert`, {
            signal: AbortSignal.timeout(5000)
        });
        if (!z.ok) return E(`[upstreamproxy] ca-cert fetch ${z.status}; proxy disabled`, {
            level: "warn"
        }), !1;
        let Y = await z.text(),
            A = await D75(K, "utf8").catch(() => "");
        return await W75(Ba8(_, ".."), {
            recursive: !0
        }), await Z75(_, A + `
` + Y, "utf8"), !0
    } catch (z) {
        return E(`[upstreamproxy] ca-cert download failed: ${z instanceof Error?z.message:String(z)}; proxy disabled`, {
            level: "warn"
        }), !1
    }
}
// @from(Ln 511214, Col 0)
async function E7A(q) {
    try {
        await W75(Ba8(q, ".."), {
            recursive: !0,
            mode: 448
        }), await Z75(q, `[default]
s3 =
  payload_signing_enabled = false
`, {
            flag: "wx",
            mode: 384
        })
    } catch (K) {
        if (Q1(K) === "EEXIST") return;
        E(`[upstreamproxy] aws config write failed: ${K instanceof Error?K.message:String(K)}`, {
            level: "warn"
        })
    }
}
// @from(Ln 511233, Col 4)
f75 = "/run/ccr/session_token"
// @from(Ln 511234, Col 4)
f7A = "/etc/ssl/certs/ca-certificates.crt"
// @from(Ln 511235, Col 4)
P75
// @from(Ln 511235, Col 9)
nT
// @from(Ln 511236, Col 4)
v75 = L(() => {
    R9();
    K8();
    Q8();
    m8();
    ox();
    X75();
    P75 = ["localhost", "127.0.0.1", "::1", "169.254.0.0/16", "10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16", "anthropic.com", ".anthropic.com", "*.anthropic.com", "registry.npmjs.org", "pypi.org", "files.pythonhosted.org", "index.crates.io", "proxy.golang.org"].join(","), nT = {
        enabled: !1
    }
})
// @from(Ln 511247, Col 4)
T75 = {}
// @from(Ln 511252, Col 0)
function y7A(q) {
    let K = s(19),
        {
            filePath: _,
            errorDescription: z,
            onExit: Y,
            onReset: A
        } = q,
        O;
    if (K[0] !== Y || K[1] !== A) O = (W) => {
        if (W === "exit") Y();
        else A()
    }, K[0] = Y, K[1] = A, K[2] = O;
    else O = K[2];
    let w = O,
        $;
    if (K[3] !== _) $ = xu.default.createElement(T, null, "The configuration file at ", xu.default.createElement(T, {
        bold: !0
    }, _), " contains invalid JSON."), K[3] = _, K[4] = $;
    else $ = K[4];
    let j;
    if (K[5] !== z) j = xu.default.createElement(T, null, z), K[5] = z, K[6] = j;
    else j = K[6];
    let H;
    if (K[7] !== $ || K[8] !== j) H = xu.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, $, j), K[7] = $, K[8] = j, K[9] = H;
    else H = K[9];
    let J;
    if (K[10] === Symbol.for("react.memo_cache_sentinel")) J = xu.default.createElement(T, {
        bold: !0
    }, "Choose an option:"), K[10] = J;
    else J = K[10];
    let X;
    if (K[11] === Symbol.for("react.memo_cache_sentinel")) X = [{
        label: "Exit and fix manually",
        value: "exit"
    }, {
        label: "Reset with default configuration",
        value: "reset"
    }], K[11] = X;
    else X = K[11];
    let M;
    if (K[12] !== w || K[13] !== Y) M = xu.default.createElement(u, {
        flexDirection: "column"
    }, J, xu.default.createElement(A1, {
        options: X,
        onChange: w,
        onCancel: Y
    })), K[12] = w, K[13] = Y, K[14] = M;
    else M = K[14];
    let P;
    if (K[15] !== Y || K[16] !== H || K[17] !== M) P = xu.default.createElement(R1, {
        title: "Configuration Error",
        color: "error",
        onCancel: Y
    }, H, M), K[15] = Y, K[16] = H, K[17] = M, K[18] = P;
    else P = K[18];
    return P
}
// @from(Ln 511313, Col 0)
async function h7A({
    error: q
}) {
    let K = {
        ...XF(!1),
        theme: L7A
    };
    await new Promise(async (_) => {
        let {
            unmount: z
        } = await eB(xu.default.createElement(kX, null, xu.default.createElement(TM, null, xu.default.createElement(y7A, {
            filePath: q.filePath,
            errorDescription: q.message,
            onExit: () => {
                z(), _(), process.exit(1)
            },
            onReset: () => {
                aJ(q.filePath, I6(q.defaultConfig, null, 2), {
                    flush: !1,
                    encoding: "utf8"
                }), z(), _(), process.exit(0)
            }
        }))), K)
    })
}
// @from(Ln 511338, Col 4)
xu
// @from(Ln 511338, Col 8)
L7A = "dark"
// @from(Ln 511339, Col 4)
V75 = L(() => {
    o6();
    g6();
    ql();
    JF();
    aR6();
    e8();
    g_();
    S4();
    xu = K6(P6(), 1)
})
// @from(Ln 511351, Col 0)
function pa8() {
    if (Ca1()) {
        if (I7() && hJ()) zX7().catch((q) => {
            E(`[3P telemetry] Eager telemetry init failed (beta tracing): ${b6(q)}`, {
                level: "error"
            })
        });
        E("[3P telemetry] Waiting for remote managed settings before telemetry init"), Qu8().then(async () => {
            E("[3P telemetry] Remote managed settings loaded, initializing telemetry"), Fn(), await zX7()
        }).catch((q) => {
            E(`[3P telemetry] Telemetry init failed (remote settings path): ${b6(q)}`, {
                level: "error"
            })
        })
    } else zX7().catch((q) => {
        E(`[3P telemetry] Telemetry init failed: ${b6(q)}`, {
            level: "error"
        })
    })
}
// @from(Ln 511371, Col 0)
async function zX7() {
    if (_X7) return;
    _X7 = !0;
    try {
        await R7A()
    } catch (q) {
        throw _X7 = !1, q
    }
}
// @from(Ln 511380, Col 0)
async function R7A() {
    let {
        initializeTelemetry: q
    } = await Promise.resolve().then(() => (Z87(), D87)), K = await q();
    if (K) t61(K, (z, Y) => {
        let A = K?.createCounter(z, Y);
        return {
            add(O, w = {}) {
                let j = {
                    ...jL6(),
                    ...w
                };
                A?.add(O, j)
            }
        }
    }), e61()?.add(1)
}
// @from(Ln 511397, Col 4)
_X7 = !1
// @from(Ln 511398, Col 4)
k75
// @from(Ln 511399, Col 4)
YX7 = L(() => {
    ag();
    y8();
    h1();
    U4();
    y8();
    y8();
    nl();
    YD();
    J2();
    tR6();
    z75();
    A75();
    R9();
    h1();
    K8();
    gZ();
    VA();
    w46();
    Q8();
    m8();
    CY();
    bz8();
    Qm();
    Sz();
    _M();
    zy();
    h18();
    kS8();
    rC();
    k75 = P1(async () => {
        let q = Date.now();
        j1("info", "init_started"), XK("init_function_start");
        try {
            let K = Date.now();
            $$6(), j1("info", "init_configs_enabled", {
                duration_ms: Date.now() - K
            }), XK("init_configs_enabled");
            let _ = Date.now();
            if (O75(), await wp1(), Y75(), j1("info", "init_safe_env_vars_applied", {
                    duration_ms: Date.now() - _
                }), XK("init_safe_env_vars_applied"), DS4(), XK("init_after_graceful_shutdown"), Promise.all([Promise.resolve().then(() => (BB(), qb1)), Promise.resolve().then(() => (B1(), vq4))]).then(([A, O]) => {
                    A.initialize1PEventLogging(), O.onGrowthBookRefresh(() => {
                        A.reinitialize1PEventLoggingIfConfigChanged()
                    })
                }), XK("init_after_1p_event_logging"), cf1(), XK("init_after_oauth_populate"), UC1(), XK("init_after_jetbrains_detection"), x16(), Ca1()) ic4();
            if (Wu()) Vn8();
            XK("init_after_remote_settings_check"), Zb1();
            let z = Date.now();
            E("[init] configureGlobalMTLS starting"), Gs7(), j1("info", "init_mtls_configured", {
                duration_ms: Date.now() - z
            }), E("[init] configureGlobalMTLS complete");
            let Y = Date.now();
            if (E("[init] configureGlobalAgents starting"), Yl6(), j1("info", "init_proxy_configured", {
                    duration_ms: Date.now() - Y
                }), E("[init] configureGlobalAgents complete"), XK("init_network_configured"), _75(), S6(process.env.CLAUDE_CODE_REMOTE)) try {
                let {
                    initUpstreamProxy: A,
                    getUpstreamProxyEnv: O
                } = await Promise.resolve().then(() => (v75(), G75)), {
                    registerUpstreamProxyEnvFn: w
                } = await Promise.resolve().then(() => (zy(), QH4));
                w(O), await A()
            } catch (A) {
                E(`[init] upstreamproxy init failed: ${A instanceof Error?A.message:String(A)}; continuing without proxy`, {
                    level: "warn"
                })
            }
            if (Sm7(), eq(NMK), eq(async () => {
                    let {
                        cleanupSessionTeams: A
                    } = await Promise.resolve().then(() => (BD(), CNK));
                    await A()
                }), mn()) {
                let A = Date.now();
                await q65(), j1("info", "init_scratchpad_created", {
                    duration_ms: Date.now() - A
                })
            }
            j1("info", "init_completed", {
                duration_ms: Date.now() - q
            }), XK("init_function_end")
        } catch (K) {
            if (K instanceof HV) {
                if (I7()) {
                    process.stderr.write(`Configuration error in ${K.filePath}: ${K.message}
`), j5(1);
                    return
                }
                return Promise.resolve().then(() => (V75(), T75)).then((_) => _.showInvalidConfigDialog({
                    error: K
                }))
            } else throw K
        }
    })
})
// @from(Ln 511496, Col 0)
function E75(q) {
    let K = s(3),
        {
            getFpsMetrics: _,
            children: z
        } = q,
        Y;
    if (K[0] !== z || K[1] !== _) Y = Qu6.default.createElement(N75.Provider, {
        value: _
    }, z), K[0] = z, K[1] = _, K[2] = Y;
    else Y = K[2];
    return Y
}
// @from(Ln 511510, Col 0)
function y75() {
    return Qu6.useContext(N75)
}
// @from(Ln 511513, Col 4)
Qu6
// @from(Ln 511513, Col 9)
N75
// @from(Ln 511514, Col 4)
AX7 = L(() => {
    o6();
    Qu6 = K6(P6(), 1), N75 = Qu6.createContext(void 0)
})
// @from(Ln 511519, Col 0)
function OX7(q, K) {
    let _ = K / 100 * (q.length - 1),
        z = Math.floor(_),
        Y = Math.ceil(_);
    if (z === Y) return q[z];
    return q[z] + (q[Y] - q[z]) * (_ - z)
}
// @from(Ln 511527, Col 0)
function wX7() {
    let q = new Map,
        K = new Map,
        _ = new Map;
    return {
        increment(z, Y = 1) {
            q.set(z, (q.get(z) ?? 0) + Y)
        },
        set(z, Y) {
            q.set(z, Y)
        },
        observe(z, Y) {
            let A = K.get(z);
            if (!A) A = {
                reservoir: [],
                count: 0,
                sum: 0,
                min: Y,
                max: Y
            }, K.set(z, A);
            if (A.count++, A.sum += Y, Y < A.min) A.min = Y;
            if (Y > A.max) A.max = Y;
            if (A.reservoir.length < L75) A.reservoir.push(Y);
            else {
                let O = Math.floor(Math.random() * A.count);
                if (O < L75) A.reservoir[O] = Y
            }
        },
        add(z, Y) {
            let A = _.get(z);
            if (!A) A = new Set, _.set(z, A);
            A.add(Y)
        },
        getAll() {
            let z = Object.fromEntries(q);
            for (let [Y, A] of K) {
                if (A.count === 0) continue;
                z[`${Y}_count`] = A.count, z[`${Y}_min`] = A.min, z[`${Y}_max`] = A.max, z[`${Y}_avg`] = A.sum / A.count;
                let O = [...A.reservoir].sort((w, $) => w - $);
                z[`${Y}_p50`] = OX7(O, 50), z[`${Y}_p95`] = OX7(O, 95), z[`${Y}_p99`] = OX7(O, 99)
            }
            for (let [Y, A] of _) z[Y] = A.size;
            return z
        }
    }
}
// @from(Ln 511574, Col 0)
function h75(q) {
    let K = s(7),
        {
            store: _,
            children: z
        } = q,
        Y;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) Y = wX7(), K[0] = Y;
    else Y = K[0];
    let O = _ ?? Y,
        w, $;
    if (K[1] !== O) w = () => {
        let H = () => {
            let J = O.getAll();
            if (Object.keys(J).length > 0) u2((X) => ({
                ...X,
                lastSessionMetrics: J
            }))
        };
        return process.on("exit", H), () => {
            process.off("exit", H)
        }
    }, $ = [O], K[1] = O, K[2] = w, K[3] = $;
    else w = K[2], $ = K[3];
    LW6.useEffect(w, $);
    let j;
    if (K[4] !== z || K[5] !== O) j = LW6.default.createElement(S7A.Provider, {
        value: O
    }, z), K[4] = z, K[5] = O, K[6] = j;
    else j = K[6];
    return j
}
// @from(Ln 511606, Col 4)
LW6
// @from(Ln 511606, Col 9)
L75 = 1024
// @from(Ln 511607, Col 4)
S7A
// @from(Ln 511608, Col 4)
$X7 = L(() => {
    o6();
    h1();
    LW6 = K6(P6(), 1);
    S7A = LW6.createContext(null)
})
// @from(Ln 511615, Col 0)
function R75(q) {
    return (K) => ({
        ...K,
        ...typeof q.permission_mode === "string" && {
            toolPermissionContext: {
                ...K.toolPermissionContext,
                mode: yV(q.permission_mode)
            }
        },
        ...typeof q.is_ultraplan_mode === "boolean" && {
            isUltraplanMode: q.is_ultraplan_mode
        }
    })
}
// @from(Ln 511630, Col 0)
function T66({
    newState: q,
    oldState: K
}, _) {
    let z = K.toolPermissionContext.mode,
        Y = q.toolPermissionContext.mode;
    if (z !== Y) {
        let A = Sm(z),
            O = Sm(Y);
        if (A !== O) {
            let w = O === "plan" && q.isUltraplanMode && !K.isUltraplanMode ? !0 : null;
            _?.notifyMetadataChanged({
                permission_mode: O,
                is_ultraplan_mode: w
            })
        }
        _?.notifyPermissionModeChanged(Y)
    }
    if (q.mainLoopModel !== K.mainLoopModel && q.mainLoopModel === null) P7("userSettings", {
        model: void 0
    }), kW(null);
    if (q.mainLoopModel !== K.mainLoopModel && q.mainLoopModel !== null) P7("userSettings", {
        model: q.mainLoopModel
    }), kW(q.mainLoopModel);
    if (q.expandedView !== K.expandedView) {
        let A = q.expandedView === "tasks",
            O = q.expandedView === "teammates";
        if (H8().showExpandedTodos !== A || H8().showSpinnerTree !== O) d8((w) => ({
            ...w,
            showExpandedTodos: A,
            showSpinnerTree: O
        }))
    }
    if (q.verbose !== K.verbose && H8().verbose !== q.verbose) {
        let A = q.verbose;
        d8((O) => ({
            ...O,
            verbose: A
        }))
    }
    if (q.settings !== K.settings) try {
        if (Vo6(), ko6(), No6(), q.settings.env !== K.settings.env) Fn()
    } catch (A) {
        j6(r1(A))
    }
}
// @from(Ln 511676, Col 4)
du6 = L(() => {
    y8();
    T7();
    h1();
    m8();
    U8();
    bz8();
    OP();
    a1()
})
// @from(Ln 511686, Col 4)
jX7 = {}
// @from(Ln 511691, Col 0)
function C7A(q) {
    let K = s(11),
        {
            getFpsMetrics: _,
            stats: z,
            initialState: Y,
            children: A
        } = q,
        O;
    if (K[0] !== A) O = hW6.default.createElement(ZA4, null, hW6.default.createElement(YiK, null, hW6.default.createElement(q$4, null, A))), K[0] = A, K[1] = O;
    else O = K[1];
    let w;
    if (K[2] !== Y || K[3] !== O) w = hW6.default.createElement(kX, {
        initialState: Y,
        onChangeAppState: T66
    }, O), K[2] = Y, K[3] = O, K[4] = w;
    else w = K[4];
    let $;
    if (K[5] !== z || K[6] !== w) $ = hW6.default.createElement(h75, {
        store: z
    }, w), K[5] = z, K[6] = w, K[7] = $;
    else $ = K[7];
    let j;
    if (K[8] !== _ || K[9] !== $) j = hW6.default.createElement(E75, {
        getFpsMetrics: _
    }, $), K[8] = _, K[9] = $, K[10] = j;
    else j = K[10];
    return j
}
// @from(Ln 511720, Col 4)
hW6
// @from(Ln 511721, Col 4)
HX7 = L(() => {
    o6();
    i_8();
    AX7();
    by8();
    kY();
    $X7();
    JF();
    du6();
    hW6 = K6(P6(), 1)
})
// @from(Ln 511733, Col 0)
function S75() {
    Fa8.useContext(Ca);
    let q = KO.get(process.stdout);
    return Fa8.useMemo(() => {
        if (!q) return {
            setQuery: () => {},
            scanElement: () => [],
            setPositions: () => {}
        };
        return {
            setQuery: (K) => q.setSearchHighlight(K),
            scanElement: (K) => q.scanElementSubtree(K),
            setPositions: (K) => q.setSearchPositions(K)
        }
    }, [q])
}
// @from(Ln 511749, Col 4)
Fa8
// @from(Ln 511750, Col 4)
C75 = L(() => {
    wa6();
    Yk();
    Fa8 = K6(P6(), 1)
})
// @from(Ln 511756, Col 0)
function b75(q) {
    let K = s(7),
        {
            onDone: _
        } = q,
        z;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) z = cu6.default.createElement(u, {
        flexDirection: "column"
    }, cu6.default.createElement(T, null, "Learn more about how to monitor your spending:"), cu6.default.createElement(yq, {
        url: "https://code.claude.com/docs/en/costs"
    })), K[0] = z;
    else z = K[0];
    let Y;
    if (K[1] === Symbol.for("react.memo_cache_sentinel")) Y = [{
        value: "ok",
        label: "Got it, thanks!"
    }], K[1] = Y;
    else Y = K[1];
    let A;
    if (K[2] !== _) A = cu6.default.createElement(A1, {
        options: Y,
        onChange: _
    }), K[2] = _, K[3] = A;
    else A = K[3];
    let O;
    if (K[4] !== _ || K[5] !== A) O = cu6.default.createElement(R1, {
        title: "You've spent $5 on the Anthropic API this session.",
        onCancel: _
    }, z, A), K[4] = _, K[5] = A, K[6] = O;
    else O = K[6];
    return O
}
// @from(Ln 511788, Col 4)
cu6
// @from(Ln 511789, Col 4)
I75 = L(() => {
    o6();
    g6();
    g_();
    S4();
    cu6 = K6(P6(), 1)
})
// @from(Ln 511797, Col 0)
function x75(q) {
    let K = s(16),
        {
            sessionAgeMinutes: _,
            estimatedTokens: z,
            onDone: Y
        } = q,
        A;
    if (K[0] !== _) A = b7A(_), K[0] = _, K[1] = A;
    else A = K[1];
    let O = A,
        w;
    if (K[2] !== z) w = h3(z), K[2] = z, K[3] = w;
    else w = K[3];
    let j = `This session is ${O} old and ${w} tokens.`,
        H;
    if (K[4] !== Y) H = () => Y("dismiss"), K[4] = Y, K[5] = H;
    else H = K[5];
    let J;
    if (K[6] === Symbol.for("react.memo_cache_sentinel")) J = Iz8.default.createElement(u, {
        flexDirection: "column"
    }, Iz8.default.createElement(T, null, "Resuming the full session will consume a substantial portion of your usage limits. We recommend resuming from a summary.")), K[6] = J;
    else J = K[6];
    let X;
    if (K[7] === Symbol.for("react.memo_cache_sentinel")) X = {
        value: "compact",
        label: "Resume from summary (recommended)"
    }, K[7] = X;
    else X = K[7];
    let M;
    if (K[8] === Symbol.for("react.memo_cache_sentinel")) M = {
        value: "continue",
        label: "Resume full session as-is"
    }, K[8] = M;
    else M = K[8];
    let P;
    if (K[9] === Symbol.for("react.memo_cache_sentinel")) P = [X, M, {
        value: "never",
        label: "Don't ask me again"
    }], K[9] = P;
    else P = K[9];
    let W;
    if (K[10] !== Y) W = Iz8.default.createElement(A1, {
        options: P,
        onChange: (Z) => Y(Z)
    }), K[10] = Y, K[11] = W;
    else W = K[11];
    let D;
    if (K[12] !== j || K[13] !== H || K[14] !== W) D = Iz8.default.createElement(R1, {
        title: j,
        onCancel: H
    }, J, W), K[12] = j, K[13] = H, K[14] = W, K[15] = D;
    else D = K[15];
    return D
}
// @from(Ln 511853, Col 0)
function b7A(q) {
    if (q < 60) return `${Math.floor(q)}m`;
    let K = Math.floor(q / 60);
    if (K < 24) {
        let Y = Math.floor(q % 60);
        return Y === 0 ? `${K}h` : `${K}h ${Y}m`
    }
    let _ = Math.floor(K / 24),
        z = K % 24;
    return z === 0 ? `${_}d` : `${_}d ${z}h`
}
// @from(Ln 511864, Col 4)
Iz8
// @from(Ln 511865, Col 4)
u75 = L(() => {
    o6();
    g6();
    c7();
    g_();
    S4();
    Iz8 = K6(P6(), 1)
})
// @from(Ln 511877, Col 0)
function B75() {
    if (RW6++, RW6 === 1) {
        if (fg !== null) clearTimeout(fg), fg = null;
        U75(), F7A()
    }
}
// @from(Ln 511884, Col 0)
function p75() {
    if (RW6 > 0) RW6--;
    if (RW6 === 0 && fg === null) fg = setTimeout(() => {
        fg = null, g75(), JX7()
    }, B7A), fg.unref()
}
// @from(Ln 511891, Col 0)
function p7A() {
    if (RW6 = 0, fg !== null) clearTimeout(fg), fg = null;
    g75(), JX7()
}
// @from(Ln 511896, Col 0)
function F75() {
    let q = String(u7A);
    if (y1() === "macos") return ["caffeinate", ["-i", "-t", q]];
    return null
}
// @from(Ln 511902, Col 0)
function F7A() {
    if (F75() === null) return;
    if (lu6 !== null) return;
    lu6 = setInterval(() => {
        if (RW6 > 0 || fg !== null) E("Restarting sleep inhibitor to maintain prevention"), JX7(), U75()
    }, m7A), lu6.unref()
}
// @from(Ln 511910, Col 0)
function g75() {
    if (lu6 !== null) clearInterval(lu6), lu6 = null
}
// @from(Ln 511914, Col 0)
function U75() {
    let q = F75();
    if (q === null) return;
    if (vL !== null) return;
    if (!m75) m75 = !0, eq(async () => {
        p7A()
    });
    try {
        let [K, _] = q;
        vL = x7A(K, _, {
            stdio: "ignore",
            windowsHide: !0
        }), vL.unref();
        let z = vL;
        vL.on("error", (Y) => {
            if (E(`sleep inhibitor spawn error: ${Y.message}`), vL === z) vL = null
        }), vL.on("exit", () => {
            if (vL === z) vL = null
        }), E(`Started ${K} to prevent sleep`)
    } catch {
        vL = null
    }
}
// @from(Ln 511938, Col 0)
function JX7() {
    if (vL !== null) {
        let q = vL;
        vL = null;
        try {
            q.kill("SIGKILL"), E("Stopped sleep inhibitor, allowing sleep")
        } catch {}
    }
}
// @from(Ln 511947, Col 4)
u7A = 300
// @from(Ln 511948, Col 4)
m7A = 240000
// @from(Ln 511949, Col 4)
B7A = 30000
// @from(Ln 511950, Col 4)
vL = null
// @from(Ln 511951, Col 4)
lu6 = null
// @from(Ln 511952, Col 4)
fg = null
// @from(Ln 511953, Col 4)
RW6 = 0
// @from(Ln 511954, Col 4)
m75 = !1
// @from(Ln 511955, Col 4)
Q75 = L(() => {
    R9();
    K8();
    m8();
    NK()
})
// @from(Ln 511961, Col 4)
XX7 = L(() => {
    R9();
    K8();
    m8();
    Q4();
    U8();
    NK()
})
// @from(Ln 511969, Col 0)
class MX7 {
    _status = "idle";
    _generation = 0;
    _changed = l5();
    reserve() {
        if (this._status !== "idle") return !1;
        return this._status = "dispatching", this._notify(), !0
    }
    cancelReservation() {
        if (this._status !== "dispatching") return;
        this._status = "idle", this._notify()
    }
    tryStart() {
        if (this._status === "running") return null;
        return this._status = "running", ++this._generation, this._notify(), this._generation
    }
    end(q) {
        if (this._generation !== q) return !1;
        if (this._status !== "running") return !1;
        return this._status = "idle", this._notify(), !0
    }
    forceEnd() {
        if (this._status === "idle") return;
        this._status = "idle", ++this._generation, this._notify()
    }
    get isActive() {
        return this._status !== "idle"
    }
    get generation() {
        return this._generation
    }
    subscribe = this._changed.subscribe;
    getSnapshot = () => {
        return this._status !== "idle"
    };
    _notify() {
        this._changed.emit()
    }
}
// @from(Ln 512008, Col 4)
d75 = L(() => {
    nH()
})
// @from(Ln 512012, Col 0)
function c75(q) {
    let K = s(7),
        {
            name: _,
            color: z
        } = q,
        Y;
    if (K[0] !== z) Y = KG(z), K[0] = z, K[1] = Y;
    else Y = K[1];
    let A = Y,
        O;
    if (K[2] !== _) O = SW6.createElement(T, {
        bold: !0
    }, "@", _), K[2] = _, K[3] = O;
    else O = K[3];
    let w;
    if (K[4] !== A || K[5] !== O) w = SW6.createElement(u, {
        flexDirection: "row",
        gap: 1
    }, SW6.createElement(T, {
        color: A
    }, $9, " ", O)), K[4] = A, K[5] = O, K[6] = w;
    else w = K[6];
    return w
}
// @from(Ln 512037, Col 4)
SW6
// @from(Ln 512038, Col 4)
l75 = L(() => {
    o6();
    A3();
    g6();
    pt();
    SW6 = K6(P6(), 1)
})