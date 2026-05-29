# Runtime Lifecycle — From Emit to Model

> How a reminder travels from the place it's generated to the API request body, and what each transformation along the way guarantees.

## Pipeline stages

```
                  ┌──────────────────────────────────────────────┐
                  │   Stage 0: An attachment is queued            │
                  │   • A tool's call returned newMessages        │
                  │   • Or collectAttachments produced one        │
                  │   • Or a hook fired and synthesised one        │
                  │   Result: { type:"attachment", attachment:{   │
                  │             type: "<…>", … } }                │
                  └──────────────┬───────────────────────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────────────────────┐
                  │   Stage 1: normalizeAttachmentForAPI          │
                  │     (CI6 + Tq4 case dispatch)                │
                  │     cli_inner_pretty.js:424960-425316         │
                  │   switch(attachment.type) {                   │
                  │     case "todo_reminder": return o_([w8(…)])  │
                  │     case "edited_text_file": return o_(…)    │
                  │     …                                         │
                  │   }                                           │
                  │   Each case calls o_() to wrap in <sr>; the   │
                  │   result is List<UserMessage> with isMeta=true │
                  └──────────────┬───────────────────────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────────────────────┐
                  │   Stage 2: queryHelpers merge pass            │
                  │     processMessageForAPI / mergeMessages…     │
                  │   • mergeUserMessagesAndToolResults joins     │
                  │     the new attachment into the existing      │
                  │     turn's user message if the previous       │
                  │     message is also a user.                   │
                  │   • mergeAdjacentUserMessages → joinTextAtSeam│
                  │     adds "\n" between text blocks at the seam.│
                  │   • If gate `tengu_chair_sermon` is ON:       │
                  │     - ensureSystemReminderWrap (Az5) re-wraps │
                  │       any text block that lost its envelope.  │
                  │     - smooshSystemReminderSiblings (mq4) folds│
                  │       SR-prefixed siblings into the LAST      │
                  │       tool_result of the same user message.   │
                  └──────────────┬───────────────────────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────────────────────┐
                  │   Stage 3: Send to API                        │
                  │     queryClaudeMessages (chunks at L525xxx)   │
                  │   Text inside <system-reminder>…</…> reaches  │
                  │   the model verbatim. The model is taught by   │
                  │   the system prompt to treat these as          │
                  │   harness-injected context.                    │
                  └──────────────┬───────────────────────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────────────────────┐
                  │   Stage 4: Side surfaces                       │
                  │   • UI render: isMeta filters reminder        │
                  │     messages from the transcript view.        │
                  │   • Transcript search/copy: stripAllReminders  │
                  │   • Sticky-prompt UI: stripLeadingReminders    │
                  │   • Telemetry: extractSystemReminderContent    │
                  │     separates SR into a separate span attr.    │
                  │   • /resume + persistence: SR text persists in │
                  │     transcript.jsonl as-is; re-loaded SRs are  │
                  │     re-rendered through normalizeAttachment…   │
                  └──────────────────────────────────────────────┘
```

## Stage 1 — `normalizeAttachmentForAPI` deep dive

This is the **central case-dispatch table** that turns a typed attachment into reminder-wrapped user messages.

