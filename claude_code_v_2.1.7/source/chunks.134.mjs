
// @from(Ln 393634, Col 0)
function R77(A, Q) {
  let B = [{
      name: "Context loading",
      start: "query_context_loading_start",
      end: "query_context_loading_end"
    }, {
      name: "Microcompact",
      start: "query_microcompact_start",
      end: "query_microcompact_end"
    }, {
      name: "Autocompact",
      start: "query_autocompact_start",
      end: "query_autocompact_end"
    }, {
      name: "Query setup",
      start: "query_setup_start",
      end: "query_setup_end"
    }, {
      name: "Tool schemas",
      start: "query_tool_schema_build_start",
      end: "query_tool_schema_build_end"
    }, {
      name: "Message normalization",
      start: "query_message_normalization_start",
      end: "query_message_normalization_end"
    }, {
      name: "Client creation",
      start: "query_client_creation_start",
      end: "query_client_creation_end"
    }, {
      name: "Network TTFB",
      start: "query_api_request_sent",
      end: "query_first_chunk_received"
    }, {
      name: "Tool execution",
      start: "query_tool_execution_start",
      end: "query_tool_execution_end"
    }],
    G = new Map(A.map((J) => [J.name, J.startTime - Q])),
    Z = [];
  Z.push(""), Z.push("PHASE BREAKDOWN:");
  for (let J of B) {
    let X = G.get(J.start),
      I = G.get(J.end);
    if (X !== void 0 && I !== void 0) {
      let D = I - X,
        W = "█".repeat(Math.min(Math.ceil(D / 10), 50));
      Z.push(`  ${J.name.padEnd(22)} ${Ge(D).padStart(10)}ms ${W}`)
    }
  }
  let Y = G.get("query_api_request_sent");
  if (Y !== void 0) Z.push(""), Z.push(`  ${"Total pre-API overhead".padEnd(22)} ${Ge(Y).padStart(10)}ms`);
  return Z.join(`
`)
}
// @from(Ln 393690, Col 0)
function J19() {
  if (!bhA) return;
  k(M77())
}
// @from(Ln 393694, Col 4)
bhA = !1
// @from(Ln 393695, Col 2)
XM0
// @from(Ln 393695, Col 7)
G19 = 0
// @from(Ln 393696, Col 2)
JM0 = null
// @from(Ln 393697, Col 2)
YM0 = null
// @from(Ln 393698, Col 4)
WzA = w(() => {
  T1();
  XM0 = new Map
})
// @from(Ln 393706, Col 0)
function _77() {
  return parseInt(process.env.CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY || "", 10) || 10
}
// @from(Ln 393710, Col 0)
function* DM0(A, Q) {
  for (let B of A) {
    let G = B.message.content.filter((Z) => Z.type === "tool_use");
    for (let Z of G) yield H0({
      content: [{
        type: "tool_result",
        content: Q,
        is_error: !0,
        tool_use_id: Z.id
      }],
      toolUseResult: Q,
      sourceToolAssistantUUID: B.uuid
    })
  }
}
// @from(Ln 393725, Col 0)
async function* aN({
  messages: A,
  systemPrompt: Q,
  userContext: B,
  systemContext: G,
  canUseTool: Z,
  toolUseContext: Y,
  autoCompactTracking: J,
  fallbackModel: X,
  stopHookActive: I,
  querySource: D,
  maxOutputTokensOverride: W,
  maxOutputTokensRecoveryCount: K = 0,
  maxTurns: V,
  turnCount: F = 1
}) {
  if (yield {
      type: "stream_request_start"
    }, h6("query_fn_entry"), !Y.agentId) j3A("query_started");
  let H = Y.queryTracking ? {
      chainId: Y.queryTracking.chainId,
      depth: Y.queryTracking.depth + 1
    } : {
      chainId: X19(),
      depth: 0
    },
    E = H.chainId;
  Y = {
    ...Y,
    queryTracking: H
  };
  let z = _x(A),
    $ = J;
  h6("query_microcompact_start");
  let O = await lc(z, void 0, Y);
  if (z = O.messages, O.compactionInfo?.systemMessage) yield O.compactionInfo.systemMessage;
  h6("query_microcompact_end"), h6("query_autocompact_start");
  let {
    compactionResult: L
  } = await ys2(z, Y, D);
  if (h6("query_autocompact_end"), L) {
    let {
      preCompactTokenCount: zA,
      postCompactTokenCount: wA,
      compactionUsage: _A
    } = L;
    if (l("tengu_auto_compact_succeeded", {
        originalMessageCount: A.length,
        compactedMessageCount: L.summaryMessages.length + L.attachments.length + L.hookResults.length,
        preCompactTokenCount: zA,
        postCompactTokenCount: wA,
        compactionInputTokens: _A?.input_tokens,
        compactionOutputTokens: _A?.output_tokens,
        compactionCacheReadTokens: _A?.cache_read_input_tokens ?? 0,
        compactionCacheCreationTokens: _A?.cache_creation_input_tokens ?? 0,
        compactionTotalTokens: _A ? _A.input_tokens + (_A.cache_creation_input_tokens ?? 0) + (_A.cache_read_input_tokens ?? 0) + _A.output_tokens : 0,
        queryChainId: E,
        queryDepth: H.depth
      }), !$?.compacted) $ = {
      compacted: !0,
      turnId: X19(),
      turnCounter: 0
    };
    let s = FHA(L);
    for (let t of s) yield t;
    z = s
  }
  Y = {
    ...Y,
    messages: z
  };
  let M = [],
    _ = [];
  h6("query_setup_start");
  let x = f8("tengu_streaming_tool_execution2") ? new _H1(Y.options.tools, Z, Y) : null,
    b = await Y.getAppState(),
    S = b.toolPermissionContext.mode,
    u = HQA({
      permissionMode: S,
      mainLoopModel: Y.options.mainLoopModel,
      exceeds200kTokens: S === "plan" && h51(z)
    }),
    f = fA9(Q, G);
  h6("query_setup_end");
  let AA = void 0,
    {
      isAtBlockingLimit: n
    } = ic(HKA(z));
  if (n) {
    yield DZ({
      content: Ar,
      error: "invalid_request"
    });
    return
  }
  let y = !0;
  h6("query_api_loop_start");
  try {
    while (y) {
      y = !1;
      try {
        let zA = !1;
        h6("query_api_streaming_start");
        for await (let wA of oHA({
          messages: _3A(z, B),
          systemPrompt: f,
          maxThinkingTokens: Y.options.maxThinkingTokens,
          tools: Y.options.tools,
          signal: Y.abortController.signal,
          options: {
            async getToolPermissionContext() {
              return (await Y.getAppState()).toolPermissionContext
            },
            model: u,
            toolChoice: void 0,
            isNonInteractiveSession: Y.options.isNonInteractiveSession,
            fallbackModel: X,
            onStreamingFallback: () => {
              zA = !0
            },
            querySource: D,
            agents: Y.options.agentDefinitions.activeAgents,
            hasAppendSystemPrompt: !!Y.options.appendSystemPrompt,
            maxOutputTokensOverride: W,
            fetchOverride: AA,
            mcpTools: b.mcp.tools,
            queryTracking: H,
            taskIntensityOverride: w3A(),
            agentId: Y.agentId
          }
        })) {
          if (zA) {
            for (let _A of M) yield {
              type: "tombstone",
              message: _A
            };
            if (l("tengu_orphaned_messages_tombstoned", {
                orphanedMessageCount: M.length,
                queryChainId: E,
                queryDepth: H.depth
              }), M.length = 0, _.length = 0, x) x.discard(), x = new _H1(Y.options.tools, Z, Y)
          }
          if (yield wA, wA.type === "assistant") {
            if (M.push(wA), x) {
              let _A = wA.message.content.filter((s) => s.type === "tool_use");
              for (let s of _A) x.addTool(s, wA)
            }
          }
          if (x) {
            for (let _A of x.getCompletedResults())
              if (_A.message) yield _A.message, _.push(...FI([_A.message], Y.options.tools).filter((s) => s.type === "user"))
          }
        }
        h6("query_api_streaming_end")
      } catch (zA) {
        if (zA instanceof y51 && X) {
          u = X, y = !0, yield* DM0(M, "Model fallback triggered"), M.length = 0, Y.options.mainLoopModel = X, l("tengu_model_fallback_triggered", {
            original_model: zA.originalModel,
            fallback_model: X,
            entrypoint: "cli",
            queryChainId: E,
            queryDepth: H.depth
          }), yield hO(`Model fallback triggered: switching from ${zA.originalModel} to ${zA.fallbackModel}`, "info");
          continue
        }
        throw zA
      }
    }
  } catch (zA) {
    e(zA instanceof Error ? zA : Error(String(zA)));
    let wA = zA instanceof Error ? zA.message : String(zA);
    if (l("tengu_query_error", {
        assistantMessages: M.length,
        toolUses: M.flatMap((_A) => _A.message.content.filter((s) => s.type === "tool_use")).length,
        queryChainId: E,
        queryDepth: H.depth
      }), zA instanceof FKA || zA instanceof S9A) {
      yield DZ({
        content: zA.message
      });
      return
    }
    yield* DM0(M, wA), yield fhA({
      toolUse: !1
    }), xM("Query error", zA);
    return
  }
  if (M.length > 0) aA9([...z, ...M], Q, B, G, Y, D);
  if (M.some((zA) => zA.message.content.some((wA) => wA.type === "text" && lA9(wA.text)))) l("tengu_model_response_keyword_detected", {
    is_overly_agreeable: !0,
    queryChainId: E,
    queryDepth: H.depth
  });
  if (Y.abortController.signal.aborted) {
    if (x) {
      for await (let zA of x.getRemainingResults()) if (zA.message) yield zA.message
    } else yield* DM0(M, "Interrupted by user");
    yield fhA({
      toolUse: !1
    });
    return
  }
  let GA = M.flatMap((zA) => zA.message.content.filter((wA) => wA.type === "tool_use"));
  if (!M.length || !GA.length) {
    if (M[M.length - 1]?.apiError === "max_output_tokens" && K < j77) {
      let wA = H0({
        content: "Your response was cut off because it exceeded the output token limit. Please break your work into smaller pieces. Continue from where you left off.",
        isMeta: !0
      });
      yield* aN({
        messages: [...z, ...M, wA],
        systemPrompt: Q,
        userContext: B,
        systemContext: G,
        canUseTool: Z,
        toolUseContext: Y,
        autoCompactTracking: $,
        fallbackModel: X,
        querySource: D,
        maxOutputTokensRecoveryCount: K + 1,
        maxTurns: V,
        turnCount: F
      });
      return
    }
    yield* P77(z, M, Q, B, G, Z, Y, D, $, X, I, V, F), yield* T77(z, M, Q, B, G, Z, Y, D, $, X, V, F);
    return
  }
  let WA = !1,
    MA = Y;
  if (h6("query_tool_execution_start"), x) {
    l("tengu_streaming_tool_execution_used", {
      tool_count: GA.length,
      queryChainId: E,
      queryDepth: H.depth
    });
    for await (let zA of x.getRemainingResults()) {
      let wA = zA.message;
      if (!wA) continue;
      if (yield wA, wA && wA.type === "attachment" && wA.attachment.type === "hook_stopped_continuation") WA = !0;
      _.push(...FI([wA], Y.options.tools).filter((_A) => _A.type === "user"))
    }
    MA = {
      ...x.getUpdatedContext(),
      queryTracking: H
    }
  } else {
    l("tengu_streaming_tool_execution_not_used", {
      tool_count: GA.length,
      queryChainId: E,
      queryDepth: H.depth
    });
    for await (let zA of KM0(GA, M, Z, Y)) {
      if (zA.message) {
        if (yield zA.message, zA.message.type === "attachment" && zA.message.attachment.type === "hook_stopped_continuation") WA = !0;
        _.push(...FI([zA.message], Y.options.tools).filter((wA) => wA.type === "user"))
      }
      if (zA.newContext) MA = {
        ...zA.newContext,
        queryTracking: H
      }
    }
  }
  if (h6("query_tool_execution_end"), Y.abortController.signal.aborted) {
    yield fhA({
      toolUse: !0
    });
    let zA = F + 1;
    if (V && zA > V) yield X4({
      type: "max_turns_reached",
      maxTurns: V,
      turnCount: zA
    });
    return
  }
  if (WA) return;
  if ($?.compacted) $.turnCounter++, l("tengu_post_autocompact_turn", {
    turnId: $.turnId,
    turnCounter: $.turnCounter,
    queryChainId: E,
    queryDepth: H.depth
  });
  let bA = [...(await MA.getAppState()).queuedCommands],
    jA = [];
  l("tengu_query_before_attachments", {
    messagesForQueryCount: z.length,
    assistantMessagesCount: M.length,
    toolResultsCount: _.length,
    queryChainId: E,
    queryDepth: H.depth
  });
  for await (let zA of VHA(null, MA, null, bA, [...z, ...M, ..._], D)) if (yield zA, _.push(zA), uF1(zA)) jA.push(zA);
  let OA = _.filter((zA) => zA.type === "attachment" && zA.attachment.type === "edited_text_file").length;
  l("tengu_query_after_attachments", {
    totalToolResultsCount: _.length,
    fileChangeAttachmentCount: OA,
    queryChainId: E,
    queryDepth: H.depth
  });
  let IA = bA.filter((zA) => zA.mode === "prompt");
  U32(IA, MA.setAppState);
  let HA = {
      ...MA,
      pendingSteeringAttachments: jA.length > 0 ? jA : void 0,
      queryTracking: H
    },
    ZA = F + 1;
  if (V && ZA > V) {
    yield X4({
      type: "max_turns_reached",
      maxTurns: V,
      turnCount: ZA
    });
    return
  }
  h6("query_recursive_call"), yield* aN({
    messages: [...z, ...M, ..._],
    systemPrompt: Q,
    userContext: B,
    systemContext: G,
    canUseTool: Z,
    toolUseContext: HA,
    autoCompactTracking: $,
    fallbackModel: X,
    stopHookActive: I,
    querySource: D,
    maxTurns: V,
    turnCount: ZA
  })
}
// @from(Ln 394055, Col 0)
async function* T77(A, Q, B, G, Z, Y, J, X, I, D, W, K) {
  if (J.pendingSteeringAttachments && J.pendingSteeringAttachments.length > 0) {
    let V = [];
    for (let F of J.pendingSteeringAttachments) {
      let H = F.attachment;
      if (H.type === "queued_command") {
        let E = H0({
          content: H.prompt,
          isMeta: !0
        });
        V.push(E)
      }
    }
    if (V.length > 0) {
      let F = {
        ...J,
        pendingSteeringAttachments: void 0
      };
      l("tengu_steering_attachment_resending", {
        queryChainId: J.queryTracking?.chainId,
        queryDepth: J.queryTracking?.depth
      }), yield* aN({
        messages: [...A, ...Q, ...V],
        systemPrompt: B,
        userContext: G,
        systemContext: Z,
        canUseTool: Y,
        toolUseContext: F,
        autoCompactTracking: I,
        fallbackModel: D,
        querySource: X,
        maxTurns: W,
        turnCount: K
      })
    }
    return
  }
}
// @from(Ln 394093, Col 0)
async function* P77(A, Q, B, G, Z, Y, J, X, I, D, W, K, V) {
  let F = Date.now(),
    H = {
      messages: [...A, ...Q],
      systemPrompt: B,
      userContext: G,
      systemContext: Z,
      toolUseContext: J,
      querySource: X
    };
  if (sA9(H), process.env.CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION !== "false") W19(H);
  try {
    let E = [],
      $ = (await J.getAppState()).toolPermissionContext.mode,
      O = aU0($, J.abortController.signal, void 0, W ?? !1, J.agentId, J, [...A, ...Q]),
      L = "",
      M = 0,
      _ = !1,
      j = "",
      x = !1,
      b = [],
      S = [];
    for await (let u of O) {
      if (u.message) {
        if (yield u.message, u.message.type === "progress" && u.message.toolUseID) {
          L = u.message.toolUseID, M++;
          let f = u.message.data;
          if (f.command) S.push({
            command: f.command,
            promptText: f.promptText
          })
        }
        if (u.message.type === "attachment") {
          let f = u.message.attachment;
          if ("hookEvent" in f && (f.hookEvent === "Stop" || f.hookEvent === "SubagentStop")) {
            if (f.type === "hook_non_blocking_error") b.push(f.stderr || `Exit code ${f.exitCode}`), x = !0;
            else if (f.type === "hook_error_during_execution") b.push(f.content), x = !0;
            else if (f.type === "hook_success") {
              if (f.stdout && f.stdout.trim() || f.stderr && f.stderr.trim()) x = !0
            }
          }
        }
      }
      if (u.blockingError) {
        let f = H0({
          content: dU0(u.blockingError),
          isMeta: !0
        });
        E.push(f), yield f, x = !0, b.push(u.blockingError.blockingError)
      }
      if (u.preventContinuation) _ = !0, j = u.stopReason || "Stop hook prevented continuation", yield X4({
        type: "hook_stopped_continuation",
        message: j,
        hookName: "Stop",
        toolUseID: L,
        hookEvent: "Stop"
      });
      if (J.abortController.signal.aborted) {
        l("tengu_pre_stop_hooks_cancelled", {
          queryChainId: J.queryTracking?.chainId,
          queryDepth: J.queryTracking?.depth
        }), yield fhA({
          toolUse: !1
        });
        return
      }
    }
    if (M > 0) {
      if (yield V19(M, S, b, _, j, x, "suggestion", L), b.length > 0) {
        let u = BN("app:toggleTranscript", "Global", "ctrl+o");
        J.addNotification?.({
          key: "stop-hook-error",
          text: `Stop hook error occurred · ${u} to see`,
          priority: "immediate"
        })
      }
    }
    if (_) return;
    if (E.length > 0) yield* aN({
      messages: [...A, ...Q, ...E],
      systemPrompt: B,
      userContext: G,
      systemContext: Z,
      canUseTool: Y,
      toolUseContext: J,
      autoCompactTracking: I,
      fallbackModel: D,
      stopHookActive: !0,
      querySource: X,
      maxTurns: K,
      turnCount: V
    })
  } catch (E) {
    let z = Date.now() - F;
    l("tengu_stop_hook_error", {
      duration: z,
      queryChainId: J.queryTracking?.chainId,
      queryDepth: J.queryTracking?.depth
    }), yield hO(`Stop hook failed: ${E instanceof Error?E.message:String(E)}`, "warning")
  }
}
// @from(Ln 394194, Col 0)
async function* KM0(A, Q, B, G) {
  let Z = G;
  for (let {
      isConcurrencySafe: Y,
      blocks: J
    }
    of S77(A, Z))
    if (Y) {
      let X = {};
      for await (let I of y77(J, Q, B, Z)) {
        if (I.contextModifier) {
          let {
            toolUseID: D,
            modifyContext: W
          } = I.contextModifier;
          if (!X[D]) X[D] = [];
          X[D].push(W)
        }
        yield {
          message: I.message,
          newContext: Z
        }
      }
      for (let I of J) {
        let D = X[I.id];
        if (!D) continue;
        for (let W of D) Z = W(Z)
      }
      yield {
        newContext: Z
      }
    } else
      for await (let X of x77(J, Q, B, Z)) {
        if (X.newContext) Z = X.newContext;
        yield {
          message: X.message,
          newContext: Z
        }
      }
}
// @from(Ln 394235, Col 0)
function S77(A, Q) {
  return A.reduce((B, G) => {
    let Z = Q.options.tools.find((X) => X.name === G.name),
      Y = Z?.inputSchema.safeParse(G.input),
      J = Y?.success ? Boolean(Z?.isConcurrencySafe(Y.data)) : !1;
    if (J && B[B.length - 1]?.isConcurrencySafe) B[B.length - 1].blocks.push(G);
    else B.push({
      isConcurrencySafe: J,
      blocks: [G]
    });
    return B
  }, [])
}
// @from(Ln 394248, Col 0)
async function* x77(A, Q, B, G) {
  let Z = G;
  for (let Y of A) {
    G.setInProgressToolUseIDs((J) => new Set([...J, Y.id]));
    for await (let J of jH1(Y, Q.find((X) => X.message.content.some((I) => I.type === "tool_use" && I.id === Y.id)), B, Z)) {
      if (J.contextModifier) Z = J.contextModifier.modifyContext(Z);
      yield {
        message: J.message,
        newContext: Z
      }
    }
    D19(G, Y.id)
  }
}
// @from(Ln 394262, Col 0)
async function* y77(A, Q, B, G) {
  yield* SVA(A.map(async function* (Z) {
    G.setInProgressToolUseIDs((Y) => new Set([...Y, Z.id])), yield* jH1(Z, Q.find((Y) => Y.message.content.some((J) => J.type === "tool_use" && J.id === Z.id)), B, G), D19(G, Z.id)
  }), _77())
}
// @from(Ln 394268, Col 0)
function D19(A, Q) {
  A.setInProgressToolUseIDs((B) => new Set([...B].filter((G) => G !== Q)))
}
// @from(Ln 394272, Col 0)
function v77(A, Q) {
  if (!A.startsWith("mcp__")) return;
  let B = qF(A);
  if (!B) return;
  let G = Q.find((Z) => e3(Z.name) === B.serverName);
  if (G?.type === "connected") return G.config.type ?? "stdio";
  return
}
// @from(Ln 394280, Col 0)
async function* jH1(A, Q, B, G) {
  let Z = A.name,
    Y = K91(G.options.tools, Z),
    J = Q.message.id,
    X = Q.requestId,
    I = v77(Z, G.options.mcpClients);
  if (!Y) {
    let W = k9(Z);
    l("tengu_tool_use_error", {
      error: `No such tool available: ${W}`,
      toolName: W,
      toolUseID: A.id,
      isMcp: Z.startsWith("mcp__"),
      queryChainId: G.queryTracking?.chainId,
      queryDepth: G.queryTracking?.depth,
      ...I ? {
        mcpServerType: I
      } : {},
      ...X ? {
        requestId: X
      } : {}
    }), yield {
      message: H0({
        content: [{
          type: "tool_result",
          content: `<tool_use_error>Error: No such tool available: ${Z}</tool_use_error>`,
          is_error: !0,
          tool_use_id: A.id
        }],
        toolUseResult: `Error: No such tool available: ${Z}`,
        sourceToolAssistantUUID: Q.uuid
      })
    };
    return
  }
  let D = A.input;
  try {
    if (G.abortController.signal.aborted) {
      l("tengu_tool_use_cancelled", {
        toolName: k9(Y.name),
        toolUseID: A.id,
        isMcp: Y.isMcp ?? !1,
        queryChainId: G.queryTracking?.chainId,
        queryDepth: G.queryTracking?.depth,
        ...I ? {
          mcpServerType: I
        } : {},
        ...X ? {
          requestId: X
        } : {}
      });
      let W = FM0(A.id);
      yield {
        message: H0({
          content: [W],
          toolUseResult: aVA,
          sourceToolAssistantUUID: Q.uuid
        })
      };
      return
    }
    for await (let W of k77(Y, A.id, D, G, B, Q, J, X, I)) yield W
  } catch (W) {
    e(W instanceof Error ? W : Error(String(W)));
    let K = W instanceof Error ? W.message : String(W),
      F = `Error calling tool${Y?` (${Y.name})`:""}: ${K}`;
    yield {
      message: H0({
        content: [{
          type: "tool_result",
          content: `<tool_use_error>${F}</tool_use_error>`,
          is_error: !0,
          tool_use_id: A.id
        }],
        toolUseResult: F,
        sourceToolAssistantUUID: Q.uuid
      })
    }
  }
}
// @from(Ln 394361, Col 0)
function k77(A, Q, B, G, Z, Y, J, X, I) {
  let D = new khA;
  return b77(A, Q, B, G, Z, Y, J, X, I, (W) => {
    l("tengu_tool_use_progress", {
      messageID: J,
      toolName: k9(A.name),
      isMcp: A.isMcp ?? !1,
      queryChainId: G.queryTracking?.chainId,
      queryDepth: G.queryTracking?.depth,
      ...I ? {
        mcpServerType: I
      } : {},
      ...X ? {
        requestId: X
      } : {}
    }), D.enqueue({
      message: K19({
        toolUseID: W.toolUseID,
        parentToolUseID: Q,
        data: W.data
      })
    })
  }).then((W) => {
    for (let K of W) D.enqueue(K)
  }).catch((W) => {
    D.error(W)
  }).finally(() => {
    D.done()
  }), D
}
// @from(Ln 394391, Col 0)
async function b77(A, Q, B, G, Z, Y, J, X, I, D) {
  let W = A.inputSchema.safeParse(B);
  if (!W.success) {
    let j = u77(A.name, W.error);
    return l("tengu_tool_use_error", {
      error: "InputValidationError",
      errorDetails: j.slice(0, 2000),
      messageID: J,
      toolName: k9(A.name),
      isMcp: A.isMcp ?? !1,
      queryChainId: G.queryTracking?.chainId,
      queryDepth: G.queryTracking?.depth,
      ...I ? {
        mcpServerType: I
      } : {},
      ...X ? {
        requestId: X
      } : {}
    }), [{
      message: H0({
        content: [{
          type: "tool_result",
          content: `<tool_use_error>InputValidationError: ${j}</tool_use_error>`,
          is_error: !0,
          tool_use_id: Q
        }],
        toolUseResult: `InputValidationError: ${W.error.message}`,
        sourceToolAssistantUUID: Y.uuid
      })
    }]
  }
  let K = await A.validateInput?.(W.data, G);
  if (K?.result === !1) return l("tengu_tool_use_error", {
    messageID: J,
    toolName: k9(A.name),
    error: K.message,
    errorCode: K.errorCode,
    isMcp: A.isMcp ?? !1,
    queryChainId: G.queryTracking?.chainId,
    queryDepth: G.queryTracking?.depth,
    ...I ? {
      mcpServerType: I
    } : {},
    ...X ? {
      requestId: X
    } : {}
  }), [{
    message: H0({
      content: [{
        type: "tool_result",
        content: `<tool_use_error>${K.message}</tool_use_error>`,
        is_error: !0,
        tool_use_id: Q
      }],
      toolUseResult: `Error: ${K.message}`,
      sourceToolAssistantUUID: Y.uuid
    })
  }];
  let V = [],
    F = W.data,
    H = !1,
    E, z;
  for await (let j of g77(G, A, F, Q, Y.message.id, X, I)) switch (j.type) {
    case "message":
      if (j.message.message.type === "progress") D(j.message.message);
      else V.push(j.message);
      break;
    case "hookPermissionResult":
      z = j.hookPermissionResult;
      break;
    case "hookUpdatedInput":
      F = j.updatedInput;
      break;
    case "preventContinuation":
      H = j.shouldPreventContinuation;
      break;
    case "stopReason":
      E = j.stopReason;
      break;
    case "stop":
      return V.push({
        message: H0({
          content: [FM0(Q)],
          toolUseResult: `Error: ${E}`,
          sourceToolAssistantUUID: Y.uuid
        })
      }), V
  }
  let $ = {};
  if (F && typeof F === "object") {
    if (A.name === z3 && "file_path" in F) $.file_path = String(F.file_path);
    else if ((A.name === I8 || A.name === BY) && "file_path" in F) $.file_path = String(F.file_path);
    else if (A.name === X9 && "command" in F) {
      let j = F;
      $.full_command = j.command
    }
  }
  J82(A.name, $), X82();
  let O;
  if (z !== void 0 && z.behavior === "allow" && !A.requiresUserInteraction?.()) k(`Hook approved tool use for ${A.name}, bypassing permission check`), O = z;
  else if (z !== void 0 && z.behavior === "allow" && A.requiresUserInteraction?.()) k(`Hook approved tool use for ${A.name}, but tool requires user interaction`), O = await Z(A, F, G, Y, Q);
  else if (z !== void 0 && z.behavior === "deny") k(`Hook denied tool use for ${A.name}`), O = z;
  else {
    let j = z?.behavior === "ask" ? z : void 0;
    if (z?.behavior === "ask" && z.updatedInput) F = z.updatedInput;
    O = await Z(A, F, G, Y, Q, j)
  }
  if (O.decisionReason?.type === "hook" && O.decisionReason.hookName === "PermissionRequest" && O.behavior !== "ask") V.push({
    message: X4({
      type: "hook_permission_decision",
      decision: O.behavior,
      toolUseID: Q,
      hookEvent: "PermissionRequest"
    })
  });
  if (O.behavior !== "allow") {
    let j = G.toolDecisions?.get(Q);
    pI0("reject", j?.source || "unknown"), sZ1(), l("tengu_tool_use_can_use_tool_rejected", {
      messageID: J,
      toolName: k9(A.name),
      queryChainId: G.queryTracking?.chainId,
      queryDepth: G.queryTracking?.depth,
      ...I ? {
        mcpServerType: I
      } : {},
      ...X ? {
        requestId: X
      } : {}
    });
    let x = O.message;
    if (H && !x) x = `Execution stopped by PreToolUse hook${E?`: ${E}`:""}`;
    return V.push({
      message: H0({
        content: [{
          type: "tool_result",
          content: x,
          is_error: !0,
          tool_use_id: Q
        }],
        toolUseResult: `Error: ${x}`,
        sourceToolAssistantUUID: Y.uuid
      })
    }), V
  }
  if (l("tengu_tool_use_can_use_tool_allowed", {
      messageID: J,
      toolName: k9(A.name),
      queryChainId: G.queryTracking?.chainId,
      queryDepth: G.queryTracking?.depth,
      ...I ? {
        mcpServerType: I
      } : {},
      ...X ? {
        requestId: X
      } : {}
    }), O.updatedInput !== void 0) F = O.updatedInput;
  let L = {};
  if (A.name === X9 && "command" in F) {
    let j = F;
    L = {
      bash_command: j.command.trim().split(/\s+/)[0] || "",
      full_command: j.command,
      ...j.timeout !== void 0 && {
        timeout: j.timeout
      },
      ...j.description !== void 0 && {
        description: j.description
      },
      ..."dangerouslyDisableSandbox" in j && {
        dangerouslyDisableSandbox: j.dangerouslyDisableSandbox
      }
    }
  }
  let M = G.toolDecisions?.get(Q);
  pI0(M?.decision || "unknown", M?.source || "unknown"), I82();
  let _ = Date.now();
  try {
    let j = await A.call(F, {
        ...G,
        userModified: O.userModified ?? !1
      }, Z, Y, (p) => {
        D({
          toolUseID: p.toolUseID,
          data: p.data
        })
      }),
      x = Date.now() - _;
    if (aU1(x), j.data && typeof j.data === "object") {
      let p = {};
      if (A.name === z3 && "content" in j.data) {
        if ("file_path" in F) p.file_path = String(F.file_path);
        p.content = String(j.data.content)
      }
      if ((A.name === I8 || A.name === BY) && "file_path" in F) {
        if (p.file_path = String(F.file_path), A.name === I8 && "diff" in j.data) p.diff = String(j.data.diff);
        if (A.name === BY && "content" in F) p.content = String(F.content)
      }
      if (A.name === X9 && "command" in F) {
        let GA = F;
        if (p.bash_command = GA.command, "output" in j.data) p.output = String(j.data.output)
      }
      if (Object.keys(p).length > 0) D82("tool.output", p)
    }
    if (typeof j === "object" && "structured_output" in j) V.push({
      message: X4({
        type: "structured_output",
        data: j.structured_output
      })
    });
    lI0({
      success: !0
    });
    let b = j.data && typeof j.data === "object" ? eA(j.data) : String(j.data ?? "");
    sZ1(b);
    let S = 0;
    try {
      S = eA(j.data).length
    } catch (p) {
      e(p instanceof Error ? p : Error(String(p)))
    }
    l("tengu_tool_use_success", {
      messageID: J,
      toolName: k9(A.name),
      isMcp: A.isMcp ?? !1,
      durationMs: x,
      toolResultSizeBytes: S,
      queryChainId: G.queryTracking?.chainId,
      queryDepth: G.queryTracking?.depth,
      ...I ? {
        mcpServerType: I
      } : {},
      ...X ? {
        requestId: X
      } : {}
    });
    let u = $j(A) ? WM0(A.name) : null;
    LF("tool_result", {
      tool_name: k9(A.name),
      success: "true",
      duration_ms: String(x),
      ...Object.keys(L).length > 0 && {
        tool_parameters: eA(L)
      },
      tool_result_size_bytes: String(S),
      ...M && {
        decision_source: M.source,
        decision_type: M.decision
      },
      ...u && {
        mcp_server_scope: u
      }
    });
    let f = j.data,
      AA = [],
      n = j.contextModifier;
    async function y(p) {
      let WA = [await YZ1(A, p, Q)];
      if ("acceptFeedback" in O && O.acceptFeedback) WA.push({
        type: "text",
        text: O.acceptFeedback
      });
      V.push({
        message: H0({
          content: WA,
          toolUseResult: p,
          sourceToolAssistantUUID: Y.uuid
        }),
        contextModifier: n ? {
          toolUseID: Q,
          modifyContext: n
        } : void 0
      })
    }
    if (!$j(A)) await y(f);
    for await (let p of f77(G, A, Q, Y.message.id, F, f, X, I)) if ("updatedMCPToolOutput" in p) {
      if ($j(A)) f = p.updatedMCPToolOutput
    } else if ($j(A)) AA.push(p);
    else V.push(p);
    if ($j(A)) await y(f);
    if (j.newMessages && j.newMessages.length > 0)
      for (let p of j.newMessages) V.push({
        message: p
      });
    if (H) V.push({
      message: X4({
        type: "hook_stopped_continuation",
        message: E || "Execution stopped by hook",
        hookName: `PreToolUse:${A.name}`,
        toolUseID: Q,
        hookEvent: "PreToolUse"
      })
    });
    for (let p of AA) V.push(p);
    return V
  } catch (j) {
    let x = Date.now() - _;
    if (aU1(x), lI0({
        success: !1,
        error: j instanceof Error ? j.message : String(j)
      }), sZ1(), !(j instanceof aG)) {
      if (!(j instanceof ay)) e(j instanceof Error ? j : Error(String(j)));
      l("tengu_tool_use_error", {
        messageID: J,
        toolName: k9(A.name),
        error: j instanceof Error ? j.constructor.name : "UnknownError",
        isMcp: A.isMcp ?? !1,
        queryChainId: G.queryTracking?.chainId,
        queryDepth: G.queryTracking?.depth,
        ...I ? {
          mcpServerType: I
        } : {},
        ...X ? {
          requestId: X
        } : {}
      });
      let f = $j(A) ? WM0(A.name) : null;
      LF("tool_result", {
        tool_name: k9(A.name),
        use_id: Q,
        success: "false",
        duration_ms: String(x),
        error: j instanceof Error ? j.message : String(j),
        ...Object.keys(L).length > 0 && {
          tool_parameters: eA(L)
        },
        ...M && {
          decision_source: M.source,
          decision_type: M.decision
        },
        ...f && {
          mcp_server_scope: f
        }
      })
    }
    let b = PH1(j),
      S = j instanceof aG,
      u = [];
    for await (let f of h77(G, A, Q, J, F, b, S, X, I)) u.push(f);
    return [{
      message: H0({
        content: [{
          type: "tool_result",
          content: b,
          is_error: !0,
          tool_use_id: Q
        }],
        toolUseResult: `Error: ${b}`,
        sourceToolAssistantUUID: Y.uuid
      })
    }, ...u]
  } finally {
    if (M) G.toolDecisions?.delete(Q)
  }
}
// @from(Ln 394745, Col 0)
async function* f77(A, Q, B, G, Z, Y, J, X) {
  let I = Date.now();
  try {
    let W = (await A.getAppState()).toolPermissionContext.mode,
      K = Y;
    for await (let V of iU0(Q.name, B, Z, K, A, W, A.abortController.signal)) try {
      if (V.message?.type === "attachment" && V.message.attachment.type === "hook_cancelled") {
        l("tengu_post_tool_hooks_cancelled", {
          toolName: k9(Q.name),
          queryChainId: A.queryTracking?.chainId,
          queryDepth: A.queryTracking?.depth
        }), yield {
          message: X4({
            type: "hook_cancelled",
            hookName: `PostToolUse:${Q.name}`,
            toolUseID: B,
            hookEvent: "PostToolUse"
          })
        };
        continue
      }
      if (V.message) yield {
        message: V.message
      };
      if (V.blockingError) yield {
        message: X4({
          type: "hook_blocking_error",
          hookName: `PostToolUse:${Q.name}`,
          toolUseID: B,
          hookEvent: "PostToolUse",
          blockingError: V.blockingError
        })
      };
      if (V.preventContinuation) {
        yield {
          message: X4({
            type: "hook_stopped_continuation",
            message: V.stopReason || "Execution stopped by PostToolUse hook",
            hookName: `PostToolUse:${Q.name}`,
            toolUseID: B,
            hookEvent: "PostToolUse"
          })
        };
        return
      }
      if (V.additionalContexts && V.additionalContexts.length > 0) yield {
        message: X4({
          type: "hook_additional_context",
          content: V.additionalContexts,
          hookName: `PostToolUse:${Q.name}`,
          toolUseID: B,
          hookEvent: "PostToolUse"
        })
      };
      if (V.updatedMCPToolOutput && $j(Q)) K = V.updatedMCPToolOutput, yield {
        updatedMCPToolOutput: K
      }
    } catch (F) {
      let H = Date.now() - I;
      l("tengu_post_tool_hook_error", {
        messageID: G,
        toolName: k9(Q.name),
        isMcp: Q.isMcp ?? !1,
        duration: H,
        queryChainId: A.queryTracking?.chainId,
        queryDepth: A.queryTracking?.depth,
        ...X ? {
          mcpServerType: X
        } : {},
        ...J ? {
          requestId: J
        } : {}
      }), yield {
        message: X4({
          type: "hook_error_during_execution",
          content: PH1(F),
          hookName: `PostToolUse:${Q.name}`,
          toolUseID: B,
          hookEvent: "PostToolUse"
        })
      }
    }
  } catch (D) {
    e(D instanceof Error ? D : Error(String(D)))
  }
}
// @from(Ln 394831, Col 0)
async function* h77(A, Q, B, G, Z, Y, J, X, I) {
  let D = Date.now();
  try {
    let K = (await A.getAppState()).toolPermissionContext.mode;
    for await (let V of nU0(Q.name, B, Z, Y, A, J, K, A.abortController.signal)) try {
      if (V.message?.type === "attachment" && V.message.attachment.type === "hook_cancelled") {
        l("tengu_post_tool_failure_hooks_cancelled", {
          toolName: k9(Q.name),
          queryChainId: A.queryTracking?.chainId,
          queryDepth: A.queryTracking?.depth
        }), yield {
          message: X4({
            type: "hook_cancelled",
            hookName: `PostToolUseFailure:${Q.name}`,
            toolUseID: B,
            hookEvent: "PostToolUseFailure"
          })
        };
        continue
      }
      if (V.message) yield {
        message: V.message
      };
      if (V.blockingError) yield {
        message: X4({
          type: "hook_blocking_error",
          hookName: `PostToolUseFailure:${Q.name}`,
          toolUseID: B,
          hookEvent: "PostToolUseFailure",
          blockingError: V.blockingError
        })
      };
      if (V.additionalContexts && V.additionalContexts.length > 0) yield {
        message: X4({
          type: "hook_additional_context",
          content: V.additionalContexts,
          hookName: `PostToolUseFailure:${Q.name}`,
          toolUseID: B,
          hookEvent: "PostToolUseFailure"
        })
      }
    } catch (F) {
      let H = Date.now() - D;
      l("tengu_post_tool_failure_hook_error", {
        messageID: G,
        toolName: k9(Q.name),
        isMcp: Q.isMcp ?? !1,
        duration: H,
        queryChainId: A.queryTracking?.chainId,
        queryDepth: A.queryTracking?.depth,
        ...I ? {
          mcpServerType: I
        } : {},
        ...X ? {
          requestId: X
        } : {}
      }), yield {
        message: X4({
          type: "hook_error_during_execution",
          content: PH1(F),
          hookName: `PostToolUseFailure:${Q.name}`,
          toolUseID: B,
          hookEvent: "PostToolUseFailure"
        })
      }
    }
  } catch (W) {
    e(W instanceof Error ? W : Error(String(W)))
  }
}
// @from(Ln 394901, Col 0)
async function* g77(A, Q, B, G, Z, Y, J) {
  let X = Date.now();
  try {
    let I = await A.getAppState();
    for await (let D of lU0(Q.name, G, B, A, I.toolPermissionContext.mode, A.abortController.signal)) try {
      if (D.message) yield {
        type: "message",
        message: {
          message: D.message
        }
      };
      if (D.blockingError) {
        let W = mU0(`PreToolUse:${Q.name}`, D.blockingError);
        yield {
          type: "hookPermissionResult",
          hookPermissionResult: {
            behavior: "deny",
            message: W,
            decisionReason: {
              type: "hook",
              hookName: `PreToolUse:${Q.name}`,
              reason: W
            }
          }
        }
      }
      if (D.preventContinuation) {
        if (yield {
            type: "preventContinuation",
            shouldPreventContinuation: !0
          }, D.stopReason) yield {
          type: "stopReason",
          stopReason: D.stopReason
        }
      }
      if (D.permissionBehavior !== void 0) {
        k(`Hook result has permissionBehavior=${D.permissionBehavior}`);
        let W = {
          type: "hook",
          hookName: `PreToolUse:${Q.name}`,
          reason: D.hookPermissionDecisionReason
        };
        if (D.permissionBehavior === "allow") yield {
          type: "hookPermissionResult",
          hookPermissionResult: {
            behavior: "allow",
            updatedInput: D.updatedInput,
            decisionReason: W
          }
        };
        else if (D.permissionBehavior === "ask") yield {
          type: "hookPermissionResult",
          hookPermissionResult: {
            behavior: "ask",
            updatedInput: D.updatedInput,
            message: D.hookPermissionDecisionReason || `Hook PreToolUse:${Q.name} ${tB0(D.permissionBehavior)} this tool`,
            decisionReason: W
          }
        };
        else yield {
          type: "hookPermissionResult",
          hookPermissionResult: {
            behavior: D.permissionBehavior,
            message: D.hookPermissionDecisionReason || `Hook PreToolUse:${Q.name} ${tB0(D.permissionBehavior)} this tool`,
            decisionReason: W
          }
        }
      }
      if (D.updatedInput && D.permissionBehavior === void 0) yield {
        type: "hookUpdatedInput",
        updatedInput: D.updatedInput
      };
      if (A.abortController.signal.aborted) {
        l("tengu_pre_tool_hooks_cancelled", {
          toolName: k9(Q.name),
          queryChainId: A.queryTracking?.chainId,
          queryDepth: A.queryTracking?.depth
        }), yield {
          type: "message",
          message: {
            message: X4({
              type: "hook_cancelled",
              hookName: `PreToolUse:${Q.name}`,
              toolUseID: G,
              hookEvent: "PreToolUse"
            })
          }
        }, yield {
          type: "stop"
        };
        return
      }
    } catch (W) {
      e(W instanceof Error ? W : Error(String(W)));
      let K = Date.now() - X;
      l("tengu_pre_tool_hook_error", {
        messageID: Z,
        toolName: k9(Q.name),
        isMcp: Q.isMcp ?? !1,
        duration: K,
        queryChainId: A.queryTracking?.chainId,
        queryDepth: A.queryTracking?.depth,
        ...J ? {
          mcpServerType: J
        } : {},
        ...Y ? {
          requestId: Y
        } : {}
      }), yield {
        type: "message",
        message: {
          message: X4({
            type: "hook_error_during_execution",
            content: PH1(W),
            hookName: `PreToolUse:${Q.name}`,
            toolUseID: G,
            hookEvent: "PreToolUse"
          })
        }
      }, yield {
        type: "stop"
      }
    }
  } catch (I) {
    e(I instanceof Error ? I : Error(String(I))), yield {
      type: "stop"
    };
    return
  }
}
// @from(Ln 395032, Col 0)
function PH1(A) {
  if (A instanceof aG) return A.message || vN;
  if (!(A instanceof Error)) return String(A);
  let B = VM0(A).filter(Boolean).join(`
`).trim() || "Command failed with no output";
  if (B.length <= 1e4) return B;
  let G = 5000,
    Z = B.slice(0, G),
    Y = B.slice(-G);
  return `${Z}

... [${B.length-1e4} characters truncated] ...

${Y}`
}
// @from(Ln 395048, Col 0)
function VM0(A) {
  if (A instanceof ay) return [`Exit code ${A.code}`, A.interrupted ? vN : "", A.stderr, A.stdout];
  let Q = [A.message];
  if ("stderr" in A && typeof A.stderr === "string") Q.push(A.stderr);
  if ("stdout" in A && typeof A.stdout === "string") Q.push(A.stdout);
  return Q
}
// @from(Ln 395056, Col 0)
function I19(A) {
  if (A.length === 0) return "";
  return A.reduce((Q, B, G) => {
    let Z = String(B);
    if (typeof B === "number") return `${String(Q)}[${Z}]`;
    return G === 0 ? Z : `${String(Q)}.${Z}`
  }, "")
}
// @from(Ln 395065, Col 0)
function u77(A, Q) {
  let B = Q.issues.filter((X) => X.code === "invalid_type" && X.message.includes("received undefined")).map((X) => I19(X.path)),
    G = Q.issues.filter((X) => X.code === "unrecognized_keys").flatMap((X) => X.keys),
    Z = Q.issues.filter((X) => X.code === "invalid_type" && !X.message.includes("received undefined")).map((X) => {
      let I = X,
        D = X.message.match(/received (\w+)/),
        W = D ? D[1] : "unknown";
      return {
        param: I19(X.path),
        expected: I.expected,
        received: W
      }
    }),
    Y = Q.message,
    J = [];
  if (B.length > 0) {
    let X = B.map((I) => `The required parameter \`${I}\` is missing`);
    J.push(...X)
  }
  if (G.length > 0) {
    let X = G.map((I) => `An unexpected parameter \`${I}\` was provided`);
    J.push(...X)
  }
  if (Z.length > 0) {
    let X = Z.map(({
      param: I,
      expected: D,
      received: W
    }) => `The parameter \`${I}\` type is expected as \`${D}\` but provided as \`${W}\``);
    J.push(...X)
  }
  if (J.length > 0) Y = `${A} failed due to the following ${J.length>1?"issues":"issue"}:
${J.join(`
`)}`;
  return Y
}
// @from(Ln 395101, Col 4)
j77 = 3
// @from(Ln 395102, Col 4)
ks = w(() => {
  nY();
  hSA();
  nt();
  N3A();
  O6A();
  w6();
  Z0();
  hW();
  rEA();
  _51();
  Ib();
  fr();
  hr();
  C0();
  cW();
  pL();
  dA9();
  XX();
  XO();
  gr();
  v1();
  T1();
  wr();
  tQ();
  oc();
  m_();
  C0();
  xhA();
  l2();
  PJ();
  uC();
  zO();
  yhA();
  OyA();
  oA9();
  GM0();
  NX();
  hhA();
  vhA();
  PJ();
  VO();
  ZM0();
  A0();
  WzA()
})
// @from(Ln 395149, Col 0)
function m77(A) {
  if (A instanceof D9) {
    let Q = A.error;
    if (Q?.error?.message) return Q.error.message
  }
  return A instanceof Error ? A.message : String(A)
}
// @from(Ln 395157, Col 0)
function HM0(A) {
  let Q = new Set;
  A.forEach((B, G) => Q.add(G));
  for (let [B, G] of Object.entries(d77))
    if (G.prefixes?.some((Z) => Array.from(Q).some((Y) => Y.startsWith(Z)))) return B;
  return
}
// @from(Ln 395165, Col 0)
function EM0() {
  return {
    ...process.env.ANTHROPIC_BASE_URL ? {
      baseUrl: process.env.ANTHROPIC_BASE_URL
    } : {},
    ...process.env.ANTHROPIC_MODEL ? {
      envModel: process.env.ANTHROPIC_MODEL
    } : {},
    ...process.env.ANTHROPIC_SMALL_FAST_MODEL ? {
      envSmallFastModel: process.env.ANTHROPIC_SMALL_FAST_MODEL
    } : {}
  }
}
// @from(Ln 395179, Col 0)
function F19() {
  if (!{
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.1.7",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      BUILD_TIME: "2026-01-13T22:55:21Z"
    }.BUILD_TIME) return;
  let A = new Date({
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.7",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-01-13T22:55:21Z"
  }.BUILD_TIME).getTime();
  if (isNaN(A)) return;
  return Math.floor((Date.now() - A) / 60000)
}
// @from(Ln 395200, Col 0)
function H19({
  model: A,
  messagesLength: Q,
  temperature: B,
  betas: G,
  permissionMode: Z,
  querySource: Y,
  queryTracking: J
}) {
  l("tengu_api_query", {
    model: A,
    messagesLength: Q,
    temperature: B,
    provider: PT(),
    buildAgeMins: F19(),
    ...G?.length ? {
      betas: G.join(",")
    } : {},
    permissionMode: Z,
    querySource: Y,
    ...J ? {
      queryChainId: J.chainId,
      queryDepth: J.depth
    } : {},
    ...EM0()
  })
}
// @from(Ln 395228, Col 0)
function E19({
  error: A,
  model: Q,
  messageCount: B,
  messageTokens: G,
  durationMs: Z,
  durationMsIncludingRetries: Y,
  attempt: J,
  requestId: X,
  didFallBackToNonStreaming: I,
  promptCategory: D,
  headers: W,
  queryTracking: K,
  querySource: V,
  llmSpan: F
}) {
  let H = void 0;
  if (A instanceof D9 && A.headers) H = HM0(A.headers);
  else if (W) H = HM0(W);
  let E = m77(A),
    z = A instanceof D9 ? String(A.status) : void 0,
    $ = _eB(A),
    O = RSA(A);
  if (O) {
    let M = O.isSSLError ? " (SSL error)" : "";
    k(`Connection error details: code=${O.code}${M}, message=${O.message}`, {
      level: "error"
    })
  }
  e(A), l("tengu_api_error", {
    model: Q,
    error: E,
    status: z,
    errorType: $,
    messageCount: B,
    messageTokens: G,
    durationMs: Z,
    durationMsIncludingRetries: Y,
    attempt: J,
    provider: PT(),
    requestId: X || void 0,
    didFallBackToNonStreaming: I,
    ...D ? {
      promptCategory: D
    } : {},
    ...H ? {
      gateway: H
    } : {},
    ...K ? {
      queryChainId: K.chainId,
      queryDepth: K.depth
    } : {},
    ...V ? {
      querySource: V
    } : {},
    ...EM0()
  }), LF("api_error", {
    model: Q,
    error: E,
    status_code: String(z),
    duration_ms: String(Z),
    attempt: String(J)
  }), cI0(F, {
    success: !1,
    statusCode: z ? parseInt(z) : void 0,
    error: E,
    attempt: J
  });
  let L = Iq1();
  if (L?.isTeleported && !L.hasLoggedFirstMessage) l("tengu_teleport_first_message_error", {
    session_id: L.sessionId,
    error_type: $
  }), Dq1()
}
// @from(Ln 395303, Col 0)
function c77({
  model: A,
  preNormalizedModel: Q,
  messageCount: B,
  messageTokens: G,
  usage: Z,
  durationMs: Y,
  durationMsIncludingRetries: J,
  attempt: X,
  ttftMs: I,
  requestId: D,
  stopReason: W,
  costUSD: K,
  didFallBackToNonStreaming: V,
  querySource: F,
  gateway: H,
  queryTracking: E,
  permissionMode: z
}) {
  let $ = p2(),
    O = process.argv.includes("-p") || process.argv.includes("--print");
  l("tengu_api_success", {
    model: A,
    ...Q !== A ? {
      preNormalizedModel: Q
    } : {},
    messageCount: B,
    messageTokens: G,
    inputTokens: Z.input_tokens,
    outputTokens: Z.output_tokens,
    cachedInputTokens: Z.cache_read_input_tokens ?? 0,
    uncachedInputTokens: Z.cache_creation_input_tokens ?? 0,
    durationMs: Y,
    durationMsIncludingRetries: J,
    attempt: X,
    ttftMs: I ?? void 0,
    buildAgeMins: F19(),
    provider: PT(),
    requestId: D ?? void 0,
    stop_reason: W ?? void 0,
    costUSD: K,
    didFallBackToNonStreaming: V,
    isNonInteractiveSession: $,
    print: O,
    isTTY: process.stdout.isTTY ?? !1,
    querySource: F,
    ...H ? {
      gateway: H
    } : {},
    ...E ? {
      queryChainId: E.chainId,
      queryDepth: E.depth
    } : {},
    permissionMode: z,
    ...EM0()
  })
}
// @from(Ln 395361, Col 0)
function z19({
  model: A,
  preNormalizedModel: Q,
  start: B,
  startIncludingRetries: G,
  ttftMs: Z,
  usage: Y,
  attempt: J,
  messageCount: X,
  messageTokens: I,
  requestId: D,
  stopReason: W,
  didFallBackToNonStreaming: K,
  querySource: V,
  headers: F,
  costUSD: H,
  queryTracking: E,
  permissionMode: z,
  newMessages: $,
  llmSpan: O
}) {
  let L = F ? HM0(F) : void 0,
    M = Date.now() - B,
    _ = Date.now() - G;
  Mb0(_, M), c77({
    model: A,
    preNormalizedModel: Q,
    messageCount: X,
    messageTokens: I,
    usage: Y,
    durationMs: M,
    durationMsIncludingRetries: _,
    attempt: J,
    ttftMs: Z,
    requestId: D,
    stopReason: W,
    costUSD: H,
    didFallBackToNonStreaming: K,
    querySource: V,
    gateway: L,
    queryTracking: E,
    permissionMode: z
  }), LF("api_request", {
    model: A,
    input_tokens: String(Y.input_tokens),
    output_tokens: String(Y.output_tokens),
    cache_read_tokens: String(Y.cache_read_input_tokens),
    cache_creation_tokens: String(Y.cache_creation_input_tokens),
    cost_usd: String(H),
    duration_ms: String(M)
  });
  let j, x, b;
  if (JK() && $) j = $.flatMap((u) => u.message.content.filter((f) => f.type === "text").map((f) => f.text)).join(`
`) || void 0, b = $.some((u) => u.message.content.some((f) => f.type === "tool_use"));
  cI0(O, {
    success: !0,
    inputTokens: Y.input_tokens,
    outputTokens: Y.output_tokens,
    cacheReadTokens: Y.cache_read_input_tokens,
    cacheCreationTokens: Y.cache_creation_input_tokens,
    attempt: J,
    modelOutput: j,
    thinkingOutput: x,
    hasToolCall: b
  });
  let S = Iq1();
  if (S?.isTeleported && !S.hasLoggedFirstMessage) l("tengu_teleport_first_message_success", {
    session_id: S.sessionId
  }), Dq1()
}
// @from(Ln 395431, Col 4)
d77
// @from(Ln 395431, Col 9)
Cj
// @from(Ln 395432, Col 4)
ghA = w(() => {
  vk();
  v1();
  T1();
  MD();
  Z0();
  fr();
  hr();
  C0();
  XO();
  _9A();
  d77 = {
    litellm: {
      prefixes: ["x-litellm-"]
    },
    helicone: {
      prefixes: ["helicone-"]
    },
    portkey: {
      prefixes: ["x-portkey-"]
    },
    "cloudflare-ai-gateway": {
      prefixes: ["cf-aig-"]
    }
  };
  Cj = {
    input_tokens: 0,
    cache_creation_input_tokens: 0,
    cache_read_input_tokens: 0,
    output_tokens: 0,
    server_tool_use: {
      web_search_requests: 0,
      web_fetch_requests: 0
    },
    service_tier: "standard",
    cache_creation: {
      ephemeral_1h_input_tokens: 0,
      ephemeral_5m_input_tokens: 0
    }
  }
})
// @from(Ln 395477, Col 0)
function T3A(A) {
  return {
    systemPrompt: A.systemPrompt,
    userContext: A.userContext,
    systemContext: A.systemContext,
    toolUseContext: A.toolUseContext,
    forkContextMessages: A.messages
  }
}
// @from(Ln 395487, Col 0)
function l77(A, Q) {
  if (Q.length === 0) return A;
  return async () => {
    let B = await A();
    return {
      ...B,
      toolPermissionContext: {
        ...B.toolPermissionContext,
        alwaysAllowRules: {
          ...B.toolPermissionContext.alwaysAllowRules,
          command: [...new Set([...B.toolPermissionContext.alwaysAllowRules.command || [], ...Q])]
        }
      }
    }
  }
}
// @from(Ln 395503, Col 0)
async function TD1(A, Q, B) {
  let Z = (await A.getPromptForCommand(Q, B)).map((K) => K.type === "text" ? K.text : "").join(`
`),
    Y = Uc(A.allowedTools ?? []),
    J = l77(B.getAppState, Y),
    X = A.agent ?? "general-purpose",
    I = B.options.agentDefinitions.activeAgents,
    D = I.find((K) => K.agentType === X) ?? I.find((K) => K.agentType === "general-purpose");
  if (!D) throw Error("No agent available for forked execution");
  let W = [H0({
    content: Z
  })];
  return {
    skillContent: Z,
    modifiedGetAppState: J,
    baseAgent: D,
    promptMessages: W
  }
}
// @from(Ln 395523, Col 0)
function PD1(A, Q = "Execution completed") {
  let B = Qx(A);
  if (!B) return Q;
  return B.message.content.filter((Z) => Z.type === "text").map((Z) => ("text" in Z) ? Z.text : "").join(`
`) || Q
}
// @from(Ln 395530, Col 0)
function lkA(A, Q) {
  let B = Q?.abortController ?? (Q?.shareAbortController ? A.abortController : BcA(A.abortController)),
    G = Q?.getAppState ? Q.getAppState : Q?.shareAbortController ? A.getAppState : async () => {
      let Z = await A.getAppState();
      if (Z.toolPermissionContext.shouldAvoidPermissionPrompts) return Z;
      return {
        ...Z,
        toolPermissionContext: {
          ...Z.toolPermissionContext,
          shouldAvoidPermissionPrompts: !0
        }
      }
    };
  return {
    readFileState: m9A(Q?.readFileState ?? A.readFileState),
    nestedMemoryAttachmentTriggers: new Set,
    toolDecisions: void 0,
    pendingSteeringAttachments: void 0,
    abortController: B,
    getAppState: G,
    setAppState: Q?.shareSetAppState ? A.setAppState : () => {},
    setMessages: () => {},
    setInProgressToolUseIDs: () => {},
    setResponseLength: Q?.shareSetResponseLength ? A.setResponseLength : () => {},
    updateFileHistoryState: () => {},
    updateAttributionState: () => {},
    addNotification: void 0,
    setToolJSX: void 0,
    setStreamMode: void 0,
    setSpinnerMessage: void 0,
    setSpinnerColor: void 0,
    setSpinnerShimmerColor: void 0,
    setSDKStatus: void 0,
    openMessageSelector: void 0,
    options: Q?.options ?? A.options,
    messages: Q?.messages ?? A.messages,
    agentId: Q?.agentId ?? LS(),
    queryTracking: {
      chainId: p77(),
      depth: (A.queryTracking?.depth ?? -1) + 1
    },
    fileReadingLimits: A.fileReadingLimits,
    userModified: A.userModified,
    criticalSystemReminder_EXPERIMENTAL: Q?.criticalSystemReminder_EXPERIMENTAL
  }
}
// @from(Ln 395576, Col 0)
async function sc({
  promptMessages: A,
  cacheSafeParams: Q,
  canUseTool: B,
  querySource: G,
  forkLabel: Z,
  overrides: Y,
  maxOutputTokens: J,
  maxTurns: X,
  onMessage: I
}) {
  let D = Date.now(),
    W = [],
    K = {
      ...Cj
    },
    {
      systemPrompt: V,
      userContext: F,
      systemContext: H,
      toolUseContext: E,
      forkContextMessages: z
    } = Q,
    $ = lkA(E, Y),
    O = [...vz0(z), ...A];
  for await (let M of aN({
    messages: O,
    systemPrompt: V,
    userContext: F,
    systemContext: H,
    canUseTool: B,
    toolUseContext: $,
    querySource: G,
    maxOutputTokensOverride: J,
    maxTurns: X
  })) {
    if (M.type === "stream_event" || M.type === "stream_request_start") continue;
    if (M.type === "assistant") {
      let j = M.message.usage;
      if (j) K = SH1(K, {
        input_tokens: j.input_tokens ?? 0,
        cache_creation_input_tokens: j.cache_creation_input_tokens ?? 0,
        cache_read_input_tokens: j.cache_read_input_tokens ?? 0,
        output_tokens: j.output_tokens ?? 0,
        server_tool_use: {
          web_search_requests: j.server_tool_use?.web_search_requests ?? 0,
          web_fetch_requests: j.server_tool_use?.web_fetch_requests ?? 0
        },
        service_tier: j.service_tier ?? "standard",
        cache_creation: {
          ephemeral_1h_input_tokens: j.cache_creation?.ephemeral_1h_input_tokens ?? 0,
          ephemeral_5m_input_tokens: j.cache_creation?.ephemeral_5m_input_tokens ?? 0
        }
      })
    }
    W.push(M), I?.(M)
  }
  let L = Date.now() - D;
  return i77({
    forkLabel: Z,
    querySource: G,
    durationMs: L,
    messageCount: W.length,
    totalUsage: K,
    queryTracking: E.queryTracking
  }), {
    messages: W,
    totalUsage: K
  }
}
// @from(Ln 395647, Col 0)
function i77({
  forkLabel: A,
  querySource: Q,
  durationMs: B,
  messageCount: G,
  totalUsage: Z,
  queryTracking: Y
}) {
  let J = Z.input_tokens + Z.cache_creation_input_tokens + Z.cache_read_input_tokens,
    X = J > 0 ? Z.cache_read_input_tokens / J : 0;
  l("tengu_fork_agent_query", {
    forkLabel: A,
    querySource: Q,
    durationMs: B,
    messageCount: G,
    inputTokens: Z.input_tokens,
    outputTokens: Z.output_tokens,
    cacheReadInputTokens: Z.cache_read_input_tokens,
    cacheCreationInputTokens: Z.cache_creation_input_tokens,
    serviceTier: Z.service_tier,
    cacheCreationEphemeral1hTokens: Z.cache_creation.ephemeral_1h_input_tokens,
    cacheCreationEphemeral5mTokens: Z.cache_creation.ephemeral_5m_input_tokens,
    cacheHitRate: X,
    ...Y ? {
      queryChainId: Y.chainId,
      queryDepth: Y.depth
    } : {}
  })
}
// @from(Ln 395676, Col 4)
$c = w(() => {
  ks();
  nY();
  ghA();
  Z0();
  KHA();
  pC();
  d_();
  iZ();
  tQ();
  ys()
})
// @from(Ln 395689, Col 0)
function n77(A) {
  return A.trim().split(`
`).filter((Q) => Q.length > 0)
}
// @from(Ln 395694, Col 0)
function $19(A) {
  let Q = [],
    B = [],
    G = A.trim().split(`
`).filter((Z) => Z.length > 0);
  for (let Z of G) {
    let [Y, ...J] = Z.split("\t"), X = J.join("\t");
    if (!Y || !X) continue;
    if (Y.charAt(0) === "D") B.push(X);
    else Q.push(X)
  }
  return {
    modifications: Q,
    deletions: B
  }
}
// @from(Ln 395710, Col 0)
async function a77(A) {
  let Q = await J2("git", ["status", "--porcelain=v1"], {
    cwd: A
  });
  if (Q.code !== 0) return null;
  let B = Q.stdout;
  if (B.includes("UU ") || B.includes("AA ") || B.includes("DD ")) {
    let Z = (await J2("git", ["status"], {
      cwd: A
    })).stdout.toLowerCase();
    if (Z.includes("cherry-picking")) return "cherry-pick";
    if (Z.includes("rebasing")) return "rebase";
    if (Z.includes("merging")) return "merge";
    if (Z.includes("reverting")) return "revert";
    if (Z.includes("am")) return "am";
    if (Z.includes("bisect")) return "bisect";
    return "unknown merge conflict"
  }
  return null
}
// @from(Ln 395730, Col 0)
async function C19(A) {
  k(`[HFI:worktree] Snapshotting worktree at ${A}`);
  let Q = await a77(A);
  if (Q) throw Error(`Cannot snapshot worktree: in-progress ${Q} operation detected. Complete or abort the operation before snapshotting.`);
  let B = await J2("git", ["rev-parse", "HEAD"], {
    cwd: A
  });
  if (B.code !== 0) {
    let V = B.stderr || "";
    if (V.includes("unknown revision") || V.includes("ambiguous argument")) throw Error('Cannot snapshot worktree: repository has no commits. Please create an initial commit first (e.g., git commit --allow-empty -m "Initial commit").');
    throw Error(`Failed to get commit hash: ${V||B.error}`)
  }
  let G = B.stdout.trim(),
    Z = await J2("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
      cwd: A
    });
  if (Z.code !== 0) throw Error(`Failed to get branch name: ${Z.stderr||Z.error}`);
  let Y = Z.stdout.trim(),
    J = await J2("git", ["diff", "--cached", "--name-status"], {
      cwd: A
    }),
    X = $19(J.stdout),
    I = await J2("git", ["diff", "--name-status"], {
      cwd: A
    }),
    D = $19(I.stdout),
    W = await J2("git", ["ls-files", "--others", "--exclude-standard"], {
      cwd: A
    }),
    K = n77(W.stdout);
  return {
    commit: G,
    branch: Y,
    sourceWorktreePath: A,
    stagedFiles: X.modifications,
    stagedDeletions: X.deletions,
    modifiedFiles: D.modifications,
    modifiedDeletions: D.deletions,
    untrackedFiles: K
  }
}
// @from(Ln 395771, Col 4)
U19 = w(() => {
  t4();
  T1()
})
// @from(Ln 395776, Col 0)
function zM0({
  issue: A,
  branchName: Q,
  onDone: B,
  color: G = "permission",
  loadingState: Z
}) {
  let {
    hasUncommitted: Y,
    hasUnpushed: J
  } = A, X = "";
  if (Y && J) X = `Uncommitted changes and unpushed commits detected on ${Q}`;
  else if (Y) X = "Uncommitted changes detected";
  else X = `Unpushed commits detected on ${Q}`;

  function I(K) {
    B(K)
  }
  let D = Y ? "Commit and push my changes" : "Push my changes",
    W = Z === "committing" ? "Committing…" : Z === "pushing" ? "Pushing…" : null;
  return ZW.createElement(T, {
    flexDirection: "column",
    borderStyle: "round",
    borderColor: G,
    borderLeft: !1,
    borderRight: !1,
    borderBottom: !1,
    marginTop: 1
  }, ZW.createElement(T, {
    paddingX: 1
  }, ZW.createElement(C, {
    color: G,
    bold: !0
  }, "Include local changes in the remote task?")), ZW.createElement(T, {
    flexDirection: "column",
    paddingX: 1
  }, ZW.createElement(C, {
    dimColor: !0
  }, X), ZW.createElement(T, {
    marginTop: 1
  }, W ? ZW.createElement(T, {
    flexDirection: "row"
  }, ZW.createElement(W9, null), ZW.createElement(C, null, W)) : ZW.createElement(k0, {
    options: [{
      label: D,
      value: "commit-push"
    }, {
      label: "Run remote task without my local changes",
      value: "continue"
    }, {
      label: "Cancel",
      value: "cancel"
    }],
    onChange: I,
    onCancel: () => I("cancel"),
    layout: "compact-vertical"
  }))))
}
// @from(Ln 395834, Col 4)
ZW
// @from(Ln 395835, Col 4)
q19 = w(() => {
  fA();
  W8();
  yG();
  ZW = c(QA(), 1)
})
// @from(Ln 395841, Col 0)
async function N19(A, Q, B, G, Z, Y) {
  l("tengu_input_background", {}), Y(!0);
  let J = {
      text: `<background-task-input>${A}</background-task-input>`,
      type: "text"
    },
    X = H0({
      content: IU({
        inputString: J.text,
        precedingInputBlocks: Q
      })
    });
  Z({
    jsx: zZ.createElement(T, {
      flexDirection: "column"
    }, zZ.createElement(R6A, {
      addMargin: !0,
      param: J
    }), zZ.createElement(x0, null, zZ.createElement(C, {
      dimColor: !0
    }, "Initializing session…"))),
    shouldHidePromptInput: !1
  });
  try {
    let I = await ru2();
    if (!I.eligible) {
      let S = I.errors.map(su2).join(`

`);
      return {
        messages: [NE(), X, ...B, H0({
          content: `<bash-stderr>Cannot launch remote Claude Code session.

${S}</bash-stderr>`
        })],
        shouldQuery: !1
      }
    }
    let D = await nBB(),
      W = await Tu(),
      K = await ci1(),
      V = D.commitsAheadOfDefaultBranch === 0;
    if ((D.hasUncommitted || D.hasUnpushed) && !V) {
      let S = await new Promise((u) => {
        Z({
          jsx: zZ.createElement(T, {
            flexDirection: "column"
          }, zZ.createElement(R6A, {
            addMargin: !0,
            param: J
          }), zZ.createElement(zM0, {
            issue: D,
            branchName: W,
            onDone: u,
            color: "background"
          })),
          shouldHidePromptInput: !0
        })
      });
      if (S === "cancel") return {
        messages: [NE(), X, ...B, H0({
          content: "<bash-stderr>Background task cancelled.</bash-stderr>"
        })],
        shouldQuery: !1
      };
      if (S === "commit-push") {
        let u = (n) => {
          Z({
            jsx: zZ.createElement(T, {
              flexDirection: "column"
            }, zZ.createElement(R6A, {
              addMargin: !0,
              param: J
            }), zZ.createElement(zM0, {
              issue: D,
              branchName: W,
              onDone: () => {},
              color: "background",
              loadingState: n
            })),
            shouldHidePromptInput: !0
          })
        };
        if (D.hasUncommitted) u("committing");
        else u("pushing");
        let f = `Background task: ${A.slice(0,60)}${A.length>60?"...":""}`,
          AA = await aBB(f, (n) => {
            u(n)
          });
        if (!AA.success) return {
          messages: [NE(), X, ...B, H0({
            content: `<bash-stderr>Failed to commit and push changes:
${AA.error}</bash-stderr>`
          })],
          shouldQuery: !1
        }
      }
    }
    let F = uz(),
      H = [];
    try {
      H = await Fg(F)
    } catch (S) {
      k(`Could not read transcript file: ${S instanceof Error?S.message:String(S)}`)
    }
    let E = H.filter(pbA);
    Z({
      jsx: zZ.createElement(T, {
        flexDirection: "column"
      }, zZ.createElement(R6A, {
        addMargin: !0,
        param: J
      }), zZ.createElement(x0, null, zZ.createElement(C, {
        dimColor: !0
      }, "Creating background task…"))),
      shouldHidePromptInput: !1
    });
    let z = D.commitsAheadOfDefaultBranch === 0 ? K : W,
      $ = await cbA({
        initialMessage: null,
        branchName: z,
        description: A,
        signal: G.abortController.signal
      });
    if (!$) throw Error("Failed to create remote session");
    if (E.length > 0)
      for (let S = 0; S < E.length; S++) {
        let u = E[S];
        if (!u) continue;
        if (!await du2($.id, u)) throw Error(`Failed to upload session history (message ${S+1}/${E.length})`)
      }
    if (!await sj2($.id, A)) throw Error("Failed to send user task message to remote session");
    let L = $.id,
      M = `r${L.substring(0,6)}`;
    Zr(M);
    let j = {
      ...KO(M, "remote_agent", $.title),
      type: "remote_agent",
      status: "running",
      sessionId: L,
      command: A,
      title: $.title,
      todoList: [],
      log: [],
      deltaSummarySinceLastFlushToAttachment: null
    };
    FO(j, G.setAppState);
    let x = lbA($.id),
      b = eu2($.id);
    return {
      messages: [NE(), X, ...B, H0({
        content: `<background-task-output>This task is now running in the background.
Monitor it with /tasks or at ${x}

Or, resume it later with: ${b}</background-task-output>`
      })],
      shouldQuery: !1
    }
  } catch (I) {
    let D = I instanceof Error ? I.message : String(I);
    return {
      messages: [NE(), X, ...B, H0({
        content: `<bash-stderr>Failed to create background session: ${D}. Try running /login and signing in with a claude.ai account (not Console).</bash-stderr>`
      })],
      shouldQuery: !1
    }
  } finally {
    Z(null)
  }
}
// @from(Ln 396011, Col 4)
zZ
// @from(Ln 396012, Col 4)
w19 = w(() => {
  Z0();
  tQ();
  fA();
  $z0();
  c4();
  Jt();
  zf();
  jK1();
  xr();
  EVA();
  cC();
  OK1();
  T1();
  d4();
  vI();
  nY();
  T_();
  l2();
  FT();
  ZI();
  q19();
  zZ = c(QA(), 1)
})
// @from(Ln 396037, Col 0)
function $M0({
  input: A,
  progress: Q,
  verbose: B
}) {
  return xH1.default.createElement(T, {
    flexDirection: "column",
    marginTop: 1
  }, xH1.default.createElement(VD1, {
    addMargin: !1,
    param: {
      text: `<bash-input>${A}</bash-input>`,
      type: "text"
    }
  }), Q ? xH1.default.createElement(xD1, {
    fullOutput: Q.fullOutput,
    output: Q.output,
    elapsedTimeSeconds: Q.elapsedTimeSeconds,
    totalLines: Q.totalLines,
    verbose: B
  }) : o2.renderToolUseProgressMessage([], {
    verbose: B,
    tools: [],
    terminalSize: void 0
  }))
}
// @from(Ln 396063, Col 4)
xH1
// @from(Ln 396064, Col 4)
L19 = w(() => {
  fA();
  Fz0();
  fz0();
  YK();
  xH1 = c(QA(), 1)
})
// @from(Ln 396071, Col 0)
async function O19(A, Q, B, G, Z, Y) {
  T9("bash-mode"), l("tengu_input_bash", {}), Y(!0);
  let J = H0({
      content: IU({
        inputString: `<bash-input>${A}</bash-input>`,
        precedingInputBlocks: Q
      })
    }),
    X;
  Z({
    jsx: lf.createElement($M0, {
      input: A,
      progress: null,
      verbose: G.options.verbose
    }),
    shouldHidePromptInput: !1
  });
  try {
    let I = {
        ...G,
        setToolJSX: (F) => {
          X = F?.jsx
        }
      },
      W = (await o2.call({
        command: A,
        dangerouslyDisableSandbox: !0
      }, I, void 0, void 0, (F) => {
        Z({
          jsx: lf.createElement(lf.Fragment, null, lf.createElement($M0, {
            input: A,
            progress: F.data,
            verbose: G.options.verbose
          }), X),
          shouldHidePromptInput: !1,
          showSpinner: !1
        })
      })).data;
    if (!W) throw Error("No result received from bash command");
    let K = W.stderr,
      V = await G.getAppState();
    if (B71(V.toolPermissionContext)) K = Q71(K);
    return {
      messages: [NE(), J, ...B, H0({
        content: `<bash-stdout>${W.stdout}</bash-stdout><bash-stderr>${K}</bash-stderr>`
      })],
      shouldQuery: !1
    }
  } catch (I) {
    if (I instanceof ay) {
      if (I.interrupted) return {
        messages: [NE(), J, H0({
          content: Ss
        }), ...B],
        shouldQuery: !1
      };
      return {
        messages: [NE(), J, ...B, H0({
          content: `<bash-stdout>${I.stdout}</bash-stdout><bash-stderr>${I.stderr}</bash-stderr>`
        })],
        shouldQuery: !1
      }
    }
    return {
      messages: [NE(), J, ...B, H0({
        content: `<bash-stderr>Command failed: ${I instanceof Error?I.message:String(I)}</bash-stderr>`
      })],
      shouldQuery: !1
    }
  } finally {
    Z(null)
  }
}
// @from(Ln 396144, Col 4)
lf
// @from(Ln 396145, Col 4)
M19 = w(() => {
  Z0();
  tQ();
  tQ();
  L19();
  YK();
  qKA();
  qKA();
  XX();
  JZ();
  lf = c(QA(), 1)
})
// @from(Ln 396158, Col 0)
function R19(A, Q, B, G, Z, Y, J, X, I) {
  Z(!0);
  let D = typeof A === "string" ? A : A.find((F) => F.type === "text")?.text || "";
  Z82(D);
  let W = {};
  if (typeof A === "string") {
    let F = cA9(A),
      H = pA9(A);
    W = {
      is_negative: F,
      is_keep_going: H
    }, LF("user_prompt", {
      prompt_length: String(A.length),
      prompt: nZ1(A)
    })
  }
  if (l("tengu_input_prompt", W), Q.length > 0) {
    let F = typeof A === "string" ? A.trim() ? [{
        type: "text",
        text: A
      }] : [] : A,
      H = H0({
        content: [...F, ...Q],
        uuid: Y,
        thinkingMetadata: J,
        todos: I,
        imagePasteIds: B.length > 0 ? B : void 0
      }),
      E = Hm([H], X ?? void 0);
    return {
      messages: [H, ...G],
      shouldQuery: !0,
      maxThinkingTokens: E > 0 ? E : void 0
    }
  }
  let K = H0({
      content: A,
      uuid: Y,
      thinkingMetadata: J,
      todos: I
    }),
    V = Hm([K], X ?? void 0);
  return {
    messages: [K, ...G],
    shouldQuery: !0,
    maxThinkingTokens: V > 0 ? V : void 0
  }
}
// @from(Ln 396206, Col 4)
_19 = w(() => {
  Z0();
  fr();
  hr();
  tQ();
  Y_()
})
// @from(Ln 396213, Col 0)
async function j19() {}
// @from(Ln 396217, Col 0)
async function vH1({
  input: A,
  mode: Q,
  setIsLoading: B,
  setToolJSX: G,
  context: Z,
  pastedContents: Y,
  ideSelection: J,
  messages: X,
  setUserInputOnProcessing: I,
  uuid: D,
  isAlreadyProcessing: W,
  thinkingMetadata: K,
  manualThinkingTokens: V,
  querySource: F,
  canUseTool: H
}) {
  let E = typeof A === "string" ? A : null;
  if (Q === "prompt" && E !== null) I?.(E);
  try {
    h6("query_process_user_input_base_start");
    let z = await Z.getAppState(),
      $ = await r77(A, Q, B, G, Z, Y, J, X, D, W, K, V, F, z.todos[Z.agentId ?? q0()], H);
    if (h6("query_process_user_input_base_end"), !$.shouldQuery) return $;
    h6("query_hooks_start");
    let O = S6A(A) || "";
    j19(O, X ?? [], z);
    for await (let L of oU0(O, z.toolPermissionContext.mode, Z)) {
      if (L.message?.type === "progress") continue;
      if (L.blockingError) {
        let M = cU0(L.blockingError);
        return {
          messages: [hO(`${M}

Original prompt: ${A}`, "warning")],
          shouldQuery: !1,
          allowedTools: $.allowedTools,
          maxThinkingTokens: $.maxThinkingTokens
        }
      }
      if (L.preventContinuation) {
        let M = L.stopReason ? `Operation stopped by hook: ${L.stopReason}` : "Operation stopped by hook";
        return $.messages.push(H0({
          content: M
        })), $.shouldQuery = !1, $
      }
      if (L.additionalContexts && L.additionalContexts.length > 0) $.messages.push(X4({
        type: "hook_additional_context",
        content: L.additionalContexts.map(T19),
        hookName: "UserPromptSubmit",
        toolUseID: `hook-${o77()}`,
        hookEvent: "UserPromptSubmit"
      }));
      if (L.message) switch (L.message.attachment.type) {
        case "hook_success":
          if (!L.message.attachment.content) break;
          $.messages.push({
            ...L.message,
            attachment: {
              ...L.message.attachment,
              content: T19(L.message.attachment.content)
            }
          });
          break;
        default:
          $.messages.push(L.message);
          break
      }
    }
    return h6("query_hooks_end"), $
  } finally {
    I?.(void 0)
  }
}
// @from(Ln 396292, Col 0)
function T19(A) {
  if (A.length > CM0) return `${A.substring(0,CM0)}… [output truncated - exceeded ${CM0} characters]`;
  return A
}
// @from(Ln 396296, Col 0)
async function r77(A, Q, B, G, Z, Y, J, X, I, D, W, K, V, F, H) {
  let E = null,
    z = [],
    $ = [];
  if (typeof A === "string") E = A;
  else if (A.length > 0) {
    h6("query_image_processing_start");
    let b = [];
    for (let u of A)
      if (u.type === "image") {
        let f = await $Z0(u);
        if (f.dimensions) {
          let AA = VKA(f.dimensions);
          if (AA) $.push(AA)
        }
        b.push(f.block)
      } else b.push(u);
    h6("query_image_processing_end");
    let S = b[b.length - 1];
    if (S?.type === "text") E = S.text, z = [...b.slice(0, -1)];
    else z = b
  }
  if (E === null && Q !== "prompt") throw Error(`Mode: ${Q} requires a string input.`);
  let O = Y ? Object.values(Y).filter((b) => b.type === "image") : [],
    L = O.map((b) => b.id);
  h6("query_pasted_image_processing_start");
  let M = await Promise.all(O.map(async (b) => {
      let S = {
        type: "image",
        source: {
          type: "base64",
          media_type: b.mediaType || "image/png",
          data: b.content
        }
      };
      return l("tengu_pasted_image_resize_attempt", {
        original_size_bytes: b.content.length
      }), {
        resized: await $Z0(S),
        originalDimensions: b.dimensions,
        sourcePath: b.sourcePath
      }
    })),
    _ = [];
  for (let {
      resized: b,
      originalDimensions: S,
      sourcePath: u
    }
    of M) {
    if (b.dimensions) {
      let f = VKA(b.dimensions, u);
      if (f) $.push(f)
    } else if (S) {
      let f = VKA(S, u);
      if (f) $.push(f)
    } else if (u) $.push(`[Image source: ${u}]`);
    _.push(b.block)
  }
  if (h6("query_pasted_image_processing_end"), Y) bT2(Y);
  let j = E !== null && (Q !== "prompt" || !E.startsWith("/"));
  h6("query_attachment_loading_start");
  let x = j ? await QY1(VHA(E, Z, J ?? null, [], X, V)) : [];
  if (h6("query_attachment_loading_end"), E !== null && Q === "bash") return yH1(await O19(E, z, x, Z, G, B), $);
  if (E !== null && Q === "background") return yH1(await N19(E, z, x, Z, G, B), $);
  if (E !== null && E.startsWith("/")) {
    let b = await OP2(E, z, _, x, Z, B, G, I, D, H);
    return yH1(b, $)
  }
  if (E !== null && Q === "prompt") {
    let b = E.trim(),
      S = x.find((u) => u.attachment.type === "agent_mention");
    if (S) {
      let u = `@agent-${S.attachment.agentType}`,
        f = b === u,
        AA = b.startsWith(u) && !f;
      l("tengu_subagent_at_mention", {
        is_subagent_only: f,
        is_prefix: AA
      })
    }
  }
  return yH1(R19(A, _, L, x, B, I, W, K, F), $)
}
// @from(Ln 396381, Col 0)
function yH1(A, Q) {
  if (Q.length > 0) A.messages.push(H0({
    content: Q.map((B) => ({
      type: "text",
      text: B
    })),
    isMeta: !0
  }));
  return A
}
// @from(Ln 396391, Col 4)
CM0 = 1e4
// @from(Ln 396392, Col 4)
UM0 = w(() => {
  tQ();
  gr();
  m_();
  tQ();
  zO();
  w19();
  M19();
  jD1();
  _19();
  Ib();
  Z0();
  WzA();
  C0();
  IHA()
})
// @from(Ln 396413, Col 0)
function S19({
  messages: A,
  onPreRestore: Q,
  onRestoreMessage: B,
  onRestoreCode: G,
  onClose: Z
}) {
  let [Y] = a0(), [J, X] = C$.useState(void 0), I = vG(), D = C$.useMemo(s77, []), W = C$.useMemo(() => [...A.filter(uhA), {
    ...H0({
      content: ""
    }),
    uuid: D
  }], [A, D]), [K, V] = C$.useState(W.length - 1), F = Math.max(0, Math.min(K - Math.floor(qM0 / 2), W.length - qM0)), H = W.length > 1, [E, z] = C$.useState(void 0), [$, O] = C$.useState(void 0), [L, M] = C$.useState(!1), [_, j] = C$.useState("both");
  C$.useEffect(() => {
    l("tengu_message_selector_opened", {})
  }, []);
  async function x(y) {
    let p = A.indexOf(y),
      GA = A.length - 1 - p;
    if (l("tengu_message_selector_selected", {
        index_from_end: GA,
        message_type: y.type,
        is_current_prompt: !1
      }), !A.includes(y)) {
      Z();
      return
    }
    if (I) {
      z(y);
      let WA = WbA(Y.fileHistory, y.uuid);
      O(WA)
    } else {
      Q(), M(!0);
      try {
        await B(y), M(!1), Z()
      } catch (WA) {
        e(WA), M(!1), X(`Failed to restore the conversation:
${WA}`)
      }
    }
  }
  async function b(y) {
    if (l("tengu_message_selector_restore_option_selected", {
        option: y
      }), !E) {
      X("Message not found.");
      return
    }
    if (y === "nevermind") {
      z(void 0);
      return
    }
    Q(), M(!0), X(void 0);
    let p = null,
      GA = null;
    if (y === "code" || y === "both") try {
      await G(E)
    } catch (WA) {
      p = WA, e(p)
    }
    if (y === "conversation" || y === "both") try {
      await B(E)
    } catch (WA) {
      GA = WA, e(GA)
    }
    if (M(!1), z(void 0), GA && p) X(`Failed to restore the conversation and code:
${GA}
${p}`);
    else if (GA) X(`Failed to restore the conversation:
${GA}`);
    else if (p) X(`Failed to restore the code:
${p}`);
    else Z()
  }
  let S = MQ(),
    u = C$.useCallback(() => {
      l("tengu_message_selector_cancelled", {}), Z()
    }, [Z]);
  H2("confirm:no", u, {
    context: "Confirmation"
  }), J0((y, p) => {
    if (L || J || E || !H) return;
    let GA = () => V((bA) => Math.max(0, bA - 1)),
      WA = () => V((bA) => Math.min(W.length - 1, bA + 1)),
      MA = () => V(0),
      TA = () => V(W.length - 1);
    if (p.return) {
      x(W[K]);
      return
    }
    if (p.upArrow)
      if (p.ctrl || p.shift || p.meta) MA();
      else GA();
    if (p.downArrow)
      if (p.ctrl || p.shift || p.meta) TA();
      else WA();
    if (y === "k") GA();
    if (y === "j") WA();
    if (y === "K") MA();
    if (y === "J") TA()
  });
  let [f, AA] = C$.useState({});
  C$.useEffect(() => {
    async function y() {
      if (!I) return;
      Promise.all(W.map(async (p, GA) => {
        if (p.uuid !== D) {
          let WA = HW1(Y.fileHistory, p.uuid),
            MA = W.at(GA + 1),
            TA = WA ? QG7(A, p.uuid, MA?.uuid !== D ? MA?.uuid : void 0) : void 0;
          if (TA !== void 0) AA((bA) => ({
            ...bA,
            [GA]: TA
          }));
          else AA((bA) => ({
            ...bA,
            [GA]: void 0
          }))
        }
      }))
    }
    y()
  }, [W, A, D, Y.fileHistory, I]);
  let n = I && $?.filesChanged && $.filesChanged.length > 0;
  return h0.createElement(T, {
    flexDirection: "column",
    width: "100%"
  }, h0.createElement(K8, {
    dividerColor: "suggestion"
  }), h0.createElement(T, {
    flexDirection: "column",
    marginX: 1,
    gap: 1
  }, h0.createElement(C, {
    bold: !0,
    color: "suggestion"
  }, "Rewind"), J && h0.createElement(h0.Fragment, null, h0.createElement(C, {
    color: "error"
  }, "Error: ", J)), !H && h0.createElement(h0.Fragment, null, h0.createElement(C, null, "Nothing to rewind to yet.")), !J && E && H && h0.createElement(h0.Fragment, null, h0.createElement(C, null, "Confirm you want to restore", " ", !$ && "the conversation ", "to the point before you sent this message:"), h0.createElement(T, {
    flexDirection: "column",
    paddingLeft: 1,
    borderStyle: "single",
    borderRight: !1,
    borderTop: !1,
    borderBottom: !1,
    borderLeft: !0,
    borderLeftDimColor: !0
  }, h0.createElement(P19, {
    userMessage: E,
    color: "text",
    isCurrent: !1
  }), h0.createElement(C, {
    dimColor: !0
  }, "(", WQA(new Date(E.timestamp)), ")")), h0.createElement(T, {
    flexDirection: "column"
  }, _ === "both" || _ === "conversation" ? h0.createElement(C, {
    dimColor: !0
  }, "The conversation will be forked.") : h0.createElement(C, {
    dimColor: !0
  }, "The conversation will be unchanged."), n && (_ === "both" || _ === "code") ? h0.createElement(AG7, {
    diffStatsForRestore: $
  }) : h0.createElement(C, {
    dimColor: !0
  }, "The code will be unchanged.")), h0.createElement(k0, {
    isDisabled: L,
    options: n ? t77 : e77,
    defaultFocusValue: n ? "both" : "conversation",
    onFocus: (y) => j(y),
    onChange: (y) => b(y),
    onCancel: () => z(void 0)
  }), n && h0.createElement(T, {
    marginBottom: 1
  }, h0.createElement(C, {
    dimColor: !0
  }, tA.warning, " Rewinding does not affect files edited manually or via bash."))), !J && !E && H && h0.createElement(h0.Fragment, null, I ? h0.createElement(C, null, "Restore the code and/or conversation to the point before…") : h0.createElement(C, null, "Restore and fork the conversation to the point before…"), h0.createElement(T, {
    width: "100%",
    flexDirection: "column"
  }, W.slice(F, F + qM0).map((y, p) => {
    let GA = F + p,
      WA = GA === K,
      MA = y.uuid === D,
      TA = GA in f,
      bA = f[GA],
      jA = bA?.filesChanged && bA.filesChanged.length;
    return h0.createElement(T, {
      key: y.uuid,
      height: I ? 3 : 2,
      overflow: "hidden",
      width: "100%",
      flexDirection: "row"
    }, h0.createElement(T, {
      width: 2,
      minWidth: 2
    }, WA ? h0.createElement(C, {
      color: "permission",
      bold: !0
    }, tA.pointer, " ") : h0.createElement(C, null, "  ")), h0.createElement(T, {
      flexDirection: "column"
    }, h0.createElement(T, {
      flexShrink: 1,
      height: 1,
      overflow: "hidden"
    }, h0.createElement(P19, {
      userMessage: y,
      color: WA ? "suggestion" : void 0,
      isCurrent: MA,
      paddingRight: 10
    })), I && TA && h0.createElement(T, {
      height: 1,
      flexDirection: "row"
    }, bA ? h0.createElement(h0.Fragment, null, h0.createElement(C, {
      dimColor: !WA,
      color: "inactive"
    }, jA ? h0.createElement(h0.Fragment, null, jA === 1 && bA.filesChanged[0] ? `${KzA.basename(bA.filesChanged[0])} ` : `${jA} files changed `, h0.createElement(x19, {
      diffStats: bA
    })) : h0.createElement(h0.Fragment, null, "No code changes"))) : h0.createElement(C, {
      dimColor: !0,
      color: "warning"
    }, tA.warning, " No code restore"))))
  }))), h0.createElement(C, {
    dimColor: !0,
    italic: !0
  }, S.pending ? h0.createElement(h0.Fragment, null, "Press ", S.keyName, " again to exit") : h0.createElement(h0.Fragment, null, !J && H && "Enter to continue · ", "Esc to exit"))))
}
// @from(Ln 396638, Col 0)
function AG7({
  diffStatsForRestore: A
}) {
  if (A === void 0) return;
  if (!A.filesChanged || !A.filesChanged[0]) return h0.createElement(C, {
    dimColor: !0
  }, "The code has not changed (nothing will be restored).");
  let Q = A.filesChanged.length,
    B = "";
  if (Q === 1) B = KzA.basename(A.filesChanged[0] || "");
  else if (Q === 2) {
    let G = KzA.basename(A.filesChanged[0] || ""),
      Z = KzA.basename(A.filesChanged[1] || "");
    B = `${G} and ${Z}`
  } else B = `${KzA.basename(A.filesChanged[0]||"")} and ${A.filesChanged.length-1} other files`;
  return h0.createElement(h0.Fragment, null, h0.createElement(C, {
    dimColor: !0
  }, "The code will be restored", " ", h0.createElement(x19, {
    diffStats: A
  }), " in ", B, "."))
}
// @from(Ln 396660, Col 0)
function x19({
  diffStats: A
}) {
  if (!A || !A.filesChanged) return;
  return h0.createElement(h0.Fragment, null, h0.createElement(C, {
    color: "diffAddedWord"
  }, "+", A.insertions, " "), h0.createElement(C, {
    color: "diffRemovedWord"
  }, "-", A.deletions))
}
// @from(Ln 396671, Col 0)
function P19({
  userMessage: A,
  color: Q,
  dimColor: B,
  isCurrent: G,
  paddingRight: Z
}) {
  let {
    columns: Y
  } = ZB();
  if (G) return h0.createElement(T, {
    width: "100%"
  }, h0.createElement(C, {
    italic: !0,
    color: Q,
    dimColor: B
  }, "(current)"));
  let J = A.message.content,
    X = typeof J === "string" ? J.trim() : J[J.length - 1]?.type === "text" ? J[J.length - 1].text.trim() : "(no prompt)";
  if (KD1(X)) return h0.createElement(T, {
    flexDirection: "row",
    width: "100%"
  }, h0.createElement(C, {
    italic: !0,
    color: Q,
    dimColor: B
  }, "((empty message))"));
  if (X.includes("<bash-input>")) {
    let I = Q9(X, "bash-input");
    if (I) return h0.createElement(T, {
      flexDirection: "row",
      width: "100%"
    }, h0.createElement(C, {
      color: "bashBorder"
    }, "!"), h0.createElement(C, {
      color: Q,
      dimColor: B
    }, " ", I))
  }
  if (X.includes(`<${fz}>`)) {
    let I = Q9(X, fz),
      D = Q9(X, "command-args"),
      W = Q9(X, "skill-format") === "true";
    if (I)
      if (W) return h0.createElement(T, {
        flexDirection: "row",
        width: "100%"
      }, h0.createElement(C, {
        color: Q,
        dimColor: B
      }, "Skill(", I, ")"));
      else return h0.createElement(T, {
        flexDirection: "row",
        width: "100%"
      }, h0.createElement(C, {
        color: Q,
        dimColor: B
      }, "/", I, " ", D))
  }
  return h0.createElement(T, {
    flexDirection: "row",
    width: "100%"
  }, h0.createElement(C, {
    color: Q,
    dimColor: B
  }, Z ? YG(X, Y - Z, !0) : X.slice(0, 500).split(`
`).slice(0, 4).join(`
`)))
}
// @from(Ln 396741, Col 0)
function QG7(A, Q, B) {
  let G = A.findIndex((I) => I.uuid === Q);
  if (G === -1) return;
  let Z = B ? A.findIndex((I) => I.uuid === B) : A.length;
  if (Z === -1) Z = A.length;
  let Y = [],
    J = 0,
    X = 0;
  for (let I = G + 1; I < Z; I++) {
    let D = A[I];
    if (!D || !y19(D)) continue;
    let W = D.toolUseResult;
    if (!W || !W.filePath || !W.structuredPatch) continue;
    if (!Y.includes(W.filePath)) Y.push(W.filePath);
    try {
      if ("type" in W && W.type === "create") J += W.content.split(/\r?\n/).length;
      else
        for (let K of W.structuredPatch) {
          let V = K.lines.filter((H) => H.startsWith("+")).length,
            F = K.lines.filter((H) => H.startsWith("-")).length;
          J += V, X += F
        }
    } catch {
      continue
    }
  }
  return {
    filesChanged: Y,
    insertions: J,
    deletions: X
  }
}
// @from(Ln 396774, Col 0)
function uhA(A) {
  if (A.type !== "user") return !1;
  if (Array.isArray(A.message.content) && A.message.content[0]?.type === "tool_result") return !1;
  if (kD1(A)) return !1;
  if (A.isMeta) return !1;
  let Q = A.message.content,
    B = typeof Q === "string" ? Q.trim() : Q[Q.length - 1]?.type === "text" ? Q[Q.length - 1].text.trim() : "";
  if (B.indexOf("<local-command-stdout>") !== -1 || B.indexOf("<local-command-stderr>") !== -1 || B.indexOf("<bash-stdout>") !== -1 || B.indexOf("<bash-stderr>") !== -1) return !1;
  return !0
}
// @from(Ln 396784, Col 4)
h0
// @from(Ln 396784, Col 8)
C$
// @from(Ln 396784, Col 12)
t77
// @from(Ln 396784, Col 17)
e77
// @from(Ln 396784, Col 22)
qM0 = 7
// @from(Ln 396785, Col 4)
kH1 = w(() => {
  fA();
  c6();
  B2();
  tQ();
  Z0();
  E9();
  W8();
  hB();
  v1();
  oN();
  P4();
  lD();
  cD();
  h0 = c(QA(), 1), C$ = c(QA(), 1), t77 = [{
    value: "both",
    label: "Restore code and conversation"
  }, {
    value: "conversation",
    label: "Restore conversation"
  }, {
    value: "code",
    label: "Restore code"
  }, {
    value: "nevermind",
    label: "Never mind"
  }], e77 = [{
    value: "conversation",
    label: "Restore conversation"
  }, {
    value: "nevermind",
    label: "Never mind"
  }]
})
// @from(Ln 396822, Col 0)
async function* GG7(A, Q, B, G) {
  let Z = !cAA(),
    {
      permissionResult: Y,
      assistantMessage: J
    } = A,
    {
      toolUseID: X
    } = Y;
  if (!X) return;
  let I = J.message.content,
    D;
  if (Array.isArray(I)) {
    for (let z of I)
      if (z.type === "tool_use" && z.id === X) {
        D = z;
        break
      }
  }
  if (!D) return;
  let {
    name: W,
    input: K
  } = D;
  if (!Q.find((z) => z.name === W)) return;
  let F = {
      ...D,
      input: Y.behavior === "allow" ? Y.updatedInput : K
    },
    H = async () => ({
      ...Y,
      decisionReason: {
        type: "mode",
        mode: "default"
      }
    });
  if (B.push(J), Z) await tc(B);
  yield {
    ...J,
    session_id: q0(),
    parent_tool_use_id: null
  };
  for await (let z of KM0([F], [J], H, G)) if (z.message) {
    if (B.push(z.message), Z) await tc(B);
    yield {
      ...z.message,
      session_id: q0(),
      parent_tool_use_id: null
    }
  }
}
// @from(Ln 396874, Col 0)
function ZG7(A) {
  if (!A) return !1;
  if (A.type === "assistant") {
    let Q = QC(A.message.content);
    return Q?.type === "text" || Q?.type === "thinking" || Q?.type === "redacted_thinking"
  }
  if (A.type === "user") {
    let Q = A.message.content;
    if (!Array.isArray(Q) || Q.length === 0) return !1;
    return Q.every((B) => ("type" in B) && B.type === "tool_result")
  }
  return !1
}