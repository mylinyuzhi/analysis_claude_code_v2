# 41 — `<system-reminder>` Subsystem (v2.1.156)

> **Module**: `41_system_reminder/` — Cross-cutting analysis of Claude Code's `<system-reminder>` mechanism: how harness-side instructions reach the model in-band, without being mistaken for user input, and without invalidating the cached prompt prefix.
> **Bundle (PRIMARY object of analysis)**: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines, single file). Every 2.1.156 line number in this module was Read/grep-verified against this bundle.
> **TypeScript reference (cross-validation by readable name ONLY)**: `/lyz/codespace/3rd/claude-code/src` — `utils/messages.ts`, `utils/attachments.ts`, `utils/transcriptSearch.ts`, `components/messageActions.tsx`, `utils/telemetry/betaSessionTracing.ts` (2.1.88 baseline — same shape, fewer reminder types, and the larger per-Read malware reminder that 2.1.156 deletes).
> **Adjacent module**: `04_tools/reminder_interaction.md` covers reminders that ride alongside *tool* calls. This module documents the **mechanism** itself across all surfaces (tools, modes, hooks, memory, compaction, IDE, side-questions, container restarts, remote planning, etc.).

## What this module covers

A `<system-reminder>…</system-reminder>` block is the canonical way Claude Code injects mid-conversation guidance into a user-turn payload without confusing the model into treating it as a user instruction. Reminders are **everywhere** in v2.1.156: 36 literal `<system-reminder>` source occurrences (`grep -c '<system-reminder>'` = 36), 30+ attachment renderer cases across a map+switch dispatcher, four wrap helpers, three strip helpers, two extract/unwrap copies, dedicated cache/telemetry handling, a 1-second-budgeted parallel generator pool, and a fallback re-wrap pass that guarantees no raw attachment text leaks to the model.

This module decomposes that surface into:

| File | Topic |
|------|-------|
| `README.md` (this file) | Architecture overview, design rationale, the wrap/strip primitives, where reminders fit in the request pipeline |
| `runtime_lifecycle.md` | The full lifecycle: attachment generation → wrap → ensure-wrap → smoosh → API → strip — the multi-pass normalization pipeline |
| `attachment_catalogue.md` | Every reminder type (30+ dispatcher cases + inline emit sites) with rendered text, trigger condition, and emit location |
| `ui_handling.md` | UI suppression: `isMeta`, `isVisibleInTranscriptOnly`, transcript-search strip, sticky-prompt strip, copy-text strip |
| `telemetry_and_cache.md` | Telemetry separation (`tengu_attachment_compute_duration` sampling), cache-prefix implications, mid-conv-system fallback, extract-for-tracing |
| `token_slimming_v2_1_156.md` | **What changed since 2.1.88** — the per-Read malware removal, the "NEVER mention" drops, the `auto_mode` rewrite, the `yT8` hoist, and the offsetting expansions |
| `cross_validation.md` | Side-by-side mapping of obfuscated 2.1.156 names to the v2.1.88 TypeScript source |

## The core problem — three audiences, one payload

Without reminders, the harness has only two ways to talk to the model mid-conversation:

1. **Edit the system prompt** — but mutating the prompt invalidates the cached prefix on every turn, costing tokens and latency. Some shapes (`role:"system"` in the messages array) are also rejected by the API.
2. **Speak as the user** — but then the model can't tell harness directives ("you've used 80% of your context") from user instructions ("ignore the budget").

A reminder solves both: it's text **inside** a user-role message body (so the cached prefix stays valid) but wrapped in `<system-reminder>…</system-reminder>` tags **the model is taught to recognize** as out-of-band. The system prompt explicitly establishes the convention (verified verbatim):

> "Tool results and user messages may include `<system-reminder>` or other tags. Tags contain information from the system. They bear no direct relation to the specific tool results or user messages in which they appear." — system prompt clause at `cli_inner_pretty.js:555453` (inside the `# System` builder `gXz`).

The same `UserMessage` carrying `<system-reminder>` content reaches **three** consumers, and one text payload feeds all three:

