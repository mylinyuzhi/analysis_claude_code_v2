
// @from(Ln 443055, Col 4)
vP0 = U((yC7) => {
  var {
    InvalidArgumentError: PC7
  } = SuA();
  class MX9 {
    constructor(A, Q) {
      this.flags = A, this.description = Q || "", this.required = A.includes("<"), this.optional = A.includes("["), this.variadic = /\w\.\.\.[>\]]$/.test(A), this.mandatory = !1;
      let B = xC7(A);
      if (this.short = B.shortFlag, this.long = B.longFlag, this.negate = !1, this.long) this.negate = this.long.startsWith("--no-");
      this.defaultValue = void 0, this.defaultValueDescription = void 0, this.presetArg = void 0, this.envVar = void 0, this.parseArg = void 0, this.hidden = !1, this.argChoices = void 0, this.conflictsWith = [], this.implied = void 0
    }
    default (A, Q) {
      return this.defaultValue = A, this.defaultValueDescription = Q, this
    }
    preset(A) {
      return this.presetArg = A, this
    }
    conflicts(A) {
      return this.conflictsWith = this.conflictsWith.concat(A), this
    }
    implies(A) {
      let Q = A;
      if (typeof A === "string") Q = {
        [A]: !0
      };
      return this.implied = Object.assign(this.implied || {}, Q), this
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
    _concatValue(A, Q) {
      if (Q === this.defaultValue || !Array.isArray(Q)) return [A];
      return Q.concat(A)
    }
    choices(A) {
      return this.argChoices = A.slice(), this.parseArg = (Q, B) => {
        if (!this.argChoices.includes(Q)) throw new PC7(`Allowed choices are ${this.argChoices.join(", ")}.`);
        if (this.variadic) return this._concatValue(Q, B);
        return Q
      }, this
    }
    name() {
      if (this.long) return this.long.replace(/^--/, "");
      return this.short.replace(/^-/, "")
    }
    attributeName() {
      return SC7(this.name().replace(/^no-/, ""))
    }
    is(A) {
      return this.short === A || this.long === A
    }
    isBoolean() {
      return !this.required && !this.optional && !this.negate
    }
  }
  class RX9 {
    constructor(A) {
      this.positiveOptions = new Map, this.negativeOptions = new Map, this.dualOptions = new Set, A.forEach((Q) => {
        if (Q.negate) this.negativeOptions.set(Q.attributeName(), Q);
        else this.positiveOptions.set(Q.attributeName(), Q)
      }), this.negativeOptions.forEach((Q, B) => {
        if (this.positiveOptions.has(B)) this.dualOptions.add(B)
      })
    }
    valueFromOption(A, Q) {
      let B = Q.attributeName();
      if (!this.dualOptions.has(B)) return !0;
      let G = this.negativeOptions.get(B).presetArg,
        Z = G !== void 0 ? G : !1;
      return Q.negate === (Z === A)
    }
  }

  function SC7(A) {
    return A.split("-").reduce((Q, B) => {
      return Q + B[0].toUpperCase() + B.slice(1)
    })
  }

  function xC7(A) {
    let Q, B, G = A.split(/[ |,]+/);
    if (G.length > 1 && !/^[[<]/.test(G[1])) Q = G.shift();
    if (B = G.shift(), !Q && /^-[^-]$/.test(B)) Q = B, B = void 0;
    return {
      shortFlag: Q,
      longFlag: B
    }
  }
  yC7.Option = MX9;
  yC7.DualOptions = RX9
})
// @from(Ln 443155, Col 4)
_X9 = U((hC7) => {
  function bC7(A, Q) {
    if (Math.abs(A.length - Q.length) > 3) return Math.max(A.length, Q.length);
    let B = [];
    for (let G = 0; G <= A.length; G++) B[G] = [G];
    for (let G = 0; G <= Q.length; G++) B[0][G] = G;
    for (let G = 1; G <= Q.length; G++)
      for (let Z = 1; Z <= A.length; Z++) {
        let Y = 1;
        if (A[Z - 1] === Q[G - 1]) Y = 0;
        else Y = 1;
        if (B[Z][G] = Math.min(B[Z - 1][G] + 1, B[Z][G - 1] + 1, B[Z - 1][G - 1] + Y), Z > 1 && G > 1 && A[Z - 1] === Q[G - 2] && A[Z - 2] === Q[G - 1]) B[Z][G] = Math.min(B[Z][G], B[Z - 2][G - 2] + 1)
      }
    return B[A.length][Q.length]
  }

  function fC7(A, Q) {
    if (!Q || Q.length === 0) return "";
    Q = Array.from(new Set(Q));
    let B = A.startsWith("--");
    if (B) A = A.slice(2), Q = Q.map((J) => J.slice(2));
    let G = [],
      Z = 3,
      Y = 0.4;
    if (Q.forEach((J) => {
        if (J.length <= 1) return;
        let X = bC7(A, J),
          I = Math.max(A.length, J.length);
        if ((I - X) / I > Y) {
          if (X < Z) Z = X, G = [J];
          else if (X === Z) G.push(J)
        }
      }), G.sort((J, X) => J.localeCompare(X)), B) G = G.map((J) => `--${J}`);
    if (G.length > 1) return `
(Did you mean one of ${G.join(", ")}?)`;
    if (G.length === 1) return `
(Did you mean ${G[0]}?)`;
    return ""
  }
  hC7.suggestSimilar = fC7
})
// @from(Ln 443196, Col 4)
SX9 = U((lC7) => {
  var uC7 = NA("node:events").EventEmitter,
    kP0 = NA("node:child_process"),
    jp = NA("node:path"),
    bP0 = NA("node:fs"),
    KD = NA("node:process"),
    {
      Argument: mC7,
      humanReadableArgName: dC7
    } = L$1(),
    {
      CommanderError: fP0
    } = SuA(),
    {
      Help: cC7
    } = yP0(),
    {
      Option: jX9,
      DualOptions: pC7
    } = vP0(),
    {
      suggestSimilar: TX9
    } = _X9();
  class hP0 extends uC7 {
    constructor(A) {
      super();
      this.commands = [], this.options = [], this.parent = null, this._allowUnknownOption = !1, this._allowExcessArguments = !0, this.registeredArguments = [], this._args = this.registeredArguments, this.args = [], this.rawArgs = [], this.processedArgs = [], this._scriptPath = null, this._name = A || "", this._optionValues = {}, this._optionValueSources = {}, this._storeOptionsAsProperties = !1, this._actionHandler = null, this._executableHandler = !1, this._executableFile = null, this._executableDir = null, this._defaultCommandName = null, this._exitCallback = null, this._aliases = [], this._combineFlagAndOptionalValue = !0, this._description = "", this._summary = "", this._argsDescription = void 0, this._enablePositionalOptions = !1, this._passThroughOptions = !1, this._lifeCycleHooks = {}, this._showHelpAfterError = !1, this._showSuggestionAfterError = !0, this._outputConfiguration = {
        writeOut: (Q) => KD.stdout.write(Q),
        writeErr: (Q) => KD.stderr.write(Q),
        getOutHelpWidth: () => KD.stdout.isTTY ? KD.stdout.columns : void 0,
        getErrHelpWidth: () => KD.stderr.isTTY ? KD.stderr.columns : void 0,
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
      let [, Y, J] = A.match(/([^ ]+) *(.*)/), X = this.createCommand(Y);
      if (G) X.description(G), X._executableHandler = !0;
      if (Z.isDefault) this._defaultCommandName = X._name;
      if (X._hidden = !!(Z.noHelp || Z.hidden), X._executableFile = Z.executableFile || null, J) X.arguments(J);
      if (this._registerCommand(X), X.parent = this, X.copyInheritedSettings(this), G) return this;
      return X
    }
    createCommand(A) {
      return new hP0(A)
    }
    createHelp() {
      return Object.assign(new cC7, this.configureHelp())
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
      return new mC7(A, Q)
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
      let [, B, G] = A.match(/([^ ]+) *(.*)/), Z = Q ?? "display help for command", Y = this.createCommand(B);
      if (Y.helpOption(!1), G) Y.arguments(G);
      if (Z) Y.description(Z);
      return this._addImplicitHelpCommand = !0, this._helpCommand = Y, this
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
      if (this._exitCallback) this._exitCallback(new fP0(A, Q, B));
      KD.exit(A)
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
      return new jX9(A, Q)
    }
    _callParseArg(A, Q, B, G) {
      try {
        return A.parseArg(Q, B)
      } catch (Z) {
        if (Z.code === "commander.invalidArgument") {
          let Y = `${G} ${Z.message}`;
          this.error(Y, {
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
      let G = (Z, Y, J) => {
        if (Z == null && A.presetArg !== void 0) Z = A.presetArg;
        let X = this.getOptionValue(B);
        if (Z !== null && A.parseArg) Z = this._callParseArg(A, Z, X, Y);
        else if (Z !== null && A.variadic) Z = A._concatValue(Z, X);
        if (Z == null)
          if (A.negate) Z = !1;
          else if (A.isBoolean() || A.optional) Z = !0;
        else Z = "";
        this.setOptionValueWithSource(B, Z, J)
      };
      if (this.on("option:" + Q, (Z) => {
          let Y = `error: option '${A.flags}' argument '${Z}' is invalid.`;
          G(Z, Y, "cli")
        }), A.envVar) this.on("optionEnv:" + Q, (Z) => {
        let Y = `error: option '${A.flags}' value '${Z}' from env '${A.envVar}' is invalid.`;
        G(Z, Y, "env")
      });
      return this
    }
    _optionEx(A, Q, B, G, Z) {
      if (typeof Q === "object" && Q instanceof jX9) throw Error("To add an Option object use addOption() instead of option() or requiredOption()");
      let Y = this.createOption(Q, B);
      if (Y.makeOptionMandatory(!!A.mandatory), typeof G === "function") Y.default(Z).argParser(G);
      else if (G instanceof RegExp) {
        let J = G;
        G = (X, I) => {
          let D = J.exec(X);
          return D ? D[0] : I
        }, Y.default(Z).argParser(G)
      } else Y.default(G);
      return this.addOption(Y)
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
        if (KD.versions?.electron) Q.from = "electron";
        let G = KD.execArgv ?? [];
        if (G.includes("-e") || G.includes("--eval") || G.includes("-p") || G.includes("--print")) Q.from = "eval"
      }
      if (A === void 0) A = KD.argv;
      this.rawArgs = A.slice();
      let B;
      switch (Q.from) {
        case void 0:
        case "node":
          this._scriptPath = A[1], B = A.slice(2);
          break;
        case "electron":
          if (KD.defaultApp) this._scriptPath = A[1], B = A.slice(2);
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

      function Z(D, W) {
        let K = jp.resolve(D, W);
        if (bP0.existsSync(K)) return K;
        if (G.includes(jp.extname(W))) return;
        let V = G.find((F) => bP0.existsSync(`${K}${F}`));
        if (V) return `${K}${V}`;
        return
      }
      this._checkForMissingMandatoryOptions(), this._checkForConflictingOptions();
      let Y = A._executableFile || `${this._name}-${A._name}`,
        J = this._executableDir || "";
      if (this._scriptPath) {
        let D;
        try {
          D = bP0.realpathSync(this._scriptPath)
        } catch (W) {
          D = this._scriptPath
        }
        J = jp.resolve(jp.dirname(D), J)
      }
      if (J) {
        let D = Z(J, Y);
        if (!D && !A._executableFile && this._scriptPath) {
          let W = jp.basename(this._scriptPath, jp.extname(this._scriptPath));
          if (W !== this._name) D = Z(J, `${W}-${A._name}`)
        }
        Y = D || Y
      }
      B = G.includes(jp.extname(Y));
      let X;
      if (KD.platform !== "win32")
        if (B) Q.unshift(Y), Q = PX9(KD.execArgv).concat(Q), X = kP0.spawn(KD.argv[0], Q, {
          stdio: "inherit"
        });
        else X = kP0.spawn(Y, Q, {
          stdio: "inherit"
        });
      else Q.unshift(Y), Q = PX9(KD.execArgv).concat(Q), X = kP0.spawn(KD.execPath, Q, {
        stdio: "inherit"
      });
      if (!X.killed)["SIGUSR1", "SIGUSR2", "SIGTERM", "SIGINT", "SIGHUP"].forEach((W) => {
        KD.on(W, () => {
          if (X.killed === !1 && X.exitCode === null) X.kill(W)
        })
      });
      let I = this._exitCallback;
      X.on("close", (D) => {
        if (D = D ?? 1, !I) KD.exit(D);
        else I(new fP0(D, "commander.executeSubCommandAsync", "(close)"))
      }), X.on("error", (D) => {
        if (D.code === "ENOENT") {
          let W = J ? `searched for local subcommand relative to directory '${J}'` : "no directory for search for local subcommand, use .executableDir() to supply a custom directory",
            K = `'${Y}' does not exist
 - if '${A._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${W}`;
          throw Error(K)
        } else if (D.code === "EACCES") throw Error(`'${Y}' not executable`);
        if (!I) KD.exit(1);
        else {
          let W = new fP0(1, "commander.executeSubCommandAsync", "(error)");
          W.nestedError = D, I(W)
        }
      }), this.runningCommand = X
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
        let Y = G;
        if (G !== null && B.parseArg) {
          let J = `error: command-argument value '${G}' is invalid for argument '${B.name()}'.`;
          Y = this._callParseArg(B, G, Z, J)
        }
        return Y
      };
      this._checkNumberOfArguments();
      let Q = [];
      this.registeredArguments.forEach((B, G) => {
        let Z = B.defaultValue;
        if (B.variadic) {
          if (G < this.args.length) {
            if (Z = this.args.slice(G), B.parseArg) Z = Z.reduce((Y, J) => {
              return A(B, J, Y)
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
          Z._lifeCycleHooks[Q].forEach((Y) => {
            G.push({
              hookedCommand: Z,
              callback: Y
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
        let Y;
        if (Y = this._chainOrCallHooks(Y, "preAction"), Y = this._chainOrCall(Y, () => this._actionHandler(this.processedArgs)), this.parent) Y = this._chainOrCall(Y, () => {
          this.parent.emit(Z, A, Q)
        });
        return Y = this._chainOrCallHooks(Y, "postAction"), Y
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

      function Y(X) {
        return X.length > 1 && X[0] === "-"
      }
      let J = null;
      while (Z.length) {
        let X = Z.shift();
        if (X === "--") {
          if (G === B) G.push(X);
          G.push(...Z);
          break
        }
        if (J && !Y(X)) {
          this.emit(`option:${J.name()}`, X);
          continue
        }
        if (J = null, Y(X)) {
          let I = this._findOption(X);
          if (I) {
            if (I.required) {
              let D = Z.shift();
              if (D === void 0) this.optionMissingArgument(I);
              this.emit(`option:${I.name()}`, D)
            } else if (I.optional) {
              let D = null;
              if (Z.length > 0 && !Y(Z[0])) D = Z.shift();
              this.emit(`option:${I.name()}`, D)
            } else this.emit(`option:${I.name()}`);
            J = I.variadic ? I : null;
            continue
          }
        }
        if (X.length > 2 && X[0] === "-" && X[1] !== "-") {
          let I = this._findOption(`-${X[1]}`);
          if (I) {
            if (I.required || I.optional && this._combineFlagAndOptionalValue) this.emit(`option:${I.name()}`, X.slice(2));
            else this.emit(`option:${I.name()}`), Z.unshift(`-${X.slice(2)}`);
            continue
          }
        }
        if (/^--[^=]+=/.test(X)) {
          let I = X.indexOf("="),
            D = this._findOption(X.slice(0, I));
          if (D && (D.required || D.optional)) {
            this.emit(`option:${D.name()}`, X.slice(I + 1));
            continue
          }
        }
        if (Y(X)) G = B;
        if ((this._enablePositionalOptions || this._passThroughOptions) && Q.length === 0 && B.length === 0) {
          if (this._findCommand(X)) {
            if (Q.push(X), Z.length > 0) B.push(...Z);
            break
          } else if (this._getHelpCommand() && X === this._getHelpCommand().name()) {
            if (Q.push(X), Z.length > 0) Q.push(...Z);
            break
          } else if (this._defaultCommandName) {
            if (B.push(X), Z.length > 0) B.push(...Z);
            break
          }
        }
        if (this._passThroughOptions) {
          if (G.push(X), Z.length > 0) G.push(...Z);
          break
        }
        G.push(X)
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
        if (A.envVar && A.envVar in KD.env) {
          let Q = A.attributeName();
          if (this.getOptionValue(Q) === void 0 || ["default", "config", "env"].includes(this.getOptionValueSource(Q)))
            if (A.required || A.optional) this.emit(`optionEnv:${A.name()}`, KD.env[A.envVar]);
            else this.emit(`optionEnv:${A.name()}`)
        }
      })
    }
    _parseOptionsImplied() {
      let A = new pC7(this.options),
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
      let B = (Y) => {
          let J = Y.attributeName(),
            X = this.getOptionValue(J),
            I = this.options.find((W) => W.negate && J === W.attributeName()),
            D = this.options.find((W) => !W.negate && J === W.attributeName());
          if (I && (I.presetArg === void 0 && X === !1 || I.presetArg !== void 0 && X === I.presetArg)) return I;
          return D || Y
        },
        G = (Y) => {
          let J = B(Y),
            X = J.attributeName();
          if (this.getOptionValueSource(X) === "env") return `environment variable '${J.envVar}'`;
          return `option '${J.flags}'`
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
          let Y = Z.createHelp().visibleOptions(Z).filter((J) => J.long).map((J) => J.long);
          G = G.concat(Y), Z = Z.parent
        } while (Z && !Z._enablePositionalOptions);
        Q = TX9(A, G)
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
        }), Q = TX9(A, G)
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
          return dC7(B)
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
      return this._name = jp.basename(A, jp.extname(A)), this
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
      let Q = KD.exitCode || 0;
      if (Q === 0 && A && typeof A !== "function" && A.error) Q = 1;
      this._exit(Q, "commander.help", "(outputHelp)")
    }
    addHelpText(A, Q) {
      let B = ["beforeAll", "before", "after", "afterAll"];
      if (!B.includes(A)) throw Error(`Unexpected value for position to addHelpText.
Expecting one of '${B.join("', '")}'`);
      let G = `${A}Help`;
      return this.on(G, (Z) => {
        let Y;
        if (typeof Q === "function") Y = Q({
          error: Z.error,
          command: Z.command
        });
        else Y = Q;
        if (Y) Z.write(`${Y}
`)
      }), this
    }
    _outputHelpIfRequested(A) {
      let Q = this._getHelpOption();
      if (Q && A.find((G) => Q.is(G))) this.outputHelp(), this._exit(0, "commander.helpDisplayed", "(outputHelp)")
    }
  }

  function PX9(A) {
    return A.map((Q) => {
      if (!Q.startsWith("--inspect")) return Q;
      let B, G = "127.0.0.1",
        Z = "9229",
        Y;
      if ((Y = Q.match(/^(--inspect(-brk)?)$/)) !== null) B = Y[1];
      else if ((Y = Q.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null)
        if (B = Y[1], /^\d+$/.test(Y[3])) Z = Y[3];
        else G = Y[3];
      else if ((Y = Q.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) B = Y[1], G = Y[3], Z = Y[4];
      if (B && Z !== "0") return `${B}=${G}:${parseInt(Z)+1}`;
      return Q
    })
  }
  lC7.Command = hP0
})
// @from(Ln 444072, Col 4)
kX9 = U((oC7) => {
  var {
    Argument: xX9
  } = L$1(), {
    Command: gP0
  } = SX9(), {
    CommanderError: nC7,
    InvalidArgumentError: yX9
  } = SuA(), {
    Help: aC7
  } = yP0(), {
    Option: vX9
  } = vP0();
  oC7.program = new gP0;
  oC7.createCommand = (A) => new gP0(A);
  oC7.createOption = (A, Q) => new vX9(A, Q);
  oC7.createArgument = (A, Q) => new xX9(A, Q);
  oC7.Command = gP0;
  oC7.Option = vX9;
  oC7.Argument = xX9;
  oC7.Help = aC7;
  oC7.CommanderError = nC7;
  oC7.InvalidArgumentError = yX9;
  oC7.InvalidOptionArgumentError = yX9
})
// @from(Ln 444097, Col 4)
fX9 = U((ZM, bX9) => {
  var ux = kX9();
  ZM = bX9.exports = {};
  ZM.program = new ux.Command;
  ZM.Argument = ux.Argument;
  ZM.Command = ux.Command;
  ZM.CommanderError = ux.CommanderError;
  ZM.Help = ux.Help;
  ZM.InvalidArgumentError = ux.InvalidArgumentError;
  ZM.InvalidOptionArgumentError = ux.InvalidArgumentError;
  ZM.Option = ux.Option;
  ZM.createCommand = (A) => new ux.Command(A);
  ZM.createOption = (A, Q) => new ux.Option(A, Q);
  ZM.createArgument = (A, Q) => new ux.Argument(A, Q)
})
// @from(Ln 444112, Col 4)
hX9
// @from(Ln 444112, Col 9)
sKJ
// @from(Ln 444112, Col 14)
tKJ
// @from(Ln 444112, Col 19)
eKJ
// @from(Ln 444112, Col 24)
AVJ
// @from(Ln 444112, Col 29)
QVJ
// @from(Ln 444112, Col 34)
BVJ
// @from(Ln 444112, Col 39)
GVJ
// @from(Ln 444112, Col 44)
O$1
// @from(Ln 444112, Col 49)
ZVJ
// @from(Ln 444112, Col 54)
LK
// @from(Ln 444112, Col 58)
YVJ
// @from(Ln 444113, Col 4)
uP0 = w(() => {
  hX9 = c(fX9(), 1), {
    program: sKJ,
    createCommand: tKJ,
    createArgument: eKJ,
    createOption: AVJ,
    CommanderError: QVJ,
    InvalidArgumentError: BVJ,
    InvalidOptionArgumentError: GVJ,
    Command: O$1,
    Argument: ZVJ,
    Option: LK,
    Help: YVJ
  } = hX9.default
})
// @from(Ln 444129, Col 0)
function M$1(A) {
  return A.map((Q) => ({
    name: e3(Q.name),
    type: Q.type,
    hasTools: Q.type === "connected" && Q.capabilities?.tools !== void 0,
    hasResources: Q.type === "connected" && Q.capabilities?.resources !== void 0,
    hasPrompts: Q.type === "connected" && Q.capabilities?.prompts !== void 0,
    serverInfo: Q.type === "connected" && "serverInfo" in Q ? Q.serverInfo : void 0
  }))
}
// @from(Ln 444139, Col 4)
mP0 = () => {}
// @from(Ln 444141, Col 0)
function R$1(A, Q) {
  let B = Q?.server,
    G = B ? e3(B) : void 0,
    Z = G ? `mcp__${G}__` : "mcp__";
  return A.filter((J) => J.name.startsWith(Z)).map((J) => {
    let X = qF(J.name);
    return {
      server: X?.serverName || "unknown",
      name: X?.toolName || J.name,
      description: typeof J.description === "function" ? void 0 : J.description || "",
      fullName: J.name
    }
  })
}
// @from(Ln 444155, Col 4)
dP0 = w(() => {
  PJ()
})
// @from(Ln 444158, Col 0)
async function _$1(A, {
  server: Q,
  toolName: B
}) {
  let G = A.find((Y) => Y.name === `mcp__${Q}__${B}`);
  if (!G) return null;
  let Z = "";
  if (typeof G.description === "string") Z = G.description;
  else if (typeof G.description === "function") try {
    Z = await G.description({}, {
      isNonInteractiveSession: !0,
      toolPermissionContext: oL(),
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
// @from(Ln 444181, Col 4)
cP0 = () => {}
// @from(Ln 444183, Col 0)
function j$1(A, {
  pattern: Q,
  ignoreCase: B
}) {
  let G;
  try {
    G = new RegExp(Q, B ? "i" : "")
  } catch (J) {
    throw Error(`Invalid regex pattern: ${J instanceof Error?J.message:String(J)}`)
  }
  let Z = A.filter((J) => J.name.startsWith("mcp__")),
    Y = [];
  for (let J of Z) {
    let X = qF(J.name),
      I = X?.serverName || "unknown",
      D = X?.toolName || J.name,
      W = typeof J.description === "string" ? J.description : "";
    if (G.test(D) || G.test(W)) Y.push({
      server: I,
      name: D,
      fullName: J.name,
      description: W
    })
  }
  return Y
}
// @from(Ln 444209, Col 4)
pP0 = w(() => {
  PJ()
})
// @from(Ln 444213, Col 0)
function T$1(A, Q, B) {
  let G = Q?.server;
  if (G) {
    let Z = A[G] || [],
      Y = G;
    if (Z.length === 0 && B) {
      let J = B[G];
      if (J && A[J]) Z = A[J], Y = J
    }
    return Z.map((J) => ({
      ...J,
      server: e3(Y)
    }))
  }
  return Object.entries(A).flatMap(([Z, Y]) => Y.map((J) => ({
    ...J,
    server: e3(Z)
  })))
}
// @from(Ln 444232, Col 4)
lP0 = () => {}
// @from(Ln 444233, Col 4)
XU7
// @from(Ln 444233, Col 9)
iP0
// @from(Ln 444233, Col 14)
IU7
// @from(Ln 444233, Col 19)
nP0
// @from(Ln 444233, Col 24)
DU7
// @from(Ln 444233, Col 29)
gX9
// @from(Ln 444233, Col 34)
WU7
// @from(Ln 444233, Col 39)
KU7
// @from(Ln 444233, Col 44)
uX9
// @from(Ln 444233, Col 49)
VU7
// @from(Ln 444233, Col 54)
mX9
// @from(Ln 444233, Col 59)
FU7
// @from(Ln 444233, Col 64)
dX9
// @from(Ln 444234, Col 4)
P$1 = w(() => {
  j9();
  XU7 = m.object({
    command: m.literal("servers")
  }), iP0 = m.array(m.object({
    name: m.string(),
    type: m.string(),
    hasTools: m.boolean().optional(),
    hasResources: m.boolean().optional(),
    hasPrompts: m.boolean().optional(),
    serverInfo: m.object({
      name: m.string(),
      version: m.string()
    }).optional()
  })), IU7 = m.object({
    command: m.literal("tools"),
    params: m.object({
      server: m.string().optional()
    }).optional()
  }), nP0 = m.array(m.object({
    server: m.string(),
    name: m.string(),
    description: m.string().optional(),
    fullName: m.string()
  })), DU7 = m.object({
    command: m.literal("info"),
    params: m.object({
      server: m.string(),
      toolName: m.string()
    })
  }), gX9 = m.object({
    server: m.string(),
    name: m.string(),
    fullName: m.string(),
    description: m.string(),
    inputSchema: m.record(m.string(), m.unknown())
  }).or(m.null()), WU7 = m.object({
    command: m.literal("call"),
    params: m.object({
      server: m.string(),
      tool: m.string(),
      args: m.record(m.string(), m.unknown()),
      timeoutMs: m.number().optional()
    })
  }), KU7 = m.object({
    command: m.literal("grep"),
    params: m.object({
      pattern: m.string(),
      ignoreCase: m.boolean().optional()
    })
  }), uX9 = m.array(m.object({
    server: m.string(),
    name: m.string(),
    fullName: m.string(),
    description: m.string()
  })), VU7 = m.object({
    command: m.literal("resources"),
    params: m.object({
      server: m.string().optional()
    }).optional()
  }), mX9 = m.array(m.object({
    uri: m.string(),
    name: m.string().optional(),
    description: m.string().optional(),
    mimeType: m.string().optional(),
    server: m.string()
  })), FU7 = m.object({
    command: m.literal("read"),
    params: m.object({
      server: m.string(),
      uri: m.string(),
      timeoutMs: m.number().optional()
    })
  }), dX9 = m.discriminatedUnion("command", [XU7, IU7, DU7, WU7, KU7, VU7, FU7])
})
// @from(Ln 444317, Col 0)
function S$1() {
  let A = H$A();
  return HU7(Rp(), `${A}.endpoint`)
}
// @from(Ln 444322, Col 0)
function q8A(A) {
  if (A) aP0 = A;
  if (!aP0) return;
  zU7(Rp(), {
    recursive: !0
  });
  let Q = S$1(),
    B = Buffer.from(eA(aP0)).toString("base64");
  bB(Q, B, {
    mode: 384
  })
}
// @from(Ln 444335, Col 0)
function cX9() {
  let A = S$1();
  try {
    let Q = EU7(A, "utf-8");
    return AQ(Buffer.from(Q, "base64").toString("utf-8"))
  } catch {
    return null
  }
}
// @from(Ln 444344, Col 4)
aP0 = null
// @from(Ln 444345, Col 4)
$$A = w(() => {
  A0();
  E$A();
  A0()
})
// @from(Ln 444351, Col 0)
function xuA(A, Q, B) {
  let G = A.find((Y) => Y.name === Q);
  if (G) return G;
  let Z = B?.[Q];
  if (Z) return A.find((Y) => Y.name === Z);
  return
}
// @from(Ln 444359, Col 0)
function N8A(A, Q) {
  if (!Q) return Error(`Server '${A}' not found`);
  if (Q !== "connected") return Error(`Server '${A}' is not connected (${Q==="needs-auth"?"needs authentication":Q}). Run '/mcp' to manage server connections.`);
  return null
}
// @from(Ln 444365, Col 0)
class kuA {
  constructor(A = aX9.stdin, Q = aX9.stdout) {
    this._stdin = A, this._stdout = Q, this._readBuffer = new gxA, this._started = !1, this._ondata = (B) => {
      this._readBuffer.append(B), this.processReadBuffer()
    }, this._onerror = (B) => {
      var G;
      (G = this.onerror) === null || G === void 0 || G.call(this, B)
    }
  }
  async start() {
    if (this._started) throw Error("StdioServerTransport already started! If using Server class, note that connect() calls start() automatically.");
    this._started = !0, this._stdin.on("data", this._ondata), this._stdin.on("error", this._onerror)
  }
  processReadBuffer() {
    var A, Q;
    while (!0) try {
      let B = this._readBuffer.readMessage();
      if (B === null) break;
      (A = this.onmessage) === null || A === void 0 || A.call(this, B)
    } catch (B) {
      (Q = this.onerror) === null || Q === void 0 || Q.call(this, B)
    }
  }
  async close() {
    var A;
    if (this._stdin.off("data", this._ondata), this._stdin.off("error", this._onerror), this._stdin.listenerCount("data") === 0) this._stdin.pause();
    this._readBuffer.clear(), (A = this.onclose) === null || A === void 0 || A.call(this)
  }
  send(A) {
    return new Promise((Q) => {
      let B = SG1(A);
      if (this._stdout.write(B)) Q();
      else this._stdout.once("drain", Q)
    })
  }
}
// @from(Ln 444401, Col 4)
sP0 = w(() => {
  WX0()
})
// @from(Ln 444411, Col 0)
class buA {
  server = null;
  secret;
  port = null;
  mcpClients;
  availableTools;
  resources;
  constructor(A, Q) {
    this.mcpClients = A, this.availableTools = Q || [], this.resources = {}, this.secret = PU7(32).toString("hex")
  }
  async start() {
    if (this.server) throw Error("MCP CLI endpoint already started");
    return new Promise((A, Q) => {
      this.server = TU7((B, G) => {
        this.handleRequest(B, G)
      }), this.server.on("error", (B) => {
        e(B), Q(B)
      }), this.server.listen(0, "127.0.0.1", () => {
        let B = this.server.address();
        if (!B || typeof B === "string") {
          Q(Error("Failed to get server address"));
          return
        }
        this.port = B.port;
        let G = `http://127.0.0.1:${this.port}`;
        k(`[MCP CLI Endpoint] Started on ${G}`), A({
          port: this.port,
          url: G
        })
      })
    })
  }
  getSecret() {
    return this.secret
  }
  async handleRequest(A, Q) {
    if (A.setTimeout(30000), A.on("timeout", () => {
        k("[MCP CLI Endpoint] Request timeout"), Q.writeHead(408, {
          "Content-Type": "application/json"
        }), Q.end(eA({
          error: "Request Timeout"
        }))
      }), A.method !== "POST" || A.url !== "/mcp") {
      Q.writeHead(404, {
        "Content-Type": "application/json"
      }), Q.end(eA({
        error: "Not Found"
      }));
      return
    }
    let B = A.headers.authorization;
    if (!B?.startsWith("Bearer ")) {
      Q.writeHead(403, {
        "Content-Type": "application/json"
      }), Q.end(eA({
        error: "Forbidden"
      }));
      return
    }
    let G = B.slice(7);
    if (!this.validateSecret(G)) {
      Q.writeHead(403, {
        "Content-Type": "application/json"
      }), Q.end(eA({
        error: "Forbidden"
      }));
      return
    }
    let Z = 10485760,
      Y = 0,
      J = "";
    A.on("data", (X) => {
      if (Y += X.length, Y > Z) {
        k(`[MCP CLI Endpoint] Request too large: ${Y} bytes`), Q.writeHead(413, {
          "Content-Type": "application/json"
        }), Q.end(eA({
          error: "Payload Too Large"
        })), A.destroy();
        return
      }
      J += X.toString()
    }), A.on("end", async () => {
      try {
        let X = AQ(J),
          I = dX9.parse(X),
          D = await this.handleCommand(I);
        Q.writeHead(200, {
          "Content-Type": "application/json"
        }), Q.end(eA(D))
      } catch (X) {
        let I = 500;
        if (X instanceof SyntaxError) I = 400;
        else if (X && typeof X === "object" && "name" in X) {
          if (X.name === "ZodError") I = 400
        }
        Q.writeHead(I, {
          "Content-Type": "application/json"
        }), Q.end(eA({
          error: X instanceof Error ? X.message : "Unknown error",
          type: X instanceof Error ? X.constructor.name : "Error"
        })), e(X instanceof Error ? X : Error(String(X)))
      }
    }), A.on("error", (X) => {
      if (e(X), !Q.headersSent) Q.writeHead(500, {
        "Content-Type": "application/json"
      }), Q.end(eA({
        error: "Internal Server Error"
      }))
    })
  }
  validateSecret(A) {
    try {
      let Q = Buffer.from(A),
        B = Buffer.from(this.secret);
      if (Q.length !== B.length) return !1;
      return SU7(Q, B)
    } catch {
      return !1
    }
  }
  async handleCommand(A) {
    let Q = Date.now(),
      B = A.command === "call" ? `mcp__${A.params.server}__${A.params.tool}` : void 0;
    try {
      let {
        data: G,
        metadata: Z
      } = await this.executeCommand(A), Y = Date.now() - Q;
      if (A.command === "call") l("tengu_tool_use_success", {
        toolName: k9(B ?? ""),
        isMcp: !0,
        durationMs: Y
      });
      return l("tengu_mcp_cli_command_executed", {
        command: A.command,
        success: !0,
        duration_ms: Y,
        ...Z
      }), G
    } catch (G) {
      let Z = G instanceof Error ? G : Error(String(G)),
        Y = Date.now() - Q,
        J = String(G).slice(0, 2000);
      if (A.command === "call") l("tengu_tool_use_error", {
        toolName: k9(B ?? ""),
        isMcp: !0,
        error: J,
        durationMs: Y
      });
      throw l("tengu_mcp_cli_command_executed", {
        command: A.command,
        success: !1,
        error_type: A.command === "call" ? "tool_execution_failed" : Z.constructor,
        duration_ms: Date.now() - Q
      }), G
    }
  }
  async executeCommand(A) {
    switch (A.command) {
      case "servers": {
        let Q = M$1(this.mcpClients);
        return {
          data: Q,
          metadata: {
            server_count: Q.length
          }
        }
      }
      case "tools": {
        let Q = R$1(this.availableTools, A.params);
        return {
          data: Q,
          metadata: {
            tool_count: Q.length,
            filtered: !!A.params?.server
          }
        }
      }
      case "info": {
        let Q = await _$1(this.availableTools, A.params);
        if (!Q) {
          let B = xuA(this.mcpClients, A.params.server, this.getNormalizedNames()),
            G = N8A(A.params.server, B?.type);
          if (G) throw G;
          throw new AS0(`Tool '${A.params.toolName}' not found on server '${A.params.server}'`)
        }
        return {
          data: Q,
          metadata: {
            tool_found: !0
          }
        }
      }
      case "grep": {
        let Q = j$1(this.availableTools, A.params);
        return {
          data: Q,
          metadata: {
            match_count: Q.length
          }
        }
      }
      case "resources": {
        let Q = T$1(this.resources, A.params, this.getNormalizedNames());
        return {
          data: Q,
          metadata: {
            resource_count: Q.length,
            filtered: !!A.params?.server
          }
        }
      }
      case "call": {
        let {
          server: Q,
          tool: B
        } = A.params;
        return {
          data: await this.callTool(A.params),
          metadata: {
            tool_name: `mcp__${Q}__${B}`
          }
        }
      }
      case "read":
        return {
          data: await this.readResource(A.params), metadata: {
            server: A.params.server
          }
        };
      default: {
        let Q = A;
        throw Error("Unknown command")
      }
    }
  }
  getConnectedClient(A) {
    let Q = xuA(this.mcpClients, A, this.getNormalizedNames()),
      B = N8A(A, Q?.type);
    if (B) throw B;
    return Q
  }
  async callTool({
    server: A,
    tool: Q,
    args: B,
    timeoutMs: G
  }) {
    let Z = this.getConnectedClient(A),
      Y = `mcp__${A}__${Q}`,
      J = this.availableTools.find((D) => D.name === Y);
    if (this.availableTools.length > 0 && !J) throw new AS0(`Tool '${Q}' not found on server '${A}'`);
    let X = J?.originalMcpToolName || Q;
    return await Z.client.request({
      method: "tools/call",
      params: {
        name: X,
        arguments: B
      }
    }, iC, G ? {
      signal: AbortSignal.timeout(G)
    } : void 0)
  }
  async readResource({
    server: A,
    uri: Q,
    timeoutMs: B
  }) {
    return await this.getConnectedClient(A).client.readResource({
      uri: Q
    }, B ? {
      signal: AbortSignal.timeout(B)
    } : void 0)
  }
  async stop() {
    if (!this.server) return;
    return new Promise((A, Q) => {
      this.server.close((B) => {
        if (B) Q(B);
        else k("[MCP CLI Endpoint] Stopped"), this.server = null, this.port = null, A()
      })
    })
  }
  updateClients(A) {
    this.mcpClients = A
  }
  updateTools(A) {
    this.availableTools = A
  }
  updateResources(A) {
    this.resources = A
  }
  getNormalizedNames() {
    let A = {};
    for (let Q of this.mcpClients) A[e3(Q.name)] = Q.name;
    return A
  }
}
// @from(Ln 444709, Col 4)
AS0
// @from(Ln 444710, Col 4)
QS0 = w(() => {
  eK();
  mP0();
  dP0();
  cP0();
  pP0();
  lP0();
  T1();
  v1();
  Z0();
  hW();
  P$1();
  A0();
  AS0 = class AS0 extends Error {
    constructor(A) {
      super(A);
      this.name = "ToolNotFoundError"
    }
  }
})
// @from(Ln 444730, Col 4)
GI9 = {}
// @from(Ln 444745, Col 0)
function bU7(A) {
  let Q;
  if (process.env.RIPGREP_NODE_PATH) Q = NA(process.env.RIPGREP_NODE_PATH).ripgrepMain;
  else {
    let B = kU7(vU7(yU7(import.meta.url)), "ripgrep.node");
    Q = xU7(import.meta.url)(B).ripgrepMain
  }
  return Q(["--no-config", ...A])
}
// @from(Ln 444754, Col 4)
ZI9 = () => {}
// @from(Ln 444760, Col 0)
function fU7() {
  let A = process.argv[1] || "",
    Q = process.execPath || process.argv[0] || "";
  if ($Q() === "windows") A = A.split(JI9.sep).join(YI9.sep), Q = Q.split(JI9.sep).join(YI9.sep);
  let B = [A, Q],
    G = ["/build-ant/", "/build-external/", "/build-external-native/", "/build-ant-native/"];
  return B.some((Z) => G.some((Y) => Z.includes(Y)))
}
// @from(Ln 444769, Col 0)
function gU7(A) {
  let Q = `${A.name}: ${A.message}`;
  return hU7.some((B) => B.test(Q))
}
// @from(Ln 444774, Col 0)
function II9() {
  let A = process.listeners("warning");
  if (y$1 && A.includes(y$1)) return;
  if (!fU7()) process.removeAllListeners("warning");
  y$1 = (B) => {
    try {
      let G = `${B.name}: ${B.message.slice(0,50)}`,
        Z = XI9.get(G) || 0;
      XI9.set(G, Z + 1);
      let Y = gU7(B);
      if (l("tengu_node_warning", {
          is_internal: Y ? 1 : 0,
          occurrence_count: Z + 1,
          classname: B.name,
          ...!1
        }), process.env.CLAUDE_DEBUG === "true") k(`${Y?"[Internal Warning]":"[Warning]"} ${B.toString()}`, {
        level: "warn"
      })
    } catch {}
  }, process.on("warning", y$1)
}
// @from(Ln 444795, Col 4)
XI9
// @from(Ln 444795, Col 9)
hU7
// @from(Ln 444795, Col 14)
y$1 = null
// @from(Ln 444796, Col 4)
DI9 = w(() => {
  Z0();
  T1();
  c3();
  XI9 = new Map;
  hU7 = [/MaxListenersExceededWarning.*AbortSignal/, /MaxListenersExceededWarning.*EventTarget/]
})
// @from(Ln 444804, Col 0)
function WI9() {}
// @from(Ln 444806, Col 0)
function KI9() {
  let A = jQ() || {},
    Q = L1().env || {},
    B = A.env || {};
  for (let [G, Z] of Object.entries(Q))
    if (H6A.has(G.toUpperCase())) process.env[G] = Z;
  for (let [G, Z] of Object.entries(B))
    if (H6A.has(G.toUpperCase())) process.env[G] = Z;
  WI9()
}
// @from(Ln 444817, Col 0)
function L8A() {
  let A = jQ() || {};
  Object.assign(process.env, L1().env), Object.assign(process.env, A.env), WI9()
}
// @from(Ln 444821, Col 4)
fuA = w(() => {
  GQ();
  GB();
  wI1()
})
// @from(Ln 444827, Col 0)
function uU7({
  filePath: A,
  errorDescription: Q,
  onExit: B,
  onReset: G
}) {
  H2("confirm:no", B, {
    context: "Confirmation"
  });
  let Z = MQ();
  return kE.default.createElement(kE.default.Fragment, null, kE.default.createElement(T, {
    flexDirection: "column",
    borderColor: "error",
    borderStyle: "round",
    padding: 1,
    width: 70,
    gap: 1
  }, kE.default.createElement(C, {
    bold: !0
  }, "Configuration Error"), kE.default.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, kE.default.createElement(C, null, "The configuration file at ", kE.default.createElement(C, {
    bold: !0
  }, A), " contains invalid JSON."), kE.default.createElement(C, null, Q)), kE.default.createElement(T, {
    flexDirection: "column"
  }, kE.default.createElement(C, {
    bold: !0
  }, "Choose an option:"), kE.default.createElement(k0, {
    options: [{
      label: "Exit and fix manually",
      value: "exit"
    }, {
      label: "Reset with default configuration",
      value: "reset"
    }],
    onChange: (J) => {
      if (J === "exit") B();
      else G()
    },
    onCancel: B
  }))), Z.pending ? kE.default.createElement(C, {
    dimColor: !0
  }, "Press ", Z.keyName, " again to exit") : kE.default.createElement(fD, null))
}
// @from(Ln 444872, Col 0)
async function VI9({
  error: A
}) {
  let Q = {
    ...FY(!1),
    theme: mU7
  };
  await new Promise(async (B) => {
    let {
      unmount: G
    } = await Y5(kE.default.createElement(b5, null, kE.default.createElement(vJ, null, kE.default.createElement(uU7, {
      filePath: A.filePath,
      errorDescription: A.message,
      onExit: () => {
        G(), B(), process.exit(1)
      },
      onReset: () => {
        bB(A.filePath, eA(A.defaultConfig, null, 2), {
          flush: !1,
          encoding: "utf8"
        }), G(), B(), process.exit(0)
      }
    }))), Q)
  })
}
// @from(Ln 444897, Col 4)
kE
// @from(Ln 444897, Col 8)
mU7 = "dark"
// @from(Ln 444898, Col 4)
FI9 = w(() => {
  fA();
  u8();
  fA();
  c6();
  A0();
  E9();
  hB();
  Bc();
  A0();
  Kf();
  kE = c(QA(), 1)
})
// @from(Ln 444912, Col 0)
async function pU7() {
  if (GS0 || YS0) return;
  GS0 = !0;
  let A = await iU7();
  if (A.length === 0) return;
  k(`Watching for changes in skill directories: ${A.join(", ")}...`), Jh = BIA.watch(A, {
    persistent: !0,
    ignoreInitial: !0,
    depth: 2,
    awaitWriteFinish: {
      stabilityThreshold: ZS0?.stabilityThreshold ?? dU7,
      pollInterval: ZS0?.pollInterval ?? cU7
    },
    ignored: (Q, B) => {
      if (B && !B.isFile() && !B.isDirectory()) return !0;
      return Q.split(v$1.sep).some((G) => G === ".git")
    },
    ignorePermissionErrors: !0,
    usePolling: !1,
    atomic: !0
  }), Jh.on("add", BS0), Jh.on("change", BS0), Jh.on("unlink", BS0), C6(async () => HI9())
}
// @from(Ln 444935, Col 0)
function HI9() {
  if (YS0 = !0, Jh) Jh.close(), Jh = null;
  huA.clear()
}
// @from(Ln 444940, Col 0)
function lU7(A) {
  return huA.add(A), () => {
    huA.delete(A)
  }
}
// @from(Ln 444945, Col 0)
async function iU7() {
  let A = vA(),
    Q = [],
    B = IzA("userSettings", "skills");
  if (B) try {
    await A.stat(B), Q.push(B)
  } catch {}
  let G = IzA("projectSettings", "skills");
  if (G) try {
    let Z = v$1.resolve(G);
    await A.stat(Z), Q.push(Z)
  } catch {}
  return Q
}
// @from(Ln 444960, Col 0)
function BS0(A) {
  k(`Detected skill change: ${A}`), NH1(), lt(), fD1(), huA.forEach((Q) => Q())
}
// @from(Ln 444964, Col 0)
function nU7(A) {
  if (Jh) Jh.close(), Jh = null;
  huA.clear(), GS0 = !1, YS0 = !1, ZS0 = A ?? null
}
// @from(Ln 444968, Col 4)
dU7 = 1000
// @from(Ln 444969, Col 2)
cU7 = 500
// @from(Ln 444970, Col 2)
Jh = null
// @from(Ln 444971, Col 2)
GS0 = !1
// @from(Ln 444972, Col 2)
YS0 = !1
// @from(Ln 444973, Col 2)
huA
// @from(Ln 444973, Col 7)
ZS0 = null
// @from(Ln 444974, Col 2)
k$1
// @from(Ln 444975, Col 4)
JS0 = w(() => {
  p01();
  T1();
  nX();
  RhA();
  WV();
  akA();
  DQ();
  huA = new Set;
  k$1 = {
    initialize: pU7,
    dispose: HI9,
    subscribe: lU7,
    resetForTesting: nU7
  }
})
// @from(Ln 444992, Col 0)
function IS0() {
  if (iH0()) {
    if (p2() && JK()) XS0();
    HL2().then(() => {
      L8A(), XS0()
    })
  } else XS0()
}
// @from(Ln 445001, Col 0)
function XS0() {
  if (EI9) return;
  aU7(), EI9 = !0
}
// @from(Ln 445006, Col 0)
function aU7() {
  let A = ow2();
  if (A) bb0(A, (B, G) => {
    let Z = A?.createCounter(B, G);
    return {
      add(Y, J = {}) {
        let I = {
          ...MVA(),
          ...J
        };
        Z?.add(Y, I)
      }
    }
  })
}
// @from(Ln 445021, Col 4)
EI9 = !1
// @from(Ln 445022, Col 2)
zI9
// @from(Ln 445023, Col 4)
$I9 = w(() => {
  aAA();
  C0();
  GQ();
  GQ();
  fuA();
  XX();
  FI9();
  yJ();
  nX();
  Y9();
  C0();
  gH0();
  FMA();
  iZ1();
  fn();
  cJA();
  fGA();
  WBA();
  JS0();
  iFA();
  fuA();
  C0();
  rZ1();
  JL();
  E$A();
  $F();
  ms();
  AY();
  T1();
  PL();
  zI9 = W0(() => {
    let A = Date.now();
    OB("info", "init_started"), x9("init_function_start");
    try {
      let Q = Date.now();
      nOA(), OB("info", "init_configs_enabled", {
        duration_ms: Date.now() - Q
      }), x9("init_configs_enabled");
      let B = Date.now();
      KI9(), OB("info", "init_safe_env_vars_applied", {
        duration_ms: Date.now() - B
      }), x9("init_safe_env_vars_applied");
      let G = Date.now();
      if (HC.initialize(), OB("info", "init_settings_detector_initialized", {
          duration_ms: Date.now() - G
        }), x9("init_settings_detector_initialized"), k$1.initialize(), x9("init_skill_detector_initialized"), LZ2(), x9("init_after_graceful_shutdown"), IKB(), x9("init_after_1p_event_logging"), jEQ(), x9("init_after_oauth_populate"), iH0()) FL2();
      x9("init_after_remote_settings_check"), B2B();
      let Z = Date.now();
      k("[init] configureGlobalMTLS starting"), btQ(), OB("info", "init_mtls_configured", {
        duration_ms: Date.now() - Z
      }), k("[init] configureGlobalMTLS complete");
      let Y = Date.now();
      if (k("[init] configureGlobalAgents starting"), mtQ(), OB("info", "init_proxy_configured", {
          duration_ms: Date.now() - Y
        }), k("[init] configureGlobalAgents complete"), x9("init_network_configured"), F7Q(), C6(Sy2), jJ()) process.env.CLAUDE_CODE_SESSION_ID = q0(), AX9();
      if (K$A()) {
        let J = Date.now();
        YX9(), OB("info", "init_scratchpad_created", {
          duration_ms: Date.now() - J
        })
      }
      OB("info", "init_completed", {
        duration_ms: Date.now() - A
      }), x9("init_function_end")
    } catch (Q) {
      if (Q instanceof Hq) return VI9({
        error: Q
      });
      else throw Q
    }
  })
})
// @from(Ln 445100, Col 0)
function CI9() {
  let A = !(a1(process.env.CLAUDE_CODE_USE_BEDROCK) || a1(process.env.CLAUDE_CODE_USE_VERTEX) || a1(process.env.CLAUDE_CODE_USE_FOUNDRY) || process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC || process.env.DISABLE_ERROR_REPORTING);
  ce.init({
    dsn: p4Q,
    enabled: A,
    environment: "external",
    release: {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.1.7",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      BUILD_TIME: "2026-01-13T22:55:21Z"
    }.VERSION,
    integrations: [new ce.Integrations.OnUncaughtException({
      exitEvenIfOtherHandlersAreRegistered: !1
    }), new ce.Integrations.OnUnhandledRejection({
      mode: "warn"
    }), new ce.Integrations.Http({
      tracing: !0
    }), ce.rewriteFramesIntegration()],
    tracesSampleRate: 1,
    tracePropagationTargets: ["localhost"],
    beforeSend(Q) {
      try {
        let B = cn();
        if (B.userID) {
          let G = oU7("sha256").update(B.userID).digest("hex");
          Q.user = {
            id: G
          }
        }
      } catch {}
      try {
        Q.tags = {
          ...Q.tags,
          terminal: l0.terminal,
          userType: "external",
          ...NeQ(),
          ...VKB()
        }
      } catch {}
      try {
        Q.extra = {
          ...Q.extra,
          sessionId: q0()
        }
      } catch {}
      return Q
    }
  })
}
// @from(Ln 445152, Col 4)
ce
// @from(Ln 445153, Col 4)
UI9 = w(() => {
  Ou();
  p3();
  npA();
  BI();
  w6();
  C0();
  fQ();
  ce = c(Sg(), 1)
})
// @from(Ln 445167, Col 0)
function sU7() {
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
// @from(Ln 445219, Col 0)
async function tU7() {
  let A = vA(),
    Q = rU7(zQ(), "magic-docs", "prompt.md");
  if (A.existsSync(Q)) try {
    return A.readFileSync(Q, {
      encoding: "utf-8"
    })
  } catch {}
  return sU7()
}
// @from(Ln 445230, Col 0)
function eU7(A, Q) {
  let B = A;
  for (let [G, Z] of Object.entries(Q)) B = B.replace(new RegExp(`\\{\\{${G}\\}\\}`, "g"), Z);
  return B
}
// @from(Ln 445235, Col 0)
async function qI9(A, Q, B, G) {
  let Z = await tU7(),
    Y = G ? `

DOCUMENT-SPECIFIC UPDATE INSTRUCTIONS:
The document author has provided specific instructions for how this file should be updated. Pay extra attention to these instructions and follow them carefully:

"${G}"

These instructions take priority over the general rules below. Make sure your updates align with these specific guidelines.` : "";
  return eU7(Z, {
    docContents: A,
    docPath: Q,
    docTitle: B,
    customInstructions: Y
  })
}
// @from(Ln 445252, Col 4)
NI9 = w(() => {
  DQ();
  fQ()
})
// @from(Ln 445257, Col 0)
function Bq7(A) {
  let Q = A.match(Aq7);
  if (!Q || !Q[1]) return null;
  let B = Q[1].trim(),
    G = Q.index + Q[0].length,
    Y = A.slice(G).match(/^\s*\n(?:\s*\n)?(.+?)(?:\n|$)/);
  if (Y && Y[1]) {
    let X = Y[1].match(Qq7);
    if (X && X[1]) {
      let I = X[1].trim();
      return {
        title: B,
        instructions: I
      }
    }
  }
  return {
    title: B
  }
}
// @from(Ln 445278, Col 0)
function Gq7() {
  return {
    agentType: "magic-docs",
    whenToUse: "Update Magic Docs",
    tools: [I8],
    model: "sonnet",
    source: "built-in",
    baseDir: "built-in",
    getSystemPrompt: () => ""
  }
}
// @from(Ln 445289, Col 0)
async function Zq7(A, Q) {
  let {
    messages: B,
    systemPrompt: G,
    userContext: Z,
    systemContext: Y,
    toolUseContext: J
  } = Q, X = m9A(J.readFileState), I = {
    ...J,
    readFileState: X
  };
  if (!vA().existsSync(A.path)) {
    b$1.delete(A.path);
    return
  }
  let W = await v5.call({
      file_path: A.path
    }, I),
    K = "",
    V = W.data;
  if (V.type === "text") K = V.file.content;
  let F = Bq7(K);
  if (!F) {
    b$1.delete(A.path);
    return
  }
  let H = await qI9(K, A.path, F.title, F.instructions),
    E = async (z, $) => {
      if (z.name === I8 && typeof $ === "object" && $ !== null && "file_path" in $) {
        let O = $.file_path;
        if (typeof O === "string" && O === A.path) return {
          behavior: "allow",
          updatedInput: $
        }
      }
      return {
        behavior: "deny",
        message: `only ${I8} is allowed for ${A.path}`,
        decisionReason: {
          type: "other",
          reason: `only ${I8} is allowed`
        }
      }
    };
  for await (let z of $f({
    agentDefinition: Gq7(),
    promptMessages: [H0({
      content: H
    })],
    toolUseContext: I,
    canUseTool: E,
    isAsync: !0,
    forkContextMessages: B,
    querySource: "magic_docs",
    override: {
      systemPrompt: G,
      userContext: Z,
      systemContext: Y
    }
  }));
}
// @from(Ln 445350, Col 0)
async function wI9() {}
// @from(Ln 445351, Col 4)
Aq7
// @from(Ln 445351, Col 9)
Qq7
// @from(Ln 445351, Col 14)
b$1
// @from(Ln 445351, Col 19)
zEJ
// @from(Ln 445352, Col 4)
LI9 = w(() => {
  DQ();
  T_();
  NI9();
  KHA();
  yhA();
  pC();
  tQ();
  T_();
  Aq7 = /^#\s*MAGIC\s+DOC:\s*(.+)$/im, Qq7 = /^[_*](.+?)[_*]\s*$/m, b$1 = new Map;
  zEJ = ev(async function (A) {
    let {
      messages: Q,
      querySource: B
    } = A;
    if (B !== "repl_main_thread") return;
    if (DuA(Q)) return;
    if (b$1.size === 0) return;
    for (let Y of Array.from(b$1.values())) await Zq7(Y, A)
  })
})
// @from(Ln 445374, Col 0)
function OI9(A) {
  let Q = [];
  for (let B of A)
    if (B.type === "user" && B.message?.content) {
      let G = "";
      if (typeof B.message.content === "string") G = B.message.content;
      else if (Array.isArray(B.message.content)) {
        for (let Z of B.message.content)
          if (Z.type === "text") G += Z.text + " "
      }
      if (G.trim()) Q.push(G.trim().slice(0, Yq7))
    } return Q
}
// @from(Ln 445388, Col 0)
function Jq7(A) {
  return A.map((B) => `User: ${B}
Asst: [response hidden]`).join(`
`)
}
// @from(Ln 445394, Col 0)
function Xq7(A) {
  let Q = Q9(A, "frustrated"),
    B = Q9(A, "pr_request");
  return {
    isFrustrated: Q === "true",
    hasPRRequest: B === "true"
  }
}
// @from(Ln 445402, Col 0)
async function MI9() {
  return
}
// @from(Ln 445405, Col 4)
Yq7 = 300
// @from(Ln 445406, Col 2)
Iq7
// @from(Ln 445407, Col 4)
RI9 = w(() => {
  QM0();
  yhA();
  tQ();
  l2();
  Z0();
  tQ();
  Iq7 = {
    name: "session_quality_classifier",
    async shouldRun(A) {
      if (A.querySource !== "repl_main_thread") return !1;
      return OI9(A.messages).length > 0
    },
    buildMessages(A) {
      let Q = OI9(A.messages),
        B = Jq7(Q);
      return [H0({
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
      return Xq7(A)
    },
    logResult(A, Q) {
      if (A.type === "success") {
        let B = A.result;
        if (B.isFrustrated || B.hasPRRequest) l("tengu_session_quality_classification", {
          uuid: A.uuid,
          isFrustrated: B.isFrustrated ? 1 : 0,
          hasPRRequest: B.hasPRRequest ? 1 : 0,
          messageCount: Q.queryMessageCount
        })
      }
    },
    getModel: SD
  }
})
// @from(Ln 445460, Col 0)
function Wq7(A) {
  let Q = QV(o1()),
    B = vA(),
    G = A ? new Date(A).getTime() : 0;
  try {
    let Z = B.readdirSync(Q),
      Y = [];
    for (let J of Z) {
      if (!J.isDirectory()) continue;
      let X = Dq7(Q, J.name, "session-memory", "summary.md");
      try {
        let I = B.statSync(X);
        if (I.mtimeMs > G) Y.push({
          id: J.name,
          mtime: I.mtimeMs,
          path: X
        })
      } catch {}
    }
    return Y.sort((J, X) => X.mtime - J.mtime), Y.map((J) => J.path)
  } catch {
    return []
  }
}
// @from(Ln 445485, Col 0)
function _I9() {
  return
}
// @from(Ln 445488, Col 4)
Kq7 = `# Remember Skill

Review session memories and update the local project memory file (CLAUDE.local.md) with learnings.

## CRITICAL: Use the AskUserQuestion Tool

**Never ask questions via plain text output.** Use the AskUserQuestion tool for ALL confirmations.

WRONG:
\`\`\`
Should I create CLAUDE.local.md with this entry?
- Yes, create it
- No, skip
\`\`\`

CORRECT:
\`\`\`
<use AskUserQuestion tool with questions array>
\`\`\`

Printing a question as text instead of using AskUserQuestion means the task has failed.

## CRITICAL: Evidence Threshold (2+ Sessions Required)

**Only extract themes and patterns that appear in 2 or more sessions.** Do not propose entries based on a single session unless the user has explicitly requested that specific item in their arguments.

- A pattern seen once is not yet a pattern - it could be a one-off
- Wait until consistent behavior appears across multiple sessions
- The only exception: explicit user request to remember something specific

## Task Steps

1. **Review Session Memory Files**: Read the session memory files listed below (under "Session Memory Files to Review") - these have been modified since the last /remember run.

2. **Analyze for Patterns**: Identify recurring elements (must appear in 2+ sessions):
   - Patterns and preferences
   - Project-specific conventions
   - Important decisions
   - User preferences
   - Common mistakes to avoid
   - Workflow patterns

3. **Review Existing Memory Files**: Read CLAUDE.local.md and CLAUDE.md to identify:
   - Outdated information
   - Misleading or incorrect instructions
   - Information contradicted by recent sessions
   - Redundant or duplicate entries

4. **Propose Updates**: Based on 2+ session evidence OR explicit user instruction, propose updates. Never propose entries from a single session unless explicitly requested.

5. **Propose Removals**: For outdated or misleading information in CLAUDE.local.md or CLAUDE.md, propose removal with explanation based on session evidence.

6. **Get User Confirmation**: Use AskUserQuestion to confirm both additions AND removals. Only make user-approved changes.

## File Locations

- **Session memories**: \`~/.claude/projects/{sanitized-project-path}/{session-id}/session-memory/summary.md\`
- **Local memory file**: \`CLAUDE.local.md\` in project root
- **Project config**: \`lastProjectMemoryUpdate\` field stores last run timestamp

## Guidelines

**Evidence Threshold (CRITICAL)**:
- Patterns must appear in 2+ sessions before proposing
- Only exception: explicit user instruction in arguments
- Note how many sessions contained each pattern when proposing

**User Confirmation**:
- Always use AskUserQuestion before ANY changes
- Ask about each proposed addition separately (one entry per question, not batched)
- Show exactly what will be added or removed
- Never make silent changes

**Be Conservative**:
- Prefer fewer, high-quality additions
- Avoid temporary or changeable details
- Focus on stable patterns and preferences

**Format**:
- Keep entries concise and actionable
- Group related entries under clear headings
- Use bullet points for easy scanning

## AskUserQuestion Format

Ask about each proposed entry separately (one entry per question). Do not batch multiple entries into a single question.

\`\`\`
AskUserQuestion({
  questions: [{
    question: "Add to CLAUDE.local.md: 'Prefer bun over npm for all commands'?",
    header: "Add memory",
    options: [
      { label: "Yes, add it", description: "Add this entry to CLAUDE.local.md" },
      { label: "No, skip", description: "Don't add this entry" },
      { label: "Edit first", description: "Let me modify the entry before adding" }
    ],
    multiSelect: false
  }],
  metadata: { source: "remember" }
})
\`\`\`

## Workflow

1. Read session memory files listed below
2. Analyze for recurring patterns (2+ sessions)
3. Read existing CLAUDE.local.md and CLAUDE.md
4. Identify patterns worth remembering
5. Identify outdated information to remove
6. Use AskUserQuestion to confirm each proposed change
7. Make approved changes
8. Report summary of changes made (or that none were needed)
`
// @from(Ln 445602, Col 4)
jI9 = w(() => {
  tz1();
  GQ();
  d4();
  V2();
  DQ()
})
// @from(Ln 445610, Col 0)
function TI9() {
  sz1({
    name: "claude-in-chrome",
    description: "Automates your Chrome browser to interact with web pages - clicking elements, filling forms, capturing screenshots, reading console logs, and navigating sites. Opens pages in new tabs within your existing Chrome session. Requires site-level permissions before executing (configured in the extension).",
    whenToUse: "When the user wants to interact with web pages, automate browser tasks, capture screenshots, read console logs, or perform any browser-based actions. Always invoke BEFORE attempting to use any mcp__claude-in-chrome__* tools.",
    allowedTools: Vq7,
    userInvocable: !0,
    isEnabled: () => I$A(),
    async getPromptForCommand(A) {
      let Q = `${JZ9}
${Fq7}`;
      if (A) Q += `
## Task

${A}`;
      return [{
        type: "text",
        text: Q
      }]
    }
  })
}
// @from(Ln 445632, Col 4)
Vq7
// @from(Ln 445632, Col 9)
Fq7 = `
Now that this skill is invoked, you have access to Chrome browser automation tools. You can now use the mcp__claude-in-chrome__* tools to interact with web pages.

IMPORTANT: Start by calling mcp__claude-in-chrome__tabs_context_mcp to get information about the user's current browser tabs.
`
// @from(Ln 445637, Col 4)
PI9 = w(() => {
  tz1();
  KuA();
  Se();
  Vq7 = Pe.map((A) => `mcp__claude-in-chrome__${A.name}`)
})
// @from(Ln 445644, Col 0)
function SI9() {
  if (_I9(), I$A()) TI9()
}
// @from(Ln 445647, Col 4)
xI9 = w(() => {
  jI9();
  PI9();
  Se()
})
// @from(Ln 445652, Col 0)
async function DS0(A, Q, {
  concurrency: B = Number.POSITIVE_INFINITY,
  stopOnError: G = !0,
  signal: Z
} = {}) {
  return new Promise((Y, J) => {
    if (A[Symbol.iterator] === void 0 && A[Symbol.asyncIterator] === void 0) throw TypeError(`Expected \`input\` to be either an \`Iterable\` or \`AsyncIterable\`, got (${typeof A})`);
    if (typeof Q !== "function") throw TypeError("Mapper function is required");
    if (!(Number.isSafeInteger(B) && B >= 1 || B === Number.POSITIVE_INFINITY)) throw TypeError(`Expected \`concurrency\` to be an integer from 1 and up or \`Infinity\`, got \`${B}\` (${typeof B})`);
    let X = [],
      I = [],
      D = new Map,
      W = !1,
      K = !1,
      V = !1,
      F = 0,
      H = 0,
      E = A[Symbol.iterator] === void 0 ? A[Symbol.asyncIterator]() : A[Symbol.iterator](),
      z = () => {
        L(Z.reason)
      },
      $ = () => {
        Z?.removeEventListener("abort", z)
      },
      O = (_) => {
        Y(_), $()
      },
      L = (_) => {
        W = !0, K = !0, J(_), $()
      };
    if (Z) {
      if (Z.aborted) L(Z.reason);
      Z.addEventListener("abort", z, {
        once: !0
      })
    }
    let M = async () => {
      if (K) return;
      let _ = await E.next(),
        j = H;
      if (H++, _.done) {
        if (V = !0, F === 0 && !K) {
          if (!G && I.length > 0) {
            L(AggregateError(I));
            return
          }
          if (K = !0, D.size === 0) {
            O(X);
            return
          }
          let x = [];
          for (let [b, S] of X.entries()) {
            if (D.get(b) === yI9) continue;
            x.push(S)
          }
          O(x)
        }
        return
      }
      F++, (async () => {
        try {
          let x = await _.value;
          if (K) return;
          let b = await Q(x, j);
          if (b === yI9) D.set(j, b);
          X[j] = b, F--, await M()
        } catch (x) {
          if (G) L(x);
          else {
            I.push(x), F--;
            try {
              await M()
            } catch (b) {
              L(b)
            }
          }
        }
      })()
    };
    (async () => {
      for (let _ = 0; _ < B; _++) {
        try {
          await M()
        } catch (j) {
          L(j);
          break
        }
        if (V || W) break
      }
    })()
  })
}
// @from(Ln 445744, Col 4)
yI9
// @from(Ln 445745, Col 4)
vI9 = w(() => {
  yI9 = Symbol("skip")
})
// @from(Ln 445749, Col 0)
function kI9({
  onDone: A
}) {
  return J0((Q, B) => {
    if (B.ctrl && (Q === "c" || Q === "d") || B.escape) A()
  }), pe.default.createElement(T, {
    flexDirection: "column",
    borderStyle: "round",
    padding: 1,
    borderDimColor: !0
  }, pe.default.createElement(T, {
    marginBottom: 1,
    flexDirection: "column"
  }, pe.default.createElement(C, {
    bold: !0
  }, "You've spent $5 on the Anthropic API this session."), pe.default.createElement(C, null, "Learn more about how to monitor your spending:"), pe.default.createElement(i2, {
    url: "https://code.claude.com/docs/en/costs"
  })), pe.default.createElement(T, null, pe.default.createElement(k0, {
    options: [{
      value: "ok",
      label: "Got it, thanks!"
    }],
    onChange: A,
    onCancel: A
  })))
}
// @from(Ln 445775, Col 4)
pe
// @from(Ln 445776, Col 4)
bI9 = w(() => {
  fA();
  u8();
  fA();
  pe = c(QA(), 1)
})
// @from(Ln 445783, Col 0)
function hI9(A, Q = !1) {
  let [B] = a0(), {
    teamContext: G
  } = B;
  fI9.useEffect(() => {
    if (!Q) tc(A, {
      ...{}
    })
  }, [A, Q, G?.teamName, G?.selfAgentName])
}
// @from(Ln 445793, Col 4)
fI9
// @from(Ln 445794, Col 4)
gI9 = w(() => {
  d4();
  hB();
  fI9 = c(QA(), 1)
})
// @from(Ln 445800, Col 0)
function f$1() {
  return !1
}
// @from(Ln 445804, Col 0)
function uI9() {
  return null
}
// @from(Ln 445808, Col 0)
function mI9() {
  return ""
}
// @from(Ln 445812, Col 0)
function cI9(A) {
  dI9.useEffect(() => {
    if (!A.length) return;
    let Q = nN(A);
    if (Q) Q.client.setNotificationHandler(Hq7, async (B) => {
      let {
        eventName: G,
        eventData: Z
      } = B.params;
      l(`tengu_ide_${G}`, Z)
    })
  }, [A])
}
// @from(Ln 445825, Col 4)
dI9
// @from(Ln 445825, Col 9)
Hq7
// @from(Ln 445826, Col 4)
pI9 = w(() => {
  j9();
  Z0();
  TX();
  dI9 = c(QA(), 1), Hq7 = m.object({
    method: m.literal("log_event"),
    params: m.object({
      eventName: m.string(),
      eventData: m.object({}).passthrough()
    })
  })
})
// @from(Ln 445839, Col 0)
function g$1({
  file_path: A,
  edits: Q
}) {
  let {
    columns: B
  } = ZB(), G = h$1.useMemo(() => vA().existsSync(A) ? nK(A) : "", [A]), Z = h$1.useMemo(() => Q.map((X) => {
    let I = k6A(G, X.old_string) || X.old_string;
    return {
      ...X,
      old_string: I
    }
  }), [G, Q]), Y = h$1.useMemo(() => xO({
    filePath: A,
    fileContents: G,
    edits: Z
  }), [A, G, Z]), J = G.split(`
`)[0] ?? null;
  return Tp.createElement(T, {
    flexDirection: "column"
  }, Tp.createElement(T, {
    borderDimColor: !0,
    borderColor: "subtle",
    borderStyle: "dashed",
    flexDirection: "column",
    borderLeft: !1,
    borderRight: !1
  }, rN(Y.map((X) => Tp.createElement(sN, {
    key: X.newStart,
    patch: X,
    dim: !1,
    filePath: A,
    firstLine: J,
    width: B
  })), (X) => Tp.createElement(C, {
    dimColor: !0,
    key: `ellipsis-${X}`
  }, "..."))))
}
// @from(Ln 445878, Col 4)
Tp
// @from(Ln 445878, Col 8)
h$1
// @from(Ln 445879, Col 4)
WS0 = w(() => {
  ls();
  fA();
  Lc();
  y9();
  DQ();
  hs();
  P4();
  Tp = c(QA(), 1), h$1 = c(QA(), 1)
})
// @from(Ln 445890, Col 0)
function iJ(A) {
  l("tengu_unary_event", {
    event: A.event,
    completion_type: A.completion_type,
    language_name: A.metadata.language_name,
    message_id: A.metadata.message_id,
    platform: A.metadata.platform,
    ...A.metadata.hasFeedback !== void 0 && {
      hasFeedback: A.metadata.hasFeedback
    }
  })
}
// @from(Ln 445902, Col 4)
le = w(() => {
  Z0()
})
// @from(Ln 445906, Col 0)
function yj(A, Q) {
  let [, B] = a0();
  lI9.useEffect(() => {
    B((Z) => ({
      ...Z,
      attribution: {
        ...Z.attribution,
        permissionPromptCount: Z.attribution.permissionPromptCount + 1
      }
    })), l("tengu_tool_use_show_permission_request", {
      messageID: A.assistantMessage.message.id,
      toolName: k9(A.tool.name),
      isMcp: A.tool.isMcp ?? !1,
      decisionReasonType: A.permissionResult.decisionReason?.type,
      sandboxEnabled: XB.isSandboxingEnabled()
    }), Promise.resolve(Q.language_name).then((Z) => {
      iJ({
        completion_type: Q.completion_type,
        event: "response",
        metadata: {
          language_name: Z,
          message_id: A.assistantMessage.message.id,
          platform: l0.platform
        }
      })
    })
  }, [A, Q, B])
}
// @from(Ln 445934, Col 4)
lI9
// @from(Ln 445935, Col 4)
O8A = w(() => {
  Z0();
  hW();
  KU();
  YK();
  YZ();
  dW();
  p3();
  le();
  NJ();
  A0();
  hB();
  lI9 = c(QA(), 1)
})
// @from(Ln 445953, Col 0)
function iI9({
  filePath: A,
  toolPermissionContext: Q,
  operationType: B = "write",
  onRejectFeedbackChange: G,
  onAcceptFeedbackChange: Z,
  yesInputMode: Y = !1,
  noInputMode: J = !1
}) {
  let X = [];
  if (Y && Z) X.push({
    type: "input",
    label: "Yes",
    value: "yes",
    placeholder: "and tell Claude what to do next",
    onChange: Z,
    allowEmptySubmit: !0,
    option: {
      type: "accept-once"
    }
  });
  else X.push({
    label: "Yes",
    value: "yes",
    option: {
      type: "accept-once"
    }
  });
  let I = WS(A, Q),
    D;
  if (I)
    if (B === "read") D = "Yes, during this session";
    else D = ie.default.createElement(C, null, "Yes, allow all edits during this session", " ", ie.default.createElement(C, {
      bold: !0
    }, "(", ec.displayText, ")"));
  else {
    let W = Hg(A),
      K = Eq7(W) || "this directory";
    if (B === "read") D = ie.default.createElement(C, null, "Yes, allow reading from ", ie.default.createElement(C, {
      bold: !0
    }, K, "/"), " during this session");
    else D = ie.default.createElement(C, null, "Yes, allow all edits in ", ie.default.createElement(C, {
      bold: !0
    }, K, "/"), " during this session ", ie.default.createElement(C, {
      bold: !0
    }, "(", ec.displayText, ")"))
  }
  if (X.push({
      label: D,
      value: "yes-session",
      option: {
        type: "accept-session"
      }
    }), J && G) X.push({
    type: "input",
    label: "No",
    value: "no",
    placeholder: "and tell Claude what to do differently",
    onChange: G,
    allowEmptySubmit: !0,
    option: {
      type: "reject"
    }
  });
  else X.push({
    label: "No",
    value: "no",
    option: {
      type: "reject"
    }
  });
  return X
}
// @from(Ln 446026, Col 4)
ie
// @from(Ln 446027, Col 4)
nI9 = w(() => {
  fA();
  AY();
  x3A();
  oZ();
  ie = c(QA(), 1)
})
// @from(Ln 446035, Col 0)
function KS0(A, Q, B, G, Z) {
  iJ({
    completion_type: Q,
    event: A,
    metadata: {
      language_name: B,
      message_id: G,
      platform: l0.platform,
      hasFeedback: Z ?? !1
    }
  })
}
// @from(Ln 446048, Col 0)
function zq7(A, Q) {
  let {
    messageId: B,
    toolUseConfirm: G,
    onDone: Z,
    completionType: Y,
    languageName: J
  } = A;
  KS0("accept", Y, J, B), l("tengu_accept_submitted", {
    toolName: k9(G.tool.name),
    isMcp: G.tool.isMcp ?? !1,
    has_instructions: !!Q?.feedback,
    instructions_length: Q?.feedback?.length ?? 0,
    entered_feedback_mode: Q?.enteredFeedbackMode ?? !1
  }), Z(), G.onAllow(G.input, [], Q?.feedback)
}
// @from(Ln 446065, Col 0)
function $q7(A) {
  let {
    messageId: Q,
    path: B,
    toolUseConfirm: G,
    toolPermissionContext: Z,
    onDone: Y,
    completionType: J,
    languageName: X,
    operationType: I
  } = A;
  KS0("accept", J, X, Q);
  let D = B ? q$1(B, I, Z) : [];
  Y(), G.onAllow(G.input, D)
}
// @from(Ln 446081, Col 0)
function Cq7(A, Q) {
  let {
    messageId: B,
    toolUseConfirm: G,
    onDone: Z,
    onReject: Y,
    completionType: J,
    languageName: X
  } = A;
  KS0("reject", J, X, B, Q?.hasFeedback), l("tengu_reject_submitted", {
    toolName: k9(G.tool.name),
    isMcp: G.tool.isMcp ?? !1,
    has_instructions: !!Q?.feedback,
    instructions_length: Q?.feedback?.length ?? 0,
    entered_feedback_mode: Q?.enteredFeedbackMode ?? !1
  }), Z(), Y(), G.onReject(Q?.feedback)
}
// @from(Ln 446098, Col 4)
aI9
// @from(Ln 446099, Col 4)
oI9 = w(() => {
  le();
  p3();
  AY();
  Z0();
  hW();
  aI9 = {
    "accept-once": zq7,
    "accept-session": $q7,
    reject: Cq7
  }
})
// @from(Ln 446112, Col 0)
function rI9({
  filePath: A,
  completionType: Q,
  languageName: B,
  toolUseConfirm: G,
  onDone: Z,
  onReject: Y,
  parseInput: J,
  operationType: X = "write"
}) {
  let [I] = a0(), D = I.toolPermissionContext, [W, K] = bU.useState(""), [V, F] = bU.useState(""), [H, E] = bU.useState("yes"), [z, $] = bU.useState(!1), [O, L] = bU.useState(!1), [M, _] = bU.useState(!1), [j, x] = bU.useState(!1), b = bU.useMemo(() => iI9({
    filePath: A,
    toolPermissionContext: D,
    operationType: X,
    onRejectFeedbackChange: F,
    onAcceptFeedbackChange: K,
    yesInputMode: z,
    noInputMode: O
  }), [A, D, X, z, O]), S = bU.useCallback((n, y, p) => {
    let GA = {
        messageId: G.assistantMessage.message.id,
        path: A,
        toolUseConfirm: G,
        toolPermissionContext: D,
        onDone: Z,
        onReject: Y,
        completionType: Q,
        languageName: B,
        operationType: X
      },
      WA = G.onAllow;
    G.onAllow = (TA, bA, jA) => {
      WA(y, bA, jA)
    };
    let MA = aI9[n.type];
    MA(GA, {
      feedback: p,
      hasFeedback: !!p,
      enteredFeedbackMode: n.type === "accept-once" ? M : j
    })
  }, [A, Q, B, G, D, Z, Y, X, M, j]), u = bU.useCallback(() => {
    let n = b.find((y) => y.option.type === "accept-session");
    if (n) {
      let y = J(G.input);
      S(n.option, y)
    }
  }, [b, J, G.input, S]);
  iW({
    "confirm:cycleMode": u
  }, {
    context: "Confirmation"
  });
  let f = bU.useCallback((n) => {
      if (n !== "yes" && z && !W.trim()) $(!1);
      if (n !== "no" && O && !V.trim()) L(!1);
      E(n)
    }, [z, O, W, V]),
    AA = bU.useCallback((n) => {
      let y = {
        toolName: k9(G.tool.name),
        isMcp: G.tool.isMcp ?? !1
      };
      if (n === "yes")
        if (z) $(!1), l("tengu_accept_feedback_mode_collapsed", y);
        else $(!0), _(!0), l("tengu_accept_feedback_mode_entered", y);
      else if (n === "no")
        if (O) L(!1), l("tengu_reject_feedback_mode_collapsed", y);
        else L(!0), x(!0), l("tengu_reject_feedback_mode_entered", y)
    }, [z, O, G]);
  return {
    options: b,
    onChange: S,
    acceptFeedback: W,
    rejectFeedback: V,
    focusedOption: H,
    setFocusedOption: f,
    handleInputModeToggle: AA,
    yesInputMode: z,
    noInputMode: O
  }
}
// @from(Ln 446193, Col 4)
bU
// @from(Ln 446194, Col 4)
sI9 = w(() => {
  c6();
  nI9();
  oI9();
  hB();
  Z0();
  hW();
  bU = c(QA(), 1)
})
// @from(Ln 446210, Col 0)
function tI9({
  onChange: A,
  toolUseContext: Q,
  filePath: B,
  edits: G,
  editMode: Z
}) {
  let Y = Pp.useRef(!1),
    [J, X] = Pp.useState(!1),
    I = Pp.useMemo(() => Uq7().slice(0, 6), []),
    D = Pp.useMemo(() => `✻ [Claude Code] ${qq7(B)} (${I}) ⧉`, [B, I]),
    W = fF1(Q.options.mcpClients) && L1().diffTool === "auto" && !B.endsWith(".ipynb"),
    K = hF1(Q.options.mcpClients) ?? "IDE";
  async function V() {
    if (!W) return;
    try {
      l("tengu_ext_will_show_diff", {});
      let {
        oldContent: F,
        newContent: H
      } = await wq7(B, G, Q, D);
      if (Y.current) return;
      l("tengu_ext_diff_accepted", {});
      let E = Nq7(B, F, H, Z);
      if (E.length === 0) {
        l("tengu_ext_diff_rejected", {});
        let z = nN(Q.options.mcpClients);
        if (z) await VS0(D, z);
        A({
          type: "reject"
        }, {
          file_path: B,
          edits: G
        });
        return
      }
      A({
        type: "accept-once"
      }, {
        file_path: B,
        edits: E
      })
    } catch (F) {
      e(F), X(!0)
    }
  }
  return Pp.useEffect(() => {
    return V(), () => {
      Y.current = !0
    }
  }, []), {
    closeTabInIDE() {
      let F = nN(Q.options.mcpClients);
      if (!F) return Promise.resolve();
      return VS0(D, F)
    },
    showingDiffInIDE: W && !J,
    ideName: K,
    hasError: J
  }
}
// @from(Ln 446272, Col 0)
function Nq7(A, Q, B, G) {
  let Z = G === "single",
    Y = WS2({
      filePath: A,
      oldContent: Q,
      newContent: B,
      singleHunk: Z
    });
  if (Y.length === 0) return [];
  if (Z && Y.length > 1) e(Error(`Unexpected number of hunks: ${Y.length}. Expected 1 hunk.`));
  return ES2(Y)
}
// @from(Ln 446284, Col 0)
async function wq7(A, Q, B, G) {
  let Z = !1,
    Y = vA(),
    J = Y4(A),
    X = Y.existsSync(J) ? nK(J) : "";
  async function I() {
    if (Z) return;
    Z = !0;
    try {
      await VS0(G, D)
    } catch (W) {
      e(W)
    }
    process.off("beforeExit", I), B.abortController.signal.removeEventListener("abort", I)
  }
  B.abortController.signal.addEventListener("abort", I), process.on("beforeExit", I);
  let D = nN(B.options.mcpClients);
  try {
    let {
      updatedFile: W
    } = QbA({
      filePath: J,
      fileContents: X,
      edits: Q
    });
    if (!D || D.type !== "connected") throw Error("IDE client not available");
    let K = J,
      V = D.config.ideRunningInWindows === !0;
    if ($Q() === "wsl" && V && process.env.WSL_DISTRO_NAME) K = new lEA(process.env.WSL_DISTRO_NAME).toIDEPath(J);
    let F = await Hc("openDiff", {
        old_file_path: K,
        new_file_path: K,
        new_file_contents: W,
        tab_name: G
      }, D),
      H = Array.isArray(F) ? F : [F];
    if (Mq7(H)) return I(), {
      oldContent: X,
      newContent: H[1].text
    };
    else if (Lq7(H)) return I(), {
      oldContent: X,
      newContent: W
    };
    else if (Oq7(H)) return I(), {
      oldContent: X,
      newContent: X
    };
    throw Error("Not accepted")
  } catch (W) {
    throw e(W), I(), W
  }
}
// @from(Ln 446337, Col 0)
async function VS0(A, Q) {
  try {
    if (!Q || Q.type !== "connected") throw Error("IDE client not available");
    await Hc("close_tab", {
      tab_name: A
    }, Q)
  } catch (B) {
    e(B)
  }
}
// @from(Ln 446348, Col 0)
function Lq7(A) {
  return Array.isArray(A) && typeof A[0] === "object" && A[0] !== null && "type" in A[0] && A[0].type === "text" && "text" in A[0] && A[0].text === "TAB_CLOSED"
}