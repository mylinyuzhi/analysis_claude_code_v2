# `/compact` Slash Command Analysis

## Overview

The `/compact` slash command is a **local** slash command that manually triggers context compaction. It compresses conversation history while preserving a summary, freeing context for continued work.

**Key properties:**
- Type: `"local"` — runs in-process without spawning a subprocess
- Enabled check: `!t6(process.env.DISABLE_COMPACT)` — disabled if `DISABLE_COMPACT` env var is set
- `supportsNonInteractive: true` — can run in non-interactive (headless) mode
- Optional argument: custom summarization instructions (e.g., `/compact Focus on code changes`)
- Hidden: `false` — visible in slash command menu

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `compactCommandHandler` (PpY) - Main handler, routing logic
- `manualCompactWithReactiveMode` (WpY) - Reactive-mode compact path
- `initializeCompactCommand` (N9q) - Command object registration
- `buildCompactionContext` (G9q) - Assembles systemPrompt + userContext + toolContext
- `reactiveCompactRef` (Z9q) - Reference to reactive compact interface (null when inactive)

---

## Command Registration

### `initializeCompactCommand` (N9q)

**What it does:** Initializes and exports the compact command definition object.

**How it works:**

```javascript
// ============================================
// initializeCompactCommand - Registers /compact slash command
// Location: chunks.151.mjs:186-201
// ============================================

// ORIGINAL (for source lookup):
N9q = E(() => {
    A8();
    ZpY = {
        type: "local",
        name: "compact",
        description: "Clear conversation history but keep a summary in context. Optional: /compact [instructions for summarization]",
        isEnabled: () => !t6(process.env.DISABLE_COMPACT),
        isHidden: !1,
        supportsNonInteractive: !0,
        argumentHint: "<optional custom summarization instructions>",
        load: () => Promise.resolve().then(() => (T9q(), f9q)),
        userFacingName() { return "compact" }
    }, v9q = ZpY
})

// READABLE (for understanding):
initializeCompactCommand = lazyInit(() => {
    compactCommandDef = {
        type: "local",
        name: "compact",
        description: "Clear conversation history but keep a summary in context. Optional: /compact [instructions for summarization]",
        isEnabled: () => !isEnvVarDisabled(process.env.DISABLE_COMPACT),
        isHidden: false,
        supportsNonInteractive: true,
        argumentHint: "<optional custom summarization instructions>",
        load: () => Promise.resolve().then(() => (loadCompactModule(), compactHandlerModule)),
        userFacingName() { return "compact" }
    }
    compactCommandExport = compactCommandDef
})

// Mapping: N9q→initializeCompactCommand, ZpY→compactCommandDef, v9q→compactCommandExport, T9q→loadCompactModule, f9q→compactHandlerModule
```

The `load` function uses lazy initialization — the handler module (`f9q`) is only loaded when the command is first invoked, not at startup.

---

## Handler Decision Tree

### `compactCommandHandler` (PpY)

**What it does:** Routes the compact request to the appropriate compaction path based on session state.

**How it works:**

