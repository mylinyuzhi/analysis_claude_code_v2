# PreCompact Hook — Blocking Compaction (v2.1.105)

## Overview

v2.1.105 introduced the ability for `PreCompact` hooks to **veto a compaction**. Before v2.1.105, the hook could append `customInstructions` to the summary prompt and emit a user-visible message but could not stop compaction from proceeding. After v2.1.105, a `PreCompact` hook that:

- **exits with code 2**, OR
- **returns JSON with `{"decision": "block"}`** (top-level, not nested under `hookSpecificOutput`)

…causes the compaction to be aborted before the LLM summarization request is sent. The error is captured via `BLOCKED_BY_PRECOMPACT_MESSAGE` (`GI6`) and treated specially by both manual and reactive (autocompact) callers.

## v2.1.88 vs v2.1.112

In v2.1.88 (`src/utils/hooks.ts:3961-4025`), `executePreCompactHooks` returns:

```typescript
Promise<{
  newCustomInstructions?: string
  userDisplayMessage?: string
}>
```

…with no concept of blocking. The result is consumed in `compact.ts:413-424`:

```typescript
const hookResult = await executePreCompactHooks(...)
customInstructions = mergeHookInstructions(customInstructions, hookResult.newCustomInstructions)
// proceeds unconditionally to summarization
```

In v2.1.112, the return type gains an optional `blockedBy` field, and the call site adds a `throwIfPreCompactBlocked` guard that surfaces an error caller code recognizes by string prefix.

## Related Symbols

> Symbol mappings: see [symbol_index.md](../00_overview/symbol_index.md). New mappings: [symbol_additions_unit_09.md](../00_overview/symbol_additions_unit_09.md).

Key functions and constants:

- `preCompactHook` (`oc`) — chunks.192.mjs:2406 (replaces v2.1.88 `executePreCompactHooks`)
- `throwIfPreCompactBlocked` (`ec8`) — chunks.159.mjs:533
- `BLOCKED_BY_PRECOMPACT_MESSAGE` (`GI6`) — chunks.159.mjs:1200, `"Compaction blocked by PreCompact hook"`
- `performCompaction` (`vI6`) — chunks.159.mjs:574 (the v2.1.112 equivalent of `compactConversation` in compact.ts:387)
- `runReactiveCompact` (`tC8` / `Dr1` caller) — chunks.101.mjs:1547
- `executeCommandHook` (`Wa8`) — chunks.193.mjs:151 (where the exit-2 vs decision:"block" detection runs)
- `compactionBlockedException` (`be`) — chunks.159.mjs:1204 (custom Error subclass)

## The PreCompact Dispatcher (`oc`)

```javascript
// ============================================
// preCompactHook - Runs PreCompact hooks; can return blockedBy if any hook vetoes
// Location: chunks.192.mjs:2406-2443
// ============================================

// ORIGINAL (for source lookup):
async function oc(q, K, _ = u_) {
    let z = {
            ...J9(void 0),
            hook_event_name: "PreCompact",
            trigger: q.trigger,
            custom_instructions: q.customInstructions
        },
        Y = await BX({ hookInput: z, matchQuery: q.trigger, signal: K, timeoutMs: _ });
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
        newCustomInstructions: A.length > 0 ? A.join("\n\n") : void 0,
        userDisplayMessage: O.length > 0 ? O.join("\n") : void 0,
        ...w.length > 0 && {
            blockedBy: w.map(($) => {
                let j = $.output.trim();
                return `[${$.command}]${j?`: ${j}`:""}`
            }).join("\n")
        }
    }
}

// READABLE (for understanding):
async function preCompactHook(compactData, signal, timeoutMs = HOOK_DEFAULT_TIMEOUT) {
  const hookInput = {
    ...createBaseHookInput(undefined),
    hook_event_name: "PreCompact",
    trigger: compactData.trigger,                       // "manual" | "auto"
    custom_instructions: compactData.customInstructions,
  };
  const results = await executeHooksOutsideREPL({
    hookInput,
    matchQuery: compactData.trigger,
    signal,
    timeoutMs,
  });
  if (results.length === 0) return {};

  // Filter for instructions: succeeded AND not blocked AND non-empty output
  const successfulOutputs = results
    .filter(r => r.succeeded && !r.blocked && r.output.trim().length > 0)
    .map(r => r.output.trim());

  // Build user-visible status messages (one per hook)
  const displayMessages = [];
  for (const r of results) {
    if (r.succeeded && !r.blocked) {
      displayMessages.push(r.output.trim()
        ? `PreCompact [${r.command}] completed successfully: ${r.output.trim()}`
        : `PreCompact [${r.command}] completed successfully`);
    } else {
      displayMessages.push(r.output.trim()
        ? `PreCompact [${r.command}] failed: ${r.output.trim()}`
        : `PreCompact [${r.command}] failed`);
    }
  }

  // Collect blocked-by descriptors for any hook with blocked: true
  const blockers = results.filter(r => r.blocked);

  return {
    newCustomInstructions: successfulOutputs.length > 0 ? successfulOutputs.join("\n\n") : undefined,
    userDisplayMessage: displayMessages.length > 0 ? displayMessages.join("\n") : undefined,
    ...(blockers.length > 0 && {
      blockedBy: blockers.map(b => {
        const trimmed = b.output.trim();
        return `[${b.command}]${trimmed ? `: ${trimmed}` : ""}`;
      }).join("\n"),
    }),
  };
}

// Mapping: oc→preCompactHook, q→compactData, K→signal, _→timeoutMs,
//          BX→executeHooksOutsideREPL, J9→createBaseHookInput, Y→results,
//          A→successfulOutputs, O→displayMessages, w→blockers, $→r
```

