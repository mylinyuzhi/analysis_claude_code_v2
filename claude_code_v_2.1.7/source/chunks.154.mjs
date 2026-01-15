
// @from(Ln 461198, Col 0)
async function hO7(A, Q, B) {
  try {
    k(`[useLspPluginRecommendation] Installing plugin: ${A}`);
    let G = await NF(A);
    if (!G) throw Error(`Plugin ${A} not found in marketplace`);
    let Z = typeof G.entry.source === "string" ? bO7(G.marketplaceInstallLocation, G.entry.source) : void 0;
    await dO(A, G.entry, "user", void 0, Z);
    let Y = dB("userSettings");
    pB("userSettings", {
      enabledPlugins: {
        ...Y?.enabledPlugins,
        [A]: !0
      }
    }), k(`[useLspPluginRecommendation] Plugin installed: ${A}`), B({
      key: "lsp-plugin-installed",
      jsx: Lw.createElement(C, {
        color: "success"
      }, tA.tick, " ", Q, " installed · restart to apply"),
      priority: "immediate",
      timeoutMs: 5000
    })
  } catch (G) {
    e(G instanceof Error ? G : Error(String(G))), B({
      key: "lsp-plugin-install-failed",
      jsx: Lw.createElement(C, {
        color: "error"
      }, "Failed to install ", Q),
      priority: "immediate",
      timeoutMs: 5000
    })
  }
}
// @from(Ln 461230, Col 4)
Lw
// @from(Ln 461230, Col 8)
fO7 = 28000
// @from(Ln 461231, Col 4)
fU9 = w(() => {
  B2();
  fA();
  hB();
  HY();
  GQ();
  C0();
  v1();
  T1();
  kU9();
  cc();
  HI();
  GB();
  Lw = c(QA(), 1)
})
// @from(Ln 461247, Col 0)
function hU9() {}
// @from(Ln 461249, Col 0)
function gU9({
  pluginName: A,
  pluginDescription: Q,
  fileExtension: B,
  onResponse: G
}) {
  let Z = A3.useRef(G);
  Z.current = G, A3.useEffect(() => {
    let X = setTimeout(() => {
      Z.current("no")
    }, gO7);
    return () => clearTimeout(X)
  }, []);

  function Y(X) {
    switch (X) {
      case "yes":
        G("yes");
        break;
      case "no":
        G("no");
        break;
      case "never":
        G("never");
        break;
      case "disable":
        G("disable");
        break
    }
  }
  return A3.createElement(VY, {
    title: "LSP Plugin Recommendation"
  }, A3.createElement(T, {
    flexDirection: "column",
    paddingX: 2,
    paddingY: 1
  }, A3.createElement(T, {
    marginBottom: 1
  }, A3.createElement(C, {
    dimColor: !0
  }, "LSP provides code intelligence like go-to-definition and error checking")), A3.createElement(T, null, A3.createElement(C, {
    dimColor: !0
  }, "Plugin:"), A3.createElement(C, null, " ", A)), Q && A3.createElement(T, null, A3.createElement(C, {
    dimColor: !0
  }, Q)), A3.createElement(T, null, A3.createElement(C, {
    dimColor: !0
  }, "Triggered by:"), A3.createElement(C, null, " ", B, " files")), A3.createElement(T, {
    marginTop: 1
  }, A3.createElement(C, null, "Would you like to install this LSP plugin?")), A3.createElement(T, null, A3.createElement(k0, {
    options: [{
      label: A3.createElement(C, null, "Yes, install ", A3.createElement(C, {
        bold: !0
      }, A)),
      value: "yes"
    }, {
      label: "No, not now",
      value: "no"
    }, {
      label: A3.createElement(C, null, "Never for ", A3.createElement(C, {
        bold: !0
      }, A)),
      value: "never"
    }, {
      label: "Disable all LSP recommendations",
      value: "disable"
    }],
    onChange: Y,
    onCancel: () => G("no")
  }))))
}
// @from(Ln 461319, Col 4)
A3
// @from(Ln 461319, Col 8)
gO7 = 30000
// @from(Ln 461320, Col 4)
uU9 = w(() => {
  fA();
  W8();
  dN();
  A3 = c(QA(), 1)
})
// @from(Ln 461327, Col 0)
function mU9() {
  let {
    addNotification: A
  } = S4(), [Q] = a0(), {
    installationStatus: B
  } = Q.plugins, {
    totalFailed: G,
    failedMarketplacesCount: Z,
    failedPluginsCount: Y
  } = lC1.useMemo(() => {
    if (!B) return {
      totalFailed: 0,
      failedMarketplacesCount: 0,
      failedPluginsCount: 0
    };
    let J = B.marketplaces.filter((I) => I.status === "failed"),
      X = B.plugins.filter((I) => I.status === "failed");
    return {
      totalFailed: J.length + X.length,
      failedMarketplacesCount: J.length,
      failedPluginsCount: X.length
    }
  }, [B]);
  lC1.useEffect(() => {
    if (!B) {
      k("No installation status to monitor");
      return
    }
    if (G === 0) return;
    if (k(`Plugin installation status: ${Z} failed marketplaces, ${Y} failed plugins`), G === 0) return;
    k(`Adding notification for ${G} failed installations`), A({
      key: "plugin-install-failed",
      jsx: Fh.createElement(Fh.Fragment, null, Fh.createElement(C, {
        color: "error"
      }, G, " plugin", G === 1 ? "" : "s", " failed to install"), Fh.createElement(C, {
        dimColor: !0
      }, " · /plugin for details")),
      priority: "medium"
    })
  }, [A, G, Z, Y])
}
// @from(Ln 461368, Col 4)
Fh
// @from(Ln 461368, Col 8)
lC1
// @from(Ln 461369, Col 4)
dU9 = w(() => {
  fA();
  HY();
  hB();
  T1();
  Fh = c(QA(), 1), lC1 = c(QA(), 1)
})
// @from(Ln 461377, Col 0)
function cU9(A) {
  if (iC1 = A, WmA !== null && WmA.length > 0) A(WmA), WmA = null;
  return () => {
    iC1 = null
  }
}
// @from(Ln 461383, Col 0)
async function uO7() {
  let A = await D5(),
    Q = new Set;
  for (let [B, G] of Object.entries(A))
    if (oxA(B, G)) Q.add(B.toLowerCase());
  return Q
}
// @from(Ln 461390, Col 0)
async function mO7(A, Q) {
  let B = !1;
  for (let {
      scope: G
    }
    of Q) try {
    let Z = await czA(A, G);
    if (Z.success && !Z.alreadyUpToDate) B = !0, k(`Plugin autoupdate: updated ${A} from ${Z.oldVersion} to ${Z.newVersion}`);
    else if (!Z.alreadyUpToDate) k(`Plugin autoupdate: failed to update ${A}: ${Z.message}`, {
      level: "warn"
    })
  } catch (Z) {
    k(`Plugin autoupdate: error updating ${A}: ${Z instanceof Error?Z.message:String(Z)}`, {
      level: "warn"
    })
  }
  return B ? A : null
}
// @from(Ln 461408, Col 0)
async function dO7(A) {
  let Q = jr(),
    B = Object.keys(Q.plugins),
    G = EQ();
  if (B.length === 0) return [];
  return (await Promise.allSettled(B.map(async (Y) => {
    let {
      marketplace: J
    } = HVA(Y);
    if (!J || !A.has(J.toLowerCase())) return null;
    let X = Q.plugins[Y];
    if (!X || X.length === 0) return null;
    let I = X.filter((D) => D.scope === "user" || D.scope === "managed" || D.projectPath === G);
    if (I.length === 0) return null;
    return mO7(Y, I)
  }))).filter((Y) => Y.status === "fulfilled" && Y.value !== null).map((Y) => Y.value)
}
// @from(Ln 461426, Col 0)
function pU9() {
  (async () => {
    if (aOA()) {
      k("Plugin autoupdate: skipped (auto-updater disabled)");
      return
    }
    try {
      let A = await uO7();
      if (A.size === 0) return;
      let B = (await Promise.allSettled(Array.from(A).map(async (Z) => {
        try {
          await Rr(Z)
        } catch (Y) {
          k(`Plugin autoupdate: failed to refresh marketplace ${Z}: ${Y instanceof Error?Y.message:String(Y)}`, {
            level: "warn"
          })
        }
      }))).filter((Z) => Z.status === "rejected");
      if (B.length > 0) k(`Plugin autoupdate: ${B.length} marketplace refresh(es) failed`, {
        level: "warn"
      });
      k("Plugin autoupdate: checking installed plugins");
      let G = await dO7(A);
      if (G.length > 0)
        if (iC1) iC1(G);
        else WmA = G
    } catch (A) {
      e(A instanceof Error ? A : Error(String(A)))
    }
  })()
}
// @from(Ln 461457, Col 4)
iC1 = null
// @from(Ln 461458, Col 2)
WmA = null
// @from(Ln 461459, Col 4)
fx0 = w(() => {
  T1();
  v1();
  GQ();
  PN();
  HI();
  pzA();
  z4A();
  C0();
  pz()
})
// @from(Ln 461471, Col 0)
function lU9() {
  let {
    addNotification: A
  } = S4(), [Q, B] = KmA.useState([]);
  KmA.useEffect(() => {
    return cU9((Z) => {
      k(`Plugin autoupdate notification: ${Z.length} plugin(s) updated`), B(Z)
    })
  }, []), KmA.useEffect(() => {
    if (Q.length === 0) return;
    let G = Q.map((Y) => {
        let J = Y.indexOf("@");
        return J > 0 ? Y.substring(0, J) : Y
      }),
      Z = G.length <= 2 ? G.join(" and ") : `${G.length} plugins`;
    A({
      key: "plugin-autoupdate-restart",
      jsx: Hh.createElement(Hh.Fragment, null, Hh.createElement(C, {
        color: "success"
      }, G.length === 1 ? "Plugin" : "Plugins", " updated:", " ", Z), Hh.createElement(C, {
        dimColor: !0
      }, " · Restart to apply")),
      priority: "low",
      timeoutMs: 1e4
    }), k(`Showing plugin autoupdate notification for: ${G.join(", ")}`)
  }, [Q, A])
}
// @from(Ln 461498, Col 4)
Hh
// @from(Ln 461498, Col 8)
KmA
// @from(Ln 461499, Col 4)
iU9 = w(() => {
  fA();
  HY();
  fx0();
  T1();
  Hh = c(QA(), 1), KmA = c(QA(), 1)
})
// @from(Ln 461506, Col 0)
async function nU9(A) {
  if (k("performStartupChecks called"), !eZ(!0)) {
    k("Trust not accepted for current directory - skipping plugin installations");
    return
  }
  try {
    k("Starting background plugin installations"), await eE1(A)
  } catch (Q) {
    k(`Error initiating background plugin installations: ${Q}`)
  }
}
// @from(Ln 461517, Col 4)
aU9 = w(() => {
  T1();
  q_0();
  GQ()
})
// @from(Ln 461523, Col 0)
function oU9(A) {
  let {
    addNotification: Q
  } = S4(), B = no(), G = uG0(B, A), Z = mG0(B), Y = g8A.useRef(null), J = ZP(), X = N6(), I = Xk(), D = X === "team" || X === "enterprise", [W, K] = g8A.useState(!1);
  g8A.useEffect(() => {
    if (B.isUsingOverage && !W && (!J || !D || I)) Q({
      key: "limit-reached",
      text: Z,
      priority: "immediate"
    }), K(!0);
    else if (!B.isUsingOverage && W) K(!1)
  }, [B.isUsingOverage, Z, W, Q, J, I, D]), g8A.useEffect(() => {
    if (G && G !== Y.current) Y.current = G, Q({
      key: "rate-limit-warning",
      jsx: VmA.createElement(C, null, VmA.createElement(C, {
        color: "warning"
      }, G)),
      priority: "high"
    })
  }, [G, Q])
}
// @from(Ln 461544, Col 4)
VmA
// @from(Ln 461544, Col 9)
g8A
// @from(Ln 461545, Col 4)
rU9 = w(() => {
  HY();
  IS();
  fA();
  GQ();
  Q2();
  VmA = c(QA(), 1), g8A = c(QA(), 1)
})
// @from(Ln 461554, Col 0)
function pO7(A) {
  let Q = A.toLowerCase(),
    B = R4();
  for (let [G, Z] of Object.entries(cO7)) {
    let Y = Z.retirementDates[B];
    if (!Q.includes(G) || !Y) continue;
    return {
      isDeprecated: !0,
      modelName: Z.modelName,
      retirementDate: Y
    }
  }
  return {
    isDeprecated: !1
  }
}
// @from(Ln 461571, Col 0)
function nC1(A) {
  if (!A) return null;
  let Q = pO7(A);
  if (!Q.isDeprecated) return null;
  return `⚠ ${Q.modelName} will be retired on ${Q.retirementDate}. Consider switching to a newer model.`
}
// @from(Ln 461577, Col 4)
cO7
// @from(Ln 461578, Col 4)
hx0 = w(() => {
  MD();
  cO7 = {
    "claude-3-opus": {
      modelName: "Claude 3 Opus",
      retirementDates: {
        firstParty: "January 5, 2026",
        bedrock: "January 15, 2026",
        vertex: "January 5, 2026",
        foundry: "January 5, 2026"
      }
    },
    "claude-3-7-sonnet": {
      modelName: "Claude 3.7 Sonnet",
      retirementDates: {
        firstParty: "February 10, 2026",
        bedrock: "April 28, 2026",
        vertex: "May 11, 2026",
        foundry: "February 10, 2026"
      }
    },
    "claude-3-5-haiku": {
      modelName: "Claude 3.5 Haiku",
      retirementDates: {
        firstParty: "February 19, 2026",
        bedrock: null,
        vertex: null,
        foundry: null
      }
    }
  }
})
// @from(Ln 461611, Col 0)
function sU9(A) {
  let {
    addNotification: Q
  } = S4(), B = aC1.useRef(null);
  aC1.useEffect(() => {
    let G = nC1(A);
    if (G && G !== B.current) B.current = G, Q({
      key: "model-deprecation-warning",
      text: G,
      color: "warning",
      priority: "high"
    });
    if (!G) B.current = null
  }, [A, Q])
}
// @from(Ln 461626, Col 4)
aC1
// @from(Ln 461627, Col 4)
tU9 = w(() => {
  HY();
  hx0();
  aC1 = c(QA(), 1)
})
// @from(Ln 461633, Col 0)
function eU9() {
  let {
    addNotification: A
  } = S4(), Q = oC1.useRef(!1);
  oC1.useEffect(() => {
    if (Q.current) return;
    if ($X9()) Q.current = !0, A({
      timeoutMs: 15000,
      key: "programdata-deprecation-warning",
      text: lO7,
      color: "warning",
      priority: "high"
    })
  }, [A])
}
// @from(Ln 461648, Col 4)
oC1
// @from(Ln 461648, Col 9)
lO7 = "This device contains a C:\\ProgramData\\ClaudeCode\\managed-settings.json file. In a future version of Claude Code, managed settings at this location will no longer be applied. Contact your administrator to migrate this file to C:\\Program Files\\ClaudeCode\\managed-settings.json"
// @from(Ln 461649, Col 4)
Aq9 = w(() => {
  HY();
  GB();
  oC1 = c(QA(), 1)
})
// @from(Ln 461655, Col 0)
function Qq9({
  ideSelection: A,
  mcpClients: Q,
  ideInstallationStatus: B
}) {
  let {
    addNotification: G
  } = S4(), Z = L$A(Q), Y = B ? Rx(B?.ideType) : !1, J = B?.error || Y, X = Z === "connected" && (A?.filePath || A?.text && A.lineCount > 0), I = Z === "connected" && !X, D = J && !Y && !I && !X, W = J && Y && !I && !X;
  FmA.useEffect(() => {
    if (zK() || Z !== null || W) return;
    IhA(!0).then((K) => {
      let V = K[0]?.name;
      if (V) G({
        key: "ide-status-hint",
        text: `${tA.circle} /ide for ${V}`,
        priority: "low"
      })
    })
  }, [G, Z, W]), FmA.useEffect(() => {
    if (D || W || Z !== "disconnected") return;
    G({
      key: "ide-status-disconnected",
      text: `${tA.circle} IDE disconnected`,
      color: "error",
      priority: "medium"
    })
  }, [G, Z, D, W]), FmA.useEffect(() => {
    if (!W) return;
    G({
      key: "ide-status-jetbrains-disconnected",
      text: "IDE plugin not connected · /status for info",
      priority: "medium"
    })
  }, [G, W]), FmA.useEffect(() => {
    if (!D) return;
    G({
      key: "ide-status-install-error",
      text: "IDE extension install failed (see /status for info)",
      color: "error",
      priority: "medium"
    })
  }, [G, D])
}
// @from(Ln 461698, Col 4)
FmA
// @from(Ln 461699, Col 4)
Bq9 = w(() => {
  HY();
  TX();
  BC1();
  B2();
  FmA = c(QA(), 1)
})
// @from(Ln 461707, Col 0)
function Zq9() {
  let {
    addNotification: A
  } = S4();
  Gq9.useEffect(() => {
    let B = L1().sonnet45MigrationTimestamp;
    if (B) {
      if (Date.now() - B < 3000) A({
        key: "sonnet-4.5-update",
        text: "Model updated to Sonnet 4.5",
        color: "suggestion",
        priority: "high",
        timeoutMs: 3000
      })
    }
  }, [A])
}
// @from(Ln 461724, Col 4)
Gq9
// @from(Ln 461725, Col 4)
Yq9 = w(() => {
  HY();
  GQ();
  Gq9 = c(QA(), 1)
})
// @from(Ln 461731, Col 0)
function Xq9() {
  let {
    addNotification: A
  } = S4();
  Jq9.useEffect(() => {
    let B = L1().opusProMigrationTimestamp;
    if (B) {
      if (Date.now() - B < 3000) A({
        key: "opus-pro-update",
        text: "Model updated to Opus 4.5",
        color: "suggestion",
        priority: "high",
        timeoutMs: 3000
      })
    }
  }, [A])
}
// @from(Ln 461748, Col 4)
Jq9
// @from(Ln 461749, Col 4)
Iq9 = w(() => {
  HY();
  GQ();
  Jq9 = c(QA(), 1)
})
// @from(Ln 461755, Col 0)
function Wq9() {
  let {
    addNotification: A
  } = S4();
  Dq9.useEffect(() => {
    if (L1().subscriptionNoticeCount ?? 0 >= iO7) return;
    nO7().then((Q) => {
      if (Q === null) return;
      S0((B) => ({
        ...B,
        subscriptionNoticeCount: (B.subscriptionNoticeCount ?? 0) + 1
      })), l("tengu_switch_to_subscription_notice_shown", {}), A({
        key: "switch-to-subscription",
        jsx: HmA.createElement(C, {
          color: "suggestion"
        }, "Use your existing Claude ", Q, " plan with Claude Code", HmA.createElement(C, {
          color: "text",
          dimColor: !0
        }, " ", "· /login to activate")),
        priority: "low"
      })
    })
  }, [A])
}
// @from(Ln 461779, Col 0)
async function nO7() {
  if (qB()) return null;
  let A = await inA();
  if (!A) return null;
  if (A.account.has_claude_max) return "Max";
  if (A.account.has_claude_pro) return "Pro";
  return null
}
// @from(Ln 461787, Col 4)
HmA
// @from(Ln 461787, Col 9)
Dq9
// @from(Ln 461787, Col 14)
iO7 = 3
// @from(Ln 461788, Col 4)
Kq9 = w(() => {
  fA();
  ZNA();
  GQ();
  Z0();
  Q2();
  HY();
  HmA = c(QA(), 1), Dq9 = c(QA(), 1)
})
// @from(Ln 461798, Col 0)
function Vq9() {
  let A = rC1.useRef(!1);
  rC1.useEffect(() => {
    if (A.current) return;
    A.current = !0, l39()
  }, [])
}
// @from(Ln 461805, Col 4)
rC1
// @from(Ln 461806, Col 4)
Fq9 = w(() => {
  Oj0();
  rC1 = c(QA(), 1)
})
// @from(Ln 461811, Col 0)
function Hq9({
  onRun: A,
  onCancel: Q,
  reason: B
}) {
  let G = y$A.useRef(!1);
  return J0(y$A.useCallback((Z, Y) => {
    if (Y.escape) Q()
  }, [Q])), y$A.useEffect(() => {
    if (!G.current) G.current = !0, A()
  }, [A]), hE.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, hE.createElement(T, null, hE.createElement(C, {
    bold: !0
  }, "Running /issue to capture feedback...")), hE.createElement(T, null, hE.createElement(C, {
    dimColor: !0
  }, "Press ", hE.createElement(F0, {
    shortcut: "Esc",
    action: "cancel"
  }), " anytime")), hE.createElement(T, null, hE.createElement(C, {
    dimColor: !0
  }, "Reason: ", B)))
}
// @from(Ln 461836, Col 0)
function gx0(A) {
  return !1;
  switch (A) {
    case "feedback_survey_bad":
      return !0;
    case "feedback_survey_good":
    default:
      return !1
  }
}
// @from(Ln 461847, Col 0)
function Eq9(A) {
  switch (A) {
    case "feedback_survey_bad":
      return 'You responded "Bad" to the feedback survey';
    case "feedback_survey_good":
      return 'You responded "Good" to the feedback survey';
    default:
      return "Unknown reason"
  }
}
// @from(Ln 461857, Col 4)
hE
// @from(Ln 461857, Col 8)
y$A
// @from(Ln 461858, Col 4)
zq9 = w(() => {
  fA();
  e9();
  hE = c(QA(), 1), y$A = c(QA(), 1)
})
// @from(Ln 461863, Col 4)
aO7
// @from(Ln 461863, Col 9)
oO7
// @from(Ln 461864, Col 4)
$q9 = w(() => {
  fA();
  C0();
  aO7 = c(QA(), 1), oO7 = c(QA(), 1)
})
// @from(Ln 461873, Col 0)
function AM7() {
  let A = J3("app:toggleTranscript", "Global", "ctrl+o");
  return cB.createElement(T, {
    alignItems: "center",
    alignSelf: "center",
    borderTopDimColor: !0,
    borderBottom: !1,
    borderLeft: !1,
    borderRight: !1,
    borderStyle: "single",
    marginTop: 1,
    paddingLeft: 2,
    width: "100%"
  }, cB.createElement(C, {
    dimColor: !0
  }, "Showing detailed transcript · ", A, " to toggle"))
}
// @from(Ln 461891, Col 0)
function v$A({
  commands: A,
  debug: Q,
  initialTools: B,
  initialMessages: G,
  initialFileHistorySnapshots: Z,
  mcpClients: Y,
  dynamicMcpConfig: J,
  mcpCliEndpoint: X,
  autoConnectIdeFlag: I,
  strictMcpConfig: D = !1,
  systemPrompt: W,
  appendSystemPrompt: K,
  onBeforeQuery: V,
  onTurnComplete: F,
  disabled: H = !1,
  mainThreadAgentDefinition: E,
  disableSlashCommands: z = !1,
  taskListId: $,
  autoTickIntervalMs: O
}) {
  UQ.useEffect(() => {
    return k(`[REPL:mount] REPL mounted, disabled=${H}`), nA2(), () => k("[REPL:unmount] REPL unmounting")
  }, [H]);
  let [L, M] = a0(), _ = Tk(), {
    toolPermissionContext: j,
    verbose: x,
    mcp: b,
    plugins: S,
    agentDefinitions: u
  } = L, f = js(), [AA, n] = UQ.useState(A);
  jF9(Xq(), n);
  let y = UQ.useMemo(() => F$(j), [j]);
  zH9();
  let [, p] = UQ.useState(!1);
  UQ.useEffect(() => {}, []);
  let [GA, WA] = UQ.useState(J), MA = UQ.useCallback((R0) => {
    WA(R0)
  }, [WA]), [TA, bA] = UQ.useState("prompt"), [jA, OA] = UQ.useState(1), [IA, HA] = UQ.useState(!1), {
    addNotification: ZA
  } = S4(), zA = OF9(Y, b.clients), [wA, _A] = UQ.useState(void 0), [s, t] = UQ.useState(null), [BA, DA] = UQ.useState(null), [CA, FA] = UQ.useState(!1);
  Zq9(), Xq9(), Wq9(), Qq9({
    ideSelection: wA,
    mcpClients: zA,
    ideInstallationStatus: BA
  }), LU9({
    mcpClients: zA
  }), mU9(), lU9(), jE1(), oU9(f), sU9(f), eU9(), eF9(), QH9(), JH9(), MU9();
  let {
    recommendation: xA,
    handleResponse: mA
  } = bU9();
  hU9();
  let G1 = UQ.useMemo(() => {
    return [...y, ...B]
  }, [y, B]);
  SC1();
  let J1 = SI1();
  UQ.useEffect(() => {
    nU9(M)
  }, [M]), IH9(zA, M), eO7(M, G);
  let SA = pz1(G1, b.tools, j),
    A1 = UQ.useMemo(() => {
      if (!E) return SA;
      let {
        resolvedTools: R0
      } = ur(E, SA, !1);
      return R0
    }, [E, SA]),
    n1 = Wx0(AA, S.commands),
    S1 = Wx0(n1, b.commands),
    L0 = UQ.useMemo(() => z ? [] : S1, [z, S1]);
  cI9(b.clients), PF9(b.clients, _A);
  let [VQ, t0] = UQ.useState("responding"), [QQ, y1] = UQ.useState([]), [qQ, K1] = UQ.useState(null);
  UQ.useEffect(() => {
    if (qQ && !qQ.isStreaming && qQ.streamingEndedAt) {
      let JQ = 30000 - (Date.now() - qQ.streamingEndedAt);
      if (JQ > 0) {
        let WQ = setTimeout(() => {
          K1(null)
        }, JQ);
        return () => clearTimeout(WQ)
      } else K1(null)
    }
  }, [qQ]);
  let [$1, i1] = UQ.useState(null), [Q0, c0] = UQ.useState(!1), [b0, UA] = UQ.useState(0), [RA, D1] = UQ.useState(null), [U1, V1] = UQ.useState(void 0), H1 = UQ.useRef(0), Y0 = UQ.useRef(0), c1 = UQ.useRef(null), p0 = UQ.useRef(void 0), HQ = UQ.useCallback((R0) => {
    if (c0(R0), R0) H1.current = Date.now(), Y0.current = 0, c1.current = null, UA(0), D1(null);
    else D1(Date.now())
  }, []);
  XZ(() => {
    if (!Q0) return;
    if (c1.current !== null) return;
    let R0 = Date.now() - H1.current;
    UA(R0 - Y0.current)
  }, 100);
  let [nB, AB] = UQ.useState(null);
  UQ.useEffect(() => {
    if (nB?.notifications) nB.notifications.forEach((R0) => {
      ZA({
        key: "auto-updater-notification",
        text: R0,
        priority: "low"
      })
    })
  }, [nB, ZA]);
  let [RB, C9] = UQ.useState(null), [vB, c2] = UQ.useState([]), [F9, m3] = UQ.useState([]), s0 = vB.length > 0 || L.pendingWorkerRequest;
  UQ.useEffect(() => {
    if (Q0 && !s0) oA2();
    else rSA();
    return () => rSA()
  }, [Q0, s0]);
  let [u1, IQ] = UQ.useState(G ?? []), [tB, U9] = UQ.useState(null);
  Vq9();
  let [V4, j6] = UQ.useState([]), [z8, T6] = UQ.useState(""), [i8, Q8] = UQ.useState("prompt"), [$G, t7] = UQ.useState(), {
    tip: PQ,
    dismissTip: z2
  } = eV9({
    inputValue: z8,
    isAssistantResponding: Q0
  }), [w4, Y6] = UQ.useState({}), [eB, L4] = UQ.useState(0), [L5, B8] = UQ.useState(0), [F6, cG] = UQ.useState(0), [P6, pG] = UQ.useState(null), [T3, RY] = UQ.useState(null), [_Y, g5] = UQ.useState(null), [n8, oA] = UQ.useState(!1), [VA, XA] = UQ.useState(!1), [kA, uA] = UQ.useState(ux0()), [dA, C1] = UQ.useState(L1().hasAcknowledgedCostThreshold), [j1, k1] = UQ.useState(new Set), [s1, p1] = UQ.useState("INSERT"), [M0, gQ] = UQ.useState(!1), [_B, T2] = UQ.useState(!1), [n2, Q4] = UQ.useState(!1), [G8, $Z] = UQ.useState(!1), [S7, FD] = UQ.useState(!1), [aJ, OV] = UQ.useState(!1), [oJ, IJ] = UQ.useState(null), [MK, CG] = UQ.useState(!1), T0 = UQ.useRef(null), NQ = UQ.useRef(!1), PB = UQ.useRef(null), [Y2] = oB(), u9 = UQ.useCallback(() => {
    VH9({
      theme: Y2,
      readFileState: uZ.current
    }).then(async (R0) => {
      if (R0) {
        let JQ = await R0.content({
          theme: Y2
        });
        M((WQ) => ({
          ...WQ,
          spinnerTip: JQ
        })), FH9(R0)
      } else M((JQ) => ({
        ...JQ,
        spinnerTip: void 0
      }))
    })
  }, [M, Y2]), F4 = UQ.useCallback(() => {
    HQ(!1), V1(void 0), B8(0), y1([]), pG(null), RY(null), g5(null), u9(), IyA()
  }, [HQ, u9]), {
    backgroundSignalRef: HD,
    handleBackgroundSession: ED,
    handleForegroundTask: P3
  } = dF9({
    setMessages: IQ,
    setIsLoading: HQ,
    resetLoadingState: F4,
    setAbortController: i1
  }), V3 = zF9(z8), XH = (!RB || RB.showSpinner === !0) && vB.length === 0 && (Q0 || U1) && !L.pendingWorkerRequest, cU = lF9(u1, Q0, eB), RK = UQ.useMemo(() => ({
    ...cU,
    handleSelect: (R0) => {
      if (cU.handleSelect(R0), R0 === "bad" && gx0("feedback_survey_bad") || R0 === "good" && gx0("feedback_survey_good")) k$(R0 === "bad" ? "feedback_survey_bad" : "feedback_survey_good")
    }
  }), [cU]), Ow = nF9(u1, Q0);
  hF9({
    autoConnectIdeFlag: I,
    ideToInstallExtension: s,
    setDynamicMcpConfig: WA,
    setShowIdeOnboarding: FA,
    setIDEInstallationState: DA
  }), CH9(Z, L.fileHistory, (R0) => M((JQ) => ({
    ...JQ,
    fileHistory: R0
  })));
  let mj = UQ.useCallback(async (R0, JQ, WQ) => {
      l("tengu_session_resumed", {
        entrypoint: WQ
      });
      let S9 = dbA(JQ.messages),
        B4 = await WU("resume", R0, E?.agentType);
      if (S9.push(...B4), w71(JQ), W71(JQ, lz(R0)), JQ.fileHistorySnapshots) RHA(JQ.fileHistorySnapshots, (B9) => {
        M((a4) => ({
          ...a4,
          fileHistory: B9
        }))
      }), EW1(JQ);
      if (lG(S9, JQ.projectPath ?? EQ()), F4(), i1(null), !Tz()) await sI();
      uA(R0);
      let G4 = Pp1(R0);
      if (Sp1(), xCA(), pw(lz(R0)), await wj(), G4) OdA(G4);
      IQ(() => S9), C9(null), T6(""), j6([])
    }, [F4, M]),
    Mw = q0(),
    v$ = UQ.useMemo(() => Ir(q0()), []),
    uZ = UQ.useRef((() => {
      let R0 = Id(u9A);
      return R0.set(v$, {
        content: eA(L.todos[Mw] || []),
        timestamp: 0,
        offset: void 0,
        limit: void 0
      }), R0
    })()),
    lG = UQ.useCallback((R0, JQ) => {
      let WQ = VzA(R0, JQ, u9A);
      uZ.current = MKA(uZ.current, WQ)
    }, []);
  UQ.useEffect(() => {
    if (G && G.length > 0) lG(G, EQ())
  }, []);
  let {
    status: uE,
    reverify: _K
  } = YF9(), [FM, k$] = UQ.useState(null), [DJ, IH] = UQ.useState(null), [pU, mE] = UQ.useState(!1), b$ = !Q0 && VA;

  function F7() {
    if (pU || DJ) return;
    if (n8) return "message-selector";
    if (F9[0]) return "sandbox-permission";
    let R0 = !RB || RB.shouldContinueAnimation;
    if (R0 && vB[0]) return "tool-permission";
    if (R0 && L.workerPermissions.queue[0]) return "worker-permission";
    if (R0 && L.workerSandboxPermissions.queue[0]) return "worker-sandbox-permission";
    if (R0 && L.elicitation.queue[0]) return "elicitation";
    if (R0 && b$) return "cost";
    if (R0 && CA) return "ide-onboarding";
    if (R0 && xA) return "lsp-recommendation";
    return
  }
  let mZ = F7();
  p0.current = mZ, UQ.useEffect(() => {
    if (!Q0) return;
    let R0 = mZ === "tool-permission",
      JQ = Date.now();
    if (R0 && c1.current === null) c1.current = JQ;
    else if (!R0 && c1.current !== null) Y0.current += JQ - c1.current, c1.current = null
  }, [mZ, Q0]);

  function jY() {
    if (mZ === "elicitation") return;
    if (F4(), mZ === "tool-permission") vB[0]?.onAbort(), c2([]);
    else if (mZ === "worker-permission") {
      let R0 = L.workerPermissions.queue[0];
      if (R0) EmA?.sendPermissionResponseViaMailbox(R0.workerName, {
        decision: "rejected",
        resolvedBy: "leader"
      }, R0.id, L.teamContext?.teamName), M((JQ) => ({
        ...JQ,
        workerPermissions: {
          ...JQ.workerPermissions,
          queue: JQ.workerPermissions.queue.slice(1)
        }
      }))
    } else $1?.abort()
  }
  let G9 = UQ.useCallback(async () => {
      let R0 = await SZ1(z8, 0, async () => new Promise((JQ) => M((WQ) => {
        return JQ(WQ), WQ
      })), M);
      if (!R0) return;
      if (T6(R0.text), Q8("prompt"), R0.images.length > 0) Y6((JQ) => {
        let WQ = {
          ...JQ
        };
        for (let S9 of R0.images) WQ[S9.id] = S9;
        return WQ
      })
    }, [M, T6, Q8, z8, Y6]),
    x7 = {
      setToolUseConfirmQueue: c2,
      onCancel: jY,
      isMessageSelectorVisible: n8 || M0 || _B,
      screen: TA,
      abortSignal: $1?.signal,
      popCommandFromQueue: G9,
      vimMode: s1,
      isLocalJSXCommand: RB?.isLocalJSXCommand,
      isSideQuestionVisible: oJ !== null,
      isSearchingHistory: S7,
      isHelpOpen: aJ
    };
  UQ.useEffect(() => {
    if ($H() >= 5 && !VA && !dA) {
      if (l("tengu_cost_threshold_reached", {}), reA()) XA(!0)
    }
  }, [u1, VA, dA]);
  let wI = UQ.useCallback(async (R0) => {
    return new Promise((JQ) => {
      m3((WQ) => [...WQ, {
        hostPattern: R0,
        resolvePromise: JQ
      }])
    })
  }, [M]);
  if (XB.isSandboxingEnabled()) XB.initialize(wI).catch((R0) => {
    process.stderr.write(`
❌ Sandbox Error: ${R0 instanceof Error?R0.message:String(R0)}
`), f6(1, "other")
  });
  let f$ = UQ.useCallback((R0) => {
      M((JQ) => ({
        ...JQ,
        toolPermissionContext: R0
      })), setImmediate(() => {
        c2((JQ) => {
          return JQ.forEach((WQ) => {
            WQ.recheckPermission()
          }), JQ
        })
      })
    }, [M, c2]),
    rJ = FF9(c2, f$),
    WJ = UQ.useCallback((R0, JQ, WQ, S9, B4, G4) => {
      return {
        abortController: WQ,
        options: {
          commands: L0,
          tools: A1,
          debug: Q,
          verbose: x,
          mainLoopModel: G4,
          maxThinkingTokens: B4 ?? (L.thinkingEnabled ? Hm(JQ, void 0) : 0),
          mcpClients: zA,
          mcpResources: b.resources,
          ideInstallationStatus: BA,
          isNonInteractiveSession: !1,
          dynamicMcpConfig: GA,
          theme: Y2,
          agentDefinitions: u,
          customSystemPrompt: W,
          appendSystemPrompt: K
        },
        getAppState() {
          return new Promise((B9) => {
            M((a4) => {
              return B9(a4), {
                ...a4,
                toolPermissionContext: {
                  ...a4.toolPermissionContext,
                  alwaysAllowRules: {
                    ...a4.toolPermissionContext.alwaysAllowRules,
                    command: S9
                  }
                }
              }
            })
          })
        },
        setAppState: M,
        messages: R0,
        setMessages: IQ,
        updateFileHistoryState(B9) {
          M((a4) => ({
            ...a4,
            fileHistory: B9(a4.fileHistory)
          }))
        },
        updateAttributionState(B9) {
          M((a4) => ({
            ...a4,
            attribution: B9(a4.attribution)
          }))
        },
        openMessageSelector: () => {
          if (!H) oA(!0)
        },
        onChangeAPIKey: _K,
        onForegroundTask: P3,
        readFileState: uZ.current,
        setToolJSX: C9,
        addNotification: ZA,
        onChangeDynamicMcpConfig: MA,
        onInstallIDEExtension: t,
        nestedMemoryAttachmentTriggers: new Set,
        setResponseLength: B8,
        setStreamMode: t0,
        setSpinnerMessage: pG,
        setSpinnerColor: RY,
        setSpinnerShimmerColor: g5,
        setInProgressToolUseIDs: k1,
        resume: mj
      }
    }, [L0, A1, Q, x, zA, b.resources, BA, GA, Y2, u, M, _K, ZA, MA, P3, mj, L.thinkingEnabled, H, W, K]),
    zD = UQ.useCallback(async (R0, JQ, WQ, S9, B4, G4, B9) => {
      let a4 = JQ.filter((tJ) => tJ.type === "user" || tJ.type === "assistant").pop();
      if (S9) {
        Ec.handleQueryStart(zA);
        let tJ = nN(zA);
        if (tJ) fr2(tJ)
      }
      if (FDA(), a4?.type === "user" && typeof a4.message.content === "string") rA2(a4.message.content);
      if (!S9) {
        F4(), i1(null);
        return
      }
      let o8 = WJ(R0, JQ, WQ, B4, B9, G4);
      h6("query_context_loading_start");
      let [, $8, PK, e7] = await Promise.all([qx0(j, M), rc(A1, G4, Array.from(j.additionalWorkingDirectories.keys()), zA), ZV(), OF()]);
      h6("query_context_loading_end");
      let iU = CH1({
        mainThreadAgentDefinition: E,
        toolUseContext: o8,
        customSystemPrompt: W,
        defaultSystemPrompt: $8,
        appendSystemPrompt: K
      });
      h6("query_query_start");
      let $h, cx = new Promise((tJ) => {
        $h = tJ
      });
      HD.current = {
        promise: cx,
        resolve: $h
      };
      let Ch = aN({
          messages: R0,
          systemPrompt: iU,
          userContext: PK,
          systemContext: e7,
          canUseTool: rJ,
          toolUseContext: o8,
          querySource: SD1()
        })[Symbol.asyncIterator](),
        nU = !1,
        gX = !1;
      while (!gX) {
        let tJ = await Promise.race([Ch.next().then((MV) => ({
          type: "message",
          result: MV
        })), cx.then(() => ({
          type: "background"
        }))]);
        if (tJ.type === "background") {
          nU = !0, gX = !0;
          let MV = aA2() || "Background session",
            {
              taskId: RV,
              abortSignal: Rw
            } = Ym2(MV, M, E, WQ);
          Im2(Ch, RV, M, (H7) => void tc(H7), u1, Rw), await IE1({
            setMessages: IQ,
            readFileState: uZ.current,
            getAppState: async () => new Promise((H7) => {
              M((cp) => {
                return H7(cp), cp
              })
            }),
            setAppState: M
          })
        } else if (tJ.result.done) gX = !0;
        else $K1(tJ.result.value, (MV) => {
          IQ((RV) => [...RV, MV])
        }, (MV) => B8((RV) => RV + MV.length), t0, y1, (MV) => {
          IQ((RV) => RV.filter((Rw) => Rw !== MV)), gJ9(MV.uuid)
        }, K1)
      }
      if (HD.current = null, h6("query_end"), nU) return;
      F4(), J19(), F?.()
    }, [zA, F4, WJ, j, M, A1, W, F, K, rJ, E]),
    g6 = UQ.useCallback(async (R0, JQ, WQ, S9, B4, G4, B9, a4) => {
      if (NQ.current) {
        l("tengu_concurrent_onquery_detected", {}), R0.filter((o8) => o8.type === "user").map((o8) => S6A(o8.message.content)).filter((o8) => o8 !== null).forEach((o8, $8) => {
          if (wF({
              value: o8,
              mode: "prompt"
            }, M), $8 === 0) l("tengu_concurrent_onquery_enqueued", {})
        }), HQ(!1);
        return
      }
      NQ.current = !0, PB.current = R0;
      try {
        if (HQ(!0), IQ(($8) => [...$8, ...R0]), V1(void 0), B8(0), y1([]), B9 && a4) {
          let $8 = [...u1, ...R0];
          if (!await B9(a4, $8)) return
        }
        let o8 = await new Promise(($8) => {
          IQ((PK) => {
            return $8(PK), PK
          })
        });
        await zD(o8, R0, JQ, WQ, S9, B4, G4)
      } finally {
        NQ.current = !1, cG(Date.now()), F4();
        let o8 = Date.now() - H1.current - Y0.current;
        if (o8 > 30000 && !JQ.signal.aborted) IQ(($8) => [...$8, yJ9(o8)])
      }
    }, [u1, zD, HQ, M, F4]),
    TY = UQ.useRef(!1);
  UQ.useEffect(() => {
    let R0 = L.initialMessage;
    if (!R0 || Q0 || TY.current) return;
    TY.current = !0;
    async function JQ(WQ) {
      if (WQ.clearContext) {
        let B9 = WQ.message.planContent ? GY0() : void 0;
        if (await IE1({
            setMessages: IQ,
            readFileState: uZ.current,
            getAppState: async () => new Promise((a4) => {
              M((o8) => {
                return a4(o8), o8
              })
            }),
            setAppState: M
          }), B9) ZY0(q0(), B9)
      }
      let S9 = WQ.message.planContent && !1;
      if (M((B9) => {
          let a4 = WQ.mode ? Wk(B9.toolPermissionContext, re(WQ.mode, WQ.allowedPrompts)) : B9.toolPermissionContext;
          return {
            ...B9,
            initialMessage: null,
            toolPermissionContext: a4,
            ...S9 && {
              pendingPlanVerification: {
                plan: WQ.message.planContent,
                verificationStarted: !1,
                verificationCompleted: !1
              }
            }
          }
        }), vG()) MHA((B9) => {
        M((a4) => ({
          ...a4,
          fileHistory: B9(a4.fileHistory)
        }))
      }, WQ.message.uuid);
      let B4 = WQ.message.message.content;
      if (typeof B4 === "string" && B4.startsWith("/")) jK(B4, {
        setCursorOffset: () => {},
        clearBuffer: () => {},
        resetHistory: () => {}
      });
      else {
        let B9 = c9();
        i1(B9), g6([WQ.message], B9, !0, [], f, void 0)
      }
      setTimeout(() => {
        TY.current = !1
      }, 100)
    }
    JQ(R0)
  }, [L.initialMessage, Q0, IQ, M, g6, f, A1]);
  let sJ = UQ.useCallback(async (R0) => {
      CG(!0), IJ({
        question: R0,
        response: null
      });
      let JQ = c9();
      T0.current = JQ;
      try {
        let [WQ, S9, B4] = await Promise.all([rc(A1, f, Array.from(j.additionalWorkingDirectories.keys()), zA), ZV(), OF()]), G4 = WJ(u1, [], JQ, [], void 0, f), B9 = await ZV9({
          question: R0,
          cacheSafeParams: {
            systemPrompt: WQ,
            userContext: S9,
            systemContext: B4,
            toolUseContext: G4,
            forkContextMessages: u1
          }
        });
        if (!JQ.signal.aborted && B9.response) IJ({
          question: R0,
          response: B9.response
        });
        else if (!JQ.signal.aborted) IJ(null)
      } catch {
        IJ(null)
      } finally {
        CG(!1)
      }
    }, [A1, f, j, zA, WJ, u1]),
    jK = UQ.useCallback(async (R0, JQ, WQ) => {
      if (IJ(null), A2A({
          display: WQ ? R0 : NRB(R0, i8),
          pastedContents: WQ ? {} : w4
        }), !Q0 || WQ) {
        if (T6(""), JQ.setCursorOffset(0), Q8("prompt"), Y6({}), _A(void 0), L4((S9) => S9 + 1), JQ.clearBuffer(), M((S9) => ({
            ...S9,
            attribution: {
              ...S9.attribution,
              promptCount: S9.attribution.promptCount + 1
            }
          })), $G !== void 0) T6($G.text), JQ.setCursorOffset($G.cursorOffset), t7(void 0)
      }
      if (WQ) {
        let {
          shouldContinueQuery: S9
        } = await m19(WQ.state, WQ.speculationSessionTimeSavedMs, WQ.setAppState, R0, {
          setMessages: IQ,
          readFileState: uZ,
          cwd: EQ()
        });
        if (S9) {
          let B4 = c9();
          i1(B4), g6([], B4, !0, [], f, void 0)
        }
        return
      }
      await _C1({
        input: R0,
        helpers: JQ,
        isLoading: Q0,
        mode: i8,
        commands: L0,
        onInputChange: T6,
        setPastedContents: Y6,
        setIsLoading: HQ,
        setToolJSX: C9,
        getToolUseContext: WJ,
        messages: u1,
        mainLoopModel: f,
        pastedContents: w4,
        ideSelection: wA,
        setUserInputOnProcessing: V1,
        setAbortController: i1,
        onQuery: g6,
        resetLoadingState: F4,
        thinkingTokens: V3.tokens,
        thinkingEnabled: L.thinkingEnabled,
        setAppState: M,
        querySource: SD1(),
        onBeforeQuery: V,
        canUseTool: rJ
      })
    }, [Q0, i8, L0, T6, Q8, Y6, L4, _A, HQ, C9, WJ, u1, f, w4, wA, V1, i1, g6, F4, V3.tokens, $G, t7, L.thinkingEnabled, M, V, rJ, sJ, MK, IQ]),
    DH = UQ.useCallback(() => {
      k$(null), jK("/issue", {
        setCursorOffset: () => {},
        clearBuffer: () => {},
        resetHistory: () => {}
      })
    }, [jK]),
    TK = UQ.useCallback(() => {
      k$(null)
    }, []),
    lU = UQ.useCallback(() => {
      jK("/rate-limit-options", {
        setCursorOffset: () => {},
        clearBuffer: () => {},
        resetHistory: () => {}
      })
    }, [jK]),
    Eh = UQ.useCallback(async () => {
      mE(!0);
      let R0 = await ez1.call(() => {});
      IH(R0)
    }, []),
    zh = UQ.useCallback(() => {
      oA((R0) => !R0)
    }, []);
  async function dZ() {
    _K();
    let R0 = GV();
    for (let JQ of R0) uZ.current.set(JQ.path, {
      content: JQ.content,
      timestamp: Date.now(),
      offset: void 0,
      limit: void 0
    })
  }
  rtQ(), hI9(u1, u1.length === G?.length), GF9(), UQ.useEffect(() => {
    if (L.queuedCommands.length < 1) return;
    S0((R0) => ({
      ...R0,
      promptQueueUseCount: (R0.promptQueueUseCount ?? 0) + 1
    }))
  }, [L.queuedCommands.length]);
  let h$ = UQ.useCallback(() => new Promise((R0) => M((JQ) => {
      return R0(JQ), JQ
    })), [M]),
    LA = UQ.useCallback(async (R0, JQ) => {
      await _C1({
        input: R0,
        helpers: {
          setCursorOffset: () => {},
          clearBuffer: () => {},
          resetHistory: () => {}
        },
        isLoading: Q0,
        mode: "prompt",
        commands: L0,
        onInputChange: () => {},
        setPastedContents: () => {},
        setIsLoading: HQ,
        setToolJSX: C9,
        getToolUseContext: WJ,
        messages: u1,
        mainLoopModel: f,
        pastedContents: JQ,
        ideSelection: wA,
        setUserInputOnProcessing: V1,
        setAbortController: i1,
        onQuery: g6,
        resetLoadingState: F4,
        thinkingTokens: V3.tokens,
        thinkingEnabled: L.thinkingEnabled,
        setAppState: M,
        querySource: SD1(),
        onBeforeQuery: V,
        canUseTool: rJ
      })
    }, [Q0, L0, HQ, C9, WJ, u1, f, wA, V1, rJ, i1, g6, F4, V3.tokens, L.thinkingEnabled, M, V]);
  NF9({
    isLoading: Q0,
    queuedCommandsLength: L.queuedCommands.length,
    lastQueryCompletionTime: F6,
    getAppState: h$,
    setAppState: M,
    executeQueuedInput: LA
  }), UQ.useEffect(() => {
    JkA.recordUserActivity(), SCA()
  }, [z8, eB]);
  let PA = UQ.useRef(new Set);
  UQ.useEffect(() => {
    let R0 = new Set(u1.filter((WQ) => qc(WQ)).map((WQ) => WQ.uuid));
    if (Array.from(R0).some((WQ) => !PA.current.has(WQ))) {
      if (PA.current = R0, !Tz()) sI();
      uA(ux0())
    }
  }, [u1]), UQ.useEffect(() => {
    if (Q0) return;
    if (eB === 0) return;
    if (F6 === 0) return;
    let R0 = setTimeout(() => {
      if (wdA() > F6) return;
      let WQ = Date.now() - F6;
      if (!Q0 && !RB && p0.current === void 0 && WQ >= L1().messageIdleNotifThresholdMs) Dc({
        message: "Claude is waiting for your input",
        notificationType: "idle_prompt"
      }, _)
    }, L1().messageIdleNotifThresholdMs);
    return () => clearTimeout(R0)
  }, [Q0, RB, eB, F6, _]);
  let E1 = UQ.useCallback((R0) => {
    if (NQ.current) return !1;
    let JQ = c9();
    i1(JQ);
    let WQ = H0({
      content: R0
    });
    return g6([WQ], JQ, !0, [], f, void 0), !0
  }, [g6, f]);
  kF9({
    isLoading: Q0,
    focusedInputDialog: mZ,
    onSubmitCollabMessage: E1
  }), UQ.useEffect(() => {
    return dZ(), () => {
      Ec.shutdown()
    }
  }, []);
  let {
    internal_eventEmitter: V0
  } = ga(), [f0, LB] = UQ.useState(0);
  UQ.useEffect(() => {
    let R0 = () => {
        process.stdout.write(`
Claude Code has been suspended. Run \`fg\` to bring Claude Code back.
Note: ctrl + z now suspends Claude Code, ctrl + _ undoes input.
`)
      },
      JQ = () => {
        LB((WQ) => WQ + 1)
      };
    return V0?.on("suspend", R0), V0?.on("resume", JQ), () => {
      V0?.off("suspend", R0), V0?.off("resume", JQ)
    }
  }, [V0]);
  let t2 = UQ.useMemo(() => a7(V4).filter(UzA), [V4]),
    k4 = UQ.useMemo(() => {
      if (!Q0) return null;
      let R0 = u1.filter(($8) => $8.type === "progress" && $8.data.type === "hook_progress" && ($8.data.hookEvent === "Stop" || $8.data.hookEvent === "SubagentStop"));
      if (R0.length === 0) return null;
      let JQ = [...new Set(R0.map(($8) => $8.toolUseID))],
        WQ = JQ[JQ.length - 1];
      if (!WQ) return null;
      if (u1.some(($8) => $8.type === "system" && $8.subtype === "stop_hook_summary" && $8.toolUseID === WQ)) return null;
      let B4 = R0.filter(($8) => $8.toolUseID === WQ),
        G4 = B4.length,
        B9 = u1.filter(($8) => {
          if ($8.type !== "attachment") return !1;
          let PK = $8.attachment;
          return "hookEvent" in PK && (PK.hookEvent === "Stop" || PK.hookEvent === "SubagentStop") && "toolUseID" in PK && PK.toolUseID === WQ
        }).length,
        a4 = B4.find(($8) => $8.data.statusMessage)?.data.statusMessage;
      if (a4) return G4 === 1 ? `${a4}…` : `${a4}… ${B9}/${G4}`;
      let o8 = B4[0]?.data.hookEvent === "SubagentStop" ? "subagent stop" : "stop";
      return G4 === 1 ? `running ${o8} hook` : `running stop hooks… ${B9}/${G4}`
    }, [u1, Q0]),
    a8 = UQ.useCallback(() => {
      U9({
        messagesLength: u1.length,
        messageHistoryLength: V4.length,
        streamingToolUsesLength: QQ.length
      })
    }, [u1.length, V4.length, QQ.length]),
    CZ = UQ.useCallback(() => {
      U9(null)
    }, []),
    UZ = L.todos[Mw],
    F3 = {
      screen: TA,
      setScreen: bA,
      setScreenToggleId: OA,
      setShowAllInTranscript: HA,
      clearTerminal: sI,
      onEnterTranscript: a8,
      onExitTranscript: CZ,
      todos: UZ
    },
    S6 = tB ? u1.slice(0, tB.messagesLength) : u1,
    LI = tB ? QQ.slice(0, tB.streamingToolUsesLength) : QQ,
    WH = tB ? a7(V4.slice(0, tB.messageHistoryLength)).filter(UzA) : t2;
  if (tO7(), TA === "transcript") return cB.createElement(vJ, null, cB.createElement(Xx0, {
    ...F3
  }), cB.createElement(Ix0, {
    ...x7
  }), cB.createElement(we, {
    messages: S6,
    normalizedMessageHistory: WH,
    tools: A1,
    commands: L0,
    verbose: !0,
    toolJSX: null,
    toolUseConfirmQueue: [],
    inProgressToolUseIDs: j1,
    isMessageSelectorVisible: !1,
    conversationId: kA,
    screen: TA,
    agentDefinitions: u,
    screenToggleId: jA,
    streamingToolUses: LI,
    showAllInTranscript: IA,
    onOpenRateLimitOptions: lU,
    sideQuestionResponse: oJ,
    isLoading: Q0,
    hidePastThinking: !0,
    streamingThinking: qQ
  }), RB && cB.createElement(T, {
    flexDirection: "column",
    width: "100%"
  }, RB.jsx), cB.createElement(qU9, null), cB.createElement(AM7, null));
  return cB.createElement(vJ, null, cB.createElement(Xx0, {
    ...F3
  }), cB.createElement(Ix0, {
    ...x7
  }), cB.createElement(fE1, {
    key: f0,
    dynamicMcpConfig: GA,
    isStrictMcpConfig: D,
    mcpCliEndpoint: X
  }, cB.createElement(we, {
    messages: u1,
    normalizedMessageHistory: t2,
    tools: A1,
    commands: L0,
    verbose: x,
    toolJSX: RB,
    toolUseConfirmQueue: vB,
    inProgressToolUseIDs: j1,
    isMessageSelectorVisible: n8,
    conversationId: kA,
    screen: TA,
    screenToggleId: jA,
    streamingToolUses: QQ,
    showAllInTranscript: IA,
    agentDefinitions: u,
    onOpenRateLimitOptions: lU,
    sideQuestionResponse: oJ,
    isLoading: Q0
  }), !H && U1 && cB.createElement(j6A, {
    param: {
      text: U1,
      type: "text"
    },
    addMargin: !0,
    verbose: x
  }), RB && cB.createElement(T, {
    flexDirection: "column",
    width: "100%"
  }, RB.jsx), cB.createElement(T, {
    flexDirection: "column",
    width: "100%"
  }, !1, XH && cB.createElement(vL2, {
    mode: VQ,
    spinnerTip: L.spinnerTip,
    currentResponseLength: L5,
    overrideMessage: P6,
    spinnerSuffix: k4,
    verbose: x,
    elapsedTimeMs: b0,
    todos: UZ,
    overrideColor: T3,
    overrideShimmerColor: _Y,
    hasActiveTools: j1.size > 0
  }), !XH && L.showExpandedTodos && J1 && J1.length > 0 && cB.createElement(T, {
    width: "100%",
    flexDirection: "column"
  }, cB.createElement(TI1, {
    tasks: J1,
    isStandalone: !0
  })), !XH && L.showExpandedTodos && !(J1 && J1.length > 0) && cB.createElement(T, {
    width: "100%",
    flexDirection: "column"
  }, cB.createElement(Ns, {
    todos: UZ || [],
    isStandalone: !0
  })), mZ === "sandbox-permission" && cB.createElement(Nx0, {
    key: F9[0].hostPattern.host,
    hostPattern: F9[0].hostPattern,
    onUserResponse: (R0) => {
      let {
        allow: JQ,
        persistToSettings: WQ
      } = R0, S9 = F9[0];
      if (!S9) return;
      let B4 = S9.hostPattern.host;
      if (WQ) {
        let G4 = {
          type: "addRules",
          rules: [{
            toolName: cI,
            ruleContent: `domain:${B4}`
          }],
          behavior: JQ ? "allow" : "deny",
          destination: "localSettings"
        };
        M((B9) => ({
          ...B9,
          toolPermissionContext: UJ(B9.toolPermissionContext, G4)
        })), Kk(G4), XB.refreshConfig()
      }
      m3((G4) => {
        return G4.filter((B9) => B9.hostPattern.host === B4).forEach((B9) => B9.resolvePromise(JQ)), G4.filter((B9) => B9.hostPattern.host !== B4)
      })
    }
  }), mZ === "tool-permission" && cB.createElement(JW9, {
    key: vB[0]?.toolUseID,
    onDone: () => c2(([R0, ...JQ]) => JQ),
    onReject: G9,
    toolUseConfirm: vB[0],
    toolUseContext: WJ(u1, u1, $1 ?? c9(), [], void 0, f),
    verbose: x
  }), mZ === "worker-permission" && L.workerPermissions.queue[0] && cB.createElement(sO7, {
    key: L.workerPermissions.queue[0].id,
    request: L.workerPermissions.queue[0],
    workerColor: void 0,
    onDone: () => {
      M((R0) => ({
        ...R0,
        workerPermissions: {
          ...R0.workerPermissions,
          queue: R0.workerPermissions.queue.slice(1)
        }
      }))
    },
    onApprove: (R0) => {
      let JQ = L.workerPermissions.queue[0];
      if (JQ) EmA?.sendPermissionResponseViaMailbox(JQ.workerName, {
        decision: "approved",
        resolvedBy: "leader",
        updatedInput: R0
      }, JQ.id, L.teamContext?.teamName)
    },
    onApproveForTeam: (R0) => {
      let JQ = L.workerPermissions.queue[0],
        WQ = L.teamContext?.teamName;
      if (JQ && WQ) {
        let S9 = R0.startsWith("/") ? `/${R0}/**` : `${R0}/**`,
          B4 = {
            type: "addRules",
            rules: [{
              toolName: JQ.toolName,
              ruleContent: S9
            }],
            behavior: "allow",
            destination: "session"
          };
        EmA?.sendPermissionResponseViaMailbox(JQ.workerName, {
          decision: "approved",
          resolvedBy: "leader",
          permissionUpdates: [B4]
        }, JQ.id, WQ), Cq9?.addTeamAllowedPath(WQ, R0, JQ.toolName, "team-lead");
        let G4 = Cq9?.readTeamFile(WQ);
        if (G4) {
          let B9 = eA({
              type: "team_permission_update",
              permissionUpdate: B4,
              directoryPath: R0,
              toolName: JQ.toolName
            }),
            a4 = 0;
          for (let o8 of G4.members) {
            if (o8.name === JQ.workerName) continue;
            if (o8.agentId === G4.leadAgentId) continue;
            rO7?.writeToMailbox(o8.name, {
              from: "team-lead",
              text: B9,
              timestamp: new Date().toISOString()
            }, WQ), a4++
          }
        }
      }
    },
    onDeny: (R0) => {
      let JQ = L.workerPermissions.queue[0];
      if (JQ) EmA?.sendPermissionResponseViaMailbox(JQ.workerName, {
        decision: "rejected",
        resolvedBy: "leader",
        feedback: R0
      }, JQ.id, L.teamContext?.teamName)
    }
  }), L.pendingWorkerRequest && cB.createElement(Uq9, {
    toolName: L.pendingWorkerRequest.toolName,
    description: L.pendingWorkerRequest.description
  }), L.pendingSandboxRequest && cB.createElement(Uq9, {
    toolName: "Network Access",
    description: `Waiting for leader to approve network access to ${L.pendingSandboxRequest.host}`
  }), mZ === "worker-sandbox-permission" && cB.createElement(Nx0, {
    key: L.workerSandboxPermissions.queue[0].requestId,
    hostPattern: {
      host: L.workerSandboxPermissions.queue[0].host,
      port: void 0
    },
    onUserResponse: (R0) => {
      let {
        allow: JQ,
        persistToSettings: WQ
      } = R0, S9 = L.workerSandboxPermissions.queue[0];
      if (!S9) return;
      let B4 = S9.host;
      if (EmA?.sendSandboxPermissionResponseViaMailbox(S9.workerName, S9.requestId, B4, JQ, L.teamContext?.teamName), WQ && JQ) {
        let G4 = {
          type: "addRules",
          rules: [{
            toolName: cI,
            ruleContent: `domain:${B4}`
          }],
          behavior: "allow",
          destination: "localSettings"
        };
        M((B9) => ({
          ...B9,
          toolPermissionContext: UJ(B9.toolPermissionContext, G4)
        })), Kk(G4), XB.refreshConfig()
      }
      M((G4) => ({
        ...G4,
        workerSandboxPermissions: {
          ...G4.workerSandboxPermissions,
          queue: G4.workerSandboxPermissions.queue.slice(1)
        }
      }))
    }
  }), mZ === "elicitation" && cB.createElement(VW9, {
    serverName: L.elicitation.queue[0].serverName,
    request: L.elicitation.queue[0].request,
    onResponse: (R0, JQ) => {
      let WQ = L.elicitation.queue[0];
      if (WQ) M((S9) => ({
        ...S9,
        elicitation: {
          queue: S9.elicitation.queue.slice(1)
        }
      })), WQ.respond({
        action: R0,
        content: JQ
      })
    },
    signal: L.elicitation.queue[0].signal
  }), mZ === "cost" && cB.createElement(kI9, {
    onDone: () => {
      XA(!1), C1(!0), S0((R0) => ({
        ...R0,
        hasAcknowledgedCostThreshold: !0
      })), l("tengu_cost_threshold_acknowledged", {})
    }
  }), mZ === "ide-onboarding" && cB.createElement(wr2, {
    onDone: () => FA(!1),
    installationStatus: BA
  }), DJ, mZ === "lsp-recommendation" && xA && cB.createElement(gU9, {
    pluginName: xA.pluginName,
    pluginDescription: xA.pluginDescription,
    fileExtension: xA.fileExtension,
    onResponse: mA
  }), !RB?.shouldHidePromptInput && !mZ && !pU && !H && cB.createElement(cB.Fragment, null, FM && cB.createElement(Hq9, {
    onRun: DH,
    onCancel: TK,
    reason: Eq9(FM)
  }), Ow.state !== "closed" ? cB.createElement($x0, {
    state: Ow.state,
    handleSelect: Ow.handleSelect,
    inputValue: z8,
    setInputValue: T6
  }) : cB.createElement($x0, {
    state: RK.state,
    handleSelect: RK.handleSelect,
    inputValue: z8,
    setInputValue: T6
  }), !1, !1, !1, cB.createElement(sV9, {
    debug: Q,
    ideSelection: wA,
    getToolUseContext: WJ,
    toolPermissionContext: j,
    setToolPermissionContext: f$,
    apiKeyStatus: uE,
    commands: L0,
    agents: u.activeAgents,
    isLoading: Q0,
    onExit: Eh,
    verbose: x,
    messages: u1,
    onAutoUpdaterResult: AB,
    autoUpdaterResult: nB,
    input: z8,
    onInputChange: T6,
    mode: i8,
    onModeChange: Q8,
    stashedPrompt: $G,
    setStashedPrompt: t7,
    submitCount: eB,
    onShowMessageSelector: zh,
    mcpClients: zA,
    pastedContents: w4,
    setPastedContents: Y6,
    vimMode: s1,
    setVimMode: p1,
    showBashesDialog: M0,
    setShowBashesDialog: gQ,
    showDiffDialog: _B,
    setShowDiffDialog: T2,
    tasksSelected: n2,
    setTasksSelected: Q4,
    diffSelected: G8,
    setDiffSelected: $Z,
    onForegroundTask: P3,
    onSubmit: jK,
    isSearchingHistory: S7,
    setIsSearchingHistory: FD,
    onDismissSideQuestion: () => {
      T0.current?.abort(), IJ(null), CG(!1)
    },
    isSideQuestionVisible: oJ !== null,
    helpOpen: aJ,
    setHelpOpen: OV
  }), cB.createElement(uF9, {
    onBackgroundSession: ED,
    isLoading: Q0
  })), !1), mZ === "message-selector" && cB.createElement(S19, {
    messages: u1,
    onPreRestore: jY,
    onRestoreCode: async (R0) => {
      await FW1((JQ) => {
        M((WQ) => ({
          ...WQ,
          fileHistory: JQ(WQ.fileHistory)
        }))
      }, R0.uuid)
    },
    onRestoreMessage: async (R0) => {
      let JQ = u1.indexOf(R0),
        WQ = u1.slice(0, JQ);
      setImmediate(async () => {
        if (!Tz()) await sI();
        IQ([...WQ]), uA(ux0()), M((B4) => ({
          ...B4,
          todos: {
            ...B4.todos,
            [Mw]: R0.todos ?? []
          },
          promptSuggestion: {
            text: null,
            promptId: null,
            shownAt: 0,
            acceptedAt: 0,
            generationRequestId: null
          }
        })), d9A(R0.todos ?? [], Mw);
        let S9 = xJ9(R0);
        if (S9 !== null) {
          let B4 = Q9(S9, "bash-input"),
            G4 = Q9(S9, mC);
          if (B4) T6(B4), Q8("bash");
          else if (G4) {
            let B9 = Q9(S9, "command-args") || "";
            T6(`${G4} ${B9}`), Q8("prompt")
          } else T6(S9), Q8("prompt")
        }
        if (Array.isArray(R0.message.content) && R0.message.content.some((B4) => B4.type === "image")) {
          let B4 = R0.message.content.filter((G4) => G4.type === "image");
          if (B4.length > 0) {
            let G4 = {};
            B4.forEach((B9, a4) => {
              if (B9.source.type === "base64") {
                let o8 = R0.imagePasteIds?.[a4] ?? a4 + 1;
                G4[o8] = {
                  id: o8,
                  type: "image",
                  content: B9.source.data,
                  mediaType: B9.source.media_type
                }
              }
            }), Y6(G4)
          }
        }
      })
    },
    onClose: () => oA(!1)
  })))
}
// @from(Ln 463092, Col 4)
cB
// @from(Ln 463092, Col 8)
UQ
// @from(Ln 463092, Col 12)
Cq9 = null
// @from(Ln 463093, Col 2)
EmA = null
// @from(Ln 463094, Col 2)
rO7 = null
// @from(Ln 463095, Col 2)
sO7 = null
// @from(Ln 463096, Col 2)
Uq9 = null
// @from(Ln 463097, Col 2)
tO7 = () => {}
// @from(Ln 463098, Col 2)
eO7 = () => {}
// @from(Ln 463099, Col 4)
mx0 = w(() => {
  fA();
  bI9();
  oK();
  HY();
  MkA();
  nBA();
  pC();
  C0();
  T1();
  A0();
  hr();
  gI9();
  kH1();
  pI9();
  XW9();
  FW9();
  tV9();
  AF9();
  QF9();
  yG();
  wc();
  dO0();
  OS();
  nz();
  LR();
  ZF9();
  Vm();
  JF9();
  XF9();
  Bc();
  NX();
  DF9();
  HF9();
  $F9();
  dW();
  LS0();
  GQ();
  Z0();
  tQ();
  Xd();
  cD();
  sBA();
  Y_();
  yJ();
  CF9();
  Ax0();
  wF9();
  WzA();
  ks();
  MF9();
  bz0();
  wT0();
  _F9();
  TF9();
  Kx0();
  agA();
  XkA();
  QE0();
  BE0();
  KjA();
  Gt();
  SF9();
  az();
  L4A();
  _kA();
  hB();
  Dd();
  UF();
  d4();
  eHA();
  bH1();
  oN();
  B2A();
  xF9();
  yF9();
  bF9();
  TX();
  gF9();
  vT0();
  DE1();
  VO();
  mF9();
  TK1();
  cF9();
  P6A();
  hH1();
  CL0();
  AE0();
  iZ();
  Hp();
  iF9();
  aF9();
  sF9();
  AH9();
  BH9();
  XH9();
  DH9();
  HH9();
  $H9();
  NJ();
  UH9();
  qH9();
  NU9();
  kR0();
  OU9();
  RU9();
  fU9();
  uU9();
  dU9();
  iU9();
  aU9();
  ED1();
  rU9();
  tU9();
  Aq9();
  Bq9();
  Yq9();
  Iq9();
  Kq9();
  Fq9();
  zq9();
  $q9();
  cB = c(QA(), 1), UQ = c(QA(), 1)
})
// @from(Ln 463225, Col 0)
function qq9({
  isFocused: A,
  isSelected: Q,
  children: B
}) {
  return zmA.default.createElement(T, {
    gap: 1,
    paddingLeft: A ? 0 : 2
  }, A && zmA.default.createElement(C, {
    color: "suggestion"
  }, tA.pointer), zmA.default.createElement(C, {
    color: Q ? "success" : A ? "suggestion" : void 0
  }, B), Q && zmA.default.createElement(C, {
    color: "success"
  }, tA.tick))
}
// @from(Ln 463241, Col 4)
zmA
// @from(Ln 463242, Col 4)
Nq9 = w(() => {
  fA();
  B2();
  zmA = c(QA(), 1)
})
// @from(Ln 463247, Col 4)
sC1
// @from(Ln 463248, Col 4)
wq9 = w(() => {
  sC1 = class sC1 extends Map {
    first;
    last;
    constructor(A) {
      let Q = [],
        B, G, Z, Y = 0;
      for (let J of A) {
        let X = {
          ...J,
          previous: Z,
          next: void 0,
          index: Y
        };
        if (Z) Z.next = X;
        B ||= X, G = X, Q.push([J.value, X]), Y++, Z = X
      }
      super(Q);
      this.first = B, this.last = G
    }
  }
})
// @from(Ln 463273, Col 4)
KM
// @from(Ln 463273, Col 8)
QM7 = (A, Q) => {
    switch (Q.type) {
      case "focus-next-option": {
        if (!A.focusedValue) return A;
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
        let Y = Math.min(A.optionMap.size, A.visibleToIndex + 1),
          J = Y - A.visibleOptionCount;
        return {
          ...A,
          focusedValue: G.value,
          visibleFromIndex: J,
          visibleToIndex: Y
        }
      }
      case "focus-previous-option": {
        if (!A.focusedValue) return A;
        let B = A.optionMap.get(A.focusedValue);
        if (!B) return A;
        let G = B.previous || A.optionMap.last;
        if (!G) return A;
        if (!B.previous && G === A.optionMap.last) {
          let X = A.optionMap.size,
            I = Math.max(0, X - A.visibleOptionCount);
          return {
            ...A,
            focusedValue: G.value,
            visibleFromIndex: I,
            visibleToIndex: X
          }
        }
        if (!(G.index <= A.visibleFromIndex)) return {
          ...A,
          focusedValue: G.value
        };
        let Y = Math.max(0, A.visibleFromIndex - 1),
          J = Y + A.visibleOptionCount;
        return {
          ...A,
          focusedValue: G.value,
          visibleFromIndex: Y,
          visibleToIndex: J
        }
      }
      case "toggle-focused-option": {
        if (!A.focusedValue) return A;
        if (A.value.includes(A.focusedValue)) {
          let B = new Set(A.value);
          return B.delete(A.focusedValue), {
            ...A,
            previousValue: A.value,
            value: [...B]
          }
        }
        return {
          ...A,
          previousValue: A.value,
          value: [...A.value, A.focusedValue]
        }
      }
      case "reset":
        return Q.state
    }
  }