1. **The model** — full text, treated as ambient harness instruction.
2. **The UI** — suppressed entirely via the `isMeta:true` flag on the message envelope (`createUserMessage` / `T8` at `cli_inner_pretty.js:443846-443883`); only the *primary* tool_result / user prompt is rendered.
3. **The telemetry / transcript-search pipeline** — reminders are stripped out (`stripAllReminders` / `OD9` at `cli_inner_pretty.js:614580-614581`) or extracted into a separate field (`extractSystemReminderContent` / `fi6` at `cli_inner_pretty.js:445242-445245`, history-format copy `JN6` at `cli_inner_pretty.js:271456-271458`) so observability dashboards and search don't count harness chrome as "what the user typed."

There is **no separate "reminder track" or "system message channel"** — reminders are just specially-tagged user-role text. That is the central design decision, and the rest of the subsystem is the machinery that makes one tagged-text payload safe to share across all three audiences.

## Architecture diagram

```
                ┌──────────────────────────────────────────────────────┐
                │        Per-turn attachment generator pool             │
                │   collectAttachments (Aw4) @412660-412738             │
                │   MASTER GATE @412662: DISABLE_ATTACHMENTS / SIMPLE   │
                │   → only queued-command attachments survive (gV$)     │
                │   else: ~30 E3()-wrapped generators in 2 parallel     │
                │   waves under a 1s abort budget (setTimeout @412664)  │
                └────────────┬─────────────────────────────────────────┘
                             │ list[Attachment]  (each has a `type`)
                             ▼
                ┌──────────────────────────────────────────────────────┐
                │        Attachment normaliser (kc6) @445425-445808     │
                │   3 tiers:                                            │
                │   1. agent-swarm early exit (teammate_mailbox,        │
                │      team_context) when R7()                          │
                │   2. per-type renderer map  DG4  @446557-446767       │
                │   3. inline switch(H.type)  @445462-445790            │
                │   each case → C_([T8({content, isMeta:true})])        │
                └────────────┬─────────────────────────────────────────┘
                             │ list[UserMessage] (text already S0-wrapped)
                             ▼
                ┌──────────────────────────────────────────────────────┐
                │   Reminder envelope wrapper  C_  @445299-445312       │
                │   maps over messages, wraps each string/text part via │
                │     S0 → <system-reminder>\n…\n</system-reminder>     │
                │   (image / document / tool_use parts pass untouched)  │
                └────────────┬─────────────────────────────────────────┘
                             │
                             ▼
                ┌──────────────────────────────────────────────────────┐
                │   Message-stream normaliser (final API-prep pass)     │
                │   • ensureSystemReminderWrap  DQ_  @444371-444382      │
                │       idempotent re-wrap; returns SAME object if       │
                │       nothing changed (referential identity)          │
                │   • smooshSystemReminderSiblings  hG4 @444384-444402   │
                │       folds SR-prefixed text into the last tool_result │
                │       via Ai6; driver VQ_ gated by tengu_chair_sermon  │
                └────────────┬─────────────────────────────────────────┘
                             │
                             ▼
        ┌────────────────────┴───────────────────────┐
        ▼                                             ▼
┌─────────────────────┐                   ┌─────────────────────────┐
│   API request       │                   │      UI / search        │
│   (Anthropic)       │                   │  isMeta=true → not shown │
│   raw text incl.    │                   │  sticky prompt:          │
│   <system-reminder> │                   │   PG4 stripLeading       │
│   tags reach the    │                   │  transcript/preview:     │
│   model             │                   │   OD9 stripAll / index   │
│                     │                   │   loop using Nm4         │
└─────────────────────┘                   └─────────────────────────┘
```

### Key insight — idempotency is what lets one payload serve all three

Because the wrap is *idempotent*, the same `UserMessage` can be transformed by merges, splits, and resumes without ever double-wrapping or stranding a raw block:

- `ensureSystemReminderWrap` (`DQ_`) skips text already starting with `<system-reminder>` and re-wraps only what is raw.
- `extractSystemReminderContent` (`fi6`) safely unwraps any string *wholly* enclosed in tags (anchored `^…$`), returning the original on no-match.
- `stripLeadingReminders` (`PG4`) and the strip-all variants (`OD9`, the `Nm4` index loop) remove tags for the UI/search consumers.

No transform needs to know whether a previous transform already wrapped — every primitive is a no-op on already-correct input. This is why there is no central "reminder registry": the tags themselves are the state.

