# `/compact` Slash Command

## Overview

The `/compact` slash command is the user-facing entry point for manual compaction. It supports two forms:

1. **`/compact`** — Standard full compact, equivalent to autocompact but user-initiated.
2. **`/compact <instructions>`** — Standard compact with custom summarization instructions.

A separate path exists for partial compact (driven by the message-selector UI rather than slash command), but the underlying handler `JLY` only handles the standard `/compact` form. The partial compact (`zLK`) is invoked by the UI directly.

This document covers the command definition, the handler `JLY`, argument parsing, and the integration with `vI6` and the reactive-compact path `XLY`.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Compact module
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Slash commands

Key functions in this document:
- `compactCommandRegistration` (`aIK`) — chunks.167.mjs:2343
- `compactCommandHandler` (`JLY`) — chunks.167.mjs:2287
- `reactiveCompactPath` (`XLY`) — referenced (Ant-only path)
- `loadCacheSafeParams` (`iIK`) — referenced
- `formatCompactDisplayText` (`nIK`) — referenced
- `compactConversation` (`vI6`) — chunks.159.mjs:574
- `microcompactStub` (`_c`) — chunks.85.mjs:1207
- `notifyCacheDeletion` (`nj6`) — chunks.85.mjs:1143
- `clearCompactWarningSuppression` (`bs`) — chunks.159.mjs (similar to `a04`)
- `onCompactSucceeded` (`_F`) — referenced
- `isAntUser` (`bx`) — chunks.101.mjs:1530

---

## 1. Command Registration (`aIK` and `MLY`)

```javascript
// chunks.167.mjs:2343-2354
aIK = L(() => {
    Q8();
    MLY = {
        type: "local",
        name: "compact",
        description: "Clear conversation history but keep a summary in context. Optional: /compact [instructions for summarization]",
        isEnabled: () => !S6(process.env.DISABLE_COMPACT),
        supportsNonInteractive: !0,
        argumentHint: "<optional custom summarization instructions>",
        load: () => Promise.resolve().then(() => (oIK(), rIK))
    }, Un8 = MLY
})
```

The command descriptor `MLY`:
- **`type: "local"`** — handled in-process (vs `mcp` or `remote`).
- **`name: "compact"`** — the user types `/compact`.
- **`description`** — shown in the slash-command help / autocomplete.
- **`isEnabled`** — `true` unless `DISABLE_COMPACT` env var is set.
- **`supportsNonInteractive: true`** — works in CI/scripted environments (e.g., when invoked via `claude` CLI in non-TTY mode).
- **`argumentHint`** — shown to the user when typing `/compact <`.
- **`load`** — lazy-loads the handler module via `oIK()`, returning the export `rIK`.

The lazy-load via `Promise.resolve().then(() => (oIK(), rIK))` is the standard slash-command bootstrap pattern in v2.1.112 — defers loading the handler module until the command is actually invoked.

### Argument Parsing

`/compact` accepts a single string argument that becomes `q.trim()` in the handler. There's no internal parsing of subcommands (no `/compact up_to <id>` syntax) — the `up_to`/`from` partial compact path uses a separate UI mechanism (the message selector), not slash syntax.

This means a user typing:
```
/compact summarize as a bullet list focused on the auth refactor
```

results in `q = "summarize as a bullet list focused on the auth refactor"` reaching `JLY`.

---

## 2. The Handler `JLY`

