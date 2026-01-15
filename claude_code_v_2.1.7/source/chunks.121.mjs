
// @from(Ln 357870, Col 0)
async function au2() {
  let A = [],
    [Q, B, G, Z] = await Promise.all([qK1(), bu2(), fu2(), aS()]);
  if (Q) A.push({
    type: "not_logged_in"
  });
  if (!B) A.push({
    type: "no_remote_environment"
  });
  if (!G) A.push({
    type: "not_in_git_repo"
  });
  if (Z) {
    let [Y, J] = Z.split("/");
    if (Y && J) {
      if (!await hu2(Y, J)) A.push({
        type: "github_app_not_installed"
      })
    }
  }
  return A
}
// @from(Ln 357892, Col 4)
ou2 = w(() => {
  Zq0();
  L6A()
})
// @from(Ln 357896, Col 0)
async function ru2() {
  let A = await au2();
  if (A.length > 0) return {
    eligible: !1,
    errors: A
  };
  return {
    eligible: !0
  }
}
// @from(Ln 357907, Col 0)
function su2(A) {
  switch (A.type) {
    case "not_logged_in":
      return "Please run /login and sign in with your Claude.ai account (not Console).";
    case "no_remote_environment":
      return "No environments available, please ensure you've gone through onboarding at claude.ai/code";
    case "not_in_git_repo":
      return "Background tasks require a git repository. Initialize git or run from a git repository.";
    case "github_app_not_installed":
      return `The Claude GitHub app must be installed on this repository first.
https://github.com/apps/claude/installations/new`
  }
}
// @from(Ln 357921, Col 0)
function Fi5(A, Q, B, G) {
  let Z = B === "completed" ? "completed successfully" : B === "failed" ? "failed" : "was killed",
    Y = aY(A),
    J = `<${zF}>
<${IO}>${A}</${IO}>
<${p51}>remote_agent</${p51}>
<${Kb}>${Y}</${Kb}>
<${hz}>${B}</${hz}>
<${gz}>Remote task "${Q}" ${Z}</${gz}>
</${zF}>
Read the output file to retrieve the result: ${Y}`;
  wF({
    value: J,
    mode: "task-notification"
  }, G), oY(A, G, (X) => ({
    ...X,
    notified: !0
  }))
}
// @from(Ln 357941, Col 0)
function Hi5(A) {
  let Q = A.findLast((Z) => Z.type === "assistant" && Z.message.content.some((Y) => Y.type === "tool_use" && Y.name === vD.name));
  if (!Q) return [];
  let B = Q.message.content.find((Z) => Z.type === "tool_use" && Z.name === vD.name)?.input;
  if (!B) return [];
  let G = vD.inputSchema.safeParse(B);
  if (!G.success) return [];
  return G.data.todos
}
// @from(Ln 357950, Col 0)
async function Ei5(A, Q) {
  try {
    let B = await CF({
        systemPrompt: ["You are given a few messages from a conversation, as well as a summary of the conversation so far. Your task is to summarize the new messages in the conversation based on the summary so far. Aim for 1-2 sentences at most, focusing on the most important details. The summary MUST be in <summary>summary goes here</summary> tags. If there is no new information, return an empty string: <summary></summary>."],
        userPrompt: `Summary so far: ${Q}

New messages: ${eA(A)}`,
        signal: new AbortController().signal,
        options: {
          querySource: "background_task_summarize_delta",
          agents: [],
          isNonInteractiveSession: !1,
          hasAppendSystemPrompt: !1,
          mcpTools: []
        }
      }),
      G = Xt(B);
    if (!G) return null;
    return Q9(G, "summary")
  } catch (B) {
    return e(B instanceof Error ? B : Error(String(B))), null
  }
}
// @from(Ln 357974, Col 0)
function zi5(A, Q) {
  let B = !0,
    G = 1000,
    Z = async () => {
      if (!B) return;
      try {
        let J = (await Q.getAppState()).tasks?.[A];
        if (!J || J.status !== "running") return;
        let X = await nu2(J.sessionId),
          I = X.log.find((V) => V.type === "result"),
          D = I ? I.subtype === "success" ? "completed" : "failed" : X.log.length > 0 ? "running" : "starting",
          W = X.log.slice(J.log.length),
          K = null;
        if (W.length > 0) {
          let V = J.deltaSummarySinceLastFlushToAttachment;
          K = await Ei5(W, V);
          let F = W.map((H) => {
            if (H.type === "assistant") return H.message.content.filter((E) => E.type === "text").map((E) => ("text" in E) ? E.text : "").join(`
`);
            return eA(H)
          }).join(`
`);
          if (F) g9A(A, F + `
`)
        }
        if (oY(A, Q.setAppState, (V) => ({
            ...V,
            status: D === "starting" ? "running" : D,
            log: X.log,
            todoList: Hi5(X.log),
            deltaSummarySinceLastFlushToAttachment: K,
            endTime: I ? Date.now() : void 0
          })), I) {
          let V = I.subtype === "success" ? "completed" : "failed";
          Fi5(A, J.title, V, Q.setAppState);
          return
        }
      } catch (Y) {
        e(Y instanceof Error ? Y : Error(String(Y)))
      }
      if (B) setTimeout(Z, G)
    };
  return Z(), () => {
    B = !1
  }
}
// @from(Ln 358021, Col 0)
function lbA(A) {
  return `https://claude.ai/code/${A}`
}
// @from(Ln 358025, Col 0)
function eu2(A) {
  return `claude --teleport ${A}`
}
// @from(Ln 358028, Col 4)
yc
// @from(Ln 358028, Col 8)
tu2
// @from(Ln 358029, Col 4)
jK1 = w(() => {
  fA();
  EVA();
  v1();
  T1();
  VO();
  xr();
  cC();
  Jt();
  nY();
  tQ();
  SIA();
  ou2();
  A0();
  cD();
  yc = c(QA(), 1);
  tu2 = {
    name: "RemoteAgentTask",
    type: "remote_agent",
    async spawn(A, Q) {
      let {
        command: B,
        title: G
      } = A, {
        setAppState: Z,
        abortController: Y
      } = Q;
      k(`RemoteAgentTask spawning: ${G}`);
      let J = await cbA({
        initialMessage: B,
        description: G,
        signal: Y.signal
      });
      if (!J) throw Error("Failed to create remote session");
      let X = J.id,
        I = `r${X.substring(0,6)}`;
      Zr(I);
      let D = {
        ...KO(I, "remote_agent", G),
        type: "remote_agent",
        status: "running",
        sessionId: X,
        command: B,
        title: J.title || G,
        todoList: [],
        log: [],
        deltaSummarySinceLastFlushToAttachment: null
      };
      FO(D, Z);
      let W = zi5(I, Q);
      return {
        taskId: I,
        cleanup: () => {
          W()
        }
      }
    },
    async kill(A, Q) {
      oY(A, Q.setAppState, (B) => {
        if (B.status !== "running") return B;
        return {
          ...B,
          status: "killed",
          endTime: Date.now()
        }
      }), k(`RemoteAgentTask ${A} marked as killed (local only)`)
    },
    renderStatus(A) {
      let Q = A,
        B = Q.status,
        G = Q.title;
      return yc.createElement(T, null, yc.createElement(C, {
        color: B === "running" ? "warning" : B === "completed" ? "success" : B === "failed" ? "error" : "inactive"
      }, "[", B, "] ", G))
    },
    renderOutput(A) {
      return yc.createElement(T, null, yc.createElement(C, null, A))
    },
    getProgressMessage(A) {
      let B = A.deltaSummarySinceLastFlushToAttachment;
      if (!B) return null;
      return `Remote task ${A.id} progress: ${B}. Read ${A.outputFile} to see full output.`
    }
  }
})
// @from(Ln 358115, Col 0)
function $i5() {
  return [es, kZ1, tu2]
}
// @from(Ln 358119, Col 0)
function Am2(A) {
  return $i5().find((Q) => Q.type === A)
}
// @from(Ln 358122, Col 4)
Qm2 = w(() => {
  v6A();
  YyA();
  jK1()
})
// @from(Ln 358128, Col 0)
function oY(A, Q, B) {
  Q((G) => {
    let Z = G.tasks?.[A];
    if (!Z) return G;
    return {
      ...G,
      tasks: {
        ...G.tasks,
        [A]: B(Z)
      }
    }
  })
}
// @from(Ln 358142, Col 0)
function FO(A, Q) {
  Q((B) => ({
    ...B,
    tasks: {
      ...B.tasks,
      [A.id]: A
    }
  }))
}
// @from(Ln 358152, Col 0)
function Bm2(A) {
  if (A.type === "local_bash") {
    let Q = A;
    return {
      ...Q,
      lastReportedStdoutLines: Q.stdoutLineCount,
      lastReportedStderrLines: Q.stderrLineCount
    }
  }
  if (A.type === "local_agent") {
    let Q = A;
    return {
      ...Q,
      lastReportedToolCount: Q.progress?.toolUseCount ?? 0,
      lastReportedTokenCount: Q.progress?.tokenCount ?? 0
    }
  }
  return A
}
// @from(Ln 358172, Col 0)
function Gm2(A) {
  let Q = [],
    B = [],
    G = {},
    Z = A.tasks ?? {};
  for (let Y of Object.values(Z)) {
    if (Y.notified && Y.status !== "running") continue;
    let J = null;
    if (Y.status === "running") {
      let X = XY0(Y.id, Y.outputOffset);
      if (X.content) {
        let {
          content: W
        } = bbA(X.content, Y.id);
        J = W, G[Y.id] = {
          ...Y,
          outputOffset: X.newOffset
        }
      }
      let D = Am2(Y.type)?.getProgressMessage(Y) ?? null;
      if (D) B.push({
        type: "task_progress",
        taskId: Y.id,
        taskType: Y.type,
        message: D
      })
    }
    if (Y.status !== "running" && Y.status !== "pending" && !Y.notified) {
      let X = XY0(Y.id, Y.outputOffset);
      if (X.content) {
        let {
          content: I
        } = bbA(X.content, Y.id);
        J = I
      }
      Q.push({
        type: "task_status",
        taskId: Y.id,
        taskType: Y.type,
        status: Y.status,
        description: Y.description,
        deltaSummary: J
      }), G[Y.id] = {
        ...G[Y.id] ?? Y,
        notified: !0,
        outputOffset: X.newOffset
      }
    }
  }
  return {
    attachments: Q,
    progressAttachments: B,
    updatedTasks: G
  }
}
// @from(Ln 358227, Col 4)
xr = w(() => {
  cC();
  VO();
  Qm2();
  RU0();
  cD()
})
// @from(Ln 358238, Col 0)
function qi5() {
  return `s${Ci5().replace(/-/g,"").substring(0,6)}`
}
// @from(Ln 358242, Col 0)
function Ym2(A, Q, B, G) {
  let Z = qi5();
  OKA(Z, uz());
  let Y = G ?? c9(),
    J = C6(async () => {
      Q((D) => {
        let {
          [Z]: W, ...K
        } = D.tasks;
        return {
          ...D,
          tasks: K
        }
      })
    }),
    X = B ?? Ui5,
    I = {
      ...KO(Z, "local_agent", A),
      type: "local_agent",
      status: "running",
      agentId: Z,
      prompt: A,
      selectedAgent: X,
      agentType: "main-session",
      abortController: Y,
      unregisterCleanup: J,
      retrieved: !1,
      lastReportedToolCount: 0,
      lastReportedTokenCount: 0,
      isBackgrounded: !0
    };
  return k(`[LocalMainSessionTask] Registering task ${Z} with description: ${A}`), FO(I, Q), Q((D) => {
    let W = Z in D.tasks;
    return k(`[LocalMainSessionTask] After registration, task ${Z} exists in state: ${W}`), D
  }), {
    taskId: Z,
    abortSignal: Y.signal
  }
}
// @from(Ln 358282, Col 0)
function Zm2(A, Q, B) {
  let G = !0;
  if (oY(A, B, (Z) => {
      if (Z.status !== "running") return Z;
      return G = Z.isBackgrounded ?? !0, Z.unregisterCleanup?.(), {
        ...Z,
        status: Q ? "completed" : "failed",
        endTime: Date.now()
      }
    }), G) Ni5(A, "Background session", Q ? "completed" : "failed", B)
}
// @from(Ln 358294, Col 0)
function Ni5(A, Q, B, G) {
  let Z = B === "completed" ? `Background session "${Q}" completed` : `Background session "${Q}" failed`,
    Y = aY(A),
    J = `<${zF}>
<${IO}>${A}</${IO}>
<${Kb}>${Y}</${Kb}>
<${hz}>${B}</${hz}>
<${gz}>${Z}</${gz}>
</${zF}>
Read the output file to retrieve the result: ${Y}`;
  wF({
    value: J,
    mode: "task-notification"
  }, G), oY(A, G, (X) => ({
    ...X,
    notified: !0
  }))
}
// @from(Ln 358313, Col 0)
function Jm2(A, Q) {
  let B;
  return Q((G) => {
    let Z = G.tasks[A];
    if (!Z || Z.type !== "local_agent") return G;
    B = Z.messages;
    let Y = G.foregroundedTaskId,
      J = Y ? G.tasks[Y] : void 0,
      X = Y && Y !== A && J?.type === "local_agent";
    return {
      ...G,
      foregroundedTaskId: A,
      tasks: {
        ...G.tasks,
        ...X && {
          [Y]: {
            ...J,
            isBackgrounded: !0
          }
        },
        [A]: {
          ...Z,
          isBackgrounded: !1
        }
      }
    }
  }), B
}
// @from(Ln 358342, Col 0)
function Xm2(A) {
  if (typeof A !== "object" || A === null || !("type" in A) || !("agentType" in A)) return !1;
  return A.type === "local_agent" && A.agentType === "main-session"
}
// @from(Ln 358347, Col 0)
function Im2(A, Q, B, G, Z = [], Y) {
  (async () => {
    try {
      let J = [...Z],
        X = [],
        I = 0,
        D = 0;
      while (!0) {
        if (Y?.aborted) {
          G(J);
          return
        }
        let {
          done: W,
          value: K
        } = await A.next();
        if (W) break;
        if (K.type === "user" || K.type === "assistant" || K.type === "system") {
          if (J.push(K), K.type === "assistant") {
            for (let V of K.message.content)
              if (V.type === "text") D += Math.round(V.text.length / 4);
              else if (V.type === "tool_use") {
              I++;
              let F = {
                toolName: V.name,
                input: V.input
              };
              if (X.push(F), X.length > wi5) X.shift()
            }
          }
          B((V) => {
            let F = V.tasks[Q];
            if (!F || F.type !== "local_agent") return V;
            return {
              ...V,
              tasks: {
                ...V.tasks,
                [Q]: {
                  ...F,
                  progress: {
                    tokenCount: D,
                    toolUseCount: I,
                    recentActivities: [...X]
                  },
                  messages: J
                }
              }
            }
          })
        }
      }
      G(J), Zm2(Q, !0, B)
    } catch (J) {
      e(J instanceof Error ? J : Error(String(J))), Zm2(Q, !1, B)
    }
  })()
}
// @from(Ln 358404, Col 4)
Ui5
// @from(Ln 358404, Col 9)
wi5 = 5
// @from(Ln 358405, Col 4)
TK1 = w(() => {
  EVA();
  cC();
  xr();
  T1();
  v1();
  d4();
  VO();
  nX();
  iZ();
  cD();
  Ui5 = {
    agentType: "main-session",
    whenToUse: "Main session query",
    source: "userSettings",
    getSystemPrompt: () => ""
  }
})
// @from(Ln 358424, Col 0)
function It(A) {
  return typeof A === "object" && A !== null && "type" in A && A.type === "local_bash"
}
// @from(Ln 358428, Col 0)
function ibA(A, Q, B, G, Z) {
  let Y = B === "completed" ? `completed${G!==void 0?` (exit code ${G})`:""}` : B === "failed" ? `failed${G!==void 0?` with exit code ${G}`:""}` : "was killed",
    J = aY(A),
    X = `<${zF}>
<${IO}>${A}</${IO}>
<${Kb}>${J}</${Kb}>
<${hz}>${B}</${hz}>
<${gz}>Background command "${Q}" ${Y}</${gz}>
</${zF}>
Read the output file to retrieve the result: ${J}`;
  wF({
    value: X,
    mode: "task-notification"
  }, Z), oY(A, Z, (I) => ({
    ...I,
    notified: !0
  }))
}
// @from(Ln 358447, Col 0)
function Iq0(A, Q) {
  oY(A, Q, (B) => {
    if (B.status !== "running" || !It(B)) return B;
    try {
      k(`LocalBashTask ${A} kill requested`), B.shellCommand?.kill()
    } catch (G) {
      e(G instanceof Error ? G : Error(String(G)))
    }
    if (B.unregisterCleanup?.(), B.cleanupTimeoutId) clearTimeout(B.cleanupTimeoutId);
    return {
      ...B,
      status: "killed",
      shellCommand: null,
      unregisterCleanup: void 0,
      cleanupTimeoutId: void 0,
      endTime: Date.now()
    }
  })
}
// @from(Ln 358467, Col 0)
function Dm2(A, Q) {
  let {
    command: B,
    description: G,
    shellCommand: Z
  } = A, Y = GyA("local_bash");
  Zr(Y);
  let J = C6(async () => {
      Iq0(Y, Q)
    }),
    X = {
      ...KO(Y, "local_bash", G),
      type: "local_bash",
      status: "running",
      command: B,
      completionStatusSentInAttachment: !1,
      shellCommand: Z,
      unregisterCleanup: J,
      stdoutLineCount: 0,
      stderrLineCount: 0,
      lastReportedStdoutLines: 0,
      lastReportedStderrLines: 0,
      isBackgrounded: !1
    };
  return FO(X, Q), Y
}
// @from(Ln 358494, Col 0)
function Li5(A, Q, B) {
  let Z = Q().tasks[A];
  if (!It(Z) || Z.isBackgrounded || !Z.shellCommand) return !1;
  let {
    shellCommand: Y,
    description: J
  } = Z, X = Y.background(A);
  if (!X) return !1;
  return B((I) => {
    let D = I.tasks[A];
    if (!It(D) || D.isBackgrounded) return I;
    return {
      ...I,
      tasks: {
        ...I.tasks,
        [A]: {
          ...D,
          isBackgrounded: !0
        }
      }
    }
  }), X.stdoutStream.on("data", (I) => {
    let D = I.toString();
    g9A(A, D);
    let W = D.split(`
`).filter((K) => K.length > 0).length;
    oY(A, B, (K) => ({
      ...K,
      stdoutLineCount: K.stdoutLineCount + W
    }))
  }), X.stderrStream.on("data", (I) => {
    let D = I.toString();
    g9A(A, `[stderr] ${D}`);
    let W = D.split(`
`).filter((K) => K.length > 0).length;
    oY(A, B, (K) => ({
      ...K,
      stderrLineCount: K.stderrLineCount + W
    }))
  }), Y.result.then((I) => {
    let D = !1,
      W;
    if (oY(A, B, (K) => {
        if (K.status === "killed") return D = !0, K;
        return W = K.unregisterCleanup, {
          ...K,
          status: I.code === 0 ? "completed" : "failed",
          result: {
            code: I.code,
            interrupted: I.interrupted
          },
          shellCommand: null,
          unregisterCleanup: void 0,
          endTime: Date.now()
        }
      }), W?.(), D) ibA(A, J, "killed", I.code, B);
    else {
      let K = I.code === 0 ? "completed" : "failed";
      ibA(A, J, K, I.code, B)
    }
  }), !0
}
// @from(Ln 358557, Col 0)
function Wm2(A) {
  return Object.values(A.tasks).some((Q) => {
    if (It(Q) && !Q.isBackgrounded && Q.shellCommand) return !0;
    if (Sr(Q) && !Q.isBackgrounded && !Xm2(Q)) return !0;
    return !1
  })
}
// @from(Ln 358565, Col 0)
function vD1(A, Q) {
  let B = A(),
    G = Object.keys(B.tasks).filter((Y) => {
      let J = B.tasks[Y];
      return It(J) && !J.isBackgrounded && J.shellCommand
    });
  for (let Y of G) Li5(Y, A, Q);
  let Z = Object.keys(B.tasks).filter((Y) => {
    let J = B.tasks[Y];
    return Sr(J) && !J.isBackgrounded
  });
  for (let Y of Z) M32(Y, A, Q)
}
// @from(Ln 358579, Col 0)
function Km2(A, Q) {
  let B;
  Q((G) => {
    let Z = G.tasks[A];
    if (!It(Z) || Z.isBackgrounded) return G;
    B = Z.unregisterCleanup;
    let {
      [A]: Y, ...J
    } = G.tasks;
    return {
      ...G,
      tasks: J
    }
  }), B?.()
}
// @from(Ln 358594, Col 4)
vc
// @from(Ln 358594, Col 8)
es
// @from(Ln 358595, Col 4)
v6A = w(() => {
  fA();
  EVA();
  nX();
  v1();
  T1();
  VO();
  xr();
  cC();
  YyA();
  TK1();
  cD();
  vc = c(QA(), 1);
  es = {
    name: "LocalBashTask",
    type: "local_bash",
    async spawn(A, Q) {
      let {
        command: B,
        description: G,
        shellCommand: Z
      } = A, {
        setAppState: Y
      } = Q, J = GyA("local_bash");
      Zr(J);
      let X = C6(async () => {
          Iq0(J, Y)
        }),
        I = {
          ...KO(J, "local_bash", G),
          type: "local_bash",
          status: "running",
          command: B,
          completionStatusSentInAttachment: !1,
          shellCommand: Z,
          unregisterCleanup: X,
          stdoutLineCount: 0,
          stderrLineCount: 0,
          lastReportedStdoutLines: 0,
          lastReportedStderrLines: 0,
          isBackgrounded: !0
        };
      FO(I, Y);
      let D = Z.background(J);
      if (!D) return Z.result.then((W) => {
        let K = W.code === 0 ? "completed" : "failed";
        oY(J, Y, (V) => ({
          ...V,
          status: K,
          result: {
            code: W.code,
            interrupted: W.interrupted
          },
          endTime: Date.now()
        })), ibA(J, G, K, W.code, Y)
      }), {
        taskId: J
      };
      return D.stdoutStream.on("data", (W) => {
        let K = W.toString();
        g9A(J, K);
        let V = K.split(`
`).filter((F) => F.length > 0).length;
        oY(J, Y, (F) => ({
          ...F,
          stdoutLineCount: F.stdoutLineCount + V
        }))
      }), D.stderrStream.on("data", (W) => {
        let K = W.toString();
        g9A(J, `[stderr] ${K}`);
        let V = K.split(`
`).filter((F) => F.length > 0).length;
        oY(J, Y, (F) => ({
          ...F,
          stderrLineCount: F.stderrLineCount + V
        }))
      }), Z.result.then((W) => {
        let K = !1;
        if (oY(J, Y, (V) => {
            if (V.status === "killed") return K = !0, V;
            return {
              ...V,
              status: W.code === 0 ? "completed" : "failed",
              result: {
                code: W.code,
                interrupted: W.interrupted
              },
              shellCommand: null,
              unregisterCleanup: void 0,
              endTime: Date.now()
            }
          }), K) ibA(J, G, "killed", W.code, Y);
        else {
          let V = W.code === 0 ? "completed" : "failed";
          ibA(J, G, V, W.code, Y)
        }
      }), {
        taskId: J,
        cleanup: () => {
          X()
        }
      }
    },
    async kill(A, Q) {
      Iq0(A, Q.setAppState)
    },
    renderStatus(A) {
      if (!It(A)) return null;
      let {
        status: Q,
        command: B
      } = A;
      return vc.createElement(T, null, vc.createElement(C, {
        color: Q === "running" ? "warning" : Q === "completed" ? "success" : Q === "failed" ? "error" : "inactive"
      }, "[", Q, "] ", B))
    },
    renderOutput(A) {
      return vc.createElement(T, null, vc.createElement(C, null, A))
    },
    getProgressMessage(A) {
      if (!It(A)) return null;
      let Q = A.stdoutLineCount - A.lastReportedStdoutLines,
        B = A.stderrLineCount - A.lastReportedStderrLines;
      if (Q === 0 && B === 0) return null;
      let G = [];
      if (Q > 0) G.push(`${Q} line${Q>1?"s":""} of stdout`);
      if (B > 0) G.push(`${B} line${B>1?"s":""} of stderr`);
      return `Background bash ${A.id} has new output: ${G.join(", ")}. Read ${A.outputFile} to see output.`
    }
  }
})
// @from(Ln 358727, Col 0)
function Oi5(A) {
  for (let Q of A) {
    if (typeof Q !== "string") continue;
    let B = (Q.match(/{/g) || []).length,
      G = (Q.match(/}/g) || []).length;
    if (B !== G) return !0;
    let Z = (Q.match(/\(/g) || []).length,
      Y = (Q.match(/\)/g) || []).length;
    if (Z !== Y) return !0;
    let J = (Q.match(/\[/g) || []).length,
      X = (Q.match(/\]/g) || []).length;
    if (J !== X) return !0;
    if ((Q.match(/(?<!\\)"/g) || []).length % 2 !== 0) return !0;
    if ((Q.match(/(?<!\\)'/g) || []).length % 2 !== 0) return !0
  }
  return !1
}
// @from(Ln 358745, Col 0)
function Ri5(A, Q = !1) {
  let B = "",
    G = "",
    Z = !1,
    Y = !1,
    J = !1;
  for (let X = 0; X < A.length; X++) {
    let I = A[X];
    if (J) {
      if (J = !1, !Z) B += I;
      if (!Z && !Y) G += I;
      continue
    }
    if (I === "\\") {
      if (J = !0, !Z) B += I;
      if (!Z && !Y) G += I;
      continue
    }
    if (I === "'" && !Y) {
      Z = !Z;
      continue
    }
    if (I === '"' && !Z) {
      if (Y = !Y, !Q) continue
    }
    if (!Z) B += I;
    if (!Z && !Y) G += I
  }
  return {
    withDoubleQuotes: B,
    fullyUnquoted: G
  }
}
// @from(Ln 358779, Col 0)
function _i5(A) {
  return A.replace(/\s+2\s*>&\s*1(?=\s|$)/g, "").replace(/[012]?\s*>\s*\/dev\/null/g, "").replace(/\s*<\s*\/dev\/null/g, "")
}
// @from(Ln 358783, Col 0)
function ji5(A, Q) {
  if (Q.length !== 1) throw Error("hasUnescapedChar only works with single characters");
  let B = 0;
  while (B < A.length) {
    if (A[B] === "\\" && B + 1 < A.length) {
      B += 2;
      continue
    }
    if (A[B] === Q) return !0;
    B++
  }
  return !1
}
// @from(Ln 358797, Col 0)
function Ti5(A) {
  if (!A.originalCommand.trim()) return {
    behavior: "allow",
    updatedInput: {
      command: A.originalCommand
    },
    decisionReason: {
      type: "other",
      reason: "Empty command is safe"
    }
  };
  return {
    behavior: "passthrough",
    message: "Command is not empty"
  }
}
// @from(Ln 358814, Col 0)
function Pi5(A) {
  let {
    originalCommand: Q
  } = A, B = Q.trim();
  if (/^\s*\t/.test(Q)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.INCOMPLETE_COMMANDS,
    subId: 1
  }), {
    behavior: "ask",
    message: "Command appears to be an incomplete fragment (starts with tab)"
  };
  if (B.startsWith("-")) return l("tengu_bash_security_check_triggered", {
    checkId: eY.INCOMPLETE_COMMANDS,
    subId: 2
  }), {
    behavior: "ask",
    message: "Command appears to be an incomplete fragment (starts with flags)"
  };
  if (/^\s*(&&|\|\||;|>>?|<)/.test(Q)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.INCOMPLETE_COMMANDS,
    subId: 3
  }), {
    behavior: "ask",
    message: "Command appears to be a continuation line (starts with operator)"
  };
  return {
    behavior: "passthrough",
    message: "Command appears complete"
  }
}
// @from(Ln 358845, Col 0)
function Si5(A) {
  if (!Dq0.test(A)) return !1;
  let Q = /\$\(cat\s*<<-?\s*(?:'+([A-Za-z_]\w*)'+|\\([A-Za-z_]\w*))/g,
    B, G = [];
  while ((B = Q.exec(A)) !== null) {
    let Y = B[1] || B[2];
    if (Y) G.push({
      start: B.index,
      delimiter: Y
    })
  }
  if (G.length === 0) return !1;
  for (let {
      start: Y,
      delimiter: J
    }
    of G) {
    let X = A.substring(Y),
      I = J.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (!new RegExp(`(?:
|^[^\\n]*
)${I}\\s*\\)`).test(X)) return !1;
    let W = new RegExp(`^\\$\\(cat\\s*<<-?\\s*(?:'+${I}'+|\\\\${I})[^\\n]*\\n(?:[\\s\\S]*?\\n)?${I}\\s*\\)`);
    if (!X.match(W)) return !1
  }
  let Z = A;
  for (let {
      delimiter: Y
    }
    of G) {
    let J = Y.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      X = new RegExp(`\\$\\(cat\\s*<<-?\\s*(?:'+${J}'+|\\\\${J})[^\\n]*\\n(?:[\\s\\S]*?\\n)?${J}\\s*\\)`);
    Z = Z.replace(X, "")
  }
  if (/\$\(/.test(Z)) return !1;
  if (/\${/.test(Z)) return !1;
  return !0
}
// @from(Ln 358884, Col 0)
function xi5(A) {
  let {
    originalCommand: Q
  } = A;
  if (!Dq0.test(Q)) return {
    behavior: "passthrough",
    message: "No heredoc in substitution"
  };
  if (Si5(Q)) return {
    behavior: "allow",
    updatedInput: {
      command: Q
    },
    decisionReason: {
      type: "other",
      reason: "Safe command substitution: cat with quoted/escaped heredoc delimiter"
    }
  };
  return {
    behavior: "passthrough",
    message: "Command substitution needs validation"
  }
}
// @from(Ln 358908, Col 0)
function yi5(A) {
  let {
    originalCommand: Q,
    baseCommand: B
  } = A;
  if (B !== "git" || !/^git\s+commit\s+/.test(Q)) return {
    behavior: "passthrough",
    message: "Not a git commit"
  };
  let G = Q.match(/^git\s+commit\s+.*-m\s+(["'])([\s\S]*?)\1(.*)$/);
  if (G) {
    let [, Z, Y, J] = G;
    if (Z === '"' && Y && /\$\(|`|\$\{/.test(Y)) return l("tengu_bash_security_check_triggered", {
      checkId: eY.GIT_COMMIT_SUBSTITUTION,
      subId: 1
    }), {
      behavior: "ask",
      message: "Git commit message contains command substitution patterns"
    };
    if (J && /\$\(|`|\$\{/.test(J)) return {
      behavior: "passthrough",
      message: "Check patterns in flags"
    };
    if (Y && Y.startsWith("-")) return l("tengu_bash_security_check_triggered", {
      checkId: eY.OBFUSCATED_FLAGS,
      subId: 5
    }), {
      behavior: "ask",
      message: "Command contains quoted characters in flag names"
    };
    return {
      behavior: "allow",
      updatedInput: {
        command: Q
      },
      decisionReason: {
        type: "other",
        reason: "Git commit with simple quoted message is allowed"
      }
    }
  }
  return {
    behavior: "passthrough",
    message: "Git commit needs validation"
  }
}
// @from(Ln 358955, Col 0)
function vi5(A) {
  let {
    originalCommand: Q
  } = A;
  if (Dq0.test(Q)) return {
    behavior: "passthrough",
    message: "Heredoc in substitution"
  };
  let B = /<<-?\s*'[^']+'/,
    G = /<<-?\s*\\\w+/;
  if (B.test(Q) || G.test(Q)) return {
    behavior: "allow",
    updatedInput: {
      command: Q
    },
    decisionReason: {
      type: "other",
      reason: "Heredoc with quoted/escaped delimiter is safe"
    }
  };
  return {
    behavior: "passthrough",
    message: "No heredoc patterns"
  }
}
// @from(Ln 358981, Col 0)
function ki5(A) {
  let {
    originalCommand: Q,
    baseCommand: B
  } = A;
  if (B !== "jq") return {
    behavior: "passthrough",
    message: "Not jq"
  };
  if (/\bsystem\s*\(/.test(Q)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.JQ_SYSTEM_FUNCTION,
    subId: 1
  }), {
    behavior: "ask",
    message: "jq command contains system() function which executes arbitrary commands"
  };
  let G = Q.substring(3).trim();
  if (/(?:^|\s)(?:-f\b|--from-file|--rawfile|--slurpfile|-L\b|--library-path)/.test(G)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.JQ_FILE_ARGUMENTS,
    subId: 1
  }), {
    behavior: "ask",
    message: "jq command contains dangerous flags that could execute code or read arbitrary files"
  };
  return {
    behavior: "passthrough",
    message: "jq command is safe"
  }
}
// @from(Ln 359011, Col 0)
function bi5(A) {
  let {
    unquotedContent: Q
  } = A, B = "Command contains shell metacharacters (;, |, or &) in arguments";
  if (/(?:^|\s)["'][^"']*[;&][^"']*["'](?:\s|$)/.test(Q)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.SHELL_METACHARACTERS,
    subId: 1
  }), {
    behavior: "ask",
    message: "Command contains shell metacharacters (;, |, or &) in arguments"
  };
  if ([/-name\s+["'][^"']*[;|&][^"']*["']/, /-path\s+["'][^"']*[;|&][^"']*["']/, /-iname\s+["'][^"']*[;|&][^"']*["']/].some((Z) => Z.test(Q))) return l("tengu_bash_security_check_triggered", {
    checkId: eY.SHELL_METACHARACTERS,
    subId: 2
  }), {
    behavior: "ask",
    message: "Command contains shell metacharacters (;, |, or &) in arguments"
  };
  if (/-regex\s+["'][^"']*[;&][^"']*["']/.test(Q)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.SHELL_METACHARACTERS,
    subId: 3
  }), {
    behavior: "ask",
    message: "Command contains shell metacharacters (;, |, or &) in arguments"
  };
  return {
    behavior: "passthrough",
    message: "No metacharacters"
  }
}
// @from(Ln 359042, Col 0)
function fi5(A) {
  let {
    fullyUnquotedContent: Q
  } = A;
  if (/[<>|]\s*\$[A-Za-z_]/.test(Q) || /\$[A-Za-z_][A-Za-z0-9_]*\s*[|<>]/.test(Q)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.DANGEROUS_VARIABLES,
    subId: 1
  }), {
    behavior: "ask",
    message: "Command contains variables in dangerous contexts (redirections or pipes)"
  };
  return {
    behavior: "passthrough",
    message: "No dangerous variables"
  }
}
// @from(Ln 359059, Col 0)
function hi5(A) {
  let {
    unquotedContent: Q,
    fullyUnquotedContent: B
  } = A;
  if (ji5(Q, "`")) return {
    behavior: "ask",
    message: "Command contains backticks (`) for command substitution"
  };
  for (let {
      pattern: G,
      message: Z
    }
    of Mi5)
    if (G.test(Q)) return l("tengu_bash_security_check_triggered", {
      checkId: eY.DANGEROUS_PATTERNS_COMMAND_SUBSTITUTION,
      subId: 1
    }), {
      behavior: "ask",
      message: `Command contains ${Z}`
    };
  if (/</.test(B)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.DANGEROUS_PATTERNS_INPUT_REDIRECTION,
    subId: 1
  }), {
    behavior: "ask",
    message: "Command contains input redirection (<) which could read sensitive files"
  };
  if (/>/.test(B)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.DANGEROUS_PATTERNS_OUTPUT_REDIRECTION,
    subId: 1
  }), {
    behavior: "ask",
    message: "Command contains output redirection (>) which could write to arbitrary files"
  };
  return {
    behavior: "passthrough",
    message: "No dangerous patterns"
  }
}
// @from(Ln 359100, Col 0)
function gi5(A) {
  let {
    fullyUnquotedContent: Q
  } = A;
  if (!/[\n\r]/.test(Q)) return {
    behavior: "passthrough",
    message: "No newlines"
  };
  if (/[\n\r]\s*[a-zA-Z/.~]/.test(Q)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.NEWLINES,
    subId: 1
  }), {
    behavior: "ask",
    message: "Command contains newlines that could separate multiple commands"
  };
  return {
    behavior: "passthrough",
    message: "Newlines appear to be within data"
  }
}
// @from(Ln 359121, Col 0)
function ui5(A) {
  let {
    originalCommand: Q
  } = A;
  if (/\$IFS|\$\{[^}]*IFS/.test(Q)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.IFS_INJECTION,
    subId: 1
  }), {
    behavior: "ask",
    message: "Command contains IFS variable usage which could bypass security validation"
  };
  return {
    behavior: "passthrough",
    message: "No IFS injection detected"
  }
}
// @from(Ln 359138, Col 0)
function mi5(A) {
  let {
    originalCommand: Q
  } = A;
  if (/\/proc\/.*\/environ/.test(Q)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.PROC_ENVIRON_ACCESS,
    subId: 1
  }), {
    behavior: "ask",
    message: "Command accesses /proc/*/environ which could expose sensitive environment variables"
  };
  return {
    behavior: "passthrough",
    message: "No /proc/environ access detected"
  }
}
// @from(Ln 359155, Col 0)
function di5(A) {
  let {
    originalCommand: Q
  } = A, B = bY(Q);
  if (!B.success) return {
    behavior: "passthrough",
    message: "Parse failed, handled elsewhere"
  };
  let G = B.tokens;
  if (!G.some((Y) => typeof Y === "object" && Y !== null && ("op" in Y) && (Y.op === ";" || Y.op === "&&" || Y.op === "||"))) return {
    behavior: "passthrough",
    message: "No command separators"
  };
  if (Oi5(G)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.MALFORMED_TOKEN_INJECTION,
    subId: 1
  }), {
    behavior: "ask",
    message: "Command contains ambiguous syntax with command separators that could be misinterpreted"
  };
  return {
    behavior: "passthrough",
    message: "No malformed token injection detected"
  }
}
// @from(Ln 359181, Col 0)
function ci5(A) {
  let {
    originalCommand: Q,
    baseCommand: B
  } = A, G = /[|&;]/.test(Q);
  if (B === "echo" && !G) return {
    behavior: "passthrough",
    message: "echo command is safe and has no dangerous flags"
  };
  if (/\$'[^']*'/.test(Q)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.OBFUSCATED_FLAGS,
    subId: 5
  }), {
    behavior: "ask",
    message: "Command contains ANSI-C quoting which can hide characters"
  };
  if (/\$"[^"]*"/.test(Q)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.OBFUSCATED_FLAGS,
    subId: 6
  }), {
    behavior: "ask",
    message: "Command contains locale quoting which can hide characters"
  };
  if (/\$['"]{2}\s*-/.test(Q)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.OBFUSCATED_FLAGS,
    subId: 9
  }), {
    behavior: "ask",
    message: "Command contains empty special quotes before dash (potential bypass)"
  };
  if (/(?:^|\s)(?:''|"")+\s*-/.test(Q)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.OBFUSCATED_FLAGS,
    subId: 7
  }), {
    behavior: "ask",
    message: "Command contains empty quotes before dash (potential bypass)"
  };
  let Z = !1,
    Y = !1,
    J = !1;
  for (let X = 0; X < Q.length - 1; X++) {
    let I = Q[X],
      D = Q[X + 1];
    if (J) {
      J = !1;
      continue
    }
    if (I === "\\") {
      J = !0;
      continue
    }
    if (I === "'" && !Y) {
      Z = !Z;
      continue
    }
    if (I === '"' && !Z) {
      Y = !Y;
      continue
    }
    if (Z || Y) continue;
    if (I && D && /\s/.test(I) && /['"`]/.test(D)) {
      let W = D,
        K = X + 2,
        V = "";
      while (K < Q.length && Q[K] !== W) V += Q[K], K++;
      if (K < Q.length && Q[K] === W && V.startsWith("-")) return l("tengu_bash_security_check_triggered", {
        checkId: eY.OBFUSCATED_FLAGS,
        subId: 4
      }), {
        behavior: "ask",
        message: "Command contains quoted characters in flag names"
      }
    }
    if (I && D && /\s/.test(I) && D === "-") {
      let W = X + 1,
        K = "";
      while (W < Q.length) {
        let V = Q[W];
        if (!V) break;
        if (/[\s=]/.test(V)) break;
        if (/['"`]/.test(V)) {
          if (B === "cut" && K === "-d" && /['"`]/.test(V)) break;
          if (W + 1 < Q.length) {
            let F = Q[W + 1];
            if (F && !/[a-zA-Z0-9_'"-]/.test(F)) break
          }
        }
        K += V, W++
      }
      if (K.includes('"') || K.includes("'")) return l("tengu_bash_security_check_triggered", {
        checkId: eY.OBFUSCATED_FLAGS,
        subId: 1
      }), {
        behavior: "ask",
        message: "Command contains quoted characters in flag names"
      }
    }
  }
  if (/\s['"`]-/.test(A.fullyUnquotedContent)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.OBFUSCATED_FLAGS,
    subId: 2
  }), {
    behavior: "ask",
    message: "Command contains quoted characters in flag names"
  };
  if (/['"`]{2}-/.test(A.fullyUnquotedContent)) return l("tengu_bash_security_check_triggered", {
    checkId: eY.OBFUSCATED_FLAGS,
    subId: 3
  }), {
    behavior: "ask",
    message: "Command contains quoted characters in flag names"
  };
  return {
    behavior: "passthrough",
    message: "No obfuscated flags detected"
  }
}
// @from(Ln 359299, Col 0)
function Mf(A) {
  let Q = A.split(" ")[0] || "",
    {
      withDoubleQuotes: B,
      fullyUnquoted: G
    } = Ri5(A, Q === "jq"),
    Z = {
      originalCommand: A,
      baseCommand: Q,
      unquotedContent: B,
      fullyUnquotedContent: _i5(G)
    },
    Y = [Ti5, Pi5, xi5, vi5, yi5];
  for (let X of Y) {
    let I = X(Z);
    if (I.behavior === "allow") return {
      behavior: "passthrough",
      message: I.decisionReason?.type === "other" ? I.decisionReason.reason : "Command allowed"
    };
    if (I.behavior !== "passthrough") return I
  }
  let J = [ki5, ci5, bi5, fi5, gi5, ui5, mi5, hi5, di5];
  for (let X of J) {
    let I = X(Z);
    if (I.behavior === "ask") return I
  }
  return {
    behavior: "passthrough",
    message: "Command passed all security checks"
  }
}
// @from(Ln 359330, Col 4)
Dq0
// @from(Ln 359330, Col 9)
Mi5
// @from(Ln 359330, Col 14)
eY
// @from(Ln 359331, Col 4)
PK1 = w(() => {
  Z0();
  pV();
  Dq0 = /\$\(.*<</, Mi5 = [{
    pattern: /<\(/,
    message: "process substitution <()"
  }, {
    pattern: />\(/,
    message: "process substitution >()"
  }, {
    pattern: /\$\(/,
    message: "$() command substitution"
  }, {
    pattern: /\$\{/,
    message: "${} parameter substitution"
  }, {
    pattern: /~\[/,
    message: "Zsh-style parameter expansion"
  }, {
    pattern: /\(e:/,
    message: "Zsh-style glob qualifiers"
  }, {
    pattern: /<#/,
    message: "PowerShell comment syntax"
  }], eY = {
    INCOMPLETE_COMMANDS: 1,
    JQ_SYSTEM_FUNCTION: 2,
    JQ_FILE_ARGUMENTS: 3,
    OBFUSCATED_FLAGS: 4,
    SHELL_METACHARACTERS: 5,
    DANGEROUS_VARIABLES: 6,
    NEWLINES: 7,
    DANGEROUS_PATTERNS_COMMAND_SUBSTITUTION: 8,
    DANGEROUS_PATTERNS_INPUT_REDIRECTION: 9,
    DANGEROUS_PATTERNS_OUTPUT_REDIRECTION: 10,
    IFS_INJECTION: 11,
    GIT_COMMIT_SUBSTITUTION: 12,
    PROC_ENVIRON_ACCESS: 13,
    MALFORMED_TOKEN_INJECTION: 14
  }
})
// @from(Ln 359373, Col 0)
function GEA(A) {
  if (A !== Wt) throw Error("Illegal constructor")
}
// @from(Ln 359377, Col 0)
function abA(A) {
  return !!A && typeof A.row === "number" && typeof A.column === "number"
}
// @from(Ln 359381, Col 0)
function Hm2(A) {
  F1 = A
}
// @from(Ln 359385, Col 0)
function Hq0(A, Q, B, G) {
  let Z = B - Q,
    Y = A.textCallback(Q, G);
  if (Y) {
    Q += Y.length;
    while (Q < B) {
      let J = A.textCallback(Q, G);
      if (J && J.length > 0) Q += J.length, Y += J;
      else break
    }
    if (Q > B) Y = Y.slice(0, Z)
  }
  return Y ?? ""
}
// @from(Ln 359400, Col 0)
function Fq0(A, Q, B, G, Z) {
  for (let Y = 0, J = Z.length; Y < J; Y++) {
    let X = F1.getValue(B, "i32");
    B += $9;
    let I = yX(Q, B);
    B += Gw, Z[Y] = {
      patternIndex: G,
      name: A.captureNames[X],
      node: I
    }
  }
  return B
}
// @from(Ln 359414, Col 0)
function O3(A, Q = 0) {
  let B = s2 + Q * Gw;
  F1.setValue(B, A.id, "i32"), B += $9, F1.setValue(B, A.startIndex, "i32"), B += $9, F1.setValue(B, A.startPosition.row, "i32"), B += $9, F1.setValue(B, A.startPosition.column, "i32"), B += $9, F1.setValue(B, A[0], "i32")
}
// @from(Ln 359419, Col 0)
function yX(A, Q = s2) {
  let B = F1.getValue(Q, "i32");
  if (Q += $9, B === 0) return null;
  let G = F1.getValue(Q, "i32");
  Q += $9;
  let Z = F1.getValue(Q, "i32");
  Q += $9;
  let Y = F1.getValue(Q, "i32");
  Q += $9;
  let J = F1.getValue(Q, "i32");
  return new ai5(Wt, {
    id: B,
    tree: A,
    startIndex: G,
    startPosition: {
      row: Z,
      column: Y
    },
    other: J
  })
}
// @from(Ln 359441, Col 0)
function $Y(A, Q = s2) {
  F1.setValue(Q + 0 * $9, A[0], "i32"), F1.setValue(Q + 1 * $9, A[1], "i32"), F1.setValue(Q + 2 * $9, A[2], "i32"), F1.setValue(Q + 3 * $9, A[3], "i32")
}
// @from(Ln 359445, Col 0)
function gO(A) {
  A[0] = F1.getValue(s2 + 0 * $9, "i32"), A[1] = F1.getValue(s2 + 1 * $9, "i32"), A[2] = F1.getValue(s2 + 2 * $9, "i32"), A[3] = F1.getValue(s2 + 3 * $9, "i32")
}
// @from(Ln 359449, Col 0)
function Zj(A, Q) {
  F1.setValue(A, Q.row, "i32"), F1.setValue(A + $9, Q.column, "i32")
}
// @from(Ln 359453, Col 0)
function r6A(A) {
  return {
    row: F1.getValue(A, "i32") >>> 0,
    column: F1.getValue(A + $9, "i32") >>> 0
  }
}
// @from(Ln 359460, Col 0)
function Em2(A, Q) {
  Zj(A, Q.startPosition), A += Rf, Zj(A, Q.endPosition), A += Rf, F1.setValue(A, Q.startIndex, "i32"), A += $9, F1.setValue(A, Q.endIndex, "i32"), A += $9
}
// @from(Ln 359464, Col 0)
function xK1(A) {
  let Q = {};
  return Q.startPosition = r6A(A), A += Rf, Q.endPosition = r6A(A), A += Rf, Q.startIndex = F1.getValue(A, "i32") >>> 0, A += $9, Q.endIndex = F1.getValue(A, "i32") >>> 0, Q
}
// @from(Ln 359469, Col 0)
function zm2(A, Q = s2) {
  Zj(Q, A.startPosition), Q += Rf, Zj(Q, A.oldEndPosition), Q += Rf, Zj(Q, A.newEndPosition), Q += Rf, F1.setValue(Q, A.startIndex, "i32"), Q += $9, F1.setValue(Q, A.oldEndIndex, "i32"), Q += $9, F1.setValue(Q, A.newEndIndex, "i32"), Q += $9
}
// @from(Ln 359473, Col 0)
function $m2(A) {
  let Q = {};
  return Q.major_version = F1.getValue(A, "i32"), A += $9, Q.minor_version = F1.getValue(A, "i32"), A += $9, Q.field_count = F1.getValue(A, "i32"), Q
}
// @from(Ln 359478, Col 0)
function Cm2(A, Q, B, G) {
  if (A.length !== 3) throw Error(`Wrong number of arguments to \`#${B}\` predicate. Expected 2, got ${A.length-1}`);
  if (!Fm2(A[1])) throw Error(`First argument of \`#${B}\` predicate must be a capture. Got "${A[1].value}"`);
  let Z = B === "eq?" || B === "any-eq?",
    Y = !B.startsWith("any-");
  if (Fm2(A[2])) {
    let J = A[1].name,
      X = A[2].name;
    G[Q].push((I) => {
      let D = [],
        W = [];
      for (let V of I) {
        if (V.name === J) D.push(V.node);
        if (V.name === X) W.push(V.node)
      }
      let K = O0((V, F, H) => {
        return H ? V.text === F.text : V.text !== F.text
      }, "compare");
      return Y ? D.every((V) => W.some((F) => K(V, F, Z))) : D.some((V) => W.some((F) => K(V, F, Z)))
    })
  } else {
    let J = A[1].name,
      X = A[2].value,
      I = O0((W) => W.text === X, "matches"),
      D = O0((W) => W.text !== X, "doesNotMatch");
    G[Q].push((W) => {
      let K = [];
      for (let F of W)
        if (F.name === J) K.push(F.node);
      let V = Z ? I : D;
      return Y ? K.every(V) : K.some(V)
    })
  }
}
// @from(Ln 359513, Col 0)
function Um2(A, Q, B, G) {
  if (A.length !== 3) throw Error(`Wrong number of arguments to \`#${B}\` predicate. Expected 2, got ${A.length-1}.`);
  if (A[1].type !== "capture") throw Error(`First argument of \`#${B}\` predicate must be a capture. Got "${A[1].value}".`);
  if (A[2].type !== "string") throw Error(`Second argument of \`#${B}\` predicate must be a string. Got @${A[2].name}.`);
  let Z = B === "match?" || B === "any-match?",
    Y = !B.startsWith("any-"),
    J = A[1].name,
    X = new RegExp(A[2].value);
  G[Q].push((I) => {
    let D = [];
    for (let K of I)
      if (K.name === J) D.push(K.node.text);
    let W = O0((K, V) => {
      return V ? X.test(K) : !X.test(K)
    }, "test");
    if (D.length === 0) return !Z;
    return Y ? D.every((K) => W(K, Z)) : D.some((K) => W(K, Z))
  })
}
// @from(Ln 359533, Col 0)
function qm2(A, Q, B, G) {
  if (A.length < 2) throw Error(`Wrong number of arguments to \`#${B}\` predicate. Expected at least 1. Got ${A.length-1}.`);
  if (A[1].type !== "capture") throw Error(`First argument of \`#${B}\` predicate must be a capture. Got "${A[1].value}".`);
  let Z = B === "any-of?",
    Y = A[1].name,
    J = A.slice(2);
  if (!J.every(Eq0)) throw Error(`Arguments to \`#${B}\` predicate must be strings.".`);
  let X = J.map((I) => I.value);
  G[Q].push((I) => {
    let D = [];
    for (let W of I)
      if (W.name === Y) D.push(W.node.text);
    if (D.length === 0) return !Z;
    return D.every((W) => X.includes(W)) === Z
  })
}
// @from(Ln 359550, Col 0)
function Nm2(A, Q, B, G, Z) {
  if (A.length < 2 || A.length > 3) throw Error(`Wrong number of arguments to \`#${B}\` predicate. Expected 1 or 2. Got ${A.length-1}.`);
  if (!A.every(Eq0)) throw Error(`Arguments to \`#${B}\` predicate must be strings.".`);
  let Y = B === "is?" ? G : Z;
  if (!Y[Q]) Y[Q] = {};
  Y[Q][A[1].value] = A[2]?.value ?? null
}
// @from(Ln 359558, Col 0)
function wm2(A, Q, B) {
  if (A.length < 2 || A.length > 3) throw Error(`Wrong number of arguments to \`#set!\` predicate. Expected 1 or 2. Got ${A.length-1}.`);
  if (!A.every(Eq0)) throw Error('Arguments to `#set!` predicate must be strings.".');
  if (!B[Q]) B[Q] = {};
  B[Q][A[1].value] = A[2]?.value ?? null
}
// @from(Ln 359565, Col 0)
function Lm2(A, Q, B, G, Z, Y, J, X, I, D, W) {
  if (Q === oi5) {
    let K = G[B];
    Y.push({
      type: "capture",
      name: K
    })
  } else if (Q === ri5) Y.push({
    type: "string",
    value: Z[B]
  });
  else if (Y.length > 0) {
    if (Y[0].type !== "string") throw Error("Predicates must begin with a literal value");
    let K = Y[0].value;
    switch (K) {
      case "any-not-eq?":
      case "not-eq?":
      case "any-eq?":
      case "eq?":
        Cm2(Y, A, K, J);
        break;
      case "any-not-match?":
      case "not-match?":
      case "any-match?":
      case "match?":
        Um2(Y, A, K, J);
        break;
      case "not-any-of?":
      case "any-of?":
        qm2(Y, A, K, J);
        break;
      case "is?":
      case "is-not?":
        Nm2(Y, A, K, D, W);
        break;
      case "set!":
        wm2(Y, A, I);
        break;
      default:
        X[A].push({
          operator: K,
          operands: Y.slice(1)
        })
    }
    Y.length = 0
  }
}
// @from(Ln 359612, Col 0)
async function Om2(A) {
  if (!SK1) SK1 = await Qn5(A);
  return SK1
}
// @from(Ln 359617, Col 0)
function Mm2() {
  return !!SK1
}
// @from(Ln 359620, Col 4)
pi5
// @from(Ln 359620, Col 9)
O0 = (A, Q) => pi5(A, "name", {
    value: Q,
    configurable: !0
  })
// @from(Ln 359624, Col 2)
Vm2 = 2
// @from(Ln 359625, Col 2)
$9 = 4
// @from(Ln 359626, Col 2)
Wq0
// @from(Ln 359626, Col 7)
Gw
// @from(Ln 359626, Col 11)
Rf
// @from(Ln 359626, Col 15)
obA
// @from(Ln 359626, Col 20)
Dt
// @from(Ln 359626, Col 24)
Wt
// @from(Ln 359626, Col 28)
F1
// @from(Ln 359626, Col 32)
li5
// @from(Ln 359626, Col 37)
ii5
// @from(Ln 359626, Col 42)
ni5
// @from(Ln 359626, Col 47)
ai5
// @from(Ln 359626, Col 52)
oi5 = 1
// @from(Ln 359627, Col 2)
ri5 = 2
// @from(Ln 359628, Col 2)
si5
// @from(Ln 359628, Col 7)
A7Y
// @from(Ln 359628, Col 12)
Fm2
// @from(Ln 359628, Col 17)
Eq0
// @from(Ln 359628, Col 22)
Fx
// @from(Ln 359628, Col 26)
nbA
// @from(Ln 359628, Col 31)
ti5
// @from(Ln 359628, Col 36)
ei5
// @from(Ln 359628, Col 41)
yK1
// @from(Ln 359628, Col 46)
An5
// @from(Ln 359628, Col 51)
Qn5
// @from(Ln 359628, Col 56)
SK1 = null
// @from(Ln 359629, Col 2)
s2
// @from(Ln 359629, Col 6)
Kq0
// @from(Ln 359629, Col 11)
Vq0
// @from(Ln 359629, Col 16)
rbA