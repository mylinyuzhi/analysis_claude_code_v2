
// @from(Ln 457512, Col 4)
SF9 = w(() => {
  j9();
  TX();
  v1();
  ZmA = c(QA(), 1), LL7 = m.object({
    method: m.literal("selection_changed"),
    params: m.object({
      selection: m.object({
        start: m.object({
          line: m.number(),
          character: m.number()
        }),
        end: m.object({
          line: m.number(),
          character: m.number()
        })
      }).nullable().optional(),
      text: m.string().optional(),
      filePath: m.string().optional()
    })
  })
})
// @from(Ln 457534, Col 4)
Vx0
// @from(Ln 457535, Col 4)
xF9 = w(() => {
  Oa();
  T1();
  Vx0 = c(QA(), 1)
})
// @from(Ln 457540, Col 4)
Fx0
// @from(Ln 457541, Col 4)
yF9 = w(() => {
  Z0();
  T1();
  cD();
  Fx0 = c(QA(), 1)
})
// @from(Ln 457551, Col 0)
function Hx0(A) {
  return A === "self" ? "self" : `@${A}`
}
// @from(Ln 457555, Col 0)
function kF9({
  isLoading: A,
  focusedInputDialog: Q,
  onSubmitCollabMessage: B
}) {
  let [G, Z] = a0(), Y = Tk(), J = hp.useRef(A), X = hp.useCallback((D) => {
    k(`[CollabPoller] New message from ${Hx0(D.handle)}, unread: ${D.unread}`);
    let W = {
      id: OL7(),
      from: `${vF9}${D.handle}`,
      text: "",
      timestamp: new Date().toISOString(),
      status: "pending"
    };
    if (Z((K) => ({
        ...K,
        inbox: {
          messages: [...K.inbox.messages, W]
        }
      })), !A && !Q) Dc({
      message: `New message from ${Hx0(D.handle)}`,
      notificationType: "collab_message"
    }, Y)
  }, [A, Q, Z, Y]);
  hp.useEffect(() => {
    if (!f$1()) return;
    return lr2(X)
  }, [X]);
  let I = hp.useRef(!1);
  hp.useEffect(() => {
    if (!f$1()) return;
    if (I.current) return;
    let D = uI9();
    if (!D) {
      k("[CollabPoller] Waiting for Firebase user...");
      return
    }
    let W = mI9(D.uid, D.uid);
    pr2(W, D.uid, "self"), I.current = !0, k("[CollabPoller] Subscribed to self-to-self chat")
  }, [G.presence]), hp.useEffect(() => {
    let D = J.current;
    if (J.current = A, A || Q) return;
    if (!f$1()) return;
    let W = G.inbox.messages.filter((M) => M.from.startsWith(vF9)),
      K = W.filter((M) => M.status === "pending"),
      V = W.filter((M) => M.status === "processed");
    if (V.length > 0) {
      k(`[CollabPoller] Cleaning up ${V.length} processed notification(s)`);
      let M = new Set(V.map((_) => _.id));
      Z((_) => {
        let j = _.inbox.messages.filter((x) => !M.has(x.id));
        if (j.length === _.inbox.messages.length) return _;
        return {
          ..._,
          inbox: {
            messages: j
          }
        }
      })
    }
    if (K.length === 0) return;
    let F = D,
      H = !D && K.length > 0;
    if (!F && !H) return;
    let E = gF1();
    if (E.length === 0) {
      let M = new Set(K.map((_) => _.id));
      Z((_) => {
        let j = _.inbox.messages.filter((x) => !M.has(x.id));
        if (j.length === _.inbox.messages.length) return _;
        return {
          ..._,
          inbox: {
            messages: j
          }
        }
      });
      return
    }
    k(`[CollabPoller] Session idle, delivering notification for ${E.length} chat(s)`);
    let z = E.map((M) => Hx0(M.handle)).join(", "),
      O = `<system-reminder>New collab message${E.reduce((M,_)=>M+_.unread,0)!==1?"s":""} from ${z}.</system-reminder>`;
    if (B(O)) {
      let M = new Set(K.map((_) => _.id));
      Z((_) => {
        let j = _.inbox.messages.filter((x) => !M.has(x.id));
        if (j.length === _.inbox.messages.length) return _;
        return {
          ..._,
          inbox: {
            messages: j
          }
        }
      })
    } else k("[CollabPoller] Submission rejected, keeping notifications queued")
  }, [A, Q, B, Z, G.inbox.messages])
}
// @from(Ln 457652, Col 4)
hp
// @from(Ln 457652, Col 8)
vF9 = "collab:"
// @from(Ln 457653, Col 4)
bF9 = w(() => {
  T1();
  hB();
  MkA();
  nBA();
  hp = c(QA(), 1)
})
// @from(Ln 457661, Col 0)
function hF9({
  autoConnectIdeFlag: A,
  ideToInstallExtension: Q,
  setDynamicMcpConfig: B,
  setShowIdeOnboarding: G,
  setIDEInstallationState: Z
}) {
  fF9.useEffect(() => {
    function Y(J) {
      if (!J) return;
      if (!((L1().autoConnectIde || A || zK() || Q || a1(process.env.CLAUDE_CODE_AUTO_CONNECT_IDE)) && !iX(process.env.CLAUDE_CODE_AUTO_CONNECT_IDE))) return;
      B((D) => {
        if (D?.ide) return D;
        return {
          ...D,
          ide: {
            type: J.url.startsWith("ws:") ? "ws-ide" : "sse-ide",
            url: J.url,
            ideName: J.name,
            authToken: J.authToken,
            ideRunningInWindows: J.ideRunningInWindows,
            scope: "dynamic"
          }
        }
      })
    }
    hr2(Y, Q, () => G(!0), (J) => Z(J))
  }, [A, Q, B, G, Z])
}
// @from(Ln 457690, Col 4)
fF9
// @from(Ln 457691, Col 4)
gF9 = w(() => {
  GQ();
  TX();
  fQ();
  fF9 = c(QA(), 1)
})
// @from(Ln 457698, Col 0)
function uF9({
  onBackgroundSession: A,
  isLoading: Q
}) {
  let [B, G] = a0(), Z = j$A.useRef(B);
  Z.current = B;
  let [Y, J] = j$A.useState(!1), X = yP(J, A, () => {}), I = j$A.useCallback(() => {
    if (a1(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS)) return;
    let K = Z.current;
    if (Wm2(K)) vD1(() => Z.current, G)
  }, [G, Q, X]);
  H2("task:background", I, {
    context: "Task"
  });
  let D = J3("task:background", "Task", "ctrl+b"),
    W = l0.terminal === "tmux" && D === "ctrl+b" ? "ctrl+b ctrl+b" : D;
  if (!Q || !Y) return null;
  return b8A.createElement(T, {
    paddingLeft: 2
  }, b8A.createElement(C, {
    dimColor: !0
  }, b8A.createElement(F0, {
    shortcut: W,
    action: "background"
  })))
}
// @from(Ln 457724, Col 4)
b8A
// @from(Ln 457724, Col 9)
j$A
// @from(Ln 457725, Col 4)
mF9 = w(() => {
  fA();
  XjA();
  hB();
  v6A();
  e9();
  p3();
  fQ();
  c6();
  NX();
  b8A = c(QA(), 1), j$A = c(QA(), 1)
})
// @from(Ln 457738, Col 0)
function dF9({
  setMessages: A,
  setIsLoading: Q,
  resetLoadingState: B,
  setAbortController: G
}) {
  let [Z, Y] = a0(), J = ee.useRef(null), X = ee.useRef(0), I = ee.useCallback(() => {
    if (Z.foregroundedTaskId) {
      Y((K) => {
        let V = K.foregroundedTaskId;
        if (!V) return K;
        let F = K.tasks[V];
        if (!F) return {
          ...K,
          foregroundedTaskId: void 0
        };
        return {
          ...K,
          foregroundedTaskId: void 0,
          tasks: {
            ...K.tasks,
            [V]: {
              ...F,
              isBackgrounded: !0
            }
          }
        }
      }), A([]), B(), G(null);
      return
    }
    J.current?.resolve()
  }, [Z.foregroundedTaskId, Y, A, B, G]), D = ee.useCallback((K) => {
    J.current?.resolve(), Jm2(K, Y)
  }, [Y]), W = Z.foregroundedTaskId ? Z.tasks[Z.foregroundedTaskId] : void 0;
  return ee.useEffect(() => {
    if (!Z.foregroundedTaskId) {
      X.current = 0;
      return
    }
    if (!W || W.type !== "local_agent") {
      Y((V) => ({
        ...V,
        foregroundedTaskId: void 0
      })), B(), X.current = 0;
      return
    }
    let K = W.messages ?? [];
    if (K.length !== X.current) X.current = K.length, A([...K]);
    if (W.status === "running") {
      let V = W.abortController;
      if (V?.signal.aborted) {
        Y((F) => {
          if (!F.foregroundedTaskId) return F;
          let H = F.tasks[F.foregroundedTaskId];
          if (!H) return {
            ...F,
            foregroundedTaskId: void 0
          };
          return {
            ...F,
            foregroundedTaskId: void 0,
            tasks: {
              ...F.tasks,
              [F.foregroundedTaskId]: {
                ...H,
                isBackgrounded: !0
              }
            }
          }
        }), B(), G(null), X.current = 0;
        return
      }
      if (Q(!0), V) G(V)
    } else Y((V) => {
      let F = V.foregroundedTaskId;
      if (!F) return V;
      let H = V.tasks[F];
      if (!H) return {
        ...V,
        foregroundedTaskId: void 0
      };
      return {
        ...V,
        foregroundedTaskId: void 0,
        tasks: {
          ...V.tasks,
          [F]: {
            ...H,
            isBackgrounded: !0
          }
        }
      }
    }), B(), G(null), X.current = 0
  }, [Z.foregroundedTaskId, W, Y, A, Q, B, G]), {
    backgroundSignalRef: J,
    handleBackgroundSession: I,
    handleForegroundTask: D
  }
}
// @from(Ln 457837, Col 4)
ee
// @from(Ln 457838, Col 4)
cF9 = w(() => {
  hB();
  TK1();
  ee = c(QA(), 1)
})
// @from(Ln 457847, Col 0)
function xC1({
  hideThanksAfterMs: A,
  onOpen: Q,
  onSelect: B
}) {
  let [G, Z] = AAA.useState("closed"), Y = AAA.useRef(pF9()), J = AAA.useCallback(() => {
    Z("thanks"), setTimeout(() => Z("closed"), A)
  }, [A]), X = AAA.useCallback(() => {
    if (G !== "closed") return;
    Z("open"), Y.current = pF9(), Q(Y.current)
  }, [G, Q]), I = AAA.useCallback((D) => {
    if (D === "dismissed") Z("closed");
    else J();
    B(Y.current, D)
  }, [J, B]);
  return {
    state: G,
    open: X,
    handleSelect: I
  }
}
// @from(Ln 457868, Col 4)
AAA
// @from(Ln 457869, Col 4)
Ex0 = w(() => {
  AAA = c(QA(), 1)
})
// @from(Ln 457873, Col 0)
function lF9(A, Q, B, G = "session") {
  let Z = Nw.useRef("unknown");
  Z.current = Qx(A)?.message?.id || "unknown";
  let [Y, J] = a0(), X = EKB("tengu_feedback_survey_config", ML7), I = Nw.useRef(Date.now()), D = Nw.useRef(B), W = Nw.useRef(B);
  W.current = B;
  let K = Nw.useCallback((M, _) => {
      J((j) => ({
        ...j,
        feedbackSurvey: {
          timeLastShown: M,
          submitCountAtLastAppearance: _
        }
      }))
    }, [J]),
    V = Nw.useCallback((M) => {
      K(Date.now(), W.current), l("tengu_feedback_survey_event", {
        event_type: "appeared",
        appearance_id: M,
        last_assistant_message_id: Z.current,
        survey_type: G
      })
    }, [K, G]),
    F = Nw.useCallback((M, _) => {
      K(Date.now(), W.current), l("tengu_feedback_survey_event", {
        event_type: "responded",
        appearance_id: M,
        response: _,
        last_assistant_message_id: Z.current,
        survey_type: G
      })
    }, [K, G]),
    {
      state: H,
      open: E,
      handleSelect: z
    } = xC1({
      hideThanksAfterMs: X.hideThanksAfterMs,
      onOpen: V,
      onSelect: F
    }),
    $ = B5(),
    O = Nw.useMemo(() => {
      if (X.onForModels.length === 0) return !1;
      if (X.onForModels.includes("*")) return !0;
      return X.onForModels.includes($)
    }, [X.onForModels, $]),
    L = Nw.useMemo(() => {
      if (H !== "closed") return !1;
      if (Q) return !1;
      if (process.env.CLAUDE_FORCE_DISPLAY_SURVEY && !Y.feedbackSurvey.timeLastShown) return !0;
      if (!O) return !1;
      if (a1(process.env.CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY)) return !1;
      if (gW()) return !1;
      if (Y.feedbackSurvey.timeLastShown) {
        if (Y.feedbackSurvey.submitCountAtLastAppearance !== null && B < Y.feedbackSurvey.submitCountAtLastAppearance + X.minUserTurnsBetweenFeedback) return !1
      } else {
        if (Date.now() - I.current < X.minTimeBeforeFeedbackMs) return !1;
        if (B < D.current + X.minUserTurnsBeforeFeedback) return !1
      }
      if (Math.random() > X.probability) return !1;
      let M = L1().feedbackSurveyState;
      if (M?.lastShownTime) {
        if (Date.now() - M.lastShownTime < X.minTimeBetweenGlobalFeedbackMs) return !1
      }
      return !0
    }, [H, Q, O, Y.feedbackSurvey.timeLastShown, Y.feedbackSurvey.submitCountAtLastAppearance, B, X.minTimeBetweenGlobalFeedbackMs, X.minUserTurnsBetweenFeedback, X.minTimeBeforeFeedbackMs, X.minUserTurnsBeforeFeedback, X.probability]);
  return Nw.useEffect(() => {
    if (L) E()
  }, [L, E]), {
    state: H,
    handleSelect: z
  }
}
// @from(Ln 457946, Col 4)
Nw
// @from(Ln 457946, Col 8)
ML7
// @from(Ln 457947, Col 4)
iF9 = w(() => {
  w6();
  Z0();
  Mu();
  GQ();
  l2();
  fQ();
  hB();
  tQ();
  Ex0();
  Nw = c(QA(), 1), ML7 = {
    minTimeBeforeFeedbackMs: 600000,
    minTimeBetweenGlobalFeedbackMs: 1e8,
    minUserTurnsBeforeFeedback: 5,
    minUserTurnsBetweenFeedback: 10,
    hideThanksAfterMs: 3000,
    onForModels: ["*"],
    probability: 0.005
  }
})
// @from(Ln 457968, Col 0)
function TL7(A, Q) {
  let B = A.findIndex((G) => G.uuid === Q);
  if (B === -1) return !1;
  for (let G = B + 1; G < A.length; G++) {
    let Z = A[G];
    if (Z && (Z.type === "user" || Z.type === "assistant")) return !0
  }
  return !1
}
// @from(Ln 457978, Col 0)
function nF9(A, Q) {
  let [B, G] = IM.useState(null), Z = IM.useRef(new Set), Y = IM.useRef(null), J = IM.useCallback((V) => {
    let F = rF1();
    l("tengu_post_compact_survey_event", {
      event_type: "appeared",
      appearance_id: V,
      session_memory_compaction_enabled: F
    })
  }, []), X = IM.useCallback((V, F) => {
    let H = rF1();
    l("tengu_post_compact_survey_event", {
      event_type: "responded",
      appearance_id: V,
      response: F,
      session_memory_compaction_enabled: H
    })
  }, []), {
    state: I,
    open: D,
    handleSelect: W
  } = xC1({
    hideThanksAfterMs: RL7,
    onOpen: J,
    onSelect: X
  });
  IM.useEffect(() => {
    G(f8(_L7))
  }, []);
  let K = IM.useMemo(() => new Set(A.filter((V) => qc(V)).map((V) => V.uuid)), [A]);
  return IM.useEffect(() => {
    if (I !== "closed" || Q) return;
    if (B !== !0) return;
    if (gW()) return;
    if (a1(process.env.CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY)) return;
    if (Y.current !== null) {
      if (TL7(A, Y.current)) {
        if (Y.current = null, Math.random() < jL7) D();
        return
      }
    }
    let V = Array.from(K).filter((F) => !Z.current.has(F));
    if (V.length > 0) Z.current = new Set(K), Y.current = V[V.length - 1]
  }, [K, I, Q, B, A, D]), {
    state: I,
    handleSelect: W
  }
}
// @from(Ln 458025, Col 4)
IM
// @from(Ln 458025, Col 8)
RL7 = 3000
// @from(Ln 458026, Col 2)
_L7 = "tengu_post_compact_survey"
// @from(Ln 458027, Col 2)
jL7 = 0.2
// @from(Ln 458028, Col 4)
aF9 = w(() => {
  w6();
  Z0();
  Mu();
  fQ();
  tQ();
  Ex0();
  tF1();
  IM = c(QA(), 1)
})
// @from(Ln 458039, Col 0)
function oF9({
  onSelect: A,
  inputValue: Q,
  setInputValue: B,
  message: G = xL7
}) {
  let Z = yC1.useRef(Q);
  return yC1.useEffect(() => {
    if (Q !== Z.current) {
      let Y = Q.slice(-1);
      if (zx0(Y)) B(Q.slice(0, -1)), A(SL7[Y])
    }
  }, [Q, A, B]), GH.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, GH.default.createElement(T, null, GH.default.createElement(C, {
    color: "ansi:cyan"
  }, "● "), GH.default.createElement(C, {
    bold: !0
  }, G)), GH.default.createElement(T, {
    marginLeft: 2
  }, GH.default.createElement(T, {
    width: 10
  }, GH.default.createElement(C, null, GH.default.createElement(C, {
    color: "ansi:cyan"
  }, "1"), ": Bad")), GH.default.createElement(T, {
    width: 10
  }, GH.default.createElement(C, null, GH.default.createElement(C, {
    color: "ansi:cyan"
  }, "2"), ": Fine")), GH.default.createElement(T, {
    width: 10
  }, GH.default.createElement(C, null, GH.default.createElement(C, {
    color: "ansi:cyan"
  }, "3"), ": Good")), GH.default.createElement(T, null, GH.default.createElement(C, null, GH.default.createElement(C, {
    color: "ansi:cyan"
  }, "0"), ": Dismiss"))))
}
// @from(Ln 458076, Col 4)
GH
// @from(Ln 458076, Col 8)
yC1
// @from(Ln 458076, Col 13)
PL7
// @from(Ln 458076, Col 18)
SL7
// @from(Ln 458076, Col 23)
zx0 = (A) => PL7.includes(A)
// @from(Ln 458077, Col 2)
xL7 = "How is Claude doing this session? (optional)"
// @from(Ln 458078, Col 4)
rF9 = w(() => {
  fA();
  GH = c(QA(), 1), yC1 = c(QA(), 1), PL7 = ["0", "1", "2", "3"], SL7 = {
    "0": "dismissed",
    "1": "bad",
    "2": "fine",
    "3": "good"
  }
})
// @from(Ln 458088, Col 0)
function $x0({
  state: A,
  handleSelect: Q,
  inputValue: B,
  setInputValue: G,
  message: Z
}) {
  if (A === "closed") return null;
  if (A === "thanks") return YmA.default.createElement(T, {
    marginTop: 1,
    flexDirection: "column"
  }, YmA.default.createElement(C, {
    color: "success"
  }, "✓ Thanks for helping make Claude better!"), YmA.default.createElement(C, {
    dimColor: !0
  }, "Use ", "/feedback", " to share detailed feedback or file a bug."));
  if (B && !zx0(B)) return null;
  return YmA.default.createElement(oF9, {
    onSelect: Q,
    inputValue: B,
    setInputValue: G,
    message: Z
  })
}
// @from(Ln 458112, Col 4)
YmA
// @from(Ln 458113, Col 4)
sF9 = w(() => {
  fA();
  rF9();
  YmA = c(QA(), 1)
})
// @from(Ln 458119, Col 0)
function eF9() {
  let {
    addNotification: A
  } = S4();
  tF9.useEffect(() => {
    rf().then((Q) => {
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
// @from(Ln 458139, Col 4)
tF9
// @from(Ln 458140, Col 4)
AH9 = w(() => {
  HY();
  xx();
  tF9 = c(QA(), 1)
})
// @from(Ln 458146, Col 0)
function yL7() {
  if (process.argv.includes("--chrome")) return !0;
  if (process.argv.includes("--no-chrome")) return !1;
  return
}
// @from(Ln 458152, Col 0)
function QH9() {
  let {
    addNotification: A
  } = S4();
  hj.useEffect(() => {
    let Q = yL7();
    if (!az1(Q)) return;
    if (!qB()) {
      A({
        key: "chrome-requires-subscription",
        jsx: hj.createElement(C, {
          color: "error"
        }, "Claude in Chrome requires a claude.ai subscription"),
        priority: "immediate",
        timeoutMs: 5000
      });
      return
    }
    qp().then((B) => {
      if (!B) A({
        key: "chrome-extension-not-detected",
        jsx: hj.createElement(hj.Fragment, null, hj.createElement(C, {
          color: "warning"
        }, "Chrome extension not detected · https://claude.ai/chrome to install")),
        priority: "immediate",
        timeoutMs: 3000
      });
      else if (Q === void 0) A({
        key: "claude-in-chrome-default-enabled",
        text: "Claude in Chrome enabled · /chrome",
        priority: "low"
      })
    }).catch((B) => {
      e(B)
    })
  }, [A])
}
// @from(Ln 458189, Col 4)
hj
// @from(Ln 458190, Col 4)
BH9 = w(() => {
  fA();
  Se();
  HY();
  v1();
  Q2();
  hj = c(QA(), 1)
})
// @from(Ln 458199, Col 0)
function GH9(A) {
  let Q = vC1.INITIAL_DELAY_MS * Math.pow(vC1.BACKOFF_MULTIPLIER, A);
  return Math.min(Q, vC1.MAX_DELAY_MS)
}
// @from(Ln 458204, Col 0)
function vL7(A) {
  if (!A.officialMarketplaceAutoInstallAttempted) return !0;
  if (A.officialMarketplaceAutoInstalled) return !1;
  let Q = A.officialMarketplaceAutoInstallFailReason,
    B = A.officialMarketplaceAutoInstallRetryCount || 0,
    G = A.officialMarketplaceAutoInstallNextRetryTime,
    Z = Date.now();
  if (B >= vC1.MAX_ATTEMPTS) return !1;
  if (Q === "policy_blocked") return !1;
  if (G && Z < G) return !1;
  return Q === "unknown" || Q === "git_unavailable" || Q === void 0
}
// @from(Ln 458216, Col 0)
async function ZH9() {
  let A = L1();
  if (!vL7(A)) {
    let Q = A.officialMarketplaceAutoInstallFailReason ?? "already_attempted";
    return k(`Official marketplace auto-install skipped: ${Q}`), {
      installed: !1,
      skipped: !0,
      reason: Q
    }
  }
  try {
    if ((await D5())[W8A]) return k(`Official marketplace '${W8A}' already installed, skipping`), S0((Z) => ({
      ...Z,
      officialMarketplaceAutoInstallAttempted: !0,
      officialMarketplaceAutoInstalled: !0
    })), {
      installed: !1,
      skipped: !0,
      reason: "already_installed"
    };
    if (!H4A(QT0)) return k("Official marketplace blocked by enterprise policy, skipping"), S0((Z) => ({
      ...Z,
      officialMarketplaceAutoInstallAttempted: !0,
      officialMarketplaceAutoInstalled: !1,
      officialMarketplaceAutoInstallFailReason: "policy_blocked"
    })), l("tengu_official_marketplace_auto_install", {
      installed: !1,
      skipped: !0,
      policy_blocked: !0
    }), {
      installed: !1,
      skipped: !0,
      reason: "policy_blocked"
    };
    if (!await OZ1()) {
      k("Git not available, skipping official marketplace auto-install");
      let Z = (A.officialMarketplaceAutoInstallRetryCount || 0) + 1,
        Y = Date.now(),
        J = GH9(Z),
        X = Y + J,
        I = !1;
      try {
        S0((D) => ({
          ...D,
          officialMarketplaceAutoInstallAttempted: !0,
          officialMarketplaceAutoInstalled: !1,
          officialMarketplaceAutoInstallFailReason: "git_unavailable",
          officialMarketplaceAutoInstallRetryCount: Z,
          officialMarketplaceAutoInstallLastAttemptTime: Y,
          officialMarketplaceAutoInstallNextRetryTime: X
        }))
      } catch (D) {
        I = !0;
        let W = D instanceof Error ? D : Error(`Failed to save marketplace auto-install git_unavailable state: ${D}`);
        e(W), k(`Failed to save marketplace auto-install git_unavailable state: ${D}`, {
          level: "error"
        })
      }
      return l("tengu_official_marketplace_auto_install", {
        installed: !1,
        skipped: !0,
        git_unavailable: !0,
        retry_count: Z
      }), {
        installed: !1,
        skipped: !0,
        reason: "git_unavailable",
        configSaveFailed: I
      }
    }
    k("Attempting to auto-install official marketplace"), await NS(QT0), k("Successfully auto-installed official marketplace");
    let G = A.officialMarketplaceAutoInstallRetryCount || 0;
    return S0((Z) => ({
      ...Z,
      officialMarketplaceAutoInstallAttempted: !0,
      officialMarketplaceAutoInstalled: !0,
      officialMarketplaceAutoInstallFailReason: void 0,
      officialMarketplaceAutoInstallRetryCount: void 0,
      officialMarketplaceAutoInstallLastAttemptTime: void 0,
      officialMarketplaceAutoInstallNextRetryTime: void 0
    })), l("tengu_official_marketplace_auto_install", {
      installed: !0,
      skipped: !1,
      retry_count: G
    }), {
      installed: !0,
      skipped: !1
    }
  } catch (Q) {
    let B = Q instanceof Error ? Q.message : String(Q);
    k(`Failed to auto-install official marketplace: ${B}`, {
      level: "error"
    }), e(Q instanceof Error ? Q : Error(`Official marketplace auto-install failed: ${B}`));
    let G = (A.officialMarketplaceAutoInstallRetryCount || 0) + 1,
      Z = Date.now(),
      Y = GH9(G),
      J = Z + Y,
      X = !1;
    try {
      S0((I) => ({
        ...I,
        officialMarketplaceAutoInstallAttempted: !0,
        officialMarketplaceAutoInstalled: !1,
        officialMarketplaceAutoInstallFailReason: "unknown",
        officialMarketplaceAutoInstallRetryCount: G,
        officialMarketplaceAutoInstallLastAttemptTime: Z,
        officialMarketplaceAutoInstallNextRetryTime: J
      }))
    } catch (I) {
      X = !0;
      let D = I instanceof Error ? I : Error(`Failed to save marketplace auto-install failure state: ${I}`);
      e(D), k(`Failed to save marketplace auto-install failure state: ${I}`, {
        level: "error"
      })
    }
    return l("tengu_official_marketplace_auto_install", {
      installed: !1,
      skipped: !0,
      failed: !0,
      retry_count: G
    }), {
      installed: !1,
      skipped: !0,
      reason: "unknown",
      configSaveFailed: X
    }
  }
}
// @from(Ln 458344, Col 4)
vC1
// @from(Ln 458345, Col 4)
YH9 = w(() => {
  kz1();
  WI0();
  E4A();
  HI();
  GQ();
  T1();
  v1();
  Z0();
  vC1 = {
    MAX_ATTEMPTS: 10,
    INITIAL_DELAY_MS: 3600000,
    BACKOFF_MULTIPLIER: 2,
    MAX_DELAY_MS: 604800000
  }
})
// @from(Ln 458362, Col 0)
function JH9() {
  let {
    addNotification: A
  } = S4(), Q = DM.useRef(!1);
  DM.useEffect(() => {
    if (Q.current) return;
    Q.current = !0, ZH9().then((B) => {
      if (B.configSaveFailed) k("Showing marketplace config save failure notification"), A({
        key: "marketplace-config-save-failed",
        jsx: DM.createElement(C, {
          color: "error"
        }, "Failed to save marketplace retry info · Check ~/.claude.json permissions"),
        priority: "immediate",
        timeoutMs: 1e4
      });
      if (B.installed) k("Showing marketplace installation success notification"), A({
        key: "marketplace-installed",
        jsx: DM.createElement(C, {
          color: "success"
        }, "✓ Anthropic marketplace installed · /plugin to see available plugins"),
        priority: "immediate",
        timeoutMs: 7000
      });
      else if (B.skipped && B.reason === "unknown") k("Showing marketplace installation failure notification"), A({
        key: "marketplace-install-failed",
        jsx: DM.createElement(C, {
          color: "warning"
        }, "Failed to install Anthropic marketplace · Will retry on next startup"),
        priority: "immediate",
        timeoutMs: 8000
      });
      else if (B.skipped && B.reason === "git_unavailable") k("Showing marketplace git unavailable notification"), A({
        key: "marketplace-git-unavailable",
        jsx: DM.createElement(C, {
          color: "warning"
        }, "Anthropic marketplace requires git · Install git and restart"),
        priority: "immediate",
        timeoutMs: 8000
      })
    }).catch((B) => {
      e(B instanceof Error ? B : Error(String(B)))
    })
  }, [A])
}
// @from(Ln 458406, Col 4)
DM
// @from(Ln 458407, Col 4)
XH9 = w(() => {
  fA();
  HY();
  YH9();
  v1();
  T1();
  DM = c(QA(), 1)
})
// @from(Ln 458416, Col 0)
function IH9(A, Q) {
  let B = kC1.useRef(void 0);
  kC1.useEffect(() => {
    return
  }, [A, Q])
}
// @from(Ln 458422, Col 4)
kC1
// @from(Ln 458422, Col 9)
kL7
// @from(Ln 458423, Col 4)
DH9 = w(() => {
  j9();
  v1();
  VO();
  Ox();
  kC1 = c(QA(), 1), kL7 = m.object({
    method: m.literal("notifications/message"),
    params: m.object({
      prompt: m.string(),
      image: m.object({
        type: m.literal("base64"),
        media_type: m.enum(["image/jpeg", "image/png", "image/gif", "image/webp"]),
        data: m.string()
      }).optional(),
      tabId: m.number().optional()
    })
  })
})
// @from(Ln 458442, Col 0)
function WH9() {
  return L1().tipsHistory || {}
}
// @from(Ln 458446, Col 0)
function bL7(A) {
  S0((Q) => {
    if (Q.tipsHistory === A) return Q;
    return {
      ...Q,
      tipsHistory: A
    }
  })
}
// @from(Ln 458456, Col 0)
function KH9(A) {
  let Q = WH9(),
    B = L1().numStartups;
  Q[A] = B, bL7(Q)
}
// @from(Ln 458462, Col 0)
function fL7(A) {
  return WH9()[A] || 0
}
// @from(Ln 458466, Col 0)
function bC1(A) {
  let Q = fL7(A);
  if (Q === 0) return 1 / 0;
  return L1().numStartups - Q
}
// @from(Ln 458471, Col 4)
Cx0 = w(() => {
  GQ()
})
// @from(Ln 458474, Col 0)
async function gL7() {
  return "claude-code-plugins" in await D5()
}
// @from(Ln 458477, Col 0)
async function fC1(A) {
  let Q = [...uL7, ...mL7],
    B = await Promise.all(Q.map((G) => G.isRelevant(A)));
  return Q.filter((G, Z) => B[Z]).filter((G) => bC1(G.id) >= G.cooldownSessions)
}
// @from(Ln 458482, Col 4)
uL7
// @from(Ln 458482, Col 9)
mL7
// @from(Ln 458483, Col 4)
Ux0 = w(() => {
  Z3();
  GQ();
  ZI();
  PN();
  HI();
  l2();
  eBA();
  p3();
  TX();
  c3();
  x3A();
  GB();
  Cx0();
  d4();
  oN();
  T1();
  dBA();
  pC();
  A$A();
  uL7 = [{
    id: "new-user-warmup",
    content: async () => "Start with small features or bug fixes, tell Claude to propose a plan, and verify its suggested edits",
    cooldownSessions: 3,
    async isRelevant() {
      return L1().numStartups < 10
    }
  }, {
    id: "plan-mode-for-complex-tasks",
    content: async () => `Use Plan Mode to prepare for a complex request before making changes. Press ${ec.displayText} twice to enable.`,
    cooldownSessions: 5,
    isRelevant: async () => {
      let A = L1();
      return (A.lastPlanModeUse ? (Date.now() - A.lastPlanModeUse) / 86400000 : 1 / 0) > 7
    }
  }, {
    id: "default-permission-mode-config",
    content: async () => "Use /config to change your default permission mode (including Plan Mode)",
    cooldownSessions: 10,
    isRelevant: async () => {
      try {
        let A = L1(),
          Q = jQ(),
          B = Boolean(A.lastPlanModeUse),
          G = Boolean(Q?.permissions?.defaultMode);
        return B && !G
      } catch (A) {
        return k(`Failed to check default-permission-mode-config tip relevance: ${A}`, {
          level: "warn"
        }), !1
      }
    }
  }, {
    id: "git-worktrees",
    content: async () => "Use git worktrees to run multiple Claude sessions in parallel.",
    cooldownSessions: 10,
    isRelevant: async () => {
      try {
        let A = L1();
        return await pOA() <= 1 && A.numStartups > 50
      } catch (A) {
        return !1
      }
    }
  }, {
    id: "terminal-setup",
    content: async () => l0.terminal === "Apple_Terminal" ? "Run /terminal-setup to enable convenient terminal integration like Option + Enter for new line and more" : "Run /terminal-setup to enable convenient terminal integration like Shift + Enter for new line and more",
    cooldownSessions: 10,
    async isRelevant() {
      let A = L1();
      if (l0.terminal === "Apple_Terminal") return tBA.isEnabled() && !A.optionAsMetaKeyInstalled;
      return tBA.isEnabled() && !A.shiftEnterKeyBindingInstalled
    }
  }, {
    id: "shift-enter",
    content: async () => l0.terminal === "Apple_Terminal" ? "Press Option+Enter to send a multi-line message" : "Press Shift+Enter to send a multi-line message",
    cooldownSessions: 10,
    async isRelevant() {
      let A = L1();
      return Boolean((l0.terminal === "Apple_Terminal" ? A.optionAsMetaKeyInstalled : A.shiftEnterKeyBindingInstalled) && A.numStartups > 3)
    }
  }, {
    id: "shift-enter-setup",
    content: async () => l0.terminal === "Apple_Terminal" ? "Run /terminal-setup to enable Option+Enter for new lines" : "Run /terminal-setup to enable Shift+Enter for new lines",
    cooldownSessions: 10,
    async isRelevant() {
      if (!EjA()) return !1;
      let A = L1();
      return !(l0.terminal === "Apple_Terminal" ? A.optionAsMetaKeyInstalled : A.shiftEnterKeyBindingInstalled)
    }
  }, {
    id: "memory-command",
    content: async () => "Use /memory to view and manage Claude memory",
    cooldownSessions: 15,
    async isRelevant() {
      return L1().memoryUsageCount <= 0
    }
  }, {
    id: "theme-command",
    content: async () => "Use /theme to change the color theme",
    cooldownSessions: 20,
    isRelevant: async () => !0
  }, {
    id: "colorterm-truecolor",
    content: async () => "Try setting environment variable COLORTERM=truecolor for richer colors",
    cooldownSessions: 30,
    isRelevant: async () => !process.env.COLORTERM && I1.level < 3
  }, {
    id: "status-line",
    content: async () => "Use /statusline to set up a custom status line that will display beneath the input box",
    cooldownSessions: 25,
    isRelevant: async () => jQ().statusLine === void 0
  }, {
    id: "stickers-command",
    content: async () => "Use /stickers to order Claude Code swag",
    cooldownSessions: 20,
    isRelevant: async () => !0
  }, {
    id: "prompt-queue",
    content: async () => "Hit Enter to queue up additional messages while Claude is working.",
    cooldownSessions: 5,
    async isRelevant() {
      return L1().promptQueueUseCount <= 3
    }
  }, {
    id: "enter-to-steer-in-relatime",
    content: async () => "Send messages to Claude while it works to steer Claude in real-time",
    cooldownSessions: 20,
    isRelevant: async () => !0
  }, {
    id: "todo-list",
    content: async () => "Ask Claude to create a todo list when working on complex tasks to track progress and remain on track",
    cooldownSessions: 20,
    isRelevant: async () => !0
  }, {
    id: "vscode-command-install",
    content: async () => `Open the Command Palette (Cmd+Shift+P) and run "Shell Command: Install '${l0.terminal==="vscode"?"code":l0.terminal}' command in PATH" to enable IDE integration`,
    cooldownSessions: 0,
    async isRelevant() {
      if (!JhA()) return !1;
      if ($Q() !== "macos") return !1;
      switch (l0.terminal) {
        case "vscode":
          return !await kr2();
        case "cursor":
          return !await yr2();
        case "windsurf":
          return !await vr2();
        default:
          return !1
      }
    }
  }, {
    id: "ide-upsell-external-terminal",
    content: async () => "Connect Claude to your IDE · /ide",
    cooldownSessions: 4,
    async isRelevant() {
      if (zK()) return !1;
      if (bF1().length !== 0) return !1;
      return (await br2()).length > 0
    }
  }, {
    id: "install-github-app",
    content: async () => "Run /install-github-app to tag @claude right from your Github issues and PRs",
    cooldownSessions: 10,
    isRelevant: async () => !L1().githubActionSetupCount
  }, {
    id: "install-slack-app",
    content: async () => "Run /install-slack-app to use Claude in Slack",
    cooldownSessions: 10,
    isRelevant: async () => !L1().slackAppInstallCount
  }, {
    id: "permissions",
    content: async () => "Use /permissions to pre-approve and pre-deny bash, edit, and MCP tools",
    cooldownSessions: 10,
    async isRelevant() {
      return L1().numStartups > 10
    }
  }, {
    id: "drag-and-drop-images",
    content: async () => "Did you know you can drag and drop image files into your terminal?",
    cooldownSessions: 10,
    isRelevant: async () => !0
  }, {
    id: "paste-images-mac",
    content: async () => "Paste images into Claude Code using control+v (not cmd+v!)",
    cooldownSessions: 10,
    isRelevant: async () => $Q() === "macos"
  }, {
    id: "double-esc",
    content: async () => "Double-tap esc to rewind the conversation to a previous point in time",
    cooldownSessions: 10,
    isRelevant: async () => !vG()
  }, {
    id: "double-esc-code-restore",
    content: async () => "Double-tap esc to rewind the code and/or conversation to a previous point in time",
    cooldownSessions: 10,
    isRelevant: async () => vG()
  }, {
    id: "continue",
    content: async () => "Run claude --continue or claude --resume to resume a conversation",
    cooldownSessions: 10,
    isRelevant: async () => !0
  }, {
    id: "rename-conversation",
    content: async () => "Name your conversations with /rename to find them easily in /resume later",
    cooldownSessions: 15,
    isRelevant: async () => zp() && L1().numStartups > 10
  }, {
    id: "custom-commands",
    content: async () => "Create skills by adding .md files to .claude/skills/ in your project or ~/.claude/skills/ for skills that work in any project",
    cooldownSessions: 15,
    async isRelevant() {
      return L1().numStartups > 10
    }
  }, {
    id: "shift-tab",
    content: async () => `Hit ${ec.displayText} to cycle between default mode, auto-accept edit mode, and plan mode`,
    cooldownSessions: 10,
    isRelevant: async () => !0
  }, {
    id: "image-paste",
    content: async () => `Use ${zzA.displayText} to paste images from your clipboard`,
    cooldownSessions: 20,
    isRelevant: async () => !0
  }, {
    id: "ultrathink-keyword",
    content: async () => "Type 'ultrathink' in your message to enable thinking for just that turn",
    cooldownSessions: 10,
    isRelevant: async () => !0
  }, {
    id: "custom-agents",
    content: async () => "Use /agents to optimize specific tasks. Eg. Software Architect, Code Writer, Code Reviewer",
    cooldownSessions: 15,
    async isRelevant() {
      return L1().numStartups > 5
    }
  }, {
    id: "desktop-app",
    content: async () => "Run Claude Code locally or remotely using the Claude desktop app: clau.de/desktop",
    cooldownSessions: 15,
    isRelevant: async () => $Q() !== "linux"
  }, {
    id: "web-app",
    content: async () => "Use Claude Code on the web: clau.de/web",
    cooldownSessions: 15,
    isRelevant: async () => !0
  }, {
    id: "mobile-app",
    content: async () => "Use /mobile to get Claude on your phone",
    cooldownSessions: 15,
    isRelevant: async () => !0
  }, {
    id: "opusplan-mode-reminder",
    content: async () => `Your default model setting is Opus Plan Mode. Press ${ec.displayText} twice to activate Plan Mode and plan with Claude Opus.`,
    cooldownSessions: 2,
    async isRelevant() {
      let A = L1(),
        B = FQA() === "opusplan",
        G = A.lastPlanModeUse ? (Date.now() - A.lastPlanModeUse) / 86400000 : 1 / 0;
      return B && G > 3
    }
  }, {
    id: "frontend-design-plugin",
    content: async (A) => {
      let Q = await gL7(),
        B = sQ("suggestion", A.theme);
      if (!Q) return `Working with HTML/CSS? Add the frontend-design plugin:
${B("/plugin marketplace add anthropics/claude-code")}
${B("/plugin install frontend-design@claude-code-plugins")}`;
      return `Working with HTML/CSS? Install the frontend-design plugin:
${B("/plugin install frontend-design@claude-code-plugins")}`
    },
    cooldownSessions: 3,
    async isRelevant(A) {
      if (tC("frontend-design@claude-code-plugins")) return !1;
      if (!A?.readFileState) return !1;
      return FS(A.readFileState).some((B) => /\.(html|css|htm)$/i.test(B))
    }
  }, {
    id: "guest-passes",
    content: async (A) => {
      let Q = sQ("claude", A.theme);
      return `┌──────────┐
      ) CC ${Q("✻")} ┊ (  You have free guest passes
     └──────────┘ ${Q("/passes")} to share`
    },
    cooldownSessions: 3,
    isRelevant: async () => {
      if (L1().hasVisitedPasses) return !1;
      let {
        eligible: Q
      } = Oz1();
      return Q
    }
  }], mL7 = []
})
// @from(Ln 458781, Col 0)
function dL7(A) {
  if (A.length === 0) return;
  if (A.length === 1) return A[0];
  let Q = A.map((B) => ({
    tip: B,
    sessions: bC1(B.id)
  }));
  return Q.sort((B, G) => G.sessions - B.sessions), Q[0]?.tip
}
// @from(Ln 458790, Col 0)
async function VH9(A) {
  if (jQ().spinnerTipsEnabled === !1) return;
  let Q = await fC1(A);
  if (Q.length === 0) return;
  return dL7(Q)
}
// @from(Ln 458797, Col 0)
function FH9(A) {
  KH9(A.id), l("tengu_tip_shown", {
    tipIdLength: A.id,
    cooldownSessions: A.cooldownSessions
  })
}
// @from(Ln 458803, Col 4)
HH9 = w(() => {
  Cx0();
  Z0();
  GQ();
  GB();
  Y8A();
  Ux0()
})
// @from(Ln 458812, Col 0)
function zH9() {
  let [A, Q] = a0(), {
    toolPermissionContext: B
  } = A;
  EH9.useEffect(() => {
    qx0(B, Q)
  }, [])
}
// @from(Ln 458820, Col 4)
EH9
// @from(Ln 458820, Col 9)
qx0
// @from(Ln 458821, Col 4)
$H9 = w(() => {
  Y9();
  hB();
  ys();
  EH9 = c(QA(), 1), qx0 = W0(async (A, Q) => {
    if (!A.isBypassPermissionsModeAvailable) return;
    if (!await FP0()) return;
    Q((G) => {
      return {
        ...G,
        toolPermissionContext: lhA(G.toolPermissionContext)
      }
    })
  })
})
// @from(Ln 458837, Col 0)
function CH9(A, Q, B) {
  let G = hC1.useRef(!1);
  hC1.useEffect(() => {
    if (!vG() || G.current) return;
    if (G.current = !0, A) RHA(A, B)
  }, [Q, A, B])
}
// @from(Ln 458844, Col 4)
hC1
// @from(Ln 458845, Col 4)
UH9 = w(() => {
  oN();
  hC1 = c(QA(), 1)
})
// @from(Ln 458850, Col 0)
function Nx0({
  hostPattern: {
    host: A
  },
  onUserResponse: Q
}) {
  function B(Z) {
    switch (Z) {
      case "yes":
        Q({
          allow: !0,
          persistToSettings: !1
        });
        break;
      case "yes-dont-ask-again":
        Q({
          allow: !0,
          persistToSettings: !0
        });
        break;
      case "no":
        Q({
          allow: !1,
          persistToSettings: !1
        });
        break
    }
  }
  return OY.createElement(VY, {
    title: "Network request outside of sandbox"
  }, OY.createElement(T, {
    flexDirection: "column",
    paddingX: 2,
    paddingY: 1
  }, OY.createElement(T, null, OY.createElement(C, {
    dimColor: !0
  }, "Host:"), OY.createElement(C, null, " ", A)), OY.createElement(T, {
    marginTop: 1
  }, OY.createElement(C, null, "Do you want to allow this connection?")), OY.createElement(T, null, OY.createElement(k0, {
    options: [{
      label: "Yes",
      value: "yes"
    }, {
      label: OY.createElement(C, null, "Yes, and don't ask again for ", OY.createElement(C, {
        bold: !0
      }, A)),
      value: "yes-dont-ask-again"
    }, {
      label: OY.createElement(C, null, "No, and tell Claude what to do differently ", OY.createElement(C, {
        bold: !0
      }, "(esc)")),
      value: "no"
    }],
    onChange: B,
    onCancel: () => {
      Q({
        allow: !1,
        persistToSettings: !1
      })
    }
  }))))
}
// @from(Ln 458912, Col 4)
OY
// @from(Ln 458913, Col 4)
qH9 = w(() => {
  fA();
  W8();
  dN();
  Z0();
  OY = c(QA(), 1)
})
// @from(Ln 458920, Col 4)
cL7
// @from(Ln 458920, Col 9)
AvJ
// @from(Ln 458920, Col 14)
gC1 = 604800000
// @from(Ln 458921, Col 2)
NH9 = 86400000
// @from(Ln 458922, Col 2)
wx0
// @from(Ln 458923, Col 4)
JmA = w(() => {
  cL7 = Math.pow(10, 8) * 24 * 60 * 60 * 1000, AvJ = -cL7, wx0 = Symbol.for("constructDateFrom")
})
// @from(Ln 458927, Col 0)
function ww(A, Q) {
  if (typeof A === "function") return A(Q);
  if (A && typeof A === "object" && wx0 in A) return A[wx0](Q);
  if (A instanceof Date) return new A.constructor(Q);
  return new Date(Q)
}
// @from(Ln 458933, Col 4)
QAA = w(() => {
  JmA()
})
// @from(Ln 458937, Col 0)
function VD(A, Q) {
  return ww(Q || A, A)
}
// @from(Ln 458940, Col 4)
WM = w(() => {
  QAA()
})
// @from(Ln 458943, Col 4)
wH9 = () => {}
// @from(Ln 458944, Col 4)
LH9 = () => {}
// @from(Ln 458945, Col 4)
OH9 = () => {}
// @from(Ln 458946, Col 4)
MH9 = () => {}
// @from(Ln 458947, Col 4)
RH9 = () => {}
// @from(Ln 458948, Col 4)
_H9 = () => {}
// @from(Ln 458949, Col 4)
jH9 = () => {}
// @from(Ln 458950, Col 4)
TH9 = () => {}
// @from(Ln 458951, Col 4)
PH9 = () => {}
// @from(Ln 458953, Col 0)
function BAA() {
  return pL7
}
// @from(Ln 458956, Col 4)
pL7
// @from(Ln 458957, Col 4)
XmA = w(() => {
  pL7 = {}
})
// @from(Ln 458961, Col 0)
function gp(A, Q) {
  let B = BAA(),
    G = Q?.weekStartsOn ?? Q?.locale?.options?.weekStartsOn ?? B.weekStartsOn ?? B.locale?.options?.weekStartsOn ?? 0,
    Z = VD(A, Q?.in),
    Y = Z.getDay(),
    J = (Y < G ? 7 : 0) + Y - G;
  return Z.setDate(Z.getDate() - J), Z.setHours(0, 0, 0, 0), Z
}
// @from(Ln 458969, Col 4)
T$A = w(() => {
  XmA();
  WM()
})
// @from(Ln 458974, Col 0)
function f8A(A, Q) {
  return gp(A, {
    ...Q,
    weekStartsOn: 1
  })
}
// @from(Ln 458980, Col 4)
ImA = w(() => {
  T$A()
})
// @from(Ln 458984, Col 0)
function uC1(A, Q) {
  let B = VD(A, Q?.in),
    G = B.getFullYear(),
    Z = ww(B, 0);
  Z.setFullYear(G + 1, 0, 4), Z.setHours(0, 0, 0, 0);
  let Y = f8A(Z),
    J = ww(B, 0);
  J.setFullYear(G, 0, 4), J.setHours(0, 0, 0, 0);
  let X = f8A(J);
  if (B.getTime() >= Y.getTime()) return G + 1;
  else if (B.getTime() >= X.getTime()) return G;
  else return G - 1
}
// @from(Ln 458997, Col 4)
mC1 = w(() => {
  QAA();
  ImA();
  WM()
})
// @from(Ln 459003, Col 0)
function Lx0(A) {
  let Q = VD(A),
    B = new Date(Date.UTC(Q.getFullYear(), Q.getMonth(), Q.getDate(), Q.getHours(), Q.getMinutes(), Q.getSeconds(), Q.getMilliseconds()));
  return B.setUTCFullYear(Q.getFullYear()), +A - +B
}
// @from(Ln 459008, Col 4)
SH9 = w(() => {
  WM()
})
// @from(Ln 459012, Col 0)
function xH9(A, ...Q) {
  let B = ww.bind(null, A || Q.find((G) => typeof G === "object"));
  return Q.map(B)
}
// @from(Ln 459016, Col 4)
yH9 = w(() => {
  QAA()
})
// @from(Ln 459020, Col 0)
function Ox0(A, Q) {
  let B = VD(A, Q?.in);
  return B.setHours(0, 0, 0, 0), B
}
// @from(Ln 459024, Col 4)
Mx0 = w(() => {
  WM()
})
// @from(Ln 459028, Col 0)
function vH9(A, Q, B) {
  let [G, Z] = xH9(B?.in, A, Q), Y = Ox0(G), J = Ox0(Z), X = +Y - Lx0(Y), I = +J - Lx0(J);
  return Math.round((X - I) / NH9)
}
// @from(Ln 459032, Col 4)
Rx0 = w(() => {
  SH9();
  yH9();
  JmA();
  Mx0()
})
// @from(Ln 459039, Col 0)
function kH9(A, Q) {
  let B = uC1(A, Q),
    G = ww(Q?.in || A, 0);
  return G.setFullYear(B, 0, 4), G.setHours(0, 0, 0, 0), f8A(G)
}
// @from(Ln 459044, Col 4)
_x0 = w(() => {
  QAA();
  mC1();
  ImA()
})
// @from(Ln 459049, Col 4)
bH9 = () => {}
// @from(Ln 459050, Col 4)
fH9 = () => {}
// @from(Ln 459051, Col 4)
hH9 = () => {}
// @from(Ln 459052, Col 4)
gH9 = () => {}
// @from(Ln 459053, Col 4)
uH9 = () => {}
// @from(Ln 459054, Col 4)
mH9 = () => {}
// @from(Ln 459055, Col 4)
dH9 = () => {}
// @from(Ln 459056, Col 4)
cH9 = () => {}
// @from(Ln 459057, Col 4)
pH9 = () => {}
// @from(Ln 459058, Col 4)
lH9 = () => {}
// @from(Ln 459059, Col 4)
iH9 = () => {}
// @from(Ln 459060, Col 4)
nH9 = () => {}
// @from(Ln 459061, Col 4)
aH9 = () => {}
// @from(Ln 459062, Col 4)
oH9 = () => {}
// @from(Ln 459063, Col 4)
rH9 = () => {}
// @from(Ln 459064, Col 4)
sH9 = () => {}
// @from(Ln 459065, Col 4)
tH9 = () => {}
// @from(Ln 459066, Col 4)
eH9 = () => {}
// @from(Ln 459068, Col 0)
function AE9(A) {
  return A instanceof Date || typeof A === "object" && Object.prototype.toString.call(A) === "[object Date]"
}
// @from(Ln 459071, Col 4)
jx0 = () => {}
// @from(Ln 459073, Col 0)
function QE9(A) {
  return !(!AE9(A) && typeof A !== "number" || isNaN(+VD(A)))
}
// @from(Ln 459076, Col 4)
Tx0 = w(() => {
  jx0();
  WM()
})
// @from(Ln 459080, Col 4)
BE9 = () => {}
// @from(Ln 459081, Col 4)
GE9 = () => {}
// @from(Ln 459082, Col 4)
ZE9 = () => {}
// @from(Ln 459083, Col 4)
YE9 = () => {}
// @from(Ln 459084, Col 4)
JE9 = () => {}
// @from(Ln 459085, Col 4)
XE9 = () => {}
// @from(Ln 459086, Col 4)
IE9 = () => {}
// @from(Ln 459087, Col 4)
DE9 = () => {}
// @from(Ln 459088, Col 4)
WE9 = () => {}
// @from(Ln 459089, Col 4)
KE9 = () => {}
// @from(Ln 459090, Col 4)
VE9 = () => {}
// @from(Ln 459091, Col 4)
FE9 = () => {}
// @from(Ln 459092, Col 4)
HE9 = () => {}
// @from(Ln 459093, Col 4)
EE9 = () => {}
// @from(Ln 459094, Col 4)
zE9 = () => {}
// @from(Ln 459095, Col 4)
$E9 = () => {}
// @from(Ln 459096, Col 4)
CE9 = () => {}
// @from(Ln 459097, Col 4)
UE9 = () => {}
// @from(Ln 459098, Col 4)
qE9 = () => {}
// @from(Ln 459099, Col 4)
NE9 = () => {}
// @from(Ln 459100, Col 4)
wE9 = () => {}
// @from(Ln 459101, Col 4)
LE9 = () => {}
// @from(Ln 459102, Col 4)
OE9 = () => {}
// @from(Ln 459103, Col 4)
ME9 = () => {}
// @from(Ln 459104, Col 4)
RE9 = () => {}
// @from(Ln 459105, Col 4)
_E9 = () => {}
// @from(Ln 459106, Col 4)
jE9 = () => {}
// @from(Ln 459107, Col 4)
TE9 = () => {}
// @from(Ln 459108, Col 4)
PE9 = () => {}
// @from(Ln 459109, Col 4)
SE9 = () => {}
// @from(Ln 459110, Col 4)
xE9 = () => {}
// @from(Ln 459111, Col 4)
yE9 = () => {}
// @from(Ln 459112, Col 4)
vE9 = () => {}
// @from(Ln 459114, Col 0)
function kE9(A, Q) {
  let B = VD(A, Q?.in);
  return B.setFullYear(B.getFullYear(), 0, 1), B.setHours(0, 0, 0, 0), B
}
// @from(Ln 459118, Col 4)
Px0 = w(() => {
  WM()
})
// @from(Ln 459121, Col 4)
bE9 = () => {}
// @from(Ln 459122, Col 4)
fE9 = () => {}
// @from(Ln 459123, Col 4)
hE9 = () => {}
// @from(Ln 459124, Col 4)
gE9 = () => {}
// @from(Ln 459125, Col 4)
uE9 = () => {}
// @from(Ln 459126, Col 4)
mE9 = () => {}
// @from(Ln 459127, Col 4)
dE9 = () => {}
// @from(Ln 459128, Col 4)
cE9 = () => {}
// @from(Ln 459129, Col 4)
pE9 = () => {}
// @from(Ln 459130, Col 4)
lE9 = () => {}
// @from(Ln 459131, Col 4)
iE9 = () => {}
// @from(Ln 459132, Col 4)
nE9 = () => {}
// @from(Ln 459133, Col 4)
aE9 = () => {}
// @from(Ln 459134, Col 4)
lL7
// @from(Ln 459134, Col 9)
oE9 = (A, Q, B) => {
  let G, Z = lL7[A];
  if (typeof Z === "string") G = Z;
  else if (Q === 1) G = Z.one;
  else G = Z.other.replace("{{count}}", Q.toString());
  if (B?.addSuffix)
    if (B.comparison && B.comparison > 0) return "in " + G;
    else return G + " ago";
  return G
}
// @from(Ln 459144, Col 4)
rE9 = w(() => {
  lL7 = {
    lessThanXSeconds: {
      one: "less than a second",
      other: "less than {{count}} seconds"
    },
    xSeconds: {
      one: "1 second",
      other: "{{count}} seconds"
    },
    halfAMinute: "half a minute",
    lessThanXMinutes: {
      one: "less than a minute",
      other: "less than {{count}} minutes"
    },
    xMinutes: {
      one: "1 minute",
      other: "{{count}} minutes"
    },
    aboutXHours: {
      one: "about 1 hour",
      other: "about {{count}} hours"
    },
    xHours: {
      one: "1 hour",
      other: "{{count}} hours"
    },
    xDays: {
      one: "1 day",
      other: "{{count}} days"
    },
    aboutXWeeks: {
      one: "about 1 week",
      other: "about {{count}} weeks"
    },
    xWeeks: {
      one: "1 week",
      other: "{{count}} weeks"
    },
    aboutXMonths: {
      one: "about 1 month",
      other: "about {{count}} months"
    },
    xMonths: {
      one: "1 month",
      other: "{{count}} months"
    },
    aboutXYears: {
      one: "about 1 year",
      other: "about {{count}} years"
    },
    xYears: {
      one: "1 year",
      other: "{{count}} years"
    },
    overXYears: {
      one: "over 1 year",
      other: "over {{count}} years"
    },
    almostXYears: {
      one: "almost 1 year",
      other: "almost {{count}} years"
    }
  }
})
// @from(Ln 459210, Col 0)
function dC1(A) {
  return (Q = {}) => {
    let B = Q.width ? String(Q.width) : A.defaultWidth;
    return A.formats[B] || A.formats[A.defaultWidth]
  }
}
// @from(Ln 459216, Col 4)
iL7
// @from(Ln 459216, Col 9)
nL7
// @from(Ln 459216, Col 14)
aL7
// @from(Ln 459216, Col 19)
sE9
// @from(Ln 459217, Col 4)
tE9 = w(() => {
  iL7 = {
    full: "EEEE, MMMM do, y",
    long: "MMMM do, y",
    medium: "MMM d, y",
    short: "MM/dd/yyyy"
  }, nL7 = {
    full: "h:mm:ss a zzzz",
    long: "h:mm:ss a z",
    medium: "h:mm:ss a",
    short: "h:mm a"
  }, aL7 = {
    full: "{{date}} 'at' {{time}}",
    long: "{{date}} 'at' {{time}}",
    medium: "{{date}}, {{time}}",
    short: "{{date}}, {{time}}"
  }, sE9 = {
    date: dC1({
      formats: iL7,
      defaultWidth: "full"
    }),
    time: dC1({
      formats: nL7,
      defaultWidth: "full"
    }),
    dateTime: dC1({
      formats: aL7,
      defaultWidth: "full"
    })
  }
})
// @from(Ln 459248, Col 4)
oL7
// @from(Ln 459248, Col 9)
eE9 = (A, Q, B, G) => oL7[A]
// @from(Ln 459249, Col 4)
Az9 = w(() => {
  oL7 = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: "P"
  }
})
// @from(Ln 459260, Col 0)
function P$A(A) {
  return (Q, B) => {
    let G = B?.context ? String(B.context) : "standalone",
      Z;
    if (G === "formatting" && A.formattingValues) {
      let J = A.defaultFormattingWidth || A.defaultWidth,
        X = B?.width ? String(B.width) : J;
      Z = A.formattingValues[X] || A.formattingValues[J]
    } else {
      let J = A.defaultWidth,
        X = B?.width ? String(B.width) : A.defaultWidth;
      Z = A.values[X] || A.values[J]
    }
    let Y = A.argumentCallback ? A.argumentCallback(Q) : Q;
    return Z[Y]
  }
}
// @from(Ln 459277, Col 4)
rL7
// @from(Ln 459277, Col 9)
sL7
// @from(Ln 459277, Col 14)
tL7
// @from(Ln 459277, Col 19)
eL7
// @from(Ln 459277, Col 24)
AO7
// @from(Ln 459277, Col 29)
QO7
// @from(Ln 459277, Col 34)
BO7 = (A, Q) => {
    let B = Number(A),
      G = B % 100;
    if (G > 20 || G < 10) switch (G % 10) {
      case 1:
        return B + "st";
      case 2:
        return B + "nd";
      case 3:
        return B + "rd"
    }
    return B + "th"
  }
// @from(Ln 459290, Col 2)
Qz9
// @from(Ln 459291, Col 4)
Bz9 = w(() => {
  rL7 = {
    narrow: ["B", "A"],
    abbreviated: ["BC", "AD"],
    wide: ["Before Christ", "Anno Domini"]
  }, sL7 = {
    narrow: ["1", "2", "3", "4"],
    abbreviated: ["Q1", "Q2", "Q3", "Q4"],
    wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
  }, tL7 = {
    narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    abbreviated: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    wide: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  }, eL7 = {
    narrow: ["S", "M", "T", "W", "T", "F", "S"],
    short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    wide: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  }, AO7 = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    }
  }, QO7 = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    }
  }, Qz9 = {
    ordinalNumber: BO7,
    era: P$A({
      values: rL7,
      defaultWidth: "wide"
    }),
    quarter: P$A({
      values: sL7,
      defaultWidth: "wide",
      argumentCallback: (A) => A - 1
    }),
    month: P$A({
      values: tL7,
      defaultWidth: "wide"
    }),
    day: P$A({
      values: eL7,
      defaultWidth: "wide"
    }),
    dayPeriod: P$A({
      values: AO7,
      defaultWidth: "wide",
      formattingValues: QO7,
      defaultFormattingWidth: "wide"
    })
  }
})
// @from(Ln 459399, Col 0)
function S$A(A) {
  return (Q, B = {}) => {
    let G = B.width,
      Z = G && A.matchPatterns[G] || A.matchPatterns[A.defaultMatchWidth],
      Y = Q.match(Z);
    if (!Y) return null;
    let J = Y[0],
      X = G && A.parsePatterns[G] || A.parsePatterns[A.defaultParseWidth],
      I = Array.isArray(X) ? ZO7(X, (K) => K.test(J)) : GO7(X, (K) => K.test(J)),
      D;
    D = A.valueCallback ? A.valueCallback(I) : I, D = B.valueCallback ? B.valueCallback(D) : D;
    let W = Q.slice(J.length);
    return {
      value: D,
      rest: W
    }
  }
}
// @from(Ln 459418, Col 0)
function GO7(A, Q) {
  for (let B in A)
    if (Object.prototype.hasOwnProperty.call(A, B) && Q(A[B])) return B;
  return
}
// @from(Ln 459424, Col 0)
function ZO7(A, Q) {
  for (let B = 0; B < A.length; B++)
    if (Q(A[B])) return B;
  return
}
// @from(Ln 459430, Col 0)
function Gz9(A) {
  return (Q, B = {}) => {
    let G = Q.match(A.matchPattern);
    if (!G) return null;
    let Z = G[0],
      Y = Q.match(A.parsePattern);
    if (!Y) return null;
    let J = A.valueCallback ? A.valueCallback(Y[0]) : Y[0];
    J = B.valueCallback ? B.valueCallback(J) : J;
    let X = Q.slice(Z.length);
    return {
      value: J,
      rest: X
    }
  }
}
// @from(Ln 459446, Col 4)
YO7
// @from(Ln 459446, Col 9)
JO7
// @from(Ln 459446, Col 14)
XO7
// @from(Ln 459446, Col 19)
IO7
// @from(Ln 459446, Col 24)
DO7
// @from(Ln 459446, Col 29)
WO7
// @from(Ln 459446, Col 34)
KO7
// @from(Ln 459446, Col 39)
VO7
// @from(Ln 459446, Col 44)
FO7
// @from(Ln 459446, Col 49)
HO7
// @from(Ln 459446, Col 54)
EO7
// @from(Ln 459446, Col 59)
zO7
// @from(Ln 459446, Col 64)
Zz9
// @from(Ln 459447, Col 4)
Yz9 = w(() => {
  YO7 = /^(\d+)(th|st|nd|rd)?/i, JO7 = /\d+/i, XO7 = {
    narrow: /^(b|a)/i,
    abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
    wide: /^(before christ|before common era|anno domini|common era)/i
  }, IO7 = {
    any: [/^b/i, /^(a|c)/i]
  }, DO7 = {
    narrow: /^[1234]/i,
    abbreviated: /^q[1234]/i,
    wide: /^[1234](th|st|nd|rd)? quarter/i
  }, WO7 = {
    any: [/1/i, /2/i, /3/i, /4/i]
  }, KO7 = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
  }, VO7 = {
    narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
    any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
  }, FO7 = {
    narrow: /^[smtwf]/i,
    short: /^(su|mo|tu|we|th|fr|sa)/i,
    abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
  }, HO7 = {
    narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
    any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
  }, EO7 = {
    narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
    any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
  }, zO7 = {
    any: {
      am: /^a/i,
      pm: /^p/i,
      midnight: /^mi/i,
      noon: /^no/i,
      morning: /morning/i,
      afternoon: /afternoon/i,
      evening: /evening/i,
      night: /night/i
    }
  }, Zz9 = {
    ordinalNumber: Gz9({
      matchPattern: YO7,
      parsePattern: JO7,
      valueCallback: (A) => parseInt(A, 10)
    }),
    era: S$A({
      matchPatterns: XO7,
      defaultMatchWidth: "wide",
      parsePatterns: IO7,
      defaultParseWidth: "any"
    }),
    quarter: S$A({
      matchPatterns: DO7,
      defaultMatchWidth: "wide",
      parsePatterns: WO7,
      defaultParseWidth: "any",
      valueCallback: (A) => A + 1
    }),
    month: S$A({
      matchPatterns: KO7,
      defaultMatchWidth: "wide",
      parsePatterns: VO7,
      defaultParseWidth: "any"
    }),
    day: S$A({
      matchPatterns: FO7,
      defaultMatchWidth: "wide",
      parsePatterns: HO7,
      defaultParseWidth: "any"
    }),
    dayPeriod: S$A({
      matchPatterns: EO7,
      defaultMatchWidth: "any",
      parsePatterns: zO7,
      defaultParseWidth: "any"
    })
  }
})
// @from(Ln 459528, Col 4)
Sx0
// @from(Ln 459529, Col 4)
Jz9 = w(() => {
  rE9();
  tE9();
  Az9();
  Bz9();
  Yz9();
  Sx0 = {
    code: "en-US",
    formatDistance: oE9,
    formatLong: sE9,
    formatRelative: eE9,
    localize: Qz9,
    match: Zz9,
    options: {
      weekStartsOn: 0,
      firstWeekContainsDate: 1
    }
  }
})
// @from(Ln 459548, Col 4)
Xz9 = w(() => {
  Jz9()
})
// @from(Ln 459552, Col 0)
function Iz9(A, Q) {
  let B = VD(A, Q?.in);
  return vH9(B, kE9(B)) + 1
}
// @from(Ln 459556, Col 4)
xx0 = w(() => {
  Rx0();
  Px0();
  WM()
})
// @from(Ln 459562, Col 0)
function Dz9(A, Q) {
  let B = VD(A, Q?.in),
    G = +f8A(B) - +kH9(B);
  return Math.round(G / gC1) + 1
}
// @from(Ln 459567, Col 4)
yx0 = w(() => {
  JmA();
  ImA();
  _x0();
  WM()
})
// @from(Ln 459574, Col 0)
function cC1(A, Q) {
  let B = VD(A, Q?.in),
    G = B.getFullYear(),
    Z = BAA(),
    Y = Q?.firstWeekContainsDate ?? Q?.locale?.options?.firstWeekContainsDate ?? Z.firstWeekContainsDate ?? Z.locale?.options?.firstWeekContainsDate ?? 1,
    J = ww(Q?.in || A, 0);
  J.setFullYear(G + 1, 0, Y), J.setHours(0, 0, 0, 0);
  let X = gp(J, Q),
    I = ww(Q?.in || A, 0);
  I.setFullYear(G, 0, Y), I.setHours(0, 0, 0, 0);
  let D = gp(I, Q);
  if (+B >= +X) return G + 1;
  else if (+B >= +D) return G;
  else return G - 1
}
// @from(Ln 459589, Col 4)
pC1 = w(() => {
  XmA();
  QAA();
  T$A();
  WM()
})
// @from(Ln 459596, Col 0)
function Wz9(A, Q) {
  let B = BAA(),
    G = Q?.firstWeekContainsDate ?? Q?.locale?.options?.firstWeekContainsDate ?? B.firstWeekContainsDate ?? B.locale?.options?.firstWeekContainsDate ?? 1,
    Z = cC1(A, Q),
    Y = ww(Q?.in || A, 0);
  return Y.setFullYear(Z, 0, G), Y.setHours(0, 0, 0, 0), gp(Y, Q)
}
// @from(Ln 459603, Col 4)
vx0 = w(() => {
  XmA();
  QAA();
  pC1();
  T$A()
})
// @from(Ln 459610, Col 0)
function Kz9(A, Q) {
  let B = VD(A, Q?.in),
    G = +gp(B, Q) - +Wz9(B, Q);
  return Math.round(G / gC1) + 1
}
// @from(Ln 459615, Col 4)
kx0 = w(() => {
  JmA();
  T$A();
  vx0();
  WM()
})
// @from(Ln 459622, Col 0)
function EG(A, Q) {
  let B = A < 0 ? "-" : "",
    G = Math.abs(A).toString().padStart(Q, "0");
  return B + G
}
// @from(Ln 459627, Col 4)
up
// @from(Ln 459628, Col 4)
Vz9 = w(() => {
  up = {
    y(A, Q) {
      let B = A.getFullYear(),
        G = B > 0 ? B : 1 - B;
      return EG(Q === "yy" ? G % 100 : G, Q.length)
    },
    M(A, Q) {
      let B = A.getMonth();
      return Q === "M" ? String(B + 1) : EG(B + 1, 2)
    },
    d(A, Q) {
      return EG(A.getDate(), Q.length)
    },
    a(A, Q) {
      let B = A.getHours() / 12 >= 1 ? "pm" : "am";
      switch (Q) {
        case "a":
        case "aa":
          return B.toUpperCase();
        case "aaa":
          return B;
        case "aaaaa":
          return B[0];
        case "aaaa":
        default:
          return B === "am" ? "a.m." : "p.m."
      }
    },
    h(A, Q) {
      return EG(A.getHours() % 12 || 12, Q.length)
    },
    H(A, Q) {
      return EG(A.getHours(), Q.length)
    },
    m(A, Q) {
      return EG(A.getMinutes(), Q.length)
    },
    s(A, Q) {
      return EG(A.getSeconds(), Q.length)
    },
    S(A, Q) {
      let B = Q.length,
        G = A.getMilliseconds(),
        Z = Math.trunc(G * Math.pow(10, B - 3));
      return EG(Z, Q.length)
    }
  }
})
// @from(Ln 459678, Col 0)
function Fz9(A, Q = "") {
  let B = A > 0 ? "-" : "+",
    G = Math.abs(A),
    Z = Math.trunc(G / 60),
    Y = G % 60;
  if (Y === 0) return B + String(Z);
  return B + String(Z) + Q + EG(Y, 2)
}
// @from(Ln 459687, Col 0)
function Hz9(A, Q) {
  if (A % 60 === 0) return (A > 0 ? "-" : "+") + EG(Math.abs(A) / 60, 2);
  return h8A(A, Q)
}
// @from(Ln 459692, Col 0)
function h8A(A, Q = "") {
  let B = A > 0 ? "-" : "+",
    G = Math.abs(A),
    Z = EG(Math.trunc(G / 60), 2),
    Y = EG(G % 60, 2);
  return B + Z + Q + Y
}
// @from(Ln 459699, Col 4)
x$A
// @from(Ln 459699, Col 9)
bx0
// @from(Ln 459700, Col 4)
Ez9 = w(() => {
  xx0();
  yx0();
  mC1();
  kx0();
  pC1();
  Vz9();
  x$A = {
    am: "am",
    pm: "pm",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }, bx0 = {
    G: function (A, Q, B) {
      let G = A.getFullYear() > 0 ? 1 : 0;
      switch (Q) {
        case "G":
        case "GG":
        case "GGG":
          return B.era(G, {
            width: "abbreviated"
          });
        case "GGGGG":
          return B.era(G, {
            width: "narrow"
          });
        case "GGGG":
        default:
          return B.era(G, {
            width: "wide"
          })
      }
    },
    y: function (A, Q, B) {
      if (Q === "yo") {
        let G = A.getFullYear(),
          Z = G > 0 ? G : 1 - G;
        return B.ordinalNumber(Z, {
          unit: "year"
        })
      }
      return up.y(A, Q)
    },
    Y: function (A, Q, B, G) {
      let Z = cC1(A, G),
        Y = Z > 0 ? Z : 1 - Z;
      if (Q === "YY") {
        let J = Y % 100;
        return EG(J, 2)
      }
      if (Q === "Yo") return B.ordinalNumber(Y, {
        unit: "year"
      });
      return EG(Y, Q.length)
    },
    R: function (A, Q) {
      let B = uC1(A);
      return EG(B, Q.length)
    },
    u: function (A, Q) {
      let B = A.getFullYear();
      return EG(B, Q.length)
    },
    Q: function (A, Q, B) {
      let G = Math.ceil((A.getMonth() + 1) / 3);
      switch (Q) {
        case "Q":
          return String(G);
        case "QQ":
          return EG(G, 2);
        case "Qo":
          return B.ordinalNumber(G, {
            unit: "quarter"
          });
        case "QQQ":
          return B.quarter(G, {
            width: "abbreviated",
            context: "formatting"
          });
        case "QQQQQ":
          return B.quarter(G, {
            width: "narrow",
            context: "formatting"
          });
        case "QQQQ":
        default:
          return B.quarter(G, {
            width: "wide",
            context: "formatting"
          })
      }
    },
    q: function (A, Q, B) {
      let G = Math.ceil((A.getMonth() + 1) / 3);
      switch (Q) {
        case "q":
          return String(G);
        case "qq":
          return EG(G, 2);
        case "qo":
          return B.ordinalNumber(G, {
            unit: "quarter"
          });
        case "qqq":
          return B.quarter(G, {
            width: "abbreviated",
            context: "standalone"
          });
        case "qqqqq":
          return B.quarter(G, {
            width: "narrow",
            context: "standalone"
          });
        case "qqqq":
        default:
          return B.quarter(G, {
            width: "wide",
            context: "standalone"
          })
      }
    },
    M: function (A, Q, B) {
      let G = A.getMonth();
      switch (Q) {
        case "M":
        case "MM":
          return up.M(A, Q);
        case "Mo":
          return B.ordinalNumber(G + 1, {
            unit: "month"
          });
        case "MMM":
          return B.month(G, {
            width: "abbreviated",
            context: "formatting"
          });
        case "MMMMM":
          return B.month(G, {
            width: "narrow",
            context: "formatting"
          });
        case "MMMM":
        default:
          return B.month(G, {
            width: "wide",
            context: "formatting"
          })
      }
    },
    L: function (A, Q, B) {
      let G = A.getMonth();
      switch (Q) {
        case "L":
          return String(G + 1);
        case "LL":
          return EG(G + 1, 2);
        case "Lo":
          return B.ordinalNumber(G + 1, {
            unit: "month"
          });
        case "LLL":
          return B.month(G, {
            width: "abbreviated",
            context: "standalone"
          });
        case "LLLLL":
          return B.month(G, {
            width: "narrow",
            context: "standalone"
          });
        case "LLLL":
        default:
          return B.month(G, {
            width: "wide",
            context: "standalone"
          })
      }
    },
    w: function (A, Q, B, G) {
      let Z = Kz9(A, G);
      if (Q === "wo") return B.ordinalNumber(Z, {
        unit: "week"
      });
      return EG(Z, Q.length)
    },
    I: function (A, Q, B) {
      let G = Dz9(A);
      if (Q === "Io") return B.ordinalNumber(G, {
        unit: "week"
      });
      return EG(G, Q.length)
    },
    d: function (A, Q, B) {
      if (Q === "do") return B.ordinalNumber(A.getDate(), {
        unit: "date"
      });
      return up.d(A, Q)
    },
    D: function (A, Q, B) {
      let G = Iz9(A);
      if (Q === "Do") return B.ordinalNumber(G, {
        unit: "dayOfYear"
      });
      return EG(G, Q.length)
    },
    E: function (A, Q, B) {
      let G = A.getDay();
      switch (Q) {
        case "E":
        case "EE":
        case "EEE":
          return B.day(G, {
            width: "abbreviated",
            context: "formatting"
          });
        case "EEEEE":
          return B.day(G, {
            width: "narrow",
            context: "formatting"
          });
        case "EEEEEE":
          return B.day(G, {
            width: "short",
            context: "formatting"
          });
        case "EEEE":
        default:
          return B.day(G, {
            width: "wide",
            context: "formatting"
          })
      }
    },
    e: function (A, Q, B, G) {
      let Z = A.getDay(),
        Y = (Z - G.weekStartsOn + 8) % 7 || 7;
      switch (Q) {
        case "e":
          return String(Y);
        case "ee":
          return EG(Y, 2);
        case "eo":
          return B.ordinalNumber(Y, {
            unit: "day"
          });
        case "eee":
          return B.day(Z, {
            width: "abbreviated",
            context: "formatting"
          });
        case "eeeee":
          return B.day(Z, {
            width: "narrow",
            context: "formatting"
          });
        case "eeeeee":
          return B.day(Z, {
            width: "short",
            context: "formatting"
          });
        case "eeee":
        default:
          return B.day(Z, {
            width: "wide",
            context: "formatting"
          })
      }
    },
    c: function (A, Q, B, G) {
      let Z = A.getDay(),
        Y = (Z - G.weekStartsOn + 8) % 7 || 7;
      switch (Q) {
        case "c":
          return String(Y);
        case "cc":
          return EG(Y, Q.length);
        case "co":
          return B.ordinalNumber(Y, {
            unit: "day"
          });
        case "ccc":
          return B.day(Z, {
            width: "abbreviated",
            context: "standalone"
          });
        case "ccccc":
          return B.day(Z, {
            width: "narrow",
            context: "standalone"
          });
        case "cccccc":
          return B.day(Z, {
            width: "short",
            context: "standalone"
          });
        case "cccc":
        default:
          return B.day(Z, {
            width: "wide",
            context: "standalone"
          })
      }
    },
    i: function (A, Q, B) {
      let G = A.getDay(),
        Z = G === 0 ? 7 : G;
      switch (Q) {
        case "i":
          return String(Z);
        case "ii":
          return EG(Z, Q.length);
        case "io":
          return B.ordinalNumber(Z, {
            unit: "day"
          });
        case "iii":
          return B.day(G, {
            width: "abbreviated",
            context: "formatting"
          });
        case "iiiii":
          return B.day(G, {
            width: "narrow",
            context: "formatting"
          });
        case "iiiiii":
          return B.day(G, {
            width: "short",
            context: "formatting"
          });
        case "iiii":
        default:
          return B.day(G, {
            width: "wide",
            context: "formatting"
          })
      }
    },
    a: function (A, Q, B) {
      let Z = A.getHours() / 12 >= 1 ? "pm" : "am";
      switch (Q) {
        case "a":
        case "aa":
          return B.dayPeriod(Z, {
            width: "abbreviated",
            context: "formatting"
          });
        case "aaa":
          return B.dayPeriod(Z, {
            width: "abbreviated",
            context: "formatting"
          }).toLowerCase();
        case "aaaaa":
          return B.dayPeriod(Z, {
            width: "narrow",
            context: "formatting"
          });
        case "aaaa":
        default:
          return B.dayPeriod(Z, {
            width: "wide",
            context: "formatting"
          })
      }
    },
    b: function (A, Q, B) {
      let G = A.getHours(),
        Z;
      if (G === 12) Z = x$A.noon;
      else if (G === 0) Z = x$A.midnight;
      else Z = G / 12 >= 1 ? "pm" : "am";
      switch (Q) {
        case "b":
        case "bb":
          return B.dayPeriod(Z, {
            width: "abbreviated",
            context: "formatting"
          });
        case "bbb":
          return B.dayPeriod(Z, {
            width: "abbreviated",
            context: "formatting"
          }).toLowerCase();
        case "bbbbb":
          return B.dayPeriod(Z, {
            width: "narrow",
            context: "formatting"
          });
        case "bbbb":
        default:
          return B.dayPeriod(Z, {
            width: "wide",
            context: "formatting"
          })
      }
    },
    B: function (A, Q, B) {
      let G = A.getHours(),
        Z;
      if (G >= 17) Z = x$A.evening;
      else if (G >= 12) Z = x$A.afternoon;
      else if (G >= 4) Z = x$A.morning;
      else Z = x$A.night;
      switch (Q) {
        case "B":
        case "BB":
        case "BBB":
          return B.dayPeriod(Z, {
            width: "abbreviated",
            context: "formatting"
          });
        case "BBBBB":
          return B.dayPeriod(Z, {
            width: "narrow",
            context: "formatting"
          });
        case "BBBB":
        default:
          return B.dayPeriod(Z, {
            width: "wide",
            context: "formatting"
          })
      }
    },
    h: function (A, Q, B) {
      if (Q === "ho") {
        let G = A.getHours() % 12;
        if (G === 0) G = 12;
        return B.ordinalNumber(G, {
          unit: "hour"
        })
      }
      return up.h(A, Q)
    },
    H: function (A, Q, B) {
      if (Q === "Ho") return B.ordinalNumber(A.getHours(), {
        unit: "hour"
      });
      return up.H(A, Q)
    },
    K: function (A, Q, B) {
      let G = A.getHours() % 12;
      if (Q === "Ko") return B.ordinalNumber(G, {
        unit: "hour"
      });
      return EG(G, Q.length)
    },
    k: function (A, Q, B) {
      let G = A.getHours();
      if (G === 0) G = 24;
      if (Q === "ko") return B.ordinalNumber(G, {
        unit: "hour"
      });
      return EG(G, Q.length)
    },
    m: function (A, Q, B) {
      if (Q === "mo") return B.ordinalNumber(A.getMinutes(), {
        unit: "minute"
      });
      return up.m(A, Q)
    },
    s: function (A, Q, B) {
      if (Q === "so") return B.ordinalNumber(A.getSeconds(), {
        unit: "second"
      });
      return up.s(A, Q)
    },
    S: function (A, Q) {
      return up.S(A, Q)
    },
    X: function (A, Q, B) {
      let G = A.getTimezoneOffset();
      if (G === 0) return "Z";
      switch (Q) {
        case "X":
          return Hz9(G);
        case "XXXX":
        case "XX":
          return h8A(G);
        case "XXXXX":
        case "XXX":
        default:
          return h8A(G, ":")
      }
    },
    x: function (A, Q, B) {
      let G = A.getTimezoneOffset();
      switch (Q) {
        case "x":
          return Hz9(G);
        case "xxxx":
        case "xx":
          return h8A(G);
        case "xxxxx":
        case "xxx":
        default:
          return h8A(G, ":")
      }
    },
    O: function (A, Q, B) {
      let G = A.getTimezoneOffset();
      switch (Q) {
        case "O":
        case "OO":
        case "OOO":
          return "GMT" + Fz9(G, ":");
        case "OOOO":
        default:
          return "GMT" + h8A(G, ":")
      }
    },
    z: function (A, Q, B) {
      let G = A.getTimezoneOffset();
      switch (Q) {
        case "z":
        case "zz":
        case "zzz":
          return "GMT" + Fz9(G, ":");
        case "zzzz":
        default:
          return "GMT" + h8A(G, ":")
      }
    },
    t: function (A, Q, B) {
      let G = Math.trunc(+A / 1000);
      return EG(G, Q.length)
    },
    T: function (A, Q, B) {
      return EG(+A, Q.length)
    }
  }
})
// @from(Ln 460236, Col 4)
zz9 = (A, Q) => {
    switch (A) {
      case "P":
        return Q.date({
          width: "short"
        });
      case "PP":
        return Q.date({
          width: "medium"
        });
      case "PPP":
        return Q.date({
          width: "long"
        });
      case "PPPP":
      default:
        return Q.date({
          width: "full"
        })
    }
  }