## The Guard (`ec8`)

The guard fires the throw if any hook blocked:

```javascript
// ============================================
// throwIfPreCompactBlocked - Throw GI6-prefixed error when blockedBy is set
// Location: chunks.159.mjs:533-544
// ============================================

// ORIGINAL (for source lookup):
function ec8(q, K, _) {
    if (!q.blockedBy) return;
    if (E(`Compaction blocked by PreCompact hook: ${q.blockedBy}`, { level: "warn" }),
        !_?.suppressNotification) K.addNotification?.({
            key: "compaction-blocked-by-hook",
            text: "compaction blocked by PreCompact hook",
            priority: "immediate",
            color: "warning"
        });
    throw new be(`${GI6}: ${q.blockedBy}`)
}

// READABLE (for understanding):
function throwIfPreCompactBlocked(hookResult, toolUseContext, options) {
  if (!hookResult.blockedBy) return;
  logForDebugging(
    `Compaction blocked by PreCompact hook: ${hookResult.blockedBy}`,
    { level: "warn" },
  );
  if (!options?.suppressNotification) {
    toolUseContext.addNotification?.({
      key: "compaction-blocked-by-hook",
      text: "compaction blocked by PreCompact hook",
      priority: "immediate",
      color: "warning",
    });
  }
  throw new CompactionBlockedException(`${BLOCKED_BY_PRECOMPACT_MESSAGE}: ${hookResult.blockedBy}`);
}

// Mapping: ec8→throwIfPreCompactBlocked, q→hookResult, K→toolUseContext, _→options,
//          E→logForDebugging, GI6→BLOCKED_BY_PRECOMPACT_MESSAGE, be→CompactionBlockedException
```

## Detecting `blocked` at Hook Execution

`blocked` is set independently of `succeeded` inside `executeCommandHook` (`Wa8`):

```javascript
// ============================================
// commandHookResult.blocked - Set on exit code 2 OR JSON decision:"block"
// Location: chunks.193.mjs:1541-1553
// ============================================

// ORIGINAL (for source lookup):
let R = k && bu(k) && k.decision === "block",
    h = V.status === 2 || !!R,
    C = R ? k && bu(k) && k.reason || V.stderr || "" : V.status === 0 ? V.stdout || "" : V.stderr || "",
    ...
return {
    command: M.command,
    succeeded: V.status === 0,
    output: C,
    blocked: h,
    ...
}

// READABLE (for understanding):
const hasJsonBlock = parsedJson && isSyncJson(parsedJson) && parsedJson.decision === "block";
const isBlocked = procResult.status === 2 || !!hasJsonBlock;
const output = hasJsonBlock
  ? (parsedJson?.reason || procResult.stderr || "")
  : (procResult.status === 0 ? procResult.stdout || "" : procResult.stderr || "");
return {
  command: hookCommand,
  succeeded: procResult.status === 0,                   // exit 0 = succeeded
  output,
  blocked: isBlocked,                                    // ← independent of succeeded
  ...
};

// Mapping: R→hasJsonBlock, h→isBlocked, V→procResult, M→hookCommand,
//          bu→isSyncJson, C→output, k→parsedJson
```

A hook that exits 2 is `succeeded: false` but `blocked: true`. A hook that exits 0 but returns `{"decision":"block"}` in JSON is `succeeded: true` but `blocked: true`. The `oc` dispatcher uses `blocked` (NOT `succeeded`) to decide whether to add the hook to `blockers`. This matters for telemetry: a deliberate block does not count as a hook failure.

## Call Sites — Manual vs Reactive Compaction

