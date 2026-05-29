# Tools ↔ system-reminder Interaction

> Many tool results carry — or trigger downstream — `<system-reminder>…</system-reminder>` blocks that the model treats as ambient harness instructions rather than user input. This document catalogues every reminder that flows through (or alongside) a tool call: which tool emits it, in which stage, the exact text, and why the reminder exists.

> **See also**: `../41_system_reminder/` for the cross-cutting analysis of the `<system-reminder>` subsystem itself — wrap/strip primitives, the message-stream normalisation pipeline, UI suppression mechanism, telemetry split, and the full attachment-type catalogue. This file covers *only* the tool-adjacent slice.

> **Cross-validation**: the obfuscated bundle (`cli_inner_pretty.js` v2.1.142) and the 2.1.88 TypeScript reference (`/lyz/codespace/3rd/claude-code/src/`) match line-for-line on the reminder generators below. The TS file paths are given inline so each readable name can be confirmed in source.

## The two reminder-emitting primitives

Every reminder in the bundle ultimately routes through one of two helpers. Tools never write `<system-reminder>` strings inline; they emit *attachment-typed messages* (e.g., `{type:"edited_text_file", filename, snippet}`) and the post-tool normaliser wraps the rendered text using these helpers.

```javascript
// ============================================
// reminderWrap (h2) — string → tagged reminder string
// Location: cli_inner_pretty.js:424714-424718
// ============================================

// ORIGINAL (for source lookup):
function h2(H) {
  return `<system-reminder>
${H}
</system-reminder>`;
}

// READABLE (for understanding):
function reminderWrap(text) {
  // Wraps a plain string in the harness's reminder envelope.
  // The model treats anything inside <system-reminder>…</system-reminder>
  // as injected context, not as a user instruction (per the system prompt).
  return `<system-reminder>\n${text}\n</system-reminder>`;
}

// Mapping: h2→reminderWrap, H→text
```

```javascript
// ============================================
// wrapMessagesAsReminders (o_) — list[Message] → list[Message] (each text wrapped)
// Location: cli_inner_pretty.js:424748-424761
// ============================================

// ORIGINAL (for source lookup):
function o_(H) {
  return H.map(($) => {
    if (typeof $.message.content === "string")
      return { ...$, message: { ...$.message, content: h2($.message.content) } };
    else if (Array.isArray($.message.content)) {
      let q = $.message.content.map((K) => {
        if (K.type === "text") return { ...K, text: h2(K.text) };
        return K;
      });
      return { ...$, message: { ...$.message, content: q } };
    }
    return $;
  });
}

// READABLE (for understanding):
function wrapMessagesAsReminders(messages) {
  return messages.map((m) => {
    if (typeof m.message.content === "string") {
      return { ...m, message: { ...m.message, content: reminderWrap(m.message.content) } };
    }
    if (Array.isArray(m.message.content)) {
      const wrapped = m.message.content.map((part) =>
        part.type === "text" ? { ...part, text: reminderWrap(part.text) } : part,
      );
      return { ...m, message: { ...m.message, content: wrapped } };
    }
    return m;
  });
}

// Mapping: o_→wrapMessagesAsReminders, H→messages, $→m, q→wrapped, K→part
```