```javascript
// ============================================
// compactCommandHandler - The /compact slash command handler
// Location: chunks.167.mjs:2287-2316
// ============================================

// ORIGINAL:
JLY = async (q, K) => {
    let { abortController: _ } = K, { messages: z } = K;
    if (z = H2(z), z.length === 0) throw Error("No messages to compact");
    let Y = q.trim();
    try {
        if (bx()) return await XLY(z, K, Y);
        let O = (await _c(z, K)).messages,
            w = await vI6(O, K, await iIK(K, O), !1, Y, !1);
        return bs(void 0), nj6(), $2.cache.clear?.(),
               _F(void 0, K.setAppState, K.resultDedupState),
               { type: "compact", compactionResult: w, displayText: nIK(K, w.userDisplayMessage) }
    } catch (A) {
        if (K.setSDKStatus?.(null, {
                compactResult: "failed",
                compactError: A instanceof Error ? A.message : String(A)
            }), _.signal.aborted) throw Error("Compaction canceled.");
        else if (p86(A, QI6)) throw Error(QI6);
        else if (p86(A, ql8)) throw Error(ql8);
        else if (A instanceof be) throw A;
        else throw j6(A), Error(`Error during compaction: ${A instanceof Error ? A.message : String(A)}`, { cause: A })
    }
}

// READABLE:
const compactCommandHandler = async (commandArgs, sessionContext) => {
  const { abortController } = sessionContext;
  let { messages } = sessionContext;

  // Filter messages to relevant set (drops progress, ephemerals)
  messages = filterRelevantMessages(messages);
  if (messages.length === 0) throw Error("No messages to compact");

  const customInstructions = commandArgs.trim();

  try {
    // Ant users get the experimental reactive compact path
    if (isAntUser()) {
      return await reactiveCompactPath(messages, sessionContext, customInstructions);
    }

    // Standard path
    const microcompactedMessages = (await microcompactStub(messages, sessionContext)).messages;
    const cacheSafeParams = await loadCacheSafeParams(sessionContext, microcompactedMessages);
    const result = await compactConversation(
      microcompactedMessages,
      sessionContext,
      cacheSafeParams,
      /*originalLastUuid=*/false,            // false → no logicalParentUuid in boundary
      customInstructions,
      /*isAuto=*/false                       // manual
    );

    // Post-compact cleanup
    clearCompactWarningSuppression(undefined);
    notifyCacheDeletion();
    invalidateGlobalCache();
    onCompactSucceeded(undefined, sessionContext.setAppState, sessionContext.resultDedupState);

    return {
      type: "compact",
      compactionResult: result,
      displayText: formatCompactDisplayText(sessionContext, result.userDisplayMessage),
    };
  } catch (err) {
    // Error handling — distinguish failure modes
    sessionContext.setSDKStatus?.(null, {
      compactResult: "failed",
      compactError: err instanceof Error ? err.message : String(err),
    });
    if (abortController.signal.aborted) throw Error("Compaction canceled.");
    if (isUserAbortError(err, NO_MESSAGES_TO_COMPACT_MSG)) throw Error(NO_MESSAGES_TO_COMPACT_MSG);
    if (isUserAbortError(err, COMPACT_INTERRUPT_MSG)) throw Error(COMPACT_INTERRUPT_MSG);
    if (err instanceof BeError) throw err;                 // PreCompact-blocked or similar
    reportError(err);
    throw Error(`Error during compaction: ${err instanceof Error ? err.message : String(err)}`, { cause: err });
  }
};

// Mapping: JLY→compactCommandHandler, q→commandArgs, K→sessionContext, _→abortController,
//          z→messages, Y→customInstructions, O→microcompactedMessages, w→result, A→err,
//          H2→filterRelevantMessages, bx→isAntUser, XLY→reactiveCompactPath,
//          _c→microcompactStub, iIK→loadCacheSafeParams, vI6→compactConversation,
//          bs→clearCompactWarningSuppression, nj6→notifyCacheDeletion, $2.cache.clear→invalidateGlobalCache,
//          _F→onCompactSucceeded, nIK→formatCompactDisplayText, p86→isUserAbortError,
//          QI6→NO_MESSAGES_TO_COMPACT_MSG, ql8→COMPACT_INTERRUPT_MSG, be→BeError, j6→reportError
```

### Phase-by-Phase

#### Phase 1: Filter and Validate

```javascript
let { messages: z } = K;
z = H2(z);                                       // Filter relevant
if (z.length === 0) throw Error("No messages to compact");
```

`H2` filters out `progress` messages, ephemerals, and other UI-only messages. If the result is empty (very early in a session, before any actual content), throw a user-readable error.

#### Phase 2: Trim Custom Instructions

```javascript
let Y = q.trim();
```

If the user typed `/compact   ` (with extra whitespace), `Y` becomes `""` — and the prompt builder (`fx8`) skips the `Additional Instructions:` section.

#### Phase 3: Ant Branch

```javascript
if (bx()) return await XLY(z, K, Y);
```

Ant users (those in the `tengu_cobalt_raccoon` experiment) take the `XLY` reactive-compact path. This is an experimental variant that may differ from standard compact in:
- Different LLM call structure
- Different telemetry events
- Different error handling
- Possibly different cache management

The exact implementation of `XLY` is in chunks elsewhere; for non-Ant users (the typical case), execution proceeds to the standard path.

#### Phase 4: Microcompact Stub

```javascript
let O = (await _c(z, K)).messages;
```

`_c(messages, ctx)` is the per-turn microcompact stub (chunks.85.mjs:1207) — in v2.1.112 this is a no-op that just returns `{messages: q}` after clearing the cache-deletion-suppression flag.

So `O = z` essentially. The call is preserved for the same reason it's preserved in the per-turn loop: future versions might re-introduce proactive MC, and keeping the call site avoids a code-shape change.

