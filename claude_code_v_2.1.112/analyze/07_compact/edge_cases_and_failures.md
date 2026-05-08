# Edge Cases and Failure Modes

## Overview

This document enumerates the known failure modes in the compact subsystem and how each is handled. The compact pipeline has many failure points — LLM call failures, hook errors, network blips, model regressions, user aborts, conversation structure issues — and each has a specific recovery or degradation path.

The two primary safety mechanisms are:
- **Two circuit breakers** in the autocompact dispatcher (`QkK`)
- **Three-layer retry** in the LLM call (`vI6` → `ALK` → `KLK`)

This document also covers edge cases in state preservation, the context-hint reject path, and partial compact.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Compact module

Key functions in this document:
- `autocompactDispatcher` (`QkK`) — chunks.159.mjs:1379
- `compactConversation` (`vI6`) — chunks.159.mjs:574
- `truncateHeadForPTLRetry` (`KLK`) — chunks.159.mjs:512
- `throwIfPreCompactBlocked` (`ec8`) — chunks.159.mjs:533
- `contextHintReject` (`d85`) — chunks.194.mjs:856

Constants:
- `wLK = 3` — consecutive-failure breaker threshold
- `jLK = 3` — rapid-refill breaker count
- `a_7 = 3` — rapid-refill turn window
- `qLK = 3` — PTL retry attempts
- `GI6` — `"Compaction blocked by PreCompact hook"` (silent skip prefix)
- `at` — `"API Error: Request was aborted."` (user abort message)
- `cI` — `"Prompt is too long"` (PTL detection prefix)

---

## 1. The Two Circuit Breakers

The autocompact pipeline has two independent circuit breakers, both with threshold 3:

| Breaker | Constant | Trips when | Behavior | User-visible? |
|---------|----------|------------|----------|--------------|
| Consecutive-failure | `wLK = 3` | LLM call failed (non-PreCompact, non-abort) 3× in a row | Skip silently | No — only logs |
| Rapid-refill | `jLK = 3` within `a_7 = 3` turn window | Compaction succeeded but next compaction fired within ≤2 turns of previous, 3× in a row | Skip + emit error | Yes — shows `okK` thrash error |

### Consecutive-Failure Breaker

```javascript
// chunks.159.mjs:1383
if (Y?.consecutiveFailures !== void 0 && Y.consecutiveFailures >= wLK)
    return { wasCompacted: !1 };
```

**When it trips**: each failed `vI6` call increments `tracking.consecutiveFailures`. The dispatcher returns `{wasCompacted: false}` silently when the count reaches 3.

**What constitutes a "failure"**:
- LLM API errors (network, rate limit, model error)
- PTL exhaustion (3 truncation retries, all returned PTL)
- Streaming errors (no text response)
- Generic exceptions in `vI6`