```javascript
// ============================================
// compactCommandHandler - Main /compact routing logic
// Location: chunks.151.mjs:131-161
// ============================================

// ORIGINAL (for source lookup):
PpY = async (A, q) => {
    let { abortController: K, messages: Y } = q;
    if (Y.length === 0) throw Error("No messages to compact");
    let z = A.trim();
    try {
        if (!z) {
            let $ = await lE1(Y, q.agentId);
            if ($) return a2.cache.clear?.(), gl(), bc6(), {
                type: "compact", compactionResult: $, displayText: oQ8(q)
            }
        }
        if (Z9q?.isReactiveOnlyMode()) return await WpY(Y, q, z, Z9q);
        let w = (await pg(Y, q)).messages,
            O = await mf6(w, q, await G9q(q, w), !1, z, !1);
        return K16(void 0), bc6(), a2.cache.clear?.(), gl(), {
            type: "compact", compactionResult: O, displayText: oQ8(q, O.userDisplayMessage)
        }
    } catch (_) {
        if (K.signal.aborted) throw Error("Compaction canceled.");
        else if ($r(_, aT6)) throw Error(aT6);
        else if ($r(_, oT6)) throw Error(oT6);
        else throw _6(_), Error(`Error during compaction: ${_}`)
    }
}

// READABLE (for understanding):
compactCommandHandler = async (customInstructions, toolUseContext) => {
    let { abortController, messages } = toolUseContext;
    if (messages.length === 0) throw Error("No messages to compact");
    let trimmedInstructions = customInstructions.trim();
    try {
        // Path 1: No custom instructions → try session memory quick path
        if (!trimmedInstructions) {
            let sessionMemoryResult = await trySessionMemoryQuickPath(messages, toolUseContext.agentId);
            if (sessionMemoryResult) {
                // Session memory succeeded — clear caches and return immediately
                return messageCache.cache.clear?.(), clearTokenEstimate(), clearCompactBoundaries(), {
                    type: "compact", compactionResult: sessionMemoryResult, displayText: formatCompactDisplay(toolUseContext)
                }
            }
        }
        // Path 2: Reactive-only mode → use reactive compact path
        if (reactiveCompactRef?.isReactiveOnlyMode()) return await manualCompactWithReactiveMode(messages, toolUseContext, trimmedInstructions, reactiveCompactRef);
        // Path 3: Standard path — microcompact first, then full compact
        let microcompactedMessages = (await microCompact(messages, toolUseContext)).messages,
            compactionResult = await performFullCompactionFlow(microcompactedMessages, toolUseContext, await buildCompactionContext(toolUseContext, microcompactedMessages), false, trimmedInstructions, false);
        return clearMessageCache(undefined), clearCompactBoundaries(), messageCache.cache.clear?.(), clearTokenEstimate(), {
            type: "compact", compactionResult, displayText: formatCompactDisplay(toolUseContext, compactionResult.userDisplayMessage)
        }
    } catch (err) {
        if (abortController.signal.aborted) throw Error("Compaction canceled.");
        else if (isError(err, ERROR_TOO_FEW_GROUPS)) throw Error(ERROR_TOO_FEW_GROUPS);
        else if (isError(err, ERROR_COMPACTION_FAILED)) throw Error(ERROR_COMPACTION_FAILED);
        else throw logError(err), Error(`Error during compaction: ${err}`)
    }
}

// Mapping: PpY→compactCommandHandler, A→customInstructions, q→toolUseContext, K→abortController, Y→messages, z→trimmedInstructions, lE1→trySessionMemoryQuickPath, Z9q→reactiveCompactRef, WpY→manualCompactWithReactiveMode, pg→microCompact, mf6→performFullCompactionFlow, G9q→buildCompactionContext, K16→clearMessageCache, gl→clearTokenEstimate, bc6→clearCompactBoundaries, a2→messageCache, oQ8→formatCompactDisplay, aT6→ERROR_TOO_FEW_GROUPS, oT6→ERROR_COMPACTION_FAILED, $r→isError, _6→logError
```

**Decision tree:**

```
compactCommandHandler(customInstructions, ctx)
├── messages.length === 0 → throw "No messages to compact"
├── !customInstructions → lE1() session memory quick path
│   └── success → clear 3 caches + return (skip microcompact + full compact)
├── Z9q.isReactiveOnlyMode() === true → WpY() reactive compact path
│   └── (Z9q is null when not in reactive mode — optional chaining)
└── default: pg() microcompact → mf6() full compact → clear 4 caches
```

**Why this approach:**

The three paths reflect a performance hierarchy:
1. **Session memory quick path** — cheapest: no microcompact, no LLM call for summarization (uses pre-built templates). Only taken when no custom instructions are given (custom instructions would change the summary content).
2. **Reactive-only mode** — delegates to the reactive compaction system when the session is running in reactive-only mode (typically during streaming).
3. **Standard path** — most expensive: microcompact first (free, token reduction), then full LLM-powered summarization.

---

## Reactive Mode Path

### `manualCompactWithReactiveMode` (WpY)

**What it does:** Handles manual `/compact` when the session is in reactive-only compaction mode. Uses the `reactiveCompactOnPromptTooLong` mechanism rather than the standard full compact flow.

**How it works:**

