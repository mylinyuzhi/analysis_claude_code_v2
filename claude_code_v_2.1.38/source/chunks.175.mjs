
// @from(Ln 451043, Col 4)
GXq = R((ewz) => {
    var rwz = h1("node:events").EventEmitter,
        vFA = h1("node:child_process"),
        uc = h1("node:path"),
        EFA = h1("node:fs"),
        c_ = h1("node:process"),
        {
            Argument: owz,
            humanReadableArgName: awz
        } = gT6(),
        {
            CommanderError: kFA
        } = Ac1(),
        {
            Help: swz
        } = NFA(),
        {
            Option: MXq,
            DualOptions: twz
        } = TFA(),
        {
            suggestSimilar: PXq
        } = jXq();
    class LFA extends rwz {
        constructor(A) {
            super();
            this.commands = [], this.options = [], this.parent = null, this._allowUnknownOption = !1, this._allowExcessArguments = !0, this.registeredArguments = [], this._args = this.registeredArguments, this.args = [], this.rawArgs = [], this.processedArgs = [], this._scriptPath = null, this._name = A || "", this._optionValues = {}, this._optionValueSources = {}, this._storeOptionsAsProperties = !1, this._actionHandler = null, this._executableHandler = !1, this._executableFile = null, this._executableDir = null, this._defaultCommandName = null, this._exitCallback = null, this._aliases = [], this._combineFlagAndOptionalValue = !0, this._description = "", this._summary = "", this._argsDescription = void 0, this._enablePositionalOptions = !1, this._passThroughOptions = !1, this._lifeCycleHooks = {}, this._showHelpAfterError = !1, this._showSuggestionAfterError = !0, this._outputConfiguration = {
                writeOut: (q) => c_.stdout.write(q),
                writeErr: (q) => c_.stderr.write(q),
                getOutHelpWidth: () => c_.stdout.isTTY ? c_.stdout.columns : void 0,
                getErrHelpWidth: () => c_.stderr.isTTY ? c_.stderr.columns : void 0,
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
            let [, w, H] = A.match(/([^ ]+) *(.*)/), $ = this.createCommand(w);
            if (Y) $.description(Y), $._executableHandler = !0;
            if (z.isDefault) this._defaultCommandName = $._name;
            if ($._hidden = !!(z.noHelp || z.hidden), $._executableFile = z.executableFile || null, H) $.arguments(H);
            if (this._registerCommand($), $.parent = this, $.copyInheritedSettings(this), Y) return this;
            return $
        }
        createCommand(A) {
            return new LFA(A)
        }
        createHelp() {
            return Object.assign(new swz, this.configureHelp())
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
            return new owz(A, q)
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
            let [, K, Y] = A.match(/([^ ]+) *(.*)/), z = q ?? "display help for command", w = this.createCommand(K);
            if (w.helpOption(!1), Y) w.arguments(Y);
            if (z) w.description(z);
            return this._addImplicitHelpCommand = !0, this._helpCommand = w, this
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
            if (this._exitCallback) this._exitCallback(new kFA(A, q, K));
            c_.exit(A)
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
            return new MXq(A, q)
        }
        _callParseArg(A, q, K, Y) {
            try {
                return A.parseArg(q, K)
            } catch (z) {
                if (z.code === "commander.invalidArgument") {
                    let w = `${Y} ${z.message}`;
                    this.error(w, {
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
            let Y = (z, w, H) => {
                if (z == null && A.presetArg !== void 0) z = A.presetArg;
                let $ = this.getOptionValue(K);
                if (z !== null && A.parseArg) z = this._callParseArg(A, z, $, w);
                else if (z !== null && A.variadic) z = A._concatValue(z, $);
                if (z == null)
                    if (A.negate) z = !1;
                    else if (A.isBoolean() || A.optional) z = !0;
                else z = "";
                this.setOptionValueWithSource(K, z, H)
            };
            if (this.on("option:" + q, (z) => {
                    let w = `error: option '${A.flags}' argument '${z}' is invalid.`;
                    Y(z, w, "cli")
                }), A.envVar) this.on("optionEnv:" + q, (z) => {
                let w = `error: option '${A.flags}' value '${z}' from env '${A.envVar}' is invalid.`;
                Y(z, w, "env")
            });
            return this
        }
        _optionEx(A, q, K, Y, z) {
            if (typeof q === "object" && q instanceof MXq) throw Error("To add an Option object use addOption() instead of option() or requiredOption()");
            let w = this.createOption(q, K);
            if (w.makeOptionMandatory(!!A.mandatory), typeof Y === "function") w.default(z).argParser(Y);
            else if (Y instanceof RegExp) {
                let H = Y;
                Y = ($, O) => {
                    let _ = H.exec($);
                    return _ ? _[0] : O
                }, w.default(z).argParser(Y)
            } else w.default(Y);
            return this.addOption(w)
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
                if (c_.versions?.electron) q.from = "electron";
                let Y = c_.execArgv ?? [];
                if (Y.includes("-e") || Y.includes("--eval") || Y.includes("-p") || Y.includes("--print")) q.from = "eval"
            }
            if (A === void 0) A = c_.argv;
            this.rawArgs = A.slice();
            let K;
            switch (q.from) {
                case void 0:
                case "node":
                    this._scriptPath = A[1], K = A.slice(2);
                    break;
                case "electron":
                    if (c_.defaultApp) this._scriptPath = A[1], K = A.slice(2);
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

            function z(_, J) {
                let X = uc.resolve(_, J);
                if (EFA.existsSync(X)) return X;
                if (Y.includes(uc.extname(J))) return;
                let D = Y.find((j) => EFA.existsSync(`${X}${j}`));
                if (D) return `${X}${D}`;
                return
            }
            this._checkForMissingMandatoryOptions(), this._checkForConflictingOptions();
            let w = A._executableFile || `${this._name}-${A._name}`,
                H = this._executableDir || "";
            if (this._scriptPath) {
                let _;
                try {
                    _ = EFA.realpathSync(this._scriptPath)
                } catch (J) {
                    _ = this._scriptPath
                }
                H = uc.resolve(uc.dirname(_), H)
            }
            if (H) {
                let _ = z(H, w);
                if (!_ && !A._executableFile && this._scriptPath) {
                    let J = uc.basename(this._scriptPath, uc.extname(this._scriptPath));
                    if (J !== this._name) _ = z(H, `${J}-${A._name}`)
                }
                w = _ || w
            }
            K = Y.includes(uc.extname(w));
            let $;
            if (c_.platform !== "win32")
                if (K) q.unshift(w), q = WXq(c_.execArgv).concat(q), $ = vFA.spawn(c_.argv[0], q, {
                    stdio: "inherit"
                });
                else $ = vFA.spawn(w, q, {
                    stdio: "inherit"
                });
            else q.unshift(w), q = WXq(c_.execArgv).concat(q), $ = vFA.spawn(c_.execPath, q, {
                stdio: "inherit"
            });
            if (!$.killed)["SIGUSR1", "SIGUSR2", "SIGTERM", "SIGINT", "SIGHUP"].forEach((J) => {
                c_.on(J, () => {
                    if ($.killed === !1 && $.exitCode === null) $.kill(J)
                })
            });
            let O = this._exitCallback;
            $.on("close", (_) => {
                if (_ = _ ?? 1, !O) c_.exit(_);
                else O(new kFA(_, "commander.executeSubCommandAsync", "(close)"))
            }), $.on("error", (_) => {
                if (_.code === "ENOENT") {
                    let J = H ? `searched for local subcommand relative to directory '${H}'` : "no directory for search for local subcommand, use .executableDir() to supply a custom directory",
                        X = `'${w}' does not exist
 - if '${A._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${J}`;
                    throw Error(X)
                } else if (_.code === "EACCES") throw Error(`'${w}' not executable`);
                if (!O) c_.exit(1);
                else {
                    let J = new kFA(1, "commander.executeSubCommandAsync", "(error)");
                    J.nestedError = _, O(J)
                }
            }), this.runningCommand = $
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
                let w = Y;
                if (Y !== null && K.parseArg) {
                    let H = `error: command-argument value '${Y}' is invalid for argument '${K.name()}'.`;
                    w = this._callParseArg(K, Y, z, H)
                }
                return w
            };
            this._checkNumberOfArguments();
            let q = [];
            this.registeredArguments.forEach((K, Y) => {
                let z = K.defaultValue;
                if (K.variadic) {
                    if (Y < this.args.length) {
                        if (z = this.args.slice(Y), K.parseArg) z = z.reduce((w, H) => {
                            return A(K, H, w)
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
                    z._lifeCycleHooks[q].forEach((w) => {
                        Y.push({
                            hookedCommand: z,
                            callback: w
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
                let w;
                if (w = this._chainOrCallHooks(w, "preAction"), w = this._chainOrCall(w, () => this._actionHandler(this.processedArgs)), this.parent) w = this._chainOrCall(w, () => {
                    this.parent.emit(z, A, q)
                });
                return w = this._chainOrCallHooks(w, "postAction"), w
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

            function w($) {
                return $.length > 1 && $[0] === "-"
            }
            let H = null;
            while (z.length) {
                let $ = z.shift();
                if ($ === "--") {
                    if (Y === K) Y.push($);
                    Y.push(...z);
                    break
                }
                if (H && !w($)) {
                    this.emit(`option:${H.name()}`, $);
                    continue
                }
                if (H = null, w($)) {
                    let O = this._findOption($);
                    if (O) {
                        if (O.required) {
                            let _ = z.shift();
                            if (_ === void 0) this.optionMissingArgument(O);
                            this.emit(`option:${O.name()}`, _)
                        } else if (O.optional) {
                            let _ = null;
                            if (z.length > 0 && !w(z[0])) _ = z.shift();
                            this.emit(`option:${O.name()}`, _)
                        } else this.emit(`option:${O.name()}`);
                        H = O.variadic ? O : null;
                        continue
                    }
                }
                if ($.length > 2 && $[0] === "-" && $[1] !== "-") {
                    let O = this._findOption(`-${$[1]}`);
                    if (O) {
                        if (O.required || O.optional && this._combineFlagAndOptionalValue) this.emit(`option:${O.name()}`, $.slice(2));
                        else this.emit(`option:${O.name()}`), z.unshift(`-${$.slice(2)}`);
                        continue
                    }
                }
                if (/^--[^=]+=/.test($)) {
                    let O = $.indexOf("="),
                        _ = this._findOption($.slice(0, O));
                    if (_ && (_.required || _.optional)) {
                        this.emit(`option:${_.name()}`, $.slice(O + 1));
                        continue
                    }
                }
                if (w($)) Y = K;
                if ((this._enablePositionalOptions || this._passThroughOptions) && q.length === 0 && K.length === 0) {
                    if (this._findCommand($)) {
                        if (q.push($), z.length > 0) K.push(...z);
                        break
                    } else if (this._getHelpCommand() && $ === this._getHelpCommand().name()) {
                        if (q.push($), z.length > 0) q.push(...z);
                        break
                    } else if (this._defaultCommandName) {
                        if (K.push($), z.length > 0) K.push(...z);
                        break
                    }
                }
                if (this._passThroughOptions) {
                    if (Y.push($), z.length > 0) Y.push(...z);
                    break
                }
                Y.push($)
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
                if (A.envVar && A.envVar in c_.env) {
                    let q = A.attributeName();
                    if (this.getOptionValue(q) === void 0 || ["default", "config", "env"].includes(this.getOptionValueSource(q)))
                        if (A.required || A.optional) this.emit(`optionEnv:${A.name()}`, c_.env[A.envVar]);
                        else this.emit(`optionEnv:${A.name()}`)
                }
            })
        }
        _parseOptionsImplied() {
            let A = new twz(this.options),
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
            let K = (w) => {
                    let H = w.attributeName(),
                        $ = this.getOptionValue(H),
                        O = this.options.find((J) => J.negate && H === J.attributeName()),
                        _ = this.options.find((J) => !J.negate && H === J.attributeName());
                    if (O && (O.presetArg === void 0 && $ === !1 || O.presetArg !== void 0 && $ === O.presetArg)) return O;
                    return _ || w
                },
                Y = (w) => {
                    let H = K(w),
                        $ = H.attributeName();
                    if (this.getOptionValueSource($) === "env") return `environment variable '${H.envVar}'`;
                    return `option '${H.flags}'`
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
                    let w = z.createHelp().visibleOptions(z).filter((H) => H.long).map((H) => H.long);
                    Y = Y.concat(w), z = z.parent
                } while (z && !z._enablePositionalOptions);
                q = PXq(A, Y)
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
                }), q = PXq(A, Y)
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
                    return awz(K)
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
            return this._name = uc.basename(A, uc.extname(A)), this
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
            let q = c_.exitCode || 0;
            if (q === 0 && A && typeof A !== "function" && A.error) q = 1;
            this._exit(q, "commander.help", "(outputHelp)")
        }
        addHelpText(A, q) {
            let K = ["beforeAll", "before", "after", "afterAll"];
            if (!K.includes(A)) throw Error(`Unexpected value for position to addHelpText.
Expecting one of '${K.join("', '")}'`);
            let Y = `${A}Help`;
            return this.on(Y, (z) => {
                let w;
                if (typeof q === "function") w = q({
                    error: z.error,
                    command: z.command
                });
                else w = q;
                if (w) z.write(`${w}
`)
            }), this
        }
        _outputHelpIfRequested(A) {
            let q = this._getHelpOption();
            if (q && A.find((Y) => q.is(Y))) this.outputHelp(), this._exit(0, "commander.helpDisplayed", "(outputHelp)")
        }
    }

    function WXq(A) {
        return A.map((q) => {
            if (!q.startsWith("--inspect")) return q;
            let K, Y = "127.0.0.1",
                z = "9229",
                w;
            if ((w = q.match(/^(--inspect(-brk)?)$/)) !== null) K = w[1];
            else if ((w = q.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null)
                if (K = w[1], /^\d+$/.test(w[3])) z = w[3];
                else Y = w[3];
            else if ((w = q.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) K = w[1], Y = w[3], z = w[4];
            if (K && z !== "0") return `${K}=${Y}:${parseInt(z)+1}`;
            return q
        })
    }
    ewz.Command = LFA
})
// @from(Ln 451919, Col 4)
NXq = R((YHz) => {
    var {
        Argument: ZXq
    } = gT6(), {
        Command: RFA
    } = GXq(), {
        CommanderError: qHz,
        InvalidArgumentError: fXq
    } = Ac1(), {
        Help: KHz
    } = NFA(), {
        Option: VXq
    } = TFA();
    YHz.program = new RFA;
    YHz.createCommand = (A) => new RFA(A);
    YHz.createOption = (A, q) => new VXq(A, q);
    YHz.createArgument = (A, q) => new ZXq(A, q);
    YHz.Command = RFA;
    YHz.Option = VXq;
    YHz.Argument = ZXq;
    YHz.Help = KHz;
    YHz.CommanderError = qHz;
    YHz.InvalidArgumentError = fXq;
    YHz.InvalidOptionArgumentError = fXq
})
// @from(Ln 451944, Col 4)
vXq = R((LE, TXq) => {
    var eI = NXq();
    LE = TXq.exports = {};
    LE.program = new eI.Command;
    LE.Argument = eI.Argument;
    LE.Command = eI.Command;
    LE.CommanderError = eI.CommanderError;
    LE.Help = eI.Help;
    LE.InvalidArgumentError = eI.InvalidArgumentError;
    LE.InvalidOptionArgumentError = eI.InvalidArgumentError;
    LE.Option = eI.Option;
    LE.createCommand = (A) => new eI.Command(A);
    LE.createOption = (A, q) => new eI.Option(A, q);
    LE.createArgument = (A, q) => new eI.Argument(A, q)
})
// @from(Ln 451959, Col 4)
EXq
// @from(Ln 451959, Col 9)
Oh$
// @from(Ln 451959, Col 14)
_h$
// @from(Ln 451959, Col 19)
Jh$
// @from(Ln 451959, Col 24)
Xh$
// @from(Ln 451959, Col 29)
Dh$
// @from(Ln 451959, Col 34)
kXq
// @from(Ln 451959, Col 39)
jh$
// @from(Ln 451959, Col 44)
UT6
// @from(Ln 451959, Col 49)
Mh$
// @from(Ln 451959, Col 54)
J5
// @from(Ln 451959, Col 58)
Ph$
// @from(Ln 451960, Col 4)
yFA = v(() => {
    EXq = o(vXq(), 1), {
        program: Oh$,
        createCommand: _h$,
        createArgument: Jh$,
        createOption: Xh$,
        CommanderError: Dh$,
        InvalidArgumentError: kXq,
        InvalidOptionArgumentError: jh$,
        Command: UT6,
        Argument: Mh$,
        Option: J5,
        Help: Ph$
    } = EXq.default
})
// @from(Ln 451976, Col 0)
function pT6(A) {
    return A.map((q) => ({
        name: P5(q.name),
        type: q.type,
        hasTools: q.type === "connected" && q.capabilities?.tools !== void 0,
        hasResources: q.type === "connected" && q.capabilities?.resources !== void 0,
        hasPrompts: q.type === "connected" && q.capabilities?.prompts !== void 0,
        serverInfo: q.type === "connected" && "serverInfo" in q ? q.serverInfo : void 0
    }))
}
// @from(Ln 451986, Col 4)
CFA = () => {}
// @from(Ln 451988, Col 0)
function dT6(A, q) {
    let K = q?.server,
        Y = K ? P5(K) : void 0,
        z = Y ? `mcp__${Y}__` : "mcp__";
    return A.filter((H) => H.name.startsWith(z)).map((H) => {
        let $ = VD(H.name);
        return {
            server: $?.serverName || "unknown",
            name: $?.toolName || H.name,
            description: typeof H.description === "function" ? void 0 : H.description || "",
            fullName: H.name
        }
    })
}
// @from(Ln 452002, Col 4)
SFA = v(() => {
    _T()
})
// @from(Ln 452005, Col 0)
async function cT6(A, {
    server: q,
    toolName: K
}) {
    let Y = A.find((w) => w.name === `mcp__${q}__${K}`);
    if (!Y) return null;
    let z = "";
    if (typeof Y.description === "string") z = Y.description;
    else if (typeof Y.description === "function") try {
        z = await Y.description({}, {
            isNonInteractiveSession: !0,
            toolPermissionContext: QD(),
            tools: []
        }) || ""
    } catch {}
    return {
        server: q,
        name: K,
        fullName: Y.name,
        description: z,
        inputSchema: Y.inputJSONSchema || {}
    }
}
// @from(Ln 452028, Col 4)
hFA = () => {}
// @from(Ln 452030, Col 0)
function lT6(A, {
    pattern: q,
    ignoreCase: K
}) {
    let Y;
    try {
        Y = new RegExp(q, K ? "i" : "")
    } catch (H) {
        throw Error(`Invalid regex pattern: ${H instanceof Error?H.message:String(H)}`)
    }
    let z = A.filter((H) => H.name.startsWith("mcp__")),
        w = [];
    for (let H of z) {
        let $ = VD(H.name),
            O = $?.serverName || "unknown",
            _ = $?.toolName || H.name,
            J = typeof H.description === "string" ? H.description : "";
        if (Y.test(_) || Y.test(J)) w.push({
            server: O,
            name: _,
            fullName: H.name,
            description: J
        })
    }
    return w
}
// @from(Ln 452056, Col 4)
IFA = v(() => {
    _T()
})
// @from(Ln 452060, Col 0)
function iT6(A, q, K) {
    let Y = q?.server;
    if (Y) {
        let z = A[Y] || [],
            w = Y;
        if (z.length === 0 && K) {
            let H = K[Y];
            if (H && A[H]) z = A[H], w = H
        }
        return z.map((H) => ({
            ...H,
            server: P5(w)
        }))
    }
    return Object.entries(A).flatMap(([z, w]) => w.map((H) => ({
        ...H,
        server: P5(z)
    })))
}
// @from(Ln 452079, Col 4)
xFA = () => {}
// @from(Ln 452080, Col 4)
PHz
// @from(Ln 452080, Col 9)
LXq
// @from(Ln 452080, Col 14)
WHz
// @from(Ln 452080, Col 19)
RXq
// @from(Ln 452080, Col 24)
GHz
// @from(Ln 452080, Col 29)
yXq
// @from(Ln 452080, Col 34)
ZHz
// @from(Ln 452080, Col 39)
fHz
// @from(Ln 452080, Col 44)
CXq
// @from(Ln 452080, Col 49)
VHz
// @from(Ln 452080, Col 54)
SXq
// @from(Ln 452080, Col 59)
NHz
// @from(Ln 452080, Col 64)
hXq
// @from(Ln 452081, Col 4)
bFA = v(() => {
    i7();
    PHz = u.object({
        command: u.literal("servers")
    }), LXq = u.array(u.object({
        name: u.string(),
        type: u.string(),
        hasTools: u.boolean().optional(),
        hasResources: u.boolean().optional(),
        hasPrompts: u.boolean().optional(),
        serverInfo: u.object({
            name: u.string(),
            version: u.string()
        }).optional()
    })), WHz = u.object({
        command: u.literal("tools"),
        params: u.object({
            server: u.string().optional()
        }).optional()
    }), RXq = u.array(u.object({
        server: u.string(),
        name: u.string(),
        description: u.string().optional(),
        fullName: u.string()
    })), GHz = u.object({
        command: u.literal("info"),
        params: u.object({
            server: u.string(),
            toolName: u.string()
        })
    }), yXq = u.object({
        server: u.string(),
        name: u.string(),
        fullName: u.string(),
        description: u.string(),
        inputSchema: u.record(u.string(), u.unknown())
    }).or(u.null()), ZHz = u.object({
        command: u.literal("call"),
        params: u.object({
            server: u.string(),
            tool: u.string(),
            args: u.record(u.string(), u.unknown()),
            timeoutMs: u.number().optional()
        })
    }), fHz = u.object({
        command: u.literal("grep"),
        params: u.object({
            pattern: u.string(),
            ignoreCase: u.boolean().optional()
        })
    }), CXq = u.array(u.object({
        server: u.string(),
        name: u.string(),
        fullName: u.string(),
        description: u.string()
    })), VHz = u.object({
        command: u.literal("resources"),
        params: u.object({
            server: u.string().optional()
        }).optional()
    }), SXq = u.array(u.object({
        uri: u.string(),
        name: u.string().optional(),
        description: u.string().optional(),
        mimeType: u.string().optional(),
        server: u.string()
    })), NHz = u.object({
        command: u.literal("read"),
        params: u.object({
            server: u.string(),
            uri: u.string(),
            timeoutMs: u.number().optional()
        })
    }), hXq = u.discriminatedUnion("command", [PHz, WHz, GHz, ZHz, fHz, VHz, NHz])
})
// @from(Ln 452164, Col 0)
function nT6() {
    let A = Af1();
    return THz(hc(), `${A}.endpoint`)
}
// @from(Ln 452169, Col 0)
function _f1(A) {
    if (A) uFA = A;
    if (!uFA) return;
    EHz(hc(), {
        recursive: !0
    });
    let q = nT6(),
        K = Buffer.from(Q1(uFA)).toString("base64");
    c8(q, K, {
        mode: 384
    })
}
// @from(Ln 452182, Col 0)
function IXq() {
    let A = nT6();
    try {
        let q = vHz(A, "utf-8");
        return _A(Buffer.from(q, "base64").toString("utf-8"))
    } catch {
        return null
    }
}
// @from(Ln 452191, Col 4)
uFA = null
// @from(Ln 452192, Col 4)
qc1 = v(() => {
    m6();
    qf1();
    m6()
})
// @from(Ln 452198, Col 0)
function Jf1(A, q, K) {
    let Y = A.find((w) => w.name === q);
    if (Y) return Y;
    let z = K?.[q];
    if (z) return A.find((w) => w.name === z);
    return
}
// @from(Ln 452206, Col 0)
function YY1(A, q) {
    if (!q) return Error(`Server '${A}' not found`);
    if (q !== "connected") return Error(`Server '${A}' is not connected (${q==="needs-auth"?"needs authentication":q}). Run '/mcp' to manage server connections.`);
    return null
}
// @from(Ln 452211, Col 4)
BXq = {}
// @from(Ln 452220, Col 0)
function bXq() {
    if (BFA === void 0) BFA = IXq();
    return BFA
}
// @from(Ln 452225, Col 0)
function RE() {
    let A = bc(),
        q = bXq();
    if (!xXq) {
        if (xXq = !0, A && q === null) {
            let K = nT6(),
                Y = Af1();
            console.error(H6.yellow(`Warning: MCP endpoint file not found at ${K} (session: ${Y}). Falling back to state file.`))
        }
    }
    return A && q !== null
}
// @from(Ln 452237, Col 0)
async function Yc1(A, q, K, Y) {
    let z = Date.now();
    try {
        let w = await q();
        if (!RE()) {
            let H = typeof K === "function" ? K(w) : K || {};
            await ml("tengu_mcp_cli_command_executed", {
                command: A,
                success: !0,
                duration_ms: Date.now() - z,
                ...H
            })
        }
        return {
            success: !0,
            data: w
        }
    } catch (w) {
        let H = w instanceof Error ? w : Error(String(w));
        if (console.error(H6.red("Error:"), H.message), !RE()) {
            let $ = typeof K === "object" ? K : {};
            await ml("tengu_mcp_cli_command_executed", {
                command: A,
                success: !1,
                error_type: H.constructor.name,
                duration_ms: Date.now() - z,
                ...$,
                ...Y
            })
        }
        return {
            success: !1,
            error: H
        }
    }
}
// @from(Ln 452274, Col 0)
function ee() {
    let A = ST6();
    if (!LHz(A)) {
        let q = Af1();
        throw Error(`MCP state file not found at ${A} (session: ${q}). Is Claude Code running?`)
    }
    try {
        return _A(kHz(A, "utf-8"))
    } catch (q) {
        throw Error(`Error reading MCP state file ${A}: ${q instanceof Error?q.message:String(q)}`)
    }
}
// @from(Ln 452287, Col 0)
function uXq(A, q) {
    if (A.configs?.[q]) return A.configs[q];
    let K = A.normalizedNames?.[q];
    if (K && A.configs?.[K]) return A.configs[K];
    return
}
// @from(Ln 452294, Col 0)
function RHz(A, q) {
    if (A.resources?.[q]) return A.resources[q];
    let K = A.normalizedNames?.[q];
    if (K && A.resources?.[K]) return A.resources[K];
    return []
}
// @from(Ln 452301, Col 0)
function mFA(A) {
    let q = A.split("/");
    if (q.length !== 2 || !q[0] || !q[1]) throw Error(`Invalid tool identifier '${A}'. Expected format: <server>/<tool>`);
    return {
        server: q[0],
        tool: q[1]
    }
}
// @from(Ln 452309, Col 0)
async function zY1(A, q, K = 1e4) {
    let Y = bXq();
    if (!Y) throw Error("MCP CLI endpoint not enabled");
    try {
        let z = await sA({
            method: "POST",
            url: `${Y.url}/mcp`,
            data: q,
            headers: {
                Authorization: `Bearer ${Y.key}`,
                "Content-Type": "application/json"
            },
            timeout: K,
            validateStatus: () => !0
        });
        if (z.status >= 400) {
            let w = u.object({
                    error: u.string().optional(),
                    type: u.string().optional()
                }).safeParse(z.data),
                H = w.success ? w.data : {},
                $ = Error(H.error || `HTTP ${z.status}: ${z.statusText}`);
            if (H.type) $.name = H.type;
            throw $
        }
        return A.parse(z.data)
    } catch (z) {
        if (sA.isAxiosError(z)) {
            if (z.code === "ECONNREFUSED") throw Error("Connection refused - is the MCP endpoint running?");
            if (z.code === "ETIMEDOUT" || z.message.includes("timeout")) throw Error("Request timeout");
            if (z.message.startsWith("HTTP ")) throw z;
            throw Error(`Network error: ${z.message}`)
        }
        throw z
    }
}
// @from(Ln 452345, Col 0)
async function yHz(A, q, K, Y) {
    let z = ee(),
        w = uXq(z, q);
    if (!w) throw Error(`Server '${q}' not found`);
    if (Y.debug) console.error(`Connecting to ${q} (${w.type})...`);
    let H = await Qm(q, w);
    if (H.client.type !== "connected") throw YY1(q, H.client.type) ?? new Kc1(`Failed to connect to server '${q}'`);
    let $ = (() => {
        let X = `mcp__${P5(q)}__${P5(A)}`;
        return z.tools.find((j) => j.name === X)?.originalToolName || A
    })();
    if (Y.debug) console.error(`Calling tool ${$}...`);
    let O = parseInt(Y.timeout || "", 10) || Ft(),
        _ = await H.client.client.request({
            method: "tools/call",
            params: {
                name: $,
                arguments: K
            }
        }, ZZ, {
            signal: AbortSignal.timeout(O)
        });
    return H.client.client.close(), _
}
// @from(Ln 452369, Col 0)
async function CHz(A, q, K) {
    let Y = ee(),
        z = uXq(Y, A);
    if (!z) throw Error(`Server '${A}' not found`);
    if (K.debug) console.error(`Connecting to ${A} (${z.type})...`);
    let w = await Qm(A, z);
    if (w.client.type !== "connected") throw YY1(A, w.client.type) ?? new Kc1(`Failed to connect to server '${A}'`);
    if (K.debug) console.error(`Reading resource: ${q}`);
    let H = parseInt(K.timeout || "", 10) || Ft(),
        $ = await w.client.client.readResource({
            uri: q
        }, {
            signal: AbortSignal.timeout(H)
        });
    return w.client.client.close(), $
}
// @from(Ln 452385, Col 0)
async function SHz(A) {
    Yf1();
    try {
        return await A11.parseAsync(A, {
            from: "user"
        }), 0
    } catch (q) {
        return console.error(H6.red("Error:"), q), 1
    }
}
// @from(Ln 452395, Col 4)
BFA
// @from(Ln 452395, Col 9)
xXq = !1
// @from(Ln 452396, Col 4)
Kc1
// @from(Ln 452396, Col 9)
A11
// @from(Ln 452397, Col 4)
mXq = v(() => {
    yFA();
    qf1();
    q3();
    SW();
    cA();
    u6();
    U$();
    i7();
    y5();
    CFA();
    SFA();
    hFA();
    IFA();
    xFA();
    bFA();
    gD();
    Tj();
    qc1();
    m6();
    Kc1 = class Kc1 extends Error {
        constructor(A) {
            super(A);
            this.name = "ConnectionFailedError"
        }
    };
    A11 = new UT6().name("mcp-cli").description("Interact with MCP servers and tools").version("1.0.0");
    A11.command("servers").description("List all connected MCP servers").option("--json", "Output in JSON format").action(async (A) => {
        let q = await Yc1("servers", async () => {
            return RE() ? await zY1(LXq, {
                command: "servers"
            }) : pT6(ee().clients)
        }, (Y) => ({
            server_count: Y.length
        }));
        if (!q.success) process.exit(1);
        let K = q.data;
        if (A.json) console.log(Q1(K));
        else K.forEach((Y) => {
            let z = Y.type === "connected" ? H6.green("connected") : Y.type === "failed" ? H6.red("failed") : H6.yellow(Y.type),
                w = "";
            if (Y.type === "connected") {
                let H = [];
                if (Y.hasTools) H.push("tools");
                if (Y.hasResources) H.push("resources");
                if (Y.hasPrompts) H.push("prompts");
                if (H.length > 0) w = ` (${H.join(", ")})`
            }
            console.log(`${Y.name} - ${z}${w}`)
        })
    });
    A11.command("tools").description("List all available tools").argument("[server]", "Filter by server name").option("--json", "Output in JSON format").action(async (A, q) => {
        let K = {
                server: A
            },
            Y = await Yc1("tools", async () => {
                return RE() ? await zY1(RXq, {
                    command: "tools",
                    params: K
                }) : dT6(ee().tools, K)
            }, (w) => ({
                tool_count: w.length,
                filtered: !!A
            }));
        if (!Y.success) process.exit(1);
        let z = Y.data;
        if (q.json) console.log(Q1(z));
        else if (A) z.forEach((w) => console.log(w.name));
        else z.forEach((w) => console.log(`${w.server}/${w.name}`))
    });
    A11.command("info").description("Get detailed information about a tool").argument("<tool>", "Tool identifier in format <server>/<tool>").option("--json", "Output in JSON format").action(async (A, q) => {
        let K = await Yc1("info", async () => {
            let {
                server: z,
                tool: w
            } = mFA(A), H = {
                server: z,
                toolName: w
            };
            if (RE()) return await zY1(yXq, {
                command: "info",
                params: H
            });
            let $ = ee(),
                O = await cT6($.tools, H);
            if (!O) {
                let _ = Jf1($.clients, z, $.normalizedNames),
                    J = YY1(z, _?.type);
                if (J) throw J;
                throw Error(`Tool '${w}' not found on server '${z}'`)
            }
            return O
        }, () => ({
            tool_found: !0
        }), {
            tool_found: !1
        });
        if (!K.success) process.exit(1);
        let Y = K.data;
        if (q.json) console.log(Q1(Y));
        else {
            if (console.log(H6.bold(`Tool: ${A}`)), console.log(H6.dim(`Server: ${Y.server}`)), Y.description) console.log(H6.dim(`Description: ${Y.description}`));
            console.log(), console.log(H6.bold("Input Schema:")), console.log(Q1(Y.inputSchema, null, 2))
        }
    });
    A11.command("call").description("Invoke an MCP tool").argument("<tool>", "Tool identifier in format <server>/<tool>").argument("<args>", 'Tool arguments as JSON string or "-" for stdin').option("--json", "Output in JSON format").option("--timeout <ms>", "Timeout in milliseconds (default: MCP_TOOL_TIMEOUT env var or effectively infinite)").option("--debug", "Show debug output").action(async (A, q, K) => {
        let {
            server: Y,
            tool: z
        } = mFA(A);
        if (q === "-") {
            let O = [];
            for await (let _ of process.stdin) O.push(_);
            q = Buffer.concat(O).toString("utf-8").trim()
        }
        let w;
        try {
            w = _A(q)
        } catch (O) {
            console.error(H6.red("Error: Invalid JSON arguments")), console.error(String(O)), process.exit(1)
        }
        let H = `mcp__${P5(Y)}__${P5(z)}`,
            $ = Date.now();
        try {
            let O = parseInt(K.timeout || "", 10) || Ft(),
                _ = {
                    server: Y,
                    tool: z,
                    args: w,
                    timeoutMs: O
                },
                J = RE() ? await zY1(ZZ, {
                    command: "call",
                    params: _
                }, O) : await yHz(z, Y, w, K),
                X = K.json ? Q1(J) : typeof J === "string" ? J : Q1(J, null, 2);
            if (await new Promise((D) => {
                    process.stdout.write(X + `
`, () => D())
                }), !RE()) await ml("tengu_mcp_cli_command_executed", {
                command: "call",
                tool_name: AK(H),
                success: !0,
                duration_ms: Date.now() - $
            });
            process.exit(0)
        } catch (O) {
            console.error(H6.red("Error calling tool:"), String(O));
            let _ = Date.now() - $,
                J = String(O).slice(0, 2000);
            if (!RE()) await ml("tengu_tool_use_error", {
                toolName: AK(H),
                isMcp: !0,
                error: J,
                durationMs: _
            }), await ml("tengu_mcp_cli_command_executed", {
                command: "call",
                tool_name: AK(H),
                success: !1,
                error_type: O instanceof Kc1 ? "connection_failed" : "tool_execution_failed",
                duration_ms: Date.now() - $
            });
            process.exit(1)
        }
    });
    A11.command("grep").description("Search tool names and descriptions using regex patterns").argument("<pattern>", "Regex pattern to search for").option("--json", "Output in JSON format").option("-i, --ignore-case", "Case insensitive search (default: true)", !0).action(async (A, q) => {
        let K = await Yc1("grep", async () => {
            try {
                new RegExp(A, q.ignoreCase ? "i" : "")
            } catch (w) {
                throw Error(`Invalid regex pattern: ${w instanceof Error?w.message:String(w)}`)
            }
            let z = {
                pattern: A,
                ignoreCase: q.ignoreCase
            };
            return RE() ? await zY1(CXq, {
                command: "grep",
                params: z
            }) : lT6(ee().tools, z)
        }, (z) => ({
            match_count: z.length
        }));
        if (!K.success) process.exit(1);
        let Y = K.data;
        if (q.json) console.log(Q1(Y));
        else if (Y.length === 0) console.log(H6.yellow("No tools found matching pattern"));
        else Y.forEach((z) => {
            if (console.log(H6.bold(`${z.server}/${z.name}`)), z.description) {
                let w = z.description.length > 100 ? z.description.slice(0, 100) + "..." : z.description;
                console.log(H6.dim(`  ${w}`))
            }
            console.log()
        })
    });
    A11.command("resources").description("List MCP resources").argument("[server]", "Filter by server name").option("--json", "Output in JSON format").action(async (A, q) => {
        let K = {
                server: A
            },
            Y = await Yc1("resources", async () => {
                if (RE()) return await zY1(SXq, {
                    command: "resources",
                    params: K
                });
                else {
                    let w = ee();
                    return iT6(w.resources, K, w.normalizedNames)
                }
            }, (w) => ({
                resource_count: w.length,
                filtered: !!A
            }));
        if (!Y.success) process.exit(1);
        let z = Y.data;
        if (q.json) console.log(Q1(z));
        else z.forEach((w) => {
            console.log(`${w.server}/${w.name||w.uri}`)
        })
    });
    A11.command("read").description("Read an MCP resource").argument("<resource>", "Resource identifier in format <server>/<resource> or <server> <uri>").argument("[uri]", "Optional: Direct resource URI (file://, https://, etc.)").option("--json", "Output in JSON format").option("--timeout <ms>", "Timeout in milliseconds (default: MCP_TOOL_TIMEOUT env var or effectively infinite)").option("--debug", "Show debug output").action(async (A, q, K) => {
        let Y, z, w;
        if (q) Y = A, w = q;
        else {
            let O = mFA(A);
            Y = O.server, z = O.tool
        }
        let H;
        if (w) {
            if (H = w, K.debug) console.log(`Using direct URI: ${H}`)
        } else {
            let O = ee(),
                J = RHz(O, Y).find((X) => X.name === z || X.uri === z);
            if (!J) console.error(H6.red(`Error: Resource '${z}' not found on server '${Y}'`)), process.exit(1);
            H = J.uri
        }
        let $ = Date.now();
        try {
            let O = parseInt(K.timeout || "", 10) || Ft(),
                _ = {
                    server: Y,
                    uri: H,
                    timeoutMs: O
                },
                J = RE() ? await zY1(Nq1, {
                    command: "read",
                    params: _
                }, O) : await CHz(Y, H, K);
            if (K.json) console.log(Q1(J));
            else if (J.contents && Array.isArray(J.contents)) J.contents.forEach((X) => {
                if (X && typeof X === "object") {
                    if ("text" in X) console.log(X.text);
                    else if ("blob" in X) {
                        console.log(H6.yellow("[Binary blob content]"));
                        let D = "mimeType" in X ? X.mimeType : void 0;
                        console.log(H6.dim(`MIME type: ${D||"unknown"}`))
                    }
                }
            });
            else console.log(Q1(J, null, 2));
            if (!RE()) await ml("tengu_mcp_cli_command_executed", {
                command: "read",
                success: !0,
                duration_ms: Date.now() - $
            });
            process.exit(0)
        } catch (O) {
            if (console.error(H6.red("Error reading resource:"), String(O)), !RE()) await ml("tengu_mcp_cli_command_executed", {
                command: "read",
                success: !1,
                error_type: O instanceof Kc1 ? "connection_failed" : "read_failed",
                duration_ms: Date.now() - $
            });
            process.exit(1)
        }
    })
})
// @from(Ln 452673, Col 4)
FXq = {}
// @from(Ln 452691, Col 0)
function BHz(A) {
    if (process.env.RIPGREP_EMBEDDED === "true") return uHz(process.execPath, ["--no-config", ...A], {
        argv0: "rg",
        stdio: "inherit"
    }).status ?? 1;
    let q;
    if (process.env.RIPGREP_NODE_PATH) q = h1(process.env.RIPGREP_NODE_PATH).ripgrepMain;
    else {
        let K = bHz(xHz(IHz(import.meta.url)), "ripgrep.node");
        q = hHz(import.meta.url)(K).ripgrepMain
    }
    return q(["--no-config", ...A])
}
// @from(Ln 452704, Col 4)
QXq = () => {}
// @from(Ln 452706, Col 0)
class zc1 {
    constructor(A = gXq.stdin, q = gXq.stdout) {
        this._stdin = A, this._stdout = q, this._readBuffer = new hb1, this._started = !1, this._ondata = (K) => {
            this._readBuffer.append(K), this.processReadBuffer()
        }, this._onerror = (K) => {
            var Y;
            (Y = this.onerror) === null || Y === void 0 || Y.call(this, K)
        }
    }
    async start() {
        if (this._started) throw Error("StdioServerTransport already started! If using Server class, note that connect() calls start() automatically.");
        this._started = !0, this._stdin.on("data", this._ondata), this._stdin.on("error", this._onerror)
    }
    processReadBuffer() {
        var A, q;
        while (!0) try {
            let K = this._readBuffer.readMessage();
            if (K === null) break;
            (A = this.onmessage) === null || A === void 0 || A.call(this, K)
        } catch (K) {
            (q = this.onerror) === null || q === void 0 || q.call(this, K)
        }
    }
    async close() {
        var A;
        if (this._stdin.off("data", this._ondata), this._stdin.off("error", this._onerror), this._stdin.listenerCount("data") === 0) this._stdin.pause();
        this._readBuffer.clear(), (A = this.onclose) === null || A === void 0 || A.call(this)
    }
    send(A) {
        return new Promise((q) => {
            let K = oH6(A);
            if (this._stdout.write(K)) q();
            else this._stdout.once("drain", q)
        })
    }
}
// @from(Ln 452742, Col 4)
FFA = v(() => {
    CJA()
})
// @from(Ln 452745, Col 4)
pXq = {}
// @from(Ln 452753, Col 0)
function QHz() {
    if (!x8("tengu_copper_bridge", !1)) return;
    if (J6(process.env.USE_LOCAL_OAUTH) || J6(process.env.LOCAL_BRIDGE)) return "ws://localhost:8765";
    if (J6(process.env.USE_STAGING_OAUTH)) return "wss://bridge-staging.claudeusercontent.com";
    return "wss://bridge.claudeusercontent.com"
}
// @from(Ln 452760, Col 0)
function gHz() {
    return J6(process.env.USE_LOCAL_OAUTH) || J6(process.env.LOCAL_BRIDGE)
}
// @from(Ln 452763, Col 0)
async function UHz() {
    Yf1();
    let A = new UXq,
        q = QHz();
    A.info(`Bridge URL: ${q??"none (using native socket)"}`);
    let K = {
            serverName: "Claude in Chrome",
            logger: A,
            socketPath: MG6(),
            getSocketPaths: Tn4,
            clientTypeId: "claude-code",
            onAuthenticationError: () => {
                A.warn("Authentication error occurred. Please ensure you are logged into the Claude browser extension with the same claude.ai account as Claude Code.")
            },
            onToolCallDisconnected: () => {
                return `Browser extension is not connected. Please ensure the Claude browser extension is installed and running (${mHz}), and that you are logged into claude.ai with the same account as Claude Code. If this is your first time connecting to Chrome, you may need to restart Chrome for the installation to take effect. If you continue to experience issues, please report a bug: ${FHz}`
            },
            onExtensionPaired: (w, H) => {
                jA(($) => {
                    if ($.chromeExtension?.pairedDeviceId === w && $.chromeExtension?.pairedDeviceName === H) return $;
                    return {
                        ...$,
                        chromeExtension: {
                            pairedDeviceId: w,
                            pairedDeviceName: H
                        }
                    }
                }), A.info(`Paired with "${H}" (${w.slice(0,8)})`)
            },
            getPersistedDeviceId: () => {
                return f6().chromeExtension?.pairedDeviceId
            },
            ...q && {
                bridgeConfig: {
                    url: q,
                    getUserId: async () => {
                        return f6().oauthAccount?.accountUuid
                    },
                    getOAuthToken: async () => {
                        return a4()?.accessToken ?? ""
                    },
                    ...gHz() && {
                        devUserId: "dev_user_local"
                    }
                }
            },
            ...process.env.CLAUDE_CHROME_PERMISSION_MODE && {
                initialPermissionMode: process.env.CLAUDE_CHROME_PERMISSION_MODE
            }
        },
        Y = KBA(K),
        z = new zc1;
    process.stdin.on("end", () => process.exit(0)), process.stdin.on("error", () => process.exit(0)), h("[Claude in Chrome] Starting MCP server"), await Y.connect(z), h("[Claude in Chrome] MCP server started")
}
// @from(Ln 452817, Col 0)
class UXq {
    silly(A, ...q) {
        h(wc1(A, ...q), {
            level: "debug"
        })
    }
    debug(A, ...q) {
        h(wc1(A, ...q), {
            level: "debug"
        })
    }
    info(A, ...q) {
        h(wc1(A, ...q), {
            level: "info"
        })
    }
    warn(A, ...q) {
        h(wc1(A, ...q), {
            level: "warn"
        })
    }
    error(A, ...q) {
        h(wc1(A, ...q), {
            level: "error"
        })
    }
}
// @from(Ln 452844, Col 4)
mHz = "https://claude.ai/chrome"
// @from(Ln 452845, Col 4)
FHz = "https://github.com/anthropics/claude-code/issues/new?labels=bug,claude-in-chrome"
// @from(Ln 452846, Col 4)
dXq = v(() => {
    Z6();
    FFA();
    QN6();
    J7();
    cA();
    hA();
    U4();
    kI()
})
// @from(Ln 452856, Col 4)
oXq = {}
// @from(Ln 452881, Col 0)
function q_(A, ...q) {
    if (iXq) {
        let K = new Date().toISOString(),
            Y = q.length > 0 ? " " + Q1(q) : "",
            z = `[${K}] [Claude Chrome Native Host] ${A}${Y}
`;
        try {
            rHz(iXq, z)
        } catch {}
    }
    console.error(`[Claude Chrome Native Host] ${A}`, ...q)
}
// @from(Ln 452894, Col 0)
function wY1(A) {
    let q = Buffer.from(A, "utf-8"),
        K = Buffer.alloc(4);
    K.writeUInt32LE(q.length, 0), process.stdout.write(K), process.stdout.write(q)
}
// @from(Ln 452899, Col 0)
async function aHz() {
    q_("Initializing...");
    let A = new nXq,
        q = new rXq;
    await A.start();
    while (!0) {
        let K = await q.read();
        if (K === null) break;
        await A.handleMessage(K)
    }
    await A.stop()
}
// @from(Ln 452911, Col 0)
class nXq {
    mcpClients = new Map;
    nextClientId = 1;
    server = null;
    running = !1;
    socketPath = null;
    async start() {
        if (this.running) return;
        if (this.socketPath = MG6(), QFA() !== "win32") {
            let A = Fg1();
            try {
                if (!lHz(A).isDirectory()) gFA(A)
            } catch {}
            iHz(A, {
                recursive: !0,
                mode: 448
            });
            try {
                cXq(A, 448)
            } catch {}
            try {
                let q = lXq(A);
                for (let K of q) {
                    if (!K.endsWith(".sock")) continue;
                    let Y = parseInt(K.replace(".sock", ""), 10);
                    if (isNaN(Y)) continue;
                    try {
                        process.kill(Y, 0)
                    } catch {
                        try {
                            gFA(dHz(A, K)), q_(`Removed stale socket for PID ${Y}`)
                        } catch {}
                    }
                }
            } catch {}
        }
        q_(`Creating socket listener: ${this.socketPath}`), this.server = pHz((A) => this.handleMcpClient(A)), await new Promise((A, q) => {
            this.server.listen(this.socketPath, () => {
                if (q_("Socket server listening for connections"), QFA() !== "win32") try {
                    cXq(this.socketPath, 384), q_("Socket permissions set to 0600")
                } catch (K) {
                    q_("Failed to set socket permissions:", K)
                }
                this.running = !0, A()
            }), this.server.on("error", (K) => {
                q_("Socket server error:", K), q(K)
            })
        })
    }
    async stop() {
        if (!this.running) return;
        for (let [, A] of this.mcpClients) A.socket.destroy();
        if (this.mcpClients.clear(), this.server) await new Promise((A) => {
            this.server.close(() => A())
        }), this.server = null;
        if (QFA() !== "win32" && this.socketPath && cHz(this.socketPath)) {
            try {
                gFA(this.socketPath), q_("Cleaned up socket file")
            } catch {}
            try {
                let A = Fg1();
                if (lXq(A).length === 0) nHz(A), q_("Removed empty socket directory")
            } catch {}
        }
        this.running = !1
    }
    async isRunning() {
        return this.running
    }
    async getClientCount() {
        return this.mcpClients.size
    }
    async handleMessage(A) {
        let q = _A(A);
        switch (q_(`Handling Chrome message type: ${q.type}`), q.type) {
            case "ping":
                q_("Responding to ping"), wY1(Q1({
                    type: "pong",
                    timestamp: Date.now()
                }));
                break;
            case "get_status":
                wY1(Q1({
                    type: "status_response",
                    native_host_version: oHz
                }));
                break;
            case "tool_response": {
                if (this.mcpClients.size > 0) {
                    q_(`Forwarding tool response to ${this.mcpClients.size} MCP clients`);
                    let {
                        type: K,
                        ...Y
                    } = q, z = Buffer.from(Q1(Y), "utf-8"), w = Buffer.alloc(4);
                    w.writeUInt32LE(z.length, 0);
                    let H = Buffer.concat([w, z]);
                    for (let [$, O] of this.mcpClients) try {
                        O.socket.write(H)
                    } catch (_) {
                        q_(`Failed to send to MCP client ${$}:`, _)
                    }
                }
                break
            }
            case "notification": {
                if (this.mcpClients.size > 0) {
                    q_(`Forwarding notification to ${this.mcpClients.size} MCP clients`);
                    let {
                        type: K,
                        ...Y
                    } = q, z = Buffer.from(Q1(Y), "utf-8"), w = Buffer.alloc(4);
                    w.writeUInt32LE(z.length, 0);
                    let H = Buffer.concat([w, z]);
                    for (let [$, O] of this.mcpClients) try {
                        O.socket.write(H)
                    } catch (_) {
                        q_(`Failed to send notification to MCP client ${$}:`, _)
                    }
                }
                break
            }
            default:
                q_(`Unknown message type: ${q.type}`), wY1(Q1({
                    type: "error",
                    error: `Unknown message type: ${q.type}`
                }))
        }
    }
    handleMcpClient(A) {
        let q = this.nextClientId++,
            K = {
                id: q,
                socket: A,
                buffer: Buffer.alloc(0)
            };
        this.mcpClients.set(q, K), q_(`MCP client ${q} connected. Total clients: ${this.mcpClients.size}`), wY1(Q1({
            type: "mcp_connected"
        })), A.on("data", (Y) => {
            K.buffer = Buffer.concat([K.buffer, Y]);
            while (K.buffer.length >= 4) {
                let z = K.buffer.readUInt32LE(0);
                if (z === 0 || z > UFA) {
                    q_(`Invalid message length from MCP client ${q}: ${z}`), A.destroy();
                    return
                }
                if (K.buffer.length < 4 + z) break;
                let w = K.buffer.slice(4, 4 + z);
                K.buffer = K.buffer.slice(4 + z);
                try {
                    let H = _A(w.toString("utf-8"));
                    q_(`Forwarding tool request from MCP client ${q}: ${H.method}`), wY1(Q1({
                        type: "tool_request",
                        method: H.method,
                        params: H.params
                    }))
                } catch (H) {
                    q_(`Failed to parse tool request from MCP client ${q}:`, H)
                }
            }
        }), A.on("error", (Y) => {
            q_(`MCP client ${q} error: ${Y}`)
        }), A.on("close", () => {
            q_(`MCP client ${q} disconnected. Remaining clients: ${this.mcpClients.size-1}`), this.mcpClients.delete(q), wY1(Q1({
                type: "mcp_disconnected"
            }))
        })
    }
}
// @from(Ln 453079, Col 0)
class rXq {
    buffer = Buffer.alloc(0);
    pendingResolve = null;
    closed = !1;
    constructor() {
        process.stdin.on("data", (A) => {
            this.buffer = Buffer.concat([this.buffer, A]), this.tryProcessMessage()
        }), process.stdin.on("end", () => {
            if (this.closed = !0, this.pendingResolve) this.pendingResolve(null), this.pendingResolve = null
        }), process.stdin.on("error", () => {
            if (this.closed = !0, this.pendingResolve) this.pendingResolve(null), this.pendingResolve = null
        })
    }
    tryProcessMessage() {
        if (!this.pendingResolve) return;
        if (this.buffer.length < 4) return;
        let A = this.buffer.readUInt32LE(0);
        if (A === 0 || A > UFA) {
            q_(`Invalid message length: ${A}`), this.pendingResolve(null), this.pendingResolve = null;
            return
        }
        if (this.buffer.length < 4 + A) return;
        let q = this.buffer.subarray(4, 4 + A);
        this.buffer = this.buffer.subarray(4 + A);
        let K = q.toString("utf-8");
        this.pendingResolve(K), this.pendingResolve = null
    }
    async read() {
        if (this.closed) return null;
        if (this.buffer.length >= 4) {
            let A = this.buffer.readUInt32LE(0);
            if (A > 0 && A <= UFA && this.buffer.length >= 4 + A) {
                let q = this.buffer.subarray(4, 4 + A);
                return this.buffer = this.buffer.subarray(4 + A), q.toString("utf-8")
            }
        }
        return new Promise((A) => {
            this.pendingResolve = A, this.tryProcessMessage()
        })
    }
}
// @from(Ln 453120, Col 4)
oHz = "1.0.0"
// @from(Ln 453121, Col 4)
UFA = 1048576
// @from(Ln 453122, Col 4)
iXq = void 0
// @from(Ln 453123, Col 4)
aXq = v(() => {
    kI();
    m6()
})
// @from(Ln 453128, Col 0)
function sXq() {}
// @from(Ln 453130, Col 0)
function tXq() {
    let A = C8() || {},
        q = f6().env || {},
        K = A.env || {};
    for (let [Y, z] of Object.entries(q))
        if (X31.has(Y.toUpperCase())) process.env[Y] = z;
    for (let [Y, z] of Object.entries(K))
        if (X31.has(Y.toUpperCase())) process.env[Y] = z;
    sXq()
}
// @from(Ln 453141, Col 0)
function q11() {
    let A = C8() || {};
    Object.assign(process.env, f6().env), Object.assign(process.env, A.env), sXq(), OA6()
}
// @from(Ln 453145, Col 4)
Hc1 = v(() => {
    cA();
    bb();
    p8();
    lX6()
})
// @from(Ln 453151, Col 4)
eXq = {}
// @from(Ln 453156, Col 0)
function sHz(A) {
    let q = e(19),
        {
            filePath: K,
            errorDescription: Y,
            onExit: z,
            onReset: w
        } = A,
        H;
    if (q[0] !== z || q[1] !== w) H = (P) => {
        if (P === "exit") z();
        else w()
    }, q[0] = z, q[1] = w, q[2] = H;
    else H = q[2];
    let $ = H,
        O;
    if (q[3] !== K) O = Zy.default.createElement(V, null, "The configuration file at ", Zy.default.createElement(V, {
        bold: !0
    }, K), " contains invalid JSON."), q[3] = K, q[4] = O;
    else O = q[4];
    let _;
    if (q[5] !== Y) _ = Zy.default.createElement(V, null, Y), q[5] = Y, q[6] = _;
    else _ = q[6];
    let J;
    if (q[7] !== O || q[8] !== _) J = Zy.default.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, O, _), q[7] = O, q[8] = _, q[9] = J;
    else J = q[9];
    let X;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) X = Zy.default.createElement(V, {
        bold: !0
    }, "Choose an option:"), q[10] = X;
    else X = q[10];
    let D;
    if (q[11] === Symbol.for("react.memo_cache_sentinel")) D = [{
        label: "Exit and fix manually",
        value: "exit"
    }, {
        label: "Reset with default configuration",
        value: "reset"
    }], q[11] = D;
    else D = q[11];
    let j;
    if (q[12] !== $ || q[13] !== z) j = Zy.default.createElement(I, {
        flexDirection: "column"
    }, X, Zy.default.createElement(kA, {
        options: D,
        onChange: $,
        onCancel: z
    })), q[12] = $, q[13] = z, q[14] = j;
    else j = q[14];
    let M;
    if (q[15] !== z || q[16] !== J || q[17] !== j) M = Zy.default.createElement(w8, {
        title: "Configuration Error",
        color: "error",
        onCancel: z
    }, J, j), q[15] = z, q[16] = J, q[17] = j, q[18] = M;
    else M = q[18];
    return M
}
// @from(Ln 453217, Col 0)
async function eHz({
    error: A
}) {
    let q = {
        ...js(!1),
        theme: tHz
    };
    await new Promise(async (K) => {
        let {
            unmount: Y
        } = await _Z(Zy.default.createElement(u_, null, Zy.default.createElement(dX, null, Zy.default.createElement(sHz, {
            filePath: A.filePath,
            errorDescription: A.message,
            onExit: () => {
                Y(), K(), process.exit(1)
            },
            onReset: () => {
                c8(A.filePath, Q1(A.defaultConfig, null, 2), {
                    flush: !1,
                    encoding: "utf8"
                }), Y(), K(), process.exit(0)
            }
        }))), q)
    })
}
// @from(Ln 453242, Col 4)
Zy
// @from(Ln 453242, Col 8)
tHz = "dark"
// @from(Ln 453243, Col 4)
ADq = v(() => {
    i1();
    m1();
    wY();
    m1();
    m6();
    d8();
    qd();
    m6();
    Hm1();
    Bq();
    Zy = o(X1(), 1)
})
// @from(Ln 453257, Col 0)
function dFA() {
    if (ZGA()) {
        if (w4() && FX()) pFA();
        j_4().then(async () => {
            q11(), await pFA()
        })
    } else pFA()
}
// @from(Ln 453265, Col 0)
async function pFA() {
    if (qDq) return;
    qDq = !0, await A$z()
}
// @from(Ln 453269, Col 0)
async function A$z() {
    let {
        initializeTelemetry: A
    } = await Promise.resolve().then(() => (YTA(), KTA)), q = A();
    if (q) RL6(q, (Y, z) => {
        let w = q?.createCounter(Y, z);
        return {
            add(H, $ = {}) {
                let _ = {
                    ...Uj1(),
                    ...$
                };
                w?.add(H, _)
            }
        }
    })
}
// @from(Ln 453286, Col 4)
qDq = !1
// @from(Ln 453287, Col 4)
KDq
// @from(Ln 453288, Col 4)
YDq = v(() => {
    Fl();
    B6();
    cA();
    cA();
    Hc1();
    qH();
    w$();
    Tz();
    zq();
    B6();
    U_6();
    bb();
    YO1();
    Sw1();
    Om1();
    mV();
    Hc1();
    B6();
    s_6();
    Pk();
    qf1();
    Tj();
    Ot();
    E2();
    Z6();
    f0();
    $a();
    KDq = KA(() => {
        let A = Date.now();
        H8("info", "init_started"), EK("init_function_start");
        try {
            let q = Date.now();
            Yf1(), H8("info", "init_configs_enabled", {
                duration_ms: Date.now() - q
            }), EK("init_configs_enabled");
            let K = Date.now();
            if (tXq(), H8("info", "init_safe_env_vars_applied", {
                    duration_ms: Date.now() - K
                }), EK("init_safe_env_vars_applied"), iO4(), EK("init_after_graceful_shutdown"), Promise.resolve().then(() => (qm1(), cO4)).then((w) => {
                    w.initialize1PEventLogging()
                }), EK("init_after_1p_event_logging"), W$8(), EK("init_after_oauth_populate"), zXA(), EK("init_after_jetbrains_detection"), ZGA()) D_4();
            if (KB()) _v7();
            EK("init_after_remote_settings_check"), rJq();
            let Y = Date.now();
            h("[init] configureGlobalMTLS starting"), BB8(), H8("info", "init_mtls_configured", {
                duration_ms: Date.now() - Y
            }), h("[init] configureGlobalMTLS complete");
            let z = Date.now();
            if (h("[init] configureGlobalAgents starting"), OA6(), H8("info", "init_proxy_configured", {
                    duration_ms: Date.now() - z
                }), h("[init] configureGlobalAgents complete"), EK("init_network_configured"), hY8(), Tq(YF4), O$()) process.env.CLAUDE_CODE_SESSION_ID = U6(), yJq();
            if (nZ1()) {
                let w = Date.now();
                xJq(), H8("info", "init_scratchpad_created", {
                    duration_ms: Date.now() - w
                })
            }
            H8("info", "init_completed", {
                duration_ms: Date.now() - A
            }), EK("init_function_end")
        } catch (q) {
            if (q instanceof hG) {
                if (w4()) {
                    process.stderr.write(`Configuration error in ${q.filePath}: ${q.message}
`), w3(1);
                    return
                }
                return Promise.resolve().then(() => (ADq(), eXq)).then((K) => K.showInvalidConfigDialog({
                    error: q
                }))
            } else throw q
        }
    })
})
// @from(Ln 453364, Col 0)
async function Y$z() {
    if (lFA || nFA) return;
    if (lFA = !0, !zDq) zDq = !0, lF4(() => {
        UBA(), Xf1.forEach((q) => q())
    });
    let A = await w$z();
    if (A.length === 0) return;
    h(`Watching for changes in skill/command directories: ${A.join(", ")}...`), WF = wH1.watch(A, {
        persistent: !0,
        ignoreInitial: !0,
        depth: 2,
        awaitWriteFinish: {
            stabilityThreshold: iFA?.stabilityThreshold ?? q$z,
            pollInterval: iFA?.pollInterval ?? K$z
        },
        ignored: (q, K) => {
            if (K && !K.isFile() && !K.isDirectory()) return !0;
            return q.split(HY1.sep).some((Y) => Y === ".git")
        },
        ignorePermissionErrors: !0,
        usePolling: !1,
        atomic: !0
    }), WF.on("add", cFA), WF.on("change", cFA), WF.on("unlink", cFA), Tq(async () => wDq())
}
// @from(Ln 453389, Col 0)
function wDq() {
    if (nFA = !0, WF) WF.close(), WF = null;
    Xf1.clear()
}
// @from(Ln 453394, Col 0)
function z$z(A) {
    return Xf1.add(A), () => {
        Xf1.delete(A)
    }
}
// @from(Ln 453399, Col 0)
async function w$z() {
    let A = b1(),
        q = [],
        K = Gt("userSettings", "skills");
    if (K) try {
        await A.stat(K), q.push(K)
    } catch {}
    let Y = Gt("userSettings", "commands");
    if (Y) try {
        await A.stat(Y), q.push(Y)
    } catch {}
    let z = Gt("projectSettings", "skills");
    if (z) try {
        let H = HY1.resolve(z);
        await A.stat(H), q.push(H)
    } catch {}
    let w = Gt("projectSettings", "commands");
    if (w) try {
        let H = HY1.resolve(w);
        await A.stat(H), q.push(H)
    } catch {}
    for (let H of qC()) {
        let $ = HY1.join(H, ".claude", "skills");
        try {
            await A.stat($), q.push($)
        } catch {}
    }
    return q
}
// @from(Ln 453429, Col 0)
function cFA(A) {
    h(`Detected skill change: ${A}`), c("tengu_skill_file_changed", {
        source: "chokidar"
    }), BP6(), bm(), rd(), Xf1.forEach((q) => q())
}
// @from(Ln 453435, Col 0)
function H$z(A) {
    if (WF) WF.close(), WF = null;
    Xf1.clear(), lFA = !1, nFA = !1, iFA = A ?? null
}
// @from(Ln 453439, Col 4)
q$z = 1000
// @from(Ln 453440, Col 4)
K$z = 500
// @from(Ln 453441, Col 4)
WF = null
// @from(Ln 453442, Col 4)
lFA = !1
// @from(Ln 453443, Col 4)
nFA = !1
// @from(Ln 453444, Col 4)
zDq = !1
// @from(Ln 453445, Col 4)
Xf1
// @from(Ln 453445, Col 9)
iFA = null
// @from(Ln 453446, Col 4)
Df1
// @from(Ln 453447, Col 4)
rT6 = v(() => {
    ds1();
    Z6();
    Tz();
    Zt();
    c$();
    FW();
    _8();
    B6();
    u6();
    Xf1 = new Set;
    Df1 = {
        initialize: Y$z,
        dispose: wDq,
        subscribe: z$z,
        resetForTesting: H$z
    }
})
// @from(Ln 453470, Col 0)
function $$z() {
    let A = process.argv[1] || "",
        q = process.execPath || process.argv[0] || "";
    if (eA() === "windows") A = A.split($Dq.sep).join(HDq.sep), q = q.split($Dq.sep).join(HDq.sep);
    let K = [A, q],
        Y = ["/build-ant/", "/build-external/", "/build-external-native/", "/build-ant-native/"];
    return K.some((z) => Y.some((w) => z.includes(w)))
}
// @from(Ln 453479, Col 0)
function _$z(A) {
    let q = `${A.name}: ${A.message}`;
    return O$z.some((K) => K.test(q))
}
// @from(Ln 453484, Col 0)
function _Dq() {
    let A = process.listeners("warning");
    if (oT6 && A.includes(oT6)) return;
    if (!$$z()) process.removeAllListeners("warning");
    oT6 = (K) => {
        try {
            let Y = `${K.name}: ${K.message.slice(0,50)}`,
                z = ODq.get(Y) || 0;
            ODq.set(Y, z + 1);
            let w = _$z(K);
            if (c("tengu_node_warning", {
                    is_internal: w ? 1 : 0,
                    occurrence_count: z + 1,
                    classname: K.name,
                    ...!1
                }), process.env.CLAUDE_DEBUG === "true") h(`${w?"[Internal Warning]":"[Warning]"} ${K.toString()}`, {
                level: "warn"
            })
        } catch {}
    }, process.on("warning", oT6)
}
// @from(Ln 453505, Col 4)
ODq
// @from(Ln 453505, Col 9)
O$z
// @from(Ln 453505, Col 14)
oT6 = null
// @from(Ln 453506, Col 4)
JDq = v(() => {
    u6();
    Z6();
    x3();
    ODq = new Map;
    O$z = [/MaxListenersExceededWarning.*AbortSignal/, /MaxListenersExceededWarning.*EventTarget/]
})
// @from(Ln 453516, Col 0)
function D$z() {
    return process.env.ANTHROPIC_BASE_URL || process.env.CLAUDE_CODE_API_BASE_URL || "https://api.anthropic.com"
}
// @from(Ln 453520, Col 0)
function rFA(A) {
    h(`[files-api] ${A}`, {
        level: "error"
    })
}
// @from(Ln 453526, Col 0)
function $Y1(A) {
    h(`[files-api] ${A}`)
}
// @from(Ln 453530, Col 0)
function XDq(A) {
    return A instanceof Error ? A.message : String(A)
}
// @from(Ln 453533, Col 0)
async function M$z(A, q) {
    let K = "";
    for (let Y = 1; Y <= aT6; Y++) {
        let z = await q(Y);
        if (z.done) return z.value;
        if (K = z.error || `${A} failed`, $Y1(`${A} attempt ${Y}/${aT6} failed: ${K}`), Y < aT6) {
            let w = j$z * Math.pow(2, Y - 1);
            $Y1(`Retrying ${A} in ${w}ms...`), await new Promise((H) => setTimeout(H, w))
        }
    }
    throw Error(`${K} after ${aT6} attempts`)
}
// @from(Ln 453545, Col 0)
async function P$z(A, q) {
    let Y = `${q.baseUrl||D$z()}/v1/files/${A}/content`,
        z = {
            Authorization: `Bearer ${q.oauthToken}`,
            "anthropic-version": X$z,
            "anthropic-beta": J$z
        };
    return $Y1(`Downloading file ${A} from ${Y}`), M$z(`Download file ${A}`, async () => {
        try {
            let w = await sA.get(Y, {
                headers: z,
                responseType: "arraybuffer",
                timeout: 60000,
                validateStatus: (H) => H < 500
            });
            if (w.status === 200) return $Y1(`Downloaded file ${A} (${w.data.length} bytes)`), {
                done: !0,
                value: Buffer.from(w.data)
            };
            if (w.status === 404) throw Error(`File not found: ${A}`);
            if (w.status === 401) throw Error("Authentication failed: invalid or missing API key");
            if (w.status === 403) throw Error(`Access denied to file: ${A}`);
            return {
                done: !1,
                error: `status ${w.status}`
            }
        } catch (w) {
            if (!sA.isAxiosError(w)) throw w;
            return {
                done: !1,
                error: w.message
            }
        }
    })
}
// @from(Ln 453581, Col 0)
function W$z(A, q, K) {
    let Y = yE.normalize(K);
    if (Y.startsWith("..")) return rFA(`Invalid file path: ${K}. Path must not traverse above workspace`), null;
    let z = yE.join(A, q, "uploads"),
        H = [yE.join(A, q, "uploads") + yE.sep, yE.sep + "uploads" + yE.sep].find((O) => Y.startsWith(O)),
        $ = H ? Y.slice(H.length) : Y;
    return yE.join(z, $)
}
// @from(Ln 453589, Col 0)
async function G$z(A, q) {
    let {
        fileId: K,
        relativePath: Y
    } = A, z = W$z(h6(), q.sessionId, Y);
    if (!z) return {
        fileId: K,
        path: "",
        success: !1,
        error: `Invalid file path: ${Y}`
    };
    try {
        let w = await P$z(K, q),
            H = yE.dirname(z);
        return await $c1.mkdir(H, {
            recursive: !0
        }), await $c1.writeFile(z, w), $Y1(`Saved file ${K} to ${z} (${w.length} bytes)`), {
            fileId: K,
            path: z,
            success: !0,
            bytesWritten: w.length
        }
    } catch (w) {
        if (rFA(`Failed to download file ${K}: ${XDq(w)}`), w instanceof Error) K1(w);
        return {
            fileId: K,
            path: z,
            success: !1,
            error: XDq(w)
        }
    }
}
// @from(Ln 453621, Col 0)
async function f$z(A, q, K) {
    let Y = Array(A.length),
        z = 0;
    async function w() {
        while (z < A.length) {
            let O = z++,
                _ = A[O];
            if (_ !== void 0) Y[O] = await q(_, O)
        }
    }
    let H = [],
        $ = Math.min(K, A.length);
    for (let O = 0; O < $; O++) H.push(w());
    return await Promise.all(H), Y
}
// @from(Ln 453636, Col 0)
async function DDq(A, q, K = Z$z) {
    if (A.length === 0) return [];
    $Y1(`Downloading ${A.length} file(s) for session ${q.sessionId}`);
    let Y = Date.now(),
        z = await f$z(A, async ($, O) => {
            return await G$z($, q)
        }, K),
        w = Date.now() - Y,
        H = z.filter(($) => $.success).length;
    return $Y1(`Downloaded ${H}/${A.length} file(s) in ${w}ms`), z
}
// @from(Ln 453648, Col 0)
function jDq(A) {
    let q = [],
        K = A.flatMap((Y) => Y.split(" ").filter(Boolean));
    for (let Y of K) {
        let z = Y.indexOf(":");
        if (z === -1) continue;
        let w = Y.substring(0, z),
            H = Y.substring(z + 1);
        if (!w || !H) {
            rFA(`Invalid file spec: ${Y}. Both file_id and path are required`);
            continue
        }
        q.push({
            fileId: w,
            relativePath: H
        })
    }
    return q
}
// @from(Ln 453667, Col 4)
J$z = "files-api-2025-04-14"
// @from(Ln 453668, Col 4)
X$z = "2023-06-01"
// @from(Ln 453669, Col 4)
aT6 = 3
// @from(Ln 453670, Col 4)
j$z = 500
// @from(Ln 453671, Col 4)
Z$z = 5
// @from(Ln 453672, Col 4)
oFA = v(() => {
    y5();
    N7();
    Z6();
    y6();
    u6()
})
// @from(Ln 453683, Col 0)
function PDq() {
    let A = jC1();
    if (!A?.teamName || !A?.agentName) {
        h("[Reconnection] computeInitialTeamContext: No teammate context set (not a teammate)");
        return
    }
    let {
        teamName: q,
        agentId: K,
        agentName: Y
    } = A, z = iX(q);
    if (!z) {
        K1(Error(`[computeInitialTeamContext] Could not read team file for ${q}`));
        return
    }
    let w = MDq(QP(), q.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase(), "config.json"),
        H = !K;
    return h(`[Reconnection] Computed initial team context for ${H?"leader":`teammate ${Y}`} in team ${q}`), {
        teamName: q,
        teamFilePath: w,
        leadAgentId: z.leadAgentId,
        selfAgentId: K,
        selfAgentName: Y,
        isLeader: H,
        teammates: {}
    }
}
// @from(Ln 453711, Col 0)
function WDq(A, q, K) {
    let Y = iX(q);
    if (!Y) {
        K1(Error(`[initializeTeammateContextFromSession] Could not read team file for ${q} (agent: ${K})`));
        return
    }
    let z = Y.members.find(($) => $.name === K);
    if (!z) h(`[Reconnection] Member ${K} not found in team ${q} - may have been removed`);
    let w = z?.agentId,
        H = MDq(QP(), q.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase(), "config.json");
    A(($) => ({
        ...$,
        teamContext: {
            teamName: q,
            teamFilePath: H,
            leadAgentId: Y.leadAgentId,
            selfAgentId: w,
            selfAgentName: K,
            isLeader: !1,
            teammates: {}
        }
    })), h(`[Reconnection] Initialized agent context from session for ${K} in team ${q}`)
}
// @from(Ln 453734, Col 4)
aFA = v(() => {
    hA();
    XN();
    Z6();
    y6();
    Cz()
})