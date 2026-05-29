# 41 — `<system-reminder>` Subsystem (v2.1.142)

> **Module**: `41_system_reminder/` — Cross-cutting analysis of Claude Code's `<system-reminder>` mechanism: how harness-side instructions reach the model in-band without being mistaken for user input.
> **Bundle**: `cli_inner_pretty.js` (2.1.142 extract, 611,353 lines).
> **TypeScript reference**: `/lyz/codespace/3rd/claude-code/src/utils/messages.ts`, `src/utils/attachments.ts`, `src/utils/transcriptSearch.ts`, `src/components/VirtualMessageList.tsx` (2.1.88 baseline — same shape, fewer reminder types).
> **Adjacent module**: `04_tools/reminder_interaction.md` covers reminders that ride alongside *tool* calls. This module documents the **mechanism** itself across all surfaces (tools, modes, hooks, memory, compaction, IDE, side-questions, container restarts, etc.).

## What this module covers

A `<system-reminder>…</system-reminder>` block is the canonical way Claude Code injects mid-conversation guidance into a user-turn payload without confusing the model into treating it as a user instruction. Reminders are **everywhere** in v2.1.142: 49 distinct source-level occurrences, 30+ attachment generator functions, three separate wrap helpers, two strip helpers, dedicated cache/telemetry handling, and a fallback retry path when the API rejects mid-conversation `role:"system"` messages.

This module decomposes that surface into:

| File | Topic |
|------|-------|
| `README.md` (this file) | Architecture overview, design rationale, where reminders fit in the request pipeline |
| `runtime_lifecycle.md` | The full lifecycle: attachment generation → wrap → smoosh → API → strip — with the multi-pass normalization pipeline |
| `attachment_catalogue.md` | Every reminder type (30+ attachment cases + 10+ inline emit sites) with the rendered text, trigger condition, and emit location |
| `ui_handling.md` | UI suppression: `isMeta`, `isVisibleInTranscriptOnly`, transcript-search strip, sticky-prompt strip, copy-text strip |
| `telemetry_and_cache.md` | Telemetry separation (`system_reminders` span attribute), cache-prefix implications, mid-conv-system fallback |
| `cross_validation.md` | Side-by-side mapping of obfuscated names to the v2.1.88 TypeScript source |

## The core problem

Without reminders, the harness has only two ways to talk to the model mid-conversation:

1. **Edit the system prompt** — but mutating the prompt invalidates the cached prefix on every turn, costing tokens and latency. Also forbidden by the API for some shapes (`role:"system"` in messages is rejected on some endpoints).
2. **Speak as the user** — but then the model can't tell harness directives ("you've used 80% of your context") from user instructions ("ignore the budget").

A reminder solves both: it's text **inside** a user-role message body (so the cached prefix stays valid) but wrapped in `<system-reminder>…</system-reminder>` tags **the model is taught to recognize** as out-of-band. The system prompt explicitly establishes the convention:

> "Tool results and user messages may include `<system-reminder>` or other tags. Tags contain information from the system. They bear no direct relation to the specific tool results or user messages in which they appear." — system prompt at `cli_inner_pretty.js:523574`

## Architecture diagram

```
                ┌──────────────────────────────────────────────────────┐
                │           Per-turn attachment generator              │
                │     collectAttachments (p65) at L397549              │
                │  Runs ~30 aY() generators in parallel — each emits   │
                │  zero or more typed attachment objects.              │
                └────────────┬─────────────────────────────────────────┘
                             │
                             ▼
                ┌──────────────────────────────────────────────────────┐
                │            Attachment normaliser (CI6/Tq4)            │
                │           cli_inner_pretty.js:424960-425316           │
                │   switch (type) → render to UserMessage(isMeta=true) │
                │   (most cases end with o_([w8({…, isMeta:true})]) )  │
                └────────────┬─────────────────────────────────────────┘
                             │
                             ▼
                ┌──────────────────────────────────────────────────────┐
                │     Reminder envelope wrapper (o_ at 424748)         │
                │   maps over messages, wraps text/string in           │
                │     <system-reminder>\n…\n</system-reminder>          │
                │   (skips image/document/tool_use parts untouched)    │
                └────────────┬─────────────────────────────────────────┘
                             │
                             ▼
                ┌──────────────────────────────────────────────────────┐
                │   Message-stream normaliser (queryHelpers)            │
                │   • ensureSystemReminderWrap (Az5) — idempotent      │
                │     re-wrap of any text block in an attachment-      │
                │     origin user message                              │
                │   • smooshSystemReminderSiblings (mq4) — folds       │
                │     adjacent reminder-text blocks into the last      │
                │     tool_result, gated by tengu_chair_sermon        │
                └────────────┬─────────────────────────────────────────┘
                             │
                             ▼
                ┌──────────────────────────────────────────────────────┐
                │   ┌─────────────────┐         ┌─────────────────┐    │
                │   │  API request    │         │   UI renderer   │    │
                │   │  (Anthropic)    │         │     (Ink)       │    │
                │   │  raw text incl. │         │  isMeta=true →  │    │
                │   │  <system-       │         │  not shown      │    │
                │   │   reminder>     │         │  Transcript     │    │
                │   │  tags reach     │         │  search +copy   │    │
                │   │  the model      │         │  use            │    │
                │   │                 │         │  stripSystem    │    │
                │   │                 │         │  Reminders to   │    │
                │   │                 │         │  hide tags from │    │
                │   │                 │         │  user           │    │
                │   └─────────────────┘         └─────────────────┘    │
                └──────────────────────────────────────────────────────┘
```

