
// @from(Ln 183164, Col 4)
sD8 = {}
// @from(Ln 183165, Col 4)
tqB
// @from(Ln 183166, Col 4)
eqB = w(() => {
  rqB();
  tqB = c(sqB(), 1);
  tqB.default.connectToDevTools()
})
// @from(Ln 183171, Col 4)
BNB
// @from(Ln 183171, Col 9)
ANB = (A, Q) => {
    if (A === Q) return;
    if (!A) return Q;
    let B = {},
      G = !1;
    for (let Z of Object.keys(A))
      if (Q ? !Object.hasOwn(Q, Z) : !0) B[Z] = void 0, G = !0;
    if (Q) {
      for (let Z of Object.keys(Q))
        if (Q[Z] !== A[Z]) B[Z] = Q[Z], G = !0
    }
    return G ? B : void 0
  }
// @from(Ln 183184, Col 2)
GNB = (A) => {
    if ("childNodes" in A)
      for (let Q of A.childNodes) GNB(Q);
    A.yogaNode = void 0
  }
// @from(Ln 183189, Col 2)
QNB = (A) => {
    let Q = A.yogaNode;
    if (Q) Q.unsetMeasureFunc(), GNB(A), Q.freeRecursive()
  }
// @from(Ln 183193, Col 2)
GQ0 = (A) => {
    let Q = A;
    while (Q.parentNode) Q = Q.parentNode;
    return Q
  }
// @from(Ln 183198, Col 2)
YQ0 = (A) => {
    if (A.internal_static) return A;
    for (let Q of A.childNodes) {
      if (Q.nodeName === "#text") continue;
      let B = YQ0(Q);
      if (B) return B
    }
    return
  }
// @from(Ln 183207, Col 2)
ZQ0
// @from(Ln 183207, Col 7)
Sa
// @from(Ln 183208, Col 4)
JQ0 = w(() => {
  iCB();
  PBA();
  mB1();
  nUB();
  BNB = c(lCB(), 1);
  if (process.env.DEV === "true") try {
    Promise.resolve().then(() => eqB())
  } catch (A) {
    if (A.code === "ERR_MODULE_NOT_FOUND") console.warn(`
The environment variable DEV is set to true, so Ink tried to import \`react-devtools-core\`,
but this failed as it was not installed. Debugging with React Devtools requires it.

To install use this command:

$ npm install --save-dev react-devtools-core
				`.trim() + `
`);
    else throw A
  }
  ZQ0 = q00, Sa = BNB.default({
    getRootHostContext: () => ({
      isInsideText: !1
    }),
    prepareForCommit: () => null,
    preparePortalMount: () => null,
    clearContainer: () => !1,
    resetAfterCommit(A) {
      if (typeof A.onComputeLayout === "function") A.onComputeLayout();
      if (A.isStaticDirty) {
        if (A.isStaticDirty = !1, typeof A.onImmediateRender === "function") A.onImmediateRender();
        return
      }
      A.onRender?.()
    },
    getChildHostContext(A, Q) {
      let B = A.isInsideText,
        G = Q === "ink-text" || Q === "ink-virtual-text" || Q === "ink-link";
      if (B === G) return A;
      return {
        isInsideText: G
      }
    },
    shouldSetTextContent: () => !1,
    createInstance(A, Q, B, G) {
      if (G.isInsideText && A === "ink-box") throw Error("<Box> can't be nested inside <Text> component");
      let Z = A === "ink-text" && G.isInsideText ? "ink-virtual-text" : A,
        Y = gB1(Z);
      for (let [J, X] of Object.entries(Q)) {
        if (J === "children") continue;
        if (J === "style") {
          if (u00(Y, X), Y.yogaNode) m00(Y.yogaNode, X);
          continue
        }
        if (J === "textStyles") {
          Y.textStyles = X;
          continue
        }
        if (J === "internal_static") {
          Y.internal_static = !0;
          continue
        }
        g00(Y, J, X)
      }
      return Y
    },
    createTextInstance(A, Q, B) {
      if (!B.isInsideText) throw Error(`Text string "${A}" must be rendered inside <Text> component`);
      return iUB(A)
    },
    resetTextContent() {},
    hideTextInstance(A) {
      O_A(A, "")
    },
    unhideTextInstance(A, Q) {
      O_A(A, Q)
    },
    getPublicInstance: (A) => A,
    hideInstance(A) {
      A.yogaNode?.setDisplay(OP.None)
    },
    unhideInstance(A) {
      A.yogaNode?.setDisplay(OP.Flex)
    },
    appendInitialChild: uB1,
    appendChild(A, Q) {
      if (uB1(A, Q), Q.internal_static) {
        let B = GQ0(A);
        B.isStaticDirty = !0, B.staticNode = Q
      }
    },
    insertBefore(A, Q, B) {
      if (h00(A, Q, B), Q.internal_static) {
        let G = GQ0(A);
        G.isStaticDirty = !0, G.staticNode = Q
      }
    },
    finalizeInitialChildren() {
      return !1
    },
    isPrimaryRenderer: !0,
    supportsMutation: !0,
    supportsPersistence: !1,
    supportsHydration: !1,
    scheduleTimeout: setTimeout,
    cancelTimeout: clearTimeout,
    noTimeout: -1,
    getCurrentUpdatePriority: () => ZQ0,
    beforeActiveInstanceBlur() {},
    afterActiveInstanceBlur() {},
    detachDeletedInstance() {},
    getInstanceFromNode: () => null,
    prepareScopeUpdate() {},
    getInstanceFromScope: () => null,
    appendChildToContainer(A, Q) {
      uB1(A, Q);
      let B = YQ0(Q);
      if (B) A.isStaticDirty = !0, A.staticNode = B
    },
    insertInContainerBefore(A, Q, B) {
      h00(A, Q, B);
      let G = YQ0(Q);
      if (G) A.isStaticDirty = !0, A.staticNode = G
    },
    removeChildFromContainer(A, Q) {
      L_A(A, Q), QNB(Q)
    },
    commitUpdate(A, Q, B, G) {
      if (A.internal_static) {
        let J = GQ0(A);
        J.isStaticDirty = !0
      }
      let Z = ANB(B, G),
        Y = ANB(B.style, G.style);
      if (Z)
        for (let [J, X] of Object.entries(Z)) {
          if (J === "style") {
            u00(A, X);
            continue
          }
          if (J === "textStyles") {
            A.textStyles = X, Jm(A);
            continue
          }
          if (J === "internal_static") {
            A.internal_static = !0;
            continue
          }
          g00(A, J, X)
        }
      if (Y && A.yogaNode) m00(A.yogaNode, Y)
    },
    commitTextUpdate(A, Q, B) {
      O_A(A, B)
    },
    removeChild(A, Q) {
      L_A(A, Q), QNB(Q)
    },
    maySuspendCommit() {
      return !1
    },
    preloadInstance() {
      return !0
    },
    startSuspendingCommit() {},
    suspendInstance() {},
    waitForCommitToBeReady() {
      return null
    },
    NotPendingTransition: null,
    HostTransitionContext: {
      $$typeof: Symbol.for("react.context"),
      _currentValue: null
    },
    setCurrentUpdatePriority(A) {
      ZQ0 = A
    },
    resolveUpdatePriority() {
      return ZQ0
    },
    resetFormInstance() {},
    requestPostPaintCallback() {},
    shouldAttemptEagerTransition() {
      return !1
    },
    trackSchedulerEvent() {},
    resolveEventType() {
      return null
    },
    resolveEventTimeStamp() {
      return -1.1
    }
  })
})
// @from(Ln 183403, Col 0)
function XQ0(A, Q = 1, B = {}) {
  let {
    indent: G = " ",
    includeEmptyLines: Z = !1
  } = B;
  if (typeof A !== "string") throw TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof A}\``);
  if (typeof Q !== "number") throw TypeError(`Expected \`count\` to be a \`number\`, got \`${typeof Q}\``);
  if (Q < 0) throw RangeError(`Expected \`count\` to be at least 0, got \`${Q}\``);
  if (typeof G !== "string") throw TypeError(`Expected \`options.indent\` to be a \`string\`, got \`${typeof G}\``);
  if (Q === 0) return A;
  let Y = Z ? /^/gm : /^(?!\s*$)/gm;
  return A.replace(Y, G.repeat(Q))
}
// @from(Ln 183416, Col 4)
tD8 = (A) => {
    return A.getComputedWidth() - A.getComputedPadding(g8.Left) - A.getComputedPadding(g8.Right) - A.getComputedBorder(g8.Left) - A.getComputedBorder(g8.Right)
  }
