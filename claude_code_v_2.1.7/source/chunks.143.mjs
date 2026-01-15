
// @from(Ln 424010, Col 0)
function C59({
  session: A,
  toolUseContext: Q,
  onDone: B,
  onBack: G
}) {
  let [Z, Y] = BuA.useState(!1), [J, X] = BuA.useState(null), I = () => B("Remote session details dismissed", {
    display: "system"
  });
  iW({
    "confirm:no": I,
    "confirm:yes": I
  }, {
    context: "Confirmation"
  }), J0((E, z) => {
    if (E === " ") B("Remote session details dismissed", {
      display: "system"
    });
    else if (z.leftArrow && G) G();
    else if (E === "t" && !Z) W()
  });
  let D = MQ();
  async function W() {
    Y(!0), X(null);
    try {
      await Yt(A.sessionId)
    } catch (E) {
      X(E instanceof Error ? E.message : String(E)), Y(!1)
    }
  }
  let K = (E) => {
      let z = Math.floor((Date.now() - E) / 1000),
        $ = Math.floor(z / 3600),
        O = Math.floor((z - $ * 3600) / 60),
        L = z - $ * 3600 - O * 60;
      return `${$>0?`${$}h `:""}${O>0||$>0?`${O}m `:""}${L}s`
    },
    V = BuA.useMemo(() => {
      return a7(z59(A.log.slice(-3))).filter((E) => E.type !== "progress")
    }, [A]),
    F = A.title.length > 50 ? A.title.substring(0, 47) + "..." : A.title,
    H = A.status === "pending" ? "starting" : A.status;
  return A8.default.createElement(T, {
    width: "100%",
    flexDirection: "column"
  }, A8.default.createElement(T, {
    width: "100%"
  }, A8.default.createElement(T, {
    borderStyle: "round",
    borderColor: "background",
    flexDirection: "column",
    marginTop: 1,
    paddingLeft: 1,
    paddingRight: 1,
    width: "100%"
  }, A8.default.createElement(T, null, A8.default.createElement(C, {
    color: "background",
    bold: !0
  }, "Remote session details")), A8.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, A8.default.createElement(C, null, A8.default.createElement(C, {
    bold: !0
  }, "Status"), ":", " ", H === "running" || H === "starting" ? A8.default.createElement(C, {
    color: "background"
  }, H) : H === "completed" ? A8.default.createElement(C, {
    color: "success"
  }, H) : A8.default.createElement(C, {
    color: "error"
  }, H)), A8.default.createElement(C, null, A8.default.createElement(C, {
    bold: !0
  }, "Runtime"), ": ", K(A.startTime)), A8.default.createElement(C, {
    wrap: "truncate-end"
  }, A8.default.createElement(C, {
    bold: !0
  }, "Title"), ": ", F), A8.default.createElement(C, null, A8.default.createElement(C, {
    bold: !0
  }, "Progress"), ":", " ", A8.default.createElement(xz1, {
    session: A
  })), A8.default.createElement(C, null, A8.default.createElement(C, {
    bold: !0
  }, "Session URL"), ":", " ", A8.default.createElement(i2, {
    url: lbA(A.sessionId)
  }, A8.default.createElement(C, {
    dimColor: !0
  }, lbA(A.sessionId))))), A.log.length > 0 && A8.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, A8.default.createElement(C, null, A8.default.createElement(C, {
    bold: !0
  }, "Recent messages"), ":"), A8.default.createElement(T, {
    flexDirection: "column",
    height: 10,
    overflowY: "hidden"
  }, V.map((E, z) => A8.default.createElement(PO, {
    key: z,
    message: E,
    messages: V,
    addMargin: z > 0,
    tools: Q.options.tools,
    commands: Q.options.commands,
    verbose: Q.options.verbose,
    erroredToolUseIDs: new Set,
    inProgressToolUseIDs: new Set,
    resolvedToolUseIDs: new Set,
    progressMessagesForMessage: [],
    shouldAnimate: !1,
    shouldShowDot: !1,
    style: "condensed",
    isTranscriptMode: !1,
    isStatic: !0
  }))), A8.default.createElement(T, {
    marginTop: 1
  }, A8.default.createElement(C, {
    dimColor: !0,
    italic: !0
  }, "Showing last ", Math.min(3, A.log.length), " of", " ", A.log.length, " messages"))), J && A8.default.createElement(T, {
    marginTop: 1
  }, A8.default.createElement(C, {
    color: "error"
  }, "Teleport failed: ", J)), Z && A8.default.createElement(T, {
    marginTop: 1
  }, A8.default.createElement(C, {
    color: "background"
  }, "Teleporting to session...")))), A8.default.createElement(T, {
    marginLeft: 2
  }, D.pending ? A8.default.createElement(C, {
    dimColor: !0
  }, "Press ", D.keyName, " again to exit") : A8.default.createElement(C, {
    dimColor: !0
  }, A8.default.createElement(vQ, null, G && A8.default.createElement(F0, {
    shortcut: "←",
    action: "go back"
  }), A8.default.createElement(F0, {
    shortcut: "Esc/Enter/Space",
    action: "close"
  }), !Z && A8.default.createElement(F0, {
    shortcut: "t",
    action: "teleport"
  })))))
}
// @from(Ln 424151, Col 4)
A8
// @from(Ln 424151, Col 8)
BuA
// @from(Ln 424152, Col 4)
U59 = w(() => {
  fA();
  c6();
  E9();
  jK1();
  nj0();
  Jt();
  x6A();
  aj0();
  tQ();
  e9();
  K6();
  A8 = c(QA(), 1), BuA = c(QA(), 1)
})
// @from(Ln 424167, Col 0)
function oj0(A, Q, B = 1000) {
  let G = () => QI(Date.now() - A),
    Z = yz1.useCallback((Y) => {
      if (!Q) return () => {};
      let J = setInterval(Y, B);
      return () => clearInterval(J)
    }, [Q, B]);
  return yz1.useSyncExternalStore(Z, G, G)
}
// @from(Ln 424176, Col 4)
yz1
// @from(Ln 424177, Col 4)
rj0 = w(() => {
  yz1 = c(QA(), 1)
})
// @from(Ln 424181, Col 0)
function rV7(A) {
  switch (A) {
    case "running":
    case "pending":
      return tA.pointer;
    case "completed":
      return tA.tick;
    case "failed":
    case "killed":
      return tA.cross;
    default:
      return tA.bullet
  }
}
// @from(Ln 424196, Col 0)
function sV7(A) {
  switch (A) {
    case "running":
    case "pending":
      return "background";
    case "completed":
      return "success";
    case "failed":
    case "killed":
      return "error";
    default:
      return "background"
  }
}
// @from(Ln 424211, Col 0)
function tV7(A, Q, B) {
  let G = Q.find((Z) => Z.name === A.toolName);
  if (!G) return A.toolName;
  try {
    let Z = G.inputSchema.safeParse(A.input),
      Y = Z.success ? Z.data : {},
      J = G.userFacingName(Y);
    if (!J) return A.toolName;
    let X = G.renderToolUseMessage(Y, {
      theme: B,
      verbose: !1
    });
    if (X) return U5.default.createElement(C, null, J, "(", X, ")");
    return J
  } catch {
    return A.toolName
  }
}
// @from(Ln 424230, Col 0)
function N59({
  agent: A,
  onDone: Q,
  onKillAgent: B,
  onBack: G,
  onForeground: Z
}) {
  let [Y] = a0(), J = Y.todos[A.agentId] ?? [], X = J.filter((z) => z.status === "completed").length, [I] = oB(), D = q59.useMemo(() => F$(oL()), []), W = oj0(A.startTime, A.status === "running");
  iW({
    "confirm:no": Q,
    "confirm:yes": Q
  }, {
    context: "Confirmation"
  }), J0((z, $) => {
    if (z === " ") Q();
    else if ($.leftArrow && G) G();
    else if (z === "k" && A.status === "running" && B) B();
    else if (z === "f" && A.status === "running" && Z) Z()
  });
  let K = MQ(),
    V = Q9(A.prompt, "plan"),
    F = A.prompt.length > 300 ? A.prompt.substring(0, 297) + "…" : A.prompt,
    H = A.result?.totalTokens ?? A.progress?.tokenCount,
    E = A.result?.totalToolUseCount ?? A.progress?.toolUseCount;
  return U5.default.createElement(T, {
    width: "100%",
    flexDirection: "column"
  }, U5.default.createElement(T, {
    width: "100%"
  }, U5.default.createElement(T, {
    borderStyle: "round",
    borderColor: "background",
    flexDirection: "column",
    marginTop: 1,
    paddingLeft: 1,
    paddingRight: 1,
    width: "100%"
  }, U5.default.createElement(T, null, U5.default.createElement(C, {
    color: "background",
    bold: !0
  }, A.selectedAgent?.agentType ?? "agent", " ›", " ", A.description || "Async agent")), U5.default.createElement(T, null, A.status !== "running" && U5.default.createElement(C, {
    color: sV7(A.status)
  }, rV7(A.status), " ", A.status === "completed" ? "Completed" : A.status === "failed" ? "Failed" : "Killed", " · "), U5.default.createElement(C, {
    dimColor: !0
  }, W, H !== void 0 && H > 0 && U5.default.createElement(U5.default.Fragment, null, " · ", X8(H), " tokens"), E !== void 0 && E > 0 && U5.default.createElement(U5.default.Fragment, null, " ", "· ", E, " ", E === 1 ? "tool" : "tools"))), U5.default.createElement(T, {
    flexDirection: "column"
  }, A.status === "running" && A.progress?.recentActivities && A.progress.recentActivities.length > 0 && U5.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, U5.default.createElement(C, {
    bold: !0,
    dimColor: !0
  }, "Progress"), A.progress.recentActivities.map((z, $) => U5.default.createElement(C, {
    key: $,
    dimColor: $ < A.progress.recentActivities.length - 1,
    wrap: "truncate-end"
  }, $ === A.progress.recentActivities.length - 1 ? "› " : "  ", tV7(z, D, I)))), J.length > 0 && U5.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, U5.default.createElement(C, {
    bold: !0,
    dimColor: !0
  }, "Tasks (", X, "/", J.length, ")"), U5.default.createElement(Ns, {
    todos: J
  })), V ? U5.default.createElement(T, {
    marginTop: 1
  }, U5.default.createElement(HD1, {
    addMargin: !1,
    planContent: V
  })) : U5.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, U5.default.createElement(C, {
    bold: !0,
    dimColor: !0
  }, "Prompt"), U5.default.createElement(C, {
    wrap: "wrap"
  }, F)), A.status === "failed" && A.error && U5.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, U5.default.createElement(C, {
    bold: !0,
    color: "error"
  }, "Error"), U5.default.createElement(C, {
    color: "error",
    wrap: "wrap"
  }, A.error))))), U5.default.createElement(T, {
    marginLeft: 2
  }, K.pending ? U5.default.createElement(C, {
    dimColor: !0
  }, "Press ", K.keyName, " again to exit") : U5.default.createElement(C, {
    dimColor: !0
  }, U5.default.createElement(vQ, null, G && U5.default.createElement(F0, {
    shortcut: "←",
    action: "go back"
  }), U5.default.createElement(F0, {
    shortcut: "Esc/Enter/Space",
    action: "close"
  }), A.status === "running" && B && U5.default.createElement(F0, {
    shortcut: "k",
    action: "kill"
  }), A.status === "running" && Z && U5.default.createElement(F0, {
    shortcut: "f",
    action: "foreground"
  })))))
}
// @from(Ln 424336, Col 4)
U5
// @from(Ln 424336, Col 8)
q59
// @from(Ln 424337, Col 4)
w59 = w(() => {
  fA();
  c6();
  E9();
  hB();
  XkA();
  rj0();
  B2();
  az();
  e9();
  K6();
  Cz0();
  tQ();
  U5 = c(QA(), 1), q59 = c(QA(), 1)
})
// @from(Ln 424352, Col 4)
L59
// @from(Ln 424352, Col 9)
eV7
// @from(Ln 424353, Col 4)
O59 = w(() => {
  fA();
  c6();
  E9();
  rj0();
  agA();
  L59 = c(QA(), 1), eV7 = c(QA(), 1)
})
// @from(Ln 424362, Col 0)
function I8A(A) {
  if (A.status !== "running" && A.status !== "pending") return !1;
  if ("isBackgrounded" in A && A.isBackgrounded === !1) return !1;
  return !0
}
// @from(Ln 424368, Col 0)
function G$A({
  status: A,
  label: Q,
  suffix: B
}) {
  return B$A.default.createElement(C, {
    color: A === "completed" ? "success" : A === "failed" || A === "killed" ? "error" : void 0,
    dimColor: !0
  }, "(", Q ?? A, B, ")")
}
// @from(Ln 424379, Col 0)
function M59({
  shell: A
}) {
  switch (A.status) {
    case "completed":
      return B$A.default.createElement(G$A, {
        status: "completed",
        label: "done"
      });
    case "failed":
      return B$A.default.createElement(G$A, {
        status: "failed",
        label: "error"
      });
    case "killed":
      return B$A.default.createElement(G$A, {
        status: "killed"
      });
    case "running":
    case "pending":
      return B$A.default.createElement(G$A, {
        status: "running"
      })
  }
}
// @from(Ln 424404, Col 4)
B$A
// @from(Ln 424405, Col 4)
R59 = w(() => {
  fA();
  B$A = c(QA(), 1)
})
// @from(Ln 424410, Col 0)
function _59({
  task: A
}) {
  switch (A.type) {
    case "local_bash":
      return eO.createElement(C, null, YG(A.command, 40, !0), " ", eO.createElement(M59, {
        shell: A
      }));
    case "remote_agent":
      return eO.createElement(C, null, YG(A.title, 40, !0), " ", eO.createElement(xz1, {
        session: A
      }));
    case "local_agent":
      return eO.createElement(C, null, YG(A.description, 40, !0), " ", eO.createElement(G$A, {
        status: A.status,
        label: A.status === "completed" ? "done" : void 0,
        suffix: A.status === "completed" && !A.notified ? ", unread" : void 0
      }))
  }
}
// @from(Ln 424430, Col 4)
eO
// @from(Ln 424431, Col 4)
j59 = w(() => {
  R59();
  nj0();
  fA();
  eO = c(QA(), 1)
})
// @from(Ln 424438, Col 0)
function AF7(A, Q) {
  return Object.values(A ?? {}).filter(I8A).filter((G) => !(G.type === "local_agent" && G.id === Q))
}
// @from(Ln 424442, Col 0)
function vz1({
  onDone: A,
  onForegroundTask: Q,
  toolUseContext: B
}) {
  let [{
    tasks: G,
    foregroundedTaskId: Z
  }, Y] = a0(), J = G, X = u3.useRef(!1), [I, D] = D8A.useState(() => {
    let S = AF7(J, Z);
    if (S.length === 1) return X.current = !0, {
      mode: "detail",
      itemId: S[0].id
    };
    return {
      mode: "list"
    }
  }), [W, K] = D8A.useState(0);
  k(`[BackgroundTasksDialog] Rendering with ${Object.keys(G).length} tasks: ${JSON.stringify(Object.keys(G))}`);
  let {
    bashTasks: V,
    remoteSessions: F,
    agentTasks: H,
    allSelectableItems: E
  } = D8A.useMemo(() => {
    k(`[BackgroundTasksDialog] useMemo recalculating, tasks: ${JSON.stringify(Object.keys(J??{}))}`);
    let f = [...Object.values(J ?? {}).filter(I8A).map(QF7)].sort((p, GA) => {
        if (p.status === "running" && GA.status !== "running") return -1;
        if (p.status !== "running" && GA.status === "running") return 1;
        return GA.task.startTime - p.task.startTime
      }),
      AA = f.filter((p) => p.type === "local_bash"),
      n = f.filter((p) => p.type === "remote_agent"),
      y = f.filter((p) => p.type === "local_agent" && p.id !== Z);
    return {
      bashTasks: AA,
      remoteSessions: n,
      agentTasks: y,
      allSelectableItems: [...AA, ...n, ...y]
    }
  }, [J, Z]), z = E[W] ?? null;
  iW({
    "confirm:no": () => A("Background tasks dialog dismissed", {
      display: "system"
    }),
    "confirm:previous": () => K((S) => Math.max(0, S - 1)),
    "confirm:next": () => K((S) => Math.min(E.length - 1, S + 1)),
    "confirm:yes": () => {
      let S = E[W];
      if (S) D({
        mode: "detail",
        itemId: S.id
      })
    }
  }, {
    context: "Confirmation",
    isActive: I.mode === "list"
  }), J0((S, u) => {
    if (I.mode !== "list") return;
    let f = E[W];
    if (!f) return;
    if (S === "k") {
      if (f.type === "local_bash" && f.status === "running") O(f.id);
      else if (f.type === "local_agent" && f.status === "running") L(f.id)
    }
    if (S === "f") {
      if (f.type === "local_agent" && f.status === "running" && Q) Q(f.id)
    }
  });
  let $ = MQ();
  async function O(S) {
    await es.kill(S, {
      abortController: B.abortController,
      getAppState: B.getAppState,
      setAppState: Y
    })
  }
  async function L(S) {
    await kZ1.kill(S, {
      abortController: B.abortController,
      getAppState: B.getAppState,
      setAppState: Y
    })
  }
  D8A.useEffect(() => {
    if (I.mode !== "list" && !Object.keys(J ?? {}).includes(I.itemId)) D({
      mode: "list"
    });
    let S = E.length;
    if (W >= S && S > 0) K(S - 1)
  }, [I, J, W, E]);
  let M = () => {
    if (X.current) A("Background tasks dialog dismissed", {
      display: "system"
    });
    else D({
      mode: "list"
    })
  };
  if (I.mode !== "list" && J) {
    let S = J[I.itemId];
    if (!S) return null;
    switch (S.type) {
      case "local_bash":
        return u3.default.createElement(H59, {
          shell: S,
          onDone: A,
          onKillShell: () => void O(S.id),
          onBack: M,
          key: `shell-${S.id}`
        });
      case "local_agent":
        return u3.default.createElement(N59, {
          agent: S,
          onDone: A,
          onKillAgent: () => void L(S.id),
          onBack: M,
          onForeground: Q ? () => Q(S.id) : void 0,
          key: `agent-${S.id}`
        });
      case "remote_agent":
        return u3.default.createElement(C59, {
          session: S,
          onDone: A,
          toolUseContext: B,
          onBack: M,
          key: `session-${S.id}`
        });
      default:
        return null
    }
  }
  let _ = V.filter((S) => S.status === "running").length,
    j = F.filter((S) => S.status === "running" || S.status === "pending").length + H.filter((S) => S.status === "running").length,
    x = rN([..._ > 0 ? [u3.default.createElement(C, {
      key: "shells"
    }, _, " ", _ !== 1 ? "active shells" : "active shell")] : [], ...j > 0 ? [u3.default.createElement(C, {
      key: "agents"
    }, j, " ", j !== 1 ? "active agents" : "active agent")] : []], (S) => u3.default.createElement(C, {
      key: `separator-${S}`
    }, " · ")),
    b = [u3.default.createElement(F0, {
      key: "upDown",
      shortcut: "↑/↓",
      action: "select"
    }), u3.default.createElement(F0, {
      key: "enter",
      shortcut: "Enter",
      action: "view"
    }), ...[], ...z?.type === "local_agent" && z.status === "running" && Q ? [u3.default.createElement(F0, {
      key: "foreground",
      shortcut: "f",
      action: "foreground"
    })] : [], ...(z?.type === "local_bash" || z?.type === "local_agent") && z.status === "running" ? [u3.default.createElement(F0, {
      key: "kill",
      shortcut: "k",
      action: "kill"
    })] : [], u3.default.createElement(F0, {
      key: "esc",
      shortcut: "Esc",
      action: "close"
    })];
  return u3.default.createElement(T, {
    width: "100%",
    flexDirection: "column"
  }, u3.default.createElement(T, {
    borderStyle: "round",
    borderColor: "background",
    flexDirection: "column",
    marginTop: 1,
    paddingLeft: 1,
    paddingRight: 1,
    width: "100%"
  }, u3.default.createElement(C, {
    color: "background",
    bold: !0
  }, "Background tasks"), u3.default.createElement(C, {
    dimColor: !0
  }, x), E.length === 0 ? u3.default.createElement(C, {
    dimColor: !0
  }, "No tasks currently running") : u3.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, V.length > 0 && u3.default.createElement(T, {
    flexDirection: "column"
  }, (F.length > 0 || H.length > 0) && u3.default.createElement(C, {
    dimColor: !0
  }, u3.default.createElement(C, {
    bold: !0
  }, "  ", "Bashes"), " (", V.length, ")"), u3.default.createElement(T, {
    flexDirection: "column"
  }, V.map((S, u) => u3.default.createElement(sj0, {
    key: S.id,
    item: S,
    isSelected: u === W
  })))), F.length > 0 && u3.default.createElement(T, {
    flexDirection: "column",
    marginTop: V.length > 0 ? 1 : 0
  }, u3.default.createElement(C, {
    dimColor: !0
  }, u3.default.createElement(C, {
    bold: !0
  }, "  ", "Remote agents"), " (", F.length, ")"), u3.default.createElement(T, {
    flexDirection: "column"
  }, F.map((S, u) => u3.default.createElement(sj0, {
    key: S.id,
    item: S,
    isSelected: V.length + u === W
  })))), H.length > 0 && u3.default.createElement(T, {
    flexDirection: "column",
    marginTop: V.length > 0 || F.length > 0 ? 1 : 0
  }, u3.default.createElement(C, {
    dimColor: !0
  }, u3.default.createElement(C, {
    bold: !0
  }, "  ", "Local agents"), " (", H.length, ")"), u3.default.createElement(T, {
    flexDirection: "column"
  }, H.map((S, u) => u3.default.createElement(sj0, {
    key: S.id,
    item: S,
    isSelected: V.length + F.length + u === W
  })))))), u3.default.createElement(T, {
    marginLeft: 2
  }, $.pending ? u3.default.createElement(C, {
    dimColor: !0
  }, "Press ", $.keyName, " again to exit") : u3.default.createElement(C, {
    dimColor: !0
  }, u3.default.createElement(vQ, null, b))))
}
// @from(Ln 424672, Col 0)
function QF7(A) {
  switch (A.type) {
    case "local_bash":
      return {
        id: A.id, type: "local_bash", label: A.command, status: A.status, task: A
      };
    case "remote_agent":
      return {
        id: A.id, type: "remote_agent", label: A.title, status: A.status, task: A
      };
    case "local_agent":
      return {
        id: A.id, type: "local_agent", label: A.description, status: A.status, task: A
      }
  }
}
// @from(Ln 424689, Col 0)
function sj0({
  item: A,
  isSelected: Q
}) {
  return u3.default.createElement(T, {
    flexDirection: "row",
    gap: 1
  }, u3.default.createElement(C, {
    color: Q ? "suggestion" : void 0
  }, Q ? tA.pointer + " " : "  ", u3.default.createElement(_59, {
    task: A.task
  })))
}
// @from(Ln 424702, Col 4)
u3
// @from(Ln 424702, Col 8)
D8A
// @from(Ln 424703, Col 4)
tj0 = w(() => {
  fA();
  c6();
  B2();
  E9();
  E59();
  U59();
  w59();
  O59();
  hB();
  v6A();
  YyA();
  j59();
  az();
  e9();
  K6();
  T1();
  u3 = c(QA(), 1), D8A = c(QA(), 1)
})
// @from(Ln 424722, Col 4)
ej0
// @from(Ln 424722, Col 9)
BF7
// @from(Ln 424722, Col 14)
T59
// @from(Ln 424723, Col 4)
P59 = w(() => {
  tj0();
  ej0 = c(QA(), 1), BF7 = {
    type: "local-jsx",
    name: "tasks",
    aliases: ["bashes"],
    description: "List and manage background tasks",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, Q) {
      return ej0.createElement(vz1, {
        toolUseContext: Q,
        onDone: A,
        onForegroundTask: Q.onForegroundTask
      })
    },
    userFacingName() {
      return "tasks"
    }
  }, T59 = BF7
})
// @from(Ln 424744, Col 4)
S59 = () => {}
// @from(Ln 424746, Col 0)
function x59() {
  let A = q0(),
    Q = Cb(A);
  if (Q.length === 0) return bx.default.createElement(C, null, "No todos currently tracked");
  return bx.default.createElement(T, {
    flexDirection: "column"
  }, bx.default.createElement(C, null, bx.default.createElement(C, {
    bold: !0
  }, Q.length, " ", Q.length === 1 ? "todo" : "todos"), bx.default.createElement(C, null, ":")), bx.default.createElement(T, {
    marginTop: 1
  }, bx.default.createElement(Ns, {
    todos: Q
  })))
}
// @from(Ln 424760, Col 4)
bx
// @from(Ln 424760, Col 8)
GF7
// @from(Ln 424760, Col 13)
y59
// @from(Ln 424761, Col 4)
v59 = w(() => {
  Dd();
  C0();
  fA();
  WgA();
  XkA();
  bx = c(QA(), 1);
  GF7 = {
    type: "local-jsx",
    name: "todos",
    description: "List current todo items",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, {
      options: {
        isNonInteractiveSession: Q
      }
    }) {
      if (Q) {
        let B = await xzA(bx.default.createElement(x59, null));
        return A(B), null
      }
      return bx.default.createElement(yzA, {
        onComplete: A
      }, bx.default.createElement(x59, null))
    },
    userFacingName() {
      return "todos"
    }
  }, y59 = GF7
})
// @from(Ln 424792, Col 4)
ZF7 = `---
allowed-tools: Bash(git diff:*), Bash(git status:*), Bash(git log:*), Bash(git show:*), Bash(git remote show:*), Read, Glob, Grep, LS, Task
description: Complete a security review of the pending changes on the current branch
---

You are a senior security engineer conducting a focused security review of the changes on this branch.

GIT STATUS:

\`\`\`
!\`git status\`
\`\`\`

FILES MODIFIED:

\`\`\`
!\`git diff --name-only origin/HEAD...\`
\`\`\`

COMMITS:

\`\`\`
!\`git log --no-decorate origin/HEAD...\`
\`\`\`

DIFF CONTENT:

\`\`\`
!\`git diff --merge-base origin/HEAD\`
\`\`\`

Review the complete diff above. This contains all code changes in the PR.


OBJECTIVE:
Perform a security-focused code review to identify HIGH-CONFIDENCE security vulnerabilities that could have real exploitation potential. This is not a general code review - focus ONLY on security implications newly added by this PR. Do not comment on existing security concerns.

CRITICAL INSTRUCTIONS:
1. MINIMIZE FALSE POSITIVES: Only flag issues where you're >80% confident of actual exploitability
2. AVOID NOISE: Skip theoretical issues, style concerns, or low-impact findings
3. FOCUS ON IMPACT: Prioritize vulnerabilities that could lead to unauthorized access, data breaches, or system compromise
4. EXCLUSIONS: Do NOT report the following issue types:
   - Denial of Service (DOS) vulnerabilities, even if they allow service disruption
   - Secrets or sensitive data stored on disk (these are handled by other processes)
   - Rate limiting or resource exhaustion issues

SECURITY CATEGORIES TO EXAMINE:

**Input Validation Vulnerabilities:**
- SQL injection via unsanitized user input
- Command injection in system calls or subprocesses
- XXE injection in XML parsing
- Template injection in templating engines
- NoSQL injection in database queries
- Path traversal in file operations

**Authentication & Authorization Issues:**
- Authentication bypass logic
- Privilege escalation paths
- Session management flaws
- JWT token vulnerabilities
- Authorization logic bypasses

**Crypto & Secrets Management:**
- Hardcoded API keys, passwords, or tokens
- Weak cryptographic algorithms or implementations
- Improper key storage or management
- Cryptographic randomness issues
- Certificate validation bypasses

**Injection & Code Execution:**
- Remote code execution via deseralization
- Pickle injection in Python
- YAML deserialization vulnerabilities
- Eval injection in dynamic code execution
- XSS vulnerabilities in web applications (reflected, stored, DOM-based)

**Data Exposure:**
- Sensitive data logging or storage
- PII handling violations
- API endpoint data leakage
- Debug information exposure

Additional notes:
- Even if something is only exploitable from the local network, it can still be a HIGH severity issue

ANALYSIS METHODOLOGY:

Phase 1 - Repository Context Research (Use file search tools):
- Identify existing security frameworks and libraries in use
- Look for established secure coding patterns in the codebase
- Examine existing sanitization and validation patterns
- Understand the project's security model and threat model

Phase 2 - Comparative Analysis:
- Compare new code changes against existing security patterns
- Identify deviations from established secure practices
- Look for inconsistent security implementations
- Flag code that introduces new attack surfaces

Phase 3 - Vulnerability Assessment:
- Examine each modified file for security implications
- Trace data flow from user inputs to sensitive operations
- Look for privilege boundaries being crossed unsafely
- Identify injection points and unsafe deserialization

REQUIRED OUTPUT FORMAT:

You MUST output your findings in markdown. The markdown output should contain the file, line number, severity, category (e.g. \`sql_injection\` or \`xss\`), description, exploit scenario, and fix recommendation.

For example:

# Vuln 1: XSS: \`foo.py:42\`

* Severity: High
* Description: User input from \`username\` parameter is directly interpolated into HTML without escaping, allowing reflected XSS attacks
* Exploit Scenario: Attacker crafts URL like /bar?q=<script>alert(document.cookie)</script> to execute JavaScript in victim's browser, enabling session hijacking or data theft
* Recommendation: Use Flask's escape() function or Jinja2 templates with auto-escaping enabled for all user inputs rendered in HTML

SEVERITY GUIDELINES:
- **HIGH**: Directly exploitable vulnerabilities leading to RCE, data breach, or authentication bypass
- **MEDIUM**: Vulnerabilities requiring specific conditions but with significant impact
- **LOW**: Defense-in-depth issues or lower-impact vulnerabilities

CONFIDENCE SCORING:
- 0.9-1.0: Certain exploit path identified, tested if possible
- 0.8-0.9: Clear vulnerability pattern with known exploitation methods
- 0.7-0.8: Suspicious pattern requiring specific conditions to exploit
- Below 0.7: Don't report (too speculative)

FINAL REMINDER:
Focus on HIGH and MEDIUM findings only. Better to miss some theoretical issues than flood the report with false positives. Each finding should be something a security engineer would confidently raise in a PR review.

FALSE POSITIVE FILTERING:

> You do not need to run commands to reproduce the vulnerability, just read the code to determine if it is a real vulnerability. Do not use the bash tool or write to any files.
>
> HARD EXCLUSIONS - Automatically exclude findings matching these patterns:
> 1. Denial of Service (DOS) vulnerabilities or resource exhaustion attacks.
> 2. Secrets or credentials stored on disk if they are otherwise secured.
> 3. Rate limiting concerns or service overload scenarios.
> 4. Memory consumption or CPU exhaustion issues.
> 5. Lack of input validation on non-security-critical fields without proven security impact.
> 6. Input sanitization concerns for GitHub Action workflows unless they are clearly triggerable via untrusted input.
> 7. A lack of hardening measures. Code is not expected to implement all security best practices, only flag concrete vulnerabilities.
> 8. Race conditions or timing attacks that are theoretical rather than practical issues. Only report a race condition if it is concretely problematic.
> 9. Vulnerabilities related to outdated third-party libraries. These are managed separately and should not be reported here.
> 10. Memory safety issues such as buffer overflows or use-after-free-vulnerabilities are impossible in rust. Do not report memory safety issues in rust or any other memory safe languages.
> 11. Files that are only unit tests or only used as part of running tests.
> 12. Log spoofing concerns. Outputting un-sanitized user input to logs is not a vulnerability.
> 13. SSRF vulnerabilities that only control the path. SSRF is only a concern if it can control the host or protocol.
> 14. Including user-controlled content in AI system prompts is not a vulnerability.
> 15. Regex injection. Injecting untrusted content into a regex is not a vulnerability.
> 16. Regex DOS concerns.
> 16. Insecure documentation. Do not report any findings in documentation files such as markdown files.
> 17. A lack of audit logs is not a vulnerability.
>
> PRECEDENTS -
> 1. Logging high value secrets in plaintext is a vulnerability. Logging URLs is assumed to be safe.
> 2. UUIDs can be assumed to be unguessable and do not need to be validated.
> 3. Environment variables and CLI flags are trusted values. Attackers are generally not able to modify them in a secure environment. Any attack that relies on controlling an environment variable is invalid.
> 4. Resource management issues such as memory or file descriptor leaks are not valid.
> 5. Subtle or low impact web vulnerabilities such as tabnabbing, XS-Leaks, prototype pollution, and open redirects should not be reported unless they are extremely high confidence.
> 6. React and Angular are generally secure against XSS. These frameworks do not need to sanitize or escape user input unless it is using dangerouslySetInnerHTML, bypassSecurityTrustHtml, or similar methods. Do not report XSS vulnerabilities in React or Angular components or tsx files unless they are using unsafe methods.
> 7. Most vulnerabilities in github action workflows are not exploitable in practice. Before validating a github action workflow vulnerability ensure it is concrete and has a very specific attack path.
> 8. A lack of permission checking or authentication in client-side JS/TS code is not a vulnerability. Client-side code is not trusted and does not need to implement these checks, they are handled on the server-side. The same applies to all flows that send untrusted data to the backend, the backend is responsible for validating and sanitizing all inputs.
> 9. Only include MEDIUM findings if they are obvious and concrete issues.
> 10. Most vulnerabilities in ipython notebooks (*.ipynb files) are not exploitable in practice. Before validating a notebook vulnerability ensure it is concrete and has a very specific attack path where untrusted input can trigger the vulnerability.
> 11. Logging non-PII data is not a vulnerability even if the data may be sensitive. Only report logging vulnerabilities if they expose sensitive information such as secrets, passwords, or personally identifiable information (PII).
> 12. Command injection vulnerabilities in shell scripts are generally not exploitable in practice since shell scripts generally do not run with untrusted user input. Only report command injection vulnerabilities in shell scripts if they are concrete and have a very specific attack path for untrusted input.
>
> SIGNAL QUALITY CRITERIA - For remaining findings, assess:
> 1. Is there a concrete, exploitable vulnerability with a clear attack path?
> 2. Does this represent a real security risk vs theoretical best practice?
> 3. Are there specific code locations and reproduction steps?
> 4. Would this finding be actionable for a security team?
>
> For each finding, assign a confidence score from 1-10:
> - 1-3: Low confidence, likely false positive or noise
> - 4-6: Medium confidence, needs investigation
> - 7-10: High confidence, likely true vulnerability

START ANALYSIS:

Begin your analysis now. Do this in 3 steps:

1. Use a sub-task to identify vulnerabilities. Use the repository exploration tools to understand the codebase context, then analyze the PR changes for security implications. In the prompt for this sub-task, include all of the above.
2. Then for each vulnerability identified by the above sub-task, create a new sub-task to filter out false-positives. Launch these sub-tasks as parallel sub-tasks. In the prompt for these sub-tasks, include everything in the "FALSE POSITIVE FILTERING" instructions.
3. Filter out any vulnerabilities where the sub-task reported a confidence less than 8.

Your final reply must contain the markdown report and nothing else.`
// @from(Ln 424983, Col 2)
k59
// @from(Ln 424984, Col 4)
b59 = w(() => {
  VEA();
  Da();
  kd();
  JZ();
  k59 = tzA({
    name: "security-review",
    description: "Complete a security review of the pending changes on the current branch",
    progressMessage: "analyzing code changes for security risks",
    pluginName: "security-review",
    pluginCommand: "security-review",
    async getPromptWhileMarketplaceIsPrivate(A, Q) {
      T9("security-review");
      let B = lK(ZF7),
        G = RS(B.frontmatter["allowed-tools"]);
      return [{
        type: "text",
        text: await Ct(B.content, {
          ...Q,
          async getAppState() {
            let Y = await Q.getAppState();
            return {
              ...Y,
              toolPermissionContext: {
                ...Y.toolPermissionContext,
                alwaysAllowRules: {
                  ...Y.toolPermissionContext.alwaysAllowRules,
                  command: G
                }
              }
            }
          }
        }, "security-review")
      }]
    }
  })
})
// @from(Ln 425021, Col 4)
AT0
// @from(Ln 425021, Col 9)
f59
// @from(Ln 425022, Col 4)
h59 = w(() => {
  ME1();
  AT0 = c(QA(), 1), f59 = {
    type: "local-jsx",
    name: "usage",
    description: "Show plan usage limits",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, Q) {
      return AT0.createElement(SzA, {
        onClose: A,
        context: Q,
        defaultTab: "Usage"
      })
    },
    userFacingName() {
      return "usage"
    }
  }
})
// @from(Ln 425043, Col 0)
function JF7({
  onDone: A
}) {
  let [Q, B] = oB();
  return $p.createElement(T, {
    flexDirection: "column"
  }, $p.createElement(K8, {
    dividerColor: "permission",
    dividerDimColor: !0
  }), $p.createElement(_zA, {
    initialTheme: Q,
    onThemeSelect: (G) => {
      B(G), A(`Theme set to ${G}`)
    },
    onCancel: () => {
      A("Theme picker dismissed", {
        display: "system"
      })
    },
    skipExitHandling: !0
  }))
}
// @from(Ln 425065, Col 4)
$p
// @from(Ln 425065, Col 8)
YF7
// @from(Ln 425065, Col 13)
g59
// @from(Ln 425066, Col 4)
u59 = w(() => {
  fA();
  NE1();
  lD();
  $p = c(QA(), 1), YF7 = {
    type: "local-jsx",
    name: "theme",
    description: "Change the theme",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, Q) {
      return $p.createElement(JF7, {
        onDone: A
      })
    },
    userFacingName() {
      return "theme"
    }
  };
  g59 = YF7
})
// @from(Ln 425088, Col 0)
function XF7() {
  T9("vim-mode");
  let Q = L1().editorMode || "normal";
  if (Q === "emacs") Q = "normal";
  let B = Q === "normal" ? "vim" : "normal";
  return S0((G) => ({
    ...G,
    editorMode: B
  })), l("tengu_editor_mode_changed", {
    mode: B,
    source: "command"
  }), Promise.resolve({
    type: "text",
    value: `Editor mode set to ${B}. ${B==="vim"?"Use Escape key to toggle between INSERT and NORMAL modes.":"Using standard (readline) keyboard bindings."}`
  })
}
// @from(Ln 425104, Col 4)
IF7
// @from(Ln 425104, Col 9)
m59
// @from(Ln 425105, Col 4)
d59 = w(() => {
  GQ();
  Z0();
  JZ();
  IF7 = {
    name: "vim",
    description: "Toggle between Vim and Normal editing modes",
    isEnabled: () => !0,
    isHidden: !1,
    supportsNonInteractive: !1,
    type: "local",
    userFacingName: () => "vim",
    call: XF7
  }, m59 = IF7
})
// @from(Ln 425120, Col 4)
QT0
// @from(Ln 425120, Col 9)
W8A = "claude-plugins-official"
// @from(Ln 425121, Col 4)
kz1 = w(() => {
  QT0 = {
    source: "github",
    repo: "anthropics/claude-plugins-official"
  }
})
// @from(Ln 425137, Col 0)
function c59() {
  return W8A
}
// @from(Ln 425141, Col 0)
function KF7() {
  return WF7
}
// @from(Ln 425145, Col 0)
function p59() {
  return `thinkback@${c59()}`
}
// @from(Ln 425148, Col 0)
async function FF7() {
  let {
    enabled: A
  } = await DG(), Q = A.find((G) => G.name === "thinkback" || G.source && G.source.includes(p59()));
  if (!Q) return null;
  let B = GuA(Q.path, "skills", VF7);
  if (ZuA(B)) return B;
  return null
}
// @from(Ln 425157, Col 0)
async function HF7() {
  return FF7()
}
// @from(Ln 425161, Col 0)
function BT0(A) {
  let Q = GuA(A, "player.js");
  if (!ZuA(Q)) return {
    success: !1,
    message: "Player script not found. The player.js file is missing from the thinkback skill."
  };
  let B = _k.get(process.stdout);
  if (!B) return {
    success: !1,
    message: "Failed to access terminal instance"
  };
  try {
    B.pause(), B.suspendStdin(), process.stdout.write("\x1B[?1049h\x1B[?1004l\x1B[0m\x1B[?25l\x1B[2J\x1B[H"), DF7("node", [Q], {
      stdio: "inherit",
      cwd: A
    })
  } catch {} finally {
    process.stdout.write("\x1B[?1049l\x1B[?1004h\x1B[?25l"), B.resumeStdin(), B.resume()
  }
  let G = GuA(A, "year_in_review.html");
  if (ZuA(G)) {
    let Z = $Q();
    TQ(Z === "macos" ? "open" : Z === "windows" ? "start" : "xdg-open", [G])
  }
  return {
    success: !0,
    message: "Year in review animation complete!"
  }
}
// @from(Ln 425191, Col 0)
function EF7({
  onReady: A,
  onError: Q
}) {
  let [B, G] = Ew.useState({
    phase: "checking"
  }), [Z, Y] = Ew.useState("");
  if (Ew.useEffect(() => {
      async function X() {
        try {
          let I = await D5(),
            D = c59(),
            W = KF7(),
            K = p59(),
            V = D in I,
            F = tC(K);
          if (!V) G({
            phase: "installing-marketplace"
          }), k(`Installing marketplace ${W}`), await NS({
            source: "github",
            repo: W
          }, (H) => {
            Y(H)
          }), NY(), k(`Marketplace ${D} installed`);
          else if (!F) G({
            phase: "installing-marketplace"
          }), Y("Updating marketplace…"), k(`Refreshing marketplace ${D}`), await Rr(D, (H) => {
            Y(H)
          }), RZ1(), NY(), k(`Marketplace ${D} refreshed`);
          if (!F) {
            G({
              phase: "installing-plugin"
            }), k(`Installing plugin ${K}`);
            let H = await B49([K]);
            if (H.failed.length > 0) {
              let E = H.failed.map((z) => `${z.name}: ${z.error}`).join(", ");
              throw Error(`Failed to install plugin: ${E}`)
            }
            NY(), k(`Plugin ${K} installed`)
          } else {
            let {
              disabled: H
            } = await DG();
            if (H.some((z) => z.name === "thinkback" || z.source?.includes(K))) {
              G({
                phase: "enabling-plugin"
              }), k(`Enabling plugin ${K}`);
              let z = await e3A(K);
              if (!z.success) throw Error(`Failed to enable plugin: ${z.message}`);
              NY(), k(`Plugin ${K} enabled`)
            }
          }
          G({
            phase: "ready"
          }), A()
        } catch (I) {
          let D = I instanceof Error ? I : Error(String(I));
          e(D), G({
            phase: "error",
            message: D.message
          }), Q(D.message)
        }
      }
      X()
    }, [A, Q]), B.phase === "error") return _3.createElement(T, {
    flexDirection: "column"
  }, _3.createElement(C, {
    color: "error"
  }, "Error: ", B.message));
  if (B.phase === "ready") return null;
  let J = B.phase === "checking" ? "Checking thinkback installation…" : B.phase === "installing-marketplace" ? "Installing marketplace…" : B.phase === "enabling-plugin" ? "Enabling thinkback plugin…" : "Installing thinkback plugin…";
  return _3.createElement(T, {
    flexDirection: "column"
  }, _3.createElement(T, null, _3.createElement(W9, null), _3.createElement(C, null, Z || J)))
}
// @from(Ln 425267, Col 0)
function zF7({
  onDone: A,
  onAction: Q,
  skillDir: B
}) {
  let [G, Z] = Ew.useState(!1), Y = GuA(B, "year_in_review.js"), J = ZuA(Y), X = J ? [{
    label: "Play animation",
    value: "play",
    description: "Watch your year in review"
  }, {
    label: "Edit content",
    value: "edit",
    description: "Modify the animation"
  }, {
    label: "Fix errors",
    value: "fix",
    description: "Fix validation or rendering issues"
  }, {
    label: "Regenerate",
    value: "regenerate",
    description: "Create a new animation from scratch"
  }] : [{
    label: "Let's go!",
    value: "regenerate",
    description: "Generate your personalized animation"
  }];

  function I(W) {
    if (Z(!0), W === "play") BT0(B), A(void 0, {
      display: "skip"
    });
    else Q(W)
  }

  function D() {
    A(void 0, {
      display: "skip"
    })
  }
  if (G) return null;
  return _3.createElement(o9, {
    title: "Think Back on 2025 with Claude Code",
    subtitle: "Generate your 2025 Claude Code Think Back (takes a few minutes to run)",
    onCancel: D,
    color: "claude",
    borderDimColor: !1
  }, _3.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, !J && _3.createElement(T, {
    flexDirection: "column"
  }, _3.createElement(C, null, "Relive your year of coding with Claude."), _3.createElement(C, {
    dimColor: !0
  }, "We'll create a personalized ASCII animation celebrating your journey.")), _3.createElement(k0, {
    options: X,
    onChange: I,
    visibleOptionCount: 5
  })))
}
// @from(Ln 425327, Col 0)
function qF7({
  onDone: A
}) {
  let [Q, B] = Ew.useState(!1), [G, Z] = Ew.useState(null), [Y, J] = Ew.useState(null), [X, I] = Ew.useState(null);

  function D() {
    B(!0)
  }
  let W = Ew.useCallback((V) => {
    Z(V), A(`Error with thinkback: ${V}. Try running /plugin to manually install the think-back plugin.`, {
      display: "system"
    })
  }, [A]);
  Ew.useEffect(() => {
    if (Q && !Y && !G) HF7().then((V) => {
      if (V) k(`Thinkback skill directory: ${V}`), J(V);
      else W("Could not find thinkback skill directory")
    })
  }, [Q, Y, G, W]), Ew.useEffect(() => {
    if (!Y) return;
    let V = GuA(Y, "year_in_review.js"),
      F = ZuA(V);
    k(`Checking for ${V}: ${F?"found":"not found"}`), I(F)
  }, [Y]);

  function K(V) {
    A({
      edit: $F7,
      fix: CF7,
      regenerate: UF7
    } [V], {
      display: "user",
      shouldQuery: !0
    })
  }
  if (G) return _3.createElement(T, {
    flexDirection: "column"
  }, _3.createElement(C, {
    color: "error"
  }, "Error: ", G), _3.createElement(C, {
    dimColor: !0
  }, "Try running /plugin to manually install the think-back plugin."));
  if (!Q) return _3.createElement(EF7, {
    onReady: D,
    onError: W
  });
  if (!Y || X === null) return _3.createElement(T, null, _3.createElement(W9, null), _3.createElement(C, null, "Loading thinkback skill…"));
  return _3.createElement(zF7, {
    onDone: A,
    onAction: K,
    skillDir: Y
  })
}
// @from(Ln 425380, Col 4)
_3
// @from(Ln 425380, Col 8)
Ew
// @from(Ln 425380, Col 12)
WF7 = "anthropics/claude-plugins-official"
// @from(Ln 425381, Col 2)
VF7 = "thinkback"
// @from(Ln 425382, Col 2)
$F7 = 'Use the Skill tool to invoke the "thinkback" skill with mode=edit to modify my existing Claude Code year in review animation. Ask me what I want to change. When the animation is ready, tell the user to run /think-back again to play it.'
// @from(Ln 425383, Col 2)
CF7 = 'Use the Skill tool to invoke the "thinkback" skill with mode=fix to fix validation or rendering errors in my existing Claude Code year in review animation. Run the validator, identify errors, and fix them. When the animation is ready, tell the user to run /think-back again to play it.'
// @from(Ln 425384, Col 2)
UF7 = 'Use the Skill tool to invoke the "thinkback" skill with mode=regenerate to create a completely new Claude Code year in review animation from scratch. Delete the existing animation and start fresh. When the animation is ready, tell the user to run /think-back again to play it.'
// @from(Ln 425385, Col 2)
NF7
// @from(Ln 425385, Col 7)
l59
// @from(Ln 425386, Col 4)
GT0 = w(() => {
  w6();
  fA();
  rY();
  m_A();
  c3();
  t4();
  W8();
  HI();
  PN();
  $_0();
  GK();
  pzA();
  Lx();
  yG();
  T1();
  v1();
  kz1();
  _3 = c(QA(), 1), Ew = c(QA(), 1);
  NF7 = {
    type: "local-jsx",
    name: "think-back",
    description: "Your 2025 Claude Code Year in Review",
    isEnabled: () => f8("tengu_thinkback"),
    isHidden: !1,
    async call(A) {
      return _3.createElement(qF7, {
        onDone: A
      })
    },
    userFacingName() {
      return "think-back"
    }
  }, l59 = NF7
})
// @from(Ln 425428, Col 0)
function OF7() {
  return `thinkback@${W8A}`
}
// @from(Ln 425431, Col 4)
LF7 = "thinkback"
// @from(Ln 425432, Col 2)
MF7
// @from(Ln 425432, Col 7)
n59
// @from(Ln 425433, Col 4)
a59 = w(() => {
  w6();
  GT0();
  PN();
  kz1();
  MF7 = {
    type: "local",
    name: "thinkback-play",
    description: "Play the thinkback animation",
    isEnabled: () => f8("tengu_thinkback"),
    isHidden: !0,
    supportsNonInteractive: !1,
    async call() {
      let A = f_(),
        Q = OF7(),
        B = A.plugins[Q];
      if (!B || B.length === 0) return {
        type: "text",
        value: "Thinkback plugin not installed. Run /think-back first to install it."
      };
      let G = B[0];
      if (!G?.installPath) return {
        type: "text",
        value: "Thinkback plugin installation path not found."
      };
      let Z = i59(G.installPath, "skills", LF7),
        Y = i59(Z, "year_in_review.js");
      if (!wF7(Y)) return {
        type: "text",
        value: "No animation found. Run /think-back first to generate one."
      };
      return {
        type: "text",
        value: BT0(Z).message
      }
    },
    userFacingName() {
      return "thinkback-play"
    }
  }, n59 = MF7
})
// @from(Ln 425474, Col 4)
ZT0
// @from(Ln 425474, Col 9)
RF7
// @from(Ln 425474, Col 14)
o59
// @from(Ln 425475, Col 4)
r59 = w(() => {
  pM0();
  ZT0 = c(QA(), 1), RF7 = {
    type: "local-jsx",
    name: "permissions",
    aliases: ["allowed-tools"],
    description: "Manage allow & deny tool permission rules",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A) {
      return ZT0.createElement(rH1, {
        onExit: A
      })
    },
    userFacingName() {
      return "permissions"
    }
  }, o59 = RF7
})
// @from(Ln 425495, Col 0)
function _F7({
  planContent: A,
  planPath: Q,
  editorName: B
}) {
  return UI.createElement(T, {
    flexDirection: "column"
  }, UI.createElement(C, {
    bold: !0
  }, "Current Plan"), UI.createElement(C, {
    dimColor: !0
  }, Q), UI.createElement(T, {
    marginTop: 1
  }, UI.createElement(C, null, A)), B && UI.createElement(T, {
    marginTop: 1
  }, UI.createElement(C, {
    dimColor: !0
  }, '"/plan open"'), UI.createElement(C, {
    dimColor: !0
  }, " to edit this plan in "), UI.createElement(C, {
    bold: !0,
    dimColor: !0
  }, B)))
}
// @from(Ln 425519, Col 4)
UI
// @from(Ln 425519, Col 8)
jF7
// @from(Ln 425519, Col 13)
s59
// @from(Ln 425520, Col 4)
t59 = w(() => {
  fA();
  UF();
  Kp();
  TX();
  WgA();
  dW();
  C0();
  UI = c(QA(), 1);
  jF7 = {
    type: "local-jsx",
    name: "plan",
    description: "Enable plan mode or view the current session plan",
    argumentHint: "[open]",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, Q, B) {
      let {
        options: {
          isNonInteractiveSession: G
        },
        getAppState: Z,
        setAppState: Y
      } = Q, X = (await Z()).toolPermissionContext.mode;
      if (X !== "plan") return Ty(X, "plan"), Y((H) => ({
        ...H,
        toolPermissionContext: UJ(H.toolPermissionContext, {
          type: "setMode",
          mode: "plan",
          destination: "session"
        })
      })), A("Enabled plan mode"), null;
      let I = AK(),
        D = dC();
      if (!I) return A("Already in plan mode. No plan written yet."), null;
      if (B.trim().split(/\s+/)[0] === "open") try {
        return await tf(D), A(`Opened plan in editor: ${D}`), null
      } catch (H) {
        return A(`Failed to open plan in editor: ${H}`), null
      }
      let K = Wp(),
        V = K ? EK(K) : void 0,
        F = UI.createElement(_F7, {
          planContent: I,
          planPath: D,
          editorName: V
        });
      if (G) {
        let H = await xzA(F);
        return A(H), null
      }
      return UI.createElement(yzA, {
        onComplete: A
      }, F)
    },
    userFacingName() {
      return "plan"
    }
  }, s59 = jF7
})
// @from(Ln 425581, Col 0)
function e59({
  onDone: A
}) {
  let [Q, B] = K8A.useState(!0), [G, Z] = K8A.useState([]), [Y, J] = K8A.useState(!1), [X, I] = K8A.useState(null), D = MQ(() => A("Guest passes dialog dismissed", {
    display: "system"
  }));
  if (J0((F, H) => {
      if (H.escape) A("Guest passes dialog dismissed", {
        display: "system"
      });
      if (H.return && X)(async () => {
        if (await Gp(X)) l("tengu_guest_passes_link_copied", {}), A("Referral link copied to clipboard!");
        else A(AgA(), {
          display: "system"
        })
      })()
    }), K8A.useEffect(() => {
      async function F() {
        try {
          let H = await cgA();
          if (!H || !H.eligible) {
            J(!1), B(!1);
            return
          }
          if (J(!0), H.referral_code_details?.referral_link) I(H.referral_code_details.referral_link);
          let E;
          try {
            E = await M89()
          } catch (L) {
            e(L), J(!1), B(!1);
            return
          }
          let z = E.redemptions || [],
            $ = E.limit || 3,
            O = [];
          for (let L = 0; L < $; L++) {
            let M = z[L];
            O.push({
              passNumber: L + 1,
              isAvailable: !M
            })
          }
          Z(O), B(!1)
        } catch (H) {
          e(H), J(!1), B(!1)
        }
      }
      F()
    }, []), Q) return U2.createElement(T, {
    flexDirection: "column",
    marginTop: 1,
    gap: 1
  }, U2.createElement(C, {
    dimColor: !0
  }, "Loading guest pass information…"), U2.createElement(C, {
    dimColor: !0,
    italic: !0
  }, D.pending ? U2.createElement(U2.Fragment, null, "Press ", D.keyName, " again to exit") : U2.createElement(U2.Fragment, null, "Esc to cancel")));
  if (!Y) return U2.createElement(T, {
    flexDirection: "column",
    marginTop: 1,
    gap: 1
  }, U2.createElement(C, null, "Guest passes are not currently available."), U2.createElement(C, {
    dimColor: !0,
    italic: !0
  }, D.pending ? U2.createElement(U2.Fragment, null, "Press ", D.keyName, " again to exit") : U2.createElement(U2.Fragment, null, "Esc to cancel")));
  let W = G.filter((F) => F.isAvailable).length,
    K = [...G].sort((F, H) => +H.isAvailable - +F.isAvailable),
    V = (F) => {
      if (!F.isAvailable) return U2.createElement(T, {
        key: F.passNumber,
        flexDirection: "column",
        marginRight: 1
      }, U2.createElement(C, {
        dimColor: !0
      }, "┌─────────╱"), U2.createElement(C, {
        dimColor: !0
      }, " ) CC ✻ ┊╱"), U2.createElement(C, {
        dimColor: !0
      }, "└───────╱"));
      return U2.createElement(T, {
        key: F.passNumber,
        flexDirection: "column",
        marginRight: 1
      }, U2.createElement(C, null, "┌──────────┐"), U2.createElement(C, null, " ) CC ", U2.createElement(C, {
        color: "claude"
      }, "✻"), " ┊ ( "), U2.createElement(C, null, "└──────────┘"))
    };
  return U2.createElement(T, {
    flexDirection: "column",
    marginTop: 1,
    gap: 1
  }, U2.createElement(C, {
    color: "permission"
  }, "Guest passes · ", W, " left"), U2.createElement(T, {
    flexDirection: "row",
    marginLeft: 2
  }, K.map((F) => V(F))), X && U2.createElement(T, {
    marginLeft: 2
  }, U2.createElement(C, null, X)), U2.createElement(T, {
    flexDirection: "column",
    marginLeft: 2
  }, U2.createElement(C, {
    dimColor: !0
  }, "Share a free week of Claude Code with friends.")), U2.createElement(T, null, U2.createElement(C, {
    dimColor: !0,
    italic: !0
  }, D.pending ? U2.createElement(U2.Fragment, null, "Press ", D.keyName, " again to exit") : U2.createElement(U2.Fragment, null, "Enter to copy link · Esc to cancel"))))
}
// @from(Ln 425690, Col 4)
U2
// @from(Ln 425690, Col 8)
K8A
// @from(Ln 425691, Col 4)
A79 = w(() => {
  fA();
  A$A();
  v1();
  Z0();
  OzA();
  E9();
  U2 = c(QA(), 1), K8A = c(QA(), 1)
})
// @from(Ln 425700, Col 4)
YT0
// @from(Ln 425700, Col 9)
Q79
// @from(Ln 425701, Col 4)
B79 = w(() => {
  A79();
  GQ();
  Z0();
  YT0 = c(QA(), 1), Q79 = {
    type: "local-jsx",
    name: "passes",
    description: "Share a free week of Claude Code with friends",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A) {
      let B = !L1().hasVisitedPasses;
      if (B) S0((G) => ({
        ...G,
        hasVisitedPasses: !0
      }));
      return l("tengu_guest_passes_visited", {
        is_first_visit: B
      }), YT0.createElement(e59, {
        onDone: A
      })
    },
    userFacingName() {
      return "passes"
    }
  }
})
// @from(Ln 425729, Col 0)
function G79(A, Q, B) {
  if (!A.success || !Q.success) return !1;
  let G = A.data,
    Z = Q.data;
  if (G.grove_enabled !== null) return !1;
  if (B) return !0;
  if (!Z.notice_is_grace_period) return !0;
  let J = Z.notice_reminder_frequency;
  if (J !== null && G.grove_notice_viewed_at) return Math.floor((Date.now() - new Date(G.grove_notice_viewed_at).getTime()) / 86400000) >= J;
  else {
    let X = G.grove_notice_viewed_at;
    return X === null || X === void 0
  }
}
// @from(Ln 425744, Col 0)
function PF7() {
  return zB.default.createElement(zB.default.Fragment, null, zB.default.createElement(T, {
    flexDirection: "column"
  }, zB.default.createElement(C, {
    bold: !0,
    color: "professionalBlue"
  }, "Updates to Consumer Terms and Policies"), zB.default.createElement(C, null, "An update to our Consumer Terms and Privacy Policy will take effect on", " ", zB.default.createElement(C, {
    bold: !0
  }, "October 8, 2025"), ". You can accept the updated terms today.")), zB.default.createElement(T, {
    flexDirection: "column"
  }, zB.default.createElement(C, null, "What's changing?"), zB.default.createElement(T, {
    paddingLeft: 1
  }, zB.default.createElement(C, null, zB.default.createElement(C, null, "• "), zB.default.createElement(C, {
    bold: !0
  }, "You can help improve Claude "), zB.default.createElement(C, null, "— Allow the use of your chats and coding sessions to train and improve Anthropic AI models. Change anytime in your Privacy Settings (", zB.default.createElement(i2, {
    url: "https://claude.ai/settings/data-privacy-controls"
  }), ")."))), zB.default.createElement(T, {
    paddingLeft: 1
  }, zB.default.createElement(C, null, zB.default.createElement(C, null, "• "), zB.default.createElement(C, {
    bold: !0
  }, "Updates to data retention "), zB.default.createElement(C, null, "— To help us improve our AI models and safety protections, we're extending data retention to 5 years.")))), zB.default.createElement(C, null, "Learn more (", zB.default.createElement(i2, {
    url: "https://www.anthropic.com/news/updates-to-our-consumer-terms"
  }), ") or read the updated Consumer Terms (", zB.default.createElement(i2, {
    url: "https://anthropic.com/legal/terms"
  }), ") and Privacy Policy (", zB.default.createElement(i2, {
    url: "https://anthropic.com/legal/privacy"
  }), ")"))
}
// @from(Ln 425773, Col 0)
function SF7() {
  return zB.default.createElement(zB.default.Fragment, null, zB.default.createElement(T, {
    flexDirection: "column"
  }, zB.default.createElement(C, {
    bold: !0,
    color: "professionalBlue"
  }, "Updates to Consumer Terms and Policies"), zB.default.createElement(C, null, "We've updated our Consumer Terms and Privacy Policy.")), zB.default.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, zB.default.createElement(C, null, "What's changing?"), zB.default.createElement(T, {
    flexDirection: "column"
  }, zB.default.createElement(C, {
    bold: !0
  }, "Help improve Claude"), zB.default.createElement(C, null, "Allow the use of your chats and coding sessions to train and improve Anthropic AI models. You can change this anytime in Privacy Settings"), zB.default.createElement(i2, {
    url: "https://claude.ai/settings/data-privacy-controls"
  })), zB.default.createElement(T, {
    flexDirection: "column"
  }, zB.default.createElement(C, {
    bold: !0
  }, "How this affects data retention"), zB.default.createElement(C, null, "Turning ON the improve Claude setting extends data retention from 30 days to 5 years. Turning it OFF keeps the default 30-day data retention. Delete data anytime."))), zB.default.createElement(C, null, "Learn more (", zB.default.createElement(i2, {
    url: "https://www.anthropic.com/news/updates-to-our-consumer-terms"
  }), ") or read the updated Consumer Terms (", zB.default.createElement(i2, {
    url: "https://anthropic.com/legal/terms"
  }), ") and Privacy Policy (", zB.default.createElement(i2, {
    url: "https://anthropic.com/legal/privacy"
  }), ")"))
}
// @from(Ln 425801, Col 0)
function bz1({
  showIfAlreadyViewed: A,
  location: Q,
  onDone: B
}) {
  let [G, Z] = zB.useState(null), [Y, J] = zB.useState(null), X = MQ();
  if (zB.useEffect(() => {
      async function W() {
        let [K, V] = await Promise.all([oVA(), or()]), F = V.success ? V.data : null;
        J(F);
        let H = G79(K, V, A);
        if (Z(H), !H) {
          B("skip_rendering");
          return
        }
        BW0(), l("tengu_grove_policy_viewed", {
          location: Q,
          dismissable: F?.notice_is_grace_period
        })
      }
      W()
    }, [A, Q, B]), G === null) return null;
  if (!G) return null;
  async function I(W) {
    switch (W) {
      case "accept_opt_in": {
        await QJ1(!0), l("tengu_grove_policy_submitted", {
          state: !0,
          dismissable: Y?.notice_is_grace_period
        });
        break
      }
      case "accept_opt_out": {
        await QJ1(!1), l("tengu_grove_policy_submitted", {
          state: !1,
          dismissable: Y?.notice_is_grace_period
        });
        break
      }
      case "defer":
        l("tengu_grove_policy_dismissed", {
          state: !0
        });
        break;
      case "escape":
        l("tengu_grove_policy_escaped", {});
        break
    }
    B(W)
  }
  let D = Y?.domain_excluded ? [{
    label: "Accept terms • Help improve Claude: OFF (for emails with your domain)",
    value: "accept_opt_out"
  }] : [{
    label: "Accept terms • Help improve Claude: ON",
    value: "accept_opt_in"
  }, {
    label: "Accept terms • Help improve Claude: OFF",
    value: "accept_opt_out"
  }];
  return zB.default.createElement(zB.default.Fragment, null, zB.default.createElement(T, {
    flexDirection: "column",
    width: 100,
    gap: 1,
    paddingTop: 1,
    paddingLeft: 1,
    paddingRight: 1,
    borderStyle: "round",
    borderColor: "professionalBlue"
  }, zB.default.createElement(T, {
    flexDirection: "row"
  }, zB.default.createElement(T, {
    flexDirection: "column",
    gap: 1,
    flexGrow: 1
  }, Y?.notice_is_grace_period ? zB.default.createElement(PF7, null) : zB.default.createElement(SF7, null)), zB.default.createElement(T, {
    flexShrink: 0
  }, zB.default.createElement(C, {
    color: "professionalBlue"
  }, TF7))), zB.default.createElement(T, {
    flexDirection: "column",
    gap: 1,
    padding: 1,
    borderStyle: "round",
    borderColor: "professionalBlue"
  }, zB.default.createElement(T, {
    flexDirection: "column"
  }, zB.default.createElement(C, {
    bold: !0
  }, "Please select how you'd like to continue"), zB.default.createElement(C, null, "Your choice takes effect immediately upon confirmation.")), zB.default.createElement(k0, {
    options: [...D, ...Y?.notice_is_grace_period ? [{
      label: "Not now",
      value: "defer"
    }] : []],
    onChange: (W) => I(W),
    onCancel: () => {
      if (Y?.notice_is_grace_period) {
        I("defer");
        return
      }
      I("escape")
    }
  }))), zB.default.createElement(T, {
    marginLeft: 1
  }, zB.default.createElement(C, {
    dimColor: !0
  }, X.pending ? zB.default.createElement(zB.default.Fragment, null, "Press ", X.keyName, " again to exit") : zB.default.createElement(zB.default.Fragment, null, "Enter to confirm · Esc to cancel"))))
}
// @from(Ln 425910, Col 0)
function Z79({
  settings: A,
  domainExcluded: Q,
  onDone: B
}) {
  let G = MQ(),
    [Z, Y] = zB.useState(A.grove_enabled);
  zB.default.useEffect(() => {
    l("tengu_grove_privacy_settings_viewed", {})
  }, []), J0(async (X, I) => {
    if (I.escape) B();
    if (!Q && (I.tab || I.return || X === " ")) {
      let D = !Z;
      Y(D), await QJ1(D)
    }
  });
  let J = zB.default.createElement(C, {
    color: "error"
  }, "false");
  if (Q) J = zB.default.createElement(C, {
    color: "error"
  }, "false (for emails with your domain)");
  else if (Z) J = zB.default.createElement(C, {
    color: "success"
  }, "true");
  return zB.default.createElement(zB.default.Fragment, null, zB.default.createElement(T, {
    flexDirection: "column",
    gap: 1,
    padding: 1,
    borderStyle: "round",
    borderColor: "professionalBlue"
  }, zB.default.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, zB.default.createElement(C, {
    bold: !0,
    color: "professionalBlue"
  }, "Data Privacy"), zB.default.createElement(C, null, "Review and manage your privacy settings at", " ", zB.default.createElement(i2, {
    url: "https://claude.ai/settings/data-privacy-controls"
  })), zB.default.createElement(T, null, zB.default.createElement(T, {
    width: 44
  }, zB.default.createElement(C, {
    bold: !0
  }, "Help improve Claude")), zB.default.createElement(T, null, J)))), zB.default.createElement(T, {
    marginLeft: 1
  }, Q ? zB.default.createElement(C, {
    dimColor: !0
  }, G.pending ? zB.default.createElement(zB.default.Fragment, null, "Press ", G.keyName, " again to exit") : zB.default.createElement(zB.default.Fragment, null, "Esc to cancel")) : zB.default.createElement(C, {
    dimColor: !0
  }, G.pending ? zB.default.createElement(zB.default.Fragment, null, "Press ", G.keyName, " again to exit") : zB.default.createElement(zB.default.Fragment, null, "Enter/Tab/Space to toggle · Esc to cancel"))))
}
// @from(Ln 425961, Col 0)
async function Y79() {
  let [A, Q] = await Promise.all([oVA(), or()]);
  if (G79(A, Q, !1)) {
    let G = Q.success ? Q.data : null;
    if (l("tengu_grove_print_viewed", {
        dismissable: G?.notice_is_grace_period
      }), G === null || G.notice_is_grace_period) Tl(`
An update to our Consumer Terms and Privacy Policy will take effect on October 8, 2025. Run \`claude\` to review the updated terms.

`), await BW0();
    else Tl(`
[ACTION REQUIRED] An update to our Consumer Terms and Privacy Policy has taken effect on October 8, 2025. You must run \`claude\` to review the updated terms.

`), await w3(1)
  }
}
// @from(Ln 425977, Col 4)
zB
// @from(Ln 425977, Col 8)
TF7 = ` _____________
 |          \\  \\
 | NEW TERMS \\__\\
 |              |
 |  ----------  |
 |  ----------  |
 |  ----------  |
 |  ----------  |
 |  ----------  |
 |              |
 |______________|`
