# Esc During Compaction — Silent Abort (v2.1.133)

## Changelog Anchor

> Fixed pressing Esc during conversation compaction showing a spurious "Error compacting conversation" notification

## The Problem

Compaction (full `vI6`, partial `_H4`, reactive `Y97`) is an LLM round-trip with a streaming response. The user can interrupt it with **Esc** at any point. Pressing Esc fires `abortController.abort()` on the in-flight `JV` query, which propagates as:

```javascript
throw new ZA();                        // ZA is the abort-class error
// or eventually:
Error("API Error: Request was aborted.")     // Gb constant
```

Pre-v2.1.133, the partial-compact error toast (`AH4`) caught this and showed:

```
┌─ Error compacting conversation ─┐
│ (red color, immediate priority) │
└─────────────────────────────────┘
```

But this is misleading — the user just pressed Esc on purpose. There's no error to report. The toast is noise that makes intentional cancels look like crashes.

## The Fix

`AH4` (`partialCompactErrorNotice`) gained a triplet error-pattern guard:

```javascript
// ============================================
// partialCompactErrorNotice - Show user a "compaction failed" toast unless the error is benign
// Location: cli_inner_pretty.js:407935-407951
// ============================================

// ORIGINAL (for source lookup):
function AH4(H, $) {
  if (!Bd(H, Gb) && !Bd(H, ErH) && !ZH(H).startsWith($rH))
    ($.addNotification?.({
      key: "error-compacting-conversation",
      text: "Error compacting conversation",
      priority: "immediate",
      color: "error",
    }),
      lE({
        type: "system",
        subtype: "notification",
        key: "error-compacting-conversation",
        text: "Error compacting conversation",
        priority: "immediate",
        color: "error",
      }));
}

// READABLE (for understanding):
function partialCompactErrorNotice(error, context) {
  // ─── Three patterns where we DON'T want to show the error toast: ────────
  //   1. User pressed Esc (Gb = "API Error: Request was aborted.")
  //   2. Nothing to compact (ErH = "Not enough messages to compact.")
  //      — happens on /compact in a fresh session
  //   3. PreCompact hook blocked compaction ($rH starts "Compaction blocked
  //      by PreCompact hook") — that's a deliberate user/admin action
  if (!errorMessageContains(error, USER_ABORT_PATTERN)   // Bd(H, Gb)        — v2.1.133 added
      && !errorMessageContains(error, NO_MESSAGES_PATTERN)  // Bd(H, ErH)
      && !errorStringStartsWith(error, PRECOMPACT_BLOCKED_PREFIX)) {  // $rH
    context.addNotification?.({
      key: "error-compacting-conversation",
      text: "Error compacting conversation",
      priority: "immediate",
      color: "error",
    });
    // Also push into the conversation as a system-notification so transcript scrollback shows it
    pushSystemMessage({
      type: "system",
      subtype: "notification",
      key: "error-compacting-conversation",
      text: "Error compacting conversation",
      priority: "immediate",
      color: "error",
    });
  }
}

// Mapping: AH4→partialCompactErrorNotice, H→error, $→context, Bd→errorMessageContains,
//          Gb→USER_ABORT_PATTERN, ErH→NO_MESSAGES_PATTERN, $rH→PRECOMPACT_BLOCKED_PREFIX,
//          lE→pushSystemMessage, ZH→errorToString
```

## Pattern Constants

```javascript
// cli_inner_pretty.js:408213-408218
var ErH = "Not enough messages to compact.";
var Gb  = "API Error: Request was aborted.";              // ← the abort sentinel
var $rH = "Compaction blocked by PreCompact hook";
```

## How `Bd` Matches

`Bd(error, pattern)` checks whether the error's message string contains the pattern as a substring:

```javascript
// Effectively:
function Bd(error, pattern) {
  if (!(error instanceof Error)) return false;
  return error.message.includes(pattern);
}
```

The reason `$rH` uses `ZH(H).startsWith(...)` instead of `Bd(...)`: PreCompact-blocked errors carry the block reason after the prefix (`"Compaction blocked by PreCompact hook: <reason>"`), so the test only checks the start.

## Call Sites — Where `AH4` Fires

Two paths surface to the user:

1. **`/compact` full path** — `qrH` (the full compact pipeline, equivalent of legacy `vI6`):

```javascript
// cli_inner_pretty.js:407746-407748
catch (J) {
  if (((M = J instanceof Error ? J.message : "compaction failed"), !A)) AH4(J, $);
  throw J;
}
```