// @from(Ln 183419, Col 2)
ZNB
// @from(Ln 183420, Col 4)
YNB = w(() => {
  PBA();
  ZNB = tD8
})
// @from(Ln 183424, Col 4)
JNB = U((sTG, eD8) => {
  eD8.exports = {
    single: {
      topLeft: "┌",
      top: "─",
      topRight: "┐",
      right: "│",
      bottomRight: "┘",
      bottom: "─",
      bottomLeft: "└",
      left: "│"
    },
    double: {
      topLeft: "╔",
      top: "═",
      topRight: "╗",
      right: "║",
      bottomRight: "╝",
      bottom: "═",
      bottomLeft: "╚",
      left: "║"
    },
    round: {
      topLeft: "╭",
      top: "─",
      topRight: "╮",
      right: "│",
      bottomRight: "╯",
      bottom: "─",
      bottomLeft: "╰",
      left: "│"
    },
    bold: {
      topLeft: "┏",
      top: "━",
      topRight: "┓",
      right: "┃",
      bottomRight: "┛",
      bottom: "━",
      bottomLeft: "┗",
      left: "┃"
    },
    singleDouble: {
      topLeft: "╓",
      top: "─",
      topRight: "╖",
      right: "║",
      bottomRight: "╜",
      bottom: "─",
      bottomLeft: "╙",
      left: "║"
    },
    doubleSingle: {
      topLeft: "╒",
      top: "═",
      topRight: "╕",
      right: "│",
      bottomRight: "╛",
      bottom: "═",
      bottomLeft: "╘",
      left: "│"
    },
    classic: {
      topLeft: "+",
      top: "-",
      topRight: "+",
      right: "|",
      bottomRight: "+",
      bottom: "-",
      bottomLeft: "+",
      left: "|"
    },
    arrow: {
      topLeft: "↘",
      top: "↓",
      topRight: "↙",
      right: "←",
      bottomRight: "↖",
      bottom: "↑",
      bottomLeft: "↗",
      left: "→"
    }
  }
})
// @from(Ln 183508, Col 4)
INB = U((tTG, IQ0) => {
  var XNB = JNB();
  IQ0.exports = XNB;
  IQ0.exports.default = XNB
})
// @from(Ln 183514, Col 0)
function jP(A) {
  switch (A) {
    case "light":
      return AW8;
    case "light-ansi":
      return QW8;
    case "dark-ansi":
      return BW8;
    case "light-daltonized":
      return GW8;
    case "dark-daltonized":
      return YW8;
    default:
      return ZW8
  }
}
// @from(Ln 183531, Col 0)
function B21(A) {
  let Q = A.match(/rgb\(\s?(\d+),\s?(\d+),\s?(\d+)\s?\)/);
  if (Q) {
    let B = parseInt(Q[1], 10),
      G = parseInt(Q[2], 10),
      Z = parseInt(Q[3], 10),
      Y = JW8.rgb(B, G, Z)("X");
    return Y.slice(0, Y.indexOf("X"))
  }
  return "\x1B[35m"
}
// @from(Ln 183542, Col 4)
DNB
// @from(Ln 183542, Col 9)
AW8
// @from(Ln 183542, Col 14)
QW8
// @from(Ln 183542, Col 19)
BW8
// @from(Ln 183542, Col 24)
GW8
// @from(Ln 183542, Col 29)
ZW8
// @from(Ln 183542, Col 34)
YW8
// @from(Ln 183542, Col 39)
JW8
// @from(Ln 183543, Col 4)
mBA = w(() => {
  Z3();
  p3();
  DNB = ["dark", "light", "light-daltonized", "dark-daltonized", "light-ansi", "dark-ansi"], AW8 = {
    autoAccept: "rgb(135,0,255)",
    bashBorder: "rgb(255,0,135)",
    claude: "rgb(215,119,87)",
    claudeShimmer: "rgb(245,149,117)",
    claudeBlue_FOR_SYSTEM_SPINNER: "rgb(87,105,247)",
    claudeBlueShimmer_FOR_SYSTEM_SPINNER: "rgb(117,135,255)",
    permission: "rgb(87,105,247)",
    permissionShimmer: "rgb(137,155,255)",
    planMode: "rgb(0,102,102)",
    delegateMode: "rgb(138,43,226)",
    ide: "rgb(71,130,200)",
    promptBorder: "rgb(153,153,153)",
    promptBorderShimmer: "rgb(183,183,183)",
    text: "rgb(0,0,0)",
    inverseText: "rgb(255,255,255)",
    inactive: "rgb(102,102,102)",
    subtle: "rgb(175,175,175)",
    suggestion: "rgb(87,105,247)",
    remember: "rgb(0,0,255)",
    background: "rgb(0,153,153)",
    success: "rgb(44,122,57)",
    error: "rgb(171,43,63)",
    warning: "rgb(150,108,30)",
    warningShimmer: "rgb(200,158,80)",
    diffAdded: "rgb(105,219,124)",
    diffRemoved: "rgb(255,168,180)",
    diffAddedDimmed: "rgb(199,225,203)",
    diffRemovedDimmed: "rgb(253,210,216)",
    diffAddedWord: "rgb(47,157,68)",
    diffRemovedWord: "rgb(209,69,75)",
    red_FOR_SUBAGENTS_ONLY: "rgb(220,38,38)",
    blue_FOR_SUBAGENTS_ONLY: "rgb(37,99,235)",
    green_FOR_SUBAGENTS_ONLY: "rgb(22,163,74)",
    yellow_FOR_SUBAGENTS_ONLY: "rgb(202,138,4)",
    purple_FOR_SUBAGENTS_ONLY: "rgb(147,51,234)",
    orange_FOR_SUBAGENTS_ONLY: "rgb(234,88,12)",
    pink_FOR_SUBAGENTS_ONLY: "rgb(219,39,119)",
    cyan_FOR_SUBAGENTS_ONLY: "rgb(8,145,178)",
    professionalBlue: "rgb(106,155,204)",
    chromeYellow: "rgb(251,188,4)",
    rainbow_red: "rgb(235,95,87)",
    rainbow_orange: "rgb(245,139,87)",
    rainbow_yellow: "rgb(250,195,95)",
    rainbow_green: "rgb(145,200,130)",
    rainbow_blue: "rgb(130,170,220)",
    rainbow_indigo: "rgb(155,130,200)",
    rainbow_violet: "rgb(200,130,180)",
    rainbow_red_shimmer: "rgb(250,155,147)",
    rainbow_orange_shimmer: "rgb(255,185,137)",
    rainbow_yellow_shimmer: "rgb(255,225,155)",
    rainbow_green_shimmer: "rgb(185,230,180)",
    rainbow_blue_shimmer: "rgb(180,205,240)",
    rainbow_indigo_shimmer: "rgb(195,180,230)",
    rainbow_violet_shimmer: "rgb(230,180,210)",
    clawd_body: "rgb(215,119,87)",
    clawd_background: "rgb(0,0,0)",
    userMessageBackground: "rgb(240, 240, 240)",
    bashMessageBackgroundColor: "rgb(250, 245, 250)",
    memoryBackgroundColor: "rgb(230, 245, 250)",
    rate_limit_fill: "rgb(87,105,247)",
    rate_limit_empty: "rgb(39,47,111)"
  }, QW8 = {
    autoAccept: "ansi:magenta",
    bashBorder: "ansi:magenta",
    claude: "ansi:redBright",
    claudeShimmer: "ansi:yellowBright",
    claudeBlue_FOR_SYSTEM_SPINNER: "ansi:blue",
    claudeBlueShimmer_FOR_SYSTEM_SPINNER: "ansi:blueBright",
    permission: "ansi:blue",
    permissionShimmer: "ansi:blueBright",
    planMode: "ansi:cyan",
    delegateMode: "ansi:magenta",
    ide: "ansi:blueBright",
    promptBorder: "ansi:white",
    promptBorderShimmer: "ansi:whiteBright",
    text: "ansi:black",
    inverseText: "ansi:white",
    inactive: "ansi:blackBright",
    subtle: "ansi:blackBright",
    suggestion: "ansi:blue",
    remember: "ansi:blue",
    background: "ansi:cyan",
    success: "ansi:green",
    error: "ansi:red",
    warning: "ansi:yellow",
    warningShimmer: "ansi:yellowBright",
    diffAdded: "ansi:green",
    diffRemoved: "ansi:red",
    diffAddedDimmed: "ansi:green",
    diffRemovedDimmed: "ansi:red",
    diffAddedWord: "ansi:greenBright",
    diffRemovedWord: "ansi:redBright",
    red_FOR_SUBAGENTS_ONLY: "ansi:red",
    blue_FOR_SUBAGENTS_ONLY: "ansi:blue",
    green_FOR_SUBAGENTS_ONLY: "ansi:green",
    yellow_FOR_SUBAGENTS_ONLY: "ansi:yellow",
    purple_FOR_SUBAGENTS_ONLY: "ansi:magenta",
    orange_FOR_SUBAGENTS_ONLY: "ansi:redBright",
    pink_FOR_SUBAGENTS_ONLY: "ansi:magentaBright",
    cyan_FOR_SUBAGENTS_ONLY: "ansi:cyan",
    professionalBlue: "ansi:blueBright",
    chromeYellow: "ansi:yellow",
    rainbow_red: "ansi:red",
    rainbow_orange: "ansi:redBright",
    rainbow_yellow: "ansi:yellow",
    rainbow_green: "ansi:green",
    rainbow_blue: "ansi:cyan",
    rainbow_indigo: "ansi:blue",
    rainbow_violet: "ansi:magenta",
    rainbow_red_shimmer: "ansi:redBright",
    rainbow_orange_shimmer: "ansi:yellow",
    rainbow_yellow_shimmer: "ansi:yellowBright",
    rainbow_green_shimmer: "ansi:greenBright",
    rainbow_blue_shimmer: "ansi:cyanBright",
    rainbow_indigo_shimmer: "ansi:blueBright",
    rainbow_violet_shimmer: "ansi:magentaBright",
    clawd_body: "ansi:redBright",
    clawd_background: "ansi:black",
    userMessageBackground: "ansi:white",
    bashMessageBackgroundColor: "ansi:whiteBright",
    memoryBackgroundColor: "ansi:white",
    rate_limit_fill: "ansi:yellow",
    rate_limit_empty: "ansi:black"
  }, BW8 = {
    autoAccept: "ansi:magentaBright",
    bashBorder: "ansi:magentaBright",
    claude: "ansi:redBright",
    claudeShimmer: "ansi:yellowBright",
    claudeBlue_FOR_SYSTEM_SPINNER: "ansi:blueBright",
    claudeBlueShimmer_FOR_SYSTEM_SPINNER: "ansi:blueBright",
    permission: "ansi:blueBright",
    permissionShimmer: "ansi:blueBright",
    planMode: "ansi:cyanBright",
    delegateMode: "ansi:magentaBright",
    ide: "ansi:blue",
    promptBorder: "ansi:white",
    promptBorderShimmer: "ansi:whiteBright",
    text: "ansi:whiteBright",
    inverseText: "ansi:black",
    inactive: "ansi:white",
    subtle: "ansi:white",
    suggestion: "ansi:blueBright",
    remember: "ansi:blueBright",
    background: "ansi:cyanBright",
    success: "ansi:greenBright",
    error: "ansi:redBright",
    warning: "ansi:yellowBright",
    warningShimmer: "ansi:yellowBright",
    diffAdded: "ansi:green",
    diffRemoved: "ansi:red",
    diffAddedDimmed: "ansi:green",
    diffRemovedDimmed: "ansi:red",
    diffAddedWord: "ansi:greenBright",
    diffRemovedWord: "ansi:redBright",
    red_FOR_SUBAGENTS_ONLY: "ansi:redBright",
    blue_FOR_SUBAGENTS_ONLY: "ansi:blueBright",
    green_FOR_SUBAGENTS_ONLY: "ansi:greenBright",
    yellow_FOR_SUBAGENTS_ONLY: "ansi:yellowBright",
    purple_FOR_SUBAGENTS_ONLY: "ansi:magentaBright",
    orange_FOR_SUBAGENTS_ONLY: "ansi:redBright",
    pink_FOR_SUBAGENTS_ONLY: "ansi:magentaBright",
    cyan_FOR_SUBAGENTS_ONLY: "ansi:cyanBright",
    professionalBlue: "rgb(106,155,204)",
    chromeYellow: "ansi:yellowBright",
    rainbow_red: "ansi:red",
    rainbow_orange: "ansi:redBright",
    rainbow_yellow: "ansi:yellow",
    rainbow_green: "ansi:green",
    rainbow_blue: "ansi:cyan",
    rainbow_indigo: "ansi:blue",
    rainbow_violet: "ansi:magenta",
    rainbow_red_shimmer: "ansi:redBright",
    rainbow_orange_shimmer: "ansi:yellow",
    rainbow_yellow_shimmer: "ansi:yellowBright",
    rainbow_green_shimmer: "ansi:greenBright",
    rainbow_blue_shimmer: "ansi:cyanBright",
    rainbow_indigo_shimmer: "ansi:blueBright",
    rainbow_violet_shimmer: "ansi:magentaBright",
    clawd_body: "ansi:redBright",
    clawd_background: "ansi:black",
    userMessageBackground: "ansi:blackBright",
    bashMessageBackgroundColor: "ansi:black",
    memoryBackgroundColor: "ansi:blackBright",
    rate_limit_fill: "ansi:yellow",
    rate_limit_empty: "ansi:white"
  }, GW8 = {
    autoAccept: "rgb(135,0,255)",
    bashBorder: "rgb(0,102,204)",
    claude: "rgb(255,153,51)",
    claudeShimmer: "rgb(255,183,101)",
    claudeBlue_FOR_SYSTEM_SPINNER: "rgb(51,102,255)",
    claudeBlueShimmer_FOR_SYSTEM_SPINNER: "rgb(101,152,255)",
    permission: "rgb(51,102,255)",
    permissionShimmer: "rgb(101,152,255)",
    planMode: "rgb(51,102,102)",
    delegateMode: "rgb(138,43,226)",
    ide: "rgb(71,130,200)",
    promptBorder: "rgb(153,153,153)",
    promptBorderShimmer: "rgb(183,183,183)",
    text: "rgb(0,0,0)",
    inverseText: "rgb(255,255,255)",
    inactive: "rgb(102,102,102)",
    subtle: "rgb(175,175,175)",
    suggestion: "rgb(51,102,255)",
    remember: "rgb(51,102,255)",
    background: "rgb(0,153,153)",
    success: "rgb(0,102,153)",
    error: "rgb(204,0,0)",
    warning: "rgb(255,153,0)",
    warningShimmer: "rgb(255,183,50)",
    diffAdded: "rgb(153,204,255)",
    diffRemoved: "rgb(255,204,204)",
    diffAddedDimmed: "rgb(209,231,253)",
    diffRemovedDimmed: "rgb(255,233,233)",
    diffAddedWord: "rgb(51,102,204)",
    diffRemovedWord: "rgb(153,51,51)",
    red_FOR_SUBAGENTS_ONLY: "rgb(204,0,0)",
    blue_FOR_SUBAGENTS_ONLY: "rgb(0,102,204)",
    green_FOR_SUBAGENTS_ONLY: "rgb(0,204,0)",
    yellow_FOR_SUBAGENTS_ONLY: "rgb(255,204,0)",
    purple_FOR_SUBAGENTS_ONLY: "rgb(128,0,128)",
    orange_FOR_SUBAGENTS_ONLY: "rgb(255,128,0)",
    pink_FOR_SUBAGENTS_ONLY: "rgb(255,102,178)",
    cyan_FOR_SUBAGENTS_ONLY: "rgb(0,178,178)",
    professionalBlue: "rgb(106,155,204)",
    chromeYellow: "rgb(251,188,4)",
    rainbow_red: "rgb(235,95,87)",
    rainbow_orange: "rgb(245,139,87)",
    rainbow_yellow: "rgb(250,195,95)",
    rainbow_green: "rgb(145,200,130)",
    rainbow_blue: "rgb(130,170,220)",
    rainbow_indigo: "rgb(155,130,200)",
    rainbow_violet: "rgb(200,130,180)",
    rainbow_red_shimmer: "rgb(250,155,147)",
    rainbow_orange_shimmer: "rgb(255,185,137)",
    rainbow_yellow_shimmer: "rgb(255,225,155)",
    rainbow_green_shimmer: "rgb(185,230,180)",
    rainbow_blue_shimmer: "rgb(180,205,240)",
    rainbow_indigo_shimmer: "rgb(195,180,230)",
    rainbow_violet_shimmer: "rgb(230,180,210)",
    clawd_body: "rgb(215,119,87)",
    clawd_background: "rgb(0,0,0)",
    userMessageBackground: "rgb(220, 220, 220)",
    bashMessageBackgroundColor: "rgb(250, 245, 250)",
    memoryBackgroundColor: "rgb(230, 245, 250)",
    rate_limit_fill: "rgb(51,102,255)",
    rate_limit_empty: "rgb(23,46,114)"
  }, ZW8 = {
    autoAccept: "rgb(175,135,255)",
    bashBorder: "rgb(253,93,177)",
    claude: "rgb(215,119,87)",
    claudeShimmer: "rgb(235,159,127)",
    claudeBlue_FOR_SYSTEM_SPINNER: "rgb(147,165,255)",
    claudeBlueShimmer_FOR_SYSTEM_SPINNER: "rgb(177,195,255)",
    permission: "rgb(177,185,249)",
    permissionShimmer: "rgb(207,215,255)",
    planMode: "rgb(72,150,140)",
    delegateMode: "rgb(186,85,255)",
    ide: "rgb(71,130,200)",
    promptBorder: "rgb(136,136,136)",
    promptBorderShimmer: "rgb(166,166,166)",
    text: "rgb(255,255,255)",
    inverseText: "rgb(0,0,0)",
    inactive: "rgb(153,153,153)",
    subtle: "rgb(80,80,80)",
    suggestion: "rgb(177,185,249)",
    remember: "rgb(177,185,249)",
    background: "rgb(0,204,204)",
    success: "rgb(78,186,101)",
    error: "rgb(255,107,128)",
    warning: "rgb(255,193,7)",
    warningShimmer: "rgb(255,223,57)",
    diffAdded: "rgb(34,92,43)",
    diffRemoved: "rgb(122,41,54)",
    diffAddedDimmed: "rgb(71,88,74)",
    diffRemovedDimmed: "rgb(105,72,77)",
    diffAddedWord: "rgb(56,166,96)",
    diffRemovedWord: "rgb(179,89,107)",
    red_FOR_SUBAGENTS_ONLY: "rgb(220,38,38)",
    blue_FOR_SUBAGENTS_ONLY: "rgb(37,99,235)",
    green_FOR_SUBAGENTS_ONLY: "rgb(22,163,74)",
    yellow_FOR_SUBAGENTS_ONLY: "rgb(202,138,4)",
    purple_FOR_SUBAGENTS_ONLY: "rgb(147,51,234)",
    orange_FOR_SUBAGENTS_ONLY: "rgb(234,88,12)",
    pink_FOR_SUBAGENTS_ONLY: "rgb(219,39,119)",
    cyan_FOR_SUBAGENTS_ONLY: "rgb(8,145,178)",
    professionalBlue: "rgb(106,155,204)",
    chromeYellow: "rgb(251,188,4)",
    rainbow_red: "rgb(235,95,87)",
    rainbow_orange: "rgb(245,139,87)",
    rainbow_yellow: "rgb(250,195,95)",
    rainbow_green: "rgb(145,200,130)",
    rainbow_blue: "rgb(130,170,220)",
    rainbow_indigo: "rgb(155,130,200)",
    rainbow_violet: "rgb(200,130,180)",
    rainbow_red_shimmer: "rgb(250,155,147)",
    rainbow_orange_shimmer: "rgb(255,185,137)",
    rainbow_yellow_shimmer: "rgb(255,225,155)",
    rainbow_green_shimmer: "rgb(185,230,180)",
    rainbow_blue_shimmer: "rgb(180,205,240)",
    rainbow_indigo_shimmer: "rgb(195,180,230)",
    rainbow_violet_shimmer: "rgb(230,180,210)",
    clawd_body: "rgb(215,119,87)",
    clawd_background: "rgb(0,0,0)",
    userMessageBackground: "rgb(55, 55, 55)",
    bashMessageBackgroundColor: "rgb(65, 60, 65)",
    memoryBackgroundColor: "rgb(55, 65, 70)",
    rate_limit_fill: "rgb(177,185,249)",
    rate_limit_empty: "rgb(80,83,112)"
  }, YW8 = {
    autoAccept: "rgb(175,135,255)",
    bashBorder: "rgb(51,153,255)",
    claude: "rgb(255,153,51)",
    claudeShimmer: "rgb(255,183,101)",
    claudeBlue_FOR_SYSTEM_SPINNER: "rgb(153,204,255)",
    claudeBlueShimmer_FOR_SYSTEM_SPINNER: "rgb(183,224,255)",
    permission: "rgb(153,204,255)",
    permissionShimmer: "rgb(183,224,255)",
    planMode: "rgb(102,153,153)",
    delegateMode: "rgb(186,85,255)",
    ide: "rgb(71,130,200)",
    promptBorder: "rgb(136,136,136)",
    promptBorderShimmer: "rgb(166,166,166)",
    text: "rgb(255,255,255)",
    inverseText: "rgb(0,0,0)",
    inactive: "rgb(153,153,153)",
    subtle: "rgb(80,80,80)",
    suggestion: "rgb(153,204,255)",
    remember: "rgb(153,204,255)",
    background: "rgb(0,204,204)",
    success: "rgb(51,153,255)",
    error: "rgb(255,102,102)",
    warning: "rgb(255,204,0)",
    warningShimmer: "rgb(255,234,50)",
    diffAdded: "rgb(0,68,102)",
    diffRemoved: "rgb(102,0,0)",
    diffAddedDimmed: "rgb(62,81,91)",
    diffRemovedDimmed: "rgb(62,44,44)",
    diffAddedWord: "rgb(0,119,179)",
    diffRemovedWord: "rgb(179,0,0)",
    red_FOR_SUBAGENTS_ONLY: "rgb(255,102,102)",
    blue_FOR_SUBAGENTS_ONLY: "rgb(102,178,255)",
    green_FOR_SUBAGENTS_ONLY: "rgb(102,255,102)",
    yellow_FOR_SUBAGENTS_ONLY: "rgb(255,255,102)",
    purple_FOR_SUBAGENTS_ONLY: "rgb(178,102,255)",
    orange_FOR_SUBAGENTS_ONLY: "rgb(255,178,102)",
    pink_FOR_SUBAGENTS_ONLY: "rgb(255,153,204)",
    cyan_FOR_SUBAGENTS_ONLY: "rgb(102,204,204)",
    professionalBlue: "rgb(106,155,204)",
    chromeYellow: "rgb(251,188,4)",
    rainbow_red: "rgb(235,95,87)",
    rainbow_orange: "rgb(245,139,87)",
    rainbow_yellow: "rgb(250,195,95)",
    rainbow_green: "rgb(145,200,130)",
    rainbow_blue: "rgb(130,170,220)",
    rainbow_indigo: "rgb(155,130,200)",
    rainbow_violet: "rgb(200,130,180)",
    rainbow_red_shimmer: "rgb(250,155,147)",
    rainbow_orange_shimmer: "rgb(255,185,137)",
    rainbow_yellow_shimmer: "rgb(255,225,155)",
    rainbow_green_shimmer: "rgb(185,230,180)",
    rainbow_blue_shimmer: "rgb(180,205,240)",
    rainbow_indigo_shimmer: "rgb(195,180,230)",
    rainbow_violet_shimmer: "rgb(230,180,210)",
    clawd_body: "rgb(215,119,87)",
    clawd_background: "rgb(0,0,0)",
    userMessageBackground: "rgb(55, 55, 55)",
    bashMessageBackgroundColor: "rgb(65, 60, 65)",
    memoryBackgroundColor: "rgb(55, 65, 70)",
    rate_limit_fill: "rgb(153,204,255)",
    rate_limit_empty: "rgb(69,92,115)"
  };
  JW8 = l0.terminal === "Apple_Terminal" ? new pT1({
    level: 2
  }) : I1
})
// @from(Ln 183924, Col 0)
function b_A(A, Q) {
  let B = A;
  if (Q.inverse) B = I1.inverse(B);
  if (Q.strikethrough) B = I1.strikethrough(B);
  if (Q.underline) B = I1.underline(B);
  if (Q.italic) B = I1.italic(B);
  if (Q.bold) B = I1.bold(B);
  if (Q.dim) B = I1.dim(B);
  if (Q.color) B = k_A(B, Q.color, "foreground");
  if (Q.backgroundColor) B = k_A(B, Q.backgroundColor, "background");
  return B
}
// @from(Ln 183937, Col 0)
function Mk(A, Q) {
  if (!Q) return A;
  return k_A(A, Q, "foreground")
}
// @from(Ln 183942, Col 0)
function sQ(A, Q, B = "foreground") {
  return (G) => {
    if (!A) return G;
    if (A.startsWith("rgb(") || A.startsWith("#") || A.startsWith("ansi256(") || A.startsWith("ansi:")) return k_A(G, A, B);
    return k_A(G, jP(Q)[A], B)
  }
}
// @from(Ln 183949, Col 4)
XW8
// @from(Ln 183949, Col 9)
IW8
// @from(Ln 183949, Col 14)
k_A = (A, Q, B) => {
  if (!Q) return A;
  if (Q.startsWith("ansi:")) switch (Q.substring(5)) {
    case "black":
      return B === "foreground" ? I1.black(A) : I1.bgBlack(A);
    case "red":
      return B === "foreground" ? I1.red(A) : I1.bgRed(A);
    case "green":
      return B === "foreground" ? I1.green(A) : I1.bgGreen(A);
    case "yellow":
      return B === "foreground" ? I1.yellow(A) : I1.bgYellow(A);
    case "blue":
      return B === "foreground" ? I1.blue(A) : I1.bgBlue(A);
    case "magenta":
      return B === "foreground" ? I1.magenta(A) : I1.bgMagenta(A);
    case "cyan":
      return B === "foreground" ? I1.cyan(A) : I1.bgCyan(A);
    case "white":
      return B === "foreground" ? I1.white(A) : I1.bgWhite(A);
    case "blackBright":
      return B === "foreground" ? I1.blackBright(A) : I1.bgBlackBright(A);
    case "redBright":
      return B === "foreground" ? I1.redBright(A) : I1.bgRedBright(A);
    case "greenBright":
      return B === "foreground" ? I1.greenBright(A) : I1.bgGreenBright(A);
    case "yellowBright":
      return B === "foreground" ? I1.yellowBright(A) : I1.bgYellowBright(A);
    case "blueBright":
      return B === "foreground" ? I1.blueBright(A) : I1.bgBlueBright(A);
    case "magentaBright":
      return B === "foreground" ? I1.magentaBright(A) : I1.bgMagentaBright(A);
    case "cyanBright":
      return B === "foreground" ? I1.cyanBright(A) : I1.bgCyanBright(A);
    case "whiteBright":
      return B === "foreground" ? I1.whiteBright(A) : I1.bgWhiteBright(A)
  }
  if (Q.startsWith("#")) return B === "foreground" ? I1.hex(Q)(A) : I1.bgHex(Q)(A);
  if (Q.startsWith("ansi256")) {
    let G = IW8.exec(Q);
    if (!G) return A;
    let Z = Number(G[1]);
    return B === "foreground" ? I1.ansi256(Z)(A) : I1.bgAnsi256(Z)(A)
  }
  if (Q.startsWith("rgb")) {
    let G = XW8.exec(Q);
    if (!G) return A;
    let Z = Number(G[1]),
      Y = Number(G[2]),
      J = Number(G[3]);
    return B === "foreground" ? I1.rgb(Z, Y, J)(A) : I1.bgRgb(Z, Y, J)(A)
  }
  return A
}
// @from(Ln 184002, Col 4)
dBA = w(() => {
  Z3();
  mBA();
  XW8 = /^rgb\(\s?(\d+),\s?(\d+),\s?(\d+)\s?\)$/, IW8 = /^ansi256\(\s?(\d+)\s?\)$/
})
// @from(Ln 184008, Col 0)
function WNB(A, Q, B, G = 0, Z) {
  let Y = A9(Q),
    J = A.length;
  if (Y >= J - 2) return Q.substring(0, J);
  let X;
  if (B === "center") X = Math.floor((J - Y) / 2);
  else if (B === "start") X = G + 1;
  else X = J - Y - G - 1;
  X = Math.max(1, Math.min(X, J - Y - 1));
  let I = Z.repeat(X - 1),
    D = Z.repeat(J - X - Y - 1);
  return A.substring(0, 1) + I + Q + D + A.substring(A.length - 1)
}
// @from(Ln 184021, Col 4)
KNB
// @from(Ln 184021, Col 9)
DW8
// @from(Ln 184021, Col 14)
WW8 = (A, Q, B, G) => {
    if (B.style.borderStyle) {
      let Z = Math.floor(B.yogaNode.getComputedWidth()),
        Y = Math.floor(B.yogaNode.getComputedHeight()),
        J = typeof B.style.borderStyle === "string" ? DW8[B.style.borderStyle] ?? KNB.default[B.style.borderStyle] : B.style.borderStyle,
        X = B.style.borderTopColor ?? B.style.borderColor,
        I = B.style.borderBottomColor ?? B.style.borderColor,
        D = B.style.borderLeftColor ?? B.style.borderColor,
        W = B.style.borderRightColor ?? B.style.borderColor,
        K = B.style.borderTopDimColor ?? B.style.borderDimColor,
        V = B.style.borderBottomDimColor ?? B.style.borderDimColor,
        F = B.style.borderLeftDimColor ?? B.style.borderDimColor,
        H = B.style.borderRightDimColor ?? B.style.borderDimColor,
        E = B.style.borderTop !== !1,
        z = B.style.borderBottom !== !1,
        $ = B.style.borderLeft !== !1,
        O = B.style.borderRight !== !1,
        L = Math.max(0, Z - ($ ? 1 : 0) - (O ? 1 : 0)),
        M = E ? ($ ? J.topLeft : "") + J.top.repeat(L) + (O ? J.topRight : "") : "";
      if (E && B.style.borderText?.position === "top") {
        let AA = B.style.borderText;
        M = WNB(M, AA.content, AA.align, AA.offset, J.top)
      }
      let _ = E ? Mk(M, X) : void 0;
      if (E && K) _ = I1.dim(_);
      let j = Y;
      if (E) j -= 1;
      if (z) j -= 1;
      j = Math.max(0, j);
      let x = (Mk(J.left, D) + `
`).repeat(j);
      if (F) x = I1.dim(x);
      let b = (Mk(J.right, W) + `
`).repeat(j);
      if (H) b = I1.dim(b);
      let S = z ? ($ ? J.bottomLeft : "") + J.bottom.repeat(L) + (O ? J.bottomRight : "") : "";
      if (z && B.style.borderText?.position === "bottom") {
        let AA = B.style.borderText;
        S = WNB(S, AA.content, AA.align, AA.offset, J.bottom)
      }
      let u = z ? Mk(S, I) : void 0;
      if (z && V) u = I1.dim(u);
      let f = E ? 1 : 0;
      if (_) G.write(A, Q, _);
      if ($) G.write(A, Q + f, x);
      if (O) G.write(A + Z - 1, Q + f, b);
      if (u) G.write(A, Q + Y - 1, u)
    }
  }