#### Phase 5: Load Cache-Safe Params

```javascript
let w = await vI6(O, K, await iIK(K, O), !1, Y, !1);
```

`iIK(ctx, messages)` is the cache-safe params loader. It produces the `cacheSafeParams` object that `vI6` needs:

```typescript
{
  systemPrompt: string,        // The agent's system prompt
  userContext: ...,            // User-context attachments
  systemContext: ...,          // System-context attachments
  toolUseContext: ...,         // The tool-use context
  forkContextMessages: O       // Messages to use as the fork base
}
```

This is similar to what autocompact's `QkK` synthesizes inline from its own arguments. The slash-command path needs to materialize these from the session context.

#### Phase 6: Call `vI6`

```javascript
let w = await vI6(
    O,                  // messages
    K,                  // sessionContext
    await iIK(K, O),    // cacheSafeParams
    false,              // originalLastUuid = false (no logicalParentUuid)
    Y,                  // customInstructions = trimmed user input
    false               // isAuto = false (this is manual)
    // recompactionInfo and stripNonEssential omitted → undefined / false
);
```

The 4th arg `false` (originalLastUuid) is because manual `/compact` doesn't need to anchor the boundary marker to a specific previous turn — it's a top-level user action.

The 6th arg `false` (isAuto) drives several differences from autocompact:
- PreCompact hook's `suppressNotification: false` → user sees notifications.
- `tengu_compact` event has `isAutoCompact: false`.
- Errors propagate up to the user (not silenced).

#### Phase 7: Cleanup

```javascript
return bs(void 0),                                       // clear compact warning suppression
       nj6(),                                            // notify cache deletion (UI flag)
       $2.cache.clear?.(),                               // clear global response-deduplication cache
       _F(void 0, K.setAppState, K.resultDedupState),    // record successful compact in app state
       { type: "compact",
         compactionResult: w,
         displayText: nIK(K, w.userDisplayMessage) };
```

- **`bs(undefined)`** clears any "compact warning suppression" flag — this flag controls whether subsequent turns show the "context low" UI banner. After a successful compact, the flag should be cleared so the banner re-appears if context fills again.
- **`nj6()`** (notifyCacheDeletion) flips the cache-deletion-pending UI flag — the model's prompt cache will be invalidated by the next request.
- **`$2.cache.clear?.()`** invalidates the global response-deduplication cache (used to detect identical-prompt requests within a window).
- **`_F(...)`** updates app state with successful-compact metadata.

#### Phase 8: Return Display Object

```javascript
{ type: "compact", compactionResult: w, displayText: nIK(K, w.userDisplayMessage) }
```

The returned object's `type: "compact"` tells the calling code (the slash-command dispatcher) that this was a compact — it then renders the `displayText` formatted by `nIK` (likely with markdown highlighting, sectioning, etc.).

---

## 3. Error Handling

The handler distinguishes 5 error scenarios:

| Error | Detection | Behavior |
|-------|-----------|----------|
| User abort | `_.signal.aborted` true | Throw `"Compaction canceled."` — short-circuits other checks |
| No messages to compact | Error message starts with `QI6` | Throw the specific message |
| Network interrupt | Error message starts with `ql8` | Throw the specific message |
| BeError (PreCompact-blocked, etc.) | `instanceof be` | Re-throw unmodified (already user-friendly) |
| Other | (default) | Log via `j6`, throw with `cause: A` and prefix `"Error during compaction: "` |

```javascript
} catch (A) {
    K.setSDKStatus?.(null, { compactResult: "failed", compactError: ... });
    if (_.signal.aborted) throw Error("Compaction canceled.");
    else if (p86(A, QI6)) throw Error(QI6);
    else if (p86(A, ql8)) throw Error(ql8);
    else if (A instanceof be) throw A;
    else throw j6(A), Error(`Error during compaction: ${A instanceof Error ? A.message : String(A)}`, { cause: A })
}
```

### Always Set Failed SDK Status

Before any error-specific handling, the SDK status is set to `compactResult: "failed"`. This ensures the SDK state is consistent regardless of which error path takes over. Programmatic clients (CLI, tests) can detect compact failure even before they see the thrown error.

### Order Matters

The check order matters because of overlapping conditions:
1. **Abort first** — even if the underlying error has another classification, an abort takes precedence (the user wants to stop).
2. **Specific known messages second** — `QI6` (no messages) and `ql8` (network) are user-readable; we re-throw them as-is.
3. **`BeError` third** — these are generally already user-friendly (PreCompact-block error message). We re-throw unmodified.
4. **Generic last** — wrap with prefix and `cause:` for debugging.

