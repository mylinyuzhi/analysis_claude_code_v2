# Module 07 — Compaction (v2.1.113 → v2.1.142 Deltas)

## Overview

This document covers compaction-subsystem changes that landed between v2.1.113 and v2.1.142. The v2.1.112 baseline analysis is in [../../../claude_code_v_2.1.112/analyze/07_compact/](../../../claude_code_v_2.1.112/analyze/07_compact/) — read it first for the foundational architecture (the `vI6` 8-phase pipeline, the `QkK` dispatcher gate cascade, two breakers, state anchoring, the `context_hint` reject path).

Between v2.1.113 and v2.1.142, compaction picked up a second, structurally distinct algorithm — **reactive compaction** — that runs only when the model has a 1M-context window AND the request was just rejected with "Prompt is too long". This is a different shape from the legacy `vI6` autocompact:

- **Local autocompact (`vI6`/`QkK`)** — still owns 200k-window models. Replaces the *whole* conversation with a 2–3 KB summary, runs proactively when token-count crosses an 80%-ish threshold.
- **Reactive compact (`Y97`/`Ej6`/`uq8`)** — new for 1M-context models. Replaces *part* of the conversation by group-walking: tries to summarize the oldest N groups; if the summarize call itself hits PTL, preserves more groups and retries. Triggered by a 413/PTL response, not by a pre-flight threshold.

The v2.1.142 release ships a refinement of reactive compact's first-attempt heuristic. The original implementation started at `groupsPreserved = 1` (summarize everything except the last group) and only widened on PTL. v2.1.142 seeds the first attempt from the token gap reported in the rejection itself, skipping the wasted near-full-context retry.

In parallel, several reliability fixes landed:

1. **v2.1.142** — Reactive compact seeds from `initialTokenGap` (the overflow size returned with the PTL response) so attempt 1 already preserves a reasonable suffix.
2. **v2.1.141** — `/rewind` menu adds "Summarize up to here" as a third action besides "Restore conversation" and "Summarize from here", reusing `_H4` (partial-compact) with `direction: "up_to"`.
3. **v2.1.139** — All four `compactPrompt` variants (full from, full up-to, partial from, partial up-to) now instruct the summarizer to preserve security-relevant user instructions verbatim.
4. **v2.1.133** — `AH4` (partial-compact error toast) skips the "Error compacting conversation" notification for user-abort error patterns (`Gb` = "API Error: Request was aborted.").
5. **v2.1.132** — Subagent `--resume` writes via `resumePersistedCount` so prompt-too-long retries don't re-append the entire transcript head.
6. **v2.1.118** — `/fork` (background-agent variant) renamed from `/branch` (slash-command sibling) and **inherits messages by reference** — the spawn writes a fresh JSONL pointing back at the parent session via `forkedFrom: { sessionId, messageUuid }` rather than copying every entry full-fat.
7. **v2.1.116** — `iK4` (the `/branch` writer) was rewritten as a stream-pump (`createReadStream` → `createInterface` → `createWriteStream`) so it no longer materializes 50 MB into memory before writing.
8. **v2.1.116** — `$I4(block, ttl)` is now idempotent: if `cache_control.ttl` is already set, return the block unchanged. Prevents a parallel-request setup race from clobbering a freshly-written TTL with a stale value.
9. **v2.1.113** — Reactive compact now propagates the 1M-context beta header (`context-1m-2025-08-07`) through its forked `JV` call so resumed long-context sessions can compact without "Extra usage is required for long context requests".

The throughline: compaction got a second, smarter algorithm for big-context models; the rewind UI grew a third way to use it; and several long-tail crash/spurious-error/large-file paths got cleaned up.

## Document Map

Per-change deltas (single-version focused):

