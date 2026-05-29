# Telemetry & Cache — Token Economics of Reminders

> How `<system-reminder>` content interacts with the Anthropic API's prompt cache and Claude Code's telemetry pipeline. Why the design avoids cache invalidation, why some reminders are separately tracked in observability, and how the mid-conversation `role:"system"` fallback fits in.

## The cache-prefix invariant

Anthropic's prompt cache works on a **prefix match** — a cache hit requires the request's content to be **byte-identical to a previous request up to one of the breakpoints**. Any change in the cached prefix region (system prompt, tool definitions, prior messages) **invalidates** the cache.

Reminders sit inside *user messages*. The naïve placement would have been:
- Edit the system prompt every turn (e.g., "Auto mode active; date is 2026-05-29").
- Or include reminders as a separate `role:"system"` message at the top.

Both break the prefix invariant. The design adopted by Claude Code:

- **Reminders live in user-role messages** that are appended turn-by-turn.
- **The cached prefix never mutates** — only the new turn's content is sent.
- **Cache breakpoints** sit AFTER the cached system prompt and BEFORE the per-turn user content, so the prefix-mutation cost is zero.

The source-level acknowledgement is at `cli_inner_pretty.js:593289`:

> | Editing the system prompt mid-session invalidates the cache. | Append a `<system-reminder>` block in the `messages` array instead. The cached prefix stays intact. Claude Code uses this for time updates and mode transitions. |

## Two reminder placement strategies

```
                Cached prefix region            Per-turn content
                ┌───────────────────────────┐  ┌─────────────────────┐
                │ system prompt (anchor)    │  │                     │
                │ tool definitions          │  │  user msg 1         │
                │ initial CLAUDE.md context │  │  assistant msg 1    │
                │   <SR>As you answer…</SR> │  │  user msg 2 (+ SRs) │
                │ breakpoint #1             │  │  ↑ here SRs flow    │
                ├───────────────────────────┤  └─────────────────────┘
                │ assistant + tool turns    │
                │ from prior session        │
                │ breakpoint #N             │
                └───────────────────────────┘
```

### Placement A — once at session start (cache-friendly)

The CLAUDE.md / context block (via `EO8` at `cli_inner_pretty.js:524243-524262`) prepends a single reminder to the first user message:

> `<system-reminder>`
> As you answer the user's questions, you can use the following context:
> # CLAUDE.md
> `<contents>`
> …
> `</system-reminder>`

This reminder is **inside the cached prefix** — it's part of every turn but never re-sent. Adding/removing it would invalidate the cache, so the harness carefully keeps it stable: a `/clear` or `/compact` resets the prefix entirely; otherwise the CLAUDE.md is only re-read if the file mtime changed (and even then, the change comes through as a `memory_update` reminder, not a prefix mutation).

### Placement B — per-turn (cache-bypass)

Per-turn reminders (todo_reminder, plan_mode, memory_update, etc.) live **outside** the cached prefix — they ride alongside the new user content. They don't invalidate the cache, but they do count against per-turn tokens.

The split is invisible to the model — it sees a stream of reminder blocks — but matters for token economics:

- **Stable reminders** (deferred_tools listing after MCP stabilises): cached.
- **Per-turn reminders** (todo_reminder content, varying date, varying todo list): NOT cached — would invalidate the prefix.

## Why per-turn reminders don't cache

A reminder like `todo_reminder` embeds the current todo list:

> Here are the existing contents of your todo list:
> `[1. [pending] Implement feature X, 2. [in_progress] Write tests, …]`

If the harness placed this in the cached region, every TodoWrite call would invalidate the cache (the embedded list changes). The cost: re-paying the full cached prefix in cache-creation tokens on every TodoWrite turn.

Per-turn placement means the *prior turns' prefix stays cached* — only the new reminder content is fresh tokens. The trade-off:
- ❌ Reminder content is fresh tokens every turn (not amortised by cache hit).
- ✅ The cached prefix (system prompt + tool defs + prior turns) stays valid.

For a session with N turns and a reminder size of R tokens, the choice is:
- **In-prefix placement**: N × full-prefix-tokens (cache always misses on prefix updates)
- **Per-turn placement**: full-prefix-tokens once + N × R reminder tokens