// @from(Ln 184070, Col 2)
VNB
// @from(Ln 184071, Col 4)
FNB = w(() => {
  Z3();
  UC();
  dBA();
  KNB = c(INB(), 1), DW8 = {
    dashed: {
      top: "╌",
      left: "╎",
      right: "╎",
      bottom: "╌",
      topLeft: " ",
      topRight: " ",
      bottomLeft: " ",
      bottomRight: " "
    }
  };
  VNB = WW8
})
// @from(Ln 184090, Col 0)
function zNB(A, Q) {
  return `${HNB}8;;${Q}${ENB}${A}${HNB}8;;${ENB}`
}
// @from(Ln 184094, Col 0)
function KW8(A) {
  let Q = [];
  for (let B = 0; B < A.length; B++) {
    let G = A[B].text.length;
    for (let Z = 0; Z < G; Z++) Q.push(B)
  }
  return Q
}
// @from(Ln 184103, Col 0)
function VW8(A, Q, B, G, Z = !1) {
  let Y = A.split(`
`),
    J = [],
    X = 0;
  for (let I = 0; I < Y.length; I++) {
    let D = Y[I];
    if (Z && D.length > 0) {
      let E = /\s/.test(D[0]);
      if (X < G.length && /\s/.test(G[X]) && !E)
        while (X < G.length && /\s/.test(G[X])) X++
    }
    let W = "",
      K = 0,
      V = B[X] ?? 0;
    for (let E = 0; E < D.length; E++) {
      let z = B[X] ?? V;
      if (z !== V) {
        let $ = D.slice(K, E),
          O = Q[V];
        if (O) W += b_A($, O.styles);
        else W += $;
        K = E, V = z
      }
      X++
    }
    let F = D.slice(K),
      H = Q[V];
    if (H) W += b_A(F, H.styles);
    else W += F;
    if (J.push(W), X < G.length && G[X] === `
`) X++;
    if (Z && I < Y.length - 1) {
      let E = Y[I + 1],
        z = E.length > 0 ? E[0] : null;
      while (X < G.length && /\s/.test(G[X])) {
        if (z !== null && G[X] === z) break;
        X++
      }
    }
  }
  return J.join(`
`)
}
// @from(Ln 184148, Col 0)
function FW8(A, Q) {
  let B = A.childNodes[0]?.yogaNode;
  if (B) {
    let G = B.getComputedLeft(),
      Z = B.getComputedTop();
    Q = `
`.repeat(Z) + XQ0(Q, G)
  }
  return Q
}
// @from(Ln 184159, Col 0)
function DQ0(A, Q, {
  offsetX: B = 0,
  offsetY: G = 0,
  skipStaticElements: Z,
  prevScreen: Y,
  ink2: J
}) {
  if (Z && A.internal_static) return;
  let {
    yogaNode: X
  } = A;
  if (X) {
    if (X.getDisplay() === OP.None) {
      if (J && A.dirty) {
        let F = G21.get(A);
        if (F) Q.clear({
          x: Math.floor(F.x),
          y: Math.floor(F.y),
          width: Math.floor(F.width),
          height: Math.floor(F.height)
        }), G21.delete(A)
      }
      return
    }
    let I = B + X.getComputedLeft(),
      D = G + X.getComputedTop(),
      W = X.getComputedWidth(),
      K = X.getComputedHeight(),
      V = G21.get(A);
    if (J && !A.dirty && V && V.x === I && V.y === D && V.width === W && V.height === K && Y) {
      Q.blit(Y, {
        x: Math.floor(I),
        y: Math.floor(D),
        width: Math.floor(W),
        height: Math.floor(K)
      });
      return
    }
    if (J && V && A.dirty) {
      let F = Math.floor(V.x),
        H = Math.floor(V.y),
        E = Math.floor(V.x + V.width),
        z = Math.floor(V.y + V.height),
        $ = Math.floor(I),
        O = Math.floor(D),
        L = Math.floor(I + W),
        M = Math.floor(D + K);
      if (F !== $ || H !== O) Q.clear({
        x: F,
        y: H,
        width: Math.floor(V.width),
        height: Math.floor(V.height)
      });
      else {
        if (E > L) Q.clear({
          x: L,
          y: H,
          width: E - L,
          height: Math.floor(V.height)
        });
        if (z > M) Q.clear({
          x: F,
          y: M,
          width: Math.floor(V.width),
          height: z - M
        })
      }
    }
    if (A.nodeName === "ink-text") {
      let F = kB1(A),
        H = F.map((E) => E.text).join("");
      if (H.length > 0) {
        let E = ZNB(X),
          z = A.style.textWrap ?? "wrap",
          $ = fIA(H) > E,
          O;
        if ($ && F.length === 1) {
          let L = F[0];
          if (O = MP(H, E, z).split(`
`).map((_) => b_A(_, L.styles)).join(`
`), L.hyperlink) O = zNB(O, L.hyperlink)
        } else if ($) {
          let L = MP(H, E, z),
            M = KW8(F);
          O = VW8(L, F, M, H, z === "wrap-trim")
        } else O = F.map((L) => {
          let M = b_A(L.text, L.styles);
          if (L.hyperlink) M = zNB(M, L.hyperlink);
          return M
        }).join("");
        O = FW8(A, O), Q.write(I, D, O)
      }
    } else if (A.nodeName === "ink-box") {
      let F = A.style.overflowX === "hidden" || A.style.overflow === "hidden",
        H = A.style.overflowY === "hidden" || A.style.overflow === "hidden",
        E = F || H;
      if (E) {
        let z = F ? I + X.getComputedBorder(g8.Left) : void 0,
          $ = F ? I + X.getComputedWidth() - X.getComputedBorder(g8.Right) : void 0,
          O = H ? D + X.getComputedBorder(g8.Top) : void 0,
          L = H ? D + X.getComputedHeight() - X.getComputedBorder(g8.Bottom) : void 0;
        Q.clip({
          x1: z,
          x2: $,
          y1: O,
          y2: L
        })
      }
      for (let z of A.childNodes) DQ0(z, Q, {
        offsetX: I,
        offsetY: D,
        skipStaticElements: Z,
        prevScreen: Y,
        ink2: J
      });
      if (E) Q.unclip();
      VNB(I, D, A, Q)
    } else if (A.nodeName === "ink-root")
      for (let F of A.childNodes) DQ0(F, Q, {
        offsetX: I,
        offsetY: D,
        skipStaticElements: Z,
        prevScreen: Y,
        ink2: J
      });
    G21.set(A, {
      x: I,
      y: D,
      width: W,
      height: K
    }), A.dirty = !1
  }
}
// @from(Ln 184292, Col 4)
G21
// @from(Ln 184292, Col 9)
HNB = "\x1B]"
// @from(Ln 184293, Col 2)
ENB = "\x07"
// @from(Ln 184294, Col 2)
WQ0
// @from(Ln 184295, Col 4)
$NB = w(() => {
  _B1();
  PBA();
  vB1();
  YNB();
  S00();
  FNB();
  dBA();
  G21 = new WeakMap;
  WQ0 = DQ0
})
// @from(Ln 184307, Col 0)
function FQ0(A) {
  if (Z21.has(A)) return A;
  if (KQ0.has(A)) return KQ0.get(A);
  if (A.startsWith(Y21)) return HW8;
  if (A = A.slice(2), A.startsWith("38")) return kD.color.close;
  else if (A.startsWith("48")) return kD.bgColor.close;
  let Q = kD.codes.get(parseInt(A, 10));
  if (Q) return kD.color.ansi(Q);
  else return kD.reset.open
}
// @from(Ln 184318, Col 0)
function nL(A) {
  return A.map((Q) => Q.code).join("")
}
// @from(Ln 184321, Col 4)
CNB
// @from(Ln 184321, Col 9)
UNB
// @from(Ln 184321, Col 14)
qNB
// @from(Ln 184321, Col 19)
Z21
// @from(Ln 184321, Col 24)
KQ0
// @from(Ln 184321, Col 29)
Y21 = "\x1B]8;;"
// @from(Ln 184322, Col 2)
VQ0
// @from(Ln 184322, Col 7)
NNB = "\x07"
// @from(Ln 184323, Col 2)
UPG
// @from(Ln 184323, Col 7)
HW8
// @from(Ln 184324, Col 4)
f_A = w(() => {
  w_A();
  CNB = new Set([27, 155]), UNB = "[".codePointAt(0), qNB = "]".codePointAt(0), Z21 = new Set, KQ0 = new Map;
  for (let [A, Q] of kD.codes) Z21.add(kD.color.ansi(Q)), KQ0.set(kD.color.ansi(A), kD.color.ansi(Q));
  VQ0 = Y21.split("").map((A) => A.charCodeAt(0)), UPG = NNB.charCodeAt(0), HW8 = `\x1B]8;;${NNB}`
})
// @from(Ln 184331, Col 0)
function xa(A) {
  return J21([], A)
}
// @from(Ln 184335, Col 0)
function J21(A, Q) {
  let B = [...A];
  for (let G of Q)
    if (G.code === kD.reset.open) B = [];
    else if (Z21.has(G.code)) B = B.filter((Z) => Z.endCode !== G.code);
  else if (G.code === kD.bold.open || G.code === kD.dim.open) {
    if (!B.find((Y) => Y.code === G.code && Y.endCode === G.endCode)) B.push(G)
  } else B = B.filter((Y) => Y.endCode !== G.endCode), B.push(G);
  return B
}
// @from(Ln 184345, Col 4)
X21 = w(() => {
  w_A();
  f_A()
})
// @from(Ln 184350, Col 0)
function cBA(A) {
  return xa(A).reverse().map((Q) => ({
    ...Q,
    code: Q.endCode
  }))
}
// @from(Ln 184356, Col 4)
HQ0 = w(() => {
  X21()
})
// @from(Ln 184360, Col 0)
function Rk(A, Q) {
  let B = new Set(Q.map((Z) => Z.endCode)),
    G = new Set(A.map((Z) => Z.code));
  return [...cBA(A.filter((Z) => !B.has(Z.endCode))), ...Q.filter((Z) => !G.has(Z.code))]
}
// @from(Ln 184365, Col 4)
EQ0 = w(() => {
  HQ0()
})
// @from(Ln 184369, Col 0)
function wNB(A) {
  let Q = [],
    B = [];
  for (let G of A)
    if (G.type === "ansi") Q = J21(Q, [G]);
    else if (G.type === "char") B.push({
    ...G,
    styles: [...Q]
  });
  return B
}
// @from(Ln 184381, Col 0)
function LNB(A) {
  let Q = "";
  for (let B = 0; B < A.length; B++) {
    let G = A[B];
    if (B === 0) Q += nL(G.styles);
    else Q += nL(Rk(A[B - 1].styles, G.styles));
    if (Q += G.value, B === A.length - 1) Q += nL(Rk(G.styles, []))
  }
  return Q
}
// @from(Ln 184391, Col 4)
ONB = w(() => {
  f_A();
  EQ0();
  X21()
})
// @from(Ln 184397, Col 0)
function zQ0(A) {
  if (!Number.isInteger(A)) return !1;
  return C_A(A) || U_A(A)
}
// @from(Ln 184401, Col 4)
MNB = w(() => {
  q_A()
})
// @from(Ln 184405, Col 0)
function EW8(A, Q) {
  A = A.slice(Q);
  for (let G = 1; G < VQ0.length; G++)
    if (A.charCodeAt(G) !== VQ0[G]) return;
  let B = A.indexOf("\x07", Y21.length);
  if (B === -1) return;
  return A.slice(0, B + 1)
}
// @from(Ln 184414, Col 0)
function qW8(A) {
  for (let Q = 2; Q < A.length; Q++) {
    let B = A.charCodeAt(Q);
    if (B === UW8) return Q;
    if (B === CW8) continue;
    if (B >= zW8 && B <= $W8) continue;
    break
  }
  return -1
}
// @from(Ln 184425, Col 0)
function NW8(A, Q) {
  A = A.slice(Q);
  let B = qW8(A);
  if (B === -1) return;
  return A.slice(0, B + 1)
}
// @from(Ln 184432, Col 0)
function wW8(A) {
  if (!A.includes(";")) return [A];
  let Q = A.slice(2, -1).split(";"),
    B = [];
  for (let G = 0; G < Q.length; G++) {
    let Z = Q[G];
    if (Z === "38" || Z === "48") {
      if (G + 2 < Q.length && Q[G + 1] === "5") {
        B.push(Q.slice(G, G + 3).join(";")), G += 2;
        continue
      } else if (G + 4 < Q.length && Q[G + 1] === "2") {
        B.push(Q.slice(G, G + 5).join(";")), G += 4;
        continue
      }
    }
    B.push(Z)
  }
  return B.map((G) => `\x1B[${G}m`)
}
// @from(Ln 184452, Col 0)
function oIA(A, Q = Number.POSITIVE_INFINITY) {
  let B = [],
    G = 0,
    Z = 0;
  while (G < A.length) {
    let Y = A.codePointAt(G);
    if (CNB.has(Y)) {
      let I, D = A.codePointAt(G + 1);
      if (D === qNB) {
        if (I = EW8(A, G), I) B.push({
          type: "ansi",
          code: I,
          endCode: FQ0(I)
        })
      } else if (D === UNB) {
        if (I = NW8(A, G), I) {
          let W = wW8(I);
          for (let K of W) B.push({
            type: "ansi",
            code: K,
            endCode: FQ0(K)
          })
        }
      }
      if (I) {
        G += I.length;
        continue
      }
    }
    let J = zQ0(Y),
      X = String.fromCodePoint(Y);
    if (B.push({
        type: "char",
        value: X,
        fullWidth: J
      }), G += X.length, Z += J ? 2 : X.length, Z >= Q) break
  }
  return B
}
// @from(Ln 184491, Col 4)
zW8 = 48
// @from(Ln 184492, Col 2)
$W8 = 57
// @from(Ln 184493, Col 2)
CW8 = 59
// @from(Ln 184494, Col 2)
UW8 = 109
// @from(Ln 184495, Col 4)
RNB = w(() => {
  MNB();
  f_A()
})
// @from(Ln 184499, Col 4)
rIA = w(() => {
  f_A();
  EQ0();
  X21();
  HQ0();
  ONB();
  RNB()
})
// @from(Ln 184508, Col 0)
function LW8(A) {
  return A.code === A.endCode
}
// @from(Ln 184512, Col 0)
function _NB(A) {
  return A.filter((Q) => !LW8(Q))
}
// @from(Ln 184516, Col 0)
function h_A(A, Q, B) {
  let G = oIA(A, B),
    Z = [],
    Y = 0,
    J = "",
    X = !1;
  for (let D of G) {
    if (B !== void 0 && Y >= B) break;
    if (D.type === "ansi") {
      if (Z.push(D), X) J += D.code
    } else {
      if (!X && Y >= Q) X = !0, Z = _NB(xa(Z)), J = nL(Z);
      if (X) J += D.value;
      Y += D.fullWidth ? 2 : D.value.length
    }
  }
  let I = _NB(xa(Z));
  return J += nL(cBA(I)), J
}
// @from(Ln 184535, Col 4)
$Q0 = w(() => {
  rIA()
})
// @from(Ln 184539, Col 0)
function I21(A, Q) {
  let B = Math.min(A.x, Q.x),
    G = Math.min(A.y, Q.y),
    Z = Math.max(A.x + A.width, Q.x + Q.width),
    Y = Math.max(A.y + A.height, Q.y + Q.height);
  return {
    x: B,
    y: G,
    width: Z - B,
    height: Y - G
  }
}
// @from(Ln 184552, Col 0)
function jNB(A, Q) {
  return Q.x >= 0 && Q.y >= 0 && Q.x < A.width && Q.y < A.height
}
// @from(Ln 184555, Col 4)
TNB = () => {}
// @from(Ln 184557, Col 0)
function bD(A, Q) {
  if (A === void 0) return;
  if (Number.isInteger(A)) return;
  k(`${Q} should be an integer, got ${A}`, {
    level: "warn"
  })
}
// @from(Ln 184564, Col 4)
CQ0 = w(() => {
  T1()
})
// @from(Ln 184567, Col 0)
class UQ0 {
  ids = new Map;
  styles = [];
  none;
  constructor() {
    this.none = this.intern([])
  }
  intern(A) {
    let Q = A.length === 0 ? "" : A.map((G) => G.code).join("\x00"),
      B = this.ids.get(Q);
    if (B === void 0) B = this.styles.length, this.styles.push(A.length === 0 ? [] : A), this.ids.set(Q, B);
    return B
  }
  get(A) {
    return this.styles[A] ?? []
  }
}
// @from(Ln 184585, Col 0)
function qQ0(A, Q) {
  return Q === A.emptyCell
}
// @from(Ln 184589, Col 0)
function OW8(A, Q) {
  if (A === Q) return !0;
  return A.char === Q.char && A.width === Q.width && A.hyperlink === Q.hyperlink && A.styleId === Q.styleId
}
// @from(Ln 184594, Col 0)
function sIA(A, Q, B) {
  if (bD(A, "createScreen width"), bD(Q, "createScreen height"), !Number.isInteger(A) || A < 0) A = Math.max(0, Math.floor(A) || 0);
  if (!Number.isInteger(Q) || Q < 0) Q = Math.max(0, Math.floor(Q) || 0);
  let G = Object.freeze({
      char: " ",
      styleId: B.none,
      width: 0,
      hyperlink: void 0
    }),
    Z = Object.freeze({
      char: "",
      styleId: B.none,
      width: 2,
      hyperlink: void 0
    }),
    Y = Array(A * Q).fill(G);
  return {
    width: A,
    height: Q,
    cells: Y,
    emptyCell: G,
    spacerCell: Z,
    damage: void 0
  }
}
// @from(Ln 184620, Col 0)
function SNB(A, Q) {
  if (!jNB(A, Q)) return;
  let B = Q.y * A.width + Q.x;
  return A.cells[B]
}
// @from(Ln 184626, Col 0)
function xNB(A, Q, B) {
  if (Q < 0 || B < 0 || Q >= A.width || B >= A.height) return;
  return A.cells[B * A.width + Q]
}
// @from(Ln 184631, Col 0)
function g_A(A, Q, B, G) {
  if (Q < 0 || B < 0 || Q >= A.width || B >= A.height) return;
  let Z = B * A.width + Q;
  A.cells[Z] = G;
  let Y = A.damage;
  if (Y) {
    let J = Y.x + Y.width,
      X = Y.y + Y.height;
    if (Q < Y.x) Y.width += Y.x - Q, Y.x = Q;
    else if (Q >= J) Y.width = Q - Y.x + 1;
    if (B < Y.y) Y.height += Y.y - B, Y.y = B;
    else if (B >= X) Y.height = B - Y.y + 1
  } else A.damage = {
    x: Q,
    y: B,
    width: 1,
    height: 1
  };
  if (G.width === 1) {
    let J = Q + 1;
    if (J < A.width) A.cells[B * A.width + J] = A.spacerCell
  }
}
// @from(Ln 184655, Col 0)
function vNB(A) {
  for (let Q of A) {
    let B = Q.code.match(yNB);
    if (B) return B[1] || null
  }
  return null
}
// @from(Ln 184663, Col 0)
function kNB(A) {
  return A.filter((Q) => !yNB.test(Q.code))
}
// @from(Ln 184667, Col 0)
function NQ0(A, Q) {
  let B = [],
    G = A.cells,
    Z = Q.cells,
    Y = A.width,
    J = Q.width,
    X = A.height,
    I = Q.height,
    D;
  if (Y === 0 && X === 0) D = {
    x: 0,
    y: 0,
    width: J,
    height: I
  };
  else if (Q.damage) {
    if (D = Q.damage, A.damage) D = I21(D, A.damage)
  } else if (A.damage) D = A.damage;
  else D = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
  if (X > I) D = I21(D, {
    x: 0,
    y: I,
    width: Y,
    height: X - I
  });
  if (Y > J) D = I21(D, {
    x: J,
    y: 0,
    width: Y - J,
    height: X
  });
  let W = Math.max(X, I),
    K = Math.max(Y, J),
    V = Math.min(D.y + D.height, W),
    F = Math.min(D.x + D.width, K);
  for (let H = D.y; H < V; H++)
    for (let E = D.x; E < F; E++) {
      let z = H < X && E < Y ? G[H * Y + E] : void 0,
        $ = H < I && E < J ? Z[H * J + E] : void 0;
      if (z === $) continue;
      if (z && $ && OW8(z, $)) continue;
      if (!z && $ && qQ0(Q, $)) continue;
      B.push([{
        x: E,
        y: H
      }, z, $])
    }
  return B
}
// @from(Ln 184721, Col 4)
yNB
// @from(Ln 184722, Col 4)
tIA = w(() => {
  TNB();
  CQ0();
  bBA();
  yNB = new RegExp(`^${yBA}\\]8${kBA}${kBA}([^${vBA}]*)${vBA}$`)
})
// @from(Ln 184728, Col 0)
class u_A {
  width;
  height;
  ink2;
  stylePool;
  operations = [];
  charCache = new Map;
  styledCharsToStringCache = {};
  constructor(A) {
    let {
      width: Q,
      height: B,
      ink2: G = !1,
      stylePool: Z
    } = A;
    this.width = Q, this.height = B, this.ink2 = G, this.stylePool = Z
  }
  blit(A, Q) {
    this.operations.push({
      type: "blit",
      src: A,
      region: Q
    })
  }
  clear(A) {
    this.operations.push({
      type: "clear",
      region: A
    })
  }
  write(A, Q, B) {
    if (!B) return;
    this.operations.push({
      type: "write",
      x: A,
      y: Q,
      text: B
    })
  }
  clip(A) {
    this.operations.push({
      type: "clip",
      clip: A
    })
  }
  unclip() {
    this.operations.push({
      type: "unclip"
    })
  }
  get() {
    let A = Array(this.height);
    for (let Z = 0; Z < this.height; Z++) A[Z] = Array(this.width).fill(bNB);
    let Q = sIA(this.width, this.height, this.stylePool);
    for (let Z of this.operations)
      if (Z.type === "clear") {
        let {
          region: Y
        } = Z, J = Math.min(Y.y + Y.height, this.height), X = Math.min(Y.x + Y.width, this.width);
        for (let I = Math.max(0, Y.y); I < J; I++)
          for (let D = Math.max(0, Y.x); D < X; D++) g_A(Q, D, I, Q.emptyCell)
      } let B = [];
    for (let Z of this.operations) {
      if (Z.type === "clip") B.push(Z.clip);
      if (Z.type === "unclip") B.pop();
      if (Z.type === "blit") {
        let {
          src: Y,
          region: J
        } = Z, X = Math.min(J.y + J.height, this.height, Y.height), I = Math.min(J.x + J.width, this.width, Y.width);
        for (let D = J.y; D < X; D++)
          for (let W = J.x; W < I; W++) {
            let K = xNB(Y, W, D);
            if (K) g_A(Q, W, D, K)
          }
      }
      if (Z.type === "write") {
        let {
          text: Y
        } = Z, {
          x: J,
          y: X
        } = Z, I = Y.split(`
`), D = B.at(-1);
        if (D) {
          let K = typeof D?.x1 === "number" && typeof D?.x2 === "number",
            V = typeof D?.y1 === "number" && typeof D?.y2 === "number";
          if (K) {
            let F = fIA(Y);
            if (J + F < D.x1 || J > D.x2) continue
          }
          if (V) {
            let F = I.length;
            if (X + F < D.y1 || X > D.y2) continue
          }
          if (K) {
            if (I = I.map((F) => {
                let H = J < D.x1 ? D.x1 - J : 0,
                  E = A9(F),
                  z = J + E > D.x2 ? D.x2 - J : E;
                return h_A(F, H, z)
              }), J < D.x1) J = D.x1
          }
          if (V) {
            let F = X < D.y1 ? D.y1 - X : 0,
              H = I.length,
              E = X + H > D.y2 ? D.y2 - X : H;
            if (I = I.slice(F, E), X < D.y1) X = D.y1
          }
        }
        let W = 0;
        for (let K of I) {
          let V = A[X + W];
          if (!V) continue;
          let F = this.charCache.get(K);
          if (!F) {
            let E = wNB(oIA(K));
            F = this.ink2 ? _W8(E) : E, this.charCache.set(K, F)
          }
          let H = J;
          for (let E = 0; E < F.length; E++) {
            let z = F[E];
            if (this.ink2) {
              let O = z.value.codePointAt(0);
              if (O === 8203 || O === 8204 || O === 8205 || O === 65279 || O === 8288) continue;
              if (O !== void 0 && O <= 31) {
                if (O === 9) {
                  let M = 8 - H % 8;
                  for (let _ = 0; _ < M && H < this.width; _++) V[H] = bNB, g_A(Q, H, X + W, {
                    char: " ",
                    styleId: this.stylePool.none,
                    width: 0,
                    hyperlink: void 0
                  }), H++
                } else if (O === 27) {
                  let L = F[E + 1]?.value,
                    M = L?.codePointAt(0);
                  if (L === "(" || L === ")" || L === "*" || L === "+") E += 2;
                  else if (L === "[") {
                    E++;
                    while (E < F.length - 1) {
                      E++;
                      let _ = F[E]?.value.codePointAt(0);
                      if (_ !== void 0 && _ >= 64 && _ <= 126) break
                    }
                  } else if (L === "]" || L === "P" || L === "_" || L === "^" || L === "X") {
                    E++;
                    while (E < F.length - 1) {
                      E++;
                      let _ = F[E]?.value;
                      if (_ === "\x07") break;
                      if (_ === "\x1B") {
                        if (F[E + 1]?.value === "\\") {
                          E++;
                          break
                        }
                      }
                    }
                  } else if (M !== void 0 && M >= 48 && M <= 126) E++
                }
                continue
              }
            }
            V[H] = z;
            let $ = z.fullWidth || z.value.length > 1;
            if (this.ink2) {
              let O = vNB(z.styles),
                L = O ? kNB(z.styles) : z.styles;
              g_A(Q, H, X + W, {
                char: z.value,
                styleId: this.stylePool.intern(L),
                width: $ ? 1 : 0,
                hyperlink: O ?? void 0
              })
            }
            if ($) V[H + 1] = {
              type: "char",
              value: "",
              fullWidth: !1,
              styles: z.styles
            };
            H += $ ? 2 : 1
          }
          W++
        }
      }
    }
    return {
      output: this.ink2 ? "" : A.map((Z) => {
        let Y = Z.filter((X) => X !== void 0),
          J = eA(Y);
        if (!Object.prototype.hasOwnProperty.call(this.styledCharsToStringCache, J)) {
          let X = LNB(Y).trimEnd();
          this.styledCharsToStringCache[J] = X
        }
        return this.styledCharsToStringCache[J]
      }).join(`
`),
      height: A.length,
      screen: Q
    }
  }
}
// @from(Ln 184932, Col 0)
function RW8(A, Q) {
  if (A === Q) return !0;
  let B = A.length;
  if (B !== Q.length) return !1;
  if (B === 0) return !0;
  for (let G = 0; G < B; G++)
    if (A[G].code !== Q[G].code) return !1;
  return !0
}
// @from(Ln 184942, Col 0)
function _W8(A) {
  let Q = A.length;
  if (Q === 0) return [];
  let B = [],
    G = [],
    Z = A[0].styles;
  for (let Y = 0; Y < Q; Y++) {
    let J = A[Y],
      X = J.styles;
    if (G.length > 0 && !RW8(X, Z)) {
      let I = G.join("");
      for (let {
          segment: D
        }
        of fNB.segment(I)) B.push({
        type: "char",
        value: D,
        fullWidth: A9(D) === 2,
        styles: Z
      });
      G.length = 0
    }
    G.push(J.value), Z = X
  }
  if (G.length > 0) {
    let Y = G.join("");
    for (let {
        segment: J
      }
      of fNB.segment(Y)) B.push({
      type: "char",
      value: J,
      fullWidth: A9(J) === 2,
      styles: Z
    })
  }
  return B
}
// @from(Ln 184980, Col 4)
bNB
// @from(Ln 184980, Col 9)
fNB
// @from(Ln 184981, Col 4)
hNB = w(() => {
  $Q0();
  _B1();
  rIA();
  UC();
  tIA();
  A0();
  bNB = Object.freeze({
    type: "char",
    value: " ",
    fullWidth: !1,
    styles: []
  });
  fNB = new Intl.Segmenter
})
// @from(Ln 184997, Col 0)
function wQ0(A, Q) {
  return (B) => {
    let {
      terminalWidth: G,
      terminalRows: Z,
      isTTY: Y,
      ink2: J,
      prevScreen: X
    } = B, I = A.yogaNode?.getComputedHeight(), D = A.yogaNode?.getComputedWidth(), W = I === void 0 || !Number.isFinite(I) || I < 0, K = D === void 0 || !Number.isFinite(D) || D < 0;
    if (!A.yogaNode || W || K) {
      if (A.yogaNode && (W || K)) k(`Invalid yoga dimensions: width=${D}, height=${I}, childNodes=${A.childNodes.length}, terminalWidth=${G}, terminalRows=${Z}`);
      return {
        output: "",
        outputHeight: 0,
        staticOutput: "",
        rows: Z,
        columns: G,
        cursorVisible: !0,
        screen: sIA(G, 0, Q),
        viewport: {
          width: G,
          height: 0
        },
        cursor: {
          x: 0,
          y: 0,
          visible: !0
        }
      }
    }
    let V = new u_A({
      width: Math.floor(A.yogaNode.getComputedWidth()),
      height: Math.floor(A.yogaNode.getComputedHeight()),
      ink2: J,
      stylePool: Q
    });
    WQ0(A, V, {
      skipStaticElements: !0,
      prevScreen: X,
      ink2: J
    });
    let F, H = A.staticNode,
      E = H?.yogaNode?.getComputedHeight(),
      z = H?.yogaNode?.getComputedWidth(),
      $ = E !== void 0 && Number.isFinite(E) && E >= 0 && z !== void 0 && Number.isFinite(z) && z >= 0;
    if (!J && H && H.yogaNode && $) F = new u_A({
      width: Math.floor(z),
      height: Math.floor(E),
      ink2: !1,
      stylePool: Q
    }), WQ0(H, F, {
      skipStaticElements: !1,
      prevScreen: void 0,
      ink2: !1
    });
    let {
      output: O,
      height: L,
      screen: M
    } = V.get();
    return {
      output: O,
      outputHeight: L,
      staticOutput: F ? `${F.get().output}
` : "",
      rows: Z,
      columns: G,
      cursorVisible: !Y || O === "",
      screen: M,
      viewport: {
        width: G,
        height: Z
      },
      cursor: {
        x: 0,
        y: M.height,
        visible: !0
      }
    }
  }
}
// @from(Ln 185078, Col 4)
gNB = w(() => {
  $NB();
  hNB();
  tIA();
  T1()
})
// @from(Ln 185085, Col 0)
function D21(A, Q, B) {
  return {
    output: "",
    outputHeight: 0,
    staticOutput: "",
    rows: A,
    columns: Q,
    cursorVisible: !0,
    screen: sIA(0, 0, B),
    viewport: {
      width: 0,
      height: 0
    },
    cursor: {
      x: 0,
      y: 0,
      visible: !0
    }
  }
}
// @from(Ln 185106, Col 0)
function uNB(A, Q) {
  if (Q.rows !== A.rows || Q.columns !== A.columns) return "resize";
  let G = Q.outputHeight >= Q.rows,
    Z = A.outputHeight >= A.rows;
  if (G || Z) return "offscreen";
  return
}
// @from(Ln 185113, Col 4)
LQ0 = w(() => {
  tIA()
})
// @from(Ln 185116, Col 0)
class MQ0 {
  options;
  state;
  constructor(A) {
    this.options = A;
    this.state = {
      fullStaticOutput: "",
      previousOutput: ""
    }
  }
  render(A, Q) {
    return this.options.ink2 ? this.render_v2(A, Q) : this.render_v1(A, Q)
  }
  render_v1(A, Q) {
    if (this.options.debug) return this.getRenderOpsDebug_DEPRECATED(Q);
    if (!this.options.isTTY) return [{
      type: "stdout",
      content: Q.staticOutput
    }];
    let B = uNB(A, Q);
    if (B) return this.getRenderOpsForAllOutput_CAUSES_FLICKER(Q, B);
    if (!(Q.staticOutput && Q.staticOutput !== `
`) && Q.output === A.output) return [];
    return [...this.getRenderOpsForClearAndRenderStaticOutput(A, Q), ...this.renderEfficiently(A, Q)]
  }
  renderPreviousOutput_DEPRECATED(A) {
    if (!this.options.isTTY) return [{
      type: "stdout",
      content: A.output
    }, {
      type: "stdout",
      content: `
`
    }];
    else if (!this.options.debug) return this.getRenderOpsForDone(A);
    return []
  }
  reset() {
    this.state.previousOutput = ""
  }
  renderEfficiently(A, Q) {
    let B = Q.output + `
`;
    if (B === this.state.previousOutput) return [];
    let G = this.state.previousOutput ? N_A(this.state.previousOutput, A.columns) : 0;
    this.state.previousOutput = B;
    let Z = [];
    if (!Q.cursorVisible && A.cursorVisible) Z.push({
      type: "cursorHide"
    });
    else if (Q.cursorVisible && !A.cursorVisible) Z.push({
      type: "cursorShow"
    });
    return Z.push({
      type: "clear",
      count: G
    }), Z.push({
      type: "stdout",
      content: Q.output
    }), Z.push({
      type: "stdout",
      content: `
`
    }), Z
  }
  getRenderOpsDebug_DEPRECATED(A) {
    if (A.staticOutput && A.staticOutput !== `
`) this.state.fullStaticOutput += A.staticOutput;
    return [{
      type: "stdout",
      content: this.state.fullStaticOutput
    }, {
      type: "stdout",
      content: A.output
    }]
  }
  getRenderOpsForAllOutput_CAUSES_FLICKER(A, Q) {
    if (A.staticOutput && A.staticOutput !== `
`) this.state.fullStaticOutput += A.staticOutput;
    this.state.previousOutput = A.output + `
`;
    let G = [];
    return G.push({
      type: "clearTerminal",
      reason: Q
    }), G.push({
      type: "stdout",
      content: this.state.fullStaticOutput
    }), G.push({
      type: "stdout",
      content: A.output
    }), G.push({
      type: "stdout",
      content: `
`
    }), G
  }
  getRenderOpsForClearAndRenderStaticOutput(A, Q) {
    if (!(Q.staticOutput && Q.staticOutput !== `
`)) return [];
    this.state.fullStaticOutput += Q.staticOutput;
    let G = this.state.previousOutput ? N_A(this.state.previousOutput, A.columns) : 0;
    return this.state.previousOutput = "", [{
      type: "clear",
      count: G
    }, {
      type: "stdout",
      content: Q.staticOutput
    }]
  }
  getRenderOpsForDone(A) {
    if (this.state.previousOutput = "", !A.cursorVisible) return [{
      type: "cursorShow"
    }];
    return []
  }
  render_v2(A, Q) {
    if (Q.screen.height === 0 || Q.screen.width === 0) {
      if (A.screen.height > 0) return eIA(Q, "clear", this.options.stylePool);
      return []
    }
    if (Q.viewport.height < A.viewport.height || A.viewport.width !== 0 && Q.viewport.width !== A.viewport.width) return eIA(Q, "resize", this.options.stylePool);
    let B = A.cursor.y >= A.screen.height,
      G = Q.screen.height > A.screen.height,
      Z = A.screen.height > A.viewport.height,
      Y = Q.screen.height < A.viewport.height;
    if (Z && Y && !G) return eIA(Q, "offscreen", this.options.stylePool);
    if (A.screen.height >= A.viewport.height && A.screen.height > 0 && B && !G) {
      let H = A.screen.height - A.viewport.height + 1;
      if ([...NQ0(A.screen, Q.screen)].some(([z]) => z.y < H)) return eIA(Q, "offscreen", this.options.stylePool)
    }
    let J = new RQ0(A.cursor, Q.viewport.width),
      X = Math.max(Q.screen.height, 1) - Math.max(A.screen.height, 1),
      I = X < 0,
      D = X > 0;
    if (I) {
      let F = A.screen.height - Q.screen.height;
      if (F > A.viewport.height) return eIA(Q, "offscreen", this.options.stylePool);
      J.txn((H) => [
        [{
          type: "clear",
          count: F
        }, {
          type: "cursorMove",
          x: 0,
          y: -1
        }], {
          dx: -H.x,
          dy: -F
        }
      ])
    }
    let W = D ? Math.max(0, A.screen.height - A.viewport.height) : Math.max(A.screen.height, Q.screen.height) - Q.viewport.height,
      K = [],
      V = void 0;
    for (let [F, H, E] of NQ0(A.screen, Q.screen)) {
      if (D && F.y >= A.screen.height) continue;
      if (E && (E.width === 2 || E.width === 3)) continue;
      if (H && (H.width === 2 || H.width === 3) && !E) continue;
      if (E && qQ0(Q.screen, E) && !H) continue;
      if (F.y < W) return eIA(Q, "offscreen", this.options.stylePool);
      if (OQ0(J, F), E) {
        let z = E.hyperlink;
        V = mNB(J.diff, V, z);
        let $ = this.options.stylePool.get(E.styleId),
          O = Rk(K, $);
        cNB(J, E, O), K = $
      } else if (H) {
        if (K.length > 0) {
          let z = Rk(K, []);
          if (z.length > 0) J.diff.push({
            type: "style",
            codes: z
          });
          K = []
        }
        J.txn(() => [
          [{
            type: "stdout",
            content: " "
          }], {
            dx: 1,
            dy: 0
          }
        ])
      }
    }
    if (K.length > 0) {
      let F = Rk(K, []);
      if (F.length > 0) J.diff.push({
        type: "style",
        codes: F
      });
      K = []
    }
    if (V !== void 0) J.diff.push({
      type: "hyperlink",
      uri: ""
    }), V = void 0;
    if (D) dNB(J, Q, A.screen.height, Q.screen.height, this.options.stylePool);
    if (Q.cursor.y >= Q.screen.height) J.txn((F) => {
      let H = Q.cursor.y - F.y;
      if (H > 0) {
        let z = [{
          type: "carriageReturn"
        }];
        for (let $ = 0; $ < H; $++) z.push({
          type: "stdout",
          content: `
`
        });
        return [z, {
          dx: -F.x,
          dy: H
        }]
      }
      let E = Q.cursor.y - F.y;
      if (E !== 0 || F.x !== Q.cursor.x) return [
        [{
          type: "carriageReturn"
        }, {
          type: "cursorMove",
          x: Q.cursor.x,
          y: E
        }], {
          dx: Q.cursor.x - F.x,
          dy: E
        }
      ];
      return [
        [], {
          dx: 0,
          dy: 0
        }
      ]
    });
    else OQ0(J, Q.cursor);
    return J.diff
  }
}
// @from(Ln 185357, Col 0)
function mNB(A, Q, B) {
  if (Q !== B) return A.push({
    type: "hyperlink",
    uri: B ?? ""
  }), B;
  return Q
}
// @from(Ln 185365, Col 0)
function eIA(A, Q, B) {
  let G = new RQ0({
    x: 0,
    y: 0
  }, A.viewport.width);
  return jW8(G, A, B), [{
    type: "clearTerminal",
    reason: Q
  }, ...G.diff]
}
// @from(Ln 185376, Col 0)
function jW8(A, Q, B) {
  dNB(A, Q, 0, Q.screen.height, B)
}
// @from(Ln 185380, Col 0)
function dNB(A, Q, B, G, Z) {
  let Y = [],
    J = void 0;
  for (let X = B; X < G; X += 1) {
    for (let I = 0; I < Q.screen.width; I += 1) {
      let D = {
          x: I,
          y: X
        },
        W = SNB(Q.screen, D);
      if (!W) continue;
      if (W.width === 2 || W.width === 3) continue;
      OQ0(A, D);
      let K = W.hyperlink;
      J = mNB(A.diff, J, K);
      let V = Z.get(W.styleId),
        F = Rk(Y, V);
      cNB(A, W, F), Y = V
    }
    A.txn((I) => [
      [{
        type: "stdout",
        content: `
`
      }], {
        dx: -I.x,
        dy: 1
      }
    ])
  }
  if (J !== void 0) A.diff.push({
    type: "hyperlink",
    uri: ""
  });
  if (Y.length > 0) {
    let X = Rk(Y, []);
    if (X.length > 0) A.diff.push({
      type: "style",
      codes: X
    })
  }
  return A
}
// @from(Ln 185424, Col 0)
function cNB(A, Q, B) {
  A.txn((G) => {
    let Z = Q.width === 1 ? 2 : 1,
      Y = G.x >= A.viewportWidth ? Z - G.x : Z,
      J = G.x >= A.viewportWidth ? 1 : 0;
    return [B.length > 0 ? [{
      type: "style",
      codes: B
    }, {
      type: "stdout",
      content: Q.char
    }] : [{
      type: "stdout",
      content: Q.char
    }], {
      dx: Y,
      dy: J
    }]
  })
}
// @from(Ln 185445, Col 0)
function OQ0(A, Q) {
  A.txn((B) => {
    let G = Q.x - B.x,
      Z = Q.y - B.y;
    if (B.x >= A.viewportWidth && Z <= 0) {
      let J = Z - 1;
      return [
        [{
          type: "resolvePendingWrap"
        }, {
          type: "carriageReturn"
        }, {
          type: "cursorMove",
          x: Q.x,
          y: J
        }], {
          dx: G,
          dy: Z
        }
      ]
    }
    if (Z !== 0) return [
      [{
        type: "carriageReturn"
      }, {
        type: "cursorMove",
        x: Q.x,
        y: Z
      }], {
        dx: G,
        dy: Z
      }
    ];
    return [
      [{
        type: "cursorMove",
        x: G,
        y: Z
      }], {
        dx: G,
        dy: Z
      }
    ]
  })
}
// @from(Ln 185490, Col 0)
class RQ0 {
  viewportWidth;
  cursor;
  diff = [];
  constructor(A, Q) {
    this.viewportWidth = Q;
    this.cursor = {
      ...A
    }
  }
  txn(A) {
    let [Q, B] = A(this.cursor);
    for (let G of Q) this.diff.push(G);
    this.cursor = {
      x: this.cursor.x + B.dx,
      y: this.cursor.y + B.dy
    }
  }
}
// @from(Ln 185509, Col 4)
pNB = w(() => {
  M00();
  LQ0();
  tIA();
  rIA()
})
// @from(Ln 185515, Col 4)
TW8
// @from(Ln 185515, Col 9)
_k
// @from(Ln 185516, Col 4)
m_A = w(() => {
  TW8 = new Map, _k = TW8
})
// @from(Ln 185519, Col 0)
class ya {
  _didStopImmediatePropagation = !1;
  didStopImmediatePropagation() {
    return this._didStopImmediatePropagation
  }
  stopImmediatePropagation() {
    this._didStopImmediatePropagation = !0
  }
}
// @from(Ln 185531, Col 4)
va
// @from(Ln 185532, Col 4)
W21 = w(() => {
  va = class va extends PW8 {
    emit(A, ...Q) {
      if (A === "error") return super.emit(A, ...Q);
      let B = this.rawListeners(A);
      if (B.length === 0) return !1;
      let G = Q[0] instanceof ya ? Q[0] : null;
      for (let Z of B)
        if (Z.apply(this, Q), G?.didStopImmediatePropagation()) break;
      return !0
    }
  }
})
// @from(Ln 185545, Col 4)
lNB
// @from(Ln 185545, Col 9)
iNB
// @from(Ln 185545, Col 14)
K21
// @from(Ln 185546, Col 4)
_Q0 = w(() => {
  lNB = c(QA(), 1), iNB = lNB.createContext({
    exit() {}
  });
  iNB.displayName = "InternalAppContext";
  K21 = iNB
})
// @from(Ln 185553, Col 4)
nNB
// @from(Ln 185553, Col 9)
aNB
// @from(Ln 185553, Col 14)
V21
// @from(Ln 185554, Col 4)
jQ0 = w(() => {
  W21();
  nNB = c(QA(), 1), aNB = nNB.createContext({
    stdin: process.stdin,
    internal_eventEmitter: new va,
    setRawMode() {},
    isRawModeSupported: !1,
    internal_exitOnCtrlC: !0
  });
  aNB.displayName = "InternalStdinContext";
  V21 = aNB
})
// @from(Ln 185566, Col 4)
oNB
// @from(Ln 185566, Col 9)
rNB
// @from(Ln 185566, Col 14)
F21
// @from(Ln 185567, Col 4)
H21 = w(() => {
  oNB = c(QA(), 1), rNB = oNB.createContext({
    activeId: void 0,
    add() {},
    remove() {},
    activate() {},
    deactivate() {},
    enableFocus() {},
    disableFocus() {},
    focusNext() {},
    focusPrevious() {},
    focus() {}
  });
  rNB.displayName = "InternalFocusContext";
  F21 = rNB
})
// @from(Ln 185583, Col 4)
sNB
// @from(Ln 185583, Col 9)
tNB
// @from(Ln 185583, Col 14)
E21
// @from(Ln 185584, Col 4)
TQ0 = w(() => {
  sNB = c(QA(), 1), tNB = sNB.createContext({
    isTerminalFocused: !0
  });
  tNB.displayName = "TerminalFocusContext";
  E21 = tNB
})
// @from(Ln 185591, Col 4)
AwB = U((RSG, eNB) => {
  var SW8 = /[|\\{}()[\]^$+*?.-]/g;
  eNB.exports = (A) => {
    if (typeof A !== "string") throw TypeError("Expected a string");
    return A.replace(SW8, "\\$&")
  }
})
// @from(Ln 185598, Col 4)
ZwB = U((_SG, GwB) => {
  var xW8 = AwB(),
    yW8 = typeof process === "object" && process && typeof process.cwd === "function" ? process.cwd() : ".",
    BwB = [].concat(NA("module").builtinModules, "bootstrap_node", "node").map((A) => new RegExp(`(?:\\((?:node:)?${A}(?:\\.js)?:\\d+:\\d+\\)$|^\\s*at (?:node:)?${A}(?:\\.js)?:\\d+:\\d+$)`));
  BwB.push(/\((?:node:)?internal\/[^:]+:\d+:\d+\)$/, /\s*at (?:node:)?internal\/[^:]+:\d+:\d+$/, /\/\.node-spawn-wrap-\w+-\w+\/node:\d+:\d+\)?$/);
  class PQ0 {
    constructor(A) {
      if (A = {
          ignoredPackages: [],
          ...A
        }, "internals" in A === !1) A.internals = PQ0.nodeInternals();
      if ("cwd" in A === !1) A.cwd = yW8;
      this._cwd = A.cwd.replace(/\\/g, "/"), this._internals = [].concat(A.internals, vW8(A.ignoredPackages)), this._wrapCallSite = A.wrapCallSite || !1
    }
    static nodeInternals() {
      return [...BwB]
    }
    clean(A, Q = 0) {
      if (Q = " ".repeat(Q), !Array.isArray(A)) A = A.split(`
`);
      if (!/^\s*at /.test(A[0]) && /^\s*at /.test(A[1])) A = A.slice(1);
      let B = !1,
        G = null,
        Z = [];
      return A.forEach((Y) => {
        if (Y = Y.replace(/\\/g, "/"), this._internals.some((X) => X.test(Y))) return;
        let J = /^\s*at /.test(Y);
        if (B) Y = Y.trimEnd().replace(/^(\s+)at /, "$1");
        else if (Y = Y.trim(), J) Y = Y.slice(3);
        if (Y = Y.replace(`${this._cwd}/`, ""), Y)
          if (J) {
            if (G) Z.push(G), G = null;
            Z.push(Y)
          } else B = !0, G = Y
      }), Z.map((Y) => `${Q}${Y}
`).join("")
    }
    captureString(A, Q = this.captureString) {
      if (typeof A === "function") Q = A, A = 1 / 0;
      let {
        stackTraceLimit: B
      } = Error;
      if (A) Error.stackTraceLimit = A;
      let G = {};
      Error.captureStackTrace(G, Q);
      let {
        stack: Z
      } = G;
      return Error.stackTraceLimit = B, this.clean(Z)
    }
    capture(A, Q = this.capture) {
      if (typeof A === "function") Q = A, A = 1 / 0;
      let {
        prepareStackTrace: B,
        stackTraceLimit: G
      } = Error;
      if (Error.prepareStackTrace = (J, X) => {
          if (this._wrapCallSite) return X.map(this._wrapCallSite);
          return X
        }, A) Error.stackTraceLimit = A;
      let Z = {};
      Error.captureStackTrace(Z, Q);
      let {
        stack: Y
      } = Z;
      return Object.assign(Error, {
        prepareStackTrace: B,
        stackTraceLimit: G
      }), Y
    }
    at(A = this.at) {
      let [Q] = this.capture(1, A);
      if (!Q) return {};
      let B = {
        line: Q.getLineNumber(),
        column: Q.getColumnNumber()
      };
      if (QwB(B, Q.getFileName(), this._cwd), Q.isConstructor()) Object.defineProperty(B, "constructor", {
        value: !0,
        configurable: !0
      });
      if (Q.isEval()) B.evalOrigin = Q.getEvalOrigin();
      if (Q.isNative()) B.native = !0;
      let G;
      try {
        G = Q.getTypeName()
      } catch (J) {}
      if (G && G !== "Object" && G !== "[object Object]") B.type = G;
      let Z = Q.getFunctionName();
      if (Z) B.function = Z;
      let Y = Q.getMethodName();
      if (Y && Z !== Y) B.method = Y;
      return B
    }
    parseLine(A) {
      let Q = A && A.match(kW8);
      if (!Q) return null;
      let B = Q[1] === "new",
        G = Q[2],
        Z = Q[3],
        Y = Q[4],
        J = Number(Q[5]),
        X = Number(Q[6]),
        I = Q[7],
        D = Q[8],
        W = Q[9],
        K = Q[10] === "native",
        V = Q[11] === ")",
        F, H = {};
      if (D) H.line = Number(D);
      if (W) H.column = Number(W);
      if (V && I) {
        let E = 0;
        for (let z = I.length - 1; z > 0; z--)
          if (I.charAt(z) === ")") E++;
          else if (I.charAt(z) === "(" && I.charAt(z - 1) === " ") {
          if (E--, E === -1 && I.charAt(z - 1) === " ") {
            let $ = I.slice(0, z - 1);
            I = I.slice(z + 1), G += ` (${$}`;
            break
          }
        }
      }
      if (G) {
        let E = G.match(bW8);
        if (E) G = E[1], F = E[2]
      }
      if (QwB(H, I, this._cwd), B) Object.defineProperty(H, "constructor", {
        value: !0,
        configurable: !0
      });
      if (Z) H.evalOrigin = Z, H.evalLine = J, H.evalColumn = X, H.evalFile = Y && Y.replace(/\\/g, "/");
      if (K) H.native = !0;
      if (G) H.function = G;
      if (F && G !== F) H.method = F;
      return H
    }
  }

  function QwB(A, Q, B) {
    if (Q) {
      if (Q = Q.replace(/\\/g, "/"), Q.startsWith(`${B}/`)) Q = Q.slice(B.length + 1);
      A.file = Q
    }
  }

  function vW8(A) {
    if (A.length === 0) return [];
    let Q = A.map((B) => xW8(B));
    return new RegExp(`[/\\\\]node_modules[/\\\\](?:${Q.join("|")})[/\\\\][^:]+:\\d+:\\d+`)
  }
  var kW8 = new RegExp("^(?:\\s*at )?(?:(new) )?(?:(.*?) \\()?(?:eval at ([^ ]+) \\((.+?):(\\d+):(\\d+)\\), )?(?:(.+?):(\\d+):(\\d+)|(native))(\\)?)$"),
    bW8 = /^(.*?) \[as (.*?)\]$/;
  GwB.exports = PQ0
})
// @from(Ln 185753, Col 4)
fW8 = (A, Q = 2) => {
    return A.replace(/^\t+/gm, (B) => " ".repeat(B.length * Q))
  }