## The wrap/extract primitives (4 wrap, 2 extract)

```javascript
// ============================================
// wrapInSystemReminder (S0) — the canonical multiline envelope
// Location: cli_inner_pretty.js:445237-445241
// ============================================

// ORIGINAL (for source lookup):
function S0(H) {
  return `<system-reminder>
${H}
</system-reminder>`;
}

// READABLE (for understanding):
function wrapInSystemReminder(text) {
  // VERBATIM shape: newline BEFORE and AFTER the content.
  // <system-reminder>\n${text}\n</system-reminder>
  return `<system-reminder>\n${text}\n</system-reminder>`;
}

// Mapping: S0→wrapInSystemReminder, H→text
```

```javascript
// ============================================
// wrapMessagesInSystemReminder (C_) — list[UserMessage] → list[wrapped]
// Location: cli_inner_pretty.js:445299-445312
// ============================================

// ORIGINAL (for source lookup):
function C_(H) {
  return H.map(($) => {
    if (typeof $.message.content === "string")
      return { ...$, message: { ...$.message, content: S0($.message.content) } };
    else if (Array.isArray($.message.content)) {
      let q = $.message.content.map((K) => { if (K.type === "text") return { ...K, text: S0(K.text) }; return K; });
      return { ...$, message: { ...$.message, content: q } };
    }
    return $;
  });
}

// READABLE (for understanding):
function wrapMessagesInSystemReminder(messages) {
  // Wrap every string content / text block via S0; pass image/document/tool_use untouched.
  // This is THE helper nearly every dispatcher case calls: C_([T8({content, isMeta:true})]).
  return messages.map((m) => {
    if (typeof m.message.content === "string")
      return { ...m, message: { ...m.message, content: wrapInSystemReminder(m.message.content) } };
    if (Array.isArray(m.message.content)) {
      const parts = m.message.content.map((part) =>
        part.type === "text" ? { ...part, text: wrapInSystemReminder(part.text) } : part);
      return { ...m, message: { ...m.message, content: parts } };
    }
    return m;
  });
}

// Mapping: C_→wrapMessagesInSystemReminder, S0→wrapInSystemReminder, H→messages, $→m, q→parts, K→part
```

```javascript
// ============================================
// extractSystemReminderContent (fi6) — unwrap a wholly-tagged string
// Location: cli_inner_pretty.js:445242-445245
// ============================================

// ORIGINAL (for source lookup):
function fi6(H) {
  let $ = /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/.exec(H);
  return $ ? $[1] : H;
}

// READABLE (for understanding):
function extractSystemReminderContent(text) {
  // The ^…$ anchors enforce "whole string"; optional \n? on both sides tolerates
  // both S0's multiline form and the single-line memory form (Az7).
  // Returns the inner content, or the ORIGINAL string when not wholly wrapped.
  const m = /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/.exec(text);
  return m ? m[1] : text;
}

// Mapping: fi6→extractSystemReminderContent, H→text, $→m
```

**The four wrap helpers and why each exists:**

- `wrapInSystemReminder` (`S0`, `445237`) — the literal multiline string concat. The base building block used by everything else and by the `S0`-wrapping inline emitters (`token_usage`/`budget_usd` at `446683`/`446686`, hook strings, etc.). Byte-identical to 2.1.88 `wrapInSystemReminder` (`messages.ts:3097-3099`).
- `wrapMessagesInSystemReminder` (`C_`, `445299`) — the per-message list helper. Each dispatcher case returns `C_([T8({content, isMeta:true})])`, guaranteeing a well-formed reminder envelope at attachment-generation time. Byte-identical to 2.1.88 `wrapMessagesInSystemReminder` (`messages.ts:3101`).
- `ensureSystemReminderWrap` (`DQ_`, `444371`) — the idempotent final-pass safety net (see below).
- `wrapMemoryAgeReminder` (`Az7`, `221264-221269`) — a **single-line** variant (`<system-reminder>${text}</system-reminder>\n`, NO internal newlines) used only for the short memory-age marker, so the staleness prefix glued ahead of a memory body doesn't inject blank lines into the block. This is a distinct helper from `S0`; the task brief's "single-line wrap+extract" hint conflates two things — `Az7` is **wrap-only** (it does not extract); extraction is `fi6`/`JN6`.

