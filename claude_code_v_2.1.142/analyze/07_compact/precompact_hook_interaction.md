# PreCompact Hook Interaction — Block, Augment, Notify (v2.1.142)

## Overview

The PreCompact hook is a user-controllable extension point that fires *just before* compaction starts. It was introduced in v2.1.105 as part of Claude Code's pluggable hooks system, alongside PostCompact, SessionStart, and a half-dozen others. PreCompact has three distinct powers:

1. **Block** — prevent compaction entirely (returns `decision: "block"` + reason)
2. **Augment** — inject extra custom instructions into the summarization prompt (`newCustomInstructions`)
3. **Notify** — produce text to show the user (`userDisplayMessage`)

This document walks through:
1. The hook's protocol (JSON event shape, response fields, exit codes)
2. How the autocompact loop integrates with the hook (`executePreCompactHooks` and `throwOnPreCompactHookBlock`)
3. The decision-block contract — what happens when a hook returns "block"
4. The code-2 exit shortcut for shell hooks
5. The hook's invocation point in both lanes (proactive `qrH`, reactive `Y97`, partial `_H4`)
6. The full block-error chain — from `decision: "block"` → `$rH` exception → notification + abort

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Hooks system
> - [symbol_additions_v2_1_142_compact_arch.md](../00_overview/symbol_additions_v2_1_142_compact_arch.md) - This unit
> - [symbol_additions_v2_1_142_compact_cache.md](../00_overview/symbol_additions_v2_1_142_compact_cache.md) - Unit 11

Key functions in this document:
- `executePreCompactHooks` (`ug`) - Dispatcher for PreCompact hook event
- `executePostCompactHooks` (`zMH`) - Sibling — fires after compaction completes
- `throwOnPreCompactHookBlock` (`FM8`) - Converts a blocked hook into a thrown exception
- `mergeHookInstructions` (`DI6`) - Combines user custom-instructions with hook-supplied ones
- `dispatchHookEvent` (`YW`) - Lower-level hook event runner (shared with all hook events)
- `PRECOMPACT_BLOCKED_PREFIX` (`$rH`) = "Compaction blocked by PreCompact hook" - The exception prefix
- `d9H` - Custom Error subclass for blocked-compaction errors

---

## 1. The Hook Protocol

PreCompact hooks are configured in `~/.claude/settings.json` (or per-project `.claude/settings.json`, or plugin `hooks.json`):

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "auto",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/my-precompact-hook.sh"
          }
        ]
      }
    ]
  }
}
```

The `matcher` field is special for PreCompact: it matches against the *trigger* value (`auto` or `manual`), not against a tool or query string.

### Hook Input Event

When the hook fires, the shell command receives a JSON payload on stdin:

```json
{
  "session_id": "01HXXXXX...",
  "transcript_path": "/Users/me/.claude/projects/.../session.jsonl",
  "cwd": "/path/to/project",
  "hook_event_name": "PreCompact",
  "trigger": "auto",
  "custom_instructions": null
}
```

- `session_id` / `transcript_path` / `cwd` — standard hook context fields (set by `M_(void 0)`)
- `hook_event_name` — always `"PreCompact"`
- `trigger` — `"auto"` for autocompact (`Fo7`) and reactive (`Y97`), `"manual"` for `/compact` and `/rewind` (`_H4`)
- `custom_instructions` — user-supplied custom instructions (if any from `/compact <instructions>`), else null

### Hook Output Response

The hook writes JSON to stdout. Recognized fields:

```json
{
  "decision": "block",
  "reason": "Refusing to compact — too important to summarize",
  "newCustomInstructions": "Be extra careful about file paths in the summary",
  "userDisplayMessage": "Skipping compact (per local policy)"
}
```

- `decision: "block"` — Marks this hook as blocking. Causes `throwOnPreCompactHookBlock` to raise an exception that aborts the compact attempt.
- `reason` — Human-readable explanation; concatenated into the exception message and shown in the user notification.
- `newCustomInstructions` — Free-form text appended to the summarization prompt's "Additional Instructions" section.
- `userDisplayMessage` — Text shown to the user in the UI (the post-compaction system message).

Multiple hooks can fire simultaneously; their `newCustomInstructions` outputs are joined with `\n\n`, and any one blocking hook causes the whole compaction to abort.

---

## 2. Algorithm: The Hook Dispatcher

`executePreCompactHooks` (`ug`) is the canonical entry point:

```javascript
// ============================================
// executePreCompactHooks - Dispatches the PreCompact hook event and aggregates responses
// Location: cli_inner_pretty.js:519855-519893
// ============================================

