# Thinking, effort, and fast mode

## Thinking state versus request template

The UI stores a live boolean `thinkingEnabled`, while startup/CLI parsing supplies a richer
`thinkingConfig` object. The 2.1.221 bug was caused by treating the latter as immutable authority even
after the former changed.

### Live thinking restoration

**What it does:** Makes “turn thinking on” effective even when the session started with a disabled
thinking template.

**How it works:**
1. Every interactive turn reads current application state immediately before building loop options
   (`cli_inner_pretty.js:916065-916087`).
2. `resolveInteractiveThinkingConfig` (`gEu`, `118481-118486`) returns `{type: "disabled"}` when live
   `thinkingEnabled` is false, regardless of the startup template.
3. When live state is true and the startup template is already enabled/adaptive, it preserves that
   explicit template.
4. When live state is true but the startup template is disabled, it constructs adaptive thinking.
5. It derives an optional interactive display mode from settings and includes it in the adaptive object.
6. The hotkey and `/config` handlers update the live app state, so the next request sees the new value.

In 2.1.220 the call site used `state.thinkingEnabled !== false ? startupConfig : disabled`
(`2.1.220:822403`). If `startupConfig` itself was disabled, switching the boolean on returned the same
disabled object for every later turn. The new reconciliation function removes that stale latch.

**Why this approach:**
- Live session intent must win over a startup default, but explicit enabled budgets/displays should not
  be discarded unnecessarily.
- Rebuilding adaptive mode is the only meaningful recovery when no enabled budget exists in the
  disabled template.
- Persisting a mutation into the original config object would couple UI state to CLI/SDK inputs and
  make reset semantics harder to reason about.

**Key insight:** The defect was not in the toggle handler; state changed correctly. The request builder
failed to synthesize an enabled configuration from that state.

### Thinking request serialization

**What it does:** Converts session intent into a model/provider-valid API `thinking` object.

**How it works:**
1. The request builder computes `Za`: thinking is active only when the reconciled config is not disabled
   and `CLAUDE_CODE_DISABLE_THINKING` is not set (`cli_inner_pretty.js:529667-529674`).
2. For thinking-capable models, adaptive mode is selected from catalogue/provider capability unless
   explicitly disabled for the relevant model generation.
3. Otherwise an enabled budget is clamped between 1,024 and one token below the maximum output limit.
4. An explicit disabled object is sent only on eligible first-party requests whose model accepts it;
   models with `rejects_disabled_thinking` avoid that form.
5. Active thinking demotes forced `tool_choice` to `auto`, because the API does not accept a forced tool
   with extended thinking.
6. A disabled object with stray keys is sanitized by `mZb` (`528915-528929`) before transmission.

**Why this approach:**
- Capability-driven shaping avoids hardcoding request forms for each model/provider combination.
- Budget clamping prevents invalid `budget_tokens >= max_tokens` requests while retaining explicit user
  intent as closely as possible.
- Omitting disabled thinking for incompatible models is safer than serializing a syntactically valid but
  rejected body.

**Key insight:** “Thinking off” can mean either an explicit `{type: disabled}` or omission, depending on
the target model and provider. The serializer—not the UI toggle—owns that distinction.

### Mechanically disabled effort clamp

**What it does:** Prevents high effort from producing a 400 response when thinking was disabled by a
mechanical compatibility path rather than a user's ordinary adaptive choice.

**How it works:**
1. Output effort is assembled separately from the thinking object.
2. The clamp activates only when the incoming config is disabled, it carries `mechanical: true`, the
   serialized thinking object is explicitly disabled, and effort is a string
   (`cli_inner_pretty.js:529696-529711`).
3. `uEu` recognizes effort values that the API rejects in this state.
4. The value is reduced to `Ebo`, the safe supported ceiling, and a diagnostic records why.
5. User-driven and omitted-thinking paths do not enter this branch.

This narrow condition aligns with the 2.1.221 WebSearch fix at `xhigh`/`max` while thinking is disabled:
the request becomes valid without globally downgrading effort.

**Why this approach:**
- Clamping every disabled-thinking request would silently override valid user/model combinations.
- Restricting the repair to mechanically disabled mode ties the downgrade to the compatibility code
  that created the invalid pairing.
- A retry-after-400 alternative would waste latency and tokens and could duplicate side effects.

**Key insight:** Thinking and effort are serialized independently but constrained jointly by the API;
the compatibility branch is where their cross-product must be normalized.

## Fast-mode eligibility and state

### Fast-mode eligibility decision

**What it does:** Determines whether fast mode is exposed and whether a session/model switch can keep
it enabled.

**How it works:**
1. `isFastModeCompiledIn` (`wc`, `cli_inner_pretty.js:107490-107495`) requires direct first-party mode
   and no disabling environment variable.
2. `getFastModeUnavailableReason` (`LV`, `107517-107546`) checks a server kill switch, model support,
   SDK opt-in, organization-status loading, organization policy, usage credits, and network exceptions.
3. `isFastModeModel` (`nw`, `107582-107588`) prefers the catalogue `fast_mode` capability and retains
   explicit Opus 4.8/5 compatibility checks.
4. `resolveFastModeForModel` (`T3`, `107590-107598`) disables fast mode on unsupported models and can
   restore it when returning to a supported model under persisted/session opt-in rules.