```javascript
// ============================================
// normalizeAttachmentForAPI - main entry point
// Location: cli_inner_pretty.js:424960-425332
// ============================================

// ORIGINAL (for source lookup):
function CI6(H) {
  if (eK()) {
    if (H.type === "teammate_mailbox") return [w8({ content: aA5().formatTeammateMessages(H.messages), isMeta: !0 })];
    if (H.type === "team_context") return [ w8({ content: `<system-reminder>…</system-reminder>`, isMeta: !0 }) ];
  }
  if (H.type in Tq4) return Tq4[H.type](H);    // file / image / notebook / pdf paths
  switch (H.type) {
    case "file": …
    case "invoked_skills": …
    case "todo_reminder": …
    case "task_reminder": …
    case "relevant_memories": …
    case "queued_command": …
    case "diagnostics": …
    case "plan_mode": …
    case "plan_mode_reentry": …
    case "auto_mode": …
    case "mcp_resource": …
    case "task_status": …
    case "async_hook_response": …
    case "hook_success": …
    case "context_efficiency": …
    case "deferred_tools_delta": …
    case "agent_listing_delta": …
    case "mcp_instructions_delta": …
    case "memory_update": …
    case "verify_plan_reminder": …
  }
  if ([
    "autocheckpointing","background_task_status","todo","task_progress",
    "ultramemory","compaction_reminder","current_session_memory",
    "companion_intro","pen_mode_enter","pen_mode_exit"
  ].includes(H.type)) return [];               // intentionally-suppressed legacy types
  return (vx("normalizeAttachmentForAPI", Error(`Unknown attachment type: ${H.type}`)), []);
}

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
  // Two pre-switch branches that exist only when the agent-team feature is enabled:
  if (isAgentTeamFeatureEnabled()) {
    if (attachment.type === "teammate_mailbox") {
      return [makeUserMessage({ content: getTeammateMailbox().formatTeammateMessages(attachment.messages), isMeta: true })];
    }
    if (attachment.type === "team_context") {
      return [makeUserMessage({ content: `<system-reminder>\n# Team Coordination\n…\n</system-reminder>`, isMeta: true })];
    }
  }

  // Tool-specific file/image/notebook/pdf renderers live in the Tq4 lookup
  // map — separate from the switch so each per-tool result has its own
  // renderer function (created at the tool's registration site).
  if (attachment.type in PER_TOOL_RENDERERS) return PER_TOOL_RENDERERS[attachment.type](attachment);

  switch (attachment.type) {
    case "file": …                       // synthetic file Read (image/notebook/PDF or directory)
    case "invoked_skills": …             // skills invoked pre-compact (replay marker)
    case "todo_reminder": …              // TodoWrite nudge
    case "task_reminder": …              // TaskCreate/TaskUpdate nudge
    case "relevant_memories": …          // auto-memory recall
    case "queued_command": …             // user typed during tool run
    case "diagnostics": …                // LSP findings
    case "plan_mode": …                  // plan-mode banner (full or sparse)
    case "plan_mode_reentry": …          // returning to plan mode after exit
    case "auto_mode": …                  // auto-mode banner (full / sparse / once)
    case "mcp_resource": …               // ReadMcpResource output
    case "task_status": …                // background-agent state
    case "async_hook_response": …        // asyncRewake output
    case "hook_success": …               // UserPromptSubmit/SessionStart hook output
    case "context_efficiency": return []; // empty — handled elsewhere
    case "deferred_tools_delta": …       // MCP toolset changed
    case "agent_listing_delta": …        // Agent tool's available types changed
    case "mcp_instructions_delta": …     // MCP server instructions changed
    case "memory_update": …              // memory directory changed
    case "verify_plan_reminder": …       // post-plan verify nudge
  }

  // Intentionally-empty list — these types exist in the type union for
  // forward/backward compat but no longer emit. Leaving them in the union
  // means a transcript persisted with one of these still loads cleanly.
  const LEGACY_NOOP_TYPES = ["autocheckpointing","background_task_status","todo","task_progress",
    "ultramemory","compaction_reminder","current_session_memory",
    "companion_intro","pen_mode_enter","pen_mode_exit"];
  if (LEGACY_NOOP_TYPES.includes(attachment.type)) return [];

  // Unknown type — log via the structured-error helper, but DO NOT throw.
  // A malformed attachment must not block the next message from being sent.
  reportError("normalizeAttachmentForAPI", new Error(`Unknown attachment type: ${attachment.type}`));
  return [];
}

