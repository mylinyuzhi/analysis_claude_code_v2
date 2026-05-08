# Dead Code Audit — Snip and Marble-Origami in v2.1.112

## Overview

This document audits two **gated-but-not-shipped** features that v2.1.88 source references:

1. **Snip** (`HISTORY_SNIP` feature flag) — a surgical message-deletion primitive
2. **Marble-Origami** (`CONTEXT_COLLAPSE` feature flag, codename `marble_origami`) — an LLM-driven message-archival system

Neither feature actually runs in v2.1.112's shipped binary. Both are **dead-code-eliminated** by the bundler (rollup-style constant folding). What survives:

- **Snip**: a vestigial parameter `snipTokensFreed` on `gDY` that no caller passes.
- **Marble-Origami**: persistence write-side shims (`recordContextCollapseCommit`/`Snapshot`) that have no callers but are exported through the SDK's public API.

This audit complements `compact_v2.1.112.md` and `snip_collapse_audit_v2.1.112.md` in `00_overview/` by focusing on what specifically remains in the compact module's namespace.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Compact module

Key functions in this document:
- `shouldCompact` (`gDY`) — chunks.159.mjs:1365 (the only place Snip-related parameter survives)
- `recordContextCollapseCommit` (`XtY`) — chunks.191.mjs:1102 (write-only persistence shim)
- `recordContextCollapseSnapshot` (`MtY`) — chunks.191.mjs:1112 (write-only persistence shim)
- `getCurrentSessionId` (`I8`) — referenced
- `getSessionWriter` (`x_`) — referenced

---

## 1. Snip — The Vestigial Parameter

### What Snip Was Supposed to Be

In v2.1.88's source, Snip was conceived as a **surgical message-deletion primitive**:
- Triggered by the `/force-snip` slash command, OR
- Triggered automatically by the model emitting a `SnipTool` invocation