| File | Topic | Changelog Anchor |
|------|-------|------------------|
| [reactive_seeding.md](./reactive_seeding.md) | First summarize attempt seeds from overflow-size token gap | 2.1.142 |
| [sensitive_instructions_preserve.md](./sensitive_instructions_preserve.md) | Summarizer prompt: preserve security-relevant user instructions verbatim | 2.1.139 |
| [summarize_up_to_here.md](./summarize_up_to_here.md) | `/rewind` menu adds "Summarize up to here" (partial-compact with `direction: "up_to"`) | 2.1.141 |
| [compaction_resume_long_context.md](./compaction_resume_long_context.md) | Resumed long-context (1M) session compaction propagates `EU` beta header | 2.1.113 |
| [compaction_esc_no_error.md](./compaction_esc_no_error.md) | Esc during compaction no longer surfaces spurious "Error compacting conversation" | 2.1.133 |
| [subagent_resume_dup_writes.md](./subagent_resume_dup_writes.md) | Subagent `--resume` no longer re-writes the multi-MB transcript head on PTL retries | 2.1.132 |
| [fork_pointer_hydrate.md](./fork_pointer_hydrate.md) | `/fork` writes a pointer (`forkedFrom`) instead of a full conversation copy per fork | 2.1.118 |
| [branch_size_limit_removal.md](./branch_size_limit_removal.md) | `/branch` streams via line-pump instead of buffering the whole JSONL — 50MB limit gone | 2.1.116 |

Architecture deep-dives (cross-cutting reference):

| File | Topic |
|------|-------|
| [proactive_vs_reactive.md](./proactive_vs_reactive.md) | Side-by-side comparison of the two compact algorithms (200k vs 1M lane) |
| [autocompact_thrash_guard.md](./autocompact_thrash_guard.md) | Two breakers (consecutive-failure, rapid-refill) — state machines and trigger conditions |
| [precompact_hook_interaction.md](./precompact_hook_interaction.md) | PreCompact hook block path: `decision: "block"`, exit-code 2, prefix-matched silent skip |
| [fork_interaction.md](./fork_interaction.md) | How compaction crosses fork boundaries and resumed sessions |
| [sensitive_instructions_preservation_internals.md](./sensitive_instructions_preservation_internals.md) | Internals of the v2.1.139 prompt clause across all four variants |
| [summarization_model_selection.md](./summarization_model_selection.md) | Which model writes the summary (haiku-fast routing, env overrides) |
| [summary_prompt_template.md](./summary_prompt_template.md) | The compaction meta-prompt structure (sections 1-9, `J3_` unwrap, `fM$` continuation) |

Symbol references:

| File | Topic |
|------|-------|
| [../00_overview/symbol_additions_v2_1_142_compact_cache.md](../00_overview/symbol_additions_v2_1_142_compact_cache.md) | Unit 11 — reactive compact, partial compact, telemetry symbols |
| [../00_overview/symbol_additions_v2_1_142_compact_arch.md](../00_overview/symbol_additions_v2_1_142_compact_arch.md) | Unit 07 — autocompact pipeline, prompts, hooks, model selection symbols |

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact lives here
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Loop integration, subagent transcript writes
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Telemetry, beta header registry
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Slash commands (`/branch`, `/fork`, `/rewind`)
> - [symbol_additions_v2_1_142_compact_cache.md](../00_overview/symbol_additions_v2_1_142_compact_cache.md) - This delta's new symbols

Key functions in this delta:

