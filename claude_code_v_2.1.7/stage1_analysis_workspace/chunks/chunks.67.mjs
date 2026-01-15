
// @from(Ln 186464, Col 4)
ywB = w(() => {
  W21();
  _Q0();
  jQ0();
  H21();
  TQ0();
  $wB();
  bQ0();
  c_A();
  fQ0();
  hQ0();
  ba();
  U21();
  JQ0();
  lBA();
  wk();
  p3();
  fQ();
  mQ0();
  PP = c(QA(), 1), xwB = ["iTerm.app", "kitty", "WezTerm", "ghostty"], QK8 = process.platform !== "win32";
  w21 = class w21 extends PP.PureComponent {
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
      error: void 0,
      isTerminalFocused: !0
    };
    rawModeEnabledCount = 0;
    internal_eventEmitter = new va;
    keyParseState = qwB;
    incompleteEscapeTimer = null;
    NORMAL_TIMEOUT = 50;
    PASTE_TIMEOUT = 500;
    isRawModeSupported() {
      return this.props.stdin.isTTY
    }
    render() {
      return PP.default.createElement(l_A.Provider, {
        value: {
          columns: this.props.terminalColumns,
          rows: this.props.terminalRows
        }
      }, PP.default.createElement(AN.Provider, {
        value: this.props.ink2
      }, PP.default.createElement(K21.Provider, {
        value: {
          exit: this.handleExit
        }
      }, PP.default.createElement(xQ0, {
        initialState: this.props.initialTheme,
        onThemeChange: this.props.onThemeChange,
        onThemeSave: this.props.onThemeSave
      }, PP.default.createElement(V21.Provider, {
        value: {
          stdin: this.props.stdin,
          setRawMode: this.handleSetRawMode,
          isRawModeSupported: this.isRawModeSupported(),
          internal_exitOnCtrlC: this.props.exitOnCtrlC,
          internal_eventEmitter: this.internal_eventEmitter
        }
      }, PP.default.createElement(F21.Provider, {
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
      }, PP.default.createElement(E21.Provider, {
        value: {
          isTerminalFocused: this.state.isTerminalFocused
        }
      }, this.state.error ? PP.default.createElement(kQ0, {
        error: this.state.error
      }) : this.props.children)))))))
    }
    componentDidMount() {
      if (this.props.stdout.isTTY && !a1(process.env.CLAUDE_CODE_ACCESSIBILITY)) this.props.stdout.write(i_A)
    }
    componentWillUnmount() {
      if (this.props.stdout.isTTY) this.props.stdout.write(TP);
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
        if (this.rawModeEnabledCount === 0) {
          if (Q.ref(), Q.setRawMode(!0), Q.addListener("readable", this.handleReadable), this.props.stdout.write(jwB), this.props.stdout.write(gQ0), xwB.includes(l0.terminal ?? "")) this.props.stdout.write(mUB)
        }
        this.rawModeEnabledCount++;
        return
      }
      if (--this.rawModeEnabledCount === 0) {
        if (xwB.includes(l0.terminal ?? "")) this.props.stdout.write(uIA);
        this.props.stdout.write(pBA), this.props.stdout.write(QDA), Q.setRawMode(!1), Q.removeListener("readable", this.handleReadable), Q.unref()
      }
    };
    flushIncomplete = () => {
      if (this.incompleteEscapeTimer = null, !this.keyParseState.incomplete) return;
      this.processInput(null)
    };
    processInput = (A) => {
      let [Q, B] = NwB(this.keyParseState, A);
      if (this.keyParseState = B, Q.length > 0) Sa.discreteUpdates(BK8, this, Q, void 0, void 0);
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
      if (A === "\x1A" && QK8) this.handleSuspend();
      if (A === AK8 && this.state.activeFocusId) this.setState({
        activeFocusId: void 0
      });
      if (this.state.isFocusEnabled && this.state.focusables.length > 0) {
        if (A === tW8) this.focusNext();
        if (A === eW8) this.focusPrevious()
      }
    };
    handleExit = (A) => {
      if (this.isRawModeSupported()) this.handleSetRawMode(!1);
      this.props.onExit(A)
    };
    handleTerminalFocus = (A) => {
      PwB(A), this.setState((Q) => {
        if (Q.isTerminalFocused === A) return Q;
        return {
          ...Q,
          isTerminalFocused: A
        }
      })
    };
    handleSuspend = () => {
      if (!this.isRawModeSupported()) return;
      let A = this.rawModeEnabledCount;
      while (this.rawModeEnabledCount > 0) this.handleSetRawMode(!1);
      if (this.props.stdout.isTTY) this.props.stdout.write(TP), this.props.stdout.write(pBA);
      this.internal_eventEmitter.emit("suspend");
      let Q = () => {
        for (let B = 0; B < A; B++)
          if (this.isRawModeSupported()) this.handleSetRawMode(!0);
        if (this.props.stdout.isTTY) {
          if (!a1(process.env.CLAUDE_CODE_ACCESSIBILITY)) this.props.stdout.write(i_A);
          this.props.stdout.write(gQ0)
        }
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
// @from(Ln 186744, Col 0)
function aL(...A) {
  let Q = l0.terminal === "kitty" ? ZK8 : vBA;
  return `${GK8}${A.join(kBA)}${Q}`
}
// @from(Ln 186749, Col 0)
function vwB(A) {
  let Q = A.indexOf(";"),
    B = Q >= 0 ? A.slice(0, Q) : A,
    G = Q >= 0 ? A.slice(Q + 1) : "",
    Z = parseInt(B, 10);
  if (Z === uH.SET_TITLE_AND_ICON) return {
    type: "title",
    action: {
      type: "both",
      title: G
    }
  };
  if (Z === uH.SET_ICON) return {
    type: "title",
    action: {
      type: "iconName",
      name: G
    }
  };
  if (Z === uH.SET_TITLE) return {
    type: "title",
    action: {
      type: "windowTitle",
      title: G
    }
  };
  if (Z === uH.HYPERLINK) {
    let Y = G.split(";"),
      J = Y[0] ?? "",
      X = Y.slice(1).join(";");
    if (X === "") return {
      type: "link",
      action: {
        type: "end"
      }
    };
    let I = {};
    if (J)
      for (let D of J.split(":")) {
        let W = D.indexOf("=");
        if (W >= 0) I[D.slice(0, W)] = D.slice(W + 1)
      }
    return {
      type: "link",
      action: {
        type: "start",
        url: X,
        params: Object.keys(I).length > 0 ? I : void 0
      }
    }
  }
  return {
    type: "unknown",
    sequence: `\x1B]${A}`
  }
}
// @from(Ln 186806, Col 0)
function kwB(A, Q) {
  let B = Q ? Object.entries(Q).map(([G, Z]) => `${G}=${Z}`).join(":") : "";
  return aL(uH.HYPERLINK, B, A)
}
// @from(Ln 186810, Col 4)
GK8
// @from(Ln 186810, Col 9)
ZK8
// @from(Ln 186810, Col 14)
uH
// @from(Ln 186810, Col 18)
MxG
// @from(Ln 186810, Col 23)
BDA
// @from(Ln 186810, Col 28)
GDA
// @from(Ln 186811, Col 4)
L21 = w(() => {
  bBA();
  p3();
  GK8 = yBA + String.fromCharCode(RP.OSC), ZK8 = yBA + "\\";
  uH = {
    SET_TITLE_AND_ICON: 0,
    SET_ICON: 1,
    SET_TITLE: 2,
    SET_COLOR: 4,
    SET_CWD: 7,
    HYPERLINK: 8,
    ITERM2: 9,
    SET_FG_COLOR: 10,
    SET_BG_COLOR: 11,
    SET_CURSOR_COLOR: 12,
    CLIPBOARD: 52,
    KITTY: 99,
    RESET_COLOR: 104,
    RESET_FG_COLOR: 110,
    RESET_BG_COLOR: 111,
    RESET_CURSOR_COLOR: 112,
    SEMANTIC_PROMPT: 133,
    GHOSTTY: 777
  };
  MxG = aL(uH.HYPERLINK, "", ""), BDA = {
    NOTIFY: 0,
    BADGE: 2,
    PROGRESS: 4
  }, GDA = {
    CLEAR: 0,
    SET: 1,
    ERROR: 2,
    INDETERMINATE: 3
  }
})
// @from(Ln 186846, Col 4)
n_A = U((_xG, bwB) => {
  var YK8 = Number.MAX_SAFE_INTEGER || 9007199254740991,
    JK8 = ["major", "premajor", "minor", "preminor", "patch", "prepatch", "prerelease"];
  bwB.exports = {
    MAX_LENGTH: 256,
    MAX_SAFE_COMPONENT_LENGTH: 16,
    MAX_SAFE_BUILD_LENGTH: 250,
    MAX_SAFE_INTEGER: YK8,
    RELEASE_TYPES: JK8,
    SEMVER_SPEC_VERSION: "2.0.0",
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  }
})
// @from(Ln 186860, Col 4)
a_A = U((jxG, fwB) => {
  var XK8 = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...A) => console.error("SEMVER", ...A) : () => {};
  fwB.exports = XK8
})
// @from(Ln 186864, Col 4)
ZDA = U((jk, hwB) => {
  var {
    MAX_SAFE_COMPONENT_LENGTH: dQ0,
    MAX_SAFE_BUILD_LENGTH: IK8,
    MAX_LENGTH: DK8
  } = n_A(), WK8 = a_A();
  jk = hwB.exports = {};
  var KK8 = jk.re = [],
    VK8 = jk.safeRe = [],
    b2 = jk.src = [],
    FK8 = jk.safeSrc = [],
    f2 = jk.t = {},
    HK8 = 0,
    cQ0 = "[a-zA-Z0-9-]",
    EK8 = [
      ["\\s", 1],
      ["\\d", DK8],
      [cQ0, IK8]
    ],
    zK8 = (A) => {
      for (let [Q, B] of EK8) A = A.split(`${Q}*`).join(`${Q}{0,${B}}`).split(`${Q}+`).join(`${Q}{1,${B}}`);
      return A
    },
    $3 = (A, Q, B) => {
      let G = zK8(Q),
        Z = HK8++;
      WK8(A, Z, Q), f2[A] = Z, b2[Z] = Q, FK8[Z] = G, KK8[Z] = new RegExp(Q, B ? "g" : void 0), VK8[Z] = new RegExp(G, B ? "g" : void 0)
    };
  $3("NUMERICIDENTIFIER", "0|[1-9]\\d*");
  $3("NUMERICIDENTIFIERLOOSE", "\\d+");
  $3("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${cQ0}*`);
  $3("MAINVERSION", `(${b2[f2.NUMERICIDENTIFIER]})\\.(${b2[f2.NUMERICIDENTIFIER]})\\.(${b2[f2.NUMERICIDENTIFIER]})`);
  $3("MAINVERSIONLOOSE", `(${b2[f2.NUMERICIDENTIFIERLOOSE]})\\.(${b2[f2.NUMERICIDENTIFIERLOOSE]})\\.(${b2[f2.NUMERICIDENTIFIERLOOSE]})`);
  $3("PRERELEASEIDENTIFIER", `(?:${b2[f2.NONNUMERICIDENTIFIER]}|${b2[f2.NUMERICIDENTIFIER]})`);
  $3("PRERELEASEIDENTIFIERLOOSE", `(?:${b2[f2.NONNUMERICIDENTIFIER]}|${b2[f2.NUMERICIDENTIFIERLOOSE]})`);
  $3("PRERELEASE", `(?:-(${b2[f2.PRERELEASEIDENTIFIER]}(?:\\.${b2[f2.PRERELEASEIDENTIFIER]})*))`);
  $3("PRERELEASELOOSE", `(?:-?(${b2[f2.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${b2[f2.PRERELEASEIDENTIFIERLOOSE]})*))`);
  $3("BUILDIDENTIFIER", `${cQ0}+`);
  $3("BUILD", `(?:\\+(${b2[f2.BUILDIDENTIFIER]}(?:\\.${b2[f2.BUILDIDENTIFIER]})*))`);
  $3("FULLPLAIN", `v?${b2[f2.MAINVERSION]}${b2[f2.PRERELEASE]}?${b2[f2.BUILD]}?`);
  $3("FULL", `^${b2[f2.FULLPLAIN]}$`);
  $3("LOOSEPLAIN", `[v=\\s]*${b2[f2.MAINVERSIONLOOSE]}${b2[f2.PRERELEASELOOSE]}?${b2[f2.BUILD]}?`);
  $3("LOOSE", `^${b2[f2.LOOSEPLAIN]}$`);
  $3("GTLT", "((?:<|>)?=?)");
  $3("XRANGEIDENTIFIERLOOSE", `${b2[f2.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
  $3("XRANGEIDENTIFIER", `${b2[f2.NUMERICIDENTIFIER]}|x|X|\\*`);
  $3("XRANGEPLAIN", `[v=\\s]*(${b2[f2.XRANGEIDENTIFIER]})(?:\\.(${b2[f2.XRANGEIDENTIFIER]})(?:\\.(${b2[f2.XRANGEIDENTIFIER]})(?:${b2[f2.PRERELEASE]})?${b2[f2.BUILD]}?)?)?`);
  $3("XRANGEPLAINLOOSE", `[v=\\s]*(${b2[f2.XRANGEIDENTIFIERLOOSE]})(?:\\.(${b2[f2.XRANGEIDENTIFIERLOOSE]})(?:\\.(${b2[f2.XRANGEIDENTIFIERLOOSE]})(?:${b2[f2.PRERELEASELOOSE]})?${b2[f2.BUILD]}?)?)?`);
  $3("XRANGE", `^${b2[f2.GTLT]}\\s*${b2[f2.XRANGEPLAIN]}$`);
  $3("XRANGELOOSE", `^${b2[f2.GTLT]}\\s*${b2[f2.XRANGEPLAINLOOSE]}$`);
  $3("COERCEPLAIN", `(^|[^\\d])(\\d{1,${dQ0}})(?:\\.(\\d{1,${dQ0}}))?(?:\\.(\\d{1,${dQ0}}))?`);
  $3("COERCE", `${b2[f2.COERCEPLAIN]}(?:$|[^\\d])`);
  $3("COERCEFULL", b2[f2.COERCEPLAIN] + `(?:${b2[f2.PRERELEASE]})?(?:${b2[f2.BUILD]})?(?:$|[^\\d])`);
  $3("COERCERTL", b2[f2.COERCE], !0);
  $3("COERCERTLFULL", b2[f2.COERCEFULL], !0);
  $3("LONETILDE", "(?:~>?)");
  $3("TILDETRIM", `(\\s*)${b2[f2.LONETILDE]}\\s+`, !0);
  jk.tildeTrimReplace = "$1~";
  $3("TILDE", `^${b2[f2.LONETILDE]}${b2[f2.XRANGEPLAIN]}$`);
  $3("TILDELOOSE", `^${b2[f2.LONETILDE]}${b2[f2.XRANGEPLAINLOOSE]}$`);
  $3("LONECARET", "(?:\\^)");
  $3("CARETTRIM", `(\\s*)${b2[f2.LONECARET]}\\s+`, !0);
  jk.caretTrimReplace = "$1^";
  $3("CARET", `^${b2[f2.LONECARET]}${b2[f2.XRANGEPLAIN]}$`);
  $3("CARETLOOSE", `^${b2[f2.LONECARET]}${b2[f2.XRANGEPLAINLOOSE]}$`);
  $3("COMPARATORLOOSE", `^${b2[f2.GTLT]}\\s*(${b2[f2.LOOSEPLAIN]})$|^$`);
  $3("COMPARATOR", `^${b2[f2.GTLT]}\\s*(${b2[f2.FULLPLAIN]})$|^$`);
  $3("COMPARATORTRIM", `(\\s*)${b2[f2.GTLT]}\\s*(${b2[f2.LOOSEPLAIN]}|${b2[f2.XRANGEPLAIN]})`, !0);
  jk.comparatorTrimReplace = "$1$2$3";
  $3("HYPHENRANGE", `^\\s*(${b2[f2.XRANGEPLAIN]})\\s+-\\s+(${b2[f2.XRANGEPLAIN]})\\s*$`);
  $3("HYPHENRANGELOOSE", `^\\s*(${b2[f2.XRANGEPLAINLOOSE]})\\s+-\\s+(${b2[f2.XRANGEPLAINLOOSE]})\\s*$`);
  $3("STAR", "(<|>)?=?\\s*\\*");
  $3("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
  $3("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$")
})
// @from(Ln 186939, Col 4)
O21 = U((TxG, gwB) => {
  var $K8 = Object.freeze({
      loose: !0
    }),
    CK8 = Object.freeze({}),
    UK8 = (A) => {
      if (!A) return CK8;
      if (typeof A !== "object") return $K8;
      return A
    };
  gwB.exports = UK8
})
// @from(Ln 186951, Col 4)
pQ0 = U((PxG, dwB) => {
  var uwB = /^[0-9]+$/,
    mwB = (A, Q) => {
      let B = uwB.test(A),
        G = uwB.test(Q);
      if (B && G) A = +A, Q = +Q;
      return A === Q ? 0 : B && !G ? -1 : G && !B ? 1 : A < Q ? -1 : 1
    },
    qK8 = (A, Q) => mwB(Q, A);
  dwB.exports = {
    compareIdentifiers: mwB,
    rcompareIdentifiers: qK8
  }
})
// @from(Ln 186965, Col 4)
_z = U((SxG, pwB) => {
  var M21 = a_A(),
    {
      MAX_LENGTH: cwB,
      MAX_SAFE_INTEGER: R21
    } = n_A(),
    {
      safeRe: _21,
      t: j21
    } = ZDA(),
    NK8 = O21(),
    {
      compareIdentifiers: YDA
    } = pQ0();
  class SP {
    constructor(A, Q) {
      if (Q = NK8(Q), A instanceof SP)
        if (A.loose === !!Q.loose && A.includePrerelease === !!Q.includePrerelease) return A;
        else A = A.version;
      else if (typeof A !== "string") throw TypeError(`Invalid version. Must be a string. Got type "${typeof A}".`);
      if (A.length > cwB) throw TypeError(`version is longer than ${cwB} characters`);
      M21("SemVer", A, Q), this.options = Q, this.loose = !!Q.loose, this.includePrerelease = !!Q.includePrerelease;
      let B = A.trim().match(Q.loose ? _21[j21.LOOSE] : _21[j21.FULL]);
      if (!B) throw TypeError(`Invalid Version: ${A}`);
      if (this.raw = A, this.major = +B[1], this.minor = +B[2], this.patch = +B[3], this.major > R21 || this.major < 0) throw TypeError("Invalid major version");
      if (this.minor > R21 || this.minor < 0) throw TypeError("Invalid minor version");
      if (this.patch > R21 || this.patch < 0) throw TypeError("Invalid patch version");
      if (!B[4]) this.prerelease = [];
      else this.prerelease = B[4].split(".").map((G) => {
        if (/^[0-9]+$/.test(G)) {
          let Z = +G;
          if (Z >= 0 && Z < R21) return Z
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
      if (M21("SemVer.compare", this.version, this.options, A), !(A instanceof SP)) {
        if (typeof A === "string" && A === this.version) return 0;
        A = new SP(A, this.options)
      }
      if (A.version === this.version) return 0;
      return this.compareMain(A) || this.comparePre(A)
    }
    compareMain(A) {
      if (!(A instanceof SP)) A = new SP(A, this.options);
      return YDA(this.major, A.major) || YDA(this.minor, A.minor) || YDA(this.patch, A.patch)
    }
    comparePre(A) {
      if (!(A instanceof SP)) A = new SP(A, this.options);
      if (this.prerelease.length && !A.prerelease.length) return -1;
      else if (!this.prerelease.length && A.prerelease.length) return 1;
      else if (!this.prerelease.length && !A.prerelease.length) return 0;
      let Q = 0;
      do {
        let B = this.prerelease[Q],
          G = A.prerelease[Q];
        if (M21("prerelease compare", Q, B, G), B === void 0 && G === void 0) return 0;
        else if (G === void 0) return 1;
        else if (B === void 0) return -1;
        else if (B === G) continue;
        else return YDA(B, G)
      } while (++Q)
    }
    compareBuild(A) {
      if (!(A instanceof SP)) A = new SP(A, this.options);
      let Q = 0;
      do {
        let B = this.build[Q],
          G = A.build[Q];
        if (M21("build compare", Q, B, G), B === void 0 && G === void 0) return 0;
        else if (G === void 0) return 1;
        else if (B === void 0) return -1;
        else if (B === G) continue;
        else return YDA(B, G)
      } while (++Q)
    }
    inc(A, Q, B) {
      if (A.startsWith("pre")) {
        if (!Q && B === !1) throw Error("invalid increment argument: identifier is empty");
        if (Q) {
          let G = `-${Q}`.match(this.options.loose ? _21[j21.PRERELEASELOOSE] : _21[j21.PRERELEASE]);
          if (!G || G[1] !== Q) throw Error(`invalid identifier: ${Q}`)
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
            if (YDA(this.prerelease[0], Q) === 0) {
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
  pwB.exports = SP
})
// @from(Ln 187118, Col 4)
iBA = U((xxG, iwB) => {
  var lwB = _z(),
    wK8 = (A, Q, B = !1) => {
      if (A instanceof lwB) return A;
      try {
        return new lwB(A, Q)
      } catch (G) {
        if (!B) return null;
        throw G
      }
    };
  iwB.exports = wK8
})
// @from(Ln 187131, Col 4)
awB = U((yxG, nwB) => {
  var LK8 = iBA(),
    OK8 = (A, Q) => {
      let B = LK8(A, Q);
      return B ? B.version : null
    };
  nwB.exports = OK8
})
// @from(Ln 187139, Col 4)
rwB = U((vxG, owB) => {
  var MK8 = iBA(),
    RK8 = (A, Q) => {
      let B = MK8(A.trim().replace(/^[=v]+/, ""), Q);
      return B ? B.version : null
    };
  owB.exports = RK8
})
// @from(Ln 187147, Col 4)
ewB = U((kxG, twB) => {
  var swB = _z(),
    _K8 = (A, Q, B, G, Z) => {
      if (typeof B === "string") Z = G, G = B, B = void 0;
      try {
        return new swB(A instanceof swB ? A.version : A, B).inc(Q, G, Z).version
      } catch (Y) {
        return null
      }
    };
  twB.exports = _K8
})
// @from(Ln 187159, Col 4)
BLB = U((bxG, QLB) => {
  var ALB = iBA(),
    jK8 = (A, Q) => {
      let B = ALB(A, null, !0),
        G = ALB(Q, null, !0),
        Z = B.compare(G);
      if (Z === 0) return null;
      let Y = Z > 0,
        J = Y ? B : G,
        X = Y ? G : B,
        I = !!J.prerelease.length;
      if (!!X.prerelease.length && !I) {
        if (!X.patch && !X.minor) return "major";
        if (X.compareMain(J) === 0) {
          if (X.minor && !X.patch) return "minor";
          return "patch"
        }
      }
      let W = I ? "pre" : "";
      if (B.major !== G.major) return W + "major";
      if (B.minor !== G.minor) return W + "minor";
      if (B.patch !== G.patch) return W + "patch";
      return "prerelease"
    };
  QLB.exports = jK8
})
// @from(Ln 187185, Col 4)
ZLB = U((fxG, GLB) => {
  var TK8 = _z(),
    PK8 = (A, Q) => new TK8(A, Q).major;
  GLB.exports = PK8
})
// @from(Ln 187190, Col 4)
JLB = U((hxG, YLB) => {
  var SK8 = _z(),
    xK8 = (A, Q) => new SK8(A, Q).minor;
  YLB.exports = xK8
})
// @from(Ln 187195, Col 4)
ILB = U((gxG, XLB) => {
  var yK8 = _z(),
    vK8 = (A, Q) => new yK8(A, Q).patch;
  XLB.exports = vK8
})
// @from(Ln 187200, Col 4)
WLB = U((uxG, DLB) => {
  var kK8 = iBA(),
    bK8 = (A, Q) => {
      let B = kK8(A, Q);
      return B && B.prerelease.length ? B.prerelease : null
    };
  DLB.exports = bK8
})
// @from(Ln 187208, Col 4)
tR = U((mxG, VLB) => {
  var KLB = _z(),
    fK8 = (A, Q, B) => new KLB(A, B).compare(new KLB(Q, B));
  VLB.exports = fK8
})
// @from(Ln 187213, Col 4)
HLB = U((dxG, FLB) => {
  var hK8 = tR(),
    gK8 = (A, Q, B) => hK8(Q, A, B);
  FLB.exports = gK8
})
// @from(Ln 187218, Col 4)
zLB = U((cxG, ELB) => {
  var uK8 = tR(),
    mK8 = (A, Q) => uK8(A, Q, !0);
  ELB.exports = mK8
})
// @from(Ln 187223, Col 4)
T21 = U((pxG, CLB) => {
  var $LB = _z(),
    dK8 = (A, Q, B) => {
      let G = new $LB(A, B),
        Z = new $LB(Q, B);
      return G.compare(Z) || G.compareBuild(Z)
    };
  CLB.exports = dK8
})
// @from(Ln 187232, Col 4)
qLB = U((lxG, ULB) => {
  var cK8 = T21(),
    pK8 = (A, Q) => A.sort((B, G) => cK8(B, G, Q));
  ULB.exports = pK8
})
// @from(Ln 187237, Col 4)
wLB = U((ixG, NLB) => {
  var lK8 = T21(),
    iK8 = (A, Q) => A.sort((B, G) => lK8(G, B, Q));
  NLB.exports = iK8
})
// @from(Ln 187242, Col 4)
o_A = U((nxG, LLB) => {
  var nK8 = tR(),
    aK8 = (A, Q, B) => nK8(A, Q, B) > 0;
  LLB.exports = aK8
})
// @from(Ln 187247, Col 4)
P21 = U((axG, OLB) => {
  var oK8 = tR(),
    rK8 = (A, Q, B) => oK8(A, Q, B) < 0;
  OLB.exports = rK8
})
// @from(Ln 187252, Col 4)
lQ0 = U((oxG, MLB) => {
  var sK8 = tR(),
    tK8 = (A, Q, B) => sK8(A, Q, B) === 0;
  MLB.exports = tK8
})
// @from(Ln 187257, Col 4)
iQ0 = U((rxG, RLB) => {
  var eK8 = tR(),
    AV8 = (A, Q, B) => eK8(A, Q, B) !== 0;
  RLB.exports = AV8
})
// @from(Ln 187262, Col 4)
S21 = U((sxG, _LB) => {
  var QV8 = tR(),
    BV8 = (A, Q, B) => QV8(A, Q, B) >= 0;
  _LB.exports = BV8
})
// @from(Ln 187267, Col 4)
x21 = U((txG, jLB) => {
  var GV8 = tR(),
    ZV8 = (A, Q, B) => GV8(A, Q, B) <= 0;
  jLB.exports = ZV8
})
// @from(Ln 187272, Col 4)
nQ0 = U((exG, TLB) => {
  var YV8 = lQ0(),
    JV8 = iQ0(),
    XV8 = o_A(),
    IV8 = S21(),
    DV8 = P21(),
    WV8 = x21(),
    KV8 = (A, Q, B, G) => {
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
          return YV8(A, B, G);
        case "!=":
          return JV8(A, B, G);
        case ">":
          return XV8(A, B, G);
        case ">=":
          return IV8(A, B, G);
        case "<":
          return DV8(A, B, G);
        case "<=":
          return WV8(A, B, G);
        default:
          throw TypeError(`Invalid operator: ${Q}`)
      }
    };
  TLB.exports = KV8
})
// @from(Ln 187309, Col 4)
SLB = U((AyG, PLB) => {
  var VV8 = _z(),
    FV8 = iBA(),
    {
      safeRe: y21,
      t: v21
    } = ZDA(),
    HV8 = (A, Q) => {
      if (A instanceof VV8) return A;
      if (typeof A === "number") A = String(A);
      if (typeof A !== "string") return null;
      Q = Q || {};
      let B = null;
      if (!Q.rtl) B = A.match(Q.includePrerelease ? y21[v21.COERCEFULL] : y21[v21.COERCE]);
      else {
        let I = Q.includePrerelease ? y21[v21.COERCERTLFULL] : y21[v21.COERCERTL],
          D;
        while ((D = I.exec(A)) && (!B || B.index + B[0].length !== A.length)) {
          if (!B || D.index + D[0].length !== B.index + B[0].length) B = D;
          I.lastIndex = D.index + D[1].length + D[2].length
        }
        I.lastIndex = -1
      }
      if (B === null) return null;
      let G = B[2],
        Z = B[3] || "0",
        Y = B[4] || "0",
        J = Q.includePrerelease && B[5] ? `-${B[5]}` : "",
        X = Q.includePrerelease && B[6] ? `+${B[6]}` : "";
      return FV8(`${G}.${Z}.${Y}${J}${X}`, Q)
    };
  PLB.exports = HV8
})
// @from(Ln 187342, Col 4)
vLB = U((QyG, yLB) => {
  class xLB {
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
  yLB.exports = xLB
})
// @from(Ln 187368, Col 4)
eR = U((ByG, hLB) => {
  var EV8 = /\s+/g;
  class r_A {
    constructor(A, Q) {
      if (Q = $V8(Q), A instanceof r_A)
        if (A.loose === !!Q.loose && A.includePrerelease === !!Q.includePrerelease) return A;
        else return new r_A(A.raw, Q);
      if (A instanceof aQ0) return this.raw = A.value, this.set = [
        [A]
      ], this.formatted = void 0, this;
      if (this.options = Q, this.loose = !!Q.loose, this.includePrerelease = !!Q.includePrerelease, this.raw = A.trim().replace(EV8, " "), this.set = this.raw.split("||").map((B) => this.parseRange(B.trim())).filter((B) => B.length), !this.set.length) throw TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        let B = this.set[0];
        if (this.set = this.set.filter((G) => !bLB(G[0])), this.set.length === 0) this.set = [B];
        else if (this.set.length > 1) {
          for (let G of this.set)
            if (G.length === 1 && OV8(G[0])) {
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
      let B = ((this.options.includePrerelease && wV8) | (this.options.loose && LV8)) + ":" + A,
        G = kLB.get(B);
      if (G) return G;
      let Z = this.options.loose,
        Y = Z ? QN[qC.HYPHENRANGELOOSE] : QN[qC.HYPHENRANGE];
      A = A.replace(Y, vV8(this.options.includePrerelease)), wJ("hyphen replace", A), A = A.replace(QN[qC.COMPARATORTRIM], UV8), wJ("comparator trim", A), A = A.replace(QN[qC.TILDETRIM], qV8), wJ("tilde trim", A), A = A.replace(QN[qC.CARETTRIM], NV8), wJ("caret trim", A);
      let J = A.split(" ").map((W) => MV8(W, this.options)).join(" ").split(/\s+/).map((W) => yV8(W, this.options));
      if (Z) J = J.filter((W) => {
        return wJ("loose invalid filter", W, this.options), !!W.match(QN[qC.COMPARATORLOOSE])
      });
      wJ("range list", J);
      let X = new Map,
        I = J.map((W) => new aQ0(W, this.options));
      for (let W of I) {
        if (bLB(W)) return [W];
        X.set(W.value, W)
      }
      if (X.size > 1 && X.has("")) X.delete("");
      let D = [...X.values()];
      return kLB.set(B, D), D
    }
    intersects(A, Q) {
      if (!(A instanceof r_A)) throw TypeError("a Range is required");
      return this.set.some((B) => {
        return fLB(B, Q) && A.set.some((G) => {
          return fLB(G, Q) && B.every((Z) => {
            return G.every((Y) => {
              return Z.intersects(Y, Q)
            })
          })
        })
      })
    }
    test(A) {
      if (!A) return !1;
      if (typeof A === "string") try {
        A = new CV8(A, this.options)
      } catch (Q) {
        return !1
      }
      for (let Q = 0; Q < this.set.length; Q++)
        if (kV8(this.set[Q], A, this.options)) return !0;
      return !1
    }
  }
  hLB.exports = r_A;
  var zV8 = vLB(),
    kLB = new zV8,
    $V8 = O21(),
    aQ0 = s_A(),
    wJ = a_A(),
    CV8 = _z(),
    {
      safeRe: QN,
      t: qC,
      comparatorTrimReplace: UV8,
      tildeTrimReplace: qV8,
      caretTrimReplace: NV8
    } = ZDA(),
    {
      FLAG_INCLUDE_PRERELEASE: wV8,
      FLAG_LOOSE: LV8
    } = n_A(),
    bLB = (A) => A.value === "<0.0.0-0",
    OV8 = (A) => A.value === "",
    fLB = (A, Q) => {
      let B = !0,
        G = A.slice(),
        Z = G.pop();
      while (B && G.length) B = G.every((Y) => {
        return Z.intersects(Y, Q)
      }), Z = G.pop();
      return B
    },
    MV8 = (A, Q) => {
      return wJ("comp", A, Q), A = jV8(A, Q), wJ("caret", A), A = RV8(A, Q), wJ("tildes", A), A = PV8(A, Q), wJ("xrange", A), A = xV8(A, Q), wJ("stars", A), A
    },
    NC = (A) => !A || A.toLowerCase() === "x" || A === "*",
    RV8 = (A, Q) => {
      return A.trim().split(/\s+/).map((B) => _V8(B, Q)).join(" ")
    },
    _V8 = (A, Q) => {
      let B = Q.loose ? QN[qC.TILDELOOSE] : QN[qC.TILDE];
      return A.replace(B, (G, Z, Y, J, X) => {
        wJ("tilde", A, G, Z, Y, J, X);
        let I;
        if (NC(Z)) I = "";
        else if (NC(Y)) I = `>=${Z}.0.0 <${+Z+1}.0.0-0`;
        else if (NC(J)) I = `>=${Z}.${Y}.0 <${Z}.${+Y+1}.0-0`;
        else if (X) wJ("replaceTilde pr", X), I = `>=${Z}.${Y}.${J}-${X} <${Z}.${+Y+1}.0-0`;
        else I = `>=${Z}.${Y}.${J} <${Z}.${+Y+1}.0-0`;
        return wJ("tilde return", I), I
      })
    },
    jV8 = (A, Q) => {
      return A.trim().split(/\s+/).map((B) => TV8(B, Q)).join(" ")
    },
    TV8 = (A, Q) => {
      wJ("caret", A, Q);
      let B = Q.loose ? QN[qC.CARETLOOSE] : QN[qC.CARET],
        G = Q.includePrerelease ? "-0" : "";
      return A.replace(B, (Z, Y, J, X, I) => {
        wJ("caret", A, Z, Y, J, X, I);
        let D;
        if (NC(Y)) D = "";
        else if (NC(J)) D = `>=${Y}.0.0${G} <${+Y+1}.0.0-0`;
        else if (NC(X))
          if (Y === "0") D = `>=${Y}.${J}.0${G} <${Y}.${+J+1}.0-0`;
          else D = `>=${Y}.${J}.0${G} <${+Y+1}.0.0-0`;
        else if (I)
          if (wJ("replaceCaret pr", I), Y === "0")
            if (J === "0") D = `>=${Y}.${J}.${X}-${I} <${Y}.${J}.${+X+1}-0`;
            else D = `>=${Y}.${J}.${X}-${I} <${Y}.${+J+1}.0-0`;
        else D = `>=${Y}.${J}.${X}-${I} <${+Y+1}.0.0-0`;
        else if (wJ("no pr"), Y === "0")
          if (J === "0") D = `>=${Y}.${J}.${X}${G} <${Y}.${J}.${+X+1}-0`;
          else D = `>=${Y}.${J}.${X}${G} <${Y}.${+J+1}.0-0`;
        else D = `>=${Y}.${J}.${X} <${+Y+1}.0.0-0`;
        return wJ("caret return", D), D
      })
    },
    PV8 = (A, Q) => {
      return wJ("replaceXRanges", A, Q), A.split(/\s+/).map((B) => SV8(B, Q)).join(" ")
    },
    SV8 = (A, Q) => {
      A = A.trim();
      let B = Q.loose ? QN[qC.XRANGELOOSE] : QN[qC.XRANGE];
      return A.replace(B, (G, Z, Y, J, X, I) => {
        wJ("xRange", A, G, Z, Y, J, X, I);
        let D = NC(Y),
          W = D || NC(J),
          K = W || NC(X),
          V = K;
        if (Z === "=" && V) Z = "";
        if (I = Q.includePrerelease ? "-0" : "", D)
          if (Z === ">" || Z === "<") G = "<0.0.0-0";
          else G = "*";
        else if (Z && V) {
          if (W) J = 0;
          if (X = 0, Z === ">")
            if (Z = ">=", W) Y = +Y + 1, J = 0, X = 0;
            else J = +J + 1, X = 0;
          else if (Z === "<=")
            if (Z = "<", W) Y = +Y + 1;
            else J = +J + 1;
          if (Z === "<") I = "-0";
          G = `${Z+Y}.${J}.${X}${I}`
        } else if (W) G = `>=${Y}.0.0${I} <${+Y+1}.0.0-0`;
        else if (K) G = `>=${Y}.${J}.0${I} <${Y}.${+J+1}.0-0`;
        return wJ("xRange return", G), G
      })
    },
    xV8 = (A, Q) => {
      return wJ("replaceStars", A, Q), A.trim().replace(QN[qC.STAR], "")
    },
    yV8 = (A, Q) => {
      return wJ("replaceGTE0", A, Q), A.trim().replace(QN[Q.includePrerelease ? qC.GTE0PRE : qC.GTE0], "")
    },
    vV8 = (A) => (Q, B, G, Z, Y, J, X, I, D, W, K, V) => {
      if (NC(G)) B = "";
      else if (NC(Z)) B = `>=${G}.0.0${A?"-0":""}`;
      else if (NC(Y)) B = `>=${G}.${Z}.0${A?"-0":""}`;
      else if (J) B = `>=${B}`;
      else B = `>=${B}${A?"-0":""}`;
      if (NC(D)) I = "";
      else if (NC(W)) I = `<${+D+1}.0.0-0`;
      else if (NC(K)) I = `<${D}.${+W+1}.0-0`;
      else if (V) I = `<=${D}.${W}.${K}-${V}`;
      else if (A) I = `<${D}.${W}.${+K+1}-0`;
      else I = `<=${I}`;
      return `${B} ${I}`.trim()
    },
    kV8 = (A, Q, B) => {
      for (let G = 0; G < A.length; G++)
        if (!A[G].test(Q)) return !1;
      if (Q.prerelease.length && !B.includePrerelease) {
        for (let G = 0; G < A.length; G++) {
          if (wJ(A[G].semver), A[G].semver === aQ0.ANY) continue;
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
// @from(Ln 187601, Col 4)
s_A = U((GyG, pLB) => {
  var t_A = Symbol("SemVer ANY");
  class k21 {
    static get ANY() {
      return t_A
    }
    constructor(A, Q) {
      if (Q = gLB(Q), A instanceof k21)
        if (A.loose === !!Q.loose) return A;
        else A = A.value;
      if (A = A.trim().split(/\s+/).join(" "), rQ0("comparator", A, Q), this.options = Q, this.loose = !!Q.loose, this.parse(A), this.semver === t_A) this.value = "";
      else this.value = this.operator + this.semver.version;
      rQ0("comp", this)
    }
    parse(A) {
      let Q = this.options.loose ? uLB[mLB.COMPARATORLOOSE] : uLB[mLB.COMPARATOR],
        B = A.match(Q);
      if (!B) throw TypeError(`Invalid comparator: ${A}`);
      if (this.operator = B[1] !== void 0 ? B[1] : "", this.operator === "=") this.operator = "";
      if (!B[2]) this.semver = t_A;
      else this.semver = new dLB(B[2], this.options.loose)
    }
    toString() {
      return this.value
    }
    test(A) {
      if (rQ0("Comparator.test", A, this.options.loose), this.semver === t_A || A === t_A) return !0;
      if (typeof A === "string") try {
        A = new dLB(A, this.options)
      } catch (Q) {
        return !1
      }
      return oQ0(A, this.operator, this.semver, this.options)
    }
    intersects(A, Q) {
      if (!(A instanceof k21)) throw TypeError("a Comparator is required");
      if (this.operator === "") {
        if (this.value === "") return !0;
        return new cLB(A.value, Q).test(this.value)
      } else if (A.operator === "") {
        if (A.value === "") return !0;
        return new cLB(this.value, Q).test(A.semver)
      }
      if (Q = gLB(Q), Q.includePrerelease && (this.value === "<0.0.0-0" || A.value === "<0.0.0-0")) return !1;
      if (!Q.includePrerelease && (this.value.startsWith("<0.0.0") || A.value.startsWith("<0.0.0"))) return !1;
      if (this.operator.startsWith(">") && A.operator.startsWith(">")) return !0;
      if (this.operator.startsWith("<") && A.operator.startsWith("<")) return !0;
      if (this.semver.version === A.semver.version && this.operator.includes("=") && A.operator.includes("=")) return !0;
      if (oQ0(this.semver, "<", A.semver, Q) && this.operator.startsWith(">") && A.operator.startsWith("<")) return !0;
      if (oQ0(this.semver, ">", A.semver, Q) && this.operator.startsWith("<") && A.operator.startsWith(">")) return !0;
      return !1
    }
  }
  pLB.exports = k21;
  var gLB = O21(),
    {
      safeRe: uLB,
      t: mLB
    } = ZDA(),
    oQ0 = nQ0(),
    rQ0 = a_A(),
    dLB = _z(),
    cLB = eR()
})
// @from(Ln 187665, Col 4)
e_A = U((ZyG, lLB) => {
  var bV8 = eR(),
    fV8 = (A, Q, B) => {
      try {
        Q = new bV8(Q, B)
      } catch (G) {
        return !1
      }
      return Q.test(A)
    };
  lLB.exports = fV8
})
// @from(Ln 187677, Col 4)
nLB = U((YyG, iLB) => {
  var hV8 = eR(),
    gV8 = (A, Q) => new hV8(A, Q).set.map((B) => B.map((G) => G.value).join(" ").trim().split(" "));
  iLB.exports = gV8
})
// @from(Ln 187682, Col 4)
oLB = U((JyG, aLB) => {
  var uV8 = _z(),
    mV8 = eR(),
    dV8 = (A, Q, B) => {
      let G = null,
        Z = null,
        Y = null;
      try {
        Y = new mV8(Q, B)
      } catch (J) {
        return null
      }
      return A.forEach((J) => {
        if (Y.test(J)) {
          if (!G || Z.compare(J) === -1) G = J, Z = new uV8(G, B)
        }
      }), G
    };
  aLB.exports = dV8
})
// @from(Ln 187702, Col 4)
sLB = U((XyG, rLB) => {
  var cV8 = _z(),
    pV8 = eR(),
    lV8 = (A, Q, B) => {
      let G = null,
        Z = null,
        Y = null;
      try {
        Y = new pV8(Q, B)
      } catch (J) {
        return null
      }
      return A.forEach((J) => {
        if (Y.test(J)) {
          if (!G || Z.compare(J) === 1) G = J, Z = new cV8(G, B)
        }
      }), G
    };
  rLB.exports = lV8
})
// @from(Ln 187722, Col 4)
AOB = U((IyG, eLB) => {
  var sQ0 = _z(),
    iV8 = eR(),
    tLB = o_A(),
    nV8 = (A, Q) => {
      A = new iV8(A, Q);
      let B = new sQ0("0.0.0");
      if (A.test(B)) return B;
      if (B = new sQ0("0.0.0-0"), A.test(B)) return B;
      B = null;
      for (let G = 0; G < A.set.length; ++G) {
        let Z = A.set[G],
          Y = null;
        if (Z.forEach((J) => {
            let X = new sQ0(J.semver.version);
            switch (J.operator) {
              case ">":
                if (X.prerelease.length === 0) X.patch++;
                else X.prerelease.push(0);
                X.raw = X.format();
              case "":
              case ">=":
                if (!Y || tLB(X, Y)) Y = X;
                break;
              case "<":
              case "<=":
                break;
              default:
                throw Error(`Unexpected operation: ${J.operator}`)
            }
          }), Y && (!B || tLB(B, Y))) B = Y
      }
      if (B && A.test(B)) return B;
      return null
    };
  eLB.exports = nV8
})
// @from(Ln 187759, Col 4)
BOB = U((DyG, QOB) => {
  var aV8 = eR(),
    oV8 = (A, Q) => {
      try {
        return new aV8(A, Q).range || "*"
      } catch (B) {
        return null
      }
    };
  QOB.exports = oV8
})
// @from(Ln 187770, Col 4)
b21 = U((WyG, JOB) => {
  var rV8 = _z(),
    YOB = s_A(),
    {
      ANY: sV8
    } = YOB,
    tV8 = eR(),
    eV8 = e_A(),
    GOB = o_A(),
    ZOB = P21(),
    AF8 = x21(),
    QF8 = S21(),
    BF8 = (A, Q, B, G) => {
      A = new rV8(A, G), Q = new tV8(Q, G);
      let Z, Y, J, X, I;
      switch (B) {
        case ">":
          Z = GOB, Y = AF8, J = ZOB, X = ">", I = ">=";
          break;
        case "<":
          Z = ZOB, Y = QF8, J = GOB, X = "<", I = "<=";
          break;
        default:
          throw TypeError('Must provide a hilo val of "<" or ">"')
      }
      if (eV8(A, Q, G)) return !1;
      for (let D = 0; D < Q.set.length; ++D) {
        let W = Q.set[D],
          K = null,
          V = null;
        if (W.forEach((F) => {
            if (F.semver === sV8) F = new YOB(">=0.0.0");
            if (K = K || F, V = V || F, Z(F.semver, K.semver, G)) K = F;
            else if (J(F.semver, V.semver, G)) V = F
          }), K.operator === X || K.operator === I) return !1;
        if ((!V.operator || V.operator === X) && Y(A, V.semver)) return !1;
        else if (V.operator === I && J(A, V.semver)) return !1
      }
      return !0
    };
  JOB.exports = BF8
})
// @from(Ln 187812, Col 4)
IOB = U((KyG, XOB) => {
  var GF8 = b21(),
    ZF8 = (A, Q, B) => GF8(A, Q, ">", B);
  XOB.exports = ZF8
})
// @from(Ln 187817, Col 4)
WOB = U((VyG, DOB) => {
  var YF8 = b21(),
    JF8 = (A, Q, B) => YF8(A, Q, "<", B);
  DOB.exports = JF8
})
// @from(Ln 187822, Col 4)
FOB = U((FyG, VOB) => {
  var KOB = eR(),
    XF8 = (A, Q, B) => {
      return A = new KOB(A, B), Q = new KOB(Q, B), A.intersects(Q, B)
    };
  VOB.exports = XF8
})
// @from(Ln 187829, Col 4)
EOB = U((HyG, HOB) => {
  var IF8 = e_A(),
    DF8 = tR();
  HOB.exports = (A, Q, B) => {
    let G = [],
      Z = null,
      Y = null,
      J = A.sort((W, K) => DF8(W, K, B));
    for (let W of J)
      if (IF8(W, Q, B)) {
        if (Y = W, !Z) Z = W
      } else {
        if (Y) G.push([Z, Y]);
        Y = null, Z = null
      } if (Z) G.push([Z, null]);
    let X = [];
    for (let [W, K] of G)
      if (W === K) X.push(W);
      else if (!K && W === J[0]) X.push("*");
    else if (!K) X.push(`>=${W}`);
    else if (W === J[0]) X.push(`<=${K}`);
    else X.push(`${W} - ${K}`);
    let I = X.join(" || "),
      D = typeof Q.raw === "string" ? Q.raw : String(Q);
    return I.length < D.length ? I : Q
  }
})
// @from(Ln 187856, Col 4)
NOB = U((EyG, qOB) => {
  var zOB = eR(),
    eQ0 = s_A(),
    {
      ANY: tQ0
    } = eQ0,
    AjA = e_A(),
    AB0 = tR(),
    WF8 = (A, Q, B = {}) => {
      if (A === Q) return !0;
      A = new zOB(A, B), Q = new zOB(Q, B);
      let G = !1;
      A: for (let Z of A.set) {
        for (let Y of Q.set) {
          let J = VF8(Z, Y, B);
          if (G = G || J !== null, J) continue A
        }
        if (G) return !1
      }
      return !0
    },
    KF8 = [new eQ0(">=0.0.0-0")],
    $OB = [new eQ0(">=0.0.0")],
    VF8 = (A, Q, B) => {
      if (A === Q) return !0;
      if (A.length === 1 && A[0].semver === tQ0)
        if (Q.length === 1 && Q[0].semver === tQ0) return !0;
        else if (B.includePrerelease) A = KF8;
      else A = $OB;
      if (Q.length === 1 && Q[0].semver === tQ0)
        if (B.includePrerelease) return !0;
        else Q = $OB;
      let G = new Set,
        Z, Y;
      for (let F of A)
        if (F.operator === ">" || F.operator === ">=") Z = COB(Z, F, B);
        else if (F.operator === "<" || F.operator === "<=") Y = UOB(Y, F, B);
      else G.add(F.semver);
      if (G.size > 1) return null;
      let J;
      if (Z && Y) {
        if (J = AB0(Z.semver, Y.semver, B), J > 0) return null;
        else if (J === 0 && (Z.operator !== ">=" || Y.operator !== "<=")) return null
      }
      for (let F of G) {
        if (Z && !AjA(F, String(Z), B)) return null;
        if (Y && !AjA(F, String(Y), B)) return null;
        for (let H of Q)
          if (!AjA(F, String(H), B)) return !1;
        return !0
      }
      let X, I, D, W, K = Y && !B.includePrerelease && Y.semver.prerelease.length ? Y.semver : !1,
        V = Z && !B.includePrerelease && Z.semver.prerelease.length ? Z.semver : !1;
      if (K && K.prerelease.length === 1 && Y.operator === "<" && K.prerelease[0] === 0) K = !1;
      for (let F of Q) {
        if (W = W || F.operator === ">" || F.operator === ">=", D = D || F.operator === "<" || F.operator === "<=", Z) {
          if (V) {
            if (F.semver.prerelease && F.semver.prerelease.length && F.semver.major === V.major && F.semver.minor === V.minor && F.semver.patch === V.patch) V = !1
          }
          if (F.operator === ">" || F.operator === ">=") {
            if (X = COB(Z, F, B), X === F && X !== Z) return !1
          } else if (Z.operator === ">=" && !AjA(Z.semver, String(F), B)) return !1
        }
        if (Y) {
          if (K) {
            if (F.semver.prerelease && F.semver.prerelease.length && F.semver.major === K.major && F.semver.minor === K.minor && F.semver.patch === K.patch) K = !1
          }
          if (F.operator === "<" || F.operator === "<=") {
            if (I = UOB(Y, F, B), I === F && I !== Y) return !1
          } else if (Y.operator === "<=" && !AjA(Y.semver, String(F), B)) return !1
        }
        if (!F.operator && (Y || Z) && J !== 0) return !1
      }
      if (Z && D && !Y && J !== 0) return !1;
      if (Y && W && !Z && J !== 0) return !1;
      if (V || K) return !1;
      return !0
    },
    COB = (A, Q, B) => {
      if (!A) return Q;
      let G = AB0(A.semver, Q.semver, B);
      return G > 0 ? A : G < 0 ? Q : Q.operator === ">" && A.operator === ">=" ? Q : A
    },
    UOB = (A, Q, B) => {
      if (!A) return Q;
      let G = AB0(A.semver, Q.semver, B);
      return G < 0 ? A : G > 0 ? Q : Q.operator === "<" && A.operator === "<=" ? Q : A
    };
  qOB.exports = WF8
})
// @from(Ln 187946, Col 4)
xP = U((zyG, OOB) => {
  var QB0 = ZDA(),
    wOB = n_A(),
    FF8 = _z(),
    LOB = pQ0(),
    HF8 = iBA(),
    EF8 = awB(),
    zF8 = rwB(),
    $F8 = ewB(),
    CF8 = BLB(),
    UF8 = ZLB(),
    qF8 = JLB(),
    NF8 = ILB(),
    wF8 = WLB(),
    LF8 = tR(),
    OF8 = HLB(),
    MF8 = zLB(),
    RF8 = T21(),
    _F8 = qLB(),
    jF8 = wLB(),
    TF8 = o_A(),
    PF8 = P21(),
    SF8 = lQ0(),
    xF8 = iQ0(),
    yF8 = S21(),
    vF8 = x21(),
    kF8 = nQ0(),
    bF8 = SLB(),
    fF8 = s_A(),
    hF8 = eR(),
    gF8 = e_A(),
    uF8 = nLB(),
    mF8 = oLB(),
    dF8 = sLB(),
    cF8 = AOB(),
    pF8 = BOB(),
    lF8 = b21(),
    iF8 = IOB(),
    nF8 = WOB(),
    aF8 = FOB(),
    oF8 = EOB(),
    rF8 = NOB();
  OOB.exports = {
    parse: HF8,
    valid: EF8,
    clean: zF8,
    inc: $F8,
    diff: CF8,
    major: UF8,
    minor: qF8,
    patch: NF8,
    prerelease: wF8,
    compare: LF8,
    rcompare: OF8,
    compareLoose: MF8,
    compareBuild: RF8,
    sort: _F8,
    rsort: jF8,
    gt: TF8,
    lt: PF8,
    eq: SF8,
    neq: xF8,
    gte: yF8,
    lte: vF8,
    cmp: kF8,
    coerce: bF8,
    Comparator: fF8,
    Range: hF8,
    satisfies: gF8,
    toComparators: uF8,
    maxSatisfying: mF8,
    minSatisfying: dF8,
    minVersion: cF8,
    validRange: pF8,
    outside: lF8,
    gtr: iF8,
    ltr: nF8,
    intersects: aF8,
    simplifyRange: oF8,
    subset: rF8,
    SemVer: FF8,
    re: QB0.re,
    src: QB0.src,
    tokens: QB0.t,
    SEMVER_SPEC_VERSION: wOB.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: wOB.RELEASE_TYPES,
    compareIdentifiers: LOB.compareIdentifiers,
    rcompareIdentifiers: LOB.rcompareIdentifiers
  }
})
// @from(Ln 188037, Col 0)
function tF8() {
  return process.platform === "win32" && !!process.env.WT_SESSION
}
// @from(Ln 188041, Col 0)
function eF8() {
  if (process.env.TERM_PROGRAM === "mintty") return !0;
  if (process.platform === "win32" && process.env.MSYSTEM) return !0;
  return !1
}
// @from(Ln 188047, Col 0)
function AH8() {
  if (tF8()) return !0;
  if (process.platform === "win32" && process.env.TERM_PROGRAM === "vscode" && process.env.TERM_PROGRAM_VERSION) return !0;
  if (eF8()) return !0;
  return !1
}
// @from(Ln 188054, Col 0)
function QjA() {
  if (process.platform === "win32")
    if (AH8()) return fB1 + b00 + k00;
    else return fB1 + sF8;
  return fB1 + b00 + k00
}
// @from(Ln 188060, Col 4)
sF8
// @from(Ln 188060, Col 9)
CyG
// @from(Ln 188061, Col 4)
BB0 = w(() => {
  wk();
  sF8 = iI(0, "f");
  CyG = QjA()
})
// @from(Ln 188067, Col 0)
function MOB() {
  if (!process.stdout.isTTY) return !1;
  if (process.env.WT_SESSION) return !1;
  if (process.env.ConEmuANSI || process.env.ConEmuPID || process.env.ConEmuTask) return !0;
  let A = BjA.coerce(process.env.TERM_PROGRAM_VERSION);
  if (!A) return !1;
  if (process.env.TERM_PROGRAM === "ghostty") return BjA.gte(A, "1.2.0");
  if (process.env.TERM_PROGRAM === "iTerm.app") return BjA.gte(A, "3.6.6");
  return !1
}
// @from(Ln 188078, Col 0)
function GB0(A, Q) {
  if (Q.length === 0) return;
  let B = RwB;
  for (let G of Q) switch (G.type) {
    case "stdout":
      B += G.content;
      break;
    case "clear":
      if (G.count > 0) B += bUB(G.count);
      break;
    case "clearTerminal":
      B += QjA();
      break;
    case "cursorHide":
      B += i_A;
      break;
    case "cursorShow":
      B += TP;
      break;
    case "cursorMove":
      B += kUB(G.x, G.y);
      break;
    case "carriageReturn":
      B += "\r";
      break;
    case "resolvePendingWrap":
      B += " \b";
      break;
    case "hyperlink":
      B += kwB(G.uri);
      break;
    case "style":
      B += nL(G.codes);
      break
  }
  B += _wB, A.stdout.write(B)
}
// @from(Ln 188115, Col 4)
BjA
// @from(Ln 188116, Col 4)
ZB0 = w(() => {
  rIA();
  wk();
  lBA();
  L21();
  BB0();
  BjA = c(xP(), 1)
})
// @from(Ln 188125, Col 0)
function Tk() {
  let A = A_.useContext(ROB);
  if (!A) throw Error("useTerminalNotification must be used within TerminalWriteProvider");
  let Q = A_.useCallback(({
      message: J,
      title: X
    }) => {
      let I = X ? `${X}:
${J}` : J;
      A(aL(uH.ITERM2, `

${I}`))
    }, [A]),
    B = A_.useCallback(({
      message: J,
      title: X,
      id: I
    }) => {
      A(aL(uH.KITTY, `i=${I}:d=0:p=title`, X)), A(aL(uH.KITTY, `i=${I}:p=body`, J)), A(aL(uH.KITTY, `i=${I}:d=1:a=focus`, ""))
    }, [A]),
    G = A_.useCallback(({
      message: J,
      title: X
    }) => {
      A(aL(uH.GHOSTTY, "notify", X, J))
    }, [A]),
    Z = A_.useCallback(() => {
      A(vBA)
    }, [A]),
    Y = A_.useCallback((J, X) => {
      if (!MOB()) return;
      if (!J) {
        A(aL(uH.ITERM2, BDA.PROGRESS, GDA.CLEAR, ""));
        return
      }
      let I = Math.max(0, Math.min(100, Math.round(X ?? 0)));
      switch (J) {
        case "completed":
          A(aL(uH.ITERM2, BDA.PROGRESS, GDA.CLEAR, ""));
          break;
        case "error":
          A(aL(uH.ITERM2, BDA.PROGRESS, GDA.ERROR, I));
          break;
        case "indeterminate":
          A(aL(uH.ITERM2, BDA.PROGRESS, GDA.INDETERMINATE, ""));
          break;
        case "running":
          A(aL(uH.ITERM2, BDA.PROGRESS, GDA.SET, I));
          break;
        case null:
          break
      }
    }, [A]);
  return A_.useMemo(() => ({
    notifyITerm2: Q,
    notifyKitty: B,
    notifyGhostty: G,
    notifyBell: Z,
    progress: Y
  }), [Q, B, G, Z, Y])
}
// @from(Ln 188186, Col 4)
A_
// @from(Ln 188186, Col 8)
ROB
// @from(Ln 188186, Col 13)
_OB
// @from(Ln 188187, Col 4)
nBA = w(() => {
  bBA();
  L21();
  ZB0();
  A_ = c(QA(), 1), ROB = A_.createContext(null), _OB = ROB.Provider
})
// @from(Ln 188194, Col 0)
function YB0(A) {
  if (A.length <= 1) return A;
  let Q = [];
  for (let B of A) {
    if (QH8(B)) continue;
    if (BH8(Q, B)) continue;
    Q.push(B)
  }
  return Q
}
// @from(Ln 188205, Col 0)
function QH8(A) {
  switch (A.type) {
    case "stdout":
      return A.content === "";
    case "cursorMove":
      return A.x === 0 && A.y === 0;
    case "clear":
      return A.count === 0;
    default:
      return !1
  }
}
// @from(Ln 188218, Col 0)
function BH8(A, Q) {
  if (A.length === 0) return !1;
  let B = A[A.length - 1];
  if (Q.type === "cursorMove" && B.type === "cursorMove") return A[A.length - 1] = {
    type: "cursorMove",
    x: B.x + Q.x,
    y: B.y + Q.y
  }, !0;
  if (Q.type === "style" && B.type === "style") return A[A.length - 1] = Q, !0;
  if (Q.type === "hyperlink" && B.type === "hyperlink" && Q.uri === B.uri) return !0;
  if (Q.type === "cursorShow" && B.type === "cursorHide" || Q.type === "cursorHide" && B.type === "cursorShow") return A.pop(), !0;
  return !1
}
// @from(Ln 188232, Col 0)
function f21(A) {
  let Q = A.toLowerCase().split("+"),
    B = {
      key: "",
      ctrl: !1,
      alt: !1,
      shift: !1,
      meta: !1
    };
  for (let G of Q) switch (G) {
    case "ctrl":
    case "control":
      B.ctrl = !0;
      break;
    case "alt":
    case "opt":
    case "option":
      B.alt = !0;
      break;
    case "shift":
      B.shift = !0;
      break;
    case "meta":
    case "cmd":
    case "command":
      B.meta = !0;
      break;
    case "esc":
      B.key = "escape";
      break;
    case "return":
      B.key = "enter";
      break;
    default:
      B.key = G;
      break
  }
  return B
}
// @from(Ln 188272, Col 0)
function GH8(A) {
  return A.trim().split(/\s+/).map(f21)
}
// @from(Ln 188276, Col 0)
function ZH8(A) {
  let Q = [];
  if (A.ctrl) Q.push("ctrl");
  if (A.alt) Q.push("alt");
  if (A.shift) Q.push("shift");
  if (A.meta) Q.push("meta");
  return Q.push(A.key), Q.join("+")
}
// @from(Ln 188285, Col 0)
function h21(A) {
  return A.map(ZH8).join(" ")
}
// @from(Ln 188289, Col 0)
function g21(A) {
  let Q = [];
  for (let B of A)
    for (let [G, Z] of Object.entries(B.bindings)) Q.push({
      chord: GH8(G),
      action: Z,
      context: B.context
    });
  return Q
}
// @from(Ln 188300, Col 0)
function jOB(A, Q) {
  if (Q.escape) return "escape";
  if (Q.return) return "enter";
  if (Q.tab) return "tab";
  if (Q.backspace) return "backspace";
  if (Q.delete) return "delete";
  if (Q.upArrow) return "up";
  if (Q.downArrow) return "down";
  if (Q.leftArrow) return "left";
  if (Q.rightArrow) return "right";
  if (Q.pageUp) return "pageup";
  if (Q.pageDown) return "pagedown";
  if (Q.home) return "home";
  if (Q.end) return "end";
  if (A.length === 1) return A.toLowerCase();
  return null
}
// @from(Ln 188318, Col 0)
function u21(A, Q, B) {
  for (let G = B.length - 1; G >= 0; G--) {
    let Z = B[G];
    if (Z && Z.action === A && Z.context === Q) return h21(Z.chord)
  }
  return
}
// @from(Ln 188326, Col 0)
function YH8(A, Q) {
  let B = jOB(A, Q);
  if (!B) return null;
  let G = Q.escape ? !1 : Q.meta;
  return {
    key: B,
    ctrl: Q.ctrl,
    alt: G,
    shift: Q.shift,
    meta: G
  }
}
// @from(Ln 188339, Col 0)
function JH8(A, Q) {
  if (A.length >= Q.chord.length) return !1;
  for (let B = 0; B < A.length; B++) {
    let G = A[B],
      Z = Q.chord[B];
    if (!G || !Z) return !1;
    if (G.key !== Z.key) return !1;
    if (G.ctrl !== Z.ctrl) return !1;
    if ((G.alt || G.meta) !== (Z.alt || Z.meta)) return !1;
    if (G.shift !== Z.shift) return !1
  }
  return !0
}
// @from(Ln 188353, Col 0)
function XH8(A, Q) {
  if (A.length !== Q.chord.length) return !1;
  for (let B = 0; B < A.length; B++) {
    let G = A[B],
      Z = Q.chord[B];
    if (!G || !Z) return !1;
    if (G.key !== Z.key) return !1;
    if (G.ctrl !== Z.ctrl) return !1;
    if ((G.alt || G.meta) !== (Z.alt || Z.meta)) return !1;
    if (G.shift !== Z.shift) return !1
  }
  return !0
}
// @from(Ln 188367, Col 0)
function TOB(A, Q, B, G, Z) {
  if (Q.escape && Z !== null) return {
    type: "chord_cancelled"
  };
  let Y = YH8(A, Q);
  if (!Y) {
    if (Z !== null) return {
      type: "chord_cancelled"
    };
    return {
      type: "none"
    }
  }
  let J = Z ? [...Z, Y] : [Y],
    X = G.filter((W) => B.includes(W.context));
  if (X.some((W) => W.chord.length > J.length && JH8(J, W))) return {
    type: "chord_started",
    pending: J
  };
  let D;
  for (let W of X)
    if (XH8(J, W)) D = W;
  if (D) {
    if (D.action === null) return {
      type: "unbound"
    };
    return {
      type: "match",
      action: D.action
    }
  }
  if (Z !== null) return {
    type: "chord_cancelled"
  };
  return {
    type: "none"
  }
}
// @from(Ln 188405, Col 4)
JB0 = () => {}
// @from(Ln 188407, Col 0)
function xOB({
  bindings: A,
  pendingChord: Q,
  setPendingChord: B,
  children: G
}) {
  let Z = JDA.useMemo(() => {
    let Y = (J, X) => u21(J, X, A);
    return {
      resolve: (J, X, I) => TOB(J, X, I, A, Q),
      setPendingChord: B,
      getDisplayText: Y,
      getPlatformDisplayText: (J, X) => Y(J, X),
      bindings: A,
      pendingChord: Q
    }
  }, [A, Q, B]);
  return POB.default.createElement(SOB.Provider, {
    value: Z
  }, G)
}
// @from(Ln 188429, Col 0)
function GjA() {
  return JDA.useContext(SOB)
}
// @from(Ln 188432, Col 4)
POB
// @from(Ln 188432, Col 9)
JDA
// @from(Ln 188432, Col 14)
SOB
// @from(Ln 188433, Col 4)
m21 = w(() => {
  JB0();
  POB = c(QA(), 1), JDA = c(QA(), 1), SOB = JDA.createContext(null)
})
// @from(Ln 188437, Col 4)
IH8
// @from(Ln 188437, Col 9)
d21
// @from(Ln 188438, Col 4)
XB0 = w(() => {
  c3();
  IH8 = $Q() === "windows" ? "alt+v" : "ctrl+v", d21 = [{
    context: "Global",
    bindings: {
      "ctrl+c": "app:interrupt",
      "ctrl+d": "app:exit",
      "ctrl+t": "app:toggleTodos",
      "ctrl+o": "app:toggleTranscript",
      "ctrl+r": "history:search"
    }
  }, {
    context: "Chat",
    bindings: {
      escape: "chat:cancel",
      "shift+tab": "chat:cycleMode",
      "meta+p": "chat:modelPicker",
      "meta+t": "chat:thinkingToggle",
      enter: "chat:submit",
      up: "history:previous",
      down: "history:next",
      "ctrl+_": "chat:undo",
      "ctrl+g": "chat:externalEditor",
      "ctrl+s": "chat:stash",
      [IH8]: "chat:imagePaste"
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
      escape: "confirm:no"
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
      "shift+tab": "confirm:cycleMode"
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
  }]
})
// @from(Ln 188523, Col 0)
function yOB() {
  let A = $Q(),
    Q = [...IB0, ...DH8];
  if (A === "macos") Q.push(...WH8);
  return Q
}
// @from(Ln 188530, Col 0)
function aBA(A) {
  let Q = A.toLowerCase().split("+"),
    B = [],
    G = "";
  for (let Z of Q) {
    let Y = Z.trim();
    if (["ctrl", "control", "alt", "opt", "option", "meta", "cmd", "command", "shift"].includes(Y))
      if (Y === "control") B.push("ctrl");
      else if (Y === "option" || Y === "opt") B.push("alt");
    else if (Y === "command" || Y === "cmd") B.push("cmd");
    else B.push(Y);
    else G = Y
  }
  return B.sort(), [...B, G].join("+")
}
// @from(Ln 188545, Col 4)
IB0
// @from(Ln 188545, Col 9)
DH8
// @from(Ln 188545, Col 14)
WH8
// @from(Ln 188546, Col 4)
DB0 = w(() => {
  c3();
  IB0 = [{
    key: "ctrl+c",
    reason: "Cannot be rebound - used for interrupt/exit (hardcoded)",
    severity: "error"
  }, {
    key: "ctrl+d",
    reason: "Cannot be rebound - used for exit (hardcoded)",
    severity: "error"
  }], DH8 = [{
    key: "ctrl+z",
    reason: "Unix process suspend (SIGTSTP)",
    severity: "warning"
  }, {
    key: "ctrl+\\",
    reason: "Terminal quit signal (SIGQUIT)",
    severity: "error"
  }], WH8 = [{
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
// @from(Ln 188595, Col 0)
function KH8(A) {
  if (typeof A !== "object" || A === null) return !1;
  let Q = A;
  return typeof Q.context === "string" && typeof Q.bindings === "object" && Q.bindings !== null
}
// @from(Ln 188601, Col 0)
function VH8(A) {
  return Array.isArray(A) && A.every(KH8)
}
// @from(Ln 188605, Col 0)
function FH8(A) {
  return vOB.includes(A)
}
// @from(Ln 188609, Col 0)
function HH8(A) {
  let Q = A.toLowerCase().split("+");
  for (let G of Q)
    if (!G.trim()) return {
      type: "parse_error",
      severity: "error",
      message: `Empty key part in "${A}"`,
      key: A,
      suggestion: 'Remove extra "+" characters'
    };
  let B = f21(A);
  if (!B.key && !B.ctrl && !B.alt && !B.shift && !B.meta) return {
    type: "parse_error",
    severity: "error",
    message: `Could not parse keystroke "${A}"`,
    key: A
  };
  return null
}
// @from(Ln 188629, Col 0)
function EH8(A, Q) {
  let B = [];
  if (typeof A !== "object" || A === null) return B.push({
    type: "parse_error",
    severity: "error",
    message: `Keybinding block ${Q+1} is not an object`
  }), B;
  let G = A,
    Z = G.context,
    Y;
  if (typeof Z !== "string") B.push({
    type: "parse_error",
    severity: "error",
    message: `Keybinding block ${Q+1} missing "context" field`
  });
  else if (!FH8(Z)) B.push({
    type: "invalid_context",
    severity: "error",
    message: `Unknown context "${Z}"`,
    context: Z,
    suggestion: `Valid contexts: ${vOB.join(", ")}`
  });
  else Y = Z;
  if (typeof G.bindings !== "object" || G.bindings === null) return B.push({
    type: "parse_error",
    severity: "error",
    message: `Keybinding block ${Q+1} missing "bindings" field`
  }), B;
  let J = G.bindings;
  for (let [X, I] of Object.entries(J)) {
    let D = HH8(X);
    if (D) D.context = Y, B.push(D);
    if (I !== null && typeof I !== "string") B.push({
      type: "invalid_action",
      severity: "error",
      message: `Invalid action for "${X}": must be a string or null`,
      key: X,
      context: Y
    })
  }
  return B
}
// @from(Ln 188672, Col 0)
function WB0(A) {
  let Q = [],
    B = /"bindings"\s*:\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g,
    G;
  while ((G = B.exec(A)) !== null) {
    let Z = G[1];
    if (!Z) continue;
    let X = A.slice(0, G.index).match(/"context"\s*:\s*"([^"]+)"[^{]*$/)?.[1] ?? "unknown",
      I = /"([^"]+)"\s*:/g,
      D = new Map,
      W;
    while ((W = I.exec(Z)) !== null) {
      let K = W[1];
      if (!K) continue;
      let V = (D.get(K) ?? 0) + 1;
      if (D.set(K, V), V === 2) Q.push({
        type: "duplicate",
        severity: "warning",
        message: `Duplicate key "${K}" in ${X} bindings`,
        key: K,
        context: X,
        suggestion: "This key appears multiple times in the same context. JSON uses the last value, earlier values are ignored."
      })
    }
  }
  return Q
}
// @from(Ln 188700, Col 0)
function zH8(A) {
  let Q = [];
  if (!Array.isArray(A)) return Q.push({
    type: "parse_error",
    severity: "error",
    message: "keybindings.json must contain an array",
    suggestion: "Wrap your bindings in [ ]"
  }), Q;
  for (let B = 0; B < A.length; B++) Q.push(...EH8(A[B], B));
  return Q
}
// @from(Ln 188712, Col 0)
function $H8(A) {
  let Q = [],
    B = new Map;
  for (let G of A) {
    let Z = B.get(G.context) ?? new Map;
    B.set(G.context, Z);
    for (let [Y, J] of Object.entries(G.bindings)) {
      let X = aBA(Y),
        I = Z.get(X);
      if (I && I !== J) Q.push({
        type: "duplicate",
        severity: "warning",
        message: `Duplicate binding "${Y}" in ${G.context} context`,
        key: Y,
        context: G.context,
        action: J ?? "null (unbind)",
        suggestion: `Previously bound to "${I}". Only the last binding will be used.`
      });
      Z.set(X, J ?? "null")
    }
  }
  return Q
}
// @from(Ln 188736, Col 0)
function CH8(A) {
  let Q = [],
    B = yOB();
  for (let G of A) {
    let Z = h21(G.chord),
      Y = aBA(Z);
    for (let J of B)
      if (aBA(J.key) === Y) Q.push({
        type: "reserved",
        severity: J.severity,
        message: `"${Z}" may not work: ${J.reason}`,
        key: Z,
        context: G.context,
        action: G.action ?? void 0
      })
  }
  return Q
}
// @from(Ln 188755, Col 0)
function UH8(A) {
  let Q = [];
  for (let B of A)
    for (let [G, Z] of Object.entries(B.bindings)) {
      let Y = G.split(" ").map((J) => f21(J));
      Q.push({
        chord: Y,
        action: Z,
        context: B.context
      })
    }
  return Q
}
// @from(Ln 188769, Col 0)
function KB0(A, Q) {
  let B = [];
  if (B.push(...zH8(A)), VH8(A)) {
    B.push(...$H8(A));
    let Z = UH8(A);
    B.push(...CH8(Z))
  }
  let G = new Set;
  return B.filter((Z) => {
    let Y = `${Z.type}:${Z.key}:${Z.context}`;
    if (G.has(Y)) return !1;
    return G.add(Y), !0
  })
}
// @from(Ln 188783, Col 4)
vOB
// @from(Ln 188784, Col 4)
kOB = w(() => {
  DB0();
  vOB = ["Global", "Chat", "Autocomplete", "Confirmation", "Help", "Transcript", "HistorySearch", "Task", "ThemePicker", "Settings"]
})
// @from(Ln 188800, Col 0)
function Pk() {
  return !1
}
// @from(Ln 188804, Col 0)
function _H8(A) {
  return typeof A === "object" && A !== null && "code" in A && typeof A.code === "string"
}
// @from(Ln 188808, Col 0)
function jH8(A) {
  if (typeof A !== "object" || A === null) return !1;
  let Q = A;
  return typeof Q.context === "string" && typeof Q.bindings === "object" && Q.bindings !== null
}
// @from(Ln 188814, Col 0)
function gOB(A) {
  return Array.isArray(A) && A.every(jH8)
}
// @from(Ln 188818, Col 0)
function rBA() {
  return LH8(zQ(), "keybindings.json")
}
// @from(Ln 188822, Col 0)
function VB0() {
  return g21(d21)
}
// @from(Ln 188825, Col 0)
async function TH8() {
  let A = VB0();
  if (!Pk()) return {
    bindings: A,
    warnings: []
  };
  let Q = rBA();
  try {
    let B = await qH8(Q, "utf-8"),
      G = AQ(B),
      Z;
    if (typeof G === "object" && G !== null && "bindings" in G) Z = G.bindings;
    else return k('[keybindings] Invalid keybindings.json: keybindings.json must have a "bindings" array'), {
      bindings: A,
      warnings: [{
        type: "parse_error",
        severity: "error",
        message: 'keybindings.json must have a "bindings" array',
        suggestion: 'Use format: { "bindings": [ ... ] }'
      }]
    };
    if (!gOB(Z)) {
      let D = !Array.isArray(Z) ? '"bindings" must be an array' : "keybindings.json contains invalid block structure",
        W = !Array.isArray(Z) ? 'Set "bindings" to an array of keybinding blocks' : 'Each block must have "context" (string) and "bindings" (object)';
      return k(`[keybindings] Invalid keybindings.json: ${D}`), {
        bindings: A,
        warnings: [{
          type: "parse_error",
          severity: "error",
          message: D,
          suggestion: W
        }]
      }
    }
    let Y = g21(Z);
    k(`[keybindings] Loaded ${Y.length} user bindings from ${Q}`);
    let J = [...A, ...Y],
      I = [...WB0(B), ...KB0(Z, J)];
    if (I.length > 0) k(`[keybindings] Found ${I.length} validation issue(s)`);
    return {
      bindings: J,
      warnings: I
    }
  } catch (B) {
    if (_H8(B) && B.code === "ENOENT") return {
      bindings: A,
      warnings: []
    };
    return k(`[keybindings] Error loading ${Q}: ${B instanceof Error?B.message:String(B)}`), {
      bindings: A,
      warnings: [{
        type: "parse_error",
        severity: "error",
        message: `Failed to parse keybindings.json: ${B instanceof Error?B.message:String(B)}`
      }]
    }
  }
}
// @from(Ln 188884, Col 0)
function uOB() {
  if (mH) return mH;
  return FB0().bindings
}
// @from(Ln 188889, Col 0)
function FB0() {
  if (mH) return {
    bindings: mH,
    warnings: jz
  };
  let A = VB0();
  if (!Pk()) return mH = A, jz = [], {
    bindings: mH,
    warnings: jz
  };
  let Q = rBA();
  try {
    let B = wH8(Q, "utf-8"),
      G = AQ(B),
      Z;
    if (typeof G === "object" && G !== null && "bindings" in G) Z = G.bindings;
    else return mH = A, jz = [{
      type: "parse_error",
      severity: "error",
      message: 'keybindings.json must have a "bindings" array',
      suggestion: 'Use format: { "bindings": [ ... ] }'
    }], {
      bindings: mH,
      warnings: jz
    };
    if (!gOB(Z)) {
      let X = !Array.isArray(Z) ? '"bindings" must be an array' : "keybindings.json contains invalid block structure",
        I = !Array.isArray(Z) ? 'Set "bindings" to an array of keybinding blocks' : 'Each block must have "context" (string) and "bindings" (object)';
      return mH = A, jz = [{
        type: "parse_error",
        severity: "error",
        message: X,
        suggestion: I
      }], {
        bindings: mH,
        warnings: jz
      }
    }
    let Y = g21(Z);
    if (k(`[keybindings] Loaded ${Y.length} user bindings from ${Q}`), mH = [...A, ...Y], jz = [...WB0(B), ...KB0(Z, mH)], jz.length > 0) k(`[keybindings] Found ${jz.length} validation issue(s)`);
    return {
      bindings: mH,
      warnings: jz
    }
  } catch {
    return mH = A, jz = [], {
      bindings: mH,
      warnings: jz
    }
  }
}
// @from(Ln 188940, Col 0)
async function mOB() {
  if (bOB || hOB) return;
  if (!Pk()) {
    k("[keybindings] Skipping file watcher - user customization disabled");
    return
  }
  let A = rBA(),
    Q = OH8(A);
  try {
    if (!(await NH8(Q)).isDirectory()) {
      k(`[keybindings] Not watching: ${Q} is not a directory`);
      return
    }
  } catch {
    k(`[keybindings] Not watching: ${Q} does not exist`);
    return
  }
  bOB = !0, k(`[keybindings] Watching for changes to ${A}`), oBA = BIA.watch(A, {
    persistent: !0,
    ignoreInitial: !0,
    awaitWriteFinish: {
      stabilityThreshold: MH8,
      pollInterval: RH8
    },
    ignorePermissionErrors: !0,
    usePolling: !1,
    atomic: !0
  }), oBA.on("add", fOB), oBA.on("change", fOB), oBA.on("unlink", SH8), C6(async () => PH8())
}
// @from(Ln 188970, Col 0)
function PH8() {
  if (hOB = !0, oBA) oBA.close(), oBA = null;
  ZjA.clear()
}
// @from(Ln 188975, Col 0)
function dOB(A) {
  return ZjA.add(A), () => {
    ZjA.delete(A)
  }
}
// @from(Ln 188980, Col 0)
async function fOB(A) {
  k(`[keybindings] Detected change to ${A}`);
  try {
    let Q = await TH8();
    mH = Q.bindings, jz = Q.warnings, ZjA.forEach((B) => B(Q))
  } catch (Q) {
    k(`[keybindings] Error reloading: ${Q instanceof Error?Q.message:String(Q)}`)
  }
}
// @from(Ln 188989, Col 0)
async function SH8(A) {
  k(`[keybindings] Detected deletion of ${A}`);
  let Q = VB0();
  mH = Q, jz = [], ZjA.forEach((B) => B({
    bindings: Q,
    warnings: []
  }))
}
// @from(Ln 188998, Col 0)
function cOB() {
  return jz
}
// @from(Ln 189001, Col 4)
MH8 = 500
// @from(Ln 189002, Col 2)
RH8 = 200
// @from(Ln 189003, Col 2)
oBA = null
// @from(Ln 189004, Col 2)
bOB = !1
// @from(Ln 189005, Col 2)
hOB = !1
// @from(Ln 189006, Col 2)
mH = null
// @from(Ln 189007, Col 2)
jz
// @from(Ln 189007, Col 6)
ZjA
// @from(Ln 189008, Col 4)
XDA = w(() => {
  p01();
  fQ();
  T1();
  nX();
  A0();
  w6();
  XB0();
  kOB();
  jz = [], ZjA = new Set
})
// @from(Ln 189020, Col 0)
function J3(A, Q, B) {
  let G = GjA(),
    Z = G?.getDisplayText(A, Q);
  if (Z === void 0) return l("tengu_keybinding_fallback_used", {
    action: A,
    context: Q,
    fallback: B,
    reason: G ? "action_not_found" : "no_context"
  }), B;
  return Z
}
// @from(Ln 189032, Col 0)
function BN(A, Q, B) {
  let G = uOB(),
    Z = u21(A, Q, G);
  if (Z === void 0) return l("tengu_keybinding_fallback_used", {
    action: A,
    context: Q,
    fallback: B,
    reason: "action_not_found"
  }), B;
  return Z
}
// @from(Ln 189043, Col 4)
NX = w(() => {
  m21();
  XDA();
  JB0();
  Z0()
})
// @from(Ln 189059, Col 0)
function q7(A) {
  let B = L1().featureUsage?.[A];
  return B !== void 0 && B.usageCount > 0
}
// @from(Ln 189064, Col 0)
function lOB(A) {
  return i21.filter((Q) => Q.categoryId === A)
}
// @from(Ln 189068, Col 0)
function iOB(A) {
  return l21.find((Q) => Q.id === A)
}
// @from(Ln 189072, Col 0)
function nOB() {
  let A = {};
  for (let Q of l21) A[Q.id] = {
    explored: 0,
    total: 0
  };
  return A
}
// @from(Ln 189080, Col 4)
l21
// @from(Ln 189080, Col 9)
i21
// @from(Ln 189081, Col 4)
n21 = w(() => {
  GQ();
  V2();
  GB();
  NX();
  l21 = [{
    id: "quick-wins",
    name: "Quick Wins",
    description: "Try these in 30 seconds",
    order: 1
  }, {
    id: "speed",
    name: "10x Your Speed",
    description: "Efficiency boosters",
    order: 2
  }, {
    id: "code",
    name: "Level Up Your Code",
    description: "Dev workflows",
    order: 3
  }, {
    id: "collaborate",
    name: "Share & Collaborate",
    description: "Work with your team",
    order: 4
  }, {
    id: "customize",
    name: "Make It Yours",
    description: "Personalize Claude",
    order: 5
  }, {
    id: "power-user",
    name: "Power User",
    description: "Advanced features",
    order: 6
  }];
  i21 = [{
    id: "image-paste",
    name: "Paste Images",
    description: "Paste screenshots for Claude to analyze",
    categoryId: "quick-wins",
    tryItPrompt: "Press Ctrl+V to paste an image from clipboard",
    hasBeenUsed: async () => q7("image-paste")
  }, {
    id: "resume",
    name: "Resume Conversations",
    description: "Pick up where you left off",
    categoryId: "quick-wins",
    tryItPrompt: "Type /resume to continue a past conversation",
    hasBeenUsed: async () => q7("resume")
  }, {
    id: "cost",
    name: "Track Costs",
    description: "See your session spending",
    categoryId: "quick-wins",
    tryItPrompt: "Type /cost to see session cost",
    hasBeenUsed: async () => q7("cost")
  }, {
    id: "external-editor",
    name: "External Editor",
    description: "Edit prompts in VS Code or vim",
    categoryId: "quick-wins",
    get tryItPrompt() {
      return `Press ${BN("chat:externalEditor","Chat","Ctrl+G")} to open your editor`
    },
    hasBeenUsed: async () => q7("external-editor")
  }, {
    id: "slash-commands",
    name: "Skills",
    description: "Quick actions with /skills",
    categoryId: "quick-wins",
    tryItPrompt: "Type / to see available skills",
    hasBeenUsed: async () => q7("slash-commands")
  }, {
    id: "at-mentions",
    name: "@-mentions",
    description: "Reference files with @filename",
    categoryId: "quick-wins",
    tryItPrompt: "Type @ followed by a filename",
    hasBeenUsed: async () => q7("at-mentions")
  }, {
    id: "clear",
    name: "Fresh Start",
    description: "Clear and start over",
    categoryId: "quick-wins",
    tryItPrompt: "Type /clear for a fresh conversation",
    hasBeenUsed: async () => q7("clear")
  }, {
    id: "rewind",
    name: "Undo Changes",
    description: "Go back to a previous point",
    categoryId: "quick-wins",
    tryItPrompt: "Type /rewind to undo",
    hasBeenUsed: async () => q7("rewind")
  }, {
    id: "ctrl-underscore",
    name: "Quick Undo",
    description: "Undo with keyboard shortcut",
    categoryId: "quick-wins",
    get tryItPrompt() {
      return `Press ${BN("chat:undo","Chat","Ctrl+_")} to undo`
    },
    hasBeenUsed: async () => q7("ctrl-underscore")
  }, {
    id: "double-escape",
    name: "Clear Input",
    description: "Double-tap Escape to clear",
    categoryId: "quick-wins",
    tryItPrompt: "Press Escape twice to clear input",
    hasBeenUsed: async () => q7("double-escape")
  }, {
    id: "prompt-stash",
    name: "Stash Prompt",
    description: "Save prompt for later",
    categoryId: "quick-wins",
    get tryItPrompt() {
      let A = BN("chat:stash", "Chat", "Ctrl+S");
      return `Press ${A} to stash, ${A} again to restore`
    },
    hasBeenUsed: async () => q7("prompt-stash")
  }, {
    id: "vim-mode",
    name: "Vim Mode",
    description: "Vim keybindings in the prompt",
    categoryId: "speed",
    tryItPrompt: "Type /vim to toggle Vim mode",
    hasBeenUsed: async () => q7("vim-mode")
  }, {
    id: "history-search",
    name: "History Search",
    description: "Search past prompts like bash",
    categoryId: "speed",
    get tryItPrompt() {
      return `Press ${BN("history:search","Global","Ctrl+R")} to search history`
    },
    hasBeenUsed: async () => q7("history-search")
  }, {
    id: "tab-completion",
    name: "Tab Completion",
    description: "Autocomplete file paths",
    categoryId: "speed",
    tryItPrompt: "Start typing a path and press Tab",
    hasBeenUsed: async () => q7("tab-completion")
  }, {
    id: "prompt-queue",
    name: "Prompt Queue",
    description: "Type while Claude works",
    categoryId: "speed",
    tryItPrompt: "Type your next prompt while Claude is responding",
    hasBeenUsed: async () => {
      return L1().promptQueueUseCount > 0
    }
  }, {
    id: "teleport",
    name: "Teleport",
    description: "Jump to any GitHub repo instantly",
    categoryId: "speed",
    tryItPrompt: "Type /teleport owner/repo to jump there",
    hasBeenUsed: async () => q7("teleport")
  }, {
    id: "plan-mode",
    name: "Plan Mode",
    description: "Think before you code",
    categoryId: "speed",
    tryItPrompt: "Press Shift+Tab twice for Plan Mode",
    hasBeenUsed: async () => {
      return L1().lastPlanModeUse !== void 0
    }
  }, {
    id: "bash-mode",
    name: "Bash Mode",
    description: "Run shell commands with ! prefix",
    categoryId: "speed",
    tryItPrompt: "Type !ls to list files",
    hasBeenUsed: async () => q7("bash-mode")
  }, {
    id: "compact",
    name: "Compact Context",
    description: "Summarize to free up space",
    categoryId: "speed",
    tryItPrompt: "Type /compact to summarize",
    hasBeenUsed: async () => q7("compact")
  }, {
    id: "memory-mode",
    name: "Quick Memory",
    description: "Save notes with # prefix",
    categoryId: "speed",
    tryItPrompt: "Press # to add to memory",
    hasBeenUsed: async () => {
      return L1().memoryUsageCount > 0
    }
  }, {
    id: "auto-accept-mode",
    name: "Auto-Accept Edits",
    description: "Skip confirmations",
    categoryId: "speed",
    tryItPrompt: "Press Shift+Tab once for Auto-Accept",
    hasBeenUsed: async () => q7("auto-accept-mode")
  }, {
    id: "context",
    name: "Context Viewer",
    description: "See what Claude sees",
    categoryId: "speed",
    tryItPrompt: "Type /context to visualize usage",
    hasBeenUsed: async () => q7("context")
  }, {
    id: "backslash-return",
    name: "Multi-line Input",
    description: "Type longer prompts",
    categoryId: "speed",
    tryItPrompt: "Type \\ then Enter for a new line",
    hasBeenUsed: async () => {
      return L1().hasUsedBackslashReturn === !0
    }
  }, {
    id: "review",
    name: "Code Review",
    description: "AI-powered code review",
    categoryId: "code",
    tryItPrompt: "Type /review to review a PR",
    hasBeenUsed: async () => q7("review")
  }, {
    id: "security-review",
    name: "Security Review",
    description: "Find vulnerabilities",
    categoryId: "code",
    tryItPrompt: "Ask Claude to do a security review",
    hasBeenUsed: async () => q7("security-review")
  }, {
    id: "git-commits",
    name: "Git Commits",
    description: "Claude-assisted commits",
    categoryId: "code",
    tryItPrompt: "Ask Claude to commit your changes",
    hasBeenUsed: async () => q7("git-commits")
  }, {
    id: "pr-creation",
    name: "PR Creation",
    description: "Create PRs with Claude",
    categoryId: "code",
    tryItPrompt: "Ask Claude to create a pull request",
    hasBeenUsed: async () => q7("pr-creation")
  }, {
    id: "branch-management",
    name: "Branch Management",
    description: "Git branch operations",
    categoryId: "code",
    tryItPrompt: "Ask Claude to create a branch",
    hasBeenUsed: async () => q7("branch-management")
  }, {
    id: "share",
    name: "Share Conversations",
    description: "Share a link to your session",
    categoryId: "collaborate",
    tryItPrompt: "Type /share to get a shareable link",
    hasBeenUsed: async () => q7("share")
  }, {
    id: "export",
    name: "Export",
    description: "Save as markdown",
    categoryId: "collaborate",
    tryItPrompt: "Type /export to save conversation",
    hasBeenUsed: async () => q7("export")
  }, {
    id: "github-app",
    name: "GitHub Integration",
    description: "Connect to GitHub Actions",
    categoryId: "collaborate",
    tryItPrompt: "Type /install-github-app to set up",
    hasBeenUsed: async () => q7("github-app")
  }, {
    id: "slack-app",
    name: "Slack Notifications",
    description: "Get notified in Slack",
    categoryId: "collaborate",
    tryItPrompt: "Type /install-slack-app to connect",
    hasBeenUsed: async () => q7("slack-app")
  }, {
    id: "custom-commands",
    name: "Custom Skills",
    description: "Create your own /skills",
    categoryId: "customize",
    tryItPrompt: "Create .claude/skills/myskill/SKILL.md",
    hasBeenUsed: async () => {
      let A = o1(),
        Q = p21(A, ".claude", "skills"),
        B = p21(pOB(), ".claude", "skills");
      return c21(Q) || c21(B)
    }
  }, {
    id: "hooks",
    name: "Hooks",
    description: "Auto-run scripts on events",
    categoryId: "customize",
    tryItPrompt: "Add hooks to .claude/settings.json",
    hasBeenUsed: async () => {
      let A = jQ();
      return Object.keys(A.hooks ?? {}).length > 0
    }
  }, {
    id: "theme",
    name: "Themes",
    description: "Customize colors",
    categoryId: "customize",
    tryItPrompt: "Type /config to change theme",
    hasBeenUsed: async () => q7("theme")
  }, {
    id: "claude-md-project",
    name: "Project Instructions",
    description: "CLAUDE.md for your project",
    categoryId: "customize",
    tryItPrompt: "Create CLAUDE.md in your project root",
    hasBeenUsed: async () => {
      let A = o1(),
        Q = p21(A, "CLAUDE.md");
      return c21(Q)
    }
  }, {
    id: "claude-md-user",
    name: "Personal Instructions",
    description: "Your global CLAUDE.md",
    categoryId: "customize",
    tryItPrompt: "Create ~/.claude/CLAUDE.md",
    hasBeenUsed: async () => {
      let A = p21(pOB(), ".claude", "CLAUDE.md");
      return c21(A)
    }
  }, {
    id: "mcp-servers",
    name: "MCP Servers",
    description: "Connect external tools",
    categoryId: "power-user",
    tryItPrompt: "Type /mcp to manage servers",
    hasBeenUsed: async () => {
      let A = L1();
      return Object.keys(A.mcpServers ?? {}).length > 0
    }
  }, {
    id: "ide-integration",
    name: "IDE Integration",
    description: "Connect to VS Code",
    categoryId: "power-user",
    tryItPrompt: "Type /ide to configure",
    hasBeenUsed: async () => q7("ide-integration")
  }, {
    id: "subagents",
    name: "Subagents",
    description: "Claude spawns helper agents",
    categoryId: "power-user",
    tryItPrompt: "Ask Claude to explore the codebase",
    hasBeenUsed: async () => q7("subagents")
  }, {
    id: "plugins",
    name: "Plugins",
    description: "Extend with plugins",
    categoryId: "power-user",
    tryItPrompt: "Type /plugin to manage plugins",
    hasBeenUsed: async () => q7("plugins")
  }, {
    id: "multi-directory",
    name: "Multi-Directory",
    description: "Work across projects",
    categoryId: "power-user",
    tryItPrompt: "Type /add-dir to add another directory",
    hasBeenUsed: async () => q7("multi-directory")
  }]
})
// @from(Ln 189449, Col 0)
function a21() {
  return !1
}
// @from(Ln 189453, Col 0)
function T9(A) {
  if (!a21()) return;
  let G = (L1().featureUsage ?? {})[A],
    Z = {
      firstUsedAt: G?.firstUsedAt ?? Date.now(),
      usageCount: (G?.usageCount ?? 0) + 1
    };
  if (!G || G.usageCount !== Z.usageCount) S0((Y) => ({
    ...Y,
    featureUsage: {
      ...Y.featureUsage,
      [A]: Z
    }
  }))
}
// @from(Ln 189468, Col 0)
async function aOB() {
  let A = i21.map(async (Z) => ({
      id: Z.id,
      categoryId: Z.categoryId,
      used: await Z.hasBeenUsed()
    })),
    Q = await Promise.all(A),
    B = nOB(),
    G = 0;
  for (let Z of Q)
    if (B[Z.categoryId].total++, Z.used) B[Z.categoryId].explored++, G++;
  return {
    explored: G,
    total: i21.length,
    byCategory: B
  }
}
// @from(Ln 189485, Col 4)
JZ = w(() => {
  GQ();
  n21()
})
// @from(Ln 189492, Col 0)
class r21 {
  options;
  log;
  terminal;
  scheduleRender;
  isUnmounted = !1;
  isPaused = !1;
  container;
  rootNode;
  renderer;
  stylePool;
  exitPromise;
  restoreConsole;
  unsubscribeTTYHandlers;
  terminalColumns;
  terminalRows;
  currentNode = null;
  prevFrame;
  constructor(A) {
    this.options = A;
    if (Q00(this), this.options.patchConsole) this.restoreConsole = this.patchConsole();
    if (this.terminal = {
        stdout: A.stdout,
        stderr: A.stderr
      }, this.terminalColumns = A.stdout.columns || 80, this.terminalRows = A.stdout.rows || 24, this.stylePool = new UQ0, this.prevFrame = D21(this.terminalRows, this.terminalColumns, this.stylePool), this.log = new MQ0({
        debug: A.debug,
        isTTY: A.stdout.isTTY || !1,
        onFlicker: A.onFlicker,
        ink2: A.ink2,
        stylePool: this.stylePool
      }), this.scheduleRender = A.debug ? this.onRender : A00(this.onRender, 32, {
        leading: !0,
        trailing: !0
      }), this.isUnmounted = !1, this.unsubscribeExit = ocA(this.unmount, {
        alwaysLast: !1
      }), A.stdout.isTTY) A.stdout.on("resize", this.handleResize), process.on("SIGCONT", this.handleResume), this.unsubscribeTTYHandlers = () => {
      A.stdout.off("resize", this.handleResize), process.off("SIGCONT", this.handleResume)
    };
    if (this.rootNode = gB1("ink-root"), this.renderer = wQ0(this.rootNode, this.stylePool), this.rootNode.onRender = this.scheduleRender, this.rootNode.onImmediateRender = this.onRender, this.rootNode.onComputeLayout = () => {
        if (this.isUnmounted) return;
        if (this.rootNode.yogaNode) this.rootNode.yogaNode.setWidth(this.terminalColumns), this.rootNode.yogaNode.calculateLayout(void 0, void 0, _BA.LTR)
      }, this.container = Sa.createContainer(this.rootNode, 0, null, !1, null, "id", Dg, Dg, Dg, Dg), process.env.DEV === "true") Sa.injectIntoDevTools({
      bundleType: 0,
      version: "16.13.1",
      rendererPackageName: "ink"
    })
  }
  handleResume = () => {
    if (!this.options.stdout.isTTY) return;
    this.prevFrame = D21(this.prevFrame.rows, this.prevFrame.columns, this.stylePool), this.log.reset()
  };
  handleResize = () => {
    if (this.terminalColumns = this.options.stdout.columns || 80, this.terminalRows = this.options.stdout.rows || 24, this.currentNode !== null) this.render(this.currentNode)
  };
  resolveExitPromise = () => {};
  rejectExitPromise = () => {};
  unsubscribeExit = () => {};
  setTheme(A) {
    this.options.theme = A
  }
  handleThemeChange = (A) => {
    this.setTheme(A)
  };
  handleThemeSave = (A) => {
    T9("theme"), S0((Q) => ({
      ...Q,
      theme: A
    }))
  };
  onRender() {
    if (this.isUnmounted || this.isPaused) return;
    let A = this.options.stdout.rows || 24,
      Q = this.options.stdout.columns || 80,
      B = this.renderer({
        terminalWidth: Q,
        terminalRows: A,
        isTTY: this.options.stdout.isTTY,
        ink2: this.options.ink2,
        prevScreen: this.prevFrame.screen
      }),
      G = this.log.render(this.prevFrame, B);
    this.prevFrame = B;
    for (let Z of G)
      if (Z.type === "clearTerminal") this.options.onFlicker?.(B.outputHeight, B.rows, this.options.ink2, Z.reason);
    GB0(this.terminal, YB0(G))
  }
  pause() {
    Sa.flushSyncFromReconciler(), this.onRender(), this.isPaused = !0
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
    let Q = HB0.default.createElement(w21, {
      initialTheme: this.options.theme,
      stdin: this.options.stdin,
      stdout: this.options.stdout,
      stderr: this.options.stderr,
      exitOnCtrlC: this.options.exitOnCtrlC,
      onExit: this.unmount,
      ink2: this.options.ink2,
      terminalColumns: this.terminalColumns,
      terminalRows: this.terminalRows,
      onThemeChange: this.handleThemeChange,
      onThemeSave: this.handleThemeSave
    }, HB0.default.createElement(_OB, {
      value: (B) => this.options.stdout.write(B)
    }, A));
    Sa.updateContainer(Q, this.container, null, Dg)
  }
  unmount(A) {
    if (this.isUnmounted) return;
    if (this.onRender(), this.unsubscribeExit(), typeof this.restoreConsole === "function") this.restoreConsole();
    this.unsubscribeTTYHandlers?.();
    let Q = this.log.renderPreviousOutput_DEPRECATED(this.prevFrame);
    if (GB0(this.terminal, YB0(Q)), this.options.stdout.isTTY) o21(1, uIA), o21(1, pBA), o21(1, QDA), o21(1, TP);
    if (this.isUnmounted = !0, this.scheduleRender.cancel?.(), Sa.updateContainer(null, this.container, null, Dg), _k.delete(this.options.stdout), A instanceof Error) this.rejectExitPromise(A);
    else this.resolveExitPromise()
  }
  async waitUntilExit() {
    return this.exitPromise ||= new Promise((A, Q) => {
      this.resolveExitPromise = A, this.rejectExitPromise = Q
    }), this.exitPromise
  }
  resetLineCount() {
    if (this.options.stdout.isTTY && !this.options.debug) this.prevFrame = D21(this.prevFrame.rows, this.prevFrame.columns, this.stylePool), this.log.reset()
  }
  patchConsole() {
    if (this.options.debug) return;
    return bCB((A, Q) => {
      if (A === "stdout") k(`console.log: ${Q}`);
      if (A === "stderr") e(Error(`console.error: ${Q}`))
    })
  }
}
// @from(Ln 189656, Col 4)
HB0
// @from(Ln 189657, Col 4)
oOB = w(() => {
  yCB();
  PL1();
  fCB();
  JQ0();
  gNB();
  mB1();
  pNB();
  m_A();
  ywB();
  nBA();
  v1();
  T1();
  yO1();
  ZB0();
  LQ0();
  tIA();
  PBA();
  lBA();
  wk();
  GQ();
  JZ();
  HB0 = c(QA(), 1)
})
// @from(Ln 189682, Col 0)
function Tz() {
  if (iX(process.env.ENABLE_INCREMENTAL_TUI)) return !1;
  return a1(process.env.ENABLE_INCREMENTAL_TUI) || f8("tengu_sumi")
}
// @from(Ln 189686, Col 4)
sBA = w(() => {
  fQ();
  w6()
})
// @from(Ln 189693, Col 4)
yH8 = (A, Q) => {
    let B = kH8(Q),
      G = {
        stdout: process.stdout,
        stdin: process.stdin,
        stderr: process.stderr,
        debug: !1,
        exitOnCtrlC: !0,
        patchConsole: !0,
        ...B,
        theme: B.theme ?? L1().theme,
        ink2: B.ink2 ?? Tz()
      },
      Z = bH8(G.stdout, () => new r21(G));
    return Z.render(A), {
      rerender: Z.render,
      unmount() {
        Z.unmount()
      },
      waitUntilExit: Z.waitUntilExit,
      cleanup: () => _k.delete(G.stdout)
    }
  }
// @from(Ln 189716, Col 2)
vH8 = async (A, Q) => {
    return k("[render] initYoga starting"), await lUB(), k("[render] initYoga complete"), yH8(A, Q)
  }
// @from(Ln 189718, Col 5)
Y5
// @from(Ln 189718, Col 9)
kH8 = (A = {}) => {
    if (A instanceof xH8) return {
      stdout: A,
      stdin: process.stdin
    };
    return A
  }
// @from(Ln 189724, Col 5)
bH8 = (A, Q) => {
    let B = _k.get(A);
    if (!B) B = Q(), _k.set(A, B);
    return B
  }
// @from(Ln 189729, Col 4)
rOB = w(() => {
  oOB();
  mB1();
  m_A();
  GQ();
  sBA();
  T1();
  Y5 = vH8
})
// @from(Ln 189739, Col 0)
function YjA(A, Q) {
  if (!A) return;
  if (A.startsWith("rgb(") || A.startsWith("#") || A.startsWith("ansi256(") || A.startsWith("ansi:")) return A;
  return Q[A]
}
// @from(Ln 189745, Col 0)
function fH8({
  borderColor: A,
  borderTopColor: Q,
  borderBottomColor: B,
  borderLeftColor: G,
  borderRightColor: Z,
  children: Y,
  ref: J,
  ...X
}) {
  let [I] = oB(), D = jP(I), W = YjA(A, D), K = YjA(Q, D), V = YjA(B, D), F = YjA(G, D), H = YjA(Z, D);
  return sOB.default.createElement(eq, {
    ref: J,
    borderColor: W,
    borderTopColor: K,
    borderBottomColor: V,
    borderLeftColor: F,
    borderRightColor: H,
    ...X
  }, Y)
}
// @from(Ln 189766, Col 4)
sOB
// @from(Ln 189766, Col 9)
T
// @from(Ln 189767, Col 4)
tOB = w(() => {
  mBA();
  c_A();
  d_A();
  sOB = c(QA(), 1);
  T = fH8
})
// @from(Ln 189774, Col 4)
QMB = U((XkG, AMB) => {
  var hH8 = NA("os"),
    eOB = NA("tty"),
    Q_ = QUA(),
    {
      env: WF
    } = process,
    fa;
  if (Q_("no-color") || Q_("no-colors") || Q_("color=false") || Q_("color=never")) fa = 0;
  else if (Q_("color") || Q_("colors") || Q_("color=true") || Q_("color=always")) fa = 1;
  if ("FORCE_COLOR" in WF)
    if (WF.FORCE_COLOR === "true") fa = 1;
    else if (WF.FORCE_COLOR === "false") fa = 0;
  else fa = WF.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(WF.FORCE_COLOR, 10), 3);

  function EB0(A) {
    if (A === 0) return !1;
    return {
      level: A,
      hasBasic: !0,
      has256: A >= 2,
      has16m: A >= 3
    }
  }

  function zB0(A, Q) {
    if (fa === 0) return 0;
    if (Q_("color=16m") || Q_("color=full") || Q_("color=truecolor")) return 3;
    if (Q_("color=256")) return 2;
    if (A && !Q && fa === void 0) return 0;
    let B = fa || 0;
    if (WF.TERM === "dumb") return B;
    if (process.platform === "win32") {
      let G = hH8.release().split(".");
      if (Number(G[0]) >= 10 && Number(G[2]) >= 10586) return Number(G[2]) >= 14931 ? 3 : 2;
      return 1
    }
    if ("CI" in WF) {
      if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((G) => (G in WF)) || WF.CI_NAME === "codeship") return 1;
      return B
    }
    if ("TEAMCITY_VERSION" in WF) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(WF.TEAMCITY_VERSION) ? 1 : 0;
    if (WF.COLORTERM === "truecolor") return 3;
    if ("TERM_PROGRAM" in WF) {
      let G = parseInt((WF.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (WF.TERM_PROGRAM) {
        case "iTerm.app":
          return G >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2
      }
    }
    if (/-256(color)?$/i.test(WF.TERM)) return 2;
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(WF.TERM)) return 1;
    if ("COLORTERM" in WF) return 1;
    return B
  }

  function gH8(A) {
    let Q = zB0(A, A && A.isTTY);
    return EB0(Q)
  }
  AMB.exports = {
    supportsColor: gH8,
    stdout: EB0(zB0(!0, eOB.isatty(1))),
    stderr: EB0(zB0(!0, eOB.isatty(2)))
  }
})