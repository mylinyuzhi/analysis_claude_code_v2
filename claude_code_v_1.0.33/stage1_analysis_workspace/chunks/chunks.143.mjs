
// @from(Start 13553935, End 13555689)
function g69(A, Q, B = !1) {
  if (B) return {
    messages: A
  };
  let G = new Set(Q.filter((V) => V.renderGroupedToolUse).map((V) => V.name)),
    Z = new Map;
  for (let V of A) {
    let F = sW0(V);
    if (F && G.has(F.toolName)) {
      let K = `${F.messageId}:${F.toolName}`,
        D = Z.get(K) ?? [];
      D.push(V), Z.set(K, D)
    }
  }
  let I = new Map,
    Y = new Set;
  for (let [V, F] of Z)
    if (F.length >= 2) {
      I.set(V, F);
      for (let K of F) {
        let D = sW0(K);
        if (D) Y.add(D.toolUseId)
      }
    } let J = new Map;
  for (let V of A)
    if (V.type === "user") {
      for (let F of V.message.content)
        if (F.type === "tool_result" && Y.has(F.tool_use_id)) J.set(F.tool_use_id, V)
    } let W = [],
    X = new Set;
  for (let V of A) {
    let F = sW0(V);
    if (F) {
      let K = `${F.messageId}:${F.toolName}`,
        D = I.get(K);
      if (D) {
        if (!X.has(K)) {
          X.add(K);
          let H = D[0],
            C = [];
          for (let U of D) {
            let q = U.message.content[0].id,
              w = J.get(q);
            if (w) C.push(w)
          }
          let E = {
            type: "grouped_tool_use",
            toolName: F.toolName,
            messages: D,
            results: C,
            displayMessage: H,
            uuid: `grouped-${H.uuid}`,
            timestamp: H.timestamp,
            messageId: F.messageId
          };
          W.push(E)
        }
        continue
      }
    }
    if (V.type === "user") {
      let K = V.message.content.filter((D) => D.type === "tool_result");
      if (K.length > 0) {
        if (K.every((H) => Y.has(H.tool_use_id))) continue
      }
    }
    W.push(V)
  }
  return {
    messages: W
  }
}
// @from(Start 13555691, End 13555887)
function jjA(A) {
  if (!A) return 0;
  return A.activeAgents.filter((Q) => Q.source !== "built-in").reduce((Q, B) => {
    let G = `${B.agentType}: ${B.whenToUse}`;
    return Q + gG(G)
  }, 0)
}
// @from(Start 13555892, End 13555903)
jQA = 15000
// @from(Start 13555909, End 13555934)
rW0 = L(() => {
  xM()
})
// @from(Start 13555979, End 13556040)
function u69(A) {
  return wj3.filter((Q) => Q.isActive(A))
}
// @from(Start 13556045, End 13556047)
AB
// @from(Start 13556049, End 13556052)
Fj3
// @from(Start 13556054, End 13556057)
Kj3
// @from(Start 13556059, End 13556062)
Dj3
// @from(Start 13556064, End 13556067)
Hj3
// @from(Start 13556069, End 13556072)
Cj3
// @from(Start 13556074, End 13556077)
Ej3
// @from(Start 13556079, End 13556082)
zj3
// @from(Start 13556084, End 13556087)
Uj3
// @from(Start 13556089, End 13556092)
$j3
// @from(Start 13556094, End 13556097)
wj3
// @from(Start 13556103, End 13563266)
m69 = L(() => {
  hA();
  gE();
  V9();
  U2();
  gB();
  lK();
  _0();
  rW0();
  u2();
  nY();
  Fe1();
  AB = BA(VA(), 1), Fj3 = {
    id: "large-memory-files",
    type: "warning",
    isActive: () => {
      return M1A().length > 0
    },
    render: () => {
      let A = M1A();
      return AB.createElement(AB.Fragment, null, A.map((Q) => {
        let B = Q.path.startsWith(W0()) ? Vj3(W0(), Q.path) : Q.path;
        return AB.createElement(S, {
          key: Q.path,
          flexDirection: "row"
        }, AB.createElement($, {
          color: "warning"
        }, H1.warning), AB.createElement($, {
          color: "warning"
        }, "Large ", AB.createElement($, {
          bold: !0
        }, B), " will impact performance (", JZ(Q.content.length), " chars >", " ", JZ(Lh), ")", AB.createElement($, {
          dimColor: !0
        }, " • /memory to edit")))
      }))
    }
  }, Kj3 = {
    id: "ultra-claude-md",
    type: "warning",
    isActive: () => {
      let A = O1A();
      return A !== null && A.content.length > wYA
    },
    render: () => {
      let A = O1A();
      if (!A) return null;
      let Q = A.content.length;
      return AB.createElement(S, {
        flexDirection: "row",
        gap: 1
      }, AB.createElement($, {
        color: "warning"
      }, H1.warning), AB.createElement($, {
        color: "warning"
      }, "CLAUDE.md entries marked as IMPORTANT exceed", " ", wYA, " chars (", Q, " chars)", AB.createElement($, {
        dimColor: !0
      }, " • /memory to edit")))
    }
  }, Dj3 = {
    id: "claude-ai-external-token",
    type: "warning",
    isActive: () => {
      let A = kc();
      return BB() && (A.source === "ANTHROPIC_AUTH_TOKEN" || A.source === "apiKeyHelper")
    },
    render: () => {
      let A = kc();
      return AB.createElement(S, {
        flexDirection: "row",
        marginTop: 1
      }, AB.createElement($, {
        color: "warning"
      }, H1.warning), AB.createElement($, {
        color: "warning"
      }, "Auth conflict: Using ", A.source, " instead of Claude account subscription token. Either unset ", A.source, ", or run `claude /logout`."))
    }
  }, Hj3 = {
    id: "api-key-conflict",
    type: "warning",
    isActive: () => {
      let {
        source: A
      } = cw({
        skipRetrievingKeyFromApiKeyHelper: N6()
      });
      return !!hzA() && (A === "ANTHROPIC_API_KEY" || A === "apiKeyHelper")
    },
    render: () => {
      let {
        source: A
      } = cw({
        skipRetrievingKeyFromApiKeyHelper: N6()
      });
      return AB.createElement(S, {
        flexDirection: "row",
        marginTop: 1
      }, AB.createElement($, {
        color: "warning"
      }, H1.warning), AB.createElement($, {
        color: "warning"
      }, "Auth conflict: Using ", A, " instead of Anthropic Console key. Either unset ", A, ", or run `claude /logout`."))
    }
  }, Cj3 = {
    id: "both-auth-methods",
    type: "warning",
    isActive: () => {
      let {
        source: A
      } = cw({
        skipRetrievingKeyFromApiKeyHelper: N6()
      }), Q = kc();
      return A !== "none" && Q.source !== "none" && !(A === "apiKeyHelper" && Q.source === "apiKeyHelper")
    },
    render: () => {
      let {
        source: A
      } = cw({
        skipRetrievingKeyFromApiKeyHelper: N6()
      }), Q = kc();
      return AB.createElement(S, {
        flexDirection: "column",
        marginTop: 1
      }, AB.createElement(S, {
        flexDirection: "row"
      }, AB.createElement($, {
        color: "warning"
      }, H1.warning), AB.createElement($, {
        color: "warning"
      }, "Auth conflict: Both a token (", Q.source, ") and an API key (", A, ") are set. This may lead to unexpected behavior.")), AB.createElement(S, {
        flexDirection: "column",
        marginLeft: 3
      }, AB.createElement($, {
        color: "warning"
      }, "• Trying to use", " ", Q.source === "claude.ai" ? "claude.ai" : Q.source, "?", " ", A === "ANTHROPIC_API_KEY" ? 'Unset the ANTHROPIC_API_KEY environment variable, or claude /logout then say "No" to the API key approval before login.' : A === "apiKeyHelper" ? "Unset the apiKeyHelper setting." : "claude /logout"), AB.createElement($, {
        color: "warning"
      }, "• Trying to use ", A, "?", " ", Q.source === "claude.ai" ? "claude /logout to sign out of claude.ai." : `Unset the ${Q.source} environment variable.`)))
    }
  }, Ej3 = {
    id: "sonnet-1m-welcome",
    type: "info",
    isActive: (A) => A.showSonnet1MNotice === !0,
    render: () => {
      return AB.createElement(S, {
        flexDirection: "column",
        marginTop: 1
      }, AB.createElement($, {
        bold: !0
      }, "You now have access to Sonnet 4 with 1M context (uses more rate limits than Sonnet on long requests) • Update in /model"))
    }
  }, zj3 = {
    id: "opus-4.5-available",
    type: "info",
    isActive: (A) => A.showOpus45Notice === !0,
    render: () => {
      let Q = V6() !== "firstParty",
        B = f4(),
        G = B === "max",
        Z = B === "team",
        I = B === "pro",
        Y;
      if (G || Z) Y = AB.createElement($, {
        dimColor: !0
      }, "Welcome to Opus 4.5");
      else if (I)
        if (o2("tengu_backstage_only")) Y = AB.createElement($, {
          dimColor: !0
        }, "/upgrade or /extra-usage for Opus 4.5");
        else Y = AB.createElement($, {
          dimColor: !0
        }, "/model to try Opus 4.5");
      else if (Q) Y = AB.createElement($, {
        dimColor: !0
      }, "/model to try Opus 4.5. Note: you may need to request access from your cloud provider");
      else Y = AB.createElement($, {
        dimColor: !0
      }, "/model to try Opus 4.5");
      return AB.createElement(S, {
        marginLeft: 1
      }, Y)
    }
  }, Uj3 = {
    id: "large-agent-descriptions",
    type: "warning",
    isActive: (A) => {
      return jjA(A.agentDefinitions) > jQA
    },
    render: (A) => {
      let Q = jjA(A.agentDefinitions);
      return AB.createElement(S, {
        flexDirection: "row"
      }, AB.createElement($, {
        color: "warning"
      }, H1.warning), AB.createElement($, {
        color: "warning"
      }, "Large cumulative agent descriptions will impact performance (~", JZ(Q), " tokens >", " ", JZ(jQA), ")", AB.createElement($, {
        dimColor: !0
      }, " • /agents to manage")))
    }
  }, $j3 = {
    id: "jetbrains-plugin-install",
    type: "info",
    isActive: (A) => {
      if (!DLA()) return !1;
      if (!(A.config.autoInstallIdeExtension ?? !0)) return !1;
      let B = UIA();
      return B !== null && !lQ2(B)
    },
    render: () => {
      let A = UIA(),
        Q = aF(A);
      return AB.createElement(S, {
        flexDirection: "row",
        gap: 1,
        marginLeft: 1
      }, AB.createElement($, {
        color: "ide"
      }, H1.arrowUp), AB.createElement($, null, "Install the ", AB.createElement($, {
        color: "ide"
      }, Q), " plugin from the JetBrains Marketplace:", " ", AB.createElement($, {
        bold: !0
      }, "https://docs.claude.com/s/claude-code-jetbrains")))
    }
  }, wj3 = [Fj3, Kj3, Uj3, Dj3, Hj3, Cj3, Ej3, zj3, $j3]
})
// @from(Start 13563269, End 13564472)
function d69({
  agentDefinitions: A
} = {}) {
  let Q = N1(),
    B = t6()?.organizationUuid,
    Z = (B ? Q.s1mAccessCache?.[B] : void 0)?.hasAccessNotAsDefault,
    I = B && Q.hasShownS1MWelcomeV2?.[B],
    Y = BB() && Z && !I,
    W = !(B && Q.hasShownOpus45Notice?.[B]),
    X = {
      config: Q,
      showSonnet1MNotice: Y,
      showOpus45Notice: W,
      agentDefinitions: A
    },
    V = u69(X);
  if (vg.useEffect(() => {
      if (!B) return;
      let F = V.some((D) => D.id === "sonnet-1m-welcome"),
        K = V.some((D) => D.id === "opus-4.5-available");
      if (F) GA("tengu_sonnet_1m_notice_shown", {});
      if (K) GA("tengu_opus_45_notice_shown", {});
      if (F || K) c0({
        ...Q,
        ...F && {
          hasShownS1MWelcomeV2: {
            ...Q.hasShownS1MWelcomeV2,
            [B]: !0
          }
        },
        ...K && {
          hasShownOpus45Notice: {
            ...Q.hasShownOpus45Notice,
            [B]: !0
          }
        }
      })
    }, [V, Q, B]), V.length === 0) return null;
  return vg.createElement(S, {
    flexDirection: "column",
    paddingLeft: 1
  }, V.map((F) => vg.createElement(vg.Fragment, {
    key: F.id
  }, F.render(X))))
}
// @from(Start 13564477, End 13564479)
vg
// @from(Start 13564485, End 13564563)
c69 = L(() => {
  hA();
  jQ();
  m69();
  q0();
  gB();
  vg = BA(VA(), 1)
})
// @from(Start 13564566, End 13564666)
function p69(A, Q) {
  let B = new Set;
  for (let G of A)
    if (!Q.has(G)) B.add(G);
  return B
}
// @from(Start 13564668, End 13564751)
function l69(A, Q) {
  for (let B of A)
    if (!Q.has(B)) return !1;
  return !0
}
// @from(Start 13564753, End 13565198)
function i69({
  message: A,
  isTranscriptMode: Q
}) {
  if (!(Q && A.timestamp && A.type === "assistant" && A.message.content.some((Z) => Z.type === "text"))) return null;
  let G = new Date(A.timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !0
  });
  return oW0.default.createElement(S, {
    marginTop: 1,
    minWidth: G.length
  }, oW0.default.createElement($, {
    dimColor: !0
  }, G))
}
// @from(Start 13565203, End 13565206)
oW0
// @from(Start 13565212, End 13565258)
n69 = L(() => {
  hA();
  oW0 = BA(VA(), 1)
})
// @from(Start 13565261, End 13565634)
function a69({
  message: A,
  isTranscriptMode: Q
}) {
  if (!(Q && A.type === "assistant" && A.message.model && A.message.content.some((G) => G.type === "text"))) return null;
  return tW0.default.createElement(S, {
    marginTop: 1,
    marginLeft: 1,
    minWidth: A.message.model.length + 8
  }, tW0.default.createElement($, {
    dimColor: !0
  }, A.message.model))
}
// @from(Start 13565639, End 13565642)
tW0
// @from(Start 13565648, End 13565694)
s69 = L(() => {
  hA();
  tW0 = BA(VA(), 1)
})
// @from(Start 13565697, End 13566236)
function r69(A) {
  let [Q, B] = oXA.useState(1), [G, Z] = oXA.useState(-1);
  return f1((I, Y) => {
    if (Y.escape && G === -1) Z(0)
  }, {
    isActive: A
  }), oXA.useEffect(() => {
    if (!A) {
      Z(-1), B(0);
      return
    }
  }, [A]), oXA.useEffect(() => {
    if (G === -1) return;
    let I = [1, 0, 1, 2, 2, 1, 0, 0, 0, 1, 2, 2, 1];
    if (G >= I.length) {
      Z(-1), B(1);
      return
    }
    B(I[G]);
    let Y = setTimeout(() => {
      Z((J) => J + 1)
    }, 60);
    return () => clearTimeout(Y)
  }, [G]), Q
}
// @from(Start 13566241, End 13566244)
oXA
// @from(Start 13566250, End 13566296)
o69 = L(() => {
  hA();
  oXA = BA(VA(), 1)
})
// @from(Start 13566298, End 13566585)
async function eW0() {
  if (N6()) return;
  if (process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return;
  let A = await YQ.get(Nj3);
  if (A.status === 200) {
    let Q = N1();
    c0({
      ...Q,
      cachedChangelog: A.data,
      changelogLastFetched: Date.now()
    })
  }
}
// @from(Start 13566587, End 13566641)
function SQA() {
  return N1().cachedChangelog ?? ""
}
// @from(Start 13566643, End 13567231)
function wI1(A) {
  try {
    if (!A) return {};
    let Q = {},
      B = A.split(/^## /gm).slice(1);
    for (let G of B) {
      let Z = G.trim().split(`
`);
      if (Z.length === 0) continue;
      let I = Z[0];
      if (!I) continue;
      let Y = I.split(" - ")[0]?.trim() || "";
      if (!Y) continue;
      let J = Z.slice(1).filter((W) => W.trim().startsWith("- ")).map((W) => W.trim().substring(2).trim()).filter(Boolean);
      if (J.length > 0) Q[Y] = J
    }
    return Q
  } catch (Q) {
    return AA(Q instanceof Error ? Q : Error("Failed to parse changelog")), {}
  }
}
// @from(Start 13567233, End 13567731)
function Lj3(A, Q, B = SQA()) {
  try {
    let G = wI1(B),
      Z = Da.coerce(A),
      I = Q ? Da.coerce(Q) : null;
    if (!I || Z && Da.gt(Z, I, {
        loose: !0
      })) return Object.entries(G).filter(([Y]) => !I || Da.gt(Y, I, {
      loose: !0
    })).sort(([Y], [J]) => Da.gt(Y, J, {
      loose: !0
    }) ? -1 : 1).flatMap(([Y, J]) => J).filter(Boolean).slice(0, qj3)
  } catch (G) {
    return AA(G instanceof Error ? G : Error("Failed to get release notes")), []
  }
  return []
}
// @from(Start 13567733, End 13568180)
function AX0(A = SQA()) {
  try {
    let Q = wI1(A);
    return Object.keys(Q).sort((G, Z) => Da.gt(G, Z, {
      loose: !0
    }) ? 1 : -1).map((G) => {
      let Z = Q[G];
      if (!Z || Z.length === 0) return null;
      let I = Z.filter(Boolean);
      if (I.length === 0) return null;
      return [G, I]
    }).filter((G) => G !== null)
  } catch (Q) {
    return AA(Q instanceof Error ? Q : Error("Failed to get release notes")), []
  }
}
// @from(Start 13568182, End 13568705)
function SjA(A, Q = {
  ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
  PACKAGE_URL: "@anthropic-ai/claude-code",
  README_URL: "https://code.claude.com/docs/en/overview",
  VERSION: "2.0.59",
  FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
}.VERSION) {
  if (A !== Q || !SQA()) eW0().catch((Z) => AA(Z instanceof Error ? Z : Error("Failed to fetch changelog")));
  let B = Lj3(Q, A);
  return {
    hasReleaseNotes: B.length > 0,
    releaseNotes: B
  }
}
// @from(Start 13568710, End 13568712)
Da
// @from(Start 13568714, End 13568721)
qj3 = 5
// @from(Start 13568725, End 13568797)
t69 = "https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md"
// @from(Start 13568801, End 13568894)
Nj3 = "https://raw.githubusercontent.com/anthropics/claude-code/refs/heads/main/CHANGELOG.md"
// @from(Start 13568900, End 13568969)
tXA = L(() => {
  g1();
  O3();
  jQ();
  _0();
  Da = BA(KU(), 1)
})
// @from(Start 13568972, End 13569046)
function Q59(A) {
  if (A >= 70) return "horizontal";
  return "compact"
}
// @from(Start 13569048, End 13569486)
function B59(A, Q, B) {
  if (Q === "horizontal") {
    let Z = B,
      I = QX0 + NI1 + qI1 + Z,
      Y = A - I,
      J = Math.max(30, Y),
      W = Math.min(Z + J + qI1 + NI1, A - QX0);
    if (W < Z + J + qI1 + NI1) J = W - Z - qI1 - NI1;
    return {
      leftWidth: Z,
      rightWidth: J,
      totalWidth: W
    }
  }
  let G = Math.min(A - QX0, A59 + 20);
  return {
    leftWidth: G,
    rightWidth: G,
    totalWidth: G
  }
}
// @from(Start 13569488, End 13569597)
function G59(A, Q, B) {
  let G = Math.max(A.length, Q.length, B.length, 20);
  return Math.min(G + 4, A59)
}
// @from(Start 13569599, End 13569700)
function MI1(A) {
  if (!A || A.length > Mj3) return "Welcome back!";
  return `Welcome back ${A}!`
}
// @from(Start 13569702, End 13570676)
function kjA(A, Q) {
  if (A.length <= Q) return A;
  let B = "/",
    G = "…",
    Z = A.split(B),
    I = Z[0] || "",
    Y = Z[Z.length - 1] || "";
  if (Z.length === 1) return A.substring(0, Q - G.length) + G;
  if (I === "" && G.length + B.length + Y.length >= Q) return `${B}${Y.substring(0,Q-G.length-B.length)}${G}`;
  if (I !== "" && G.length * 2 + B.length + Y.length >= Q) return `${G}${B}${Y.substring(0,Q-G.length*2-B.length)}${G}`;
  if (Z.length === 2) return `${I.substring(0,Q-G.length-B.length-Y.length)}${G}${B}${Y}`;
  let J = Q - I.length - Y.length - G.length - 2 * B.length;
  if (J <= 0) return `${I.substring(0,Math.max(0,Q-Y.length-G.length-2*B.length))}${B}${G}${B}${Y}`;
  let W = [];
  for (let X = Z.length - 2; X > 0; X--) {
    let V = Z[X];
    if (V && V.length + B.length <= J) W.unshift(V), J -= V.length + B.length;
    else break
  }
  if (W.length === 0) return `${I}${B}${G}${B}${Y}`;
  return `${I}${B}${G}${B}${W.join(B)}${B}${Y}`
}
// @from(Start 13570677, End 13571155)
async function Z59() {
  if (LI1) return LI1;
  let A = e1();
  return LI1 = eP(10).then((Q) => {
    return _jA = Q.filter((B) => {
      if (B.isSidechain) return !1;
      if (B.leafUuid === A) return !1;
      if (B.summary?.includes("I apologize")) return !1;
      let G = B.summary && B.summary !== "No prompt",
        Z = B.firstPrompt && B.firstPrompt !== "No prompt";
      return G || Z
    }).slice(0, 3), _jA
  }).catch(() => {
    return _jA = [], _jA
  }), LI1
}
// @from(Start 13571157, End 13571188)
function I59() {
  return _jA
}
// @from(Start 13571190, End 13571758)
function OI1() {
  let A = {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.0.59",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
    }.VERSION,
    Q = Q5(W0()),
    B = k3(),
    G = zCB(B),
    Z = BB() ? mv1() : "API Usage Billing",
    I = $T().agent;
  return {
    version: A,
    cwd: Q,
    modelDisplayName: G,
    billingType: Z,
    agentName: I
  }
}
// @from(Start 13571760, End 13572035)
function Y59(A, Q, B) {
  if (A.length + 3 + Q.length > B) return {
    shouldSplit: !0,
    truncatedModel: J7(A, B),
    truncatedBilling: J7(Q, B)
  };
  return {
    shouldSplit: !1,
    truncatedModel: J7(A, Math.max(B - Q.length - 3, 10)),
    truncatedBilling: Q
  }
}
// @from(Start 13572037, End 13572313)
function J59(A) {
  let Q = SQA();
  if (!Q) return [];
  let B = wI1(Q),
    G = [],
    Z = Object.keys(B).sort((I, Y) => e69.gt(I, Y, {
      loose: !0
    }) ? -1 : 1).slice(0, 3);
  for (let I of Z) {
    let Y = B[I];
    if (Y) G.push(...Y)
  }
  return G.slice(0, A)
}
// @from(Start 13572318, End 13572321)
e69
// @from(Start 13572323, End 13572331)
A59 = 50
// @from(Start 13572335, End 13572343)
Mj3 = 20
// @from(Start 13572347, End 13572354)
QX0 = 4
// @from(Start 13572358, End 13572365)
qI1 = 1
// @from(Start 13572369, End 13572376)
NI1 = 2
// @from(Start 13572380, End 13572383)
_jA
// @from(Start 13572385, End 13572395)
LI1 = null
// @from(Start 13572401, End 13572516)
RI1 = L(() => {
  tXA();
  S7();
  _0();
  U2();
  R9();
  gB();
  t2();
  MB();
  e69 = BA(KU(), 1);
  _jA = []
})
// @from(Start 13572519, End 13573239)
function BX0() {
  if (d0.terminal === "Apple_Terminal") return F5.createElement(Oj3, null);
  return F5.createElement(S, {
    flexDirection: "column"
  }, F5.createElement($, null, F5.createElement($, {
    color: "clawd_body"
  }, " ▐"), F5.createElement($, {
    color: "clawd_body",
    backgroundColor: "clawd_background"
  }, "▛███▜"), F5.createElement($, {
    color: "clawd_body"
  }, "▌")), F5.createElement($, null, F5.createElement($, {
    color: "clawd_body"
  }, "▝▜"), F5.createElement($, {
    color: "clawd_body",
    backgroundColor: "clawd_background"
  }, "█████"), F5.createElement($, {
    color: "clawd_body"
  }, "▛▘")), F5.createElement($, {
    color: "clawd_body"
  }, "  ", "▘▘ ▝▝", "  "))
}
// @from(Start 13573241, End 13573748)
function Oj3() {
  return F5.createElement(S, {
    flexDirection: "column",
    alignItems: "center"
  }, F5.createElement($, null, F5.createElement($, {
    color: "clawd_body"
  }, "▗"), F5.createElement($, {
    color: "clawd_background",
    backgroundColor: "clawd_body"
  }, " ", "▗", "   ", "▖", " "), F5.createElement($, {
    color: "clawd_body"
  }, "▖")), F5.createElement($, {
    backgroundColor: "clawd_body"
  }, " ".repeat(7)), F5.createElement($, {
    color: "clawd_body"
  }, "▘▘ ▝▝"))
}
// @from(Start 13573753, End 13573755)
F5
// @from(Start 13573761, End 13573814)
W59 = L(() => {
  hA();
  c5();
  F5 = BA(VA(), 1)
})
// @from(Start 13573817, End 13574329)
function X59(A) {
  let {
    title: Q,
    lines: B,
    footer: G,
    emptyMessage: Z,
    customContent: I
  } = A, Y = Q.length;
  if (I !== void 0) Y = Math.max(Y, I.width);
  else if (B.length === 0 && Z) Y = Math.max(Y, Z.length);
  else {
    let W = Math.max(0, ...B.map((X) => X.timestamp ? X.timestamp.length : 0));
    for (let X of B) {
      let V = W > 0 ? W : 0,
        F = X.text.length + (V > 0 ? V + 2 : 0);
      Y = Math.max(Y, F)
    }
  }
  if (G) Y = Math.max(Y, G.length);
  return Y
}
// @from(Start 13574331, End 13575331)
function V59({
  config: A,
  actualWidth: Q
}) {
  let {
    title: B,
    lines: G,
    footer: Z,
    emptyMessage: I,
    customContent: Y
  } = A, J = "  ", W = Math.max(0, ...G.map((X) => X.timestamp ? X.timestamp.length : 0));
  return t7.createElement(S, {
    flexDirection: "column",
    width: Q
  }, t7.createElement($, {
    bold: !0,
    color: "claude"
  }, B), Y ? t7.createElement(t7.Fragment, null, Y.content, Z && t7.createElement($, {
    dimColor: !0,
    italic: !0
  }, J7(Z, Q))) : G.length === 0 && I ? t7.createElement($, {
    dimColor: !0
  }, J7(I, Q)) : t7.createElement(t7.Fragment, null, G.map((X, V) => {
    let F = Math.max(10, Q - (W > 0 ? W + 2 : 0));
    return t7.createElement($, {
      key: V
    }, W > 0 && t7.createElement(t7.Fragment, null, t7.createElement($, {
      dimColor: !0
    }, (X.timestamp || "").padEnd(W)), "  "), t7.createElement($, null, J7(X.text, F)))
  }), Z && t7.createElement($, {
    dimColor: !0,
    italic: !0
  }, J7(Z, Q))))
}
// @from(Start 13575336, End 13575338)
t7
// @from(Start 13575344, End 13575389)
F59 = L(() => {
  hA();
  t7 = BA(VA(), 1)
})
// @from(Start 13575392, End 13575789)
function K59({
  feeds: A,
  maxWidth: Q
}) {
  let B = A.map((I) => X59(I)),
    G = Math.max(...B),
    Z = Math.min(G, Q);
  return Aj.createElement(S, {
    flexDirection: "column"
  }, A.map((I, Y) => Aj.createElement(Aj.Fragment, {
    key: Y
  }, Aj.createElement(V59, {
    config: I,
    actualWidth: Z
  }), Y < A.length - 1 && Aj.createElement(D3, {
    dividerColor: "claude"
  }))))
}
// @from(Start 13575794, End 13575796)
Aj
// @from(Start 13575802, End 13575864)
D59 = L(() => {
  hA();
  F59();
  BK();
  Aj = BA(VA(), 1)
})
// @from(Start 13575906, End 13576264)
function TI1(A) {
  let Q = A.map((B) => {
    let G = Yt(B.modified);
    return {
      text: (B.summary && B.summary !== "No prompt" ? B.summary : B.firstPrompt) || "",
      timestamp: G
    }
  });
  return {
    title: "Recent activity",
    lines: Q,
    footer: Q.length > 0 ? "/resume for more" : void 0,
    emptyMessage: "No recent activity"
  }
}
// @from(Start 13576266, End 13576593)
function H59(A) {
  let Q = A.map((G) => {
      return {
        text: G
      }
    }),
    B = "Check the Claude Code changelog for updates";
  return {
    title: "What's new",
    lines: Q,
    footer: Q.length > 0 ? "/release-notes for more" : void 0,
    emptyMessage: "Check the Claude Code changelog for updates"
  }
}
// @from(Start 13576595, End 13577117)
function C59(A) {
  let B = A.filter(({
      isEnabled: Z
    }) => Z).sort((Z, I) => Number(Z.isComplete) - Number(I.isComplete)).map(({
      text: Z,
      isComplete: I
    }) => {
      return {
        text: `${I?`${H1.tick} `:""}${Z}`
      }
    }),
    G = W0() === Rj3() ? "Note: You have launched claude in your home directory. For the best experience, launch it in a project directory instead." : void 0;
  if (G) B.push({
    text: G
  });
  return {
    title: "Tips for getting started",
    lines: B
  }
}
// @from(Start 13577119, End 13577523)
function E59() {
  return {
    title: "3 guest passes",
    lines: [],
    customContent: {
      content: vO.createElement(vO.Fragment, null, vO.createElement(S, {
        marginY: 1
      }, vO.createElement($, {
        color: "claude"
      }, "[✻] [✻] [✻]")), vO.createElement($, {
        dimColor: !0
      }, "Share Claude Code with friends")),
      width: 30
    },
    footer: "/passes"
  }
}
// @from(Start 13577528, End 13577530)
vO
// @from(Start 13577536, End 13577597)
z59 = L(() => {
  V9();
  U2();
  hA();
  vO = BA(VA(), 1)
})
// @from(Start 13577599, End 13577938)
async function Tj3(A = "claude_code_guest_pass") {
  let {
    accessToken: Q,
    orgUUID: B
  } = await U0A(), G = {
    ...IC(Q),
    "x-organization-uuid": B
  }, Z = `${e9().BASE_API_URL}/api/oauth/organizations/${B}/referral/eligibility`;
  return (await YQ.get(Z, {
    headers: G,
    params: {
      campaign: A
    }
  })).data
}
// @from(Start 13577939, End 13578278)
async function w59(A = "claude_code_guest_pass") {
  let {
    accessToken: Q,
    orgUUID: B
  } = await U0A(), G = {
    ...IC(Q),
    "x-organization-uuid": B
  }, Z = `${e9().BASE_API_URL}/api/oauth/organizations/${B}/referral/redemptions`;
  return (await YQ.get(Z, {
    headers: G,
    params: {
      campaign: A
    }
  })).data
}
// @from(Start 13578280, End 13578360)
function q59() {
  return !!(t6()?.organizationUuid && BB() && f4() === "max")
}
// @from(Start 13578362, End 13578852)
function N59() {
  if (!q59()) return {
    eligible: !1,
    needsRefresh: !1,
    hasCache: !1
  };
  let A = t6()?.organizationUuid;
  if (!A) return {
    eligible: !1,
    needsRefresh: !1,
    hasCache: !1
  };
  let B = N1().passesEligibilityCache?.[A];
  if (!B) return {
    eligible: !1,
    needsRefresh: !0,
    hasCache: !1
  };
  let {
    eligible: G,
    timestamp: Z
  } = B, Y = Date.now() - Z > $59;
  return {
    eligible: G,
    needsRefresh: Y,
    hasCache: !0
  }
}
// @from(Start 13578853, End 13579520)
async function U59() {
  if (yjA) return g("Passes: Reusing in-flight eligibility fetch"), yjA;
  let A = t6()?.organizationUuid;
  if (!A) return null;
  return yjA = (async () => {
    try {
      let Q = await Tj3(),
        B = N1(),
        G = {
          ...B.passesEligibilityCache,
          [A]: {
            ...Q,
            timestamp: Date.now()
          }
        };
      return c0({
        ...B,
        passesEligibilityCache: G
      }), g(`Passes eligibility cached for org ${A}: ${Q.eligible}`), Q
    } catch (Q) {
      return g("Failed to fetch and cache passes eligibility"), AA(Q), null
    } finally {
      yjA = null
    }
  })(), yjA
}
// @from(Start 13579521, End 13580064)
async function xjA() {
  if (!q59()) return null;
  let A = t6()?.organizationUuid;
  if (!A) return null;
  let B = N1().passesEligibilityCache?.[A],
    G = Date.now();
  if (!B) return g("Passes: No cache, fetching eligibility"), await U59();
  if (G - B.timestamp > $59) {
    g("Passes: Cache stale, returning cached data and refreshing in background"), U59();
    let {
      timestamp: Y,
      ...J
    } = B;
    return J
  }
  g("Passes: Using fresh cached eligibility data");
  let {
    timestamp: Z,
    ...I
  } = B;
  return I
}
// @from(Start 13580065, End 13580097)
async function L59() {
  xjA()
}
// @from(Start 13580102, End 13580115)
$59 = 3600000
// @from(Start 13580119, End 13580129)
yjA = null
// @from(Start 13580135, End 13580208)
vjA = L(() => {
  O3();
  NX();
  Fn();
  jQ();
  gB();
  V0();
  g1()
})
// @from(Start 13580211, End 13580433)
function Pj3() {
  let A = N1(),
    {
      eligible: Q,
      hasCache: B
    } = N59();
  if (!Q || !B) return !1;
  if ((A.passesUpsellSeenCount ?? 0) >= 3) return !1;
  if (A.hasVisitedPasses) return !1;
  return !0
}
// @from(Start 13580435, End 13580503)
function PI1() {
  let [A] = M59.useState(() => Pj3());
  return A
}
// @from(Start 13580505, End 13580698)
function jI1() {
  let A = N1(),
    Q = (A.passesUpsellSeenCount ?? 0) + 1;
  c0({
    ...A,
    passesUpsellSeenCount: Q
  }), GA("tengu_guest_passes_upsell_shown", {
    seen_count: Q
  })
}
// @from(Start 13580700, End 13580978)
function O59() {
  return bg.createElement($, {
    dimColor: !0
  }, bg.createElement($, {
    color: "claude"
  }, "[✻]"), " ", bg.createElement($, {
    color: "claude"
  }, "[✻]"), " ", bg.createElement($, {
    color: "claude"
  }, "[✻]"), " · 3 guest passes at /passes")
}
// @from(Start 13580983, End 13580985)
bg
// @from(Start 13580987, End 13580990)
M59
// @from(Start 13580996, End 13581085)
GX0 = L(() => {
  hA();
  jQ();
  vjA();
  q0();
  bg = BA(VA(), 1), M59 = BA(VA(), 1)
})
// @from(Start 13581088, End 13582260)
function jj3() {
  if (d0.terminal === "Apple_Terminal") return b2.createElement(S, {
    flexDirection: "column",
    alignItems: "center"
  }, b2.createElement($, null, b2.createElement($, {
    color: "clawd_body"
  }, "▗"), b2.createElement($, {
    color: "clawd_background",
    backgroundColor: "clawd_body"
  }, " ", "▗", "   ", "▖", " "), b2.createElement($, {
    color: "clawd_body"
  }, "▖")), b2.createElement($, {
    backgroundColor: "clawd_body"
  }, " ".repeat(7)), b2.createElement($, {
    color: "clawd_body"
  }, "▘▘ ▝▝"));
  return b2.createElement(S, {
    flexDirection: "column"
  }, b2.createElement($, null, b2.createElement($, {
    color: "clawd_body"
  }, " ▐"), b2.createElement($, {
    color: "clawd_body",
    backgroundColor: "clawd_background"
  }, "▛███▜"), b2.createElement($, {
    color: "clawd_body"
  }, "▌")), b2.createElement($, null, b2.createElement($, {
    color: "clawd_body"
  }, "▝▜"), b2.createElement($, {
    color: "clawd_body",
    backgroundColor: "clawd_background"
  }, "█████"), b2.createElement($, {
    color: "clawd_body"
  }, "▛▘")), b2.createElement($, {
    color: "clawd_body"
  }, "  ", "▘▘ ▝▝", "  "))
}
// @from(Start 13582262, End 13583384)
function T59() {
  let {
    columns: A
  } = WB(), {
    version: Q,
    cwd: B,
    modelDisplayName: G,
    billingType: Z,
    agentName: I
  } = OI1(), Y = PI1();
  R59.useEffect(() => {
    if (Y) jI1()
  }, [Y]);
  let J = Math.max(A - 15, 20),
    X = J7(Q, Math.max(J - "Claude Code v".length, 6)),
    {
      shouldSplit: V,
      truncatedModel: F,
      truncatedBilling: K
    } = Y59(G, Z, J),
    D = " · ",
    H = I ? J - I.length - D.length : J,
    C = kjA(B, Math.max(H, 10));
  return b2.createElement(S, {
    flexDirection: "row",
    gap: 2,
    alignItems: "center"
  }, b2.createElement(jj3, null), b2.createElement(S, {
    flexDirection: "column"
  }, b2.createElement($, null, b2.createElement($, {
    bold: !0
  }, "Claude Code"), " ", b2.createElement($, {
    dimColor: !0
  }, "v", X)), V ? b2.createElement(b2.Fragment, null, b2.createElement($, {
    dimColor: !0
  }, F), b2.createElement($, {
    dimColor: !0
  }, K)) : b2.createElement($, {
    dimColor: !0
  }, F, " · ", K), b2.createElement($, {
    dimColor: !0
  }, I ? `${I} · ${C}` : C), Y && b2.createElement(O59, null)))
}
// @from(Start 13583389, End 13583391)
b2
// @from(Start 13583393, End 13583396)
R59
// @from(Start 13583402, End 13583500)
P59 = L(() => {
  hA();
  c5();
  i8();
  RI1();
  GX0();
  b2 = BA(VA(), 1), R59 = BA(VA(), 1)
})
// @from(Start 13583506, End 13583547)
bjA = L(() => {
  AQ();
  _0();
  hQ()
})
// @from(Start 13583550, End 13583946)
function ZX0() {
  let A = SI1.useMemo(_j3, []);
  if (SI1.useEffect(() => {
      yCB(j59)
    }, [A.tip]), !A.tip) return null;
  return fjA.createElement(S, {
    paddingLeft: 2,
    flexDirection: "column"
  }, fjA.createElement($, {
    ...A.color === "warning" ? {
      color: "warning"
    } : A.color === "error" ? {
      color: "error"
    } : {
      dimColor: !0
    }
  }, A.tip))
}
// @from(Start 13583948, End 13583989)
function _j3() {
  return Z7A(j59, Sj3)
}
// @from(Start 13583994, End 13583997)
fjA
// @from(Start 13583999, End 13584002)
SI1
// @from(Start 13584004, End 13584033)
j59 = "tengu-top-of-feed-tip"
// @from(Start 13584037, End 13584040)
Sj3
// @from(Start 13584046, End 13584164)
S59 = L(() => {
  hA();
  u2();
  fjA = BA(VA(), 1), SI1 = BA(VA(), 1);
  Sj3 = {
    tip: "",
    color: "dim"
  }
})
// @from(Start 13584167, End 13589513)
function k59({
  isBeforeFirstMessage: A
}) {
  let Q = r69(A),
    B = I59(),
    G = N1().oauthAccount?.displayName ?? "",
    Z = J59(3),
    {
      columns: I
    } = WB(),
    Y = MMB(),
    J = nQ.isSandboxingEnabled(),
    W = PI1(),
    X = Sg(),
    V = N1(),
    F = X.companyAnnouncements,
    [K] = hjA.useState(() => F && F.length > 0 ? V.numStartups === 1 ? F[0] : F[Math.floor(Math.random() * F.length)] : void 0),
    {
      hasReleaseNotes: D
    } = SjA(V.lastReleaseNotesSeen);
  hjA.useEffect(() => {
    let l = N1();
    if (l.lastReleaseNotesSeen === {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.0.59",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
      }.VERSION) return;
    if (c0({
        ...l,
        lastReleaseNotesSeen: {
          ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
          PACKAGE_URL: "@anthropic-ai/claude-code",
          README_URL: "https://code.claude.com/docs/en/overview",
          VERSION: "2.0.59",
          FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
        }.VERSION
      }), Y) OMB()
  }, [V, Y]), hjA.useEffect(() => {
    if (W && !Y) jI1()
  }, [W, Y]);
  let {
    version: H,
    cwd: C,
    modelDisplayName: E,
    billingType: U
  } = OI1(), q = J7(E, _59 - 20);
  if (!D && !Y && !Y0(process.env.CLAUDE_CODE_FORCE_FULL_LOGO)) return LQ.createElement(LQ.Fragment, null, LQ.createElement(S, null), LQ.createElement(T59, null), F2A() && LQ.createElement(S, {
    paddingLeft: 2,
    flexDirection: "column"
  }, LQ.createElement($, {
    color: "warning"
  }, "Debug mode enabled"), LQ.createElement($, {
    dimColor: !0
  }, "Logging to: ", gj() ? "stderr" : Ps())), LQ.createElement(ZX0, null), K && LQ.createElement(S, {
    paddingLeft: 2,
    flexDirection: "column"
  }, LQ.createElement($, null, K)), !1, !1);
  let w = Q59(I),
    N = N1().theme,
    R = ` ${ZB("claude",N)("Claude Code")} ${ZB("inactive",N)(`v${H}`)} `,
    T = ZB("claude", N)(" Claude Code ");
  if (w === "compact") {
    let k = MI1(G);
    if (k.length > I - 4) k = MI1(null);
    let m = kjA(C, I - 4);
    return LQ.createElement(LQ.Fragment, null, LQ.createElement(S, {
      flexDirection: "column",
      borderStyle: "round",
      borderColor: "claude",
      borderText: {
        content: T,
        position: "top",
        align: "start",
        offset: 1
      },
      paddingX: 1,
      paddingY: 1,
      alignItems: "center",
      width: I
    }, LQ.createElement($, {
      bold: !0
    }, k), LQ.createElement(S, {
      marginY: 1
    }, LQ.createElement(S, {
      height: 5,
      flexDirection: "column",
      justifyContent: "flex-end"
    }, LQ.createElement(S, {
      marginBottom: Q
    }, LQ.createElement(BX0, null)))), LQ.createElement($, {
      dimColor: !0
    }, q), LQ.createElement($, {
      dimColor: !0
    }, U), LQ.createElement($, {
      dimColor: !0
    }, m)), J && LQ.createElement(S, {
      marginTop: 1,
      flexDirection: "column"
    }, LQ.createElement($, {
      color: "warning"
    }, "Your bash commands will be sandboxed. Disable with /sandbox.")))
  }
  let y = MI1(G),
    v = `${q} · ${U}`,
    x = kjA(C, _59),
    p = G59(y, x, v),
    {
      leftWidth: u,
      rightWidth: e
    } = B59(I, w, p);
  return LQ.createElement(LQ.Fragment, null, LQ.createElement(S, null), LQ.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    borderColor: "claude",
    borderText: {
      content: R,
      position: "top",
      align: "start",
      offset: 3
    }
  }, LQ.createElement(S, {
    flexDirection: w === "horizontal" ? "row" : "column",
    paddingX: 1,
    gap: 1
  }, LQ.createElement(S, {
    flexDirection: "column",
    width: u,
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 9
  }, LQ.createElement(S, {
    marginTop: 1
  }, LQ.createElement($, {
    bold: !0
  }, y)), LQ.createElement(S, {
    height: 5,
    flexDirection: "column",
    justifyContent: "flex-end"
  }, LQ.createElement(S, {
    marginBottom: Q
  }, LQ.createElement(BX0, null))), LQ.createElement(S, {
    flexDirection: "column",
    alignItems: "center"
  }, LQ.createElement($, {
    dimColor: !0
  }, v), LQ.createElement($, {
    dimColor: !0
  }, x))), w === "horizontal" && LQ.createElement(D3, {
    orientation: "vertical",
    dividerColor: "claude"
  }), w === "horizontal" && LQ.createElement(K59, {
    feeds: Y ? [C59(Wm1()), TI1(B)] : W ? [TI1(B), E59()] : [TI1(B), H59(Z)],
    maxWidth: e
  }))), F2A() && LQ.createElement(S, {
    paddingLeft: 2,
    flexDirection: "column"
  }, LQ.createElement($, {
    color: "warning"
  }, "Debug mode enabled"), LQ.createElement($, {
    dimColor: !0
  }, "Logging to: ", gj() ? "stderr" : Ps())), LQ.createElement(ZX0, null), K && LQ.createElement(S, {
    paddingLeft: 2,
    flexDirection: "column"
  }, LQ.createElement($, null, K)), J && LQ.createElement(S, {
    paddingLeft: 2,
    flexDirection: "column"
  }, LQ.createElement($, {
    color: "warning"
  }, "Your bash commands will be sandboxed. Disable with /sandbox.")), !1, !1)
}
// @from(Start 13589518, End 13589520)
LQ
// @from(Start 13589522, End 13589525)
hjA
// @from(Start 13589527, End 13589535)
_59 = 50
// @from(Start 13589541, End 13589777)
y59 = L(() => {
  hA();
  i8();
  o69();
  RI1();
  R9();
  W59();
  D59();
  z59();
  BK();
  jQ();
  BjA();
  V0();
  N$A();
  P59();
  tXA();
  bjA();
  hQ();
  js();
  S59();
  $J();
  GX0();
  LQ = BA(VA(), 1), hjA = BA(VA(), 1)
})
// @from(Start 13589780, End 13590354)
function yj3(A, Q, B, G, Z, I, Y) {
  if (I === "transcript") return !0;
  switch (A.type) {
    case "attachment":
    case "user":
    case "assistant": {
      let J = mjA(A);
      if (!J) return !0;
      if (Q.has(J)) return !1;
      if (G.has(J)) return !1;
      if (h59(J, "PostToolUse", Y)) return !1;
      return l69(Z, B)
    }
    case "system":
      return A.subtype !== "api_error";
    case "grouped_tool_use":
      return A.messages.every((W) => {
        let X = W.message.content[0];
        return X?.type === "tool_use" && B.has(X.id)
      })
  }
}
// @from(Start 13590359, End 13590361)
I6
// @from(Start 13590363, End 13590365)
fg
// @from(Start 13590367, End 13590375)
gjA = 10
// @from(Start 13590379, End 13595044)
kj3 = ({
    messages: A,
    normalizedMessageHistory: Q,
    tools: B,
    verbose: G,
    toolJSX: Z,
    toolUseConfirmQueue: I,
    inProgressToolUseIDs: Y,
    isMessageSelectorVisible: J,
    conversationId: W,
    screen: X,
    screenToggleId: V,
    streamingToolUses: F,
    showAllInTranscript: K = !1,
    agentDefinitions: D,
    onOpenRateLimitOptions: H
  }) => {
    let {
      columns: C
    } = WB(), E = fg.useContext(k_), U = fg.useMemo(() => [...Q, ...nJ(A).filter(ujA)], [A, Q]), q = fg.useMemo(() => new Set(Object.keys(kI1(U))), [U]), w = fg.useMemo(() => g59(U), [U]), N = fg.useMemo(() => F.filter((p) => {
      if (Y.has(p.contentBlock.id)) return !1;
      if (U.some((u) => u.type === "assistant" && u.message.content[0].type === "tool_use" && u.message.content[0].id === p.contentBlock.id)) return !1;
      return !0
    }), [F, Y, U]), R = fg.useMemo(() => N.flatMap((p) => nJ([uD({
      content: [p.contentBlock]
    })])), [N]), T = fg.useMemo(() => {
      let p = X === "transcript",
        u = p && !K,
        e = G ? U : nk(U),
        l = x59(e.filter((IA) => IA.type !== "progress").filter((IA) => u59(IA, p)), R),
        k = u ? l.slice(-gjA) : l,
        m = u && l.length > gjA;
      return [{
        type: "static",
        jsx: I6.createElement(S, {
          flexDirection: "column",
          gap: 1,
          key: `logo-${W}-${V}`
        }, I6.createElement(k59, {
          isBeforeFirstMessage: !1
        }), I6.createElement(d69, {
          agentDefinitions: D
        }))
      }, ...m ? [{
        type: "static",
        jsx: I6.createElement(D3, {
          key: `truncation-indicator-${W}-${V}`,
          dividerChar: "─",
          title: `Ctrl+E to show ${tA.bold(U.length-gjA)} previous messages`,
          width: C
        })
      }] : [], ...p && K && U.length > gjA ? [{
        type: "static",
        jsx: I6.createElement(D3, {
          key: `hide-indicator-${W}-${V}`,
          dividerChar: "─",
          title: `Ctrl+E to hide ${tA.bold(U.length-gjA)} previous messages`,
          width: C
        })
      }] : [], ...(() => {
        let {
          messages: IA
        } = g69(k, B, G), FA = v59(U, k), zA = new Set(F.map((OA) => OA.contentBlock.id)), NA = (!Z || !!Z.shouldContinueAnimation) && !I.length && !J;
        return IA.map((OA) => {
          let mA = OA.type === "grouped_tool_use",
            wA = mA ? OA.displayMessage : OA,
            qA = mA ? [] : f59(OA, FA),
            KA = mA ? new Set : b59(OA, FA),
            yA = yj3(OA, zA, q, Y, KA, X, FA) ? "static" : "transient",
            oA = !1;
          if (NA)
            if (mA) oA = OA.messages.some((X1) => {
              let WA = X1.message.content[0];
              return WA?.type === "tool_use" && Y.has(WA.id)
            });
            else {
              let X1 = mjA(OA);
              oA = !X1 || Y.has(X1)
            } return {
            type: yA,
            jsx: I6.createElement(S, {
              key: `${OA.uuid}-${W}-${V}`,
              width: C,
              flexDirection: "row",
              flexWrap: "nowrap",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 1
            }, I6.createElement(xg, {
              message: OA,
              messages: U,
              addMargin: !0,
              tools: B,
              verbose: G,
              erroredToolUseIDs: w,
              inProgressToolUseIDs: Y,
              progressMessagesForMessage: qA,
              shouldAnimate: oA,
              shouldShowDot: !0,
              resolvedToolUseIDs: q,
              isTranscriptMode: p,
              isStatic: yA === "static",
              onOpenRateLimitOptions: H
            }), I6.createElement(i69, {
              message: wA,
              isTranscriptMode: p
            }), I6.createElement(a69, {
              message: wA,
              isTranscriptMode: p
            }))
          }
        })
      })()]
    }, [X, K, G, U, R, W, V, D, C, F, q, B, w, Y, Z, I.length, J, H]), y = Y.size > 0;
    if (E) return I6.createElement(I6.Fragment, null, T.map((p) => p.jsx), y ? I6.createElement(PjA, {
      state: "indeterminate"
    }) : I6.createElement(PjA, {
      state: "completed"
    }));
    let v = T.filter((p) => p.type === "static"),
      x = T.filter((p) => p.type === "transient");
    return I6.createElement(I6.Fragment, null, I6.createElement(Zp, {
      key: `static-messages-${W}-${V}`,
      items: v
    }, (p) => p.jsx), x.map((p) => p.jsx), y ? I6.createElement(PjA, {
      state: "indeterminate"
    }) : I6.createElement(PjA, {
      state: "completed"
    }))
  }