For R ≪ prefix, per-turn is dramatically cheaper. The actual numbers in v2.1.142: a typical reminder is 50-200 tokens, the cached prefix is 5000-20000 tokens. Per-turn is the right choice.

## The cadence gates — `Is7` and `Ss7`

For plan-mode and auto-mode reminders, the harness uses a **full/sparse cadence** so the long-form instructions don't ride every turn:

```javascript
// cli_inner_pretty.js:398822-398823
Is7 = { TURNS_BETWEEN_ATTACHMENTS: 5, FULL_REMINDER_EVERY_N_ATTACHMENTS: 5 },  // plan mode
Ss7 = { TURNS_BETWEEN_ATTACHMENTS: 5, FULL_REMINDER_EVERY_N_ATTACHMENTS: 5 },  // auto mode
```

The semantics:
- Emit *some* reminder every 5 turns (`TURNS_BETWEEN_ATTACHMENTS`).
- Every 5th emission is full (≈400 lines); intermediate emissions are sparse (≈40 lines).

Effective cadence:
- Sparse reminder: every 5 turns (≈ tens of tokens)
- Full reminder: every 25 turns (≈ thousands of tokens)

**Why two cadence levels** (not just "emit every N turns"): The model's working context decays — after ≈20 turns, the model may have forgotten plan-mode-specific guidance like "call ExitPlanMode when the plan is ready". A sparse reminder catches the most common errors (e.g., forgetting to end the turn with ExitPlanMode); a full reminder periodically re-asserts the entire workflow.

**Why these numbers**: 5 turns between sparse / 25 turns between full was tuned empirically. Shorter sparse gaps would dominate per-turn cost; longer full gaps would drift too far before re-anchoring.

## The TodoWrite / TaskCreate cadence

The threshold object for tool nudges:

```javascript
// cli_inner_pretty.js:398821
aO8 = { TURNS_SINCE_WRITE: 10, TURNS_BETWEEN_REMINDERS: 10 }
```

Both gates must pass for a `todo_reminder` to fire:
- `turnsSinceLastTodoWrite >= 10`: the model has gone 10 turns without calling TodoWrite.
- `turnsSinceLastReminder >= 10`: at least 10 turns since the last `todo_reminder` was emitted.

**Why the dual gate**: A single "since-last-write" gate fires repeatedly while the model continues to ignore the nudge — once per turn, every turn. The "since-last-reminder" gate ensures back-to-back reminders are 10 turns apart even if the model never calls TodoWrite.

**Why 10/10 specifically**: Tunable; empirically chosen so:
- A fresh session (0 writes, 0 prior reminders) waits 10 turns of actual work before being nudged.
- A model that ignored a nudge gets a second one 10 turns later, then a third 10 turns after that — escalating but not spammy.

## The memory cadence — `B65`

```javascript
B65 = { TURNS_BETWEEN_REMINDERS: 10 }
```

Used by the auto-memory subsystem for `relevant_memories` re-emission gating. The full memory recall is expensive (multiple files, hundreds of tokens); the harness rate-limits to every 10 turns even if a fresh recall would match.

## Telemetry — separating reminders from user content

The telemetry pipeline (OTel beta session tracing) deliberately separates reminder content from "what the user typed":

```javascript
// ============================================
// formatMessagesForContext (rf_) - telemetry split
// Location: cli_inner_pretty.js:241480-241514
// TS reference: src/utils/telemetry/betaSessionTracing.ts:166-208
// ============================================

// READABLE (for understanding):
function formatMessagesForTelemetry(messages) {
  const contextParts = [];   // → new_context span attribute
  const systemReminders = []; // → system_reminders span attribute
  for (const message of messages) {
    if (message.type === "api_system") {
      systemReminders.push(message.message.content);
      continue;
    }
    const content = message.message.content;
    if (typeof content === "string") {
      const sr = extractSystemReminderContent(content);
      if (sr) systemReminders.push(sr);
      else contextParts.push(`[USER]\n${content}`);
    } else if (Array.isArray(content)) {
      for (const block of content) {
        if (block.type === "text") {
          const sr = extractSystemReminderContent(block.text);
          if (sr) systemReminders.push(sr);
          else contextParts.push(`[USER]\n${block.text}`);
        } else if (block.type === "tool_result") {
          const tr = typeof block.content === "string" ? block.content : JSON.stringify(block.content);
          const sr = extractSystemReminderContent(tr);
          if (sr) systemReminders.push(sr);
          else contextParts.push(`[TOOL RESULT: ${block.tool_use_id}]\n${tr}`);
        }
      }
    }
  }
  return { contextParts, systemReminders };
}

// Mapping: rf_→formatMessagesForTelemetry, nD6→extractSystemReminderContent
```