// ORIGINAL (for source lookup):
async function ug(H, $, q = p_) { let K = { ...M_(void 0), hook_event_name: "PreCompact", trigger: H.trigger, custom_instructions: H.customInstructions }, _ = await YW({ hookInput: K, matchQuery: H.trigger, signal: $, timeoutMs: q }); if (_.length === 0) return {}; let A = _.filter((f) => f.succeeded && !f.blocked && f.output.trim().length > 0).map((f) => f.output.trim()), z = []; for (let f of _) if (f.succeeded && !f.blocked) if (f.output.trim()) z.push(`PreCompact [${f.command}] completed successfully: ${f.output.trim()}`); else z.push(`PreCompact [${f.command}] completed successfully`); else if (f.output.trim()) z.push(`PreCompact [${f.command}] failed: ${f.output.trim()}`); else z.push(`PreCompact [${f.command}] failed`); let Y = _.filter((f) => f.blocked); return { newCustomInstructions: A.length > 0 ? A.join(`\n\n`) : void 0, userDisplayMessage: z.length > 0 ? z.join(`\n`) : void 0, ...(Y.length > 0 && { blockedBy: Y.map((f) => { let O = f.output.trim(); return `[${f.command}]${O ? `: ${O}` : ""}`; }).join(`\n`) }), }; }

// READABLE (for understanding):
async function executePreCompactHooks(input, abortSignal, timeoutMs = DEFAULT_HOOK_TIMEOUT_MS) {
  const hookInput = {
    ...hookInputBase(undefined),                  // adds session_id, transcript_path, cwd
    hook_event_name: "PreCompact",
    trigger: input.trigger,                       // "auto" | "manual"
    custom_instructions: input.customInstructions,
  };
  const results = await dispatchHookEvent({
    hookInput,
    matchQuery: input.trigger,                    // matcher field filters by "auto" vs "manual"
    signal: abortSignal,
    timeoutMs,
  });

  if (results.length === 0) return {};

  // Collect non-blocked successful outputs as custom-instruction augmentations
  const newCustomInstructions = results
    .filter((r) => r.succeeded && !r.blocked && r.output.trim().length > 0)
    .map((r) => r.output.trim());

  // Build human-readable status messages for the UI
  const userDisplayMessages = [];
  for (const r of results) {
    if (r.succeeded && !r.blocked) {
      userDisplayMessages.push(r.output.trim()
        ? `PreCompact [${r.command}] completed successfully: ${r.output.trim()}`
        : `PreCompact [${r.command}] completed successfully`);
    } else {
      userDisplayMessages.push(r.output.trim()
        ? `PreCompact [${r.command}] failed: ${r.output.trim()}`
        : `PreCompact [${r.command}] failed`);
    }
  }

  // Collect blocking hooks separately
  const blockedHooks = results.filter((r) => r.blocked);

  return {
    newCustomInstructions: newCustomInstructions.length > 0 ? newCustomInstructions.join("\n\n") : undefined,
    userDisplayMessage: userDisplayMessages.length > 0 ? userDisplayMessages.join("\n") : undefined,
    ...(blockedHooks.length > 0 && {
      blockedBy: blockedHooks.map((r) => {
        const output = r.output.trim();
        return `[${r.command}]${output ? `: ${output}` : ""}`;
      }).join("\n"),
    }),
  };
}

