
// @from(Ln 439270, Col 0)
function q$7(A) {
  switch (A.type) {
    case "directory":
      return q5([MuA(o2.name, {
        command: `ls ${m6([A.path])}`,
        description: `Lists files in ${A.path}`
      }), OuA(o2, {
        stdout: A.content,
        stderr: "",
        interrupted: !1
      })]);
    case "edited_text_file":
      return q5([H0({
        content: `Note: ${A.filename} was modified, either by the user or by a linter. This change was intentional, so make sure to take it into account as you proceed (ie. don't revert it unless the user asks you to). Don't tell the user this, since they are already aware. Here are the relevant changes (shown with line numbers):
${A.snippet}`,
        isMeta: !0
      })]);
    case "file": {
      let B = A.content;
      switch (B.type) {
        case "image":
          return q5([MuA(v5.name, {
            file_path: A.filename
          }), OuA(v5, B)]);
        case "text":
          return q5([MuA(v5.name, {
            file_path: A.filename
          }), OuA(v5, B), ...A.truncated ? [H0({
            content: `Note: The file ${A.filename} was too large and has been truncated to the first ${YRA} lines. Don't tell the user about this truncation. Use ${v5.name} to read more of the file if you need.`,
            isMeta: !0
          })] : []]);
        case "notebook":
          return q5([MuA(v5.name, {
            file_path: A.filename
          }), OuA(v5, B)]);
        case "pdf":
          return q5([MuA(v5.name, {
            file_path: A.filename
          }), OuA(v5, B)])
      }
      break
    }
    case "compact_file_reference":
      return q5([H0({
        content: `Note: ${A.filename} was read before the last conversation was summarized, but the contents are too large to include. Use ${v5.name} tool if you need to access it.`,
        isMeta: !0
      })]);
    case "selected_lines_in_ide": {
      let G = A.content.length > 2000 ? A.content.substring(0, 2000) + `
... (truncated)` : A.content;
      return q5([H0({
        content: `The user selected the lines ${A.lineStart} to ${A.lineEnd} from ${A.filename}:
${G}

This may or may not be related to the current task.`,
        isMeta: !0
      })])
    }
    case "opened_file_in_ide":
      return q5([H0({
        content: `The user opened the file ${A.filename} in the IDE. This may or may not be related to the current task.`,
        isMeta: !0
      })]);
    case "todo":
      if (A.itemCount === 0) return q5([H0({
        content: `This is a reminder that your todo list is currently empty. DO NOT mention this to the user explicitly because they are already aware. If you are working on tasks that would benefit from a todo list please use the ${Bm} tool to create one. If not, please feel free to ignore. Again do not mention this message to the user.`,
        isMeta: !0
      })]);
      else return q5([H0({
        content: `Your todo list has changed. DO NOT mention this explicitly to the user. Here are the latest contents of your todo list:

${eA(A.content)}. Continue on with the tasks at hand if applicable.`,
        isMeta: !0
      })]);
    case "plan_file_reference":
      return q5([H0({
        content: `A plan file exists from plan mode at: ${A.planFilePath}

Plan contents:

${A.planContent}

If this plan is relevant to the current work and not already complete, continue working on it.`,
        isMeta: !0
      })]);
    case "invoked_skills": {
      if (A.skills.length === 0) return [];
      let B = A.skills.map((G) => `### Skill: ${G.name}
Path: ${G.path}

${G.content}`).join(`

---

`);
      return q5([H0({
        content: `The following skills were invoked in this session. Continue to follow these guidelines:

${B}`,
        isMeta: !0
      })])
    }
    case "todo_reminder": {
      let B = A.content.map((Z, Y) => `${Y+1}. [${Z.status}] ${Z.content}`).join(`
`),
        G = `The TodoWrite tool hasn't been used recently. If you're working on tasks that would benefit from tracking progress, consider using the TodoWrite tool to track progress. Also consider cleaning up the todo list if has become stale and no longer matches what you are working on. Only use it if it's relevant to the current work. This is just a gentle reminder - ignore if not applicable. Make sure that you NEVER mention this reminder to the user
`;
      if (B.length > 0) G += `

Here are the existing contents of your todo list:

[${B}]`;
      return q5([H0({
        content: G,
        isMeta: !0
      })])
    }
    case "task_reminder":
      return [];
    case "nested_memory":
      return q5([H0({
        content: `Contents of ${A.content.path}:

${A.content.content}`,
        isMeta: !0
      })]);
    case "queued_command": {
      if (Array.isArray(A.prompt)) {
        let B = A.prompt.filter((Y) => Y.type === "text").map((Y) => Y.text).join(`
`),
          G = A.prompt.filter((Y) => Y.type === "image"),
          Z = [{
            type: "text",
            text: `The user sent the following message:
${B}

Please address this message and continue with your tasks.`
          }, ...G];
        return q5([H0({
          content: Z,
          isMeta: !0
        })])
      }
      return q5([H0({
        content: `The user sent the following message:
${A.prompt}

Please address this message and continue with your tasks.`,
        isMeta: !0
      })])
    }
    case "ultramemory":
      return q5([H0({
        content: A.content,
        isMeta: !0
      })]);
    case "output_style": {
      let B = y6A[A.style];
      if (!B) return [];
      return q5([H0({
        content: `${B.name} output style is active. Remember to follow the specific guidelines for this style.`,
        isMeta: !0
      })])
    }
    case "diagnostics": {
      if (A.files.length === 0) return [];
      let B = tS.formatDiagnosticsSummary(A.files);
      return q5([H0({
        content: `<new-diagnostics>The following new diagnostic issues were detected:

${B}</new-diagnostics>`,
        isMeta: !0
      })])
    }
    case "plan_mode":
      return z$7(A);
    case "plan_mode_reentry": {
      let B = `## Re-entering Plan Mode

You are returning to plan mode after having previously exited it. A plan file exists at ${A.planFilePath} from your previous planning session.

**Before proceeding with any new planning, you should:**
1. Read the existing plan file to understand what was previously planned
2. Evaluate the user's current request against that plan
3. Decide how to proceed:
   - **Different task**: If the user's request is for a different task—even if it's similar or related—start fresh by overwriting the existing plan
   - **Same task, continuing**: If this is explicitly a continuation or refinement of the exact same task, modify the existing plan while cleaning up outdated or irrelevant sections
4. Continue on with the plan process and most importantly you should always edit the plan file one way or the other before calling ${V$.name}

Treat this as a fresh planning session. Do not assume the existing plan is relevant without evaluating it first.`;
      return q5([H0({
        content: B,
        isMeta: !0
      })])
    }
    case "plan_mode_exit": {
      let G = `## Exited Plan Mode

You have exited plan mode. You can now make edits, run tools, and take actions.${A.planExists?` The plan file is located at ${A.planFilePath} if you need to reference it.`:""}`;
      return q5([H0({
        content: G,
        isMeta: !0
      })])
    }
    case "delegate_mode":
      return [];
    case "delegate_mode_exit":
      return q5([H0({
        content: `## Exited Delegate Mode

You have exited delegate mode. You can now use all tools (Bash, Read, Write, Edit, etc.) and take actions directly. Continue with your tasks.`,
        isMeta: !0
      })]);
    case "critical_system_reminder":
      return q5([H0({
        content: A.content,
        isMeta: !0
      })]);
    case "mcp_resource": {
      let B = A.content;
      if (!B || !B.contents || B.contents.length === 0) return q5([H0({
        content: `<mcp-resource server="${A.server}" uri="${A.uri}">(No content)</mcp-resource>`,
        isMeta: !0
      })]);
      let G = [];
      for (let Z of B.contents)
        if (Z && typeof Z === "object") {
          if ("text" in Z && typeof Z.text === "string") G.push({
            type: "text",
            text: "Full contents of resource:"
          }, {
            type: "text",
            text: Z.text
          }, {
            type: "text",
            text: "Do NOT read this resource again unless you think it may have changed, since you already have the full contents."
          });
          else if ("blob" in Z) {
            let Y = "mimeType" in Z ? String(Z.mimeType) : "application/octet-stream";
            G.push({
              type: "text",
              text: `[Binary content: ${Y}]`
            })
          }
        } if (G.length > 0) return q5([H0({
        content: G,
        isMeta: !0
      })]);
      else return i0(A.server, `No displayable content found in MCP resource ${A.uri}.`), q5([H0({
        content: `<mcp-resource server="${A.server}" uri="${A.uri}">(No displayable content)</mcp-resource>`,
        isMeta: !0
      })])
    }
    case "agent_mention":
      return q5([H0({
        content: `The user has expressed a desire to invoke the agent "${A.agentType}". Please invoke the agent appropriately, passing in the required context to it. `,
        isMeta: !0
      })]);
    case "task_status": {
      let B = [`Task ${A.taskId}`, `(type: ${A.taskType})`, `(status: ${A.status})`, `(description: ${A.description})`];
      if (A.deltaSummary) B.push(`Delta: ${A.deltaSummary}`);
      return B.push("You can check its output using the TaskOutput tool."), [H0({
        content: Yh(B.join(" ")),
        isMeta: !0
      })]
    }
    case "task_progress":
      return [H0({
        content: Yh(A.message),
        isMeta: !0
      })];
    case "async_hook_response": {
      let B = A.response,
        G = [];
      if (B.systemMessage) G.push(H0({
        content: B.systemMessage,
        isMeta: !0
      }));
      if (B.hookSpecificOutput && "additionalContext" in B.hookSpecificOutput && B.hookSpecificOutput.additionalContext) G.push(H0({
        content: B.hookSpecificOutput.additionalContext,
        isMeta: !0
      }));
      return q5(G)
    }
    case "memory": {
      let B = A.memories.map((G) => {
        let Z = G.remainingLines && G.remainingLines > 0 ? ` (${G.remainingLines} more lines in full file)` : "";
        return `## Previous Session (${(G.lastModified instanceof Date?G.lastModified:new Date(G.lastModified)).toLocaleDateString()})
Full session notes: ${G.fullPath}${Z}

${G.content}`
      }).join(`

---

`);
      return q5([H0({
        content: `<session-memory>
These session summaries are from PAST sessions that might not be related to the current task and may have outdated info. Do not assume the current task is related to these summaries, until the user's messages indicate so or reference similar tasks. Only a preview of each memory is shown - use the Read tool with the provided path to access full session memory when a session is relevant.

${B}
</session-memory>`,
        isMeta: !0
      })])
    }
    case "token_usage":
      return [H0({
        content: Yh(`Token usage: ${A.used}/${A.total}; ${A.remaining} remaining`),
        isMeta: !0
      })];
    case "budget_usd":
      return [H0({
        content: Yh(`USD budget: $${A.used}/$${A.total}; $${A.remaining} remaining`),
        isMeta: !0
      })];
    case "hook_blocking_error":
      return [H0({
        content: Yh(`${A.hookName} hook blocking error from command: "${A.blockingError.command}": ${A.blockingError.blockingError}`),
        isMeta: !0
      })];
    case "hook_success":
      if (A.hookEvent !== "SessionStart" && A.hookEvent !== "UserPromptSubmit") return [];
      if (A.content === "") return [];
      return [H0({
        content: Yh(`${A.hookName} hook success: ${A.content}`),
        isMeta: !0
      })];
    case "hook_additional_context": {
      if (A.content.length === 0) return [];
      return [H0({
        content: Yh(`${A.hookName} hook additional context: ${A.content.join(`
`)}`),
        isMeta: !0
      })]
    }
    case "hook_stopped_continuation":
      return [H0({
        content: Yh(`${A.hookName} hook stopped continuation: ${A.message}`),
        isMeta: !0
      })];
    case "collab_notification": {
      let B = A.chats.reduce((Z, Y) => Z + Y.unreadCount, 0),
        G = A.chats.map((Z) => Z.handle === "self" ? `self (${Z.unreadCount} new)` : `@${Z.handle} (${Z.unreadCount} new)`).join(", ");
      return q5([H0({
        content: `You have ${B} unread collab message${B!==1?"s":""} from: ${G}. Use the CollabRead tool to read these messages.`,
        isMeta: !0
      })])
    }
    case "verify_plan_reminder": {
      let G = `You have completed implementing the plan. Please call the "" tool directly (NOT the ${f3} tool or an agent) to verify that all plan items were completed correctly.`;
      return q5([H0({
        content: G,
        isMeta: !0
      })])
    }
    case "already_read_file":
    case "command_permissions":
    case "edited_image_file":
    case "hook_cancelled":
    case "hook_error_during_execution":
    case "hook_non_blocking_error":
    case "hook_system_message":
    case "structured_output":
    case "hook_permission_decision":
      return []
  }
  if (["autocheckpointing", "background_task_status"].includes(A.type)) return [];
  return xM("normalizeAttachmentForAPI", Error(`Unknown attachment type: ${A.type}`)), []
}
// @from(Ln 439640, Col 0)
function OuA(A, Q) {
  try {
    let B = A.mapToolResultToToolResultBlockParam(Q, "1");
    if (Array.isArray(B.content) && B.content.some((G) => G.type === "image")) return H0({
      content: B.content,
      isMeta: !0
    });
    return H0({
      content: `Result of calling the ${A.name} tool: ${eA(B.content)}`,
      isMeta: !0
    })
  } catch {
    return H0({
      content: `Result of calling the ${A.name} tool: Error`,
      isMeta: !0
    })
  }
}
// @from(Ln 439659, Col 0)
function MuA(A, Q) {
  return H0({
    content: `Called the ${A} tool with the following input: ${eA(Q)}`,
    isMeta: !0
  })
}
// @from(Ln 439666, Col 0)
function hO(A, Q, B, G) {
  return {
    type: "system",
    subtype: "informational",
    content: A,
    isMeta: !1,
    timestamp: new Date().toISOString(),
    uuid: GM(),
    toolUseID: B,
    level: Q,
    ...G && {
      preventContinuation: G
    }
  }
}
// @from(Ln 439682, Col 0)
function V19(A, Q, B, G, Z, Y, J, X) {
  return {
    type: "system",
    subtype: "stop_hook_summary",
    hookCount: A,
    hookInfos: Q,
    hookErrors: B,
    preventedContinuation: G,
    stopReason: Z,
    hasOutput: Y,
    level: J,
    timestamp: new Date().toISOString(),
    uuid: GM(),
    toolUseID: X
  }
}
// @from(Ln 439699, Col 0)
function yJ9(A) {
  return {
    type: "system",
    subtype: "turn_duration",
    durationMs: A,
    timestamp: new Date().toISOString(),
    uuid: GM(),
    isMeta: !1
  }
}
// @from(Ln 439710, Col 0)
function Sz0(A) {
  return {
    type: "system",
    subtype: "local_command",
    content: A,
    level: "info",
    timestamp: new Date().toISOString(),
    uuid: GM(),
    isMeta: !1
  }
}
// @from(Ln 439722, Col 0)
function pF1(A, Q) {
  return {
    type: "system",
    subtype: "compact_boundary",
    content: "Conversation compacted",
    isMeta: !1,
    timestamp: new Date().toISOString(),
    uuid: GM(),
    level: "info",
    compactMetadata: {
      trigger: A,
      preTokens: Q
    }
  }
}
// @from(Ln 439738, Col 0)
function SeB(A, Q, B, G) {
  return {
    type: "system",
    subtype: "api_error",
    level: "error",
    cause: A.cause instanceof Error ? A.cause : void 0,
    error: A,
    retryInMs: Q,
    retryAttempt: B,
    maxRetries: G,
    timestamp: new Date().toISOString(),
    uuid: GM()
  }
}
// @from(Ln 439753, Col 0)
function qc(A) {
  return A?.type === "system" && A.subtype === "compact_boundary"
}
// @from(Ln 439757, Col 0)
function N$7(A) {
  for (let Q = A.length - 1; Q >= 0; Q--) {
    let B = A[Q];
    if (B && qc(B)) return Q
  }
  return -1
}
// @from(Ln 439765, Col 0)
function _x(A) {
  let Q = N$7(A);
  if (Q === -1) return A;
  return A.slice(Q)
}
// @from(Ln 439771, Col 0)
function GR0(A, Q) {
  if (A.type !== "user") return !0;
  if (A.isMeta) return !1;
  if (A.isVisibleInTranscriptOnly && !Q) return !1;
  return !0
}
// @from(Ln 439778, Col 0)
function dF1(A) {
  if (A.type !== "assistant") return !1;
  if (!Array.isArray(A.message.content)) return !1;
  return A.message.content.every((Q) => Q.type === "thinking")
}
// @from(Ln 439784, Col 0)
function NM0(A, Q, B) {
  let G = 0;
  for (let Z of A) {
    if (!Z) continue;
    if (Z.type === "assistant" && Array.isArray(Z.message.content)) {
      if (Z.message.content.some((J) => J.type === "tool_use" && J.name === Q)) {
        if (G++, B && G >= B) return G
      }
    }
  }
  return G
}
// @from(Ln 439797, Col 0)
function N82(A, Q) {
  let B;
  for (let G = A.length - 1; G >= 0; G--) {
    let Z = A[G];
    if (!Z) continue;
    if (Z.type === "assistant" && Array.isArray(Z.message.content)) {
      let Y = Z.message.content.find((J) => J.type === "tool_use" && J.name === Q);
      if (Y) {
        B = Y.id;
        break
      }
    }
  }
  if (!B) return !1;
  for (let G = A.length - 1; G >= 0; G--) {
    let Z = A[G];
    if (!Z) continue;
    if (Z.type === "user" && Array.isArray(Z.message.content)) {
      let Y = Z.message.content.find((J) => J.type === "tool_result" && J.tool_use_id === B);
      if (Y) return Y.is_error !== !0
    }
  }
  return !1
}
// @from(Ln 439822, Col 0)
function _J9(A) {
  return A.type === "thinking" || A.type === "redacted_thinking"
}
// @from(Ln 439826, Col 0)
function w$7(A) {
  let Q = A[A.length - 1];
  if (!Q || Q.type !== "assistant") return A;
  let B = Q.message.content,
    G = B[B.length - 1];
  if (!G || !_J9(G)) return A;
  let Z = B.length - 1;
  while (Z >= 0) {
    let X = B[Z];
    if (!X || !_J9(X)) break;
    Z--
  }
  l("tengu_filtered_trailing_thinking_block", {
    messageUUID: Q.uuid,
    blocksRemoved: B.length - Z - 1,
    remainingBlocks: Z + 1
  });
  let Y = Z < 0 ? [{
      type: "text",
      text: "[No message content]",
      citations: []
    }] : B.slice(0, Z + 1),
    J = [...A];
  return J[A.length - 1] = {
    ...Q,
    message: {
      ...Q.message,
      content: Y
    }
  }, J
}
// @from(Ln 439858, Col 0)
function Su2(A) {
  let Q = new Set;
  for (let G of A) {
    if (G.type !== "assistant") continue;
    let Z = G.message.content;
    if (!Array.isArray(Z)) continue;
    if (Z.some((J) => J.type !== "thinking" && J.type !== "redacted_thinking") && G.message.id) Q.add(G.message.id)
  }
  return A.filter((G) => {
    if (G.type !== "assistant") return !0;
    let Z = G.message.content;
    if (!Array.isArray(Z) || Z.length === 0) return !0;
    if (!Z.every((J) => J.type === "thinking" || J.type === "redacted_thinking")) return !0;
    if (G.message.id && Q.has(G.message.id)) return !0;
    return l("tengu_filtered_orphaned_thinking_message", {
      messageUUID: G.uuid,
      messageId: G.message.id,
      blockCount: Z.length
    }), !1
  })
}
// @from(Ln 439879, Col 4)
Z$7 = null
// @from(Ln 439880, Col 2)
Y$7 = null
// @from(Ln 439881, Col 2)
Ss = "[Request interrupted by user]"
// @from(Ln 439882, Col 2)
vN = "[Request interrupted by user for tool use]"
// @from(Ln 439883, Col 2)
aVA = "The user doesn't want to take this action right now. STOP what you are doing and wait for the user to tell you how to proceed."
// @from(Ln 439884, Col 2)
v4A = "The user doesn't want to proceed with this tool use. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). STOP what you are doing and wait for the user to tell you how to proceed."
// @from(Ln 439885, Col 2)
gyA = `The user doesn't want to proceed with this tool use. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). To tell you how to proceed, the user said:
`
// @from(Ln 439887, Col 2)
jJ9 = "Permission for this tool use was denied. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). Try a different approach or report the limitation to complete your task."
// @from(Ln 439888, Col 2)
TJ9 = `Permission for this tool use was denied. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). The user said:
`
// @from(Ln 439890, Col 2)
rD0 = `The agent proposed a plan that was rejected by the user. The user chose to stay in plan mode rather than proceed with implementation.

Rejected plan:
`
// @from(Ln 439894, Col 2)
v9A = "No response requested."
// @from(Ln 439895, Col 2)
EKA = "<synthetic>"
// @from(Ln 439896, Col 2)
SZ0
// @from(Ln 439896, Col 7)
E$7
// @from(Ln 439897, Col 4)
tQ = w(() => {
  _M();
  KGA();
  Z0();
  Cf();
  XO();
  pV();
  A0();
  P6A();
  T_();
  vI();
  v1();
  cD();
  _51();
  T1();
  cW();
  oc();
  YK();
  HD0();
  MJ9();
  wyA();
  is();
  jc();
  fbA();
  Wb();
  SZ0 = new Set([Ss, vN, aVA, v4A, v9A]);
  E$7 = ["commit_analysis", "context", "function_analysis", "pr_analysis"]
})
// @from(Ln 439935, Col 0)
function pbA(A) {
  return A.type === "user" || A.type === "assistant" || A.type === "attachment" || A.type === "system"
}
// @from(Ln 439939, Col 0)
function wp() {
  return $w(zQ(), "projects")
}
// @from(Ln 439943, Col 0)
function uz() {
  return Bw(q0())
}
// @from(Ln 439947, Col 0)
function Bw(A) {
  let Q = QV(ke);
  return $w(Q, `${A}.jsonl`)
}
// @from(Ln 439952, Col 0)
function yb(A) {
  let Q = QV(ke),
    B = q0();
  return $w(Q, B, "subagents", `agent-${A}.jsonl`)
}
// @from(Ln 439958, Col 0)
function bJ9(A) {
  let Q = QV(ke),
    B = $w(Q, `${A}.jsonl`),
    G = vA();
  try {
    return G.statSync(B), !0
  } catch {
    return !1
  }
}
// @from(Ln 439969, Col 0)
function _$7() {
  return "production"
}
// @from(Ln 439973, Col 0)
function fJ9() {
  return "external"
}
// @from(Ln 439977, Col 0)
function zp() {
  return !0
}
// @from(Ln 439981, Col 0)
function QV(A) {
  return $w(wp(), gGA(A))
}
// @from(Ln 439985, Col 0)
function vU() {
  if (!z$1) {
    if (z$1 = new hJ9, !vJ9) C6(async () => {
      await z$1?.flush()
    }), vJ9 = !0
  }
  return z$1
}
// @from(Ln 439993, Col 0)
class hJ9 {
  currentSessionTag;
  currentSessionTitle;
  currentSessionAgentName;
  currentSessionAgentColor;
  sessionFile = null;
  remoteIngressUrl = null;
  pendingWriteCount = 0;
  flushResolvers = [];
  constructor() {}
  incrementPendingWrites() {
    this.pendingWriteCount++
  }
  decrementPendingWrites() {
    if (this.pendingWriteCount--, this.pendingWriteCount === 0) {
      for (let A of this.flushResolvers) A();
      this.flushResolvers = []
    }
  }
  async trackWrite(A) {
    this.incrementPendingWrites();
    try {
      return await A()
    } finally {
      this.decrementPendingWrites()
    }
  }
  async flush() {
    if (this.pendingWriteCount === 0) return;
    return new Promise((A) => {
      this.flushResolvers.push(A)
    })
  }
  async removeMessageByUuid(A) {
    return this.trackWrite(async () => {
      if (this.sessionFile !== null) try {
        let B = (await M$7(this.sessionFile, {
          encoding: "utf-8"
        })).split(`
`).filter((G) => {
          if (!G.trim()) return !0;
          try {
            return AQ(G).uuid !== A
          } catch {
            return !0
          }
        });
        await R$7(this.sessionFile, B.join(`
`), {
          encoding: "utf8"
        })
      } catch {}
    })
  }
  async insertMessageChain(A, Q = !1, B, G, Z) {
    return this.trackWrite(async () => {
      let Y = G ?? null,
        J;
      try {
        J = await Tu()
      } catch {
        J = void 0
      }
      let X = q0(),
        I = Z7A().get(X);
      for (let D of A) {
        let W = qc(D),
          K = Y;
        if (D.type === "user" && "sourceToolAssistantUUID" in D && D.sourceToolAssistantUUID) K = D.sourceToolAssistantUUID;
        let V = {
          parentUuid: W ? null : K,
          logicalParentUuid: W ? Y : void 0,
          isSidechain: Q,
          ...{},
          userType: fJ9(),
          cwd: o1(),
          sessionId: X,
          version: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.7",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-01-13T22:55:21Z"
          }.VERSION,
          gitBranch: J,
          agentId: B,
          slug: I,
          ...D
        };
        await this.appendEntry(V), Y = D.uuid
      }
    })
  }
  async insertFileHistorySnapshot(A, Q, B) {
    return this.trackWrite(async () => {
      let G = {
        type: "file-history-snapshot",
        messageId: A,
        snapshot: Q,
        isSnapshotUpdate: B
      };
      await this.appendEntry(G)
    })
  }
  async insertQueueOperation(A) {
    return this.trackWrite(async () => {
      await this.appendEntry(A)
    })
  }
  async insertAttributionSnapshot(A) {
    return this.trackWrite(async () => {
      await this.appendEntry(A)
    })
  }
  async appendEntry(A, Q = q0()) {
    let B = process.env.TEST_ENABLE_SESSION_PERSISTENCE === "true";
    if (_$7() === "test" && !B || jQ()?.cleanupPeriodDays === 0 || cAA()) return;
    let G = vA(),
      Z = q0(),
      Y = Q === Z,
      J = Y ? this.ensureCurrentSessionFile() : this.getExistingSessionFile(Q);
    if (!J) {
      e(Error(`appendEntry: session file not found for ${Y?"current":"other"} session ${Q}`));
      return
    }
    if (A.type === "summary") G.appendFileSync(J, eA(A) + `
`, {
      mode: 384
    });
    else if (A.type === "custom-title") G.appendFileSync(J, eA(A) + `
`, {
      mode: 384
    });
    else if (A.type === "tag") G.appendFileSync(J, eA(A) + `
`, {
      mode: 384
    });
    else if (A.type === "agent-name") G.appendFileSync(J, eA(A) + `
`, {
      mode: 384
    });
    else if (A.type === "agent-color") G.appendFileSync(J, eA(A) + `
`, {
      mode: 384
    });
    else if (A.type === "file-history-snapshot") G.appendFileSync(J, eA(A) + `
`, {
      mode: 384
    });
    else if (A.type === "attribution-snapshot") G.appendFileSync(J, eA(A) + `
`, {
      mode: 384
    });
    else {
      let X = await cJ9(Q);
      if (A.type === "queue-operation") G.appendFileSync(J, eA(A) + `
`, {
        mode: 384
      });
      else {
        let I = A.isSidechain && A.agentId !== void 0,
          D = I ? yb(iz(A.agentId)) : J;
        if (I) try {
          G.statSync(D)
        } catch {
          let W = QV(ke),
            K = $w(W, q0()),
            V = $w(K, "subagents");
          if (!G.existsSync(W)) G.mkdirSync(W, {
            mode: 448
          });
          if (!G.existsSync(K)) G.mkdirSync(K, {
            mode: 448
          });
          if (!G.existsSync(V)) G.mkdirSync(V, {
            mode: 448
          });
          bB(D, "", {
            encoding: "utf8",
            flush: !0,
            mode: 384
          })
        }
        if (!X.has(A.uuid)) {
          if (G.appendFileSync(D, eA(A) + `
`, {
              mode: 384
            }), X.add(A.uuid), this.remoteIngressUrl && pbA(A)) await this.persistToRemote(Q, A)
        }
      }
    }
  }
  ensureCurrentSessionFile() {
    let A = vA();
    if (this.sessionFile === null) {
      let Q = QV(ke);
      try {
        A.statSync(Q)
      } catch {
        A.mkdirSync(Q, {
          mode: 448
        })
      }
      this.sessionFile = uz();
      try {
        A.statSync(this.sessionFile)
      } catch {
        bB(this.sessionFile, "", {
          encoding: "utf8",
          flush: !0,
          mode: 384
        })
      }
    }
    try {
      A.statSync(this.sessionFile)
    } catch {
      let Q = QV(ke);
      try {
        A.statSync(Q)
      } catch {
        A.mkdirSync(Q, {
          mode: 448
        })
      }
      bB(this.sessionFile, "", {
        encoding: "utf8",
        flush: !0,
        mode: 384
      })
    }
    return this.sessionFile
  }
  getExistingSessionFile(A) {
    let Q = Bw(A);
    return vA().existsSync(Q) ? Q : null
  }
  async persistToRemote(A, Q) {
    if (!this.remoteIngressUrl) return;
    if (!await mu2(A, Q, this.remoteIngressUrl)) l("tengu_session_persistence_failed", {}), f6(1, "other")
  }
  setRemoteIngressUrl(A) {
    this.remoteIngressUrl = A, k(`Remote persistence enabled with URL: ${A}`)
  }
  async getLastLog(A) {
    let {
      messages: Q
    } = await NP0(A);
    if (Q.size === 0) return null;
    let G = Array.from(Q.values()).filter((Y) => !Y.isSidechain).sort((Y, J) => new Date(J.timestamp).getTime() - new Date(Y.timestamp).getTime())[0];
    if (!G) return null;
    return F$A(Q, G)
  }
}
// @from(Ln 440248, Col 0)
async function tc(A, Q) {
  let B = lJ9(A);
  return await vU().insertMessageChain(B, !1, void 0, void 0, Q), B[B.length - 1]?.uuid || null
}
// @from(Ln 440252, Col 0)
async function yz0(A, Q, B) {
  await vU().insertMessageChain(lJ9(A), !0, Q, B)
}
// @from(Ln 440255, Col 0)
async function q32(A) {
  await vU().insertQueueOperation(A)
}
// @from(Ln 440258, Col 0)
async function gJ9(A) {
  await vU().removeMessageByUuid(A)
}
// @from(Ln 440261, Col 0)
async function zW1(A, Q, B) {
  await vU().insertFileHistorySnapshot(A, Q, B)
}
// @from(Ln 440264, Col 0)
async function CP0(A) {
  await vU().insertAttributionSnapshot(A)
}
// @from(Ln 440267, Col 0)
async function wj() {
  let A = vU();
  A.sessionFile = uz()
}
// @from(Ln 440271, Col 0)
async function uJ9(A, Q) {
  pw(lz(A));
  let B = vU();
  try {
    let G = await cu2(A, Q) || [],
      Z = vA(),
      Y = QV(ke);
    try {
      Z.statSync(Y)
    } catch {
      Z.mkdirSync(Y, {
        mode: 448
      })
    }
    let J = Bw(A);
    if (Z.existsSync(J)) Z.unlinkSync(J);
    for (let X of G) Z.appendFileSync(J, eA(X) + `
`, {
      mode: 384
    });
    if (G.length === 0 && !Z.existsSync(J)) bB(J, "", {
      encoding: "utf8",
      flush: !0,
      mode: 384
    });
    return k(`Hydrated ${G.length} entries from remote`), G.length > 0
  } catch (G) {
    return k(`Error hydrating session from remote: ${G}`), OB("error", "hydrate_remote_session_fail"), !1
  } finally {
    B.setRemoteIngressUrl(Q)
  }
}
// @from(Ln 440304, Col 0)
function UP0(A) {
  let Q = hj0(A);
  if (Q) {
    let B = Q.replace(/\n/g, " ").trim();
    if (B.length > 200) B = B.slice(0, 200).trim() + "…";
    return B
  }
  return "No prompt"
}
// @from(Ln 440314, Col 0)
function hj0(A) {
  for (let Q of A) {
    if (Q.type !== "user" || Q.isMeta) continue;
    if ("isCompactSummary" in Q && Q.isCompactSummary) continue;
    let B = Q.message?.content;
    if (!B) continue;
    let G = "";
    if (typeof B === "string") G = B;
    else if (Array.isArray(B)) G = B.find((X) => X.type === "text")?.text || "";
    if (!G) continue;
    let Z = Q9(G, mC);
    if (Z) {
      let J = Z.replace(/^\//, "");
      if (xs().has(J)) continue;
      else {
        let X = Q9(G, "command-args");
        if (!X || X.trim() === "") continue
      }
    }
    if (G.match(/^<local-command-stdout>/)) continue;
    if (G.match(/^<session-start-hook>/)) continue;
    let Y = Q9(G, "bash-input");
    if (Y) return `! ${Y}`;
    return G
  }
  return
}
// @from(Ln 440342, Col 0)
function $$1(A) {
  return A.map((Q) => {
    let {
      isSidechain: B,
      parentUuid: G,
      ...Z
    } = Q;
    return Z
  })
}
// @from(Ln 440353, Col 0)
function F$A(A, Q) {
  let B = [],
    G = Q;
  while (G) B.unshift(G), G = G.parentUuid ? A.get(G.parentUuid) : void 0;
  return B
}
// @from(Ln 440360, Col 0)
function RuA(A, Q) {
  let B = [];
  for (let G of Q) {
    let Z = A.get(G.uuid);
    if (!Z) continue;
    if (!Z.isSnapshotUpdate) B.push(Z.snapshot);
    else {
      let Y = B.findLastIndex((J) => J.messageId === Z.snapshot.messageId);
      if (Y === -1) B.push(Z.snapshot);
      else B[Y] = Z.snapshot
    }
  }
  return B
}
// @from(Ln 440375, Col 0)
function _uA(A, Q) {
  return Array.from(A.values())
}
// @from(Ln 440379, Col 0)
function j$7(A) {
  if (A.type !== "user") return !1;
  if (A.isMeta) return !1;
  let Q = A.message?.content;
  if (!Q) return !1;
  if (typeof Q === "string") return Q.trim().length > 0;
  if (Array.isArray(Q)) return Q.some((B) => B.type === "text" || B.type === "image" || B.type === "document");
  return !1
}
// @from(Ln 440389, Col 0)
function T$7(A) {
  if (A.type !== "assistant") return !1;
  let Q = A.message?.content;
  if (!Q || !Array.isArray(Q)) return !1;
  return Q.some((B) => B.type === "text" && typeof B.text === "string" && B.text.trim().length > 0)
}
// @from(Ln 440396, Col 0)
function P$7(A) {
  let Q = 0;
  for (let B of A) switch (B.type) {
    case "user":
      if (j$7(B)) Q++;
      break;
    case "assistant":
      if (T$7(B)) Q++;
      break;
    case "attachment":
    case "system":
    case "progress":
      break
  }
  return Q
}
// @from(Ln 440413, Col 0)
function mJ9(A, Q = 0, B, G, Z, Y, J, X) {
  let I = A[A.length - 1],
    D = A[0],
    W = UP0(A),
    K = new Date(D.timestamp),
    V = new Date(I.timestamp);
  return {
    date: I.timestamp,
    messages: $$1(A),
    fullPath: J ?? "n/a",
    value: Q,
    created: K,
    modified: V,
    firstPrompt: W,
    messageCount: P$7(A),
    isSidechain: D.isSidechain,
    ...{},
    leafUuid: I.uuid,
    summary: B,
    customTitle: G,
    tag: Y,
    fileHistorySnapshots: Z,
    attributionSnapshots: X,
    gitBranch: I.gitBranch,
    projectPath: D.cwd
  }
}
// @from(Ln 440440, Col 0)
async function S$7(A) {
  let Q = new Map,
    B = 0;
  for (let J of A) {
    let X = xX(J);
    if (X) {
      let I = (Q.get(X) || 0) + 1;
      Q.set(X, I), B = Math.max(I, B)
    }
  }
  if (B <= 1) return;
  let G = Array.from(Q.values()).filter((J) => J > 1),
    Z = G.length,
    Y = G.reduce((J, X) => J + X, 0);
  l("tengu_session_forked_branches_fetched", {
    total_sessions: Q.size,
    sessions_with_branches: Z,
    max_branches_per_session: Math.max(...G),
    avg_branches_per_session: Math.round(Y / Z),
    total_transcript_count: A.length
  })
}
// @from(Ln 440462, Col 0)
async function x$7(A) {
  let Q = QV(ke),
    B = !0,
    G = await wP0([Q], !1, A, !0);
  return await S$7(G), G
}
// @from(Ln 440468, Col 0)
async function dJ9(A, Q) {
  await vU().appendEntry({
    type: "summary",
    summary: Q,
    leafUuid: A
  })
}
// @from(Ln 440476, Col 0)
function qP0(A, Q, B, G) {
  vA().appendFileSync(A, eA(B) + `
`, {
    mode: 384
  });
  let Y = O$7(A);
  y$7(Y, Q, G)
}
// @from(Ln 440484, Col 0)
async function Vz1(A, Q, B) {
  let G = B ?? Bw(A);
  if (qP0(G, A, {
      type: "custom-title",
      customTitle: Q,
      sessionId: A
    }, {
      customTitle: Q
    }), A === q0()) vU().currentSessionTitle = Q;
  l("tengu_session_renamed", {})
}
// @from(Ln 440495, Col 0)
async function bT0(A, Q, B) {
  let G = B ?? Bw(A);
  if (qP0(G, A, {
      type: "tag",
      tag: Q,
      sessionId: A
    }, {
      tag: Q
    }), A === q0()) vU().currentSessionTag = Q;
  l("tengu_session_tagged", {})
}
// @from(Ln 440507, Col 0)
function rZ9(A) {
  if (A === q0()) return vU().currentSessionTag;
  return
}
// @from(Ln 440512, Col 0)
function tQ9(A) {
  if (A === q0()) return vU().currentSessionTitle;
  return
}
// @from(Ln 440516, Col 0)
async function FQ9(A, Q, B) {
  let G = B ?? Bw(A);
  if (qP0(G, A, {
      type: "agent-color",
      agentColor: Q,
      sessionId: A
    }, {
      agentColor: Q
    }), A === q0()) vU().currentSessionAgentColor = Q;
  l("tengu_agent_color_set", {})
}
// @from(Ln 440528, Col 0)
function xX(A) {
  if (A.sessionId) return A.sessionId;
  return A.messages[0]?.sessionId
}
// @from(Ln 440533, Col 0)
function Gj(A) {
  return A.messages.length === 0 && A.sessionId !== void 0
}
// @from(Ln 440536, Col 0)
async function Vx(A) {
  if (!Gj(A)) return A;
  let {
    leafUuid: Q,
    fullPath: B
  } = A;
  if (!B) return A;
  try {
    let {
      messages: G,
      fileHistorySnapshots: Z,
      attributionSnapshots: Y,
      leafUuids: J
    } = await Mp(B);
    if (G.size === 0) return A;
    let X = Q ? G.get(Q) : void 0;
    if (!X) {
      let W = [...G.values()].filter((V) => J.has(V.uuid)).sort((V, F) => new Date(F.timestamp).getTime() - new Date(V.timestamp).getTime())[0];
      if (!W) return A;
      let K = F$A(G, W);
      return {
        ...A,
        messages: $$1(K),
        fileHistorySnapshots: RuA(Z, K),
        attributionSnapshots: _uA(Y, K)
      }
    }
    let I = F$A(G, X);
    return {
      ...A,
      messages: $$1(I),
      fileHistorySnapshots: RuA(Z, I),
      attributionSnapshots: _uA(Y, I)
    }
  } catch {
    return A
  }
}
// @from(Ln 440574, Col 0)
async function Q$A(A, Q) {
  let {
    limit: B,
    exact: G
  } = Q || {}, Z = await Jk(EQ()), Y = await Le(Z), J = A.toLowerCase().trim(), X = Y.filter((W) => {
    let K = W.customTitle?.toLowerCase().trim();
    if (!K) return !1;
    return G ? K === J : K.includes(J)
  }), I = new Map;
  for (let W of X) {
    let K = xX(W);
    if (K) {
      let V = I.get(K);
      if (!V || W.modified > V.modified) I.set(K, W)
    }
  }
  let D = Array.from(I.values());
  if (D.sort((W, K) => K.modified.getTime() - W.modified.getTime()), B) return D.slice(0, B);
  return D
}
// @from(Ln 440594, Col 0)
async function Mp(A) {
  let Q = new Map,
    B = new Map,
    G = new Map,
    Z = new Map,
    Y = new Map,
    J = new Map,
    X = new Map,
    I = new Map;
  try {
    let K = await Fg(A);
    for (let V of K)
      if (V.type === "user" || V.type === "assistant" || V.type === "attachment" || V.type === "system") Q.set(V.uuid, V);
      else if (V.type === "summary" && V.leafUuid) B.set(V.leafUuid, V.summary);
    else if (V.type === "custom-title" && V.sessionId) G.set(V.sessionId, V.customTitle);
    else if (V.type === "tag" && V.sessionId) Z.set(V.sessionId, V.tag);
    else if (V.type === "agent-name" && V.sessionId) Y.set(V.sessionId, V.agentName);
    else if (V.type === "agent-color" && V.sessionId) J.set(V.sessionId, V.agentColor);
    else if (V.type === "file-history-snapshot") X.set(V.messageId, V);
    else if (V.type === "attribution-snapshot") I.set(V.messageId, V)
  } catch {}
  let D = new Set([...Q.values()].map((K) => K.parentUuid).filter((K) => K !== null)),
    W = new Set([...Q.keys()].filter((K) => !D.has(K)));
  return {
    messages: Q,
    summaries: B,
    customTitles: G,
    tags: Z,
    agentNames: Y,
    agentColors: J,
    fileHistorySnapshots: X,
    attributionSnapshots: I,
    leafUuids: W
  }
}
// @from(Ln 440629, Col 0)
async function NP0(A) {
  let Q = $w(QV(EQ()), `${A}.jsonl`);
  return Mp(Q)
}
// @from(Ln 440633, Col 0)
async function pJ9(A, Q) {
  return (await cJ9(A)).has(Q)
}
// @from(Ln 440636, Col 0)
async function Gq0(A) {
  let Q = await vU().getLastLog(A);
  if (Q !== null && Q !== void 0) {
    let B = Q[Q.length - 1],
      {
        summaries: G,
        customTitles: Z,
        tags: Y,
        fileHistorySnapshots: J,
        attributionSnapshots: X
      } = await NP0(A),
      I = B ? G.get(B.uuid) : void 0,
      D = B ? Z.get(B.sessionId) : void 0,
      W = B ? Y.get(B.sessionId) : void 0;
    return mJ9(Q, 0, I, D, RuA(J, Q), W, Bw(A), _uA(X, Q))
  }
  return null
}
// @from(Ln 440654, Col 0)
async function J8A(A) {
  let B = (await x$7(A)).filter((G) => C$1(G));
  return V7A(B).map((G, Z) => ({
    ...G,
    value: Z
  }))
}
// @from(Ln 440661, Col 0)
async function wP0(A, Q, B, G = !1) {
  let Z = vA(),
    Y = [];
  for (let X of A) try {
    let D = Z.readdirSync(X).filter((W) => W.isFile() && W.name.endsWith(".jsonl")).map((W) => $w(X, W.name));
    if (B) D = D.sort((W, K) => {
      let V = Z.statSync(W);
      return Z.statSync(K).mtime.getTime() - V.mtime.getTime()
    }).slice(0, B);
    for (let W of D) {
      let {
        messages: K,
        summaries: V,
        customTitles: F,
        tags: H,
        fileHistorySnapshots: E,
        attributionSnapshots: z,
        leafUuids: $
      } = await Mp(W);
      if (K.size === 0) continue;
      let O = [...K.values()].filter((L) => $.has(L.uuid));
      for (let L of O) {
        let M = F$A(K, L);
        if (M.length === 0) continue;
        let _ = V.get(L.uuid),
          j = L.sessionId,
          x = F.get(j),
          b = H.get(j),
          S = RuA(E, M),
          u = _uA(z, M),
          f = mJ9(M, 0, _, x, S, b, W, u);
        Y.push(f)
      }
    }
  } catch {
    continue
  }
  let J = Y.filter((X) => C$1(X, {
    includeSidechains: G,
    includeAgentSessions: Q
  }));
  return V7A(J).map((X, I) => ({
    ...X,
    value: I
  }))
}
// @from(Ln 440707, Col 0)
async function egA(A) {
  let Q = vA(),
    B = wp();
  try {
    Q.statSync(B)
  } catch {
    return []
  }
  let Z = Q.readdirSync(B).filter((Y) => Y.isDirectory()).map((Y) => $w(B, Y.name));
  return wP0(Z, !1, A)
}
// @from(Ln 440718, Col 0)
async function Le(A, Q) {
  let B = vA(),
    G = wp(),
    Z = await sJ9();
  if (A.length <= 1) {
    if (Z) {
      let X = QV(EQ());
      return kJ9(X)
    }
    return J8A(Q)
  }
  try {
    B.statSync(G)
  } catch {
    return J8A(Q)
  }
  let Y = A.map((X) => gGA(X)),
    J = [];
  try {
    let X = B.readdirSync(G);
    for (let I of X) {
      if (!I.isDirectory()) continue;
      let D = I.name;
      if (Y.some((K) => D === K || D.startsWith(K + "-"))) J.push($w(G, D))
    }
  } catch {
    return J8A(Q)
  }
  if (J.length === 0) return J8A(Q);
  if (Z) {
    let X = [];
    for (let I of J) {
      let D = await kJ9(I);
      X.push(...D)
    }
    return V7A(X).map((I, D) => ({
      ...I,
      value: D
    }))
  }
  return wP0(J, !0, Q)
}
// @from(Ln 440760, Col 0)
async function bD1(A) {
  let Q = yb(A),
    B = vA();
  try {
    B.statSync(Q)
  } catch {
    return null
  }
  try {
    let {
      messages: G
    } = await Mp(Q), Z = Array.from(G.values()).filter((D) => D.agentId === A && D.isSidechain);
    if (Z.length === 0) return null;
    let Y = new Set(Z.map((D) => D.parentUuid)),
      J = Z.filter((D) => !Y.has(D.uuid)).sort((D, W) => new Date(W.timestamp).getTime() - new Date(D.timestamp).getTime())[0];
    if (!J) return null;
    return F$A(G, J).filter((D) => D.agentId === A).map(({
      isSidechain: D,
      parentUuid: W,
      ...K
    }) => K)
  } catch {
    return null
  }
}
// @from(Ln 440786, Col 0)
function lJ9(A) {
  return A.filter((Q) => {
    if (Q.type === "progress") return !1;
    if (Q.type === "attachment" && fJ9() !== "ant") return !1;
    return !0
  })
}
// @from(Ln 440793, Col 0)
async function xu2(A) {
  return (await J8A())[A] || null
}
// @from(Ln 440796, Col 0)
async function iJ9(A) {
  try {
    let Q = q0(),
      B = Bw(Q),
      {
        messages: G
      } = await Mp(B),
      Z = null;
    for (let Y of G.values())
      if (Y.type === "assistant") {
        let J = Y.message.content;
        if (Array.isArray(J)) {
          for (let X of J)
            if (X.type === "tool_use" && X.id === A) {
              Z = Y;
              break
            }
        }
      } else if (Y.type === "user") {
      let J = Y.message.content;
      if (Array.isArray(J)) {
        for (let X of J)
          if (X.type === "tool_result" && X.tool_use_id === A) return null
      }
    }
    return Z
  } catch {
    return null
  }
}
// @from(Ln 440827, Col 0)
function LP0(A) {
  let Q = vA(),
    B = $w(A, nJ9);
  try {
    if (!Q.existsSync(B)) return null;
    let G = Q.readFileSync(B, {
        encoding: "utf-8"
      }),
      Z = AQ(G);
    if (Z.version !== zP0 || !Array.isArray(Z.entries)) return k(`Session index invalid or version mismatch: expected version ${zP0}`), null;
    return Z
  } catch (G) {
    return e(G), null
  }
}
// @from(Ln 440843, Col 0)
function $P0(A, Q) {
  let B = vA(),
    G = $w(A, nJ9),
    Z = `${G}.tmp`;
  try {
    if (!B.existsSync(A)) B.mkdirSync(A, {
      mode: 448
    });
    return bB(Z, eA(Q, null, 2), {
      encoding: "utf-8",
      flush: !0,
      mode: 384
    }), B.renameSync(Z, G), !0
  } catch (Y) {
    e(Y);
    try {
      if (B.existsSync(Z)) B.unlinkSync(Z)
    } catch {}
    return !1
  }
}
// @from(Ln 440865, Col 0)
function y$7(A, Q, B) {
  let G = LP0(A);
  if (!G) return;
  let Z = G.entries.find((J) => J.sessionId === Q);
  if (!Z) return;
  if (B.customTitle !== void 0) Z.customTitle = B.customTitle;
  if (B.tag !== void 0) Z.tag = B.tag;
  if (B.agentName !== void 0) Z.agentName = B.agentName;
  if (B.agentColor !== void 0) Z.agentColor = B.agentColor;
  let Y = vA();
  try {
    let J = Y.statSync(Z.fullPath);
    Z.fileMtime = J.mtimeMs
  } catch {}
  $P0(A, G)
}
// @from(Ln 440882, Col 0)
function v$7(A, Q, B, G, Z, Y, J, X, I) {
  if (G.length === 0) return null;
  let D = G[0],
    W = G[G.length - 1];
  return {
    sessionId: A,
    leafUuid: W.uuid,
    fullPath: Q,
    fileMtime: B,
    firstPrompt: UP0(G),
    customTitle: Y.get(A),
    summary: Z.get(W.uuid),
    tag: J.get(A),
    agentName: X.get(A),
    agentColor: I.get(A),
    messageCount: G.length,
    created: D.timestamp,
    modified: W.timestamp,
    gitBranch: W.gitBranch,
    projectPath: D.cwd,
    isSidechain: D.isSidechain ?? !1
  }
}
// @from(Ln 440905, Col 0)
async function aJ9(A) {
  if (!await sJ9()) return;
  let B = vA();
  try {
    if (!B.existsSync(A)) return;
    let G = LP0(A),
      Z = G ?? {
        version: zP0,
        entries: []
      },
      Y = new Map;
    for (let K of Z.entries) Y.set(K.sessionId, K);
    let J = rJ9(A),
      X = 0,
      I = 0,
      D = 0;
    Z.entries = Z.entries.filter((K) => {
      if (J.has(K.sessionId)) return !0;
      return D++, !1
    });
    let W = q0();
    for (let [K, V] of J) {
      if (K === W) continue;
      let F = Y.get(K);
      if (F && V.mtime <= F.fileMtime) continue;
      try {
        let {
          messages: H,
          summaries: E,
          customTitles: z,
          tags: $,
          agentNames: O,
          agentColors: L,
          leafUuids: M
        } = await Mp(V.path);
        if (H.size === 0) continue;
        let _ = oJ9(H, M);
        if (!_) continue;
        if (F) Z.entries = Z.entries.filter((x) => x.sessionId !== K);
        let j = v$7(K, V.path, V.mtime, _, E, z, $, O, L);
        if (j)
          if (Z.entries.push(j), F) I++;
          else X++
      } catch {
        k(`Failed to read session file: ${V.path}`)
      }
    }
    if (X > 0 || I > 0 || D > 0) $P0(A, Z), k(`Session index: added ${X}, updated ${I}, removed ${D} (total: ${Z.entries.length})`);
    else if (!G) $P0(A, Z), k("Created empty session index")
  } catch (G) {
    e(G)
  }
}
// @from(Ln 440959, Col 0)
function k$7(A, Q) {
  return {
    date: A.modified,
    messages: [],
    fullPath: A.fullPath,
    value: Q,
    created: new Date(A.created),
    modified: new Date(A.modified),
    firstPrompt: A.firstPrompt,
    messageCount: A.messageCount,
    isSidechain: A.isSidechain,
    sessionId: A.sessionId,
    leafUuid: A.leafUuid,
    summary: A.summary,
    customTitle: A.customTitle,
    tag: A.tag,
    agentName: A.agentName,
    agentColor: A.agentColor,
    gitBranch: A.gitBranch,
    projectPath: A.projectPath
  }
}
// @from(Ln 440982, Col 0)
function C$1(A, {
  isLite: Q = !1,
  includeSidechains: B = !1,
  includeAgentSessions: G = !1
} = {}) {
  if (!Q && !A.messages?.length) return !1;
  if (A.firstPrompt?.startsWith("API Error")) return !1;
  if (A.summary?.startsWith("API Error")) return !1;
  if (!B && A.isSidechain) return !1;
  if (!G && A.teamName) return !1;
  return !0
}
// @from(Ln 440995, Col 0)
function oJ9(A, Q) {
  let B = [...A.values()].filter((Y) => Q.has(Y.uuid));
  if (B.length === 0) return null;
  let G = B.sort((Y, J) => new Date(J.timestamp).getTime() - new Date(Y.timestamp).getTime())[0],
    Z = F$A(A, G);
  return Z.length > 0 ? Z : null
}
// @from(Ln 441003, Col 0)
function rJ9(A) {
  let Q = vA(),
    B = new Map,
    G = Q.readdirSync(A);
  for (let Z of G) {
    if (!Z.isFile() || !Z.name.endsWith(".jsonl")) continue;
    let Y = BU(L$7(Z.name, ".jsonl"));
    if (!Y) continue;
    let J = $w(A, Z.name);
    try {
      let X = Q.statSync(J);
      B.set(Y, {
        path: J,
        mtime: X.mtime.getTime()
      })
    } catch {
      k(`Failed to stat session file: ${J}`)
    }
  }
  return B
}
// @from(Ln 441024, Col 0)
async function b$7(A) {
  let {
    messages: Q,
    summaries: B,
    customTitles: G,
    tags: Z,
    fileHistorySnapshots: Y,
    attributionSnapshots: J,
    leafUuids: X
  } = await Mp(A);
  if (Q.size === 0) return null;
  let I = oJ9(Q, X);
  if (!I) return null;
  let D = I[0],
    W = I[I.length - 1],
    K = D.sessionId;
  return {
    date: W.timestamp,
    messages: $$1(I),
    fullPath: A,
    value: 0,
    created: new Date(D.timestamp),
    modified: new Date(W.timestamp),
    firstPrompt: UP0(I),
    messageCount: I.length,
    isSidechain: D.isSidechain ?? !1,
    sessionId: K,
    leafUuid: W.uuid,
    summary: B.get(W.uuid),
    customTitle: G.get(K),
    tag: Z.get(K),
    gitBranch: W.gitBranch,
    projectPath: D.cwd,
    fileHistorySnapshots: RuA(Y, I),
    attributionSnapshots: _uA(J, I)
  }
}
// @from(Ln 441061, Col 0)
async function kJ9(A) {
  let Q = LP0(A),
    B = rJ9(A),
    G = new Map;
  if (Q)
    for (let J of Q.entries) G.set(J.sessionId, J);
  let Z = [],
    Y = new Set([...G.keys(), ...B.keys()]);
  for (let J of Y) {
    let X = B.get(J),
      I = G.get(J);
    if (!X) continue;
    if (!I || X.mtime > I.fileMtime) {
      try {
        let W = await b$7(X.path);
        if (W && C$1(W)) Z.push(W)
      } catch {
        k(`Failed to load session file: ${X.path}`)
      }
      continue
    }
    if (C$1(I, {
        isLite: !0
      })) Z.push(k$7(I, 0)), k(`Using cached index entry for session: ${J}`)
  }
  return V7A(Z).map((J, X) => ({
    ...J,
    value: X
  }))
}
// @from(Ln 441091, Col 0)
async function sJ9() {
  return en("tengu_session_index", !1)
}
// @from(Ln 441094, Col 4)
ke
// @from(Ln 441094, Col 8)
z$1 = null
// @from(Ln 441095, Col 2)
vJ9 = !1
// @from(Ln 441096, Col 2)
cJ9
// @from(Ln 441096, Col 7)
nJ9 = "sessions-index.json"
// @from(Ln 441097, Col 2)
zP0 = 1
// @from(Ln 441098, Col 4)
d4 = w(() => {
  tQ();
  w6();
  C0();
  fQ();
  V2();
  oZ();
  A0();
  DQ();
  vI();
  GB();
  Y9();
  ZI();
  OK1();
  T1();
  v1();
  d_();
  WV();
  cD();
  Z0();
  nX();
  PL();
  A0();
  yJ();
  ke = o1();
  cJ9 = W0(async (A) => {
    let {
      messages: Q
    } = await NP0(A);
    return new Set(Q.keys())
  }, (A) => A)
})
// @from(Ln 441143, Col 0)
function Rp() {
  return process.env.USE_MCP_CLI_DIR || eJ9(f$7(), "claude-code-mcp-cli")
}
// @from(Ln 441147, Col 0)
function H$A() {
  if (jJ()) {
    let A = process.env.CLAUDE_CODE_SESSION_ID;
    if (A) return A
  }
  return q0()
}
// @from(Ln 441155, Col 0)
function AX9() {
  if (!jJ()) return;
  C6(async () => {
    try {
      let A = U$1();
      await tJ9(A, {
        force: !0
      });
      let Q = Rp();
      if ((await u$7(Q)).length === 0) await tJ9(Q, {
        recursive: !0,
        force: !0
      })
    } catch {}
  })
}
// @from(Ln 441172, Col 0)
function U$1() {
  let A = H$A();
  return eJ9(Rp(), `${A}.json`)
}
// @from(Ln 441177, Col 0)
function m$7(A) {
  let Q = {
    name: A.name,
    type: A.type
  };
  if (A.type === "connected") return {
    ...Q,
    capabilities: A.capabilities
  };
  return Q
}
// @from(Ln 441188, Col 0)
async function d$7(A) {
  let Q = "";
  try {
    Q = await A.description({}, {
      isNonInteractiveSession: !1,
      toolPermissionContext: {
        mode: "default",
        additionalWorkingDirectories: new Map,
        alwaysAllowRules: {},
        alwaysDenyRules: {},
        alwaysAskRules: {},
        isBypassPermissionsModeAvailable: !1
      },
      tools: []
    })
  } catch {}
  return {
    name: A.name,
    description: Q,
    inputJSONSchema: A.inputJSONSchema,
    isMcp: A.isMcp,
    originalToolName: A.originalMcpToolName
  }
}
// @from(Ln 441212, Col 0)
async function QX9(A, Q, B) {
  if (!jJ()) return;
  try {
    await g$7(Rp(), {
      recursive: !0
    });
    let G = await Promise.all(Q.filter((I) => I.isMcp).map(d$7)),
      Z = {},
      Y = {};
    for (let I of A) {
      Z[I.name] = I.config;
      let D = e3(I.name);
      if (Y[D] && Y[D] !== I.name) console.warn(`Warning: MCP server name collision detected. Both "${Y[D]}" and "${I.name}" normalize to "${D}". Only "${I.name}" will be accessible via normalized lookup.`);
      Y[D] = I.name
    }
    let J = {
        clients: A.map(m$7),
        configs: Z,
        tools: G,
        resources: B,
        normalizedNames: Y
      },
      X = U$1();
    await h$7(X, eA(J, null, 2))
  } catch {}
}
// @from(Ln 441238, Col 4)
E$A = w(() => {
  C0();
  nX();
  $F();
  A0()
})
// @from(Ln 441254, Col 0)
function _p(A) {
  return A.toLowerCase()
}
// @from(Ln 441258, Col 0)
function GX9(A, Q) {
  if ($Q() === "windows") {
    let B = iy(A),
      G = iy(Q);
    return fe.relative(B, G)
  }
  return fe.relative(A, Q)
}
// @from(Ln 441267, Col 0)
function w01(A) {
  if ($Q() === "windows") return iy(A);
  return A
}
// @from(Ln 441272, Col 0)
function n$7() {
  return yL.map((A) => bH(A)).filter((A) => A !== void 0)
}
// @from(Ln 441276, Col 0)
function h$0(A) {
  let Q = Y4(A),
    B = _p(Q);
  if (B.endsWith("/.claude/settings.json") || B.endsWith("/.claude/settings.local.json")) return !0;
  return n$7().some((G) => _p(G) === B)
}
// @from(Ln 441283, Col 0)
function a$7(A) {
  if (h$0(A)) return !0;
  let Q = be(EQ(), ".claude", "commands"),
    B = be(EQ(), ".claude", "agents"),
    G = be(EQ(), ".claude", "skills");
  return yd(A, Q) || yd(A, B) || yd(A, G)
}
// @from(Ln 441291, Col 0)
function o$7(A) {
  if (!Rp()) return !1;
  let Q = Y4(A);
  return yd(Q, Rp())
}
// @from(Ln 441297, Col 0)
function ZX9(A) {
  let Q = dC();
  return A === Q
}
// @from(Ln 441302, Col 0)
function lz1() {
  return be(QV(o1()), q0(), "session-memory") + he
}
// @from(Ln 441306, Col 0)
function VhA() {
  return be(lz1(), "summary.md")
}
// @from(Ln 441310, Col 0)
function r$7(A) {
  return A.startsWith(lz1())
}
// @from(Ln 441314, Col 0)
function s$7(A) {
  let Q = QV(o1());
  return A === Q || A.startsWith(Q + he)
}
// @from(Ln 441319, Col 0)
function K$A() {
  return f8("tengu_scratch")
}
// @from(Ln 441323, Col 0)
function MM0() {
  let A = process.env.CLAUDE_CODE_TMPDIR || ($Q() === "windows" ? p$7() : "/tmp");
  return be(A, "claude") + he
}
// @from(Ln 441328, Col 0)
function V71() {
  return be(MM0(), gGA(EQ())) + he
}
// @from(Ln 441332, Col 0)
function F$1() {
  return be(V71(), q0(), "scratchpad")
}
// @from(Ln 441336, Col 0)
function YX9() {
  if (!K$A()) throw Error("Scratchpad directory feature is not enabled");
  let A = vA(),
    Q = F$1();
  if (!A.existsSync(Q)) A.mkdirSync(Q);
  return Q
}
// @from(Ln 441344, Col 0)
function JX9(A) {
  if (!K$A()) return !1;
  let Q = F$1();
  return A === Q || A.startsWith(Q + he)
}
// @from(Ln 441350, Col 0)
function t$7(A) {
  let B = Y4(A).split(he),
    G = B[B.length - 1];
  if (A.startsWith("\\\\") || A.startsWith("//")) return !0;
  for (let Z = 0; Z < B.length; Z++) {
    let Y = B[Z],
      J = _p(Y);
    for (let X of i$7) {
      if (J !== _p(X)) continue;
      if (X === ".claude") {
        let I = B[Z + 1];
        if (I && _p(I) === "worktrees") break
      }
      return !0
    }
  }
  if (G) {
    let Z = _p(G);
    if (l$7.some((Y) => _p(Y) === Z)) return !0
  }
  return !1
}
// @from(Ln 441373, Col 0)
function XX9(A) {
  if (A.indexOf(":", 2) !== -1) return !0;
  if (/~\d/.test(A)) return !0;
  if (A.startsWith("\\\\?\\") || A.startsWith("\\\\.\\") || A.startsWith("//?/") || A.startsWith("//./")) return !0;
  if (/[.\s]+$/.test(A)) return !0;
  if (/\.(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i.test(A)) return !0;
  if (/(^|\/|\\)\.{3,}(\/|\\|$)/.test(A)) return !0;
  if (QV1(A)) return !0;
  return !1
}
// @from(Ln 441384, Col 0)
function Sq0(A) {
  let Q = pAA(A);
  for (let B of Q)
    if (XX9(B)) return {
      safe: !1,
      message: `Claude requested permissions to write to ${A}, which contains a suspicious Windows path pattern that requires manual approval.`
    };
  for (let B of Q)
    if (a$7(B)) return {
      safe: !1,
      message: `Claude requested permissions to write to ${A}, but you haven't granted it yet.`
    };
  for (let B of Q)
    if (o$7(B));
  for (let B of Q)
    if (t$7(B)) return {
      safe: !1,
      message: `Claude requested permissions to edit ${A} which is a sensitive file.`
    };
  return {
    safe: !0
  }
}
// @from(Ln 441408, Col 0)
function WEA(A) {
  return new Set([EQ(), ...A.additionalWorkingDirectories.keys()])
}
// @from(Ln 441412, Col 0)
function WS(A, Q) {
  return pAA(A).every((G) => Array.from(WEA(Q)).some((Z) => yd(G, Z)))
}
// @from(Ln 441416, Col 0)
function yd(A, Q) {
  let B = Y4(A),
    G = Y4(Q),
    Z = B.replace(/^\/private\/var\//, "/var/").replace(/^\/private\/tmp(\/|$)/, "/tmp$1"),
    Y = G.replace(/^\/private\/var\//, "/var/").replace(/^\/private\/tmp(\/|$)/, "/tmp$1"),
    J = _p(Z),
    X = _p(Y),
    I = GX9(X, J);
  if (I === "") return !0;
  if (hGA(I)) return !1;
  return !fe.isAbsolute(I)
}
// @from(Ln 441429, Col 0)
function e$7(A) {
  switch (A) {
    case "cliArg":
    case "command":
    case "session":
      return Y4(EQ());
    case "userSettings":
    case "policySettings":
    case "projectSettings":
    case "localSettings":
    case "flagSettings":
      return DIA(A)
  }
}
// @from(Ln 441444, Col 0)
function OP0(A) {
  return fe.join(kU, A)
}
// @from(Ln 441448, Col 0)
function AC7({
  patternRoot: A,
  pattern: Q,
  rootPath: B
}) {
  let G = fe.join(A, Q);
  if (A === B) return OP0(Q);
  else if (G.startsWith(`${B}${kU}`)) {
    let Z = G.slice(B.length);
    return OP0(Z)
  } else {
    let Z = fe.relative(B, A);
    if (!Z || Z.startsWith(`..${kU}`) || Z === "..") return null;
    else {
      let Y = fe.join(Z, Q);
      return OP0(Y)
    }
  }
}
// @from(Ln 441468, Col 0)
function THA(A, Q) {
  let B = new Set(A.get(null) ?? []);
  for (let [G, Z] of A.entries()) {
    if (G === null) continue;
    for (let Y of Z) {
      let J = AC7({
        patternRoot: G,
        pattern: Y,
        rootPath: Q
      });
      if (J) B.add(J)
    }
  }
  return Array.from(B)
}
// @from(Ln 441484, Col 0)
function PHA(A) {
  let Q = IX9(A, "read", "deny"),
    B = new Map;
  for (let [G, Z] of Q.entries()) B.set(G, Array.from(Z.keys()));
  return B
}
// @from(Ln 441491, Col 0)
function QC7(A, Q) {
  if (A.startsWith(`${kU}${kU}`)) {
    let G = A.slice(1);
    if ($Q() === "windows" && G.match(/^\/[a-z]\//i)) {
      let Z = G[1]?.toUpperCase() ?? "C",
        Y = G.slice(2),
        J = `${Z}:\\`;
      return {
        relativePattern: Y.startsWith("/") ? Y.slice(1) : Y,
        root: J
      }
    }
    return {
      relativePattern: G,
      root: kU
    }
  } else if (A.startsWith(`~${kU}`)) return {
    relativePattern: A.slice(1),
    root: c$7()
  };
  else if (A.startsWith(kU)) return {
    relativePattern: A,
    root: e$7(Q)
  };
  let B = A;
  if (A.startsWith(`.${kU}`)) B = A.slice(2);
  return {
    relativePattern: B,
    root: null
  }
}
// @from(Ln 441523, Col 0)
function IX9(A, Q, B) {
  let G = (() => {
      switch (Q) {
        case "edit":
          return I8;
        case "read":
          return z3
      }
    })(),
    Z = VP0(A, G, B),
    Y = new Map;
  for (let [J, X] of Z.entries()) {
    let {
      relativePattern: I,
      root: D
    } = QC7(J, X.source), W = Y.get(D);
    if (W === void 0) W = new Map, Y.set(D, W);
    W.set(I, X)
  }
  return Y
}
// @from(Ln 441545, Col 0)
function AE(A, Q, B, G) {
  let Z = Y4(A);
  if ($Q() === "windows" && Z.includes("\\")) Z = iy(Z);
  let Y = IX9(Q, B, G);
  for (let [J, X] of Y.entries()) {
    let I = Array.from(X.keys()).map((V) => {
        let F = V;
        if (J === kU && V.startsWith(kU)) F = V.slice(1);
        if (F.endsWith("/**")) F = F.slice(0, -3);
        return F
      }),
      D = BX9.default().add(I),
      W = GX9(J ?? o1(), Z ?? o1());
    if (W.startsWith(`..${kU}`)) continue;
    if (!W) continue;
    let K = D.test(W);
    if (K.ignored && K.rule) {
      let V = K.rule.pattern,
        F = V + "/**";
      if (X.has(F)) return X.get(F) ?? null;
      if (J === kU && !V.startsWith(kU)) {
        V = kU + V;
        let H = V + "/**";
        if (X.has(H)) return X.get(H) ?? null
      }
      return X.get(V) ?? null
    }
  }
  return null
}
// @from(Ln 441576, Col 0)
function Jr(A, Q, B) {
  if (typeof A.getPath !== "function") return {
    behavior: "ask",
    message: `Claude requested permissions to use ${A.name}, but you haven't granted it yet.`
  };
  let G = A.getPath(Q),
    Z = pAA(G);
  for (let W of Z)
    if (W.startsWith("\\\\") || W.startsWith("//")) return {
      behavior: "ask",
      message: `Claude requested permissions to read from ${G}, which appears to be a UNC path that could access network resources.`,
      decisionReason: {
        type: "other",
        reason: "UNC path detected (defense-in-depth check)"
      }
    };
  for (let W of Z)
    if (XX9(W)) return {
      behavior: "ask",
      message: `Claude requested permissions to read from ${G}, which contains a suspicious Windows path pattern that requires manual approval.`,
      decisionReason: {
        type: "other",
        reason: "Path contains suspicious Windows-specific patterns (alternate data streams, short names, long path prefixes, or three or more consecutive dots) that require manual verification"
      }
    };
  for (let W of Z) {
    let K = AE(W, B, "read", "deny");
    if (K) return {
      behavior: "deny",
      message: `Permission to read ${G} has been denied.`,
      decisionReason: {
        type: "rule",
        rule: K
      }
    }
  }
  for (let W of Z) {
    let K = AE(W, B, "read", "ask");
    if (K) return {
      behavior: "ask",
      message: `Claude requested permissions to read from ${G}, but you haven't granted it yet.`,
      decisionReason: {
        type: "rule",
        rule: K
      }
    }
  }
  let Y = g6A(A, Q, B);
  if (Y.behavior === "allow") return Y;
  if (WS(G, B)) return {
    behavior: "allow",
    updatedInput: Q,
    decisionReason: {
      type: "mode",
      mode: "default"
    }
  };
  let X = Y4(G),
    I = xq0(X, Q);
  if (I.behavior !== "passthrough") return I;
  let D = AE(G, B, "read", "allow");
  if (D) return {
    behavior: "allow",
    updatedInput: Q,
    decisionReason: {
      type: "rule",
      rule: D
    }
  };
  return {
    behavior: "ask",
    message: `Claude requested permissions to read from ${G}, but you haven't granted it yet.`,
    suggestions: q$1(G, "read", B),
    decisionReason: {
      type: "workingDir",
      reason: "Path is outside allowed working directories"
    }
  }
}
// @from(Ln 441656, Col 0)
function g6A(A, Q, B) {
  if (typeof A.getPath !== "function") return {
    behavior: "ask",
    message: `Claude requested permissions to use ${A.name}, but you haven't granted it yet.`
  };
  let G = A.getPath(Q),
    Z = pAA(G);
  for (let W of Z) {
    let K = AE(W, B, "edit", "deny");
    if (K) return {
      behavior: "deny",
      message: `Permission to edit ${G} has been denied.`,
      decisionReason: {
        type: "rule",
        rule: K
      }
    }
  }
  let Y = Y4(G),
    J = BC7(Y, Q);
  if (J.behavior !== "passthrough") return J;
  let X = Sq0(G);
  if (!X.safe) return {
    behavior: "ask",
    message: X.message,
    decisionReason: {
      type: "other",
      reason: X.message
    }
  };
  for (let W of Z) {
    let K = AE(W, B, "edit", "ask");
    if (K) return {
      behavior: "ask",
      message: `Claude requested permissions to write to ${G}, but you haven't granted it yet.`,
      decisionReason: {
        type: "rule",
        rule: K
      }
    }
  }
  let I = WS(G, B);
  if (B.mode === "acceptEdits" && I) return {
    behavior: "allow",
    updatedInput: Q,
    decisionReason: {
      type: "mode",
      mode: B.mode
    }
  };
  let D = AE(G, B, "edit", "allow");
  if (D) return {
    behavior: "allow",
    updatedInput: Q,
    decisionReason: {
      type: "rule",
      rule: D
    }
  };
  return {
    behavior: "ask",
    message: `Claude requested permissions to write to ${G}, but you haven't granted it yet.`,
    suggestions: q$1(G, "write", B),
    decisionReason: !I ? {
      type: "workingDir",
      reason: "Path is outside allowed working directories"
    } : void 0
  }
}
// @from(Ln 441726, Col 0)
function q$1(A, Q, B) {
  let G = !WS(A, B);
  if (Q === "read" && G) {
    let Z = Hg(A);
    return pAA(Z).map((X) => N01(X, "session")).filter((X) => X !== void 0)
  }
  if (Q === "write" || Q === "create") {
    let Z = [{
      type: "setMode",
      mode: "acceptEdits",
      destination: "session"
    }];
    if (G) {
      let Y = Hg(A),
        J = pAA(Y);
      Z.push({
        type: "addDirectories",
        directories: J,
        destination: "session"
      })
    }
    return Z
  }
  return [{
    type: "setMode",
    mode: "acceptEdits",
    destination: "session"
  }]
}
// @from(Ln 441756, Col 0)
function BC7(A, Q) {
  if (ZX9(A)) return {
    behavior: "allow",
    updatedInput: Q,
    decisionReason: {
      type: "other",
      reason: "Plan files for current session are allowed for writing"
    }
  };
  if (JX9(A)) return {
    behavior: "allow",
    updatedInput: Q,
    decisionReason: {
      type: "other",
      reason: "Scratchpad files for current session are allowed for writing"
    }
  };
  return {
    behavior: "passthrough",
    message: ""
  }
}
// @from(Ln 441779, Col 0)
function xq0(A, Q) {
  if (r$7(A)) return {
    behavior: "allow",
    updatedInput: Q,
    decisionReason: {
      type: "other",
      reason: "Session memory files are allowed for reading"
    }
  };
  if (s$7(A)) return {
    behavior: "allow",
    updatedInput: Q,
    decisionReason: {
      type: "other",
      reason: "Project directory files are allowed for reading"
    }
  };
  if (ZX9(A)) return {
    behavior: "allow",
    updatedInput: Q,
    decisionReason: {
      type: "other",
      reason: "Plan files for current session are allowed for reading"
    }
  };
  let B = ZZ1(),
    G = B.endsWith(he) ? B : B + he;
  if (A === B || A.startsWith(G)) return {
    behavior: "allow",
    updatedInput: Q,
    decisionReason: {
      type: "other",
      reason: "Tool result files are allowed for reading"
    }
  };
  if (JX9(A)) return {
    behavior: "allow",
    updatedInput: Q,
    decisionReason: {
      type: "other",
      reason: "Scratchpad files for current session are allowed for reading"
    }
  };
  let Z = V71();
  if (A.startsWith(Z)) return {
    behavior: "allow",
    updatedInput: Q,
    decisionReason: {
      type: "other",
      reason: "Project temp directory files are allowed for reading"
    }
  };
  return {
    behavior: "passthrough",
    message: ""
  }
}
// @from(Ln 441836, Col 4)
BX9
// @from(Ln 441836, Col 9)
l$7
// @from(Ln 441836, Col 14)
i$7
// @from(Ln 441836, Col 19)
kU
// @from(Ln 441837, Col 4)
AY = w(() => {
  C0();
  w6();
  V2();
  oZ();
  fGA();
  d4();
  c3();
  oZ();
  dW();
  YZ();
  cW();
  GB();
  YI();
  DQ();
  E$A();
  GV1();
  UF();
  wr();
  BX9 = c(VyA(), 1), l$7 = [".gitconfig", ".gitmodules", ".bashrc", ".bash_profile", ".zshrc", ".zprofile", ".profile", ".ripgreprc", ".mcp.json"], i$7 = [".git", ".vscode", ".idea", ".claude"];
  kU = fe.sep
})
// @from(Ln 441878, Col 0)
function JC7(A) {
  let Q = /[*?[{]/,
    B = A.match(Q);
  if (!B || B.index === void 0) {
    let X = _P0(A),
      I = w$1(A);
    return {
      baseDir: X,
      relativePattern: I
    }
  }
  let G = A.slice(0, B.index),
    Z = Math.max(G.lastIndexOf("/"), G.lastIndexOf(MP0));
  if (Z === -1) return {
    baseDir: "",
    relativePattern: A
  };
  let Y = G.slice(0, Z),
    J = A.slice(Z + 1);
  if (Y === "" && Z === 0) Y = "/";
  if ($Q() === "windows" && /^[A-Za-z]:$/.test(Y)) Y = Y + MP0;
  return {
    baseDir: Y,
    relativePattern: J
  }
}
// @from(Ln 441904, Col 0)
async function av2(A, Q, {
  limit: B,
  offset: G
}, Z, Y) {
  let J = Q,
    X = A;
  if (N$1(A)) {
    let {
      baseDir: H,
      relativePattern: E
    } = JC7(A);
    if (H) J = H, X = E
  }
  let I = THA(PHA(Y), J),
    D = ["--files", "--glob", X, "--sort=modified", "--no-ignore", "--hidden"];
  for (let H of I) D.push("--glob", `!${H}`);
  let K = (await gy(D, J, Z)).map((H) => N$1(H) ? H : KX9(J, H)),
    V = K.length > G + B;
  return {
    files: K.slice(G, G + B),
    truncated: V
  }
}
// @from(Ln 441928, Col 0)
function HX9(A) {
  try {
    return vA().readFileSync(A, {
      encoding: "utf8"
    })
  } catch (Q) {
    return e(Q), null
  }
}
// @from(Ln 441938, Col 0)
function mz(A) {
  let Q = vA();
  return Math.floor(Q.statSync(A).mtimeMs)
}
// @from(Ln 441943, Col 0)
function L12(A, Q = 0, B) {
  let Y = vA().readFileSync(A, {
      encoding: "utf8"
    }).split(/\r?\n/),
    J = B !== void 0 && Y.length - Q > B ? Y.slice(Q, Q + B) : Y.slice(Q);
  return {
    content: J.join(`
`),
    lineCount: J.length,
    totalLines: Y.length
  }
}
// @from(Ln 441956, Col 0)
function ns(A, Q, B, G) {
  let Z = Q;
  if (G === "CRLF") Z = Q.split(`
`).join(`\r
`);
  yR(A, Z, {
    encoding: B
  })
}
// @from(Ln 441966, Col 0)
function RW(A) {
  try {
    let B = vA(),
      {
        resolvedPath: G
      } = xI(B, A),
      {
        buffer: Z,
        bytesRead: Y
      } = B.readSync(G, {
        length: 4096
      });
    if (Y === 0) return "utf8";
    if (Y >= 2) {
      if (Z[0] === 255 && Z[1] === 254) return "utf16le"
    }
    if (Y >= 3 && Z[0] === 239 && Z[1] === 187 && Z[2] === 191) return "utf8";
    return "utf8"
  } catch (B) {
    return e(B), "utf8"
  }
}
// @from(Ln 441989, Col 0)
function _c(A, Q = "utf8") {
  try {
    let B = vA(),
      {
        resolvedPath: G
      } = xI(B, A),
      {
        buffer: Z,
        bytesRead: Y
      } = B.readSync(G, {
        length: 4096
      }),
      J = Z.toString(Q, 0, Y);
    return XC7(J)
  } catch (B) {
    return e(B), "LF"
  }
}
// @from(Ln 442008, Col 0)
function XC7(A) {
  let Q = 0,
    B = 0;
  for (let G = 0; G < A.length; G++)
    if (A[G] === `
`)
      if (G > 0 && A[G - 1] === "\r") Q++;
      else B++;
  return Q > B ? "CRLF" : "LF"
}
// @from(Ln 442019, Col 0)
function Yr(A) {
  let Q = N$1(A) ? VX9(A) : WX9(o1(), A),
    B = vA(),
    G = String.fromCharCode(8239),
    Z = /^(.+)([ \u202F])(AM|PM)(\.png)$/,
    Y = w$1(Q).match(Z);
  if (Y) {
    if (B.existsSync(Q)) return Q;
    let J = Y[2],
      X = J === " " ? G : " ",
      I = Q.replace(`${J}${Y[3]}${Y[4]}`, `${X}${Y[3]}${Y[4]}`);
    if (B.existsSync(I)) return I
  }
  return Q
}
// @from(Ln 442035, Col 0)
function EHA(A) {
  return A.replace(/^\t+/gm, (Q) => "  ".repeat(Q.length))
}
// @from(Ln 442039, Col 0)
function IC7(A) {
  let Q = A ? Y4(A) : void 0,
    B = Q ? GC7(o1(), Q) : void 0;
  return {
    absolutePath: Q,
    relativePath: B
  }
}
// @from(Ln 442048, Col 0)
function k6(A) {
  let {
    relativePath: Q
  } = IC7(A);
  if (Q && !Q.startsWith("..")) return Q;
  let B = ZC7();
  if (A.startsWith(B + MP0)) return "~" + A.slice(B.length);
  return A
}
// @from(Ln 442058, Col 0)
function C71(A) {
  let Q = vA();
  try {
    let B = _P0(A),
      G = w$1(A, RP0(A));
    if (!Q.existsSync(B)) return;
    let J = Q.readdirSync(B).filter((X) => w$1(X.name, RP0(X.name)) === G && KX9(B, X.name) !== A)[0];
    if (J) return J.name;
    return
  } catch (B) {
    e(B);
    return
  }
}
// @from(Ln 442073, Col 0)
function Xr({
  content: A,
  startLine: Q
}) {
  if (!A) return "";
  return A.split(/\r?\n/).map((G, Z) => {
    let Y = Z + Q,
      J = String(Y);
    if (J.length >= 6) return `${J}→${G}`;
    return `${J.padStart(6," ")}→${G}`
  }).join(`
`)
}
// @from(Ln 442087, Col 0)
function eMB(A) {
  let Q = vA();
  if (!Q.existsSync(A)) return !0;
  return Q.isDirEmptySync(A)
}
// @from(Ln 442093, Col 0)
function nK(A) {
  let Q = vA(),
    {
      resolvedPath: B,
      isSymlink: G
    } = xI(Q, A);
  if (G) k(`Reading through symlink: ${A} -> ${B}`);
  let Z = RW(B);
  return Q.readFileSync(B, {
    encoding: Z
  }).replaceAll(`\r
`, `
`)
}
// @from(Ln 442108, Col 0)
function Q$0(A) {
  let {
    content: Q
  } = V2Q.readFile(A);
  return Q
}
// @from(Ln 442115, Col 0)
function yR(A, Q, B = {
  encoding: "utf-8"
}) {
  let G = vA(),
    Z = A;
  if (G.existsSync(A)) try {
    let J = G.readlinkSync(A);
    Z = N$1(J) ? J : WX9(_P0(A), J), k(`Writing through symlink: ${A} -> ${Z}`)
  } catch (J) {
    Z = A
  }
  let Y = `${Z}.tmp.${process.pid}.${Date.now()}`;
  try {
    k(`Writing to temp file: ${Y}`);
    let J, X = G.existsSync(Z);
    if (X) J = G.statSync(Z).mode, k(`Preserving file permissions: ${J.toString(8)}`);
    else if (B.mode !== void 0) J = B.mode, k(`Setting permissions for new file: ${J.toString(8)}`);
    let I = {
      encoding: B.encoding,
      flush: !0
    };
    if (!X && B.mode !== void 0) I.mode = B.mode;
    if (DX9(Y, Q, I), k(`Temp file written successfully, size: ${Q.length} bytes`), X && J !== void 0) YC7(Y, J), k("Applied original permissions to temp file");
    k(`Renaming ${Y} to ${Z}`), G.renameSync(Y, Z), k(`File ${Z} written atomically`)
  } catch (J) {
    k(`Failed to write file atomically: ${J}`), e(J), l("tengu_atomic_write_error", {});
    try {
      if (G.existsSync(Y)) k(`Cleaning up temp file: ${Y}`), G.unlinkSync(Y)
    } catch (X) {
      k(`Failed to clean up temp file: ${X}`)
    }
    k(`Falling back to non-atomic write for ${Z}`);
    try {
      let X = {
        encoding: B.encoding,
        flush: !0
      };
      if (!G.existsSync(Z) && B.mode !== void 0) X.mode = B.mode;
      DX9(Z, Q, X), k(`File ${Z} written successfully with non-atomic fallback`)
    } catch (X) {
      throw k(`Non-atomic write also failed: ${X}`), X
    }
  }
}
// @from(Ln 442160, Col 0)
function xD(A) {
  let Q = A / 1024;
  if (Q < 1) return `${A} bytes`;
  if (Q < 1024) return `${Q.toFixed(1).replace(/\.0$/,"")}KB`;
  let B = Q / 1024;
  if (B < 1024) return `${B.toFixed(1).replace(/\.0$/,"")}MB`;
  return `${(B/1024).toFixed(1).replace(/\.0$/,"")}GB`
}
// @from(Ln 442169, Col 0)
function ge(A) {
  let Q = RP0(A);
  if (!Q) return "unknown";
  return FX9.getLanguage(Q.slice(1))?.name ?? "unknown"
}
// @from(Ln 442175, Col 0)
function U71(A, Q = AxA) {
  try {
    return vA().statSync(A).size <= Q
  } catch {
    return !1
  }
}
// @from(Ln 442183, Col 0)
function UD1(A) {
  let Q = VX9(A);
  if ($Q() === "windows") Q = Q.replace(/\//g, "\\").toLowerCase();
  return Q
}
// @from(Ln 442189, Col 0)
function dT2(A, Q) {
  return UD1(A) === UD1(Q)
}
// @from(Ln 442192, Col 4)
FX9
// @from(Ln 442192, Col 9)
AxA = 262144
// @from(Ln 442193, Col 2)
xv2
// @from(Ln 442194, Col 4)
y9 = w(() => {
  v1();
  cCA();
  T1();
  iZ();
  Z0();
  uy();
  V2();
  Y9();
  DQ();
  F2Q();
  AY();
  c3();
  oZ();
  FX9 = c(MO1(), 1);
  xv2 = W0(async () => {
    let A = c9();
    setTimeout(() => {
      A.abort()
    }, 1000);
    let Q = await Js0(o1(), A.signal, 15),
      B = 0;
    for (let G of Q)
      if (_c(G) === "CRLF") B++;
    return B > 3 ? "CRLF" : "LF"
  })
})
// @from(Ln 442230, Col 0)
function $X9() {
  if ($Q() !== "windows") return !1;
  if (TP0("C:\\Program Files\\ClaudeCode")) return !1;
  return TP0("C:\\ProgramData\\ClaudeCode\\managed-settings.json")
}
// @from(Ln 442236, Col 0)
function CX9() {
  return PuA(xL(), "managed-settings.json")
}
// @from(Ln 442240, Col 0)
function DC7(A, Q) {
  if (typeof A === "object" && A && "code" in A && A.code === "ENOENT") k(`Broken symlink or missing file encountered for settings.json at path: ${Q}`);
  else e(A instanceof Error ? A : Error(String(A)))
}
// @from(Ln 442245, Col 0)
function PP0(A) {
  let Q = vA();
  if (!Q.existsSync(A)) return {
    settings: null,
    errors: []
  };
  try {
    let {
      resolvedPath: B
    } = xI(Q, A), G = nK(B);
    if (G.trim() === "") return {
      settings: {},
      errors: []
    };
    let Z = c5(G, !1),
      Y = Ld.safeParse(Z);
    if (!Y.success) return {
      settings: null,
      errors: k$0(Y.error, A)
    };
    return {
      settings: Y.data,
      errors: []
    }
  } catch (B) {
    return DC7(B, A), {
      settings: null,
      errors: []
    }
  }
}
// @from(Ln 442277, Col 0)
function DIA(A) {
  switch (A) {
    case "userSettings":
      return juA(zQ());
    case "policySettings":
    case "projectSettings":
    case "localSettings":
      return juA(EQ());
    case "flagSettings": {
      let Q = Jq1();
      return Q ? zX9(juA(Q)) : juA(EQ())
    }
  }
}
// @from(Ln 442292, Col 0)
function bH(A) {
  switch (A) {
    case "userSettings":
      return PuA(DIA(A), "settings.json");
    case "projectSettings":
    case "localSettings":
      return PuA(DIA(A), NVA(A));
    case "policySettings":
      return CX9();
    case "flagSettings":
      return Jq1()
  }
}
// @from(Ln 442306, Col 0)
function NVA(A) {
  switch (A) {
    case "projectSettings":
      return PuA(".claude", "settings.json");
    case "localSettings":
      return PuA(".claude", "settings.local.json")
  }
}
// @from(Ln 442315, Col 0)
function dB(A) {
  if (A === "policySettings") {
    let G = oH0();
    if (G && Object.keys(G).length > 0) return G
  }
  let Q = bH(A);
  if (!Q) return null;
  let {
    settings: B
  } = PP0(Q);
  return B
}
// @from(Ln 442328, Col 0)
function oQ9() {
  let A = oH0();
  if (A && Object.keys(A).length > 0) return "remote";
  let Q = CX9(),
    {
      settings: B
    } = PP0(Q);
  if (B && Object.keys(B).length > 0) return "local";
  return null
}
// @from(Ln 442339, Col 0)
function pB(A, Q) {
  if (A === "policySettings" || A === "flagSettings") return {
    error: null
  };
  let B = bH(A);
  if (!B) return {
    error: null
  };
  try {
    let G = zX9(B);
    if (!vA().existsSync(G)) vA().mkdirSync(G);
    let Z = dB(A);
    if (!Z && vA().existsSync(B)) {
      let J = nK(B),
        X = c5(J);
      if (X === null) return {
        error: Error(`Invalid JSON syntax in settings file at ${B}`)
      };
      if (X && typeof X === "object") Z = X, k(`Using raw settings from ${B} due to validation failure`)
    }
    let Y = sdA(Z || {}, Q, (J, X, I, D) => {
      if (X === void 0 && D && typeof I === "string") {
        delete D[I];
        return
      }
      if (Array.isArray(X)) return X;
      return
    });
    if (HC.markInternalWrite(A), yR(B, eA(Y, null, 2) + `
`), vP(), A === "localSettings") iR0(NVA("localSettings"), EQ())
  } catch (G) {
    let Z = Error(`Failed to read raw settings from ${B}: ${G}`);
    return e(Z), {
      error: Z
    }
  }
  return {
    error: null
  }
}
// @from(Ln 442380, Col 0)
function WC7(A, Q) {
  let B = [...A, ...Q];
  return Array.from(new Set(B))
}
// @from(Ln 442385, Col 0)
function EX9(A, Q) {
  if (Array.isArray(A) && Array.isArray(Q)) return WC7(A, Q);
  return
}
// @from(Ln 442390, Col 0)
function UX9(A) {
  let Q = Ld.strip().parse(A),
    B = ["permissions", "sandbox", "hooks"],
    G = [],
    Z = {
      permissions: new Set(["allow", "deny", "ask", "defaultMode", "disableBypassPermissionsMode", "additionalDirectories"]),
      sandbox: new Set(["network", "ignoreViolations", "excludedCommands", "autoAllowBashIfSandboxed", "enableWeakerNestedSandbox"]),
      hooks: new Set(["PreToolUse", "PostToolUse", "Notification", "UserPromptSubmit", "SessionStart", "SessionEnd", "Stop", "SubagentStop", "PreCompact"])
    };
  for (let Y of Object.keys(Q))
    if (B.includes(Y) && Q[Y] && typeof Q[Y] === "object") {
      let J = Q[Y],
        X = Z[Y];
      if (X) {
        for (let I of Object.keys(J))
          if (X.has(I)) G.push(`${Y}.${I}`)
      }
    } else G.push(Y);
  return G.sort()
}
// @from(Ln 442411, Col 0)
function vP() {
  TuA = null
}
// @from(Ln 442415, Col 0)
function KC7() {
  if (jP0) return {
    settings: {},
    errors: []
  };
  let A = Date.now();
  OB("info", "settings_load_started"), jP0 = !0;
  try {
    let Q = {},
      B = [],
      G = new Set,
      Z = new Set;
    for (let J of tQA()) {
      if (J === "policySettings") {
        let K = dB("policySettings");
        if (K) Q = sdA(Q, K, EX9);
        continue
      }
      let X = bH(J);
      if (!X) continue;
      let I = juA(X);
      if (Z.has(I)) continue;
      Z.add(I);
      let {
        settings: D,
        errors: W
      } = PP0(X);
      for (let K of W) {
        let V = `${K.file}:${K.path}:${K.message}`;
        if (!G.has(V)) G.add(V), B.push(K)
      }
      if (D) Q = sdA(Q, D, EX9)
    }
    let Y = ["user", "project", "local"];
    return B.push(...Y.flatMap((J) => GW(J).errors)), OB("info", "settings_load_completed", {
      duration_ms: Date.now() - A,
      source_count: Z.size,
      error_count: B.length
    }), {
      settings: Q,
      errors: B
    }
  } finally {
    jP0 = !1
  }
}
// @from(Ln 442462, Col 0)
function r3() {
  let {
    settings: A
  } = kP();
  return A || {}
}
// @from(Ln 442469, Col 0)
function kP() {
  if (TuA !== null) return TuA;
  return TuA = KC7(), TuA
}
// @from(Ln 442473, Col 4)
TuA = null
// @from(Ln 442474, Col 2)
xL
// @from(Ln 442474, Col 6)
jP0 = !1
// @from(Ln 442475, Col 2)
jQ
// @from(Ln 442476, Col 4)
GB = w(() => {
  Y9();
  eh0();
  y9();
  DQ();
  vI();
  v1();
  T1();
  PL();
  c3();
  YI();
  wd();
  C0();
  nR0();
  fQ();
  f$0();
  G$();
  WBA();
  iFA();
  A0();
  xL = W0(function () {
    switch ($Q()) {
      case "macos":
        return "/Library/Application Support/ClaudeCode";
      case "windows":
        if (TP0("C:\\Program Files\\ClaudeCode")) return "C:\\Program Files\\ClaudeCode";
        return "C:\\ProgramData\\ClaudeCode";
      default:
        return "/etc/claude-code"
    }
  });
  jQ = r3
})
// @from(Ln 442513, Col 0)
function o3A(A, Q) {
  let B = `mcp__${e3(Q)}__`;
  return A.filter((G) => G.name?.startsWith(B))
}
// @from(Ln 442518, Col 0)
function uE1(A, Q) {
  let B = `mcp__${e3(Q)}__`;
  return A.filter((G) => G.name?.startsWith(B))
}
// @from(Ln 442523, Col 0)
function G_0(A, Q) {
  let B = `mcp__${e3(Q)}__`;
  return A.filter((G) => !G.name?.startsWith(B))
}
// @from(Ln 442528, Col 0)
function Z_0(A, Q) {
  let B = `mcp__${e3(Q)}__`;
  return A.filter((G) => !G.name?.startsWith(B))
}
// @from(Ln 442533, Col 0)
function Y_0(A, Q) {
  let B = {
    ...A
  };
  return delete B[Q], B
}
// @from(Ln 442540, Col 0)
function q99(A) {
  return `mcp__${e3(A)}__`
}
// @from(Ln 442544, Col 0)
function ZJ9(A, Q) {
  return qF(A)?.serverName === Q
}
// @from(Ln 442548, Col 0)
function $j(A) {
  return A.name?.startsWith("mcp__") || A.isMcp === !0
}
// @from(Ln 442552, Col 0)
function qF(A) {
  let Q = A.split("__"),
    [B, G, ...Z] = Q;
  if (B !== "mcp" || !G) return null;
  let Y = Z.length > 0 ? Z.join("__") : void 0;
  return {
    serverName: G,
    toolName: Y
  }
}
// @from(Ln 442563, Col 0)
function cE1(A, Q) {
  let B = `mcp__${e3(Q)}__`;
  return A.replace(B, "")
}
// @from(Ln 442568, Col 0)
function pE1(A) {
  let Q = A.replace(/\s*\(MCP\)\s*$/, "");
  Q = Q.trim();
  let B = Q.indexOf(" - ");
  if (B !== -1) return Q.substring(B + 3).trim();
  return Q
}
// @from(Ln 442576, Col 0)
function N$(A) {
  let Q = vA();
  switch (A) {
    case "user": {
      let B = wH(),
        G = Q.existsSync(B);
      return `${B}${G?"":" (file does not exist)"}`
    }
    case "project": {
      let B = VC7(o1(), ".mcp.json"),
        G = Q.existsSync(B);
      return `${B}${G?"":" (file does not exist)"}`
    }
    case "local":
      return `${wH()} [project: ${o1()}]`;
    case "dynamic":
      return "Dynamically configured";
    case "enterprise": {
      let B = MF1(),
        G = Q.existsSync(B);
      return `${B}${G?"":" (file does not exist)"}`
    }
    case "claudeai":
      return "claude.ai";
    default:
      return A
  }
}
// @from(Ln 442605, Col 0)
function HgA(A) {
  switch (A) {
    case "local":
      return "Local config (private to you in this project)";
    case "project":
      return "Project config (shared via .mcp.json)";
    case "user":
      return "User config (available in all your projects)";
    case "dynamic":
      return "Dynamic config (from command line)";
    case "enterprise":
      return "Enterprise config (managed by your organization)";
    case "claudeai":
      return "claude.ai config";
    default:
      return A
  }
}
// @from(Ln 442624, Col 0)
function z$A(A) {
  if (!A) return "local";
  if (!ZI0.options.includes(A)) throw Error(`Invalid scope: ${A}. Must be one of: ${ZI0.options.join(", ")}`);
  return A
}
// @from(Ln 442630, Col 0)
function qX9(A) {
  if (!A) return "stdio";
  if (A !== "stdio" && A !== "sse" && A !== "http") throw Error(`Invalid transport type: ${A}. Must be one of: stdio, sse, http`);
  return A
}
// @from(Ln 442636, Col 0)
function SP0(A) {
  let Q = {};
  for (let B of A) {
    let G = B.indexOf(":");
    if (G === -1) throw Error(`Invalid header format: "${B}". Expected format: "Header-Name: value"`);
    let Z = B.substring(0, G).trim(),
      Y = B.substring(G + 1).trim();
    if (!Z) throw Error(`Invalid header: "${B}". Header name cannot be empty.`);
    Q[Z] = Y
  }
  return Q
}
// @from(Ln 442649, Col 0)
function RF1(A) {
  let Q = jQ(),
    B = e3(A);
  if (Q?.disabledMcpjsonServers?.some((G) => e3(G) === B)) return "rejected";
  if (Q?.enabledMcpjsonServers?.some((G) => e3(G) === B) || Q?.enableAllProjectMcpServers) return "approved";
  if (L1().bypassPermissionsModeAccepted && iK("projectSettings")) return "approved";
  if (p2() && iK("projectSettings")) return "approved";
  return "pending"
}
// @from(Ln 442659, Col 0)
function WM0(A) {
  if (!$j({
      name: A
    })) return null;
  let Q = qF(A);
  if (!Q) return null;
  let B = vs(Q.serverName);
  if (!B && Q.serverName.startsWith("claude_ai_")) return "claudeai";
  return B?.scope ?? null
}
// @from(Ln 442670, Col 0)
function FC7(A) {
  return A.type === "stdio" || A.type === void 0
}
// @from(Ln 442674, Col 0)
function HC7(A) {
  return A.type === "sse"
}
// @from(Ln 442678, Col 0)
function EC7(A) {
  return A.type === "http"
}
// @from(Ln 442682, Col 0)
function zC7(A) {
  return A.type === "ws"
}
// @from(Ln 442686, Col 0)
function w99(A) {
  let Q = new Map;
  for (let G of A) {
    if (!G.mcpServers?.length) continue;
    for (let Z of G.mcpServers) {
      if (typeof Z === "string") continue;
      let Y = Object.entries(Z);
      if (Y.length !== 1) continue;
      let [J, X] = Y[0], I = Q.get(J);
      if (I) {
        if (!I.sourceAgents.includes(G.agentType)) I.sourceAgents.push(G.agentType)
      } else Q.set(J, {
        config: {
          ...X,
          name: J
        },
        sourceAgents: [G.agentType]
      })
    }
  }
  let B = [];
  for (let [G, {
      config: Z,
      sourceAgents: Y
    }] of Q)
    if (FC7(Z)) B.push({
      name: G,
      sourceAgents: Y,
      transport: "stdio",
      command: Z.command,
      needsAuth: !1
    });
    else if (HC7(Z)) B.push({
    name: G,
    sourceAgents: Y,
    transport: "sse",
    url: Z.url,
    needsAuth: !0
  });
  else if (EC7(Z)) B.push({
    name: G,
    sourceAgents: Y,
    transport: "http",
    url: Z.url,
    needsAuth: !0
  });
  else if (zC7(Z)) B.push({
    name: G,
    sourceAgents: Y,
    transport: "ws",
    url: Z.url,
    needsAuth: !1
  });
  return B.sort((G, Z) => G.name.localeCompare(Z.name))
}
// @from(Ln 442741, Col 4)
PJ = w(() => {
  GB();
  D4A();
  p3();
  V2();
  DQ();
  G$();
  YI();
  C0();
  GQ()
})
// @from(Ln 442753, Col 0)
function U3A() {
  return parseInt(process.env.MCP_TOOL_TIMEOUT || "", 10) || $C7
}
// @from(Ln 442757, Col 0)
function CC7() {
  if (a1(process.env.ENABLE_TOOL_SEARCH) && a1(process.env.ENABLE_EXPERIMENTAL_MCP_CLI) && !NX9) NX9 = !0, console.warn(I1.yellow(`Warning: Both ENABLE_TOOL_SEARCH and ENABLE_EXPERIMENTAL_MCP_CLI are set to true.
These are mutually exclusive. Using Tool Search mode.`))
}
// @from(Ln 442762, Col 0)
function jJ() {
  return CC7(), k9A() === "mcp-cli"
}
// @from(Ln 442766, Col 0)
function ue() {
  return jJ() && !iX(process.env.ENABLE_MCP_CLI_ENDPOINT)
}
// @from(Ln 442770, Col 0)
function e6A(A) {
  let Q = A.match(/^mcp-cli\s+(call|read)\s+([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)(?:\s+([\s\S]+))?$/);
  if (!Q) return null;
  let [, B, G, Z, Y = ""] = Q;
  if (!B || !G || !Z) return null;
  return {
    command: B,
    server: G,
    tool: Z,
    toolName: Z,
    args: Y,
    fullCommand: A
  }
}
// @from(Ln 442785, Col 0)
function tY9(A) {
  let Q = qF(A);
  if (!Q || !Q.toolName) return null;
  return `${Q.serverName}/${Q.toolName}`
}
// @from(Ln 442790, Col 4)
$C7 = 1e8
// @from(Ln 442791, Col 2)
NX9 = !1
// @from(Ln 442792, Col 4)
$F = w(() => {
  fQ();
  PJ();
  Wb();
  Z3()
})
// @from(Ln 442798, Col 4)
SuA = U((UC7) => {
  class xP0 extends Error {
    constructor(A, Q, B) {
      super(B);
      Error.captureStackTrace(this, this.constructor), this.name = this.constructor.name, this.code = Q, this.exitCode = A, this.nestedError = void 0
    }
  }
  class wX9 extends xP0 {
    constructor(A) {
      super(1, "commander.invalidArgument", A);
      Error.captureStackTrace(this, this.constructor), this.name = this.constructor.name
    }
  }
  UC7.CommanderError = xP0;
  UC7.InvalidArgumentError = wX9
})
// @from(Ln 442814, Col 4)
L$1 = U((OC7) => {
  var {
    InvalidArgumentError: wC7
  } = SuA();
  class LX9 {
    constructor(A, Q) {
      switch (this.description = Q || "", this.variadic = !1, this.parseArg = void 0, this.defaultValue = void 0, this.defaultValueDescription = void 0, this.argChoices = void 0, A[0]) {
        case "<":
          this.required = !0, this._name = A.slice(1, -1);
          break;
        case "[":
          this.required = !1, this._name = A.slice(1, -1);
          break;
        default:
          this.required = !0, this._name = A;
          break
      }
      if (this._name.length > 3 && this._name.slice(-3) === "...") this.variadic = !0, this._name = this._name.slice(0, -3)
    }
    name() {
      return this._name
    }
    _concatValue(A, Q) {
      if (Q === this.defaultValue || !Array.isArray(Q)) return [A];
      return Q.concat(A)
    }
    default (A, Q) {
      return this.defaultValue = A, this.defaultValueDescription = Q, this
    }
    argParser(A) {
      return this.parseArg = A, this
    }
    choices(A) {
      return this.argChoices = A.slice(), this.parseArg = (Q, B) => {
        if (!this.argChoices.includes(Q)) throw new wC7(`Allowed choices are ${this.argChoices.join(", ")}.`);
        if (this.variadic) return this._concatValue(Q, B);
        return Q
      }, this
    }
    argRequired() {
      return this.required = !0, this
    }
    argOptional() {
      return this.required = !1, this
    }
  }

  function LC7(A) {
    let Q = A.name() + (A.variadic === !0 ? "..." : "");
    return A.required ? "<" + Q + ">" : "[" + Q + "]"
  }
  OC7.Argument = LX9;
  OC7.humanReadableArgName = LC7
})
// @from(Ln 442868, Col 4)
yP0 = U((jC7) => {
  var {
    humanReadableArgName: _C7
  } = L$1();
  class OX9 {
    constructor() {
      this.helpWidth = void 0, this.sortSubcommands = !1, this.sortOptions = !1, this.showGlobalOptions = !1
    }
    visibleCommands(A) {
      let Q = A.commands.filter((G) => !G._hidden),
        B = A._getHelpCommand();
      if (B && !B._hidden) Q.push(B);
      if (this.sortSubcommands) Q.sort((G, Z) => {
        return G.name().localeCompare(Z.name())
      });
      return Q
    }
    compareOptions(A, Q) {
      let B = (G) => {
        return G.short ? G.short.replace(/^-/, "") : G.long.replace(/^--/, "")
      };
      return B(A).localeCompare(B(Q))
    }
    visibleOptions(A) {
      let Q = A.options.filter((G) => !G.hidden),
        B = A._getHelpOption();
      if (B && !B.hidden) {
        let G = B.short && A._findOption(B.short),
          Z = B.long && A._findOption(B.long);
        if (!G && !Z) Q.push(B);
        else if (B.long && !Z) Q.push(A.createOption(B.long, B.description));
        else if (B.short && !G) Q.push(A.createOption(B.short, B.description))
      }
      if (this.sortOptions) Q.sort(this.compareOptions);
      return Q
    }
    visibleGlobalOptions(A) {
      if (!this.showGlobalOptions) return [];
      let Q = [];
      for (let B = A.parent; B; B = B.parent) {
        let G = B.options.filter((Z) => !Z.hidden);
        Q.push(...G)
      }
      if (this.sortOptions) Q.sort(this.compareOptions);
      return Q
    }
    visibleArguments(A) {
      if (A._argsDescription) A.registeredArguments.forEach((Q) => {
        Q.description = Q.description || A._argsDescription[Q.name()] || ""
      });
      if (A.registeredArguments.find((Q) => Q.description)) return A.registeredArguments;
      return []
    }
    subcommandTerm(A) {
      let Q = A.registeredArguments.map((B) => _C7(B)).join(" ");
      return A._name + (A._aliases[0] ? "|" + A._aliases[0] : "") + (A.options.length ? " [options]" : "") + (Q ? " " + Q : "")
    }
    optionTerm(A) {
      return A.flags
    }
    argumentTerm(A) {
      return A.name()
    }
    longestSubcommandTermLength(A, Q) {
      return Q.visibleCommands(A).reduce((B, G) => {
        return Math.max(B, Q.subcommandTerm(G).length)
      }, 0)
    }
    longestOptionTermLength(A, Q) {
      return Q.visibleOptions(A).reduce((B, G) => {
        return Math.max(B, Q.optionTerm(G).length)
      }, 0)
    }
    longestGlobalOptionTermLength(A, Q) {
      return Q.visibleGlobalOptions(A).reduce((B, G) => {
        return Math.max(B, Q.optionTerm(G).length)
      }, 0)
    }
    longestArgumentTermLength(A, Q) {
      return Q.visibleArguments(A).reduce((B, G) => {
        return Math.max(B, Q.argumentTerm(G).length)
      }, 0)
    }
    commandUsage(A) {
      let Q = A._name;
      if (A._aliases[0]) Q = Q + "|" + A._aliases[0];
      let B = "";
      for (let G = A.parent; G; G = G.parent) B = G.name() + " " + B;
      return B + Q + " " + A.usage()
    }
    commandDescription(A) {
      return A.description()
    }
    subcommandDescription(A) {
      return A.summary() || A.description()
    }
    optionDescription(A) {
      let Q = [];
      if (A.argChoices) Q.push(`choices: ${A.argChoices.map((B)=>JSON.stringify(B)).join(", ")}`);
      if (A.defaultValue !== void 0) {
        if (A.required || A.optional || A.isBoolean() && typeof A.defaultValue === "boolean") Q.push(`default: ${A.defaultValueDescription||JSON.stringify(A.defaultValue)}`)
      }
      if (A.presetArg !== void 0 && A.optional) Q.push(`preset: ${JSON.stringify(A.presetArg)}`);
      if (A.envVar !== void 0) Q.push(`env: ${A.envVar}`);
      if (Q.length > 0) return `${A.description} (${Q.join(", ")})`;
      return A.description
    }
    argumentDescription(A) {
      let Q = [];
      if (A.argChoices) Q.push(`choices: ${A.argChoices.map((B)=>JSON.stringify(B)).join(", ")}`);
      if (A.defaultValue !== void 0) Q.push(`default: ${A.defaultValueDescription||JSON.stringify(A.defaultValue)}`);
      if (Q.length > 0) {
        let B = `(${Q.join(", ")})`;
        if (A.description) return `${A.description} ${B}`;
        return B
      }
      return A.description
    }
    formatHelp(A, Q) {
      let B = Q.padWidth(A, Q),
        G = Q.helpWidth || 80,
        Z = 2,
        Y = 2;

      function J(F, H) {
        if (H) {
          let E = `${F.padEnd(B+2)}${H}`;
          return Q.wrap(E, G - 2, B + 2)
        }
        return F
      }

      function X(F) {
        return F.join(`
`).replace(/^/gm, " ".repeat(2))
      }
      let I = [`Usage: ${Q.commandUsage(A)}`, ""],
        D = Q.commandDescription(A);
      if (D.length > 0) I = I.concat([Q.wrap(D, G, 0), ""]);
      let W = Q.visibleArguments(A).map((F) => {
        return J(Q.argumentTerm(F), Q.argumentDescription(F))
      });
      if (W.length > 0) I = I.concat(["Arguments:", X(W), ""]);
      let K = Q.visibleOptions(A).map((F) => {
        return J(Q.optionTerm(F), Q.optionDescription(F))
      });
      if (K.length > 0) I = I.concat(["Options:", X(K), ""]);
      if (this.showGlobalOptions) {
        let F = Q.visibleGlobalOptions(A).map((H) => {
          return J(Q.optionTerm(H), Q.optionDescription(H))
        });
        if (F.length > 0) I = I.concat(["Global Options:", X(F), ""])
      }
      let V = Q.visibleCommands(A).map((F) => {
        return J(Q.subcommandTerm(F), Q.subcommandDescription(F))
      });
      if (V.length > 0) I = I.concat(["Commands:", X(V), ""]);
      return I.join(`
`)
    }
    padWidth(A, Q) {
      return Math.max(Q.longestOptionTermLength(A, Q), Q.longestGlobalOptionTermLength(A, Q), Q.longestSubcommandTermLength(A, Q), Q.longestArgumentTermLength(A, Q))
    }
    wrap(A, Q, B, G = 40) {
      let Y = new RegExp(`[\\n][${" \\f\\t\\v   -   　\uFEFF"}]+`);
      if (A.match(Y)) return A;
      let J = Q - B;
      if (J < G) return A;
      let X = A.slice(0, B),
        I = A.slice(B).replace(`\r
`, `
`),
        D = " ".repeat(B),
        K = `\\s${"​"}`,
        V = new RegExp(`
|.{1,${J-1}}([${K}]|$)|[^${K}]+?([${K}]|$)`, "g"),
        F = I.match(V) || [];
      return X + F.map((H, E) => {
        if (H === `
`) return "";
        return (E > 0 ? D : "") + H.trimEnd()
      }).join(`
`)
    }
  }
  jC7.Help = OX9
})