The two extract copies differ only in their no-match convention: `fi6` (`445242`) returns the **original** string on no-match (used by the Chrome browser-batch dedup path); `JN6` (`271456-271458`) trims and returns **null** on no-match (the telemetry/history-format convention, matching 2.1.88 `extractSystemReminderContent` in `betaSessionTracing.ts:149`).

## The three strip primitives (and where each fires)

```javascript
// ============================================
// stripLeadingReminders (PG4) — strip reminders only from the start
// Location: cli_inner_pretty.js:443733-443740
// ============================================

// ORIGINAL (for source lookup):
function PG4(H) {
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
  // Repeatedly peel any leading <system-reminder>…</system-reminder> block
  // (18 = "</system-reminder>".length) until what remains starts with something else.
  // Unterminated tag → break (leave as-is). Used by the UI sticky-prompt / copy-text
  // computer: leading reminders are harness context, not "what the user typed".
  let s = text.trimStart();
  while (s.startsWith("<system-reminder>")) {
    const end = s.indexOf("</system-reminder>");
    if (end < 0) break;
    s = s.slice(end + "</system-reminder>".length).trimStart();
  }
  return s;
}

// Mapping: PG4→stripLeadingReminders, H→text, q→s, K→end
```

```javascript
// ============================================
// stripAllReminders (OD9) — regex-strip ANY reminder/task-notification slice
// Location: cli_inner_pretty.js:614580-614581
// ============================================

// ORIGINAL (for source lookup):
function OD9(H) {
  return H.replace(/<(system-reminder|task-notification)>[\s\S]*?(<\/\1>|$)/g, " ");
}

// READABLE (for understanding):
function stripAllReminders(text) {
  // Replace every <system-reminder>…</system-reminder> OR
  // <task-notification>…</task-notification> slice with a single space.
  // (<\/\1>|$) lets an unterminated trailing tag be nuked too.
  // Used by the transcript-search / preview normaliser (wrapped by fn @614583).
  return text.replace(/<(system-reminder|task-notification)>[\s\S]*?(<\/\1>|$)/g, " ");
}

// Mapping: OD9→stripAllReminders, H→text
```

**Why three strip helpers (not one):**

- `stripLeadingReminders` (`PG4`) is for the *sticky prompt* — the UI walks the rendered message list to find the user's last real prompt; leading reminders (auto-memory recalls, mode reentries) get peeled, but mid-prompt occurrences never appear in a real prompt, so the cheap `startsWith` check suffices. Byte-for-byte equivalent of 2.1.88 `stripSystemReminders` (`messageActions.tsx:399-408`).
- `stripAllReminders` (`OD9`) is the regex strip-ANYWHERE that replaces each slice with a **space** — used for the search/preview normaliser where reminders can appear mid-text (dense on `cc -c` resumes).
- The `Nm4` index-loop strip (`495597-495605`, const `Nm4 = "</system-reminder>"` at `495652`) is a second strip-ANYWHERE that splices each slice out **without** inserting a space (`indexOf("<system-reminder>")` → find `Nm4` close → splice → repeat). It mirrors 2.1.88's `transcriptSearch.ts:117-127` `while(open>=0)` loop using `SYSTEM_REMINDER_CLOSE`. 2.1.156 keeps *both* strip-all forms because their outputs differ (space vs. nothing) and they serve different call sites.

## The ensure-wrap + smoosh region (`444371-444402`)

These two helpers run in the final API-prep pass and are the reason a forgotten wrap or a stray reminder sibling never reaches the model wrong.