// Mapping: CI6→normalizeAttachmentForAPI, H→attachment, eK→isAgentTeamFeatureEnabled,
//          aA5→getTeammateMailbox, Tq4→PER_TOOL_RENDERERS, vx→reportError
```

### Why a switch instead of a registry

A registry-of-renderers would make new attachment types easier to add but harder to reason about: each new type would need to register itself somewhere. The switch keeps every attachment type's text **side-by-side in one source location**, so a reviewer can audit "does adding a `<task-list>` attachment break compaction?" by reading 400 lines. A registry would scatter the answer across 30+ files.

The exception is **per-tool result renderers** (`Tq4` / `PER_TOOL_RENDERERS`) — these *are* registered, because each tool's `mapToolResultToToolResultBlockParam` lives at the tool's definition site. The split is intentional: tool-result rendering needs the tool's full context (input + state), while attachment rendering just needs the typed payload.

### The "legacy noop" list

```javascript
const LEGACY_NOOP_TYPES = [
  "autocheckpointing","background_task_status","todo","task_progress",
  "ultramemory","compaction_reminder","current_session_memory",
  "companion_intro","pen_mode_enter","pen_mode_exit"
];
```

These types exist for **transcript-load compatibility**. Earlier versions of Claude Code wrote them to disk; loading an old transcript would otherwise hit the "Unknown attachment type" error path on every replay. The empty-array return makes them invisible to the model and to the UI but doesn't pollute the typed attachment union with code paths that build text.

## Stage 2 — Message-stream merge passes

After `normalizeAttachmentForAPI` produces a list of user messages, the request preparation runs three subsequent passes:

### Pass A — `mergeUserMessagesAndToolResults`

Used when the previous message in the result array is *also* a user message. Two user messages can't be adjacent in the API payload (the model wouldn't know where one ends and the next begins for the purposes of "what was the user's last turn"), so we merge.

The merge concatenates the content arrays and applies `joinTextAtSeam`:

```javascript
// ============================================
// joinTextAtSeam — fuse text-text seams with a newline
// Location: src/utils/messages.ts:2505-2515 (TS reference; same logic at cli_inner_pretty.js:Iv*)
// ============================================

function joinTextAtSeam(a, b) {
  // The API concatenates adjacent text blocks in a user message WITHOUT
  // a separator. Two queued prompts "2 + 2" + "3 + 3" would otherwise
  // reach the model as "2 + 23 + 3". Insert a newline at the end of a's
  // last text block so the boundary is preserved.
  //
  // The "\n" goes on a's side (not b's prepended) because
  // smooshSystemReminderSiblings classifies by startsWith("<system-reminder>"):
  // prepending a newline to b would break that test when b is an SR-wrapped
  // attachment.
  const lastA = a.at(-1);
  const firstB = b[0];
  if (lastA?.type === "text" && firstB?.type === "text") {
    return [...a.slice(0, -1), { ...lastA, text: lastA.text + "\n" }, ...b];
  }
  return [...a, ...b];
}
```

This block is the **critical invariant** for the smoosh pass to work. The smoosh detects reminder blocks by `text.startsWith("<system-reminder>")`. If the merge had prepended `"\n<system-reminder>…"` to b's first block, the test would fail and the smoosh would leak a reminder as a non-meta sibling.

### Pass B — `ensureSystemReminderWrap` (gated by `tengu_chair_sermon`)

```javascript
// ============================================
// ensureSystemReminderWrap (Az5) — idempotent re-wrap
// Location: cli_inner_pretty.js:423911-423923
// ============================================

// ORIGINAL (for source lookup):
function Az5(H) {
  let $ = H.message.content;
  if (typeof $ === "string") {
    if ($.startsWith("<system-reminder>")) return H;
    return { ...H, message: { ...H.message, content: h2($) } };
  }
  let q = !1,
    K = $.map((_) => {
      if (_.type === "text" && !_.text.startsWith("<system-reminder>")) return ((q = !0), { ..._, text: h2(_.text) });
      return _;
    });
  return q ? { ...H, message: { ...H.message, content: K } } : H;
}

