# Hooks System — PreCompact, PostCompact, SessionStart("compact")

## Overview

The compact subsystem in v2.1.112 fires three distinct hooks during the lifecycle:

1. **PreCompact** (`oc`) — Before LLM summarization. Can **block** the entire compaction or inject custom instructions.
2. **PostCompact** (`K36`) — After all attachments are restored. Cannot block; only emits a user-visible message.
3. **SessionStart** (`lR("compact", ...)`) — Called within `vI6` Phase 6, with source `"compact"`. Lets users wire init logic that runs both at fresh session start AND post-compact.

PreCompact is the most powerful — its `decision: "block"` mechanism is the only user-facing way to *prevent* a specific compaction. The others are observational + optional state augmentation.

This document covers the implementation of all three hooks, the decision protocol (block / allow / silent), and how their outputs flow through `vI6`.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Hooks module

Key functions in this document:
- `preCompactHook` (`oc`) — chunks.192.mjs:2406
- `throwIfPreCompactBlocked` (`ec8`) — chunks.159.mjs:533
- `postCompactHook` (`K36`) — chunks.192.mjs:2445
- `sessionStartHook` (`lR`) — chunks.101.mjs:1729 (referenced)
- `runHooks` (`BX`) — referenced (the underlying hook runner)
- `buildHookEnvelope` (`J9`) — referenced (env vars + cwd snapshot)
- `mergeInstructions` (`r_7`) — chunks.159.mjs:566

Constants:
- `GI6` — `"Compaction blocked by PreCompact hook"` — error prefix
- `u_` — default hook timeout (likely 30s or 60s)

---

## 1. The Three Hooks in `vI6`

The hook firings, in order, within `vI6`:

```javascript
// PHASE 1 — PreCompact hook (chunks.159.mjs:586)
let M = await oc({trigger: A ? "auto" : "manual", customInstructions: Y ?? null},
                  K.abortController.signal);
ec8(M, K, {suppressNotification: A});       // Throws GI6-prefixed error if blocked
Y = r_7(Y, M.newCustomInstructions);

// PHASE 6 — SessionStart hook (chunks.159.mjs:666)
K.onCompactProgress?.({type:"hooks_start", hookType: "session_start"});
let S = await lR("compact", {model: K.options.mainLoopModel});

// PHASE 8 — PostCompact hook (chunks.159.mjs:710)
K.onCompactProgress?.({type:"hooks_start", hookType: "post_compact"});
let O6 = await K36({trigger: A ? "auto" : "manual", compactSummary: V},
                   K.abortController.signal);
let J6 = [P, O6.userDisplayMessage].filter(Boolean).join("\n");
```

The user-visible output combines PreCompact's `userDisplayMessage` (from `P = M.userDisplayMessage`) with PostCompact's, joined by newline. SessionStart's output is added to the attachment list (not the user-visible message).

---

## 2. The PreCompact Hook (`oc`)

