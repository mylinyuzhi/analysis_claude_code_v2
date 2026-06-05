# Symbol Additions — v2.1.156 `<system-reminder>` Subsystem

This file lists obfuscated→readable symbol mappings discovered while analyzing the v2.1.156 `<system-reminder>` subsystem. Cross-cutting analysis lives in `../41_system_reminder/`.

All file:line references are to `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines, single file). Every line number below was Read/grep-verified directly against the 2.1.156 bundle. **The 2.1.142 reference numbers do NOT apply** — both obfuscated names AND line numbers differ between 2.1.142 and 2.1.156.

Cross-validation is by READABLE name against the 2.1.88 TS baseline at `/lyz/codespace/3rd/claude-code/src`.

> **Note for module-doc authors:** the tables below are the single source of truth and live here in `00_overview/`. In module docs under `41_system_reminder/` use the LIST format (`` - `readableName` (obfuscated: `XY2`) - description ``), NOT obfuscated→readable tables.

---

## Module: System Reminder — Wrap / Strip / Extract Primitives

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `S0` | `wrapInSystemReminder` (string → `<system-reminder>\n…\n</system-reminder>`, multiline form) | cli_inner_pretty.js:445237-445241 | function |
| `Az7` | `wrapMemoryAgeReminder` (single-line `<system-reminder>${$}</system-reminder>\n`, memory-age only; wrap-only, NO extract) | cli_inner_pretty.js:221264-221269 | function |
| `C_` | `wrapMessagesInSystemReminder` (list-of-UserMessages wrapper; calls `S0` on each text block) | cli_inner_pretty.js:445299-445312 | function |
| `T8` | `createUserMessage` (factory carrying `isMeta` + `isVisibleInTranscriptOnly`) | cli_inner_pretty.js:443846-443883 | function |
| `fi6` | `extractSystemReminderContent` (regex unwrap; returns the original string on no-match) | cli_inner_pretty.js:445242-445245 | function |
| `JN6` | `extractSystemReminderContent` (telemetry/history-format copy; returns `null` on no-match) | cli_inner_pretty.js:271456-271458 | function |
| (regex literal) | single-line extract regex `/^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/` (gh/PR path copy) | cli_inner_pretty.js:271457 | regex |
| `PG4` | `stripLeadingReminders` (peel leading SR blocks; `18` = `"</system-reminder>".length`) | cli_inner_pretty.js:443733-443740 | function |
| `OD9` | `stripAllReminders` (regex-strip every SR/task-notification slice → single space) | cli_inner_pretty.js:614580-614582 | function |
| `fn` | `stripAllTagsForPreview` (calls `OD9` then strips every remaining `<tag>`, collapses whitespace) | cli_inner_pretty.js:614583-614588 | function |
| (index loop) | `stripAllRemindersByIndex` (indexOf/splice strip-ANYWHERE inside `aqz`) | cli_inner_pretty.js:495597-495605 | function |
| `Nm4` | `SYSTEM_REMINDER_CLOSE` constant (`"</system-reminder>"`) | cli_inner_pretty.js:495652 | constant |

### Code Snippet: the two string-wrap forms (`S0` multiline vs `Az7` single-line)

```javascript
// ============================================
// wrapInSystemReminder / wrapMemoryAgeReminder - the two SR string-wrap shapes
// Location: cli_inner_pretty.js:445237-445241 (S0) and 221264-221269 (Az7)
// ============================================

// ORIGINAL (for source lookup):
function S0(H) { return `<system-reminder>\n${H}\n</system-reminder>`; }
function Az7(H) { let $ = oG6(H); if (!$) return ""; return `<system-reminder>${$}</system-reminder>\n`; }

// READABLE (for understanding):
function wrapInSystemReminder(text) {
  // newline BEFORE and AFTER the body — the canonical multiline envelope
  return `<system-reminder>\n${text}\n</system-reminder>`;
}
function wrapMemoryAgeReminder(mtimeMs) {
  let staleNote = memoryFreshnessText(mtimeMs);   // "" when age <= 1 day
  if (!staleNote) return "";
  // NO internal newlines, trailing \n only — keeps the short prefix tight ahead of memory body
  return `<system-reminder>${staleNote}</system-reminder>\n`;
}

// Mapping: S0→wrapInSystemReminder, Az7→wrapMemoryAgeReminder, oG6→memoryFreshnessText, H→text/mtimeMs, $→staleNote
```

### Code Snippet: the two extract conventions (`fi6` returns original, `JN6` returns null)

```javascript
// ============================================
// extractSystemReminderContent - same regex, two return conventions
// Location: cli_inner_pretty.js:445242-445245 (fi6) and 271456-271458 (JN6)
// ============================================

// ORIGINAL (for source lookup):
function fi6(H) { let $ = /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/.exec(H); return $ ? $[1] : H; }
function JN6(H) { return /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/.exec(H.trim())?.[1]?.trim() || null; }

// READABLE (for understanding):
function extractSystemReminderContent(str) {                 // fi6: pass-through copy (dedup path)
  let m = /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/.exec(str);
  return m ? m[1] : str;                                     // ← returns ORIGINAL string on no-match
}
function extractSystemReminderContentOrNull(str) {           // JN6: telemetry/history copy
  return /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/.exec(str.trim())?.[1]?.trim() || null; // ← null on no-match
}