// READABLE (for understanding):
function ensureSystemReminderWrap(userMessage) {
  const content = userMessage.message.content;
  // String content fast path
  if (typeof content === "string") {
    if (content.startsWith("<system-reminder>")) return userMessage;       // already wrapped
    return { ...userMessage, message: { ...userMessage.message, content: reminderWrap(content) } };
  }
  // Array content — wrap each text block individually
  let mutated = false;
  const newContent = content.map((block) => {
    if (block.type === "text" && !block.text.startsWith("<system-reminder>")) {
      mutated = true;
      return { ...block, text: reminderWrap(block.text) };
    }
    return block;
  });
  // Return identity if nothing changed — preserves object equality for cache-key purposes
  return mutated ? { ...userMessage, message: { ...userMessage.message, content: newContent } } : userMessage;
}

// Mapping: Az5→ensureSystemReminderWrap, H→userMessage, $→content, h2→reminderWrap, q→mutated, K→newContent
```

**Why the identity return matters:** The merged message list feeds the API request. The API request's content-hash is part of the prompt cache key. If `ensureSystemReminderWrap` always returned a fresh object even when nothing changed, the cache lookup would miss. The two-pass `mutated` boolean keeps the original object intact when the wrap is a no-op.

**Why it only fires when `tengu_chair_sermon` is on:** The wrap was added in v2.1.142 to fix an edge case where attachment generators that *forgot* to wrap (or generators added late and not retrofitted) leaked their text as plain user input. Statsig gates let the fix roll out gradually — a misbehaving attachment-generator could otherwise leak production user-context if the wrap were applied unconditionally to legacy transcripts.

### Pass C — `smooshSystemReminderSiblings` (also gated by `tengu_chair_sermon`)

This pass folds reminder-text blocks that ended up adjacent to a tool_result into the tool_result's content. The API treats tool_results as opaque blobs — the model is taught to read them as harness-injected context just like reminders are — so folding a reminder into a tool_result doesn't change semantics.

```javascript
// ============================================
// smooshSystemReminderSiblings (mq4) — fold SR-prefixed text into the LAST tool_result
// Location: cli_inner_pretty.js:423924-423943
// ============================================

// ORIGINAL (for source lookup):
function mq4(H) {
  return H.map(($) => {
    if ($.type !== "user") return $;
    let q = $.message.content;
    if (!Array.isArray(q)) return $;
    if (!q.some((M) => M.type === "tool_result")) return $;
    let _ = [], A = [];
    for (let M of q)
      if (M.type === "text" && M.text.startsWith("<system-reminder>")) _.push(M);
      else A.push(M);
    if (_.length === 0) return $;
    let z = A.findLastIndex((M) => M.type === "tool_result"),
      Y = A[z],
      f = WR6(Y, _);
    if (f === null) return $;
    let O = [...A.slice(0, z), f, ...A.slice(z + 1)];
    return { ...$, message: { ...$.message, content: O } };
  });
}

// READABLE (for understanding):
function smooshSystemReminderSiblings(messages) {
  return messages.map((msg) => {
    if (msg.type !== "user") return msg;
    const content = msg.message.content;
    if (!Array.isArray(content)) return msg;
    // Only act on messages that contain a tool_result
    if (!content.some((b) => b.type === "tool_result")) return msg;

    // Partition: SR-prefixed text blocks → reminderBlocks, others → keep
    const reminderBlocks = [], kept = [];
    for (const block of content) {
      if (block.type === "text" && block.text.startsWith("<system-reminder>")) {
        reminderBlocks.push(block);
      } else {
        kept.push(block);
      }
    }
    if (reminderBlocks.length === 0) return msg;

    // Find the LAST tool_result — positionally adjacent in the rendered prompt
    const lastTrIdx = kept.findLastIndex((b) => b.type === "tool_result");
    const lastTr = kept[lastTrIdx];
    const folded = smooshIntoToolResult(lastTr, reminderBlocks);
    if (folded === null) return msg;     // tool_reference constraint — leave alone

    const newContent = [...kept.slice(0, lastTrIdx), folded, ...kept.slice(lastTrIdx + 1)];
    return { ...msg, message: { ...msg.message, content: newContent } };
  });
}