// Mapping: ug->executePreCompactHooks, M_->hookInputBase, YW->dispatchHookEvent, p_->DEFAULT_HOOK_TIMEOUT_MS
```

**Why all four return fields are optional:**

- The compact pipeline reads them with `?.` operators — `hookResult.blockedBy && throw` — so a hook that returns nothing is treated as a no-op.
- A hook can choose to *only* augment instructions (sets `newCustomInstructions`, omits the rest).
- A hook can choose to *only* notify (sets `userDisplayMessage`, omits the rest).
- A hook can *only* block (sets `decision: "block"` → producing `blockedBy`, omits the rest).
- Multiple hooks return independent values; the dispatcher aggregates.

---

## 3. The Block Path

When any hook returns `decision: "block"`, the dispatcher's response includes a `blockedBy` field. The caller (`compactConversation` or `partialCompactConversation`) calls `throwOnPreCompactHookBlock` immediately:

```javascript
// ============================================
// throwOnPreCompactHookBlock - Converts the block decision into a thrown exception with notification
// Location: cli_inner_pretty.js:407549-407558
// ============================================

// ORIGINAL (for source lookup):
function FM8(H, $, q) { if (!H.blockedBy) return; if ((N(`Compaction blocked by PreCompact hook: ${H.blockedBy}`, { level: "warn" }), !q?.suppressNotification)) $.addNotification?.({ key: "compaction-blocked-by-hook", text: "compaction blocked by PreCompact hook", priority: "immediate", color: "warning", }); throw new d9H(`${$rH}: ${H.blockedBy}`); }

// READABLE (for understanding):
function throwOnPreCompactHookBlock(hookResult, context, options) {
  if (!hookResult.blockedBy) return;     // Not blocked, no-op
  log(`Compaction blocked by PreCompact hook: ${hookResult.blockedBy}`, { level: "warn" });
  if (!options?.suppressNotification) {
    context.addNotification?.({
      key: "compaction-blocked-by-hook",
      text: "compaction blocked by PreCompact hook",
      priority: "immediate",
      color: "warning",
    });
  }
  throw new PreCompactHookBlockedError(`${PRECOMPACT_BLOCKED_PREFIX}: ${hookResult.blockedBy}`);
}

// Mapping: FM8->throwOnPreCompactHookBlock, $rH->PRECOMPACT_BLOCKED_PREFIX, d9H->PreCompactHookBlockedError
```

The thrown `d9H` (`PreCompactHookBlockedError`) extends `Error` and has a specific message prefix `$rH` = `"Compaction blocked by PreCompact hook"`. Callers check for this prefix to short-circuit error logging — a blocked compact is *not* an error, it's a deliberate user action.

### Algorithm: Block-Detection Cascade

The `$rH` prefix flows through three layers of error handling:

```javascript
// (excerpt from Fo7 / autoCompactGenerator, cli_inner_pretty.js:408426-408432)