// @from(Ln 185756, Col 2)
YwB
// @from(Ln 185757, Col 4)
JwB = w(() => {
  YwB = fW8
})
// @from(Ln 185760, Col 4)
hW8 = (A, Q) => {
    let B = [],
      G = A - Q,
      Z = A + Q;
    for (let Y = G; Y <= Z; Y++) B.push(Y);
    return B
  }
// @from(Ln 185767, Col 2)
gW8 = (A, Q, B = {}) => {
    var G;
    if (typeof A !== "string") throw TypeError("Source code is missing.");
    if (!Q || Q < 1) throw TypeError("Line number must start from `1`.");
    let Z = YwB(A).split(/\r?\n/);
    if (Q > Z.length) return;
    return hW8(Q, (G = B.around) !== null && G !== void 0 ? G : 3).filter((Y) => Z[Y - 1] !== void 0).map((Y) => ({
      line: Y,
      value: Z[Y - 1]
    }))
  }
// @from(Ln 185778, Col 2)
XwB
// @from(Ln 185779, Col 4)
IwB = w(() => {
  JwB();
  XwB = gW8
})
// @from(Ln 185784, Col 0)
function uW8({
  children: A,
  flexWrap: Q = "nowrap",
  flexDirection: B = "row",
  flexGrow: G = 0,
  flexShrink: Z = 1,
  ref: Y,
  ...J
}) {
  return bD(J.margin, "margin"), bD(J.marginX, "marginX"), bD(J.marginY, "marginY"), bD(J.marginTop, "marginTop"), bD(J.marginBottom, "marginBottom"), bD(J.marginLeft, "marginLeft"), bD(J.marginRight, "marginRight"), bD(J.padding, "padding"), bD(J.paddingX, "paddingX"), bD(J.paddingY, "paddingY"), bD(J.paddingTop, "paddingTop"), bD(J.paddingBottom, "paddingBottom"), bD(J.paddingLeft, "paddingLeft"), bD(J.paddingRight, "paddingRight"), bD(J.gap, "gap"), bD(J.columnGap, "columnGap"), bD(J.rowGap, "rowGap"), DwB.default.createElement("ink-box", {
    ref: Y,
    style: {
      flexWrap: Q,
      flexDirection: B,
      flexGrow: G,
      flexShrink: Z,
      ...J,
      overflowX: J.overflowX ?? J.overflow ?? "visible",
      overflowY: J.overflowY ?? J.overflow ?? "visible"
    }
  }, A)
}
// @from(Ln 185806, Col 4)
DwB
// @from(Ln 185806, Col 9)
eq
// @from(Ln 185807, Col 4)
d_A = w(() => {
  CQ0();
  DwB = c(QA(), 1);
  eq = uW8
})
// @from(Ln 185813, Col 0)
function xQ0({
  children: A,
  initialState: Q,
  onThemeChange: B,
  onThemeSave: G
}) {
  let [Z, Y] = ka.useState(Q), [J, X] = ka.useState(null), I = KwB.useMemo(() => ({
    theme: Z,
    setTheme: (D) => {
      Y(D), X(null), B?.(D), G?.(D)
    },
    setPreviewTheme: (D) => {
      X(D), B?.(D)
    },
    savePreview: () => {
      if (J !== null) Y(J), X(null), G?.(J)
    },
    cancelPreview: () => {
      if (J !== null) X(null), B?.(Z)
    },
    currentTheme: J ?? Z
  }), [Z, J, B, G]);
  return WwB.default.createElement(SQ0.Provider, {
    value: I
  }, A)
}
// @from(Ln 185840, Col 0)
function oB() {
  let {
    currentTheme: A,
    setTheme: Q
  } = ka.useContext(SQ0);
  return [A, Q]
}
// @from(Ln 185848, Col 0)
function yQ0() {
  let {
    setPreviewTheme: A,
    savePreview: Q,
    cancelPreview: B
  } = ka.useContext(SQ0);
  return {
    setPreviewTheme: A,
    savePreview: Q,
    cancelPreview: B
  }
}
// @from(Ln 185860, Col 4)
WwB
// @from(Ln 185860, Col 9)
KwB
// @from(Ln 185860, Col 14)
ka
// @from(Ln 185860, Col 18)
SQ0
// @from(Ln 185861, Col 4)
c_A = w(() => {
  WwB = c(QA(), 1), KwB = c(QA(), 1), ka = c(QA(), 1), SQ0 = ka.createContext({
    theme: null,
    setTheme: (A) => A,
    setPreviewTheme: (A) => A,
    savePreview: () => {},
    cancelPreview: () => {},
    currentTheme: null
  })
})
// @from(Ln 185872, Col 0)
function DF({
  color: A,
  backgroundColor: Q,
  bold: B,
  dim: G,
  italic: Z = !1,
  underline: Y = !1,
  strikethrough: J = !1,
  inverse: X = !1,
  wrap: I = "wrap",
  children: D
}) {
  if (D === void 0 || D === null) return null;
  let W = {
    ...A && {
      color: A
    },
    ...Q && {
      backgroundColor: Q
    },
    ...G && {
      dim: G
    },
    ...B && {
      bold: B
    },
    ...Z && {
      italic: Z
    },
    ...Y && {
      underline: Y
    },
    ...J && {
      strikethrough: J
    },
    ...X && {
      inverse: X
    }
  };
  return VwB.default.createElement("ink-text", {
    style: {
      flexGrow: 0,
      flexShrink: 1,
      flexDirection: "row",
      textWrap: I
    },
    textStyles: W
  }, D)
}
// @from(Ln 185921, Col 4)
VwB
// @from(Ln 185922, Col 4)
ADA = w(() => {
  VwB = c(QA(), 1)
})
// @from(Ln 185926, Col 0)
function mW8(A, Q) {
  if (!A) return;
  if (A.startsWith("rgb(") || A.startsWith("#") || A.startsWith("ansi256(") || A.startsWith("ansi:")) return A;
  return Q[A]
}
// @from(Ln 185932, Col 0)
function C({
  color: A,
  backgroundColor: Q,
  dimColor: B = !1,
  bold: G = !1,
  italic: Z = !1,
  underline: Y = !1,
  strikethrough: J = !1,
  inverse: X = !1,
  wrap: I = "wrap",
  children: D
}) {
  let [W] = oB(), K = jP(W), V = B ? K.inactive : mW8(A, K), F = Q ? K[Q] : void 0;
  return FwB.default.createElement(DF, {
    color: V,
    backgroundColor: F,
    bold: G,
    italic: Z,
    underline: Y,
    strikethrough: J,
    inverse: X,
    wrap: I
  }, D)
}
// @from(Ln 185956, Col 4)
FwB
// @from(Ln 185957, Col 4)
z21 = w(() => {
  mBA();
  c_A();
  ADA();
  FwB = c(QA(), 1)
})
// @from(Ln 185968, Col 0)
function kQ0({
  error: A
}) {
  let Q = A.stack ? A.stack.split(`
`).slice(1) : void 0,
    B = Q ? EwB.parseLine(Q[0]) : void 0,
    G = HwB(B?.file),
    Z, Y = 0;
  if (G && B?.line && $21.existsSync(G)) {
    let J = $21.readFileSync(G, "utf8");
    if (Z = XwB(J, B.line), Z)
      for (let {
          line: X
        }
        of Z) Y = Math.max(Y, String(X).length)
  }
  return lW.default.createElement(eq, {
    flexDirection: "column",
    padding: 1
  }, lW.default.createElement(eq, null, lW.default.createElement(C, {
    backgroundColor: "error",
    color: "text"
  }, " ", "ERROR", " "), lW.default.createElement(C, null, " ", A.message)), B && G && lW.default.createElement(eq, {
    marginTop: 1
  }, lW.default.createElement(C, {
    dimColor: !0
  }, G, ":", B.line, ":", B.column)), B && Z && lW.default.createElement(eq, {
    marginTop: 1,
    flexDirection: "column"
  }, Z.map(({
    line: J,
    value: X
  }) => lW.default.createElement(eq, {
    key: J
  }, lW.default.createElement(eq, {
    width: Y + 1
  }, lW.default.createElement(C, {
    dimColor: J !== B.line,
    backgroundColor: J === B.line ? "error" : void 0,
    color: J === B.line ? "text" : void 0
  }, String(J).padStart(Y, " "), ":")), lW.default.createElement(C, {
    key: J,
    backgroundColor: J === B.line ? "error" : void 0,
    color: J === B.line ? "text" : void 0
  }, " " + X)))), A.stack && lW.default.createElement(eq, {
    marginTop: 1,
    flexDirection: "column"
  }, A.stack.split(`
`).slice(1).map((J) => {
    let X = EwB.parseLine(J);
    if (!X) return lW.default.createElement(eq, {
      key: J
    }, lW.default.createElement(C, {
      dimColor: !0
    }, "- "), lW.default.createElement(C, {
      dimColor: !0,
      bold: !0
    }, J));
    return lW.default.createElement(eq, {
      key: J
    }, lW.default.createElement(C, {
      dimColor: !0
    }, "- "), lW.default.createElement(C, {
      dimColor: !0,
      bold: !0
    }, X.function), lW.default.createElement(C, {
      dimColor: !0
    }, " ", "(", HwB(X.file) ?? "", ":", X.line, ":", X.column, ")"))
  })))
}
// @from(Ln 186038, Col 4)
lW
// @from(Ln 186038, Col 8)
vQ0
// @from(Ln 186038, Col 13)
HwB = (A) => {
    return A?.replace(`file://${zwB()}/`, "")
  }
