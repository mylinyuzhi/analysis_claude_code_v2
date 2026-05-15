# Spurious Cache-Miss Warning After `/clear` or Compaction (v2.1.129)

## Changelog Anchor

> Fixed cache-miss warning appearing spuriously after `/clear` or compaction when changing `/effort` or `/model`

## Background — The Cache-Miss Switch Dialog

When the user switches model or effort level via `/model` or `/effort`, Claude Code shows a confirmation dialog warning that the change will invalidate the prompt cache:

```
┌────────────────────────────────────────────────────────────┐
│ Switch model?                                              │
│ Your next response will be slower and use more tokens      │
├────────────────────────────────────────────────────────────┤
│ This conversation is cached for the current model.         │
│ Switching to Opus 4.7 means the full history gets re-read  │
│ on your next message.                                      │
│                                                            │
│ [ Yes, switch to Opus 4.7 ]  [ No, go back ]               │
└────────────────────────────────────────────────────────────┘
```

This dialog is sensible mid-session: it warns the user that they'll pay a full cache-creation tokens cost on the next turn. But it shouldn't appear right after `/clear` (which wipes the conversation) or after a compaction (which replaces the conversation with a summary) — both of those already invalidated the cache, so the model/effort switch is a no-op for cache continuity.

## The State Field — `cacheMissAckedAtOutputTokens`

The session app state carries a counter:

```javascript
{
  ...
  cacheMissAckedAtOutputTokens: -1,    // default at session start
  ...
}
```

This tracks the value of `nX()` (total output tokens across this session) at the moment the user last *acknowledged* a cache-miss dialog (either by confirming the switch or by another flow that marks "you know about the cache state").

When the user opens `/model` or `/effort`, the dialog renders **only if** the current output-token count differs from the acked value:

```javascript
// cli_inner_pretty.js:495848-495858 (inside the /model dialog handler `w`)
function w(J, X) {
  let L = dG4(J),              // canonical model name
    P = nX();                  // current total output tokens
  if (P > 0 && P !== A) {      // A = cacheMissAckedAtOutputTokens
    if (L !== dG4(q ?? $)) {
      O({ model: J, effort: X, kind: "model" });
      return;                  // → show confirmation dialog
    }
    if (X !== void 0 && MY$(X, _, L, A)) {
      O({ model: J, effort: X, kind: "effort" });
      return;                  // → show confirmation dialog
    }
  }
  D(J, X);                     // direct switch, no dialog
}
```

## The Bug

Pre-v2.1.129:

1. User does `/clear` → conversation gets cleared but `cacheMissAckedAtOutputTokens` stays at its previous value.
2. User does `/model opus-4.7` → `nX()` is now (say) 50000 (carried over total). `cacheMissAckedAtOutputTokens` is (say) 35000 (from a previous switch in this session). `P > 0 && P !== A` → dialog fires.

This is wrong because `/clear` wiped the conversation. There IS no cache prefix to invalidate. The dialog is informational noise.

Similarly for compaction:

1. User compacts (auto or manual).
2. The conversation prefix is replaced by a summary.
3. User does `/model` → `nX()` is still high (output tokens are cumulative), `cacheMissAckedAtOutputTokens` is old, dialog fires.

Again wrong — compaction already paid the cache cost (the boundary marker invalidates everything before it).

## The Fix — Bump `cacheMissAckedAtOutputTokens` On Cache-Invalidating Events

`Bn` is the post-compact cleanup function that fires after any kind of compaction (auto, manual, partial, reactive). v2.1.129 added a state mutation that bumps `cacheMissAckedAtOutputTokens` to the current `nX()`:

