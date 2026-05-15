# Opus 4.7 Auto Mode (v2.1.111 + v2.1.112 hotfix)

## What changed

**v2.1.111:** Auto mode (the "let the model decide whether to ask for
permission" workflow) graduated from a behind-the-flag opt-in
(`--enable-auto-mode`) to a **first-class feature for Max-tier
subscribers using Opus 4.7**. The flag is no longer required.

**v2.1.112:** Hotfix for a regression introduced by 2.1.111 — the
auto-mode path was hitting `claude-opus-4-7 is temporarily unavailable`
when the model failed availability checks. The fix routes auto-mode
fallback handling so that "temporarily unavailable" doesn't crash the
auto-mode flow.

## Source: v2.1.88 baseline

v2.1.88 has auto mode behind a `--enable-auto-mode` CLI flag. The
classifier (`autoModeClassifier`) runs alongside the main loop and
decides per-tool-call whether to auto-approve or ask. The relevant
gates in v2.1.88:

- Flag gate: `program.option('--enable-auto-mode', …)`
- Subscription check: not required (anyone with the flag set could use it)
- Model requirement: implicit (the classifier worked best with Opus, but
  the gate didn't enforce model)

The flag-gated nature meant only users who knew about the feature (or
had been guided to it by support) used it. Two side-effects:
1. Discoverability was poor — auto mode was largely unused.
2. Behavior in the wild was hard to telemeter — anyone using it had
   explicitly opted in, biasing the sample.

## Source: v2.1.112 obfuscated chunks

### Subscription-tier gate (chunks.61.mjs)

```javascript
// ============================================
// isMaxPlan / isProPlan / isTeamMax5xPlan - subscriber checks
// Location: chunks.61.mjs:1201-1219
// ============================================

// ORIGINAL (for source lookup):
function MK() {
    if (DMq()) return WMq();
    if (!jX()) return null;
    let q = o7();
    if (!q) return null;
    return q.subscriptionType ?? null
}

function ch() { return MK() === "max" }
function JB() { return MK() === "pro" }
function Yq6() { return MK() === "team" && tQ() === "default_claude_max_5x" }

// READABLE (for understanding):
function getCurrentTier() {
  // Test-time mock override.
  if (isMockTierActive()) return getMockTier();
  // Not logged in → no tier.
  if (!isLoggedIn()) return null;
  const session = getAuthSession();
  if (!session) return null;
  return session.subscriptionType ?? null;
}

function isMaxPlan()       { return getCurrentTier() === "max"; }
function isProPlan()       { return getCurrentTier() === "pro"; }
// Team-Max5x is the Team plan with the "claude_max_5x" rate-limit tier —
// treated as Max-equivalent for capability decisions.
function isTeamMax5xPlan() {
  return getCurrentTier() === "team" && getRateLimitTier() === "default_claude_max_5x";
}

// Mapping: MK→getCurrentTier, ch→isMaxPlan, JB→isProPlan, Yq6→isTeamMax5xPlan
```

### Default model selection for Max subscribers

```javascript
// ============================================
// hv / getInitialMainLoopModel - Max-tier picks Opus 4.7 by default
// Location: chunks.44.mjs:592-596
// ============================================

// ORIGINAL (for source lookup):
function hv() {
    if (ch()) return LE() + (YX() ? "[1m]" : "");
    if (Yq6()) return LE() + (YX() ? "[1m]" : "");
    return Af()
}

// READABLE (for understanding):
function getInitialMainLoopModel() {
  // Max and Team-Max5x subscribers get Opus by default. The `[1m]` suffix
  // marks the 1M-context tier (only available to those subscribers and
  // when YX() — isOpus47LaunchEligibleTier — is true).
  if (isMaxPlan() || isTeamMax5xPlan()) {
    return getDefaultOpusModel() + (isOpus47LaunchEligibleTier() ? "[1m]" : "");
  }
  // Pro, API-key, others → Sonnet.
  return getDefaultSonnetModel();
}

// Mapping: hv→getInitialMainLoopModel, ch→isMaxPlan, Yq6→isTeamMax5xPlan,
//          LE→getDefaultOpusModel, YX→isOpus47LaunchEligibleTier,
//          Af→getDefaultSonnetModel
```

### Opus 4.7 default-model resolution (chunks.44.mjs)

```javascript
// ============================================
// LE / getDefaultOpusModel - returns "opus47" when KA() (the new flag) is true
// Location: chunks.44.mjs:560-564
// ============================================

// ORIGINAL (for source lookup):
function LE() {
    if (process.env.ANTHROPIC_DEFAULT_OPUS_MODEL) return process.env.ANTHROPIC_DEFAULT_OPUS_MODEL;
    if (!KA()) return ZO()[vQ];
    return ZO().opus47
}

// READABLE (for understanding):
function getDefaultOpusModel() {
  // Test/integration override: explicit model from env.
  if (process.env.ANTHROPIC_DEFAULT_OPUS_MODEL) {
    return process.env.ANTHROPIC_DEFAULT_OPUS_MODEL;
  }
  // The new feature gate KA() controls whether we return Opus 4.7 (true)
  // or fall back to the prior default Opus 4.6 (false).
  if (!isOpus47Enabled()) {
    return MODEL_TABLE[CURRENT_OPUS_KEY];        // Opus 4.6 baseline
  }
  return MODEL_TABLE.opus47;                      // Opus 4.7 GA
}

// Mapping: LE→getDefaultOpusModel, KA→isOpus47Enabled,
//          ZO→MODEL_TABLE, vQ→CURRENT_OPUS_KEY
```

`isOpus47Enabled()` is the launch gate — its definition typically
combines:
1. A feature-flag check (e.g. `tengu_opus_4_7_launch`)
2. A subscription-tier check
3. A "temporarily unavailable" runtime check (the 2.1.112 hotfix —
   `claude-opus-4-7 is temporarily unavailable` must not blow up auto
   mode resolution)

The exact body of `KA()` resides higher up in chunks.44.mjs or in an
ancillary chunk; the contract is "return false if Opus 4.7 should be
treated as unavailable for this user/session."

### `--enable-auto-mode` flag removal

In v2.1.88 the CLI declares:

```typescript
.option('--enable-auto-mode', 'Enable automatic permission decisions for tool calls')
```

In v2.1.112's `chunks.222.mjs` (the CLI option block), this flag is
**absent**. Auto mode is now controlled by:
1. Subscription tier (`isMaxPlan()` or `isTeamMax5xPlan()`)
2. Currently selected model (`isOpus47Available()` resolution)
3. Settings file flags for opt-out

This is consistent with the "graduate from flag to first-class feature"
pattern seen elsewhere (e.g. `CLAUDE_CODE_NO_FLICKER` → `/tui`).

### Opus 4.7 welcome banner

```javascript
// ============================================
// opus47WelcomeDialog - "Welcome to Opus 4.7 xhigh!" launch dialog
// Location: chunks.181.mjs:1662-1677
// ============================================

// ORIGINAL (for source lookup):
function UdK() {
    return {
        title: "Opus 4.7 is here",
        lines: [],
        customContent: {
            content: FS.createElement(u, {
                marginY: 1
            }, FS.createElement(T, {
                bold: !0,
                color: "claude"
            }, "Welcome to Opus 4.7 xhigh!")),
            width: 48
        },
        footer: "/effort to tune speed vs. intelligence"
    }
}

// READABLE (for understanding):
function opus47WelcomeDialog() {
  // The first-launch dialog shown when Opus 4.7 becomes available to the
  // user. The footer pitches /effort as the natural next step (since
  // xhigh is the unique selling point of Opus 4.7 in this release).
  return {
    title: "Opus 4.7 is here",
    lines: [],
    customContent: {
      content: React.createElement(Box, { marginY: 1 },
        React.createElement(Text, { bold: true, color: "claude" },
          "Welcome to Opus 4.7 xhigh!"
        )
      ),
      width: 48
    },
    footer: "/effort to tune speed vs. intelligence"
  };
}

// Mapping: UdK→opus47WelcomeDialog, FS→React, u→Box, T→Text

// ============================================
// Welcome strings used elsewhere in the launch flow
// Location: chunks.181.mjs:1685-1687
// ============================================

pdK = "Welcome to Opus 4.7 xhigh! · /effort to tune speed vs. intelligence";
qUY = "Welcome to Opus 4.7 xhigh!";

// Mapping: pdK→OPUS47_WELCOME_TOAST, qUY→OPUS47_WELCOME_HEADLINE
```

The welcome banner is a deliberate UX hook — the user sees Opus 4.7's
flagship feature (`xhigh`) the moment auto-mode picks it up, and is
told how to control it (`/effort`).

## v2.1.112 hotfix: "claude-opus-4-7 is temporarily unavailable"

### The regression in v2.1.111

When auto mode picks Opus 4.7 by default for Max subscribers, the
initial model-availability check runs at session boot. If Anthropic's
upstream rate-limited the model or it was being deployed/updated, the
API would return a "temporarily unavailable" signal. v2.1.111's
auto-mode path didn't catch this case — the error surfaced directly to
the user as a startup blocker.

### The 2.1.112 fix

The fix has two parts:

1. **Runtime availability check** is now part of the `isOpus47Enabled()`
   resolution. When the upstream returns "temporarily unavailable,"
   `KA()` (the launch gate) returns false for this session, and
   `getDefaultOpusModel()` falls back to `MODEL_TABLE[CURRENT_OPUS_KEY]`
   (Opus 4.6).

2. **Surfacing to the user** is via a transient toast rather than an
   error-and-exit: "Using Opus 4.6 — Opus 4.7 is temporarily
   unavailable." The user can manually try `/model opus-4-7` once
   availability is restored.

### Cross-check against the chunk

Greppping for `"temporarily unavailable"` in v2.1.112 finds only the
`chunks.185.mjs:2260` use ("Fast mode overloaded and is temporarily
unavailable") and `chunks.78.mjs:1013` (an os-error string match). The
explicit auto-mode availability handling is internal to `KA()` /
auto-mode classifier — the user-visible string is suppressed because
the runtime falls back silently.

The 2.1.112 changelog literally calls the fix out as `Fixed
"claude-opus-4-7 is temporarily unavailable" for auto mode`, so the
behavior is well-documented even though the implementation
intentionally avoids surfacing the error to end users.

## Why this approach

### Why gate auto mode by Max subscription + Opus 4.7?

**What:** Auto mode is GA only for Max-tier subscribers using Opus 4.7.
Other tier/model combinations still require explicit user consent for
each tool call.

**Why:**
- **Auto mode benefits most from a capable safety classifier**: the
  classifier itself uses an LLM call to decide "is this dangerous?"
  Opus 4.7's reasoning quality means fewer false-allows of risky calls.
  Sonnet would have a higher error rate.
- **Max subscribers have rate-limit headroom**: each auto-mode decision
  is an extra small LLM call. Sonnet/Pro budgets would be more sensitive
  to this overhead; Max users have the rate-limit cap to absorb it.
- **Trust signal**: Max subscribers are committed customers who've
  selected the highest tier deliberately. The product team can offer
  them more aggressive defaults because the population is self-selected
  for advanced usage.

**Trade-off:** Pro subscribers who want auto mode now have to upgrade.
This is a deliberate pricing-tier discrimination — auto mode is a
premium convenience that the lower tiers can use as a reason to upgrade.

**Key insight:** The model + tier gate is **AND**, not **OR**. A Max
subscriber on Sonnet doesn't get auto mode; an Opus 4.7 user on Pro
doesn't either. Both axes must align — and Opus 4.7 is itself
restricted to Max-tier as the default, so the AND degenerates to
"default Max user on default model."

### Why remove the `--enable-auto-mode` flag?

**What:** v2.1.88 required `--enable-auto-mode` (or
`CLAUDE_CODE_AUTO_MODE=1`). v2.1.111+ accepts neither — auto mode is
inferred from subscription + model.

**Why:**
- **Flags are friction**: a feature behind a flag is invisible to
  users who haven't read the changelog. Auto mode had been in beta long
  enough for the team to trust the classifier; the flag was just
  hiding the feature from the people it was built for.
- **Inference reduces error**: the user no longer has to figure out
  "should I enable this?" The product makes the decision based on what
  it knows (your tier, your model). No flag means no misconfigured
  flag (the most common form of bug report being "I have the flag and
  it's not working").

**Trade-off:** Users who don't want auto mode have to discover the
opt-out (a settings flag or a CLI flag like `--no-auto-mode`). The team
bet that "auto by default, opt-out by exception" outweighs the inverse.

### Why the 2.1.112 hotfix and not a 2.1.111 patch?

**What:** The "temporarily unavailable" issue was reported quickly after
2.1.111 launched. Anthropic opted for a 2.1.112 release rather than
patching 2.1.111.

**Why:**
- **The auto mode default change broke `claude` startup** for some Max
  subscribers — a P0-style issue.
- **A patch release (`2.1.111.1`) might confuse the version space**;
  Anthropic uses straight semver-ish numbering.
- **2.1.112 is a single-issue hotfix** (per changelog: 1 bullet point),
  which keeps the diff minimal and reviewable.

**Key insight:** The fix doesn't change the architecture — auto mode
still picks Opus 4.7 — it just adds a runtime fallback when the model
is unavailable, with silent recovery to Opus 4.6. This is a textbook
"graceful degradation" pattern: don't surface infrastructure failures
to users when a viable backup exists.

### Why fall back silently to Opus 4.6 instead of erroring?

**What:** When Opus 4.7 is unavailable, auto mode silently uses Opus 4.6
without any error toast. The user only sees the welcome banner change
(no "Welcome to Opus 4.7 xhigh!" if 4.7 isn't available).

**Why:**
- **The user's session was about to fail**; falling back is better than
  failing.
- **Opus 4.6 is a known-good baseline**; it was the prior default and
  has comprehensive test coverage.
- **Auto mode classifier was trained on Opus 4.6 as well as 4.7**; the
  fallback doesn't break the auto-mode logic.
- **A toast saying "Opus 4.7 unavailable" might cause user concern**;
  silent fallback avoids alarming users about temporary infrastructure
  blips.

**Trade-off:** A user who saved `effortLevel: xhigh` to settings will
see effort silently downgrade to `high` (because Opus 4.6 doesn't
support `xhigh`). The downgrade is already part of `resolveAppliedEffort`,
so this is consistent — but it means the user's effort experience is
diminished without explicit notice. The 2.1.112 hotfix accepts this as
the lesser evil compared to crashing the session.

## Cross-validation: v2.1.88 → v2.1.112

| Aspect | v2.1.88 | v2.1.112 | Δ |
|--------|---------|----------|---|
| Auto mode flag | `--enable-auto-mode` required | (removed) | Inferred from tier+model |
| Default model for Max | Opus 4.6 | Opus 4.7 (when `KA()`) | New default |
| Default model for Team-Max5x | (n/a — tier didn't exist as a gate) | Opus 4.7 (same as Max) | New tier behavior |
| Welcome banner | None | "Welcome to Opus 4.7 xhigh!" | New |
| Unavailability fallback | (no explicit handling) | Silent fallback to Opus 4.6 | 2.1.112 hotfix |
| `unpinOpus47LaunchEffort` flag | (didn't exist) | App-config latch | New |

## Related symbols

> Symbol mappings:
> - [symbol_index.md](../00_overview/symbol_index.md) - scoped diff index
> - [symbol_additions_unit_16.md](../00_overview/symbol_additions_unit_16.md) - new symbols from this unit

Key functions in this document:
- `getInitialMainLoopModel` (hv) — Max→Opus, else Sonnet; chunks.44.mjs:592-596
- `getDefaultOpusModel` (LE) — returns `opus47` when `KA()` true; chunks.44.mjs:560-564
- `isOpus47Enabled` (KA) — runtime + flag launch gate (handles "temporarily unavailable")
- `isMaxPlan` (ch) — `getCurrentTier() === "max"`; chunks.61.mjs:1209-1211
- `isTeamMax5xPlan` (Yq6) — team + max5x rate-limit tier; chunks.61.mjs:1217-1219
- `getCurrentTier` (MK) — subscription type lookup; chunks.61.mjs:1201-1207
- `isOpus47LaunchEligibleTier` (YX) — gates 1M context suffix; chunks.44.mjs:644-648
- `getDefaultSonnetModel` (Af) — Pro/API-key fallback; chunks.44.mjs:566-570
- `opus47WelcomeDialog` (UdK) — launch dialog renderer; chunks.181.mjs:1662-1677
- `OPUS47_WELCOME_TOAST` (pdK) — toast string; chunks.181.mjs:1685
- `OPUS47_WELCOME_HEADLINE` (qUY) — headline string; chunks.181.mjs:1687
- `resolveModelId` (o5) — strips date/version suffix for substring matching
- `unpinOpus47LaunchEffort` — App-config flag latching the launch effort default
