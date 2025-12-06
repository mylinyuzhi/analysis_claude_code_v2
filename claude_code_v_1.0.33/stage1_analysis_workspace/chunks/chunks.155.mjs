
// @from(Start 14625750, End 14659683)
Pz9 = z((cf3) => {
  var hf3 = UA("node:events").EventEmitter,
    mK0 = UA("node:child_process"),
    Zu = UA("node:path"),
    dK0 = UA("node:fs"),
    eJ = UA("node:process"),
    {
      Argument: gf3,
      humanReadableArgName: uf3
    } = bJ1(),
    {
      CommanderError: cK0
    } = hSA(),
    {
      Help: mf3
    } = gK0(),
    {
      Option: Oz9,
      DualOptions: df3
    } = uK0(),
    {
      suggestSimilar: Rz9
    } = Mz9();
  class pK0 extends hf3 {
    constructor(A) {
      super();
      this.commands = [], this.options = [], this.parent = null, this._allowUnknownOption = !1, this._allowExcessArguments = !0, this.registeredArguments = [], this._args = this.registeredArguments, this.args = [], this.rawArgs = [], this.processedArgs = [], this._scriptPath = null, this._name = A || "", this._optionValues = {}, this._optionValueSources = {}, this._storeOptionsAsProperties = !1, this._actionHandler = null, this._executableHandler = !1, this._executableFile = null, this._executableDir = null, this._defaultCommandName = null, this._exitCallback = null, this._aliases = [], this._combineFlagAndOptionalValue = !0, this._description = "", this._summary = "", this._argsDescription = void 0, this._enablePositionalOptions = !1, this._passThroughOptions = !1, this._lifeCycleHooks = {}, this._showHelpAfterError = !1, this._showSuggestionAfterError = !0, this._outputConfiguration = {
        writeOut: (Q) => eJ.stdout.write(Q),
        writeErr: (Q) => eJ.stderr.write(Q),
        getOutHelpWidth: () => eJ.stdout.isTTY ? eJ.stdout.columns : void 0,
        getErrHelpWidth: () => eJ.stderr.isTTY ? eJ.stderr.columns : void 0,
        outputError: (Q, B) => B(Q)
      }, this._hidden = !1, this._helpOption = void 0, this._addImplicitHelpCommand = void 0, this._helpCommand = void 0, this._helpConfiguration = {}
    }
    copyInheritedSettings(A) {
      return this._outputConfiguration = A._outputConfiguration, this._helpOption = A._helpOption, this._helpCommand = A._helpCommand, this._helpConfiguration = A._helpConfiguration, this._exitCallback = A._exitCallback, this._storeOptionsAsProperties = A._storeOptionsAsProperties, this._combineFlagAndOptionalValue = A._combineFlagAndOptionalValue, this._allowExcessArguments = A._allowExcessArguments, this._enablePositionalOptions = A._enablePositionalOptions, this._showHelpAfterError = A._showHelpAfterError, this._showSuggestionAfterError = A._showSuggestionAfterError, this
    }
    _getCommandAndAncestors() {
      let A = [];
      for (let Q = this; Q; Q = Q.parent) A.push(Q);
      return A
    }
    command(A, Q, B) {
      let G = Q,
        Z = B;
      if (typeof G === "object" && G !== null) Z = G, G = null;
      Z = Z || {};
      let [, I, Y] = A.match(/([^ ]+) *(.*)/), J = this.createCommand(I);
      if (G) J.description(G), J._executableHandler = !0;
      if (Z.isDefault) this._defaultCommandName = J._name;
      if (J._hidden = !!(Z.noHelp || Z.hidden), J._executableFile = Z.executableFile || null, Y) J.arguments(Y);
      if (this._registerCommand(J), J.parent = this, J.copyInheritedSettings(this), G) return this;
      return J
    }
    createCommand(A) {
      return new pK0(A)
    }
    createHelp() {
      return Object.assign(new mf3, this.configureHelp())
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
    addCommand(A, Q) {
      if (!A._name) throw Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
      if (Q = Q || {}, Q.isDefault) this._defaultCommandName = A._name;
      if (Q.noHelp || Q.hidden) A._hidden = !0;
      return this._registerCommand(A), A.parent = this, A._checkForBrokenPassThrough(), this
    }
    createArgument(A, Q) {
      return new gf3(A, Q)
    }
    argument(A, Q, B, G) {
      let Z = this.createArgument(A, Q);
      if (typeof B === "function") Z.default(G).argParser(B);
      else Z.default(B);
      return this.addArgument(Z), this
    }
    arguments(A) {
      return A.trim().split(/ +/).forEach((Q) => {
        this.argument(Q)
      }), this
    }
    addArgument(A) {
      let Q = this.registeredArguments.slice(-1)[0];
      if (Q && Q.variadic) throw Error(`only the last argument can be variadic '${Q.name()}'`);
      if (A.required && A.defaultValue !== void 0 && A.parseArg === void 0) throw Error(`a default value for a required argument is never used: '${A.name()}'`);
      return this.registeredArguments.push(A), this
    }
    helpCommand(A, Q) {
      if (typeof A === "boolean") return this._addImplicitHelpCommand = A, this;
      A = A ?? "help [command]";
      let [, B, G] = A.match(/([^ ]+) *(.*)/), Z = Q ?? "display help for command", I = this.createCommand(B);
      if (I.helpOption(!1), G) I.arguments(G);
      if (Z) I.description(Z);
      return this._addImplicitHelpCommand = !0, this._helpCommand = I, this
    }
    addHelpCommand(A, Q) {
      if (typeof A !== "object") return this.helpCommand(A, Q), this;
      return this._addImplicitHelpCommand = !0, this._helpCommand = A, this
    }
    _getHelpCommand() {
      if (this._addImplicitHelpCommand ?? (this.commands.length && !this._actionHandler && !this._findCommand("help"))) {
        if (this._helpCommand === void 0) this.helpCommand(void 0, void 0);
        return this._helpCommand
      }
      return null
    }
    hook(A, Q) {
      let B = ["preSubcommand", "preAction", "postAction"];
      if (!B.includes(A)) throw Error(`Unexpected value for event passed to hook : '${A}'.
Expecting one of '${B.join("', '")}'`);
      if (this._lifeCycleHooks[A]) this._lifeCycleHooks[A].push(Q);
      else this._lifeCycleHooks[A] = [Q];
      return this
    }
    exitOverride(A) {
      if (A) this._exitCallback = A;
      else this._exitCallback = (Q) => {
        if (Q.code !== "commander.executeSubCommandAsync") throw Q
      };
      return this
    }
    _exit(A, Q, B) {
      if (this._exitCallback) this._exitCallback(new cK0(A, Q, B));
      eJ.exit(A)
    }
    action(A) {
      let Q = (B) => {
        let G = this.registeredArguments.length,
          Z = B.slice(0, G);
        if (this._storeOptionsAsProperties) Z[G] = this;
        else Z[G] = this.opts();
        return Z.push(this), A.apply(this, Z)
      };
      return this._actionHandler = Q, this
    }
    createOption(A, Q) {
      return new Oz9(A, Q)
    }
    _callParseArg(A, Q, B, G) {
      try {
        return A.parseArg(Q, B)
      } catch (Z) {
        if (Z.code === "commander.invalidArgument") {
          let I = `${G} ${Z.message}`;
          this.error(I, {
            exitCode: Z.exitCode,
            code: Z.code
          })
        }
        throw Z
      }
    }
    _registerOption(A) {
      let Q = A.short && this._findOption(A.short) || A.long && this._findOption(A.long);
      if (Q) {
        let B = A.long && this._findOption(A.long) ? A.long : A.short;
        throw Error(`Cannot add option '${A.flags}'${this._name&&` to command '${this._name}'`} due to conflicting flag '${B}'
-  already used by option '${Q.flags}'`)
      }
      this.options.push(A)
    }
    _registerCommand(A) {
      let Q = (G) => {
          return [G.name()].concat(G.aliases())
        },
        B = Q(A).find((G) => this._findCommand(G));
      if (B) {
        let G = Q(this._findCommand(B)).join("|"),
          Z = Q(A).join("|");
        throw Error(`cannot add command '${Z}' as already have command '${G}'`)
      }
      this.commands.push(A)
    }
    addOption(A) {
      this._registerOption(A);
      let Q = A.name(),
        B = A.attributeName();
      if (A.negate) {
        let Z = A.long.replace(/^--no-/, "--");
        if (!this._findOption(Z)) this.setOptionValueWithSource(B, A.defaultValue === void 0 ? !0 : A.defaultValue, "default")
      } else if (A.defaultValue !== void 0) this.setOptionValueWithSource(B, A.defaultValue, "default");
      let G = (Z, I, Y) => {
        if (Z == null && A.presetArg !== void 0) Z = A.presetArg;
        let J = this.getOptionValue(B);
        if (Z !== null && A.parseArg) Z = this._callParseArg(A, Z, J, I);
        else if (Z !== null && A.variadic) Z = A._concatValue(Z, J);
        if (Z == null)
          if (A.negate) Z = !1;
          else if (A.isBoolean() || A.optional) Z = !0;
        else Z = "";
        this.setOptionValueWithSource(B, Z, Y)
      };
      if (this.on("option:" + Q, (Z) => {
          let I = `error: option '${A.flags}' argument '${Z}' is invalid.`;
          G(Z, I, "cli")
        }), A.envVar) this.on("optionEnv:" + Q, (Z) => {
        let I = `error: option '${A.flags}' value '${Z}' from env '${A.envVar}' is invalid.`;
        G(Z, I, "env")
      });
      return this
    }
    _optionEx(A, Q, B, G, Z) {
      if (typeof Q === "object" && Q instanceof Oz9) throw Error("To add an Option object use addOption() instead of option() or requiredOption()");
      let I = this.createOption(Q, B);
      if (I.makeOptionMandatory(!!A.mandatory), typeof G === "function") I.default(Z).argParser(G);
      else if (G instanceof RegExp) {
        let Y = G;
        G = (J, W) => {
          let X = Y.exec(J);
          return X ? X[0] : W
        }, I.default(Z).argParser(G)
      } else I.default(G);
      return this.addOption(I)
    }
    option(A, Q, B, G) {
      return this._optionEx({}, A, Q, B, G)
    }
    requiredOption(A, Q, B, G) {
      return this._optionEx({
        mandatory: !0
      }, A, Q, B, G)
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
    setOptionValue(A, Q) {
      return this.setOptionValueWithSource(A, Q, void 0)
    }
    setOptionValueWithSource(A, Q, B) {
      if (this._storeOptionsAsProperties) this[A] = Q;
      else this._optionValues[A] = Q;
      return this._optionValueSources[A] = B, this
    }
    getOptionValueSource(A) {
      return this._optionValueSources[A]
    }
    getOptionValueSourceWithGlobals(A) {
      let Q;
      return this._getCommandAndAncestors().forEach((B) => {
        if (B.getOptionValueSource(A) !== void 0) Q = B.getOptionValueSource(A)
      }), Q
    }
    _prepareUserArgs(A, Q) {
      if (A !== void 0 && !Array.isArray(A)) throw Error("first parameter to parse must be array or undefined");
      if (Q = Q || {}, A === void 0 && Q.from === void 0) {
        if (eJ.versions?.electron) Q.from = "electron";
        let G = eJ.execArgv ?? [];
        if (G.includes("-e") || G.includes("--eval") || G.includes("-p") || G.includes("--print")) Q.from = "eval"
      }
      if (A === void 0) A = eJ.argv;
      this.rawArgs = A.slice();
      let B;
      switch (Q.from) {
        case void 0:
        case "node":
          this._scriptPath = A[1], B = A.slice(2);
          break;
        case "electron":
          if (eJ.defaultApp) this._scriptPath = A[1], B = A.slice(2);
          else B = A.slice(1);
          break;
        case "user":
          B = A.slice(0);
          break;
        case "eval":
          B = A.slice(1);
          break;
        default:
          throw Error(`unexpected parse option { from: '${Q.from}' }`)
      }
      if (!this._name && this._scriptPath) this.nameFromFilename(this._scriptPath);
      return this._name = this._name || "program", B
    }
    parse(A, Q) {
      let B = this._prepareUserArgs(A, Q);
      return this._parseCommand([], B), this
    }
    async parseAsync(A, Q) {
      let B = this._prepareUserArgs(A, Q);
      return await this._parseCommand([], B), this
    }
    _executeSubCommand(A, Q) {
      Q = Q.slice();
      let B = !1,
        G = [".js", ".ts", ".tsx", ".mjs", ".cjs"];

      function Z(X, V) {
        let F = Zu.resolve(X, V);
        if (dK0.existsSync(F)) return F;
        if (G.includes(Zu.extname(V))) return;
        let K = G.find((D) => dK0.existsSync(`${F}${D}`));
        if (K) return `${F}${K}`;
        return
      }
      this._checkForMissingMandatoryOptions(), this._checkForConflictingOptions();
      let I = A._executableFile || `${this._name}-${A._name}`,
        Y = this._executableDir || "";
      if (this._scriptPath) {
        let X;
        try {
          X = dK0.realpathSync(this._scriptPath)
        } catch (V) {
          X = this._scriptPath
        }
        Y = Zu.resolve(Zu.dirname(X), Y)
      }
      if (Y) {
        let X = Z(Y, I);
        if (!X && !A._executableFile && this._scriptPath) {
          let V = Zu.basename(this._scriptPath, Zu.extname(this._scriptPath));
          if (V !== this._name) X = Z(Y, `${V}-${A._name}`)
        }
        I = X || I
      }
      B = G.includes(Zu.extname(I));
      let J;
      if (eJ.platform !== "win32")
        if (B) Q.unshift(I), Q = Tz9(eJ.execArgv).concat(Q), J = mK0.spawn(eJ.argv[0], Q, {
          stdio: "inherit"
        });
        else J = mK0.spawn(I, Q, {
          stdio: "inherit"
        });
      else Q.unshift(I), Q = Tz9(eJ.execArgv).concat(Q), J = mK0.spawn(eJ.execPath, Q, {
        stdio: "inherit"
      });
      if (!J.killed)["SIGUSR1", "SIGUSR2", "SIGTERM", "SIGINT", "SIGHUP"].forEach((V) => {
        eJ.on(V, () => {
          if (J.killed === !1 && J.exitCode === null) J.kill(V)
        })
      });
      let W = this._exitCallback;
      J.on("close", (X) => {
        if (X = X ?? 1, !W) eJ.exit(X);
        else W(new cK0(X, "commander.executeSubCommandAsync", "(close)"))
      }), J.on("error", (X) => {
        if (X.code === "ENOENT") {
          let V = Y ? `searched for local subcommand relative to directory '${Y}'` : "no directory for search for local subcommand, use .executableDir() to supply a custom directory",
            F = `'${I}' does not exist
 - if '${A._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${V}`;
          throw Error(F)
        } else if (X.code === "EACCES") throw Error(`'${I}' not executable`);
        if (!W) eJ.exit(1);
        else {
          let V = new cK0(1, "commander.executeSubCommandAsync", "(error)");
          V.nestedError = X, W(V)
        }
      }), this.runningCommand = J
    }
    _dispatchSubcommand(A, Q, B) {
      let G = this._findCommand(A);
      if (!G) this.help({
        error: !0
      });
      let Z;
      return Z = this._chainOrCallSubCommandHook(Z, G, "preSubcommand"), Z = this._chainOrCall(Z, () => {
        if (G._executableHandler) this._executeSubCommand(G, Q.concat(B));
        else return G._parseCommand(Q, B)
      }), Z
    }
    _dispatchHelpCommand(A) {
      if (!A) this.help();
      let Q = this._findCommand(A);
      if (Q && !Q._executableHandler) Q.help();
      return this._dispatchSubcommand(A, [], [this._getHelpOption()?.long ?? this._getHelpOption()?.short ?? "--help"])
    }
    _checkNumberOfArguments() {
      if (this.registeredArguments.forEach((A, Q) => {
          if (A.required && this.args[Q] == null) this.missingArgument(A.name())
        }), this.registeredArguments.length > 0 && this.registeredArguments[this.registeredArguments.length - 1].variadic) return;
      if (this.args.length > this.registeredArguments.length) this._excessArguments(this.args)
    }
    _processArguments() {
      let A = (B, G, Z) => {
        let I = G;
        if (G !== null && B.parseArg) {
          let Y = `error: command-argument value '${G}' is invalid for argument '${B.name()}'.`;
          I = this._callParseArg(B, G, Z, Y)
        }
        return I
      };
      this._checkNumberOfArguments();
      let Q = [];
      this.registeredArguments.forEach((B, G) => {
        let Z = B.defaultValue;
        if (B.variadic) {
          if (G < this.args.length) {
            if (Z = this.args.slice(G), B.parseArg) Z = Z.reduce((I, Y) => {
              return A(B, Y, I)
            }, B.defaultValue)
          } else if (Z === void 0) Z = []
        } else if (G < this.args.length) {
          if (Z = this.args[G], B.parseArg) Z = A(B, Z, B.defaultValue)
        }
        Q[G] = Z
      }), this.processedArgs = Q
    }
    _chainOrCall(A, Q) {
      if (A && A.then && typeof A.then === "function") return A.then(() => Q());
      return Q()
    }
    _chainOrCallHooks(A, Q) {
      let B = A,
        G = [];
      if (this._getCommandAndAncestors().reverse().filter((Z) => Z._lifeCycleHooks[Q] !== void 0).forEach((Z) => {
          Z._lifeCycleHooks[Q].forEach((I) => {
            G.push({
              hookedCommand: Z,
              callback: I
            })
          })
        }), Q === "postAction") G.reverse();
      return G.forEach((Z) => {
        B = this._chainOrCall(B, () => {
          return Z.callback(Z.hookedCommand, this)
        })
      }), B
    }
    _chainOrCallSubCommandHook(A, Q, B) {
      let G = A;
      if (this._lifeCycleHooks[B] !== void 0) this._lifeCycleHooks[B].forEach((Z) => {
        G = this._chainOrCall(G, () => {
          return Z(this, Q)
        })
      });
      return G
    }
    _parseCommand(A, Q) {
      let B = this.parseOptions(Q);
      if (this._parseOptionsEnv(), this._parseOptionsImplied(), A = A.concat(B.operands), Q = B.unknown, this.args = A.concat(Q), A && this._findCommand(A[0])) return this._dispatchSubcommand(A[0], A.slice(1), Q);
      if (this._getHelpCommand() && A[0] === this._getHelpCommand().name()) return this._dispatchHelpCommand(A[1]);
      if (this._defaultCommandName) return this._outputHelpIfRequested(Q), this._dispatchSubcommand(this._defaultCommandName, A, Q);
      if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) this.help({
        error: !0
      });
      this._outputHelpIfRequested(B.unknown), this._checkForMissingMandatoryOptions(), this._checkForConflictingOptions();
      let G = () => {
          if (B.unknown.length > 0) this.unknownOption(B.unknown[0])
        },
        Z = `command:${this.name()}`;
      if (this._actionHandler) {
        G(), this._processArguments();
        let I;
        if (I = this._chainOrCallHooks(I, "preAction"), I = this._chainOrCall(I, () => this._actionHandler(this.processedArgs)), this.parent) I = this._chainOrCall(I, () => {
          this.parent.emit(Z, A, Q)
        });
        return I = this._chainOrCallHooks(I, "postAction"), I
      }
      if (this.parent && this.parent.listenerCount(Z)) G(), this._processArguments(), this.parent.emit(Z, A, Q);
      else if (A.length) {
        if (this._findCommand("*")) return this._dispatchSubcommand("*", A, Q);
        if (this.listenerCount("command:*")) this.emit("command:*", A, Q);
        else if (this.commands.length) this.unknownCommand();
        else G(), this._processArguments()
      } else if (this.commands.length) G(), this.help({
        error: !0
      });
      else G(), this._processArguments()
    }
    _findCommand(A) {
      if (!A) return;
      return this.commands.find((Q) => Q._name === A || Q._aliases.includes(A))
    }
    _findOption(A) {
      return this.options.find((Q) => Q.is(A))
    }
    _checkForMissingMandatoryOptions() {
      this._getCommandAndAncestors().forEach((A) => {
        A.options.forEach((Q) => {
          if (Q.mandatory && A.getOptionValue(Q.attributeName()) === void 0) A.missingMandatoryOptionValue(Q)
        })
      })
    }
    _checkForConflictingLocalOptions() {
      let A = this.options.filter((B) => {
        let G = B.attributeName();
        if (this.getOptionValue(G) === void 0) return !1;
        return this.getOptionValueSource(G) !== "default"
      });
      A.filter((B) => B.conflictsWith.length > 0).forEach((B) => {
        let G = A.find((Z) => B.conflictsWith.includes(Z.attributeName()));
        if (G) this._conflictingOption(B, G)
      })
    }
    _checkForConflictingOptions() {
      this._getCommandAndAncestors().forEach((A) => {
        A._checkForConflictingLocalOptions()
      })
    }
    parseOptions(A) {
      let Q = [],
        B = [],
        G = Q,
        Z = A.slice();

      function I(J) {
        return J.length > 1 && J[0] === "-"
      }
      let Y = null;
      while (Z.length) {
        let J = Z.shift();
        if (J === "--") {
          if (G === B) G.push(J);
          G.push(...Z);
          break
        }
        if (Y && !I(J)) {
          this.emit(`option:${Y.name()}`, J);
          continue
        }
        if (Y = null, I(J)) {
          let W = this._findOption(J);
          if (W) {
            if (W.required) {
              let X = Z.shift();
              if (X === void 0) this.optionMissingArgument(W);
              this.emit(`option:${W.name()}`, X)
            } else if (W.optional) {
              let X = null;
              if (Z.length > 0 && !I(Z[0])) X = Z.shift();
              this.emit(`option:${W.name()}`, X)
            } else this.emit(`option:${W.name()}`);
            Y = W.variadic ? W : null;
            continue
          }
        }
        if (J.length > 2 && J[0] === "-" && J[1] !== "-") {
          let W = this._findOption(`-${J[1]}`);
          if (W) {
            if (W.required || W.optional && this._combineFlagAndOptionalValue) this.emit(`option:${W.name()}`, J.slice(2));
            else this.emit(`option:${W.name()}`), Z.unshift(`-${J.slice(2)}`);
            continue
          }
        }
        if (/^--[^=]+=/.test(J)) {
          let W = J.indexOf("="),
            X = this._findOption(J.slice(0, W));
          if (X && (X.required || X.optional)) {
            this.emit(`option:${X.name()}`, J.slice(W + 1));
            continue
          }
        }
        if (I(J)) G = B;
        if ((this._enablePositionalOptions || this._passThroughOptions) && Q.length === 0 && B.length === 0) {
          if (this._findCommand(J)) {
            if (Q.push(J), Z.length > 0) B.push(...Z);
            break
          } else if (this._getHelpCommand() && J === this._getHelpCommand().name()) {
            if (Q.push(J), Z.length > 0) Q.push(...Z);
            break
          } else if (this._defaultCommandName) {
            if (B.push(J), Z.length > 0) B.push(...Z);
            break
          }
        }
        if (this._passThroughOptions) {
          if (G.push(J), Z.length > 0) G.push(...Z);
          break
        }
        G.push(J)
      }
      return {
        operands: Q,
        unknown: B
      }
    }
    opts() {
      if (this._storeOptionsAsProperties) {
        let A = {},
          Q = this.options.length;
        for (let B = 0; B < Q; B++) {
          let G = this.options[B].attributeName();
          A[G] = G === this._versionOptionName ? this._version : this[G]
        }
        return A
      }
      return this._optionValues
    }
    optsWithGlobals() {
      return this._getCommandAndAncestors().reduce((A, Q) => Object.assign(A, Q.opts()), {})
    }
    error(A, Q) {
      if (this._outputConfiguration.outputError(`${A}
`, this._outputConfiguration.writeErr), typeof this._showHelpAfterError === "string") this._outputConfiguration.writeErr(`${this._showHelpAfterError}
`);
      else if (this._showHelpAfterError) this._outputConfiguration.writeErr(`
`), this.outputHelp({
        error: !0
      });
      let B = Q || {},
        G = B.exitCode || 1,
        Z = B.code || "commander.error";
      this._exit(G, Z, A)
    }
    _parseOptionsEnv() {
      this.options.forEach((A) => {
        if (A.envVar && A.envVar in eJ.env) {
          let Q = A.attributeName();
          if (this.getOptionValue(Q) === void 0 || ["default", "config", "env"].includes(this.getOptionValueSource(Q)))
            if (A.required || A.optional) this.emit(`optionEnv:${A.name()}`, eJ.env[A.envVar]);
            else this.emit(`optionEnv:${A.name()}`)
        }
      })
    }
    _parseOptionsImplied() {
      let A = new df3(this.options),
        Q = (B) => {
          return this.getOptionValue(B) !== void 0 && !["default", "implied"].includes(this.getOptionValueSource(B))
        };
      this.options.filter((B) => B.implied !== void 0 && Q(B.attributeName()) && A.valueFromOption(this.getOptionValue(B.attributeName()), B)).forEach((B) => {
        Object.keys(B.implied).filter((G) => !Q(G)).forEach((G) => {
          this.setOptionValueWithSource(G, B.implied[G], "implied")
        })
      })
    }
    missingArgument(A) {
      let Q = `error: missing required argument '${A}'`;
      this.error(Q, {
        code: "commander.missingArgument"
      })
    }
    optionMissingArgument(A) {
      let Q = `error: option '${A.flags}' argument missing`;
      this.error(Q, {
        code: "commander.optionMissingArgument"
      })
    }
    missingMandatoryOptionValue(A) {
      let Q = `error: required option '${A.flags}' not specified`;
      this.error(Q, {
        code: "commander.missingMandatoryOptionValue"
      })
    }
    _conflictingOption(A, Q) {
      let B = (I) => {
          let Y = I.attributeName(),
            J = this.getOptionValue(Y),
            W = this.options.find((V) => V.negate && Y === V.attributeName()),
            X = this.options.find((V) => !V.negate && Y === V.attributeName());
          if (W && (W.presetArg === void 0 && J === !1 || W.presetArg !== void 0 && J === W.presetArg)) return W;
          return X || I
        },
        G = (I) => {
          let Y = B(I),
            J = Y.attributeName();
          if (this.getOptionValueSource(J) === "env") return `environment variable '${Y.envVar}'`;
          return `option '${Y.flags}'`
        },
        Z = `error: ${G(A)} cannot be used with ${G(Q)}`;
      this.error(Z, {
        code: "commander.conflictingOption"
      })
    }
    unknownOption(A) {
      if (this._allowUnknownOption) return;
      let Q = "";
      if (A.startsWith("--") && this._showSuggestionAfterError) {
        let G = [],
          Z = this;
        do {
          let I = Z.createHelp().visibleOptions(Z).filter((Y) => Y.long).map((Y) => Y.long);
          G = G.concat(I), Z = Z.parent
        } while (Z && !Z._enablePositionalOptions);
        Q = Rz9(A, G)
      }
      let B = `error: unknown option '${A}'${Q}`;
      this.error(B, {
        code: "commander.unknownOption"
      })
    }
    _excessArguments(A) {
      if (this._allowExcessArguments) return;
      let Q = this.registeredArguments.length,
        B = Q === 1 ? "" : "s",
        Z = `error: too many arguments${this.parent?` for '${this.name()}'`:""}. Expected ${Q} argument${B} but got ${A.length}.`;
      this.error(Z, {
        code: "commander.excessArguments"
      })
    }
    unknownCommand() {
      let A = this.args[0],
        Q = "";
      if (this._showSuggestionAfterError) {
        let G = [];
        this.createHelp().visibleCommands(this).forEach((Z) => {
          if (G.push(Z.name()), Z.alias()) G.push(Z.alias())
        }), Q = Rz9(A, G)
      }
      let B = `error: unknown command '${A}'${Q}`;
      this.error(B, {
        code: "commander.unknownCommand"
      })
    }
    version(A, Q, B) {
      if (A === void 0) return this._version;
      this._version = A, Q = Q || "-V, --version", B = B || "output the version number";
      let G = this.createOption(Q, B);
      return this._versionOptionName = G.attributeName(), this._registerOption(G), this.on("option:" + G.name(), () => {
        this._outputConfiguration.writeOut(`${A}
`), this._exit(0, "commander.version", A)
      }), this
    }
    description(A, Q) {
      if (A === void 0 && Q === void 0) return this._description;
      if (this._description = A, Q) this._argsDescription = Q;
      return this
    }
    summary(A) {
      if (A === void 0) return this._summary;
      return this._summary = A, this
    }
    alias(A) {
      if (A === void 0) return this._aliases[0];
      let Q = this;
      if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) Q = this.commands[this.commands.length - 1];
      if (A === Q._name) throw Error("Command alias can't be the same as its name");
      let B = this.parent?._findCommand(A);
      if (B) {
        let G = [B.name()].concat(B.aliases()).join("|");
        throw Error(`cannot add alias '${A}' to command '${this.name()}' as already have command '${G}'`)
      }
      return Q._aliases.push(A), this
    }
    aliases(A) {
      if (A === void 0) return this._aliases;
      return A.forEach((Q) => this.alias(Q)), this
    }
    usage(A) {
      if (A === void 0) {
        if (this._usage) return this._usage;
        let Q = this.registeredArguments.map((B) => {
          return uf3(B)
        });
        return [].concat(this.options.length || this._helpOption !== null ? "[options]" : [], this.commands.length ? "[command]" : [], this.registeredArguments.length ? Q : []).join(" ")
      }
      return this._usage = A, this
    }
    name(A) {
      if (A === void 0) return this._name;
      return this._name = A, this
    }
    nameFromFilename(A) {
      return this._name = Zu.basename(A, Zu.extname(A)), this
    }
    executableDir(A) {
      if (A === void 0) return this._executableDir;
      return this._executableDir = A, this
    }
    helpInformation(A) {
      let Q = this.createHelp();
      if (Q.helpWidth === void 0) Q.helpWidth = A && A.error ? this._outputConfiguration.getErrHelpWidth() : this._outputConfiguration.getOutHelpWidth();
      return Q.formatHelp(this, Q)
    }
    _getHelpContext(A) {
      A = A || {};
      let Q = {
          error: !!A.error
        },
        B;
      if (Q.error) B = (G) => this._outputConfiguration.writeErr(G);
      else B = (G) => this._outputConfiguration.writeOut(G);
      return Q.write = A.write || B, Q.command = this, Q
    }
    outputHelp(A) {
      let Q;
      if (typeof A === "function") Q = A, A = void 0;
      let B = this._getHelpContext(A);
      this._getCommandAndAncestors().reverse().forEach((Z) => Z.emit("beforeAllHelp", B)), this.emit("beforeHelp", B);
      let G = this.helpInformation(B);
      if (Q) {
        if (G = Q(G), typeof G !== "string" && !Buffer.isBuffer(G)) throw Error("outputHelp callback must return a string or a Buffer")
      }
      if (B.write(G), this._getHelpOption()?.long) this.emit(this._getHelpOption().long);
      this.emit("afterHelp", B), this._getCommandAndAncestors().forEach((Z) => Z.emit("afterAllHelp", B))
    }
    helpOption(A, Q) {
      if (typeof A === "boolean") {
        if (A) this._helpOption = this._helpOption ?? void 0;
        else this._helpOption = null;
        return this
      }
      return A = A ?? "-h, --help", Q = Q ?? "display help for command", this._helpOption = this.createOption(A, Q), this
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
      let Q = eJ.exitCode || 0;
      if (Q === 0 && A && typeof A !== "function" && A.error) Q = 1;
      this._exit(Q, "commander.help", "(outputHelp)")
    }
    addHelpText(A, Q) {
      let B = ["beforeAll", "before", "after", "afterAll"];
      if (!B.includes(A)) throw Error(`Unexpected value for position to addHelpText.
Expecting one of '${B.join("', '")}'`);
      let G = `${A}Help`;
      return this.on(G, (Z) => {
        let I;
        if (typeof Q === "function") I = Q({
          error: Z.error,
          command: Z.command
        });
        else I = Q;
        if (I) Z.write(`${I}
`)
      }), this
    }
    _outputHelpIfRequested(A) {
      let Q = this._getHelpOption();
      if (Q && A.find((G) => Q.is(G))) this.outputHelp(), this._exit(0, "commander.helpDisplayed", "(outputHelp)")
    }
  }

  function Tz9(A) {
    return A.map((Q) => {
      if (!Q.startsWith("--inspect")) return Q;
      let B, G = "127.0.0.1",
        Z = "9229",
        I;
      if ((I = Q.match(/^(--inspect(-brk)?)$/)) !== null) B = I[1];
      else if ((I = Q.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null)
        if (B = I[1], /^\d+$/.test(I[3])) Z = I[3];
        else G = I[3];
      else if ((I = Q.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) B = I[1], G = I[3], Z = I[4];
      if (B && Z !== "0") return `${B}=${G}:${parseInt(Z)+1}`;
      return Q
    })
  }
  cf3.Command = pK0
})
// @from(Start 14659689, End 14660253)
kz9 = z((nf3) => {
  var {
    Argument: jz9
  } = bJ1(), {
    Command: lK0
  } = Pz9(), {
    CommanderError: lf3,
    InvalidArgumentError: Sz9
  } = hSA(), {
    Help: if3
  } = gK0(), {
    Option: _z9
  } = uK0();
  nf3.program = new lK0;
  nf3.createCommand = (A) => new lK0(A);
  nf3.createOption = (A, Q) => new _z9(A, Q);
  nf3.createArgument = (A, Q) => new jz9(A, Q);
  nf3.Command = lK0;
  nf3.Option = _z9;
  nf3.Argument = jz9;
  nf3.Help = if3;
  nf3.CommanderError = lf3;
  nf3.InvalidArgumentError = Sz9;
  nf3.InvalidOptionArgumentError = Sz9
})
// @from(Start 14660259, End 14660765)
xz9 = z((VN, yz9) => {
  var Jj = kz9();
  VN = yz9.exports = {};
  VN.program = new Jj.Command;
  VN.Argument = Jj.Argument;
  VN.Command = Jj.Command;
  VN.CommanderError = Jj.CommanderError;
  VN.Help = Jj.Help;
  VN.InvalidArgumentError = Jj.InvalidArgumentError;
  VN.InvalidOptionArgumentError = Jj.InvalidArgumentError;
  VN.Option = Jj.Option;
  VN.createCommand = (A) => new Jj.Command(A);
  VN.createOption = (A, Q) => new Jj.Option(A, Q);
  VN.createArgument = (A, Q) => new Jj.Argument(A, Q)
})
// @from(Start 14660771, End 14660774)
vz9
// @from(Start 14660776, End 14660779)
YRI
// @from(Start 14660781, End 14660784)
JRI
// @from(Start 14660786, End 14660789)
WRI
// @from(Start 14660791, End 14660794)
XRI
// @from(Start 14660796, End 14660799)
VRI
// @from(Start 14660801, End 14660804)
FRI
// @from(Start 14660806, End 14660809)
KRI
// @from(Start 14660811, End 14660814)
fJ1
// @from(Start 14660816, End 14660819)
DRI
// @from(Start 14660821, End 14660823)
BF
// @from(Start 14660825, End 14660828)
HRI
// @from(Start 14660834, End 14661144)
iK0 = L(() => {
  vz9 = BA(xz9(), 1), {
    program: YRI,
    createCommand: JRI,
    createArgument: WRI,
    createOption: XRI,
    CommanderError: VRI,
    InvalidArgumentError: FRI,
    InvalidOptionArgumentError: KRI,
    Command: fJ1,
    Argument: DRI,
    Option: BF,
    Help: HRI
  } = vz9.default
})
// @from(Start 14661147, End 14661555)
function hJ1(A) {
  return A.map((Q) => ({
    name: n7(Q.name),
    type: Q.type,
    hasTools: Q.type === "connected" && Q.capabilities?.tools !== void 0,
    hasResources: Q.type === "connected" && Q.capabilities?.resources !== void 0,
    hasPrompts: Q.type === "connected" && Q.capabilities?.prompts !== void 0,
    serverInfo: Q.type === "connected" && "serverInfo" in Q ? Q.serverInfo : void 0
  }))
}
// @from(Start 14661560, End 14661574)
nK0 = () => {}
// @from(Start 14661577, End 14661980)
function gJ1(A, Q) {
  let B = Q?.server,
    G = B ? n7(B) : void 0,
    Z = G ? `mcp__${G}__` : "mcp__";
  return A.filter((Y) => Y.name.startsWith(Z)).map((Y) => {
    let J = mU(Y.name);
    return {
      server: J?.serverName || "unknown",
      name: J?.toolName || Y.name,
      description: typeof Y.description === "function" ? void 0 : Y.description || "",
      fullName: Y.name
    }
  })
}
// @from(Start 14661985, End 14662010)
aK0 = L(() => {
  nX()
})
// @from(Start 14662012, End 14662547)
async function uJ1(A, {
  server: Q,
  toolName: B
}) {
  let G = A.find((I) => I.name === `mcp__${Q}__${B}`);
  if (!G) return null;
  let Z = "";
  if (typeof G.description === "string") Z = G.description;
  else if (typeof G.description === "function") try {
    Z = await G.description({}, {
      isNonInteractiveSession: !0,
      toolPermissionContext: ZE(),
      tools: []
    }) || ""
  } catch {}
  return {
    server: Q,
    name: B,
    fullName: G.name,
    description: Z,
    inputSchema: G.inputJSONSchema || {}
  }
}
// @from(Start 14662552, End 14662566)
sK0 = () => {}
// @from(Start 14662569, End 14663169)
function mJ1(A, {
  pattern: Q,
  ignoreCase: B
}) {
  let G;
  try {
    G = new RegExp(Q, B ? "i" : "")
  } catch (Y) {
    throw Error(`Invalid regex pattern: ${Y instanceof Error?Y.message:String(Y)}`)
  }
  let Z = A.filter((Y) => Y.name.startsWith("mcp__")),
    I = [];
  for (let Y of Z) {
    let J = mU(Y.name),
      W = J?.serverName || "unknown",
      X = J?.toolName || Y.name,
      V = typeof Y.description === "string" ? Y.description : "";
    if (G.test(X) || G.test(V)) I.push({
      server: W,
      name: X,
      fullName: Y.name,
      description: V
    })
  }
  return I
}
// @from(Start 14663174, End 14663199)
rK0 = L(() => {
  nX()
})
// @from(Start 14663202, End 14663559)
function dJ1(A, Q, B) {
  let G = Q?.server;
  if (G) {
    let Z = A[G] || [],
      I = G;
    if (Z.length === 0 && B) {
      let Y = B[G];
      if (Y && A[Y]) Z = A[Y], I = Y
    }
    return Z.map((Y) => ({
      ...Y,
      server: n7(I)
    }))
  }
  return Object.entries(A).flatMap(([Z, I]) => I.map((Y) => ({
    ...Y,
    server: n7(Z)
  })))
}
// @from(Start 14663564, End 14663578)
oK0 = () => {}
// @from(Start 14663584, End 14663587)
Ih3
// @from(Start 14663589, End 14663592)
bz9
// @from(Start 14663594, End 14663597)
Yh3
// @from(Start 14663599, End 14663602)
fz9
// @from(Start 14663604, End 14663607)
Jh3
// @from(Start 14663609, End 14663612)
hz9
// @from(Start 14663614, End 14663617)
Wh3
// @from(Start 14663619, End 14663622)
Xh3
// @from(Start 14663624, End 14663627)
gz9
// @from(Start 14663629, End 14663632)
Vh3
// @from(Start 14663634, End 14663637)
uz9
// @from(Start 14663639, End 14663642)
Fh3
// @from(Start 14663644, End 14663647)
mz9
// @from(Start 14663653, End 14665692)
tK0 = L(() => {
  Q2();
  SD();
  Ih3 = j.object({
    command: j.literal("servers")
  }), bz9 = j.array(j.object({
    name: j.string(),
    type: j.string(),
    hasTools: j.boolean().optional(),
    hasResources: j.boolean().optional(),
    hasPrompts: j.boolean().optional(),
    serverInfo: j.object({
      name: j.string(),
      version: j.string()
    }).optional()
  })), Yh3 = j.object({
    command: j.literal("tools"),
    params: j.object({
      server: j.string().optional()
    }).optional()
  }), fz9 = j.array(j.object({
    server: j.string(),
    name: j.string(),
    description: j.string().optional(),
    fullName: j.string()
  })), Jh3 = j.object({
    command: j.literal("info"),
    params: j.object({
      server: j.string(),
      toolName: j.string()
    })
  }), hz9 = j.object({
    server: j.string(),
    name: j.string(),
    fullName: j.string(),
    description: j.string(),
    inputSchema: j.record(j.unknown())
  }).or(j.null()), Wh3 = j.object({
    command: j.literal("call"),
    params: j.object({
      server: j.string(),
      tool: j.string(),
      args: j.record(j.unknown()),
      timeoutMs: j.number().optional()
    })
  }), Xh3 = j.object({
    command: j.literal("grep"),
    params: j.object({
      pattern: j.string(),
      ignoreCase: j.boolean().optional()
    })
  }), gz9 = j.array(j.object({
    server: j.string(),
    name: j.string(),
    fullName: j.string(),
    description: j.string()
  })), Vh3 = j.object({
    command: j.literal("resources"),
    params: j.object({
      server: j.string().optional()
    }).optional()
  }), uz9 = j.array(j.object({
    uri: j.string(),
    name: j.string().optional(),
    description: j.string().optional(),
    mimeType: j.string().optional(),
    server: j.string()
  })), Fh3 = j.object({
    command: j.literal("read"),
    params: j.object({
      server: j.string(),
      uri: j.string(),
      timeoutMs: j.number().optional()
    })
  }), mz9 = j.discriminatedUnion("command", [Ih3, Yh3, Jh3, Wh3, Xh3, Vh3, Fh3])
})
// @from(Start 14665821, End 14665892)
function cJ1() {
  let A = SVA();
  return Kh3(Gu(), `${A}.endpoint`)
}
// @from(Start 14665894, End 14666100)
function pJ1(A) {
  if (A) eK0 = A;
  if (!eK0) return;
  Ch3(Gu(), {
    recursive: !0
  });
  let Q = cJ1(),
    B = Buffer.from(JSON.stringify(eK0)).toString("base64");
  Dh3(Q, B, {
    mode: 384
  })
}
// @from(Start 14666102, End 14666272)
function dz9() {
  let A = cJ1();
  try {
    let Q = Hh3(A, "utf-8");
    return JSON.parse(Buffer.from(Q, "base64").toString("utf-8"))
  } catch {
    return null
  }
}
// @from(Start 14666277, End 14666287)
eK0 = null
// @from(Start 14666293, End 14666319)
lJ1 = L(() => {
  _VA()
})
// @from(Start 14666322, End 14666477)
function gSA(A, Q, B) {
  let G = A.find((I) => I.name === Q);
  if (G) return G;
  let Z = B?.[Q];
  if (Z) return A.find((I) => I.name === Z);
  return
}
// @from(Start 14666479, End 14666728)
function tQA(A, Q) {
  if (!Q) return Error(`Server '${A}' not found`);
  if (Q !== "connected") return Error(`Server '${A}' is not connected (${Q==="needs-auth"?"needs authentication":Q}). Run '/mcp' to manage server connections.`);
  return null
}
// @from(Start 14666733, End 14666741)
az9 = {}
// @from(Start 14666934, End 14667201)
function Th3(A) {
  let Q;
  if (process.env.RIPGREP_NODE_PATH) Q = UA(process.env.RIPGREP_NODE_PATH).ripgrepMain;
  else {
    let B = Rh3(Oh3(Mh3(import.meta.url)), "ripgrep.node");
    Q = Lh3(import.meta.url)(B).ripgrepMain
  }
  return Q(["--no-config", ...A])
}
// @from(Start 14667206, End 14667220)
sz9 = () => {}
// @from(Start 14667278, End 14667643)
function Ph3() {
  let A = process.argv[1] || "",
    Q = process.execPath || process.argv[0] || "";
  if (dQ() === "windows") A = A.split(oz9.sep).join(rz9.sep), Q = Q.split(oz9.sep).join(rz9.sep);
  let B = [A, Q],
    G = ["/build-ant/", "/build-external/", "/build-external-native/", "/build-ant-native/"];
  return B.some((Z) => G.some((I) => Z.includes(I)))
}
// @from(Start 14667645, End 14667737)
function Sh3(A) {
  let Q = `${A.name}: ${A.message}`;
  return jh3.some((B) => B.test(Q))
}
// @from(Start 14667739, End 14668383)
function ez9() {
  let A = process.listeners("warning");
  if (iJ1 && A.includes(iJ1)) return;
  if (!Ph3()) process.removeAllListeners("warning");
  iJ1 = (B) => {
    try {
      let G = `${B.name}: ${B.message.slice(0,50)}`,
        Z = tz9.get(G) || 0;
      tz9.set(G, Z + 1);
      let I = Sh3(B);
      if (GA("tengu_node_warning", {
          is_internal: I ? 1 : 0,
          occurrence_count: Z + 1,
          classname: B.name,
          ...!1
        }), process.env.CLAUDE_DEBUG === "true") g(`${I?"[Internal Warning]":"[Warning]"} ${B.toString()}`, {
        level: "warn"
      })
    } catch {}
  }, process.on("warning", iJ1)
}
// @from(Start 14668388, End 14668391)
tz9
// @from(Start 14668393, End 14668396)
jh3
// @from(Start 14668398, End 14668408)
iJ1 = null
// @from(Start 14668414, End 14668570)
AU9 = L(() => {
  q0();
  V0();
  Q3();
  tz9 = new Map;
  jh3 = [/MaxListenersExceededWarning.*AbortSignal/, /MaxListenersExceededWarning.*EventTarget/]
})
// @from(Start 14668573, End 14668590)
function BU9() {}
// @from(Start 14668592, End 14668873)
function GU9() {
  let A = l0() || {},
    Q = N1().env || {},
    B = A.env || {};
  for (let [G, Z] of Object.entries(Q))
    if (QU9.has(G.toUpperCase())) process.env[G] = Z;
  for (let [G, Z] of Object.entries(B))
    if (QU9.has(G.toUpperCase())) process.env[G] = Z;
  BU9()
}
// @from(Start 14668875, End 14669003)
function BD0() {
  let A = l0() || {};
  Object.assign(process.env, N1().env), Object.assign(process.env, A.env), x4A(), BU9()
}
// @from(Start 14669008, End 14669011)
QU9
// @from(Start 14669017, End 14671229)
GD0 = L(() => {
  jQ();
  MB();
  CS();
  QU9 = new Set(["ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN", "ANTHROPIC_BASE_URL", "ANTHROPIC_CUSTOM_HEADERS", "ANTHROPIC_DEFAULT_HAIKU_MODEL", "ANTHROPIC_FOUNDRY_API_KEY", "ANTHROPIC_DEFAULT_OPUS_MODEL", "ANTHROPIC_DEFAULT_SONNET_MODEL", "ANTHROPIC_MODEL", "ANTHROPIC_SMALL_FAST_MODEL", "ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION", "AWS_BEARER_TOKEN_BEDROCK", "AWS_DEFAULT_REGION", "AWS_PROFILE", "AWS_REGION", "BASH_DEFAULT_TIMEOUT_MS", "BASH_MAX_TIMEOUT_MS", "BASH_MAX_OUTPUT_LENGTH", "CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR", "CLAUDE_CODE_API_KEY_HELPER_TTL_MS", "CLAUDE_CODE_ENABLE_TELEMETRY", "CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL", "CLAUDE_CODE_MAX_OUTPUT_TOKENS", "CLAUDE_CODE_USE_BEDROCK", "CLAUDE_CODE_USE_FOUNDRY", "CLAUDE_CODE_USE_VERTEX", "CLAUDE_CODE_SKIP_BEDROCK_AUTH", "CLAUDE_CODE_SKIP_FOUNDRY_AUTH", "CLAUDE_CODE_SKIP_VERTEX_AUTH", "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC", "CLAUDE_CODE_DISABLE_TERMINAL_TITLE", "CLAUDE_CODE_SUBAGENT_MODEL", "DISABLE_AUTOUPDATER", "DISABLE_BUG_COMMAND", "DISABLE_COST_WARNINGS", "DISABLE_ERROR_REPORTING", "DISABLE_TELEMETRY", "HTTP_PROXY", "HTTPS_PROXY", "MAX_THINKING_TOKENS", "MCP_TIMEOUT", "MCP_TOOL_TIMEOUT", "MAX_MCP_OUTPUT_TOKENS", "NO_PROXY", "OTEL_EXPORTER_OTLP_ENDPOINT", "OTEL_EXPORTER_OTLP_HEADERS", "OTEL_EXPORTER_OTLP_LOGS_HEADERS", "OTEL_EXPORTER_OTLP_METRICS_HEADERS", "OTEL_EXPORTER_OTLP_TRACES_HEADERS", "OTEL_EXPORTER_OTLP_PROTOCOL", "OTEL_EXPORTER_OTLP_LOGS_PROTOCOL", "OTEL_EXPORTER_OTLP_LOGS_ENDPOINT", "OTEL_EXPORTER_OTLP_METRICS_PROTOCOL", "OTEL_EXPORTER_OTLP_METRICS_ENDPOINT", "OTEL_EXPORTER_OTLP_METRICS_CLIENT_KEY", "OTEL_EXPORTER_OTLP_METRICS_CLIENT_CERTIFICATE", "OTEL_LOG_USER_PROMPTS", "OTEL_LOGS_EXPORTER", "OTEL_LOGS_EXPORT_INTERVAL", "OTEL_METRICS_INCLUDE_SESSION_ID", "OTEL_METRICS_INCLUDE_VERSION", "OTEL_METRICS_INCLUDE_ACCOUNT_UUID", "OTEL_METRICS_EXPORTER", "OTEL_METRIC_EXPORT_INTERVAL", "OTEL_RESOURCE_ATTRIBUTES", "USE_BUILTIN_RIPGREP", "VERTEX_REGION_CLAUDE_3_5_HAIKU", "VERTEX_REGION_CLAUDE_3_5_SONNET", "VERTEX_REGION_CLAUDE_3_7_SONNET", "VERTEX_REGION_CLAUDE_4_0_OPUS", "VERTEX_REGION_CLAUDE_4_0_SONNET", "VERTEX_REGION_CLAUDE_4_1_OPUS", "VERTEX_REGION_CLAUDE_HAIKU_4_5"])
})
// @from(Start 14671232, End 14672491)
function _h3({
  filePath: A,
  errorDescription: Q,
  onExit: B,
  onReset: G
}) {
  f1((Y, J) => {
    if (J.escape) B()
  });
  let Z = EQ();
  return PC.default.createElement(PC.default.Fragment, null, PC.default.createElement(S, {
    flexDirection: "column",
    borderColor: "error",
    borderStyle: "round",
    padding: 1,
    width: 70,
    gap: 1
  }, PC.default.createElement($, {
    bold: !0
  }, "Configuration Error"), PC.default.createElement(S, {
    flexDirection: "column",
    gap: 1
  }, PC.default.createElement($, null, "The configuration file at ", PC.default.createElement($, {
    bold: !0
  }, A), " contains invalid JSON."), PC.default.createElement($, null, Q)), PC.default.createElement(S, {
    flexDirection: "column"
  }, PC.default.createElement($, {
    bold: !0
  }, "Choose an option:"), PC.default.createElement(M0, {
    options: [{
      label: "Exit and fix manually",
      value: "exit"
    }, {
      label: "Reset with default configuration",
      value: "reset"
    }],
    onChange: (Y) => {
      if (Y === "exit") B();
      else G()
    },
    onCancel: B
  }))), Z.pending ? PC.default.createElement($, {
    dimColor: !0
  }, "Press ", Z.keyName, " again to exit") : PC.default.createElement(bF, null))
}
// @from(Start 14672492, End 14673074)
async function ZU9({
  error: A
}) {
  let Q = {
    exitOnCtrlC: !1,
    theme: kh3
  };
  await new Promise(async (B) => {
    let {
      unmount: G
    } = await VG(PC.default.createElement(yG, null, PC.default.createElement(_h3, {
      filePath: A.filePath,
      errorDescription: A.message,
      onExit: () => {
        G(), B(), process.exit(1)
      },
      onReset: () => {
        RA().writeFileSync(A.filePath, JSON.stringify(A.defaultConfig, null, 2), {
          flush: !1,
          encoding: "utf8"
        }), G(), B(), process.exit(0)
      }
    })), Q)
  })
}
// @from(Start 14673079, End 14673081)
PC
// @from(Start 14673083, End 14673095)
kh3 = "dark"
// @from(Start 14673101, End 14673186)
IU9 = L(() => {
  hA();
  J5();
  hA();
  AQ();
  Q4();
  z9();
  PC = BA(VA(), 1)
})
// @from(Start 14673253, End 14673913)
async function YU9() {
  try {
    let A = await DO();
    if (!A) {
      g("Not in a GitHub repository, skipping path mapping update");
      return
    }
    let Q;
    try {
      Q = yh3(uQ())
    } catch {
      Q = uQ()
    }
    let B = A.toLowerCase(),
      G = N1(),
      Z = G.githubRepoPaths?.[B] ?? [];
    if (Z.includes(Q)) {
      g(`Path ${Q} already tracked for repo ${B}`);
      return
    }
    let I = [Q, ...Z];
    c0({
      ...G,
      githubRepoPaths: {
        ...G.githubRepoPaths,
        [B]: I
      }
    }), g(`Added ${Q} to tracked paths for repo ${B}`)
  } catch (A) {
    g(`Error updating repo path mapping: ${A}`)
  }
}
// @from(Start 14673915, End 14674013)
function JU9(A) {
  let Q = N1(),
    B = A.toLowerCase();
  return Q.githubRepoPaths?.[B] ?? []
}
// @from(Start 14674015, End 14674067)
function WU9(A) {
  return A.filter((Q) => xh3(Q))
}
// @from(Start 14674068, End 14674418)
async function XU9(A, Q) {
  try {
    let {
      stdout: B,
      code: G
    } = await A3("git", ["remote", "get-url", "origin"], {
      cwd: A,
      preserveOutputOnError: !1
    });
    if (G !== 0 || !B) return !1;
    let Z = dh(B.trim());
    if (!Z) return !1;
    return Z.toLowerCase() === Q.toLowerCase()
  } catch {
    return !1
  }
}
// @from(Start 14674420, End 14674783)
function VU9(A, Q) {
  let B = N1(),
    G = A.toLowerCase(),
    Z = B.githubRepoPaths?.[G] ?? [],
    I = Z.filter((J) => J !== Q);
  if (I.length === Z.length) return;
  let Y = {
    ...B.githubRepoPaths
  };
  if (I.length === 0) delete Y[G];
  else Y[G] = I;
  c0({
    ...B,
    githubRepoPaths: Y
  }), g(`Removed ${Q} from tracked paths for repo ${G}`)
}
// @from(Start 14674788, End 14674846)
nJ1 = L(() => {
  z0A();
  jQ();
  _0();
  V0();
  _8()
})
// @from(Start 14674849, End 14674904)
function KU9() {
  if (ZD0) return;
  DU9(), ZD0 = !0
}
// @from(Start 14674906, End 14675145)
function DU9() {
  let A = XO2();
  if (A) vE0(A, (B, G) => {
    let Z = A?.createCounter(B, G);
    return {
      add(I, Y = {}) {
        let W = {
          ...kJA(),
          ...Y
        };
        Z?.add(I, W)
      }
    }
  })
}
// @from(Start 14675150, End 14675158)
ZD0 = !1
// @from(Start 14675162, End 14675165)
FU9
// @from(Start 14675171, End 14676173)
HU9 = L(() => {
  js();
  _0();
  jQ();
  jQ();
  GD0();
  RZ();
  IU9();
  kW();
  HH();
  l2();
  _0();
  U80();
  CUA();
  W61();
  _c();
  v3A();
  H9A();
  qKA();
  gB();
  jQ();
  _0();
  AL();
  f60();
  nJ1();
  _VA();
  dH();
  lRA();
  FU9 = s1(() => {
    M9("init_function_start");
    try {
      PiA(), M9("init_configs_enabled"), GU9(), M9("init_safe_env_vars_applied"), fm.initialize(), M9("init_settings_detector_initialized"), AV9(), M9("init_after_graceful_shutdown"), JCB(), M9("init_after_1p_event_logging"), To0(), M9("init_after_oauth_populate");
      let A = uzA() && !TJ(!0) && !N6();
      if (M9("init_after_defer_check"), !A) DU9(), ZD0 = !0;
      if (M9("init_telemetry_setup"), G8B(), R4B(), _4B(), M9("init_network_configured"), Oh0(), Wj2(), YU9(), E_2(), PG(z_2), bZ()) process.env.CLAUDE_CODE_SESSION_ID = e1(), Iz9();
      M9("init_function_end")
    } catch (A) {
      if (A instanceof mz) return ZU9({
        error: A
      });
      else throw A
    }
  })
})
// @from(Start 14676222, End 14677737)
function CU9() {
  let A = !(Y0(process.env.CLAUDE_CODE_USE_BEDROCK) || Y0(process.env.CLAUDE_CODE_USE_VERTEX) || Y0(process.env.CLAUDE_CODE_USE_FOUNDRY) || process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC || process.env.DISABLE_ERROR_REPORTING);
  xa.init({
    dsn: Jr0,
    enabled: A,
    environment: "external",
    release: {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.0.59",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
    }.VERSION,
    integrations: [new xa.Integrations.OnUncaughtException({
      exitEvenIfOtherHandlersAreRegistered: !1
    }), new xa.Integrations.OnUnhandledRejection({
      mode: "warn"
    }), new xa.Integrations.Http({
      tracing: !0
    }), xa.rewriteFramesIntegration()],
    tracesSampleRate: 1,
    tracePropagationTargets: ["localhost"],
    beforeSend(Q) {
      try {
        let B = vc();
        if (B.userID) {
          let G = vh3("sha256").update(B.userID).digest("hex");
          Q.user = {
            id: G
          }
        }
      } catch {}
      try {
        Q.tags = {
          ...Q.tags,
          terminal: d0.terminal,
          userType: "external",
          ..._CB()
        }
      } catch {}
      try {
        Q.extra = {
          ...Q.extra,
          sessionId: e1()
        }
      } catch {}
      return Q
    }
  })
}
// @from(Start 14677742, End 14677744)
xa
// @from(Start 14677750, End 14677828)
EU9 = L(() => {
  gb();
  c5();
  u2();
  _0();
  hQ();
  xa = BA(DJ0(), 1)
})
// @from(Start 14677869, End 14681343)
function fh3() {
  return `IMPORTANT: This message and these instructions are NOT part of the actual user conversation. Do NOT include any references to "note-taking", "session notes extraction", or these update instructions in the notes content.

Based on the user conversation above (EXCLUDING this note-taking instruction message as well as system prompt, claude.md entries, or any past session summaries), update the session notes file.

The file {{notesPath}} has already been read for you. Here are its current contents:
<current_notes_content>
{{currentNotes}}
</current_notes_content>

Your ONLY task is to use the Edit tool to update the notes file, then stop. You can make multiple edits (update every section as needed) - make all Edit tool calls in parallel in a single message. Do not call any other tools.

CRITICAL RULES FOR EDITING:
- The file must maintain its exact structure with all sections, headers, and italic descriptions intact
-- NEVER modify, delete, or add section headers (the lines starting with '#' like # Task specification)
-- NEVER modify or delete the italic _section description_ lines (these are the lines in italics immediately following each header - they start and end with underscores)
-- The italic _section descriptions_ are TEMPLATE INSTRUCTIONS that must be preserved exactly as-is - they guide what content belongs in each section
-- ONLY update the actual content that appears BELOW the italic _section descriptions_ within each existing section
-- Do NOT add any new sections, summaries, or information outside the existing structure
- Do NOT reference this note-taking process or instructions anywhere in the notes
- It's OK to skip updating a section if there are no substantial new insights to add. Do not add filler content like "No info yet", just leave sections blank/unedited if appropriate.
- Write DETAILED, INFO-DENSE content for each section - include specifics like file paths, function names, error messages, exact commands, technical details, etc.
- For "Key results", include the complete, exact output the user requested (e.g., full table, full answer, etc.)
- Do not include information that's already in the CLAUDE.md files included in the context
- Keep each section under ~${UU9} tokens/words - if a section is approaching this limit, condense it by cycling out less important details while preserving the most critical information
- Focus on actionable, specific information that would help someone understand or recreate the work discussed in the conversation
- IMPORTANT: Always update "Current State" to reflect the most recent work - this is critical for continuity after compaction

Use the Edit tool with file_path: {{notesPath}}

STRUCTURE PRESERVATION REMINDER:
Each section has TWO parts that must be preserved exactly as they appear in the current file:
1. The section header (line starting with #)
2. The italic description line (the _italicized text_ immediately after the header - this is a template instruction)

You ONLY update the actual content that comes AFTER these two preserved lines. The italic description lines starting and ending with underscores are part of the template structure, NOT content to be edited or removed.

REMEMBER: Use the Edit tool in parallel and stop. Do not continue after the edits. Only include insights from the actual user conversation, never from these note-taking instructions. Do not delete or change section headers or italic _section descriptions_.`
}
// @from(Start 14681344, End 14681664)
async function $U9() {
  let A = RA(),
    Q = zU9(MQ(), "session-memory", "config", "template.md");
  if (A.existsSync(Q)) try {
    return A.readFileSync(Q, {
      encoding: "utf-8"
    })
  } catch (B) {
    AA(B instanceof Error ? B : Error(`Failed to load custom session memory template: ${B}`))
  }
  return bh3
}
// @from(Start 14681665, End 14681983)
async function hh3() {
  let A = RA(),
    Q = zU9(MQ(), "session-memory", "config", "prompt.md");
  if (A.existsSync(Q)) try {
    return A.readFileSync(Q, {
      encoding: "utf-8"
    })
  } catch (B) {
    AA(B instanceof Error ? B : Error(`Failed to load custom session memory prompt: ${B}`))
  }
  return fh3()
}
// @from(Start 14681985, End 14682342)
function gh3(A) {
  let Q = {},
    B = A.split(`
`),
    G = "",
    Z = [];
  for (let I of B)
    if (I.startsWith("# ")) {
      if (G && Z.length > 0) {
        let Y = Z.join(`
`).trim();
        Q[G] = gG(Y)
      }
      G = I, Z = []
    } else Z.push(I);
  if (G && Z.length > 0) {
    let I = Z.join(`
`).trim();
    Q[G] = gG(I)
  }
  return Q
}
// @from(Start 14682344, End 14682631)
function uh3(A) {
  let Q = Object.entries(A).filter(([B, G]) => G > UU9).map(([B, G]) => `- The "${B}" section is currently ~${G} tokens and growing long. Consider condensing it a bit while keeping all important details.`);
  if (Q.length === 0) return "";
  return `

` + Q.join(`
`)
}
// @from(Start 14682633, End 14682774)
function mh3(A, Q) {
  let B = A;
  for (let [G, Z] of Object.entries(Q)) B = B.replace(new RegExp(`\\{\\{${G}\\}\\}`, "g"), Z);
  return B
}
// @from(Start 14682775, End 14682923)
async function wU9(A, Q) {
  let B = await hh3(),
    G = gh3(A),
    Z = uh3(G);
  return mh3(B, {
    currentNotes: A,
    notesPath: Q
  }) + Z
}
// @from(Start 14682928, End 14682938)
UU9 = 2000
// @from(Start 14682942, End 14684118)
bh3 = `
# Session Title
_A short and distinctive 5-10 word descriptive title for the session. Super info dense, no filler_

# Current State
_What is actively being worked on right now? Pending tasks not yet completed. Immediate next steps._

# Task specification
_What did the user ask to build? Any design decisions or other explanatory context_

# Files and Functions
_What are the important files? In short, what do they contain and why are they relevant?_

# Workflow
_What bash commands are usually run and in what order? How to interpret their output if not obvious?_

# Errors & Corrections
_Errors encountered and how they were fixed. What did the user correct? What approaches failed and should not be tried again?_

# Codebase and System Documentation
_What are the important system components? How do they work/fit together?_

# Learnings
_What has worked well? What has not? What to avoid? Do not duplicate items from other sections_

# Key results
_If the user asked a specific output such as an answer to a question, a table, or other document, repeat the exact result here_

# Worklog
_Step by step, what was attempted, done? Very terse summary for each step_
`
// @from(Start 14684124, End 14684173)
qU9 = L(() => {
  AQ();
  hQ();
  g1();
  xM()
})
// @from(Start 14684176, End 14684502)
function ch3(A, Q) {
  let B = 0,
    G = Q === null || Q === void 0;
  for (let Z of A) {
    if (!G) {
      if (Z.uuid === Q) G = !0;
      continue
    }
    if (Z.type === "assistant") {
      let Y = Z.message.content;
      if (Array.isArray(Y)) B += Y.filter((J) => J.type === "tool_use").length
    }
  }
  return B
}
// @from(Start 14684504, End 14684665)
function ph3(A) {
  let Q = ch3(A, NU9);
  if (!ySA(A) || Q >= dh3) {
    let G = A[A.length - 1];
    if (G?.uuid) NU9 = G.uuid;
    return !0
  }
  return !1
}
// @from(Start 14684666, End 14685111)
async function lh3(A) {
  let Q = RA(),
    B = kJ1();
  if (!Q.existsSync(B)) Q.mkdirSync(B);
  let G = k91();
  if (!Q.existsSync(G)) {
    let J = await $U9();
    Q.writeFileSync(G, J, {
      encoding: "utf-8",
      flush: !1,
      mode: 384
    })
  }
  let Z = await n8.call({
      file_path: G
    }, A),
    I = "",
    Y = Z.data;
  if (Y.type === "text") I = Y.file.content;
  return {
    memoryPath: G,
    currentMemory: I
  }
}
// @from(Start 14685112, End 14685135)
async function LU9() {}
// @from(Start 14685140, End 14685147)
dh3 = 3
// @from(Start 14685151, End 14685154)
NU9
// @from(Start 14685156, End 14685159)
_PI
// @from(Start 14685165, End 14686447)
MU9 = L(() => {
  EJ();
  AQ();
  Dq();
  qU9();
  JY1();
  ISA();
  u2();
  cQ();
  KQ0();
  _PI = q_(async function(A) {
    let {
      messages: Q,
      toolUseContext: B,
      querySource: G
    } = A;
    if (G !== "repl_main_thread") return;
    if (!ph3(Q)) return;
    uI2();
    let Z = BSA(B),
      {
        memoryPath: I,
        currentMemory: Y
      } = await lh3(Z),
      J = await wU9(Y, I),
      W = async (X, V) => {
        if (X.name === $5 && typeof V === "object" && V !== null && "file_path" in V) {
          if (V.file_path === I) return {
            behavior: "allow",
            updatedInput: V
          }
        }
        return {
          behavior: "deny",
          message: `only ${$5} on ${I} is allowed`,
          decisionReason: {
            type: "other",
            reason: `only ${$5} on ${I} is allowed`
          }
        }
      };
    if (await YY1({
        promptMessages: [R0({
          content: J
        })],
        cacheSafeParams: IY1(A),
        canUseTool: W,
        querySource: "session_memory",
        forkLabel: "session_memory",
        overrides: {
          readFileState: Z.readFileState
        }
      }), !ySA(Q)) {
      let X = Q[Q.length - 1];
      if (X?.uuid) gI2(X.uuid)
    }
    mI2()
  })
})
// @from(Start 14686488, End 14689707)
function nh3() {
  return `IMPORTANT: This message and these instructions are NOT part of the actual user conversation. Do NOT include any references to "documentation updates", "magic docs", or these update instructions in the document content.

Based on the user conversation above (EXCLUDING this documentation update instruction message), update the Magic Doc file to incorporate any NEW learnings, insights, or information that would be valuable to preserve.

The file {{docPath}} has already been read for you. Here are its current contents:
<current_doc_content>
{{docContents}}
</current_doc_content>

Document title: {{docTitle}}
{{customInstructions}}

Your ONLY task is to use the Edit tool to update the documentation file if there is substantial new information to add, then stop. You can make multiple edits (update multiple sections as needed) - make all Edit tool calls in parallel in a single message. If there's nothing substantial to add, simply respond with a brief explanation and do not call any tools.

CRITICAL RULES FOR EDITING:
- Preserve the Magic Doc header exactly as-is: # MAGIC DOC: {{docTitle}}
- If there's an italicized line immediately after the header, preserve it exactly as-is
- Keep the document CURRENT with the latest state of the codebase - this is NOT a changelog or history
- Update information IN-PLACE to reflect the current state - do NOT append historical notes or track changes over time
- Remove or replace outdated information rather than adding "Previously..." or "Updated to..." notes
- Clean up or DELETE sections that are no longer relevant or don't align with the document's purpose
- Fix obvious errors: typos, grammar mistakes, broken formatting, incorrect information, or confusing statements
- Keep the document well organized: use clear headings, logical section order, consistent formatting, and proper nesting

DOCUMENTATION PHILOSOPHY - READ CAREFULLY:
- BE TERSE. High signal only. No filler words or unnecessary elaboration.
- Documentation is for OVERVIEWS, ARCHITECTURE, and ENTRY POINTS - not detailed code walkthroughs
- Do NOT duplicate information that's already obvious from reading the source code
- Do NOT document every function, parameter, or line number reference
- Focus on: WHY things exist, HOW components connect, WHERE to start reading, WHAT patterns are used
- Skip: detailed implementation steps, exhaustive API docs, play-by-play narratives

What TO document:
- High-level architecture and system design
- Non-obvious patterns, conventions, or gotchas
- Key entry points and where to start reading code
- Important design decisions and their rationale
- Critical dependencies or integration points
- References to related files, docs, or code (like a wiki) - help readers navigate to relevant context

What NOT to document:
- Anything obvious from reading the code itself
- Exhaustive lists of files, functions, or parameters
- Step-by-step implementation details
- Low-level code mechanics
- Information already in CLAUDE.md or other project docs

Use the Edit tool with file_path: {{docPath}}

REMEMBER: Only update if there is substantial new information. The Magic Doc header (# MAGIC DOC: {{docTitle}}) must remain unchanged.`
}
// @from(Start 14689708, End 14689913)
async function ah3() {
  let A = RA(),
    Q = ih3(MQ(), "magic-docs", "prompt.md");
  if (A.existsSync(Q)) try {
    return A.readFileSync(Q, {
      encoding: "utf-8"
    })
  } catch {}
  return nh3()
}
// @from(Start 14689915, End 14690056)
function sh3(A, Q) {
  let B = A;
  for (let [G, Z] of Object.entries(Q)) B = B.replace(new RegExp(`\\{\\{${G}\\}\\}`, "g"), Z);
  return B
}
// @from(Start 14690057, End 14690571)
async function OU9(A, Q, B, G) {
  let Z = await ah3(),
    I = G ? `

DOCUMENT-SPECIFIC UPDATE INSTRUCTIONS:
The document author has provided specific instructions for how this file should be updated. Pay extra attention to these instructions and follow them carefully:

"${G}"

These instructions take priority over the general rules below. Make sure your updates align with these specific guidelines.` : "";
  return sh3(Z, {
    docContents: A,
    docPath: Q,
    docTitle: B,
    customInstructions: I
  })
}
// @from(Start 14690576, End 14690609)
RU9 = L(() => {
  AQ();
  hQ()
})
// @from(Start 14690612, End 14690999)
function th3(A) {
  let Q = A.match(rh3);
  if (!Q || !Q[1]) return null;
  let B = Q[1].trim(),
    G = Q.index + Q[0].length,
    I = A.slice(G).match(/^\s*\n(?:\s*\n)?(.+?)(?:\n|$)/);
  if (I && I[1]) {
    let J = I[1].match(oh3);
    if (J && J[1]) {
      let W = J[1].trim();
      return {
        title: B,
        instructions: W
      }
    }
  }
  return {
    title: B
  }
}
// @from(Start 14691001, End 14691216)
function eh3() {
  return {
    agentType: "magic-docs",
    whenToUse: "Update Magic Docs",
    tools: [$5],
    model: "sonnet",
    source: "built-in",
    baseDir: "built-in",
    getSystemPrompt: () => ""
  }
}
// @from(Start 14691217, End 14692577)
async function Ag3(A, Q) {
  let {
    messages: B,
    systemPrompt: G,
    userContext: Z,
    systemContext: I,
    toolUseContext: Y
  } = Q, J = kAA(Y.readFileState), W = {
    ...Y,
    readFileState: J
  };
  if (!RA().existsSync(A.path)) {
    aJ1.delete(A.path);
    return
  }
  let V = await n8.call({
      file_path: A.path
    }, W),
    F = "",
    K = V.data;
  if (K.type === "text") F = K.file.content;
  let D = th3(F);
  if (!D) {
    aJ1.delete(A.path);
    return
  }
  let H = await OU9(F, A.path, D.title, D.instructions),
    C = async (E, U) => {
      if (E.name === $5 && typeof U === "object" && U !== null && "file_path" in U) {
        let q = U.file_path;
        if (typeof q === "string" && q === A.path) return {
          behavior: "allow",
          updatedInput: U
        }
      }
      return {
        behavior: "deny",
        message: `only ${$5} is allowed for ${A.path}`,
        decisionReason: {
          type: "other",
          reason: `only ${$5} is allowed`
        }
      }
    };
  for await (let E of XY1({
    agentDefinition: eh3(),
    promptMessages: [R0({
      content: H
    })],
    toolUseContext: W,
    canUseTool: C,
    isAsync: !0,
    forkContextMessages: B,
    querySource: "magic_docs",
    override: {
      systemPrompt: G,
      userContext: Z,
      systemContext: I
    }
  }));
}
// @from(Start 14692578, End 14692601)
async function TU9() {}
// @from(Start 14692606, End 14692609)
rh3
// @from(Start 14692611, End 14692614)
oh3
// @from(Start 14692616, End 14692619)
aJ1
// @from(Start 14692621, End 14692624)
sPI
// @from(Start 14692630, End 14693053)
PU9 = L(() => {
  AQ();
  Dq();
  RU9();
  WY1();
  ISA();
  vM();
  cQ();
  Dq();
  rh3 = /^#\s*MAGIC\s+DOC:\s*(.+)$/im, oh3 = /^[_*](.+?)[_*]\s*$/m, aJ1 = new Map;
  sPI = q_(async function(A) {
    let {
      messages: Q,
      querySource: B
    } = A;
    if (B !== "repl_main_thread") return;
    if (ySA(Q)) return;
    if (aJ1.size === 0) return;
    for (let I of Array.from(aJ1.values())) await Ag3(I, A)
  })
})
// @from(Start 14693056, End 14693466)
function jU9(A) {
  let Q = [];
  for (let B of A)
    if (B.type === "user" && B.message?.content) {
      let G = "";
      if (typeof B.message.content === "string") G = B.message.content;
      else if (Array.isArray(B.message.content)) {
        for (let Z of B.message.content)
          if (Z.type === "text") G += Z.text + " "
      }
      if (G.trim()) Q.push(G.trim().slice(0, Qg3))
    } return Q
}
// @from(Start 14693468, End 14693557)
function Bg3(A) {
  return A.map((B) => `User: ${B}
Asst: [response hidden]`).join(`
`)
}
// @from(Start 14693559, End 14693716)
function Gg3(A) {
  let Q = B9(A, "frustrated"),
    B = B9(A, "pr_request");
  return {
    isFrustrated: Q === "true",
    hasPRRequest: B === "true"
  }
}
// @from(Start 14693717, End 14693750)
async function SU9() {
  return
}
// @from(Start 14693755, End 14693764)
Qg3 = 300
// @from(Start 14693768, End 14693771)
Zg3
// @from(Start 14693777, End 14695518)
_U9 = L(() => {
  zV0();
  ISA();
  cQ();
  t2();
  q0();
  cQ();
  Zg3 = {
    name: "session_quality_classifier",
    async shouldRun(A) {
      if (A.querySource !== "repl_main_thread") return !1;
      return jU9(A.messages).length > 0
    },
    buildMessages(A) {
      let Q = jU9(A.messages),
        B = Bg3(Q);
      return [R0({
        content: `Analyze the following conversation between a user and an assistant (assistant responses are hidden).

${B}

Think step-by-step about:
1. Does the user seem frustrated at the Asst based on their messages? Look for signs like repeated corrections, negative language, etc.
2. Has the user explicitly asked to SEND/CREATE/PUSH a pull request to GitHub? This means they want to actually submit a PR to a repository, not just work on code together or prepare changes. Look for explicit requests like: "create a pr", "send a pull request", "push a pr", "open a pr", "submit a pr to github", etc. Do NOT count mentions of working on a PR together, preparing for a PR, or discussing PR content.

Based on your analysis, output:
<frustrated>true/false</frustrated>
<pr_request>true/false</pr_request>`
      })]
    },
    systemPrompt: "You are analyzing user messages from a conversation to detect certain features of the interaction.",
    useTools: !1,
    parseResponse(A) {
      return Gg3(A)
    },
    logResult(A, Q) {
      if (A.type === "success") {
        let B = A.result;
        if (B.isFrustrated || B.hasPRRequest) GA("tengu_session_quality_classification", {
          uuid: A.uuid,
          isFrustrated: B.isFrustrated ? 1 : 0,
          hasPRRequest: B.hasPRRequest ? 1 : 0,
          messageCount: Q.queryMessageCount
        })
      }
    },
    getModel: MW
  }
})
// @from(Start 14695521, End 14695916)
function kU9({
  isFocused: A,
  isSelected: Q,
  children: B
}) {
  return dSA.default.createElement(S, {
    gap: 1,
    paddingLeft: A ? 0 : 2
  }, A && dSA.default.createElement($, {
    color: "suggestion"
  }, H1.pointer), dSA.default.createElement($, {
    color: Q ? "success" : A ? "suggestion" : void 0
  }, B), Q && dSA.default.createElement($, {
    color: "success"
  }, H1.tick))
}
// @from(Start 14695921, End 14695924)
dSA
// @from(Start 14695930, End 14695984)
yU9 = L(() => {
  hA();
  V9();
  dSA = BA(VA(), 1)
})
// @from(Start 14695990, End 14695993)
sJ1
// @from(Start 14695999, End 14696423)
xU9 = L(() => {
  sJ1 = class sJ1 extends Map {
    first;
    last;
    constructor(A) {
      let Q = [],
        B, G, Z, I = 0;
      for (let Y of A) {
        let J = {
          ...Y,
          previous: Z,
          next: void 0,
          index: I
        };
        if (Z) Z.next = J;
        B ||= J, G = J, Q.push([Y.value, J]), I++, Z = J
      }
      super(Q);
      this.first = B, this.last = G
    }
  }
})
// @from(Start 14696485, End 14696487)
FN
// @from(Start 14696489, End 14698672)
Ig3 = (A, Q) => {
    switch (Q.type) {
      case "focus-next-option": {
        if (!A.focusedValue) return A;
        let B = A.optionMap.get(A.focusedValue);
        if (!B) return A;
        let G = B.next || A.optionMap.first;
        if (!G) return A;
        if (!B.next && G === A.optionMap.first) return {
          ...A,
          focusedValue: G.value,
          visibleFromIndex: 0,
          visibleToIndex: A.visibleOptionCount
        };
        if (!(G.index >= A.visibleToIndex)) return {
          ...A,
          focusedValue: G.value
        };
        let I = Math.min(A.optionMap.size, A.visibleToIndex + 1),
          Y = I - A.visibleOptionCount;
        return {
          ...A,
          focusedValue: G.value,
          visibleFromIndex: Y,
          visibleToIndex: I
        }
      }
      case "focus-previous-option": {
        if (!A.focusedValue) return A;
        let B = A.optionMap.get(A.focusedValue);
        if (!B) return A;
        let G = B.previous || A.optionMap.last;
        if (!G) return A;
        if (!B.previous && G === A.optionMap.last) {
          let J = A.optionMap.size,
            W = Math.max(0, J - A.visibleOptionCount);
          return {
            ...A,
            focusedValue: G.value,
            visibleFromIndex: W,
            visibleToIndex: J
          }
        }
        if (!(G.index <= A.visibleFromIndex)) return {
          ...A,
          focusedValue: G.value
        };
        let I = Math.max(0, A.visibleFromIndex - 1),
          Y = I + A.visibleOptionCount;
        return {
          ...A,
          focusedValue: G.value,
          visibleFromIndex: I,
          visibleToIndex: Y
        }
      }
      case "toggle-focused-option": {
        if (!A.focusedValue) return A;
        if (A.value.includes(A.focusedValue)) {
          let B = new Set(A.value);
          return B.delete(A.focusedValue), {
            ...A,
            previousValue: A.value,
            value: [...B]
          }
        }
        return {
          ...A,
          previousValue: A.value,
          value: [...A.value, A.focusedValue]
        }
      }
      case "reset":
        return Q.state
    }
  }
// @from(Start 14698676, End 14699067)
bU9 = ({
    visibleOptionCount: A,
    defaultValue: Q,
    options: B
  }) => {
    let G = typeof A === "number" ? Math.min(A, B.length) : B.length,
      Z = new sJ1(B),
      I = Q ?? [];
    return {
      optionMap: Z,
      visibleOptionCount: G,
      focusedValue: Z.first?.value,
      visibleFromIndex: 0,
      visibleToIndex: G,
      previousValue: I,
      value: I
    }
  }
// @from(Start 14699071, End 14700531)
fU9 = ({
    visibleOptionCount: A = 5,
    options: Q,
    defaultValue: B,
    onChange: G,
    onSubmit: Z
  }) => {
    let [I, Y] = FN.useReducer(Ig3, {
      visibleOptionCount: A,
      defaultValue: B,
      options: Q
    }, bU9), [J, W] = FN.useState(Q);
    if (Q !== J && !vU9(Q, J)) Y({
      type: "reset",
      state: bU9({
        visibleOptionCount: A,
        defaultValue: B,
        options: Q
      })
    }), W(Q);
    let X = FN.useCallback(() => {
        Y({
          type: "focus-next-option"
        })
      }, []),
      V = FN.useCallback(() => {
        Y({
          type: "focus-previous-option"
        })
      }, []),
      F = FN.useCallback(() => {
        Y({
          type: "toggle-focused-option"
        })
      }, []),
      K = FN.useCallback(() => {
        Z?.(I.value)
      }, [I.value, Z]),
      D = FN.useMemo(() => {
        return Q.map((H, C) => ({
          ...H,
          index: C
        })).slice(I.visibleFromIndex, I.visibleToIndex)
      }, [Q, I.visibleFromIndex, I.visibleToIndex]);
    return FN.useEffect(() => {
      if (!vU9(I.previousValue, I.value)) G?.(I.value)
    }, [I.previousValue, I.value, Q, G]), {
      focusedValue: I.focusedValue,
      visibleFromIndex: I.visibleFromIndex,
      visibleToIndex: I.visibleToIndex,
      value: I.value,
      visibleOptions: D,
      focusNextOption: X,
      focusPreviousOption: V,
      toggleFocusedOption: F,
      submit: K
    }
  }
// @from(Start 14700537, End 14700583)
hU9 = L(() => {
  xU9();
  FN = BA(VA(), 1)
})
// @from(Start 14700589, End 14700845)
gU9 = ({
  isDisabled: A = !1,
  state: Q
}) => {
  f1((B, G) => {
    if (G.downArrow) Q.focusNextOption();
    if (G.upArrow) Q.focusPreviousOption();
    if (B === " ") Q.toggleFocusedOption();
    if (G.return) Q.submit()
  }, {
    isActive: !A
  })
}
// @from(Start 14700851, End 14700876)
uU9 = L(() => {
  hA()
})
// @from(Start 14700879, End 14701746)
function rJ1({
  isDisabled: A = !1,
  visibleOptionCount: Q = 5,
  highlightText: B,
  options: G,
  defaultValue: Z,
  onChange: I,
  onSubmit: Y
}) {
  let J = fU9({
    visibleOptionCount: Q,
    options: G,
    defaultValue: Z,
    onChange: I,
    onSubmit: Y
  });
  return gU9({
    isDisabled: A,
    state: J
  }), vVA.default.createElement(S, {
    flexDirection: "column"
  }, J.visibleOptions.map((W) => {
    let X = W.label;
    if (B && W.label.includes(B)) {
      let V = W.label.indexOf(B);
      X = vVA.default.createElement(vVA.default.Fragment, null, W.label.slice(0, V), vVA.default.createElement($, {
        bold: !0
      }, B), W.label.slice(V + B.length))
    }
    return vVA.default.createElement(kU9, {
      key: W.value,
      isFocused: !A && J.focusedValue === W.value,
      isSelected: J.value.includes(W.value)
    }, X)
  }))
}
// @from(Start 14701751, End 14701754)
vVA
// @from(Start 14701760, End 14701833)
ID0 = L(() => {
  hA();
  yU9();
  hU9();
  uU9();
  vVA = BA(VA(), 1)
})
// @from(Start 14701836, End 14703931)
function mU9({
  servers: A,
  scope: Q,
  onDone: B
}) {
  let G = Object.keys(A),
    [Z, I] = GF.useState({});
  GF.useEffect(() => {
    fk().then(({
      servers: F
    }) => I(F))
  }, []);
  let Y = G.filter((F) => Z[F] !== void 0);

  function J(F) {
    let K = 0;
    for (let D of F) {
      let H = A[D];
      if (H) {
        let C = D;
        if (Z[C] !== void 0) {
          let E = 1;
          while (Z[`${D}_${E}`] !== void 0) E++;
          C = `${D}_${E}`
        }
        K1A(C, H, Q), K++
      }
    }
    V(K)
  }
  let W = EQ();
  f1((F, K) => {
    if (K.escape) {
      V(0);
      return
    }
  });
  let [X] = qB();

  function V(F) {
    if (F > 0) L9(`
${ZB("success",X)(`Successfully imported ${F} MCP server${F!==1?"s":""} to ${Q} config.`)}
`);
    else L9(`
No servers were imported.`);
    B(), v6()
  }
  return GF.default.createElement(GF.default.Fragment, null, GF.default.createElement(S, {
    flexDirection: "column",
    gap: 1,
    padding: 1,
    borderStyle: "round",
    borderColor: "success"
  }, GF.default.createElement($, {
    bold: !0,
    color: "success"
  }, "Import MCP Servers from Claude Desktop"), GF.default.createElement($, null, "Found ", G.length, " MCP server", G.length !== 1 ? "s" : "", " in Claude Desktop."), Y.length > 0 && GF.default.createElement($, {
    color: "warning"
  }, "Note: Some servers already exist with the same name. If selected, they will be imported with a numbered suffix."), GF.default.createElement($, null, "Please select the servers you want to import:"), GF.default.createElement(rJ1, {
    options: G.map((F) => ({
      label: `${F}${Y.includes(F)?" (already exists)":""}`,
      value: F
    })),
    defaultValue: G.filter((F) => !Y.includes(F)),
    onSubmit: J
  })), GF.default.createElement(S, {
    marginLeft: 3
  }, GF.default.createElement($, {
    dimColor: !0
  }, W.pending ? GF.default.createElement(GF.default.Fragment, null, "Press ", W.keyName, " again to exit") : GF.default.createElement(GF.default.Fragment, null, "Space to select · Enter to confirm · Esc to cancel"))))
}
// @from(Start 14703936, End 14703938)
GF
// @from(Start 14703944, End 14704022)
dU9 = L(() => {
  hA();
  ID0();
  Q4();
  tM();
  kW();
  GF = BA(VA(), 1)
})
// @from(Start 14704081, End 14705209)
function Yg3() {
  let A = dQ();
  if (!LD1.includes(A)) throw Error(`Unsupported platform: ${A} - Claude Desktop integration only works on macOS and WSL.`);
  if (A === "macos") return YD0.join(cU9.homedir(), "Library", "Application Support", "Claude", "claude_desktop_config.json");
  let Q = process.env.USERPROFILE ? process.env.USERPROFILE.replace(/\\/g, "/") : null;
  if (Q) {
    let G = `/mnt/c${Q.replace(/^[A-Z]:/,"")}/AppData/Roaming/Claude/claude_desktop_config.json`;
    if (RA().existsSync(G)) return G
  }
  try {
    if (RA().existsSync("/mnt/c/Users")) {
      let G = RA().readdirSync("/mnt/c/Users");
      for (let Z of G) {
        if (Z.name === "Public" || Z.name === "Default" || Z.name === "Default User" || Z.name === "All Users") continue;
        let I = YD0.join("/mnt/c/Users", Z.name, "AppData", "Roaming", "Claude", "claude_desktop_config.json");
        if (RA().existsSync(I)) return I
      }
    }
  } catch (B) {
    AA(B instanceof Error ? B : Error(String(B)))
  }
  throw Error("Could not find Claude Desktop config file in Windows. Make sure Claude Desktop is installed on Windows.")
}
// @from(Start 14705211, End 14705903)
function pU9() {
  if (!LD1.includes(dQ())) throw Error("Unsupported platform - Claude Desktop integration only works on macOS and WSL.");
  try {
    let A = Yg3();
    if (!RA().existsSync(A)) return {};
    let Q = RA().readFileSync(A, {
        encoding: "utf8"
      }),
      B = f7(Q);
    if (!B || typeof B !== "object") return {};
    let G = B.mcpServers;
    if (!G || typeof G !== "object") return {};
    let Z = {};
    for (let [I, Y] of Object.entries(G)) {
      if (!Y || typeof Y !== "object") continue;
      let J = je1.safeParse(Y);
      if (J.success) Z[I] = J.data
    }
    return Z
  } catch (A) {
    return AA(A instanceof Error ? A : Error(String(A))), {}
  }
}
// @from(Start 14705908, End 14705966)
lU9 = L(() => {
  LF();
  g1();
  MIA();
  Q3();
  AQ()
})
// @from(Start 14705969, End 14707742)
function oJ1({
  customApiKeyTruncated: A,
  onDone: Q
}) {
  function B(Z) {
    let I = N1();
    switch (Z) {
      case "yes": {
        c0({
          ...I,
          customApiKeyResponses: {
            ...I.customApiKeyResponses,
            approved: [...I.customApiKeyResponses?.approved ?? [], A]
          }
        }), Q();
        break
      }
      case "no": {
        c0({
          ...I,
          customApiKeyResponses: {
            ...I.customApiKeyResponses,
            rejected: [...I.customApiKeyResponses?.rejected ?? [], A]
          }
        }), Q();
        break
      }
    }
  }
  let G = EQ();
  return jC.default.createElement(jC.default.Fragment, null, jC.default.createElement(S, {
    flexDirection: "column",
    gap: 1,
    padding: 1,
    borderStyle: "round",
    borderColor: "warning"
  }, jC.default.createElement($, {
    bold: !0,
    color: "warning"
  }, "Detected a custom API key in your environment"), jC.default.createElement($, null, jC.default.createElement($, {
    bold: !0
  }, "ANTHROPIC_API_KEY"), jC.default.createElement($, null, ": sk-ant-...", A)), jC.default.createElement($, null, "Do you want to use this API key?"), jC.default.createElement(M0, {
    defaultValue: "no",
    focusValue: "no",
    options: [{
      label: "Yes",
      value: "yes"
    }, {
      label: `No (${tA.bold("recommended")})`,
      value: "no"
    }],
    onChange: (Z) => B(Z),
    onCancel: () => B("no")
  })), jC.default.createElement(S, {
    marginLeft: 3
  }, jC.default.createElement($, {
    dimColor: !0
  }, G.pending ? jC.default.createElement(jC.default.Fragment, null, "Press ", G.keyName, " again to exit") : jC.default.createElement(jC.default.Fragment, null, "Enter to confirm ", H1.dot, " Esc to cancel"))))
}
// @from(Start 14707747, End 14707749)
jC
// @from(Start 14707755, End 14707840)
JD0 = L(() => {
  hA();
  jQ();
  J5();
  Q4();
  F9();
  V9();
  jC = BA(VA(), 1)
})
// @from(Start 14707842, End 14709018)
async function Jg3() {
  try {
    let A = ["https://api.anthropic.com/api/hello", "https://console.anthropic.com/v1/oauth/hello"],
      Q = async (Z) => {
        try {
          let I = await YQ.get(Z, {
            headers: {
              "User-Agent": fc()
            }
          });
          if (I.status !== 200) return {
            success: !1,
            error: `Failed to connect to ${new URL(Z).hostname}: Status ${I.status}`
          };
          return {
            success: !0
          }
        } catch (I) {
          return {
            success: !1,
            error: `Failed to connect to ${new URL(Z).hostname}: ${I instanceof Error?I.code||I.message:String(I)}`
          }
        }
      }, G = (await Promise.all(A.map(Q))).find((Z) => !Z.success);
    if (G) GA("tengu_preflight_check_failed", {
      isConnectivityError: !1,
      hasErrorMessage: !!G.error
    });
    return G || {
      success: !0
    }
  } catch (A) {
    return AA(A), GA("tengu_preflight_check_failed", {
      isConnectivityError: !0
    }), {
      success: !1,
      error: `Connectivity check error: ${A instanceof Error?A.code||A.message:String(A)}`
    }
  }
}
// @from(Start 14709020, End 14710375)
function iU9({
  onSuccess: A
}) {
  let [Q, B] = TK.useState(null), [G, Z] = TK.useState(!0), I = F71(1000) && G;
  return TK.useEffect(() => {
    async function Y() {
      let J = await Jg3();
      B(J), Z(!1)
    }
    Y()
  }, []), TK.useEffect(() => {
    if (Q?.success) A();
    else if (Q && !Q.success) {
      let Y = setTimeout(() => process.exit(1), 100);
      return () => clearTimeout(Y)
    }
  }, [Q, A]), TK.default.createElement(S, {
    flexDirection: "column",
    gap: 1,
    paddingLeft: 1
  }, G && I ? TK.default.createElement(S, {
    paddingLeft: 1
  }, TK.default.createElement(g4, null), TK.default.createElement($, null, "Checking connectivity...")) : !Q?.success && !G && TK.default.createElement(S, {
    flexDirection: "column",
    gap: 1
  }, TK.default.createElement($, {
    color: "error"
  }, "Unable to connect to Anthropic services"), TK.default.createElement($, {
    color: "error"
  }, Q?.error), TK.default.createElement(S, {
    flexDirection: "column",
    gap: 1
  }, TK.default.createElement($, null, "Please check your internet connection and network settings."), TK.default.createElement($, null, "Note: Claude Code might not be available in your country. Check supported countries at", " ", TK.default.createElement($, {
    color: "suggestion"
  }, "https://anthropic.com/supported-countries")))))
}
// @from(Start 14710380, End 14710382)
TK
// @from(Start 14710388, End 14710482)
nU9 = L(() => {
  hA();
  AE();
  g1();
  DY();
  WZ0();
  q0();
  O3();
  TK = BA(VA(), 1)
})
// @from(Start 14710485, End 14716020)
function eJ1() {
  let [A] = qB(), Q = "Welcome to Claude Code";
  if (d0.terminal === "Apple_Terminal") return T0.default.createElement(Wg3, {
    theme: A,
    welcomeMessage: "Welcome to Claude Code"
  });
  if (["light", "light-daltonized", "light-ansi"].includes(A)) return T0.default.createElement(S, {
    width: tJ1
  }, T0.default.createElement($, null, T0.default.createElement($, null, T0.default.createElement($, {
    color: "claude"
  }, "Welcome to Claude Code", " "), T0.default.createElement($, {
    dimColor: !0
  }, "v", {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.0.59",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
  }.VERSION, " ")), T0.default.createElement($, null, "…………………………………………………………………………………………………………………………………………………………"), T0.default.createElement($, null, "                                                          "), T0.default.createElement($, null, "                                                          "), T0.default.createElement($, null, "                                                          "), T0.default.createElement($, null, "            ░░░░░░                                        "), T0.default.createElement($, null, "    ░░░   ░░░░░░░░░░                                      "), T0.default.createElement($, null, "   ░░░░░░░░░░░░░░░░░░░                                    "), T0.default.createElement($, null, "                                                          "), T0.default.createElement($, null, T0.default.createElement($, {
    dimColor: !0
  }, "                           ░░░░"), T0.default.createElement($, null, "                     ██    ")), T0.default.createElement($, null, T0.default.createElement($, {
    dimColor: !0
  }, "                         ░░░░░░░░░░"), T0.default.createElement($, null, "               ██▒▒██  ")), T0.default.createElement($, null, "                                            ▒▒      ██   ▒"), T0.default.createElement($, null, "      ", T0.default.createElement($, {
    color: "clawd_body"
  }, " █████████ "), "                         ▒▒░░▒▒      ▒ ▒▒"), T0.default.createElement($, null, "      ", T0.default.createElement($, {
    color: "clawd_body",
    backgroundColor: "clawd_background"
  }, "██▄█████▄██"), "                           ▒▒         ▒▒ "), T0.default.createElement($, null, "      ", T0.default.createElement($, {
    color: "clawd_body"
  }, " █████████ "), "                          ░          ▒   "), T0.default.createElement($, null, "…………………", T0.default.createElement($, {
    color: "clawd_body"
  }, "█ █   █ █"), "……………………………………………………………………░…………………………▒…………")));
  return T0.default.createElement(S, {
    width: tJ1
  }, T0.default.createElement($, null, T0.default.createElement($, null, T0.default.createElement($, {
    color: "claude"
  }, "Welcome to Claude Code", " "), T0.default.createElement($, {
    dimColor: !0
  }, "v", {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.0.59",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
  }.VERSION, " ")), T0.default.createElement($, null, "…………………………………………………………………………………………………………………………………………………………"), T0.default.createElement($, null, "                                                          "), T0.default.createElement($, null, "     *                                       █████▓▓░     "), T0.default.createElement($, null, "                                 *         ███▓░     ░░   "), T0.default.createElement($, null, "            ░░░░░░                        ███▓░           "), T0.default.createElement($, null, "    ░░░   ░░░░░░░░░░                      ███▓░           "), T0.default.createElement($, null, T0.default.createElement($, null, "   ░░░░░░░░░░░░░░░░░░░    "), T0.default.createElement($, {
    bold: !0
  }, "*"), T0.default.createElement($, null, "                ██▓░░      ▓   ")), T0.default.createElement($, null, "                                             ░▓▓███▓▓░    "), T0.default.createElement($, {
    dimColor: !0
  }, " *                                 ░░░░                   "), T0.default.createElement($, {
    dimColor: !0
  }, "                                 ░░░░░░░░                 "), T0.default.createElement($, {
    dimColor: !0
  }, "                               ░░░░░░░░░░░░░░░░           "), T0.default.createElement($, null, "      ", T0.default.createElement($, {
    color: "clawd_body"
  }, " █████████ "), "                                       ", T0.default.createElement($, {
    dimColor: !0
  }, "*"), T0.default.createElement($, null, " ")), T0.default.createElement($, null, "      ", T0.default.createElement($, {
    color: "clawd_body"
  }, "██▄█████▄██"), T0.default.createElement($, null, "                        "), T0.default.createElement($, {
    bold: !0
  }, "*"), T0.default.createElement($, null, "                ")), T0.default.createElement($, null, "      ", T0.default.createElement($, {
    color: "clawd_body"
  }, " █████████ "), "     *                                   "), T0.default.createElement($, null, "…………………", T0.default.createElement($, {
    color: "clawd_body"
  }, "█ █   █ █"), "………………………………………………………………………………………………………………")))
}