```javascript
// ============================================
// postCompactCleanup - Run after compaction; updates cacheMissAckedAtOutputTokens to suppress next /model dialog
// Location: cli_inner_pretty.js:243907-243920
// ============================================

// ORIGINAL (for source lookup):
function Bn(H, $, q) {
  let K = X7H(H);
  if ((Uq8(q, "post_compact_cleanup", H), K))
    (qM.cache.clear?.(), Ef$("compact"), Kn(), we(), dq8(), z47(), c47($ ? mn($) : void 0));
  if (K) b3_.resetAutonomousLoopDelivered();
  if (K && $) {
    let _ = nX();
    $((A) => {
      if (A.cacheMissAckedAtOutputTokens === _) return A;
      return { ...A, cacheMissAckedAtOutputTokens: _ };
    });
  }
  kj6();
}

// READABLE (for understanding):
function postCompactCleanup(querySource, setAppState, agentId) {
  const shouldRunFullCleanup = isMainThreadEquivalent(querySource);   // X7H

  // Always: record a post_compact_cleanup analytics span
  recordSpan(agentId, "post_compact_cleanup", querySource);

  if (shouldRunFullCleanup) {
    // Drop all the per-session caches that got invalidated by compaction
    promptMemoryCache.clear?.();         // qM
    clearMcpToolFingerprintCache("compact");  // Ef$
    clearSkillListingCache();            // Kn
    clearSomeOtherTransientCache();      // we
    clearForkContextRefCache();          // dq8
    resetSubagentSummaryStateForCompact();  // z47
    resetSomeLifecycleState(setAppState ? withAppStateMutator(setAppState) : undefined);  // c47
    autonomousLoopDeliveryGuard.reset();  // b3_.resetAutonomousLoopDelivered
  }

  // ─── v2.1.129 fix: bump cacheMissAckedAtOutputTokens to current nX() ────────
  // This suppresses the /model or /effort confirmation dialog from firing right
  // after compaction, since the cache prefix is already invalidated.
  if (shouldRunFullCleanup && setAppState) {
    const currentTotalOutputTokens = totalOutputTokens();    // nX
    setAppState((prevState) => {
      if (prevState.cacheMissAckedAtOutputTokens === currentTotalOutputTokens) return prevState;
      return { ...prevState, cacheMissAckedAtOutputTokens: currentTotalOutputTokens };
    });
  }

  resetCompactionCachedState();    // kj6
}

// Mapping: Bn→postCompactCleanup, H→querySource, $→setAppState, q→agentId,
//          K→shouldRunFullCleanup, X7H→isMainThreadEquivalent, _→currentTotalOutputTokens,
//          nX→totalOutputTokens, Uq8→recordSpan, kj6→resetCompactionCachedState
```

The state-mutator is idempotent: if the value is already at `nX()`, it returns the previous state unchanged (avoiding spurious React renders).

## The `/clear` Path

`/clear` calls into a similar cleanup helper that wipes the conversation and resets the relevant state fields. v2.1.129 ensures `/clear` also updates `cacheMissAckedAtOutputTokens` — see the `cli_inner_pretty.js:607227` constant which is the default value used during state reset.

Once `cacheMissAckedAtOutputTokens` equals `nX()`, the dialog gate fails (`P !== A` is false), and the switch goes through without prompting.

## How The Gate Fires Or Skips

The gate logic in the model picker handler `w`:

```javascript
function w(model, effort) {
  const canonicalNewModel = canonicalize(model);
  const currentOutputTokens = totalOutputTokens();    // nX()

  // ─── The two-condition cache-invalidation gate ──────────────────────────────
  // P > 0: this session has produced output tokens (we're not in a fresh session)
  // P !== A: the user hasn't already acknowledged at this output-token level
  if (currentOutputTokens > 0 && currentOutputTokens !== cacheMissAckedAtOutputTokens) {
    // Cache is "dirty" relative to the last ack — show dialog
    if (canonicalNewModel !== canonicalize(sessionModel ?? currentModel)) {
      setShowDialog({ model, effort, kind: "model" });   // open dialog
      return;
    }
    if (effort !== undefined && willEffortChangeAffectCache(effort, currentEffort, canonicalNewModel, cacheMissAckedAtOutputTokens)) {
      setShowDialog({ model, effort, kind: "effort" });   // open dialog
      return;
    }
  }
  // No dialog: either no output yet (cold session) or user already acked at this level
  applySwitchDirectly(model, effort);
}
```

**Pre-fix scenario after compaction:**
- `nX()` returns 50000 (cumulative session tokens)
- `cacheMissAckedAtOutputTokens` is 35000 (from a switch 2 hours ago)
- `50000 !== 35000` → dialog fires → spurious

**Post-fix scenario after compaction:**
- Compaction calls `Bn(...)` which writes `cacheMissAckedAtOutputTokens = nX() = 50000`
- User opens `/model`, `nX()` returns 50000
- `50000 !== 50000` is false → no dialog → goes straight through