// @from(Ln 186041, Col 2)
EwB
// @from(Ln 186042, Col 4)
$wB = w(() => {
  IwB();
  d_A();
  z21();
  lW = c(QA(), 1), vQ0 = c(ZwB(), 1), EwB = new vQ0.default({
    cwd: zwB(),
    internals: vQ0.default.nodeInternals()
  })
})
// @from(Ln 186055, Col 0)
function CwB(A) {
  return {
    name: "",
    fn: !1,
    ctrl: !1,
    meta: !1,
    shift: !1,
    option: !1,
    sequence: A,
    raw: A,
    isPasted: !0
  }
}
// @from(Ln 186069, Col 0)
function iW8(A) {
  if (dW8.isBuffer(A))
    if (A[0] > 127 && A[1] === void 0) return A[0] -= 128, "\x1B" + String(A);
    else return String(A);
  else if (A !== void 0 && typeof A !== "string") return String(A);
  else if (!A) return "";
  else return A
}
// @from(Ln 186078, Col 0)
function NwB(A, Q = "") {
  let B = Q === null,
    G = B ? "" : iW8(Q),
    Z = A._tokenizer ?? mIA(),
    Y = B ? Z.flush() : Z.feed(G),
    J = [],
    X = A.mode === "IN_PASTE",
    I = A.pasteBuffer;
  for (let W of Y)
    if (W.type === "sequence")
      if (W.value === fUB) X = !0, I = "";
      else if (W.value === hUB) {
    if (I) J.push(CwB(I));
    X = !1, I = ""
  } else if (X) I += W.value;
  else J.push(UwB(W.value));
  else if (W.type === "text")
    if (X) I += W.value;
    else J.push(UwB(W.value));
  if (B && X && I) J.push(CwB(I)), X = !1, I = "";
  let D = {
    mode: X ? "IN_PASTE" : "NORMAL",
    incomplete: Z.buffer(),
    pasteBuffer: I,
    _tokenizer: Z
  };
  return [J, D]
}
// @from(Ln 186107, Col 0)
function oW8(A) {
  let Q = A - 1;
  return {
    shift: !!(Q & 1),
    meta: !!(Q & 2) || !!(Q & 8),
    ctrl: !!(Q & 4)
  }
}
// @from(Ln 186116, Col 0)
function rW8(A) {
  switch (A) {
    case 9:
      return "tab";
    case 13:
      return "return";
    case 27:
      return "escape";
    case 32:
      return "space";
    case 127:
      return "backspace";
    case 57399:
      return "0";
    case 57400:
      return "1";
    case 57401:
      return "2";
    case 57402:
      return "3";
    case 57403:
      return "4";
    case 57404:
      return "5";
    case 57405:
      return "6";
    case 57406:
      return "7";
    case 57407:
      return "8";
    case 57408:
      return "9";
    case 57409:
      return ".";
    case 57410:
      return "/";
    case 57411:
      return "*";
    case 57412:
      return "-";
    case 57413:
      return "+";
    case 57414:
      return "return";
    case 57415:
      return "=";
    default:
      if (A >= 32 && A <= 126) return String.fromCharCode(A).toLowerCase();
      return
  }
}
// @from(Ln 186168, Col 0)
function UwB(A = "") {
  let Q, B = {
    name: "",
    fn: !1,
    ctrl: !1,
    meta: !1,
    shift: !1,
    option: !1,
    sequence: A,
    raw: A,
    isPasted: !1
  };
  B.sequence = B.sequence || A || B.name;
  let G;
  if (G = lW8.exec(A)) {
    let Z = parseInt(G[1], 10),
      Y = G[2] ? parseInt(G[2], 10) : 1,
      J = oW8(Y);
    return {
      name: rW8(Z),
      fn: !1,
      ctrl: J.ctrl,
      meta: J.meta,
      shift: J.shift,
      option: !1,
      sequence: A,
      raw: A,
      isPasted: !1
    }
  }
  if (A === "\r") B.raw = void 0, B.name = "return";
  else if (A === `
`) B.name = "enter";
  else if (A === "\t") B.name = "tab";
  else if (A === "\b" || A === "\x1B\b") B.name = "backspace", B.meta = A.charAt(0) === "\x1B";
  else if (A === "" || A === "\x1B") B.name = "backspace", B.meta = A.charAt(0) === "\x1B";
  else if (A === "\x1B" || A === "\x1B\x1B") B.name = "escape", B.meta = A.length === 2;
  else if (A === " " || A === "\x1B ") B.name = "space", B.meta = A.length === 2;
  else if (A === "\x1F") B.name = "_", B.ctrl = !0;
  else if (A <= "\x1A" && A.length === 1) B.name = String.fromCharCode(A.charCodeAt(0) + 97 - 1), B.ctrl = !0;
  else if (A.length === 1 && A >= "0" && A <= "9") B.name = "number";
  else if (A.length === 1 && A >= "a" && A <= "z") B.name = A;
  else if (A.length === 1 && A >= "A" && A <= "Z") B.name = A.toLowerCase(), B.shift = !0;
  else if (Q = cW8.exec(A)) B.meta = !0, B.shift = /^[A-Z]$/.test(Q[1]);
  else if (Q = pW8.exec(A)) {
    let Z = [...A];
    if (Z[0] === "\x1B" && Z[1] === "\x1B") B.option = !0;
    let Y = [Q[1], Q[2], Q[4], Q[6]].filter(Boolean).join(""),
      J = (Q[3] || Q[5] || 1) - 1;
    B.ctrl = !!(J & 4), B.meta = !!(J & 10), B.shift = !!(J & 1), B.code = Y, B.name = wwB[Y], B.shift = nW8(Y) || B.shift, B.ctrl = aW8(Y) || B.ctrl
  }
  if (B.raw === "\x1Bb") B.meta = !0, B.name = "left";
  else if (B.raw === "\x1Bf") B.meta = !0, B.name = "right";
  switch (A) {
    case "\x1B[1~":
      return {
        name: "home", ctrl: !1, meta: !1, shift: !1, option: !1, fn: !1, sequence: A, raw: A, isPasted: !1
      };
    case "\x1B[4~":
      return {
        name: "end", ctrl: !1, meta: !1, shift: !1, option: !1, fn: !1, sequence: A, raw: A, isPasted: !1
      };
    case "\x1B[5~":
      return {
        name: "pageup", ctrl: !1, meta: !1, shift: !1, option: !1, fn: !1, sequence: A, raw: A, isPasted: !1
      };
    case "\x1B[6~":
      return {
        name: "pagedown", ctrl: !1, meta: !1, shift: !1, option: !1, fn: !1, sequence: A, raw: A, isPasted: !1
      };
    case "\x1B[1;5D":
      return {
        name: "left", ctrl: !0, meta: !1, shift: !1, option: !1, fn: !1, sequence: A, raw: A, isPasted: !1
      };
    case "\x1B[1;5C":
      return {
        name: "right", ctrl: !0, meta: !1, shift: !1, option: !1, fn: !1, sequence: A, raw: A, isPasted: !1
      }
  }
  return B
}
// @from(Ln 186249, Col 4)
cW8
// @from(Ln 186249, Col 9)
pW8
// @from(Ln 186249, Col 14)
lW8
// @from(Ln 186249, Col 19)
qwB
// @from(Ln 186249, Col 24)
wwB
// @from(Ln 186249, Col 29)
LwB
// @from(Ln 186249, Col 34)
nW8 = (A) => {
    return ["[a", "[b", "[c", "[d", "[e", "[2$", "[3$", "[5$", "[6$", "[7$", "[8$", "[Z"].includes(A)
  }
