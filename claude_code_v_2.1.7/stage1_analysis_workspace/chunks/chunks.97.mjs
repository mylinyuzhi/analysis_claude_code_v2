
// @from(Ln 277467, Col 0)
function VE(A, Q, B = 0, G = null, Z = null, Y = !1) {
  switch (A.type) {
    case "blockquote":
      return I1.dim.italic((A.tokens ?? []).map((J) => VE(J, Q, 0, null, null, Y)).join(""));
    case "code": {
      if (Y) return A.text + oz;
      let J = "plaintext";
      if (A.lang)
        if (dY1.supportsLanguage(A.lang)) J = A.lang;
        else k(`Language not supported while highlighting code, falling back to plaintext: ${A.lang}`);
      return dY1.highlight(A.text, {
        language: J
      }) + oz
    }
    case "codespan":
      return sQ("permission", Q)(A.text);
    case "em":
      return I1.italic((A.tokens ?? []).map((J) => VE(J, Q, 0, null, null, Y)).join(""));
    case "strong":
      return I1.bold((A.tokens ?? []).map((J) => VE(J, Q, 0, null, null, Y)).join(""));
    case "heading":
      switch (A.depth) {
        case 1:
          return I1.bold.italic.underline((A.tokens ?? []).map((J) => VE(J, Q, 0, null, null, Y)).join("")) + oz + oz;
        case 2:
          return I1.bold((A.tokens ?? []).map((J) => VE(J, Q, 0, null, null, Y)).join("")) + oz + oz;
        default:
          return I1.bold((A.tokens ?? []).map((J) => VE(J, Q, 0, null, null, Y)).join("")) + oz + oz
      }
    case "hr":
      return "---";
    case "image":
      return A.href;
    case "link": {
      if (A.href.startsWith("mailto:")) return A.href.replace(/^mailto:/, "");
      return lD0(A.href)
    }
    case "list":
      return A.items.map((J, X) => VE(J, Q, B, A.ordered ? A.start + X : null, A, Y)).join("");
    case "list_item":
      return (A.tokens ?? []).map((J) => `${"  ".repeat(B)}${VE(J,Q,B+1,G,A,Y)}`).join("");
    case "paragraph":
      return (A.tokens ?? []).map((J) => VE(J, Q, 0, null, null, Y)).join("") + oz;
    case "space":
      return oz;
    case "br":
      return oz;
    case "text":
      if (Z?.type === "list_item") return `${G===null?"-":WW5(B,G)+"."} ${A.tokens?A.tokens.map((J)=>VE(J,Q,B,G,A,Y)).join(""):A.text}${oz}`;
      else return A.text;
    case "table": {
      let X = function (W) {
          return jZ(W?.map((K) => VE(K, Q, 0, null, null, Y)).join("") ?? "")
        },
        J = A,
        I = J.header.map((W, K) => {
          let V = A9(X(W.tokens));
          for (let F of J.rows) {
            let H = A9(X(F[K]?.tokens));
            V = Math.max(V, H)
          }
          return Math.max(V, 3)
        }),
        D = "| ";
      return J.header.forEach((W, K) => {
        let V = W.tokens?.map(($) => VE($, Q, 0, null, null, Y)).join("") ?? "",
          F = X(W.tokens),
          H = I[K],
          E = J.align?.[K],
          z;
        if (E === "center") {
          let $ = H - A9(F),
            O = Math.floor($ / 2),
            L = $ - O;
          z = " ".repeat(O) + V + " ".repeat(L)
        } else if (E === "right") {
          let $ = H - A9(F);
          z = " ".repeat($) + V
        } else z = V + " ".repeat(H - A9(F));
        D += z + " | "
      }), D = D.trimEnd() + oz, D += "|", I.forEach((W) => {
        let K = "-".repeat(W + 2);
        D += K + "|"
      }), D += oz, J.rows.forEach((W) => {
        D += "| ", W.forEach((K, V) => {
          let F = K.tokens?.map((O) => VE(O, Q, 0, null, null, Y)).join("") ?? "",
            H = X(K.tokens),
            E = I[V],
            z = J.align?.[V],
            $;
          if (z === "center") {
            let O = E - A9(H),
              L = Math.floor(O / 2),
              M = O - L;
            $ = " ".repeat(L) + F + " ".repeat(M)
          } else if (z === "right") {
            let O = E - A9(H);
            $ = " ".repeat(O) + F
          } else $ = F + " ".repeat(E - A9(H));
          D += $ + " | "
        }), D = D.trimEnd() + oz
      }), D + oz
    }
    case "def":
    case "del":
    case "escape":
    case "html":
      return ""
  }
  return ""
}
// @from(Ln 277579, Col 0)
function WW5(A, Q) {
  switch (A) {
    case 0:
    case 1:
      return Q.toString();
    case 2:
      return IW5[Q - 1];
    case 3:
      return DW5[Q - 1];
    default:
      return Q.toString()
  }
}
// @from(Ln 277592, Col 4)
dY1
// @from(Ln 277592, Col 9)
fG2 = !1
// @from(Ln 277593, Col 2)
IW5
// @from(Ln 277593, Col 7)
DW5
// @from(Ln 277594, Col 4)
nD0 = w(() => {
  HY1();
  tQ();
  Z3();
  T1();
  rR();
  fA();
  iD0();
  UC();
  dY1 = c(mY1(), 1);
  IW5 = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "aa", "ab", "ac", "ad", "ae", "af", "ag", "ah", "ai", "aj", "ak", "al", "am", "an", "ao", "ap", "aq", "ar", "as", "at", "au", "av", "aw", "ax", "ay", "az"], DW5 = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii", "xiii", "xiv", "xv", "xvi", "xvii", "xviii", "xix", "xx", "xxi", "xxii", "xxiii", "xxiv", "xxv", "xxvi", "xxvii", "xxviii", "xxix", "xxx", "xxxi", "xxxii", "xxxiii", "xxxiv", "xxxv", "xxxvi", "xxxvii", "xxxviii", "xxxix", "xl"]
})
// @from(Ln 277607, Col 0)
function YU() {
  let [A] = a0();
  return A.settings
}
// @from(Ln 277611, Col 4)
ar = w(() => {
  hB()
})
// @from(Ln 277615, Col 0)
function aD0(A, Q) {
  if (Q <= 0) return [A];
  let B = A.trimEnd(),
    Z = Ra(B, Q, {
      hard: !1,
      trim: !1,
      wordWrap: !0
    }).split(`
`).filter((Y) => Y.length > 0);
  return Z.length > 0 ? Z : [""]
}
// @from(Ln 277627, Col 0)
function gG2({
  token: A,
  syntaxHighlightingDisabled: Q = !1,
  forceWidth: B
}) {
  let [G] = oB(), {
    columns: Z
  } = ZB(), Y = B ?? Z;

  function J(S) {
    return S?.map((u) => VE(u, G, 0, null, null, Q)).join("") ?? ""
  }

  function X(S) {
    return jZ(J(S))
  }

  function I(S) {
    let f = X(S).split(/\s+/).filter((AA) => AA.length > 0);
    if (f.length === 0) return cY1;
    return Math.max(...f.map((AA) => A9(AA)), cY1)
  }

  function D(S) {
    return Math.max(A9(X(S)), cY1)
  }
  let W = A.header.map((S, u) => {
      let f = I(S.tokens);
      for (let AA of A.rows) f = Math.max(f, I(AA[u]?.tokens));
      return f
    }),
    K = A.header.map((S, u) => {
      let f = D(S.tokens);
      for (let AA of A.rows) f = Math.max(f, D(AA[u]?.tokens));
      return f
    }),
    V = A.header.length,
    F = 1 + V * 3,
    H = Math.max(Y - F, V * cY1),
    E = W.reduce((S, u) => S + u, 0),
    z = K.reduce((S, u) => S + u, 0),
    O = E + F > Y,
    L;
  if (O) L = W;
  else if (z <= H) L = K;
  else if (E <= H) {
    let S = H - E,
      u = K.map((AA, n) => AA - W[n]),
      f = u.reduce((AA, n) => AA + n, 0);
    L = W.map((AA, n) => {
      if (f === 0) return AA;
      let y = Math.floor(u[n] / f * S);
      return AA + y
    })
  } else L = W;

  function M(S, u) {
    let f = S.map((p, GA) => {
        let WA = J(p.tokens),
          MA = L[GA];
        return aD0(WA, MA)
      }),
      AA = Math.max(...f.map((p) => p.length), 1),
      n = f.map((p) => Math.floor((AA - p.length) / 2)),
      y = [];
    for (let p = 0; p < AA; p++) {
      let GA = "│";
      for (let WA = 0; WA < S.length; WA++) {
        let MA = f[WA],
          TA = n[WA],
          bA = p - TA,
          jA = bA >= 0 && bA < MA.length ? MA[bA] : "",
          OA = L[WA],
          IA = u ? "center" : A.align?.[WA] ?? "left",
          HA = A9(jA),
          ZA = Math.max(0, OA - HA),
          zA;
        if (IA === "center") {
          let wA = Math.floor(ZA / 2),
            _A = ZA - wA;
          zA = " ".repeat(wA) + jA + " ".repeat(_A)
        } else if (IA === "right") zA = " ".repeat(ZA) + jA;
        else zA = jA + " ".repeat(ZA);
        GA += " " + zA + " │"
      }
      y.push(GA)
    }
    return y
  }

  function _(S) {
    let [u, f, AA, n] = {
      top: ["┌", "─", "┬", "┐"],
      middle: ["├", "─", "┼", "┤"],
      bottom: ["└", "─", "┴", "┘"]
    } [S], y = u;
    return L.forEach((p, GA) => {
      y += f.repeat(p + 2), y += GA < L.length - 1 ? AA : n
    }), y
  }

  function j() {
    let S = [],
      u = A.header.map((y) => X(y.tokens)),
      f = Math.min(Y - 1, 40),
      AA = "─".repeat(f),
      n = "  ";
    return A.rows.forEach((y, p) => {
      if (p > 0) S.push(AA);
      y.forEach((GA, WA) => {
        let MA = u[WA] || `Column ${WA+1}`,
          bA = J(GA.tokens).trimEnd().replace(/\n+/g, " ").replace(/\s+/g, " ").trim(),
          jA = Y - MA.length - 3,
          OA = Y - 2 - 1,
          IA = aD0(bA, Math.max(jA, 10));
        S.push(`${VW5}${MA}:${FW5} ${IA[0]||""}`);
        for (let HA = 1; HA < IA.length; HA++) {
          let ZA = IA[HA];
          if (!ZA.trim()) continue;
          if (A9(ZA) > OA) {
            let zA = aD0(ZA, OA);
            for (let wA of zA)
              if (wA.trim()) S.push(`  ${wA}`)
          } else S.push(`  ${ZA}`)
        }
      })
    }), S.join(`
`)
  }
  if (O) return pY1.default.createElement(M8, null, j());
  let x = [];
  if (x.push(_("top")), x.push(...M(A.header, !0)), x.push(_("middle")), A.rows.forEach((S, u) => {
      if (x.push(...M(S, !1)), u < A.rows.length - 1) x.push(_("middle"))
    }), x.push(_("bottom")), Math.max(...x.map((S) => A9(jZ(S)))) > Y - KW5) return pY1.default.createElement(M8, null, j());
  return pY1.default.createElement(M8, null, x.join(`
`))
}
// @from(Ln 277764, Col 4)
pY1
// @from(Ln 277764, Col 9)
KW5 = 2
// @from(Ln 277765, Col 2)
cY1 = 3
// @from(Ln 277766, Col 2)
VW5 = "\x1B[1m"
// @from(Ln 277767, Col 2)
FW5 = "\x1B[22m"
// @from(Ln 277768, Col 4)
uG2 = w(() => {
  fA();
  P4();
  nD0();
  UC();
  rR();
  SB1();
  pY1 = c(QA(), 1)
})
// @from(Ln 277778, Col 0)
function JV({
  children: A
}) {
  let [Q] = oB(), G = YU().syntaxHighlightingDisabled ?? !1;
  hG2();
  let Z = n7.lexer(nVA(A)),
    Y = [],
    J = "";

  function X() {
    if (J) Y.push(lY1.default.createElement(M8, {
      key: Y.length
    }, J.trim())), J = ""
  }
  for (let I of Z)
    if (I.type === "table") X(), Y.push(lY1.default.createElement(gG2, {
      key: Y.length,
      token: I,
      syntaxHighlightingDisabled: G
    }));
    else J += VE(I, Q, 0, null, null, G);
  return X(), lY1.default.createElement(T, {
    flexDirection: "column"
  }, Y)
}
// @from(Ln 277803, Col 4)
lY1
// @from(Ln 277804, Col 4)
pb = w(() => {
  HY1();
  fA();
  nD0();
  ar();
  tQ();
  uG2();
  lY1 = c(QA(), 1)
})
// @from(Ln 277814, Col 0)
function mG2() {
  return fyA.createElement(x0, {
    height: 1
  }, fyA.createElement(Hb, null))
}
// @from(Ln 277819, Col 4)
fyA
// @from(Ln 277820, Col 4)
dG2 = w(() => {
  NKA();
  c4();
  fyA = c(QA(), 1)
})
// @from(Ln 277826, Col 0)
function iY1({
  plan: A
}) {
  return SS.createElement(x0, null, SS.createElement(T, {
    flexDirection: "column"
  }, SS.createElement(C, {
    color: "subtle"
  }, "User rejected Claude's plan:"), SS.createElement(T, {
    borderStyle: "round",
    borderColor: "planMode",
    borderDimColor: !0,
    paddingX: 1,
    overflow: "hidden"
  }, SS.createElement(JV, null, A))))
}
// @from(Ln 277841, Col 4)
SS
// @from(Ln 277842, Col 4)
oD0 = w(() => {
  fA();
  pb();
  c4();
  SS = c(QA(), 1)
})
// @from(Ln 277849, Col 0)
function cG2({
  feedback: A
}) {
  return hyA.createElement(x0, null, hyA.createElement(C, {
    color: "subtle"
  }, "Tool use rejected with user message: ", A))
}
// @from(Ln 277856, Col 4)
hyA
// @from(Ln 277857, Col 4)
pG2 = w(() => {
  fA();
  c4();
  hyA = c(QA(), 1)
})
// @from(Ln 277863, Col 0)
function lG2({
  progressMessagesForMessage: A,
  tool: Q,
  tools: B,
  param: G,
  verbose: Z
}) {
  if (typeof G.content === "string" && G.content.includes(vN)) return xS.createElement(x0, {
    height: 1
  }, xS.createElement(Hb, null));
  if (typeof G.content === "string" && G.content.startsWith(rD0)) {
    let Y = G.content.substring(rD0.length);
    return xS.createElement(iY1, {
      plan: Y
    })
  }
  if (typeof G.content === "string" && G.content.startsWith(gyA)) {
    let Y = G.content.substring(gyA.length);
    return xS.createElement(cG2, {
      feedback: Y
    })
  }
  if (!Q) return xS.createElement(X5, {
    result: G.content,
    verbose: Z
  });
  return Q.renderToolUseErrorMessage(G.content, {
    progressMessagesForMessage: la(A),
    tools: B,
    verbose: Z
  })
}
// @from(Ln 277895, Col 4)
xS
// @from(Ln 277896, Col 4)
iG2 = w(() => {
  tQ();
  NKA();
  c4();
  eW();
  oD0();
  pG2();
  xS = c(QA(), 1)
})
// @from(Ln 277906, Col 0)
function nG2({
  input: A,
  progressMessagesForMessage: Q,
  style: B,
  tool: G,
  tools: Z,
  messages: Y,
  verbose: J
}) {
  let {
    columns: X
  } = ZB(), [I] = oB();
  if (!G) return uyA.createElement(w7, null);
  let D = G.inputSchema.safeParse(A);
  if (!D.success) return uyA.createElement(w7, null);
  return G.renderToolUseRejectedMessage(D.data, {
    columns: X,
    messages: Y,
    tools: Z,
    verbose: J,
    progressMessagesForMessage: la(Q),
    style: B,
    theme: I
  })
}
// @from(Ln 277931, Col 4)
uyA
// @from(Ln 277932, Col 4)
aG2 = w(() => {
  tH();
  P4();
  fA();
  uyA = c(QA(), 1)
})
// @from(Ln 277938, Col 4)
oG2 = "\x1B[0m\x1B(B"
// @from(Ln 277940, Col 0)
function nY1({
  hookEvent: A,
  messages: Q,
  toolUseID: B,
  verbose: G
}) {
  let Z = rG2(Q, B, A),
    Y = sG2(Q, B, A);
  if (Y === Z) return null;
  return iD.createElement(x0, null, iD.createElement(T, {
    flexDirection: "column"
  }, iD.createElement(T, {
    flexDirection: "row"
  }, iD.createElement(C, {
    dimColor: !0
  }, "Running "), iD.createElement(C, {
    dimColor: !0,
    bold: !0
  }, A), Z === 1 ? iD.createElement(C, {
    dimColor: !0
  }, " hook…") : iD.createElement(C, {
    dimColor: !0
  }, " ", "hooks… (", Y, "/", Z, " done)")), G && iD.createElement(HW5, {
    messages: Q,
    toolUseID: B,
    hookEvent: A
  })))
}
// @from(Ln 277969, Col 0)
function HW5({
  messages: A,
  toolUseID: Q,
  hookEvent: B
}) {
  let G = A.filter((Z) => Z.type === "progress" && Z.data.type === "hook_progress" && Z.data.hookEvent === B && Z.parentToolUseID === Q);
  return iD.createElement(T, {
    flexDirection: "column",
    marginLeft: 2
  }, G.map((Z) => iD.createElement(C, {
    dimColor: !0,
    key: Z.uuid
  }, "· ", Z.data.hookName, ": ", Z.data.command)))
}
// @from(Ln 277983, Col 4)
iD
// @from(Ln 277984, Col 4)
sD0 = w(() => {
  c4();
  fA();
  tQ();
  iD = c(QA(), 1)
})
// @from(Ln 277990, Col 4)
tG2
// @from(Ln 277990, Col 9)
eG2
// @from(Ln 277990, Col 14)
y4A
// @from(Ln 277991, Col 4)
aY1 = w(() => {
  tG2 = c(QA(), 1), eG2 = c(Sg(), 1);
  y4A = class y4A extends tG2.Component {
    constructor(A) {
      super(A);
      this.state = {
        hasError: !1
      }
    }
    static getDerivedStateFromError() {
      return {
        hasError: !0
      }
    }
    componentDidCatch(A) {
      try {
        eG2.captureException(A)
      } catch {}
    }
    render() {
      if (this.state.hasError) return null;
      return this.props.children
    }
  }
})
// @from(Ln 278017, Col 0)
function QZ2({
  message: A,
  messages: Q,
  toolUseID: B,
  progressMessagesForMessage: G,
  style: Z,
  tool: Y,
  tools: J,
  verbose: X,
  width: I
}) {
  let [D] = oB(), W = AZ2.useContext(AN);
  if (!A.toolUseResult || !Y) return null;
  let K = Y.renderToolResultMessage(A.toolUseResult, la(G), {
    style: Z,
    theme: D,
    tools: J,
    verbose: X
  });
  if (K === null) return null;
  return yS.createElement(T, {
    flexDirection: "column"
  }, yS.createElement(T, {
    flexDirection: "row",
    width: I
  }, K, !W && yS.createElement(C, null, oG2)), yS.createElement(y4A, null, yS.createElement(nY1, {
    hookEvent: "PostToolUse",
    messages: Q,
    toolUseID: B,
    verbose: X
  })))
}
// @from(Ln 278049, Col 4)
yS
// @from(Ln 278049, Col 8)
AZ2
// @from(Ln 278050, Col 4)
BZ2 = w(() => {
  fA();
  ba();
  sD0();
  aY1();
  yS = c(QA(), 1), AZ2 = c(QA(), 1)
})
// @from(Ln 278058, Col 0)
function EW5(A, Q) {
  let B = null;
  for (let G of Q) {
    if (G.type !== "assistant" || !Array.isArray(G.message.content)) continue;
    for (let Z of G.message.content)
      if (Z.type === "tool_use" && Z.id === A) B = Z
  }
  return B
}
// @from(Ln 278068, Col 0)
function ZZ2(A, Q, B) {
  return GZ2.useMemo(() => {
    let G = EW5(A, B);
    if (!G) return null;
    let Z = Q.find((Y) => Y.name === G.name);
    if (!Z) return null;
    return {
      tool: Z,
      toolUse: G
    }
  }, [A, B, Q])
}
// @from(Ln 278080, Col 4)
GZ2
// @from(Ln 278081, Col 4)
YZ2 = w(() => {
  GZ2 = c(QA(), 1)
})
// @from(Ln 278085, Col 0)
function JZ2({
  param: A,
  message: Q,
  messages: B,
  progressMessagesForMessage: G,
  style: Z,
  tools: Y,
  verbose: J,
  width: X
}) {
  let I = ZZ2(A.tool_use_id, Y, B);
  if (!I) return null;
  if (A.content === aVA) return ud.createElement(mG2, null);
  if (A.content === v4A || A.content === vN) return ud.createElement(nG2, {
    input: I.toolUse.input,
    progressMessagesForMessage: G,
    tool: I.tool,
    tools: Y,
    messages: B,
    style: Z,
    verbose: J
  });
  if (A.is_error) return ud.createElement(lG2, {
    progressMessagesForMessage: G,
    tool: I.tool,
    tools: Y,
    param: A,
    verbose: J
  });
  return ud.createElement(QZ2, {
    message: Q,
    messages: B,
    toolUseID: I.toolUse.id,
    progressMessagesForMessage: G,
    style: Z,
    tool: I.tool,
    tools: Y,
    verbose: J,
    width: X
  })
}
// @from(Ln 278126, Col 4)
ud
// @from(Ln 278127, Col 4)
XZ2 = w(() => {
  tQ();
  dG2();
  iG2();
  aG2();
  BZ2();
  YZ2();
  ud = c(QA(), 1)
})
// @from(Ln 278136, Col 4)
xJ
// @from(Ln 278136, Col 8)
IZ2 = "✻"
// @from(Ln 278137, Col 4)
vS = w(() => {
  p3();
  xJ = l0.platform === "darwin" ? "⏺" : "●"
})
// @from(Ln 278142, Col 0)
function zW5() {
  let A = new va;
  A.setMaxListeners(100);
  let Q = null,
    B = !0;
  return {
    subscribe(G) {
      if (A.on("blink", G), A.listenerCount("blink") === 1) Q = setInterval(() => {
        B = !B, A.emit("blink")
      }, 600);
      return B
    },
    unsubscribe(G) {
      if (A.off("blink", G), A.listenerCount("blink") === 0 && Q) clearInterval(Q), Q = null
    },
    getCurrentState() {
      return B
    }
  }
}
// @from(Ln 278163, Col 0)
function WZ2(A) {
  let Q = DZ2(),
    [B, G] = oY1.useState(Q.getCurrentState());
  return oY1.useEffect(() => {
    if (!A) return;
    let Z = DZ2(),
      Y = () => G(Z.getCurrentState()),
      J = Z.subscribe(Y);
    return G(J), () => {
      Z.unsubscribe(Y)
    }
  }, [A]), A ? B : !0
}
// @from(Ln 278176, Col 4)
oY1
// @from(Ln 278176, Col 9)
DZ2
// @from(Ln 278177, Col 4)
KZ2 = w(() => {
  fA();
  Y9();
  oY1 = c(QA(), 1);
  DZ2 = W0(zW5)
})
// @from(Ln 278184, Col 0)
function k4A({
  isError: A,
  isUnresolved: Q,
  shouldAnimate: B
}) {
  let G = WZ2(B);
  return tD0.default.createElement(T, {
    minWidth: 2
  }, tD0.default.createElement(C, {
    color: Q ? void 0 : A ? "error" : "success",
    dimColor: Q
  }, !B || G || A || !Q ? xJ : " "))
}
// @from(Ln 278197, Col 4)
tD0
// @from(Ln 278198, Col 4)
rY1 = w(() => {
  fA();
  vS();
  KZ2();
  tD0 = c(QA(), 1)
})
// @from(Ln 278205, Col 0)
function VZ2({
  param: A,
  addMargin: Q,
  tools: B,
  commands: G,
  verbose: Z,
  erroredToolUseIDs: Y,
  inProgressToolUseIDs: J,
  resolvedToolUseIDs: X,
  progressMessagesForMessage: I,
  shouldAnimate: D,
  shouldShowDot: W,
  inProgressToolCallCount: K,
  messages: V
}) {
  let F = ZB(),
    [H] = oB(),
    z = HZ2()?.[0]?.pendingWorkerRequest;
  if (!B) return e(Error(`Tools array is undefined for tool ${A.name}`)), null;
  let $ = B.find((S) => S.name === A.name);
  if (!$) return e(Error(`Tool ${A.name} not found`)), null;
  let O = X.has(A.id),
    L = !J.has(A.id) && !O,
    M = z?.toolUseId === A.id,
    _ = $.inputSchema.safeParse(A.input),
    j = $.userFacingName(_.success ? _.data : void 0),
    x = $.userFacingNameBackgroundColor?.(_.success ? _.data : void 0);
  if (j === "") return null;
  let b = _.success ? $W5($, _.data, {
    theme: H,
    verbose: Z,
    commands: G
  }) : null;
  if (b === null) return null;
  return FE.default.createElement(T, {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Q ? 1 : 0,
    width: "100%"
  }, FE.default.createElement(T, {
    flexDirection: "column"
  }, FE.default.createElement(T, {
    flexDirection: "row",
    flexWrap: "nowrap",
    minWidth: j.length + (W ? 2 : 0)
  }, W && (L ? FE.default.createElement(T, {
    minWidth: 2
  }, FE.default.createElement(C, {
    dimColor: L
  }, xJ)) : FE.default.createElement(k4A, {
    shouldAnimate: D,
    isUnresolved: !O,
    isError: Y.has(A.id)
  })), FE.default.createElement(T, {
    flexShrink: 0
  }, FE.default.createElement(C, {
    bold: !0,
    wrap: "truncate-end",
    backgroundColor: x,
    color: x ? "inverseText" : void 0
  }, j)), b !== "" && FE.default.createElement(T, {
    flexWrap: "nowrap"
  }, FE.default.createElement(C, null, "(", b, ")")), _.success && $.renderToolUseTag && $.renderToolUseTag(_.data)), !O && !L && (M ? FE.default.createElement(x0, {
    height: 1
  }, FE.default.createElement(C, {
    dimColor: !0
  }, "Waiting for permission…")) : CW5($, B, V, A.id, I, {
    verbose: Z,
    inProgressToolCallCount: K
  }, F)), !O && L && UW5($)))
}
// @from(Ln 278277, Col 0)
function $W5(A, Q, {
  theme: B,
  verbose: G,
  commands: Z
}) {
  try {
    let Y = A.inputSchema.safeParse(Q);
    if (!Y.success) return "";
    return A.renderToolUseMessage(Y.data, {
      theme: B,
      verbose: G,
      commands: Z
    })
  } catch (Y) {
    return e(Error(`Error rendering tool use message for ${A.name}: ${Y}`)), ""
  }
}
// @from(Ln 278295, Col 0)
function CW5(A, Q, B, G, Z, {
  verbose: Y,
  inProgressToolCallCount: J
}, X) {
  let I = Z.filter((D) => D.data.type !== "hook_progress");
  try {
    let D = A.renderToolUseProgressMessage(I, {
      tools: Q,
      verbose: Y,
      terminalSize: X,
      inProgressToolCallCount: J ?? 1
    });
    return FE.default.createElement(FE.default.Fragment, null, FE.default.createElement(y4A, null, FE.default.createElement(nY1, {
      hookEvent: "PreToolUse",
      messages: B,
      toolUseID: G,
      verbose: Y
    })), D)
  } catch (D) {
    return e(Error(`Error rendering tool use progress message for ${A.name}: ${D}`)), null
  }
}
// @from(Ln 278318, Col 0)
function UW5(A) {
  try {
    return A.renderToolUseQueuedMessage?.()
  } catch (Q) {
    return e(Error(`Error rendering tool use queued message for ${A.name}: ${Q}`)), null
  }
}
// @from(Ln 278325, Col 4)
FE
// @from(Ln 278326, Col 4)
FZ2 = w(() => {
  fA();
  v1();
  rY1();
  vS();
  P4();
  sD0();
  aY1();
  hB();
  c4();
  FE = c(QA(), 1)
})
// @from(Ln 278339, Col 0)
function b4A({
  children: A
}) {
  let Q = zZ2.useContext(AN);
  return EZ2.default.createElement(T, {
    width: Q ? void 0 : 1000,
    flexShrink: Q ? void 0 : 0
  }, A)
}
// @from(Ln 278348, Col 4)
EZ2
// @from(Ln 278348, Col 9)
zZ2
// @from(Ln 278349, Col 4)
sY1 = w(() => {
  fA();
  ba();
  EZ2 = c(QA(), 1), zZ2 = c(QA(), 1)
})
// @from(Ln 278355, Col 0)
function qW5() {
  if (FQA() === "sonnet") {
    let {
      hasAccess: Q
    } = un();
    if (Q) return {
      alias: "sonnet[1m]",
      name: "Sonnet 1M",
      multiplier: 5
    }
  }
  return null
}
// @from(Ln 278369, Col 0)
function f4A(A) {
  let Q = qW5();
  if (!Q) return null;
  switch (A) {
    case "warning":
      return `/model ${Q.alias} for more context`;
    case "tip":
      return `Tip: You have access to ${Q.name} with ${Q.multiplier}x more context`;
    default:
      return null
  }
}
// @from(Ln 278381, Col 4)
tY1 = w(() => {
  l2();
  QA1()
})
// @from(Ln 278386, Col 0)
class eD0 {
  localServer;
  port = 0;
  promiseResolver = null;
  promiseRejecter = null;
  expectedState = null;
  pendingResponse = null;
  callbackPath;
  constructor(A = "/callback") {
    this.localServer = $Z2.createServer(), this.callbackPath = A
  }
  async start(A) {
    return new Promise((Q, B) => {
      this.localServer.once("error", (G) => {
        B(Error(`Failed to start OAuth callback server: ${G.message}`))
      }), this.localServer.listen(A ?? 0, "localhost", () => {
        let G = this.localServer.address();
        this.port = G.port, Q(this.port)
      })
    })
  }
  getPort() {
    return this.port
  }
  hasPendingResponse() {
    return this.pendingResponse !== null
  }
  async waitForAuthorization(A, Q) {
    return new Promise((B, G) => {
      this.promiseResolver = B, this.promiseRejecter = G, this.expectedState = A, this.startLocalListener(Q)
    })
  }
  handleSuccessRedirect(A, Q) {
    if (!this.pendingResponse) return;
    if (Q) {
      Q(this.pendingResponse, A), this.pendingResponse = null, l("tengu_oauth_automatic_redirect", {
        custom_handler: !0
      });
      return
    }
    let B = xg(A) ? v9().CLAUDEAI_SUCCESS_URL : v9().CONSOLE_SUCCESS_URL;
    this.pendingResponse.writeHead(302, {
      Location: B
    }), this.pendingResponse.end(), this.pendingResponse = null, l("tengu_oauth_automatic_redirect", {})
  }
  handleErrorRedirect() {
    if (!this.pendingResponse) return;
    let A = v9().CLAUDEAI_SUCCESS_URL;
    this.pendingResponse.writeHead(302, {
      Location: A
    }), this.pendingResponse.end(), this.pendingResponse = null, l("tengu_oauth_automatic_redirect_error", {})
  }
  startLocalListener(A) {
    this.localServer.on("request", this.handleRedirect.bind(this)), this.localServer.on("error", this.handleError.bind(this)), A()
  }
  handleRedirect(A, Q) {
    let B = new URL(A.url || "", `http://${A.headers.host||"localhost"}`);
    if (B.pathname !== this.callbackPath) {
      Q.writeHead(404), Q.end();
      return
    }
    let G = B.searchParams.get("code") ?? void 0,
      Z = B.searchParams.get("state") ?? void 0;
    this.validateAndRespond(G, Z, Q)
  }
  validateAndRespond(A, Q, B) {
    if (!A) {
      B.writeHead(400), B.end("Authorization code not found"), this.reject(Error("No authorization code received"));
      return
    }
    if (Q !== this.expectedState) {
      B.writeHead(400), B.end("Invalid state parameter"), this.reject(Error("Invalid state parameter"));
      return
    }
    this.pendingResponse = B, this.resolve(A)
  }
  handleError(A) {
    e(A), this.close(), this.reject(A)
  }
  resolve(A) {
    if (this.promiseResolver) this.promiseResolver(A), this.promiseResolver = null, this.promiseRejecter = null
  }
  reject(A) {
    if (this.promiseRejecter) this.promiseRejecter(A), this.promiseResolver = null, this.promiseRejecter = null
  }
  close() {
    if (this.pendingResponse) this.handleErrorRedirect();
    if (this.localServer) this.localServer.removeAllListeners(), this.localServer.close()
  }
}
// @from(Ln 278476, Col 4)
CZ2 = w(() => {
  JX();
  v1();
  Z0();
  JL()
})
// @from(Ln 278484, Col 0)
function AW0(A) {
  return A.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}
