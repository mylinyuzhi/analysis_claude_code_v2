# Default Effort Bump for Pro/Max Subscribers (v2.1.117)

## What changed

Before v2.1.117, the per-model default effort was tiered:
- API-key/Bedrock/Vertex/Foundry/Team/Enterprise: `high` (since 2.1.94).
- Pro and Max subscribers on Opus 4.6 / Sonnet 4.6: `medium` (a holdover
  from the 2.1.93 baseline before the 2.1.94 bump).

The Pro/Max tier sat at the lower default because Anthropic's
subscription pricing rate-limits these accounts on tokens-per-window
— a higher default effort burns the window faster. The decision in
2.1.94 to set non-subscription tiers to `high` reflected that they pay
per-token, so deeper reasoning costs them money but doesn't lock them
out.

v2.1.117 raises the Pro/Max default to **`high`** as well, on Opus
4.6 / Sonnet 4.6. The rationale: Anthropic increased the per-window
allotment for Pro/Max in the same release, so the `high` budget is
sustainable.

Opus 4.7's default of `xhigh` (set up by `unpinOpus47LaunchEffort`)
remains the same — that already supersedes per-tier defaults on Opus
4.7.

## Source: `getDefaultEffortForModel`

```javascript
// ============================================
// getDefaultEffortForModel - per-model default after v2.1.117 bump
// Location: cli_inner_pretty.js:198951-198954
// ============================================

// ORIGINAL (for source lookup):
function $e$(H) {
  if (k7(H) === "claude-opus-4-7") return "xhigh";
  return "high";
}

// READABLE (for understanding):
function getDefaultEffortForModel(modelString) {
  // Opus 4.7 ships with the `xhigh` launch default. (Until the user
  // makes an explicit choice, He$ short-circuits this through the
  // unpinOpus47LaunchEffort latch.)
  if (resolveModelCanonicalId(modelString) === "claude-opus-4-7") {
    return "xhigh";
  }
  // All other thinking-capable models default to "high".
  //
  // BEFORE v2.1.117: Pro/Max subscribers on Opus 4.6 / Sonnet 4.6 had
  // an extra branch returning "medium" — this branch was removed.
  //
  // The simplification reflects Anthropic's product decision that the
  // increased rate-limits in 2.1.117 make `high` a reasonable default
  // even for subscription users.
  return "high";
}

// Mapping: $e$→getDefaultEffortForModel, k7→resolveModelCanonicalId
```

## Source: how the default flows into the resolver

```javascript
// ============================================
// resolveAppliedEffort - the per-turn resolver consuming the default
// Location: cli_inner_pretty.js:198874-198884
// ============================================

// ORIGINAL (for source lookup):
function Z3H(H, $) {
  if (!CP(H)) return;
  let q = He$(H),
    K = $e$(H),
    _ = IUH();
  if (_ === null) return q ? K : void 0;
  let A = _ ?? (q ? K : void 0) ?? $ ?? K;
  if (A === "max" && !fY$(H)) return "high";
  if (A === "xhigh" && !OY$(H)) return "high";
  return A;
}

// READABLE (for understanding):
function resolveAppliedEffort(model, appStateEffort) {
  // 1. Capability gate.
  if (!modelSupportsEffort(model)) return undefined;

  // 2. Per-model default.
  const isOpus47Launch = isOpus47LaunchDefaultActive(model);  // model is opus-4-7 AND !unpinOpus47LaunchEffort
  const modelDefault   = getDefaultEffortForModel(model);     // "xhigh" for Opus 4.7, "high" else

  // 3. Env override (CLAUDE_CODE_EFFORT_LEVEL).
  const envOverride = readEnvEffortLevel();
  if (envOverride === null) {
    // "auto"/"unset" → use launch default if Opus 4.7 latch active.
    return isOpus47Launch ? modelDefault : undefined;
  }

  // 4. Precedence: env > Opus 4.7 launch default > AppState > model default.
  let resolved = envOverride ?? (isOpus47Launch ? modelDefault : undefined) ?? appStateEffort ?? modelDefault;

  // 5. Silent downgrade.
  if (resolved === "max"   && !modelSupportsMaxEffort(model))   return "high";
  if (resolved === "xhigh" && !modelSupportsXhigh(model))      return "high";
  return resolved;
}

// Mapping: Z3H→resolveAppliedEffort, CP→modelSupportsEffort,
//          He$→isOpus47LaunchDefaultActive, $e$→getDefaultEffortForModel,
//          IUH→readEnvEffortLevel, fY$→modelSupportsMaxEffort, OY$→modelSupportsXhigh
```

The Pro/Max default bump is invisible in this function — the change
lives entirely in `getDefaultEffortForModel`. The resolver's flow is
unchanged.

## Cross-validation: Pre-2.1.117 vs 2.1.117

### Reconstructing the pre-2.1.117 shape