// @from(Ln 425988, Col 4)
fz1 = w(() => {
  fA();
  u8();
  Z0();
  E9();
  sVA();
  yJ();
  fA();
  zB = c(QA(), 1)
})
// @from(Ln 425998, Col 4)
YuA
// @from(Ln 425998, Col 9)
J79 = "Review and manage your privacy settings at https://claude.ai/settings/data-privacy-controls"
// @from(Ln 425999, Col 2)
xF7
// @from(Ln 425999, Col 7)
X79
// @from(Ln 426000, Col 4)
I79 = w(() => {
  fz1();
  sVA();
  Z0();
  Q2();
  YuA = c(QA(), 1), xF7 = {
    type: "local-jsx",
    name: "privacy-settings",
    description: "View and update your privacy settings",
    isEnabled: () => {
      return dA1()
    },
    isHidden: !1,
    async call(A) {
      if (!await rVA()) return A(J79), null;
      let [B, G] = await Promise.all([oVA(), or()]);
      if (!B.success) return A(J79), null;
      let Z = B.data,
        Y = G.success ? G.data : null;
      async function J(I) {
        if (I === "escape" || I === "defer") {
          A("Privacy settings dialog dismissed", {
            display: "system"
          });
          return
        }
        await X()
      }
      async function X() {
        let I = await oVA();
        if (!I.success) {
          A("Unable to retrieve updated privacy settings", {
            display: "system"
          });
          return
        }
        let D = I.data,
          W = D.grove_enabled ? "true" : "false";
        if (A(`"Help improve Claude" set to ${W}.`), Z.grove_enabled !== null && Z.grove_enabled !== D.grove_enabled) l("tengu_grove_policy_toggled", {
          state: D.grove_enabled,
          location: "settings"
        })
      }
      if (Z.grove_enabled !== null) return YuA.createElement(Z79, {
        settings: Z,
        domainExcluded: Y?.domain_excluded,
        onDone: X
      });
      return YuA.createElement(bz1, {
        showIfAlreadyViewed: !0,
        onDone: J,
        location: "settings"
      })
    },
    userFacingName() {
      return "privacy-settings"
    }
  }, X79 = xF7
})
// @from(Ln 426060, Col 0)
function D79({
  event: A,
  eventSummary: Q,
  config: B,
  matcher: G,
  onSuccess: Z,
  onCancel: Y
}) {
  let [J, X] = JT0.useState(!1), [I, D] = JT0.useState(null), W = qVA.map(yI0), K = async (V) => {
    X(!0), D(null);
    try {
      await c32(A, B, G, V), l("tengu_hook_created", {
        event: A,
        source: V,
        has_matcher: G ? 1 : 0
      }), Z()
    } catch (F) {
      D(F instanceof Error ? F.message : "Failed to add hook"), X(!1)
    }
  };
  if (J) return T7.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, T7.createElement(T, {
    flexDirection: "row",
    gap: 1
  }, T7.createElement(W9, null), T7.createElement(C, null, "Adding hook configuration…")));
  if (I) return T7.createElement(o9, {
    title: "Failed to add hook",
    onCancel: Y,
    color: "error",
    borderDimColor: !1
  }, T7.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, T7.createElement(C, null, I), T7.createElement(k0, {
    options: [{
      label: "OK",
      value: "ok"
    }],
    onChange: Y
  })));
  return T7.createElement(o9, {
    title: "Save hook configuration",
    onCancel: Y,
    borderDimColor: !1
  }, T7.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, T7.createElement(T, {
    flexDirection: "column",
    marginX: 2
  }, T7.createElement(C, null, "Event: ", A, " - ", Q), T7.createElement(C, null, "Matcher: ", G), T7.createElement(C, null, B.type === "command" ? "Command" : "Prompt", ":", " ", AU(B))), T7.createElement(C, null, "Where should this hook be saved?"), T7.createElement(k0, {
    options: W,
    onChange: (V) => K(V),
    visibleOptionCount: 3
  })))
}
// @from(Ln 426118, Col 4)
T7
// @from(Ln 426118, Col 8)
JT0
// @from(Ln 426119, Col 4)
W79 = w(() => {
  fA();
  bb();
  W8();
  yG();
  cZ1();
  rY();
  Z0();
  T7 = c(QA(), 1), JT0 = c(QA(), 1)
})
// @from(Ln 426130, Col 0)
function K79({
  hookEventMetadata: A,
  totalHooksCount: Q,
  configDifference: B,
  restrictedByPolicy: G,
  onSelectEvent: Z,
  onCancel: Y
}) {
  let J = `${Q} hook${Q!==1?"s":""}`;
  return cJ.createElement(o9, {
    title: "Hooks",
    subtitle: J,
    onCancel: Y,
    borderDimColor: !1
  }, cJ.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, G && cJ.createElement(T, {
    flexDirection: "column"
  }, cJ.createElement(C, {
    color: "suggestion"
  }, tA.info, " Hooks Restricted by Policy"), cJ.createElement(C, {
    dimColor: !0
  }, "Only hooks from managed settings can run. User-defined hooks from ~/.claude/settings.json, .claude/settings.json, and .claude/settings.local.json are blocked.")), B && cJ.createElement(T, {
    flexDirection: "column"
  }, cJ.createElement(C, {
    color: "warning"
  }, tA.warning, " Settings Changed"), cJ.createElement(C, {
    dimColor: !0
  }, "Hook settings have been modified outside of this menu. Review the following changes carefully:"), cJ.createElement(C, {
    dimColor: !0
  }, B)), cJ.createElement(T, {
    flexDirection: "column"
  }, cJ.createElement(k0, {
    onChange: (X) => {
      if (X === "disable-all") Z("disable-all");
      else Z(X)
    },
    onCancel: Y,
    options: [...Object.entries(A).map(([X, I]) => ({
      label: `${X} - ${I.summary}`,
      value: X
    })), {
      label: cJ.createElement(C, {
        dimColor: !0
      }, "Disable all hooks"),
      value: "disable-all"
    }]
  }))))
}
// @from(Ln 426180, Col 4)
cJ
// @from(Ln 426181, Col 4)
V79 = w(() => {
  fA();
  W8();
  B2();
  rY();
  cJ = c(QA(), 1)
})
// @from(Ln 426189, Col 0)
function F79({
  selectedEvent: A,
  matchersForSelectedEvent: Q,
  hooksByEventAndMatcher: B,
  eventDescription: G,
  onSelect: Z,
  onCancel: Y
}) {
  let J = AM.useMemo(() => {
    return Q.map((X) => {
      let I = B[A]?.[X] || [],
        D = Array.from(new Set(I.map((W) => W.source)));
      return {
        matcher: X,
        sources: D,
        hookCount: I.length
      }
    })
  }, [Q, B, A]);
  return AM.createElement(o9, {
    title: `${A} - Tool Matchers`,
    subtitle: G,
    onCancel: Y,
    borderDimColor: !1
  }, AM.createElement(T, {
    flexDirection: "column"
  }, AM.createElement(k0, {
    options: [{
      label: `+ Add new matcher${tA.ellipsis}`,
      value: "add-new"
    }, ...J.map((X) => {
      return {
        label: `[${X.sources.map(i32).join(", ")}] ${X.matcher}`,
        value: X.matcher,
        description: `${X.hookCount} hook${X.hookCount!==1?"s":""}`
      }
    })],
    onChange: (X) => {
      if (X === "add-new") Z(null);
      else Z(X)
    },
    onCancel: Y
  }), Q.length === 0 && AM.createElement(T, {
    marginLeft: 2
  }, AM.createElement(C, {
    dimColor: !0
  }, "No matchers configured yet"))))
}
// @from(Ln 426237, Col 4)
AM
// @from(Ln 426238, Col 4)
H79 = w(() => {
  fA();
  B2();
  bb();
  W8();
  rY();
  AM = c(QA(), 1)
})
// @from(Ln 426247, Col 0)
function E79({
  selectedEvent: A,
  newMatcher: Q,
  onChangeNewMatcher: B,
  eventDescription: G,
  matcherMetadata: Z,
  onCancel: Y
}) {
  let [J, X] = pJ.useState(Q.length);
  return pJ.createElement(o9, {
    title: `Add new matcher for ${A}`,
    subtitle: G,
    onCancel: Y,
    borderDimColor: !1
  }, pJ.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, pJ.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, pJ.createElement(C, null, "Possible matcher values for field ", Z.fieldToMatch, ":"), pJ.createElement(C, {
    dimColor: !0
  }, Z.values.join(", "))), pJ.createElement(T, {
    flexDirection: "column"
  }, pJ.createElement(C, null, "Tool matcher:"), pJ.createElement(T, {
    borderStyle: "round",
    borderDimColor: !0,
    paddingLeft: 1,
    paddingRight: 1
  }, pJ.createElement(p4, {
    value: Q,
    onChange: B,
    columns: 78,
    showCursor: !0,
    cursorOffset: J,
    onChangeCursorOffset: X
  }))), pJ.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, pJ.createElement(C, {
    dimColor: !0
  }, "Example Matchers:", `
`, "• Write (single tool)", `
`, "• Write|Edit (multiple tools)", `
`, "• Web.* (regex pattern)"))))
}
// @from(Ln 426293, Col 4)
pJ
// @from(Ln 426294, Col 4)
z79 = w(() => {
  fA();
  IY();
  rY();
  pJ = c(QA(), 1)
})
// @from(Ln 426301, Col 0)
function $79({
  selectedEvent: A,
  selectedMatcher: Q,
  eventDescription: B,
  fullDescription: G,
  supportsMatcher: Z,
  command: Y,
  onChangeCommand: J,
  onCancel: X
}) {
  let [I, D] = R6.useState(Y.length), {
    columns: W
  } = ZB(), K = Y.trim().split(/\s+/)[0] || "", V = K && !K.startsWith("/") && !K.startsWith("~") && K.includes("/"), F = /\bsudo\b/.test(Y);
  return R6.createElement(o9, {
    title: "Add new hook",
    onCancel: X,
    borderDimColor: !1
  }, R6.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, R6.createElement(T, {
    flexDirection: "column"
  }, R6.createElement(C, {
    dimColor: !0
  }, tA.info, " Hooks execute shell commands with your full user permissions. Only use hooks from trusted sources.", " ", R6.createElement(i2, {
    url: "https://code.claude.com/docs/en/hooks"
  }, "Learn more"))), R6.createElement(C, null, "Event: ", R6.createElement(C, {
    bold: !0
  }, A), " - ", B), G && R6.createElement(T, null, R6.createElement(C, {
    dimColor: !0
  }, G)), Z && R6.createElement(C, null, "Matcher: ", R6.createElement(C, {
    bold: !0
  }, Q)), R6.createElement(C, null, "Command:"), R6.createElement(T, {
    borderStyle: "round",
    borderDimColor: !0,
    paddingLeft: 1,
    paddingRight: 1
  }, R6.createElement(p4, {
    value: Y,
    onChange: J,
    columns: W - 8,
    showCursor: !0,
    cursorOffset: I,
    onChangeCursorOffset: D,
    multiline: !0
  })), (V || F) && R6.createElement(T, {
    flexDirection: "column",
    gap: 0
  }, V && R6.createElement(C, {
    color: "warning"
  }, tA.warning, " Using a relative path for the executable may be insecure. Consider using an absolute path instead."), F && R6.createElement(C, {
    color: "warning"
  }, tA.warning, " Using sudo in hooks can be dangerous and may expose your system to security risks.")), R6.createElement(C, {
    dimColor: !0
  }, "Examples:", R6.createElement(fD, null), `• jq -r '.tool_input.file_path | select(endswith(".go"))' | xargs -r gofmt -w`, R6.createElement(fD, null), `• jq -r '"\\(.tool_input.command) - \\(.tool_input.description // "No description")"' >> ~/.claude/bash-command-log.txt`, R6.createElement(fD, null), "• /usr/local/bin/security_check.sh", R6.createElement(fD, null), "• python3 ~/hooks/validate_changes.py")))
}
// @from(Ln 426357, Col 4)
R6
// @from(Ln 426358, Col 4)
C79 = w(() => {
  fA();
  IY();
  B2();
  fA();
  P4();
  rY();
  R6 = c(QA(), 1)
})
// @from(Ln 426368, Col 0)
function U79({
  selectedMatcher: A,
  selectedEvent: Q,
  onDelete: B,
  onCancel: G
}) {
  return SU.createElement(o9, {
    title: "Delete matcher?",
    onCancel: G,
    borderDimColor: !1
  }, SU.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, SU.createElement(T, {
    flexDirection: "column",
    marginX: 2
  }, SU.createElement(C, {
    bold: !0
  }, A), SU.createElement(C, {
    dimColor: !0
  }, "Event: ", Q)), SU.createElement(C, null, "This matcher has no hooks configured. Delete it?"), SU.createElement(k0, {
    onChange: (Z) => Z === "yes" ? B() : G(),
    options: [{
      label: "Yes",
      value: "yes"
    }, {
      label: "No",
      value: "no"
    }]
  })))
}
// @from(Ln 426399, Col 4)
SU
// @from(Ln 426400, Col 4)
q79 = w(() => {
  fA();
  W8();
  rY();
  SU = c(QA(), 1)
})
// @from(Ln 426407, Col 0)
function N79({
  selectedEvent: A,
  selectedMatcher: Q,
  hooksForSelectedMatcher: B,
  hookEventMetadata: G,
  onSelect: Z,
  onCancel: Y
}) {
  let J = G.matcherMetadata !== void 0 ? `${A} - Matcher: ${Q}` : A;
  return fx.createElement(o9, {
    title: J,
    subtitle: G.description,
    onCancel: Y,
    borderDimColor: !1
  }, fx.createElement(T, {
    flexDirection: "column"
  }, fx.createElement(k0, {
    options: [{
      label: `+ Add new hook${tA.ellipsis}`,
      value: "add-new"
    }, ...B.map((X, I) => ({
      label: X.source === "pluginHook" ? `${AU(X.config)} (read-only)` : AU(X.config),
      value: I.toString(),
      description: X.source === "pluginHook" ? `${vI0(X.source)} - disable ${X.pluginName?X.pluginName:"plugin"} to remove` : vI0(X.source),
      disabled: X.source === "pluginHook"
    }))],
    onChange: (X) => {
      if (X === "add-new") Z(null);
      else {
        let I = parseInt(X, 10),
          D = B[I];
        if (D) Z(D)
      }
    },
    onCancel: Y
  }), B.length === 0 && fx.createElement(T, {
    marginLeft: 2
  }, fx.createElement(C, {
    dimColor: !0
  }, "No hooks configured yet"))))
}
// @from(Ln 426448, Col 4)
fx
// @from(Ln 426449, Col 4)
w79 = w(() => {
  B2();
  fA();
  bb();
  W8();
  rY();
  fx = c(QA(), 1)
})
// @from(Ln 426458, Col 0)
function L79({
  selectedHook: A,
  eventSupportsMatcher: Q,
  onDelete: B,
  onCancel: G
}) {
  return CV.createElement(o9, {
    title: "Delete hook?",
    onCancel: G,
    borderDimColor: !1
  }, CV.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, CV.createElement(T, {
    flexDirection: "column",
    marginX: 2
  }, CV.createElement(C, {
    bold: !0
  }, AU(A.config)), CV.createElement(C, {
    dimColor: !0
  }, "Event: ", A.event), Q && CV.createElement(C, {
    dimColor: !0
  }, "Matcher: ", A.matcher), CV.createElement(C, {
    dimColor: !0
  }, l32(A.source))), CV.createElement(C, null, "This will remove the hook configuration from your settings."), CV.createElement(k0, {
    onChange: (Z) => Z === "yes" ? B() : G(),
    options: [{
      label: "Yes",
      value: "yes"
    }, {
      label: "No",
      value: "no"
    }]
  })))
}
// @from(Ln 426493, Col 4)
CV
// @from(Ln 426494, Col 4)
O79 = w(() => {
  fA();
  bb();
  W8();
  rY();
  CV = c(QA(), 1)
})
// @from(Ln 426502, Col 0)
function M79(A, Q) {
  let B = {
      PreToolUse: {},
      PostToolUse: {},
      PostToolUseFailure: {},
      Notification: {},
      UserPromptSubmit: {},
      SessionStart: {},
      SessionEnd: {},
      Stop: {},
      SubagentStart: {},
      SubagentStop: {},
      PreCompact: {},
      PermissionRequest: {}
    },
    G = JuA(Q);
  d32(A).forEach((Y) => {
    let J = B[Y.event];
    if (J) {
      let X = G[Y.event].matcherMetadata !== void 0 ? Y.matcher || "" : "";
      if (!J[X]) J[X] = [];
      J[X].push(Y)
    }
  });
  let Z = TdA();
  if (Z)
    for (let [Y, J] of Object.entries(Z)) {
      let X = Y,
        I = B[X];
      if (!I) continue;
      for (let D of J) {
        let W = D.matcher || "";
        if (!I[W]) I[W] = [];
        for (let K of D.hooks)
          if (K.type === "callback") I[W].push({
            event: X,
            config: {
              type: "command",
              command: "[Plugin Hook]"
            },
            matcher: D.matcher,
            source: "pluginHook",
            pluginName: D.pluginName
          })
      }
    }
  return B
}
// @from(Ln 426551, Col 0)
function R79(A, Q) {
  let B = Object.keys(A[Q] || {});
  return n32(B, A, Q)
}
// @from(Ln 426556, Col 0)
function _79(A, Q, B) {
  let G = B ?? "";
  return A[Q]?.[G] ?? []
}
// @from(Ln 426561, Col 0)
function Oe(A, Q) {
  return JuA(Q)[A].matcherMetadata
}
// @from(Ln 426565, Col 0)
function j79(A, Q) {
  return JuA(Q)[A].summary
}
// @from(Ln 426568, Col 4)
JuA
// @from(Ln 426569, Col 4)
T79 = w(() => {
  Y9();
  bb();
  C0();
  JuA = W0(function (A) {
    return {
      PreToolUse: {
        summary: "Before tool execution",
        description: `Input to command is JSON of tool call arguments.
Exit code 0 - stdout/stderr not shown
Exit code 2 - show stderr to model and block tool call
Other exit codes - show stderr to user only but continue with tool call`,
        matcherMetadata: {
          fieldToMatch: "tool_name",
          values: A
        }
      },
      PostToolUse: {
        summary: "After tool execution",
        description: `Input to command is JSON with fields "inputs" (tool call arguments) and "response" (tool call response).
Exit code 0 - stdout shown in transcript mode (ctrl+o)
Exit code 2 - show stderr to model immediately
Other exit codes - show stderr to user only`,
        matcherMetadata: {
          fieldToMatch: "tool_name",
          values: A
        }
      },
      PostToolUseFailure: {
        summary: "After tool execution fails",
        description: `Input to command is JSON with tool_name, tool_input, tool_use_id, error, error_type, is_interrupt, and is_timeout.
Exit code 0 - stdout shown in transcript mode (ctrl+o)
Exit code 2 - show stderr to model immediately
Other exit codes - show stderr to user only`,
        matcherMetadata: {
          fieldToMatch: "tool_name",
          values: A
        }
      },
      Notification: {
        summary: "When notifications are sent",
        description: `Input to command is JSON with notification message and type.
Exit code 0 - stdout/stderr not shown
Other exit codes - show stderr to user only`,
        matcherMetadata: {
          fieldToMatch: "notification_type",
          values: ["permission_prompt", "idle_prompt", "auth_success", "elicitation_dialog"]
        }
      },
      UserPromptSubmit: {
        summary: "When the user submits a prompt",
        description: `Input to command is JSON with original user prompt text.
Exit code 0 - stdout shown to Claude
Exit code 2 - block processing, erase original prompt, and show stderr to user only
Other exit codes - show stderr to user only`
      },
      SessionStart: {
        summary: "When a new session is started",
        description: `Input to command is JSON with session start source.
Exit code 0 - stdout shown to Claude
Blocking errors are ignored
Other exit codes - show stderr to user only`,
        matcherMetadata: {
          fieldToMatch: "source",
          values: ["startup", "resume", "clear", "compact"]
        }
      },
      Stop: {
        summary: "Right before Claude concludes its response",
        description: `Exit code 0 - stdout/stderr not shown
Exit code 2 - show stderr to model and continue conversation
Other exit codes - show stderr to user only`
      },
      SubagentStart: {
        summary: "When a subagent (Task tool call) is started",
        description: `Input to command is JSON with agent_id and agent_type.
Exit code 0 - stdout shown to subagent
Blocking errors are ignored
Other exit codes - show stderr to user only`,
        matcherMetadata: {
          fieldToMatch: "agent_type",
          values: []
        }
      },
      SubagentStop: {
        summary: "Right before a subagent (Task tool call) concludes its response",
        description: `Exit code 0 - stdout/stderr not shown
Exit code 2 - show stderr to subagent and continue having it run
Other exit codes - show stderr to user only`
      },
      PreCompact: {
        summary: "Before conversation compaction",
        description: `Input to command is JSON with compaction details.
Exit code 0 - stdout appended as custom compact instructions
Exit code 2 - block compaction
Other exit codes - show stderr to user only but continue with compaction`,
        matcherMetadata: {
          fieldToMatch: "trigger",
          values: ["manual", "auto"]
        }
      },
      SessionEnd: {
        summary: "When a session is ending",
        description: `Input to command is JSON with session end reason.
Exit code 0 - command completes successfully
Other exit codes - show stderr to user only`,
        matcherMetadata: {
          fieldToMatch: "reason",
          values: ["clear", "logout", "prompt_input_exit", "other"]
        }
      },
      PermissionRequest: {
        summary: "When a permission dialog is displayed",
        description: `Input to command is JSON with tool_name, tool_input, and tool_use_id.
Output JSON with hookSpecificOutput containing decision to allow or deny.
Exit code 0 - use hook decision if provided
Other exit codes - show stderr to user only`,
        matcherMetadata: {
          fieldToMatch: "tool_name",
          values: A
        }
      }
    }
  })
})
// @from(Ln 426695, Col 0)
function P79({
  toolNames: A,
  onExit: Q
}) {
  let [B, G] = DD.useState([]), [Z, Y] = DD.useState({
    mode: "select-event"
  }), [J, X] = DD.useState(0), [I, D] = DD.useState(() => {
    return jQ()?.disableAllHooks === !0 && dB("policySettings")?.disableAllHooks === !0
  }), [W, K] = DD.useState(() => {
    return dB("policySettings")?.allowManagedHooksOnly === !0
  });
  EDA((TA) => {
    if (TA === "policySettings") {
      let jA = jQ()?.disableAllHooks === !0;
      D(jA && dB("policySettings")?.disableAllHooks === !0), K(dB("policySettings")?.allowManagedHooksOnly === !0)
    }
  });
  let [V, F] = DD.useState(""), [H, E] = DD.useState(""), z = Z.mode, $ = "event" in Z ? Z.event : "PreToolUse", O = "matcher" in Z ? Z.matcher : null, [L] = a0(), {
    mcp: M
  } = L, _ = DD.useMemo(() => [...A, ...M.tools.map((TA) => TA.name)], [A, M.tools]), j = DD.useMemo(() => M79(L, _), [J, _, L]), x = DD.useMemo(() => R79(j, $), [j, $]), b = DD.useMemo(() => _79(j, $, O), [j, $, O]);
  J0((TA, bA) => {
    if (z === "save-hook") return;
    if (bA.escape) {
      switch (z) {
        case "select-event":
          if (B.length > 0) Q(B.join(`
`));
          else Q("Hooks dialog dismissed", {
            display: "system"
          });
          break;
        case "select-matcher":
          Y({
            mode: "select-event"
          });
          break;
        case "add-matcher":
          if ("event" in Z) Y({
            mode: "select-matcher",
            event: Z.event,
            matcherMetadata: Z.matcherMetadata
          });
          E("");
          break;
        case "delete-matcher":
          if ("event" in Z) Y({
            mode: "select-matcher",
            event: Z.event,
            matcherMetadata: Z.matcherMetadata
          });
          break;
        case "select-hook":
          if ("event" in Z) {
            let jA = Oe(Z.event, _);
            if (jA !== void 0) Y({
              mode: "select-matcher",
              event: Z.event,
              matcherMetadata: jA
            });
            else Y({
              mode: "select-event"
            })
          }
          break;
        case "add-hook":
          if ("event" in Z && "matcher" in Z) Y({
            mode: "select-hook",
            event: Z.event,
            matcher: Z.matcher
          });
          F("");
          break;
        case "delete-hook":
          if ("event" in Z && Z.mode === "delete-hook") {
            let {
              hook: jA
            } = Z;
            Y({
              mode: "select-hook",
              event: Z.event,
              matcher: jA.matcher || ""
            })
          }
          break
      }
      return
    }
    switch (z) {
      case "add-matcher":
        if (bA.return && H.trim() && "event" in Z) Y({
          mode: "select-hook",
          event: Z.event,
          matcher: H.trim()
        });
        break;
      case "add-hook":
        if (bA.return && V.trim() && "event" in Z && "matcher" in Z) {
          let jA = {
            event: Z.event,
            config: {
              type: "command",
              command: V.trim()
            },
            matcher: Oe(Z.event, _) !== void 0 ? Z.matcher : ""
          };
          Y({
            mode: "save-hook",
            event: Z.event,
            hookToSave: jA
          })
        }
        break;
      case "select-event":
      case "delete-matcher":
      case "delete-hook":
      case "select-matcher":
      case "select-hook":
        break
    }
  });
  let S = DD.useCallback(() => {
      if (Z.mode === "save-hook") {
        let {
          hookToSave: TA
        } = Z;
        G((bA) => [...bA, `Added ${TA.event} hook: ${I1.bold(AU(TA.config))}`]), Y({
          mode: "select-hook",
          event: TA.event,
          matcher: TA.matcher
        })
      }
      F(""), X((TA) => TA + 1)
    }, [Z]),
    u = DD.useCallback(() => {
      if (Z.mode === "save-hook") {
        let {
          hookToSave: TA
        } = Z;
        Y({
          mode: "select-hook",
          event: TA.event,
          matcher: TA.matcher
        })
      }
      F("")
    }, [Z]),
    f = DD.useCallback(async () => {
      if (Z.mode !== "delete-hook") return;
      let {
        hook: TA,
        event: bA
      } = Z;
      await p32(TA), l("tengu_hook_deleted", {
        event: TA.event,
        source: TA.source,
        has_matcher: TA.matcher ? 1 : 0
      }), G((IA) => [...IA, `Deleted ${TA.event} hook: ${I1.bold(AU(TA.config))}`]), X((IA) => IA + 1);
      let jA = TA.matcher || "",
        OA = j[bA]?.[jA]?.filter((IA) => !LVA(IA.config, TA.config));
      if (!OA || OA.length === 0) {
        let IA = Oe(bA, _);
        if (IA !== void 0) Y({
          mode: "select-matcher",
          event: bA,
          matcherMetadata: IA
        });
        else Y({
          mode: "select-event"
        })
      } else Y({
        mode: "select-hook",
        event: bA,
        matcher: jA
      })
    }, [Z, j, _]),
    AA = DD.useCallback(() => {
      if (Z.mode === "delete-matcher") {
        let {
          matcher: TA,
          event: bA
        } = Z;
        G((jA) => [...jA, `Deleted matcher: ${I1.bold(TA)}`]), Y({
          mode: "select-matcher",
          event: bA,
          matcherMetadata: Z.matcherMetadata
        })
      }
    }, [Z]),
    n = JuA(_),
    y = a32();
  DD.useEffect(() => {
    XyA()
  }, []);
  let GA = jQ()?.disableAllHooks === !0,
    WA = DD.useCallback(() => {
      Q(B.length > 0 ? B.join(`
`) : "Hooks dialog dismissed", {
        display: B.length === 0 ? "system" : void 0
      })
    }, [B, Q]),
    MA = DD.useMemo(() => Object.values(j).reduce((TA, bA) => {
      return TA + Object.values(bA).reduce((jA, OA) => jA + OA.length, 0)
    }, 0), [j]);
  if (GA) return e6.createElement(o9, {
    title: "Hook Configuration - Disabled",
    onCancel: WA,
    borderDimColor: !1,
    hideInputGuide: I
  }, e6.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, e6.createElement(T, {
    flexDirection: "column"
  }, e6.createElement(C, null, "All hooks are currently ", e6.createElement(C, {
    bold: !0
  }, "disabled"), I && " by a managed settings file", ". You have", " ", e6.createElement(C, {
    bold: !0
  }, MA), " configured hook", MA !== 1 ? "s" : "", " that", " ", MA !== 1 ? "are" : "is", " not running."), e6.createElement(T, {
    marginTop: 1
  }, e6.createElement(C, {
    dimColor: !0
  }, "When hooks are disabled:")), e6.createElement(C, {
    dimColor: !0
  }, "• No hook commands will execute"), e6.createElement(C, {
    dimColor: !0
  }, "• StatusLine will not be displayed"), e6.createElement(C, {
    dimColor: !0
  }, "• Tool operations will proceed without hook validation")), !I && e6.createElement(T, {
    flexDirection: "column"
  }, e6.createElement(C, {
    bold: !0
  }, "Options:"), e6.createElement(k0, {
    options: [{
      label: "Re-enable all hooks",
      value: "enable"
    }, {
      label: "Exit",
      value: "exit"
    }],
    onChange: (TA) => {
      if (TA === "enable") pB("localSettings", {
        disableAllHooks: !1
      }), Q("Re-enabled all hooks");
      else WA()
    },
    onCancel: WA
  }))));
  switch (Z.mode) {
    case "save-hook":
      return e6.createElement(D79, {
        event: Z.hookToSave.event,
        eventSummary: n[Z.hookToSave.event].summary,
        config: Z.hookToSave.config,
        matcher: Z.hookToSave.matcher,
        onSuccess: S,
        onCancel: u
      });
    case "select-event":
      return e6.createElement(K79, {
        hookEventMetadata: n,
        totalHooksCount: MA,
        configDifference: y,
        restrictedByPolicy: W,
        onSelectEvent: (TA) => {
          if (TA === "disable-all") pB("localSettings", {
            disableAllHooks: !0
          }), Q("All hooks have been disabled");
          else {
            let bA = Oe(TA, _);
            if (bA !== void 0) Y({
              mode: "select-matcher",
              event: TA,
              matcherMetadata: bA
            });
            else Y({
              mode: "select-hook",
              event: TA,
              matcher: ""
            })
          }
        },
        onCancel: WA
      });
    case "select-matcher":
      return e6.createElement(F79, {
        selectedEvent: Z.event,
        matchersForSelectedEvent: x,
        hooksByEventAndMatcher: j,
        eventDescription: n[Z.event].description,
        onSelect: (TA) => {
          if (TA === null) Y({
            mode: "add-matcher",
            event: Z.event,
            matcherMetadata: Z.matcherMetadata
          });
          else if ((j[Z.event]?.[TA] || []).length === 0) Y({
            mode: "delete-matcher",
            event: Z.event,
            matcher: TA,
            matcherMetadata: Z.matcherMetadata
          });
          else Y({
            mode: "select-hook",
            event: Z.event,
            matcher: TA
          })
        },
        onCancel: () => {
          Y({
            mode: "select-event"
          })
        }
      });
    case "add-matcher":
      return e6.createElement(E79, {
        selectedEvent: Z.event,
        newMatcher: H,
        onChangeNewMatcher: E,
        eventDescription: n[Z.event].description,
        matcherMetadata: Z.matcherMetadata,
        onCancel: () => {
          Y({
            mode: "select-matcher",
            event: Z.event,
            matcherMetadata: Z.matcherMetadata
          }), E("")
        }
      });
    case "delete-matcher":
      return e6.createElement(U79, {
        selectedMatcher: Z.matcher,
        selectedEvent: Z.event,
        onDelete: AA,
        onCancel: () => Y({
          mode: "select-matcher",
          event: Z.event,
          matcherMetadata: Z.matcherMetadata
        })
      });
    case "select-hook":
      return e6.createElement(N79, {
        selectedEvent: Z.event,
        selectedMatcher: Z.matcher,
        hooksForSelectedMatcher: b,
        hookEventMetadata: n[Z.event],
        onSelect: (TA) => {
          if (TA === null) Y({
            mode: "add-hook",
            event: Z.event,
            matcher: Z.matcher
          });
          else Y({
            mode: "delete-hook",
            event: Z.event,
            hook: TA
          })
        },
        onCancel: () => {
          let TA = Oe(Z.event, _);
          if (TA !== void 0) Y({
            mode: "select-matcher",
            event: Z.event,
            matcherMetadata: TA
          });
          else Y({
            mode: "select-event"
          })
        }
      });
    case "add-hook":
      return e6.createElement($79, {
        selectedEvent: Z.event,
        selectedMatcher: Z.matcher,
        eventDescription: j79(Z.event, _),
        fullDescription: n[Z.event].description,
        supportsMatcher: Oe(Z.event, _) !== void 0,
        command: V,
        onChangeCommand: F,
        onCancel: () => {
          Y({
            mode: "select-hook",
            event: Z.event,
            matcher: Z.matcher
          }), F("")
        }
      });
    case "delete-hook":
      return e6.createElement(L79, {
        selectedHook: Z.hook,
        eventSupportsMatcher: Oe(Z.event, _) !== void 0,
        onDelete: f,
        onCancel: () => {
          let {
            event: TA,
            hook: bA
          } = Z;
          Y({
            mode: "select-hook",
            event: TA,
            matcher: bA.matcher || ""
          })
        }
      })
  }
}
// @from(Ln 427100, Col 4)
e6
// @from(Ln 427100, Col 8)
DD
// @from(Ln 427101, Col 4)
S79 = w(() => {
  Z3();
  fA();
  bb();
  W79();
  V79();
  H79();
  z79();
  C79();
  q79();
  w79();
  O79();
  u8();
  T79();
  OVA();
  hB();
  rY();
  GB();
  F91();
  Z0();
  e6 = c(QA(), 1), DD = c(QA(), 1)
})
// @from(Ln 427123, Col 4)
XT0
// @from(Ln 427123, Col 9)
yF7
// @from(Ln 427123, Col 14)
x79
// @from(Ln 427124, Col 4)
y79 = w(() => {
  S79();
  az();
  Z0();
  XT0 = c(QA(), 1), yF7 = {
    type: "local-jsx",
    name: "hooks",
    description: "Manage hook configurations for tool events",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, Q) {
      l("tengu_hooks_command", {});
      let G = (await Q.getAppState()).toolPermissionContext,
        Z = F$(G).map((Y) => Y.name);
      return XT0.createElement(P79, {
        toolNames: Z,
        onExit: A
      })
    },
    userFacingName() {
      return "hooks"
    }
  }, x79 = yF7
})
// @from(Ln 427151, Col 4)
kF7
// @from(Ln 427151, Col 9)
v79
// @from(Ln 427152, Col 4)
k79 = w(() => {
  V2();
  pC();
  kF7 = {
    type: "local",
    name: "files",
    description: "List all files currently in context",
    isEnabled: () => !1,
    isHidden: !1,
    supportsNonInteractive: !0,
    async call(A, Q) {
      let B = Q.readFileState ? FS(Q.readFileState) : [];
      if (B.length === 0) return {
        type: "text",
        value: "No files in context"
      };
      return {
        type: "text",
        value: `Files in context:
${B.map((Z)=>vF7(o1(),Z)).join(`
`)}`
      }
    },
    userFacingName() {
      return "files"
    }
  }, v79 = kF7
})
// @from(Ln 427180, Col 4)
Gh
// @from(Ln 427181, Col 4)
b79 = w(() => {
  Gh = {
    FOLDER_NAME: ".claude",
    AGENTS_DIR: "agents"
  }
})
// @from(Ln 427191, Col 0)
function f79(A, Q, B, G, Z, Y) {
  let J = Q.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\\\n"),
    I = B === void 0 || B.length === 1 && B[0] === "*" ? "" : `
tools: ${B.join(", ")}`,
    D = Y ? `
model: ${Y}` : "",
    W = Z ? `
color: ${Z}` : "";
  return `---
name: ${A}
description: "${J}"${I}${D}${W}
---

${G}
`
}
// @from(Ln 427208, Col 0)
function hz1(A) {
  switch (A) {
    case "flagSettings":
      throw Error(`Cannot get directory path for ${A} agents`);
    case "userSettings":
      return Cp(zQ(), Gh.AGENTS_DIR);
    case "projectSettings":
      return Cp(o1(), Gh.FOLDER_NAME, Gh.AGENTS_DIR);
    case "policySettings":
      return Cp(xL(), Gh.FOLDER_NAME, Gh.AGENTS_DIR);
    case "localSettings":
      return Cp(o1(), Gh.FOLDER_NAME, Gh.AGENTS_DIR)
  }
}
// @from(Ln 427223, Col 0)
function h79(A) {
  switch (A) {
    case "projectSettings":
      return Cp(".", Gh.FOLDER_NAME, Gh.AGENTS_DIR);
    default:
      return hz1(A)
  }
}
// @from(Ln 427232, Col 0)
function IT0(A) {
  let Q = hz1(A.source);
  return Cp(Q, `${A.agentType}.md`)
}
// @from(Ln 427237, Col 0)
function gz1(A) {
  if (A.source === "built-in") return "Built-in";
  if (A.source === "plugin") throw Error("Cannot get file path for plugin agents");
  let Q = hz1(A.source),
    B = A.filename || A.agentType;
  return Cp(Q, `${B}.md`)
}
// @from(Ln 427245, Col 0)
function g79(A) {
  if (A.source === "built-in") return "Built-in";
  let Q = h79(A.source);
  return Cp(Q, `${A.agentType}.md`)
}
// @from(Ln 427251, Col 0)
function u79(A) {
  if (p_(A)) return "Built-in";
  if (qY1(A)) return `Plugin: ${A.plugin||"Unknown"}`;
  let Q = h79(A.source),
    B = A.filename || A.agentType;
  return Cp(Q, `${B}.md`)
}