// Mapping: fi6→extractSystemReminderContent, JN6→extractSystemReminderContentOrNull, H→str
```

The `^…$` anchors mean both forms only match a string that is **wholly** one reminder envelope. The `\n?` on both sides tolerates both `S0`'s newline form and `Az7`'s single-line form.

---

## Module: System Reminder — Ensure-Wrap / Smoosh (re-wrap region 444371-444402)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `DQ_` | `ensureSystemReminderWrap` (idempotent re-wrap of an attachment UserMessage; skips already-wrapped text) | cli_inner_pretty.js:444371-444382 | function |
| `wQ_` | `hasToolReferenceContent` (predicate: any tool_result with a `$s` tool_reference block; smoosh-blocker) | cli_inner_pretty.js:444368-444370 | function |
| `hG4` | `smooshSystemReminderSiblings` (fold SR-prefixed text into the last tool_result of a user message) | cli_inner_pretty.js:444384-444402 | function |
| `Ai6` | `smooshIntoToolResult` (the actual fold; returns `null` on tool_reference constraint) | cli_inner_pretty.js:444756-444785 | function |
| `VQ_` | `mergeUserMessagesAndToolResults` (smoosh driver; gated by `tengu_chair_sermon`) | cli_inner_pretty.js:444787-444803 | function |
| `$s` | `isToolReferenceBlock` (predicate used by `wQ_`/`Ai6` to detect non-smooshable beta blocks) | (referenced at 444369, 444758) | function |

> **Anchor correction:** the v2.1.156 ANCHORS hint placed `ensure/smoosh re-wrap region@444370-444395`. Verified: `wQ_` (a tool_reference predicate) is at 444368-444370, and `ensureSystemReminderWrap` (`DQ_`) actually starts at **444371**. The gate that drives smoosh at merge time is `tengu_chair_sermon` (`V$("tengu_chair_sermon", !1)` at 444604), unchanged from 2.1.88.

---

## Module: System Reminder — Threshold / Config Constants (414014-414019)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `QV$` | `TODO_REMINDER_CONFIG` (`{TURNS_SINCE_WRITE:10, TURNS_BETWEEN_REMINDERS:10}`) | cli_inner_pretty.js:414014 | object |
| `lg6` | `PLAN_MODE_ATTACHMENT_CONFIG` (`{TURNS_BETWEEN_ATTACHMENTS:5, FULL_REMINDER_EVERY_N_ATTACHMENTS:5}`) | cli_inner_pretty.js:414015 | object |
| `Kw4` | `ULTRA_EFFORT_CONFIG` (`{TURNS_BETWEEN_MAINTENANCE:10}`) — **NEW** | cli_inner_pretty.js:414016 | object |
| `_w4` | `RELEVANT_MEMORIES_CONFIG` (`{MAX_SESSION_BYTES:61440}` = 60KB) — **NEW** | cli_inner_pretty.js:414017 | object |
| `zw4` | `VERIFY_PLAN_REMINDER_CONFIG` (`{TURNS_BETWEEN_REMINDERS:10}`) | cli_inner_pretty.js:414018 | object |
| `aS_` | `QUEUED_COMMAND_SURVIVING_MODES` (`new Set(["prompt","task-notification"])`) | cli_inner_pretty.js:414019 | constant |
| `$qH` | `DEFERRED_DELTA_LIST_CAP` (`30`; truncation threshold for deferred/pending/removed name lists) | cli_inner_pretty.js:424952 | constant |
| `J08` | `collapseNameList` (name-list join + count-tag helper for delta reminders) | cli_inner_pretty.js:424918-424929 | function |

Readable config names are CONFIRMED via the module's `__esModule` export block at 412650-412659 (`TODO_REMINDER_CONFIG: ()=>QV$`, `PLAN_MODE_ATTACHMENT_CONFIG: ()=>lg6`, `ULTRA_EFFORT_CONFIG: ()=>Kw4`, `RELEVANT_MEMORIES_CONFIG: ()=>_w4`, `VERIFY_PLAN_REMINDER_CONFIG: ()=>zw4`).

---

## Module: System Reminder — collectAttachments Master Gate + Generator Pool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Aw4` | `getAttachmentMessages` (collectAttachments; master gate + two parallel waves) | cli_inner_pretty.js:412660-412738 | function |
| `E3` | `runAttachmentGenerator` (per-generator try/catch + 5%-sampled `tengu_attachment_compute_duration`) | cli_inner_pretty.js:412739-412763 | function |
| `gV$` | `getQueuedCommandAttachments` (the ONLY generator surviving the master gate) | cli_inner_pretty.js:412764-412798 | function |
| `xH` | `isEnvTruthy` (gate predicate for `CLAUDE_CODE_DISABLE_ATTACHMENTS` / `CLAUDE_CODE_SIMPLE`) | (referenced at 412662) | function |
| `eS_` | `getPlanModeAttachment` (plan_mode generator; call site 412698) | (referenced at 412698) | function |
| `Mw4` | `maybeEmitDateChange` (date_change generator) | cli_inner_pretty.js:412901-412910 | function |
| `qR_` | `maybeEmitUltrathinkEffort` (fires `tengu_ultrathink`) | cli_inner_pretty.js:412912-412915 | function |
| `HR_` | `maybeEmitAutoModeReminder` (auto_mode generator; once-per-session, NO cadence) | cli_inner_pretty.js:412889-412900 | function |
| `Ow4` | `findPriorAutoModeAttachment` (dedup helper for `HR_`) | cli_inner_pretty.js:412880-412888 | function |
| `vR_` | `maybeEmitTodoReminder` (todo gate; dual `>=10 && >=10`) | cli_inner_pretty.js:413741-413752 | function |
| `VR_` | `countTurnsSinceTodoEvents` (counter for `vR_`) | (referenced at 413745) | function |
| `NR_` | `maybeEmitTaskReminder` (task gate; gated by `OD()`=isTaskListEnabled) | cli_inner_pretty.js:413776-413787 | function |
| `kR_` | `countTurnsSinceTaskEvents` (counter for `NR_`) | cli_inner_pretty.js:413753-413774 | function |
| `Yw4` | `drainAgentPendingMessages` (re-emits inbox items as `queued_command`) | cli_inner_pretty.js:412799-412808 | function |
| `ER_` | `emitUnifiedTasks` (label-only generator → emits `task_status`) | cli_inner_pretty.js:413788-413801 | function |
| `vw4` | `emitMemoryUpdate` (drains `pendingMemoryUpdates`) | cli_inner_pretty.js:413803-413815 | function |
| `yR_` | `emitAsyncHookResponses` (async-rewake hook output) | cli_inner_pretty.js:413817-413855 | function |
| `hR_` | `emitTeammateMailbox` (**NEUTERED**: returns `[]` in both branches) | cli_inner_pretty.js:413856-413859 | function |
| `SR_` | `emitTeamContext` (once-per-session team coordination block) | cli_inner_pretty.js:413860-413869 | function |
| `RR_` | `emitTokenUsageReminder` (env-gated by `CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT`) | cli_inner_pretty.js:413871-413875 | function |
| `IR_` | `emitOutputTokenUsageReminder` (**NEUTERED**: `return []`) | cli_inner_pretty.js:413877-413879 | function |
| `CR_` | `emitBudgetUsdReminder` (emits when `maxBudgetUsd` configured) | cli_inner_pretty.js:413880-413885 | function |
| `bR_` | `emitVerifyPlanReminder` (**NEUTERED**: `return []` unconditionally) | cli_inner_pretty.js:413895-413897 | function |
| `WG8` | `memoryHeader` (`q ? \`${q}\n\nMemory: ${H}:\` : \`Memory: ${H}:\``) | cli_inner_pretty.js:413393-413400 | function |
| `ME5` | `memoryAgeDays` (`Math.max(0, Math.floor((Date.now()-H)/86400000))`) | cli_inner_pretty.js:221252-221254 | function |
| `oG6` | `memoryFreshnessText` (plain stale-marker text; `""` when age ≤ 1 day) | cli_inner_pretty.js:221255-221263 | function |

### Generator call-site bindings (definitive `type` ↔ generator map)

