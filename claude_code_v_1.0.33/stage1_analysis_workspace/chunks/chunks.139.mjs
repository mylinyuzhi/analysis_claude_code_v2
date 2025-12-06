
// @from(Start 13180358, End 13181061)
function WQ9({
  shell: A
}) {
  switch (A.status) {
    case "completed":
      return cXA.default.createElement($, {
        color: "success",
        dimColor: !0
      }, "done");
    case "failed":
      return cXA.default.createElement($, {
        color: "error",
        dimColor: !0
      }, "error");
    case "killed":
      return cXA.default.createElement($, {
        color: "error",
        dimColor: !0
      }, "killed");
    case "running": {
      let Q = JQ9(A.stderr) || JQ9(A.stdout);
      if (!Q) return cXA.default.createElement($, {
        dimColor: !0
      }, "no output");
      return cXA.default.createElement($, {
        dimColor: !0
      }, J7(Q, 20, !0))
    }
  }
}
// @from(Start 13181063, End 13181233)
function JQ9(A) {
  if (!A) return "";
  let Q = A.split(`
`);
  for (let B = Q.length - 1; B >= 0; B--) {
    let G = Q[B]?.trim();
    if (G) return G
  }
  return ""
}
// @from(Start 13181238, End 13181241)
cXA
// @from(Start 13181247, End 13181293)
XQ9 = L(() => {
  hA();
  cXA = BA(VA(), 1)
})
// @from(Start 13181296, End 13181871)
function xZ1({
  session: A
}) {
  if (A.status === "completed") return AjA.default.createElement($, {
    bold: !0,
    color: "success",
    dimColor: !0
  }, "done");
  if (A.status === "failed") return AjA.default.createElement($, {
    bold: !0,
    color: "error",
    dimColor: !0
  }, "error");
  if (!A.todoList.length) return AjA.default.createElement($, {
    dimColor: !0
  }, A.status, "…");
  let Q = A.todoList.filter((G) => G.status === "completed").length,
    B = A.todoList.length;
  return AjA.default.createElement($, {
    dimColor: !0
  }, Q, "/", B)
}
// @from(Start 13181876, End 13181879)
AjA
// @from(Start 13181885, End 13181931)
uJ0 = L(() => {
  hA();
  AjA = BA(VA(), 1)
})
// @from(Start 13181934, End 13182496)
function vZ1({
  task: A
}) {
  switch (A.type) {
    case "shell":
      return rq.createElement($, null, J7(A.command, 40, !0), " ", rq.createElement(WQ9, {
        shell: A
      }));
    case "remote_session":
      return rq.createElement($, null, J7(A.title, 40, !0), " ", rq.createElement(xZ1, {
        session: A
      }));
    case "async_agent":
      return rq.createElement($, null, J7(A.description, 40, !0), " ", rq.createElement($, {
        dimColor: !0
      }, "(", A.status, A.status === "completed" && !A.retrieved && ", unread", ")"))
  }
}
// @from(Start 13182501, End 13182503)
rq
// @from(Start 13182509, End 13182572)
mJ0 = L(() => {
  XQ9();
  uJ0();
  hA();
  rq = BA(VA(), 1)
})
// @from(Start 13182621, End 13183681)
function Pg(A) {
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
          uuid: Q.uuid ?? pO3(),
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
// @from(Start 13183683, End 13185098)
function VQ9(A) {
  return A.flatMap((Q) => {
    switch (Q.type) {
      case "assistant":
        return [{
          type: "assistant",
          message: Q.message,
          session_id: e1(),
          parent_tool_use_id: null,
          uuid: Q.uuid,
          error: Q.error
        }];
      case "user":
        return [{
          type: "user",
          message: Q.message,
          session_id: e1(),
          parent_tool_use_id: null,
          uuid: Q.uuid,
          isSynthetic: Q.isMeta || Q.isVisibleInTranscriptOnly
        }];
      case "system":
        if (Q.subtype === "compact_boundary" && Q.compactMetadata) return [{
          type: "system",
          subtype: "compact_boundary",
          session_id: e1(),
          uuid: Q.uuid,
          compact_metadata: {
            trigger: Q.compactMetadata.trigger,
            pre_tokens: Q.compactMetadata.preTokens
          }
        }];
        return [];
      case "attachment":
        if (m91(Q.attachment)) return [{
          type: "system",
          subtype: "hook_response",
          session_id: e1(),
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
// @from(Start 13185103, End 13185136)
QjA = L(() => {
  _0();
  IO()
})
// @from(Start 13185139, End 13186163)
function FQ9({
  tasksSelected: A,
  showHint: Q
}) {
  let {
    columns: B
  } = WB(), G = jg.useMemo(() => N1().hasSeenTasksHint, []), [{
    backgroundTasks: Z
  }] = OQ();
  lO3();
  let I = Q && (A || !G) ? lG.createElement(lG.Fragment, null, lG.createElement($, {
      dimColor: !0
    }, "· "), lG.createElement($, {
      dimColor: !0
    }, A ? "Enter to view tasks" : "↓ to view")) : null,
    Y = Object.values(Z).filter((J) => J.status === "running");
  if (Y.length === 0) return;
  if (Y.length > 1 || B < 150) return lG.createElement(lG.Fragment, null, lG.createElement($, {
    color: "background",
    inverse: A
  }, Y.length, " background", " ", Y.length === 1 ? "task" : "tasks"), I ? lG.createElement($, null, " ", I) : null);
  if (Y.length === 1) {
    let J = Y[0];
    return lG.createElement(lG.Fragment, null, lG.createElement($, {
      color: "background",
      inverse: A
    }, lG.createElement(vZ1, {
      task: J
    })), I ? lG.createElement($, null, " ", I) : null)
  }
  return null
}
// @from(Start 13186165, End 13187075)
function lO3() {
  let [{
    backgroundTasks: A
  }, Q] = OQ(), B = jg.useMemo(() => Object.values(A).filter((Y) => Y.type === "remote_session"), [A]), [G, Z] = jg.useState([]), I = jg.useCallback(async (Y) => {
    for await (let {
        response: {
          log: J
        },
        session: W
      }
      of KQ9(Y)) {
      let X = J.find((V) => V.type === "result");
      Q((V) => ({
        ...V,
        backgroundTasks: {
          ...V.backgroundTasks,
          [W.id]: {
            ...W,
            status: X ? X.subtype === "success" ? "completed" : "failed" : J.length > 0 ? "running" : "starting",
            log: J
          }
        }
      }))
    }
  }, [Q]);
  jg.useEffect(() => {
    if (B.every((J) => G.includes(J.id))) return;
    Z(B.map((J) => J.id));
    let Y = B.filter((J) => !G.includes(J.id));
    if (!Y.length) return;
    I(Y).catch((J) => AA(J))
  }, [I, G, B])
}
// @from(Start 13187076, End 13188022)
async function* KQ9(A) {
  if (!o2("tengu_web_tasks")) return;
  let Q = await Promise.all(A.map(async (G) => {
    let Z = await xRA(G.id),
      I = Z.log.find((W) => W.type === "result"),
      Y = {
        session: {
          ...G,
          status: I ? I.subtype === "success" ? "completed" : "failed" : "running",
          log: Z.log,
          todoList: iO3(Z.log)
        },
        response: Z
      },
      J = Z.log.slice(G.log.length);
    if (J.length > 0) {
      let W = await TP2(Pg(G.log), new AbortController().signal, async () => ZE(), !1, !1),
        X = await nO3(J, W);
      if (X) return {
        ...Y,
        session: {
          ...Y.session,
          deltaSummarySinceLastFlushToAttachment: X
        }
      }
    }
    return Y
  }));
  yield* Q;
  let B = Q.filter((G) => !G.session.log.some((Z) => Z.type === "result")).map((G) => G.session);
  await new Promise((G) => setTimeout(G, 1000)), yield* KQ9(B)
}
// @from(Start 13188024, End 13188399)
function iO3(A) {
  let Q = A.findLast((Z) => Z.type === "assistant" && Z.message.content.some((I) => I.type === "tool_use" && I.name === BY.name));
  if (!Q) return [];
  let B = Q.message.content.find((Z) => Z.type === "tool_use" && Z.name === BY.name)?.input;
  if (!B) return [];
  let G = BY.inputSchema.safeParse(B);
  if (!G.success) return [];
  return G.data.todos
}
// @from(Start 13188400, End 13189344)
async function nO3(A, Q) {
  if (!o2("tengu_web_tasks")) return null;
  let B = await uX({
      systemPrompt: ["You are given a few messages from a conversation, as well as a summary of the conversation so far. Your task is to summarize the new messages in the conversation based on the summary so far. Aim for 1-2 sentences at most, focusing on the most important details. The summary MUST be in <summary>summary goes here</summary> tags. If there is no new information, return an empty string: <summary></summary>."],
      userPrompt: `Summary so far: ${Q}

New messages: ${JSON.stringify(A)}`,
      signal: new AbortController().signal,
      options: {
        querySource: "background_task_summarize_delta",
        agents: [],
        isNonInteractiveSession: !1,
        hasAppendSystemPrompt: !1,
        mcpTools: [],
        agentIdOrSessionId: e1()
      }
    }),
    G = ji(B);
  if (!G) return null;
  return B9(G, "summary")
}
// @from(Start 13189349, End 13189351)
lG
// @from(Start 13189353, End 13189355)
jg
// @from(Start 13189361, End 13189532)
DQ9 = L(() => {
  hA();
  jQ();
  z9();
  $0A();
  g1();
  kt();
  mJ0();
  i8();
  D60();
  QjA();
  fZ();
  cQ();
  u2();
  _0();
  lG = BA(VA(), 1), jg = BA(VA(), 1)
})
// @from(Start 13189535, End 13189971)
function aO3({
  value: A,
  onChange: Q,
  historyFailedMatch: B
}) {
  return wQA.createElement(S, {
    gap: 1
  }, wQA.createElement($, {
    dimColor: !0
  }, B ? "no matching prompt:" : "search prompts:"), wQA.createElement(s4, {
    value: A,
    onChange: Q,
    cursorOffset: A.length,
    onChangeCursorOffset: () => {},
    columns: A.length + 1,
    focus: !0,
    showCursor: !0,
    multiline: !1,
    dimColor: !0
  }))
}
// @from(Start 13189976, End 13189979)
wQA
// @from(Start 13189981, End 13189984)
HQ9
// @from(Start 13189990, End 13190057)
CQ9 = L(() => {
  hA();
  ZY();
  wQA = BA(VA(), 1);
  HQ9 = aO3
})
// @from(Start 13190060, End 13190949)
function zQ9({
  exitMessage: A,
  vimMode: Q,
  mode: B,
  toolPermissionContext: G,
  suppressHint: Z,
  tasksSelected: I,
  isPasting: Y,
  isSearching: J,
  historyQuery: W,
  setHistoryQuery: X,
  historyFailedMatch: V
}) {
  if (A.show) return h3.createElement($, {
    dimColor: !0,
    key: "exit-message"
  }, "Press ", A.key, " again to exit");
  if (Y) return h3.createElement($, {
    dimColor: !0,
    key: "pasting-message"
  }, "Pasting text…");
  let F = dXA() && Q === "INSERT" && !J;
  return h3.createElement(S, {
    justifyContent: "flex-start",
    gap: 1
  }, J && h3.createElement(HQ9, {
    value: W,
    onChange: X,
    historyFailedMatch: V
  }), F ? h3.createElement($, {
    dimColor: !0,
    key: "vim-insert"
  }, "-- INSERT --") : null, h3.createElement(sO3, {
    mode: B,
    toolPermissionContext: G,
    showHint: !Z && !F,
    tasksSelected: I
  }))
}
// @from(Start 13190951, End 13192252)
function sO3({
  mode: A,
  toolPermissionContext: Q,
  showHint: B,
  tasksSelected: G
}) {
  let [{
    backgroundTasks: Z
  }] = OQ(), I = EQ9.useMemo(() => Object.values(Z).filter((F) => F.type === "remote_session" || F.status === "running").length, [Z]), Y = L_2(), J = null;
  if (A === "memory") return h3.createElement($, {
    color: "remember"
  }, "# to memorize");
  if (A === "bash") return h3.createElement($, {
    color: "bashBorder"
  }, "! for bash mode");
  if (A === "background" && o2("tengu_web_tasks")) return h3.createElement($, {
    color: "background"
  }, "& to background");
  let W = Q?.mode,
    X = !Bc0(W),
    V = [...W && X ? [h3.createElement($, {
      color: ZS(W),
      key: "mode"
    }, Gc0(W), " ", Fv(W).toLowerCase(), " on", h3.createElement($, {
      dimColor: !0
    }, " ", h3.createElement(E4, {
      shortcut: HU.displayText,
      action: "cycle",
      parens: !0
    })))] : [], ...I > 0 ? [h3.createElement(FQ9, {
      key: "tasks",
      tasksSelected: G,
      showHint: B
    })] : [], ...[]];
  if (V.length) return h3.createElement(S, null, dV(V, (F) => h3.createElement($, {
    dimColor: !0,
    key: `separator-${F}`
  }, " ", "·", " ")));
  if (!B) return null;
  return h3.createElement($, {
    dimColor: !0
  }, "? for shortcuts")
}
// @from(Start 13192257, End 13192259)
h3
// @from(Start 13192261, End 13192264)
EQ9
// @from(Start 13192270, End 13192410)
UQ9 = L(() => {
  hA();
  tPA();
  Up();
  Zw();
  DQ9();
  z9();
  CQ9();
  u2();
  D51();
  dF();
  h3 = BA(VA(), 1), EQ9 = BA(VA(), 1)
})
// @from(Start 13192413, End 13192468)
function Sg() {
  let [A] = OQ();
  return A.settings
}
// @from(Start 13192473, End 13192498)
BjA = L(() => {
  z9()
})
// @from(Start 13192501, End 13192554)
function dJ0(A) {
  return A?.statusLine !== void 0
}
// @from(Start 13192556, End 13193456)
function rO3(A, Q, B) {
  let G = Pt({
      permissionMode: A,
      mainLoopModel: k3(),
      exceeds200kTokens: Q
    }),
    Z = B?.outputStyle || wK;
  return {
    ...tE(),
    model: {
      id: G,
      display_name: nc(G)
    },
    workspace: {
      current_dir: W0(),
      project_dir: uQ()
    },
    version: {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.0.59",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
    }.VERSION,
    output_style: {
      name: Z
    },
    cost: {
      total_cost_usd: hK(),
      total_duration_ms: zFA(),
      total_api_duration_ms: gN(),
      total_lines_added: Y2A(),
      total_lines_removed: J2A()
    },
    exceeds_200k_tokens: Q
  }
}
// @from(Start 13193458, End 13195362)
function $Q9({
  messages: A
}) {
  let Q = _g.useRef(void 0),
    [{
      toolPermissionContext: B,
      statusLineText: G
    }, Z] = OQ(),
    I = Sg(),
    Y = _g.useRef({
      messageId: null,
      exceeds200kTokens: !1,
      permissionMode: B.mode
    }),
    J = _g.useCallback(async (V) => {
      Q.current?.abort();
      let F = new AbortController;
      Q.current = F;
      try {
        let K = Y.current.exceeds200kTokens;
        if (V !== void 0) {
          let C = V.filter((q) => q.type === "assistant"),
            E = C[C.length - 1],
            U = E?.uuid || E?.message?.id || null;
          if (U !== Y.current.messageId) K = z91(V), Y.current.messageId = U, Y.current.exceeds200kTokens = K
        }
        let D = rO3(Y.current.permissionMode, K, I),
          H = await cJ0(D, F.signal);
        if (!F.signal.aborted) Z((C) => ({
          ...C,
          statusLineText: H
        }))
      } catch {}
    }, [Z, I]),
    W = qp(() => J(A), 300);
  if (_g.useEffect(() => {
      let V = A.filter((D) => D.type === "assistant"),
        F = V[V.length - 1],
        K = F?.uuid || F?.message?.id || null;
      if (K !== Y.current.messageId || B.mode !== Y.current.permissionMode) Y.current.messageId = K, Y.current.permissionMode = B.mode, W()
    }, [A, B.mode, W]), _g.useEffect(() => {
      let V = I?.statusLine;
      if (V) {
        if (GA("tengu_status_line_mount", {
            command_length: V.command.length,
            padding: V.padding
          }), I.disableAllHooks === !0) g("Status line is configured but disableAllHooks is true", {
          level: "warn"
        })
      }
    }, []), _g.useEffect(() => {
      return J(), () => {
        Q.current?.abort()
      }
    }, []), !G) return null;
  let X = I?.statusLine?.padding ?? 0;
  return GjA.createElement(S, {
    paddingX: X
  }, GjA.createElement($, {
    dimColor: !0
  }, G))
}
// @from(Start 13195367, End 13195370)
GjA
// @from(Start 13195372, End 13195374)
_g
// @from(Start 13195380, End 13195549)
wQ9 = L(() => {
  hA();
  YO();
  _0();
  U2();
  BjA();
  t2();
  JE();
  YO();
  q0();
  V0();
  z9();
  Gx();
  M_();
  GO();
  GjA = BA(VA(), 1), _g = BA(VA(), 1)
})
// @from(Start 13195552, End 13196136)
function lJ0({
  suggestions: A,
  selectedSuggestion: Q
}) {
  let {
    rows: B
  } = WB(), G = Math.min(10, Math.max(1, B - 3)), Z = (X) => {
    return Math.max(...X.map((V) => V.displayText.length)) + 5
  };
  if (A.length === 0) return null;
  let I = Z(A),
    Y = Math.max(0, Math.min(Q - Math.floor(G / 2), A.length - G)),
    J = Math.min(Y + G, A.length),
    W = A.slice(Y, J);
  return eE.createElement(S, {
    flexDirection: "column"
  }, W.map((X) => eE.createElement(oO3, {
    key: X.id,
    item: X,
    maxColumnWidth: I,
    isSelected: X.id === A[Q]?.id
  })))
}
// @from(Start 13196141, End 13196143)
eE
// @from(Start 13196145, End 13196148)
pJ0
// @from(Start 13196150, End 13196153)
oO3
// @from(Start 13196155, End 13196158)
UNZ
// @from(Start 13196164, End 13197006)
qQ9 = L(() => {
  hA();
  i8();
  eE = BA(VA(), 1), pJ0 = BA(VA(), 1), oO3 = pJ0.memo(function({
    item: Q,
    maxColumnWidth: B,
    isSelected: G
  }) {
    let Z = WB().columns,
      I = B ?? Q.displayText.length + 5,
      Y = Z < 80 || Q.description && I * 2 > Z,
      J = Q.color || (G ? "suggestion" : void 0),
      W = !G;
    return eE.createElement(S, {
      key: Q.id,
      flexDirection: Y ? "column" : "row"
    }, eE.createElement(S, {
      width: Y ? void 0 : I
    }, eE.createElement($, {
      color: J,
      dimColor: W
    }, Q.displayText)), Q.description && eE.createElement(S, {
      width: Z - (Y ? 4 : I + 4),
      paddingLeft: Y ? 4 : 0
    }, eE.createElement($, {
      color: G ? "suggestion" : void 0,
      dimColor: !G,
      wrap: "wrap-trim"
    }, Q.description)))
  });
  UNZ = pJ0.memo(lJ0)
})
// @from(Start 13197009, End 13198826)
function bZ1(A) {
  let {
    dimColor: Q,
    fixedWidth: B,
    gap: G,
    paddingX: Z
  } = A;
  return N2.createElement(S, {
    paddingX: Z,
    flexDirection: "row",
    gap: G
  }, N2.createElement(S, {
    flexDirection: "column",
    width: B ? 22 : void 0
  }, N2.createElement(S, null, N2.createElement($, {
    dimColor: Q
  }, "! for bash mode")), N2.createElement(S, null, N2.createElement($, {
    dimColor: Q
  }, "/ for commands")), N2.createElement(S, null, N2.createElement($, {
    dimColor: Q
  }, "@ for file paths")), N2.createElement(S, null, N2.createElement($, {
    dimColor: Q
  }, "# to memorize")), o2("tengu_web_tasks") && N2.createElement(S, null, N2.createElement($, {
    dimColor: Q
  }, "& for background"))), N2.createElement(S, {
    flexDirection: "column",
    width: B ? 35 : void 0
  }, N2.createElement(S, null, N2.createElement($, {
    dimColor: Q
  }, "double tap esc to clear input")), N2.createElement(S, null, N2.createElement($, {
    dimColor: Q
  }, HU.displayText.replace("+", " + "), " to auto-accept edits")), N2.createElement(S, null, N2.createElement($, {
    dimColor: Q
  }, "ctrl + o for verbose output")), N2.createElement(S, null, N2.createElement($, {
    dimColor: Q
  }, "ctrl + t to show todos")), N2.createElement(S, null, N2.createElement($, {
    dimColor: Q
  }, "tab to toggle thinking")), N2.createElement(S, null, N2.createElement($, {
    dimColor: Q
  }, ZQ9()))), N2.createElement(S, {
    flexDirection: "column"
  }, N2.createElement(S, null, N2.createElement($, {
    dimColor: Q
  }, "ctrl + _ to undo")), ZS0 && N2.createElement(S, null, N2.createElement($, {
    dimColor: Q
  }, "ctrl + z to suspend")), N2.createElement(S, null, N2.createElement($, {
    dimColor: Q
  }, tt.displayText.replace("+", " + "), " to paste images"))))
}
// @from(Start 13198831, End 13198833)
N2
// @from(Start 13198839, End 13198917)
iJ0 = L(() => {
  hA();
  Up();
  Q3();
  tPA();
  u2();
  N2 = BA(VA(), 1)
})
// @from(Start 13198920, End 13200576)
function tO3({
  apiKeyStatus: A,
  debug: Q,
  exitMessage: B,
  vimMode: G,
  mode: Z,
  autoUpdaterResult: I,
  isAutoUpdating: Y,
  verbose: J,
  onAutoUpdaterResult: W,
  onChangeIsUpdating: X,
  suggestions: V,
  selectedSuggestion: F,
  toolPermissionContext: K,
  helpOpen: D,
  suppressHint: H,
  tasksSelected: C,
  ideSelection: E,
  mcpClients: U,
  isPasting: q = !1,
  isInputWrapped: w = !1,
  messages: N,
  isSearching: R,
  historyQuery: T,
  setHistoryQuery: y,
  historyFailedMatch: v,
  shouldShowSearchHint: x
}) {
  let p = Sg(),
    u = H || dJ0(p) || R;
  if (V.length) return oD.createElement(S, {
    paddingX: 2,
    paddingY: 0
  }, oD.createElement(lJ0, {
    suggestions: V,
    selectedSuggestion: F
  }));
  if (D) return oD.createElement(bZ1, {
    dimColor: !0,
    fixedWidth: !0,
    paddingX: 2
  });
  return oD.createElement(S, {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingX: 2
  }, oD.createElement(S, {
    flexDirection: "column"
  }, Z === "prompt" && !B.show && !q && dJ0(p) && oD.createElement($Q9, {
    messages: N
  }), oD.createElement(zQ9, {
    exitMessage: B,
    vimMode: G,
    mode: Z,
    toolPermissionContext: K,
    suppressHint: u,
    tasksSelected: C,
    isPasting: q,
    isSearching: R,
    historyQuery: T,
    setHistoryQuery: y,
    historyFailedMatch: v
  })), oD.createElement(Z09, {
    apiKeyStatus: A,
    autoUpdaterResult: I,
    debug: Q,
    isAutoUpdating: Y,
    verbose: J,
    messages: N,
    onAutoUpdaterResult: W,
    onChangeIsUpdating: X,
    ideSelection: E,
    mcpClients: U,
    isInputWrapped: w,
    shouldShowSearchHint: x
  }))
}
// @from(Start 13200581, End 13200583)
oD
// @from(Start 13200585, End 13200588)
NQ9
// @from(Start 13200590, End 13200593)
LQ9
// @from(Start 13200599, End 13200740)
MQ9 = L(() => {
  hA();
  UQ9();
  HJ0();
  wQ9();
  BjA();
  qQ9();
  iJ0();
  oD = BA(VA(), 1), NQ9 = BA(VA(), 1);
  LQ9 = NQ9.memo(tO3)
})
// @from(Start 13200781, End 13203074)
function hZ1({
  onSelect: A,
  onCancel: Q,
  title: B,
  renderDetails: G
}) {
  let Z = gV(),
    I = OQ9(MQ(), "CLAUDE.md"),
    Y = OQ9(uQ(), "CLAUDE.md"),
    J = Z.some((U) => U.path === I),
    W = Z.some((U) => U.path === Y),
    X = [...Z.map((U) => ({
      ...U,
      exists: !0
    })), ...J ? [] : [{
      path: I,
      type: "User",
      content: "",
      exists: !1
    }], ...W ? [] : [{
      path: Y,
      type: "Project",
      content: "",
      exists: !1
    }]],
    V = new Map,
    F = X.map((U) => {
      let q = Q5(U.path),
        w = U.exists ? "" : " (new)",
        N = U.parent ? (V.get(U.parent) ?? 0) + 1 : 0;
      V.set(U.path, N);
      let R = N > 0 ? "  ".repeat(N - 1) : "",
        T;
      if (U.type === "User" && !U.isNested && U.path === I) T = "User memory";
      else if (U.type === "Project" && !U.isNested && U.path === Y) T = "Project memory";
      else if (N > 0) T = `${R}L ${q}${w}`;
      else T = `${q}`;
      let y, v = bP2(uQ());
      if (U.type === "User" && !U.isNested) y = "Saved in ~/.claude/CLAUDE.md";
      else if (U.type === "Project" && !U.isNested && U.path === Y) y = `${v?"Checked in at":"Saved in"} ./CLAUDE.md`;
      else if (U.type, U.parent) y = "@-imported";
      else if (U.isNested) y = "dynamically loaded";
      else y = "";
      return {
        label: T,
        value: U.path,
        description: y
      }
    }),
    K = fZ1 && F.some((U) => U.value === fZ1) ? fZ1 : F[0]?.value || "",
    [D, H] = RQ9.useState(K),
    E = X.find((U) => U.path === D)?.type;
  return EQ(), f1((U, q) => {
    if (q.escape) Q()
  }), oq.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    borderColor: "remember",
    padding: 1,
    width: "100%"
  }, oq.createElement(S, {
    marginBottom: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  }, oq.createElement($, {
    color: "remember",
    bold: !0
  }, B || "Select memory file to edit:")), oq.createElement(S, {
    flexDirection: "column",
    paddingX: 1
  }, oq.createElement(M0, {
    focusValue: K,
    options: F,
    onFocus: (U) => H(U),
    onChange: (U) => {
      fZ1 = U, A(U)
    },
    onCancel: Q
  })), G && oq.createElement(S, {
    marginTop: 1,
    flexDirection: "column"
  }, G(D, E)))
}
// @from(Start 13203079, End 13203081)
oq
// @from(Start 13203083, End 13203086)
RQ9
// @from(Start 13203088, End 13203091)
fZ1
// @from(Start 13203097, End 13203218)
nJ0 = L(() => {
  hA();
  J5();
  Q4();
  gE();
  R9();
  M60();
  _0();
  hQ();
  oq = BA(VA(), 1), RQ9 = BA(VA(), 1)
})
// @from(Start 13203221, End 13203774)
function TQ9(A, Q) {
  let B = gZ1.useRef(void 0);
  gZ1.useEffect(() => {
    let G = uU(A);
    if (B.current !== G) B.current = G;
    if (G) G.client.setNotificationHandler(AR3, (Z) => {
      if (B.current !== G) return;
      try {
        let I = Z.params,
          Y = I.lineStart !== void 0 ? I.lineStart + 1 : void 0,
          J = I.lineEnd !== void 0 ? I.lineEnd + 1 : void 0;
        Q({
          filePath: I.filePath,
          lineStart: Y,
          lineEnd: J
        })
      } catch (I) {
        AA(I)
      }
    })
  }, [A, Q])
}
// @from(Start 13203779, End 13203782)
gZ1
// @from(Start 13203784, End 13203804)
eO3 = "at_mentioned"
// @from(Start 13203808, End 13203811)
AR3
// @from(Start 13203817, End 13204065)
PQ9 = L(() => {
  Q2();
  nY();
  g1();
  gZ1 = BA(VA(), 1), AR3 = j.object({
    method: j.literal(eO3),
    params: j.object({
      filePath: j.string(),
      lineStart: j.number().optional(),
      lineEnd: j.number().optional()
    })
  })
})
// @from(Start 13204068, End 13205326)
function jQ9({
  maxBufferSize: A,
  debounceMs: Q
}) {
  let [B, G] = Zx.useState([]), [Z, I] = Zx.useState(-1), Y = Zx.useRef(0), J = Zx.useRef(null), W = Zx.useCallback((K, D, H = {}) => {
    let C = Date.now();
    if (J.current) clearTimeout(J.current), J.current = null;
    if (C - Y.current < Q) {
      J.current = setTimeout(() => {
        W(K, D, H)
      }, Q);
      return
    }
    Y.current = C, G((E) => {
      let U = Z >= 0 ? E.slice(0, Z + 1) : E,
        q = U[U.length - 1];
      if (q && q.text === K) return U;
      let w = [...U, {
        text: K,
        cursorOffset: D,
        pastedContents: H,
        timestamp: C
      }];
      if (w.length > A) return w.slice(-A);
      return w
    }), I((E) => {
      let U = E >= 0 ? E + 1 : B.length;
      return Math.min(U, A - 1)
    })
  }, [Q, A, Z, B.length]), X = Zx.useCallback(() => {
    if (Z < 0 || B.length === 0) return;
    let K = Math.max(0, Z - 1),
      D = B[K];
    if (D) return I(K), D;
    return
  }, [B, Z]), V = Zx.useCallback(() => {
    if (G([]), I(-1), Y.current = 0, J.current) clearTimeout(J.current), J.current = null
  }, [Y, J]), F = Z > 0 && B.length > 1;
  return {
    pushToBuffer: W,
    undo: X,
    canUndo: F,
    clearBuffer: V
  }
}
// @from(Start 13205331, End 13205333)
Zx
// @from(Start 13205339, End 13205376)
SQ9 = L(() => {
  Zx = BA(VA(), 1)
})
// @from(Start 13205379, End 13210091)
function _Q9({
  shell: A,
  onDone: Q,
  onKillShell: B,
  onBack: G
}) {
  let {
    columns: Z
  } = WB(), [I, Y] = ZjA.useState(0), [J, W] = ZjA.useState({
    stdout: "",
    stderr: "",
    stdoutLines: 0,
    stderrLines: 0
  });
  f1((K, D) => {
    if (D.escape || D.return || K === " ") Q("Shell details dismissed", {
      display: "system"
    });
    else if (D.leftArrow && G) G();
    else if (K === "k" && A.status === "running" && B) B()
  });
  let X = EQ(),
    V = (K) => {
      let D = Math.floor((Date.now() - K) / 1000),
        H = Math.floor(D / 3600),
        C = Math.floor((D - H * 3600) / 60),
        E = D - H * 3600 - C * 60;
      return `${H>0?`${H}h `:""}${C>0||H>0?`${C}m `:""}${E}s`
    };
  ZjA.useEffect(() => {
    let K = J01(A),
      D = (N, R, T = 10) => {
        if (!R) return N;
        let y = N.split(`
`),
          v = R.split(`
`);
        return [...y, ...v].slice(-T).join(`
`)
      },
      H = D(J.stdout, K.stdout),
      C = D(J.stderr, K.stderr),
      {
        totalLines: E,
        truncatedContent: U
      } = m_(H),
      {
        totalLines: q,
        truncatedContent: w
      } = m_(C);
    if (W({
        stdout: U,
        stderr: w,
        stdoutLines: E,
        stderrLines: q
      }), A.status === "running") {
      let N = setTimeout(() => {
        Y((R) => R + 1)
      }, 1000);
      return () => clearTimeout(N)
    }
  }, [A.id, A.status, I, J.stdout, J.stderr, A]);
  let F = A.command.length > 280 ? A.command.substring(0, 277) + "…" : A.command;
  return z3.default.createElement(S, {
    width: "100%",
    flexDirection: "column"
  }, z3.default.createElement(S, {
    width: "100%"
  }, z3.default.createElement(S, {
    borderStyle: "round",
    borderColor: "background",
    flexDirection: "column",
    marginTop: 1,
    paddingLeft: 1,
    paddingRight: 1,
    width: "100%"
  }, z3.default.createElement(S, null, z3.default.createElement($, {
    color: "background",
    bold: !0
  }, "Shell details")), z3.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, z3.default.createElement($, null, z3.default.createElement($, {
    bold: !0
  }, "Status:"), " ", A.status === "running" ? z3.default.createElement($, {
    color: "background"
  }, A.status, A.result?.code !== void 0 && ` (exit code: ${A.result.code})`) : A.status === "completed" ? z3.default.createElement($, {
    color: "success"
  }, A.status, A.result?.code !== void 0 && ` (exit code: ${A.result.code})`) : z3.default.createElement($, {
    color: "error"
  }, A.status, A.result?.code !== void 0 && ` (exit code: ${A.result.code})`)), z3.default.createElement($, null, z3.default.createElement($, {
    bold: !0
  }, "Runtime:"), " ", V(A.startTime)), z3.default.createElement($, {
    wrap: "wrap"
  }, z3.default.createElement($, {
    bold: !0
  }, "Command:"), " ", F)), z3.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, z3.default.createElement($, {
    bold: !0
  }, "Stdout:"), J.stdout ? z3.default.createElement(z3.default.Fragment, null, z3.default.createElement(S, {
    borderStyle: "round",
    borderDimColor: !0,
    paddingX: 1,
    flexDirection: "column",
    height: 12,
    maxWidth: Z - 8
  }, J.stdout.split(`
`).slice(-10).map((K, D) => z3.default.createElement($, {
    key: D,
    wrap: "truncate-end"
  }, K))), z3.default.createElement($, {
    dimColor: !0,
    italic: !0
  }, J.stdoutLines > 10 ? `Showing last 10 lines of ${J.stdoutLines} total lines` : `Showing ${J.stdoutLines} lines`)) : z3.default.createElement($, {
    dimColor: !0
  }, "No stdout output available")), J.stderr && z3.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, z3.default.createElement($, {
    bold: !0,
    color: "error"
  }, "Stderr:"), z3.default.createElement(S, {
    borderStyle: "round",
    borderColor: "error",
    paddingX: 1,
    flexDirection: "column",
    height: 3,
    maxWidth: Z - 8
  }, J.stderr.split(`
`).slice(-1).map((K, D) => z3.default.createElement($, {
    key: D,
    color: "error",
    wrap: "truncate-end"
  }, K))), z3.default.createElement($, {
    dimColor: !0,
    italic: !0,
    color: "error"
  }, J.stderrLines > 1 ? `Showing last line of ${J.stderrLines} total lines` : `Showing ${J.stderrLines} line`)))), z3.default.createElement(S, {
    marginLeft: 2
  }, X.pending ? z3.default.createElement($, {
    dimColor: !0
  }, "Press ", X.keyName, " again to exit") : z3.default.createElement($, {
    dimColor: !0
  }, G ? z3.default.createElement($, null, "← to go back · ") : null, "Esc/Enter/Space to close", A.status === "running" && B ? z3.default.createElement($, null, " · k to kill") : null)))
}
// @from(Start 13210096, End 13210098)
z3
// @from(Start 13210100, End 13210103)
ZjA
// @from(Start 13210109, End 13210206)
kQ9 = L(() => {
  hA();
  i8();
  Q4();
  _AA();
  Np();
  z3 = BA(VA(), 1), ZjA = BA(VA(), 1)
})
// @from(Start 13210209, End 13210308)
function yQ9() {
  return IjA.createElement(S0, {
    height: 1
  }, IjA.createElement(zk, null))
}
// @from(Start 13210313, End 13210316)
IjA
// @from(Start 13210322, End 13210377)
xQ9 = L(() => {
  tZA();
  q8();
  IjA = BA(VA(), 1)
})
// @from(Start 13210380, End 13210544)
function vQ9({
  feedback: A
}) {
  return YjA.createElement(S0, null, YjA.createElement($, {
    color: "error"
  }, "Tool use rejected with user message: ", A))
}
// @from(Start 13210549, End 13210552)
YjA
// @from(Start 13210558, End 13210612)
bQ9 = L(() => {
  hA();
  q8();
  YjA = BA(VA(), 1)
})
// @from(Start 13210615, End 13211453)
function fQ9({
  progressMessagesForMessage: A,
  tool: Q,
  tools: B,
  param: G,
  verbose: Z
}) {
  let [I] = qB();
  if (typeof G.content === "string" && G.content.includes(xO)) return sP.createElement(S0, {
    height: 1
  }, sP.createElement(zk, null));
  if (typeof G.content === "string" && G.content.startsWith(aJ0)) {
    let Y = G.content.substring(aJ0.length);
    return sP.createElement(o31, {
      plan: Y,
      themeName: I
    })
  }
  if (typeof G.content === "string" && G.content.startsWith(JjA)) {
    let Y = G.content.substring(JjA.length);
    return sP.createElement(vQ9, {
      feedback: Y
    })
  }
  if (!Q) return sP.createElement(Q6, {
    result: G.content,
    verbose: Z
  });
  return Q.renderToolUseErrorMessage(G.content, {
    progressMessagesForMessage: $p(A),
    tools: B,
    verbose: Z
  })
}
// @from(Start 13211458, End 13211460)
sP
// @from(Start 13211466, End 13211562)
hQ9 = L(() => {
  cQ();
  tZA();
  q8();
  yJ();
  hA();
  eG0();
  bQ9();
  sP = BA(VA(), 1)
})
// @from(Start 13211565, End 13212063)
function gQ9({
  input: A,
  progressMessagesForMessage: Q,
  style: B,
  tool: G,
  tools: Z,
  messages: I,
  verbose: Y
}) {
  let {
    columns: J
  } = WB(), [W] = qB();
  if (!G) return WjA.createElement(k5, null);
  let X = G.inputSchema.safeParse(A);
  if (!X.success) return WjA.createElement(k5, null);
  return G.renderToolUseRejectedMessage(X.data, {
    columns: J,
    messages: I,
    tools: Z,
    verbose: Y,
    progressMessagesForMessage: $p(Q),
    style: B,
    theme: W
  })
}
// @from(Start 13212068, End 13212071)
WjA
// @from(Start 13212077, End 13212139)
uQ9 = L(() => {
  iX();
  i8();
  hA();
  WjA = BA(VA(), 1)
})
// @from(Start 13212145, End 13212166)
mQ9 = "\x1B[0m\x1B(B"
// @from(Start 13212169, End 13212824)
function uZ1({
  hookEvent: A,
  messages: Q,
  toolUseID: B,
  verbose: G
}) {
  let Z = dQ9(Q, B, A),
    I = cQ9(Q, B, A);
  if (I === Z) return null;
  return lW.createElement(S0, null, lW.createElement(S, {
    flexDirection: "column"
  }, lW.createElement(S, {
    flexDirection: "row"
  }, lW.createElement($, {
    dimColor: !0
  }, "Running "), lW.createElement($, {
    dimColor: !0,
    bold: !0
  }, A), Z === 1 ? lW.createElement($, {
    dimColor: !0
  }, " hook…") : lW.createElement($, {
    dimColor: !0
  }, " ", "hooks… (", I, "/", Z, " done)")), G && lW.createElement(QR3, {
    messages: Q,
    toolUseID: B,
    hookEvent: A
  })))
}
// @from(Start 13212826, End 13213235)
function QR3({
  messages: A,
  toolUseID: Q,
  hookEvent: B
}) {
  let G = A.filter((Z) => Z.type === "progress" && Z.data.type === "hook_progress" && Z.data.hookEvent === B && Z.parentToolUseID === Q);
  return lW.createElement(S, {
    flexDirection: "column",
    marginLeft: 2
  }, G.map((Z) => lW.createElement($, {
    dimColor: !0,
    key: Z.uuid
  }, "· ", Z.data.hookName, ": ", Z.data.command)))
}
// @from(Start 13213240, End 13213242)
lW
// @from(Start 13213248, End 13213309)
sJ0 = L(() => {
  q8();
  hA();
  cQ();
  lW = BA(VA(), 1)
})
// @from(Start 13213312, End 13213993)
function pQ9({
  message: A,
  messages: Q,
  toolUseID: B,
  progressMessagesForMessage: G,
  style: Z,
  tool: I,
  tools: Y,
  verbose: J,
  width: W
}) {
  let [X] = qB();
  if (!A.toolUseResult || !I) return null;
  let V = I.renderToolResultMessage(A.toolUseResult, $p(G), {
    style: Z,
    theme: X,
    tools: Y,
    verbose: J
  });
  if (V === null) return null;
  return rP.createElement(S, {
    flexDirection: "column"
  }, rP.createElement(S, {
    flexDirection: "row",
    width: W
  }, V, rP.createElement($, null, mQ9)), rP.createElement(CQA, null, rP.createElement(uZ1, {
    hookEvent: "PostToolUse",
    messages: Q,
    toolUseID: B,
    verbose: J
  })))
}
// @from(Start 13213998, End 13214000)
rP
// @from(Start 13214006, End 13214069)
lQ9 = L(() => {
  hA();
  sJ0();
  $Z1();
  rP = BA(VA(), 1)
})
// @from(Start 13214072, End 13214315)
function BR3(A, Q) {
  let B = null;
  for (let G of Q) {
    if (G.type !== "assistant" || !Array.isArray(G.message.content)) continue;
    for (let Z of G.message.content)
      if (Z.type === "tool_use" && Z.id === A) B = Z
  }
  return B
}
// @from(Start 13214317, End 13214557)
function nQ9(A, Q, B) {
  return iQ9.useMemo(() => {
    let G = BR3(A, B);
    if (!G) return null;
    let Z = Q.find((I) => I.name === G.name);
    if (!Z) return null;
    return {
      tool: Z,
      toolUse: G
    }
  }, [A, B, Q])
}
// @from(Start 13214562, End 13214565)
iQ9
// @from(Start 13214571, End 13214609)
aQ9 = L(() => {
  iQ9 = BA(VA(), 1)
})
// @from(Start 13214612, End 13215460)
function sQ9({
  param: A,
  message: Q,
  messages: B,
  progressMessagesForMessage: G,
  style: Z,
  tools: I,
  verbose: Y,
  width: J
}) {
  let W = nQ9(A.tool_use_id, I, B);
  if (!W) return null;
  if (A.content === pXA) return kg.createElement(yQ9, null);
  if (A.content === XjA || A.content === xO) return kg.createElement(gQ9, {
    input: W.toolUse.input,
    progressMessagesForMessage: G,
    tool: W.tool,
    tools: I,
    messages: B,
    style: Z,
    verbose: Y
  });
  if (A.is_error) return kg.createElement(fQ9, {
    progressMessagesForMessage: G,
    tool: W.tool,
    tools: I,
    param: A,
    verbose: Y
  });
  return kg.createElement(pQ9, {
    message: Q,
    messages: B,
    toolUseID: W.toolUse.id,
    progressMessagesForMessage: G,
    style: Z,
    tool: W.tool,
    tools: I,
    verbose: Y,
    width: J
  })
}
// @from(Start 13215465, End 13215467)
kg
// @from(Start 13215473, End 13215563)
rQ9 = L(() => {
  cQ();
  xQ9();
  hQ9();
  uQ9();
  lQ9();
  aQ9();
  kg = BA(VA(), 1)
})
// @from(Start 13215566, End 13216009)
function GR3() {
  let A = new Bp;
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
// @from(Start 13216011, End 13216307)
function tQ9(A) {
  let Q = oQ9(),
    [B, G] = mZ1.useState(Q.getCurrentState());
  return mZ1.useEffect(() => {
    if (!A) return;
    let Z = oQ9(),
      I = () => G(Z.getCurrentState()),
      Y = Z.subscribe(I);
    return G(Y), () => {
      Z.unsubscribe(I)
    }
  }, [A]), A ? B : !0
}
// @from(Start 13216312, End 13216315)
mZ1
// @from(Start 13216317, End 13216320)
oQ9
// @from(Start 13216326, End 13216397)
eQ9 = L(() => {
  hA();
  l2();
  mZ1 = BA(VA(), 1);
  oQ9 = s1(GR3)
})
// @from(Start 13216400, End 13216685)
function dZ1({
  isError: A,
  isUnresolved: Q,
  shouldAnimate: B
}) {
  let G = tQ9(B);
  return rJ0.default.createElement(S, {
    minWidth: 2
  }, rJ0.default.createElement($, {
    color: Q ? void 0 : A ? "error" : "success",
    dimColor: Q
  }, !B || G || A || !Q ? rD : " "))
}
// @from(Start 13216690, End 13216693)
rJ0
// @from(Start 13216699, End 13216762)
oJ0 = L(() => {
  hA();
  dn();
  eQ9();
  rJ0 = BA(VA(), 1)
})
// @from(Start 13216768, End 13216790)
Wa = "AgentOutputTool"
// @from(Start 13216793, End 13219640)
function AB9({
  param: A,
  addMargin: Q,
  tools: B,
  verbose: G,
  erroredToolUseIDs: Z,
  inProgressToolUseIDs: I,
  resolvedToolUseIDs: Y,
  progressMessagesForMessage: J,
  shouldAnimate: W,
  shouldShowDot: X,
  inProgressToolCallCount: V,
  messages: F
}) {
  let K = WB(),
    [D] = qB();
  if (!B) return AA(Error(`Tools array is undefined for tool ${A.name}`)), null;
  let H = B.find((R) => R.name === A.name);
  if (!H) return AA(Error(`Tool ${A.name} not found`)), null;
  let C = Y.has(A.id),
    E = !I.has(A.id) && !C,
    U = H.inputSchema.safeParse(A.input),
    q = H.userFacingName(U.success ? U.data : void 0),
    w = H.userFacingNameBackgroundColor?.(U.success ? U.data : void 0);
  if (q === "") return null;
  let N = U.success ? ZR3(H, U.data, {
    theme: D,
    verbose: G
  }) : null;
  if (N === null) return null;
  return eY.default.createElement(S, {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Q ? 1 : 0,
    width: "100%"
  }, eY.default.createElement(S, {
    flexDirection: "column"
  }, eY.default.createElement(S, {
    flexDirection: "row",
    flexWrap: "nowrap",
    minWidth: q.length + (X ? 2 : 0)
  }, X && (E ? eY.default.createElement(S, {
    minWidth: 2
  }, eY.default.createElement($, {
    dimColor: E
  }, rD)) : eY.default.createElement(dZ1, {
    shouldAnimate: W,
    isUnresolved: !C,
    isError: Z.has(A.id)
  })), eY.default.createElement(S, {
    flexShrink: 0
  }, eY.default.createElement($, {
    bold: !0,
    wrap: "truncate-end",
    backgroundColor: w,
    color: w ? "inverseText" : void 0
  }, q)), N !== "" && eY.default.createElement(S, {
    flexWrap: "nowrap"
  }, eY.default.createElement($, null, "(", N, ")")), H.name === C9 && U.success && U.data.timeout && (() => {
    let R = U.data.timeout,
      T = ZGA();
    if (R !== T) return eY.default.createElement(S, {
      flexWrap: "nowrap",
      marginLeft: 1
    }, eY.default.createElement($, {
      dimColor: !0
    }, "timeout: ", eC(R)));
    return null
  })(), H.name === A6 && U.success && U.data.resume && eY.default.createElement(S, {
    flexWrap: "nowrap",
    marginLeft: 1
  }, eY.default.createElement($, {
    dimColor: !0
  }, "resuming ", U.data.resume)), H.name === A6 && U.success && U.data.model && (() => {
    let R = UD(U.data.model),
      T = k3();
    if (R !== T) return eY.default.createElement(S, {
      flexWrap: "nowrap",
      marginLeft: 1
    }, eY.default.createElement($, {
      dimColor: !0
    }, nc(R)));
    return null
  })(), H.name === Wa && U.success && U.data.agentId && eY.default.createElement(S, {
    flexWrap: "nowrap",
    marginLeft: 1
  }, eY.default.createElement($, {
    dimColor: !0
  }, U.data.agentId))), !C && !E && IR3(H, B, F, A.id, J, {
    verbose: G,
    inProgressToolCallCount: V
  }, K), !C && E && YR3(H)))
}
// @from(Start 13219642, End 13219958)
function ZR3(A, Q, {
  theme: B,
  verbose: G
}) {
  try {
    let Z = A.inputSchema.safeParse(Q);
    if (!Z.success) return "";
    return A.renderToolUseMessage(Z.data, {
      theme: B,
      verbose: G
    })
  } catch (Z) {
    return AA(Error(`Error rendering tool use message for ${A.name}: ${Z}`)), ""
  }
}
// @from(Start 13219960, End 13220603)
function IR3(A, Q, B, G, Z, {
  verbose: I,
  inProgressToolCallCount: Y
}, J) {
  let W = Z.filter((X) => X.data.type !== "hook_progress");
  try {
    let X = A.renderToolUseProgressMessage(W, {
      tools: Q,
      verbose: I,
      terminalSize: J,
      inProgressToolCallCount: Y ?? 1
    });
    return eY.default.createElement(eY.default.Fragment, null, eY.default.createElement(CQA, null, eY.default.createElement(uZ1, {
      hookEvent: "PreToolUse",
      messages: B,
      toolUseID: G,
      verbose: I
    })), X)
  } catch (X) {
    return AA(Error(`Error rendering tool use progress message for ${A.name}: ${X}`)), null
  }
}
// @from(Start 13220605, End 13220786)
function YR3(A) {
  try {
    return A.renderToolUseQueuedMessage?.()
  } catch (Q) {
    return AA(Error(`Error rendering tool use queued message for ${A.name}: ${Q}`)), null
  }
}
// @from(Start 13220791, End 13220793)
eY
// @from(Start 13220799, End 13220912)
QB9 = L(() => {
  hA();
  g1();
  oJ0();
  dn();
  i8();
  IGA();
  t2();
  sJ0();
  $Z1();
  eY = BA(VA(), 1)
})
// @from(Start 13220918, End 13238173)
oP = z((WMZ, lZ1) => {
  var BB9, GB9, ZB9, IB9, YB9, JB9, WB9, XB9, VB9, FB9, KB9, DB9, HB9, cZ1, tJ0, CB9, EB9, zB9, lXA, UB9, $B9, wB9, qB9, NB9, LB9, MB9, OB9, RB9, pZ1, TB9, PB9, jB9;
  (function(A) {
    var Q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(G) {
      A(B(Q, B(G)))
    });
    else if (typeof lZ1 === "object" && typeof WMZ === "object") A(B(Q, B(WMZ)));
    else A(B(Q));

    function B(G, Z) {
      if (G !== Q)
        if (typeof Object.create === "function") Object.defineProperty(G, "__esModule", {
          value: !0
        });
        else G.__esModule = !0;
      return function(I, Y) {
        return G[I] = Z ? Z(I, Y) : Y
      }
    }
  })(function(A) {
    var Q = Object.setPrototypeOf || {
      __proto__: []
    }
    instanceof Array && function(I, Y) {
      I.__proto__ = Y
    } || function(I, Y) {
      for (var J in Y)
        if (Object.prototype.hasOwnProperty.call(Y, J)) I[J] = Y[J]
    };
    BB9 = function(I, Y) {
      if (typeof Y !== "function" && Y !== null) throw TypeError("Class extends value " + String(Y) + " is not a constructor or null");
      Q(I, Y);

      function J() {
        this.constructor = I
      }
      I.prototype = Y === null ? Object.create(Y) : (J.prototype = Y.prototype, new J)
    }, GB9 = Object.assign || function(I) {
      for (var Y, J = 1, W = arguments.length; J < W; J++) {
        Y = arguments[J];
        for (var X in Y)
          if (Object.prototype.hasOwnProperty.call(Y, X)) I[X] = Y[X]
      }
      return I
    }, ZB9 = function(I, Y) {
      var J = {};
      for (var W in I)
        if (Object.prototype.hasOwnProperty.call(I, W) && Y.indexOf(W) < 0) J[W] = I[W];
      if (I != null && typeof Object.getOwnPropertySymbols === "function") {
        for (var X = 0, W = Object.getOwnPropertySymbols(I); X < W.length; X++)
          if (Y.indexOf(W[X]) < 0 && Object.prototype.propertyIsEnumerable.call(I, W[X])) J[W[X]] = I[W[X]]
      }
      return J
    }, IB9 = function(I, Y, J, W) {
      var X = arguments.length,
        V = X < 3 ? Y : W === null ? W = Object.getOwnPropertyDescriptor(Y, J) : W,
        F;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") V = Reflect.decorate(I, Y, J, W);
      else
        for (var K = I.length - 1; K >= 0; K--)
          if (F = I[K]) V = (X < 3 ? F(V) : X > 3 ? F(Y, J, V) : F(Y, J)) || V;
      return X > 3 && V && Object.defineProperty(Y, J, V), V
    }, YB9 = function(I, Y) {
      return function(J, W) {
        Y(J, W, I)
      }
    }, JB9 = function(I, Y, J, W, X, V) {
      function F(T) {
        if (T !== void 0 && typeof T !== "function") throw TypeError("Function expected");
        return T
      }
      var K = W.kind,
        D = K === "getter" ? "get" : K === "setter" ? "set" : "value",
        H = !Y && I ? W.static ? I : I.prototype : null,
        C = Y || (H ? Object.getOwnPropertyDescriptor(H, W.name) : {}),
        E, U = !1;
      for (var q = J.length - 1; q >= 0; q--) {
        var w = {};
        for (var N in W) w[N] = N === "access" ? {} : W[N];
        for (var N in W.access) w.access[N] = W.access[N];
        w.addInitializer = function(T) {
          if (U) throw TypeError("Cannot add initializers after decoration has completed");
          V.push(F(T || null))
        };
        var R = (0, J[q])(K === "accessor" ? {
          get: C.get,
          set: C.set
        } : C[D], w);
        if (K === "accessor") {
          if (R === void 0) continue;
          if (R === null || typeof R !== "object") throw TypeError("Object expected");
          if (E = F(R.get)) C.get = E;
          if (E = F(R.set)) C.set = E;
          if (E = F(R.init)) X.unshift(E)
        } else if (E = F(R))
          if (K === "field") X.unshift(E);
          else C[D] = E
      }
      if (H) Object.defineProperty(H, W.name, C);
      U = !0
    }, WB9 = function(I, Y, J) {
      var W = arguments.length > 2;
      for (var X = 0; X < Y.length; X++) J = W ? Y[X].call(I, J) : Y[X].call(I);
      return W ? J : void 0
    }, XB9 = function(I) {
      return typeof I === "symbol" ? I : "".concat(I)
    }, VB9 = function(I, Y, J) {
      if (typeof Y === "symbol") Y = Y.description ? "[".concat(Y.description, "]") : "";
      return Object.defineProperty(I, "name", {
        configurable: !0,
        value: J ? "".concat(J, " ", Y) : Y
      })
    }, FB9 = function(I, Y) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(I, Y)
    }, KB9 = function(I, Y, J, W) {
      function X(V) {
        return V instanceof J ? V : new J(function(F) {
          F(V)
        })
      }
      return new(J || (J = Promise))(function(V, F) {
        function K(C) {
          try {
            H(W.next(C))
          } catch (E) {
            F(E)
          }
        }

        function D(C) {
          try {
            H(W.throw(C))
          } catch (E) {
            F(E)
          }
        }

        function H(C) {
          C.done ? V(C.value) : X(C.value).then(K, D)
        }
        H((W = W.apply(I, Y || [])).next())
      })
    }, DB9 = function(I, Y) {
      var J = {
          label: 0,
          sent: function() {
            if (V[0] & 1) throw V[1];
            return V[1]
          },
          trys: [],
          ops: []
        },
        W, X, V, F = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return F.next = K(0), F.throw = K(1), F.return = K(2), typeof Symbol === "function" && (F[Symbol.iterator] = function() {
        return this
      }), F;

      function K(H) {
        return function(C) {
          return D([H, C])
        }
      }

      function D(H) {
        if (W) throw TypeError("Generator is already executing.");
        while (F && (F = 0, H[0] && (J = 0)), J) try {
          if (W = 1, X && (V = H[0] & 2 ? X.return : H[0] ? X.throw || ((V = X.return) && V.call(X), 0) : X.next) && !(V = V.call(X, H[1])).done) return V;
          if (X = 0, V) H = [H[0] & 2, V.value];
          switch (H[0]) {
            case 0:
            case 1:
              V = H;
              break;
            case 4:
              return J.label++, {
                value: H[1],
                done: !1
              };
            case 5:
              J.label++, X = H[1], H = [0];
              continue;
            case 7:
              H = J.ops.pop(), J.trys.pop();
              continue;
            default:
              if ((V = J.trys, !(V = V.length > 0 && V[V.length - 1])) && (H[0] === 6 || H[0] === 2)) {
                J = 0;
                continue
              }
              if (H[0] === 3 && (!V || H[1] > V[0] && H[1] < V[3])) {
                J.label = H[1];
                break
              }
              if (H[0] === 6 && J.label < V[1]) {
                J.label = V[1], V = H;
                break
              }
              if (V && J.label < V[2]) {
                J.label = V[2], J.ops.push(H);
                break
              }
              if (V[2]) J.ops.pop();
              J.trys.pop();
              continue
          }
          H = Y.call(I, J)
        } catch (C) {
          H = [6, C], X = 0
        } finally {
          W = V = 0
        }
        if (H[0] & 5) throw H[1];
        return {
          value: H[0] ? H[1] : void 0,
          done: !0
        }
      }
    }, HB9 = function(I, Y) {
      for (var J in I)
        if (J !== "default" && !Object.prototype.hasOwnProperty.call(Y, J)) pZ1(Y, I, J)
    }, pZ1 = Object.create ? function(I, Y, J, W) {
      if (W === void 0) W = J;
      var X = Object.getOwnPropertyDescriptor(Y, J);
      if (!X || ("get" in X ? !Y.__esModule : X.writable || X.configurable)) X = {
        enumerable: !0,
        get: function() {
          return Y[J]
        }
      };
      Object.defineProperty(I, W, X)
    } : function(I, Y, J, W) {
      if (W === void 0) W = J;
      I[W] = Y[J]
    }, cZ1 = function(I) {
      var Y = typeof Symbol === "function" && Symbol.iterator,
        J = Y && I[Y],
        W = 0;
      if (J) return J.call(I);
      if (I && typeof I.length === "number") return {
        next: function() {
          if (I && W >= I.length) I = void 0;
          return {
            value: I && I[W++],
            done: !I
          }
        }
      };
      throw TypeError(Y ? "Object is not iterable." : "Symbol.iterator is not defined.")
    }, tJ0 = function(I, Y) {
      var J = typeof Symbol === "function" && I[Symbol.iterator];
      if (!J) return I;
      var W = J.call(I),
        X, V = [],
        F;
      try {
        while ((Y === void 0 || Y-- > 0) && !(X = W.next()).done) V.push(X.value)
      } catch (K) {
        F = {
          error: K
        }
      } finally {
        try {
          if (X && !X.done && (J = W.return)) J.call(W)
        } finally {
          if (F) throw F.error
        }
      }
      return V
    }, CB9 = function() {
      for (var I = [], Y = 0; Y < arguments.length; Y++) I = I.concat(tJ0(arguments[Y]));
      return I
    }, EB9 = function() {
      for (var I = 0, Y = 0, J = arguments.length; Y < J; Y++) I += arguments[Y].length;
      for (var W = Array(I), X = 0, Y = 0; Y < J; Y++)
        for (var V = arguments[Y], F = 0, K = V.length; F < K; F++, X++) W[X] = V[F];
      return W
    }, zB9 = function(I, Y, J) {
      if (J || arguments.length === 2) {
        for (var W = 0, X = Y.length, V; W < X; W++)
          if (V || !(W in Y)) {
            if (!V) V = Array.prototype.slice.call(Y, 0, W);
            V[W] = Y[W]
          }
      }
      return I.concat(V || Array.prototype.slice.call(Y))
    }, lXA = function(I) {
      return this instanceof lXA ? (this.v = I, this) : new lXA(I)
    }, UB9 = function(I, Y, J) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var W = J.apply(I, Y || []),
        X, V = [];
      return X = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), K("next"), K("throw"), K("return", F), X[Symbol.asyncIterator] = function() {
        return this
      }, X;

      function F(q) {
        return function(w) {
          return Promise.resolve(w).then(q, E)
        }
      }

      function K(q, w) {
        if (W[q]) {
          if (X[q] = function(N) {
              return new Promise(function(R, T) {
                V.push([q, N, R, T]) > 1 || D(q, N)
              })
            }, w) X[q] = w(X[q])
        }
      }

      function D(q, w) {
        try {
          H(W[q](w))
        } catch (N) {
          U(V[0][3], N)
        }
      }

      function H(q) {
        q.value instanceof lXA ? Promise.resolve(q.value.v).then(C, E) : U(V[0][2], q)
      }

      function C(q) {
        D("next", q)
      }

      function E(q) {
        D("throw", q)
      }

      function U(q, w) {
        if (q(w), V.shift(), V.length) D(V[0][0], V[0][1])
      }
    }, $B9 = function(I) {
      var Y, J;
      return Y = {}, W("next"), W("throw", function(X) {
        throw X
      }), W("return"), Y[Symbol.iterator] = function() {
        return this
      }, Y;

      function W(X, V) {
        Y[X] = I[X] ? function(F) {
          return (J = !J) ? {
            value: lXA(I[X](F)),
            done: !1
          } : V ? V(F) : F
        } : V
      }
    }, wB9 = function(I) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var Y = I[Symbol.asyncIterator],
        J;
      return Y ? Y.call(I) : (I = typeof cZ1 === "function" ? cZ1(I) : I[Symbol.iterator](), J = {}, W("next"), W("throw"), W("return"), J[Symbol.asyncIterator] = function() {
        return this
      }, J);

      function W(V) {
        J[V] = I[V] && function(F) {
          return new Promise(function(K, D) {
            F = I[V](F), X(K, D, F.done, F.value)
          })
        }
      }

      function X(V, F, K, D) {
        Promise.resolve(D).then(function(H) {
          V({
            value: H,
            done: K
          })
        }, F)
      }
    }, qB9 = function(I, Y) {
      if (Object.defineProperty) Object.defineProperty(I, "raw", {
        value: Y
      });
      else I.raw = Y;
      return I
    };
    var B = Object.create ? function(I, Y) {
        Object.defineProperty(I, "default", {
          enumerable: !0,
          value: Y
        })
      } : function(I, Y) {
        I.default = Y
      },
      G = function(I) {
        return G = Object.getOwnPropertyNames || function(Y) {
          var J = [];
          for (var W in Y)
            if (Object.prototype.hasOwnProperty.call(Y, W)) J[J.length] = W;
          return J
        }, G(I)
      };
    NB9 = function(I) {
      if (I && I.__esModule) return I;
      var Y = {};
      if (I != null) {
        for (var J = G(I), W = 0; W < J.length; W++)
          if (J[W] !== "default") pZ1(Y, I, J[W])
      }
      return B(Y, I), Y
    }, LB9 = function(I) {
      return I && I.__esModule ? I : {
        default: I
      }
    }, MB9 = function(I, Y, J, W) {
      if (J === "a" && !W) throw TypeError("Private accessor was defined without a getter");
      if (typeof Y === "function" ? I !== Y || !W : !Y.has(I)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return J === "m" ? W : J === "a" ? W.call(I) : W ? W.value : Y.get(I)
    }, OB9 = function(I, Y, J, W, X) {
      if (W === "m") throw TypeError("Private method is not writable");
      if (W === "a" && !X) throw TypeError("Private accessor was defined without a setter");
      if (typeof Y === "function" ? I !== Y || !X : !Y.has(I)) throw TypeError("Cannot write private member to an object whose class did not declare it");
      return W === "a" ? X.call(I, J) : X ? X.value = J : Y.set(I, J), J
    }, RB9 = function(I, Y) {
      if (Y === null || typeof Y !== "object" && typeof Y !== "function") throw TypeError("Cannot use 'in' operator on non-object");
      return typeof I === "function" ? Y === I : I.has(Y)
    }, TB9 = function(I, Y, J) {
      if (Y !== null && Y !== void 0) {
        if (typeof Y !== "object" && typeof Y !== "function") throw TypeError("Object expected.");
        var W, X;
        if (J) {
          if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
          W = Y[Symbol.asyncDispose]
        }
        if (W === void 0) {
          if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
          if (W = Y[Symbol.dispose], J) X = W
        }
        if (typeof W !== "function") throw TypeError("Object not disposable.");
        if (X) W = function() {
          try {
            X.call(this)
          } catch (V) {
            return Promise.reject(V)
          }
        };
        I.stack.push({
          value: Y,
          dispose: W,
          async: J
        })
      } else if (J) I.stack.push({
        async: !0
      });
      return Y
    };
    var Z = typeof SuppressedError === "function" ? SuppressedError : function(I, Y, J) {
      var W = Error(J);
      return W.name = "SuppressedError", W.error = I, W.suppressed = Y, W
    };
    PB9 = function(I) {
      function Y(V) {
        I.error = I.hasError ? new Z(V, I.error, "An error was suppressed during disposal.") : V, I.hasError = !0
      }
      var J, W = 0;

      function X() {
        while (J = I.stack.pop()) try {
          if (!J.async && W === 1) return W = 0, I.stack.push(J), Promise.resolve().then(X);
          if (J.dispose) {
            var V = J.dispose.call(J.value);
            if (J.async) return W |= 2, Promise.resolve(V).then(X, function(F) {
              return Y(F), X()
            })
          } else W |= 1
        } catch (F) {
          Y(F)
        }
        if (W === 1) return I.hasError ? Promise.reject(I.error) : Promise.resolve();
        if (I.hasError) throw I.error
      }
      return X()
    }, jB9 = function(I, Y) {
      if (typeof I === "string" && /^\.\.?\//.test(I)) return I.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(J, W, X, V, F) {
        return W ? Y ? ".jsx" : ".js" : X && (!V || !F) ? J : X + V + "." + F.toLowerCase() + "js"
      });
      return I
    }, A("__extends", BB9), A("__assign", GB9), A("__rest", ZB9), A("__decorate", IB9), A("__param", YB9), A("__esDecorate", JB9), A("__runInitializers", WB9), A("__propKey", XB9), A("__setFunctionName", VB9), A("__metadata", FB9), A("__awaiter", KB9), A("__generator", DB9), A("__exportStar", HB9), A("__createBinding", pZ1), A("__values", cZ1), A("__read", tJ0), A("__spread", CB9), A("__spreadArrays", EB9), A("__spreadArray", zB9), A("__await", lXA), A("__asyncGenerator", UB9), A("__asyncDelegator", $B9), A("__asyncValues", wB9), A("__makeTemplateObject", qB9), A("__importStar", NB9), A("__importDefault", LB9), A("__classPrivateFieldGet", MB9), A("__classPrivateFieldSet", OB9), A("__classPrivateFieldIn", RB9), A("__addDisposableResource", TB9), A("__disposeResources", PB9), A("__rewriteRelativeImportExtension", jB9)
  })
})
// @from(Start 13238179, End 13238264)
_B9 = z((SB9) => {
  Object.defineProperty(SB9, "__esModule", {
    value: !0
  })
})
// @from(Start 13238270, End 13238355)
yB9 = z((kB9) => {
  Object.defineProperty(kB9, "__esModule", {
    value: !0
  })
})
// @from(Start 13238361, End 13238446)
eJ0 = z((xB9) => {
  Object.defineProperty(xB9, "__esModule", {
    value: !0
  })
})
// @from(Start 13238452, End 13238861)
AW0 = z((WR3) => {
  function JR3(A, Q, B) {
    Q.split && (Q = Q.split("."));
    var G = 0,
      Z = Q.length,
      I = A,
      Y, J;
    while (G < Z) {
      if (J = "" + Q[G++], J === "__proto__" || J === "constructor" || J === "prototype") break;
      I = I[J] = G === Z ? B : typeof(Y = I[J]) === typeof Q ? Y : Q[G] * 0 !== 0 || !!~("" + Q[G]).indexOf(".") ? {} : []
    }
  }
  WR3.dset = JR3
})
// @from(Start 13238867, End 13239170)
fB9 = z((vB9) => {
  Object.defineProperty(vB9, "__esModule", {
    value: !0
  });
  vB9.pickBy = void 0;
  var VR3 = function(A, Q) {
    return Object.keys(A).filter(function(B) {
      return Q(B, A[B])
    }).reduce(function(B, G) {
      return B[G] = A[G], B
    }, {})
  };
  vB9.pickBy = VR3
})
// @from(Start 13239176, End 13239551)
QW0 = z((hB9) => {
  Object.defineProperty(hB9, "__esModule", {
    value: !0
  });
  hB9.ValidationError = void 0;
  var FR3 = oP(),
    KR3 = function(A) {
      FR3.__extends(Q, A);

      function Q(B, G) {
        var Z = A.call(this, "".concat(B, " ").concat(G)) || this;
        return Z.field = B, Z
      }
      return Q
    }(Error);
  hB9.ValidationError = KR3
})
// @from(Start 13239557, End 13240196)
BW0 = z((uB9) => {
  Object.defineProperty(uB9, "__esModule", {
    value: !0
  });
  uB9.isPlainObject = uB9.exists = uB9.isFunction = uB9.isNumber = uB9.isString = void 0;

  function DR3(A) {
    return typeof A === "string"
  }
  uB9.isString = DR3;

  function HR3(A) {
    return typeof A === "number"
  }
  uB9.isNumber = HR3;

  function CR3(A) {
    return typeof A === "function"
  }
  uB9.isFunction = CR3;

  function ER3(A) {
    return A !== void 0 && A !== null
  }
  uB9.exists = ER3;

  function zR3(A) {
    return Object.prototype.toString.call(A).slice(8, -1).toLowerCase() === "object"
  }
  uB9.isPlainObject = zR3
})
// @from(Start 13240202, End 13242029)
IW0 = z((sB9) => {
  Object.defineProperty(sB9, "__esModule", {
    value: !0
  });
  sB9.validateEvent = sB9.assertTraits = sB9.assertTrackEventProperties = sB9.assertTrackEventName = sB9.assertEventType = sB9.assertEventExists = sB9.assertUserIdentity = void 0;
  var Xa = QW0(),
    qQA = BW0(),
    GW0 = "is not a string",
    ZW0 = "is not an object",
    dB9 = "is nil";

  function cB9(A) {
    var Q = ".userId/anonymousId/previousId/groupId",
      B = function(Z) {
        var I, Y, J;
        return (J = (Y = (I = Z.userId) !== null && I !== void 0 ? I : Z.anonymousId) !== null && Y !== void 0 ? Y : Z.groupId) !== null && J !== void 0 ? J : Z.previousId
      },
      G = B(A);
    if (!(0, qQA.exists)(G)) throw new Xa.ValidationError(Q, dB9);
    else if (!(0, qQA.isString)(G)) throw new Xa.ValidationError(Q, GW0)
  }
  sB9.assertUserIdentity = cB9;

  function pB9(A) {
    if (!(0, qQA.exists)(A)) throw new Xa.ValidationError("Event", dB9);
    if (typeof A !== "object") throw new Xa.ValidationError("Event", ZW0)
  }
  sB9.assertEventExists = pB9;

  function lB9(A) {
    if (!(0, qQA.isString)(A.type)) throw new Xa.ValidationError(".type", GW0)
  }
  sB9.assertEventType = lB9;

  function iB9(A) {
    if (!(0, qQA.isString)(A.event)) throw new Xa.ValidationError(".event", GW0)
  }
  sB9.assertTrackEventName = iB9;

  function nB9(A) {
    if (!(0, qQA.isPlainObject)(A.properties)) throw new Xa.ValidationError(".properties", ZW0)
  }
  sB9.assertTrackEventProperties = nB9;

  function aB9(A) {
    if (!(0, qQA.isPlainObject)(A.traits)) throw new Xa.ValidationError(".traits", ZW0)
  }
  sB9.assertTraits = aB9;

  function NR3(A) {
    if (pB9(A), lB9(A), A.type === "track") iB9(A), nB9(A);
    if (["group", "identify"].includes(A.type)) aB9(A);
    cB9(A)
  }
  sB9.validateEvent = NR3
})
// @from(Start 13242035, End 13246504)
eB9 = z((YW0) => {
  Object.defineProperty(YW0, "__esModule", {
    value: !0
  });
  YW0.EventFactory = void 0;
  var y6 = oP();
  y6.__exportStar(eJ0(), YW0);
  var oB9 = AW0(),
    jR3 = fB9(),
    SR3 = IW0(),
    _R3 = function() {
      function A(Q) {
        this.user = Q.user, this.createMessageId = Q.createMessageId
      }
      return A.prototype.track = function(Q, B, G, Z) {
        return this.normalize(y6.__assign(y6.__assign({}, this.baseEvent()), {
          event: Q,
          type: "track",
          properties: B !== null && B !== void 0 ? B : {},
          options: y6.__assign({}, G),
          integrations: y6.__assign({}, Z)
        }))
      }, A.prototype.page = function(Q, B, G, Z, I) {
        var Y, J = {
          type: "page",
          properties: y6.__assign({}, G),
          options: y6.__assign({}, Z),
          integrations: y6.__assign({}, I)
        };
        if (Q !== null) J.category = Q, J.properties = (Y = J.properties) !== null && Y !== void 0 ? Y : {}, J.properties.category = Q;
        if (B !== null) J.name = B;
        return this.normalize(y6.__assign(y6.__assign({}, this.baseEvent()), J))
      }, A.prototype.screen = function(Q, B, G, Z, I) {
        var Y = {
          type: "screen",
          properties: y6.__assign({}, G),
          options: y6.__assign({}, Z),
          integrations: y6.__assign({}, I)
        };
        if (Q !== null) Y.category = Q;
        if (B !== null) Y.name = B;
        return this.normalize(y6.__assign(y6.__assign({}, this.baseEvent()), Y))
      }, A.prototype.identify = function(Q, B, G, Z) {
        return this.normalize(y6.__assign(y6.__assign({}, this.baseEvent()), {
          type: "identify",
          userId: Q,
          traits: B !== null && B !== void 0 ? B : {},
          options: y6.__assign({}, G),
          integrations: Z
        }))
      }, A.prototype.group = function(Q, B, G, Z) {
        return this.normalize(y6.__assign(y6.__assign({}, this.baseEvent()), {
          type: "group",
          traits: B !== null && B !== void 0 ? B : {},
          options: y6.__assign({}, G),
          integrations: y6.__assign({}, Z),
          groupId: Q
        }))
      }, A.prototype.alias = function(Q, B, G, Z) {
        var I = {
          userId: Q,
          type: "alias",
          options: y6.__assign({}, G),
          integrations: y6.__assign({}, Z)
        };
        if (B !== null) I.previousId = B;
        if (Q === void 0) return this.normalize(y6.__assign(y6.__assign({}, I), this.baseEvent()));
        return this.normalize(y6.__assign(y6.__assign({}, this.baseEvent()), I))
      }, A.prototype.baseEvent = function() {
        var Q = {
          integrations: {},
          options: {}
        };
        if (!this.user) return Q;
        var B = this.user;
        if (B.id()) Q.userId = B.id();
        if (B.anonymousId()) Q.anonymousId = B.anonymousId();
        return Q
      }, A.prototype.context = function(Q) {
        var B, G = ["userId", "anonymousId", "timestamp"];
        delete Q.integrations;
        var Z = Object.keys(Q),
          I = (B = Q.context) !== null && B !== void 0 ? B : {},
          Y = {};
        return Z.forEach(function(J) {
          if (J === "context") return;
          if (G.includes(J))(0, oB9.dset)(Y, J, Q[J]);
          else(0, oB9.dset)(I, J, Q[J])
        }), [I, Y]
      }, A.prototype.normalize = function(Q) {
        var B, G, Z = Object.keys((B = Q.integrations) !== null && B !== void 0 ? B : {}).reduce(function(D, H) {
          var C, E;
          return y6.__assign(y6.__assign({}, D), (C = {}, C[H] = Boolean((E = Q.integrations) === null || E === void 0 ? void 0 : E[H]), C))
        }, {});
        Q.options = (0, jR3.pickBy)(Q.options || {}, function(D, H) {
          return H !== void 0
        });
        var I = y6.__assign(y6.__assign({}, Z), (G = Q.options) === null || G === void 0 ? void 0 : G.integrations),
          Y = Q.options ? this.context(Q.options) : [],
          J = Y[0],
          W = Y[1],
          X = Q.options,
          V = y6.__rest(Q, ["options"]),
          F = y6.__assign(y6.__assign(y6.__assign({
            timestamp: new Date
          }, V), {
            integrations: I,
            context: J
          }), W),
          K = y6.__assign(y6.__assign({}, F), {
            messageId: this.createMessageId()
          });
        return (0, SR3.validateEvent)(K), K
      }, A
    }();
  YW0.EventFactory = _R3
})
// @from(Start 13246510, End 13247541)
JW0 = z((B29) => {
  Object.defineProperty(B29, "__esModule", {
    value: !0
  });
  B29.invokeCallback = B29.sleep = B29.pTimeout = void 0;

  function A29(A, Q) {
    return new Promise(function(B, G) {
      var Z = setTimeout(function() {
        G(Error("Promise timed out"))
      }, Q);
      A.then(function(I) {
        return clearTimeout(Z), B(I)
      }).catch(G)
    })
  }
  B29.pTimeout = A29;

  function Q29(A) {
    return new Promise(function(Q) {
      return setTimeout(Q, A)
    })
  }
  B29.sleep = Q29;

  function kR3(A, Q, B) {
    var G = function() {
      try {
        return Promise.resolve(Q(A))
      } catch (Z) {
        return Promise.reject(Z)
      }
    };
    return Q29(B).then(function() {
      return A29(G(), 1000)
    }).catch(function(Z) {
      A === null || A === void 0 || A.log("warn", "Callback Error", {
        error: Z
      }), A === null || A === void 0 || A.stats.increment("callback_error")
    }).then(function() {
      return A
    })
  }
  B29.invokeCallback = kR3
})
// @from(Start 13247547, End 13264803)
sZ1 = z(($MZ, aZ1) => {
  var Z29, I29, Y29, J29, W29, X29, V29, F29, K29, D29, H29, C29, E29, iZ1, WW0, z29, U29, $29, iXA, w29, q29, N29, L29, M29, O29, R29, T29, P29, nZ1, j29, S29, _29;
  (function(A) {
    var Q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(G) {
      A(B(Q, B(G)))
    });
    else if (typeof aZ1 === "object" && typeof $MZ === "object") A(B(Q, B($MZ)));
    else A(B(Q));

    function B(G, Z) {
      if (G !== Q)
        if (typeof Object.create === "function") Object.defineProperty(G, "__esModule", {
          value: !0
        });
        else G.__esModule = !0;
      return function(I, Y) {
        return G[I] = Z ? Z(I, Y) : Y
      }
    }
  })(function(A) {
    var Q = Object.setPrototypeOf || {
      __proto__: []
    }
    instanceof Array && function(I, Y) {
      I.__proto__ = Y
    } || function(I, Y) {
      for (var J in Y)
        if (Object.prototype.hasOwnProperty.call(Y, J)) I[J] = Y[J]
    };
    Z29 = function(I, Y) {
      if (typeof Y !== "function" && Y !== null) throw TypeError("Class extends value " + String(Y) + " is not a constructor or null");
      Q(I, Y);

      function J() {
        this.constructor = I
      }
      I.prototype = Y === null ? Object.create(Y) : (J.prototype = Y.prototype, new J)
    }, I29 = Object.assign || function(I) {
      for (var Y, J = 1, W = arguments.length; J < W; J++) {
        Y = arguments[J];
        for (var X in Y)
          if (Object.prototype.hasOwnProperty.call(Y, X)) I[X] = Y[X]
      }
      return I
    }, Y29 = function(I, Y) {
      var J = {};
      for (var W in I)
        if (Object.prototype.hasOwnProperty.call(I, W) && Y.indexOf(W) < 0) J[W] = I[W];
      if (I != null && typeof Object.getOwnPropertySymbols === "function") {
        for (var X = 0, W = Object.getOwnPropertySymbols(I); X < W.length; X++)
          if (Y.indexOf(W[X]) < 0 && Object.prototype.propertyIsEnumerable.call(I, W[X])) J[W[X]] = I[W[X]]
      }
      return J
    }, J29 = function(I, Y, J, W) {
      var X = arguments.length,
        V = X < 3 ? Y : W === null ? W = Object.getOwnPropertyDescriptor(Y, J) : W,
        F;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") V = Reflect.decorate(I, Y, J, W);
      else
        for (var K = I.length - 1; K >= 0; K--)
          if (F = I[K]) V = (X < 3 ? F(V) : X > 3 ? F(Y, J, V) : F(Y, J)) || V;
      return X > 3 && V && Object.defineProperty(Y, J, V), V
    }, W29 = function(I, Y) {
      return function(J, W) {
        Y(J, W, I)
      }
    }, X29 = function(I, Y, J, W, X, V) {
      function F(T) {
        if (T !== void 0 && typeof T !== "function") throw TypeError("Function expected");
        return T
      }
      var K = W.kind,
        D = K === "getter" ? "get" : K === "setter" ? "set" : "value",
        H = !Y && I ? W.static ? I : I.prototype : null,
        C = Y || (H ? Object.getOwnPropertyDescriptor(H, W.name) : {}),
        E, U = !1;
      for (var q = J.length - 1; q >= 0; q--) {
        var w = {};
        for (var N in W) w[N] = N === "access" ? {} : W[N];
        for (var N in W.access) w.access[N] = W.access[N];
        w.addInitializer = function(T) {
          if (U) throw TypeError("Cannot add initializers after decoration has completed");
          V.push(F(T || null))
        };
        var R = (0, J[q])(K === "accessor" ? {
          get: C.get,
          set: C.set
        } : C[D], w);
        if (K === "accessor") {
          if (R === void 0) continue;
          if (R === null || typeof R !== "object") throw TypeError("Object expected");
          if (E = F(R.get)) C.get = E;
          if (E = F(R.set)) C.set = E;
          if (E = F(R.init)) X.unshift(E)
        } else if (E = F(R))
          if (K === "field") X.unshift(E);
          else C[D] = E
      }
      if (H) Object.defineProperty(H, W.name, C);
      U = !0
    }, V29 = function(I, Y, J) {
      var W = arguments.length > 2;
      for (var X = 0; X < Y.length; X++) J = W ? Y[X].call(I, J) : Y[X].call(I);
      return W ? J : void 0
    }, F29 = function(I) {
      return typeof I === "symbol" ? I : "".concat(I)
    }, K29 = function(I, Y, J) {
      if (typeof Y === "symbol") Y = Y.description ? "[".concat(Y.description, "]") : "";
      return Object.defineProperty(I, "name", {
        configurable: !0,
        value: J ? "".concat(J, " ", Y) : Y
      })
    }, D29 = function(I, Y) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(I, Y)
    }, H29 = function(I, Y, J, W) {
      function X(V) {
        return V instanceof J ? V : new J(function(F) {
          F(V)
        })
      }
      return new(J || (J = Promise))(function(V, F) {
        function K(C) {
          try {
            H(W.next(C))
          } catch (E) {
            F(E)
          }
        }

        function D(C) {
          try {
            H(W.throw(C))
          } catch (E) {
            F(E)
          }
        }

        function H(C) {
          C.done ? V(C.value) : X(C.value).then(K, D)
        }
        H((W = W.apply(I, Y || [])).next())
      })
    }, C29 = function(I, Y) {
      var J = {
          label: 0,
          sent: function() {
            if (V[0] & 1) throw V[1];
            return V[1]
          },
          trys: [],
          ops: []
        },
        W, X, V, F = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return F.next = K(0), F.throw = K(1), F.return = K(2), typeof Symbol === "function" && (F[Symbol.iterator] = function() {
        return this
      }), F;

      function K(H) {
        return function(C) {
          return D([H, C])
        }
      }

      function D(H) {
        if (W) throw TypeError("Generator is already executing.");
        while (F && (F = 0, H[0] && (J = 0)), J) try {
          if (W = 1, X && (V = H[0] & 2 ? X.return : H[0] ? X.throw || ((V = X.return) && V.call(X), 0) : X.next) && !(V = V.call(X, H[1])).done) return V;
          if (X = 0, V) H = [H[0] & 2, V.value];
          switch (H[0]) {
            case 0:
            case 1:
              V = H;
              break;
            case 4:
              return J.label++, {
                value: H[1],
                done: !1
              };
            case 5:
              J.label++, X = H[1], H = [0];
              continue;
            case 7:
              H = J.ops.pop(), J.trys.pop();
              continue;
            default:
              if ((V = J.trys, !(V = V.length > 0 && V[V.length - 1])) && (H[0] === 6 || H[0] === 2)) {
                J = 0;
                continue
              }
              if (H[0] === 3 && (!V || H[1] > V[0] && H[1] < V[3])) {
                J.label = H[1];
                break
              }
              if (H[0] === 6 && J.label < V[1]) {
                J.label = V[1], V = H;
                break
              }
              if (V && J.label < V[2]) {
                J.label = V[2], J.ops.push(H);
                break
              }
              if (V[2]) J.ops.pop();
              J.trys.pop();
              continue
          }
          H = Y.call(I, J)
        } catch (C) {
          H = [6, C], X = 0
        } finally {
          W = V = 0
        }
        if (H[0] & 5) throw H[1];
        return {
          value: H[0] ? H[1] : void 0,
          done: !0
        }
      }
    }, E29 = function(I, Y) {
      for (var J in I)
        if (J !== "default" && !Object.prototype.hasOwnProperty.call(Y, J)) nZ1(Y, I, J)
    }, nZ1 = Object.create ? function(I, Y, J, W) {
      if (W === void 0) W = J;
      var X = Object.getOwnPropertyDescriptor(Y, J);
      if (!X || ("get" in X ? !Y.__esModule : X.writable || X.configurable)) X = {
        enumerable: !0,
        get: function() {
          return Y[J]
        }
      };
      Object.defineProperty(I, W, X)
    } : function(I, Y, J, W) {
      if (W === void 0) W = J;
      I[W] = Y[J]
    }, iZ1 = function(I) {
      var Y = typeof Symbol === "function" && Symbol.iterator,
        J = Y && I[Y],
        W = 0;
      if (J) return J.call(I);
      if (I && typeof I.length === "number") return {
        next: function() {
          if (I && W >= I.length) I = void 0;
          return {
            value: I && I[W++],
            done: !I
          }
        }
      };
      throw TypeError(Y ? "Object is not iterable." : "Symbol.iterator is not defined.")
    }, WW0 = function(I, Y) {
      var J = typeof Symbol === "function" && I[Symbol.iterator];
      if (!J) return I;
      var W = J.call(I),
        X, V = [],
        F;
      try {
        while ((Y === void 0 || Y-- > 0) && !(X = W.next()).done) V.push(X.value)
      } catch (K) {
        F = {
          error: K
        }
      } finally {
        try {
          if (X && !X.done && (J = W.return)) J.call(W)
        } finally {
          if (F) throw F.error
        }
      }
      return V
    }, z29 = function() {
      for (var I = [], Y = 0; Y < arguments.length; Y++) I = I.concat(WW0(arguments[Y]));
      return I
    }, U29 = function() {
      for (var I = 0, Y = 0, J = arguments.length; Y < J; Y++) I += arguments[Y].length;
      for (var W = Array(I), X = 0, Y = 0; Y < J; Y++)
        for (var V = arguments[Y], F = 0, K = V.length; F < K; F++, X++) W[X] = V[F];
      return W
    }, $29 = function(I, Y, J) {
      if (J || arguments.length === 2) {
        for (var W = 0, X = Y.length, V; W < X; W++)
          if (V || !(W in Y)) {
            if (!V) V = Array.prototype.slice.call(Y, 0, W);
            V[W] = Y[W]
          }
      }
      return I.concat(V || Array.prototype.slice.call(Y))
    }, iXA = function(I) {
      return this instanceof iXA ? (this.v = I, this) : new iXA(I)
    }, w29 = function(I, Y, J) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var W = J.apply(I, Y || []),
        X, V = [];
      return X = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), K("next"), K("throw"), K("return", F), X[Symbol.asyncIterator] = function() {
        return this
      }, X;

      function F(q) {
        return function(w) {
          return Promise.resolve(w).then(q, E)
        }
      }

      function K(q, w) {
        if (W[q]) {
          if (X[q] = function(N) {
              return new Promise(function(R, T) {
                V.push([q, N, R, T]) > 1 || D(q, N)
              })
            }, w) X[q] = w(X[q])
        }
      }

      function D(q, w) {
        try {
          H(W[q](w))
        } catch (N) {
          U(V[0][3], N)
        }
      }

      function H(q) {
        q.value instanceof iXA ? Promise.resolve(q.value.v).then(C, E) : U(V[0][2], q)
      }

      function C(q) {
        D("next", q)
      }

      function E(q) {
        D("throw", q)
      }

      function U(q, w) {
        if (q(w), V.shift(), V.length) D(V[0][0], V[0][1])
      }
    }, q29 = function(I) {
      var Y, J;
      return Y = {}, W("next"), W("throw", function(X) {
        throw X
      }), W("return"), Y[Symbol.iterator] = function() {
        return this
      }, Y;

      function W(X, V) {
        Y[X] = I[X] ? function(F) {
          return (J = !J) ? {
            value: iXA(I[X](F)),
            done: !1
          } : V ? V(F) : F
        } : V
      }
    }, N29 = function(I) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var Y = I[Symbol.asyncIterator],
        J;
      return Y ? Y.call(I) : (I = typeof iZ1 === "function" ? iZ1(I) : I[Symbol.iterator](), J = {}, W("next"), W("throw"), W("return"), J[Symbol.asyncIterator] = function() {
        return this
      }, J);

      function W(V) {
        J[V] = I[V] && function(F) {
          return new Promise(function(K, D) {
            F = I[V](F), X(K, D, F.done, F.value)
          })
        }
      }

      function X(V, F, K, D) {
        Promise.resolve(D).then(function(H) {
          V({
            value: H,
            done: K
          })
        }, F)
      }
    }, L29 = function(I, Y) {
      if (Object.defineProperty) Object.defineProperty(I, "raw", {
        value: Y
      });
      else I.raw = Y;
      return I
    };
    var B = Object.create ? function(I, Y) {
        Object.defineProperty(I, "default", {
          enumerable: !0,
          value: Y
        })
      } : function(I, Y) {
        I.default = Y
      },
      G = function(I) {
        return G = Object.getOwnPropertyNames || function(Y) {
          var J = [];
          for (var W in Y)
            if (Object.prototype.hasOwnProperty.call(Y, W)) J[J.length] = W;
          return J
        }, G(I)
      };
    M29 = function(I) {
      if (I && I.__esModule) return I;
      var Y = {};
      if (I != null) {
        for (var J = G(I), W = 0; W < J.length; W++)
          if (J[W] !== "default") nZ1(Y, I, J[W])
      }
      return B(Y, I), Y
    }, O29 = function(I) {
      return I && I.__esModule ? I : {
        default: I
      }
    }, R29 = function(I, Y, J, W) {
      if (J === "a" && !W) throw TypeError("Private accessor was defined without a getter");
      if (typeof Y === "function" ? I !== Y || !W : !Y.has(I)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return J === "m" ? W : J === "a" ? W.call(I) : W ? W.value : Y.get(I)
    }, T29 = function(I, Y, J, W, X) {
      if (W === "m") throw TypeError("Private method is not writable");
      if (W === "a" && !X) throw TypeError("Private accessor was defined without a setter");
      if (typeof Y === "function" ? I !== Y || !X : !Y.has(I)) throw TypeError("Cannot write private member to an object whose class did not declare it");
      return W === "a" ? X.call(I, J) : X ? X.value = J : Y.set(I, J), J
    }, P29 = function(I, Y) {
      if (Y === null || typeof Y !== "object" && typeof Y !== "function") throw TypeError("Cannot use 'in' operator on non-object");
      return typeof I === "function" ? Y === I : I.has(Y)
    }, j29 = function(I, Y, J) {
      if (Y !== null && Y !== void 0) {
        if (typeof Y !== "object" && typeof Y !== "function") throw TypeError("Object expected.");
        var W, X;
        if (J) {
          if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
          W = Y[Symbol.asyncDispose]
        }
        if (W === void 0) {
          if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
          if (W = Y[Symbol.dispose], J) X = W
        }
        if (typeof W !== "function") throw TypeError("Object not disposable.");
        if (X) W = function() {
          try {
            X.call(this)
          } catch (V) {
            return Promise.reject(V)
          }
        };
        I.stack.push({
          value: Y,
          dispose: W,
          async: J
        })
      } else if (J) I.stack.push({
        async: !0
      });
      return Y
    };
    var Z = typeof SuppressedError === "function" ? SuppressedError : function(I, Y, J) {
      var W = Error(J);
      return W.name = "SuppressedError", W.error = I, W.suppressed = Y, W
    };
    S29 = function(I) {
      function Y(V) {
        I.error = I.hasError ? new Z(V, I.error, "An error was suppressed during disposal.") : V, I.hasError = !0
      }
      var J, W = 0;

      function X() {
        while (J = I.stack.pop()) try {
          if (!J.async && W === 1) return W = 0, I.stack.push(J), Promise.resolve().then(X);
          if (J.dispose) {
            var V = J.dispose.call(J.value);
            if (J.async) return W |= 2, Promise.resolve(V).then(X, function(F) {
              return Y(F), X()
            })
          } else W |= 1
        } catch (F) {
          Y(F)
        }
        if (W === 1) return I.hasError ? Promise.reject(I.error) : Promise.resolve();
        if (I.hasError) throw I.error
      }
      return X()
    }, _29 = function(I, Y) {
      if (typeof I === "string" && /^\.\.?\//.test(I)) return I.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(J, W, X, V, F) {
        return W ? Y ? ".jsx" : ".js" : X && (!V || !F) ? J : X + V + "." + F.toLowerCase() + "js"
      });
      return I
    }, A("__extends", Z29), A("__assign", I29), A("__rest", Y29), A("__decorate", J29), A("__param", W29), A("__esDecorate", X29), A("__runInitializers", V29), A("__propKey", F29), A("__setFunctionName", K29), A("__metadata", D29), A("__awaiter", H29), A("__generator", C29), A("__exportStar", E29), A("__createBinding", nZ1), A("__values", iZ1), A("__read", WW0), A("__spread", z29), A("__spreadArrays", U29), A("__spreadArray", $29), A("__await", iXA), A("__asyncGenerator", w29), A("__asyncDelegator", q29), A("__asyncValues", N29), A("__makeTemplateObject", L29), A("__importStar", M29), A("__importDefault", O29), A("__classPrivateFieldGet", R29), A("__classPrivateFieldSet", T29), A("__classPrivateFieldIn", P29), A("__addDisposableResource", j29), A("__disposeResources", S29), A("__rewriteRelativeImportExtension", _29)
  })
})
// @from(Start 13264809, End 13265128)
x29 = z((k29) => {
  Object.defineProperty(k29, "__esModule", {
    value: !0
  });
  k29.createDeferred = void 0;
  var vR3 = function() {
    var A, Q, B = new Promise(function(G, Z) {
      A = G, Q = Z
    });
    return {
      resolve: A,
      reject: Q,
      promise: B
    }
  };
  k29.createDeferred = vR3
})
// @from(Start 13265134, End 13265270)
v29 = z((XW0) => {
  Object.defineProperty(XW0, "__esModule", {
    value: !0
  });
  var bR3 = sZ1();
  bR3.__exportStar(x29(), XW0)
})
// @from(Start 13265276, End 13266956)
h29 = z((b29) => {
  Object.defineProperty(b29, "__esModule", {
    value: !0
  });
  b29.Emitter = void 0;
  var fR3 = function() {
    function A(Q) {
      var B;
      this.callbacks = {}, this.warned = !1, this.maxListeners = (B = Q === null || Q === void 0 ? void 0 : Q.maxListeners) !== null && B !== void 0 ? B : 10
    }
    return A.prototype.warnIfPossibleMemoryLeak = function(Q) {
      if (this.warned) return;
      if (this.maxListeners && this.callbacks[Q].length > this.maxListeners) console.warn("Event Emitter: Possible memory leak detected; ".concat(String(Q), " has exceeded ").concat(this.maxListeners, " listeners.")), this.warned = !0
    }, A.prototype.on = function(Q, B) {
      if (!this.callbacks[Q]) this.callbacks[Q] = [B];
      else this.callbacks[Q].push(B), this.warnIfPossibleMemoryLeak(Q);
      return this
    }, A.prototype.once = function(Q, B) {
      var G = this,
        Z = function() {
          var I = [];
          for (var Y = 0; Y < arguments.length; Y++) I[Y] = arguments[Y];
          G.off(Q, Z), B.apply(G, I)
        };
      return this.on(Q, Z), this
    }, A.prototype.off = function(Q, B) {
      var G, Z = (G = this.callbacks[Q]) !== null && G !== void 0 ? G : [],
        I = Z.filter(function(Y) {
          return Y !== B
        });
      return this.callbacks[Q] = I, this
    }, A.prototype.emit = function(Q) {
      var B = this,
        G, Z = [];
      for (var I = 1; I < arguments.length; I++) Z[I - 1] = arguments[I];
      var Y = (G = this.callbacks[Q]) !== null && G !== void 0 ? G : [];
      return Y.forEach(function(J) {
        J.apply(B, Z)
      }), this
    }, A
  }();
  b29.Emitter = fR3
})
// @from(Start 13266962, End 13267098)
g29 = z((VW0) => {
  Object.defineProperty(VW0, "__esModule", {
    value: !0
  });
  var hR3 = sZ1();
  hR3.__exportStar(h29(), VW0)
})
// @from(Start 13267104, End 13267272)
nXA = z((rZ1) => {
  Object.defineProperty(rZ1, "__esModule", {
    value: !0
  });
  var u29 = sZ1();
  u29.__exportStar(v29(), rZ1);
  u29.__exportStar(g29(), rZ1)
})
// @from(Start 13267278, End 13267702)
FW0 = z((m29) => {
  Object.defineProperty(m29, "__esModule", {
    value: !0
  });
  m29.backoff = void 0;

  function gR3(A) {
    var Q = Math.random() + 1,
      B = A.minTimeout,
      G = B === void 0 ? 500 : B,
      Z = A.factor,
      I = Z === void 0 ? 2 : Z,
      Y = A.attempt,
      J = A.maxTimeout,
      W = J === void 0 ? 1 / 0 : J;
    return Math.min(Q * G * Math.pow(I, Y), W)
  }
  m29.backoff = gR3
})
// @from(Start 13267708, End 13270142)
KW0 = z((c29) => {
  Object.defineProperty(c29, "__esModule", {
    value: !0
  });
  c29.PriorityQueue = c29.ON_REMOVE_FROM_FUTURE = void 0;
  var uR3 = oP(),
    mR3 = nXA(),
    dR3 = FW0();
  c29.ON_REMOVE_FROM_FUTURE = "onRemoveFromFuture";
  var cR3 = function(A) {
    uR3.__extends(Q, A);

    function Q(B, G, Z) {
      var I = A.call(this) || this;
      return I.future = [], I.maxAttempts = B, I.queue = G, I.seen = Z !== null && Z !== void 0 ? Z : {}, I
    }
    return Q.prototype.push = function() {
      var B = this,
        G = [];
      for (var Z = 0; Z < arguments.length; Z++) G[Z] = arguments[Z];
      var I = G.map(function(Y) {
        var J = B.updateAttempts(Y);
        if (J > B.maxAttempts || B.includes(Y)) return !1;
        return B.queue.push(Y), !0
      });
      return this.queue = this.queue.sort(function(Y, J) {
        return B.getAttempts(Y) - B.getAttempts(J)
      }), I
    }, Q.prototype.pushWithBackoff = function(B) {
      var G = this;
      if (this.getAttempts(B) === 0) return this.push(B)[0];
      var Z = this.updateAttempts(B);
      if (Z > this.maxAttempts || this.includes(B)) return !1;
      var I = (0, dR3.backoff)({
        attempt: Z - 1
      });
      return setTimeout(function() {
        G.queue.push(B), G.future = G.future.filter(function(Y) {
          return Y.id !== B.id
        }), G.emit(c29.ON_REMOVE_FROM_FUTURE)
      }, I), this.future.push(B), !0
    }, Q.prototype.getAttempts = function(B) {
      var G;
      return (G = this.seen[B.id]) !== null && G !== void 0 ? G : 0
    }, Q.prototype.updateAttempts = function(B) {
      return this.seen[B.id] = this.getAttempts(B) + 1, this.getAttempts(B)
    }, Q.prototype.includes = function(B) {
      return this.queue.includes(B) || this.future.includes(B) || Boolean(this.queue.find(function(G) {
        return G.id === B.id
      })) || Boolean(this.future.find(function(G) {
        return G.id === B.id
      }))
    }, Q.prototype.pop = function() {
      return this.queue.shift()
    }, Object.defineProperty(Q.prototype, "length", {
      get: function() {
        return this.queue.length
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(Q.prototype, "todo", {
      get: function() {
        return this.queue.length + this.future.length
      },
      enumerable: !1,
      configurable: !0
    }), Q
  }(mR3.Emitter);
  c29.PriorityQueue = cR3
})
// @from(Start 13270148, End 13270711)
DW0 = z((lR3) => {
  var NQA = 256,
    tZ1 = [],
    oZ1;
  while (NQA--) tZ1[NQA] = (NQA + 256).toString(16).substring(1);

  function pR3() {
    var A = 0,
      Q, B = "";
    if (!oZ1 || NQA + 16 > 256) {
      oZ1 = Array(A = 256);
      while (A--) oZ1[A] = 256 * Math.random() | 0;
      A = NQA = 0
    }
    for (; A < 16; A++) {
      if (Q = oZ1[NQA + A], A == 6) B += tZ1[Q & 15 | 64];
      else if (A == 8) B += tZ1[Q & 63 | 128];
      else B += tZ1[Q];
      if (A & 1 && A > 1 && A < 11) B += "-"
    }
    return NQA++, B
  }
  lR3.v4 = pR3
})
// @from(Start 13270717, End 13272370)
HW0 = z((i29) => {
  Object.defineProperty(i29, "__esModule", {
    value: !0
  });
  i29.CoreLogger = void 0;
  var eZ1 = oP(),
    nR3 = function() {
      function A() {
        this._logs = []
      }
      return A.prototype.log = function(Q, B, G) {
        var Z = new Date;
        this._logs.push({
          level: Q,
          message: B,
          time: Z,
          extras: G
        })
      }, Object.defineProperty(A.prototype, "logs", {
        get: function() {
          return this._logs
        },
        enumerable: !1,
        configurable: !0
      }), A.prototype.flush = function() {
        if (this.logs.length > 1) {
          var Q = this._logs.reduce(function(B, G) {
            var Z, I, Y, J = eZ1.__assign(eZ1.__assign({}, G), {
              json: JSON.stringify(G.extras, null, " "),
              extras: G.extras
            });
            delete J.time;
            var W = (Y = (I = G.time) === null || I === void 0 ? void 0 : I.toISOString()) !== null && Y !== void 0 ? Y : "";
            if (B[W]) W = "".concat(W, "-").concat(Math.random());
            return eZ1.__assign(eZ1.__assign({}, B), (Z = {}, Z[W] = J, Z))
          }, {});
          if (console.table) console.table(Q);
          else console.log(Q)
        } else this.logs.forEach(function(B) {
          var {
            level: G,
            message: Z,
            extras: I
          } = B;
          if (G === "info" || G === "debug") console.log(Z, I !== null && I !== void 0 ? I : "");
          else console[G](Z, I !== null && I !== void 0 ? I : "")
        });
        this._logs = []
      }, A
    }();
  i29.CoreLogger = nR3
})
// @from(Start 13272376, End 13274557)
EW0 = z((s29) => {
  Object.defineProperty(s29, "__esModule", {
    value: !0
  });
  s29.NullStats = s29.CoreStats = void 0;
  var CW0 = oP(),
    aR3 = function(A) {
      var Q = {
        gauge: "g",
        counter: "c"
      };
      return Q[A]
    },
    a29 = function() {
      function A() {
        this.metrics = []
      }
      return A.prototype.increment = function(Q, B, G) {
        if (B === void 0) B = 1;
        this.metrics.push({
          metric: Q,
          value: B,
          tags: G !== null && G !== void 0 ? G : [],
          type: "counter",
          timestamp: Date.now()
        })
      }, A.prototype.gauge = function(Q, B, G) {
        this.metrics.push({
          metric: Q,
          value: B,
          tags: G !== null && G !== void 0 ? G : [],
          type: "gauge",
          timestamp: Date.now()
        })
      }, A.prototype.flush = function() {
        var Q = this.metrics.map(function(B) {
          return CW0.__assign(CW0.__assign({}, B), {
            tags: B.tags.join(",")
          })
        });
        if (console.table) console.table(Q);
        else console.log(Q);
        this.metrics = []
      }, A.prototype.serialize = function() {
        return this.metrics.map(function(Q) {
          return {
            m: Q.metric,
            v: Q.value,
            t: Q.tags,
            k: aR3(Q.type),
            e: Q.timestamp
          }
        })
      }, A
    }();
  s29.CoreStats = a29;
  var sR3 = function(A) {
    CW0.__extends(Q, A);

    function Q() {
      return A !== null && A.apply(this, arguments) || this
    }
    return Q.prototype.gauge = function() {
      var B = [];
      for (var G = 0; G < arguments.length; G++) B[G] = arguments[G]
    }, Q.prototype.increment = function() {
      var B = [];
      for (var G = 0; G < arguments.length; G++) B[G] = arguments[G]
    }, Q.prototype.flush = function() {
      var B = [];
      for (var G = 0; G < arguments.length; G++) B[G] = arguments[G]
    }, Q.prototype.serialize = function() {
      var B = [];
      for (var G = 0; G < arguments.length; G++) B[G] = arguments[G];
      return []
    }, Q
  }(a29);
  s29.NullStats = sR3
})