### Key insight — three audiences, one payload

The same `UserMessage` with `<system-reminder>` content reaches:
1. **The model** (full text, treated as ambient harness instruction)
2. **The UI** (suppressed entirely via `isMeta` flag; only the *primary* tool_result / user prompt is rendered)
3. **The telemetry pipeline** (extracted into a separate `system_reminders` span attribute so observability dashboards can drop reminders from "what the user typed" counts)

A single text payload feeds all three because the wrap is *idempotent* — `ensureSystemReminderWrap` (`Az5`) skips already-wrapped text, `extractSystemReminderContent` (`nD6`) safely unwraps any text wholly enclosed in tags, and `stripSystemReminders` (`Nq4` + `stripSystemReminders` in TS) removes leading tags or any internal `<system-reminder>…</system-reminder>` slice. There is no separate "reminder track" or "system message channel" — reminders are just specially-tagged user-role text.

## The two reminder-emitting primitives

```
                    ┌─────────────────────────────────────┐
                    │  reminderWrap (h2)  — string wrap   │
                    │  cli_inner_pretty.js:424714-424718   │
                    └─────────────────────────────────────┘
                                  │
                                  │ used by …
                                  ▼
                    ┌─────────────────────────────────────┐
                    │  wrapMessagesAsReminders (o_)       │
                    │  — list[UserMessage] → list[Wrapped] │
                    │  cli_inner_pretty.js:424748-424761   │
                    └─────────────────────────────────────┘
                                  │
                                  │ called by every attachment-type
                                  │ case in normalizeAttachmentForAPI
                                  ▼
                    ┌─────────────────────────────────────┐
                    │  ensureSystemReminderWrap (Az5)     │
                    │  — idempotent re-wrap; runs in the  │
                    │     final API-prep pass             │
                    │  cli_inner_pretty.js:423911-423923   │
                    └─────────────────────────────────────┘
```

**Why three layers (not one):** Each layer guards a different invariant.