```javascript
// ============================================
// manualCompactWithReactiveMode - Compact via reactive system
// Location: chunks.151.mjs:57-99
// ============================================

// ORIGINAL (for source lookup):
async function WpY(A, q, K, Y) {
    q.onCompactProgress?.({ type: "hooks_start", hookType: "pre_compact" }),
    q.setSDKStatus?.("compacting");
    try {
        let [z, _] = await Promise.all([
            sT6({ trigger: "manual", customInstructions: K || null }, q.abortController.signal),
            G9q(q, A)
        ]), w = zp8(K, z.newCustomInstructions);
        q.setStreamMode?.("requesting"), q.setResponseLength?.(() => 0),
        q.onCompactProgress?.({ type: "compact_start" });
        let O = await Y.reactiveCompactOnPromptTooLong(A, _, {
            customInstructions: w, trigger: "manual"
        });
        if (!O.ok) switch (O.reason) {
            case "too_few_groups": throw Error(aT6);
            case "aborted": throw Error(zl);
            case "exhausted":
            case "error": throw Error(oT6)
        }
        K16(void 0), gl(), bc6(), a2.cache.clear?.();
        let $ = [z.userDisplayMessage, O.result.userDisplayMessage].filter(Boolean).join("\n") || void 0;
        return { type: "compact", compactionResult: { ...O.result, userDisplayMessage: $ }, displayText: oQ8(q, $) }
    } finally {
        q.setStreamMode?.("requesting"), q.setResponseLength?.(() => 0),
        q.onCompactProgress?.({ type: "compact_end" }), q.setSDKStatus?.(null)
    }
}

// READABLE (for understanding):
async function manualCompactWithReactiveMode(messages, toolUseContext, customInstructions, reactiveCompact) {
    toolUseContext.onCompactProgress?.({ type: "hooks_start", hookType: "pre_compact" });
    toolUseContext.setSDKStatus?.("compacting");
    try {
        // Run pre-compact hooks and build compaction context in parallel
        let [hooksResult, compactionContext] = await Promise.all([
            runPreCompactHooks({ trigger: "manual", customInstructions: customInstructions || null }, toolUseContext.abortController.signal),
            buildCompactionContext(toolUseContext, messages)
        ]);
        // Merge hook-provided custom instructions with user's instructions
        let mergedInstructions = mergeCustomInstructions(customInstructions, hooksResult.newCustomInstructions);
        toolUseContext.setStreamMode?.("requesting");
        toolUseContext.setResponseLength?.(() => 0);
        toolUseContext.onCompactProgress?.({ type: "compact_start" });
        // Delegate to reactive compact system
        let result = await reactiveCompact.reactiveCompactOnPromptTooLong(messages, compactionContext, {
            customInstructions: mergedInstructions, trigger: "manual"
        });
        if (!result.ok) switch (result.reason) {
            case "too_few_groups": throw Error(ERROR_TOO_FEW_GROUPS);
            case "aborted": throw Error(ERROR_ABORTED);
            case "exhausted":
            case "error": throw Error(ERROR_COMPACTION_FAILED)
        }
        // Clear all caches on success
        clearMessageCache(undefined), clearTokenEstimate(), clearCompactBoundaries(), messageCache.cache.clear?.();
        let combinedDisplayMessage = [hooksResult.userDisplayMessage, result.result.userDisplayMessage].filter(Boolean).join("\n") || undefined;
        return {
            type: "compact",
            compactionResult: { ...result.result, userDisplayMessage: combinedDisplayMessage },
            displayText: formatCompactDisplay(toolUseContext, combinedDisplayMessage)
        }
    } finally {
        toolUseContext.setStreamMode?.("requesting");
        toolUseContext.setResponseLength?.(() => 0);
        toolUseContext.onCompactProgress?.({ type: "compact_end" });
        toolUseContext.setSDKStatus?.(null)
    }
}

// Mapping: WpY→manualCompactWithReactiveMode, A→messages, q→toolUseContext, K→customInstructions, Y→reactiveCompact, sT6→runPreCompactHooks, G9q→buildCompactionContext, zp8→mergeCustomInstructions, aT6→ERROR_TOO_FEW_GROUPS, zl→ERROR_ABORTED, oT6→ERROR_COMPACTION_FAILED
```