```javascript
// ============================================
// preCompactHook - Runs before LLM summarization. Can block via "blockedBy" return.
// Location: chunks.192.mjs:2406-2443
// ============================================

// ORIGINAL:
async function oc(q, K, _ = u_) {
    let z = {
            ...J9(void 0),
            hook_event_name: "PreCompact",
            trigger: q.trigger,
            custom_instructions: q.customInstructions
        },
        Y = await BX({
            hookInput: z,
            matchQuery: q.trigger,
            signal: K,
            timeoutMs: _
        });
    if (Y.length === 0) return {};

    let A = Y.filter(($) => $.succeeded && !$.blocked && $.output.trim().length > 0).map(($) => $.output.trim()),
        O = [];
    for (let $ of Y)
        if ($.succeeded && !$.blocked)
            if ($.output.trim()) O.push(`PreCompact [${$.command}] completed successfully: ${$.output.trim()}`);
            else O.push(`PreCompact [${$.command}] completed successfully`);
        else if ($.output.trim()) O.push(`PreCompact [${$.command}] failed: ${$.output.trim()}`);
        else O.push(`PreCompact [${$.command}] failed`);
    let w = Y.filter(($) => $.blocked);

    return {
        newCustomInstructions: A.length > 0 ? A.join(`\n\n`) : void 0,
        userDisplayMessage: O.length > 0 ? O.join(`\n`) : void 0,
        ...w.length > 0 && {
            blockedBy: w.map(($) => {
                let j = $.output.trim();
                return `[${$.command}]${j ? `: ${j}` : ""}`
            }).join(`\n`)
        }
    }
}

// READABLE:
async function preCompactHook(args, abortSignal, timeoutMs = HOOK_DEFAULT_TIMEOUT) {
  // Build hook input envelope (envvar snapshot, cwd, etc.)
  const hookInput = {
    ...buildHookEnvelope(undefined),
    hook_event_name: "PreCompact",
    trigger: args.trigger,                       // "auto" | "manual"
    custom_instructions: args.customInstructions, // string | null
  };

  // Run all matching hook commands
  const results = await runHooks({
    hookInput,
    matchQuery: args.trigger,
    signal: abortSignal,
    timeoutMs,
  });

  if (results.length === 0) return {};

  // Successful hook outputs become custom instructions
  const newCustomInstructions = results
    .filter(r => r.succeeded && !r.blocked && r.output.trim().length > 0)
    .map(r => r.output.trim());

  // Per-result status messages for the user
  const userDisplayLines = [];
  for (const r of results) {
    if (r.succeeded && !r.blocked) {
      if (r.output.trim()) userDisplayLines.push(`PreCompact [${r.command}] completed successfully: ${r.output.trim()}`);
      else userDisplayLines.push(`PreCompact [${r.command}] completed successfully`);
    } else {
      if (r.output.trim()) userDisplayLines.push(`PreCompact [${r.command}] failed: ${r.output.trim()}`);
      else userDisplayLines.push(`PreCompact [${r.command}] failed`);
    }
  }

  // Blocked hooks join into a single blockedBy string
  const blocked = results.filter(r => r.blocked);

  return {
    newCustomInstructions: newCustomInstructions.length > 0 ? newCustomInstructions.join("\n\n") : undefined,
    userDisplayMessage: userDisplayLines.length > 0 ? userDisplayLines.join("\n") : undefined,
    ...(blocked.length > 0 && {
      blockedBy: blocked.map(r => {
        const out = r.output.trim();
        return `[${r.command}]${out ? `: ${out}` : ""}`;
      }).join("\n"),
    }),
  };
}

// Mapping: oc→preCompactHook, q→args, K→abortSignal, _→timeoutMs,
//          J9→buildHookEnvelope, BX→runHooks, u_→HOOK_DEFAULT_TIMEOUT
```

### Hook Input Envelope

The `hookInput` passed to user-defined commands includes:

```typescript
{
  ...buildHookEnvelope(),              // envvars, cwd, session id, etc.
  hook_event_name: "PreCompact",       // dispatch identifier
  trigger: "auto" | "manual",          // what initiated the compact
  custom_instructions: string | null   // user's /compact <text> input
}
```

Hook commands can use `hook_event_name` to filter (e.g., a single hook script that handles multiple events).

### Match Query

`matchQuery: q.trigger` — passes the trigger string ("auto" or "manual") to the hook runner. Hooks defined in `settings.json` can have `matchers` that filter by this string. For example:

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "manual",            // only fires on /compact, not autocompact
        "hooks": [{"type": "command", "command": "echo 'manual compact running'"}]
      }
    ]
  }
}
```

### Three Output Categories

For each hook command result, classification is:

| State | Definition | Effect |
|-------|------------|--------|
| **Succeeded + not blocked** | Hook returned exit 0 (or stdout-blocked-output is missing) | `output` becomes new custom instruction; `userDisplayMessage` says "completed successfully" |
| **Succeeded + blocked** | Hook returned `decision: "block"` in stdout JSON | `output` joins `blockedBy`; `vI6` will throw |
| **Failed** | Hook returned non-zero exit, threw, or timed out | `userDisplayMessage` says "failed"; doesn't block |

### How Blocking Works

The hook runner (`BX`) parses each hook's stdout. If the JSON output contains `decision: "block"`, the result has `blocked: true`. The `oc` function aggregates all blocked results into the `blockedBy` field.

A typical blocking hook would output:

```json
{"decision": "block", "reason": "session contains uncommitted credential changes"}
```

When `blockedBy` is non-empty, the next call (`ec8`) throws.

---

## 3. The Block Throw — `ec8`

```javascript
// ============================================
// throwIfPreCompactBlocked - Throw GI6-prefixed error to bail out of vI6
// Location: chunks.159.mjs:533-544
// ============================================

