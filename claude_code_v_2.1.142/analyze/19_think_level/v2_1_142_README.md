# 19 — Think Level: Effort + Thinking (v2.1.113 → v2.1.142)

## TL;DR

Between v2.1.113 (the `xhigh`-launch baseline analyzed in 2.1.112) and
v2.1.142, effort/thinking grew several plumbing-level features that
expose the resolved effort value to *everything outside the model
call*:

- The **status line** JSON now includes `effort.level` and
  `thinking.enabled`, so `statusLine.command` scripts can render the
  active reasoning budget (v2.1.119).
- **Hooks** receive `effort.level` in their JSON input, and the hook
  command itself plus any Bash tool invocations get
  `$CLAUDE_EFFORT` in their environment (v2.1.133). This makes effort
  level a first-class signal for permission policies and audit hooks.
- The `/effort` picker and `/model` Effort sub-picker now honor a
  **`CLAUDE_CODE_EFFORT_LEVEL`** environment override, the slider
  reflects the override-induced clamp, and confirmation messages
  surface why a saved value won't actually apply (v2.1.132).
- **Default effort for Pro/Max** Anthropic-account users on Opus 4.6 /
  Sonnet 4.6 jumped from `medium` to `high`, aligning subscriber
  defaults with API-tier defaults (v2.1.117).
- **Bedrock application-inference-profile ARNs** are resolved to their
  *backing model* via `GetInferenceProfileCommand`, so the client now
  shows the **Effort** option for them in `/model` and sends
  `output_config.effort` correctly (v2.1.122).
- The **stream watchdog** that fires `"Stream idle timeout"` after a
  long quiet gap now suppresses-and-rearms instead of firing when it
  detects a clock jump (laptop sleep / Mac wake), eliminating the
  spurious "5 minutes after response completed" timeout (v2.1.139).

There are no new effort *levels* in this window — `low`/`medium`/`high`/
`xhigh`/`max` are unchanged. The work is all about routing the
resolved value to the right consumers (status line, hooks, Bash env,
remote control, telemetry) and fixing edge cases (Bedrock ARNs, env
override, sleep/wake watchdog).

---

## Major Changes v2.1.113 → v2.1.142

| Version | Kind | Change | Doc |
|---------|------|--------|-----|
| 2.1.113 | feat | `/effort auto` says "Effort level set to max" (matches status bar) | (baseline; resolver text aligned) |
| 2.1.117 | feat | Default effort for Pro/Max accounts on Opus/Sonnet 4.6 is now `high` (was `medium`) | [default_effort_pro_max.md](./default_effort_pro_max.md) |
| 2.1.119 | feat | Status line stdin JSON includes `effort.level` and `thinking.enabled` | [status_line_effort_thinking.md](./status_line_effort_thinking.md) |
| 2.1.122 | fix  | `/model` now shows Effort option for Bedrock application-inference-profile ARNs | [bedrock_arn_effort_fix.md](./bedrock_arn_effort_fix.md) |
| 2.1.122 | fix  | Bedrock ARN requests now include `output_config.effort` | [bedrock_arn_effort_fix.md](./bedrock_arn_effort_fix.md) |
| 2.1.132 | fix  | `/effort` picker reflects `CLAUDE_CODE_EFFORT_LEVEL` env override | [effort_picker_env_var.md](./effort_picker_env_var.md) |
| 2.1.133 | feat | Hooks receive `effort.level` JSON field | [effort_level_hook_input.md](./effort_level_hook_input.md) |
| 2.1.133 | feat | Hook commands and Bash tool calls get `$CLAUDE_EFFORT` env var | [claude_effort_env_var.md](./claude_effort_env_var.md) |
| 2.1.139 | fix  | Stream-idle watchdog rearms after clock-jump (laptop sleep/wake) instead of firing spurious timeout | [stream_idle_watchdog_fix.md](./stream_idle_watchdog_fix.md) |

Cross-cutting unchanged invariants from the 2.1.111/2.1.112 work:
- 5 levels, model-aware silent downgrade (`xhigh→high`, `max→high`).
- `unpinOpus47LaunchEffort` latch on first user effort action.
- Per-model defaults: Opus 4.7 → `xhigh`; others → `high` or `medium` by tier.

---

## End-to-End Effort Plumbing (v2.1.142)

```
User input          /effort, slider, --effort CLI arg,
                    CLAUDE_CODE_EFFORT_LEVEL env, /model picker
                          │
                          ▼
                ┌────────────────────────────────┐
                │  resolveAppliedEffort           │  (Z3H in cli_inner_pretty.js:198874)
                │   1. env override (IUH)         │
                │   2. opus47Default (He$ + $e$)  │
                │   3. AppState.effortValue       │
                │   4. per-model default ($e$)    │
                │   silent downgrade for max/xhigh│
                └──────────┬─────────────────────┘
                           │
   ┌───────────────────────┼──────────────────────────────────────┐
   │                       │                                       │
   ▼                       ▼                                       ▼
API request          Status line JSON                       Hook JSON input
output_config:       `effort: {level}`                      `effort: {level}`
  { effort, ... }    `thinking: {enabled}`                  + spawned process
   (lm5)             (mU5 → :535631-535672)                 env: CLAUDE_EFFORT
                                                            (line 520867-520869)
                                                                  │
                                                                  ▼
                                                         Bash tool spawn
                                                         extraEnv: CLAUDE_EFFORT
                                                         (line 419634-419636)
                                                              │
                                                              ▼
                                                       Slash command body
                                                       `${CLAUDE_EFFORT}` →
                                                       resolveEffortForApi value
                                                       (lines 399003, 406269)
```