Each generator is registered inside `Aw4` via `E3("<attachment-type>", () => generator(...))`. The **first string argument is the attachment-type / telemetry label**, so the obfuscated-generator → readable-type binding is established *by construction* at the call site — not inferred. The neutered bindings below are confirmed by their exact call-site lines (verified via grep on the bundle):

| Attachment type (E3 label) | Generator | Call-site line | Wave / gate | Status |
|----------------------------|-----------|----------------|-------------|--------|
| `plan_mode` | `eS_` | 412698 | always | active |
| `auto_mode` | `HR_` | 412700 | always | active (once-per-session) |
| `todo_reminders` | `OD() ? NR_ : vR_` | 412702 | always | active (TaskList ternary) |
| `teammate_mailbox` | `hR_` | 412703 | `R7()`-gated | **NEUTERED → `[]`** (413856) |
| `team_context` | `SR_` | 412703 | `R7()`-gated | active |
| `unified_tasks` | `ER_` | 412724 | main-only | active |
| `async_hook_responses` | `yR_` | 412725 | main-only | active |
| `memory_update` | `vw4` | 412726 | main-only | active |
| `token_usage` | (inline) | 412727 | main-only | env-gated (`RR_`/`CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT`) |
| `budget_usd` | `CR_` | 412730 | main-only | active when `maxBudgetUsd` set |
| `output_token_usage` | `IR_` | 412731 | main-only | **NEUTERED → `[]`** (413877) |
| `verify_plan_reminder` | `bR_` | 412732 | main-only | **NEUTERED → `[]`** (413895) |

> **Cross-validation result (caveat resolved):** the three "neutered generator" claims (`hR_`/`teammate_mailbox`, `IR_`/`output_token_usage`, `bR_`/`verify_plan_reminder`) are not inferred from function-body shape alone — the `E3(...)` label at the call site fixes the type binding, and the function body at the generator definition confirms the unconditional `return []`. Both halves verified against the bundle.

### Code Snippet: the master gate inside `Aw4` (only queued commands survive disable)

```javascript
// ============================================
// getAttachmentMessages - master attachment gate + 1s-budget parallel pool
// Location: cli_inner_pretty.js:412660-412738
// ============================================

// ORIGINAL (for source lookup):
async function Aw4(H, $, q, K, _, z, A) {
  let Y = Bf($.options.mainLoopModel);
  if (xH(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || xH(process.env.CLAUDE_CODE_SIMPLE)) return gV$(K, Y);
  let f = C4(), O = setTimeout((Z) => Z.abort(), 1000, f), M = { ...$, abortController: f }, j = !$.agentId;
  /* … build J (always-run wave) and X (main-agent-only wave), each E3-wrapped … */
  let [L, P] = await Promise.all([Promise.all(J), Promise.all(X)]);
  return (clearTimeout(O), [...D.flat(), ...L.flat(), ...P.flat()].filter((Z) => Z != null));
}

// READABLE (for understanding):
async function getAttachmentMessages(includeMentions, ctx, /*…*/, queuedCommands, messages, /*…*/) {
  let model = resolveModel(ctx.options.mainLoopModel);
  // MASTER GATE: when attachments disabled, return ONLY queued-command attachments (everything else suppressed)
  if (isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE))
    return getQueuedCommandAttachments(queuedCommands, model);
  let abort = makeAbortController(), budget = setTimeout((a) => a.abort(), 1000, abort);  // 1s total budget
  let isMainAgent = !ctx.agentId;                       // main-agent-only wave gate
  /* alwaysRunWave (J): queued_commands, date_change, ultrathink, deltas, plan/auto mode, todo/task, team, … */
  /* mainOnlyWave  (X): ide/diagnostics/lsp, unified_tasks, async_hook, memory_update, token/budget, verify_plan */
  let [a, b] = await Promise.all([Promise.all(alwaysRunWave), Promise.all(mainOnlyWave)]);
  return (clearTimeout(budget), [...mentions.flat(), ...a.flat(), ...b.flat()].filter((x) => x != null));
}

// Mapping: Aw4→getAttachmentMessages, gV$→getQueuedCommandAttachments, xH→isEnvTruthy, $.agentId→ctx.agentId, j→isMainAgent
```

> The other `CLAUDE_CODE_DISABLE_ATTACHMENTS`-adjacent gate near 240488 (`Fv6`) is `isAgentListInMessagesEnabled` (controls only the agent-listing attachment), **NOT** the master collectAttachments gate. Don't conflate them. The master gate is at 412662 inside `Aw4`.

### Code Snippet: the dual-gate todo cadence (`vR_`)

```javascript
// ============================================
// maybeEmitTodoReminder - dual 10/10 anti-nag cadence gate
// Location: cli_inner_pretty.js:413741-413752
// ============================================

// ORIGINAL (for source lookup):
async function vR_(H, $) {
  if (!$.options.tools.some((_) => h1(_, mv))) return [];
  if (XG8 && $.options.tools.some((_) => h1(_, XG8))) return [];
  if (!H || H.length === 0) return [];
  let { turnsSinceLastTodoWrite: q, turnsSinceLastReminder: K } = VR_(H);
  if (q >= QV$.TURNS_SINCE_WRITE && K >= QV$.TURNS_BETWEEN_REMINDERS) {
    let _ = $.agentId ?? E$(), A = $.getAppState().todos[_] ?? [];
    return [{ type: "todo_reminder", content: A, itemCount: A.length }];
  }
  return [];
}

// READABLE (for understanding):
async function maybeEmitTodoReminder(messages, ctx) {
  if (!ctx.options.tools.some((t) => toolIs(t, TodoWriteTool))) return [];   // TodoWrite must be present
  if (BriefTool && ctx.options.tools.some((t) => toolIs(t, BriefTool))) return [];  // suppressed in Brief mode
  if (!messages?.length) return [];
  let { turnsSinceLastTodoWrite, turnsSinceLastReminder } = countTurnsSinceTodoEvents(messages);
  // DUAL GATE: fire ONLY when BOTH counters clear 10 — a model that ignored the last nudge
  // still waits a FULL 10-turn window before being prodded again (prevents nag-spam).
  if (turnsSinceLastTodoWrite >= TODO_REMINDER_CONFIG.TURNS_SINCE_WRITE &&
      turnsSinceLastReminder  >= TODO_REMINDER_CONFIG.TURNS_BETWEEN_REMINDERS) {
    let key = ctx.agentId ?? mainAgentId(), todos = ctx.getAppState().todos[key] ?? [];
    return [{ type: "todo_reminder", content: todos, itemCount: todos.length }];
  }
  return [];
}

// Mapping: vR_→maybeEmitTodoReminder, VR_→countTurnsSinceTodoEvents, QV$→TODO_REMINDER_CONFIG, mv→TodoWriteTool, XG8→BriefTool, h1→toolIs
```

---