## The Confirmation Dialog Also Acks

When the user confirms a switch via the dialog, `Ky5` runs:

```javascript
// cli_inner_pretty.js:495708-495710
function Ky5(H) {
  return { ...H, cacheMissAckedAtOutputTokens: nX() };
}
```

So once the user clicks "Yes, switch", `cacheMissAckedAtOutputTokens` jumps to the current `nX()` — preventing the dialog from re-firing for the *same* invalidation.

## Why This Approach Instead Of A Boolean Flag

A simpler design would be a boolean `cacheValidForThisSession`:

```javascript
{ cacheValidForThisSession: true }
```

Set false on `/clear`/compaction, set true after the user acks via dialog.

The counter approach has one advantage: it handles the "multiple cache invalidations between dialog appearances" case naturally:

```
t=0  ack at output=10000
t=1  /clear   → ack jumps to 50000 (cumulative)
t=2  some turns → output=60000
t=3  user /model → 60000 !== 50000 → dialog fires (correct — there IS cache to invalidate now)
```

A simple boolean would have:
```
t=0  cacheValid = true
t=1  /clear   → cacheValid = false (?) or true (?)
                if true: dialog at t=3 would skip (wrong — we have new cache)
                if false: dialog never re-arms (wrong — there IS new cache after t=2)
```

The counter approach encodes "how much new output has accumulated since last ack" so it's monotonic and self-explanatory.

## Verification

```bash
# Confirm the state-mutator in Bn:
grep -B 2 -A 7 "cacheMissAckedAtOutputTokens === _" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# → if (K && $) { let _ = nX(); $((A) => { if (A.cacheMissAckedAtOutputTokens === _) return A; ... });

# Confirm the /model gate uses cacheMissAckedAtOutputTokens:
grep -A 3 "function w(J, X)" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js | head -10
# → let L = dG4(J), P = nX(); if (P > 0 && P !== A) { ... }

# Confirm the dialog confirm writes it:
grep -A 1 "function Ky5(H)" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# → return { ...H, cacheMissAckedAtOutputTokens: nX() };
```

## Trade-Off — Token Count Includes All Subagents

`nX()` sums output tokens across `modelUsage` (`cli_inner_pretty.js:2436-2438`). This means a session that spawns subagents has subagent output tokens counted in the total. If a subagent runs to completion *between* the user's last ack and the next `/model` switch, the dialog would re-fire because `nX()` shifted.

This is the right behavior — a subagent run that produced N output tokens probably also triggered cache_creation on the parent. Showing the dialog gives the user accurate accounting of where their token spend went.

## Cross-Link With Compaction

The compaction module ([../07_compact/](../07_compact/)) is the primary consumer of this fix. Every compact path (autocompact `vI6`/`QkK`, manual `/compact`, partial `_H4`, reactive `Y97`) eventually calls `Bn(...)` for post-compact cleanup. After v2.1.129, all four paths automatically suppress the next `/model`/`/effort` dialog.

See [../07_compact/v2_1_142_README.md](../07_compact/v2_1_142_README.md) for the compaction-side perspective.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - State management, telemetry
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compaction (caller of `Bn`)
> - [symbol_additions_v2_1_142_compact_cache.md](../00_overview/symbol_additions_v2_1_142_compact_cache.md) - This unit's new symbols

Key symbols:
- `postCompactCleanup` (`Bn`) — `cli_inner_pretty.js:243907-243920` — Cleanup orchestrator; bumps `cacheMissAckedAtOutputTokens`
- `confirmAckCacheMiss` (`Ky5`) — `cli_inner_pretty.js:495708-495710` — Sets `cacheMissAckedAtOutputTokens = nX()` on user confirm
- `confirmModelOrEffortSwitch` (`ZZ$`) — `cli_inner_pretty.js:495631-495707` — The confirmation dialog component
- `modelPickerHandleSwitch` — inline `w` in `zy5` at `cli_inner_pretty.js:495846-495860` — The gate decision
- `totalOutputTokens` (`nX`) — `cli_inner_pretty.js:2436-2438` — Returns cross-model sum
- `isMainThreadEquivalent` (`X7H`) — Checks if a querySource is main-thread-ish (controls whether `Bn` runs full cleanup)
- `willEffortChangeAffectCache` (`MY$`) — Decides if an effort change is cache-invalidating for a given model
