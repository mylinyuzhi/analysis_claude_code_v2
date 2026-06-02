# 43 — Opus 4.8 + Effort Levels (v2.1.154 / v2.1.156)

## TL;DR

v2.1.154 launches **`claude-opus-4-8`** as the new default Opus, and v2.1.156 ships the
hotfix that keeps it stable. This module documents the full surface area of that launch:

- **A brand-new model with no 2.1.88 precursor.** The 2.1.88 registry ceilings at `opus46`
  with a four-key config shape; 2.1.156 registers `opus48` across **all seven provider
  surfaces** (firstParty, bedrock, vertex, foundry, anthropicAws, mantle, gateway) via the
  `OPUS_48_MODEL_CONFIG` (`Xi$`) object, and grows the config shape with `anthropicAws` /
  `mantle` / `gateway` / `eagerInputStreaming` (cli_inner_pretty.js:91825-91833).
- **A conservative, staged default.** `getDefaultOpusModel` (`TT`) defaults to 4.8 only on
  raw first-party, 4.7 on the anthropicAws/gateway launch tier, and 4.6 on true third-party
  marketplaces — the *id* is universal, the *defaulting* is phased (cli_inner_pretty.js:98720-98725).
- **The effort system matured to five levels.** The persisted enum gained `xhigh`
  (`["low","medium","high","xhigh"]`, cli_inner_pretty.js:51690); a session-only `ultracode`
  bundle (`xhigh` + standing dynamic-workflow orchestration) was added; per-model defaults
  converged on `high` for 4.8 (`xhigh` for 4.7) via `getDefaultEffortForModel` (`q48`); and a
  **dual launch latch** (`AkH`/`SI`) pins the launch default until the user expresses a choice.
- **The 400-error fix.** The `effort` request param is now injected only when
  `modelSupportsEffort` (`A2`) is true (`...(A2(L) && { effort: { level: Ev(L, w) } })`,
  cli_inner_pretty.js:568321), so effort-incapable models never receive an `effort` field.
- **Fast mode is 2x, not 6x.** Opus 4.8 fast pricing (`OPUS_48_FAST_COST` `bx1`, 10/50) is
  *exactly* 2x standard (5/25), a 3x reduction from the legacy 6x tariff (`OPUS_LEGACY_FAST_COST`
  `Cx1`, 30/150); the deprecated `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` (removal 06/01 per
  changelog — the bundle still wires `ki` actively, 9 call sites, with no in-code deprecation
  warning) is replaced by the explicit `/model claude-opus-4-6[1m]` + `/fast on` flow.
- **The `/effort` slider was reframed** from *Speed / Intelligence* to **Faster / Smarter**,
  with capability tags (`xhigh` = "Opus 4.8/4.7 only", `max` = "Opus 4.6+, Sonnet 4.6") and an
  optional violet `ultracode` rail.
- **The 2.1.156 hotfix** adds `isThinkingSignatureError` (`B87`), a reactive 400-matcher that
  drives a strip-and-retry via `stripSignedThinkingBlocks` (`cG4`) — Opus 4.8's default-on
  thinking otherwise wedged sessions when a replayed signed thinking block failed verification.

**What's NEW vs evolved:** Opus 4.8 itself, `xhigh`, `ultracode`, the launch latch, the 2x
fast pricing, the override trio, the Faster/Smarter relabel, and the `B87` signature matcher
are all **NEW post-2.1.88**. The effort capability gates, the env override, the fast-mode
availability cascade, and the thinking-strip primitives are **direct descendants** of 2.1.88
code (high confidence via near-identical structure).

---

## Architecture / Overview

Registering a new Opus touches a fixed set of sites, and 4.8 hits every one. The single
architectural chokepoint is `resolveModelCanonicalId` (`O7`) → `normalizeModelIdToCanonical`
(`HD`): **every** downstream decision (label, cost, effort, output cap, membership) first
funnels the raw provider id through canonicalization, so each per-site `switch`/`if` ladder
only ever needs one new `claude-opus-4-8` case. That is the structural reason a model launch
is near-mechanical: one matcher entry makes 4.8 recognizable everywhere.