// ORIGINAL:
function ec8(q, K, _) {
    if (!q.blockedBy) return;
    if (E(`Compaction blocked by PreCompact hook: ${q.blockedBy}`, {level: "warn"}),
        !_?.suppressNotification)
        K.addNotification?.({
            key: "compaction-blocked-by-hook",
            text: "compaction blocked by PreCompact hook",
            priority: "immediate",
            color: "warning"
        });
    throw new be(`${GI6}: ${q.blockedBy}`)
}

// READABLE:
function throwIfPreCompactBlocked(hookResult, sessionContext, opts) {
  if (!hookResult.blockedBy) return;
  log(`Compaction blocked by PreCompact hook: ${hookResult.blockedBy}`, {level: "warn"});
  if (!opts?.suppressNotification) {
    sessionContext.addNotification?.({
      key: "compaction-blocked-by-hook",
      text: "compaction blocked by PreCompact hook",
      priority: "immediate",
      color: "warning",
    });
  }
  throw new BeError(`${PRE_COMPACT_BLOCKED_PREFIX}: ${hookResult.blockedBy}`);
}

// Mapping: ec8→throwIfPreCompactBlocked, q→hookResult, K→sessionContext, _→opts,
//          E→log, be→BeError, GI6→PRE_COMPACT_BLOCKED_PREFIX ("Compaction blocked by PreCompact hook")
```

### The Notification Suppression Pattern

```javascript
ec8(M, K, {suppressNotification: A});
```

Where `A = isAuto`:
- For autocompact (`A = true`), `suppressNotification: true` → user doesn't see a notification.
- For manual `/compact` (`A = false`), `suppressNotification: false` → user sees a warning notification.

This asymmetry is intentional. Autocompact runs as a background optimization — surfacing user-policy blocks every time would be noisy and confusing ("why is my session warning me about something I didn't trigger?"). Manual `/compact` is an explicit user action — they need to know why it didn't work.

### The Error Prefix Contract

```javascript
throw new be(`${GI6}: ${q.blockedBy}`)
```

The error message starts with `GI6 = "Compaction blocked by PreCompact hook"`. This prefix is what the dispatcher checks:

```javascript
// chunks.159.mjs:1417 (in QkK)
if (b6(M).startsWith(GI6)) return { wasCompacted: !1 };
```

Recognized → silent skip. **Critically, this does NOT increment `consecutiveFailures`** — a user-policy block isn't a system failure. So even if the same hook keeps blocking compaction every turn, the consecutive-failure circuit breaker won't trip.

### Why Blocking is Independent

PreCompact's block is the **only mechanism** that lets the user say "don't compact right now." This is needed for cases like:

- **Uncommitted work in progress** — "wait until I commit before clearing my context"
- **Investigation in progress** — "I'm in the middle of debugging; the summary will lose nuance"
- **External dependency** — "compact paused while a cron job is running"

The block decision is per-trigger because of `matchQuery`. A hook can block manual compacts but not autocompacts (or vice versa).

---

## 4. The PostCompact Hook (`K36`)

```javascript
// ============================================
// postCompactHook - Runs after all restoration is done. No blocking; only userDisplayMessage.
// Location: chunks.192.mjs:2445-2470
// ============================================

// ORIGINAL:
async function K36(q, K, _ = u_) {
    let z = {
            ...J9(void 0),
            hook_event_name: "PostCompact",
            trigger: q.trigger,
            compact_summary: q.compactSummary
        },
        Y = await BX({
            hookInput: z,
            matchQuery: q.trigger,
            signal: K,
            timeoutMs: _
        });
    if (Y.length === 0) return {};
    let A = [];
    for (let O of Y)
        if (O.succeeded)
            if (O.output.trim()) A.push(`PostCompact [${O.command}] completed successfully: ${O.output.trim()}`);
            else A.push(`PostCompact [${O.command}] completed successfully`);
        else if (O.output.trim()) A.push(`PostCompact [${O.command}] failed: ${O.output.trim()}`);
        else A.push(`PostCompact [${O.command}] failed`);
    return {
        userDisplayMessage: A.length > 0 ? A.join(`\n`) : void 0
    }
}

