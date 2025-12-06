
// @from(Start 13460849, End 13460927)
function jP3() {
  return Q89.sample(["Got it.", "Good to know.", "Noted."])
}
// @from(Start 13460929, End 13461508)
function G89({
  text: A,
  addMargin: Q
}) {
  let B = B9(A, "user-memory-input"),
    G = B89.useMemo(() => jP3(), []);
  if (!B) return null;
  return eq.createElement(S, {
    flexDirection: "column",
    marginTop: Q ? 1 : 0,
    width: "100%"
  }, eq.createElement(S, null, eq.createElement($, {
    color: "remember",
    backgroundColor: "memoryBackgroundColor"
  }, "#"), eq.createElement($, {
    backgroundColor: "memoryBackgroundColor",
    color: "text"
  }, " ", B, " ")), eq.createElement(S0, {
    height: 1
  }, eq.createElement($, {
    dimColor: !0
  }, G)))
}
// @from(Start 13461513, End 13461515)
eq
// @from(Start 13461517, End 13461520)
Q89
// @from(Start 13461522, End 13461525)
B89
// @from(Start 13461531, End 13461631)
Z89 = L(() => {
  hA();
  cQ();
  q8();
  eq = BA(VA(), 1), Q89 = BA(A89(), 1), B89 = BA(VA(), 1)
})
// @from(Start 13461634, End 13461867)
function I89({
  content: A,
  verbose: Q
}) {
  let B = B9(A, "bash-stdout") ?? "",
    G = B9(A, "bash-stderr") ?? "";
  return yW0.createElement(L1A, {
    content: {
      stdout: B,
      stderr: G
    },
    verbose: !!Q
  })
}
// @from(Start 13461872, End 13461875)
yW0
// @from(Start 13461881, End 13461936)
Y89 = L(() => {
  l21();
  cQ();
  yW0 = BA(VA(), 1)
})
// @from(Start 13461939, End 13462435)
function J89({
  content: A
}) {
  let Q = B9(A, "local-command-stdout"),
    B = B9(A, "local-command-stderr");
  if (!Q && !B) return AN.createElement(S0, null, AN.createElement($, {
    dimColor: !0
  }, $q));
  let G = [];
  if (Q?.trim()) G.push(AN.createElement(S0, {
    key: "stdout"
  }, AN.createElement($, {
    color: "text"
  }, Q.trim())));
  if (B?.trim()) G.push(AN.createElement(S0, {
    key: "stderr"
  }, AN.createElement($, {
    color: "error"
  }, B.trim())));
  return G
}
// @from(Start 13462440, End 13462442)
AN
// @from(Start 13462448, End 13462517)
W89 = L(() => {
  cQ();
  hA();
  q8();
  ZO();
  AN = BA(VA(), 1)
})
// @from(Start 13462520, End 13462689)
function X89({
  content: A
}) {
  let Q = B9(A, "background-task-output") ?? "";
  return zjA.createElement(S0, null, zjA.createElement($, {
    dimColor: !0
  }, Q))
}
// @from(Start 13462694, End 13462697)
zjA
// @from(Start 13462703, End 13462765)
V89 = L(() => {
  hA();
  cQ();
  q8();
  zjA = BA(VA(), 1)
})
// @from(Start 13462768, End 13463974)
function LQA({
  addMargin: A,
  param: Q,
  verbose: B,
  thinkingMetadata: G
}) {
  if (Q.text.trim() === $q) return null;
  if (Q.text.startsWith("<bash-stdout") || Q.text.startsWith("<bash-stderr")) return iW.createElement(I89, {
    content: Q.text,
    verbose: B
  });
  if (Q.text.startsWith("<background-task-output>")) return iW.createElement(X89, {
    content: Q.text
  });
  if (Q.text.startsWith("<local-command-stdout") || Q.text.startsWith("<local-command-stderr")) return iW.createElement(J89, {
    content: Q.text
  });
  if (Q.text === sJA || Q.text === xO) return iW.createElement(S0, {
    height: 1
  }, iW.createElement(zk, null));
  if (Q.text.includes("<bash-input>")) return iW.createElement(l61, {
    addMargin: A,
    param: Q
  });
  if (Q.text.includes("<background-task-input>")) return iW.createElement(f1A, {
    addMargin: A,
    param: Q
  });
  if (Q.text.includes("<command-message>")) return iW.createElement(a49, {
    addMargin: A,
    param: Q
  });
  if (Q.text.includes("<user-memory-input>")) return iW.createElement(G89, {
    addMargin: A,
    text: Q.text
  });
  return iW.createElement(t49, {
    addMargin: A,
    param: Q,
    thinkingMetadata: G
  })
}
// @from(Start 13463979, End 13463981)
iW
// @from(Start 13463987, End 13464129)
II1 = L(() => {
  C60();
  s49();
  e49();
  ZO();
  Z89();
  tZA();
  cQ();
  q8();
  Y89();
  W89();
  MQ0();
  V89();
  iW = BA(VA(), 1)
})
// @from(Start 13464132, End 13464823)
function F89({
  param: {
    thinking: A
  },
  addMargin: Q = !1,
  isTranscriptMode: B,
  verbose: G
}) {
  let [Z] = qB();
  if (!A) return null;
  if (!(B || G)) return MQA.default.createElement(S, {
    marginTop: Q ? 1 : 0
  }, MQA.default.createElement($, {
    dimColor: !0,
    italic: !0
  }, "∴ Thinking (ctrl+o to expand)"));
  return MQA.default.createElement(S, {
    flexDirection: "column",
    gap: 1,
    marginTop: Q ? 1 : 0,
    width: "100%"
  }, MQA.default.createElement($, {
    dimColor: !0,
    italic: !0
  }, "∴ Thinking…"), MQA.default.createElement(S, {
    paddingLeft: 2
  }, MQA.default.createElement($, {
    dimColor: !0,
    italic: !0
  }, fD(A, Z))))
}
// @from(Start 13464828, End 13464831)
MQA
// @from(Start 13464837, End 13464891)
K89 = L(() => {
  hA();
  wh();
  MQA = BA(VA(), 1)
})
// @from(Start 13464894, End 13465090)
function D89({
  addMargin: A = !1
}) {
  return xW0.default.createElement(S, {
    marginTop: A ? 1 : 0
  }, xW0.default.createElement($, {
    dimColor: !0,
    italic: !0
  }, "✻ Thinking…"))
}
// @from(Start 13465095, End 13465098)
xW0
// @from(Start 13465104, End 13465150)
H89 = L(() => {
  hA();
  xW0 = BA(VA(), 1)
})
// @from(Start 13465195, End 13466459)
function C89({
  attachment: A,
  verbose: Q
}) {
  if (A.files.length === 0) return null;
  let B = A.files.reduce((Z, I) => Z + I.diagnostics.length, 0),
    G = A.files.length;
  if (Q) return Jx.default.createElement(S, {
    flexDirection: "column"
  }, A.files.map((Z, I) => Jx.default.createElement(Jx.default.Fragment, {
    key: I
  }, Jx.default.createElement(S0, null, Jx.default.createElement($, {
    dimColor: !0,
    wrap: "wrap"
  }, tA.bold(SP3(W0(), Z.uri.replace("file://", "").replace("_claude_fs_right:", ""))), " ", tA.dim(Z.uri.startsWith("file://") ? "(file://)" : Z.uri.startsWith("_claude_fs_right:") ? "(claude_fs_right)" : `(${Z.uri.split(":")[0]})`), ":")), Z.diagnostics.map((Y, J) => Jx.default.createElement(S0, {
    key: J
  }, Jx.default.createElement($, {
    dimColor: !0,
    wrap: "wrap"
  }, "  ", WP.getSeveritySymbol(Y.severity), " [Line ", Y.range.start.line + 1, ":", Y.range.start.character + 1, "] ", Y.message, Y.code ? ` [${Y.code}]` : "", Y.source ? ` (${Y.source})` : ""))))));
  else return Jx.default.createElement(S0, null, Jx.default.createElement($, {
    dimColor: !0,
    wrap: "wrap"
  }, `Found ${tA.bold(B)} new diagnostic ${B===1?"issue":"issues"} in ${G} ${G===1?"file":"files"} (ctrl+o to expand)`))
}
// @from(Start 13466464, End 13466466)
Jx
// @from(Start 13466472, End 13466550)
E89 = L(() => {
  hA();
  F9();
  U2();
  q8();
  R1A();
  Jx = BA(VA(), 1)
})
// @from(Start 13466609, End 13474429)
function z89({
  attachment: A,
  addMargin: Q,
  verbose: B
}) {
  switch (A.type) {
    case "directory":
      return rB.default.createElement(AJ, null, "Listed directory", " ", tA.bold(aXA(W0(), A.path) + _P3));
    case "file":
    case "already_read_file":
      if (A.content.type === "notebook") return rB.default.createElement(AJ, {
        dimColor: !1
      }, rB.default.createElement($, {
        dimColor: !0
      }, "Read "), rB.default.createElement($, {
        bold: !0
      }, aXA(W0(), A.filename)), rB.default.createElement($, null, " "), rB.default.createElement($, {
        dimColor: !0
      }, "(", A.content.file.cells.length, " cells)"));
      return rB.default.createElement(AJ, {
        dimColor: !1
      }, rB.default.createElement($, {
        dimColor: !0
      }, "Read "), rB.default.createElement($, {
        bold: !0
      }, aXA(W0(), A.filename)), rB.default.createElement($, null, " "), rB.default.createElement($, {
        dimColor: !0
      }, "(", A.content.type === "text" ? `${A.content.file.numLines}${A.truncated?"+":""} lines` : UJ(A.content.file.originalSize), ")"));
    case "compact_file_reference":
      return rB.default.createElement(AJ, null, "Referenced file ", tA.bold(aXA(W0(), A.filename)));
    case "selected_lines_in_ide":
      return rB.default.createElement(AJ, {
        dimColor: !1
      }, rB.default.createElement($, {
        dimColor: !0
      }, "⧉ Selected "), rB.default.createElement($, {
        bold: !0
      }, A.lineEnd - A.lineStart + 1), rB.default.createElement($, null, " "), rB.default.createElement($, {
        dimColor: !0
      }, "lines from "), rB.default.createElement($, {
        bold: !0
      }, aXA(W0(), A.filename)), rB.default.createElement($, null, " "), rB.default.createElement($, {
        dimColor: !0
      }, "in ", A.ideName));
    case "nested_memory":
      return rB.default.createElement(AJ, null, tA.bold(aXA(W0(), A.path)));
    case "queued_command": {
      let G = typeof A.prompt === "string" ? A.prompt : QWA(A.prompt) || "";
      return rB.default.createElement(LQA, {
        addMargin: Q,
        param: {
          text: G,
          type: "text"
        },
        verbose: B
      })
    }
    case "todo":
      if (A.context === "post-compact") return rB.default.createElement(AJ, null, "Todo list read (", A.itemCount, " ", A.itemCount === 1 ? "item" : "items", ")");
      return null;
    case "plan_file_reference":
      return rB.default.createElement(AJ, null, "Plan file referenced (", Q5(A.planFilePath), ")");
    case "diagnostics":
      return rB.default.createElement(C89, {
        attachment: A,
        verbose: B
      });
    case "mcp_resource":
      return rB.default.createElement(AJ, {
        dimColor: !1
      }, rB.default.createElement($, {
        dimColor: !0
      }, "Read MCP resource "), rB.default.createElement($, {
        bold: !0
      }, A.name), rB.default.createElement($, null, " "), rB.default.createElement($, {
        dimColor: !0
      }, "from ", A.server));
    case "command_permissions":
      return rB.default.createElement(S, {
        flexDirection: "column",
        paddingLeft: 0
      }, A.model && rB.default.createElement(AJ, {
        dimColor: !1
      }, rB.default.createElement($, {
        dimColor: !0
      }, "Model: "), rB.default.createElement($, {
        dimColor: !0,
        bold: !0
      }, A.model)), A.allowedTools.length > 0 && rB.default.createElement(rB.default.Fragment, null, rB.default.createElement(AJ, {
        dimColor: !1
      }, rB.default.createElement($, {
        dimColor: !0
      }, "Allowed "), rB.default.createElement($, {
        dimColor: !0,
        bold: !0
      }, A.allowedTools.length), rB.default.createElement($, {
        dimColor: !0
      }, " tools for this command")), B && rB.default.createElement(AJ, {
        dimColor: !1
      }, rB.default.createElement($, {
        dimColor: !0
      }, A.allowedTools.join(", ")))));
    case "async_hook_response": {
      if (A.hookEvent === "SessionStart" && !B) return null;
      let G = A.response;
      return rB.default.createElement(AJ, {
        dimColor: !1
      }, rB.default.createElement($, {
        dimColor: !0
      }, "Async hook "), rB.default.createElement($, {
        dimColor: !0,
        bold: !0
      }, A.hookEvent), rB.default.createElement($, null, " "), rB.default.createElement($, {
        dimColor: !0
      }, "completed"), B && rB.default.createElement(rB.default.Fragment, null, rB.default.createElement($, {
        dimColor: !0
      }, ":", `
`), G.systemMessage ? rB.default.createElement($, {
        dimColor: !0
      }, G.systemMessage) : G.hookSpecificOutput && ("additionalContext" in G.hookSpecificOutput) && G.hookSpecificOutput.additionalContext ? rB.default.createElement($, {
        dimColor: !0
      }, G.hookSpecificOutput.additionalContext) : null))
    }
    case "hook_blocking_error": {
      if (A.hookEvent === "Stop" || A.hookEvent === "SubagentStop") return null;
      if (B) return rB.default.createElement(AJ, {
        color: "error"
      }, A.hookName, " hook returned blocking error:", " ", A.blockingError.blockingError);
      return rB.default.createElement(AJ, {
        color: "error"
      }, A.hookName, " hook returned blocking error")
    }
    case "hook_non_blocking_error": {
      if (A.hookEvent === "Stop" || A.hookEvent === "SubagentStop") return null;
      if (B) return rB.default.createElement(AJ, {
        color: "error"
      }, A.hookName, " hook error: ", A.stderr);
      return rB.default.createElement(AJ, {
        color: "error"
      }, A.hookName, " hook error")
    }
    case "hook_error_during_execution":
      if (A.hookEvent === "Stop" || A.hookEvent === "SubagentStop") return null;
      if (B) return rB.default.createElement(AJ, null, A.hookName, " hook warning: ", A.content);
      return rB.default.createElement(AJ, null, A.hookName, " hook warning");
    case "hook_success":
      if (A.hookEvent === "Stop" || A.hookEvent === "SubagentStop") return null;
      if (B) return rB.default.createElement(AJ, null, A.hookName, " hook succeeded: ", A.content);
      return null;
    case "hook_stopped_continuation":
      if (A.hookEvent === "Stop" || A.hookEvent === "SubagentStop") return null;
      return rB.default.createElement(AJ, {
        color: "warning"
      }, A.hookName, " hook stopped continuation: ", A.message);
    case "hook_system_message":
      return rB.default.createElement(AJ, null, A.hookName, " says: ", A.content);
    case "hook_permission_decision": {
      let G = A.decision === "allow" ? "Allowed" : "Denied";
      return rB.default.createElement(AJ, null, G, " by ", rB.default.createElement($, {
        bold: !0
      }, A.hookEvent), " hook")
    }
    case "async_agent_status": {
      let G = A.status === "completed" ? "completed in background" : A.status,
        Z = A.error ? `: ${A.error}` : "";
      return rB.default.createElement(S, {
        flexDirection: "row",
        width: "100%",
        marginTop: 1,
        paddingLeft: 2
      }, rB.default.createElement($, {
        dimColor: !0,
        wrap: "wrap"
      }, 'Agent "', tA.bold(A.description), '" ', G, Z))
    }
    case "agent_mention":
    case "background_remote_session_status":
    case "background_shell_status":
    case "budget_usd":
    case "critical_system_reminder":
    case "edited_image_file":
    case "edited_text_file":
    case "hook_additional_context":
    case "hook_cancelled":
    case "memory":
    case "opened_file_in_ide":
    case "output_style":
    case "plan_mode":
    case "plan_mode_reentry":
    case "structured_output":
    case "teammate_mailbox":
    case "todo_reminder":
    case "ultramemory":
    case "token_usage":
      return null
  }
}
// @from(Start 13474431, End 13474628)
function AJ({
  dimColor: A = !0,
  children: Q,
  color: B
}) {
  return rB.default.createElement(S0, null, rB.default.createElement($, {
    color: B,
    dimColor: A,
    wrap: "wrap"
  }, Q))
}
// @from(Start 13474633, End 13474635)
rB
// @from(Start 13474641, End 13474744)
U89 = L(() => {
  hA();
  R9();
  q8();
  F9();
  U2();
  II1();
  E89();
  cQ();
  rB = BA(VA(), 1)
})
// @from(Start 13474747, End 13475422)
function $89({
  message: {
    retryAttempt: A,
    error: Q,
    retryInMs: B,
    maxRetries: G
  }
}) {
  let [Z, I] = YI1.useState(0);
  if (CI(() => I((J) => J + 1000), 1000), YI1.useEffect(() => I(0), [A]), A < 4) return null;
  let Y = Math.max(0, Math.round((B - Z) / 1000));
  return yg.createElement(S0, null, yg.createElement(S, {
    flexDirection: "column"
  }, yg.createElement($, {
    color: "error"
  }, Bj2(Q)), yg.createElement($, {
    dimColor: !0
  }, "Retrying in ", Y, " ", Y === 1 ? "second" : "seconds", "… (attempt", " ", A, "/", G, ")", process.env.API_TIMEOUT_MS ? ` · API_TIMEOUT_MS=${process.env.API_TIMEOUT_MS}ms, try increasing it` : "")))
}
// @from(Start 13475427, End 13475429)
yg
// @from(Start 13475431, End 13475434)
YI1
// @from(Start 13475440, End 13475529)
w89 = L(() => {
  q8();
  hA();
  x60();
  JE();
  yg = BA(VA(), 1), YI1 = BA(VA(), 1)
})
// @from(Start 13475532, End 13476172)
function q89({
  message: A,
  addMargin: Q,
  verbose: B
}) {
  if (A.subtype !== "stop_hook_summary" && !B && A.level === "info") return null;
  if (A.subtype === "api_error") return V5.createElement($89, {
    message: A
  });
  if (A.subtype === "stop_hook_summary") return V5.createElement(kP3, {
    message: A,
    addMargin: Q,
    verbose: B
  });
  let Z = A.content;
  return V5.createElement(S, {
    flexDirection: "row",
    width: "100%"
  }, V5.createElement(yP3, {
    content: Z,
    addMargin: Q,
    dot: A.level !== "info",
    color: A.level === "warning" ? "warning" : void 0,
    dimColor: A.level === "info"
  }))
}
// @from(Start 13476174, End 13477126)
function kP3({
  message: A,
  addMargin: Q,
  verbose: B
}) {
  let {
    hookCount: G,
    hookInfos: Z,
    hookErrors: I,
    preventedContinuation: Y,
    stopReason: J
  } = A, {
    columns: W
  } = WB();
  if (I.length === 0 && !Y) return null;
  return V5.createElement(S, {
    flexDirection: "row",
    marginTop: Q ? 1 : 0,
    width: "100%"
  }, V5.createElement(S, {
    minWidth: 2
  }, V5.createElement($, null, rD)), V5.createElement(S, {
    flexDirection: "column",
    width: W - 10
  }, V5.createElement($, null, "Ran ", V5.createElement($, {
    bold: !0
  }, G), " stop", " ", G === 1 ? "hook" : "hooks"), B && Z.length > 0 && Z.map((X, V) => V5.createElement($, {
    key: `cmd-${V}`
  }, "⎿  ", X.command === "prompt" ? `prompt: ${X.promptText||""}` : `command: ${X.command}`)), Y && J && V5.createElement($, null, "⎿  ", J), I.length > 0 && I.map((X, V) => V5.createElement($, {
    key: V
  }, "⎿  Stop hook error: ", X))))
}
// @from(Start 13477128, End 13477628)
function yP3({
  content: A,
  addMargin: Q,
  dot: B,
  color: G,
  dimColor: Z
}) {
  let {
    columns: I
  } = WB();
  return V5.createElement(S, {
    flexDirection: "row",
    marginTop: Q ? 1 : 0,
    width: "100%"
  }, B && V5.createElement(S, {
    minWidth: 2
  }, V5.createElement($, {
    color: G,
    dimColor: Z
  }, rD)), V5.createElement(S, {
    flexDirection: "column",
    width: I - 10
  }, V5.createElement($, {
    color: G,
    dimColor: Z,
    wrap: "wrap"
  }, A.trim())))
}
// @from(Start 13477633, End 13477635)
V5
// @from(Start 13477641, End 13477711)
N89 = L(() => {
  hA();
  dn();
  i8();
  w89();
  V5 = BA(VA(), 1)
})
// @from(Start 13477714, End 13477898)
function L89() {
  let {
    columns: A
  } = WB();
  return vW0.createElement(D3, {
    dividerChar: "═",
    title: "Conversation compacted · ctrl+o for history",
    width: A
  })
}
// @from(Start 13477903, End 13477906)
vW0
// @from(Start 13477912, End 13477966)
M89 = L(() => {
  BK();
  i8();
  vW0 = BA(VA(), 1)
})
// @from(Start 13477969, End 13478912)
function O89({
  message: A,
  tools: Q,
  normalizedMessages: B,
  resolvedToolUseIDs: G,
  erroredToolUseIDs: Z,
  inProgressToolUseIDs: I,
  shouldAnimate: Y
}) {
  let J = Q.find((F) => F.name === A.toolName);
  if (!J?.renderGroupedToolUse) return null;
  let W = new Map;
  for (let F of A.results)
    for (let K of F.message.content)
      if (K.type === "tool_result") W.set(K.tool_use_id, {
        param: K,
        output: F.toolUseResult
      });
  let X = A.messages.map((F) => {
      let K = F.message.content[0],
        D = W.get(K.id);
      return {
        param: K,
        isResolved: G.has(K.id),
        isError: Z.has(K.id),
        isInProgress: I.has(K.id),
        progressMessages: $p(B.filter((H) => H.type === "progress" && H.parentToolUseID === K.id)),
        result: D
      }
    }),
    V = X.some((F) => F.isInProgress);
  return J.renderGroupedToolUse(X, {
    shouldAnimate: Y && V,
    tools: Q
  })
}
// @from(Start 13478917, End 13478931)
R89 = () => {}
// @from(Start 13478934, End 13481076)
function xP3({
  message: A,
  messages: Q,
  addMargin: B,
  tools: G,
  verbose: Z,
  erroredToolUseIDs: I,
  inProgressToolUseIDs: Y,
  resolvedToolUseIDs: J,
  progressMessagesForMessage: W,
  shouldAnimate: X,
  shouldShowDot: V,
  style: F,
  width: K,
  isTranscriptMode: D,
  onOpenRateLimitOptions: H
}) {
  switch (A.type) {
    case "attachment":
      return u3.createElement(z89, {
        addMargin: B,
        attachment: A.attachment,
        verbose: Z
      });
    case "assistant":
      return u3.createElement(S, {
        flexDirection: "column",
        width: "100%"
      }, A.message.content.map((C, E) => u3.createElement(bP3, {
        key: E,
        param: C,
        addMargin: B,
        tools: G,
        verbose: Z,
        erroredToolUseIDs: I,
        inProgressToolUseIDs: Y,
        resolvedToolUseIDs: J,
        progressMessagesForMessage: W,
        shouldAnimate: X,
        shouldShowDot: V,
        width: K,
        inProgressToolCallCount: Y.size,
        isTranscriptMode: D,
        messages: Q,
        onOpenRateLimitOptions: H
      })));
    case "user":
      return u3.createElement(S, {
        flexDirection: "column",
        width: "100%"
      }, A.message.content.map((C, E) => u3.createElement(vP3, {
        key: E,
        message: A,
        messages: Q,
        addMargin: B,
        tools: G,
        progressMessagesForMessage: W,
        param: C,
        style: F,
        verbose: Z
      })));
    case "system":
      if (A.subtype === "compact_boundary") return u3.createElement(L89, null);
      if (A.subtype === "local_command") return u3.createElement(LQA, {
        addMargin: B,
        param: {
          type: "text",
          text: A.content
        },
        verbose: Z
      });
      return u3.createElement(q89, {
        message: A,
        addMargin: B,
        verbose: Z
      });
    case "grouped_tool_use":
      return u3.createElement(O89, {
        message: A,
        tools: G,
        normalizedMessages: Q,
        resolvedToolUseIDs: J,
        erroredToolUseIDs: I,
        inProgressToolUseIDs: Y,
        shouldAnimate: X
      })
  }
}
// @from(Start 13481078, End 13481726)
function vP3({
  message: A,
  messages: Q,
  addMargin: B,
  tools: G,
  progressMessagesForMessage: Z,
  param: I,
  style: Y,
  verbose: J
}) {
  let {
    columns: W
  } = WB();
  switch (I.type) {
    case "text":
      return u3.createElement(LQA, {
        addMargin: B,
        param: I,
        verbose: J,
        thinkingMetadata: A.thinkingMetadata
      });
    case "tool_result":
      return u3.createElement(sQ9, {
        param: I,
        message: A,
        messages: Q,
        progressMessagesForMessage: Z,
        style: Y,
        tools: G,
        verbose: J,
        width: W - 5
      });
    default:
      return
  }
}
// @from(Start 13481728, End 13483059)
function bP3({
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
  width: V,
  inProgressToolCallCount: F,
  isTranscriptMode: K,
  messages: D,
  onOpenRateLimitOptions: H
}) {
  switch (A.type) {
    case "tool_use":
      return u3.createElement(AB9, {
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
        inProgressToolCallCount: F,
        messages: D
      });
    case "text":
      return u3.createElement(i49, {
        param: A,
        addMargin: Q,
        shouldShowDot: X,
        width: V,
        onOpenRateLimitOptions: H
      });
    case "redacted_thinking":
      if (!K && !G) return null;
      return u3.createElement(D89, {
        addMargin: Q
      });
    case "thinking":
      if (!K && !G) return null;
      return u3.createElement(F89, {
        addMargin: Q,
        param: A,
        isTranscriptMode: K,
        verbose: G
      });
    default:
      return AA(Error(`Unable to render message type: ${A.type}`)), null
  }
}
// @from(Start 13483061, End 13483190)
function fP3(A, Q) {
  if (A.message.uuid !== Q.message.uuid) return !1;
  if (A.isStatic && Q.isStatic) return !0;
  return !1
}
// @from(Start 13483195, End 13483197)
u3
// @from(Start 13483199, End 13483201)
xg
// @from(Start 13483207, End 13483384)
UjA = L(() => {
  hA();
  g1();
  rQ9();
  QB9();
  n49();
  II1();
  K89();
  H89();
  i8();
  U89();
  N89();
  M89();
  R89();
  u3 = BA(VA(), 1);
  xg = u3.memo(xP3, fP3)
})
// @from(Start 13483387, End 13487511)
function T89({
  session: A,
  toolUseContext: Q,
  onDone: B,
  onBack: G
}) {
  let [Z, I] = $jA.useState(!1), [Y, J] = $jA.useState(null);
  f1((D, H) => {
    if (H.escape || H.return || D === " ") B("Remote session details dismissed", {
      display: "system"
    });
    else if (H.leftArrow && G) G();
    else if (D === "t" && !Z) X()
  });
  let W = EQ();
  async function X() {
    I(!0), J(null);
    try {
      await yRA(A.id)
    } catch (D) {
      J(D instanceof Error ? D.message : String(D)), I(!1)
    }
  }
  let V = (D) => {
      let H = Math.floor((Date.now() - D) / 1000),
        C = Math.floor(H / 3600),
        E = Math.floor((H - C * 3600) / 60),
        U = H - C * 3600 - E * 60;
      return `${C>0?`${C}h `:""}${E>0||C>0?`${E}m `:""}${U}s`
    },
    F = $jA.useMemo(() => {
      return nJ(Pg(A.log.slice(-3))).filter((D) => D.type !== "progress")
    }, [A]),
    K = A.title.length > 50 ? A.title.substring(0, 47) + "..." : A.title;
  return x6.default.createElement(S, {
    width: "100%",
    flexDirection: "column"
  }, x6.default.createElement(S, {
    width: "100%"
  }, x6.default.createElement(S, {
    borderStyle: "round",
    borderColor: "background",
    flexDirection: "column",
    marginTop: 1,
    paddingLeft: 1,
    paddingRight: 1,
    width: "100%"
  }, x6.default.createElement(S, null, x6.default.createElement($, {
    color: "background",
    bold: !0
  }, "Remote session details")), x6.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, x6.default.createElement($, null, x6.default.createElement($, {
    bold: !0
  }, "Status"), ":", " ", A.status === "running" || A.status === "starting" ? x6.default.createElement($, {
    color: "background"
  }, A.status) : A.status === "completed" ? x6.default.createElement($, {
    color: "success"
  }, A.status) : x6.default.createElement($, {
    color: "error"
  }, A.status)), x6.default.createElement($, null, x6.default.createElement($, {
    bold: !0
  }, "Runtime"), ": ", V(A.startTime)), x6.default.createElement($, {
    wrap: "truncate-end"
  }, x6.default.createElement($, {
    bold: !0
  }, "Title"), ": ", K), x6.default.createElement($, null, x6.default.createElement($, {
    bold: !0
  }, "Progress"), ":", " ", x6.default.createElement(xZ1, {
    session: A
  })), x6.default.createElement($, null, x6.default.createElement($, {
    bold: !0
  }, "Session URL"), ":", " ", x6.default.createElement($, {
    dimColor: !0
  }, "https://claude.ai/code/", A.id))), A.log.length > 0 && x6.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, x6.default.createElement($, null, x6.default.createElement($, {
    bold: !0
  }, "Recent messages"), ":"), x6.default.createElement(S, {
    flexDirection: "column",
    height: 10,
    overflowY: "hidden"
  }, F.map((D, H) => x6.default.createElement(xg, {
    key: H,
    message: D,
    messages: F,
    addMargin: H > 0,
    tools: Q.options.tools,
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
  }))), x6.default.createElement(S, {
    marginTop: 1
  }, x6.default.createElement($, {
    dimColor: !0,
    italic: !0
  }, "Showing last ", Math.min(3, A.log.length), " of", " ", A.log.length, " messages"))), Y && x6.default.createElement(S, {
    marginTop: 1
  }, x6.default.createElement($, {
    color: "error"
  }, "Teleport failed: ", Y)), Z && x6.default.createElement(S, {
    marginTop: 1
  }, x6.default.createElement($, {
    color: "background"
  }, "Teleporting to session...")))), x6.default.createElement(S, {
    marginLeft: 2
  }, W.pending ? x6.default.createElement($, {
    dimColor: !0
  }, "Press ", W.keyName, " again to exit") : x6.default.createElement($, {
    dimColor: !0
  }, G ? x6.default.createElement($, null, "← to go back · ") : null, "Esc/Enter/Space to close", !Z ? x6.default.createElement($, null, " · t to teleport") : null)))
}
// @from(Start 13487516, End 13487518)
x6
// @from(Start 13487520, End 13487523)
$jA
// @from(Start 13487529, End 13487645)
P89 = L(() => {
  hA();
  Q4();
  uJ0();
  $0A();
  UjA();
  QjA();
  cQ();
  x6 = BA(VA(), 1), $jA = BA(VA(), 1)
})
// @from(Start 13487648, End 13487895)
function hP3(A) {
  switch (A) {
    case "running":
      return H1.pointer;
    case "completed":
      return H1.tick;
    case "failed":
      return H1.cross;
    case "killed":
      return H1.cross;
    default:
      return H1.bullet
  }
}
// @from(Start 13487897, End 13488127)
function gP3(A) {
  switch (A) {
    case "running":
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
// @from(Start 13488129, End 13488602)
function uP3(A, Q, B) {
  let G = Q.find((Z) => Z.name === A.toolName);
  if (!G) return A.toolName;
  try {
    let Z = G.inputSchema.safeParse(A.input),
      I = Z.success ? Z.data : {},
      Y = G.userFacingName(I);
    if (!Y) return A.toolName;
    let J = G.renderToolUseMessage(I, {
      theme: B,
      verbose: !1
    });
    if (J) return U6.default.createElement(U6.default.Fragment, null, Y, "(", J, ")");
    return Y
  } catch {
    return A.toolName
  }
}
// @from(Start 13488604, End 13489136)
function mP3(A, Q) {
  let [B, G] = U6.useState(() => Math.floor((Date.now() - A) / 1000));
  return U6.useEffect(() => {
    if (!Q) return;
    let I = 1000 - Date.now() % 1000,
      Y = setTimeout(() => {
        G(Math.floor((Date.now() - A) / 1000));
        let J = setInterval(() => {
          G(Math.floor((Date.now() - A) / 1000))
        }, 1000);
        Y.intervalId = J
      }, I);
    return () => {
      clearTimeout(Y);
      let J = Y.intervalId;
      if (J) clearInterval(J)
    }
  }, [Q, A]), eC(B * 1000)
}
// @from(Start 13489138, End 13492526)
function j89({
  agent: A,
  onDone: Q,
  onKillAgent: B,
  onBack: G
}) {
  let [Z] = OQ(), I = Z.todos[A.agentId] ?? [], Y = I.filter((H) => H.status === "completed").length, [J] = qB(), W = U6.useMemo(() => LC(ZE()), []), X = mP3(A.startTime, A.status === "running");
  f1((H, C) => {
    if (C.escape || C.return || H === " ") Q();
    else if (C.leftArrow && G) G();
    else if (H === "k" && A.status === "running" && B) B()
  });
  let V = EQ(),
    F = A.prompt.length > 300 ? A.prompt.substring(0, 297) + "…" : A.prompt,
    K = A.result?.totalTokens ?? A.progress?.tokenCount,
    D = A.result?.totalToolUseCount ?? A.progress?.toolUseCount;
  return U6.default.createElement(S, {
    width: "100%",
    flexDirection: "column"
  }, U6.default.createElement(S, {
    width: "100%"
  }, U6.default.createElement(S, {
    borderStyle: "round",
    borderColor: "background",
    flexDirection: "column",
    marginTop: 1,
    paddingLeft: 1,
    paddingRight: 1,
    width: "100%"
  }, U6.default.createElement(S, null, U6.default.createElement($, {
    color: "background",
    bold: !0
  }, A.selectedAgent?.agentType ?? "agent", " ›", " ", A.description || "Async agent")), U6.default.createElement(S, null, A.status !== "running" && U6.default.createElement($, {
    color: gP3(A.status)
  }, hP3(A.status), " ", A.status === "completed" ? "Completed" : A.status === "failed" ? "Failed" : "Killed", " · "), U6.default.createElement($, {
    dimColor: !0
  }, X, K !== void 0 && K > 0 && U6.default.createElement(U6.default.Fragment, null, " · ", JZ(K), " tokens"), D !== void 0 && D > 0 && U6.default.createElement(U6.default.Fragment, null, " · ", D, " tools"))), U6.default.createElement(S, {
    flexDirection: "column"
  }, A.status === "running" && A.progress?.recentActivities && A.progress.recentActivities.length > 0 && U6.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, U6.default.createElement($, {
    bold: !0,
    dimColor: !0
  }, "Progress"), A.progress.recentActivities.map((H, C) => U6.default.createElement($, {
    key: C,
    dimColor: C < A.progress.recentActivities.length - 1,
    wrap: "truncate-end"
  }, C === A.progress.recentActivities.length - 1 ? "› " : "  ", uP3(H, W, J)))), I.length > 0 && U6.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, U6.default.createElement($, {
    bold: !0,
    dimColor: !0
  }, "Tasks (", Y, "/", I.length, ")"), U6.default.createElement(Yn, {
    todos: I
  })), U6.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, U6.default.createElement($, {
    bold: !0,
    dimColor: !0
  }, "Prompt"), U6.default.createElement($, {
    wrap: "wrap"
  }, F)), A.status === "failed" && A.error && U6.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, U6.default.createElement($, {
    bold: !0,
    color: "error"
  }, "Error"), U6.default.createElement($, {
    color: "error",
    wrap: "wrap"
  }, A.error))))), U6.default.createElement(S, {
    marginLeft: 2
  }, V.pending ? U6.default.createElement($, {
    dimColor: !0
  }, "Press ", V.keyName, " again to exit") : U6.default.createElement($, {
    dimColor: !0
  }, G ? U6.default.createElement($, null, "← to go back · ") : null, "Esc/Enter/Space to close", A.status === "running" && B ? U6.default.createElement($, null, " · k to kill") : null)))
}
// @from(Start 13492531, End 13492533)
U6
// @from(Start 13492539, End 13492625)
S89 = L(() => {
  hA();
  Q4();
  z9();
  HRA();
  V9();
  yq();
  U6 = BA(VA(), 1)
})
// @from(Start 13492628, End 13492961)
function dP3(A, Q, B) {
  Q((G) => {
    let Z = G.backgroundTasks[A];
    if (!Z || Z.type !== "async_agent") return AA(Error("Async Agent not found in AppState.backgroundTasks. This is a bug")), G;
    let I = B(Z);
    return {
      ...G,
      backgroundTasks: {
        ...G.backgroundTasks,
        [A]: I
      }
    }
  })
}
// @from(Start 13492963, End 13493160)
function bW0(A, Q) {
  dP3(A, Q, (B) => {
    if (B.status !== "running") return B;
    return B.abortController?.abort(), B.unregisterCleanup?.(), {
      ...B,
      status: "killed"
    }
  })
}
// @from(Start 13493165, End 13493214)
JI1 = L(() => {
  OZ();
  g1();
  HH();
  RZ()
})
// @from(Start 13493217, End 13498329)
function WI1({
  onDone: A,
  toolUseContext: Q
}) {
  let [{
    backgroundTasks: B
  }, G] = OQ(), [Z, I] = OQA.useState(null), [Y, J] = OQA.useState(0);
  f1((T, y) => {
    if (!Z && y.escape) A("Background tasks dialog dismissed", {
      display: "system"
    });
    if (!Z && y.return && E) I(E.id);
    if (!Z && T === "k" && E?.type === "shell") X(E.id);
    if (!Z && T === "k" && E?.type === "async_agent") bW0(E.id, G);
    if (!Z && (y.upArrow || y.downArrow)) {
      let v = C.length;
      if (v === 0) return;
      if (y.upArrow) J((x) => Math.max(0, x - 1));
      else J((x) => Math.min(v - 1, x + 1))
    }
  });
  let W = EQ();

  function X(T) {
    G((y) => {
      let v = B[T];
      if (!v) return y;
      if (v.type !== "shell") return y;
      return {
        ...y,
        backgroundTasks: {
          ...y.backgroundTasks,
          [T]: W01(v)
        }
      }
    })
  }
  let V = Object.values(B).map(cP3),
    F = V.sort((T, y) => {
      if (T.status === "running" && y.status !== "running") return -1;
      if (T.status !== "running" && y.status === "running") return 1;
      return y.task.startTime - T.task.startTime
    }),
    K = F.filter((T) => T.type === "shell"),
    D = F.filter((T) => T.type === "remote_session"),
    H = F.filter((T) => T.type === "async_agent"),
    C = OQA.useMemo(() => {
      return [...K, ...D, ...H]
    }, [K, D, H]),
    E = C[Y] || null;
  if (OQA.useEffect(() => {
      if (Z && !Object.values(B).some((y) => y.type === "async_agent" ? y.agentId === Z : y.id === Z)) I(null);
      let T = C.length;
      if (Y >= T && T > 0) J(T - 1)
    }, [Z, B, Y, C]), Z) {
    let T = Object.values(B).find((y) => y.type === "async_agent" ? y.agentId === Z : y.id === Z);
    if (!T) return null;
    if (T.type === "shell") return U3.default.createElement(_Q9, {
      shell: T,
      onDone: A,
      onKillShell: () => X(T.id),
      onBack: () => I(null),
      key: `shell-${T.id}`
    });
    else if (T.type === "async_agent") return U3.default.createElement(j89, {
      agent: T,
      onDone: A,
      onKillAgent: () => bW0(T.agentId, G),
      onBack: () => I(null),
      key: `agent-${T.agentId}`
    });
    else return U3.default.createElement(T89, {
      session: T,
      onDone: A,
      toolUseContext: Q,
      onBack: () => I(null),
      key: `session-${T.id}`
    })
  }
  let U = K.filter((T) => T.status === "running").length,
    q = D.filter((T) => T.status === "running" || T.status === "starting").length,
    w = H.filter((T) => T.status === "running").length,
    N = dV([...U > 0 ? [U3.default.createElement($, {
      key: "shells"
    }, U, " ", U !== 1 ? "active shells" : "active shell")] : [], ...q > 0 ? [U3.default.createElement($, {
      key: "sessions"
    }, q, " ", q !== 1 ? "active session" : "active session")] : [], ...[]], (T) => U3.default.createElement($, {
      key: `separator-${T}`
    }, " · ")),
    R = [U3.default.createElement($, {
      key: "upDown"
    }, "↑/↓ to select"), U3.default.createElement($, {
      key: "enter"
    }, "Enter to view"), ...(E?.type === "shell" || E?.type === "async_agent") && E.status === "running" ? [U3.default.createElement($, {
      key: "kill"
    }, "k to kill")] : [], U3.default.createElement($, {
      key: "esc"
    }, "Esc to close")];
  return U3.default.createElement(S, {
    width: "100%",
    flexDirection: "column"
  }, U3.default.createElement(S, {
    borderStyle: "round",
    borderColor: "background",
    flexDirection: "column",
    marginTop: 1,
    paddingLeft: 1,
    paddingRight: 1,
    width: "100%"
  }, U3.default.createElement($, {
    color: "background",
    bold: !0
  }, "Background tasks"), U3.default.createElement($, {
    dimColor: !0
  }, N), V.length === 0 ? U3.default.createElement($, {
    dimColor: !0
  }, "No tasks currently running") : U3.default.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, K.length > 0 && U3.default.createElement(S, {
    flexDirection: "column"
  }, (D.length > 0 || H.length > 0) && U3.default.createElement($, {
    dimColor: !0
  }, U3.default.createElement($, {
    bold: !0
  }, "  ", "Bashes"), " (", K.length, ")"), U3.default.createElement(S, {
    flexDirection: "column"
  }, K.map((T, y) => U3.default.createElement(_89, {
    key: T.id,
    item: T,
    isSelected: y === Y
  })))), D.length > 0 && U3.default.createElement(S, {
    flexDirection: "column",
    marginTop: K.length > 0 ? 1 : 0
  }, U3.default.createElement($, {
    dimColor: !0
  }, U3.default.createElement($, {
    bold: !0
  }, "  ", "Remote sessions"), " (", D.length, ")"), U3.default.createElement(S, {
    flexDirection: "column"
  }, D.map((T, y) => U3.default.createElement(_89, {
    key: T.id,
    item: T,
    isSelected: K.length + y === Y
  })))), !1)), U3.default.createElement(S, {
    marginLeft: 2
  }, W.pending ? U3.default.createElement($, {
    dimColor: !0
  }, "Press ", W.keyName, " again to exit") : U3.default.createElement($, {
    dimColor: !0
  }, dV(R, (T) => U3.default.createElement($, {
    key: `separator-${T}`
  }, " · ")))))
}
// @from(Start 13498331, End 13498771)
function cP3(A) {
  switch (A.type) {
    case "shell":
      return {
        id: A.id, type: "shell", label: A.description, status: A.status, task: A
      };
    case "remote_session":
      return {
        id: A.id, type: "remote_session", label: A.title, status: A.status, task: A
      };
    case "async_agent":
      return {
        id: A.agentId, type: "async_agent", label: A.description, status: A.status, task: A
      }
  }
}
// @from(Start 13498773, End 13499059)
function _89({
  item: A,
  isSelected: Q
}) {
  return U3.default.createElement(S, {
    flexDirection: "row",
    gap: 1
  }, U3.default.createElement($, {
    color: Q ? "suggestion" : void 0
  }, Q ? H1.pointer + " " : "  ", U3.default.createElement(vZ1, {
    task: A.task
  })))
}
// @from(Start 13499064, End 13499066)
U3
// @from(Start 13499068, End 13499071)
OQA
// @from(Start 13499077, End 13499219)
fW0 = L(() => {
  hA();
  V9();
  Q4();
  kQ9();
  P89();
  S89();
  z9();
  _AA();
  JI1();
  mJ0();
  U3 = BA(VA(), 1), OQA = BA(VA(), 1)
})
// @from(Start 13499222, End 13499564)
function lP3(A, Q) {
  if (A.length <= pP3) return {
    truncatedText: A,
    placeholderContent: ""
  };
  let B = Math.floor(k89 / 2),
    G = Math.floor(k89 / 2),
    Z = A.slice(0, B),
    I = A.slice(-G),
    Y = A.slice(B, -G),
    J = GrA(Y),
    X = iP3(Q, J);
  return {
    truncatedText: Z + X + I,
    placeholderContent: Y
  }
}
// @from(Start 13499566, End 13499640)
function iP3(A, Q) {
  return `[...Truncated text #${A} +${Q} lines...]`
}
// @from(Start 13499642, End 13500044)
function y89(A, Q) {
  let B = Object.keys(Q).map(Number),
    G = B.length > 0 ? Math.max(...B) + 1 : 1,
    {
      truncatedText: Z,
      placeholderContent: I
    } = lP3(A, G);
  if (!I) return {
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
        content: I
      }
    }
  }
}
// @from(Start 13500049, End 13500058)
pP3 = 1e4
// @from(Start 13500062, End 13500072)
k89 = 1000
// @from(Start 13500078, End 13500103)
x89 = L(() => {
  zp()
})
// @from(Start 13500106, End 13500526)
function v89({
  input: A,
  pastedContents: Q,
  onInputChange: B,
  setCursorOffset: G,
  setPastedContents: Z
}) {
  let [I, Y] = wjA.useState(!1);
  wjA.useEffect(() => {
    if (I) return;
    if (A.length <= 1e4) return;
    let {
      newInput: J,
      newPastedContents: W
    } = y89(A, Q);
    B(J), G(J.length), Z(W), Y(!0)
  }, [A, I, Q, B, Z, G]), wjA.useEffect(() => {
    if (A === "") Y(!1)
  }, [A])
}
// @from(Start 13500531, End 13500534)
wjA
// @from(Start 13500540, End 13500587)
b89 = L(() => {
  x89();
  wjA = BA(VA(), 1)
})
// @from(Start 13500590, End 13500821)
function f89(A, Q = 20) {
  let B = new Map;
  for (let Z of A) B.set(Z, (B.get(Z) || 0) + 1);
  return Array.from(B.entries()).sort((Z, I) => I[1] - Z[1]).slice(0, Q).map(([Z, I]) => `${I.toString().padStart(6)} ${Z}`).join(`
`)
}
// @from(Start 13500822, End 13502678)
async function nP3() {
  if (d0.platform === "win32") return [];
  if (!await rw()) return [];
  try {
    let A = "",
      {
        stdout: Q
      } = await A3("git", ["config", "user.email"], {
        cwd: W0()
      }),
      B = "";
    if (Q.trim()) {
      let {
        stdout: Y
      } = await A3("git", ["log", "-n", "1000", "--pretty=format:", "--name-only", "--diff-filter=M", `--author=${Q.trim()}`], {
        cwd: W0()
      }), J = Y.split(`
`).filter((W) => W.trim());
      B = f89(J)
    }
    if (A = `Files modified by user:
` + B, B.split(`
`).length < 10) {
      let {
        stdout: Y
      } = await A3("git", ["log", "-n", "1000", "--pretty=format:", "--name-only", "--diff-filter=M"], {
        cwd: W0()
      }), J = Y.split(`
`).filter((X) => X.trim()), W = f89(J);
      A += `

Files modified by other users:
` + W
    }
    let Z = (await uX({
      systemPrompt: ["You are an expert at analyzing git history. Given a list of files and their modification counts, return exactly five filenames that are frequently modified and represent core application logic (not auto-generated files, dependencies, or configuration). Make sure filenames are diverse, not all in the same folder, and are a mix of user and other users. Return only the filenames' basenames (without the path) separated by newlines with no explanation."],
      userPrompt: A,
      signal: new AbortController().signal,
      options: {
        querySource: "example_commands_frequently_modified",
        agents: [],
        isNonInteractiveSession: !1,
        hasAppendSystemPrompt: !1,
        mcpTools: [],
        agentIdOrSessionId: e1()
      }
    })).message.content[0];
    if (!Z || Z.type !== "text") return [];
    let I = Z.text.trim().split(`
`);
    if (I.length < 5) return [];
    return I
  } catch (A) {
    return AA(A), []
  }
}
// @from(Start 13502683, End 13502698)
aP3 = 604800000
// @from(Start 13502702, End 13502705)
h89
// @from(Start 13502707, End 13502710)
g89
// @from(Start 13502716, End 13503489)
hW0 = L(() => {
  jQ();
  c5();
  U2();
  fZ();
  _8();
  g1();
  l2();
  LxA();
  PV();
  _0();
  h89 = s1(() => {
    let A = j5(),
      Q = A.exampleFiles?.length ? as(A.exampleFiles) : "<filepath>",
      B = ["fix lint errors", "fix typecheck errors", `how does ${Q} work?`, `refactor ${Q}`, "how do I log an error?", `edit ${Q} to...`, `write a test for ${Q}`, "create a util logging.py that..."];
    return `Try "${as(B)}"`
  }), g89 = s1(async () => {
    let A = j5(),
      Q = Date.now(),
      B = A.exampleFilesGeneratedAt ?? 0;
    if (Q - B > aP3) A.exampleFiles = [];
    if (!A.exampleFiles?.length) nP3().then((G) => {
      if (G.length) AY({
        ...j5(),
        exampleFiles: G,
        exampleFilesGeneratedAt: Date.now()
      })
    })
  })
})
// @from(Start 13503492, End 13503905)
function m89({
  input: A,
  mode: Q,
  submitCount: B
}) {
  let [{
    queuedCommands: G
  }] = OQ(), Z = u89.useMemo(() => {
    if (A !== "") return;
    if (G.length > 0 && (N1().queuedCommandUpHintCount || 0) < sP3) return "Press up to edit queued messages";
    if (B < 1) return h89()
  }, [A, G, B]);
  if (Q === "memory") return 'Add to memory. Try "Always use descriptive variable names"';
  return Z
}
// @from(Start 13503910, End 13503913)
u89
// @from(Start 13503915, End 13503922)
sP3 = 3
// @from(Start 13503928, End 13503991)
d89 = L(() => {
  z9();
  jQ();
  hW0();
  u89 = BA(VA(), 1)
})
// @from(Start 13503994, End 13504560)
function c89({
  mode: A,
  isLoading: Q
}) {
  return tP.createElement(S, {
    alignItems: "flex-start",
    alignSelf: "flex-start",
    flexWrap: "nowrap",
    justifyContent: "flex-start",
    width: 2
  }, A === "bash" ? tP.createElement($, {
    color: "bashBorder",
    dimColor: Q
  }, "! ") : A === "memory" || A === "memorySelect" ? tP.createElement($, {
    color: "remember",
    dimColor: Q
  }, "# ") : A === "background" ? tP.createElement($, {
    color: "background",
    dimColor: Q
  }, "& ") : tP.createElement($, {
    dimColor: Q
  }, "> "))
}
// @from(Start 13504565, End 13504567)
tP
// @from(Start 13504573, End 13504618)
p89 = L(() => {
  hA();
  tP = BA(VA(), 1)
})
// @from(Start 13504621, End 13504965)
function l89() {
  let {
    columns: A
  } = WB(), [{
    queuedCommands: Q
  }] = OQ();
  if (Q.length === 0) return null;
  return qjA.createElement(S, {
    marginTop: 1,
    paddingLeft: 2,
    flexDirection: "column",
    width: A - 4
  }, qjA.createElement($, {
    dimColor: !0,
    wrap: "wrap"
  }, Q.map((B) => B.value).join(`
`)))
}
// @from(Start 13504970, End 13504973)
qjA
// @from(Start 13504979, End 13505041)
i89 = L(() => {
  i8();
  z9();
  hA();
  qjA = BA(VA(), 1)
})
// @from(Start 13505044, End 13505276)
function NjA(A, Q) {
  let B = e1(),
    G = {
      type: "queue-operation",
      operation: A,
      timestamp: new Date().toISOString(),
      sessionId: B,
      ...Q !== void 0 && {
        content: Q
      }
    };
  r89(G)
}
// @from(Start 13505278, End 13505439)
function XI1(A, Q) {
  Q((B) => ({
    ...B,
    queuedCommands: [...B.queuedCommands, A]
  })), NjA("enqueue", typeof A.value === "string" ? A.value : void 0)
}
// @from(Start 13505440, End 13505648)
async function n89(A, Q) {
  let B = await A();
  if (B.queuedCommands.length === 0) return;
  let [G, ...Z] = B.queuedCommands;
  return Q((I) => ({
    ...I,
    queuedCommands: Z
  })), NjA("dequeue"), G
}
// @from(Start 13505649, End 13505879)
async function a89(A, Q) {
  let B = await A();
  if (B.queuedCommands.length === 0) return [];
  let G = [...B.queuedCommands];
  Q((Z) => ({
    ...Z,
    queuedCommands: []
  }));
  for (let Z of G) NjA("dequeue");
  return G
}
// @from(Start 13505881, End 13506085)
function s89(A, Q) {
  if (A.length === 0) return;
  Q((B) => ({
    ...B,
    queuedCommands: B.queuedCommands.filter((G) => !A.some((Z) => Z.value === G.value))
  }));
  for (let B of A) NjA("remove")
}
// @from(Start 13506086, End 13506512)
async function VI1(A, Q, B, G) {
  let Z = await B();
  if (Z.queuedCommands.length === 0) return;
  let I = Z.queuedCommands.map((W) => W.value),
    Y = [...I, A].filter(Boolean).join(`
`),
    J = I.join(`
`).length + 1 + Q;
  for (let W of Z.queuedCommands) NjA("popAll", typeof W.value === "string" ? W.value : void 0);
  return G((W) => ({
    ...W,
    queuedCommands: []
  })), {
    text: Y,
    cursorOffset: J
  }
}
// @from(Start 13506517, End 13506550)
RQA = L(() => {
  S7();
  _0()
})
// @from(Start 13506553, End 13508816)
function o89(A, Q, B, G, Z, I, Y, J, W) {
  let [X, V] = QN.useState(""), [F, K] = QN.useState(!1), [D, H] = QN.useState(""), [C, E] = QN.useState(0), [U, q] = QN.useState("prompt"), [w, N] = QN.useState(void 0), R = QN.useRef(void 0), T = QN.useRef(new Set), y = QN.useRef(null);

  function v() {
    if (R.current) R.current.return(void 0), R.current = void 0
  }

  function x() {
    W(!1), V(""), K(!1), H(""), E(0), q("prompt"), N(void 0), v(), T.current.clear()
  }
  async function p(u, e) {
    if (!J) return;
    if (X.length === 0) {
      v(), T.current.clear(), N(void 0), K(!1), B(D), G(C), I(U);
      return
    }
    if (!u) v(), R.current = ZrA(), T.current.clear();
    if (!R.current) return;
    while (!0) {
      if (e?.aborted) return;
      let l = await R.current.next();
      if (l.done) {
        K(!0);
        return
      }
      let k = l.value.display,
        m = k.lastIndexOf(X);
      if (m !== -1 && !T.current.has(k)) {
        T.current.add(k), N(l.value), K(!1);
        let o = Wf(k);
        I(o), B(k);
        let FA = et(k).lastIndexOf(X);
        G(FA !== -1 ? FA : m);
        return
      }
    }
  }
  return f1((u, e) => {
    if (J) {
      if (e.ctrl && u === "r") p(!0);
      else if (e.escape || e.tab) {
        if (w) {
          let l = typeof w === "string" ? w : w.display,
            k = Wf(l),
            m = et(l);
          B(m), I(k)
        }
        x()
      } else if (e.ctrl && u === "c" || e.backspace && X === "") B(D), G(C), x();
      else if (e.return) {
        if (X.length === 0) A({
          display: D,
          pastedContents: {}
        });
        else if (w) {
          let l = typeof w === "string" ? w : w.display,
            k = Wf(l),
            m = et(l);
          I(k), A({
            display: m,
            pastedContents: {}
          })
        }
        x()
      }
    } else if (e.ctrl && u === "r") W(!0), H(Q), E(Z), q(Y), R.current = ZrA(), T.current.clear()
  }, {
    isActive: !0
  }), QN.useEffect(() => {
    y.current?.abort();
    let u = new AbortController;
    return y.current = u, p(!1, u.signal), () => {
      u.abort()
    }
  }, [X]), {
    historyQuery: X,
    setHistoryQuery: V,
    historyMatch: w,
    historyFailedMatch: F
  }
}
// @from(Start 13508821, End 13508823)
QN
// @from(Start 13508829, End 13508891)
t89 = L(() => {
  hA();
  zp();
  o7A();
  QN = BA(VA(), 1)
})
// @from(Start 13508894, End 13509576)
function A69({
  inputValue: A,
  isAssistantResponding: Q
}) {
  let [B, G] = OQ(), I = Q || A.length > 0 ? null : B.promptSuggestion.text, Y = gW0.useCallback(() => {
    G((W) => ({
      ...W,
      promptSuggestion: {
        text: null,
        shownAt: 0
      }
    }))
  }, [G]), J = gW0.useCallback(() => {
    let W = B.promptSuggestion.text;
    if (W) {
      let X = B.promptSuggestion.shownAt;
      return GA("tengu_prompt_suggestion_accepted", {
        timeToAcceptMs: X > 0 ? Date.now() - X : 0,
        ...!1
      }), Y(), W
    }
    return null
  }, [B.promptSuggestion, Y]);
  return {
    suggestion: I,
    acceptSuggestion: J,
    clearSuggestion: Y
  }
}
// @from(Start 13509581, End 13509584)
gW0
// @from(Start 13509586, End 13509612)
e89 = " (enter to submit)"
// @from(Start 13509618, End 13509672)
Q69 = L(() => {
  z9();
  q0();
  gW0 = BA(VA(), 1)
})
// @from(Start 13509704, End 13521003)
function rP3({
  debug: A,
  ideSelection: Q,
  toolPermissionContext: B,
  setToolPermissionContext: G,
  apiKeyStatus: Z,
  commands: I,
  agents: Y,
  isLoading: J,
  verbose: W,
  messages: X,
  onAutoUpdaterResult: V,
  autoUpdaterResult: F,
  input: K,
  onInputChange: D,
  mode: H,
  onModeChange: C,
  submitCount: E,
  onShowMessageSelector: U,
  mcpClients: q,
  pastedContents: w,
  setPastedContents: N,
  vimMode: R,
  setVimMode: T,
  showBashesDialog: y,
  setShowBashesDialog: v,
  onExit: x,
  getToolUseContext: p,
  onSubmit: u,
  isSearchingHistory: e,
  setIsSearchingHistory: l
}) {
  let k = Ja(),
    [m, o] = aJ.useState(!1),
    [IA, FA] = aJ.useState({
      show: !1
    }),
    [zA, NA] = aJ.useState(K.length),
    [OA, mA] = OQ(),
    {
      historyQuery: wA,
      setHistoryQuery: qA,
      historyMatch: KA,
      historyFailedMatch: yA
    } = o89((M1) => {
      let k1 = typeof M1 === "string" ? M1 : M1.display;
      sQ(k1)
    }, K, D, NA, zA, C, H, e, l),
    oA = aJ.useMemo(() => {
      let M1 = Object.keys(w).map(Number);
      if (M1.length === 0) return 1;
      return Math.max(...M1) + 1
    }, [w]),
    [X1, WA] = aJ.useState(!1),
    [EA, MA] = aJ.useState(!1),
    [DA, $A] = aJ.useState(!1),
    [TA, rA] = aJ.useState(!1),
    {
      suggestion: iA,
      acceptSuggestion: J1,
      clearSuggestion: w1
    } = A69({
      inputValue: K,
      isAssistantResponding: J
    }),
    jA = aJ.useMemo(() => e && KA ? et(typeof KA === "string" ? KA : KA.display) : K, [e, KA, K]),
    eA = aJ.useMemo(() => XrA(jA), [jA]),
    t1 = aJ.useMemo(() => {
      let M1 = [];
      if (e && KA && !yA) M1.push({
        start: zA,
        end: zA + wA.length,
        style: {
          type: "solid",
          color: "warning"
        },
        priority: 20
      });
      if (eA.length > 0) {
        let k1 = Ae(jA);
        if (k1.level !== "none") {
          let O0 = JrA[k1.level],
            oQ = iMB[k1.level];
          for (let tB of eA) M1.push({
            start: tB.start,
            end: tB.end,
            style: WrA(tB.word) ? {
              type: "rainbow",
              useShimmer: !0
            } : {
              type: "shimmer",
              baseColor: O0,
              shimmerColor: oQ
            },
            priority: 10
          })
        }
      }
      return M1
    }, [e, wA, KA, yA, zA, eA, jA]),
    {
      addNotification: v1
    } = vZ();
  aJ.useEffect(() => {
    if (!eA.length) return;
    if (eA.length && !OA.thinkingEnabled) v1({
      key: "thinking-toggled-via-keyword",
      jsx: wZ.createElement($, {
        color: "suggestion"
      }, "Thinking on"),
      priority: "immediate",
      timeoutMs: 3000
    })
  }, [v1, OA.thinkingEnabled, mA, eA.length]);
  let {
    pushToBuffer: F0,
    undo: g0,
    canUndo: p0,
    clearBuffer: n0
  } = jQ9({
    maxBufferSize: 50,
    debounceMs: 1000
  });
  v89({
    input: K,
    pastedContents: w,
    onInputChange: D,
    setCursorOffset: NA,
    setPastedContents: N
  });
  let _1 = m89({
      input: K,
      mode: H,
      submitCount: E
    }),
    zQ = aJ.useCallback((M1) => {
      if (M1 === "?") {
        GA("tengu_help_toggled", {}), WA((y9) => !y9);
        return
      }
      WA(!1);
      let k1 = M1.length === K.length + 1,
        O0 = zA === 0,
        oQ = Wf(M1);
      if (k1 && O0 && oQ !== "prompt") {
        C(oQ);
        return
      }
      let tB = M1.replaceAll("\t", "    ");
      if (K !== tB) F0(K, zA, w);
      D(tB)
    }, [D, C, K, zA, F0, w]),
    {
      resetHistory: W1,
      onHistoryUp: O1,
      onHistoryDown: a1,
      shouldShowSearchHint: C0,
      dismissSearchHint: v0,
      historyIndex: k0
    } = I09((M1, k1, O0) => {
      zQ(M1), C(k1), N(O0)
    }, K, w, NA);
  aJ.useEffect(() => {
    if (e) v0()
  }, [e, v0]);

  function f0() {
    if (K0.length > 1) return;
    if (OA.queuedCommands.length > 0) {
      H7();
      return
    }
    if (EA) MA(!1);
    else O1()
  }

  function G0() {
    if (K0.length > 1) return;
    let M1 = a1(),
      k1 = Object.values(OA.backgroundTasks).filter((O0) => O0.status === "running").length;
    if (M1 && k1 > 0) {
      MA(!0);
      let O0 = N1();
      if (!O0.hasSeenTasksHint) c0({
        ...O0,
        hasSeenTasksHint: !0
      })
    } else MA(!1)
  }
  let [yQ, aQ] = aJ.useState({
    suggestions: [],
    selectedSuggestion: -1,
    commandArgumentHint: void 0
  }), sQ = aJ.useCallback(async (M1, k1 = !1, O0) => {
    let oQ = M1.trim() === "" && iA ? J1() ?? "" : M1;
    if (w1(), oQ.trim() === "") return;
    let tB = yQ.suggestions.length > 0 && yQ.suggestions.every((y9) => y9.description === "directory");
    if (yQ.suggestions.length > 0 && !k1 && !tB) return;
    await u(oQ, O0, {
      setCursorOffset: NA,
      clearBuffer: n0,
      resetHistory: W1
    })
  }, [yQ.suggestions, u, NA, n0, W1, w1, iA, J1]), {
    suggestions: K0,
    selectedSuggestion: mB,
    commandArgumentHint: e2
  } = e09({
    commands: I,
    onInputChange: D,
    onSubmit: sQ,
    setCursorOffset: NA,
    input: K,
    cursorOffset: zA,
    mode: H,
    agents: Y,
    setSuggestionsState: aQ,
    suggestionsState: yQ,
    suppressSuggestions: e || k0 > 0
  }), s8 = H === "prompt" && K0.length === 0 && iA ? iA + e89 : _1;

  function K5(M1, k1) {
    GA("tengu_paste_image", {}), C("prompt");
    let O0 = {
      id: oA,
      type: "image",
      content: M1,
      mediaType: k1 || "image/png"
    };
    N((oQ) => ({
      ...oQ,
      [oA]: O0
    })), c3(uMB(O0.id))
  }

  function g6(M1) {
    let k1 = cY(M1).replace(/\r/g, `
`).replaceAll("\t", "    "),
      O0 = GrA(k1),
      oQ = Math.min(nG - 10, 2);
    if (k1.length > asA || O0 > oQ) {
      let tB = {
        id: oA,
        type: "text",
        content: k1
      };
      N((y9) => ({
        ...y9,
        [oA]: tB
      })), c3(gMB(tB.id, O0))
    } else c3(k1)
  }

  function c3(M1) {
    F0(K, zA, w);
    let k1 = K.slice(0, zA) + M1 + K.slice(zA);
    D(k1), NA(zA + M1.length)
  }
  let tZ = Bf(() => {}, () => U()),
    H7 = aJ.useCallback(async () => {
      let M1 = await VI1(K, zA, async () => new Promise((k1) => mA((O0) => {
        return k1(O0), O0
      })), mA);
      if (!M1) return;
      D(M1.text), C("prompt"), NA(M1.cursorOffset)
    }, [mA, D, C, K, zA]);
  TQ9(q, function(M1) {
    GA("tengu_ext_at_mentioned", {});
    let k1, O0 = B69.relative(W0(), M1.filePath);
    if (M1.lineStart && M1.lineEnd) k1 = M1.lineStart === M1.lineEnd ? `@${O0}#L${M1.lineStart} ` : `@${O0}#L${M1.lineStart}-${M1.lineEnd} `;
    else k1 = `@${O0} `;
    let oQ = K[zA - 1] ?? " ";
    if (!/\s/.test(oQ)) k1 = ` ${k1}`;
    c3(k1)
  }), f1((M1, k1) => {
    if (k1.ctrl && M1 === "_") {
      if (p0) {
        let O0 = g0();
        if (O0) D(O0.text), NA(O0.cursorOffset), N(O0.pastedContents)
      }
      return
    }
    if (k1.ctrl && M1.toLowerCase() === "g") {
      GA("tengu_external_editor_used", {}), rA(!0);
      let O0 = e31(K);
      if (rA(!1), O0 !== null && O0 !== K) F0(K, zA, w), D(O0), NA(O0.length);
      return
    }
    if (k1.return && EA) {
      v(!0), MA(!1);
      return
    }
    if (zA === 0 && (k1.escape || k1.backspace || k1.delete)) C("prompt"), WA(!1);
    if (X1 && K === "" && (k1.backspace || k1.delete)) WA(!1);
    if (HU.check(M1, k1)) {
      let O0 = YQ9(B);
      if (GA("tengu_mode_cycle", {
          to: O0
        }), B.mode === "plan" && O0 !== "plan") ou(!0);
      if (O0 === "plan") {
        let tB = N1();
        c0({
          ...tB,
          lastPlanModeUse: Date.now()
        })
      }
      let oQ = UF(B, {
        type: "setMode",
        mode: O0,
        destination: "session"
      });
      if (G(oQ), X1) WA(!1);
      return
    }
    if (k1.escape) {
      if (EA) {
        MA(!1);
        return
      }
      if (OA.queuedCommands.length > 0) {
        H7();
        return
      }
      if (X.length > 0 && !K && !J) tZ()
    }
    if (k1.return && X1) WA(!1)
  });
  let {
    columns: r5,
    rows: nG
  } = WB(), aG = r5 - 3, U1 = aJ.useMemo(() => {
    let M1 = K.split(`
`);
    for (let k1 of M1)
      if (k1.length > aG) return !0;
    return M1.length > 1
  }, [K, aG]);
  if (y) return wZ.createElement(WI1, {
    onDone: () => {
      v(!1)
    },
    toolUseContext: p(X, [], new AbortController, [], void 0, k)
  });
  let sA = {
      multiline: !0,
      onSubmit: sQ,
      onChange: zQ,
      value: KA ? et(typeof KA === "string" ? KA : KA.display) : K,
      onHistoryUp: f0,
      onHistoryDown: G0,
      onHistoryReset: W1,
      placeholder: s8,
      onExit: x,
      onExitMessage: (M1, k1) => FA({
        show: M1,
        key: k1
      }),
      onImagePaste: K5,
      columns: aG,
      disableCursorMovementForUpDownKeys: K0.length > 0,
      cursorOffset: zA,
      onChangeCursorOffset: NA,
      onPaste: g6,
      onIsPastingChange: $A,
      focus: H !== "memorySelect" && !e,
      showCursor: H !== "memorySelect" && !EA && !e,
      argumentHint: e2,
      onUndo: p0 ? () => {
        let M1 = g0();
        if (M1) D(M1.text), NA(M1.cursorOffset), N(M1.pastedContents)
      } : void 0,
      highlights: t1
    },
    E1 = () => {
      let M1 = {
        bash: "bashBorder",
        memory: "remember",
        memorySelect: "remember",
        background: "background"
      };
      if (M1[H]) return M1[H];
      return OA.thinkingEnabled ? "suggestion" : "promptBorder"
    };
  if (TA) return wZ.createElement(S, {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: E1(),
    borderDimColor: H !== "memory",
    borderStyle: "round",
    borderLeft: !1,
    borderRight: !1,
    borderBottom: !0,
    width: "100%"
  }, wZ.createElement($, {
    dimColor: !0,
    italic: !0
  }, "Save and close editor to continue..."));
  return wZ.createElement(S, {
    flexDirection: "column",
    marginTop: 1
  }, wZ.createElement(l89, null), wZ.createElement(S, {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderColor: E1(),
    borderDimColor: H !== "memory",
    borderStyle: "round",
    borderLeft: !1,
    borderRight: !1,
    borderBottom: !0,
    width: "100%"
  }, wZ.createElement(c89, {
    mode: H,
    isLoading: J
  }), wZ.createElement(S, {
    flexGrow: 1,
    flexShrink: 1
  }, dXA() ? wZ.createElement(gJ0, {
    ...sA,
    initialMode: R,
    onModeChange: T,
    isLoading: J
  }) : wZ.createElement(s4, {
    ...sA
  }))), H === "memorySelect" && wZ.createElement(hZ1, {
    onSelect: (M1) => {
      sQ(K, !1, M1)
    },
    onCancel: () => {
      C("memory")
    }
  }), wZ.createElement(LQ9, {
    apiKeyStatus: Z,
    debug: A,
    exitMessage: IA,
    vimMode: R,
    mode: H,
    autoUpdaterResult: F,
    isAutoUpdating: m,
    verbose: W,
    onAutoUpdaterResult: V,
    onChangeIsUpdating: o,
    suggestions: K0,
    selectedSuggestion: mB,
    toolPermissionContext: B,
    helpOpen: X1,
    suppressHint: K.length > 0,
    tasksSelected: EA,
    ideSelection: Q,
    mcpClients: q,
    isPasting: DA,
    isInputWrapped: U1,
    messages: X,
    isSearching: e,
    historyQuery: wA,
    setHistoryQuery: qA,
    historyFailedMatch: yA,
    shouldShowSearchHint: C0
  }))
}
// @from(Start 13521008, End 13521010)
wZ
// @from(Start 13521012, End 13521014)
aJ
// @from(Start 13521016, End 13521019)
G69
// @from(Start 13521025, End 13521402)
Z69 = L(() => {
  hA();
  ET();
  Y09();
  AQ9();
  jQ();
  zp();
  ZY();
  GQ9();
  tPA();
  i8();
  ePA();
  cK();
  _0();
  MQ9();
  nJ0();
  wsA();
  q0();
  rsA();
  Up();
  PQ9();
  U2();
  SQ9();
  CU();
  fW0();
  BZ0();
  CU();
  z9();
  o7A();
  b89();
  d89();
  p89();
  i89();
  RQA();
  t89();
  EU();
  Q69();
  wZ = BA(VA(), 1), aJ = BA(VA(), 1);
  G69 = rP3
})
// @from(Start 13521405, End 13521580)
function Y69() {
  I69.useEffect(() => {
    let A = Math.round(process.uptime() * 1000);
    GA("tengu_timer", {
      event: "startup",
      durationMs: A
    })
  }, [])
}
// @from(Start 13521585, End 13521588)
I69
// @from(Start 13521594, End 13521640)
J69 = L(() => {
  q0();
  I69 = BA(VA(), 1)
})
// @from(Start 13521643, End 13522226)
function W69() {
  let [A, Q] = LjA.useState(() => {
    let I = Kw();
    if (!JU() || BB()) return "valid";
    if (I) return "loading";
    return "missing"
  }), [B, G] = LjA.useState(null), Z = LjA.useCallback(async () => {
    if (!JU() || BB()) {
      Q("valid");
      return
    }
    let I = Kw();
    if (!I) {
      Q("missing");
      return
    }
    try {
      let J = await V69(I, !1) ? "valid" : "invalid";
      Q(J);
      return
    } catch (Y) {
      G(Y), Q("error");
      return
    }
  }, []);
  return {
    status: A,
    reverify: Z,
    error: B
  }
}
// @from(Start 13522231, End 13522234)
LjA
// @from(Start 13522240, End 13522294)
X69 = L(() => {
  fZ();
  gB();
  LjA = BA(VA(), 1)
})
// @from(Start 13522297, End 13522576)
function F69(A) {
  let [Q, B] = OQ();
  f1((G, Z) => {
    if (Z.ctrl && G === "t") GA("tengu_toggle_todos", {
      is_expanded: Q.showExpandedTodos,
      has_todos: A && A.length > 0
    }), B((I) => ({
      ...I,
      showExpandedTodos: !I.showExpandedTodos
    }))
  })
}
// @from(Start 13522581, End 13522622)
K69 = L(() => {
  hA();
  z9();
  q0()
})
// @from(Start 13522625, End 13523016)
function D69(A, Q, B, G, Z, I, Y, J, W) {
  let [{
    queuedCommands: X
  }] = OQ();
  f1((V, F) => {
    if (!F.escape) return;
    if (G === "transcript") return;
    if (W) return;
    if (Z?.aborted) return;
    if (!Z) return;
    if (B) return;
    if (dXA() && Y === "INSERT") return;
    if (X.length > 0) {
      if (I) I()
    }
    GA("tengu_cancel", {}), A(() => []), Q()
  })
}
// @from(Start 13523021, End 13523071)
H69 = L(() => {
  hA();
  q0();
  tPA();
  z9()
})
// @from(Start 13523074, End 13523118)
function FI1(A) {
  return oP3.includes(A)
}
// @from(Start 13523120, End 13523289)
function KI1(A, Q, B, G) {
  if (!A.toolDecisions) A.toolDecisions = new Map;
  A.toolDecisions.set(Q, {
    source: G,
    decision: B,
    timestamp: Date.now()
  })
}
// @from(Start 13523291, End 13523588)
function DI1(A, Q, B, G) {
  let Z;
  if (A.getPath && Q) {
    let I = A.inputSchema.safeParse(Q);
    if (I.success) {
      let Y = A.getPath(I.data);
      if (Y) Z = vWA(Y)
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
// @from(Start 13523589, End 13523704)
async function HI1(A, Q, B) {
  await HO("tool_decision", {
    decision: Q,
    source: B,
    tool_name: A
  })
}
// @from(Start 13523706, End 13524031)
function C69(A, Q, B, G, Z) {
  if (GA("tengu_tool_use_granted_in_config", {
      messageID: G,
      toolName: A.name,
      sandboxEnabled: nQ.isSandboxingEnabled()
    }), FI1(A.name)) {
    let I = DI1(A, Q, "accept", "config");
    wFA()?.add(1, I)
  }
  KI1(B, Z, "accept", "config"), HI1(A.name, "accept", "config")
}
// @from(Start 13524033, End 13524194)
function tP3(A) {
  switch (A.type) {
    case "hook":
      return "hook";
    case "user":
      return A.permanent ? "user_permanent" : "user_temporary"
  }
}
// @from(Start 13524196, End 13524890)
function E69(A, Q, B, G, Z, I) {
  switch (I.type) {
    case "user":
      GA(I.permanent ? "tengu_tool_use_granted_in_prompt_permanent" : "tengu_tool_use_granted_in_prompt_temporary", {
        messageID: G,
        toolName: A.name,
        sandboxEnabled: nQ.isSandboxingEnabled()
      });
      break;
    case "hook":
      GA("tengu_tool_use_granted_by_permission_hook", {
        messageID: G,
        toolName: A.name,
        sandboxEnabled: nQ.isSandboxingEnabled(),
        permanent: I.permanent ?? !1
      });
      break
  }
  let Y = tP3(I);
  if (FI1(A.name)) {
    let J = DI1(A, Q, "accept", Y);
    wFA()?.add(1, J)
  }
  KI1(B, Z, "accept", Y), HI1(A.name, "accept", Y)
}
// @from(Start 13524892, End 13525513)
function uW0(A, Q, B, G, Z, I) {
  let Y = I.type === "hook",
    J = Y ? "hook" : I.type;
  if (Y) GA("tengu_tool_use_rejected_in_prompt", {
    messageID: G,
    toolName: A.name,
    sandboxEnabled: nQ.isSandboxingEnabled(),
    isHook: !0
  });
  else {
    let W = I.type === "user_reject" ? I.hasFeedback : !1;
    GA("tengu_tool_use_rejected_in_prompt", {
      messageID: G,
      toolName: A.name,
      sandboxEnabled: nQ.isSandboxingEnabled(),
      hasFeedback: W
    })
  }
  if (FI1(A.name)) {
    let W = DI1(A, Q, "reject", J);
    wFA()?.add(1, W)
  }
  KI1(B, Z, "reject", J), HI1(A.name, "reject", J)
}
// @from(Start 13525515, End 13531251)
function eP3(A, Q) {
  return z69.useCallback(async (B, G, Z, I, Y, J) => {
    return new Promise((W) => {
      function X() {
        GA("tengu_tool_use_cancelled", {
          messageID: I.message.id,
          toolName: B.name
        })
      }

      function V(K) {
        let D = K ? `${JjA}${K}` : XjA;
        if (W({
            behavior: "ask",
            message: D
          }), !K) Z.abortController.abort("tool-rejection")
      }
      if (Z.abortController.signal.aborted) {
        X(), V();
        return
      }
      return (J !== void 0 ? Promise.resolve(J) : M$(B, G, Z, I, Y)).then(async (K) => {
        if (K.behavior === "allow") {
          C69(B, G, Z, I.message.id, Y), W({
            ...K,
            updatedInput: G,
            userModified: !1
          });
          return
        }
        let D = await Z.getAppState(),
          H = await B.description(G, {
            isNonInteractiveSession: Z.options.isNonInteractiveSession,
            toolPermissionContext: D.toolPermissionContext,
            tools: Z.options.tools
          });
        if (Z.abortController.signal.aborted) {
          X(), V();
          return
        }
        switch (K.behavior) {
          case "deny": {
            if (GA("tengu_tool_use_denied_in_config", {
                messageID: I.message.id,
                toolName: B.name,
                sandboxEnabled: nQ.isSandboxingEnabled()
              }), FI1(B.name)) {
              let C = DI1(B, G, "reject", "config");
              wFA()?.add(1, C)
            }
            KI1(Z, Y, "reject", "config"), HI1(B.name, "reject", "config"), W(K);
            return
          }
          case "ask": {
            let C = !1;
            A((U) => [...U, {
              assistantMessage: I,
              tool: B,
              description: H,
              input: G,
              toolUseContext: Z,
              toolUseID: Y,
              permissionResult: K,
              onAbort() {
                if (C) return;
                C = !0, X(), uW0(B, G, Z, I.message.id, Y, {
                  type: "user_abort"
                }), V()
              },
              async onAllow(q, w) {
                if (C) return;
                C = !0, QKA(w);
                let N = await Z.getAppState(),
                  R = jm(N.toolPermissionContext, w);
                Q(R);
                let T = w.some((v) => WxA(v.destination));
                E69(B, q, Z, I.message.id, Y, {
                  type: "user",
                  permanent: T
                });
                let y = B.inputsEquivalent ? !B.inputsEquivalent(G, q) : !1;
                W({
                  behavior: "allow",
                  updatedInput: q,
                  userModified: y
                })
              },
              onReject(q) {
                if (C) return;
                C = !0, uW0(B, G, Z, I.message.id, Y, {
                  type: "user_reject",
                  hasFeedback: !!q
                }), V(q)
              },
              async recheckPermission() {
                if (C) return;
                let q = await M$(B, G, Z, I, Y);
                if (q.behavior === "allow") A((w) => w.filter((N) => N.toolUseID !== Y)), C69(B, G, Z, I.message.id, Y), C = !0, W({
                  behavior: "allow",
                  updatedInput: q.updatedInput || G,
                  userModified: !1
                })
              }
            }]);
            let E = await Z.getAppState();
            (async () => {
              for await (let U of SYA([mW0(B.name, Y, G, Z, E.toolPermissionContext.mode, K.suggestions, Z.abortController.signal)])) {
                if (C) return;
                if (U.permissionRequestResult && (U.permissionRequestResult.behavior === "allow" || U.permissionRequestResult.behavior === "deny")) {
                  C = !0, A((w) => w.filter((N) => N.toolUseID !== Y));
                  let q = U.permissionRequestResult;
                  if (q.behavior === "allow") {
                    let w = q.updatedInput || G,
                      N = q.updatedPermissions ?? [];
                    if (N.length > 0) {
                      QKA(N);
                      let T = await Z.getAppState(),
                        y = jm(T.toolPermissionContext, N);
                      Q(y)
                    }
                    let R = N.some((T) => WxA(T.destination));
                    E69(B, w, Z, I.message.id, Y, {
                      type: "hook",
                      permanent: R
                    }), W({
                      behavior: "allow",
                      updatedInput: w,
                      userModified: !1,
                      decisionReason: {
                        type: "hook",
                        hookName: "PermissionRequest"
                      }
                    });
                    return
                  } else if (q.behavior === "deny") {
                    if (uW0(B, G, Z, I.message.id, Y, {
                        type: "hook"
                      }), W({
                        behavior: "deny",
                        message: q.message || "Permission denied by hook",
                        decisionReason: {
                          type: "hook",
                          hookName: "PermissionRequest",
                          reason: q.message
                        }
                      }), q.interrupt) Z.abortController.abort("tool-rejection");
                    return
                  }
                }
              }
            })();
            return
          }
        }
      }).catch((K) => {
        if (K instanceof WW) X(), V();
        else AA(K)
      })
    })
  }, [A, Q])
}
// @from(Start 13531256, End 13531259)
z69
// @from(Start 13531261, End 13531264)
oP3
// @from(Start 13531266, End 13531269)
U69
// @from(Start 13531275, End 13531464)
$69 = L(() => {
  AZ();
  q0();
  cQ();
  RZ();
  g1();
  _0();
  oJA();
  R9();
  cK();
  $J();
  YO();
  _i();
  z69 = BA(VA(), 1), oP3 = ["Edit", "Write", "NotebookEdit"];
  U69 = eP3
})
// @from(Start 13531467, End 13531608)
function q69(A) {
  return w69.useMemo(() => {
    let Q = Ae(A);
    return {
      level: Q.level,
      tokens: Q.tokens
    }
  }, [A])
}
// @from(Start 13531613, End 13531616)
w69
// @from(Start 13531622, End 13531668)
N69 = L(() => {
  CU();
  w69 = BA(VA(), 1)
})
// @from(Start 13531670, End 13531958)
async function L69({
  getAppState: A,
  setAppState: Q,
  executeInput: B
}) {
  let G = await a89(A, Q);
  if (G.length === 0) return !1;
  let Z = G.map((I) => I.value).filter((I) => typeof I === "string").join(`
`);
  if (Z.length === 0) return !1;
  return await B(Z, "prompt"), !0
}
// @from(Start 13531963, End 13531989)
M69 = L(() => {
  RQA()
})
// @from(Start 13531992, End 13532027)
function Aj3() {
  Zo1(""), l5(0)
}
// @from(Start 13532028, End 13534291)
async function dW0(A) {
  let {
    input: Q,
    memoryPath: B,
    helpers: G,
    isLoading: Z,
    mode: I,
    commands: Y,
    onInputChange: J,
    onModeChange: W,
    setPastedContents: X,
    onSubmitCountChange: V,
    setIDESelection: F,
    setIsLoading: K,
    setToolJSX: D,
    getToolUseContext: H,
    messages: C,
    mainLoopModel: E,
    pastedContents: U,
    ideSelection: q,
    setUserInputOnProcessing: w,
    setAbortController: N,
    onQuery: R,
    resetLoadingState: T,
    thinkingTokens: y,
    thinkingEnabled: v,
    getAppState: x,
    setAppState: p,
    onBeforeQuery: u
  } = A, {
    setCursorOffset: e,
    clearBuffer: l,
    resetHistory: k
  } = G;
  if (Q.trim() === "") return;
  if (["exit", "quit", ":q", ":q!", ":wq", ":wq!"].includes(Q.trim())) {
    if (Y.find((zA) => zA.name === "exit")) dW0({
      ...A,
      input: "/exit"
    });
    else Aj3();
    return
  }
  let m = Q,
    o = mMB(Q),
    IA = 0;
  for (let FA of o) {
    let zA = U[FA.id];
    if (zA && zA.type === "text") m = m.replace(FA.match, zA.content), IA++
  }
  if (GA("tengu_paste_text", {
      pastedTextCount: IA
    }), I === "memory") {
    W("memorySelect");
    return
  }
  if (Z) {
    if (I !== "prompt" && I !== "memorySelect") return;
    if (I === "memorySelect" && B) {
      let FA = o9(),
        zA = H(C, [], FA, [], void 0, E);
      TP({
        input: m,
        mode: "memorySelect",
        setIsLoading: K,
        setToolJSX: D,
        context: zA,
        memoryPath: B,
        messages: C
      }), W("prompt")
    }
    XI1({
      value: m,
      mode: "prompt"
    }, p), J(""), e(0), X({}), k(), l();
    return
  }
  J(""), e(0), W("prompt"), X({}), F(void 0), V((FA) => FA + 1), l(), sP2(), await O69({
    input: m,
    mode: I,
    messages: C,
    mainLoopModel: E,
    pastedContents: U,
    ideSelection: q,
    memoryPath: B,
    thinkingTokens: y,
    thinkingEnabled: v,
    querySource: A.querySource,
    getAppState: x,
    commands: Y,
    isLoading: Z,
    setIsLoading: K,
    setToolJSX: D,
    getToolUseContext: H,
    setUserInputOnProcessing: w,
    setAbortController: N,
    onQuery: R,
    resetLoadingState: T,
    setAppState: p,
    onBeforeQuery: u,
    resetHistory: k
  })
}
// @from(Start 13534292, End 13536301)
async function O69(A) {
  let {
    input: Q,
    mode: B,
    messages: G,
    mainLoopModel: Z,
    pastedContents: I,
    ideSelection: Y,
    memoryPath: J,
    thinkingTokens: W,
    thinkingEnabled: X,
    querySource: V,
    getAppState: F,
    isLoading: K,
    setIsLoading: D,
    setToolJSX: H,
    getToolUseContext: C,
    setUserInputOnProcessing: E,
    setAbortController: U,
    onQuery: q,
    setAppState: w,
    onBeforeQuery: N,
    resetHistory: R
  } = A, T = !K, y = o9();
  if (T) U(y);
  try {
    let v = Qj3(B, W, Q, X);
    s7("query_process_user_input_start");
    let {
      messages: x,
      shouldQuery: p,
      allowedTools: u,
      skipHistory: e,
      maxThinkingTokens: l,
      model: k
    } = await TP({
      input: Q,
      mode: B,
      setIsLoading: D,
      setToolJSX: H,
      context: C(G, [], y, [], void 0, Z),
      pastedContents: I,
      ideSelection: Y,
      memoryPath: J,
      messages: G,
      setUserInputOnProcessing: E,
      isAlreadyProcessing: K,
      thinkingMetadata: v,
      querySource: V
    });
    if (s7("query_process_user_input_end"), EG()) s7("query_file_history_snapshot_start"), x.filter(yn).forEach((m) => {
      yYA((o) => {
        w((IA) => ({
          ...IA,
          fileHistory: o(IA.fileHistory)
        }))
      }, m.uuid)
    }), s7("query_file_history_snapshot_end");
    if (H(null), x.length) {
      for (let IA of x)
        if (IA.type === "user") Jf({
          display: pMB(Q, B),
          pastedContents: I
        }), R();
      if ((await q(x, y, p, u ?? [], k ?? Z, l, B === "prompt" ? N : void 0, Q)).status === "completed") await L69({
        getAppState: F,
        setAppState: w,
        executeInput: async (IA, FA) => {
          await O69({
            ...A,
            input: IA,
            mode: FA
          })
        }
      })
    } else {
      if (!e) Jf({
        display: Q,
        pastedContents: I
      });
      if (R(), !K) U(null)
    }
  } finally {
    D(!1)
  }
}
// @from(Start 13536303, End 13536599)
function Qj3(A, Q, B, G) {
  if (A !== "prompt") return;
  let Z = Q > 0,
    I = Z ? XrA(B) : [],
    Y = !G && !Z;
  return {
    level: Y ? "none" : "high",
    disabled: Y,
    triggers: I.map((W) => ({
      start: W.start,
      end: W.end,
      text: B.slice(W.start, W.end)
    }))
  }
}
// @from(Start 13536604, End 13536731)
R69 = L(() => {
  RQA();
  M69();
  zp();
  o7A();
  q0();
  OZ();
  CU();
  AWA();
  sU();
  zTA();
  Bh();
  kW();
  fRA()
})
// @from(Start 13536734, End 13536883)
function P69(A, Q) {
  return T69.useMemo(() => {
    if (A && Q && Q.length > 0) return U9A([...A, ...Q], "name");
    return A || []
  }, [A, Q])
}
// @from(Start 13536888, End 13536891)
T69
// @from(Start 13536897, End 13536944)
j69 = L(() => {
  MxA();
  T69 = BA(VA(), 1)
})
// @from(Start 13536947, End 13537058)
function S69(A, Q) {
  if (Q) return A ? `agent:builtin:${A}` : "agent:default";
  else return "agent:custom"
}
// @from(Start 13537060, End 13537252)
function MjA() {
  let Q = l0()?.outputStyle ?? wK;
  if (Q === wK) return "repl_main_thread";
  return Q in TQA ? `repl_main_thread:outputStyle:${Q}` : "repl_main_thread:outputStyle:custom"
}
// @from(Start 13537257, End 13537290)
cW0 = L(() => {
  MB();
  Gx()
})
// @from(Start 13537293, End 13537418)
function CI1(A, Q) {
  return _69.useMemo(() => {
    if (bZ()) return A;
    return U9A([...A, ...Q], "name")
  }, [A, Q])
}
// @from(Start 13537423, End 13537426)
_69
// @from(Start 13537432, End 13537487)
pW0 = L(() => {
  MxA();
  dH();
  _69 = BA(VA(), 1)
})
// @from(Start 13537490, End 13537623)
function lW0(A, Q) {
  return k69.useMemo(() => {
    if (Q.length > 0) return U9A([...A, ...Q], "name");
    return A
  }, [A, Q])
}
// @from(Start 13537628, End 13537631)
k69
// @from(Start 13537637, End 13537684)
y69 = L(() => {
  MxA();
  k69 = BA(VA(), 1)
})
// @from(Start 13537686, End 13538426)
async function Fa(A, Q, B) {
  let G = A;
  return await Promise.all([...A.matchAll(Bj3), ...A.matchAll(Gj3)].map(async (Z) => {
    let I = Z[1]?.trim();
    if (I) try {
      let Y = await M$(D9, {
        command: I
      }, Q, uD({
        content: []
      }), "");
      if (Y.behavior !== "allow") throw g(`Bash command permission check failed for command in ${B}: ${I}. Error: ${Y.message}`), new oj(`Bash command permission check failed for pattern "${Z[0]}": ${Y.message||"Permission denied"}`);
      let {
        data: J
      } = await D9.call({
        command: I
      }, Q), W = x69(J.stdout, J.stderr);
      G = G.replace(Z[0], W)
    } catch (Y) {
      if (Y instanceof oj) throw Y;
      Zj3(Y, Z[0])
    }
  })), G
}
// @from(Start 13538428, End 13538638)
function x69(A, Q, B = !1) {
  let G = [];
  if (A.trim()) G.push(A.trim());
  if (Q.trim())
    if (B) G.push(`[stderr: ${Q.trim()}]`);
    else G.push(`[stderr]
${Q.trim()}`);
  return G.join(B ? " " : `
`)
}
// @from(Start 13538640, End 13539029)
function Zj3(A, Q, B = !1) {
  if (A instanceof tj) {
    if (A.interrupted) throw new oj(`Bash command interrupted for pattern "${Q}": [Command interrupted]`);
    let I = x69(A.stdout, A.stderr, B);
    throw new oj(`Bash command failed for pattern "${Q}": ${I}`)
  }
  let G = A instanceof Error ? A.message : String(A),
    Z = B ? `[Error: ${G}]` : `[Error]
${G}`;
  throw new oj(Z)
}
// @from(Start 13539034, End 13539037)
Bj3
// @from(Start 13539039, End 13539042)
Gj3
// @from(Start 13539048, End 13539175)
OjA = L(() => {
  pF();
  RZ();
  V0();
  AZ();
  cQ();
  Bj3 = /```!\s*\n?([\s\S]*?)\n?```/g, Gj3 = /(?<!\w|\$)!`([^`]+)`/g
})
// @from(Start 13539252, End 13539308)
function EI1(A) {
  return /^skill\.md$/i.test(rXA(A))
}
// @from(Start 13539310, End 13539798)
function Jj3(A, Q, B) {
  if (EI1(A)) {
    let Z = Ka(A),
      I = Ka(Z),
      Y = rXA(Z),
      J = I.startsWith(Q) ? I.slice(Q.length).replace(/^\//, "") : "",
      W = J ? J.split("/").join(":") : "";
    return W ? `${B}:${W}:${Y}` : `${B}:${Y}`
  } else {
    let Z = Ka(A),
      I = rXA(A).replace(/\.md$/, ""),
      Y = Z.startsWith(Q) ? Z.slice(Q.length).replace(/^\//, "") : "",
      J = Y ? Y.split("/").join(":") : "";
    return J ? `${B}:${J}:${I}` : `${B}:${I}`
  }
}
// @from(Start 13539800, End 13541072)
function Wj3(A, Q) {
  let B = [],
    G = RA();

  function Z(I) {
    try {
      let Y = G.readdirSync(I);
      if (Y.some((W) => W.isFile() && EI1(W.name))) {
        for (let W of Y)
          if (W.isFile() && W.name.toLowerCase().endsWith(".md")) {
            let X = sXA(I, W.name),
              V = G.readFileSync(X, {
                encoding: "utf-8"
              }),
              {
                frontmatter: F,
                content: K
              } = NV(V);
            B.push({
              filePath: X,
              baseDir: Q,
              frontmatter: F,
              content: K
            })
          } return
      }
      for (let W of Y) {
        let X = sXA(I, W.name);
        if (W.isDirectory()) Z(X);
        else if (W.isFile() && W.name.toLowerCase().endsWith(".md")) {
          let V = G.readFileSync(X, {
              encoding: "utf-8"
            }),
            {
              frontmatter: F,
              content: K
            } = NV(V);
          B.push({
            filePath: X,
            baseDir: Q,
            frontmatter: F,
            content: K
          })
        }
      }
    } catch (Y) {
      g(`Failed to scan directory ${I}: ${Y}`, {
        level: "error"
      })
    }
  }
  return Z(A), B
}
// @from(Start 13541074, End 13541494)
function Xj3(A) {
  let Q = new Map;
  for (let G of A) {
    let Z = Ka(G.filePath),
      I = Q.get(Z) ?? [];
    I.push(G), Q.set(Z, I)
  }
  let B = [];
  for (let [G, Z] of Q) {
    let I = Z.filter((Y) => EI1(Y.filePath));
    if (I.length > 0) {
      let Y = I[0];
      if (I.length > 1) g(`Multiple skill files found in ${G}, using ${rXA(Y.filePath)}`);
      B.push(Y)
    } else B.push(...Z)
  }
  return B
}
// @from(Start 13541495, End 13541758)
async function v69(A, Q, B, G, Z, I = {
  isSkillMode: !1
}) {
  let Y = Wj3(A, A),
    J = Xj3(Y),
    W = [];
  for (let X of J) {
    let V = Jj3(X.filePath, X.baseDir, Q),
      F = RjA(V, X, B, G, Z, EI1(X.filePath), I);
    if (F) W.push(F)
  }
  return W
}
// @from(Start 13541760, End 13543811)
function RjA(A, Q, B, G, Z, I, Y = {
  isSkillMode: !1
}) {
  try {
    let {
      frontmatter: J,
      content: W
    } = Q, X = J.description ?? Wx(W, I ? "Plugin skill" : "Plugin command"), V = UO(J["allowed-tools"]), F = J["argument-hint"], K = J.when_to_use, D = J.version, H = J.name, C = J.model === "inherit" ? void 0 : J.model, E = J["disable-model-invocation"], U;
    if (Y.isSkillMode) U = E === void 0 ? !1 : Y0(E);
    else U = Y0(E);
    let q = Y.isSkillMode ? Yj3 : Ij3,
      w = `${X} (${q}:${B})`,
      N = Y.isSkillMode ? !0 : !1;
    return {
      type: "prompt",
      name: A,
      description: w,
      hasUserSpecifiedDescription: !!J.description,
      allowedTools: V,
      argumentHint: F,
      whenToUse: K,
      version: D,
      model: C,
      isSkill: I || Y.isSkillMode,
      disableModelInvocation: U,
      source: "plugin",
      pluginInfo: {
        pluginManifest: G,
        repository: B
      },
      isEnabled: () => !0,
      isHidden: N,
      progressMessage: I || Y.isSkillMode ? "loading" : "running",
      userFacingName() {
        return H || A
      },
      async getPromptForCommand(R, T) {
        let y = Y.isSkillMode ? `Base directory for this skill: ${Ka(Q.filePath)}

${W}` : W;
        if (R)
          if (y.includes("$ARGUMENTS")) y = y.replaceAll("$ARGUMENTS", R);
          else y = y + `

ARGUMENTS: ${R}`;
        return y = R10(y, Z), y = await Fa(y, {
          ...T,
          async getAppState() {
            let v = await T.getAppState();
            return {
              ...v,
              toolPermissionContext: {
                ...v.toolPermissionContext,
                alwaysAllowRules: {
                  ...v.toolPermissionContext.alwaysAllowRules,
                  command: V
                }
              }
            }
          }
        }, `/${A}`), [{
          type: "text",
          text: y
        }]
      }
    }
  } catch (J) {
    return g(`Failed to create command from ${Q.filePath}: ${J}`, {
      level: "error"
    }), null
  }
}
// @from(Start 13543813, End 13543854)
function zI1() {
  PQA.cache?.clear?.()
}
// @from(Start 13543855, End 13545492)
async function b69(A, Q, B, G, Z) {
  let I = RA(),
    Y = [];
  try {
    if (!I.existsSync(A)) return [];
    let J = sXA(A, "SKILL.md");
    if (I.existsSync(J)) {
      try {
        let X = I.readFileSync(J, {
            encoding: "utf-8"
          }),
          {
            frontmatter: V,
            content: F
          } = NV(X),
          K = `${Q}:${rXA(A)}`,
          D = {
            filePath: J,
            baseDir: Ka(J),
            frontmatter: V,
            content: F
          },
          H = RjA(K, D, B, G, Z, !0, {
            isSkillMode: !0
          });
        if (H) Y.push(H)
      } catch (X) {
        g(`Failed to load skill from ${J}: ${X}`, {
          level: "error"
        })
      }
      return Y
    }
    let W = I.readdirSync(A);
    for (let X of W) {
      if (!X.isDirectory() && !X.isSymbolicLink()) continue;
      let V = sXA(A, X.name),
        F = sXA(V, "SKILL.md");
      if (I.existsSync(F)) try {
        let K = I.readFileSync(F, {
            encoding: "utf-8"
          }),
          {
            frontmatter: D,
            content: H
          } = NV(K),
          C = `${Q}:${X.name}`,
          E = {
            filePath: F,
            baseDir: Ka(F),
            frontmatter: D,
            content: H
          },
          U = RjA(C, E, B, G, Z, !0, {
            isSkillMode: !0
          });
        if (U) Y.push(U)
      } catch (K) {
        g(`Failed to load skill from ${F}: ${K}`, {
          level: "error"
        })
      }
    }
  } catch (J) {
    g(`Failed to load skills from directory ${A}: ${J}`, {
      level: "error"
    })
  }
  return Y
}
// @from(Start 13545494, End 13545535)
function f69() {
  iW0.cache?.clear?.()
}
// @from(Start 13545540, End 13545554)
Ij3 = "plugin"
// @from(Start 13545558, End 13545572)
Yj3 = "plugin"
// @from(Start 13545576, End 13545579)
PQA
// @from(Start 13545581, End 13545584)
iW0
// @from(Start 13545590, End 13551447)
TjA = L(() => {
  l2();
  AQ();
  fV();
  V0();
  OjA();
  _y();
  hQ();
  T10();
  PQA = s1(async () => {
    let {
      enabled: A,
      errors: Q
    } = await l7(), B = [];
    if (Q.length > 0) g(`Plugin loading errors: ${Q.map((G)=>oM(G)).join(", ")}`);
    for (let G of A) {
      if (G.commandsPath) try {
        let Z = await v69(G.commandsPath, G.name, G.source, G.manifest, G.path);
        if (B.push(...Z), Z.length > 0) g(`Loaded ${Z.length} commands from plugin ${G.name} default directory`)
      } catch (Z) {
        g(`Failed to load commands from plugin ${G.name} default directory: ${Z}`, {
          level: "error"
        })
      }
      if (G.commandsPaths) {
        g(`Plugin ${G.name} has commandsPaths: ${G.commandsPaths.join(", ")}`);
        for (let Z of G.commandsPaths) try {
          let I = RA(),
            Y = I.statSync(Z);
          if (g(`Checking commandPath ${Z} - isDirectory: ${Y.isDirectory()}, isFile: ${Y.isFile()}`), Y.isDirectory()) {
            let J = await v69(Z, G.name, G.source, G.manifest, G.path);
            if (B.push(...J), J.length > 0) g(`Loaded ${J.length} commands from plugin ${G.name} custom path: ${Z}`);
            else g(`Warning: No commands found in plugin ${G.name} custom directory: ${Z}. Expected .md files or SKILL.md in subdirectories.`, {
              level: "warn"
            })
          } else if (Y.isFile() && Z.endsWith(".md")) {
            let J = I.readFileSync(Z, {
                encoding: "utf-8"
              }),
              {
                frontmatter: W,
                content: X
              } = NV(J),
              V, F;
            if (G.commandsMetadata) {
              for (let [C, E] of Object.entries(G.commandsMetadata))
                if (E.source) {
                  let U = sXA(G.path, E.source);
                  if (Z === U) {
                    V = `${G.name}:${C}`, F = E;
                    break
                  }
                }
            }
            if (!V) V = `${G.name}:${rXA(Z).replace(/\.md$/,"")}`;
            let K = F ? {
                ...W,
                ...F.description && {
                  description: F.description
                },
                ...F.argumentHint && {
                  "argument-hint": F.argumentHint
                },
                ...F.model && {
                  model: F.model
                },
                ...F.allowedTools && {
                  "allowed-tools": F.allowedTools.join(",")
                }
              } : W,
              D = {
                filePath: Z,
                baseDir: Ka(Z),
                frontmatter: K,
                content: X
              },
              H = RjA(V, D, G.source, G.manifest, G.path, !1);
            if (H) B.push(H), g(`Loaded command from plugin ${G.name} custom file: ${Z}${F?" (with metadata override)":""}`)
          }
        } catch (I) {
          g(`Failed to load commands from plugin ${G.name} custom path ${Z}: ${I}`, {
            level: "error"
          })
        }
      }
      if (G.commandsMetadata) {
        for (let [Z, I] of Object.entries(G.commandsMetadata))
          if (I.content && !I.source) try {
            let {
              frontmatter: Y,
              content: J
            } = NV(I.content), W = {
              ...Y,
              ...I.description && {
                description: I.description
              },
              ...I.argumentHint && {
                "argument-hint": I.argumentHint
              },
              ...I.model && {
                model: I.model
              },
              ...I.allowedTools && {
                "allowed-tools": I.allowedTools.join(",")
              }
            }, X = `${G.name}:${Z}`, V = {
              filePath: `<inline:${X}>`,
              baseDir: G.path,
              frontmatter: W,
              content: J
            }, F = RjA(X, V, G.source, G.manifest, G.path, !1);
            if (F) B.push(F), g(`Loaded inline content command from plugin ${G.name}: ${X}`)
          } catch (Y) {
            g(`Failed to load inline content command ${Z} from plugin ${G.name}: ${Y}`, {
              level: "error"
            })
          }
      }
    }
    return g(`Total plugin commands loaded: ${B.length}`), B
  });
  iW0 = s1(async () => {
    g(">>>>> getPluginSkills CALLED <<<<<");
    let {
      enabled: A,
      errors: Q
    } = await l7(), B = [];
    if (Q.length > 0) g(`Plugin loading errors: ${Q.map((G)=>oM(G)).join(", ")}`);
    g(`getPluginSkills: Processing ${A.length} enabled plugins`);
    for (let G of A) {
      if (g(`Checking plugin ${G.name}: skillsPath=${G.skillsPath?"exists":"none"}, skillsPaths=${G.skillsPaths?G.skillsPaths.length:0} paths`), G.skillsPath) {
        g(`Attempting to load skills from plugin ${G.name} default skillsPath: ${G.skillsPath}`);
        try {
          let Z = await b69(G.skillsPath, G.name, G.source, G.manifest, G.path);
          B.push(...Z), g(`Loaded ${Z.length} skills from plugin ${G.name} default directory`)
        } catch (Z) {
          g(`Failed to load skills from plugin ${G.name} default directory: ${Z}`, {
            level: "error"
          })
        }
      }
      if (G.skillsPaths) {
        g(`Attempting to load skills from plugin ${G.name} skillsPaths: ${G.skillsPaths.join(", ")}`);
        for (let Z of G.skillsPaths) try {
          g(`Loading from skillPath: ${Z} for plugin ${G.name}`);
          let I = await b69(Z, G.name, G.source, G.manifest, G.path);
          B.push(...I), g(`Loaded ${I.length} skills from plugin ${G.name} custom path: ${Z}`)
        } catch (I) {
          g(`Failed to load skills from plugin ${G.name} custom path ${Z}: ${I}`, {
            level: "error"
          })
        }
      }
    }
    return g(`Total plugin skills loaded: ${B.length}`), B
  })
})
// @from(Start 13551450, End 13553331)
function $I1() {
  let [, A] = OQ(), Q = UI1.useCallback(async () => {
    try {
      let {
        enabled: B,
        disabled: G,
        errors: Z
      } = await l7(), I = [], Y = [];
      try {
        I = await PQA()
      } catch (J) {
        let W = J instanceof Error ? J.message : String(J);
        Z.push({
          type: "generic-error",
          source: "plugin-commands",
          error: `Failed to load plugin commands: ${W}`
        })
      }
      try {
        Y = await _0A()
      } catch (J) {
        let W = J instanceof Error ? J.message : String(J);
        Z.push({
          type: "generic-error",
          source: "plugin-agents",
          error: `Failed to load plugin agents: ${W}`
        })
      }
      try {
        await _1A()
      } catch (J) {
        let W = J instanceof Error ? J.message : String(J);
        Z.push({
          type: "generic-error",
          source: "plugin-hooks",
          error: `Failed to load plugin hooks: ${W}`
        })
      }
      A((J) => ({
        ...J,
        plugins: {
          ...J.plugins,
          enabled: B,
          disabled: G,
          commands: I,
          agents: Y,
          errors: Z
        }
      })), g(`Loaded plugins - Enabled: ${B.length}, Disabled: ${G.length}, Commands: ${I.length}, Agents: ${Y.length}, Errors: ${Z.length}`)
    } catch (B) {
      let G = B instanceof Error ? B : Error(String(B));
      AA(G), g(`Error loading plugins: ${B}`), A((Z) => ({
        ...Z,
        plugins: {
          ...Z.plugins,
          enabled: [],
          disabled: [],
          commands: [],
          agents: [],
          errors: [{
            type: "generic-error",
            source: "plugin-system",
            error: G.message
          }]
        }
      }))
    }
  }, [A]);
  return UI1.useEffect(() => {
    Q()
  }, [Q]), {
    refreshPlugins: Q
  }
}
// @from(Start 13553336, End 13553339)
UI1
// @from(Start 13553345, End 13553442)
nW0 = L(() => {
  z9();
  fV();
  TjA();
  ETA();
  dMA();
  V0();
  g1();
  UI1 = BA(VA(), 1)
})
// @from(Start 13553445, End 13553618)
function PjA({
  state: A,
  percentage: Q
}) {
  if (!N1().terminalProgressBarEnabled) return null;
  return aW0.createElement(UsA, {
    state: A,
    percentage: Q
  })
}
// @from(Start 13553623, End 13553626)
aW0
// @from(Start 13553632, End 13553686)
h69 = L(() => {
  hA();
  jQ();
  aW0 = BA(VA(), 1)
})
// @from(Start 13553689, End 13553933)
function sW0(A) {
  if (A.type === "assistant" && A.message.content[0]?.type === "tool_use") {
    let Q = A.message.content[0];
    return {
      messageId: A.message.id,
      toolUseId: Q.id,
      toolName: Q.name
    }
  }
  return null
}