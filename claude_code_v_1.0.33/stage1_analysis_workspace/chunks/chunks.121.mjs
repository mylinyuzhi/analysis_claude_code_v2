
// @from(Start 11436232, End 11436800)
async function CP2(A) {
  let Q = await I60();
  if (Q.size > 0) GA("tengu_teleport_errors_detected", {
    error_types: Array.from(Q).join(","),
    errors_ignored: Array.from(A || []).join(",")
  }), await new Promise(async (B) => {
    let {
      unmount: G
    } = await VG(J60.default.createElement(yG, null, J60.default.createElement(m61, {
      errorsToIgnore: A,
      onComplete: () => {
        GA("tengu_teleport_errors_resolved", {
          error_types: Array.from(Q).join(",")
        }), G(), B()
      }
    })), {
      exitOnCtrlC: !1
    })
  })
}
// @from(Start 11436801, End 11436855)
async function EP2(A) {
  return await CP2(), xRA(A)
}
// @from(Start 11436856, End 11436980)
async function zP2(A, Q) {
  return await CP2(new Set(["needsGitStash"])), W60({
    initialMessage: A,
    signal: Q
  })
}
// @from(Start 11436982, End 11437250)
function gf5(A) {
  if (A && typeof A === "object" && "type" in A) {
    if (A.type === "env_manager_log" || A.type === "control_response") return null;
    if ("session_id" in A) return A
  }
  return g(`Event is not a valid SDKMessage: ${JSON.stringify(A)}`), null
}
// @from(Start 11437251, End 11438972)
async function uf5(A, Q, B) {
  let G = IC(B);
  try {
    let Z = `${e9().BASE_API_URL}/v1/sessions/${A}/events`;
    g(`Fetching events from: ${Z}`);
    let I = await YQ.get(Z, {
      headers: {
        ...G,
        "x-organization-uuid": Q
      },
      timeout: 30000
    });
    if (I.status !== 200) throw Error(`Failed to fetch session events: ${I.statusText}`);
    let Y = I.data;
    if (!Y?.data || !Array.isArray(Y.data)) throw Error("Invalid events response: missing or invalid data array");
    let J = [];
    for (let X of Y.data) {
      let V = gf5(X);
      if (V) J.push(V)
    }
    let W;
    try {
      let X = `${e9().BASE_API_URL}/v1/sessions/${A}`;
      g(`Fetching session details from: ${X}`);
      let V = await YQ.get(X, {
        headers: {
          ...G,
          "x-organization-uuid": Q
        },
        timeout: 15000
      });
      if (V.status === 200) {
        g(`Session details: ${JSON.stringify(V.data,null,2)}`);
        let K = V.data.session_context.outcomes?.find((D) => D.type === "git_repository");
        if (K?.git_info?.branches.length) W = K.git_info.branches[0], g(`Found branch from session context: ${W}`)
      }
    } catch (X) {
      AA(Error(`Could not fetch session details: ${X}`))
    }
    return {
      log: J,
      branch: W
    }
  } catch (Z) {
    let I = Z instanceof Error ? Z : Error(String(Z));
    if (YQ.isAxiosError(Z) && Z.response?.status === 404) throw GA("tengu_teleport_error_session_not_found_404", {
      sessionId: A
    }), new XI(`${A} not found.`, `${A} not found.
${tA.dim("Run /status in Claude Code to check your account.")}`);
    throw AA(I), Error(`Failed to fetch session from Sessions API: ${I.message}`)
  }
}
// @from(Start 11438973, End 11441839)
async function W60(A) {
  let {
    initialMessage: Q,
    description: B,
    signal: G
  } = A;
  try {
    await Qt();
    let Z = M6()?.accessToken;
    if (!Z) return AA(Error("No access token found for remote session creation")), null;
    let I = await HS();
    if (!I) return AA(Error("Unable to get organization UUID for remote session creation")), null;
    let Y = await DO(),
      J = null,
      W = null,
      {
        title: X,
        branchName: V
      } = await xf5(B || Q || "Background task", G);
    if (Y) {
      let [y, v] = Y.split("/");
      if (y && v) J = {
        type: "git_repository",
        url: `https://github.com/${y}/${v}`,
        revision: A.branchName
      }, W = {
        type: "git_repository",
        git_info: {
          type: "github",
          repo: `${y}/${v}`,
          branches: [V]
        }
      };
      else AA(Error(`Invalid repository format: ${Y} - expected 'owner/name'`))
    }
    let F = await nJA();
    if (!F || F.length === 0) return AA(Error("No environments available for session creation")), null;
    let D = l0()?.remote?.defaultEnvironmentId,
      H = F[0];
    if (D) {
      let y = F.find((v) => v.environment_id === D);
      if (y) H = y, g(`Using configured default environment: ${D}`);
      else g(`Configured default environment ${D} not found in available environments, using first available`)
    }
    if (!H) return AA(Error("No environments available for session creation")), null;
    let C = H.environment_id;
    g(`Selected environment: ${C} (${H.name})`);
    let E = `${e9().BASE_API_URL}/v1/sessions`,
      U = {
        ...IC(Z),
        "x-organization-uuid": I
      },
      q = {
        sources: J ? [J] : [],
        outcomes: W ? [W] : [],
        model: k3()
      },
      w = Q ? [{
        type: "event",
        data: {
          uuid: Sf5(),
          session_id: "",
          type: "user",
          parent_tool_use_id: null,
          message: {
            role: "user",
            content: Q
          }
        }
      }] : [],
      N = {
        title: X,
        events: w,
        session_context: q,
        environment_id: C
      };
    g(`Creating session with payload: ${JSON.stringify(N,null,2)}`);
    let R = await YQ.post(E, N, {
      headers: U,
      signal: G
    });
    if (R.status !== 200 && R.status !== 201) return AA(Error(`API request failed with status ${R.status}: ${R.statusText}

Response data: ${JSON.stringify(R.data,null,2)}`)), null;
    let T = R.data;
    if (T && typeof T.id === "string") return g(`Successfully created remote session: ${T.id}`), {
      id: T.id,
      title: T.title || X
    };
    return AA(Error(`Cannot determine session ID from API response: ${JSON.stringify(R.data)}`)), null
  } catch (Z) {
    let I = Z instanceof Error ? Z : Error(String(Z));
    return AA(I), null
  }
}
// @from(Start 11441844, End 11441847)
J60
// @from(Start 11441849, End 11443234)
yf5 = `You are coming up with a succinct title and git branch name for a coding session based on the provided description. The title should be clear, concise, and accurately reflect the content of the coding task.
You should keep it short and simple, ideally no more than 6 words. Avoid using jargon or overly technical terms unless absolutely necessary. The title should be easy to understand for anyone reading it.
You should wrap the title in <title> tags.

The branch name should be clear, concise, and accurately reflect the content of the coding task.
You should keep it short and simple, ideally no more than 4 words. The branch should always start with "claude/" and should be all lower case, with words separated by dashes.
You should wrap the branch name in <branch> tags.

The title should always come first, followed by the branch. Do not include any other text other than the title and branch.

Example 1:
<title>Fix login button not working on mobile</title>
<branch>claude/fix-mobile-login-button</branch>

Example 2:
<title>Update README with installation instructions</title>
<branch>claude/update-readme</branch>

Example 3:
<title>Improve performance of data processing script</title>
<branch>claude/improve-data-processing</branch>

Here is the session description:
<description>{description}</description>
Please generate a title and branch name for this session.`
// @from(Start 11443240, End 11443483)
$0A = L(() => {
  _8();
  PV();
  vYA();
  F9();
  RZ();
  V0();
  g1();
  hA();
  z9();
  Y60();
  gB();
  AL();
  O3();
  NX();
  gB();
  z0A();
  fZ();
  t2();
  q0();
  cQ();
  _0();
  Fn();
  g61();
  VP2();
  MB();
  J60 = BA(VA(), 1)
})
// @from(Start 11443485, End 11443920)
async function UP2() {
  let A = [],
    [Q, B, G, Z] = await Promise.all([u61(), ZP2(), IP2(), DO()]);
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
    let [I, Y] = Z.split("/");
    if (I && Y) {
      if (!await YP2(I, Y)) A.push({
        type: "github_app_not_installed"
      })
    }
  }
  return A
}
// @from(Start 11443925, End 11443960)
$P2 = L(() => {
  Z60();
  z0A()
})
// @from(Start 11443963, End 11444090)
function qP2(A) {
  let Q = wP2.get(A);
  if (!Q) Q = q_(async (B, G, Z) => await df5(A, B, G, Z)), wP2.set(A, Q);
  return Q
}
// @from(Start 11444091, End 11445662)
async function df5(A, Q, B, G) {
  for (let Z = 1; Z <= p61; Z++) {
    try {
      let Y = V60.get(A),
        J = {
          ...G
        };
      if (Y) J["Last-Uuid"] = Y;
      let W = await YQ.put(B, Q, {
        headers: J,
        validateStatus: (X) => X < 500
      });
      if (W.status === 200 || W.status === 201) return V60.set(A, Q.uuid), g(`Successfully persisted session log entry for session ${A}`), !0;
      if (W.status === 409) {
        let V = W.data.error?.message || "Concurrent modification detected";
        return AA(Error(`Session persistence conflict: UUID mismatch for session ${A}, entry ${Q.uuid}. ${V}`)), k6("error", "session_persist_fail_concurrent_modification"), !1
      }
      if (W.status === 401) return g("Session token expired or invalid"), k6("error", "session_persist_fail_bad_token"), !1;
      g(`Failed to persist session log: ${W.status} ${W.statusText}`), k6("error", "session_persist_fail_status", {
        status: W.status,
        attempt: Z
      })
    } catch (Y) {
      let J = Y;
      AA(Error(`Error persisting session log: ${J.message}`)), k6("error", "session_persist_fail_status", {
        status: J.status,
        attempt: Z
      })
    }
    if (Z === p61) return g(`Remote persistence failed after ${p61} attempts`), k6("error", "session_persist_error_retries_exhausted", {
      attempt: Z
    }), !1;
    let I = Math.min(mf5 * Math.pow(2, Z - 1), 8000);
    g(`Remote persistence attempt ${Z}/${p61} failed, retrying in ${I}ms…`), await new Promise((Y) => setTimeout(Y, I))
  }
  return !1
}
// @from(Start 11445663, End 11445960)
async function NP2(A, Q, B) {
  let G = cAA();
  if (!G) return g("No session token available for session persistence"), k6("error", "session_persist_fail_jwt_no_token"), !1;
  let Z = {
    Authorization: `Bearer ${G}`,
    "Content-Type": "application/json"
  };
  return await qP2(A)(Q, B, Z)
}
// @from(Start 11445961, End 11446387)
async function LP2(A, Q) {
  try {
    let {
      accessToken: B,
      orgUUID: G
    } = await U0A(), Z = `${e9().BASE_API_URL}/v1/session_ingress/session/${A}`, I = {
      ...IC(B),
      "x-organization-uuid": G
    };
    return await qP2(A)(Q, Z, I)
  } catch (B) {
    return g(`Failed to get OAuth credentials: ${B instanceof Error?B.message:String(B)}`), k6("error", "session_persist_fail_oauth_no_token"), !1
  }
}
// @from(Start 11446388, End 11447926)
async function MP2(A, Q) {
  let B = cAA();
  if (!B) return g("No session token available for fetching session logs"), k6("error", "session_get_fail_no_token"), null;
  try {
    let G = await YQ.get(Q, {
      headers: {
        Authorization: `Bearer ${B}`
      },
      validateStatus: (Z) => Z < 500
    });
    if (G.status === 200) {
      let Z = G.data;
      if (!Z || typeof Z !== "object" || !Array.isArray(Z.loglines)) return AA(Error(`Invalid session logs response format: ${JSON.stringify(Z)}`)), k6("error", "session_get_fail_invalid_response"), null;
      let I = Z.loglines;
      if (!X60.has(A)) X60.set(A, new Set);
      let Y = X60.get(A);
      for (let J of I)
        if ("uuid" in J && J.uuid) Y.add(J.uuid);
      if (Array.isArray(I) && I.length > 0) {
        let J = I[I.length - 1];
        if (J && "uuid" in J && J.uuid) V60.set(A, J.uuid)
      }
      return g(`Fetched ${I.length} session logs for session ${A}`), I
    }
    if (G.status === 404) return g(`No existing logs for session ${A}`), k6("warn", "session_get_no_logs_for_session"), [];
    if (G.status === 401) return g("Session token expired or invalid"), k6("error", "session_get_fail_bad_token"), null;
    return g(`Failed to fetch session logs: ${G.status} ${G.statusText}`), k6("error", "session_get_fail_status", {
      status: G.status
    }), null
  } catch (G) {
    let Z = G;
    return AA(Error(`Error fetching session logs: ${Z.message}`)), k6("error", "session_get_fail_status", {
      status: Z.status
    }), null
  }
}
// @from(Start 11447931, End 11447934)
V60
// @from(Start 11447936, End 11447939)
X60
// @from(Start 11447941, End 11447949)
p61 = 10
// @from(Start 11447953, End 11447962)
mf5 = 500
// @from(Start 11447966, End 11447969)
wP2
// @from(Start 11447975, End 11448097)
F60 = L(() => {
  O3();
  g1();
  V0();
  yQ1();
  NX();
  Fn();
  NIA();
  V60 = new Map, X60 = new Map, wP2 = new Map
})
// @from(Start 11448100, End 11449568)
function K60({
  issue: A,
  branchName: Q,
  onDone: B,
  color: G = "permission",
  loadingState: Z
}) {
  let {
    hasUncommitted: I,
    hasUnpushed: Y
  } = A, J = "";
  if (I && Y) J = `Uncommitted changes and unpushed commits detected on ${Q}`;
  else if (I) J = "Uncommitted changes detected";
  else J = `Unpushed commits detected on ${Q}`;

  function W(F) {
    B(F)
  }
  let X = I ? "Commit and push my changes" : "Push my changes",
    V = Z === "committing" ? "Committing…" : Z === "pushing" ? "Pushing…" : null;
  return gW.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    borderColor: G,
    borderLeft: !1,
    borderRight: !1,
    borderBottom: !1,
    marginTop: 1
  }, gW.createElement(S, {
    paddingX: 1
  }, gW.createElement($, {
    color: G,
    bold: !0
  }, "Include local changes in the remote task?")), gW.createElement(S, {
    flexDirection: "column",
    paddingX: 1
  }, gW.createElement($, {
    dimColor: !0
  }, J), gW.createElement(S, {
    marginTop: 1
  }, V ? gW.createElement(S, {
    flexDirection: "row"
  }, gW.createElement(g4, null), gW.createElement($, null, V)) : gW.createElement(M0, {
    options: [{
      label: X,
      value: "commit-push"
    }, {
      label: "Run remote task without my local changes",
      value: "continue"
    }, {
      label: "Cancel",
      value: "cancel"
    }],
    onChange: W,
    onCancel: () => W("cancel"),
    layout: "compact-vertical"
  }))))
}
// @from(Start 11449573, End 11449575)
gW
// @from(Start 11449581, End 11449642)
OP2 = L(() => {
  hA();
  S5();
  DY();
  gW = BA(VA(), 1)
})
// @from(Start 11449645, End 11450242)
function pf5(A) {
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
// @from(Start 11450243, End 11455062)
async function RP2(A, Q, B, G, Z, I) {
  GA("tengu_input_background", {}), I(!0);
  let Y = {
      text: `<background-task-input>${A}</background-task-input>`,
      type: "text"
    },
    J = R0({
      content: Y$({
        inputString: Y.text,
        precedingInputBlocks: Q
      })
    });
  Z({
    jsx: wG.createElement(S, {
      flexDirection: "column"
    }, wG.createElement(f1A, {
      addMargin: !0,
      param: Y
    }), wG.createElement(S0, null, wG.createElement($, {
      dimColor: !0
    }, "Initializing session…"))),
    shouldHidePromptInput: !1
  });
  try {
    let W = await UP2();
    if (W.length > 0) {
      let N = W.map(pf5).join(`

`);
      return {
        messages: [cV(), J, ...B, R0({
          content: `<bash-stderr>Cannot launch remote Claude Code session.

${N}</bash-stderr>`
        })],
        shouldQuery: !1
      }
    }
    let X = await cCB(),
      V = await sb(),
      F = await Uh1(),
      K = X.commitsAheadOfDefaultBranch === 0;
    if ((X.hasUncommitted || X.hasUnpushed) && !K) {
      let N = await new Promise((R) => {
        Z({
          jsx: wG.createElement(S, {
            flexDirection: "column"
          }, wG.createElement(f1A, {
            addMargin: !0,
            param: Y
          }), wG.createElement(K60, {
            issue: X,
            branchName: V,
            onDone: R,
            color: "background"
          })),
          shouldHidePromptInput: !0
        })
      });
      if (N === "cancel") return {
        messages: [cV(), J, ...B, R0({
          content: "<bash-stderr>Background task cancelled.</bash-stderr>"
        })],
        shouldQuery: !1
      };
      if (N === "commit-push") {
        let R = (v) => {
          Z({
            jsx: wG.createElement(S, {
              flexDirection: "column"
            }, wG.createElement(f1A, {
              addMargin: !0,
              param: Y
            }), wG.createElement(K60, {
              issue: X,
              branchName: V,
              onDone: () => {},
              color: "background",
              loadingState: v
            })),
            shouldHidePromptInput: !0
          })
        };
        if (X.hasUncommitted) R("committing");
        else R("pushing");
        let T = `Background task: ${A.slice(0,60)}${A.length>60?"...":""}`,
          y = await pCB(T, (v) => {
            R(v)
          });
        if (!y.success) return {
          messages: [cV(), J, ...B, R0({
            content: `<bash-stderr>Failed to commit and push changes:
${y.error}</bash-stderr>`
          })],
          shouldQuery: !1
        }
      }
    }
    let D = aJA(),
      H = [];
    try {
      H = await Or(D)
    } catch (N) {
      g(`Could not read transcript file: ${N instanceof Error?N.message:String(N)}`)
    }
    let C = H.filter(H60);
    Z({
      jsx: wG.createElement(S, {
        flexDirection: "column"
      }, wG.createElement(f1A, {
        addMargin: !0,
        param: Y
      }), wG.createElement(S0, null, wG.createElement($, {
        dimColor: !0
      }, "Creating background task…"))),
      shouldHidePromptInput: !1
    });
    let E = X.commitsAheadOfDefaultBranch === 0 ? F : V,
      U = await W60({
        initialMessage: null,
        branchName: E,
        description: A,
        signal: G.abortController.signal
      });
    if (!U) throw Error("Failed to create remote session");
    if (C.length > 0)
      for (let N = 0; N < C.length; N++) {
        let R = C[N];
        if (!R) continue;
        if (!await LP2(U.id, R)) throw Error(`Failed to upload session history (message ${N+1}/${C.length})`)
      }
    if (!await BP2(U.id, A)) throw Error("Failed to send user task message to remote session");
    G.setAppState((N) => ({
      ...N,
      backgroundTasks: {
        ...N.backgroundTasks,
        [U.id]: {
          id: U.id,
          command: A,
          startTime: Date.now(),
          status: "starting",
          todoList: [],
          title: U.title,
          type: "remote_session",
          deltaSummarySinceLastFlushToAttachment: null,
          log: []
        }
      }
    }));
    let w = `https://claude.ai/code/${U.id}`;
    return {
      messages: [cV(), J, ...B, R0({
        content: `<background-task-output>This task is now running in the background.
Monitor it with /tasks or at ${w}

Or, resume it later with: claude --teleport ${U.id}</background-task-output>`
      })],
      shouldQuery: !1
    }
  } catch (W) {
    let X = W instanceof Error ? W.message : String(W);
    return {
      messages: [cV(), J, ...B, R0({
        content: `<bash-stderr>Failed to create background session: ${X}. Try running /login and signing in with a claude.ai account (not Console).</bash-stderr>`
      })],
      shouldQuery: !1
    }
  } finally {
    Z(null)
  }
}
// @from(Start 11455063, End 11455716)
async function TP2(A, Q, B, G, Z) {
  let I = WZ(A);
  if (!I.length) return null;
  return ji(await wy({
    messages: [...I, ...WZ([R0({
      content: R91()
    })])],
    systemPrompt: ["You are a helpful AI assistant tasked with summarizing conversations."],
    maxThinkingTokens: 0,
    tools: [n8],
    signal: Q,
    options: {
      getToolPermissionContext: B,
      model: k3(),
      toolChoice: void 0,
      isNonInteractiveSession: G,
      hasAppendSystemPrompt: Z,
      maxOutputTokensOverride: EkA,
      querySource: "summarize_for_background_task",
      agents: [],
      mcpTools: [],
      agentIdOrSessionId: e1()
    }
  }))
}
// @from(Start 11455721, End 11455723)
wG
// @from(Start 11455729, End 11455915)
D60 = L(() => {
  q0();
  cQ();
  hA();
  MQ0();
  q8();
  $0A();
  Fn();
  $P2();
  F60();
  V0();
  S7();
  LF();
  fZ();
  Dq();
  t2();
  PV();
  OP2();
  _0();
  wG = BA(VA(), 1)
})
// @from(Start 11455918, End 11456390)
function l61({
  param: {
    text: A
  },
  addMargin: Q
}) {
  let B = B9(A, "bash-input");
  if (!B) return null;
  return ch.createElement(S, {
    flexDirection: "column",
    marginTop: Q ? 1 : 0,
    width: "100%"
  }, ch.createElement(S, null, ch.createElement($, {
    backgroundColor: "bashMessageBackgroundColor",
    color: "bashBorder"
  }, "!"), ch.createElement($, {
    backgroundColor: "bashMessageBackgroundColor",
    color: "text"
  }, " ", B, " ")))
}
// @from(Start 11456395, End 11456397)
ch
// @from(Start 11456403, End 11456456)
C60 = L(() => {
  hA();
  cQ();
  ch = BA(VA(), 1)
})
// @from(Start 11456459, End 11457039)
function E60({
  input: A,
  progress: Q,
  verbose: B
}) {
  return i61.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, i61.default.createElement(l61, {
    addMargin: !1,
    param: {
      text: `<bash-input>${A}</bash-input>`,
      type: "text"
    }
  }), Q ? i61.default.createElement(i21, {
    fullOutput: Q.fullOutput,
    output: Q.output,
    elapsedTimeSeconds: Q.elapsedTimeSeconds,
    totalLines: Q.totalLines,
    verbose: B
  }) : D9.renderToolUseProgressMessage([], {
    verbose: B,
    tools: [],
    terminalSize: void 0
  }))
}
// @from(Start 11457044, End 11457047)
i61
// @from(Start 11457053, End 11457125)
PP2 = L(() => {
  hA();
  C60();
  q00();
  pF();
  i61 = BA(VA(), 1)
})
// @from(Start 11457127, End 11458975)
async function jP2(A, Q, B, G, Z, I) {
  GA("tengu_input_bash", {}), I(!0);
  let Y = R0({
      content: Y$({
        inputString: `<bash-input>${A}</bash-input>`,
        precedingInputBlocks: Q
      })
    }),
    J;
  Z({
    jsx: qy.createElement(E60, {
      input: A,
      progress: null,
      verbose: G.options.verbose
    }),
    shouldHidePromptInput: !1
  });
  try {
    let W = {
        ...G,
        setToolJSX: (D) => {
          J = D?.jsx
        }
      },
      V = (await D9.call({
        command: A,
        dangerouslyDisableSandbox: !0
      }, W, void 0, void 0, (D) => {
        Z({
          jsx: qy.createElement(qy.Fragment, null, qy.createElement(E60, {
            input: A,
            progress: D.data,
            verbose: G.options.verbose
          }), J),
          shouldHidePromptInput: !1,
          showSpinner: !1
        })
      })).data;
    if (!V) throw Error("No result received from bash command");
    let F = V.stderr,
      K = await G.getAppState();
    if (qrA(K.toolPermissionContext)) F = wrA(F);
    return {
      messages: [cV(), Y, ...B, R0({
        content: `<bash-stdout>${V.stdout}</bash-stdout><bash-stderr>${F}</bash-stderr>`
      })],
      shouldQuery: !1
    }
  } catch (W) {
    if (W instanceof tj) {
      if (W.interrupted) return {
        messages: [cV(), Y, R0({
          content: sJA
        }), ...B],
        shouldQuery: !1
      };
      return {
        messages: [cV(), Y, ...B, R0({
          content: `<bash-stdout>${W.stdout}</bash-stdout><bash-stderr>${W.stderr}</bash-stderr>`
        })],
        shouldQuery: !1
      }
    }
    return {
      messages: [cV(), Y, ...B, R0({
        content: `<bash-stderr>Command failed: ${W instanceof Error?W.message:String(W)}</bash-stderr>`
      })],
      shouldQuery: !1
    }
  } finally {
    Z(null)
  }
}
// @from(Start 11458980, End 11458982)
qy
// @from(Start 11458988, End 11459090)
SP2 = L(() => {
  q0();
  cQ();
  cQ();
  PP2();
  pF();
  Np();
  Np();
  RZ();
  qy = BA(VA(), 1)
})
// @from(Start 11459093, End 11459435)
function rJA(A) {
  let Q = A.trim();
  if (!Q.startsWith("/")) return null;
  let G = Q.slice(1).split(" ");
  if (!G[0]) return null;
  let Z = G[0],
    I = !1,
    Y = 1;
  if (G.length > 1 && G[1] === "(MCP)") Z = Z + " (MCP)", I = !0, Y = 2;
  let J = G.slice(Y).join(" ");
  return {
    commandName: Z,
    args: J,
    isMcp: I
  }
}
// @from(Start 11459437, End 11459502)
function lf5() {
  return Y0(process.env.OTEL_LOG_USER_PROMPTS)
}
// @from(Start 11459504, End 11459557)
function n61(A) {
  return lf5() ? A : "<REDACTED>"
}
// @from(Start 11459558, End 11459861)
async function HO(A, Q = {}) {
  let B = uE0();
  if (!B) return;
  let G = {
    ...kJA(),
    "event.name": A,
    "event.timestamp": new Date().toISOString()
  };
  for (let [Z, I] of Object.entries(Q))
    if (I !== void 0) G[Z] = I;
  B.emit({
    body: `claude_code.${A}`,
    attributes: G
  })
}
// @from(Start 11459866, End 11459908)
oJA = L(() => {
  _0();
  W61();
  hQ()
})
// @from(Start 11459911, End 11459967)
function if5(A) {
  return !/[^a-zA-Z0-9:\-_]/.test(A)
}
// @from(Start 11459968, End 11462619)
async function _P2(A, Q, B, G, Z, I, Y, J, W) {
  let X = rJA(A);
  if (!X) return GA("tengu_input_slash_missing", {}), {
    messages: [cV(), ...G, R0({
      content: Y$({
        inputString: "Commands are in the form `/command [args]`",
        precedingInputBlocks: Q
      })
    })],
    shouldQuery: !1
  };
  let {
    commandName: V,
    args: F,
    isMcp: K
  } = X, D = K ? "mcp" : !Ny().has(V) ? "custom" : V;
  if (!ph(V, Z.options.commands)) {
    let y = RA().existsSync(`/${V}`);
    if (if5(V) && !y) return GA("tengu_input_slash_invalid", {
      input: V
    }), {
      messages: [cV(), ...G, R0({
        content: Y$({
          inputString: `Unknown slash command: ${V}`,
          precedingInputBlocks: Q
        })
      })],
      shouldQuery: !1
    };
    return GA("tengu_input_prompt", {}), HO("user_prompt", {
      prompt_length: String(A.length),
      prompt: n61(A)
    }), {
      messages: [R0({
        content: Y$({
          inputString: A,
          precedingInputBlocks: Q
        }),
        uuid: J
      }), ...G],
      shouldQuery: !0
    }
  }
  I(!0);
  let {
    messages: H,
    shouldQuery: C,
    allowedTools: E,
    skipHistory: U,
    maxThinkingTokens: q,
    model: w,
    command: N
  } = await nf5(V, F, Y, Z, Q, B, W);
  if (H.length === 0) {
    let y = {
      input: D
    };
    if (N.type === "prompt" && N.pluginInfo) {
      let {
        pluginManifest: v,
        repository: x
      } = N.pluginInfo;
      if (y.plugin_repository = x, y.plugin_name = v.name, v.version) y.plugin_version = v.version
    }
    return GA("tengu_input_command", y), {
      messages: [],
      shouldQuery: !1,
      skipHistory: U,
      maxThinkingTokens: q,
      model: w
    }
  }
  if (H.length === 2 && H[1].type === "user" && typeof H[1].message.content === "string" && H[1].message.content.startsWith("Unknown command:")) {
    if (!(A.startsWith("/var") || A.startsWith("/tmp") || A.startsWith("/private"))) GA("tengu_input_slash_invalid", {
      input: V
    });
    return {
      messages: [cV(), ...H],
      shouldQuery: C,
      allowedTools: E,
      maxThinkingTokens: q,
      model: w
    }
  }
  let R = {
    input: D
  };
  if (N.type === "prompt" && N.pluginInfo) {
    let {
      pluginManifest: y,
      repository: v
    } = N.pluginInfo;
    if (R.plugin_repository = v, R.plugin_name = y.name, y.version) R.plugin_version = y.version
  }
  GA("tengu_input_command", R);
  let T = H.length > 0 && H[0] && lh(H[0]);
  return {
    messages: C || H.every(yP2) || T ? H : [cV(), ...H],
    shouldQuery: C,
    allowedTools: E,
    maxThinkingTokens: q,
    model: w
  }
}
// @from(Start 11462620, End 11466365)
async function nf5(A, Q, B, G, Z, I, Y) {
  let J = Pq(A, G.options.commands);
  try {
    switch (J.type) {
      case "local-jsx":
        return new Promise((W) => {
          J.call((X, V) => {
            if (B(null), V?.display === "skip") {
              W({
                messages: [],
                shouldQuery: !1,
                skipHistory: !0,
                command: J
              });
              return
            }
            W({
              messages: V?.display === "system" ? [z60(a61(J, Q)), z60(`<local-command-stdout>${X}</local-command-stdout>`)] : [R0({
                content: Y$({
                  inputString: a61(J, Q),
                  precedingInputBlocks: Z
                })
              }), X ? R0({
                content: `<local-command-stdout>${X}</local-command-stdout>`
              }) : R0({
                content: `<local-command-stdout>${$q}</local-command-stdout>`
              })],
              shouldQuery: !1,
              command: J
            })
          }, G, Q).then((X) => {
            if (G.options.isNonInteractiveSession) {
              W({
                messages: [],
                shouldQuery: !1,
                skipHistory: !0,
                command: J
              });
              return
            }
            B({
              jsx: X,
              shouldHidePromptInput: !0,
              showSpinner: !1,
              isLocalJSXCommand: !1
            })
          })
        });
      case "local": {
        let W = R0({
          content: Y$({
            inputString: a61(J, Q),
            precedingInputBlocks: Z
          })
        });
        try {
          let X = cV(),
            V = await J.call(Q, G);
          if (V.type === "skip") return {
            messages: [],
            shouldQuery: !1,
            skipHistory: !0,
            command: J
          };
          if (!G.options.isNonInteractiveSession) process.stdout.write("\x1B[?25l");
          if (V.type === "compact") {
            let {
              boundaryMarker: F,
              summaryMessages: K,
              attachments: D,
              hookResults: H
            } = V.compactionResult;
            return {
              messages: [F, ...K, X, W, ...V.displayText ? [R0({
                content: `<local-command-stdout>${V.displayText}</local-command-stdout>`,
                timestamp: new Date(Date.now() + 100).toISOString()
              })] : [], ...D, ...H],
              shouldQuery: !1,
              command: J
            }
          }
          return {
            messages: [W, R0({
              content: `<local-command-stdout>${V.value}</local-command-stdout>`
            })],
            shouldQuery: !1,
            command: J
          }
        } catch (X) {
          return AA(X), {
            messages: [W, R0({
              content: `<local-command-stderr>${String(X)}</local-command-stderr>`
            })],
            shouldQuery: !1,
            command: J
          }
        }
      }
      case "prompt":
        try {
          return await kP2(J, Q, G, Z, I)
        } catch (W) {
          return {
            messages: [R0({
              content: Y$({
                inputString: a61(J, Q),
                precedingInputBlocks: Z
              })
            }), R0({
              content: `<local-command-stderr>${String(W)}</local-command-stderr>`
            })],
            shouldQuery: !1,
            command: J
          }
        }
    }
  } catch (W) {
    if (W instanceof oj) return {
      messages: [R0({
        content: Y$({
          inputString: W.message,
          precedingInputBlocks: Z
        })
      })],
      shouldQuery: !1,
      command: J
    };
    throw W
  }
}
// @from(Start 11466367, End 11466567)
function a61(A, Q) {
  return `<command-name>/${A.userFacingName()}</command-name>
            <command-message>${A.userFacingName()}</command-message>
            <command-args>${Q}</command-args>`
}
// @from(Start 11466569, End 11466713)
function U60(A, Q = "loading") {
  return `<command-message>${`The "${A}" skill is ${Q}`}</command-message>
<command-name>${A}</command-name>`
}
// @from(Start 11466715, End 11466919)
function af5(A, Q, B) {
  return [`<command-message>${`${A} is ${Q}…`}</command-message>`, `<command-name>/${A}</command-name>`, B ? `<command-args>${B}</command-args>` : null].filter(Boolean).join(`
`)
}
// @from(Start 11466921, End 11467066)
function sf5(A, Q) {
  if (A.isSkill) return U60(A.userFacingName(), A.progressMessage);
  return af5(A.userFacingName(), A.progressMessage, Q)
}
// @from(Start 11467067, End 11467359)
async function s61(A, Q, B, G, Z = []) {
  if (!ph(A, B)) throw new oj(`Unknown command: ${A}`);
  let I = Pq(A, B);
  if (I.type !== "prompt") throw Error(`Unexpected ${I.type} command. Expected 'prompt' command. Use /${A} directly in the main conversation.`);
  return kP2(I, Q, G, [], Z)
}
// @from(Start 11467360, End 11468846)
async function kP2(A, Q, B, G = [], Z = []) {
  let I = await A.getPromptForCommand(Q, B),
    Y = sf5(A, Q);
  g(`Metadata string for ${A.userFacingName()}:`), g(`  ${Y.substring(0,200)}`);
  let J = (Y.match(/<command-message>/g) || []).length;
  g(`  command-message tags in metadata: ${J}`);
  let W = w0A(A.allowedTools ?? []),
    X = Z.length > 0 || G.length > 0 ? [...Z, ...G, ...I] : I,
    V = Xf([R0({
      content: X
    })], void 0),
    F = await d91(jYA(I.filter((D) => D.type === "text").map((D) => D.text).join(" "), B, null, [], B.messages, "repl_main_thread")),
    K = [R0({
      content: Y
    }), R0({
      content: X,
      isMeta: !0
    }), ...F, ...W.length || A.model ? [l9({
      type: "command_permissions",
      allowedTools: W,
      model: A.useSmallFastModel ? MW() : A.model
    })] : []];
  return g(`processPromptSlashCommand creating ${K.length} messages for ${A.userFacingName()}`), K.forEach((D, H) => {
    if (D.type === "user" && "message" in D) {
      let C = typeof D.message.content === "string" ? D.message.content : JSON.stringify(D.message.content),
        E = "isMeta" in D && D.isMeta ? " [META]" : "",
        U = C.substring(0, 200);
      g(`  Message ${H+1}${E}: ${U}`)
    } else if (D.type === "attachment") g(`  Message ${H+1}: [ATTACHMENT]`)
  }), {
    messages: K,
    shouldQuery: !0,
    allowedTools: W,
    maxThinkingTokens: V > 0 ? V : void 0,
    model: A.useSmallFastModel ? MW() : A.model,
    command: A
  }
}
// @from(Start 11468851, End 11468982)
vRA = L(() => {
  q0();
  cQ();
  cE();
  AQ();
  oJA();
  ZO();
  g1();
  V0();
  RZ();
  tJA();
  _i();
  IO();
  CU();
  t2()
})
// @from(Start 11469066, End 11469297)
function w60(A) {
  let Q = rf5(),
    B = W0(),
    G = A.startsWith(Q) ? "~" + A.slice(Q.length) : null,
    Z = A.startsWith(B) ? "./" + of5(B, A) : null;
  if (G && Z) return G.length <= Z.length ? G : Z;
  return G || Z || A
}
// @from(Start 11469299, End 11469546)
function xP2({
  memoryPath: A
}) {
  let Q = w60(A);
  return $60.default.createElement(S, {
    flexDirection: "column",
    flexGrow: 1
  }, $60.default.createElement($, {
    color: "text"
  }, "Memory updated in ", Q, " · /memory to edit"))
}
// @from(Start 11469551, End 11469554)
$60
// @from(Start 11469560, End 11469614)
q60 = L(() => {
  hA();
  U2();
  $60 = BA(VA(), 1)
})
// @from(Start 11469711, End 11469869)
async function Qh5(A, Q) {
  let {
    code: B
  } = await A3("git", ["check-ignore", A], {
    preserveOutputOnError: !1,
    cwd: Q
  });
  return B === 0
}
// @from(Start 11469871, End 11469937)
function Bh5() {
  return tf5(Ah5(), ".config", "git", "ignore")
}
// @from(Start 11469938, End 11470530)
async function N60(A, Q = W0()) {
  try {
    if (!await zh1(Q)) return;
    let B = `**/${A}`,
      G = A.endsWith("/") ? `${A}sample-file.txt` : A;
    if (await Qh5(G, Q)) return;
    let Z = Bh5(),
      I = RA(),
      Y = ef5(Z);
    if (!I.existsSync(Y)) I.mkdirSync(Y);
    if (I.existsSync(Z)) {
      if (I.readFileSync(Z, {
          encoding: "utf-8"
        }).includes(B)) return;
      I.appendFileSync(Z, `
${B}
`)
    } else I.writeFileSync(Z, `${B}
`, {
      encoding: "utf-8",
      flush: !1
    })
  } catch (B) {
    AA(B instanceof Error ? B : Error(String(B)))
  }
}
// @from(Start 11470535, End 11470592)
L60 = L(() => {
  PV();
  AQ();
  U2();
  g1();
  _8()
})
// @from(Start 11470650, End 11470766)
function vP2(A) {
  if (!RA().existsSync(A)) return "";
  return RA().readFileSync(A, {
    encoding: "utf-8"
  })
}
// @from(Start 11470768, End 11470941)
function bP2(A) {
  try {
    Gh5("git", ["rev-parse", "--is-inside-work-tree"], {
      cwd: A,
      stdio: "ignore"
    })
  } catch (Q) {
    return !1
  }
  return !0
}
// @from(Start 11470946, End 11470980)
M60 = L(() => {
  AQ();
  L60()
})
// @from(Start 11471024, End 11471196)
function Zh5(A) {
  let Q = A.trim();
  if (!Q) return "";
  if (Q.startsWith("- ")) return Q;
  if (Q.startsWith("-")) return `- ${Q.slice(1).trim()}`;
  return `- ${Q}`
}
// @from(Start 11471198, End 11471317)
function Ih5() {
  let A = N1(),
    Q = (A.memoryUsageCount || 0) + 1;
  c0({
    ...A,
    memoryUsageCount: Q
  })
}
// @from(Start 11471322, End 11471325)
O60
// @from(Start 11471327, End 11471330)
hP2
// @from(Start 11471336, End 11472436)
gP2 = L(() => {
  q60();
  q0();
  jQ();
  M60();
  AQ();
  R9();
  g1();
  O60 = BA(VA(), 1);
  hP2 = q_(async function(A, Q, B) {
    GA("tengu_add_memory_start", {}), Ih5();
    let G = vP2(B);
    if (!RA().existsSync(fP2(B))) try {
      RA().mkdirSync(fP2(B))
    } catch (Z) {
      AA(Z instanceof Error ? Z : Error(String(Z)))
    }
    try {
      let Z = Zh5(A),
        I = G.replace(/\n+$/, ""),
        Y = I ? `${I}
${Z}` : Z;
      RA().writeFileSync(B, Y, {
        encoding: "utf8",
        flush: !0
      }), Q.readFileState.set(B, {
        content: Y,
        timestamp: PD(B),
        offset: void 0,
        limit: void 0
      }), GA("tengu_add_memory_success", {}), Q.addNotification?.({
        key: "memory-update-success",
        priority: "immediate",
        jsx: O60.createElement(xP2, {
          memoryPath: B
        })
      })
    } catch (Z) {
      AA(Z), GA("tengu_add_memory_failure", {}), Q.addNotification?.({
        key: "memory-update-error",
        priority: "high",
        text: "Failed to save memory",
        color: "error"
      })
    }
  })
})
// @from(Start 11472439, End 11472724)
function uP2(A, Q, B, G, Z) {
  GA("tengu_input_memory", {});
  let I = R0({
    content: Y$({
      inputString: `<user-memory-input>${A}</user-memory-input>`,
      precedingInputBlocks: Q
    })
  });
  return hP2(A, G, Z), {
    messages: [cV(), ...B, I],
    shouldQuery: !1
  }
}
// @from(Start 11472729, End 11472771)
mP2 = L(() => {
  q0();
  cQ();
  gP2()
})
// @from(Start 11472774, End 11473076)
function dP2(A) {
  let Q = A.toLowerCase();
  return /\b(wtf|wth|ffs|omfg|shit(ty|tiest)?|dumbass|horrible|awful|piss(ed|ing)? off|piece of (shit|crap|junk)|what the (fuck|hell)|fucking? (broken|useless|terrible|awful|horrible)|fuck you|screw (this|you)|so frustrating|this sucks|damn it)\b/.test(Q)
}
// @from(Start 11473078, End 11473208)
function cP2(A) {
  let Q = A.toLowerCase().trim();
  if (Q === "continue") return !0;
  return /\b(keep going|go on)\b/.test(Q)
}
// @from(Start 11473210, End 11473320)
function pP2(A) {
  let Q = A.toLowerCase();
  return /\b(you'?re absolutely right|you'?re right)\b/.test(Q)
}
// @from(Start 11473322, End 11474335)
function lP2(A, Q, B, G, Z, I, Y, J) {
  G(!0);
  let W = typeof A === "string" ? A : A.find((K) => K.type === "text")?.text || "";
  nM2(W);
  let X = {};
  if (typeof A === "string") {
    let K = dP2(A),
      D = cP2(A);
    X = {
      is_negative: K,
      is_keep_going: D
    }, HO("user_prompt", {
      prompt_length: String(A.length),
      prompt: n61(A)
    })
  }
  if (GA("tengu_input_prompt", X), Q.length > 0) {
    let K = R0({
        content: [...Q, ...typeof A === "string" ? [{
          type: "text",
          text: A
        }] : A],
        uuid: Z,
        thinkingMetadata: I,
        todos: J
      }),
      D = Xf([K], Y ?? void 0);
    return {
      messages: [K, ...B],
      shouldQuery: !0,
      maxThinkingTokens: D > 0 ? D : void 0
    }
  }
  let V = R0({
      content: A,
      uuid: Z,
      thinkingMetadata: I,
      todos: J
    }),
    F = Xf([V], Y ?? void 0);
  return {
    messages: [V, ...B],
    shouldQuery: !0,
    maxThinkingTokens: F > 0 ? F : void 0
  }
}
// @from(Start 11474340, End 11474399)
iP2 = L(() => {
  q0();
  oJA();
  F0A();
  cQ();
  CU()
})
// @from(Start 11474402, End 11474481)
function j60() {
  if (!R60) R60 = UA("perf_hooks").performance;
  return R60
}
// @from(Start 11474483, End 11474607)
function sP2() {
  if (!bRA) return;
  j60().clearMarks(), P60.clear(), T60 = null, aP2++, s7("query_user_input_received")
}
// @from(Start 11474609, End 11474874)
function s7(A) {
  if (!bRA) return;
  let Q = j60();
  if (Q.mark(A), P60.set(A, process.memoryUsage()), A === "query_first_chunk_received" && T60 === null) {
    let B = Q.getEntriesByType("mark");
    if (B.length > 0) T60 = B[B.length - 1]?.startTime ?? 0
  }
}
// @from(Start 11474876, End 11474940)
function rP2() {
  if (!bRA) return;
  s7("query_profile_end")
}
// @from(Start 11474942, End 11474983)
function eJA(A) {
  return A.toFixed(3)
}
// @from(Start 11474985, End 11475042)
function nP2(A) {
  return (A / 1024 / 1024).toFixed(2)
}
// @from(Start 11475044, End 11475423)
function Yh5(A, Q) {
  if (Q === "query_user_input_received") return "";
  if (A > 1000) return " ⚠️  VERY SLOW";
  if (A > 100) return " ⚠️  SLOW";
  if (Q.includes("git_status") && A > 50) return " ⚠️  git status";
  if (Q.includes("tool_schema") && A > 50) return " ⚠️  tool schemas";
  if (Q.includes("client_creation") && A > 50) return " ⚠️  client creation";
  return ""
}
// @from(Start 11475425, End 11476729)
function Jh5() {
  if (!bRA) return "Query profiling not enabled (set CLAUDE_CODE_PROFILE_QUERY=1)";
  let Q = j60().getEntriesByType("mark");
  if (Q.length === 0) return "No query profiling checkpoints recorded";
  let B = [];
  B.push("=".repeat(80)), B.push(`QUERY PROFILING REPORT - Query #${aP2}`), B.push("=".repeat(80)), B.push("");
  let G = Q[0]?.startTime ?? 0,
    Z = G,
    I = 0,
    Y = 0;
  for (let X of Q) {
    let V = X.startTime - G,
      F = eJA(V),
      K = X.startTime - Z,
      D = eJA(K),
      H = P60.get(X.name),
      C = Yh5(K, X.name),
      E = H ? ` | RSS: ${nP2(H.rss)}MB, Heap: ${nP2(H.heapUsed)}MB` : "";
    if (B.push(`[+${F.padStart(10)}ms] (+${D.padStart(9)}ms) ${X.name}${C}${E}`), X.name === "query_api_request_sent") I = V;
    if (X.name === "query_first_chunk_received") Y = V;
    Z = X.startTime
  }
  let J = Q[Q.length - 1],
    W = J ? J.startTime - G : 0;
  if (B.push(""), B.push("-".repeat(80)), Y > 0) {
    let X = I,
      V = Y - I,
      F = (X / Y * 100).toFixed(1),
      K = (V / Y * 100).toFixed(1);
    B.push(`Total TTFT: ${eJA(Y)}ms`), B.push(`  - Pre-request overhead: ${eJA(X)}ms (${F}%)`), B.push(`  - Network latency: ${eJA(V)}ms (${K}%)`)
  } else B.push(`Total time: ${eJA(W)}ms`);
  return B.push("=".repeat(80)), B.join(`
`)
}
// @from(Start 11476731, End 11476780)
function oP2() {
  if (!bRA) return;
  g(Jh5())
}
// @from(Start 11476785, End 11476788)
bRA
// @from(Start 11476790, End 11476793)
P60
// @from(Start 11476795, End 11476802)
aP2 = 0
// @from(Start 11476806, End 11476816)
T60 = null
// @from(Start 11476820, End 11476830)
R60 = null
// @from(Start 11476836, End 11476931)
fRA = L(() => {
  V0();
  bRA = process.env.CLAUDE_CODE_PROFILE_QUERY === "1", P60 = new Map
})
// @from(Start 11476984, End 11479181)
async function TP({
  input: A,
  mode: Q,
  setIsLoading: B,
  setToolJSX: G,
  context: Z,
  pastedContents: I,
  ideSelection: Y,
  memoryPath: J,
  messages: W,
  setUserInputOnProcessing: X,
  uuid: V,
  isAlreadyProcessing: F,
  thinkingMetadata: K,
  manualThinkingTokens: D,
  querySource: H
}) {
  let C = typeof A === "string" ? A : null;
  if (Q === "prompt" && C !== null) X?.(C);
  try {
    s7("query_process_user_input_base_start");
    let E = await Z.getAppState(),
      U = await Xh5(A, Q, B, G, Z, I, Y, J, W, V, F, K, D, H, E.todos[Z.agentId]);
    if (s7("query_process_user_input_base_end"), !U.shouldQuery) return U;
    s7("query_hooks_start");
    let q = QWA(A) || "";
    for await (let w of k60(q, E.toolPermissionContext.mode, Z)) {
      if (w.message?.type === "progress") continue;
      if (w.blockingError) {
        let N = _60(w.blockingError);
        return {
          messages: [$y(`${N}

Original prompt: ${A}`, "warning")],
          shouldQuery: !1,
          allowedTools: U.allowedTools,
          skipHistory: U.skipHistory,
          maxThinkingTokens: U.maxThinkingTokens
        }
      }
      if (w.preventContinuation) {
        let N = w.stopReason ? `Operation stopped by hook: ${w.stopReason}` : "Operation stopped by hook";
        return U.messages.push(R0({
          content: N
        })), U.shouldQuery = !1, U
      }
      if (w.additionalContexts && w.additionalContexts.length > 0) U.messages.push(l9({
        type: "hook_additional_context",
        content: w.additionalContexts.map(tP2),
        hookName: "UserPromptSubmit",
        toolUseID: `hook-${Wh5()}`,
        hookEvent: "UserPromptSubmit"
      }));
      if (w.message) switch (w.message.attachment.type) {
        case "hook_success":
          if (!w.message.attachment.content) break;
          U.messages.push({
            ...w.message,
            attachment: {
              ...w.message.attachment,
              content: tP2(w.message.attachment.content)
            }
          });
          break;
        default:
          U.messages.push(w.message);
          break
      }
    }
    return s7("query_hooks_end"), U
  } finally {
    X?.(void 0)
  }
}
// @from(Start 11479183, End 11479316)
function tP2(A) {
  if (A.length > S60) return `${A.substring(0,S60)}… [output truncated - exceeded ${S60} characters]`;
  return A
}
// @from(Start 11479317, End 11480998)
async function Xh5(A, Q, B, G, Z, I, Y, J, W, X, V, F, K, D, H) {
  let C = null,
    E = [];
  if (typeof A === "string") C = A;
  else if (A.length > 0) {
    s7("query_image_processing_start");
    for (let R = 0; R < A.length; R++) {
      let T = A[R];
      if (T.type === "image") A[R] = await VMB(T)
    }
    s7("query_image_processing_end");
    let N = A[A.length - 1];
    if (N?.type === "text") C = N.text, E = [...A.slice(0, -1)];
    else E = A
  }
  if (C === null && Q !== "prompt") throw Error(`Mode: ${Q} requires a string input.`);
  let U = I ? Object.values(I).filter((N) => N.type === "image").map((N) => ({
      type: "image",
      source: {
        type: "base64",
        media_type: N.mediaType || "image/png",
        data: N.content
      }
    })) : [],
    q = C !== null && (Q !== "prompt" || !C.startsWith("/"));
  s7("query_attachment_loading_start");
  let w = q ? await d91(jYA(C, Z, Y ?? null, [], W, D)) : [];
  if (s7("query_attachment_loading_end"), C !== null && Q === "bash") return await jP2(C, E, w, Z, G, B);
  if (C !== null && Q === "background") return await RP2(C, E, w, Z, G, B);
  if (C !== null && Q === "memorySelect" && J) return uP2(C, E, w, Z, J);
  if (C !== null && C.startsWith("/")) return await _P2(C, E, U, w, Z, B, G, X, V);
  if (C !== null && Q === "prompt") {
    let N = C.trim(),
      R = w.find((T) => T.attachment.type === "agent_mention");
    if (R) {
      let T = `@agent-${R.attachment.agentType}`,
        y = N === T,
        v = N.startsWith(T) && !y;
      GA("tengu_subagent_at_mention", {
        is_subagent_only: y,
        is_prefix: v
      })
    }
  }
  return lP2(A, U, w, B, X, F, K, H)
}
// @from(Start 11481003, End 11481012)
S60 = 1e4
// @from(Start 11481018, End 11481145)
AWA = L(() => {
  cQ();
  _i();
  IO();
  cQ();
  YO();
  D60();
  SP2();
  vRA();
  mP2();
  iP2();
  ot();
  q0();
  fRA()
})
// @from(Start 11481148, End 11481273)
function r61(A, Q) {
  if (A.includes("$ARGUMENTS")) return A.replaceAll("$ARGUMENTS", Q);
  return A + `

ARGUMENTS: ${Q}`
}
// @from(Start 11481278, End 11481281)
hRA
// @from(Start 11481287, End 11481483)
y60 = L(() => {
  Q2();
  hRA = j.object({
    ok: j.boolean().describe("Whether the condition was met"),
    reason: j.string().describe("Reason, if the condition was not met").optional()
  })
})
// @from(Start 11481531, End 11486556)
async function eP2(A, Q, B, G, Z, I, Y, J) {
  let W = J || `hook-${Vh5()}`;
  try {
    let X = r61(A.prompt, G);
    g(`Hooks: Processing prompt hook with prompt: ${X}`);
    let V = {
        ...I,
        onChangeAPIKey: () => {},
        onChangeDynamicMcpConfig: void 0,
        onInstallIDEExtension: void 0,
        resume: void 0,
        options: {
          ...I.options,
          dynamicMcpConfig: void 0,
          ideInstallationStatus: null,
          theme: "dark"
        }
      },
      F = await TP({
        input: X,
        mode: "prompt",
        setIsLoading: () => {},
        setToolJSX: () => {},
        context: V
      });
    if (!F.shouldQuery) {
      let w = F.messages.map((N) => {
        if (N.type === "user" && N.message?.content) {
          if (typeof N.message.content === "string") return N.message.content;
          return N.message.content.filter((R) => R.type === "text").map((R) => R.text).join("")
        }
        return ""
      }).join(`
`);
      return {
        hook: A,
        outcome: "success",
        message: l9({
          type: "hook_success",
          hookName: Q,
          toolUseID: W,
          hookEvent: B,
          content: w
        })
      }
    }
    let K = Y && Y.length > 0 ? [...Y, ...F.messages] : F.messages;
    g(`Hooks: Querying model with ${K.length} messages`);
    let D = A.timeout ? A.timeout * 1000 : 30000,
      H = o9(),
      C = setTimeout(() => {
        H.abort()
      }, D),
      {
        signal: E,
        cleanup: U
      } = ck(Z, H.signal),
      q = [...K, uD({
        content: "{"
      })];
    try {
      let w = await wy({
        messages: q,
        systemPrompt: [`You are evaluating a hook in Claude Code.

CRITICAL: You MUST return ONLY valid JSON with no other text, explanation, or commentary before or after the JSON. Do not include any markdown code blocks, thinking, or additional text.

Your response must be a single JSON object matching one of the following schemas:
1. If the condition is met, return: {"ok": true}
2. If the condition is not met, return: {"ok": false, "reason": "Reason for why it is not met"}

Return the JSON object directly with no preamble or explanation.`],
        maxThinkingTokens: 0,
        tools: I.options.tools,
        signal: E,
        options: {
          async getToolPermissionContext() {
            return (await I.getAppState()).toolPermissionContext
          },
          model: A.model ?? MW(),
          toolChoice: void 0,
          isNonInteractiveSession: !0,
          hasAppendSystemPrompt: !1,
          agents: [],
          querySource: "hook_prompt",
          mcpTools: [],
          agentIdOrSessionId: I.agentId
        }
      });
      clearTimeout(C), U();
      let N = w.message.content.filter((v) => v.type === "text").map((v) => v.text).join("");
      I.setResponseLength((v) => v + N.length);
      let R = ("{" + N).trim();
      g(`Hooks: Model response: ${R}`);
      let T = f7(R);
      if (!T) return g(`Hooks: error parsing response as JSON: ${R}`), {
        hook: A,
        outcome: "non_blocking_error",
        message: l9({
          type: "hook_non_blocking_error",
          hookName: Q,
          toolUseID: W,
          hookEvent: B,
          stderr: "JSON validation failed",
          stdout: R,
          exitCode: 1
        })
      };
      let y = hRA.safeParse(T);
      if (!y.success) return g(`Hooks: model response does not conform to expected schema: ${y.error.message}`), {
        hook: A,
        outcome: "non_blocking_error",
        message: l9({
          type: "hook_non_blocking_error",
          hookName: Q,
          toolUseID: W,
          hookEvent: B,
          stderr: `Schema validation failed: ${y.error.message}`,
          stdout: R,
          exitCode: 1
        })
      };
      if (!y.data.ok) return g(`Hooks: Prompt hook condition was not met: ${y.data.reason}`), {
        hook: A,
        outcome: "blocking",
        blockingError: {
          blockingError: `Prompt hook condition was not met: ${y.data.reason}`,
          command: A.prompt
        },
        preventContinuation: !0,
        stopReason: y.data.reason
      };
      return g("Hooks: Prompt hook condition was met"), {
        hook: A,
        outcome: "success",
        message: l9({
          type: "hook_success",
          hookName: Q,
          toolUseID: W,
          hookEvent: B,
          content: "Condition met"
        })
      }
    } catch (w) {
      if (clearTimeout(C), U(), E.aborted) return {
        hook: A,
        outcome: "cancelled"
      };
      throw w
    }
  } catch (X) {
    let V = X instanceof Error ? X.message : String(X);
    return g(`Hooks: Prompt hook error: ${V}`), {
      hook: A,
      outcome: "non_blocking_error",
      message: l9({
        type: "hook_non_blocking_error",
        hookName: Q,
        toolUseID: W,
        hookEvent: B,
        stderr: `Error executing prompt hook: ${V}`,
        stdout: "",
        exitCode: 1
      })
    }
  }
}
// @from(Start 11486561, End 11486661)
Aj2 = L(() => {
  V0();
  AWA();
  cQ();
  fZ();
  t2();
  B91();
  OZ();
  IO();
  LF();
  y60()
})
// @from(Start 11486664, End 11486839)
function Qj2(A) {
  switch (A) {
    case "allow":
      return "allowed";
    case "deny":
      return "denied";
    default:
      return "asked for confirmation for"
  }
}
// @from(Start 11486841, End 11487087)
function Fh5(A) {
  let Q = A.message;
  if (!Q) return "";
  if (Q.includes("<!DOCTYPE html") || Q.includes("<html")) {
    let B = Q.match(/<title>([^<]+)<\/title>/);
    if (B && B[1]) return B[1].trim();
    return ""
  }
  return A.message
}
// @from(Start 11487089, End 11487584)
function Bj2(A) {
  if (A.cause instanceof Error && "code" in A.cause && A.cause?.code === "ETIMEDOUT" || A.cause instanceof Error && A.cause?.cause instanceof Error && "code" in A.cause.cause && A.cause.cause.code === "ETIMEDOUT") return "Request timed out. Check your internet connection and proxy settings";
  if (A.message === "Connection error.") return "Unable to connect to API due to poor internet connection";
  let Q = Fh5(A);
  return Q !== A.message && Q.length > 0 ? Q : A.message
}
// @from(Start 11487585, End 11487964)
async function Gj2(A, Q) {
  await new Promise((B, G) => {
    let Z = setTimeout(B, A);
    if (Q) {
      let I = () => {
        clearTimeout(Z), G(new yY)
      };
      if (Q.aborted) {
        I();
        return
      }
      Q.addEventListener("abort", I, {
        once: !0
      }), setTimeout(() => {
        Q?.removeEventListener("abort", I)
      }, A)
    }
  })
}
// @from(Start 11487969, End 11487994)
x60 = L(() => {
  p_()
})
// @from(Start 11487996, End 11489948)
async function* t61(A, Q, B) {
  let G = wh5(B),
    Z = {
      model: B.model,
      maxThinkingTokens: B.maxThinkingTokens
    },
    I = null,
    Y = 0,
    J;
  for (let W = 1; W <= G + 1; W++) {
    if (B.signal?.aborted) throw new yY;
    try {
      if (I === null || J instanceof n2 && J.status === 401 || Ij2(J)) I = await A();
      return await Q(I, W, Z)
    } catch (X) {
      if (J = X, zh5(X) && (process.env.FALLBACK_FOR_ALL_PRIMARY_MODELS || !BB() && W7A(B.model))) {
        if (Y++, Y >= Dh5) {
          if (B.fallbackModel) throw GA("tengu_api_opus_fallback_triggered", {
            original_model: B.model,
            fallback_model: B.fallbackModel,
            provider: _R()
          }), new o61(B.model, B.fallbackModel);
          if (!process.env.IS_SANDBOX) throw GA("tengu_api_custom_529_overloaded_error", {}), new Kn(Error(GQ0), Z)
        }
      }
      if (W > G) throw new Kn(X, Z);
      if (!Uh5(X) && (!(X instanceof n2) || !$h5(X))) throw new Kn(X, Z);
      if (X instanceof n2) {
        let D = Zj2(X);
        if (D) {
          let {
            inputTokens: H,
            contextLimit: C
          } = D, E = 1000, U = Math.max(0, C - H - 1000);
          if (U < v60) throw AA(Error(`availableContext ${U} is less than FLOOR_OUTPUT_TOKENS ${v60}`)), X;
          let q = (Z.maxThinkingTokens || 0) + 1,
            w = Math.max(v60, U, q);
          Z.maxTokensOverride = w, GA("tengu_max_tokens_context_overflow_adjustment", {
            inputTokens: H,
            contextLimit: C,
            adjustedMaxTokens: w,
            attempt: W
          });
          continue
        }
      }
      let F = Ch5(X),
        K = Eh5(W, F);
      if (X instanceof n2) yield Yj2(X, K, W, G);
      GA("tengu_api_retry", {
        attempt: W,
        delayMs: K,
        error: X.message,
        status: X.status,
        provider: _R()
      }), await Gj2(K, B.signal)
    }
  }
  throw new Kn(J, Z)
}
// @from(Start 11489950, End 11490050)
function Ch5(A) {
  return (A.headers?.["retry-after"] || A.headers?.get?.("retry-after")) ?? null
}
// @from(Start 11490052, End 11490255)
function Eh5(A, Q) {
  if (Q) {
    let Z = parseInt(Q, 10);
    if (!isNaN(Z)) return Z * 1000
  }
  let B = Math.min(Hh5 * Math.pow(2, A - 1), 32000),
    G = Math.random() * 0.25 * B;
  return B + G
}
// @from(Start 11490257, End 11490914)
function Zj2(A) {
  if (A.status !== 400 || !A.message) return;
  if (!A.message.includes("input length and `max_tokens` exceed context limit")) return;
  let Q = /input length and `max_tokens` exceed context limit: (\d+) \+ (\d+) > (\d+)/,
    B = A.message.match(Q);
  if (!B || B.length !== 4) return;
  if (!B[1] || !B[2] || !B[3]) {
    AA(Error("Unable to parse max_tokens from max_tokens exceed context limit error message"));
    return
  }
  let G = parseInt(B[1], 10),
    Z = parseInt(B[2], 10),
    I = parseInt(B[3], 10);
  if (isNaN(G) || isNaN(Z) || isNaN(I)) return;
  return {
    inputTokens: G,
    maxTokens: Z,
    contextLimit: I
  }
}
// @from(Start 11490916, End 11491058)
function zh5(A) {
  if (!(A instanceof n2)) return !1;
  return A.status === 529 || (A.message?.includes('"type":"overloaded_error"') ?? !1)
}
// @from(Start 11491060, End 11491209)
function Ij2(A) {
  if (Y0(process.env.CLAUDE_CODE_USE_BEDROCK)) {
    if (QTQ(A) || A instanceof n2 && A.status === 403) return !0
  }
  return !1
}
// @from(Start 11491211, End 11491274)
function Uh5(A) {
  if (Ij2(A)) return MiA(), !0;
  return !1
}
// @from(Start 11491276, End 11491798)
function $h5(A) {
  if (MI2(A)) return !1;
  if (A.message?.includes('"type":"overloaded_error"')) return !0;
  if (Zj2(A)) return !0;
  let Q = A.headers?.get("x-should-retry");
  if (Q === "true" && !BB()) return !0;
  if (Q === "false") return !1;
  if (A instanceof cC) return !0;
  if (!A.status) return !1;
  if (A.status === 408) return !0;
  if (A.status === 409) return !0;
  if (A.status === 429) return !BB();
  if (A.status === 401) return LiA(), !0;
  if (A.status && A.status >= 500) return !0;
  return !1
}
// @from(Start 11491800, End 11491974)
function wh5(A) {
  if (A.maxRetries) return A.maxRetries;
  if (process.env.CLAUDE_CODE_MAX_RETRIES) return parseInt(process.env.CLAUDE_CODE_MAX_RETRIES, 10);
  return Kh5
}
// @from(Start 11491979, End 11491987)
Kh5 = 10
// @from(Start 11491991, End 11492001)
v60 = 3000
// @from(Start 11492005, End 11492012)
Dh5 = 3
// @from(Start 11492016, End 11492025)
Hh5 = 500
// @from(Start 11492029, End 11492031)
Kn
// @from(Start 11492033, End 11492036)
o61
// @from(Start 11492042, End 11492748)
b60 = L(() => {
  p_();
  g1();
  t2();
  lK();
  gB();
  q0();
  ZO();
  HT1();
  mMA();
  cQ();
  x60();
  hQ();
  Kn = class Kn extends Error {
    originalError;
    retryContext;
    constructor(A, Q) {
      let B = A instanceof Error ? A.message : String(A);
      super(B);
      this.originalError = A;
      this.retryContext = Q;
      if (this.name = "RetryError", A instanceof Error && A.stack) this.stack = A.stack
    }
  };
  o61 = class o61 extends Error {
    originalModel;
    fallbackModel;
    constructor(A, Q) {
      super(`Model fallback triggered: ${A} -> ${Q}`);
      this.originalModel = A;
      this.fallbackModel = Q;
      this.name = "FallbackTriggeredError"
    }
  }
})
// @from(Start 11492750, End 11493098)
async function Wj2() {
  let A = M6();
  if (!A?.accessToken) return;
  let Q = `${e9().BASE_API_URL}/api/oauth/claude_cli/client_data`;
  try {
    Jj2 = (await YQ.get(Q, {
      headers: {
        Authorization: `Bearer ${A.accessToken}`,
        "Content-Type": "application/json"
      }
    })).data.client_data
  } catch (B) {
    AA(B)
  }
}
// @from(Start 11493100, End 11493131)
function Xj2() {
  return Jj2
}
// @from(Start 11493136, End 11493139)
qh5
// @from(Start 11493141, End 11493144)
Jj2
// @from(Start 11493150, End 11493222)
f60 = L(() => {
  O3();
  NX();
  gB();
  g1();
  qh5 = {}, Jj2 = qh5
})
// @from(Start 11493225, End 11493273)
function h60(A) {
  return Number.isInteger(A)
}
// @from(Start 11493275, End 11493806)
function g60() {
  let A = Xj2();
  if (A.effortLevel !== void 0) return A.effortLevel;
  let Q = process.env.CLAUDE_CODE_EFFORT_LEVEL;
  if (Q) {
    if (Q === "unset") return;
    let Z = parseInt(Q, 10);
    if (!isNaN(Z) && h60(Z)) return Z;
    if (["low", "medium", "high"].includes(Q)) return Q
  }
  let G = l0().effortLevel;
  if (G === "unset") return;
  if (G !== void 0) {
    if (typeof G === "number" && h60(G)) return G;
    if (typeof G === "string" && ["low", "medium", "high"].includes(G)) return G
  }
  return
}
// @from(Start 11493811, End 11493845)
u60 = L(() => {
  MB();
  f60()
})
// @from(Start 11493851, End 11494637)
BWA = z((Kj2) => {
  Object.defineProperty(Kj2, "__esModule", {
    value: !0
  });
  Kj2.stringArray = Kj2.array = Kj2.func = Kj2.error = Kj2.number = Kj2.string = Kj2.boolean = void 0;

  function Nh5(A) {
    return A === !0 || A === !1
  }
  Kj2.boolean = Nh5;

  function Vj2(A) {
    return typeof A === "string" || A instanceof String
  }
  Kj2.string = Vj2;

  function Lh5(A) {
    return typeof A === "number" || A instanceof Number
  }
  Kj2.number = Lh5;

  function Mh5(A) {
    return A instanceof Error
  }
  Kj2.error = Mh5;

  function Oh5(A) {
    return typeof A === "function"
  }
  Kj2.func = Oh5;

  function Fj2(A) {
    return Array.isArray(A)
  }
  Kj2.array = Fj2;

  function Rh5(A) {
    return Fj2(A) && A.every((Q) => Vj2(Q))
  }
  Kj2.stringArray = Rh5
})
// @from(Start 11494643, End 11500062)
c60 = z((fj2) => {
  Object.defineProperty(fj2, "__esModule", {
    value: !0
  });
  fj2.Message = fj2.NotificationType9 = fj2.NotificationType8 = fj2.NotificationType7 = fj2.NotificationType6 = fj2.NotificationType5 = fj2.NotificationType4 = fj2.NotificationType3 = fj2.NotificationType2 = fj2.NotificationType1 = fj2.NotificationType0 = fj2.NotificationType = fj2.RequestType9 = fj2.RequestType8 = fj2.RequestType7 = fj2.RequestType6 = fj2.RequestType5 = fj2.RequestType4 = fj2.RequestType3 = fj2.RequestType2 = fj2.RequestType1 = fj2.RequestType = fj2.RequestType0 = fj2.AbstractMessageSignature = fj2.ParameterStructures = fj2.ResponseError = fj2.ErrorCodes = void 0;
  var q0A = BWA(),
    m60;
  (function(A) {
    A.ParseError = -32700, A.InvalidRequest = -32600, A.MethodNotFound = -32601, A.InvalidParams = -32602, A.InternalError = -32603, A.jsonrpcReservedErrorRangeStart = -32099, A.serverErrorStart = -32099, A.MessageWriteError = -32099, A.MessageReadError = -32098, A.PendingResponseRejected = -32097, A.ConnectionInactive = -32096, A.ServerNotInitialized = -32002, A.UnknownErrorCode = -32001, A.jsonrpcReservedErrorRangeEnd = -32000, A.serverErrorEnd = -32000
  })(m60 || (fj2.ErrorCodes = m60 = {}));
  class d60 extends Error {
    constructor(A, Q, B) {
      super(Q);
      this.code = q0A.number(A) ? A : m60.UnknownErrorCode, this.data = B, Object.setPrototypeOf(this, d60.prototype)
    }
    toJson() {
      let A = {
        code: this.code,
        message: this.message
      };
      if (this.data !== void 0) A.data = this.data;
      return A
    }
  }
  fj2.ResponseError = d60;
  class YC {
    constructor(A) {
      this.kind = A
    }
    static is(A) {
      return A === YC.auto || A === YC.byName || A === YC.byPosition
    }
    toString() {
      return this.kind
    }
  }
  fj2.ParameterStructures = YC;
  YC.auto = new YC("auto");
  YC.byPosition = new YC("byPosition");
  YC.byName = new YC("byName");
  class HY {
    constructor(A, Q) {
      this.method = A, this.numberOfParams = Q
    }
    get parameterStructures() {
      return YC.auto
    }
  }
  fj2.AbstractMessageSignature = HY;
  class Cj2 extends HY {
    constructor(A) {
      super(A, 0)
    }
  }
  fj2.RequestType0 = Cj2;
  class Ej2 extends HY {
    constructor(A, Q = YC.auto) {
      super(A, 1);
      this._parameterStructures = Q
    }
    get parameterStructures() {
      return this._parameterStructures
    }
  }
  fj2.RequestType = Ej2;
  class zj2 extends HY {
    constructor(A, Q = YC.auto) {
      super(A, 1);
      this._parameterStructures = Q
    }
    get parameterStructures() {
      return this._parameterStructures
    }
  }
  fj2.RequestType1 = zj2;
  class Uj2 extends HY {
    constructor(A) {
      super(A, 2)
    }
  }
  fj2.RequestType2 = Uj2;
  class $j2 extends HY {
    constructor(A) {
      super(A, 3)
    }
  }
  fj2.RequestType3 = $j2;
  class wj2 extends HY {
    constructor(A) {
      super(A, 4)
    }
  }
  fj2.RequestType4 = wj2;
  class qj2 extends HY {
    constructor(A) {
      super(A, 5)
    }
  }
  fj2.RequestType5 = qj2;
  class Nj2 extends HY {
    constructor(A) {
      super(A, 6)
    }
  }
  fj2.RequestType6 = Nj2;
  class Lj2 extends HY {
    constructor(A) {
      super(A, 7)
    }
  }
  fj2.RequestType7 = Lj2;
  class Mj2 extends HY {
    constructor(A) {
      super(A, 8)
    }
  }
  fj2.RequestType8 = Mj2;
  class Oj2 extends HY {
    constructor(A) {
      super(A, 9)
    }
  }
  fj2.RequestType9 = Oj2;
  class Rj2 extends HY {
    constructor(A, Q = YC.auto) {
      super(A, 1);
      this._parameterStructures = Q
    }
    get parameterStructures() {
      return this._parameterStructures
    }
  }
  fj2.NotificationType = Rj2;
  class Tj2 extends HY {
    constructor(A) {
      super(A, 0)
    }
  }
  fj2.NotificationType0 = Tj2;
  class Pj2 extends HY {
    constructor(A, Q = YC.auto) {
      super(A, 1);
      this._parameterStructures = Q
    }
    get parameterStructures() {
      return this._parameterStructures
    }
  }
  fj2.NotificationType1 = Pj2;
  class jj2 extends HY {
    constructor(A) {
      super(A, 2)
    }
  }
  fj2.NotificationType2 = jj2;
  class Sj2 extends HY {
    constructor(A) {
      super(A, 3)
    }
  }
  fj2.NotificationType3 = Sj2;
  class _j2 extends HY {
    constructor(A) {
      super(A, 4)
    }
  }
  fj2.NotificationType4 = _j2;
  class kj2 extends HY {
    constructor(A) {
      super(A, 5)
    }
  }
  fj2.NotificationType5 = kj2;
  class yj2 extends HY {
    constructor(A) {
      super(A, 6)
    }
  }
  fj2.NotificationType6 = yj2;
  class xj2 extends HY {
    constructor(A) {
      super(A, 7)
    }
  }
  fj2.NotificationType7 = xj2;
  class vj2 extends HY {
    constructor(A) {
      super(A, 8)
    }
  }
  fj2.NotificationType8 = vj2;
  class bj2 extends HY {
    constructor(A) {
      super(A, 9)
    }
  }
  fj2.NotificationType9 = bj2;
  var Hj2;
  (function(A) {
    function Q(Z) {
      let I = Z;
      return I && q0A.string(I.method) && (q0A.string(I.id) || q0A.number(I.id))
    }
    A.isRequest = Q;

    function B(Z) {
      let I = Z;
      return I && q0A.string(I.method) && Z.id === void 0
    }
    A.isNotification = B;

    function G(Z) {
      let I = Z;
      return I && (I.result !== void 0 || !!I.error) && (q0A.string(I.id) || q0A.number(I.id) || I.id === null)
    }
    A.isResponse = G
  })(Hj2 || (fj2.Message = Hj2 = {}))
})
// @from(Start 11500068, End 11507464)
l60 = z((mj2) => {
  var gj2;
  Object.defineProperty(mj2, "__esModule", {
    value: !0
  });
  mj2.LRUCache = mj2.LinkedMap = mj2.Touch = void 0;
  var JC;
  (function(A) {
    A.None = 0, A.First = 1, A.AsOld = A.First, A.Last = 2, A.AsNew = A.Last
  })(JC || (mj2.Touch = JC = {}));
  class p60 {
    constructor() {
      this[gj2] = "LinkedMap", this._map = new Map, this._head = void 0, this._tail = void 0, this._size = 0, this._state = 0
    }
    clear() {
      this._map.clear(), this._head = void 0, this._tail = void 0, this._size = 0, this._state++
    }
    isEmpty() {
      return !this._head && !this._tail
    }
    get size() {
      return this._size
    }
    get first() {
      return this._head?.value
    }
    get last() {
      return this._tail?.value
    }
    has(A) {
      return this._map.has(A)
    }
    get(A, Q = JC.None) {
      let B = this._map.get(A);
      if (!B) return;
      if (Q !== JC.None) this.touch(B, Q);
      return B.value
    }
    set(A, Q, B = JC.None) {
      let G = this._map.get(A);
      if (G) {
        if (G.value = Q, B !== JC.None) this.touch(G, B)
      } else {
        switch (G = {
            key: A,
            value: Q,
            next: void 0,
            previous: void 0
          }, B) {
          case JC.None:
            this.addItemLast(G);
            break;
          case JC.First:
            this.addItemFirst(G);
            break;
          case JC.Last:
            this.addItemLast(G);
            break;
          default:
            this.addItemLast(G);
            break
        }
        this._map.set(A, G), this._size++
      }
      return this
    }
    delete(A) {
      return !!this.remove(A)
    }
    remove(A) {
      let Q = this._map.get(A);
      if (!Q) return;
      return this._map.delete(A), this.removeItem(Q), this._size--, Q.value
    }
    shift() {
      if (!this._head && !this._tail) return;
      if (!this._head || !this._tail) throw Error("Invalid list");
      let A = this._head;
      return this._map.delete(A.key), this.removeItem(A), this._size--, A.value
    }
    forEach(A, Q) {
      let B = this._state,
        G = this._head;
      while (G) {
        if (Q) A.bind(Q)(G.value, G.key, this);
        else A(G.value, G.key, this);
        if (this._state !== B) throw Error("LinkedMap got modified during iteration.");
        G = G.next
      }
    }
    keys() {
      let A = this._state,
        Q = this._head,
        B = {
          [Symbol.iterator]: () => {
            return B
          },
          next: () => {
            if (this._state !== A) throw Error("LinkedMap got modified during iteration.");
            if (Q) {
              let G = {
                value: Q.key,
                done: !1
              };
              return Q = Q.next, G
            } else return {
              value: void 0,
              done: !0
            }
          }
        };
      return B
    }
    values() {
      let A = this._state,
        Q = this._head,
        B = {
          [Symbol.iterator]: () => {
            return B
          },
          next: () => {
            if (this._state !== A) throw Error("LinkedMap got modified during iteration.");
            if (Q) {
              let G = {
                value: Q.value,
                done: !1
              };
              return Q = Q.next, G
            } else return {
              value: void 0,
              done: !0
            }
          }
        };
      return B
    }
    entries() {
      let A = this._state,
        Q = this._head,
        B = {
          [Symbol.iterator]: () => {
            return B
          },
          next: () => {
            if (this._state !== A) throw Error("LinkedMap got modified during iteration.");
            if (Q) {
              let G = {
                value: [Q.key, Q.value],
                done: !1
              };
              return Q = Q.next, G
            } else return {
              value: void 0,
              done: !0
            }
          }
        };
      return B
    } [(gj2 = Symbol.toStringTag, Symbol.iterator)]() {
      return this.entries()
    }
    trimOld(A) {
      if (A >= this.size) return;
      if (A === 0) {
        this.clear();
        return
      }
      let Q = this._head,
        B = this.size;
      while (Q && B > A) this._map.delete(Q.key), Q = Q.next, B--;
      if (this._head = Q, this._size = B, Q) Q.previous = void 0;
      this._state++
    }
    addItemFirst(A) {
      if (!this._head && !this._tail) this._tail = A;
      else if (!this._head) throw Error("Invalid list");
      else A.next = this._head, this._head.previous = A;
      this._head = A, this._state++
    }
    addItemLast(A) {
      if (!this._head && !this._tail) this._head = A;
      else if (!this._tail) throw Error("Invalid list");
      else A.previous = this._tail, this._tail.next = A;
      this._tail = A, this._state++
    }
    removeItem(A) {
      if (A === this._head && A === this._tail) this._head = void 0, this._tail = void 0;
      else if (A === this._head) {
        if (!A.next) throw Error("Invalid list");
        A.next.previous = void 0, this._head = A.next
      } else if (A === this._tail) {
        if (!A.previous) throw Error("Invalid list");
        A.previous.next = void 0, this._tail = A.previous
      } else {
        let {
          next: Q,
          previous: B
        } = A;
        if (!Q || !B) throw Error("Invalid list");
        Q.previous = B, B.next = Q
      }
      A.next = void 0, A.previous = void 0, this._state++
    }
    touch(A, Q) {
      if (!this._head || !this._tail) throw Error("Invalid list");
      if (Q !== JC.First && Q !== JC.Last) return;
      if (Q === JC.First) {
        if (A === this._head) return;
        let {
          next: B,
          previous: G
        } = A;
        if (A === this._tail) G.next = void 0, this._tail = G;
        else B.previous = G, G.next = B;
        A.previous = void 0, A.next = this._head, this._head.previous = A, this._head = A, this._state++
      } else if (Q === JC.Last) {
        if (A === this._tail) return;
        let {
          next: B,
          previous: G
        } = A;
        if (A === this._head) B.previous = void 0, this._head = B;
        else B.previous = G, G.next = B;
        A.next = void 0, A.previous = this._tail, this._tail.next = A, this._tail = A, this._state++
      }
    }
    toJSON() {
      let A = [];
      return this.forEach((Q, B) => {
        A.push([B, Q])
      }), A
    }
    fromJSON(A) {
      this.clear();
      for (let [Q, B] of A) this.set(Q, B)
    }
  }
  mj2.LinkedMap = p60;
  class uj2 extends p60 {
    constructor(A, Q = 1) {
      super();
      this._limit = A, this._ratio = Math.min(Math.max(0, Q), 1)
    }
    get limit() {
      return this._limit
    }
    set limit(A) {
      this._limit = A, this.checkTrim()
    }
    get ratio() {
      return this._ratio
    }
    set ratio(A) {
      this._ratio = Math.min(Math.max(0, A), 1), this.checkTrim()
    }
    get(A, Q = JC.AsNew) {
      return super.get(A, Q)
    }
    peek(A) {
      return super.get(A, JC.None)
    }
    set(A, Q) {
      return super.set(A, Q, JC.Last), this.checkTrim(), this
    }
    checkTrim() {
      if (this.size > this._limit) this.trimOld(Math.round(this._limit * this._ratio))
    }
  }
  mj2.LRUCache = uj2
})
// @from(Start 11507470, End 11507737)
ij2 = z((pj2) => {
  Object.defineProperty(pj2, "__esModule", {
    value: !0
  });
  pj2.Disposable = void 0;
  var cj2;
  (function(A) {
    function Q(B) {
      return {
        dispose: B
      }
    }
    A.create = Q
  })(cj2 || (pj2.Disposable = cj2 = {}))
})
// @from(Start 11507743, End 11508152)
Dn = z((nj2) => {
  Object.defineProperty(nj2, "__esModule", {
    value: !0
  });
  var i60;

  function n60() {
    if (i60 === void 0) throw Error("No runtime abstraction layer installed");
    return i60
  }(function(A) {
    function Q(B) {
      if (B === void 0) throw Error("No runtime abstraction layer provided");
      i60 = B
    }
    A.install = Q
  })(n60 || (n60 = {}));
  nj2.default = n60
})
// @from(Start 11508158, End 11510662)
GWA = z((rj2) => {
  Object.defineProperty(rj2, "__esModule", {
    value: !0
  });
  rj2.Emitter = rj2.Event = void 0;
  var Wg5 = Dn(),
    aj2;
  (function(A) {
    let Q = {
      dispose() {}
    };
    A.None = function() {
      return Q
    }
  })(aj2 || (rj2.Event = aj2 = {}));
  class sj2 {
    add(A, Q = null, B) {
      if (!this._callbacks) this._callbacks = [], this._contexts = [];
      if (this._callbacks.push(A), this._contexts.push(Q), Array.isArray(B)) B.push({
        dispose: () => this.remove(A, Q)
      })
    }
    remove(A, Q = null) {
      if (!this._callbacks) return;
      let B = !1;
      for (let G = 0, Z = this._callbacks.length; G < Z; G++)
        if (this._callbacks[G] === A)
          if (this._contexts[G] === Q) {
            this._callbacks.splice(G, 1), this._contexts.splice(G, 1);
            return
          } else B = !0;
      if (B) throw Error("When adding a listener with a context, you should remove it with the same context")
    }
    invoke(...A) {
      if (!this._callbacks) return [];
      let Q = [],
        B = this._callbacks.slice(0),
        G = this._contexts.slice(0);
      for (let Z = 0, I = B.length; Z < I; Z++) try {
        Q.push(B[Z].apply(G[Z], A))
      } catch (Y) {
        (0, Wg5.default)().console.error(Y)
      }
      return Q
    }
    isEmpty() {
      return !this._callbacks || this._callbacks.length === 0
    }
    dispose() {
      this._callbacks = void 0, this._contexts = void 0
    }
  }
  class e61 {
    constructor(A) {
      this._options = A
    }
    get event() {
      if (!this._event) this._event = (A, Q, B) => {
        if (!this._callbacks) this._callbacks = new sj2;
        if (this._options && this._options.onFirstListenerAdd && this._callbacks.isEmpty()) this._options.onFirstListenerAdd(this);
        this._callbacks.add(A, Q);
        let G = {
          dispose: () => {
            if (!this._callbacks) return;
            if (this._callbacks.remove(A, Q), G.dispose = e61._noop, this._options && this._options.onLastListenerRemove && this._callbacks.isEmpty()) this._options.onLastListenerRemove(this)
          }
        };
        if (Array.isArray(B)) B.push(G);
        return G
      };
      return this._event
    }
    fire(A) {
      if (this._callbacks) this._callbacks.invoke.call(this._callbacks, A)
    }
    dispose() {
      if (this._callbacks) this._callbacks.dispose(), this._callbacks = void 0
    }
  }
  rj2.Emitter = e61;
  e61._noop = function() {}
})
// @from(Start 11510668, End 11512505)
Q51 = z((ej2) => {
  Object.defineProperty(ej2, "__esModule", {
    value: !0
  });
  ej2.CancellationTokenSource = ej2.CancellationToken = void 0;
  var Vg5 = Dn(),
    Fg5 = BWA(),
    a60 = GWA(),
    A51;
  (function(A) {
    A.None = Object.freeze({
      isCancellationRequested: !1,
      onCancellationRequested: a60.Event.None
    }), A.Cancelled = Object.freeze({
      isCancellationRequested: !0,
      onCancellationRequested: a60.Event.None
    });

    function Q(B) {
      let G = B;
      return G && (G === A.None || G === A.Cancelled || Fg5.boolean(G.isCancellationRequested) && !!G.onCancellationRequested)
    }
    A.is = Q
  })(A51 || (ej2.CancellationToken = A51 = {}));
  var Kg5 = Object.freeze(function(A, Q) {
    let B = (0, Vg5.default)().timer.setTimeout(A.bind(Q), 0);
    return {
      dispose() {
        B.dispose()
      }
    }
  });
  class s60 {
    constructor() {
      this._isCancelled = !1
    }
    cancel() {
      if (!this._isCancelled) {
        if (this._isCancelled = !0, this._emitter) this._emitter.fire(void 0), this.dispose()
      }
    }
    get isCancellationRequested() {
      return this._isCancelled
    }
    get onCancellationRequested() {
      if (this._isCancelled) return Kg5;
      if (!this._emitter) this._emitter = new a60.Emitter;
      return this._emitter.event
    }
    dispose() {
      if (this._emitter) this._emitter.dispose(), this._emitter = void 0
    }
  }
  class tj2 {
    get token() {
      if (!this._token) this._token = new s60;
      return this._token
    }
    cancel() {
      if (!this._token) this._token = A51.Cancelled;
      else this._token.cancel()
    }
    dispose() {
      if (!this._token) this._token = A51.None;
      else if (this._token instanceof s60) this._token.dispose()
    }
  }
  ej2.CancellationTokenSource = tj2
})
// @from(Start 11512511, End 11514112)
JS2 = z((IS2) => {
  Object.defineProperty(IS2, "__esModule", {
    value: !0
  });
  IS2.SharedArrayReceiverStrategy = IS2.SharedArraySenderStrategy = void 0;
  var Hg5 = Q51(),
    gRA;
  (function(A) {
    A.Continue = 0, A.Cancelled = 1
  })(gRA || (gRA = {}));
  class QS2 {
    constructor() {
      this.buffers = new Map
    }
    enableCancellation(A) {
      if (A.id === null) return;
      let Q = new SharedArrayBuffer(4),
        B = new Int32Array(Q, 0, 1);
      B[0] = gRA.Continue, this.buffers.set(A.id, Q), A.$cancellationData = Q
    }
    async sendCancellation(A, Q) {
      let B = this.buffers.get(Q);
      if (B === void 0) return;
      let G = new Int32Array(B, 0, 1);
      Atomics.store(G, 0, gRA.Cancelled)
    }
    cleanup(A) {
      this.buffers.delete(A)
    }
    dispose() {
      this.buffers.clear()
    }
  }
  IS2.SharedArraySenderStrategy = QS2;
  class BS2 {
    constructor(A) {
      this.data = new Int32Array(A, 0, 1)
    }
    get isCancellationRequested() {
      return Atomics.load(this.data, 0) === gRA.Cancelled
    }
    get onCancellationRequested() {
      throw Error("Cancellation over SharedArrayBuffer doesn't support cancellation events")
    }
  }
  class GS2 {
    constructor(A) {
      this.token = new BS2(A)
    }
    cancel() {}
    dispose() {}
  }
  class ZS2 {
    constructor() {
      this.kind = "request"
    }
    createCancellationTokenSource(A) {
      let Q = A.$cancellationData;
      if (Q === void 0) return new Hg5.CancellationTokenSource;
      return new GS2(Q)
    }
  }
  IS2.SharedArrayReceiverStrategy = ZS2
})
// @from(Start 11514118, End 11515459)
r60 = z((XS2) => {
  Object.defineProperty(XS2, "__esModule", {
    value: !0
  });
  XS2.Semaphore = void 0;
  var Eg5 = Dn();
  class WS2 {
    constructor(A = 1) {
      if (A <= 0) throw Error("Capacity must be greater than 0");
      this._capacity = A, this._active = 0, this._waiting = []
    }
    lock(A) {
      return new Promise((Q, B) => {
        this._waiting.push({
          thunk: A,
          resolve: Q,
          reject: B
        }), this.runNext()
      })
    }
    get active() {
      return this._active
    }
    runNext() {
      if (this._waiting.length === 0 || this._active === this._capacity) return;
      (0, Eg5.default)().timer.setImmediate(() => this.doRunNext())
    }
    doRunNext() {
      if (this._waiting.length === 0 || this._active === this._capacity) return;
      let A = this._waiting.shift();
      if (this._active++, this._active > this._capacity) throw Error("To many thunks active");
      try {
        let Q = A.thunk();
        if (Q instanceof Promise) Q.then((B) => {
          this._active--, A.resolve(B), this.runNext()
        }, (B) => {
          this._active--, A.reject(B), this.runNext()
        });
        else this._active--, A.resolve(Q), this.runNext()
      } catch (Q) {
        this._active--, A.reject(Q), this.runNext()
      }
    }
  }
  XS2.Semaphore = WS2
})
// @from(Start 11515465, End 11520553)
CS2 = z((DS2) => {
  Object.defineProperty(DS2, "__esModule", {
    value: !0
  });
  DS2.ReadableStreamMessageReader = DS2.AbstractMessageReader = DS2.MessageReader = void 0;
  var t60 = Dn(),
    ZWA = BWA(),
    o60 = GWA(),
    zg5 = r60(),
    FS2;
  (function(A) {
    function Q(B) {
      let G = B;
      return G && ZWA.func(G.listen) && ZWA.func(G.dispose) && ZWA.func(G.onError) && ZWA.func(G.onClose) && ZWA.func(G.onPartialMessage)
    }
    A.is = Q
  })(FS2 || (DS2.MessageReader = FS2 = {}));
  class A50 {
    constructor() {
      this.errorEmitter = new o60.Emitter, this.closeEmitter = new o60.Emitter, this.partialMessageEmitter = new o60.Emitter
    }
    dispose() {
      this.errorEmitter.dispose(), this.closeEmitter.dispose()
    }
    get onError() {
      return this.errorEmitter.event
    }
    fireError(A) {
      this.errorEmitter.fire(this.asError(A))
    }
    get onClose() {
      return this.closeEmitter.event
    }
    fireClose() {
      this.closeEmitter.fire(void 0)
    }
    get onPartialMessage() {
      return this.partialMessageEmitter.event
    }
    firePartialMessage(A) {
      this.partialMessageEmitter.fire(A)
    }
    asError(A) {
      if (A instanceof Error) return A;
      else return Error(`Reader received error. Reason: ${ZWA.string(A.message)?A.message:"unknown"}`)
    }
  }
  DS2.AbstractMessageReader = A50;
  var e60;
  (function(A) {
    function Q(B) {
      let G, Z, I, Y = new Map,
        J, W = new Map;
      if (B === void 0 || typeof B === "string") G = B ?? "utf-8";
      else {
        if (G = B.charset ?? "utf-8", B.contentDecoder !== void 0) I = B.contentDecoder, Y.set(I.name, I);
        if (B.contentDecoders !== void 0)
          for (let X of B.contentDecoders) Y.set(X.name, X);
        if (B.contentTypeDecoder !== void 0) J = B.contentTypeDecoder, W.set(J.name, J);
        if (B.contentTypeDecoders !== void 0)
          for (let X of B.contentTypeDecoders) W.set(X.name, X)
      }
      if (J === void 0) J = (0, t60.default)().applicationJson.decoder, W.set(J.name, J);
      return {
        charset: G,
        contentDecoder: I,
        contentDecoders: Y,
        contentTypeDecoder: J,
        contentTypeDecoders: W
      }
    }
    A.fromOptions = Q
  })(e60 || (e60 = {}));
  class KS2 extends A50 {
    constructor(A, Q) {
      super();
      this.readable = A, this.options = e60.fromOptions(Q), this.buffer = (0, t60.default)().messageBuffer.create(this.options.charset), this._partialMessageTimeout = 1e4, this.nextMessageLength = -1, this.messageToken = 0, this.readSemaphore = new zg5.Semaphore(1)
    }
    set partialMessageTimeout(A) {
      this._partialMessageTimeout = A
    }
    get partialMessageTimeout() {
      return this._partialMessageTimeout
    }
    listen(A) {
      this.nextMessageLength = -1, this.messageToken = 0, this.partialMessageTimer = void 0, this.callback = A;
      let Q = this.readable.onData((B) => {
        this.onData(B)
      });
      return this.readable.onError((B) => this.fireError(B)), this.readable.onClose(() => this.fireClose()), Q
    }
    onData(A) {
      try {
        this.buffer.append(A);
        while (!0) {
          if (this.nextMessageLength === -1) {
            let B = this.buffer.tryReadHeaders(!0);
            if (!B) return;
            let G = B.get("content-length");
            if (!G) {
              this.fireError(Error(`Header must provide a Content-Length property.
${JSON.stringify(Object.fromEntries(B))}`));
              return
            }
            let Z = parseInt(G);
            if (isNaN(Z)) {
              this.fireError(Error(`Content-Length value must be a number. Got ${G}`));
              return
            }
            this.nextMessageLength = Z
          }
          let Q = this.buffer.tryReadBody(this.nextMessageLength);
          if (Q === void 0) {
            this.setPartialMessageTimer();
            return
          }
          this.clearPartialMessageTimer(), this.nextMessageLength = -1, this.readSemaphore.lock(async () => {
            let B = this.options.contentDecoder !== void 0 ? await this.options.contentDecoder.decode(Q) : Q,
              G = await this.options.contentTypeDecoder.decode(B, this.options);
            this.callback(G)
          }).catch((B) => {
            this.fireError(B)
          })
        }
      } catch (Q) {
        this.fireError(Q)
      }
    }
    clearPartialMessageTimer() {
      if (this.partialMessageTimer) this.partialMessageTimer.dispose(), this.partialMessageTimer = void 0
    }
    setPartialMessageTimer() {
      if (this.clearPartialMessageTimer(), this._partialMessageTimeout <= 0) return;
      this.partialMessageTimer = (0, t60.default)().timer.setTimeout((A, Q) => {
        if (this.partialMessageTimer = void 0, A === this.messageToken) this.firePartialMessage({
          messageToken: A,
          waitingTime: Q
        }), this.setPartialMessageTimer()
      }, this._partialMessageTimeout, this.messageToken, this._partialMessageTimeout)
    }
  }
  DS2.ReadableStreamMessageReader = KS2
})
// @from(Start 11520559, End 11523439)
LS2 = z((qS2) => {
  Object.defineProperty(qS2, "__esModule", {
    value: !0
  });
  qS2.WriteableStreamMessageWriter = qS2.AbstractMessageWriter = qS2.MessageWriter = void 0;
  var ES2 = Dn(),
    uRA = BWA(),
    wg5 = r60(),
    zS2 = GWA(),
    qg5 = "Content-Length: ",
    US2 = `\r
`,
    $S2;
  (function(A) {
    function Q(B) {
      let G = B;
      return G && uRA.func(G.dispose) && uRA.func(G.onClose) && uRA.func(G.onError) && uRA.func(G.write)
    }
    A.is = Q
  })($S2 || (qS2.MessageWriter = $S2 = {}));
  class B50 {
    constructor() {
      this.errorEmitter = new zS2.Emitter, this.closeEmitter = new zS2.Emitter
    }
    dispose() {
      this.errorEmitter.dispose(), this.closeEmitter.dispose()
    }
    get onError() {
      return this.errorEmitter.event
    }
    fireError(A, Q, B) {
      this.errorEmitter.fire([this.asError(A), Q, B])
    }
    get onClose() {
      return this.closeEmitter.event
    }
    fireClose() {
      this.closeEmitter.fire(void 0)
    }
    asError(A) {
      if (A instanceof Error) return A;
      else return Error(`Writer received error. Reason: ${uRA.string(A.message)?A.message:"unknown"}`)
    }
  }
  qS2.AbstractMessageWriter = B50;
  var Q50;
  (function(A) {
    function Q(B) {
      if (B === void 0 || typeof B === "string") return {
        charset: B ?? "utf-8",
        contentTypeEncoder: (0, ES2.default)().applicationJson.encoder
      };
      else return {
        charset: B.charset ?? "utf-8",
        contentEncoder: B.contentEncoder,
        contentTypeEncoder: B.contentTypeEncoder ?? (0, ES2.default)().applicationJson.encoder
      }
    }
    A.fromOptions = Q
  })(Q50 || (Q50 = {}));
  class wS2 extends B50 {
    constructor(A, Q) {
      super();
      this.writable = A, this.options = Q50.fromOptions(Q), this.errorCount = 0, this.writeSemaphore = new wg5.Semaphore(1), this.writable.onError((B) => this.fireError(B)), this.writable.onClose(() => this.fireClose())
    }
    async write(A) {
      return this.writeSemaphore.lock(async () => {
        return this.options.contentTypeEncoder.encode(A, this.options).then((B) => {
          if (this.options.contentEncoder !== void 0) return this.options.contentEncoder.encode(B);
          else return B
        }).then((B) => {
          let G = [];
          return G.push(qg5, B.byteLength.toString(), US2), G.push(US2), this.doWrite(A, G, B)
        }, (B) => {
          throw this.fireError(B), B
        })
      })
    }
    async doWrite(A, Q, B) {
      try {
        return await this.writable.write(Q.join(""), "ascii"), this.writable.write(B)
      } catch (G) {
        return this.handleError(G, A), Promise.reject(G)
      }
    }
    handleError(A, Q) {
      this.errorCount++, this.fireError(A, Q, this.errorCount)
    }
    end() {
      this.writable.end()
    }
  }
  qS2.WriteableStreamMessageWriter = wS2
})
// @from(Start 11523445, End 11526545)
TS2 = z((OS2) => {
  Object.defineProperty(OS2, "__esModule", {
    value: !0
  });
  OS2.AbstractMessageBuffer = void 0;
  var Mg5 = 13,
    Og5 = 10,
    Rg5 = `\r
`;
  class MS2 {
    constructor(A = "utf-8") {
      this._encoding = A, this._chunks = [], this._totalLength = 0
    }
    get encoding() {
      return this._encoding
    }
    append(A) {
      let Q = typeof A === "string" ? this.fromString(A, this._encoding) : A;
      this._chunks.push(Q), this._totalLength += Q.byteLength
    }
    tryReadHeaders(A = !1) {
      if (this._chunks.length === 0) return;
      let Q = 0,
        B = 0,
        G = 0,
        Z = 0;
      A: while (B < this._chunks.length) {
        let W = this._chunks[B];
        G = 0;
        Q: while (G < W.length) {
          switch (W[G]) {
            case Mg5:
              switch (Q) {
                case 0:
                  Q = 1;
                  break;
                case 2:
                  Q = 3;
                  break;
                default:
                  Q = 0
              }
              break;
            case Og5:
              switch (Q) {
                case 1:
                  Q = 2;
                  break;
                case 3:
                  Q = 4, G++;
                  break A;
                default:
                  Q = 0
              }
              break;
            default:
              Q = 0
          }
          G++
        }
        Z += W.byteLength, B++
      }
      if (Q !== 4) return;
      let I = this._read(Z + G),
        Y = new Map,
        J = this.toString(I, "ascii").split(Rg5);
      if (J.length < 2) return Y;
      for (let W = 0; W < J.length - 2; W++) {
        let X = J[W],
          V = X.indexOf(":");
        if (V === -1) throw Error(`Message header must separate key and value using ':'
${X}`);
        let F = X.substr(0, V),
          K = X.substr(V + 1).trim();
        Y.set(A ? F.toLowerCase() : F, K)
      }
      return Y
    }
    tryReadBody(A) {
      if (this._totalLength < A) return;
      return this._read(A)
    }
    get numberOfBytes() {
      return this._totalLength
    }
    _read(A) {
      if (A === 0) return this.emptyBuffer();
      if (A > this._totalLength) throw Error("Cannot read so many bytes!");
      if (this._chunks[0].byteLength === A) {
        let Z = this._chunks[0];
        return this._chunks.shift(), this._totalLength -= A, this.asNative(Z)
      }
      if (this._chunks[0].byteLength > A) {
        let Z = this._chunks[0],
          I = this.asNative(Z, A);
        return this._chunks[0] = Z.slice(A), this._totalLength -= A, I
      }
      let Q = this.allocNative(A),
        B = 0,
        G = 0;
      while (A > 0) {
        let Z = this._chunks[G];
        if (Z.byteLength > A) {
          let I = Z.slice(0, A);
          Q.set(I, B), B += A, this._chunks[G] = Z.slice(A), this._totalLength -= A, A -= A
        } else Q.set(Z, B), B += Z.byteLength, this._chunks.shift(), this._totalLength -= Z.byteLength, A -= Z.byteLength
      }
      return Q
    }
  }
  OS2.AbstractMessageBuffer = MS2
})