// READABLE:
async function postCompactHook(args, abortSignal, timeoutMs = HOOK_DEFAULT_TIMEOUT) {
  const hookInput = {
    ...buildHookEnvelope(undefined),
    hook_event_name: "PostCompact",
    trigger: args.trigger,                       // "auto" | "manual"
    compact_summary: args.compactSummary,        // The LLM-produced summary text
  };
  const results = await runHooks({
    hookInput,
    matchQuery: args.trigger,
    signal: abortSignal,
    timeoutMs,
  });
  if (results.length === 0) return {};

  const userDisplayLines = [];
  for (const r of results) {
    if (r.succeeded) {
      if (r.output.trim()) userDisplayLines.push(`PostCompact [${r.command}] completed successfully: ${r.output.trim()}`);
      else userDisplayLines.push(`PostCompact [${r.command}] completed successfully`);
    } else {
      if (r.output.trim()) userDisplayLines.push(`PostCompact [${r.command}] failed: ${r.output.trim()}`);
      else userDisplayLines.push(`PostCompact [${r.command}] failed`);
    }
  }
  return {
    userDisplayMessage: userDisplayLines.length > 0 ? userDisplayLines.join("\n") : undefined,
  };
}

// Mapping: K36→postCompactHook, q→args, K→abortSignal, _→timeoutMs
```

### Differences from PreCompact

| Aspect | PreCompact (`oc`) | PostCompact (`K36`) |
|--------|-------------------|---------------------|
| Can block? | Yes (`blockedBy`) | No |
| Inputs | `trigger`, `custom_instructions` | `trigger`, `compact_summary` |
| Outputs | `newCustomInstructions`, `userDisplayMessage`, `blockedBy` | `userDisplayMessage` only |
| When | Phase 1 of `vI6` | Phase 8 of `vI6` |
| Use case | Inject instructions, prevent compact | Notify user, log to external system |

### Use Cases for PostCompact

PostCompact has access to `compact_summary`, which is the LLM's summary text. This enables:

- **Logging/audit**: persist the summary to an external log so it's recoverable later.
- **Notification**: send Slack/email/PagerDuty about the compact event.
- **Quality monitoring**: pass the summary to an external grader and report quality metrics.
- **State synthesis**: parse the summary for structured data (file paths, decisions) and update an external knowledge base.

The hook can't prevent the compact (it's already done), but it can react to it.

---

## 5. The SessionStart Hook with `compact` Source

In Phase 6 of `vI6`:

```javascript
let S = await lR("compact", {model: K.options.mainLoopModel});
```

`lR("compact", ...)` invokes the **same** SessionStart hook that runs at fresh session start, but with source `"compact"` so user-defined hooks can branch on whether this is a fresh start or a post-compact rebirth.

### Hook Output Becomes Attachments

Unlike PreCompact and PostCompact (whose outputs feed `userDisplayMessage`), SessionStart hook outputs are added to the attachment list:

```javascript
// chunks.159.mjs:691
let A6 = qT([U, ...l, ...C, ...S]);   // S = SessionStart hook results, included in attachments
```

This means SessionStart hook output is **part of the post-compact prompt** — the model sees it in subsequent turns. This is the preferred channel for "always re-introduce this context" behavior:

- "Always re-print the project's `README.md` summary"
- "Always show the Git branch and uncommitted file list"
- "Always re-attach the latest deployment manifest"

### Why share with fresh-start?

The same hook firing for both fresh-start AND post-compact ensures **operational consistency**:

- Fresh user invokes Claude in a project → SessionStart fires → context is set up.
- Same project hits autocompact → SessionStart fires again → same context is re-established.

Without this, a long-running session would gradually diverge from a fresh-start session in subtle ways (e.g., custom directives present at start but not at compact-resume).

The `source` discriminator lets users opt out of running heavy hooks on every compact:

```bash
#!/bin/bash
# user-hook script
if [ "$source" = "compact" ]; then
  # Light reminder for compact restart
  echo "Project context restored"
else
  # Heavy initial setup
  ./setup-environment.sh