```
  raw model id (any provider dialect, may carry [1m])
        │
        ▼
  resolveModelCanonicalId (O7) ──► normalizeModelIdToCanonical (HD)
        │  (override-aware + Bedrock application-inference-profile ARN aware)
        ▼
  canonical "claude-opus-4-8"
        │
   ┌────┼─────────────┬──────────────┬───────────────┬────────────────┐
   ▼    ▼             ▼              ▼               ▼                ▼
 labels  default    membership    output cap      effort           cost / fast
 $w/ZOH  selector   C0H / Wj      LMH             A2/ow$/ycH/q48    mx1/S0H/bx1
 Q76/Zj  TT/NN                    (64K/128K)      → or (resolver)   (2x fast)
                                                       │
                                                  launch latch
                                                  AkH / SI
                                                       │
                                       ...(A2(model) && { effort:{level} })  ← 400 fix
                                                       │
                                                  request body
        ┌──────────────────────────────────────────────┘
        ▼
  thinking-signature defense (Opus 4.8 default-on thinking)
   proactive: stripCrossModelThinkingBlocks (dG4) at request build
   reactive : isThinkingSignatureError (B87) ──► stripSignedThinkingBlocks (cG4) ──► retry
```

Three independent axes ride on the same canonical id but resolve separately:

1. **Context tier** — the `[1m]` suffix (1M input), gated by `is1MContextAvailable` (`VP`):
   first-party only, non-Pro. Kept *out* of the canonical id but *in* the session id so one
   model has two context tiers without doubling the registry.
2. **Output cap** — `getMaxOutputTokens` (`LMH`): 64K default / 128K upper-limit for 4.8.
3. **Effort** — `resolveAppliedEffort` (`or`): merges env / launch-default / app-state /
   model-default and silently clamps `max`/`xhigh` down to `high` on incapable models.

---

## Module Structure

| Document | Purpose |
|----------|---------|
| [opus48_model_mapping.md](./opus48_model_mapping.md) | The launch backbone: the `Xi$` seven-provider config vs `Ji$` and the 2.1.88 four-key baseline, `j3` registry wiring + derived id maps, the Vertex region table, `HD`/`O7` canonical resolution (incl. ARN + `[1m]` handling), the `$w`/`ZOH`/`Q76` label families, `C0H`/`Wj` membership, the `VP` 1M-context gate, `LMH` output caps, and the staged `TT` default-Opus split (4.8 firstParty / 4.7 launch-tier / 4.6 3P). Ends with the 10-site onboarding checklist. |
| [effort_levels_and_defaults.md](./effort_levels_and_defaults.md) | The effort system end-to-end: the `xhigh` enum + `ultracode` session bundle, `q48` per-model defaults, the `A2`/`ow$`/`ycH` capability gates, the `or` resolver with its dual launch latch (`AkH`/`SI`) and silent max/xhigh→high downgrades, the env override `zkH` tri-state, and the `A2`-gated effort injection that fixes the 400 errors. Cross-validated line-by-line against 2.1.88 `src/utils/effort.ts`. |
| [opus48_fast_mode_pricing.md](./opus48_fast_mode_pricing.md) | Fast mode: the dual-tier pricing (`bx1` 2x for 4.8 vs `Cx1` 6x legacy) selected by `S0H`/`mx1`, the 3-layer availability cascade (`I9`/`Ne`/`jZ`/`m76`/`Wj`), the `/fast` slash command (`speed:"fast"` body + `fast-mode-2026-02-01` beta + auto model-switch), the deprecated `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` (removal 06/01) and its `/model`+`/fast` replacement, the env-prompt fast-mode sentence, and the companion thinking-strip hotfix. |
| [effort_slider_relabel_ui.md](./effort_slider_relabel_ui.md) | The `/effort` picker UI: the Faster/Smarter end-label relabel (with the `UltraRippleText` ripple path and plain-fragment fallback), the 5-position slider geometry plus optional `ultracode` rail (`mr4`), the xhigh/max capability tags, the "burns fastest" hint, model-menu effort integration (`mH`), and the workflows-gated `ultracode` mode (`Vx`). |
| [thinking_signature_hotfix.md](./thinking_signature_hotfix.md) | The 2.1.156 hotfix in depth: `B87` (signature-error matcher) drives strip-and-retry via `cG4`, shown alongside its three sibling 400-matchers (`m87`/`xP6`/`p87`), the proactive cross-model strip (`dG4`/`HF6`), the trailing-thinking filter (`pQ_`), and the success-path signature-assembly flow. Explains why signed thinking blocks must be byte-exact and why strip-and-retry (gated on reference identity) is the safe, loop-free recovery. |