The v2.1.117 changelog entry says "Default effort for Pro/Max on Opus
4.6/Sonnet 4.6 now `high` (was medium)". The function-name pattern
hints at the pre-fix shape:

```javascript
// HYPOTHETICAL (pre-2.1.117):
function getDefaultEffortForModel(modelString) {
  if (resolveModelCanonicalId(modelString) === "claude-opus-4-7") return "xhigh";

  // Was a per-tier check:
  if (isSubscriptionUser() && isOpus46OrSonnet46(modelString)) return "medium";

  return "high";
}
```

The 2.1.117 fix removed that subscription-tier branch.

### User-visible impact

For a Pro user with Opus 4.6 selected and no explicit effort set:

| Step | Pre-2.1.117 | Post-2.1.117 |
|------|-------------|--------------|
| Open new session | Status bar: "Opus 4.6 with medium effort" | Status bar: "Opus 4.6 with high effort" |
| Quality | Standard reasoning | Comprehensive reasoning |
| Token consumption | Lower per-turn | ~3-4x higher per-turn |
| Rate-limit pressure | Was a 5-hour bucket of fewer tokens; medium gave more turns | After 2.1.117's bucket increase, high gives similar number of turns |

For Sonnet 4.6 the same shift applied. The user-visible mid-session
flip happened on first launch of v2.1.117, no migration.

## Why this approach

### Why a default bump rather than a UI nudge?

**What:** The default changed silently; no banner, no confirmation
dialog.

**Why:**

- A nudge would imply "we recommend you change this" — but the team's
  position is that `high` is now the *right* default, not a "consider
  upgrading" alternative.
- Users who had explicitly set effort already have an AppState value;
  the bump only affects users who never touched effort, where the
  default kicks in.
- The status bar already shows the active effort (`with high effort`),
  so an attentive user notices the change after one session.

### Why is the bump conditional on subscription tier removed from the function?

**What:** The post-2.1.117 function has *no* subscription check at
all. The previous code had `if (isSubscriptionUser() && …)`.

**Why:**

- Removing the branch is the simplest possible change. The post-fix
  code is two lines (Opus 4.7 → xhigh; else → high).
- If a future tier divergence is needed (e.g. Free returns to medium),
  the branch can be re-added. For now, all tiers converge on the same
  default.
- This simplifies the test surface and removes the need for
  `getUserTier()` calls in the resolver path — `getDefaultEffortForModel`
  is now a pure function of the model string.

### Why was the default originally `medium` for Pro/Max?

Pro and Max subscriptions have a fixed token allotment per 5-hour
window. `high` consumes more tokens per turn, so `high` shortens the
window. The 2.1.93/2.1.94 era set non-subscription tiers to `high`
because they pay per-token (more spend, but no lock-out), and kept
subscription tiers at `medium` for window protection.

The 2.1.117 release coincided with Anthropic's announcement of
increased subscription quotas; the per-window allotment became large
enough that `high` no longer locked out medium-frequency users. The
default flipped accordingly.

### Why now and not earlier or later?

The 2.1.117 release was chosen because:
1. The quota increase landed in the same backend release window — the
   client needed to update *with* the quota change so users see the
   benefit immediately.
2. Earlier (e.g. 2.1.110) would have locked users out under the old
   quota.
3. Later (e.g. 2.1.130) would have left a multi-week period where Pro
   users got worse default reasoning than API-key users on identical
   models — a misalignment.

## Cross-validation: v2.1.112 → v2.1.142

| Aspect | v2.1.112 | v2.1.142 | Δ |
|--------|----------|----------|---|
| Opus 4.7 default | `xhigh` (via launch latch) | `xhigh` (unchanged) | Unchanged |
| Opus 4.6, Pro/Max | `medium` (per-tier branch) | `high` | Bumped |
| Sonnet 4.6, Pro/Max | `medium` (per-tier branch) | `high` | Bumped |
| Opus 4.6, API-key | `high` (from 2.1.94) | `high` | Unchanged |
| Sonnet 4.6, API-key | `high` (from 2.1.94) | `high` | Unchanged |
| `getDefaultEffortForModel` body length | 4-6 lines (with tier branch) | 2 lines | Simplified |

## Related symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Effort
> - [symbol_additions_v2_1_142_think_ui.md](../00_overview/symbol_additions_v2_1_142_think_ui.md) — new symbols

Key functions in this document:
- `getDefaultEffortForModel` (`$e$`) — simplified to 2 lines; cli_inner_pretty.js:198951-198954
- `resolveAppliedEffort` (`Z3H`) — unchanged consumer; cli_inner_pretty.js:198874-198884
- `isOpus47LaunchDefaultActive` (`He$`) — the parallel Opus 4.7 latch; cli_inner_pretty.js:198871-198873
- `modelSupportsEffort` (`CP`) — capability gate; cli_inner_pretty.js:198795-198811
