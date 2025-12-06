
// @from(Start 13999291, End 13999348)
nV0 = L(() => {
  O3();
  AE();
  NX();
  gB();
  AL()
})
// @from(Start 13999351, End 13999792)
function aV0({
  ratio: A,
  width: Q,
  fillColor: B,
  emptyColor: G
}) {
  let Z = Math.min(1, Math.max(0, A)),
    I = Math.floor(Z * Q),
    Y = [KSA[KSA.length - 1].repeat(I)];
  if (I < Q) {
    let J = Z * Q - I,
      W = Math.floor(J * KSA.length);
    Y.push(KSA[W]);
    let X = Q - I - 1;
    if (X > 0) Y.push(KSA[0].repeat(X))
  }
  return lV9.default.createElement($, {
    color: B,
    backgroundColor: G
  }, Y.join(""))
}
// @from(Start 13999797, End 13999800)
lV9
// @from(Start 13999802, End 13999805)
KSA
// @from(Start 13999811, End 13999910)
iV9 = L(() => {
  hA();
  lV9 = BA(VA(), 1), KSA = [" ", "▏", "▎", "▍", "▌", "▋", "▊", "▉", "█"]
})
// @from(Start 13999913, End 14001091)
function nV9({
  title: A,
  limit: Q,
  maxWidth: B,
  showTimeInReset: G = !0,
  extraSubtext: Z
}) {
  let {
    utilization: I,
    resets_at: Y
  } = Q;
  if (I === null) return null;
  let J = `${Math.floor(I)}% used`,
    W;
  if (Y) W = `Resets ${J8B(Y,!0,G)}`;
  if (Z)
    if (W) W = `${Z} · ${W}`;
    else W = Z;
  let X = 50;
  if (B >= X + 12) return VB.createElement(S, {
    flexDirection: "column"
  }, VB.createElement($, {
    bold: !0
  }, A), VB.createElement(S, {
    flexDirection: "row",
    gap: 1
  }, VB.createElement(aV0, {
    ratio: I / 100,
    width: X,
    fillColor: "rate_limit_fill",
    emptyColor: "rate_limit_empty"
  }), VB.createElement($, null, J)), W && VB.createElement($, {
    dimColor: !0
  }, W));
  else return VB.createElement(S, {
    flexDirection: "column"
  }, VB.createElement($, null, VB.createElement($, {
    bold: !0
  }, A), W && VB.createElement(VB.Fragment, null, VB.createElement($, null, " "), VB.createElement($, {
    dimColor: !0
  }, "· ", W))), VB.createElement(aV0, {
    ratio: I / 100,
    width: B,
    fillColor: "rate_limit_fill",
    emptyColor: "rate_limit_empty"
  }), VB.createElement($, null, J))
}
// @from(Start 14001093, End 14003008)
function aV9() {
  let [A, Q] = EVA.useState(null), [B, G] = EVA.useState(null), [Z, I] = EVA.useState(!0), {
    columns: Y
  } = WB(), J = Y - 2, W = Math.min(J, 80), X = VB.useCallback(async () => {
    I(!0), G(null);
    try {
      let F = await iV0();
      Q(F)
    } catch (F) {
      AA(F);
      let K = F,
        D = K.response?.data ? JSON.stringify(K.response.data) : void 0;
      G(D ? `Failed to load usage data: ${D}` : "Failed to load usage data")
    } finally {
      I(!1)
    }
  }, []);
  if (EVA.useEffect(() => {
      X()
    }, [X]), f1((F) => {
      if (F === "r" && B && !Z) X()
    }), B) return VB.createElement(S, {
    flexDirection: "column",
    marginTop: 1,
    gap: 1
  }, VB.createElement($, {
    color: "error"
  }, "Error: ", B), VB.createElement($, {
    dimColor: !0,
    italic: !0
  }, "r to retry · Esc to exit"));
  if (!A) return VB.createElement(S, {
    flexDirection: "column",
    marginTop: 1,
    gap: 1
  }, VB.createElement($, {
    dimColor: !0
  }, "Loading usage data…"), VB.createElement($, {
    dimColor: !0,
    italic: !0
  }, "Esc to exit"));
  let V = [{
    title: "Current session",
    limit: A.five_hour
  }, {
    title: "Current week (all models)",
    limit: A.seven_day
  }, {
    title: "Current week (Sonnet only)",
    limit: A.seven_day_sonnet
  }];
  return VB.createElement(S, {
    flexDirection: "column",
    marginTop: 1,
    gap: 1,
    width: "100%"
  }, V.some(({
    limit: F
  }) => F) || VB.createElement($, {
    dimColor: !0
  }, "/usage is only available for subscription plans."), V.map(({
    title: F,
    limit: K
  }) => K && VB.createElement(nV9, {
    key: F,
    title: F,
    limit: K,
    maxWidth: W
  })), A.extra_usage && VB.createElement(Sy3, {
    extraUsage: A.extra_usage,
    maxWidth: W
  }), VB.createElement(_y3, null), VB.createElement($, {
    dimColor: !0,
    italic: !0
  }, "Esc to exit"))
}
// @from(Start 14003010, End 14004148)
function Sy3({
  extraUsage: A,
  maxWidth: Q
}) {
  if (!o2("tengu_show_extra_usage_bar")) return;
  let B = f4();
  if (!(B === "pro" || B === "max")) return !1;
  if (!A.is_enabled) {
    if (jW0() !== "control" && Yx.isEnabled()) return VB.createElement(S, {
      flexDirection: "column"
    }, VB.createElement($, {
      bold: !0
    }, sV0), VB.createElement($, {
      dimColor: !0
    }, "Extra usage not enabled • /extra-usage to enable"));
    return null
  }
  if (A.monthly_limit === null) return VB.createElement(S, {
    flexDirection: "column"
  }, VB.createElement($, {
    bold: !0
  }, sV0), VB.createElement($, {
    dimColor: !0
  }, "Unlimited"));
  if (typeof A.used_credits !== "number" || typeof A.utilization !== "number") return null;
  let Z = dzA(A.used_credits / 100, 2),
    I = dzA(A.monthly_limit / 100, 2),
    Y = new Date,
    J = new Date(Y.getFullYear(), Y.getMonth() + 1, 1);
  return VB.createElement(nV9, {
    title: sV0,
    limit: {
      utilization: A.utilization,
      resets_at: J.toISOString()
    },
    showTimeInReset: !1,
    extraSubtext: `${Z} / ${I} spent`,
    maxWidth: Q
  })
}
// @from(Start 14004150, End 14005157)
function _y3() {
  let A = f4();
  if (!A) return null;
  let Q = null;
  if (A === "pro" && o2("tengu_backstage_only")) Q = "Pro users can now use /extra-usage for access to Opus 4.5 in Claude Code. Opus models are still included with your plan on claude.ai";
  else if (A === "enterprise") Q = "We've removed the Opus cap so you can use Opus 4.5 up to your overall limit. We may continue to adjust limits as we learn how usage patterns evolve over time.";
  else if (A === "max" || A === "team") Q = "We've increased your limits and removed the Opus cap, so you can use Opus 4.5 up to your overall limit. Sonnet now has its own limit—it's set to match your previous overall limit, so you can use just as much as before. We may continue to adjust limits as we learn how usage patterns evolve over time.";
  if (!Q) return null;
  return VB.createElement(S, {
    flexDirection: "column"
  }, VB.createElement($, {
    bold: !0
  }, "Nov 24, 2025 update:"), VB.createElement($, {
    dimColor: !0
  }, Q))
}
// @from(Start 14005162, End 14005164)
VB
// @from(Start 14005166, End 14005169)
EVA
// @from(Start 14005171, End 14005190)
sV0 = "Extra usage"
// @from(Start 14005196, End 14005336)
sV9 = L(() => {
  hA();
  i8();
  nV0();
  g1();
  iV9();
  DjA();
  M_();
  gB();
  SW0();
  u2();
  VB = BA(VA(), 1), EVA = BA(VA(), 1)
})
// @from(Start 14005339, End 14006361)
function zVA({
  onClose: A,
  context: Q,
  defaultTab: B
}) {
  let [G, Z] = mY1.useState(!1), [I, Y] = mY1.useState(!1), [J, W] = mY1.useState(!1);
  return f1((V, F) => {
    if (F.escape || F.ctrl && (V === "c" || V === "d")) A("Status dialog dismissed", {
      display: "system"
    })
  }), aW.createElement(S, {
    flexDirection: "column"
  }, aW.createElement(D3, {
    dividerColor: I ? "warning" : "permission",
    dividerDimColor: !I
  }), aW.createElement(S, {
    marginX: J ? 0 : 1
  }, aW.createElement(Na, {
    title: "Settings:",
    color: "permission",
    defaultTab: B,
    hidden: G
  }, [aW.createElement(eD, {
    key: "status",
    title: "Status"
  }, aW.createElement(uV9, {
    context: Q
  })), aW.createElement(eD, {
    key: "config",
    title: "Config"
  }, aW.createElement(cV9, {
    context: Q,
    onClose: A,
    setTabsHidden: Z,
    setIsWarning: Y,
    setHideMargin: W
  })), aW.createElement(eD, {
    key: "usage",
    title: "Usage"
  }, aW.createElement(aV9, null))])))
}
// @from(Start 14006366, End 14006368)
aW
// @from(Start 14006370, End 14006373)
mY1
// @from(Start 14006379, End 14006487)
dY1 = L(() => {
  hA();
  BK();
  FSA();
  mV9();
  pV9();
  sV9();
  aW = BA(VA(), 1), mY1 = BA(VA(), 1)
})
// @from(Start 14006493, End 14006496)
rV0
// @from(Start 14006498, End 14006501)
ky3
// @from(Start 14006503, End 14006506)
rV9
// @from(Start 14006512, End 14006928)
oV9 = L(() => {
  dY1();
  rV0 = BA(VA(), 1), ky3 = {
    aliases: ["theme"],
    type: "local-jsx",
    name: "config",
    description: "Open config panel",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, Q) {
      return rV0.createElement(zVA, {
        onClose: A,
        context: Q,
        defaultTab: "Config"
      })
    },
    userFacingName() {
      return "config"
    }
  }, rV9 = ky3
})
// @from(Start 14006931, End 14006984)
function yy3(A) {
  return `${Math.round(A/1000)}k`
}
// @from(Start 14006986, End 14012025)
function tV9({
  data: A
}) {
  let {
    categories: Q,
    totalTokens: B,
    rawMaxTokens: G,
    percentage: Z,
    gridRows: I,
    model: Y,
    memoryFiles: J,
    mcpTools: W,
    agents: X,
    slashCommands: V,
    skills: F,
    messageBreakdown: K
  } = A, {
    columns: D
  } = WB(), H = D < 80, C = Q.filter((U) => U.tokens > 0 && U.name !== "Free space" && U.name !== cY1), E = Q.find((U) => U.name === cY1);
  return VQ.createElement(S, {
    flexDirection: "column",
    padding: H ? 0 : 1
  }, VQ.createElement($, {
    bold: !0
  }, "Context Usage"), VQ.createElement(S, {
    flexDirection: "row",
    gap: 2
  }, VQ.createElement(S, {
    flexDirection: "column",
    flexShrink: 0
  }, I.map((U, q) => VQ.createElement(S, {
    key: q,
    flexDirection: "row",
    marginLeft: -1
  }, U.map((w, N) => {
    if (w.categoryName === "Free space") return VQ.createElement($, {
      key: N,
      dimColor: !0
    }, "⛶ ");
    if (w.categoryName === cY1) return VQ.createElement($, {
      key: N,
      color: w.color
    }, "⛝ ");
    return VQ.createElement($, {
      key: N,
      color: w.color
    }, w.squareFullness >= 0.7 ? "⛁ " : "⛀ ")
  })))), VQ.createElement(S, {
    flexDirection: "column",
    gap: 0,
    flexShrink: 0
  }, VQ.createElement($, {
    dimColor: !0
  }, Y, " · ", Math.round(B / 1000), "k/", Math.round(G / 1000), "k tokens (", Z, "%)"), VQ.createElement($, null, " "), C.map((U, q) => {
    let w = U.tokens < 1000 ? `${U.tokens}` : `${(U.tokens/1000).toFixed(1)}k`,
      N = (U.tokens / G * 100).toFixed(1),
      R = U.name === cY1,
      T = U.name,
      y = R ? "⛝" : "⛁";
    return VQ.createElement(S, {
      key: q
    }, VQ.createElement($, {
      color: U.color
    }, y), VQ.createElement($, null, " ", T, ": "), VQ.createElement($, {
      dimColor: !0
    }, w, " tokens (", N, "%)"))
  }), (Q.find((U) => U.name === "Free space")?.tokens ?? 0) > 0 && VQ.createElement(S, null, VQ.createElement($, {
    dimColor: !0
  }, "⛶"), VQ.createElement($, null, " Free space: "), VQ.createElement($, {
    dimColor: !0
  }, yy3(Q.find((U) => U.name === "Free space")?.tokens || 0), " ", "(", ((Q.find((U) => U.name === "Free space")?.tokens || 0) / G * 100).toFixed(1), "%)")), E && E.tokens > 0 && VQ.createElement(S, null, VQ.createElement($, {
    color: E.color
  }, "⛝"), VQ.createElement($, {
    dimColor: !0
  }, " ", E.name, ": "), VQ.createElement($, {
    dimColor: !0
  }, E.tokens < 1000 ? `${E.tokens}` : `${(E.tokens/1000).toFixed(1)}k`, " ", "tokens (", (E.tokens / G * 100).toFixed(1), "%)")))), VQ.createElement(S, {
    flexDirection: "column",
    marginLeft: -1
  }, W.length > 0 && VQ.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, VQ.createElement(S, null, VQ.createElement($, {
    bold: !0
  }, "MCP tools"), VQ.createElement($, {
    dimColor: !0
  }, " · /mcp")), W.map((U, q) => VQ.createElement(S, {
    key: q
  }, VQ.createElement($, null, "└ ", U.name, " (", U.serverName, "):", " "), VQ.createElement($, {
    dimColor: !0
  }, U.tokens < 1000 ? `${U.tokens}` : `${(U.tokens/1000).toFixed(1)}k`, " ", "tokens")))), X.length > 0 && VQ.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, VQ.createElement(S, null, VQ.createElement($, {
    bold: !0
  }, "Custom agents"), VQ.createElement($, {
    dimColor: !0
  }, " · /agents")), X.map((U, q) => {
    let w = U.source === "projectSettings" ? "Project" : U.source === "userSettings" ? "User" : U.source === "localSettings" ? "Local" : U.source === "flagSettings" ? "Flag" : U.source === "policySettings" ? "Policy" : U.source === "plugin" ? "Plugin" : U.source === "built-in" ? "Built-in" : String(U.source);
    return VQ.createElement(S, {
      key: q
    }, VQ.createElement($, null, "└ ", U.agentType, " (", w, "):", " "), VQ.createElement($, {
      dimColor: !0
    }, U.tokens < 1000 ? `${U.tokens}` : `${(U.tokens/1000).toFixed(1)}k`, " ", "tokens"))
  })), J.length > 0 && VQ.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, VQ.createElement(S, null, VQ.createElement($, {
    bold: !0
  }, "Memory files"), VQ.createElement($, {
    dimColor: !0
  }, " · /memory")), J.map((U, q) => VQ.createElement(S, {
    key: q
  }, VQ.createElement($, null, "└ ", U.type, " (", U.path, "):", " "), VQ.createElement($, {
    dimColor: !0
  }, U.tokens < 1000 ? `${U.tokens}` : `${(U.tokens/1000).toFixed(1)}k`, " ", "tokens")))), V && V.tokens > 0 && VQ.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, VQ.createElement(S, null, VQ.createElement($, {
    bold: !0
  }, "SlashCommand Tool"), VQ.createElement($, {
    dimColor: !0
  }, " ", "·", " ", V.includedCommands < V.totalCommands ? `${V.includedCommands} of ${V.totalCommands} commands` : `${V.totalCommands} commands`)), VQ.createElement(S, null, VQ.createElement($, null, "└ Total: "), VQ.createElement($, {
    dimColor: !0
  }, V.tokens < 1000 ? `${V.tokens}` : `${(V.tokens/1000).toFixed(1)}k`, " ", "tokens"))), F && F.tokens > 0 && !1, K && !1))
}
// @from(Start 14012030, End 14012032)
VQ
// @from(Start 14012034, End 14012060)
cY1 = "Autocompact buffer"
// @from(Start 14012066, End 14012119)
eV9 = L(() => {
  hA();
  i8();
  VQ = BA(VA(), 1)
})
// @from(Start 14012169, End 14012387)
function vy3({
  children: A
}) {
  let {
    exit: Q
  } = ku1();
  return lQA.useLayoutEffect(() => {
    let B = setTimeout(Q, 0);
    return () => clearTimeout(B)
  }, [Q]), hO.createElement(hO.Fragment, null, A)
}
// @from(Start 14012389, End 14012638)
function AF9(A) {
  return new Promise(async (Q) => {
    let B = "",
      G = new xy3;
    G.on("data", (I) => {
      B += I.toString()
    }), await (await VG(hO.createElement(vy3, null, A), {
      stdout: G
    })).waitUntilExit(), Q(B)
  })
}
// @from(Start 14012639, End 14012703)
async function UVA(A) {
  let Q = await AF9(A);
  return cY(Q)
}
// @from(Start 14012705, End 14013019)
function $VA({
  children: A,
  onComplete: Q
}) {
  let B = lQA.useContext(k_),
    G = lQA.useRef(!1);
  if (lQA.useLayoutEffect(() => {
      if (G.current) return;
      G.current = !0, AF9(A).then((Z) => {
        Q(Z)
      })
    }, [A, Q]), B) return hO.createElement(hO.Fragment, null, A);
  return null
}
// @from(Start 14013024, End 14013026)
hO
// @from(Start 14013028, End 14013031)
lQA
// @from(Start 14013037, End 14013118)
DSA = L(() => {
  hA();
  k7A();
  ET();
  hO = BA(VA(), 1), lQA = BA(VA(), 1)
})
// @from(Start 14013121, End 14013194)
function ng(A) {
  return A < 1000 ? `${A}` : `${(A/1000).toFixed(1)}k`
}
// @from(Start 14013196, End 14015834)
function fy3(A) {
  let {
    categories: Q,
    totalTokens: B,
    rawMaxTokens: G,
    percentage: Z,
    model: I,
    memoryFiles: Y,
    mcpTools: J,
    agents: W,
    slashCommands: X,
    skills: V,
    messageBreakdown: F
  } = A, K = `## Context Usage

`;
  K += `**Model:** ${I}  
`, K += `**Tokens:** ${ng(B)} / ${ng(G)} (${Z}%)

`;
  let D = Q.filter((H) => H.tokens > 0 && H.name !== "Free space" && H.name !== "Autocompact buffer");
  if (D.length > 0) {
    K += `### Categories

`, K += `| Category | Tokens | Percentage |
`, K += `|----------|--------|------------|
`;
    for (let E of D) {
      let U = (E.tokens / G * 100).toFixed(1);
      K += `| ${E.name} | ${ng(E.tokens)} | ${U}% |
`
    }
    let H = Q.find((E) => E.name === "Free space");
    if (H && H.tokens > 0) {
      let E = (H.tokens / G * 100).toFixed(1);
      K += `| Free space | ${ng(H.tokens)} | ${E}% |
`
    }
    let C = Q.find((E) => E.name === "Autocompact buffer");
    if (C && C.tokens > 0) {
      let E = (C.tokens / G * 100).toFixed(1);
      K += `| Autocompact buffer | ${ng(C.tokens)} | ${E}% |
`
    }
    K += `
`
  }
  if (J.length > 0) {
    K += `### MCP Tools

`, K += `| Tool | Server | Tokens |
`, K += `|------|--------|--------|
`;
    for (let H of J) K += `| ${H.name} | ${H.serverName} | ${ng(H.tokens)} |
`;
    K += `
`
  }
  if (W.length > 0) {
    K += `### Custom Agents

`, K += `| Agent Type | Source | Tokens |
`, K += `|------------|--------|--------|
`;
    for (let H of W) {
      let C;
      switch (H.source) {
        case "projectSettings":
          C = "Project";
          break;
        case "userSettings":
          C = "User";
          break;
        case "localSettings":
          C = "Local";
          break;
        case "flagSettings":
          C = "Flag";
          break;
        case "policySettings":
          C = "Policy";
          break;
        case "plugin":
          C = "Plugin";
          break;
        case "built-in":
          C = "Built-in";
          break;
        default:
          C = String(H.source)
      }
      K += `| ${H.agentType} | ${C} | ${ng(H.tokens)} |
`
    }
    K += `
`
  }
  if (Y.length > 0) {
    K += `### Memory Files

`, K += `| Type | Path | Tokens |
`, K += `|------|------|--------|
`;
    for (let H of Y) K += `| ${H.type} | ${H.path} | ${ng(H.tokens)} |
`;
    K += `
`
  }
  if (X && X.tokens > 0) K += `### SlashCommand Tool

`, K += `**Commands:** ${X.includedCommands<X.totalCommands?`${X.includedCommands} of ${X.totalCommands}`:X.totalCommands}  
`, K += `**Total tokens:** ${ng(X.tokens)}

`;
  return V && V.tokens > 0, K
}
// @from(Start 14015839, End 14015842)
HSA
// @from(Start 14015844, End 14015847)
by3
// @from(Start 14015849, End 14015852)
QF9
// @from(Start 14015858, End 14016784)
BF9 = L(() => {
  eV9();
  s51();
  DSA();
  y1A();
  cQ();
  HSA = BA(VA(), 1), by3 = {
    name: "context",
    description: "Visualize current context usage as a colored grid",
    isEnabled: () => !0,
    isHidden: !1,
    type: "local-jsx",
    userFacingName() {
      return this.name
    },
    async call(A, {
      messages: Q,
      getAppState: B,
      options: {
        mainLoopModel: G,
        tools: Z,
        isNonInteractiveSession: I
      }
    }) {
      let Y = nk(Q),
        {
          messages: J
        } = await Si(Y),
        W = process.stdout.columns || 80,
        X = await B(),
        V = await xb2(J, G, async () => X.toolPermissionContext, Z, X.agentDefinitions, W);
      if (I) {
        let F = fy3(V);
        return A(F), null
      }
      return HSA.createElement($VA, {
        onComplete: A
      }, HSA.createElement(tV9, {
        data: V
      }))
    }
  };
  QF9 = by3
})
// @from(Start 14016790, End 14016793)
hy3
// @from(Start 14016795, End 14016798)
GF9
// @from(Start 14016804, End 14017629)
ZF9 = L(() => {
  M_();
  gB();
  Pi();
  hy3 = {
    type: "local",
    name: "cost",
    description: "Show the total cost and duration of the current session",
    isEnabled: () => !0,
    get isHidden() {
      return BB()
    },
    supportsNonInteractive: !0,
    async call() {
      if (BB()) {
        let A;
        if (ik.isUsingOverage) A = "You are currently using your overages to power your Claude Code usage. We will automatically switch you back to your subscription rate limits when they reset";
        else A = "You are currently using your subscription to power your Claude Code usage";
        return {
          type: "text",
          value: A
        }
      }
      return {
        type: "text",
        value: rv1()
      }
    },
    userFacingName() {
      return "cost"
    }
  }, GF9 = hy3
})
// @from(Start 14017635, End 14017649)
IF9 = () => {}
// @from(Start 14017652, End 14017809)
function pY1() {
  return CSA.createElement($, {
    color: "permission"
  }, "Press ", CSA.createElement($, {
    bold: !0
  }, "Enter"), " to continue…")
}
// @from(Start 14017814, End 14017817)
CSA
// @from(Start 14017823, End 14017869)
oV0 = L(() => {
  hA();
  CSA = BA(VA(), 1)
})
// @from(Start 14017872, End 14019920)
function YF9(A, Q = {}) {
  let {
    showValues: B = !0,
    hideFunctions: G = !1,
    themeName: Z = "dark",
    treeCharColors: I = {}
  } = Q, Y = [], J = new WeakSet;

  function W(F, K) {
    if (!K) return F;
    return ZB(K, Z)(F)
  }

  function X(F, K, D, H = 0) {
    if (typeof F === "string") {
      Y.push(K + W(F, I.value));
      return
    }
    if (typeof F !== "object" || F === null) {
      if (B) {
        let E = String(F);
        Y.push(K + W(E, I.value))
      }
      return
    }
    if (J.has(F)) {
      Y.push(K + W("[Circular]", I.value));
      return
    }
    J.add(F);
    let C = Object.keys(F).filter((E) => {
      let U = F[E];
      if (G && typeof U === "function") return !1;
      return !0
    });
    C.forEach((E, U) => {
      let q = F[E],
        w = U === C.length - 1,
        N = H === 0 && U === 0 ? "" : K,
        R = w ? ESA.lastBranch : ESA.branch,
        T = W(R, I.treeChar),
        y = E.trim() === "" ? "" : W(E, I.key),
        v = N + T + (y ? " " + y : ""),
        x = E.trim() !== "";
      if (q && typeof q === "object" && J.has(q)) {
        let p = W("[Circular]", I.value);
        Y.push(v + (x ? ": " : v ? " " : "") + p)
      } else if (q && typeof q === "object" && !Array.isArray(q)) {
        Y.push(v);
        let p = w ? ESA.empty : ESA.line,
          u = W(p, I.treeChar),
          e = N + u + " ";
        X(q, e, w, H + 1)
      } else if (Array.isArray(q)) Y.push(v + (x ? ": " : v ? " " : "") + "[Array(" + q.length + ")]");
      else if (B) {
        let p = typeof q === "function" ? "[Function]" : String(q),
          u = W(p, I.value);
        v += (x ? ": " : v ? " " : "") + u, Y.push(v)
      } else Y.push(v)
    })
  }
  let V = Object.keys(A);
  if (V.length === 0) return W("(empty)", I.value);
  if (V.length === 1 && V[0] !== void 0 && V[0].trim() === "" && typeof A[V[0]] === "string") {
    let F = V[0],
      K = W(ESA.lastBranch, I.treeChar),
      D = W(A[F], I.value);
    return K + " " + D
  }
  return X(A, "", !0), Y.join(`
`)
}
// @from(Start 14019925, End 14019928)
ESA
// @from(Start 14019934, End 14020088)
JF9 = L(() => {
  V9();
  hA();
  ESA = {
    branch: H1.lineUpDownRight,
    lastBranch: H1.lineUpRight,
    line: H1.lineVertical,
    empty: " "
  }
})
// @from(Start 14020091, End 14020911)
function gy3(A) {
  let Q = {};
  return A.forEach((B) => {
    if (!B.path) {
      Q[""] = B.message;
      return
    }
    let G = B.path.split("."),
      Z = B.path;
    if (B.invalidValue !== null && B.invalidValue !== void 0 && G.length > 0) {
      let I = [];
      for (let Y = 0; Y < G.length; Y++) {
        let J = G[Y];
        if (!J) continue;
        let W = parseInt(J, 10);
        if (!isNaN(W) && Y === G.length - 1) {
          let X;
          if (typeof B.invalidValue === "string") X = `"${B.invalidValue}"`;
          else if (B.invalidValue === null) X = "null";
          else if (B.invalidValue === void 0) X = "undefined";
          else X = String(B.invalidValue);
          I.push(X)
        } else I.push(J)
      }
      Z = I.join(".")
    }
    ou0(Q, Z, B.message, Object)
  }), Q
}
// @from(Start 14020913, End 14022690)
function WF9({
  errors: A
}) {
  let [Q] = qB();
  if (A.length === 0) return null;
  let B = A.reduce((Z, I) => {
      let Y = I.file || "(file not specified)";
      if (!Z[Y]) Z[Y] = [];
      return Z[Y].push(I), Z
    }, {}),
    G = Object.keys(B).sort();
  return sW.createElement(S, {
    flexDirection: "column",
    marginTop: 1,
    marginBottom: 1
  }, sW.createElement($, {
    bold: !0
  }, "Invalid Settings"), G.map((Z) => {
    let I = B[Z] || [];
    I.sort((X, V) => {
      if (!X.path && V.path) return -1;
      if (X.path && !V.path) return 1;
      return (X.path || "").localeCompare(V.path || "")
    });
    let Y = gy3(I),
      J = new Map;
    I.forEach((X) => {
      if (X.suggestion || X.docLink) {
        let V = `${X.suggestion||""}|${X.docLink||""}`;
        if (!J.has(V)) J.set(V, {
          suggestion: X.suggestion,
          docLink: X.docLink
        })
      }
    });
    let W = YF9(Y, {
      showValues: !0,
      themeName: Q,
      treeCharColors: {
        treeChar: "inactive",
        key: "text",
        value: "inactive"
      }
    });
    return sW.createElement(S, {
      key: Z,
      flexDirection: "column"
    }, sW.createElement($, null, Z), sW.createElement(S, {
      marginLeft: 1
    }, sW.createElement($, {
      dimColor: !0
    }, W)), J.size > 0 && sW.createElement(S, {
      flexDirection: "column",
      marginTop: 1
    }, Array.from(J.values()).map((X, V) => sW.createElement(S, {
      key: `suggestion-pair-${V}`,
      flexDirection: "column",
      marginBottom: 1
    }, X.suggestion && sW.createElement($, {
      dimColor: !0,
      wrap: "wrap"
    }, X.suggestion), X.docLink && sW.createElement($, {
      dimColor: !0,
      wrap: "wrap"
    }, "Learn more: ", X.docLink)))))
  }))
}
// @from(Start 14022695, End 14022697)
sW
// @from(Start 14022703, End 14022766)
XF9 = L(() => {
  hA();
  tu0();
  JF9();
  sW = BA(VA(), 1)
})
// @from(Start 14022769, End 14024359)
function tV0({
  scope: A,
  parsingErrors: Q,
  warnings: B
}) {
  let G = Q.length > 0,
    Z = B.length > 0;
  if (!G && !Z) return null;
  return qZ.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, qZ.default.createElement(S, null, (G || Z) && qZ.default.createElement($, {
    color: G ? "error" : "warning"
  }, "[", G ? "Failed to parse" : "Contains warnings", "]", " "), qZ.default.createElement($, null, iQA(A))), qZ.default.createElement(S, null, qZ.default.createElement($, {
    dimColor: !0
  }, "Location: "), qZ.default.createElement($, {
    dimColor: !0
  }, YN(A))), qZ.default.createElement(S, {
    marginLeft: 1,
    flexDirection: "column"
  }, Q.map((I, Y) => {
    let J = I.mcpErrorMetadata?.serverName;
    return qZ.default.createElement(S, {
      key: `error-${Y}`
    }, qZ.default.createElement($, null, qZ.default.createElement($, {
      dimColor: !0
    }, "└ "), qZ.default.createElement($, {
      color: "error"
    }, "[Error]"), qZ.default.createElement($, {
      dimColor: !0
    }, " ", J && `[${J}] `, I.path && I.path !== "" ? `${I.path}: ` : "", I.message)))
  }), B.map((I, Y) => {
    let J = I.mcpErrorMetadata?.serverName;
    return qZ.default.createElement(S, {
      key: `warning-${Y}`
    }, qZ.default.createElement($, null, qZ.default.createElement($, {
      dimColor: !0
    }, "└ "), qZ.default.createElement($, {
      color: "warning"
    }, "[Warning]"), qZ.default.createElement($, {
      dimColor: !0
    }, " ", J && `[${J}] `, I.path && I.path !== "" ? `${I.path}: ` : "", I.message)))
  })))
}
// @from(Start 14024361, End 14026049)
function lY1() {
  let A = sX("user"),
    Q = sX("project"),
    B = sX("local"),
    G = {
      user: A.errors.filter((J) => J.mcpErrorMetadata && J.mcpErrorMetadata.severity === "fatal"),
      project: Q.errors.filter((J) => J.mcpErrorMetadata && J.mcpErrorMetadata.severity === "fatal"),
      local: B.errors.filter((J) => J.mcpErrorMetadata && J.mcpErrorMetadata.severity === "fatal")
    },
    Z = {
      user: A.errors.filter((J) => J.mcpErrorMetadata && J.mcpErrorMetadata.severity === "warning"),
      project: Q.errors.filter((J) => J.mcpErrorMetadata && J.mcpErrorMetadata.severity === "warning"),
      local: B.errors.filter((J) => J.mcpErrorMetadata && J.mcpErrorMetadata.severity === "warning")
    },
    I = G.user.length > 0 || G.project.length > 0 || G.local.length > 0,
    Y = Z.user.length > 0 || Z.project.length > 0 || Z.local.length > 0;
  if (!I && !Y) return null;
  return qZ.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1,
    marginBottom: 1
  }, qZ.default.createElement($, {
    bold: !0
  }, "MCP Config Diagnostics"), qZ.default.createElement(S, {
    marginTop: 1
  }, qZ.default.createElement($, {
    dimColor: !0
  }, "For help configuring MCP servers, see:", " ", qZ.default.createElement(h4, {
    url: "https://code.claude.com/docs/en/mcp"
  }, "https://code.claude.com/docs/en/mcp"))), qZ.default.createElement(tV0, {
    scope: "user",
    parsingErrors: G.user,
    warnings: Z.user
  }), qZ.default.createElement(tV0, {
    scope: "project",
    parsingErrors: G.project,
    warnings: Z.project
  }), qZ.default.createElement(tV0, {
    scope: "local",
    parsingErrors: G.local,
    warnings: Z.local
  }))
}
// @from(Start 14026054, End 14026056)
qZ
// @from(Start 14026062, End 14026131)
eV0 = L(() => {
  hA();
  tM();
  nX();
  hA();
  qZ = BA(VA(), 1)
})
// @from(Start 14026134, End 14026312)
function VF9() {
  return oE0().map((Q) => ({
    name: Q.name,
    value: process.env[Q.name],
    ...Q.validate(process.env[Q.name])
  })).filter((Q) => Q.status !== "valid")
}
// @from(Start 14026317, End 14026342)
FF9 = L(() => {
  _0()
})
// @from(Start 14026344, End 14026904)
async function uy3() {
  let A = M1A();
  if (A.length === 0) return null;
  let Q = A.sort((G, Z) => Z.content.length - G.content.length).map((G) => `${G.path}: ${G.content.length.toLocaleString()} chars`);
  return {
    type: "claudemd_files",
    severity: "warning",
    message: A.length === 1 ? `Large CLAUDE.md file detected (${A[0].content.length.toLocaleString()} chars > ${Lh.toLocaleString()})` : `${A.length} large CLAUDE.md files detected (each > ${Lh.toLocaleString()} chars)`,
    details: Q,
    currentValue: A.length,
    threshold: Lh
  }
}
// @from(Start 14026905, End 14027619)
async function my3(A) {
  if (!A) return null;
  let Q = jjA(A);
  if (Q <= jQA) return null;
  let B = A.activeAgents.filter((Z) => Z.source !== "built-in").map((Z) => {
      let I = `${Z.agentType}: ${Z.whenToUse}`;
      return {
        name: Z.agentType,
        tokens: gG(I)
      }
    }).sort((Z, I) => I.tokens - Z.tokens),
    G = B.slice(0, 5).map((Z) => `${Z.name}: ~${Z.tokens.toLocaleString()} tokens`);
  if (B.length > 5) G.push(`(${B.length-5} more custom agents)`);
  return {
    type: "agent_descriptions",
    severity: "warning",
    message: `Large agent descriptions (~${Q.toLocaleString()} tokens > ${jQA.toLocaleString()})`,
    details: G,
    currentValue: Q,
    threshold: jQA
  }
}
// @from(Start 14027620, End 14029108)
async function dy3(A, Q, B) {
  let G = A.filter((Z) => Z.isMcp);
  if (G.length === 0) return null;
  if (bZ()) return null;
  try {
    let {
      mcpToolTokens: Z,
      mcpToolDetails: I
    } = await XTA(A, Q, B);
    if (Z <= wVA) return null;
    let Y = new Map;
    for (let X of I) {
      let F = X.name.split("__")[1] || "unknown",
        K = Y.get(F) || {
          count: 0,
          tokens: 0
        };
      Y.set(F, {
        count: K.count + 1,
        tokens: K.tokens + X.tokens
      })
    }
    let J = Array.from(Y.entries()).sort((X, V) => V[1].tokens - X[1].tokens),
      W = J.slice(0, 5).map(([X, V]) => `${X}: ${V.count} tools (~${V.tokens.toLocaleString()} tokens)`);
    if (J.length > 5) W.push(`(${J.length-5} more servers)`);
    return {
      type: "mcp_tools",
      severity: "warning",
      message: `Large MCP tools context (~${Z.toLocaleString()} tokens > ${wVA.toLocaleString()})`,
      details: W,
      currentValue: Z,
      threshold: wVA
    }
  } catch (Z) {
    let I = G.reduce((Y, J) => {
      let W = (J.name?.length || 0) + J.description.length;
      return Y + gG(W.toString())
    }, 0);
    if (I <= wVA) return null;
    return {
      type: "mcp_tools",
      severity: "warning",
      message: `Large MCP tools context (~${I.toLocaleString()} tokens estimated > ${wVA.toLocaleString()})`,
      details: [`${G.length} MCP tools detected (token count estimated)`],
      currentValue: I,
      threshold: wVA
    }
  }
}
// @from(Start 14029109, End 14029286)
async function KF9(A, Q, B) {
  let [G, Z, I] = await Promise.all([uy3(), my3(Q), dy3(A, B, Q)]);
  return {
    claudeMdWarning: G,
    agentWarning: Z,
    mcpWarning: I
  }
}
// @from(Start 14029291, End 14029302)
wVA = 25000
// @from(Start 14029308, End 14029367)
DF9 = L(() => {
  gE();
  rW0();
  s51();
  xM();
  dH()
})
// @from(Start 14029408, End 14035989)
function iY1({
  onDone: A
}) {
  let [Q] = OQ(), B = Q.agentDefinitions, G = FB.useMemo(() => {
    return Q?.mcp?.tools || []
  }, [Q?.mcp?.tools]), [Z, I] = FB.useState(null), [Y, J] = FB.useState(null), [W, X] = FB.useState(null), F = AY1().filter((D) => D.mcpErrorMetadata === void 0), K = FB.useMemo(() => VF9(), []);
  if (FB.useEffect(() => {
      YIA().then(I), (async () => {
        let D = RA(),
          H = HF9(MQ(), "agents"),
          C = HF9(uQ(), ".claude", "agents"),
          {
            activeAgents: E,
            allAgents: U,
            failedFiles: q
          } = B,
          w = {
            activeAgents: E.map((R) => ({
              agentType: R.agentType,
              source: R.source
            })),
            userAgentsDir: H,
            projectAgentsDir: C,
            userDirExists: D.existsSync(H),
            projectDirExists: D.existsSync(C),
            failedFiles: q
          };
        J(w);
        let N = await KF9(G, {
          activeAgents: E,
          allAgents: U,
          failedFiles: q
        }, async () => Q.toolPermissionContext);
        X(N)
      })()
    }, [Q.toolPermissionContext, G, B]), f1((D, H) => {
      if (H.return || H.escape || H.ctrl && D === "c") A("Claude Code diagnostics dismissed", {
        display: "system"
      })
    }), !Z) return FB.default.createElement(S, {
    paddingX: 1,
    paddingTop: 1
  }, FB.default.createElement($, {
    dimColor: !0
  }, "Checking installation status…"));
  return FB.default.createElement(S, {
    flexDirection: "column",
    gap: 1,
    paddingX: 1,
    paddingTop: 1
  }, FB.default.createElement(S, {
    flexDirection: "column"
  }, FB.default.createElement($, {
    bold: !0
  }, "Diagnostics"), FB.default.createElement($, null, "└ Currently running: ", Z.installationType, " (", Z.version, ")"), Z.packageManager && FB.default.createElement($, null, "└ Package manager: ", Z.packageManager), FB.default.createElement($, null, "└ Path: ", Z.installationPath), FB.default.createElement($, null, "└ Invoked: ", Z.invokedBinary), FB.default.createElement($, null, "└ Config install method: ", Z.configInstallMethod), FB.default.createElement($, null, "└ Auto-updates:", " ", Z.packageManager ? "Managed by package manager" : Z.autoUpdates), Z.hasUpdatePermissions !== null && FB.default.createElement($, null, "└ Update permissions:", " ", Z.hasUpdatePermissions ? "Yes" : "No (requires sudo)"), FB.default.createElement($, null, "└ Search: ", Z.ripgrepStatus.working ? "OK" : "Not working", " (", Z.ripgrepStatus.mode === "builtin" ? UX() ? "bundled" : "vendor" : Z.ripgrepStatus.systemPath || "system", ")"), Z.recommendation && FB.default.createElement(FB.default.Fragment, null, FB.default.createElement($, null), FB.default.createElement($, {
    color: "warning"
  }, "Recommendation: ", Z.recommendation.split(`
`)[0]), FB.default.createElement($, {
    dimColor: !0
  }, Z.recommendation.split(`
`)[1])), Z.multipleInstallations.length > 1 && FB.default.createElement(FB.default.Fragment, null, FB.default.createElement($, null), FB.default.createElement($, {
    color: "warning"
  }, "Warning: Multiple installations found"), Z.multipleInstallations.map((D, H) => FB.default.createElement($, {
    key: H
  }, "└ ", D.type, " at ", D.path))), Z.warnings.length > 0 && FB.default.createElement(FB.default.Fragment, null, FB.default.createElement($, null), Z.warnings.map((D, H) => FB.default.createElement(S, {
    key: H,
    flexDirection: "column"
  }, FB.default.createElement($, {
    color: "warning"
  }, "Warning: ", D.issue), FB.default.createElement($, null, "Fix: ", D.fix)))), F.length > 0 && FB.default.createElement(FB.default.Fragment, null, FB.default.createElement($, null), FB.default.createElement(WF9, {
    errors: F
  }))), FB.default.createElement(lY1, null), K.length > 0 && FB.default.createElement(S, {
    flexDirection: "column"
  }, FB.default.createElement($, {
    bold: !0
  }, "Environment Variables"), K.map((D, H) => FB.default.createElement($, {
    key: H
  }, "└ ", D.name, ":", " ", FB.default.createElement($, {
    color: D.status === "capped" ? "warning" : "error"
  }, D.message)))), Y?.failedFiles && Y.failedFiles.length > 0 && FB.default.createElement(S, {
    flexDirection: "column"
  }, FB.default.createElement($, {
    bold: !0,
    color: "error"
  }, "Agent Parse Errors"), FB.default.createElement($, {
    color: "error"
  }, "└ Failed to parse ", Y.failedFiles.length, " agent file(s):"), Y.failedFiles.map((D, H) => FB.default.createElement($, {
    key: H,
    dimColor: !0
  }, "  ", "└ ", D.path, ": ", D.error))), Q.plugins.errors.length > 0 && FB.default.createElement(S, {
    flexDirection: "column"
  }, FB.default.createElement($, {
    bold: !0,
    color: "error"
  }, "Plugin Errors"), FB.default.createElement($, {
    color: "error"
  }, "└ ", Q.plugins.errors.length, " plugin error(s) detected:"), Q.plugins.errors.map((D, H) => FB.default.createElement($, {
    key: H,
    dimColor: !0
  }, "  ", "└ ", D.source || "unknown", "plugin" in D && D.plugin ? ` [${D.plugin}]` : "", ":", " ", oM(D)))), W && (W.claudeMdWarning || W.agentWarning || W.mcpWarning) && FB.default.createElement(S, {
    flexDirection: "column"
  }, FB.default.createElement($, {
    bold: !0
  }, "Context Usage Warnings"), W.claudeMdWarning && FB.default.createElement(FB.default.Fragment, null, FB.default.createElement($, null, "└", " ", FB.default.createElement($, {
    color: "warning"
  }, H1.warning, " ", W.claudeMdWarning.message)), FB.default.createElement($, null, "  ", "└ Files:"), W.claudeMdWarning.details.map((D, H) => FB.default.createElement($, {
    key: H,
    dimColor: !0
  }, "    ", "└ ", D))), W.agentWarning && FB.default.createElement(FB.default.Fragment, null, FB.default.createElement($, null, "└", " ", FB.default.createElement($, {
    color: "warning"
  }, H1.warning, " ", W.agentWarning.message)), FB.default.createElement($, null, "  ", "└ Top contributors:"), W.agentWarning.details.map((D, H) => FB.default.createElement($, {
    key: H,
    dimColor: !0
  }, "    ", "└ ", D))), W.mcpWarning && FB.default.createElement(FB.default.Fragment, null, FB.default.createElement($, null, "└", " ", FB.default.createElement($, {
    color: "warning"
  }, H1.warning, " ", W.mcpWarning.message)), FB.default.createElement($, null, "  ", "└ MCP servers:"), W.mcpWarning.details.map((D, H) => FB.default.createElement($, {
    key: H,
    dimColor: !0
  }, "    ", "└ ", D)))), FB.default.createElement(S, null, FB.default.createElement(pY1, null)))
}
// @from(Start 14035994, End 14035996)
FB
// @from(Start 14036002, End 14036149)
AF0 = L(() => {
  hA();
  V9();
  Zh();
  oV0();
  mX0();
  XF9();
  eV0();
  _0();
  AQ();
  hQ();
  FF9();
  DF9();
  z9();
  FB = BA(VA(), 1)
})
// @from(Start 14036155, End 14036158)
CF9
// @from(Start 14036160, End 14036163)
cy3
// @from(Start 14036165, End 14036168)
EF9
// @from(Start 14036174, End 14036621)
zF9 = L(() => {
  AF0();
  CF9 = BA(VA(), 1), cy3 = {
    name: "doctor",
    description: "Diagnose and verify your Claude Code installation and settings",
    isEnabled: () => !process.env.DISABLE_DOCTOR_COMMAND,
    isHidden: !1,
    userFacingName() {
      return "doctor"
    },
    type: "local-jsx",
    call(A, Q, B) {
      return new Promise((G) => G(CF9.default.createElement(iY1, {
        onDone: A
      })))
    }
  }, EF9 = cy3
})
// @from(Start 14036627, End 14036652)
QF0 = L(() => {
  hQ()
})
// @from(Start 14036658, End 14036718)
BF0 = L(() => {
  AMA();
  V0();
  AQ();
  QMA();
  QF0()
})
// @from(Start 14036724, End 14036819)
GF0 = L(() => {
  AMA();
  V0();
  g1();
  q10();
  $10();
  QF0();
  AQ();
  QMA();
  BF0()
})
// @from(Start 14036825, End 14036828)
iy3
// @from(Start 14036834, End 14036904)
UF9 = L(() => {
  hA();
  J5();
  Q4();
  hA();
  iy3 = BA(VA(), 1)
})
// @from(Start 14036910, End 14036913)
$F9
// @from(Start 14036919, End 14036965)
wF9 = L(() => {
  hA();
  $F9 = BA(VA(), 1)
})
// @from(Start 14036971, End 14036974)
ZF0
// @from(Start 14036980, End 14037059)
qF9 = L(() => {
  hA();
  ZY();
  DY();
  BF0();
  V0();
  ZF0 = BA(VA(), 1)
})
// @from(Start 14037065, End 14037068)
nY1
// @from(Start 14037074, End 14037172)
NF9 = L(() => {
  hA();
  DY();
  GF0();
  UF9();
  wF9();
  qF9();
  V0();
  nY1 = BA(VA(), 1)
})
// @from(Start 14037178, End 14037181)
IF0
// @from(Start 14037187, End 14037283)
LF9 = L(() => {
  hA();
  DY();
  GF0();
  V0();
  AQ();
  yI();
  NF9();
  IF0 = BA(VA(), 1)
})
// @from(Start 14037286, End 14038829)
function ay3({
  onDone: A
}) {
  YF0.useState(() => {
    gV.cache.clear?.()
  });
  let {
    columns: Q
  } = WB(), B = async (W) => {
    try {
      if (W.includes(MQ())) {
        let D = MQ();
        if (!RA().existsSync(D)) RA().mkdirSync(D)
      }
      if (!RA().existsSync(W)) RA().writeFileSync(W, "", {
        encoding: "utf8",
        flush: !0
      });
      await cn(W);
      let X = "default",
        V = "";
      if (process.env.VISUAL) X = "$VISUAL", V = process.env.VISUAL;
      else if (process.env.EDITOR) X = "$EDITOR", V = process.env.EDITOR;
      let F = X !== "default" ? `Using ${X}="${V}".` : "",
        K = F ? `> ${F} To change editor, set $EDITOR or $VISUAL environment variable.` : "> To use a different editor, set the $EDITOR or $VISUAL environment variable.";
      A(`Opened memory file at ${w60(W)}

${K}`, {
        display: "system"
      })
    } catch (X) {
      AA(X instanceof Error ? X : Error(String(X))), A(`Error opening memory file: ${X}`)
    }
  }, G = () => {
    A("Cancelled memory editing", {
      display: "system"
    })
  }, I = [].length, [Y, J] = YF0.useState(!1);
  return f1((W, X) => {}), JN.createElement(S, {
    flexDirection: "column"
  }, JN.createElement(S, {
    marginTop: 1,
    marginBottom: 1
  }, JN.createElement($, {
    dimColor: !0
  }, "Learn more: ", JN.createElement(h4, {
    url: "https://code.claude.com/docs/en/memory"
  }))), !1, !1, !1, !Y && JN.createElement(hZ1, {
    title: "Select memory to edit:",
    onSelect: B,
    onCancel: G
  }))
}
// @from(Start 14038834, End 14038836)
JN
// @from(Start 14038838, End 14038841)
YF0
// @from(Start 14038843, End 14038846)
ny3
// @from(Start 14038848, End 14038851)
MF9
// @from(Start 14038857, End 14039295)
OF9 = L(() => {
  hQ();
  g1();
  pn();
  AQ();
  nJ0();
  q60();
  hA();
  hA();
  gE();
  i8();
  JN = BA(VA(), 1), YF0 = BA(VA(), 1), ny3 = {
    type: "local-jsx",
    name: "memory",
    description: "Edit Claude memory files",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A) {
      return JN.createElement(ay3, {
        onDone: A
      })
    },
    userFacingName() {
      return this.name
    }
  };
  MF9 = ny3
})
// @from(Start 14039298, End 14039822)
function RF9({
  onCancel: A
}) {
  return f1((Q, B) => {
    if (B.escape) A()
  }), Zz.createElement(S, {
    flexDirection: "column",
    paddingY: 1,
    gap: 1
  }, Zz.createElement(S, null, Zz.createElement($, null, "Claude understands your codebase, makes edits with your permission, and executes commands — right from your terminal.")), Zz.createElement(S, {
    flexDirection: "column"
  }, Zz.createElement(S, null, Zz.createElement($, {
    bold: !0
  }, "Shortcuts")), Zz.createElement(bZ1, {
    gap: 2
  })))
}
// @from(Start 14039827, End 14039829)
Zz
// @from(Start 14039835, End 14039889)
TF9 = L(() => {
  hA();
  iJ0();
  Zz = BA(VA(), 1)
})
// @from(Start 14039892, End 14040606)
function JF0({
  commands: A,
  maxHeight: Q,
  title: B,
  onCancel: G,
  emptyMessage: Z
}) {
  let I = Math.max(1, Q - 8),
    Y = PF9.useMemo(() => [...A].sort((J, W) => J.name.localeCompare(W.name)).map((J) => ({
      label: `/${J.name}`,
      value: J.name,
      description: J.description
    })), [A]);
  return OC.createElement(S, {
    flexDirection: "column",
    paddingY: 1
  }, A.length === 0 && Z ? OC.createElement($, {
    dimColor: !0
  }, Z) : OC.createElement(OC.Fragment, null, OC.createElement($, null, B), OC.createElement(S, {
    marginTop: 1
  }, OC.createElement(M0, {
    options: Y,
    visibleOptionCount: I,
    onCancel: G,
    disableSelection: !0,
    hideIndexes: !0
  }))))
}
// @from(Start 14040611, End 14040613)
OC
// @from(Start 14040615, End 14040618)
PF9
// @from(Start 14040624, End 14040696)
jF9 = L(() => {
  hA();
  S5();
  OC = BA(VA(), 1), PF9 = BA(VA(), 1)
})
// @from(Start 14040699, End 14042601)
function SF9({
  onClose: A,
  commands: Q
}) {
  let {
    rows: B
  } = WB(), G = Math.floor(B / 2), Z = () => A("Help dialog dismissed", {
    display: "system"
  }), I = EQ(Z), Y = Ny(), J = Q.filter((F) => Y.has(F.name) && !F.isHidden), W = [], X = Q.filter((F) => !Y.has(F.name) && !F.isHidden), V = [h6.createElement(eD, {
    key: "general",
    title: "general"
  }, h6.createElement(RF9, {
    onCancel: Z
  }))];
  return V.push(h6.createElement(eD, {
    key: "commands",
    title: "commands"
  }, h6.createElement(JF0, {
    commands: J,
    maxHeight: G,
    title: "Browse default commands:",
    onCancel: Z
  }))), V.push(h6.createElement(eD, {
    key: "custom",
    title: "custom-commands"
  }, h6.createElement(JF0, {
    commands: X,
    maxHeight: G,
    title: "Browse custom commands:",
    emptyMessage: "No custom commands found",
    onCancel: Z
  }))), h6.createElement(S, {
    flexDirection: "column",
    height: G
  }, h6.createElement(D3, {
    dividerColor: "professionalBlue"
  }), h6.createElement(S, {
    paddingX: 1,
    flexDirection: "column"
  }, h6.createElement(Na, {
    title: `Claude Code v${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.VERSION}`,
    color: "professionalBlue",
    defaultTab: "general"
  }, V), h6.createElement(S, {
    marginTop: 1
  }, h6.createElement($, null, "For more help:", " ", h6.createElement(h4, {
    url: "https://code.claude.com/docs/en/overview"
  }))), h6.createElement(S, {
    marginTop: 1
  }, h6.createElement($, {
    dimColor: !0
  }, I.pending ? h6.createElement(h6.Fragment, null, "Press ", I.keyName, " again to exit") : h6.createElement($, {
    italic: !0
  }, "Esc to exit")))))
}
// @from(Start 14042606, End 14042608)
h6
// @from(Start 14042614, End 14042726)
_F9 = L(() => {
  hA();
  BK();
  FSA();
  TF9();
  jF9();
  cE();
  i8();
  Q4();
  hA();
  h6 = BA(VA(), 1)
})
// @from(Start 14042732, End 14042735)
WF0
// @from(Start 14042737, End 14042740)
sy3
// @from(Start 14042742, End 14042745)
kF9
// @from(Start 14042751, End 14043176)
yF9 = L(() => {
  _F9();
  WF0 = BA(VA(), 1), sy3 = {
    type: "local-jsx",
    name: "help",
    description: "Show help and available commands",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, {
      options: {
        commands: Q
      }
    }) {
      return WF0.createElement(SF9, {
        commands: Q,
        onClose: A
      })
    },
    userFacingName() {
      return "help"
    }
  }, kF9 = sy3
})
// @from(Start 14043179, End 14044588)
function xF9({
  onComplete: A
}) {
  let Q = EQ(),
    B = Iz.useCallback(async (Z) => {
      let I = Z === "yes",
        Y = N1();
      c0({
        ...Y,
        autoConnectIde: I,
        hasIdeAutoConnectDialogBeenShown: !0
      }), A()
    }, [A]);
  return f1((Z, I) => {
    if (I.escape) A()
  }), Iz.default.createElement(S, {
    marginTop: 1,
    flexDirection: "column"
  }, Iz.default.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    borderColor: "ide",
    paddingX: 2,
    paddingY: 1,
    width: "100%"
  }, Iz.default.createElement(S, {
    marginBottom: 1
  }, Iz.default.createElement($, {
    color: "ide"
  }, "Do you wish to enable auto-connect to IDE?")), Iz.default.createElement(S, {
    flexDirection: "column",
    paddingX: 1
  }, Iz.default.createElement(M0, {
    options: [{
      label: "Yes",
      value: "yes"
    }, {
      label: "No",
      value: "no"
    }],
    onChange: B,
    defaultValue: "yes",
    onCancel: () => A()
  })), Iz.default.createElement(S, {
    marginTop: 1
  }, Iz.default.createElement($, {
    dimColor: !0
  }, "You can also configure this in /config or with the --ide flag"))), Iz.default.createElement(S, {
    paddingX: 1
  }, Iz.default.createElement($, {
    dimColor: !0
  }, Q.pending ? Iz.default.createElement(Iz.default.Fragment, null, "Press ", Q.keyName, " again to exit") : "Enter to confirm")))
}
// @from(Start 14044590, End 14044711)
function vF9() {
  let A = N1();
  return !bV() && A.autoConnectIde !== !0 && A.hasIdeAutoConnectDialogBeenShown !== !0
}
// @from(Start 14044716, End 14044718)
Iz
// @from(Start 14044724, End 14044809)
bF9 = L(() => {
  hA();
  jQ();
  hA();
  J5();
  Q4();
  nY();
  Iz = BA(VA(), 1)
})
// @from(Start 14044841, End 14047983)
function ry3({
  availableIDEs: A,
  unavailableIDEs: Q,
  selectedIDE: B,
  onClose: G,
  onSelect: Z
}) {
  let I = EQ(),
    [Y, J] = q4.useState(B?.port?.toString() ?? "None"),
    [W, X] = q4.useState(!1),
    V = q4.useCallback((D) => {
      if (D !== "None" && vF9()) X(!0);
      else Z(A.find((H) => H.port === parseInt(D)))
    }, [A, Z]),
    F = A.reduce((D, H) => {
      return D[H.name] = (D[H.name] || 0) + 1, D
    }, {}),
    K = A.map((D) => {
      let C = (F[D.name] || 0) > 1 && D.workspaceFolders.length > 0;
      return {
        label: D.name,
        value: D.port.toString(),
        description: C ? fF9(D.workspaceFolders) : void 0
      }
    }).concat([{
      label: "None",
      value: "None",
      description: void 0
    }]);
  return f1((D, H) => {
    if (H.escape) G()
  }), W ? q4.default.createElement(xF9, {
    onComplete: () => V(Y)
  }) : q4.default.createElement(S, {
    marginTop: 1,
    flexDirection: "column"
  }, q4.default.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    borderColor: "ide",
    paddingX: 2,
    paddingY: 1,
    width: "100%"
  }, q4.default.createElement(S, {
    flexDirection: "column"
  }, q4.default.createElement($, {
    color: "ide",
    bold: !0
  }, "Select IDE"), q4.default.createElement($, {
    dimColor: !0
  }, "Connect to an IDE for integrated development features."), A.length === 0 && q4.default.createElement(S, {
    marginTop: 1
  }, q4.default.createElement($, {
    dimColor: !0
  }, DLA() ? `No available IDEs detected. Please install the plugin and restart your IDE:
https://docs.claude.com/s/claude-code-jetbrains` : "No available IDEs detected. Make sure your IDE has the Claude Code extension or plugin installed and is running."))), A.length !== 0 && q4.default.createElement(S, {
    flexDirection: "column",
    paddingX: 1,
    marginTop: 1
  }, q4.default.createElement(M0, {
    defaultValue: Y,
    focusValue: Y,
    options: K,
    onFocus: (D) => J(D),
    onChange: (D) => {
      J(D), V(D)
    },
    onCancel: () => G()
  })), A.length !== 0 && !bV() && q4.default.createElement(S, {
    marginTop: 1
  }, q4.default.createElement($, {
    dimColor: !0
  }, "※ Tip: You can enable auto-connect to IDE in /config or with the --ide flag")), Q.length > 0 && q4.default.createElement(S, {
    marginTop: 1,
    flexDirection: "column"
  }, q4.default.createElement($, {
    dimColor: !0
  }, "Found ", Q.length, " other running IDE(s). However, their workspace/project directories do not match the current cwd."), q4.default.createElement(S, {
    marginTop: 1,
    flexDirection: "column"
  }, Q.map((D, H) => q4.default.createElement(S, {
    key: H,
    paddingLeft: 3
  }, q4.default.createElement($, {
    dimColor: !0
  }, "• ", D.name, ": ", fF9(D.workspaceFolders))))))), q4.default.createElement(S, {
    paddingX: 1
  }, q4.default.createElement($, {
    dimColor: !0
  }, I.pending ? q4.default.createElement(q4.default.Fragment, null, "Press ", I.keyName, " again to exit") : q4.default.createElement(q4.default.Fragment, null, A.length !== 0 && "Enter to confirm · ", "Esc to exit"))))
}
// @from(Start 14047984, End 14048168)
async function oy3(A, Q) {
  let B = Q?.ide;
  if (!B || B.type !== "sse-ide" && B.type !== "ws-ide") return null;
  for (let G of A)
    if (G.url === B.url) return G;
  return null
}
// @from(Start 14048170, End 14049519)
function ty3({
  runningIDEs: A,
  onSelectIDE: Q,
  onDone: B
}) {
  let G = EQ(),
    [Z, I] = q4.useState(A[0] ?? ""),
    Y = q4.useCallback((W) => {
      Q(W)
    }, [Q]),
    J = A.map((W) => ({
      label: aF(W),
      value: W
    }));
  return f1((W, X) => {
    if (X.escape) B("IDE selection cancelled", {
      display: "system"
    })
  }), q4.default.createElement(q4.default.Fragment, null, q4.default.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    borderColor: "ide",
    marginTop: 1,
    paddingX: 2,
    paddingY: 1,
    width: "100%"
  }, q4.default.createElement(S, {
    marginBottom: 1
  }, q4.default.createElement($, {
    color: "ide"
  }, "Select IDE to install extension:")), q4.default.createElement(S, {
    flexDirection: "column",
    paddingX: 1
  }, q4.default.createElement(M0, {
    focusValue: Z,
    options: J,
    onFocus: (W) => I(W),
    onChange: (W) => {
      I(W), Y(W)
    },
    onCancel: () => B("IDE selection cancelled", {
      display: "system"
    })
  }))), q4.default.createElement(S, {
    paddingLeft: 3
  }, q4.default.createElement($, {
    dimColor: !0
  }, G.pending ? q4.default.createElement(q4.default.Fragment, null, "Press ", G.keyName, " again to exit") : q4.default.createElement(q4.default.Fragment, null, "Enter to confirm · Esc to cancel"))))
}
// @from(Start 14049521, End 14049953)
function fF9(A, Q = 100) {
  if (A.length === 0) return "";
  let B = W0(),
    G = A.slice(0, 2),
    Z = A.length > 2,
    I = Z ? 3 : 0,
    Y = (G.length - 1) * 2,
    J = Q - Y - I,
    W = Math.floor(J / G.length),
    V = G.map((F) => {
      if (F.startsWith(B + hF9.sep)) F = F.slice(B.length + 1);
      if (F.length <= W) return F;
      return "…" + F.slice(-(W - 1))
    }).join(", ");
  if (Z) V += ", …";
  return V
}
// @from(Start 14049958, End 14049960)
q4
// @from(Start 14049962, End 14049965)
ey3
// @from(Start 14049967, End 14049970)
gF9
// @from(Start 14049976, End 14052586)
uF9 = L(() => {
  hA();
  J5();
  bF9();
  nY();
  q0();
  Q4();
  ijA();
  U2();
  _8();
  F9();
  q4 = BA(VA(), 1);
  ey3 = {
    type: "local-jsx",
    name: "ide",
    description: "Manage IDE integrations and show status",
    isEnabled: () => !0,
    isHidden: !1,
    argumentHint: "[open]",
    async call(A, Q, B) {
      GA("tengu_ext_ide_command", {});
      let {
        options: {
          dynamicMcpConfig: G
        },
        onChangeDynamicMcpConfig: Z
      } = Q, I = await HLA(!0);
      if (I.length === 0 && Q.onInstallIDEExtension && !bV()) {
        let V = _Q1(),
          F = (K) => {
            if (Q.onInstallIDEExtension)
              if (Q.onInstallIDEExtension(K), oT(K)) A(`Installed plugin to ${tA.bold(aF(K))}
Please ${tA.bold("restart your IDE")} completely for it to take effect`);
              else A(`Installed extension to ${tA.bold(aF(K))}`)
          };
        if (V.length > 1) return q4.default.createElement(ty3, {
          runningIDEs: V,
          onSelectIDE: F,
          onDone: () => {
            A("No IDE selected.", {
              display: "system"
            })
          }
        });
        else if (V.length === 1) {
          let K = V[0];
          return q4.default.createElement(() => {
            return q4.useEffect(() => {
              F(K)
            }, []), null
          }, null)
        }
      }
      let Y = I.filter((V) => V.isValid),
        J = I.filter((V) => !V.isValid),
        W = await oy3(Y, G);
      return q4.default.createElement(ry3, {
        availableIDEs: Y,
        unavailableIDEs: J,
        selectedIDE: W,
        onClose: () => A("IDE selection cancelled", {
          display: "system"
        }),
        onSelect: async (V) => {
          try {
            if (!Z) {
              A("Error connecting to IDE.");
              return
            }
            let F = {
              ...G || {}
            };
            if (W) delete F.ide;
            if (!V) A(W ? `Disconnected from ${W.name}.` : "No IDE selected.");
            else {
              let K = V.url;
              F.ide = {
                type: K.startsWith("ws:") ? "ws-ide" : "sse-ide",
                url: K,
                ideName: V.name,
                authToken: V.authToken,
                ideRunningInWindows: V.ideRunningInWindows,
                scope: "dynamic"
              }, A(`Connected to ${V.name}.`)
            }
            Z(F)
          } catch (F) {
            A("Error connecting to IDE.")
          }
        }
      })
    },
    userFacingName() {
      return "ide"
    }
  }, gF9 = ey3
})
// @from(Start 14052592, End 14052595)
Ax3
// @from(Start 14052597, End 14052600)
mF9
// @from(Start 14052606, End 14054649)
dF9 = L(() => {
  N$A();
  Ax3 = {
    type: "prompt",
    name: "init",
    description: "Initialize a new CLAUDE.md file with codebase documentation",
    isEnabled: () => !0,
    isHidden: !1,
    progressMessage: "analyzing your codebase",
    userFacingName() {
      return "init"
    },
    source: "builtin",
    async getPromptForCommand() {
      return n7A(), [{
        type: "text",
        text: `Please analyze this codebase and create a CLAUDE.md file, which will be given to future instances of Claude Code to operate in this repository.

What to add:
1. Commands that will be commonly used, such as how to build, lint, and run tests. Include the necessary commands to develop in this codebase, such as how to run a single test.
2. High-level code architecture and structure so that future instances can be productive more quickly. Focus on the "big picture" architecture that requires reading multiple files to understand.

Usage notes:
- If there's already a CLAUDE.md, suggest improvements to it.
- When you make the initial CLAUDE.md, do not repeat yourself and do not include obvious instructions like "Provide helpful error messages to users", "Write unit tests for all new utilities", "Never include sensitive information (API keys, tokens) in code or commits".
- Avoid listing every component or file structure that can be easily discovered.
- Don't include generic development practices.
- If there are Cursor rules (in .cursor/rules/ or .cursorrules) or Copilot rules (in .github/copilot-instructions.md), make sure to include the important parts.
- If there is a README.md, make sure to include the important parts.
- Do not make up information such as "Common Development Tasks", "Tips for Development", "Support and Documentation" unless this is expressly included in other files that you read.
- Be sure to prefix the file with the following text:

\`\`\`
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
\`\`\``
      }]
    }
  }, mF9 = Ax3
})
// @from(Start 14054652, End 14054751)
function pF9() {
  return cF9.default.createElement($, null, "Checking GitHub CLI installation…")
}
// @from(Start 14054756, End 14054759)
cF9
// @from(Start 14054765, End 14054811)
lF9 = L(() => {
  hA();
  cF9 = BA(VA(), 1)
})
// @from(Start 14054814, End 14056823)
function iF9({
  currentRepo: A,
  useCurrentRepo: Q,
  repoUrl: B,
  onRepoUrlChange: G,
  onSubmit: Z,
  onToggleUseCurrentRepo: I
}) {
  let [Y, J] = WV.useState(0), [W, X] = WV.useState(!1), F = WB().columns, K = () => {
    if (!(Q ? A : B)?.trim()) {
      X(!0);
      return
    }
    Z()
  };
  return f1((D, H) => {
    if (H.upArrow) I(!0), X(!1);
    else if (H.downArrow) I(!1), X(!1);
    else if (H.return) K()
  }), WV.default.createElement(WV.default.Fragment, null, WV.default.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    borderDimColor: !0,
    paddingX: 1
  }, WV.default.createElement(S, {
    flexDirection: "column",
    marginBottom: 1
  }, WV.default.createElement($, {
    bold: !0
  }, "Install GitHub App"), WV.default.createElement($, {
    dimColor: !0
  }, "Select GitHub repository")), A && WV.default.createElement(S, {
    marginBottom: 1
  }, WV.default.createElement($, {
    bold: Q,
    color: Q ? "permission" : void 0
  }, Q ? "> " : "  ", "Use current repository: ", A)), WV.default.createElement(S, {
    marginBottom: 1
  }, WV.default.createElement($, {
    bold: !Q || !A,
    color: !Q || !A ? "permission" : void 0
  }, !Q || !A ? "> " : "  ", A ? "Enter a different repository" : "Enter repository")), (!Q || !A) && WV.default.createElement(S, {
    marginLeft: 2,
    marginBottom: 1
  }, WV.default.createElement(s4, {
    value: B,
    onChange: (D) => {
      G(D), X(!1)
    },
    onSubmit: K,
    focus: !0,
    placeholder: "Enter a repo as owner/repo or https://github.com/owner/repo…",
    columns: F,
    cursorOffset: Y,
    onChangeCursorOffset: J,
    showCursor: !0
  }))), W && WV.default.createElement(S, {
    marginLeft: 3,
    marginBottom: 1
  }, WV.default.createElement($, {
    color: "error"
  }, "Please enter a repository name to continue")), WV.default.createElement(S, {
    marginLeft: 3
  }, WV.default.createElement($, {
    dimColor: !0
  }, A ? "↑/↓ to select · " : "", "Enter to continue")))
}
// @from(Start 14056828, End 14056830)
WV
// @from(Start 14056836, End 14056897)
nF9 = L(() => {
  hA();
  ZY();
  i8();
  WV = BA(VA(), 1)
})
// @from(Start 14056903, End 14056942)
aF9 = "Add Claude Code GitHub Workflow"
// @from(Start 14056946, End 14057025)
Cx = "https://github.com/anthropics/claude-code-action/blob/main/docs/setup.md"
// @from(Start 14057029, End 14058912)
sF9 = `name: Claude Code

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]
  pull_request_review:
    types: [submitted]

jobs:
  claude:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review' && contains(github.event.review.body, '@claude')) ||
      (github.event_name == 'issues' && (contains(github.event.issue.body, '@claude') || contains(github.event.issue.title, '@claude')))
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write
      actions: read # Required for Claude to read CI results on PRs
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Run Claude Code
        id: claude
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}

          # This is an optional setting that allows Claude to read CI results on PRs
          additional_permissions: |
            actions: read

          # Optional: Give a custom prompt to Claude. If this is not specified, Claude will perform the instructions specified in the comment that tagged it.
          # prompt: 'Update the pull request description to include a summary of changes.'

          # Optional: Add claude_args to customize behavior and configuration
          # See https://github.com/anthropics/claude-code-action/blob/main/docs/usage.md
          # or https://code.claude.com/docs/en/cli-reference for available options
          # claude_args: '--allowed-tools Bash(gh pr:*)'

`
// @from(Start 14058916, End 14060682)
rF9 = `## \uD83E\uDD16 Installing Claude Code GitHub App

This PR adds a GitHub Actions workflow that enables Claude Code integration in our repository.

### What is Claude Code?

[Claude Code](https://claude.com/claude-code) is an AI coding agent that can help with:
- Bug fixes and improvements  
- Documentation updates
- Implementing new features
- Code reviews and suggestions
- Writing tests
- And more!

### How it works

Once this PR is merged, we'll be able to interact with Claude by mentioning @claude in a pull request or issue comment.
Once the workflow is triggered, Claude will analyze the comment and surrounding context, and execute on the request in a GitHub action.

### Important Notes

- **This workflow won't take effect until this PR is merged**
- **@claude mentions won't work until after the merge is complete**
- The workflow runs automatically whenever Claude is mentioned in PR or issue comments
- Claude gets access to the entire PR or issue context including files, diffs, and previous comments

### Security

- Our Anthropic API key is securely stored as a GitHub Actions secret
- Only users with write access to the repository can trigger the workflow
- All Claude runs are stored in the GitHub Actions run history
- Claude's default tools are limited to reading/writing files and interacting with our repo by creating comments, branches, and commits.
- We can add more allowed tools by adding them to the workflow file like:

\`\`\`
allowed_tools: Bash(npm install),Bash(npm run build),Bash(npm run lint),Bash(npm run test)
\`\`\`

There's more information in the [Claude Code action repo](https://github.com/anthropics/claude-code-action).

After merging this PR, let's try mentioning @claude in a comment on any PR to get started!`
// @from(Start 14060686, End 14062639)
oF9 = `name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize]
    # Optional: Only run on specific file changes
    # paths:
    #   - "src/**/*.ts"
    #   - "src/**/*.tsx"
    #   - "src/**/*.js"
    #   - "src/**/*.jsx"

jobs:
  claude-review:
    # Optional: Filter by PR author
    # if: |
    #   github.event.pull_request.user.login == 'external-contributor' ||
    #   github.event.pull_request.user.login == 'new-developer' ||
    #   github.event.pull_request.author_association == 'FIRST_TIME_CONTRIBUTOR'

    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Run Claude Code Review
        id: claude-review
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            REPO: \${{ github.repository }}
            PR NUMBER: \${{ github.event.pull_request.number }}

            Please review this pull request and provide feedback on:
            - Code quality and best practices
            - Potential bugs or issues
            - Performance considerations
            - Security concerns
            - Test coverage

            Use the repository's CLAUDE.md for guidance on style and conventions. Be constructive and helpful in your feedback.

            Use \`gh pr comment\` with your Bash tool to leave your review as a comment on the PR.

          # See https://github.com/anthropics/claude-code-action/blob/main/docs/usage.md
          # or https://code.claude.com/docs/en/cli-reference for available options
          claude_args: '--allowed-tools "Bash(gh issue view:*),Bash(gh search:*),Bash(gh issue list:*),Bash(gh pr comment:*),Bash(gh pr diff:*),Bash(gh pr view:*),Bash(gh pr list:*)"'

`
// @from(Start 14062643, End 14064075)
tF9 = `name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize, ready_for_review, reopened]
    # Optional: Only run on specific file changes
    # paths:
    #   - "src/**/*.ts"
    #   - "src/**/*.tsx"
    #   - "src/**/*.js"
    #   - "src/**/*.jsx"

jobs:
  claude-review:
    # Optional: Filter by PR author
    # if: |
    #   github.event.pull_request.user.login == 'external-contributor' ||
    #   github.event.pull_request.user.login == 'new-developer' ||
    #   github.event.pull_request.author_association == 'FIRST_TIME_CONTRIBUTOR'

    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Run Claude Code Review
        id: claude-review
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}
          plugin_marketplaces: 'https://github.com/anthropics/claude-code.git'
          plugins: 'code-review@claude-code-plugins'
          prompt: '/code-review:code-review \${{ github.repository }}/pull/\${{ github.event.pull_request.number }}'
          # See https://github.com/anthropics/claude-code-action/blob/main/docs/usage.md
          # or https://code.claude.com/docs/en/cli-reference for available options

`
// @from(Start 14064078, End 14065663)
function eF9({
  repoUrl: A,
  onSubmit: Q
}) {
  return f1((B, G) => {
    if (G.return) Q()
  }), XV.default.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    borderDimColor: !0,
    paddingX: 1
  }, XV.default.createElement(S, {
    flexDirection: "column",
    marginBottom: 1
  }, XV.default.createElement($, {
    bold: !0
  }, "Install the Claude GitHub App")), XV.default.createElement(S, {
    marginBottom: 1
  }, XV.default.createElement($, null, "Opening browser to install the Claude GitHub App…")), XV.default.createElement(S, {
    marginBottom: 1
  }, XV.default.createElement($, null, "If your browser doesn't open automatically, visit:")), XV.default.createElement(S, {
    marginBottom: 1
  }, XV.default.createElement($, {
    underline: !0
  }, "https://github.com/apps/claude")), XV.default.createElement(S, {
    marginBottom: 1
  }, XV.default.createElement($, null, "Please install the app for repository: ", XV.default.createElement($, {
    bold: !0
  }, A))), XV.default.createElement(S, {
    marginBottom: 1
  }, XV.default.createElement($, {
    dimColor: !0
  }, "Important: Make sure to grant access to this specific repository")), XV.default.createElement(S, null, XV.default.createElement($, {
    bold: !0,
    color: "permission"
  }, "Press Enter once you've installed the app", H1.ellipsis)), XV.default.createElement(S, {
    marginTop: 1
  }, XV.default.createElement($, {
    dimColor: !0
  }, "Having trouble? See manual setup instructions at:", " ", XV.default.createElement($, {
    color: "claude"
  }, Cx))))
}
// @from(Start 14065668, End 14065670)
XV
// @from(Start 14065676, End 14065729)
AK9 = L(() => {
  hA();
  V9();
  XV = BA(VA(), 1)
})
// @from(Start 14065732, End 14067647)
function QK9({
  useExistingSecret: A,
  secretName: Q,
  onToggleUseExistingSecret: B,
  onSecretNameChange: G,
  onSubmit: Z
}) {
  let [I, Y] = UY.useState(0), J = WB(), [W] = qB();
  return f1((X, V) => {
    if (V.upArrow) B(!0);
    else if (V.downArrow) B(!1);
    else if (V.return) Z()
  }), UY.default.createElement(UY.default.Fragment, null, UY.default.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    borderDimColor: !0,
    paddingX: 1
  }, UY.default.createElement(S, {
    flexDirection: "column",
    marginBottom: 1
  }, UY.default.createElement($, {
    bold: !0
  }, "Install GitHub App"), UY.default.createElement($, {
    dimColor: !0
  }, "Setup API key secret")), UY.default.createElement(S, {
    marginBottom: 1
  }, UY.default.createElement($, {
    color: "warning"
  }, "ANTHROPIC_API_KEY already exists in repository secrets!")), UY.default.createElement(S, {
    marginBottom: 1
  }, UY.default.createElement($, null, "Would you like to:")), UY.default.createElement(S, {
    marginBottom: 1
  }, UY.default.createElement($, null, A ? ZB("success", W)("> ") : "  ", "Use the existing API key")), UY.default.createElement(S, {
    marginBottom: 1
  }, UY.default.createElement($, null, !A ? ZB("success", W)("> ") : "  ", "Create a new secret with a different name")), !A && UY.default.createElement(UY.default.Fragment, null, UY.default.createElement(S, {
    marginBottom: 1
  }, UY.default.createElement($, null, "Enter new secret name (alphanumeric with underscores):")), UY.default.createElement(s4, {
    value: Q,
    onChange: G,
    onSubmit: Z,
    focus: !0,
    placeholder: "e.g., CLAUDE_API_KEY",
    columns: J.columns,
    cursorOffset: I,
    onChangeCursorOffset: Y,
    showCursor: !0
  }))), UY.default.createElement(S, {
    marginLeft: 3
  }, UY.default.createElement($, {
    dimColor: !0
  }, "↑/↓ to select · Enter to continue")))
}
// @from(Start 14067652, End 14067654)
UY
// @from(Start 14067660, End 14067721)
BK9 = L(() => {
  hA();
  ZY();
  i8();
  UY = BA(VA(), 1)
})
// @from(Start 14067724, End 14069806)
function GK9({
  existingApiKey: A,
  apiKeyOrOAuthToken: Q,
  onApiKeyChange: B,
  onSubmit: G,
  onToggleUseExistingKey: Z,
  onCreateOAuthToken: I,
  selectedOption: Y = A ? "existing" : I ? "oauth" : "new",
  onSelectOption: J
}) {
  let [W, X] = MK.useState(0), V = WB(), [F] = qB();
  return f1((K, D) => {
    if (D.upArrow) {
      if (Y === "new" && I) J?.("oauth");
      else if (Y === "oauth" && A) J?.("existing"), Z(!0)
    } else if (D.downArrow) {
      if (Y === "existing") J?.(I ? "oauth" : "new"), Z(!1);
      else if (Y === "oauth") J?.("new")
    }
    if (D.return)
      if (Y === "oauth" && I) I();
      else G()
  }), MK.default.createElement(MK.default.Fragment, null, MK.default.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    borderDimColor: !0,
    paddingX: 1
  }, MK.default.createElement(S, {
    flexDirection: "column",
    marginBottom: 1
  }, MK.default.createElement($, {
    bold: !0
  }, "Install GitHub App"), MK.default.createElement($, {
    dimColor: !0
  }, "Choose API key")), A && MK.default.createElement(S, {
    marginBottom: 1
  }, MK.default.createElement($, null, Y === "existing" ? ZB("success", F)("> ") : "  ", "Use your existing Claude Code API key")), I && MK.default.createElement(S, {
    marginBottom: 1
  }, MK.default.createElement($, null, Y === "oauth" ? ZB("success", F)("> ") : "  ", "Create a long-lived token with your Claude subscription")), MK.default.createElement(S, {
    marginBottom: 1
  }, MK.default.createElement($, null, Y === "new" ? ZB("success", F)("> ") : "  ", "Enter a new API key")), Y === "new" && MK.default.createElement(s4, {
    value: Q,
    onChange: B,
    onSubmit: G,
    onPaste: B,
    focus: !0,
    placeholder: "sk-ant… (Create a new key at https://console.anthropic.com/settings/keys)",
    mask: "*",
    columns: V.columns,
    cursorOffset: W,
    onChangeCursorOffset: X,
    showCursor: !0
  })), MK.default.createElement(S, {
    marginLeft: 3
  }, MK.default.createElement($, {
    dimColor: !0
  }, "↑/↓ to select · Enter to continue")))
}
// @from(Start 14069811, End 14069813)
MK
// @from(Start 14069819, End 14069880)
ZK9 = L(() => {
  hA();
  ZY();
  i8();
  MK = BA(VA(), 1)
})
// @from(Start 14069883, End 14071192)
function IK9({
  currentWorkflowInstallStep: A,
  secretExists: Q,
  useExistingSecret: B,
  secretName: G,
  skipWorkflow: Z = !1,
  selectedWorkflows: I
}) {
  let Y = Z ? ["Getting repository information", Q && B ? "Using existing API key secret" : `Setting up ${G} secret`] : ["Getting repository information", "Creating branch", I.length > 1 ? "Creating workflow files" : "Creating workflow file", Q && B ? "Using existing API key secret" : `Setting up ${G} secret`, "Opening pull request page"];
  return ag.default.createElement(ag.default.Fragment, null, ag.default.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    borderDimColor: !0,
    paddingX: 1
  }, ag.default.createElement(S, {
    flexDirection: "column",
    marginBottom: 1
  }, ag.default.createElement($, {
    bold: !0
  }, "Install GitHub App"), ag.default.createElement($, {
    dimColor: !0
  }, "Create GitHub Actions workflow")), Y.map((J, W) => {
    let X = "pending";
    if (W < A) X = "completed";
    else if (W === A) X = "in-progress";
    return ag.default.createElement(S, {
      key: W
    }, ag.default.createElement($, {
      color: X === "completed" ? "success" : X === "in-progress" ? "warning" : void 0
    }, X === "completed" ? "✓ " : "", J, X === "in-progress" ? "…" : ""))
  })))
}
// @from(Start 14071197, End 14071199)
ag
// @from(Start 14071205, End 14071250)
YK9 = L(() => {
  hA();
  ag = BA(VA(), 1)
})
// @from(Start 14071253, End 14073053)
function JK9({
  secretExists: A,
  useExistingSecret: Q,
  secretName: B,
  skipWorkflow: G = !1
}) {
  return oZ.default.createElement(oZ.default.Fragment, null, oZ.default.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    borderDimColor: !0,
    paddingX: 1
  }, oZ.default.createElement(S, {
    flexDirection: "column",
    marginBottom: 1
  }, oZ.default.createElement($, {
    bold: !0
  }, "Install GitHub App"), oZ.default.createElement($, {
    dimColor: !0
  }, "Success")), !G && oZ.default.createElement($, {
    color: "success"
  }, "✓ GitHub Actions workflow created!"), A && Q && oZ.default.createElement(S, {
    marginTop: 1
  }, oZ.default.createElement($, {
    color: "success"
  }, "✓ Using existing ANTHROPIC_API_KEY secret")), (!A || !Q) && oZ.default.createElement(S, {
    marginTop: 1
  }, oZ.default.createElement($, {
    color: "success"
  }, "✓ API key saved as ", B, " secret")), oZ.default.createElement(S, {
    marginTop: 1
  }, oZ.default.createElement($, null, "Next steps:")), G ? oZ.default.createElement(oZ.default.Fragment, null, oZ.default.createElement($, null, "1. Install the Claude GitHub App if you haven't already"), oZ.default.createElement($, null, "2. Your workflow file was kept unchanged"), oZ.default.createElement($, null, "3. API key is configured and ready to use")) : oZ.default.createElement(oZ.default.Fragment, null, oZ.default.createElement($, null, "1. A pre-filled PR page has been created"), oZ.default.createElement($, null, "2. Install the Claude GitHub App if you haven't already"), oZ.default.createElement($, null, "3. Merge the PR to enable Claude PR assistance"))), oZ.default.createElement(S, {
    marginLeft: 3
  }, oZ.default.createElement($, {
    dimColor: !0
  }, "Press any key to exit")))
}
// @from(Start 14073058, End 14073060)
oZ
// @from(Start 14073066, End 14073111)
WK9 = L(() => {
  hA();
  oZ = BA(VA(), 1)
})
// @from(Start 14073114, End 14074424)
function XK9({
  error: A,
  errorReason: Q,
  errorInstructions: B
}) {
  return tV.default.createElement(tV.default.Fragment, null, tV.default.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    borderDimColor: !0,
    paddingX: 1
  }, tV.default.createElement(S, {
    flexDirection: "column",
    marginBottom: 1
  }, tV.default.createElement($, {
    bold: !0
  }, "Install GitHub App")), tV.default.createElement($, {
    color: "error"
  }, "Error: ", A), Q && tV.default.createElement(S, {
    marginTop: 1
  }, tV.default.createElement($, {
    dimColor: !0
  }, "Reason: ", Q)), B && B.length > 0 && tV.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, tV.default.createElement($, {
    dimColor: !0
  }, "How to fix:"), B.map((G, Z) => tV.default.createElement(S, {
    key: Z,
    marginLeft: 2
  }, tV.default.createElement($, {
    dimColor: !0
  }, "• "), tV.default.createElement($, null, G)))), tV.default.createElement(S, {
    marginTop: 1
  }, tV.default.createElement($, {
    dimColor: !0
  }, "For manual setup instructions, see:", " ", tV.default.createElement($, {
    color: "claude"
  }, Cx)))), tV.default.createElement(S, {
    marginLeft: 3
  }, tV.default.createElement($, {
    dimColor: !0
  }, "Press any key to exit")))
}
// @from(Start 14074429, End 14074431)
tV
// @from(Start 14074437, End 14074482)
VK9 = L(() => {
  hA();
  tV = BA(VA(), 1)
})
// @from(Start 14074485, End 14075996)
function FK9({
  repoName: A,
  onSelectAction: Q
}) {
  return S$.default.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    borderDimColor: !0,
    paddingX: 1
  }, S$.default.createElement(S, {
    flexDirection: "column",
    marginBottom: 1
  }, S$.default.createElement($, {
    bold: !0
  }, "Existing Workflow Found"), S$.default.createElement($, {
    dimColor: !0
  }, "Repository: ", A)), S$.default.createElement(S, {
    flexDirection: "column",
    marginBottom: 1
  }, S$.default.createElement($, null, "A Claude workflow file already exists at", " ", S$.default.createElement($, {
    color: "claude"
  }, ".github/workflows/claude.yml")), S$.default.createElement($, {
    dimColor: !0
  }, "What would you like to do?")), S$.default.createElement(S, {
    flexDirection: "column"
  }, S$.default.createElement(M0, {
    options: [{
      label: "Update workflow file with latest version",
      value: "update"
    }, {
      label: "Skip workflow update (configure secrets only)",
      value: "skip"
    }, {
      label: "Exit without making changes",
      value: "exit"
    }],
    onChange: (I) => {
      Q(I)
    },
    onCancel: () => {
      Q("exit")
    }
  })), S$.default.createElement(S, {
    marginTop: 1
  }, S$.default.createElement($, {
    dimColor: !0
  }, "View the latest workflow template at:", " ", S$.default.createElement($, {
    color: "claude"
  }, "https://github.com/anthropics/claude-code-action/blob/main/examples/claude.yml"))))
}
// @from(Start 14076001, End 14076003)
S$
// @from(Start 14076009, End 14076062)
KK9 = L(() => {
  hA();
  J5();
  S$ = BA(VA(), 1)
})
// @from(Start 14076065, End 14077527)
function DK9({
  warnings: A,
  onContinue: Q
}) {
  return f1((B, G) => {
    if (G.return) Q()
  }), AH.default.createElement(AH.default.Fragment, null, AH.default.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    borderDimColor: !0,
    paddingX: 1
  }, AH.default.createElement(S, {
    flexDirection: "column",
    marginBottom: 1
  }, AH.default.createElement($, {
    bold: !0
  }, H1.warning, " Setup Warnings"), AH.default.createElement($, {
    dimColor: !0
  }, "We found some potential issues, but you can continue anyway")), A.map((B, G) => AH.default.createElement(S, {
    key: G,
    flexDirection: "column",
    marginBottom: 1
  }, AH.default.createElement($, {
    color: "warning",
    bold: !0
  }, B.title), AH.default.createElement($, null, B.message), B.instructions.length > 0 && AH.default.createElement(S, {
    flexDirection: "column",
    marginLeft: 2,
    marginTop: 1
  }, B.instructions.map((Z, I) => AH.default.createElement($, {
    key: I,
    dimColor: !0
  }, "• ", Z))))), AH.default.createElement(S, {
    marginTop: 1
  }, AH.default.createElement($, {
    bold: !0,
    color: "permission"
  }, "Press Enter to continue anyway, or Ctrl+C to exit and fix issues")), AH.default.createElement(S, {
    marginTop: 1
  }, AH.default.createElement($, {
    dimColor: !0
  }, "You can also try the manual setup steps if needed:", " ", AH.default.createElement($, {
    color: "claude"
  }, Cx)))))
}
// @from(Start 14077532, End 14077534)
AH
// @from(Start 14077540, End 14077593)
HK9 = L(() => {
  hA();
  V9();
  AH = BA(VA(), 1)
})
// @from(Start 14077596, End 14080255)
function CK9({
  onSubmit: A,
  defaultSelections: Q
}) {
  let [B, G] = OI.useState(new Set(Q)), [Z, I] = OI.useState(0), [Y, J] = OI.useState(!1), W = [{
    value: "claude",
    label: "@Claude Code",
    description: "Tag @claude in issues and PR comments"
  }, {
    value: "claude-review",
    label: "Claude Code Review",
    description: "Automated code review on new PRs"
  }];
  return f1((X, V) => {
    if (V.upArrow) I((F) => F > 0 ? F - 1 : W.length - 1), J(!1);
    else if (V.downArrow) I((F) => F < W.length - 1 ? F + 1 : 0), J(!1);
    else if (X === " ") {
      let F = W[Z]?.value;
      if (F) G((K) => {
        let D = new Set(K);
        if (D.has(F)) D.delete(F);
        else D.add(F);
        return D
      })
    } else if (V.return)
      if (B.size === 0) J(!0);
      else A(Array.from(B))
  }), OI.default.createElement(OI.default.Fragment, null, OI.default.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    borderDimColor: !0,
    paddingX: 1,
    width: "100%"
  }, OI.default.createElement(S, {
    flexDirection: "column",
    marginBottom: 1
  }, OI.default.createElement($, {
    bold: !0
  }, "Select GitHub workflows to install"), OI.default.createElement($, {
    dimColor: !0
  }, "We'll create a workflow file in your repository for each one you select."), OI.default.createElement(S, {
    marginTop: 1
  }, OI.default.createElement($, {
    dimColor: !0
  }, "More workflow examples (issue triage, CI fixes, etc.) at:", " ", OI.default.createElement(h4, {
    url: "https://github.com/anthropics/claude-code-action/blob/main/examples/"
  }, "https://github.com/anthropics/claude-code-action/blob/main/examples/")))), OI.default.createElement(S, {
    flexDirection: "column",
    paddingX: 1
  }, W.map((X, V) => {
    let F = B.has(X.value),
      K = V === Z;
    return OI.default.createElement(S, {
      key: X.value,
      flexDirection: "row",
      marginBottom: V < W.length - 1 ? 1 : 0
    }, OI.default.createElement(S, {
      marginRight: 1,
      minWidth: 2
    }, OI.default.createElement($, {
      bold: K
    }, F ? "✓" : " ")), OI.default.createElement(S, {
      flexDirection: "column"
    }, OI.default.createElement($, {
      bold: K
    }, X.label), OI.default.createElement($, {
      dimColor: !0
    }, X.description)))
  }))), OI.default.createElement(S, {
    marginLeft: 2
  }, OI.default.createElement($, {
    dimColor: !0
  }, "↑↓ Navigate · Space to toggle · Enter to confirm")), Y && OI.default.createElement(S, {
    marginLeft: 1
  }, OI.default.createElement($, {
    color: "error"
  }, "You must select at least one workflow to continue")))
}
// @from(Start 14080260, End 14080262)
OI
// @from(Start 14080268, End 14080321)
EK9 = L(() => {
  hA();
  hA();
  OI = BA(VA(), 1)
})
// @from(Start 14080323, End 14081981)
async function Qx3(A, Q, B, G, Z, I, Y) {
  let J = await QQ("gh", ["api", `repos/${A}/contents/${B}`, "--jq", ".sha"]),
    W = null;
  if (J.code === 0) W = J.stdout.trim();
  let X = G;
  if (Z === "CLAUDE_CODE_OAUTH_TOKEN") X = G.replace(/anthropic_api_key: \$\{\{ secrets\.ANTHROPIC_API_KEY \}\}/g, "claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}");
  else if (Z !== "ANTHROPIC_API_KEY") X = G.replace(/anthropic_api_key: \$\{\{ secrets\.ANTHROPIC_API_KEY \}\}/g, `anthropic_api_key: \${{ secrets.${Z} }}`);
  let V = Buffer.from(X).toString("base64"),
    F = ["api", "--method", "PUT", `repos/${A}/contents/${B}`, "-f", `message=${W?`"Update ${I}"`:`"${I}"`}`, "-f", `content=${V}`, "-f", `branch=${Q}`];
  if (W) F.push("-f", `sha=${W}`);
  let K = await QQ("gh", F);
  if (K.code !== 0) {
    if (K.stderr.includes("422") && K.stderr.includes("sha")) throw GA("tengu_setup_github_actions_failed", {
      reason: "failed_to_create_workflow_file",
      exit_code: K.code,
      ...Y
    }), Error(`Failed to create workflow file ${B}: A Claude workflow file already exists in this repository. Please remove it first or update it manually.`);
    GA("tengu_setup_github_actions_failed", {
      reason: "failed_to_create_workflow_file",
      exit_code: K.code,
      ...Y
    });
    let D = `

Need help? Common issues:
` + `• Permission denied → Run: gh auth refresh -h github.com -s repo,workflow
` + `• Not authorized → Ensure you have admin access to the repository
` + "• For manual setup → Visit: https://github.com/anthropics/claude-code-action";
    throw Error(`Failed to create workflow file ${B}: ${K.stderr}${D}`)
  }
}
// @from(Start 14081982, End 14085703)
async function zK9(A, Q, B, G, Z = !1, I, Y, J) {
  try {
    GA("tengu_setup_github_actions_started", {
      skip_workflow: Z,
      has_api_key: !!Q,
      using_default_secret_name: B === "ANTHROPIC_API_KEY",
      selected_claude_workflow: I.includes("claude"),
      selected_claude_review_workflow: I.includes("claude-review"),
      ...J
    });
    let W = await QQ("gh", ["api", `repos/${A}`, "--jq", ".id"]);
    if (W.code !== 0) throw GA("tengu_setup_github_actions_failed", {
      reason: "repo_not_found",
      exit_code: W.code,
      ...J
    }), Error(`Failed to access repository ${A}`);
    let X = await QQ("gh", ["api", `repos/${A}`, "--jq", ".default_branch"]);
    if (X.code !== 0) throw GA("tengu_setup_github_actions_failed", {
      reason: "failed_to_get_default_branch",
      exit_code: X.code,
      ...J
    }), Error(`Failed to get default branch: ${X.stderr}`);
    let V = X.stdout.trim(),
      F = await QQ("gh", ["api", `repos/${A}/git/ref/heads/${V}`, "--jq", ".object.sha"]);
    if (F.code !== 0) throw GA("tengu_setup_github_actions_failed", {
      reason: "failed_to_get_branch_sha",
      exit_code: F.code,
      ...J
    }), Error(`Failed to get branch SHA: ${F.stderr}`);
    let K = F.stdout.trim(),
      D = null;
    if (!Z) {
      G(), D = `add-claude-github-actions-${Date.now()}`;
      let H = await QQ("gh", ["api", "--method", "POST", `repos/${A}/git/refs`, "-f", `ref=refs/heads/${D}`, "-f", `sha=${K}`]);
      if (H.code !== 0) throw GA("tengu_setup_github_actions_failed", {
        reason: "failed_to_create_branch",
        exit_code: H.code,
        ...J
      }), Error(`Failed to create branch: ${H.stderr}`);
      G();
      let C = [];
      if (I.includes("claude")) C.push({
        path: ".github/workflows/claude.yml",
        content: sF9,
        message: "Claude PR Assistant workflow"
      });
      if (I.includes("claude-review")) {
        let E = o2("tengu_gha_plugin_code_review");
        C.push({
          path: ".github/workflows/claude-code-review.yml",
          content: E ? tF9 : oF9,
          message: "Claude Code Review workflow"
        })
      }
      for (let E of C) await Qx3(A, D, E.path, E.content, B, E.message, J)
    }
    if (G(), Q) {
      let H = await QQ("gh", ["secret", "set", B, "--body", Q, "--repo", A]);
      if (H.code !== 0) {
        GA("tengu_setup_github_actions_failed", {
          reason: "failed_to_set_api_key_secret",
          exit_code: H.code,
          ...J
        });
        let C = `

Need help? Common issues:
` + `• Permission denied → Run: gh auth refresh -h github.com -s repo
` + `• Not authorized → Ensure you have admin access to the repository
` + "• For manual setup → Visit: https://github.com/anthropics/claude-code-action";
        throw Error(`Failed to set API key secret: ${H.stderr||"Unknown error"}${C}`)
      }
    }
    if (!Z && D) {
      G();
      let H = `https://github.com/${A}/compare/${V}...${D}?quick_pull=1&title=${encodeURIComponent(aF9)}&body=${encodeURIComponent(rF9)}`;
      await cZ(H)
    }
    GA("tengu_setup_github_actions_completed", {
      skip_workflow: Z,
      has_api_key: !!Q,
      auth_type: Y,
      using_default_secret_name: B === "ANTHROPIC_API_KEY",
      selected_claude_workflow: I.includes("claude"),
      selected_claude_review_workflow: I.includes("claude-review"),
      ...J
    }), c0({
      ...N1(),
      githubActionSetupCount: (N1().githubActionSetupCount ?? 0) + 1
    })
  } catch (W) {
    if (!W || !(W instanceof Error) || !W.message.includes("Failed to")) GA("tengu_setup_github_actions_failed", {
      reason: "unexpected_error",
      ...J
    });
    if (W instanceof Error) AA(W);
    throw W
  }
}
// @from(Start 14085708, End 14085773)
UK9 = L(() => {
  _8();
  gM();
  u2();
  q0();
  g1();
  jQ()
})
// @from(Start 14085776, End 14092028)
function wK9({
  onSuccess: A,
  onCancel: Q
}) {
  let [B, G] = F4.useState({
    state: "starting"
  }), [Z] = F4.useState(() => new KRA), [I, Y] = F4.useState(""), [J, W] = F4.useState(0), [X, V] = F4.useState(!1), F = F4.useRef(new Set), K = WB(), D = Math.max(50, K.columns - $K9.length - 4);
  f1((U, q) => {
    if (B.state === "error")
      if (q.return && B.toRetry) Y(""), W(0), G({
        state: "about_to_retry",
        nextState: B.toRetry
      });
      else Q()
  });
  async function H(U, q) {
    try {
      let [w, N] = U.split("#");
      if (!w || !N) {
        G({
          state: "error",
          message: "Invalid code. Please make sure the full code was copied",
          toRetry: {
            state: "waiting_for_login",
            url: q
          }
        });
        return
      }
      GA("tengu_oauth_manual_entry", {}), Z.handleManualAuthCodeInput({
        authorizationCode: w,
        state: N
      })
    } catch (w) {
      AA(w instanceof Error ? w : Error(String(w))), G({
        state: "error",
        message: w.message,
        toRetry: {
          state: "waiting_for_login",
          url: q
        }
      })
    }
  }
  let C = F4.useCallback(async () => {
    F.current.forEach((U) => clearTimeout(U)), F.current.clear();
    try {
      let U = await Z.startOAuthFlow(async (N) => {
        G({
          state: "waiting_for_login",
          url: N
        });
        let R = setTimeout(() => V(!0), 3000);
        F.current.add(R)
      }, {
        loginWithClaudeAi: !0,
        inferenceOnly: !0,
        expiresIn: 31536000
      });
      if (!gH()) await kJ();
      G({
        state: "processing"
      });
      let q = gzA(U);
      if (q.warning) GA("tengu_oauth_storage_warning", {
        warning: q.warning
      });
      let w = setTimeout(() => {
        G({
          state: "success",
          token: U.accessToken
        });
        let N = setTimeout(() => {
          A(U.accessToken)
        }, 1000);
        F.current.add(N)
      }, 100);
      F.current.add(w)
    } catch (U) {
      let q = U.message;
      if (!gH()) await kJ();
      G({
        state: "error",
        message: q,
        toRetry: {
          state: "starting"
        }
      }), AA(U instanceof Error ? U : Error(String(U))), GA("tengu_oauth_error", {
        error: q
      })
    }
  }, [Z, A]);
  F4.useEffect(() => {
    if (B.state === "starting") C()
  }, [B.state, C]), F4.useEffect(() => {
    if (B.state === "about_to_retry") {
      if (!gH()) kJ();
      let U = setTimeout(() => {
        if (B.nextState.state === "waiting_for_login") V(!0);
        else V(!1);
        G(B.nextState)
      }, 500);
      F.current.add(U)
    }
  }, [B]), F4.useEffect(() => {
    let U = F.current;
    return () => {
      Z.cleanup(), U.forEach((q) => clearTimeout(q)), U.clear()
    }
  }, [Z]);

  function E() {
    switch (B.state) {
      case "starting":
        return F4.default.createElement(S, null, F4.default.createElement(g4, null), F4.default.createElement($, null, "Starting authentication…"));
      case "waiting_for_login":
        return F4.default.createElement(S, {
          flexDirection: "column",
          gap: 1
        }, !X && F4.default.createElement(S, null, F4.default.createElement(g4, null), F4.default.createElement($, null, "Opening browser to sign in with your Claude account…")), X && F4.default.createElement(S, null, F4.default.createElement($, null, $K9), F4.default.createElement(s4, {
          value: I,
          onChange: Y,
          onSubmit: (U) => H(U, B.url),
          cursorOffset: J,
          onChangeCursorOffset: W,
          columns: D
        })));
      case "processing":
        return F4.default.createElement(S, null, F4.default.createElement(g4, null), F4.default.createElement($, null, "Processing authentication…"));
      case "success":
        return F4.default.createElement(S, {
          flexDirection: "column",
          gap: 1
        }, F4.default.createElement($, {
          color: "success"
        }, "✓ Authentication token created successfully!"), F4.default.createElement($, {
          dimColor: !0
        }, "Using token for GitHub Actions setup…"));
      case "error":
        return F4.default.createElement(S, {
          flexDirection: "column",
          gap: 1
        }, F4.default.createElement($, {
          color: "error"
        }, "OAuth error: ", B.message), B.toRetry ? F4.default.createElement($, {
          dimColor: !0
        }, "Press Enter to try again, or any other key to cancel") : F4.default.createElement($, {
          dimColor: !0
        }, "Press any key to return to API key selection"));
      case "about_to_retry":
        return F4.default.createElement(S, {
          flexDirection: "column",
          gap: 1
        }, F4.default.createElement($, {
          color: "permission"
        }, "Retrying…"));
      default:
        return null
    }
  }
  return F4.default.createElement(S, {
    flexDirection: "column",
    gap: 1
  }, B.state === "starting" && F4.default.createElement(S, {
    flexDirection: "column",
    gap: 1,
    paddingBottom: 1
  }, F4.default.createElement($, {
    bold: !0
  }, "Create Authentication Token"), F4.default.createElement($, {
    dimColor: !0
  }, "Creating a long-lived token for GitHub Actions")), B.state !== "success" && B.state !== "starting" && B.state !== "processing" && F4.default.createElement(S, {
    key: "header",
    flexDirection: "column",
    gap: 1,
    paddingBottom: 1
  }, F4.default.createElement($, {
    bold: !0
  }, "Create Authentication Token"), F4.default.createElement($, {
    dimColor: !0
  }, "Creating a long-lived token for GitHub Actions")), B.state === "waiting_for_login" && X && F4.default.createElement(S, {
    flexDirection: "column",
    key: "urlToCopy",
    gap: 1,
    paddingBottom: 1
  }, F4.default.createElement(S, {
    paddingX: 1
  }, F4.default.createElement($, {
    dimColor: !0
  }, "Browser didn't open? Use the url below to sign in:")), F4.default.createElement(S, {
    width: 1000
  }, F4.default.createElement($, {
    dimColor: !0
  }, B.url))), F4.default.createElement(S, {
    paddingLeft: 1,
    flexDirection: "column",
    gap: 1
  }, E()))
}
// @from(Start 14092033, End 14092035)
F4
// @from(Start 14092037, End 14092075)
$K9 = "Paste code here if prompted > "
// @from(Start 14092081, End 14092199)
qK9 = L(() => {
  hA();
  ZY();
  q80();
  gB();
  q0();
  DY();
  g1();
  i8();
  Bh();
  nt();
  F4 = BA(VA(), 1)
})