try {
  let j = yield* Zy6((J) => qrH(H, J, q, !0, void 0, !0, M, w, D), $);
  return (Bn(K, $.setAppState, $.agentId), { wasCompacted: !0, compactionResult: j, consecutiveFailures: 0, consecutiveRapidRefills: O });
} catch (j) {
  if (ZH(j).startsWith($rH)) return { wasCompacted: !1 };           // SPECIAL CASE: blocked, exit without counting as failure
  if (!Bd(j, Gb))
    if (tu(ZH(j)) || Bd(j, UM8) || Bd(j, yrH)) N(`autocompact failed: ${ZH(j)}`, { level: "error" });
    else EH(j);
  let X = (_?.consecutiveFailures ?? 0) + 1;
  if (X >= DH4) (N(`autocompact: circuit breaker tripped after ${X} consecutive failures...`, { level: "warn" }), d("tengu_auto_compact_circuit_breaker", { consecutiveFailures: X }));
  return { wasCompacted: !1, consecutiveFailures: X };
}
```

**What it does:** Tells the autocompact circuit breaker (see [autocompact_thrash_guard.md](./autocompact_thrash_guard.md)) that a blocked hook is *not* a failure.

**Why this matters:** Without this special case, three consecutive turns where the hook blocked compaction would trip the failure-counter circuit breaker and disable autocompact for the rest of the session. The user would experience their hook silently failing to suppress autocompact: the first three turns the hook would block, then on the fourth turn the breaker would trip and autocompact would just stop trying, but the *reason it stopped* is different (breaker), and the next time the user clears the hook they would have to restart the session to re-enable autocompact. The `$rH` check makes the block invisible to the breaker.

The same cascade exists in the reactive lane (`Y97`) at line 244016-244022 and in the partial lane (`_H4`) at line 407790 (calls `FM8(j, q)` without suppression because `/compact` and `/rewind` are user-initiated and should announce the block).

---

## 4. Exit Code 2 Shortcut

For shell-script hooks that don't want to write JSON, the hook runner recognizes **exit code 2 as an implicit block**:

```bash
#!/bin/sh
# Block compaction unconditionally
echo "This hook blocks all compaction" >&2
exit 2
```

The hook runner (`dispatchHookEvent`'s underlying executor) treats exit code 2 as `{ blocked: true, output: <stderr> }` even without parsing JSON. This lets simple Bash/Python scripts express block intent without JSON serialization, and the stderr becomes the `reason` shown in the user notification.

Exit code 0 = success (with whatever stdout was returned).
Exit code non-zero (non-2) = failure (logged, treated as `succeeded: false`).
Exit code 2 = block (specific code path, treated as `blocked: true`).

This convention mirrors `git`/`grep`/many Unix tools where exit code 2 means "syntactically invalid input" — repurposed here to mean "explicit refusal" rather than "internal error".

---

## 5. Hook Invocation Sites in the Compact Pipeline

PreCompact fires at three distinct invocation sites across the two lanes:

### 5a. Proactive lane / `/compact` / `/rewind` — Inside `compactConversation` (`qrH`)

```javascript
// (cli_inner_pretty.js:407593-407596)
$.onCompactEvent?.({ type: "compact_progress", event: { type: "hooks_start", hookType: "pre_compact" } });
$.onCompactEvent?.({ type: "sdk_status", status: "compacting" });
let X = await ug({ trigger: A ? "auto" : "manual", customInstructions: _ ?? null }, $.abortController.signal);
FM8(X, $, { suppressNotification: A });
_ = DI6(_, X.newCustomInstructions);
```

- `A` is the `isAutoCompact` boolean — so trigger is `"auto"` for `Fo7`-driven calls and `"manual"` for `/compact` calls.
- `suppressNotification: A` — autocompact-triggered blocks don't show a notification (would surface every turn); manual `/compact` blocks do show one (the user expected something to happen).

### 5b. Reactive lane — Inside `reactiveCompactDispatcher` (`Y97`)

```javascript
// (cli_inner_pretty.js:243999-244022)
let W = await ug({ trigger: "auto", customInstructions: null }, O.abortController.signal).catch((G) => { return (EH(G), {}); });
// ...
if (j.blockedBy)
  return (N(`Reactive compact blocked by PreCompact hook: ${j.blockedBy}`), O.onCompactEvent?.({ type: "compact_progress", event: { type: "compact_end" } }), O.onCompactEvent?.({ type: "sdk_status", status: null }), null);
