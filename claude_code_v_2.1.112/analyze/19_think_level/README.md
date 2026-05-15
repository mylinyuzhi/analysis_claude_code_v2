# 19 — Think Level: Effort + Model Selection (v2.1.88 → v2.1.112)

## TL;DR

Between v2.1.88 and v2.1.112, the **effort system** grew from a 4-level scalar
(`low`/`medium`/`high`/`max`) into a 5-level scalar (`low`/`medium`/`high`/
`xhigh`/`max`) with a deeply model-aware resolution pipeline. The new
`xhigh` tier sits between `high` and `max` and is **available only for Opus
4.7** — every other model silently downgrades `xhigh → high`. Opus 4.7 also
defaults to `xhigh` instead of `high`, but only until the user makes their
first explicit effort change (via the `unpinOpus47LaunchEffort` config
latch).

Five user-visible changes drive this module:

| Kind | Version | Change |
|------|---------|--------|
| feat | **2.1.94** | Default effort changed from `medium` to `high` for API-key, Bedrock/Vertex/Foundry, Team, and Enterprise users (subscription tiers stay at `medium` for Opus 4.6) |
| fix  | **2.1.101** | Fixed `/effort max` being denied for unknown or future model IDs — `modelSupportsMaxEffort` flipped from allowlist to **blocklist** semantics |
| feat | **2.1.110** | `/model` now warns before switching mid-conversation, since the next response re-reads the full history uncached |
| feat | **2.1.111** | `xhigh` effort level (Opus 4.7 only), interactive `/effort` slider, Opus 4.7 auto-mode GA for Max subscribers |
| fix  | **2.1.112** | Fixed `claude-opus-4-7 is temporarily unavailable` error for auto mode |

The architectural through-line: effort is no longer a setting the user
*types* — it's a **slider gesture per-model**, with sensible defaults
imposed at first launch and a one-shot "unpin" mechanism so the default
release doesn't permanently override the user's preferences.

---

## Module Structure

| Document | Purpose |
|----------|---------|
| [xhigh_effort.md](./xhigh_effort.md) | The new `xhigh` tier (2.1.111): gate, downgrade, Opus 4.7 default with `unpinOpus47LaunchEffort` latch |
| [effort_slider.md](./effort_slider.md) | `/effort` interactive slider (2.1.111): 5-position slider, ←/→/Enter handling, dispatch path |
| [opus_4_7_auto_mode.md](./opus_4_7_auto_mode.md) | Opus 4.7 auto-mode GA (2.1.111): Max-subscriber gate; 2.1.112 hotfix for "temporarily unavailable" |
| [model_switch_warning.md](./model_switch_warning.md) | `/model` mid-conversation cache-invalidation warning (2.1.110) |
| [effort_max_denial_fix.md](./effort_max_denial_fix.md) | `/effort max` denial fix (2.1.101): allowlist → blocklist semantics |

> Symbol mappings:
> - [symbol_index.md](../00_overview/symbol_index.md) — scoped diff index
> - [symbol_additions_unit_16.md](../00_overview/symbol_additions_unit_16.md) — new symbol mappings discovered in this unit
>
> Key functions in this module:
> - `modelSupportsEffort` (QI) — chunks.80.mjs:2684 — effort-parameter capability gate
> - `modelSupportsMaxEffort` (Ct6) — chunks.80.mjs:2701 — blocklist-driven max gate
> - `modelSupportsXhigh` (bt6) — chunks.80.mjs:2708 — Opus 4.7-only xhigh gate
> - `resolveAppliedEffort` (wy6) — chunks.80.mjs:2746 — env→state→default precedence + downgrade
> - `getDefaultEffortForModel` (IF1) — chunks.80.mjs:2811 — Opus 4.7 → xhigh, Opus 4.6 Pro/Max → medium
> - `EffortSliderComponent` (IoY) — chunks.189.mjs:1193 — 5-position arrow-key slider
> - `applyEffortChange` (KhY) — chunks.168.mjs:951 — model-aware cycle (with xhigh/max conditional inclusion)
> - `ModelSwitchConfirmationDialog` (taK) — chunks.188.mjs:2206 — `/model` mid-conversation warning
> - `effortCommandDef` (YtK) — chunks.189.mjs:1430 — `/effort` command def
> - `EFFORT_LEVELS` (UI) — chunks.80.mjs:2835 — `["low","medium","high","xhigh","max"]`
> - `MAX_EFFORT_BLOCKLIST` (c8z) — chunks.80.mjs:2836 — claude-3-*, sonnet-4-0/4-5, opus-4-0/4-1/4-5
> - `unpinOpus47LaunchEffort` — App-config flag latching Opus 4.7's first-launch `xhigh` default
> - `OPUS47_WELCOME_TOAST` (pdK) — chunks.181.mjs:1685 — launch toast text

---

## Effort Resolution Pipeline (v2.1.112)

```
                       resolveAppliedEffort(model, appStateEffort)
                                        │
        ┌───────────────────────────────┼─────────────────────────────┐
        │                               │                              │
        ▼                               ▼                              ▼
  isOpus47Default ?               readEnvEffortLevel              getDefaultEffortForModel(model)
  (model is opus-4-7 AND          (CLAUDE_CODE_EFFORT_LEVEL,        ├─ opus-4-7  → "xhigh"
   !unpinOpus47LaunchEffort)       "auto"/"unset" → null,           ├─ opus-4-6 (Pro/Max) → "medium"
        │                          else parsed level)                ├─ unknown if turtle-carbon → "medium"
        │                                │                           └─ else → "high"
        ▼                                ▼
   if env==null                  resolved =
     ↳ return isOpus47Default      env ?? (opus47Default ?? appState ?? default)
       ? default : undefined                  │
                                              ▼
                                  if resolved=="max"  AND NOT modelSupportsMaxEffort(model)
                                      ↳ return "high"        (silent downgrade)
                                  if resolved=="xhigh" AND NOT modelSupportsXhigh(model)
                                      ↳ return "high"        (silent downgrade)
                                  return resolved
```