### Manual Compaction (within `performCompaction` / `vI6`)

```javascript
// ============================================
// performCompaction.preCompactPhase - Run hooks, throw if blocked
// Location: chunks.159.mjs:584-590
// ============================================

// ORIGINAL (for source lookup):
let M = await oc({
    trigger: A ? "auto" : "manual",
    customInstructions: Y ?? null
}, K.abortController.signal);
ec8(M, K, { suppressNotification: A }),
Y = r_7(Y, M.newCustomInstructions);

// READABLE (for understanding):
const hookResult = await preCompactHook(
  {
    trigger: isAutoCompact ? "auto" : "manual",
    customInstructions: customInstructions ?? null,
  },
  toolUseContext.abortController.signal,
);
throwIfPreCompactBlocked(hookResult, toolUseContext, { suppressNotification: isAutoCompact });
customInstructions = mergeHookInstructions(customInstructions, hookResult.newCustomInstructions);

// Mapping: M→hookResult, oc→preCompactHook, A→isAutoCompact, K→toolUseContext, Y→customInstructions,
//          ec8→throwIfPreCompactBlocked, r_7→mergeHookInstructions
```

### Reactive Compaction (autocompact path)

The reactive path explicitly checks `blockedBy` and short-circuits without throwing — the autocompact circuit-breaker would otherwise count it as a failure:

```javascript
// ============================================
// runReactiveCompact.preCompactGuard - Silently abort if hook blocks (no breaker increment)
// Location: chunks.101.mjs:1561-1570
// ============================================

// ORIGINAL (for source lookup):
let H = await oc({
    trigger: "auto",
    customInstructions: null
}, w.abortController.signal).catch((W) => {
    return j6(W), {}
});
if (H.blockedBy) return E(`Reactive compact blocked by PreCompact hook: ${H.blockedBy}`),
    w.onCompactProgress?.({ type: "compact_end" }),
    w.setSDKStatus?.(null),
    null;

// READABLE (for understanding):
const hookResult = await preCompactHook(
  { trigger: "auto", customInstructions: null },
  toolUseContext.abortController.signal,
).catch(err => { logUnexpectedError(err); return {}; });

if (hookResult.blockedBy) {
  logForDebugging(`Reactive compact blocked by PreCompact hook: ${hookResult.blockedBy}`);
  toolUseContext.onCompactProgress?.({ type: "compact_end" });
  toolUseContext.setSDKStatus?.(null);
  return null;     // Signal "no compaction happened" but NO error thrown
}

// Mapping: H→hookResult, oc→preCompactHook, w→toolUseContext, j6→logUnexpectedError
```

### Caller-side Recovery (in-process subagent)

The in-process subagent runner catches the thrown error specifically and continues without compaction:

```javascript
// ============================================
// inProcessRunner.handlePreCompactBlock - Catch GI6-prefixed error, continue uncompacted
// Location: chunks.155.mjs:115-118
// ============================================

// ORIGINAL (for source lookup):
} catch (o) {
    if (o instanceof Error && o.message.startsWith(GI6))
        E(`[inProcessRunner] ${K.agentId} compaction blocked by PreCompact hook; continuing uncompacted`);
    else throw o
}

// READABLE (for understanding):
} catch (err) {
  if (err instanceof Error && err.message.startsWith(BLOCKED_BY_PRECOMPACT_MESSAGE)) {
    logForDebugging(
      `[inProcessRunner] ${identity.agentId} compaction blocked by PreCompact hook; continuing uncompacted`,
    );
  } else {
    throw err;
  }
}

// Mapping: GI6→BLOCKED_BY_PRECOMPACT_MESSAGE, K→identity, o→err
```

## Deep Analysis

### Algorithm: Block-Aware Result Partitioning

**What it does:** Partitions hook results into three orthogonal buckets — successful (output → custom instructions), failed (status messages), blocked (blockedBy descriptors) — so that the same hook can both block AND emit a custom-instruction (rejected) AND a display message.

**How it works:**

1. **Per-hook flags after execution.** `executeCommandHook` returns `{succeeded, blocked, output}`. The flags are independent: a hook can be `succeeded:true, blocked:true` (clean exit 0 but `decision:"block"` JSON), `succeeded:false, blocked:true` (exit 2), `succeeded:false, blocked:false` (exit non-2 non-0), or `succeeded:true, blocked:false` (clean exit 0, no block).
2. **Three filtering passes in `oc`:**
   - `successfulOutputs` = filter `succeeded && !blocked && output.trim()`. This deliberately excludes blocked-but-succeeded hooks; their output is treated as the *block reason*, not as custom instructions.
   - `displayMessages` = full loop building per-hook status strings. Blocked hooks get the "failed" branch even when `succeeded:true`, because semantically a block is a refusal regardless of exit code.
   - `blockers` = filter `blocked`. The output of each blocker becomes part of `blockedBy`.