```javascript
// ============================================
// ensureSystemReminderWrap (DQ_) — idempotent re-wrap, identity-preserving
// Location: cli_inner_pretty.js:444371-444382
// ============================================

// ORIGINAL (for source lookup):
function DQ_(H) {
  let $ = H.message.content;
  if (typeof $ === "string") {
    if ($.startsWith("<system-reminder>")) return H;
    return { ...H, message: { ...H.message, content: S0($) } };
  }
  let q = !1,
    K = $.map((_) => {
      if (_.type === "text" && !_.text.startsWith("<system-reminder>")) return ((q = !0), { ..._, text: S0(_.text) });
      return _;
    });
  return q ? { ...H, message: { ...H.message, content: K } } : H;
}

// READABLE (for understanding):
function ensureSystemReminderWrap(message) {
  let content = message.message.content;
  if (typeof content === "string") {
    if (content.startsWith("<system-reminder>")) return message;              // already wrapped → identity
    return { ...message, message: { ...message.message, content: wrapInSystemReminder(content) } };
  }
  let changed = false;
  const parts = content.map((part) => {
    if (part.type === "text" && !part.text.startsWith("<system-reminder>")) {
      changed = true;
      return { ...part, text: wrapInSystemReminder(part.text) };
    }
    return part;
  });
  // Return the SAME object when nothing changed → preserves referential identity for
  // downstream merges (so a no-op pass doesn't churn caches or break === comparisons).
  return changed ? { ...message, message: { ...message.message, content: parts } } : message;
}

// Mapping: DQ_→ensureSystemReminderWrap, S0→wrapInSystemReminder, H→message, $→content, q→changed, K→parts, _→part
```

**Why a final-pass re-wrap (`DQ_`) on top of per-case wrapping (`C_`):** Each dispatcher case already wraps via `C_`, but the merge/normalize passes (smoosh, queued-command concatenation, attachment append) can splice a raw text block in next to an already-wrapped one. `DQ_` is the safety net that guarantees *every* attachment-origin text block is wrapped before the API call, while its `changed` flag preserves object identity on no-op so it doesn't needlessly churn the message graph. Byte-for-byte identical to 2.1.88 `ensureSystemReminderWrap` (`messages.ts:1797-1816`).

`smooshSystemReminderSiblings` (`hG4`, `444384-444402`) partitions a user message's content into SR-prefixed text vs. the rest, then folds the SR text **into the last tool_result** via `smooshIntoToolResult` (`Ai6`, `444756-444785`). The merge driver `mergeUserMessagesAndToolResults` (`VQ_`, `444787-444803`) gates the universal fold behind Statsig `tengu_chair_sermon` (OFF → legacy string-only fold; ON → fold all non-tool_result blocks into the last tool_result). `Ai6` returns `null` — declining to fold — when the tool_result content holds a `tool_reference`/beta block (`q.some($s)`), so the caller leaves it untouched. All three match 2.1.88 (`messages.ts:1835`, `:2534`, `:2616-2646`) and the gate name is unchanged.

## Where reminders come from — the parallel generator pool

`collectAttachments` (`Aw4`, `cli_inner_pretty.js:412660-412738`) is the centralised entry point that runs every reminder generator before each request:

```javascript
// ============================================
// collectAttachments (Aw4) — master gate + 1s-budgeted parallel generator pool
// Location: cli_inner_pretty.js:412660-412738
// ============================================

// ORIGINAL (for source lookup):
async function Aw4(H, $, q, K, _, z, A) {
  let Y = Bf($.options.mainLoopModel);
  if (xH(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || xH(process.env.CLAUDE_CODE_SIMPLE)) return gV$(K, Y);
  let f = C4(), O = setTimeout((Z) => Z.abort(), 1000, f), M = { ...$, abortController: f }, j = !$.agentId;
  /* … two waves of E3()-wrapped generators … */
}

// READABLE (for understanding):
async function collectAttachments(hasUserMessage, ctx, /*…*/ queuedCommands, transcript, /*…*/) {
  const model = resolveModel(ctx.options.mainLoopModel);
  // MASTER GATE: in headless/SDK mode, emit ONLY queued-command attachments — drop all harness chrome.
  if (isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE))
    return getQueuedCommandAttachments(queuedCommands, model);
  const abort = makeAbortController();
  const timer = setTimeout((c) => c.abort(), 1000, abort);   // 1-second total budget for all generators
  const isMainAgent = !ctx.agentId;                          // subagents get the reduced set
  // … always-run wave J  +  main-agent-only wave X (IDE, diagnostics, token/budget, memory_update, verify_plan)
  // … each generator wrapped by runAttachmentGenerator (E3) for per-generator try/catch + 5% timing telemetry
  // return [...mentions, ...J, ...X].filter(nonNull)
}

// Mapping: Aw4→collectAttachments, gV$→getQueuedCommandAttachments, xH→isEnvTruthy,
//          E3→runAttachmentGenerator, j→isMainAgent, Bf→resolveModel
```

