
// @from(Ln 420718, Col 4)
n39 = w(() => {
  fA();
  nz();
  B2();
  V2();
  Q2();
  MD();
  l2();
  hR0();
  TX();
  $L0();
  w6();
  Oj0();
  GQ();
  xB = c(QA(), 1), eK7 = {
    id: "large-memory-files",
    type: "warning",
    isActive: () => {
      return N4A().length > 0
    },
    render: () => {
      let A = N4A();
      return xB.createElement(xB.Fragment, null, A.map((Q) => {
        let B = Q.path.startsWith(o1()) ? tK7(o1(), Q.path) : Q.path;
        return xB.createElement(T, {
          key: Q.path,
          flexDirection: "row"
        }, xB.createElement(C, {
          color: "warning"
        }, tA.warning), xB.createElement(C, {
          color: "warning"
        }, "Large ", xB.createElement(C, {
          bold: !0
        }, B), " will impact performance (", X8(Q.content.length), " chars >", " ", X8(xd), ")", xB.createElement(C, {
          dimColor: !0
        }, " • /memory to edit")))
      }))
    }
  }, AV7 = {
    id: "ultra-claude-md",
    type: "warning",
    isActive: () => {
      let A = w4A();
      return A !== null && A.content.length > hVA
    },
    render: () => {
      let A = w4A();
      if (!A) return null;
      let Q = A.content.length;
      return xB.createElement(T, {
        flexDirection: "row",
        gap: 1
      }, xB.createElement(C, {
        color: "warning"
      }, tA.warning), xB.createElement(C, {
        color: "warning"
      }, "CLAUDE.md entries marked as IMPORTANT exceed", " ", hVA, " chars (", Q, " chars)", xB.createElement(C, {
        dimColor: !0
      }, " • /memory to edit")))
    }
  }, QV7 = {
    id: "claude-ai-external-token",
    type: "warning",
    isActive: () => {
      let A = an();
      return qB() && (A.source === "ANTHROPIC_AUTH_TOKEN" || A.source === "apiKeyHelper")
    },
    render: () => {
      let A = an();
      return xB.createElement(T, {
        flexDirection: "row",
        marginTop: 1
      }, xB.createElement(C, {
        color: "warning"
      }, tA.warning), xB.createElement(C, {
        color: "warning"
      }, "Auth conflict: Using ", A.source, " instead of Claude account subscription token. Either unset ", A.source, ", or run `claude /logout`."))
    }
  }, BV7 = {
    id: "api-key-conflict",
    type: "warning",
    isActive: () => {
      let {
        source: A
      } = Oz({
        skipRetrievingKeyFromApiKeyHelper: !0
      });
      return !!dOA() && (A === "ANTHROPIC_API_KEY" || A === "apiKeyHelper")
    },
    render: () => {
      let {
        source: A
      } = Oz({
        skipRetrievingKeyFromApiKeyHelper: !0
      });
      return xB.createElement(T, {
        flexDirection: "row",
        marginTop: 1
      }, xB.createElement(C, {
        color: "warning"
      }, tA.warning), xB.createElement(C, {
        color: "warning"
      }, "Auth conflict: Using ", A, " instead of Anthropic Console key. Either unset ", A, ", or run `claude /logout`."))
    }
  }, GV7 = {
    id: "both-auth-methods",
    type: "warning",
    isActive: () => {
      let {
        source: A
      } = Oz({
        skipRetrievingKeyFromApiKeyHelper: !0
      }), Q = an();
      return A !== "none" && Q.source !== "none" && !(A === "apiKeyHelper" && Q.source === "apiKeyHelper")
    },
    render: () => {
      let {
        source: A
      } = Oz({
        skipRetrievingKeyFromApiKeyHelper: !0
      }), Q = an();
      return xB.createElement(T, {
        flexDirection: "column",
        marginTop: 1
      }, xB.createElement(T, {
        flexDirection: "row"
      }, xB.createElement(C, {
        color: "warning"
      }, tA.warning), xB.createElement(C, {
        color: "warning"
      }, "Auth conflict: Both a token (", Q.source, ") and an API key (", A, ") are set. This may lead to unexpected behavior.")), xB.createElement(T, {
        flexDirection: "column",
        marginLeft: 3
      }, xB.createElement(C, {
        color: "warning"
      }, "• Trying to use", " ", Q.source === "claude.ai" ? "claude.ai" : Q.source, "?", " ", A === "ANTHROPIC_API_KEY" ? 'Unset the ANTHROPIC_API_KEY environment variable, or claude /logout then say "No" to the API key approval before login.' : A === "apiKeyHelper" ? "Unset the apiKeyHelper setting." : "claude /logout"), xB.createElement(C, {
        color: "warning"
      }, "• Trying to use ", A, "?", " ", Q.source === "claude.ai" ? "claude /logout to sign out of claude.ai." : `Unset the ${Q.source} environment variable.`)))
    }
  }, ZV7 = {
    id: "sonnet-1m-welcome",
    type: "info",
    isActive: (A) => A.showSonnet1MNotice === !0,
    render: () => {
      return xB.createElement(T, {
        flexDirection: "column",
        marginTop: 1
      }, xB.createElement(C, {
        bold: !0
      }, "You now have access to Sonnet 4.5 with 1M context (uses more rate limits than Sonnet on long requests) • Update in /model"))
    }
  }, YV7 = {
    id: "opus-4.5-available",
    type: "info",
    isActive: (A) => A.showOpus45Notice === !0,
    render: () => {
      let Q = R4() !== "firstParty",
        B = N6(),
        G = B === "max",
        Z = B === "team",
        Y = B === "pro",
        J = B5().includes("opus-4-5"),
        X;
      if (G || Z || Y || J) X = xB.createElement(C, {
        dimColor: !0
      }, "Welcome to Opus 4.5");
      else if (Q) X = xB.createElement(C, {
        dimColor: !0
      }, "/model to try Opus 4.5. Note: you may need to request access from your cloud provider");
      else X = xB.createElement(C, {
        dimColor: !0
      }, "/model to try Opus 4.5");
      return xB.createElement(T, {
        marginLeft: 1
      }, X)
    }
  }, JV7 = {
    id: "large-agent-descriptions",
    type: "warning",
    isActive: (A) => {
      return EgA(A.agentDefinitions) > i3A
    },
    render: (A) => {
      let Q = EgA(A.agentDefinitions);
      return xB.createElement(T, {
        flexDirection: "row"
      }, xB.createElement(C, {
        color: "warning"
      }, tA.warning), xB.createElement(C, {
        color: "warning"
      }, "Large cumulative agent descriptions will impact performance (~", X8(Q), " tokens >", " ", X8(i3A), ")", xB.createElement(C, {
        dimColor: !0
      }, " • /agents to manage")))
    }
  }, XV7 = {
    id: "jetbrains-plugin-install",
    type: "info",
    isActive: (A) => {
      if (!XhA()) return !1;
      if (!(A.config.autoInstallIdeExtension ?? !0)) return !1;
      let B = pEA();
      return B !== null && !Nr2(B)
    },
    render: () => {
      let A = pEA(),
        Q = EK(A);
      return xB.createElement(T, {
        flexDirection: "row",
        gap: 1,
        marginLeft: 1
      }, xB.createElement(C, {
        color: "ide"
      }, tA.arrowUp), xB.createElement(C, null, "Install the ", xB.createElement(C, {
        color: "ide"
      }, Q), " plugin from the JetBrains Marketplace:", " ", xB.createElement(C, {
        bold: !0
      }, "https://docs.claude.com/s/claude-code-jetbrains")))
    }
  }, WV7 = {
    id: "react-vulnerability",
    type: "warning",
    isActive: () => {
      if (!f8(DV7)) return !1;
      if ((JG().reactVulnerabilityWarningCount ?? 0) >= IV7) return !1;
      return Lj0()?.detected === !0
    },
    render: () => {
      let A = Lj0();
      if (!A?.detected || !A.packageManager || !A.packageName) return null;
      let Q = p39(A.packageManager, A.packageName),
        B = A.package === "next",
        G = B ? "CVE-2025-66478" : "CVE-2025-55182",
        Z = B ? `Next.js ${A.version}` : `${A.packageName}@${A.version}`;
      return xB.createElement(T, {
        flexDirection: "row",
        gap: 1
      }, xB.createElement(C, {
        color: "warning"
      }, tA.warning), xB.createElement(C, {
        color: "warning"
      }, Z, " has a critical vulnerability (", G, ") that could allow attackers to execute arbitrary code on your server. Run `", Q, "` to update."))
    }
  }, KV7 = [WV7, eK7, AV7, JV7, QV7, BV7, GV7, ZV7, YV7, XV7]
})
// @from(Ln 420963, Col 0)
function a39({
  agentDefinitions: A
} = {}) {
  let Q = _j.useRef(!1),
    B = L1(),
    G = v3()?.organizationUuid,
    Y = (G ? B.s1mAccessCache?.[G] : void 0)?.hasAccessNotAsDefault,
    J = G && B.hasShownS1MWelcomeV2?.[G],
    X = qB() && Y && !J,
    D = !(G && B.hasShownOpus45Notice?.[G]),
    W = {
      config: B,
      showSonnet1MNotice: X,
      showOpus45Notice: D,
      agentDefinitions: A
    },
    K = i39(W);
  if (_j.useEffect(() => {
      if (!G) return;
      let V = K.some((H) => H.id === "sonnet-1m-welcome"),
        F = K.some((H) => H.id === "opus-4.5-available");
      if (V) l("tengu_sonnet_1m_notice_shown", {});
      if (F) l("tengu_opus_45_notice_shown", {});
      if (V || F) S0((H) => ({
        ...H,
        ...V && {
          hasShownS1MWelcomeV2: {
            ...H.hasShownS1MWelcomeV2,
            [G]: !0
          }
        },
        ...F && {
          hasShownOpus45Notice: {
            ...H.hasShownOpus45Notice,
            [G]: !0
          }
        }
      }))
    }, [K, B, G]), _j.useEffect(() => {
      if (Q.current) return;
      if (K.some((F) => F.id === "react-vulnerability")) Q.current = !0, l("tengu_react_vulnerability_notice_shown", {}), BZ((F) => ({
        ...F,
        reactVulnerabilityWarningCount: (F.reactVulnerabilityWarningCount ?? 0) + 1
      }))
    }, [K]), K.length === 0) return null;
  return _j.createElement(T, {
    flexDirection: "column",
    paddingLeft: 1
  }, K.map((V) => _j.createElement(_j.Fragment, {
    key: V.id
  }, V.render(W))))
}
// @from(Ln 421015, Col 4)
_j
// @from(Ln 421016, Col 4)
o39 = w(() => {
  fA();
  GQ();
  n39();
  Z0();
  Q2();
  _j = c(QA(), 1)
})
// @from(Ln 421025, Col 0)
function r39(A, Q) {
  let B = new Set;
  for (let G of A)
    if (!Q.has(G)) B.add(G);
  return B
}
// @from(Ln 421032, Col 0)
function s39(A, Q) {
  for (let B of A)
    if (!Q.has(B)) return !1;
  return !0
}
// @from(Ln 421038, Col 0)
function t39({
  message: A,
  isTranscriptMode: Q
}) {
  if (!(Q && A.timestamp && A.type === "assistant" && A.message.content.some((Z) => Z.type === "text"))) return null;
  let G = new Date(A.timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !0
  });
  return Mj0.default.createElement(T, {
    marginTop: 1,
    minWidth: G.length
  }, Mj0.default.createElement(C, {
    dimColor: !0
  }, G))
}
// @from(Ln 421055, Col 4)
Mj0
// @from(Ln 421056, Col 4)
e39 = w(() => {
  fA();
  Mj0 = c(QA(), 1)
})
// @from(Ln 421061, Col 0)
function A89({
  message: A,
  isTranscriptMode: Q
}) {
  if (!(Q && A.type === "assistant" && A.message.model && A.message.content.some((G) => G.type === "text"))) return null;
  return Rj0.default.createElement(T, {
    marginTop: 1,
    marginLeft: 1,
    minWidth: A.message.model.length + 8
  }, Rj0.default.createElement(C, {
    dimColor: !0
  }, A.message.model))
}
// @from(Ln 421074, Col 4)
Rj0
// @from(Ln 421075, Col 4)
Q89 = w(() => {
  fA();
  Rj0 = c(QA(), 1)
})
// @from(Ln 421080, Col 0)
function B89(A) {
  let [Q, B] = ezA.useState(1), [G, Z] = ezA.useState(-1);
  return J0((Y, J) => {
    if (J.escape && G === -1) Z(0)
  }, {
    isActive: A
  }), ezA.useEffect(() => {
    if (!A) {
      Z(-1), B(0);
      return
    }
  }, [A]), ezA.useEffect(() => {
    if (G === -1) return;
    let Y = [1, 0, 1, 2, 2, 1, 0, 0, 0, 1, 2, 2, 1];
    if (G >= Y.length) {
      Z(-1), B(1);
      return
    }
    B(Y[G]);
    let J = setTimeout(() => {
      Z((X) => X + 1)
    }, 60);
    return () => clearTimeout(J)
  }, [G]), Q
}
// @from(Ln 421105, Col 4)
ezA
// @from(Ln 421106, Col 4)
G89 = w(() => {
  fA();
  ezA = c(QA(), 1)
})
// @from(Ln 421111, Col 0)
function J89(A) {
  if (A >= 70) return "horizontal";
  return "compact"
}
// @from(Ln 421116, Col 0)
function X89(A, Q, B) {
  if (Q === "horizontal") {
    let Z = B,
      Y = _j0 + Cz1 + $z1 + Z,
      J = A - Y,
      X = Math.max(30, J),
      I = Math.min(Z + X + $z1 + Cz1, A - _j0);
    if (I < Z + X + $z1 + Cz1) X = I - Z - $z1 - Cz1;
    return {
      leftWidth: Z,
      rightWidth: X,
      totalWidth: I
    }
  }
  let G = Math.min(A - _j0, Y89 + 20);
  return {
    leftWidth: G,
    rightWidth: G,
    totalWidth: G
  }
}
// @from(Ln 421138, Col 0)
function I89(A, Q, B) {
  let G = Math.max(A.length, Q.length, B.length, 20);
  return Math.min(G + 4, Y89)
}
// @from(Ln 421143, Col 0)
function qz1(A) {
  if (!A || A.length > VV7) return "Welcome back!";
  return `Welcome back ${A}!`
}
// @from(Ln 421148, Col 0)
function mgA(A, Q) {
  if (A.length <= Q) return A;
  let B = "/",
    G = "…",
    Z = A.split(B),
    Y = Z[0] || "",
    J = Z[Z.length - 1] || "";
  if (Z.length === 1) return A.substring(0, Q - G.length) + G;
  if (Y === "" && G.length + B.length + J.length >= Q) return `${B}${J.substring(0,Q-G.length-B.length)}${G}`;
  if (Y !== "" && G.length * 2 + B.length + J.length >= Q) return `${G}${B}${J.substring(0,Q-G.length*2-B.length)}${G}`;
  if (Z.length === 2) return `${Y.substring(0,Q-G.length-B.length-J.length)}${G}${B}${J}`;
  let X = Q - Y.length - J.length - G.length - 2 * B.length;
  if (X <= 0) return `${Y.substring(0,Math.max(0,Q-J.length-G.length-2*B.length))}${B}${G}${B}${J}`;
  let I = [];
  for (let D = Z.length - 2; D > 0; D--) {
    let W = Z[D];
    if (W && W.length + B.length <= X) I.unshift(W), X -= W.length + B.length;
    else break
  }
  if (I.length === 0) return `${Y}${B}${G}${B}${J}`;
  return `${Y}${B}${G}${B}${I.join(B)}${B}${J}`
}
// @from(Ln 421170, Col 0)
async function D89() {
  if (Uz1) return Uz1;
  let A = q0();
  return Uz1 = J8A(10).then((Q) => {
    return ugA = Q.filter((B) => {
      if (B.isSidechain) return !1;
      if (B.leafUuid === A) return !1;
      if (B.summary?.includes("I apologize")) return !1;
      let G = B.summary && B.summary !== "No prompt",
        Z = B.firstPrompt && B.firstPrompt !== "No prompt";
      return G || Z
    }).slice(0, 3), ugA
  }).catch(() => {
    return ugA = [], ugA
  }), Uz1
}
// @from(Ln 421187, Col 0)
function W89() {
  return ugA
}
// @from(Ln 421191, Col 0)
function Nz1() {
  let A = process.env.DEMO_VERSION ?? {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.1.7",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      BUILD_TIME: "2026-01-13T22:55:21Z"
    }.VERSION,
    Q = process.env.DEMO_VERSION ? "/code/claude" : k6(o1()),
    B = B5(),
    G = YeQ(B),
    Z = qB() ? mi1() : "API Usage Billing",
    Y = r3().agent;
  return {
    version: A,
    cwd: Q,
    modelDisplayName: G,
    billingType: Z,
    agentName: Y
  }
}
// @from(Ln 421214, Col 0)
function K89(A, Q, B) {
  if (A.length + 3 + Q.length > B) return {
    shouldSplit: !0,
    truncatedModel: YG(A, B),
    truncatedBilling: YG(Q, B)
  };
  return {
    shouldSplit: !1,
    truncatedModel: YG(A, Math.max(B - Q.length - 3, 10)),
    truncatedBilling: Q
  }
}
// @from(Ln 421227, Col 0)
function V89(A) {
  let Q = Z8A();
  if (!Q) return [];
  let B;
  try {
    B = Kz1(Q)
  } catch {
    return []
  }
  let G = [],
    Z = Object.keys(B).sort((Y, J) => Z89.gt(Y, J, {
      loose: !0
    }) ? -1 : 1).slice(0, 3);
  for (let Y of Z) {
    let J = B[Y];
    if (J) G.push(...J)
  }
  return G.slice(0, A)
}
// @from(Ln 421246, Col 4)
Z89
// @from(Ln 421246, Col 9)
Y89 = 50
// @from(Ln 421247, Col 2)
VV7 = 20
// @from(Ln 421248, Col 2)
_j0 = 4
// @from(Ln 421249, Col 2)
$z1 = 1
// @from(Ln 421250, Col 2)
Cz1 = 2
// @from(Ln 421251, Col 2)
ugA
// @from(Ln 421251, Col 7)
Uz1 = null
// @from(Ln 421252, Col 4)
wz1 = w(() => {
  Y8A();
  d4();
  C0();
  V2();
  y9();
  Q2();
  l2();
  GB();
  Z89 = c(xP(), 1);
  ugA = []
})
// @from(Ln 421265, Col 0)
function jj0() {
  if (l0.terminal === "Apple_Terminal") return C5.createElement(FV7, null);
  return C5.createElement(T, {
    flexDirection: "column"
  }, C5.createElement(C, null, C5.createElement(C, {
    color: "clawd_body"
  }, " ▐"), C5.createElement(C, {
    color: "clawd_body",
    backgroundColor: "clawd_background"
  }, "▛███▜"), C5.createElement(C, {
    color: "clawd_body"
  }, "▌")), C5.createElement(C, null, C5.createElement(C, {
    color: "clawd_body"
  }, "▝▜"), C5.createElement(C, {
    color: "clawd_body",
    backgroundColor: "clawd_background"
  }, "█████"), C5.createElement(C, {
    color: "clawd_body"
  }, "▛▘")), C5.createElement(C, {
    color: "clawd_body"
  }, "  ", "▘▘ ▝▝", "  "))
}
// @from(Ln 421288, Col 0)
function FV7() {
  return C5.createElement(T, {
    flexDirection: "column",
    alignItems: "center"
  }, C5.createElement(C, null, C5.createElement(C, {
    color: "clawd_body"
  }, "▗"), C5.createElement(C, {
    color: "clawd_background",
    backgroundColor: "clawd_body"
  }, " ", "▗", "   ", "▖", " "), C5.createElement(C, {
    color: "clawd_body"
  }, "▖")), C5.createElement(C, {
    backgroundColor: "clawd_body"
  }, " ".repeat(7)), C5.createElement(C, {
    color: "clawd_body"
  }, "▘▘ ▝▝"))
}
// @from(Ln 421305, Col 4)
C5
// @from(Ln 421306, Col 4)
F89 = w(() => {
  fA();
  p3();
  C5 = c(QA(), 1)
})
// @from(Ln 421312, Col 0)
function H89(A) {
  let {
    title: Q,
    lines: B,
    footer: G,
    emptyMessage: Z,
    customContent: Y
  } = A, J = Q.length;
  if (Y !== void 0) J = Math.max(J, Y.width);
  else if (B.length === 0 && Z) J = Math.max(J, Z.length);
  else {
    let I = Math.max(0, ...B.map((D) => D.timestamp ? D.timestamp.length : 0));
    for (let D of B) {
      let W = I > 0 ? I : 0,
        K = D.text.length + (W > 0 ? W + 2 : 0);
      J = Math.max(J, K)
    }
  }
  if (G) J = Math.max(J, G.length);
  return J
}
// @from(Ln 421334, Col 0)
function E89({
  config: A,
  actualWidth: Q
}) {
  let {
    title: B,
    lines: G,
    footer: Z,
    emptyMessage: Y,
    customContent: J
  } = A, X = "  ", I = Math.max(0, ...G.map((D) => D.timestamp ? D.timestamp.length : 0));
  return gG.createElement(T, {
    flexDirection: "column",
    width: Q
  }, gG.createElement(C, {
    bold: !0,
    color: "claude"
  }, B), J ? gG.createElement(gG.Fragment, null, J.content, Z && gG.createElement(C, {
    dimColor: !0,
    italic: !0
  }, YG(Z, Q))) : G.length === 0 && Y ? gG.createElement(C, {
    dimColor: !0
  }, YG(Y, Q)) : gG.createElement(gG.Fragment, null, G.map((D, W) => {
    let K = Math.max(10, Q - (I > 0 ? I + 2 : 0));
    return gG.createElement(C, {
      key: W
    }, I > 0 && gG.createElement(gG.Fragment, null, gG.createElement(C, {
      dimColor: !0
    }, (D.timestamp || "").padEnd(I)), "  "), gG.createElement(C, null, YG(D.text, K)))
  }), Z && gG.createElement(C, {
    dimColor: !0,
    italic: !0
  }, YG(Z, Q))))
}
// @from(Ln 421368, Col 4)
gG
// @from(Ln 421369, Col 4)
z89 = w(() => {
  fA();
  gG = c(QA(), 1)
})
// @from(Ln 421374, Col 0)
function $89({
  feeds: A,
  maxWidth: Q
}) {
  let B = A.map((Y) => H89(Y)),
    G = Math.max(...B),
    Z = Math.min(G, Q);
  return kx.createElement(T, {
    flexDirection: "column"
  }, A.map((Y, J) => kx.createElement(kx.Fragment, {
    key: J
  }, kx.createElement(E89, {
    config: Y,
    actualWidth: Z
  }), J < A.length - 1 && kx.createElement(K8, {
    dividerColor: "claude"
  }))))
}
// @from(Ln 421392, Col 4)
kx
// @from(Ln 421393, Col 4)
C89 = w(() => {
  fA();
  z89();
  lD();
  kx = c(QA(), 1)
})
// @from(Ln 421403, Col 0)
function Lz1(A) {
  let Q = A.map((B) => {
    let G = WQA(B.modified);
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
// @from(Ln 421419, Col 0)
function U89(A) {
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
// @from(Ln 421434, Col 0)
function q89(A) {
  let B = A.filter(({
      isEnabled: Z
    }) => Z).sort((Z, Y) => Number(Z.isComplete) - Number(Y.isComplete)).map(({
      text: Z,
      isComplete: Y
    }) => {
      return {
        text: `${Y?`${tA.tick} `:""}${Z}`
      }
    }),
    G = o1() === HV7() ? "Note: You have launched claude in your home directory. For the best experience, launch it in a project directory instead." : void 0;
  if (G) B.push({
    text: G
  });
  return {
    title: "Tips for getting started",
    lines: B
  }
}
// @from(Ln 421455, Col 0)
function N89() {
  return {
    title: "3 guest passes",
    lines: [],
    customContent: {
      content: jj.createElement(jj.Fragment, null, jj.createElement(T, {
        marginY: 1
      }, jj.createElement(C, {
        color: "claude"
      }, "[✻] [✻] [✻]")), jj.createElement(C, {
        dimColor: !0
      }, "Share Claude Code with friends")),
      width: 30
    },
    footer: "/passes"
  }
}
// @from(Ln 421472, Col 4)
jj
// @from(Ln 421473, Col 4)
w89 = w(() => {
  B2();
  V2();
  fA();
  jj = c(QA(), 1)
})
// @from(Ln 421479, Col 0)
async function EV7(A = "claude_code_guest_pass") {
  let {
    accessToken: Q,
    orgUUID: B
  } = await oS(), G = {
    ...IV(Q),
    "x-organization-uuid": B
  }, Z = `${v9().BASE_API_URL}/api/oauth/organizations/${B}/referral/eligibility`;
  return (await xQ.get(Z, {
    headers: G,
    params: {
      campaign: A
    },
    timeout: 5000
  })).data
}
// @from(Ln 421495, Col 0)
async function M89(A = "claude_code_guest_pass") {
  let {
    accessToken: Q,
    orgUUID: B
  } = await oS(), G = {
    ...IV(Q),
    "x-organization-uuid": B
  }, Z = `${v9().BASE_API_URL}/api/oauth/organizations/${B}/referral/redemptions`;
  return (await xQ.get(Z, {
    headers: G,
    params: {
      campaign: A
    },
    timeout: 1e4
  })).data
}
// @from(Ln 421512, Col 0)
function R89() {
  return !!(v3()?.organizationUuid && qB() && N6() === "max")
}
// @from(Ln 421516, Col 0)
function Oz1() {
  if (!R89()) return {
    eligible: !1,
    needsRefresh: !1,
    hasCache: !1
  };
  let A = v3()?.organizationUuid;
  if (!A) return {
    eligible: !1,
    needsRefresh: !1,
    hasCache: !1
  };
  let B = L1().passesEligibilityCache?.[A];
  if (!B) return {
    eligible: !1,
    needsRefresh: !0,
    hasCache: !1
  };
  let {
    eligible: G,
    timestamp: Z
  } = B, J = Date.now() - Z > O89;
  return {
    eligible: G,
    needsRefresh: J,
    hasCache: !0
  }
}
// @from(Ln 421544, Col 0)
async function L89() {
  if (dgA) return k("Passes: Reusing in-flight eligibility fetch"), dgA;
  let A = v3()?.organizationUuid;
  if (!A) return null;
  return dgA = (async () => {
    try {
      let Q = await EV7(),
        B = {
          ...Q,
          timestamp: Date.now()
        };
      return S0((G) => ({
        ...G,
        passesEligibilityCache: {
          ...G.passesEligibilityCache,
          [A]: B
        }
      })), k(`Passes eligibility cached for org ${A}: ${Q.eligible}`), Q
    } catch (Q) {
      return k("Failed to fetch and cache passes eligibility"), e(Q), null
    } finally {
      dgA = null
    }
  })(), dgA
}
// @from(Ln 421569, Col 0)
async function cgA() {
  if (!R89()) return null;
  let A = v3()?.organizationUuid;
  if (!A) return null;
  let B = L1().passesEligibilityCache?.[A],
    G = Date.now();
  if (!B) return k("Passes: No cache, fetching eligibility in background (command unavailable this session)"), L89(), null;
  if (G - B.timestamp > O89) {
    k("Passes: Cache stale, returning cached data and refreshing in background"), L89();
    let {
      timestamp: J,
      ...X
    } = B;
    return X
  }
  k("Passes: Using fresh cached eligibility data");
  let {
    timestamp: Z,
    ...Y
  } = B;
  return Y
}
// @from(Ln 421591, Col 0)
async function _89() {
  cgA()
}
// @from(Ln 421594, Col 4)
O89 = 3600000
// @from(Ln 421595, Col 2)
dgA = null
// @from(Ln 421596, Col 4)
A$A = w(() => {
  j5();
  JX();
  zf();
  GQ();
  Q2();
  T1();
  v1()
})
// @from(Ln 421606, Col 0)
function zV7() {
  let A = L1(),
    {
      eligible: Q,
      hasCache: B
    } = Oz1();
  if (!Q || !B) return !1;
  if ((A.passesUpsellSeenCount ?? 0) >= 3) return !1;
  if (A.hasVisitedPasses) return !1;
  return !0
}
// @from(Ln 421618, Col 0)
function Mz1() {
  let [A] = j89.useState(() => zV7());
  return A
}
// @from(Ln 421623, Col 0)
function Rz1() {
  let Q = (L1().passesUpsellSeenCount ?? 0) + 1;
  S0((B) => ({
    ...B,
    passesUpsellSeenCount: (B.passesUpsellSeenCount ?? 0) + 1
  })), l("tengu_guest_passes_upsell_shown", {
    seen_count: Q
  })
}
// @from(Ln 421633, Col 0)
function T89() {
  return Ep.createElement(C, {
    dimColor: !0
  }, Ep.createElement(C, {
    color: "claude"
  }, "[✻]"), " ", Ep.createElement(C, {
    color: "claude"
  }, "[✻]"), " ", Ep.createElement(C, {
    color: "claude"
  }, "[✻]"), " · 3 guest passes at /passes")
}
// @from(Ln 421644, Col 4)
Ep
// @from(Ln 421644, Col 8)
j89
// @from(Ln 421645, Col 4)
Tj0 = w(() => {
  fA();
  GQ();
  A$A();
  Z0();
  Ep = c(QA(), 1), j89 = c(QA(), 1)
})
// @from(Ln 421653, Col 0)
function $V7() {
  if (l0.terminal === "Apple_Terminal") return V9.createElement(T, {
    flexDirection: "column",
    alignItems: "center"
  }, V9.createElement(C, null, V9.createElement(C, {
    color: "clawd_body"
  }, "▗"), V9.createElement(C, {
    color: "clawd_background",
    backgroundColor: "clawd_body"
  }, " ", "▗", "   ", "▖", " "), V9.createElement(C, {
    color: "clawd_body"
  }, "▖")), V9.createElement(C, {
    backgroundColor: "clawd_body"
  }, " ".repeat(7)), V9.createElement(C, {
    color: "clawd_body"
  }, "▘▘ ▝▝"));
  return V9.createElement(T, {
    flexDirection: "column"
  }, V9.createElement(C, null, V9.createElement(C, {
    color: "clawd_body"
  }, " ▐"), V9.createElement(C, {
    color: "clawd_body",
    backgroundColor: "clawd_background"
  }, "▛███▜"), V9.createElement(C, {
    color: "clawd_body"
  }, "▌")), V9.createElement(C, null, V9.createElement(C, {
    color: "clawd_body"
  }, "▝▜"), V9.createElement(C, {
    color: "clawd_body",
    backgroundColor: "clawd_background"
  }, "█████"), V9.createElement(C, {
    color: "clawd_body"
  }, "▛▘")), V9.createElement(C, {
    color: "clawd_body"
  }, "  ", "▘▘ ▝▝", "  "))
}
// @from(Ln 421690, Col 0)
function S89() {
  let {
    columns: A
  } = ZB(), [Q] = a0(), {
    version: B,
    cwd: G,
    modelDisplayName: Z,
    billingType: Y,
    agentName: J
  } = Nz1(), X = Q.agent ?? J, I = Mz1();
  P89.useEffect(() => {
    if (I) Rz1()
  }, [I]);
  let D = Math.max(A - 15, 20),
    K = YG(B, Math.max(D - "Claude Code v".length, 6)),
    {
      shouldSplit: V,
      truncatedModel: F,
      truncatedBilling: H
    } = K89(Z, Y, D),
    E = " · ",
    z = X ? D - X.length - E.length : D,
    $ = mgA(G, Math.max(z, 10));
  return V9.createElement(T, {
    flexDirection: "row",
    gap: 2,
    alignItems: "center"
  }, V9.createElement($V7, null), V9.createElement(T, {
    flexDirection: "column"
  }, V9.createElement(C, null, V9.createElement(C, {
    bold: !0
  }, "Claude Code"), " ", V9.createElement(C, {
    dimColor: !0
  }, "v", K)), V ? V9.createElement(V9.Fragment, null, V9.createElement(C, {
    dimColor: !0
  }, F), V9.createElement(C, {
    dimColor: !0
  }, H)) : V9.createElement(C, {
    dimColor: !0
  }, F, " · ", H), V9.createElement(C, {
    dimColor: !0
  }, X ? `${X} · ${$}` : $), I && V9.createElement(T89, null)))
}
// @from(Ln 421733, Col 4)
V9
// @from(Ln 421733, Col 8)
P89
// @from(Ln 421734, Col 4)
x89 = w(() => {
  fA();
  p3();
  P4();
  wz1();
  Tj0();
  hB();
  V9 = c(QA(), 1), P89 = c(QA(), 1)
})
// @from(Ln 421744, Col 0)
function Pj0() {
  let A = lgA.useMemo(qV7, []),
    Q = lgA.useMemo(() => L1().lastShownEmergencyTip, []),
    B = A.tip && A.tip !== Q;
  if (lgA.useEffect(() => {
      if (B) S0((G) => {
        if (G.lastShownEmergencyTip === A.tip) return G;
        return {
          ...G,
          lastShownEmergencyTip: A.tip
        }
      })
    }, [B, A.tip]), !B) return null;
  return pgA.createElement(T, {
    paddingLeft: 2,
    flexDirection: "column"
  }, pgA.createElement(C, {
    ...A.color === "warning" ? {
      color: "warning"
    } : A.color === "error" ? {
      color: "error"
    } : {
      dimColor: !0
    }
  }, A.tip))
}
// @from(Ln 421771, Col 0)
function qV7() {
  return HMA(CV7, UV7)
}
// @from(Ln 421774, Col 4)
pgA
// @from(Ln 421774, Col 9)
lgA
// @from(Ln 421774, Col 14)
CV7 = "tengu-top-of-feed-tip"
// @from(Ln 421775, Col 2)
UV7
// @from(Ln 421776, Col 4)
y89 = w(() => {
  fA();
  w6();
  GQ();
  pgA = c(QA(), 1), lgA = c(QA(), 1);
  UV7 = {
    tip: "",
    color: "dim"
  }
})
// @from(Ln 421787, Col 0)
function v89({
  isBeforeFirstMessage: A
}) {
  let Q = B89(A),
    B = W89(),
    G = L1().oauthAccount?.displayName ?? "",
    {
      columns: Z
    } = ZB(),
    Y = sMB(),
    J = XB.isSandboxingEnabled(),
    X = Mz1(),
    I = YU(),
    [D] = a0(),
    W = L1(),
    K;
  try {
    K = V89(3)
  } catch {
    K = []
  }
  let V = I.companyAnnouncements,
    [F] = igA.useState(() => V && V.length > 0 ? W.numStartups === 1 ? V[0] : V[Math.floor(Math.random() * V.length)] : void 0),
    {
      hasReleaseNotes: H
    } = hgA(W.lastReleaseNotesSeen);
  igA.useEffect(() => {
    if (L1().lastReleaseNotesSeen === {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.7",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-01-13T22:55:21Z"
      }.VERSION) return;
    if (S0((bA) => {
        if (bA.lastReleaseNotesSeen === {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.7",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-01-13T22:55:21Z"
          }.VERSION) return bA;
        return {
          ...bA,
          lastReleaseNotesSeen: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.7",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-01-13T22:55:21Z"
          }.VERSION
        }
      }), Y) tMB()
  }, [W, Y]), igA.useEffect(() => {
    if (X && !Y) Rz1()
  }, [X, Y]);
  let {
    version: E,
    cwd: z,
    modelDisplayName: $,
    billingType: O,
    agentName: L
  } = Nz1(), M = D.agent ?? L, _ = YG($, Sj0 - 20);
  if (!H && !Y && !a1(process.env.CLAUDE_CODE_FORCE_FULL_LOGO)) return eQ.createElement(eQ.Fragment, null, eQ.createElement(T, null), eQ.createElement(S89, null), J7A() && eQ.createElement(T, {
    paddingLeft: 2,
    flexDirection: "column"
  }, eQ.createElement(C, {
    color: "warning"
  }, "Debug mode enabled"), eQ.createElement(C, {
    dimColor: !0
  }, "Logging to: ", Sy() ? "stderr" : kCA())), eQ.createElement(Pj0, null), F && eQ.createElement(T, {
    paddingLeft: 2,
    flexDirection: "column"
  }, !process.env.IS_DEMO && W.oauthAccount?.organizationName && eQ.createElement(C, {
    dimColor: !0
  }, "Message from ", W.oauthAccount.organizationName, ":"), eQ.createElement(C, null, F)), !1, !1);
  let j = J89(Z),
    x = L1().theme,
    b = ` ${sQ("claude",x)("Claude Code")} ${sQ("inactive",x)(`v${E}`)} `,
    S = sQ("claude", x)(" Claude Code ");
  if (j === "compact") {
    let bA = qz1(G);
    if (bA.length > Z - 4) bA = qz1(null);
    let jA = " · ",
      OA = M ? Z - 4 - M.length - jA.length : Z - 4,
      IA = mgA(z, Math.max(OA, 10));
    return eQ.createElement(eQ.Fragment, null, eQ.createElement(T, {
      flexDirection: "column",
      borderStyle: "round",
      borderColor: "claude",
      borderText: {
        content: S,
        position: "top",
        align: "start",
        offset: 1
      },
      paddingX: 1,
      paddingY: 1,
      alignItems: "center",
      width: Z
    }, eQ.createElement(C, {
      bold: !0
    }, bA), eQ.createElement(T, {
      marginY: 1
    }, eQ.createElement(T, {
      height: 5,
      flexDirection: "column",
      justifyContent: "flex-end"
    }, eQ.createElement(T, {
      marginBottom: Q
    }, eQ.createElement(jj0, null)))), eQ.createElement(C, {
      dimColor: !0
    }, _), eQ.createElement(C, {
      dimColor: !0
    }, O), eQ.createElement(C, {
      dimColor: !0
    }, M ? `${M} · ${IA}` : IA)), J && eQ.createElement(T, {
      marginTop: 1,
      flexDirection: "column"
    }, eQ.createElement(C, {
      color: "warning"
    }, "Your bash commands will be sandboxed. Disable with /sandbox.")))
  }
  let u = qz1(G),
    f = !process.env.IS_DEMO && W.oauthAccount?.organizationName ? `${_} · ${O} · ${W.oauthAccount.organizationName}` : `${_} · ${O}`,
    AA = " · ",
    n = M ? Sj0 - M.length - AA.length : Sj0,
    y = mgA(z, Math.max(n, 10)),
    p = M ? `${M} · ${y}` : y,
    GA = I89(u, p, f),
    {
      leftWidth: WA,
      rightWidth: MA
    } = X89(Z, j, GA);
  return eQ.createElement(eQ.Fragment, null, eQ.createElement(T, null), eQ.createElement(T, {
    flexDirection: "column",
    borderStyle: "round",
    borderColor: "claude",
    borderText: {
      content: b,
      position: "top",
      align: "start",
      offset: 3
    }
  }, eQ.createElement(T, {
    flexDirection: j === "horizontal" ? "row" : "column",
    paddingX: 1,
    gap: 1
  }, eQ.createElement(T, {
    flexDirection: "column",
    width: WA,
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 9
  }, eQ.createElement(T, {
    marginTop: 1
  }, eQ.createElement(C, {
    bold: !0
  }, u)), eQ.createElement(T, {
    height: 5,
    flexDirection: "column",
    justifyContent: "flex-end"
  }, eQ.createElement(T, {
    marginBottom: Q
  }, eQ.createElement(jj0, null))), eQ.createElement(T, {
    flexDirection: "column",
    alignItems: "center"
  }, eQ.createElement(C, {
    dimColor: !0
  }, f), eQ.createElement(C, {
    dimColor: !0
  }, p))), j === "horizontal" && eQ.createElement(K8, {
    orientation: "vertical",
    dividerColor: "claude"
  }), j === "horizontal" && eQ.createElement($89, {
    feeds: Y ? [q89(kB0()), Lz1(B)] : X ? [Lz1(B), N89()] : [Lz1(B), U89(K)],
    maxWidth: MA
  }))), J7A() && eQ.createElement(T, {
    paddingLeft: 2,
    flexDirection: "column"
  }, eQ.createElement(C, {
    color: "warning"
  }, "Debug mode enabled"), eQ.createElement(C, {
    dimColor: !0
  }, "Logging to: ", Sy() ? "stderr" : kCA())), eQ.createElement(Pj0, null), F && eQ.createElement(T, {
    paddingLeft: 2,
    flexDirection: "column"
  }, !process.env.IS_DEMO && W.oauthAccount?.organizationName && eQ.createElement(C, {
    dimColor: !0
  }, "Message from ", W.oauthAccount.organizationName, ":"), eQ.createElement(C, null, F)), J && eQ.createElement(T, {
    paddingLeft: 2,
    flexDirection: "column"
  }, eQ.createElement(C, {
    color: "warning"
  }, "Your bash commands will be sandboxed. Disable with /sandbox.")), !1, !1)
}
// @from(Ln 421986, Col 4)
eQ
// @from(Ln 421986, Col 8)
igA
// @from(Ln 421986, Col 13)
Sj0 = 50
// @from(Ln 421987, Col 4)
k89 = w(() => {
  fA();
  P4();
  G89();
  wz1();
  y9();
  F89();
  C89();
  w89();
  lD();
  GQ();
  ar();
  T1();
  KjA();
  x89();
  Y8A();
  OyA();
  fQ();
  aAA();
  y89();
  NJ();
  Tj0();
  hB();
  eQ = c(QA(), 1), igA = c(QA(), 1)
})
// @from(Ln 422013, Col 0)
function xj0({
  question: A,
  response: Q
}) {
  let [B, G] = b89.useState(0);
  return XZ(() => G((Z) => Z + 1), Q ? null : 80), zV.createElement(T, {
    flexDirection: "column",
    paddingLeft: 2,
    marginTop: 1
  }, zV.createElement(T, null, zV.createElement(C, {
    color: "warning",
    bold: !0
  }, "/btw", " "), zV.createElement(C, {
    dimColor: !0
  }, A)), zV.createElement(T, {
    marginTop: 1,
    marginLeft: 2
  }, Q ? zV.createElement(C, null, Q) : zV.createElement(T, null, zV.createElement(KkA, {
    frame: B,
    messageColor: "warning"
  }), zV.createElement(C, {
    color: "warning"
  }, "Answering..."))))
}
// @from(Ln 422037, Col 4)
b89
// @from(Ln 422037, Col 9)
zV
// @from(Ln 422038, Col 4)
f89 = w(() => {
  fA();
  oK();
  IE0();
  b89 = c(QA(), 1), zV = c(QA(), 1)
})
// @from(Ln 422045, Col 0)
function NV7(A, Q) {
  for (let B = Q + 1; B < A.length; B++) {
    let G = A[B];
    if (G?.type === "assistant") {
      let Z = G.message.content[0];
      if (Z?.type === "thinking" || Z?.type === "redacted_thinking") continue;
      return !0
    }
    if (G?.type === "system" || G?.type === "attachment") continue;
    return !0
  }
  return !1
}
// @from(Ln 422059, Col 0)
function LV7(A, Q) {
  if (A.size !== Q.size) return !1;
  for (let B of A)
    if (!Q.has(B)) return !1;
  return !0
}
// @from(Ln 422066, Col 0)
function OV7(A, Q, B, G, Z, Y, J) {
  if (Y === "transcript") return !0;
  switch (A.type) {
    case "attachment":
    case "user":
    case "assistant": {
      let X = ogA(A);
      if (!X) return !0;
      if (Q.has(X)) return !1;
      if (G.has(X)) return !1;
      if (m89(X, "PostToolUse", J)) return !1;
      return s39(Z, B)
    }
    case "system":
      return A.subtype !== "api_error";
    case "grouped_tool_use":
      return A.messages.every((I) => {
        let D = I.message.content[0];
        return D?.type === "tool_use" && B.has(D.id)
      });
    case "collapsed_read_search":
      return !1
  }
}
// @from(Ln 422090, Col 4)
W3
// @from(Ln 422090, Col 8)
R$
// @from(Ln 422090, Col 12)
ngA = 10
// @from(Ln 422091, Col 2)
wV7 = ({
    messages: A,
    normalizedMessageHistory: Q,
    tools: B,
    commands: G,
    verbose: Z,
    toolJSX: Y,
    toolUseConfirmQueue: J,
    inProgressToolUseIDs: X,
    isMessageSelectorVisible: I,
    conversationId: D,
    screen: W,
    screenToggleId: K,
    streamingToolUses: V,
    showAllInTranscript: F = !1,
    agentDefinitions: H,
    onOpenRateLimitOptions: E,
    sideQuestionResponse: z,
    hideLogo: $ = !1,
    isLoading: O,
    hidePastThinking: L = !1,
    streamingThinking: M
  }) => {
    let {
      columns: _
    } = ZB(), j = R$.useContext(AN), x = J3("transcript:toggleShowAll", "Transcript", "Ctrl+E"), b = R$.useMemo(() => [...Q, ...a7(A).filter(UzA)], [A, Q]), S = R$.useMemo(() => new Set(Object.keys(_z1(b))), [b]), u = R$.useMemo(() => d89(b), [b]), f = R$.useMemo(() => {
      if (!M) return !1;
      if (M.isStreaming) return !0;
      if (M.streamingEndedAt) return Date.now() - M.streamingEndedAt < 30000;
      return !1
    }, [M]), AA = R$.useMemo(() => {
      if (!L) return null;
      if (f) return "streaming";
      for (let OA = b.length - 1; OA >= 0; OA--) {
        let IA = b[OA];
        if (IA?.type === "assistant") {
          let HA = IA.message.content;
          for (let ZA = HA.length - 1; ZA >= 0; ZA--)
            if (HA[ZA]?.type === "thinking") return `${IA.uuid}:${ZA}`
        }
      }
      return null
    }, [b, L, f]), n = R$.useMemo(() => V.filter((OA) => {
      if (X.has(OA.contentBlock.id)) return !1;
      if (b.some((IA) => IA.type === "assistant" && IA.message.content[0].type === "tool_use" && IA.message.content[0].id === OA.contentBlock.id)) return !1;
      return !0
    }), [V, X, b]), y = R$.useMemo(() => n.flatMap((OA) => a7([QU({
      content: [OA.contentBlock]
    })])), [n]), p = R$.useMemo(() => {
      let OA = W === "transcript",
        IA = OA && !F,
        HA = Z ? b : _x(b),
        ZA = BR0(HA.filter((s) => s.type !== "progress").filter((s) => GR0(s, OA)), y),
        zA = IA ? ZA.slice(-ngA) : ZA,
        wA = IA && ZA.length > ngA,
        _A = {
          type: "static",
          jsx: W3.createElement(T, {
            flexDirection: "column",
            gap: 1,
            key: `logo-${D}-${K}`
          }, W3.createElement(v89, {
            isBeforeFirstMessage: !1
          }), W3.createElement(a39, {
            agentDefinitions: H
          }))
        };
      return [...$ ? [] : [_A], ...wA ? [{
        type: "static",
        jsx: W3.createElement(K8, {
          key: `truncation-indicator-${D}-${K}`,
          dividerChar: "─",
          title: `${x} to show ${I1.bold(b.length-ngA)} previous messages`,
          width: _
        })
      }] : [], ...OA && F && b.length > ngA ? [{
        type: "static",
        jsx: W3.createElement(K8, {
          key: `hide-indicator-${D}-${K}`,
          dividerChar: "─",
          title: `${x} to hide ${I1.bold(b.length-ngA)} previous messages`,
          width: _
        })
      }] : [], ...(() => {
        let {
          messages: s
        } = u39(zA, B, Z), t = WP2(s, Z, B), BA = h89(b, zA), DA = new Set(V.map((FA) => FA.contentBlock.id)), CA = (!Y || !!Y.shouldContinueAnimation) && !J.length && !I;
        return t.map((FA, xA) => {
          let mA = FA.type === "grouped_tool_use",
            G1 = FA.type === "collapsed_read_search",
            J1 = G1 && O && !NV7(t, xA),
            SA = xA > 0 ? t[xA - 1] : null,
            A1 = FA.type === "user" && SA?.type === "user",
            n1 = mA ? FA.displayMessage : G1 ? DP2(FA) : FA,
            S1 = mA || G1 ? [] : u89(FA, BA),
            L0 = mA || G1 ? new Set : g89(FA, BA),
            VQ = OV7(FA, DA, S, X, L0, W, BA) ? "static" : "transient",
            t0 = !1;
          if (CA)
            if (mA) t0 = FA.messages.some((QQ) => {
              let y1 = QQ.message.content[0];
              return y1?.type === "tool_use" && X.has(y1.id)
            });
            else if (G1) t0 = IP2(FA, X);
          else {
            let QQ = ogA(FA);
            t0 = !QQ || X.has(QQ)
          }
          return {
            type: VQ,
            jsx: W3.createElement(T, {
              key: `${FA.uuid}-${D}-${K}`,
              width: _,
              flexDirection: "row",
              flexWrap: "nowrap",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 1
            }, W3.createElement(PO, {
              message: FA,
              messages: b,
              addMargin: !0,
              tools: B,
              commands: G,
              verbose: Z,
              erroredToolUseIDs: u,
              inProgressToolUseIDs: X,
              progressMessagesForMessage: S1,
              shouldAnimate: t0,
              shouldShowDot: !0,
              resolvedToolUseIDs: S,
              isTranscriptMode: OA,
              isStatic: VQ === "static",
              onOpenRateLimitOptions: E,
              isActiveCollapsedGroup: J1,
              isUserContinuation: A1,
              lastThinkingBlockId: AA
            }), W3.createElement(t39, {
              message: n1,
              isTranscriptMode: OA
            }), W3.createElement(A89, {
              message: n1,
              isTranscriptMode: OA
            }))
          }
        })
      })()]
    }, [$, W, F, Z, b, y, D, K, H, _, V, S, B, G, u, X, Y, J.length, I, E, O, AA, x]), GA = X.size > 0, {
      progress: WA
    } = Tk(), MA = R$.useRef(null), TA = L1().terminalProgressBarEnabled;
    if (R$.useEffect(() => {
        let OA = TA ? GA ? "indeterminate" : "completed" : null;
        if (MA.current === OA) return;
        MA.current = OA, WA(OA)
      }, [WA, TA, GA]), R$.useEffect(() => {
        return () => WA(null)
      }, [WA]), j) return W3.createElement(W3.Fragment, null, p.map((OA) => OA.jsx), f && M && W3.createElement(T, {
      marginTop: 1
    }, W3.createElement(gkA, {
      param: {
        type: "thinking",
        thinking: M.thinking
      },
      addMargin: !1,
      isTranscriptMode: !0,
      verbose: !0,
      hideInTranscript: !1
    })), z && W3.createElement(xj0, {
      question: z.question,
      response: z.response
    }));
    let bA = p.filter((OA) => OA.type === "static"),
      jA = p.filter((OA) => OA.type === "transient");
    return W3.createElement(W3.Fragment, null, W3.createElement(ha, {
      key: `static-messages-${D}-${K}`,
      items: bA
    }, (OA) => OA.jsx), jA.map((OA) => OA.jsx), f && M && W3.createElement(T, {
      marginTop: 1
    }, W3.createElement(gkA, {
      param: {
        type: "thinking",
        thinking: M.thinking
      },
      addMargin: !1,
      isTranscriptMode: !0,
      verbose: !0,
      hideInTranscript: !1
    })), z && W3.createElement(xj0, {
      question: z.question,
      response: z.response
    }))
  }
// @from(Ln 422283, Col 2)
we
// @from(Ln 422284, Col 4)
agA = w(() => {
  fA();
  fA();
  ba();
  tQ();
  wD1();
  o39();
  x6A();
  P4();
  lD();
  Z3();
  e39();
  Q89();
  k89();
  f89();
  wz0();
  NX();
  nBA();
  GQ();
  W3 = c(QA(), 1), R$ = c(QA(), 1);
  we = W3.memo(wV7, (A, Q) => {
    let B = Object.keys(A);
    for (let G of B) {
      if (G === "onOpenRateLimitOptions") continue;
      if (A[G] !== Q[G]) {
        if (G === "streamingToolUses") {
          let Z = A.streamingToolUses,
            Y = Q.streamingToolUses;
          if (Z.length === Y.length && Z.every((J, X) => J.contentBlock === Y[X]?.contentBlock)) continue
        }
        if (G === "inProgressToolUseIDs") {
          if (LV7(A.inProgressToolUseIDs, Q.inProgressToolUseIDs)) continue
        }
        if (G === "tools") {
          let Z = A.tools,
            Y = Q.tools;
          if (Z.length === Y.length && Z.every((J, X) => J.name === Y[X]?.name)) continue
        }
        return !1
      }
    }
    return !0
  })
})
// @from(Ln 422329, Col 0)
function c89({
  log: A,
  onExit: Q,
  onSelect: B
}) {
  let [G, Z] = $V.default.useState(null), [Y, J] = $V.default.useState(!1);
  $V.default.useEffect(() => {
    if (Gj(A)) J(!0), Vx(A).then((W) => {
      Z(W), J(!1)
    });
    else Z(A)
  }, [A]);
  let X = G ?? A,
    I = xX(X) || "",
    D = zK1();
  if (J0((W, K) => {
      if (K.escape) Q();
      else if (K.return) B(G ?? A)
    }), Y) return $V.default.createElement(T, {
    flexDirection: "column",
    padding: 1
  }, $V.default.createElement(T, null, $V.default.createElement(W9, null), $V.default.createElement(C, null, " Loading session…")), $V.default.createElement(C, {
    dimColor: !0
  }, $V.default.createElement(vQ, null, $V.default.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "cancel"
  }))));
  return $V.default.createElement(T, {
    flexDirection: "column"
  }, $V.default.createElement(we, {
    messages: X.messages,
    normalizedMessageHistory: [],
    tools: D,
    commands: [],
    verbose: !0,
    toolJSX: null,
    toolUseConfirmQueue: [],
    inProgressToolUseIDs: new Set,
    isMessageSelectorVisible: !1,
    conversationId: I,
    screen: "transcript",
    screenToggleId: 1,
    streamingToolUses: [],
    showAllInTranscript: !0,
    isLoading: !1
  }), $V.default.createElement(T, {
    flexShrink: 0,
    flexDirection: "column",
    borderTopDimColor: !0,
    borderBottom: !1,
    borderLeft: !1,
    borderRight: !1,
    borderStyle: "single",
    paddingLeft: 2
  }, $V.default.createElement(C, null, WQA(X.modified), " ·", " ", X.messageCount, " messages", X.gitBranch ? ` · ${X.gitBranch}` : ""), $V.default.createElement(C, {
    dimColor: !0
  }, $V.default.createElement(vQ, null, $V.default.createElement(F0, {
    shortcut: "Enter",
    action: "resume"
  }), $V.default.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "cancel"
  })))))
}
// @from(Ln 422397, Col 4)
$V
// @from(Ln 422398, Col 4)
p89 = w(() => {
  fA();
  agA();
  az();
  e9();
  I3();
  K6();
  d4();
  yG();
  $V = c(QA(), 1)
})
// @from(Ln 422410, Col 0)
function jV7(A, Q) {
  if (A === yj0) return yj0.length + rgA;
  let B = Q ? Math.min(A.length, Q - rgA - vj0) : A.length;
  return Math.max(0, B) + rgA + vj0
}
// @from(Ln 422416, Col 0)
function TV7(A, Q) {
  let B = Q - rgA - vj0;
  if (A.length <= B) return A;
  if (B <= 1) return A.charAt(0);
  return A.slice(0, B - 1) + "…"
}
// @from(Ln 422423, Col 0)
function r89({
  tabs: A,
  selectedIndex: Q,
  availableWidth: B,
  showAllProjects: G = !1
}) {
  let Z = G ? "Resume (All Projects)" : "Resume",
    Y = Z.length + 1,
    J = Math.max(RV7, _V7),
    X = B - Y - J - 2,
    I = Math.max(0, Math.min(Q, A.length - 1)),
    D = Math.max(20, Math.floor(X / 2)),
    W = A.map((O) => jV7(O, D)),
    K = 0,
    V = A.length;
  if (W.reduce((O, L, M) => O + L + (M < W.length - 1 ? 1 : 0), 0) > X) {
    let O = X - MV7,
      L = W[I] ?? 0;
    K = I, V = I + 1;
    while (K > 0 || V < A.length) {
      let M = K > 0,
        _ = V < A.length;
      if (M) {
        let j = (W[K - 1] ?? 0) + 1;
        if (L + j <= O) {
          K--, L += j;
          continue
        }
      }
      if (_) {
        let j = (W[V] ?? 0) + 1;
        if (L + j <= O) {
          V++, L += j;
          continue
        }
      }
      break
    }
  }
  let H = K,
    E = A.length - V,
    z = A.slice(K, V),
    $ = z.map((O, L) => K + L);
  return X8A.default.createElement(T, {
    flexDirection: "row",
    gap: 1
  }, X8A.default.createElement(C, {
    color: "suggestion"
  }, Z), H > 0 && X8A.default.createElement(C, {
    dimColor: !0
  }, l89, H), z.map((O, L) => {
    let _ = $[L] === I,
      j = O === yj0 ? O : `#${TV7(O,D-rgA)}`;
    return X8A.default.createElement(C, {
      key: O,
      backgroundColor: _ ? "suggestion" : void 0,
      color: _ ? "inverseText" : void 0,
      bold: _
    }, " ", j, " ")
  }), E > 0 ? X8A.default.createElement(C, {
    dimColor: !0
  }, i89, E, n89) : X8A.default.createElement(C, {
    dimColor: !0
  }, a89))
}
// @from(Ln 422488, Col 4)
X8A
// @from(Ln 422488, Col 9)
yj0 = "All"
// @from(Ln 422489, Col 2)
rgA = 2
// @from(Ln 422490, Col 2)
vj0 = 1
// @from(Ln 422491, Col 2)
l89 = "← "
// @from(Ln 422492, Col 2)
i89 = "→"
// @from(Ln 422493, Col 2)
n89 = " (tab to cycle)"
// @from(Ln 422494, Col 2)
a89 = "(tab to cycle)"
// @from(Ln 422495, Col 2)
o89 = 2
// @from(Ln 422496, Col 2)
MV7
// @from(Ln 422496, Col 7)
RV7
// @from(Ln 422496, Col 12)
_V7
// @from(Ln 422497, Col 4)
s89 = w(() => {
  fA();
  X8A = c(QA(), 1), MV7 = l89.length + o89 + 1, RV7 = i89.length + o89 + n89.length, _V7 = a89.length
})
// @from(Ln 422502, Col 0)
function A59(A, Q) {
  let B = A.replace(/\s+/g, " ").trim();
  if (B.length <= Q) return B;
  return B.slice(0, Q).trim() + "…"
}
// @from(Ln 422508, Col 0)
function kj0({
  before: A,
  match: Q,
  after: B
}, G) {
  return I1.dim(A) + G(Q) + I1.dim(B)
}
// @from(Ln 422516, Col 0)
function bV7(A, Q, B) {
  let G = A.toLowerCase().indexOf(Q.toLowerCase());
  if (G === -1) return null;
  let Z = G + Q.length,
    Y = Math.max(0, G - B),
    J = Math.min(A.length, Z + B),
    X = A.slice(Y, G),
    I = A.slice(G, Z),
    D = A.slice(Z, J);
  return {
    before: (Y > 0 ? "…" : "") + X.replace(/\s+/g, " "),
    match: I,
    after: D.replace(/\s+/g, " ") + (J < A.length ? "…" : "")
  }
}
// @from(Ln 422532, Col 0)
function bj0(A, Q, B) {
  let {
    isGroupHeader: G = !1,
    isChild: Z = !1,
    forkCount: Y = 0
  } = B || {}, J = G && Y > 0 ? PV7 : Z ? SV7 : 0, X = G && Y > 0 ? ` (+${Y} other ${Y===1?"session":"sessions"})` : "", I = A.isSidechain ? " (sidechain)" : "", D = Q - J - I.length - X.length;
  return `${A59(hl(A),D)}${I}${X}`
}
// @from(Ln 422541, Col 0)
function fj0(A, Q) {
  let {
    isChild: B = !1,
    showProjectPath: G = !1
  } = Q || {}, Z = B ? "    " : "", Y = qOA(A), J = G && A.projectPath ? ` · ${A.projectPath}` : "";
  return Z + Y + J
}
// @from(Ln 422549, Col 0)
function sgA({
  logs: A,
  maxHeight: Q = 1 / 0,
  forceWidth: B,
  onCancel: G,
  onSelect: Z,
  onLogsChanged: Y,
  initialSearchQuery: J,
  showAllProjects: X = !1,
  onToggleAllProjects: I,
  onAgenticSearch: D
}) {
  let W = ZB(),
    K = B === void 0 ? W.columns : B,
    V = MQ(G),
    F = GN(),
    H = zp(),
    E = !1,
    [z] = oB(),
    $ = jP(z),
    O = mQ.default.useMemo(() => (s0) => Mk(s0, $.warning), [$.warning]),
    L = !1,
    [M, _] = mQ.default.useState(null),
    [j, x] = mQ.default.useState(!1),
    [b, S] = mQ.default.useState(!1),
    [u, f] = mQ.default.useState(!1),
    AA = mQ.default.useMemo(() => EQ(), []),
    [n, y] = mQ.default.useState(J || ""),
    [p, GA] = mQ.default.useState(""),
    [WA, MA] = mQ.default.useState(0),
    [TA, bA] = mQ.default.useState(new Set),
    [jA, OA] = mQ.default.useState(null),
    [IA, HA] = mQ.default.useState("list"),
    [ZA, zA] = mQ.default.useState(null),
    wA = mQ.default.useRef(null),
    [_A, s] = mQ.default.useState(0),
    [t, BA] = mQ.default.useState({
      status: "idle"
    }),
    [DA, CA] = mQ.default.useState(!1),
    FA = mQ.default.useRef(null),
    xA = mQ.default.useDeferredValue(n),
    [mA, G1] = mQ.default.useState("");
  mQ.default.useEffect(() => {
    if (!xA) {
      G1("");
      return
    }
    let s0 = setTimeout(() => {
      G1(xA)
    }, 300);
    return () => clearTimeout(s0)
  }, [xA]);
  let [J1, SA] = mQ.default.useState(null), [A1, n1] = mQ.default.useState(!1);
  mQ.default.useEffect(() => {
    Tu().then((s0) => _(s0)), Jk(AA).then((s0) => {
      f(s0.length > 1)
    })
  }, [AA]);
  let S1 = mQ.default.useMemo(() => new Map(A.map((s0) => [s0, hV7(s0)])), [A]),
    L0 = mQ.default.useMemo(() => {
      return null
    }, [A, S1, !1]),
    VQ = mQ.default.useMemo(() => uV7(A), [A]),
    t0 = VQ.length > 0,
    QQ = mQ.default.useMemo(() => t0 ? ["All", ...VQ] : [], [t0, VQ]);
  mQ.default.useEffect(() => {
    if (QQ.length > 0 && _A >= QQ.length) s(0)
  }, [QQ.length, _A]);
  let y1 = QQ[_A],
    qQ = y1 === "All" ? void 0 : y1,
    K1 = t0 ? 1 : 0,
    $1 = mQ.default.useMemo(() => {
      let s0 = A;
      if (H) s0 = A.filter((u1) => {
        let IQ = q0(),
          tB = xX(u1);
        if (IQ && tB === IQ) return !0;
        if (hj0(u1.messages)) return !0;
        if (u1.messages.length === 0 && u1.firstPrompt !== "No prompt") return !0;
        return !1
      });
      if (qQ !== void 0) s0 = s0.filter((u1) => u1.tag === qQ);
      if (j && M) s0 = s0.filter((u1) => u1.gitBranch === M);
      if (u && !b) s0 = s0.filter((u1) => u1.projectPath === AA);
      return s0
    }, [A, H, qQ, j, M, u, b, AA]),
    i1 = mQ.default.useMemo(() => {
      if (!n) return $1;
      let s0 = n.toLowerCase();
      return $1.filter((u1) => {
        let IQ = hl(u1).toLowerCase(),
          tB = (u1.gitBranch || "").toLowerCase(),
          U9 = (u1.tag || "").toLowerCase();
        return IQ.includes(s0) || tB.includes(s0) || U9.includes(s0)
      })
    }, [$1, n]);
  mQ.default.useEffect(() => {}, [xA, mA, !1]), mQ.default.useEffect(() => {
    SA(null), n1(!1);
    return
  }, [mA, L0, !1]);
  let {
    filteredLogs: Q0,
    snippets: c0
  } = mQ.default.useMemo(() => {
    let s0 = new Map,
      u1 = i1;
    if (J1 && mA && J1.query === mA) {
      for (let U9 of J1.results)
        if (U9.searchableText) {
          let V4 = bV7(U9.searchableText, mA, kV7);
          if (V4) s0.set(U9.log, V4)
        } let IQ = new Set(u1.map((U9) => U9.messages[0]?.uuid)),
        tB = J1.results.map((U9) => U9.log).filter((U9) => !IQ.has(U9.messages[0]?.uuid));
      u1 = [...u1, ...tB]
    }
    return {
      filteredLogs: u1,
      snippets: s0
    }
  }, [i1, J1, mA]), b0 = mQ.default.useMemo(() => {
    if (t.status === "results" && t.results.length > 0) return t.results;
    return Q0
  }, [t, Q0]), UA = Math.max(30, K - 4), RA = mQ.default.useMemo(() => {
    if (!H) return [];
    let s0 = gV7(b0);
    return Array.from(s0.entries()).map(([u1, IQ]) => {
      let tB = IQ[0],
        U9 = b0.indexOf(tB),
        V4 = c0.get(tB),
        j6 = V4 ? kj0(V4, O) : null;
      if (IQ.length === 1) {
        let Q8 = fj0(tB, {
          showProjectPath: X
        });
        return {
          id: `log:${u1}:0`,
          value: {
            log: tB,
            indexInFiltered: U9
          },
          label: bj0(tB, UA),
          description: j6 ? `${Q8}
  ${j6}` : Q8,
          dimDescription: !0
        }
      }
      let z8 = IQ.length - 1,
        T6 = IQ.slice(1).map((Q8, $G) => {
          let t7 = b0.indexOf(Q8),
            PQ = c0.get(Q8),
            z2 = PQ ? kj0(PQ, O) : null,
            w4 = fj0(Q8, {
              isChild: !0,
              showProjectPath: X
            });
          return {
            id: `log:${u1}:${$G+1}`,
            value: {
              log: Q8,
              indexInFiltered: t7
            },
            label: bj0(Q8, UA, {
              isChild: !0
            }),
            description: z2 ? `${w4}
      ${z2}` : w4,
            dimDescription: !0
          }
        }),
        i8 = fj0(tB, {
          showProjectPath: X
        });
      return {
        id: `group:${u1}`,
        value: {
          log: tB,
          indexInFiltered: U9
        },
        label: bj0(tB, UA, {
          isGroupHeader: !0,
          forkCount: z8
        }),
        description: j6 ? `${i8}
  ${j6}` : i8,
        dimDescription: !0,
        children: T6
      }
    })
  }, [H, b0, UA, X, c0, O]), D1 = mQ.default.useMemo(() => {
    if (H) return [];
    return b0.map((s0, u1) => {
      let tB = hl(s0) + (s0.isSidechain ? " (sidechain)" : ""),
        U9 = A59(tB, UA),
        V4 = qOA(s0),
        j6 = X && s0.projectPath ? ` · ${s0.projectPath}` : "",
        z8 = c0.get(s0),
        T6 = z8 ? kj0(z8, O) : null;
      return {
        label: U9,
        description: T6 ? `${V4}${j6}
  ${T6}` : V4 + j6,
        dimDescription: !0,
        value: u1.toString()
      }
    })
  }, [H, b0, O, UA, X, c0]), U1 = jA?.value.log ?? null, V1 = () => {
    if (!H || !U1) return "";
    let s0 = xX(U1);
    if (!s0) return "";
    let u1 = b0.filter((V4) => xX(V4) === s0);
    if (!(u1.length > 1)) return "";
    let tB = TA.has(s0);
    if (u1.indexOf(U1) > 0) return " · ← to collapse";
    return tB ? " · ← to collapse" : " · → to expand"
  }, H1 = mQ.default.useCallback(async () => {
    let s0 = U1 ? xX(U1) : void 0;
    if (!U1 || !s0) {
      HA("list"), GA("");
      return
    }
    if (p.trim()) {
      if (await Vz1(s0, p.trim(), U1.fullPath), H && Y) Y()
    }
    HA("list"), GA("")
  }, [U1, p, Y, H]), Y0 = mQ.default.useCallback(() => {
    HA("list"), l("tengu_session_search_toggled", {
      enabled: !1
    })
  }, []), c1 = mQ.default.useCallback(() => {
    HA("search"), l("tengu_session_search_toggled", {
      enabled: !0
    })
  }, []), p0 = mQ.default.useCallback(async () => {
    n.trim();
    return
  }, [n, D, !1, A]);
  mQ.default.useEffect(() => {
    if (t.status !== "idle" && t.status !== "searching") {
      if (t.status === "results" && t.query !== n || t.status === "error") BA({
        status: "idle"
      })
    }
  }, [n, t]), mQ.default.useEffect(() => {
    return () => {
      FA.current?.abort()
    }
  }, []);
  let HQ = mQ.default.useRef(t.status);
  mQ.default.useEffect(() => {
    let s0 = HQ.current;
    if (HQ.current = t.status, s0 === "searching" && t.status === "results") {
      if (H && RA.length > 0) OA(RA[0]);
      else if (!H && b0.length > 0) {
        let u1 = b0[0];
        OA({
          id: "0",
          value: {
            log: u1,
            indexInFiltered: 0
          },
          label: ""
        })
      }
    }
  }, [t.status, H, RA, b0]);
  let nB = mQ.default.useCallback((s0) => {
      let u1 = parseInt(s0, 10),
        IQ = b0[u1];
      if (!IQ || wA.current === u1.toString()) return;
      wA.current = u1.toString(), OA({
        id: u1.toString(),
        value: {
          log: IQ,
          indexInFiltered: u1
        },
        label: ""
      })
    }, [b0]),
    AB = mQ.default.useCallback((s0) => {
      OA(s0)
    }, []);
  if (J0((s0, u1) => {
      if (IA === "preview") return;
      if (t.status === "searching" && u1.escape) {
        FA.current?.abort(), BA({
          status: "idle"
        }), l("tengu_agentic_search_cancelled", {});
        return
      }
      if (IA === "rename") {
        if (u1.escape) HA("list"), GA("")
      } else if (IA === "search") {
        if (u1.escape)
          if (n.length > 0) y("");
          else Y0();
        else if (u1.return || u1.downArrow) Y0(), n.trim();
        else if (u1.backspace || u1.delete)
          if (n.length === 0) Y0();
          else y((IQ) => IQ.slice(0, -1));
        else if (s0 && !u1.ctrl && !u1.meta) y((IQ) => IQ + s0)
      } else {
        if (DA) {
          if (u1.return) {
            p0(), CA(!1);
            return
          } else if (u1.downArrow) {
            CA(!1);
            return
          } else if (u1.upArrow) {
            HA("search"), CA(!1);
            return
          } else if (u1.escape) {
            y(""), CA(!1), G?.();
            return
          }
        }
        if (t0 && u1.tab) {
          let U9 = u1.shift ? -1 : 1;
          s((V4) => {
            let j6 = (V4 + QQ.length + U9) % QQ.length,
              z8 = QQ[j6];
            return l("tengu_session_tag_filter_changed", {
              is_all: z8 === "All",
              tag_count: VQ.length
            }), j6
          });
          return
        }
        let IQ = !u1.ctrl && !u1.meta,
          tB = s0.toLowerCase();
        if (tB === "a" && IQ && I) I(), l("tengu_session_all_projects_toggled", {
          enabled: !X
        });
        else if (tB === "b" && IQ) {
          let U9 = !j;
          x(U9), l("tengu_session_branch_filter_toggled", {
            enabled: U9
          })
        } else if (tB === "w" && IQ && u) {
          let U9 = !b;
          S(U9), l("tengu_session_worktree_filter_toggled", {
            enabled: U9
          })
        } else if (tB === "/" && IQ) HA("search"), l("tengu_session_search_toggled", {
          enabled: !0
        });
        else if (tB === "r" && IQ && U1 && H) HA("rename"), GA(""), l("tengu_session_rename_started", {});
        else if (tB === "p" && IQ && U1 && H) zA(U1), HA("preview"), l("tengu_session_preview_opened", {
          messageCount: U1.messageCount
        });
        else if (U1 && IQ && s0.length > 0 && !/^\s+$/.test(s0)) HA("search"), y(s0), l("tengu_session_search_toggled", {
          enabled: !0
        })
      }
    }, {
      isActive: !0
    }), A.length === 0) return null;
  if (IA === "preview" && ZA && H) return mQ.default.createElement(c89, {
    log: ZA,
    onExit: () => {
      HA("list"), zA(null)
    },
    onSelect: Z
  });
  let RB = [];
  if (j && M) RB.push(M);
  if (u && !b) RB.push("current worktree");
  let c2 = 8 + (RB.length > 0 && IA !== "search" ? 1 : 0) + K1,
    F9 = 2,
    m3 = Math.max(1, Math.floor((Q - c2 - F9) / 3));
  return mQ.default.createElement(T, {
    flexDirection: "column",
    height: Q - 1
  }, mQ.default.createElement(T, {
    flexShrink: 0
  }, mQ.default.createElement(C, {
    color: "suggestion"
  }, "─".repeat(K))), mQ.default.createElement(T, {
    flexShrink: 0
  }, mQ.default.createElement(C, null, " ")), t0 ? mQ.default.createElement(r89, {
    tabs: QQ,
    selectedIndex: _A,
    availableWidth: K,
    showAllProjects: X
  }) : mQ.default.createElement(T, {
    flexShrink: 0
  }, mQ.default.createElement(C, {
    bold: !0,
    color: "suggestion"
  }, "Resume Session")), mQ.default.createElement(Ap, {
    query: n,
    isFocused: IA === "search",
    isTerminalFocused: F
  }), RB.length > 0 && IA !== "search" && mQ.default.createElement(T, {
    flexShrink: 0,
    paddingLeft: 2
  }, mQ.default.createElement(C, {
    dimColor: !0
  }, mQ.default.createElement(vQ, null, RB))), mQ.default.createElement(T, {
    flexShrink: 0
  }, mQ.default.createElement(C, null, " ")), t.status === "searching" && mQ.default.createElement(T, {
    paddingLeft: 1,
    flexShrink: 0
  }, mQ.default.createElement(W9, null), mQ.default.createElement(C, null, " Searching…")), t.status === "results" && t.results.length > 0 && mQ.default.createElement(T, {
    paddingLeft: 1,
    marginBottom: 1,
    flexShrink: 0
  }, mQ.default.createElement(C, {
    dimColor: !0,
    italic: !0
  }, "Claude found these results:")), t.status === "results" && t.results.length === 0 && Q0.length === 0 && mQ.default.createElement(T, {
    paddingLeft: 1,
    marginBottom: 1,
    flexShrink: 0
  }, mQ.default.createElement(C, {
    dimColor: !0,
    italic: !0
  }, "No matching sessions found.")), t.status === "error" && Q0.length === 0 && mQ.default.createElement(T, {
    paddingLeft: 1,
    marginBottom: 1,
    flexShrink: 0
  }, mQ.default.createElement(C, {
    dimColor: !0,
    italic: !0
  }, "No matching sessions found.")), Boolean(n.trim()) && D && !1, t.status === "searching" ? null : IA === "rename" && U1 ? mQ.default.createElement(T, {
    paddingLeft: 2,
    flexDirection: "column"
  }, mQ.default.createElement(C, {
    bold: !0
  }, "Rename session:"), mQ.default.createElement(T, {
    paddingTop: 1
  }, mQ.default.createElement(p4, {
    value: p,
    onChange: GA,
    onSubmit: H1,
    placeholder: hl(U1, "Enter new session name"),
    columns: K,
    cursorOffset: WA,
    onChangeCursorOffset: MA,
    showCursor: !0
  }))) : H ? mQ.default.createElement(h39, {
    nodes: RA,
    onSelect: (s0) => {
      Z(s0.value.log)
    },
    onFocus: AB,
    onCancel: G,
    focusNodeId: jA?.id,
    visibleOptionCount: m3,
    layout: "expanded",
    isDisabled: IA === "search" || DA,
    hideIndexes: !1,
    isNodeExpanded: (s0) => {
      if (IA === "search" || j) return !0;
      let u1 = typeof s0 === "string" && s0.startsWith("group:") ? s0.substring(6) : null;
      return u1 ? TA.has(u1) : !1
    },
    onExpand: (s0) => {
      let u1 = typeof s0 === "string" && s0.startsWith("group:") ? s0.substring(6) : null;
      if (u1) bA((IQ) => new Set([...IQ, u1])), l("tengu_session_group_expanded", {})
    },
    onCollapse: (s0) => {
      let u1 = typeof s0 === "string" && s0.startsWith("group:") ? s0.substring(6) : null;
      if (u1) bA((IQ) => {
        let tB = new Set(IQ);
        return tB.delete(u1), tB
      })
    },
    onUpFromFirstItem: c1
  }) : mQ.default.createElement(k0, {
    options: D1,
    onChange: (s0) => {
      let u1 = parseInt(s0, 10),
        IQ = b0[u1];
      if (IQ) Z(IQ)
    },
    visibleOptionCount: m3,
    onCancel: G,
    onFocus: nB,
    defaultFocusValue: jA?.id.toString(),
    layout: "expanded",
    isDisabled: IA === "search" || DA,
    onUpFromFirstItem: c1
  }), mQ.default.createElement(T, {
    paddingLeft: 2
  }, V.pending ? mQ.default.createElement(C, {
    dimColor: !0
  }, "Press ", V.keyName, " again to exit") : IA === "rename" ? mQ.default.createElement(C, {
    dimColor: !0
  }, mQ.default.createElement(vQ, null, mQ.default.createElement(F0, {
    shortcut: "Enter",
    action: "save"
  }), mQ.default.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "cancel"
  }))) : t.status === "searching" ? mQ.default.createElement(C, {
    dimColor: !0
  }, mQ.default.createElement(vQ, null, mQ.default.createElement(C, null, "Searching with Claude…"), mQ.default.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "cancel"
  }))) : DA ? mQ.default.createElement(C, {
    dimColor: !0
  }, mQ.default.createElement(vQ, null, mQ.default.createElement(F0, {
    shortcut: "Enter",
    action: "search"
  }), mQ.default.createElement(F0, {
    shortcut: "↓",
    action: "skip"
  }), mQ.default.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "cancel"
  }))) : IA === "search" ? mQ.default.createElement(C, {
    dimColor: !0
  }, mQ.default.createElement(vQ, null, mQ.default.createElement(C, null, "Type to Search"), mQ.default.createElement(F0, {
    shortcut: "Enter",
    action: "select"
  }), mQ.default.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "clear"
  }))) : mQ.default.createElement(C, {
    dimColor: !0
  }, mQ.default.createElement(vQ, null, I && mQ.default.createElement(F0, {
    shortcut: "A",
    action: `show ${X?"current dir":"all projects"}`
  }), M && mQ.default.createElement(F0, {
    shortcut: "B",
    action: "toggle branch"
  }), u && mQ.default.createElement(F0, {
    shortcut: "W",
    action: `show ${b?"current worktree":"all worktrees"}`
  }), H && mQ.default.createElement(F0, {
    shortcut: "P",
    action: "preview"
  }), H && mQ.default.createElement(F0, {
    shortcut: "R",
    action: "rename"
  }), mQ.default.createElement(C, null, "Type to search"), mQ.default.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "cancel"
  }), V1() && mQ.default.createElement(C, null, V1())))))
}
// @from(Ln 423102, Col 0)
function fV7(A) {
  if (A.type !== "user" && A.type !== "assistant") return "";
  let Q = "message" in A ? A.message?.content : void 0;
  if (!Q) return "";
  if (typeof Q === "string") return Q;
  if (Array.isArray(Q)) return Q.map((B) => {
    if (typeof B === "string") return B;
    if ("text" in B && typeof B.text === "string") return B.text;
    return ""
  }).filter(Boolean).join(" ");
  return ""
}
// @from(Ln 423115, Col 0)
function hV7(A) {
  let B = (A.messages.length <= xV7 ? A.messages : [...A.messages.slice(0, t89), ...A.messages.slice(-t89)]).map(fV7).filter(Boolean).join(" "),
    Z = `${[A.customTitle,A.summary,A.firstPrompt,A.gitBranch,A.tag].filter(Boolean).join(" ")} ${B}`.trim();
  return Z.length > e89 ? Z.slice(0, e89) : Z
}
// @from(Ln 423121, Col 0)
function gV7(A) {
  let Q = new Map;
  for (let B of A) {
    let G = xX(B);
    if (G) {
      let Z = Q.get(G);
      if (Z) Z.push(B);
      else Q.set(G, [B])
    }
  }
  return Q.forEach((B) => B.sort((G, Z) => new Date(Z.modified).getTime() - new Date(G.modified).getTime())), Q
}
// @from(Ln 423134, Col 0)
function uV7(A) {
  let Q = new Set;
  for (let B of A)
    if (B.tag) Q.add(B.tag);
  return Array.from(Q).sort((B, G) => B.localeCompare(G))
}
// @from(Ln 423140, Col 4)
mQ
// @from(Ln 423140, Col 8)
PV7 = 2
// @from(Ln 423141, Col 2)
SV7 = 4
// @from(Ln 423142, Col 2)
xV7 = 2000
// @from(Ln 423143, Col 2)
t89 = 1000
// @from(Ln 423144, Col 2)
e89 = 50000
// @from(Ln 423145, Col 2)
yV7 = 0.3
// @from(Ln 423146, Col 2)
vV7 = 60000
// @from(Ln 423147, Col 2)
kV7 = 50
// @from(Ln 423148, Col 4)
jz1 = w(() => {
  rhA();
  Z3();
  fA();
  mBA();
  dBA();
  yG();
  P4();
  d4();
  W8();
  g39();
  E9();
  ZI();
  C0();
  IY();
  d4();
  C0();
  Z0();
  p89();
  v1();
  K6();
  e9();
  I3();
  s89();
  CzA();
  mQ = c(QA(), 1)
})
// @from(Ln 423176, Col 0)
function Tz1(A, Q, B) {
  let G = EQ();
  if (!Q || !A.projectPath || A.projectPath === G) return {
    isCrossProject: !1
  };
  {
    let X = xX(A);
    return {
      isCrossProject: !0,
      isSameRepoWorktree: !1,
      command: `cd ${m6([A.projectPath])} && claude --resume ${X}`,
      projectPath: A.projectPath
    }
  }
  if (B.some((X) => A.projectPath === X || A.projectPath.startsWith(X + "/"))) return {
    isCrossProject: !0,
    isSameRepoWorktree: !0,
    projectPath: A.projectPath
  };
  let Y = xX(A);
  return {
    isCrossProject: !0,
    isSameRepoWorktree: !1,
    command: `cd ${m6([A.projectPath])} && claude --resume ${Y}`,
    projectPath: A.projectPath
  }
}
// @from(Ln 423203, Col 4)
gj0 = w(() => {
  C0();
  d4();
  pV()
})
// @from(Ln 423209, Col 0)
function dV7(A) {
  if (A.type !== "user" && A.type !== "assistant") return "";
  let Q = "message" in A ? A.message?.content : void 0;
  if (!Q) return "";
  if (typeof Q === "string") return Q;
  if (Array.isArray(Q)) return Q.map((B) => {
    if (typeof B === "string") return B;
    if ("text" in B && typeof B.text === "string") return B.text;
    return ""
  }).filter(Boolean).join(" ");
  return ""
}
// @from(Ln 423222, Col 0)
function G59(A) {
  if (A.length === 0) return "";
  let B = (A.length <= uj0 ? A : [...A.slice(0, uj0 / 2), ...A.slice(-uj0 / 2)]).map(dV7).filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  return B.length > Q59 ? B.slice(0, Q59) + "…" : B
}
// @from(Ln 423228, Col 0)
function B59(A, Q) {
  if (hl(A).toLowerCase().includes(Q)) return !0;
  if (A.customTitle?.toLowerCase().includes(Q)) return !0;
  if (A.tag?.toLowerCase().includes(Q)) return !0;
  if (A.gitBranch?.toLowerCase().includes(Q)) return !0;
  if (A.summary?.toLowerCase().includes(Q)) return !0;
  if (A.firstPrompt?.toLowerCase().includes(Q)) return !0;
  if (A.messages && A.messages.length > 0) {
    if (G59(A.messages).toLowerCase().includes(Q)) return !0
  }
  return !1
}
// @from(Ln 423240, Col 0)
async function tgA(A, Q, B) {
  if (!A.trim() || Q.length === 0) return [];
  let G = A.toLowerCase(),
    Z = Q.filter((W) => B59(W, G)),
    Y;
  if (Z.length >= mj0) Y = Z.slice(0, mj0);
  else {
    let W = Q.filter((V) => !B59(V, G)),
      K = mj0 - Z.length;
    Y = [...Z, ...W.slice(0, K)]
  }
  k(`Agentic search: ${Y.length}/${Q.length} logs, query="${A}", matching: ${Z.length}, with messages: ${Y.filter((W)=>W.messages?.length>0).length}`);
  let J = Y.map(async (W) => {
      if (Gj(W)) try {
        return await Vx(W)
      } catch (K) {
        return e(K), W
      }
      return W
    }),
    X = await Promise.all(J);
  k(`Agentic search: loaded ${X.filter((W)=>W.messages?.length>0).length}/${Y.length} logs with transcripts`);
  let D = `Sessions:
${X.map((W,K)=>{let V=[`${K}:`],F=hl(W);if(V.push(F),W.customTitle&&W.customTitle!==F)V.push(`[custom title: ${W.customTitle}]`);if(W.tag)V.push(`[tag: ${W.tag}]`);if(W.gitBranch)V.push(`[branch: ${W.gitBranch}]`);if(W.summary)V.push(`- Summary: ${W.summary}`);if(W.firstPrompt&&W.firstPrompt!=="No prompt")V.push(`- First message: ${W.firstPrompt.slice(0,300)}`);if(W.messages&&W.messages.length>0){let H=G59(W.messages);if(H)V.push(`- Transcript: ${H}`)}return V.join(" ")}).join(`
  `)}

Search query: "${A}"

Find the sessions that are most relevant to this query.`;
  k(`Agentic search prompt (first 500 chars): ${D.slice(0,500)}...`);
  try {
    let W = SD();
    k(`Agentic search using model: ${W}`);
    let V = (await sHA({
      model: W,
      system: mV7,
      messages: [{
        role: "user",
        content: D
      }],
      signal: B
    })).content.find(($) => $.type === "text");
    if (!V || V.type !== "text") return k("No text content in agentic search response"), [];
    k(`Agentic search response: ${V.text}`);
    let F = V.text.match(/\{[\s\S]*\}/);
    if (!F) return k("Could not find JSON in agentic search response"), [];
    let z = (AQ(F[0]).relevant_indices || []).filter(($) => $ >= 0 && $ < X.length).map(($) => X[$]);
    return k(`Agentic search found ${z.length} relevant sessions`), z
  } catch (W) {
    return e(W), k(`Agentic search error: ${W}`), []
  }
}
// @from(Ln 423292, Col 4)
Q59 = 2000
// @from(Ln 423293, Col 2)
uj0 = 100
// @from(Ln 423294, Col 2)
mj0 = 100
// @from(Ln 423295, Col 2)
mV7 = `Your goal is to find relevant sessions based on a user's search query.

You will be given a list of sessions with their metadata and a search query. Identify which sessions are most relevant to the query.

Each session may include:
- Title (display name or custom title)
- Tag (user-assigned category, shown as [tag: name] - users tag sessions with /tag command to categorize them)
- Branch (git branch name, shown as [branch: name])
- Summary (AI-generated summary)
- First message (beginning of the conversation)
- Transcript (excerpt of conversation content)

IMPORTANT: Tags are user-assigned labels that indicate the session's topic or category. If the query matches a tag exactly or partially, those sessions should be highly prioritized.

For each session, consider (in order of priority):
1. Exact tag matches (highest priority - user explicitly categorized this session)
2. Partial tag matches or tag-related terms
3. Title matches (custom titles or first message content)
4. Branch name matches
5. Summary and transcript content matches
6. Semantic similarity and related concepts

CRITICAL: Be VERY inclusive in your matching. Include sessions that:
- Contain the query term anywhere in any field
- Are semantically related to the query (e.g., "testing" matches sessions about "tests", "unit tests", "QA", etc.)
- Discuss topics that could be related to the query
- Have transcripts that mention the concept even in passing

When in doubt, INCLUDE the session. It's better to return too many results than too few. The user can easily scan through results, but missing relevant sessions is frustrating.

Return sessions ordered by relevance (most relevant first). If truly no sessions have ANY connection to the query, return an empty array - but this should be rare.

Respond with ONLY the JSON object, no markdown formatting:
{"relevant_indices": [2, 5, 0]}`
// @from(Ln 423329, Col 4)
Pz1 = w(() => {
  v1();
  l2();
  T1();
  FK1();
  d4();
  A0()
})
// @from(Ln 423338, Col 0)
function Z59(A) {
  switch (A.resultType) {
    case "sessionNotFound":
      return `Session ${I1.bold(A.arg)} was not found.`;
    case "multipleMatches":
      return `Found ${A.count} sessions matching ${I1.bold(A.arg)}. Please use /resume to pick a specific session.`
  }
}
// @from(Ln 423347, Col 0)
function dj0({
  message: A,
  args: Q,
  onDone: B
}) {
  return R3.useEffect(() => {
    let G = setTimeout(B, 0);
    return () => clearTimeout(G)
  }, [B]), R3.createElement(T, {
    flexDirection: "column"
  }, R3.createElement(C, {
    dimColor: !0
  }, tA.pointer, " /resume ", Q), R3.createElement(x0, null, R3.createElement(C, null, A)))
}
// @from(Ln 423362, Col 0)
function cV7({
  onDone: A,
  onResume: Q
}) {
  let [B, G] = R3.useState([]), [Z, Y] = R3.useState([]), [J, X] = R3.useState(!0), [I, D] = R3.useState(!1), [W, K] = R3.useState(!1), {
    rows: V
  } = ZB(), F = R3.useCallback(async (O, L) => {
    X(!0);
    try {
      let M = O ? await egA() : await Le(L);
      if (M.length === 0) {
        A("No conversations found to resume");
        return
      }
      G(M)
    } catch (M) {
      A("Failed to load conversations")
    } finally {
      X(!1)
    }
  }, [A]);
  R3.useEffect(() => {
    async function O() {
      let L = await Jk(EQ());
      Y(L), F(!1, L)
    }
    O()
  }, [F]);
  let H = R3.useCallback(() => {
    let O = !W;
    K(O), F(O, Z)
  }, [W, F, Z]);
  async function E(O) {
    let L = BU(xX(O));
    if (!L) {
      A("Failed to resume conversation");
      return
    }
    let M = Gj(O) ? await Vx(O) : O,
      _ = Tz1(M, W, Z);
    if (_.isCrossProject) {
      if (_.isSameRepoWorktree) {
        D(!0), Q(L, M, "slash_command_picker");
        return
      }
      await Gp(_.command);
      let j = ["", "This conversation is from a different directory.", "", "To resume, run:", `  ${_.command}`, "", "(Command copied to clipboard)", ""].join(`
`);
      A(j, {
        display: "user"
      });
      return
    }
    D(!0), Q(L, M, "slash_command_picker")
  }

  function z() {
    A("Resume cancelled", {
      display: "system"
    })
  }
  let $ = B.filter((O) => !O.isSidechain);
  if (J) return R3.createElement(T, null, R3.createElement(W9, null), R3.createElement(C, null, " Loading conversations…"));
  if (I) return R3.createElement(T, null, R3.createElement(W9, null), R3.createElement(C, null, " Resuming conversation…"));
  return R3.createElement(sgA, {
    logs: $,
    maxHeight: V - 2,
    onCancel: z,
    onSelect: E,
    onLogsChanged: () => F(W, Z),
    showAllProjects: W,
    onToggleAllProjects: H,
    onAgenticSearch: tgA
  })
}
// @from(Ln 423437, Col 4)
R3
// @from(Ln 423437, Col 8)
pV7
// @from(Ln 423437, Col 13)
Y59
// @from(Ln 423438, Col 4)
J59 = w(() => {
  B2();
  Z3();
  fA();
  yG();
  jz1();
  c4();
  d4();
  d_();
  P4();
  OzA();
  gj0();
  JZ();
  ZI();
  C0();
  Pz1();
  R3 = c(QA(), 1);
  pV7 = {
    type: "local-jsx",
    name: "resume",
    description: "Resume a conversation",
    get argumentHint() {
      return zp() ? "[session-id or title]" : "[session-id]"
    },
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, Q, B) {
      T9("resume");
      let G = async (D, W, K) => {
        await Q.resume?.(D, W, K), A(void 0, {
          display: "skip"
        })
      }, Z = B?.trim();
      if (!Z) return R3.createElement(cV7, {
        key: Date.now(),
        onDone: A,
        onResume: G
      });
      let Y = await Jk(EQ()),
        J = await Le(Y);
      if (J.length === 0) return R3.createElement(dj0, {
        message: "No conversations found to resume.",
        args: Z,
        onDone: () => A("No conversations found to resume.")
      });
      let X = BU(Z);
      if (X) {
        let D = J.filter((W) => xX(W) === X).sort((W, K) => K.modified.getTime() - W.modified.getTime());
        if (D.length > 0) {
          let W = D[0],
            K = Gj(W) ? await Vx(W) : W;
          return G(X, K, "slash_command_session_id"), null
        }
      }
      if (zp()) {
        let D = await Q$A(Z, {
          exact: !0
        });
        if (D.length === 1) {
          let W = D[0],
            K = xX(W);
          if (K) {
            let V = Gj(W) ? await Vx(W) : W;
            return G(K, V, "slash_command_title"), null
          }
        }
        if (D.length > 1) {
          let W = Z59({
            resultType: "multipleMatches",
            arg: Z,
            count: D.length
          });
          return R3.createElement(dj0, {
            message: W,
            args: Z,
            onDone: () => A(W)
          })
        }
      }
      let I = Z59({
        resultType: "sessionNotFound",
        arg: Z
      });
      return R3.createElement(dj0, {
        message: I,
        args: Z,
        onDone: () => A(I)
      })
    },
    userFacingName() {
      return "resume"
    }
  }, Y59 = pV7
})
// @from(Ln 423532, Col 4)
Sz1
// @from(Ln 423533, Col 4)
cj0 = w(() => {
  YK();
  JZ();
  Sz1 = tzA({
    name: "review",
    description: "Review a pull request",
    progressMessage: "reviewing pull request",
    pluginName: "code-review",
    pluginCommand: "code-review",
    async getPromptWhileMarketplaceIsPrivate(A) {
      return T9("review"), [{
        type: "text",
        text: `
      You are an expert code reviewer. Follow these steps:

      1. If no PR number is provided in the args, use ${o2.name}("gh pr list") to show open PRs
      2. If a PR number is provided, use ${o2.name}("gh pr view <number>") to get PR details
      3. Use ${o2.name}("gh pr diff <number>") to get the diff
      4. Analyze the changes and provide a thorough code review that includes:
         - Overview of what the PR does
         - Analysis of code quality and style
         - Specific suggestions for improvements
         - Any potential issues or risks

      Keep your review concise but thorough. Focus on:
      - Code correctness
      - Following project conventions
      - Performance implications
      - Test coverage
      - Security considerations

      Format your review with clear sections and bullet points.

      PR number: ${A}
    `
      }]
    }
  })
})
// @from(Ln 423572, Col 4)
X59 = () => {}
// @from(Ln 423574, Col 0)
function lV7(A) {
  if (A === "plugin") return "Plugin skills";
  return `${J1A(Wa(A))} skills`
}
// @from(Ln 423579, Col 0)
function I59({
  onExit: A,
  commands: Q
}) {
  let B = pj0.useMemo(() => {
      return Q.filter((X) => X.type === "prompt" && (X.loadedFrom === "skills" || X.loadedFrom === "commands_DEPRECATED" || X.loadedFrom === "plugin"))
    }, [Q]),
    G = pj0.useMemo(() => {
      let X = {
        policySettings: [],
        userSettings: [],
        projectSettings: [],
        localSettings: [],
        flagSettings: [],
        plugin: []
      };
      for (let I of B) {
        let D = I.source;
        if (D in X) X[D].push(I)
      }
      for (let I of Object.values(X)) I.sort((D, W) => DzA(W) - DzA(D));
      return X
    }, [B]),
    Z = () => {
      A("Skills dialog dismissed", {
        display: "system"
      })
    };
  if (B.length === 0) return FG.createElement(o9, {
    title: "Skills",
    subtitle: "No skills found",
    onCancel: Z,
    hideInputGuide: !0
  }, FG.createElement(C, {
    dimColor: !0
  }, "Create skills in .claude/skills/ or ~/.claude/skills/"), FG.createElement(C, {
    dimColor: !0,
    italic: !0
  }, FG.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "close"
  })));
  let Y = (X) => {
      let I = DzA(X),
        D = seB(I);
      return FG.createElement(T, {
        key: `${X.name}-${X.source}`
      }, FG.createElement(C, null, X.userFacingName()), FG.createElement(C, {
        dimColor: !0
      }, " · ", D, " tokens"))
    },
    J = (X) => {
      let I = G[X];
      if (I.length === 0) return null;
      let D = lV7(X),
        W = k6(IzA(X, "skills")),
        K = k6(IzA(X, "commands")),
        V = I.some((F) => F.loadedFrom === "commands_DEPRECATED");
      return FG.createElement(T, {
        flexDirection: "column",
        key: X
      }, FG.createElement(T, null, FG.createElement(C, {
        bold: !0,
        dimColor: !0
      }, D), W && FG.createElement(C, {
        dimColor: !0
      }, " ", "(", W, V && K ? `, ${K}` : "", ")")), I.map((F) => Y(F)))
    };
  return FG.createElement(o9, {
    title: "Skills",
    subtitle: `${B.length} skill${B.length===1?"":"s"}`,
    onCancel: Z,
    hideInputGuide: !0
  }, FG.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, J("projectSettings"), J("userSettings"), J("policySettings"), J("plugin")), FG.createElement(C, {
    dimColor: !0,
    italic: !0
  }, FG.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "close"
  })))
}
// @from(Ln 423667, Col 4)
FG
// @from(Ln 423667, Col 8)
pj0
// @from(Ln 423668, Col 4)
D59 = w(() => {
  fA();
  LpA();
  rY();
  I3();
  YI();
  uC();
  y9();
  RhA();
  FG = c(QA(), 1), pj0 = c(QA(), 1)
})
// @from(Ln 423679, Col 4)
lj0
// @from(Ln 423679, Col 9)
iV7
// @from(Ln 423679, Col 14)
W59
// @from(Ln 423680, Col 4)
K59 = w(() => {
  D59();
  lj0 = c(QA(), 1), iV7 = {
    type: "local-jsx",
    name: "skills",
    description: "List available skills",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, Q) {
      return lj0.createElement(I59, {
        onExit: A,
        commands: Q.options.commands
      })
    },
    userFacingName() {
      return "skills"
    }
  }, W59 = iV7
})
// @from(Ln 423699, Col 4)
ij0
// @from(Ln 423699, Col 9)
nV7
// @from(Ln 423699, Col 14)
V59
// @from(Ln 423700, Col 4)
F59 = w(() => {
  ME1();
  ij0 = c(QA(), 1), nV7 = {
    type: "local-jsx",
    name: "status",
    description: "Show Claude Code status including version, model, account, API connectivity, and tool statuses",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, Q) {
      return ij0.createElement(SzA, {
        onClose: A,
        context: Q,
        defaultTab: "Status"
      })
    },
    userFacingName() {
      return "status"
    }
  }, V59 = nV7
})
// @from(Ln 423721, Col 0)
function H59({
  shell: A,
  onDone: Q,
  onKillShell: B,
  onBack: G
}) {
  let {
    columns: Z
  } = ZB(), [Y, J] = AuA.useState(0), [X, I] = AuA.useState({
    stdout: "",
    stdoutLines: 0
  }), D = () => Q("Shell details dismissed", {
    display: "system"
  });
  iW({
    "confirm:no": D,
    "confirm:yes": D
  }, {
    context: "Confirmation"
  }), J0((F, H) => {
    if (F === " ") Q("Shell details dismissed", {
      display: "system"
    });
    else if (H.leftArrow && G) G();
    else if (F === "k" && A.status === "running" && B) B()
  });
  let W = MQ(),
    K = (F) => {
      let H = Math.floor((Date.now() - F) / 1000),
        E = Math.floor(H / 3600),
        z = Math.floor((H - E * 3600) / 60),
        $ = H - E * 3600 - z * 60;
      return `${E>0?`${E}h `:""}${z>0||E>0?`${z}m `:""}${$}s`
    };
  AuA.useEffect(() => {
    let F = K71(A.id),
      {
        totalLines: H,
        truncatedContent: E
      } = A71(F);
    if (I({
        stdout: E,
        stdoutLines: H
      }), A.status === "running") {
      let z = setTimeout(() => {
        J(($) => $ + 1)
      }, 1000);
      return () => clearTimeout(z)
    }
  }, [A.id, A.status, Y]);
  let V = A.command.length > 280 ? A.command.substring(0, 277) + "…" : A.command;
  return HG.default.createElement(T, {
    width: "100%",
    flexDirection: "column"
  }, HG.default.createElement(T, {
    width: "100%"
  }, HG.default.createElement(T, {
    borderStyle: "round",
    borderColor: "background",
    flexDirection: "column",
    marginTop: 1,
    paddingLeft: 1,
    paddingRight: 1,
    width: "100%"
  }, HG.default.createElement(T, null, HG.default.createElement(C, {
    color: "background",
    bold: !0
  }, "Shell details")), HG.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, HG.default.createElement(C, null, HG.default.createElement(C, {
    bold: !0
  }, "Status:"), " ", A.status === "running" ? HG.default.createElement(C, {
    color: "background"
  }, A.status, A.result?.code !== void 0 && ` (exit code: ${A.result.code})`) : A.status === "completed" ? HG.default.createElement(C, {
    color: "success"
  }, A.status, A.result?.code !== void 0 && ` (exit code: ${A.result.code})`) : HG.default.createElement(C, {
    color: "error"
  }, A.status, A.result?.code !== void 0 && ` (exit code: ${A.result.code})`)), HG.default.createElement(C, null, HG.default.createElement(C, {
    bold: !0
  }, "Runtime:"), " ", K(A.startTime)), HG.default.createElement(C, {
    wrap: "wrap"
  }, HG.default.createElement(C, {
    bold: !0
  }, "Command:"), " ", V)), HG.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, HG.default.createElement(C, {
    bold: !0
  }, "Output:"), X.stdout ? HG.default.createElement(HG.default.Fragment, null, HG.default.createElement(T, {
    borderStyle: "round",
    borderDimColor: !0,
    paddingX: 1,
    flexDirection: "column",
    height: 12,
    maxWidth: Z - 8
  }, X.stdout.split(`
`).slice(-10).map((F, H) => HG.default.createElement(C, {
    key: H,
    wrap: "truncate-end"
  }, F))), HG.default.createElement(C, {
    dimColor: !0,
    italic: !0
  }, X.stdoutLines > 10 ? `Showing last 10 lines of ${X.stdoutLines} total. Full output: ${k6(aY(A.id))}` : `Showing ${X.stdoutLines} lines`)) : HG.default.createElement(C, {
    dimColor: !0
  }, "No output available")))), HG.default.createElement(T, {
    marginLeft: 2
  }, W.pending ? HG.default.createElement(C, {
    dimColor: !0
  }, "Press ", W.keyName, " again to exit") : HG.default.createElement(C, {
    dimColor: !0
  }, HG.default.createElement(vQ, null, G && HG.default.createElement(F0, {
    shortcut: "←",
    action: "go back"
  }), HG.default.createElement(F0, {
    shortcut: "Esc/Enter/Space",
    action: "close"
  }), A.status === "running" && B && HG.default.createElement(F0, {
    shortcut: "k",
    action: "kill"
  })))))
}
// @from(Ln 423843, Col 4)
HG
// @from(Ln 423843, Col 8)
AuA
// @from(Ln 423844, Col 4)
E59 = w(() => {
  fA();
  c6();
  P4();
  E9();
  cC();
  y9();
  qKA();
  e9();
  K6();
  HG = c(QA(), 1), AuA = c(QA(), 1)
})
// @from(Ln 423857, Col 0)
function xz1({
  session: A
}) {
  if (A.status === "completed") return QuA.default.createElement(C, {
    bold: !0,
    color: "success",
    dimColor: !0
  }, "done");
  if (A.status === "failed") return QuA.default.createElement(C, {
    bold: !0,
    color: "error",
    dimColor: !0
  }, "error");
  if (!A.todoList.length) return QuA.default.createElement(C, {
    dimColor: !0
  }, A.status, "…");
  let Q = A.todoList.filter((G) => G.status === "completed").length,
    B = A.todoList.length;
  return QuA.default.createElement(C, {
    dimColor: !0
  }, Q, "/", B)
}
// @from(Ln 423879, Col 4)
QuA
// @from(Ln 423880, Col 4)
nj0 = w(() => {
  fA();
  QuA = c(QA(), 1)
})
// @from(Ln 423888, Col 0)
function z59(A) {
  return A.flatMap((Q) => {
    switch (Q.type) {
      case "assistant":
        return [{
          type: "assistant",
          message: Q.message,
          uuid: Q.uuid,
          requestId: void 0,
          timestamp: new Date().toISOString()
        }];
      case "user":
        return [{
          type: "user",
          message: Q.message,
          uuid: Q.uuid ?? aV7(),
          timestamp: new Date().toISOString(),
          isMeta: Q.isSynthetic
        }];
      case "system":
        if (Q.subtype === "compact_boundary") {
          let B = Q;
          return [{
            type: "system",
            content: "Conversation compacted",
            level: "info",
            subtype: "compact_boundary",
            compactMetadata: {
              trigger: B.compact_metadata.trigger,
              preTokens: B.compact_metadata.pre_tokens
            },
            uuid: Q.uuid,
            timestamp: new Date().toISOString()
          }]
        }
        return [];
      default:
        return []
    }
  })
}
// @from(Ln 423930, Col 0)
function $59(A) {
  return A.flatMap((Q) => {
    switch (Q.type) {
      case "assistant":
        return [{
          type: "assistant",
          message: oV7(Q),
          session_id: q0(),
          parent_tool_use_id: null,
          uuid: Q.uuid,
          error: Q.error
        }];
      case "user":
        return [{
          type: "user",
          message: Q.message,
          session_id: q0(),
          parent_tool_use_id: null,
          uuid: Q.uuid,
          isSynthetic: Q.isMeta || Q.isVisibleInTranscriptOnly
        }];
      case "system":
        if (Q.subtype === "compact_boundary" && Q.compactMetadata) return [{
          type: "system",
          subtype: "compact_boundary",
          session_id: q0(),
          uuid: Q.uuid,
          compact_metadata: {
            trigger: Q.compactMetadata.trigger,
            pre_tokens: Q.compactMetadata.preTokens
          }
        }];
        return [];
      case "attachment":
        if (mF1(Q.attachment)) return [{
          type: "system",
          subtype: "hook_response",
          session_id: q0(),
          uuid: Q.uuid,
          hook_name: Q.attachment.hookName,
          hook_event: Q.attachment.hookEvent,
          stdout: Q.attachment.stdout || "",
          stderr: Q.attachment.stderr || "",
          exit_code: Q.attachment.exitCode
        }];
        return [];
      default:
        return []
    }
  })
}
// @from(Ln 423982, Col 0)
function oV7(A) {
  let Q = A.message.content;
  if (!Array.isArray(Q)) return A.message;
  let B = Q.map((G) => {
    if (G.type !== "tool_use") return G;
    if (G.name === vd) {
      let Z = AK();
      if (Z) return {
        ...G,
        input: {
          ...G.input,
          plan: Z
        }
      }
    }
    return G
  });
  return {
    ...A.message,
    content: B
  }
}
// @from(Ln 424004, Col 4)
aj0 = w(() => {
  C0();
  m_();
  UF()
})