**Why two helpers (not one):** Some emitters work in strings (e.g., the Read tool's inline `<system-reminder>` for an empty file is built directly), but most emitters produce typed *messages* whose content is later flattened by `wrapMessagesAsReminders`. Splitting the helpers means tools can emit structured attachments (`{type:"edited_text_file", ...}`) and rely on a single normaliser to add the envelope at the right moment — no per-call string concatenation, no double-wrapping.

**Key insight:** `wrapMessagesAsReminders` (alias `o_`) only wraps `text` parts. Tool-result blocks of type `image` / `document` / `tool_use` pass through untouched, so the reminder envelope never accidentally tags a binary payload.

## Reminder vs. tool-result: who sees what

```
                  Model API (Anthropic)            User UI (Ink)
                       ▲                                ▲
                       │  ToolResultBlockParam          │  React components
                       │  (mapToolResultToToolResult-   │  (renderToolResult-
                       │   BlockParam)                  │   Message, render-
                       │                                │   ToolUseRejected-
                       │                                │   Message, …)
        ┌──────────────┴────────────────────────────────┴──────────────┐
        │                  Tool subsystem                              │
        │                                                              │
        │   data ────────────┬───── shaped for API ─── tool_result ────┤
        │                    │                                          │
        │   newMessages ─────┼─── prepended to stream ──── often wrap- ─┤
        │   (attachments)    │     ped by o_() → reminders              │
        │                    │                                          │
        │   ctx.append-      └─── side-channel system block             │
        │   SystemMessage()       (UI-only, stripped at API boundary)   │
        └───────────────────────────────────────────────────────────────┘
```

Three rules:
1. The *primary* tool_result block is **not** a reminder. The model sees it as the normal `{type:"tool_result", content:"…"}` response to its `tool_use`.
2. Reminders ride alongside the result as separate attachments. They appear in the same turn but at the API boundary they are surfaced as plain text inside `<system-reminder>` tags. The model is taught (system prompt + post-compact prompt) to treat them as harness context.
3. UI rendering of the tool's outcome (success/reject/error) is *parallel* to reminder injection. The reminder mechanism is API-facing; the renderer surface produces React nodes that never become tokens.

## Catalogue of tool-adjacent reminders

The bundle's attachment dispatcher (`normalizeAttachmentForAPI` at `cli_inner_pretty.js:424960+`) has a `switch` over every reminder attachment type. Every case ending in `o_([w8({ … })])` produces a reminder. The table below maps **which tool (or tool-system event) emits which case**.

| Attachment type | Emitter | When |
|-----------------|---------|------|
| `todo_reminder` | scheduled before/after TodoWrite | If `turnsSinceLastTodoWrite ≥ 10` *and* `turnsSinceLastReminder ≥ 10` |
| `task_reminder` | scheduled before/after TaskCreate/TaskUpdate | Same thresholds as above |
| `edited_text_file` | PostToolUse hook touched a file modified by Edit/Write/NotebookEdit | When a formatter / linter hook actually changed the file content |
| `deferred_tools_delta` | mid-session MCP connect/disconnect/plan-mode | Set of deferred tools changed |
| `agent_listing_delta` | Agent definitions added/removed | Reload of `.claude/agents/` |
| `mcp_instructions_delta` | MCP server provided / withdrew instructions | Server connect/disconnect |
| `relevant_memories` | Auto-memory recall (not tool-driven) | Memory match for current turn |
| `task_status` | Background task lifecycle event | `task_running`, `task_completed`, `task_killed` |
| `verify_plan_reminder` | After plan-mode → execution | Plan completion check |
| `plan_mode_reentry` | EnterPlanMode tool, second+ entry | Plan file already exists |
| `selected_lines_in_ide` / `opened_file_in_ide` | IDE bridge | User selected text or opened file |
| `pdf_reference` | Read tool attached a too-big PDF | File size > inline budget |
| `compact_file_reference` | Read happened pre-compact, content evicted | Post-compact replay |
| `nested_memory` | Auto-memory loaded nested CLAUDE.md | Memory hierarchy walk |
| `agent_mention` | User typed `@<agent>` | Trigger Agent tool with that agent |
| `skill_listing` | Skill discovery | Available skills changed |
| `mcp_resource` | ReadMcpResource tool delivered content | Read content >0 bytes |
| `async_hook_response` | asyncRewake hook fired | Hook produced output |
| `hook_success` | UserPromptSubmit / SessionStart / UserPromptExpansion hook | Hook printed extra context |
| `directory` | Synthetic Read of a directory | `Read` tool input refers to a dir |
| `queued_command` | User typed during a tool run | Buffered for next turn |
| `diagnostics` | LSP diagnostics changed | Workspace lint state |

### TodoWrite / TaskCreate / TaskUpdate — passive nudges

The model is *not* always reminded after a TodoWrite — that would be redundant. Instead, the dispatcher counts:

```javascript
// ============================================
// shouldEmitTodoReminder (Vq5) — nudge after long quiet stretch
// Location: cli_inner_pretty.js:398561-398572
// ============================================

// ORIGINAL (for source lookup):
async function Vq5(H, $) {
  if (!$.options.tools.some((_) => G1(_, HV))) return [];
  if (oO8 && $.options.tools.some((_) => G1(_, oO8))) return [];
  if (!H || H.length === 0) return [];
  let { turnsSinceLastTodoWrite: q, turnsSinceLastReminder: K } = Tq5(H);
  if (q >= aO8.TURNS_SINCE_WRITE && K >= aO8.TURNS_BETWEEN_REMINDERS) {
    let _ = $.agentId ?? v$(),
      z = $.getAppState().todos[_] ?? [];
    return [{ type: "todo_reminder", content: z, itemCount: z.length }];
  }
  return [];
}

// READABLE (for understanding):
async function maybeEmitTodoReminder(messages, ctx) {
  // Skip if TodoWrite isn't even enabled in the current tool set.
  if (!ctx.options.tools.some((t) => toolMatchesName(t, TODO_WRITE_TOOL_NAME))) return [];
  // Skip if the new-style TaskList tool is enabled — task_reminder takes over.
  if (TASK_TOOL_NAME && ctx.options.tools.some((t) => toolMatchesName(t, TASK_TOOL_NAME))) return [];
  if (!messages || messages.length === 0) return [];

  const { turnsSinceLastTodoWrite, turnsSinceLastReminder } = countTurnsSinceTodoEvents(messages);

  if (
    turnsSinceLastTodoWrite >= REMINDER_THRESHOLDS.TURNS_SINCE_WRITE &&        // 10
    turnsSinceLastReminder >= REMINDER_THRESHOLDS.TURNS_BETWEEN_REMINDERS      // 10
  ) {
    const agentId = ctx.agentId ?? currentMainAgentId();
    const todos = ctx.getAppState().todos[agentId] ?? [];
    // The renderer (case "todo_reminder" at line 425046) will format this list into the
    // gentle "TodoWrite hasn't been used recently…" reminder text.
    return [{ type: "todo_reminder", content: todos, itemCount: todos.length }];
  }
  return [];
}

// Mapping: Vq5→maybeEmitTodoReminder, H→messages, $→ctx, HV→TODO_WRITE_TOOL_NAME,
//          oO8→TASK_TOOL_NAME, Tq5→countTurnsSinceTodoEvents, aO8→REMINDER_THRESHOLDS
```

The renderer for `todo_reminder` (at `cli_inner_pretty.js:425046-425057`) emits:

> The TodoWrite tool hasn't been used recently. If you're working on tasks that would benefit from tracking progress, consider using the TodoWrite tool to track progress. Also consider cleaning up the todo list if has become stale and no longer matches what you are working on. Only use it if it's relevant to the current work. This is just a gentle reminder - ignore if not applicable.
>
> Here are the existing contents of your todo list:
>
> `[1. [pending] …, 2. [in_progress] …, …]`

**Why thresholds = 10 / 10:** A reminder every turn would be noise; never would be useless. The bundle picks 10 turns since-the-last-write *and* 10 turns since-the-last-reminder so a fresh user session (which has no recent write) does not get badgered, and so two reminders never fire back-to-back. The dual gate matters: a model that ignored a previous reminder still has to wait another 10 turns before being prodded again.

**Key insight:** The reminder embeds the **current todo list** in the same payload. This is critical: by the time the model reads the reminder, it may have forgotten which todos exist (e.g., post-compact). Embedding lets the model immediately verify whether the list is stale without an extra round trip.

The `task_reminder` follows the same pattern but for the newer `TaskCreate` (`OX`) / `TaskUpdate` (`P0`) tools. Its threshold object (`aO8`) is shared between the two emitters — both use `{ TURNS_SINCE_WRITE: 10, TURNS_BETWEEN_REMINDERS: 10 }`.

### Read tool — three structured reminders

The Read tool emits reminders for three distinct outcomes, each baked into `mapToolResultToToolResultBlockParam`:

```javascript
// ============================================
// readTool.mapToolResultToToolResultBlockParam — reminder cases
// Location: cli_inner_pretty.js:407419-407431
// ============================================

// ORIGINAL (for source lookup):
case "file_unchanged":
  return { tool_use_id: $, type: "tool_result", content: _VK() };          // "Wasted call — file unchanged…"
case "text": {
  let q;
  if (H.file.content) q = m45(H) + u45(H.file);
  else
    q =
      H.file.totalLines === 0
        ? "<system-reminder>Warning: the file exists but the contents are empty.</system-reminder>"
        : `<system-reminder>Warning: the file exists but is shorter than the provided offset (${H.file.startLine}). The file has ${H.file.totalLines} lines.</system-reminder>`;
  return { tool_use_id: $, type: "tool_result", content: q };
}

// READABLE (for understanding):
case "file_unchanged":
  // Read called on a file whose mtime hasn't changed since the prior read — the model
  // is wasting tokens re-pulling identical content. Tell it so. _VK() returns the
  // constant: "Wasted call — file unchanged since your last Read. Refer to that earlier tool_result instead."
  return { tool_use_id: toolUseID, type: "tool_result", content: WASTED_READ_REMINDER };
case "text": {
  let content;
  if (outputData.file.content) {
    // Normal path — line-numbered content with optional follow-up hints
    content = formatReadHeader(outputData) + formatReadBody(outputData.file);
  } else {
    // File exists but the requested slice produced nothing
    content =
      outputData.file.totalLines === 0
        ? "<system-reminder>Warning: the file exists but the contents are empty.</system-reminder>"
        : `<system-reminder>Warning: the file exists but is shorter than the provided offset (${outputData.file.startLine}). The file has ${outputData.file.totalLines} lines.</system-reminder>`;
  }
  return { tool_use_id: toolUseID, type: "tool_result", content };
}

// Mapping: H→outputData, $→toolUseID, _VK→WASTED_READ_REMINDER, m45→formatReadHeader, u45→formatReadBody
```

Three reasons the Read tool *inlines* the reminder into the tool_result `content` rather than using the attachment mechanism:

1. **Atomicity** — the reminder belongs to *this specific* tool_use, not the turn. If a parallel tool batch produces six successful reads and one wasted read, the reminder must be attached to the wasted one so the model knows which call to fix.
2. **Cache friendliness** — the prompt cache keys tool_results by `tool_use_id` + content hash. Inlining the reminder text keeps the wasted-call placeholder identical across all wasted reads, hitting cache more reliably than a separate attachment whose ordering might shift.
3. **No retry confusion** — if the reminder were a sibling attachment, the model might mis-attribute it to the *next* tool call in the same turn.

### Edit / Write / NotebookEdit — the `edited_text_file` reminder (PostToolUse hook side effect)

When a file-editing tool succeeds and a PostToolUse hook (e.g., a formatter like `prettier` or `ruff`) modifies the file again, the dispatcher detects the on-disk change and emits an `edited_text_file` attachment:

```javascript
// ============================================
// detectPostHookFileChange (Z38) — flag in-flight format/linter
// Location: cli_inner_pretty.js:378825+
// ============================================

// ORIGINAL (for source lookup):
function Z38(H, $, q, K) {
  if (H !== G7 && H !== o4) return null;
  if (typeof q !== "object" || q === null || !("file_path" in q) || typeof q.file_path !== "string") return null;
  try {
    let _ = eq(q.file_path),
      A = K.get(_);
    if (!A || A.offset !== void 0 || A.limit !== void 0) return null;
    let z = oN(_);
    if (z <= A.timestamp) return null;
    let Y = Mc(_);
    if ((K.set(_, { content: Y.content, timestamp: z, offset: void 0, limit: void 0 }), xt(A, Y.content))) return null;
    return (
      N(`PostToolUse hook modified ${_} after ${H} — re-synced readFileState`, { level: "info" }),
      fK({
        type: "hook_additional_context",
        content: [
          `PostToolUse hook modified ${_} after your edit (likely a formatter). Your next Edit will not fail with a stale-file error, but if its old_string targets a region the hook reformatted, Read the file first.`,
        ],
        hookName: `PostToolUse:${H}`,
        toolUseID: $,
        hookEvent: "PostToolUse",
      })
    );
  } catch {
    return null;
  }
}

// READABLE (for understanding):
function detectPostHookFileChange(toolName, toolUseID, input, readFileState) {
  // Only meaningful for Edit / Write — Read can't trigger this code path
  if (toolName !== EDIT_TOOL_NAME && toolName !== WRITE_TOOL_NAME) return null;
  if (typeof input !== "object" || input === null || !("file_path" in input) || typeof input.file_path !== "string") return null;
  try {
    const absPath = resolvePath(input.file_path);
    const prevState = readFileState.get(absPath);
    // Only react when we have full-file state — partial reads (offset/limit) can't be trusted.
    if (!prevState || prevState.offset !== undefined || prevState.limit !== undefined) return null;
    const mtimeNow = getFileMtimeMs(absPath);
    if (mtimeNow <= prevState.timestamp) return null;
    const fresh = readFileSync(absPath);
    // Re-sync the cache and bail out if contents are unchanged (mtime touched but bytes equal).
    readFileState.set(absPath, { content: fresh.content, timestamp: mtimeNow, offset: undefined, limit: undefined });
    if (contentsEqual(prevState, fresh.content)) return null;
    logger.info(`PostToolUse hook modified ${absPath} after ${toolName} — re-synced readFileState`);
    // Emit a hook_additional_context attachment — the renderer turns this into a system-reminder.
    return makeAttachmentMessage({
      type: "hook_additional_context",
      content: [
        `PostToolUse hook modified ${absPath} after your edit (likely a formatter). Your next Edit will not fail with a stale-file error, but if its old_string targets a region the hook reformatted, Read the file first.`,
      ],
      hookName: `PostToolUse:${toolName}`,
      toolUseID,
      hookEvent: "PostToolUse",
    });
  } catch {
    return null;
  }
}

// Mapping: Z38→detectPostHookFileChange, H→toolName, $→toolUseID, q→input, K→readFileState,
//          G7→EDIT_TOOL_NAME, o4→WRITE_TOOL_NAME, eq→resolvePath, A→prevState, oN→getFileMtimeMs,
//          Mc→readFileSync, xt→contentsEqual, fK→makeAttachmentMessage
```

**Why automatic detection rather than relying on the hook to declare it:** Hooks are arbitrary user scripts; they can't be trusted to faithfully report mutations. The dispatcher reads the file's mtime + bytes itself, so a formatter that "lies" or doesn't report at all still triggers the reminder. The `readFileState` re-sync is the same call — one stat + one read covers both purposes.

**Key insight:** The reminder text (`"likely a formatter"`) is deliberately hedged. The dispatcher cannot tell *who* changed the file (a sibling hook? an external IDE? a watch command?), so it attributes plausibly without overcommitting. The next Edit's anti-stale check (which compares the cached `timestamp` against current mtime) does the actual work — the reminder just primes the model so it doesn't panic at an unexpected mismatch.

The `edited_text_file` attachment is *separately* emitted for the "user manually edited a file between turns" path. See the attachment renderer at `cli_inner_pretty.js:426070-426080`:

> Note: `<filename>` was modified, either by the user or by a linter. This change was intentional, so make sure to take it into account as you proceed (ie. don't revert it unless the user asks you to). Don't tell the user this, since they are already aware. Here are the relevant changes (shown with line numbers):
> `<snippet>`

Or, if multiple files exceeded the snippet budget:

> Note: `<filename>` was modified, either by the user or by a linter. This change was intentional, so make sure to take it into account as you proceed (ie. don't revert it unless the user asks you to). Don't tell the user this, since they are already aware. The diff was omitted because other modified files in this turn already exceeded the snippet budget; use the Read tool if you need the current content.

### ToolSearch — the `deferred_tools_delta` reminder

Covered in detail in `deferred_tools.md`. Summary: whenever the set of deferred tools changes mid-session (MCP server connects, plan mode toggles, feature flag flips), the dispatcher emits a `deferred_tools_delta` attachment. The renderer produces a four-section reminder with `added`, `re-added`, `removed`, and `pending` server lists. The reminder always references `ToolSearch` by its constant name (`cY`) so the model knows the recovery path.

### Agent tool — the `agent_listing_delta` reminder

```javascript
// Renderer at cli_inner_pretty.js:425242-425267
// READABLE (for understanding):
case "agent_listing_delta": {
  const lines = [];
  if (delta.addedLines.length > 0) {
    const header = delta.isInitial
      ? "Available agent types for the Agent tool:"
      : "New agent types are now available for the Agent tool:";
    lines.push(`${header}\n${delta.addedLines.join("\n")}`);
  }
  if (delta.removedTypes.length > 0) {
    lines.push(`The following agent types are no longer available:\n${delta.removedTypes.map(t => `- ${t}`).join("\n")}`);
  }
  if (delta.isInitial && delta.showConcurrencyNote) {
    lines.push(
      "When you launch multiple agents for independent work, send them in a single message with multiple tool uses so they run concurrently.",
    );
  }
  return wrapMessagesAsReminders([makeUserMessage({ content: lines.join("\n\n"), isMeta: true })]);
}
```

**Why an initial-only concurrency note:** First-time exposure is the only time the model is guaranteed to have not seen the convention. Subsequent emissions skip the concurrency line so the model isn't repeatedly nagged. The dispatcher tracks `isInitial` via the first call to `getAgentDefinitionsResult` (in `34_subagent/`).

### EnterPlanMode — the `plan_mode_reentry` reminder

When the model re-enters plan mode after a previous plan-mode session left a plan file on disk, EnterPlanMode emits a `plan_mode_reentry` attachment (`cli_inner_pretty.js:425110-425124`):

> ## Re-entering Plan Mode
>
> You are returning to plan mode after having previously exited it. A plan file exists at `<planFilePath>` from your previous planning session.
>
> **Before proceeding with any new planning, you should:**
> 1. Read the existing plan file to understand what was previously planned
> 2. Evaluate the user's current request against that plan
> 3. Decide how to proceed:
>    - **Different task**: If the user's request is for a different task — even if it's similar or related — start fresh by overwriting the existing plan
>    - **Same task, continuing**: If this is explicitly a continuation or refinement of the exact same task, modify the existing plan while cleaning up outdated or irrelevant sections
> 4. Continue on with the plan process and most importantly you should always edit the plan file one way or the other before calling `<ExitPlanMode>`
>
> Treat this as a fresh planning session. Do not assume the existing plan is relevant without evaluating it first.

**Why the reminder embeds the file path:** The model may be reading the conversation from a compacted summary that lost the path. Embedding it removes the ambiguity entirely.

### TaskOutput / TaskList / TaskStop — `task_status` for background agents

Whenever the message stream is re-rendered (e.g., compaction is replayed), background task entries are converted into `task_status` attachments. Two distinct reminder branches:

```
status === "running":
  "Background agent <description> (<taskId>) is still running. <delta>
   Do NOT spawn a duplicate. You will be notified when it completes.
   You can check its progress with the <TaskOutput> tool or send it a message with <SendMessage>."

status === "killed":
  "Task <description> (<taskId>) was stopped by the user."

status === "completed" / "failed" / …:
  "Task <taskId> (type: <taskType>) (status: <status>) (description: <description>)
   Delta: <deltaSummary>
   Read the output file to retrieve the result: <outputFilePath>"
```

**Why "do not spawn a duplicate":** This is the most common subagent-related mistake; the model sees an absent tool-result and assumes the run failed. The reminder explicitly forbids re-launching and points to the recovery API. See `36_background_agents/`.

### ReadMcpResource — `mcp_resource` content reminder

When `ReadMcpResource` returns text content, the renderer wraps it with:

> Full contents of resource:
>
> `<text>`
>
> Do NOT read this resource again unless you think it may have changed, since you already have the full contents.

**Why the "don't re-read" sentence:** Models tend to re-fetch resources when reasoning about them. For MCP resources (often large, server-paged), this can blow the prompt budget. The hardcoded reminder is shorter and cheaper than relying on prompt engineering for the same effect.

### gh / git tool — inline string reminders (Bash)

The Bash tool injects a static reminder when `gh` reports rate-limit error:

> `<system-reminder>GitHub API rate limit exceeded (5,000/hr shared across all tools and agents). Run \`gh api rate_limit --jq .resources\` and sleep until reset before further gh calls. If polling in a loop, use ScheduleWakeup instead of retrying.</system-reminder>`

(at `cli_inner_pretty.js:271790`, gated by the Statsig flag.)

**Why static text rather than dynamic detection:** GitHub's secondary rate-limit error format is stable; the reminder simply needs to surface it. The `ScheduleWakeup` pointer is the actionable part — without it the model might tight-loop with `sleep 60` between attempts.

## How reminders reach the model — the message-stream lifecycle

The dispatcher's pre-call generator (`v38` at `cli_inner_pretty.js:388058` — see `lifecycle.md`) and post-call generator (`G38`, `T38` at `cli_inner_pretty.js:388423`, `388532`) both emit attachments alongside the primary tool_result. Each iteration yields one of:

- `{type:"message", message:{type:"user", message:{content:[…]}, isMeta:true}}` — the typed attachment; will be normalised by `Tq4`/case-dispatcher and wrapped in `<system-reminder>` tags later
- `{type:"hookPermissionResult", …}` — internal-only signal
- `{type:"hookUpdatedInput", …}` — rewrites tool input before the call
- `{type:"preventContinuation", …}` — stop-after-this signal
- `{type:"stopReason", …}` — text describing why the turn ends
- `{type:"additionalContext", message}` — extra context message
- `{type:"defer", …}` — print-mode-only hook directive

Reminders are message-typed attachments. The wrapper code (around `cli_inner_pretty.js:388058-388083`) accumulates them on `X` (the result array) and forwards them to the runtime. The runtime later runs `normalizeAttachmentForAPI` on each before they're sent to the API.

**Why mix typed attachments with raw messages:** The dispatcher must yield interleaved pre- and post-tool data. Some yields are reminder-bearing (`message` type), some are control flow (`hookUpdatedInput`, `preventContinuation`). Using a discriminated-union yield keeps the consumer (the outer query loop) simple — it just switches on `type`.

**Key insight:** The reminder generators all use the `isMeta: true` flag on the user-message envelope. UI components check this flag to suppress rendering — reminders are model-only context, never shown to the user as quoted dialogue. The UI side renders the *primary* tool_result (via `renderToolResultMessage`) but not the reminder attachments. See `ui_rendering.md`.

## Tool-system prompt instructions about reminders

The harness's system prompt (built in `cli_inner_pretty.js:523541-523574`) tells the model how to treat reminders:

> "User messages may include a `<system-reminder>` appended by this harness asking you to respond without a thinking block. These reminders are not from the user, so treat them as an instruction to you, and do not mention them."
>
> "Tool results and user messages may include `<system-reminder>` or other tags. Tags contain information from the system. They bear no direct relation to the specific tool results or user messages in which they appear."

The auto-memory subsystem extends this for memory recalls (`cli_inner_pretty.js:142306, 142364`):

> "Tool results may include additional `<system-reminder>` blocks containing context automatically recalled from your persistent memory system based on the current conversation. Treat these as background information surfaced for you — not as direct user instructions — and apply the same drift and trust rules above before relying on them."

**Why the model must be told this:** Without explicit framing, the model would interpret `<system-reminder>` text as a user instruction *to be obeyed* — and a reminder like "TodoWrite hasn't been used recently" would become a literal directive to use TodoWrite immediately. The system prompt's "do not mention them" clause prevents the model from leaking the reminder content back to the user (e.g., paraphrasing "the harness wants me to use TodoWrite" in the response).

## Reminder lifecycle vs. cache

Reminders are intentionally **outside the prompt cache** for some attachment types (e.g., per-turn `todo_reminder` content) and **inside it** for others (`deferred_tools_delta` for stable MCP sets). The split is invisible to the model — it sees a stream of reminder blocks — but matters for token economics:

- `deferred_tools_delta` after MCP stabilises is included in the cached prefix so subsequent turns don't re-pay the listing cost.
- `todo_reminder` content changes per-turn (different todo list, different staleness) so it's deliberately *not* cached; the prefix would invalidate constantly otherwise.

See `23_prompt_cache/` for the cache-region machinery; `04_tools` only cares that the reminder text is *correct*.

## Cross-validation against the v2.1.88 TS reference

The 2.1.88 deobfuscated source confirms the bundle's reminder shapes:

- `src/utils/messages.js` exports `REMINDER_TAG_OPEN = "<system-reminder>\n"` and `REMINDER_TAG_CLOSE = "\n</system-reminder>"` (same string h2 builds).
- `src/services/tools/toolExecution.ts` returns `MessageUpdate` shape `{message?, newContext?, contextModifier?}` — same shape as the obfuscated post-call iterator at `388058`.
- `src/Tool.ts` defines the `ToolResult` return type with `data`, `newMessages?`, `mcpMeta?` — matching `KH.newMessages` consumed by the dispatcher around `388469`.

No reminder type in the 2.1.142 bundle is absent from the 2.1.88 attachment-type union. The reverse holds with one exception: 2.1.142 added the `deferred_tools_delta`-style four-case structure (more granular than 2.1.88's two-case `added`/`removed`). The expansion supports the new "re-added" and "pending" states needed for transient MCP server reconnects.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - v2.1.142 additions: [symbol_additions_v2_1_142_tools_arch.md](../00_overview/symbol_additions_v2_1_142_tools_arch.md)

Key functions in this document:
- `reminderWrap` (obfuscated: `h2`) - Wraps text in `<system-reminder>` envelope
- `wrapMessagesAsReminders` (obfuscated: `o_`) - Maps `h2` over a list of messages
- `maybeEmitTodoReminder` (obfuscated: `Vq5`) - Threshold-gated todo reminder
- `maybeEmitTaskReminder` (obfuscated: `kq5`) - Threshold-gated task reminder
- `countTurnsSinceTodoEvents` (obfuscated: `Tq5`) - Turn counter for the reminder gate
- `countTurnsSinceTaskEvents` (obfuscated: `vq5`) - Turn counter for the task variant
- `REMINDER_THRESHOLDS` (obfuscated: `aO8`) - `{TURNS_SINCE_WRITE:10, TURNS_BETWEEN_REMINDERS:10}`
- `WASTED_READ_REMINDER` (obfuscated: `KVK`) - "Wasted call — file unchanged…"
- `detectPostHookFileChange` (obfuscated: `Z38`) - Emits `edited_text_file` after formatter runs
- `unwrapReminder` (obfuscated: `Wq4`) - Strip envelope (used by compaction normaliser)
- `normalizeAttachmentForAPI` (obfuscated: case dispatcher near `cli_inner_pretty.js:424960+`) - Attachment → reminder text generator