// @from(Start 13595048, End 13595051)
_QA
// @from(Start 13595057, End 13595669)
_I1 = L(() => {
  hA();
  hA();
  h69();
  k7A();
  cQ();
  c69();
  UjA();
  i8();
  BK();
  F9();
  n69();
  s69();
  y59();
  I6 = BA(VA(), 1), fg = BA(VA(), 1), _QA = I6.memo(kj3, (A, Q) => {
    let B = Object.keys(A);
    for (let G of B) {
      if (G === "onOpenRateLimitOptions") continue;
      if (A[G] !== Q[G]) {
        if (G === "streamingToolUses") {
          let Z = A.streamingToolUses,
            I = Q.streamingToolUses;
          if (Z.length === I.length && Z.every((Y, J) => Y.contentBlock === I[J]?.contentBlock)) continue
        }
        return !1
      }
    }
    return !0
  })
})
// @from(Start 13595672, End 13596170)
function d59(A, Q, B, G, Z) {
  let I = m59.useContext(k_);
  f1(async (Y, J) => {
    if (J.ctrl && Y === "o") {
      if (Q((W) => W === "transcript" ? "prompt" : "transcript"), B((W) => W + 1), G(!1), !I) await Z()
    }
    if (J.ctrl && Y === "e" && A === "transcript") {
      if (G((W) => !W), B((W) => W + 1), !I) await Z()
    }
    if (J.ctrl && Y === "c" && A === "transcript" || J.escape && A === "transcript") {
      if (Q("prompt"), B((W) => W + 1), G(!1), !I) await Z()
    }
  })
}
// @from(Start 13596175, End 13596178)
m59
// @from(Start 13596184, End 13596239)
c59 = L(() => {
  hA();
  k7A();
  m59 = BA(VA(), 1)
})
// @from(Start 13596242, End 13597336)
function p59(A, Q) {
  let B = djA.useRef(!1),
    G = djA.useRef(null);
  djA.useEffect(() => {
    let Z = uU(A);
    if (G.current !== Z) B.current = !1, G.current = Z || null, Q({
      lineCount: 0,
      lineStart: void 0,
      text: void 0,
      filePath: void 0
    });
    if (B.current || !Z) return;
    let I = (Y) => {
      if (Y.selection?.start && Y.selection?.end) {
        let {
          start: J,
          end: W
        } = Y.selection, X = W.line - J.line + 1;
        if (W.character === 0) X--;
        let V = {
          lineCount: X,
          lineStart: J.line,
          text: Y.text,
          filePath: Y.filePath
        };
        Q(V)
      }
    };
    Z.client.setNotificationHandler(xj3, (Y) => {
      if (G.current !== Z) return;
      try {
        let J = Y.params;
        if (J.selection && J.selection.start && J.selection.end) I(J);
        else if (J.text !== void 0) I({
          selection: null,
          text: J.text,
          filePath: J.filePath
        })
      } catch (J) {
        AA(J)
      }
    }), B.current = !0
  }, [A, Q])
}
// @from(Start 13597341, End 13597344)
djA
// @from(Start 13597346, End 13597349)
xj3
// @from(Start 13597355, End 13597840)
l59 = L(() => {
  Q2();
  nY();
  g1();
  djA = BA(VA(), 1), xj3 = j.object({
    method: j.literal("selection_changed"),
    params: j.object({
      selection: j.object({
        start: j.object({
          line: j.number(),
          character: j.number()
        }),
        end: j.object({
          line: j.number(),
          character: j.number()
        })
      }).nullable().optional(),
      text: j.string().optional(),
      filePath: j.string().optional()
    })
  })
})
// @from(Start 13597843, End 13597897)
function n59(A) {
  return A.isNonInteractiveSession
}
// @from(Start 13597899, End 13598531)
function yI1(A) {
  try {
    let Q = new i59.default({
      allErrors: !0
    });
    if (!Q.validateSchema(A)) throw Error(`Invalid JSON Schema: ${Q.errorsText(Q.errors)}`);
    let G = Q.compile(A);
    return {
      ...IX0,
      inputJSONSchema: A,
      async call(Z) {
        if (!G(Z)) {
          let Y = G.errors?.map((J) => `${J.dataPath||"root"}: ${J.message}`).join(", ");
          throw Error(`Output does not match required schema: ${Y}`)
        }
        return {
          data: "Structured output provided successfully",
          structured_output: Z
        }
      }
    }
  } catch {
    return null
  }
}
// @from(Start 13598536, End 13598539)
i59
// @from(Start 13598541, End 13598544)
vj3
// @from(Start 13598546, End 13598549)
bj3
// @from(Start 13598551, End 13598574)
Az = "StructuredOutput"
// @from(Start 13598578, End 13598581)
IX0
// @from(Start 13598587, End 13600326)
eXA = L(() => {
  Q2();
  i59 = BA(QQ1(), 1), vj3 = j.object({}).passthrough(), bj3 = j.string().describe("Structured output tool result");
  IX0 = {
    isMcp: !1,
    isEnabled() {
      return !0
    },
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !0
    },
    isDestructive() {
      return !1
    },
    isOpenWorld() {
      return !1
    },
    name: Az,
    async description() {
      return "Return structured output in the requested format"
    },
    async prompt() {
      return "Use this tool to return your final response in the requested structured format. You MUST call this tool exactly once at the end of your response to provide the structured output."
    },
    inputSchema: vj3,
    outputSchema: bj3,
    async call(A) {
      return {
        data: "Structured output provided successfully",
        structured_output: A
      }
    },
    async checkPermissions(A) {
      return {
        behavior: "allow",
        updatedInput: A
      }
    },
    renderToolUseMessage(A) {
      let Q = Object.keys(A);
      if (Q.length === 0) return null;
      if (Q.length <= 3) return Q.map((B) => `${B}: ${JSON.stringify(A[B])}`).join(", ");
      return `${Q.length} fields: ${Q.slice(0,3).join(", ")}…`
    },
    userFacingName: () => Az,
    renderToolUseRejectedMessage() {
      return "Structured output rejected"
    },
    renderToolUseErrorMessage() {
      return "Structured output error"
    },
    renderToolUseProgressMessage() {
      return null
    },
    renderToolResultMessage(A) {
      return A
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: A
      }
    }
  }
})
// @from(Start 13600329, End 13600500)
function fj3(A) {
  if (A instanceof n2) {
    let Q = A.error;
    if (Q?.error?.message) return Q.error.message
  }
  return A instanceof Error ? A.message : String(A)
}
// @from(Start 13600502, End 13600711)
function YX0(A) {
  let Q = new Set;
  A.forEach((B, G) => Q.add(G));
  for (let [B, G] of Object.entries(hj3))
    if (G.prefixes?.some((Z) => Array.from(Q).some((I) => I.startsWith(Z)))) return B;
  return
}
// @from(Start 13600713, End 13601066)
function JX0() {
  return {
    ...process.env.ANTHROPIC_BASE_URL ? {
      baseUrl: process.env.ANTHROPIC_BASE_URL
    } : {},
    ...process.env.ANTHROPIC_MODEL ? {
      envModel: process.env.ANTHROPIC_MODEL
    } : {},
    ...process.env.ANTHROPIC_SMALL_FAST_MODEL ? {
      envSmallFastModel: process.env.ANTHROPIC_SMALL_FAST_MODEL
    } : {}
  }
}
// @from(Start 13601068, End 13601514)
function a59({
  model: A,
  messagesLength: Q,
  temperature: B,
  betas: G,
  permissionMode: Z,
  querySource: I,
  queryTracking: Y
}) {
  GA("tengu_api_query", {
    model: A,
    messagesLength: Q,
    temperature: B,
    provider: _R(),
    ...G?.length ? {
      betas: G.join(",")
    } : {},
    permissionMode: Z,
    querySource: I,
    ...Y ? {
      queryChainId: Y.chainId,
      queryDepth: Y.depth
    } : {},
    ...JX0()
  })
}
// @from(Start 13601516, End 13602664)
function s59({
  error: A,
  model: Q,
  messageCount: B,
  messageTokens: G,
  durationMs: Z,
  durationMsIncludingRetries: I,
  attempt: Y,
  requestId: J,
  didFallBackToNonStreaming: W,
  promptCategory: X,
  headers: V,
  queryTracking: F
}) {
  let K = void 0;
  if (A instanceof n2 && A.headers) K = YX0(A.headers);
  else if (V) K = YX0(V);
  let D = fj3(A),
    H = A instanceof n2 ? String(A.status) : void 0,
    C = jI2(A);
  AA(A), GA("tengu_api_error", {
    model: Q,
    error: D,
    status: H,
    errorType: C,
    messageCount: B,
    messageTokens: G,
    durationMs: Z,
    durationMsIncludingRetries: I,
    attempt: Y,
    provider: _R(),
    requestId: J || void 0,
    didFallBackToNonStreaming: W,
    ...X ? {
      promptCategory: X
    } : {},
    ...K ? {
      gateway: K
    } : {},
    ...F ? {
      queryChainId: F.chainId,
      queryDepth: F.depth
    } : {},
    ...JX0()
  }), HO("api_error", {
    model: Q,
    error: D,
    status_code: String(H),
    duration_ms: String(Z),
    attempt: String(Y)
  }), V80({
    success: !1,
    statusCode: H ? parseInt(H) : void 0,
    error: D,
    attempt: Y
  })
}
// @from(Start 13602666, End 13603913)
function gj3({
  model: A,
  preNormalizedModel: Q,
  messageCount: B,
  messageTokens: G,
  usage: Z,
  durationMs: I,
  durationMsIncludingRetries: Y,
  attempt: J,
  ttftMs: W,
  requestId: X,
  stopReason: V,
  costUSD: F,
  didFallBackToNonStreaming: K,
  querySource: D,
  gateway: H,
  queryTracking: C,
  permissionMode: E
}) {
  let U = N6(),
    q = process.argv.includes("-p") || process.argv.includes("--print");
  GA("tengu_api_success", {
    model: A,
    ...Q !== A ? {
      preNormalizedModel: Q
    } : {},
    messageCount: B,
    messageTokens: G,
    inputTokens: Z.input_tokens,
    outputTokens: Z.output_tokens,
    cachedInputTokens: Z.cache_read_input_tokens ?? 0,
    uncachedInputTokens: Z.cache_creation_input_tokens ?? 0,
    durationMs: I,
    durationMsIncludingRetries: Y,
    attempt: J,
    ttftMs: W ?? void 0,
    provider: _R(),
    requestId: X ?? void 0,
    stop_reason: V ?? void 0,
    costUSD: F,
    didFallBackToNonStreaming: K,
    isNonInteractiveSession: U,
    print: q,
    isTTY: process.stdout.isTTY ?? !1,
    querySource: D,
    ...H ? {
      gateway: H
    } : {},
    ...C ? {
      queryChainId: C.chainId,
      queryDepth: C.depth
    } : {},
    permissionMode: E,
    ...JX0()
  })
}
// @from(Start 13603915, End 13605213)
function r59({
  model: A,
  preNormalizedModel: Q,
  start: B,
  startIncludingRetries: G,
  ttftMs: Z,
  usage: I,
  attempt: Y,
  messageCount: J,
  messageTokens: W,
  requestId: X,
  stopReason: V,
  didFallBackToNonStreaming: F,
  querySource: K,
  headers: D,
  costUSD: H,
  queryTracking: C,
  permissionMode: E
}) {
  let U = D ? YX0(D) : void 0,
    q = Date.now() - B,
    w = Date.now() - G;
  ME0(w, q), gj3({
    model: A,
    preNormalizedModel: Q,
    messageCount: J,
    messageTokens: W,
    usage: I,
    durationMs: q,
    durationMsIncludingRetries: w,
    attempt: Y,
    ttftMs: Z,
    requestId: X,
    stopReason: V,
    costUSD: H,
    didFallBackToNonStreaming: F,
    querySource: K,
    gateway: U,
    queryTracking: C,
    permissionMode: E
  }), HO("api_request", {
    model: A,
    input_tokens: String(I.input_tokens),
    output_tokens: String(I.output_tokens),
    cache_read_tokens: String(I.cache_read_input_tokens),
    cache_creation_tokens: String(I.cache_creation_input_tokens),
    cost_usd: String(H),
    duration_ms: String(q)
  }), V80({
    success: !0,
    inputTokens: I.input_tokens,
    outputTokens: I.output_tokens,
    cacheReadTokens: I.cache_read_input_tokens,
    cacheCreationTokens: I.cache_creation_input_tokens,
    attempt: Y
  })
}
// @from(Start 13605218, End 13605221)
hj3
// @from(Start 13605223, End 13605225)
bO
// @from(Start 13605231, End 13605895)
cjA = L(() => {
  p_();
  g1();
  lK();
  q0();
  oJA();
  F0A();
  _0();
  ZO();
  hj3 = {
    litellm: {
      prefixes: ["x-litellm-"]
    },
    helicone: {
      prefixes: ["helicone-"]
    },
    portkey: {
      prefixes: ["x-portkey-"]
    },
    "cloudflare-ai-gateway": {
      prefixes: ["cf-aig-"]
    }
  };
  bO = {
    input_tokens: 0,
    cache_creation_input_tokens: 0,
    cache_read_input_tokens: 0,
    output_tokens: 0,
    server_tool_use: {
      web_search_requests: 0,
      web_fetch_requests: 0
    },
    service_tier: "standard",
    cache_creation: {
      ephemeral_1h_input_tokens: 0,
      ephemeral_5m_input_tokens: 0
    }
  }
})
// @from(Start 13605947, End 13606854)
async function* mj3(A, Q, B, G) {
  let {
    permissionResult: Z,
    assistantMessage: I
  } = A, {
    toolUseID: Y
  } = Z;
  if (!Y) return;
  let J = I.message.content,
    W;
  if (Array.isArray(J)) {
    for (let C of J)
      if (C.type === "tool_use" && C.id === Y) {
        W = C;
        break
      }
  }
  if (!W) return;
  let {
    name: X,
    input: V
  } = W;
  if (!Q.find((C) => C.name === X)) return;
  let K = {
      ...W,
      input: Z.behavior === "allow" ? Z.updatedInput : V
    },
    D = async () => ({
      ...Z,
      decisionReason: {
        type: "mode",
        mode: "default"
      }
    });
  B.push(I), await y0A(B), yield {
    ...I,
    session_id: e1(),
    parent_tool_use_id: null
  };
  for await (let C of VX0([K], [I], D, G)) if (C.message) B.push(C.message), await y0A(B), yield {
    ...C.message,
    session_id: e1(),
    parent_tool_use_id: null
  }
}
// @from(Start 13606856, End 13607257)
function dj3(A) {
  if (!A) return !1;
  if (A.type === "assistant") {
    let Q = dC(A.message.content);
    return Q?.type === "text" || Q?.type === "thinking" || Q?.type === "redacted_thinking"
  }
  if (A.type === "user") {
    let Q = A.message.content;
    if (!Array.isArray(Q) || Q.length === 0) return !1;
    return Q.every((B) => ("type" in B) && B.type === "tool_result")
  }
  return !1
}
// @from(Start 13607258, End 13619394)
async function* o59({
  commands: A,
  prompt: Q,
  promptUuid: B,
  cwd: G,
  tools: Z,
  mcpClients: I,
  verbose: Y = !1,
  maxThinkingTokens: J,
  maxTurns: W,
  maxBudgetUsd: X,
  canUseTool: V,
  mutableMessages: F = [],
  customSystemPrompt: K,
  appendSystemPrompt: D,
  userSpecifiedModel: H,
  fallbackModel: C,
  sdkBetas: E,
  jsonSchema: U,
  getAppState: q,
  setAppState: w,
  abortController: N,
  replayUserMessages: R = !1,
  includePartialMessages: T = !1,
  agents: y = [],
  setSDKStatus: v,
  orphanedPermission: x
}) {
  Bq(G);
  let p = Date.now(),
    u = [],
    e = async (_1, zQ, W1, O1, a1, C0) => {
      let v0 = await V(_1, zQ, W1, O1, a1, C0);
      if (v0.behavior !== "allow") {
        let k0 = {
          tool_name: _1.name,
          tool_use_id: a1,
          tool_input: zQ
        };
        u.push(k0)
      }
      return v0
    }, l = await q(), k = H ? UD(H) : k3(), [m, o, IA] = await Promise.all([Tn(Z, k, Array.from(l.toolPermissionContext.additionalWorkingDirectories.keys()), I, l.toolPermissionContext), DK(), typeof K === "string" ? Promise.resolve({}) : iD()]), FA = [...typeof K === "string" ? [K] : m, ...D ? [D] : []], zA = typeof D === "string", NA = Z.some((_1) => _1.name === Az);
  if (U && NA) s21(w, e1(), "Stop", "", (_1) => bI1(_1, Az), `You MUST call the ${Az} tool to complete this request. Call this tool now.`, {
    timeout: 5000
  });
  let OA = {
    messages: F,
    setMessages: () => {},
    onChangeAPIKey: () => {},
    options: {
      commands: A,
      debug: !1,
      tools: Z,
      verbose: Y,
      mainLoopModel: k,
      maxThinkingTokens: J ?? 0,
      mcpClients: I,
      mcpResources: {},
      ideInstallationStatus: null,
      isNonInteractiveSession: !0,
      hasAppendSystemPrompt: zA,
      agentDefinitions: {
        activeAgents: y,
        allAgents: []
      },
      theme: N1().theme,
      maxBudgetUsd: X,
      sdkBetas: E
    },
    getAppState: q,
    setAppState: w,
    abortController: N ?? o9(),
    readFileState: xI1(F, G),
    setInProgressToolUseIDs: () => {},
    setResponseLength: () => {},
    updateFileHistoryState: (_1) => {
      w((zQ) => ({
        ...zQ,
        fileHistory: _1(zQ.fileHistory)
      }))
    },
    agentId: e1(),
    setSDKStatus: v
  };
  if (x)
    for await (let _1 of mj3(x, Z, F, OA)) yield _1;
  let {
    messages: mA,
    shouldQuery: wA,
    allowedTools: qA,
    maxThinkingTokens: KA,
    model: yA
  } = await TP({
    input: Q,
    mode: "prompt",
    setIsLoading: () => {},
    setToolJSX: () => {},
    context: {
      ...OA,
      messages: F
    },
    messages: F,
    uuid: B,
    querySource: "sdk"
  });
  F.push(...mA);
  let oA = J ?? KA ?? 0,
    X1 = [...F],
    WA = mA.filter((_1) => _1.type === "user" && !_1.isMeta && !_1.toolUseResult || _1.type === "system" && _1.subtype === "compact_boundary"),
    EA = R ? WA : [];
  w((_1) => ({
    ..._1,
    toolPermissionContext: {
      ..._1.toolPermissionContext,
      alwaysAllowRules: {
        ..._1.toolPermissionContext.alwaysAllowRules,
        command: qA
      }
    }
  }));
  let MA = yA ?? k,
    DA = xI1(X1, G),
    $A = X01(DA, OA.readFileState);
  OA = {
    messages: X1,
    setMessages: () => {},
    onChangeAPIKey: () => {},
    options: {
      commands: A,
      debug: !1,
      tools: Z,
      verbose: Y,
      mainLoopModel: MA,
      maxThinkingTokens: oA,
      mcpClients: I,
      mcpResources: {},
      ideInstallationStatus: null,
      isNonInteractiveSession: !0,
      hasAppendSystemPrompt: zA,
      theme: N1().theme,
      agentDefinitions: {
        activeAgents: y,
        allAgents: []
      },
      maxBudgetUsd: X,
      sdkBetas: E
    },
    getAppState: q,
    setAppState: w,
    abortController: N || o9(),
    readFileState: $A,
    setInProgressToolUseIDs: () => {},
    setResponseLength: () => {},
    updateFileHistoryState: OA.updateFileHistoryState,
    agentId: e1(),
    setSDKStatus: v
  };
  let rA = l0()?.outputStyle ?? wK,
    [iA, {
      enabled: J1
    }] = await Promise.all([n51(), l7()]);
  if (yield {
      type: "system",
      subtype: "init",
      cwd: G,
      session_id: e1(),
      tools: Z.map((_1) => _1.name),
      mcp_servers: I.map((_1) => ({
        name: _1.name,
        status: _1.type
      })),
      model: MA,
      permissionMode: l.toolPermissionContext.mode,
      slash_commands: A.map((_1) => _1.name),
      apiKeySource: cw().source,
      betas: E,
      claude_code_version: {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.0.59",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
      }.VERSION,
      output_style: rA,
      agents: y.map((_1) => _1.agentType),
      skills: iA.map((_1) => _1.name),
      plugins: J1.map((_1) => ({
        name: _1.name,
        path: _1.path
      })),
      uuid: Ha()
    }, !wA) {
    for (let _1 of WA) {
      if (_1.type === "user" && typeof _1.message.content === "string" && (_1.message.content.includes("<local-command-stdout>") || _1.message.content.includes("<local-command-stderr>") || _1.isCompactSummary)) X1.push(_1), yield {
        type: "user",
        message: {
          ..._1.message,
          content: cY(_1.message.content)
        },
        session_id: e1(),
        parent_tool_use_id: null,
        uuid: _1.uuid,
        isReplay: !_1.isCompactSummary
      };
      if (_1.type === "system" && _1.subtype === "compact_boundary") X1.push(_1), yield {
        type: "system",
        subtype: "compact_boundary",
        session_id: e1(),
        uuid: _1.uuid,
        compact_metadata: {
          trigger: _1.compactMetadata.trigger,
          pre_tokens: _1.compactMetadata.preTokens
        }
      }
    }
    await y0A(X1), yield {
      type: "result",
      subtype: "success",
      is_error: !1,
      duration_ms: Date.now() - p,
      duration_api_ms: gN(),
      num_turns: X1.length - 1,
      result: "",
      session_id: e1(),
      total_cost_usd: hK(),
      usage: bO,
      modelUsage: {},
      permission_denials: u,
      uuid: Ha()
    };
    return
  }
  if (EG()) mA.filter(yn).forEach((_1) => {
    yYA((zQ) => {
      w((W1) => ({
        ...W1,
        fileHistory: zQ(W1.fileHistory)
      }))
    }, _1.uuid)
  });
  let w1 = bO,
    jA = bO,
    eA = 1,
    t1 = !1,
    v1, F0 = U ? WX0(F, Az) : 0;
  for await (let _1 of O$({
    messages: X1,
    systemPrompt: FA,
    userContext: o,
    systemContext: IA,
    canUseTool: e,
    toolUseContext: OA,
    fallbackModel: C,
    querySource: "sdk"
  })) {
    if (_1.type === "assistant" || _1.type === "user" || _1.type === "system" && _1.subtype === "compact_boundary") {
      if (X1.push(_1), await y0A(X1), !t1 && EA.length > 0) {
        t1 = !0;
        for (let zQ of EA)
          if (zQ.type === "user") yield {
            type: "user",
            message: zQ.message,
            session_id: e1(),
            parent_tool_use_id: null,
            uuid: zQ.uuid,
            isReplay: !0
          }
      }
    }
    if (_1.type === "user") eA++;
    switch (_1.type) {
      case "assistant":
      case "progress":
      case "user":
        F.push(_1), yield* pj3(_1);
        break;
      case "stream_event":
        if (_1.event.type === "message_start") jA = bO, jA = ljA(jA, _1.event.message.usage);
        if (_1.event.type === "message_delta") jA = ljA(jA, _1.event.usage);
        if (_1.event.type === "message_stop") w1 = vI1(w1, jA);
        if (T) yield {
          type: "stream_event",
          event: _1.event,
          session_id: e1(),
          parent_tool_use_id: null,
          uuid: Ha()
        };
        break;
      case "attachment":
        if (F.push(_1), IY2(_1.attachment)) yield {
          type: "system",
          subtype: "hook_response",
          session_id: e1(),
          uuid: _1.uuid,
          hook_name: _1.attachment.hookName,
          hook_event: _1.attachment.hookEvent,
          stdout: _1.attachment.stdout,
          stderr: _1.attachment.stderr,
          exit_code: _1.attachment.exitCode
        };
        else if (m91(_1.attachment)) yield {
          type: "system",
          subtype: "hook_response",
          session_id: e1(),
          uuid: _1.uuid,
          hook_name: _1.attachment.hookName,
          hook_event: _1.attachment.hookEvent,
          stdout: _1.attachment.stdout || "",
          stderr: _1.attachment.stderr || "",
          exit_code: _1.attachment.exitCode
        };
        else if (R && u91(_1)) {
          let zQ = _1.attachment;
          if (zQ.type === "queued_command") yield {
            type: "user",
            message: {
              role: "user",
              content: typeof zQ.prompt === "string" ? zQ.prompt : zQ.prompt
            },
            session_id: e1(),
            parent_tool_use_id: null,
            uuid: zQ.source_uuid || _1.uuid,
            isReplay: !0
          }
        } else if (_1.attachment.type === "structured_output") v1 = _1.attachment.data;
        break;
      case "stream_request_start":
        break;
      case "system":
        if (F.push(_1), _1.subtype === "compact_boundary" && _1.compactMetadata) yield {
          type: "system",
          subtype: "compact_boundary",
          session_id: e1(),
          uuid: _1.uuid,
          compact_metadata: {
            trigger: _1.compactMetadata.trigger,
            pre_tokens: _1.compactMetadata.preTokens
          }
        };
        break
    }
    if (_1.type === "user" && W && eA >= W) {
      yield {
        type: "result",
        subtype: "error_max_turns",
        duration_ms: Date.now() - p,
        duration_api_ms: gN(),
        is_error: !1,
        num_turns: eA,
        session_id: e1(),
        total_cost_usd: hK(),
        usage: w1,
        modelUsage: ru(),
        permission_denials: u,
        uuid: Ha(),
        errors: []
      };
      return
    }
    if (X !== void 0 && hK() >= X) {
      yield {
        type: "result",
        subtype: "error_max_budget_usd",
        duration_ms: Date.now() - p,
        duration_api_ms: gN(),
        is_error: !1,
        num_turns: eA,
        session_id: e1(),
        total_cost_usd: hK(),
        usage: w1,
        modelUsage: ru(),
        permission_denials: u,
        uuid: Ha(),
        errors: []
      };
      return
    }
    if (_1.type === "user" && U) {
      let W1 = WX0(F, Az) - F0,
        O1 = parseInt(process.env.MAX_STRUCTURED_OUTPUT_RETRIES || "5", 10);
      if (W1 >= O1) {
        yield {
          type: "result",
          subtype: "error_max_structured_output_retries",
          duration_ms: Date.now() - p,
          duration_api_ms: gN(),
          is_error: !1,
          num_turns: eA,
          session_id: e1(),
          total_cost_usd: hK(),
          usage: w1,
          modelUsage: ru(),
          permission_denials: u,
          uuid: Ha(),
          errors: [`Failed to provide valid structured output after ${O1} attempts`]
        };
        return
      }
    }
  }
  let g0 = dC(X1);
  if (!dj3(g0)) {
    yield {
      type: "result",
      subtype: "error_during_execution",
      duration_ms: Date.now() - p,
      duration_api_ms: gN(),
      is_error: !1,
      num_turns: eA,
      session_id: e1(),
      total_cost_usd: hK(),
      usage: w1,
      modelUsage: ru(),
      permission_denials: u,
      uuid: Ha(),
      errors: z2A().map((_1) => _1.error)
    };
    return
  }
  let p0 = "",
    n0 = !1;
  if (g0.type === "assistant") {
    let _1 = dC(g0.message.content);
    if (_1?.type === "text") p0 = _1.text;
    n0 = Boolean(g0.isApiErrorMessage)
  }
  yield {
    type: "result",
    subtype: "success",
    is_error: n0,
    duration_ms: Date.now() - p,
    duration_api_ms: gN(),
    num_turns: eA,
    result: p0,
    session_id: e1(),
    total_cost_usd: hK(),
    usage: w1,
    modelUsage: ru(),
    permission_denials: u,
    structured_output: v1,
    uuid: Ha()
  }
}
// @from(Start 13619396, End 13621421)
function* pj3(A) {
  switch (A.type) {
    case "assistant":
      for (let Q of nJ([A])) yield {
        type: "assistant",
        message: Q.message,
        parent_tool_use_id: null,
        session_id: e1(),
        uuid: Q.uuid,
        error: Q.error
      };
      return;
    case "progress":
      if (A.data.type === "agent_progress")
        for (let Q of nJ([A.data.message])) switch (Q.type) {
          case "assistant":
            yield {
              type: "assistant", message: Q.message, parent_tool_use_id: A.parentToolUseID, session_id: e1(), uuid: Q.uuid, error: Q.error
            };
            break;
          case "user":
            yield {
              type: "user", message: Q.message, parent_tool_use_id: A.parentToolUseID, session_id: e1(), uuid: Q.uuid, isSynthetic: Q.isMeta || Q.isVisibleInTranscriptOnly, tool_use_result: Q.toolUseResult
            };
            break
        } else if (A.data.type === "bash_progress") {
          if (!process.env.CLAUDE_CODE_REMOTE && !process.env.CLAUDE_CODE_CONTAINER_ID) break;
          let Q = A.parentToolUseID,
            B = Date.now(),
            G = pjA.get(Q) || 0;
          if (B - G >= 60000) {
            if (pjA.size >= cj3) {
              let I = pjA.keys().next().value;
              if (I !== void 0) pjA.delete(I)
            }
            pjA.set(Q, B), yield {
              type: "tool_progress",
              tool_use_id: A.toolUseID,
              tool_name: "Bash",
              parent_tool_use_id: A.parentToolUseID,
              elapsed_time_seconds: A.data.elapsedTimeSeconds,
              session_id: e1(),
              uuid: A.uuid
            }
          }
        } break;
    case "user":
      for (let Q of nJ([A])) yield {
        type: "user",
        message: Q.message,
        parent_tool_use_id: null,
        session_id: e1(),
        uuid: Q.uuid,
        isSynthetic: Q.isMeta || Q.isVisibleInTranscriptOnly,
        tool_use_result: Q.toolUseResult
      };
      return;
    default:
  }
}
// @from(Start 13621423, End 13623258)
function xI1(A, Q, B = uj3) {
  let G = Gh(B),
    Z = new Map,
    I = new Map;
  for (let Y of A)
    if (Y.type === "assistant" && Array.isArray(Y.message.content)) {
      for (let J of Y.message.content)
        if (J.type === "tool_use" && J.name === d5) {
          let W = J.input;
          if (W?.file_path && W?.offset === void 0 && W?.limit === void 0) {
            let X = b9(W.file_path, Q);
            Z.set(J.id, X)
          }
        } else if (J.type === "tool_use" && J.name === wX) {
        let W = J.input;
        if (W?.file_path && W?.content) {
          let X = b9(W.file_path, Q);
          I.set(J.id, {
            filePath: X,
            content: W.content
          })
        }
      }
    } for (let Y of A)
    if (Y.type === "user" && Array.isArray(Y.message.content)) {
      for (let J of Y.message.content)
        if (J.type === "tool_result" && J.tool_use_id) {
          let W = Z.get(J.tool_use_id);
          if (W && typeof J.content === "string") {
            let K = J.content.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "").split(`
`).map((D) => {
              let H = D.match(/^\s*\d+→(.*)$/);
              return H ? H[1] : D
            }).join(`
`).trim();
            if (Y.timestamp) {
              let D = new Date(Y.timestamp).getTime();
              G.set(W, {
                content: K,
                timestamp: D,
                offset: void 0,
                limit: void 0
              })
            }
          }
          let X = I.get(J.tool_use_id);
          if (X && Y.timestamp) {
            let V = new Date(Y.timestamp).getTime();
            G.set(X.filePath, {
              content: X.content,
              timestamp: V,
              offset: void 0,
              limit: void 0
            })
          }
        }
    } return G
}
// @from(Start 13623263, End 13623271)
uj3 = 10
// @from(Start 13623275, End 13623284)
cj3 = 100
// @from(Start 13623288, End 13623291)
pjA
// @from(Start 13623297, End 13623585)
XX0 = L(() => {
  E9A();
  cE();
  Pn();
  Ty();
  M_();
  Ca();
  vM();
  wF();
  YS();
  u_();
  yI();
  S7();
  cQ();
  eXA();
  AWA();
  _0();
  t2();
  jMA();
  ET();
  gB();
  IO();
  cjA();
  fZ();
  jQ();
  OZ();
  Gx();
  MB();
  fV();
  g1();
  sU();
  zTA();
  pjA = new Map
})
// @from(Start 13623588, End 13623757)
function lj3() {
  return BZ("cache_warming", "config", {
    enabled: !1,
    idleThresholdMs: 240000,
    subsequentWarmupIntervalMs: 300000,
    maxRequests: 1
  })
}
// @from(Start 13623759, End 13625628)
function t59(A, Q) {
  let B = fI1.useRef(null);
  fI1.useEffect(() => {
    let G = lj3();
    if (!G.enabled) return;
    if (A || Q === 0) {
      if (B.current) B.current.abort(), B.current = null;
      return
    }
    let Z = 0,
      I = null,
      Y = async () => {
        let W = NkA();
        if (!W) {
          g("Cache warming: No previous API request to replay");
          return
        }
        if (B.current) B.current.abort();
        B.current = o9();
        try {
          g(`Cache warming: Sending request ${Z+1}/${G.maxRequests}`);
          let X = {
              ...W,
              messages: [...W.messages, {
                role: "user",
                content: 'Reply with just "OK"'
              }],
              max_tokens: 10
            },
            F = (await Kq({
              maxRetries: 0,
              model: W.model
            })).beta.messages.stream(X, {
              signal: B.current.signal
            });
          for await (let H of F) if (B.current?.signal.aborted) break;
          let D = (await F.finalMessage()).usage;
          if (g("Cache warming: Request completed"), GA("tengu_cache_warming_request", {
              warmup_number: Z + 1,
              cache_read_tokens: D.cache_read_input_tokens ?? 0,
              cache_creation_tokens: D.cache_creation_input_tokens ?? 0,
              input_tokens: D.input_tokens,
              output_tokens: D.output_tokens
            }), Z++, Z < G.maxRequests) J(G.subsequentWarmupIntervalMs)
        } catch (X) {
          if (X instanceof Error) AA(X)
        } finally {
          B.current = null
        }
      }, J = (W) => {
        I = setTimeout(() => {
          Y()
        }, W)
      };
    return J(G.idleThresholdMs), () => {
      if (I) clearTimeout(I);
      if (B.current) B.current.abort(), B.current = null
    }
  }, [A, Q])
}
// @from(Start 13625633, End 13625636)
fI1
// @from(Start 13625642, End 13625737)
e59 = L(() => {
  oZA();
  _0();
  V0();
  OZ();
  u2();
  q0();
  g1();
  fI1 = BA(VA(), 1)
})
// @from(Start 13625740, End 13626557)
function Q39({
  autoConnectIdeFlag: A,
  ideToInstallExtension: Q,
  setDynamicMcpConfig: B,
  setShowIdeOnboarding: G,
  setIDEInstallationState: Z
}) {
  A39.useEffect(() => {
    function I(Y) {
      if (!Y) return;
      if (!((N1().autoConnectIde || A || bV() || Q || Y0(process.env.CLAUDE_CODE_AUTO_CONNECT_IDE)) && !_j(process.env.CLAUDE_CODE_AUTO_CONNECT_IDE))) return;
      B((X) => {
        if (X?.ide) return X;
        return {
          ...X,
          ide: {
            type: Y.url.startsWith("ws:") ? "ws-ide" : "sse-ide",
            url: Y.url,
            ideName: Y.name,
            authToken: Y.authToken,
            ideRunningInWindows: Y.ideRunningInWindows,
            scope: "dynamic"
          }
        }
      })
    }
    WB2(I, Q, () => G(!0), (Y) => Z(Y))
  }, [A, Q, B, G, Z])
}
// @from(Start 13626562, End 13626565)
A39
// @from(Start 13626571, End 13626633)
B39 = L(() => {
  jQ();
  nY();
  hQ();
  A39 = BA(VA(), 1)
})
// @from(Start 13626639, End 13626704)
ijA = L(() => {
  _8();
  U2();
  AQ();
  PV();
  V0();
  jQ()
})
// @from(Start 13626710, End 13626713)
FX0
// @from(Start 13626719, End 13626822)
G39 = L(() => {
  hA();
  S5();
  ijA();
  DY();
  u_();
  _8();
  q0();
  Mi();
  FX0 = BA(VA(), 1)
})
// @from(Start 13626828, End 13626831)
DvZ
// @from(Start 13626837, End 13626892)
Z39 = L(() => {
  G39();
  kW();
  DvZ = BA(VA(), 1)
})
// @from(Start 13626895, End 13626944)
function aj3() {
  return as(nj3) ?? "Goodbye!"
}
// @from(Start 13626949, End 13626952)
ij3
// @from(Start 13626954, End 13626957)
nj3
// @from(Start 13626959, End 13626962)
sj3
// @from(Start 13626964, End 13626967)
hI1
// @from(Start 13626973, End 13627410)
KX0 = L(() => {
  LxA();
  kW();
  ijA();
  Z39();
  ij3 = BA(VA(), 1), nj3 = ["Goodbye!", "See ya!", "Bye!", "Catch you later!"];
  sj3 = {
    type: "local-jsx",
    name: "exit",
    aliases: ["quit"],
    description: "Exit the REPL",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A) {
      return A(aj3()), await v6(0, "prompt_input_exit"), null
    },
    userFacingName() {
      return "exit"
    }
  }, hI1 = sj3
})
// @from(Start 13627413, End 13628287)
function I39() {
  let [A, Q] = Qj.useState(vH.getInstance().getStatus());
  if (Qj.useEffect(() => {
      return vH.getInstance().subscribe(Q)
    }, []), !A.isAuthenticating && !A.error && A.output.length === 0) return null;
  if (!A.isAuthenticating && !A.error) return null;
  return Qj.default.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    borderColor: "permission",
    paddingX: 1,
    marginY: 1
  }, Qj.default.createElement($, {
    bold: !0,
    color: "permission"
  }, "AWS Authentication"), A.output.length > 0 && Qj.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, A.output.slice(-5).map((B, G) => Qj.default.createElement($, {
    key: G,
    dimColor: !0
  }, B))), A.error && Qj.default.createElement(S, {
    marginTop: 1
  }, Qj.default.createElement($, {
    color: "error"
  }, A.error)))
}
// @from(Start 13628292, End 13628294)
Qj
// @from(Start 13628300, End 13628345)
Y39 = L(() => {
  hA();
  Qj = BA(VA(), 1)
})
// @from(Start 13628394, End 13628912)
function gI1({
  hideThanksAfterMs: A,
  onOpen: Q,
  onSelect: B
}) {
  let [G, Z] = Ea.useState("closed"), I = Ea.useRef(J39()), Y = Ea.useCallback(() => {
    Z("thanks"), setTimeout(() => Z("closed"), A)
  }, [A]), J = Ea.useCallback(() => {
    if (G !== "closed") return;
    Z("open"), I.current = J39(), Q(I.current)
  }, [G, Q]), W = Ea.useCallback((X) => {
    if (X === "dismissed") Z("closed");
    else Y();
    B(I.current, X)
  }, [Y, B]);
  return {
    state: G,
    open: J,
    handleSelect: W
  }
}
// @from(Start 13628917, End 13628919)
Ea
// @from(Start 13628925, End 13628962)
DX0 = L(() => {
  Ea = BA(VA(), 1)
})
// @from(Start 13628965, End 13631578)
function W39(A, Q, B, G = "session") {
  let Z = R$.useRef("unknown");
  Z.current = AVA(A)?.message?.id || "unknown";
  let [I, Y] = OQ(), J = snA("tengu_feedback_survey_config", rj3), W = R$.useRef(Date.now()), X = R$.useRef(B), V = R$.useRef(B);
  V.current = B;
  let F = R$.useCallback((N, R) => {
      Y((T) => ({
        ...T,
        feedbackSurvey: {
          timeLastShown: N,
          submitCountAtLastAppearance: R
        }
      }))
    }, [Y]),
    K = R$.useCallback((N) => {
      F(Date.now(), V.current), GA("tengu_feedback_survey_event", {
        event_type: "appeared",
        appearance_id: N,
        last_assistant_message_id: Z.current,
        survey_type: G
      })
    }, [F, G]),
    D = R$.useCallback((N, R) => {
      F(Date.now(), V.current), GA("tengu_feedback_survey_event", {
        event_type: "responded",
        appearance_id: N,
        response: R,
        last_assistant_message_id: Z.current,
        survey_type: G
      })
    }, [F, G]),
    {
      state: H,
      open: C,
      handleSelect: E
    } = gI1({
      hideThanksAfterMs: J.hideThanksAfterMs,
      onOpen: K,
      onSelect: D
    }),
    U = k3(),
    q = R$.useMemo(() => {
      if (J.onForModels.length === 0) return !1;
      if (J.onForModels.includes("*")) return !0;
      return J.onForModels.includes(U)
    }, [J.onForModels, U]),
    w = R$.useMemo(() => {
      if (H !== "closed") return !1;
      if (Q) return !1;
      if (process.env.CLAUDE_FORCE_DISPLAY_SURVEY && !I.feedbackSurvey.timeLastShown) return !0;
      if (!q) return !1;
      if (Y0(process.env.CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY)) return !1;
      if (fX()) return !1;
      if (I.feedbackSurvey.timeLastShown) {
        if (I.feedbackSurvey.submitCountAtLastAppearance !== null && B < I.feedbackSurvey.submitCountAtLastAppearance + J.minUserTurnsBetweenFeedback) return !1
      } else {
        if (Date.now() - W.current < J.minTimeBeforeFeedbackMs) return !1;
        if (B < X.current + J.minUserTurnsBeforeFeedback) return !1
      }
      if (Math.random() > J.probability) return !1;
      let N = N1().feedbackSurveyState;
      if (N?.lastShownTime) {
        if (Date.now() - N.lastShownTime < J.minTimeBetweenGlobalFeedbackMs) return !1
      }
      return !0
    }, [H, Q, q, I.feedbackSurvey.timeLastShown, I.feedbackSurvey.submitCountAtLastAppearance, B, J.minTimeBetweenGlobalFeedbackMs, J.minUserTurnsBetweenFeedback, J.minTimeBeforeFeedbackMs, J.minUserTurnsBeforeFeedback, J.probability]);
  return R$.useEffect(() => {
    if (w) C()
  }, [w, C]), {
    state: H,
    handleSelect: E
  }
}
// @from(Start 13631583, End 13631585)
R$
// @from(Start 13631587, End 13631590)
rj3
// @from(Start 13631596, End 13631945)
X39 = L(() => {
  u2();
  q0();
  Ft();
  jQ();
  t2();
  hQ();
  z9();
  cQ();
  DX0();
  R$ = BA(VA(), 1), rj3 = {
    minTimeBeforeFeedbackMs: 600000,
    minTimeBetweenGlobalFeedbackMs: 1e8,
    minUserTurnsBeforeFeedback: 5,
    minUserTurnsBetweenFeedback: 10,
    hideThanksAfterMs: 3000,
    onForModels: ["*"],
    probability: 0.005
  }
})
// @from(Start 13631948, End 13632188)
function ej3(A, Q) {
  let B = A.findIndex((G) => G.uuid === Q);
  if (B === -1) return !1;
  for (let G = B + 1; G < A.length; G++) {
    let Z = A[G];
    if (Z && (Z.type === "user" || Z.type === "assistant")) return !0
  }
  return !1
}
// @from(Start 13632190, End 13633491)
function V39(A, Q) {
  let [B, G] = BN.useState(null), Z = BN.useRef(new Set), I = BN.useRef(null), Y = BN.useCallback(async (K) => {
    let D = await b91();
    GA("tengu_post_compact_survey_event", {
      event_type: "appeared",
      appearance_id: K,
      session_memory_compaction_enabled: D
    })
  }, []), J = BN.useCallback(async (K, D) => {
    let H = await b91();
    GA("tengu_post_compact_survey_event", {
      event_type: "responded",
      appearance_id: K,
      response: D,
      session_memory_compaction_enabled: H
    })
  }, []), {
    state: W,
    open: X,
    handleSelect: V
  } = gI1({
    hideThanksAfterMs: oj3,
    onOpen: Y,
    onSelect: J
  });
  BN.useEffect(() => {
    hX(tj3).then(G)
  }, []);
  let F = BN.useMemo(() => new Set(A.filter((K) => lh(K)).map((K) => K.uuid)), [A]);
  return BN.useEffect(() => {
    if (W !== "closed" || Q) return;
    if (fX()) return;
    if (Y0(process.env.CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY)) return;
    if (I.current !== null) {
      if (ej3(A, I.current)) {
        I.current = null, X();
        return
      }
    }
    let K = Array.from(F).filter((D) => !Z.current.has(D));
    if (K.length > 0) Z.current = new Set(F), I.current = K[K.length - 1]
  }, [F, W, Q, B, A, X]), {
    state: W,
    handleSelect: V
  }
}
// @from(Start 13633496, End 13633498)
BN
// @from(Start 13633500, End 13633510)
oj3 = 3000
// @from(Start 13633514, End 13633547)
tj3 = "tengu_post_compact_survey"
// @from(Start 13633553, End 13633648)
F39 = L(() => {
  u2();
  q0();
  Ft();
  hQ();
  cQ();
  DX0();
  h91();
  BN = BA(VA(), 1)
})
// @from(Start 13633651, End 13634616)
function K39({
  onSelect: A,
  inputValue: Q,
  setInputValue: B,
  message: G = BS3
}) {
  let Z = qK.useRef(Q);
  return qK.useEffect(() => {
    if (Q !== Z.current) {
      let I = Q.slice(-1);
      if (HX0(I)) B(Q.slice(0, -1)), A(QS3[I])
    }
  }, [Q, A, B]), qK.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, qK.default.createElement(S, null, qK.default.createElement($, null, tA.cyan("● ")), qK.default.createElement($, {
    bold: !0
  }, G)), qK.default.createElement(S, {
    marginLeft: 2
  }, qK.default.createElement(S, {
    width: 10
  }, qK.default.createElement($, null, tA.cyan("1"), ": Bad")), qK.default.createElement(S, {
    width: 10
  }, qK.default.createElement($, null, tA.cyan("2"), ": Fine")), qK.default.createElement(S, {
    width: 10
  }, qK.default.createElement($, null, tA.cyan("3"), ": Good")), qK.default.createElement(S, null, qK.default.createElement($, null, tA.cyan("0"), ": Dismiss"))))
}
// @from(Start 13634621, End 13634623)
qK
// @from(Start 13634625, End 13634628)
AS3
// @from(Start 13634630, End 13634633)
QS3
// @from(Start 13634635, End 13634663)
HX0 = (A) => AS3.includes(A)
// @from(Start 13634667, End 13634719)
BS3 = "How is Claude doing this session? (optional)"
// @from(Start 13634725, End 13634890)
D39 = L(() => {
  F9();
  hA();
  qK = BA(VA(), 1), AS3 = ["0", "1", "2", "3"], QS3 = {
    "0": "dismissed",
    "1": "bad",
    "2": "fine",
    "3": "good"
  }
})
// @from(Start 13634893, End 13635518)
function CX0({
  state: A,
  handleSelect: Q,
  inputValue: B,
  setInputValue: G,
  message: Z
}) {
  if (A === "closed") return null;
  if (A === "thanks") return njA.default.createElement(S, {
    marginTop: 1,
    flexDirection: "column"
  }, njA.default.createElement($, {
    color: "success"
  }, "✓ Thanks for helping make Claude better!"), njA.default.createElement($, {
    dimColor: !0
  }, "Use ", "/feedback", " to share detailed feedback or file a bug."));
  if (B && !HX0(B)) return null;
  return njA.default.createElement(K39, {
    onSelect: Q,
    inputValue: B,
    setInputValue: G,
    message: Z
  })
}
// @from(Start 13635523, End 13635526)
njA
// @from(Start 13635532, End 13635587)
H39 = L(() => {
  hA();
  D39();
  njA = BA(VA(), 1)
})
// @from(Start 13635590, End 13636095)
function E39() {
  let {
    addNotification: A
  } = vZ();
  C39.useEffect(() => {
    gy().then((Q) => {
      Q.forEach((B, G) => {
        let Z = "low";
        if (B.type === "error" || B.userActionRequired) Z = "high";
        else if (B.type === "path" || B.type === "alias") Z = "medium";
        A({
          key: `install-message-${G}-${B.type}`,
          text: B.message,
          priority: Z,
          color: B.type === "error" ? "error" : "warning"
        })
      })
    })
  }, [A])
}
// @from(Start 13636100, End 13636103)
C39
// @from(Start 13636109, End 13636163)
z39 = L(() => {
  EU();
  uy();
  C39 = BA(VA(), 1)
})
// @from(Start 13636166, End 13636216)
function U39() {
  return N1().tipsHistory || {}
}
// @from(Start 13636218, End 13636294)
function GS3(A) {
  let Q = N1();
  c0({
    ...Q,
    tipsHistory: A
  })
}
// @from(Start 13636296, End 13636377)
function $39(A) {
  let Q = U39(),
    B = N1().numStartups;
  Q[A] = B, GS3(Q)
}
// @from(Start 13636379, End 13636421)
function ZS3(A) {
  return U39()[A] || 0
}
// @from(Start 13636423, End 13636519)
function uI1(A) {
  let Q = ZS3(A);
  if (Q === 0) return 1 / 0;
  return N1().numStartups - Q
}
// @from(Start 13636524, End 13636549)
EX0 = L(() => {
  jQ()
})
// @from(Start 13636607, End 13636659)
function dI1() {
  return Xx(MQ(), "plugins", JS3)
}
// @from(Start 13636661, End 13636713)
function UX0() {
  return Xx(MQ(), "plugins", WS3)
}
// @from(Start 13636715, End 13636974)
function ajA() {
  let A = RA(),
    Q = dI1();
  if (!A.existsSync(Q)) return null;
  let B = A.readFileSync(Q, {
      encoding: "utf-8"
    }),
    G = JSON.parse(B);
  return {
    version: typeof G?.version === "number" ? G.version : 1,
    data: G
  }
}
// @from(Start 13636976, End 13637235)
function XS3() {
  let A = RA(),
    Q = UX0();
  if (!A.existsSync(Q)) return null;
  let B = A.readFileSync(Q, {
      encoding: "utf-8"
    }),
    G = JSON.parse(B);
  return {
    version: typeof G?.version === "number" ? G.version : 2,
    data: G
  }
}
// @from(Start 13637237, End 13637609)
function VS3(A) {
  let Q = {};
  for (let [B, G] of Object.entries(A.plugins)) {
    let Z = G[0];
    if (Z) Q[B] = {
      version: Z.version || "unknown",
      installedAt: Z.installedAt || new Date().toISOString(),
      lastUpdated: Z.lastUpdated,
      installPath: Z.installPath,
      gitCommitSha: Z.gitCommitSha,
      isLocal: Z.isLocal
    }
  }
  return Q
}
// @from(Start 13637611, End 13638607)
function QVA() {
  if (hg !== null) return hg.plugins;
  let A = dI1();
  try {
    let Q = ajA();
    if (!Q) return g(`installed_plugins.json doesn't exist yet at ${A}, returning empty object`), hg = {
      version: 1,
      plugins: {}
    }, hg.plugins;
    if (Q.version === 2) {
      let G = AB1.parse(Q.data),
        Z = VS3(G);
      return hg = {
        version: 1,
        plugins: Z
      }, g(`Loaded ${Object.keys(Z).length} installed plugins from V2 file at ${A}`), Z
    }
    let B = $LA.parse(Q.data);
    return hg = B, g(`Loaded ${Object.keys(B.plugins).length} installed plugins from ${A} (schema version ${B.version})`), B.plugins
  } catch (Q) {
    let B = Q instanceof Error ? Q.message : String(Q);
    return g(`Failed to load installed_plugins.json: ${B}. Starting with empty state.`, {
      level: "error"
    }), AA(Q instanceof Error ? Q : Error(`Failed to load installed_plugins.json: ${B}`)), hg = {
      version: 1,
      plugins: {}
    }, hg.plugins
  }
}
// @from(Start 13638609, End 13639184)
function cI1(A) {
  let Q = RA(),
    B = dI1();
  try {
    let G = Xx(MQ(), "plugins");
    if (!Q.existsSync(G)) Q.mkdirSync(G);
    let Z = {
        version: 1,
        plugins: A
      },
      I = JSON.stringify(Z, null, 2);
    Q.writeFileSync(B, I, {
      encoding: "utf-8",
      flush: !0
    }), hg = Z, g(`Saved ${Object.keys(A).length} installed plugins to ${B} (schema version ${kQA})`)
  } catch (G) {
    let Z = G instanceof Error ? G.message : String(G);
    throw AA(G instanceof Error ? G : Error(`Failed to save installed_plugins.json: ${Z}`)), G
  }
}
// @from(Start 13639186, End 13639569)
function $X0(A) {
  let Q = {};
  for (let [B, G] of Object.entries(A.plugins)) {
    let Z = JB1(B, G.version);
    Q[B] = [{
      scope: "user",
      installPath: Z,
      version: G.version,
      installedAt: G.installedAt,
      lastUpdated: G.lastUpdated,
      gitCommitSha: G.gitCommitSha,
      isLocal: G.isLocal
    }]
  }
  return {
    version: 2,
    plugins: Q
  }
}
// @from(Start 13639571, End 13639606)
function FS3(A) {
  return $X0(A)
}
// @from(Start 13639608, End 13639729)
function yQA() {
  if (T$ !== null) return T$;
  if (o2("tengu_enable_versioned_plugins")) return KS3();
  return DS3()
}
// @from(Start 13639731, End 13640624)
function KS3() {
  let A = UX0();
  try {
    let Q = XS3();
    if (Q) {
      let G = AB1.parse(Q.data);
      return T$ = G, g(`Loaded ${Object.keys(G.plugins).length} installed plugins from V2 file at ${A}`), G
    }
    let B = ajA();
    if (B) {
      let G = $LA.parse(B.data),
        Z = $X0(G);
      return q39(Z), g(`Migrated ${Object.keys(G.plugins).length} plugins from V1 to V2 file`), Z
    }
    return g("Neither V1 nor V2 installed_plugins file exists, returning empty V2 object"), T$ = {
      version: 2,
      plugins: {}
    }, T$
  } catch (Q) {
    let B = Q instanceof Error ? Q.message : String(Q);
    return g(`Failed to load installed_plugins_v2.json: ${B}. Starting with empty state.`, {
      level: "error"
    }), AA(Q instanceof Error ? Q : Error(`Failed to load installed_plugins_v2.json: ${B}`)), T$ = {
      version: 2,
      plugins: {}
    }, T$
  }
}
// @from(Start 13640626, End 13641339)
function DS3() {
  let A = dI1();
  try {
    let Q = ajA();
    if (!Q) return g(`installed_plugins.json doesn't exist yet at ${A}, returning empty V2 object`), T$ = {
      version: 2,
      plugins: {}
    }, T$;
    let B = $LA.parse(Q.data),
      G = FS3(B);
    return T$ = G, g(`Loaded ${Object.keys(B.plugins).length} plugins from V1 file and wrapped as V2`), G
  } catch (Q) {
    let B = Q instanceof Error ? Q.message : String(Q);
    return g(`Failed to load installed_plugins.json (V2): ${B}. Starting with empty state.`, {
      level: "error"
    }), AA(Q instanceof Error ? Q : Error(`Failed to load installed_plugins.json (V2): ${B}`)), T$ = {
      version: 2,
      plugins: {}
    }, T$
  }
}
// @from(Start 13641341, End 13641854)
function q39(A) {
  let Q = RA(),
    B = UX0();
  try {
    let G = Xx(MQ(), "plugins");
    if (!Q.existsSync(G)) Q.mkdirSync(G);
    let Z = JSON.stringify(A, null, 2);
    Q.writeFileSync(B, Z, {
      encoding: "utf-8",
      flush: !0
    }), T$ = A, g(`Saved ${Object.keys(A.plugins).length} installed plugins to V2 file at ${B}`)
  } catch (G) {
    let Z = G instanceof Error ? G.message : String(G);
    throw AA(G instanceof Error ? G : Error(`Failed to save installed_plugins_v2.json: ${Z}`)), G
  }
}
// @from(Start 13641856, End 13641973)
function N39(A) {
  let Q = o2("tengu_enable_versioned_plugins"),
    B = ES3(A);
  if (cI1(B), Q) q39(A);
  T$ = A
}
// @from(Start 13641975, End 13642117)
function HS3(A) {
  let Q = al(),
    [B] = A.split("@");
  if (!B) return Q;
  let G = B.replace(/[^a-zA-Z0-9-_]/g, "-");
  return Xx(Q, G)
}
// @from(Start 13642119, End 13642262)
function CS3(A) {
  let [Q, B] = A.split("@");
  if (!Q || !B) return "";
  let G = Xx(MQ(), "plugins", "marketplaces");
  return Xx(G, B, Q)
}
// @from(Start 13642264, End 13642695)
function ES3(A) {
  let Q = {};
  for (let [B, G] of Object.entries(A.plugins)) {
    let Z = G[0];
    if (Z) {
      let I = Z.isLocal ? CS3(B) : HS3(B);
      Q[B] = {
        version: Z.version || "unknown",
        installedAt: Z.installedAt || new Date().toISOString(),
        lastUpdated: Z.lastUpdated,
        installPath: I,
        gitCommitSha: Z.gitCommitSha,
        isLocal: Z.isLocal
      }
    }
  }
  return Q
}
// @from(Start 13642697, End 13642965)
function pI1(A, Q, B) {
  let G = yQA(),
    Z = G.plugins[A];
  if (!Z) return;
  if (G.plugins[A] = Z.filter((I) => !(I.scope === Q && I.projectPath === B)), G.plugins[A].length === 0) delete G.plugins[A];
  N39(G), g(`Removed installation for ${A} at scope ${Q}`)
}
// @from(Start 13642967, End 13643031)
function wX0() {
  if (zX0 === null) zX0 = yQA();
  return zX0
}
// @from(Start 13643032, End 13643311)
async function L39() {
  try {
    await qX0()
  } catch (A) {
    AA(A instanceof Error ? A : Error(String(A)))
  }
  if (o2("tengu_enable_versioned_plugins")) {
    let A = wX0();
    g(`Initialized versioned plugins system with ${Object.keys(A.plugins).length} plugins`)
  }
}
// @from(Start 13643313, End 13643350)
function zS3(A) {
  return QVA()[A]
}
// @from(Start 13643352, End 13643397)
function gg(A) {
  return zS3(A) !== void 0
}
// @from(Start 13643399, End 13643525)
function M39(A, Q) {
  let B = QVA(),
    G = A in B;
  B[A] = Q, cI1(B), g(`${G?"Updated":"Added"} installed plugin: ${A}`)
}
// @from(Start 13643527, End 13643655)
function O39(A) {
  let Q = QVA(),
    B = Q[A];
  if (B) delete Q[A], cI1(Q), g(`Removed installed plugin: ${A}`);
  return B
}
// @from(Start 13643657, End 13644399)
function lI1(A) {
  let Q = RA();
  try {
    if (Q.existsSync(A)) {
      Q.rmSync(A, {
        recursive: !0,
        force: !0
      }), g(`Deleted plugin cache at ${A}`);
      let B = al();
      if (A.includes("/cache/") && A.startsWith(B)) {
        let G = YS3(A);
        if (Q.existsSync(G) && G !== B && G.startsWith(B)) {
          if (Q.readdirSync(G).length === 0) Q.rmdirSync(G), g(`Deleted empty plugin directory at ${G}`)
        }
      }
    } else g(`Plugin cache at ${A} doesn't exist, skipping deletion`)
  } catch (B) {
    let G = B instanceof Error ? B.message : String(B);
    throw AA(B instanceof Error ? B : Error(`Failed to delete plugin cache: ${G}`)), Error(`Failed to delete plugin cache at ${A}: ${G}`)
  }
}
// @from(Start 13644401, End 13644709)
function US3(A) {
  if (Object.keys(A).length === 0) return !0;
  let Q = ajA();
  if (!Q) return !1;
  if (Q.version !== kQA) return !1;
  try {
    let G = Q.data?.plugins || {};
    for (let Z of Object.keys(A))
      if (Z.includes("@") && !(Z in G)) return !1
  } catch {
    return !1
  }
  return !0
}
// @from(Start 13644711, End 13644867)
function $S3(A, Q) {
  if (!A.includes("@")) return !1;
  if (A in Q) return g(`Plugin ${A} already in installed_plugins.json, skipping`), !1;
  return !0
}
// @from(Start 13644868, End 13645117)
async function mI1(A) {
  try {
    let Q = await QQ("git", ["-C", A, "rev-parse", "HEAD"]);
    if (Q.code === 0 && Q.stdout) return Q.stdout.trim();
    return
  } catch (Q) {
    g(`Failed to get git commit SHA from ${A}: ${Q}`);
    return
  }
}
// @from(Start 13645119, End 13645454)
function w39(A, Q) {
  let B = RA(),
    G = Xx(A, ".claude-plugin", "plugin.json");
  if (!B.existsSync(G)) return "unknown";
  try {
    let Z = B.readFileSync(G, {
      encoding: "utf-8"
    });
    return JSON.parse(Z).version || "unknown"
  } catch {
    return g(`Could not read version from manifest for ${Q}`), "unknown"
  }
}