5. In 2.1.227 Opus 4.7 fails both paths: its catalogue capability is removed and the compatibility
   substring fallback names only 4.8 and 5.

**Why this approach:**
- Availability is the intersection of build/provider capability, model support, organization policy,
  and billing state; no single flag is sufficient.
- The compatibility substring keeps custom aliases to known supported generations working, but limits
  the fallback to a deliberately small set.
- Fail-closed organization status prevents an unresolved policy fetch from temporarily enabling a paid
  mode.

**Key insight:** Model switching does not merely toggle a UI badge. It recomputes eligibility and emits
whether fast mode was restored or downgraded.

### Runtime cooldown state machine

**What it does:** Temporarily falls back from fast mode during capacity/rate conditions without erasing
the user's durable preference.

**How it works:**
1. `FastModeState` (`puu`, `cli_inner_pretty.js:107606-107661`) holds runtime status, organization
   status, notification latch, prefetch window, and four event channels.
2. `enterFastModeCooldown` (`fuu`, `107673-107680`) records a reset timestamp/reason and emits metrics
   and a cooldown event.
3. `getFastModeRuntimeState` (`lyo`, `107662-107672`) lazily observes expiry, logs it once, emits an
   expiry event, and returns to active.
4. A model/config switch may clear cooldown explicitly without clearing organization policy.
5. Organization-disabled states update persistent settings only for durable/non-transient rejection
   categories.

**Why this approach:**
- Lazy expiry avoids a background timer and naturally evaluates state at the moment it is needed.
- Runtime cooldown and persistent preference are separate so temporary capacity pressure does not
  surprise users by permanently disabling their choice.
- The trade-off is that expiry notification occurs on the next observation rather than exactly at the
  reset timestamp.

**Key insight:** Fast mode has two independent axes: “the user wants it” and “the runtime can use it
now.” Cooldown modifies only the second.

## Mid-stream credit exhaustion

### Once-per-turn overage notification

**What it does:** Tells attached/streaming clients when usage credits run out during a fast-mode turn,
without spamming duplicate rejection frames.

**How it works:**
1. `handleFastModeOverageRejection` (`huu`, `cli_inner_pretty.js:107723-107746`) translates the server
   reason into a specific user message.
2. Limit-like reasons—`out_of_credits`, spend cap, or disabled-until—remain transient rather than
   deleting the user's stored fast-mode preference.
3. The state object's `claimCreditsExhaustedNotice` atomically claims a per-turn latch.
4. The first rejection injects an immediate error-colored system notification with the stable key
   `fast-mode-overage-rejected`.
5. Repeated rejection frames in the same turn are logged and suppressed.
6. `resetFastModeCreditNotice` (`cyo`, `107720-107721`) rearms the latch at the next turn boundary.
7. Non-limit provisioning/policy reasons clear persisted fast mode, update org status, and emit the
   organization-change event because retrying cannot solve them.

The 2.1.220 handler (`NIc`, `2.1.220:109549-109560`) only updated durable state for non-limit reasons and
emitted an internal event. It had no per-turn latch and no direct stream notification, explaining the
reported silent failure.

**Why this approach:**
- A stream notification reaches CLI, Remote Control, and SDK consumers through the existing message
  channel rather than relying on a local toast.
- Per-turn deduplication is necessary because transport/retry layers may report the same terminal billing
  condition more than once.
- Preserving preference for a spend cap allows automatic reuse after reset; clearing it for missing
  provisioning avoids repeated impossible attempts.

**Key insight:** The fix is not “show an error.” It classifies transient versus durable billing denial,
then makes the transient denial observable exactly once on the conversation stream.

## Speed-sensitive pricing

### Fast-mode cost record substitution

**What it does:** Computes local session cost with the fast service-tier price rather than base model
price.

**How it works:**
1. `resolveModelCosts` (`Mps`, `cli_inner_pretty.js:107947-107959`) canonicalizes the model.
2. If API usage reports `speed: "fast"`, Opus 4.8/5 select the `$10/$50` record (`uyo`,
   `108032-108039`); legacy Opus 4.6/4.7 fast traffic selects `$30/$150` (`_uu`, `108024-108031`).
3. Ordinary traffic uses the catalogue-derived cost map.
4. Server-provided additional custom-model costs are consulted next.
5. An unknown model emits telemetry and falls back to the resolved default model's cost, then the
   baseline Opus price if necessary.
6. `computeUsageCost` (`Pps`, `107938-107945`) prices input, output, cache read/write, and web search
   from the selected record.

**Why this approach:**
- Substituting the full record handles input, output, and both cache dimensions consistently.
- Keying on server-reported speed prices what actually ran, not what the UI hoped would run.
- Duplicating special fast price records outside the catalogue is less elegant, but keeps service-tier
  pricing distinct from the model's base economics.

**Key insight:** The effort cost index is a relative estimate; fast-mode price substitution is actual
local cost accounting. They solve different problems and must not be multiplied together.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `resolveInteractiveThinkingConfig` (`gEu`) - live thinking-state reconciliation.
- `isFastModeModel` (`nw`) - capability plus compatibility eligibility.
- `FastModeState` (`puu`) - cooldown, organization, and notice state.
- `handleFastModeOverageRejection` (`huu`) - billing-denial classification and notification.
- `resolveModelCosts` (`Mps`) - speed-sensitive price selection.
- `getEffortCostRatio` (`dTi`) - UI effort comparison.