// @from(Ln 463349, Col 2)
Oq9 = ({
    visibleOptionCount: A,
    defaultValue: Q,
    options: B
  }) => {
    let G = typeof A === "number" ? Math.min(A, B.length) : B.length,
      Z = new sC1(B),
      Y = Q ?? [];
    return {
      optionMap: Z,
      visibleOptionCount: G,
      focusedValue: Z.first?.value,
      visibleFromIndex: 0,
      visibleToIndex: G,
      previousValue: Y,
      value: Y
    }
  }
// @from(Ln 463367, Col 2)
Mq9 = ({
    visibleOptionCount: A = 5,
    options: Q,
    defaultValue: B,
    onChange: G,
    onSubmit: Z
  }) => {
    let [Y, J] = KM.useReducer(QM7, {
      visibleOptionCount: A,
      defaultValue: B,
      options: Q
    }, Oq9), [X, I] = KM.useState(Q);
    if (Q !== X && !Lq9(Q, X)) J({
      type: "reset",
      state: Oq9({
        visibleOptionCount: A,
        defaultValue: B,
        options: Q
      })
    }), I(Q);
    let D = KM.useCallback(() => {
        J({
          type: "focus-next-option"
        })
      }, []),
      W = KM.useCallback(() => {
        J({
          type: "focus-previous-option"
        })
      }, []),
      K = KM.useCallback(() => {
        J({
          type: "toggle-focused-option"
        })
      }, []),
      V = KM.useCallback(() => {
        Z?.(Y.value)
      }, [Y.value, Z]),
      F = KM.useMemo(() => {
        return Q.map((H, E) => ({
          ...H,
          index: E
        })).slice(Y.visibleFromIndex, Y.visibleToIndex)
      }, [Q, Y.visibleFromIndex, Y.visibleToIndex]);
    return KM.useEffect(() => {
      if (!Lq9(Y.previousValue, Y.value)) G?.(Y.value)
    }, [Y.previousValue, Y.value, Q, G]), {
      focusedValue: Y.focusedValue,
      visibleFromIndex: Y.visibleFromIndex,
      visibleToIndex: Y.visibleToIndex,
      value: Y.value,
      visibleOptions: F,
      focusNextOption: D,
      focusPreviousOption: W,
      toggleFocusedOption: K,
      submit: V
    }
  }
