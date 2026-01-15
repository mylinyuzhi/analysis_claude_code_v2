
// @from(Ln 453631, Col 0)
function cK9() {
  let [A, Q] = a0(), B = bp.useRef(null), G = bp.useRef(!1), Z = A.fileHistory.trackedFiles.size > 0, Y = bp.useCallback(async () => {
    if (!ZZ("tengu_code_diff_cli", !1)) return;
    let J = await uK9();
    Q((X) => {
      if (!_w7(X.gitDiff.stats, X.gitDiff.perFileStats, J)) return X;
      return {
        ...X,
        gitDiff: {
          ...X.gitDiff,
          stats: J?.stats ?? null,
          perFileStats: J?.perFileStats ?? new Map,
          hunks: J?.hunks ?? new Map,
          lastUpdated: Date.now()
        }
      }
    })
  }, [Q]);
  return bp.useEffect(() => {
    if (!Z) return;
    let J = !1,
      X = !0;
    async function I() {
      let D = Date.now();
      await Y();
      let W = Date.now() - D;
      if (X && W > Ow7) {
        G.current = !0;
        return
      }
      if (X = !1, !J) B.current = setTimeout(() => void I(), Lw7)
    }
    return I(), () => {
      if (J = !0, B.current) clearTimeout(B.current), B.current = null
    }
  }, [Z, Y]), bp.useMemo(() => {
    if (G.current) return null;
    if (!Z) return null;
    if (!A.gitDiff.stats) return null;
    return {
      stats: A.gitDiff.stats,
      perFileStats: A.gitDiff.perFileStats,
      hunks: A.gitDiff.hunks
    }
  }, [Z, A.gitDiff.stats, A.gitDiff.perFileStats, A.gitDiff.hunks])
}
// @from(Ln 453677, Col 4)
bp
// @from(Ln 453677, Col 8)
Lw7 = 20000
// @from(Ln 453678, Col 2)
Ow7 = 2000
// @from(Ln 453679, Col 4)
pK9 = w(() => {
  hB();
  tS0();
  w6();
  bp = c(QA(), 1)
})
// @from(Ln 453686, Col 0)
function iK9({
  exitMessage: A,
  vimMode: Q,
  mode: B,
  toolPermissionContext: G,
  suppressHint: Z,
  tasksSelected: Y,
  teamsSelected: J,
  diffSelected: X,
  isPasting: I,
  isSearching: D,
  historyQuery: W,
  setHistoryQuery: K,
  historyFailedMatch: V
}) {
  if (A.show) return P8.createElement(C, {
    dimColor: !0,
    key: "exit-message"
  }, "Press ", A.key, " again to exit");
  if (I) return P8.createElement(C, {
    dimColor: !0,
    key: "pasting-message"
  }, "Pasting text…");
  let F = We() && Q === "INSERT" && !D;
  return P8.createElement(T, {
    justifyContent: "flex-start",
    gap: 1
  }, D && P8.createElement(hK9, {
    value: W,
    onChange: K,
    historyFailedMatch: V
  }), F ? P8.createElement(C, {
    dimColor: !0,
    key: "vim-insert"
  }, "-- INSERT --") : null, P8.createElement(jw7, {
    mode: B,
    toolPermissionContext: G,
    showHint: !Z && !F,
    tasksSelected: Y,
    teamsSelected: J,
    diffSelected: X
  }))
}
// @from(Ln 453730, Col 0)
function jw7({
  mode: A,
  toolPermissionContext: Q,
  showHint: B,
  tasksSelected: G,
  teamsSelected: Z,
  diffSelected: Y
}) {
  let {
    columns: J
  } = ZB(), [{
    tasks: X,
    teamContext: I
  }] = a0(), D = lK9.useMemo(() => Object.values(X).filter(I8A).length, [X]), W = cK9(), K = ZZ("tengu_code_diff_cli", !1) ? W?.stats ?? null : null, V = !1;
  if (A === "bash") return P8.createElement(C, {
    color: "bashBorder"
  }, "! for bash mode");
  if (A === "background") return P8.createElement(C, {
    color: "background"
  }, "& to background");
  let F = Q?.mode,
    H = !b$B(F),
    E = D > 0,
    z = (H ? 1 : 0) + (E ? 1 : 0) + 0,
    O = (L1().codeDiffFooterEnabled ?? !0) && K && K.filesCount > 0 && z < 2 && (z === 0 || J >= 100),
    L = z < 2,
    M = [...F && H ? [P8.createElement(C, {
      color: iR(F),
      key: "mode"
    }, f$B(F), " ", su(F).toLowerCase(), " on", L && P8.createElement(C, {
      dimColor: !0
    }, " ", P8.createElement(F0, {
      shortcut: ec.displayText,
      action: "cycle",
      parens: !0
    })))] : [], ...E ? [P8.createElement(bK9, {
      key: "tasks",
      tasksSelected: G,
      showHint: B && !0
    })] : [], ...[], ...O ? [P8.createElement(C, {
      key: "code-changes",
      dimColor: !Y,
      inverse: Y,
      color: Y ? "background" : void 0
    }, K.filesCount, " ", K.filesCount === 1 ? "file" : "files", " ", P8.createElement(C, {
      color: "diffAddedWord"
    }, "+", K.linesAdded), " ", P8.createElement(C, {
      color: "diffRemovedWord"
    }, "-", K.linesRemoved), Y && B && P8.createElement(C, {
      dimColor: !0
    }, " · Enter to view"))] : []];
  if (M.length) return P8.createElement(T, null, P8.createElement(vQ, null, M));
  if (!B) return null;
  return P8.createElement(C, {
    dimColor: !0
  }, "? for shortcuts")
}
// @from(Ln 453787, Col 4)
P8
// @from(Ln 453787, Col 8)
lK9
// @from(Ln 453788, Col 4)
nK9 = w(() => {
  fA();
  fzA();
  x3A();
  mL();
  fK9();
  hB();
  gK9();
  pK9();
  e9();
  K6();
  P4();
  w6();
  GQ();
  P8 = c(QA(), 1), lK9 = c(QA(), 1)
})
// @from(Ln 453805, Col 0)
function eS0(A) {
  let Q = A?.statusLine,
    B = !1;
  return Q !== void 0 || !1
}
// @from(Ln 453811, Col 0)
function Tw7(A, Q) {
  if (!A) return {
    used: null,
    remaining: null
  };
  let B = A.input_tokens + A.cache_creation_input_tokens + A.cache_read_input_tokens,
    G = Math.round(B / Q * 100),
    Z = Math.min(100, Math.max(0, G));
  return {
    used: Z,
    remaining: 100 - Z
  }
}
// @from(Ln 453825, Col 0)
function Pw7(A, Q, B, G, Z) {
  let Y = HQA({
      permissionMode: A,
      mainLoopModel: B5(),
      exceeds200kTokens: Q
    }),
    J = B?.outputStyle || vF,
    X = reB(G),
    I = Jq(Y, SM()),
    D = Tw7(X, I);
  return {
    ...jE(),
    model: {
      id: Y,
      display_name: KC(Y)
    },
    workspace: {
      current_dir: o1(),
      project_dir: EQ()
    },
    version: {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.1.7",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      BUILD_TIME: "2026-01-13T22:55:21Z"
    }.VERSION,
    output_style: {
      name: J
    },
    cost: {
      total_cost_usd: $H(),
      total_duration_ms: PCA(),
      total_api_duration_ms: PM(),
      total_lines_added: r5A(),
      total_lines_removed: s5A()
    },
    context_window: {
      total_input_tokens: qdA(),
      total_output_tokens: NdA(),
      context_window_size: I,
      current_usage: X,
      used_percentage: D.used,
      remaining_percentage: D.remaining
    },
    exceeds_200k_tokens: Q,
    ...We() && {
      vim: {
        mode: Z ?? "INSERT"
      }
    }
  }
}
// @from(Ln 453880, Col 0)
function aK9({
  messages: A,
  vimMode: Q
}) {
  let B = fp.useRef(void 0),
    [{
      toolPermissionContext: G,
      statusLineText: Z
    }, Y] = a0(),
    J = YU(),
    X = fp.useRef({
      messageId: null,
      exceeds200kTokens: !1,
      permissionMode: G.mode,
      vimMode: Q
    }),
    I = fp.useCallback(async (K) => {
      B.current?.abort();
      let V = new AbortController;
      B.current = V;
      try {
        let F = X.current.exceeds200kTokens;
        if (K !== void 0) {
          let z = K.filter((L) => L.type === "assistant"),
            $ = z[z.length - 1],
            O = $?.uuid || $?.message?.id || null;
          if (O !== X.current.messageId) F = h51(K), X.current.messageId = O, X.current.exceeds200kTokens = F
        }
        let H = Pw7(X.current.permissionMode, F, J, K ?? [], Q),
          E = await Aq0(H, V.signal);
        if (!V.signal.aborted) Y((z) => ({
          ...z,
          statusLineText: E
        }))
      } catch {}
    }, [Y, J, Q]),
    D = ua(() => I(A), 300);
  fp.useEffect(() => {
    let K = A.filter((H) => H.type === "assistant"),
      V = K[K.length - 1],
      F = V?.uuid || V?.message?.id || null;
    if (F !== X.current.messageId || G.mode !== X.current.permissionMode || Q !== X.current.vimMode) X.current.messageId = F, X.current.permissionMode = G.mode, X.current.vimMode = Q, D()
  }, [A, G.mode, Q, D]), fp.useEffect(() => {
    let K = J?.statusLine;
    if (K) {
      if (l("tengu_status_line_mount", {
          command_length: K.command.length,
          padding: K.padding
        }), J.disableAllHooks === !0) k("Status line is configured but disableAllHooks is true", {
        level: "warn"
      })
    }
  }, []), fp.useEffect(() => {
    return I(), () => {
      B.current?.abort()
    }
  }, []);
  let W = J?.statusLine?.padding ?? 0;
  return euA.createElement(T, {
    paddingX: W,
    gap: 2
  }, Z && euA.createElement(C, {
    dimColor: !0
  }, Z), !1)
}
// @from(Ln 453945, Col 4)
euA
// @from(Ln 453945, Col 9)
fp
// @from(Ln 453946, Col 4)
oK9 = w(() => {
  fA();
  zO();
  C0();
  V2();
  ar();
  l2();
  oK();
  zO();
  Z0();
  T1();
  hB();
  Cf();
  LR();
  FT();
  C0();
  uC();
  fzA();
  euA = c(QA(), 1), fp = c(QA(), 1)
})
// @from(Ln 453967, Col 0)
function Sw7({
  apiKeyStatus: A,
  debug: Q,
  exitMessage: B,
  vimMode: G,
  mode: Z,
  autoUpdaterResult: Y,
  isAutoUpdating: J,
  verbose: X,
  onAutoUpdaterResult: I,
  onChangeIsUpdating: D,
  suggestions: W,
  selectedSuggestion: K,
  maxColumnWidth: V,
  toolPermissionContext: F,
  helpOpen: H,
  suppressHint: E,
  tasksSelected: z,
  teamsSelected: $,
  diffSelected: O,
  ideSelection: L,
  mcpClients: M,
  isPasting: _ = !1,
  isInputWrapped: j = !1,
  messages: x,
  isSearching: b,
  historyQuery: S,
  setHistoryQuery: u,
  historyFailedMatch: f
}) {
  let AA = YU(),
    n = E || eS0(AA) || b;
  if (W.length) return bE.createElement(T, {
    paddingX: 2,
    paddingY: 0
  }, bE.createElement(nhA, {
    suggestions: W,
    selectedSuggestion: K,
    maxColumnWidth: V
  }));
  if (H) return bE.createElement(vE1, {
    dimColor: !0,
    fixedWidth: !0,
    paddingX: 2
  });
  return bE.createElement(T, {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingX: 2
  }, bE.createElement(T, {
    flexDirection: "column"
  }, Z === "prompt" && !B.show && !_ && eS0(AA) && bE.createElement(aK9, {
    messages: x,
    vimMode: G
  }), bE.createElement(iK9, {
    exitMessage: B,
    vimMode: G,
    mode: Z,
    toolPermissionContext: F,
    suppressHint: n,
    tasksSelected: z,
    teamsSelected: $,
    diffSelected: O,
    isPasting: _,
    isSearching: b,
    historyQuery: S,
    setHistoryQuery: u,
    historyFailedMatch: f
  })), bE.createElement(lW9, {
    apiKeyStatus: A,
    autoUpdaterResult: Y,
    debug: Q,
    isAutoUpdating: J,
    verbose: X,
    messages: x,
    onAutoUpdaterResult: I,
    onChangeIsUpdating: D,
    ideSelection: L,
    mcpClients: M,
    isInputWrapped: j
  }))
}
// @from(Ln 454049, Col 4)
bE
// @from(Ln 454049, Col 8)
rK9
// @from(Ln 454049, Col 13)
sK9
// @from(Ln 454050, Col 4)
tK9 = w(() => {
  fA();
  nK9();
  YC1();
  oK9();
  ar();
  gM0();
  oR0();
  bE = c(QA(), 1), rK9 = c(QA(), 1);
  sK9 = rK9.memo(Sw7)
})
// @from(Ln 454062, Col 0)
function eK9(A, Q) {
  let B = qC1.useRef(void 0);
  qC1.useEffect(() => {
    let G = nN(A);
    if (B.current !== G) B.current = G;
    if (G) G.client.setNotificationHandler(yw7, (Z) => {
      if (B.current !== G) return;
      try {
        let Y = Z.params,
          J = Y.lineStart !== void 0 ? Y.lineStart + 1 : void 0,
          X = Y.lineEnd !== void 0 ? Y.lineEnd + 1 : void 0;
        Q({
          filePath: Y.filePath,
          lineStart: J,
          lineEnd: X
        })
      } catch (Y) {
        e(Y)
      }
    })
  }, [A, Q])
}
// @from(Ln 454084, Col 4)
qC1
// @from(Ln 454084, Col 9)
xw7 = "at_mentioned"
// @from(Ln 454085, Col 2)
yw7
// @from(Ln 454086, Col 4)
AV9 = w(() => {
  j9();
  TX();
  v1();
  qC1 = c(QA(), 1), yw7 = m.object({
    method: m.literal(xw7),
    params: m.object({
      filePath: m.string(),
      lineStart: m.number().optional(),
      lineEnd: m.number().optional()
    })
  })
})
// @from(Ln 454100, Col 0)
function QV9({
  maxBufferSize: A,
  debounceMs: Q
}) {
  let [B, G] = Wh.useState([]), [Z, Y] = Wh.useState(-1), J = Wh.useRef(0), X = Wh.useRef(null), I = Wh.useCallback((V, F, H = {}) => {
    let E = Date.now();
    if (X.current) clearTimeout(X.current), X.current = null;
    if (E - J.current < Q) {
      X.current = setTimeout(() => {
        I(V, F, H)
      }, Q);
      return
    }
    J.current = E, G((z) => {
      let $ = Z >= 0 ? z.slice(0, Z + 1) : z,
        O = $[$.length - 1];
      if (O && O.text === V) return $;
      let L = [...$, {
        text: V,
        cursorOffset: F,
        pastedContents: H,
        timestamp: E
      }];
      if (L.length > A) return L.slice(-A);
      return L
    }), Y((z) => {
      let $ = z >= 0 ? z + 1 : B.length;
      return Math.min($, A - 1)
    })
  }, [Q, A, Z, B.length]), D = Wh.useCallback(() => {
    if (Z < 0 || B.length === 0) return;
    let V = Math.max(0, Z - 1),
      F = B[V];
    if (F) return Y(V), F;
    return
  }, [B, Z]), W = Wh.useCallback(() => {
    if (G([]), Y(-1), J.current = 0, X.current) clearTimeout(X.current), X.current = null
  }, [J, X]), K = Z > 0 && B.length > 1;
  return {
    pushToBuffer: I,
    undo: D,
    canUndo: K,
    clearBuffer: W
  }
}
// @from(Ln 454145, Col 4)
Wh
// @from(Ln 454146, Col 4)
BV9 = w(() => {
  Wh = c(QA(), 1)
})
// @from(Ln 454150, Col 0)
function GV9(A) {
  return []
}
// @from(Ln 454153, Col 0)
async function ZV9({
  question: A,
  cacheSafeParams: Q
}) {
  let B = {
      ...Q.toolUseContext,
      options: {
        ...Q.toolUseContext.options,
        maxThinkingTokens: 0
      }
    },
    G = `<system-reminder>Answer this side question immediately without using any tools. Base your response only on what you already know from the conversation context.</system-reminder>

${A}`,
    Z = await sc({
      promptMessages: [H0({
        content: G
      })],
      cacheSafeParams: {
        ...Q,
        toolUseContext: B
      },
      canUseTool: async () => ({
        behavior: "deny",
        message: "Side questions cannot use tools",
        decisionReason: {
          type: "other",
          reason: "side_question"
        }
      }),
      querySource: "side_question",
      forkLabel: "side_question",
      maxTurns: 1
    }),
    J = Z.messages.find((I) => I.type === "assistant")?.message?.content?.find((I) => I.type === "text");
  return {
    response: J && J.type === "text" ? J.text.trim() : null,
    usage: Z.totalUsage
  }
}
// @from(Ln 454193, Col 4)
vw7
// @from(Ln 454194, Col 4)
Ax0 = w(() => {
  $c();
  tQ();
  vw7 = /^\/btw\b/gi
})
// @from(Ln 454200, Col 0)
function YV9() {
  let [A] = a0(), [Q, B] = _$A.useState(new Map);
  return _$A.useEffect(() => {
    let G = !1;
    return mK9().then((Z) => {
      if (!G) B(Z)
    }), () => {
      G = !0
    }
  }, [A.gitDiff.lastUpdated]), _$A.useMemo(() => {
    let {
      stats: G,
      perFileStats: Z
    } = A.gitDiff, Y = [];
    for (let [J, X] of Z) {
      let I = Q.get(J),
        D = X.isUntracked ?? !1,
        W = !X.isBinary && !D && !I,
        K = X.added + X.removed,
        V = !W && !X.isBinary && K > kw7;
      Y.push({
        path: J,
        linesAdded: X.added,
        linesRemoved: X.removed,
        isBinary: X.isBinary,
        isLargeFile: W,
        isTruncated: V,
        isUntracked: D
      })
    }
    return Y.sort((J, X) => J.path.localeCompare(X.path)), {
      stats: G,
      files: Y,
      hunks: Q
    }
  }, [A.gitDiff, Q])
}
// @from(Ln 454237, Col 4)
_$A
// @from(Ln 454237, Col 9)
kw7 = 400
// @from(Ln 454238, Col 4)
JV9 = w(() => {
  hB();
  tS0();
  _$A = c(QA(), 1)
})
// @from(Ln 454244, Col 0)
function bw7(A) {
  if (!A || typeof A !== "object") return !1;
  let Q = A,
    B = typeof Q.filePath === "string",
    G = Array.isArray(Q.structuredPatch) && Q.structuredPatch.length > 0,
    Z = Q.type === "create" && typeof Q.content === "string";
  return B && (G || Z)
}
// @from(Ln 454253, Col 0)
function fw7(A) {
  return "type" in A && (A.type === "create" || A.type === "update")
}
// @from(Ln 454257, Col 0)
function hw7(A) {
  let Q = 0,
    B = 0;
  for (let G of A)
    for (let Z of G.lines)
      if (Z.startsWith("+")) Q++;
      else if (Z.startsWith("-")) B++;
  return {
    added: Q,
    removed: B
  }
}
// @from(Ln 454270, Col 0)
function gw7(A) {
  if (A.type !== "user") return "";
  let Q = A.message.content,
    B = typeof Q === "string" ? Q : "";
  if (B.length <= 30) return B;
  return B.slice(0, 29) + "…"
}
// @from(Ln 454278, Col 0)
function XV9(A) {
  let Q = 0,
    B = 0;
  for (let G of A.files.values()) Q += G.linesAdded, B += G.linesRemoved;
  A.stats = {
    filesChanged: A.files.size,
    linesAdded: Q,
    linesRemoved: B
  }
}
// @from(Ln 454289, Col 0)
function IV9(A) {
  let Q = NC1.useRef({
    completedTurns: [],
    currentTurn: null,
    lastProcessedIndex: 0,
    lastTurnIndex: 0
  });
  return NC1.useMemo(() => {
    let B = Q.current;
    if (A.length < B.lastProcessedIndex) B.completedTurns = [], B.currentTurn = null, B.lastProcessedIndex = 0, B.lastTurnIndex = 0;
    for (let Z = B.lastProcessedIndex; Z < A.length; Z++) {
      let Y = A[Z];
      if (!Y || Y.type !== "user") continue;
      if (!(Y.toolUseResult || Array.isArray(Y.message.content) && Y.message.content[0]?.type === "tool_result") && !Y.isMeta) {
        if (B.currentTurn && B.currentTurn.files.size > 0) XV9(B.currentTurn), B.completedTurns.push(B.currentTurn);
        B.lastTurnIndex++, B.currentTurn = {
          turnIndex: B.lastTurnIndex,
          userPromptPreview: gw7(Y),
          timestamp: Y.timestamp,
          files: new Map,
          stats: {
            filesChanged: 0,
            linesAdded: 0,
            linesRemoved: 0
          }
        }
      } else if (B.currentTurn && Y.toolUseResult) {
        let X = Y.toolUseResult;
        if (bw7(X)) {
          let {
            filePath: I,
            structuredPatch: D
          } = X, W = "type" in X && X.type === "create", K = B.currentTurn.files.get(I);
          if (!K) K = {
            filePath: I,
            hunks: [],
            isNewFile: W,
            linesAdded: 0,
            linesRemoved: 0
          }, B.currentTurn.files.set(I, K);
          if (W && D.length === 0 && fw7(X)) {
            let F = X.content.split(`
`),
              H = {
                oldStart: 0,
                oldLines: 0,
                newStart: 1,
                newLines: F.length,
                lines: F.map((E) => "+" + E)
              };
            K.hunks.push(H), K.linesAdded += F.length
          } else {
            K.hunks.push(...D);
            let {
              added: V,
              removed: F
            } = hw7(D);
            K.linesAdded += V, K.linesRemoved += F
          }
          if (W) K.isNewFile = !0
        }
      }
    }
    B.lastProcessedIndex = A.length;
    let G = [...B.completedTurns];
    if (B.currentTurn && B.currentTurn.files.size > 0) XV9(B.currentTurn), G.push(B.currentTurn);
    return G.reverse()
  }, [A])
}
// @from(Ln 454358, Col 4)
NC1
// @from(Ln 454359, Col 4)
DV9 = w(() => {
  NC1 = c(QA(), 1)
})
// @from(Ln 454363, Col 0)
function KV9({
  files: A,
  selectedIndex: Q
}) {
  let {
    columns: B
  } = ZB(), {
    startIndex: G,
    endIndex: Z
  } = WV9.useMemo(() => {
    if (A.length === 0 || A.length <= wC1) return {
      startIndex: 0,
      endIndex: A.length
    };
    let K = Math.max(0, Q - Math.floor(wC1 / 2)),
      V = K + wC1;
    if (V > A.length) V = A.length, K = Math.max(0, V - wC1);
    return {
      startIndex: K,
      endIndex: V
    }
  }, [A.length, Q]);
  if (A.length === 0) return fE.default.createElement(C, {
    dimColor: !0
  }, "No changed files");
  let Y = A.slice(G, Z),
    J = G > 0,
    X = Z < A.length,
    I = 16,
    D = 3,
    W = Math.max(20, B - I - D - 4);
  return fE.default.createElement(T, {
    flexDirection: "column"
  }, J && fE.default.createElement(C, {
    dimColor: !0
  }, " ", "↑ ", G, " more file", G !== 1 ? "s" : ""), Y.map((K, V) => fE.default.createElement(uw7, {
    key: K.path,
    file: K,
    isSelected: G + V === Q,
    maxPathWidth: W
  })), X && fE.default.createElement(C, {
    dimColor: !0
  }, " ", "↓ ", A.length - Z, " more file", A.length - Z !== 1 ? "s" : ""))
}
// @from(Ln 454408, Col 0)
function uw7({
  file: A,
  isSelected: Q,
  maxPathWidth: B
}) {
  let G = A.path.length > B ? "…" + A.path.slice(-(B - 1)) : A.path,
    Y = `${Q?tA.pointer+" ":"  "}${G}`;
  return fE.default.createElement(T, {
    flexDirection: "row"
  }, fE.default.createElement(C, {
    bold: Q,
    color: Q ? "background" : void 0,
    inverse: Q
  }, Y), fE.default.createElement(T, {
    flexGrow: 1
  }), fE.default.createElement(mw7, {
    file: A,
    isSelected: Q
  }))
}
// @from(Ln 454429, Col 0)
function mw7({
  file: A,
  isSelected: Q
}) {
  if (A.isUntracked) return fE.default.createElement(C, {
    dimColor: !Q,
    italic: !0
  }, "untracked");
  if (A.isBinary) return fE.default.createElement(C, {
    dimColor: !Q,
    italic: !0
  }, "Binary file");
  if (A.isLargeFile) return fE.default.createElement(C, {
    dimColor: !Q,
    italic: !0
  }, "Large file modified");
  return fE.default.createElement(C, null, A.linesAdded > 0 && fE.default.createElement(C, {
    color: "diffAddedWord",
    bold: Q
  }, "+", A.linesAdded), A.linesAdded > 0 && A.linesRemoved > 0 && " ", A.linesRemoved > 0 && fE.default.createElement(C, {
    color: "diffRemovedWord",
    bold: Q
  }, "-", A.linesRemoved), A.isTruncated && fE.default.createElement(C, {
    dimColor: !Q
  }, " (truncated)"))
}
// @from(Ln 454455, Col 4)
fE
// @from(Ln 454455, Col 8)
WV9
// @from(Ln 454455, Col 13)
wC1 = 5
// @from(Ln 454456, Col 4)
VV9 = w(() => {
  fA();
  B2();
  P4();
  fE = c(QA(), 1), WV9 = c(QA(), 1)
})
// @from(Ln 454466, Col 0)
function HV9({
  filePath: A,
  hunks: Q,
  isLargeFile: B,
  isBinary: G,
  isTruncated: Z,
  isUntracked: Y
}) {
  let {
    columns: J
  } = ZB(), X = FV9.useMemo(() => {
    if (!A) return null;
    let W = dw7(o1(), A);
    return HX9(W)?.split(`
`)[0] ?? null
  }, [A]);
  if (Y) return mG.default.createElement(T, {
    flexDirection: "column",
    width: "100%"
  }, mG.default.createElement(T, null, mG.default.createElement(C, {
    bold: !0
  }, A), mG.default.createElement(C, {
    dimColor: !0
  }, " (untracked)")), mG.default.createElement(C, {
    dimColor: !0
  }, "─".repeat(Math.max(0, J - 4))), mG.default.createElement(T, {
    flexDirection: "column"
  }, mG.default.createElement(C, {
    dimColor: !0,
    italic: !0
  }, "New file not yet staged."), mG.default.createElement(C, {
    dimColor: !0,
    italic: !0
  }, "Run `git add ", A, "` to see line counts.")));
  if (G) return mG.default.createElement(T, {
    flexDirection: "column",
    width: "100%"
  }, mG.default.createElement(T, null, mG.default.createElement(C, {
    bold: !0
  }, A)), mG.default.createElement(C, {
    dimColor: !0
  }, "─".repeat(Math.max(0, J - 4))), mG.default.createElement(T, {
    flexDirection: "column"
  }, mG.default.createElement(C, {
    dimColor: !0,
    italic: !0
  }, "Binary file - cannot display diff")));
  if (B) return mG.default.createElement(T, {
    flexDirection: "column",
    width: "100%"
  }, mG.default.createElement(T, null, mG.default.createElement(C, {
    bold: !0
  }, A)), mG.default.createElement(C, {
    dimColor: !0
  }, "─".repeat(Math.max(0, J - 4))), mG.default.createElement(T, {
    flexDirection: "column"
  }, mG.default.createElement(C, {
    dimColor: !0,
    italic: !0
  }, "Large file - diff exceeds 1 MB limit")));
  let I = 1,
    D = 1;
  return mG.default.createElement(T, {
    flexDirection: "column",
    width: "100%"
  }, mG.default.createElement(T, null, mG.default.createElement(C, {
    bold: !0
  }, A), Z && mG.default.createElement(C, {
    dimColor: !0
  }, " (truncated)")), mG.default.createElement(C, {
    dimColor: !0
  }, "─".repeat(Math.max(0, J - 4))), mG.default.createElement(T, {
    flexDirection: "column"
  }, Q.length === 0 ? mG.default.createElement(C, {
    dimColor: !0
  }, "No diff content") : Q.map((W, K) => mG.default.createElement(sN, {
    key: K,
    patch: W,
    filePath: A,
    firstLine: X,
    dim: !1,
    width: J - 2 * I - 2 * D
  }))), Z && mG.default.createElement(C, {
    dimColor: !0,
    italic: !0
  }, "… diff truncated (exceeded 400 line limit)"))
}
// @from(Ln 454553, Col 4)
mG
// @from(Ln 454553, Col 8)
FV9
// @from(Ln 454554, Col 4)
EV9 = w(() => {
  fA();
  ls();
  y9();
  V2();
  P4();
  mG = c(QA(), 1), FV9 = c(QA(), 1)
})
// @from(Ln 454563, Col 0)
function cw7(A) {
  let Q = Array.from(A.files.values()).map((G) => ({
      path: G.filePath,
      linesAdded: G.linesAdded,
      linesRemoved: G.linesRemoved,
      isBinary: !1,
      isLargeFile: !1,
      isTruncated: !1,
      isNewFile: G.isNewFile
    })).sort((G, Z) => G.path.localeCompare(Z.path)),
    B = new Map;
  for (let G of A.files.values()) B.set(G.filePath, G.hunks);
  return {
    stats: {
      filesCount: A.stats.filesChanged,
      linesAdded: A.stats.linesAdded,
      linesRemoved: A.stats.linesRemoved
    },
    files: Q,
    hunks: B
  }
}
// @from(Ln 454586, Col 0)
function zV9({
  messages: A,
  onDone: Q
}) {
  let B = YV9(),
    G = IV9(A),
    [Z, Y] = hU.useState("list"),
    [J, X] = hU.useState(0),
    [I, D] = hU.useState(0),
    W = MQ(),
    K = hU.useMemo(() => {
      let S = [{
        type: "current"
      }];
      for (let u of G) S.push({
        type: "turn",
        turnIndex: u.turnIndex
      });
      return S
    }, [G]),
    V = hU.useMemo(() => {
      let S = K[I];
      if (!S || S.type === "current") return B;
      let u = G.find((f) => f.turnIndex === S.turnIndex);
      if (!u) return B;
      return cw7(u)
    }, [K, I, B, G]),
    F = K[I],
    H = F?.type === "turn" ? G.find((S) => S.turnIndex === F.turnIndex) : null,
    E = V.files[J],
    z = hU.useMemo(() => {
      return E ? V.hunks.get(E.path) || [] : []
    }, [E, V.hunks]);
  hU.useEffect(() => {
    if (I >= K.length) D(Math.max(0, K.length - 1))
  }, [K.length, I]);
  let $ = hU.useRef(I);
  hU.useEffect(() => {
    if ($.current !== I) X(0), $.current = I
  }, [I]);
  let O = hU.useCallback(() => {
    if (Z === "detail") Y("list");
    else Q("Diff dialog dismissed", {
      display: "system"
    })
  }, [Z, Q]);
  H2("confirm:no", O, {
    context: "Confirmation"
  }), J0((S, u) => {
    if (Z === "list" && K.length > 1) {
      if (u.leftArrow) {
        D((f) => Math.max(0, f - 1));
        return
      }
      if (u.rightArrow) {
        D((f) => Math.min(K.length - 1, f + 1));
        return
      }
    }
    if (u.leftArrow && Z === "detail") {
      Y("list");
      return
    }
    if (u.return && Z === "list" && E) {
      Y("detail");
      return
    }
    if (Z === "list") {
      if (u.upArrow) X((f) => Math.max(0, f - 1));
      else if (u.downArrow) X((f) => Math.min(V.files.length - 1, f + 1))
    }
  });
  let L = V.stats ? dG.default.createElement(C, {
      dimColor: !0
    }, V.stats.filesCount, " file", V.stats.filesCount !== 1 ? "s" : "", " changed", V.stats.linesAdded > 0 && dG.default.createElement(C, {
      color: "diffAddedWord"
    }, " +", V.stats.linesAdded), V.stats.linesRemoved > 0 && dG.default.createElement(C, {
      color: "diffRemovedWord"
    }, " -", V.stats.linesRemoved)) : null,
    M = H ? `Turn ${H.turnIndex}` : "Uncommitted changes",
    _ = H ? H.userPromptPreview ? `"${H.userPromptPreview}"` : "" : "(git diff HEAD)",
    j = K.length > 1 ? dG.default.createElement(T, null, I > 0 && dG.default.createElement(C, {
      dimColor: !0
    }, "◀ "), K.map((S, u) => {
      let f = u === I,
        AA = S.type === "turn" ? G.find((y) => y.turnIndex === S.turnIndex) : null,
        n = S.type === "current" ? "Current" : `T${AA?.turnIndex??"?"}`;
      return dG.default.createElement(C, {
        key: u,
        dimColor: !f,
        bold: f
      }, u > 0 ? " · " : "", n)
    }), I < K.length - 1 && dG.default.createElement(C, {
      dimColor: !0
    }, " ▶")) : null,
    x = Z === "list" ? [...K.length > 1 ? [dG.default.createElement(C, {
      key: "src"
    }, "←/→ source")] : [], dG.default.createElement(C, {
      key: "nav"
    }, "↑/↓ select"), dG.default.createElement(C, {
      key: "enter"
    }, "Enter view"), dG.default.createElement(C, {
      key: "esc"
    }, "Esc close")] : [dG.default.createElement(C, {
      key: "back"
    }, "← back"), dG.default.createElement(C, {
      key: "esc"
    }, "Esc close")],
    b = (() => {
      if (H) return "No file changes in this turn";
      if (V.stats && V.stats.filesCount > 0 && V.files.length === 0) return "Too many files to display details";
      return "Working tree is clean"
    })();
  return dG.default.createElement(T, {
    width: "100%",
    flexDirection: "column"
  }, dG.default.createElement(T, {
    borderStyle: "round",
    borderColor: "background",
    flexDirection: "column",
    marginTop: 1,
    paddingX: 1,
    width: "100%"
  }, dG.default.createElement(T, {
    flexDirection: "column"
  }, dG.default.createElement(T, null, dG.default.createElement(C, {
    color: "background",
    bold: !0
  }, M), _ && dG.default.createElement(C, {
    dimColor: !0
  }, " ", _)), j), L, V.files.length === 0 ? dG.default.createElement(T, {
    marginTop: 1
  }, dG.default.createElement(C, {
    dimColor: !0
  }, b)) : Z === "list" ? dG.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, dG.default.createElement(KV9, {
    files: V.files,
    selectedIndex: J
  })) : dG.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, dG.default.createElement(HV9, {
    filePath: E?.path || "",
    hunks: z,
    isLargeFile: E?.isLargeFile,
    isBinary: E?.isBinary,
    isTruncated: E?.isTruncated,
    isUntracked: E?.isUntracked
  }))), dG.default.createElement(T, {
    marginLeft: 2
  }, W.pending ? dG.default.createElement(C, {
    dimColor: !0
  }, "Press ", W.keyName, " again to exit") : dG.default.createElement(C, {
    dimColor: !0
  }, rN(x, (S) => dG.default.createElement(C, {
    key: `sep-${S}`
  }, " · ")))))
}
// @from(Ln 454746, Col 4)
dG
// @from(Ln 454746, Col 8)
hU
// @from(Ln 454747, Col 4)
$V9 = w(() => {
  fA();
  c6();
  E9();
  JV9();
  DV9();
  VV9();
  EV9();
  dG = c(QA(), 1), hU = c(QA(), 1)
})
// @from(Ln 454758, Col 0)
function lw7(A, Q) {
  if (A.length <= pw7) return {
    truncatedText: A,
    placeholderContent: ""
  };
  let B = Math.floor(CV9 / 2),
    G = Math.floor(CV9 / 2),
    Z = A.slice(0, B),
    Y = A.slice(-G),
    J = A.slice(B, -G),
    X = D91(J),
    D = iw7(Q, X);
  return {
    truncatedText: Z + D + Y,
    placeholderContent: J
  }
}
// @from(Ln 454776, Col 0)
function iw7(A, Q) {
  return `[...Truncated text #${A} +${Q} lines...]`
}
// @from(Ln 454780, Col 0)
function UV9(A, Q) {
  let B = Object.keys(Q).map(Number),
    G = B.length > 0 ? Math.max(...B) + 1 : 1,
    {
      truncatedText: Z,
      placeholderContent: Y
    } = lw7(A, G);
  if (!Y) return {
    newInput: A,
    newPastedContents: Q
  };
  return {
    newInput: Z,
    newPastedContents: {
      ...Q,
      [G]: {
        id: G,
        type: "text",
        content: Y
      }
    }
  }
}
// @from(Ln 454803, Col 4)
pw7 = 1e4
// @from(Ln 454804, Col 2)
CV9 = 1000
// @from(Ln 454805, Col 4)
qV9 = w(() => {
  Vm()
})
// @from(Ln 454809, Col 0)
function NV9({
  input: A,
  pastedContents: Q,
  onInputChange: B,
  setCursorOffset: G,
  setPastedContents: Z
}) {
  let [Y, J] = AmA.useState(!1);
  AmA.useEffect(() => {
    if (Y) return;
    if (A.length <= 1e4) return;
    let {
      newInput: X,
      newPastedContents: I
    } = UV9(A, Q);
    B(X), G(X.length), Z(I), J(!0)
  }, [A, Y, Q, B, Z, G]), AmA.useEffect(() => {
    if (A === "") J(!1)
  }, [A])
}
// @from(Ln 454829, Col 4)
AmA
// @from(Ln 454830, Col 4)
wV9 = w(() => {
  qV9();
  AmA = c(QA(), 1)
})
// @from(Ln 454835, Col 0)
function LV9(A, Q = 20) {
  let B = new Map;
  for (let Z of A) B.set(Z, (B.get(Z) || 0) + 1);
  return Array.from(B.entries()).sort((Z, Y) => Y[1] - Z[1]).slice(0, Q).map(([Z, Y]) => `${Y.toString().padStart(6)} ${Z}`).join(`
`)
}
// @from(Ln 454841, Col 0)
async function nw7() {
  if (l0.platform === "win32") return [];
  if (!await nq()) return [];
  try {
    let A = "",
      {
        stdout: Q
      } = await J2("git", ["config", "user.email"], {
        cwd: o1()
      }),
      B = "";
    if (Q.trim()) {
      let {
        stdout: J
      } = await J2("git", ["log", "-n", "1000", "--pretty=format:", "--name-only", "--diff-filter=M", `--author=${Q.trim()}`], {
        cwd: o1()
      }), X = J.split(`
`).filter((I) => I.trim());
      B = LV9(X)
    }
    if (A = `Files modified by user:
` + B, B.split(`
`).length < 10) {
      let {
        stdout: J
      } = await J2("git", ["log", "-n", "1000", "--pretty=format:", "--name-only", "--diff-filter=M"], {
        cwd: o1()
      }), X = J.split(`
`).filter((D) => D.trim()), I = LV9(X);
      A += `

Files modified by other users:
` + I
    }
    let Z = (await CF({
      systemPrompt: ["You are an expert at analyzing git history. Given a list of files and their modification counts, return exactly five filenames that are frequently modified and represent core application logic (not auto-generated files, dependencies, or configuration). Make sure filenames are diverse, not all in the same folder, and are a mix of user and other users. Return only the filenames' basenames (without the path) separated by newlines with no explanation."],
      userPrompt: A,
      signal: new AbortController().signal,
      options: {
        querySource: "example_commands_frequently_modified",
        agents: [],
        isNonInteractiveSession: !1,
        hasAppendSystemPrompt: !1,
        mcpTools: []
      }
    })).message.content[0];
    if (!Z || Z.type !== "text") return [];
    let Y = Z.text.trim().split(`
`).map((J) => J.trim()).filter((J) => /^\S+\.\w+$/.test(J));
    if (Y.length < 5) return [];
    return Y
  } catch (A) {
    return e(A), []
  }
}
// @from(Ln 454896, Col 4)
aw7 = 604800000
// @from(Ln 454897, Col 2)
OV9
// @from(Ln 454897, Col 7)
MV9
// @from(Ln 454898, Col 4)
Qx0 = w(() => {
  GQ();
  p3();
  V2();
  nY();
  t4();
  v1();
  Y9();
  HUA();
  ZI();
  OV9 = W0(() => {
    let A = JG(),
      Q = A.exampleFiles?.length ? Wg(A.exampleFiles) : "<filepath>",
      B = ["fix lint errors", "fix typecheck errors", `how does ${Q} work?`, `refactor ${Q}`, "how do I log an error?", `edit ${Q} to...`, `write a test for ${Q}`, "create a util logging.py that..."];
    return `Try "${Wg(B)}"`
  }), MV9 = W0(async () => {
    let A = JG(),
      Q = Date.now(),
      B = A.exampleFilesGeneratedAt ?? 0;
    if (Q - B > aw7) A.exampleFiles = [];
    if (!A.exampleFiles?.length) nw7().then((G) => {
      if (G.length) BZ((Z) => ({
        ...Z,
        exampleFiles: G,
        exampleFilesGeneratedAt: Date.now()
      }))
    })
  })
})
// @from(Ln 454928, Col 0)
function _V9({
  input: A,
  submitCount: Q
}) {
  let [{
    queuedCommands: B,
    promptSuggestionEnabled: G
  }] = a0();
  return RV9.useMemo(() => {
    if (A !== "") return;
    if (B.length > 0 && (L1().queuedCommandUpHintCount || 0) < ow7) return "Press up to edit queued messages";
    if (Q < 1 && G) return OV9()
  }, [A, B, Q, G])
}
// @from(Ln 454942, Col 4)
RV9
// @from(Ln 454942, Col 9)
ow7 = 3
// @from(Ln 454943, Col 4)
jV9 = w(() => {
  hB();
  GQ();
  Qx0();
  RV9 = c(QA(), 1)
})
// @from(Ln 454950, Col 0)
function sw7() {
  return
}
// @from(Ln 454954, Col 0)
function tw7({
  isLoading: A,
  themeColor: Q
}) {
  let B = Q,
    G = !1;
  return dx.createElement(C, {
    color: B ?? void 0,
    dimColor: A
  }, tA.pointer, " ")
}
// @from(Ln 454966, Col 0)
function Bx0({
  mode: A,
  isLoading: Q
}) {
  let B = sw7();
  return dx.createElement(T, {
    alignItems: "flex-start",
    alignSelf: "flex-start",
    flexWrap: "nowrap",
    justifyContent: "flex-start"
  }, A === "bash" ? dx.createElement(C, {
    color: "bashBorder",
    dimColor: Q
  }, "! ") : A === "background" ? dx.createElement(C, {
    color: "background",
    dimColor: Q
  }, "& ") : dx.createElement(tw7, {
    isLoading: Q,
    ...{}
  }))
}
// @from(Ln 454987, Col 4)
dx
// @from(Ln 454987, Col 8)
rw7 = null
// @from(Ln 454988, Col 4)
TV9 = w(() => {
  B2();
  fA();
  EO();
  dx = c(QA(), 1)
})
// @from(Ln 454995, Col 0)
function SV9({
  isFirst: A,
  children: Q
}) {
  let B = Kh.useMemo(() => ({
    isQueued: !0,
    isFirst: A,
    paddingWidth: AL7
  }), [A]);
  return Kh.createElement(ew7.Provider, {
    value: B
  }, Kh.createElement(T, {
    paddingX: PV9
  }, Q))
}
// @from(Ln 455010, Col 4)
Kh
// @from(Ln 455010, Col 8)
ew7
// @from(Ln 455010, Col 13)
PV9 = 2
// @from(Ln 455011, Col 2)
AL7
// @from(Ln 455012, Col 4)
xV9 = w(() => {
  fA();
  Kh = c(QA(), 1), ew7 = Kh.createContext(void 0), AL7 = PV9 * 2
})
// @from(Ln 455017, Col 0)
function QL7(A) {
  try {
    return AQ(A)?.type === "idle_notification"
  } catch {
    return !1
  }
}
// @from(Ln 455025, Col 0)
function BL7(A) {
  return `<${zF}>
<${gz}>+${A} more tasks completed</${gz}>
<${hz}>completed</${hz}>
</${zF}>`
}
// @from(Ln 455032, Col 0)
function GL7(A) {
  let Q = A.filter((X) => typeof X.value !== "string" || !QL7(X.value)),
    B = Q.filter((X) => X.mode === "task-notification"),
    G = Q.filter((X) => X.mode !== "task-notification");
  if (B.length <= Zx0) return [...G, ...B];
  let Z = B.slice(0, Zx0 - 1),
    Y = B.length - (Zx0 - 1),
    J = {
      value: BL7(Y),
      mode: "task-notification"
    };
  return [...G, ...Z, J]
}
// @from(Ln 455046, Col 0)
function yV9() {
  let [{
    queuedCommands: A
  }] = a0();
  if (A.length === 0) return null;
  let Q = GL7(A),
    B = a7(Q.map((G) => H0({
      content: G.value,
      imagePasteIds: G.imagePasteIds
    })));
  return y8A.createElement(T, {
    marginTop: 1,
    flexDirection: "column"
  }, B.map((G, Z) => y8A.createElement(SV9, {
    key: Z,
    isFirst: Z === 0
  }, y8A.createElement(PO, {
    message: G,
    messages: [],
    addMargin: !1,
    tools: [],
    commands: [],
    verbose: !1,
    erroredToolUseIDs: Gx0,
    inProgressToolUseIDs: Gx0,
    resolvedToolUseIDs: Gx0,
    progressMessagesForMessage: [],
    shouldAnimate: !1,
    shouldShowDot: !1,
    isTranscriptMode: !1,
    isStatic: !0
  }))))
}
// @from(Ln 455079, Col 4)
y8A
// @from(Ln 455079, Col 9)
Gx0
// @from(Ln 455079, Col 14)
Zx0 = 3
// @from(Ln 455080, Col 4)
vV9 = w(() => {
  hB();
  fA();
  x6A();
  tQ();
  xV9();
  cD();
  A0();
  y8A = c(QA(), 1), Gx0 = new Set
})
// @from(Ln 455091, Col 0)
function kV9({
  hasStash: A
}) {
  if (!A) return null;
  return QmA.createElement(T, {
    paddingLeft: 2
  }, QmA.createElement(C, {
    dimColor: !0
  }, tA.pointerSmall, " Stashed (auto-restores after submit)"))
}
// @from(Ln 455101, Col 4)
QmA
// @from(Ln 455102, Col 4)
bV9 = w(() => {
  fA();
  B2();
  QmA = c(QA(), 1)
})
// @from(Ln 455111, Col 0)
function fV9({
  imageId: A,
  backgroundColor: Q,
  isSelected: B = !1
}) {
  let G = $D1(A),
    Z = `[Image #${A}]`;
  if (G && Sk()) {
    let Y = ZL7(G).href;
    return Vh.createElement(i2, {
      url: Y,
      fallback: Vh.createElement(C, {
        backgroundColor: Q,
        inverse: B
      }, Z)
    }, Vh.createElement(C, {
      backgroundColor: Q,
      inverse: B,
      bold: B
    }, Z))
  }
  return Vh.createElement(C, {
    backgroundColor: Q,
    inverse: B
  }, Z)
}
// @from(Ln 455137, Col 4)
Vh
// @from(Ln 455138, Col 4)
hV9 = w(() => {
  fA();
  WDA();
  IHA();
  DDA();
  Vh = c(QA(), 1)
})
// @from(Ln 455146, Col 0)
function gV9({
  pastedContents: A,
  linkedAttachments: Q = [],
  isSelected: B = !1,
  selectedIndex: G = 0,
  showTip: Z = !1,
  terminalWidth: Y = 80
}) {
  let J = Object.values(A).filter((z) => z.type === "image"),
    X = Q.filter((z) => z.type === "ticket"),
    I = Q.filter((z) => z.type === "figma-mockup"),
    D = J.length > 0,
    W = X.length > 0,
    K = I.length > 0,
    V = J.length + X.length + I.length;
  if (V === 0) return null;
  let F = B ? V > 1 ? "(←/→ select · backspace remove · ↓ cancel)" : "(backspace remove · ↓ cancel)" : "(↑ to select)",
    H = null;
  if (Z) {
    if (K && !W) H = "Tip: use /ticket to link a ticket";
    else if (W || D) H = "Tip: use /mockup to attach a Figma mockup"
  }
  if (H) {
    let z = J.length * 12,
      $ = X.length * 11,
      O = I.length * 9,
      L = z + $ + O,
      M = F.length,
      _ = H.length,
      j = 2,
      x = 2;
    if (L + M + 2 + _ + 2 > Y) H = null
  }
  let E = 0;
  return gU.createElement(T, {
    flexDirection: "row",
    gap: 1,
    paddingX: 1,
    flexWrap: "wrap"
  }, J.map((z) => {
    let $ = E++;
    return gU.createElement(fV9, {
      key: z.id,
      imageId: z.id,
      isSelected: B && $ === G
    })
  }), X.map((z) => {
    let $ = E++,
      O = B && $ === G;
    return gU.createElement(C, {
      key: z.id,
      inverse: O,
      bold: O
    }, "[Ticket ", z.ticketData?.ticketId, "]")
  }), I.map((z) => {
    let $ = E++,
      O = B && $ === G;
    return gU.createElement(C, {
      key: z.id,
      inverse: O,
      bold: O
    }, "[Mockup]")
  }), gU.createElement(T, {
    flexGrow: 1,
    justifyContent: "space-between",
    flexDirection: "row"
  }, gU.createElement(C, {
    dimColor: !0
  }, F), H && gU.createElement(C, {
    dimColor: !0,
    italic: !0
  }, H)))
}
// @from(Ln 455220, Col 0)
function Yx0(A, Q) {
  return Object.values(A).filter((G) => G.type === "image").length + Q.length
}
// @from(Ln 455224, Col 0)
function uV9(A, Q, B) {
  let G = Object.values(A).filter((I) => I.type === "image"),
    Z = Q.filter((I) => I.type === "ticket"),
    Y = Q.filter((I) => I.type === "figma-mockup");
  if (B < G.length) return {
    type: "image",
    id: G[B].id
  };
  let J = B - G.length;
  if (J < Z.length) return {
    type: "ticket",
    id: Z[J].id
  };
  let X = J - Z.length;
  if (X < Y.length) return {
    type: "mockup",
    id: Y[X].id
  };
  return null
}
// @from(Ln 455244, Col 4)
gU
// @from(Ln 455245, Col 4)
Jx0 = w(() => {
  fA();
  hV9();
  gU = c(QA(), 1)
})
// @from(Ln 455251, Col 0)
function mV9(A, Q, B, G, Z, Y, J, X, I, D, W) {
  let [K, V] = XJ.useState(""), [F, H] = XJ.useState(!1), [E, z] = XJ.useState(""), [$, O] = XJ.useState(0), [L, M] = XJ.useState("prompt"), [_, j] = XJ.useState({}), [x, b] = XJ.useState(void 0), S = XJ.useRef(void 0), u = XJ.useRef(new Set), f = XJ.useRef(null), AA = XJ.useCallback(() => {
    if (S.current) S.current.return(void 0), S.current = void 0
  }, []), n = XJ.useCallback(() => {
    I(!1), V(""), H(!1), z(""), O(0), M("prompt"), j({}), b(void 0), AA(), u.current.clear()
  }, [I, AA]), y = XJ.useCallback(async (OA, IA) => {
    if (!X) return;
    if (K.length === 0) {
      AA(), u.current.clear(), b(void 0), H(!1), B(E), G($), Y(L), D(_);
      return
    }
    if (!OA) AA(), S.current = lB0(), u.current.clear();
    if (!S.current) return;
    while (!0) {
      if (IA?.aborted) return;
      let HA = await S.current.next();
      if (HA.done) {
        H(!0);
        return
      }
      let ZA = HA.value.display,
        zA = ZA.lastIndexOf(K);
      if (zA !== -1 && !u.current.has(ZA)) {
        u.current.add(ZA), b(HA.value), H(!1);
        let wA = Fm(ZA);
        Y(wA), B(ZA), D(HA.value.pastedContents);
        let s = Q2A(ZA).lastIndexOf(K);
        G(s !== -1 ? s : zA);
        return
      }
    }
  }, [X, K, AA, B, G, Y, D, E, $, L, _]), p = XJ.useCallback(() => {
    T9("history-search"), I(!0), z(Q), O(Z), M(J), j(W), S.current = lB0(), u.current.clear()
  }, [I, Q, Z, J, W]), GA = XJ.useCallback(() => {
    y(!0)
  }, [y]), WA = XJ.useCallback(() => {
    if (x) {
      let OA = Fm(x.display),
        IA = Q2A(x.display);
      B(IA), Y(OA), D(x.pastedContents)
    } else D(_);
    n()
  }, [x, B, Y, D, _, n]), MA = XJ.useCallback(() => {
    B(E), G($), D(_), n()
  }, [B, G, D, E, $, _, n]), TA = XJ.useCallback(() => {
    if (K.length === 0) A({
      display: E,
      pastedContents: _
    });
    else if (x) {
      let OA = Fm(x.display),
        IA = Q2A(x.display);
      Y(OA), A({
        display: IA,
        pastedContents: x.pastedContents
      })
    }
    n()
  }, [K, x, A, Y, E, _, n]);
  H2("history:search", p, {
    context: "Global",
    isActive: !X
  });
  let bA = XJ.useMemo(() => ({
    "historySearch:next": GA,
    "historySearch:accept": WA,
    "historySearch:cancel": MA,
    "historySearch:execute": TA
  }), [GA, WA, MA, TA]);
  iW(bA, {
    context: "HistorySearch",
    isActive: X
  }), J0((OA, IA) => {
    if (IA.backspace && K === "") MA()
  }, {
    isActive: X
  });
  let jA = XJ.useRef(y);
  return jA.current = y, XJ.useEffect(() => {
    f.current?.abort();
    let OA = new AbortController;
    return f.current = OA, jA.current(!1, OA.signal), () => {
      OA.abort()
    }
  }, [K]), {
    historyQuery: K,
    setHistoryQuery: V,
    historyMatch: x,
    historyFailedMatch: F
  }
}
// @from(Ln 455342, Col 4)
XJ
// @from(Ln 455343, Col 4)
dV9 = w(() => {
  fA();
  Vm();
  JZ();
  c6();
  XJ = c(QA(), 1)
})
// @from(Ln 455351, Col 0)
function pV9({
  inputValue: A,
  isAssistantResponding: Q
}) {
  let [B, G] = a0(), {
    text: Z,
    promptId: Y,
    shownAt: J,
    acceptedAt: X,
    generationRequestId: I
  } = B.promptSuggestion, D = Q || A.length > 0 ? null : Z, W = Z && J > 0, K = BmA.useCallback(() => {
    G((E) => ({
      ...E,
      promptSuggestion: {
        text: null,
        promptId: null,
        shownAt: 0,
        acceptedAt: 0,
        generationRequestId: null
      }
    }))
  }, [G]), V = BmA.useCallback(() => {
    if (!W) return;
    G((E) => ({
      ...E,
      promptSuggestion: {
        ...E.promptSuggestion,
        acceptedAt: Date.now()
      }
    }))
  }, [W, G]), F = BmA.useCallback(() => {
    G((E) => {
      if (E.promptSuggestion.shownAt !== 0 || !E.promptSuggestion.text) return E;
      return {
        ...E,
        promptSuggestion: {
          ...E.promptSuggestion,
          shownAt: Date.now()
        }
      }
    })
  }, [G]), H = BmA.useCallback((E) => {
    if (!W) return;
    let z = X > J,
      $ = z || E === Z,
      O = $ ? X || Date.now() : Date.now();
    l("tengu_prompt_suggestion", {
      outcome: $ ? "accepted" : "ignored",
      prompt_id: Y,
      ...I && {
        generationRequestId: I
      },
      ...$ && {
        acceptMethod: z ? "tab" : "enter"
      },
      ...$ && {
        timeToAcceptMs: O - J
      },
      ...!$ && {
        timeToIgnoreMs: O - J
      },
      similarity: Math.round(E.length / (Z?.length || 1) * 100) / 100,
      ...!1
    }), K()
  }, [W, X, J, Z, Y, I, K]);
  return {
    suggestion: D,
    markAccepted: V,
    markShown: F,
    logOutcomeAtSubmission: H
  }
}
// @from(Ln 455423, Col 4)
BmA
// @from(Ln 455423, Col 9)
cV9 = "↵ send"
// @from(Ln 455424, Col 4)
lV9 = w(() => {
  hB();
  Z0();
  BmA = c(QA(), 1)
})
// @from(Ln 455430, Col 0)
function iV9({
  currentValue: A,
  onSelect: Q,
  onCancel: B,
  isMidConversation: G
}) {
  let Z = MQ(),
    Y = [{
      value: "true",
      label: "Enabled",
      description: "Claude will think before responding"
    }, {
      value: "false",
      label: "Disabled",
      description: "Claude will respond without extended thinking"
    }];
  return H2("confirm:no", () => {
    B?.()
  }, {
    context: "Confirmation"
  }), V7.createElement(T, {
    flexDirection: "column",
    width: "100%"
  }, V7.createElement(K8, {
    dividerColor: "permission",
    dividerDimColor: !1
  }), V7.createElement(T, {
    flexDirection: "column",
    paddingX: 1
  }, V7.createElement(T, {
    flexDirection: "column"
  }, V7.createElement(T, {
    marginBottom: 1,
    flexDirection: "column"
  }, V7.createElement(C, {
    color: "remember",
    bold: !0
  }, "Toggle thinking mode"), V7.createElement(C, {
    dimColor: !0
  }, "Enable or disable thinking for this session."), G && V7.createElement(C, {
    color: "warning"
  }, "Changing mid-conversation may reduce quality. For best results, set this at the start of a session.")), V7.createElement(T, {
    flexDirection: "column",
    marginBottom: 1
  }, V7.createElement(k0, {
    defaultValue: A ? "true" : "false",
    defaultFocusValue: A ? "true" : "false",
    options: Y,
    onChange: (J) => Q(J === "true"),
    onCancel: B ?? (() => {}),
    visibleOptionCount: 2
  }))), V7.createElement(C, {
    dimColor: !0,
    italic: !0
  }, Z.pending ? V7.createElement(V7.Fragment, null, "Press ", Z.keyName, " again to exit") : V7.createElement(vQ, null, V7.createElement(F0, {
    shortcut: "Enter",
    action: "confirm"
  }), V7.createElement(hQ, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "exit"
  })))))
}
// @from(Ln 455494, Col 4)
V7
// @from(Ln 455495, Col 4)
nV9 = w(() => {
  fA();
  u8();
  E9();
  lD();
  e9();
  I3();
  K6();
  c6();
  V7 = c(QA(), 1)
})
// @from(Ln 455507, Col 0)
function aV9({
  suggestion: A,
  isSpeculating: Q,
  timeSavedMs: B,
  availableWidth: G
}) {
  let Z = (D) => A.length > D ? A.slice(0, Math.max(0, D)) : A;
  if (Q) {
    let D = Z(G);
    return BH.createElement(dH1, {
      text: D,
      highlights: [{
        start: 0,
        end: D.length,
        style: {
          type: "shimmer",
          baseColor: "inactive",
          shimmerColor: "subtle"
        },
        priority: 0
      }]
    })
  }
  let Y = B !== null && B >= YL7 ? `${tA.play}${tA.play} ${Math.round(B/1000)}s` : null,
    J = Y ? A9(Y) + 2 : 0,
    X = Z(G - J),
    I = Math.max(0, G - A9(X) - J);
  return BH.createElement(BH.Fragment, null, BH.createElement(C, {
    dimColor: !0
  }, X), Y && BH.createElement(BH.Fragment, null, BH.createElement(C, null, " ".repeat(I)), BH.createElement(C, {
    dimColor: !0
  }, Y)))
}
// @from(Ln 455540, Col 4)
BH
// @from(Ln 455540, Col 8)
YL7 = 5000
// @from(Ln 455541, Col 4)
oV9 = w(() => {
  B2();
  fA();
  UC();
  SM0();
  BH = c(QA(), 1)
})
// @from(Ln 455550, Col 0)
function KL7({
  debug: A,
  ideSelection: Q,
  toolPermissionContext: B,
  setToolPermissionContext: G,
  apiKeyStatus: Z,
  commands: Y,
  agents: J,
  isLoading: X,
  verbose: I,
  messages: D,
  onAutoUpdaterResult: W,
  autoUpdaterResult: K,
  input: V,
  onInputChange: F,
  mode: H,
  onModeChange: E,
  stashedPrompt: z,
  setStashedPrompt: $,
  submitCount: O,
  onShowMessageSelector: L,
  mcpClients: M,
  pastedContents: _,
  setPastedContents: j,
  vimMode: x,
  setVimMode: b,
  showBashesDialog: S,
  setShowBashesDialog: u,
  showDiffDialog: f,
  setShowDiffDialog: AA,
  tasksSelected: n,
  setTasksSelected: y,
  diffSelected: p,
  setDiffSelected: GA,
  onForegroundTask: WA,
  onExit: MA,
  getToolUseContext: TA,
  onSubmit: bA,
  isSearchingHistory: jA,
  setIsSearchingHistory: OA,
  onDismissSideQuestion: IA,
  isSideQuestionVisible: HA,
  helpOpen: ZA,
  setHelpOpen: zA
}) {
  let wA = js(),
    [_A, s] = z4.useState(!1),
    [t, BA] = z4.useState({
      show: !1
    }),
    [DA, CA] = z4.useState(V.length),
    [FA, xA] = a0(),
    {
      historyQuery: mA,
      setHistoryQuery: G1,
      historyMatch: J1,
      historyFailedMatch: SA
    } = mV9((T0) => {
      j(T0.pastedContents), B8(T0.display)
    }, V, F, CA, DA, E, H, jA, OA, j, _),
    A1 = z4.useRef(VL7(D)),
    [n1, S1] = z4.useState(!1),
    [L0, VQ] = z4.useState(!1),
    [t0, QQ] = z4.useState(!1),
    [y1, qQ] = z4.useState(!1),
    [K1, $1] = z4.useState(!1),
    [i1, Q0] = z4.useState(!1),
    [c0, b0] = z4.useState(!1),
    [UA, RA] = z4.useState(0),
    D1 = z4.useMemo(() => {
      let T0 = V.indexOf(`
`);
      if (T0 === -1) return !0;
      return DA <= T0
    }, [V, DA]),
    U1 = z4.useMemo(() => {
      return []
    }, [FA.teamContext]),
    V1 = FA.linkedAttachments,
    H1 = z4.useCallback((T0) => {
      xA((NQ) => ({
        ...NQ,
        linkedAttachments: NQ.linkedAttachments.filter((PB) => PB.id !== T0)
      }))
    }, [xA]),
    Y0 = z4.useCallback((T0) => {
      xA((NQ) => ({
        ...NQ,
        linkedAttachments: NQ.linkedAttachments.filter((PB) => PB.id !== T0)
      }))
    }, [xA]),
    {
      suggestion: c1,
      markAccepted: p0,
      logOutcomeAtSubmission: HQ,
      markShown: nB
    } = pV9({
      inputValue: V,
      isAssistantResponding: X
    }),
    AB = z4.useMemo(() => jA && J1 ? Q2A(typeof J1 === "string" ? J1 : J1.display) : V, [jA, J1, V]),
    RB = z4.useMemo(() => zDA(AB), [AB]),
    C9 = z4.useMemo(() => GV9(AB), [AB]),
    vB = z4.useMemo(() => {
      return tW9(AB).filter((NQ) => {
        let PB = AB.slice(NQ.start + 1, NQ.end);
        return Cc(PB, Y)
      })
    }, [AB, Y]),
    c2 = z4.useMemo(() => {
      let T0 = [];
      if (jA && J1 && !SA) T0.push({
        start: DA,
        end: DA + mA.length,
        style: {
          type: "solid",
          color: "warning"
        },
        priority: 20
      });
      if (RB.length > 0) {
        let NQ = CjA(AB);
        if (NQ.level !== "none") {
          let PB = C91[NQ.level],
            Y2 = kRB[NQ.level];
          for (let u9 of RB) T0.push({
            start: u9.start,
            end: u9.end,
            style: U91(u9.word) ? {
              type: "rainbow",
              useShimmer: !0
            } : {
              type: "shimmer",
              baseColor: PB,
              shimmerColor: Y2
            },
            priority: 10
          })
        }
      }
      for (let NQ of C9) T0.push({
        start: NQ.start,
        end: NQ.end,
        style: {
          type: "solid",
          color: "warning"
        },
        priority: 15
      });
      for (let NQ of vB) T0.push({
        start: NQ.start,
        end: NQ.end,
        style: {
          type: "solid",
          color: "suggestion"
        },
        priority: 5
      });
      return T0
    }, [jA, mA, J1, SA, DA, RB, C9, vB, AB]),
    {
      addNotification: F9,
      removeNotification: m3
    } = S4();
  z4.useEffect(() => {
    if (!RB.length) return;
    if (RB.length && !FA.thinkingEnabled) F9({
      key: "thinking-toggled-via-keyword",
      jsx: q2.createElement(C, {
        color: "suggestion"
      }, "Thinking on"),
      priority: "immediate",
      timeoutMs: 3000
    })
  }, [F9, FA.thinkingEnabled, xA, RB.length]);
  let s0 = z4.useRef(V.length),
    u1 = z4.useRef(V.length),
    IQ = z4.useCallback(() => {
      m3("stash-hint")
    }, [m3]);
  z4.useEffect(() => {
    let T0 = s0.current,
      NQ = u1.current,
      PB = V.length;
    if (s0.current = PB, PB > NQ) {
      u1.current = PB;
      return
    }
    if (PB === 0) {
      u1.current = 0;
      return
    }
    let Y2 = NQ >= 20 && PB <= 5,
      u9 = T0 >= 20 && PB <= 5;
    if (Y2 && !u9) {
      if (!L1().hasUsedStash) F9({
        key: "stash-hint",
        jsx: q2.createElement(C, {
          dimColor: !0
        }, "Tip:", " ", q2.createElement(hQ, {
          action: "chat:stash",
          context: "Chat",
          fallback: "ctrl+s",
          description: "stash"
        })),
        priority: "immediate",
        timeoutMs: ZC1
      });
      u1.current = PB
    }
  }, [V.length, F9]);
  let {
    pushToBuffer: tB,
    undo: U9,
    canUndo: V4,
    clearBuffer: j6
  } = QV9({
    maxBufferSize: 50,
    debounceMs: 1000
  });
  NV9({
    input: V,
    pastedContents: _,
    onInputChange: F,
    setCursorOffset: CA,
    setPastedContents: j
  });
  let z8 = _V9({
      input: V,
      submitCount: O
    }),
    T6 = z4.useCallback((T0) => {
      if (T0 === "?") {
        l("tengu_help_toggled", {}), zA((F4) => !F4);
        return
      }
      zA(!1), IQ(), d19(), u19(FA.speculation, xA);
      let NQ = T0.length === V.length + 1,
        PB = DA === 0,
        Y2 = Fm(T0);
      if (NQ && PB && Y2 !== "prompt") {
        E(Y2);
        return
      }
      let u9 = T0.replaceAll("\t", "    ");
      if (V !== u9) tB(V, DA, _);
      y(!1), GA(!1), S1(!1), F(u9)
    }, [F, E, V, DA, tB, _, y, GA, S1, IQ, FA.speculation, xA]),
    {
      resetHistory: i8,
      onHistoryUp: Q8,
      onHistoryDown: $G,
      dismissSearchHint: t7,
      historyIndex: PQ
    } = nW9((T0, NQ, PB) => {
      T6(T0), E(NQ), j(PB)
    }, V, _, CA);
  z4.useEffect(() => {
    if (jA) t7()
  }, [jA, t7]);

  function z2(T0) {
    y(T0 === "tasks"), GA(T0 === "diff")
  }

  function w4() {
    if (F6.length > 1) return;
    if (FA.queuedCommands.some((PB) => PZ1(PB.mode))) {
      VA();
      return
    }
    if (p) {
      if (Object.values(FA.tasks).filter((Y2) => Y2.status === "running").length > 0) z2("tasks");
      else if (U1.length > 0) S1(!0), z2("none");
      else z2("none");
      return
    }
    if (n1) {
      let PB = Object.values(FA.tasks).filter((Y2) => Y2.status === "running").length;
      S1(!1), z2(PB > 0 ? "tasks" : "none");
      return
    }
    if (n) {
      z2("none");
      return
    }
    let NQ = Yx0(_, V1);
    if (D1 && NQ > 0 && !c0) {
      b0(!0), RA(NQ - 1);
      return
    }
    Q8()
  }

  function Y6() {
    if (F6.length > 1) return;
    if (c0) return;
    let T0 = Object.values(FA.tasks).filter((Y2) => Y2.status === "running").length;
    if (n) {
      if (U1.length > 0) S1(!0), z2("none");
      else if (ZZ("tengu_code_diff_cli", !1) && FA.gitDiff.stats && FA.gitDiff.stats.filesCount > 0) z2("diff");
      return
    }
    if (n1) {
      if (ZZ("tengu_code_diff_cli", !1) && FA.gitDiff.stats && FA.gitDiff.stats.filesCount > 0) S1(!1), z2("diff");
      return
    }
    if (p) return;
    let NQ = $G(),
      PB = U1.length > 0;
    if (NQ) {
      if (T0 > 0) {
        if (z2("tasks"), S1(!1), !L1().hasSeenTasksHint) S0((u9) => {
          if (u9.hasSeenTasksHint === !0) return u9;
          return {
            ...u9,
            hasSeenTasksHint: !0
          }
        })
      } else if (PB) S1(!0), z2("none");
      else if (ZZ("tengu_code_diff_cli", !1) && FA.gitDiff.stats && FA.gitDiff.stats.filesCount > 0) z2("diff")
    }
  }
  let [eB, L4] = z4.useState({
    suggestions: [],
    selectedSuggestion: -1,
    commandArgumentHint: void 0
  }), L5 = z4.useCallback(() => {
    return ""
  }, [V1]), B8 = z4.useCallback(async (T0, NQ = !1) => {
    if (n || n1 || p) return;
    let PB = FA.promptSuggestion.text;
    if ((T0.trim() === "" || T0 === PB) && PB) {
      if (FA.speculation.status === "active") {
        p0(), bA(PB, {
          setCursorOffset: CA,
          clearBuffer: j6,
          resetHistory: i8
        }, {
          state: FA.speculation,
          speculationSessionTimeSavedMs: FA.speculationSessionTimeSavedMs,
          setAppState: xA
        });
        return
      }
      if (FA.promptSuggestion.shownAt > 0) p0(), T0 = PB
    }
    let u9 = Object.values(_).some((P3) => P3.type === "image");
    if (T0.trim() === "" && !u9) return;
    let F4 = eB.suggestions.length > 0 && eB.suggestions.every((P3) => P3.description === "directory");
    if (eB.suggestions.length > 0 && !NQ && !F4) return;
    if (FA.promptSuggestion.text && FA.promptSuggestion.shownAt > 0) HQ(T0);
    m3("stash-hint");
    let ED = L5() + T0;
    if (V1.length > 0) xA((P3) => ({
      ...P3,
      linkedAttachments: []
    }));
    await bA(ED, {
      setCursorOffset: CA,
      clearBuffer: j6,
      resetHistory: i8
    })
  }, [FA.promptSuggestion, FA.speculation, FA.speculationSessionTimeSavedMs, n, n1, p, eB.suggestions, bA, j6, i8, HQ, L5, xA, p0, _, m3, V1.length]), {
    suggestions: F6,
    selectedSuggestion: cG,
    commandArgumentHint: P6,
    inlineGhostText: pG,
    maxColumnWidth: T3
  } = FK9({
    commands: Y,
    onInputChange: F,
    onSubmit: B8,
    setCursorOffset: CA,
    input: V,
    cursorOffset: DA,
    mode: H,
    agents: J,
    setSuggestionsState: L4,
    suggestionsState: eB,
    suppressSuggestions: jA || PQ > 0,
    markAccepted: p0
  }), RY = H === "prompt" && F6.length === 0 && c1;
  if (RY) nB();
  if (FA.promptSuggestion.text && !c1 && FA.promptSuggestion.shownAt === 0) Uj("timing", FA.promptSuggestion.text), xA((T0) => ({
    ...T0,
    promptSuggestion: {
      text: null,
      promptId: null,
      shownAt: 0,
      acceptedAt: 0,
      generationRequestId: null
    }
  }));

  function _Y(T0, NQ, PB, Y2, u9) {
    l("tengu_paste_image", {}), E("prompt");
    let F4 = A1.current++,
      HD = {
        id: F4,
        type: "image",
        content: T0,
        mediaType: NQ || "image/png",
        filename: PB || "Pasted image",
        dimensions: Y2,
        sourcePath: u9
      };
    kT2(HD), setTimeout(() => qz0(HD), 0), j((ED) => ({
      ...ED,
      [F4]: HD
    }))
  }

  function g5(T0) {
    let NQ = jZ(T0).replace(/\r/g, `
`).replaceAll("\t", "    "),
      PB = D91(NQ),
      Y2 = Math.min(gQ - 10, 2);
    if (NQ.length > m51 || PB > Y2) {
      let u9 = A1.current++,
        F4 = {
          id: u9,
          type: "text",
          content: NQ
        };
      j((HD) => ({
        ...HD,
        [u9]: F4
      })), n8(ERB(u9, PB))
    } else n8(NQ)
  }

  function n8(T0) {
    tB(V, DA, _);
    let NQ = V.slice(0, DA) + T0 + V.slice(DA);
    F(NQ), CA(DA + T0.length)
  }
  let oA = yP(() => {}, () => L()),
    VA = z4.useCallback(async () => {
      let T0 = await SZ1(V, DA, async () => new Promise((NQ) => xA((PB) => {
        return NQ(PB), PB
      })), xA);
      if (!T0) return !1;
      if (F(T0.text), E("prompt"), CA(T0.cursorOffset), T0.images.length > 0) j((NQ) => {
        let PB = {
          ...NQ
        };
        for (let Y2 of T0.images) PB[Y2.id] = Y2;
        return PB
      });
      return !0
    }, [xA, F, E, V, DA, j]);
  eK9(M, function (T0) {
    l("tengu_ext_at_mentioned", {});
    let NQ, PB = rV9.relative(o1(), T0.filePath);
    if (T0.lineStart && T0.lineEnd) NQ = T0.lineStart === T0.lineEnd ? `@${PB}#L${T0.lineStart} ` : `@${PB}#L${T0.lineStart}-${T0.lineEnd} `;
    else NQ = `@${PB} `;
    let Y2 = V[DA - 1] ?? " ";
    if (!/\s/.test(Y2)) NQ = ` ${NQ}`;
    n8(NQ)
  });
  let kA = z4.useCallback(() => {
      if (V4) {
        T9("ctrl-underscore");
        let T0 = U9();
        if (T0) F(T0.text), CA(T0.cursorOffset), j(T0.pastedContents)
      }
    }, [V4, U9, F, j]),
    uA = z4.useCallback(() => {
      l("tengu_external_editor_used", {}), T9("external-editor"), qQ(!0);
      let T0 = i$1(V);
      if (qQ(!1), T0.error) F9({
        key: "external-editor-error",
        text: T0.error,
        color: "warning",
        priority: "high"
      });
      if (T0.content !== null && T0.content !== V) tB(V, DA, _), F(T0.content), CA(T0.content.length)
    }, [V, DA, _, tB, F, F9]),
    dA = z4.useCallback(() => {
      if (V.trim() === "" && z !== void 0) F(z.text), CA(z.cursorOffset), $(void 0);
      else if (V.trim() !== "") $({
        text: V,
        cursorOffset: DA
      }), F(""), CA(0), T9("prompt-stash"), S0((T0) => {
        if (T0.hasUsedStash) return T0;
        return {
          ...T0,
          hasUsedStash: !0
        }
      })
    }, [V, DA, z, F, $]),
    C1 = z4.useCallback(() => {
      if ($1((T0) => !T0), ZA) zA(!1)
    }, [ZA]),
    j1 = z4.useCallback(() => {
      if (Q0((T0) => !T0), ZA) zA(!1)
    }, [ZA]),
    k1 = z4.useCallback(() => {
      let T0 = kK9(B, FA.teamContext);
      if (l("tengu_mode_cycle", {
          to: T0
        }), B.mode === "plan" && T0 !== "plan") Iq(!0);
      if (Ty(B.mode, T0), B.mode === "delegate" && T0 !== "delegate") Df0(!0), jdA(!0);
      if (T0 === "plan") S0((PB) => ({
        ...PB,
        lastPlanModeUse: Date.now()
      }));
      if (T0 === "acceptEdits") T9("auto-accept-mode");
      let NQ = UJ(B, {
        type: "setMode",
        mode: T0,
        destination: "session"
      });
      if (G(NQ), XL7(T0, FA.teamContext?.teamName), ZA) zA(!1)
    }, [B, FA.teamContext, G, ZA]),
    s1 = z4.useCallback(() => {
      d51().then((T0) => {
        if (T0) T9("image-paste"), _Y(T0.base64, T0.mediaType);
        else {
          let NQ = BN("chat:imagePaste", "Chat", "ctrl+v"),
            PB = l0.isSSH() ? "No image found in clipboard. You're SSH'd; try scp?" : `No image found in clipboard. Use ${NQ} to paste images.`;
          F9({
            key: "no-image-in-clipboard",
            text: PB,
            priority: "immediate",
            timeoutMs: 1000
          })
        }
      })
    }, [F9, _Y]),
    p1 = z4.useMemo(() => ({
      "chat:undo": kA,
      "chat:externalEditor": uA,
      "chat:stash": dA,
      "chat:modelPicker": C1,
      "chat:thinkingToggle": j1,
      "chat:cycleMode": k1,
      "chat:imagePaste": s1
    }), [kA, uA, dA, C1, j1, k1, s1]);
  iW(p1, {
    context: "Chat"
  }), H2("help:dismiss", () => {
    zA(!1)
  }, {
    context: "Help",
    isActive: ZA
  }), J0((T0, NQ) => {
    if (f) return;
    if ($Q() === "macos" && T0 in vM0) {
      let PB = vM0[T0],
        Y2 = GRB();
      F9({
        key: "option-meta-hint",
        jsx: Y2 ? q2.createElement(C, {
          dimColor: !0
        }, "To enable ", PB, ", set ", q2.createElement(C, {
          bold: !0
        }, "Option as Meta"), " in", " ", Y2, " preferences (⌘,)") : q2.createElement(C, {
          dimColor: !0
        }, "To enable ", PB, ", run /terminal-setup"),
        priority: "immediate",
        timeoutMs: 5000
      })
    }
    if (c0) {
      let PB = Yx0(_, V1);
      if (NQ.leftArrow) {
        RA((Y2) => Y2 > 0 ? Y2 - 1 : PB - 1);
        return
      }
      if (NQ.rightArrow) {
        RA((Y2) => Y2 < PB - 1 ? Y2 + 1 : 0);
        return
      }
      if (NQ.backspace || NQ.delete) {
        let Y2 = uV9(_, V1, UA);
        if (Y2) {
          if (Y2.type === "image") j((F4) => {
            let HD = {
              ...F4
            };
            return delete HD[Y2.id], HD
          });
          else if (Y2.type === "ticket") H1(Y2.id);
          else if (Y2.type === "mockup") Y0(Y2.id)
        }
        let u9 = PB - 1;
        if (u9 === 0) b0(!1), RA(0);
        else RA((F4) => F4 >= u9 ? u9 - 1 : F4);
        return
      }
      if (NQ.downArrow || NQ.escape) {
        b0(!1);
        return
      }
      return
    }
    if (NQ.return && n) {
      u(!0), z2("none");
      return
    }
    if (NQ.return && p && ZZ("tengu_code_diff_cli", !1)) {
      l("tengu_code_change_view_opened", {}), AA(!0), z2("none");
      return
    }
    if (NQ.return && n1) {
      VQ(!0), S1(!1);
      return
    }
    if (n && NQ.rightArrow) {
      if (U1.length > 0) {
        y(!1), S1(!0);
        return
      }
    }
    if (n1 && NQ.leftArrow) {
      if (Object.values(FA.tasks).filter((Y2) => Y2.status === "running").length > 0) {
        S1(!1), y(!0);
        return
      }
    }
    if (DA === 0 && (NQ.escape || NQ.backspace || NQ.delete)) E("prompt"), zA(!1);
    if (ZA && V === "" && (NQ.backspace || NQ.delete)) zA(!1);
    if (NQ.escape) {
      if (HA && IA) {
        IA();
        return
      }
      if (ZA) {
        zA(!1);
        return
      }
      if (n || n1 || p) {
        z2("none"), S1(!1);
        return
      }
      if (FA.queuedCommands.some((Y2) => PZ1(Y2.mode))) {
        VA();
        return
      }
      if (D.length > 0 && !V && !X) oA()
    }
    if (NQ.return && ZA) zA(!1)
  });
  let {
    columns: M0,
    rows: gQ
  } = ZB(), _B = M0 - 3, T2 = WL7(), n2 = (() => {
    if (!RY || !c1) return z8;
    let T0 = cV9,
      NQ = jZ(c1).length,
      PB = jZ(T0).length,
      Y2 = 3,
      u9 = _B;
    if (NQ + PB + Y2 > u9) return c1;
    let F4 = u9 - NQ - PB;
    return c1 + " ".repeat(F4) + I1.dim(T0)
  })(), Q4 = z4.useMemo(() => {
    if (!RY || !c1) return;
    let T0 = FA.speculation;
    if (T0.status !== "active") return;
    let NQ = T0.boundary !== null ? T0.boundary.completedAt - T0.startTime : null,
      PB = _B;
    return q2.createElement(aV9, {
      suggestion: c1,
      isSpeculating: T0.boundary === null,
      timeSavedMs: NQ,
      availableWidth: PB
    })
  }, [RY, c1, FA.speculation, _B]), G8 = z4.useMemo(() => V.includes(`
`), [V]), $Z = z4.useCallback((T0, NQ) => {
    xA((PB) => ({
      ...PB,
      mainLoopModel: T0,
      mainLoopModelForSession: null
    })), $1(!1), l("tengu_model_picker_hotkey", {
      model: T0
    })
  }, [xA]), S7 = z4.useCallback(() => {
    $1(!1)
  }, []), FD = z4.useMemo(() => {
    if (!K1) return null;
    return q2.createElement(T, {
      flexDirection: "column",
      marginTop: 1
    }, q2.createElement(jzA, {
      initial: FA.mainLoopModel,
      sessionModel: FA.mainLoopModelForSession,
      onSelect: $Z,
      onCancel: S7,
      isStandaloneCommand: !0
    }))
  }, [K1, FA.mainLoopModel, FA.mainLoopModelForSession, $Z, S7]), aJ = z4.useCallback((T0) => {
    xA((NQ) => ({
      ...NQ,
      thinkingEnabled: T0
    })), Q0(!1), l("tengu_thinking_toggled_hotkey", {
      enabled: T0
    }), F9({
      key: "thinking-toggled-hotkey",
      jsx: q2.createElement(C, {
        color: T0 ? "suggestion" : void 0,
        dimColor: !T0
      }, "Thinking ", T0 ? "on" : "off"),
      priority: "immediate",
      timeoutMs: 3000
    })
  }, [xA, F9]), OV = z4.useCallback(() => {
    Q0(!1)
  }, []), oJ = z4.useMemo(() => {
    if (!i1) return null;
    return q2.createElement(T, {
      flexDirection: "column",
      marginTop: 1
    }, q2.createElement(iV9, {
      currentValue: FA.thinkingEnabled,
      onSelect: aJ,
      onCancel: OV,
      isMidConversation: D.some((T0) => T0.type === "assistant")
    }))
  }, [i1, FA.thinkingEnabled, aJ, OV, D.length]);
  if (S) return q2.createElement(vz1, {
    onDone: () => {
      u(!1)
    },
    onForegroundTask: WA ? (T0) => {
      u(!1), WA(T0)
    } : void 0,
    toolUseContext: TA(D, [], new AbortController, [], void 0, wA)
  });
  if (FD) return FD;
  if (oJ) return oJ;
  if (ZZ("tengu_code_diff_cli", !1) && f) return q2.createElement(zV9, {
    messages: D,
    onDone: () => {
      AA(!1), GA(!1)
    }
  });
  let IJ = {
      multiline: !0,
      onSubmit: B8,
      onChange: T6,
      value: J1 ? Q2A(typeof J1 === "string" ? J1 : J1.display) : V,
      onHistoryUp: w4,
      onHistoryDown: Y6,
      onHistoryReset: i8,
      placeholder: n2,
      onExit: MA,
      onExitMessage: (T0, NQ) => BA({
        show: T0,
        key: NQ
      }),
      onImagePaste: _Y,
      columns: _B,
      disableCursorMovementForUpDownKeys: F6.length > 0,
      cursorOffset: DA,
      onChangeCursorOffset: CA,
      onPaste: g5,
      onIsPastingChange: QQ,
      focus: !jA && !c0,
      showCursor: !n && !n1 && !p && !jA && !c0,
      argumentHint: P6,
      onUndo: V4 ? () => {
        let T0 = U9();
        if (T0) F(T0.text), CA(T0.cursorOffset), j(T0.pastedContents)
      } : void 0,
      highlights: c2,
      placeholderElement: Q4,
      inlineGhostText: pG
    },
    MK = () => {
      let T0 = {
        bash: "bashBorder",
        background: "background"
      };
      if (T0[H]) return T0[H];
      if (IL7()) return "promptBorder";
      let NQ = JL7();
      if (NQ && SN.includes(NQ)) return fb[NQ];
      return "promptBorder"
    };
  if (y1) return q2.createElement(T, {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: MK(),
    borderDimColor: !0,
    borderStyle: "round",
    borderLeft: !1,
    borderRight: !1,
    borderBottom: !0,
    width: "100%"
  }, q2.createElement(C, {
    dimColor: !0,
    italic: !0
  }, "Save and close editor to continue..."));
  let CG = We() ? q2.createElement(oS0, {
    ...IJ,
    initialMode: x,
    onModeChange: b,
    isLoading: X
  }) : q2.createElement(p4, {
    ...IJ
  });
  return q2.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, q2.createElement(yV9, null), q2.createElement(DL7, null), q2.createElement(kV9, {
    hasStash: z !== void 0
  }), q2.createElement(gV9, {
    pastedContents: _,
    linkedAttachments: V1,
    isSelected: c0,
    selectedIndex: UA,
    showTip: !1,
    terminalWidth: M0
  }), T2 ? q2.createElement(q2.Fragment, null, q2.createElement(C, {
    color: T2.bgColor
  }, "─".repeat(Math.max(0, M0 - T2.text.length - 4)), q2.createElement(C, {
    backgroundColor: T2.bgColor,
    color: "inverseText"
  }, " ", T2.text, " "), "──"), q2.createElement(T, {
    flexDirection: "row",
    width: "100%"
  }, q2.createElement(Bx0, {
    mode: H,
    isLoading: X
  }), q2.createElement(T, {
    flexGrow: 1,
    flexShrink: 1
  }, CG)), q2.createElement(C, {
    color: T2.bgColor
  }, "─".repeat(M0))) : q2.createElement(T, {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderColor: MK(),
    borderDimColor: !0,
    borderStyle: "round",
    borderLeft: !1,
    borderRight: !1,
    borderBottom: !0,
    width: "100%"
  }, q2.createElement(Bx0, {
    mode: H,
    isLoading: X
  }), q2.createElement(T, {
    flexGrow: 1,
    flexShrink: 1
  }, CG)), q2.createElement(sK9, {
    apiKeyStatus: Z,
    debug: A,
    exitMessage: t,
    vimMode: x,
    mode: H,
    autoUpdaterResult: K,
    isAutoUpdating: _A,
    verbose: I,
    onAutoUpdaterResult: W,
    onChangeIsUpdating: s,
    suggestions: F6,
    selectedSuggestion: cG,
    maxColumnWidth: T3,
    toolPermissionContext: B,
    helpOpen: ZA,
    suppressHint: V.length > 0,
    tasksSelected: n,
    teamsSelected: n1,
    diffSelected: p,
    ideSelection: Q,
    mcpClients: M,
    isPasting: t0,
    isInputWrapped: G8,
    messages: D,
    isSearching: jA,
    historyQuery: mA,
    setHistoryQuery: G1,
    historyFailedMatch: SA
  }))
}
// @from(Ln 456432, Col 0)
function VL7(A) {
  let Q = 0;
  for (let B of A)
    if (B.type === "user") {
      if (B.imagePasteIds) {
        for (let G of B.imagePasteIds)
          if (G > Q) Q = G
      }
      if (Array.isArray(B.message.content)) {
        for (let G of B.message.content)
          if (G.type === "text") {
            let Z = W91(G.text);
            for (let Y of Z)
              if (Y.id > Q) Q = Y.id
          }
      }
    } return Q + 1
}
// @from(Ln 456450, Col 4)
q2
// @from(Ln 456450, Col 8)
z4
// @from(Ln 456450, Col 12)
JL7 = () => null
// @from(Ln 456451, Col 2)
XL7 = () => null
// @from(Ln 456452, Col 2)
IL7 = () => !1
// @from(Ln 456453, Col 2)
DL7 = () => null
// @from(Ln 456454, Col 2)
WL7 = () => null
// @from(Ln 456455, Col 2)
sV9
// @from(Ln 456456, Col 4)
tV9 = w(() => {
  fA();
  rR();
  Z3();
  c6();
  aW9();
  YC1();
  HK9();
  GQ();
  Vm();
  IY();
  vK9();
  fzA();
  WV();
  P4();
  _kA();
  dW();
  C0();
  tK9();
  JZ();
  XjA();
  Z0();
  w6();
  mSA();
  p3();
  NX();
  x3A();
  c3();
  eBA();
  AV9();
  V2();
  BV9();
  Y_();
  Ax0();
  kS0();
  tj0();
  $V9();
  wS0();
  EO();
  hB();
  wV9();
  jV9();
  TV9();
  vV9();
  VO();
  bV9();
  I3();
  HuA();
  Jx0();
  dV9();
  HY();
  lV9();
  hhA();
  hH1();
  wE1();
  nV9();
  Jx0();
  IHA();
  oV9();
  q2 = c(QA(), 1), z4 = c(QA(), 1);
  sV9 = q2.memo(KL7)
})
// @from(Ln 456519, Col 0)
function eV9({
  inputValue: A,
  isAssistantResponding: Q
}) {
  let [B, G] = a0(), Z = !0, Y = !0, J = null, X = v8A.useRef(!1);
  v8A.useEffect(() => {}, [!0, B.promptCoaching.tip]);
  let I = v8A.useCallback((D = "dismissed") => {
    return
  }, [!0, G]);
  return v8A.useEffect(() => {
    return
  }, [!0, B.promptCoaching.tip, A, Q, I]), {
    tip: null,
    dismissTip: () => {}
  };
  return {
    tip: null,
    dismissTip: () => I("dismissed")
  }
}
// @from(Ln 456539, Col 4)
v8A
// @from(Ln 456540, Col 4)
AF9 = w(() => {
  hB();
  Z0();
  vhA();
  v8A = c(QA(), 1)
})
// @from(Ln 456546, Col 4)
FL7
// @from(Ln 456547, Col 4)
QF9 = w(() => {
  fA();
  FL7 = c(QA(), 1)
})
// @from(Ln 456552, Col 0)
function GF9() {
  BF9.useEffect(() => {
    let A = Math.round(process.uptime() * 1000);
    l("tengu_timer", {
      event: "startup",
      durationMs: A
    })
  }, [])
}
// @from(Ln 456561, Col 4)
BF9
// @from(Ln 456562, Col 4)
ZF9 = w(() => {
  Z0();
  BF9 = c(QA(), 1)
})
// @from(Ln 456567, Col 0)
function YF9() {
  let [A, Q] = GmA.useState(() => {
    let Y = YL();
    if (!iq() || qB()) return "valid";
    if (Y) return "loading";
    return "missing"
  }), [B, G] = GmA.useState(null), Z = GmA.useCallback(async () => {
    if (!iq() || qB()) {
      Q("valid");
      return
    }
    let Y = YL();
    if (!Y) {
      Q("missing");
      return
    }
    try {
      let X = await QJ9(Y, !1) ? "valid" : "invalid";
      Q(X);
      return
    } catch (J) {
      G(J), Q("error");
      return
    }
  }, []);
  return {
    status: A,
    reverify: Z,
    error: B
  }
}
// @from(Ln 456598, Col 4)
GmA
// @from(Ln 456599, Col 4)
JF9 = w(() => {
  nY();
  Q2();
  GmA = c(QA(), 1)
})
// @from(Ln 456605, Col 0)
function Xx0({
  screen: A,
  setScreen: Q,
  setScreenToggleId: B,
  setShowAllInTranscript: G,
  clearTerminal: Z,
  onEnterTranscript: Y,
  onExitTranscript: J,
  todos: X
}) {
  let I = k8A.useContext(AN),
    [D, W] = a0(),
    K = k8A.useCallback(() => {
      l("tengu_toggle_todos", {
        is_expanded: D.showExpandedTodos,
        has_todos: X && X.length > 0
      }), W((z) => ({
        ...z,
        showExpandedTodos: !z.showExpandedTodos
      }))
    }, [D.showExpandedTodos, X, W]),
    V = k8A.useCallback(async () => {
      let z = A !== "transcript";
      if (Q(($) => $ === "transcript" ? "prompt" : "transcript"), B(($) => $ + 1), G(!1), z && Y) Y();
      if (!z && J) J();
      if (!I) await Z()
    }, [A, Q, B, G, Y, J, I, Z]),
    F = k8A.useCallback(async () => {
      if (G((z) => !z), B((z) => z + 1), !I) await Z()
    }, [G, B, I, Z]),
    H = k8A.useCallback(async () => {
      if (Q("prompt"), B((z) => z + 1), G(!1), J) J();
      if (!I) await Z()
    }, [Q, B, G, J, I, Z]);
  H2("app:toggleTodos", K, {
    context: "Global"
  }), H2("app:toggleTranscript", V, {
    context: "Global"
  });
  let E = A === "transcript";
  return H2("transcript:toggleShowAll", F, {
    context: "Transcript",
    isActive: E
  }), H2("transcript:exit", H, {
    context: "Transcript",
    isActive: E
  }), null
}
// @from(Ln 456653, Col 4)
k8A
// @from(Ln 456654, Col 4)
XF9 = w(() => {
  ba();
  c6();
  hB();
  Z0();
  k8A = c(QA(), 1)
})
// @from(Ln 456662, Col 0)
function Ix0({
  setToolUseConfirmQueue: A,
  onCancel: Q,
  isMessageSelectorVisible: B,
  screen: G,
  abortSignal: Z,
  popCommandFromQueue: Y,
  vimMode: J,
  isLocalJSXCommand: X,
  isSearchingHistory: I,
  isSideQuestionVisible: D,
  isHelpOpen: W
}) {
  let [{
    queuedCommands: K
  }] = a0(), V = IF9.useCallback(() => {
    if (Z !== void 0 && !Z.aborted) {
      l("tengu_cancel", {}), A(() => []), Q();
      return
    }
    if (K.length > 0) {
      if (Y) {
        Y();
        return
      }
    }
    l("tengu_cancel", {}), A(() => []), Q()
  }, [Z, K, Y, A, Q]), F = Z !== void 0 && !Z.aborted, H = K.length > 0, E = G !== "transcript" && !I && !B && !X && !D && !W && !(We() && J === "INSERT") && (F || H);
  return H2("chat:cancel", V, {
    context: "Chat",
    isActive: E
  }), H2("app:interrupt", V, {
    context: "Global",
    isActive: E
  }), null
}
// @from(Ln 456698, Col 4)
IF9
// @from(Ln 456699, Col 4)
DF9 = w(() => {
  Z0();
  fzA();
  hB();
  c6();
  IF9 = c(QA(), 1)
})
// @from(Ln 456707, Col 0)
function LC1(A) {
  return HL7.includes(A)
}
// @from(Ln 456711, Col 0)
function OC1(A, Q, B, G) {
  if (!A.toolDecisions) A.toolDecisions = new Map;
  A.toolDecisions.set(Q, {
    source: G,
    decision: B,
    timestamp: Date.now()
  })
}
// @from(Ln 456720, Col 0)
function MC1(A, Q, B, G) {
  let Z;
  if (A.getPath && Q) {
    let Y = A.inputSchema.safeParse(Q);
    if (Y.success) {
      let J = A.getPath(Y.data);
      if (J) Z = ge(J)
    }
  }
  return {
    decision: B,
    source: G,
    tool_name: A.name,
    ...Z && {
      language: Z
    }
  }
}
// @from(Ln 456738, Col 0)
async function RC1(A, Q, B) {
  await LF("tool_decision", {
    decision: Q,
    source: B,
    tool_name: k9(A)
  })
}
// @from(Ln 456746, Col 0)
function WF9(A, Q, B, G, Z) {
  if (l("tengu_tool_use_granted_in_config", {
      messageID: G,
      toolName: k9(A.name),
      sandboxEnabled: XB.isSandboxingEnabled()
    }), LC1(A.name)) {
    let Y = MC1(A, Q, "accept", "config");
    vCA()?.add(1, Y)
  }
  OC1(B, Z, "accept", "config"), RC1(A.name, "accept", "config")
}
// @from(Ln 456758, Col 0)
function EL7(A) {
  switch (A.type) {
    case "hook":
      return "hook";
    case "user":
      return A.permanent ? "user_permanent" : "user_temporary"
  }
}
// @from(Ln 456767, Col 0)
function KF9(A, Q, B, G, Z, Y, J) {
  let X = J !== void 0 ? Date.now() - J : void 0;
  switch (Y.type) {
    case "user":
      l(Y.permanent ? "tengu_tool_use_granted_in_prompt_permanent" : "tengu_tool_use_granted_in_prompt_temporary", {
        messageID: G,
        toolName: k9(A.name),
        sandboxEnabled: XB.isSandboxingEnabled(),
        ...X !== void 0 && {
          waiting_for_user_permission_ms: X
        }
      });
      break;
    case "hook":
      l("tengu_tool_use_granted_by_permission_hook", {
        messageID: G,
        toolName: k9(A.name),
        sandboxEnabled: XB.isSandboxingEnabled(),
        permanent: Y.permanent ?? !1,
        ...X !== void 0 && {
          waiting_for_user_permission_ms: X
        }
      });
      break
  }
  let I = EL7(Y);
  if (LC1(A.name)) {
    let D = MC1(A, Q, "accept", I);
    vCA()?.add(1, D)
  }
  OC1(B, Z, "accept", I), RC1(A.name, "accept", I)
}
// @from(Ln 456800, Col 0)
function Dx0(A, Q, B, G, Z, Y, J) {
  let X = Y.type === "hook",
    I = X ? "hook" : Y.type,
    D = J !== void 0 ? Date.now() - J : void 0;
  if (X) l("tengu_tool_use_rejected_in_prompt", {
    messageID: G,
    toolName: k9(A.name),
    sandboxEnabled: XB.isSandboxingEnabled(),
    isHook: !0,
    ...D !== void 0 && {
      waiting_for_user_permission_ms: D
    }
  });
  else {
    let W = Y.type === "user_reject" ? Y.hasFeedback : !1;
    l("tengu_tool_use_rejected_in_prompt", {
      messageID: G,
      toolName: k9(A.name),
      sandboxEnabled: XB.isSandboxingEnabled(),
      hasFeedback: W,
      ...D !== void 0 && {
        waiting_for_user_permission_ms: D
      }
    })
  }
  if (LC1(A.name)) {
    let W = MC1(A, Q, "reject", I);
    vCA()?.add(1, W)
  }
  OC1(B, Z, "reject", I), RC1(A.name, "reject", I)
}
// @from(Ln 456832, Col 0)
function zL7(A, Q) {
  return VF9.useCallback(async (B, G, Z, Y, J, X) => {
    return new Promise((I) => {
      function D() {
        l("tengu_tool_use_cancelled", {
          messageID: Y.message.id,
          toolName: k9(B.name)
        })
      }

      function W(V, F) {
        let H = !!Z.agentId,
          $ = V ? `${H?TJ9:gyA}${V}` : H ? jJ9 : v4A;
        if (I({
            behavior: "ask",
            message: $
          }), F || !V && !H) Z.abortController.abort()
      }
      if (Z.abortController.signal.aborted) {
        D(), W(void 0, !0);
        return
      }
      return (X !== void 0 ? Promise.resolve(X) : B$(B, G, Z, Y, J)).then(async (V) => {
        if (V.behavior === "allow") {
          WF9(B, G, Z, Y.message.id, J), I({
            ...V,
            updatedInput: G,
            userModified: !1
          });
          return
        }
        let F = await Z.getAppState(),
          H = await B.description(G, {
            isNonInteractiveSession: Z.options.isNonInteractiveSession,
            toolPermissionContext: F.toolPermissionContext,
            tools: Z.options.tools
          });
        if (Z.abortController.signal.aborted) {
          D(), W(void 0, !0);
          return
        }
        switch (V.behavior) {
          case "deny": {
            if (l("tengu_tool_use_denied_in_config", {
                messageID: Y.message.id,
                toolName: k9(B.name),
                sandboxEnabled: XB.isSandboxingEnabled()
              }), LC1(B.name)) {
              let E = MC1(B, G, "reject", "config");
              vCA()?.add(1, E)
            }
            OC1(Z, J, "reject", "config"), RC1(B.name, "reject", "config"), I(V);
            return
          }
          case "ask": {
            let E = !1,
              z = Date.now();
            A((O) => [...O, {
              assistantMessage: Y,
              tool: B,
              description: H,
              input: G,
              toolUseContext: Z,
              toolUseID: J,
              permissionResult: V,
              permissionPromptStartTimeMs: z,
              onAbort() {
                if (E) return;
                E = !0, D(), Dx0(B, G, Z, Y.message.id, J, {
                  type: "user_abort"
                }, z), W(void 0, !0)
              },
              async onAllow(L, M, _) {
                if (E) return;
                E = !0, cMA(M);
                let j = await Z.getAppState(),
                  x = Wk(j.toolPermissionContext, M);
                Q(x);
                let b = M.some((f) => q01(f.destination));
                KF9(B, L, Z, Y.message.id, J, {
                  type: "user",
                  permanent: b
                }, z);
                let S = B.inputsEquivalent ? !B.inputsEquivalent(G, L) : !1,
                  u = _?.trim();
                I({
                  behavior: "allow",
                  updatedInput: L,
                  userModified: S,
                  acceptFeedback: u || void 0
                })
              },
              onReject(L) {
                if (E) return;
                E = !0, Dx0(B, G, Z, Y.message.id, J, {
                  type: "user_reject",
                  hasFeedback: !!L
                }, z), W(L)
              },
              async recheckPermission() {
                if (E) return;
                let L = await B$(B, G, Z, Y, J);
                if (L.behavior === "allow") A((M) => M.filter((_) => _.toolUseID !== J)), WF9(B, G, Z, Y.message.id, J), E = !0, I({
                  behavior: "allow",
                  updatedInput: L.updatedInput || G,
                  userModified: !1
                })
              }
            }]);
            let $ = await Z.getAppState();
            (async () => {
              for await (let O of SVA([eU0(B.name, J, G, Z, $.toolPermissionContext.mode, V.suggestions, Z.abortController.signal)])) {
                if (E) return;
                if (O.permissionRequestResult && (O.permissionRequestResult.behavior === "allow" || O.permissionRequestResult.behavior === "deny")) {
                  E = !0, A((M) => M.filter((_) => _.toolUseID !== J));
                  let L = O.permissionRequestResult;
                  if (L.behavior === "allow") {
                    let M = L.updatedInput || G,
                      _ = L.updatedPermissions ?? [];
                    if (_.length > 0) {
                      cMA(_);
                      let x = await Z.getAppState(),
                        b = Wk(x.toolPermissionContext, _);
                      Q(b)
                    }
                    let j = _.some((x) => q01(x.destination));
                    KF9(B, M, Z, Y.message.id, J, {
                      type: "hook",
                      permanent: j
                    }, z), I({
                      behavior: "allow",
                      updatedInput: M,
                      userModified: !1,
                      decisionReason: {
                        type: "hook",
                        hookName: "PermissionRequest"
                      }
                    });
                    return
                  } else if (L.behavior === "deny") {
                    if (Dx0(B, G, Z, Y.message.id, J, {
                        type: "hook"
                      }, z), I({
                        behavior: "deny",
                        message: L.message || "Permission denied by hook",
                        decisionReason: {
                          type: "hook",
                          hookName: "PermissionRequest",
                          reason: L.message
                        }
                      }), L.interrupt) Z.abortController.abort();
                    return
                  }
                }
              }
            })();
            return
          }
        }
      }).catch((V) => {
        if (V instanceof aG) D(), W(void 0, !0);
        else e(V)
      })
    })
  }, [A, Q])
}
// @from(Ln 456998, Col 4)
VF9
// @from(Ln 456998, Col 9)
HL7
// @from(Ln 456998, Col 14)
FF9
// @from(Ln 456999, Col 4)
HF9 = w(() => {
  YZ();
  Z0();
  hW();
  tQ();
  XX();
  v1();
  C0();
  fr();
  y9();
  dW();
  NJ();
  zO();
  gr();
  A0();
  VF9 = c(QA(), 1), HL7 = ["Edit", "Write", "NotebookEdit"];
  FF9 = zL7
})
// @from(Ln 457018, Col 0)
function zF9(A) {
  return EF9.useMemo(() => {
    let Q = CjA(A);
    return {
      level: Q.level,
      tokens: Q.tokens
    }
  }, [A])
}
// @from(Ln 457027, Col 4)
EF9
// @from(Ln 457028, Col 4)
$F9 = w(() => {
  Y_();
  EF9 = c(QA(), 1)
})
// @from(Ln 457033, Col 0)
function $L7() {
  rSA(), X71(""), f6(0)
}
// @from(Ln 457036, Col 0)
async function _C1(A) {
  let {
    input: Q,
    helpers: B,
    isLoading: G,
    mode: Z,
    commands: Y,
    onInputChange: J,
    setPastedContents: X,
    setIsLoading: I,
    setToolJSX: D,
    getToolUseContext: W,
    messages: K,
    mainLoopModel: V,
    pastedContents: F,
    ideSelection: H,
    setUserInputOnProcessing: E,
    setAbortController: z,
    onQuery: $,
    resetLoadingState: O,
    thinkingTokens: L,
    thinkingEnabled: M,
    setAppState: _,
    onBeforeQuery: j,
    canUseTool: x
  } = A, {
    setCursorOffset: b,
    clearBuffer: S,
    resetHistory: u
  } = B, f = Object.values(F).some((p) => p.type === "image");
  if (Q.trim() === "" && !f) return;
  if (["exit", "quit", ":q", ":q!", ":wq", ":wq!"].includes(Q.trim())) {
    if (Y.find((GA) => GA.name === "exit")) _C1({
      ...A,
      input: "/exit"
    });
    else $L7();
    return
  }
  let AA = Q,
    n = W91(Q),
    y = 0;
  for (let p of n) {
    let GA = F[p.id];
    if (GA && GA.type === "text") AA = AA.replace(p.match, GA.content), y++
  }
  if (l("tengu_paste_text", {
      pastedTextCount: y
    }), G) {
    if (Z !== "prompt") return;
    let p, GA;
    if (f) p = NL7(AA, F), GA = Object.values(F).filter((WA) => WA.type === "image").map((WA) => WA.id);
    else p = AA.trim();
    wF({
      value: p,
      mode: "prompt",
      imagePasteIds: GA
    }, _), J(""), b(0), X({}), u(), S();
    return
  }
  Z19(), await CL7({
    input: AA,
    mode: Z,
    messages: K,
    mainLoopModel: V,
    pastedContents: F,
    ideSelection: H,
    thinkingTokens: L,
    thinkingEnabled: M,
    querySource: A.querySource,
    commands: Y,
    isLoading: G,
    setIsLoading: I,
    setToolJSX: D,
    getToolUseContext: W,
    setUserInputOnProcessing: E,
    setAbortController: z,
    onQuery: $,
    resetLoadingState: O,
    setAppState: _,
    onBeforeQuery: j,
    resetHistory: u,
    canUseTool: x
  })
}
// @from(Ln 457121, Col 0)
async function CL7(A) {
  let {
    input: Q,
    mode: B,
    messages: G,
    mainLoopModel: Z,
    pastedContents: Y,
    ideSelection: J,
    thinkingTokens: X,
    thinkingEnabled: I,
    querySource: D,
    isLoading: W,
    setIsLoading: K,
    setToolJSX: V,
    getToolUseContext: F,
    setUserInputOnProcessing: H,
    setAbortController: E,
    onQuery: z,
    setAppState: $,
    onBeforeQuery: O,
    resetHistory: L,
    canUseTool: M
  } = A, _ = !W, j = c9();
  if (_) E(j);
  try {
    let x = UL7(B, X, Q, I);
    h6("query_process_user_input_start");
    let {
      messages: b,
      shouldQuery: S,
      allowedTools: u,
      maxThinkingTokens: f,
      model: AA
    } = await vH1({
      input: Q,
      mode: B,
      setIsLoading: K,
      setToolJSX: V,
      context: F(G, [], j, [], void 0, Z),
      pastedContents: Y,
      ideSelection: J,
      messages: G,
      setUserInputOnProcessing: H,
      isAlreadyProcessing: W,
      thinkingMetadata: x,
      querySource: D,
      canUseTool: M
    });
    if (h6("query_process_user_input_end"), vG()) h6("query_file_history_snapshot_start"), b.filter(uhA).forEach((n) => {
      MHA((y) => {
        $((p) => ({
          ...p,
          fileHistory: y(p.fileHistory)
        }))
      }, n.uuid)
    }), h6("query_file_history_snapshot_end");
    if (b.length) L(), V(null), await z(b, j, S, u ?? [], AA ?? Z, f, B === "prompt" ? O : void 0, Q);
    else if (K(!1), V(null), L(), !W) E(null)
  } finally {
    K(!1)
  }
}
// @from(Ln 457184, Col 0)
function UL7(A, Q, B, G) {
  if (A !== "prompt") return;
  let Z = Q > 0,
    Y = Z ? zDA(B) : [],
    J = !G && !Z;
  return {
    level: J ? "none" : "high",
    disabled: J,
    triggers: Y.map((I) => ({
      start: I.start,
      end: I.end,
      text: B.slice(I.start, I.end)
    }))
  }
}
// @from(Ln 457200, Col 0)
function qL7(A) {
  return A === "image/jpeg" || A === "image/png" || A === "image/gif" || A === "image/webp"
}
// @from(Ln 457204, Col 0)
function NL7(A, Q) {
  let B = [],
    G = A.trim();
  if (G) B.push({
    type: "text",
    text: G
  });
  for (let Z of Object.values(Q))
    if (Z.type === "image" && qL7(Z.mediaType)) B.push({
      type: "image",
      source: {
        type: "base64",
        media_type: Z.mediaType,
        data: Z.content
      }
    });
  if (B.length === 0) B.push({
    type: "text",
    text: A
  });
  return B
}
// @from(Ln 457226, Col 4)
CF9 = w(() => {
  VO();
  Vm();
  Z0();
  iZ();
  Y_();
  UM0();
  oN();
  kH1();
  Xd();
  yJ();
  WzA()
})
// @from(Ln 457240, Col 0)
function wL7(A, Q) {
  let B = [],
    G = {},
    Z = Q;
  for (let Y of A)
    if (Y.type === "text") B.push(Y.text);
    else if (Y.type === "image" && Y.source.type === "base64") {
    let J = Z++;
    G[J] = {
      id: J,
      type: "image",
      content: Y.source.data,
      mediaType: Y.source.media_type
    }
  }
  return {
    text: B.join(" ").trim(),
    pastedContents: G,
    nextPasteId: Z
  }
}
// @from(Ln 457261, Col 0)
async function UF9({
  getAppState: A,
  setAppState: Q,
  executeInput: B
}) {
  let G = await C32(A, Q);
  if (G.length === 0) return {
    processed: !1
  };
  let Z = [],
    Y = {},
    J = 1;
  for (let I of G)
    if (typeof I.value === "string") Z.push(I.value);
    else {
      let D = wL7(I.value, J);
      Z.push(D.text), Object.assign(Y, D.pastedContents), J = D.nextPasteId
    } let X = Z.join(`
`);
  return await B(X, Y), {
    processed: !0
  }
}
// @from(Ln 457284, Col 4)
qF9 = w(() => {
  VO()
})
// @from(Ln 457288, Col 0)
function NF9({
  isLoading: A,
  queuedCommandsLength: Q,
  lastQueryCompletionTime: B,
  getAppState: G,
  setAppState: Z,
  executeQueuedInput: Y
}) {
  let J = jC1.useRef(!1);
  jC1.useEffect(() => {
    if (A) return;
    if (Q === 0) return;
    if (J.current) return;
    J.current = !0;
    async function X() {
      while (!0) {
        let {
          processed: I
        } = await UF9({
          getAppState: G,
          setAppState: Z,
          executeInput: Y
        });
        if (!I) break;
        if ((await G()).queuedCommands.length === 0) break
      }
      J.current = !1
    }
    X()
  }, [A, Q, B, G, Z, Y])
}
// @from(Ln 457319, Col 4)
jC1
// @from(Ln 457320, Col 4)
wF9 = w(() => {
  qF9();
  jC1 = c(QA(), 1)
})
// @from(Ln 457325, Col 0)
function OF9(A, Q) {
  return LF9.useMemo(() => {
    if (A && Q && Q.length > 0) return Wi([...A, ...Q], "name");
    return A || []
  }, [A, Q])
}
// @from(Ln 457331, Col 4)
LF9
// @from(Ln 457332, Col 4)
MF9 = w(() => {
  EUA();
  LF9 = c(QA(), 1)
})
// @from(Ln 457337, Col 0)
function Wx0(A, Q) {
  return RF9.useMemo(() => {
    if (Q.length > 0) return Wi([...A, ...Q], "name");
    return A
  }, [A, Q])
}
// @from(Ln 457343, Col 4)
RF9
// @from(Ln 457344, Col 4)
_F9 = w(() => {
  EUA();
  RF9 = c(QA(), 1)
})
// @from(Ln 457349, Col 0)
function jF9(A, Q) {
  let B = TC1.useCallback(async () => {
    try {
      lt();
      let G = await Aj(A);
      Q(G)
    } catch (G) {
      if (G instanceof Error) e(G)
    }
  }, [A, Q]);
  TC1.useEffect(() => k$1.subscribe(B), [B])
}
// @from(Ln 457361, Col 4)
TC1
// @from(Ln 457362, Col 4)
TF9 = w(() => {
  JS0();
  WV();
  v1();
  TC1 = c(QA(), 1)
})
// @from(Ln 457369, Col 0)
function SC1() {
  let [, A] = a0(), Q = PC1.useCallback(async () => {
    try {
      let {
        enabled: B,
        disabled: G,
        errors: Z
      } = await DG(), Y = [], J = [];
      try {
        Y = await z3A()
      } catch (X) {
        let I = X instanceof Error ? X.message : String(X);
        Z.push({
          type: "generic-error",
          source: "plugin-commands",
          error: `Failed to load plugin commands: ${I}`
        })
      }
      try {
        J = await O4A()
      } catch (X) {
        let I = X instanceof Error ? X.message : String(X);
        Z.push({
          type: "generic-error",
          source: "plugin-agents",
          error: `Failed to load plugin agents: ${I}`
        })
      }
      try {
        await Qt()
      } catch (X) {
        let I = X instanceof Error ? X.message : String(X);
        Z.push({
          type: "generic-error",
          source: "plugin-hooks",
          error: `Failed to load plugin hooks: ${I}`
        })
      }
      A((X) => {
        let I = X.plugins.errors.filter((V) => V.source === "lsp-manager" || V.source.startsWith("plugin:")),
          D = new Set(Z.map((V) => V.type === "generic-error" ? `generic-error:${V.source}:${V.error}` : `${V.type}:${V.source}`)),
          K = [...I.filter((V) => {
            let F = V.type === "generic-error" ? `generic-error:${V.source}:${V.error}` : `${V.type}:${V.source}`;
            return !D.has(F)
          }), ...Z];
        return {
          ...X,
          plugins: {
            ...X.plugins,
            enabled: B,
            disabled: G,
            commands: Y,
            agents: J,
            errors: K
          }
        }
      }), k(`Loaded plugins - Enabled: ${B.length}, Disabled: ${G.length}, Commands: ${Y.length}, Agents: ${J.length}, Errors: ${Z.length}`)
    } catch (B) {
      let G = B instanceof Error ? B : Error(String(B));
      e(G), k(`Error loading plugins: ${B}`), A((Z) => {
        let Y = Z.plugins.errors.filter((X) => X.source === "lsp-manager" || X.source.startsWith("plugin:")),
          J = {
            type: "generic-error",
            source: "plugin-system",
            error: G.message
          };
        return {
          ...Z,
          plugins: {
            ...Z.plugins,
            enabled: [],
            disabled: [],
            commands: [],
            agents: [],
            errors: [...Y, J]
          }
        }
      })
    }
  }, [A]);
  return PC1.useEffect(() => {
    Q()
  }, [Q]), {
    refreshPlugins: Q
  }
}
// @from(Ln 457455, Col 4)
PC1
// @from(Ln 457456, Col 4)
Kx0 = w(() => {
  hB();
  GK();
  afA();
  LyA();
  mbA();
  T1();
  v1();
  PC1 = c(QA(), 1)
})
// @from(Ln 457467, Col 0)
function PF9(A, Q) {
  let B = ZmA.useRef(!1),
    G = ZmA.useRef(null);
  ZmA.useEffect(() => {
    let Z = nN(A);
    if (G.current !== Z) B.current = !1, G.current = Z || null, Q({
      lineCount: 0,
      lineStart: void 0,
      text: void 0,
      filePath: void 0
    });
    if (B.current || !Z) return;
    let Y = (J) => {
      if (J.selection?.start && J.selection?.end) {
        let {
          start: X,
          end: I
        } = J.selection, D = I.line - X.line + 1;
        if (I.character === 0) D--;
        let W = {
          lineCount: D,
          lineStart: X.line,
          text: J.text,
          filePath: J.filePath
        };
        Q(W)
      }
    };
    Z.client.setNotificationHandler(LL7, (J) => {
      if (G.current !== Z) return;
      try {
        let X = J.params;
        if (X.selection && X.selection.start && X.selection.end) Y(X);
        else if (X.text !== void 0) Y({
          selection: null,
          text: X.text,
          filePath: X.filePath
        })
      } catch (X) {
        e(X)
      }
    }), B.current = !0
  }, [A, Q])
}
// @from(Ln 457511, Col 4)
ZmA
// @from(Ln 457511, Col 9)
LL7