## Module: System Reminder — Attachment Normalizer / Dispatch

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `kc6` | `normalizeAttachmentForAPI` (3-tier dispatcher: team early-exit → `DG4` map → `switch`) | cli_inner_pretty.js:445425-445808 | function |
| `DG4` | `PER_TYPE_RENDERERS` (per-type renderer map) | cli_inner_pretty.js:446557-446767 | object |
| `R7` | `isAgentSwarmsEnabled` (gate for the `teammate_mailbox`/`team_context` early branch) | (referenced at 445426) | function |
| `yT8` | `AMBIENT_CONTEXT_TRAILER` (shared "do not narrate it to the user…" trailer const) | cli_inner_pretty.js:446489-446490 | constant |
| `BQ_` | `MEMORY_UPDATE_SOURCE_LABELS` (`{dream:"Background memory consolidation"}`) | cli_inner_pretty.js:446768 | object |
| `IQ_` | `getPlanModeInstructions` (subagent→`uQ_` / sparse→`xQ_` / else→`bQ_` selector) | cli_inner_pretty.js:445313-445317 | function |
| `bQ_` | `getPlanModeFullInstructions` (full 5-phase workflow) | cli_inner_pretty.js:445324-445410 | function |
| `xQ_` | `getPlanModeSparseInstructions` | cli_inner_pretty.js:445411-445415 | function |
| `uQ_` | `getPlanModeSubagentInstructions` | cli_inner_pretty.js:445416-445424 | function |
| `wG4` | `getExitPlanModeHelper` (Phase-5 ExitPlanMode helper text) | cli_inner_pretty.js:445318-445323 | function |
| `jG4` | `PLAN_MODE_HEADER` (full-mode header constant) | cli_inner_pretty.js:446485-446486 | constant |
| `CQ_` | `PLAN_PHASE4_SECTION` (phase-4 section template) | (referenced inside `bQ_`) | constant |
| `XG4` | `wrapQueuedCommandContent` (origin-switch envelope: task-notification/coordinator/channel/peer/human) | cli_inner_pretty.js:446404-446432 | function |
| `Li6` | `wrapChannelMessage` (channel-origin queued-command wrapper) | (referenced at 446418) | function |
| `jk$` | `makeSyntheticToolUse` (`Called the ${tool} tool with the following input: ${json}`) | cli_inner_pretty.js:445861-445863 | function |
| `Mk$` | `makeSyntheticToolResult` (`Result of calling the ${tool} tool:\n${content}`; image-aware) | cli_inner_pretty.js:445846-445860 | function |
| `eY` | `ReadTool` (Read tool object; `.name` = "Read") | (referenced at 445466) | object |
| `l4` | `BashTool` (used by `directory` synthetic `ls`) | (referenced at 446558) | object |

### Code Snippet: the 3-tier dispatcher head (`kc6`)

```javascript
// ============================================
// normalizeAttachmentForAPI - 3-tier dispatch (team early-exit → map → switch)
// Location: cli_inner_pretty.js:445425-445808
// ============================================

// ORIGINAL (for source lookup):
function kc6(H) {
  if (R7()) {
    if (H.type === "teammate_mailbox") return [T8({ content: _Q_().formatTeammateMessages(H.messages), isMeta: !0 })];
    if (H.type === "team_context") return C_([T8({ content: S0(`# Team Coordination\n…`), isMeta: !0 })]);
  }
  if (H.type in DG4) return DG4[H.type](H);
  switch (H.type) { /* file, todo_reminder, task_reminder, plan_mode, … */ }
  /* noop allow-list → []; else em("normalizeAttachmentForAPI", Error("Unknown attachment type")) */
}

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
  // Tier 1: agent-swarm early-exit (only when swarms enabled) — the two team types render before everything else
  if (isAgentSwarmsEnabled()) {
    if (attachment.type === "teammate_mailbox")
      return [createUserMessage({ content: getTeammateService().formatTeammateMessages(attachment.messages), isMeta: true })];
    if (attachment.type === "team_context")
      return wrapMessagesInSystemReminder([createUserMessage({ content: wrapInSystemReminder(`# Team Coordination\n…`), isMeta: true })]);
  }
  // Tier 2: simple per-type renderers live in the PER_TYPE_RENDERERS map
  if (attachment.type in PER_TYPE_RENDERERS) return PER_TYPE_RENDERERS[attachment.type](attachment);
  // Tier 3: complex multi-branch cases in the switch
  switch (attachment.type) { /* … */ }
}

