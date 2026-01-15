
// @from(Ln 189842, Col 4)
ZMB = U((IkG, GMB) => {
  var uH8 = QMB(),
    IDA = QUA();

  function BMB(A) {
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

  function $B0(A) {
    let {
      env: Q
    } = process;
    if ("FORCE_HYPERLINK" in Q) return !(Q.FORCE_HYPERLINK.length > 0 && parseInt(Q.FORCE_HYPERLINK, 10) === 0);
    if (IDA("no-hyperlink") || IDA("no-hyperlinks") || IDA("hyperlink=false") || IDA("hyperlink=never")) return !1;
    if (IDA("hyperlink=true") || IDA("hyperlink=always")) return !0;
    if ("NETLIFY" in Q) return !0;
    if (!uH8.supportsColor(A)) return !1;
    if (A && !A.isTTY) return !1;
    if (process.platform === "win32") return !1;
    if ("CI" in Q) return !1;
    if ("TEAMCITY_VERSION" in Q) return !1;
    if ("TERM_PROGRAM" in Q) {
      let B = BMB(Q.TERM_PROGRAM_VERSION);
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
      let B = BMB(Q.VTE_VERSION);
      return B.major > 0 || B.minor >= 50
    }
    return !1
  }
  GMB.exports = {
    supportsHyperlink: $B0,
    stdout: $B0(process.stdout),
    stderr: $B0(process.stderr)
  }
})
// @from(Ln 189902, Col 0)
function Sk() {
  if (YMB.default.stdout) return !0;
  let A = process.env.TERM_PROGRAM;
  if (A && mH8.includes(A)) return !0;
  if (process.env.TERM?.includes("kitty")) return !0;
  return !1
}
// @from(Ln 189909, Col 4)
YMB
// @from(Ln 189909, Col 9)
mH8
// @from(Ln 189910, Col 4)
DDA = w(() => {
  YMB = c(ZMB(), 1), mH8 = ["ghostty", "Hyper", "kitty", "alacritty"]
})
// @from(Ln 189914, Col 0)
function i2({
  children: A,
  url: Q,
  fallback: B
}) {
  let G = A ?? Q;
  if (Sk()) return s21.default.createElement(DF, null, s21.default.createElement("ink-link", {
    href: Q
  }, G));
  return s21.default.createElement(DF, null, B ?? G)
}
// @from(Ln 189925, Col 4)
s21
// @from(Ln 189926, Col 4)
WDA = w(() => {
  DDA();
  ADA();
  s21 = c(QA(), 1)
})
// @from(Ln 189932, Col 0)
function KDA() {
  return {
    bold: !1,
    dim: !1,
    italic: !1,
    underline: "none",
    blink: !1,
    inverse: !1,
    hidden: !1,
    strikethrough: !1,
    overline: !1,
    fg: {
      type: "default"
    },
    bg: {
      type: "default"
    },
    underlineColor: {
      type: "default"
    }
  }
}
// @from(Ln 189955, Col 0)
function JMB(A) {
  if (A.length === 0) return null;
  let Q = A[0];
  if (Q === "c") return {
    type: "reset"
  };
  if (Q === "7") return {
    type: "cursor",
    action: {
      type: "save"
    }
  };
  if (Q === "8") return {
    type: "cursor",
    action: {
      type: "restore"
    }
  };
  if (Q === "D") return {
    type: "cursor",
    action: {
      type: "move",
      direction: "down",
      count: 1
    }
  };
  if (Q === "M") return {
    type: "cursor",
    action: {
      type: "move",
      direction: "up",
      count: 1
    }
  };
  if (Q === "E") return {
    type: "cursor",
    action: {
      type: "nextLine",
      count: 1
    }
  };
  if (Q === "H") return null;
  if ("()".includes(Q) && A.length >= 2) return null;
  return {
    type: "unknown",
    sequence: `\x1B${A}`
  }
}
// @from(Ln 190004, Col 0)
function cH8(A) {
  if (A === "") return [{
    value: 0,
    subparams: [],
    colon: !1
  }];
  let Q = [],
    B = {
      value: null,
      subparams: [],
      colon: !1
    },
    G = "",
    Z = !1;
  for (let Y = 0; Y <= A.length; Y++) {
    let J = A[Y];
    if (J === ";" || J === void 0) {
      let X = G === "" ? null : parseInt(G, 10);
      if (Z) {
        if (X !== null) B.subparams.push(X)
      } else B.value = X;
      Q.push(B), B = {
        value: null,
        subparams: [],
        colon: !1
      }, G = "", Z = !1
    } else if (J === ":") {
      let X = G === "" ? null : parseInt(G, 10);
      if (!Z) B.value = X, B.colon = !0, Z = !0;
      else if (X !== null) B.subparams.push(X);
      G = ""
    } else if (J >= "0" && J <= "9") G += J
  }
  return Q
}
// @from(Ln 190040, Col 0)
function CB0(A, Q) {
  let B = A[Q];
  if (!B) return null;
  if (B.colon && B.subparams.length >= 1) {
    if (B.subparams[0] === 5 && B.subparams.length >= 2) return {
      index: B.subparams[1]
    };
    if (B.subparams[0] === 2 && B.subparams.length >= 4) {
      let Z = B.subparams.length >= 5 ? 1 : 0;
      return {
        r: B.subparams[1 + Z],
        g: B.subparams[2 + Z],
        b: B.subparams[3 + Z]
      }
    }
  }
  let G = A[Q + 1];
  if (!G) return null;
  if (G.value === 5 && A[Q + 2]?.value !== null && A[Q + 2]?.value !== void 0) return {
    index: A[Q + 2].value
  };
  if (G.value === 2) {
    let Z = A[Q + 2]?.value,
      Y = A[Q + 3]?.value,
      J = A[Q + 4]?.value;
    if (Z !== null && Z !== void 0 && Y !== null && Y !== void 0 && J !== null && J !== void 0) return {
      r: Z,
      g: Y,
      b: J
    }
  }
  return null
}
// @from(Ln 190074, Col 0)
function XMB(A, Q) {
  let B = cH8(A),
    G = {
      ...Q
    },
    Z = 0;
  while (Z < B.length) {
    let Y = B[Z],
      J = Y.value ?? 0;
    if (J === 0) {
      G = KDA(), Z++;
      continue
    }
    if (J === 1) {
      G.bold = !0, Z++;
      continue
    }
    if (J === 2) {
      G.dim = !0, Z++;
      continue
    }
    if (J === 3) {
      G.italic = !0, Z++;
      continue
    }
    if (J === 4) {
      G.underline = Y.colon ? dH8[Y.subparams[0]] ?? "single" : "single", Z++;
      continue
    }
    if (J === 5 || J === 6) {
      G.blink = !0, Z++;
      continue
    }
    if (J === 7) {
      G.inverse = !0, Z++;
      continue
    }
    if (J === 8) {
      G.hidden = !0, Z++;
      continue
    }
    if (J === 9) {
      G.strikethrough = !0, Z++;
      continue
    }
    if (J === 21) {
      G.underline = "double", Z++;
      continue
    }
    if (J === 22) {
      G.bold = !1, G.dim = !1, Z++;
      continue
    }
    if (J === 23) {
      G.italic = !1, Z++;
      continue
    }
    if (J === 24) {
      G.underline = "none", Z++;
      continue
    }
    if (J === 25) {
      G.blink = !1, Z++;
      continue
    }
    if (J === 27) {
      G.inverse = !1, Z++;
      continue
    }
    if (J === 28) {
      G.hidden = !1, Z++;
      continue
    }
    if (J === 29) {
      G.strikethrough = !1, Z++;
      continue
    }
    if (J === 53) {
      G.overline = !0, Z++;
      continue
    }
    if (J === 55) {
      G.overline = !1, Z++;
      continue
    }
    if (J >= 30 && J <= 37) {
      G.fg = {
        type: "named",
        name: t21[J - 30]
      }, Z++;
      continue
    }
    if (J === 39) {
      G.fg = {
        type: "default"
      }, Z++;
      continue
    }
    if (J >= 40 && J <= 47) {
      G.bg = {
        type: "named",
        name: t21[J - 40]
      }, Z++;
      continue
    }
    if (J === 49) {
      G.bg = {
        type: "default"
      }, Z++;
      continue
    }
    if (J >= 90 && J <= 97) {
      G.fg = {
        type: "named",
        name: t21[J - 90 + 8]
      }, Z++;
      continue
    }
    if (J >= 100 && J <= 107) {
      G.bg = {
        type: "named",
        name: t21[J - 100 + 8]
      }, Z++;
      continue
    }
    if (J === 38) {
      let X = CB0(B, Z);
      if (X) {
        G.fg = "index" in X ? {
          type: "indexed",
          index: X.index
        } : {
          type: "rgb",
          ...X
        }, Z += Y.colon ? 1 : ("index" in X) ? 3 : 5;
        continue
      }
    }
    if (J === 48) {
      let X = CB0(B, Z);
      if (X) {
        G.bg = "index" in X ? {
          type: "indexed",
          index: X.index
        } : {
          type: "rgb",
          ...X
        }, Z += Y.colon ? 1 : ("index" in X) ? 3 : 5;
        continue
      }
    }
    if (J === 58) {
      let X = CB0(B, Z);
      if (X) {
        G.underlineColor = "index" in X ? {
          type: "indexed",
          index: X.index
        } : {
          type: "rgb",
          ...X
        }, Z += Y.colon ? 1 : ("index" in X) ? 3 : 5;
        continue
      }
    }
    if (J === 59) {
      G.underlineColor = {
        type: "default"
      }, Z++;
      continue
    }
    Z++
  }
  return G
}
// @from(Ln 190248, Col 4)
t21
// @from(Ln 190248, Col 9)
dH8
// @from(Ln 190249, Col 4)
IMB = w(() => {
  t21 = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white", "brightBlack", "brightRed", "brightGreen", "brightYellow", "brightBlue", "brightMagenta", "brightCyan", "brightWhite"], dH8 = ["none", "single", "double", "curly", "dotted", "dashed"]
})
// @from(Ln 190253, Col 0)
function pH8(A) {
  return A >= 9728 && A <= 9983 || A >= 9984 && A <= 10175 || A >= 127744 && A <= 129535 || A >= 129536 && A <= 129791 || A >= 127456 && A <= 127487
}
// @from(Ln 190257, Col 0)
function lH8(A) {
  return A >= 4352 && A <= 4447 || A >= 11904 && A <= 40959 || A >= 44032 && A <= 55203 || A >= 63744 && A <= 64255 || A >= 65040 && A <= 65055 || A >= 65072 && A <= 65135 || A >= 65280 && A <= 65376 || A >= 65504 && A <= 65510 || A >= 131072 && A <= 196605 || A >= 196608 && A <= 262141
}
// @from(Ln 190261, Col 0)
function WMB(A) {
  if ([...A].length > 1) return 2;
  let Q = A.codePointAt(0);
  if (Q === void 0) return 1;
  if (pH8(Q) || lH8(Q)) return 2;
  return 1
}
// @from(Ln 190269, Col 0)
function* KMB(A) {
  if (DMB)
    for (let {
        segment: Q
      }
      of DMB.segment(A)) yield {
      value: Q,
      width: WMB(Q)
    };
  else
    for (let Q of A) yield {
      value: Q,
      width: WMB(Q)
    }
}
// @from(Ln 190285, Col 0)
function iH8(A) {
  if (A === "") return [];
  return A.split(/[;:]/).map((Q) => Q === "" ? 0 : parseInt(Q, 10))
}
// @from(Ln 190290, Col 0)
function nH8(A) {
  let Q = A.slice(2);
  if (Q.length === 0) return null;
  let B = Q.charCodeAt(Q.length - 1),
    G = Q.slice(0, -1),
    Z = "",
    Y = G,
    J = "";
  if (G.length > 0 && "?>=".includes(G[0])) Z = G[0], Y = G.slice(1);
  let X = Y.match(/([^0-9;:]+)$/);
  if (X) J = X[1], Y = Y.slice(0, -J.length);
  let I = iH8(Y),
    D = I[0] ?? 1,
    W = I[1] ?? 1;
  if (B === qX.SGR && Z === "") return {
    type: "sgr",
    params: Y
  };
  if (B === qX.CUU) return {
    type: "cursor",
    action: {
      type: "move",
      direction: "up",
      count: D
    }
  };
  if (B === qX.CUD) return {
    type: "cursor",
    action: {
      type: "move",
      direction: "down",
      count: D
    }
  };
  if (B === qX.CUF) return {
    type: "cursor",
    action: {
      type: "move",
      direction: "forward",
      count: D
    }
  };
  if (B === qX.CUB) return {
    type: "cursor",
    action: {
      type: "move",
      direction: "back",
      count: D
    }
  };
  if (B === qX.CNL) return {
    type: "cursor",
    action: {
      type: "nextLine",
      count: D
    }
  };
  if (B === qX.CPL) return {
    type: "cursor",
    action: {
      type: "prevLine",
      count: D
    }
  };
  if (B === qX.CHA) return {
    type: "cursor",
    action: {
      type: "column",
      col: D
    }
  };
  if (B === qX.CUP || B === qX.HVP) return {
    type: "cursor",
    action: {
      type: "position",
      row: D,
      col: W
    }
  };
  if (B === qX.VPA) return {
    type: "cursor",
    action: {
      type: "row",
      row: D
    }
  };
  if (B === qX.ED) return {
    type: "erase",
    action: {
      type: "display",
      region: xUB[I[0] ?? 0] ?? "toEnd"
    }
  };
  if (B === qX.EL) return {
    type: "erase",
    action: {
      type: "line",
      region: yUB[I[0] ?? 0] ?? "toEnd"
    }
  };
  if (B === qX.ECH) return {
    type: "erase",
    action: {
      type: "chars",
      count: D
    }
  };
  if (B === qX.SU) return {
    type: "scroll",
    action: {
      type: "up",
      count: D
    }
  };
  if (B === qX.SD) return {
    type: "scroll",
    action: {
      type: "down",
      count: D
    }
  };
  if (B === qX.DECSTBM) return {
    type: "scroll",
    action: {
      type: "setRegion",
      top: D,
      bottom: W
    }
  };
  if (B === qX.SCOSC) return {
    type: "cursor",
    action: {
      type: "save"
    }
  };
  if (B === qX.SCORC) return {
    type: "cursor",
    action: {
      type: "restore"
    }
  };
  if (B === qX.DECSCUSR && J === " ") return {
    type: "cursor",
    action: {
      type: "style",
      ...v00[D] ?? v00[0]
    }
  };
  if (Z === "?" && (B === qX.SM || B === qX.RM)) {
    let K = B === qX.SM;
    if (D === gH.CURSOR_VISIBLE) return {
      type: "cursor",
      action: K ? {
        type: "show"
      } : {
        type: "hide"
      }
    };
    if (D === gH.ALT_SCREEN_CLEAR || D === gH.ALT_SCREEN) return {
      type: "mode",
      action: {
        type: "alternateScreen",
        enabled: K
      }
    };
    if (D === gH.BRACKETED_PASTE) return {
      type: "mode",
      action: {
        type: "bracketedPaste",
        enabled: K
      }
    };
    if (D === gH.MOUSE_NORMAL) return {
      type: "mode",
      action: {
        type: "mouseTracking",
        mode: K ? "normal" : "off"
      }
    };
    if (D === gH.MOUSE_BUTTON) return {
      type: "mode",
      action: {
        type: "mouseTracking",
        mode: K ? "button" : "off"
      }
    };
    if (D === gH.MOUSE_ANY) return {
      type: "mode",
      action: {
        type: "mouseTracking",
        mode: K ? "any" : "off"
      }
    };
    if (D === gH.FOCUS_EVENTS) return {
      type: "mode",
      action: {
        type: "focusEvents",
        enabled: K
      }
    }
  }
  return {
    type: "unknown",
    sequence: A
  }
}
// @from(Ln 190497, Col 0)
function aH8(A) {
  if (A.length < 2) return "unknown";
  if (A.charCodeAt(0) !== Nk.ESC) return "unknown";
  let Q = A.charCodeAt(1);
  if (Q === 91) return "csi";
  if (Q === 93) return "osc";
  if (Q === 79) return "ss3";
  return "esc"
}
// @from(Ln 190506, Col 0)
class e21 {
  tokenizer = mIA();
  style = KDA();
  inLink = !1;
  linkUrl;
  reset() {
    this.tokenizer.reset(), this.style = KDA(), this.inLink = !1, this.linkUrl = void 0
  }
  feed(A) {
    let Q = this.tokenizer.feed(A),
      B = [];
    for (let G of Q) {
      let Z = this.processToken(G);
      B.push(...Z)
    }
    return B
  }
  processToken(A) {
    switch (A.type) {
      case "text":
        return this.processText(A.value);
      case "sequence":
        return this.processSequence(A.value)
    }
  }
  processText(A) {
    let Q = [],
      B = "";
    for (let G of A)
      if (G.charCodeAt(0) === Nk.BEL) {
        if (B) {
          let Z = [...KMB(B)];
          if (Z.length > 0) Q.push({
            type: "text",
            graphemes: Z,
            style: {
              ...this.style
            }
          });
          B = ""
        }
        Q.push({
          type: "bell"
        })
      } else B += G;
    if (B) {
      let G = [...KMB(B)];
      if (G.length > 0) Q.push({
        type: "text",
        graphemes: G,
        style: {
          ...this.style
        }
      })
    }
    return Q
  }
  processSequence(A) {
    switch (aH8(A)) {
      case "csi": {
        let B = nH8(A);
        if (!B) return [];
        if (B.type === "sgr") return this.style = XMB(B.params, this.style), [];
        return [B]
      }
      case "osc": {
        let B = A.slice(2);
        if (B.endsWith("\x07")) B = B.slice(0, -1);
        else if (B.endsWith("\x1B\\")) B = B.slice(0, -2);
        let G = vwB(B);
        if (G) {
          if (G.type === "link")
            if (G.action.type === "start") this.inLink = !0, this.linkUrl = G.action.url;
            else this.inLink = !1, this.linkUrl = void 0;
          return [G]
        }
        return []
      }
      case "esc": {
        let B = A.slice(1),
          G = JMB(B);
        return G ? [G] : []
      }
      case "ss3":
        return [{
          type: "unknown",
          sequence: A
        }];
      default:
        return [{
          type: "unknown",
          sequence: A
        }]
    }
  }
}
// @from(Ln 190602, Col 4)
DMB
// @from(Ln 190603, Col 4)
VMB = w(() => {
  bBA();
  wk();
  lBA();
  L21();
  IMB();
  hB1();
  DMB = typeof Intl < "u" && "Segmenter" in Intl ? new Intl.Segmenter(void 0, {
    granularity: "grapheme"
  }) : null
})
// @from(Ln 190614, Col 4)
FMB = w(() => {
  VMB()
})
// @from(Ln 190618, Col 0)
function oH8(A) {
  let B = new e21().feed(A),
    G = [],
    Z;
  for (let Y of B) {
    if (Y.type === "link") {
      if (Y.action.type === "start") Z = Y.action.url;
      else Z = void 0;
      continue
    }
    if (Y.type === "text") {
      let J = Y.graphemes.map((D) => D.value).join("");
      if (!J) continue;
      let X = rH8(Y.style);
      if (Z) X.hyperlink = Z;
      let I = G[G.length - 1];
      if (I && tH8(I.props, X)) I.text += J;
      else G.push({
        text: J,
        props: X
      })
    }
  }
  return G
}
// @from(Ln 190644, Col 0)
function rH8(A) {
  let Q = {};
  if (A.bold) Q.bold = !0;
  if (A.dim) Q.dim = !0;
  if (A.italic) Q.italic = !0;
  if (A.underline !== "none") Q.underline = !0;
  if (A.strikethrough) Q.strikethrough = !0;
  if (A.inverse) Q.inverse = !0;
  let B = HMB(A.fg);
  if (B) Q.color = B;
  let G = HMB(A.bg);
  if (G) Q.backgroundColor = G;
  return Q
}
// @from(Ln 190659, Col 0)
function HMB(A) {
  switch (A.type) {
    case "named":
      return sH8[A.name];
    case "indexed":
      return `ansi256(${A.index})`;
    case "rgb":
      return `rgb(${A.r},${A.g},${A.b})`;
    case "default":
      return
  }
}
// @from(Ln 190672, Col 0)
function tH8(A, Q) {
  return A.color === Q.color && A.backgroundColor === Q.backgroundColor && A.bold === Q.bold && A.dim === Q.dim && A.italic === Q.italic && A.underline === Q.underline && A.strikethrough === Q.strikethrough && A.inverse === Q.inverse && A.hyperlink === Q.hyperlink
}
// @from(Ln 190676, Col 0)
function EMB({
  bold: A,
  dim: Q,
  children: B,
  ...G
}) {
  if (Q) return B_.default.createElement(DF, {
    ...G,
    dim: !0
  }, B);
  if (A) return B_.default.createElement(DF, {
    ...G,
    bold: !0
  }, B);
  return B_.default.createElement(DF, {
    ...G
  }, B)
}
// @from(Ln 190694, Col 4)
B_
// @from(Ln 190694, Col 8)
M8
// @from(Ln 190694, Col 12)
sH8
// @from(Ln 190695, Col 4)
zMB = w(() => {
  ADA();
  WDA();
  FMB();
  B_ = c(QA(), 1), M8 = B_.default.memo(function ({
    children: Q
  }) {
    if (typeof Q !== "string") return B_.default.createElement(DF, null, String(Q));
    if (Q === "") return null;
    let B = oH8(Q);
    if (B.length === 0) return null;
    if (B.length === 1 && Object.keys(B[0].props).length === 0) return B_.default.createElement(DF, null, B[0].text);
    return B_.default.createElement(DF, null, B.map((G, Z) => {
      let {
        hyperlink: Y,
        ...J
      } = G.props, X = Object.keys(J).length > 0;
      if (Y) return X ? B_.default.createElement(i2, {
        key: Z,
        url: Y
      }, B_.default.createElement(EMB, {
        ...J
      }, G.text)) : B_.default.createElement(i2, {
        key: Z,
        url: Y
      }, G.text);
      return X ? B_.default.createElement(EMB, {
        key: Z,
        ...J
      }, G.text) : G.text
    }))
  });
  sH8 = {
    black: "ansi:black",
    red: "ansi:red",
    green: "ansi:green",
    yellow: "ansi:yellow",
    blue: "ansi:blue",
    magenta: "ansi:magenta",
    cyan: "ansi:cyan",
    white: "ansi:white",
    brightBlack: "ansi:blackBright",
    brightRed: "ansi:redBright",
    brightGreen: "ansi:greenBright",
    brightYellow: "ansi:yellowBright",
    brightBlue: "ansi:blueBright",
    brightMagenta: "ansi:magentaBright",
    brightCyan: "ansi:cyanBright",
    brightWhite: "ansi:whiteBright"
  }
})
// @from(Ln 190747, Col 0)
function $MB({
  children: A
}) {
  return UB0.default.createElement(AE8.Provider, {
    value: !0
  }, A)
}
// @from(Ln 190754, Col 4)
UB0
// @from(Ln 190754, Col 9)
eH8
// @from(Ln 190754, Col 14)
AE8
// @from(Ln 190755, Col 4)
qB0 = w(() => {
  UB0 = c(QA(), 1), eH8 = c(QA(), 1), AE8 = UB0.default.createContext(!1)
})
// @from(Ln 190759, Col 0)
function ha(A) {
  let {
    items: Q,
    children: B
  } = A, G = G_.useContext(AN), [Z, Y] = G_.useState(0), J = G_.useMemo(() => {
    return Q.slice(Z)
  }, [Q, Z]);
  if (G_.useLayoutEffect(() => {
      Y(Q.length)
    }, [Q.length]), G) {
    let I = Q.map((D, W) => B(D, W));
    return G_.default.createElement("ink-box", {
      style: {
        flexDirection: "column"
      }
    }, I)
  }
  let X = J.map((I, D) => {
    return B(I, Z + D)
  });
  return G_.default.createElement($MB, null, G_.default.createElement("ink-box", {
    internal_static: !0,
    style: {
      position: "absolute",
      flexDirection: "column"
    }
  }, X))
}
// @from(Ln 190787, Col 4)
G_
// @from(Ln 190788, Col 4)
CMB = w(() => {
  qB0();
  ba();
  G_ = c(QA(), 1)
})
// @from(Ln 190794, Col 0)
function fD({
  count: A = 1
}) {
  return UMB.default.createElement("ink-text", null, `
`.repeat(A))
}
// @from(Ln 190800, Col 4)
UMB
// @from(Ln 190801, Col 4)
qMB = w(() => {
  UMB = c(QA(), 1)
})
// @from(Ln 190804, Col 4)
QE8
// @from(Ln 190805, Col 4)
NMB = w(() => {
  d_A();
  QE8 = c(QA(), 1)
})
// @from(Ln 190809, Col 4)
wMB
// @from(Ln 190809, Col 9)
BE8 = () => wMB.useContext(V21)
// @from(Ln 190810, Col 2)
ga
// @from(Ln 190811, Col 4)
A91 = w(() => {
  jQ0();
  wMB = c(QA(), 1), ga = BE8
})
// @from(Ln 190815, Col 4)
RMB = U((pkG, MMB) => {
  var GE8 = "Expected a function",
    LMB = NaN,
    ZE8 = "[object Symbol]",
    YE8 = /^\s+|\s+$/g,
    JE8 = /^[-+]0x[0-9a-f]+$/i,
    XE8 = /^0b[01]+$/i,
    IE8 = /^0o[0-7]+$/i,
    DE8 = parseInt,
    WE8 = typeof global == "object" && global && global.Object === Object && global,
    KE8 = typeof self == "object" && self && self.Object === Object && self,
    VE8 = WE8 || KE8 || Function("return this")(),
    FE8 = Object.prototype,
    HE8 = FE8.toString,
    EE8 = Math.max,
    zE8 = Math.min,
    NB0 = function () {
      return VE8.Date.now()
    };

  function $E8(A, Q, B) {
    var G, Z, Y, J, X, I, D = 0,
      W = !1,
      K = !1,
      V = !0;
    if (typeof A != "function") throw TypeError(GE8);
    if (Q = OMB(Q) || 0, wB0(B)) W = !!B.leading, K = "maxWait" in B, Y = K ? EE8(OMB(B.maxWait) || 0, Q) : Y, V = "trailing" in B ? !!B.trailing : V;

    function F(j) {
      var x = G,
        b = Z;
      return G = Z = void 0, D = j, J = A.apply(b, x), J
    }

    function H(j) {
      return D = j, X = setTimeout($, Q), W ? F(j) : J
    }

    function E(j) {
      var x = j - I,
        b = j - D,
        S = Q - x;
      return K ? zE8(S, Y - b) : S
    }

    function z(j) {
      var x = j - I,
        b = j - D;
      return I === void 0 || x >= Q || x < 0 || K && b >= Y
    }

    function $() {
      var j = NB0();
      if (z(j)) return O(j);
      X = setTimeout($, E(j))
    }

    function O(j) {
      if (X = void 0, V && G) return F(j);
      return G = Z = void 0, J
    }

    function L() {
      if (X !== void 0) clearTimeout(X);
      D = 0, G = I = Z = X = void 0
    }

    function M() {
      return X === void 0 ? J : O(NB0())
    }

    function _() {
      var j = NB0(),
        x = z(j);
      if (G = arguments, Z = this, I = j, x) {
        if (X === void 0) return H(I);
        if (K) return X = setTimeout($, Q), F(I)
      }
      if (X === void 0) X = setTimeout($, Q);
      return J
    }
    return _.cancel = L, _.flush = M, _
  }

  function wB0(A) {
    var Q = typeof A;
    return !!A && (Q == "object" || Q == "function")
  }

  function CE8(A) {
    return !!A && typeof A == "object"
  }

  function UE8(A) {
    return typeof A == "symbol" || CE8(A) && HE8.call(A) == ZE8
  }

  function OMB(A) {
    if (typeof A == "number") return A;
    if (UE8(A)) return LMB;
    if (wB0(A)) {
      var Q = typeof A.valueOf == "function" ? A.valueOf() : A;
      A = wB0(Q) ? Q + "" : Q
    }
    if (typeof A != "string") return A === 0 ? A : +A;
    A = A.replace(YE8, "");
    var B = XE8.test(A);
    return B || IE8.test(A) ? DE8(A.slice(2), B ? 2 : 8) : JE8.test(A) ? LMB : +A
  }
  MMB.exports = $E8
})
// @from(Ln 190927, Col 0)
function XZ(A, Q) {
  let B = dH.useRef(A);
  _MB(() => {
    B.current = A
  }, [A]), dH.useEffect(() => {
    if (Q === null) return;
    let G = setInterval(() => {
      B.current()
    }, Q);
    return () => {
      clearInterval(G)
    }
  }, [Q])
}
// @from(Ln 190942, Col 0)
function jMB(A) {
  let Q = dH.useRef(() => {
    throw Error("Cannot call an event handler while rendering.")
  });
  return _MB(() => {
    Q.current = A
  }, [A]), dH.useCallback((...B) => {
    var G;
    return (G = Q.current) == null ? void 0 : G.call(Q, ...B)
  }, [Q])
}
// @from(Ln 190954, Col 0)
function qE8(A) {
  let Q = dH.useRef(A);
  Q.current = A, dH.useEffect(() => () => {
    Q.current()
  }, [])
}
// @from(Ln 190961, Col 0)
function ua(A, Q = 500, B) {
  let G = dH.useRef();
  qE8(() => {
    if (G.current) G.current.cancel()
  });
  let Z = dH.useMemo(() => {
    let Y = LB0.default(A, Q, B),
      J = (...X) => {
        return Y(...X)
      };
    return J.cancel = () => {
      Y.cancel()
    }, J.isPending = () => {
      return !!G.current
    }, J.flush = () => {
      return Y.flush()
    }, J
  }, [A, Q, B]);
  return dH.useEffect(() => {
    G.current = LB0.default(A, Q, B)
  }, [A, Q, B]), Z
}
// @from(Ln 190983, Col 4)
dH
// @from(Ln 190983, Col 8)
LB0
// @from(Ln 190983, Col 13)
_MB
// @from(Ln 190984, Col 4)
oK = w(() => {
  dH = c(QA(), 1), LB0 = c(RMB(), 1), _MB = typeof window < "u" ? dH.useLayoutEffect : dH.useEffect
})
// @from(Ln 190987, Col 4)
OB0
// @from(Ln 190987, Col 9)
NE8 = (A, Q = {}) => {
    let {
      setRawMode: B,
      internal_exitOnCtrlC: G,
      internal_eventEmitter: Z
    } = ga(), Y = jMB(A);
    OB0.useEffect(() => {
      if (Q.isActive === !1) return;
      return B(!0), () => {
        B(!1)
      }
    }, [Q.isActive, B]), OB0.useEffect(() => {
      if (Q.isActive === !1) return;
      let J = (X) => {
        let {
          input: I,
          key: D
        } = X;
        if (!(I === "c" && D.ctrl) || !G) Y(I, D, X)
      };
      return Z?.on("input", J), () => {
        Z?.removeListener("input", J)
      }
    }, [Q.isActive, G, Z, Y])
  }
// @from(Ln 191012, Col 2)
J0
// @from(Ln 191013, Col 4)
TMB = w(() => {
  A91();
  oK();
  OB0 = c(QA(), 1), J0 = NE8
})
// @from(Ln 191018, Col 4)
PMB
// @from(Ln 191018, Col 9)
wE8 = () => PMB.useContext(K21)
// @from(Ln 191019, Col 2)
JjA
// @from(Ln 191020, Col 4)
MB0 = w(() => {
  _Q0();
  PMB = c(QA(), 1), JjA = wE8
})
// @from(Ln 191024, Col 4)
RB0
// @from(Ln 191025, Col 4)
SMB = w(() => {
  H21();
  A91();
  RB0 = c(QA(), 1)
})
// @from(Ln 191030, Col 4)
LE8
// @from(Ln 191031, Col 4)
xMB = w(() => {
  H21();
  LE8 = c(QA(), 1)
})
// @from(Ln 191035, Col 4)
OE8 = (A) => ({
    width: A.yogaNode?.getComputedWidth() ?? 0,
    height: A.yogaNode?.getComputedHeight() ?? 0
  })
// @from(Ln 191039, Col 2)
_B0
// @from(Ln 191040, Col 4)
yMB = w(() => {
  _B0 = OE8
})
// @from(Ln 191043, Col 4)
VDA
// @from(Ln 191044, Col 4)
vMB = w(() => {
  U21();
  VDA = c(QA(), 1)
})
// @from(Ln 191049, Col 0)
function GN() {
  let {
    isTerminalFocused: A
  } = kMB.useContext(E21);
  return A
}
// @from(Ln 191055, Col 4)
kMB
// @from(Ln 191056, Col 4)
bMB = w(() => {
  TQ0();
  kMB = c(QA(), 1)
})
// @from(Ln 191060, Col 4)
fA = w(() => {
  rOB();
  d_A();
  tOB();
  ADA();
  z21();
  zMB();
  CMB();
  WDA();
  qMB();
  NMB();
  TMB();
  MB0();
  A91();
  SMB();
  xMB();
  yMB();
  qB0();
  c_A();
  dBA();
  vB1();
  fQ0();
  hQ0();
  W21();
  vMB();
  bMB()
})
// @from(Ln 191088, Col 0)
function yP(A, Q, B) {
  let G = ma.useRef(0),
    Z = ma.useRef(void 0),
    Y = ma.useCallback(() => {
      if (Z.current) clearTimeout(Z.current), Z.current = void 0
    }, []);
  return ma.useEffect(() => {
    return () => {
      Y()
    }
  }, [Y]), ma.useCallback(() => {
    let J = Date.now();
    if (J - G.current <= fMB && Z.current !== void 0) Y(), A(!1), Q();
    else B?.(), A(!0), Y(), Z.current = setTimeout(() => {
      A(!1), Z.current = void 0
    }, fMB);
    G.current = J
  }, [A, Q, B, Y])
}
// @from(Ln 191107, Col 4)
ma
// @from(Ln 191107, Col 8)
fMB = 800
// @from(Ln 191108, Col 4)
XjA = w(() => {
  ma = c(QA(), 1)
})
// @from(Ln 191112, Col 0)
function hMB(A, Q) {
  let {
    exit: B
  } = JjA(), [G, Z] = da.useState({
    pending: !1,
    keyName: null
  }), Y = da.useMemo(() => Q ?? B, [Q, B]), J = yP((K) => Z({
    pending: K,
    keyName: "Ctrl-C"
  }), Y), X = yP((K) => Z({
    pending: K,
    keyName: "Ctrl-D"
  }), Y), I = da.useCallback(() => {
    J()
  }, [J]), D = da.useCallback(() => {
    X()
  }, [X]), W = da.useMemo(() => ({
    "app:interrupt": I,
    "app:exit": D
  }), [I, D]);
  return A(W, {
    context: "Global"
  }), G
}
// @from(Ln 191136, Col 4)
da
// @from(Ln 191137, Col 4)
gMB = w(() => {
  XjA();
  MB0();
  da = c(QA(), 1)
})
// @from(Ln 191143, Col 0)
function H2(A, Q, B = {}) {
  let {
    context: G = "Global",
    isActive: Z = !0
  } = B, Y = GjA(), J = jB0.useCallback((X, I, D) => {
    if (!Y) return;
    let W = Y.resolve(X, I, [G, "Global"]);
    switch (W.type) {
      case "match":
        if (Y.setPendingChord(null), W.action === A) Q(), D.stopImmediatePropagation();
        break;
      case "chord_started":
        Y.setPendingChord(W.pending), D.stopImmediatePropagation();
        break;
      case "chord_cancelled":
        Y.setPendingChord(null);
        break;
      case "unbound":
        Y.setPendingChord(null), D.stopImmediatePropagation();
        break;
      case "none":
        break
    }
  }, [A, G, Q, Y]);
  J0(J, {
    isActive: Z
  })
}
// @from(Ln 191172, Col 0)
function iW(A, Q = {}) {
  let {
    context: B = "Global",
    isActive: G = !0
  } = Q, Z = GjA(), Y = jB0.useCallback((J, X, I) => {
    if (!Z) return;
    let D = Z.resolve(J, X, [B, "Global"]);
    switch (D.type) {
      case "match":
        if (Z.setPendingChord(null), D.action in A) {
          let W = A[D.action];
          if (W) W(), I.stopImmediatePropagation()
        }
        break;
      case "chord_started":
        Z.setPendingChord(D.pending), I.stopImmediatePropagation();
        break;
      case "chord_cancelled":
        Z.setPendingChord(null);
        break;
      case "unbound":
        Z.setPendingChord(null), I.stopImmediatePropagation();
        break;
      case "none":
        break
    }
  }, [B, A, Z]);
  J0(Y, {
    isActive: G
  })
}
// @from(Ln 191203, Col 4)
jB0
// @from(Ln 191204, Col 4)
c6 = w(() => {
  fA();
  m21();
  jB0 = c(QA(), 1)
})
// @from(Ln 191210, Col 0)
function MQ(A) {
  return hMB(iW, A)
}
// @from(Ln 191213, Col 4)
E9 = w(() => {
  gMB();
  c6()
})
// @from(Ln 191218, Col 0)
function Z91(A, Q = "append") {
  if (A.length > 0) {
    if (TB0 && Z_.length > 0)
      if (Q === "prepend") Z_[0] = A + Z_[0];
      else Z_[0] = Z_[0] + A;
    else if (Z_.unshift(A), Z_.length > ME8) Z_.pop();
    TB0 = !0, G91 = !1
  }
}
// @from(Ln 191228, Col 0)
function mMB() {
  return Z_[0] ?? ""
}
// @from(Ln 191232, Col 0)
function xB0() {
  TB0 = !1
}
// @from(Ln 191236, Col 0)
function dMB(A, Q) {
  uMB = A, SB0 = Q, G91 = !0, Q91 = 0
}
// @from(Ln 191240, Col 0)
function cMB() {
  if (!G91 || Z_.length <= 1) return null;
  return Q91 = (Q91 + 1) % Z_.length, {
    text: Z_[Q91] ?? "",
    start: uMB,
    length: SB0
  }
}
// @from(Ln 191249, Col 0)
function pMB(A) {
  SB0 = A
}
// @from(Ln 191253, Col 0)
function yB0() {
  G91 = !1
}
// @from(Ln 191256, Col 0)
class p6 {
  measuredText;
  selection;
  offset;
  constructor(A, Q = 0, B = 0) {
    this.measuredText = A;
    this.selection = B;
    this.offset = Math.max(0, Math.min(this.text.length, Q))
  }
  static fromText(A, Q, B = 0, G = 0) {
    return new p6(new lMB(A, Q - 1), B, G)
  }
  render(A, Q, B, G) {
    let {
      line: Z,
      column: Y
    } = this.getPosition();
    return this.measuredText.getWrappedText().map((J, X, I) => {
      let D = J;
      if (Q && X === I.length - 1) {
        let $ = Math.max(0, J.length - 6);
        D = Q.repeat($) + J.slice($)
      }
      if (Z !== X) return D.trimEnd();
      let W = this.measuredText.displayWidthToStringIndex(D, Y),
        K = Array.from(PB0.segment(D)).map(({
          segment: $,
          index: O
        }) => ({
          segment: $,
          index: O
        })),
        V = "",
        F = A,
        H = "";
      for (let {
          segment: $,
          index: O
        }
        of K) {
        let L = O + $.length;
        if (L <= W) V += $;
        else if (O < W && L > W) F = $;
        else if (O === W) F = $;
        else H += $
      }
      let E, z = "";
      if (G && X === I.length - 1 && this.isAtEnd() && G.text.length > 0) {
        let $ = G.text[0];
        if (E = A ? B($) : $, G.text.length > 1) z = G.dim(G.text.slice(1))
      } else E = A ? B(F) : F;
      return V + E + z + H.trimEnd()
    }).join(`
`)
  }
  left() {
    if (this.offset === 0) return this;
    let A = this.measuredText.prevOffset(this.offset);
    return new p6(this.measuredText, A)
  }
  right() {
    if (this.offset >= this.text.length) return this;
    let A = this.measuredText.nextOffset(this.offset);
    return new p6(this.measuredText, Math.min(A, this.text.length))
  }
  up() {
    let {
      line: A,
      column: Q
    } = this.getPosition();
    if (A === 0) return this;
    let B = this.measuredText.getWrappedText()[A - 1];
    if (!B) return this;
    let G = A9(B);
    if (Q > G) {
      let Y = this.getOffset({
        line: A - 1,
        column: G
      });
      return new p6(this.measuredText, Y, 0)
    }
    let Z = this.getOffset({
      line: A - 1,
      column: Q
    });
    return new p6(this.measuredText, Z, 0)
  }
  down() {
    let {
      line: A,
      column: Q
    } = this.getPosition();
    if (A >= this.measuredText.lineCount - 1) return this;
    let B = this.measuredText.getWrappedText()[A + 1];
    if (!B) return this;
    let G = A9(B);
    if (Q > G) {
      let Y = this.getOffset({
        line: A + 1,
        column: G
      });
      return new p6(this.measuredText, Y, 0)
    }
    let Z = this.getOffset({
      line: A + 1,
      column: Q
    });
    return new p6(this.measuredText, Z, 0)
  }
  startOfCurrentLine() {
    let {
      line: A
    } = this.getPosition();
    return new p6(this.measuredText, this.getOffset({
      line: A,
      column: 0
    }), 0)
  }
  startOfLine() {
    let {
      line: A,
      column: Q
    } = this.getPosition();
    if (Q === 0 && A > 0) return new p6(this.measuredText, this.getOffset({
      line: A - 1,
      column: 0
    }), 0);
    return this.startOfCurrentLine()
  }
  firstNonBlankInLine() {
    let {
      line: A
    } = this.getPosition(), B = (this.measuredText.getWrappedText()[A] || "").match(/^\s*\S/), G = B?.index ? B.index + B[0].length - 1 : 0, Z = this.getOffset({
      line: A,
      column: G
    });
    return new p6(this.measuredText, Z, 0)
  }
  endOfLine() {
    let {
      line: A
    } = this.getPosition(), Q = this.measuredText.getLineLength(A), B = this.getOffset({
      line: A,
      column: Q
    });
    return new p6(this.measuredText, B, 0)
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
    return new p6(this.measuredText, A + Z, 0)
  }
  endOfLogicalLine() {
    return new p6(this.measuredText, this.findLogicalLineEnd(), 0)
  }
  startOfLogicalLine() {
    return new p6(this.measuredText, this.findLogicalLineStart(), 0)
  }
  firstNonBlankInLogicalLine() {
    let {
      start: A,
      end: Q
    } = this.getLogicalLineBounds(), G = this.text.slice(A, Q).match(/\S/), Z = A + (G?.index ?? 0);
    return new p6(this.measuredText, Z, 0)
  }
  upLogicalLine() {
    let {
      start: A
    } = this.getLogicalLineBounds();
    if (A === 0) return new p6(this.measuredText, 0, 0);
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
    if (Q >= this.text.length) return new p6(this.measuredText, this.text.length, 0);
    let B = this.offset - A,
      G = Q + 1,
      Z = this.findLogicalLineEnd(G);
    return this.createCursorWithColumn(G, Z, B)
  }
  nextWord() {
    if (this.isAtEnd()) return this;
    let A = this.measuredText.getWordBoundaries();
    for (let Q of A)
      if (Q.isWordLike && Q.start > this.offset) return new p6(this.measuredText, Q.start);
    return new p6(this.measuredText, this.text.length)
  }
  endOfWord() {
    if (this.isAtEnd()) return this;
    let A = this.measuredText.getWordBoundaries();
    for (let Q of A) {
      if (!Q.isWordLike) continue;
      if (this.offset >= Q.start && this.offset < Q.end - 1) return new p6(this.measuredText, Q.end - 1);
      if (this.offset === Q.end - 1) {
        for (let B of A)
          if (B.isWordLike && B.start > this.offset) return new p6(this.measuredText, B.end - 1);
        return this
      }
    }
    for (let Q of A)
      if (Q.isWordLike && Q.start > this.offset) return new p6(this.measuredText, Q.end - 1);
    return this
  }
  prevWord() {
    if (this.isAtStart()) return this;
    let A = this.measuredText.getWordBoundaries(),
      Q = null;
    for (let B of A) {
      if (!B.isWordLike) continue;
      if (B.start < this.offset) {
        if (this.offset > B.start && this.offset <= B.end) return new p6(this.measuredText, B.start);
        Q = B.start
      }
    }
    if (Q !== null) return new p6(this.measuredText, Q);
    return new p6(this.measuredText, 0)
  }
  nextVimWord() {
    if (this.isAtEnd()) return this;
    let A = this.text,
      Q = this.offset,
      B = A[Q];
    if (B === void 0) return this;
    if (Wm(B))
      while (Q < A.length && Wm(A[Q])) Q++;
    else if (ca(B))
      while (Q < A.length && ca(A[Q])) Q++;
    while (Q < A.length && IjA.test(A[Q])) Q++;
    return new p6(this.measuredText, Q)
  }
  endOfVimWord() {
    if (this.isAtEnd()) return this;
    let A = this.text,
      Q = this.offset;
    if (A[Q] === void 0) return this;
    Q++;
    while (Q < A.length && IjA.test(A[Q])) Q++;
    if (Q >= A.length) return new p6(this.measuredText, A.length);
    let G = A[Q];
    if (Wm(G))
      while (Q < A.length - 1 && Wm(A[Q + 1])) Q++;
    else if (ca(G))
      while (Q < A.length - 1 && ca(A[Q + 1])) Q++;
    return new p6(this.measuredText, Q)
  }
  prevVimWord() {
    if (this.isAtStart()) return this;
    let A = this.text,
      Q = this.offset;
    Q--;
    while (Q > 0 && IjA.test(A[Q])) Q--;
    if (Q === 0 && IjA.test(A[0])) return new p6(this.measuredText, 0);
    let B = A[Q];
    if (Wm(B))
      while (Q > 0 && Wm(A[Q - 1])) Q--;
    else if (ca(B))
      while (Q > 0 && ca(A[Q - 1])) Q--;
    return new p6(this.measuredText, Q)
  }
  nextWORD() {
    let A = this;
    while (!A.isOverWhitespace() && !A.isAtEnd()) A = A.right();
    while (A.isOverWhitespace() && !A.isAtEnd()) A = A.right();
    return A
  }
  endOfWORD() {
    if (this.isAtEnd()) return this;
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
    return p6.fromText(Z, this.columns, B + Q.normalize("NFC").length)
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
    let A = this.startOfCurrentLine(),
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
    return new p6(this.measuredText, 0, 0)
  }
  startOfLastLine() {
    let A = this.text.lastIndexOf(`
`);
    if (A === -1) return this.startOfLine();
    return new p6(this.measuredText, A + 1, 0)
  }
  goToLine(A) {
    let Q = this.text.split(`
`),
      B = Math.min(Math.max(0, A - 1), Q.length - 1),
      G = 0;
    for (let Z = 0; Z < B; Z++) G += (Q[Z]?.length ?? 0) + 1;
    return new p6(this.measuredText, G, 0)
  }
  endOfFile() {
    return new p6(this.measuredText, this.text.length, 0)
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
  findCharacter(A, Q, B = 1) {
    let G = this.text,
      Z = Q === "f" || Q === "t",
      Y = Q === "t" || Q === "T",
      J = 0;
    if (Z) {
      for (let X = this.offset + 1; X < G.length; X++)
        if (G[X] === A) {
          if (J++, J === B) return Y ? Math.max(this.offset, X - 1) : X
        }
    } else
      for (let X = this.offset - 1; X >= 0; X--)
        if (G[X] === A) {
          if (J++, J === B) return Y ? Math.min(this.offset, X + 1) : X
        } return null
  }
}
// @from(Ln 191681, Col 0)
class B91 {
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
// @from(Ln 191699, Col 0)
class lMB {
  columns;
  _wrappedLines;
  text;
  navigationCache;
  graphemeBoundaries;
  constructor(A, Q) {
    this.columns = Q;
    this.text = A.normalize("NFC"), this.navigationCache = new Map
  }
  get wrappedLines() {
    if (!this._wrappedLines) this._wrappedLines = this.measureWrappedText();
    return this._wrappedLines
  }
  getGraphemeBoundaries() {
    if (!this.graphemeBoundaries) {
      this.graphemeBoundaries = [];
      for (let {
          index: A
        }
        of PB0.segment(this.text)) this.graphemeBoundaries.push(A);
      this.graphemeBoundaries.push(this.text.length)
    }
    return this.graphemeBoundaries
  }
  wordBoundariesCache;
  getWordBoundaries() {
    if (!this.wordBoundariesCache) {
      this.wordBoundariesCache = [];
      for (let A of RE8.segment(this.text)) this.wordBoundariesCache.push({
        start: A.index,
        end: A.index + A.segment.length,
        isWordLike: A.isWordLike ?? !1
      })
    }
    return this.wordBoundariesCache
  }
  binarySearchBoundary(A, Q, B) {
    let G = 0,
      Z = A.length - 1,
      Y = B ? this.text.length : 0;
    while (G <= Z) {
      let J = Math.floor((G + Z) / 2),
        X = A[J];
      if (X === void 0) break;
      if (B)
        if (X > Q) Y = X, Z = J - 1;
        else G = J + 1;
      else if (X < Q) Y = X, G = J + 1;
      else Z = J - 1
    }
    return Y
  }
  stringIndexToDisplayWidth(A, Q) {
    if (Q <= 0) return 0;
    if (Q >= A.length) return A9(A);
    return A9(A.substring(0, Q))
  }
  displayWidthToStringIndex(A, Q) {
    if (Q <= 0) return 0;
    if (!A) return 0;
    if (A === this.text) return this.offsetAtDisplayWidth(Q);
    let B = 0,
      G = 0;
    for (let {
        segment: Z,
        index: Y
      }
      of PB0.segment(A)) {
      let J = A9(Z);
      if (B + J > Q) break;
      B += J, G = Y + Z.length
    }
    return G
  }
  offsetAtDisplayWidth(A) {
    if (A <= 0) return 0;
    let Q = 0,
      B = this.getGraphemeBoundaries();
    for (let G = 0; G < B.length - 1; G++) {
      let Z = B[G],
        Y = B[G + 1];
      if (Z === void 0 || Y === void 0) continue;
      let J = this.text.substring(Z, Y),
        X = A9(J);
      if (Q + X > A) return Z;
      Q += X
    }
    return this.text.length
  }
  measureWrappedText() {
    let A = Ra(this.text, this.columns, {
        hard: !0,
        trim: !1
      }),
      Q = [],
      B = 0,
      G = -1,
      Z = A.split(`
`);
    for (let Y = 0; Y < Z.length; Y++) {
      let J = Z[Y],
        X = (I) => Y === 0 || I > 0 && this.text[I - 1] === `
`;
      if (J.length === 0)
        if (G = this.text.indexOf(`
`, G + 1), G !== -1) {
          let I = G,
            D = !0;
          Q.push(new B91(J, I, X(I), !0))
        } else {
          let I = this.text.length;
          Q.push(new B91(J, I, X(I), !1))
        }
      else {
        let I = this.text.indexOf(J, B);
        if (I === -1) throw Error("Failed to find wrapped line in text");
        B = I + J.length;
        let D = I + J.length,
          W = D < this.text.length && this.text[D] === `
`;
        if (W) G = D;
        Q.push(new B91(J, I, X(I), W))
      }
    }
    return Q
  }
  getWrappedText() {
    return this.wrappedLines.map((A) => A.isPrecededByNewline ? A.text : A.text.trimStart())
  }
  getWrappedLines() {
    return this.wrappedLines
  }
  getLine(A) {
    let Q = this.wrappedLines;
    return Q[Math.max(0, Math.min(A, Q.length - 1))]
  }
  getOffsetFromPosition(A) {
    let Q = this.getLine(A.line);
    if (Q.text.length === 0 && Q.endsWithNewline) return Q.startOffset;
    let B = Q.isPrecededByNewline ? 0 : Q.text.length - Q.text.trimStart().length,
      G = A.column + B,
      Z = this.displayWidthToStringIndex(Q.text, G),
      Y = Q.startOffset + Z,
      J = Q.startOffset + Q.text.length,
      X = J,
      I = A9(Q.text);
    if (Q.endsWithNewline && A.column > I) X = J + 1;
    return Math.min(Y, X)
  }
  getLineLength(A) {
    let Q = this.getLine(A);
    return A9(Q.text)
  }
  getPositionFromOffset(A) {
    let Q = this.wrappedLines;
    for (let Z = 0; Z < Q.length; Z++) {
      let Y = Q[Z],
        J = Q[Z + 1];
      if (A >= Y.startOffset && (!J || A < J.startOffset)) {
        let X = A - Y.startOffset,
          I;
        if (Y.isPrecededByNewline) I = this.stringIndexToDisplayWidth(Y.text, X);
        else {
          let D = Y.text.length - Y.text.trimStart().length;
          if (X < D) I = 0;
          else {
            let W = Y.text.trimStart(),
              K = X - D;
            I = this.stringIndexToDisplayWidth(W, K)
          }
        }
        return {
          line: Z,
          column: Math.max(0, I)
        }
      }
    }
    let B = Q.length - 1,
      G = this.wrappedLines[B];
    return {
      line: B,
      column: A9(G.text)
    }
  }
  get lineCount() {
    return this.wrappedLines.length
  }
  withCache(A, Q) {
    let B = this.navigationCache.get(A);
    if (B !== void 0) return B;
    let G = Q();
    return this.navigationCache.set(A, G), G
  }
  nextOffset(A) {
    return this.withCache(`next:${A}`, () => {
      let Q = this.getGraphemeBoundaries();
      return this.binarySearchBoundary(Q, A, !0)
    })
  }
  prevOffset(A) {
    if (A <= 0) return 0;
    return this.withCache(`prev:${A}`, () => {
      let Q = this.getGraphemeBoundaries();
      return this.binarySearchBoundary(Q, A, !1)
    })
  }
}
// @from(Ln 191907, Col 4)
ME8 = 10
// @from(Ln 191908, Col 2)
Z_
// @from(Ln 191908, Col 6)
Q91 = 0
// @from(Ln 191909, Col 2)
TB0 = !1
// @from(Ln 191910, Col 2)
uMB = 0
// @from(Ln 191911, Col 2)
SB0 = 0
// @from(Ln 191912, Col 2)
G91 = !1
// @from(Ln 191913, Col 2)
PB0
// @from(Ln 191913, Col 7)
RE8
// @from(Ln 191913, Col 12)
_E8
// @from(Ln 191913, Col 17)
IjA
// @from(Ln 191913, Col 22)
Wm = (A) => _E8.test(A)
// @from(Ln 191914, Col 2)
Y91 = (A) => IjA.test(A)
// @from(Ln 191915, Col 2)
ca = (A) => A.length > 0 && !Y91(A) && !Wm(A)
// @from(Ln 191916, Col 4)
DjA = w(() => {
  SB1();
  UC();
  Z_ = [];
  PB0 = new Intl.Segmenter(void 0, {
    granularity: "grapheme"
  }), RE8 = new Intl.Segmenter(void 0, {
    granularity: "word"
  }), _E8 = /^[\p{L}\p{N}\p{M}_]$/u, IjA = /\s/
})
// @from(Ln 191927, Col 0)
function J91({
  children: A
}) {
  let {
    marker: Q
  } = pa.useContext(jE8);
  return pa.default.createElement(T, {
    gap: 1
  }, pa.default.createElement(C, {
    dimColor: !0
  }, Q), pa.default.createElement(T, {
    flexDirection: "column"
  }, A))
}
// @from(Ln 191941, Col 4)
pa
// @from(Ln 191941, Col 8)
jE8
// @from(Ln 191942, Col 4)
iMB = w(() => {
  fA();
  pa = c(QA(), 1), jE8 = pa.createContext({
    marker: ""
  })
})
// @from(Ln 191949, Col 0)
function aMB({
  children: A
}) {
  let {
    marker: Q
  } = ZN.useContext(nMB), B = 0;
  for (let Z of ZN.default.Children.toArray(A)) {
    if (!ZN.isValidElement(Z) || Z.type !== J91) continue;
    B++
  }
  let G = String(B).length;
  return ZN.default.createElement(T, {
    flexDirection: "column"
  }, ZN.default.Children.map(A, (Z, Y) => {
    if (!ZN.isValidElement(Z) || Z.type !== J91) return Z;
    let J = `${String(Y+1).padStart(G)}.`,
      X = `${Q}${J}`;
    return ZN.default.createElement(nMB.Provider, {
      value: {
        marker: X
      }
    }, ZN.default.createElement(TE8.Provider, {
      value: {
        marker: X
      }
    }, Z))
  }))
}
// @from(Ln 191977, Col 4)
ZN
// @from(Ln 191977, Col 8)
nMB
// @from(Ln 191977, Col 13)
TE8
// @from(Ln 191977, Col 18)
WjA
// @from(Ln 191978, Col 4)
vB0 = w(() => {
  fA();
  iMB();
  ZN = c(QA(), 1), nMB = ZN.createContext({
    marker: ""
  }), TE8 = ZN.createContext({
    marker: ""
  });
  aMB.Item = J91;
  WjA = aMB
})
// @from(Ln 191993, Col 0)
function rMB() {
  return kB0().filter(({
    isCompletable: A,
    isEnabled: Q
  }) => A && Q).every(({
    isComplete: A
  }) => A)
}
// @from(Ln 192002, Col 0)
function FDA() {
  let A = JG();
  if (rMB() && !A.hasCompletedProjectOnboarding) BZ((Q) => ({
    ...Q,
    hasCompletedProjectOnboarding: !0
  }))
}
// @from(Ln 192010, Col 0)
function kB0() {
  let A = vA().existsSync(SE8(o1(), "CLAUDE.md")),
    Q = eMB(o1());
  return [{
    key: "workspace",
    text: "Ask Claude to create a new app or clone a repository",
    isComplete: !1,
    isCompletable: !0,
    isEnabled: Q
  }, {
    key: "claudemd",
    text: "Run /init to create a CLAUDE.md file with instructions for Claude",
    isComplete: A,
    isCompletable: !0,
    isEnabled: !Q
  }]
}
// @from(Ln 192028, Col 0)
function tMB() {
  BZ((A) => ({
    ...A,
    projectOnboardingSeenCount: A.projectOnboardingSeenCount + 1
  }))
}
// @from(Ln 192034, Col 4)
PE8
// @from(Ln 192034, Col 9)
oMB
// @from(Ln 192034, Col 14)
sMB
// @from(Ln 192035, Col 4)
KjA = w(() => {
  vB0();
  fA();
  GQ();
  y9();
  V2();
  DQ();
  Y9();
  PE8 = c(QA(), 1), oMB = c(QA(), 1);
  sMB = W0(() => {
    if (rMB() || JG().projectOnboardingSeenCount >= 4 || process.env.IS_DEMO) return !1;
    return !0
  })
})
// @from(Ln 192056, Col 0)
function vE8(A) {
  S0((Q) => ({
    ...Q,
    appleTerminalSetupInProgress: !0,
    appleTerminalBackupPath: A
  }))
}
// @from(Ln 192064, Col 0)
function VjA() {
  S0((A) => ({
    ...A,
    appleTerminalSetupInProgress: !1
  }))
}
// @from(Ln 192071, Col 0)
function kE8() {
  let A = L1();
  return {
    inProgress: A.appleTerminalSetupInProgress ?? !1,
    backupPath: A.appleTerminalBackupPath || null
  }
}
// @from(Ln 192079, Col 0)
function HDA() {
  return yE8(xE8(), "Library", "Preferences", "com.apple.Terminal.plist")
}
// @from(Ln 192082, Col 0)
async function ARB() {
  let A = HDA(),
    Q = `${A}.bak`;
  try {
    let {
      code: B
    } = await TQ("defaults", ["export", "com.apple.Terminal", A]);
    if (B !== 0) return null;
    if (vA().existsSync(A)) return await TQ("defaults", ["export", "com.apple.Terminal", Q]), vE8(Q), Q;
    return null
  } catch (B) {
    return e(B instanceof Error ? B : Error(String(B))), null
  }
}
// @from(Ln 192096, Col 0)
async function X91() {
  let {
    inProgress: A,
    backupPath: Q
  } = kE8();
  if (!A) return {
    status: "no_backup"
  };
  if (!Q || !vA().existsSync(Q)) return VjA(), {
    status: "no_backup"
  };
  try {
    let {
      code: B
    } = await TQ("defaults", ["import", "com.apple.Terminal", Q]);
    if (B !== 0) return {
      status: "failed",
      backupPath: Q
    };
    return await TQ("killall", ["cfprefsd"]), VjA(), {
      status: "restored"
    }
  } catch (B) {
    return e(Error(`Failed to restore Terminal.app settings with: ${B}`)), VjA(), {
      status: "failed",
      backupPath: Q
    }
  }
}
// @from(Ln 192125, Col 4)
bB0 = w(() => {
  t4();
  v1();
  GQ();
  DQ()
})
// @from(Ln 192144, Col 0)
function fE8() {
  return l0.terminal !== null && l0.terminal in HjA
}
// @from(Ln 192148, Col 0)
function GRB() {
  if (!l0.terminal || !(l0.terminal in HjA)) return null;
  return HjA[l0.terminal] ?? null
}
// @from(Ln 192153, Col 0)
function EjA() {
  return FjA() === "darwin" && l0.terminal === "Apple_Terminal" || l0.terminal === "vscode" || l0.terminal === "cursor" || l0.terminal === "windsurf" || l0.terminal === "alacritty" || l0.terminal === "WarpTerminal" || l0.terminal === "zed"
}
// @from(Ln 192156, Col 0)
async function uB0(A) {
  let Q = "";
  switch (l0.terminal) {
    case "Apple_Terminal":
      Q = await gE8(A);
      break;
    case "vscode":
      Q = fB0("VSCode", A);
      break;
    case "cursor":
      Q = fB0("Cursor", A);
      break;
    case "windsurf":
      Q = fB0("Windsurf", A);
      break;
    case "alacritty":
      Q = await uE8(A);
      break;
    case "WarpTerminal":
      Q = mE8(A);
      break;
    case "zed":
      Q = dE8(A);
      break;
    case null:
      break
  }
  return S0((B) => {
    if (["vscode", "cursor", "windsurf", "alacritty", "WarpTerminal", "zed"].includes(l0.terminal ?? "")) {
      if (B.shiftEnterKeyBindingInstalled === !0) return B;
      return {
        ...B,
        shiftEnterKeyBindingInstalled: !0
      }
    } else if (l0.terminal === "Apple_Terminal") {
      if (B.optionAsMetaKeyInstalled === !0) return B;
      return {
        ...B,
        optionAsMetaKeyInstalled: !0
      }
    }
    return B
  }), FDA(), Q
}
// @from(Ln 192201, Col 0)
function ZRB() {
  return L1().shiftEnterKeyBindingInstalled === !0
}
// @from(Ln 192205, Col 0)
function YRB() {
  return L1().hasUsedBackslashReturn === !0
}
// @from(Ln 192209, Col 0)
function JRB() {
  if (!L1().hasUsedBackslashReturn) S0((Q) => ({
    ...Q,
    hasUsedBackslashReturn: !0
  }))
}
// @from(Ln 192216, Col 0)
function fB0(A = "VSCode", Q) {
  let B = A === "VSCode" ? "Code" : A,
    G = xk(gB0(), FjA() === "win32" ? xk("AppData", "Roaming", B, "User") : FjA() === "darwin" ? xk("Library", "Application Support", B, "User") : xk(".config", B, "User")),
    Z = xk(G, "keybindings.json");
  try {
    let Y = "[]",
      J = [];
    if (!vA().existsSync(G)) vA().mkdirSync(G);
    if (vA().existsSync(Z)) {
      Y = vA().readFileSync(Z, {
        encoding: "utf-8"
      }), J = Q7Q(Y) ?? [];
      let W = hB0(4).toString("hex"),
        K = `${Z}.${W}.bak`;
      try {
        vA().copyFileSync(Z, K)
      } catch {
        return `${sQ("warning",Q)(`Error backing up existing ${A} terminal keybindings. Bailing out.`)}${x5}${I1.dim(`See ${Z}`)}${x5}${I1.dim(`Backup path: ${K}`)}${x5}`
      }
    }
    if (J.find((W) => W.key === "shift+enter" && W.command === "workbench.action.terminal.sendSequence" && W.when === "terminalFocus")) return `${sQ("warning",Q)(`Found existing ${A} terminal Shift+Enter key binding. Remove it to continue.`)}${x5}${I1.dim(`See ${Z}`)}${x5}`;
    let D = B7Q(Y, {
      key: "shift+enter",
      command: "workbench.action.terminal.sendSequence",
      args: {
        text: "\x1B\r"
      },
      when: "terminalFocus"
    });
    return bB(Z, D, {
      encoding: "utf-8"
    }), `${sQ("success",Q)(`Installed ${A} terminal Shift+Enter key binding`)}${x5}${I1.dim(`See ${Z}`)}${x5}`
  } catch (Y) {
    throw e(Y instanceof Error ? Y : Error(String(Y))), Error(`Failed to install ${A} terminal Shift+Enter key binding`)
  }
}
// @from(Ln 192252, Col 0)
async function QRB(A) {
  let {
    code: Q
  } = await TQ("/usr/libexec/PlistBuddy", ["-c", `Add :'Window Settings':'${A}':useOptionAsMetaKey bool true`, HDA()]);
  if (Q !== 0) {
    let {
      code: B
    } = await TQ("/usr/libexec/PlistBuddy", ["-c", `Set :'Window Settings':'${A}':useOptionAsMetaKey true`, HDA()]);
    if (B !== 0) return e(Error(`Failed to enable Option as Meta key for Terminal.app profile: ${A}`)), !1
  }
  return !0
}
// @from(Ln 192264, Col 0)
async function BRB(A) {
  let {
    code: Q
  } = await TQ("/usr/libexec/PlistBuddy", ["-c", `Add :'Window Settings':'${A}':Bell bool false`, HDA()]);
  if (Q !== 0) {
    let {
      code: B
    } = await TQ("/usr/libexec/PlistBuddy", ["-c", `Set :'Window Settings':'${A}':Bell false`, HDA()]);
    if (B !== 0) return e(Error(`Failed to disable audio bell for Terminal.app profile: ${A}`)), !1
  }
  return !0
}
// @from(Ln 192276, Col 0)
async function gE8(A) {
  try {
    if (!await ARB()) throw Error("Failed to create backup of Terminal.app preferences, bailing out");
    let {
      stdout: B,
      code: G
    } = await TQ("defaults", ["read", "com.apple.Terminal", "Default Window Settings"]);
    if (G !== 0 || !B.trim()) throw Error("Failed to read default Terminal.app profile");
    let {
      stdout: Z,
      code: Y
    } = await TQ("defaults", ["read", "com.apple.Terminal", "Startup Window Settings"]);
    if (Y !== 0 || !Z.trim()) throw Error("Failed to read startup Terminal.app profile");
    let J = !1,
      X = B.trim(),
      I = await QRB(X),
      D = await BRB(X);
    if (I || D) J = !0;
    let W = Z.trim();
    if (W !== X) {
      let K = await QRB(W),
        V = await BRB(W);
      if (K || V) J = !0
    }
    if (!J) throw Error("Failed to enable Option as Meta key or disable audio bell for any Terminal.app profile");
    return await TQ("killall", ["cfprefsd"]), VjA(), `${sQ("success",A)("Configured Terminal.app settings:")}${x5}${sQ("success",A)('- Enabled "Use Option as Meta key"')}${x5}${sQ("success",A)("- Switched to visual bell")}${x5}${I1.dim("Option+Enter will now enter a newline.")}${x5}${I1.dim("You must restart Terminal.app for changes to take effect.",A)}${x5}`
  } catch (Q) {
    e(Q instanceof Error ? Q : Error(String(Q)));
    let B = await X91(),
      G = "Failed to enable Option as Meta key for Terminal.app.";
    if (B.status === "restored") throw Error(`${G} Your settings have been restored from backup.`);
    else if (B.status === "failed") throw Error(`${G} Restoring from backup failed, try manually with: defaults import com.apple.Terminal ${B.backupPath}`);
    else throw Error(`${G} No backup was available to restore from.`)
  }
}
// @from(Ln 192311, Col 0)
async function uE8(A) {
  let B = [],
    G = process.env.XDG_CONFIG_HOME;
  if (G) B.push(xk(G, "alacritty", "alacritty.toml"));
  else B.push(xk(gB0(), ".config", "alacritty", "alacritty.toml"));
  if (FjA() === "win32") {
    let J = process.env.APPDATA;
    if (J) B.push(xk(J, "alacritty", "alacritty.toml"))
  }
  let Z = null,
    Y = !1;
  for (let J of B)
    if (vA().existsSync(J)) {
      Z = J, Y = !0;
      break
    } if (!Z) Z = B[0] ?? null, Y = !1;
  if (!Z) throw Error("No valid config path found for Alacritty");
  try {
    let J = "";
    if (Y) {
      if (J = vA().readFileSync(Z, {
          encoding: "utf-8"
        }), J.includes('mods = "Shift"') && J.includes('key = "Return"')) return `${sQ("warning",A)("Found existing Alacritty Shift+Enter key binding. Remove it to continue.")}${x5}${I1.dim(`See ${Z}`)}${x5}`;
      let I = hB0(4).toString("hex"),
        D = `${Z}.${I}.bak`;
      try {
        vA().copyFileSync(Z, D)
      } catch {
        return `${sQ("warning",A)("Error backing up existing Alacritty config. Bailing out.")}${x5}${I1.dim(`See ${Z}`)}${x5}${I1.dim(`Backup path: ${D}`)}${x5}`
      }
    } else {
      let I = bE8(Z);
      if (!vA().existsSync(I)) vA().mkdirSync(I)
    }
    let X = J;
    if (J && !J.endsWith(`
`)) X += `
`;
    return X += `
[[keyboard.bindings]]
key = "Return"
mods = "Shift"
chars = "\\x1b\\r"
`, bB(Z, X, {
      encoding: "utf-8"
    }), `${sQ("success",A)("Installed Alacritty Shift+Enter key binding")}${x5}${sQ("success",A)("You may need to restart Alacritty for changes to take effect")}${x5}${I1.dim(`See ${Z}`)}${x5}`
  } catch (J) {
    throw e(J instanceof Error ? J : Error(String(J))), Error("Failed to install Alacritty Shift+Enter key binding")
  }
}
// @from(Ln 192362, Col 0)
function mE8(A) {
  if (FjA() === "darwin") return `${sQ("warning",A)("Warp requires manual configuration:")}${x5}${x5}${sQ("success",A)("For Alt+T (thinking) and Alt+P (model picker):")}${x5}  Settings → Features → Enable "Left Option key is meta"${x5}${x5}${I1.dim("Note: Warp does not support custom Shift+Enter keybindings.")}${x5}${I1.dim("Use backslash (\\) + Enter for multi-line input.")}${x5}`;
  return `${sQ("warning",A)("Warp does not support custom Shift+Enter keybindings.")}${x5}${I1.dim("Use backslash (\\) + Enter for multi-line input.")}${x5}`
}
// @from(Ln 192367, Col 0)
function dE8(A) {
  let Q = xk(gB0(), ".config", "zed"),
    B = xk(Q, "keymap.json");
  try {
    let G = "[]";
    if (!vA().existsSync(Q)) vA().mkdirSync(Q);
    if (vA().existsSync(B)) {
      if (G = vA().readFileSync(B, {
          encoding: "utf-8"
        }), G.includes("shift-enter")) return `${sQ("warning",A)("Found existing Zed Shift+Enter key binding. Remove it to continue.")}${x5}${I1.dim(`See ${B}`)}${x5}`;
      let Y = hB0(4).toString("hex"),
        J = `${B}.${Y}.bak`;
      try {
        vA().copyFileSync(B, J)
      } catch {
        return `${sQ("warning",A)("Error backing up existing Zed keymap. Bailing out.")}${x5}${I1.dim(`See ${B}`)}${x5}${I1.dim(`Backup path: ${J}`)}${x5}`
      }
    }
    let Z;
    try {
      if (Z = AQ(G), !Array.isArray(Z)) Z = []
    } catch {
      Z = []
    }
    return Z.push({
      context: "Terminal",
      bindings: {
        "shift-enter": ["terminal::SendText", "\x1B\r"]
      }
    }), bB(B, eA(Z, null, 2) + `
`, {
      encoding: "utf-8"
    }), `${sQ("success",A)("Installed Zed Shift+Enter key binding")}${x5}${I1.dim(`See ${B}`)}${x5}`
  } catch (G) {
    throw e(G instanceof Error ? G : Error(String(G))), Error("Failed to install Zed Shift+Enter key binding")
  }
}
// @from(Ln 192404, Col 4)
HjA
// @from(Ln 192404, Col 9)
hE8
// @from(Ln 192404, Col 14)
tBA
// @from(Ln 192405, Col 4)
eBA = w(() => {
  Z3();
  KjA();
  bB0();
  GQ();
  p3();
  t4();
  DQ();
  A0();
  vI();
  v1();
  fA();
  c3();
  A0();
  HjA = {
    ghostty: "Ghostty",
    kitty: "Kitty",
    "iTerm.app": "iTerm2",
    WezTerm: "WezTerm"
  };
  hE8 = {
    type: "local-jsx",
    name: "terminal-setup",
    userFacingName() {
      return "terminal-setup"
    },
    description: l0.terminal === "Apple_Terminal" ? "Enable Option+Enter key binding for newlines and visual bell" : "Install Shift+Enter key binding for newlines",
    isEnabled: () => !0,
    isHidden: fE8(),
    async call(A, Q) {
      if (l0.terminal && l0.terminal in HjA) {
        let G = `Shift+Enter is natively supported in ${HjA[l0.terminal]}.

No configuration needed. Just use Shift+Enter to add newlines.`;
        return A(G), null
      }
      if (!EjA()) {
        let G = l0.terminal || "your current terminal",
          Z = $Q(),
          Y = "";
        if (Z === "macos") Y = `   • macOS: Apple Terminal
`;
        else if (Z === "windows") Y = `   • Windows: Windows Terminal
`;
        let J = `Terminal setup cannot be run from ${G}.

This command configures a convenient Shift+Enter shortcut for multi-line prompts.
${I1.dim("Note: You can already use backslash (\\) + return to add newlines.")}

To set up the shortcut (optional):
1. Exit tmux/screen temporarily
2. Run /terminal-setup directly in one of these terminals:
${Y}   • IDE: VSCode, Cursor, Windsurf, Zed
   • Other: Alacritty, Warp
3. Return to tmux/screen - settings will persist

${I1.dim("Note: iTerm2, WezTerm, Ghostty, and Kitty support Shift+Enter natively.")}`;
        return A(J), null
      }
      let B = await uB0(Q.options.theme);
      return A(B), null
    }
  };
  tBA = hE8
})
// @from(Ln 192485, Col 0)
function dB0() {
  return mB0(zQ(), rE8)
}
// @from(Ln 192489, Col 0)
function XRB(A) {
  return cE8("sha256").update(A).digest("hex").slice(0, 16)
}
// @from(Ln 192493, Col 0)
function IRB(A) {
  return mB0(dB0(), `${A}.txt`)
}
// @from(Ln 192496, Col 0)
async function DRB(A, Q) {
  try {
    let B = dB0();
    await pE8(B, {
      recursive: !0
    });
    let G = IRB(A);
    await lE8(G, Q, {
      encoding: "utf8",
      mode: 384
    }), k(`Stored paste ${A} to ${G}`)
  } catch (B) {
    k(`Failed to store paste: ${B}`)
  }
}
// @from(Ln 192511, Col 0)
async function WRB(A) {
  try {
    let Q = IRB(A);
    return await iE8(Q, {
      encoding: "utf8"
    })
  } catch (Q) {
    if (Q && typeof Q === "object" && "code" in Q) {
      if (Q.code !== "ENOENT") k(`Failed to retrieve paste ${A}: ${Q}`)
    }
    return null
  }
}
// @from(Ln 192524, Col 0)
async function KRB(A) {
  let Q = dB0(),
    B;
  try {
    B = await nE8(Q)
  } catch {
    return
  }
  let G = A.getTime();
  for (let Z of B) {
    if (!Z.endsWith(".txt")) continue;
    let Y = mB0(Q, Z);
    try {
      if ((await aE8(Y)).mtimeMs < G) await oE8(Y), k(`Cleaned up old paste: ${Y}`)
    } catch {}
  }
}
// @from(Ln 192541, Col 4)
rE8 = "paste-cache"
// @from(Ln 192542, Col 4)
cB0 = w(() => {
  fQ();
  T1()
})
// @from(Ln 192550, Col 0)
function D91(A) {
  return (A.match(/\r\n|\r|\n/g) || []).length
}
// @from(Ln 192554, Col 0)
function ERB(A, Q) {
  if (Q === 0) return `[Pasted text #${A}]`;
  return `[Pasted text #${A} +${Q} lines]`
}
// @from(Ln 192559, Col 0)
function W91(A) {
  let Q = /\[(Pasted text|Image|\.\.\.Truncated text) #(\d+)(?: \+\d+ lines)?(\.)*\]/g;
  return [...A.matchAll(Q)].map((G) => ({
    id: parseInt(G[2] || "0"),
    match: G[0]
  })).filter((G) => G.id > 0)
}
// @from(Ln 192567, Col 0)
function eE8(A) {
  return AQ(A)
}
// @from(Ln 192570, Col 0)
async function* zRB() {
  for (let B = Km.length - 1; B >= 0; B--) yield Km[B];
  let A = FRB(zQ(), "history.jsonl");
  if (!vA().existsSync(A)) return;
  for await (let B of Uf0(A)) try {
    yield eE8(B)
  } catch (G) {
    k(`Failed to parse history line: ${G}`)
  }
}
// @from(Ln 192580, Col 0)
async function* lB0() {
  for await (let A of zRB()) yield await CRB(A)
}
// @from(Ln 192583, Col 0)
async function* $RB() {
  let A = Xq(),
    Q = 0;
  for await (let B of zRB()) {
    if (!B || typeof B.project !== "string") continue;
    if (B.project === A) {
      if (yield await CRB(B), Q++, Q >= sE8) break
    }
  }
}
// @from(Ln 192593, Col 0)
async function Az8(A) {
  if (A.content) return {
    id: A.id,
    type: A.type,
    content: A.content,
    mediaType: A.mediaType,
    filename: A.filename
  };
  if (A.contentHash) {
    let Q = await WRB(A.contentHash);
    if (Q) return {
      id: A.id,
      type: A.type,
      content: Q,
      mediaType: A.mediaType,
      filename: A.filename
    }
  }
  return null
}
// @from(Ln 192613, Col 0)
async function CRB(A) {
  let Q = {};
  for (let [B, G] of Object.entries(A.pastedContents || {})) {
    let Z = await Az8(G);
    if (Z) Q[Number(B)] = Z
  }
  return {
    display: A.display,
    pastedContents: Q
  }
}
// @from(Ln 192624, Col 0)
async function URB() {
  if (Km.length === 0) return;
  let A;
  try {
    let Q = FRB(zQ(), "history.jsonl"),
      B = vA();
    if (!B.existsSync(Q)) bB(Q, "", {
      encoding: "utf8",
      flush: !0,
      mode: 384
    });
    A = await HRB.lock(Q, {
      stale: 1e4,
      retries: {
        retries: 3,
        minTimeout: 50
      }
    });
    let G = Km.map((Z) => eA(Z) + `
`);
    Km = [], B.appendFileSync(Q, G.join(""), {
      mode: 384
    })
  } catch (Q) {
    k(`Failed to write prompt history: ${Q}`)
  } finally {
    if (A) await A()
  }
}
// @from(Ln 192653, Col 0)
async function qRB(A) {
  if (pB0 || Km.length === 0) return;
  if (A > 5) return;
  pB0 = !0;
  try {
    await URB()
  } finally {
    if (pB0 = !1, Km.length > 0) await new Promise((Q) => setTimeout(Q, 500)), qRB(A + 1)
  }
}
// @from(Ln 192663, Col 0)
async function Qz8(A) {
  let Q = typeof A === "string" ? {
      display: A,
      pastedContents: {}
    } : A,
    B = {};
  if (Q.pastedContents)
    for (let [Z, Y] of Object.entries(Q.pastedContents)) {
      if (Y.type === "image") continue;
      if (Y.content.length <= tE8) B[Number(Z)] = {
        id: Y.id,
        type: Y.type,
        content: Y.content,
        mediaType: Y.mediaType,
        filename: Y.filename
      };
      else {
        let J = XRB(Y.content);
        B[Number(Z)] = {
          id: Y.id,
          type: Y.type,
          contentHash: J,
          mediaType: Y.mediaType,
          filename: Y.filename
        }, DRB(J, Y.content)
      }
    }
  let G = {
    ...Q,
    pastedContents: B,
    timestamp: Date.now(),
    project: Xq(),
    sessionId: q0()
  };
  Km.push(G), I91 = qRB(0)
}
// @from(Ln 192700, Col 0)
function A2A(A) {
  if (process.env.CLAUDE_CODE_SKIP_PROMPT_HISTORY === "true") return;
  if (!VRB) VRB = !0, C6(async () => {
    if (I91) await I91;
    if (Km.length > 0) await URB()
  });
  Qz8(A)
}
// @from(Ln 192708, Col 4)
HRB
// @from(Ln 192708, Col 9)
sE8 = 100
// @from(Ln 192709, Col 2)
tE8 = 1024
// @from(Ln 192710, Col 2)
Km
// @from(Ln 192710, Col 6)
pB0 = !1
// @from(Ln 192711, Col 2)
I91 = null
// @from(Ln 192712, Col 2)
VRB = !1
// @from(Ln 192713, Col 4)
Vm = w(() => {
  fQ();
  DQ();
  A0();
  C0();
  T1();
  nX();
  A0();
  cB0();
  HRB = c(qi(), 1);
  Km = []
})
// @from(Ln 192726, Col 0)
function NRB(A, Q) {
  switch (Q) {
    case "bash":
      return `!${A}`;
    case "background":
      return `&${A}`;
    default:
      return A
  }
}
// @from(Ln 192737, Col 0)
function Fm(A) {
  if (A.startsWith("!")) return "bash";
  if (A.startsWith("&")) return "background";
  return "prompt"
}
// @from(Ln 192743, Col 0)
function Q2A(A) {
  if (Fm(A) === "prompt") return A;
  return A.slice(1)
}
// @from(Ln 192748, Col 0)
function wRB(A) {
  return A === "!" || A === "&"
}
// @from(Ln 192752, Col 0)
function la(A) {
  return A.filter((Q) => Q.data?.type !== "hook_progress")
}
// @from(Ln 192756, Col 0)
function Bz8(A, Q) {
  return A.name === Q || (A.aliases?.includes(Q) ?? !1)
}
// @from(Ln 192760, Col 0)
function K91(A, Q) {
  return A.find((B) => Bz8(B, Q))
}
// @from(Ln 192763, Col 4)
oL = () => ({
  mode: "default",
  additionalWorkingDirectories: new Map,
  alwaysAllowRules: {},
  alwaysDenyRules: {},
  alwaysAskRules: {},
  isBypassPermissionsModeAvailable: !1
})
// @from(Ln 192772, Col 0)
function EDA(A) {
  let Q = V91.useCallback((B) => {
    vP();
    let G = jQ();
    A(B, G)
  }, [A]);
  V91.useEffect(() => HC.subscribe(Q), [Q])
}
// @from(Ln 192780, Col 4)
V91
// @from(Ln 192781, Col 4)
F91 = w(() => {
  WBA();
  GB();
  V91 = c(QA(), 1)
})
// @from(Ln 192793, Col 0)
function MRB(A) {
  let Q = LRB.sep + A.split(Yz8).join(LRB.sep).replace(/^\/+/, ""),
    B = Gz8(A).toLowerCase(),
    G = Zz8(A).toLowerCase();
  if (Jz8.has(B)) return !0;
  if (ORB.has(G)) return !0;
  let Z = B.split(".");
  if (Z.length > 2) {
    let Y = "." + Z.slice(-2).join(".");
    if (ORB.has(Y)) return !0
  }
  for (let Y of Xz8)
    if (Q.includes(Y)) return !0;
  for (let Y of Iz8)
    if (Y.test(B)) return !0;
  return !1
}
// @from(Ln 192810, Col 4)
Jz8
// @from(Ln 192810, Col 9)
ORB
// @from(Ln 192810, Col 14)
Xz8
// @from(Ln 192810, Col 19)
Iz8
// @from(Ln 192811, Col 4)
RRB = w(() => {
  Jz8 = new Set(["package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb", "bun.lock", "composer.lock", "gemfile.lock", "cargo.lock", "poetry.lock", "pipfile.lock", "shrinkwrap.json", "npm-shrinkwrap.json"]), ORB = new Set([".lock", ".min.js", ".min.css", ".min.html", ".bundle.js", ".bundle.css", ".generated.ts", ".generated.js", ".d.ts"]), Xz8 = ["/dist/", "/build/", "/out/", "/output/", "/node_modules/", "/vendor/", "/vendored/", "/third_party/", "/third-party/", "/external/", "/.next/", "/.nuxt/", "/.svelte-kit/", "/coverage/", "/__pycache__/", "/.tox/", "/venv/", "/.venv/", "/target/release/", "/target/debug/"], Iz8 = [/^.*\.min\.[a-z]+$/i, /^.*-min\.[a-z]+$/i, /^.*\.bundle\.[a-z]+$/i, /^.*\.generated\.[a-z]+$/i, /^.*\.gen\.[a-z]+$/i, /^.*\.auto\.[a-z]+$/i, /^.*_generated\.[a-z]+$/i, /^.*_gen\.[a-z]+$/i, /^.*\.pb\.(go|js|ts|py|rb)$/i, /^.*_pb2?\.py$/i, /^.*\.pb\.h$/i, /^.*\.grpc\.[a-z]+$/i, /^.*\.swagger\.[a-z]+$/i, /^.*\.openapi\.[a-z]+$/i]
})
// @from(Ln 192823, Col 0)
function PRB() {
  nB0()
}
// @from(Ln 192827, Col 0)
function Kz8(A) {
  let Q = A.lastIndexOf("/");
  if (Q === -1) return A;
  let B = A.slice(0, Q),
    G = A.slice(Q + 1),
    Z = Vz8(G);
  return `${B}/${Z}`
}
// @from(Ln 192836, Col 0)
function Vz8(A) {
  if (A.includes("opus-4-5")) return "claude-opus-4-5";
  if (A.includes("opus-4-1")) return "claude-opus-4-1";
  if (A.includes("opus-4")) return "claude-opus-4";
  if (A.includes("sonnet-4-5")) return "claude-sonnet-4-5";
  if (A.includes("sonnet-4")) return "claude-sonnet-4";
  if (A.includes("sonnet-3-7")) return "claude-sonnet-3-7";
  if (A.includes("haiku-4-5")) return "claude-haiku-4-5";
  if (A.includes("haiku-3-5")) return "claude-haiku-3-5";
  return "claude"
}
// @from(Ln 192848, Col 0)
function H91() {
  return process.env.CLAUDE_CODE_ENTRYPOINT ?? "cli"
}
// @from(Ln 192852, Col 0)
function aB0(A, Q) {
  return `${A}/${Uz(Q)}`
}
// @from(Ln 192856, Col 0)
function Fz8(A) {
  return Dz8("sha256").update(A).digest("hex")
}
// @from(Ln 192860, Col 0)
function E91(A) {
  let Q = vA(),
    B = EQ();
  if (!TRB(A)) return A;
  let G = A,
    Z = B;
  try {
    G = Q.realpathSync(A)
  } catch {}
  try {
    Z = Q.realpathSync(B)
  } catch {}
  if (G.startsWith(Z + "/") || G === Z) return _RB(Z, G);
  if (A.startsWith(B + "/") || A === B) return _RB(B, A);
  return A
}
// @from(Ln 192877, Col 0)
function Hz8(A) {
  if (TRB(A)) return A;
  return iB0(EQ(), A)
}
// @from(Ln 192882, Col 0)
function z91() {
  return {
    fileStates: new Map,
    sessionBaselines: new Map,
    surface: H91(),
    startingHeadSha: null,
    promptCount: 0,
    promptCountAtLastCommit: 0,
    permissionPromptCount: 0,
    permissionPromptCountAtLastCommit: 0,
    escapeCount: 0,
    escapeCountAtLastCommit: 0
  }
}
// @from(Ln 192897, Col 0)
function $91(A, Q, B, G, Z) {
  let Y = E91(Q),
    J = vA(),
    X = Hz8(Y);
  try {
    let I;
    if (Z) I = Math.max(0, G.length - B.length);
    else if (B === "") I = G.length;
    else {
      I = Math.max(0, G.length - B.length);
      let H = Math.abs(G.length - B.length);
      I = Math.max(I, H)
    }
    let W = A.fileStates.get(Y)?.claudeContribution ?? 0,
      K;
    try {
      K = J.statSync(X).mtimeMs
    } catch {
      K = Date.now()
    }
    let V = {
        contentHash: Fz8(G),
        claudeContribution: W + I,
        mtime: K
      },
      F = new Map(A.fileStates);
    return F.set(Y, V), k(`Attribution: Tracked ${I} chars for ${Y} (total: ${V.claudeContribution})`), {
      ...A,
      fileStates: F
    }
  } catch (I) {
    return e(I), A
  }
}
// @from(Ln 192932, Col 0)
function SRB(A, Q, B) {
  return $91(A, Q, "", B, !1)
}
// @from(Ln 192936, Col 0)
function xRB(A, Q, B) {
  let G = E91(Q),
    Y = A.fileStates.get(G)?.claudeContribution ?? 0,
    J = B.length,
    X = Y + J,
    I = {
      contentHash: "",
      claudeContribution: X,
      mtime: Date.now()
    },
    D = new Map(A.fileStates);
  return D.set(G, I), k(`Attribution: Tracked deletion of ${G} (${J} chars removed, total contribution: ${X})`), {
    ...A,
    fileStates: D
  }
}
// @from(Ln 192952, Col 0)
async function oB0(A, Q) {
  let B = vA(),
    G = EQ(),
    Z = q0(),
    Y = {},
    J = [],
    X = new Set,
    I = {},
    D = 0,
    W = 0,
    K = new Map,
    V = new Map;
  for (let $ of A) {
    X.add($.surface);
    let O = $.sessionBaselines instanceof Map ? $.sessionBaselines : new Map(Object.entries($.sessionBaselines ?? {}));
    for (let [M, _] of O)
      if (!V.has(M)) V.set(M, _);
    let L = $.fileStates instanceof Map ? $.fileStates : new Map(Object.entries($.fileStates ?? {}));
    for (let [M, _] of L) {
      let j = K.get(M);
      if (j) K.set(M, {
        ..._,
        claudeContribution: j.claudeContribution + _.claudeContribution
      });
      else K.set(M, _)
    }
  }
  let F = await Promise.all(Q.map(async ($) => {
    if (MRB($)) return {
      type: "generated",
      file: $
    };
    let O = iB0(G, $),
      L = K.get($),
      M = V.get($),
      _ = A[0].surface,
      j = 0,
      x = 0;
    if (await Ez8($))
      if (L) j = L.claudeContribution, x = 0;
      else {
        let f = await jRB($);
        x = f > 0 ? f : 100
      }
    else try {
      let f = B.readFileSync(O, {
        encoding: "utf-8"
      });
      if (L) j = L.claudeContribution, x = 0;
      else if (M) {
        let AA = await jRB($);
        x = AA > 0 ? AA : f.length
      } else x = f.length
    } catch {
      return null
    }
    j = Math.max(0, j), x = Math.max(0, x);
    let S = j + x,
      u = S > 0 ? Math.round(j / S * 100) : 0;
    return {
      type: "file",
      file: $,
      claudeChars: j,
      humanChars: x,
      percent: u,
      surface: _
    }
  }));
  for (let $ of F) {
    if (!$) continue;
    if ($.type === "generated") {
      J.push($.file);
      continue
    }
    Y[$.file] = {
      claudeChars: $.claudeChars,
      humanChars: $.humanChars,
      percent: $.percent,
      surface: $.surface
    }, D += $.claudeChars, W += $.humanChars, I[$.surface] = (I[$.surface] ?? 0) + $.claudeChars
  }
  let H = D + W,
    E = H > 0 ? Math.round(D / H * 100) : 0,
    z = {};
  for (let [$, O] of Object.entries(I)) {
    let L = H > 0 ? Math.round(O / H * 100) : 0;
    z[$] = {
      claudeChars: O,
      percent: L
    }
  }
  return {
    version: 1,
    summary: {
      claudePercent: E,
      claudeChars: D,
      humanChars: W,
      surfaces: Array.from(X)
    },
    files: Y,
    surfaceBreakdown: z,
    excludedGenerated: J,
    sessions: [Z]
  }
}
// @from(Ln 193057, Col 0)
async function jRB(A) {
  let Q = EQ();
  try {
    let B = await J2("git", ["diff", "--cached", "--stat", "--", A], {
      cwd: Q,
      timeout: 5000
    });
    if (B.code !== 0 || !B.stdout) return 0;
    let G = B.stdout.split(`
`).filter(Boolean),
      Z = 0;
    for (let Y of G)
      if (Y.includes("file changed") || Y.includes("files changed")) {
        let J = Y.match(/(\d+) insertions?/),
          X = Y.match(/(\d+) deletions?/),
          I = J ? parseInt(J[1], 10) : 0,
          D = X ? parseInt(X[1], 10) : 0;
        Z += (I + D) * 40
      } return Z
  } catch {
    return 0
  }
}
// @from(Ln 193080, Col 0)
async function Ez8(A) {
  let Q = EQ();
  try {
    let B = await J2("git", ["diff", "--cached", "--name-status", "--", A], {
      cwd: Q,
      timeout: 5000
    });
    if (B.code === 0 && B.stdout) return B.stdout.trim().startsWith("D\t")
  } catch {}
  return !1
}
// @from(Ln 193092, Col 0)
function yRB(A, Q = !1) {
  let B = Object.entries(A.surfaceBreakdown).filter(([Y, J]) => J.percent > 0).sort((Y, J) => J[1].percent - Y[1].percent).map(([Y, J]) => ({
      surface: Q ? Kz8(Y) : Y,
      percent: J.percent
    })),
    G = {};
  for (let Y of B) G[Y.surface] = (G[Y.surface] ?? 0) + Y.percent;
  let Z = Object.entries(G).sort((Y, J) => J[1] - Y[1]).map(([Y, J]) => `${Y}=${J}%`);
  if (Z.length === 0) return "";
  return `Claude-Generated-By: Claude Code (${Z.join(" ")})`
}
// @from(Ln 193103, Col 0)
async function vRB() {
  let A = EQ(),
    Q = vA();
  return (await Promise.all([".git/rebase-merge", ".git/rebase-apply", ".git/MERGE_HEAD", ".git/CHERRY_PICK_HEAD", ".git/BISECT_LOG"].map(async (Z) => {
    let Y = iB0(A, Z);
    return Q.existsSync(Y)
  }))).some((Z) => Z)
}
// @from(Ln 193112, Col 0)
function rB0(A, Q) {
  let B = {};
  for (let [G, Z] of A.fileStates) B[G] = Z;
  return {
    type: "attribution-snapshot",
    messageId: Q,
    surface: A.surface,
    fileStates: B,
    promptCount: A.promptCount,
    promptCountAtLastCommit: A.promptCountAtLastCommit,
    permissionPromptCount: A.permissionPromptCount,
    permissionPromptCountAtLastCommit: A.permissionPromptCountAtLastCommit,
    escapeCount: A.escapeCount,
    escapeCountAtLastCommit: A.escapeCountAtLastCommit
  }
}
// @from(Ln 193128, Col 4)
Wz8
// @from(Ln 193128, Col 9)
zjA = null
// @from(Ln 193129, Col 2)
nB0
// @from(Ln 193130, Col 4)
B2A = w(() => {
  C0();
  DQ();
  T1();
  v1();
  RRB();
  t4();
  l2();
  Wz8 = ["github.com:anthropics/claude-cli-internal", "github.com/anthropics/claude-cli-internal", "github.com:anthropics/anthropic", "github.com/anthropics/anthropic", "github.com:anthropics/apps", "github.com/anthropics/apps", "github.com:anthropics/terraform-config", "github.com/anthropics/terraform-config", "github.com:anthropics/hex-export", "github.com/anthropics/hex-export", "github.com:anthropics/feedback-v2", "github.com/anthropics/feedback-v2"], nB0 = ev(async () => {
    if (zjA !== null) return zjA;
    let A = EQ(),
      Q = await J2("git", ["remote", "get-url", "origin"], {
        cwd: A,
        timeout: 5000
      });
    if (Q.code !== 0) return zjA = !1, !1;
    let B = Q.stdout.trim();
    return zjA = Wz8.some((G) => B.includes(G)), zjA
  })
})
// @from(Ln 193151, Col 0)
function U91(A) {
  let Q = A.toLowerCase();
  return Q === "ultrathink" || Q === "think ultra hard" || Q === "think ultrahard"
}
// @from(Ln 193156, Col 0)
function $jA(A, Q = !1) {
  let B = Q ? $z8 : zz8;
  return B[A % B.length]
}
// @from(Ln 193161, Col 0)
function bRB(A, Q) {
  let B = [],
    G = 0;
  for (let Z of Q) {
    if (Z.start > G) B.push({
      text: A.slice(G, Z.start),
      isTrigger: !1,
      start: G
    });
    B.push({
      text: A.slice(Z.start, Z.end),
      isTrigger: !0,
      start: Z.start
    }), G = Z.end
  }
  if (G < A.length) B.push({
    text: A.slice(G),
    isTrigger: !1,
    start: G
  });
  return B
}
// @from(Ln 193184, Col 0)
function Hm(A, Q) {
  if (process.env.MAX_THINKING_TOKENS) {
    let B = parseInt(process.env.MAX_THINKING_TOKENS, 10);
    if (B > 0) l("tengu_thinking", {
      provider: PT(),
      tokenCount: B
    });
    return B
  }
  return Math.max(...A.filter((B) => B.type === "user" && !B.isMeta).map(qz8), Q ?? 0)
}
// @from(Ln 193196, Col 0)
function Uz8(A) {
  return A === "high" ? sB0.ULTRATHINK : 0
}
// @from(Ln 193200, Col 0)
function qz8(A) {
  if (A.isMeta) return 0;
  if (A.thinkingMetadata) {
    let {
      level: G,
      disabled: Z
    } = A.thinkingMetadata;
    if (Z) return 0;
    let Y = Uz8(G);
    if (Y > 0) l("tengu_thinking", {
      provider: PT(),
      tokenCount: Y
    });
    return Y
  }
  let Q = Nz8(A),
    {
      tokens: B
    } = CjA(Q);
  if (B > 0) l("tengu_thinking", {
    provider: PT(),
    tokenCount: B
  });
  return B
}
// @from(Ln 193226, Col 0)
function Nz8(A) {
  if (typeof A.message.content === "string") return A.message.content;
  return A.message.content.map((Q) => Q.type === "text" ? Q.text : "").join("")
}
// @from(Ln 193231, Col 0)
function CjA(A) {
  let Q = /\bultrathink\b/i.test(A);
  return {
    tokens: Q ? sB0.ULTRATHINK : sB0.NONE,
    level: Q ? "high" : "none"
  }
}
// @from(Ln 193239, Col 0)
function zDA(A) {
  let Q = [],
    B = A.matchAll(Cz8);
  for (let G of B)
    if (G.index !== void 0) Q.push({
      word: G[0],
      start: G.index,
      end: G.index + G[0].length
    });
  return Q
}
// @from(Ln 193251, Col 0)
function wz8(A) {
  let Q = R4();
  if (Q === "foundry" || Q === "firstParty") return !A.toLowerCase().includes("claude-3-");
  let B = A.toLowerCase();
  return B.includes("sonnet-4") || B.includes("opus-4")
}
// @from(Ln 193258, Col 0)
function q91() {
  if (process.env.MAX_THINKING_TOKENS) return parseInt(process.env.MAX_THINKING_TOKENS, 10) > 0;
  let {
    settings: A
  } = kP();
  if (A.alwaysThinkingEnabled === !1) return !1;
  return wz8(B5())
}
// @from(Ln 193266, Col 4)
C91
// @from(Ln 193266, Col 9)
kRB
// @from(Ln 193266, Col 14)
zz8
// @from(Ln 193266, Col 19)
$z8
// @from(Ln 193266, Col 24)
sB0
// @from(Ln 193266, Col 29)
Cz8
// @from(Ln 193267, Col 4)
Y_ = w(() => {
  Z0();
  MD();
  GB();
  l2();
  C91 = {
    none: "text",
    high: "claude"
  }, kRB = {
    none: "promptBorderShimmer",
    high: "claudeShimmer"
  }, zz8 = ["rainbow_red", "rainbow_orange", "rainbow_yellow", "rainbow_green", "rainbow_blue", "rainbow_indigo", "rainbow_violet"], $z8 = ["rainbow_red_shimmer", "rainbow_orange_shimmer", "rainbow_yellow_shimmer", "rainbow_green_shimmer", "rainbow_blue_shimmer", "rainbow_indigo_shimmer", "rainbow_violet_shimmer"];
  sB0 = {
    ULTRATHINK: 31999,
    NONE: 0
  }, Cz8 = /\bultrathink\b/gi
})
// @from(Ln 193285, Col 0)
function tB0(A) {
  switch (A) {
    case "allow":
      return "allowed";
    case "deny":
      return "denied";
    default:
      return "asked for confirmation for"
  }
}
// @from(Ln 193295, Col 4)
eB0 = function () {
  let {
    crypto: A
  } = globalThis;
  if (A?.randomUUID) return eB0 = A.randomUUID.bind(A), A.randomUUID();
  let Q = new Uint8Array(1),
    B = A ? () => A.getRandomValues(Q)[0] : () => Math.random() * 255 & 255;
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (G) => (+G ^ B() & 15 >> +G / 4).toString(16))
}
// @from(Ln 193304, Col 4)
fRB = (A) => new Promise((Q) => setTimeout(Q, A))
// @from(Ln 193305, Col 4)
ia = "0.70.0"
// @from(Ln 193307, Col 0)
function Lz8() {
  if (typeof Deno < "u" && Deno.build != null) return "deno";
  if (typeof EdgeRuntime < "u") return "edge";
  if (Object.prototype.toString.call(typeof globalThis.process < "u" ? globalThis.process : 0) === "[object process]") return "node";
  return "unknown"
}
// @from(Ln 193314, Col 0)
function Mz8() {
  if (typeof navigator > "u" || !navigator) return null;
  let A = [{
    key: "edge",
    pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
  }, {
    key: "ie",
    pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
  }, {
    key: "ie",
    pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/
  }, {
    key: "chrome",
    pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
  }, {
    key: "firefox",
    pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
  }, {
    key: "safari",
    pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/
  }];
  for (let {
      key: Q,
      pattern: B
    }
    of A) {
    let G = B.exec(navigator.userAgent);
    if (G) {
      let Z = G[1] || 0,
        Y = G[2] || 0,
        J = G[3] || 0;
      return {
        browser: Q,
        version: `${Z}.${Y}.${J}`
      }
    }
  }
  return null
}
// @from(Ln 193353, Col 4)
mRB = () => {
    return typeof window < "u" && typeof window.document < "u" && typeof navigator < "u"
  }
// @from(Ln 193356, Col 2)
Oz8 = () => {
    let A = Lz8();
    if (A === "deno") return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": ia,
      "X-Stainless-OS": gRB(Deno.build.os),
      "X-Stainless-Arch": hRB(Deno.build.arch),
      "X-Stainless-Runtime": "deno",
      "X-Stainless-Runtime-Version": typeof Deno.version === "string" ? Deno.version : Deno.version?.deno ?? "unknown"
    };
    if (typeof EdgeRuntime < "u") return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": ia,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": `other:${EdgeRuntime}`,
      "X-Stainless-Runtime": "edge",
      "X-Stainless-Runtime-Version": globalThis.process.version
    };
    if (A === "node") return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": ia,
      "X-Stainless-OS": gRB(globalThis.process.platform ?? "unknown"),
      "X-Stainless-Arch": hRB(globalThis.process.arch ?? "unknown"),
      "X-Stainless-Runtime": "node",
      "X-Stainless-Runtime-Version": globalThis.process.version ?? "unknown"
    };
    let Q = Mz8();
    if (Q) return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": ia,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": "unknown",
      "X-Stainless-Runtime": `browser:${Q.browser}`,
      "X-Stainless-Runtime-Version": Q.version
    };
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": ia,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": "unknown",
      "X-Stainless-Runtime": "unknown",
      "X-Stainless-Runtime-Version": "unknown"
    }
  }