fi
```

---

## 6. The Underlying Hook Runner (`BX`)

`BX` (referenced) is the unified hook runner shared across all hook events. Its general structure:

```javascript
async function BX({hookInput, matchQuery, signal, timeoutMs}) {
  // 1. Load all hooks for hookInput.hook_event_name
  // 2. Filter by matcher matching matchQuery
  // 3. For each matching hook, fork a process with hookInput piped to stdin
  // 4. Collect stdout, classify as succeeded/failed/blocked based on stdout JSON
  // 5. Return array of {command, output, succeeded, blocked, error?}
  // 6. Respect signal (abort) and timeoutMs
}
```

The key behavior contract:
- Hook outputs JSON to stdout. The JSON may include `decision: "block" | "allow"` and optional `reason`.
- Plain text output (non-JSON) is treated as `output: <text>` with `succeeded: true`.
- Non-zero exit code = `succeeded: false`.
- Timeout = `succeeded: false` with error in output.

The exact `BX` implementation lives outside the compact module; what matters here is what `oc` and `K36` do with the results.

---

## 7. Hook Lifecycle in a Compact Event

```
┌─────────────────────────────────────────────────────────────────────┐
│                    User triggers compact                              │
│                  (autocompact or /compact <text>)                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  vI6 Phase 1                                                         │
│  ─────────────                                                       │
│  oc({trigger, customInstructions})                                   │
│  - Load PreCompact hooks                                             │
│  - Match by trigger ("auto" or "manual")                             │
│  - Run each hook command, parallel                                   │
│  - Collect outputs                                                   │
│  ec8(result)                                                         │
│  - If blockedBy: throw → silent skip (no failure++)                  │
│  - Else: continue with merged customInstructions                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                   ... compact LLM call ...
                              │
                              ▼
                   ... attachments restored ...
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  vI6 Phase 6                                                         │
│  ─────────────                                                       │
│  lR("compact", {model})                                              │
│  - Load SessionStart hooks                                           │
│  - Match by source ("compact")                                       │
│  - Run each hook                                                     │
│  - Wrap outputs as attachment messages                               │
│  - Append to attachment list                                         │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                   ... boundary marker, telemetry ...
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  vI6 Phase 8                                                         │
│  ─────────────                                                       │
│  K36({trigger, compactSummary})                                      │
│  - Load PostCompact hooks                                            │
│  - Match by trigger                                                  │
│  - Run each hook                                                     │
│  - Collect outputs as userDisplayMessage                             │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Return                                                              │
│  - userDisplayMessage = [PreCompactDisplayMsg, PostCompactDisplayMsg]│
│                          .filter(Boolean).join("\n")                 │
│  - attachments includes SessionStart outputs                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 8. Hook Configuration Examples