// Mapping: kc6→normalizeAttachmentForAPI, DG4→PER_TYPE_RENDERERS, R7→isAgentSwarmsEnabled, _Q_→getTeammateService, C_→wrapMessagesInSystemReminder, S0→wrapInSystemReminder, T8→createUserMessage
```

> **2.1.88 counterpart:** `normalizeAttachmentForAPI` (`messages.ts:3453`). Same 3-tier shape (agent-swarm early-exit, then renderer object, then switch). In 2.1.156 the renderer object is hoisted to a top-level const `DG4`; in 2.1.88 it is an inline object inside the function.

---

## Module: System Reminder — Attachment Renderer Cases (switch + map members)

These render-case anchors live inside `kc6`/`DG4`. They have no top-level symbol (they are object keys / switch labels); listed here with their verified case line.

| Case key | Tier | File:Line | Change vs 2.1.88 |
|----------|------|-----------|------------------|
| `file` (image/text/notebook/pdf) | switch | cli_inner_pretty.js:445463-445487 | unchanged |
| `invoked_skills` | switch | cli_inner_pretty.js:445488-445509 | EXPANDED (post-compaction "do NOT re-execute" guidance) |
| `todo_reminder` | switch | cli_inner_pretty.js:445511-445522 | SHORTENED (dropped "NEVER mention" tail) |
| `task_reminder` | switch | cli_inner_pretty.js:445524-445536 | SHORTENED (dropped "NEVER mention" tail) |
| `relevant_memories` | switch | cli_inner_pretty.js:445538-445556 | EXPANDED ("Retrieved for possible relevance" lead-in + `<synthesis:` special-case) |
| `queued_command` | switch | cli_inner_pretty.js:445557-445567 | REWORDED + NEW `peer` kind (via `XG4`) |
| `diagnostics` | switch | cli_inner_pretty.js:445569-445571 | unchanged |
| `plan_mode` | switch | cli_inner_pretty.js:445573-445574 | REWORDED (full-workflow body evolved; selector preserved) |
| `plan_mode_reentry` | switch | cli_inner_pretty.js:445575-445589 | unchanged |
| `auto_mode` | switch | cli_inner_pretty.js:445591-445599 | REWORDED + REMOVED variants (full/sparse collapsed to one message) |
| `mcp_resource` | switch | cli_inner_pretty.js:445600-445634 | unchanged |
| `task_status` (killed/running/other) | switch | cli_inner_pretty.js:445635-445656 | unchanged |
| `async_hook_response` | switch | cli_inner_pretty.js:445658-445664 | unchanged |
| `hook_success` | switch | cli_inner_pretty.js:445666-445670 | CHANGED (now also accepts `UserPromptExpansion`) |
| `context_efficiency` | switch | cli_inner_pretty.js:445671-445672 | CHANGED → HARD NOOP (HISTORY_SNIP branch removed) |
| `deferred_tools_delta` | switch | cli_inner_pretty.js:445673-445714 | NEW/EXPANDED (4 sections, `$qH` truncation, `yT8` trailer) |
| `agent_listing_delta` | switch | cli_inner_pretty.js:445715-445742 | REWORDED + EXPANDED (`yT8` appended) |
| `mcp_instructions_delta` | switch | cli_inner_pretty.js:445743-445767 | EXPANDED minor (`yT8` appended) |
| `memory_update` | switch | cli_inner_pretty.js:445768-445785 | NEW (absent in 2.1.88; uses shared `yT8`) |
| `verify_plan_reminder` | switch | cli_inner_pretty.js:445786-445788 | string UNCHANGED / behavior REMOVED (gen `bR_` returns `[]`) |
| (noop allow-list) | switch | cli_inner_pretty.js:445791-445806 | `thinking_reminder`, `autocheckpointing`, `pen_mode_*`, `ultrawork_request`, … → `[]` |
| `directory` | map | cli_inner_pretty.js:446558-446562 | unchanged |
| `edited_text_file` | map | cli_inner_pretty.js:446563-446573 | unchanged |
| `compact_file_reference` | map | cli_inner_pretty.js:446574-446580 | unchanged |
| `pdf_reference` | map | cli_inner_pretty.js:446581-446587 | unchanged |
| `selected_lines_in_ide` | map | cli_inner_pretty.js:446588-446604 | unchanged |
| `opened_file_in_ide` | map | cli_inner_pretty.js:446605-446611 | unchanged |
| `plan_file_reference` | map | cli_inner_pretty.js:446612-446624 | unchanged |
| `nested_memory` | map | cli_inner_pretty.js:446625-446633 | unchanged (relocated to map) |
| `agent_mention` | map | cli_inner_pretty.js:446634-446640 | unchanged |
| `skill_listing` | map | cli_inner_pretty.js:446641-446650 | unchanged (relocated to map) |
| `output_style` | map | cli_inner_pretty.js:446652-446661 | CHANGED (per-style `turnReminder` override) |
| `critical_system_reminder` | map | cli_inner_pretty.js:446662 | unchanged (pass-through) |
| `plan_mode_exit` | map | cli_inner_pretty.js:446663-446672 | unchanged |
| `auto_mode_exit` | map | cli_inner_pretty.js:446674-446682 | unchanged |
| `token_usage` | map | cli_inner_pretty.js:446683-446685 | unchanged text (gen env-gated) |
| `budget_usd` | map | cli_inner_pretty.js:446686-446688 | unchanged |
| `output_token_usage` | map | cli_inner_pretty.js:446689-446692 | render unchanged (gen `IR_` neutered) |
| `hook_blocking_error` | map | cli_inner_pretty.js:446693-446700 | unchanged |
| `hook_additional_context` | map | cli_inner_pretty.js:446701-446712 | unchanged (relocated to map) |
| `hook_stopped_continuation` | map | cli_inner_pretty.js:446713-446715 | unchanged |
| `date_change` | map | cli_inner_pretty.js:446716-446722 | unchanged |
| `ultrathink_effort` | map | cli_inner_pretty.js:446723-446730 | REWORDED (keyword-trigger phrasing, dropped `level`) |
| `workflow_keyword_request` | map | cli_inner_pretty.js:446731-446738 | NEW ("Workflow" vocabulary) |
| `ultra_effort_enter` | map | cli_inner_pretty.js:446739-446748 | NEW ("Ultracode is on…") |
| `ultra_effort_exit` | map | cli_inner_pretty.js:446749-446752 | NEW ("Ultracode is off…") |
| `dynamic_skill` + noop renderers | map | cli_inner_pretty.js:446753-446766 | unchanged (API noop, UI-only) |

---

## Module: System Reminder — Inline Reminder Constants / Emit Sites

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (literal) | Read empty-file warning (`<system-reminder>Warning: the file exists but the contents are empty.</system-reminder>`) | cli_inner_pretty.js:422944 | string |
| (literal) | Read short-file warning (`…shorter than the provided offset…`) | cli_inner_pretty.js:422945 | string |
| `tV7` | `maybeEmitGithubRateLimitReminder` (debounced gh rate-limit reminder emitter) | cli_inner_pretty.js:269424-269429 | function |
| `qc5` / `Kc5` | gh rate-limit stderr-match regexes (consumed by `tV7`) | (referenced at 269425) | regex |
| `MV8` | `runSideQuestion` (lightweight forked single-turn no-tools agent for `/ask`) | cli_inner_pretty.js:454122-454144 | function |
| (literal) | side-question prompt SR (`This is a side question from the user…`) | cli_inner_pretty.js:454123-454138 | string |
| `DL9` | `buildContainerRestartReminder` (lists zombie background tasks) | cli_inner_pretty.js:623996-624002 | function |
| (literal) | brief-mode toggle SR (`Brief mode is now enabled/disabled…`) | cli_inner_pretty.js:527818-527820 | string |
| `cd` | `BRIEF_TOOL_NAME` (interpolated into the brief-mode SR) | (referenced at 527818) | constant |
| `hU4` / `p4z` | `REMOTE_PLAN_LIGHT_PROMPT` (single-agent remote planning; module export) | cli_inner_pretty.js:503302-503321 | module |
| `SU4` / `U4z` | `REMOTE_PLAN_DIAGRAM_PROMPT` (single-agent + mermaid; module export) | cli_inner_pretty.js:503323-503345 | module |
| `RU4` / `F4z` | `REMOTE_PLAN_ULTRA_PROMPT` (multi-agent ultra planning; module export) | cli_inner_pretty.js:503347-503377 | module |
| `KV8` | `prependCachedContextReminder` (CLAUDE.md / static-context session-start block) | cli_inner_pretty.js:556126-556143 | function |
| (literal) | CLAUDE.md session-start SR (`As you answer the user's questions…`) | cli_inner_pretty.js:556130-556139 | string |
| `YT9` | `TEAM_SHUTDOWN_PROMPT` (non-interactive agent-team shutdown reminder) | cli_inner_pretty.js:642102-642114 | constant |

### Code Snippet: the debounced gh rate-limit emitter (`tV7`)