Three properties of this pool matter to the reminder design:

1. **Master gate @412662** — `CLAUDE_CODE_DISABLE_ATTACHMENTS` / `CLAUDE_CODE_SIMPLE` short-circuit to `getQueuedCommandAttachments` (`gV$`) only. Headless/SDK mode strips all harness reminders but must keep queued commands (and `task-notification` events) flowing. (Do **not** conflate this with the narrower agent-list gate `Fv6` at `240488`, which only controls the agent-listing attachment.)
2. **1-second abort budget @412664** — `setTimeout((c)=>c.abort(),1000,abort)` caps total generator latency. Slow generators (LSP diagnostics, git changed-files, CLAUDE.md walk) abort rather than dominate request latency. Each generator is wrapped by `runAttachmentGenerator` (`E3`, `412739-412763`) which catches per-generator errors (one failure ≠ the whole reminder set lost) and samples `tengu_attachment_compute_duration` telemetry at 5%.
3. **Main-agent-only flag `j = !$.agentId` @412666** — subagents receive a reduced set; the IDE-selection, diagnostics, token/budget, `memory_update`, and `verify_plan_reminder` generators run only for the main agent, since those would be irrelevant or misleading inside a `Task` invocation.

The dispatcher (`normalizeAttachmentForAPI` / `kc6`, `445425-445808`) then routes each attachment `type` to a renderer (the `DG4` map at `446557-446767`, or the inline switch) that builds the reminder text and wraps it via `C_`. See `attachment_catalogue.md` for every case.

## ⭐ What changed since 2.1.88 — token slimming

> **Headline**: 2.1.156's reminder evolution is **NOT** a blanket "everything got shorter." It is one decisive high-frequency removal, a disciplined trim of per-event restatements of *global* policy, and a centralizing refactor — **partially offset** by correctness-driven expansions and new cloud/remote surfaces. Outside Read-heavy sessions the net byte movement can be flat or slightly positive. The full accounting (with per-reminder token deltas and rationale) is in **[`token_slimming_v2_1_156.md`](token_slimming_v2_1_156.md)**.

The four movements, at a glance:

1. **The dominant win — per-Read malware reminder fully removed.** 2.1.88 appended a multiline `CYBER_RISK_MITIGATION_REMINDER` (`FileReadTool.ts:729-730`, gated by `shouldIncludeFileReadMitigation()` with `MITIGATION_EXEMPT_MODELS = {claude-opus-4-6}`) to the END of **every** non-empty file Read result. Because each Read tool_result re-bills in the prompt on every subsequent turn, this was — by a wide margin — the most expensive *repeated* reminder in the system (~90-100 tok × Reads × remaining turns). In 2.1.156 it is **gone with zero traces**: `grep -c -i malware` = **0**. The replacement builder at `cli_inner_pretty.js:422933-422940` has no mitigation arm — only the memory-freshness prefix `K`, then `Bb_(H)` (formatFileLines) + `ub_(H.file)` (line-format instruction). 2.1.88 had already conceded the cost was model-dependent (it exempted `claude-opus-4-6`); 2.1.156 generalizes the exemption to "always off" and deletes the constant, gate, and exempt set.