Two important invariants:

1. **Env wins**: `CLAUDE_CODE_EFFORT_LEVEL` always takes precedence over
   AppState and over the per-model default. Setting it to `"auto"`/`"unset"`
   pins the resolution to "no effort param sent."

2. **Silent downgrade**: requesting `xhigh` or `max` on a model that does
   not support it returns `high`, not an error. A `/effort max` on Sonnet
   produces `Set effort level to max…` but the actual API call sends
   `effort=high`. The user sees the substitution surface only via the
   "burns fastest" hint on `high` for Pro on Opus 4.6 (a separate UX nudge
   gated by `tengu_slate_finch`).

## The Five Effort Levels

| Level | Token Budget (approx) | Default Models | Gate |
|-------|----------------------|----------------|------|
| `low` | thinking off | — | always available where `modelSupportsEffort` is true |
| `medium` | ~8k thinking budget | Opus 4.6 (Pro/Max) | always available where `modelSupportsEffort` is true |
| `high` | ~32k thinking budget | API-key/Bedrock/Vertex/Foundry/Team/Enterprise (since 2.1.94) | always available where `modelSupportsEffort` is true |
| `xhigh` | between high and max | **Opus 4.7** (first-launch via unpin latch) | `bt6` / `modelSupportsXhigh` — Opus 4.7 only |
| `max` | maximum, deepest reasoning | — (always explicit) | `Ct6` / `modelSupportsMaxEffort` — **blocklist** (denied only on claude-3-*, sonnet-4-0/4-5, opus-4-0/4-1/4-5) |

## What Changed in Practice

### For an Opus 4.7 user
- First session: effort defaults to `xhigh`, welcome banner highlights it,
  status bar shows " with xhigh effort".
- `/effort high`: switch to `high` for this session **and** mark the unpin
  flag — future Opus 4.7 sessions will respect the saved preference.
- `/effort max`: works (Opus 4.7 is not in the blocklist).
- `/model claude-sonnet-4-6` mid-conversation: gets the new warning
  dialog ("This conversation is cached for the current model. Switching to
  Sonnet 4.6 means the full history gets re-read on your next message.").

### For a Sonnet 4.6 / Opus 4.6 user
- `/effort xhigh`: appears to succeed but silently routes to `high`
  because `modelSupportsXhigh` returns false. (No error toast — the
  resolver downgrades transparently.)
- `/effort max` on Sonnet 4.6 / Opus 4.6: works (both are out of the
  blocklist post-2.1.101).
- `/effort` with no args: opens the new slider (the picker still shows
  `xhigh` as a position; selecting it is a no-op functionally because of
  the downgrade).

### For an enterprise (API-key/Bedrock/Vertex/Foundry/Team) user
- Default effort jumped from `medium` (pre-2.1.94) to `high` (2.1.94+) —
  net positive for inference quality, paid for via the per-token billing
  model these tiers already use.

---

## Why This Architecture

**Why a separate `xhigh` tier instead of just letting Opus 4.7 use `max`?**
- `max` is reserved for the "really hard problem" — the budget escalates
  significantly and rate-limit consumption is steep.
- Opus 4.7's `high` is *too cheap* for the model's capability; users
  immediately bumped to `max` and burned their limits.
- A middle tier (`xhigh`) targets the "deep but not maximum" sweet spot
  that telemetry showed users wanted.

**Why silent downgrade instead of rejecting unsupported levels?**
- Scripts/automations that say "use xhigh effort" should *still run* on
  Sonnet — they shouldn't crash with `Unsupported effort level for model`.
- Telemetry-friendly: the resolver's downgrade fires the same effort
  resolution path; only `effort` in the actual API request is `high`.

**Why the `unpinOpus47LaunchEffort` latch?**
- Defaults can't override an explicit user choice. The latch ensures the
  Opus-4.7-defaults-to-`xhigh` rule only applies until the user explicitly
  picks an effort, then yields.
- The latch is set on **first user effort action** (slider Enter,
  `/effort <level>`, picker change) and persisted to app config.

**Why a slider instead of a typed argument for `/effort`?**
- Five levels with distinct names is friction; users typo'd `xhigh` as
  `x-high`, `xHigh`, `extra-high`. The slider is keyboard-only ergonomic.
- The slider visualizes the *gradient* (speed ←→ intelligence), making
  the trade-off obvious in a way typing a word does not.

**Why warn on `/model` mid-conversation?**
- Anthropic's prompt cache is **model-scoped**: switching to a different
  model invalidates the conversation cache on that new model.
- Without warning, users hit a surprise "next response is slow and ~5×
  more expensive" cliff. The dialog surfaces this *before* the swap so the
  user can confirm or back out.
- Aligns with the v2.1.94+ telemetry-driven cost-policy push (defaults to
  `high`, warns on cache invalidation — both nudge users toward
  cost-aware choices).

---

## Cross-References

- **Compaction** (07_compact): the cache-invalidation warning is the same
  intuition as the post-compact full-cache-read penalty.
- **Plan Mode** (12_plan_mode): plan mode independently overrides the
  main-loop model (see `HB` selector in chunks.44.mjs:580-590).
- **Auto Mode** (separate unit): Opus 4.7 auto mode gate intersects with
  Max-subscriber detection (`ch()`/`Yq6()` in chunks.61.mjs).