---

## Related Symbols

> Symbol mappings live ONLY in the central index files (never as a table in a module doc):
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Model Selection (config, registry, canonical resolution, labels, 1M-context, output caps, cost/fast mode)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Effort / Thinking (capability gates, resolver, launch latch, ultracode, `/effort` UI)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — UI Components (the slider render path)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — LLM API / request path (effort/speed injection, the 400-matcher cascade)
> - [symbol_additions_v2_1_156_model_opus48.md](../00_overview/symbol_additions_v2_1_156_model_opus48.md) — every new/touched symbol from this unit (96 rows)

Key entry-point symbols (list format — see the additions file for the full table):
- `OPUS_48_MODEL_CONFIG` (`Xi$`) — seven-provider id map for `claude-opus-4-8` (cli_inner_pretty.js:91825-91833)
- `MODEL_CONFIG_REGISTRY` (`j3`) — short-key → config, with `opus48: Xi$` (cli_inner_pretty.js:91835-91849)
- `normalizeModelIdToCanonical` (`HD`) / `resolveModelCanonicalId` (`O7`) — the shared canonicalization chokepoint (cli_inner_pretty.js:98751-98778)
- `getDefaultOpusModel` (`TT`) — staged 4.8/4.7/4.6 default split (cli_inner_pretty.js:98720-98725)
- `getDefaultEffortForModel` (`q48`) — Opus 4.8 → `high`, 4.7 → `xhigh` (cli_inner_pretty.js:184987-184991)
- `modelSupportsEffort` (`A2`) — the gate that prevents 400s (cli_inner_pretty.js:184798-184814)
- `resolveAppliedEffort` (`or`) — final effort with launch latch + clamps (cli_inner_pretty.js:184909-184919)
- `selectFastModePricing` (`S0H`) / `OPUS_48_FAST_COST` (`bx1`) — 2x fast pricing (cli_inner_pretty.js:98451-98457, 98540-98546)
- `isThinkingSignatureError` (`B87`) / `stripSignedThinkingBlocks` (`cG4`) — the 2.1.156 hotfix (cli_inner_pretty.js:186575-186583, 446238-446252)

---

## Cross-References

- **42_workflow** — `ultracode` is fundamentally a *workflow* feature surfaced through the
  effort UI: `ultracodeAvailable` (`Vx`) requires `workflowsEnabled` (`NZ`). The standing
  dynamic-workflow orchestration that `ultracode` enables is documented in the workflow module.
- **44_lean_prompt** — the lean system prompt is default for all models *except* Haiku,
  Sonnet, and Opus 4.7-and-earlier; it shares the Opus membership predicates documented here.
- **19_think_level (v2.1.142 reference)** — the effort plumbing (status line / hooks /
  `$CLAUDE_EFFORT` / Bedrock ARN resolution) and the 5-position slider precede this module;
  2.1.156 adds `xhigh`/`ultracode` on top of that baseline.
- **by_version v2.1.117 (Opus 4.7 1M precedent)** — the prior model launch (default effort
  bumped to `high`, 1M-context tier) is the direct precedent for the 4.8 launch pattern.

---

## Reading Order

1. [opus48_model_mapping.md](./opus48_model_mapping.md) — start here: the model registration
   and the canonicalization chokepoint that everything else depends on.
2. [effort_levels_and_defaults.md](./effort_levels_and_defaults.md) — the effort resolver,
   the launch latch, and the 400-error fix (the behavioral core of the launch).
3. [opus48_fast_mode_pricing.md](./opus48_fast_mode_pricing.md) — the cost/fast-mode layer
   and the override deprecation.
4. [effort_slider_relabel_ui.md](./effort_slider_relabel_ui.md) — the `/effort` picker UI
   that surfaces the resolver to the user (read after understanding the resolver).
5. [thinking_signature_hotfix.md](./thinking_signature_hotfix.md) — the 2.1.156 hotfix that
   makes Opus 4.8's default-on thinking robust (the reason 2.1.156 exists).