// Mapping: mq4→smooshSystemReminderSiblings, H→messages, $→msg, q→content,
//          _→reminderBlocks, A→kept, M→block, z→lastTrIdx, Y→lastTr, WR6→smooshIntoToolResult, f→folded, O→newContent
```

**The "fold into LAST tool_result" rule:** A user message can carry multiple tool_results (when the model issued multiple parallel tool calls in one assistant turn, all results return together in the next user turn). The reminder must fold into the *last* one because it was generated *after* all of them returned — so it's most relevant to the final-position tool_result.

**The `null` return case:** `smooshIntoToolResult` returns `null` if the target tool_result's content includes a `tool_reference` block (a beta feature). The API rejects mixing `tool_reference` with other types — fold would 400 the request. The fallback is to leave the reminder as a sibling and accept the "two human turns" artifact.

**Why fold at all:** Without the fold, the model sees a structure like:

```
[user]
  [tool_result(id=...) content="Result text"]
  [text "<system-reminder>...</system-reminder>"]
[assistant]
```

Some Anthropic API endpoints emit a "Human:" boundary marker before the SR-text block, which trains the model to expect that markers signal **a new turn from the user**. After enough repetitions, the model starts emitting a stop sequence after every tool result — the model has learned the pattern of "tool_result followed by a Human turn => my turn ended."

By folding into the tool_result, there's no boundary marker at all — the reminder just looks like extra content the tool returned. See the source comment in `messages.ts:2295-2305`:

> "Relocate text siblings off tool_reference messages — prevents the anomalous two-consecutive-human-turns pattern that teaches the model to emit the stop sequence after tool results. See #21049."

## Mid-conversation `role:"system"` fallback

Some Anthropic API beta tiers accept `role:"system"` in the messages array (not just in the top-level `system` field). Claude Code optionally uses this for *some* reminders. When the server rejects it, the harness falls back to wrapping the same content in a `<system-reminder>` body and retrying.

```javascript
// ============================================
// mid-conv-system fallback — when server rejects role:"system"
// Location: cli_inner_pretty.js:525537-525548
// ============================================

