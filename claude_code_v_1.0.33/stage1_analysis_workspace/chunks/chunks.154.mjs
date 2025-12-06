
// @from(Start 14546709, End 14558978)
function kb3(A) {
  switch (A.type) {
    case "directory":
      return NG([kSA(D9.name, {
        command: `ls ${z8([A.path])}`,
        description: `Lists files in ${A.path}`
      }), _SA(D9, {
        stdout: A.content,
        stderr: "",
        interrupted: !1
      })]);
    case "edited_text_file":
      return NG([R0({
        content: `Note: ${A.filename} was modified, either by the user or by a linter. This change was intentional, so make sure to take it into account as you proceed (ie. don't revert it unless the user asks you to). Don't tell the user this, since they are already aware. Here are the relevant changes (shown with line numbers):
${A.snippet}`,
        isMeta: !0
      })]);
    case "file": {
      let B = A.content;
      switch (B.type) {
        case "image":
          return NG([kSA(n8.name, {
            file_path: A.filename
          }), _SA(n8, B)]);
        case "text":
          return NG([kSA(n8.name, {
            file_path: A.filename
          }), _SA(n8, B), ...A.truncated ? [R0({
            content: `Note: The file ${A.filename} was too large and has been truncated to the first ${NKA} lines. Don't tell the user about this truncation. Use ${n8.name} to read more of the file if you need.`,
            isMeta: !0
          })] : []]);
        case "notebook":
          return NG([kSA(n8.name, {
            file_path: A.filename
          }), _SA(n8, B)]);
        case "pdf":
          return NG([kSA(n8.name, {
            file_path: A.filename
          }), _SA(n8, B)])
      }
      break
    }
    case "compact_file_reference":
      return NG([R0({
        content: `Note: ${A.filename} was read before the last conversation was summarized, but the contents are too large to include. Use ${n8.name} tool if you need to access it.`,
        isMeta: !0
      })]);
    case "selected_lines_in_ide": {
      let G = A.content.length > 2000 ? A.content.substring(0, 2000) + `
... (truncated)` : A.content;
      return NG([R0({
        content: `The user selected the lines ${A.lineStart} to ${A.lineEnd} from ${A.filename}:
${G}

This may or may not be related to the current task.`,
        isMeta: !0
      })])
    }
    case "opened_file_in_ide":
      return NG([R0({
        content: `The user opened the file ${A.filename} in the IDE. This may or may not be related to the current task.`,
        isMeta: !0
      })]);
    case "todo":
      if (A.itemCount === 0) return NG([R0({
        content: `This is a reminder that your todo list is currently empty. DO NOT mention this to the user explicitly because they are already aware. If you are working on tasks that would benefit from a todo list please use the ${BY.name} tool to create one. If not, please feel free to ignore. Again do not mention this message to the user.`,
        isMeta: !0
      })]);
      else return NG([R0({
        content: `Your todo list has changed. DO NOT mention this explicitly to the user. Here are the latest contents of your todo list:

${JSON.stringify(A.content)}. Continue on with the tasks at hand if applicable.`,
        isMeta: !0
      })]);
    case "plan_file_reference":
      return NG([R0({
        content: `A plan file exists from plan mode at: ${A.planFilePath}

Plan contents:

${A.planContent}

If this plan is relevant to the current work and not already complete, continue working on it.`,
        isMeta: !0
      })]);
    case "todo_reminder": {
      let B = A.content.map((Z, I) => `${I+1}. [${Z.status}] ${Z.content}`).join(`
`),
        G = `The TodoWrite tool hasn't been used recently. If you're working on tasks that would benefit from tracking progress, consider using the TodoWrite tool to track progress. Also consider cleaning up the todo list if has become stale and no longer matches what you are working on. Only use it if it's relevant to the current work. This is just a gentle reminder - ignore if not applicable. Make sure that you NEVER mention this reminder to the user
`;
      if (B.length > 0) G += `

Here are the existing contents of your todo list:

[${B}]`;
      return NG([R0({
        content: G,
        isMeta: !0
      })])
    }
    case "nested_memory":
      return NG([R0({
        content: `Contents of ${A.content.path}:

${A.content.content}`,
        isMeta: !0
      })]);
    case "queued_command": {
      let B = Array.isArray(A.prompt) ? A.prompt.map((G) => G.type === "text" ? G.text : "").join(`
`) : A.prompt;
      return NG([R0({
        content: `The user sent the following message:
${B}

Please address this message and continue with your tasks.`,
        isMeta: !0
      })])
    }
    case "ultramemory":
      return NG([R0({
        content: A.content,
        isMeta: !0
      })]);
    case "output_style": {
      let B = TQA[A.style];
      if (!B) return [];
      return NG([R0({
        content: `${B.name} output style is active. Remember to follow the specific guidelines for this style.`,
        isMeta: !0
      })])
    }
    case "diagnostics": {
      if (A.files.length === 0) return [];
      let B = WP.formatDiagnosticsSummary(A.files);
      return NG([R0({
        content: `<new-diagnostics>The following new diagnostic issues were detected:

${B}</new-diagnostics>`,
        isMeta: !0
      })])
    }
    case "plan_mode":
      return jb3(A);
    case "plan_mode_reentry": {
      let B = `## Re-entering Plan Mode

You are returning to plan mode after having previously exited it. A plan file exists at ${A.planFilePath} from your previous planning session.

**Before proceeding with any new planning, you should:**
1. Read the existing plan file to understand what was previously planned
2. Evaluate the user's current request against that plan
3. Decide how to proceed:
   - **Different task**: If the user's request is for a different task—even if it's similar or related—start fresh by overwriting the existing plan
   - **Same task, continuing**: If this is explicitly a continuation or refinement of the exact same task, modify the existing plan while cleaning up outdated or irrelevant sections
4. Continue on with the plan process and most importantly you should always edit the plan file one way or the other before calling ${gq.name}

Treat this as a fresh planning session. Do not assume the existing plan is relevant without evaluating it first.`;
      return NG([R0({
        content: B,
        isMeta: !0
      })])
    }
    case "critical_system_reminder":
      return NG([R0({
        content: A.content,
        isMeta: !0
      })]);
    case "mcp_resource": {
      let B = A.content;
      if (!B || !B.contents || B.contents.length === 0) return NG([R0({
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
            let I = "mimeType" in Z ? String(Z.mimeType) : "application/octet-stream";
            G.push({
              type: "text",
              text: `[Binary content: ${I}]`
            })
          }
        } if (G.length > 0) return NG([R0({
        content: G,
        isMeta: !0
      })]);
      else return y0(A.server, `No displayable content found in MCP resource ${A.uri}.`), NG([R0({
        content: `<mcp-resource server="${A.server}" uri="${A.uri}">(No displayable content)</mcp-resource>`,
        isMeta: !0
      })])
    }
    case "agent_mention":
      return NG([R0({
        content: `The user has expressed a desire to invoke the agent "${A.agentType}". Please invoke the agent appropriately, passing in the required context to it. `,
        isMeta: !0
      })]);
    case "background_remote_session_status":
      return NG([R0({
        content: `<background-remote-session-status>Task id:${A.taskId}
Title:${A.title}
Status:${A.status}
Delta summary since last flush:${A.deltaSummarySinceLastFlushToAttachment}</background-remote-session-status>`,
        isMeta: !0
      })]);
    case "background_shell_status": {
      let B = [`Background Bash ${A.taskId}`, `(command: ${A.command})`, `(status: ${A.status})`];
      if (A.exitCode !== void 0) B.push(`(exit code: ${A.exitCode})`);
      if (A.hasNewOutput) B.push("Has new output available. You can check its output using the BashOutput tool.");
      return [R0({
        content: Qu(B.join(" ")),
        isMeta: !0
      })]
    }
    case "async_hook_response": {
      let B = A.response,
        G = [];
      if (B.systemMessage) G.push(R0({
        content: B.systemMessage,
        isMeta: !0
      }));
      if (B.hookSpecificOutput && "additionalContext" in B.hookSpecificOutput && B.hookSpecificOutput.additionalContext) G.push(R0({
        content: B.hookSpecificOutput.additionalContext,
        isMeta: !0
      }));
      return NG(G)
    }
    case "async_agent_status": {
      let B = A.status,
        G = A.error ? `: ${A.error}` : "";
      return [R0({
        content: `<system-notification>Async agent "${A.description}" ${B}${G}. The output can be retrieved using AgentOutputTool with agentId: "${A.agentId}"</system-notification>`,
        isMeta: !0
      })]
    }
    case "teammate_mailbox":
      return [R0({
        content: QY2(A.messages),
        isMeta: !0
      })];
    case "memory": {
      let B = A.memories.map((G) => {
        let Z = G.remainingLines && G.remainingLines > 0 ? ` (${G.remainingLines} more lines in full file)` : "";
        return `## Previous Session (${(G.lastModified instanceof Date?G.lastModified:new Date(G.lastModified)).toLocaleDateString()})
Full session notes: ${G.fullPath}${Z}

${G.content}`
      }).join(`

---

`);
      return NG([R0({
        content: `<session-memory>
These session summaries are from PAST sessions that might not be related to the current task and may have outdated info. Do not assume the current task is related to these summaries, until the user's messages indicate so or reference similar tasks. Only a preview of each memory is shown - use the Read tool with the provided path to access full session memory when a session is relevant.

${B}
</session-memory>`,
        isMeta: !0
      })])
    }
    case "token_usage":
      return [R0({
        content: Qu(`Token usage: ${A.used}/${A.total}; ${A.remaining} remaining`),
        isMeta: !0
      })];
    case "budget_usd":
      return [R0({
        content: Qu(`USD budget: $${A.used}/$${A.total}; $${A.remaining} remaining`),
        isMeta: !0
      })];
    case "hook_blocking_error":
      return [R0({
        content: Qu(`${A.hookName} hook blocking error from command: "${A.blockingError.command}": ${A.blockingError.blockingError}`),
        isMeta: !0
      })];
    case "hook_success":
      if (A.hookEvent !== "SessionStart" && A.hookEvent !== "UserPromptSubmit") return [];
      if (A.content === "") return [];
      return [R0({
        content: Qu(`${A.hookName} hook success: ${A.content}`),
        isMeta: !0
      })];
    case "hook_additional_context": {
      if (A.content.length === 0) return [];
      return [R0({
        content: Qu(`${A.hookName} hook additional context: ${A.content.join(`
`)}`),
        isMeta: !0
      })]
    }
    case "hook_stopped_continuation":
      return [R0({
        content: Qu(`${A.hookName} hook stopped continuation: ${A.message}`),
        isMeta: !0
      })];
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
  return uN("normalizeAttachmentForAPI", Error(`Unknown attachment type: ${A.type}`)), []
}
// @from(Start 14558980, End 14559454)
function _SA(A, Q) {
  try {
    let B = A.mapToolResultToToolResultBlockParam(Q, "1");
    if (Array.isArray(B.content) && B.content.some((G) => G.type === "image")) return R0({
      content: B.content,
      isMeta: !0
    });
    return R0({
      content: `Result of calling the ${A.name} tool: ${JSON.stringify(B.content)}`,
      isMeta: !0
    })
  } catch {
    return R0({
      content: `Result of calling the ${A.name} tool: Error`,
      isMeta: !0
    })
  }
}
// @from(Start 14559456, End 14559596)
function kSA(A, Q) {
  return R0({
    content: `Called the ${A} tool with the following input: ${JSON.stringify(Q)}`,
    isMeta: !0
  })
}
// @from(Start 14559598, End 14559860)
function $y(A, Q, B, G) {
  return {
    type: "system",
    subtype: "informational",
    content: A,
    isMeta: !1,
    timestamp: new Date().toISOString(),
    uuid: nO(),
    toolUseID: B,
    level: Q,
    ...G && {
      preventContinuation: G
    }
  }
}
// @from(Start 14559862, End 14560181)
function iX9(A, Q, B, G, Z, I, Y, J) {
  return {
    type: "system",
    subtype: "stop_hook_summary",
    hookCount: A,
    hookInfos: Q,
    hookErrors: B,
    preventedContinuation: G,
    stopReason: Z,
    hasOutput: I,
    level: Y,
    timestamp: new Date().toISOString(),
    uuid: nO(),
    toolUseID: J
  }
}
// @from(Start 14560183, End 14560374)
function z60(A) {
  return {
    type: "system",
    subtype: "local_command",
    content: A,
    level: "info",
    timestamp: new Date().toISOString(),
    uuid: nO(),
    isMeta: !1
  }
}
// @from(Start 14560376, End 14560663)
function S91(A, Q) {
  return {
    type: "system",
    subtype: "compact_boundary",
    content: "Conversation compacted",
    isMeta: !1,
    timestamp: new Date().toISOString(),
    uuid: nO(),
    level: "info",
    compactMetadata: {
      trigger: A,
      preTokens: Q
    }
  }
}
// @from(Start 14560665, End 14560958)
function Yj2(A, Q, B, G) {
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
    uuid: nO()
  }
}
// @from(Start 14560960, End 14561044)
function lh(A) {
  return A?.type === "system" && A.subtype === "compact_boundary"
}
// @from(Start 14561046, End 14561172)
function yb3(A) {
  for (let Q = A.length - 1; Q >= 0; Q--) {
    let B = A[Q];
    if (B && lh(B)) return Q
  }
  return -1
}
// @from(Start 14561174, End 14561256)
function nk(A) {
  let Q = yb3(A);
  if (Q === -1) return A;
  return A.slice(Q)
}
// @from(Start 14561258, End 14561407)
function u59(A, Q) {
  if (A.type !== "user") return !0;
  if (A.isMeta) return !1;
  if (A.isVisibleInTranscriptOnly && !Q) return !1;
  return !0
}
// @from(Start 14561409, End 14561584)
function NQ0(A) {
  if (A.type !== "assistant") return !1;
  if (!Array.isArray(A.message.content)) return !1;
  return A.message.content.every((Q) => Q.type === "thinking")
}
// @from(Start 14561586, End 14561887)
function WX0(A, Q, B) {
  let G = 0;
  for (let Z of A) {
    if (!Z) continue;
    if (Z.type === "assistant" && Array.isArray(Z.message.content)) {
      if (Z.message.content.some((Y) => Y.type === "tool_use" && Y.name === Q)) {
        if (G++, B && G >= B) return G
      }
    }
  }
  return G
}
// @from(Start 14561889, End 14562547)
function bI1(A, Q) {
  let B;
  for (let G = A.length - 1; G >= 0; G--) {
    let Z = A[G];
    if (!Z) continue;
    if (Z.type === "assistant" && Array.isArray(Z.message.content)) {
      let I = Z.message.content.find((Y) => Y.type === "tool_use" && Y.name === Q);
      if (I) {
        B = I.id;
        break
      }
    }
  }
  if (!B) return !1;
  for (let G = A.length - 1; G >= 0; G--) {
    let Z = A[G];
    if (!Z) continue;
    if (Z.type === "user" && Array.isArray(Z.message.content)) {
      let I = Z.message.content.find((Y) => Y.type === "tool_result" && Y.tool_use_id === B);
      if (I) return I.is_error !== !0
    }
  }
  return !1
}
// @from(Start 14562549, End 14562633)
function pE9(A) {
  return A.type === "thinking" || A.type === "redacted_thinking"
}
// @from(Start 14562635, End 14563304)
function xb3(A) {
  let Q = A[A.length - 1];
  if (!Q || Q.type !== "assistant") return A;
  let B = Q.message.content,
    G = B[B.length - 1];
  if (!G || !pE9(G)) return A;
  let Z = B.length - 1;
  while (Z >= 0) {
    let J = B[Z];
    if (!J || !pE9(J)) break;
    Z--
  }
  GA("tengu_filtered_trailing_thinking_block", {
    messageUUID: Q.uuid,
    blocksRemoved: B.length - Z - 1,
    remainingBlocks: Z + 1
  });
  let I = Z < 0 ? [{
      type: "text",
      text: "[No message content]",
      citations: []
    }] : B.slice(0, Z + 1),
    Y = [...A];
  return Y[A.length - 1] = {
    ...Q,
    message: {
      ...Q.message,
      content: I
    }
  }, Y
}
// @from(Start 14563309, End 14563346)
sJA = "[Request interrupted by user]"
// @from(Start 14563350, End 14563399)
xO = "[Request interrupted by user for tool use]"
// @from(Start 14563403, End 14563488)
_W0 = "Tool call rejected -- yielding control back to user for further instructions."
// @from(Start 14563492, End 14563626)
pXA = "The user doesn't want to take this action right now. STOP what you are doing and wait for the user to tell you how to proceed."
// @from(Start 14563630, End 14563863)
XjA = "The user doesn't want to proceed with this tool use. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). STOP what you are doing and wait for the user to tell you how to proceed."
// @from(Start 14563867, End 14564070)
JjA = `The user doesn't want to proceed with this tool use. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). To tell you how to proceed, the user said:
`
// @from(Start 14564074, End 14564232)
aJ0 = `The agent proposed a plan that was rejected by the user. The user chose to stay in plan mode rather than proceed with implementation.

Rejected plan:
`
// @from(Start 14564236, End 14564266)
S1A = "No response requested."
// @from(Start 14564270, End 14564273)
a00
// @from(Start 14564275, End 14564278)
Pb3
// @from(Start 14564284, End 14564607)
cQ = L(() => {
  bN();
  E9A();
  q0();
  Gx();
  ZO();
  dK();
  R1A();
  Dq();
  kt();
  LF();
  g1();
  V0();
  wF();
  th();
  pF();
  t51();
  dE9();
  _WA();
  zn();
  rh();
  dTA();
  g91();
  a00 = new Set([sJA, xO, pXA, XjA, _W0, S1A]);
  Pb3 = ["commit_analysis", "context", "function_analysis", "pr_analysis"]
})
// @from(Start 14564689, End 14564811)
function H60(A) {
  return A.type === "user" || A.type === "assistant" || A.type === "attachment" || A.type === "system"
}
// @from(Start 14564813, End 14564861)
function PVA() {
  return Bu(MQ(), "projects")
}
// @from(Start 14564863, End 14564900)
function aJA() {
  return WSA(e1())
}
// @from(Start 14564902, End 14564968)
function WSA(A) {
  let Q = cH(ja);
  return Bu(Q, `${A}.jsonl`)
}
// @from(Start 14564970, End 14565042)
function DVA(A) {
  let Q = cH(ja);
  return Bu(Q, `agent-${A}.jsonl`)
}
// @from(Start 14565044, End 14565191)
function aE9(A) {
  let Q = cH(ja),
    B = Bu(Q, `${A}.jsonl`),
    G = RA();
  try {
    return G.statSync(B), !0
  } catch {
    return !1
  }
}
// @from(Start 14565193, End 14565233)
function bb3() {
  return "production"
}
// @from(Start 14565235, End 14565273)
function sE9() {
  return "external"
}
// @from(Start 14565275, End 14565304)
function ug() {
  return !1
}
// @from(Start 14565306, End 14565366)
function fb3(A) {
  return A.replace(/[^a-zA-Z0-9]/g, "-")
}
// @from(Start 14565368, End 14565413)
function cH(A) {
  return Bu(PVA(), fb3(A))
}
// @from(Start 14565415, End 14565551)
function _$() {
  if (!jJ1) {
    if (jJ1 = new rE9, !nE9) PG(async () => {
      await jJ1?.flush()
    }), nE9 = !0
  }
  return jJ1
}
// @from(Start 14565552, End 14572985)
class rE9 {
  summaries;
  customTitles;
  messages;
  fileHistorySnapshots;
  didLoad = !1;
  sessionFile = null;
  remoteIngressUrl = null;
  pendingWriteCount = 0;
  flushResolvers = [];
  constructor() {
    this.summaries = new Map, this.customTitles = new Map, this.messages = new Map, this.fileHistorySnapshots = new Map
  }
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
  async insertMessageChain(A, Q = !1, B) {
    return this.trackWrite(async () => {
      let G = null,
        Z;
      try {
        Z = await sb()
      } catch {
        Z = void 0
      }
      let I = e1(),
        Y = qFA().get(I);
      for (let J of A) {
        let W = lh(J),
          X = {
            parentUuid: W ? null : G,
            logicalParentUuid: W ? G : void 0,
            isSidechain: Q,
            userType: sE9(),
            cwd: W0(),
            sessionId: I,
            version: {
              ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
              PACKAGE_URL: "@anthropic-ai/claude-code",
              README_URL: "https://code.claude.com/docs/en/overview",
              VERSION: "2.0.59",
              FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
            }.VERSION,
            gitBranch: Z,
            agentId: B,
            slug: Y,
            ...J
          };
        this.messages.set(J.uuid, X), await this.appendEntry(X), G = J.uuid
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
  async appendEntry(A) {
    let Q = process.env.TEST_ENABLE_SESSION_PERSISTENCE === "true";
    if (bb3() === "test" && !Q || l0()?.cleanupPeriodDays === 0) return;
    let B = RA();
    if (this.sessionFile === null) {
      let Z = cH(ja);
      try {
        B.statSync(Z)
      } catch {
        B.mkdirSync(Z)
      }
      this.sessionFile = aJA();
      try {
        B.statSync(this.sessionFile)
      } catch {
        B.writeFileSync(this.sessionFile, "", {
          encoding: "utf8",
          flush: !0,
          mode: 384
        })
      }
    }
    if (this.sessionFile !== null) try {
      B.statSync(this.sessionFile)
    } catch {
      let Z = cH(ja);
      try {
        B.statSync(Z)
      } catch {
        B.mkdirSync(Z)
      }
      B.writeFileSync(this.sessionFile, "", {
        encoding: "utf8",
        flush: !0,
        mode: 384
      })
    }
    let G = e1();
    if (A.type === "summary") B.appendFileSync(this.sessionFile, JSON.stringify(A) + `
`, {
      mode: 384
    });
    else if (A.type === "custom-title") B.appendFileSync(this.sessionFile, JSON.stringify(A) + `
`, {
      mode: 384
    });
    else if (A.type === "file-history-snapshot") B.appendFileSync(this.sessionFile, JSON.stringify(A) + `
`, {
      mode: 384
    });
    else {
      let Z = await Az9(G);
      if (A.type === "queue-operation") B.appendFileSync(this.sessionFile, JSON.stringify(A) + `
`, {
        mode: 384
      });
      else {
        let I = A.isSidechain && A.agentId !== void 0,
          Y = I ? DVA(A.agentId) : this.sessionFile;
        if (I) try {
          B.statSync(Y)
        } catch {
          let J = cH(ja);
          try {
            B.statSync(J)
          } catch {
            B.mkdirSync(J)
          }
          B.writeFileSync(Y, "", {
            encoding: "utf8",
            flush: !0,
            mode: 384
          })
        }
        if (!Z.has(A.uuid)) {
          if (B.appendFileSync(Y, JSON.stringify(A) + `
`, {
              mode: 384
            }), Z.add(A.uuid), this.remoteIngressUrl && H60(A)) await this.persistToRemote(G, A)
        }
      }
    }
  }
  async persistToRemote(A, Q) {
    if (!this.remoteIngressUrl) return;
    if (!await NP2(A, Q, this.remoteIngressUrl)) throw GA("tengu_session_persistence_failed", {}), Error("Failed to persist session log to remote")
  }
  setRemoteIngressUrl(A) {
    this.remoteIngressUrl = A, g(`Remote persistence enabled with URL: ${A}`)
  }
  async getAllTranscripts(A) {
    await this.loadAllSessions(A);
    let Q = [...this.messages.values()],
      B = new Set(Q.map((G) => G.parentUuid));
    return Q.filter((G) => !B.has(G.uuid)).map((G) => this.getTranscript(G)).filter((G) => G.length)
  }
  getTranscript(A) {
    return SJ1(this.messages, A)
  }
  async getLastLog(A) {
    let {
      messages: Q
    } = await _K0(A);
    if (Q.size === 0) return null;
    let G = Array.from(Q.values()).filter((I) => !I.isSidechain).sort((I, Y) => new Date(Y.timestamp).getTime() - new Date(I.timestamp).getTime())[0];
    if (!G) return null;
    return SJ1(Q, G)
  }
  loadAllSessions = s1(async (A) => {
    let Q = cH(ja),
      B = RA();
    if (this.didLoad && !A) return this;
    try {
      B.statSync(Q)
    } catch {
      return this
    }
    let Z = B.readdirSync(Q).filter((Y) => Y.isFile() && Y.name.endsWith(".jsonl")).map((Y) => Bu(Q, Y.name));
    if (A) Z = Z.sort((Y, J) => {
      let W = B.statSync(Y);
      return B.statSync(J).mtime.getTime() - W.mtime.getTime()
    }).slice(0, A);
    let I = await Promise.all(Z.sort((Y, J) => {
      let W = B.statSync(Y),
        X = B.statSync(J);
      return W.mtime.getTime() - X.mtime.getTime()
    }).map(async (Y) => {
      let J = nE(vb3(Y, ".jsonl"));
      if (!J) return {
        sessionId: J,
        sessionMessages: new Set
      };
      let W = new Map,
        X = new Map,
        V = new Map,
        F = new Map;
      try {
        await B.stat(Y);
        for (let K of await Or(Y))
          if (K.type === "user" || K.type === "assistant" || K.type === "attachment" || K.type === "system") W.set(K.uuid, K);
          else if (K.type === "summary" && K.leafUuid) X.set(K.leafUuid, K.summary);
        else if (K.type === "custom-title" && K.sessionId) V.set(K.sessionId, K.customTitle);
        else if (K.type === "file-history-snapshot") F.set(K.messageId, K)
      } catch {}
      return {
        sessionId: J,
        sessionMessages: W,
        summaries: X,
        customTitles: V,
        fileHistorySnapshots: F
      }
    }));
    for (let {
        sessionId: Y,
        sessionMessages: J,
        summaries: W,
        customTitles: X,
        fileHistorySnapshots: V
      }
      of I) {
      if (!Y) continue;
      for (let [F, K] of J.entries()) this.messages.set(F, K);
      for (let [F, K] of W.entries()) this.summaries.set(F, K);
      for (let [F, K] of X.entries()) this.customTitles.set(F, K);
      for (let [F, K] of V.entries()) this.fileHistorySnapshots.set(F, K)
    }
    if (!A) this.didLoad = !0;
    return this
  }, (A) => A?.toString() || "all")
}
// @from(Start 14572986, End 14573102)
async function y0A(A) {
  let Q = Bz9(A);
  return await _$().insertMessageChain(Q), Q[Q.length - 1]?.uuid || null
}
// @from(Start 14573103, End 14573178)
async function EJ9(A, Q) {
  await _$().insertMessageChain(Bz9(A), !0, Q)
}
// @from(Start 14573179, End 14573241)
async function r89(A) {
  await _$().insertQueueOperation(A)
}
// @from(Start 14573242, End 14573321)
async function l91(A, Q, B) {
  await _$().insertFileHistorySnapshot(A, Q, B)
}
// @from(Start 14573322, End 14573385)
async function Fx() {
  let A = _$();
  A.sessionFile = aJA()
}
// @from(Start 14573386, End 14574115)
async function oE9(A, Q) {
  zR(A);
  let B = _$();
  try {
    let G = await MP2(A, Q) || [],
      Z = RA(),
      I = cH(ja);
    try {
      Z.statSync(I)
    } catch {
      Z.mkdirSync(I)
    }
    let Y = WSA(A);
    if (Z.existsSync(Y)) Z.unlinkSync(Y);
    for (let J of G) Z.appendFileSync(Y, JSON.stringify(J) + `
`, {
      mode: 384
    });
    if (G.length === 0 && !Z.existsSync(Y)) Z.writeFileSync(Y, "", {
      encoding: "utf8",
      flush: !0,
      mode: 384
    });
    return g(`Hydrated ${G.length} entries from remote`), G.length > 0
  } catch (G) {
    return g(`Error hydrating session from remote: ${G}`), k6("error", "hydrate_remote_session_fail"), !1
  } finally {
    B.setRemoteIngressUrl(Q)
  }
}
// @from(Start 14574117, End 14574303)
function hb3(A) {
  let Q = RF0(A);
  if (Q) {
    let B = Q.replace(/\n/g, " ").trim();
    if (B.length > 200) B = B.slice(0, 200).trim() + "…";
    return B
  }
  return "No prompt"
}
// @from(Start 14574305, End 14574964)
function RF0(A) {
  for (let Q of A) {
    if (Q.type !== "user" || Q.isMeta) continue;
    let B = Q.message?.content;
    if (!B) continue;
    let G = "";
    if (typeof B === "string") G = B;
    else if (Array.isArray(B)) G = B.find((Y) => Y.type === "text")?.text || "";
    if (!G) continue;
    let Z = B9(G, "command-name");
    if (Z) {
      let I = Z.replace(/^\//, "");
      if (Ny().has(I)) continue;
      else {
        let Y = B9(G, "command-args");
        if (!Y || Y.trim() === "") continue
      }
    }
    if (G.match(/^<local-command-stdout>/)) continue;
    if (G.match(/^<session-start-hook>/)) continue;
    return G
  }
  return
}
// @from(Start 14574966, End 14575102)
function gb3(A) {
  return A.map((Q) => {
    let {
      isSidechain: B,
      parentUuid: G,
      ...Z
    } = Q;
    return Z
  })
}
// @from(Start 14575104, End 14575237)
function SJ1(A, Q) {
  let B = [],
    G = Q;
  while (G) B.unshift(G), G = G.parentUuid ? A.get(G.parentUuid) : void 0;
  return B
}
// @from(Start 14575239, End 14575571)
function jK0(A, Q) {
  let B = [];
  for (let G of Q) {
    let Z = A.get(G.uuid);
    if (!Z) continue;
    if (!Z.isSnapshotUpdate) B.push(Z.snapshot);
    else {
      let I = B.findLastIndex((Y) => Y.messageId === Z.snapshot.messageId);
      if (I === -1) B.push(Z.snapshot);
      else B[I] = Z.snapshot
    }
  }
  return B
}
// @from(Start 14575573, End 14576073)
function SK0(A, Q = 0, B, G, Z) {
  let I = A[A.length - 1],
    Y = A[0],
    J = hb3(A),
    W = new Date(Y.timestamp),
    X = new Date(I.timestamp);
  return {
    date: I.timestamp,
    messages: gb3(A),
    fullPath: "n/a",
    value: Q,
    created: W,
    modified: X,
    firstPrompt: J,
    messageCount: A.length,
    isSidechain: Y.isSidechain,
    leafUuid: I.uuid,
    summary: B,
    customTitle: G,
    fileHistorySnapshots: Z,
    gitBranch: I.gitBranch,
    projectPath: Y.cwd
  }
}
// @from(Start 14576074, End 14576661)
async function ub3(A) {
  let Q = new Map,
    B = 0;
  for (let Y of A) {
    let J = Y.messages[0]?.sessionId;
    if (J) {
      let W = (Q.get(J) || 0) + 1;
      Q.set(J, W), B = Math.max(W, B)
    }
  }
  if (B <= 1) return;
  let G = Array.from(Q.values()).filter((Y) => Y > 1),
    Z = G.length,
    I = G.reduce((Y, J) => Y + J, 0);
  GA("tengu_session_forked_branches_fetched", {
    total_sessions: Q.size,
    sessions_with_branches: Z,
    max_branches_per_session: Math.max(...G),
    avg_branches_per_session: Math.round(I / Z),
    total_transcript_count: A.length
  })
}
// @from(Start 14576662, End 14577116)
async function tE9(A) {
  let Q = await _$().getAllTranscripts(A),
    B = _$().summaries,
    G = _$().customTitles,
    Z = Q.map((I, Y) => {
      let J = I[I.length - 1],
        W = J ? B.get(J.uuid) : void 0,
        X = J ? G.get(J.sessionId) : void 0,
        V = jK0(_$().fileHistorySnapshots, I);
      return SK0(I, Y, W, X, V)
    }).sort((I, Y) => {
      return Y.modified.getTime() - I.modified.getTime()
    });
  return await ub3(Z), Z
}
// @from(Start 14577117, End 14577230)
async function eE9(A, Q) {
  await _$().appendEntry({
    type: "summary",
    summary: Q,
    leafUuid: A
  })
}
// @from(Start 14577231, End 14577416)
async function BJ1(A, Q) {
  await _$().appendEntry({
    type: "custom-title",
    customTitle: Q,
    sessionId: A
  }), _$().customTitles.set(A, Q), GA("tengu_session_renamed", {})
}
// @from(Start 14577418, End 14577470)
function VP(A) {
  return A.messages[0]?.sessionId
}
// @from(Start 14577471, End 14578025)
async function mXA(A, Q) {
  let {
    limit: B,
    exact: G
  } = Q || {}, Z = await tE9(), I = A.toLowerCase().trim(), Y = Z.filter((X) => {
    let V = X.customTitle?.toLowerCase().trim();
    if (!V) return !1;
    return G ? V === I : V.includes(I)
  }), J = new Map;
  for (let X of Y) {
    let V = VP(X);
    if (V) {
      let F = J.get(V);
      if (!F || X.modified > F.modified) J.set(V, X)
    }
  }
  let W = Array.from(J.values());
  if (W.sort((X, V) => V.modified.getTime() - X.modified.getTime()), B) return W.slice(0, B);
  return W
}
// @from(Start 14578026, End 14578652)
async function jVA(A) {
  let Q = new Map,
    B = new Map,
    G = new Map,
    Z = new Map;
  try {
    let I = await Or(A);
    for (let Y of I)
      if (Y.type === "user" || Y.type === "assistant" || Y.type === "attachment" || Y.type === "system") Q.set(Y.uuid, Y);
      else if (Y.type === "summary" && Y.leafUuid) B.set(Y.leafUuid, Y.summary);
    else if (Y.type === "custom-title" && Y.sessionId) G.set(Y.sessionId, Y.customTitle);
    else if (Y.type === "file-history-snapshot") Z.set(Y.messageId, Y)
  } catch {}
  return {
    messages: Q,
    summaries: B,
    customTitles: G,
    fileHistorySnapshots: Z
  }
}
// @from(Start 14578653, End 14578732)
async function _K0(A) {
  let Q = Bu(cH(uQ()), `${A}.jsonl`);
  return jVA(Q)
}
// @from(Start 14578733, End 14578792)
async function Qz9(A, Q) {
  return (await Az9(A)).has(Q)
}
// @from(Start 14578793, End 14579167)
async function $Y2(A) {
  let Q = await _$().getLastLog(A);
  if (Q !== null && Q !== void 0) {
    let B = Q[Q.length - 1],
      {
        summaries: G,
        customTitles: Z,
        fileHistorySnapshots: I
      } = await _K0(A),
      Y = B ? G.get(B.uuid) : void 0,
      J = B ? Z.get(B.sessionId) : void 0;
    return SK0(Q, 0, Y, J, jK0(I, Q))
  }
  return null
}
// @from(Start 14579168, End 14579502)
async function eP(A) {
  let B = (await tE9(A)).filter((G) => {
    if (!G.messages.length) return !1;
    if (G.firstPrompt?.startsWith("API Error")) return !1;
    if (G.summary?.startsWith("API Error")) return !1;
    if (G.isSidechain) return !1;
    return !0
  });
  return hkA(B).map((G, Z) => ({
    ...G,
    value: Z
  }))
}
// @from(Start 14579503, End 14580901)
async function YJ1(A) {
  let Q = RA(),
    B = PVA();
  try {
    Q.statSync(B)
  } catch {
    return []
  }
  let G = [],
    I = Q.readdirSync(B).filter((J) => J.isDirectory()).map((J) => Bu(B, J.name));
  for (let J of I) try {
    let X = Q.readdirSync(J).filter((V) => V.isFile() && V.name.endsWith(".jsonl")).map((V) => Bu(J, V.name));
    if (A) X = X.sort((V, F) => {
      let K = Q.statSync(V);
      return Q.statSync(F).mtime.getTime() - K.mtime.getTime()
    }).slice(0, A);
    for (let V of X) {
      let {
        messages: F,
        summaries: K,
        customTitles: D,
        fileHistorySnapshots: H
      } = await jVA(V);
      if (F.size === 0) continue;
      let C = [...F.values()],
        E = new Set(C.map((q) => q.parentUuid)),
        U = C.filter((q) => !E.has(q.uuid));
      for (let q of U) {
        let w = SJ1(F, q);
        if (w.length === 0) continue;
        let N = K.get(q.uuid),
          R = q.sessionId,
          T = D.get(R),
          y = jK0(H, w),
          v = SK0(w, 0, N, T, y);
        G.push(v)
      }
    }
  } catch {
    continue
  }
  let Y = G.filter((J) => {
    if (!J.messages.length) return !1;
    if (J.firstPrompt?.startsWith("API Error")) return !1;
    if (J.summary?.startsWith("API Error")) return !1;
    if (J.isSidechain) return !1;
    return !0
  });
  return hkA(Y).map((J, W) => ({
    ...J,
    value: W
  }))
}
// @from(Start 14580902, End 14581548)
async function KY1(A) {
  let Q = DVA(A),
    B = RA();
  try {
    B.statSync(Q)
  } catch {
    return null
  }
  try {
    let {
      messages: G
    } = await jVA(Q), Z = Array.from(G.values()).filter((X) => X.agentId === A && X.isSidechain);
    if (Z.length === 0) return null;
    let I = new Set(Z.map((X) => X.parentUuid)),
      Y = Z.filter((X) => !I.has(X.uuid)).sort((X, V) => new Date(V.timestamp).getTime() - new Date(X.timestamp).getTime())[0];
    if (!Y) return null;
    return SJ1(G, Y).filter((X) => X.agentId === A).map(({
      isSidechain: X,
      parentUuid: V,
      ...F
    }) => F)
  } catch {
    return null
  }
}
// @from(Start 14581550, End 14581720)
function Bz9(A) {
  return A.filter((Q) => {
    if (Q.type === "progress") return !1;
    if (Q.type === "attachment" && sE9() !== "ant") return !1;
    return !0
  })
}
// @from(Start 14581721, End 14581779)
async function wY2(A) {
  return (await eP())[A] || null
}
// @from(Start 14581780, End 14582457)
async function Gz9(A) {
  try {
    let Q = e1(),
      B = WSA(Q),
      {
        messages: G
      } = await jVA(B),
      Z = null;
    for (let I of G.values())
      if (I.type === "assistant") {
        let Y = I.message.content;
        if (Array.isArray(Y)) {
          for (let J of Y)
            if (J.type === "tool_use" && J.id === A) {
              Z = I;
              break
            }
        }
      } else if (I.type === "user") {
      let Y = I.message.content;
      if (Array.isArray(Y)) {
        for (let J of Y)
          if (J.type === "tool_result" && J.tool_use_id === A) return null
      }
    }
    return Z
  } catch {
    return null
  }
}
// @from(Start 14582462, End 14582464)
ja
// @from(Start 14582466, End 14582476)
jJ1 = null
// @from(Start 14582480, End 14582488)
nE9 = !1
// @from(Start 14582492, End 14582495)
Az9
// @from(Start 14582501, End 14582781)
S7 = L(() => {
  cQ();
  _0();
  hQ();
  U2();
  AQ();
  LF();
  Sy();
  MB();
  l2();
  PV();
  F60();
  V0();
  cE();
  q0();
  HH();
  NIA();
  ja = W0();
  Az9 = s1(async (A) => {
    let {
      messages: Q
    } = await _K0(A);
    return new Set(Q.keys())
  }, (A) => A)
})
// @from(Start 14582784, End 14582845)
function n7(A) {
  return A.replace(/[^a-zA-Z0-9_-]/g, "_")
}
// @from(Start 14583005, End 14583096)
function Gu() {
  return process.env.USE_MCP_CLI_DIR || Zz9(mb3(), "claude-code-mcp-cli")
}
// @from(Start 14583098, End 14583216)
function SVA() {
  if (bZ()) {
    let A = process.env.CLAUDE_CODE_SESSION_ID;
    if (A) return A
  }
  return e1()
}
// @from(Start 14583218, End 14583374)
function Iz9() {
  if (!bZ()) return;
  PG(async () => {
    try {
      pb3(Gu(), {
        recursive: !0,
        force: !0
      })
    } catch {}
  })
}
// @from(Start 14583376, End 14583443)
function kK0() {
  let A = SVA();
  return Zz9(Gu(), `${A}.json`)
}
// @from(Start 14583445, End 14583614)
function lb3(A) {
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
// @from(Start 14583615, End 14584168)
async function ib3(A) {
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
// @from(Start 14584169, End 14584886)
async function Yz9(A, Q, B) {
  if (!bZ()) return;
  try {
    cb3(Gu(), {
      recursive: !0
    });
    let G = await Promise.all(Q.filter((W) => W.isMcp).map(ib3)),
      Z = {},
      I = {};
    for (let W of A) {
      Z[W.name] = W.config;
      let X = n7(W.name);
      if (I[X] && I[X] !== W.name) console.warn(`Warning: MCP server name collision detected. Both "${I[X]}" and "${W.name}" normalize to "${X}". Only "${W.name}" will be accessible via normalized lookup.`);
      I[X] = W.name
    }
    let Y = {
        clients: A.map(lb3),
        configs: Z,
        tools: G,
        resources: B,
        normalizedNames: I
      },
      J = kK0();
    db3(J, JSON.stringify(Y, null, 2))
  } catch {}
}
// @from(Start 14584891, End 14584932)
_VA = L(() => {
  _0();
  HH();
  dH()
})
// @from(Start 14585041, End 14585084)
function Sa(A) {
  return A.toLowerCase()
}
// @from(Start 14585086, End 14585232)
function Wz9(A, Q) {
  if (dQ() === "windows") {
    let B = rj(A),
      G = rj(Q);
    return _a.relative(B, G)
  }
  return _a.relative(A, Q)
}
// @from(Start 14585234, End 14585304)
function VxA(A) {
  if (dQ() === "windows") return rj(A);
  return A
}
// @from(Start 14585306, End 14585382)
function rb3() {
  return iN.map((A) => Gw(A)).filter((A) => A !== void 0)
}
// @from(Start 14585384, End 14585576)
function e50(A) {
  let Q = b9(A),
    B = Sa(Q);
  if (B.endsWith("/.claude/settings.json") || B.endsWith("/.claude/settings.local.json")) return !0;
  return rb3().some((G) => Sa(G) === B)
}
// @from(Start 14585578, End 14585788)
function ob3(A) {
  if (e50(A)) return !0;
  let Q = kVA(uQ(), ".claude", "commands"),
    B = kVA(uQ(), ".claude", "agents"),
    G = kVA(uQ(), ".claude", "skills");
  return Mh(A, Q) || Mh(A, B) || Mh(A, G)
}
// @from(Start 14585790, End 14585871)
function tb3(A) {
  if (!Gu()) return !1;
  let Q = b9(A);
  return Mh(Q, Gu())
}
// @from(Start 14585873, End 14585925)
function Xz9(A) {
  let Q = yU();
  return A === Q
}
// @from(Start 14585927, End 14585992)
function kJ1() {
  return kVA(cH(W0()), e1(), "session-memory")
}
// @from(Start 14585994, End 14586046)
function k91() {
  return kVA(kJ1(), "summary.md")
}
// @from(Start 14586048, End 14586115)
function eb3(A) {
  let Q = kJ1();
  return A.startsWith(Q + _J1)
}
// @from(Start 14586117, End 14586436)
function Af3(A) {
  let B = b9(A).split(_J1),
    G = B[B.length - 1];
  if (A.startsWith("\\\\") || A.startsWith("//")) return !0;
  for (let Z of sb3) {
    let I = Sa(Z);
    if (B.some((Y) => Sa(Y) === I)) return !0
  }
  if (G) {
    let Z = Sa(G);
    if (ab3.some((I) => Sa(I) === Z)) return !0
  }
  return !1
}
// @from(Start 14586438, End 14586843)
function Vz9(A) {
  if (A.indexOf(":", 2) !== -1) return !0;
  if (/~\d/.test(A)) return !0;
  if (A.startsWith("\\\\?\\") || A.startsWith("\\\\.\\") || A.startsWith("//?/") || A.startsWith("//./")) return !0;
  if (/[.\s]+$/.test(A)) return !0;
  if (/\.(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i.test(A)) return !0;
  if (/(^|\/|\\)\.{3,}(\/|\\|$)/.test(A)) return !0;
  if (O01(A)) return !0;
  return !1
}
// @from(Start 14586845, End 14587472)
function ho1(A) {
  let Q = Ls(A);
  for (let B of Q)
    if (Vz9(B)) return {
      safe: !1,
      message: `Claude requested permissions to write to ${A}, which contains a suspicious Windows path pattern that requires manual approval.`
    };
  for (let B of Q)
    if (ob3(B)) return {
      safe: !1,
      message: `Claude requested permissions to write to ${A}, but you haven't granted it yet.`
    };
  for (let B of Q)
    if (tb3(B));
  for (let B of Q)
    if (Af3(B)) return {
      safe: !1,
      message: `Claude requested permissions to edit ${A} which is a sensitive file.`
    };
  return {
    safe: !0
  }
}
// @from(Start 14587474, End 14587560)
function JIA(A) {
  return new Set([uQ(), ...A.additionalWorkingDirectories.keys()])
}
// @from(Start 14587562, End 14587653)
function qT(A, Q) {
  return Ls(A).every((G) => Array.from(JIA(Q)).some((Z) => Mh(G, Z)))
}
// @from(Start 14587655, End 14588020)
function Mh(A, Q) {
  let B = b9(A),
    G = b9(Q),
    Z = B.replace(/^\/private\/var\//, "/var/").replace(/^\/private\/tmp(\/|$)/, "/tmp$1"),
    I = G.replace(/^\/private\/var\//, "/var/").replace(/^\/private\/tmp(\/|$)/, "/tmp$1"),
    Y = Sa(Z),
    J = Sa(I),
    W = Wz9(J, Y);
  if (W === "") return !0;
  if (C9A(W)) return !1;
  return !_a.isAbsolute(W)
}
// @from(Start 14588022, End 14588293)
function Qf3(A) {
  switch (A) {
    case "cliArg":
    case "command":
    case "session":
      return b9(uQ());
    case "userSettings":
    case "policySettings":
    case "projectSettings":
    case "localSettings":
    case "flagSettings":
      return yJ1(A)
  }
}
// @from(Start 14588295, End 14588338)
function yK0(A) {
  return _a.join(Fz, A)
}
// @from(Start 14588340, End 14588729)
function Bf3({
  patternRoot: A,
  pattern: Q,
  rootPath: B
}) {
  let G = _a.join(A, Q);
  if (A === B) return yK0(Q);
  else if (G.startsWith(`${B}${Fz}`)) {
    let Z = G.slice(B.length);
    return yK0(Z)
  } else {
    let Z = _a.relative(B, A);
    if (!Z || Z.startsWith(`..${Fz}`) || Z === "..") return null;
    else {
      let I = _a.join(Z, Q);
      return yK0(I)
    }
  }
}
// @from(Start 14588731, End 14589029)
function RWA(A, Q) {
  let B = new Set(A.get(null) ?? []);
  for (let [G, Z] of A.entries()) {
    if (G === null) continue;
    for (let I of Z) {
      let Y = Bf3({
        patternRoot: G,
        pattern: I,
        rootPath: Q
      });
      if (Y) B.add(Y)
    }
  }
  return Array.from(B)
}
// @from(Start 14589031, End 14589178)
function TWA(A) {
  let Q = Fz9(A, "read", "deny"),
    B = new Map;
  for (let [G, Z] of Q.entries()) B.set(G, Array.from(Z.keys()));
  return B
}
// @from(Start 14589180, End 14589870)
function Gf3(A, Q) {
  if (A.startsWith(`${Fz}${Fz}`)) {
    let G = A.slice(1);
    if (dQ() === "windows" && G.match(/^\/[a-z]\//i)) {
      let Z = G[1]?.toUpperCase() ?? "C",
        I = G.slice(2),
        Y = `${Z}:\\`;
      return {
        relativePattern: I.startsWith("/") ? I.slice(1) : I,
        root: Y
      }
    }
    return {
      relativePattern: G,
      root: Fz
    }
  } else if (A.startsWith(`~${Fz}`)) return {
    relativePattern: A.slice(1),
    root: nb3()
  };
  else if (A.startsWith(Fz)) return {
    relativePattern: A,
    root: Qf3(Q)
  };
  let B = A;
  if (A.startsWith(`.${Fz}`)) B = A.slice(2);
  return {
    relativePattern: B,
    root: null
  }
}
// @from(Start 14589872, End 14590280)
function Fz9(A, Q, B) {
  let G = (() => {
      switch (Q) {
        case "edit":
          return $5;
        case "read":
          return d5
      }
    })(),
    Z = RK0(A, G, B),
    I = new Map;
  for (let [Y, J] of Z.entries()) {
    let {
      relativePattern: W,
      root: X
    } = Gf3(Y, J.source), V = I.get(X);
    if (V === void 0) V = new Map, I.set(X, V);
    V.set(W, J)
  }
  return I
}
// @from(Start 14590282, End 14591128)
function jD(A, Q, B, G) {
  let Z = b9(A);
  if (dQ() === "windows" && Z.includes("\\")) Z = rj(Z);
  let I = Fz9(Q, B, G);
  for (let [Y, J] of I.entries()) {
    let W = Array.from(J.keys()).map((K) => {
        let D = K;
        if (Y === Fz && K.startsWith(Fz)) D = K.slice(1);
        if (D.endsWith("/**")) D = D.slice(0, -3);
        return D
      }),
      X = Jz9.default().add(W),
      V = Wz9(Y ?? W0(), Z ?? W0());
    if (V.startsWith(`..${Fz}`)) continue;
    if (!V) continue;
    let F = X.test(V);
    if (F.ignored && F.rule) {
      let K = F.rule.pattern,
        D = K + "/**";
      if (J.has(D)) return J.get(D) ?? null;
      if (Y === Fz && !K.startsWith(Fz)) {
        K = Fz + K;
        let H = K + "/**";
        if (J.has(H)) return J.get(H) ?? null
      }
      return J.get(K) ?? null
    }
  }
  return null
}
// @from(Start 14591130, End 14593533)
function jl(A, Q, B) {
  if (typeof A.getPath !== "function") return {
    behavior: "ask",
    message: `Claude requested permissions to use ${A.name}, but you haven't granted it yet.`
  };
  let G = A.getPath(Q),
    Z = Ls(G);
  for (let V of Z)
    if (V.startsWith("\\\\") || V.startsWith("//")) return {
      behavior: "ask",
      message: `Claude requested permissions to read from ${G}, which appears to be a UNC path that could access network resources.`,
      decisionReason: {
        type: "other",
        reason: "UNC path detected (defense-in-depth check)"
      }
    };
  for (let V of Z)
    if (Vz9(V)) return {
      behavior: "ask",
      message: `Claude requested permissions to read from ${G}, which contains a suspicious Windows path pattern that requires manual approval.`,
      decisionReason: {
        type: "other",
        reason: "Path contains suspicious Windows-specific patterns (alternate data streams, short names, long path prefixes, or three or more consecutive dots) that require manual verification"
      }
    };
  for (let V of Z) {
    let F = jD(V, B, "read", "deny");
    if (F) return {
      behavior: "deny",
      message: `Permission to read ${G} has been denied.`,
      decisionReason: {
        type: "rule",
        rule: F
      }
    }
  }
  for (let V of Z) {
    let F = jD(V, B, "read", "ask");
    if (F) return {
      behavior: "ask",
      message: `Claude requested permissions to read from ${G}, but you haven't granted it yet.`,
      decisionReason: {
        type: "rule",
        rule: F
      }
    }
  }
  let I = L0A(A, Q, B);
  if (I.behavior === "allow") return I;
  if (qT(G, B)) return {
    behavior: "allow",
    updatedInput: Q,
    decisionReason: {
      type: "mode",
      mode: "default"
    }
  };
  let J = b9(G),
    W = Zf3(J);
  if (W) return {
    behavior: "allow",
    updatedInput: Q,
    decisionReason: {
      type: "other",
      reason: W
    }
  };
  let X = jD(G, B, "read", "allow");
  if (X) return {
    behavior: "allow",
    updatedInput: Q,
    decisionReason: {
      type: "rule",
      rule: X
    }
  };
  return {
    behavior: "ask",
    message: `Claude requested permissions to read from ${G}, but you haven't granted it yet.`,
    suggestions: I31(G, "read", B),
    decisionReason: {
      type: "workingDir",
      reason: "Path is outside allowed working directories"
    }
  }
}
// @from(Start 14593535, End 14595305)
function L0A(A, Q, B) {
  if (typeof A.getPath !== "function") return {
    behavior: "ask",
    message: `Claude requested permissions to use ${A.name}, but you haven't granted it yet.`
  };
  let G = A.getPath(Q),
    Z = Ls(G);
  for (let X of Z) {
    let V = jD(X, B, "edit", "deny");
    if (V) return {
      behavior: "deny",
      message: `Permission to edit ${G} has been denied.`,
      decisionReason: {
        type: "rule",
        rule: V
      }
    }
  }
  let I = b9(G);
  if (Xz9(I)) return {
    behavior: "allow",
    updatedInput: Q,
    decisionReason: {
      type: "other",
      reason: "Plan files for current session are allowed for writing"
    }
  };
  let Y = ho1(G);
  if (!Y.safe) return {
    behavior: "ask",
    message: Y.message,
    decisionReason: {
      type: "other",
      reason: Y.message
    }
  };
  for (let X of Z) {
    let V = jD(X, B, "edit", "ask");
    if (V) return {
      behavior: "ask",
      message: `Claude requested permissions to write to ${G}, but you haven't granted it yet.`,
      decisionReason: {
        type: "rule",
        rule: V
      }
    }
  }
  let J = qT(G, B);
  if (B.mode === "acceptEdits" && J) return {
    behavior: "allow",
    updatedInput: Q,
    decisionReason: {
      type: "mode",
      mode: B.mode
    }
  };
  let W = jD(G, B, "edit", "allow");
  if (W) return {
    behavior: "allow",
    updatedInput: Q,
    decisionReason: {
      type: "rule",
      rule: W
    }
  };
  return {
    behavior: "ask",
    message: `Claude requested permissions to write to ${G}, but you haven't granted it yet.`,
    suggestions: I31(G, "write", B),
    decisionReason: !J ? {
      type: "workingDir",
      reason: "Path is outside allowed working directories"
    } : void 0
  }
}
// @from(Start 14595307, End 14595898)
function I31(A, Q, B) {
  let G = !qT(A, B);
  if (Q === "read" && G) {
    let Z = Zv(A);
    return Ls(Z).map((J) => XxA(J, "session")).filter((J) => J !== void 0)
  }
  if (Q === "write" || Q === "create") {
    let Z = [{
      type: "setMode",
      mode: "acceptEdits",
      destination: "session"
    }];
    if (G) {
      let I = Zv(A),
        Y = Ls(I);
      Z.push({
        type: "addDirectories",
        directories: Y,
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
// @from(Start 14595900, End 14596361)
function Zf3(A) {
  let Q = kVA(cH(uQ()), "bash-outputs", e1());
  if (A.startsWith(Q)) return "Bash output files from current session are allowed for reading";
  if (eb3(A)) return "Session memory files are allowed for reading";
  if (Xz9(A)) return "Plan files for current session are allowed for reading";
  let B = NY1(),
    G = B.endsWith(_J1) ? B : B + _J1;
  if (A === B || A.startsWith(G)) return "Tool result files are allowed for reading";
  return
}
// @from(Start 14596366, End 14596369)
Jz9
// @from(Start 14596371, End 14596374)
ab3
// @from(Start 14596376, End 14596379)
sb3
// @from(Start 14596381, End 14596383)
Fz
// @from(Start 14596389, End 14596756)
EJ = L(() => {
  _0();
  U2();
  yI();
  H9A();
  S7();
  Q3();
  yI();
  cK();
  AZ();
  wF();
  MB();
  LV();
  AQ();
  _VA();
  to1();
  NE();
  LY1();
  Jz9 = BA(UB1(), 1), ab3 = [".gitconfig", ".gitmodules", ".bashrc", ".bash_profile", ".zshrc", ".zprofile", ".profile", ".ripgreprc", ".mcp.json"], sb3 = [".git", ".vscode", ".idea", ".claude"];
  Fz = _a.sep
})
// @from(Start 14597003, End 14597372)
async function rb2(A, Q, {
  limit: B,
  offset: G
}, Z, I) {
  let Y = RWA(TWA(I), Q),
    J = ["--files", "--glob", A, "--sort=modified", "--no-ignore", "--hidden"];
  for (let K of Y) J.push("--glob", `!${K}`);
  let X = (await aj(J, Q, Z)).map((K) => bK0(K) ? K : yVA(Q, K)),
    V = X.length > G + B;
  return {
    files: X.slice(G, G + B),
    truncated: V
  }
}
// @from(Start 14597374, End 14597450)
function PD(A) {
  let Q = RA();
  return Math.ceil(Q.statSync(A).mtimeMs)
}
// @from(Start 14597452, End 14597726)
function eeB(A, Q = 0, B) {
  let I = RA().readFileSync(A, {
      encoding: "utf8"
    }).split(/\r?\n/),
    Y = B !== void 0 && I.length - Q > B ? I.slice(Q, Q + B) : I.slice(Q);
  return {
    content: Y.join(`
`),
    lineCount: Y.length,
    totalLines: I.length
  }
}
// @from(Start 14597728, End 14597853)
function KWA(A, Q, B, G) {
  let Z = Q;
  if (G === "CRLF") Z = Q.split(`
`).join(`\r
`);
  L_(A, Z, {
    encoding: B
  })
}
// @from(Start 14597855, End 14598333)
function CH(A) {
  try {
    let B = RA(),
      {
        resolvedPath: G
      } = fK(B, A),
      {
        buffer: Z,
        bytesRead: I
      } = B.readSync(G, {
        length: 4096
      });
    if (I >= 2) {
      if (Z[0] === 255 && Z[1] === 254) return "utf16le"
    }
    if (I >= 3 && Z[0] === 239 && Z[1] === 187 && Z[2] === 191) return "utf8";
    return Z.slice(0, I).toString("utf8").length > 0 ? "utf8" : "ascii"
  } catch (B) {
    return AA(B), "utf8"
  }
}
// @from(Start 14598335, End 14598641)
function M0A(A, Q = "utf8") {
  try {
    let B = RA(),
      {
        resolvedPath: G
      } = fK(B, A),
      {
        buffer: Z,
        bytesRead: I
      } = B.readSync(G, {
        length: 4096
      }),
      Y = Z.toString(Q, 0, I);
    return Xf3(Y)
  } catch (B) {
    return AA(B), "LF"
  }
}
// @from(Start 14598643, End 14598835)
function Xf3(A) {
  let Q = 0,
    B = 0;
  for (let G = 0; G < A.length; G++)
    if (A[G] === `
`)
      if (G > 0 && A[G - 1] === "\r") Q++;
      else B++;
  return Q > B ? "CRLF" : "LF"
}
// @from(Start 14598837, End 14599218)
function Pl(A) {
  let Q = bK0(A) ? A : Kz9(W0(), A),
    B = RA(),
    G = String.fromCharCode(8239),
    Z = /^(.+)([ \u202F])(AM|PM)(\.png)$/,
    I = xK0(Q).match(Z);
  if (I) {
    if (B.existsSync(Q)) return Q;
    let Y = I[2],
      J = Y === " " ? G : " ",
      W = Q.replace(`${Y}${I[3]}${I[4]}`, `${J}${I[3]}${I[4]}`);
    if (B.existsSync(W)) return W
  }
  return Q
}
// @from(Start 14599220, End 14599298)
function qYA(A) {
  return A.replace(/^\t+/gm, (Q) => "  ".repeat(Q.length))
}
// @from(Start 14599300, End 14599440)
function Vf3(A) {
  let Q = A ? b9(A) : void 0,
    B = Q ? If3(W0(), Q) : void 0;
  return {
    absolutePath: Q,
    relativePath: B
  }
}
// @from(Start 14599442, End 14599633)
function Q5(A) {
  let {
    relativePath: Q
  } = Vf3(A);
  if (Q && !Q.startsWith("..")) return Q;
  let B = Jf3();
  if (A.startsWith(B + Yf3)) return "~" + A.slice(B.length);
  return A
}
// @from(Start 14599635, End 14599940)
function I01(A) {
  let Q = RA();
  try {
    let B = Dz9(A),
      G = xK0(A, vK0(A));
    if (!Q.existsSync(B)) return;
    let Y = Q.readdirSync(B).filter((J) => xK0(J.name, vK0(J.name)) === G && yVA(B, J.name) !== A)[0];
    if (Y) return Y.name;
    return
  } catch (B) {
    AA(B);
    return
  }
}
// @from(Start 14599942, End 14600191)
function Sl({
  content: A,
  startLine: Q
}) {
  if (!A) return "";
  return A.split(/\r?\n/).map((G, Z) => {
    let I = Z + Q,
      Y = String(I);
    if (Y.length >= 6) return `${Y}→${G}`;
    return `${Y.padStart(6," ")}→${G}`
  }).join(`
`)
}
// @from(Start 14600193, End 14600292)
function RMB(A) {
  let Q = RA();
  if (!Q.existsSync(A)) return !0;
  return Q.isDirEmptySync(A)
}
// @from(Start 14600294, End 14600537)
function _q(A) {
  let Q = RA(),
    {
      resolvedPath: B,
      isSymlink: G
    } = fK(Q, A);
  if (G) g(`Reading through symlink: ${A} -> ${B}`);
  let Z = CH(B);
  return Q.readFileSync(B, {
    encoding: Z
  }).replaceAll(`\r
`, `
`)
}
// @from(Start 14600539, End 14600615)
function i00(A) {
  let {
    content: Q
  } = Dh0.readFile(A);
  return Q
}
// @from(Start 14600617, End 14602196)
function L_(A, Q, B = {
  encoding: "utf-8"
}) {
  let G = RA(),
    Z = A;
  if (G.existsSync(A)) try {
    let Y = G.readlinkSync(A);
    Z = bK0(Y) ? Y : Kz9(Dz9(A), Y), g(`Writing through symlink: ${A} -> ${Z}`)
  } catch (Y) {
    Z = A
  }
  let I = `${Z}.tmp.${process.pid}.${Date.now()}`;
  try {
    g(`Writing to temp file: ${I}`);
    let Y, J = G.existsSync(Z);
    if (J) Y = G.statSync(Z).mode, g(`Preserving file permissions: ${Y.toString(8)}`);
    else if (B.mode !== void 0) Y = B.mode, g(`Setting permissions for new file: ${Y.toString(8)}`);
    let W = {
      encoding: B.encoding,
      flush: !0
    };
    if (!J && B.mode !== void 0) W.mode = B.mode;
    if (G.writeFileSync(I, Q, W), g(`Temp file written successfully, size: ${Q.length} bytes`), J && Y !== void 0) Wf3(I, Y), g("Applied original permissions to temp file");
    g(`Renaming ${I} to ${Z}`), G.renameSync(I, Z), g(`File ${Z} written atomically`)
  } catch (Y) {
    g(`Failed to write file atomically: ${Y}`), AA(Y), GA("tengu_atomic_write_error", {});
    try {
      if (G.existsSync(I)) g(`Cleaning up temp file: ${I}`), G.unlinkSync(I)
    } catch (J) {
      g(`Failed to clean up temp file: ${J}`)
    }
    g(`Falling back to non-atomic write for ${Z}`);
    try {
      let J = {
        encoding: B.encoding,
        flush: !0
      };
      if (!G.existsSync(Z) && B.mode !== void 0) J.mode = B.mode;
      G.writeFileSync(Z, Q, J), g(`File ${Z} written successfully with non-atomic fallback`)
    } catch (J) {
      throw g(`Non-atomic write also failed: ${J}`), J
    }
  }
}
// @from(Start 14602198, End 14602258)
function vJ1(A) {
  return A.replace(/[^a-zA-Z0-9]/g, "-")
}
// @from(Start 14602260, End 14602533)
function UJ(A) {
  let Q = A / 1024;
  if (Q < 1) return `${A} bytes`;
  if (Q < 1024) return `${Q.toFixed(1).replace(/\.0$/,"")}KB`;
  let B = Q / 1024;
  if (B < 1024) return `${B.toFixed(1).replace(/\.0$/,"")}MB`;
  return `${(B/1024).toFixed(1).replace(/\.0$/,"")}GB`
}
// @from(Start 14602535, End 14602656)
function vWA(A) {
  let Q = vK0(A);
  if (!Q) return "unknown";
  return Hz9.getLanguage(Q.slice(1))?.name ?? "unknown"
}
// @from(Start 14602658, End 14602838)
function NrA(A) {
  let Q = RA();
  try {
    if (!Q.existsSync(A)) Q.mkdirSync(A);
    return !0
  } catch (B) {
    return AA(B instanceof Error ? B : Error(String(B))), !1
  }
}
// @from(Start 14602840, End 14602944)
function Y01(A, Q = uNA) {
  try {
    return RA().statSync(A).size <= Q
  } catch {
    return !1
  }
}
// @from(Start 14602949, End 14602952)
Hz9
// @from(Start 14602954, End 14602966)
uNA = 262144
// @from(Start 14602970, End 14602973)
m_2
// @from(Start 14602975, End 14602978)
xJ1
// @from(Start 14602980, End 14602982)
mj
// @from(Start 14602988, End 14603667)
R9 = L(() => {
  g1();
  V0();
  OZ();
  q0();
  XU0();
  sj();
  U2();
  l2();
  AQ();
  Hh0();
  EJ();
  Q3();
  yI();
  Hz9 = BA(rD1(), 1);
  m_2 = s1(async () => {
    let A = o9();
    setTimeout(() => {
      A.abort()
    }, 1000);
    let Q = await JS0(W0(), A.signal, 15),
      B = 0;
    for (let G of Q)
      if (M0A(G) === "CRLF") B++;
    return B > 3 ? "CRLF" : "LF"
  });
  xJ1 = GV1("claude-cli");
  mj = {
    baseLogs: () => yVA(xJ1.cache, vJ1(RA().cwd())),
    errors: () => yVA(xJ1.cache, vJ1(RA().cwd()), "errors"),
    messages: () => yVA(xJ1.cache, vJ1(RA().cwd()), "messages"),
    mcpLogs: (A) => yVA(xJ1.cache, vJ1(RA().cwd()), `mcp-logs-${A}`)
  }
})
// @from(Start 14603786, End 14603848)
function Kf3() {
  return bSA(iw(), "managed-settings.json")
}
// @from(Start 14603850, End 14604078)
function Df3(A, Q) {
  if (typeof A === "object" && A && "code" in A && A.code === "ENOENT") g(`Broken symlink or missing file encountered for settings.json at path: ${Q}`);
  else AA(A instanceof Error ? A : Error(String(A)))
}
// @from(Start 14604080, End 14604623)
function Ez9(A) {
  let Q = RA();
  if (!Q.existsSync(A)) return {
    settings: null,
    errors: []
  };
  try {
    let {
      resolvedPath: B
    } = fK(Q, A), G = _q(B);
    if (G.trim() === "") return {
      settings: {},
      errors: []
    };
    let Z = f7(G, !1),
      I = sAA.safeParse(Z);
    if (!I.success) return {
      settings: null,
      errors: r50(I.error, A)
    };
    return {
      settings: I.data,
      errors: []
    }
  } catch (B) {
    return Df3(B, A), {
      settings: null,
      errors: []
    }
  }
}
// @from(Start 14604625, End 14604912)
function yJ1(A) {
  switch (A) {
    case "userSettings":
      return xSA(MQ());
    case "policySettings":
    case "projectSettings":
    case "localSettings":
      return xSA(uQ());
    case "flagSettings": {
      let Q = yX1();
      return Q ? Cz9(xSA(Q)) : xSA(uQ())
    }
  }
}
// @from(Start 14604914, End 14605198)
function Gw(A) {
  switch (A) {
    case "userSettings":
      return bSA(yJ1(A), "settings.json");
    case "projectSettings":
    case "localSettings":
      return bSA(yJ1(A), PMA(A));
    case "policySettings":
      return Kf3();
    case "flagSettings":
      return yX1()
  }
}
// @from(Start 14605200, End 14605389)
function PMA(A) {
  switch (A) {
    case "projectSettings":
      return bSA(".claude", "settings.json");
    case "localSettings":
      return bSA(".claude", "settings.local.json")
  }
}
// @from(Start 14605391, End 14605498)
function OB(A) {
  let Q = Gw(A);
  if (!Q) return null;
  let {
    settings: B
  } = Ez9(Q);
  return B
}
// @from(Start 14605500, End 14606552)
function cB(A, Q) {
  if (A === "policySettings" || A === "flagSettings") return {
    error: null
  };
  let B = Gw(A);
  if (!B) return {
    error: null
  };
  try {
    let G = Cz9(B);
    if (!RA().existsSync(G)) RA().mkdirSync(G);
    let Z = OB(A);
    if (!Z && RA().existsSync(B)) {
      let Y = _q(B),
        J = f7(Y);
      if (J === null) return {
        error: Error(`Invalid JSON syntax in settings file at ${B}`)
      };
      if (J && typeof J === "object") Z = J, g(`Using raw settings from ${B} due to validation failure`)
    }
    let I = rX1(Z || {}, Q, (Y, J, W, X) => {
      if (J === void 0 && X && typeof W === "string") {
        delete X[W];
        return
      }
      if (Array.isArray(J)) return J;
      return
    });
    if (fm.markInternalWrite(A), L_(B, JSON.stringify(I, null, 2) + `
`), e7A(), A === "localSettings") N60(PMA("localSettings"), uQ())
  } catch (G) {
    let Z = Error(`Failed to read raw settings from ${B}: ${G}`);
    return AA(Z), {
      error: Z
    }
  }
  return {
    error: null
  }
}
// @from(Start 14606554, End 14606632)
function Hf3(A, Q) {
  let B = [...A, ...Q];
  return Array.from(new Set(B))
}
// @from(Start 14606634, End 14607451)
function zz9(A) {
  let Q = sAA.strip().parse(A),
    B = ["permissions", "sandbox", "hooks"],
    G = [],
    Z = {
      permissions: new Set(["allow", "deny", "ask", "defaultMode", "disableBypassPermissionsMode", "additionalDirectories"]),
      sandbox: new Set(["network", "ignoreViolations", "excludedCommands", "autoAllowBashIfSandboxed", "enableWeakerNestedSandbox"]),
      hooks: new Set(["PreToolUse", "PostToolUse", "Notification", "UserPromptSubmit", "SessionStart", "SessionEnd", "Stop", "SubagentStop", "PreCompact"])
    };
  for (let I of Object.keys(Q))
    if (B.includes(I) && Q[I] && typeof Q[I] === "object") {
      let Y = Q[I],
        J = Z[I];
      if (J) {
        for (let W of Object.keys(Y))
          if (J.has(W)) G.push(`${I}.${W}`)
      }
    } else G.push(I);
  return G.sort()
}
// @from(Start 14607453, End 14607484)
function e7A() {
  vSA = null
}
// @from(Start 14607486, End 14608128)
function Cf3() {
  let A = {},
    Q = [],
    B = new Set,
    G = new Set;
  for (let I of ls()) {
    let Y = Gw(I);
    if (!Y) continue;
    let J = xSA(Y);
    if (G.has(J)) continue;
    G.add(J);
    let {
      settings: W,
      errors: X
    } = Ez9(Y);
    for (let V of X) {
      let F = `${V.file}:${V.path}:${V.message}`;
      if (!B.has(F)) B.add(F), Q.push(V)
    }
    if (W) A = rX1(A, W, (V, F) => {
      if (Array.isArray(V) && Array.isArray(F)) return Hf3(V, F);
      return
    })
  }
  let Z = ["user", "project", "local"];
  return Q.push(...Z.flatMap((I) => sX(I).errors)), {
    settings: A,
    errors: Q
  }
}
// @from(Start 14608130, End 14608200)
function $T() {
  let {
    settings: A
  } = wa();
  return A || {}
}
// @from(Start 14608202, End 14608277)
function wa() {
  if (vSA !== null) return vSA;
  return vSA = Cf3(), vSA
}
// @from(Start 14608282, End 14608292)
vSA = null
// @from(Start 14608296, End 14608298)
iw
// @from(Start 14608300, End 14608302)
l0
// @from(Start 14608308, End 14608808)
MB = L(() => {
  l2();
  IU0();
  R9();
  AQ();
  LF();
  g1();
  V0();
  Q3();
  LV();
  PIA();
  _0();
  L60();
  hQ();
  t50();
  tM();
  qKA();
  iw = s1(function() {
    switch (dQ()) {
      case "macos":
        return "/Library/Application Support/ClaudeCode";
      case "windows":
        if (Ff3("C:\\Program Files\\ClaudeCode")) return "C:\\Program Files\\ClaudeCode";
        return "C:\\ProgramData\\ClaudeCode";
      default:
        return "/etc/claude-code"
    }
  });
  l0 = $T
})
// @from(Start 14608849, End 14608948)
function zSA(A, Q) {
  let B = `mcp__${n7(Q)}__`;
  return A.filter((G) => G.name?.startsWith(B))
}
// @from(Start 14608950, End 14609049)
function eY1(A, Q) {
  let B = `mcp__${n7(Q)}__`;
  return A.filter((G) => G.name?.startsWith(B))
}
// @from(Start 14609051, End 14609151)
function MK9(A, Q) {
  let B = `mcp__${n7(Q)}__`;
  return A.filter((G) => !G.name?.startsWith(B))
}
// @from(Start 14609153, End 14609253)
function OK9(A, Q) {
  let B = `mcp__${n7(Q)}__`;
  return A.filter((G) => !G.name?.startsWith(B))
}
// @from(Start 14609255, End 14609327)
function RK9(A, Q) {
  let B = {
    ...A
  };
  return delete B[Q], B
}
// @from(Start 14609329, End 14609375)
function s09(A) {
  return `mcp__${n7(A)}__`
}
// @from(Start 14609377, End 14609450)
function lg(A) {
  return A.name?.startsWith("mcp__") || A.isMcp === !0
}
// @from(Start 14609452, End 14609653)
function mU(A) {
  let Q = A.split("__"),
    [B, G, ...Z] = Q;
  if (B !== "mcp" || !G) return null;
  let I = Z.length > 0 ? Z.join("__") : void 0;
  return {
    serverName: G,
    toolName: I
  }
}
// @from(Start 14609655, End 14609732)
function AJ1(A, Q) {
  let B = `mcp__${n7(Q)}__`;
  return A.replace(B, "")
}
// @from(Start 14609734, End 14609901)
function QJ1(A) {
  let Q = A.replace(/\s*\(MCP\)\s*$/, "");
  Q = Q.trim();
  let B = Q.indexOf(" - ");
  if (B !== -1) return Q.substring(B + 3).trim();
  return Q
}
// @from(Start 14609903, End 14610510)
function YN(A) {
  let Q = RA();
  switch (A) {
    case "user": {
      let B = nK(),
        G = Q.existsSync(B);
      return `${B}${G?"":" (file does not exist)"}`
    }
    case "project": {
      let B = Ef3(W0(), ".mcp.json"),
        G = Q.existsSync(B);
      return `${B}${G?"":" (file does not exist)"}`
    }
    case "local":
      return `${nK()} [project: ${W0()}]`;
    case "dynamic":
      return "Dynamically configured";
    case "enterprise": {
      let B = H21(),
        G = Q.existsSync(B);
      return `${B}${G?"":" (file does not exist)"}`
    }
    default:
      return A
  }
}
// @from(Start 14610512, End 14610969)
function iQA(A) {
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
    default:
      return A
  }
}
// @from(Start 14610971, End 14611138)
function fSA(A) {
  if (!A) return "local";
  if (!Pe1.options.includes(A)) throw Error(`Invalid scope: ${A}. Must be one of: ${Pe1.options.join(", ")}`);
  return A
}
// @from(Start 14611140, End 14611327)
function Uz9(A) {
  if (!A) return "stdio";
  if (A !== "stdio" && A !== "sse" && A !== "http") throw Error(`Invalid transport type: ${A}. Must be one of: stdio, sse, http`);
  return A
}
// @from(Start 14611329, End 14611698)
function fK0(A) {
  let Q = {};
  for (let B of A) {
    let G = B.indexOf(":");
    if (G === -1) throw Error(`Invalid header format: "${B}". Expected format: "Header-Name: value"`);
    let Z = B.substring(0, G).trim(),
      I = B.substring(G + 1).trim();
    if (!Z) throw Error(`Invalid header: "${B}". Header name cannot be empty.`);
    Q[Z] = I
  }
  return Q
}
// @from(Start 14611700, End 14611957)
function C21(A) {
  let Q = l0(),
    B = n7(A);
  if (Q?.disabledMcpjsonServers?.some((G) => n7(G) === B)) return "rejected";
  if (Q?.enabledMcpjsonServers?.some((G) => n7(G) === B) || Q?.enableAllProjectMcpServers) return "approved";
  return "pending"
}
// @from(Start 14611962, End 14612027)
nX = L(() => {
  MB();
  MIA();
  c5();
  U2();
  AQ();
  tM()
})
// @from(Start 14612030, End 14612100)
function bZ() {
  return Y0(process.env.ENABLE_EXPERIMENTAL_MCP_CLI)
}
// @from(Start 14612102, End 14612178)
function xVA() {
  return bZ() && !_j(process.env.ENABLE_MCP_CLI_ENDPOINT)
}
// @from(Start 14612180, End 14612496)
function hAA(A) {
  let Q = A.match(/^mcp-cli\s+(call|read)\s+([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)(?:\s+([\s\S]+))?$/);
  if (!Q) return null;
  let [, B, G, Z, I = ""] = Q;
  if (!B || !G || !Z) return null;
  return {
    command: B,
    server: G,
    tool: Z,
    toolName: Z,
    args: I,
    fullCommand: A
  }
}
// @from(Start 14612498, End 14612613)
function zK0(A) {
  let Q = mU(A);
  if (!Q || !Q.toolName) return null;
  return `${Q.serverName}/${Q.toolName}`
}
// @from(Start 14612618, End 14612650)
dH = L(() => {
  hQ();
  nX()
})
// @from(Start 14612656, End 14613163)
hSA = z((zf3) => {
  class hK0 extends Error {
    constructor(A, Q, B) {
      super(B);
      Error.captureStackTrace(this, this.constructor), this.name = this.constructor.name, this.code = Q, this.exitCode = A, this.nestedError = void 0
    }
  }
  class $z9 extends hK0 {
    constructor(A) {
      super(1, "commander.invalidArgument", A);
      Error.captureStackTrace(this, this.constructor), this.name = this.constructor.name
    }
  }
  zf3.CommanderError = hK0;
  zf3.InvalidArgumentError = $z9
})
// @from(Start 14613169, End 14614819)
bJ1 = z((Nf3) => {
  var {
    InvalidArgumentError: wf3
  } = hSA();
  class wz9 {
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
        if (!this.argChoices.includes(Q)) throw new wf3(`Allowed choices are ${this.argChoices.join(", ")}.`);
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

  function qf3(A) {
    let Q = A.name() + (A.variadic === !0 ? "..." : "");
    return A.required ? "<" + Q + ">" : "[" + Q + "]"
  }
  Nf3.Argument = wz9;
  Nf3.humanReadableArgName = qf3
})
// @from(Start 14614825, End 14621121)
gK0 = z((Rf3) => {
  var {
    humanReadableArgName: Of3
  } = bJ1();
  class qz9 {
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
      let Q = A.registeredArguments.map((B) => Of3(B)).join(" ");
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
        I = 2;

      function Y(D, H) {
        if (H) {
          let C = `${D.padEnd(B+2)}${H}`;
          return Q.wrap(C, G - 2, B + 2)
        }
        return D
      }

      function J(D) {
        return D.join(`
`).replace(/^/gm, " ".repeat(2))
      }
      let W = [`Usage: ${Q.commandUsage(A)}`, ""],
        X = Q.commandDescription(A);
      if (X.length > 0) W = W.concat([Q.wrap(X, G, 0), ""]);
      let V = Q.visibleArguments(A).map((D) => {
        return Y(Q.argumentTerm(D), Q.argumentDescription(D))
      });
      if (V.length > 0) W = W.concat(["Arguments:", J(V), ""]);
      let F = Q.visibleOptions(A).map((D) => {
        return Y(Q.optionTerm(D), Q.optionDescription(D))
      });
      if (F.length > 0) W = W.concat(["Options:", J(F), ""]);
      if (this.showGlobalOptions) {
        let D = Q.visibleGlobalOptions(A).map((H) => {
          return Y(Q.optionTerm(H), Q.optionDescription(H))
        });
        if (D.length > 0) W = W.concat(["Global Options:", J(D), ""])
      }
      let K = Q.visibleCommands(A).map((D) => {
        return Y(Q.subcommandTerm(D), Q.subcommandDescription(D))
      });
      if (K.length > 0) W = W.concat(["Commands:", J(K), ""]);
      return W.join(`
`)
    }
    padWidth(A, Q) {
      return Math.max(Q.longestOptionTermLength(A, Q), Q.longestGlobalOptionTermLength(A, Q), Q.longestSubcommandTermLength(A, Q), Q.longestArgumentTermLength(A, Q))
    }
    wrap(A, Q, B, G = 40) {
      let I = new RegExp(`[\\n][${" \\f\\t\\v   -   　\uFEFF"}]+`);
      if (A.match(I)) return A;
      let Y = Q - B;
      if (Y < G) return A;
      let J = A.slice(0, B),
        W = A.slice(B).replace(`\r
`, `
`),
        X = " ".repeat(B),
        F = `\\s${"​"}`,
        K = new RegExp(`
|.{1,${Y-1}}([${F}]|$)|[^${F}]+?([${F}]|$)`, "g"),
        D = W.match(K) || [];
      return J + D.map((H, C) => {
        if (H === `
`) return "";
        return (C > 0 ? X : "") + H.trimEnd()
      }).join(`
`)
    }
  }
  Rf3.Help = qz9
})
// @from(Start 14621127, End 14624347)
uK0 = z((_f3) => {
  var {
    InvalidArgumentError: Pf3
  } = hSA();
  class Nz9 {
    constructor(A, Q) {
      this.flags = A, this.description = Q || "", this.required = A.includes("<"), this.optional = A.includes("["), this.variadic = /\w\.\.\.[>\]]$/.test(A), this.mandatory = !1;
      let B = Sf3(A);
      if (this.short = B.shortFlag, this.long = B.longFlag, this.negate = !1, this.long) this.negate = this.long.startsWith("--no-");
      this.defaultValue = void 0, this.defaultValueDescription = void 0, this.presetArg = void 0, this.envVar = void 0, this.parseArg = void 0, this.hidden = !1, this.argChoices = void 0, this.conflictsWith = [], this.implied = void 0
    }
    default (A, Q) {
      return this.defaultValue = A, this.defaultValueDescription = Q, this
    }
    preset(A) {
      return this.presetArg = A, this
    }
    conflicts(A) {
      return this.conflictsWith = this.conflictsWith.concat(A), this
    }
    implies(A) {
      let Q = A;
      if (typeof A === "string") Q = {
        [A]: !0
      };
      return this.implied = Object.assign(this.implied || {}, Q), this
    }
    env(A) {
      return this.envVar = A, this
    }
    argParser(A) {
      return this.parseArg = A, this
    }
    makeOptionMandatory(A = !0) {
      return this.mandatory = !!A, this
    }
    hideHelp(A = !0) {
      return this.hidden = !!A, this
    }
    _concatValue(A, Q) {
      if (Q === this.defaultValue || !Array.isArray(Q)) return [A];
      return Q.concat(A)
    }
    choices(A) {
      return this.argChoices = A.slice(), this.parseArg = (Q, B) => {
        if (!this.argChoices.includes(Q)) throw new Pf3(`Allowed choices are ${this.argChoices.join(", ")}.`);
        if (this.variadic) return this._concatValue(Q, B);
        return Q
      }, this
    }
    name() {
      if (this.long) return this.long.replace(/^--/, "");
      return this.short.replace(/^-/, "")
    }
    attributeName() {
      return jf3(this.name().replace(/^no-/, ""))
    }
    is(A) {
      return this.short === A || this.long === A
    }
    isBoolean() {
      return !this.required && !this.optional && !this.negate
    }
  }
  class Lz9 {
    constructor(A) {
      this.positiveOptions = new Map, this.negativeOptions = new Map, this.dualOptions = new Set, A.forEach((Q) => {
        if (Q.negate) this.negativeOptions.set(Q.attributeName(), Q);
        else this.positiveOptions.set(Q.attributeName(), Q)
      }), this.negativeOptions.forEach((Q, B) => {
        if (this.positiveOptions.has(B)) this.dualOptions.add(B)
      })
    }
    valueFromOption(A, Q) {
      let B = Q.attributeName();
      if (!this.dualOptions.has(B)) return !0;
      let G = this.negativeOptions.get(B).presetArg,
        Z = G !== void 0 ? G : !1;
      return Q.negate === (Z === A)
    }
  }

  function jf3(A) {
    return A.split("-").reduce((Q, B) => {
      return Q + B[0].toUpperCase() + B.slice(1)
    })
  }

  function Sf3(A) {
    let Q, B, G = A.split(/[ |,]+/);
    if (G.length > 1 && !/^[[<]/.test(G[1])) Q = G.shift();
    if (B = G.shift(), !Q && /^-[^-]$/.test(B)) Q = B, B = void 0;
    return {
      shortFlag: Q,
      longFlag: B
    }
  }
  _f3.Option = Nz9;
  _f3.DualOptions = Lz9
})
// @from(Start 14624353, End 14625744)
Mz9 = z((bf3) => {
  function xf3(A, Q) {
    if (Math.abs(A.length - Q.length) > 3) return Math.max(A.length, Q.length);
    let B = [];
    for (let G = 0; G <= A.length; G++) B[G] = [G];
    for (let G = 0; G <= Q.length; G++) B[0][G] = G;
    for (let G = 1; G <= Q.length; G++)
      for (let Z = 1; Z <= A.length; Z++) {
        let I = 1;
        if (A[Z - 1] === Q[G - 1]) I = 0;
        else I = 1;
        if (B[Z][G] = Math.min(B[Z - 1][G] + 1, B[Z][G - 1] + 1, B[Z - 1][G - 1] + I), Z > 1 && G > 1 && A[Z - 1] === Q[G - 2] && A[Z - 2] === Q[G - 1]) B[Z][G] = Math.min(B[Z][G], B[Z - 2][G - 2] + 1)
      }
    return B[A.length][Q.length]
  }

  function vf3(A, Q) {
    if (!Q || Q.length === 0) return "";
    Q = Array.from(new Set(Q));
    let B = A.startsWith("--");
    if (B) A = A.slice(2), Q = Q.map((Y) => Y.slice(2));
    let G = [],
      Z = 3,
      I = 0.4;
    if (Q.forEach((Y) => {
        if (Y.length <= 1) return;
        let J = xf3(A, Y),
          W = Math.max(A.length, Y.length);
        if ((W - J) / W > I) {
          if (J < Z) Z = J, G = [Y];
          else if (J === Z) G.push(Y)
        }
      }), G.sort((Y, J) => Y.localeCompare(J)), B) G = G.map((Y) => `--${Y}`);
    if (G.length > 1) return `
(Did you mean one of ${G.join(", ")}?)`;
    if (G.length === 1) return `
(Did you mean ${G[0]}?)`;
    return ""
  }
  bf3.suggestSimilar = vf3
})