2. **Per-reminder restatements of global policy trimmed.** `todo_reminder` (`445514`) and `task_reminder` (`445528`) both dropped their trailing "Make sure that you NEVER mention this reminder to the user" (verified gone: `grep -c -i "NEVER mention this reminder"` = **0**, vs. 2× in 2.1.88's `messages.ts:3668`/`:3688`). The `auto_mode` reminder (`445594-445596`) was rewritten from a 6-point numbered policy list down to one short prose paragraph — items 5 (destructive-action confirmation) and 6 (data-exfiltration) merely duplicated global safety rules. The thinking-frequency surface was dropped entirely: both the system-prompt clause (`grep` for "respond without a thinking block / tune your thinking frequency" = **0**) and the `thinking_reminder` attachment (now an inert `return []` in the noop allow-list at `445800`).

3. **The `yT8` hoist — the structural enabler.** Rather than baking "don't mention this to the user" into every reminder body, 2.1.156 defines ONE shared constant `yT8` ("This is ambient context — do not narrate it to the user unless they ask or it is directly relevant to their request.", `cli_inner_pretty.js:446489-446490`), appended once to the removed-branches of `deferred_tools_delta`, `agent_listing_delta`, `mcp_instructions_delta`, and to `memory_update`. Centralization replaces N inline copies with one trailer used where it actually matters — and lets the high-frequency reminders (todo/task) drop the rule entirely, since the global system-prompt convention (`555453`) already covers it.

4. **Counter-current — several reminders GREW, and new surfaces appeared.** `invoked_skills` (+~70 tok, post-compaction replay safety), `relevant_memories` (+~12 tok, recall-uncertainty signal), `deferred_tools_delta` (+~40 tok, "schemas NOT loaded… InputValidationError" guidance + new `readded`/`pending` states), `queued_command` task-notification (+~30 tok), and `team_context` (+~25 tok) all expanded for **correctness**, not economy. Entirely new reminder surfaces were added for cloud/remote execution: the `gh` rate-limit reminder (`269428`), the container-restart reminder (`623996-624002`), three ultraplan remote-planning prompt modules (`p4z`@`503303`, `U4z`@`503324`, `F4z`@`503348`), and the `memory_update` reminder (`445768`).

**The single most important distinction:** the removed per-Read malware `<system-reminder>` (`CYBER_RISK_MITIGATION_REMINDER`) and the surviving system-prompt clause `CYBER_RISK_INSTRUCTION` (`cli_inner_pretty.js:555397-555398`, const `gKq`) are **DIFFERENT THINGS**. The former (a per-Read tool_result suffix about "do not improve malware") is fully removed. The latter (a system-prompt sentence about "authorized security testing vs. malicious requests") is byte-identical and still wired into the prompt. Removing the first did not remove the second.

## When reminders are *not* emitted

Three suppression paths matter (verified against `Aw4`):

1. **`CLAUDE_CODE_DISABLE_ATTACHMENTS` / `CLAUDE_CODE_SIMPLE`** env vars short-circuit `collectAttachments` to emit only queued-command attachments (master gate, `412662`). Used in headless/SDK mode where the harness chrome would be noise — but queued commands and `task-notification` events still flow.
2. **Subagents** receive the reduced always-run wave only; the main-agent-only wave (`j = !$.agentId` at `412666`) — IDE selection, diagnostics, token/budget, `memory_update`, `verify_plan_reminder` — is skipped.
3. **Dual-gate cadence on nag-style reminders** — `todo_reminder` and `task_reminder` fire only when `turnsSinceLastWrite >= 10 AND turnsSinceLastReminder >= 10` (gates `vR_`@`413746` and `NR_`@`413782` against `QV$ = {TURNS_SINCE_WRITE:10, TURNS_BETWEEN_REMINDERS:10}`, `414014`). The `&&` means a model that ignored a prior reminder still waits a full 10-turn window before being prodded again, preventing nag-spam.

## Reading order

| Goal | Start here |
|------|------------|
| "What reminder fires when X happens?" | `attachment_catalogue.md` |
| "How does a reminder go from emit to model context?" | `runtime_lifecycle.md` |
| "Why doesn't the user see them?" | `ui_handling.md` |
| "How do reminders affect token cost / cache?" | `telemetry_and_cache.md` |
| "What got slimmed / expanded since 2.1.88?" | `token_slimming_v2_1_156.md` |
| "Verify the obfuscated→readable mapping" | `cross_validation.md` |
| "Tool-specific reminders only" | `../04_tools/reminder_interaction.md` |

## Related modules

- `04_tools/reminder_interaction.md` — tool-adjacent reminders (TodoWrite nudge, Read empty/short-file warnings, ToolSearch `deferred_tools_delta`)
- `07_compact/` — reminder lifecycle through compaction (`invoked_skills` replay vs. strip)
- `11_hooks/` — `hook_success`, `async_hook_response`, `hook_additional_context` reminder paths
- `12_plan_mode/` — `plan_mode`, `plan_mode_reentry`, `plan_mode_exit`, `verify_plan_reminder`, the three ultraplan remote prompts
- `31_auto_memory/` — `relevant_memories`, `memory_update`, `nested_memory`, the stale-memory marker
- `34_subagent/` — subagent's reduced reminder set
- `36_background_agents/` — `task_status` reminder, container-restart reminder

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - v2.1.156 additions: [symbol_additions_v2_1_156_system_reminder.md](../00_overview/symbol_additions_v2_1_156_system_reminder.md)

Key functions in this module (verified against `cli_inner_pretty.js`):

- `wrapInSystemReminder` (obfuscated: `S0`) - Multiline `<system-reminder>\n…\n</system-reminder>` envelope (`445237-445241`)
- `wrapMessagesInSystemReminder` (obfuscated: `C_`) - List wrap helper called by every dispatcher case (`445299-445312`)
- `ensureSystemReminderWrap` (obfuscated: `DQ_`) - Idempotent, identity-preserving final-pass re-wrap (`444371-444382`)
- `wrapMemoryAgeReminder` (obfuscated: `Az7`) - Single-line wrap for the memory-age marker (`221264-221269`)
- `extractSystemReminderContent` (obfuscated: `fi6`) - Unwrap a wholly-tagged string; returns original on no-match (`445242-445245`)
- `extractSystemReminderContent` history-fmt copy (obfuscated: `JN6`) - Trims + returns null on no-match (`271456-271458`)
- `stripLeadingReminders` (obfuscated: `PG4`) - Peel leading reminder blocks for the sticky prompt (`443733-443740`)
- `stripAllReminders` (obfuscated: `OD9`) - Regex-strip any reminder/task-notification slice → space (`614580-614581`)
- `SYSTEM_REMINDER_CLOSE` (obfuscated: `Nm4`) - `"</system-reminder>"` const for the index strip loop (`495652`; loop `495597-495605`)
- `smooshSystemReminderSiblings` (obfuscated: `hG4`) - Fold SR-text into the last tool_result (`444384-444402`)
- `smooshIntoToolResult` (obfuscated: `Ai6`) - The actual fold; returns null when a tool_reference forbids it (`444756-444785`)
- `mergeUserMessagesAndToolResults` (obfuscated: `VQ_`) - Smoosh driver, gated by `tengu_chair_sermon` (`444787-444803`)
- `normalizeAttachmentForAPI` (obfuscated: `kc6`) - Attachment-type dispatcher (3-tier map+switch) (`445425-445808`)
- `PER_TYPE_RENDERERS` (obfuscated: `DG4`) - Per-type renderer map (`446557-446767`)
- `collectAttachments` (obfuscated: `Aw4`) - Per-turn parallel generator pool + master gate (`412660-412738`)
- `runAttachmentGenerator` (obfuscated: `E3`) - Per-generator try/catch + 5% telemetry sampling (`412739-412763`)
- `getQueuedCommandAttachments` (obfuscated: `gV$`) - The only generator surviving the master gate (`412764-412798`)
- `createUserMessage` (obfuscated: `T8`) - Message factory carrying the `isMeta` flag (`443846-443883`)
- `AMBIENT_CONTEXT_TRAILER` (obfuscated: `yT8`) - The hoisted "do not narrate" trailer (`446489-446490`)
- `TODO_REMINDER_CONFIG` (obfuscated: `QV$`) - `{TURNS_SINCE_WRITE:10, TURNS_BETWEEN_REMINDERS:10}` (`414014`)
- `PLAN_MODE_ATTACHMENT_CONFIG` (obfuscated: `lg6`) - `{TURNS_BETWEEN_ATTACHMENTS:5, FULL_REMINDER_EVERY_N_ATTACHMENTS:5}` (`414015`)
- `ULTRA_EFFORT_CONFIG` (obfuscated: `Kw4`) - NEW: `{TURNS_BETWEEN_MAINTENANCE:10}` (`414016`)
- `RELEVANT_MEMORIES_CONFIG` (obfuscated: `_w4`) - NEW: `{MAX_SESSION_BYTES:61440}` (`414017`)
- `VERIFY_PLAN_REMINDER_CONFIG` (obfuscated: `zw4`) - `{TURNS_BETWEEN_REMINDERS:10}` (`414018`)
