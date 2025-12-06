
// @from(Start 6376281, End 6384443)
m$B = L(() => {
  maA();
  ig1();
  ng1();
  laA();
  P$B();
  Bu1();
  oUA();
  eaA();
  Ju1();
  k7A();
  QsA();
  y_ = BA(VA(), 1), zF6 = process.platform !== "win32";
  BsA = class BsA extends y_.PureComponent {
    static displayName = "InternalApp";
    static getDerivedStateFromError(A) {
      return {
        error: A
      }
    }
    state = {
      isFocusEnabled: !0,
      activeFocusId: void 0,
      focusables: [],
      error: void 0
    };
    rawModeEnabledCount = 0;
    internal_eventEmitter = new Bp;
    keyParseState = S$B;
    incompleteEscapeTimer = null;
    NORMAL_TIMEOUT = 50;
    PASTE_TIMEOUT = 500;
    isRawModeSupported() {
      return this.props.stdin.isTTY
    }
    render() {
      return y_.default.createElement(Q$A.Provider, {
        value: {
          columns: this.props.terminalColumns,
          rows: this.props.terminalRows
        }
      }, y_.default.createElement(k_.Provider, {
        value: this.props.ink2
      }, y_.default.createElement(daA.Provider, {
        value: {
          exit: this.handleExit
        }
      }, y_.default.createElement(og1, {
        initialState: this.props.initialTheme
      }, y_.default.createElement(caA.Provider, {
        value: {
          stdin: this.props.stdin,
          setRawMode: this.handleSetRawMode,
          isRawModeSupported: this.isRawModeSupported(),
          internal_exitOnCtrlC: this.props.exitOnCtrlC,
          internal_eventEmitter: this.internal_eventEmitter
        }
      }, y_.default.createElement(paA.Provider, {
        value: {
          activeId: this.state.activeFocusId,
          add: this.addFocusable,
          remove: this.removeFocusable,
          activate: this.activateFocusable,
          deactivate: this.deactivateFocusable,
          enableFocus: this.enableFocus,
          disableFocus: this.disableFocus,
          focusNext: this.focusNext,
          focusPrevious: this.focusPrevious,
          focus: this.focus
        }
      }, this.state.error ? y_.default.createElement(Qu1, {
        error: this.state.error
      }) : this.props.children))))))
    }
    componentDidMount() {
      if (this.props.stdout.isTTY) this.props.stdout.write(XM.cursorHide)
    }
    componentWillUnmount() {
      if (this.props.stdout.isTTY) this.props.stdout.write(XM.cursorShow);
      if (this.incompleteEscapeTimer) clearTimeout(this.incompleteEscapeTimer), this.incompleteEscapeTimer = null;
      if (this.isRawModeSupported()) this.handleSetRawMode(!1)
    }
    componentDidCatch(A) {
      this.handleExit(A)
    }
    handleSetRawMode = (A) => {
      let {
        stdin: Q
      } = this.props;
      if (!this.isRawModeSupported())
        if (Q === process.stdin) throw Error(`Raw mode is not supported on the current process.stdin, which Ink uses as input stream by default.
Read about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported`);
        else throw Error(`Raw mode is not supported on the stdin provided to Ink.
Read about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported`);
      if (Q.setEncoding("utf8"), A) {
        if (this.rawModeEnabledCount === 0) Q.ref(), Q.setRawMode(!0), Q.addListener("readable", this.handleReadable), this.props.stdout.write("\x1B[?2004h");
        this.rawModeEnabledCount++;
        return
      }
      if (--this.rawModeEnabledCount === 0) this.props.stdout.write("\x1B[?2004l"), Q.setRawMode(!1), Q.removeListener("readable", this.handleReadable), Q.unref()
    };
    flushIncomplete = () => {
      if (this.incompleteEscapeTimer = null, !this.keyParseState.incomplete) return;
      this.processInput(null)
    };
    processInput = (A) => {
      let [Q, B] = _$B(this.keyParseState, A);
      this.keyParseState = B;
      for (let G of Q) {
        this.handleInput(G.sequence);
        let Z = new AsA(G);
        this.internal_eventEmitter.emit("input", Z)
      }
      if (this.keyParseState.incomplete) {
        if (this.incompleteEscapeTimer) clearTimeout(this.incompleteEscapeTimer);
        this.incompleteEscapeTimer = setTimeout(this.flushIncomplete, this.keyParseState.mode === "IN_PASTE" ? this.PASTE_TIMEOUT : this.NORMAL_TIMEOUT)
      }
    };
    handleReadable = () => {
      let A;
      while ((A = this.props.stdin.read()) !== null) this.processInput(A)
    };
    handleInput = (A) => {
      if (A === "\x03" && this.props.exitOnCtrlC) this.handleExit();
      if (A === "\x1A" && zF6) this.handleSuspend();
      if (A === EF6 && this.state.activeFocusId) this.setState({
        activeFocusId: void 0
      });
      if (this.state.isFocusEnabled && this.state.focusables.length > 0) {
        if (A === HF6) this.focusNext();
        if (A === CF6) this.focusPrevious()
      }
    };
    handleExit = (A) => {
      if (this.isRawModeSupported()) this.handleSetRawMode(!1);
      this.props.onExit(A)
    };
    handleSuspend = () => {
      if (!this.isRawModeSupported()) return;
      let A = this.rawModeEnabledCount;
      while (this.rawModeEnabledCount > 0) this.handleSetRawMode(!1);
      if (this.props.stdout.isTTY) this.props.stdout.write(XM.cursorShow), this.props.stdout.write("\x1B[?1004l");
      this.internal_eventEmitter.emit("suspend");
      let Q = () => {
        for (let B = 0; B < A; B++)
          if (this.isRawModeSupported()) this.handleSetRawMode(!0);
        if (this.props.stdout.isTTY) this.props.stdout.write(XM.cursorHide), this.props.stdout.write("\x1B[?1004h");
        this.internal_eventEmitter.emit("resume"), process.removeListener("SIGCONT", Q)
      };
      process.on("SIGCONT", Q), process.kill(process.pid, "SIGSTOP")
    };
    enableFocus = () => {
      this.setState({
        isFocusEnabled: !0
      })
    };
    disableFocus = () => {
      this.setState({
        isFocusEnabled: !1
      })
    };
    focus = (A) => {
      this.setState((Q) => {
        if (!Q.focusables.some((G) => G?.id === A)) return Q;
        return {
          activeFocusId: A
        }
      })
    };
    focusNext = () => {
      this.setState((A) => {
        let Q = A.focusables.find((G) => G.isActive)?.id;
        return {
          activeFocusId: this.findNextFocusable(A) ?? Q
        }
      })
    };
    focusPrevious = () => {
      this.setState((A) => {
        let Q = A.focusables.findLast((G) => G.isActive)?.id;
        return {
          activeFocusId: this.findPreviousFocusable(A) ?? Q
        }
      })
    };
    addFocusable = (A, {
      autoFocus: Q
    }) => {
      this.setState((B) => {
        let G = B.activeFocusId;
        if (!G && Q) G = A;
        return {
          activeFocusId: G,
          focusables: [...B.focusables, {
            id: A,
            isActive: !0
          }]
        }
      })
    };
    removeFocusable = (A) => {
      this.setState((Q) => ({
        activeFocusId: Q.activeFocusId === A ? void 0 : Q.activeFocusId,
        focusables: Q.focusables.filter((B) => {
          return B.id !== A
        })
      }))
    };
    activateFocusable = (A) => {
      this.setState((Q) => ({
        focusables: Q.focusables.map((B) => {
          if (B.id !== A) return B;
          return {
            id: A,
            isActive: !0
          }
        })
      }))
    };
    deactivateFocusable = (A) => {
      this.setState((Q) => ({
        activeFocusId: Q.activeFocusId === A ? void 0 : Q.activeFocusId,
        focusables: Q.focusables.map((B) => {
          if (B.id !== A) return B;
          return {
            id: A,
            isActive: !1
          }
        })
      }))
    };
    findNextFocusable = (A) => {
      let Q = A.focusables.findIndex((B) => {
        return B.id === A.activeFocusId
      });
      for (let B = Q + 1; B < A.focusables.length; B++) {
        let G = A.focusables[B];
        if (G?.isActive) return G.id
      }
      return
    };
    findPreviousFocusable = (A) => {
      let Q = A.focusables.findIndex((B) => {
        return B.id === A.activeFocusId
      });
      for (let B = Q - 1; B >= 0; B--) {
        let G = A.focusables[B];
        if (G?.isActive) return G.id
      }
      return
    }
  }
})
// @from(Start 6384449, End 6384866)
B$A = z((Pi7, d$B) => {
  var UF6 = Number.MAX_SAFE_INTEGER || 9007199254740991,
    $F6 = ["major", "premajor", "minor", "preminor", "patch", "prepatch", "prerelease"];
  d$B.exports = {
    MAX_LENGTH: 256,
    MAX_SAFE_COMPONENT_LENGTH: 16,
    MAX_SAFE_BUILD_LENGTH: 250,
    MAX_SAFE_INTEGER: UF6,
    RELEASE_TYPES: $F6,
    SEMVER_SPEC_VERSION: "2.0.0",
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  }
})
// @from(Start 6384872, End 6385099)
G$A = z((ji7, c$B) => {
  var wF6 = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...A) => console.error("SEMVER", ...A) : () => {};
  c$B.exports = wF6
})
// @from(Start 6385105, End 6389168)
y7A = z((x_, p$B) => {
  var {
    MAX_SAFE_COMPONENT_LENGTH: Wu1,
    MAX_SAFE_BUILD_LENGTH: qF6,
    MAX_LENGTH: NF6
  } = B$A(), LF6 = G$A();
  x_ = p$B.exports = {};
  var MF6 = x_.re = [],
    OF6 = x_.safeRe = [],
    nB = x_.src = [],
    RF6 = x_.safeSrc = [],
    aB = x_.t = {},
    TF6 = 0,
    Xu1 = "[a-zA-Z0-9-]",
    PF6 = [
      ["\\s", 1],
      ["\\d", NF6],
      [Xu1, qF6]
    ],
    jF6 = (A) => {
      for (let [Q, B] of PF6) A = A.split(`${Q}*`).join(`${Q}{0,${B}}`).split(`${Q}+`).join(`${Q}{1,${B}}`);
      return A
    },
    U8 = (A, Q, B) => {
      let G = jF6(Q),
        Z = TF6++;
      LF6(A, Z, Q), aB[A] = Z, nB[Z] = Q, RF6[Z] = G, MF6[Z] = new RegExp(Q, B ? "g" : void 0), OF6[Z] = new RegExp(G, B ? "g" : void 0)
    };
  U8("NUMERICIDENTIFIER", "0|[1-9]\\d*");
  U8("NUMERICIDENTIFIERLOOSE", "\\d+");
  U8("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${Xu1}*`);
  U8("MAINVERSION", `(${nB[aB.NUMERICIDENTIFIER]})\\.(${nB[aB.NUMERICIDENTIFIER]})\\.(${nB[aB.NUMERICIDENTIFIER]})`);
  U8("MAINVERSIONLOOSE", `(${nB[aB.NUMERICIDENTIFIERLOOSE]})\\.(${nB[aB.NUMERICIDENTIFIERLOOSE]})\\.(${nB[aB.NUMERICIDENTIFIERLOOSE]})`);
  U8("PRERELEASEIDENTIFIER", `(?:${nB[aB.NUMERICIDENTIFIER]}|${nB[aB.NONNUMERICIDENTIFIER]})`);
  U8("PRERELEASEIDENTIFIERLOOSE", `(?:${nB[aB.NUMERICIDENTIFIERLOOSE]}|${nB[aB.NONNUMERICIDENTIFIER]})`);
  U8("PRERELEASE", `(?:-(${nB[aB.PRERELEASEIDENTIFIER]}(?:\\.${nB[aB.PRERELEASEIDENTIFIER]})*))`);
  U8("PRERELEASELOOSE", `(?:-?(${nB[aB.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${nB[aB.PRERELEASEIDENTIFIERLOOSE]})*))`);
  U8("BUILDIDENTIFIER", `${Xu1}+`);
  U8("BUILD", `(?:\\+(${nB[aB.BUILDIDENTIFIER]}(?:\\.${nB[aB.BUILDIDENTIFIER]})*))`);
  U8("FULLPLAIN", `v?${nB[aB.MAINVERSION]}${nB[aB.PRERELEASE]}?${nB[aB.BUILD]}?`);
  U8("FULL", `^${nB[aB.FULLPLAIN]}$`);
  U8("LOOSEPLAIN", `[v=\\s]*${nB[aB.MAINVERSIONLOOSE]}${nB[aB.PRERELEASELOOSE]}?${nB[aB.BUILD]}?`);
  U8("LOOSE", `^${nB[aB.LOOSEPLAIN]}$`);
  U8("GTLT", "((?:<|>)?=?)");
  U8("XRANGEIDENTIFIERLOOSE", `${nB[aB.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
  U8("XRANGEIDENTIFIER", `${nB[aB.NUMERICIDENTIFIER]}|x|X|\\*`);
  U8("XRANGEPLAIN", `[v=\\s]*(${nB[aB.XRANGEIDENTIFIER]})(?:\\.(${nB[aB.XRANGEIDENTIFIER]})(?:\\.(${nB[aB.XRANGEIDENTIFIER]})(?:${nB[aB.PRERELEASE]})?${nB[aB.BUILD]}?)?)?`);
  U8("XRANGEPLAINLOOSE", `[v=\\s]*(${nB[aB.XRANGEIDENTIFIERLOOSE]})(?:\\.(${nB[aB.XRANGEIDENTIFIERLOOSE]})(?:\\.(${nB[aB.XRANGEIDENTIFIERLOOSE]})(?:${nB[aB.PRERELEASELOOSE]})?${nB[aB.BUILD]}?)?)?`);
  U8("XRANGE", `^${nB[aB.GTLT]}\\s*${nB[aB.XRANGEPLAIN]}$`);
  U8("XRANGELOOSE", `^${nB[aB.GTLT]}\\s*${nB[aB.XRANGEPLAINLOOSE]}$`);
  U8("COERCEPLAIN", `(^|[^\\d])(\\d{1,${Wu1}})(?:\\.(\\d{1,${Wu1}}))?(?:\\.(\\d{1,${Wu1}}))?`);
  U8("COERCE", `${nB[aB.COERCEPLAIN]}(?:$|[^\\d])`);
  U8("COERCEFULL", nB[aB.COERCEPLAIN] + `(?:${nB[aB.PRERELEASE]})?(?:${nB[aB.BUILD]})?(?:$|[^\\d])`);
  U8("COERCERTL", nB[aB.COERCE], !0);
  U8("COERCERTLFULL", nB[aB.COERCEFULL], !0);
  U8("LONETILDE", "(?:~>?)");
  U8("TILDETRIM", `(\\s*)${nB[aB.LONETILDE]}\\s+`, !0);
  x_.tildeTrimReplace = "$1~";
  U8("TILDE", `^${nB[aB.LONETILDE]}${nB[aB.XRANGEPLAIN]}$`);
  U8("TILDELOOSE", `^${nB[aB.LONETILDE]}${nB[aB.XRANGEPLAINLOOSE]}$`);
  U8("LONECARET", "(?:\\^)");
  U8("CARETTRIM", `(\\s*)${nB[aB.LONECARET]}\\s+`, !0);
  x_.caretTrimReplace = "$1^";
  U8("CARET", `^${nB[aB.LONECARET]}${nB[aB.XRANGEPLAIN]}$`);
  U8("CARETLOOSE", `^${nB[aB.LONECARET]}${nB[aB.XRANGEPLAINLOOSE]}$`);
  U8("COMPARATORLOOSE", `^${nB[aB.GTLT]}\\s*(${nB[aB.LOOSEPLAIN]})$|^$`);
  U8("COMPARATOR", `^${nB[aB.GTLT]}\\s*(${nB[aB.FULLPLAIN]})$|^$`);
  U8("COMPARATORTRIM", `(\\s*)${nB[aB.GTLT]}\\s*(${nB[aB.LOOSEPLAIN]}|${nB[aB.XRANGEPLAIN]})`, !0);
  x_.comparatorTrimReplace = "$1$2$3";
  U8("HYPHENRANGE", `^\\s*(${nB[aB.XRANGEPLAIN]})\\s+-\\s+(${nB[aB.XRANGEPLAIN]})\\s*$`);
  U8("HYPHENRANGELOOSE", `^\\s*(${nB[aB.XRANGEPLAINLOOSE]})\\s+-\\s+(${nB[aB.XRANGEPLAINLOOSE]})\\s*$`);
  U8("STAR", "(<|>)?=?\\s*\\*");
  U8("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
  U8("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$")
})
// @from(Start 6389174, End 6389413)
GsA = z((Si7, l$B) => {
  var SF6 = Object.freeze({
      loose: !0
    }),
    _F6 = Object.freeze({}),
    kF6 = (A) => {
      if (!A) return _F6;
      if (typeof A !== "object") return SF6;
      return A
    };
  l$B.exports = kF6
})
// @from(Start 6389419, End 6389766)
Vu1 = z((_i7, a$B) => {
  var i$B = /^[0-9]+$/,
    n$B = (A, Q) => {
      let B = i$B.test(A),
        G = i$B.test(Q);
      if (B && G) A = +A, Q = +Q;
      return A === Q ? 0 : B && !G ? -1 : G && !B ? 1 : A < Q ? -1 : 1
    },
    yF6 = (A, Q) => n$B(Q, A);
  a$B.exports = {
    compareIdentifiers: n$B,
    rcompareIdentifiers: yF6
  }
})
// @from(Start 6389772, End 6395799)
hH = z((ki7, t$B) => {
  var ZsA = G$A(),
    {
      MAX_LENGTH: s$B,
      MAX_SAFE_INTEGER: IsA
    } = B$A(),
    {
      safeRe: r$B,
      safeSrc: o$B,
      t: YsA
    } = y7A(),
    xF6 = GsA(),
    {
      compareIdentifiers: x7A
    } = Vu1();
  class UT {
    constructor(A, Q) {
      if (Q = xF6(Q), A instanceof UT)
        if (A.loose === !!Q.loose && A.includePrerelease === !!Q.includePrerelease) return A;
        else A = A.version;
      else if (typeof A !== "string") throw TypeError(`Invalid version. Must be a string. Got type "${typeof A}".`);
      if (A.length > s$B) throw TypeError(`version is longer than ${s$B} characters`);
      ZsA("SemVer", A, Q), this.options = Q, this.loose = !!Q.loose, this.includePrerelease = !!Q.includePrerelease;
      let B = A.trim().match(Q.loose ? r$B[YsA.LOOSE] : r$B[YsA.FULL]);
      if (!B) throw TypeError(`Invalid Version: ${A}`);
      if (this.raw = A, this.major = +B[1], this.minor = +B[2], this.patch = +B[3], this.major > IsA || this.major < 0) throw TypeError("Invalid major version");
      if (this.minor > IsA || this.minor < 0) throw TypeError("Invalid minor version");
      if (this.patch > IsA || this.patch < 0) throw TypeError("Invalid patch version");
      if (!B[4]) this.prerelease = [];
      else this.prerelease = B[4].split(".").map((G) => {
        if (/^[0-9]+$/.test(G)) {
          let Z = +G;
          if (Z >= 0 && Z < IsA) return Z
        }
        return G
      });
      this.build = B[5] ? B[5].split(".") : [], this.format()
    }
    format() {
      if (this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length) this.version += `-${this.prerelease.join(".")}`;
      return this.version
    }
    toString() {
      return this.version
    }
    compare(A) {
      if (ZsA("SemVer.compare", this.version, this.options, A), !(A instanceof UT)) {
        if (typeof A === "string" && A === this.version) return 0;
        A = new UT(A, this.options)
      }
      if (A.version === this.version) return 0;
      return this.compareMain(A) || this.comparePre(A)
    }
    compareMain(A) {
      if (!(A instanceof UT)) A = new UT(A, this.options);
      return x7A(this.major, A.major) || x7A(this.minor, A.minor) || x7A(this.patch, A.patch)
    }
    comparePre(A) {
      if (!(A instanceof UT)) A = new UT(A, this.options);
      if (this.prerelease.length && !A.prerelease.length) return -1;
      else if (!this.prerelease.length && A.prerelease.length) return 1;
      else if (!this.prerelease.length && !A.prerelease.length) return 0;
      let Q = 0;
      do {
        let B = this.prerelease[Q],
          G = A.prerelease[Q];
        if (ZsA("prerelease compare", Q, B, G), B === void 0 && G === void 0) return 0;
        else if (G === void 0) return 1;
        else if (B === void 0) return -1;
        else if (B === G) continue;
        else return x7A(B, G)
      } while (++Q)
    }
    compareBuild(A) {
      if (!(A instanceof UT)) A = new UT(A, this.options);
      let Q = 0;
      do {
        let B = this.build[Q],
          G = A.build[Q];
        if (ZsA("build compare", Q, B, G), B === void 0 && G === void 0) return 0;
        else if (G === void 0) return 1;
        else if (B === void 0) return -1;
        else if (B === G) continue;
        else return x7A(B, G)
      } while (++Q)
    }
    inc(A, Q, B) {
      if (A.startsWith("pre")) {
        if (!Q && B === !1) throw Error("invalid increment argument: identifier is empty");
        if (Q) {
          let G = new RegExp(`^${this.options.loose?o$B[YsA.PRERELEASELOOSE]:o$B[YsA.PRERELEASE]}$`),
            Z = `-${Q}`.match(G);
          if (!Z || Z[1] !== Q) throw Error(`invalid identifier: ${Q}`)
        }
      }
      switch (A) {
        case "premajor":
          this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", Q, B);
          break;
        case "preminor":
          this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", Q, B);
          break;
        case "prepatch":
          this.prerelease.length = 0, this.inc("patch", Q, B), this.inc("pre", Q, B);
          break;
        case "prerelease":
          if (this.prerelease.length === 0) this.inc("patch", Q, B);
          this.inc("pre", Q, B);
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
          let G = Number(B) ? 1 : 0;
          if (this.prerelease.length === 0) this.prerelease = [G];
          else {
            let Z = this.prerelease.length;
            while (--Z >= 0)
              if (typeof this.prerelease[Z] === "number") this.prerelease[Z]++, Z = -2;
            if (Z === -1) {
              if (Q === this.prerelease.join(".") && B === !1) throw Error("invalid increment argument: identifier already exists");
              this.prerelease.push(G)
            }
          }
          if (Q) {
            let Z = [Q, G];
            if (B === !1) Z = [Q];
            if (x7A(this.prerelease[0], Q) === 0) {
              if (isNaN(this.prerelease[1])) this.prerelease = Z
            } else this.prerelease = Z
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
  t$B.exports = UT
})
// @from(Start 6395805, End 6396057)
it = z((yi7, AwB) => {
  var e$B = hH(),
    vF6 = (A, Q, B = !1) => {
      if (A instanceof e$B) return A;
      try {
        return new e$B(A, Q)
      } catch (G) {
        if (!B) return null;
        throw G
      }
    };
  AwB.exports = vF6
})
// @from(Start 6396063, End 6396215)
BwB = z((xi7, QwB) => {
  var bF6 = it(),
    fF6 = (A, Q) => {
      let B = bF6(A, Q);
      return B ? B.version : null
    };
  QwB.exports = fF6
})
// @from(Start 6396221, End 6396402)
ZwB = z((vi7, GwB) => {
  var hF6 = it(),
    gF6 = (A, Q) => {
      let B = hF6(A.trim().replace(/^[=v]+/, ""), Q);
      return B ? B.version : null
    };
  GwB.exports = gF6
})
// @from(Start 6396408, End 6396710)
JwB = z((bi7, YwB) => {
  var IwB = hH(),
    uF6 = (A, Q, B, G, Z) => {
      if (typeof B === "string") Z = G, G = B, B = void 0;
      try {
        return new IwB(A instanceof IwB ? A.version : A, B).inc(Q, G, Z).version
      } catch (I) {
        return null
      }
    };
  YwB.exports = uF6
})
// @from(Start 6396716, End 6397463)
VwB = z((fi7, XwB) => {
  var WwB = it(),
    mF6 = (A, Q) => {
      let B = WwB(A, null, !0),
        G = WwB(Q, null, !0),
        Z = B.compare(G);
      if (Z === 0) return null;
      let I = Z > 0,
        Y = I ? B : G,
        J = I ? G : B,
        W = !!Y.prerelease.length;
      if (!!J.prerelease.length && !W) {
        if (!J.patch && !J.minor) return "major";
        if (J.compareMain(Y) === 0) {
          if (J.minor && !J.patch) return "minor";
          return "patch"
        }
      }
      let V = W ? "pre" : "";
      if (B.major !== G.major) return V + "major";
      if (B.minor !== G.minor) return V + "minor";
      if (B.patch !== G.patch) return V + "patch";
      return "prerelease"
    };
  XwB.exports = mF6
})
// @from(Start 6397469, End 6397574)
KwB = z((hi7, FwB) => {
  var dF6 = hH(),
    cF6 = (A, Q) => new dF6(A, Q).major;
  FwB.exports = cF6
})
// @from(Start 6397580, End 6397685)
HwB = z((gi7, DwB) => {
  var pF6 = hH(),
    lF6 = (A, Q) => new pF6(A, Q).minor;
  DwB.exports = lF6
})
// @from(Start 6397691, End 6397796)
EwB = z((ui7, CwB) => {
  var iF6 = hH(),
    nF6 = (A, Q) => new iF6(A, Q).patch;
  CwB.exports = nF6
})
// @from(Start 6397802, End 6397980)
UwB = z((mi7, zwB) => {
  var aF6 = it(),
    sF6 = (A, Q) => {
      let B = aF6(A, Q);
      return B && B.prerelease.length ? B.prerelease : null
    };
  zwB.exports = sF6
})
// @from(Start 6397986, End 6398110)
VM = z((di7, wwB) => {
  var $wB = hH(),
    rF6 = (A, Q, B) => new $wB(A, B).compare(new $wB(Q, B));
  wwB.exports = rF6
})
// @from(Start 6398116, End 6398217)
NwB = z((ci7, qwB) => {
  var oF6 = VM(),
    tF6 = (A, Q, B) => oF6(Q, A, B);
  qwB.exports = tF6
})
// @from(Start 6398223, End 6398322)
MwB = z((pi7, LwB) => {
  var eF6 = VM(),
    AK6 = (A, Q) => eF6(A, Q, !0);
  LwB.exports = AK6
})
// @from(Start 6398328, End 6398527)
JsA = z((li7, RwB) => {
  var OwB = hH(),
    QK6 = (A, Q, B) => {
      let G = new OwB(A, B),
        Z = new OwB(Q, B);
      return G.compare(Z) || G.compareBuild(Z)
    };
  RwB.exports = QK6
})
// @from(Start 6398533, End 6398650)
PwB = z((ii7, TwB) => {
  var BK6 = JsA(),
    GK6 = (A, Q) => A.sort((B, G) => BK6(B, G, Q));
  TwB.exports = GK6
})
// @from(Start 6398656, End 6398773)
SwB = z((ni7, jwB) => {
  var ZK6 = JsA(),
    IK6 = (A, Q) => A.sort((B, G) => ZK6(G, B, Q));
  jwB.exports = IK6
})
// @from(Start 6398779, End 6398884)
Z$A = z((ai7, _wB) => {
  var YK6 = VM(),
    JK6 = (A, Q, B) => YK6(A, Q, B) > 0;
  _wB.exports = JK6
})
// @from(Start 6398890, End 6398995)
WsA = z((si7, kwB) => {
  var WK6 = VM(),
    XK6 = (A, Q, B) => WK6(A, Q, B) < 0;
  kwB.exports = XK6
})
// @from(Start 6399001, End 6399108)
Fu1 = z((ri7, ywB) => {
  var VK6 = VM(),
    FK6 = (A, Q, B) => VK6(A, Q, B) === 0;
  ywB.exports = FK6
})
// @from(Start 6399114, End 6399221)
Ku1 = z((oi7, xwB) => {
  var KK6 = VM(),
    DK6 = (A, Q, B) => KK6(A, Q, B) !== 0;
  xwB.exports = DK6
})
// @from(Start 6399227, End 6399333)
I$A = z((ti7, vwB) => {
  var HK6 = VM(),
    CK6 = (A, Q, B) => HK6(A, Q, B) >= 0;
  vwB.exports = CK6
})
// @from(Start 6399339, End 6399445)
XsA = z((ei7, bwB) => {
  var EK6 = VM(),
    zK6 = (A, Q, B) => EK6(A, Q, B) <= 0;
  bwB.exports = zK6
})
// @from(Start 6399451, End 6400365)
Du1 = z((An7, fwB) => {
  var UK6 = Fu1(),
    $K6 = Ku1(),
    wK6 = Z$A(),
    qK6 = I$A(),
    NK6 = WsA(),
    LK6 = XsA(),
    MK6 = (A, Q, B, G) => {
      switch (Q) {
        case "===":
          if (typeof A === "object") A = A.version;
          if (typeof B === "object") B = B.version;
          return A === B;
        case "!==":
          if (typeof A === "object") A = A.version;
          if (typeof B === "object") B = B.version;
          return A !== B;
        case "":
        case "=":
        case "==":
          return UK6(A, B, G);
        case "!=":
          return $K6(A, B, G);
        case ">":
          return wK6(A, B, G);
        case ">=":
          return qK6(A, B, G);
        case "<":
          return NK6(A, B, G);
        case "<=":
          return LK6(A, B, G);
        default:
          throw TypeError(`Invalid operator: ${Q}`)
      }
    };
  fwB.exports = MK6
})
// @from(Start 6400371, End 6401433)
Hu1 = z((Qn7, hwB) => {
  var OK6 = hH(),
    RK6 = it(),
    {
      safeRe: VsA,
      t: FsA
    } = y7A(),
    TK6 = (A, Q) => {
      if (A instanceof OK6) return A;
      if (typeof A === "number") A = String(A);
      if (typeof A !== "string") return null;
      Q = Q || {};
      let B = null;
      if (!Q.rtl) B = A.match(Q.includePrerelease ? VsA[FsA.COERCEFULL] : VsA[FsA.COERCE]);
      else {
        let W = Q.includePrerelease ? VsA[FsA.COERCERTLFULL] : VsA[FsA.COERCERTL],
          X;
        while ((X = W.exec(A)) && (!B || B.index + B[0].length !== A.length)) {
          if (!B || X.index + X[0].length !== B.index + B[0].length) B = X;
          W.lastIndex = X.index + X[1].length + X[2].length
        }
        W.lastIndex = -1
      }
      if (B === null) return null;
      let G = B[2],
        Z = B[3] || "0",
        I = B[4] || "0",
        Y = Q.includePrerelease && B[5] ? `-${B[5]}` : "",
        J = Q.includePrerelease && B[6] ? `+${B[6]}` : "";
      return RK6(`${G}.${Z}.${I}${Y}${J}`, Q)
    };
  hwB.exports = TK6
})
// @from(Start 6401439, End 6402011)
mwB = z((Bn7, uwB) => {
  class gwB {
    constructor() {
      this.max = 1000, this.map = new Map
    }
    get(A) {
      let Q = this.map.get(A);
      if (Q === void 0) return;
      else return this.map.delete(A), this.map.set(A, Q), Q
    }
    delete(A) {
      return this.map.delete(A)
    }
    set(A, Q) {
      if (!this.delete(A) && Q !== void 0) {
        if (this.map.size >= this.max) {
          let G = this.map.keys().next().value;
          this.delete(G)
        }
        this.map.set(A, Q)
      }
      return this
    }
  }
  uwB.exports = gwB
})
// @from(Start 6402017, End 6410389)
FM = z((Gn7, lwB) => {
  var PK6 = /\s+/g;
  class Y$A {
    constructor(A, Q) {
      if (Q = SK6(Q), A instanceof Y$A)
        if (A.loose === !!Q.loose && A.includePrerelease === !!Q.includePrerelease) return A;
        else return new Y$A(A.raw, Q);
      if (A instanceof Cu1) return this.raw = A.value, this.set = [
        [A]
      ], this.formatted = void 0, this;
      if (this.options = Q, this.loose = !!Q.loose, this.includePrerelease = !!Q.includePrerelease, this.raw = A.trim().replace(PK6, " "), this.set = this.raw.split("||").map((B) => this.parseRange(B.trim())).filter((B) => B.length), !this.set.length) throw TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        let B = this.set[0];
        if (this.set = this.set.filter((G) => !cwB(G[0])), this.set.length === 0) this.set = [B];
        else if (this.set.length > 1) {
          for (let G of this.set)
            if (G.length === 1 && fK6(G[0])) {
              this.set = [G];
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
          let Q = this.set[A];
          for (let B = 0; B < Q.length; B++) {
            if (B > 0) this.formatted += " ";
            this.formatted += Q[B].toString().trim()
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
      let B = ((this.options.includePrerelease && vK6) | (this.options.loose && bK6)) + ":" + A,
        G = dwB.get(B);
      if (G) return G;
      let Z = this.options.loose,
        I = Z ? FU[QE.HYPHENRANGELOOSE] : FU[QE.HYPHENRANGE];
      A = A.replace(I, nK6(this.options.includePrerelease)), HI("hyphen replace", A), A = A.replace(FU[QE.COMPARATORTRIM], kK6), HI("comparator trim", A), A = A.replace(FU[QE.TILDETRIM], yK6), HI("tilde trim", A), A = A.replace(FU[QE.CARETTRIM], xK6), HI("caret trim", A);
      let Y = A.split(" ").map((V) => hK6(V, this.options)).join(" ").split(/\s+/).map((V) => iK6(V, this.options));
      if (Z) Y = Y.filter((V) => {
        return HI("loose invalid filter", V, this.options), !!V.match(FU[QE.COMPARATORLOOSE])
      });
      HI("range list", Y);
      let J = new Map,
        W = Y.map((V) => new Cu1(V, this.options));
      for (let V of W) {
        if (cwB(V)) return [V];
        J.set(V.value, V)
      }
      if (J.size > 1 && J.has("")) J.delete("");
      let X = [...J.values()];
      return dwB.set(B, X), X
    }
    intersects(A, Q) {
      if (!(A instanceof Y$A)) throw TypeError("a Range is required");
      return this.set.some((B) => {
        return pwB(B, Q) && A.set.some((G) => {
          return pwB(G, Q) && B.every((Z) => {
            return G.every((I) => {
              return Z.intersects(I, Q)
            })
          })
        })
      })
    }
    test(A) {
      if (!A) return !1;
      if (typeof A === "string") try {
        A = new _K6(A, this.options)
      } catch (Q) {
        return !1
      }
      for (let Q = 0; Q < this.set.length; Q++)
        if (aK6(this.set[Q], A, this.options)) return !0;
      return !1
    }
  }
  lwB.exports = Y$A;
  var jK6 = mwB(),
    dwB = new jK6,
    SK6 = GsA(),
    Cu1 = J$A(),
    HI = G$A(),
    _K6 = hH(),
    {
      safeRe: FU,
      t: QE,
      comparatorTrimReplace: kK6,
      tildeTrimReplace: yK6,
      caretTrimReplace: xK6
    } = y7A(),
    {
      FLAG_INCLUDE_PRERELEASE: vK6,
      FLAG_LOOSE: bK6
    } = B$A(),
    cwB = (A) => A.value === "<0.0.0-0",
    fK6 = (A) => A.value === "",
    pwB = (A, Q) => {
      let B = !0,
        G = A.slice(),
        Z = G.pop();
      while (B && G.length) B = G.every((I) => {
        return Z.intersects(I, Q)
      }), Z = G.pop();
      return B
    },
    hK6 = (A, Q) => {
      return HI("comp", A, Q), A = mK6(A, Q), HI("caret", A), A = gK6(A, Q), HI("tildes", A), A = cK6(A, Q), HI("xrange", A), A = lK6(A, Q), HI("stars", A), A
    },
    BE = (A) => !A || A.toLowerCase() === "x" || A === "*",
    gK6 = (A, Q) => {
      return A.trim().split(/\s+/).map((B) => uK6(B, Q)).join(" ")
    },
    uK6 = (A, Q) => {
      let B = Q.loose ? FU[QE.TILDELOOSE] : FU[QE.TILDE];
      return A.replace(B, (G, Z, I, Y, J) => {
        HI("tilde", A, G, Z, I, Y, J);
        let W;
        if (BE(Z)) W = "";
        else if (BE(I)) W = `>=${Z}.0.0 <${+Z+1}.0.0-0`;
        else if (BE(Y)) W = `>=${Z}.${I}.0 <${Z}.${+I+1}.0-0`;
        else if (J) HI("replaceTilde pr", J), W = `>=${Z}.${I}.${Y}-${J} <${Z}.${+I+1}.0-0`;
        else W = `>=${Z}.${I}.${Y} <${Z}.${+I+1}.0-0`;
        return HI("tilde return", W), W
      })
    },
    mK6 = (A, Q) => {
      return A.trim().split(/\s+/).map((B) => dK6(B, Q)).join(" ")
    },
    dK6 = (A, Q) => {
      HI("caret", A, Q);
      let B = Q.loose ? FU[QE.CARETLOOSE] : FU[QE.CARET],
        G = Q.includePrerelease ? "-0" : "";
      return A.replace(B, (Z, I, Y, J, W) => {
        HI("caret", A, Z, I, Y, J, W);
        let X;
        if (BE(I)) X = "";
        else if (BE(Y)) X = `>=${I}.0.0${G} <${+I+1}.0.0-0`;
        else if (BE(J))
          if (I === "0") X = `>=${I}.${Y}.0${G} <${I}.${+Y+1}.0-0`;
          else X = `>=${I}.${Y}.0${G} <${+I+1}.0.0-0`;
        else if (W)
          if (HI("replaceCaret pr", W), I === "0")
            if (Y === "0") X = `>=${I}.${Y}.${J}-${W} <${I}.${Y}.${+J+1}-0`;
            else X = `>=${I}.${Y}.${J}-${W} <${I}.${+Y+1}.0-0`;
        else X = `>=${I}.${Y}.${J}-${W} <${+I+1}.0.0-0`;
        else if (HI("no pr"), I === "0")
          if (Y === "0") X = `>=${I}.${Y}.${J}${G} <${I}.${Y}.${+J+1}-0`;
          else X = `>=${I}.${Y}.${J}${G} <${I}.${+Y+1}.0-0`;
        else X = `>=${I}.${Y}.${J} <${+I+1}.0.0-0`;
        return HI("caret return", X), X
      })
    },
    cK6 = (A, Q) => {
      return HI("replaceXRanges", A, Q), A.split(/\s+/).map((B) => pK6(B, Q)).join(" ")
    },
    pK6 = (A, Q) => {
      A = A.trim();
      let B = Q.loose ? FU[QE.XRANGELOOSE] : FU[QE.XRANGE];
      return A.replace(B, (G, Z, I, Y, J, W) => {
        HI("xRange", A, G, Z, I, Y, J, W);
        let X = BE(I),
          V = X || BE(Y),
          F = V || BE(J),
          K = F;
        if (Z === "=" && K) Z = "";
        if (W = Q.includePrerelease ? "-0" : "", X)
          if (Z === ">" || Z === "<") G = "<0.0.0-0";
          else G = "*";
        else if (Z && K) {
          if (V) Y = 0;
          if (J = 0, Z === ">")
            if (Z = ">=", V) I = +I + 1, Y = 0, J = 0;
            else Y = +Y + 1, J = 0;
          else if (Z === "<=")
            if (Z = "<", V) I = +I + 1;
            else Y = +Y + 1;
          if (Z === "<") W = "-0";
          G = `${Z+I}.${Y}.${J}${W}`
        } else if (V) G = `>=${I}.0.0${W} <${+I+1}.0.0-0`;
        else if (F) G = `>=${I}.${Y}.0${W} <${I}.${+Y+1}.0-0`;
        return HI("xRange return", G), G
      })
    },
    lK6 = (A, Q) => {
      return HI("replaceStars", A, Q), A.trim().replace(FU[QE.STAR], "")
    },
    iK6 = (A, Q) => {
      return HI("replaceGTE0", A, Q), A.trim().replace(FU[Q.includePrerelease ? QE.GTE0PRE : QE.GTE0], "")
    },
    nK6 = (A) => (Q, B, G, Z, I, Y, J, W, X, V, F, K) => {
      if (BE(G)) B = "";
      else if (BE(Z)) B = `>=${G}.0.0${A?"-0":""}`;
      else if (BE(I)) B = `>=${G}.${Z}.0${A?"-0":""}`;
      else if (Y) B = `>=${B}`;
      else B = `>=${B}${A?"-0":""}`;
      if (BE(X)) W = "";
      else if (BE(V)) W = `<${+X+1}.0.0-0`;
      else if (BE(F)) W = `<${X}.${+V+1}.0-0`;
      else if (K) W = `<=${X}.${V}.${F}-${K}`;
      else if (A) W = `<${X}.${V}.${+F+1}-0`;
      else W = `<=${W}`;
      return `${B} ${W}`.trim()
    },
    aK6 = (A, Q, B) => {
      for (let G = 0; G < A.length; G++)
        if (!A[G].test(Q)) return !1;
      if (Q.prerelease.length && !B.includePrerelease) {
        for (let G = 0; G < A.length; G++) {
          if (HI(A[G].semver), A[G].semver === Cu1.ANY) continue;
          if (A[G].semver.prerelease.length > 0) {
            let Z = A[G].semver;
            if (Z.major === Q.major && Z.minor === Q.minor && Z.patch === Q.patch) return !0
          }
        }
        return !1
      }
      return !0
    }
})
// @from(Start 6410395, End 6412939)
J$A = z((Zn7, owB) => {
  var W$A = Symbol("SemVer ANY");
  class KsA {
    static get ANY() {
      return W$A
    }
    constructor(A, Q) {
      if (Q = iwB(Q), A instanceof KsA)
        if (A.loose === !!Q.loose) return A;
        else A = A.value;
      if (A = A.trim().split(/\s+/).join(" "), zu1("comparator", A, Q), this.options = Q, this.loose = !!Q.loose, this.parse(A), this.semver === W$A) this.value = "";
      else this.value = this.operator + this.semver.version;
      zu1("comp", this)
    }
    parse(A) {
      let Q = this.options.loose ? nwB[awB.COMPARATORLOOSE] : nwB[awB.COMPARATOR],
        B = A.match(Q);
      if (!B) throw TypeError(`Invalid comparator: ${A}`);
      if (this.operator = B[1] !== void 0 ? B[1] : "", this.operator === "=") this.operator = "";
      if (!B[2]) this.semver = W$A;
      else this.semver = new swB(B[2], this.options.loose)
    }
    toString() {
      return this.value
    }
    test(A) {
      if (zu1("Comparator.test", A, this.options.loose), this.semver === W$A || A === W$A) return !0;
      if (typeof A === "string") try {
        A = new swB(A, this.options)
      } catch (Q) {
        return !1
      }
      return Eu1(A, this.operator, this.semver, this.options)
    }
    intersects(A, Q) {
      if (!(A instanceof KsA)) throw TypeError("a Comparator is required");
      if (this.operator === "") {
        if (this.value === "") return !0;
        return new rwB(A.value, Q).test(this.value)
      } else if (A.operator === "") {
        if (A.value === "") return !0;
        return new rwB(this.value, Q).test(A.semver)
      }
      if (Q = iwB(Q), Q.includePrerelease && (this.value === "<0.0.0-0" || A.value === "<0.0.0-0")) return !1;
      if (!Q.includePrerelease && (this.value.startsWith("<0.0.0") || A.value.startsWith("<0.0.0"))) return !1;
      if (this.operator.startsWith(">") && A.operator.startsWith(">")) return !0;
      if (this.operator.startsWith("<") && A.operator.startsWith("<")) return !0;
      if (this.semver.version === A.semver.version && this.operator.includes("=") && A.operator.includes("=")) return !0;
      if (Eu1(this.semver, "<", A.semver, Q) && this.operator.startsWith(">") && A.operator.startsWith("<")) return !0;
      if (Eu1(this.semver, ">", A.semver, Q) && this.operator.startsWith("<") && A.operator.startsWith(">")) return !0;
      return !1
    }
  }
  owB.exports = KsA;
  var iwB = GsA(),
    {
      safeRe: nwB,
      t: awB
    } = y7A(),
    Eu1 = Du1(),
    zu1 = G$A(),
    swB = hH(),
    rwB = FM()
})
// @from(Start 6412945, End 6413148)
v7A = z((In7, twB) => {
  var sK6 = FM(),
    rK6 = (A, Q, B) => {
      try {
        Q = new sK6(Q, B)
      } catch (G) {
        return !1
      }
      return Q.test(A)
    };
  twB.exports = rK6
})
// @from(Start 6413154, End 6413319)
AqB = z((Yn7, ewB) => {
  var oK6 = FM(),
    tK6 = (A, Q) => new oK6(A, Q).set.map((B) => B.map((G) => G.value).join(" ").trim().split(" "));
  ewB.exports = tK6
})
// @from(Start 6413325, End 6413724)
BqB = z((Jn7, QqB) => {
  var eK6 = hH(),
    AD6 = FM(),
    QD6 = (A, Q, B) => {
      let G = null,
        Z = null,
        I = null;
      try {
        I = new AD6(Q, B)
      } catch (Y) {
        return null
      }
      return A.forEach((Y) => {
        if (I.test(Y)) {
          if (!G || Z.compare(Y) === -1) G = Y, Z = new eK6(G, B)
        }
      }), G
    };
  QqB.exports = QD6
})
// @from(Start 6413730, End 6414128)
ZqB = z((Wn7, GqB) => {
  var BD6 = hH(),
    GD6 = FM(),
    ZD6 = (A, Q, B) => {
      let G = null,
        Z = null,
        I = null;
      try {
        I = new GD6(Q, B)
      } catch (Y) {
        return null
      }
      return A.forEach((Y) => {
        if (I.test(Y)) {
          if (!G || Z.compare(Y) === 1) G = Y, Z = new BD6(G, B)
        }
      }), G
    };
  GqB.exports = ZD6
})
// @from(Start 6414134, End 6415182)
JqB = z((Xn7, YqB) => {
  var Uu1 = hH(),
    ID6 = FM(),
    IqB = Z$A(),
    YD6 = (A, Q) => {
      A = new ID6(A, Q);
      let B = new Uu1("0.0.0");
      if (A.test(B)) return B;
      if (B = new Uu1("0.0.0-0"), A.test(B)) return B;
      B = null;
      for (let G = 0; G < A.set.length; ++G) {
        let Z = A.set[G],
          I = null;
        if (Z.forEach((Y) => {
            let J = new Uu1(Y.semver.version);
            switch (Y.operator) {
              case ">":
                if (J.prerelease.length === 0) J.patch++;
                else J.prerelease.push(0);
                J.raw = J.format();
              case "":
              case ">=":
                if (!I || IqB(J, I)) I = J;
                break;
              case "<":
              case "<=":
                break;
              default:
                throw Error(`Unexpected operation: ${Y.operator}`)
            }
          }), I && (!B || IqB(B, I))) B = I
      }
      if (B && A.test(B)) return B;
      return null
    };
  YqB.exports = YD6
})
// @from(Start 6415188, End 6415383)
XqB = z((Vn7, WqB) => {
  var JD6 = FM(),
    WD6 = (A, Q) => {
      try {
        return new JD6(A, Q).range || "*"
      } catch (B) {
        return null
      }
    };
  WqB.exports = WD6
})
// @from(Start 6415389, End 6416591)
DsA = z((Fn7, DqB) => {
  var XD6 = hH(),
    KqB = J$A(),
    {
      ANY: VD6
    } = KqB,
    FD6 = FM(),
    KD6 = v7A(),
    VqB = Z$A(),
    FqB = WsA(),
    DD6 = XsA(),
    HD6 = I$A(),
    CD6 = (A, Q, B, G) => {
      A = new XD6(A, G), Q = new FD6(Q, G);
      let Z, I, Y, J, W;
      switch (B) {
        case ">":
          Z = VqB, I = DD6, Y = FqB, J = ">", W = ">=";
          break;
        case "<":
          Z = FqB, I = HD6, Y = VqB, J = "<", W = "<=";
          break;
        default:
          throw TypeError('Must provide a hilo val of "<" or ">"')
      }
      if (KD6(A, Q, G)) return !1;
      for (let X = 0; X < Q.set.length; ++X) {
        let V = Q.set[X],
          F = null,
          K = null;
        if (V.forEach((D) => {
            if (D.semver === VD6) D = new KqB(">=0.0.0");
            if (F = F || D, K = K || D, Z(D.semver, F.semver, G)) F = D;
            else if (Y(D.semver, K.semver, G)) K = D
          }), F.operator === J || F.operator === W) return !1;
        if ((!K.operator || K.operator === J) && I(A, K.semver)) return !1;
        else if (K.operator === W && Y(A, K.semver)) return !1
      }
      return !0
    };
  DqB.exports = CD6
})
// @from(Start 6416597, End 6416704)
CqB = z((Kn7, HqB) => {
  var ED6 = DsA(),
    zD6 = (A, Q, B) => ED6(A, Q, ">", B);
  HqB.exports = zD6
})
// @from(Start 6416710, End 6416817)
zqB = z((Dn7, EqB) => {
  var UD6 = DsA(),
    $D6 = (A, Q, B) => UD6(A, Q, "<", B);
  EqB.exports = $D6
})
// @from(Start 6416823, End 6416989)
wqB = z((Hn7, $qB) => {
  var UqB = FM(),
    wD6 = (A, Q, B) => {
      return A = new UqB(A, B), Q = new UqB(Q, B), A.intersects(Q, B)
    };
  $qB.exports = wD6
})
// @from(Start 6416995, End 6417716)
NqB = z((Cn7, qqB) => {
  var qD6 = v7A(),
    ND6 = VM();
  qqB.exports = (A, Q, B) => {
    let G = [],
      Z = null,
      I = null,
      Y = A.sort((V, F) => ND6(V, F, B));
    for (let V of Y)
      if (qD6(V, Q, B)) {
        if (I = V, !Z) Z = V
      } else {
        if (I) G.push([Z, I]);
        I = null, Z = null
      } if (Z) G.push([Z, null]);
    let J = [];
    for (let [V, F] of G)
      if (V === F) J.push(V);
      else if (!F && V === Y[0]) J.push("*");
    else if (!F) J.push(`>=${V}`);
    else if (V === Y[0]) J.push(`<=${F}`);
    else J.push(`${V} - ${F}`);
    let W = J.join(" || "),
      X = typeof Q.raw === "string" ? Q.raw : String(Q);
    return W.length < X.length ? W : Q
  }
})
// @from(Start 6417722, End 6421159)
PqB = z((En7, TqB) => {
  var LqB = FM(),
    wu1 = J$A(),
    {
      ANY: $u1
    } = wu1,
    X$A = v7A(),
    qu1 = VM(),
    LD6 = (A, Q, B = {}) => {
      if (A === Q) return !0;
      A = new LqB(A, B), Q = new LqB(Q, B);
      let G = !1;
      A: for (let Z of A.set) {
        for (let I of Q.set) {
          let Y = OD6(Z, I, B);
          if (G = G || Y !== null, Y) continue A
        }
        if (G) return !1
      }
      return !0
    },
    MD6 = [new wu1(">=0.0.0-0")],
    MqB = [new wu1(">=0.0.0")],
    OD6 = (A, Q, B) => {
      if (A === Q) return !0;
      if (A.length === 1 && A[0].semver === $u1)
        if (Q.length === 1 && Q[0].semver === $u1) return !0;
        else if (B.includePrerelease) A = MD6;
      else A = MqB;
      if (Q.length === 1 && Q[0].semver === $u1)
        if (B.includePrerelease) return !0;
        else Q = MqB;
      let G = new Set,
        Z, I;
      for (let D of A)
        if (D.operator === ">" || D.operator === ">=") Z = OqB(Z, D, B);
        else if (D.operator === "<" || D.operator === "<=") I = RqB(I, D, B);
      else G.add(D.semver);
      if (G.size > 1) return null;
      let Y;
      if (Z && I) {
        if (Y = qu1(Z.semver, I.semver, B), Y > 0) return null;
        else if (Y === 0 && (Z.operator !== ">=" || I.operator !== "<=")) return null
      }
      for (let D of G) {
        if (Z && !X$A(D, String(Z), B)) return null;
        if (I && !X$A(D, String(I), B)) return null;
        for (let H of Q)
          if (!X$A(D, String(H), B)) return !1;
        return !0
      }
      let J, W, X, V, F = I && !B.includePrerelease && I.semver.prerelease.length ? I.semver : !1,
        K = Z && !B.includePrerelease && Z.semver.prerelease.length ? Z.semver : !1;
      if (F && F.prerelease.length === 1 && I.operator === "<" && F.prerelease[0] === 0) F = !1;
      for (let D of Q) {
        if (V = V || D.operator === ">" || D.operator === ">=", X = X || D.operator === "<" || D.operator === "<=", Z) {
          if (K) {
            if (D.semver.prerelease && D.semver.prerelease.length && D.semver.major === K.major && D.semver.minor === K.minor && D.semver.patch === K.patch) K = !1
          }
          if (D.operator === ">" || D.operator === ">=") {
            if (J = OqB(Z, D, B), J === D && J !== Z) return !1
          } else if (Z.operator === ">=" && !X$A(Z.semver, String(D), B)) return !1
        }
        if (I) {
          if (F) {
            if (D.semver.prerelease && D.semver.prerelease.length && D.semver.major === F.major && D.semver.minor === F.minor && D.semver.patch === F.patch) F = !1
          }
          if (D.operator === "<" || D.operator === "<=") {
            if (W = RqB(I, D, B), W === D && W !== I) return !1
          } else if (I.operator === "<=" && !X$A(I.semver, String(D), B)) return !1
        }
        if (!D.operator && (I || Z) && Y !== 0) return !1
      }
      if (Z && X && !I && Y !== 0) return !1;
      if (I && V && !Z && Y !== 0) return !1;
      if (K || F) return !1;
      return !0
    },
    OqB = (A, Q, B) => {
      if (!A) return Q;
      let G = qu1(A.semver, Q.semver, B);
      return G > 0 ? A : G < 0 ? Q : Q.operator === ">" && A.operator === ">=" ? Q : A
    },
    RqB = (A, Q, B) => {
      if (!A) return Q;
      let G = qu1(A.semver, Q.semver, B);
      return G < 0 ? A : G > 0 ? Q : Q.operator === "<" && A.operator === "<=" ? Q : A
    };
  TqB.exports = LD6
})
// @from(Start 6421165, End 6422813)
KU = z((zn7, _qB) => {
  var Nu1 = y7A(),
    jqB = B$A(),
    RD6 = hH(),
    SqB = Vu1(),
    TD6 = it(),
    PD6 = BwB(),
    jD6 = ZwB(),
    SD6 = JwB(),
    _D6 = VwB(),
    kD6 = KwB(),
    yD6 = HwB(),
    xD6 = EwB(),
    vD6 = UwB(),
    bD6 = VM(),
    fD6 = NwB(),
    hD6 = MwB(),
    gD6 = JsA(),
    uD6 = PwB(),
    mD6 = SwB(),
    dD6 = Z$A(),
    cD6 = WsA(),
    pD6 = Fu1(),
    lD6 = Ku1(),
    iD6 = I$A(),
    nD6 = XsA(),
    aD6 = Du1(),
    sD6 = Hu1(),
    rD6 = J$A(),
    oD6 = FM(),
    tD6 = v7A(),
    eD6 = AqB(),
    AH6 = BqB(),
    QH6 = ZqB(),
    BH6 = JqB(),
    GH6 = XqB(),
    ZH6 = DsA(),
    IH6 = CqB(),
    YH6 = zqB(),
    JH6 = wqB(),
    WH6 = NqB(),
    XH6 = PqB();
  _qB.exports = {
    parse: TD6,
    valid: PD6,
    clean: jD6,
    inc: SD6,
    diff: _D6,
    major: kD6,
    minor: yD6,
    patch: xD6,
    prerelease: vD6,
    compare: bD6,
    rcompare: fD6,
    compareLoose: hD6,
    compareBuild: gD6,
    sort: uD6,
    rsort: mD6,
    gt: dD6,
    lt: cD6,
    eq: pD6,
    neq: lD6,
    gte: iD6,
    lte: nD6,
    cmp: aD6,
    coerce: sD6,
    Comparator: rD6,
    Range: oD6,
    satisfies: tD6,
    toComparators: eD6,
    maxSatisfying: AH6,
    minSatisfying: QH6,
    minVersion: BH6,
    validRange: GH6,
    outside: ZH6,
    gtr: IH6,
    ltr: YH6,
    intersects: JH6,
    simplifyRange: WH6,
    subset: XH6,
    SemVer: RD6,
    re: Nu1.re,
    src: Nu1.src,
    tokens: Nu1.t,
    SEMVER_SPEC_VERSION: jqB.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: jqB.RELEASE_TYPES,
    compareIdentifiers: SqB.compareIdentifiers,
    rcompareIdentifiers: SqB.rcompareIdentifiers
  }
})
// @from(Start 6422816, End 6422900)
function VH6() {
  return process.platform === "win32" && !!process.env.WT_SESSION
}
// @from(Start 6422902, End 6423080)
function FH6() {
  if (VH6()) return !0;
  if (process.platform === "win32" && process.env.TERM_PROGRAM === "vscode" && process.env.TERM_PROGRAM_VERSION) return !0;
  return !1
}
// @from(Start 6423082, End 6423253)
function Lu1() {
  if (process.platform === "win32")
    if (FH6()) return "\x1B[2J\x1B[3J\x1B[H";
    else return "\x1B[2J\x1B[0f";
  else return "\x1B[2J\x1B[3J\x1B[H"
}
// @from(Start 6423258, End 6423261)
Un7
// @from(Start 6423267, End 6423299)
kqB = L(() => {
  Un7 = Lu1()
})
// @from(Start 6423302, End 6423732)
function KH6() {
  if (!process.stdout.isTTY) return !1;
  if (process.env.WT_SESSION) return !1;
  if (process.env.ConEmuANSI || process.env.ConEmuPID || process.env.ConEmuTask) return !0;
  let A = V$A.coerce(process.env.TERM_PROGRAM_VERSION);
  if (!A) return !1;
  if (process.env.TERM_PROGRAM === "ghostty") return V$A.gte(A, "1.2.0");
  if (process.env.TERM_PROGRAM === "iTerm.app") return V$A.gte(A, "3.6.6");
  return !1
}
// @from(Start 6423734, End 6423794)
function DH6(A) {
  return `${fg1}8${P7A}${P7A}${A}${T7A}`
}
// @from(Start 6423796, End 6424625)
function Mu1(A, Q) {
  if (Q.length === 0) return;
  let B = uUB;
  for (let G of Q) switch (G.type) {
    case "stdout":
      B += G.content;
      break;
    case "clear":
      if (G.count > 0) B += XM.eraseLines(G.count);
      break;
    case "clearTerminal":
      B += Lu1();
      break;
    case "cursorHide":
      B += XM.cursorHide;
      break;
    case "cursorShow":
      B += XM.cursorShow;
      break;
    case "cursorMove":
      B += XM.cursorMove(G.x, G.y);
      break;
    case "carriageReturn":
      B += "\r";
      break;
    case "resolvePendingWrap":
      B += " \b";
      break;
    case "hyperlink":
      B += DH6(G.uri);
      break;
    case "style":
      B += pt(G.codes);
      break;
    case "progress":
      if (KH6()) B += HH6(G.state);
      break
  }
  B += mUB, A.stdout.write(B)
}
// @from(Start 6424627, End 6424785)
function HH6(A) {
  let Q = CH6(A.state),
    B = A.percentage ?? 0,
    G = Math.max(0, Math.min(100, Math.round(B)));
  return `${fg1}9;4;${Q};${G}${T7A}`
}
// @from(Start 6424787, End 6424974)
function CH6(A) {
  switch (A) {
    case "completed":
      return 0;
    case "error":
      return 2;
    case "indeterminate":
      return 3;
    case "running":
      return 1
  }
}
// @from(Start 6424979, End 6424982)
V$A
// @from(Start 6424988, End 6425053)
yqB = L(() => {
  baA();
  eaA();
  kqB();
  V$A = BA(KU(), 1)
})
// @from(Start 6425055, End 6430225)
class HsA {
  options;
  log;
  terminal;
  scheduleRender;
  isUnmounted = !1;
  isPaused = !1;
  container;
  rootNode;
  renderer;
  exitPromise;
  restoreConsole;
  unsubscribeTTYHandlers;
  terminalColumns;
  terminalRows;
  currentNode = null;
  constructor(A) {
    this.options = A;
    if (Oh1(this), this.options.patchConsole) this.restoreConsole = this.patchConsole();
    if (this.terminal = {
        stdout: A.stdout,
        stderr: A.stderr
      }, this.terminalColumns = A.stdout.columns || 80, this.terminalRows = A.stdout.rows || 24, this.log = new pg1({
        debug: A.debug,
        isTTY: A.stdout.isTTY || !1,
        onFlicker: A.onFlicker,
        ink2: A.ink2
      }, gaA(this.terminalRows, this.terminalColumns)), this.scheduleRender = A.debug ? this.onRender : Mh1(this.onRender, 32, {
        leading: !0,
        trailing: !0
      }), this.isUnmounted = !1, this.unsubscribeExit = SyA(this.unmount, {
        alwaysLast: !1
      }), A.stdout.isTTY) A.stdout.on("resize", this.handleResize), process.on("SIGCONT", this.handleResume), this.unsubscribeTTYHandlers = () => {
      A.stdout.off("resize", this.handleResize), process.off("SIGCONT", this.handleResume)
    };
    if (this.rootNode = DaA("ink-root"), this.renderer = gg1(this.rootNode), this.rootNode.onRender = this.scheduleRender, this.rootNode.onImmediateRender = this.onRender, this.rootNode.onComputeLayout = () => {
        if (this.isUnmounted) return;
        if (this.rootNode.yogaNode) this.rootNode.yogaNode.setWidth(this.terminalColumns), this.rootNode.yogaNode.calculateLayout(void 0, void 0, xt.LTR)
      }, this.container = Ap.createContainer(this.rootNode, 0, null, !1, null, "id", () => {}, null), process.env.DEV === "true") Ap.injectIntoDevTools({
      bundleType: 0,
      version: "16.13.1",
      rendererPackageName: "ink"
    })
  }
  handleResume = () => {
    if (!this.options.stdout.isTTY) return;
    this.log.reset()
  };
  handleResize = () => {
    if (this.terminalColumns = this.options.stdout.columns || 80, this.terminalRows = this.options.stdout.rows || 24, this.currentNode !== null) this.render(this.currentNode);
    this.scheduleRender()
  };
  resolveExitPromise = () => {};
  rejectExitPromise = () => {};
  unsubscribeExit = () => {};
  setTheme(A) {
    this.options.theme = A
  }
  onRender() {
    if (this.isUnmounted || this.isPaused) return;
    let A = this.options.stdout.rows || 24,
      Q = this.options.stdout.columns || 80,
      B = this.renderer({
        terminalWidth: Q,
        terminalRows: A,
        isTTY: this.options.stdout.isTTY,
        ink2: this.options.ink2
      }),
      G = this.log.render(B);
    for (let Z of G)
      if (Z.type === "clearTerminal") this.options.onFlicker?.(B.outputHeight, B.rows, this.options.ink2, Z.reason);
    Mu1(this.terminal, G)
  }
  pause() {
    Ap.flushSync(), this.onRender(), this.isPaused = !0
  }
  resume() {
    this.isPaused = !1, this.onRender()
  }
  stdinListeners = [];
  wasRawMode = !1;
  suspendStdin() {
    let A = this.options.stdin;
    if (!A.isTTY) return;
    A.listeners("readable").forEach((G) => {
      this.stdinListeners.push({
        event: "readable",
        listener: G
      }), A.removeListener("readable", G)
    });
    let B = A;
    if (B.isRaw && B.setRawMode) B.setRawMode(!1), this.wasRawMode = !0
  }
  resumeStdin() {
    let A = this.options.stdin;
    if (!A.isTTY) return;
    if (this.stdinListeners.forEach(({
        event: Q,
        listener: B
      }) => {
        A.addListener(Q, B)
      }), this.stdinListeners = [], this.wasRawMode) {
      let Q = A;
      if (Q.setRawMode) Q.setRawMode(!0);
      this.wasRawMode = !1
    }
  }
  render(A) {
    this.currentNode = A;
    let Q = xqB.default.createElement(BsA, {
      initialTheme: this.options.theme,
      stdin: this.options.stdin,
      stdout: this.options.stdout,
      stderr: this.options.stderr,
      exitOnCtrlC: this.options.exitOnCtrlC,
      onExit: this.unmount,
      ink2: this.options.ink2,
      terminalColumns: this.terminalColumns,
      terminalRows: this.terminalRows
    }, A);
    Ap.updateContainer(Q, this.container, null, ZKA)
  }
  unmount(A) {
    if (this.isUnmounted) return;
    if (this.onRender(), this.unsubscribeExit(), typeof this.restoreConsole === "function") this.restoreConsole();
    this.unsubscribeTTYHandlers?.();
    let Q = this.log.renderPreviousOutput_DEPRECATED();
    if (Mu1(this.terminal, Q), this.isUnmounted = !0, this.scheduleRender.cancel?.(), Ap.updateContainer(null, this.container, null, ZKA), Qf.delete(this.options.stdout), A instanceof Error) this.rejectExitPromise(A);
    else this.resolveExitPromise()
  }
  async waitUntilExit() {
    return this.exitPromise ||= new Promise((A, Q) => {
      this.resolveExitPromise = A, this.rejectExitPromise = Q
    }), this.exitPromise
  }
  resetLineCount() {
    if (this.options.stdout.isTTY && !this.options.debug) this.log.reset()
  }
  patchConsole() {
    if (this.options.debug) return;
    return VEB((A, Q) => {
      if (A === "stdout") g(`console.log: ${Q}`);
      if (A === "stderr") AA(Error(`console.error: ${Q}`))
    })
  }
}
// @from(Start 6430227, End 6430291)
function sg1(A) {
  Qf.forEach((Q) => {
    Q.setTheme(A)
  })
}
// @from(Start 6430296, End 6430299)
xqB
// @from(Start 6430305, End 6430475)
eg1 = L(() => {
  JEB();
  AD1();
  FEB();
  $g1();
  A$B();
  EaA();
  I$B();
  uaA();
  m$B();
  g1();
  V0();
  GH1();
  yqB();
  ug1();
  ft();
  xqB = BA(VA(), 1)
})
// @from(Start 6430478, End 6430550)
function gH() {
  if (_j(void 0)) return !1;
  return Y0(void 0) || !1
}
// @from(Start 6430555, End 6430587)
nt = L(() => {
  hQ();
  u2()
})
// @from(Start 6430640, End 6431174)
zH6 = (A, Q) => {
    let B = $H6(Q),
      G = {
        stdout: process.stdout,
        stdin: process.stdin,
        stderr: process.stderr,
        debug: !1,
        exitOnCtrlC: !0,
        patchConsole: !0,
        ...B,
        theme: B.theme ?? N1().theme,
        ink2: B.ink2 ?? gH()
      },
      Z = wH6(G.stdout, () => new HsA(G));
    return Z.render(A), {
      rerender: Z.render,
      unmount() {
        Z.unmount()
      },
      waitUntilExit: Z.waitUntilExit,
      cleanup: () => Qf.delete(G.stdout)
    }
  }
// @from(Start 6431178, End 6431239)
UH6 = async (A, Q) => {
    return await AzB(), zH6(A, Q)
  }
// @from(Start 6431241, End 6431243)
VG
// @from(Start 6431245, End 6431367)
$H6 = (A = {}) => {
    if (A instanceof EH6) return {
      stdout: A,
      stdin: process.stdin
    };
    return A
  }
// @from(Start 6431369, End 6431461)
wH6 = (A, Q) => {
    let B = Qf.get(A);
    if (!B) B = Q(), Qf.set(A, B);
    return B
  }
// @from(Start 6431467, End 6431539)
vqB = L(() => {
  eg1();
  EaA();
  uaA();
  jQ();
  nt();
  VG = UH6
})
// @from(Start 6431542, End 6431708)
function F$A(A, Q) {
  if (!A) return;
  if (A.startsWith("rgb(") || A.startsWith("#") || A.startsWith("ansi256(") || A.startsWith("ansi:")) return A;
  return Q[A]
}
// @from(Start 6431713, End 6431716)
CsA
// @from(Start 6431718, End 6431721)
bqB
// @from(Start 6431723, End 6431724)
S
// @from(Start 6431730, End 6432341)
fqB = L(() => {
  _aA();
  oUA();
  rUA();
  CsA = BA(VA(), 1);
  bqB = CsA.forwardRef(({
    borderColor: A,
    borderTopColor: Q,
    borderBottomColor: B,
    borderLeftColor: G,
    borderRightColor: Z,
    children: I,
    ...Y
  }, J) => {
    let [W] = qB(), X = R7A(W), V = F$A(A, X), F = F$A(Q, X), K = F$A(B, X), D = F$A(G, X), H = F$A(Z, X);
    return CsA.default.createElement(VU, {
      ref: J,
      borderColor: V,
      borderTopColor: F,
      borderBottomColor: K,
      borderLeftColor: D,
      borderRightColor: H,
      ...Y
    }, I)
  });
  bqB.displayName = "ThemedBox";
  S = bqB
})
// @from(Start 6432344, End 6432452)
function hqB({
  children: A
}) {
  return Ou1.default.createElement(NH6.Provider, {
    value: !0
  }, A)
}
// @from(Start 6432457, End 6432460)
Ou1
// @from(Start 6432462, End 6432465)
qH6
// @from(Start 6432467, End 6432470)
NH6
// @from(Start 6432476, End 6432570)
Ru1 = L(() => {
  Ou1 = BA(VA(), 1), qH6 = BA(VA(), 1), NH6 = Ou1.default.createContext(!1)
})
// @from(Start 6432573, End 6433228)
function Zp(A) {
  let {
    items: Q,
    children: B
  } = A, G = KM.useContext(k_), [Z, I] = KM.useState(0), Y = KM.useMemo(() => {
    return Q.slice(Z)
  }, [Q, Z]);
  if (KM.useLayoutEffect(() => {
      I(Q.length)
    }, [Q.length]), G) {
    let W = Q.map((X, V) => B(X, V));
    return KM.default.createElement("ink-box", {
      style: {
        flexDirection: "column"
      }
    }, W)
  }
  let J = Y.map((W, X) => {
    return B(W, Z + X)
  });
  return KM.default.createElement(hqB, null, KM.default.createElement("ink-box", {
    internal_static: !0,
    style: {
      position: "absolute",
      flexDirection: "column"
    }
  }, J))
}
// @from(Start 6433233, End 6433235)
KM
// @from(Start 6433241, End 6433296)
gqB = L(() => {
  Ru1();
  k7A();
  KM = BA(VA(), 1)
})
// @from(Start 6433302, End 6435453)
dqB = z((Ja7, mqB) => {
  var LH6 = UA("os"),
    uqB = UA("tty"),
    DM = uFA(),
    {
      env: vF
    } = process,
    Ip;
  if (DM("no-color") || DM("no-colors") || DM("color=false") || DM("color=never")) Ip = 0;
  else if (DM("color") || DM("colors") || DM("color=true") || DM("color=always")) Ip = 1;
  if ("FORCE_COLOR" in vF)
    if (vF.FORCE_COLOR === "true") Ip = 1;
    else if (vF.FORCE_COLOR === "false") Ip = 0;
  else Ip = vF.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(vF.FORCE_COLOR, 10), 3);

  function Tu1(A) {
    if (A === 0) return !1;
    return {
      level: A,
      hasBasic: !0,
      has256: A >= 2,
      has16m: A >= 3
    }
  }

  function Pu1(A, Q) {
    if (Ip === 0) return 0;
    if (DM("color=16m") || DM("color=full") || DM("color=truecolor")) return 3;
    if (DM("color=256")) return 2;
    if (A && !Q && Ip === void 0) return 0;
    let B = Ip || 0;
    if (vF.TERM === "dumb") return B;
    if (process.platform === "win32") {
      let G = LH6.release().split(".");
      if (Number(G[0]) >= 10 && Number(G[2]) >= 10586) return Number(G[2]) >= 14931 ? 3 : 2;
      return 1
    }
    if ("CI" in vF) {
      if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((G) => (G in vF)) || vF.CI_NAME === "codeship") return 1;
      return B
    }
    if ("TEAMCITY_VERSION" in vF) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(vF.TEAMCITY_VERSION) ? 1 : 0;
    if (vF.COLORTERM === "truecolor") return 3;
    if ("TERM_PROGRAM" in vF) {
      let G = parseInt((vF.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (vF.TERM_PROGRAM) {
        case "iTerm.app":
          return G >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2
      }
    }
    if (/-256(color)?$/i.test(vF.TERM)) return 2;
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(vF.TERM)) return 1;
    if ("COLORTERM" in vF) return 1;
    return B
  }

  function MH6(A) {
    let Q = Pu1(A, A && A.isTTY);
    return Tu1(Q)
  }
  mqB.exports = {
    supportsColor: MH6,
    stdout: Tu1(Pu1(!0, uqB.isatty(1))),
    stderr: Tu1(Pu1(!0, uqB.isatty(2)))
  }
})
// @from(Start 6435459, End 6437133)
lqB = z((Wa7, pqB) => {
  var OH6 = dqB(),
    b7A = uFA();

  function cqB(A) {
    if (/^\d{3,4}$/.test(A)) {
      let B = /(\d{1,2})(\d{2})/.exec(A);
      return {
        major: 0,
        minor: parseInt(B[1], 10),
        patch: parseInt(B[2], 10)
      }
    }
    let Q = (A || "").split(".").map((B) => parseInt(B, 10));
    return {
      major: Q[0],
      minor: Q[1],
      patch: Q[2]
    }
  }

  function ju1(A) {
    let {
      env: Q
    } = process;
    if ("FORCE_HYPERLINK" in Q) return !(Q.FORCE_HYPERLINK.length > 0 && parseInt(Q.FORCE_HYPERLINK, 10) === 0);
    if (b7A("no-hyperlink") || b7A("no-hyperlinks") || b7A("hyperlink=false") || b7A("hyperlink=never")) return !1;
    if (b7A("hyperlink=true") || b7A("hyperlink=always")) return !0;
    if ("NETLIFY" in Q) return !0;
    if (!OH6.supportsColor(A)) return !1;
    if (A && !A.isTTY) return !1;
    if (process.platform === "win32") return !1;
    if ("CI" in Q) return !1;
    if ("TEAMCITY_VERSION" in Q) return !1;
    if ("TERM_PROGRAM" in Q) {
      let B = cqB(Q.TERM_PROGRAM_VERSION);
      switch (Q.TERM_PROGRAM) {
        case "iTerm.app":
          if (B.major === 3) return B.minor >= 1;
          return B.major > 3;
        case "WezTerm":
          return B.major >= 20200620;
        case "vscode":
          return B.major > 1 || B.major === 1 && B.minor >= 72
      }
    }
    if ("VTE_VERSION" in Q) {
      if (Q.VTE_VERSION === "0.50.0") return !1;
      let B = cqB(Q.VTE_VERSION);
      return B.major > 0 || B.minor >= 50
    }
    return !1
  }
  pqB.exports = {
    supportsHyperlink: ju1,
    stdout: ju1(process.stdout),
    stderr: ju1(process.stderr)
  }
})
// @from(Start 6437136, End 6437332)
function EsA() {
  if (iqB.default.stdout) return !0;
  let A = process.env.TERM_PROGRAM;
  if (A && RH6.includes(A)) return !0;
  if (process.env.TERM?.includes("kitty")) return !0;
  return !1
}
// @from(Start 6437337, End 6437340)
iqB
// @from(Start 6437342, End 6437345)
RH6
// @from(Start 6437351, End 6437440)
Su1 = L(() => {
  iqB = BA(lqB(), 1), RH6 = ["ghostty", "Hyper", "kitty", "alacritty"]
})
// @from(Start 6437443, End 6437691)
function h4({
  children: A,
  url: Q,
  fallback: B
}) {
  let G = A ?? Q;
  if (EsA()) return zsA.default.createElement(lt, null, zsA.default.createElement("ink-link", {
    href: Q
  }, G));
  return zsA.default.createElement(lt, null, B ?? G)
}
// @from(Start 6437696, End 6437699)
zsA
// @from(Start 6437705, End 6437761)
nqB = L(() => {
  Su1();
  aaA();
  zsA = BA(VA(), 1)
})
// @from(Start 6437764, End 6437867)
function bF({
  count: A = 1
}) {
  return aqB.default.createElement("ink-text", null, `
`.repeat(A))
}
// @from(Start 6437872, End 6437875)
aqB
// @from(Start 6437881, End 6437919)
sqB = L(() => {
  aqB = BA(VA(), 1)
})
// @from(Start 6437925, End 6437928)
TH6
// @from(Start 6437934, End 6437981)
rqB = L(() => {
  rUA();
  TH6 = BA(VA(), 1)
})
// @from(Start 6437984, End 6438123)
function UsA({
  state: A,
  percentage: Q
}) {
  return oqB.default.createElement("ink-progress", {
    state: A,
    percentage: Q
  })
}
// @from(Start 6438128, End 6438131)
oqB
// @from(Start 6438137, End 6438175)
tqB = L(() => {
  oqB = BA(VA(), 1)
})
// @from(Start 6438181, End 6438184)
eqB
// @from(Start 6438186, End 6438217)
PH6 = () => eqB.useContext(caA)
// @from(Start 6438221, End 6438223)
Yp
// @from(Start 6438229, End 6438286)
$sA = L(() => {
  ng1();
  eqB = BA(VA(), 1), Yp = PH6
})
// @from(Start 6438292, End 6438295)
_u1
// @from(Start 6438297, End 6438957)
jH6 = (A, Q = {}) => {
    let {
      stdin: B,
      setRawMode: G,
      internal_exitOnCtrlC: Z,
      internal_eventEmitter: I
    } = Yp();
    _u1.useEffect(() => {
      if (Q.isActive === !1) return;
      return G(!0), () => {
        G(!1)
      }
    }, [Q.isActive, G]), _u1.useEffect(() => {
      if (Q.isActive === !1) return;
      let Y = (J) => {
        let {
          input: W,
          key: X
        } = J;
        if (!(W === "c" && X.ctrl) || !Z) Ap.batchedUpdates(() => {
          A(W, X, J)
        })
      };
      return I?.on("input", Y), () => {
        I?.removeListener("input", Y)
      }
    }, [Q.isActive, B, Z, A])
  }
// @from(Start 6438961, End 6438963)
f1
// @from(Start 6438969, End 6439035)
ANB = L(() => {
  $g1();
  $sA();
  _u1 = BA(VA(), 1), f1 = jH6
})
// @from(Start 6439041, End 6439044)
QNB
// @from(Start 6439046, End 6439077)
SH6 = () => QNB.useContext(daA)
// @from(Start 6439081, End 6439084)
ku1
// @from(Start 6439090, End 6439148)
BNB = L(() => {
  ig1();
  QNB = BA(VA(), 1), ku1 = SH6
})
// @from(Start 6439154, End 6439157)
yu1
// @from(Start 6439163, End 6439219)
GNB = L(() => {
  laA();
  $sA();
  yu1 = BA(VA(), 1)
})
// @from(Start 6439225, End 6439228)
_H6
// @from(Start 6439234, End 6439281)
ZNB = L(() => {
  laA();
  _H6 = BA(VA(), 1)
})
// @from(Start 6439287, End 6439404)
kH6 = (A) => ({
    width: A.yogaNode?.getComputedWidth() ?? 0,
    height: A.yogaNode?.getComputedHeight() ?? 0
  })
// @from(Start 6439408, End 6439411)
xu1
// @from(Start 6439417, End 6439447)
INB = L(() => {
  xu1 = kH6
})
// @from(Start 6439453, End 6439456)
f7A
// @from(Start 6439462, End 6439509)
YNB = L(() => {
  QsA();
  f7A = BA(VA(), 1)
})
// @from(Start 6439515, End 6439738)
hA = L(() => {
  vqB();
  rUA();
  fqB();
  aaA();
  saA();
  gqB();
  nqB();
  sqB();
  rqB();
  tqB();
  ANB();
  BNB();
  $sA();
  GNB();
  ZNB();
  INB();
  Ru1();
  oUA();
  iUA();
  FaA();
  Ju1();
  maA();
  YNB()
})
// @from(Start 6439741, End 6440259)
function Bf(A, Q, B) {
  let G = Jp.useRef(0),
    Z = Jp.useRef(void 0),
    I = Jp.useCallback(() => {
      if (Z.current) clearTimeout(Z.current), Z.current = void 0
    }, []);
  return Jp.useEffect(() => {
    return () => {
      I()
    }
  }, [I]), Jp.useCallback(() => {
    let Y = Date.now();
    if (Y - G.current <= JNB && Z.current !== void 0) I(), A(!1), Q();
    else B?.(), A(!0), I(), Z.current = setTimeout(() => {
      A(!1), Z.current = void 0
    }, JNB);
    G.current = Y
  }, [A, Q, B, I])
}
// @from(Start 6440264, End 6440266)
Jp
// @from(Start 6440268, End 6440277)
JNB = 800
// @from(Start 6440283, End 6440320)
wsA = L(() => {
  Jp = BA(VA(), 1)
})
// @from(Start 6440326, End 6442133)
DNB = z((Xs7, KNB) => {
  var FNB = UA("child_process"),
    WNB = FNB.spawn,
    yH6 = FNB.exec;
  KNB.exports = function(A, Q, B) {
    if (typeof Q === "function" && B === void 0) B = Q, Q = void 0;
    if (A = parseInt(A), Number.isNaN(A))
      if (B) return B(Error("pid must be a number"));
      else throw Error("pid must be a number");
    var G = {},
      Z = {};
    switch (G[A] = [], Z[A] = 1, process.platform) {
      case "win32":
        yH6("taskkill /pid " + A + " /T /F", B);
        break;
      case "darwin":
        vu1(A, G, Z, function(I) {
          return WNB("pgrep", ["-P", I])
        }, function() {
          XNB(G, Q, B)
        });
        break;
      default:
        vu1(A, G, Z, function(I) {
          return WNB("ps", ["-o", "pid", "--no-headers", "--ppid", I])
        }, function() {
          XNB(G, Q, B)
        });
        break
    }
  };

  function XNB(A, Q, B) {
    var G = {};
    try {
      Object.keys(A).forEach(function(Z) {
        if (A[Z].forEach(function(I) {
            if (!G[I]) VNB(I, Q), G[I] = 1
          }), !G[Z]) VNB(Z, Q), G[Z] = 1
      })
    } catch (Z) {
      if (B) return B(Z);
      else throw Z
    }
    if (B) return B()
  }

  function VNB(A, Q) {
    try {
      process.kill(parseInt(A, 10), Q)
    } catch (B) {
      if (B.code !== "ESRCH") throw B
    }
  }

  function vu1(A, Q, B, G, Z) {
    var I = G(A),
      Y = "";
    I.stdout.on("data", function(X) {
      var X = X.toString("ascii");
      Y += X
    });
    var J = function(W) {
      if (delete B[A], W != 0) {
        if (Object.keys(B).length == 0) Z();
        return
      }
      Y.match(/\d+/g).forEach(function(X) {
        X = parseInt(X, 10), Q[A].push(X), Q[X] = [], B[X] = 1, vu1(X, Q, B, G, Z)
      })
    };
    I.on("close", J)
  }
})
// @from(Start 6442135, End 6443053)
class K$A {
  capacity;
  buffer;
  head = 0;
  size = 0;
  constructor(A) {
    this.capacity = A;
    this.buffer = Array(A)
  }
  add(A) {
    if (this.buffer[this.head] = A, this.head = (this.head + 1) % this.capacity, this.size < this.capacity) this.size++
  }
  addAll(A) {
    for (let Q of A) this.add(Q)
  }
  getRecent(A) {
    let Q = [],
      B = this.size < this.capacity ? 0 : this.head,
      G = Math.min(A, this.size);
    for (let Z = 0; Z < G; Z++) {
      let I = (B + this.size - G + Z) % this.capacity;
      Q.push(this.buffer[I])
    }
    return Q
  }
  toArray() {
    if (this.size === 0) return [];
    let A = [],
      Q = this.size < this.capacity ? 0 : this.head;
    for (let B = 0; B < this.size; B++) {
      let G = (Q + B) % this.capacity;
      A.push(this.buffer[G])
    }
    return A
  }
  clear() {
    this.head = 0, this.size = 0
  }
  length() {
    return this.size
  }
}
// @from(Start 6443055, End 6443400)
function bu1(A, Q = ",", B = 67108736) {
  let Z = "";
  for (let I of A) {
    let Y = Z ? Q : "",
      J = Y + I;
    if (Z.length + J.length <= B) Z += J;
    else {
      let W = B - Z.length - Y.length - 14;
      if (W > 0) Z += Y + I.slice(0, W) + "...[truncated]";
      else Z += "...[truncated]";
      return Z
    }
  }
  return Z
}
// @from(Start 6443401, End 6444410)
class h7A {
  maxSize;
  content = "";
  isTruncated = !1;
  totalBytesReceived = 0;
  constructor(A = 67108736) {
    this.maxSize = A
  }
  append(A) {
    let Q = typeof A === "string" ? A : A.toString();
    if (this.totalBytesReceived += Q.length, this.isTruncated && this.content.length >= this.maxSize) return;
    if (this.content.length + Q.length > this.maxSize) {
      let B = this.maxSize - this.content.length;
      if (B > 0) this.content += Q.slice(0, B);
      this.isTruncated = !0
    } else this.content += Q
  }
  toString() {
    if (!this.isTruncated) return this.content;
    let A = this.totalBytesReceived - this.maxSize,
      Q = Math.round(A / 1024);
    return this.content + `
... [output truncated - ${Q}KB removed]`
  }
  clear() {
    this.content = "", this.isTruncated = !1, this.totalBytesReceived = 0
  }
  get length() {
    return this.content.length
  }
  get truncated() {
    return this.isTruncated
  }
  get totalBytes() {
    return this.totalBytesReceived
  }
}
// @from(Start 6444412, End 6444591)
function HNB(A, Q) {
  if (A.length <= Q) return A;
  let B = A.length - Q,
    Z = `

... [tool result truncated - ${Math.round(B/1024)}KB removed]`;
  return A.slice(0, Q) + Z
}
// @from(Start 6444640, End 6444942)
function zNB(A) {
  let Q = null,
    B = new h7A;
  A.on("data", (Z) => {
    if (Q) Q.write(Z);
    else B.append(Z)
  });
  let G = () => B.toString();
  return {
    get: G,
    asStream() {
      return Q = new xH6({
        highWaterMark: 10485760
      }), Q.write(G()), B.clear(), Q
    }
  }
}
// @from(Start 6444944, End 6446818)
function qsA(A, Q, B, G, Z = !1) {
  let I = "running",
    Y, J = zNB(A.stdout),
    W = zNB(A.stderr);
  if (G) {
    let E = new K$A(1000),
      U = 0,
      q = (w) => {
        let R = w.toString().split(`
`).filter((y) => y.trim());
        E.addAll(R), U += R.length;
        let T = E.getRecent(5);
        if (T.length > 0) G(bu1(T, `
`), bu1(E.getRecent(100), `
`), U)
      };
    A.stdout.on("data", q), A.stderr.on("data", q)
  }
  let X = (E) => {
      if (I = "killed", A.pid) UNB.default(A.pid, "SIGKILL")
    },
    V = null,
    F, K, D = (E) => {
      if (I === "running") return Y = E, I = "backgrounded", F(), {
        stdoutStream: J.asStream(),
        stderrStream: W.asStream()
      };
      return null
    },
    H = new Promise((E) => {
      let U = () => X();
      F = () => {
        if (V) clearTimeout(V), V = null;
        Q.removeEventListener("abort", U)
      }, Q.addEventListener("abort", U, {
        once: !0
      }), new Promise((q) => {
        let w = X;
        X = (N) => {
          w(), q(N || CNB)
        }, V = setTimeout(() => {
          if (Z && K) K(D);
          else X(ENB)
        }, B), A.on("close", (N, R) => {
          q(N !== null && N !== void 0 ? N : R === "SIGTERM" ? 144 : 1)
        }), A.on("error", () => q(1))
      }).then((q) => {
        if (F(), I === "running" || I === "backgrounded") I = "completed";
        let w = {
          code: q,
          stdout: J.get(),
          stderr: W.get(),
          interrupted: q === CNB,
          backgroundTaskId: Y
        };
        if (q === ENB) w.stderr = [`Command timed out after ${eC(B)}`, w.stderr].filter(Boolean).join(" ");
        E(w)
      })
    }),
    C = {
      get status() {
        return I
      },
      background: D,
      kill: () => X(),
      result: H
    };
  if (Z) C.onTimeout = (E) => {
    K = E
  };
  return C
}
// @from(Start 6446820, End 6447121)
function $NB(A) {
  return {
    get status() {
      return "killed"
    },
    background: () => null,
    kill: () => {},
    result: Promise.resolve({
      code: 145,
      stdout: "",
      stderr: "Command aborted before execution",
      interrupted: !0,
      backgroundTaskId: A
    })
  }
}
// @from(Start 6447126, End 6447129)
UNB
// @from(Start 6447131, End 6447140)
CNB = 137
// @from(Start 6447144, End 6447153)
ENB = 143
// @from(Start 6447159, End 6447198)
fu1 = L(() => {
  UNB = BA(DNB(), 1)
})
// @from(Start 6447201, End 6447410)
function NsA(A, Q) {
  let B = A.lastIndexOf(" -");
  if (B > 0) {
    let G = A.substring(0, B),
      Z = A.substring(B + 1);
    return `${z8([G])} ${Z} ${z8([Q])}`
  } else return `${z8([A])} ${z8([Q])}`
}
// @from(Start 6447415, End 6447440)
hu1 = L(() => {
  dK()
})
// @from(Start 6447598, End 6447702)
function NNB() {
  let A = gu1(MQ(), "session-env", e1());
  return vH6(A, {
    recursive: !0
  }), A
}
// @from(Start 6447704, End 6447759)
function LsA(A) {
  return gu1(NNB(), `hook-${A}.sh`)
}
// @from(Start 6447761, End 6447838)
function LNB() {
  g("Invalidating session environment cache"), Wp = void 0
}
// @from(Start 6447840, End 6449086)
function MNB() {
  if (dQ() === "windows") return g("Session environment not yet supported on Windows"), null;
  if (Wp !== void 0) return Wp;
  let A = [],
    Q = process.env.CLAUDE_ENV_FILE;
  if (Q && qNB(Q)) try {
    let G = wNB(Q, "utf8").trim();
    if (G) A.push(G), g(`Session environment loaded from CLAUDE_ENV_FILE: ${Q} (${G.length} chars)`)
  } catch (G) {
    g(`Failed to read CLAUDE_ENV_FILE: ${G instanceof Error?G.message:String(G)}`)
  }
  let B = NNB();
  if (qNB(B)) try {
    let Z = bH6(B).filter((I) => I.startsWith("hook-") && I.endsWith(".sh")).sort((I, Y) => {
      let J = parseInt(I.match(/hook-(\d+)\.sh/)?.[1] || "0", 10),
        W = parseInt(Y.match(/hook-(\d+)\.sh/)?.[1] || "0", 10);
      return J - W
    });
    for (let I of Z) {
      let Y = gu1(B, I),
        J = wNB(Y, "utf8").trim();
      if (J) A.push(J)
    }
    if (Z.length > 0) g(`Session environment loaded from ${Z.length} hook file(s)`)
  } catch (G) {
    g(`Failed to load session environment from hooks: ${G instanceof Error?G.message:String(G)}`)
  }
  if (A.length === 0) return g("No session environment scripts found"), Wp = null, Wp;
  return Wp = A.join(`
`), g(`Session environment script ready (${Wp.length} chars total)`), Wp
}
// @from(Start 6449091, End 6449102)
Wp = void 0
// @from(Start 6449108, End 6449157)
D$A = L(() => {
  V0();
  Q3();
  hQ();
  _0()
})
// @from(Start 6449160, End 6449894)
function Xp({
  isFocused: A,
  isSelected: Q,
  children: B,
  description: G,
  shouldShowDownArrow: Z,
  shouldShowUpArrow: I
}) {
  return v_.default.createElement(S, {
    flexDirection: "column"
  }, v_.default.createElement(S, {
    flexDirection: "row",
    gap: 1
  }, A ? v_.default.createElement($, {
    color: "suggestion"
  }, H1.pointer) : Z ? v_.default.createElement($, {
    dimColor: !0
  }, H1.arrowDown) : I ? v_.default.createElement($, {
    dimColor: !0
  }, H1.arrowUp) : v_.default.createElement($, null, " "), B, Q && v_.default.createElement($, {
    color: "success"
  }, H1.tick)), G && v_.default.createElement(S, {
    paddingLeft: 5
  }, v_.default.createElement($, {
    color: "inactive"
  }, G)))
}
// @from(Start 6449899, End 6449901)
v_
// @from(Start 6449907, End 6449960)
MsA = L(() => {
  V9();
  hA();
  v_ = BA(VA(), 1)
})
// @from(Start 6449966, End 6449969)
OsA
// @from(Start 6449975, End 6450473)
ONB = L(() => {
  OsA = class OsA extends Map {
    first;
    last;
    constructor(A) {
      let Q = [],
        B, G, Z, I = 0;
      for (let Y of A) {
        let J = {
          label: Y.label,
          value: Y.value,
          description: Y.description,
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
// @from(Start 6450532, End 6452459)
function RsA({
  visibleOptionCount: A = 5,
  options: Q,
  initialFocusValue: B,
  onFocus: G,
  focusValue: Z
}) {
  let [I, Y] = uH.useReducer(hH6, {
    visibleOptionCount: A,
    options: Q,
    initialFocusValue: Z || B
  }, RNB), [J, W] = uH.useState(Q);
  if (Q !== J && !fH6(Q, J)) Y({
    type: "reset",
    state: RNB({
      visibleOptionCount: A,
      options: Q,
      initialFocusValue: Z ?? I.focusedValue ?? B,
      currentViewport: {
        visibleFromIndex: I.visibleFromIndex,
        visibleToIndex: I.visibleToIndex
      }
    })
  }), W(Q);
  let X = uH.useCallback(() => {
      Y({
        type: "focus-next-option"
      })
    }, []),
    V = uH.useCallback(() => {
      Y({
        type: "focus-previous-option"
      })
    }, []),
    F = uH.useCallback(() => {
      Y({
        type: "focus-next-page"
      })
    }, []),
    K = uH.useCallback(() => {
      Y({
        type: "focus-previous-page"
      })
    }, []),
    D = uH.useCallback((E) => {
      if (E !== void 0) Y({
        type: "set-focus",
        value: E
      })
    }, []),
    H = uH.useMemo(() => {
      return Q.map((E, U) => ({
        ...E,
        index: U
      })).slice(I.visibleFromIndex, I.visibleToIndex)
    }, [Q, I.visibleFromIndex, I.visibleToIndex]);
  uH.useEffect(() => {
    if (I.focusedValue !== void 0) G?.(I.focusedValue)
  }, [I.focusedValue, G]), uH.useEffect(() => {
    if (Z !== void 0) Y({
      type: "set-focus",
      value: Z
    })
  }, [Z]);
  let C = uH.useMemo(() => {
    return Q.find((U) => U.value === I.focusedValue)?.type === "input"
  }, [I.focusedValue, Q]);
  return {
    focusedValue: I.focusedValue,
    visibleFromIndex: I.visibleFromIndex,
    visibleToIndex: I.visibleToIndex,
    visibleOptions: H,
    isInInput: C ?? !1,
    focusNextOption: X,
    focusPreviousOption: V,
    focusNextPage: F,
    focusPreviousPage: K,
    focusOption: D,
    options: Q
  }
}
// @from(Start 6452464, End 6452466)
uH
// @from(Start 6452468, End 6456098)
hH6 = (A, Q) => {
    switch (Q.type) {
      case "focus-next-option": {
        if (A.focusedValue === void 0) return A;
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
        if (A.focusedValue === void 0) return A;
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
      case "focus-next-page": {
        if (A.focusedValue === void 0) return A;
        let B = A.optionMap.get(A.focusedValue);
        if (!B) return A;
        let G = Math.min(A.optionMap.size - 1, B.index + A.visibleOptionCount),
          Z = A.optionMap.first;
        while (Z && Z.index < G)
          if (Z.next) Z = Z.next;
          else break;
        if (!Z) return A;
        let I = Math.min(A.optionMap.size, Z.index + 1),
          Y = Math.max(0, I - A.visibleOptionCount);
        return {
          ...A,
          focusedValue: Z.value,
          visibleFromIndex: Y,
          visibleToIndex: I
        }
      }
      case "focus-previous-page": {
        if (A.focusedValue === void 0) return A;
        let B = A.optionMap.get(A.focusedValue);
        if (!B) return A;
        let G = Math.max(0, B.index - A.visibleOptionCount),
          Z = A.optionMap.first;
        while (Z && Z.index < G)
          if (Z.next) Z = Z.next;
          else break;
        if (!Z) return A;
        let I = Math.max(0, Z.index),
          Y = Math.min(A.optionMap.size, I + A.visibleOptionCount);
        return {
          ...A,
          focusedValue: Z.value,
          visibleFromIndex: I,
          visibleToIndex: Y
        }
      }
      case "reset":
        return Q.state;
      case "set-focus": {
        let B = A.optionMap.get(Q.value);
        if (!B) return A;
        if (B.index >= A.visibleFromIndex && B.index < A.visibleToIndex) return {
          ...A,
          focusedValue: Q.value
        };
        let G, Z;
        if (B.index < A.visibleFromIndex) G = B.index, Z = Math.min(A.optionMap.size, G + A.visibleOptionCount);
        else Z = Math.min(A.optionMap.size, B.index + 1), G = Math.max(0, Z - A.visibleOptionCount);
        return {
          ...A,
          focusedValue: Q.value,
          visibleFromIndex: G,
          visibleToIndex: Z
        }
      }
    }
  }
// @from(Start 6456102, End 6456940)
RNB = ({
    visibleOptionCount: A,
    options: Q,
    initialFocusValue: B,
    currentViewport: G
  }) => {
    let Z = typeof A === "number" ? Math.min(A, Q.length) : Q.length,
      I = new OsA(Q),
      Y = B !== void 0 && I.get(B),
      J = Y ? B : I.first?.value,
      W = 0,
      X = Z;
    if (Y && G) {
      let V = Y.index;
      if (V >= G.visibleFromIndex && V < G.visibleToIndex) W = G.visibleFromIndex, X = Math.min(I.size, G.visibleToIndex);
      else if (V < G.visibleFromIndex) W = V, X = Math.min(I.size, W + Z);
      else X = Math.min(I.size, V + 1), W = Math.max(0, X - Z);
      W = Math.max(0, Math.min(W, I.size - 1)), X = Math.min(I.size, Math.max(Z, X))
    }
    return {
      optionMap: I,
      visibleOptionCount: Z,
      focusedValue: J,
      visibleFromIndex: W,
      visibleToIndex: X
    }
  }
// @from(Start 6456946, End 6456992)
uu1 = L(() => {
  ONB();
  uH = BA(VA(), 1)
})
// @from(Start 6456995, End 6457468)
function TNB({
  visibleOptionCount: A = 5,
  options: Q,
  defaultValue: B,
  onChange: G,
  onCancel: Z,
  onFocus: I,
  focusValue: Y
}) {
  let [J, W] = TsA.useState(B), X = RsA({
    visibleOptionCount: A,
    options: Q,
    initialFocusValue: void 0,
    onFocus: I,
    focusValue: Y
  }), V = TsA.useCallback(() => {
    W(X.focusedValue)
  }, [X.focusedValue]);
  return {
    ...X,
    value: J,
    selectFocusedOption: V,
    onChange: G,
    onCancel: Z
  }
}
// @from(Start 6457473, End 6457476)
TsA
// @from(Start 6457482, End 6457529)
PNB = L(() => {
  uu1();
  TsA = BA(VA(), 1)
})
// @from(Start 6457535, End 6458781)
jNB = ({
  isDisabled: A = !1,
  disableSelection: Q = !1,
  state: B,
  options: G,
  isMultiSelect: Z = !1
}) => {
  f1((I, Y) => {
    let J = G.find((X) => X.value === B.focusedValue);
    if (J?.type === "input") {
      if (!(Y.upArrow || Y.downArrow || Y.escape || Y.ctrl && (I === "n" || I === "p"))) return
    }
    if (Y.downArrow || Y.ctrl && I === "n" || !Y.ctrl && !Y.shift && I === "j") B.focusNextOption();
    if (Y.upArrow || Y.ctrl && I === "p" || !Y.ctrl && !Y.shift && I === "k") B.focusPreviousOption();
    if (Y.pageDown) B.focusNextPage();
    if (Y.pageUp) B.focusPreviousPage();
    if (Q !== !0) {
      if ((Z ? Y.return || I === " " : Y.return) && B.focusedValue !== void 0) {
        if (J?.disabled !== !0) B.selectFocusedOption?.(), B.onChange?.(B.focusedValue)
      }
      if (Q !== "numeric" && /^[0-9]+$/.test(I)) {
        let V = parseInt(I) - 1;
        if (V >= 0 && V < B.options.length) {
          let F = B.options[V];
          if (F.disabled === !0) return;
          if (F.type === "input") {
            B.focusOption(F.value);
            return
          }
          B.onChange?.(F.value);
          return
        }
      }
    }
    if (Y.escape) B.onCancel?.()
  }, {
    isActive: !A
  })
}
// @from(Start 6458787, End 6458812)
SNB = L(() => {
  hA()
})
// @from(Start 6458815, End 6458932)
function SsA(A, Q = !1) {
  if (A.length > 0) {
    if (Q && mu1) PsA = A + PsA;
    else PsA = A;
    mu1 = !0
  }
}
// @from(Start 6458934, End 6458965)
function _NB() {
  return PsA
}
// @from(Start 6458967, End 6458996)
function _sA() {
  mu1 = !1
}
// @from(Start 6458997, End 6467555)
class j7 {
  measuredText;
  selection;
  offset;
  constructor(A, Q = 0, B = 0) {
    this.measuredText = A;
    this.selection = B;
    this.offset = Math.max(0, Math.min(this.text.length, Q))
  }
  static fromText(A, Q, B = 0, G = 0) {
    return new j7(new kNB(A, Q - 1), B, G)
  }
  render(A, Q, B) {
    let {
      line: G,
      column: Z
    } = this.getPosition();
    return this.measuredText.getWrappedText().map((I, Y, J) => {
      let W = I;
      if (Q && Y === J.length - 1) {
        let C = Math.max(0, I.length - 6);
        W = Q.repeat(C) + I.slice(C)
      }
      if (G !== Y) return W.trimEnd();
      let X = this.measuredText.displayWidthToStringIndex(W, Z),
        V = Array.from(du1.segment(W)).map(({
          segment: C,
          index: E
        }) => ({
          segment: C,
          index: E
        })),
        F = "",
        K = A,
        D = "";
      for (let {
          segment: C,
          index: E
        }
        of V) {
        let U = E + C.length;
        if (U <= X) F += C;
        else if (E < X && U > X) K = C;
        else if (E === X) K = C;
        else D += C
      }
      let H = A ? B(K) : K;
      return F + H + D.trimEnd()
    }).join(`
`)
  }
  left() {
    if (this.offset === 0) return this;
    let A = this.measuredText.prevOffset(this.offset);
    return new j7(this.measuredText, A)
  }
  right() {
    if (this.offset >= this.text.length) return this;
    let A = this.measuredText.nextOffset(this.offset);
    return new j7(this.measuredText, Math.min(A, this.text.length))
  }
  up() {
    let {
      line: A,
      column: Q
    } = this.getPosition();
    if (A === 0) return this;
    let B = this.measuredText.getWrappedText()[A - 1];
    if (!B) return this;
    let G = xZ(B);
    if (Q > G) {
      let I = this.getOffset({
        line: A - 1,
        column: G
      });
      return new j7(this.measuredText, I, 0)
    }
    let Z = this.getOffset({
      line: A - 1,
      column: Q
    });
    return new j7(this.measuredText, Z, 0)
  }
  down() {
    let {
      line: A,
      column: Q
    } = this.getPosition();
    if (A >= this.measuredText.lineCount - 1) return this;
    let B = this.measuredText.getWrappedText()[A + 1];
    if (!B) return this;
    let G = xZ(B);
    if (Q > G) {
      let I = this.getOffset({
        line: A + 1,
        column: G
      });
      return new j7(this.measuredText, I, 0)
    }
    let Z = this.getOffset({
      line: A + 1,
      column: Q
    });
    return new j7(this.measuredText, Z, 0)
  }
  startOfLine() {
    let {
      line: A
    } = this.getPosition();
    return new j7(this.measuredText, this.getOffset({
      line: A,
      column: 0
    }), 0)
  }
  firstNonBlankInLine() {
    let {
      line: A
    } = this.getPosition(), B = (this.measuredText.getWrappedText()[A] || "").match(/^\s*\S/), G = B?.index ? B.index + B[0].length - 1 : 0, Z = this.getOffset({
      line: A,
      column: G
    });
    return new j7(this.measuredText, Z, 0)
  }
  endOfLine() {
    let {
      line: A
    } = this.getPosition(), Q = this.measuredText.getLineLength(A), B = this.getOffset({
      line: A,
      column: Q
    });
    return new j7(this.measuredText, B, 0)
  }
  findLogicalLineStart(A = this.offset) {
    let Q = this.text.lastIndexOf(`
`, A - 1);
    return Q === -1 ? 0 : Q + 1
  }
  findLogicalLineEnd(A = this.offset) {
    let Q = this.text.indexOf(`
`, A);
    return Q === -1 ? this.text.length : Q
  }
  getLogicalLineBounds() {
    return {
      start: this.findLogicalLineStart(),
      end: this.findLogicalLineEnd()
    }
  }
  createCursorWithColumn(A, Q, B) {
    let G = Q - A,
      Z = Math.min(B, G);
    return new j7(this.measuredText, A + Z, 0)
  }
  endOfLogicalLine() {
    return new j7(this.measuredText, this.findLogicalLineEnd(), 0)
  }
  startOfLogicalLine() {
    return new j7(this.measuredText, this.findLogicalLineStart(), 0)
  }
  firstNonBlankInLogicalLine() {
    let {
      start: A,
      end: Q
    } = this.getLogicalLineBounds(), G = this.text.slice(A, Q).match(/\S/), Z = A + (G?.index ?? 0);
    return new j7(this.measuredText, Z, 0)
  }
  upLogicalLine() {
    let {
      start: A
    } = this.getLogicalLineBounds();
    if (A === 0) return new j7(this.measuredText, 0, 0);
    let Q = this.offset - A,
      B = A - 1,
      G = this.findLogicalLineStart(B);
    return this.createCursorWithColumn(G, B, Q)
  }
  downLogicalLine() {
    let {
      start: A,
      end: Q
    } = this.getLogicalLineBounds();
    if (Q >= this.text.length) return new j7(this.measuredText, this.text.length, 0);
    let B = this.offset - A,
      G = Q + 1,
      Z = this.findLogicalLineEnd(G);
    return this.createCursorWithColumn(G, Z, B)
  }
  nextWord() {
    let A = this;
    while (A.isOverWordChar() && !A.isAtEnd()) A = A.right();
    while (!A.isOverWordChar() && !A.isAtEnd()) A = A.right();
    return A
  }
  endOfWord() {
    let A = this;
    if (A.isOverWordChar() && (!A.right().isOverWordChar() || A.right().isAtEnd())) return A = A.right(), A.endOfWord();
    if (!A.isOverWordChar()) A = A.nextWord();
    while (A.right().isOverWordChar() && !A.isAtEnd()) A = A.right();
    return A
  }
  prevWord() {
    let A = this;
    if (!A.left().isOverWordChar()) A = A.left();
    while (!A.isOverWordChar() && !A.isAtStart()) A = A.left();
    if (A.isOverWordChar())
      while (A.left().isOverWordChar() && !A.isAtStart()) A = A.left();
    return A
  }
  nextWORD() {
    let A = this;
    while (!A.isOverWhitespace() && !A.isAtEnd()) A = A.right();
    while (A.isOverWhitespace() && !A.isAtEnd()) A = A.right();
    return A
  }
  endOfWORD() {
    let A = this;
    if (!A.isOverWhitespace() && (A.right().isOverWhitespace() || A.right().isAtEnd())) return A = A.right(), A.endOfWORD();
    if (A.isOverWhitespace()) A = A.nextWORD();
    while (!A.right().isOverWhitespace() && !A.isAtEnd()) A = A.right();
    return A
  }
  prevWORD() {
    let A = this;
    if (A.left().isOverWhitespace()) A = A.left();
    while (A.isOverWhitespace() && !A.isAtStart()) A = A.left();
    if (!A.isOverWhitespace())
      while (!A.left().isOverWhitespace() && !A.isAtStart()) A = A.left();
    return A
  }
  modifyText(A, Q = "") {
    let B = this.offset,
      G = A.offset,
      Z = this.text.slice(0, B) + Q + this.text.slice(G);
    return j7.fromText(Z, this.columns, B + Q.normalize("NFC").length)
  }
  insert(A) {
    return this.modifyText(this, A)
  }
  del() {
    if (this.isAtEnd()) return this;
    return this.modifyText(this.right())
  }
  backspace() {
    if (this.isAtStart()) return this;
    return this.left().modifyText(this)
  }
  deleteToLineStart() {
    let A = this.startOfLine(),
      Q = this.text.slice(A.offset, this.offset);
    return {
      cursor: A.modifyText(this),
      killed: Q
    }
  }
  deleteToLineEnd() {
    if (this.text[this.offset] === `
`) return {
      cursor: this.modifyText(this.right()),
      killed: `
`
    };
    let A = this.endOfLine(),
      Q = this.text.slice(this.offset, A.offset);
    return {
      cursor: this.modifyText(A),
      killed: Q
    }
  }
  deleteToLogicalLineEnd() {
    if (this.text[this.offset] === `
`) return this.modifyText(this.right());
    return this.modifyText(this.endOfLogicalLine())
  }
  deleteWordBefore() {
    if (this.isAtStart()) return {
      cursor: this,
      killed: ""
    };
    let A = this.prevWord(),
      Q = this.text.slice(A.offset, this.offset);
    return {
      cursor: A.modifyText(this),
      killed: Q
    }
  }
  deleteWordAfter() {
    if (this.isAtEnd()) return this;
    return this.modifyText(this.nextWord())
  }
  isOverWordChar() {
    let A = this.text[this.offset] ?? "";
    return /\w/.test(A)
  }
  isOverWhitespace() {
    let A = this.text[this.offset] ?? "";
    return /\s/.test(A)
  }
  equals(A) {
    return this.offset === A.offset && this.measuredText === A.measuredText
  }
  isAtStart() {
    return this.offset === 0
  }
  isAtEnd() {
    return this.offset >= this.text.length
  }
  startOfFirstLine() {
    return new j7(this.measuredText, 0, 0)
  }
  startOfLastLine() {
    let A = this.text.lastIndexOf(`
`);
    if (A === -1) return this.startOfLine();
    return new j7(this.measuredText, A + 1, 0)
  }
  get text() {
    return this.measuredText.text
  }
  get columns() {
    return this.measuredText.columns + 1
  }
  getPosition() {
    return this.measuredText.getPositionFromOffset(this.offset)
  }
  getOffset(A) {
    return this.measuredText.getOffsetFromPosition(A)
  }
}
// @from(Start 6467556, End 6467949)
class jsA {
  text;
  startOffset;
  isPrecededByNewline;
  endsWithNewline;
  constructor(A, Q, B, G = !1) {
    this.text = A;
    this.startOffset = Q;
    this.isPrecededByNewline = B;
    this.endsWithNewline = G
  }
  equals(A) {
    return this.text === A.text && this.startOffset === A.startOffset
  }
  get length() {
    return this.text.length + (this.endsWithNewline ? 1 : 0)
  }
}