```

Reactive compact uses `trigger: "auto"` always (it's never user-initiated). When blocked, reactive returns `null` (cleaner than throwing) — the caller (agent loop's PTL handler) interprets `null` as "couldn't compact" and surfaces the PTL error to the user.

### 5c. Precomputed Compact — Inside `startPrecomputedCompact` (`n47`)

```javascript
// (cli_inner_pretty.js:243475-243481)
let L = await ug({ trigger: "auto", customInstructions: null }, Y.signal).catch((W) => { return (EH(W), {}); });
if (L.blockedBy) {
  (N(`Precomputed compact blocked by PreCompact hook: ${L.blockedBy}`), Bq8(A, Y, null));
  return;
}
```

Precomputed compact (a background pre-compact attempted in parallel with normal turns for the reactive lane) also fires the hook. A block in this path just clears the precompute entry (`Bq8(A, Y, null)`) — no user notification, since the precompute is invisible to the user anyway.

---

## 6. PostCompact — The Hook's Sibling

`executePostCompactHooks` (`zMH`) fires after compaction completes successfully. It cannot block (compaction is already done), but it can produce `userDisplayMessage`:

```javascript
// ============================================
// executePostCompactHooks - Fires after successful compaction; cannot block
// Location: cli_inner_pretty.js:519894-519912
// ============================================

// ORIGINAL (for source lookup):
async function zMH(H, $, q = p_) { let K = { ...M_(void 0), hook_event_name: "PostCompact", trigger: H.trigger, compact_summary: H.compactSummary }, _ = await YW({ hookInput: K, matchQuery: H.trigger, signal: $, timeoutMs: q }); if (_.length === 0) return {}; let A = []; for (let z of _) if (z.succeeded) if (z.output.trim()) A.push(`PostCompact [${z.command}] completed successfully: ${z.output.trim()}`); else A.push(`PostCompact [${z.command}] completed successfully`); else if (z.output.trim()) A.push(`PostCompact [${z.command}] failed: ${z.output.trim()}`); else A.push(`PostCompact [${z.command}] failed`); return { userDisplayMessage: A.length > 0 ? A.join(`\n`) : void 0 }; }

// READABLE (for understanding):
async function executePostCompactHooks(input, abortSignal, timeoutMs = DEFAULT_HOOK_TIMEOUT_MS) {
  const hookInput = {
    ...hookInputBase(undefined),
    hook_event_name: "PostCompact",
    trigger: input.trigger,
    compact_summary: input.compactSummary,    // the post-strip summary text
  };
  const results = await dispatchHookEvent({ hookInput, matchQuery: input.trigger, signal: abortSignal, timeoutMs });
  if (results.length === 0) return {};

  const userDisplayMessages = [];
  for (const r of results) {
    if (r.succeeded) {
      userDisplayMessages.push(r.output.trim()
        ? `PostCompact [${r.command}] completed successfully: ${r.output.trim()}`
        : `PostCompact [${r.command}] completed successfully`);
    } else {
      userDisplayMessages.push(r.output.trim()
        ? `PostCompact [${r.command}] failed: ${r.output.trim()}`
        : `PostCompact [${r.command}] failed`);
    }
  }
  return { userDisplayMessage: userDisplayMessages.length > 0 ? userDisplayMessages.join("\n") : undefined };
}

// Mapping: zMH->executePostCompactHooks
```

**No `blockedBy` field, no `newCustomInstructions` field** — PostCompact's role is post-hoc observability + UI augmentation. Common uses:
- Log the compaction event to an external system (with the summary text accessible via `compact_summary`)
- Trigger a desktop notification "Compaction complete"
- Update an external dashboard

---

## 7. Custom-Instructions Merge

When PreCompact returns `newCustomInstructions`, they get merged with user-supplied custom instructions (from `/compact <text>`):

```javascript
// ============================================
// mergeHookInstructions - Combines user custom-instructions with hook-supplied ones
// Location: cli_inner_pretty.js:407575-407581
// ============================================

// ORIGINAL (for source lookup):
function DI6(H, $) { if (!$) return H || void 0; if (!H) return $; return `${H}\n\n${$}`; }

// READABLE (for understanding):
function mergeHookInstructions(userInstructions, hookInstructions) {
  if (!hookInstructions) return userInstructions || undefined;
  if (!userInstructions) return hookInstructions;
  return `${userInstructions}\n\n${hookInstructions}`;
}