```javascript
// ============================================
// maybeEmitGithubRateLimitReminder - debounced gh 5,000/hr rate-limit SR
// Location: cli_inner_pretty.js:269424-269429
// ============================================

// ORIGINAL (for source lookup):
function tV7(H, $) {
  if (!qc5.test(H) || !Kc5.test($) || Date.now() < rV7) return;
  return (
    (rV7 = Date.now() + _c5),
    "<system-reminder>GitHub API rate limit exceeded (5,000/hr shared across all tools and agents). Run `gh api rate_limit --jq .resources` and sleep until reset before further gh calls. If polling in a loop, use ScheduleWakeup instead of retrying.</system-reminder>"
  );
}

// READABLE (for understanding):
function maybeEmitGithubRateLimitReminder(stdout, stderr) {
  // combined guard: bail (return undefined) unless gh-cmd + rate-limit stderr match AND the cooldown has elapsed
  if (!GH_CMD_REGEX.test(stdout) || !RATE_LIMIT_STDERR_REGEX.test(stderr) || Date.now() < nextRateLimitReminderAt) return;
  nextRateLimitReminderAt = Date.now() + RATE_LIMIT_COOLDOWN_MS;  // debounce: store the NEXT-allowed timestamp
  return "<system-reminder>GitHub API rate limit exceeded (5,000/hr shared across all tools and agents). Run `gh api rate_limit --jq .resources` and sleep until reset before further gh calls. If polling in a loop, use ScheduleWakeup instead of retrying.</system-reminder>";
}

// Mapping: tV7→maybeEmitGithubRateLimitReminder, qc5→GH_CMD_REGEX, Kc5→RATE_LIMIT_STDERR_REGEX, rV7→nextRateLimitReminderAt (init 0 @269452), _c5→RATE_LIMIT_COOLDOWN_MS (60000 @269451)
```

---

## Module: System Reminder — Memory-Age / Stale Marker

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ME5` | `memoryAgeDays` | cli_inner_pretty.js:221252-221254 | function |
| `oG6` | `memoryFreshnessText` (plain stale-marker; `""` when age ≤ 1 day) | cli_inner_pretty.js:221255-221263 | function |
| `Az7` | `wrapMemoryAgeReminder` (single-line SR wrap of `oG6`) | cli_inner_pretty.js:221264-221269 | function |
| `WG8` | `memoryHeader` (header for `relevant_memories`; dropped 2.1.88 "(saved X ago)" suffix) | cli_inner_pretty.js:413393-413400 | function |

The verbatim stale-marker text (age > 1 day) is at 221258-221262: *"This memory is N days old. Memories are point-in-time observations, not live state — claims about code behavior or file:line citations may be outdated. Verify against current code before asserting as fact."* The Read-tool injection of this prefix (via the cached `K` term) is at 422933-422935.

---

## Module: System Reminder — UI Suppression / Filter Predicates

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `d7z` | `computeStickyPromptText` (sticky-prompt extractor; isMeta/queued-command guards + `PG4` leading-strip) | cli_inner_pretty.js:499732-499755 | function |
| `Ce6` | `stickyPromptText` (WeakMap-memoized wrapper for `d7z`, cache `up4`) | cli_inner_pretty.js:499726-499731 | function |
| `up4` | `stickyPromptCache` (WeakMap keyed on message object) | (referenced at 499727) | object |
| `NN8` | `StickyPromptContext` (React context `{ setStickyPrompt }`) | cli_inner_pretty.js:499718 | object |
| `aqz` | `buildSearchIndexText` (per-message search-haystack builder; indexOf strip-all) | cli_inner_pretty.js:495543-495605 | function |
| `_N8` | `searchIndexTextLower` (memoized lowercasing wrapper for `aqz`, cache `ym4`) | cli_inner_pretty.js:495537-495541 | function |
| `Q7z` | `searchIndexTextLowerCached` (second-level cache `xp4` over `_N8`) | cli_inner_pretty.js:499720-499725 | function |
| `fD9` | `buildActivityLogPreview` (one-line transcript-row preview; `OD9` strip + first non-blank line) | cli_inner_pretty.js:614542-614578 | function |

> **Anchor correction:** the sticky-prompt strip identity in 2.1.156 is `PG4` (`stripLeadingReminders` at 443733). The 2.1.142 reference used `Nq4`. The actual consumer (the predicate `if (H.isMeta || H.isVisibleInTranscriptOnly) return null`) is at 499735 inside `d7z`.

---

## Module: System Reminder — Telemetry Split (betaSessionTracing-equivalent)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `JN6` | `extractSystemReminderContent` (single-line telemetry extract; null on no-match) | cli_inner_pretty.js:271456-271458 | function |
| `Uc5` | `formatMessagesForContext` (split into `{contextParts, systemReminders}`; NEW `api_system` branch) | cli_inner_pretty.js:271459-271492 | function |
| `iv7` | `setNewContextAndRemindersOnSpan` (writes `new_context`/`system_reminders` span attributes) | cli_inner_pretty.js:271500-271593 | function |
| `dv7` | `hashMessage` (literal: `msg_${LN6(IH(message.content))}`; `LN6` is a content-hash helper, likely sha256-prefix — not visible at this range) | cli_inner_pretty.js:271452-271454 | function |
| `XN6` | `lastReportedMessageHash` (per-querySource dedupe map) | (referenced at 271589) | object |
| `qJH` | `isUserPromptLoggingEnabled` (`OTEL_LOG_USER_PROMPTS` gate for bodies) | cli_inner_pretty.js:271425-271427 | function |
| `$W` | `isBetaSessionTracingEnabled` (counts gate) | cli_inner_pretty.js:271431-271434 | function |
| `lv7` | `clearTracingDedupe` (`DP$.clear(); XN6.clear()`) | cli_inner_pretty.js:271428-271430 | function |

> Span attribute names (verified): `new_context_message_count` (271561), `system_reminders_count` (271562), `new_context` (271571), `new_context_truncated`/`new_context_original_length` (271572), `system_reminders` (271583), `system_reminders_truncated`/`system_reminders_original_length` (271584). The *counts* emit whenever `$W()` is on; the *bodies* additionally require `qJH()`.

---

## Module: System Reminder — Mid-Conversation `role:"system"` Subsystem (NEW)

This is the largest NEW machinery in the 2.1.156 reminder subsystem — no 2.1.88 counterpart. It delivers reminders as real `role:"system"` messages under a beta on supporting models, falling back to in-band `<system-reminder>` user bodies on a 400 rejection.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_h` | `MID_CONV_SYSTEM_BETA` (`KX("mid_conversation_system", "mid-conversation-system-2026-04-07")`) | cli_inner_pretty.js:98142 | constant |
| `XH8` | `modelSupportsMidConvSystem` (memoized capability predicate; HIPAA-off, force-overridable) | cli_inner_pretty.js:130520-130531 | function |
| `SQ_` | `makeApiSystemMessage` (`type:"api_system"`, `role:"system"`) | cli_inner_pretty.js:445274-445281 | function |
| `RQ_` | `extractReminderBodiesForApiSystem` (unwrap reminder text via `fi6` for re-emission as system content) | cli_inner_pretty.js:445282-445298 | function |
| `D0` | `normalizeMessagesForApi` (decides per-message: `api_system` vs in-band `S0` wrap; model arg gates) | cli_inner_pretty.js:444461+ | function |
| `w` (inner) | `flushAccumulatedReminders` (emits `SQ_` system msg OR `T8(S0(...))` in-band fallback) | cli_inner_pretty.js:444492-444505 | function |
| `xP6` | `isMidConvSystemRejectError` (400 + beta-header / "Unexpected role" / "not supported … role system") | cli_inner_pretty.js:186567-186574 | function |
| `aI$` | `stickyRejectBeta` (`H.sent.delete($); H.rejected.add($)`) | cli_inner_pretty.js:1938-1940 | function |
| `g3q` | `isBetaStickyRejected` (`H.rejected.has($)`) | cli_inner_pretty.js:1941-1943 | function |
| `am8` | `getStickyBetaState` (returns `d$.stickyBetas` with `.sent`/`.rejected` sets) | cli_inner_pretty.js:3264-3266 | function |
| (event) | `tengu_mid_conv_system_fallback_retry` | cli_inner_pretty.js:557435 | event |

