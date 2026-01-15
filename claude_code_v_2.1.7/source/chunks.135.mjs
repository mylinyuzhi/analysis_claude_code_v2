
// @from(Ln 396887, Col 0)
async function* v19({
  commands: A,
  prompt: Q,
  promptUuid: B,
  cwd: G,
  tools: Z,
  mcpClients: Y,
  verbose: J = !1,
  maxThinkingTokens: X,
  maxTurns: I,
  maxBudgetUsd: D,
  canUseTool: W,
  mutableMessages: K = [],
  customSystemPrompt: V,
  appendSystemPrompt: F,
  userSpecifiedModel: H,
  fallbackModel: E,
  jsonSchema: z,
  getAppState: $,
  setAppState: O,
  abortController: L,
  replayUserMessages: M = !1,
  includePartialMessages: _ = !1,
  agents: j = [],
  setSDKStatus: x,
  orphanedPermission: b
}) {
  DO(G);
  let S = !cAA(),
    u = Date.now(),
    f = [],
    AA = async (y1, qQ, K1, $1, i1, Q0) => {
      let c0 = await W(y1, qQ, K1, $1, i1, Q0);
      if (c0.behavior !== "allow") {
        let b0 = {
          tool_name: y1.name,
          tool_use_id: i1,
          tool_input: qQ
        };
        f.push(b0)
      }
      return c0
    }, n = await $(), y = H ? FX(H) : B5(), [p, GA, WA] = await Promise.all([rc(Z, y, Array.from(n.toolPermissionContext.additionalWorkingDirectories.keys()), Y), ZV(), typeof V === "string" ? Promise.resolve({}) : OF()]), MA = [...typeof V === "string" ? [V] : p, ...F ? [F] : []], TA = Z.some((y1) => y1.name === JE);
  if (z && TA) GY1(O, q0());
  let bA = {
    messages: K,
    setMessages: () => {},
    onChangeAPIKey: () => {},
    options: {
      commands: A,
      debug: !1,
      tools: Z,
      verbose: J,
      mainLoopModel: y,
      maxThinkingTokens: X ?? 0,
      mcpClients: Y,
      mcpResources: {},
      ideInstallationStatus: null,
      isNonInteractiveSession: !0,
      customSystemPrompt: V,
      appendSystemPrompt: F,
      agentDefinitions: {
        activeAgents: j,
        allAgents: []
      },
      theme: L1().theme,
      maxBudgetUsd: D
    },
    getAppState: $,
    setAppState: O,
    abortController: L ?? c9(),
    readFileState: VzA(K, G),
    setInProgressToolUseIDs: () => {},
    setResponseLength: () => {},
    updateFileHistoryState: (y1) => {
      O((qQ) => ({
        ...qQ,
        fileHistory: y1(qQ.fileHistory)
      }))
    },
    updateAttributionState: (y1) => {
      O((qQ) => ({
        ...qQ,
        attribution: y1(qQ.attribution)
      }))
    },
    setSDKStatus: x
  };
  if (b)
    for await (let y1 of GG7(b, Z, K, bA)) yield y1;
  let {
    messages: jA,
    shouldQuery: OA,
    allowedTools: IA,
    maxThinkingTokens: HA,
    model: ZA,
    resultText: zA
  } = await vH1({
    input: Q,
    mode: "prompt",
    setIsLoading: () => {},
    setToolJSX: () => {},
    context: {
      ...bA,
      messages: K
    },
    messages: K,
    uuid: B,
    querySource: "sdk"
  });
  K.push(...jA);
  let wA = X ?? HA ?? 0,
    _A = [...K],
    s = jA.filter((y1) => y1.type === "user" && !y1.isMeta && !y1.toolUseResult || y1.type === "system" && y1.subtype === "compact_boundary"),
    t = M ? s : [];
  O((y1) => ({
    ...y1,
    toolPermissionContext: {
      ...y1.toolPermissionContext,
      alwaysAllowRules: {
        ...y1.toolPermissionContext.alwaysAllowRules,
        command: IA
      }
    }
  }));
  let BA = ZA ?? y,
    DA = VzA(_A, G),
    CA = MKA(DA, bA.readFileState);
  bA = {
    messages: _A,
    setMessages: () => {},
    onChangeAPIKey: () => {},
    options: {
      commands: A,
      debug: !1,
      tools: Z,
      verbose: J,
      mainLoopModel: BA,
      maxThinkingTokens: wA,
      mcpClients: Y,
      mcpResources: {},
      ideInstallationStatus: null,
      isNonInteractiveSession: !0,
      customSystemPrompt: V,
      appendSystemPrompt: F,
      theme: L1().theme,
      agentDefinitions: {
        activeAgents: j,
        allAgents: []
      },
      maxBudgetUsd: D
    },
    getAppState: $,
    setAppState: O,
    abortController: L || c9(),
    readFileState: CA,
    setInProgressToolUseIDs: () => {},
    setResponseLength: () => {},
    updateFileHistoryState: bA.updateFileHistoryState,
    updateAttributionState: bA.updateAttributionState,
    setSDKStatus: x
  };
  let xA = jQ()?.outputStyle ?? vF,
    [mA, {
      enabled: G1
    }] = await Promise.all([hD1(o1()), DG()]);
  if (yield {
      type: "system",
      subtype: "init",
      cwd: G,
      session_id: q0(),
      tools: Z.map((y1) => y1.name),
      mcp_servers: Y.map((y1) => ({
        name: y1.name,
        status: y1.type
      })),
      model: BA,
      permissionMode: n.toolPermissionContext.mode,
      slash_commands: A.map((y1) => y1.name),
      apiKeySource: Oz().source,
      betas: SM(),
      claude_code_version: {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.7",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-01-13T22:55:21Z"
      }.VERSION,
      output_style: xA,
      agents: j.map((y1) => y1.agentType),
      skills: mA.map((y1) => y1.name),
      plugins: G1.map((y1) => ({
        name: y1.name,
        path: y1.path
      })),
      uuid: Ze()
    }, j3A("system_message_yielded"), !OA) {
    for (let y1 of s) {
      if (y1.type === "user" && typeof y1.message.content === "string" && (y1.message.content.includes("<local-command-stdout>") || y1.message.content.includes("<local-command-stderr>") || y1.isCompactSummary)) _A.push(y1), yield {
        type: "user",
        message: {
          ...y1.message,
          content: jZ(y1.message.content)
        },
        session_id: q0(),
        parent_tool_use_id: null,
        uuid: y1.uuid,
        isReplay: !y1.isCompactSummary
      };
      if (y1.type === "system" && y1.subtype === "compact_boundary") _A.push(y1), yield {
        type: "system",
        subtype: "compact_boundary",
        session_id: q0(),
        uuid: y1.uuid,
        compact_metadata: {
          trigger: y1.compactMetadata.trigger,
          pre_tokens: y1.compactMetadata.preTokens
        }
      }
    }
    if (S) await tc(_A);
    yield {
      type: "result",
      subtype: "success",
      is_error: !1,
      duration_ms: Date.now() - u,
      duration_api_ms: PM(),
      num_turns: _A.length - 1,
      result: zA ?? "",
      session_id: q0(),
      total_cost_usd: $H(),
      usage: Cj,
      modelUsage: jy(),
      permission_denials: f,
      uuid: Ze()
    };
    return
  }
  if (vG() && S) jA.filter(uhA).forEach((y1) => {
    MHA((qQ) => {
      O((K1) => ({
        ...K1,
        fileHistory: qQ(K1.fileHistory)
      }))
    }, y1.uuid)
  });
  let J1 = Cj,
    SA = Cj,
    A1 = 1,
    n1 = !1,
    S1, L0 = z ? NM0(K, JE) : 0;
  for await (let y1 of aN({
    messages: _A,
    systemPrompt: MA,
    userContext: GA,
    systemContext: WA,
    canUseTool: AA,
    toolUseContext: bA,
    fallbackModel: E,
    querySource: "sdk",
    maxTurns: I
  })) {
    if (y1.type === "assistant" || y1.type === "user" || y1.type === "system" && y1.subtype === "compact_boundary") {
      if (_A.push(y1), S) await tc(_A);
      if (!n1 && t.length > 0) {
        n1 = !0;
        for (let qQ of t)
          if (qQ.type === "user") yield {
            type: "user",
            message: qQ.message,
            session_id: q0(),
            parent_tool_use_id: null,
            uuid: qQ.uuid,
            isReplay: !0
          }
      }
    }
    if (y1.type === "user") A1++;
    switch (y1.type) {
      case "tombstone":
        break;
      case "assistant":
      case "progress":
      case "user":
        K.push(y1), yield* XG7(y1);
        break;
      case "stream_event":
        if (y1.event.type === "message_start") SA = Cj, SA = dhA(SA, y1.event.message.usage);
        if (y1.event.type === "message_delta") SA = dhA(SA, y1.event.usage);
        if (y1.event.type === "message_stop") J1 = SH1(J1, SA);
        if (_) yield {
          type: "stream_event",
          event: y1.event,
          session_id: q0(),
          parent_tool_use_id: null,
          uuid: Ze()
        };
        break;
      case "attachment":
        if (K.push(y1), rr2(y1.attachment)) yield {
          type: "system",
          subtype: "hook_response",
          session_id: q0(),
          uuid: y1.uuid,
          hook_name: y1.attachment.hookName,
          hook_event: y1.attachment.hookEvent,
          stdout: y1.attachment.stdout,
          stderr: y1.attachment.stderr,
          exit_code: y1.attachment.exitCode
        };
        else if (mF1(y1.attachment)) yield {
          type: "system",
          subtype: "hook_response",
          session_id: q0(),
          uuid: y1.uuid,
          hook_name: y1.attachment.hookName,
          hook_event: y1.attachment.hookEvent,
          stdout: y1.attachment.stdout || "",
          stderr: y1.attachment.stderr || "",
          exit_code: y1.attachment.exitCode
        };
        else if (M && uF1(y1)) {
          let qQ = y1.attachment;
          if (qQ.type === "queued_command") yield {
            type: "user",
            message: {
              role: "user",
              content: typeof qQ.prompt === "string" ? qQ.prompt : qQ.prompt
            },
            session_id: q0(),
            parent_tool_use_id: null,
            uuid: qQ.source_uuid || y1.uuid,
            isReplay: !0
          }
        } else if (y1.attachment.type === "structured_output") S1 = y1.attachment.data;
        else if (y1.attachment.type === "max_turns_reached") {
          yield {
            type: "result",
            subtype: "error_max_turns",
            duration_ms: Date.now() - u,
            duration_api_ms: PM(),
            is_error: !1,
            num_turns: y1.attachment.turnCount,
            session_id: q0(),
            total_cost_usd: $H(),
            usage: J1,
            modelUsage: jy(),
            permission_denials: f,
            uuid: Ze(),
            errors: []
          };
          return
        }
        break;
      case "stream_request_start":
        break;
      case "system":
        if (K.push(y1), y1.subtype === "compact_boundary" && y1.compactMetadata) yield {
          type: "system",
          subtype: "compact_boundary",
          session_id: q0(),
          uuid: y1.uuid,
          compact_metadata: {
            trigger: y1.compactMetadata.trigger,
            pre_tokens: y1.compactMetadata.preTokens
          }
        };
        break
    }
    if (D !== void 0 && $H() >= D) {
      yield {
        type: "result",
        subtype: "error_max_budget_usd",
        duration_ms: Date.now() - u,
        duration_api_ms: PM(),
        is_error: !1,
        num_turns: A1,
        session_id: q0(),
        total_cost_usd: $H(),
        usage: J1,
        modelUsage: jy(),
        permission_denials: f,
        uuid: Ze(),
        errors: []
      };
      return
    }
    if (y1.type === "user" && z) {
      let K1 = NM0(K, JE) - L0,
        $1 = parseInt(process.env.MAX_STRUCTURED_OUTPUT_RETRIES || "5", 10);
      if (K1 >= $1) {
        yield {
          type: "result",
          subtype: "error_max_structured_output_retries",
          duration_ms: Date.now() - u,
          duration_api_ms: PM(),
          is_error: !1,
          num_turns: A1,
          session_id: q0(),
          total_cost_usd: $H(),
          usage: J1,
          modelUsage: jy(),
          permission_denials: f,
          uuid: Ze(),
          errors: [`Failed to provide valid structured output after ${$1} attempts`]
        };
        return
      }
    }
  }
  let VQ = QC(_A);
  if (!ZG7(VQ)) {
    yield {
      type: "result",
      subtype: "error_during_execution",
      duration_ms: Date.now() - u,
      duration_api_ms: PM(),
      is_error: !1,
      num_turns: A1,
      session_id: q0(),
      total_cost_usd: $H(),
      usage: J1,
      modelUsage: jy(),
      permission_denials: f,
      uuid: Ze(),
      errors: E7A().map((y1) => y1.error)
    };
    return
  }
  let t0 = "",
    QQ = !1;
  if (VQ.type === "assistant") {
    let y1 = QC(VQ.message.content);
    if (y1?.type === "text") t0 = y1.text;
    QQ = Boolean(VQ.isApiErrorMessage)
  }
  yield {
    type: "result",
    subtype: "success",
    is_error: QQ,
    duration_ms: Date.now() - u,
    duration_api_ms: PM(),
    num_turns: A1,
    result: t0,
    session_id: q0(),
    total_cost_usd: $H(),
    usage: J1,
    modelUsage: jy(),
    permission_denials: f,
    structured_output: S1,
    uuid: Ze()
  }
}
// @from(Ln 397342, Col 0)
function* XG7(A) {
  switch (A.type) {
    case "assistant":
      for (let Q of a7([A])) yield {
        type: "assistant",
        message: Q.message,
        parent_tool_use_id: null,
        session_id: q0(),
        uuid: Q.uuid,
        error: Q.error
      };
      return;
    case "progress":
      if (A.data.type === "agent_progress")
        for (let Q of a7([A.data.message])) switch (Q.type) {
          case "assistant":
            yield {
              type: "assistant", message: Q.message, parent_tool_use_id: A.parentToolUseID, session_id: q0(), uuid: Q.uuid, error: Q.error
            };
            break;
          case "user":
            yield {
              type: "user", message: Q.message, parent_tool_use_id: A.parentToolUseID, session_id: q0(), uuid: Q.uuid, isSynthetic: Q.isMeta || Q.isVisibleInTranscriptOnly, tool_use_result: Q.toolUseResult
            };
            break
        } else if (A.data.type === "bash_progress") {
          if (!process.env.CLAUDE_CODE_REMOTE && !process.env.CLAUDE_CODE_CONTAINER_ID) break;
          let Q = A.parentToolUseID,
            B = Date.now(),
            G = mhA.get(Q) || 0;
          if (B - G >= JG7) {
            if (mhA.size >= YG7) {
              let Y = mhA.keys().next().value;
              if (Y !== void 0) mhA.delete(Y)
            }
            mhA.set(Q, B), yield {
              type: "tool_progress",
              tool_use_id: A.toolUseID,
              tool_name: "Bash",
              parent_tool_use_id: A.parentToolUseID,
              elapsed_time_seconds: A.data.elapsedTimeSeconds,
              session_id: q0(),
              uuid: A.uuid
            }
          }
        } break;
    case "user":
      for (let Q of a7([A])) yield {
        type: "user",
        message: Q.message,
        parent_tool_use_id: null,
        session_id: q0(),
        uuid: Q.uuid,
        isSynthetic: Q.isMeta || Q.isVisibleInTranscriptOnly,
        tool_use_result: Q.toolUseResult
      };
      return;
    default:
  }
}
// @from(Ln 397403, Col 0)
function VzA(A, Q, B = BG7) {
  let G = Id(B),
    Z = new Map,
    Y = new Map;
  for (let J of A)
    if (J.type === "assistant" && Array.isArray(J.message.content)) {
      for (let X of J.message.content)
        if (X.type === "tool_use" && X.name === z3) {
          let I = X.input;
          if (I?.file_path && I?.offset === void 0 && I?.limit === void 0) {
            let D = Y4(I.file_path, Q);
            Z.set(X.id, D)
          }
        } else if (X.type === "tool_use" && X.name === BY) {
        let I = X.input;
        if (I?.file_path && I?.content) {
          let D = Y4(I.file_path, Q);
          Y.set(X.id, {
            filePath: D,
            content: I.content
          })
        }
      }
    } for (let J of A)
    if (J.type === "user" && Array.isArray(J.message.content)) {
      for (let X of J.message.content)
        if (X.type === "tool_result" && X.tool_use_id) {
          let I = Z.get(X.tool_use_id);
          if (I && typeof X.content === "string") {
            let V = X.content.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "").split(`
`).map((F) => {
              let H = F.match(/^\s*\d+→(.*)$/);
              return H ? H[1] : F
            }).join(`
`).trim();
            if (J.timestamp) {
              let F = new Date(J.timestamp).getTime();
              G.set(I, {
                content: V,
                timestamp: F,
                offset: void 0,
                limit: void 0
              })
            }
          }
          let D = Y.get(X.tool_use_id);
          if (D && J.timestamp) {
            let W = new Date(J.timestamp).getTime();
            G.set(D.filePath, {
              content: D.content,
              timestamp: W,
              offset: void 0,
              limit: void 0
            })
          }
        }
    } return G
}
// @from(Ln 397461, Col 4)
BG7 = 10
// @from(Ln 397462, Col 2)
YG7 = 100
// @from(Ln 397463, Col 2)
JG7 = 30000
// @from(Ln 397464, Col 2)
mhA
// @from(Ln 397465, Col 4)
bH1 = w(() => {
  KGA();
  WV();
  V2();
  wc();
  OS();
  LR();
  ks();
  pC();
  cW();
  pL();
  Vb();
  oZ();
  d4();
  tQ();
  Pr();
  UM0();
  C0();
  l2();
  ZY1();
  rR();
  Q2();
  xhA();
  m_();
  ghA();
  nY();
  GQ();
  iZ();
  Cf();
  GB();
  GK();
  v1();
  oN();
  kH1();
  mhA = new Map
})
// @from(Ln 397516, Col 0)
function chA(A) {
  KG7(A, {
    recursive: !0,
    force: !0,
    maxRetries: 3,
    retryDelay: 100
  }, () => {})
}
// @from(Ln 397525, Col 0)
function zG7(A) {
  return P3A(MM0(), "speculation-clones", `speculation-${A}`)
}
// @from(Ln 397528, Col 0)
async function $G7(A) {
  let Q = await di1(_y());
  if (!Q) return !1;
  let B = await J2("git", ["clone", "--shared", "--no-checkout", Q, A], {
    cwd: Q
  });
  if (B.code !== 0) return k(`[Speculation] Failed to create clone: ${B.stderr}`), !1;
  let G = await J2("git", ["checkout", "HEAD"], {
    cwd: A
  });
  if (G.code !== 0) return k(`[Speculation] Failed to checkout: ${G.stderr}`), chA(A), !1;
  return k(`[Speculation] Created shared clone at ${A}`), !0
}
// @from(Ln 397541, Col 0)
async function CG7(A) {
  let Q = _y(),
    B = await C19(A),
    G = (Z) => {
      let Y = f19(Q, P3A(Q, Z));
      return !b19(Y) && !Y.startsWith("..")
    };
  for (let Z of [...B.stagedFiles, ...B.modifiedFiles, ...B.untrackedFiles].filter(G)) {
    let Y = DG7(P3A(Q, Z));
    WG7(Y, {
      recursive: !0
    });
    let J = await J2("cp", ["-P", "-p", P3A(A, Z), P3A(Q, Z)], {
      cwd: "/"
    });
    if (J.code !== 0) k(`[Speculation] Failed to copy ${Z}: ${J.stderr}`)
  }
  for (let Z of [...B.stagedDeletions, ...B.modifiedDeletions].filter(G)) VG7(P3A(Q, Z), {
    force: !0
  });
  k("[Speculation] Copied clone changes to main")
}
// @from(Ln 397564, Col 0)
function wM0(A, Q, B, G, Z, Y, J) {
  l("tengu_speculation", {
    speculation_id: A,
    outcome: Q,
    duration_ms: Date.now() - B,
    suggestion_length: G,
    tools_executed: LM0(Z),
    completed: Y !== null,
    boundary_type: Y?.type,
    ...J
  })
}
// @from(Ln 397577, Col 0)
function LM0(A) {
  return A.filter(h19).flatMap((Q) => Q.message.content).filter((Q) => typeof Q === "object" && Q !== null && ("type" in Q)).filter((Q) => Q.type === "tool_result" && !Q.is_error).length
}
// @from(Ln 397581, Col 0)
function h19(A) {
  return A.type === "user" && "message" in A && Array.isArray(A.message.content)
}
// @from(Ln 397585, Col 0)
function UG7(A) {
  let Q = (Y) => typeof Y === "object" && Y !== null && Y.type === "tool_result" && typeof Y.tool_use_id === "string",
    B = (Y) => !Y.is_error && !(typeof Y.content === "string" && Y.content.includes(vN)),
    G = new Set(A.filter(h19).flatMap((Y) => Y.message.content).filter(Q).filter(B).map((Y) => Y.tool_use_id)),
    Z = (Y) => Y.type !== "thinking" && Y.type !== "redacted_thinking" && !(Y.type === "tool_use" && !G.has(Y.id)) && !(Y.type === "tool_result" && !G.has(Y.tool_use_id));
  return A.map((Y) => {
    if (!("message" in Y) || !Array.isArray(Y.message.content)) return Y;
    let J = Y.message.content.filter(Z);
    if (J.length === Y.message.content.length) return Y;
    if (J.length === 0) return null;
    return {
      ...Y,
      message: {
        ...Y.message,
        content: J
      }
    }
  }).filter((Y) => Y !== null)
}
// @from(Ln 397605, Col 0)
function qG7(A, Q, B, G) {
  return null
}
// @from(Ln 397609, Col 0)
function k19(A, Q) {
  A((B) => {
    if (B.speculation.status !== "active") return B;
    let G = B.speculation,
      Z = Q(G);
    if (!Object.entries(Z).some(([J, X]) => G[J] !== X)) return B;
    return {
      ...B,
      speculation: {
        ...G,
        ...Z
      }
    }
  })
}
// @from(Ln 397625, Col 0)
function fH1(A) {
  A((Q) => {
    if (Q.speculation.status === "idle") return Q;
    return {
      ...Q,
      speculation: FzA
    }
  })
}
// @from(Ln 397635, Col 0)
function OM0() {
  return k("[Speculation] enabled=false"), !1
}
// @from(Ln 397638, Col 0)
async function g19(A, Q, B) {
  if (!OM0()) return;
  let G = IG7().slice(0, 8),
    Z = BcA(Q.toolUseContext.abortController);
  if (await Promise.race([SwB().then(() => !1), new Promise((K) => {
      if (Z.signal.aborted) K(!0);
      else Z.signal.addEventListener("abort", () => K(!0), {
        once: !0
      })
    })]) || Z.signal.aborted) return;
  let J = Date.now(),
    X = {
      current: []
    },
    I = zG7(G);
  B((K) => ({
    ...K,
    speculation: {
      status: "active",
      id: G,
      abort: () => Z.abort(),
      startTime: J,
      messagesRef: X,
      boundary: null,
      suggestionLength: A.length,
      clonePath: I
    }
  })), k(`[Speculation] Starting speculation ${G}`);
  let D = await $G7(I),
    W = D ? await di1(_y()) : null;
  if (!D || !W) {
    k("[Speculation] Skipping: requires git clone isolation"), chA(I), Z.abort(), fH1(B);
    return
  }
  try {
    let K = await sc({
      promptMessages: [H0({
        content: A
      })],
      cacheSafeParams: T3A(Q),
      canUseTool: async (V, F) => {
        let H = ["Edit", "Write", "NotebookEdit"].includes(V.name),
          E = ["Read", "Glob", "Grep"].includes(V.name);
        if (H || E) {
          let z = "notebook_path" in F ? "notebook_path" : ("path" in F) ? "path" : "file_path",
            $ = F[z];
          if ($) {
            let O = f19(W, $);
            if (b19(O) || O.startsWith("..")) {
              if (H) return k(`[Speculation] Denied ${V.name}: path outside git root: ${$}`), {
                behavior: "deny",
                message: "Write outside git root not allowed during speculation",
                decisionReason: {
                  type: "other",
                  reason: "speculation_write_outside_root"
                }
              };
              return {
                behavior: "allow",
                updatedInput: F,
                decisionReason: {
                  type: "other",
                  reason: "speculation_read_outside_root"
                }
              }
            }
            F = {
              ...F,
              [z]: P3A(I, O)
            }, k(`[Speculation] Rewrote path ${$} -> ${F[z]}`)
          }
        }
        if (V.name === "Bash" && "command" in F && typeof F.command === "string") {
          let z = F.command;
          if (BV1({
              command: z
            }, JV1(z)).behavior !== "allow") return k(`[Speculation] Stopping at bash: ${z.slice(0,50)}...`), k19(B, () => ({
            boundary: {
              type: "bash",
              command: z,
              completedAt: Date.now()
            }
          })), Z.abort(), {
            behavior: "deny",
            message: "Speculation paused: bash boundary",
            decisionReason: {
              type: "other",
              reason: "speculation_bash_boundary"
            }
          }
        }
        return {
          behavior: "allow",
          updatedInput: F,
          decisionReason: {
            type: "other",
            reason: "speculation"
          }
        }
      },
      querySource: "speculation",
      forkLabel: "speculation",
      maxTurns: HG7,
      overrides: {
        abortController: Z
      },
      onMessage: (V) => {
        if (V.type === "assistant" || V.type === "user") {
          if (X.current.push(V), X.current.length >= EG7) Z.abort()
        }
      }
    });
    if (Z.signal.aborted) return;
    k19(B, () => ({
      clonePath: I,
      boundary: {
        type: "complete",
        completedAt: Date.now(),
        outputTokens: K.totalUsage.output_tokens
      }
    })), k(`[Speculation] Complete: ${LM0(X.current)} tools`)
  } catch (K) {
    if (Z.abort(), I) chA(I);
    if (K instanceof Error && K.name === "AbortError") {
      fH1(B);
      return
    }
    e(K instanceof Error ? K : Error("Speculation failed")), wM0(G, "error", J, A.length, X.current, null, {
      error_type: K instanceof Error ? K.name : "Unknown"
    }), fH1(B)
  }
}
// @from(Ln 397770, Col 0)
async function NG7(A, Q, B) {
  if (A.status !== "active") return null;
  let {
    id: G,
    messagesRef: Z,
    boundary: Y,
    abort: J,
    startTime: X,
    suggestionLength: I,
    clonePath: D
  } = A, W = Z.current, K = Date.now();
  if (J(), k(Y === null ? `[Speculation] Accept ${G}: still running, using ${W.length} messages` : `[Speculation] Accept ${G}: already complete`), D && B > 0) await CG7(D);
  if (D) chA(D);
  let F = Math.min(K, Y?.completedAt ?? 1 / 0) - X,
    H = {
      messages: W,
      boundary: Y,
      timeSavedMs: F
    };
  return Q((E) => ({
    ...E,
    speculation: FzA,
    speculationSessionTimeSavedMs: E.speculationSessionTimeSavedMs + F
  })), wM0(G, "accepted", X, I, W, Y, {
    message_count: W.length,
    time_saved_ms: F
  }), H
}
// @from(Ln 397798, Col 0)
async function u19(A, Q) {
  if (A.status !== "active") return;
  let {
    id: B,
    abort: G,
    startTime: Z,
    boundary: Y,
    suggestionLength: J,
    messagesRef: X,
    clonePath: I
  } = A, D = X.current;
  if (k(`[Speculation] Aborting ${B}`), wM0(B, "aborted", Z, J, D, Y, {
      abort_reason: "user_typed"
    }), G(), fH1(Q), I) chA(I)
}
// @from(Ln 397813, Col 0)
async function m19(A, Q, B, G, Z) {
  let {
    setMessages: Y,
    readFileState: J,
    cwd: X
  } = Z;
  B(($) => {
    if ($.promptSuggestion.text === null && $.promptSuggestion.promptId === null) return $;
    return {
      ...$,
      promptSuggestion: {
        text: null,
        promptId: null,
        shownAt: 0,
        acceptedAt: 0,
        generationRequestId: null
      }
    }
  });
  let I = A.messagesRef.current,
    D = UG7(I),
    W = H0({
      content: G
    });
  Y(($) => [...$, W]);
  let K = await NG7(A, B, D.length),
    V = K?.timeSavedMs ?? 0,
    F = Q + V,
    H = qG7(D, K?.boundary ?? null, V, F);
  Y(($) => [...$, ...D]);
  let E = VzA(D, X, u9A);
  if (J.current = MKA(J.current, E), H) Y(($) => [...$, H]);
  let z = K?.boundary?.type === "complete";
  return k(`[Speculation] ${K?.boundary?.type??"incomplete"}, injected ${D.length} messages`), {
    shouldContinueQuery: !z
  }
}
// @from(Ln 397850, Col 4)
FG7 = 5000
// @from(Ln 397851, Col 2)
HG7 = 20
// @from(Ln 397852, Col 2)
EG7 = 100
// @from(Ln 397853, Col 4)
hH1 = w(() => {
  AY();
  hB();
  $c();
  tQ();
  GV1();
  KU();
  Z0();
  T1();
  GQ();
  v1();
  iZ();
  U19();
  ZI();
  C0();
  t4();
  bH1();
  pC();
  mQ0()
})
// @from(Ln 397874, Col 0)
function uH1() {
  let A = process.env.CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION;
  if (A === "false") return l("tengu_prompt_suggestion_init", {
    enabled: !1,
    source: "env"
  }), !1;
  if (A === "1") return l("tengu_prompt_suggestion_init", {
    enabled: !0,
    source: "env"
  }), !0;
  if (!ROA(wG7)) return !1;
  if (p2()) return l("tengu_prompt_suggestion_init", {
    enabled: !1,
    source: "non_interactive"
  }), !1;
  if (k9A() === "mcp-cli") return l("tengu_prompt_suggestion_init", {
    enabled: !1,
    source: "mcp_cli_mode"
  }), !1;
  let B = r3()?.promptSuggestionEnabled !== !1;
  return l("tengu_prompt_suggestion_init", {
    enabled: B,
    source: "setting"
  }), B
}
// @from(Ln 397900, Col 0)
function d19() {
  if (S3A) S3A.abort(), S3A = null
}
// @from(Ln 397903, Col 0)
async function W19(A) {
  if (A.querySource !== "repl_main_thread") return;
  let Q = await A.toolUseContext.getAppState();
  if (!Q.promptSuggestionEnabled) return;
  if (gH1 = HX(LG7, "variant", "suggestion_generator"), Q.pendingWorkerRequest || Q.pendingSandboxRequest) {
    Uj("pending_permission");
    return
  }
  if (Q.elicitation.queue.length > 0) {
    Uj("elicitation_active");
    return
  }
  if (Q.toolPermissionContext.mode === "plan") {
    Uj("plan_mode");
    return
  }
  if (__.status !== "allowed") {
    Uj("rate_limit");
    return
  }
  if (A.messages.filter((Y) => Y.type === "assistant").length < 2) {
    Uj("early_conversation");
    return
  }
  let G = Qx(A.messages);
  if (G?.isApiErrorMessage) {
    Uj("last_response_error");
    return
  }
  if (G && MG7(G)) {
    Uj("cache_cold");
    return
  }
  S3A = new AbortController;
  let Z = S3A;
  try {
    let {
      suggestion: Y,
      generationRequestId: J
    } = await TG7(A, Z);
    if (PG7(Y)) return;
    if (A.toolUseContext.setAppState((X) => ({
        ...X,
        promptSuggestion: {
          text: Y,
          promptId: gH1,
          shownAt: 0,
          acceptedAt: 0,
          generationRequestId: J
        }
      })), OM0() && Y) g19(Y, A, A.toolUseContext.setAppState)
  } catch (Y) {
    if (Y instanceof Error && Y.name === "AbortError") {
      Uj("aborted");
      return
    }
    e(Y instanceof Error ? Y : Error("Prompt suggestion generation failed"))
  } finally {
    if (S3A === Z) S3A = null
  }
}
// @from(Ln 397965, Col 0)
function MG7(A) {
  if (!A) return !1;
  let Q = A.message.usage,
    B = Q.input_tokens ?? 0,
    G = Q.cache_read_input_tokens ?? 0,
    Z = Q.cache_creation_input_tokens ?? 0,
    Y = B + G + Z;
  if (Y === 0) return !1;
  return Z / Y > OG7
}
// @from(Ln 397976, Col 0)
function jG7() {
  return gH1 === "user_intent" ? _G7 : RG7
}
// @from(Ln 397979, Col 0)
async function TG7(A, Q) {
  let B = T3A(A),
    G = async () => ({
      behavior: "deny",
      message: "No tools needed for suggestion",
      decisionReason: {
        type: "other",
        reason: "suggestion only"
      }
    }), Z = jG7(), Y = await sc({
      promptMessages: [H0({
        content: Z
      })],
      cacheSafeParams: B,
      maxOutputTokens: 500,
      canUseTool: G,
      querySource: "prompt_suggestion",
      forkLabel: "prompt_suggestion",
      overrides: {
        abortController: Q
      }
    }), J = Y.messages.find((I) => I.type === "assistant"), X = J?.type === "assistant" ? J.requestId ?? null : null;
  for (let I of Y.messages) {
    if (I.type !== "assistant") continue;
    let D = I.message.content.find((W) => W.type === "text");
    if (D?.type === "text" && D.text.trim()) return {
      suggestion: D.text.trim(),
      generationRequestId: X
    }
  }
  return {
    suggestion: null,
    generationRequestId: X
  }
}
// @from(Ln 398015, Col 0)
function PG7(A) {
  if (!A) return Uj("empty"), !0;
  let Q = A.toLowerCase(),
    B = A.trim().split(/\s+/).length,
    G = [
      ["done", () => Q === "done"],
      ["too_few_words", () => B < 2],
      ["too_many_words", () => B > 8],
      ["error_message", () => Q.startsWith("api error:") || Q.startsWith("prompt is too long") || Q.startsWith("request timed out") || Q.startsWith("invalid api key") || Q.startsWith("image was too large")],
      ["too_long", () => A.length >= 100],
      ["multiple_sentences", () => /[.!?]\s+[A-Z]/.test(A)],
      ["has_formatting", () => /[\n*]|\*\*/.test(A)],
      ["evaluative", () => /thanks|thank you|looks good|sounds good|that works|that worked|that's all|nice|great|perfect|makes sense|awesome|excellent/.test(Q)],
      ["claude_voice", () => /^(let me|i'll|i've|i'm|i can|i would|i think|i notice|here's|here is|here are|that's|this is|this will|you can|you should|you could|sure,|of course|certainly)/i.test(A)]
    ];
  for (let [Z, Y] of G)
    if (Y()) return Uj(Z, A), !0;
  return !1
}
// @from(Ln 398035, Col 0)
function Uj(A, Q) {
  l("tengu_prompt_suggestion", {
    outcome: "suppressed",
    reason: A,
    prompt_id: gH1,
    ...!1
  })
}
// @from(Ln 398043, Col 4)
wG7 = "tengu_prompt_suggestion"
// @from(Ln 398044, Col 2)
LG7 = "tengu_prompt_suggestion_variation"
// @from(Ln 398045, Col 2)
S3A = null
// @from(Ln 398046, Col 2)
gH1 = "suggestion_generator"
// @from(Ln 398047, Col 2)
OG7 = 0.5
// @from(Ln 398048, Col 2)
RG7 = `You are now a prompt suggestion generator. The conversation above is context - your job is to suggest what Claude could help with next.

Based on the conversation, suggest the user's next prompt. Short casual input, 3-8 words. Read the moment - what's the natural next step?

Be specific when you can. Even if the task seems done, think about natural follow-ups. Say "done" only if the work is truly complete.

Reply with ONLY the suggestion text, no quotes, no explanation, no markdown.`
// @from(Ln 398055, Col 2)
_G7 = `[SUGGESTION MODE: Suggest what the user might naturally type next into Claude Code.]

FIRST: Look at the user's recent messages and original request.

Your job is to predict what THEY would type - not what you think they should do.

THE TEST: Would they think "I was just about to type that"?

EXAMPLES:
User asked "fix the bug and run tests", bug is fixed → "run the tests"
After code written → "try it out"
Claude offers options → suggest the one the user would likely pick, based on conversation
Claude asks to continue → "yes" or "go ahead"
Task complete, obvious follow-up → "commit this" or "push it"
After error or misunderstanding → silence (let them assess/correct)

Be specific: "run the tests" beats "continue".

NEVER SUGGEST:
- Evaluative ("looks good", "thanks")
- Questions ("what about...?")
- Claude-voice ("Let me...", "I'll...", "Here's...")
- New ideas they didn't ask about
- Multiple sentences

Stay silent if the next step isn't obvious from what the user said.

Format: 2-8 words, match the user's style. Or nothing.

Reply with ONLY the suggestion, no quotes or explanation.`
// @from(Ln 398085, Col 4)
hhA = w(() => {
  $c();
  tQ();
  BI();
  Z0();
  v1();
  Wb();
  C0();
  IS();
  GB();
  hH1()
})
// @from(Ln 398098, Col 0)
function SG7(A, Q) {
  if (A === Q) return !0;
  let B = Object.keys(A),
    G = Object.keys(Q);
  if (B.length !== G.length) return !1;
  for (let Z of B)
    if (A[Z] !== Q[Z]) return !1;
  return !0
}
// @from(Ln 398108, Col 0)
function HzA() {
  return {
    settings: r3(),
    tasks: {},
    verbose: !1,
    mainLoopModel: null,
    mainLoopModelForSession: null,
    statusLineText: void 0,
    showExpandedTodos: !1,
    showExpandedIPAgents: !1,
    selectedIPAgentIndex: 0,
    toolPermissionContext: {
      ...oL(),
      mode: "default"
    },
    agent: void 0,
    agentDefinitions: {
      activeAgents: [],
      allAgents: []
    },
    fileHistory: {
      snapshots: [],
      trackedFiles: new Set
    },
    attribution: z91(),
    mcp: {
      clients: [],
      tools: [],
      commands: [],
      resources: {}
    },
    plugins: {
      enabled: [],
      disabled: [],
      commands: [],
      agents: [],
      errors: [],
      installationStatus: {
        marketplaces: [],
        plugins: []
      }
    },
    todos: {},
    notifications: {
      current: null,
      queue: []
    },
    elicitation: {
      queue: []
    },
    thinkingEnabled: q91(),
    promptSuggestionEnabled: uH1(),
    feedbackSurvey: {
      timeLastShown: null,
      submitCountAtLastAppearance: null
    },
    sessionHooks: {},
    inbox: {
      messages: []
    },
    workerPermissions: {
      queue: [],
      selectedIndex: 0
    },
    workerSandboxPermissions: {
      queue: [],
      selectedIndex: 0
    },
    pendingWorkerRequest: null,
    pendingSandboxRequest: null,
    promptSuggestion: {
      text: null,
      promptId: null,
      shownAt: 0,
      acceptedAt: 0,
      generationRequestId: null
    },
    speculation: FzA,
    speculationSessionTimeSavedMs: 0,
    promptCoaching: {
      tip: null,
      shownAt: 0
    },
    queuedCommands: [],
    linkedAttachments: [],
    gitDiff: {
      stats: null,
      perFileStats: new Map,
      hunks: new Map,
      lastUpdated: 0
    },
    authVersion: 0,
    initialMessage: null
  }
}
// @from(Ln 398204, Col 0)
function b5({
  children: A,
  initialState: Q,
  onChangeAppState: B
}) {
  if (iF.useContext(c19)) throw Error("AppStateProvider can not be nested within another AppStateProvider");
  let [Z, Y] = iF.useState({
    currentState: Q ?? HzA(),
    previousState: null
  }), J = iF.useCallback((I) => {
    Y((D) => {
      let {
        currentState: W
      } = D, K = I(W);
      if (SG7(K, W)) return D;
      let V = {
        currentState: K,
        previousState: W
      };
      return B?.({
        newState: V.currentState,
        oldState: V.previousState
      }), V
    })
  }, [B]), X = iF.useMemo(() => {
    let I = [Z.currentState, J];
    return I.__IS_INITIALIZED__ = !0, I
  }, [Z.currentState, J]);
  return iF.useEffect(() => {
    let {
      toolPermissionContext: I
    } = Z.currentState;
    if (I.isBypassPermissionsModeAvailable && phA()) k("Disabling bypass permissions mode on mount (remote settings loaded before mount)"), J((D) => ({
      ...D,
      toolPermissionContext: lhA(D.toolPermissionContext)
    }))
  }, []), EDA(iF.useCallback((I, D) => {
    k(`Settings changed from ${I}, updating AppState`);
    let W = $01();
    J((K) => {
      let V = p19(K.toolPermissionContext, W);
      if (V.isBypassPermissionsModeAvailable && phA()) V = lhA(V);
      return {
        ...K,
        settings: D,
        toolPermissionContext: V
      }
    })
  }, [J])), iF.default.createElement(c19.Provider, {
    value: !0
  }, iF.default.createElement(RM0.Provider, {
    value: X
  }, A))
}
// @from(Ln 398259, Col 0)
function a0() {
  let A = iF.useContext(RM0);
  if (!A.__IS_INITIALIZED__) throw ReferenceError("useAppState cannot be called outside of an <AppStateProvider />");
  return A
}
// @from(Ln 398265, Col 0)
function HZ2() {
  let A = iF.useContext(RM0);
  if (!A.__IS_INITIALIZED__) return null;
  return A
}
// @from(Ln 398270, Col 4)
iF
// @from(Ln 398270, Col 8)
FzA
// @from(Ln 398270, Col 13)
RM0
// @from(Ln 398270, Col 18)
c19
// @from(Ln 398271, Col 4)
hB = w(() => {
  F91();
  YZ();
  eQA();
  ys();
  B2A();
  Y_();
  hhA();
  GB();
  T1();
  iF = c(QA(), 1), FzA = {
    status: "idle"
  };
  RM0 = iF.default.createContext([{}, (A) => A]), c19 = iF.default.createContext(!1)
})
// @from(Ln 398287, Col 0)
function S4() {
  let [A, Q] = a0(), B = EzA.useCallback(() => {
    Q((Y) => {
      let J = xG7(Y.notifications.queue);
      if (Y.notifications.current !== null || !J) return Y;
      return nf = setTimeout(() => {
        nf = null, Q((X) => {
          if (X.notifications.current?.key !== J.key) return X;
          return {
            ...X,
            notifications: {
              queue: X.notifications.queue,
              current: null
            }
          }
        }), B()
      }, J.timeoutMs ?? l19), {
        ...Y,
        notifications: {
          queue: Y.notifications.queue.filter((X) => X !== J),
          current: J
        }
      }
    })
  }, [Q]), G = EzA.useCallback((Y) => {
    if (Y.priority === "immediate") {
      if (nf) clearTimeout(nf), nf = null;
      nf = setTimeout(() => {
        nf = null, Q((J) => {
          if (J.notifications.current?.key !== Y.key) return J;
          return {
            ...J,
            notifications: {
              queue: J.notifications.queue.filter((X) => !Y.invalidates?.includes(X.key)),
              current: null
            }
          }
        }), B()
      }, Y.timeoutMs ?? l19), Q((J) => ({
        ...J,
        notifications: {
          current: Y,
          queue: [...J.notifications.current ? [J.notifications.current] : [], ...J.notifications.queue].filter((X) => X.priority !== "immediate" && !Y.invalidates?.includes(X.key))
        }
      }));
      return
    }
    Q((J) => {
      if (Y.priority === "immediate") return J;
      let I = !new Set(J.notifications.queue.map((D) => D.key)).has(Y.key) && J.notifications.current?.key !== Y.key;
      return {
        ...J,
        notifications: {
          current: J.notifications.current,
          queue: I ? [...J.notifications.queue.filter((D) => D.priority !== "immediate" && !Y.invalidates?.includes(D.key)), Y] : J.notifications.queue
        }
      }
    }), B()
  }, [Q, B]), Z = EzA.useCallback((Y) => {
    Q((J) => {
      let X = J.notifications.current?.key === Y,
        I = J.notifications.queue.some((D) => D.key === Y);
      if (!X && !I) return J;
      if (X && nf) clearTimeout(nf), nf = null;
      return {
        ...J,
        notifications: {
          current: X ? null : J.notifications.current,
          queue: J.notifications.queue.filter((D) => D.key !== Y)
        }
      }
    }), B()
  }, [Q, B]);
  return EzA.useEffect(() => {
    if (A.notifications.queue.length > 0) B()
  }, []), {
    addNotification: G,
    removeNotification: Z
  }
}
// @from(Ln 398368, Col 0)
function xG7(A) {
  return A.sort((Q, B) => {
    let G = i19[Q.priority] ?? 999,
      Z = i19[B.priority] ?? 999;
    return G - Z
  })[0]
}
// @from(Ln 398375, Col 4)
EzA
// @from(Ln 398375, Col 9)
l19 = 8000
// @from(Ln 398376, Col 2)
nf = null
// @from(Ln 398377, Col 2)
i19
// @from(Ln 398378, Col 4)
HY = w(() => {
  hB();
  EzA = c(QA(), 1);
  i19 = {
    immediate: 0,
    high: 1,
    medium: 2,
    low: 3
  }
})
// @from(Ln 398388, Col 4)
jM0 = {}
// @from(Ln 398405, Col 0)
function _M0() {
  if (ihA) return ihA;
  if (process.platform !== "darwin") return null;
  try {
    if (process.env.MODIFIERS_NODE_PATH) ihA = NA(process.env.MODIFIERS_NODE_PATH);
    else {
      let A = bG7(kG7(vG7(import.meta.url)), "..", "modifiers-napi", `${process.arch}-darwin`, "modifiers.node");
      ihA = yG7(import.meta.url)(A)
    }
    return ihA
  } catch {
    return null
  }
}
// @from(Ln 398420, Col 0)
function fG7() {
  let A = _M0();
  if (!A) return [];
  return A.getModifiers()
}
// @from(Ln 398426, Col 0)
function hG7(A) {
  let Q = _M0();
  if (!Q) return !1;
  return Q.isModifierPressed(A)
}
// @from(Ln 398432, Col 0)
function gG7() {
  _M0()
}
// @from(Ln 398435, Col 4)
ihA = null
// @from(Ln 398436, Col 4)
TM0 = () => {}
// @from(Ln 398438, Col 0)
function a19() {
  if (n19 || process.platform !== "darwin") return;
  n19 = !0;
  try {
    let {
      prewarm: A
    } = (TM0(), ky0(jM0));
    A()
  } catch {}
}
// @from(Ln 398449, Col 0)
function o19(A) {
  if (process.platform !== "darwin") return !1;
  let {
    isModifierPressed: Q
  } = (TM0(), ky0(jM0));
  return Q(A)
}
// @from(Ln 398456, Col 4)
n19 = !1
// @from(Ln 398458, Col 0)
function r19(A) {
  return function (Q) {
    return (new Map(A).get(Q) ?? (() => {}))(Q)
  }
}
// @from(Ln 398464, Col 0)
function mH1({
  value: A,
  onChange: Q,
  onSubmit: B,
  onExit: G,
  onExitMessage: Z,
  onHistoryUp: Y,
  onHistoryDown: J,
  onHistoryReset: X,
  mask: I = "",
  multiline: D = !1,
  cursorChar: W,
  invert: K,
  columns: V,
  onImagePaste: F,
  disableCursorMovementForUpDownKeys: H = !1,
  externalOffset: E,
  onOffsetChange: z,
  inputFilter: $,
  inlineGhostText: O,
  dim: L
}) {
  if (l0.terminal === "Apple_Terminal") a19();
  let M = E,
    _ = z,
    j = p6.fromText(A, V, M),
    {
      addNotification: x,
      removeNotification: b
    } = S4(),
    S = yP((s) => {
      Z?.(s, "Ctrl-C")
    }, () => G?.(), () => {
      if (A) Q(""), _(0), X?.()
    }),
    u = yP((s) => {
      if (!A || !s) return;
      x({
        key: "escape-again-to-clear",
        text: "Esc to clear again",
        priority: "immediate",
        timeoutMs: 1000
      })
    }, () => {
      if (b("escape-again-to-clear"), A) {
        if (T9("double-escape"), A.trim() !== "") A2A(A);
        Q(""), _(0), X?.()
      }
    });

  function f() {
    if (A.trim() !== "") A2A(A), X?.();
    return p6.fromText("", V, 0)
  }
  let AA = yP((s) => {
    if (A !== "") return;
    Z?.(s, "Ctrl-D")
  }, () => {
    if (A !== "") return;
    G?.()
  });

  function n() {
    if (j.text === "") return AA(), j;
    return j.del()
  }

  function y() {
    let {
      cursor: s,
      killed: t
    } = j.deleteToLineEnd();
    return Z91(t, "append"), s
  }

  function p() {
    let {
      cursor: s,
      killed: t
    } = j.deleteToLineStart();
    return Z91(t, "prepend"), s
  }

  function GA() {
    let {
      cursor: s,
      killed: t
    } = j.deleteWordBefore();
    return Z91(t, "prepend"), s
  }

  function WA() {
    let s = mMB();
    if (s.length > 0) {
      let t = j.offset,
        BA = j.insert(s);
      return dMB(t, s.length), BA
    }
    return j
  }

  function MA() {
    let s = cMB();
    if (!s) return j;
    let {
      text: t,
      start: BA,
      length: DA
    } = s, CA = j.text.slice(0, BA), FA = j.text.slice(BA + DA), xA = CA + t + FA, mA = BA + t.length;
    return pMB(t.length), p6.fromText(xA, V, mA)
  }
  let TA = r19([
      ["a", () => j.startOfLine()],
      ["b", () => j.left()],
      ["c", S],
      ["d", n],
      ["e", () => j.endOfLine()],
      ["f", () => j.right()],
      ["h", () => j.backspace()],
      ["k", y],
      ["l", () => f()],
      ["n", () => IA()],
      ["p", () => OA()],
      ["u", p],
      ["w", GA],
      ["y", WA]
    ]),
    bA = r19([
      ["b", () => j.prevWord()],
      ["f", () => j.nextWord()],
      ["d", () => j.deleteWordAfter()],
      ["y", MA]
    ]);

  function jA(s) {
    if (D && j.offset > 0 && j.text[j.offset - 1] === "\\") return JRB(), j.backspace().insert(`
`);
    if (s.meta || s.shift) return j.insert(`
`);
    if (l0.terminal === "Apple_Terminal" && o19("shift")) return j.insert(`
`);
    B?.(A)
  }

  function OA() {
    if (H) return Y?.(), j;
    let s = j.up();
    if (!s.equals(j)) return s;
    if (D) {
      let t = j.upLogicalLine();
      if (!t.equals(j)) return t
    }
    return Y?.(), j
  }

  function IA() {
    if (H) return J?.(), j;
    let s = j.down();
    if (!s.equals(j)) return s;
    if (D) {
      let t = j.downLogicalLine();
      if (!t.equals(j)) return t
    }
    return J?.(), j
  }

  function HA(s) {
    switch (!0) {
      case s.escape:
        return () => {
          return u(), j
        };
      case (s.leftArrow && (s.ctrl || s.meta || s.fn)):
        return () => j.prevWord();
      case (s.rightArrow && (s.ctrl || s.meta || s.fn)):
        return () => j.nextWord();
      case s.backspace:
        return s.meta ? GA : () => j.backspace();
      case s.delete:
        return s.meta ? y : () => j.del();
      case s.ctrl:
        return TA;
      case s.home:
        return () => j.startOfLine();
      case s.end:
        return () => j.endOfLine();
      case s.pageDown:
        return () => j.endOfLine();
      case s.pageUp:
        return () => j.startOfLine();
      case s.return:
        return () => jA(s);
      case s.meta:
        return bA;
      case s.tab:
        return () => j;
      case s.upArrow:
        return OA;
      case s.downArrow:
        return IA;
      case s.leftArrow:
        return () => j.left();
      case s.rightArrow:
        return () => j.right();
      default:
        return function (t) {
          switch (!0) {
            case (t === "\x1B[H" || t === "\x1B[1~"):
              return j.startOfLine();
            case (t === "\x1B[F" || t === "\x1B[4~"):
              return j.endOfLine();
            default:
              if (j.isAtStart() && wRB(t)) return j.insert(jZ(t).replace(/\r/g, `
`)).left();
              return j.insert(jZ(t).replace(/\r/g, `
`))
          }
        }
    }
  }

  function ZA(s, t) {
    if (s.ctrl && (t === "k" || t === "u" || t === "w")) return !0;
    if (s.meta && (s.backspace || s.delete)) return !0;
    return !1
  }

  function zA(s, t) {
    return (s.ctrl || s.meta) && t === "y"
  }

  function wA(s, t) {
    let BA = $ ? $(s, t) : s;
    if (BA === "" && s !== "") return;
    if (!t.backspace && !t.delete && s.includes("")) {
      let CA = (s.match(/\x7f/g) || []).length,
        FA = j;
      for (let xA = 0; xA < CA; xA++) FA = FA.backspace();
      if (!j.equals(FA)) {
        if (j.text !== FA.text) Q(FA.text);
        _(FA.offset)
      }
      xB0(), yB0();
      return
    }
    if (!ZA(t, BA)) xB0();
    if (!zA(t, BA)) yB0();
    let DA = HA(t)(BA);
    if (DA) {
      if (!j.equals(DA)) {
        if (j.text !== DA.text) Q(DA.text);
        _(DA.offset)
      }
    }
  }
  let _A = O && L ? {
    text: O.text,
    dim: L
  } : void 0;
  return {
    onInput: wA,
    renderedValue: j.render(W, I, K, _A),
    offset: M,
    setOffset: _
  }
}
// @from(Ln 398730, Col 4)
PM0 = w(() => {
  rR();
  XjA();
  DjA();
  eBA();
  Vm();
  HY();
  JZ();
  p3()
})
// @from(Ln 398741, Col 0)
function s19({
  onPaste: A,
  onInput: Q,
  onImagePaste: B
}) {
  let [G, Z] = qj.default.useState({
    chunks: [],
    timeoutId: null
  }), [Y, J] = qj.default.useState(!1), X = qj.default.useRef(!1), I = qj.default.useRef(!1), D = qj.default.useRef(!1), W = qj.default.useRef(!0), K = qj.default.useMemo(() => $Q() === "macos", []);
  qj.default.useEffect(() => {
    return () => {
      W.current = !1
    }
  }, []);
  let V = qj.default.useCallback(() => {
      if (!B || !W.current) return;
      d51().then(($) => {
        if ($ && W.current) B($.base64, $.mediaType, void 0, $.dimensions)
      }).catch(($) => {
        if (W.current) e($)
      }).finally(() => {
        if (W.current) J(!1)
      })
    }, [B]),
    F = ua(V, uG7),
    H = qj.default.useCallback(($) => {
      if ($) clearTimeout($);
      return setTimeout(() => {
        Z(({
          chunks: O
        }) => {
          let L = O.join("").replace(/\[I$/, "").replace(/\[O$/, "");
          if (B && vZ0(L)) {
            let M = /\/TemporaryItems\/.*screencaptureui.*\/Screenshot/i.test(L);
            return ZA2(L).then((_) => {
              if (_) {
                let j = _.path.split("/").pop();
                B(_.base64, _.mediaType, j, _.dimensions, _.path)
              } else if (M && K) F();
              else {
                if (A) A(L);
                J(!1)
              }
            }), {
              chunks: [],
              timeoutId: null
            }
          }
          if (K && B && L.length === 0) return F(), {
            chunks: [],
            timeoutId: null
          };
          if (A) A(L);
          return J(!1), {
            chunks: [],
            timeoutId: null
          }
        })
      }, mG7)
    }, [F, K, B, A]),
    {
      stdin: E
    } = ga();
  return qj.default.useEffect(() => {
    if (!E) return;
    let $ = (O) => {
      let L = O.toString();
      if (L.includes("\x1B[200~")) J(!0), X.current = !0, I.current = !1, D.current = !1;
      if (X.current && !D.current) {
        if (L.replaceAll("\x1B[200~", "").replaceAll("\x1B[201~", "").replaceAll("\x1B[I", "").replaceAll("\x1B[O", "").replace(/\[[IO]$/, "").length > 0) D.current = !0
      }
      if (L.includes("\x1B[201~")) {
        if (!D.current) J(!1);
        if (K && X.current && !D.current && B) F();
        if (X.current = !1, I.current = !1, !D.current) Z((M) => {
          if (M.timeoutId) clearTimeout(M.timeoutId);
          return {
            chunks: [],
            timeoutId: null
          }
        });
        D.current = !1
      }
    };
    return E.on("data", $), () => {
      E.off("data", $), J(!1)
    }
  }, [E, B, F, K]), {
    wrappedOnInput: ($, O) => {
      if (X.current) I.current = !0;
      let L = vZ0($);
      if (A && ($.length > m51 || G.timeoutId || L || Y)) {
        Z(({
          chunks: _,
          timeoutId: j
        }) => {
          return {
            chunks: [..._, $],
            timeoutId: H(j)
          }
        });
        return
      }
      if (Q($, O), $.length > 10) J(!1)
    },
    pasteState: G,
    isPasting: Y
  }
}
// @from(Ln 398850, Col 4)
qj
// @from(Ln 398850, Col 8)
uG7 = 50
// @from(Ln 398851, Col 2)
mG7 = 100
// @from(Ln 398852, Col 4)
t19 = w(() => {
  fA();
  oK();
  mSA();
  c3();
  v1();
  qj = c(QA(), 1)
})
// @from(Ln 398861, Col 0)
function e19({
  placeholder: A,
  value: Q,
  showCursor: B,
  focus: G,
  terminalFocus: Z = !0
}) {
  let Y = void 0;
  if (A) {
    if (Y = I1.dim(A), B && G && Z) Y = A.length > 0 ? I1.inverse(A[0]) + I1.dim(A.slice(1)) : I1.inverse(" ")
  }
  let J = Q.length === 0 && Boolean(A);
  return {
    renderedPlaceholder: Y,
    showPlaceholder: J
  }
}
// @from(Ln 398878, Col 4)
A09 = w(() => {
  Z3()
})
// @from(Ln 398882, Col 0)
function B09(A, Q) {
  if (Q.length === 0) return [{
    text: A,
    start: 0
  }];
  let B = [...Q].sort((Y, J) => {
      if (Y.start !== J.start) return Y.start - J.start;
      return J.priority - Y.priority
    }),
    G = [],
    Z = [];
  for (let Y of B) {
    if (Y.start === Y.end) continue;
    if (!Z.some((X) => Y.start >= X.start && Y.start < X.end || Y.end > X.start && Y.end <= X.end || Y.start <= X.start && Y.end >= X.end)) G.push(Y), Z.push({
      start: Y.start,
      end: Y.end
    })
  }
  return new G09(A).segment(G)
}
// @from(Ln 398902, Col 0)
class G09 {
  text;
  tokens;
  visiblePos = 0;
  stringPos = 0;
  tokenIdx = 0;
  charIdx = 0;
  codes = [];
  constructor(A) {
    this.text = A;
    this.tokens = oIA(A)
  }
  segment(A) {
    let Q = [];
    for (let G of A) {
      let Z = this.segmentTo(G.start);
      if (Z) Q.push(Z);
      let Y = this.segmentTo(G.end);
      if (Y) Y.highlight = G, Q.push(Y)
    }
    let B = this.segmentTo(1 / 0);
    if (B) Q.push(B);
    return Q
  }
  segmentTo(A) {
    if (this.tokenIdx >= this.tokens.length || A <= this.visiblePos) return null;
    let Q = this.visiblePos;
    while (this.tokenIdx < this.tokens.length) {
      let I = this.tokens[this.tokenIdx];
      if (I.type !== "ansi") break;
      this.codes.push(I), this.stringPos += I.code.length, this.tokenIdx++
    }
    let B = this.stringPos,
      G = [...this.codes];
    while (this.visiblePos < A && this.tokenIdx < this.tokens.length) {
      let I = this.tokens[this.tokenIdx];
      if (I.type === "ansi") this.codes.push(I), this.stringPos += I.code.length, this.tokenIdx++;
      else {
        let D = A - this.visiblePos,
          W = I.value.length - this.charIdx,
          K = Math.min(D, W);
        if (this.stringPos += K, this.visiblePos += K, this.charIdx += K, this.charIdx >= I.value.length) this.tokenIdx++, this.charIdx = 0
      }
    }
    if (this.stringPos === B) return null;
    let Z = Q09(G),
      Y = Q09(this.codes);
    this.codes = Y;
    let J = nL(Z),
      X = nL(cBA(Y));
    return {
      text: J + this.text.substring(B, this.stringPos) + X,
      start: Q
    }
  }
}
// @from(Ln 398959, Col 0)
function Q09(A) {
  return xa(A).filter((Q) => Q.code !== Q.endCode)
}
// @from(Ln 398962, Col 4)
Z09 = w(() => {
  rIA()
})
// @from(Ln 398966, Col 0)
function dH1({
  text: A,
  highlights: Q = []
}) {
  let B = B09(A, Q),
    G = $6A("requesting", A, !0, !1);
  return XD.createElement(XD.Fragment, null, B.map((Z, Y) => {
    if (!Z.highlight) return XD.createElement(C, {
      key: Y
    }, XD.createElement(M8, null, Z.text));
    let {
      style: J
    } = Z.highlight;
    if (J.type === "rainbow") return Z.text.split("").map((X, I) => {
      let D = Z.start + I,
        W = $jA(I, !1),
        K = $jA(I, !0);
      return XD.createElement(ws, {
        key: `${Y}-${I}`,
        char: X,
        index: D,
        glimmerIndex: G,
        messageColor: W,
        shimmerColor: K
      })
    });
    else if (J.type === "shimmer") return Z.text.split("").map((X, I) => {
      let D = Z.start + I;
      return XD.createElement(ws, {
        key: `${Y}-${I}`,
        char: X,
        index: D,
        glimmerIndex: G,
        messageColor: J.baseColor,
        shimmerColor: J.shimmerColor
      })
    });
    else if (J.type === "solid") return XD.createElement(C, {
      key: Y,
      color: J.color
    }, XD.createElement(M8, null, Z.text));
    return XD.createElement(C, {
      key: Y
    }, XD.createElement(M8, null, Z.text))
  }))
}
// @from(Ln 399012, Col 4)
XD
// @from(Ln 399013, Col 4)
SM0 = w(() => {
  fA();
  WkA();
  xI1();
  Y_();
  Z09();
  XD = c(QA(), 1)
})
// @from(Ln 399022, Col 0)
function cH1({
  inputState: A,
  children: Q,
  terminalFocus: B,
  ...G
}) {
  let {
    onInput: Z,
    renderedValue: Y
  } = A, {
    wrappedOnInput: J,
    isPasting: X
  } = s19({
    onPaste: G.onPaste,
    onInput: (E, z) => {
      if (X && z.return) return;
      Z(E, z)
    },
    onImagePaste: G.onImagePaste
  }), {
    onIsPastingChange: I
  } = G;
  Ye.default.useEffect(() => {
    if (I) I(X)
  }, [X, I]);
  let {
    showPlaceholder: D,
    renderedPlaceholder: W
  } = e19({
    placeholder: G.placeholder,
    value: G.value,
    showCursor: G.showCursor,
    focus: G.focus,
    terminalFocus: B
  });
  J0(J, {
    isActive: G.focus
  });
  let K = G.value && G.value.trim().indexOf(" ") === -1 || G.value && G.value.endsWith(" "),
    V = Boolean(G.argumentHint && G.value && K && G.value.startsWith("/")),
    F = G.showCursor && G.highlights ? G.highlights.filter((E) => G.cursorOffset < E.start || G.cursorOffset >= E.end) : G.highlights,
    H = F && F.length > 0;
  return Ye.default.createElement(T, null, Ye.default.createElement(C, {
    wrap: "truncate-end",
    dimColor: G.dimColor
  }, D && G.placeholderElement ? G.placeholderElement : D && W ? Ye.default.createElement(M8, null, W) : H ? Ye.default.createElement(dH1, {
    text: Y,
    highlights: F
  }) : Ye.default.createElement(M8, null, Y), V && Ye.default.createElement(C, {
    dimColor: !0
  }, G.value?.endsWith(" ") ? "" : " ", G.argumentHint), Q))
}
// @from(Ln 399074, Col 4)
Ye
// @from(Ln 399075, Col 4)
xM0 = w(() => {
  fA();
  t19();
  A09();
  SM0();
  Ye = c(QA(), 1)
})
// @from(Ln 399082, Col 4)
yM0
// @from(Ln 399082, Col 9)
pH1
// @from(Ln 399082, Col 14)
dG7
// @from(Ln 399082, Col 19)
ec
// @from(Ln 399082, Col 23)
zzA
// @from(Ln 399082, Col 28)
YOY
// @from(Ln 399082, Col 33)
JOY
// @from(Ln 399082, Col 38)
vM0
// @from(Ln 399083, Col 4)
x3A = w(() => {
  c3();
  yM0 = c(xP(), 1), pH1 = $Q() === "macos" ? "opt" : "alt", dG7 = $Q() !== "windows" || (G1A() ? yM0.default.satisfies(process.versions.bun, ">=1.2.23") : yM0.default.satisfies(process.versions.node, ">=22.17.0 <23.0.0 || >=24.2.0")), ec = !dG7 ? {
    displayText: `${pH1}+m`,
    check: (A, Q) => Q.meta && (A === "m" || A === "M")
  } : {
    displayText: "shift+tab",
    check: (A, Q) => Q.tab && Q.shift
  }, zzA = $Q() === "windows" ? {
    displayText: `${pH1}+v`,
    check: (A, Q) => Q.meta && (A === "v" || A === "V")
  } : {
    displayText: $Q() === "macos" ? "cmd+v" : "ctrl+v",
    check: (A, Q) => Q.ctrl && (A === "v" || A === "V")
  }, YOY = {
    displayText: `${pH1}+p`,
    check: (A, Q) => Q.meta && (A === "p" || A === "P")
  }, JOY = {
    displayText: `${pH1}+t`,
    check: (A, Q) => Q.meta && (A === "t" || A === "T")
  }, vM0 = {
    "†": "alt+t",
    π: "alt+p"
  }
})
// @from(Ln 399109, Col 0)
function lH1(A, Q) {
  let {
    addNotification: B
  } = S4(), G = $zA.useRef(A), Z = $zA.useRef(0), Y = $zA.useRef(null);
  $zA.useEffect(() => {
    let J = G.current;
    G.current = A;
    return
  }, [A, Q, B])
}
// @from(Ln 399119, Col 4)
$zA
// @from(Ln 399119, Col 9)
cG7 = "clipboard-image-hint"
// @from(Ln 399120, Col 2)
pG7 = 1000
// @from(Ln 399121, Col 2)
lG7 = 30000
// @from(Ln 399122, Col 4)
kM0 = w(() => {
  HY();
  mSA();
  x3A();
  $zA = c(QA(), 1)
})
// @from(Ln 399129, Col 0)
function p4(A) {
  let [Q] = oB(), B = GN();
  lH1(B, !!A.onImagePaste);
  let G = mH1({
    value: A.value,
    onChange: A.onChange,
    onSubmit: A.onSubmit,
    onExit: A.onExit,
    onExitMessage: A.onExitMessage,
    onHistoryReset: A.onHistoryReset,
    onHistoryUp: A.onHistoryUp,
    onHistoryDown: A.onHistoryDown,
    focus: A.focus,
    mask: A.mask,
    multiline: A.multiline,
    cursorChar: A.showCursor ? " " : "",
    highlightPastedText: A.highlightPastedText,
    invert: B && !a1(process.env.CLAUDE_CODE_ACCESSIBILITY) ? I1.inverse : (Z) => Z,
    themeText: sQ("text", Q),
    columns: A.columns,
    onImagePaste: A.onImagePaste,
    disableCursorMovementForUpDownKeys: A.disableCursorMovementForUpDownKeys,
    externalOffset: A.cursorOffset,
    onOffsetChange: A.onChangeCursorOffset,
    inlineGhostText: A.inlineGhostText,
    dim: I1.dim
  });
  return Y09.default.createElement(cH1, {
    inputState: G,
    terminalFocus: B,
    highlights: A.highlights,
    ...A
  })
}
// @from(Ln 399163, Col 4)
Y09
// @from(Ln 399164, Col 4)
IY = w(() => {
  Z3();
  PM0();
  xM0();
  kM0();
  fA();
  fQ();
  Y09 = c(QA(), 1)
})
// @from(Ln 399180, Col 0)
function K09(A, Q) {
  if (!A) return {
    directory: Q || o1(),
    prefix: ""
  };
  let B = Y4(A, Q);
  if (A.endsWith("/") || A.endsWith(iH1)) return {
    directory: B,
    prefix: ""
  };
  let G = iG7(B),
    Z = nG7(A);
  return {
    directory: G,
    prefix: Z
  }
}
// @from(Ln 399198, Col 0)
function aG7(A) {
  let Q = J09.get(A);
  if (Q) return Q;
  try {
    let Z = vA().readdirSync(A).filter((Y) => Y.isDirectory() && !Y.name.startsWith(".")).map((Y) => ({
      name: Y.name,
      path: I09(A, Y.name),
      type: "directory"
    })).slice(0, 100);
    return J09.set(A, Z), Z
  } catch (B) {
    return e(B instanceof Error ? B : Error(String(B))), []
  }
}
// @from(Ln 399212, Col 0)
async function nH1(A, Q = {}) {
  let {
    basePath: B = o1(),
    maxResults: G = 10
  } = Q, {
    directory: Z,
    prefix: Y
  } = K09(A, B), J = aG7(Z), X = Y.toLowerCase();
  return J.filter((D) => D.name.toLowerCase().startsWith(X)).slice(0, G).map((D) => ({
    id: D.path,
    displayText: D.name + "/",
    description: "directory",
    type: "directory"
  }))
}
// @from(Ln 399228, Col 0)
function V09(A) {
  return A.startsWith("~/") || A.startsWith("/") || A.startsWith("./") || A.startsWith("../") || A === "~" || A === "." || A === ".."
}
// @from(Ln 399232, Col 0)
function oG7(A, Q = !1) {
  let B = `${A}:${Q}`,
    G = X09.get(B);
  if (G) return G;
  try {
    let J = vA().readdirSync(A).filter((X) => Q || !X.name.startsWith(".")).map((X) => ({
      name: X.name,
      path: I09(A, X.name),
      type: X.isDirectory() ? "directory" : "file"
    })).sort((X, I) => {
      if (X.type === "directory" && I.type !== "directory") return -1;
      if (X.type !== "directory" && I.type === "directory") return 1;
      return X.name.localeCompare(I.name)
    }).slice(0, 100);
    return X09.set(B, J), J
  } catch (Z) {
    return e(Z instanceof Error ? Z : Error(String(Z))), []
  }
}
// @from(Ln 399251, Col 0)
async function bM0(A, Q = {}) {
  let {
    basePath: B = o1(),
    maxResults: G = 10,
    includeFiles: Z = !0,
    includeHidden: Y = !1
  } = Q, {
    directory: J,
    prefix: X
  } = K09(A, B), I = oG7(J, Y), D = X.toLowerCase(), W = I.filter((F) => {
    if (!Z && F.type === "file") return !1;
    return F.name.toLowerCase().startsWith(D)
  }).slice(0, G), K = A.includes("/") || A.includes(iH1), V = "";
  if (K) {
    let F = A.lastIndexOf("/"),
      H = A.lastIndexOf(iH1),
      E = Math.max(F, H);
    V = A.substring(0, E + 1)
  }
  if (V.startsWith("./") || V.startsWith("." + iH1)) V = V.slice(2);
  return W.map((F) => {
    let H = V + F.name;
    return {
      id: H,
      displayText: F.type === "directory" ? H + "/" : H,
      metadata: {
        type: F.type
      }
    }
  })
}
// @from(Ln 399282, Col 4)
D09 = 500
// @from(Ln 399283, Col 2)
W09 = 300000
// @from(Ln 399284, Col 2)
J09
// @from(Ln 399284, Col 7)
X09
// @from(Ln 399285, Col 4)
fM0 = w(() => {
  eqA();
  V2();
  DQ();
  v1();
  oZ();
  J09 = new jT({
    max: D09,
    ttl: W09
  }), X09 = new jT({
    max: D09,
    ttl: W09
  })
})
// @from(Ln 399300, Col 0)
function rG7(A) {
  if (A.startsWith("file-")) return "+";
  if (A.startsWith("mcp-resource-")) return "◇";
  if (A.startsWith("agent-")) return "*";
  return "+"
}
// @from(Ln 399307, Col 0)
function sG7(A) {
  return A.startsWith("file-") || A.startsWith("mcp-resource-") || A.startsWith("agent-")
}
// @from(Ln 399311, Col 0)
function nhA({
  suggestions: A,
  selectedSuggestion: Q,
  query: B,
  maxColumnWidth: G
}) {
  let {
    rows: Z
  } = ZB(), Y = Math.min(6, Math.max(1, Z - 3));
  if (A.length === 0) return null;
  let J = G ?? Math.max(...A.map((W) => W.displayText.length)) + 5,
    X = Math.max(0, Math.min(Q - Math.floor(Y / 2), A.length - Y)),
    I = Math.min(X + Y, A.length),
    D = A.slice(X, I);
  return cO.createElement(T, {
    flexDirection: "column"
  }, D.map((W) => cO.createElement(tG7, {
    key: W.id,
    item: W,
    maxColumnWidth: J,
    isSelected: W.id === A[Q]?.id,
    query: B
  })))
}
// @from(Ln 399335, Col 4)
cO
// @from(Ln 399335, Col 8)
hM0
// @from(Ln 399335, Col 13)
tG7
// @from(Ln 399335, Col 18)
TOY
// @from(Ln 399336, Col 4)
gM0 = w(() => {
  fA();
  P4();
  cO = c(QA(), 1), hM0 = c(QA(), 1);
  tG7 = hM0.memo(function ({
    item: Q,
    maxColumnWidth: B,
    isSelected: G,
    query: Z
  }) {
    let Y = ZB().columns;
    if (sG7(Q.id)) {
      let E = rG7(Q.id),
        z = G ? "suggestion" : void 0,
        $ = !G,
        O = Q.id.startsWith("file-"),
        L = Q.id.startsWith("mcp-resource-"),
        M = 2,
        _ = 4,
        j = Q.description ? 3 : 0,
        x;
      if (O) {
        let u = Q.description ? Math.min(20, Q.description.length) : 0,
          f = Y - 2 - 4 - j - u;
        x = ntQ(Q.displayText, f)
      } else if (L) x = Q.displayText.length > 30 ? Q.displayText.substring(0, 29) + "…" : Q.displayText;
      else x = Q.displayText;
      let b = Y - 2 - x.length - j - 4,
        S;
      if (Q.description) {
        let u = Math.max(0, b),
          f = Q.description.length > u ? Q.description.substring(0, u - 1) + "…" : Q.description;
        S = `${E} ${x} – ${f}`
      } else S = `${E} ${x}`;
      return cO.createElement(C, {
        color: z,
        dimColor: $,
        wrap: "truncate"
      }, S)
    }
    let X = Math.floor(Y * 0.4),
      I = Math.min(B ?? Q.displayText.length + 5, X),
      D = Q.color || (G ? "suggestion" : void 0),
      W = !G,
      K = Q.displayText;
    if (K.length > I - 2) K = K.slice(0, I - 3) + "…";
    let V = K.padEnd(I),
      F = Math.max(0, Y - I - 4),
      H = Q.description ? Q.description.length > F ? Q.description.slice(0, Math.max(0, F - 1)) + "…" : Q.description : "";
    return cO.createElement(C, null, cO.createElement(C, {
      color: D,
      dimColor: W
    }, V), cO.createElement(C, {
      color: G ? "suggestion" : void 0,
      dimColor: !G
    }, H))
  });
  TOY = hM0.memo(nhA)
})
// @from(Ln 399396, Col 0)
function F09() {
  return i4.createElement(C, {
    dimColor: !0
  }, "Claude Code will be able to read files in this directory and make edits when auto-accept edits is on.")
}
// @from(Ln 399402, Col 0)
function AZ7({
  path: A
}) {
  return i4.createElement(T, {
    flexDirection: "column",
    paddingX: 2,
    gap: 1
  }, i4.createElement(C, {
    color: "permission"
  }, A), i4.createElement(F09, null))
}
// @from(Ln 399414, Col 0)
function QZ7({
  value: A,
  onChange: Q,
  onSubmit: B,
  error: G,
  suggestions: Z,
  selectedSuggestion: Y
}) {
  return i4.createElement(T, {
    flexDirection: "column"
  }, i4.createElement(C, null, "Enter the path to the directory:"), i4.createElement(T, {
    borderDimColor: !0,
    borderStyle: "round",
    marginY: 1,
    paddingLeft: 1
  }, i4.createElement(p4, {
    showCursor: !0,
    placeholder: `Directory path${tA.ellipsis}`,
    value: A,
    onChange: Q,
    onSubmit: B,
    columns: 80,
    cursorOffset: A.length,
    onChangeCursorOffset: () => {}
  })), Z.length > 0 && i4.createElement(T, {
    marginBottom: 1
  }, i4.createElement(nhA, {
    suggestions: Z,
    selectedSuggestion: Y
  })), G && i4.createElement(C, {
    color: "error"
  }, G))
}
// @from(Ln 399448, Col 0)
function aH1({
  onAddDirectory: A,
  onCancel: Q,
  permissionContext: B,
  directoryPath: G
}) {
  let [Z, Y] = wU.useState(""), [J, X] = wU.useState(null), [I, D] = wU.useState([]), [W, K] = wU.useState(0), V = MQ(), F = wU.useMemo(() => eG7, []), H = wU.useCallback(async (L) => {
    if (!L) {
      D([]), K(0);
      return
    }
    let M = await nH1(L);
    D(M), K(0)
  }, []), E = ua(H, 100);
  wU.useEffect(() => {
    E(Z)
  }, [Z, E]);
  let z = wU.useCallback((L) => {
      let M = L.id + "/";
      Y(M), X(null)
    }, []),
    $ = wU.useCallback((L) => {
      let M = ahA(L, B);
      if (M.resultType === "success") A(M.absolutePath, !1);
      else X(ohA(M))
    }, [B, A]);
  J0(wU.useCallback((L, M) => {
    if (M.escape || M.ctrl && L === "c") {
      Q();
      return
    }
    if (I.length > 0) {
      if (M.tab) {
        let _ = I[W];
        if (_) z(_);
        return
      }
      if (M.return) {
        let _ = I[W];
        if (_) $(_.id + "/");
        return
      }
      if (M.upArrow || M.ctrl && L === "p") {
        K((_) => _ <= 0 ? I.length - 1 : _ - 1);
        return
      }
      if (M.downArrow || M.ctrl && L === "n") {
        K((_) => _ >= I.length - 1 ? 0 : _ + 1);
        return
      }
    }
  }, [Q, I, W, z, $]));
  let O = wU.useCallback((L) => {
    if (!G) return;
    switch (L) {
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
  return i4.createElement(i4.Fragment, null, i4.createElement(T, {
    flexDirection: "column",
    borderStyle: "round",
    paddingLeft: 1,
    paddingRight: 1,
    gap: 1,
    borderColor: "permission"
  }, i4.createElement(C, {
    bold: !0,
    color: "permission"
  }, "Add directory to workspace"), G ? i4.createElement(T, {
    flexDirection: "column",
    gap: 1
  }, i4.createElement(AZ7, {
    path: G
  }), i4.createElement(k0, {
    options: F,
    onChange: O,
    onCancel: () => O("no")
  })) : i4.createElement(T, {
    flexDirection: "column",
    gap: 1,
    marginX: 2
  }, i4.createElement(F09, null), i4.createElement(QZ7, {
    value: Z,
    onChange: Y,
    onSubmit: $,
    error: J,
    suggestions: I,
    selectedSuggestion: W
  }))), !G && i4.createElement(T, {
    marginLeft: 3
  }, V.pending ? i4.createElement(C, {
    dimColor: !0
  }, "Press ", V.keyName, " again to exit") : i4.createElement(C, {
    dimColor: !0
  }, "Tab to complete · Enter to add · Esc to cancel")))
}
// @from(Ln 399552, Col 4)
i4
// @from(Ln 399552, Col 8)
wU
// @from(Ln 399552, Col 12)
eG7
// @from(Ln 399553, Col 4)
uM0 = w(() => {
  fA();
  E9();
  IY();
  oH1();
  B2();
  W8();
  fM0();
  gM0();
  oK();
  i4 = c(QA(), 1), wU = c(QA(), 1), eG7 = [{
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
// @from(Ln 399575, Col 0)
function H09({
  onCancel: A,
  onSubmit: Q,
  ruleBehavior: B
}) {
  let [G, Z] = mM0.useState(""), [Y, J] = mM0.useState(0), X = MQ();
  H2("confirm:no", A, {
    context: "Confirmation"
  });
  let {
    columns: I
  } = ZB(), D = I - 6, W = (K) => {
    let V = K.trim();
    if (V.length === 0) return;
    let F = mR(V);
    Q(F, B)
  };
  return s7.createElement(s7.Fragment, null, s7.createElement(T, {
    flexDirection: "column",
    gap: 1,
    borderStyle: "round",
    paddingLeft: 1,
    paddingRight: 1,
    borderColor: "permission"
  }, s7.createElement(C, {
    bold: !0,
    color: "permission"
  }, "Add ", B, " permission rule"), s7.createElement(T, {
    flexDirection: "column"
  }, s7.createElement(C, null, "Permission rules are a tool name, optionally followed by a specifier in parentheses.", s7.createElement(fD, null), "e.g.,", " ", s7.createElement(C, {
    bold: !0
  }, S5({
    toolName: hF.name
  })), s7.createElement(C, {
    bold: !1
  }, " or "), s7.createElement(C, {
    bold: !0
  }, S5({
    toolName: o2.name,
    ruleContent: "ls:*"
  }))), s7.createElement(T, {
    borderDimColor: !0,
    borderStyle: "round",
    marginY: 1,
    paddingLeft: 1
  }, s7.createElement(p4, {
    showCursor: !0,
    value: G,
    onChange: Z,
    onSubmit: W,
    placeholder: `Enter permission rule${tA.ellipsis}`,
    columns: D,
    cursorOffset: Y,
    onChangeCursorOffset: J
  })))), s7.createElement(T, {
    marginLeft: 3
  }, X.pending ? s7.createElement(C, {
    dimColor: !0
  }, "Press ", X.keyName, " again to exit") : s7.createElement(C, {
    dimColor: !0
  }, "Enter to submit · Esc to cancel")))
}
// @from(Ln 399637, Col 4)
s7
// @from(Ln 399637, Col 8)
mM0
// @from(Ln 399638, Col 4)
E09 = w(() => {
  fA();
  c6();
  E9();
  YZ();
  P4();
  iHA();
  YK();
  IY();
  B2();
  s7 = c(QA(), 1), mM0 = c(QA(), 1)
})
// @from(Ln 399651, Col 0)
function $09({
  onExit: A,
  getToolPermissionContext: Q,
  onRequestAddDirectory: B,
  onRequestRemoveDirectory: G
}) {
  let Z = Q(),
    Y = Kw.useMemo(() => {
      return Array.from(Z.additionalWorkingDirectories.keys()).map((I) => ({
        path: I,
        isCurrent: !1,
        isDeletable: !0
      }))
    }, [Z.additionalWorkingDirectories]),
    J = z09.useCallback((I) => {
      if (I === "add-directory") {
        B();
        return
      }
      let D = Y.find((W) => W.path === I);
      if (D && D.isDeletable) G(D.path)
    }, [Y, B, G]),
    X = Kw.useMemo(() => {
      let I = Y.map((D) => ({
        label: D.path,
        value: D.path
      }));
      return I.push({
        label: `Add directory${tA.ellipsis}`,
        value: "add-directory"
      }), I
    }, [Y]);
  return Kw.createElement(T, {
    flexDirection: "column",
    marginBottom: 1
  }, Kw.createElement(T, {
    flexDirection: "row",
    marginTop: 1,
    marginLeft: 2,
    gap: 1
  }, Kw.createElement(C, null, `-  ${EQ()}`), Kw.createElement(C, {
    dimColor: !0
  }, "(Original working directory)")), Kw.createElement(k0, {
    options: X,
    onChange: J,
    onCancel: () => A("Workspace dialog dismissed", {
      display: "system"
    }),
    visibleOptionCount: Math.min(10, X.length)
  }))
}
// @from(Ln 399702, Col 4)
Kw
// @from(Ln 399702, Col 8)
z09
// @from(Ln 399703, Col 4)
C09 = w(() => {
  fA();
  W8();
  B2();
  C0();
  Kw = c(QA(), 1), z09 = c(QA(), 1)
})
// @from(Ln 399711, Col 0)
function U09({
  directoryPath: A,
  onRemove: Q,
  onCancel: B,
  permissionContext: G,
  setPermissionContext: Z
}) {
  let Y = MQ();
  J0((I, D) => {
    if (D.escape) B()
  });
  let J = dM0.useCallback(() => {
      let I = UJ(G, {
        type: "removeDirectories",
        directories: [A],
        destination: "session"
      });
      Z(I), Q()
    }, [A, G, Z, Q]),
    X = dM0.useCallback((I) => {
      if (I === "yes") J();
      else B()
    }, [J, B]);
  return GJ.createElement(GJ.Fragment, null, GJ.createElement(T, {
    flexDirection: "column",
    borderStyle: "round",
    paddingLeft: 1,
    paddingRight: 1,
    borderColor: "error"
  }, GJ.createElement(C, {
    bold: !0,
    color: "error"
  }, "Remove directory from workspace?"), GJ.createElement(T, {
    marginY: 1,
    marginX: 2,
    flexDirection: "column"
  }, GJ.createElement(C, {
    bold: !0
  }, A)), GJ.createElement(C, null, "Claude Code will no longer have access to files in this directory."), GJ.createElement(T, {
    marginY: 1
  }, GJ.createElement(k0, {
    onChange: X,
    onCancel: B,
    options: [{
      label: "Yes",
      value: "yes"
    }, {
      label: "No",
      value: "no"
    }]
  }))), GJ.createElement(T, {
    marginLeft: 3
  }, Y.pending ? GJ.createElement(C, {
    dimColor: !0
  }, "Press ", Y.keyName, " again to exit") : GJ.createElement(C, {
    dimColor: !0
  }, "↑/↓ to select · Enter to confirm · Esc to cancel")))
}
// @from(Ln 399769, Col 4)
GJ
// @from(Ln 399769, Col 8)
dM0
// @from(Ln 399770, Col 4)
q09 = w(() => {
  fA();
  E9();
  W8();
  dW();
  GJ = c(QA(), 1), dM0 = c(QA(), 1)
})
// @from(Ln 399778, Col 0)
function Nj({
  title: A,
  color: Q,
  defaultTab: B,
  children: G,
  hidden: Z,
  useFullWidth: Y,
  selectedTab: J,
  onTabChange: X,
  banner: I
}) {
  let {
    columns: D
  } = ZB(), W = G.map((b) => [b.props.id ?? b.props.title, b.props.title]), K = B ? W.findIndex((b) => B === b[0]) : 0, V = J !== void 0, [F, H] = y3A.useState(K !== -1 ? K : 0), E = V ? W.findIndex((b) => b[0] === J) : -1, z = V ? E !== -1 ? E : 0 : F;
  J0((b, S) => {
    if (S.tab || S.leftArrow || S.rightArrow) {
      let u = S.shift || S.leftArrow ? -1 : 1,
        f = (z + W.length + u) % W.length,
        AA = W[f]?.[0];
      if (V && X && AA) X(AA);
      else H(f)
    }
  }, {
    isActive: !Z
  });
  let $ = "(←/→ or tab to cycle)",
    O = A ? A.length + 1 : 0,
    L = W.reduce((b, [, S]) => b + (S?.length ?? 0) + 2 + 1, 0),
    M = $.length,
    _ = O + L + M,
    j = Y ? Math.max(0, D - _ - 2) : 0,
    x = Y ? D - 2 : void 0;
  return pO.default.createElement(cM0.Provider, {
    value: {
      selectedTab: W[z][0],
      width: x
    }
  }, pO.default.createElement(T, {
    flexDirection: "column"
  }, !Z && pO.default.createElement(pO.default.Fragment, null, pO.default.createElement(C, {
    color: Q
  }, "─".repeat(D - 2)), pO.default.createElement(T, {
    flexDirection: "row",
    gap: 1,
    paddingLeft: 1
  }, A !== void 0 && pO.default.createElement(C, {
    bold: !0,
    color: Q
  }, A), W.map(([b, S], u) => pO.default.createElement(C, {
    key: b,
    backgroundColor: Q && z === u ? Q : void 0,
    color: Q && z === u ? "inverseText" : void 0,
    bold: z === u
  }, " ", S, " ")), pO.default.createElement(C, {
    dimColor: !0
  }, "(←/→ or tab to cycle)"), j > 0 && pO.default.createElement(C, null, " ".repeat(j)))), I, pO.default.createElement(T, {
    width: x,
    paddingLeft: 1,
    marginTop: Z ? 0 : 1
  }, G)))
}
// @from(Ln 399840, Col 0)
function kX({
  title: A,
  id: Q,
  children: B
}) {
  let {
    selectedTab: G,
    width: Z
  } = y3A.useContext(cM0);
  if (G !== (Q ?? A)) return null;
  return pO.default.createElement(T, {
    width: Z
  }, B)
}
// @from(Ln 399855, Col 0)
function N09() {
  let {
    width: A
  } = y3A.useContext(cM0);
  return A
}
// @from(Ln 399861, Col 4)
pO
// @from(Ln 399861, Col 8)
y3A
// @from(Ln 399861, Col 13)
cM0
// @from(Ln 399862, Col 4)
v3A = w(() => {
  fA();
  P4();
  pO = c(QA(), 1), y3A = c(QA(), 1), cM0 = y3A.createContext({
    selectedTab: void 0,
    width: void 0
  })
})
// @from(Ln 399871, Col 0)
function Ap({
  query: A,
  placeholder: Q = "Search…",
  isFocused: B,
  isTerminalFocused: G,
  prefix: Z = "⌕",
  width: Y
}) {
  return U$.default.createElement(T, {
    flexShrink: 0,
    borderStyle: "round",
    borderColor: B ? "suggestion" : void 0,
    borderDimColor: !B,
    paddingX: 1,
    width: Y
  }, U$.default.createElement(C, {
    dimColor: !B
  }, Z, " ", B ? U$.default.createElement(U$.default.Fragment, null, A ? U$.default.createElement(U$.default.Fragment, null, U$.default.createElement(C, null, A), G && U$.default.createElement(C, null, "█")) : G ? U$.default.createElement(U$.default.Fragment, null, U$.default.createElement(C, {
    inverse: !0
  }, Q.charAt(0)), U$.default.createElement(C, {
    dimColor: !0
  }, Q.slice(1))) : U$.default.createElement(C, {
    dimColor: !0
  }, Q)) : A ? U$.default.createElement(C, null, A) : U$.default.createElement(C, null, Q)))
}
// @from(Ln 399896, Col 4)
U$
// @from(Ln 399897, Col 4)
CzA = w(() => {
  fA();
  U$ = c(QA(), 1)
})
// @from(Ln 399902, Col 0)
function BZ7({
  rule: A
}) {
  return iQ.createElement(C, {
    dimColor: !0
  }, `From ${JyA(A.source)}`)
}
// @from(Ln 399910, Col 0)
function GZ7(A) {
  switch (A) {
    case "allow":
      return "allowed";
    case "deny":
      return "denied";
    case "ask":
      return "ask"
  }
}
// @from(Ln 399921, Col 0)
function ZZ7({
  rule: A,
  onDelete: Q,
  onCancel: B
}) {
  let G = MQ();
  H2("confirm:no", B, {
    context: "Confirmation"
  });
  let Z = iQ.createElement(T, {
      flexDirection: "column",
      marginX: 2
    }, iQ.createElement(C, {
      bold: !0
    }, S5(A.ruleValue)), iQ.createElement(uZ1, {
      ruleValue: A.ruleValue
    }), iQ.createElement(BZ7, {
      rule: A
    })),
    Y = iQ.createElement(T, {
      marginLeft: 3
    }, G.pending ? iQ.createElement(C, {
      dimColor: !0
    }, "Press ", G.keyName, " again to exit") : iQ.createElement(C, {
      dimColor: !0
    }, "Esc to cancel"));
  if (A.source === "policySettings") return iQ.createElement(iQ.Fragment, null, iQ.createElement(T, {
    flexDirection: "column",
    gap: 1,
    borderStyle: "round",
    paddingLeft: 1,
    paddingRight: 1,
    borderColor: "permission"
  }, iQ.createElement(C, {
    bold: !0,
    color: "permission"
  }, "Rule details"), Z, iQ.createElement(C, {
    italic: !0
  }, "This rule is configured by managed settings and cannot be modified.", `
`, "Contact your system administrator for more information.")), Y);
  return iQ.createElement(iQ.Fragment, null, iQ.createElement(T, {
    flexDirection: "column",
    gap: 1,
    borderStyle: "round",
    paddingLeft: 1,
    paddingRight: 1,
    borderColor: "error"
  }, iQ.createElement(C, {
    bold: !0,
    color: "error"
  }, "Delete ", GZ7(A.ruleBehavior), " tool?"), Z, iQ.createElement(C, null, "Are you sure you want to delete this permission rule?"), iQ.createElement(k0, {
    onChange: (J) => J === "yes" ? Q() : B(),
    onCancel: B,
    options: [{
      label: "Yes",
      value: "yes"
    }, {
      label: "No",
      value: "no"
    }]
  })), Y)
}
// @from(Ln 399984, Col 0)
function YZ7({
  options: A,
  searchQuery: Q,
  isSearchMode: B,
  isFocused: G,
  onSelect: Z,
  onCancel: Y,
  lastFocusedRuleKey: J,
  onUpFromFirstItem: X
}) {
  let I = N09();
  return iQ.createElement(T, {
    flexDirection: "column"
  }, iQ.createElement(T, {
    marginBottom: 1,
    flexDirection: "column"
  }, iQ.createElement(Ap, {
    query: Q,
    isFocused: B,
    isTerminalFocused: G,
    width: I
  })), iQ.createElement(k0, {
    options: A,
    onChange: Z,
    onCancel: Y,
    visibleOptionCount: Math.min(10, A.length),
    isDisabled: B,
    defaultFocusValue: J,
    onUpFromFirstItem: X
  }))
}
// @from(Ln 400016, Col 0)
function rH1({
  onExit: A,
  initialTab: Q = "allow"
}) {
  let [B, G] = YW.useState([]), [{
    toolPermissionContext: Z
  }, Y] = a0(), J = GN(), [X, I] = YW.useState(), [D, W] = YW.useState(), [K, V] = YW.useState(null), [F, H] = YW.useState(null), [E, z] = YW.useState(!1), [$, O] = YW.useState(null), [L, M] = YW.useState(""), [_, j] = YW.useState(!1), x = YW.useMemo(() => {
    let jA = new Map;
    return CVA(Z).forEach((OA) => {
      jA.set(eA(OA), OA)
    }), jA
  }, [Z]), b = YW.useMemo(() => {
    let jA = new Map;
    return _d(Z).forEach((OA) => {
      jA.set(eA(OA), OA)
    }), jA
  }, [Z]), S = YW.useMemo(() => {
    let jA = new Map;
    return UVA(Z).forEach((OA) => {
      jA.set(eA(OA), OA)
    }), jA
  }, [Z]), u = YW.useCallback((jA, OA = "") => {
    let IA = (() => {
        switch (jA) {
          case "allow":
            return x;
          case "deny":
            return b;
          case "ask":
            return S;
          case "workspace":
            return new Map
        }
      })(),
      HA = [];
    if (jA !== "workspace" && !OA) HA.push({
      label: `Add a new rule${tA.ellipsis}`,
      value: "add-new-rule"
    });
    let ZA = Array.from(IA.keys()).sort((wA, _A) => {
        let s = IA.get(wA),
          t = IA.get(_A);
        if (s && t) {
          let BA = S5(s.ruleValue).toLowerCase(),
            DA = S5(t.ruleValue).toLowerCase();
          return BA.localeCompare(DA)
        }
        return 0
      }),
      zA = OA.toLowerCase();
    for (let wA of ZA) {
      let _A = IA.get(wA);
      if (_A) {
        let s = S5(_A.ruleValue);
        if (OA && !s.toLowerCase().includes(zA)) continue;
        HA.push({
          label: s,
          value: wA
        })
      }
    }
    return {
      options: HA,
      rulesByKey: IA
    }
  }, [x, b, S]), f = MQ();
  J0((jA, OA) => {
    let IA = !OA.ctrl && !OA.meta;
    if (_) {
      if (OA.escape)
        if (L.length > 0) M("");
        else j(!1);
      else if (OA.return || OA.downArrow) j(!1);
      else if (OA.backspace || OA.delete)
        if (L.length === 0) j(!1);
        else M((HA) => HA.slice(0, -1));
      else if (jA && IA) M((HA) => HA + jA)
    } else if (jA === "/" && IA) j(!0), M("");
    else if (IA && jA.length > 0 && jA !== "j" && jA !== "k" && jA !== "m" && jA !== "i" && !/^\s+$/.test(jA)) j(!0), M(jA)
  }, {
    isActive: !X && !K && !F && !E && !$
  });
  let AA = YW.useCallback((jA, OA) => {
      let {
        rulesByKey: IA
      } = u(OA);
      if (jA === "add-new-rule") {
        V(OA);
        return
      } else {
        I(IA.get(jA));
        return
      }
    }, [u]),
    n = YW.useCallback(() => {
      V(null)
    }, []),
    y = YW.useCallback((jA, OA) => {
      H({
        ruleValue: jA,
        ruleBehavior: OA
      }), V(null)
    }, []),
    p = YW.useCallback((jA, OA) => {
      H(null);
      for (let IA of jA) G((HA) => [...HA, `Added ${IA.ruleBehavior} rule ${I1.bold(S5(IA.ruleValue))}`]);
      if (OA && OA.length > 0)
        for (let IA of OA) {
          let HA = IA.shadowType === "deny" ? "blocked" : "shadowed";
          G((ZA) => [...ZA, I1.yellow(`${tA.warning} Warning: ${S5(IA.rule.ruleValue)} is ${HA}`), I1.dim(`  ${IA.reason}`), I1.dim(`  Fix: ${IA.fix}`)])
        }
    }, []),
    GA = YW.useCallback(() => {
      H(null)
    }, []),
    WA = () => {
      if (!X) return;
      let {
        options: jA
      } = u(X.ruleBehavior), OA = eA(X), IA = jA.filter((zA) => zA.value !== "add-new-rule").map((zA) => zA.value), HA = IA.indexOf(OA), ZA;
      if (HA !== -1) {
        if (HA < IA.length - 1) ZA = IA[HA + 1];
        else if (HA > 0) ZA = IA[HA - 1]
      }
      W(ZA), w09({
        rule: X,
        initialContext: Z,
        setToolPermissionContext(zA) {
          Y((wA) => ({
            ...wA,
            toolPermissionContext: zA
          }))
        }
      }), G((zA) => [...zA, `Deleted ${X.ruleBehavior} rule ${I1.bold(S5(X.ruleValue))}`]), I(void 0)
    };
  if (X) return iQ.createElement(ZZ7, {
    rule: X,
    onDelete: WA,
    onCancel: () => I(void 0)
  });
  if (K && K !== "workspace") return iQ.createElement(H09, {
    onCancel: n,
    onSubmit: y,
    ruleBehavior: K
  });
  if (F) return iQ.createElement(k32, {
    onAddRules: p,
    onCancel: GA,
    ruleValues: [F.ruleValue],
    ruleBehavior: F.ruleBehavior,
    initialContext: Z,
    setToolPermissionContext: (jA) => {
      Y((OA) => ({
        ...OA,
        toolPermissionContext: jA
      }))
    }
  });
  if (E) return iQ.createElement(aH1, {
    onAddDirectory: (jA, OA) => {
      let HA = {
          type: "addDirectories",
          directories: [jA],
          destination: OA ? "localSettings" : "session"
        },
        ZA = UJ(Z, HA);
      if (Y((zA) => ({
          ...zA,
          toolPermissionContext: ZA
        })), OA) Kk(HA);
      G((zA) => [...zA, `Added directory ${I1.bold(jA)} to workspace${OA?" and saved to local settings":" for this session"}`]), z(!1)
    },
    onCancel: () => z(!1),
    permissionContext: Z
  });
  if ($) return iQ.createElement(U09, {
    directoryPath: $,
    onRemove: () => {
      G((jA) => [...jA, `Removed directory ${I1.bold($)} from workspace`]), O(null)
    },
    onCancel: () => O(null),
    permissionContext: Z,
    setPermissionContext: (jA) => {
      Y((OA) => ({
        ...OA,
        toolPermissionContext: jA
      }))
    }
  });

  function MA(jA) {
    switch (jA) {
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

  function TA(jA) {
    if (jA === "workspace") return iQ.createElement($09, {
      onExit: A,
      getToolPermissionContext: () => Z,
      onRequestAddDirectory: () => z(!0),
      onRequestRemoveDirectory: (IA) => O(IA)
    });
    let {
      options: OA
    } = u(jA, L);
    return iQ.createElement(YZ7, {
      options: OA,
      searchQuery: L,
      isSearchMode: _,
      isFocused: J,
      onSelect: (IA) => AA(IA, jA),
      onCancel: () => {
        if (B.length > 0) A(B.join(`
`));
        else A("Permissions dialog dismissed", {
          display: "system"
        })
      },
      lastFocusedRuleKey: D,
      onUpFromFirstItem: () => j(!0)
    })
  }
  return iQ.createElement(T, {
    flexDirection: "column",
    flexShrink: 0
  }, iQ.createElement(Nj, {
    title: "Permissions:",
    color: "permission",
    defaultTab: Q,
    hidden: !!X || !!K || !!F || E || !!$
  }, iQ.createElement(kX, {
    id: "allow",
    title: "Allow"
  }, iQ.createElement(T, {
    flexDirection: "column",
    flexShrink: 0
  }, iQ.createElement(C, null, MA("allow")), TA("allow"))), iQ.createElement(kX, {
    id: "ask",
    title: "Ask"
  }, iQ.createElement(T, {
    flexDirection: "column"
  }, iQ.createElement(C, null, MA("ask")), TA("ask"))), iQ.createElement(kX, {
    id: "deny",
    title: "Deny"
  }, iQ.createElement(T, {
    flexDirection: "column"
  }, iQ.createElement(C, null, MA("deny")), TA("deny"))), iQ.createElement(kX, {
    id: "workspace",
    title: "Workspace"
  }, iQ.createElement(T, {
    flexDirection: "column"
  }, iQ.createElement(C, null, MA("workspace")), TA("workspace")))), iQ.createElement(T, {
    marginTop: 1,
    paddingLeft: 1
  }, iQ.createElement(C, {
    dimColor: !0
  }, f.pending ? iQ.createElement(iQ.Fragment, null, "Press ", f.keyName, " again to exit") : iQ.createElement(iQ.Fragment, null, "Press ↑↓ to navigate · Enter to select · Type to search · Esc to cancel"))))
}
// @from(Ln 400282, Col 4)
iQ
// @from(Ln 400282, Col 8)
YW
// @from(Ln 400283, Col 4)
pM0 = w(() => {
  fA();
  c6();
  W8();
  E9();
  YZ();
  B2();
  SI0();
  cZ1();
  E09();
  Z3();
  C09();
  uM0();
  q09();
  dW();
  hB();
  v3A();
  CzA();
  A0();
  iQ = c(QA(), 1), YW = c(QA(), 1)
})
// @from(Ln 400308, Col 0)
function XZ7({
  message: A,
  args: Q,
  onDone: B
}) {
  return L09.useEffect(() => {
    let G = setTimeout(B, 0);
    return () => clearTimeout(G)
  }, [B]), Je.default.createElement(T, {
    flexDirection: "column"
  }, Je.default.createElement(C, {
    dimColor: !0
  }, tA.pointer, " /add-dir ", Q), Je.default.createElement(x0, null, Je.default.createElement(C, null, A)))
}
// @from(Ln 400323, Col 0)
function ahA(A, Q) {
  if (!A) return {
    resultType: "emptyPath"
  };
  let B = Y4(A),
    G = vA();
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
  let Z = WEA(Q);
  for (let Y of Z)
    if (yd(B, Y)) return {
      resultType: "alreadyInWorkingDirectory",
      directoryPath: A,
      workingDir: Y
    };
  return {
    resultType: "success",
    absolutePath: B
  }
}
// @from(Ln 400352, Col 0)
function ohA(A) {
  switch (A.resultType) {
    case "emptyPath":
      return "Please provide a directory path.";
    case "pathNotFound":
      return `Path ${I1.bold(A.absolutePath)} was not found.`;
    case "notADirectory": {
      let Q = JZ7(A.absolutePath);
      return `${I1.bold(A.directoryPath)} is not a directory. Did you mean to add the parent directory ${I1.bold(Q)}?`
    }
    case "alreadyInWorkingDirectory":
      return `${I1.bold(A.directoryPath)} is already accessible within the existing working directory ${I1.bold(A.workingDir)}.`;
    case "success":
      return `Added ${I1.bold(A.absolutePath)} as a working directory.`
  }
}
// @from(Ln 400368, Col 4)
Je
// @from(Ln 400368, Col 8)
L09
// @from(Ln 400368, Col 13)
IZ7
// @from(Ln 400368, Col 18)
O09
// @from(Ln 400369, Col 4)
oH1 = w(() => {
  B2();
  Z3();
  fA();
  AY();
  DQ();
  oZ();
  uM0();
  c4();
  pM0();
  dW();
  JZ();
  Je = c(QA(), 1), L09 = c(QA(), 1);
  IZ7 = {
    type: "local-jsx",
    name: "add-dir",
    description: "Add a new working directory",
    argumentHint: "<path>",
    isEnabled: () => !0,
    isHidden: !1,
    async call(A, Q, B) {
      T9("multi-directory");
      let G = B.trim();
      if (!G) return Je.default.createElement(rH1, {
        onExit: A,
        initialTab: "workspace"
      });
      let Z = await Q.getAppState(),
        Y = ahA(G, Z.toolPermissionContext);
      if (Y.resultType !== "success") {
        let J = ohA(Y);
        return Je.default.createElement(XZ7, {
          message: J,
          args: B,
          onDone: () => A(J)
        })
      }
      return Je.default.createElement(aH1, {
        directoryPath: Y.absolutePath,
        permissionContext: Z.toolPermissionContext,
        onAddDirectory: async (J, X) => {
          let D = {
              type: "addDirectories",
              directories: [J],
              destination: X ? "localSettings" : "session"
            },
            W = await Q.getAppState(),
            K = UJ(W.toolPermissionContext, D);
          Q.setAppState((H) => ({
            ...H,
            toolPermissionContext: K
          }));
          let V;
          if (X) try {
            Kk(D), V = `Added ${I1.bold(J)} as a working directory and saved to local settings`
          } catch (H) {
            V = `Added ${I1.bold(J)} as a working directory. Failed to save to local settings: ${H instanceof Error?H.message:"Unknown error"}`
          } else V = `Added ${I1.bold(J)} as a working directory for this session`;
          let F = `${V} ${I1.dim("· /permissions to manage")}`;
          A(F)
        },
        onCancel: () => {
          A(`Did not add ${I1.bold(Y.absolutePath)} as a working directory.`)
        }
      })
    },
    userFacingName() {
      return "add-dir"
    }
  }, O09 = IZ7
})
// @from(Ln 400440, Col 4)
DZ7
// @from(Ln 400440, Col 9)
M09
// @from(Ln 400441, Col 4)
R09 = w(() => {
  DZ7 = {
    type: "local",
    name: "btw",
    description: "Ask a quick side question without interrupting the main conversation",
    isEnabled: () => !1,
    isHidden: !1,
    supportsNonInteractive: !1,
    async call() {
      return {
        type: "skip"
      }
    },
    userFacingName() {
      return "btw"
    }
  }, M09 = DZ7
})
// @from(Ln 400460, Col 0)
function Qp(A) {
  return !Array.isArray ? v09(A) === "[object Array]" : Array.isArray(A)
}
// @from(Ln 400464, Col 0)
function KZ7(A) {
  if (typeof A == "string") return A;
  let Q = A + "";
  return Q == "0" && 1 / A == -WZ7 ? "-0" : Q
}
// @from(Ln 400470, Col 0)
function VZ7(A) {
  return A == null ? "" : KZ7(A)
}
// @from(Ln 400474, Col 0)
function af(A) {
  return typeof A === "string"
}
// @from(Ln 400478, Col 0)
function x09(A) {
  return typeof A === "number"
}
// @from(Ln 400482, Col 0)
function FZ7(A) {
  return A === !0 || A === !1 || HZ7(A) && v09(A) == "[object Boolean]"
}
// @from(Ln 400486, Col 0)
function y09(A) {
  return typeof A === "object"
}
// @from(Ln 400490, Col 0)
function HZ7(A) {
  return y09(A) && A !== null
}
// @from(Ln 400494, Col 0)
function lO(A) {
  return A !== void 0 && A !== null
}
// @from(Ln 400498, Col 0)
function lM0(A) {
  return !A.trim().length
}
// @from(Ln 400502, Col 0)
function v09(A) {
  return A == null ? A === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(A)
}
// @from(Ln 400505, Col 0)
class k09 {
  constructor(A) {
    this._keys = [], this._keyMap = {};
    let Q = 0;
    A.forEach((B) => {
      let G = b09(B);
      this._keys.push(G), this._keyMap[G.id] = G, Q += G.weight
    }), this._keys.forEach((B) => {
      B.weight /= Q
    })
  }
  get(A) {
    return this._keyMap[A]
  }
  keys() {
    return this._keys
  }
  toJSON() {
    return JSON.stringify(this._keys)
  }
}
// @from(Ln 400527, Col 0)
function b09(A) {
  let Q = null,
    B = null,
    G = null,
    Z = 1,
    Y = null;
  if (af(A) || Qp(A)) G = A, Q = j09(A), B = iM0(A);
  else {
    if (!_09.call(A, "name")) throw Error(CZ7("name"));
    let J = A.name;
    if (G = J, _09.call(A, "weight")) {
      if (Z = A.weight, Z <= 0) throw Error(UZ7(J))
    }
    Q = j09(J), B = iM0(J), Y = A.getFn
  }
  return {
    path: Q,
    id: B,
    weight: Z,
    src: G,
    getFn: Y
  }
}
// @from(Ln 400551, Col 0)
function j09(A) {
  return Qp(A) ? A : A.split(".")
}
// @from(Ln 400555, Col 0)
function iM0(A) {
  return Qp(A) ? A.join(".") : A
}
// @from(Ln 400559, Col 0)
function qZ7(A, Q) {
  let B = [],
    G = !1,
    Z = (Y, J, X) => {
      if (!lO(Y)) return;
      if (!J[X]) B.push(Y);
      else {
        let I = J[X],
          D = Y[I];
        if (!lO(D)) return;
        if (X === J.length - 1 && (af(D) || x09(D) || FZ7(D))) B.push(VZ7(D));
        else if (Qp(D)) {
          G = !0;
          for (let W = 0, K = D.length; W < K; W += 1) Z(D[W], J, X + 1)
        } else if (J.length) Z(D, J, X + 1)
      }
    };
  return Z(A, af(Q) ? Q.split(".") : Q, 0), G ? B : B[0]
}
// @from(Ln 400579, Col 0)
function RZ7(A = 1, Q = 3) {
  let B = new Map,
    G = Math.pow(10, Q);
  return {
    get(Z) {
      let Y = Z.match(MZ7).length;
      if (B.has(Y)) return B.get(Y);
      let J = 1 / Math.pow(Y, 0.5 * A),
        X = parseFloat(Math.round(J * G) / G);
      return B.set(Y, X), X
    },
    clear() {
      B.clear()
    }
  }
}
// @from(Ln 400595, Col 0)
class eH1 {
  constructor({
    getFn: A = t6.getFn,
    fieldNormWeight: Q = t6.fieldNormWeight
  } = {}) {
    this.norm = RZ7(Q, 3), this.getFn = A, this.isCreated = !1, this.setIndexRecords()
  }
  setSources(A = []) {
    this.docs = A
  }
  setIndexRecords(A = []) {
    this.records = A
  }
  setKeys(A = []) {
    this.keys = A, this._keysMap = {}, A.forEach((Q, B) => {
      this._keysMap[Q.id] = B
    })
  }
  create() {
    if (this.isCreated || !this.docs.length) return;
    if (this.isCreated = !0, af(this.docs[0])) this.docs.forEach((A, Q) => {
      this._addString(A, Q)
    });
    else this.docs.forEach((A, Q) => {
      this._addObject(A, Q)
    });
    this.norm.clear()
  }
  add(A) {
    let Q = this.size();
    if (af(A)) this._addString(A, Q);
    else this._addObject(A, Q)
  }
  removeAt(A) {
    this.records.splice(A, 1);
    for (let Q = A, B = this.size(); Q < B; Q += 1) this.records[Q].i -= 1
  }
  getValueForItemAtKeyId(A, Q) {
    return A[this._keysMap[Q]]
  }
  size() {
    return this.records.length
  }
  _addString(A, Q) {
    if (!lO(A) || lM0(A)) return;
    let B = {
      v: A,
      i: Q,
      n: this.norm.get(A)
    };
    this.records.push(B)
  }
  _addObject(A, Q) {
    let B = {
      i: Q,
      $: {}
    };
    this.keys.forEach((G, Z) => {
      let Y = G.getFn ? G.getFn(A) : this.getFn(A, G.path);
      if (!lO(Y)) return;
      if (Qp(Y)) {
        let J = [],
          X = [{
            nestedArrIndex: -1,
            value: Y
          }];
        while (X.length) {
          let {
            nestedArrIndex: I,
            value: D
          } = X.pop();
          if (!lO(D)) continue;
          if (af(D) && !lM0(D)) {
            let W = {
              v: D,
              i: I,
              n: this.norm.get(D)
            };
            J.push(W)
          } else if (Qp(D)) D.forEach((W, K) => {
            X.push({
              nestedArrIndex: K,
              value: W
            })
          })
        }
        B.$[Z] = J
      } else if (af(Y) && !lM0(Y)) {
        let J = {
          v: Y,
          n: this.norm.get(Y)
        };
        B.$[Z] = J
      }
    }), this.records.push(B)
  }
  toJSON() {
    return {
      keys: this.keys,
      records: this.records
    }
  }
}