
// @from(Start 13904554, End 13913491)
async function* qa({
  hookInput: A,
  toolUseID: Q,
  matchQuery: B,
  signal: G,
  timeoutMs: Z = ZN,
  toolUseContext: I,
  messages: Y
}) {
  if (l0().disableAllHooks) return;
  let J = A.hook_event_name,
    W = B ? `${J}:${B}` : J;
  if (rX9()) {
    g(`Skipping ${W} hook execution - workspace trust not accepted`);
    return
  }
  let X = I ? await I.getAppState() : void 0,
    V = _V0(X, J, A);
  if (V.length === 0) return;
  if (G?.aborted) return;
  GA("tengu_run_hook", {
    hookName: W,
    numCommands: V.length
  });
  for (let H of V) yield {
    message: {
      type: "progress",
      data: {
        type: "hook_progress",
        hookEvent: J,
        hookName: W,
        command: hE(H),
        promptText: H.type === "prompt" ? H.prompt : void 0,
        statusMessage: "statusMessage" in H ? H.statusMessage : void 0
      },
      parentToolUseID: Q,
      toolUseID: Q,
      timestamp: new Date().toISOString(),
      uuid: HVA()
    }
  };
  let F = V.map(async function*(H, C) {
      if (H.type === "callback") {
        let w = H.timeout ? H.timeout * 1000 : Z,
          {
            signal: N,
            cleanup: R
          } = ck(AbortSignal.timeout(w), G);
        yield Qy3({
          toolUseID: Q,
          hook: H,
          hookEvent: J,
          hookInput: A,
          signal: N,
          hookIndex: C
        }).finally(R);
        return
      }
      if (H.type === "function") {
        if (!Y) {
          yield {
            message: l9({
              type: "hook_error_during_execution",
              hookName: W,
              toolUseID: Q,
              hookEvent: J,
              content: "Messages not provided for function hook"
            }),
            outcome: "non_blocking_error",
            hook: H
          };
          return
        }
        yield Ay3({
          hook: H,
          messages: Y,
          hookName: W,
          toolUseID: Q,
          hookEvent: J,
          timeoutMs: Z,
          signal: G
        });
        return
      }
      let E = H.timeout ? H.timeout * 1000 : Z,
        {
          signal: U,
          cleanup: q
        } = ck(AbortSignal.timeout(E), G);
      try {
        let w;
        try {
          w = JSON.stringify(A)
        } catch (v) {
          AA(Error(`Failed to stringify hook ${W} input`, {
            cause: v
          })), yield {
            message: l9({
              type: "hook_error_during_execution",
              hookName: W,
              toolUseID: Q,
              hookEvent: J,
              content: `Failed to prepare hook input: ${v instanceof Error?v.message:String(v)}`
            }),
            outcome: "non_blocking_error",
            hook: H
          };
          return
        }
        if (H.type === "prompt") {
          if (!I) throw Error("ToolUseContext is required for prompt hooks. This is a bug.");
          yield await eP2(H, W, J, w, U, I, Y, Q), q?.();
          return
        }
        if (H.type === "agent") {
          if (!I) throw Error("ToolUseContext is required for agent hooks. This is a bug.");
          if (!Y) throw Error("Messages are required for agent hooks. This is a bug.");
          yield await aX9(H, W, J, w, U, I, Q, Y), q?.();
          return
        }
        let N = await SV0(H, J, W, w, U, C);
        if (q?.(), N.aborted) {
          yield {
            message: l9({
              type: "hook_cancelled",
              hookName: W,
              toolUseID: Q,
              hookEvent: J
            }),
            outcome: "cancelled",
            hook: H
          };
          return
        }
        let {
          json: R,
          plainText: T,
          validationError: y
        } = oX9(N.stdout);
        if (y) {
          yield {
            message: l9({
              type: "hook_non_blocking_error",
              hookName: W,
              toolUseID: Q,
              hookEvent: J,
              stderr: `JSON validation failed: ${y}`,
              stdout: N.stdout,
              exitCode: 1
            }),
            outcome: "non_blocking_error",
            hook: H
          };
          return
        }
        if (R) {
          if (zYA(R)) {
            yield {
              outcome: "success",
              hook: H
            };
            return
          }
          let v = tX9({
            json: R,
            command: H.type === "command" ? H.command : "prompt",
            hookName: W,
            toolUseID: Q,
            hookEvent: J,
            expectedHookEvent: J,
            stdout: N.stdout,
            stderr: N.stderr,
            exitCode: N.status
          });
          if (kZ2(R) && !R.suppressOutput && T && N.status === 0) {
            let x = `${tA.bold(W)} completed`;
            yield {
              ...v,
              message: v.message || l9({
                type: "hook_success",
                hookName: W,
                toolUseID: Q,
                hookEvent: J,
                content: x,
                stdout: N.stdout,
                stderr: N.stderr,
                exitCode: N.status
              }),
              outcome: "success",
              hook: H
            };
            return
          }
          yield {
            ...v,
            outcome: "success",
            hook: H
          };
          return
        }
        if (N.status === 0) {
          yield {
            message: l9({
              type: "hook_success",
              hookName: W,
              toolUseID: Q,
              hookEvent: J,
              content: N.stdout.trim(),
              stdout: N.stdout,
              stderr: N.stderr,
              exitCode: N.status
            }),
            outcome: "success",
            hook: H
          };
          return
        }
        if (N.status === 2) {
          yield {
            blockingError: {
              blockingError: `[${H.command}]: ${N.stderr||"No stderr output"}`,
              command: H.command
            },
            outcome: "blocking",
            hook: H
          };
          return
        }
        yield {
          message: l9({
            type: "hook_non_blocking_error",
            hookName: W,
            toolUseID: Q,
            hookEvent: J,
            stderr: `Failed with non-blocking status code: ${N.stderr.trim()||"No stderr output"}`,
            stdout: N.stdout,
            exitCode: N.status
          }),
          outcome: "non_blocking_error",
          hook: H
        };
        return
      } catch (w) {
        q?.();
        let N = w instanceof Error ? w.message : String(w);
        yield {
          message: l9({
            type: "hook_non_blocking_error",
            hookName: W,
            toolUseID: Q,
            hookEvent: J,
            stderr: `Failed to run: ${N}`,
            stdout: "",
            exitCode: 1
          }),
          outcome: "non_blocking_error",
          hook: H
        };
        return
      }
    }),
    K = {
      success: 0,
      blocking: 0,
      non_blocking_error: 0,
      cancelled: 0
    },
    D;
  for await (let H of SYA(F)) {
    if (K[H.outcome]++, H.preventContinuation) yield {
      preventContinuation: !0,
      stopReason: H.stopReason
    };
    if (H.blockingError) yield {
      blockingError: H.blockingError
    };
    if (H.message) yield {
      message: H.message
    };
    if (H.systemMessage) yield {
      message: l9({
        type: "hook_system_message",
        content: H.systemMessage,
        hookName: W,
        toolUseID: Q,
        hookEvent: J
      })
    };
    if (H.additionalContext) yield {
      additionalContexts: [H.additionalContext]
    };
    if (H.updatedMCPToolOutput) yield {
      updatedMCPToolOutput: H.updatedMCPToolOutput
    };
    if (H.permissionBehavior) switch (H.permissionBehavior) {
      case "deny":
        D = "deny";
        break;
      case "ask":
        if (D !== "deny") D = "ask";
        break;
      case "allow":
        if (!D) D = "allow";
        break;
      case "passthrough":
        break
    }
    if (D !== void 0) yield {
      permissionBehavior: D,
      hookPermissionDecisionReason: H.hookPermissionDecisionReason,
      updatedInput: H.updatedInput && H.permissionBehavior === "allow" ? H.updatedInput : void 0
    };
    if (H.permissionRequestResult) yield {
      permissionRequestResult: H.permissionRequestResult
    };
    if (X && H.hook.type !== "callback") {
      let C = e1(),
        U = NZ2(X, C, J, B ?? "", H.hook);
      if (U?.onHookSuccess && H.outcome === "success") try {
        U.onHookSuccess(H.hook, H)
      } catch (q) {
        AA(Error("Session hook success callback failed", {
          cause: q
        }))
      }
    }
  }
  GA("tengu_repl_hook_finished", {
    hookName: W,
    numCommands: V.length,
    numSuccess: K.success,
    numBlocking: K.blocking,
    numNonBlockingError: K.non_blocking_error,
    numCancelled: K.cancelled
  })
}
// @from(Start 13913492, End 13916985)
async function kV0({
  getAppState: A,
  hookInput: Q,
  matchQuery: B,
  signal: G,
  timeoutMs: Z = ZN
}) {
  let I = Q.hook_event_name,
    Y = B ? `${I}:${B}` : I;
  if (l0().disableAllHooks) return g(`Skipping hooks for ${Y} due to 'disableAllHooks' setting`), [];
  if (rX9()) return g(`Skipping ${Y} hook execution - workspace trust not accepted`), [];
  let J = A ? await A() : void 0,
    W = _V0(J, I, Q);
  if (W.length === 0) return [];
  if (G?.aborted) return [];
  GA("tengu_run_hook", {
    hookName: Y,
    numCommands: W.length
  });
  let X;
  try {
    X = JSON.stringify(Q)
  } catch (F) {
    return AA(F instanceof Error ? F : Error(String(F))), []
  }
  let V = W.map(async (F, K) => {
    if (F.type === "callback") {
      let E = F.timeout ? F.timeout * 1000 : Z,
        {
          signal: U,
          cleanup: q
        } = ck(AbortSignal.timeout(E), G);
      try {
        let w = HVA(),
          N = await F.callback(Q, w, U, K);
        if (q?.(), zYA(N)) return g(`${Y} [callback] returned async response, returning empty output`), {
          command: "callback",
          succeeded: !0,
          output: ""
        };
        let R = N.systemMessage || "";
        return g(`${Y} [callback] completed successfully`), {
          command: "callback",
          succeeded: !0,
          output: R
        }
      } catch (w) {
        q?.();
        let N = w instanceof Error ? w.message : String(w);
        return g(`${Y} [callback] failed to run: ${N}`, {
          level: "error"
        }), {
          command: "callback",
          succeeded: !1,
          output: N
        }
      }
    }
    if (F.type === "prompt") return {
      command: F.prompt,
      succeeded: !1,
      output: "Prompt stop hooks are not yet supported outside REPL"
    };
    if (F.type === "agent") return {
      command: F.prompt([]),
      succeeded: !1,
      output: "Agent stop hooks are not yet supported outside REPL"
    };
    if (F.type === "function") return AA(Error(`Function hook reached executeHooksOutsideREPL for ${I}. Function hooks should only be used in REPL context (Stop hooks).`)), {
      command: "function",
      succeeded: !1,
      output: "Internal error: function hook executed outside REPL context"
    };
    let D = F.timeout ? F.timeout * 1000 : Z,
      {
        signal: H,
        cleanup: C
      } = ck(AbortSignal.timeout(D), G);
    try {
      let E = await SV0(F, I, Y, X, H, K);
      if (C?.(), E.aborted) return g(`${Y} [${F.command}] cancelled`), {
        command: F.command,
        succeeded: !1,
        output: "Hook cancelled"
      };
      g(`${Y} [${F.command}] completed with status ${E.status}`);
      let {
        json: U,
        validationError: q
      } = oX9(E.stdout);
      if (q) throw Sj(`${tA.bold(Y)} [${F.command}] ${tA.yellow("Hook JSON output validation failed")}`), Error(q);
      if (U && !zYA(U)) {
        if (g(`Parsed JSON output from hook: ${JSON.stringify(U)}`), U.systemMessage) L9(U.systemMessage)
      }
      let w = E.status === 0 ? E.stdout || "" : E.stderr || "";
      return {
        command: F.command,
        succeeded: E.status === 0,
        output: w
      }
    } catch (E) {
      C?.();
      let U = E instanceof Error ? E.message : String(E);
      return g(`${Y} [${F.command}] failed to run: ${U}`, {
        level: "error"
      }), {
        command: F.command,
        succeeded: !1,
        output: U
      }
    }
  });
  return await Promise.all(V)
}
// @from(Start 13916986, End 13917336)
async function* OV0(A, Q, B, G, Z, I, Y = ZN) {
  g(`executePreToolHooks called for tool: ${A}`);
  let J = {
    ...tE(Z),
    hook_event_name: "PreToolUse",
    tool_name: A,
    tool_input: B,
    tool_use_id: Q
  };
  yield* qa({
    hookInput: J,
    toolUseID: Q,
    matchQuery: A,
    signal: I,
    timeoutMs: Y,
    toolUseContext: G
  })
}
// @from(Start 13917337, End 13917663)
async function* RV0(A, Q, B, G, Z, I, Y, J = ZN) {
  let W = {
    ...tE(I),
    hook_event_name: "PostToolUse",
    tool_name: A,
    tool_input: B,
    tool_response: G,
    tool_use_id: Q
  };
  yield* qa({
    hookInput: W,
    toolUseID: Q,
    matchQuery: A,
    signal: Y,
    timeoutMs: J,
    toolUseContext: Z
  })
}
// @from(Start 13917664, End 13918013)
async function* TV0(A, Q, B, G, Z, I, Y, J, W = ZN) {
  let X = {
    ...tE(Y),
    hook_event_name: "PostToolUseFailure",
    tool_name: A,
    tool_input: B,
    tool_use_id: Q,
    error: G,
    is_interrupt: I
  };
  yield* qa({
    hookInput: X,
    toolUseID: Q,
    matchQuery: A,
    signal: J,
    timeoutMs: W,
    toolUseContext: Z
  })
}
// @from(Start 13918014, End 13918313)
async function B60(A, Q = ZN) {
  let {
    message: B,
    title: G,
    notificationType: Z
  } = A, I = {
    ...tE(void 0),
    hook_event_name: "Notification",
    message: B,
    title: G,
    notification_type: Z
  };
  await kV0({
    hookInput: I,
    timeoutMs: Q,
    matchQuery: Z
  })
}
// @from(Start 13918314, End 13918722)
async function* PV0(A, Q, B = ZN, G = !1, Z, I, Y) {
  let J = Z ? {
    ...tE(A),
    hook_event_name: "SubagentStop",
    stop_hook_active: G,
    agent_id: Z,
    agent_transcript_path: DVA(Z)
  } : {
    ...tE(A),
    hook_event_name: "Stop",
    stop_hook_active: G
  };
  yield* qa({
    hookInput: J,
    toolUseID: HVA(),
    signal: Q,
    timeoutMs: B,
    toolUseContext: I,
    messages: Y
  })
}
// @from(Start 13918723, End 13918979)
async function* k60(A, Q, B) {
  let G = {
    ...tE(Q),
    hook_event_name: "UserPromptSubmit",
    prompt: A
  };
  yield* qa({
    hookInput: G,
    toolUseID: HVA(),
    signal: B.abortController.signal,
    timeoutMs: ZN,
    toolUseContext: B
  })
}
// @from(Start 13918980, End 13919220)
async function* WQ0(A, Q, B, G = ZN) {
  let Z = {
    ...tE(void 0, Q),
    hook_event_name: "SessionStart",
    source: A
  };
  yield* qa({
    hookInput: Z,
    toolUseID: HVA(),
    matchQuery: A,
    signal: B,
    timeoutMs: G
  })
}
// @from(Start 13919221, End 13919480)
async function* rX0(A, Q, B, G = ZN) {
  let Z = {
    ...tE(void 0),
    hook_event_name: "SubagentStart",
    agent_id: A,
    agent_type: Q
  };
  yield* qa({
    hookInput: Z,
    toolUseID: HVA(),
    matchQuery: Q,
    signal: B,
    timeoutMs: G
  })
}
// @from(Start 13919481, End 13920425)
async function FQ0(A, Q, B = ZN) {
  let G = {
      ...tE(void 0),
      hook_event_name: "PreCompact",
      trigger: A.trigger,
      custom_instructions: A.customInstructions
    },
    Z = await kV0({
      hookInput: G,
      matchQuery: A.trigger,
      signal: Q,
      timeoutMs: B
    });
  if (Z.length === 0) return {};
  let I = Z.filter((J) => J.succeeded && J.output.trim().length > 0).map((J) => J.output.trim()),
    Y = [];
  for (let J of Z)
    if (J.succeeded)
      if (J.output.trim()) Y.push(`PreCompact [${J.command}] completed successfully: ${J.output.trim()}`);
      else Y.push(`PreCompact [${J.command}] completed successfully`);
  else if (J.output.trim()) Y.push(`PreCompact [${J.command}] failed: ${J.output.trim()}`);
  else Y.push(`PreCompact [${J.command}] failed`);
  return {
    newCustomInstructions: I.length > 0 ? I.join(`

`) : void 0,
    userDisplayMessage: Y.length > 0 ? Y.join(`
`) : void 0
  }
}
// @from(Start 13920426, End 13920799)
async function yV0(A, Q) {
  let {
    getAppState: B,
    setAppState: G,
    signal: Z,
    timeoutMs: I = ZN
  } = Q || {}, Y = {
    ...tE(void 0),
    hook_event_name: "SessionEnd",
    reason: A
  };
  if (await kV0({
      getAppState: B,
      hookInput: Y,
      matchQuery: A,
      signal: Z,
      timeoutMs: I
    }), G) {
    let J = e1();
    o21(G, J)
  }
}
// @from(Start 13920800, End 13921181)
async function* mW0(A, Q, B, G, Z, I, Y, J = ZN) {
  g(`executePermissionRequestHooks called for tool: ${A}`);
  let W = {
    ...tE(Z),
    hook_event_name: "PermissionRequest",
    tool_name: A,
    tool_input: B,
    permission_suggestions: I
  };
  yield* qa({
    hookInput: W,
    toolUseID: Q,
    matchQuery: A,
    signal: Y,
    timeoutMs: J,
    toolUseContext: G
  })
}
// @from(Start 13921182, End 13921749)
async function cJ0(A, Q, B = 5000) {
  let G = l0(),
    Z = G?.statusLine;
  if (G?.disableAllHooks === !0) return;
  if (!Z || Z.type !== "command") return;
  let I = Q || AbortSignal.timeout(B);
  try {
    let Y = JSON.stringify(A),
      J = await SV0(Z, "StatusLine", "statusLine", Y, I);
    if (J.aborted) return;
    if (J.status === 0) {
      let W = J.stdout.trim().split(`
`).flatMap((X) => X.trim() || []).join(`
`);
      if (W) return W
    }
    return
  } catch (Y) {
    g(`Status hook failed: ${Y}`, {
      level: "error"
    });
    return
  }
}
// @from(Start 13921750, End 13923148)
async function Ay3({
  hook: A,
  messages: Q,
  hookName: B,
  toolUseID: G,
  hookEvent: Z,
  timeoutMs: I,
  signal: Y
}) {
  let J = A.timeout ?? I,
    {
      signal: W,
      cleanup: X
    } = ck(AbortSignal.timeout(J), Y);
  try {
    if (W.aborted) return X(), {
      outcome: "cancelled",
      hook: A
    };
    let V = await new Promise((F, K) => {
      let D = () => K(Error("Function hook cancelled"));
      W.addEventListener("abort", D), Promise.resolve(A.callback(Q, W)).then((H) => {
        W.removeEventListener("abort", D), F(H)
      }).catch((H) => {
        W.removeEventListener("abort", D), K(H)
      })
    });
    if (X(), V) return {
      outcome: "success",
      hook: A
    };
    return {
      blockingError: {
        blockingError: A.errorMessage,
        command: "function"
      },
      outcome: "blocking",
      hook: A
    }
  } catch (V) {
    if (X(), V instanceof Error && (V.message === "Function hook cancelled" || V.name === "AbortError")) return {
      outcome: "cancelled",
      hook: A
    };
    return AA(V instanceof Error ? V : Error(String(V))), {
      message: l9({
        type: "hook_error_during_execution",
        hookName: B,
        toolUseID: G,
        hookEvent: Z,
        content: V instanceof Error ? V.message : "Function hook execution error"
      }),
      outcome: "non_blocking_error",
      hook: A
    }
  }
}
// @from(Start 13923149, End 13923649)
async function Qy3({
  toolUseID: A,
  hook: Q,
  hookEvent: B,
  hookInput: G,
  signal: Z,
  hookIndex: I
}) {
  let Y = await Q.callback(G, A, Z, I);
  if (zYA(Y)) return {
    outcome: "success",
    hook: Q
  };
  return {
    ...tX9({
      json: Y,
      command: "callback",
      hookName: `${B}:Callback`,
      toolUseID: A,
      hookEvent: B,
      expectedHookEvent: B,
      stdout: void 0,
      stderr: void 0,
      exitCode: void 0
    }),
    outcome: "success",
    hook: Q
  }
}
// @from(Start 13923654, End 13923664)
ZN = 60000
// @from(Start 13923670, End 13923872)
YO = L(() => {
  fu1();
  U2();
  hu1();
  D$A();
  _0();
  jQ();
  CYA();
  S7();
  MB();
  q0();
  k00();
  F9();
  dk();
  V0();
  g1();
  B91();
  y00();
  IO();
  _i();
  Aj2();
  sX9();
  jMA()
})
// @from(Start 13923875, End 13924045)
function By3() {
  try {
    if (process.stdin.isTTY && typeof process.stdin.setRawMode === "function") process.stdin.setRawMode(!1), process.stdin.unref()
  } catch {}
}
// @from(Start 13924047, End 13924228)
function l5(A = 0, Q = "other", B) {
  process.exitCode = A, v6(A, Q, B).catch((G) => {
    g(`Graceful shutdown failed: ${G}`, {
      level: "error"
    }), process.exit(A)
  })
}
// @from(Start 13924229, End 13924719)
async function v6(A = 0, Q = "other", B) {
  process.exitCode = A, By3();
  try {
    let {
      executeSessionEndHooks: G
    } = await Promise.resolve().then(() => (YO(), eX9));
    await G(Q, B)
  } catch {}
  try {
    let G = (async () => {
      try {
        await Vz0()
      } catch {}
    })();
    await Promise.race([G, new Promise((Z, I) => setTimeout(() => I(Error("Cleanup timeout")), 2000))]), await Bh1(), process.exit(A)
  } catch {
    await Bh1(), process.exit(A)
  }
}
// @from(Start 13924724, End 13924727)
AV9
// @from(Start 13924733, End 13924911)
kW = L(() => {
  l2();
  V0();
  HH();
  CUA();
  AV9 = s1(() => {
    process.on("SIGINT", () => {
      v6(0)
    }), process.on("SIGTERM", () => {
      v6(143)
    })
  })
})
// @from(Start 13924914, End 13925314)
function EQ(A) {
  let [Q, B] = QV9.useState({
    pending: !1,
    keyName: null
  }), G = Bf((I) => B({
    pending: I,
    keyName: "Ctrl-C"
  }), A ? A : async () => {
    await v6(0)
  }), Z = Bf((I) => B({
    pending: I,
    keyName: "Ctrl-D"
  }), A ? A : async () => {
    await v6(0)
  });
  return f1((I, Y) => {
    if (Y.ctrl && I === "c") G();
    if (Y.ctrl && I === "d") Z()
  }), Q
}
// @from(Start 13925319, End 13925322)
QV9
// @from(Start 13925328, End 13925390)
Q4 = L(() => {
  hA();
  wsA();
  kW();
  QV9 = BA(VA(), 1)
})
// @from(Start 13925393, End 13925569)
function BV9() {
  return u4.createElement($, {
    dimColor: !0
  }, "Claude Code will be able to read files in this directory and make edits when auto-accept edits is on.")
}
// @from(Start 13925571, End 13925779)
function Zy3({
  path: A
}) {
  return u4.createElement(S, {
    flexDirection: "column",
    paddingX: 2,
    gap: 1
  }, u4.createElement($, {
    color: "permission"
  }, A), u4.createElement(BV9, null))
}
// @from(Start 13925781, End 13926376)
function Iy3({
  value: A,
  onChange: Q,
  onSubmit: B,
  error: G
}) {
  return u4.createElement(S, {
    flexDirection: "column"
  }, u4.createElement($, null, "Enter the path to the directory:"), u4.createElement(S, {
    borderDimColor: !0,
    borderStyle: "round",
    marginY: 1,
    paddingLeft: 1
  }, u4.createElement(s4, {
    showCursor: !0,
    placeholder: `Directory path${H1.ellipsis}`,
    value: A,
    onChange: Q,
    onSubmit: B,
    columns: 80,
    cursorOffset: A.length,
    onChangeCursorOffset: () => {}
  })), G && u4.createElement($, {
    color: "error"
  }, G))
}
// @from(Start 13926378, End 13928048)
function SY1({
  onAddDirectory: A,
  onCancel: Q,
  permissionContext: B,
  directoryPath: G
}) {
  let [Z, I] = ig.useState(""), [Y, J] = ig.useState(null), W = EQ(), X = ig.useMemo(() => Gy3, []);
  f1(ig.useCallback((K, D) => {
    if (D.escape || D.ctrl && K === "c") Q()
  }, [Q]));
  let V = ig.useCallback((K) => {
      let D = XSA(K, B);
      if (D.resultType === "success") A(D.absolutePath, !1);
      else J(VSA(D))
    }, [B, A]),
    F = ig.useCallback((K) => {
      if (!G) return;
      switch (K) {
        case "yes-session":
          A(G, !1);
          break;
        case "yes-remember":
          A(G, !0);
          break;
        case "no":
          Q();
          break
      }
    }, [G, A, Q]);
  return u4.createElement(u4.Fragment, null, u4.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    paddingLeft: 1,
    paddingRight: 1,
    gap: 1,
    borderColor: "permission"
  }, u4.createElement($, {
    bold: !0,
    color: "permission"
  }, "Add directory to workspace"), G ? u4.createElement(S, {
    flexDirection: "column",
    gap: 1
  }, u4.createElement(Zy3, {
    path: G
  }), u4.createElement(M0, {
    options: X,
    onChange: F,
    onCancel: () => F("no")
  })) : u4.createElement(S, {
    flexDirection: "column",
    gap: 1,
    marginX: 2
  }, u4.createElement(BV9, null), u4.createElement(Iy3, {
    value: Z,
    onChange: I,
    onSubmit: V,
    error: Y
  }))), !G && u4.createElement(S, {
    marginLeft: 3
  }, W.pending ? u4.createElement($, {
    dimColor: !0
  }, "Press ", W.keyName, " again to exit") : u4.createElement($, {
    dimColor: !0
  }, "Enter to add · Esc to cancel")))
}
// @from(Start 13928053, End 13928055)
u4
// @from(Start 13928057, End 13928059)
ig
// @from(Start 13928061, End 13928064)
Gy3
// @from(Start 13928070, End 13928370)
xV0 = L(() => {
  hA();
  Q4();
  ZY();
  _Y1();
  V9();
  S5();
  u4 = BA(VA(), 1), ig = BA(VA(), 1), Gy3 = [{
    value: "yes-session",
    label: "Yes, for this session"
  }, {
    value: "yes-remember",
    label: "Yes, and remember this directory"
  }, {
    value: "no",
    label: "No"
  }]
})
// @from(Start 13928373, End 13930002)
function GV9({
  onCancel: A,
  onSubmit: Q,
  ruleBehavior: B
}) {
  let [G, Z] = vV0.useState(""), [I, Y] = vV0.useState(0), J = EQ();
  f1((F, K) => {
    if (K.escape) A()
  });
  let {
    columns: W
  } = WB(), X = W - 6, V = (F) => {
    let K = F.trim();
    if (K.length === 0) return;
    let D = nN(K);
    Q(D, B)
  };
  return F7.createElement(F7.Fragment, null, F7.createElement(S, {
    flexDirection: "column",
    gap: 1,
    borderStyle: "round",
    paddingLeft: 1,
    paddingRight: 1,
    borderColor: "permission"
  }, F7.createElement($, {
    bold: !0,
    color: "permission"
  }, "Add ", B, " permission rule"), F7.createElement(S, {
    flexDirection: "column"
  }, F7.createElement($, null, "Permission rules are a tool name, optionally followed by a specifier in parentheses.", F7.createElement(bF, null), "e.g.,", " ", F7.createElement($, {
    bold: !0
  }, B3({
    toolName: nV.name
  })), F7.createElement($, {
    bold: !1
  }, " or "), F7.createElement($, {
    bold: !0
  }, B3({
    toolName: D9.name,
    ruleContent: "ls:*"
  }))), F7.createElement(S, {
    borderDimColor: !0,
    borderStyle: "round",
    marginY: 1,
    paddingLeft: 1
  }, F7.createElement(s4, {
    showCursor: !0,
    value: G,
    onChange: Z,
    onSubmit: V,
    placeholder: `Enter permission rule${H1.ellipsis}`,
    columns: X,
    cursorOffset: I,
    onChangeCursorOffset: Y
  })))), F7.createElement(S, {
    marginLeft: 3
  }, J.pending ? F7.createElement($, {
    dimColor: !0
  }, "Press ", J.keyName, " again to exit") : F7.createElement($, {
    dimColor: !0
  }, "Enter to submit · Esc to cancel")))
}
// @from(Start 13930007, End 13930009)
F7
// @from(Start 13930011, End 13930014)
vV0
// @from(Start 13930020, End 13930141)
ZV9 = L(() => {
  hA();
  Q4();
  AZ();
  i8();
  oWA();
  pF();
  ZY();
  V9();
  F7 = BA(VA(), 1), vV0 = BA(VA(), 1)
})
// @from(Start 13930144, End 13931445)
function YV9({
  onExit: A,
  getToolPermissionContext: Q,
  onRequestAddDirectory: B,
  onRequestRemoveDirectory: G
}) {
  let Z = Q(),
    I = j$.useMemo(() => {
      return Array.from(Z.additionalWorkingDirectories.keys()).map((W) => ({
        path: W,
        isCurrent: !1,
        isDeletable: !0
      }))
    }, [Z.additionalWorkingDirectories]),
    Y = IV9.useCallback((W) => {
      if (W === "add-directory") {
        B();
        return
      }
      let X = I.find((V) => V.path === W);
      if (X && X.isDeletable) G(X.path)
    }, [I, B, G]),
    J = j$.useMemo(() => {
      let W = I.map((X) => ({
        label: X.path,
        value: X.path
      }));
      return W.push({
        label: `Add directory${H1.ellipsis}`,
        value: "add-directory"
      }), W
    }, [I]);
  return j$.createElement(S, {
    flexDirection: "column",
    marginBottom: 1
  }, j$.createElement(S, {
    flexDirection: "row",
    marginTop: 1,
    marginLeft: 2,
    gap: 1
  }, j$.createElement($, null, `-  ${uQ()}`), j$.createElement($, {
    dimColor: !0
  }, "(Original working directory)")), j$.createElement(M0, {
    options: J,
    onChange: Y,
    onCancel: () => A("Workspace dialog dismissed", {
      display: "system"
    }),
    visibleOptionCount: Math.min(10, J.length)
  }))
}
// @from(Start 13931450, End 13931452)
j$
// @from(Start 13931454, End 13931457)
IV9
// @from(Start 13931463, End 13931551)
JV9 = L(() => {
  hA();
  S5();
  V9();
  _0();
  j$ = BA(VA(), 1), IV9 = BA(VA(), 1)
})
// @from(Start 13931554, End 13932998)
function WV9({
  directoryPath: A,
  onRemove: Q,
  onCancel: B,
  permissionContext: G,
  setPermissionContext: Z
}) {
  let I = EQ();
  f1((W, X) => {
    if (X.escape) B()
  });
  let Y = bV0.useCallback(() => {
      let W = UF(G, {
        type: "removeDirectories",
        directories: [A],
        destination: "session"
      });
      Z(W), Q()
    }, [A, G, Z, Q]),
    J = bV0.useCallback((W) => {
      if (W === "yes") Y();
      else B()
    }, [Y, B]);
  return rZ.createElement(rZ.Fragment, null, rZ.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    paddingLeft: 1,
    paddingRight: 1,
    borderColor: "error"
  }, rZ.createElement($, {
    bold: !0,
    color: "error"
  }, "Remove directory from workspace?"), rZ.createElement(S, {
    marginY: 1,
    marginX: 2,
    flexDirection: "column"
  }, rZ.createElement($, {
    bold: !0
  }, A)), rZ.createElement($, null, "Claude Code will no longer have access to files in this directory."), rZ.createElement(S, {
    marginY: 1
  }, rZ.createElement(M0, {
    onChange: J,
    onCancel: B,
    options: [{
      label: "Yes",
      value: "yes"
    }, {
      label: "No",
      value: "no"
    }]
  }))), rZ.createElement(S, {
    marginLeft: 3
  }, I.pending ? rZ.createElement($, {
    dimColor: !0
  }, "Press ", I.keyName, " again to exit") : rZ.createElement($, {
    dimColor: !0
  }, "↑/↓ to select · Enter to confirm · Esc to cancel")))
}
// @from(Start 13933003, End 13933005)
rZ
// @from(Start 13933007, End 13933010)
bV0
// @from(Start 13933016, End 13933104)
XV9 = L(() => {
  hA();
  Q4();
  S5();
  cK();
  rZ = BA(VA(), 1), bV0 = BA(VA(), 1)
})
// @from(Start 13933107, End 13934184)
function Na({
  title: A,
  color: Q,
  defaultTab: B,
  children: G,
  hidden: Z
}) {
  let I = G.map((X) => [X.props.id ?? X.props.title, X.props.title]),
    Y = B ? I.findIndex((X) => B === X[0]) : 0,
    [J, W] = Gz.useState(Y !== -1 ? Y : 0);
  return f1((X, V) => {
    if (V.tab) {
      let F = V.shift ? -1 : 1;
      W((J + I.length + F) % I.length)
    }
  }, {
    isActive: !Z
  }), Gz.default.createElement(VV9.Provider, {
    value: I[J][0]
  }, Gz.default.createElement(S, {
    flexDirection: "column"
  }, !Z && Gz.default.createElement(S, {
    flexDirection: "row",
    gap: 1
  }, A !== void 0 && Gz.default.createElement($, {
    bold: !0,
    color: Q
  }, A), I.map(([X, V], F) => Gz.default.createElement($, {
    key: X,
    backgroundColor: Q && J === F ? Q : void 0,
    color: Q && J === F ? "inverseText" : void 0,
    bold: J === F
  }, " ", V, " ")), Gz.default.createElement($, {
    dimColor: !0
  }, " ", Gz.default.createElement(E4, {
    shortcut: "tab",
    action: "cycle",
    parens: !0
  }))), Gz.default.createElement(S, null, G)))
}
// @from(Start 13934186, End 13934304)
function eD({
  title: A,
  id: Q,
  children: B
}) {
  if (Gz.useContext(VV9) !== (Q ?? A)) return null;
  return B
}
// @from(Start 13934309, End 13934311)
Gz
// @from(Start 13934313, End 13934316)
VV9
// @from(Start 13934322, End 13934407)
FSA = L(() => {
  hA();
  dF();
  Gz = BA(VA(), 1), VV9 = Gz.createContext(void 0)
})
// @from(Start 13934410, End 13934519)
function Yy3({
  rule: A
}) {
  return UQ.createElement($, {
    dimColor: !0
  }, `From ${hV0(A.source)}`)
}
// @from(Start 13934521, End 13934676)
function Jy3(A) {
  switch (A) {
    case "allow":
      return "allowed";
    case "deny":
      return "denied";
    case "ask":
      return "ask"
  }
}
// @from(Start 13934678, End 13936394)
function Wy3({
  rule: A,
  onDelete: Q,
  onCancel: B
}) {
  let G = EQ();
  f1((Y, J) => {
    if (J.escape) B()
  });
  let Z = UQ.createElement(S, {
      flexDirection: "column",
      marginX: 2
    }, UQ.createElement($, {
      bold: !0
    }, B3(A.ruleValue)), UQ.createElement(n21, {
      ruleValue: A.ruleValue
    }), UQ.createElement(Yy3, {
      rule: A
    })),
    I = UQ.createElement(S, {
      marginLeft: 3
    }, G.pending ? UQ.createElement($, {
      dimColor: !0
    }, "Press ", G.keyName, " again to exit") : UQ.createElement($, {
      dimColor: !0
    }, "Esc to cancel"));
  if (A.source === "policySettings") return UQ.createElement(UQ.Fragment, null, UQ.createElement(S, {
    flexDirection: "column",
    gap: 1,
    borderStyle: "round",
    paddingLeft: 1,
    paddingRight: 1,
    borderColor: "permission"
  }, UQ.createElement($, {
    bold: !0,
    color: "permission"
  }, "Rule details"), Z, UQ.createElement($, {
    italic: !0
  }, "This rule is configured by managed settings and cannot be modified.", `
`, "Contact your system administrator for more information.")), I);
  return UQ.createElement(UQ.Fragment, null, UQ.createElement(S, {
    flexDirection: "column",
    gap: 1,
    borderStyle: "round",
    paddingLeft: 1,
    paddingRight: 1,
    borderColor: "error"
  }, UQ.createElement($, {
    bold: !0,
    color: "error"
  }, "Delete ", Jy3(A.ruleBehavior), " tool?"), Z, UQ.createElement($, null, "Are you sure you want to delete this permission rule?"), UQ.createElement(M0, {
    onChange: (Y) => Y === "yes" ? Q() : B(),
    onCancel: B,
    options: [{
      label: "Yes",
      value: "yes"
    }, {
      label: "No",
      value: "no"
    }]
  })), I)
}
// @from(Start 13936396, End 13942660)
function kY1({
  onExit: A,
  initialTab: Q = "allow"
}) {
  let [B, G] = LK.useState([]), [{
    toolPermissionContext: Z
  }, I] = OQ(), [Y, J] = LK.useState(), [W, X] = LK.useState(null), [V, F] = LK.useState(null), [K, D] = LK.useState(!1), [H, C] = LK.useState(null), E = LK.useMemo(() => {
    let k = new Map;
    return CVA(Z).forEach((m) => {
      k.set(JSON.stringify(m), m)
    }), k
  }, [Z]), U = LK.useMemo(() => {
    let k = new Map;
    return KVA(Z).forEach((m) => {
      k.set(JSON.stringify(m), m)
    }), k
  }, [Z]), q = LK.useMemo(() => {
    let k = new Map;
    return yY1(Z).forEach((m) => {
      k.set(JSON.stringify(m), m)
    }), k
  }, [Z]), w = LK.useCallback((k) => {
    let m = (() => {
        switch (k) {
          case "allow":
            return E;
          case "deny":
            return U;
          case "ask":
            return q;
          case "workspace":
            return new Map
        }
      })(),
      o = [];
    if (k !== "workspace") o.push({
      label: `Add a new rule${H1.ellipsis}`,
      value: "add-new-rule"
    });
    let IA = Array.from(m.keys()).sort((FA, zA) => {
      let NA = m.get(FA),
        OA = m.get(zA);
      if (NA && OA) {
        let mA = B3(NA.ruleValue).toLowerCase(),
          wA = B3(OA.ruleValue).toLowerCase();
        return mA.localeCompare(wA)
      }
      return 0
    });
    for (let FA of IA) {
      let zA = m.get(FA);
      if (zA) o.push({
        label: B3(zA.ruleValue),
        value: FA
      })
    }
    return {
      options: o,
      rulesByKey: m
    }
  }, [E, U, q]), N = EQ(), R = LK.useCallback((k, m) => {
    let {
      rulesByKey: o
    } = w(m);
    if (k === "add-new-rule") {
      X(m);
      return
    } else {
      J(o.get(k));
      return
    }
  }, [w]), T = LK.useCallback(() => {
    X(null)
  }, []), y = LK.useCallback((k, m) => {
    F({
      ruleValue: k,
      ruleBehavior: m
    }), X(null)
  }, []), v = LK.useCallback((k) => {
    F(null);
    for (let m of k) G((o) => [...o, `Added ${m.ruleBehavior} rule ${tA.bold(B3(m.ruleValue))}`])
  }, []), x = LK.useCallback(() => {
    F(null)
  }, []), p = () => {
    if (!Y) return;
    FV9({
      rule: Y,
      initialContext: Z,
      setToolPermissionContext(k) {
        I((m) => ({
          ...m,
          toolPermissionContext: k
        }))
      }
    }), G((k) => [...k, `Deleted ${Y.ruleBehavior} rule ${tA.bold(B3(Y.ruleValue))}`]), J(void 0)
  };
  if (Y) return UQ.createElement(Wy3, {
    rule: Y,
    onDelete: p,
    onCancel: () => J(void 0)
  });
  if (W && W !== "workspace") return UQ.createElement(GV9, {
    onCancel: T,
    onSubmit: y,
    ruleBehavior: W
  });
  if (V) return UQ.createElement(wZ2, {
    onAddRules: v,
    onCancel: x,
    ruleValues: [V.ruleValue],
    ruleBehavior: V.ruleBehavior,
    initialContext: Z,
    setToolPermissionContext: (k) => {
      I((m) => ({
        ...m,
        toolPermissionContext: k
      }))
    }
  });
  if (K) return UQ.createElement(SY1, {
    onAddDirectory: (k, m) => {
      let IA = {
          type: "addDirectories",
          directories: [k],
          destination: m ? "localSettings" : "session"
        },
        FA = UF(Z, IA);
      if (I((zA) => ({
          ...zA,
          toolPermissionContext: FA
        })), m) Iv(IA);
      G((zA) => [...zA, `Added directory ${tA.bold(k)} to workspace${m?" and saved to local settings":" for this session"}`]), D(!1)
    },
    onCancel: () => D(!1),
    permissionContext: Z
  });
  if (H) return UQ.createElement(WV9, {
    directoryPath: H,
    onRemove: () => {
      G((k) => [...k, `Removed directory ${tA.bold(H)} from workspace`]), C(null)
    },
    onCancel: () => C(null),
    permissionContext: Z,
    setPermissionContext: (k) => {
      I((m) => ({
        ...m,
        toolPermissionContext: k
      }))
    }
  });

  function u(k) {
    switch (k) {
      case "allow":
        return "Claude Code won't ask before using allowed tools.";
      case "deny":
        return "Claude Code will always reject requests to use denied tools.";
      case "ask":
        return "Claude Code will always ask for confirmation before using these tools.";
      case "workspace":
        return "Claude Code can read files in the workspace, and make edits when auto-accept edits is on."
    }
  }

  function e(k) {
    if (k === "workspace") return UQ.createElement(YV9, {
      onExit: A,
      getToolPermissionContext: () => Z,
      onRequestAddDirectory: () => D(!0),
      onRequestRemoveDirectory: (o) => C(o)
    });
    let {
      options: m
    } = w(k);
    return UQ.createElement(S, {
      marginY: 1
    }, UQ.createElement(M0, {
      options: m,
      onChange: (o) => R(o, k),
      onCancel: () => {
        if (B.length > 0) A(B.join(`
`));
        else A("Permissions dialog dismissed", {
          display: "system"
        })
      },
      visibleOptionCount: Math.min(10, m.length)
    }))
  }
  return UQ.createElement(S, {
    flexDirection: "column"
  }, UQ.createElement(D3, {
    dividerColor: "permission"
  }), UQ.createElement(S, {
    paddingX: 1,
    flexDirection: "column"
  }, UQ.createElement(Na, {
    title: "Permissions:",
    color: "permission",
    defaultTab: Q,
    hidden: !!Y || !!W || !!V || K || !!H
  }, UQ.createElement(eD, {
    id: "allow",
    title: "Allow"
  }, UQ.createElement(S, {
    flexDirection: "column"
  }, UQ.createElement($, null, u("allow")), e("allow"))), UQ.createElement(eD, {
    id: "ask",
    title: "Ask"
  }, UQ.createElement(S, {
    flexDirection: "column"
  }, UQ.createElement($, null, u("ask")), e("ask"))), UQ.createElement(eD, {
    id: "deny",
    title: "Deny"
  }, UQ.createElement(S, {
    flexDirection: "column"
  }, UQ.createElement($, null, u("deny")), e("deny"))), UQ.createElement(eD, {
    id: "workspace",
    title: "Workspace"
  }, UQ.createElement(S, {
    flexDirection: "column"
  }, UQ.createElement($, null, u("workspace")), e("workspace")))), UQ.createElement(S, {
    marginTop: 1
  }, UQ.createElement($, {
    dimColor: !0
  }, N.pending ? UQ.createElement(UQ.Fragment, null, "Press ", N.keyName, " again to exit") : UQ.createElement(UQ.Fragment, null, "Press ↑↓ to navigate · Enter to select · Esc to exit")))))
}
// @from(Start 13942665, End 13942667)
UQ
// @from(Start 13942669, End 13942671)
LK
// @from(Start 13942677, End 13942867)
fV0 = L(() => {
  hA();
  S5();
  Q4();
  AZ();
  V9();
  O00();
  a21();
  ZV9();
  F9();
  JV9();
  xV0();
  XV9();
  cK();
  z9();
  FSA();
  BK();
  UQ = BA(VA(), 1), LK = BA(VA(), 1)
})
// @from(Start 13942911, End 13943281)
function Vy3({
  message: A,
  args: Q,
  onDone: B
}) {
  return Hx.useEffect(() => {
    let G = setTimeout(B, 0);
    return () => clearTimeout(G)
  }, [B]), Hx.default.createElement(S, {
    flexDirection: "column"
  }, Hx.default.createElement($, {
    dimColor: !0
  }, "> /add-dir ", Q), Hx.default.createElement(S0, null, Hx.default.createElement($, null, A)))
}
// @from(Start 13943283, End 13943849)
function XSA(A, Q) {
  if (!A) return {
    resultType: "emptyPath"
  };
  let B = b9(A),
    G = RA();
  if (!G.existsSync(B)) return {
    resultType: "pathNotFound",
    directoryPath: A,
    absolutePath: B
  };
  if (!G.statSync(B).isDirectory()) return {
    resultType: "notADirectory",
    directoryPath: A,
    absolutePath: B
  };
  let Z = JIA(Q);
  for (let I of Z)
    if (Mh(B, I)) return {
      resultType: "alreadyInWorkingDirectory",
      directoryPath: A,
      workingDir: I
    };
  return {
    resultType: "success",
    absolutePath: B
  }
}
// @from(Start 13943851, End 13944507)
function VSA(A) {
  switch (A.resultType) {
    case "emptyPath":
      return "Please provide a directory path.";
    case "pathNotFound":
      return `Path ${tA.bold(A.absolutePath)} was not found.`;
    case "notADirectory": {
      let Q = Xy3(A.absolutePath);
      return `${tA.bold(A.directoryPath)} is not a directory. Did you mean to add the parent directory ${tA.bold(Q)}?`
    }
    case "alreadyInWorkingDirectory":
      return `${tA.bold(A.directoryPath)} is already accessible within the existing working directory ${tA.bold(A.workingDir)}.`;
    case "success":
      return `Added ${tA.bold(A.absolutePath)} as a working directory.`
  }
}
// @from(Start 13944512, End 13944514)
Hx
// @from(Start 13944516, End 13944519)
Fy3
// @from(Start 13944521, End 13944524)
KV9
// @from(Start 13944530, End 13946469)
_Y1 = L(() => {
  F9();
  hA();
  EJ();
  AQ();
  yI();
  xV0();
  q8();
  fV0();
  cK();
  Hx = BA(VA(), 1);
  Fy3 = {
    type: "local-jsx",
    name: "add-dir",
    description: "Add a new working directory",
    argumentHint: "<path>",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, Q, B) {
      let G = B.trim();
      if (!G) return Hx.default.createElement(kY1, {
        onExit: A,
        initialTab: "workspace"
      });
      let Z = await Q.getAppState(),
        I = XSA(G, Z.toolPermissionContext);
      if (I.resultType !== "success") {
        let Y = VSA(I);
        return Hx.default.createElement(Vy3, {
          message: Y,
          args: B,
          onDone: () => A(Y)
        })
      }
      return Hx.default.createElement(SY1, {
        directoryPath: I.absolutePath,
        permissionContext: Z.toolPermissionContext,
        onAddDirectory: async (Y, J) => {
          let X = {
              type: "addDirectories",
              directories: [Y],
              destination: J ? "localSettings" : "session"
            },
            V = await Q.getAppState(),
            F = UF(V.toolPermissionContext, X);
          Q.setAppState((H) => ({
            ...H,
            toolPermissionContext: F
          }));
          let K;
          if (J) try {
            Iv(X), K = `Added ${tA.bold(Y)} as a working directory and saved to local settings`
          } catch (H) {
            K = `Added ${tA.bold(Y)} as a working directory. Failed to save to local settings: ${H instanceof Error?H.message:"Unknown error"}`
          } else K = `Added ${tA.bold(Y)} as a working directory for this session`;
          let D = `${K} ${tA.dim("· /permissions to manage")}`;
          A(D)
        },
        onCancel: () => {
          A(`Did not add ${tA.bold(I.absolutePath)} as a working directory.`)
        }
      })
    },
    userFacingName() {
      return "add-dir"
    }
  }, KV9 = Fy3
})
// @from(Start 13946472, End 13947575)
function uQA(A) {
  let Q = A;
  return Q = Q.replace(/"(sk-ant[^\s"']{24,})"/g, '"[REDACTED_API_KEY]"'), Q = Q.replace(/(?<![A-Za-z0-9"'])(sk-ant-?[A-Za-z0-9_-]{10,})(?![A-Za-z0-9"'])/g, "[REDACTED_API_KEY]"), Q = Q.replace(/AWS key: "(AWS[A-Z0-9]{20,})"/g, 'AWS key: "[REDACTED_AWS_KEY]"'), Q = Q.replace(/(AKIA[A-Z0-9]{16})/g, "[REDACTED_AWS_KEY]"), Q = Q.replace(/(?<![A-Za-z0-9])(AIza[A-Za-z0-9_-]{35})(?![A-Za-z0-9])/g, "[REDACTED_GCP_KEY]"), Q = Q.replace(/(?<![A-Za-z0-9])([a-z0-9-]+@[a-z0-9-]+\.iam\.gserviceaccount\.com)(?![A-Za-z0-9])/g, "[REDACTED_GCP_SERVICE_ACCOUNT]"), Q = Q.replace(/(["']?x-api-key["']?\s*[:=]\s*["']?)[^"',\s)}\]]+/gi, "$1[REDACTED_API_KEY]"), Q = Q.replace(/(["']?authorization["']?\s*[:=]\s*["']?(bearer\s+)?)[^"',\s)}\]]+/gi, "$1[REDACTED_TOKEN]"), Q = Q.replace(/(AWS[_-][A-Za-z0-9_]+\s*[=:]\s*)["']?[^"',\s)}\]]+["']?/gi, "$1[REDACTED_AWS_VALUE]"), Q = Q.replace(/(GOOGLE[_-][A-Za-z0-9_]+\s*[=:]\s*)["']?[^"',\s)}\]]+["']?/gi, "$1[REDACTED_GCP_VALUE]"), Q = Q.replace(/((API[-_]?KEY|TOKEN|SECRET|PASSWORD)\s*[=:]\s*)["']?[^"',\s)}\]]+["']?/gi, "$1[REDACTED]"), Q
}
// @from(Start 13947577, End 13948280)
function Dy3(A) {
  let Q = [];
  for (let B of A) {
    if (B.type !== "user") continue;
    let G = B.message.content;
    if (!Array.isArray(G)) continue;
    for (let Z of G) {
      if (Z.type !== "tool_result") continue;
      let I = Z.content;
      if (typeof I === "string") try {
        let Y = JSON.parse(I);
        if (Y && typeof Y.agentId === "string") Q.push(Y.agentId)
      } catch {} else if (Array.isArray(I)) {
        for (let Y of I)
          if (Y.type === "text" && typeof Y.text === "string") try {
            let J = JSON.parse(Y.text);
            if (J && typeof J.agentId === "string") Q.push(J.agentId)
          } catch {}
      }
    }
  }
  return [...new Set(Q)]
}
// @from(Start 13948281, End 13948649)
async function Hy3(A) {
  let Q = await Promise.all(A.map(async (G) => {
      try {
        let Z = await KY1(G);
        if (Z && Z.length > 0) return {
          agentId: G,
          transcript: Z
        };
        return null
      } catch {
        return null
      }
    })),
    B = {};
  for (let G of Q)
    if (G) B[G.agentId] = G.transcript;
  return B
}
// @from(Start 13948651, End 13948813)
function HV9() {
  return z2A().map((A) => {
    let Q = {
      ...A
    };
    if (Q && typeof Q.error === "string") Q.error = uQA(Q.error);
    return Q
  })
}
// @from(Start 13948815, End 13955081)
function EV9({
  abortSignal: A,
  messages: Q,
  initialDescription: B,
  onDone: G
}) {
  let [Z, I] = fO.useState("userInput"), [Y, J] = fO.useState(0), [W, X] = fO.useState(B ?? ""), [V, F] = fO.useState(null), [K, D] = fO.useState(null), [H, C] = fO.useState({
    isGit: !1,
    gitState: null
  }), [E, U] = fO.useState(null), q = WB().columns - 4;
  fO.useEffect(() => {
    async function R() {
      let T = await rw(),
        y = null;
      if (T) y = await wh1();
      C({
        isGit: T,
        gitState: y
      })
    }
    R()
  }, []);
  let w = EQ(),
    N = fO.useCallback(async () => {
      I("submitting"), D(null), F(null);
      let R = HV9(),
        y = AVA(Q)?.requestId ?? null,
        v = Dy3(Q),
        x = await Hy3(v),
        p = {
          latestAssistantMessageId: y,
          message_count: Q.length,
          datetime: new Date().toISOString(),
          description: W,
          platform: d0.platform,
          gitRepo: H.isGit,
          terminal: d0.terminal,
          version: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.0.59",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
          }.VERSION,
          transcript: WZ(Q),
          errors: R,
          lastApiRequest: NkA(),
          ...Object.keys(x).length > 0 && {
            subagentTranscripts: x
          }
        },
        [u, e] = await Promise.all([zy3(p), Ey3(W, A)]);
      if (U(e), u.success) {
        if (u.feedbackId) F(u.feedbackId), GA("tengu_bug_report_submitted", {
          feedback_id: u.feedbackId,
          last_assistant_message_id: y
        });
        I("done")
      } else {
        if (u.isZdrOrg) D("Feedback collection is not available for organizations with custom data retention policies.");
        else D("Could not submit feedback. Please try again later.");
        I("done")
      }
    }, [W, H.isGit, Q]);
  return f1((R, T) => {
    if (Z === "done") {
      if (T.return && E) {
        let y = Cy3(V ?? "", E, W, HV9());
        cZ(y)
      }
      if (K) G("Error submitting feedback / bug report", {
        display: "system"
      });
      else G("Feedback / bug report submitted", {
        display: "system"
      });
      return
    }
    if (K) {
      G("Error submitting feedback / bug report", {
        display: "system"
      });
      return
    }
    if (T.escape) {
      G("Feedback / bug report cancelled", {
        display: "system"
      });
      return
    }
    if (Z === "consent" && (T.return || R === " ")) N()
  }), mQ.createElement(mQ.Fragment, null, mQ.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    borderColor: "permission",
    paddingX: 1,
    paddingBottom: 1,
    gap: 1
  }, mQ.createElement($, {
    bold: !0,
    color: "permission"
  }, "Submit Feedback / Bug Report"), Z === "userInput" && mQ.createElement(S, {
    flexDirection: "column",
    gap: 1
  }, mQ.createElement($, null, "Describe the issue below:"), mQ.createElement(s4, {
    value: W,
    onChange: X,
    columns: q,
    onSubmit: () => I("consent"),
    onExitMessage: () => G("Feedback cancelled", {
      display: "system"
    }),
    cursorOffset: Y,
    onChangeCursorOffset: J
  }), K && mQ.createElement(S, {
    flexDirection: "column",
    gap: 1
  }, mQ.createElement($, {
    color: "error"
  }, K), mQ.createElement($, {
    dimColor: !0
  }, "Press any key to close"))), Z === "consent" && mQ.createElement(S, {
    flexDirection: "column"
  }, mQ.createElement($, null, "This report will include:"), mQ.createElement(S, {
    marginLeft: 2,
    flexDirection: "column"
  }, mQ.createElement($, null, "- Your feedback / bug description:", " ", mQ.createElement($, {
    dimColor: !0
  }, W)), mQ.createElement($, null, "- Environment info:", " ", mQ.createElement($, {
    dimColor: !0
  }, d0.platform, ", ", d0.terminal, ", v", {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.0.59",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
  }.VERSION)), H.gitState && mQ.createElement($, null, "- Git repo metadata:", " ", mQ.createElement($, {
    dimColor: !0
  }, H.gitState.branchName, H.gitState.commitHash ? `, ${H.gitState.commitHash.slice(0,7)}` : "", H.gitState.remoteUrl ? ` @ ${H.gitState.remoteUrl}` : "", !H.gitState.isHeadOnRemote && ", not synced", !H.gitState.isClean && ", has local changes")), mQ.createElement($, null, "- Current session transcript")), mQ.createElement(S, {
    marginTop: 1
  }, mQ.createElement($, {
    wrap: "wrap",
    dimColor: !0
  }, "We will use your feedback to debug related issues or to improve", " ", "Claude Code's functionality (eg. to reduce the risk of bugs occurring in the future).")), mQ.createElement(S, {
    marginTop: 1
  }, mQ.createElement($, null, "Press ", mQ.createElement($, {
    bold: !0
  }, "Enter"), " to confirm and submit."))), Z === "submitting" && mQ.createElement(S, {
    flexDirection: "row",
    gap: 1
  }, mQ.createElement($, null, "Submitting report…")), Z === "done" && mQ.createElement(S, {
    flexDirection: "column"
  }, K ? mQ.createElement($, {
    color: "error"
  }, K) : mQ.createElement($, {
    color: "success"
  }, "Thank you for your report!"), V && mQ.createElement($, {
    dimColor: !0
  }, "Feedback ID: ", V), mQ.createElement(S, {
    marginTop: 1
  }, mQ.createElement($, null, "Press "), mQ.createElement($, {
    bold: !0
  }, "Enter "), mQ.createElement($, null, "to open your browser and draft a GitHub issue, or any other key to close.")))), mQ.createElement(S, {
    marginLeft: 1
  }, mQ.createElement($, {
    dimColor: !0
  }, w.pending ? mQ.createElement(mQ.Fragment, null, "Press ", w.keyName, " again to exit") : Z === "userInput" ? mQ.createElement(mQ.Fragment, null, "Enter to continue · Esc to cancel") : Z === "consent" ? mQ.createElement(mQ.Fragment, null, "Enter to submit · Esc to cancel") : null)))
}
// @from(Start 13955083, End 13956133)
function Cy3(A, Q, B, G) {
  let Z = uQA(Q),
    I = uQA(B),
    Y = encodeURIComponent(`**Bug Description**
${I}

**Environment Info**
- Platform: ${d0.platform}
- Terminal: ${d0.terminal}
- Version: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.59",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues"}.VERSION||"unknown"}
- Feedback ID: ${A}

**Errors**
\`\`\`json
`),
    J = encodeURIComponent("\n```\n"),
    W = encodeURIComponent(`
**Note:** Error logs were truncated.
`),
    X = JSON.stringify(G),
    V = encodeURIComponent(X),
    F = `${DV9}/new?title=${encodeURIComponent(Z)}&labels=user-reported,bug&body=`,
    K = Ky3 - F.length - Y.length - J.length - W.length,
    D = "";
  if (V.length <= K) D = Y + V + J;
  else {
    let H = V.substring(0, K);
    D = Y + H + J + W
  }
  return `${DV9}/new?title=${encodeURIComponent(Z)}&body=${D}&labels=user-reported,bug`
}
// @from(Start 13956134, End 13957847)
async function Ey3(A, Q) {
  try {
    let B = await uX({
        systemPrompt: ["Generate a concise, technical issue title (max 80 chars) for a public GitHub issue based on this bug report for Claude Code.", "Claude Code is an agentic coding CLI based on the Anthropic API.", "The title should:", "- Include the type of issue [Bug] or [Feature Request] as the first thing in the title", "- Be concise, specific and descriptive of the actual problem", "- Use technical terminology appropriate for a software issue", '- For error messages, extract the key error (e.g., "Missing Tool Result Block" rather than the full message)', "- Be direct and clear for developers to understand the problem", '- If you cannot determine a clear issue, use "Bug Report: [brief description]"', "- Any LLM API errors are from the Anthropic API, not from any other model provider", "Your response will be directly used as the title of the Github issue, and as such should not contain any other commentary or explaination", 'Examples of good titles include: "[Bug] Auto-Compact triggers to soon", "[Bug] Anthropic API Error: Missing Tool Result Block", "[Bug] Error: Invalid Model Name for Opus"'],
        userPrompt: A,
        signal: Q,
        options: {
          hasAppendSystemPrompt: !1,
          toolChoice: void 0,
          isNonInteractiveSession: !1,
          agents: [],
          querySource: "feedback",
          mcpTools: [],
          agentIdOrSessionId: e1()
        }
      }),
      G = B.message.content[0]?.type === "text" ? B.message.content[0].text : "Bug Report";
    if (G.startsWith(uV)) return CV9(A);
    return G
  } catch (B) {
    return AA(B instanceof Error ? B : Error(String(B))), CV9(A)
  }
}
// @from(Start 13957849, End 13958126)
function CV9(A) {
  let Q = A.split(`
`)[0] || "";
  if (Q.length <= 60 && Q.length > 5) return Q;
  let B = Q.slice(0, 60);
  if (Q.length > 60) {
    let G = B.lastIndexOf(" ");
    if (G > 30) B = B.slice(0, G);
    B += "..."
  }
  return B.length < 10 ? "Bug Report" : B
}
// @from(Start 13958128, End 13958321)
function xY1(A) {
  if (A instanceof Error) {
    let Q = Error(uQA(A.message));
    if (A.stack) Q.stack = uQA(A.stack);
    AA(Q)
  } else {
    let Q = uQA(String(A));
    AA(Error(Q))
  }
}
// @from(Start 13958322, End 13959483)
async function zy3(A) {
  try {
    let Q = DI();
    if (Q.error) return {
      success: !1
    };
    let B = {
        "Content-Type": "application/json",
        "User-Agent": fc(),
        ...Q.headers
      },
      G = await YQ.post("https://api.anthropic.com/api/claude_cli_feedback", {
        content: JSON.stringify(A)
      }, {
        headers: B
      });
    if (G.status === 200) {
      let Z = G.data;
      if (Z?.feedback_id) return {
        success: !0,
        feedbackId: Z.feedback_id
      };
      return xY1(Error("Failed to submit feedback: request did not return feedback_id")), {
        success: !1
      }
    }
    return xY1(Error("Failed to submit feedback:" + G.status)), {
      success: !1
    }
  } catch (Q) {
    if (YQ.isAxiosError(Q) && Q.response?.status === 403) {
      let B = Q.response.data;
      if (B?.error?.type === "permission_error" && B?.error?.message?.includes("Custom data retention settings")) return xY1(Error("Cannot submit feedback because custom data retention settings are enabled")), {
        success: !1,
        isZdrOrg: !0
      }
    }
    return xY1(Q), {
      success: !1
    }
  }
}
// @from(Start 13959488, End 13959490)
mQ
// @from(Start 13959492, End 13959494)
fO
// @from(Start 13959496, End 13959506)
Ky3 = 7250
// @from(Start 13959510, End 13959566)
DV9 = "https://github.com/anthropics/claude-code/issues"
// @from(Start 13959572, End 13959755)
gV0 = L(() => {
  hA();
  ZY();
  g1();
  c5();
  PV();
  i8();
  AE();
  q0();
  fZ();
  ZO();
  gM();
  Q4();
  O3();
  cQ();
  _0();
  S7();
  mQ = BA(VA(), 1), fO = BA(VA(), 1)
})
// @from(Start 13959761, End 13959802)
zV9 = L(() => {
  _0();
  g1();
  gB()
})
// @from(Start 13959808, End 13959811)
UV9
// @from(Start 13959813, End 13959816)
vY1
// @from(Start 13959822, End 13960034)
$V9 = L(() => {
  hA();
  ZY();
  g1();
  c5();
  PV();
  i8();
  q0();
  Q4();
  gV0();
  BK();
  sU();
  _8();
  zV9();
  cQ();
  UjA();
  _0();
  Pn();
  yq();
  V0();
  UV9 = BA(VA(), 1), vY1 = BA(VA(), 1)
})
// @from(Start 13960040, End 13960043)
Uy3
// @from(Start 13960049, End 13960096)
wV9 = L(() => {
  $V9();
  Uy3 = BA(VA(), 1)
})
// @from(Start 13960099, End 13960249)
function $y3(A, Q, B, G = "") {
  return uV0.createElement(EV9, {
    abortSignal: Q,
    messages: B,
    initialDescription: G,
    onDone: A
  })
}
// @from(Start 13960254, End 13960257)
uV0
// @from(Start 13960259, End 13960262)
wy3
// @from(Start 13960264, End 13960267)
qV9
// @from(Start 13960273, End 13960999)
NV9 = L(() => {
  gV0();
  hQ();
  uV0 = BA(VA(), 1);
  wy3 = {
    aliases: ["bug"],
    type: "local-jsx",
    name: "feedback",
    description: "Submit feedback about Claude Code",
    argumentHint: "[report]",
    isEnabled: () => !(Y0(process.env.CLAUDE_CODE_USE_BEDROCK) || Y0(process.env.CLAUDE_CODE_USE_VERTEX) || Y0(process.env.CLAUDE_CODE_USE_FOUNDRY) || process.env.DISABLE_FEEDBACK_COMMAND || process.env.DISABLE_BUG_COMMAND || process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC),
    isHidden: !1,
    async call(A, {
      abortController: Q,
      messages: B
    }, G) {
      let Z = G || "";
      return $y3(A, Q.signal, B, Z)
    },
    userFacingName() {
      return "feedback"
    }
  }, qV9 = wy3
})
// @from(Start 13961001, End 13961600)
async function qy3({
  setMessages: A,
  readFileState: Q,
  getAppState: B,
  setAppState: G
}) {
  if (await yV0("clear", {
      getAppState: B,
      setAppState: G
    }), !gH()) await kJ();
  if (A(() => []), DK.cache.clear?.(), iD.cache.clear?.(), F70.cache.clear?.(), gV.cache.clear?.(), Bq(uQ()), Q.clear(), G) G((I) => ({
    ...I,
    fileHistory: {
      snapshots: [],
      trackedFiles: new Set
    },
    mcp: {
      clients: [],
      tools: [],
      commands: [],
      resources: {}
    }
  }));
  qE0(), await Fx();
  let Z = await wq("clear");
  if (Z.length > 0) A(() => Z)
}
// @from(Start 13961605, End 13961608)
Ny3
// @from(Start 13961610, End 13961613)
LV9
// @from(Start 13961619, End 13962103)
MV9 = L(() => {
  Ty();
  gE();
  Bh();
  nt();
  _0();
  u_();
  S7();
  k1A();
  YO();
  Ny3 = {
    type: "local",
    name: "clear",
    description: "Clear conversation history and free up context",
    aliases: ["reset", "new"],
    isEnabled: () => !0,
    isHidden: !1,
    supportsNonInteractive: !1,
    async call(A, Q) {
      return await qy3(Q), {
        type: "text",
        value: ""
      }
    },
    userFacingName() {
      return "clear"
    }
  }, LV9 = Ny3
})
// @from(Start 13962109, End 13962112)
Ly3
// @from(Start 13962114, End 13962117)
OV9
// @from(Start 13962123, End 13964021)
RV9 = L(() => {
  Ty();
  gE();
  lMA();
  y1A();
  h91();
  g1();
  F9();
  wZ1();
  hQ();
  Ly3 = {
    type: "local",
    name: "compact",
    description: "Clear conversation history but keep a summary in context. Optional: /compact [instructions for summarization]",
    isEnabled: () => !Y0(process.env.DISABLE_COMPACT),
    isHidden: !1,
    supportsNonInteractive: !0,
    argumentHint: "<optional custom summarization instructions>",
    async call(A, Q) {
      let {
        abortController: B,
        messages: G
      } = Q;
      if (G.length === 0) throw Error("No messages to compact");
      let Z = A.trim();
      try {
        if (!Z) {
          let V = await f91(G, Q.agentId);
          if (V) {
            DK.cache.clear?.(), gV.cache.clear?.();
            let F = EQA("tip"),
              K = [...Q.options.verbose ? [] : ["(ctrl+o to see full summary)"], ...F ? [F] : []];
            return {
              type: "compact",
              compactionResult: V,
              displayText: tA.dim("Compacted " + K.join(`
`))
            }
          }
        }
        let Y = (await Si(G, void 0, Q)).messages,
          J = await j91(Y, Q, !1, Z);
        DK.cache.clear?.(), gV.cache.clear?.();
        let W = EQA("tip"),
          X = [...Q.options.verbose ? [] : ["(ctrl+o to see full summary)"], ...J.userDisplayMessage ? [J.userDisplayMessage] : [], ...W ? [W] : []];
        return {
          type: "compact",
          compactionResult: J,
          displayText: tA.dim("Compacted " + X.join(`
`))
        }
      } catch (I) {
        if (B.signal.aborted) throw Error("Compaction canceled.");
        else if (I instanceof Error && I.message === cMA) throw Error(cMA);
        else throw AA(I instanceof Error ? I : Error(String(I))), Error(`Error during compaction: ${I}`)
      }
    },
    userFacingName() {
      return "compact"
    }
  }, OV9 = Ly3
})
// @from(Start 13964024, End 13965501)
function TV9({
  context: A,
  flat: Q
} = {}) {
  let B = gV(),
    G = [];
  if (A?.readFileState) _l(A.readFileState).forEach((Y) => {
    let J = A.readFileState.get(Y);
    if (J && Y.endsWith("/CLAUDE.md") && !B.some((W) => W.path === Y)) G.push({
      path: Y,
      content: J.content,
      type: "Project",
      isNested: !0
    })
  });
  let Z = [...B, ...G];
  if (Z.length === 0) return null;
  if (Q) return nW.createElement(S, {
    flexDirection: "row",
    columnGap: 1,
    flexWrap: "wrap"
  }, Z.map((Y, J) => {
    let W = Q5(Y.path),
      X = Y.isNested ? "nested" : YQ0(Y.type),
      V = J < Z.length - 1 ? "," : "";
    return nW.createElement(S, {
      key: J,
      flexDirection: "row",
      flexShrink: 0
    }, nW.createElement($, null, X, " "), nW.createElement($, {
      dimColor: !0
    }, "(", W, ")"), nW.createElement($, null, V))
  }));
  let I = new Map;
  return nW.createElement(S, {
    flexDirection: "column"
  }, Z.map((Y, J) => {
    let W = Q5(Y.path),
      X = Y.isNested ? "nested: " : `${YQ0(Y.type)}: `,
      V = Y.parent ? (I.get(Y.parent) ?? 0) + 1 : 0;
    if (I.set(Y.path, V), V === 0) return nW.createElement($, {
      key: J
    }, nW.createElement($, {
      dimColor: !0
    }, " L "), `${X}${W}`);
    else {
      let F = "  ".repeat(V - 1);
      return nW.createElement($, {
        key: J
      }, " ".repeat(X.length + 2), F, nW.createElement($, {
        dimColor: !0
      }, " L "), W)
    }
  }))
}
// @from(Start 13965506, End 13965508)
nW
// @from(Start 13965514, End 13965592)
PV9 = L(() => {
  hA();
  gE();
  R9();
  JQ0();
  vM();
  nW = BA(VA(), 1)
})
// @from(Start 13965595, End 13965625)
function jV9() {
  return []
}
// @from(Start 13965627, End 13966784)
function SV9(A, Q = null, B) {
  let G = A?.find((Z) => Z.name === "ide");
  if (Q) {
    let Z = aF(Q.ideType),
      I = oT(Q.ideType) ? "plugin" : "extension";
    if (Q.error) return [{
      label: "IDE",
      value: mQA.createElement($, null, ZB("error", B)(H1.cross), " Error installing ", Z, " ", I, ": ", Q.error, `
`, "Please restart your IDE and try again.")
    }];
    if (Q.installed)
      if (G && G.type === "connected")
        if (Q.installedVersion !== G.serverInfo?.version) return [{
          label: "IDE",
          value: `Connected to ${Z} ${I} version ${Q.installedVersion} (server version: ${G.serverInfo?.version})`
        }];
        else return [{
          label: "IDE",
          value: `Connected to ${Z} ${I} version ${Q.installedVersion}`
        }];
    else return [{
      label: "IDE",
      value: `Installed ${Z} ${I}`
    }]
  } else if (G) {
    let Z = ze1(G) ?? "IDE";
    if (G.type === "connected") return [{
      label: "IDE",
      value: `Connected to ${Z} extension`
    }];
    else return [{
      label: "IDE",
      value: `${ZB("error",B)(H1.cross)} Not connected to ${Z}`
    }]
  }
  return []
}
// @from(Start 13966786, End 13967492)
function _V9(A = [], Q) {
  let B = A.filter((G) => G.name !== "ide");
  if (!B.length) return [];
  return [{
    label: "MCP servers",
    value: mQA.createElement(S, {
      flexDirection: "row"
    }, B.map((G, Z) => {
      let I = "";
      if (G.type === "connected") I = ZB("success", Q)(H1.tick);
      else if (G.type === "pending") I = ZB("inactive", Q)(H1.radioOff);
      else if (G.type === "needs-auth") I = ZB("warning", Q)(H1.triangleUpOutline);
      else if (G.type === "failed") I = ZB("error", Q)(H1.cross);
      else I = ZB("error", Q)(H1.cross);
      let Y = Z < B.length - 1 ? "," : "";
      return mQA.createElement($, {
        key: Z
      }, G.name, " ", I, Y)
    }))
  }]
}
// @from(Start 13967494, End 13967860)
function kV9() {
  let A = M1A(),
    Q = O1A(),
    B = [];
  if (A.forEach((G) => {
      let Z = Q5(G.path);
      B.push(`Large ${Z} will impact performance (${JZ(G.content.length)} chars > ${JZ(Lh)})`)
    }), Q && Q.content.length > wYA) B.push(`CLAUDE.md entries marked as IMPORTANT exceed ${JZ(wYA)} characters (${JZ(Q.content.length)} chars)`);
  return B
}
// @from(Start 13967862, End 13968335)
function yV9() {
  return [{
    label: "Setting sources",
    value: ls().map((B) => {
      switch (B) {
        case "userSettings":
          return "User settings";
        case "projectSettings":
          return "Shared project settings";
        case "localSettings":
          return "Local";
        case "policySettings":
          return "Enterprise managed policies";
        case "flagSettings":
          return "Command line arguments"
      }
    })
  }]
}
// @from(Start 13968336, End 13968404)
async function xV9() {
  return (await gy()).map((Q) => Q.message)
}
// @from(Start 13968405, End 13969347)
async function vV9() {
  let A = await YIA(),
    Q = [],
    {
      errors: B
    } = wa();
  if (B.length > 0) {
    let Z = Array.from(new Set(B.map((I) => I.file))).join(", ");
    Q.push(`Found invalid settings files: ${Z}. They will be ignored.`)
  }
  if (A.multipleInstallations.length > 1) Q.push(`Multiple installations detected (${A.multipleInstallations.length} found)`);
  if (A.warnings.forEach((G) => {
      Q.push(G.issue)
    }), A.hasUpdatePermissions === !1) Q.push("No write permissions for auto-updates (requires sudo)");
  if (A.configInstallMethod !== "not set") {
    let Z = {
      "npm-local": "local",
      "npm-global": "global",
      native: "native",
      development: "development",
      unknown: "unknown"
    } [A.installationType];
    if (Z && Z !== A.configInstallMethod) Q.push(`Installation config mismatch: running ${A.installationType} but config says ${A.configInstallMethod}`)
  }
  return Q
}
// @from(Start 13969349, End 13969863)
function bV9() {
  let A = RiA();
  if (!A) return [];
  let Q = [];
  if (A.subscription) Q.push({
    label: "Login method",
    value: `${A.subscription} Account`
  });
  if (A.tokenSource) Q.push({
    label: "Auth token",
    value: A.tokenSource
  });
  if (A.apiKeySource) Q.push({
    label: "API key",
    value: A.apiKeySource
  });
  if (A.organization) Q.push({
    label: "Organization",
    value: A.organization
  });
  if (A.email) Q.push({
    label: "Email",
    value: A.email
  });
  return Q
}
// @from(Start 13969865, End 13972027)
function fV9() {
  let A = V6(),
    Q = [];
  if (A !== "firstParty") {
    let Z = {
      bedrock: "AWS Bedrock",
      vertex: "Google Vertex AI",
      foundry: "Microsoft Foundry"
    } [A];
    Q.push({
      label: "API provider",
      value: Z
    })
  }
  if (A === "firstParty") {
    let Z = process.env.ANTHROPIC_BASE_URL;
    if (Z) Q.push({
      label: "Anthropic base URL",
      value: Z
    })
  } else if (A === "bedrock") {
    let Z = process.env.BEDROCK_BASE_URL;
    if (Z) Q.push({
      label: "Bedrock base URL",
      value: Z
    });
    if (Q.push({
        label: "AWS region",
        value: hBA()
      }), Y0(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH)) Q.push({
      value: "AWS auth skipped"
    })
  } else if (A === "vertex") {
    let Z = process.env.VERTEX_BASE_URL;
    if (Z) Q.push({
      label: "Vertex base URL",
      value: Z
    });
    let I = process.env.ANTHROPIC_VERTEX_PROJECT_ID;
    if (I) Q.push({
      label: "GCP project",
      value: I
    });
    if (Q.push({
        label: "Default region",
        value: ER()
      }), Y0(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH)) Q.push({
      value: "GCP auth skipped"
    })
  } else if (A === "foundry") {
    let Z = process.env.ANTHROPIC_FOUNDRY_BASE_URL;
    if (Z) Q.push({
      label: "Microsoft Foundry base URL",
      value: Z
    });
    let I = process.env.ANTHROPIC_FOUNDRY_RESOURCE;
    if (I) Q.push({
      label: "Microsoft Foundry resource",
      value: I
    });
    if (Y0(process.env.CLAUDE_CODE_SKIP_FOUNDRY_AUTH)) Q.push({
      value: "Microsoft Foundry auth skipped"
    })
  }
  let B = Sc();
  if (B) Q.push({
    label: "Proxy",
    value: B
  });
  let G = XT();
  if (process.env.NODE_EXTRA_CA_CERTS) Q.push({
    label: "Additional CA cert(s)",
    value: process.env.NODE_EXTRA_CA_CERTS
  });
  if (G) {
    if (G.cert && process.env.CLAUDE_CODE_CLIENT_CERT) Q.push({
      label: "mTLS client cert",
      value: process.env.CLAUDE_CODE_CLIENT_CERT
    });
    if (G.key && process.env.CLAUDE_CODE_CLIENT_KEY) Q.push({
      label: "mTLS client key",
      value: process.env.CLAUDE_CODE_CLIENT_KEY
    })
  }
  return Q
}
// @from(Start 13972029, End 13972216)
function hV9(A) {
  let Q = YM(A);
  if (A === null && BB()) {
    let B = pnA();
    if (pw()) Q = `${tA.bold("Default")} ${B}`;
    else Q = `${tA.bold("Sonnet")} ${B}`
  }
  return Q
}
// @from(Start 13972221, End 13972224)
mQA
// @from(Start 13972230, End 13972413)
gV9 = L(() => {
  hA();
  uy();
  gB();
  nY();
  gE();
  R9();
  lK();
  t2();
  F9();
  Zh();
  hQ();
  _c();
  v3A();
  MB();
  $J();
  V9();
  gB();
  LV();
  mQA = BA(VA(), 1)
})
// @from(Start 13972416, End 13972915)
function My3() {
  return [{
    label: "Version",
    value: {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.0.59",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
    }.VERSION
  }, {
    label: "Session ID",
    value: e1()
  }, {
    label: "cwd",
    value: W0()
  }, ...bV9(), ...fV9()]
}
// @from(Start 13972917, End 13973255)
function Oy3({
  appState: A,
  theme: Q,
  context: B
}) {
  return [{
    label: "Model",
    value: hV9(A.mainLoopModel)
  }, ...SV9(A.mcp.clients, B.options.ideInstallationStatus, Q), ..._V9(A.mcp.clients, Q), {
    label: "Memory",
    value: f6.createElement(TV9, {
      context: B,
      flat: !0
    })
  }, ...jV9(), ...yV9()]
}
// @from(Start 13973256, End 13973351)
async function Ry3() {
  return [...await nTA() ? await xV9() : [], ...await vV9(), ...kV9()]
}
// @from(Start 13973353, End 13973689)
function Ty3({
  value: A
}) {
  if (Array.isArray(A)) return f6.createElement(S, {
    flexWrap: "wrap",
    columnGap: 1,
    flexShrink: 99
  }, A.map((Q, B) => {
    return f6.createElement($, {
      key: B
    }, Q, B < A.length - 1 ? "," : "")
  }));
  if (typeof A === "string") return f6.createElement($, null, A);
  return A
}
// @from(Start 13973691, End 13975053)
function uV9({
  context: A
}) {
  let [Q] = OQ(), [B, G] = f6.useState([]), [Z, I] = f6.useState([]), Y = A.options.ideInstallationStatus, [J] = qB();
  return f6.useEffect(() => {
    async function W() {
      let X = [My3(), Oy3({
          appState: Q,
          theme: J,
          context: A
        })],
        V = await Ry3();
      G(X), I(V)
    }
    W()
  }, [Q, J, Y, A]), f6.createElement(S, {
    flexDirection: "column"
  }, f6.createElement(S, {
    flexDirection: "column",
    gap: 1,
    marginTop: 1
  }, B.map((W, X) => W.length > 0 && f6.createElement(S, {
    key: X,
    flexDirection: "column"
  }, W.map(({
    label: V,
    value: F
  }, K) => f6.createElement(S, {
    key: K,
    flexDirection: "row",
    gap: 1,
    flexShrink: 0
  }, V !== void 0 && f6.createElement($, {
    bold: !0
  }, V, ":"), f6.createElement(Ty3, {
    value: F
  }))))), Z.length > 0 && f6.createElement(S, {
    flexDirection: "column",
    paddingBottom: 1
  }, f6.createElement($, {
    bold: !0
  }, "System Diagnostics"), Z.map((W, X) => f6.createElement(S, {
    key: X,
    flexDirection: "row",
    gap: 1,
    paddingX: 1
  }, f6.createElement($, {
    color: "error"
  }, H1.warning), typeof W === "string" ? f6.createElement($, {
    wrap: "wrap"
  }, W) : W)))), f6.createElement($, {
    dimColor: !0,
    italic: !0
  }, "Esc to exit"))
}
// @from(Start 13975058, End 13975060)
f6
// @from(Start 13975066, End 13975169)
mV9 = L(() => {
  hA();
  V9();
  z9();
  _0();
  PV9();
  uy();
  gV9();
  U2();
  f6 = BA(VA(), 1)
})
// @from(Start 13975172, End 13977753)
function bY1({
  onThemeSelect: A,
  showIntroText: Q = !1,
  helpText: B = "",
  showHelpTextBelow: G = !1,
  hideEscToCancel: Z = !1,
  skipExitHandling: I = !1
}) {
  let [Y] = qB(), {
    setPreviewTheme: J,
    savePreview: W
  } = tg1(), X = EQ(I ? () => {} : void 0), F = m4.createElement(S, {
    flexDirection: "column",
    gap: 1
  }, m4.createElement(S, {
    flexDirection: "column",
    gap: 1,
    marginX: 1
  }, Q ? m4.createElement($, null, "Let's get started.") : m4.createElement($, {
    bold: !0,
    color: "permission"
  }, "Theme"), m4.createElement(S, {
    flexDirection: "column"
  }, m4.createElement($, {
    bold: !0
  }, "Choose the text style that looks best with your terminal"), B && !G && m4.createElement($, {
    dimColor: !0
  }, B)), m4.createElement(M0, {
    options: [{
      label: "Dark mode",
      value: "dark"
    }, {
      label: "Light mode",
      value: "light"
    }, {
      label: "Dark mode (colorblind-friendly)",
      value: "dark-daltonized"
    }, {
      label: "Light mode (colorblind-friendly)",
      value: "light-daltonized"
    }, {
      label: "Dark mode (ANSI colors only)",
      value: "dark-ansi"
    }, {
      label: "Light mode (ANSI colors only)",
      value: "light-ansi"
    }],
    onFocus: (K) => {
      J(K)
    },
    onChange: (K) => {
      W(), A(K)
    },
    onCancel: I ? () => {
      W()
    } : async () => {
      W(), await v6(0)
    },
    visibleOptionCount: 6,
    defaultValue: Y
  })), m4.createElement(S, {
    flexDirection: "column",
    width: "100%",
    marginBottom: 1,
    borderTop: !0,
    borderBottom: !0,
    borderLeft: !1,
    borderRight: !1,
    borderStyle: "dashed",
    borderColor: "subtle",
    borderDimColor: !0
  }, m4.createElement(J$, {
    patch: {
      oldStart: 1,
      newStart: 1,
      oldLines: 3,
      newLines: 3,
      lines: [" function greet() {", '-  console.log("Hello, World!");', '+  console.log("Hello, Claude!");', " }"]
    },
    dim: !1,
    filePath: "demo.js",
    skipHighlighting: !0
  })));
  if (!Q) return m4.createElement(m4.Fragment, null, m4.createElement(S, {
    flexDirection: "column"
  }, F), m4.createElement(S, {
    marginX: 1
  }, G && B && m4.createElement(S, {
    marginLeft: 3,
    marginTop: 1
  }, m4.createElement($, {
    dimColor: !0
  }, B)), !Z && m4.createElement(S, {
    marginLeft: 3
  }, m4.createElement($, {
    dimColor: !0
  }, X.pending ? m4.createElement(m4.Fragment, null, "Press ", X.keyName, " again to exit") : m4.createElement(m4.Fragment, null, "Esc to cancel")))));
  return F
}
// @from(Start 13977758, End 13977760)
m4
// @from(Start 13977766, End 13977851)
mV0 = L(() => {
  hA();
  J5();
  En();
  Q4();
  kW();
  hA();
  m4 = BA(VA(), 1)
})
// @from(Start 13977854, End 13980386)
function hY1({
  initial: A,
  sessionModel: Q,
  onSelect: B,
  isStandaloneCommand: G
}) {
  let Z = A === null ? dV0 : A,
    [I, Y] = fY1.useState(Z),
    J = fY1.useMemo(() => lnA(), []),
    W = EQ(),
    X = t6(),
    V = BB() && f4() === "pro",
    F = X?.hasExtraUsageEnabled === !0,
    K = 10,
    D = Math.min(10, J.length),
    H = Math.max(0, J.length - D);
  return V4.createElement(S, {
    flexDirection: "column",
    width: "100%"
  }, G && V4.createElement(D3, {
    dividerColor: "permission"
  }), V4.createElement(S, {
    flexDirection: "column",
    paddingX: G ? 1 : 0
  }, V4.createElement(S, {
    flexDirection: "column"
  }, V4.createElement(S, {
    marginBottom: 1,
    flexDirection: "column"
  }, V4.createElement($, {
    color: "remember",
    bold: !0
  }, "Select model"), V4.createElement($, {
    dimColor: !0
  }, "Switch between Claude models. Applies to this session and future Claude Code sessions. For other/previous model names, specify with --model.")), Q && V4.createElement(S, {
    marginBottom: 1,
    flexDirection: "column"
  }, V4.createElement($, {
    dimColor: !0
  }, "Currently using ", YM(Q), " for this session (set by plan mode). Selecting a model will undo this.")), V4.createElement(S, {
    flexDirection: "column",
    marginBottom: 1
  }, V4.createElement(S, {
    flexDirection: "column"
  }, V4.createElement(M0, {
    defaultValue: I,
    focusValue: J.some((C) => C.value === I) ? I : J[0]?.value ?? void 0,
    options: J.map((C) => ({
      ...C,
      value: C.value === null ? dV0 : C.value
    })),
    onFocus: (C) => Y(C),
    onChange: (C) => B(C === dV0 ? null : C),
    onCancel: () => {},
    visibleOptionCount: D
  })), H > 0 && V4.createElement(S, {
    paddingLeft: 3
  }, V4.createElement($, {
    dimColor: !0
  }, "and ", H, " more…"))), V && o2("tengu_backstage_only") && V4.createElement(S, {
    marginBottom: 1,
    flexDirection: "column"
  }, F ? V4.createElement($, {
    dimColor: !0
  }, "You now have access to Opus 4.5 by paying with your extra usage") : V4.createElement($, {
    dimColor: !0
  }, "Want Opus 4.5? Run ", V4.createElement($, {
    color: "remember"
  }, "/upgrade"), " to get the Max plan or ", V4.createElement($, {
    color: "remember"
  }, "/extra-usage"), " ", "to pay per use"))), G && V4.createElement($, {
    dimColor: !0,
    italic: !0
  }, W.pending ? V4.createElement(V4.Fragment, null, "Press ", W.keyName, " again to exit") : V4.createElement(V4.Fragment, null, "Enter to confirm · Esc to exit"))))
}
// @from(Start 13980391, End 13980393)
V4
// @from(Start 13980395, End 13980398)
fY1
// @from(Start 13980400, End 13980425)
dV0 = "__NO_PREFERENCE__"
// @from(Start 13980431, End 13980543)
cV0 = L(() => {
  hA();
  t2();
  J5();
  Q4();
  gB();
  BK();
  u2();
  V4 = BA(VA(), 1), fY1 = BA(VA(), 1)
})
// @from(Start 13980546, End 13982690)
function gY1({
  onDone: A,
  isStandaloneDialog: Q
}) {
  MC.default.useEffect(() => {
    GA("tengu_claude_md_includes_dialog_shown", {})
  }, []);

  function B(Z) {
    let I = j5();
    if (Z === "no") GA("tengu_claude_md_external_includes_dialog_declined", {}), AY({
      ...I,
      hasClaudeMdExternalIncludesApproved: !1,
      hasClaudeMdExternalIncludesWarningShown: !0
    });
    else GA("tengu_claude_md_external_includes_dialog_accepted", {}), AY({
      ...I,
      hasClaudeMdExternalIncludesApproved: !0,
      hasClaudeMdExternalIncludesWarningShown: !0
    });
    A()
  }
  let G = EQ();
  return f1((Z, I) => {
    if (I.escape) {
      B("no");
      return
    }
  }), MC.default.createElement(MC.default.Fragment, null, MC.default.createElement(S, {
    flexDirection: "column",
    gap: 1,
    paddingX: Q ? 1 : 0,
    marginBottom: 1,
    borderStyle: Q ? "round" : void 0,
    borderTop: Q,
    borderLeft: !1,
    borderRight: !1,
    borderBottom: !1,
    borderColor: "warning"
  }, MC.default.createElement($, {
    bold: !0,
    color: "warning"
  }, "Allow external CLAUDE.md file imports?"), MC.default.createElement($, null, "This project's CLAUDE.md imports files outside the current working directory. Never allow this for third-party repositories."), MC.default.createElement($, {
    dimColor: !0
  }, "Important: Only use Claude Code with files you trust. Accessing untrusted files may pose security risks", " ", MC.default.createElement(h4, {
    url: "https://code.claude.com/docs/en/security"
  }), " "), MC.default.createElement(M0, {
    options: [{
      label: "Yes, allow external imports",
      value: "yes"
    }, {
      label: "No, disable external imports",
      value: "no"
    }],
    onChange: (Z) => B(Z),
    onCancel: () => B("no")
  })), Q && MC.default.createElement(S, {
    marginLeft: 1
  }, MC.default.createElement($, {
    dimColor: !0,
    italic: !0
  }, G.pending ? MC.default.createElement(MC.default.Fragment, null, "Press ", G.keyName, " again to exit") : MC.default.createElement(MC.default.Fragment, null, "Enter to confirm · Esc to disable external includes"))))
}
// @from(Start 13982695, End 13982697)
MC
// @from(Start 13982703, End 13982788)
pV0 = L(() => {
  hA();
  J5();
  jQ();
  q0();
  Q4();
  hA();
  MC = BA(VA(), 1)
})
// @from(Start 13982791, End 13982942)
function dV9(A) {
  return Object.entries(A).map(([Q, B]) => ({
    label: B?.name ?? Py3,
    value: Q,
    description: B?.description ?? jy3
  }))
}
// @from(Start 13982944, End 13983897)
function uY1({
  initialStyle: A,
  onComplete: Q,
  onCancel: B,
  isStandaloneCommand: G
}) {
  let [Z, I] = dQA.useState([]), [Y, J] = dQA.useState(!0);
  dQA.useEffect(() => {
    cQA().then((X) => {
      let V = dV9(X);
      I(V), J(!1)
    }).catch(() => {
      let X = dV9(TQA);
      I(X), J(!1)
    })
  }, []);
  let W = dQA.useCallback((X) => {
    Q(X)
  }, [Q]);
  return IN.createElement(hD, {
    title: "Preferred output style",
    onCancel: B,
    borderDimColor: !0,
    hideInputGuide: !G,
    hideBorder: !G
  }, IN.createElement(S, {
    flexDirection: "column",
    gap: 1
  }, IN.createElement(S, {
    marginTop: 1
  }, IN.createElement($, {
    dimColor: !0
  }, "This changes how Claude Code communicates with you")), Y ? IN.createElement($, {
    dimColor: !0
  }, "Loading output styles…") : IN.createElement(M0, {
    options: Z,
    onChange: W,
    onCancel: B,
    visibleOptionCount: 10,
    defaultValue: A
  })))
}
// @from(Start 13983902, End 13983904)
IN
// @from(Start 13983906, End 13983909)
dQA
// @from(Start 13983911, End 13983926)
Py3 = "Default"
// @from(Start 13983930, End 13984010)
jy3 = "Claude completes coding tasks efficiently and provides concise responses"
// @from(Start 13984016, End 13984104)
lV0 = L(() => {
  hA();
  S5();
  Gx();
  Mi();
  IN = BA(VA(), 1), dQA = BA(VA(), 1)
})
// @from(Start 13984107, End 13998643)
function cV9({
  onClose: A,
  context: Q,
  setTabsHidden: B,
  setIsWarning: G,
  setHideMargin: Z
}) {
  let [I, Y] = qB(), [J, W] = pQA.useState(N1()), X = vQ.useRef(N1()), [V, F] = pQA.useState(l0()), [K, D] = pQA.useState(V?.outputStyle || wK), H = vQ.useRef(K), [C, E] = pQA.useState(0), [{
    mainLoopModel: U,
    verbose: q
  }, w] = OQ(), [N, R] = pQA.useState({}), [T, y] = pQA.useState(null), v = SQ1(Q.options.mcpClients), x = !Y0(process.env.CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING), p = b00();
  async function u(k) {
    GA("tengu_config_model_changed", {
      from_model: U,
      to_model: k
    }), w((o) => ({
      ...o,
      mainLoopModel: k
    })), R((o) => {
      let IA = YM(k);
      if ("model" in o) {
        let {
          model: FA,
          ...zA
        } = o;
        return {
          ...zA,
          model: IA
        }
      }
      return {
        ...o,
        model: IA
      }
    })
  }

  function e(k) {
    let m = {
      ...N1(),
      verbose: k
    };
    c0(m), W(m), w((o) => ({
      ...o,
      verbose: k
    })), R((o) => {
      if ("verbose" in o) {
        let {
          verbose: IA,
          ...FA
        } = o;
        return FA
      }
      return {
        ...o,
        verbose: k
      }
    })
  }
  let l = [{
    id: "autoCompactEnabled",
    label: "Auto-compact",
    value: J.autoCompactEnabled,
    type: "boolean",
    onChange(k) {
      let m = {
        ...N1(),
        autoCompactEnabled: k
      };
      c0(m), W(m), GA("tengu_auto_compact_setting_changed", {
        enabled: k
      })
    }
  }, {
    id: "spinnerTipsEnabled",
    label: "Show tips",
    value: V?.spinnerTipsEnabled ?? !0,
    type: "boolean",
    onChange(k) {
      cB("localSettings", {
        spinnerTipsEnabled: k
      }), F((m) => ({
        ...m,
        spinnerTipsEnabled: k
      })), GA("tengu_tips_setting_changed", {
        enabled: k
      })
    }
  }, ...x ? [{
    id: "fileCheckpointingEnabled",
    label: "Rewind code (checkpoints)",
    value: J.fileCheckpointingEnabled,
    type: "boolean",
    onChange(k) {
      let m = {
        ...N1(),
        fileCheckpointingEnabled: k
      };
      c0(m), W(m), GA("tengu_file_history_snapshots_setting_changed", {
        enabled: k
      })
    }
  }] : [], {
    id: "verbose",
    label: "Verbose output",
    value: q,
    type: "boolean",
    onChange: e
  }, {
    id: "terminalProgressBarEnabled",
    label: "Terminal progress bar",
    value: J.terminalProgressBarEnabled,
    type: "boolean",
    onChange(k) {
      let m = {
        ...N1(),
        terminalProgressBarEnabled: k
      };
      c0(m), W(m), GA("tengu_terminal_progress_bar_setting_changed", {
        enabled: k
      })
    }
  }, {
    id: "defaultPermissionMode",
    label: "Default permission mode",
    value: V?.permissions?.defaultMode || "default",
    options: (() => {
      let k = ["default", "plan"],
        m = ["bypassPermissions"];
      return [...k, ...kR.filter((o) => !k.includes(o) && !m.includes(o))]
    })(),
    type: "enum",
    onChange(k) {
      let m = nxA(k),
        o = cB("userSettings", {
          permissions: {
            ...V?.permissions,
            defaultMode: m
          }
        });
      if (o.error) {
        AA(o.error);
        return
      }
      F((IA) => ({
        ...IA,
        permissions: {
          ...IA?.permissions,
          defaultMode: m
        }
      })), R((IA) => ({
        ...IA,
        defaultPermissionMode: k
      })), GA("tengu_config_changed", {
        setting: "defaultPermissionMode",
        value: k
      })
    }
  }, {
    id: "respectGitignore",
    label: "Respect .gitignore in file picker",
    value: J.respectGitignore,
    type: "boolean",
    onChange(k) {
      let m = {
        ...N1(),
        respectGitignore: k
      };
      c0(m), W(m), GA("tengu_respect_gitignore_setting_changed", {
        enabled: k
      })
    }
  }, {
    id: "theme",
    label: "Theme",
    value: I,
    type: "managedEnum",
    onChange: Y
  }, {
    id: "notifChannel",
    label: "Notifications",
    value: J.preferredNotifChannel,
    options: ["auto", "iterm2", "terminal_bell", "iterm2_with_bell", "kitty", "ghostty", "notifications_disabled"],
    type: "enum",
    onChange(k) {
      let m = {
        ...N1(),
        preferredNotifChannel: k
      };
      c0(m), W(m)
    }
  }, {
    id: "outputStyle",
    label: "Output style",
    value: K,
    type: "managedEnum",
    onChange: () => {}
  }, {
    id: "editorMode",
    label: "Editor mode",
    value: J.editorMode === "emacs" ? "normal" : J.editorMode || "normal",
    options: ["normal", "vim"],
    type: "enum",
    onChange(k) {
      let m = {
        ...N1(),
        editorMode: k
      };
      c0(m), W(m), GA("tengu_editor_mode_changed", {
        mode: k,
        source: "config_panel"
      })
    }
  }, {
    id: "model",
    label: "Model",
    value: U === null ? "Default (recommended)" : U,
    type: "managedEnum",
    onChange: u
  }, ...v ? [{
    id: "diffTool",
    label: "Diff tool",
    value: J.diffTool ?? "auto",
    options: ["terminal", "auto"],
    type: "enum",
    onChange(k) {
      let m = {
        ...N1(),
        diffTool: k
      };
      c0(m), W(m), GA("tengu_diff_tool_changed", {
        tool: k,
        source: "config_panel"
      })
    }
  }] : [], ...!bV() ? [{
    id: "autoConnectIde",
    label: "Auto-connect to IDE (external terminal)",
    value: J.autoConnectIde ?? !1,
    type: "boolean",
    onChange(k) {
      let m = {
        ...N1(),
        autoConnectIde: k
      };
      c0(m), W(m), GA("tengu_auto_connect_ide_changed", {
        enabled: k,
        source: "config_panel"
      })
    }
  }] : [], ...bV() ? [{
    id: "autoInstallIdeExtension",
    label: "Auto-install IDE extension",
    value: J.autoInstallIdeExtension ?? !0,
    type: "boolean",
    onChange(k) {
      let m = {
        ...N1(),
        autoInstallIdeExtension: k
      };
      c0(m), W(m), GA("tengu_auto_install_ide_extension_changed", {
        enabled: k,
        source: "config_panel"
      })
    }
  }] : [], ...p ? [{
    id: "showExternalIncludesDialog",
    label: "External CLAUDE.md includes",
    value: (() => {
      if (j5().hasClaudeMdExternalIncludesApproved) return "true";
      else return "false"
    })(),
    type: "managedEnum",
    onChange() {}
  }] : [], ...process.env.ANTHROPIC_API_KEY ? [{
    id: "apiKey",
    label: `Use custom API key: ${tA.bold(dw(process.env.ANTHROPIC_API_KEY))}`,
    value: Boolean(process.env.ANTHROPIC_API_KEY && J.customApiKeyResponses?.approved?.includes(dw(process.env.ANTHROPIC_API_KEY))),
    type: "boolean",
    onChange(k) {
      let m = {
        ...N1()
      };
      if (!m.customApiKeyResponses) m.customApiKeyResponses = {
        approved: [],
        rejected: []
      };
      if (!m.customApiKeyResponses.approved) m.customApiKeyResponses.approved = [];
      if (!m.customApiKeyResponses.rejected) m.customApiKeyResponses.rejected = [];
      if (process.env.ANTHROPIC_API_KEY) {
        let o = dw(process.env.ANTHROPIC_API_KEY);
        if (k) m.customApiKeyResponses.approved = [...m.customApiKeyResponses.approved.filter((IA) => IA !== o), o], m.customApiKeyResponses.rejected = m.customApiKeyResponses.rejected.filter((IA) => IA !== o);
        else m.customApiKeyResponses.approved = m.customApiKeyResponses.approved.filter((IA) => IA !== o), m.customApiKeyResponses.rejected = [...m.customApiKeyResponses.rejected.filter((IA) => IA !== o), o]
      }
      c0(m), W(m)
    }
  }] : []];
  return f1((k, m) => {
    if (m.escape) {
      if (T !== null) {
        B(!1), G(!1), Z(!1), y(null);
        return
      }
      let IA = Object.entries(N).map(([NA, OA]) => {
          return GA("tengu_config_changed", {
            key: NA,
            value: OA
          }), `Set ${NA} to ${tA.bold(OA)}`
        }),
        FA = Boolean(process.env.ANTHROPIC_API_KEY && X.current.customApiKeyResponses?.approved?.includes(dw(process.env.ANTHROPIC_API_KEY))),
        zA = Boolean(process.env.ANTHROPIC_API_KEY && J.customApiKeyResponses?.approved?.includes(dw(process.env.ANTHROPIC_API_KEY)));
      if (FA !== zA) IA.push(`${zA?"Enabled":"Disabled"} custom API key`), GA("tengu_config_changed", {
        key: "env.ANTHROPIC_API_KEY",
        value: zA
      });
      if (J.theme !== X.current.theme) IA.push(`Set theme to ${tA.bold(J.theme)}`);
      if (J.preferredNotifChannel !== X.current.preferredNotifChannel) IA.push(`Set notifications to ${tA.bold(J.preferredNotifChannel)}`);
      if (K !== H.current) IA.push(`Set output style to ${tA.bold(K)}`);
      if (J.editorMode !== X.current.editorMode) IA.push(`Set editor mode to ${tA.bold(J.editorMode||"emacs")}`);
      if (J.diffTool !== X.current.diffTool) IA.push(`Set diff tool to ${tA.bold(J.diffTool)}`);
      if (J.autoConnectIde !== X.current.autoConnectIde) IA.push(`${J.autoConnectIde?"Enabled":"Disabled"} auto-connect to IDE`);
      if (J.autoInstallIdeExtension !== X.current.autoInstallIdeExtension) IA.push(`${J.autoInstallIdeExtension?"Enabled":"Disabled"} auto-install IDE extension`);
      if (J.autoCompactEnabled !== X.current.autoCompactEnabled) IA.push(`${J.autoCompactEnabled?"Enabled":"Disabled"} auto-compact`);
      if (J.respectGitignore !== X.current.respectGitignore) IA.push(`${J.respectGitignore?"Enabled":"Disabled"} respect .gitignore in file picker`);
      if (J.terminalProgressBarEnabled !== X.current.terminalProgressBarEnabled) IA.push(`${J.terminalProgressBarEnabled?"Enabled":"Disabled"} terminal progress bar`);
      if (IA.length > 0) A(IA.join(`
`));
      else A("Config dialog dismissed", {
        display: "system"
      });
      return
    }
    if (T !== null) return;

    function o() {
      let IA = l[C];
      if (!IA || !IA.onChange) return;
      if (IA.type === "boolean") {
        IA.onChange(!IA.value);
        return
      }
      if (IA.id === "theme" && m.return) {
        y(0), B(!0), Z(!0);
        return
      }
      if (IA.id === "model" && m.return) {
        y(1), B(!0);
        return
      }
      if (IA.id === "showExternalIncludesDialog" && m.return) {
        y(2), B(!0), G(!0);
        return
      }
      if (IA.id === "outputStyle" && m.return) {
        y(3), B(!0);
        return
      }
      if (IA.type === "enum") {
        let zA = (IA.options.indexOf(IA.value) + 1) % IA.options.length;
        IA.onChange(IA.options[zA]);
        return
      }
    }
    if (m.return || k === " ") {
      o();
      return
    }
    if (m.upArrow) E((IA) => Math.max(0, IA - 1));
    if (m.downArrow) E((IA) => Math.min(l.length - 1, IA + 1))
  }), vQ.createElement(S, {
    flexDirection: "column",
    width: "100%"
  }, T === 0 ? vQ.createElement(vQ.Fragment, null, vQ.createElement(bY1, {
    initialTheme: I,
    onThemeSelect: (k) => {
      Y(k), y(null), Z(!1), B(!1)
    },
    hideEscToCancel: !0,
    skipExitHandling: !0
  }), vQ.createElement(S, {
    marginLeft: 1
  }, vQ.createElement($, {
    dimColor: !0,
    italic: !0
  }, "Esc to exit"))) : T === 1 ? vQ.createElement(vQ.Fragment, null, vQ.createElement(hY1, {
    initial: U,
    onSelect: (k) => {
      u(k), y(null), B(!1)
    }
  }), vQ.createElement($, {
    dimColor: !0,
    italic: !0
  }, "Enter to confirm · Esc to exit")) : T === 2 ? vQ.createElement(vQ.Fragment, null, vQ.createElement(gY1, {
    onDone: () => {
      y(null), B(!1), G(!1)
    }
  }), vQ.createElement($, {
    dimColor: !0,
    italic: !0
  }, "Enter to confirm · Esc to disable external includes")) : T === 3 ? vQ.createElement(vQ.Fragment, null, vQ.createElement(uY1, {
    initialStyle: K,
    onComplete: (k) => {
      D(k ?? wK), y(null), B(!1), cB("localSettings", {
        outputStyle: k
      }), GA("tengu_output_style_changed", {
        style: k ?? wK,
        source: "config_panel",
        settings_source: "localSettings"
      })
    },
    onCancel: () => {
      y(null), B(!1)
    }
  }), vQ.createElement($, {
    dimColor: !0,
    italic: !0
  }, "Enter to confirm · Esc to exit")) : vQ.createElement(S, {
    flexDirection: "column",
    marginY: 1,
    gap: 1
  }, vQ.createElement($, null, "Configure Claude Code preferences"), vQ.createElement(S, {
    flexDirection: "column"
  }, l.map((k, m) => {
    let o = m === C;
    return vQ.createElement(S, {
      key: k.id
    }, vQ.createElement(S, {
      width: 44
    }, vQ.createElement($, {
      color: o ? "suggestion" : void 0
    }, o ? H1.pointer : " ", " ", k.label)), vQ.createElement(S, null, k.type === "boolean" ? vQ.createElement($, {
      color: o ? "suggestion" : void 0
    }, k.value.toString()) : k.id === "theme" ? vQ.createElement($, {
      color: o ? "suggestion" : void 0
    }, (() => {
      return {
        dark: "Dark mode",
        light: "Light mode",
        "dark-daltonized": "Dark mode (colorblind-friendly)",
        "light-daltonized": "Light mode (colorblind-friendly)",
        "dark-ansi": "Dark mode (ANSI colors only)",
        "light-ansi": "Light mode (ANSI colors only)"
      } [k.value.toString()] || k.value.toString()
    })()) : k.id === "notifChannel" ? vQ.createElement($, {
      color: o ? "suggestion" : void 0
    }, (() => {
      switch (k.value.toString()) {
        case "auto":
          return "Auto";
        case "iterm2":
          return vQ.createElement(vQ.Fragment, null, "iTerm2 ", vQ.createElement($, {
            dimColor: !0
          }, "(OSC 9)"));
        case "terminal_bell":
          return vQ.createElement(vQ.Fragment, null, "Terminal Bell ", vQ.createElement($, {
            dimColor: !0
          }, "(\\a)"));
        case "kitty":
          return vQ.createElement(vQ.Fragment, null, "Kitty ", vQ.createElement($, {
            dimColor: !0
          }, "(OSC 99)"));
        case "ghostty":
          return vQ.createElement(vQ.Fragment, null, "Ghostty ", vQ.createElement($, {
            dimColor: !0
          }, "(OSC 777)"));
        case "iterm2_with_bell":
          return "iTerm2 w/ Bell";
        case "notifications_disabled":
          return "Disabled";
        default:
          return k.value.toString()
      }
    })()) : k.id === "defaultPermissionMode" ? vQ.createElement($, {
      color: o ? "suggestion" : void 0
    }, Fv(k.value)) : vQ.createElement($, {
      color: o ? "suggestion" : void 0
    }, k.value.toString())))
  })), vQ.createElement($, {
    dimColor: !0,
    italic: !0
  }, "Enter/Space to change · Esc to exit")))
}
// @from(Start 13998648, End 13998650)
vQ
// @from(Start 13998652, End 13998655)
pQA
// @from(Start 13998661, End 13998882)
pV9 = L(() => {
  hA();
  V9();
  jQ();
  vzA();
  jQ();
  F9();
  Zw();
  g1();
  q0();
  mV0();
  z9();
  cV0();
  t2();
  pV0();
  lV0();
  gE();
  nY();
  MB();
  Gx();
  hQ();
  vQ = BA(VA(), 1), pQA = BA(VA(), 1)
})
// @from(Start 13998884, End 13999286)
async function iV0() {
  if (!BB()) return {};
  let A = M6();
  if (A && Ad(A.expiresAt)) return null;
  let Q = DI();
  if (Q.error) throw Error(`Auth error: ${Q.error}`);
  let B = {
      "Content-Type": "application/json",
      "User-Agent": TV(),
      ...Q.headers
    },
    G = `${e9().BASE_API_URL}/api/oauth/usage`;
  return (await YQ.get(G, {
    headers: B,
    timeout: 5000
  })).data
}