### Resulting span attributes

```javascript
// cli_inner_pretty.js:241580-241606
H.setAttribute("new_context_message_count", z.length);
if (f.length > 0) H.setAttribute("system_reminders_count", f.length);
H.setAttributes({ new_context: M, ...(w && { new_context_truncated: !0 }) });
H.setAttributes({ system_reminders: M, ...(w && { system_reminders_truncated: !0 }) });
```

Two top-level span attributes:
- **`new_context`** — the user's *actual* content (stripped of reminders). Drives the "user prompt length over time" metric.
- **`system_reminders`** — joined reminder bodies, separated by `\n\n---\n\n`. Drives the "what is the harness telling the model" metric.

### Truncation

Telemetry caps each attribute at ~2KB (via `Cn(...)` truncation). If the joined string exceeds the cap:
- `new_context_truncated: true` and `new_context_original_length: <N>` are emitted alongside.
- Same for `system_reminders_truncated` and `system_reminders_original_length`.

**Why separate truncation flags**: An observability dashboard can spot "this session had 20KB of reminders but only 200 bytes of actual user input" — which is normal (e.g., heavy plan-mode session) but worth knowing.

### Sampling

Telemetry events are sampled — `Math.random() < 0.05` for the `tengu_attachment_compute_duration` event in `aY()` at `cli_inner_pretty.js:397625`. Reminder content telemetry is gated by `$MH()` (the OTel-tracing-enabled predicate) and `jX()` (the global telemetry on/off). When disabled, only counts (not text) flow to telemetry.

## The mid-conv-system fallback

Some Anthropic API beta tiers accept `role: "system"` messages **inside** the messages array (not just in the top-level `system` field). Claude Code optionally uses this for some reminders — the model effectively sees a mid-conversation system instruction. When the server rejects it (older API tier, beta gate off), the harness falls back to the `<system-reminder>` body approach and **sticky-rejects** the beta for the rest of the session.

```javascript
// cli_inner_pretty.js:525537-525548
if (x && NQK(A6)) {
  // … remove the role:"system" message, add it as SR-body retry …
  N('[mid-conv-system] server rejected role:"system" — falling back to <system-reminder> body, sticky-rejecting beta until /clear or /compact', { level: "warn" }),
  d("tengu_mid_conv_system_fallback_retry", {}),
  "retry:mid-conv-system"
}
```

**Why sticky-reject**: Without it, every reminder would re-try the beta, get rejected, fall back — wasting one round-trip per reminder. The sticky flag stays for the session.

**Why `/clear` or `/compact` resets**: Those slash commands rebuild the message stream from scratch. The new prefix has a chance to negotiate the beta cleanly (e.g., the user might have flipped the gate via `/config`).

**Why this matters for cache**: The fallback retry **re-sends** the same request with a different body shape. The original request had the cached prefix (which is preserved); only the per-turn content changes shape. So the cache still hits on the next turn, just not the failed mid-conv-system one.

## The `api_system` message type

For sessions that DO accept mid-conv `role:"system"`, the persistence layer emits messages with `type: "api_system"`:

```javascript
// cli_inner_pretty.js:424723-424729
function Wz5(H) {
  return {
    type: "api_system",
    message: { role: "system", content: H },
    uuid: pV.randomUUID(),
    timestamp: new Date().toISOString(),
  };
}
```

These messages are functionally equivalent to a `<system-reminder>` wrapped user message but use the native `role:"system"` channel. The transcript persistence layer reads them; the telemetry layer treats their content the same as SR-wrapped content (line 241485: `if (K.type === "api_system") { q.push(K.message.content); continue; }`).

## Cache cost of a typical session

Rough estimate for a 50-turn session with default behavior:

| Reminder category | Per-turn cost | Total cost (50 turns) |
|-------------------|---------------|------------------------|
| CLAUDE.md context (cached prefix) | 0 (cache hit) | ~5000 tokens × 1 = 5000 |
| date_change | ~10 tokens × 1 (start) | 10 |
| todo_reminder | ~100 tokens × 5 (every 10 turns) | 500 |
| plan_mode (sparse) | ~50 tokens × 10 | 500 |
| plan_mode (full) | ~400 tokens × 2 | 800 |
| memory_update | ~80 tokens × ~3 | 240 |
| thinking_reminder | ~30 tokens × 50 | 1500 |
| tool-result inlined reminders | ~20 tokens × ~5 | 100 |
| **Total reminder budget** |  | **~3650 tokens** |

For comparison:
- Average prompt (50 turns, ~5KB context per turn): **~250000 tokens** without cache, ~50000 with cache.
- Reminder overhead: ~1.4% of cached or ~7% of un-cached.

The reminder system is **inexpensive at the per-turn cost**, and **prevents cache invalidation** that would otherwise multiply token cost by 5-10×.

## Cache-aware reminder placement decisions

Two design choices that explicitly trade off cache vs. freshness:

### `deferred_tools_delta` after MCP stabilises — cached

Once the MCP server set has stabilised (no connect/disconnect for several turns), the delta-emission stops. The final state lives in the cached prefix as the initial deferred-tools list (announced once). The model can subsequently call `ToolSearch` to find any of them — no per-turn re-listing.

### `todo_reminder` content — explicitly NOT cached

The todo list embedded in the reminder changes turn-by-turn. Putting it in the cached prefix would invalidate the cache on every TodoWrite. The harness explicitly emits it as per-turn content so the prefix stays stable.

### `relevant_memories` — per-turn, not cached

Auto-memory recall is per-prompt similarity-matched. The recalled set changes turn-by-turn (different prompts match different memories). The reminder is per-turn — re-recalled, re-emitted, never cached.

## Observability — what to look at if reminders go wrong

| Symptom | Where to look |
|---------|---------------|
| "Why is my session burning cache?" | `tengu_mid_conv_system_fallback_retry` events (re-try due to beta reject) |
| "Why is the model ignoring my plan?" | `system_reminders` span attr — count `plan_mode` cadence; if 0 over many turns, the gate `Is7.TURNS_BETWEEN_ATTACHMENTS` may be misconfigured |
| "Why is TodoWrite never being called?" | `system_reminders` span — search for `todo_reminder` count; if 0, the gate `aO8` may not have fired yet (10 turns minimum) |
| "Why is the user complaining about reminder spam in transcripts?" | UI surface — confirm `isMeta` flag is `true` on the carrier message; check the `tengu_chair_sermon` gate state (if off, smoosh may have left siblings as visible blocks) |
| "Why are reminders not stripped from search?" | `transcriptSearch.toolResultSearchText` should call `stripAllReminders`. Check the call-site at `cli_inner_pretty.js:566118` |

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra

Key functions/constants in this document:
- `REMINDER_THRESHOLDS` (obfuscated: `aO8`) - `{TURNS_SINCE_WRITE:10, TURNS_BETWEEN_REMINDERS:10}`
- `PLAN_REMINDER_THRESHOLDS` (obfuscated: `Is7`) - `{TURNS_BETWEEN_ATTACHMENTS:5, FULL_REMINDER_EVERY_N_ATTACHMENTS:5}`
- `AUTO_REMINDER_THRESHOLDS` (obfuscated: `Ss7`) - Same shape, auto mode
- `MEMORY_REMINDER_THRESHOLD` (obfuscated: `B65`) - `{TURNS_BETWEEN_REMINDERS:10}`
- `formatMessagesForTelemetry` (obfuscated: `rf_`) - Telemetry separator
- `extractSystemReminderContent` (obfuscated: `Wq4`/`nD6`) - Unwrap a wholly-tagged string
- `makeApiSystemMessage` (obfuscated: `Wz5`) - Native `role:"system"` mid-conv message factory
- `prependCachedContextReminder` (obfuscated: `EO8`) - Cached-prefix reminder injection
- `unwrapForCompaction` (obfuscated: `Zz5`) - Compaction-time SR unwrap
- `extractAllSystemReminderText` (obfuscated: `Wq4`) - Same as `nD6` (alias)