- `reactiveCompactDispatcher` (`Y97`) — `cli_inner_pretty.js:243951-244055` — Top of the reactive compact lane; routed from the agent loop when a 1M-model returns PTL
- `runReactiveCompact` (`Ej6`) — `cli_inner_pretty.js:244056-244092` — Calls `uq8` then `f97` (post-compact reconstruction); only path that consumes `initialTokenGap`
- `iterateReactiveSummarize` (`uq8`) — `cli_inner_pretty.js:243253-243336` — The group-walk loop; v2.1.142 adds the `initialTokenGap` seed branch (lines 243268-243275)
- `summarizeReactiveAttempt` (`X3_`) — `cli_inner_pretty.js:243188-243241` — One LLM summarize call inside the loop; returns `{ ok, reason }`
- `seedPreservedCount` (`B47`) — `cli_inner_pretty.js:243242-243248` — Given a token-budget gap and per-group sizes, compute how many groups to preserve
- `nextStepFromGap` (`L3_`) — `cli_inner_pretty.js:243249-243252` — Wraps `B47` with `mode` discriminator for telemetry (`"gap_unparseable"` vs `"gap_guided"`)
- `compactFullPrompt` (`bq8`) — `cli_inner_pretty.js:242949-243062` — Full-conversation summarizer prompt; v2.1.139 inserts the "preserve sensitive instructions verbatim" clause at section 1 & 6
- `compactPartialPrompt` (`m47`) — `cli_inner_pretty.js:242856-242948` — Partial summarizer prompt (`from` or `up_to`); same clause for v2.1.139
- `partialCompact` (`_H4`) — `cli_inner_pretty.js:407768-407934` — Handles `/rewind` → Summarize from/up to; v2.1.141 wires `direction: "up_to"` through to message ordering
- `partialCompactErrorNotice` (`AH4`) — `cli_inner_pretty.js:407935-407951` — Suppresses error toast for `Gb`/`ErH`/`$rH` patterns; v2.1.133 added user-abort silencing
- `runResumedSubagent` (`uiH`) — `cli_inner_pretty.js:386626-386713` — Resumes a subagent transcript; v2.1.132 plumbs `resumePersistedCount: w.length`
- `runSubagentInner` (slH/Vb-related) — `cli_inner_pretty.js:393098-393433` — Consumes `resumePersistedCount` to slice persisted prefix off the write set
- `branchCommandWriter` (`iK4`) — `cli_inner_pretty.js:428076-428184` — Streams parent JSONL → child JSONL line-by-line; emits `forkedFrom` on each kept entry (v2.1.116 streaming; v2.1.118 pointer)
- `branchAndResume` (`rK4`) — `cli_inner_pretty.js:428201-428244` — `/branch` command handler; calls `iK4` then `H.resume(..., "fork")`
- `spawnForkFromDirective` (`lR6`) — `cli_inner_pretty.js:427943-428022` — `/fork` (background agent) handler; forks with `replHydration: { kind: "fork", log: [...] }`
- `Bn` (post-compact cleanup) — `cli_inner_pretty.js:243907-243920` — Touches `cacheMissAckedAtOutputTokens` so the cache-miss `/effort`/`/model` dialog doesn't fire spuriously after compaction (cross-link with cache work)
- `EU` (`long_context` beta) — `cli_inner_pretty.js:96801` — `pJ("long_context", "context-1m-2025-08-07")` — Header added by reactive paths when model is 1M

## Architecture: Where Each Path Plugs In

```
                                            ┌─────────────────────────────────────────────────┐
                                            │ Agent main loop (xq8 / agent-loop chunk)          │
                                            └────────────────────┬────────────────────────────┘
                                                                 │
                  ┌──────────────────────────────────────────────┼──────────────────────────────────────────────┐
                  │                                              │                                              │
                  ▼                                              ▼                                              ▼
       Pre-flight (legacy)                          Streamed assistant response                   /compact / /rewind menu
       autocompact gate (QkK)                       lands and a check sees PTL                   (manual entry points)
       chunks for 200k models                       on a 1M-model session                         │
       Calls full vI6 compact                       Calls Y97 reactive compact                    │
                  │                                              │                                              │
                  ▼                                              ▼                                              │
   ┌──────────────────────────┐                ┌───────────────────────────────────────────┐                    │
   │ vI6 / compactConversation │                │ Y97 → Ej6 → uq8                            │                    │
   │ (chunks.159.mjs equiv.)   │                │ Iterate groups, summarize oldest M groups  │                    │
   │ Replaces whole convo      │                │ Preserve newest A-M groups                 │                    │
   │ Single LLM call           │                │ On PTL: preserve more, retry               │                    │
   └──────────────────────────┘                │                                            │                    │
                                                │ v2.1.142: initialTokenGap seeds attempt 1  │                    │
                                                │                                            │                    │
                                                │ Group-walk algorithm:                      │                    │
                                                │   for Y in [seed, ..., A-1]:               │                    │
                                                │     L = X3_(messages[:A-Y], ...)           │                    │
                                                │     if L.ok: return summary, preserve Y    │                    │
                                                │     elif L.reason=="prompt_too_long":      │                    │
                                                │       step = B47(groupSizes, ...,          │                    │
                                                │                  L.tokenGap)               │                    │
                                                │       Y += step                            │                    │
                                                └────────────────────┬───────────────────────┘                    │
                                                                     │                                            │
                                                                     ▼                                            ▼
                                                     ┌─────────────────────────────────────────────────────────────┐
                                                     │ Common post-compact path (f97 for reactive, last phases of  │
                                                     │ vI6 for legacy, _H4 internals for /rewind):                  │
                                                     │   - Boundary marker (compact_boundary)                       │
                                                     │   - Restore files, plans, todos, skills attachments          │
                                                     │   - SessionStart hook (source: "compact")                    │
                                                     │   - PostCompact hook                                         │
                                                     │   - Bn(cacheMissAcked = nX()) — silences /model dialog       │
                                                     └─────────────────────────────────────────────────────────────┘
```