### Block Manual Compact When Tests Are Failing

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "manual",
        "hooks": [
          {
            "type": "command",
            "command": "if ! npm test --silent 2>/dev/null; then echo '{\"decision\":\"block\",\"reason\":\"tests failing\"}'; fi"
          }
        ]
      }
    ]
  }
}
```

When the user invokes `/compact`, this hook runs `npm test`. If tests fail, the hook outputs the block JSON. `vI6` throws `Compaction blocked by PreCompact hook: [user-hook]: tests failing`. The user sees a notification and the compact is aborted.

Autocompact (with `matcher: "auto"`) wouldn't trigger this because the matcher is `"manual"`.

### Inject Custom Instructions

```json
{
  "hooks": {
    "PreCompact": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Always preserve discussion of the bug at issue-#1234.'"
          }
        ]
      }
    ]
  }
}
```

The hook's stdout becomes `newCustomInstructions`. In `vI6`, `r_7(Y, M.newCustomInstructions)` merges:

```
{user's /compact text}\n\nAlways preserve discussion of the bug at issue-#1234.
```

Which then appears in the compact prompt's `Additional Instructions:` section.

### Re-Attach Project Context on Compact

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [
          {
            "type": "command",
            "command": "cat .project-context.md"
          }
        ]
      }
    ]
  }
}
```

When SessionStart fires with source `"compact"`, the hook prints the project context file. The output becomes an attachment in the post-compact prompt — the model always re-receives this context after compact (but not at fresh-start).

### Log Every Compact Event

```json
{
  "hooks": {
    "PostCompact": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo \"$(date) compact: $trigger summary=$compact_summary\" >> compact.log"
          }
        ]
      }
    ]
  }
}
```

PostCompact has access to `compact_summary` via the env var (`hookInput` variables are exposed to the hook process). This logs every compact event with the LLM-produced summary.

---

## 9. Why is PostCompact Hooks Output a `userDisplayMessage`?

The output of PostCompact joins with PreCompact's user-display message via:

```javascript
let J6 = [P, O6.userDisplayMessage].filter(Boolean).join("\n");
```

This combined message is shown to the user **above** the next prompt — it's a one-time display that doesn't go into the conversation. So:

- Hooks that want to **inform the user** about something (success, follow-up needed) → use `userDisplayMessage`.
- Hooks that want to **inform the model** about something (project context, decisions) → use SessionStart instead.

The split forces a clean separation:
- PreCompact + PostCompact + console = user-facing
- SessionStart = model-facing

---

## 10. Comparison with v2.1.88

| Feature | v2.1.88 | v2.1.112 |
|---------|---------|----------|
| PreCompact hook | ✅ shipped | ✅ shipped (same `oc` semantics) |
| PostCompact hook | ✅ shipped | ✅ shipped (same `K36` semantics) |
| SessionStart with `compact` source | ✅ shipped | ✅ shipped (same `lR("compact", ...)` semantics) |
| `decision: "block"` mechanism | ✅ shipped | ✅ shipped |
| Notification suppression for autocompact | ✅ shipped | ✅ shipped (`suppressNotification: isAuto`) |
| Hook input `hook_event_name` | ✅ shipped | ✅ shipped |
| Hook input `trigger` | ✅ shipped | ✅ shipped (`"auto"` / `"manual"`) |
| Hook input `custom_instructions` (PreCompact) | ✅ shipped | ✅ shipped |
| Hook input `compact_summary` (PostCompact) | ✅ shipped | ✅ shipped |

The hook system is essentially unchanged. The implementation files are organized differently (in 2.1.88 they were under `services/compact/`, in 2.1.112 they're spread across `chunks.192.mjs` and `chunks.159.mjs`), but the API contract and behavior match.

---

## 11. Edge Cases

### Hook Times Out

The hook runner `BX` has `timeoutMs: u_` (default). If a hook exceeds the timeout, the result is `{succeeded: false, output: "<timeout message>"}`. This:
- Doesn't block compaction (no `blocked: true`).
- Adds a "PreCompact [cmd] failed: <timeout>" line to `userDisplayMessage`.

If the hook would have blocked but timed out, **the block doesn't happen**. This is fail-open: the compact proceeds. This is consistent with the philosophy that hooks are advisory — a timeout shouldn't permanently disable the user's session.

### Hook Throws

If a hook command throws (non-zero exit), the result is `{succeeded: false, output: <stderr>}`. Same as timeout — added to display message but doesn't block.

### Multiple Hooks Block

If three hooks all return `decision: "block"`, the `blockedBy` field aggregates all three:

```
[hook1]: reason1
[hook2]: reason2
[hook3]: reason3
```

The user sees all three reasons in the warning notification. Compaction is blocked on first detection (any block).

### Hook Modifies Conversation State

Hooks run in a **separate process**. They cannot directly modify the conversation. The only state they affect is:
- `newCustomInstructions` (for PreCompact)
- `userDisplayMessage` (for all)
- Attachment list (for SessionStart, via stdout)

This isolation is intentional: a hook misbehaving cannot corrupt the agent's internal state.

### Abort During Hook

Both `oc` and `K36` accept `signal: K.abortController.signal`. If the user aborts mid-compact (Ctrl+C, /clear), the abort propagates to the hook runner. In-progress hooks are killed; pending hooks don't start.

---

## 12. Key Insight

The hooks system is the user's **escape hatch** in the compact subsystem:

- **PreCompact** lets users **prevent** compactions they don't want.
- **PostCompact** lets users **observe** compactions for monitoring/logging.
- **SessionStart with `compact` source** lets users **augment** the post-compact context.

Together, they make compaction extensible without modifying the binary. A user with a strict no-compact-during-deploy policy can configure a PreCompact hook that checks the deploy state. A user who needs project-specific context after every compact can configure a SessionStart hook with the appropriate matcher.

The asymmetry between PreCompact (can block) and PostCompact (cannot block) reflects a deeper design choice: compact's success is desirable for the system's continued operation. Once started, it should complete. The user's veto power is exercised before the start, not after — and only PreCompact gives them that power.