// @from(Ln 278488, Col 0)
function UZ2() {
  return AW0(myA.randomBytes(32))
}
// @from(Ln 278492, Col 0)
function qZ2(A) {
  let Q = myA.createHash("sha256");
  return Q.update(A), AW0(Q.digest())
}
// @from(Ln 278497, Col 0)
function NZ2() {
  return AW0(myA.randomBytes(32))
}
// @from(Ln 278500, Col 4)
wZ2 = () => {}
// @from(Ln 278505, Col 0)
function QW0() {
  if (!process.stdout.isTTY) return;
  eY1(1, uIA), eY1(1, pBA), eY1(1, QDA), eY1(1, TP)
}
// @from(Ln 278510, Col 0)
function f6(A = 0, Q = "other", B) {
  process.exitCode = A, w3(A, Q, B).catch((G) => {
    k(`Graceful shutdown failed: ${G}`, {
      level: "error"
    }), QW0(), process.exit(A)
  })
}
// @from(Ln 278517, Col 0)
async function w3(A = 0, Q = "other", B) {
  process.exitCode = A;
  try {
    let {
      executeSessionEndHooks: G
    } = await Promise.resolve().then(() => (zO(), OZ2));
    await G(Q, B)
  } catch {}
  try {
    let G = (async () => {
      try {
        await Nf0()
      } catch {}
    })();
    await Promise.race([G, new Promise((Z, Y) => setTimeout(() => Y(Error("Cleanup timeout")), 2000))]), await da1(), QW0(), process.exit(A)
  } catch {
    await da1(), QW0(), process.exit(A)
  }
}
// @from(Ln 278536, Col 4)
LZ2
// @from(Ln 278537, Col 4)
yJ = w(() => {
  Y9();
  T1();
  nX();
  FMA();
  lBA();
  wk();
  PL();
  LZ2 = W0(() => {
    process.on("SIGINT", () => {
      OB("info", "shutdown_signal", {
        signal: "SIGINT"
      }), w3(0)
    }), process.on("SIGTERM", () => {
      OB("info", "shutdown_signal", {
        signal: "SIGTERM"
      }), w3(143)
    }), process.on("uncaughtException", (A) => {
      OB("error", "uncaught_exception", {
        error_name: A.name,
        error_message: A.message.slice(0, 2000)
      })
    }), process.on("unhandledRejection", (A) => {
      let Q = A instanceof Error ? {
        error_name: A.name,
        error_message: A.message.slice(0, 2000)
      } : {
        error_message: String(A).slice(0, 2000)
      };
      OB("error", "unhandled_rejection", Q)
    })
  })
})
// @from(Ln 278570, Col 0)
async function AJ1(A) {
  try {
    return await A()
  } catch (Q) {
    if (xQ.isAxiosError(Q) && Q.response?.status === 401) {
      l("tengu_grove_oauth_401_received", {});
      let B = g4()?.accessToken;
      if (B) return await mA1(B), await A()
    }
    throw Q
  }
}
// @from(Ln 278582, Col 0)
async function oVA() {
  try {
    return {
      success: !0,
      data: (await AJ1(() => {
        let Q = CJ();
        if (Q.error) throw Error(`Failed to get auth headers: ${Q.error}`);
        return xQ.get(`${v9().BASE_API_URL}/api/oauth/account/settings`, {
          headers: {
            ...Q.headers,
            "User-Agent": PD()
          }
        })
      })).data
    }
  } catch (A) {
    return e(A), {
      success: !1
    }
  }
}
// @from(Ln 278603, Col 0)
async function BW0() {
  try {
    await AJ1(() => {
      let A = CJ();
      if (A.error) throw Error(`Failed to get auth headers: ${A.error}`);
      return xQ.post(`${v9().BASE_API_URL}/api/oauth/account/grove_notice_viewed`, {}, {
        headers: {
          ...A.headers,
          "User-Agent": PD()
        }
      })
    })
  } catch (A) {
    e(A)
  }
}
// @from(Ln 278619, Col 0)
async function QJ1(A) {
  try {
    await AJ1(() => {
      let Q = CJ();
      if (Q.error) throw Error(`Failed to get auth headers: ${Q.error}`);
      return xQ.patch(`${v9().BASE_API_URL}/api/oauth/account/settings`, {
        grove_enabled: A
      }, {
        headers: {
          ...Q.headers,
          "User-Agent": PD()
        }
      })
    })
  } catch (Q) {
    e(Q)
  }
}
// @from(Ln 278637, Col 0)
async function rVA() {
  if (!dA1()) return !1;
  let A = v3()?.accountUuid;
  if (!A) return !1;
  let B = L1().groveConfigCache?.[A],
    G = Date.now();
  if (!B) return k("Grove: No cache, fetching config in background (dialog skipped this session)"), MZ2(A), !1;
  if (G - B.timestamp > wW5) return k("Grove: Cache stale, returning cached data and refreshing in background"), MZ2(A), B.grove_enabled;
  return k("Grove: Using fresh cached config"), B.grove_enabled
}
// @from(Ln 278647, Col 0)
async function MZ2(A) {
  try {
    let Q = await or();
    if (!Q.success) return;
    let B = Q.data.grove_enabled;
    S0((G) => ({
      ...G,
      groveConfigCache: {
        ...G.groveConfigCache,
        [A]: {
          grove_enabled: B,
          timestamp: Date.now()
        }
      }
    }))
  } catch (Q) {
    k(`Grove: Failed to fetch and store config: ${Q}`)
  }
}
// @from(Ln 278666, Col 4)
wW5 = 86400000
// @from(Ln 278667, Col 2)
or
// @from(Ln 278668, Col 4)
sVA = w(() => {
  j5();
  qz();
  v1();
  JX();
  T1();
  Z0();
  Q2();
  GQ();
  Y9();
  or = W0(async () => {
    try {
      let A = await AJ1(() => {
          let Y = CJ();
          if (Y.error) throw Error(`Failed to get auth headers: ${Y.error}`);
          return xQ.get(`${v9().BASE_API_URL}/api/claude_code_grove`, {
            headers: {
              ...Y.headers,
              "User-Agent": gn()
            },
            timeout: 3000
          })
        }),
        {
          grove_enabled: Q,
          domain_excluded: B,
          notice_is_grace_period: G,
          notice_reminder_frequency: Z
        } = A.data;
      return {
        success: !0,
        data: {
          grove_enabled: Q,
          domain_excluded: B ?? !1,
          notice_is_grace_period: G ?? !0,
          notice_reminder_frequency: Z
        }
      }
    } catch (A) {
      return k(`Failed to fetch Grove notice config: ${A}`), {
        success: !1
      }
    }
  })
})
// @from(Ln 278713, Col 4)
BJ1 = U((RZ2) => {
  Object.defineProperty(RZ2, "__esModule", {
    value: !0
  });
  RZ2.AggregationTemporality = void 0;
  var LW5;
  (function (A) {
    A[A.DELTA = 0] = "DELTA", A[A.CUMULATIVE = 1] = "CUMULATIVE"
  })(LW5 = RZ2.AggregationTemporality || (RZ2.AggregationTemporality = {}))
})
// @from(Ln 278723, Col 4)
rr = U((jZ2) => {
  Object.defineProperty(jZ2, "__esModule", {
    value: !0
  });
  jZ2.DataPointType = jZ2.InstrumentType = void 0;
  var OW5;
  (function (A) {
    A.COUNTER = "COUNTER", A.GAUGE = "GAUGE", A.HISTOGRAM = "HISTOGRAM", A.UP_DOWN_COUNTER = "UP_DOWN_COUNTER", A.OBSERVABLE_COUNTER = "OBSERVABLE_COUNTER", A.OBSERVABLE_GAUGE = "OBSERVABLE_GAUGE", A.OBSERVABLE_UP_DOWN_COUNTER = "OBSERVABLE_UP_DOWN_COUNTER"
  })(OW5 = jZ2.InstrumentType || (jZ2.InstrumentType = {}));
  var MW5;
  (function (A) {
    A[A.HISTOGRAM = 0] = "HISTOGRAM", A[A.EXPONENTIAL_HISTOGRAM = 1] = "EXPONENTIAL_HISTOGRAM", A[A.GAUGE = 2] = "GAUGE", A[A.SUM = 3] = "SUM"
  })(MW5 = jZ2.DataPointType || (jZ2.DataPointType = {}))
})
// @from(Ln 278737, Col 4)
kS = U((TZ2) => {
  Object.defineProperty(TZ2, "__esModule", {
    value: !0
  });
  TZ2.equalsCaseInsensitive = TZ2.binarySearchUB = TZ2.setEquals = TZ2.FlatMap = TZ2.isPromiseAllSettledRejectionResult = TZ2.PromiseAllSettled = TZ2.callWithTimeout = TZ2.TimeoutError = TZ2.instrumentationScopeId = TZ2.hashAttributes = TZ2.isNotNullish = void 0;

  function RW5(A) {
    return A !== void 0 && A !== null
  }
  TZ2.isNotNullish = RW5;

  function _W5(A) {
    let Q = Object.keys(A);
    if (Q.length === 0) return "";
    return Q = Q.sort(), JSON.stringify(Q.map((B) => [B, A[B]]))
  }
  TZ2.hashAttributes = _W5;

  function jW5(A) {
    return `${A.name}:${A.version??""}:${A.schemaUrl??""}`
  }
  TZ2.instrumentationScopeId = jW5;
  class GJ1 extends Error {
    constructor(A) {
      super(A);
      Object.setPrototypeOf(this, GJ1.prototype)
    }
  }
  TZ2.TimeoutError = GJ1;

  function TW5(A, Q) {
    let B, G = new Promise(function (Y, J) {
      B = setTimeout(function () {
        J(new GJ1("Operation timed out."))
      }, Q)
    });
    return Promise.race([A, G]).then((Z) => {
      return clearTimeout(B), Z
    }, (Z) => {
      throw clearTimeout(B), Z
    })
  }
  TZ2.callWithTimeout = TW5;
  async function PW5(A) {
    return Promise.all(A.map(async (Q) => {
      try {
        return {
          status: "fulfilled",
          value: await Q
        }
      } catch (B) {
        return {
          status: "rejected",
          reason: B
        }
      }
    }))
  }
  TZ2.PromiseAllSettled = PW5;

  function SW5(A) {
    return A.status === "rejected"
  }
  TZ2.isPromiseAllSettledRejectionResult = SW5;

  function xW5(A, Q) {
    let B = [];
    return A.forEach((G) => {
      B.push(...Q(G))
    }), B
  }
  TZ2.FlatMap = xW5;

  function yW5(A, Q) {
    if (A.size !== Q.size) return !1;
    for (let B of A)
      if (!Q.has(B)) return !1;
    return !0
  }
  TZ2.setEquals = yW5;

  function vW5(A, Q) {
    let B = 0,
      G = A.length - 1,
      Z = A.length;
    while (G >= B) {
      let Y = B + Math.trunc((G - B) / 2);
      if (A[Y] < Q) B = Y + 1;
      else Z = Y, G = Y - 1
    }
    return Z
  }
  TZ2.binarySearchUB = vW5;

  function kW5(A, Q) {
    return A.toLowerCase() === Q.toLowerCase()
  }
  TZ2.equalsCaseInsensitive = kW5
})
// @from(Ln 278836, Col 4)
tVA = U((SZ2) => {
  Object.defineProperty(SZ2, "__esModule", {
    value: !0
  });
  SZ2.AggregatorKind = void 0;
  var iW5;
  (function (A) {
    A[A.DROP = 0] = "DROP", A[A.SUM = 1] = "SUM", A[A.LAST_VALUE = 2] = "LAST_VALUE", A[A.HISTOGRAM = 3] = "HISTOGRAM", A[A.EXPONENTIAL_HISTOGRAM = 4] = "EXPONENTIAL_HISTOGRAM"
  })(iW5 = SZ2.AggregatorKind || (SZ2.AggregatorKind = {}))
})
// @from(Ln 278846, Col 4)
kZ2 = U((yZ2) => {
  Object.defineProperty(yZ2, "__esModule", {
    value: !0
  });
  yZ2.DropAggregator = void 0;
  var nW5 = tVA();
  class xZ2 {
    kind = nW5.AggregatorKind.DROP;
    createAccumulation() {
      return
    }
    merge(A, Q) {
      return
    }
    diff(A, Q) {
      return
    }
    toMetricData(A, Q, B, G) {
      return
    }
  }
  yZ2.DropAggregator = xZ2
})
// @from(Ln 278869, Col 4)
gZ2 = U((fZ2) => {
  Object.defineProperty(fZ2, "__esModule", {
    value: !0
  });
  fZ2.HistogramAggregator = fZ2.HistogramAccumulation = void 0;
  var aW5 = tVA(),
    dyA = rr(),
    oW5 = kS();

  function rW5(A) {
    let Q = A.map(() => 0);
    return Q.push(0), {
      buckets: {
        boundaries: A,
        counts: Q
      },
      sum: 0,
      count: 0,
      hasMinMax: !1,
      min: 1 / 0,
      max: -1 / 0
    }
  }
  class cyA {
    startTime;
    _boundaries;
    _recordMinMax;
    _current;
    constructor(A, Q, B = !0, G = rW5(Q)) {
      this.startTime = A, this._boundaries = Q, this._recordMinMax = B, this._current = G
    }
    record(A) {
      if (Number.isNaN(A)) return;
      if (this._current.count += 1, this._current.sum += A, this._recordMinMax) this._current.min = Math.min(A, this._current.min), this._current.max = Math.max(A, this._current.max), this._current.hasMinMax = !0;
      let Q = (0, oW5.binarySearchUB)(this._boundaries, A);
      this._current.buckets.counts[Q] += 1
    }
    setStartTime(A) {
      this.startTime = A
    }
    toPointValue() {
      return this._current
    }
  }
  fZ2.HistogramAccumulation = cyA;
  class bZ2 {
    _boundaries;
    _recordMinMax;
    kind = aW5.AggregatorKind.HISTOGRAM;
    constructor(A, Q) {
      this._boundaries = A, this._recordMinMax = Q
    }
    createAccumulation(A) {
      return new cyA(A, this._boundaries, this._recordMinMax)
    }
    merge(A, Q) {
      let B = A.toPointValue(),
        G = Q.toPointValue(),
        Z = B.buckets.counts,
        Y = G.buckets.counts,
        J = Array(Z.length);
      for (let D = 0; D < Z.length; D++) J[D] = Z[D] + Y[D];
      let X = 1 / 0,
        I = -1 / 0;
      if (this._recordMinMax) {
        if (B.hasMinMax && G.hasMinMax) X = Math.min(B.min, G.min), I = Math.max(B.max, G.max);
        else if (B.hasMinMax) X = B.min, I = B.max;
        else if (G.hasMinMax) X = G.min, I = G.max
      }
      return new cyA(A.startTime, B.buckets.boundaries, this._recordMinMax, {
        buckets: {
          boundaries: B.buckets.boundaries,
          counts: J
        },
        count: B.count + G.count,
        sum: B.sum + G.sum,
        hasMinMax: this._recordMinMax && (B.hasMinMax || G.hasMinMax),
        min: X,
        max: I
      })
    }
    diff(A, Q) {
      let B = A.toPointValue(),
        G = Q.toPointValue(),
        Z = B.buckets.counts,
        Y = G.buckets.counts,
        J = Array(Z.length);
      for (let X = 0; X < Z.length; X++) J[X] = Y[X] - Z[X];
      return new cyA(Q.startTime, B.buckets.boundaries, this._recordMinMax, {
        buckets: {
          boundaries: B.buckets.boundaries,
          counts: J
        },
        count: G.count - B.count,
        sum: G.sum - B.sum,
        hasMinMax: !1,
        min: 1 / 0,
        max: -1 / 0
      })
    }
    toMetricData(A, Q, B, G) {
      return {
        descriptor: A,
        aggregationTemporality: Q,
        dataPointType: dyA.DataPointType.HISTOGRAM,
        dataPoints: B.map(([Z, Y]) => {
          let J = Y.toPointValue(),
            X = A.type === dyA.InstrumentType.GAUGE || A.type === dyA.InstrumentType.UP_DOWN_COUNTER || A.type === dyA.InstrumentType.OBSERVABLE_GAUGE || A.type === dyA.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER;
          return {
            attributes: Z,
            startTime: Y.startTime,
            endTime: G,
            value: {
              min: J.hasMinMax ? J.min : void 0,
              max: J.hasMinMax ? J.max : void 0,
              sum: !X ? J.sum : void 0,
              buckets: J.buckets,
              count: J.count
            }
          }
        })
      }
    }
  }
  fZ2.HistogramAggregator = bZ2
})
// @from(Ln 278995, Col 4)
dZ2 = U((uZ2) => {
  Object.defineProperty(uZ2, "__esModule", {
    value: !0
  });
  uZ2.Buckets = void 0;
  class JW0 {
    backing;
    indexBase;
    indexStart;
    indexEnd;
    constructor(A = new XW0, Q = 0, B = 0, G = 0) {
      this.backing = A, this.indexBase = Q, this.indexStart = B, this.indexEnd = G
    }
    get offset() {
      return this.indexStart
    }
    get length() {
      if (this.backing.length === 0) return 0;
      if (this.indexEnd === this.indexStart && this.at(0) === 0) return 0;
      return this.indexEnd - this.indexStart + 1
    }
    counts() {
      return Array.from({
        length: this.length
      }, (A, Q) => this.at(Q))
    }
    at(A) {
      let Q = this.indexBase - this.indexStart;
      if (A < Q) A += this.backing.length;
      return A -= Q, this.backing.countAt(A)
    }
    incrementBucket(A, Q) {
      this.backing.increment(A, Q)
    }
    decrementBucket(A, Q) {
      this.backing.decrement(A, Q)
    }
    trim() {
      for (let A = 0; A < this.length; A++)
        if (this.at(A) !== 0) {
          this.indexStart += A;
          break
        } else if (A === this.length - 1) {
        this.indexStart = this.indexEnd = this.indexBase = 0;
        return
      }
      for (let A = this.length - 1; A >= 0; A--)
        if (this.at(A) !== 0) {
          this.indexEnd -= this.length - A - 1;
          break
        } this._rotate()
    }
    downscale(A) {
      this._rotate();
      let Q = 1 + this.indexEnd - this.indexStart,
        B = 1 << A,
        G = 0,
        Z = 0;
      for (let Y = this.indexStart; Y <= this.indexEnd;) {
        let J = Y % B;
        if (J < 0) J += B;
        for (let X = J; X < B && G < Q; X++) this._relocateBucket(Z, G), G++, Y++;
        Z++
      }
      this.indexStart >>= A, this.indexEnd >>= A, this.indexBase = this.indexStart
    }
    clone() {
      return new JW0(this.backing.clone(), this.indexBase, this.indexStart, this.indexEnd)
    }
    _rotate() {
      let A = this.indexBase - this.indexStart;
      if (A === 0) return;
      else if (A > 0) this.backing.reverse(0, this.backing.length), this.backing.reverse(0, A), this.backing.reverse(A, this.backing.length);
      else this.backing.reverse(0, this.backing.length), this.backing.reverse(0, this.backing.length + A);
      this.indexBase = this.indexStart
    }
    _relocateBucket(A, Q) {
      if (A === Q) return;
      this.incrementBucket(A, this.backing.emptyBucket(Q))
    }
  }
  uZ2.Buckets = JW0;
  class XW0 {
    _counts;
    constructor(A = [0]) {
      this._counts = A
    }
    get length() {
      return this._counts.length
    }
    countAt(A) {
      return this._counts[A]
    }
    growTo(A, Q, B) {
      let G = Array(A).fill(0);
      G.splice(B, this._counts.length - Q, ...this._counts.slice(Q)), G.splice(0, Q, ...this._counts.slice(0, Q)), this._counts = G
    }
    reverse(A, Q) {
      let B = Math.floor((A + Q) / 2) - A;
      for (let G = 0; G < B; G++) {
        let Z = this._counts[A + G];
        this._counts[A + G] = this._counts[Q - G - 1], this._counts[Q - G - 1] = Z
      }
    }
    emptyBucket(A) {
      let Q = this._counts[A];
      return this._counts[A] = 0, Q
    }
    increment(A, Q) {
      this._counts[A] += Q
    }
    decrement(A, Q) {
      if (this._counts[A] >= Q) this._counts[A] -= Q;
      else this._counts[A] = 0
    }
    clone() {
      return new XW0([...this._counts])
    }
  }
})
// @from(Ln 279115, Col 4)
DW0 = U((cZ2) => {
  Object.defineProperty(cZ2, "__esModule", {
    value: !0
  });
  cZ2.getSignificand = cZ2.getNormalBase2 = cZ2.MIN_VALUE = cZ2.MAX_NORMAL_EXPONENT = cZ2.MIN_NORMAL_EXPONENT = cZ2.SIGNIFICAND_WIDTH = void 0;
  cZ2.SIGNIFICAND_WIDTH = 52;
  var tW5 = 2146435072,
    eW5 = 1048575,
    IW0 = 1023;
  cZ2.MIN_NORMAL_EXPONENT = -IW0 + 1;
  cZ2.MAX_NORMAL_EXPONENT = IW0;
  cZ2.MIN_VALUE = Math.pow(2, -1022);

  function AK5(A) {
    let Q = new DataView(new ArrayBuffer(8));
    return Q.setFloat64(0, A), ((Q.getUint32(0) & tW5) >> 20) - IW0
  }
  cZ2.getNormalBase2 = AK5;

  function QK5(A) {
    let Q = new DataView(new ArrayBuffer(8));
    Q.setFloat64(0, A);
    let B = Q.getUint32(0),
      G = Q.getUint32(4);
    return (B & eW5) * Math.pow(2, 32) + G
  }
  cZ2.getSignificand = QK5
})
// @from(Ln 279143, Col 4)
ZJ1 = U((lZ2) => {
  Object.defineProperty(lZ2, "__esModule", {
    value: !0
  });
  lZ2.nextGreaterSquare = lZ2.ldexp = void 0;

  function XK5(A, Q) {
    if (A === 0 || A === Number.POSITIVE_INFINITY || A === Number.NEGATIVE_INFINITY || Number.isNaN(A)) return A;
    return A * Math.pow(2, Q)
  }
  lZ2.ldexp = XK5;

  function IK5(A) {
    return A--, A |= A >> 1, A |= A >> 2, A |= A >> 4, A |= A >> 8, A |= A >> 16, A++, A
  }
  lZ2.nextGreaterSquare = IK5
})
// @from(Ln 279160, Col 4)
YJ1 = U((aZ2) => {
  Object.defineProperty(aZ2, "__esModule", {
    value: !0
  });
  aZ2.MappingError = void 0;
  class nZ2 extends Error {}
  aZ2.MappingError = nZ2
})
// @from(Ln 279168, Col 4)
AY2 = U((tZ2) => {
  Object.defineProperty(tZ2, "__esModule", {
    value: !0
  });
  tZ2.ExponentMapping = void 0;
  var eVA = DW0(),
    WK5 = ZJ1(),
    rZ2 = YJ1();
  class sZ2 {
    _shift;
    constructor(A) {
      this._shift = -A
    }
    mapToIndex(A) {
      if (A < eVA.MIN_VALUE) return this._minNormalLowerBoundaryIndex();
      let Q = eVA.getNormalBase2(A),
        B = this._rightShift(eVA.getSignificand(A) - 1, eVA.SIGNIFICAND_WIDTH);
      return Q + B >> this._shift
    }
    lowerBoundary(A) {
      let Q = this._minNormalLowerBoundaryIndex();
      if (A < Q) throw new rZ2.MappingError(`underflow: ${A} is < minimum lower boundary: ${Q}`);
      let B = this._maxNormalLowerBoundaryIndex();
      if (A > B) throw new rZ2.MappingError(`overflow: ${A} is > maximum lower boundary: ${B}`);
      return WK5.ldexp(1, A << this._shift)
    }
    get scale() {
      if (this._shift === 0) return 0;
      return -this._shift
    }
    _minNormalLowerBoundaryIndex() {
      let A = eVA.MIN_NORMAL_EXPONENT >> this._shift;
      if (this._shift < 2) A--;
      return A
    }
    _maxNormalLowerBoundaryIndex() {
      return eVA.MAX_NORMAL_EXPONENT >> this._shift
    }
    _rightShift(A, Q) {
      return Math.floor(A * Math.pow(2, -Q))
    }
  }
  tZ2.ExponentMapping = sZ2
})
// @from(Ln 279212, Col 4)
JY2 = U((ZY2) => {
  Object.defineProperty(ZY2, "__esModule", {
    value: !0
  });
  ZY2.LogarithmMapping = void 0;
  var AFA = DW0(),
    QY2 = ZJ1(),
    BY2 = YJ1();
  class GY2 {
    _scale;
    _scaleFactor;
    _inverseFactor;
    constructor(A) {
      this._scale = A, this._scaleFactor = QY2.ldexp(Math.LOG2E, A), this._inverseFactor = QY2.ldexp(Math.LN2, -A)
    }
    mapToIndex(A) {
      if (A <= AFA.MIN_VALUE) return this._minNormalLowerBoundaryIndex() - 1;
      if (AFA.getSignificand(A) === 0) return (AFA.getNormalBase2(A) << this._scale) - 1;
      let Q = Math.floor(Math.log(A) * this._scaleFactor),
        B = this._maxNormalLowerBoundaryIndex();
      if (Q >= B) return B;
      return Q
    }
    lowerBoundary(A) {
      let Q = this._maxNormalLowerBoundaryIndex();
      if (A >= Q) {
        if (A === Q) return 2 * Math.exp((A - (1 << this._scale)) / this._scaleFactor);
        throw new BY2.MappingError(`overflow: ${A} is > maximum lower boundary: ${Q}`)
      }
      let B = this._minNormalLowerBoundaryIndex();
      if (A <= B) {
        if (A === B) return AFA.MIN_VALUE;
        else if (A === B - 1) return Math.exp((A + (1 << this._scale)) / this._scaleFactor) / 2;
        throw new BY2.MappingError(`overflow: ${A} is < minimum lower boundary: ${B}`)
      }
      return Math.exp(A * this._inverseFactor)
    }
    get scale() {
      return this._scale
    }
    _minNormalLowerBoundaryIndex() {
      return AFA.MIN_NORMAL_EXPONENT << this._scale
    }
    _maxNormalLowerBoundaryIndex() {
      return (AFA.MAX_NORMAL_EXPONENT + 1 << this._scale) - 1
    }
  }
  ZY2.LogarithmMapping = GY2
})
// @from(Ln 279261, Col 4)
KY2 = U((DY2) => {
  Object.defineProperty(DY2, "__esModule", {
    value: !0
  });
  DY2.getMapping = void 0;
  var KK5 = AY2(),
    VK5 = JY2(),
    FK5 = YJ1(),
    XY2 = -10,
    IY2 = 20,
    HK5 = Array.from({
      length: 31
    }, (A, Q) => {
      if (Q > 10) return new VK5.LogarithmMapping(Q - 10);
      return new KK5.ExponentMapping(Q - 10)
    });

  function EK5(A) {
    if (A > IY2 || A < XY2) throw new FK5.MappingError(`expected scale >= ${XY2} && <= ${IY2}, got: ${A}`);
    return HK5[A + 10]
  }
  DY2.getMapping = EK5
})
// @from(Ln 279284, Col 4)
$Y2 = U((EY2) => {
  Object.defineProperty(EY2, "__esModule", {
    value: !0
  });
  EY2.ExponentialHistogramAggregator = EY2.ExponentialHistogramAccumulation = void 0;
  var zK5 = tVA(),
    pyA = rr(),
    $K5 = p9(),
    VY2 = dZ2(),
    FY2 = KY2(),
    CK5 = ZJ1();
  class QFA {
    low;
    high;
    static combine(A, Q) {
      return new QFA(Math.min(A.low, Q.low), Math.max(A.high, Q.high))
    }
    constructor(A, Q) {
      this.low = A, this.high = Q
    }
  }
  var UK5 = 20,
    qK5 = 160,
    WW0 = 2;
  class JJ1 {
    startTime;
    _maxSize;
    _recordMinMax;
    _sum;
    _count;
    _zeroCount;
    _min;
    _max;
    _positive;
    _negative;
    _mapping;
    constructor(A, Q = qK5, B = !0, G = 0, Z = 0, Y = 0, J = Number.POSITIVE_INFINITY, X = Number.NEGATIVE_INFINITY, I = new VY2.Buckets, D = new VY2.Buckets, W = (0, FY2.getMapping)(UK5)) {
      if (this.startTime = A, this._maxSize = Q, this._recordMinMax = B, this._sum = G, this._count = Z, this._zeroCount = Y, this._min = J, this._max = X, this._positive = I, this._negative = D, this._mapping = W, this._maxSize < WW0) $K5.diag.warn(`Exponential Histogram Max Size set to ${this._maxSize},                 changing to the minimum size of: ${WW0}`), this._maxSize = WW0
    }
    record(A) {
      this.updateByIncrement(A, 1)
    }
    setStartTime(A) {
      this.startTime = A
    }
    toPointValue() {
      return {
        hasMinMax: this._recordMinMax,
        min: this.min,
        max: this.max,
        sum: this.sum,
        positive: {
          offset: this.positive.offset,
          bucketCounts: this.positive.counts()
        },
        negative: {
          offset: this.negative.offset,
          bucketCounts: this.negative.counts()
        },
        count: this.count,
        scale: this.scale,
        zeroCount: this.zeroCount
      }
    }
    get sum() {
      return this._sum
    }
    get min() {
      return this._min
    }
    get max() {
      return this._max
    }
    get count() {
      return this._count
    }
    get zeroCount() {
      return this._zeroCount
    }
    get scale() {
      if (this._count === this._zeroCount) return 0;
      return this._mapping.scale
    }
    get positive() {
      return this._positive
    }
    get negative() {
      return this._negative
    }
    updateByIncrement(A, Q) {
      if (Number.isNaN(A)) return;
      if (A > this._max) this._max = A;
      if (A < this._min) this._min = A;
      if (this._count += Q, A === 0) {
        this._zeroCount += Q;
        return
      }
      if (this._sum += A * Q, A > 0) this._updateBuckets(this._positive, A, Q);
      else this._updateBuckets(this._negative, -A, Q)
    }
    merge(A) {
      if (this._count === 0) this._min = A.min, this._max = A.max;
      else if (A.count !== 0) {
        if (A.min < this.min) this._min = A.min;
        if (A.max > this.max) this._max = A.max
      }
      this.startTime = A.startTime, this._sum += A.sum, this._count += A.count, this._zeroCount += A.zeroCount;
      let Q = this._minScale(A);
      this._downscale(this.scale - Q), this._mergeBuckets(this.positive, A, A.positive, Q), this._mergeBuckets(this.negative, A, A.negative, Q)
    }
    diff(A) {
      this._min = 1 / 0, this._max = -1 / 0, this._sum -= A.sum, this._count -= A.count, this._zeroCount -= A.zeroCount;
      let Q = this._minScale(A);
      this._downscale(this.scale - Q), this._diffBuckets(this.positive, A, A.positive, Q), this._diffBuckets(this.negative, A, A.negative, Q)
    }
    clone() {
      return new JJ1(this.startTime, this._maxSize, this._recordMinMax, this._sum, this._count, this._zeroCount, this._min, this._max, this.positive.clone(), this.negative.clone(), this._mapping)
    }
    _updateBuckets(A, Q, B) {
      let G = this._mapping.mapToIndex(Q),
        Z = !1,
        Y = 0,
        J = 0;
      if (A.length === 0) A.indexStart = G, A.indexEnd = A.indexStart, A.indexBase = A.indexStart;
      else if (G < A.indexStart && A.indexEnd - G >= this._maxSize) Z = !0, J = G, Y = A.indexEnd;
      else if (G > A.indexEnd && G - A.indexStart >= this._maxSize) Z = !0, J = A.indexStart, Y = G;
      if (Z) {
        let X = this._changeScale(Y, J);
        this._downscale(X), G = this._mapping.mapToIndex(Q)
      }
      this._incrementIndexBy(A, G, B)
    }
    _incrementIndexBy(A, Q, B) {
      if (B === 0) return;
      if (A.length === 0) A.indexStart = A.indexEnd = A.indexBase = Q;
      if (Q < A.indexStart) {
        let Z = A.indexEnd - Q;
        if (Z >= A.backing.length) this._grow(A, Z + 1);
        A.indexStart = Q
      } else if (Q > A.indexEnd) {
        let Z = Q - A.indexStart;
        if (Z >= A.backing.length) this._grow(A, Z + 1);
        A.indexEnd = Q
      }
      let G = Q - A.indexBase;
      if (G < 0) G += A.backing.length;
      A.incrementBucket(G, B)
    }
    _grow(A, Q) {
      let B = A.backing.length,
        G = A.indexBase - A.indexStart,
        Z = B - G,
        Y = (0, CK5.nextGreaterSquare)(Q);
      if (Y > this._maxSize) Y = this._maxSize;
      let J = Y - G;
      A.backing.growTo(Y, Z, J)
    }
    _changeScale(A, Q) {
      let B = 0;
      while (A - Q >= this._maxSize) A >>= 1, Q >>= 1, B++;
      return B
    }
    _downscale(A) {
      if (A === 0) return;
      if (A < 0) throw Error(`impossible change of scale: ${this.scale}`);
      let Q = this._mapping.scale - A;
      this._positive.downscale(A), this._negative.downscale(A), this._mapping = (0, FY2.getMapping)(Q)
    }
    _minScale(A) {
      let Q = Math.min(this.scale, A.scale),
        B = QFA.combine(this._highLowAtScale(this.positive, this.scale, Q), this._highLowAtScale(A.positive, A.scale, Q)),
        G = QFA.combine(this._highLowAtScale(this.negative, this.scale, Q), this._highLowAtScale(A.negative, A.scale, Q));
      return Math.min(Q - this._changeScale(B.high, B.low), Q - this._changeScale(G.high, G.low))
    }
    _highLowAtScale(A, Q, B) {
      if (A.length === 0) return new QFA(0, -1);
      let G = Q - B;
      return new QFA(A.indexStart >> G, A.indexEnd >> G)
    }
    _mergeBuckets(A, Q, B, G) {
      let Z = B.offset,
        Y = Q.scale - G;
      for (let J = 0; J < B.length; J++) this._incrementIndexBy(A, Z + J >> Y, B.at(J))
    }
    _diffBuckets(A, Q, B, G) {
      let Z = B.offset,
        Y = Q.scale - G;
      for (let J = 0; J < B.length; J++) {
        let I = (Z + J >> Y) - A.indexBase;
        if (I < 0) I += A.backing.length;
        A.decrementBucket(I, B.at(J))
      }
      A.trim()
    }
  }
  EY2.ExponentialHistogramAccumulation = JJ1;
  class HY2 {
    _maxSize;
    _recordMinMax;
    kind = zK5.AggregatorKind.EXPONENTIAL_HISTOGRAM;
    constructor(A, Q) {
      this._maxSize = A, this._recordMinMax = Q
    }
    createAccumulation(A) {
      return new JJ1(A, this._maxSize, this._recordMinMax)
    }
    merge(A, Q) {
      let B = Q.clone();
      return B.merge(A), B
    }
    diff(A, Q) {
      let B = Q.clone();
      return B.diff(A), B
    }
    toMetricData(A, Q, B, G) {
      return {
        descriptor: A,
        aggregationTemporality: Q,
        dataPointType: pyA.DataPointType.EXPONENTIAL_HISTOGRAM,
        dataPoints: B.map(([Z, Y]) => {
          let J = Y.toPointValue(),
            X = A.type === pyA.InstrumentType.GAUGE || A.type === pyA.InstrumentType.UP_DOWN_COUNTER || A.type === pyA.InstrumentType.OBSERVABLE_GAUGE || A.type === pyA.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER;
          return {
            attributes: Z,
            startTime: Y.startTime,
            endTime: G,
            value: {
              min: J.hasMinMax ? J.min : void 0,
              max: J.hasMinMax ? J.max : void 0,
              sum: !X ? J.sum : void 0,
              positive: {
                offset: J.positive.offset,
                bucketCounts: J.positive.bucketCounts
              },
              negative: {
                offset: J.negative.offset,
                bucketCounts: J.negative.bucketCounts
              },
              count: J.count,
              scale: J.scale,
              zeroCount: J.zeroCount
            }
          }
        })
      }
    }
  }
  EY2.ExponentialHistogramAggregator = HY2
})
// @from(Ln 279533, Col 4)
NY2 = U((UY2) => {
  Object.defineProperty(UY2, "__esModule", {
    value: !0
  });
  UY2.LastValueAggregator = UY2.LastValueAccumulation = void 0;
  var wK5 = tVA(),
    lyA = h8(),
    LK5 = rr();
  class iyA {
    startTime;
    _current;
    sampleTime;
    constructor(A, Q = 0, B = [0, 0]) {
      this.startTime = A, this._current = Q, this.sampleTime = B
    }
    record(A) {
      this._current = A, this.sampleTime = (0, lyA.millisToHrTime)(Date.now())
    }
    setStartTime(A) {
      this.startTime = A
    }
    toPointValue() {
      return this._current
    }
  }
  UY2.LastValueAccumulation = iyA;
  class CY2 {
    kind = wK5.AggregatorKind.LAST_VALUE;
    createAccumulation(A) {
      return new iyA(A)
    }
    merge(A, Q) {
      let B = (0, lyA.hrTimeToMicroseconds)(Q.sampleTime) >= (0, lyA.hrTimeToMicroseconds)(A.sampleTime) ? Q : A;
      return new iyA(A.startTime, B.toPointValue(), B.sampleTime)
    }
    diff(A, Q) {
      let B = (0, lyA.hrTimeToMicroseconds)(Q.sampleTime) >= (0, lyA.hrTimeToMicroseconds)(A.sampleTime) ? Q : A;
      return new iyA(Q.startTime, B.toPointValue(), B.sampleTime)
    }
    toMetricData(A, Q, B, G) {
      return {
        descriptor: A,
        aggregationTemporality: Q,
        dataPointType: LK5.DataPointType.GAUGE,
        dataPoints: B.map(([Z, Y]) => {
          return {
            attributes: Z,
            startTime: Y.startTime,
            endTime: G,
            value: Y.toPointValue()
          }
        })
      }
    }
  }
  UY2.LastValueAggregator = CY2
})
// @from(Ln 279590, Col 4)
MY2 = U((LY2) => {
  Object.defineProperty(LY2, "__esModule", {
    value: !0
  });
  LY2.SumAggregator = LY2.SumAccumulation = void 0;
  var MK5 = tVA(),
    RK5 = rr();
  class h4A {
    startTime;
    monotonic;
    _current;
    reset;
    constructor(A, Q, B = 0, G = !1) {
      this.startTime = A, this.monotonic = Q, this._current = B, this.reset = G
    }
    record(A) {
      if (this.monotonic && A < 0) return;
      this._current += A
    }
    setStartTime(A) {
      this.startTime = A
    }
    toPointValue() {
      return this._current
    }
  }
  LY2.SumAccumulation = h4A;
  class wY2 {
    monotonic;
    kind = MK5.AggregatorKind.SUM;
    constructor(A) {
      this.monotonic = A
    }
    createAccumulation(A) {
      return new h4A(A, this.monotonic)
    }
    merge(A, Q) {
      let B = A.toPointValue(),
        G = Q.toPointValue();
      if (Q.reset) return new h4A(Q.startTime, this.monotonic, G, Q.reset);
      return new h4A(A.startTime, this.monotonic, B + G)
    }
    diff(A, Q) {
      let B = A.toPointValue(),
        G = Q.toPointValue();
      if (this.monotonic && B > G) return new h4A(Q.startTime, this.monotonic, G, !0);
      return new h4A(Q.startTime, this.monotonic, G - B)
    }
    toMetricData(A, Q, B, G) {
      return {
        descriptor: A,
        aggregationTemporality: Q,
        dataPointType: RK5.DataPointType.SUM,
        dataPoints: B.map(([Z, Y]) => {
          return {
            attributes: Z,
            startTime: Y.startTime,
            endTime: G,
            value: Y.toPointValue()
          }
        }),
        isMonotonic: this.monotonic
      }
    }
  }
  LY2.SumAggregator = wY2
})
// @from(Ln 279657, Col 4)
PY2 = U((bS) => {
  Object.defineProperty(bS, "__esModule", {
    value: !0
  });
  bS.SumAggregator = bS.SumAccumulation = bS.LastValueAggregator = bS.LastValueAccumulation = bS.ExponentialHistogramAggregator = bS.ExponentialHistogramAccumulation = bS.HistogramAggregator = bS.HistogramAccumulation = bS.DropAggregator = void 0;
  var jK5 = kZ2();
  Object.defineProperty(bS, "DropAggregator", {
    enumerable: !0,
    get: function () {
      return jK5.DropAggregator
    }
  });
  var RY2 = gZ2();
  Object.defineProperty(bS, "HistogramAccumulation", {
    enumerable: !0,
    get: function () {
      return RY2.HistogramAccumulation
    }
  });
  Object.defineProperty(bS, "HistogramAggregator", {
    enumerable: !0,
    get: function () {
      return RY2.HistogramAggregator
    }
  });
  var _Y2 = $Y2();
  Object.defineProperty(bS, "ExponentialHistogramAccumulation", {
    enumerable: !0,
    get: function () {
      return _Y2.ExponentialHistogramAccumulation
    }
  });
  Object.defineProperty(bS, "ExponentialHistogramAggregator", {
    enumerable: !0,
    get: function () {
      return _Y2.ExponentialHistogramAggregator
    }
  });
  var jY2 = NY2();
  Object.defineProperty(bS, "LastValueAccumulation", {
    enumerable: !0,
    get: function () {
      return jY2.LastValueAccumulation
    }
  });
  Object.defineProperty(bS, "LastValueAggregator", {
    enumerable: !0,
    get: function () {
      return jY2.LastValueAggregator
    }
  });
  var TY2 = MY2();
  Object.defineProperty(bS, "SumAccumulation", {
    enumerable: !0,
    get: function () {
      return TY2.SumAccumulation
    }
  });
  Object.defineProperty(bS, "SumAggregator", {
    enumerable: !0,
    get: function () {
      return TY2.SumAggregator
    }
  })
})
// @from(Ln 279722, Col 4)
fY2 = U((SY2) => {
  Object.defineProperty(SY2, "__esModule", {
    value: !0
  });
  SY2.DEFAULT_AGGREGATION = SY2.EXPONENTIAL_HISTOGRAM_AGGREGATION = SY2.HISTOGRAM_AGGREGATION = SY2.LAST_VALUE_AGGREGATION = SY2.SUM_AGGREGATION = SY2.DROP_AGGREGATION = SY2.DefaultAggregation = SY2.ExponentialHistogramAggregation = SY2.ExplicitBucketHistogramAggregation = SY2.HistogramAggregation = SY2.LastValueAggregation = SY2.SumAggregation = SY2.DropAggregation = void 0;
  var PK5 = p9(),
    g4A = PY2(),
    lb = rr();
  class XJ1 {
    static DEFAULT_INSTANCE = new g4A.DropAggregator;
    createAggregator(A) {
      return XJ1.DEFAULT_INSTANCE
    }
  }
  SY2.DropAggregation = XJ1;
  class nyA {
    static MONOTONIC_INSTANCE = new g4A.SumAggregator(!0);
    static NON_MONOTONIC_INSTANCE = new g4A.SumAggregator(!1);
    createAggregator(A) {
      switch (A.type) {
        case lb.InstrumentType.COUNTER:
        case lb.InstrumentType.OBSERVABLE_COUNTER:
        case lb.InstrumentType.HISTOGRAM:
          return nyA.MONOTONIC_INSTANCE;
        default:
          return nyA.NON_MONOTONIC_INSTANCE
      }
    }
  }
  SY2.SumAggregation = nyA;
  class IJ1 {
    static DEFAULT_INSTANCE = new g4A.LastValueAggregator;
    createAggregator(A) {
      return IJ1.DEFAULT_INSTANCE
    }
  }
  SY2.LastValueAggregation = IJ1;
  class DJ1 {
    static DEFAULT_INSTANCE = new g4A.HistogramAggregator([0, 5, 10, 25, 50, 75, 100, 250, 500, 750, 1000, 2500, 5000, 7500, 1e4], !0);
    createAggregator(A) {
      return DJ1.DEFAULT_INSTANCE
    }
  }
  SY2.HistogramAggregation = DJ1;
  class KW0 {
    _recordMinMax;
    _boundaries;
    constructor(A, Q = !0) {
      if (this._recordMinMax = Q, A == null) throw Error("ExplicitBucketHistogramAggregation should be created with explicit boundaries, if a single bucket histogram is required, please pass an empty array");
      A = A.concat(), A = A.sort((Z, Y) => Z - Y);
      let B = A.lastIndexOf(-1 / 0),
        G = A.indexOf(1 / 0);
      if (G === -1) G = void 0;
      this._boundaries = A.slice(B + 1, G)
    }
    createAggregator(A) {
      return new g4A.HistogramAggregator(this._boundaries, this._recordMinMax)
    }
  }
  SY2.ExplicitBucketHistogramAggregation = KW0;
  class VW0 {
    _maxSize;
    _recordMinMax;
    constructor(A = 160, Q = !0) {
      this._maxSize = A, this._recordMinMax = Q
    }
    createAggregator(A) {
      return new g4A.ExponentialHistogramAggregator(this._maxSize, this._recordMinMax)
    }
  }
  SY2.ExponentialHistogramAggregation = VW0;
  class FW0 {
    _resolve(A) {
      switch (A.type) {
        case lb.InstrumentType.COUNTER:
        case lb.InstrumentType.UP_DOWN_COUNTER:
        case lb.InstrumentType.OBSERVABLE_COUNTER:
        case lb.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
          return SY2.SUM_AGGREGATION;
        case lb.InstrumentType.GAUGE:
        case lb.InstrumentType.OBSERVABLE_GAUGE:
          return SY2.LAST_VALUE_AGGREGATION;
        case lb.InstrumentType.HISTOGRAM: {
          if (A.advice.explicitBucketBoundaries) return new KW0(A.advice.explicitBucketBoundaries);
          return SY2.HISTOGRAM_AGGREGATION
        }
      }
      return PK5.diag.warn(`Unable to recognize instrument type: ${A.type}`), SY2.DROP_AGGREGATION
    }
    createAggregator(A) {
      return this._resolve(A).createAggregator(A)
    }
  }
  SY2.DefaultAggregation = FW0;
  SY2.DROP_AGGREGATION = new XJ1;
  SY2.SUM_AGGREGATION = new nyA;
  SY2.LAST_VALUE_AGGREGATION = new IJ1;
  SY2.HISTOGRAM_AGGREGATION = new DJ1;
  SY2.EXPONENTIAL_HISTOGRAM_AGGREGATION = new VW0;
  SY2.DEFAULT_AGGREGATION = new FW0
})
// @from(Ln 279823, Col 4)
ayA = U((gY2) => {
  Object.defineProperty(gY2, "__esModule", {
    value: !0
  });
  gY2.toAggregation = gY2.AggregationType = void 0;
  var u4A = fY2(),
    m4A;
  (function (A) {
    A[A.DEFAULT = 0] = "DEFAULT", A[A.DROP = 1] = "DROP", A[A.SUM = 2] = "SUM", A[A.LAST_VALUE = 3] = "LAST_VALUE", A[A.EXPLICIT_BUCKET_HISTOGRAM = 4] = "EXPLICIT_BUCKET_HISTOGRAM", A[A.EXPONENTIAL_HISTOGRAM = 5] = "EXPONENTIAL_HISTOGRAM"
  })(m4A = gY2.AggregationType || (gY2.AggregationType = {}));

  function gK5(A) {
    switch (A.type) {
      case m4A.DEFAULT:
        return u4A.DEFAULT_AGGREGATION;
      case m4A.DROP:
        return u4A.DROP_AGGREGATION;
      case m4A.SUM:
        return u4A.SUM_AGGREGATION;
      case m4A.LAST_VALUE:
        return u4A.LAST_VALUE_AGGREGATION;
      case m4A.EXPONENTIAL_HISTOGRAM: {
        let Q = A;
        return new u4A.ExponentialHistogramAggregation(Q.options?.maxSize, Q.options?.recordMinMax)
      }
      case m4A.EXPLICIT_BUCKET_HISTOGRAM: {
        let Q = A;
        if (Q.options == null) return u4A.HISTOGRAM_AGGREGATION;
        else return new u4A.ExplicitBucketHistogramAggregation(Q.options?.boundaries, Q.options?.recordMinMax)
      }
      default:
        throw Error("Unsupported Aggregation")
    }
  }
  gY2.toAggregation = gK5
})
// @from(Ln 279859, Col 4)
HW0 = U((mY2) => {
  Object.defineProperty(mY2, "__esModule", {
    value: !0
  });
  mY2.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = mY2.DEFAULT_AGGREGATION_SELECTOR = void 0;
  var uK5 = BJ1(),
    mK5 = ayA(),
    dK5 = (A) => {
      return {
        type: mK5.AggregationType.DEFAULT
      }
    };
  mY2.DEFAULT_AGGREGATION_SELECTOR = dK5;
  var cK5 = (A) => uK5.AggregationTemporality.CUMULATIVE;
  mY2.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = cK5
})
// @from(Ln 279875, Col 4)
EW0 = U((iY2) => {
  Object.defineProperty(iY2, "__esModule", {
    value: !0
  });
  iY2.MetricReader = void 0;
  var cY2 = p9(),
    WJ1 = kS(),
    pY2 = HW0();
  class lY2 {
    _shutdown = !1;
    _metricProducers;
    _sdkMetricProducer;
    _aggregationTemporalitySelector;
    _aggregationSelector;
    _cardinalitySelector;
    constructor(A) {
      this._aggregationSelector = A?.aggregationSelector ?? pY2.DEFAULT_AGGREGATION_SELECTOR, this._aggregationTemporalitySelector = A?.aggregationTemporalitySelector ?? pY2.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR, this._metricProducers = A?.metricProducers ?? [], this._cardinalitySelector = A?.cardinalitySelector
    }
    setMetricProducer(A) {
      if (this._sdkMetricProducer) throw Error("MetricReader can not be bound to a MeterProvider again.");
      this._sdkMetricProducer = A, this.onInitialized()
    }
    selectAggregation(A) {
      return this._aggregationSelector(A)
    }
    selectAggregationTemporality(A) {
      return this._aggregationTemporalitySelector(A)
    }
    selectCardinalityLimit(A) {
      return this._cardinalitySelector ? this._cardinalitySelector(A) : 2000
    }
    onInitialized() {}
    async collect(A) {
      if (this._sdkMetricProducer === void 0) throw Error("MetricReader is not bound to a MetricProducer");
      if (this._shutdown) throw Error("MetricReader is shutdown");
      let [Q, ...B] = await Promise.all([this._sdkMetricProducer.collect({
        timeoutMillis: A?.timeoutMillis
      }), ...this._metricProducers.map((J) => J.collect({
        timeoutMillis: A?.timeoutMillis
      }))]), G = Q.errors.concat((0, WJ1.FlatMap)(B, (J) => J.errors)), Z = Q.resourceMetrics.resource, Y = Q.resourceMetrics.scopeMetrics.concat((0, WJ1.FlatMap)(B, (J) => J.resourceMetrics.scopeMetrics));
      return {
        resourceMetrics: {
          resource: Z,
          scopeMetrics: Y
        },
        errors: G
      }
    }
    async shutdown(A) {
      if (this._shutdown) {
        cY2.diag.error("Cannot call shutdown twice.");
        return
      }
      if (A?.timeoutMillis == null) await this.onShutdown();
      else await (0, WJ1.callWithTimeout)(this.onShutdown(), A.timeoutMillis);
      this._shutdown = !0
    }
    async forceFlush(A) {
      if (this._shutdown) {
        cY2.diag.warn("Cannot forceFlush on already shutdown MetricReader.");
        return
      }
      if (A?.timeoutMillis == null) {
        await this.onForceFlush();
        return
      }
      await (0, WJ1.callWithTimeout)(this.onForceFlush(), A.timeoutMillis)
    }
  }
  iY2.MetricReader = lY2
})
// @from(Ln 279946, Col 4)
tY2 = U((rY2) => {
  Object.defineProperty(rY2, "__esModule", {
    value: !0
  });
  rY2.PeriodicExportingMetricReader = void 0;
  var zW0 = p9(),
    KJ1 = h8(),
    lK5 = EW0(),
    aY2 = kS();
  class oY2 extends lK5.MetricReader {
    _interval;
    _exporter;
    _exportInterval;
    _exportTimeout;
    constructor(A) {
      super({
        aggregationSelector: A.exporter.selectAggregation?.bind(A.exporter),
        aggregationTemporalitySelector: A.exporter.selectAggregationTemporality?.bind(A.exporter),
        metricProducers: A.metricProducers
      });
      if (A.exportIntervalMillis !== void 0 && A.exportIntervalMillis <= 0) throw Error("exportIntervalMillis must be greater than 0");
      if (A.exportTimeoutMillis !== void 0 && A.exportTimeoutMillis <= 0) throw Error("exportTimeoutMillis must be greater than 0");
      if (A.exportTimeoutMillis !== void 0 && A.exportIntervalMillis !== void 0 && A.exportIntervalMillis < A.exportTimeoutMillis) throw Error("exportIntervalMillis must be greater than or equal to exportTimeoutMillis");
      this._exportInterval = A.exportIntervalMillis ?? 60000, this._exportTimeout = A.exportTimeoutMillis ?? 30000, this._exporter = A.exporter
    }
    async _runOnce() {
      try {
        await (0, aY2.callWithTimeout)(this._doRun(), this._exportTimeout)
      } catch (A) {
        if (A instanceof aY2.TimeoutError) {
          zW0.diag.error("Export took longer than %s milliseconds and timed out.", this._exportTimeout);
          return
        }(0, KJ1.globalErrorHandler)(A)
      }
    }
    async _doRun() {
      let {
        resourceMetrics: A,
        errors: Q
      } = await this.collect({
        timeoutMillis: this._exportTimeout
      });
      if (Q.length > 0) zW0.diag.error("PeriodicExportingMetricReader: metrics collection errors", ...Q);
      if (A.resource.asyncAttributesPending) try {
        await A.resource.waitForAsyncAttributes?.()
      } catch (G) {
        zW0.diag.debug("Error while resolving async portion of resource: ", G), (0, KJ1.globalErrorHandler)(G)
      }
      if (A.scopeMetrics.length === 0) return;
      let B = await KJ1.internal._export(this._exporter, A);
      if (B.code !== KJ1.ExportResultCode.SUCCESS) throw Error(`PeriodicExportingMetricReader: metrics export failed (error ${B.error})`)
    }
    onInitialized() {
      if (this._interval = setInterval(() => {
          this._runOnce()
        }, this._exportInterval), typeof this._interval !== "number") this._interval.unref()
    }
    async onForceFlush() {
      await this._runOnce(), await this._exporter.forceFlush()
    }
    async onShutdown() {
      if (this._interval) clearInterval(this._interval);
      await this.onForceFlush(), await this._exporter.shutdown()
    }
  }
  rY2.PeriodicExportingMetricReader = oY2
})
// @from(Ln 280013, Col 4)
GJ2 = U((QJ2) => {
  Object.defineProperty(QJ2, "__esModule", {
    value: !0
  });
  QJ2.InMemoryMetricExporter = void 0;
  var eY2 = h8();
  class AJ2 {
    _shutdown = !1;
    _aggregationTemporality;
    _metrics = [];
    constructor(A) {
      this._aggregationTemporality = A
    }
    export (A, Q) {
      if (this._shutdown) {
        setTimeout(() => Q({
          code: eY2.ExportResultCode.FAILED
        }), 0);
        return
      }
      this._metrics.push(A), setTimeout(() => Q({
        code: eY2.ExportResultCode.SUCCESS
      }), 0)
    }
    getMetrics() {
      return this._metrics
    }
    forceFlush() {
      return Promise.resolve()
    }
    reset() {
      this._metrics = []
    }
    selectAggregationTemporality(A) {
      return this._aggregationTemporality
    }
    shutdown() {
      return this._shutdown = !0, Promise.resolve()
    }
  }
  QJ2.InMemoryMetricExporter = AJ2
})
// @from(Ln 280055, Col 4)
XJ2 = U((YJ2) => {
  Object.defineProperty(YJ2, "__esModule", {
    value: !0
  });
  YJ2.ConsoleMetricExporter = void 0;
  var ZJ2 = h8(),
    iK5 = HW0();
  class $W0 {
    _shutdown = !1;
    _temporalitySelector;
    constructor(A) {
      this._temporalitySelector = A?.temporalitySelector ?? iK5.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR
    }
    export (A, Q) {
      if (this._shutdown) {
        setImmediate(Q, {
          code: ZJ2.ExportResultCode.FAILED
        });
        return
      }
      return $W0._sendMetrics(A, Q)
    }
    forceFlush() {
      return Promise.resolve()
    }
    selectAggregationTemporality(A) {
      return this._temporalitySelector(A)
    }
    shutdown() {
      return this._shutdown = !0, Promise.resolve()
    }
    static _sendMetrics(A, Q) {
      for (let B of A.scopeMetrics)
        for (let G of B.metrics) console.dir({
          descriptor: G.descriptor,
          dataPointType: G.dataPointType,
          dataPoints: G.dataPoints
        }, {
          depth: null
        });
      Q({
        code: ZJ2.ExportResultCode.SUCCESS
      })
    }
  }
  YJ2.ConsoleMetricExporter = $W0
})
// @from(Ln 280102, Col 4)
KJ2 = U((DJ2) => {
  Object.defineProperty(DJ2, "__esModule", {
    value: !0
  });
  DJ2.ViewRegistry = void 0;
  class IJ2 {
    _registeredViews = [];
    addView(A) {
      this._registeredViews.push(A)
    }
    findViews(A, Q) {
      return this._registeredViews.filter((G) => {
        return this._matchInstrument(G.instrumentSelector, A) && this._matchMeter(G.meterSelector, Q)
      })
    }
    _matchInstrument(A, Q) {
      return (A.getType() === void 0 || Q.type === A.getType()) && A.getNameFilter().match(Q.name) && A.getUnitFilter().match(Q.unit)
    }
    _matchMeter(A, Q) {
      return A.getNameFilter().match(Q.name) && (Q.version === void 0 || A.getVersionFilter().match(Q.version)) && (Q.schemaUrl === void 0 || A.getSchemaUrlFilter().match(Q.schemaUrl))
    }
  }
  DJ2.ViewRegistry = IJ2
})
// @from(Ln 280126, Col 4)
oyA = U((HJ2) => {
  Object.defineProperty(HJ2, "__esModule", {
    value: !0
  });
  HJ2.isValidName = HJ2.isDescriptorCompatibleWith = HJ2.createInstrumentDescriptorWithView = HJ2.createInstrumentDescriptor = void 0;
  var VJ2 = p9(),
    nK5 = kS();

  function aK5(A, Q, B) {
    if (!FJ2(A)) VJ2.diag.warn(`Invalid metric name: "${A}". The metric name should be a ASCII string with a length no greater than 255 characters.`);
    return {
      name: A,
      type: Q,
      description: B?.description ?? "",
      unit: B?.unit ?? "",
      valueType: B?.valueType ?? VJ2.ValueType.DOUBLE,
      advice: B?.advice ?? {}
    }
  }
  HJ2.createInstrumentDescriptor = aK5;

  function oK5(A, Q) {
    return {
      name: A.name ?? Q.name,
      description: A.description ?? Q.description,
      type: Q.type,
      unit: Q.unit,
      valueType: Q.valueType,
      advice: Q.advice
    }
  }
  HJ2.createInstrumentDescriptorWithView = oK5;

  function rK5(A, Q) {
    return (0, nK5.equalsCaseInsensitive)(A.name, Q.name) && A.unit === Q.unit && A.type === Q.type && A.valueType === Q.valueType
  }
  HJ2.isDescriptorCompatibleWith = rK5;
  var sK5 = /^[a-z][a-z0-9_.\-/]{0,254}$/i;

  function FJ2(A) {
    return A.match(sK5) != null
  }
  HJ2.isValidName = FJ2
})
// @from(Ln 280170, Col 4)
VJ1 = U((LJ2) => {
  Object.defineProperty(LJ2, "__esModule", {
    value: !0
  });
  LJ2.isObservableInstrument = LJ2.ObservableUpDownCounterInstrument = LJ2.ObservableGaugeInstrument = LJ2.ObservableCounterInstrument = LJ2.ObservableInstrument = LJ2.HistogramInstrument = LJ2.GaugeInstrument = LJ2.CounterInstrument = LJ2.UpDownCounterInstrument = LJ2.SyncInstrument = void 0;
  var BFA = p9(),
    QV5 = h8();
  class GFA {
    _writableMetricStorage;
    _descriptor;
    constructor(A, Q) {
      this._writableMetricStorage = A, this._descriptor = Q
    }
    _record(A, Q = {}, B = BFA.context.active()) {
      if (typeof A !== "number") {
        BFA.diag.warn(`non-number value provided to metric ${this._descriptor.name}: ${A}`);
        return
      }
      if (this._descriptor.valueType === BFA.ValueType.INT && !Number.isInteger(A)) {
        if (BFA.diag.warn(`INT value type cannot accept a floating-point value for ${this._descriptor.name}, ignoring the fractional digits.`), A = Math.trunc(A), !Number.isInteger(A)) return
      }
      this._writableMetricStorage.record(A, Q, B, (0, QV5.millisToHrTime)(Date.now()))
    }
  }
  LJ2.SyncInstrument = GFA;
  class zJ2 extends GFA {
    add(A, Q, B) {
      this._record(A, Q, B)
    }
  }
  LJ2.UpDownCounterInstrument = zJ2;
  class $J2 extends GFA {
    add(A, Q, B) {
      if (A < 0) {
        BFA.diag.warn(`negative value provided to counter ${this._descriptor.name}: ${A}`);
        return
      }
      this._record(A, Q, B)
    }
  }
  LJ2.CounterInstrument = $J2;
  class CJ2 extends GFA {
    record(A, Q, B) {
      this._record(A, Q, B)
    }
  }
  LJ2.GaugeInstrument = CJ2;
  class UJ2 extends GFA {
    record(A, Q, B) {
      if (A < 0) {
        BFA.diag.warn(`negative value provided to histogram ${this._descriptor.name}: ${A}`);
        return
      }
      this._record(A, Q, B)
    }
  }
  LJ2.HistogramInstrument = UJ2;
  class ZFA {
    _observableRegistry;
    _metricStorages;
    _descriptor;
    constructor(A, Q, B) {
      this._observableRegistry = B, this._descriptor = A, this._metricStorages = Q
    }
    addCallback(A) {
      this._observableRegistry.addCallback(A, this)
    }
    removeCallback(A) {
      this._observableRegistry.removeCallback(A, this)
    }
  }
  LJ2.ObservableInstrument = ZFA;
  class qJ2 extends ZFA {}
  LJ2.ObservableCounterInstrument = qJ2;
  class NJ2 extends ZFA {}
  LJ2.ObservableGaugeInstrument = NJ2;
  class wJ2 extends ZFA {}
  LJ2.ObservableUpDownCounterInstrument = wJ2;

  function BV5(A) {
    return A instanceof ZFA
  }
  LJ2.isObservableInstrument = BV5
})
// @from(Ln 280254, Col 4)
jJ2 = U((RJ2) => {
  Object.defineProperty(RJ2, "__esModule", {
    value: !0
  });
  RJ2.Meter = void 0;
  var d4A = oyA(),
    c4A = VJ1(),
    p4A = rr();
  class MJ2 {
    _meterSharedState;
    constructor(A) {
      this._meterSharedState = A
    }
    createGauge(A, Q) {
      let B = (0, d4A.createInstrumentDescriptor)(A, p4A.InstrumentType.GAUGE, Q),
        G = this._meterSharedState.registerMetricStorage(B);
      return new c4A.GaugeInstrument(G, B)
    }
    createHistogram(A, Q) {
      let B = (0, d4A.createInstrumentDescriptor)(A, p4A.InstrumentType.HISTOGRAM, Q),
        G = this._meterSharedState.registerMetricStorage(B);
      return new c4A.HistogramInstrument(G, B)
    }
    createCounter(A, Q) {
      let B = (0, d4A.createInstrumentDescriptor)(A, p4A.InstrumentType.COUNTER, Q),
        G = this._meterSharedState.registerMetricStorage(B);
      return new c4A.CounterInstrument(G, B)
    }
    createUpDownCounter(A, Q) {
      let B = (0, d4A.createInstrumentDescriptor)(A, p4A.InstrumentType.UP_DOWN_COUNTER, Q),
        G = this._meterSharedState.registerMetricStorage(B);
      return new c4A.UpDownCounterInstrument(G, B)
    }
    createObservableGauge(A, Q) {
      let B = (0, d4A.createInstrumentDescriptor)(A, p4A.InstrumentType.OBSERVABLE_GAUGE, Q),
        G = this._meterSharedState.registerAsyncMetricStorage(B);
      return new c4A.ObservableGaugeInstrument(B, G, this._meterSharedState.observableRegistry)
    }
    createObservableCounter(A, Q) {
      let B = (0, d4A.createInstrumentDescriptor)(A, p4A.InstrumentType.OBSERVABLE_COUNTER, Q),
        G = this._meterSharedState.registerAsyncMetricStorage(B);
      return new c4A.ObservableCounterInstrument(B, G, this._meterSharedState.observableRegistry)
    }
    createObservableUpDownCounter(A, Q) {
      let B = (0, d4A.createInstrumentDescriptor)(A, p4A.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER, Q),
        G = this._meterSharedState.registerAsyncMetricStorage(B);
      return new c4A.ObservableUpDownCounterInstrument(B, G, this._meterSharedState.observableRegistry)
    }
    addBatchObservableCallback(A, Q) {
      this._meterSharedState.observableRegistry.addBatchCallback(A, Q)
    }
    removeBatchObservableCallback(A, Q) {
      this._meterSharedState.observableRegistry.removeBatchCallback(A, Q)
    }
  }
  RJ2.Meter = MJ2
})
// @from(Ln 280311, Col 4)
CW0 = U((PJ2) => {
  Object.defineProperty(PJ2, "__esModule", {
    value: !0
  });
  PJ2.MetricStorage = void 0;
  var VV5 = oyA();
  class TJ2 {
    _instrumentDescriptor;
    constructor(A) {
      this._instrumentDescriptor = A
    }
    getInstrumentDescriptor() {
      return this._instrumentDescriptor
    }
    updateDescription(A) {
      this._instrumentDescriptor = (0, VV5.createInstrumentDescriptor)(this._instrumentDescriptor.name, this._instrumentDescriptor.type, {
        description: A,
        valueType: this._instrumentDescriptor.valueType,
        unit: this._instrumentDescriptor.unit,
        advice: this._instrumentDescriptor.advice
      })
    }
  }
  PJ2.MetricStorage = TJ2
})
// @from(Ln 280336, Col 4)
ryA = U((yJ2) => {
  Object.defineProperty(yJ2, "__esModule", {
    value: !0
  });
  yJ2.AttributeHashMap = yJ2.HashMap = void 0;
  var FV5 = kS();
  class UW0 {
    _hash;
    _valueMap = new Map;
    _keyMap = new Map;
    constructor(A) {
      this._hash = A
    }
    get(A, Q) {
      return Q ??= this._hash(A), this._valueMap.get(Q)
    }
    getOrDefault(A, Q) {
      let B = this._hash(A);
      if (this._valueMap.has(B)) return this._valueMap.get(B);
      let G = Q();
      if (!this._keyMap.has(B)) this._keyMap.set(B, A);
      return this._valueMap.set(B, G), G
    }
    set(A, Q, B) {
      if (B ??= this._hash(A), !this._keyMap.has(B)) this._keyMap.set(B, A);
      this._valueMap.set(B, Q)
    }
    has(A, Q) {
      return Q ??= this._hash(A), this._valueMap.has(Q)
    }* keys() {
      let A = this._keyMap.entries(),
        Q = A.next();
      while (Q.done !== !0) yield [Q.value[1], Q.value[0]], Q = A.next()
    }* entries() {
      let A = this._valueMap.entries(),
        Q = A.next();
      while (Q.done !== !0) yield [this._keyMap.get(Q.value[0]), Q.value[1], Q.value[0]], Q = A.next()
    }
    get size() {
      return this._valueMap.size
    }
  }
  yJ2.HashMap = UW0;
  class xJ2 extends UW0 {
    constructor() {
      super(FV5.hashAttributes)
    }
  }
  yJ2.AttributeHashMap = xJ2
})
// @from(Ln 280386, Col 4)
NW0 = U((bJ2) => {
  Object.defineProperty(bJ2, "__esModule", {
    value: !0
  });
  bJ2.DeltaMetricProcessor = void 0;
  var EV5 = kS(),
    qW0 = ryA();
  class kJ2 {
    _aggregator;
    _activeCollectionStorage = new qW0.AttributeHashMap;
    _cumulativeMemoStorage = new qW0.AttributeHashMap;
    _cardinalityLimit;
    _overflowAttributes = {
      "otel.metric.overflow": !0
    };
    _overflowHashCode;
    constructor(A, Q) {
      this._aggregator = A, this._cardinalityLimit = (Q ?? 2000) - 1, this._overflowHashCode = (0, EV5.hashAttributes)(this._overflowAttributes)
    }
    record(A, Q, B, G) {
      let Z = this._activeCollectionStorage.get(Q);
      if (!Z) {
        if (this._activeCollectionStorage.size >= this._cardinalityLimit) {
          this._activeCollectionStorage.getOrDefault(this._overflowAttributes, () => this._aggregator.createAccumulation(G))?.record(A);
          return
        }
        Z = this._aggregator.createAccumulation(G), this._activeCollectionStorage.set(Q, Z)
      }
      Z?.record(A)
    }
    batchCumulate(A, Q) {
      Array.from(A.entries()).forEach(([B, G, Z]) => {
        let Y = this._aggregator.createAccumulation(Q);
        Y?.record(G);
        let J = Y;
        if (this._cumulativeMemoStorage.has(B, Z)) {
          let X = this._cumulativeMemoStorage.get(B, Z);
          J = this._aggregator.diff(X, Y)
        } else if (this._cumulativeMemoStorage.size >= this._cardinalityLimit) {
          if (B = this._overflowAttributes, Z = this._overflowHashCode, this._cumulativeMemoStorage.has(B, Z)) {
            let X = this._cumulativeMemoStorage.get(B, Z);
            J = this._aggregator.diff(X, Y)
          }
        }
        if (this._activeCollectionStorage.has(B, Z)) {
          let X = this._activeCollectionStorage.get(B, Z);
          J = this._aggregator.merge(X, J)
        }
        this._cumulativeMemoStorage.set(B, Y, Z), this._activeCollectionStorage.set(B, J, Z)
      })
    }
    collect() {
      let A = this._activeCollectionStorage;
      return this._activeCollectionStorage = new qW0.AttributeHashMap, A
    }
  }
  bJ2.DeltaMetricProcessor = kJ2
})
// @from(Ln 280444, Col 4)
wW0 = U((hJ2) => {
  Object.defineProperty(hJ2, "__esModule", {
    value: !0
  });
  hJ2.TemporalMetricProcessor = void 0;
  var zV5 = BJ1(),
    $V5 = ryA();
  class syA {
    _aggregator;
    _unreportedAccumulations = new Map;
    _reportHistory = new Map;
    constructor(A, Q) {
      this._aggregator = A, Q.forEach((B) => {
        this._unreportedAccumulations.set(B, [])
      })
    }
    buildMetrics(A, Q, B, G) {
      this._stashAccumulations(B);
      let Z = this._getMergedUnreportedAccumulations(A),
        Y = Z,
        J;
      if (this._reportHistory.has(A)) {
        let I = this._reportHistory.get(A),
          D = I.collectionTime;
        if (J = I.aggregationTemporality, J === zV5.AggregationTemporality.CUMULATIVE) Y = syA.merge(I.accumulations, Z, this._aggregator);
        else Y = syA.calibrateStartTime(I.accumulations, Z, D)
      } else J = A.selectAggregationTemporality(Q.type);
      this._reportHistory.set(A, {
        accumulations: Y,
        collectionTime: G,
        aggregationTemporality: J
      });
      let X = CV5(Y);
      if (X.length === 0) return;
      return this._aggregator.toMetricData(Q, J, X, G)
    }
    _stashAccumulations(A) {
      let Q = this._unreportedAccumulations.keys();
      for (let B of Q) {
        let G = this._unreportedAccumulations.get(B);
        if (G === void 0) G = [], this._unreportedAccumulations.set(B, G);
        G.push(A)
      }
    }
    _getMergedUnreportedAccumulations(A) {
      let Q = new $V5.AttributeHashMap,
        B = this._unreportedAccumulations.get(A);
      if (this._unreportedAccumulations.set(A, []), B === void 0) return Q;
      for (let G of B) Q = syA.merge(Q, G, this._aggregator);
      return Q
    }
    static merge(A, Q, B) {
      let G = A,
        Z = Q.entries(),
        Y = Z.next();
      while (Y.done !== !0) {
        let [J, X, I] = Y.value;
        if (A.has(J, I)) {
          let D = A.get(J, I),
            W = B.merge(D, X);
          G.set(J, W, I)
        } else G.set(J, X, I);
        Y = Z.next()
      }
      return G
    }
    static calibrateStartTime(A, Q, B) {
      for (let [G, Z] of A.keys()) Q.get(G, Z)?.setStartTime(B);
      return Q
    }
  }
  hJ2.TemporalMetricProcessor = syA;

  function CV5(A) {
    return Array.from(A.entries())
  }
})
// @from(Ln 280521, Col 4)
cJ2 = U((mJ2) => {
  Object.defineProperty(mJ2, "__esModule", {
    value: !0
  });
  mJ2.AsyncMetricStorage = void 0;
  var UV5 = CW0(),
    qV5 = NW0(),
    NV5 = wW0(),
    wV5 = ryA();
  class uJ2 extends UV5.MetricStorage {
    _attributesProcessor;
    _aggregationCardinalityLimit;
    _deltaMetricStorage;
    _temporalMetricStorage;
    constructor(A, Q, B, G, Z) {
      super(A);
      this._attributesProcessor = B, this._aggregationCardinalityLimit = Z, this._deltaMetricStorage = new qV5.DeltaMetricProcessor(Q, this._aggregationCardinalityLimit), this._temporalMetricStorage = new NV5.TemporalMetricProcessor(Q, G)
    }
    record(A, Q) {
      let B = new wV5.AttributeHashMap;
      Array.from(A.entries()).forEach(([G, Z]) => {
        B.set(this._attributesProcessor.process(G), Z)
      }), this._deltaMetricStorage.batchCumulate(B, Q)
    }
    collect(A, Q) {
      let B = this._deltaMetricStorage.collect();
      return this._temporalMetricStorage.buildMetrics(A, this._instrumentDescriptor, B, Q)
    }
  }
  mJ2.AsyncMetricStorage = uJ2
})
// @from(Ln 280552, Col 4)
rJ2 = U((aJ2) => {
  Object.defineProperty(aJ2, "__esModule", {
    value: !0
  });
  aJ2.getConflictResolutionRecipe = aJ2.getDescriptionResolutionRecipe = aJ2.getTypeConflictResolutionRecipe = aJ2.getUnitConflictResolutionRecipe = aJ2.getValueTypeConflictResolutionRecipe = aJ2.getIncompatibilityDetails = void 0;

  function LV5(A, Q) {
    let B = "";
    if (A.unit !== Q.unit) B += `	- Unit '${A.unit}' does not match '${Q.unit}'
`;
    if (A.type !== Q.type) B += `	- Type '${A.type}' does not match '${Q.type}'
`;
    if (A.valueType !== Q.valueType) B += `	- Value Type '${A.valueType}' does not match '${Q.valueType}'
`;
    if (A.description !== Q.description) B += `	- Description '${A.description}' does not match '${Q.description}'
`;
    return B
  }
  aJ2.getIncompatibilityDetails = LV5;

  function pJ2(A, Q) {
    return `	- use valueType '${A.valueType}' on instrument creation or use an instrument name other than '${Q.name}'`
  }
  aJ2.getValueTypeConflictResolutionRecipe = pJ2;

  function lJ2(A, Q) {
    return `	- use unit '${A.unit}' on instrument creation or use an instrument name other than '${Q.name}'`
  }
  aJ2.getUnitConflictResolutionRecipe = lJ2;

  function iJ2(A, Q) {
    let B = {
        name: Q.name,
        type: Q.type,
        unit: Q.unit
      },
      G = JSON.stringify(B);
    return `	- create a new view with a name other than '${A.name}' and InstrumentSelector '${G}'`
  }
  aJ2.getTypeConflictResolutionRecipe = iJ2;

  function nJ2(A, Q) {
    let B = {
        name: Q.name,
        type: Q.type,
        unit: Q.unit
      },
      G = JSON.stringify(B);
    return `	- create a new view with a name other than '${A.name}' and InstrumentSelector '${G}'
    	- OR - create a new view with the name ${A.name} and description '${A.description}' and InstrumentSelector ${G}
    	- OR - create a new view with the name ${Q.name} and description '${A.description}' and InstrumentSelector ${G}`
  }
  aJ2.getDescriptionResolutionRecipe = nJ2;

  function OV5(A, Q) {
    if (A.valueType !== Q.valueType) return pJ2(A, Q);
    if (A.unit !== Q.unit) return lJ2(A, Q);
    if (A.type !== Q.type) return iJ2(A, Q);
    if (A.description !== Q.description) return nJ2(A, Q);
    return ""
  }
  aJ2.getConflictResolutionRecipe = OV5
})
// @from(Ln 280615, Col 4)
AX2 = U((tJ2) => {
  Object.defineProperty(tJ2, "__esModule", {
    value: !0
  });
  tJ2.MetricStorageRegistry = void 0;
  var PV5 = oyA(),
    sJ2 = p9(),
    FJ1 = rJ2();
  class LW0 {
    _sharedRegistry = new Map;
    _perCollectorRegistry = new Map;
    static create() {
      return new LW0
    }
    getStorages(A) {
      let Q = [];
      for (let G of this._sharedRegistry.values()) Q = Q.concat(G);
      let B = this._perCollectorRegistry.get(A);
      if (B != null)
        for (let G of B.values()) Q = Q.concat(G);
      return Q
    }
    register(A) {
      this._registerStorage(A, this._sharedRegistry)
    }
    registerForCollector(A, Q) {
      let B = this._perCollectorRegistry.get(A);
      if (B == null) B = new Map, this._perCollectorRegistry.set(A, B);
      this._registerStorage(Q, B)
    }
    findOrUpdateCompatibleStorage(A) {
      let Q = this._sharedRegistry.get(A.name);
      if (Q === void 0) return null;
      return this._findOrUpdateCompatibleStorage(A, Q)
    }
    findOrUpdateCompatibleCollectorStorage(A, Q) {
      let B = this._perCollectorRegistry.get(A);
      if (B === void 0) return null;
      let G = B.get(Q.name);
      if (G === void 0) return null;
      return this._findOrUpdateCompatibleStorage(Q, G)
    }
    _registerStorage(A, Q) {
      let B = A.getInstrumentDescriptor(),
        G = Q.get(B.name);
      if (G === void 0) {
        Q.set(B.name, [A]);
        return
      }
      G.push(A)
    }
    _findOrUpdateCompatibleStorage(A, Q) {
      let B = null;
      for (let G of Q) {
        let Z = G.getInstrumentDescriptor();
        if ((0, PV5.isDescriptorCompatibleWith)(Z, A)) {
          if (Z.description !== A.description) {
            if (A.description.length > Z.description.length) G.updateDescription(A.description);
            sJ2.diag.warn("A view or instrument with the name ", A.name, ` has already been registered, but has a different description and is incompatible with another registered view.
`, `Details:
`, (0, FJ1.getIncompatibilityDetails)(Z, A), `The longer description will be used.
To resolve the conflict:`, (0, FJ1.getConflictResolutionRecipe)(Z, A))
          }
          B = G
        } else sJ2.diag.warn("A view or instrument with the name ", A.name, ` has already been registered and is incompatible with another registered view.
`, `Details:
`, (0, FJ1.getIncompatibilityDetails)(Z, A), `To resolve the conflict:
`, (0, FJ1.getConflictResolutionRecipe)(Z, A))
      }
      return B
    }
  }
  tJ2.MetricStorageRegistry = LW0
})
// @from(Ln 280689, Col 4)
ZX2 = U((BX2) => {
  Object.defineProperty(BX2, "__esModule", {
    value: !0
  });
  BX2.MultiMetricStorage = void 0;
  class QX2 {
    _backingStorages;
    constructor(A) {
      this._backingStorages = A
    }
    record(A, Q, B, G) {
      this._backingStorages.forEach((Z) => {
        Z.record(A, Q, B, G)
      })
    }
  }
  BX2.MultiMetricStorage = QX2
})
// @from(Ln 280707, Col 4)
WX2 = U((IX2) => {
  Object.defineProperty(IX2, "__esModule", {
    value: !0
  });
  IX2.BatchObservableResultImpl = IX2.ObservableResultImpl = void 0;
  var YFA = p9(),
    YX2 = ryA(),
    SV5 = VJ1();
  class JX2 {
    _instrumentName;
    _valueType;
    _buffer = new YX2.AttributeHashMap;
    constructor(A, Q) {
      this._instrumentName = A, this._valueType = Q
    }
    observe(A, Q = {}) {
      if (typeof A !== "number") {
        YFA.diag.warn(`non-number value provided to metric ${this._instrumentName}: ${A}`);
        return
      }
      if (this._valueType === YFA.ValueType.INT && !Number.isInteger(A)) {
        if (YFA.diag.warn(`INT value type cannot accept a floating-point value for ${this._instrumentName}, ignoring the fractional digits.`), A = Math.trunc(A), !Number.isInteger(A)) return
      }
      this._buffer.set(Q, A)
    }
  }
  IX2.ObservableResultImpl = JX2;
  class XX2 {
    _buffer = new Map;
    observe(A, Q, B = {}) {
      if (!(0, SV5.isObservableInstrument)(A)) return;
      let G = this._buffer.get(A);
      if (G == null) G = new YX2.AttributeHashMap, this._buffer.set(A, G);
      if (typeof Q !== "number") {
        YFA.diag.warn(`non-number value provided to metric ${A._descriptor.name}: ${Q}`);
        return
      }
      if (A._descriptor.valueType === YFA.ValueType.INT && !Number.isInteger(Q)) {
        if (YFA.diag.warn(`INT value type cannot accept a floating-point value for ${A._descriptor.name}, ignoring the fractional digits.`), Q = Math.trunc(Q), !Number.isInteger(Q)) return
      }
      G.set(B, Q)
    }
  }
  IX2.BatchObservableResultImpl = XX2
})
// @from(Ln 280752, Col 4)
zX2 = U((HX2) => {
  Object.defineProperty(HX2, "__esModule", {
    value: !0
  });
  HX2.ObservableRegistry = void 0;
  var yV5 = p9(),
    KX2 = VJ1(),
    VX2 = WX2(),
    tyA = kS();
  class FX2 {
    _callbacks = [];
    _batchCallbacks = [];
    addCallback(A, Q) {
      if (this._findCallback(A, Q) >= 0) return;
      this._callbacks.push({
        callback: A,
        instrument: Q
      })
    }
    removeCallback(A, Q) {
      let B = this._findCallback(A, Q);
      if (B < 0) return;
      this._callbacks.splice(B, 1)
    }
    addBatchCallback(A, Q) {
      let B = new Set(Q.filter(KX2.isObservableInstrument));
      if (B.size === 0) {
        yV5.diag.error("BatchObservableCallback is not associated with valid instruments", Q);
        return
      }
      if (this._findBatchCallback(A, B) >= 0) return;
      this._batchCallbacks.push({
        callback: A,
        instruments: B
      })
    }
    removeBatchCallback(A, Q) {
      let B = new Set(Q.filter(KX2.isObservableInstrument)),
        G = this._findBatchCallback(A, B);
      if (G < 0) return;
      this._batchCallbacks.splice(G, 1)
    }
    async observe(A, Q) {
      let B = this._observeCallbacks(A, Q),
        G = this._observeBatchCallbacks(A, Q);
      return (await (0, tyA.PromiseAllSettled)([...B, ...G])).filter(tyA.isPromiseAllSettledRejectionResult).map((J) => J.reason)
    }
    _observeCallbacks(A, Q) {
      return this._callbacks.map(async ({
        callback: B,
        instrument: G
      }) => {
        let Z = new VX2.ObservableResultImpl(G._descriptor.name, G._descriptor.valueType),
          Y = Promise.resolve(B(Z));
        if (Q != null) Y = (0, tyA.callWithTimeout)(Y, Q);
        await Y, G._metricStorages.forEach((J) => {
          J.record(Z._buffer, A)
        })
      })
    }
    _observeBatchCallbacks(A, Q) {
      return this._batchCallbacks.map(async ({
        callback: B,
        instruments: G
      }) => {
        let Z = new VX2.BatchObservableResultImpl,
          Y = Promise.resolve(B(Z));
        if (Q != null) Y = (0, tyA.callWithTimeout)(Y, Q);
        await Y, G.forEach((J) => {
          let X = Z._buffer.get(J);
          if (X == null) return;
          J._metricStorages.forEach((I) => {
            I.record(X, A)
          })
        })
      })
    }
    _findCallback(A, Q) {
      return this._callbacks.findIndex((B) => {
        return B.callback === A && B.instrument === Q
      })
    }
    _findBatchCallback(A, Q) {
      return this._batchCallbacks.findIndex((B) => {
        return B.callback === A && (0, tyA.setEquals)(B.instruments, Q)
      })
    }
  }
  HX2.ObservableRegistry = FX2
})