Two new behaviors visible in this diagram (relative to 2.1.112):

1. **`CLAUDE_EFFORT` is now an exposed surface.** It's not just a request field. Every Bash command spawned by the tool, every hook process, every `${CLAUDE_EFFORT}` template in slash command bodies sees the same resolved value, after downgrade.

2. **Status line JSON carries `effort.level` and `thinking.enabled`.** This lets `statusLine.command` scripts render the active reasoning budget. The shape is documented as `StatusLineCommandInput` and re-used by `HookInput.effort` for parallel hook scripts.

---

## Bedrock ARN Resolution (v2.1.122)

Before 2.1.122, `application-inference-profile` ARNs were treated as opaque strings:
- `k7(modelArn)` returned the raw ARN.
- `modelSupportsEffort(modelArn)` saw an unknown string → defaulted to
  the Bedrock-region check (`Ch(vj(H))`), which returned `true`, but
  the *exact* substring checks for opus-4-7 / opus-4-6 / sonnet-4-6
  missed.
- The `/model` UI's Effort option uses `modelSupportsEffort` — when the
  capability check missed, the Effort row was hidden.
- The request builder's `lm5` (output_config.effort setter) also gates
  on `modelSupportsEffort` — when it missed for the ARN, `effort` was
  *dropped* from `output_config`.

The fix: `k7` (resolveModelCanonicalId) now detects
`application-inference-profile` in the model string, looks up the
cached backing model via `av8(arn)`, and returns the canonical id of
that backing model. The lookup is populated asynchronously by `abH`
(`loadBedrockInferenceProfileBackingModel`), which the `/model` UI
warms via `useEffect` on focus.

See [bedrock_arn_effort_fix.md](./bedrock_arn_effort_fix.md) for the
full call graph and the `GetInferenceProfileCommand` resolution path.

---

## Stream Watchdog (v2.1.139 fix)

The byte-watchdog in `TV1` (`wrapStreamWithByteWatchdog`,
cli_inner_pretty.js:128281) arms a `setTimeout($idleMs, …)` after the
last byte arrives. Before v2.1.139, when the process was suspended
(macOS sleep, laptop closed, container paused), JavaScript timers
don't fire on time — they fire at the next event-loop tick after wake.
The watchdog would see a long elapsed wall-clock interval and
**incorrectly conclude the stream had gone idle**, firing the
`StreamIdleTimeoutError` 5 minutes after the response had already
completed.

The fix introduces a "late by clock jump" detector:

```javascript
// READABLE (for understanding) — TV1 inner setTimeout, cli_inner_pretty.js:128328-128335
let lateByMs = Math.round(performance.now() - lastChunkAt - idleMs);
if (lateByMs < -idleMs / 2) {
  // Negative-late means timer fired before its deadline → we crossed
  // a clock boundary (sleep). Re-arm and don't fire.
  log(`[byte-watchdog] suppressed: late=${lateByMs}ms (sleep/suspend), re-arming`);
  reArmWatchdog(controller);
  return;
}
```

This same logic also covers the v2.1.126 Mac-wake symptom from the
2.1.142 02_ui changelog ("Stream idle timeout after waking Mac"). See
[stream_idle_watchdog_fix.md](./stream_idle_watchdog_fix.md).

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Module: Thinking / Effort
> - [symbol_additions_v2_1_142_think_ui.md](../00_overview/symbol_additions_v2_1_142_think_ui.md) — new symbols from this unit

Key functions/objects in this module:
- `resolveAppliedEffort` (`Z3H`) — central resolver; cli_inner_pretty.js:198874-198884
- `modelSupportsEffort` (`CP`) — capability gate; cli_inner_pretty.js:198795-198811
- `resolveEffortForApi` (`aT`) — used by `output_config` AND by `CLAUDE_EFFORT` env builders
- `resolveModelCanonicalId` (`k7`) — resolves Bedrock ARN to backing model
- `loadBedrockInferenceProfileBackingModel` (`abH`) — async lookup, caches
- `wrapStreamWithByteWatchdog` (`TV1`) — sleep/wake-safe watchdog
- `StreamIdleTimeoutError` (`$l$`) — carries `idleMs`/`bodyReadPending`/`cfRay`
- `applyOutputConfigEffort` (`lm5`) — sets `output_config.effort`

## Cross-References

- **02_ui** (`v2_1_142_README.md`) — spinner thinking-status hints
  (10s/20s/30s/45s thresholds) consume the same elapsed-time signal
  that drives the byte-watchdog; the spinner's amber-warming threshold
  is also 10s.
- **06_mcp** — MCP tool calls inherit the same `$CLAUDE_EFFORT` env via
  `extraEnv` when the spawned tool is a stdio MCP server.
- **11_hooks** — `effort.level` is part of the hook JSON contract; see
  the hook-input section.

## Reading Order

1. [status_line_effort_thinking.md](./status_line_effort_thinking.md) — exposed shape (the simplest plumbing)
2. [effort_level_hook_input.md](./effort_level_hook_input.md) — hook input schema field
3. [claude_effort_env_var.md](./claude_effort_env_var.md) — env var → Bash tool → `${CLAUDE_EFFORT}` substitution
4. [bedrock_arn_effort_fix.md](./bedrock_arn_effort_fix.md) — ARN → backing model resolution
5. [effort_picker_env_var.md](./effort_picker_env_var.md) — `/effort` UI surfacing env override
6. [default_effort_pro_max.md](./default_effort_pro_max.md) — subscriber default bump
7. [stream_idle_watchdog_fix.md](./stream_idle_watchdog_fix.md) — sleep/wake watchdog rescue