**Failure reason handling:**

| Reason | Meaning | Action |
|--------|---------|--------|
| `too_few_groups` | Not enough message groups to compact | Throw `ERROR_TOO_FEW_GROUPS` |
| `aborted` | User aborted the operation | Throw abort error |
| `exhausted` | Reactive system exhausted all attempts | Throw `ERROR_COMPACTION_FAILED` |
| `error` | Internal reactive compact error | Throw `ERROR_COMPACTION_FAILED` |

**Key insight:** The `finally` block always resets stream mode and SDK status even on failure. This ensures the UI is never left in a "compacting" state if the compact throws.

---

## State Cleanup After Compact

After any successful compact (all three paths), four caches are invalidated:

| Cache | Symbol | Purpose |
|-------|--------|---------|
| Message cache | `K16(void 0)` / `clearMessageCache` | Clears serialized message cache |
| Token estimate | `gl()` / `clearTokenEstimate` | Resets cached token count for current context |
| Compact boundaries | `bc6()` / `clearCompactBoundaries` | Clears boundary marker index |
| General cache | `a2.cache.clear?.()` | Clears misc application-level cache |

**Why all four must be cleared:**
After compaction, the message array is replaced entirely. Any cached data derived from the old messages would now be stale or point to non-existent message references. Clearing all four ensures the next turn starts with fresh state.

---

## Error Handling

The handler distinguishes three error types in the `catch` block:

1. **Abort signal** — `abortController.signal.aborted` → throws "Compaction canceled." (user-visible, clean message)
2. **Known compact errors** — `aT6` (too few groups), `oT6` (compaction failed) → rethrows the same error string (propagates to UI error display)
3. **Unknown errors** — logs via `_6()` then wraps in `Error("Error during compaction: ...")` (preserves original error in message for debugging)

---

## `buildCompactionContext` (G9q)

**What it does:** Assembles the full compaction context object needed by the compact functions.

```javascript
// ============================================
// buildCompactionContext - Assembles compact context object
// Location: chunks.151.mjs:109-127
// ============================================

// ORIGINAL (for source lookup):
async function G9q(A, q) {
    let K = A.getAppState(),
        Y = await R0(A.options.tools, A.options.mainLoopModel, Array.from(K.toolPermissionContext.additionalWorkingDirectories.keys()), A.options.mcpClients),
        z = cg({ mainThreadAgentDefinition: void 0, toolUseContext: A, customSystemPrompt: A.options.customSystemPrompt, defaultSystemPrompt: Y, appendSystemPrompt: A.options.appendSystemPrompt }),
        [_, w] = await Promise.all([a2(), mw()]);
    return { systemPrompt: z, userContext: _, systemContext: w, toolUseContext: A, forkContextMessages: q }
}

// READABLE (for understanding):
async function buildCompactionContext(toolUseContext, forkMessages) {
    let appState = toolUseContext.getAppState(),
        defaultSystemPrompt = await buildDefaultSystemPrompt(toolUseContext.options.tools, toolUseContext.options.mainLoopModel, Array.from(appState.toolPermissionContext.additionalWorkingDirectories.keys()), toolUseContext.options.mcpClients),
        systemPrompt = assembleSystemPrompt({ mainThreadAgentDefinition: undefined, toolUseContext, customSystemPrompt: toolUseContext.options.customSystemPrompt, defaultSystemPrompt, appendSystemPrompt: toolUseContext.options.appendSystemPrompt }),
        [userContext, systemContext] = await Promise.all([getUserContext(), getSystemContext()]);
    return { systemPrompt, userContext, systemContext, toolUseContext, forkContextMessages: forkMessages }
}

// Mapping: G9q→buildCompactionContext, A→toolUseContext, q→forkMessages, R0→buildDefaultSystemPrompt, cg→assembleSystemPrompt, a2→getUserContext, mw→getSystemContext
```

**Why this matters:** The full system prompt must be rebuilt at compact time (not cached) because it may include dynamic content (tool lists, working directories from MCP clients). Using a stale system prompt for summarization would cause the LLM to miss tools added mid-session.