if (x && NQK(A6)) {
  if (((M = M.filter((x8) => x8 !== wE)), (S = x), (x = null), wE)) Lv$(B, wE);
  return (
    (lH = null),
    N('[mid-conv-system] server rejected role:"system" — falling back to <system-reminder> body, sticky-rejecting beta until /clear or /compact',
      { level: "warn" }),
    d("tengu_mid_conv_system_fallback_retry", {}),
    "retry:mid-conv-system"
  );
}
```

**Sticky reject:** Once the server has rejected the beta, the harness marks it as rejected for the rest of the session (until `/clear` or `/compact` resets state). Otherwise, every reminder would re-try the beta, get rejected, fall back — wasting one round-trip per reminder.

**Why retry rather than skip:** The reminder text *must* reach the model. Skipping would silently drop important context (e.g., a memory recall, a plan-mode banner). The fallback path lets the message go through with the model-visible wrapping instead.

## Compaction interaction

When the conversation is compacted (`/compact` or auto-triggered at 80% context):

1. **Pre-compact** — the compaction summariser reads the transcript including all prior reminders. Most reminders are intentionally stripped before summarisation (via the `unwrapReminder`/`stripAllReminders` paths) so the summary captures *what happened* without the noise of "harness reminded TodoWrite was unused" messages.
2. **Compact boundary** — emitted as a special `system` message with `subtype:"compact_boundary"` (factory `jM$` at `cli_inner_pretty.js:425507-425519`). Reminders that fire *after* a boundary are re-emitted with their full text (not sparse), because the summary may have evicted the prior context that established them.
3. **Post-compact replay** — certain attachment types replay: `invoked_skills` (telling the model which skills ran pre-compact), `compact_file_reference` (Read happened pre-compact, content evicted), `relevant_memories` (auto-memory re-run on the summary). All of these are reminders too.

See `07_compact/` for the broader compaction analysis.

## Statsig gates that affect this pipeline

| Gate | Effect when ON |
|------|----------------|
| `tengu_chair_sermon` | Enables `ensureSystemReminderWrap` + `smooshSystemReminderSiblings` |
| `tengu_toolref_defer_j8m` | Enables `relocateToolReferenceSiblings` (a sibling of smoosh that handles tool_reference blocks) |
| `tengu_auto_notice_once` | Auto mode emits a `once` reminder instead of full/sparse |
| `tengu_mid_conv_system_fallback_retry` | (telemetry only) marks how often the beta-reject retry path fires |
| `tengu_attachment_compute_duration` | (telemetry only) samples per-generator timing in `aY()` |

## Putting it together — a concrete trace

Suppose the model just wrote a `TodoWrite` call. The next request preparation pipeline runs:

1. **`collectAttachments`** runs all 30 generators. `Vq5` (`maybeEmitTodoReminder`) sees that TodoWrite was just used last turn — emits no `todo_reminder`. `Eq5` (`maybeEmitMemoryUpdateReminders`) sees `pendingMemoryUpdates` is non-empty from the user invoking `/remember` two turns ago — emits one `memory_update` attachment.
2. **`normalizeAttachmentForAPI`** routes the `memory_update` attachment to its case (line 425292-425311). The case builds a multi-line text block and calls `o_([w8({content, isMeta:true})])`, returning a single wrapped user message.
3. **Merge pass A** sees the existing turn already has a user message (the prior tool_result for TodoWrite). It calls `mergeUserMessagesAndToolResults` to concat the content arrays. The SR-wrapped text becomes a sibling of the `tool_result` block.
4. **Pass B** (`ensureSystemReminderWrap`) walks the content blocks. The text block already starts with `<system-reminder>` — identity return.
5. **Pass C** (`smooshSystemReminderSiblings`) detects the SR-wrapped sibling of a tool_result. It folds the SR text into the tool_result's content array.
6. **Send to API** — the user message now contains one `tool_result` block whose content includes the SR text. The model sees `<system-reminder>… memory directory updated …</system-reminder>` inside the tool result.
7. **UI render** — the user message has `isMeta:true`. The Ink renderer filters it out. The user sees only the model's prior `TodoWrite` and the model's next response.
8. **Telemetry** — `betaSessionTracing.ts` extracts the SR content into the `system_reminders` span attribute (separated from the `new_context` attribute). Observability dashboards see "1 reminder fired" without polluting the prompt-content metric.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - v2.1.142 additions: [symbol_additions_v2_1_142_system_reminder.md](../00_overview/symbol_additions_v2_1_142_system_reminder.md)

Key functions in this document:
- `normalizeAttachmentForAPI` (obfuscated: `CI6`) - The main case dispatch table
- `PER_TOOL_RENDERERS` (obfuscated: `Tq4`) - Per-tool result renderer lookup table
- `joinTextAtSeam` - Adds `\n` between text-text adjacencies during merge
- `mergeUserMessagesAndToolResults` - Concatenates content arrays when adjacent user messages exist
- `ensureSystemReminderWrap` (obfuscated: `Az5`) - Idempotent re-wrap
- `smooshSystemReminderSiblings` (obfuscated: `mq4`) - Fold SR siblings into last tool_result
- `smooshIntoToolResult` (obfuscated: `WR6`) - Per-block folder; returns null on tool_reference constraint
- `relocateToolReferenceSiblings` - Sibling pass for the tool_reference beta
- `reminderWrap` (obfuscated: `h2`) - String → `<sr>…</sr>`
- `wrapMessagesAsReminders` (obfuscated: `o_`) - List wrap helper