// @from(Ln 460257, Col 2)
$z9 = (A, Q) => {
    switch (A) {
      case "p":
        return Q.time({
          width: "short"
        });
      case "pp":
        return Q.time({
          width: "medium"
        });
      case "ppp":
        return Q.time({
          width: "long"
        });
      case "pppp":
      default:
        return Q.time({
          width: "full"
        })
    }
  }
// @from(Ln 460278, Col 2)
$O7 = (A, Q) => {
    let B = A.match(/(P+)(p+)?/) || [],
      G = B[1],
      Z = B[2];
    if (!Z) return zz9(A, Q);
    let Y;
    switch (G) {
      case "P":
        Y = Q.dateTime({
          width: "short"
        });
        break;
      case "PP":
        Y = Q.dateTime({
          width: "medium"
        });
        break;
      case "PPP":
        Y = Q.dateTime({
          width: "long"
        });
        break;
      case "PPPP":
      default:
        Y = Q.dateTime({
          width: "full"
        });
        break
    }
    return Y.replace("{{date}}", zz9(G, Q)).replace("{{time}}", $z9(Z, Q))
  }
// @from(Ln 460309, Col 2)
Cz9
// @from(Ln 460310, Col 4)
Uz9 = w(() => {
  Cz9 = {
    p: $z9,
    P: $O7
  }
})
// @from(Ln 460317, Col 0)
function qz9(A) {
  return CO7.test(A)
}
// @from(Ln 460321, Col 0)
function Nz9(A) {
  return UO7.test(A)
}
// @from(Ln 460325, Col 0)
function wz9(A, Q, B) {
  let G = NO7(A, Q, B);
  if (console.warn(G), qO7.includes(A)) throw RangeError(G)
}
// @from(Ln 460330, Col 0)
function NO7(A, Q, B) {
  let G = A[0] === "Y" ? "years" : "days of the month";
  return `Use \`${A.toLowerCase()}\` instead of \`${A}\` (in \`${Q}\`) for formatting ${G} to the input \`${B}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`
}
// @from(Ln 460334, Col 4)
CO7
// @from(Ln 460334, Col 9)
UO7
// @from(Ln 460334, Col 14)
qO7
// @from(Ln 460335, Col 4)
Lz9 = w(() => {
  CO7 = /^D+$/, UO7 = /^Y+$/, qO7 = ["D", "DD", "YY", "YYYY"]
})
// @from(Ln 460339, Col 0)
function Oz9(A, Q, B) {
  let G = BAA(),
    Z = B?.locale ?? G.locale ?? Sx0,
    Y = B?.firstWeekContainsDate ?? B?.locale?.options?.firstWeekContainsDate ?? G.firstWeekContainsDate ?? G.locale?.options?.firstWeekContainsDate ?? 1,
    J = B?.weekStartsOn ?? B?.locale?.options?.weekStartsOn ?? G.weekStartsOn ?? G.locale?.options?.weekStartsOn ?? 0,
    X = VD(A, B?.in);
  if (!QE9(X)) throw RangeError("Invalid time value");
  let I = Q.match(LO7).map((W) => {
    let K = W[0];
    if (K === "p" || K === "P") {
      let V = Cz9[K];
      return V(W, Z.formatLong)
    }
    return W
  }).join("").match(wO7).map((W) => {
    if (W === "''") return {
      isToken: !1,
      value: "'"
    };
    let K = W[0];
    if (K === "'") return {
      isToken: !1,
      value: _O7(W)
    };
    if (bx0[K]) return {
      isToken: !0,
      value: W
    };
    if (K.match(RO7)) throw RangeError("Format string contains an unescaped latin alphabet character `" + K + "`");
    return {
      isToken: !1,
      value: W
    }
  });
  if (Z.localize.preprocessor) I = Z.localize.preprocessor(X, I);
  let D = {
    firstWeekContainsDate: Y,
    weekStartsOn: J,
    locale: Z
  };
  return I.map((W) => {
    if (!W.isToken) return W.value;
    let K = W.value;
    if (!B?.useAdditionalWeekYearTokens && Nz9(K) || !B?.useAdditionalDayOfYearTokens && qz9(K)) wz9(K, Q, String(A));
    let V = bx0[K[0]];
    return V(X, K, Z.localize, D)
  }).join("")
}
// @from(Ln 460388, Col 0)
function _O7(A) {
  let Q = A.match(OO7);
  if (!Q) return A;
  return Q[1].replace(MO7, "'")
}
// @from(Ln 460393, Col 4)
wO7
// @from(Ln 460393, Col 9)
LO7
// @from(Ln 460393, Col 14)
OO7
// @from(Ln 460393, Col 19)
MO7
// @from(Ln 460393, Col 24)
RO7
// @from(Ln 460394, Col 4)
Mz9 = w(() => {
  Xz9();
  XmA();
  Ez9();
  Uz9();
  Lz9();
  Tx0();
  WM();
  wO7 = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, LO7 = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, OO7 = /^'([^]*?)'?$/, MO7 = /''/g, RO7 = /[a-zA-Z]/
})
// @from(Ln 460404, Col 4)
Rz9 = () => {}
// @from(Ln 460405, Col 4)
_z9 = () => {}
// @from(Ln 460406, Col 4)
jz9 = () => {}
// @from(Ln 460407, Col 4)
Tz9 = () => {}
// @from(Ln 460408, Col 4)
Pz9 = () => {}
// @from(Ln 460409, Col 4)
Sz9 = () => {}
// @from(Ln 460410, Col 4)
xz9 = () => {}
// @from(Ln 460411, Col 4)
yz9 = () => {}
// @from(Ln 460412, Col 4)
vz9 = () => {}
// @from(Ln 460413, Col 4)
kz9 = () => {}
// @from(Ln 460414, Col 4)
bz9 = () => {}
// @from(Ln 460415, Col 4)
fz9 = () => {}
// @from(Ln 460416, Col 4)
hz9 = () => {}
// @from(Ln 460417, Col 4)
gz9 = () => {}
// @from(Ln 460418, Col 4)
uz9 = () => {}
// @from(Ln 460419, Col 4)
mz9 = () => {}
// @from(Ln 460420, Col 4)
dz9 = () => {}
// @from(Ln 460421, Col 4)
cz9 = () => {}
// @from(Ln 460422, Col 4)
pz9 = () => {}
// @from(Ln 460423, Col 4)
lz9 = () => {}
// @from(Ln 460424, Col 4)
iz9 = () => {}
// @from(Ln 460425, Col 4)
nz9 = () => {}
// @from(Ln 460426, Col 4)
az9 = () => {}
// @from(Ln 460427, Col 4)
oz9 = () => {}
// @from(Ln 460428, Col 4)
rz9 = () => {}
// @from(Ln 460429, Col 4)
sz9 = () => {}
// @from(Ln 460430, Col 4)
tz9 = () => {}
// @from(Ln 460431, Col 4)
ez9 = () => {}
// @from(Ln 460432, Col 4)
A$9 = () => {}
// @from(Ln 460433, Col 4)
Q$9 = () => {}
// @from(Ln 460434, Col 4)
B$9 = () => {}
// @from(Ln 460435, Col 4)
G$9 = () => {}
// @from(Ln 460436, Col 4)
Z$9 = () => {}
// @from(Ln 460437, Col 4)
Y$9 = () => {}
// @from(Ln 460438, Col 4)
J$9 = () => {}
// @from(Ln 460439, Col 4)
X$9 = () => {}
// @from(Ln 460440, Col 4)
I$9 = () => {}
// @from(Ln 460441, Col 4)
D$9 = () => {}
// @from(Ln 460442, Col 4)
W$9 = () => {}
// @from(Ln 460443, Col 4)
K$9 = () => {}
// @from(Ln 460444, Col 4)
V$9 = () => {}
// @from(Ln 460445, Col 4)
F$9 = () => {}
// @from(Ln 460446, Col 4)
H$9 = () => {}
// @from(Ln 460447, Col 4)
E$9 = () => {}
// @from(Ln 460448, Col 4)
z$9 = () => {}
// @from(Ln 460449, Col 4)
$$9 = () => {}
// @from(Ln 460450, Col 4)
C$9 = () => {}
// @from(Ln 460451, Col 4)
U$9 = () => {}
// @from(Ln 460452, Col 4)
q$9 = () => {}
// @from(Ln 460453, Col 4)
N$9 = () => {}
// @from(Ln 460454, Col 4)
w$9 = () => {}
// @from(Ln 460455, Col 4)
L$9 = () => {}
// @from(Ln 460456, Col 4)
O$9 = () => {}
// @from(Ln 460457, Col 4)
M$9 = () => {}
// @from(Ln 460458, Col 4)
R$9 = () => {}
// @from(Ln 460459, Col 4)
_$9 = () => {}
// @from(Ln 460460, Col 4)
j$9 = () => {}
// @from(Ln 460461, Col 4)
T$9 = () => {}
// @from(Ln 460462, Col 4)
P$9 = () => {}
// @from(Ln 460463, Col 4)
S$9 = () => {}
// @from(Ln 460464, Col 4)
x$9 = () => {}
// @from(Ln 460465, Col 4)
y$9 = () => {}
// @from(Ln 460466, Col 4)
v$9 = () => {}
// @from(Ln 460467, Col 4)
k$9 = () => {}
// @from(Ln 460468, Col 4)
b$9 = () => {}
// @from(Ln 460469, Col 4)
f$9 = () => {}
// @from(Ln 460470, Col 4)
h$9 = () => {}
// @from(Ln 460471, Col 4)
g$9 = () => {}
// @from(Ln 460472, Col 4)
u$9 = () => {}
// @from(Ln 460473, Col 4)
m$9 = () => {}
// @from(Ln 460474, Col 4)
d$9 = () => {}
// @from(Ln 460475, Col 4)
c$9 = () => {}
// @from(Ln 460476, Col 4)
p$9 = () => {}
// @from(Ln 460477, Col 4)
l$9 = () => {}
// @from(Ln 460478, Col 4)
i$9 = () => {}
// @from(Ln 460479, Col 4)
n$9 = () => {}
// @from(Ln 460480, Col 4)
a$9 = () => {}
// @from(Ln 460481, Col 4)
o$9 = () => {}
// @from(Ln 460482, Col 4)
r$9 = () => {}
// @from(Ln 460483, Col 4)
s$9 = () => {}
// @from(Ln 460484, Col 4)
t$9 = () => {}
// @from(Ln 460485, Col 4)
e$9 = () => {}
// @from(Ln 460486, Col 4)
AC9 = () => {}
// @from(Ln 460487, Col 4)
QC9 = () => {}
// @from(Ln 460488, Col 4)
BC9 = () => {}
// @from(Ln 460489, Col 4)
GC9 = () => {}
// @from(Ln 460490, Col 4)
ZC9 = () => {}
// @from(Ln 460491, Col 4)
YC9 = () => {}
// @from(Ln 460492, Col 4)
JC9 = () => {}
// @from(Ln 460493, Col 4)
XC9 = () => {}
// @from(Ln 460494, Col 4)
IC9 = () => {}
// @from(Ln 460495, Col 4)
DC9 = () => {}
// @from(Ln 460496, Col 4)
WC9 = () => {}
// @from(Ln 460497, Col 4)
KC9 = () => {}
// @from(Ln 460498, Col 4)
VC9 = () => {}
// @from(Ln 460499, Col 4)
FC9 = () => {}
// @from(Ln 460500, Col 4)
HC9 = () => {}
// @from(Ln 460501, Col 4)
EC9 = () => {}
// @from(Ln 460502, Col 4)
zC9 = () => {}
// @from(Ln 460503, Col 4)
$C9 = () => {}
// @from(Ln 460504, Col 4)
CC9 = () => {}
// @from(Ln 460505, Col 4)
UC9 = () => {}
// @from(Ln 460506, Col 4)
qC9 = () => {}
// @from(Ln 460507, Col 4)
NC9 = () => {}
// @from(Ln 460508, Col 4)
wC9 = () => {}
// @from(Ln 460509, Col 4)
LC9 = () => {}
// @from(Ln 460510, Col 4)
OC9 = () => {}
// @from(Ln 460511, Col 4)
MC9 = () => {}
// @from(Ln 460512, Col 4)
RC9 = () => {}
// @from(Ln 460513, Col 4)
_C9 = () => {}
// @from(Ln 460514, Col 4)
jC9 = () => {}
// @from(Ln 460515, Col 4)
TC9 = () => {}
// @from(Ln 460516, Col 4)
PC9 = () => {}
// @from(Ln 460517, Col 4)
SC9 = () => {}
// @from(Ln 460518, Col 4)
xC9 = () => {}
// @from(Ln 460519, Col 4)
yC9 = () => {}
// @from(Ln 460520, Col 4)
vC9 = () => {}
// @from(Ln 460521, Col 4)
kC9 = () => {}
// @from(Ln 460522, Col 4)
bC9 = () => {}
// @from(Ln 460523, Col 4)
fC9 = () => {}
// @from(Ln 460524, Col 4)
hC9 = () => {}
// @from(Ln 460525, Col 4)
gC9 = () => {}
// @from(Ln 460526, Col 4)
uC9 = () => {}
// @from(Ln 460527, Col 4)
mC9 = () => {}
// @from(Ln 460528, Col 4)
dC9 = () => {}
// @from(Ln 460529, Col 4)
cC9 = () => {}
// @from(Ln 460530, Col 4)
pC9 = () => {}
// @from(Ln 460531, Col 4)
lC9 = () => {}
// @from(Ln 460532, Col 4)
iC9 = () => {}
// @from(Ln 460533, Col 4)
nC9 = () => {}
// @from(Ln 460534, Col 4)
aC9 = () => {}
// @from(Ln 460535, Col 4)
oC9 = () => {}
// @from(Ln 460536, Col 4)
rC9 = () => {}
// @from(Ln 460537, Col 4)
sC9 = () => {}
// @from(Ln 460538, Col 4)
tC9 = () => {}
// @from(Ln 460539, Col 4)
eC9 = () => {}
// @from(Ln 460540, Col 4)
AU9 = () => {}
// @from(Ln 460541, Col 4)
QU9 = () => {}
// @from(Ln 460542, Col 4)
BU9 = () => {}
// @from(Ln 460543, Col 4)
GU9 = () => {}
// @from(Ln 460544, Col 4)
ZU9 = () => {}
// @from(Ln 460545, Col 4)
YU9 = () => {}
// @from(Ln 460546, Col 4)
JU9 = () => {}
// @from(Ln 460547, Col 4)
XU9 = () => {}
// @from(Ln 460548, Col 4)
IU9 = () => {}
// @from(Ln 460549, Col 4)
DU9 = () => {}
// @from(Ln 460550, Col 4)
WU9 = () => {}
// @from(Ln 460551, Col 4)
KU9 = () => {}
// @from(Ln 460552, Col 4)
VU9 = () => {}
// @from(Ln 460553, Col 4)
FU9 = () => {}
// @from(Ln 460554, Col 4)
HU9 = () => {}
// @from(Ln 460555, Col 4)
EU9 = () => {}
// @from(Ln 460556, Col 4)
zU9 = () => {}
// @from(Ln 460557, Col 4)
$U9 = () => {}
// @from(Ln 460558, Col 4)
CU9 = () => {}
// @from(Ln 460559, Col 4)
UU9 = w(() => {
  OH9();
  jH9();
  wH9();
  PH9();
  fH9();
  TH9();
  hH9();
  LH9();
  gH9();
  uH9();
  mH9();
  dH9();
  cH9();
  iH9();
  nH9();
  aH9();
  oH9();
  rH9();
  QAA();
  sH9();
  tH9();
  BE9();
  Rx0();
  GE9();
  ZE9();
  YE9();
  XE9();
  IE9();
  DE9();
  WE9();
  KE9();
  FE9();
  HE9();
  EE9();
  UE9();
  qE9();
  NE9();
  wE9();
  LE9();
  OE9();
  ME9();
  RE9();
  _E9();
  TE9();
  PE9();
  SE9();
  yE9();
  bE9();
  fE9();
  zE9();
  hE9();
  gE9();
  mE9();
  dE9();
  cE9();
  $E9();
  pE9();
  lE9();
  iE9();
  nE9();
  uE9();
  vE9();
  aE9();
  Mz9();
  Rz9();
  _z9();
  jz9();
  Tz9();
  Pz9();
  Sz9();
  xz9();
  yz9();
  vz9();
  kz9();
  bz9();
  fz9();
  hz9();
  gz9();
  xx0();
  uz9();
  dz9();
  cz9();
  pz9();
  lz9();
  iz9();
  yx0();
  mC1();
  nz9();
  az9();
  oz9();
  rz9();
  sz9();
  JE9();
  tz9();
  ez9();
  A$9();
  kx0();
  Q$9();
  pC1();
  G$9();
  Z$9();
  Y$9();
  J$9();
  X$9();
  I$9();
  D$9();
  W$9();
  K$9();
  V$9();
  F$9();
  jx0();
  H$9();
  E$9();
  z$9();
  $$9();
  C$9();
  CE9();
  mz9();
  M$9();
  R$9();
  _$9();
  eH9();
  T$9();
  S$9();
  x$9();
  v$9();
  k$9();
  b$9();
  h$9();
  P$9();
  g$9();
  MH9();
  RH9();
  u$9();
  m$9();
  d$9();
  c$9();
  p$9();
  l$9();
  i$9();
  n$9();
  a$9();
  o$9();
  r$9();
  s$9();
  Tx0();
  t$9();
  _H9();
  e$9();
  QC9();
  BC9();
  ZC9();
  YC9();
  B$9();
  JC9();
  GC9();
  XC9();
  IC9();
  pH9();
  DC9();
  WC9();
  KC9();
  VC9();
  lH9();
  FC9();
  HC9();
  EC9();
  zC9();
  $C9();
  CC9();
  UC9();
  qC9();
  NC9();
  wC9();
  LC9();
  OC9();
  MC9();
  O$9();
  RC9();
  _C9();
  jC9();
  TC9();
  PC9();
  SC9();
  xC9();
  yC9();
  vC9();
  kC9();
  bC9();
  fC9();
  hC9();
  gC9();
  uC9();
  mC9();
  dC9();
  pC9();
  lC9();
  w$9();
  iC9();
  nC9();
  aC9();
  L$9();
  N$9();
  bH9();
  oC9();
  rC9();
  cC9();
  sC9();
  tC9();
  q$9();
  eC9();
  AU9();
  Mx0();
  QU9();
  j$9();
  ImA();
  _x0();
  y$9();
  xE9();
  jE9();
  f$9();
  BU9();
  GU9();
  T$A();
  vx0();
  Px0();
  ZU9();
  JU9();
  XU9();
  AC9();
  IU9();
  VE9();
  DU9();
  WU9();
  YU9();
  KU9();
  VU9();
  FU9();
  HU9();
  WM();
  U$9();
  EU9();
  zU9();
  $U9();
  CU9()
})
// @from(Ln 460807, Col 0)
function qU9() {
  let [A, Q] = DmA.useState([]), [B, G] = DmA.useState(0);
  if (DmA.useEffect(() => {
      let Z = XB.getSandboxViolationStore();
      return Z.subscribe((J) => {
        Q(J.slice(-10)), G(Z.getTotalCount())
      })
    }, []), !XB.isSandboxingEnabled() || $Q() === "linux") return null;
  if (B === 0) return null;
  return uU.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, uU.createElement(T, {
    marginLeft: 0
  }, uU.createElement(C, {
    color: "permission"
  }, "⧈ Sandbox blocked ", B, " total", " ", B === 1 ? "operation" : "operations")), A.map((Z, Y) => uU.createElement(T, {
    key: `${Z.timestamp.getTime()}-${Y}`,
    paddingLeft: 2
  }, uU.createElement(C, {
    dimColor: !0
  }, Oz9(Z.timestamp, "h:mm:ssa"), Z.command ? ` ${Z.command}:` : "", " ", Z.line))), uU.createElement(T, {
    paddingLeft: 2
  }, uU.createElement(C, {
    dimColor: !0
  }, "… showing last ", Math.min(10, A.length), " of ", B)))
}
// @from(Ln 460834, Col 4)
uU
// @from(Ln 460834, Col 8)
DmA
// @from(Ln 460835, Col 4)
NU9 = w(() => {
  fA();
  NJ();
  UU9();
  c3();
  uU = c(QA(), 1), DmA = c(QA(), 1)
})
// @from(Ln 460843, Col 0)
function LU9({
  mcpClients: A = []
}) {
  let {
    addNotification: Q
  } = S4();
  wU9.useEffect(() => {
    let B = A.filter((Z) => Z.type === "failed" && Z.config.type !== "sse-ide" && Z.config.type !== "ws-ide" && Z.config.type !== "claudeai-proxy"),
      G = A.filter((Z) => Z.type === "needs-auth" && Z.config.type !== "claudeai-proxy");
    if (B.length === 0 && G.length === 0) return;
    if (B.length > 0) Q({
      key: "mcp-failed",
      jsx: ZH.createElement(ZH.Fragment, null, ZH.createElement(C, {
        color: "error"
      }, B.length, " MCP", " ", B.length === 1 ? "server" : "servers", " failed"), ZH.createElement(C, {
        dimColor: !0
      }, " · /mcp")),
      priority: "medium"
    });
    if (G.length) Q({
      key: "mcp-needs-auth",
      jsx: ZH.createElement(ZH.Fragment, null, ZH.createElement(C, {
        color: "warning"
      }, G.length, " MCP", " ", G.length === 1 ? "server needs" : "servers need", " ", "auth"), ZH.createElement(C, {
        dimColor: !0
      }, " · /mcp")),
      priority: "medium"
    })
  }, [Q, A])
}
// @from(Ln 460873, Col 4)
ZH
// @from(Ln 460873, Col 8)
wU9
// @from(Ln 460874, Col 4)
OU9 = w(() => {
  fA();
  HY();
  ZH = c(QA(), 1), wU9 = c(QA(), 1)
})
// @from(Ln 460880, Col 0)
function MU9() {
  let {
    addNotification: A
  } = S4(), [, Q] = a0(), [B, G] = LV.useState(!0), Z = LV.useRef(new Set), Y = LV.useCallback((X, I) => {
    let D = `${X}:${I}`;
    if (Z.current.has(D)) return;
    Z.current.add(D), k(`LSP error: ${X} - ${I}`), Q((K) => {
      let V = new Set(K.plugins.errors.map((H) => {
          if (H.type === "generic-error") return `generic-error:${H.source}:${H.error}`;
          return `${H.type}:${H.source}`
        })),
        F = `generic-error:${X}:${I}`;
      if (V.has(F)) return K;
      return {
        ...K,
        plugins: {
          ...K.plugins,
          errors: [...K.plugins.errors, {
            type: "generic-error",
            source: X,
            error: I
          }]
        }
      }
    });
    let W = X.startsWith("plugin:") ? X.split(":")[1] ?? X : X;
    A({
      key: `lsp-error-${X}`,
      jsx: LV.createElement(LV.Fragment, null, LV.createElement(C, {
        color: "error"
      }, "LSP for ", W, " failed"), LV.createElement(C, {
        dimColor: !0
      }, " · /plugin for details")),
      priority: "medium",
      timeoutMs: 8000
    })
  }, [A, Q]), J = LV.useCallback(() => {
    let X = f6A();
    if (X.status === "failed") {
      Y("lsp-manager", X.error.message), G(!1);
      return
    }
    if (X.status === "pending" || X.status === "not-started") return;
    let I = Rc();
    if (I) {
      let D = I.getAllServers();
      for (let [W, K] of D)
        if (K.state === "error" && K.lastError) Y(W, K.lastError.message)
    }
  }, [Y]);
  XZ(J, B ? jO7 : null), LV.useEffect(() => {
    J()
  }, [J])
}
// @from(Ln 460934, Col 4)
LV
// @from(Ln 460934, Col 8)
jO7 = 5000
// @from(Ln 460935, Col 4)
RU9 = w(() => {
  fA();
  HY();
  hB();
  oK();
  ms();
  T1();
  LV = c(QA(), 1)
})
// @from(Ln 460944, Col 0)
async function jU9(A) {
  if (!A || !A.trim()) return k("[binaryCheck] Empty command provided, returning false"), !1;
  let Q = A.trim(),
    B = _U9.get(Q);
  if (B !== void 0) return k(`[binaryCheck] Cache hit for '${Q}': ${B}`), B;
  let G = $Q(),
    Z;
  if (G === "windows") Z = "where";
  else if (Z = "which", G === "unknown") k("[binaryCheck] Unknown platform, defaulting to 'which'");
  let Y = await TQ(Z, [Q], {
      timeout: 5000,
      useCwd: !1
    }),
    J = Y.code === 0;
  return _U9.set(Q, J), k(`[binaryCheck] Binary '${Q}' ${J?"found":"not found"} (exit code: ${Y.code})`), J
}
// @from(Ln 460960, Col 4)
_U9
// @from(Ln 460961, Col 4)
TU9 = w(() => {
  t4();
  c3();
  T1();
  _U9 = new Map
})
// @from(Ln 460971, Col 0)
function SO7(A) {
  return K4A.has(A.toLowerCase())
}
// @from(Ln 460975, Col 0)
function xO7(A) {
  if (!A) return null;
  if (typeof A === "string") return k("[lspRecommendation] Skipping string path lspServers (not readable from marketplace)"), null;
  if (Array.isArray(A)) {
    for (let Q of A) {
      if (typeof Q === "string") continue;
      let B = SU9(Q);
      if (B) return B
    }
    return null
  }
  return SU9(A)
}
// @from(Ln 460989, Col 0)
function PU9(A) {
  return typeof A === "object" && A !== null
}
// @from(Ln 460993, Col 0)
function SU9(A) {
  let Q = new Set,
    B = null;
  for (let [G, Z] of Object.entries(A)) {
    if (!PU9(Z)) continue;
    if (!B && typeof Z.command === "string") B = Z.command;
    let Y = Z.extensionToLanguage;
    if (PU9(Y))
      for (let J of Object.keys(Y)) Q.add(J.toLowerCase())
  }
  if (!B || Q.size === 0) return null;
  return {
    extensions: Q,
    command: B
  }
}
// @from(Ln 461009, Col 0)
async function yO7() {
  let A = new Map;
  try {
    let Q = await D5();
    for (let B of Object.keys(Q)) try {
      let G = await rC(B),
        Z = SO7(B);
      for (let Y of G.plugins) {
        if (!Y.lspServers) continue;
        let J = xO7(Y.lspServers);
        if (!J) continue;
        let X = `${Y.name}@${B}`;
        A.set(X, {
          entry: Y,
          marketplaceName: B,
          extensions: J.extensions,
          command: J.command,
          isOfficial: Z
        })
      }
    } catch (G) {
      k(`[lspRecommendation] Failed to load marketplace ${B}: ${G}`)
    }
  } catch (Q) {
    k(`[lspRecommendation] Failed to load marketplaces config: ${Q}`)
  }
  return A
}
// @from(Ln 461037, Col 0)
async function xU9(A) {
  if (vO7()) return k("[lspRecommendation] Recommendations are disabled"), [];
  let Q = TO7(A).toLowerCase();
  if (!Q) return k("[lspRecommendation] No file extension found"), [];
  k(`[lspRecommendation] Looking for LSP plugins for ${Q}`);
  let B = await yO7(),
    Z = L1().lspRecommendationNeverPlugins ?? [],
    Y = [];
  for (let [X, I] of B) {
    if (!I.extensions.has(Q)) continue;
    if (Z.includes(X)) {
      k(`[lspRecommendation] Skipping ${X} (in never suggest list)`);
      continue
    }
    if (tC(X)) {
      k(`[lspRecommendation] Skipping ${X} (already installed)`);
      continue
    }
    Y.push({
      info: I,
      pluginId: X
    })
  }
  let J = [];
  for (let {
      info: X,
      pluginId: I
    }
    of Y)
    if (await jU9(X.command)) J.push({
      info: X,
      pluginId: I
    }), k(`[lspRecommendation] Binary '${X.command}' found for ${I}`);
    else k(`[lspRecommendation] Skipping ${I} (binary '${X.command}' not found)`);
  return J.sort((X, I) => {
    if (X.info.isOfficial && !I.info.isOfficial) return -1;
    if (!X.info.isOfficial && I.info.isOfficial) return 1;
    return 0
  }), J.map(({
    info: X,
    pluginId: I
  }) => ({
    pluginId: I,
    pluginName: X.entry.name,
    marketplaceName: X.marketplaceName,
    description: X.entry.description,
    isOfficial: X.isOfficial,
    extensions: Array.from(X.extensions),
    command: X.command
  }))
}
// @from(Ln 461089, Col 0)
function yU9(A) {
  S0((Q) => {
    let B = Q.lspRecommendationNeverPlugins ?? [];
    if (B.includes(A)) return Q;
    return {
      ...Q,
      lspRecommendationNeverPlugins: [...B, A]
    }
  }), k(`[lspRecommendation] Added ${A} to never suggest`)
}
// @from(Ln 461100, Col 0)
function vU9() {
  S0((A) => {
    let Q = (A.lspRecommendationIgnoredCount ?? 0) + 1;
    return {
      ...A,
      lspRecommendationIgnoredCount: Q
    }
  }), k("[lspRecommendation] Incremented ignored count")
}
// @from(Ln 461110, Col 0)
function vO7() {
  let A = L1();
  return A.lspRecommendationDisabled === !0 || (A.lspRecommendationIgnoredCount ?? 0) >= PO7
}
// @from(Ln 461114, Col 4)
PO7 = 5
// @from(Ln 461115, Col 4)
kU9 = w(() => {
  HI();
  pz();
  PN();
  TU9();
  GQ();
  T1()
})
// @from(Ln 461128, Col 0)
function bU9() {
  let [A] = a0(), {
    addNotification: Q
  } = S4(), [B, G] = Lw.useState(null), Z = Lw.useRef(new Set), Y = Lw.useRef(!1);
  Lw.useEffect(() => {
    if (B) return;
    if (Y.current) return;
    if (Kf0()) return;
    let X = A.fileHistory.trackedFiles,
      I = [];
    for (let W of X)
      if (!Z.current.has(W)) Z.current.add(W), I.push(W);
    if (I.length === 0) return;
    Y.current = !0, D(I).finally(() => {
      Y.current = !1
    });
    async function D(W) {
      for (let K of W) try {
        let F = (await xU9(K))[0];
        if (F) {
          k(`[useLspPluginRecommendation] Found match: ${F.pluginName} for ${K}`), G({
            pluginId: F.pluginId,
            pluginName: F.pluginName,
            pluginDescription: F.description,
            fileExtension: kO7(K),
            shownAt: Date.now()
          }), Vf0(!0);
          return
        }
      } catch (V) {
        e(V instanceof Error ? V : Error(String(V)))
      }
    }
  }, [A.fileHistory.trackedFiles, B]);
  let J = Lw.useCallback((X) => {
    if (!B) return;
    let {
      pluginId: I,
      pluginName: D,
      shownAt: W
    } = B;
    switch (k(`[useLspPluginRecommendation] User response: ${X} for ${D}`), X) {
      case "yes":
        hO7(I, D, Q);
        break;
      case "no": {
        let K = Date.now() - W;
        if (K >= fO7) k(`[useLspPluginRecommendation] Timeout detected (${K}ms), incrementing ignored count`), vU9();
        break
      }
      case "never":
        yU9(I);
        break;
      case "disable":
        S0((K) => {
          if (K.lspRecommendationDisabled) return K;
          return {
            ...K,
            lspRecommendationDisabled: !0
          }
        });
        break
    }
    G(null)
  }, [B, Q]);
  return {
    recommendation: B,
    handleResponse: J
  }
}