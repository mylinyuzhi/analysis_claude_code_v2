# `/recap` Slash Command — Session Recap

**Added:** v2.1.108 (slash command + `/config` toggle)
**Extended:** v2.1.110 (enabled for telemetry-disabled users)
**Location:** `chunks.189.mjs:2782-2792` (command registration)

## What it does

Provides a **1-2 sentence summary** of what the user was doing in this session — what task they're working on and what the next step is. Two trigger paths:

1. **Auto** — Terminal blurs for ~5 minutes (idle, away from screen). When the user returns, a recap is auto-shown above the next prompt. Configurable via `/config` (the `awaySummaryEnabled` setting).
2. **Manual** — User types `/recap`. Generates an on-demand summary regardless of focus state.

Both paths reuse the same underlying generator function — `generateAwaySummary` (see [away_summary.md](./away_summary.md)).

## v2.1.88 baseline

In v2.1.88, `claude-code-kim/src/services/awaySummary.ts` + `src/hooks/useAwaySummary.ts` already existed. The recap was **automatic only** — triggered after 5 minutes of terminal blur. Three gaps vs v2.1.112:

1. No `/recap` slash command — the recap was implicit.
2. No `CLAUDE_CODE_ENABLE_AWAY_SUMMARY` env override — only feature-flag `tengu_sedge_lantern` gating.
3. Telemetry-disabled users got no recap at all (the feature flag couldn't be read without GrowthBook).

## v2.1.112 — The /recap slash command

```javascript
// ============================================
// recapCommand - /recap slash command registration
// Location: chunks.189.mjs:2779-2792
// ============================================

// ORIGINAL (for source lookup):
ptK = L(() => {
    B1();
    QR6();
    LaY = {
        type: "local",
        name: "recap",
        description: "Generate a one-line session recap now",
        isEnabled: () => u8("tengu_sedge_lantern", !0),
        supportsNonInteractive: !1,
        load: () => Promise.resolve({
            call: yaY
        })
    }, haY = LaY
})

// READABLE (for understanding):
const recapCommandDef = lazyInit(() => {
  loadDependencies();
  loadAwaySummaryDeps();
  recapCommand = {
    type: "local",
    name: "recap",
    description: "Generate a one-line session recap now",
    isEnabled: () => getFeatureValue("tengu_sedge_lantern", true),
    supportsNonInteractive: false,
    load: () => Promise.resolve({ call: runRecapCommand })
  };
  recapCommandAlias = recapCommand;
});

// Mapping: ptK→recapCommandDef, LaY→recapCommand, haY→recapCommandAlias,
//          yaY→runRecapCommand, u8→getFeatureValue, L→lazyInit
```

## The Recap Handler

```javascript
// ============================================
// runRecapCommand - /recap command handler
// Location: chunks.189.mjs:2757-2773
// ============================================

// ORIGINAL (for source lookup):
yaY = async (q, K) => {
    let _ = await Vu8(K.abortController.signal);
    if (_ === null) {
        if (K.abortController.signal.aborted) return {
            type: "text",
            value: "Recap cancelled."
        };
        return {
            type: "text",
            value: "No recap available — needs at least one completed turn, or generation failed."
        }
    }
    return {
        type: "text",
        value: _
    }
}

// READABLE (for understanding):
const runRecapCommand = async (args, context) => {
  const summaryText = await generateAwaySummary(context.abortController.signal);
  if (summaryText === null) {
    if (context.abortController.signal.aborted) {
      return { type: "text", value: "Recap cancelled." };
    }
    return {
      type: "text",
      value: "No recap available — needs at least one completed turn, or generation failed."
    };
  }
  return { type: "text", value: summaryText };
};

// Mapping: yaY→runRecapCommand, q→args, K→context, Vu8→generateAwaySummary, _→summaryText
```

## Enablement Chain

The recap feature has a **5-step priority chain** — first matching gate wins:

```javascript
// ============================================
// isAwaySummaryEnabled - Decide if the auto recap is enabled
// Location: chunks.116.mjs:889-896
// ============================================

// ORIGINAL (for source lookup):
function UR6() {
    let q = process.env.CLAUDE_CODE_ENABLE_AWAY_SUMMARY;
    if (c5(q)) return !1;
    if (S6(q)) return !0;
    if (!u8("tengu_sedge_lantern", !0)) return !1;
    if (I7()) return !1;
    return v7()?.awaySummaryEnabled !== !1
}

// READABLE (for understanding):
function isAwaySummaryEnabled() {
  const envOverride = process.env.CLAUDE_CODE_ENABLE_AWAY_SUMMARY;

  // Step 1: explicit false in env var → hard off
  if (parseExplicitFalse(envOverride)) return false;

  // Step 2: explicit true in env var → hard on (forces feature even if telemetry disabled)
  if (parseExplicitTrue(envOverride)) return true;

  // Step 3: GrowthBook kill switch
  if (!getFeatureValue("tengu_sedge_lantern", true)) return false;

  // Step 4: non-interactive / SDK / headless mode → no recap
  if (isNonInteractiveMode()) return false;

  // Step 5: respect /config setting (defaults to true if absent)
  return getAppSettings()?.awaySummaryEnabled !== false;
}

// Mapping: UR6→isAwaySummaryEnabled, c5→parseExplicitFalse, S6→parseExplicitTrue,
//          u8→getFeatureValue, I7→isNonInteractiveMode, v7→getAppSettings
```

| Step | Gate | Result | Why |
|------|------|--------|-----|
| 1 | `CLAUDE_CODE_ENABLE_AWAY_SUMMARY=false` | **disabled** | Explicit user opt-out |
| 2 | `CLAUDE_CODE_ENABLE_AWAY_SUMMARY=true` | **enabled** | Explicit opt-in (bypasses all subsequent gates — critical for telemetry-disabled environments) |
| 3 | `tengu_sedge_lantern` feature flag = false | **disabled** | Anthropic-controlled kill switch |
| 4 | Non-interactive mode (SDK, `-p`, etc.) | **disabled** | Recap has no UI to render in |
| 5 | `awaySummaryEnabled: false` in settings | **disabled** | User toggled off in `/config` |
| 5 | (default — none of the above) | **enabled** | Defaults to on |

## `/config` Integration

The `awaySummaryEnabled` setting is part of the user-facing `/config` panel:

```javascript
// chunks.169.mjs:212-222 — config row registration
{
  id: "awaySummaryEnabled",
  label: "Session recap",
  // ...
  onChange: (newValue) => updateConfig({
    awaySummaryEnabled: newValue       // true | false
    awaySummaryEnabled: newValue ? void 0 : false  // omit if true to keep schema clean
  })
}
```

When the toggle changes, the app state's `awaySummaryEnabled` is updated synchronously (chunks.116.mjs:975-989). The auto-recap `useEffect` subscribes to this state, so flipping it disables/enables the auto-blur trigger immediately.

## Telemetry-Disabled Fallback (v2.1.110)

The changelog explicitly notes:

> 2.1.110: Session recap is now enabled for users with telemetry disabled (Bedrock, Vertex, Foundry, `DISABLE_TELEMETRY`)

The mechanism for this is the `CLAUDE_CODE_ENABLE_AWAY_SUMMARY` env var in **step 2** of the enablement chain. Telemetry-disabled users can set:

```sh
export CLAUDE_CODE_ENABLE_AWAY_SUMMARY=true
```

This bypasses the GrowthBook feature flag (step 3), which would otherwise return false in environments where GrowthBook is unavailable. The "force on" semantics mean even without telemetry, the recap LLM call still happens — using the small-fast model and the user's API credentials.

**Alternative considered (and rejected):** Auto-enable recap for telemetry-disabled users without requiring the env var. Rejected because telemetry-disabled often means "this user explicitly opted into a more private mode" — silently turning on a new feature that makes an extra API call would surprise them. The env var preserves the principle: features are off unless the user knows about them.

## Why this approach

**The /recap design pattern:**

A feature existed internally (auto-recap on idle return) → user research showed people want to *trigger* it explicitly → expose as a slash command.

This is the same pattern as:
- `/compact` — Internal autocompact existed; users wanted explicit control.
- `/clear` — Auto-trim of old history existed; users wanted to force a fresh start.
- `/cost` — Cost tracking happened internally; users wanted to see it on demand.

**Why `isEnabled` uses GrowthBook but not the env var:**

The `/recap` slash command's `isEnabled` only checks `tengu_sedge_lantern`. It does NOT check `awaySummaryEnabled` in settings, NOT check `CLAUDE_CODE_ENABLE_AWAY_SUMMARY`. This means:

- A user who turned **auto-recap off** in `/config` can still type `/recap` for a manual recap.
- A user with telemetry disabled who sets `CLAUDE_CODE_ENABLE_AWAY_SUMMARY=true` gets the auto path enabled (via step 2 of `isAwaySummaryEnabled`); the manual `/recap` was already enabled.
- An admin can kill `/recap` entirely by flipping `tengu_sedge_lantern` to false.

**Trade-off:** A user who toggled off auto-recap because they find it annoying still sees `/recap` in their command palette. The team chose this because manual + auto are conceptually different: manual is "I want this now"; auto is "fire it for me later." They don't need a unified switch.

**Key insight:** The recap LLM call (`generateAwaySummary`) sets `skipCacheWrite: true`. That means the recap query itself doesn't pollute the prompt cache. The recap is a fork-style read — it inspects the conversation without modifying the cached prefix. Without this flag, the recap call would invalidate the user's existing cache state (since the recap's `cache_control` marker placement differs from the main turn).

## Related symbols

- `recapCommand` (`LaY`) - The /recap command spec (chunks.189.mjs:2782)
- `runRecapCommand` (`yaY`) - The handler invoked by /recap (chunks.189.mjs:2757)
- `generateAwaySummary` (`Vu8`) - LLM-driven summary generator (chunks.116.mjs:898) — see [away_summary.md](./away_summary.md)
- `isAwaySummaryEnabled` (`UR6`) - 5-step enablement chain (chunks.116.mjs:889)
- `useAwaySummaryEffect` - React effect that wires blur → auto-recap (chunks.206.mjs:2535)
- `parseExplicitTrue` (`S6`) - Boolean env-var parser for truthy values
- `parseExplicitFalse` (`c5`) - Boolean env-var parser for falsy values
- `getFeatureValue` (`u8`) - GrowthBook feature flag reader
- `isNonInteractiveMode` (`I7`) - Detects SDK / `-p` headless mode
- `getAppSettings` (`v7`) - Returns merged settings object