Only fires for manual `/compact` (`!A`, i.e. not auto). Autocompact doesn't surface errors to users at all — it logs to telemetry and silently skips.

2. **`_H4` partial compact** — `cli_inner_pretty.js:407921-407922`:

```javascript
catch (M) {
  throw ((z = M instanceof Error ? M.message : "partial compaction failed"), AH4(M, q), M);
}
```

Always fires for partial because partial compact is always user-initiated (rewind menu or `/compact <range>`).

## What Esc Actually Triggers

```
┌─────────────────────────────────────────────────────────────────┐
│ User presses Esc during compaction                              │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ Keyboard handler resolves to abortController.abort()             │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ In-flight beta.messages.create() rejects with fetch AbortError   │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ Wrapped by api.ts retry/error layer → throws WA (abort class)    │
│ OR throws Error("API Error: Request was aborted.")               │
└────────────────────┬────────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────────┐    ┌──────────────────────────────────────┐
│ Inside compact   │    │ Inside compact (catch path) — calls   │
│ throws to caller │    │ AH4(error, context):                  │
└──────────────────┘    │   error.message contains              │
                        │     "API Error: Request was aborted." │
                        │   → Bd(error, Gb) === true            │
                        │   → guard short-circuits              │
                        │   → no notification added             │
                        └──────────────────────────────────────┘
```

## Telemetry Still Records The Abort

The `zOH` telemetry call in the `finally` block (line 407753) still records the failure:

```javascript
zOH({
  trigger: A ? "auto" : "manual",
  success: !M,                  // false on abort
  durationMs: performance.now() - j,
  preTokens: w,
  postTokens: D,
  error: M,                     // contains "API Error: Request was aborted." for telemetry
});
```

So engineering teams can still see abort rates in metrics — the fix only suppresses the *user-facing* notification, not the telemetry signal.

## sdk_status Still Resolves Correctly

The `finally` block also sets `sdk_status: null` with `compactResult: "failed"` and `compactError: M`:

```javascript
$.onCompactEvent?.({
  type: "sdk_status",
  status: null,
  metadata: { compactResult: M ? "failed" : "success", ...(M && { compactError: M }) },
});
```

This tells the SDK integration that compaction did *not* succeed (status returns to `null`, but with a `failed` metadata flag). External integrations that listen for `compactResult` can distinguish a deliberate abort (`compactError === "API Error: Request was aborted."`) from a real failure.

## Why Three Patterns Are Quiet

| Pattern | Why it's a benign case |
|---------|------------------------|
| `Gb` ("API Error: Request was aborted.") | User pressed Esc — they know it stopped, they did it |
| `ErH` ("Not enough messages to compact.") | They typed `/compact` in a session with <2 turns — the command itself shouldn't have been usable, this is a courtesy guard |
| `$rH` ("Compaction blocked by PreCompact hook") | A PreCompact hook intentionally returned `decision: "block"` — that's policy enforcement, hook author already knows |

In each case, a red "Error compacting conversation" toast would be technically true but contextually wrong. The fix preserves the principle: only surface unexpected failures to users.

## Verification

```bash
# Confirm the guard:
grep "if (!Bd(H, Gb) && !Bd(H, ErH) && !ZH(H).startsWith" \
  /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# → 1 hit at line 407936
```

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact module
> - [symbol_additions_v2_1_142_compact_cache.md](../00_overview/symbol_additions_v2_1_142_compact_cache.md) - This unit's new symbols

Key symbols:
- `partialCompactErrorNotice` (`AH4`) — `cli_inner_pretty.js:407935-407951` — The guarded toast emitter
- `USER_ABORT_PATTERN` (`Gb`) — `cli_inner_pretty.js:408217` — "API Error: Request was aborted."
- `NO_MESSAGES_PATTERN` (`ErH`) — `cli_inner_pretty.js:408213` — "Not enough messages to compact."
- `PRECOMPACT_BLOCKED_PREFIX` (`$rH`) — `cli_inner_pretty.js:408218` — "Compaction blocked by PreCompact hook"
- `messageContains` (`Bd`) — substring helper used for all three patterns
- `partialCompact` (`_H4`) — `cli_inner_pretty.js:407768-407934` — Caller that always notifies on error
- `compactConversation` (`qrH`) — Caller that notifies only for manual `/compact`