The Snip operation would:
- Delete specific messages from local state by UUID.
- Report the rough token-count freed (`snipTokensFreed`).
- Persist the deletion as a snip-boundary marker in the session log.
- Allow the autocompact threshold check to know how many tokens were freed (so it doesn't re-tokenize the whole conversation).

The implementation files (`services/compact/snipCompact.js`, `services/compact/snipProjection.js`, `tools/SnipTool/`, `commands/force-snip.js`, `components/messages/SnipBoundaryMessage.js`) were referenced by v2.1.88 source but **never existed in the bundle** — they were stubs gated behind `feature('HISTORY_SNIP')`.

### What Survives in v2.1.112

Only one vestigial parameter — the `Y = 0` default in `gDY`:

```javascript
// ============================================
// shouldCompact - The only place where snipTokensFreed lives on
// Location: chunks.159.mjs:1365-1377
// ============================================

// ORIGINAL:
async function gDY(q, K, _, z, Y = 0) {
    if (z === "session_memory" || z === "compact") return !1;
    if (!z0()) return !1;
    if (bx() && !Z38(K, _)) return !1;
    let A = vJ(q) - Y,        // ← Y is "snipTokensFreed", but it's always 0
        O = v38(K, _),
        w = Yn(K, _);
    E(`autocompact: tokens=${A} threshold=${O} effectiveWindow=${w}`);
    let { isAboveAutoCompactThreshold: $ } = UM6(A, K, _);
    return $
}
```

### The Wiring Trace

`gDY`'s `Y` parameter:
- Default: `Y = 0` (so unset becomes 0)
- Effect: `tokenCount = vJ(q) - Y` (subtract from estimated tokens)

Called from one site:
```javascript
// chunks.159.mjs:1388 (in QkK)
if (!await gDY(q, O, w, z, A)) return { wasCompacted: !1 };
```

Where `A` is `QkK`'s 6th parameter (`snipTokensFreed`).

`QkK` is called from one site:
```javascript
// chunks.154.mjs:1010-1011
let { ... } = await H.autocompact(U, v, {...}, w, g, n);
```

Where `n` is the loop's local variable, **initialized to `0` at line 1005** and never reassigned. So:
- `n = 0` (loop init)
- `H.autocompact(U, v, ..., w, g, 0)`
- `QkK(...., A=0)`
- `await gDY(q, O, w, z, 0)`
- `Y = 0` in `gDY`
- `tokenCount = vJ(q) - 0 = vJ(q)`

The parameter wiring is intact end-to-end, but the value is **always `0`**. The plumbing exists for a hypothetical Snip implementation that would mutate `n` to a non-zero value before passing it.

### Symbols That Should Exist (per v2.1.88) But Don't

Searches in all 226 chunks of v2.1.112 for any of these strings return zero matches:

| Symbol | Purpose in v2.1.88 source |
|--------|----------------------------|
| `snipModule` | Per-process snip module handle |
| `snipCompactIfNeeded` | Pre-microcompact snip pass |
| `snipProjection` | UI snip-boundary projection |
| `isSnipBoundaryMessage` | UI snip-boundary detection |
| `SnipTool` | Tool name for the Snip primitive |
| `SNIP_TOOL_NAME` | The string `"Snip"` |
| `SNIP_NUDGE_TEXT` | "Consider /snip" reminder text |
| `forceSnip` | The `/force-snip` slash command handler |
| `/force-snip` | Slash command literal |
| `SnipBoundaryMessage` | UI rendering component |
| `snip_boundary` | Boundary marker subtype |
| `snipMessages()` | sessionStorage deletion function |
| `tengu_snip_*` | Telemetry events |
| `[id:` | Message UUID injection pattern |
| `(e.g. by snip)` | Documentation reference |
| `includeSnipped` | Message-filter option |
| `snipReplay` | QueryEngine replay handler |

The bundler treats `feature('HISTORY_SNIP') ? require('./snip-impl.js') : null` as a constant-fold when `feature()` is statically known to return false, and removes the require'd module entirely.

### One Documentation Trace That Was Scrubbed

The v2.1.88 SDK schema for `seedReadFile` had this description:

> Seeds the readFileState cache with a path+mtime entry. Use when a prior Read was removed from context (**e.g. by snip**) so Edit validation would fail despite the client having observed the Read.

In v2.1.112's bundle (chunks.207.mjs:899), the same schema (now renamed `seed_read_state`) has:

> Seeds the readFileState cache with a path+mtime entry. Use when a prior Read was removed from context so Edit validation would fail despite the client having observed the Read.

The parenthetical "(e.g. by snip)" was **explicitly scrubbed** from the public-facing schema, while the underlying tool functionality (which works for any kind of message removal) was preserved. This suggests the team is aware of and actively cleaning up Snip-related public references.

---

## 2. Marble-Origami — The Persistence Half-Shim

### What Marble-Origami Was Supposed to Be

In v2.1.88's source, `CONTEXT_COLLAPSE` (codename `marble_origami`) was conceived as an **LLM-driven mid-ground between full compact and no-action**:

- When triggered, an LLM agent would identify "completable" sub-conversations within the active conversation.
- Each completable sub-conversation would be summarized (a "commit") and replaced with the summary.
- Recent turns would stay verbatim.
- Rolling summaries would accumulate as "commits" persisted in the session log.

The intent was to **keep recent verbatim context while archiving older completable stretches**, avoiding the "everything → 2KB summary" lossiness of full compact.

The runtime logic lived in `services/contextCollapse/` (referenced by v2.1.88's source but missing from the bundle):
- `applyCollapsesIfNeeded` — main entry that decides whether to run a collapse
- `recoverFromOverflow` — reactive collapse on API overflow
- `isWithheldPromptTooLong` — overflow detection
- `isContextCollapseEnabled` — feature gate
- `resetContextCollapse` — cleanup
- `CtxInspectTool` — debugging tool

### What Runtime Survives in v2.1.112

**None of the runtime symbols exist** in v2.1.112's bundle. Searches for any of these literals return zero matches:

| Symbol | Purpose |
|--------|---------|
| `applyCollapsesIfNeeded` | Main entry |
| `recoverFromOverflow` | Reactive overflow handler |
| `isWithheldPromptTooLong` | Overflow detection |
| `isContextCollapseEnabled` | Feature gate |
| `resetContextCollapse` | Cleanup |
| `CtxInspectTool` | Debugging tool |
| `<collapsed>` | Marker text |
| `marble_origami` (with underscore) | Feature flag string |
| `tengu_context_collapse` | Telemetry event |
| `CONTEXT_COLLAPSE` | Feature flag literal |

### What Persistence Survives in v2.1.112

**Two write-only persistence shims** exist, with no callers in any chunk:

```javascript
// ============================================
// recordContextCollapseCommit / recordContextCollapseSnapshot - Persistence shims (no callers)
// Location: chunks.191.mjs:1102-1120
// ============================================

// ORIGINAL:
async function XtY(q) {
    let K = I8();
    if (!K) return;
    await x_().appendEntry({ type: "marble-origami-commit", sessionId: K, ...q })
}
async function MtY(q) {
    let K = I8();
    if (!K) return;
    await x_().appendEntry({ type: "marble-origami-snapshot", sessionId: K, ...q })
}

// READABLE:
async function recordContextCollapseCommit(commit) {
  const sessionId = getCurrentSessionId();
  if (!sessionId) return;
  await getSessionWriter().appendEntry({
    type: "marble-origami-commit",
    sessionId,
    ...commit,
  });
}
async function recordContextCollapseSnapshot(snapshot) {
  const sessionId = getCurrentSessionId();
  if (!sessionId) return;
  await getSessionWriter().appendEntry({
    type: "marble-origami-snapshot",
    sessionId,
    ...snapshot,
  });
}

// Mapping: XtY→recordContextCollapseCommit, MtY→recordContextCollapseSnapshot,
//          I8→getCurrentSessionId, x_→getSessionWriter
```

These are **exported** via the SDK's public surface:

```javascript
// cli.chunks.mjs:9124-9125
recordContextCollapseSnapshot: () => MtY,
recordContextCollapseCommit: () => XtY,
```

### What Read-Side Survives

The JSONL session-log parser (`Ut`) recognizes the `marble-origami-{commit,snapshot}` types and lifts them to resume fields:
- `contextCollapseCommits` — array of committed sub-summaries
- `contextCollapseSnapshot` — the latest full collapse state

This means the parser can **read** session logs written by future builds that DO have collapse runtime, even though v2.1.112 itself never writes such entries (because no caller invokes `XtY`/`MtY`).

### The Tail-Keep Policy

Anywhere session-log streaming or compaction occurs, the policy `keep_tail: "always"` is applied to messages of type `marble-origami-*`. This ensures that even when session logs are truncated for storage, the most recent collapse entries survive — important for forward-compatibility.

### The `collapse` Naming Collision

v2.1.112 has several UI utilities that share the "collapse" name but are NOT context-collapse:
- `collapsed_read_search` — UI grouping for sequential Read/Grep operations
- `teammate_shutdown_batch` — UI grouping for parallel teammate shutdowns
- `stop_hook_summary` — UI summarization of stop-hook output
- Hook-grouping logic — collapses repeated hook invocations in the UI

These all ship and work normally. They have **no relation** to the context-collapse feature — they predate `marble_origami` and survived because they're independent UI features.

---

## 3. Why Both Features Are Eliminated

### Bundler Behavior

The `services/compact/snipCompact.js` and `services/contextCollapse/index.js` modules don't exist as files in either the v2.1.88 source bundle or the v2.1.112 binary. v2.1.88 source has TypeScript code like:

```typescript
const snipModule = feature('HISTORY_SNIP') ? require('./services/compact/snipCompact.js') : null;
```

When the build runs, `feature()` is evaluated as a constant (false, since the flag defaults to false). The conditional becomes:

```typescript
const snipModule = false ? require(...) : null;  // → null
```

The bundler optimizes this:
- The `require()` call is removed (no dependency tracked).
- The variable is set to `null` at compile time.
- All subsequent usage of `snipModule` is dead code (since it's null).

Eventually, all references to Snip-related code are constant-folded out. The resulting bundle has no trace of the feature except:
- The `Y = 0` parameter default in `gDY` (because it's a defaulted parameter, not a feature-gate)
- The persistence shims `XtY`/`MtY` (because they're in a separate module that doesn't gate)

### The `Y = 0` Surviva­l Mechanism

Why doesn't the bundler eliminate the `Y` parameter from `gDY`?

The bundler can eliminate dead **branches**, but not dead **parameters** of live functions. `gDY` is called from `QkK`, which is alive. `gDY`'s function signature is part of its calling contract. The bundler can't remove `Y` without breaking the call site (which passes `A` as the 6th positional argument).

A more aggressive bundler **could** detect that `Y` is always 0 and inline the math (`tokenCount = vJ(q) - 0 → vJ(q)`), but the current bundler doesn't do this level of constant propagation.

The `XtY`/`MtY` survival is different — they're exported through the SDK's public surface (`cli.chunks.mjs:9124-9125`). The bundler keeps exports even if they have no internal callers, because external consumers might use them.

### The Read-Side Forward-Compat Mechanism

The JSONL parser recognizes `marble-origami-{commit,snapshot}` types because:
- Session logs may contain entries from future builds.
- Skipping unrecognized types would lose data.
- Lifting them to dedicated resume fields makes them available even if the runtime can't act on them.

This is a forward-compat strategy: write nothing now (no caller of `XtY`/`MtY` in v2.1.112), but be prepared to read what future versions write.

---

## 4. The Conceptual Relationship Between Snip and Context-Collapse

A reasonable reading of the v2.1.88 source: **Snip and context-collapse are the same feature, viewed from different vantage points**.

- **Snip** is the surgical-deletion primitive. The model can emit a `SnipTool` invocation specifying which messages to delete by UUID.
- **Context-collapse** is the user-facing system that orchestrates Snip + summary generation + persistence to produce "rolling summaries of completed sub-conversations".

The autocompact path needed to know how many tokens snip had freed (without re-tokenizing) so its threshold heuristic stayed correct after snip ran. That's why `snipTokensFreed` is a parameter on `gDY`.

Removing collapse from the bundle removes the only producer of `snipTokensFreed > 0`, which renders the parameter vestigial. But since it's a default-valued parameter, removing it would be a behavior-equivalent refactor that hasn't been done yet.

---

## 5. Why Anthropic Hasn't Shipped These Features

The dead-code state suggests these features are **architected but not validated**:

- **Snip** is a powerful primitive but exposes a class of bugs: any incorrect deletion could corrupt the conversation in subtle ways. Bug-fixing a deletion primitive in production would be high-stakes.
- **Context-collapse** is even more complex: an LLM-driven decision system about what to archive vs keep. Wrong archival choices would be visible to users.

Anthropic has kept both dark across the entire v2.1.x line, with only:
- The vestigial parameter slot for snip
- The persistence write/read shims for collapse

This forward-compat scaffolding suggests:
- The team **expects to ship these eventually**.
- They're not ready to commit to a particular implementation.
- Future versions will fill in the runtime, and existing session logs (with the new entry types) will be readable by old clients.

---

## 6. What Replaced These Features in v2.1.112

The functional gaps left by Snip and context-collapse are filled by:

| Gap | v2.1.112 replacement |
|-----|----------------------|
| Surgical message deletion (Snip) | `qD4` KEEP-RECENT MC (clears tool results, not arbitrary messages) |
| Mid-ground between full compact and no-action (collapse) | None — full autocompact remains the only mid-session option |
| Forward overflow recovery (collapse `recoverFromOverflow`) | The new `context-hint-2026-04-09` reject path |
| Rolling sub-summaries (collapse "commits") | Not replaced; users get either summary-or-verbatim |

The `context-hint` reject path is the closest analog to what `recoverFromOverflow` would have done. It's narrower (only handles 422/424 reject; doesn't proactively collapse) but achieves the same end goal: letting the system recover from overflow without `_LK` "Conversation too long" errors.

---

## 7. Verification Commands

To definitively confirm the no-ship status of either feature in any future v2.1.x bundle:

### Snip Verification

```bash
cd /path/to/v2.1.x/source/

# All these should return empty:
grep -l "snipModule\|snipCompactIfNeeded\|snipProjection\|SnipTool\|SNIP_NUDGE_TEXT\|forceSnip\|isSnipBoundaryMessage" chunks.*.mjs

# This will find the vestigial parameter (acceptable):
grep -E "Y\s*=\s*0|snipTokensFreed" chunks.*.mjs
# Expected: only chunks.159.mjs:1365 (Y = 0 default in gDY)
```

### Context-Collapse Verification

```bash
# All four runtime symbols should be empty:
grep -l "applyCollapsesIfNeeded\|recoverFromOverflow\|isContextCollapseEnabled\|isWithheldPromptTooLong" chunks.*.mjs

# Persistence shims will exist (forward-compat):
grep -l "marble-origami-commit\|marble-origami-snapshot" chunks.*.mjs
# Expected: chunks.191.mjs (where XtY/MtY live)

# UI utilities NOT related to context-collapse will exist:
grep -l "collapsed_read_search\|teammate_shutdown_batch\|stop_hook_summary" chunks.*.mjs
# Expected: multiple chunks (UI grouping logic)
```

### Snip Caller Audit

To check if `gDY` ever receives a non-zero 5th argument:

```bash
grep -A2 "\.autocompact(" chunks.*.mjs | head -30
# In chunks.154.mjs:1016 the call is:
#   await H.autocompact(U, v, {systemPrompt, userContext, systemContext, toolUseContext, forkContextMessages: U}, w, g, n)
#                       arg1 arg2 arg3-large-object                                                              arg4 arg5 arg6=n
# Look for assignments to `n` between line 1005 (let n = 0) and line 1016 — there are none.
```

---

## 8. The Cost of Dead Code

What does this dead code cost?

### Bundle Size

- The `XtY`/`MtY` persistence shims are ~200 bytes uncompressed.
- The `Y = 0` default parameter is a few bytes.
- The JSONL parser's `marble-origami-*` type recognition is ~100 bytes.
- Total: <500 bytes of permanent overhead.

### Cognitive Load

For someone reading the source, the survival of these symbols is confusing:
- "Why does this function take a `snipTokensFreed` parameter?"
- "What writes `marble-origami-commit` to session logs?"
- "Why is `recordContextCollapseCommit` exported but never called?"

Without context (this audit), the answers aren't obvious. The cost is documentation overhead — this audit document, plus the original `snip_collapse_audit_v2.1.112.md`.

### Future Risk

Forward-compat code can rot:
- If the team forgets the marble-origami persistence exists, a future schema change might break it.
- If a future caller is added to `XtY`/`MtY`, it might write malformed entries.
- If the `Y = 0` default is removed, callers passing 6th arg would silently break.

The mitigation is documentation (this audit) and tests (which we don't have visibility into).

---

## 9. Telemetry Implications

Telemetry events for Snip (`tengu_snip_*`) and context-collapse (`tengu_context_collapse_*`) are absent from v2.1.112. This means:
- Anthropic gets zero data about how these features would behave in production.
- A/B testing the features requires server-side coordination plus client deployment.
- Validation of "does this feature actually help?" must wait for a build that ships the runtime.

The persistence shims write events to the session log, but those don't surface in real-time telemetry — they're persisted locally and only seen if someone analyzes session logs offline.

---

## 10. Summary Table

| Aspect | Snip | Context-Collapse (marble-origami) |
|--------|------|-----------------------------------|
| Implementation files in v2.1.88 source-tree | 6 separate `require()`s into non-existent files | `services/contextCollapse/{index,persist}.js` missing |
| Active runtime in v2.1.112 | ❌ DCE'd (every callable surface eliminated) | ❌ DCE'd (every applier/checker eliminated) |
| Persistence write-side in v2.1.112 | ❌ DCE'd | ⚠️ Present — `XtY`/`MtY` exported as `recordContextCollapse{Commit,Snapshot}` (no caller) |
| Persistence read-side in v2.1.112 | ❌ DCE'd | ✅ Present — JSONL parser recognises `marble-origami-{commit,snapshot}` |
| Tail-keep policy in v2.1.112 streaming truncation | ❌ N/A | ✅ `"always"` — survives any session-log compaction |
| Vestigial parameter holes | ⚠️ `Y = 0` (snipTokensFreed) on `gDY` | ❌ none |
| Vestigial documentation | ❌ "(e.g. by snip)" was scrubbed from `seed_read_state` SDK schema | n/a |
| UI utilities sharing the name | n/a | ✅ All 4 utilities ship: `collapsed_read_search`, `teammate_shutdown_batch`, `stop_hook_summary`, hook-grouping (not context-collapse) |

---

## 11. Conclusion: Net Less Compact Machinery in v2.1.112

When you compare what's actually shipped:

- **v2.1.88's source intends**: snip + context-collapse + autocompact + microcompact (proactive)
- **v2.1.88's binary**: autocompact + microcompact (proactive) + half-implemented snip parameter
- **v2.1.112's binary**: autocompact + microcompact (reactive only via context-hint) + vestigial snip parameter + half-shipped marble-origami persistence + new context-hint path

v2.1.112 ships **less** compact machinery than what 2.1.88's source intends. Both features in question (Snip, context-collapse) were always-gated dead code in 2.1.88, and 2.1.112 has further pruned:
- The proactive microcompact path (per-turn `_c` is now no-op)
- The `clear_tool_uses_20250919` API context-management strategy

What 2.1.112 **adds**:
- The `context-hint-2026-04-09` reject path
- The latched thinking-clear mechanism
- Forward-compat marble-origami persistence reading

The trajectory is **simplification + server-driven recovery**. Local complexity is being reduced; server-side coordination is being increased. This is consistent with Anthropic's broader API evolution where features like context_management and beta headers let server logic absorb client complexity.

---

## 12. Key Insight

Dead code in v2.1.112 is not random — it's **intentionally preserved scaffolding** for features that may ship in future versions. The two cases:

1. **Snip**: vestigial parameter, no persistence. If Snip ships later, the parameter would just become non-zero. Minimal overhead now.
2. **Marble-origami**: full persistence machinery (write-side exported, read-side handles new types) but no runtime. If marble-origami ships later, existing session logs from intervening versions are already correctly persisted (well, no — there are no writers in 2.1.112; but new session logs from a future version with writers will be readable by 2.1.112 clients).

The asymmetry is interesting: Snip's vestigial state is *minimal* (just a parameter), while marble-origami's is *substantial* (read+write+SDK exports). This suggests:
- Snip might be deprioritized or rethought (less commitment to its API surface).
- Marble-origami is more committed (more infrastructure preserved, more public-API surface).

Both are kept dark because shipping them would be high-stakes for a system as central as compact. The forward-compat scaffolding suggests Anthropic isn't abandoning them — just waiting for the right moment to validate and ship.

The lesson for the v2.1.112 codebase: **features can have multi-version lifecycles**. The "introduced" version isn't always when it ships; sometimes there's a long incubation where infrastructure is laid quietly until the team is ready to commit. The dead-code audit is what makes this lifecycle visible.