// @from(Ln 463425, Col 4)
Rq9 = w(() => {
  wq9();
  KM = c(QA(), 1)
})
// @from(Ln 463429, Col 4)
_q9 = ({
  isDisabled: A = !1,
  state: Q
}) => {
  J0((B, G) => {
    if (G.downArrow || G.ctrl && B === "n" || !G.ctrl && !G.shift && B === "j") Q.focusNextOption();
    if (G.upArrow || G.ctrl && B === "p" || !G.ctrl && !G.shift && B === "k") Q.focusPreviousOption();
    if (B === " ") Q.toggleFocusedOption();
    if (G.return) Q.submit()
  }, {
    isActive: !A
  })
}
// @from(Ln 463442, Col 4)
jq9 = w(() => {
  fA()
})
// @from(Ln 463446, Col 0)
function tC1({
  isDisabled: A = !1,
  visibleOptionCount: Q = 5,
  highlightText: B,
  options: G,
  defaultValue: Z,
  onChange: Y,
  onSubmit: J
}) {
  let X = Mq9({
    visibleOptionCount: Q,
    options: G,
    defaultValue: Z,
    onChange: Y,
    onSubmit: J
  });
  return _q9({
    isDisabled: A,
    state: X
  }), k$A.default.createElement(T, {
    flexDirection: "column"
  }, X.visibleOptions.map((I) => {
    let D = I.label;
    if (B && I.label.includes(B)) {
      let W = I.label.indexOf(B);
      D = k$A.default.createElement(k$A.default.Fragment, null, I.label.slice(0, W), k$A.default.createElement(C, {
        bold: !0
      }, B), I.label.slice(W + B.length))
    }
    return k$A.default.createElement(qq9, {
      key: I.value,
      isFocused: !A && X.focusedValue === I.value,
      isSelected: X.value.includes(I.value)
    }, D)
  }))
}
// @from(Ln 463482, Col 4)
k$A
// @from(Ln 463483, Col 4)
dx0 = w(() => {
  fA();
  Nq9();
  Rq9();
  jq9();
  k$A = c(QA(), 1)
})
// @from(Ln 463491, Col 0)
function Tq9({
  servers: A,
  scope: Q,
  onDone: B
}) {
  let G = Object.keys(A),
    [Z, Y] = u8A.useState({});
  u8A.useEffect(() => {
    it().then(({
      servers: V
    }) => Y(V))
  }, []);
  let J = G.filter((V) => Z[V] !== void 0);

  function X(V) {
    let F = 0;
    for (let H of V) {
      let E = A[H];
      if (E) {
        let z = H;
        if (Z[z] !== void 0) {
          let $ = 1;
          while (Z[`${H}_${$}`] !== void 0) $++;
          z = `${H}_${$}`
        }
        uf(z, E, Q), F++
      }
    }
    W(F)
  }
  let I = MQ(),
    [D] = oB(),
    W = u8A.useCallback((V) => {
      if (V > 0) J9(`
${sQ("success",D)(`Successfully imported ${V} MCP server${V!==1?"s":""} to ${Q} config.`)}
`);
      else J9(`
No servers were imported.`);
      B(), w3()
    }, [D, Q, B]),
    K = u8A.useCallback(() => {
      W(0)
    }, [W]);
  return H2("confirm:no", K, {
    context: "Confirmation"
  }), mU.default.createElement(mU.default.Fragment, null, mU.default.createElement(T, {
    flexDirection: "column",
    gap: 1,
    padding: 1,
    borderStyle: "round",
    borderColor: "success"
  }, mU.default.createElement(C, {
    bold: !0,
    color: "success"
  }, "Import MCP Servers from Claude Desktop"), mU.default.createElement(C, null, "Found ", G.length, " MCP server", G.length !== 1 ? "s" : "", " in Claude Desktop."), J.length > 0 && mU.default.createElement(C, {
    color: "warning"
  }, "Note: Some servers already exist with the same name. If selected, they will be imported with a numbered suffix."), mU.default.createElement(C, null, "Please select the servers you want to import:"), mU.default.createElement(tC1, {
    options: G.map((V) => ({
      label: `${V}${J.includes(V)?" (already exists)":""}`,
      value: V
    })),
    defaultValue: G.filter((V) => !J.includes(V)),
    onSubmit: X
  })), mU.default.createElement(T, {
    marginLeft: 3
  }, mU.default.createElement(C, {
    dimColor: !0
  }, I.pending ? mU.default.createElement(mU.default.Fragment, null, "Press ", I.keyName, " again to exit") : mU.default.createElement(mU.default.Fragment, null, "Space to select · Enter to confirm · Esc to cancel"))))
}
// @from(Ln 463560, Col 4)
mU
// @from(Ln 463560, Col 8)
u8A
// @from(Ln 463561, Col 4)
Pq9 = w(() => {
  fA();
  dx0();
  c6();
  E9();
  G$();
  yJ();
  mU = c(QA(), 1), u8A = c(QA(), 1)
})
// @from(Ln 463573, Col 0)
function BM7() {
  let A = $Q();
  if (!tL1.includes(A)) throw Error(`Unsupported platform: ${A} - Claude Desktop integration only works on macOS and WSL.`);
  if (A === "macos") return cx0.join(Sq9.homedir(), "Library", "Application Support", "Claude", "claude_desktop_config.json");
  let Q = process.env.USERPROFILE ? process.env.USERPROFILE.replace(/\\/g, "/") : null;
  if (Q) {
    let G = `/mnt/c${Q.replace(/^[A-Z]:/,"")}/AppData/Roaming/Claude/claude_desktop_config.json`;
    if (vA().existsSync(G)) return G
  }
  try {
    if (vA().existsSync("/mnt/c/Users")) {
      let G = vA().readdirSync("/mnt/c/Users");
      for (let Z of G) {
        if (Z.name === "Public" || Z.name === "Default" || Z.name === "Default User" || Z.name === "All Users") continue;
        let Y = cx0.join("/mnt/c/Users", Z.name, "AppData", "Roaming", "Claude", "claude_desktop_config.json");
        if (vA().existsSync(Y)) return Y
      }
    }
  } catch (B) {
    e(B instanceof Error ? B : Error(String(B)))
  }
  throw Error("Could not find Claude Desktop config file in Windows. Make sure Claude Desktop is installed on Windows.")
}
// @from(Ln 463597, Col 0)
function xq9() {
  if (!tL1.includes($Q())) throw Error("Unsupported platform - Claude Desktop integration only works on macOS and WSL.");
  try {
    let A = BM7();
    if (!vA().existsSync(A)) return {};
    let Q = vA().readFileSync(A, {
        encoding: "utf8"
      }),
      B = c5(Q);
    if (!B || typeof B !== "object") return {};
    let G = B.mcpServers;
    if (!G || typeof G !== "object") return {};
    let Z = {};
    for (let [Y, J] of Object.entries(G)) {
      if (!J || typeof J !== "object") continue;
      let X = YI0.safeParse(J);
      if (X.success) Z[Y] = X.data
    }
    return Z
  } catch (A) {
    return e(A instanceof Error ? A : Error(String(A))), {}
  }
}
// @from(Ln 463620, Col 4)
yq9 = w(() => {
  vI();
  v1();
  D4A();
  c3();
  DQ()
})
// @from(Ln 463628, Col 0)
function eC1({
  customApiKeyTruncated: A,
  onDone: Q
}) {
  function B(Z) {
    switch (Z) {
      case "yes": {
        S0((Y) => ({
          ...Y,
          customApiKeyResponses: {
            ...Y.customApiKeyResponses,
            approved: [...Y.customApiKeyResponses?.approved ?? [], A]
          }
        })), Q();
        break
      }
      case "no": {
        S0((Y) => ({
          ...Y,
          customApiKeyResponses: {
            ...Y.customApiKeyResponses,
            rejected: [...Y.customApiKeyResponses?.rejected ?? [], A]
          }
        })), Q();
        break
      }
    }
  }
  let G = MQ();
  return YH.default.createElement(YH.default.Fragment, null, YH.default.createElement(T, {
    flexDirection: "column",
    gap: 1,
    padding: 1,
    borderStyle: "round",
    borderColor: "warning"
  }, YH.default.createElement(C, {
    bold: !0,
    color: "warning"
  }, "Detected a custom API key in your environment"), YH.default.createElement(C, null, YH.default.createElement(C, {
    bold: !0
  }, "ANTHROPIC_API_KEY"), YH.default.createElement(C, null, ": sk-ant-...", A)), YH.default.createElement(C, null, "Do you want to use this API key?"), YH.default.createElement(k0, {
    defaultValue: "no",
    defaultFocusValue: "no",
    options: [{
      label: "Yes",
      value: "yes"
    }, {
      label: YH.default.createElement(C, null, "No (", YH.default.createElement(C, {
        bold: !0
      }, "recommended"), ")"),
      value: "no"
    }],
    onChange: (Z) => B(Z),
    onCancel: () => B("no")
  })), YH.default.createElement(T, {
    marginLeft: 3
  }, YH.default.createElement(C, {
    dimColor: !0
  }, G.pending ? YH.default.createElement(YH.default.Fragment, null, "Press ", G.keyName, " again to exit") : YH.default.createElement(YH.default.Fragment, null, "Enter to confirm ", tA.dot, " Esc to cancel"))))
}
// @from(Ln 463688, Col 4)
YH
// @from(Ln 463689, Col 4)
px0 = w(() => {
  fA();
  GQ();
  u8();
  E9();
  B2();
  YH = c(QA(), 1)
})
// @from(Ln 463698, Col 0)
function vq9(A, Q) {
  let [B, G] = AU1.useState(!1);
  return AU1.useEffect(() => {
    G(!1);
    let Z = setTimeout(() => {
      G(!0)
    }, A);
    return () => clearTimeout(Z)
  }, [A, Q]), B
}
// @from(Ln 463708, Col 4)
AU1
// @from(Ln 463709, Col 4)
kq9 = w(() => {
  AU1 = c(QA(), 1)
})
// @from(Ln 463712, Col 0)
async function GM7() {
  try {
    let A = ["https://api.anthropic.com/api/hello", "https://platform.claude.com/v1/oauth/hello"],
      Q = async (Z) => {
        try {
          let Y = await xQ.get(Z, {
            headers: {
              "User-Agent": gn()
            }
          });
          if (Y.status !== 200) return {
            success: !1,
            error: `Failed to connect to ${new URL(Z).hostname}: Status ${Y.status}`
          };
          return {
            success: !0
          }
        } catch (Y) {
          return {
            success: !1,
            error: `Failed to connect to ${new URL(Z).hostname}: ${Y instanceof Error?Y.code||Y.message:String(Y)}`
          }
        }
      }, G = (await Promise.all(A.map(Q))).find((Z) => !Z.success);
    if (G) l("tengu_preflight_check_failed", {
      isConnectivityError: !1,
      hasErrorMessage: !!G.error
    });
    return G || {
      success: !0
    }
  } catch (A) {
    return e(A), l("tengu_preflight_check_failed", {
      isConnectivityError: !0
    }), {
      success: !1,
      error: `Connectivity check error: ${A instanceof Error?A.code||A.message:String(A)}`
    }
  }
}
// @from(Ln 463753, Col 0)
function bq9({
  onSuccess: A
}) {
  let [Q, B] = b$A.useState(null), [G, Z] = b$A.useState(!0), Y = vq9(1000) && G;
  return b$A.useEffect(() => {
    async function J() {
      let X = await GM7();
      B(X), Z(!1)
    }
    J()
  }, []), b$A.useEffect(() => {
    if (Q?.success) A();
    else if (Q && !Q.success) {
      let J = setTimeout(() => process.exit(1), 100);
      return () => clearTimeout(J)
    }
  }, [Q, A]), gj.default.createElement(T, {
    flexDirection: "column",
    gap: 1,
    paddingLeft: 1
  }, G && Y ? gj.default.createElement(T, {
    paddingLeft: 1
  }, gj.default.createElement(W9, null), gj.default.createElement(C, null, "Checking connectivity...")) : !Q?.success && !G && gj.default.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, gj.default.createElement(C, {
    color: "error"
  }, "Unable to connect to Anthropic services"), gj.default.createElement(C, {
    color: "error"
  }, Q?.error), gj.default.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, gj.default.createElement(C, null, "Please check your internet connection and network settings."), gj.default.createElement(C, null, "Note: Claude Code might not be available in your country. Check supported countries at", " ", gj.default.createElement(C, {
    color: "suggestion"
  }, "https://anthropic.com/supported-countries")))))
}
// @from(Ln 463789, Col 4)
gj
// @from(Ln 463789, Col 8)
b$A
// @from(Ln 463790, Col 4)
fq9 = w(() => {
  fA();
  qz();
  v1();
  yG();
  kq9();
  Z0();
  j5();
  gj = c(QA(), 1), b$A = c(QA(), 1)
})
// @from(Ln 463801, Col 0)
function BU1() {
  let [A] = oB(), Q = "Welcome to Claude Code";
  if (l0.terminal === "Apple_Terminal") return o0.default.createElement(ZM7, {
    theme: A,
    welcomeMessage: "Welcome to Claude Code"
  });
  if (["light", "light-daltonized", "light-ansi"].includes(A)) return o0.default.createElement(T, {
    width: QU1
  }, o0.default.createElement(C, null, o0.default.createElement(C, null, o0.default.createElement(C, {
    color: "claude"
  }, "Welcome to Claude Code", " "), o0.default.createElement(C, {
    dimColor: !0
  }, "v", {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.7",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-01-13T22:55:21Z"
  }.VERSION, " ")), o0.default.createElement(C, null, "…………………………………………………………………………………………………………………………………………………………"), o0.default.createElement(C, null, "                                                          "), o0.default.createElement(C, null, "                                                          "), o0.default.createElement(C, null, "                                                          "), o0.default.createElement(C, null, "            ░░░░░░                                        "), o0.default.createElement(C, null, "    ░░░   ░░░░░░░░░░                                      "), o0.default.createElement(C, null, "   ░░░░░░░░░░░░░░░░░░░                                    "), o0.default.createElement(C, null, "                                                          "), o0.default.createElement(C, null, o0.default.createElement(C, {
    dimColor: !0
  }, "                           ░░░░"), o0.default.createElement(C, null, "                     ██    ")), o0.default.createElement(C, null, o0.default.createElement(C, {
    dimColor: !0
  }, "                         ░░░░░░░░░░"), o0.default.createElement(C, null, "               ██▒▒██  ")), o0.default.createElement(C, null, "                                            ▒▒      ██   ▒"), o0.default.createElement(C, null, "      ", o0.default.createElement(C, {
    color: "clawd_body"
  }, " █████████ "), "                         ▒▒░░▒▒      ▒ ▒▒"), o0.default.createElement(C, null, "      ", o0.default.createElement(C, {
    color: "clawd_body",
    backgroundColor: "clawd_background"
  }, "██▄█████▄██"), "                           ▒▒         ▒▒ "), o0.default.createElement(C, null, "      ", o0.default.createElement(C, {
    color: "clawd_body"
  }, " █████████ "), "                          ░          ▒   "), o0.default.createElement(C, null, "…………………", o0.default.createElement(C, {
    color: "clawd_body"
  }, "█ █   █ █"), "……………………………………………………………………░…………………………▒…………")));
  return o0.default.createElement(T, {
    width: QU1
  }, o0.default.createElement(C, null, o0.default.createElement(C, null, o0.default.createElement(C, {
    color: "claude"
  }, "Welcome to Claude Code", " "), o0.default.createElement(C, {
    dimColor: !0
  }, "v", {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.7",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-01-13T22:55:21Z"
  }.VERSION, " ")), o0.default.createElement(C, null, "…………………………………………………………………………………………………………………………………………………………"), o0.default.createElement(C, null, "                                                          "), o0.default.createElement(C, null, "     *                                       █████▓▓░     "), o0.default.createElement(C, null, "                                 *         ███▓░     ░░   "), o0.default.createElement(C, null, "            ░░░░░░                        ███▓░           "), o0.default.createElement(C, null, "    ░░░   ░░░░░░░░░░                      ███▓░           "), o0.default.createElement(C, null, o0.default.createElement(C, null, "   ░░░░░░░░░░░░░░░░░░░    "), o0.default.createElement(C, {
    bold: !0
  }, "*"), o0.default.createElement(C, null, "                ██▓░░      ▓   ")), o0.default.createElement(C, null, "                                             ░▓▓███▓▓░    "), o0.default.createElement(C, {
    dimColor: !0
  }, " *                                 ░░░░                   "), o0.default.createElement(C, {
    dimColor: !0
  }, "                                 ░░░░░░░░                 "), o0.default.createElement(C, {
    dimColor: !0
  }, "                               ░░░░░░░░░░░░░░░░           "), o0.default.createElement(C, null, "      ", o0.default.createElement(C, {
    color: "clawd_body"
  }, " █████████ "), "                                       ", o0.default.createElement(C, {
    dimColor: !0
  }, "*"), o0.default.createElement(C, null, " ")), o0.default.createElement(C, null, "      ", o0.default.createElement(C, {
    color: "clawd_body"
  }, "██▄█████▄██"), o0.default.createElement(C, null, "                        "), o0.default.createElement(C, {
    bold: !0
  }, "*"), o0.default.createElement(C, null, "                ")), o0.default.createElement(C, null, "      ", o0.default.createElement(C, {
    color: "clawd_body"
  }, " █████████ "), "     *                                   "), o0.default.createElement(C, null, "…………………", o0.default.createElement(C, {
    color: "clawd_body"
  }, "█ █   █ █"), "………………………………………………………………………………………………………………")))
}
// @from(Ln 463870, Col 0)
function ZM7({
  theme: A,
  welcomeMessage: Q
}) {
  if (["light", "light-daltonized", "light-ansi"].includes(A)) return o0.default.createElement(T, {
    width: QU1
  }, o0.default.createElement(C, null, o0.default.createElement(C, null, o0.default.createElement(C, {
    color: "claude"
  }, Q, " "), o0.default.createElement(C, {
    dimColor: !0
  }, "v", {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.7",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-01-13T22:55:21Z"
  }.VERSION, " ")), o0.default.createElement(C, null, "…………………………………………………………………………………………………………………………………………………………"), o0.default.createElement(C, null, "                                                          "), o0.default.createElement(C, null, "                                                          "), o0.default.createElement(C, null, "                                                          "), o0.default.createElement(C, null, "            ░░░░░░                                        "), o0.default.createElement(C, null, "    ░░░   ░░░░░░░░░░                                      "), o0.default.createElement(C, null, "   ░░░░░░░░░░░░░░░░░░░                                    "), o0.default.createElement(C, null, "                                                          "), o0.default.createElement(C, null, o0.default.createElement(C, {
    dimColor: !0
  }, "                           ░░░░"), o0.default.createElement(C, null, "                     ██    ")), o0.default.createElement(C, null, o0.default.createElement(C, {
    dimColor: !0
  }, "                         ░░░░░░░░░░"), o0.default.createElement(C, null, "               ██▒▒██  ")), o0.default.createElement(C, null, "                                            ▒▒      ██   ▒"), o0.default.createElement(C, null, "                                          ▒▒░░▒▒      ▒ ▒▒"), o0.default.createElement(C, null, "      ", o0.default.createElement(C, {
    color: "clawd_body"
  }, "▗"), o0.default.createElement(C, {
    color: "clawd_background",
    backgroundColor: "clawd_body"
  }, " ", "▗", "     ", "▖", " "), o0.default.createElement(C, {
    color: "clawd_body"
  }, "▖"), "                           ▒▒         ▒▒ "), o0.default.createElement(C, null, "       ", o0.default.createElement(C, {
    backgroundColor: "clawd_body"
  }, " ".repeat(9)), "                           ░          ▒   "), o0.default.createElement(C, null, "…………………", o0.default.createElement(C, {
    backgroundColor: "clawd_body"
  }, " "), o0.default.createElement(C, null, " "), o0.default.createElement(C, {
    backgroundColor: "clawd_body"
  }, " "), o0.default.createElement(C, null, "   "), o0.default.createElement(C, {
    backgroundColor: "clawd_body"
  }, " "), o0.default.createElement(C, null, " "), o0.default.createElement(C, {
    backgroundColor: "clawd_body"
  }, " "), "……………………………………………………………………░…………………………▒…………")));
  return o0.default.createElement(T, {
    width: QU1
  }, o0.default.createElement(C, null, o0.default.createElement(C, null, o0.default.createElement(C, {
    color: "claude"
  }, Q, " "), o0.default.createElement(C, {
    dimColor: !0
  }, "v", {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.7",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-01-13T22:55:21Z"
  }.VERSION, " ")), o0.default.createElement(C, null, "…………………………………………………………………………………………………………………………………………………………"), o0.default.createElement(C, null, "                                                          "), o0.default.createElement(C, null, "     *                                       █████▓▓░     "), o0.default.createElement(C, null, "                                 *         ███▓░     ░░   "), o0.default.createElement(C, null, "            ░░░░░░                        ███▓░           "), o0.default.createElement(C, null, "    ░░░   ░░░░░░░░░░                      ███▓░           "), o0.default.createElement(C, null, o0.default.createElement(C, null, "   ░░░░░░░░░░░░░░░░░░░    "), o0.default.createElement(C, {
    bold: !0
  }, "*"), o0.default.createElement(C, null, "                ██▓░░      ▓   ")), o0.default.createElement(C, null, "                                             ░▓▓███▓▓░    "), o0.default.createElement(C, {
    dimColor: !0
  }, " *                                 ░░░░                   "), o0.default.createElement(C, {
    dimColor: !0
  }, "                                 ░░░░░░░░                 "), o0.default.createElement(C, {
    dimColor: !0
  }, "                               ░░░░░░░░░░░░░░░░           "), o0.default.createElement(C, null, "                                                      ", o0.default.createElement(C, {
    dimColor: !0
  }, "*"), o0.default.createElement(C, null, " ")), o0.default.createElement(C, null, "        ", o0.default.createElement(C, {
    color: "clawd_body"
  }, "▗"), o0.default.createElement(C, {
    color: "clawd_background",
    backgroundColor: "clawd_body"
  }, " ", "▗", "     ", "▖", " "), o0.default.createElement(C, {
    color: "clawd_body"
  }, "▖"), o0.default.createElement(C, null, "                       "), o0.default.createElement(C, {
    bold: !0
  }, "*"), o0.default.createElement(C, null, "                ")), o0.default.createElement(C, null, "        ", o0.default.createElement(C, {
    backgroundColor: "clawd_body"
  }, " ".repeat(9)), "      *                                   "), o0.default.createElement(C, null, "…………………", o0.default.createElement(C, {
    backgroundColor: "clawd_body"
  }, " "), o0.default.createElement(C, null, " "), o0.default.createElement(C, {
    backgroundColor: "clawd_body"
  }, " "), o0.default.createElement(C, null, "   "), o0.default.createElement(C, {
    backgroundColor: "clawd_body"
  }, " "), o0.default.createElement(C, null, " "), o0.default.createElement(C, {
    backgroundColor: "clawd_body"
  }, " "), "………………………………………………………………………………………………………………")))
}
// @from(Ln 463953, Col 4)
o0
// @from(Ln 463953, Col 8)
QU1 = 58
// @from(Ln 463954, Col 4)
lx0 = w(() => {
  fA();
  p3();
  o0 = c(QA(), 1)
})
// @from(Ln 463960, Col 0)
function hq9({
  onDone: A
}) {
  let [Q, B] = f$A.useState(0), G = iq(), [Z, Y] = oB();
  f$A.useEffect(() => {
    l("tengu_began_setup", {
      oauthEnabled: G
    })
  }, [G]);

  function J() {
    if (Q < F.length - 1) {
      let H = Q + 1;
      B(H), l("tengu_onboarding_step", {
        oauthEnabled: G,
        stepId: F[H]?.id
      })
    } else A()
  }

  function X(H) {
    Y(H), J()
  }
  let I = MQ();
  J0(async (H, E) => {
    let z = F[Q];
    if (E.return && z && z.id === "security")
      if (Q === F.length - 1) {
        A();
        return
      } else J();
    else if (E.escape && z?.id === "terminal-setup") J()
  });
  let D = N5.default.createElement(_zA, {
      initialTheme: Z,
      onThemeSelect: X,
      showIntroText: !0,
      helpText: "To change this later, run /theme",
      hideEscToCancel: !0,
      skipExitHandling: !0
    }),
    W = N5.default.createElement(T, {
      flexDirection: "column",
      gap: 1,
      paddingLeft: 1
    }, N5.default.createElement(C, {
      bold: !0
    }, "Security notes:"), N5.default.createElement(T, {
      flexDirection: "column",
      width: 70
    }, N5.default.createElement(WjA, null, N5.default.createElement(WjA.Item, null, N5.default.createElement(C, null, "Claude can make mistakes"), N5.default.createElement(C, {
      dimColor: !0,
      wrap: "wrap"
    }, "You should always review Claude's responses, especially when", N5.default.createElement(fD, null), "running code.", N5.default.createElement(fD, null))), N5.default.createElement(WjA.Item, null, N5.default.createElement(C, null, "Due to prompt injection risks, only use it with code you trust"), N5.default.createElement(C, {
      dimColor: !0,
      wrap: "wrap"
    }, "For more details see:", N5.default.createElement(fD, null), N5.default.createElement(i2, {
      url: "https://code.claude.com/docs/en/security"
    }))))), N5.default.createElement(vzA, null)),
    K = N5.default.createElement(bq9, {
      onSuccess: J
    }),
    V = f$A.useMemo(() => {
      if (!process.env.ANTHROPIC_API_KEY) return "";
      let H = TL(process.env.ANTHROPIC_API_KEY);
      if (iA1(H) === "new") return H
    }, []),
    F = [];
  if (G) F.push({
    id: "preflight",
    component: K
  });
  if (F.push({
      id: "theme",
      component: D
    }), G) F.push({
    id: "oauth",
    component: N5.default.createElement(_s, {
      onDone: J
    })
  });
  if (V) F.push({
    id: "api-key",
    component: N5.default.createElement(eC1, {
      customApiKeyTruncated: V,
      onDone: J
    })
  });
  if (F.push({
      id: "security",
      component: W
    }), EjA()) F.push({
    id: "terminal-setup",
    component: N5.default.createElement(T, {
      flexDirection: "column",
      gap: 1,
      paddingLeft: 1
    }, N5.default.createElement(C, {
      bold: !0
    }, "Use Claude Code's terminal setup?"), N5.default.createElement(T, {
      flexDirection: "column",
      width: 70,
      gap: 1
    }, N5.default.createElement(C, null, "For the optimal coding experience, enable the recommended settings", N5.default.createElement(fD, null), "for your terminal:", " ", l0.terminal === "Apple_Terminal" ? "Option+Enter for newlines and visual bell" : "Shift+Enter for newlines"), N5.default.createElement(k0, {
      options: [{
        label: "Yes, use recommended settings",
        value: "install"
      }, {
        label: "No, maybe later with /terminal-setup",
        value: "no"
      }],
      onChange: (H) => {
        if (H === "install") uB0(Z).catch(() => {}).finally(J);
        else J()
      },
      onCancel: () => J()
    }), N5.default.createElement(C, {
      dimColor: !0
    }, I.pending ? N5.default.createElement(N5.default.Fragment, null, "Press ", I.keyName, " again to exit") : N5.default.createElement(N5.default.Fragment, null, "Enter to confirm · Esc to skip"))))
  });
  return N5.default.createElement(T, {
    flexDirection: "column"
  }, N5.default.createElement(ha, {
    items: [N5.default.createElement(BU1, {
      key: "welcome"
    })]
  }, (H) => H), N5.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, F[Q]?.component, I.pending && N5.default.createElement(T, {
    padding: 1
  }, N5.default.createElement(C, {
    dimColor: !0
  }, "Press ", I.keyName, " again to exit"))))
}
// @from(Ln 464095, Col 4)
N5
// @from(Ln 464095, Col 8)
f$A
// @from(Ln 464096, Col 4)
gq9 = w(() => {
  fA();
  GQ();
  gOA();
  vB0();
  E9();
  RkA();
  px0();
  Q2();
  fA();
  _E1();
  fq9();
  NE1();
  Z0();
  p3();
  W8();
  eBA();
  lx0();
  N5 = c(QA(), 1), f$A = c(QA(), 1)
})
// @from(Ln 464120, Col 0)
function nx0(A) {
  let Q = dt();
  if (A === Q.HOME) return "home";
  if (A === Q.DESKTOP || A.startsWith(Q.DESKTOP + ix0)) return "desktop";
  if (A === Q.DOCUMENTS || A.startsWith(Q.DOCUMENTS + ix0)) return "documents";
  if (A === Q.DOWNLOADS || A.startsWith(Q.DOWNLOADS + ix0)) return "downloads";
  return "other"
}
// @from(Ln 464129, Col 0)
function uq9(A) {
  if (A === null || A.disableAllHooks) return !1;
  if (A.statusLine) return !0;
  if (A.fileSuggestion) return !0;
  if (!A.hooks) return !1;
  for (let Q of Object.values(A.hooks))
    if (Q.length > 0) return !0;
  return !1
}
// @from(Ln 464139, Col 0)
function iq9() {
  let A = [],
    Q = dB("projectSettings");
  if (uq9(Q)) A.push(".claude/settings.json");
  let B = dB("localSettings");
  if (uq9(B)) A.push(".claude/settings.local.json");
  return A
}
// @from(Ln 464148, Col 0)
function mq9(A) {
  return A.some((Q) => Q.ruleBehavior === "allow" && (Q.ruleValue.toolName === X9 || Q.ruleValue.toolName.startsWith(X9 + "(")))
}
// @from(Ln 464152, Col 0)
function nq9() {
  let A = [],
    Q = C01("projectSettings");
  if (mq9(Q)) A.push(".claude/settings.json");
  let B = C01("localSettings");
  if (mq9(B)) A.push(".claude/settings.local.json");
  return A
}
// @from(Ln 464161, Col 0)
function $mA(A, Q) {
  if (A.length === 0) return "";
  let B = Q === 0 ? void 0 : Q;
  if (!B || A.length <= B) {
    if (A.length === 1) return A[0];
    if (A.length === 2) return `${A[0]} and ${A[1]}`;
    let Y = A[A.length - 1];
    return `${A.slice(0,-1).join(", ")}, and ${Y}`
  }
  let G = A.slice(0, B),
    Z = A.length - B;
  if (G.length === 1) return `${G[0]} and ${Z} more`;
  return `${G.join(", ")}, and ${Z} more`
}
// @from(Ln 464176, Col 0)
function dq9(A) {
  return !!A?.otelHeadersHelper
}
// @from(Ln 464180, Col 0)
function aq9() {
  let A = [],
    Q = dB("projectSettings");
  if (dq9(Q)) A.push(".claude/settings.json");
  let B = dB("localSettings");
  if (dq9(B)) A.push(".claude/settings.local.json");
  return A
}
// @from(Ln 464189, Col 0)
function cq9(A) {
  return !!A?.apiKeyHelper
}
// @from(Ln 464193, Col 0)
function oq9() {
  let A = [],
    Q = dB("projectSettings");
  if (cq9(Q)) A.push(".claude/settings.json");
  let B = dB("localSettings");
  if (cq9(B)) A.push(".claude/settings.local.json");
  return A
}
// @from(Ln 464202, Col 0)
function pq9(A) {
  return !!(A?.awsAuthRefresh || A?.awsCredentialExport)
}
// @from(Ln 464206, Col 0)
function rq9() {
  let A = [],
    Q = dB("projectSettings");
  if (pq9(Q)) A.push(".claude/settings.json");
  let B = dB("localSettings");
  if (pq9(B)) A.push(".claude/settings.local.json");
  return A
}
// @from(Ln 464215, Col 0)
function lq9(A) {
  if (!A?.env) return !1;
  return Object.keys(A.env).some((Q) => !H6A.has(Q.toUpperCase()))
}
// @from(Ln 464220, Col 0)
function sq9() {
  let A = [],
    Q = dB("projectSettings");
  if (lq9(Q)) A.push(".claude/settings.json");
  let B = dB("localSettings");
  if (lq9(B)) A.push(".claude/settings.local.json");
  return A
}
// @from(Ln 464228, Col 4)
tq9 = w(() => {
  eQA();
  GB();
  pfA();
  wI1()
})
// @from(Ln 464234, Col 4)
eq9
// @from(Ln 464235, Col 4)
AN9 = w(() => {
  eq9 = {
    control: {
      title: "Do you trust the files in this folder?",
      bodyText: null,
      showDetailedPermissions: !0,
      learnMoreText: "Learn more",
      yesButtonLabel: "Yes, proceed",
      noButtonLabel: "No, exit"
    },
    variant_positive_attitude: {
      title: "Ready to code here?",
      bodyText: `I'll need permission to work with your files.

This means I can:
- Read any file in this folder
- Create, edit, or delete files
- Run commands (like npm, git, tests, ls, rm)
- Use tools defined in .mcp.json`,
      showDetailedPermissions: !1,
      learnMoreText: "Learn more",
      yesButtonLabel: "Yes, continue",
      noButtonLabel: "No, exit"
    },
    variant_normalize_action: {
      title: "Accessing workspace:",
      bodyText: `Quick safety check: Is this a project you created or one you trust? (Like your own code, a well-known open source project, or work from your team). If not, take a moment to review what's in this folder first.

Claude Code'll be able to read, edit, and execute files here.`,
      showDetailedPermissions: !1,
      learnMoreText: "Security guide",
      yesButtonLabel: "Yes, I trust this folder",
      noButtonLabel: "No, exit"
    },
    variant_explicit: {
      title: "Do you want to work in this folder?",
      bodyText: `In order to work in this folder, we need your permission for Claude Code to read, edit, and execute files.

If this folder has malicious code or untrusted scripts, Claude Code could run them while trying to help.

Only continue if this is your code or a project you trust.`,
      showDetailedPermissions: !1,
      learnMoreText: "Security details",
      yesButtonLabel: "Yes, continue",
      noButtonLabel: "No, exit"
    }
  }
})