### Code Snippet: the dual-representation flush (`w` inside `D0`)

```javascript
// ============================================
// flushAccumulatedReminders - SAME helper emits role:"system" OR in-band <system-reminder>
// Location: cli_inner_pretty.js:444492-444505 (inside D0)
// ============================================

// ORIGINAL (for source lookup):
function w() {
  if (M.length === 0) return;
  let W = M.join("\n\n"); M.length = 0;
  let G = Tx(O);
  if (G?.type === "api_system") G.message.content += `\n\n${W}`;
  else if (G?.type === "user") ((j = !0), O.push(SQ_(W)));
  else O.push(T8({ content: S0(W), isMeta: !0 }));
}

// READABLE (for understanding):
function flushAccumulatedReminders() {
  if (reminderBuffer.length === 0) return;
  let joined = reminderBuffer.join("\n\n"); reminderBuffer.length = 0;
  let prev = lastOf(out);
  if (prev?.type === "api_system") prev.message.content += `\n\n${joined}`;          // coalesce into prior system msg
  else if (prev?.type === "user") ((emittedSystemMsg = true), out.push(makeApiSystemMessage(joined)));  // new role:"system"
  else out.push(createUserMessage({ content: wrapInSystemReminder(joined), isMeta: true }));  // FALLBACK: in-band <system-reminder>
}

// Mapping: w→flushAccumulatedReminders, M→reminderBuffer, O→out, SQ_→makeApiSystemMessage, S0→wrapInSystemReminder, T8→createUserMessage, Tx→lastOf
```

When `D0` is called WITHOUT a model arg (`q === void 0`), `XH8` is never consulted and reminders ALWAYS take the in-band `S0`-wrapped path — that is exactly the pre-built fallback variant `B` constructed at request time (557037-557043). On a 400 rejection the handler at 557428-557438 drops the beta, swaps `b = B`, sticky-rejects via `aI$`, fires `tengu_mid_conv_system_fallback_retry`, and returns `"retry:mid-conv-system"`. The sticky-reject persists until `/clear` or `/compact`.

---

## Module: System Reminder — System-Prompt Clauses (SR convention)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `gXz` | `buildSystemSection` (`# System` builder; carries the SR-convention sentence) | cli_inner_pretty.js:555449-555458 | function |
| (literal) | SR-convention clause (`Tool results and user messages may include <system-reminder>…`) | cli_inner_pretty.js:555453 | string |
| `oXz` | `buildHarnessSection` (`# Harness` builder; output-style-aware; SR+hooks bullet) | cli_inner_pretty.js:555591-555606 | function |
| (literal) | `# Harness` SR+hooks bullet (`…injected by the harness, not the user. Hooks may intercept…`) | cli_inner_pretty.js:555604 | string |
| `gKq` | `CYBER_RISK_INSTRUCTION` (system-prompt clause; distinct from the REMOVED malware reminder; SURVIVES) | cli_inner_pretty.js:555397-555398 | constant |
| (literal) | auto-memory SR clause #1 (`Recalled memories appearing inside <system-reminder> blocks…`) | cli_inner_pretty.js:144507 | string |
| (literal) | auto-memory SR clause #2 (`Tool results may include additional <system-reminder> blocks…`) | cli_inner_pretty.js:144564 | string |

---

## Cross-version notes (v2.1.142 → v2.1.156)

### Renames / relocations (same behavior, new obfuscated name + line)

| Readable | 2.1.142 obf @ line | 2.1.156 obf @ line |
|----------|--------------------|--------------------|
| `wrapInSystemReminder` (multiline string wrap) | `h2` @ 424714 | `S0` @ 445237 |
| `wrapMessagesInSystemReminder` (list wrap) | `o_` @ 424748 | `C_` @ 445299 |
| `createUserMessage` (isMeta factory) | `w8` @ 423394 | `T8` @ 443846 |
| `extractSystemReminderContent` (pass-through) | `Wq4` @ 424719 | `fi6` @ 445242 |
| `extractSystemReminderContent` (null variant / telemetry) | `nD6` @ 241477 | `JN6` @ 271456 |
| `stripLeadingReminders` | `Nq4` @ 423281 | `PG4` @ 443733 |
| `stripAllReminders` (regex) | `vQ4` @ 566114 | `OD9` @ 614580 |
| `REMINDER_CLOSE_TAG` (`"</system-reminder>"`) | `sM4` @ 467574 | `Nm4` @ 495652 |
| `ensureSystemReminderWrap` | `Az5` @ 423911 | `DQ_` @ 444371 |
| `smooshSystemReminderSiblings` | `mq4` @ 423924 | `hG4` @ 444384 |
| `smooshIntoToolResult` | `WR6` (referenced) | `Ai6` @ 444756 |
| `normalizeAttachmentForAPI` (dispatcher) | `CI6` @ 424960 | `kc6` @ 445425 |
| `PER_TYPE_RENDERERS` (renderer registry) | `Tq4` (registry) | `DG4` @ 446557 |
| `getAttachmentMessages` (collectAttachments) | `p65` @ 397549 | `Aw4` @ 412660 |
| `runAttachmentGenerator` | `aY` @ 397620 | `E3` @ 412739 |
| `getQueuedCommandAttachments` | `sO8` @ 397643 | `gV$` @ 412764 |
| `TODO_REMINDER_CONFIG` (10/10) | `aO8` @ 398821 (`REMINDER_THRESHOLDS`) | `QV$` @ 414014 |
| `PLAN_MODE_ATTACHMENT_CONFIG` (5/5) | `Is7` @ 398822 (`PLAN_REMINDER_THRESHOLDS`) | `lg6` @ 414015 |
| `VERIFY_PLAN_REMINDER_CONFIG` (10) | `zw4`-shape (was `B65` `MEMORY_REMINDER_THRESHOLD`) | `zw4` @ 414018 |
| `prependCachedContextReminder` (CLAUDE.md block) | `EO8` @ 524243 | `KV8` @ 556126 |
| SR-convention system-prompt clause | (`_m5` builder) @ 523574 | `gXz` builder @ 555453 |
| `runSideQuestion` | `$D8` @ 427848 | `MV8` @ 454122 |
| Team-shutdown reminder const | `gH9` @ 604170 | `YT9` @ 642102 |
| Container-restart reminder | `Tl4` @ 575292 | `DL9` @ 623996 |

