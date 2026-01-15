
// @from(Ln 464287, Col 0)
function BN9({
  onDone: A,
  commands: Q
}) {
  let {
    servers: B
  } = GW("project"), G = HX("trust_folder_dialog_copy", "variant", "control"), Z = eq9[G], Y = Object.keys(B).length > 0, J = iq9(), X = J.length > 0, I = nq9(), D = oq9(), W = D.length > 0, K = rq9(), V = K.length > 0, F = aq9(), H = F.length > 0, E = sq9(), z = E.length > 0, $ = [...new Set([...J, ...I, ...D, ...K, ...F, ...E])], O = Q?.filter((MA) => MA.type === "prompt" && MA.loadedFrom === "commands_DEPRECATED" && (MA.source === "projectSettings" || MA.source === "localSettings") && MA.allowedTools?.some((TA) => TA === X9 || TA.startsWith(X9 + "("))) ?? [], L = Q?.filter((MA) => MA.type === "prompt" && (MA.loadedFrom === "skills" || MA.loadedFrom === "plugin") && (MA.source === "projectSettings" || MA.source === "localSettings" || MA.source === "plugin") && MA.allowedTools?.some((TA) => TA === X9 || TA.startsWith(X9 + "("))) ?? [], M = O.length > 0, _ = L.length > 0, j = O.map((MA) => MA.name), x = L.map((MA) => MA.name), b = I.length > 0 || M || _, S = Y || X || b || W || V || H || z, u = eZ(X || b || W || V || H || z), AA = [{
    name: "MCP servers",
    shouldShowWarning: () => Y,
    onChange: () => {
      let MA = {
        enabledMcpjsonServers: Object.keys(B),
        enableAllProjectMcpServers: !0
      };
      pB("localSettings", MA)
    }
  }, {
    name: "hooks",
    shouldShowWarning: () => X
  }, {
    name: "bash commands",
    shouldShowWarning: () => b
  }, {
    name: "OpenTelemetry headers helper commands",
    shouldShowWarning: () => H
  }, {
    name: "dangerous environment variables",
    shouldShowWarning: () => z
  }].filter((MA) => MA.shouldShowWarning()), n = new Set(AA.map((MA) => MA.name)), y = Object.keys(B);

  function p() {
    let MA = ["files"];
    if (n.has("MCP servers")) MA.push("MCP servers");
    if (n.has("hooks")) MA.push("hooks");
    if (n.has("bash commands")) MA.push("bash commands");
    if (n.has("OpenTelemetry headers helper commands")) MA.push("OpenTelemetry headers helper commands");
    if (n.has("dangerous environment variables")) MA.push("environment variables");
    return $mA(MA)
  }
  h5.default.useEffect(() => {
    let MA = QN9() === o1();
    l("tengu_trust_dialog_shown", {
      isHomeDir: MA,
      hasMcpServers: Y,
      hasHooks: X,
      hasBashExecution: b,
      hasApiKeyHelper: W,
      hasAwsCommands: V,
      hasOtelHeadersHelper: H,
      hasDangerousEnvVars: z,
      folderType: nx0(o1()),
      copyVariant: G
    })
  }, [Y, X, b, W, V, H, z, G]);

  function GA(MA) {
    if (MA === "exit") {
      f6(1);
      return
    }
    let TA = QN9() === o1();
    if (l("tengu_trust_dialog_accept", {
        isHomeDir: TA,
        hasMcpServers: Y,
        hasHooks: X,
        hasBashExecution: b,
        hasApiKeyHelper: W,
        hasAwsCommands: V,
        hasOtelHeadersHelper: H,
        hasDangerousEnvVars: z,
        enableMcp: !0,
        folderType: nx0(o1()),
        copyVariant: G
      }), TA) Zf0(!0);
    else BZ((bA) => ({
      ...bA,
      hasTrustDialogAccepted: !0
    }));
    AA.forEach((bA) => {
      if (bA.onChange !== void 0) bA.onChange()
    }), A()
  }
  let WA = MQ();
  if (H2("confirm:no", () => {
      f6(0)
    }, {
      context: "Confirmation"
    }), u) return setTimeout(A), null;
  return h5.default.createElement(VY, {
    color: "warning",
    titleColor: "warning",
    title: Z.title
  }, h5.default.createElement(T, {
    flexDirection: "column",
    gap: 1,
    paddingTop: 1
  }, h5.default.createElement(C, {
    bold: !0
  }, vA().cwd()), Z.bodyText !== null ? h5.default.createElement(C, null, Z.bodyText) : h5.default.createElement(C, null, "Claude Code may read, write, or execute files contained in this directory. This can pose security risks, so only use", " ", p(), " from trusted sources."), Z.showDetailedPermissions && S && h5.default.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, h5.default.createElement(C, {
    dimColor: !0
  }, "Execution allowed by:"), Y && h5.default.createElement(T, {
    paddingLeft: 2
  }, h5.default.createElement(C, null, h5.default.createElement(C, {
    dimColor: !0
  }, "• "), h5.default.createElement(C, {
    bold: !0
  }, ".mcp.json"), y.length > 0 && h5.default.createElement(C, {
    dimColor: !0
  }, " ", "(", $mA(y, 3), ")"))), $.length > 0 && h5.default.createElement(T, {
    paddingLeft: 2
  }, h5.default.createElement(C, null, h5.default.createElement(C, {
    dimColor: !0
  }, "• "), h5.default.createElement(C, {
    bold: !0
  }, $.join(", ")))), M && h5.default.createElement(T, {
    paddingLeft: 2
  }, h5.default.createElement(C, null, h5.default.createElement(C, {
    dimColor: !0
  }, "• "), h5.default.createElement(C, {
    bold: !0
  }, ".claude/commands"), h5.default.createElement(C, {
    dimColor: !0
  }, " ", "(", $mA(j, 3), ")"))), _ && h5.default.createElement(T, {
    paddingLeft: 2
  }, h5.default.createElement(C, null, h5.default.createElement(C, {
    dimColor: !0
  }, "• "), h5.default.createElement(C, {
    bold: !0
  }, ".claude/skills"), h5.default.createElement(C, {
    dimColor: !0
  }, " (", $mA(x, 3), ")")))), h5.default.createElement(C, {
    dimColor: !0
  }, h5.default.createElement(i2, {
    url: "https://code.claude.com/docs/en/security"
  }, Z.learnMoreText)), h5.default.createElement(k0, {
    options: [{
      label: Z.yesButtonLabel,
      value: "enable_all"
    }, {
      label: Z.noButtonLabel,
      value: "exit"
    }],
    onChange: (MA) => GA(MA),
    onCancel: () => GA("exit")
  }), h5.default.createElement(C, {
    dimColor: !0
  }, WA.pending ? h5.default.createElement(h5.default.Fragment, null, "Press ", WA.keyName, " again to exit") : h5.default.createElement(h5.default.Fragment, null, "Enter to confirm · Esc to cancel"))))
}
// @from(Ln 464438, Col 4)
h5
// @from(Ln 464439, Col 4)
GN9 = w(() => {
  fA();
  c6();
  u8();
  GQ();
  G$();
  GB();
  BI();
  Z0();
  E9();
  V2();
  C0();
  fA();
  DQ();
  yJ();
  tq9();
  AN9();
  dN();
  h5 = c(QA(), 1)
})
// @from(Ln 464460, Col 0)
function YM7({
  settingsErrors: A,
  onContinue: Q,
  onExit: B
}) {
  function G(Z) {
    if (Z === "exit") B();
    else Q()
  }
  return GAA.default.createElement(o9, {
    title: "Settings Error",
    onCancel: B,
    color: "warning",
    borderDimColor: !1
  }, GAA.default.createElement(TE1, {
    errors: A
  }), GAA.default.createElement(C, {
    dimColor: !0
  }, "Files with errors are skipped entirely, not just the invalid settings."), GAA.default.createElement(k0, {
    options: [{
      label: "Exit and fix manually",
      value: "exit"
    }, {
      label: "Continue without these settings",
      value: "continue"
    }],
    onChange: G
  }))
}
// @from(Ln 464489, Col 0)
async function ZN9(A) {
  await new Promise(async (Q) => {
    let {
      unmount: B
    } = await Y5(GAA.default.createElement(b5, null, GAA.default.createElement(vJ, null, GAA.default.createElement(YM7, {
      settingsErrors: A,
      onContinue: () => {
        B(), Q()
      },
      onExit: () => {
        B(), f6(1)
      }
    }))), FY(!1))
  })
}
// @from(Ln 464504, Col 4)
GAA
// @from(Ln 464505, Col 4)
YN9 = w(() => {
  fA();
  u8();
  fA();
  hB();
  Bc();
  yJ();
  bR0();
  rY();
  Kf();
  GAA = c(QA(), 1)
})
// @from(Ln 464517, Col 4)
JM7
// @from(Ln 464517, Col 9)
ax0
// @from(Ln 464518, Col 4)
JN9 = w(() => {
  jz1();
  v1();
  d4();
  v1();
  yJ();
  P4();
  ZI();
  C0();
  Pz1();
  A0();
  JM7 = c(QA(), 1), ax0 = c(QA(), 1)
})
// @from(Ln 464532, Col 0)
function XN9({
  commands: A,
  worktreePaths: Q,
  initialTools: B,
  mcpClients: G,
  dynamicMcpConfig: Z,
  mcpCliEndpoint: Y,
  appState: J,
  onChangeAppState: X,
  debug: I,
  strictMcpConfig: D = !1,
  systemPrompt: W,
  appendSystemPrompt: K,
  initialSearchQuery: V,
  disableSlashCommands: F = !1,
  forkSession: H,
  taskListId: E
}) {
  let {
    rows: z
  } = ZB(), [$, O] = zG.default.useState([]), [L, M] = zG.default.useState(!0), [_, j] = zG.default.useState(!1), [x, b] = zG.default.useState(!1), [S, u] = zG.default.useState(null), [f, AA] = zG.default.useState(null), n = $.filter((TA) => !TA.isSidechain);
  MQ();
  let y = zp();
  zG.default.useEffect(() => {
    Le(Q).then((TA) => {
      O(TA), M(!1)
    }).catch((TA) => {
      e(TA), M(!1)
    })
  }, [Q]);
  let p = zG.default.useCallback((TA) => {
      M(!0), (TA ? egA() : Le(Q)).then((jA) => {
        O(jA)
      }).catch((jA) => {
        e(jA)
      }).finally(() => {
        M(!1)
      })
    }, [Q]),
    GA = zG.default.useCallback(() => {
      let TA = !x;
      b(TA), p(TA)
    }, [x, p]);

  function WA() {
    process.exit(1)
  }
  async function MA(TA) {
    j(!0);
    let bA = Tz1(TA, x, Q);
    if (bA.isCrossProject) {
      if (!bA.isSameRepoWorktree) {
        await Gp(bA.command), AA(bA.command);
        return
      }
    }
    try {
      let jA = await Zt(TA, void 0);
      if (!jA) throw Error("Failed to load conversation");
      if (jA.sessionId && !H) {
        if (pw(lz(jA.sessionId)), ue()) q8A();
        await wj(), NOA(jA.sessionId)
      }
      if (!Tz()) await sI();
      O([]), u(jA)
    } catch (jA) {
      throw e(jA), jA
    }
  }
  if (f) return zG.default.createElement(XM7, {
    command: f
  });
  if (S) return zG.default.createElement(b5, {
    initialState: J,
    onChangeAppState: X
  }, zG.default.createElement(v$A, {
    debug: I,
    commands: A,
    initialTools: B,
    initialMessages: S.messages,
    initialFileHistorySnapshots: S.fileHistorySnapshots,
    mcpClients: G,
    dynamicMcpConfig: Z,
    mcpCliEndpoint: Y,
    strictMcpConfig: D,
    systemPrompt: W,
    appendSystemPrompt: K,
    disableSlashCommands: F,
    taskListId: E
  }));
  if (L) return zG.default.createElement(T, null, zG.default.createElement(W9, null), zG.default.createElement(C, null, " Loading conversations…"));
  if (_) return zG.default.createElement(T, null, zG.default.createElement(W9, null), zG.default.createElement(C, null, " Resuming conversation…"));
  if (n.length === 0) return zG.default.createElement(T, {
    flexDirection: "column"
  }, zG.default.createElement(C, null, "No conversations found to resume."), zG.default.createElement(C, {
    dimColor: !0
  }, "Press Ctrl+C to exit and start a new conversation."));
  return zG.default.createElement(b5, {
    initialState: J,
    onChangeAppState: X
  }, zG.default.createElement(sgA, {
    logs: n,
    maxHeight: z,
    onCancel: WA,
    onSelect: MA,
    onLogsChanged: y ? () => p(x) : void 0,
    initialSearchQuery: V,
    showAllProjects: x,
    onToggleAllProjects: GA,
    onAgenticSearch: tgA
  }))
}
// @from(Ln 464645, Col 0)
function XM7({
  command: A
}) {
  return zG.default.useEffect(() => {
    let Q = setTimeout(() => {
      process.exit(0)
    }, 100);
    return () => clearTimeout(Q)
  }, []), zG.default.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, zG.default.createElement(C, null, "This conversation is from a different directory."), zG.default.createElement(T, {
    flexDirection: "column"
  }, zG.default.createElement(C, null, "To resume, run:"), zG.default.createElement(C, null, " ", A)), zG.default.createElement(C, {
    dimColor: !0
  }, "(Command copied to clipboard)"))
}
// @from(Ln 464662, Col 4)
zG
// @from(Ln 464663, Col 4)
IN9 = w(() => {
  fA();
  yG();
  mx0();
  jz1();
  v1();
  d4();
  Pz1();
  Xd();
  sBA();
  E9();
  hB();
  eHA();
  P4();
  OzA();
  gj0();
  C0();
  d4();
  LR();
  $$A();
  $F();
  zG = c(QA(), 1)
})
// @from(Ln 464686, Col 0)
async function WN9(A, Q, B) {
  let Z = Id(100);
  DO(A);
  let Y = new WuA({
    name: "claude/tengu",
    version: {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.1.7",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      BUILD_TIME: "2026-01-13T22:55:21Z"
    }.VERSION
  }, {
    capabilities: {
      tools: {}
    }
  });
  Y.setRequestHandler(DxA, async () => {
    let X = oL(),
      I = F$(X);
    return {
      tools: await Promise.all(I.map(async (D) => {
        let W;
        if (D.outputSchema) {
          let K = sEA(D.outputSchema);
          if (typeof K === "object" && K !== null && "type" in K && K.type === "object") W = K
        }
        return {
          ...D,
          description: await D.prompt({
            getToolPermissionContext: async () => X,
            tools: I,
            agents: []
          }),
          inputSchema: sEA(D.inputSchema),
          outputSchema: W
        }
      }))
    }
  }), Y.setRequestHandler(n9A, async ({
    params: {
      name: X,
      arguments: I
    }
  }) => {
    let D = oL(),
      W = F$(D),
      K = W.find((V) => V.name === X);
    if (!K) throw Error(`Tool ${X} not found`);
    try {
      if (!K.isEnabled()) throw Error(`Tool ${X} is not enabled`);
      let V = B5(),
        F = await K.validateInput?.(I ?? {}, {
          abortController: c9(),
          options: {
            commands: DN9,
            tools: W,
            mainLoopModel: V,
            maxThinkingTokens: 0,
            mcpClients: [],
            mcpResources: {},
            isNonInteractiveSession: !0,
            debug: Q,
            verbose: B,
            agentDefinitions: {
              activeAgents: [],
              allAgents: []
            }
          },
          getAppState: async () => HzA(),
          setAppState: () => {},
          messages: [],
          setMessages: () => {},
          readFileState: Z,
          setInProgressToolUseIDs: () => {},
          setResponseLength: () => {},
          updateFileHistoryState: () => {},
          updateAttributionState: () => {}
        });
      if (F && !F.result) throw Error(`Tool ${X} input is invalid: ${F.message}`);
      let H = await K.call(I ?? {}, {
        abortController: c9(),
        options: {
          commands: DN9,
          tools: W,
          mainLoopModel: B5(),
          maxThinkingTokens: 0,
          mcpClients: [],
          mcpResources: {},
          isNonInteractiveSession: !0,
          debug: Q,
          verbose: B,
          agentDefinitions: {
            activeAgents: [],
            allAgents: []
          }
        },
        getAppState: async () => HzA(),
        setAppState: () => {},
        messages: [],
        setMessages: () => {},
        readFileState: Z,
        setInProgressToolUseIDs: () => {},
        setResponseLength: () => {},
        updateFileHistoryState: () => {},
        updateAttributionState: () => {}
      }, B$, QU({
        content: []
      }));
      return {
        content: [{
          type: "text",
          text: typeof H === "string" ? H : eA(H.data)
        }]
      }
    } catch (V) {
      return e(V instanceof Error ? V : Error(String(V))), {
        isError: !0,
        content: [{
          type: "text",
          text: (V instanceof Error ? VM0(V) : [String(V)]).filter(Boolean).join(`
`).trim() || "Error"
        }]
      }
    }
  });
  async function J() {
    let X = new kuA;
    await Y.connect(X)
  }
  return await J()
}
// @from(Ln 464819, Col 4)
DN9
// @from(Ln 464820, Col 4)
KN9 = w(() => {
  jT0();
  sP0();
  eK();
  eF1();
  YZ();
  Vb();
  l2();
  v1();
  pC();
  ks();
  cj0();
  tQ();
  az();
  iZ();
  hB();
  A0();
  DN9 = [Sz1]
})
// @from(Ln 464840, Col 0)
function VN9(A) {
  let Q = A.slice(A.lastIndexOf(".")).toLowerCase();
  return IM7.has(Q)
}
// @from(Ln 464845, Col 0)
function FN9(A) {
  let Q = Math.min(A.length, DM7),
    B = 0;
  for (let G = 0; G < Q; G++) {
    let Z = A[G];
    if (Z === 0) return !0;
    if (Z < 32 && Z !== 9 && Z !== 10 && Z !== 13) B++
  }
  return B / Q > 0.1
}
// @from(Ln 464855, Col 4)
IM7
// @from(Ln 464855, Col 9)
DM7 = 8192
// @from(Ln 464856, Col 4)
HN9 = w(() => {
  IM7 = new Set([".png", ".jpg", ".jpeg", ".gif", ".bmp", ".ico", ".webp", ".svg", ".tiff", ".tif", ".mp4", ".mov", ".avi", ".mkv", ".webm", ".mp3", ".wav", ".ogg", ".flac", ".zip", ".tar", ".gz", ".bz2", ".7z", ".rar", ".exe", ".dll", ".so", ".dylib", ".bin", ".o", ".a", ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".ttf", ".otf", ".woff", ".woff2", ".eot", ".pyc", ".pyo", ".class", ".jar", ".war", ".node", ".wasm", ".sqlite", ".db", ".data"])
})
// @from(Ln 464860, Col 0)
function EN9(A) {
  return /\bgit\s+commit(?:\s|$)/.test(A)
}
// @from(Ln 464864, Col 0)
function zN9(A, Q, B) {
  if (B !== void 0) return B === 0;
  let G = [/\[\w+[^\]]*\]\s+/, /create mode/, /\d+ files? changed/, /\d+ insertions?/, /\d+ deletions?/],
    Z = A + Q;
  return G.some((Y) => Y.test(Z))
}
// @from(Ln 464870, Col 0)
async function WM7() {
  let A = EQ();
  try {
    let Q = await J2("git", ["diff-tree", "--root", "--no-commit-id", "--name-only", "-r", "HEAD"], {
      cwd: A,
      timeout: 5000
    });
    if (Q.code === 0 && Q.stdout) return Q.stdout.split(`
`).filter(Boolean)
  } catch (Q) {
    e(Q)
  }
  return []
}
// @from(Ln 464884, Col 0)
async function KM7() {
  let A = EQ();
  try {
    let Q = await J2("git", ["log", "-1", "--format=%B"], {
      cwd: A,
      timeout: 5000
    });
    if (Q.code === 0 && Q.stdout) return Q.stdout.includes("Claude-Generated-By:")
  } catch (Q) {
    e(Q)
  }
  return !1
}
// @from(Ln 464898, Col 0)
function VM7(A) {
  let Q = A;
  return Q = Q.replace(/^Claude-Generated-By:.*$/gm, ""), Q = Q.replace(/^Claude-Steers:.*$/gm, ""), Q = Q.replace(/^Claude-Permission-Prompts:.*$/gm, ""), Q = Q.replace(/^Claude-Escapes:.*$/gm, ""), Q = Q.replace(/\nClaude-Plan:\n<claude-plan>[\s\S]*?<\/claude-plan>/g, ""), Q = Q.replace(/\n{3,}/g, `

`).trim(), Q
}
// @from(Ln 464905, Col 0)
function FM7(A) {
  return /\bgit\s+commit\b.*--amend/.test(A)
}
// @from(Ln 464908, Col 0)
async function HM7(A, Q = "", B = !1) {
  let G = EQ();
  try {
    let Z = await J2("git", ["log", "-1", "--format=%B"], {
      cwd: G,
      timeout: 5000
    });
    if (Z.code !== 0) return !1;
    let Y = Z.stdout.trim();
    if (k(`Attribution: currentMessage length=${Y.length}`), k(`Attribution: currentMessage:
${Y}`), B) Y = VM7(Y);
    let J = /^[A-Za-z][A-Za-z0-9-]*:\s+.+$/,
      X = Y.split(`
`),
      I = -1;
    for (let K = X.length - 1; K >= 0; K--) {
      let V = X[K];
      if (V === "") {
        if (I > K) I = K + 1;
        break
      }
      if (J.test(V)) I = K;
      else {
        I = -1;
        break
      }
    }
    let D;
    if (I > 0 && A.length > 0) D = Y + `
` + A.join(`
`);
    else if (A.length > 0) D = Y + `

` + A.join(`
`);
    else D = Y;
    D += Q, k(`Attribution: newMessage:
${D}`);
    let W = await J2("git", ["commit", "--amend", "-m", D], {
      cwd: G,
      timeout: 1e4
    });
    if (W.code === 0) return k("Attribution: Successfully amended commit with trailers"), !0;
    else return k(`Attribution: Failed to amend commit: ${W.stderr}`), !1
  } catch (Z) {
    return e(Z), !1
  }
}
// @from(Ln 464956, Col 0)
async function $N9(A, Q) {
  k(`Attribution: handlePostCommitAttribution called with ${A.fileStates.size} tracked files`);
  try {
    if (await vRB()) return k("Attribution: Skipping - transient git state"), {
      success: !1
    };
    let B = Q ? FM7(Q) : !1,
      G = await KM7();
    if (G && !B) return k("Attribution: Skipping - commit already has trailers"), {
      success: !1
    };
    let Z = G && B;
    if (Z) k("Attribution: Amend detected - will recalculate and replace existing trailers");
    let Y = await WM7();
    if (Y.length === 0) return k("Attribution: Skipping - no files in commit"), {
      success: !1
    };
    let J = await oB0([A], Y);
    if (J.summary.claudePercent === 0) return k("Attribution: Skipping - 0% Claude contribution"), {
      success: !1
    };
    let I = !await nB0(),
      D = [],
      W = yRB(J, I);
    if (W) D.push(W);
    let K = Math.max(0, A.promptCount - A.promptCountAtLastCommit - 1);
    D.push(`Claude-Steers: ${K}`);
    let V = A.permissionPromptCount - A.permissionPromptCountAtLastCommit;
    D.push(`Claude-Permission-Prompts: ${V}`);
    let F = A.escapeCount - A.escapeCountAtLastCommit;
    D.push(`Claude-Escapes: ${F}`);
    let H = AK(),
      E = "";
    if (H) E = `
Claude-Plan:
<claude-plan>
${H.trim()}
</claude-plan>`;
    if (D.length > 0 || E) {
      if (await HM7(D, E, Z)) return {
        success: !0,
        newPromptCountAtLastCommit: A.promptCount,
        newPermissionPromptCountAtLastCommit: A.permissionPromptCount,
        newEscapeCountAtLastCommit: A.escapeCount
      }
    }
    return {
      success: !1
    }
  } catch (B) {
    return e(B), {
      success: !1
    }
  }
}
// @from(Ln 465011, Col 4)
CN9 = w(() => {
  C0();
  t4();
  T1();
  v1();
  B2A();
  UF()
})
// @from(Ln 465029, Col 0)
async function zM7(A, Q, B) {
  let G = CmA.get(A);
  if (G && G.mtime === B) return G.refCount++, G.content;
  let Z = await Q(A);
  if (Z) CmA.set(A, {
    content: Z,
    mtime: B,
    refCount: 1
  });
  return Z
}
// @from(Ln 465041, Col 0)
function $M7(A) {
  let Q = CmA.get(A);
  if (Q) {
    if (Q.refCount--, Q.refCount <= 0) CmA.delete(A)
  }
}
// @from(Ln 465048, Col 0)
function ox0(A) {
  for (let Q of A) $M7(Q)
}
// @from(Ln 465052, Col 0)
function CM7(A) {
  let Q = new Map,
    B = A.split(`
`).filter(Boolean);
  for (let G of B) {
    let Z = G.slice(0, 2),
      Y = G.slice(3);
    if (Y.startsWith('"') && Y.endsWith('"')) Y = Y.slice(1, -1);
    Q.set(Y, Z)
  }
  return Q
}
// @from(Ln 465064, Col 0)
async function NN9() {
  let A = EQ(),
    Q = await J2("git", ["--no-optional-locks", "status", "--porcelain", "-uall"], {
      cwd: A,
      timeout: 5000
    });
  if (Q.code !== 0) return new Map;
  return CM7(Q.stdout)
}
// @from(Ln 465073, Col 0)
async function rx0(A) {
  if (VN9(A)) return k(`Attribution hook: Skipping binary extension file ${A}`), "";
  let Q = EQ(),
    B = tx0(Q, A);
  try {
    let G = await sx0(B);
    if (G.isDirectory()) return "";
    if (G.size > UM7) return k(`Attribution hook: Skipping large file ${A} (${G.size} bytes)`), "";
    let Z = await EM7(B, "r");
    try {
      let Y = Buffer.alloc(Math.min(GU1, G.size));
      if (await Z.read(Y, 0, Y.length, 0), FN9(Y)) return k(`Attribution hook: Skipping binary content file ${A}`), "";
      if (G.size <= GU1) return Y.toString("utf-8");
      let J = Buffer.alloc(G.size - GU1);
      return await Z.read(J, 0, J.length, GU1), Y.toString("utf-8") + J.toString("utf-8")
    } finally {
      await Z.close()
    }
  } catch {
    return ""
  }
}
// @from(Ln 465095, Col 0)
async function UN9(A) {
  let Q = EQ(),
    B = await J2("git", ["show", `HEAD:${A}`], {
      cwd: Q,
      timeout: 5000
    });
  if (B.code !== 0) return "";
  return B.stdout
}
// @from(Ln 465104, Col 0)
async function ex0(A, Q, B, G, Z) {
  k(`Attribution hook: Tracking file modification for ${Q}`);
  let Y = await A.getAppState(),
    J = Y.mainLoopModelForSession ?? Y.mainLoopModel ?? EQA(),
    X = FX(J),
    I = aB0(H91(), X),
    D = Y.attribution;
  A.setAppState((W) => {
    let K = {
      ...W.attribution,
      surface: I
    };
    D = $91(K, Q, B, G, Z);
    let V = rB0(D, qN9());
    return CP0(V).catch((F) => {
      k(`Attribution hook: Failed to save snapshot: ${F}`)
    }), {
      ...W,
      attribution: D
    }
  })
}
// @from(Ln 465126, Col 0)
async function qM7(A, Q, B, G, Z) {
  if (A.hook_event_name !== "PostToolUse") return {};
  if (!Z?.setAppState || !Z?.getAppState) return k("Attribution hook: No setAppState/getAppState available, skipping"), {};
  let Y = o$0.safeParse(A.tool_response);
  if (!Y.success) return k(`Attribution hook: Failed to parse Write response: ${Y.error.message}`), {};
  let {
    filePath: J,
    originalFile: X,
    content: I
  } = Y.data;
  return ex0(Z, J, X ?? "", I, !1), {}
}
// @from(Ln 465138, Col 0)
async function NM7(A, Q, B, G, Z) {
  if (A.hook_event_name !== "PostToolUse") return {};
  if (!Z?.setAppState || !Z?.getAppState) return k("Attribution hook: No setAppState/getAppState available, skipping"), {};
  let Y = KW1.safeParse(A.tool_response);
  if (!Y.success) return k(`Attribution hook: Failed to parse Edit response: ${Y.error.message}`), {};
  let {
    filePath: J,
    originalFile: X,
    oldString: I,
    newString: D,
    replaceAll: W,
    userModified: K
  } = Y.data, V = iD1(X, I, D, W);
  return ex0(Z, J, X, V, K), {}
}
// @from(Ln 465153, Col 0)
async function wM7(A, Q, B, G, Z) {
  if (A.hook_event_name !== "PostToolUse") return {};
  if (!Z?.setAppState || !Z?.getAppState) return k("Attribution hook: No setAppState/getAppState available, skipping"), {};
  let Y = AC0.safeParse(A.tool_response);
  if (!Y.success) return k(`Attribution hook: Failed to parse NotebookEdit response: ${Y.error.message}`), {};
  let {
    notebook_path: J,
    original_file: X,
    updated_file: I,
    error: D
  } = Y.data;
  if (D) return k("Attribution hook: NotebookEdit had error, skipping"), {};
  return ex0(Z, J, X, I, !1), {}
}
// @from(Ln 465167, Col 0)
async function LM7(A, Q, B, G, Z) {
  if (A.hook_event_name !== "PreToolUse") return {};
  if (!Q) return {};
  let Y = await NN9(),
    J = Array.from(Y.entries()).filter(([W, K]) => !K.startsWith("?")).map(([W]) => W),
    X = new Set,
    I = EQ(),
    D = J.map(async (W) => {
      let K = tx0(I, W);
      try {
        let V = await sx0(K);
        if (await zM7(W, rx0, V.mtimeMs)) X.add(W)
      } catch {}
    });
  return await Promise.all(D), m8A.set(Q, {
    gitStatus: Y,
    cachedFiles: X
  }), k(`Attribution hook: Captured git status for bash ${Q} (${Y.size} files)`), {}
}
// @from(Ln 465186, Col 0)
async function OM7(A, Q) {
  let B = m8A.get(A);
  if (!B) {
    k(`Attribution hook: No pre-state found for bash ${A}`);
    return
  }
  m8A.delete(A);
  let G = await NN9(),
    Z = B.gitStatus,
    Y = B.cachedFiles,
    J = (V) => {
      return CmA.get(V)?.content
    },
    X = [];
  try {
    for (let [V, F] of G) {
      let H = Z.get(V);
      if (H !== F) {
        let E = await rx0(V);
        if (H === void 0 && F === "??") X.push({
          path: V,
          type: "created",
          oldContent: "",
          newContent: E
        });
        else if (F?.includes("D")) {
          let z = J(V);
          if (z === void 0 && H === void 0) z = await UN9(V);
          z = z ?? "", X.push({
            path: V,
            type: "deleted",
            oldContent: z,
            newContent: ""
          })
        } else {
          let z = J(V);
          if (z === void 0 && H === void 0) z = await UN9(V);
          if (z = z ?? "", E !== z) X.push({
            path: V,
            type: "modified",
            oldContent: z,
            newContent: E
          })
        }
      }
    }
    for (let [V, F] of Z)
      if (!G.has(V)) {
        if (await rx0(V) === "") {
          let E = EQ(),
            z = tx0(E, V);
          try {
            await sx0(z)
          } catch {
            let $ = J(V) ?? "";
            X.push({
              path: V,
              type: "deleted",
              oldContent: $,
              newContent: ""
            })
          }
        }
      }
  } finally {
    ox0(Y)
  }
  if (X.length === 0) {
    k(`Attribution hook: No file changes detected for bash ${A}`);
    return
  }
  k(`Attribution hook: Detected ${X.length} file changes from bash ${A}`);
  let I = await Q.getAppState(),
    D = I.mainLoopModelForSession ?? I.mainLoopModel ?? EQA(),
    W = FX(D),
    K = aB0(H91(), W);
  Q.setAppState((V) => {
    let F = {
      ...V.attribution,
      surface: K
    };
    for (let E of X) {
      let z = E91(E.path);
      if (E.type === "created") F = SRB(F, z, E.newContent);
      else if (E.type === "deleted") F = xRB(F, z, E.oldContent);
      else F = $91(F, z, E.oldContent, E.newContent, !1)
    }
    let H = rB0(F, qN9());
    return CP0(H).catch((E) => {
      k(`Attribution hook: Failed to save snapshot: ${E}`)
    }), {
      ...V,
      attribution: F
    }
  })
}
// @from(Ln 465282, Col 0)
async function MM7(A, Q, B, G, Z) {
  if (A.hook_event_name !== "PostToolUse") return {};
  let Y = YV1.safeParse(A.tool_input);
  if (!Y.success) return {};
  let {
    command: J
  } = Y.data, X = rq0.safeParse(A.tool_response);
  if (!X.success) {
    if (k(`Attribution hook: Failed to parse Bash response: ${X.error.message}`), Q) {
      let W = m8A.get(Q);
      if (W) ox0(W.cachedFiles), m8A.delete(Q)
    }
    return {}
  }
  let {
    stdout: I,
    stderr: D
  } = X.data;
  if (!Z?.getAppState || !Z?.setAppState) {
    if (k("Attribution hook: No getAppState/setAppState available, skipping"), Q) {
      let W = m8A.get(Q);
      if (W) ox0(W.cachedFiles), m8A.delete(Q)
    }
    return {}
  }
  if (Q) OM7(Q, Z);
  if (EN9(J)) {
    if (!zN9(I ?? "", D ?? "", void 0)) return k("Attribution hook: Commit was not successful, skipping"), {};
    k("Attribution hook: Commit succeeded, adding trailers via amend");
    let W = await Z.getAppState(),
      K = await $N9(W.attribution, J);
    if (K.success && K.newPromptCountAtLastCommit !== void 0) Z.setAppState((V) => ({
      ...V,
      attribution: {
        ...V.attribution,
        promptCountAtLastCommit: K.newPromptCountAtLastCommit,
        permissionPromptCountAtLastCommit: K.newPermissionPromptCountAtLastCommit,
        escapeCountAtLastCommit: K.newEscapeCountAtLastCommit
      }
    }))
  }
  return {}
}
// @from(Ln 465326, Col 0)
function wN9() {
  return
}
// @from(Ln 465329, Col 4)
CmA
// @from(Ln 465329, Col 9)
m8A
// @from(Ln 465329, Col 14)
UM7 = 10485760
// @from(Ln 465330, Col 2)
GU1 = 8192
// @from(Ln 465331, Col 4)
LN9 = w(() => {
  C0();
  HN9();
  B2A();
  l2();
  CN9();
  T1();
  d4();
  jc();
  pL();
  VW1();
  hs();
  YK();
  u6A();
  t4();
  CmA = new Map;
  m8A = new Map
})
// @from(Ln 465350, Col 0)
function UmA(A, Q) {
  e(A instanceof Error ? A : Error(String(A))), console.error(`${tA.cross} Failed to ${Q}: ${A instanceof Error?A.message:String(A)}`), process.exit(1)
}
// @from(Ln 465353, Col 0)
async function ON9(A, Q = "user") {
  try {
    console.log(`Installing plugin "${A}"...`);
    let B = await f99(A, Q);
    if (!B.success) throw Error(B.message);
    console.log(`${tA.tick} ${B.message}`), l("tengu_plugin_installed_cli", {
      plugin_id: B.pluginId || A,
      marketplace_name: B.pluginId?.split("@")[1] || "unknown",
      scope: B.scope || Q
    }), process.exit(0)
  } catch (B) {
    UmA(B, `install plugin "${A}"`)
  }
}
// @from(Ln 465367, Col 0)
async function MN9(A, Q = "user") {
  try {
    let B = await sE1(A, Q);
    if (!B.success) throw Error(B.message);
    console.log(`${tA.tick} ${B.message}`), l("tengu_plugin_uninstalled_cli", {
      plugin_id: B.pluginId || A,
      scope: B.scope || Q
    }), process.exit(0)
  } catch (B) {
    UmA(B, `uninstall plugin "${A}"`)
  }
}
// @from(Ln 465379, Col 0)
async function RN9(A, Q) {
  try {
    let B = await e3A(A, Q);
    if (!B.success) throw Error(B.message);
    console.log(`${tA.tick} ${B.message}`), l("tengu_plugin_enabled_cli", {
      plugin_id: B.pluginId || A,
      scope: B.scope
    }), process.exit(0)
  } catch (B) {
    UmA(B, `enable plugin "${A}"`)
  }
}
// @from(Ln 465391, Col 0)
async function _N9(A, Q) {
  try {
    let B = await MgA(A, Q);
    if (!B.success) throw Error(B.message);
    console.log(`${tA.tick} ${B.message}`), l("tengu_plugin_disabled_cli", {
      plugin_id: B.pluginId || A,
      scope: B.scope
    }), process.exit(0)
  } catch (B) {
    UmA(B, `disable plugin "${A}"`)
  }
}
// @from(Ln 465403, Col 0)
async function jN9(A, Q) {
  try {
    J9(`Checking for updates for plugin "${A}" at ${Q} scope…
`);
    let B = await czA(A, Q);
    if (!B.success) throw Error(B.message);
    if (J9(`${tA.tick} ${B.message}
`), !B.alreadyUpToDate) l("tengu_plugin_updated_cli", {
      plugin_id: A,
      old_version: B.oldVersion || "unknown",
      new_version: B.newVersion || "unknown"
    });
    await w3(0)
  } catch (B) {
    UmA(B, `update plugin "${A}"`)
  }
}
// @from(Ln 465420, Col 4)
TN9 = w(() => {
  B2();
  v1();
  Z0();
  yJ();
  pzA()
})
// @from(Ln 465431, Col 0)
function h$A() {
  let B = ((jQ() || {}).cleanupPeriodDays ?? RM7) * 24 * 60 * 60 * 1000;
  return new Date(Date.now() - B)
}
// @from(Ln 465436, Col 0)
function _M7(A, Q) {
  return {
    messages: A.messages + Q.messages,
    errors: A.errors + Q.errors
  }
}
// @from(Ln 465443, Col 0)
function jM7(A) {
  let Q = A.split(".")[0].replace(/T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z/, "T$1:$2:$3.$4Z");
  return new Date(Q)
}
// @from(Ln 465448, Col 0)
function PN9(A, Q, B) {
  let G = {
    messages: 0,
    errors: 0
  };
  try {
    let Z = vA().readdirSync(A);
    for (let Y of Z) try {
      if (jM7(Y.name) < Q)
        if (vA().unlinkSync(uj(A, Y.name)), B) G.messages++;
        else G.errors++
    } catch (J) {
      e(J)
    }
  } catch (Z) {
    if (Z instanceof Error && "code" in Z && Z.code !== "ENOENT") e(Z)
  }
  return G
}
// @from(Ln 465467, Col 0)
async function TM7() {
  let A = vA(),
    Q = h$A(),
    B = fl.errors(),
    G = fl.baseLogs(),
    Z = PN9(B, Q, !1);
  try {
    if (A.existsSync(G)) {
      let J = A.readdirSync(G).filter((X) => X.isDirectory() && X.name.startsWith("mcp-logs-")).map((X) => uj(G, X.name));
      for (let X of J) {
        Z = _M7(Z, PN9(X, Q, !0));
        try {
          if (A.isDirEmptySync(X)) A.rmdirSync(X)
        } catch {}
      }
    }
  } catch (Y) {
    if (Y instanceof Error && "code" in Y && Y.code !== "ENOENT") e(Y)
  }
  return Z
}
// @from(Ln 465489, Col 0)
function Ay0(A, Q, B, G) {
  let Z = {
    messages: 0,
    errors: 0
  };
  if (!G.existsSync(A)) return Z;
  let J = G.readdirSync(A).filter((X) => X.isFile() && X.name.endsWith(B));
  for (let X of J) try {
    let I = uj(A, X.name);
    if (G.statSync(I).mtime < Q) G.unlinkSync(I), Z.messages++
  } catch {
    Z.errors++
  }
  try {
    if (G.isDirEmptySync(A)) G.rmdirSync(A)
  } catch {
    Z.errors++
  }
  return Z
}
// @from(Ln 465510, Col 0)
function PM7() {
  let A = h$A(),
    Q = {
      messages: 0,
      errors: 0
    },
    B = wp(),
    G = vA();
  try {
    if (!G.existsSync(B)) return Q;
    let Y = G.readdirSync(B).filter((J) => J.isDirectory()).map((J) => uj(B, J.name));
    for (let J of Y) try {
      let X = Ay0(J, A, ".jsonl", G);
      if (Q.messages += X.messages, Q.errors += X.errors, G.existsSync(J)) try {
        let I = G.readdirSync(J);
        for (let D of I) {
          if (!D.isDirectory()) continue;
          let W = uj(J, D.name, dX0);
          if (!G.existsSync(W)) continue;
          try {
            let K = G.readdirSync(W);
            for (let V of K) {
              if (!V.isDirectory()) continue;
              let F = uj(W, V.name),
                H = Ay0(F, A, "", G);
              Q.messages += H.messages, Q.errors += H.errors;
              try {
                if (G.isDirEmptySync(F)) G.rmdirSync(F)
              } catch {}
            }
            try {
              if (G.isDirEmptySync(W)) G.rmdirSync(W)
            } catch {}
            try {
              let V = uj(J, D.name);
              if (G.isDirEmptySync(V)) G.rmdirSync(V)
            } catch {}
          } catch {}
        }
      } catch {
        Q.errors++
      }
      try {
        if (G.isDirEmptySync(J)) G.rmdirSync(J)
      } catch {}
    } catch {
      Q.errors++;
      continue
    }
  } catch {
    Q.errors++
  }
  return Q
}
// @from(Ln 465565, Col 0)
function SM7(A, Q, B = !0) {
  let G = h$A(),
    Z = {
      messages: 0,
      errors: 0
    },
    Y = vA();
  try {
    if (!Y.existsSync(A)) return Z;
    let J = Ay0(A, G, Q, Y);
    if (Z.messages += J.messages, Z.errors += J.errors, B) try {
      if (Y.isDirEmptySync(A)) Y.rmdirSync(A)
    } catch {}
  } catch {
    Z.errors++
  }
  return Z
}
// @from(Ln 465584, Col 0)
function xM7() {
  let A = uj(zQ(), "plans");
  return SM7(A, ".md")
}
// @from(Ln 465589, Col 0)
function yM7() {
  let A = h$A(),
    Q = {
      messages: 0,
      errors: 0
    },
    B = vA();
  try {
    let G = zQ(),
      Z = uj(G, "file-history");
    if (!B.existsSync(Z)) return Q;
    let J = B.readdirSync(Z).filter((X) => X.isDirectory()).map((X) => uj(Z, X.name));
    for (let X of J) try {
      if (!B.existsSync(X)) continue;
      if (B.statSync(X).mtime < A) B.rmSync(X, {
        recursive: !0,
        force: !0
      }), Q.messages++
    } catch {
      Q.errors++
    }
    try {
      if (B.isDirEmptySync(Z)) B.rmdirSync(Z)
    } catch {}
  } catch (G) {
    e(G)
  }
  return Q
}
// @from(Ln 465619, Col 0)
function vM7() {
  let A = h$A(),
    Q = {
      messages: 0,
      errors: 0
    },
    B = vA();
  try {
    let G = zQ(),
      Z = uj(G, "session-env");
    if (!B.existsSync(Z)) return Q;
    let J = B.readdirSync(Z).filter((X) => X.isDirectory()).map((X) => uj(Z, X.name));
    for (let X of J) try {
      if (!B.existsSync(X)) continue;
      if (B.statSync(X).mtime < A) B.rmSync(X, {
        recursive: !0,
        force: !0
      }), Q.messages++
    } catch {
      Q.errors++
    }
    try {
      if (B.isDirEmptySync(Z)) B.rmdirSync(Z)
    } catch {}
  } catch (G) {
    e(G)
  }
  return Q
}
// @from(Ln 465649, Col 0)
function xN9() {
  setImmediate(() => {
    TM7(), PM7(), xM7(), yM7(), vM7(), fT2(), KRB(h$A())
  }).unref()
}
// @from(Ln 465654, Col 4)
SN9
// @from(Ln 465654, Col 9)
RM7 = 30
// @from(Ln 465655, Col 2)
kM7 = 86400000
// @from(Ln 465656, Col 2)
KeJ
// @from(Ln 465657, Col 4)
yN9 = w(() => {
  wr();
  v1();
  cCA();
  DQ();
  GB();
  d4();
  fQ();
  GQ();
  T1();
  Z0();
  IHA();
  cB0();
  SN9 = c(qi(), 1);
  KeJ = 7 * kM7
})
// @from(Ln 465678, Col 0)
function hM7() {
  let A = SD(),
    Q = Jq(A);
  if (Q <= vN9) return Math.floor(Q * 0.8);
  return Q - vN9
}
// @from(Ln 465685, Col 0)
function gM7(A) {
  return a7(A).map((Q) => {
    if (Q.type === "user") {
      if (typeof Q.message.content === "string") return `User: ${Q.message.content}`;
      else if (Array.isArray(Q.message.content)) return `User: ${Q.message.content.filter((B)=>B.type==="text").map((B)=>B.type==="text"?B.text:"").join(`
`).trim()}`
    } else if (Q.type === "assistant") {
      let B = Xt(Q);
      if (B) return `Claude: ${nVA(B).trim()}`
    }
    return null
  }).filter((Q) => Q !== null).join(`

`)
}
// @from(Ln 465700, Col 0)
async function uM7(A, Q) {
  if (!A.length) throw Error("Can't summarize empty conversation");
  let B = [],
    G = 0,
    Z = hM7(),
    Y = null;
  for (let K = A.length - 1; K >= 0; K--) {
    let V = A[K];
    if (!V) continue;
    let F = sH([V]),
      H = 0;
    if (Y !== null && F > 0 && F < Y) H = Y - F;
    if (G + H > Z) break;
    if (B.unshift(V), G += H, F > 0) Y = F
  }
  let J = B.length < A.length;
  k(J ? `Summarizing last ${B.length} of ${A.length} messages (~${G} tokens)` : `Summarizing all ${A.length} messages (~${G} tokens)`);
  let X = gM7(B),
    D = [`Please write a 5-10 word title for the following conversation:

${J?`[Last ${B.length} of ${A.length} messages]

`:""}${X}
`, "Respond with the title for the conversation and nothing else."];
  return (await CF({
    systemPrompt: [fM7],
    userPrompt: D.join(`
`),
    enablePromptCaching: !0,
    signal: new AbortController().signal,
    options: {
      querySource: "summarize_for_resume",
      agents: [],
      isNonInteractiveSession: Q,
      hasAppendSystemPrompt: !1,
      mcpTools: []
    }
  })).message.content.filter((K) => K.type === "text").map((K) => K.text).join("")
}
// @from(Ln 465740, Col 0)
function mM7(A) {
  return kN9(wp(), A.replace(/[^a-zA-Z0-9]/g, "-"))
}
// @from(Ln 465744, Col 0)
function dM7(A) {
  let Q = vA();
  try {
    Q.statSync(A)
  } catch {
    return []
  }
  return Q.readdirSync(A).filter((G) => G.isFile() && G.name.endsWith(".jsonl")).map((G) => kN9(A, G.name)).sort((G, Z) => {
    let Y = Q.statSync(G);
    return Q.statSync(Z).mtime.getTime() - Y.mtime.getTime()
  })
}
// @from(Ln 465757, Col 0)
function cM7(A, Q) {
  let B = [],
    G = A;
  while (G) {
    let {
      isSidechain: Z,
      parentUuid: Y,
      ...J
    } = G;
    B.unshift(J), G = G.parentUuid ? Q.get(G.parentUuid) : void 0
  }
  return B
}
// @from(Ln 465771, Col 0)
function pM7(A) {
  let Q = vA();
  try {
    let {
      buffer: B
    } = Q.readSync(A, {
      length: 512
    }), G = B.toString("utf8"), Z = G.indexOf(`
`);
    if (Z === -1) return AQ(G.trim()).type === "summary";
    let Y = G.substring(0, Z);
    return AQ(Y).type === "summary"
  } catch {
    return !1
  }
}
// @from(Ln 465787, Col 0)
async function bN9(A) {
  if (p2()) return;
  let Q = mM7(o1()),
    B = dM7(Q);
  for (let G of B) try {
    if (pM7(G)) break;
    if (!BU(bM7(G, ".jsonl"))) continue;
    let {
      messages: J,
      summaries: X,
      leafUuids: I
    } = await Mp(G), D = [...J.values()].filter((W) => I.has(W.uuid));
    for (let W of D) {
      if (X.has(W.uuid)) continue;
      let K = cM7(W, J);
      if (K.length === 0) continue;
      try {
        let V = await uM7(K, A);
        if (V) await dJ9(W.uuid, V)
      } catch (V) {
        e(V instanceof Error ? V : Error(String(V)))
      }
    }
  } catch (Z) {
    e(Z instanceof Error ? Z : Error(String(Z)))
  }
}
// @from(Ln 465814, Col 4)
fM7
// @from(Ln 465814, Col 9)
vN9 = 50000
// @from(Ln 465815, Col 4)
fN9 = w(() => {
  nY();
  tQ();
  d4();
  v1();
  T1();
  DQ();
  d_();
  V2();
  uC();
  l2();
  FT();
  C0();
  A0();
  fM7 = `
Summarize this coding conversation in under 50 characters.
Capture the main task, key files, problems addressed, and current status.
`.trim()
})
// @from(Ln 465835, Col 0)
function ZU1() {
  return Qy0.default.createElement(C, null, "MCP servers may execute code or access system resources. All tool calls require approval. Learn more in the", " ", Qy0.default.createElement(i2, {
    url: "https://code.claude.com/docs/en/mcp"
  }, "MCP documentation"), ".")
}
// @from(Ln 465840, Col 4)
Qy0
// @from(Ln 465841, Col 4)
By0 = w(() => {
  fA();
  fA();
  Qy0 = c(QA(), 1)
})
// @from(Ln 465847, Col 0)
function gN9({
  serverNames: A,
  onDone: Q
}) {
  function B(Y) {
    let J = jQ() || {},
      X = J.enabledMcpjsonServers || [],
      I = J.disabledMcpjsonServers || [],
      [D, W] = b9Q(A, (K) => Y.includes(K));
    if (l("tengu_mcp_multidialog_choice", {
        approved: D.length,
        rejected: W.length
      }), D.length > 0) {
      let K = [...new Set([...X, ...D])];
      pB("localSettings", {
        enabledMcpjsonServers: K
      })
    }
    if (W.length > 0) {
      let K = [...new Set([...I, ...W])];
      pB("localSettings", {
        disabledMcpjsonServers: K
      })
    }
    Q()
  }
  let G = MQ(),
    Z = hN9.useCallback(() => {
      let J = (jQ() || {}).disabledMcpjsonServers || [],
        X = [...new Set([...J, ...A])];
      pB("localSettings", {
        disabledMcpjsonServers: X
      }), Q()
    }, [A, Q]);
  return H2("confirm:no", Z, {
    context: "Confirmation"
  }), y$.default.createElement(y$.default.Fragment, null, y$.default.createElement(T, {
    flexDirection: "column",
    gap: 1,
    padding: 1,
    borderStyle: "round",
    borderColor: "warning"
  }, y$.default.createElement(C, {
    bold: !0,
    color: "warning"
  }, A.length, " new MCP servers found in .mcp.json"), y$.default.createElement(C, null, "Select any you wish to enable."), y$.default.createElement(ZU1, null), y$.default.createElement(tC1, {
    options: A.map((Y) => ({
      label: Y,
      value: Y
    })),
    defaultValue: A,
    onSubmit: B
  })), y$.default.createElement(T, {
    marginLeft: 3
  }, y$.default.createElement(C, {
    dimColor: !0
  }, G.pending ? y$.default.createElement(y$.default.Fragment, null, "Press ", G.keyName, " again to exit") : y$.default.createElement(vQ, null, y$.default.createElement(F0, {
    shortcut: "Space",
    action: "select"
  }), y$.default.createElement(F0, {
    shortcut: "Enter",
    action: "confirm"
  }), y$.default.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "reject all"
  })))))
}
// @from(Ln 465916, Col 4)
y$
// @from(Ln 465916, Col 8)
hN9
// @from(Ln 465917, Col 4)
uN9 = w(() => {
  fA();
  dx0();
  c6();
  GB();
  f9Q();
  By0();
  E9();
  Z0();
  e9();
  I3();
  K6();
  y$ = c(QA(), 1), hN9 = c(QA(), 1)
})
// @from(Ln 465932, Col 0)
function mN9({
  serverName: A,
  onDone: Q
}) {
  function B(Z) {
    switch (l("tengu_mcp_dialog_choice", {
        choice: Z
      }), Z) {
      case "yes":
      case "yes_all": {
        let J = (jQ() || {}).enabledMcpjsonServers || [];
        if (!J.includes(A)) pB("localSettings", {
          enabledMcpjsonServers: [...J, A]
        });
        if (Z === "yes_all") pB("localSettings", {
          enableAllProjectMcpServers: !0
        });
        Q();
        break
      }
      case "no": {
        let J = (jQ() || {}).disabledMcpjsonServers || [];
        if (!J.includes(A)) pB("localSettings", {
          disabledMcpjsonServers: [...J, A]
        });
        Q();
        break
      }
    }
  }
  let G = MQ();
  return H2("confirm:no", Q, {
    context: "Confirmation"
  }), VM.default.createElement(VM.default.Fragment, null, VM.default.createElement(T, {
    flexDirection: "column",
    gap: 1,
    padding: 1,
    borderStyle: "round",
    borderColor: "warning"
  }, VM.default.createElement(C, {
    bold: !0,
    color: "warning"
  }, "New MCP server found in .mcp.json: ", A), VM.default.createElement(ZU1, null), VM.default.createElement(k0, {
    options: [{
      label: "Use this and all future MCP servers in this project",
      value: "yes_all"
    }, {
      label: "Use this MCP server",
      value: "yes"
    }, {
      label: "Continue without using this MCP server",
      value: "no"
    }],
    onChange: (Z) => B(Z),
    onCancel: () => B("no")
  })), VM.default.createElement(T, {
    marginLeft: 3
  }, VM.default.createElement(C, {
    dimColor: !0
  }, G.pending ? VM.default.createElement(VM.default.Fragment, null, "Press ", G.keyName, " again to exit") : VM.default.createElement(VM.default.Fragment, null, "Enter to confirm · Esc to reject"))))
}
// @from(Ln 465993, Col 4)
VM
// @from(Ln 465994, Col 4)
dN9 = w(() => {
  fA();
  u8();
  c6();
  GB();
  By0();
  E9();
  Z0();
  VM = c(QA(), 1)
})
// @from(Ln 466004, Col 0)
async function cN9() {
  let {
    servers: A
  } = GW("project"), Q = Object.keys(A).filter((B) => RF1(B) === "pending");
  if (Q.length === 0) return;
  await new Promise(async (B) => {
    let G = () => {
      process.stdout.write("\x1B[2J\x1B[3J\x1B[H", () => {
        B()
      })
    };
    if (Q.length === 1 && Q[0] !== void 0) {
      let Z = await Y5(d8A.default.createElement(b5, null, d8A.default.createElement(vJ, null, d8A.default.createElement(mN9, {
        serverName: Q[0],
        onDone: () => {
          Z.unmount?.(), G()
        }
      }))), FY(!1))
    } else {
      let Z = await Y5(d8A.default.createElement(b5, null, d8A.default.createElement(vJ, null, d8A.default.createElement(gN9, {
        serverNames: Q,
        onDone: () => {
          Z.unmount?.(), G()
        }
      }))), FY(!1))
    }
  })
}
// @from(Ln 466032, Col 4)
d8A
// @from(Ln 466033, Col 4)
pN9 = w(() => {
  fA();
  uN9();
  dN9();
  hB();
  G$();
  PJ();
  Kf();
  Bc();
  d8A = c(QA(), 1)
})
// @from(Ln 466045, Col 0)
function lN9(A) {
  return A.replace(/[A-Z]/g, (Q) => `_${Q.toLowerCase()}`)
}
// @from(Ln 466048, Col 0)
async function Gy0() {
  if (qmA.length === 0) return;
  let A = [...qmA];
  qmA = [];
  try {
    await xQ.post(lM7, A, {
      headers: {
        "Content-Type": "application/json",
        "DD-API-KEY": iM7
      },
      timeout: oM7
    })
  } catch (Q) {
    e(Q instanceof Error ? Q : Error(String(Q)))
  }
}
// @from(Ln 466065, Col 0)
function tM7() {
  if (mp) return;
  mp = setTimeout(() => {
    mp = null, Gy0()
  }, nM7).unref()
}
// @from(Ln 466071, Col 0)
async function Zy0(A, Q) {
  let B = YU1;
  if (B === null) B = await eM7();
  if (!B || !rM7.has(A)) return;
  try {
    let G = await dn({
        model: Q.model
      }),
      {
        envContext: Z,
        ...Y
      } = G,
      J = {
        ...Y,
        ...Z,
        ...Q
      };
    if (typeof J.toolName === "string" && J.toolName.startsWith("mcp__")) J.toolName = "mcp";
    if (typeof J.model === "string" && !J.model.startsWith("claude-")) J.model = "other";
    if (typeof J.version === "string") J.version = J.version.replace(/^(\d+\.\d+\.\d+-dev\.\d{8})\.t\d+\.sha[a-f0-9]+$/, "$1");
    if (J.status !== void 0 && J.status !== null) {
      let W = String(J.status);
      J.http_status = W;
      let K = W.charAt(0);
      if (K >= "1" && K <= "5") J.http_status_range = `${K}xx`;
      delete J.status
    }
    let X = J,
      D = {
        ddsource: "nodejs",
        ddtags: sM7.filter((W) => X[W] !== void 0 && X[W] !== null).map((W) => `${lN9(W)}:${X[W]}`).join(","),
        message: A,
        service: "claude-code",
        hostname: "claude-code",
        env: "external"
      };
    for (let [W, K] of Object.entries(J))
      if (K !== void 0 && K !== null) D[lN9(W)] = K;
    if (qmA.push(D), qmA.length >= aM7) {
      if (mp) clearTimeout(mp), mp = null;
      Gy0()
    } else tM7()
  } catch (G) {
    e(G instanceof Error ? G : Error(String(G)))
  }
}
// @from(Ln 466117, Col 4)
lM7 = "https://http-intake.logs.us5.datadoghq.com/api/v2/logs"
// @from(Ln 466118, Col 2)
iM7 = "pubbbf48e6d78dae54bceaa4acf463299bf"
// @from(Ln 466119, Col 2)
nM7 = 15000
// @from(Ln 466120, Col 2)
aM7 = 100
// @from(Ln 466121, Col 2)
oM7 = 5000
// @from(Ln 466122, Col 2)
rM7
// @from(Ln 466122, Col 7)
sM7
// @from(Ln 466122, Col 12)
qmA
// @from(Ln 466122, Col 17)
mp = null
// @from(Ln 466123, Col 2)
YU1 = null
// @from(Ln 466124, Col 2)
eM7
// @from(Ln 466125, Col 4)
iN9 = w(() => {
  j5();
  Y9();
  v1();
  hW();
  Mu();
  rM7 = new Set(["tengu_api_error", "tengu_api_success", "tengu_compact_failed", "tengu_model_fallback_triggered", "tengu_oauth_error", "tengu_oauth_success", "tengu_oauth_token_refresh_failure", "tengu_oauth_token_refresh_success", "tengu_oauth_token_refresh_lock_acquiring", "tengu_oauth_token_refresh_lock_acquired", "tengu_oauth_token_refresh_starting", "tengu_oauth_token_refresh_completed", "tengu_oauth_token_refresh_lock_releasing", "tengu_oauth_token_refresh_lock_released", "tengu_query_error", "tengu_tool_use_error", "tengu_tool_use_success"]), sM7 = ["arch", "clientType", "errorType", "http_status_range", "http_status", "model", "platform", "provider", "toolName", "userType", "version", "versionBase"];
  qmA = [];
  eM7 = W0(async () => {
    if (gW()) return YU1 = !1, !1;
    try {
      let A = async () => {
        if (mp) clearTimeout(mp), mp = null;
        await Gy0()
      };
      return process.on("beforeExit", A), YU1 = !0, !0
    } catch (A) {
      return e(A instanceof Error ? A : Error(String(A))), YU1 = !1, !1
    }
  })
})
// @from(Ln 466147, Col 0)
function oN9() {
  if (Yy0 !== void 0) return Yy0;
  try {
    return f8(nN9)
  } catch {
    return !1
  }
}
// @from(Ln 466156, Col 0)
function rN9() {
  if (Jy0 !== void 0) return Jy0;
  try {
    return f8(aN9)
  } catch {
    return !1
  }
}
// @from(Ln 466165, Col 0)
function AR7(A, Q) {
  let B = ma1(A);
  if (B === 0) return;
  let G = B !== null ? {
    ...Q,
    sample_rate: B
  } : Q;
  if (qeQ(A, G), oN9()) Dz0(A, G);
  if (rN9()) Zy0(A, G);
  ca1(A, G)
}
// @from(Ln 466176, Col 0)
async function QR7(A, Q) {
  let B = ma1(A);
  if (B === 0) return;
  let G = B !== null ? {
      ...Q,
      sample_rate: B
    } : Q,
    Z = [dp1(A, G)];
  if (oN9()) Z.push(Dz0(A, G));
  if (rN9()) Zy0(A, G);
  ca1(A, G), await Promise.all(Z)
}
// @from(Ln 466188, Col 0)
async function sN9() {
  Yy0 = f8(nN9), Jy0 = f8(aN9)
}
// @from(Ln 466192, Col 0)
function tN9() {
  Uh0({
    logEvent: AR7,
    logEventAsync: QR7
  })
}
// @from(Ln 466198, Col 4)
nN9 = "tengu_log_segment_events"
// @from(Ln 466199, Col 2)
aN9 = "tengu_log_datadog_events"
// @from(Ln 466200, Col 2)
Yy0 = void 0
// @from(Ln 466201, Col 2)
Jy0 = void 0
// @from(Ln 466202, Col 4)
eN9 = w(() => {
  BI();
  w6();
  Wz0();
  iN9();
  FMA();
  Z0()
})
// @from(Ln 466215, Col 0)
function Gw9() {
  return Qw9(fl.errors(), Bw9 + ".jsonl")
}
// @from(Ln 466219, Col 0)
function Xy0(A) {
  return Qw9(fl.mcpLogs(A), Bw9 + ".jsonl")
}
// @from(Ln 466223, Col 0)
function GR7(A) {
  let Q = xdA(A);
  return {
    write(B) {
      Q.write(eA(B) + `
`)
    },
    flush: Q.flush,
    dispose: Q.dispose
  }
}
// @from(Ln 466235, Col 0)
function Iy0(A) {
  let Q = Aw9.get(A);
  if (!Q) {
    let B = BR7(A);
    Q = GR7({
      writeFn: (G) => {
        try {
          vA().appendFileSync(A, G)
        } catch {
          vA().mkdirSync(B), vA().appendFileSync(A, G)
        }
      },
      flushIntervalMs: 1000,
      maxBufferSize: 50
    }), Aw9.set(A, Q), C6(async () => Q?.dispose())
  }
  return Q
}
// @from(Ln 466254, Col 0)
function ZR7(A, Q) {
  return
}
// @from(Ln 466258, Col 0)
function YR7(A) {
  let Q = A.stack || A.message;
  k(`${A.name}: ${Q}`, {
    level: "error"
  }), ZR7(Gw9(), {
    error: Q
  })
}
// @from(Ln 466267, Col 0)
function JR7(A, Q) {
  k(`MCP server "${A}" ${Q}`, {
    level: "error"
  });
  let B = Xy0(A),
    Z = {
      error: Q instanceof Error ? Q.stack || Q.message : String(Q),
      timestamp: new Date().toISOString(),
      sessionId: q0(),
      cwd: vA().cwd()
    };
  Iy0(B).write(Z)
}
// @from(Ln 466281, Col 0)
function XR7(A, Q) {
  k(`MCP server "${A}": ${Q}`);
  let B = Xy0(A),
    G = {
      debug: Q,
      timestamp: new Date().toISOString(),
      sessionId: q0(),
      cwd: vA().cwd()
    };
  Iy0(B).write(G)
}
// @from(Ln 466293, Col 0)
function Zw9() {
  Zg0({
    logError: YR7,
    logMCPError: JR7,
    logMCPDebug: XR7,
    getErrorsPath: Gw9,
    getMCPLogsPath: Xy0
  }), k("Error log sink initialized")
}
// @from(Ln 466302, Col 4)
Bw9
// @from(Ln 466302, Col 9)
Aw9
// @from(Ln 466303, Col 4)
Yw9 = w(() => {
  cCA();
  T1();
  nX();
  A0();
  C0();
  DQ();
  v1();
  Bw9 = Gg0(new Date);
  Aw9 = new Map
})
// @from(Ln 466314, Col 4)
IR7
// @from(Ln 466315, Col 4)
Jw9 = w(() => {
  A0();
  IR7 = c(mY1(), 1)
})
// @from(Ln 466320, Col 0)
function Xw9({
  onAccept: A
}) {
  JH.default.useEffect(() => {
    l("tengu_bypass_permissions_mode_dialog_shown", {})
  }, []);

  function Q(G) {
    switch (G) {
      case "accept": {
        l("tengu_bypass_permissions_mode_dialog_accept", {}), S0((Z) => {
          if (Z.bypassPermissionsModeAccepted === !0) return Z;
          return {
            ...Z,
            bypassPermissionsModeAccepted: !0
          }
        }), A();
        break
      }
      case "decline": {
        f6(1);
        break
      }
    }
  }
  let B = MQ();
  return J0((G, Z) => {
    if (Z.escape) {
      f6(0);
      return
    }
  }), JH.default.createElement(JH.default.Fragment, null, JH.default.createElement(T, {
    flexDirection: "column",
    gap: 1,
    padding: 1,
    borderStyle: "round",
    borderColor: "error"
  }, JH.default.createElement(C, {
    bold: !0,
    color: "error"
  }, "WARNING: Claude Code running in Bypass Permissions mode"), JH.default.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, JH.default.createElement(C, null, "In Bypass Permissions mode, Claude Code will not ask for your approval before running potentially dangerous commands.", JH.default.createElement(fD, null), "This mode should only be used in a sandboxed container/VM that has restricted internet access and can easily be restored if damaged."), JH.default.createElement(C, null, "By proceeding, you accept all responsibility for actions taken while running in Bypass Permissions mode."), JH.default.createElement(i2, {
    url: "https://code.claude.com/docs/en/security"
  })), JH.default.createElement(k0, {
    options: [{
      label: "No, exit",
      value: "decline"
    }, {
      label: "Yes, I accept",
      value: "accept"
    }],
    onChange: (G) => Q(G),
    onCancel: () => Q("decline")
  })), JH.default.createElement(T, {
    marginLeft: 3
  }, JH.default.createElement(C, {
    dimColor: !0
  }, B.pending ? JH.default.createElement(JH.default.Fragment, null, "Press ", B.keyName, " again to exit") : JH.default.createElement(JH.default.Fragment, null, "Enter to confirm · Esc to cancel"))))
}
// @from(Ln 466381, Col 4)
JH
// @from(Ln 466382, Col 4)
Iw9 = w(() => {
  fA();
  u8();
  GQ();
  Z0();
  E9();
  fA();
  yJ();
  JH = c(QA(), 1)
})
// @from(Ln 466393, Col 0)
function Dw9({
  onDone: A
}) {
  let [Q, B] = hX.default.useState(!1);
  hX.default.useEffect(() => {
    l("tengu_claude_in_chrome_onboarding_shown", {}), qp().then(B), S0((Z) => {
      return {
        ...Z,
        hasCompletedClaudeInChromeOnboarding: !0
      }
    })
  }, []);
  let G = MQ();
  return J0((Z, Y) => {
    if (Y.return || Y.escape) A()
  }), hX.default.createElement(hX.default.Fragment, null, hX.default.createElement(T, {
    flexDirection: "column",
    padding: 1,
    gap: 1,
    borderStyle: "round",
    borderColor: "chromeYellow",
    borderDimColor: !0
  }, hX.default.createElement(C, {
    bold: !0,
    color: "chromeYellow"
  }, "Claude in Chrome (Beta)"), hX.default.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, hX.default.createElement(C, null, "Claude in Chrome works with the Chrome extension to let you control your browser directly from Claude Code. You can navigate websites, fill forms, capture screenshots, record GIFs, and debug with console logs and network requests.", !Q && hX.default.createElement(hX.default.Fragment, null, hX.default.createElement(fD, null), hX.default.createElement(fD, null), "Requires the Chrome extension. Get started at", " ", hX.default.createElement(i2, {
    url: DR7
  }))), hX.default.createElement(C, {
    dimColor: !0
  }, "Site-level permissions are inherited from the Chrome extension. Manage permissions in the Chrome extension settings to control which sites Claude can browse, click, and type on", Q && hX.default.createElement(hX.default.Fragment, null, " ", "(", hX.default.createElement(i2, {
    url: WR7
  }), ")"), "."), hX.default.createElement(C, {
    dimColor: !0
  }, "For more info, use", " ", hX.default.createElement(C, {
    bold: !0,
    color: "chromeYellow"
  }, "/chrome"), " ", "or visit ", hX.default.createElement(i2, {
    url: "https://code.claude.com/docs/en/chrome"
  })))), hX.default.createElement(T, {
    marginLeft: 3,
    marginBottom: 2
  }, G.pending ? hX.default.createElement(C, {
    dimColor: !0
  }, "Press ", G.keyName, " again to exit") : hX.default.createElement(vzA, null)))
}
// @from(Ln 466441, Col 4)
hX
// @from(Ln 466441, Col 8)
DR7 = "https://claude.ai/chrome"
// @from(Ln 466442, Col 2)
WR7 = "https://clau.de/chrome/permissions"
// @from(Ln 466443, Col 4)
Ww9 = w(() => {
  fA();
  fA();
  GQ();
  Z0();
  E9();
  _E1();
  Se();
  hX = c(QA(), 1)
})
// @from(Ln 466454, Col 0)
function dp({
  newState: A,
  oldState: Q
}) {
  if (A.mainLoopModel !== Q.mainLoopModel && A.mainLoopModel === null) pB("userSettings", {
    model: void 0
  }), dAA(null);
  if (A.mainLoopModel !== Q.mainLoopModel && A.mainLoopModel !== null) pB("userSettings", {
    model: A.mainLoopModel
  }), dAA(A.mainLoopModel);
  if (A.showExpandedTodos !== Q.showExpandedTodos && L1().showExpandedTodos !== A.showExpandedTodos) {
    let B = A.showExpandedTodos;
    S0((G) => ({
      ...G,
      showExpandedTodos: B
    }))
  }
  if (Q !== null && A.todos !== Q.todos)
    for (let B in A.todos) d9A(A.todos[B], B);
  if (A.verbose !== Q.verbose && L1().verbose !== A.verbose) {
    let B = A.verbose;
    S0((G) => ({
      ...G,
      verbose: B
    }))
  }
  if (A.feedbackSurvey.timeLastShown !== Q.feedbackSurvey.timeLastShown && A.feedbackSurvey.timeLastShown !== null) {
    let B = A.feedbackSurvey.timeLastShown;
    S0((G) => ({
      ...G,
      feedbackSurveyState: {
        lastShownTime: B
      }
    }))
  }
  if (jJ() && A.mcp !== Q.mcp) {
    if (QX9(A.mcp.clients, A.mcp.tools, A.mcp.resources), ue()) q8A()
  }
  if (A.settings !== Q.settings) try {
    if (gA1(), uA1(), A.settings.env !== Q.settings.env) L8A()
  } catch (B) {
    e(B instanceof Error ? B : Error(`Failed to apply settings changes: ${B}`))
  }
}
// @from(Ln 466498, Col 4)
Kw9 = w(() => {
  GQ();
  GQ();
  C0();
  GB();
  Dd();
  E$A();
  $F();
  $$A();
  Q2();
  v1();
  fuA()
})
// @from(Ln 466512, Col 0)
function Vw9() {
  let A = L1();
  if (A.autoUpdates !== !1 || A.autoUpdatesProtectedForNative === !0) return;
  try {
    let Q = dB("userSettings") || {};
    pB("userSettings", {
      ...Q,
      env: {
        ...Q.env,
        DISABLE_AUTOUPDATER: "1"
      }
    }), l("tengu_migrate_autoupdates_to_settings", {
      was_user_preference: !0,
      already_had_env_var: !!Q.env?.DISABLE_AUTOUPDATER
    }), process.env.DISABLE_AUTOUPDATER = "1", S0((B) => {
      let {
        autoUpdates: G,
        autoUpdatesProtectedForNative: Z,
        ...Y
      } = B;
      return Y
    })
  } catch (Q) {
    e(Error(`Failed to migrate auto-updates: ${Q}`)), l("tengu_migrate_autoupdates_error", {
      has_error: !0
    })
  }
}
// @from(Ln 466540, Col 4)
Fw9 = w(() => {
  GQ();
  GB();
  Z0();
  v1()
})
// @from(Ln 466547, Col 0)
function Hw9() {
  let A = JG(),
    Q = A.enableAllProjectMcpServers !== void 0,
    B = A.enabledMcpjsonServers && A.enabledMcpjsonServers.length > 0,
    G = A.disabledMcpjsonServers && A.disabledMcpjsonServers.length > 0;
  if (!Q && !B && !G) return;
  try {
    let Z = dB("localSettings") || {},
      Y = {},
      J = [];
    if (Q && Z.enableAllProjectMcpServers === void 0) Y.enableAllProjectMcpServers = A.enableAllProjectMcpServers, J.push("enableAllProjectMcpServers");
    else if (Q) J.push("enableAllProjectMcpServers");
    if (B && A.enabledMcpjsonServers) {
      let X = Z.enabledMcpjsonServers || [];
      Y.enabledMcpjsonServers = [...new Set([...X, ...A.enabledMcpjsonServers])], J.push("enabledMcpjsonServers")
    }
    if (G && A.disabledMcpjsonServers) {
      let X = Z.disabledMcpjsonServers || [];
      Y.disabledMcpjsonServers = [...new Set([...X, ...A.disabledMcpjsonServers])], J.push("disabledMcpjsonServers")
    }
    if (Object.keys(Y).length > 0) pB("localSettings", Y);
    if (J.includes("enableAllProjectMcpServers") || J.includes("enabledMcpjsonServers") || J.includes("disabledMcpjsonServers")) BZ((X) => {
      let {
        enableAllProjectMcpServers: I,
        enabledMcpjsonServers: D,
        disabledMcpjsonServers: W,
        ...K
      } = X;
      return K
    });
    l("tengu_migrate_mcp_approval_fields_success", {
      migratedCount: J.length
    })
  } catch {
    l("tengu_migrate_mcp_approval_fields_error", {})
  }
}
// @from(Ln 466584, Col 4)
Ew9 = w(() => {
  GQ();
  GB();
  Z0()
})
// @from(Ln 466593, Col 0)
function zw9() {
  let Q = JG().ignorePatterns;
  if (!Q || !Array.isArray(Q) || Q.length === 0) return;
  let B = [];
  for (let Y of Q) {
    let J = w01(Y);
    if (KR7.isAbsolute(J) && !J.startsWith("//")) J = "/" + J;
    B.push({
      toolName: "Read",
      ruleContent: J
    }, {
      toolName: "Edit",
      ruleContent: J
    })
  }
  if (U01({
      ruleValues: B,
      ruleBehavior: "deny"
    }, "localSettings")) try {
    BZ((Y) => {
      let {
        ignorePatterns: J,
        ...X
      } = Y;
      return X
    }), l("tengu_migrate_ignore_patterns_success", {
      ignore_patterns_count: Q.length
    })
  } catch (Y) {
    e(Error(`Failed to remove ignorePatterns from config: ${Y instanceof Error?Y.message:String(Y)}`)), l("tengu_migrate_ignore_patterns_config_cleanup_error", {
      ignore_patterns_count: Q.length
    })
  } else e(Error("Failed to migrate ignorePatterns to settings permissions")), l("tengu_migrate_ignore_patterns_error", {
    ignore_patterns_count: Q.length
  })
}
// @from(Ln 466629, Col 4)
$w9 = w(() => {
  GQ();
  Z0();
  v1();
  AY();
  eQA()
})
// @from(Ln 466637, Col 0)
function Cw9() {
  if (L1().sonnet45MigrationComplete) return;
  if (R4() !== "firstParty") {
    S0((G) => ({
      ...G,
      sonnet45MigrationComplete: !0
    }));
    return
  }
  if (jQ()?.model !== void 0) {
    pB("userSettings", {
      model: void 0
    });
    let G = Date.now();
    S0((Z) => ({
      ...Z,
      sonnet45MigrationComplete: !0,
      sonnet45MigrationTimestamp: G
    }))
  } else S0((G) => ({
    ...G,
    sonnet45MigrationComplete: !0
  }))
}
// @from(Ln 466661, Col 4)
Uw9 = w(() => {
  GQ();
  GB();
  MD()
})
// @from(Ln 466667, Col 0)
function qw9() {
  if (L1().opus45MigrationComplete) return;
  let Q = R4(),
    B = OOA() || MOA();
  if (Q !== "firstParty" || !B) {
    S0((Z) => ({
      ...Z,
      opus45MigrationComplete: !0
    }));
    return
  }
  if (jQ()?.model !== void 0) pB("userSettings", {
    model: void 0
  });
  S0((Z) => ({
    ...Z,
    opus45MigrationComplete: !0
  }))
}
// @from(Ln 466686, Col 4)
Nw9 = w(() => {
  GQ();
  GB();
  MD();
  l2()
})
// @from(Ln 466693, Col 0)
function ww9() {
  if (L1().opusProMigrationComplete) return;
  if (R4() !== "firstParty" || !rJA()) {
    S0((G) => ({
      ...G,
      opusProMigrationComplete: !0
    }));
    return
  }
  if (jQ()?.model === void 0) {
    let G = Date.now();
    S0((Z) => ({
      ...Z,
      opusProMigrationComplete: !0,
      opusProMigrationTimestamp: G
    }))
  } else S0((G) => ({
    ...G,
    opusProMigrationComplete: !0
  }))
}
// @from(Ln 466714, Col 4)
Lw9 = w(() => {
  GQ();
  GB();
  MD();
  l2()
})
// @from(Ln 466721, Col 0)
function Ow9() {
  if (L1().thinkingMigrationComplete) return;
  if (jQ().alwaysThinkingEnabled !== !1) {
    S0((B) => ({
      ...B,
      thinkingMigrationComplete: !0
    }));
    return
  }
  pB("userSettings", {
    alwaysThinkingEnabled: void 0
  }), S0((B) => ({
    ...B,
    thinkingMigrationComplete: !0
  }))
}
// @from(Ln 466737, Col 4)
Mw9 = w(() => {
  GQ();
  GB();
  GB()
})
// @from(Ln 466743, Col 0)
function NmA(A, Q, B, G) {
  let Z = {
    type: "permissionPromptTool",
    permissionPromptToolName: Q.name,
    toolResult: A
  };
  if (A.behavior === "allow") {
    let Y = A.updatedPermissions;
    if (Y) G.setAppState((J) => ({
      ...J,
      toolPermissionContext: Wk(J.toolPermissionContext, Y)
    })), cMA(Y);
    return {
      ...A,
      decisionReason: Z
    }
  } else if (A.behavior === "deny" && A.interrupt) G.abortController.abort();
  return {
    ...A,
    decisionReason: Z
  }
}
// @from(Ln 466765, Col 4)
d1X
// @from(Ln 466765, Col 9)
VR7
// @from(Ln 466765, Col 14)
FR7
// @from(Ln 466765, Col 19)
JU1
// @from(Ln 466766, Col 4)
Dy0 = w(() => {
  j9();
  iI0();
  dW();
  d1X = k2.object({
    tool_name: k2.string().describe("The name of the tool requesting permission"),
    input: k2.record(k2.string(), k2.unknown()).describe("The input for the tool"),
    tool_use_id: k2.string().optional().describe("The unique tool use request ID")
  }), VR7 = k2.object({
    behavior: k2.literal("allow"),
    updatedInput: k2.record(k2.string(), k2.unknown()),
    updatedPermissions: k2.array(eZ1).optional(),
    toolUseID: k2.string().optional()
  }), FR7 = k2.object({
    behavior: k2.literal("deny"),
    message: k2.string(),
    interrupt: k2.boolean().optional(),
    toolUseID: k2.string().optional()
  }), JU1 = k2.union([VR7, FR7])
})
// @from(Ln 466790, Col 0)
function ER7(A) {
  if (!A) return;
  switch (A.type) {
    case "rule":
    case "mode":
    case "subcommandResults":
    case "permissionPromptTool":
      return;
    case "hook":
    case "asyncAgent":
    case "sandboxOverride":
    case "classifier":
    case "workingDir":
    case "other":
      return A.reason
  }
}
// @from(Ln 466807, Col 0)
class wmA {
  input;
  replayUserMessages;
  structuredInput;
  pendingRequests = new Map;
  inputClosed = !1;
  unexpectedResponseCallback;
  constructor(A, Q) {
    this.input = A;
    this.replayUserMessages = Q;
    this.input = A, this.structuredInput = this.read()
  }
  async * read() {
    let A = "";
    for await (let Q of this.input) {
      A += Q;
      let B;
      while ((B = A.indexOf(`
`)) !== -1) {
        let G = A.slice(0, B);
        A = A.slice(B + 1);
        let Z = await this.processLine(G);
        if (Z) yield Z
      }
    }
    if (A) {
      let Q = await this.processLine(A);
      if (Q) yield Q
    }
    this.inputClosed = !0;
    for (let Q of this.pendingRequests.values()) Q.reject(Error("Tool permission stream closed before response received"))
  }
  getPendingPermissionRequests() {
    return Array.from(this.pendingRequests.values()).map((A) => A.request).filter((A) => A.request.subtype === "can_use_tool")
  }
  setUnexpectedResponseCallback(A) {
    this.unexpectedResponseCallback = A
  }
  async processLine(A) {
    try {
      let Q = AQ(A);
      if (Q.type === "keep_alive") return;
      if (Q.type === "control_response") {
        let B = this.pendingRequests.get(Q.response.request_id);
        if (!B) {
          if (this.unexpectedResponseCallback) await this.unexpectedResponseCallback(Q);
          return
        }
        if (this.pendingRequests.delete(Q.response.request_id), Q.response.subtype === "error") {
          B.reject(Error(Q.response.error));
          return
        }
        let G = Q.response.response;
        if (B.schema) try {
          B.resolve(B.schema.parse(G))
        } catch (Z) {
          B.reject(Z)
        } else B.resolve({});
        if (this.replayUserMessages) return Q;
        return
      }
      if (Q.type !== "user" && Q.type !== "control_request") Wy0(`Error: Expected message type 'user' or 'control', got '${Q.type}'`);
      if (Q.type === "control_request") {
        if (!Q.request) Wy0("Error: Missing request on control_request");
        return Q
      }
      if (Q.message.role !== "user") Wy0(`Error: Expected message role 'user', got '${Q.message.role}'`);
      return Q
    } catch (Q) {
      console.error(`Error parsing streaming input line: ${A}: ${Q}`), process.exit(1)
    }
  }
  write(A) {
    J9(eA(A) + `
`)
  }
  async sendRequest(A, Q, B) {
    let G = HR7(),
      Z = {
        type: "control_request",
        request_id: G,
        request: A
      };
    if (this.inputClosed) throw Error("Stream closed");
    if (B?.aborted) throw Error("Request aborted");
    this.write(Z);
    let Y = () => {
      this.write({
        type: "control_cancel_request",
        request_id: G
      });
      let J = this.pendingRequests.get(G);
      if (J) J.reject(new aG)
    };
    if (B) B.addEventListener("abort", Y, {
      once: !0
    });
    try {
      return await new Promise((J, X) => {
        this.pendingRequests.set(G, {
          request: {
            type: "control_request",
            request_id: G,
            request: A
          },
          resolve: (I) => {
            J(I)
          },
          reject: X,
          schema: Q
        })
      })
    } finally {
      if (B) B.removeEventListener("abort", Y);
      this.pendingRequests.delete(G)
    }
  }
  createCanUseTool() {
    return async (A, Q, B, G, Z) => {
      let Y = await B$(A, Q, B, G, Z);
      if (Y.behavior === "allow" || Y.behavior === "deny") return Y;
      try {
        let J = await this.sendRequest({
          subtype: "can_use_tool",
          tool_name: A.name,
          input: Q,
          permission_suggestions: Y.suggestions,
          blocked_path: Y.blockedPath,
          decision_reason: ER7(Y.decisionReason),
          tool_use_id: Z,
          agent_id: B.agentId
        }, JU1, B.abortController.signal);
        return NmA(J, A, Q, B)
      } catch (J) {
        return NmA({
          behavior: "deny",
          message: `Tool permission request failed: ${J}`,
          toolUseID: Z
        }, A, Q, B)
      }
    }
  }
  createHookCallback(A, Q) {
    return {
      type: "callback",
      timeout: Q,
      callback: async (B, G, Z) => {
        try {
          return await this.sendRequest({
            subtype: "hook_callback",
            callback_id: A,
            input: B,
            tool_use_id: G || void 0
          }, AY1, Z)
        } catch (Y) {
          return console.error(`Error in hook callback ${A}:`, Y), {}
        }
      }
    }
  }
  async sendMcpMessage(A, Q) {
    return (await this.sendRequest({
      subtype: "mcp_message",
      server_name: A,
      message: Q
    }, m.object({
      mcp_response: m.any()
    }))).mcp_response
  }
}
// @from(Ln 466978, Col 0)
function Wy0(A) {
  console.error(A), process.exit(1)
}
// @from(Ln 466981, Col 4)
Ky0 = w(() => {
  YZ();
  j9();
  Dy0();
  nI0();
  XX();
  A0()
})
// @from(Ln 466989, Col 0)
class Vy0 {
  ws = null;
  lastSentId = null;
  url;
  state = "idle";
  onData;
  onCloseCallback;
  headers;
  sessionId;
  reconnectAttempts = 0;
  reconnectTimer = null;
  pingInterval = null;
  messageBuffer;
  constructor(A, Q = {}, B) {
    this.url = A, this.headers = Q, this.sessionId = B, this.messageBuffer = new pSA(zR7)
  }
  connect() {
    if (this.state !== "idle" && this.state !== "reconnecting") {
      k(`WebSocketTransport: Cannot connect, current state is ${this.state}`, {
        level: "error"
      }), OB("error", "cli_websocket_connect_failed");
      return
    }
    this.state = "reconnecting";
    let A = Date.now();
    k(`WebSocketTransport: Opening ${this.url.href}`), OB("info", "cli_websocket_connect_opening");
    let Q = {
      ...this.headers
    };
    if (this.lastSentId) Q["X-Last-Request-Id"] = this.lastSentId, k(`WebSocketTransport: Adding X-Last-Request-Id header: ${this.lastSentId}`);
    this.ws = new Ok(this.url.href, {
      headers: Q,
      agent: COA(this.url.href)
    }), this.ws.on("open", () => {
      let B = Date.now() - A;
      k("WebSocketTransport: Connected"), OB("info", "cli_websocket_connect_connected", {
        duration_ms: B
      });
      let G = this.ws.upgradeReq;
      if (G?.headers?.["x-last-request-id"]) {
        let Z = G.headers["x-last-request-id"];
        this.replayBufferedMessages(Z)
      }
      this.reconnectAttempts = 0, this.state = "connected", this.startPingInterval(), F42(() => {
        if (this.state === "connected" && this.ws) try {
          this.ws.send(eA({
            type: "keep_alive"
          }) + `
`), k("WebSocketTransport: Sent keep_alive (activity signal)")
        } catch (Z) {
          k(`WebSocketTransport: Keep-alive failed: ${Z}`, {
            level: "error"
          }), OB("error", "cli_websocket_keepalive_failed")
        }
      })
    }), this.ws.on("message", (B) => {
      let G = B.toString();
      if (this.onData) this.onData(G)
    }), this.ws.on("error", (B) => {
      k(`WebSocketTransport: Error: ${B.message}`, {
        level: "error"
      }), OB("error", "cli_websocket_connect_error"), this.handleConnectionError()
    }), this.ws.on("close", (B, G) => {
      k(`WebSocketTransport: Closed: ${B}`, {
        level: "error"
      }), OB("error", "cli_websocket_connect_closed"), this.handleConnectionError()
    })
  }
  sendLine(A) {
    if (!this.ws || this.state !== "connected") return k("WebSocketTransport: Not connected"), OB("info", "cli_websocket_send_not_connected"), !1;
    try {
      return this.ws.send(A), !0
    } catch (Q) {
      return k(`WebSocketTransport: Failed to send: ${Q}`, {
        level: "error"
      }), OB("error", "cli_websocket_send_error"), this.ws = null, this.handleConnectionError(), !1
    }
  }
  doDisconnect() {
    if (this.stopPingInterval(), bX0(), this.ws) this.ws.close(), this.ws = null
  }
  handleConnectionError() {
    if (k(`WebSocketTransport: Disconnected from ${this.url.href}`), OB("info", "cli_websocket_disconnected"), this.doDisconnect(), this.state === "closing" || this.state === "closed") return;
    if (this.reconnectAttempts < Rw9) {
      if (this.reconnectTimer) clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
      this.state = "reconnecting", this.reconnectAttempts++;
      let A = Math.min($R7 * Math.pow(2, this.reconnectAttempts - 1), CR7);
      k(`WebSocketTransport: Reconnecting in ${A}ms (attempt ${this.reconnectAttempts}/${Rw9})`), OB("error", "cli_websocket_reconnect_attempt", {
        reconnectAttempts: this.reconnectAttempts
      }), this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null, this.connect()
      }, A)
    } else if (k(`WebSocketTransport: Max reconnection attempts reached for ${this.url.href}`, {
        level: "error"
      }), OB("error", "cli_websocket_reconnect_exhausted", {
        reconnectAttempts: this.reconnectAttempts
      }), this.state = "closed", this.onCloseCallback) this.onCloseCallback()
  }
  close() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
    this.stopPingInterval(), bX0(), this.state = "closing", this.doDisconnect()
  }
  replayBufferedMessages(A) {
    let Q = this.messageBuffer.toArray();
    if (Q.length === 0) return;
    let B = 0;
    if (A) {
      let Z = Q.findIndex((Y) => ("uuid" in Y) && Y.uuid === A);
      if (Z >= 0) B = Z + 1
    }
    let G = Q.slice(B);
    if (G.length === 0) {
      k("WebSocketTransport: No new messages to replay"), OB("info", "cli_websocket_no_messages_to_replay");
      return
    }
    k(`WebSocketTransport: Replaying ${G.length} buffered messages`), OB("info", "cli_websocket_messages_to_replay", {
      count: G.length
    });
    for (let Z of G) {
      let Y = eA(Z) + `
`;
      if (!this.sendLine(Y)) {
        this.handleConnectionError();
        break
      }
    }
  }
  isConnectedStatus() {
    return this.state === "connected"
  }
  setOnData(A) {
    this.onData = A
  }
  setOnClose(A) {
    this.onCloseCallback = A
  }
  write(A) {
    if ("uuid" in A && typeof A.uuid === "string") this.messageBuffer.add(A), this.lastSentId = A.uuid;
    let Q = eA(A) + `
`;
    if (this.state !== "connected") return;
    let B = this.sessionId ? ` session=${this.sessionId}` : "";
    k(`WebSocketTransport: Sending message type=${A.type}${B}`), this.sendLine(Q)
  }
  startPingInterval() {
    this.stopPingInterval(), this.pingInterval = setInterval(() => {
      if (this.state === "connected" && this.ws) try {
        this.ws.ping()
      } catch (A) {
        k(`WebSocketTransport: Ping failed: ${A}`, {
          level: "error"
        }), OB("error", "cli_websocket_ping_failed")
      }
    }, UR7)
  }
  stopPingInterval() {
    if (this.pingInterval) clearInterval(this.pingInterval), this.pingInterval = null
  }
}
// @from(Ln 467148, Col 4)
zR7 = 1000
// @from(Ln 467149, Col 2)
Rw9 = 3
// @from(Ln 467150, Col 2)
$R7 = 1000
// @from(Ln 467151, Col 2)
CR7 = 30000
// @from(Ln 467152, Col 2)
UR7 = 1e4
// @from(Ln 467153, Col 4)
_w9 = w(() => {
  v_A();
  T1();
  fn();
  PL();
  A0()
})
// @from(Ln 467161, Col 0)
function jw9(A, Q = {}, B) {
  if (A.protocol === "ws:" || A.protocol === "wss:") return new Vy0(A, Q, B);
  else throw Error(`Unsupported protocol: ${A.protocol}`)
}
// @from(Ln 467165, Col 4)
Tw9 = w(() => {
  _w9()
})
// @from(Ln 467174, Col 4)
Fy0
// @from(Ln 467175, Col 4)
Pw9 = w(() => {
  Ky0();
  Tw9();
  nX();
  sG1();
  C0();
  Fy0 = class Fy0 extends wmA {
    url;
    transport;
    inputStream;
    constructor(A, Q, B) {
      let G = new NR7({
        encoding: "utf8"
      });
      super(G, B);
      this.inputStream = G, this.url = new qR7(A);
      let Z = {},
        Y = G4A();
      if (Y) Z.Authorization = `Bearer ${Y}`;
      let J = process.env.CLAUDE_CODE_ENVIRONMENT_RUNNER_VERSION;
      if (J) Z["x-environment-runner-version"] = J;
      if (this.transport = jw9(this.url, Z, q0()), this.transport.setOnData((X) => {
          this.inputStream.write(X)
        }), this.transport.setOnClose(() => {
          this.inputStream.end()
        }), this.transport.connect(), C6(async () => this.close()), Q) {
        let X = this.inputStream;
        (async () => {
          for await (let I of Q) X.write(I + `
`)
        })()
      }
    }
    write(A) {
      this.transport.write(A)
    }
    close() {
      this.transport.close(), this.inputStream.end()
    }
  }
})
// @from(Ln 467217, Col 0)
function Sw9(A) {
  let Q = process.env.CLAUDE_CODE_EXIT_AFTER_STOP_DELAY,
    B = Q ? parseInt(Q, 10) : null,
    G = B && !isNaN(B) && B > 0,
    Z = null,
    Y = 0;
  return {
    start() {
      if (Z) clearTimeout(Z), Z = null;
      if (G) Y = Date.now(), Z = setTimeout(() => {
        let J = Date.now() - Y;
        if (A() && J >= B) k(`Exiting after ${B}ms of idle time`), f6()
      }, B)
    },
    stop() {
      if (Z) clearTimeout(Z), Z = null
    }
  }
}
// @from(Ln 467236, Col 4)
xw9 = w(() => {
  T1();
  yJ()
})
// @from(Ln 467244, Col 0)
function vw9(A) {
  try {
    let Q = new URL(A);
    return {
      sessionId: yw9(),
      ingressUrl: Q.href,
      isUrl: !0,
      jsonlFile: null,
      isJsonlFile: !1
    }
  } catch {
    if (BU(A)) return {
      sessionId: A,
      ingressUrl: null,
      isUrl: !1,
      jsonlFile: null,
      isJsonlFile: !1
    };
    if (A.endsWith(".jsonl")) return {
      sessionId: yw9(),
      ingressUrl: null,
      isUrl: !1,
      jsonlFile: A,
      isJsonlFile: !0
    }
  }
  return null
}
// @from(Ln 467272, Col 4)
kw9 = w(() => {
  d_()
})
// @from(Ln 467281, Col 0)
async function hw9(A, Q, B, G, Z, Y, J, X) {
  if (eO0(), await rVA()) await Y79();
  if (XB.isSandboxingEnabled()) try {
    await XB.initialize()
  } catch (L) {
    process.stderr.write(`
❌ Sandbox Error: ${L instanceof Error?L.message:String(L)}
`), f6(1, "other");
    return
  }
  if (X.resumeSessionAt && !X.resume) {
    process.stderr.write(`Error: --resume-session-at requires --resume
`), f6(1);
    return
  }
  if (X.rewindFiles && !X.resume) {
    process.stderr.write(`Error: --rewind-files requires --resume
`), f6(1);
    return
  }
  if (X.rewindFiles && A) {
    process.stderr.write(`Error: --rewind-files is a standalone operation and cannot be used with a prompt
`), f6(1);
    return
  }
  let I = await Q(),
    D = await jR7(B, {
      continue: X.continue,
      teleport: X.teleport,
      resume: X.resume,
      resumeSessionAt: X.resumeSessionAt,
      forkSession: X.forkSession
    });
  if (X.rewindFiles) {
    let L = D.find((j) => j.uuid === X.rewindFiles);
    if (!L || L.type !== "user") {
      process.stderr.write(`Error: --rewind-files requires a user message UUID, but ${X.rewindFiles} is not a user message in this session
`), f6(1);
      return
    }
    let M = await Q(),
      _ = await gw9(X.rewindFiles, M, B, !1);
    if (!_.canRewind) {
      process.stderr.write(`Error: ${_.error||"Unexpected error"}
`), f6(1);
      return
    }
    process.stdout.write(`Files rewound to state at message ${X.rewindFiles}
`), f6(0);
    return
  }
  let W = typeof X.resume === "string" && (Boolean(BU(X.resume)) || X.resume.endsWith(".jsonl")),
    K = Boolean(X.sdkUrl);
  if (!A && !W && !K) {
    process.stderr.write(`Error: Input must be provided either through stdin or as a prompt argument when using --print
`), f6(1);
    return
  }
  if (X.outputFormat === "stream-json" && !X.verbose) {
    process.stderr.write(`Error: When using --print, --output-format=stream-json requires --verbose
`), f6(1);
    return
  }
  let V = ubA(I.mcp.tools, I.toolPermissionContext),
    F = jJ() ? Z : [...Z, ...V],
    H = TR7(A, X),
    E = X.sdkUrl ? "stdio" : X.permissionPromptToolName,
    z = MR7(E, H, I.mcp.tools);
  if (X.permissionPromptToolName) F = F.filter((L) => L.name !== X.permissionPromptToolName);
  Tv0();
  let $ = [];
  for await (let L of LR7(H, I.mcp.clients, [...G, ...I.mcp.commands], F, D, z, Y, Q, B, J, X)) {
    if (X.outputFormat === "stream-json" && X.verbose) H.write(L);
    if (L.type !== "control_response" && L.type !== "control_request" && L.type !== "control_cancel_request" && L.type !== "stream_event" && L.type !== "keep_alive") $.push(L)
  }
  let O = QC($);
  switch (X.outputFormat) {
    case "json":
      if (!O || O.type !== "result") throw Error("No messages returned");
      if (X.verbose) {
        J9(eA($) + `
`);
        break
      }
      J9(eA(O) + `
`);
      break;
    case "stream-json":
      break;
    default:
      if (!O || O.type !== "result") throw Error("No messages returned");
      switch (O.subtype) {
        case "success":
          J9(O.result.endsWith(`
`) ? O.result : O.result + `
`);
          break;
        case "error_during_execution":
          J9("Execution error");
          break;
        case "error_max_turns":
          J9(`Error: Reached max turns (${X.maxTurns})`);
          break;
        case "error_max_budget_usd":
          J9(`Error: Exceeded USD budget (${X.maxBudgetUsd})`);
          break;
        case "error_max_structured_output_retries":
          J9("Error: Failed to provide valid structured output after maximum retries")
      }
  }
  AM0(), f6(O?.type === "result" && O?.is_error ? 1 : 0)
}
// @from(Ln 467394, Col 0)
function LR7(A, Q, B, G, Z, Y, J, X, I, D, W) {
  let K = !1,
    V = !1,
    F, H = new khA;
  if (W.enableAuthStatus) lq.getInstance().subscribe((p) => {
    H.enqueue({
      type: "auth_status",
      isAuthenticating: p.isAuthenticating,
      output: p.output,
      error: p.error,
      uuid: LmA(),
      session_id: q0()
    })
  });
  let E = $59(Z),
    z = [],
    $ = !1,
    O = Z;
  for (let y of E)
    if (y.type === "system" && y.subtype === "hook_response" && y.hook_event === "SessionStart") z.push(y);
  let M = zQA().map((y) => {
      return {
        value: y.value === null ? "default" : y.value,
        displayName: y.label,
        description: y.description
      }
    }),
    _ = W.userSpecifiedModel,
    j = [],
    x = [];
  async function b() {
    let y = new Set(Object.keys(J)),
      p = new Set(j.map((bA) => bA.name)),
      GA = Array.from(y).some((bA) => !p.has(bA)),
      WA = Array.from(p).some((bA) => !y.has(bA)),
      MA = j.some((bA) => bA.type === "pending");
    if (GA || WA || MA) {
      for (let jA of j)
        if (!y.has(jA.name)) {
          if (jA.type === "connected") await jA.cleanup()
        } let bA = await $r2(J, (jA, OA) => A.sendMcpMessage(jA, OA));
      j = bA.clients, x = bA.tools, cy2(j)
    }
  }
  b();
  let S = {
      clients: [],
      tools: [],
      configs: {}
    },
    u = Sw9(() => !K),
    f = async () => {
      if (K) return;
      if (K = !0, u.stop(), !$) {
        $ = !0;
        for (let WA of z) H.enqueue(WA)
      }
      await b();
      let y = [...Q, ...j, ...S.clients],
        p = [...G, ...x, ...S.tools],
        GA = Xq1();
      if (GA && !W.jsonSchema) {
        let WA = xZ1(GA);
        if (WA) p = [...p, WA]
      }
      try {
        let WA;
        while (WA = await $32(X, I)) {
          if (WA.mode !== "prompt" && WA.mode !== "orphaned-permission" && WA.mode !== "task-notification") throw Error("only prompt commands are supported in streaming mode");
          let MA = WA.value;
          F = c9();
          for await (let TA of v19({
            commands: B,
            prompt: MA,
            promptUuid: WA.uuid,
            cwd: wR7(),
            tools: p,
            verbose: W.verbose,
            mcpClients: y,
            maxThinkingTokens: W.maxThinkingTokens,
            maxTurns: W.maxTurns,
            maxBudgetUsd: W.maxBudgetUsd,
            canUseTool: Y,
            userSpecifiedModel: _,
            fallbackModel: W.fallbackModel,
            jsonSchema: Xq1() ?? W.jsonSchema,
            mutableMessages: O,
            customSystemPrompt: W.systemPrompt,
            appendSystemPrompt: W.appendSystemPrompt,
            getAppState: X,
            setAppState: I,
            abortController: F,
            replayUserMessages: W.replayUserMessages,
            includePartialMessages: W.includePartialMessages,
            agents: D,
            orphanedPermission: WA.orphanedPermission,
            setSDKStatus: (bA) => {
              H.enqueue({
                type: "system",
                subtype: "status",
                status: bA,
                session_id: q0(),
                uuid: LmA()
              })
            }
          })) {
            let bA = (TA.type === "assistant" || TA.type === "user") && TA.parent_tool_use_id,
              jA = TA.type === "user" && "isReplay" in TA && TA.isReplay;
            if (!bA && !jA && TA.type !== "stream_event") E.push(TA);
            H.enqueue(TA)
          }
          AM0(), eO0()
        }
      } catch (WA) {
        try {
          A.write({
            type: "result",
            subtype: "error_during_execution",
            duration_ms: 0,
            duration_api_ms: 0,
            is_error: !0,
            num_turns: 0,
            session_id: q0(),
            total_cost_usd: 0,
            usage: Cj,
            modelUsage: {},
            permission_denials: [],
            uuid: LmA(),
            errors: [WA instanceof Error ? WA.message : String(WA), ...E7A().map((MA) => MA.error)]
          })
        } catch {}
        f6(1);
        return
      } finally {
        K = !1, u.start()
      }
      if (V)
        if (W.loopy && !F?.signal.aborted) wF({
          mode: "prompt",
          value: `Continue. Time: ${new Date().toISOString()}`,
          uuid: LmA()
        }, I), f();
        else H.done()
    }, AA = function (y, p) {
      H.enqueue({
        type: "control_response",
        response: {
          subtype: "success",
          request_id: y.request_id,
          response: p
        }
      })
    }, n = function (y, p) {
      H.enqueue({
        type: "control_response",
        response: {
          subtype: "error",
          request_id: y.request_id,
          error: p
        }
      })
    };
  return A.setUnexpectedResponseCallback(async (y) => {
    await PR7({
      message: y,
      setAppState: I,
      onEnqueued: () => {
        f()
      }
    })
  }), (async () => {
    let y = !1;
    for await (let p of A.structuredInput) {
      if (p.type === "control_request") {
        if (p.request.subtype === "interrupt") {
          if (F) F.abort();
          AA(p)
        } else if (p.request.subtype === "initialize") {
          if (p.request.sdkMcpServers && p.request.sdkMcpServers.length > 0)
            for (let GA of p.request.sdkMcpServers) J[GA] = {
              type: "sdk",
              name: GA
            };
          await RR7(p.request, p.request_id, y, H, B, M, A, !!W.enableAuthStatus, W, D), y = !0
        } else if (p.request.subtype === "set_permission_mode") {
          let GA = p.request;
          I((WA) => ({
            ...WA,
            toolPermissionContext: _R7(GA, p.request_id, WA.toolPermissionContext, H)
          })), AA(p)
        } else if (p.request.subtype === "set_model") {
          let GA = p.request.model === "default" ? wu() : p.request.model;
          _ = GA, dAA(GA), AA(p)
        } else if (p.request.subtype === "set_max_thinking_tokens") {
          if (p.request.max_thinking_tokens === null) W.maxThinkingTokens = void 0;
          else W.maxThinkingTokens = p.request.max_thinking_tokens;
          AA(p)
        } else if (p.request.subtype === "mcp_status") {
          let GA = [...Q, ...j, ...S.clients].map((WA) => {
            return {
              name: WA.name,
              status: WA.type,
              serverInfo: WA.type === "connected" ? WA.serverInfo : void 0,
              error: WA.type === "failed" ? WA.error : void 0
            }
          });
          AA(p, {
            mcpServers: GA
          })
        } else if (p.request.subtype === "mcp_message") {
          let GA = p.request,
            WA = j.find((MA) => MA.name === GA.server_name);
          if (WA && WA.type === "connected" && WA.client?.transport?.onmessage) WA.client.transport.onmessage(GA.message);
          AA(p)
        } else if (p.request.subtype === "rewind_files") {
          let GA = await X(),
            WA = await gw9(p.request.user_message_id, GA, I, p.request.dry_run ?? !1);
          if (WA.canRewind || p.request.dry_run) AA(p, WA);
          else n(p, WA.error ?? "Unexpected error")
        } else if (p.request.subtype === "mcp_set_servers") {
          let GA = await SR7(p.request.servers, {
            configs: J,
            clients: j,
            tools: x
          }, S, I);
          for (let WA of Object.keys(J)) delete J[WA];
          if (Object.assign(J, GA.newSdkState.configs), j = GA.newSdkState.clients, x = GA.newSdkState.tools, S = GA.newDynamicState, AA(p, GA.response), GA.sdkServersChanged) b()
        }
        continue
      } else if (p.type === "control_response") {
        if (W.replayUserMessages) H.enqueue(p);
        continue
      } else if (p.type === "keep_alive") continue;
      if (y = !0, p.uuid) {
        let GA = q0();
        if (await pJ9(GA, p.uuid) || bw9.has(p.uuid)) {
          if (k(`Skipping duplicate user message: ${p.uuid}`), W.replayUserMessages) k(`Sending acknowledgment for duplicate user message: ${p.uuid}`), H.enqueue({
            type: "user",
            message: p.message,
            session_id: GA,
            parent_tool_use_id: null,
            uuid: p.uuid,
            isReplay: !0
          });
          continue
        }
        bw9.add(p.uuid)
      }
      I((GA) => ({
        ...GA,
        queuedCommands: [...GA.queuedCommands, {
          mode: "prompt",
          value: p.message.content,
          uuid: p.uuid
        }]
      })), f()
    }
    if (V = !0, !K) H.done()
  })(), H
}
// @from(Ln 467655, Col 0)
function OR7(A) {
  let Q = async (B, G, Z, Y, J) => {
    let X = await B$(B, G, Z, Y, J);
    if (X.behavior === "allow" || X.behavior === "deny") return X;
    let {
      signal: I,
      cleanup: D
    } = u_(Z.abortController.signal);
    if (I.aborted) return D(), {
      behavior: "deny",
      message: "Permission prompt was aborted.",
      decisionReason: {
        type: "permissionPromptTool",
        permissionPromptToolName: B.name,
        toolResult: void 0
      }
    };
    let W = new Promise((E) => {
        I.addEventListener("abort", () => E("aborted"), {
          once: !0
        })
      }),
      K = A.call({
        tool_name: B.name,
        input: G,
        tool_use_id: J
      }, Z, Q, Y),
      V = await Promise.race([K, W]);
    if (D(), V === "aborted" || I.aborted) return {
      behavior: "deny",
      message: "Permission prompt was aborted.",
      decisionReason: {
        type: "permissionPromptTool",
        permissionPromptToolName: B.name,
        toolResult: void 0
      }
    };
    let F = V,
      H = A.mapToolResultToToolResultBlockParam(F.data, "1");
    if (!H.content || !Array.isArray(H.content) || !H.content[0] || H.content[0].type !== "text" || typeof H.content[0].text !== "string") throw Error('Permission prompt tool returned an invalid result. Expected a single text block param with type="text" and a string text value.');
    return NmA(JU1.parse(c5(H.content[0].text)), A, G, Z)
  };
  return Q
}
// @from(Ln 467700, Col 0)
function MR7(A, Q, B) {
  if (A === "stdio") return Q.createCanUseTool();
  else if (A) {
    let G = B.find((Z) => Z.name === A);
    if (!G) {
      let Z = `Error: MCP tool ${A} (passed via --permission-prompt-tool) not found. Available MCP tools: ${B.map((Y)=>Y.name).join(", ")||"none"}`;
      throw process.stderr.write(`${Z}
`), f6(1), Error(Z)
    }
    if (!G.inputJSONSchema) {
      let Z = `Error: tool ${A} (passed via --permission-prompt-tool) must be an MCP tool`;
      throw process.stderr.write(`${Z}
`), f6(1), Error(Z)
    }
    return OR7(G)
  }
  return B$
}
// @from(Ln 467718, Col 0)
async function RR7(A, Q, B, G, Z, Y, J, X, I, D) {
  if (B) {
    G.enqueue({
      type: "control_response",
      response: {
        subtype: "error",
        error: "Already initialized",
        request_id: Q,
        pending_permission_requests: J.getPendingPermissionRequests()
      }
    });
    return
  }
  if (A.systemPrompt !== void 0) I.systemPrompt = A.systemPrompt;
  if (A.appendSystemPrompt !== void 0) I.appendSystemPrompt = A.appendSystemPrompt;
  if (A.agents) {
    let H = NY1(A.agents, "flagSettings");
    D.push(...H)
  }
  let K = jQ()?.outputStyle || vF,
    V = await d3A(o1()),
    F = cA1();
  if (A.hooks) {
    let H = {};
    for (let [E, z] of Object.entries(A.hooks)) H[E] = z.map(($) => {
      let O = $.hookCallbackIds.map((L) => {
        return J.createHookCallback(L, $.timeout)
      });
      return {
        matcher: $.matcher,
        hooks: O
      }
    });
    G7A(H)
  }
  if (A.jsonSchema) Ff0(A.jsonSchema);
  if (G.enqueue({
      type: "control_response",
      response: {
        subtype: "success",
        request_id: Q,
        response: {
          commands: Z.map((H) => ({
            name: H.userFacingName(),
            description: gzA(H),
            argumentHint: H.argumentHint || ""
          })),
          output_style: K,
          available_output_styles: Object.keys(V),
          models: Y,
          account: {
            email: F?.email,
            organization: F?.organization,
            subscriptionType: F?.subscription,
            tokenSource: F?.tokenSource,
            apiKeySource: F?.apiKeySource
          }
        }
      }
    }), X) {
    let E = lq.getInstance().getStatus();
    if (E) G.enqueue({
      type: "auth_status",
      isAuthenticating: E.isAuthenticating,
      output: E.output,
      error: E.error,
      uuid: LmA(),
      session_id: q0()
    })
  }
}
// @from(Ln 467789, Col 0)
async function gw9(A, Q, B, G) {
  if (!vG()) return {
    canRewind: !1,
    error: "File rewinding is not enabled."
  };
  if (!HW1(Q.fileHistory, A)) return {
    canRewind: !1,
    error: "No file checkpoint found for this message."
  };
  if (G) {
    let Z = WbA(Q.fileHistory, A);
    return {
      canRewind: !0,
      filesChanged: Z?.filesChanged,
      insertions: Z?.insertions,
      deletions: Z?.deletions
    }
  }
  try {
    await FW1((Z) => B((Y) => ({
      ...Y,
      fileHistory: Z(Y.fileHistory)
    })), A)
  } catch (Z) {
    return {
      canRewind: !1,
      error: `Failed to rewind: ${Z.message}`
    }
  }
  return {
    canRewind: !0
  }
}
// @from(Ln 467823, Col 0)
function _R7(A, Q, B, G) {
  if (A.mode === "bypassPermissions" && phA()) return G.enqueue({
    type: "control_response",
    response: {
      subtype: "error",
      request_id: Q,
      error: "Cannot set permission mode to bypassPermissions because it is disabled by settings or configuration"
    }
  }), B;
  return G.enqueue({
    type: "control_response",
    response: {
      subtype: "success",
      request_id: Q,
      response: {
        mode: A.mode
      }
    }
  }), Ty(B.mode, A.mode), {
    ...B,
    mode: A.mode
  }
}