**What does NOT constitute a failure**:
- PreCompact hook block (caught separately, returns silent skip without incrementing)
- User abort (`at` error, doesn't increment)

```javascript
// chunks.159.mjs:1417
if (b6(M).startsWith(GI6)) return { wasCompacted: !1 };       // PreCompact block — silent skip
if (!p86(M, at)) j6(M);                                        // Non-abort errors get logged
let W = (Y?.consecutiveFailures ?? 0) + 1;
if (W >= wLK) E(`autocompact: circuit breaker tripped after ${W} consecutive failures...`, {level: "warn"});
return { wasCompacted: !1, consecutiveFailures: W };
```

**Reset behavior**:
- Successful `vI6` call → `consecutiveFailures: 0` in returned tracking object.
- Next call sees `tracking.consecutiveFailures = 0` → not tripped.

**Why it exists**:
- Prevents wasted API calls when something is structurally broken.
- Lets the user finish their session even if autocompact is broken (they can still type, run tools, etc.).
- Distinguishes "transient blip" (1 failure) from "broken system" (3+ failures).

**What does the user see when tripped?**
- Nothing immediately — just no further autocompact attempts.
- The "context low" UI banner stays on (since context isn't shrinking).
- Eventually the conversation hits the blocking limit (`isAtBlockingLimit`) and the next turn is rejected.
- At that point, the user sees `cI` "API Error: prompt too long" or similar.

### Rapid-Refill Breaker

```javascript
// chunks.159.mjs:1391
let H = Y?.compacted === !0 && Y.turnCounter < a_7
    ? (Y?.consecutiveRapidRefills ?? 0) + 1
    : 0;
if (H >= jLK) {
    E(`autocompact: rapid-refill breaker tripped — ${H} consecutive refills within <${a_7} turns each (last was ${Y?.turnCounter} turns)`,
      {level: "warn"});
    return { wasCompacted: !1, rapidRefillBreakerTripped: !0 };
}
```

**When it trips**:
1. The previous turn was a successful compact (`Y.compacted === true`).
2. AND that compact was within the last `a_7 = 3` turns (i.e., 0, 1, or 2 turns ago).
3. AND we've now triggered another compact in this position.
4. Counter increments each time conditions 1-3 hold consecutively.
5. When counter reaches 3, breaker trips.

**What this means**: three back-to-back compacts each followed by another compact within 2 turns. This is "thrashing" — compaction is firing repeatedly without accomplishing anything (post-compact context immediately re-fills to threshold).

**The thrash pattern**:
- Turn N: user reads a 100K-token file, conversation hits threshold.
- Turn N+1: autocompact fires, replaces history with summary. Post-compact = ~50K + 100K file = ~150K. Already near threshold.
- Turn N+2: user does anything else. Conversation might cross threshold again.
- Turn N+3: autocompact fires again. Same content. No improvement.
- Repeat: this is rapid refill.

**What the user sees**:
```
Autocompact is thrashing: the context refilled to the limit within 3 turns of the previous compact, 3 times in a row. A file being read or a tool output is likely too large for the context window. Try reading in smaller chunks, or use /clear to start fresh.
```

This message is `okK`. It's yielded as `_9({content: okK, error: "invalid_request"})` in the per-turn loop (chunks.154.mjs:1019). Telemetry event `tengu_auto_compact_rapid_refill_breaker` also fires.

**Why "user-visible"?**
- This is a structural problem the user must address.
- Silent retry would just keep failing.
- Suggesting `/clear` gives the user a clear action.

---

## 2. PTL (Prompt Too Long) Retry Loop

The LLM compact call may itself overflow if the conversation is exceptionally long. `vI6` handles this with up to 3 retries.

### Detection

```javascript
// chunks.159.mjs:609 (in vI6's outer loop)
if (v = await ALK({...}), V = MJ6(v), !V?.startsWith(cI)) break;
```

`cI = "Prompt is too long"` is the prefix the API returns when input is too big. If the response text starts with this, we're in PTL territory.

### Retry

```javascript
// chunks.159.mjs:611-621
k++;
let $6 = k <= qLK ? KLK(G, v) : null;
if (!$6) throw d("tengu_compact_failed", {
    reason: "prompt_too_long",
    preCompactTokenCount: j,
    promptCacheSharingEnabled: W,
    ptlAttempts: k
}), Error(_LK);
d("tengu_compact_ptl_retry", {
    attempt: k,
    droppedMessages: G.length - $6.length,
    remainingMessages: $6.length
}), G = $6, f = {...f, forkContextMessages: $6}
```

`KLK(messages, errorResponse)`:
- Groups messages by API round-trip (`AR6` ≡ `groupMessagesByApiRound`; boundary on `assistant.message.id` change), then drops the oldest groups.
- Drop count = enough groups to cover the API-reported `tokenGap`; falls back to ~20% of groups when the gap is unparseable.
- Always keeps at least one group so there's something to summarize.
- Inserts `ayK` meta-marker as `msg[0]` if the remaining first message would be `assistant` (group-0 drop leaves an assistant-first sequence which the API rejects).

### After 3 Failed Retries

```javascript
throw Error(_LK);
// _LK = "Conversation too long. Press esc twice to go up a few messages and try again."
```

The user sees this as the autocompact failure. The conversation is left intact (not modified). The user can:
- `/clear` to start fresh
- Press esc-esc to roll back recent messages
- Manually reduce context via the message selector

### Why 3 Retries?

Each retry drops ~20% of head, so after 3 retries the conversation is at ~50% of original size. If the API still rejects, the conversation is structurally too large (e.g., a single ~80K user message that can't be truncated). More retries wouldn't help — they'd just delay the inevitable.

The 3-retry cap also bounds the worst-case latency: each retry is a full API roundtrip (5-15s for streaming), so 3 retries = 15-45s before giving up.

---

## 3. Network Errors

```javascript
// chunks.159.mjs:1042-1048 (in ALK)
throw E(`Compact streaming failed. hasStartedStreaming=${j}`, {level: "error"}),
      d("tengu_compact_failed", {reason: "no_streaming_response", preCompactTokenCount: Y, hasStartedStreaming: j, promptCacheSharingEnabled: w}),
      Error(ql8)                                  // "Compaction interrupted · This may be due to network issues..."
```

When the streaming call fails to produce any assistant message (network blip mid-stream, API gateway issue, etc.), `vI6` throws `ql8`:

```
Compaction interrupted · This may be due to network issues, retry shortly
```

The `hasStartedStreaming` field distinguishes:
- `false` — connection failed before streaming started (likely network/auth issue)
- `true` — connection started but didn't produce content (likely server-side issue)

The user sees `ql8` and can retry. Autocompact's failure breaker increments; if 3 such failures occur, the breaker trips.

---

## 4. PreCompact Hook Block

```javascript
// chunks.159.mjs:533-544
function ec8(q, K, _) {
    if (!q.blockedBy) return;
    if (E(`Compaction blocked by PreCompact hook: ${q.blockedBy}`, {level: "warn"}),
        !_?.suppressNotification)
        K.addNotification?.({...});
    throw new be(`${GI6}: ${q.blockedBy}`)
}
```

When a PreCompact hook returns `decision: "block"`, `ec8` throws a BeError with message starting `GI6 = "Compaction blocked by PreCompact hook"`.

The dispatcher (`QkK`) recognizes this prefix:

```javascript
// chunks.159.mjs:1417
if (b6(M).startsWith(GI6)) return { wasCompacted: !1 };
```

→ Returns silent skip. **`consecutiveFailures` is NOT incremented** because this is a user-policy block, not a system failure.

For autocompact, `suppressNotification: true` → user doesn't see anything.
For manual `/compact`, `suppressNotification: false` → user sees a warning notification with the block reason.

---

## 5. User Abort

```javascript
// chunks.159.mjs:1418
if (!p86(M, at)) j6(M);
```

`at = "API Error: Request was aborted."`. This is what gets thrown when the user cancels (Ctrl+C, `/clear` mid-compact, signal abort).

The check `p86(M, at)` filters abort errors out of the error reporter (`j6(M)`):
- Aborts are not bugs — they're user actions.
- We don't want to log them as application errors.

But `consecutiveFailures` IS incremented for aborts:

```javascript
let W = (Y?.consecutiveFailures ?? 0) + 1;
```

This is intentional: if the user keeps aborting compacts, the breaker eventually trips, preventing further autocompact attempts. The user has signaled they don't want compact to run.

For the user, an aborted compact looks like:
- The "compacting..." UI disappears.
- The conversation is unchanged.
- If autocompact-aborted, no further notification.
- If `/compact`-aborted, the slash command throws `"Compaction canceled."`.

---

## 6. Empty Conversation

```javascript
// chunks.159.mjs:580
if (q.length === 0) throw Error(QI6);
// QI6 = "Not enough messages to compact."
```

If `vI6` is called with an empty messages array, it throws immediately. This is rare:
- Autocompact wouldn't fire on an empty conversation (token count is below threshold).
- Manual `/compact` filters via `H2` first, but if `H2` strips everything (e.g., conversation is all `progress` messages), the empty array reaches `vI6`.

The thrown error is caught by `JLY`:

```javascript
else if (p86(A, QI6)) throw Error(QI6);
```

→ Re-thrown to the user with the same message.

---

## 7. Compact While Streaming a Response

If the model is mid-stream when compact is requested:
- The streaming response is not aborted (the slash command queues).
- After the streaming completes, `/compact` runs on the now-updated conversation.

Race condition:
- Autocompact may fire **between** turn N's response and turn N+1's input.
- If user types `/compact` during this window, it queues.
- Autocompact completes (success or failure), then `/compact` runs.

This is not a deadlock because the slash-command dispatcher serializes commands. But it can produce surprising behavior: the user might see "compacting..." twice in quick succession.

---

## 8. State Preservation Failures

### File Restoration Failure

```javascript
// In Nx8 at chunks.159.mjs:1067-1072
let O = await Promise.all(A.map(async ($) => {
    let j = await p97($.filename, {...}, "tengu_post_compact_file_restore_success", "tengu_post_compact_file_restore_error", "compact");
    return j ? Y4(j) : null
}));
```

If `p97` fails to read a file (deleted, permission denied), it returns null. The slot becomes null, then is filtered out by the budget check.

Possible reasons:
- File was deleted between original read and post-compact (e.g., `git clean`).
- Permissions changed (e.g., `chmod 000`).
- Disk error.

Telemetry: `tengu_post_compact_file_restore_error` fires for each failure. The compact succeeds with fewer attached files; the agent loses access to those files post-compact.

### Task Status Loading

`hx8` is synchronous-style (the `await` is for the `Promise.all` it's part of). It doesn't have explicit error handling — if `getAppState()` throws, the error propagates. In practice, `getAppState()` is reliable.

If a task has missing fields, the optional chaining (`z.progress?.summary ?? null`) handles it gracefully.

### Hook Failures

Hook failures (timeout, non-zero exit) don't block compact (only `decision: "block"` does). They show up as `"PreCompact [<cmd>] failed"` lines in `userDisplayMessage` but don't affect the LLM call or attachments.

---

## 9. Context-Hint Reject Path Edge Cases

### 422/424 Without Beta Header

If the request didn't include the `context-hint-2026-04-09` beta (e.g., user not in `tengu_hazel_osprey` experiment), the API still returns 422/424 for overflow but the client doesn't have a recovery path. The error propagates as a normal API error.

In this case, the user sees a "prompt too long" error and must manually `/clear` or use the message selector.

### 422/424 with Beta but Already Stripped

```javascript
// In d6A at chunks.194.mjs:923
if (!z || _) return null;
```

If `_` (stripped) is true (already used the recovery path for this request), subsequent 422/424 errors return null (no recovery). This prevents recovery-loop thrashing within a single user turn.

In practice this means: 422/424 → `NJ7` clears thinking + tool results → retry → if retry also gets 422/424, it propagates as a normal error (no second recovery attempt).

### Latch Already Set on First Request

If the latch is on for a fresh request (somehow — possibly retained from a previous session due to bug), the thinking-clear step in `d85` is skipped. Only the MC step runs.

The MC step alone may not be enough recovery. If overflow is mostly thinking blocks, no recovery happens. The error propagates.

This is a defensive case — in normal operation, the latch resets per-session, so first request never sees latched=true.

---

## 10. Manual Compact Edge Cases

### `/compact` During Plan Mode

Plan mode restricts tools, but compact bypasses the agent's tool restrictions (the compact LLM call has its own permission stub `Or1()`). The compact succeeds normally.

Post-compact, plan mode is preserved via `Lx8` reminder. The agent continues in plan mode after compact.

### `/compact` On a Fresh Session (One Message)

A fresh session might have:
- 1 user message: the user's initial prompt
- 0 assistant messages

`H2` filters retains the user message. `vI6` runs but with effectively just one message to summarize. The summary will be brief but valid.

The boundary marker fires with `preTokens = <small>`, `postTokens = <similar>`. No real compaction happens (the summary may be larger than the original message), but no error either.

### `/compact <very long instructions>`

Custom instructions are appended to the prompt via `Additional Instructions:` in `fx8`. There's no limit on instructions length — a 10K-token instruction is just appended. This could push the compact prompt itself over the LLM's max-output limit.

If that happens, the cache-prefix call would PTL (silent fallback). The standard call would PTL (triggers `vI6`'s outer retry loop with `KLK`). After 3 retries, `_LK` is thrown.

Mitigation: users with very long instructions should be aware that compact may PTL.

---

## 11. Boundary Marker Edge Cases

### Multiple Boundary Markers

A long-running session may have multiple `compact_boundary` system messages in the JSONL transcript — one per compact event. They're not deduplicated.

`rc(messages)` (collectPreCompactDiscoveredTools) walks all of them:

```javascript
if (z.type === "system" && z.subtype === "compact_boundary") {
    let A = z.compactMetadata?.preCompactDiscoveredTools;
    if (A) { for (let O of A) K.add(O); _ += A.length }
    continue
}
```

Each boundary contributes its discovered-tools list to the cumulative set. This means tools discovered in compact #1 are still tracked through compact #5.

### Boundary Marker for Aborted Compact

If a compact is aborted mid-pipeline (e.g., abort signal during `vI6`), no boundary marker is created. The conversation state is unchanged.

This is correct: the boundary marker is meant to mark a *successful* compact event. Aborted compacts shouldn't have markers.

---

## 12. Telemetry Failure

If telemetry events (via `d(...)`) fail (network error, telemetry service down), they don't propagate to the user. The compact call itself completes normally.

Some telemetry computation is wrapped in IIFE try/catch:

```javascript
// chunks.159.mjs:706
...(() => { try { return Kx8(qx8(q)) } catch ($6) { return j6($6), {} } })()
```

If `Kx8(qx8(q))` throws (e.g., malformed messages), the IIFE catches and returns empty object. The `tengu_compact` event still fires, just without the per-message stats.

---

## 13. The Three-Layer Defense

The compact LLM call has three layers of defense against the model deviating from text-only output:

```
┌─────────────────────────────────────────────────────────┐
│ Layer 1: Prompt-level (fx8)                              │
│   "CRITICAL: Respond with TEXT ONLY. Do NOT call tools." │
│   Plus 4 bullet points + trailing reminder (SI4)         │
└─────────────────────────────────────────────────────────┘
                        │ (if model ignores)
                        ▼
┌─────────────────────────────────────────────────────────┐
│ Layer 2: API-level (eb6 call)                            │
│   tools: [Kz]   (only the summary stub, no real tools)   │
│   thinkingConfig: {type: "disabled"}                     │
└─────────────────────────────────────────────────────────┘
                        │ (if model attempts tool_use)
                        ▼
┌─────────────────────────────────────────────────────────┐
│ Layer 3: Permission-level (Or1)                          │
│   {behavior: "deny", message: "Tool use is not allowed   │
│    during compaction"}                                   │
└─────────────────────────────────────────────────────────┘
                        │ (if all three layers fail)
                        ▼
                  Result has no text → V is null
                        │
                        ▼
              Fallback path in vI6 → tengu_compact_failed
```

In practice, Layer 2 catches almost all attempts (the model has nothing to call). Layer 3 catches the rare case where the model emits a malformed tool_use against the stub.

---

## 14. Rapid-Refill Breaker Reset Semantics

Reset behavior is critical to understand:

| Event | `consecutiveFailures` | `consecutiveRapidRefills` | `compacted` (in tracking) | `turnCounter` |
|-------|------------------------|----------------------------|---------------------------|----------------|
| Successful compact | → 0 | → calculated | → true | → 0 |
| Failed compact | += 1 | unchanged | unchanged | unchanged |
| PreCompact-blocked | unchanged | unchanged | unchanged | unchanged |
| User abort | += 1 | unchanged | unchanged | unchanged |
| Successful + previous compact ≥ 3 turns ago | → 0 | → 0 | → true | → 0 |
| Turn without compact | unchanged | unchanged | (stays as-is) | += 1 |

The key invariants:
- `compacted` tracks whether the immediate-previous turn was a compact.
- `turnCounter` increments each turn, resets on compact.
- `consecutiveRapidRefills` only increments if `compacted === true && turnCounter < a_7` at the *next* compact.

This means:
- Three back-to-back compacts (turnCounter = 0, 1, 2 between them) → counter = 3, breaker trips.
- Three compacts spread over 4+ turns → counter resets each time, no trip.

---

## 15. What Happens If All Three Layers Fail Simultaneously?

Scenarios where multiple layers fail:
- Network error during cache-prefix call AND standard call (cascading) → `ql8` user error.
- PTL on cache-prefix (silent skip) AND PTL on standard call (`KLK` retries) AND 3 PTL retries fail → `_LK` user error.
- LLM call succeeds but `MJ6` returns null (no text content) → "Failed to generate conversation summary..." user error.
- LLM call returns text starting with API error prefix (`fp(V)`) → that error message is thrown.

Each is a distinct telemetry event:
- `tengu_compact_failed` with `reason: "no_streaming_response"` (network)
- `tengu_compact_failed` with `reason: "prompt_too_long"` (PTL exhausted)
- `tengu_compact_failed` with `reason: "no_summary"` (no text)
- `tengu_compact_failed` with `reason: "api_error"` (API error prefix)

The user sees a different error message in each case, with consistent telemetry mapping.

---

## 16. Race Condition: Compact + Context-Hint Reject

A subtle race: during a single API request, the `context-hint` handler (`d6A`) detects 422/424 and runs `NJ7` (which calls `d85`). This applies thinking-clear and KEEP-RECENT MC.

But what if autocompact runs concurrently? In practice:
- Autocompact runs *between* turns, not during them.
- A request in flight has its own abort controller.
- If autocompact tries to start while a request is in flight, the per-turn loop has serialized them.

So the race doesn't typically happen. But if it did, the result would be:
- Both modify messages (different mutations).
- The autocompact `vI6` call would use the modified messages (post-MC), reducing input cost.
- The retried request from context-hint would still target the original request.

The two recovery paths are designed to be **orthogonal**:
- Local autocompact runs proactively, between turns.
- Context-hint runs reactively, within a turn's request lifecycle.

They don't share state in a way that causes conflicts.

---

## 17. Memory Corruption Edge Case

`pe6(K.readFileState)` snapshots the read-file state. If `K.readFileState` were mutated during the snapshot (rare race), the snapshot might be inconsistent. But `Object.fromEntries(map.entries())` is atomic per-entry, so individual entries are coherent.

The clear-then-restore pattern:

```javascript
let N = pe6(K.readFileState);
K.readFileState.clear();
// ... compact LLM call ...
K.readFileState (still empty) → restored from N via Nx8 → adds new entries
```

If a concurrent operation tried to add to `K.readFileState` mid-compact, the addition would be lost (because the clear wipes it). In practice, this isn't a problem because:
- Tool calls are serialized through the agent loop.
- Compact runs between turns.
- No tool call is in-flight while compact is happening.

---

## 18. Failure Mode Summary Table

| Failure | Detection | User-visible? | Telemetry | Reset |
|---------|-----------|----------------|-----------|-------|
| LLM call network error | Caught by `ALK`'s try/catch | Yes (`ql8`) | `tengu_compact_failed: no_streaming_response` | Next attempt |
| PTL on first call | `V.startsWith(cI)` | No (retry kicks in) | `tengu_compact_ptl_retry` | Per-attempt |
| PTL exhausted (3 retries) | `k > qLK` | Yes (`_LK`) | `tengu_compact_failed: prompt_too_long` | Next user turn |
| No text in response | `MJ6(v) === null` | Yes ("Failed to generate summary") | `tengu_compact_failed: no_summary` | Next attempt |
| API error in response | `fp(V)` true | Yes (the API error msg) | `tengu_compact_failed: api_error` | Next attempt |
| PreCompact blocked | `M.blockedBy` non-empty | Yes (notification + warning) | none | Next attempt |
| User abort | error message = `at` | No | none | (counted as failure) |
| Empty conversation | `q.length === 0` | Yes (`QI6`) | none | n/a |
| Consecutive-failure breaker | `tracking.consecutiveFailures >= 3` | No | log only | Successful compact |
| Rapid-refill breaker | 3 refills in 3-turn windows | Yes (`okK` thrash) | `tengu_auto_compact_rapid_refill_breaker` | Successful compact + ≥3 turns since last |
| Hook timeout | hook runner returns failed result | Yes (added to userDisplayMessage) | none | n/a |
| File restoration failure | `p97` returns null | No (file just isn't restored) | `tengu_post_compact_file_restore_error` | per-file |
| 422/424 without `context-hint` beta | API status check | Yes (the API error) | none | Manual /clear |
| 422/424 with beta, already stripped | `d6A` returns null | Yes (the API error) | `tengu_context_hint_busy_fallback` | Manual /clear |

---

## 19. Recovery Strategies

| Failure scenario | Recommended user action |
|-------------------|--------------------------|
| `_LK` PTL exhausted | `/clear` or message-selector partial compact |
| `ql8` network interrupt | Retry shortly (transient) |
| Rapid-refill breaker (`okK`) | `/clear` (the file/output is too big for the window) |
| PreCompact blocked | Investigate hook output; may need to fix the condition |
| Generic compact error | Check logs, retry, or `/clear` |
| Consecutive-failure breaker tripped | Restart session (silent breaker means session is degraded) |

---

## 20. Key Insight

The compact subsystem is **layered defensively**:

1. **Two breakers** prevent thrashing (rapid-refill) and cascading failures (consecutive-failure).
2. **Three retry layers** within `vI6` (cache-prefix → standard → PTL truncation) handle different failure modes.
3. **Three layers of tool-use defense** (prompt + API + permission) prevent the LLM from deviating.
4. **Two parallel recovery systems** (local autocompact + server-driven context-hint) cover proactive and reactive needs.
5. **Hook-level user intervention** (PreCompact block) gives users veto power.

Each layer fails gracefully:
- Breakers silence retries instead of crashing.
- Retry layers fall back to broader strategies on failure.
- Defense layers keep firing even if earlier layers fail.
- Recovery systems coexist without conflicting.
- User vetoes don't trigger system failure responses.

The result: the compact subsystem **almost never fails fatally**. The worst case is a user-visible error message that suggests a clear next action (`/clear`, retry, message selector). There's no "compact crashed the session" state.

This robustness is essential because compact is the *only* mechanism keeping conversations alive past the model's context limit. If compact fails permanently, the session becomes unusable. The defensive layering prevents that catastrophic state.