// @from(Ln 193400, Col 2)
hRB = (A) => {
    if (A === "x32") return "x32";
    if (A === "x86_64" || A === "x64") return "x64";
    if (A === "arm") return "arm";
    if (A === "aarch64" || A === "arm64") return "arm64";
    if (A) return `other:${A}`;
    return "unknown"
  }
// @from(Ln 193408, Col 2)
gRB = (A) => {
    if (A = A.toLowerCase(), A.includes("ios")) return "iOS";
    if (A === "android") return "Android";
    if (A === "darwin") return "MacOS";
    if (A === "win32") return "Windows";
    if (A === "freebsd") return "FreeBSD";
    if (A === "openbsd") return "OpenBSD";
    if (A === "linux") return "Linux";
    if (A) return `Other:${A}`;
    return "Unknown"
  }
// @from(Ln 193419, Col 2)
uRB
// @from(Ln 193419, Col 7)
dRB = () => {
    return uRB ?? (uRB = Oz8())
  }
// @from(Ln 193422, Col 4)
A20 = () => {}
// @from(Ln 193423, Col 4)
cRB = ({
  headers: A,
  body: Q
}) => {
  return {
    bodyHeaders: {
      "content-type": "application/json"
    },
    body: JSON.stringify(Q)
  }
}
// @from(Ln 193434, Col 0)
async function N91(A, Q) {
  let {
    response: B,
    requestLogID: G,
    retryOfRequestLogID: Z,
    startTime: Y
  } = Q, J = await (async () => {
    if (Q.options.stream) {
      if (JF(A).debug("response", B.status, B.url, B.headers, B.body), Q.options.__streamClass) return Q.options.__streamClass.fromSSEResponse(B, Q.controller);
      return CC.fromSSEResponse(B, Q.controller)
    }
    if (B.status === 204) return null;
    if (Q.options.__binaryResponse) return B;
    let I = B.headers.get("content-type")?.split(";")[0]?.trim();
    if (I?.includes("application/json") || I?.endsWith("+json")) {
      let K = await B.json();
      return Q20(K, B)
    }
    return await B.text()
  })();
  return JF(A).debug(`[${G}] response parsed`, Am({
    retryOfRequestLogID: Z,
    url: B.url,
    status: B.status,
    body: J,
    durationMs: Date.now() - Y
  })), J
}
// @from(Ln 193463, Col 0)
function Q20(A, Q) {
  if (!A || typeof A !== "object" || Array.isArray(A)) return A;
  return Object.defineProperty(A, "_request_id", {
    value: Q.headers.get("request-id"),
    enumerable: !1
  })
}
// @from(Ln 193470, Col 4)
B20 = w(() => {
  v10();
  YB1()
})
// @from(Ln 193474, Col 4)
UjA
// @from(Ln 193474, Col 9)
G2A
// @from(Ln 193475, Col 4)
w91 = w(() => {
  tu();
  B20();
  G2A = class G2A extends Promise {
    constructor(A, Q, B = N91) {
      super((G) => {
        G(null)
      });
      this.responsePromise = Q, this.parseResponse = B, UjA.set(this, void 0), j2(this, UjA, A, "f")
    }
    _thenUnwrap(A) {
      return new G2A(u0(this, UjA, "f"), this.responsePromise, async (Q, B) => Q20(A(await this.parseResponse(Q, B), B), B.response))
    }
    asResponse() {
      return this.responsePromise.then((A) => A.response)
    }
    async withResponse() {
      let [A, Q] = await Promise.all([this.parse(), this.asResponse()]);
      return {
        data: A,
        response: Q,
        request_id: Q.headers.get("request-id")
      }
    }
    parse() {
      if (!this.parsedPromise) this.parsedPromise = this.responsePromise.then((A) => this.parseResponse(u0(this, UjA, "f"), A));
      return this.parsedPromise
    }
    then(A, Q) {
      return this.parse().then(A, Q)
    } catch (A) {
      return this.parse().catch(A)
    } finally(A) {
      return this.parse().finally(A)
    }
  };
  UjA = new WeakMap
})
// @from(Ln 193513, Col 4)
L91
// @from(Ln 193513, Col 9)
G20
// @from(Ln 193513, Col 14)
O91
// @from(Ln 193513, Col 19)
bP
// @from(Ln 193513, Col 23)
qjA
// @from(Ln 193514, Col 4)
yk = w(() => {
  tu();
  $C();
  B20();
  w91();
  LBA();
  G20 = class G20 {
    constructor(A, Q, B, G) {
      L91.set(this, void 0), j2(this, L91, A, "f"), this.options = G, this.response = Q, this.body = B
    }
    hasNextPage() {
      if (!this.getPaginatedItems().length) return !1;
      return this.nextPageRequestOptions() != null
    }
    async getNextPage() {
      let A = this.nextPageRequestOptions();
      if (!A) throw new M2("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
      return await u0(this, L91, "f").requestAPIList(this.constructor, A)
    }
    async * iterPages() {
      let A = this;
      yield A;
      while (A.hasNextPage()) A = await A.getNextPage(), yield A
    }
    async * [(L91 = new WeakMap, Symbol.asyncIterator)]() {
      for await (let A of this.iterPages()) for (let Q of A.getPaginatedItems()) yield Q
    }
  };
  O91 = class O91 extends G2A {
    constructor(A, Q, B) {
      super(A, Q, async (G, Z) => new B(G, Z.response, await N91(G, Z), Z.options))
    }
    async * [Symbol.asyncIterator]() {
      let A = await this;
      for await (let Q of A) yield Q
    }
  };
  bP = class bP extends G20 {
    constructor(A, Q, B, G) {
      super(A, Q, B, G);
      this.data = B.data || [], this.has_more = B.has_more || !1, this.first_id = B.first_id || null, this.last_id = B.last_id || null
    }
    getPaginatedItems() {
      return this.data ?? []
    }
    hasNextPage() {
      if (this.has_more === !1) return !1;
      return super.hasNextPage()
    }
    nextPageRequestOptions() {
      if (this.options.query?.before_id) {
        let Q = this.first_id;
        if (!Q) return null;
        return {
          ...this.options,
          query: {
            ...QB1(this.options.query),
            before_id: Q
          }
        }
      }
      let A = this.last_id;
      if (!A) return null;
      return {
        ...this.options,
        query: {
          ...QB1(this.options.query),
          after_id: A
        }
      }
    }
  };
  qjA = class qjA extends G20 {
    constructor(A, Q, B, G) {
      super(A, Q, B, G);
      this.data = B.data || [], this.has_more = B.has_more || !1, this.next_page = B.next_page || null
    }
    getPaginatedItems() {
      return this.data ?? []
    }
    hasNextPage() {
      if (this.has_more === !1) return !1;
      return super.hasNextPage()
    }
    nextPageRequestOptions() {
      let A = this.next_page;
      if (!A) return null;
      return {
        ...this.options,
        query: {
          ...QB1(this.options.query),
          page: A
        }
      }
    }
  }
})
// @from(Ln 193612, Col 0)
function Z2A(A, Q, B) {
  return Y20(), new File(A, Q ?? "unknown_file", B)
}
// @from(Ln 193616, Col 0)
function NjA(A) {
  return (typeof A === "object" && A !== null && (("name" in A) && A.name && String(A.name) || ("url" in A) && A.url && String(A.url) || ("filename" in A) && A.filename && String(A.filename) || ("path" in A) && A.path && String(A.path)) || "").split(/[\\/]/).pop() || void 0
}
// @from(Ln 193620, Col 0)
function jz8(A) {
  let Q = typeof A === "function" ? A : A.fetch,
    B = pRB.get(Q);
  if (B) return B;
  let G = (async () => {
    try {
      let Z = "Response" in Q ? Q.Response : (await Q("data:,")).constructor,
        Y = new FormData;
      if (Y.toString() === await new Z(Y).text()) return !1;
      return !0
    } catch {
      return !0
    }
  })();
  return pRB.set(Q, G), G
}
// @from(Ln 193636, Col 4)
Y20 = () => {
    if (typeof File > "u") {
      let {
        process: A
      } = globalThis, Q = typeof A?.versions?.node === "string" && parseInt(A.versions.node.split(".")) < 20;
      throw Error("`File` is not defined as a global, which is required for file uploads." + (Q ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ""))
    }
  }
// @from(Ln 193644, Col 2)
J20 = (A) => A != null && typeof A === "object" && typeof A[Symbol.asyncIterator] === "function"
// @from(Ln 193645, Col 2)
$DA = async (A, Q) => {
    return {
      ...A,
      body: await Tz8(A.body, Q)
    }
  }
// @from(Ln 193650, Col 5)
pRB
// @from(Ln 193650, Col 10)
Tz8 = async (A, Q) => {
    if (!await jz8(Q)) throw TypeError("The provided fetch function does not support file uploads with the current global FormData class.");
    let B = new FormData;
    return await Promise.all(Object.entries(A || {}).map(([G, Z]) => Z20(B, G, Z))), B
  }
// @from(Ln 193654, Col 5)
Pz8 = (A) => A instanceof Blob && ("name" in A)