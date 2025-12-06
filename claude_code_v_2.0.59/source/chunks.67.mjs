
// @from(Start 6290980, End 6290988)
kX6 = {}
// @from(Start 6290994, End 6290997)
WUB
// @from(Start 6291003, End 6291086)
XUB = L(() => {
  YUB();
  WUB = BA(JUB(), 1);
  WUB.default.connectToDevTools()
})
// @from(Start 6291092, End 6291095)
KUB
// @from(Start 6291097, End 6291421)
VUB = (A, Q) => {
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
// @from(Start 6291425, End 6291536)
DUB = (A) => {
    if ("childNodes" in A)
      for (let Q of A.childNodes) DUB(Q);
    A.yogaNode = void 0
  }
// @from(Start 6291540, End 6291641)
FUB = (A) => {
    let Q = A.yogaNode;
    if (Q) Q.unsetMeasureFunc(), DUB(A), Q.freeRecursive()
  }
// @from(Start 6291645, End 6291647)
Ap
// @from(Start 6291653, End 6295711)
$g1 = L(() => {
  qEB();
  ft();
  EaA();
  GzB();
  KUB = BA(wEB(), 1);
  if (process.env.DEV === "true") try {
    Promise.resolve().then(() => XUB())
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
  Ap = KUB.default({
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
      if (G.isInsideText && A === "ink-box") throw Error("<Box> can’t be nested inside <Text> component");
      let Z = A === "ink-text" && G.isInsideText ? "ink-virtual-text" : A,
        I = DaA(Z);
      for (let [Y, J] of Object.entries(Q)) {
        if (Y === "children") continue;
        if (Y === "style") {
          if (Bg1(I, J), I.yogaNode) Gg1(I.yogaNode, J);
          continue
        }
        if (Y === "textStyles") {
          I.textStyles = J;
          continue
        }
        if (Y === "internal_static") {
          I.internal_static = !0;
          continue
        }
        Qg1(I, Y, J)
      }
      return I
    },
    createTextInstance(A, Q, B) {
      if (!B.isInsideText) throw Error(`Text string "${A}" must be rendered inside <Text> component`);
      return QzB(A)
    },
    resetTextContent() {},
    hideTextInstance(A) {
      kUA(A, "")
    },
    unhideTextInstance(A, Q) {
      kUA(A, Q)
    },
    getPublicInstance: (A) => A,
    hideInstance(A) {
      A.yogaNode?.setDisplay(CT.None)
    },
    unhideInstance(A) {
      A.yogaNode?.setDisplay(CT.Flex)
    },
    appendInitialChild: HaA,
    appendChild: HaA,
    insertBefore: Ag1,
    finalizeInitialChildren(A, Q, B, G) {
      if (A.internal_static) G.isStaticDirty = !0, G.staticNode = A;
      return !1
    },
    isPrimaryRenderer: !0,
    supportsMutation: !0,
    supportsPersistence: !1,
    supportsHydration: !1,
    scheduleTimeout: setTimeout,
    cancelTimeout: clearTimeout,
    noTimeout: -1,
    getCurrentEventPriority: () => hh1,
    beforeActiveInstanceBlur() {},
    afterActiveInstanceBlur() {},
    detachDeletedInstance() {},
    getInstanceFromNode: () => null,
    prepareScopeUpdate() {},
    getInstanceFromScope: () => null,
    appendChildToContainer: HaA,
    insertInContainerBefore: Ag1,
    removeChildFromContainer(A, Q) {
      _UA(A, Q), FUB(Q)
    },
    prepareUpdate(A, Q, B, G, Z) {
      if (A.internal_static) Z.isStaticDirty = !0;
      let I = VUB(B, G),
        Y = VUB(B.style, G.style);
      if (!I && !Y) return null;
      return {
        props: I,
        style: Y
      }
    },
    commitUpdate(A, Q) {
      let {
        props: B,
        style: G
      } = Q;
      if (B)
        for (let [Z, I] of Object.entries(B)) {
          if (Z === "style") {
            Bg1(A, I);
            continue
          }
          if (Z === "textStyles") {
            A.textStyles = I;
            continue
          }
          if (Z === "internal_static") {
            A.internal_static = !0;
            continue
          }
          Qg1(A, Z, I)
        }
      if (G && A.yogaNode) Gg1(A.yogaNode, G)
    },
    commitTextUpdate(A, Q, B) {
      kUA(A, B)
    },
    removeChild(A, Q) {
      _UA(A, Q), FUB(Q)
    }
  })
})
// @from(Start 6295714, End 6296330)
function wg1(A, Q = 1, B = {}) {
  let {
    indent: G = " ",
    includeEmptyLines: Z = !1
  } = B;
  if (typeof A !== "string") throw TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof A}\``);
  if (typeof Q !== "number") throw TypeError(`Expected \`count\` to be a \`number\`, got \`${typeof Q}\``);
  if (Q < 0) throw RangeError(`Expected \`count\` to be at least 0, got \`${Q}\``);
  if (typeof G !== "string") throw TypeError(`Expected \`options.indent\` to be a \`string\`, got \`${typeof G}\``);
  if (Q === 0) return A;
  let I = Z ? /^/gm : /^(?!\s*$)/gm;
  return A.replace(I, G.repeat(Q))
}
// @from(Start 6296335, End 6296513)
yX6 = (A) => {
    return A.getComputedWidth() - A.getComputedPadding(_6.Left) - A.getComputedPadding(_6.Right) - A.getComputedBorder(_6.Left) - A.getComputedBorder(_6.Right)
  }