3. **Return shape.** Custom instructions and user-visible messages are returned unconditionally; `blockedBy` is conditional via spread. The conditional spread (`...(blockers.length > 0 && {blockedBy: ...})`) avoids a `blockedBy: undefined` key in the returned object — `throwIfPreCompactBlocked` does a truthiness check that would be confused by `undefined`-valued keys in strict callers.

**Why this approach:**

- **Why partition rather than early-return on first block?** Multiple hooks may register for `PreCompact`. The dispatcher runs all of them (because each may have side effects like writing snapshot files). Aggregating block reasons means the user sees ALL blockers, not just the first one — useful when blockers are independent plugins.
- **Why is `userDisplayMessage` populated even on block?** The user needs to know which hook(s) ran successfully and which blocked, so the display message includes the full execution history. The block reason itself is on `blockedBy`.
- **Why does reactive (autocompact) not throw?** The autocompact path has a circuit-breaker (`wLK = 3` consecutive failures). If a deliberate block incremented the failure counter, three consecutive blocks would disable autocompact for the rest of the session. The reactive path returns `null` (no compaction happened) instead of throwing, leaving the breaker untouched. The manual path throws because the user explicitly invoked `/compact` and deserves the loud error.

**Key insight:** The `blocked` flag is `succeeded`-orthogonal. This subtle decoupling is what makes the feature composable: a hook can do useful work (return instructions in its stdout), but if it ALSO sets `decision:"block"`, those instructions are dropped and the block path is taken. This avoids the "if the hook failed, did it block on purpose or by accident?" ambiguity.

### Decision: Why Two Different Block Mechanisms (exit-2 AND `decision:"block"`)?

**v2.1.88 baseline:** Generic hook protocol used exit-2 to signal block for `PreToolUse`, `UserPromptSubmit`, etc. JSON `decision:"block"` was the same signal expressed structurally.

**v2.1.105 extension:** `PreCompact` already supported exit-2 as a generic process-level signal, but the JSON `decision:"block"` path was the new addition for *typed* communication. The two mechanisms are:

- **exit-2** — useful for shell scripts that simply `exit 2` after their check fails. No need to emit JSON.
- **`{"decision":"block"}` + optional `reason`** — useful when the hook also wants to emit structured data like a custom reason or a `systemMessage`.

Both produce the same `blocked: true` flag downstream, and the `reason` (from JSON) or `stderr` (from exit-2) populates the `output` field that ends up in `blockedBy`.

### Trade-off: Why Add `blockedBy` Instead of Reusing `userDisplayMessage`?

**Considered alternative:** Reuse `userDisplayMessage` to signal blocks (e.g., look for "failed" status).

**Why rejected:** `userDisplayMessage` is a *display* concern (rendered to the user). `blockedBy` is a *control* concern (changes whether compaction proceeds). Conflating them would force callers to parse free-form strings to determine flow control — fragile and locale-dependent. Keeping `blockedBy` as a distinct optional field on the return object makes the intent unambiguous and survives display-string changes.

## Edge Cases & Gotchas

1. **Hook with `succeeded:true, blocked:true` drops its instruction output.** If a hook's stdout contains "Add this guidance" AND it sets `decision:"block"`, the guidance is discarded. This is intentional — a blocker is a veto, not a soft suggestion. To make conditional instructions, the hook should NOT set `decision:"block"` and should instead emit instructions on exit 0.
2. **`blockedBy` string format includes commands.** Each blocker is rendered as `[<command>]: <output>`. The leading `[<command>]` makes it easy for users to identify which hook blocked. The `reason` from JSON (or `stderr` from exit-2) supplies the post-colon explanation.
3. **`be` is a custom Error class** (chunks.159.mjs:1204, `class be extends Error`). Callers can do `err instanceof be` to detect it — but the current call sites (e.g., inProcessRunner) use `message.startsWith(BLOCKED_BY_PRECOMPACT_MESSAGE)` because the message prefix is more stable across minification.
4. **No retry semantics here.** PreCompact blocks are terminal for the current compaction attempt. The user (or auto-trigger) must re-invoke compaction; the hook may then permit it (perhaps because state changed).
5. **Telemetry quirk:** PreCompact-hook-blocked errors are *swallowed without incrementing the autocompact failure counter* (see `runReactiveCompact` returning `null` early). This is intentional — using the feature shouldn't burn the breaker budget. Confirmed in `chunks.101.mjs:1568-1570`.