// Mapping: DI6->mergeHookInstructions
```

**Why user-first ordering:**
- User-supplied instructions come from the explicit `/compact "focus on X"` invocation. They represent the user's immediate intent.
- Hook-supplied instructions come from policy / project conventions. They represent baseline behavior.
- Putting the user first means the model reads the user's intent before the policy adjustments — empirically the model gives more weight to whichever instruction it reads first.

A hook that wants to force overrule the user would have to return `decision: "block"` first, then on the user retrying without `/compact <text>` apply its own policy.

---

## 8. Why PreCompact Fires Even on `decision: "block"`

A subtlety in the protocol: the *hook still runs* before its block-decision is honored. This means a hook that wants to do logging-then-block has to:

```bash
#!/bin/sh
# Log the compaction attempt
echo "$(date): compact attempted with trigger=$(jq -r .trigger)" >> /var/log/claude-compact.log
# Then signal block
cat << EOF
{"decision":"block","reason":"per policy"}
EOF
exit 0
```

This is *opposite* to most Unix-style gates (which short-circuit on first refusal). The reason: PreCompact's authors wanted hooks to be able to observe compactions even when blocking them, to support audit-and-deny patterns common in enterprise deployments. The "block" decision is a *policy output*, not a *control-flow short-circuit*.

---

## 9. Hook Timeout

The default timeout for PreCompact hooks is `p_` (`DEFAULT_HOOK_TIMEOUT_MS`). When a hook exceeds the timeout, `dispatchHookEvent` records it as `succeeded: false, blocked: false, output: "Hook timed out after Nms"`. The compaction proceeds (since `blockedBy` is empty), but the user sees a `PreCompact [my-hook.sh] failed: Hook timed out after 5000ms` message.

This means a hook that wants to *reliably* block must respond within the timeout, or it will be treated as a non-blocking failure and compaction will proceed anyway. There is no async-block mechanism — the hook's blocking power is entirely synchronous within the timeout window.

---

## 10. Summary — Hook Lifecycle

```
+----------------------------------+
| compactConversation() called      |
| or reactiveCompactDispatcher()    |
+--------------+-------------------+
               |
               v
+----------------------------------+
| executePreCompactHooks (ug)        |
| sends JSON to stdin of each hook   |
+--------------+-------------------+
               |
               v
+----------------------------------+
| Hook runs (script, JSON output)    |
| OR (exit 2 = implicit block)       |
+--------------+-------------------+
               |
               v
+----------------------------------+
| Hook dispatcher aggregates:        |
|  - newCustomInstructions joined    |
|  - userDisplayMessage joined       |
|  - blockedBy from any blocker      |
+--------------+-------------------+
               |
               v
+----------------------------------+
| throwOnPreCompactHookBlock (FM8)   |
| Throws if blockedBy is set         |
| ($rH prefix on the Error message)  |
+--------------+-------------------+
               |
        +------+------+
        | not blocked | blocked
        v             v
+----------------+ +-----------------+
| Compact runs   | | Caller catches    |
| with merged    | | exception, checks |
| customInstrs   | | $rH prefix:        |
+--------+-------+ |   - autocompact:   |
         |         |     return         |
         v         |     {wasCompacted:  |
+----------------+ |      false}        |
| Summary built  | |     (no failure    |
| Cleanup runs   | |      count bump)   |
+--------+-------+ |   - /compact:      |
         |         |     show "blocked  |
         v         |      by hook"      |
+----------------+ |     notification   |
| executePost-   | +-------------------+
| CompactHooks   |
| (zMH)          |
+----------------+
```

**Key insight:** PreCompact is the only hook in the system that can *prevent* a model action (vs PreToolUse which can prevent a tool but with a per-call gate). The `decision: "block"` contract is wired through the same generic hook dispatcher (`dispatchHookEvent` / `YW`) that all other hooks use — what makes it different is the special handling in `throwOnPreCompactHookBlock` and the `$rH` prefix in the resulting Error, which distinguishes intentional blocks from real failures everywhere downstream (circuit breakers, telemetry, error logs all treat the prefix as a signal to *not* count this as a real error).