- `reminderWrap` is the literal string concat — used by the few emitters that directly bake reminders into a constant (e.g., `<system-reminder>Warning: the file exists but the contents are empty.</system-reminder>` for the Read tool's empty-file path at `cli_inner_pretty.js:407427`).
- `wrapMessagesAsReminders` is the per-attachment helper — each `case` in `normalizeAttachmentForAPI` returns the output of `o_([w8({content, isMeta:true})])`, which guarantees a well-formed reminder envelope at attachment-generation time.
- `ensureSystemReminderWrap` is the final-pass safety net — added in v2.1.142 behind `tengu_chair_sermon`. It re-walks every attachment-origin user message during `mergeMessagesByQuery` and re-wraps any text block whose first ≈17 chars don't already match `<system-reminder>`. This protects against attachment cases that *forgot* to wrap (e.g., an `addedTypes` path that synthesised a raw string), plus paths that mutate already-wrapped content post-attachment (the merge step in `mergeUserMessagesAndToolResults` concatenates blocks and could otherwise strand a non-wrapped sibling next to a wrapped one).

## Two reminder-stripping primitives (and where each fires)

```javascript
// ============================================
// stripLeadingReminders (Nq4) — strip reminders only from the start
// Location: cli_inner_pretty.js:423281-423289
// ============================================

// ORIGINAL (for source lookup):
function Nq4(H) {
  let q = H.trimStart();
  while (q.startsWith("<system-reminder>")) {
    let K = q.indexOf("</system-reminder>");
    if (K < 0) break;
    q = q.slice(K + 18).trimStart();
  }
  return q;
}

// READABLE (for understanding):
function stripLeadingReminders(text) {
  // Repeatedly peel off any leading <system-reminder>…</system-reminder>
  // blocks (including the optional leading/trailing whitespace) until what
  // remains starts with something else. Used by the UI sticky-prompt computer
  // — leading reminders are harness context, not "what the user typed".
  let s = text.trimStart();
  while (s.startsWith("<system-reminder>")) {
    const end = s.indexOf("</system-reminder>");
    if (end < 0) break;                       // unterminated — leave as-is
    s = s.slice(end + "</system-reminder>".length).trimStart();
  }
  return s;
}

// Mapping: Nq4→stripLeadingReminders, H→text, q→s, K→end
```

```javascript
// ============================================
// stripAllReminders (vQ4) — strip ANY reminder/task-notification slice
// Location: cli_inner_pretty.js:566114-566116
// ============================================

// ORIGINAL (for source lookup):
function vQ4(H) {
  return H.replace(/<(system-reminder|task-notification)>[\s\S]*?(<\/\1>|$)/g, " ");
}

// READABLE (for understanding):
function stripAllReminders(text) {
  // Replaces every <system-reminder>…</system-reminder> or
  // <task-notification>…</task-notification> block with a single space.
  // Trailing whitespace is allowed at the close so an unterminated tag at
  // the end-of-string is still nuked. Used by transcript search and the
  // "preview" string rendered into permission dialogs / activity logs —
  // both want a clean snippet without harness chrome.
  return text.replace(/<(system-reminder|task-notification)>[\s\S]*?(<\/\1>|$)/g, " ");
}

// Mapping: vQ4→stripAllReminders, H→text
```

**Why two strip helpers (not one):**

- `stripLeadingReminders` is for the *sticky prompt* — the UI walks the rendered message list to find the user's last real prompt; leading reminders (auto-memory recalls, mode reentries) get peeled but mid-prompt occurrences would never appear in a real prompt, so the cheap "starts with" check is enough.
- `stripAllReminders` is for the *preview* — transcript search, activity logs, the `/remote-control` `latestAsk` summary, classifier inputs. Reminders can appear anywhere in mid-conversation text (especially on `cc -c` resumes where memory-update reminders are dense), so a regex-replace is needed.

The TS reference uses the same two-strip split: `stripSystemReminders` (TS line 399, `src/components/messageActions.tsx`) is the leading-only variant; `vQ4`'s equivalent lives in `src/utils/transcriptSearch.ts:117-127` and is inlined as a `while (open >= 0)` loop.

## The `isMeta` flag — UI suppression mechanism

Every reminder-bearing user message carries `isMeta: true` on the envelope (see `w8` factory at `cli_inner_pretty.js:423394-423429`). The flag is consumed at five locations:

1. **`Messages.tsx` render filter** (`/lyz/codespace/3rd/claude-code/src/components/Messages.tsx:144`) — `return !msg.isMeta` excludes meta messages from the rendered transcript entirely.
2. **`VirtualMessageList` sticky-prompt computer** (`src/components/VirtualMessageList.tsx:148`) — `if (msg.isMeta || msg.isVisibleInTranscriptOnly) return null;` skips meta messages when computing the most recent real user prompt for the breadcrumb.
3. **`MessageSelector`** (`src/components/MessageSelector.tsx:777, 810`) — `if (msg.isMeta) continue;` keeps the message-selector overlay from offering reminders as jump targets.
4. **`ContextVisualization`** — meta messages contribute to the rolled-up context-window view but are rendered as `<collapsed>` placeholders, not full text.
5. **`PromptInputQueuedCommands`** (`src/components/PromptInput/PromptInputQueuedCommands.tsx:86`) — task-notification mode and `isMeta:true` commands are excluded from the "queued commands" UI panel.

The flag is *not* persisted to the API request — the wire format is just the text inside the user-role message; the model never sees the `isMeta` boolean.

**Why a flag rather than a separate channel:** A flag preserves the **identity of the message** through merges, splits, and resumes. If reminders were a separate transcript track, the merge that combines a queued user command + pending attachments into a single message would have to either lose the meta status (showing reminders to the user) or duplicate the message (breaking ordering). The flag rides along with every transform.

## Where reminders come from — the attachment generator

`collectAttachments` (`p65` at `cli_inner_pretty.js:397549-397619`) is the centralised entry point that runs every reminder generator in parallel before each request:

```
collectAttachments(transcript, ctx, userMessage, currentTurnMessages, querySource, planSeed)
   ├─ at_mentioned_files                  (@-mention extraction from current turn)
   ├─ mcp_resources                       (MCP resource references)
   ├─ agent_mentions                      (@<agent-type> triggers)
   ├─ queued_commands                     (typed mid-tool-call)
   ├─ date_change                         (date_change reminder when day rolls)
   ├─ ultrathink_effort                   (think-mode escalation)
   ├─ deferred_tools_delta                (MCP toolset changes)
   ├─ agent_listing_delta                 (Agent tool's available types)
   ├─ mcp_instructions_delta              (server-provided instructions)
   ├─ changed_files                       (PostToolUse-detected mutations)
   ├─ nested_memory                       (CLAUDE.md hierarchy walk)
   ├─ dynamic_skill                       (skill auto-discovery)
   ├─ skill_listing                       (available skills)
   ├─ plan_mode                           (plan reminder if mode active)
   ├─ plan_mode_exit                      (plan exit reminder)
   ├─ auto_mode                           (auto-mode reminder)
   ├─ auto_mode_exit                      (auto exit reminder)
   ├─ todo_reminders                      (TodoWrite/TaskCreate nudge)
   ├─ teammate_mailbox / team_context     (agent-team gated)
   ├─ agent_pending_messages              (subagent inbox)
   ├─ critical_system_reminder            (experimental override)
   └─ Main-agent-only:
      ├─ ide_selection / ide_opened_file  (IDE bridge state)
      ├─ output_style                     (output style banner)
      ├─ diagnostics / lsp_diagnostics    (LSP findings)
      ├─ unified_tasks                    (TaskList tool's table)
      ├─ async_hook_responses             (asyncRewake hook output)
      ├─ memory_update                    (auto-memory writes)
      ├─ token_usage / output_token_usage (context budget reminders)
      ├─ budget_usd                       (spend reminders)
      ├─ verify_plan_reminder             (post-plan verify nudge)
      └─ thinking_reminder                (per-request "think this less" cue)
```

Each generator returns zero or more attachment objects of a specific `type`. The dispatcher (`normalizeAttachmentForAPI` aka `CI6`/`Tq4`) routes each `type` to a renderer that builds the reminder text and wraps it.

**Why parallel-Promise-all:** The 30+ generators include filesystem reads (CLAUDE.md walk), git checks (changed-files), and LSP queries (diagnostics). Running serially would dominate request latency. The `aY()` wrapper (line 397620) catches per-generator errors so a single failure doesn't kill the entire reminder set.

## When reminders are *not* emitted

Three suppression paths matter:

1. **`CLAUDE_CODE_DISABLE_ATTACHMENTS` / `CLAUDE_CODE_SIMPLE`** env vars short-circuit `p65` to emit only `queued_commands` (line 397551). Used in headless/SDK mode where the harness chrome would be noise.
2. **Subagents** receive a reduced set — the main-agent-only block at line 397597 (the `if (w)` branch where `w = !$.agentId`) is skipped. Subagents don't get token-budget reminders, IDE selection reminders, or LSP diagnostics — those would be irrelevant or actively misleading inside a `Task` invocation.
3. **`/clear` / `/compact`** resets specific dedupe state — e.g., the `tengu_auto_notice_once` Statsig gate state for the "Auto mode" once-only reminder.

## Cross-validation against v2.1.88

The TS reference at `/lyz/codespace/3rd/claude-code/src/` exports the same primitives under readable names:

| Obfuscated (2.1.142) | Readable (2.1.88) | File:Line | Purpose |
|----------------------|-------------------|-----------|---------|
| `h2` | `wrapInSystemReminder` | `utils/messages.ts:3097` | String → `<system-reminder>…</system-reminder>` |
| `o_` | `wrapMessagesInSystemReminder` | `utils/messages.ts:3101` | List[Message] → List[wrapped Message] |
| `Az5` | `ensureSystemReminderWrap` | `utils/messages.ts:1797` | Idempotent re-wrap; gated by `tengu_chair_sermon` |
| `mq4` | `smooshSystemReminderSiblings` | `utils/messages.ts:1835` | Fold SR-prefixed text into adjacent tool_result |
| `Nq4` | `stripSystemReminders` | `components/messageActions.tsx:399` | Strip leading reminders |
| `vQ4` | (inlined `while` loop) | `utils/transcriptSearch.ts:117-127` | Strip all reminders |
| `Wq4` | `extractSystemReminderContent` | `utils/telemetry/betaSessionTracing.ts:149` | Unwrap a wholly-tagged string |
| `nD6` | `extractSystemReminderContent` (telemetry copy) | `utils/telemetry/betaSessionTracing.ts:149` | Same as Wq4 |
| `CI6` / `Tq4` | `normalizeAttachmentForAPI` | `utils/messages.ts:3453+` | Attachment type → rendered messages |
| `p65` | `getAttachmentMessagesV2` (in `utils/attachments.ts`) | `utils/attachments.ts:2270+` | Per-turn attachment generator |

The v2.1.88 source is structurally identical for the wrap/strip primitives; the catalogue of attachment *types* has grown — v2.1.142 added `teammate_mailbox`, `team_context`, `agent_pending_messages`, `verify_plan_reminder`, `mcp_instructions_delta`, `critical_system_reminder`, and the four-state `deferred_tools_delta` (vs 2.1.88's two-state `added`/`removed`).

## Reading order

Pick a starting file based on what you're trying to understand:

| Goal | Start here |
|------|------------|
| "What reminder fires when X happens?" | `attachment_catalogue.md` |
| "How does a reminder go from emit to model context?" | `runtime_lifecycle.md` |
| "Why doesn't the user see them?" | `ui_handling.md` |
| "How do reminders affect token cost / cache?" | `telemetry_and_cache.md` |
| "Tool-specific reminders only" | `../04_tools/reminder_interaction.md` |
| "Verify the obfuscated→readable mapping" | `cross_validation.md` |

## Related modules

- `04_tools/reminder_interaction.md` — tool-adjacent reminders (TodoWrite nudge, Read wasted-call, ToolSearch deferred-tools delta)
- `07_compact/` — reminder lifecycle through compaction (replay vs. strip)
- `11_hooks/` — `hook_success`, `async_hook_response`, `hook_additional_context` reminder paths
- `12_plan_mode/` — `plan_mode`, `plan_mode_reentry`, `plan_mode_exit`, `verify_plan_reminder`
- `19_think_level/` — `thinking_reminder` (system prompt + per-turn cue)
- `23_prompt_cache/` — cache-prefix invariants the reminder design preserves
- `30_agent_team/` — `team_context`, `teammate_mailbox`, `agent_pending_messages` reminders
- `31_auto_memory/` — `relevant_memories`, `memory_update`, `nested_memory` reminders
- `34_subagent/` — subagent's reduced reminder set
- `36_background_agents/` — `task_status` reminder for `running`/`completed`/`killed`
- `39_goal/` — `/goal` injects a Stop-hook-driven reminder loop

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - v2.1.142 additions: [symbol_additions_v2_1_142_system_reminder.md](../00_overview/symbol_additions_v2_1_142_system_reminder.md)

Key functions in this module:
- `reminderWrap` (obfuscated: `h2`) - String → `<system-reminder>…</system-reminder>`
- `wrapMessagesAsReminders` (obfuscated: `o_`) - List wrap helper
- `ensureSystemReminderWrap` (obfuscated: `Az5`) - Idempotent re-wrap (gated by `tengu_chair_sermon`)
- `smooshSystemReminderSiblings` (obfuscated: `mq4`) - Fold reminder text into adjacent tool_result
- `stripLeadingReminders` (obfuscated: `Nq4`) - Peel leading reminder blocks
- `stripAllReminders` (obfuscated: `vQ4`) - Regex-strip any reminder/task-notification block
- `extractSystemReminderContent` (obfuscated: `Wq4`, `nD6`) - Unwrap a wholly-tagged string
- `normalizeAttachmentForAPI` (obfuscated: `CI6` + `Tq4` dispatcher) - Attachment → messages
- `collectAttachments` (obfuscated: `p65`) - Per-turn parallel generator pool
- `makeUserMessage` (obfuscated: `w8`) - Message factory carrying `isMeta` flag
- `REMINDER_THRESHOLDS` (obfuscated: `aO8`) - `{TURNS_SINCE_WRITE:10, TURNS_BETWEEN_REMINDERS:10}`
- `PLAN_REMINDER_THRESHOLDS` (obfuscated: `Is7`) - `{TURNS_BETWEEN_ATTACHMENTS:5, FULL_REMINDER_EVERY_N_ATTACHMENTS:5}`
- `AUTO_REMINDER_THRESHOLDS` (obfuscated: `Ss7`) - Same shape as `Is7`, for auto mode
- `MEMORY_REMINDER_THRESHOLD` (obfuscated: `B65`) - `{TURNS_BETWEEN_REMINDERS:10}`