// @from(Ln 186252, Col 2)
aW8 = (A) => {
    return ["Oa", "Ob", "Oc", "Od", "Oe", "[2^", "[3^", "[5^", "[6^", "[7^", "[8^"].includes(A)
  }
// @from(Ln 186255, Col 4)
bQ0 = w(() => {
  hB1();
  wk();
  cW8 = /^(?:\x1b)([a-zA-Z0-9])$/, pW8 = /^(?:\x1b+)(O|N|\[|\[\[)(?:(\d+)(?:;(\d+))?([~^$])|(?:1;)?(\d+)?([a-zA-Z]))/, lW8 = /^\x1b\[(\d+)(?:;(\d+))?u/;
  qwB = {
    mode: "NORMAL",
    incomplete: "",
    pasteBuffer: ""
  };
  wwB = {
    OP: "f1",
    OQ: "f2",
    OR: "f3",
    OS: "f4",
    "[11~": "f1",
    "[12~": "f2",
    "[13~": "f3",
    "[14~": "f4",
    "[[A": "f1",
    "[[B": "f2",
    "[[C": "f3",
    "[[D": "f4",
    "[[E": "f5",
    "[15~": "f5",
    "[17~": "f6",
    "[18~": "f7",
    "[19~": "f8",
    "[20~": "f9",
    "[21~": "f10",
    "[23~": "f11",
    "[24~": "f12",
    "[A": "up",
    "[B": "down",
    "[C": "right",
    "[D": "left",
    "[E": "clear",
    "[F": "end",
    "[H": "home",
    OA: "up",
    OB: "down",
    OC: "right",
    OD: "left",
    OE: "clear",
    OF: "end",
    OH: "home",
    "[1~": "home",
    "[2~": "insert",
    "[3~": "delete",
    "[4~": "end",
    "[5~": "pageup",
    "[6~": "pagedown",
    "[[5~": "pageup",
    "[[6~": "pagedown",
    "[7~": "home",
    "[8~": "end",
    "[a": "up",
    "[b": "down",
    "[c": "right",
    "[d": "left",
    "[e": "clear",
    "[2$": "insert",
    "[3$": "delete",
    "[5$": "pageup",
    "[6$": "pagedown",
    "[7$": "home",
    "[8$": "end",
    Oa: "up",
    Ob: "down",
    Oc: "right",
    Od: "left",
    Oe: "clear",
    "[2^": "insert",
    "[3^": "delete",
    "[5^": "pageup",
    "[6^": "pagedown",
    "[7^": "home",
    "[8^": "end",
    "[Z": "tab"
  }, LwB = [...Object.values(wwB), "backspace"]
})
// @from(Ln 186336, Col 0)
function sW8(A) {
  let Q = {
      upArrow: A.name === "up",
      downArrow: A.name === "down",
      leftArrow: A.name === "left",
      rightArrow: A.name === "right",
      pageDown: A.name === "pagedown",
      pageUp: A.name === "pageup",
      home: A.name === "home",
      end: A.name === "end",
      return: A.name === "return",
      escape: A.name === "escape",
      fn: A.fn,
      ctrl: A.ctrl,
      shift: A.shift,
      tab: A.name === "tab",
      backspace: A.name === "backspace",
      delete: A.name === "delete",
      meta: A.meta || A.name === "escape" || A.option
    },
    B = A.ctrl ? A.name : A.sequence;
  if (B === void 0) B = "";
  if (A.name && LwB.includes(A.name)) B = "";
  if (B.startsWith("\x1B")) B = B.slice(1);
  if (B.startsWith("[") && B.endsWith("u") && A.name) B = A.name === "space" ? " " : A.name;
  if (B.length === 1 && typeof B[0] === "string" && B[0] >= "A" && B[0] <= "Z") Q.shift = !0;
  return [Q, B]
}
// @from(Ln 186364, Col 4)
C21
// @from(Ln 186365, Col 4)
fQ0 = w(() => {
  bQ0();
  C21 = class C21 extends ya {
    keypress;
    key;
    input;
    constructor(A) {
      super();
      let [Q, B] = sW8(A);
      this.keypress = A, this.key = Q, this.input = B
    }
  }
})
// @from(Ln 186378, Col 4)
p_A
// @from(Ln 186379, Col 4)
hQ0 = w(() => {
  p_A = class p_A extends ya {
    type;
    constructor(A) {
      super();
      this.type = A
    }
  }
})
// @from(Ln 186388, Col 4)
OwB
// @from(Ln 186388, Col 9)
AN
// @from(Ln 186389, Col 4)
ba = w(() => {
  OwB = c(QA(), 1), AN = OwB.createContext(!1)
})
// @from(Ln 186392, Col 4)
MwB
// @from(Ln 186392, Col 9)
l_A
// @from(Ln 186393, Col 4)
U21 = w(() => {
  MwB = c(QA(), 1), l_A = MwB.createContext(null)
})
// @from(Ln 186397, Col 0)
function q21(A) {
  return iI(`?${A}h`)
}
// @from(Ln 186401, Col 0)
function N21(A) {
  return iI(`?${A}l`)
}
// @from(Ln 186404, Col 4)
gH
// @from(Ln 186404, Col 8)
RwB
// @from(Ln 186404, Col 13)
_wB
// @from(Ln 186404, Col 18)
jwB
// @from(Ln 186404, Col 23)
QDA
// @from(Ln 186404, Col 28)
gQ0
// @from(Ln 186404, Col 33)
pBA
// @from(Ln 186404, Col 38)
TP
// @from(Ln 186404, Col 42)
i_A
// @from(Ln 186405, Col 4)
lBA = w(() => {
  wk();
  gH = {
    CURSOR_VISIBLE: 25,
    ALT_SCREEN: 47,
    ALT_SCREEN_CLEAR: 1049,
    MOUSE_NORMAL: 1000,
    MOUSE_BUTTON: 1002,
    MOUSE_ANY: 1003,
    FOCUS_EVENTS: 1004,
    BRACKETED_PASTE: 2004,
    SYNCHRONIZED_UPDATE: 2026
  };
  RwB = q21(gH.SYNCHRONIZED_UPDATE), _wB = N21(gH.SYNCHRONIZED_UPDATE), jwB = q21(gH.BRACKETED_PASTE), QDA = N21(gH.BRACKETED_PASTE), gQ0 = q21(gH.FOCUS_EVENTS), pBA = N21(gH.FOCUS_EVENTS), TP = q21(gH.CURSOR_VISIBLE), i_A = N21(gH.CURSOR_VISIBLE)
})
// @from(Ln 186421, Col 0)
function PwB(A) {
  if (TwB = A, !A) {
    for (let Q of uQ0) Q();
    uQ0.clear()
  }
}
// @from(Ln 186428, Col 0)
function SwB() {
  if (!TwB) return Promise.resolve();
  return new Promise((A) => {
    uQ0.add(A)
  })
}
// @from(Ln 186434, Col 4)
TwB = !0
// @from(Ln 186435, Col 2)
uQ0
// @from(Ln 186436, Col 4)
mQ0 = w(() => {
  uQ0 = new Set
})
// @from(Ln 186440, Col 0)
function BK8(A, Q, B, G) {
  for (let Z of Q) {
    let Y = Z.sequence;
    if (Y === gUB) {
      A.handleTerminalFocus(!0);
      let X = new p_A("terminalfocus");
      A.internal_eventEmitter.emit("terminalfocus", X);
      continue
    }
    if (Y === uUB) {
      A.handleTerminalFocus(!1);
      let X = new p_A("terminalblur");
      A.internal_eventEmitter.emit("terminalblur", X);
      continue
    }
    A.handleInput(Y);
    let J = new C21(Z);
    A.internal_eventEmitter.emit("input", J)
  }
}
// @from(Ln 186460, Col 4)
PP
// @from(Ln 186460, Col 8)
xwB
// @from(Ln 186460, Col 13)
tW8 = "\t"
// @from(Ln 186461, Col 2)
eW8 = "\x1B[Z"
// @from(Ln 186462, Col 2)
AK8 = "\x1B"
// @from(Ln 186463, Col 2)
QK8
// @from(Ln 186463, Col 7)
w21