## Key Algorithm: Reactive Compact Group-Walk

**What it does:** Summarize as many of the *oldest* message groups as possible while staying under the model's context limit, given that the conversation has already overflowed.

**How it works (v2.1.142):**

1. Split messages into "groups" (`hQH(K)`). A group is one assistant turn plus the user/tool messages that follow it until the next assistant turn.
2. If groups < 2, bail with `too_few_groups`.
3. Seed `Y` (= groupsToPreserve) from `q.initialTokenGap` when present:
   - Compute per-group token sizes `M[i] = KV(groups[i])`.
   - Compute the deficit: `D = initialTokenGap - M[A-1]` (how much we must shave off the oldest A-1 groups). The "minus last group" is because the last group has to stay anyway.
   - If `D > 0`, call `B47(M, A-1, D)` to greedily walk backward from index A-2 until the cumulative size reaches D. That count `j` is the seed: `Y = 1 + j`.
4. Loop: with current `Y`, summarize groups `[0 ..< A-Y]` and preserve groups `[A-Y ..< A]`.
5. If the summarize call succeeds, return with `{ groupsPreserved: Y, totalGroups: A, attempt: f }`.
6. If the summarize call itself hits PTL (`L.reason === "prompt_too_long"`), recompute `step = B47(M, A-Y, L.tokenGap)` and `Y += step`. The next attempt preserves more, summarizes less.
7. If we walk past the end (`Y >= A`), return `{ ok: false, reason: "exhausted" }`.

**Why this approach:**

- **Group-level granularity** preserves tool-call/tool-result coherence — a single tool_use can't be summarized while its tool_result stays in the prefix, because the API rejects orphaned tool_uses.
- **Greedy backward walk** in `B47` (sum tokens until ≥ target) gives an O(A) selection that aims at the target without overshooting wildly.
- **Token-gap seeding** (v2.1.142) replaces a fixed `Y = 1` start. Before this change, attempt 1 would summarize *all but the last group* and almost always hit PTL again, because if the convo is 1.1× the limit, summarizing 99% of it still leaves 99% of the convo in the prompt. The seed says "shave at least `initialTokenGap` worth of groups off, then summarize the rest".

**Key insight:** the summarize call is itself an LLM call that has to fit in the context window. A naïve "summarize everything" approach pays the same cost as the original request and gets the same overflow. The seed lets attempt 1 already preserve enough of the *recent* conversation that the summarize call has room to breathe.

## v2.1.139 Prompt Change — Sensitive Instruction Preservation

Both prompt variants (full `bq8` and partial `m47`) gained two new clauses at sections 1 and 6:

Section 1 (analysis stage):
> Note any security-relevant instructions or constraints the user stated (e.g., sensitive files or data to avoid, operations that must not be performed, credential or secret handling rules). These MUST be preserved verbatim in the summary so they continue to apply after compaction.

Section 6 (user-messages enumeration):
> Preserve any security-relevant instructions or constraints verbatim so they remain in effect after compaction.

Why this matters: the summarizer can paraphrase "don't write to /etc/passwd" into "user wants Claude to avoid system files", which would no longer match a literal denylist check. The verbatim clause makes the summarizer copy the constraint exactly, preserving its substring/exact-match power.

## v2.1.141 — Summarize Up To Here

The `Hc6` (rewind) message-selector grew a third option besides "Restore conversation" and "Summarize from here":

| Option | Action | Semantics |
|--------|--------|-----------|
| `summarize` | Summarize messages after selected → preserve them | The classic /compact-at-point: shave the tail |
| `summarize_up_to` (NEW) | Summarize messages before selected → preserve them | Shave the head; user keeps the tail intact |

Both call `_H4` (partial compact) with `direction: "from"` or `"up_to"` respectively. The internal split is:

```
direction === "up_to":
  M (to summarize) = H.slice(0, idx)       // head
  w (to preserve)  = H.slice(idx).filter(not progress/system/isCompactSummary)  // tail
  forkContextMessages = M                   // only head goes into the summarize prompt

direction === "from":
  M (to summarize) = H.slice(idx)          // tail
  w (to preserve)  = H.slice(0, idx)       // head
  forkContextMessages = H                   // whole convo goes to summarize prompt
```

Message ordering after the compact:
- `"up_to"`: `[boundaryMarker, ...summaryMessages, ...messagesToKeep, ...attachments, ...hookResults]`
- `"from"`: `[boundaryMarker, ...messagesToKeep, ...summaryMessages, ...attachments, ...hookResults]`

i.e. the summary always lands where it replaces what it summarized.

## v2.1.133 — Silent Abort

`AH4(error, ctx)` is the partial-compact error toast. It guards three patterns:

- `Bd(H, Gb)` — error matches "API Error: Request was aborted."
- `Bd(H, ErH)` — error matches "Not enough messages to compact."
- `ZH(H).startsWith($rH)` — error message starts with "Compaction blocked by PreCompact hook"

If any match, the notification is suppressed. v2.1.133 added the `Gb` (abort) case — pressing Esc during compaction sends an `AbortController.abort()` that propagates as an "API Error: Request was aborted." Without the filter, every Esc-during-compaction produced a misleading "Error compacting conversation" toast.

## Cross-Module Touch Points

- **23_prompt_cache** — Compaction triggers `Bn()` which writes `cacheMissAckedAtOutputTokens = nX()`. This is what suppresses the "Your conversation is cached for the current model" warning after `/clear` or compaction (v2.1.129 fix). See [../23_prompt_cache/cache_miss_warning_after_clear.md](../23_prompt_cache/cache_miss_warning_after_clear.md).
- **Subagent transcript** — `resumePersistedCount` (v2.1.132) is the only thing keeping `--resume` retries from re-writing 5+ MB per PTL attempt. See [subagent_resume_dup_writes.md](./subagent_resume_dup_writes.md).
- **Branch slash command** — `/branch` and `/fork` share the spawn pipeline but differ in whether they fork into a *background agent* (`/fork`) or a *resumable session* (`/branch`). See [fork_pointer_hydrate.md](./fork_pointer_hydrate.md) and [branch_size_limit_removal.md](./branch_size_limit_removal.md).

## Telemetry Surface

| Event | When fired | Notable fields |
|-------|-----------|----------------|
| `tengu_reactive_compact_triggered` | `Y97` decides reactive path applies | `effort_level`, `querySource`, `precomputed` |
| `tengu_reactive_compact_attempt` | Each `X3_` call inside `uq8` | `attempt`, `groupsToSummarize`, `groupsToPreserve`, `messagesToSummarize`, `strippedMedia`, `stepMode`, `stepSize`, `tokenGap` — `stepMode: "seeded"` (new in v2.1.142) tracks how attempt 1 was chosen |
| `tengu_reactive_compact_succeeded` | `f97` finishes happy path | `attempts`, `groupsPreserved`, `totalGroups`, `preCompactTokens`, `postCompactTokens`, `restoredAttachmentCount`, full usage breakdown |
| `tengu_reactive_compact_failed` | `Ej6` got `!Y.ok` | `reason`, `attempts`, `totalGroups`, `durationMs` |
| `tengu_partial_compact` | `_H4` finishes happy path | `messagesKept`, `messagesSummarized`, `direction`, `hasUserFeedback`, `trigger: "message_selector"` (rewind) |
| `tengu_partial_compact_failed` | `_H4` failed | `reason: "prompt_too_long" | "no_summary" | "api_error"`, `direction`, `messagesSummarized` |
| `tengu_compact_ptl_retry` | Either compact path retries on PTL | `attempt`, `droppedMessages`, `remainingMessages`, `path: "partial" | "full"` |
| `tengu_conversation_forked` | `/branch` resolved | `message_count`, `has_custom_title` |

The `stepMode` enum is `"seeded" | "gap_guided" | "gap_unparseable"`. `"seeded"` is unique to v2.1.142 — fires only when attempt 1 used `initialTokenGap`. The other two are for retries after a PTL response inside the summarize call.