### NEW in v2.1.156 (no 2.1.142 equivalent symbol, or genuinely new feature)

- **Mid-conversation `role:"system"` subsystem** (entire module above): `_h` beta (98142), `XH8` capability check (130520), `SQ_`/`RQ_` api_system factory/extractor (445274/445282), `D0` normalizer + `w` flush (444461/444492), `xP6` reject detector (186567), `aI$`/`g3q`/`am8` sticky-beta state (1938/1941/3264), and the `api_system` branch added to the telemetry split `Uc5` (271459) and span setter `iv7` (271500). 2.1.88 baseline has NONE of this.
- **Two new config objects** at 414016-414017: `Kw4`=`ULTRA_EFFORT_CONFIG` (`{TURNS_BETWEEN_MAINTENANCE:10}`) and `_w4`=`RELEVANT_MEMORIES_CONFIG` (`{MAX_SESSION_BYTES:61440}`).
- **New attachment cases**: `workflow_keyword_request` (446731), `ultra_effort_enter` (446739), `ultra_effort_exit` (446749) — the "Ultracode"/"Workflow" vocabulary is 2.1.156-new.
- **New inline cloud/remote SR strings**: three ultraplan remote-planning prompt modules `p4z`/`U4z`/`F4z` (503303/503324/503348), each containing the `"__ULTRAPLAN_TELEPORT_LOCAL__"` handoff sentinel; gh rate-limit reminder `tV7` (269428); container-restart reminder `DL9` (623996).
- **`AMBIENT_CONTEXT_TRAILER` (`yT8`, 446489)** hoisted to a shared const and now appended to `deferred_tools_delta`, `agent_listing_delta`, `mcp_instructions_delta`, and `memory_update` removed-branches (in 2.1.142 the same sentence was inlined per-case).
- **`fn` (`stripAllTagsForPreview`, 614583)** — layers a generic `<tag>` strip on top of `OD9` for one-line UI previews.

### Slimming-related REMOVALS / shortenings (the headline 2.1.156 changes)

- **Per-Read malware reminder FULLY REMOVED.** The 2.1.88 `CYBER_RISK_MITIGATION_REMINDER` (`FileReadTool.ts:729`, appended to EVERY non-empty Read result) — together with `shouldIncludeFileReadMitigation()` and `MITIGATION_EXEMPT_MODELS` — is GONE. Verified `grep -c -i malware` over the whole 2.1.156 bundle = **0**. The Read content-builder at 422933-422940 has no mitigation term. The **distinct** `CYBER_RISK_INSTRUCTION` system-prompt clause (`gKq` @ 555397, about authorized security testing) is a DIFFERENT surface and STILL PRESENT.
- **`todo_reminder` / `task_reminder` dropped the trailing "NEVER mention" sentence.** 2.1.88 ended both with "…ignore if not applicable. Make sure that you NEVER mention this reminder to the user". 2.1.156 ends both at "…ignore if not applicable." (todo @ 445514, task @ 445528). The centralised `yT8` ambient-context trailer is the system's replacement strategy.
- **Thinking-frequency reminder REMOVED on both surfaces.** The 2.1.142 system-prompt clause ("respond without a thinking block… tune your thinking frequency… on simpler user messages") is GONE — `grep -c "respond without a thinking block"` = **0**. The `thinking_reminder` attachment type is now in the noop allow-list (445800, `return []`). Both the prompt clause and the rendered SR text are dropped.
- **Several generators NEUTERED (render kept, emission disabled):** `teammate_mailbox` gen `hR_` returns `[]` (413856); `output_token_usage` gen `IR_` returns `[]` (413877); `verify_plan_reminder` gen `bR_` returns `[]` (413895). The renderer cases survive but are unreachable via the collect path — feature-staged / dead-code.
- **`context_efficiency` hardened to a bare `return []`** (445671): the 2.1.88 `HISTORY_SNIP`/`SNIP_NUDGE_TEXT` feature branch is removed.
- **`auto_mode` collapsed** from a full/sparse (and per the 2.1.142 catalogue, "once") cadence-driven selector to ONE short prose message (445591); the 6-point numbered safety body was dropped from the reminder.

### Unchanged (text + behavior stable across all three versions)

- The wrap/strip/extract primitive shapes (`S0`, `C_`, `PG4`, `fi6`/`JN6`, `OD9`, `Ai6`, `DQ_`, `hG4`), the `tengu_chair_sermon` smoosh gate, the dual-gate 10/10 todo/task cadence, the master collectAttachments gate (queued-commands-survive-disable), and the 1s generator budget.
- Inline strings: Read empty/short-file warnings (422944/422945), side-question prompt (454123-454138), CLAUDE.md session-start block (556130-556139), stale-memory marker (221258-221269), the SR-convention system-prompt clause (555453), brief-mode toggle (527818-527820), team-shutdown reminder (642102-642114).
- Renderer cases: `plan_mode_reentry`, `plan_mode_exit`, `auto_mode_exit`, `mcp_resource`, `task_status` (all three branches), `date_change`, `diagnostics`, `file`/`directory`/`compact_file_reference`/`pdf_reference`/`edited_text_file`, `skill_listing`, `nested_memory`, `critical_system_reminder`, hook_* sibling renderers.

## Confidence

All mappings above were Read/grep-verified directly against `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (not copied from the 2.1.142 reference). Cross-validation against the 2.1.88 TS baseline is by readable name. High confidence for the wrap/strip/extract primitives, dispatcher, generator pool, thresholds, telemetry split, and mid-conv-system subsystem (all bodies inspected). Medium confidence only for the handful of symbols cited by referenced-at line rather than definition line (`R7`, `xH`, `$s`, `XN6`, `cd`, `eY`, `l4`, `CQ_`, `Li6`) — their identity is inferred from call-site usage. See `41_system_reminder/` for the per-claim deep analysis and `cross_validation.md` for confidence ratings.