// @from(Start 6296517, End 6296520)
HUB
// @from(Start 6296526, End 6296564)
CUB = L(() => {
  ft();
  HUB = yX6
})
// @from(Start 6296570, End 6298050)
EUB = z((ac7, xX6) => {
  xX6.exports = {
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
// @from(Start 6298056, End 6298150)
UUB = z((sc7, qg1) => {
  var zUB = EUB();
  qg1.exports = zUB;
  qg1.exports.default = zUB
})
// @from(Start 6298153, End 6298431)
function R7A(A) {
  switch (A) {
    case "light":
      return vX6;
    case "light-ansi":
      return bX6;
    case "dark-ansi":
      return fX6;
    case "light-daltonized":
      return hX6;
    case "dark-daltonized":
      return uX6;
    default:
      return gX6
  }
}
// @from(Start 6298436, End 6298439)
vX6
// @from(Start 6298441, End 6298444)
bX6
// @from(Start 6298446, End 6298449)
fX6
// @from(Start 6298451, End 6298454)
hX6
// @from(Start 6298456, End 6298459)
gX6
// @from(Start 6298461, End 6298464)
uX6
// @from(Start 6298470, End 6312651)
_aA = L(() => {
  vX6 = {
    autoAccept: "rgb(135,0,255)",
    bashBorder: "rgb(255,0,135)",
    claude: "rgb(215,119,87)",
    claudeShimmer: "rgb(245,149,117)",
    claudeBlue_FOR_SYSTEM_SPINNER: "rgb(87,105,247)",
    claudeBlueShimmer_FOR_SYSTEM_SPINNER: "rgb(117,135,255)",
    permission: "rgb(87,105,247)",
    permissionShimmer: "rgb(137,155,255)",
    planMode: "rgb(0,102,102)",
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
  }, bX6 = {
    autoAccept: "ansi:magenta",
    bashBorder: "ansi:magenta",
    claude: "ansi:redBright",
    claudeShimmer: "ansi:yellowBright",
    claudeBlue_FOR_SYSTEM_SPINNER: "ansi:blue",
    claudeBlueShimmer_FOR_SYSTEM_SPINNER: "ansi:blueBright",
    permission: "ansi:blue",
    permissionShimmer: "ansi:blueBright",
    planMode: "ansi:cyan",
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
  }, fX6 = {
    autoAccept: "ansi:magentaBright",
    bashBorder: "ansi:magentaBright",
    claude: "ansi:redBright",
    claudeShimmer: "ansi:yellowBright",
    claudeBlue_FOR_SYSTEM_SPINNER: "ansi:blueBright",
    claudeBlueShimmer_FOR_SYSTEM_SPINNER: "ansi:blueBright",
    permission: "ansi:blueBright",
    permissionShimmer: "ansi:blueBright",
    planMode: "ansi:cyanBright",
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
  }, hX6 = {
    autoAccept: "rgb(135,0,255)",
    bashBorder: "rgb(0,102,204)",
    claude: "rgb(255,153,51)",
    claudeShimmer: "rgb(255,183,101)",
    claudeBlue_FOR_SYSTEM_SPINNER: "rgb(51,102,255)",
    claudeBlueShimmer_FOR_SYSTEM_SPINNER: "rgb(101,152,255)",
    permission: "rgb(51,102,255)",
    permissionShimmer: "rgb(101,152,255)",
    planMode: "rgb(51,102,102)",
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
  }, gX6 = {
    autoAccept: "rgb(175,135,255)",
    bashBorder: "rgb(253,93,177)",
    claude: "rgb(215,119,87)",
    claudeShimmer: "rgb(235,159,127)",
    claudeBlue_FOR_SYSTEM_SPINNER: "rgb(147,165,255)",
    claudeBlueShimmer_FOR_SYSTEM_SPINNER: "rgb(177,195,255)",
    permission: "rgb(177,185,249)",
    permissionShimmer: "rgb(207,215,255)",
    planMode: "rgb(72,150,140)",
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
  }, uX6 = {
    autoAccept: "rgb(175,135,255)",
    bashBorder: "rgb(51,153,255)",
    claude: "rgb(255,153,51)",
    claudeShimmer: "rgb(255,183,101)",
    claudeBlue_FOR_SYSTEM_SPINNER: "rgb(153,204,255)",
    claudeBlueShimmer_FOR_SYSTEM_SPINNER: "rgb(183,224,255)",
    permission: "rgb(153,204,255)",
    permissionShimmer: "rgb(183,224,255)",
    planMode: "rgb(102,153,153)",
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
  }
})
// @from(Start 6312654, End 6313036)
function pUA(A, Q) {
  let B = A;
  if (Q.inverse) B = tA.inverse(B);
  if (Q.strikethrough) B = tA.strikethrough(B);
  if (Q.underline) B = tA.underline(B);
  if (Q.italic) B = tA.italic(B);
  if (Q.bold) B = tA.bold(B);
  if (Q.dim) B = tA.dim(B);
  if (Q.color) B = cUA(B, Q.color, "foreground");
  if (Q.backgroundColor) B = cUA(B, Q.backgroundColor, "background");
  return B
}
// @from(Start 6313038, End 6313113)
function lUA(A, Q) {
  if (!Q) return A;
  return cUA(A, Q, "foreground")
}
// @from(Start 6313115, End 6313355)
function ZB(A, Q, B = "foreground") {
  return (G) => {
    if (!A) return G;
    if (A.startsWith("rgb(") || A.startsWith("#") || A.startsWith("ansi256(") || A.startsWith("ansi:")) return cUA(G, A, B);
    return cUA(G, R7A(Q)[A], B)
  }
}
// @from(Start 6313360, End 6313363)
mX6
// @from(Start 6313365, End 6313368)
dX6
// @from(Start 6313370, End 6315407)
cUA = (A, Q, B) => {
  if (!Q) return A;
  if (Q.startsWith("ansi:")) switch (Q.substring(5)) {
    case "black":
      return B === "foreground" ? tA.black(A) : tA.bgBlack(A);
    case "red":
      return B === "foreground" ? tA.red(A) : tA.bgRed(A);
    case "green":
      return B === "foreground" ? tA.green(A) : tA.bgGreen(A);
    case "yellow":
      return B === "foreground" ? tA.yellow(A) : tA.bgYellow(A);
    case "blue":
      return B === "foreground" ? tA.blue(A) : tA.bgBlue(A);
    case "magenta":
      return B === "foreground" ? tA.magenta(A) : tA.bgMagenta(A);
    case "cyan":
      return B === "foreground" ? tA.cyan(A) : tA.bgCyan(A);
    case "white":
      return B === "foreground" ? tA.white(A) : tA.bgWhite(A);
    case "blackBright":
      return B === "foreground" ? tA.blackBright(A) : tA.bgBlackBright(A);
    case "redBright":
      return B === "foreground" ? tA.redBright(A) : tA.bgRedBright(A);
    case "greenBright":
      return B === "foreground" ? tA.greenBright(A) : tA.bgGreenBright(A);
    case "yellowBright":
      return B === "foreground" ? tA.yellowBright(A) : tA.bgYellowBright(A);
    case "blueBright":
      return B === "foreground" ? tA.blueBright(A) : tA.bgBlueBright(A);
    case "magentaBright":
      return B === "foreground" ? tA.magentaBright(A) : tA.bgMagentaBright(A);
    case "cyanBright":
      return B === "foreground" ? tA.cyanBright(A) : tA.bgCyanBright(A);
    case "whiteBright":
      return B === "foreground" ? tA.whiteBright(A) : tA.bgWhiteBright(A)
  }
  if (Q.startsWith("#")) return B === "foreground" ? tA.hex(Q)(A) : tA.bgHex(Q)(A);
  if (Q.startsWith("ansi256")) {
    let G = dX6.exec(Q);
    if (!G) return A;
    let Z = Number(G[1]);
    return B === "foreground" ? tA.ansi256(Z)(A) : tA.bgAnsi256(Z)(A)
  }
  if (Q.startsWith("rgb")) {
    let G = mX6.exec(Q);
    if (!G) return A;
    let Z = Number(G[1]),
      I = Number(G[2]),
      Y = Number(G[3]);
    return B === "foreground" ? tA.rgb(Z, I, Y)(A) : tA.bgRgb(Z, I, Y)(A)
  }
  return A
}
// @from(Start 6315413, End 6315531)
iUA = L(() => {
  F9();
  _aA();
  mX6 = /^rgb\(\s?(\d+),\s?(\d+),\s?(\d+)\s?\)$/, dX6 = /^ansi256\(\s?(\d+)\s?\)$/
})
// @from(Start 6315534, End 6315941)
function $UB(A, Q, B, G = 0, Z) {
  let I = xZ(Q),
    Y = A.length;
  if (I >= Y - 2) return Q.substring(0, Y);
  let J;
  if (B === "center") J = Math.floor((Y - I) / 2);
  else if (B === "start") J = G + 1;
  else J = Y - I - G - 1;
  J = Math.max(1, Math.min(J, Y - I - 1));
  let W = Z.repeat(J - 1),
    X = Z.repeat(Y - J - I - 1);
  return A.substring(0, 1) + W + Q + X + A.substring(A.length - 1)
}
// @from(Start 6315946, End 6315949)
wUB
// @from(Start 6315951, End 6315954)
cX6
// @from(Start 6315956, End 6318046)
pX6 = (A, Q, B, G) => {
    if (B.style.borderStyle) {
      let Z = Math.floor(B.yogaNode.getComputedWidth()),
        I = Math.floor(B.yogaNode.getComputedHeight()),
        Y = typeof B.style.borderStyle === "string" ? cX6[B.style.borderStyle] ?? wUB.default[B.style.borderStyle] : B.style.borderStyle,
        J = B.style.borderTopColor ?? B.style.borderColor,
        W = B.style.borderBottomColor ?? B.style.borderColor,
        X = B.style.borderLeftColor ?? B.style.borderColor,
        V = B.style.borderRightColor ?? B.style.borderColor,
        F = B.style.borderTopDimColor ?? B.style.borderDimColor,
        K = B.style.borderBottomDimColor ?? B.style.borderDimColor,
        D = B.style.borderLeftDimColor ?? B.style.borderDimColor,
        H = B.style.borderRightDimColor ?? B.style.borderDimColor,
        C = B.style.borderTop !== !1,
        E = B.style.borderBottom !== !1,
        U = B.style.borderLeft !== !1,
        q = B.style.borderRight !== !1,
        w = Math.max(0, Z - (U ? 1 : 0) - (q ? 1 : 0)),
        N = C ? (U ? Y.topLeft : "") + Y.top.repeat(w) + (q ? Y.topRight : "") : "";
      if (C && B.style.borderText?.position === "top") {
        let e = B.style.borderText;
        N = $UB(N, e.content, e.align, e.offset, Y.top)
      }
      let R = C ? lUA(N, J) : void 0;
      if (C && F) R = tA.dim(R);
      let T = I;
      if (C) T -= 1;
      if (E) T -= 1;
      T = Math.max(0, T);
      let y = (lUA(Y.left, X) + `
`).repeat(T);
      if (D) y = tA.dim(y);
      let v = (lUA(Y.right, V) + `
`).repeat(T);
      if (H) v = tA.dim(v);
      let x = E ? (U ? Y.bottomLeft : "") + Y.bottom.repeat(w) + (q ? Y.bottomRight : "") : "";
      if (E && B.style.borderText?.position === "bottom") {
        let e = B.style.borderText;
        x = $UB(x, e.content, e.align, e.offset, Y.bottom)
      }
      let p = E ? lUA(x, W) : void 0;
      if (E && K) p = tA.dim(p);
      let u = C ? 1 : 0;
      if (R) G.write(A, Q, R);
      if (U) G.write(A, Q + u, y);
      if (q) G.write(A + Z - 1, Q + u, v);
      if (p) G.write(A, Q + I - 1, p)
    }
  }
// @from(Start 6318050, End 6318053)
qUB
// @from(Start 6318059, End 6318327)
NUB = L(() => {
  F9();
  E7A();
  iUA();
  wUB = BA(UUB(), 1), cX6 = {
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
  qUB = pX6
})
// @from(Start 6318330, End 6318402)
function Ng1(A, Q) {
  return `${LUB}8;;${Q}${MUB}${A}${LUB}8;;${MUB}`
}
// @from(Start 6318404, End 6319743)
function lX6(A) {
  if (A.length === 0) return {};
  let Q = A[0].styles,
    B = A.slice(1),
    G = Q.color !== void 0 && B.every((F) => F.styles.color === Q.color) ? Q.color : void 0,
    Z = Q.backgroundColor !== void 0 && B.every((F) => F.styles.backgroundColor === Q.backgroundColor) ? Q.backgroundColor : void 0,
    I = Q.dim !== void 0 && B.every((F) => F.styles.dim === Q.dim) ? Q.dim : void 0,
    Y = Q.bold !== void 0 && B.every((F) => F.styles.bold === Q.bold) ? Q.bold : void 0,
    J = Q.italic !== void 0 && B.every((F) => F.styles.italic === Q.italic) ? Q.italic : void 0,
    W = Q.underline !== void 0 && B.every((F) => F.styles.underline === Q.underline) ? Q.underline : void 0,
    X = Q.strikethrough !== void 0 && B.every((F) => F.styles.strikethrough === Q.strikethrough) ? Q.strikethrough : void 0,
    V = Q.inverse !== void 0 && B.every((F) => F.styles.inverse === Q.inverse) ? Q.inverse : void 0;
  return {
    ...G !== void 0 && {
      color: G
    },
    ...Z !== void 0 && {
      backgroundColor: Z
    },
    ...I !== void 0 && {
      dim: I
    },
    ...Y !== void 0 && {
      bold: Y
    },
    ...J !== void 0 && {
      italic: J
    },
    ...W !== void 0 && {
      underline: W
    },
    ...X !== void 0 && {
      strikethrough: X
    },
    ...V !== void 0 && {
      inverse: V
    }
  }
}
// @from(Start 6319745, End 6319799)
function iX6(A) {
  return Object.keys(A).length > 0
}
// @from(Start 6319801, End 6319983)
function nX6(A, Q) {
  let B = A.childNodes[0]?.yogaNode;
  if (B) {
    let G = B.getComputedLeft(),
      Z = B.getComputedTop();
    Q = `
`.repeat(Z) + wg1(Q, G)
  }
  return Q
}
// @from(Start 6319985, End 6322177)
function OUB(A, Q, {
  offsetX: B = 0,
  offsetY: G = 0,
  skipStaticElements: Z
}) {
  if (Z && A.internal_static) return;
  let {
    yogaNode: I
  } = A;
  if (I) {
    if (I.getDisplay() === CT.None) return;
    let Y = B + I.getComputedLeft(),
      J = G + I.getComputedTop();
    if (A.nodeName === "ink-text") {
      let X = KaA(A),
        V = X.map((F) => F.text).join("");
      if (V.length > 0) {
        let F = HUB(I),
          K = A.style.textWrap ?? "wrap",
          H = C7A(V) > F,
          C;
        if (H && X.length === 1) {
          let E = X[0];
          C = ob(V, F, K).split(`
`).map((q) => {
            let w = pUA(q, E.styles);
            if (E.hyperlink) w = Ng1(w, E.hyperlink);
            return w
          }).join(`
`)
        } else if (H) {
          C = X.map((U) => {
            let q = pUA(U.text, U.styles);
            if (U.hyperlink) q = Ng1(q, U.hyperlink);
            return q
          }).join(""), C = ob(C, F, K);
          let E = lX6(X);
          if (iX6(E)) C = C.split(`
`).map((U) => pUA(U, E)).join(`
`)
        } else C = X.map((E) => {
          let U = pUA(E.text, E.styles);
          if (E.hyperlink) U = Ng1(U, E.hyperlink);
          return U
        }).join("");
        C = nX6(A, C), Q.write(Y, J, C)
      }
      return
    }
    let W = !1;
    if (A.nodeName === "ink-box") {
      qUB(Y, J, A, Q);
      let X = A.style.overflowX === "hidden" || A.style.overflow === "hidden",
        V = A.style.overflowY === "hidden" || A.style.overflow === "hidden";
      if (X || V) {
        let F = X ? Y + I.getComputedBorder(_6.Left) : void 0,
          K = X ? Y + I.getComputedWidth() - I.getComputedBorder(_6.Right) : void 0,
          D = V ? J + I.getComputedBorder(_6.Top) : void 0,
          H = V ? J + I.getComputedHeight() - I.getComputedBorder(_6.Bottom) : void 0;
        Q.clip({
          x1: F,
          x2: K,
          y1: D,
          y2: H
        }), W = !0
      }
    }
    if (A.nodeName === "ink-root" || A.nodeName === "ink-box") {
      for (let X of A.childNodes) OUB(X, Q, {
        offsetX: Y,
        offsetY: J,
        skipStaticElements: Z
      });
      if (W) Q.unclip()
    }
  }
}
// @from(Start 6322182, End 6322195)
LUB = "\x1B]"
// @from(Start 6322199, End 6322211)
MUB = "\x07"
// @from(Start 6322215, End 6322218)
Lg1
// @from(Start 6322224, End 6322316)
RUB = L(() => {
  YaA();
  ft();
  FaA();
  CUB();
  th1();
  NUB();
  iUA();
  Lg1 = OUB
})
// @from(Start 6322319, End 6322398)
function Mg1(A) {
  if (!Number.isInteger(A)) return !1;
  return ht(A) === 2
}
// @from(Start 6322403, End 6322429)
TUB = L(() => {
  PUA()
})
// @from(Start 6322432, End 6322676)
function oX6(A) {
  if (Rg1.has(A)) return A;
  if (Og1.has(A)) return Og1.get(A);
  if (A = A.slice(2), A.includes(";")) A = A[0] + "0";
  let Q = u7.codes.get(Number.parseInt(A, 10));
  if (Q) return u7.color.ansi(Q);
  return u7.reset.open
}
// @from(Start 6322678, End 6322821)
function tX6(A) {
  for (let Q = 0; Q < A.length; Q++) {
    let B = A.codePointAt(Q);
    if (B >= sX6 && B <= rX6) return Q
  }
  return -1
}
// @from(Start 6322823, End 6323003)
function eX6(A, Q) {
  A = A.slice(Q, Q + 19);
  let B = tX6(A);
  if (B !== -1) {
    let G = A.indexOf("m", B);
    if (G === -1) G = A.length;
    return A.slice(0, G + 1)
  }
}
// @from(Start 6323005, End 6323568)
function AV6(A, Q = Number.POSITIVE_INFINITY) {
  let B = [],
    G = 0,
    Z = 0;
  while (G < A.length) {
    let I = A.codePointAt(G);
    if (aX6.has(I)) {
      let W = eX6(A, G);
      if (W) {
        B.push({
          type: "ansi",
          code: W,
          endCode: oX6(W)
        }), G += W.length;
        continue
      }
    }
    let Y = Mg1(I),
      J = String.fromCodePoint(I);
    if (B.push({
        type: "character",
        value: J,
        isFullWidth: Y
      }), G += J.length, Z += Y ? 2 : J.length, Z >= Q) break
  }
  return B
}
// @from(Start 6323570, End 6323812)
function PUB(A) {
  let Q = [];
  for (let B of A)
    if (B.code === u7.reset.open) Q = [];
    else if (Rg1.has(B.code)) Q = Q.filter((G) => G.endCode !== B.code);
  else Q = Q.filter((G) => G.endCode !== B.endCode), Q.push(B);
  return Q
}
// @from(Start 6323814, End 6323901)
function QV6(A) {
  return PUB(A).map(({
    endCode: G
  }) => G).reverse().join("")
}
// @from(Start 6323903, End 6324338)
function ct(A, Q, B) {
  let G = AV6(A, B),
    Z = [],
    I = 0,
    Y = "",
    J = !1;
  for (let W of G) {
    if (B !== void 0 && I >= B) break;
    if (W.type === "ansi") {
      if (Z.push(W), J) Y += W.code
    } else {
      if (!J && I >= Q) J = !0, Z = PUB(Z), Y = Z.map(({
        code: X
      }) => X).join("");
      if (J) Y += W.value;
      I += W.isFullWidth ? 2 : W.value.length
    }
  }
  return Y += QV6(Z), Y
}
// @from(Start 6324343, End 6324346)
aX6
// @from(Start 6324348, End 6324351)
sX6
// @from(Start 6324353, End 6324356)
rX6
// @from(Start 6324358, End 6324361)
Rg1
// @from(Start 6324363, End 6324366)
Og1
// @from(Start 6324372, End 6324620)
Tg1 = L(() => {
  z7A();
  TUB();
  aX6 = new Set([27, 155]), sX6 = "0".codePointAt(0), rX6 = "9".codePointAt(0), Rg1 = new Set, Og1 = new Map;
  for (let [A, Q] of u7.codes) Rg1.add(u7.color.ansi(Q)), Og1.set(u7.color.ansi(A), u7.color.ansi(Q))
})
// @from(Start 6324623, End 6324968)
function Sg1(A) {
  if (kaA.has(A)) return A;
  if (Pg1.has(A)) return Pg1.get(A);
  if (A.startsWith(yaA)) return BV6;
  if (A = A.slice(2), A.startsWith("38")) return u7.color.close;
  else if (A.startsWith("48")) return u7.bgColor.close;
  let Q = u7.codes.get(parseInt(A, 10));
  if (Q) return u7.color.ansi(Q);
  else return u7.reset.open
}
// @from(Start 6324970, End 6325027)
function pt(A) {
  return A.map((Q) => Q.code).join("")
}
// @from(Start 6325032, End 6325035)
jUB
// @from(Start 6325037, End 6325040)
SUB
// @from(Start 6325042, End 6325045)
_UB
// @from(Start 6325047, End 6325050)
kaA
// @from(Start 6325052, End 6325055)
Pg1
// @from(Start 6325057, End 6325073)
yaA = "\x1B]8;;"
// @from(Start 6325077, End 6325080)
jg1
// @from(Start 6325082, End 6325094)
kUB = "\x07"
// @from(Start 6325098, End 6325101)
$p7
// @from(Start 6325103, End 6325106)
BV6
// @from(Start 6325112, End 6325451)
nUA = L(() => {
  z7A();
  jUB = new Set([27, 155]), SUB = "[".codePointAt(0), _UB = "]".codePointAt(0), kaA = new Set, Pg1 = new Map;
  for (let [A, Q] of u7.codes) kaA.add(u7.color.ansi(Q)), Pg1.set(u7.color.ansi(A), u7.color.ansi(Q));
  jg1 = yaA.split("").map((A) => A.charCodeAt(0)), $p7 = kUB.charCodeAt(0), BV6 = `\x1B]8;;${kUB}`
})
// @from(Start 6325454, End 6325493)
function _g1(A) {
  return xaA([], A)
}
// @from(Start 6325495, End 6325890)
function xaA(A, Q) {
  let B = [...A];
  for (let G of Q)
    if (G.code === u7.reset.open) B = [];
    else if (kaA.has(G.code)) B = B.filter((Z) => Z.endCode !== G.code);
  else if (G.code === u7.bold.open || G.code === u7.dim.open) {
    if (!B.find((I) => I.code === G.code && I.endCode === G.endCode)) B.push(G)
  } else B = B.filter((I) => I.endCode !== G.endCode), B.push(G);
  return B
}
// @from(Start 6325895, End 6325930)
vaA = L(() => {
  z7A();
  nUA()
})
// @from(Start 6325933, End 6326028)
function kg1(A) {
  return _g1(A).reverse().map((Q) => ({
    ...Q,
    code: Q.endCode
  }))
}
// @from(Start 6326033, End 6326059)
yg1 = L(() => {
  vaA()
})
// @from(Start 6326062, End 6326256)
function Qp(A, Q) {
  let B = new Set(Q.map((Z) => Z.endCode)),
    G = new Set(A.map((Z) => Z.code));
  return [...kg1(A.filter((Z) => !B.has(Z.endCode))), ...Q.filter((Z) => !G.has(Z.code))]
}
// @from(Start 6326261, End 6326287)
xg1 = L(() => {
  yg1()
})
// @from(Start 6326290, End 6326485)
function yUB(A) {
  let Q = [],
    B = [];
  for (let G of A)
    if (G.type === "ansi") Q = xaA(Q, [G]);
    else if (G.type === "char") B.push({
    ...G,
    styles: [...Q]
  });
  return B
}
// @from(Start 6326487, End 6326745)
function xUB(A) {
  let Q = "";
  for (let B = 0; B < A.length; B++) {
    let G = A[B];
    if (B === 0) Q += pt(G.styles);
    else Q += pt(Qp(A[B - 1].styles, G.styles));
    if (Q += G.value, B === A.length - 1) Q += pt(Qp(G.styles, []))
  }
  return Q
}
// @from(Start 6326750, End 6326794)
vUB = L(() => {
  nUA();
  xg1();
  vaA()
})
// @from(Start 6326797, End 6326881)
function vg1(A) {
  if (!Number.isInteger(A)) return !1;
  return RUA(A) || TUA(A)
}
// @from(Start 6326886, End 6326912)
bUB = L(() => {
  PUA()
})
// @from(Start 6326915, End 6327130)
function GV6(A, Q) {
  A = A.slice(Q);
  for (let G = 1; G < jg1.length; G++)
    if (A.charCodeAt(G) !== jg1[G]) return;
  let B = A.indexOf("\x07", yaA.length);
  if (B === -1) return;
  return A.slice(0, B + 1)
}
// @from(Start 6327132, End 6327343)
function WV6(A) {
  for (let Q = 2; Q < A.length; Q++) {
    let B = A.charCodeAt(Q);
    if (B === JV6) return Q;
    if (B === YV6) continue;
    if (B >= ZV6 && B <= IV6) continue;
    break
  }
  return -1
}
// @from(Start 6327345, End 6327454)
function XV6(A, Q) {
  A = A.slice(Q);
  let B = WV6(A);
  if (B === -1) return;
  return A.slice(0, B + 1)
}
// @from(Start 6327456, End 6327968)
function VV6(A) {
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
// @from(Start 6327970, End 6328822)
function fUB(A, Q = Number.POSITIVE_INFINITY) {
  let B = [],
    G = 0,
    Z = 0;
  while (G < A.length) {
    let I = A.codePointAt(G);
    if (jUB.has(I)) {
      let W, X = A.codePointAt(G + 1);
      if (X === _UB) {
        if (W = GV6(A, G), W) B.push({
          type: "ansi",
          code: W,
          endCode: Sg1(W)
        })
      } else if (X === SUB) {
        if (W = XV6(A, G), W) {
          let V = VV6(W);
          for (let F of V) B.push({
            type: "ansi",
            code: F,
            endCode: Sg1(F)
          })
        }
      }
      if (W) {
        G += W.length;
        continue
      }
    }
    let Y = vg1(I),
      J = String.fromCodePoint(I);
    if (B.push({
        type: "char",
        value: J,
        fullWidth: Y
      }), G += J.length, Z += Y ? 2 : J.length, Z >= Q) break
  }
  return B
}
// @from(Start 6328827, End 6328835)
ZV6 = 48
// @from(Start 6328839, End 6328847)
IV6 = 57
// @from(Start 6328851, End 6328859)
YV6 = 59
// @from(Start 6328863, End 6328872)
JV6 = 109
// @from(Start 6328878, End 6328913)
hUB = L(() => {
  bUB();
  nUA()
})
// @from(Start 6328919, End 6328990)
baA = L(() => {
  nUA();
  xg1();
  vaA();
  yg1();
  vUB();
  hUB()
})
// @from(Start 6328993, End 6329056)
function faA(A, Q) {
  return Q.x < A.width && Q.y < A.height
}
// @from(Start 6329058, End 6329210)
function OW(A, Q) {
  if (A === void 0) return;
  if (Number.isInteger(A)) return;
  g(`${Q} should be an integer, got ${A}`, {
    level: "warn"
  })
}
// @from(Start 6329215, End 6329240)
bg1 = L(() => {
  V0()
})
// @from(Start 6329246, End 6329265)
uUB = "\x1B[?2026h"
// @from(Start 6329269, End 6329288)
mUB = "\x1B[?2026l"
// @from(Start 6329292, End 6329304)
dUB = "\x1B"
// @from(Start 6329308, End 6329321)
fg1 = "\x1B]"
// @from(Start 6329325, End 6329337)
T7A = "\x07"
// @from(Start 6329341, End 6329350)
P7A = ";"
// @from(Start 6329353, End 6329391)
function lUB(A) {
  return A === pUB
}
// @from(Start 6329393, End 6329688)
function KV6(A, Q) {
  if (A.char !== Q.char || A.width !== Q.width) return !1;
  if (A.hyperlink !== Q.hyperlink) return !1;
  if (A.styles.length !== Q.styles.length) return !1;
  for (let B = 0; B < A.styles.length; B++)
    if (A.styles[B].code !== Q.styles[B].code) return !1;
  return !0
}
// @from(Start 6329690, End 6330010)
function j7A(A, Q) {
  if (OW(A, "createScreen width"), OW(Q, "createScreen height"), !Number.isInteger(A) || A < 0) A = Math.max(0, Math.floor(A) || 0);
  if (!Number.isInteger(Q) || Q < 0) Q = Math.max(0, Math.floor(Q) || 0);
  let B = Array(A * Q).fill(pUB);
  return {
    width: A,
    height: Q,
    cells: B
  }
}
// @from(Start 6330012, End 6330111)
function haA(A, Q) {
  if (!faA(A, Q)) return;
  let B = Q.y * A.width + Q.x;
  return A.cells[B]
}
// @from(Start 6330113, End 6330203)
function cUB(A, Q) {
  let {
    x: B,
    y: G
  } = Q, Z = A.width;
  return G * Z + B
}
// @from(Start 6330205, End 6330447)
function hg1(A, Q, B) {
  if (!faA(A, Q)) return;
  let G = cUB(A, Q);
  if (A.cells[G] = B, B.width === 1) {
    let Z = {
      x: Q.x + 1,
      y: Q.y
    };
    if (faA(A, Z)) {
      let I = cUB(A, Z);
      A.cells[I] = FV6
    }
  }
}
// @from(Start 6330449, End 6330569)
function nUB(A) {
  for (let Q of A) {
    let B = Q.code.match(iUB);
    if (B) return B[1] || null
  }
  return null
}
// @from(Start 6330571, End 6330634)
function aUB(A) {
  return A.filter((Q) => !iUB.test(Q.code))
}
// @from(Start 6330636, End 6331002)
function sUB(A, Q) {
  let B = [],
    G = Math.max(A.height, Q.height),
    Z = Math.max(A.width, Q.width);
  for (let I = 0; I < G; I += 1)
    for (let Y = 0; Y < Z; Y += 1) {
      let J = {
          x: Y,
          y: I
        },
        W = haA(A, J),
        X = haA(Q, J);
      if (W && X && KV6(W, X)) continue;
      B.push([J, W, X])
    }
  return B
}
// @from(Start 6331007, End 6331010)
pUB
// @from(Start 6331012, End 6331015)
FV6
// @from(Start 6331017, End 6331020)
iUB
// @from(Start 6331026, End 6331311)
aUA = L(() => {
  bg1();
  pUB = Object.freeze({
    char: " ",
    styles: [],
    width: 0,
    hyperlink: void 0
  });
  FV6 = Object.freeze({
    char: "",
    styles: [],
    width: 2,
    hyperlink: void 0
  });
  iUB = new RegExp(`^${dUB}\\]8${P7A}${P7A}([^${T7A}]*)${T7A}$`)
})
// @from(Start 6331313, End 6336502)
class sUA {
  width;
  height;
  ink2;
  operations = [];
  charCache;
  styledCharsToStringCache = {};
  constructor(A) {
    let {
      width: Q,
      height: B,
      ink2: G = !1,
      charCache: Z = new Map
    } = A;
    this.width = Q, this.height = B, this.ink2 = G, this.charCache = Z
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
    for (let Z = 0; Z < this.height; Z++) A[Z] = Array(this.width).fill(rUB);
    let Q = j7A(this.width, this.height),
      B = [];
    for (let Z of this.operations) {
      if (Z.type === "clip") B.push(Z.clip);
      if (Z.type === "unclip") B.pop();
      if (Z.type === "write") {
        let {
          text: I
        } = Z, {
          x: Y,
          y: J
        } = Z, W = I.split(`
`), X = B.at(-1);
        if (X) {
          let F = typeof X?.x1 === "number" && typeof X?.x2 === "number",
            K = typeof X?.y1 === "number" && typeof X?.y2 === "number";
          if (F) {
            let D = C7A(I);
            if (Y + D < X.x1 || Y > X.x2) continue
          }
          if (K) {
            let D = W.length;
            if (J + D < X.y1 || J > X.y2) continue
          }
          if (F) {
            if (W = W.map((D) => {
                let H = Y < X.x1 ? X.x1 - Y : 0,
                  C = xZ(D),
                  E = Y + C > X.x2 ? X.x2 - Y : C;
                return ct(D, H, E)
              }), Y < X.x1) Y = X.x1
          }
          if (K) {
            let D = J < X.y1 ? X.y1 - J : 0,
              H = W.length,
              C = J + H > X.y2 ? X.y2 - J : H;
            if (W = W.slice(D, C), J < X.y1) J = X.y1
          }
        }
        let V = 0;
        for (let F of W) {
          let K = A[J + V];
          if (!K) continue;
          let D = this.charCache.get(F);
          if (!D) {
            let C = yUB(fUB(F));
            D = this.ink2 ? CV6(C) : C, this.charCache.set(F, D)
          }
          let H = Y;
          for (let C = 0; C < D.length; C++) {
            let E = D[C];
            if (this.ink2) {
              let q = E.value.codePointAt(0);
              if (q === 8203 || q === 8204 || q === 8205 || q === 65279 || q === 8288) continue;
              if (q !== void 0 && q <= 31) {
                if (q === 9) {
                  let N = 8 - H % 8;
                  for (let R = 0; R < N && H < this.width; R++) K[H] = rUB, hg1(Q, {
                    x: H,
                    y: J + V
                  }, {
                    char: " ",
                    styles: [],
                    width: 0,
                    hyperlink: void 0
                  }), H++
                } else if (q === 27) {
                  let w = D[C + 1]?.value,
                    N = w?.codePointAt(0);
                  if (w === "(" || w === ")" || w === "*" || w === "+") C += 2;
                  else if (w === "[") {
                    C++;
                    while (C < D.length - 1) {
                      C++;
                      let R = D[C]?.value.codePointAt(0);
                      if (R !== void 0 && R >= 64 && R <= 126) break
                    }
                  } else if (w === "]" || w === "P" || w === "_" || w === "^" || w === "X") {
                    C++;
                    while (C < D.length - 1) {
                      C++;
                      let R = D[C]?.value;
                      if (R === "\x07") break;
                      if (R === "\x1B") {
                        if (D[C + 1]?.value === "\\") {
                          C++;
                          break
                        }
                      }
                    }
                  } else if (N !== void 0 && N >= 48 && N <= 126) C++
                }
                continue
              }
            }
            K[H] = E;
            let U = E.fullWidth || E.value.length > 1;
            if (this.ink2) {
              let q = {
                  x: H,
                  y: J + V
                },
                w = nUB(E.styles),
                N = w ? aUB(E.styles) : E.styles;
              hg1(Q, q, {
                char: E.value,
                styles: N,
                width: U ? 1 : 0,
                hyperlink: w ?? void 0
              })
            }
            if (U) K[H + 1] = {
              type: "char",
              value: "",
              fullWidth: !1,
              styles: E.styles
            };
            H += U ? 2 : 1
          }
          V++
        }
      }
    }
    return {
      output: this.ink2 ? "" : A.map((Z) => {
        let I = Z.filter((J) => J !== void 0),
          Y = JSON.stringify(I);
        if (!Object.prototype.hasOwnProperty.call(this.styledCharsToStringCache, Y)) {
          let J = xUB(I).trimEnd();
          this.styledCharsToStringCache[Y] = J
        }
        return this.styledCharsToStringCache[Y]
      }).join(`
`),
      height: A.length,
      screen: Q
    }
  }
}
// @from(Start 6336504, End 6336717)
function HV6(A, Q) {
  if (A === Q) return !0;
  let B = A.length;
  if (B !== Q.length) return !1;
  if (B === 0) return !0;
  for (let G = 0; G < B; G++)
    if (A[G].code !== Q[G].code) return !1;
  return !0
}
// @from(Start 6336719, End 6337431)
function CV6(A) {
  let Q = A.length;
  if (Q === 0) return [];
  let B = [],
    G = [],
    Z = A[0].styles;
  for (let I = 0; I < Q; I++) {
    let Y = A[I],
      J = Y.styles;
    if (G.length > 0 && !HV6(J, Z)) {
      let W = G.join("");
      for (let {
          segment: X
        }
        of oUB.segment(W)) B.push({
        type: "char",
        value: X,
        fullWidth: $D(X) === 2,
        styles: Z
      });
      G.length = 0
    }
    G.push(Y.value), Z = J
  }
  if (G.length > 0) {
    let I = G.join("");
    for (let {
        segment: Y
      }
      of oUB.segment(I)) B.push({
      type: "char",
      value: Y,
      fullWidth: $D(Y) === 2,
      styles: Z
    })
  }
  return B
}
// @from(Start 6337436, End 6337439)
rUB
// @from(Start 6337441, End 6337444)
oUB
// @from(Start 6337450, End 6337647)
tUB = L(() => {
  Tg1();
  YaA();
  baA();
  E7A();
  aUA();
  jUA();
  rUB = Object.freeze({
    type: "char",
    value: " ",
    fullWidth: !1,
    styles: []
  });
  oUB = new Intl.Segmenter
})
// @from(Start 6337650, End 6339605)
function gg1(A) {
  let Q = new Map;
  return (B) => {
    let {
      terminalWidth: G,
      terminalRows: Z,
      isTTY: I,
      ink2: Y
    } = B, J = A.yogaNode?.getComputedHeight(), W = A.yogaNode?.getComputedWidth(), X = J === void 0 || !Number.isFinite(J) || J < 0, V = W === void 0 || !Number.isFinite(W) || W < 0;
    if (!A.yogaNode || X || V) {
      if (A.yogaNode && (X || V)) g(`Invalid yoga dimensions: width=${W}, height=${J}, childNodes=${A.childNodes.length}, terminalWidth=${G}, terminalRows=${Z}`);
      return {
        output: "",
        outputHeight: 0,
        staticOutput: "",
        rows: Z,
        columns: G,
        cursorVisible: !0,
        screen: j7A(G, 0),
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
    let F = new sUA({
      width: Math.floor(A.yogaNode.getComputedWidth()),
      height: Math.floor(A.yogaNode.getComputedHeight()),
      ink2: Y,
      charCache: Y ? Q : new Map
    });
    Lg1(A, F, {
      skipStaticElements: !0
    });
    let K, D = A.staticNode,
      H = D?.yogaNode?.getComputedHeight(),
      C = D?.yogaNode?.getComputedWidth(),
      E = H !== void 0 && Number.isFinite(H) && H >= 0 && C !== void 0 && Number.isFinite(C) && C >= 0;
    if (!Y && D && D.yogaNode && E) K = new sUA({
      width: Math.floor(C),
      height: Math.floor(H),
      ink2: !1
    }), Lg1(D, K, {
      skipStaticElements: !1
    });
    let {
      output: U,
      height: q,
      screen: w
    } = F.get();
    return {
      output: U,
      outputHeight: q,
      staticOutput: K ? `${K.get().output}
` : "",
      rows: Z,
      columns: G,
      cursorVisible: !I || U === "",
      screen: w,
      viewport: {
        width: G,
        height: Z
      },
      cursor: {
        x: 0,
        y: w.height,
        visible: !0
      },
      progress: eUB(A)
    }
  }
}
// @from(Start 6339607, End 6339925)
function eUB(A) {
  if (A.nodeName === "ink-progress") {
    let Q = A.attributes.state;
    if (Q) return {
      state: Q,
      percentage: A.attributes.percentage
    }
  }
  for (let Q of A.childNodes)
    if ("nodeName" in Q && Q.nodeName !== "#text") {
      let B = eUB(Q);
      if (B) return B
    } return
}
// @from(Start 6339930, End 6339982)
A$B = L(() => {
  RUB();
  tUB();
  aUA();
  V0()
})
// @from(Start 6339985, End 6340273)
function gaA(A, Q) {
  return {
    output: "",
    outputHeight: 0,
    staticOutput: "",
    rows: A,
    columns: Q,
    cursorVisible: !0,
    screen: j7A(0, 0),
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
// @from(Start 6340275, End 6340442)
function Q$B(A, Q) {
  let B = Q.rows !== A.rows || Q.columns !== A.columns,
    G = Q.outputHeight >= Q.rows,
    Z = A.outputHeight >= A.rows;
  return B || G || Z
}
// @from(Start 6340447, End 6340473)
ug1 = L(() => {
  aUA()
})
// @from(Start 6340475, End 6346300)
class pg1 {
  options;
  state;
  constructor(A, Q) {
    this.options = A;
    this.state = {
      fullStaticOutput: "",
      previousOutput: "",
      prevFrame: Q
    }
  }
  render(A) {
    let Q = this.options.ink2 ? this.render_v2(this.state.prevFrame, A) : this.render_v1(this.state.prevFrame, A);
    return this.state.prevFrame = A, Q
  }
  render_v1(A, Q) {
    if (this.options.debug) return this.getRenderOpsDebug_DEPRECATED(Q);
    if (!this.options.isTTY) return [{
      type: "stdout",
      content: Q.staticOutput
    }];
    if (Q$B(A, Q)) return this.getRenderOpsForAllOutput_CAUSES_FLICKER(Q, "resize");
    if (!(Q.staticOutput && Q.staticOutput !== `
`) && Q.output === A.output) return mg1([], A, Q);
    let G = [...this.getRenderOpsForClearAndRenderStaticOutput(A, Q), ...this.renderEfficiently(A, Q)];
    return mg1(G, A, Q)
  }
  renderPreviousOutput_DEPRECATED() {
    if (!this.options.isTTY) return [{
      type: "stdout",
      content: this.state.prevFrame.output
    }, {
      type: "stdout",
      content: `
`
    }];
    else if (!this.options.debug) return this.getRenderOpsForDone(this.state.prevFrame);
    return []
  }
  reset() {
    this.state.prevFrame = gaA(this.state.prevFrame.rows, this.state.prevFrame.columns), this.state.previousOutput = ""
  }
  renderEfficiently(A, Q) {
    let B = Q.output + `
`;
    if (B === this.state.previousOutput) return [];
    let G = this.state.previousOutput ? SUA(this.state.previousOutput, A.columns) : 0;
    this.state.previousOutput = B;
    let Z = [];
    if (!Q.cursorVisible && A.cursorVisible) Z.push({
      type: "cursorHide"
    });
    else if (Q.cursorVisible && !A.cursorVisible) Z.push({
      type: "cursorShow"
    });
    if (G > 0) Z.push({
      type: "clear",
      count: G
    });
    return Z.push({
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
    let G = this.state.previousOutput ? SUA(this.state.previousOutput, A.columns) : 0;
    this.state.previousOutput = "";
    let Z = [];
    if (G > 0) Z.push({
      type: "clear",
      count: G
    });
    return Z.push({
      type: "stdout",
      content: Q.staticOutput
    }), Z
  }
  getRenderOpsForDone(A) {
    if (this.state.previousOutput = "", !A.cursorVisible) return [{
      type: "cursorShow"
    }];
    return []
  }
  render_v2(A, Q) {
    if (Q.screen.height === 0 || Q.screen.width === 0) return [];
    if (Q.viewport.height < A.viewport.height || A.viewport.width !== 0 && Q.viewport.width !== A.viewport.width) return dg1(Q, "resize");
    let B = new lg1(A.cursor, Q.viewport.width),
      G = Math.max(Q.screen.height, 1) - Math.max(A.screen.height, 1),
      Z = G < 0,
      I = G > 0;
    if (Z) {
      let X = A.screen.height - Q.screen.height;
      if (X > A.viewport.height) return dg1(Q, "offscreen");
      B.txn((V) => [
        [{
          type: "clear",
          count: X
        }, {
          type: "cursorMove",
          x: 0,
          y: -1
        }], {
          dx: -V.x,
          dy: -X
        }
      ])
    }
    let Y = Math.max(A.screen.height, Q.screen.height) - Q.viewport.height,
      J = [],
      W = void 0;
    for (let [X, V, F] of sUB(A.screen, Q.screen)) {
      if (I && X.y >= A.screen.height) continue;
      if (F && (F.width === 2 || F.width === 3)) continue;
      if (V && (V.width === 2 || V.width === 3) && !F) continue;
      if (F && lUB(F) && !V) continue;
      if (X.y < Y) return dg1(Q, "offscreen");
      if (cg1(B, X), F) {
        let K = F.hyperlink;
        W = B$B(B.diff, W, K), J = Z$B(B, F, J)
      } else if (V) B.txn(() => [
        [{
          type: "stdout",
          content: " "
        }], {
          dx: 1,
          dy: 0
        }
      ])
    }
    if (J.length > 0) {
      let X = Qp(J, []);
      if (X.length > 0) B.diff.push({
        type: "style",
        codes: X
      });
      J = []
    }
    if (W !== void 0) B.diff.push({
      type: "hyperlink",
      uri: ""
    }), W = void 0;
    if (I) G$B(B, Q, A.screen.height, Q.screen.height);
    if (Q.cursor.y >= Q.screen.height) B.txn((X) => {
      let V = Q.cursor.y - X.y;
      if (V > 0) {
        let K = [{
          type: "carriageReturn"
        }];
        for (let D = 0; D < V; D++) K.push({
          type: "stdout",
          content: `
`
        });
        return [K, {
          dx: -X.x,
          dy: V
        }]
      }
      let F = Q.cursor.y - X.y;
      if (F !== 0 || X.x !== Q.cursor.x) return [
        [{
          type: "carriageReturn"
        }, {
          type: "cursorMove",
          x: Q.cursor.x,
          y: F
        }], {
          dx: Q.cursor.x - X.x,
          dy: F
        }
      ];
      return [
        [], {
          dx: 0,
          dy: 0
        }
      ]
    });
    else cg1(B, Q.cursor);
    return mg1(B.diff, A, Q)
  }
}
// @from(Start 6346302, End 6346646)
function mg1(A, Q, B) {
  let G = Q.progress,
    Z = B.progress;
  if (!(G?.state !== Z?.state || G?.percentage !== Z?.percentage)) return A;
  if (Z) return [...A, {
    type: "progress",
    state: Z
  }];
  else if (G) return [...A, {
    type: "progress",
    state: {
      state: "completed",
      percentage: 0
    }
  }];
  return A
}
// @from(Start 6346648, End 6346764)
function B$B(A, Q, B) {
  if (Q !== B) return A.push({
    type: "hyperlink",
    uri: B ?? ""
  }), B;
  return Q
}
// @from(Start 6346766, End 6346931)
function dg1(A, Q) {
  let B = new lg1({
    x: 0,
    y: 0
  }, A.viewport.width);
  return EV6(B, A), [{
    type: "clearTerminal",
    reason: Q
  }, ...B.diff]
}
// @from(Start 6346933, End 6346987)
function EV6(A, Q) {
  G$B(A, Q, 0, Q.screen.height)
}
// @from(Start 6346989, End 6347742)
function G$B(A, Q, B, G) {
  let Z = [],
    I = void 0;
  for (let Y = B; Y < G; Y += 1) {
    for (let J = 0; J < Q.screen.width; J += 1) {
      let W = {
          x: J,
          y: Y
        },
        X = haA(Q.screen, W);
      if (!X) continue;
      if (X.width === 2 || X.width === 3) continue;
      cg1(A, W);
      let V = X.hyperlink;
      I = B$B(A.diff, I, V), Z = Z$B(A, X, Z)
    }
    A.txn((J) => [
      [{
        type: "stdout",
        content: `
`
      }], {
        dx: -J.x,
        dy: 1
      }
    ])
  }
  if (I !== void 0) A.diff.push({
    type: "hyperlink",
    uri: ""
  });
  if (Z.length > 0) {
    let Y = Qp(Z, []);
    if (Y.length > 0) A.diff.push({
      type: "style",
      codes: Y
    })
  }
  return A
}
// @from(Start 6347744, End 6348177)
function Z$B(A, Q, B) {
  let G = Qp(B, Q.styles);
  return A.txn((Z) => {
    let I = Q.width === 1 ? 2 : 1,
      Y = Z.x >= A.viewportWidth ? I - Z.x : I,
      J = Z.x >= A.viewportWidth ? 1 : 0;
    return [G.length > 0 ? [{
      type: "style",
      codes: G
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
  }), Q.styles
}
// @from(Start 6348179, End 6348910)
function cg1(A, Q) {
  A.txn((B) => {
    let G = Q.x - B.x,
      Z = Q.y - B.y;
    if (B.x >= A.viewportWidth && Z <= 0) {
      let Y = Z - 1;
      return [
        [{
          type: "resolvePendingWrap"
        }, {
          type: "carriageReturn"
        }, {
          type: "cursorMove",
          x: Q.x,
          y: Y
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
// @from(Start 6348911, End 6349230)
class lg1 {
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
// @from(Start 6349235, End 6349288)
I$B = L(() => {
  ph1();
  ug1();
  aUA();
  baA()
})
// @from(Start 6349294, End 6349297)
zV6
// @from(Start 6349299, End 6349301)
Qf
// @from(Start 6349307, End 6349351)
uaA = L(() => {
  zV6 = new Map, Qf = zV6
})
// @from(Start 6349353, End 6349564)
class S7A {
  _didStopImmediatePropagation = !1;
  didStopImmediatePropagation() {
    return this._didStopImmediatePropagation
  }
  stopImmediatePropagation() {
    this._didStopImmediatePropagation = !0
  }
}
// @from(Start 6349617, End 6349619)
Bp
// @from(Start 6349625, End 6349988)
maA = L(() => {
  Bp = class Bp extends UV6 {
    emit(A, ...Q) {
      if (A === "error") return super.emit(A, ...Q);
      let B = this.rawListeners(A);
      if (B.length === 0) return !1;
      let G = Q[0] instanceof S7A ? Q[0] : null;
      for (let Z of B)
        if (Z.apply(this, Q), G?.didStopImmediatePropagation()) break;
      return !0
    }
  }
})
// @from(Start 6349994, End 6349997)
Y$B
// @from(Start 6349999, End 6350002)
J$B
// @from(Start 6350004, End 6350007)
daA
// @from(Start 6350013, End 6350152)
ig1 = L(() => {
  Y$B = BA(VA(), 1), J$B = Y$B.createContext({
    exit() {}
  });
  J$B.displayName = "InternalAppContext";
  daA = J$B
})
// @from(Start 6350158, End 6350161)
W$B
// @from(Start 6350163, End 6350166)
X$B
// @from(Start 6350168, End 6350171)
caA
// @from(Start 6350177, End 6350452)
ng1 = L(() => {
  maA();
  W$B = BA(VA(), 1), X$B = W$B.createContext({
    stdin: process.stdin,
    internal_eventEmitter: new Bp,
    setRawMode() {},
    isRawModeSupported: !1,
    internal_exitOnCtrlC: !0
  });
  X$B.displayName = "InternalStdinContext";
  caA = X$B
})
// @from(Start 6350458, End 6350461)
V$B
// @from(Start 6350463, End 6350466)
F$B
// @from(Start 6350468, End 6350471)
paA
// @from(Start 6350477, End 6350801)
laA = L(() => {
  V$B = BA(VA(), 1), F$B = V$B.createContext({
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
  F$B.displayName = "InternalFocusContext";
  paA = F$B
})
// @from(Start 6350807, End 6351001)
D$B = z((Ml7, K$B) => {
  var $V6 = /[|\\{}()[\]^$+*?.-]/g;
  K$B.exports = (A) => {
    if (typeof A !== "string") throw TypeError("Expected a string");
    return A.replace($V6, "\\$&")
  }
})
// @from(Start 6351007, End 6356053)
z$B = z((Ol7, E$B) => {
  var wV6 = D$B(),
    qV6 = typeof process === "object" && process && typeof process.cwd === "function" ? process.cwd() : ".",
    C$B = [].concat(UA("module").builtinModules, "bootstrap_node", "node").map((A) => new RegExp(`(?:\\((?:node:)?${A}(?:\\.js)?:\\d+:\\d+\\)$|^\\s*at (?:node:)?${A}(?:\\.js)?:\\d+:\\d+$)`));
  C$B.push(/\((?:node:)?internal\/[^:]+:\d+:\d+\)$/, /\s*at (?:node:)?internal\/[^:]+:\d+:\d+$/, /\/\.node-spawn-wrap-\w+-\w+\/node:\d+:\d+\)?$/);
  class ag1 {
    constructor(A) {
      if (A = {
          ignoredPackages: [],
          ...A
        }, "internals" in A === !1) A.internals = ag1.nodeInternals();
      if ("cwd" in A === !1) A.cwd = qV6;
      this._cwd = A.cwd.replace(/\\/g, "/"), this._internals = [].concat(A.internals, NV6(A.ignoredPackages)), this._wrapCallSite = A.wrapCallSite || !1
    }
    static nodeInternals() {
      return [...C$B]
    }
    clean(A, Q = 0) {
      if (Q = " ".repeat(Q), !Array.isArray(A)) A = A.split(`
`);
      if (!/^\s*at /.test(A[0]) && /^\s*at /.test(A[1])) A = A.slice(1);
      let B = !1,
        G = null,
        Z = [];
      return A.forEach((I) => {
        if (I = I.replace(/\\/g, "/"), this._internals.some((J) => J.test(I))) return;
        let Y = /^\s*at /.test(I);
        if (B) I = I.trimEnd().replace(/^(\s+)at /, "$1");
        else if (I = I.trim(), Y) I = I.slice(3);
        if (I = I.replace(`${this._cwd}/`, ""), I)
          if (Y) {
            if (G) Z.push(G), G = null;
            Z.push(I)
          } else B = !0, G = I
      }), Z.map((I) => `${Q}${I}
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
      if (Error.prepareStackTrace = (Y, J) => {
          if (this._wrapCallSite) return J.map(this._wrapCallSite);
          return J
        }, A) Error.stackTraceLimit = A;
      let Z = {};
      Error.captureStackTrace(Z, Q);
      let {
        stack: I
      } = Z;
      return Object.assign(Error, {
        prepareStackTrace: B,
        stackTraceLimit: G
      }), I
    }
    at(A = this.at) {
      let [Q] = this.capture(1, A);
      if (!Q) return {};
      let B = {
        line: Q.getLineNumber(),
        column: Q.getColumnNumber()
      };
      if (H$B(B, Q.getFileName(), this._cwd), Q.isConstructor()) Object.defineProperty(B, "constructor", {
        value: !0,
        configurable: !0
      });
      if (Q.isEval()) B.evalOrigin = Q.getEvalOrigin();
      if (Q.isNative()) B.native = !0;
      let G;
      try {
        G = Q.getTypeName()
      } catch (Y) {}
      if (G && G !== "Object" && G !== "[object Object]") B.type = G;
      let Z = Q.getFunctionName();
      if (Z) B.function = Z;
      let I = Q.getMethodName();
      if (I && Z !== I) B.method = I;
      return B
    }
    parseLine(A) {
      let Q = A && A.match(LV6);
      if (!Q) return null;
      let B = Q[1] === "new",
        G = Q[2],
        Z = Q[3],
        I = Q[4],
        Y = Number(Q[5]),
        J = Number(Q[6]),
        W = Q[7],
        X = Q[8],
        V = Q[9],
        F = Q[10] === "native",
        K = Q[11] === ")",
        D, H = {};
      if (X) H.line = Number(X);
      if (V) H.column = Number(V);
      if (K && W) {
        let C = 0;
        for (let E = W.length - 1; E > 0; E--)
          if (W.charAt(E) === ")") C++;
          else if (W.charAt(E) === "(" && W.charAt(E - 1) === " ") {
          if (C--, C === -1 && W.charAt(E - 1) === " ") {
            let U = W.slice(0, E - 1);
            W = W.slice(E + 1), G += ` (${U}`;
            break
          }
        }
      }
      if (G) {
        let C = G.match(MV6);
        if (C) G = C[1], D = C[2]
      }
      if (H$B(H, W, this._cwd), B) Object.defineProperty(H, "constructor", {
        value: !0,
        configurable: !0
      });
      if (Z) H.evalOrigin = Z, H.evalLine = Y, H.evalColumn = J, H.evalFile = I && I.replace(/\\/g, "/");
      if (F) H.native = !0;
      if (G) H.function = G;
      if (D && G !== D) H.method = D;
      return H
    }
  }

  function H$B(A, Q, B) {
    if (Q) {
      if (Q = Q.replace(/\\/g, "/"), Q.startsWith(`${B}/`)) Q = Q.slice(B.length + 1);
      A.file = Q
    }
  }

  function NV6(A) {
    if (A.length === 0) return [];
    let Q = A.map((B) => wV6(B));
    return new RegExp(`[/\\\\]node_modules[/\\\\](?:${Q.join("|")})[/\\\\][^:]+:\\d+:\\d+`)
  }
  var LV6 = new RegExp("^(?:\\s*at )?(?:(new) )?(?:(.*?) \\()?(?:eval at ([^ ]+) \\((.+?):(\\d+):(\\d+)\\), )?(?:(.+?):(\\d+):(\\d+)|(native))(\\)?)$"),
    MV6 = /^(.*?) \[as (.*?)\]$/;
  E$B.exports = ag1
})
// @from(Start 6356059, End 6356148)
OV6 = (A, Q = 2) => {
    return A.replace(/^\t+/gm, (B) => " ".repeat(B.length * Q))
  }
// @from(Start 6356152, End 6356155)
U$B
// @from(Start 6356161, End 6356191)
$$B = L(() => {
  U$B = OV6
})
// @from(Start 6356197, End 6356325)
RV6 = (A, Q) => {
    let B = [],
      G = A - Q,
      Z = A + Q;
    for (let I = G; I <= Z; I++) B.push(I);
    return B
  }
// @from(Start 6356329, End 6356744)
TV6 = (A, Q, B = {}) => {
    var G;
    if (typeof A !== "string") throw TypeError("Source code is missing.");
    if (!Q || Q < 1) throw TypeError("Line number must start from `1`.");
    let Z = U$B(A).split(/\r?\n/);
    if (Q > Z.length) return;
    return RV6(Q, (G = B.around) !== null && G !== void 0 ? G : 3).filter((I) => Z[I - 1] !== void 0).map((I) => ({
      line: I,
      value: Z[I - 1]
    }))
  }
// @from(Start 6356748, End 6356751)
w$B
// @from(Start 6356757, End 6356796)
q$B = L(() => {
  $$B();
  w$B = TV6
})
// @from(Start 6356802, End 6356805)
iaA
// @from(Start 6356807, End 6356810)
N$B
// @from(Start 6356812, End 6356814)
VU
// @from(Start 6356820, End 6357898)
rUA = L(() => {
  bg1();
  iaA = BA(VA(), 1), N$B = iaA.forwardRef(({
    children: A,
    flexWrap: Q = "nowrap",
    flexDirection: B = "row",
    flexGrow: G = 0,
    flexShrink: Z = 1,
    ...I
  }, Y) => {
    return OW(I.margin, "margin"), OW(I.marginX, "marginX"), OW(I.marginY, "marginY"), OW(I.marginTop, "marginTop"), OW(I.marginBottom, "marginBottom"), OW(I.marginLeft, "marginLeft"), OW(I.marginRight, "marginRight"), OW(I.padding, "padding"), OW(I.paddingX, "paddingX"), OW(I.paddingY, "paddingY"), OW(I.paddingTop, "paddingTop"), OW(I.paddingBottom, "paddingBottom"), OW(I.paddingLeft, "paddingLeft"), OW(I.paddingRight, "paddingRight"), OW(I.gap, "gap"), OW(I.columnGap, "columnGap"), OW(I.rowGap, "rowGap"), iaA.default.createElement("ink-box", {
      ref: Y,
      style: {
        flexWrap: Q,
        flexDirection: B,
        flexGrow: G,
        flexShrink: Z,
        ...I,
        overflowX: I.overflowX ?? I.overflow ?? "visible",
        overflowY: I.overflowY ?? I.overflow ?? "visible"
      }
    }, A)
  });
  N$B.displayName = "Box";
  VU = N$B
})
// @from(Start 6357901, End 6358445)
function og1({
  children: A,
  initialState: Q
}) {
  let [B, G] = Gp.useState(Q), [Z, I] = Gp.useState(null), Y = naA.useMemo(() => ({
    theme: B,
    setTheme: (J) => {
      c0({
        ...N1(),
        theme: J
      }), G(J), sg1(J), I(null)
    },
    setPreviewTheme: (J) => {
      I(J), sg1(J)
    },
    savePreview: () => {
      if (Z !== null) c0({
        ...N1(),
        theme: Z
      }), G(Z), I(null)
    },
    currentTheme: Z ?? B
  }), [B, Z]);
  return naA.default.createElement(rg1.Provider, {
    value: Y
  }, A)
}
// @from(Start 6358447, End 6358551)
function qB() {
  let {
    currentTheme: A,
    setTheme: Q
  } = Gp.useContext(rg1);
  return [A, Q]
}
// @from(Start 6358553, End 6358706)
function tg1() {
  let {
    setPreviewTheme: A,
    savePreview: Q
  } = Gp.useContext(rg1);
  return {
    setPreviewTheme: A,
    savePreview: Q
  }
}
// @from(Start 6358711, End 6358714)
naA
// @from(Start 6358716, End 6358718)
Gp
// @from(Start 6358720, End 6358723)
rg1
// @from(Start 6358729, End 6358955)
oUA = L(() => {
  jQ();
  eg1();
  naA = BA(VA(), 1), Gp = BA(VA(), 1), rg1 = Gp.createContext({
    theme: null,
    setTheme: (A) => A,
    setPreviewTheme: (A) => A,
    savePreview: () => {},
    currentTheme: null
  })
})
// @from(Start 6358958, End 6359704)
function lt({
  color: A,
  backgroundColor: Q,
  bold: B,
  dim: G,
  italic: Z = !1,
  underline: I = !1,
  strikethrough: Y = !1,
  inverse: J = !1,
  wrap: W = "wrap",
  children: X
}) {
  if (X === void 0 || X === null) return null;
  let V = {
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
    ...I && {
      underline: I
    },
    ...Y && {
      strikethrough: Y
    },
    ...J && {
      inverse: J
    }
  };
  return L$B.default.createElement("ink-text", {
    style: {
      flexGrow: 0,
      flexShrink: 1,
      flexDirection: "row",
      textWrap: W
    },
    textStyles: V
  }, X)
}
// @from(Start 6359709, End 6359712)
L$B
// @from(Start 6359718, End 6359756)
aaA = L(() => {
  L$B = BA(VA(), 1)
})
// @from(Start 6359759, End 6359925)
function PV6(A, Q) {
  if (!A) return;
  if (A.startsWith("rgb(") || A.startsWith("#") || A.startsWith("ansi256(") || A.startsWith("ansi:")) return A;
  return Q[A]
}
// @from(Start 6359927, End 6360401)
function $({
  color: A,
  backgroundColor: Q,
  dimColor: B = !1,
  bold: G = !1,
  italic: Z = !1,
  underline: I = !1,
  strikethrough: Y = !1,
  inverse: J = !1,
  wrap: W = "wrap",
  children: X
}) {
  let [V] = qB(), F = R7A(V), K = B ? F.inactive : PV6(A, F), D = Q ? F[Q] : void 0;
  return M$B.default.createElement(lt, {
    color: K,
    backgroundColor: D,
    bold: G,
    italic: Z,
    underline: I,
    strikethrough: Y,
    inverse: J,
    wrap: W
  }, X)
}
// @from(Start 6360406, End 6360409)
M$B
// @from(Start 6360415, End 6360480)
saA = L(() => {
  _aA();
  oUA();
  aaA();
  M$B = BA(VA(), 1)
})
// @from(Start 6360560, End 6362662)
function Qu1({
  error: A
}) {
  let Q = A.stack ? A.stack.split(`
`).slice(1) : void 0,
    B = Q ? R$B.parseLine(Q[0]) : void 0,
    G = O$B(B?.file),
    Z, I = 0;
  if (G && B?.line && raA.existsSync(G)) {
    let Y = raA.readFileSync(G, "utf8");
    if (Z = w$B(Y, B.line), Z)
      for (let {
          line: J
        }
        of Z) I = Math.max(I, String(J).length)
  }
  return gX.default.createElement(VU, {
    flexDirection: "column",
    padding: 1
  }, gX.default.createElement(VU, null, gX.default.createElement($, {
    backgroundColor: "error",
    color: "text"
  }, " ", "ERROR", " "), gX.default.createElement($, null, " ", A.message)), B && G && gX.default.createElement(VU, {
    marginTop: 1
  }, gX.default.createElement($, {
    dimColor: !0
  }, G, ":", B.line, ":", B.column)), B && Z && gX.default.createElement(VU, {
    marginTop: 1,
    flexDirection: "column"
  }, Z.map(({
    line: Y,
    value: J
  }) => gX.default.createElement(VU, {
    key: Y
  }, gX.default.createElement(VU, {
    width: I + 1
  }, gX.default.createElement($, {
    dimColor: Y !== B.line,
    backgroundColor: Y === B.line ? "error" : void 0,
    color: Y === B.line ? "text" : void 0
  }, String(Y).padStart(I, " "), ":")), gX.default.createElement($, {
    key: Y,
    backgroundColor: Y === B.line ? "error" : void 0,
    color: Y === B.line ? "text" : void 0
  }, " " + J)))), A.stack && gX.default.createElement(VU, {
    marginTop: 1,
    flexDirection: "column"
  }, A.stack.split(`
`).slice(1).map((Y) => {
    let J = R$B.parseLine(Y);
    if (!J) return gX.default.createElement(VU, {
      key: Y
    }, gX.default.createElement($, {
      dimColor: !0
    }, "- "), gX.default.createElement($, {
      dimColor: !0,
      bold: !0
    }, Y));
    return gX.default.createElement(VU, {
      key: Y
    }, gX.default.createElement($, {
      dimColor: !0
    }, "- "), gX.default.createElement($, {
      dimColor: !0,
      bold: !0
    }, J.function), gX.default.createElement($, {
      dimColor: !0
    }, " ", "(", O$B(J.file) ?? "", ":", J.line, ":", J.column, ")"))
  })))
}
// @from(Start 6362667, End 6362669)
gX
// @from(Start 6362671, End 6362674)
Au1
// @from(Start 6362676, End 6362740)
O$B = (A) => {
    return A?.replace(`file://${T$B()}/`, "")
  }
// @from(Start 6362744, End 6362747)
R$B
// @from(Start 6362753, End 6362926)
P$B = L(() => {
  q$B();
  rUA();
  saA();
  gX = BA(VA(), 1), Au1 = BA(z$B(), 1), R$B = new Au1.default({
    cwd: T$B(),
    internals: Au1.default.nodeInternals()
  })
})
// @from(Start 6362976, End 6363141)
function yV6(A) {
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
// @from(Start 6363143, End 6363401)
function bV6(A) {
  if (jV6.isBuffer(A))
    if (A[0] > 127 && A[1] === void 0) return A[0] -= 128, "\x1B" + String(A);
    else return String(A);
  else if (A !== void 0 && typeof A !== "string") return String(A);
  else if (!A) return "";
  else return A
}
// @from(Start 6363403, End 6364499)
function _$B(A, Q = "") {
  let B = Q === null,
    G = B ? "" : bV6(Q);
  if (A.mode === "IN_PASTE") {
    if ((A.incomplete.slice(-oaA.length + 1) + G).indexOf(oaA) === -1) return [
      [], {
        ...A,
        incomplete: A.incomplete + G
      }
    ]
  }
  let Z = A.incomplete + G,
    I = {
      ...A,
      incomplete: ""
    },
    Y = [],
    J = {
      NORMAL: () => {
        let W = xV6.exec(Z);
        Z = Z.substring(W[0].length);
        let X = W[1];
        if (!W[2] && !B) {
          let V = vV6.exec(X);
          I.incomplete = V[2], X = V[1]
        }
        if (X) Y.push(j$B(X));
        if (W[2] === kV6) I.mode = "IN_PASTE";
        else if (W[2]) Y.push(j$B(W[2]))
      },
      IN_PASTE: () => {
        let W = Z.indexOf(oaA);
        if (W === -1) {
          if (!B) {
            I.incomplete = Z, Z = "";
            return
          }
          W = Z.length
        }
        let X = Z.substring(0, W);
        if (X) Y.push(yV6(X));
        Z = Z.substring(W + oaA.length), I.mode = "NORMAL"
      }
    };
  while (Z) J[I.mode]();
  return [Y, I]
}
// @from(Start 6364504, End 6364507)
SV6
// @from(Start 6364509, End 6364512)
_V6
// @from(Start 6364514, End 6364531)
kV6 = "\x1B[200~"
// @from(Start 6364535, End 6364552)
oaA = "\x1B[201~"
// @from(Start 6364556, End 6364559)
xV6
// @from(Start 6364561, End 6364564)
vV6
// @from(Start 6364566, End 6364569)
S$B
// @from(Start 6364571, End 6364574)
k$B
// @from(Start 6364576, End 6364579)
y$B
// @from(Start 6364581, End 6364701)
fV6 = (A) => {
    return ["[a", "[b", "[c", "[d", "[e", "[2$", "[3$", "[5$", "[6$", "[7$", "[8$", "[Z"].includes(A)
  }
// @from(Start 6364705, End 6364819)
hV6 = (A) => {
    return ["Oa", "Ob", "Oc", "Od", "Oe", "[2^", "[3^", "[5^", "[6^", "[7^", "[8^"].includes(A)
  }
// @from(Start 6364823, End 6367851)
j$B = (A = "") => {
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
    if (B.sequence = B.sequence || A || B.name, A === "\r") B.raw = void 0, B.name = "return";
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
    else if (Q = SV6.exec(A)) B.meta = !0, B.shift = /^[A-Z]$/.test(Q[1]);
    else if (Q = _V6.exec(A)) {
      let G = [...A];
      if (G[0] === "\x1B" && G[1] === "\x1B") B.option = !0;
      let Z = [Q[1], Q[2], Q[4], Q[6]].filter(Boolean).join(""),
        I = (Q[3] || Q[5] || 1) - 1;
      B.ctrl = !!(I & 4), B.meta = !!(I & 10), B.shift = !!(I & 1), B.code = Z, B.name = k$B[Z], B.shift = fV6(Z) || B.shift, B.ctrl = hV6(Z) || B.ctrl
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
        };
      case "\x1B[1~":
        return {
          name: "left", ctrl: !0, fn: !0, meta: !1, shift: !1, option: !1, sequence: A, raw: A, isPasted: !1
        };
      case "\x1B[4~":
        return {
          name: "right", ctrl: !0, fn: !0, meta: !1, shift: !1, option: !1, sequence: A, raw: A, isPasted: !1
        }
    }
    return B
  }
// @from(Start 6367857, End 6369790)
Bu1 = L(() => {
  SV6 = /^(?:\x1b)([a-zA-Z0-9])$/, _V6 = /^(?:\x1b+)(O|N|\[|\[\[)(?:(\d+)(?:;(\d+))?([~^$])|(?:1;)?(\d+)?([a-zA-Z]))/;
  xV6 = new RegExp("^(.*?)(" + ["\\x1b\\][0-9]*(?:;[^\\x07\\x1b]*)*(?:\\x07|\\x1b\\\\)", "\\x1bP[^\\x1b]*\\x1b\\\\", "\\x1b\\[[0-9]*(?:;[0-9]*)*[A-Za-z~]", "\\x1bO[A-Za-z]", "\\x1b[\\x00-\\x7F]", "\\x1b\\x1b", "$"].map((A) => `(?:${A})`).join("|") + ")", "s"), vV6 = new RegExp("(.*?)(" + ["\\x1b\\][0-9]*(?:;[^\\x07\\x1b]*)*$", "\\x1bP[^\\x1b]*$", "\\x1b\\[[0-9]*(?:;[0-9]*)*$", "\\x1bO$", "\\x1b$", "$"].map((A) => `(?:${A})`).join("|") + ")", "s"), S$B = {
    mode: "NORMAL",
    incomplete: ""
  };
  k$B = {
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
  }, y$B = [...Object.values(k$B), "backspace"]
})
// @from(Start 6369796, End 6369799)
taA
// @from(Start 6369801, End 6369804)
il7
// @from(Start 6369806, End 6369809)
nl7
// @from(Start 6369811, End 6369814)
al7
// @from(Start 6369816, End 6369819)
sl7
// @from(Start 6369821, End 6369824)
rl7
// @from(Start 6369826, End 6369829)
ol7
// @from(Start 6369831, End 6369834)
tl7
// @from(Start 6369836, End 6369839)
el7
// @from(Start 6369841, End 6369844)
Ai7
// @from(Start 6369846, End 6369849)
tUA
// @from(Start 6369851, End 6369854)
Qi7
// @from(Start 6369856, End 6369859)
Bi7
// @from(Start 6369861, End 6369864)
Gi7
// @from(Start 6369866, End 6369869)
Zi7
// @from(Start 6369871, End 6369874)
Ii7
// @from(Start 6369880, End 6371484)
x$B = L(() => {
  taA = globalThis.window?.document !== void 0, il7 = globalThis.process?.versions?.node !== void 0, nl7 = globalThis.process?.versions?.bun !== void 0, al7 = globalThis.Deno?.version?.deno !== void 0, sl7 = globalThis.process?.versions?.electron !== void 0, rl7 = globalThis.navigator?.userAgent?.includes("jsdom") === !0, ol7 = typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope, tl7 = typeof DedicatedWorkerGlobalScope < "u" && globalThis instanceof DedicatedWorkerGlobalScope, el7 = typeof SharedWorkerGlobalScope < "u" && globalThis instanceof SharedWorkerGlobalScope, Ai7 = typeof ServiceWorkerGlobalScope < "u" && globalThis instanceof ServiceWorkerGlobalScope, tUA = globalThis.navigator?.userAgentData?.platform, Qi7 = tUA === "macOS" || globalThis.navigator?.platform === "MacIntel" || globalThis.navigator?.userAgent?.includes(" Mac ") === !0 || globalThis.process?.platform === "darwin", Bi7 = tUA === "Windows" || globalThis.navigator?.platform === "Win32" || globalThis.process?.platform === "win32", Gi7 = tUA === "Linux" || globalThis.navigator?.platform?.startsWith("Linux") === !0 || globalThis.navigator?.userAgent?.includes(" Linux ") === !0 || globalThis.process?.platform === "linux", Zi7 = tUA === "iOS" || globalThis.navigator?.platform === "MacIntel" && globalThis.navigator?.maxTouchPoints > 1 || /iPad|iPhone|iPod/.test(globalThis.navigator?.platform), Ii7 = tUA === "Android" || globalThis.navigator?.platform === "Android" || globalThis.navigator?.userAgent?.includes(" Android ") === !0 || globalThis.process?.platform === "android"
})
// @from(Start 6371490, End 6371497)
XM = {}
// @from(Start 6372364, End 6372376)
P7 = "\x1B["
// @from(Start 6372380, End 6372393)
A$A = "\x1B]"
// @from(Start 6372397, End 6372409)
_7A = "\x07"
// @from(Start 6372413, End 6372422)
eUA = ";"
// @from(Start 6372426, End 6372429)
v$B
// @from(Start 6372431, End 6372434)
gV6
// @from(Start 6372436, End 6372439)
uV6
// @from(Start 6372441, End 6372646)
mV6 = (A, Q) => {
    if (typeof A !== "number") throw TypeError("The `x` argument is required");
    if (typeof Q !== "number") return P7 + (A + 1) + "G";
    return P7 + (Q + 1) + eUA + (A + 1) + "H"
  }
// @from(Start 6372650, End 6372928)
dV6 = (A, Q) => {
    if (typeof A !== "number") throw TypeError("The `x` argument is required");
    let B = "";
    if (A < 0) B += P7 + -A + "D";
    else if (A > 0) B += P7 + A + "C";
    if (Q < 0) B += P7 + -Q + "A";
    else if (Q > 0) B += P7 + Q + "B";
    return B
  }
// @from(Start 6372932, End 6372961)
b$B = (A = 1) => P7 + A + "A"
// @from(Start 6372965, End 6372994)
cV6 = (A = 1) => P7 + A + "B"
// @from(Start 6372998, End 6373027)
pV6 = (A = 1) => P7 + A + "C"
// @from(Start 6373031, End 6373060)
lV6 = (A = 1) => P7 + A + "D"
// @from(Start 6373064, End 6373067)
f$B
// @from(Start 6373069, End 6373072)
iV6
// @from(Start 6373074, End 6373077)
nV6
// @from(Start 6373079, End 6373082)
aV6
// @from(Start 6373084, End 6373087)
sV6
// @from(Start 6373089, End 6373092)
rV6
// @from(Start 6373094, End 6373097)
oV6
// @from(Start 6373099, End 6373102)
Iu1
// @from(Start 6373104, End 6373241)
tV6 = (A) => {
    let Q = "";
    for (let B = 0; B < A; B++) Q += h$B + (B < A - 1 ? b$B() : "");
    if (A) Q += f$B;
    return Q
  }
// @from(Start 6373245, End 6373248)
eV6
// @from(Start 6373250, End 6373253)
AF6
// @from(Start 6373255, End 6373258)
h$B
// @from(Start 6373260, End 6373263)
QF6
// @from(Start 6373265, End 6373268)
BF6
// @from(Start 6373270, End 6373273)
Gu1
// @from(Start 6373275, End 6373278)
GF6
// @from(Start 6373280, End 6373283)
ZF6
// @from(Start 6373285, End 6373298)
IF6 = "\x1Bc"
// @from(Start 6373302, End 6373305)
YF6
// @from(Start 6373307, End 6373310)
JF6
// @from(Start 6373312, End 6373315)
WF6
// @from(Start 6373317, End 6373320)
XF6
// @from(Start 6373322, End 6373403)
VF6 = (A, Q) => [A$A, "8", eUA, eUA, Q, _7A, A, A$A, "8", eUA, eUA, _7A].join("")
// @from(Start 6373407, End 6373692)
FF6 = (A, Q = {}) => {
    let B = `${A$A}1337;File=inline=1`;
    if (Q.width) B += `;width=${Q.width}`;
    if (Q.height) B += `;height=${Q.height}`;
    if (Q.preserveAspectRatio === !1) B += ";preserveAspectRatio=0";
    return B + ":" + Buffer.from(A).toString("base64") + _7A
  }
// @from(Start 6373696, End 6373699)
KF6
// @from(Start 6373705, End 6374889)
Yu1 = L(() => {
  x$B();
  v$B = !taA && Zu1.env.TERM_PROGRAM === "Apple_Terminal", gV6 = !taA && Zu1.platform === "win32", uV6 = taA ? () => {
    throw Error("`process.cwd()` only works in Node.js, not the browser.")
  } : Zu1.cwd, f$B = P7 + "G", iV6 = v$B ? "\x1B7" : P7 + "s", nV6 = v$B ? "\x1B8" : P7 + "u", aV6 = P7 + "6n", sV6 = P7 + "E", rV6 = P7 + "F", oV6 = P7 + "?25l", Iu1 = P7 + "?25h", eV6 = P7 + "K", AF6 = P7 + "1K", h$B = P7 + "2K", QF6 = P7 + "J", BF6 = P7 + "1J", Gu1 = P7 + "2J", GF6 = P7 + "S", ZF6 = P7 + "T", YF6 = gV6 ? `${Gu1}${P7}0f` : `${Gu1}${P7}3J${P7}H`, JF6 = P7 + "?1049h", WF6 = P7 + "?1049l", XF6 = _7A, KF6 = {
    setCwd: (A = uV6()) => `${A$A}50;CurrentDir=${A}${_7A}`,
    annotation(A, Q = {}) {
      let B = `${A$A}1337;`,
        G = Q.x !== void 0,
        Z = Q.y !== void 0;
      if ((G || Z) && !(G && Z && Q.length !== void 0)) throw Error("`x`, `y` and `length` must be defined when `x` or `y` is defined");
      if (A = A.replaceAll("|", ""), B += Q.isHidden ? "AddHiddenAnnotation=" : "AddAnnotation=", Q.length > 0) B += (G ? [A, Q.length, Q.x, Q.y] : [Q.length, A]).join("|");
      else B += A;
      return B + _7A
    }
  }
})
// @from(Start 6374895, End 6374930)
eaA = L(() => {
  Yu1();
  Yu1()
})
// @from(Start 6374933, End 6375801)
function DF6(A) {
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
  if (A.name && y$B.includes(A.name)) B = "";
  if (B.startsWith("\x1B")) B = B.slice(1);
  if (B.length === 1 && typeof B[0] === "string" && B[0].toUpperCase() === B[0]) Q.shift = !0;
  return [Q, B]
}
// @from(Start 6375806, End 6375809)
AsA
// @from(Start 6375815, End 6376035)
Ju1 = L(() => {
  Bu1();
  AsA = class AsA extends S7A {
    keypress;
    key;
    input;
    constructor(A) {
      super();
      let [Q, B] = DF6(A);
      this.keypress = A, this.key = Q, this.input = B
    }
  }
})
// @from(Start 6376041, End 6376044)
g$B
// @from(Start 6376046, End 6376048)
k_
// @from(Start 6376054, End 6376120)
k7A = L(() => {
  g$B = BA(VA(), 1), k_ = g$B.createContext(!1)
})
// @from(Start 6376126, End 6376129)
u$B
// @from(Start 6376131, End 6376134)
Q$A
// @from(Start 6376140, End 6376209)
QsA = L(() => {
  u$B = BA(VA(), 1), Q$A = u$B.createContext(null)
})
// @from(Start 6376215, End 6376217)
y_
// @from(Start 6376219, End 6376229)
HF6 = "\t"
// @from(Start 6376233, End 6376247)
CF6 = "\x1B[Z"
// @from(Start 6376251, End 6376263)
EF6 = "\x1B"
// @from(Start 6376267, End 6376270)
zF6
// @from(Start 6376272, End 6376275)
BsA