### Why `cause: A`?

The `cause:` field lets debugging tools (Node's `Error.cause` or DevTools) show the original error chain. The user sees `"Error during compaction: <message>"`, but logs preserve the full trace.

---

## 4. The Reactive-Compact Branch (`XLY`)

```javascript
if (bx()) return await XLY(z, K, Y);
```

`XLY` is the Ant-only experimental compact path. The exact implementation is gated and not visible in the standard binary, but its purpose can be inferred:

- **Reactive**: the compact decision logic differs from standard `vI6`. It might:
  - Use a different LLM call structure (e.g., parallel summary + state extraction)
  - Apply experimental cache-management (e.g., the `cache_edits` API beta that didn't ship in 2.1.112's standard path)
  - Use different prompt structure
  - Track different telemetry

- **Ant-only**: gated by `tengu_cobalt_raccoon` experiment. Internal Anthropic users get the experimental code path; external users always go through standard `vI6`.

This split allows the team to A/B test new compact mechanics without affecting external users. If the `XLY` path proves better, it could be promoted to the standard path in a future release.

---

## 5. Differences from Autocompact

| Aspect | Autocompact (`QkK`) | `/compact` (`JLY`) |
|--------|---------------------|---------------------|
| Trigger | per-turn loop, threshold-based | user-initiated |
| Pre-checks | DISABLE_COMPACT, failure breaker, threshold, refill breaker | DISABLE_COMPACT (via `isEnabled`), message non-empty |
| Calls `_c` (microcompact stub) | yes (per-turn loop) | yes (in handler) |
| Calls `vI6` with `isAuto` | true | false |
| Calls `vI6` with `recompactionInfo` | yes (with chain tracking) | no (undefined) |
| Calls `vI6` with `stripNonEssential` | computed (cold + flag) | false |
| PreCompact `suppressNotification` | true | false |
| Updates failure breaker | yes | no |
| Updates rapid-refill breaker | yes | no |
| Returns | `{wasCompacted, compactionResult, ...}` | `{type: "compact", compactionResult, displayText}` |
| Error display | logged but silenced for user | thrown to user |
| Routes through Ant branch | no | yes (via `bx()` check) |

---

## 6. Sample User Interactions

### Basic `/compact`

```
User: /compact
Claude Code: ↻ Compacting context...
            ✓ Compact complete (preTokens: 168432 → postTokens: 4521, duration: 4.2s)
            <next prompt>
```

The `displayText` from `nIK` typically includes the duration and token-delta. PreCompact + PostCompact hook outputs (if any) join with this.

### `/compact <instructions>`

```
User: /compact summarize in Korean and emphasize the test failures
Claude Code: ↻ Compacting context with custom instructions...
            ✓ Compact complete
            <next prompt>
```

The instructions become the `Additional Instructions:` section in `fx8`'s prompt. The model produces a Korean summary emphasizing test failures.

### Blocked by PreCompact

```
User: /compact
Claude Code: [warning notification: "compaction blocked by PreCompact hook"]
            ⚠ Compaction blocked by PreCompact hook: [check-tests]: tests failing
```

The notification is `priority: "immediate"` (warning color) so it's visually prominent. The error message is the BeError thrown by `ec8`.

### PTL Exhaustion

```
User: /compact
Claude Code: ↻ Compacting...
            ⚠ Conversation too long. Press esc twice to go up a few messages and try again.
```

This is the `_LK` message thrown when `KLK` exhausts 3 PTL retries. The user is given a workable suggestion (esc-esc rolls back the conversation by a few messages).

### Network Interrupt

```
User: /compact
Claude Code: ↻ Compacting...
            ⚠ Compaction interrupted · This may be due to network issues, retry shortly
```

This is the `ql8` message thrown when the streaming response fails with no text. Distinguishable from PTL errors so the user can decide whether to retry vs change strategy.

---

## 7. Integration with the Slash-Command Dispatcher

The slash-command dispatcher (lives in chunks elsewhere) is responsible for:
- Parsing the `/<name> <args>` syntax
- Looking up the command descriptor by name
- Calling `descriptor.load()` to get the handler
- Invoking the handler with `(args, sessionContext)`
- Routing the return value based on `type` field

For `/compact`, the dispatcher receives `{type: "compact", compactionResult, displayText}` and:
- Renders `displayText` to the UI
- Updates internal state with `compactionResult` (boundary marker, attachments, etc.)
- Replaces the conversation with the compacted version

The `type: "compact"` discriminator distinguishes this from other slash-command return types (e.g., `{type: "message", content: ...}` for commands that just emit text).

---

## 8. The `partial compact` Path (Different Entry)

`/compact <range>` syntax does NOT exist as a slash command. Instead, partial compact is invoked via:

1. User opens the message selector UI (typically a keyboard shortcut or scrollback action)
2. User selects a message and chooses "Compact up to here" or "Compact from here"
3. UI invokes `zLK(messages, cursorIndex, ctx, deps, userContext, "up_to" | "from")` directly

So while `JLY` only handles full compact, the partial compact entry point is the message-selector UI, which calls `zLK` (chunks.159.mjs:749).

This split is intentional:
- **Slash command** is a text-only interface — natural for "compact everything"
- **Message selector** is a visual interface — natural for "compact from this specific message"

The implementation paths reuse a lot (see [partial_compaction.md](./partial_compaction.md) — it shares ~85% of `vI6` structure), but the user-facing entry points are distinct.

---

## 9. Telemetry from `/compact`

The slash command itself doesn't emit dedicated telemetry events. Instead, telemetry comes from `vI6`'s standard events:

- `tengu_compact` — successful completion
- `tengu_compact_failed` — LLM call failure
- `tengu_compact_ptl_retry` — PTL retry attempt
- `tengu_compact_cache_sharing_*` — cache-prefix events

What distinguishes `/compact` events from autocompact in telemetry is the `isAutoCompact: false` field (vs `true`). Filter by `isAutoCompact = false` to see only manual compacts.

The `querySource` field is also distinctive — for `/compact`, it's whatever the slash-command dispatcher sets (typically `"slash_compact"` or similar).

---

## 10. What Constants Mean to the User

When a user runs `/compact`, the underlying constants determine behavior:

| Constant | Default | What it means for `/compact` |
|----------|---------|------------------------------|
| `qLK` | 3 | If the prompt is so long it triggers PTL, retry up to 3 times before giving up |
| `kx8` | 5 | After compacting, restore the last 5 most-recently-read files |
| `yDY` | 50,000 | Total token cap for restored files |
| `LDY` | 5,000 | Per-file token cap |
| `RDY` | 25,000 | Total token cap for invoked skills |
| `hDY` | 5,000 | Per-skill token cap |

The user can't override any of these via the slash command — they're hardcoded. The PTL retry constant especially affects user experience: if the conversation is so dense that 3 retries can't truncate it enough, the user sees the `_LK` "Conversation too long" message and must `/clear` or use the message-selector for partial compact.

---

## 11. Edge Cases

### Empty Conversation

```
User: /compact
Claude Code: ⚠ No messages to compact
```

`H2(z)` returns `[]`, the early throw fires. This is rare — typically there's at least the user's `/compact` message itself, but `H2` filters that out (it's a slash-command invocation, not real content).

### Compact During Streaming

If the model is mid-stream and the user types `/compact`:
- The streaming response is not aborted (the slash command is queued).
- After the streaming completes, `/compact` runs on the now-updated conversation.

### Compact While `vI6` Already Running (Race)

If autocompact triggered between turns and the user types `/compact` during it:
- The user's `/compact` would queue.
- After autocompact completes (success or failure), the queued `/compact` runs on the post-compact (or unchanged) conversation.

This isn't a deadlock because the slash-command dispatcher serializes commands. But a manual `/compact` immediately after an autocompact would either:
- Find the conversation already compacted → succeed quickly with a short summary.
- See the same content twice → the `tengu_compact` rapid-refill telemetry would track this.

### `isEnabled` False (DISABLE_COMPACT Set)

```
User: /compact
Claude Code: [Slash command not found]
```

When `isEnabled` returns false, the dispatcher hides the command. The user sees "command not found" rather than an error — the system treats `/compact` as if it didn't exist.

This is consistent with `DISABLE_COMPACT` being a hard-disable: if compact is disabled, even attempting to manually trigger it should fail at the dispatcher level rather than running and erroring.

---

## 12. Key Insight

`/compact` is **autocompact, but synchronous and user-visible**. The implementation differences are minor — most of the heavy lifting is delegated to `vI6`. The slash command's job is:

1. **Enable user-invocation** at any moment (not just on threshold-cross).
2. **Surface results clearly** (success/failure messages, formatted output, no silencing).
3. **Skip the breakers** (no failure tracking — manual compact is always allowed, even after multiple autocompact failures).

The hidden Ant-branch (`XLY`) hints at ongoing experimentation. By shipping the experiment behind `bx()` (Ant-only), Anthropic can iterate on compact mechanics with internal users without risk to external users — a pattern visible elsewhere in the v2.1.x line.
