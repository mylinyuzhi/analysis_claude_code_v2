# Lean System Prompt Module (44_lean_prompt) — v2.1.156

## TL;DR

v2.1.154 introduced a **second, parallel system prompt** — the *lean* prompt — and made it the
default for capable models. Changelog line 12: *"The lean system prompt is now the default for all
models except Haiku, Sonnet, and Opus 4.7 and earlier."*

Concretely: Claude Code's system-prompt assembler `buildSystemPromptSections` (`N0`,
cli_inner_pretty.js:555614-555658) now ends in a two-element switch driven by a single memoized
predicate `isLeanSystemPrompt` (`X3`, cli_inner_pretty.js:143864, 143872-143877). When the gate is
**true** the entire behavioral body collapses from **six multi-paragraph sections** (intro+cyber-risk,
`# System`, `# Doing tasks`, `# Executing actions with care`, `# Using your tools`, `# Tone and style`)
down to **one ~6-bullet `# Harness` section** (`oXz`, cli_inner_pretty.js:555591-555607). The same gate
also flips ~16 other sub-sections and tool descriptions to terser variants (anti-verbosity, action-caution,
focus-mode text, investigate-first, the Todo/WebFetch tool descriptions, the auto-mode classifier, agent
listing).

The gate is *not* "is this a weak model" — it is "should we trust this model to behave well from terse
guidance." Opus 4.8 and unknown first-party (frontier) models are trusted ⇒ lean to save tokens/context;
Haiku, Sonnet, Opus ≤4.7, and unknown third-party-hosted ids keep the full instruction set.

**This is NEW post-2.1.88.** Only the far more aggressive `CLAUDE_CODE_SIMPLE` "near-empty" path
(`cKq`, cli_inner_pretty.js:555588-555590) has a v2.1.88 precursor (`src/constants/prompts.ts:450-454`).
The `X3`/`c45`/`d45` per-model lean/full branch, the `-eap` bypass, and the
`CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT` env override are all net-new in the v2.1.154 window. Confidence: **HIGH**.

## What "Lean" Is (and Is Not)

There are **three** prompt modes, checked in sequence inside the one shared assembler `N0`:

| Mode | Trigger | Body | Selected by |
|------|---------|------|-------------|
| **Simple** | `CLAUDE_CODE_SIMPLE` env only | Near-empty: just `CWD` + `Date` (or `[]` when dynamic sections excluded) | `cKq()` short-circuit at the very top of `N0` (cli_inner_pretty.js:555615-555621) |
| **Lean** | model gate + env/server/growthbook overrides | One `# Harness` section (6 bullets) + all dynamic sections, with several sub-sections trimmed | `X3` inside `N0` (cli_inner_pretty.js:555622, 555650-555653) |
| **Full** | default for haiku/sonnet/opus≤4.7 + unknown 3p ids | Six behavioral sections + all dynamic sections | `X3` ⇒ false |

(This compares the three prompt modes and their triggers — it is **not** a symbol-mapping table.)

**Lean trims wording; Simple removes the prompt.** They sit on different, orthogonal axes — Simple wins if
set (it returns before `X3` is even consulted), then lean/full is decided by the model gate.

## Architecture

```
              systemPromptBasePrefix (Q88)            ← always "You are Claude Code…", unaffected by X3
                        +
              buildSystemPromptSections (N0)          cli_inner_pretty.js:555614
                        │
        cKq()? ─────────┤ yes → ["CWD:…\nDate:…"]     (CLAUDE_CODE_SIMPLE — orthogonal, predates lean)
                no      │
                        ▼
                 _ = X3(model)                         cli_inner_pretty.js:555622  [memoized by model id]
                        │
   ┌────────────────────┴─────────────────────┐
   │ _ === true (LEAN)            _ === false (FULL)
   ▼                                           ▼
 [ oXz(outputStyle) ]            [ QXz, gXz, dXz?, cXz, lXz, rXz ]
   "# Harness" 6 bullets            6 multi-paragraph sections
   (555591-555607)                  (555442-555587)
   │                                           │
   └──────────────┬────────────────────────────┘
                  ▼
   + dynamic sections D (memory, env, language, output-style, focus-mode, …)   555629-555649
     (several ALSO leaned via X3 internally: uXz, mXz, fLz→YLz/ALz, rKq→OLz)
                  ▼
          .filter(x => x !== null)   555657


  THE GATE — X3(model) = isLeanSystemPrompt   cli_inner_pretty.js:143872-143877
  ────────────────────────────────────────────────────────────────────────────
    if !model                            → FULL                              (143873)
    if env SIMPLE_SYSTEM_PROMPT == true  → LEAN   (xH parseBoolTrue)         (143874)
    if env SIMPLE_SYSTEM_PROMPT == false → FULL   (k4 parseBoolFalse)        (143875)
    return !c45(model) || d45(model)                                         (143876)
              │              \
              │               \__ d45 (force-lean, additive-only): clientDataCache.simple_system_prompt
              │                   OR tengu_velvet_cascade growthbook         (143839-143845)
              ▼
     c45(model) = isFullPromptModel       cli_inner_pretty.js:143847-143862
       gM6(model)? -eap suffix      → false (⇒ lean)                          (143848 / 143836)
       O7(model) → canonical id     (normalizeModelId)                        (143849 / 98770)
         claude-3-*/haiku/sonnet/opus-4-0..4-7 → true (⇒ FULL)               (143851-143858)
         opus-4-8                            → false (⇒ lean)                 (143861)
         else                                → !UA()  (1P/AWS/gateway lean; bedrock/vertex/foundry/mantle full)  (143862)
```

The decision is centralized in `X3` and consumed at **21** call sites (grep count) so the lean/full
choice stays internally consistent across the top-level body swap *and* every sub-section and
tool-description variant. The predicate is memoized (lodash `memoize` via `v8`/`cx8`) because a single
prompt build calls it 16+ times per turn and each call otherwise runs string normalization + regex +
clientData/growthbook lookups.

## The Rollout Stack (precedence, highest → lowest)

```
1. CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT env  (true ⇒ lean, false ⇒ full)  — operator override, beats everything
2. clientDataCache.simple_system_prompt  per-model map               — server push, forces lean (cannot force full)
3. tengu_velvet_cascade growthbook        { models: [...] }           — staged rollout, forces lean (cannot force full)
4. c45 capability gate                    (the static baseline)       — default when no override fires
```

Because `X3 = !c45 || d45`, the two server surfaces (2, 3) can only *add* models to the lean set, never
remove them — making the rollout monotone and safely reversible from the server without a client deploy.
The env var sits above both so an operator always has the final say.

## Module Structure

| Document | Purpose |
|----------|---------|
| `README.md` | This file — module index, architecture, rollout stack, reading order. |
| [lean_prompt_eligibility_gate.md](./lean_prompt_eligibility_gate.md) | Deep-dive on the model gate itself: the memoized `X3` = `!c45(model) || d45(model)`, its `-eap` bypass (`gM6`), the `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT` env override, the provider classifier (`UA`/`Zq`) and its contrast with `oR`, model-id normalization (`O7`/`HD`/`Gi$`), the `d45` clientData + `tengu_velvet_cascade` force-lean channels, the `N0` assembler swap, the changelog ↔ code mapping, the truth table, and the distinct Fast-Mode opus test `Wj` (NOT the lean gate). |
| [lean_vs_full_prompt_diff.md](./lean_vs_full_prompt_diff.md) | Section-by-section body diff: the single 6-bullet `# Harness` section (`oXz`) vs the six full sections (`QXz`/`gXz`/`dXz`/`cXz`/`lXz`/`rXz`), the bullet-for-paragraph mapping (lean ⊂ full, semantically curated), the four within-section lean variants (`uXz`/`mXz`/`fLz`→`YLz`/`ALz`/`rKq`→`OLz`), the Todo tool-description trim (`z44`→`Y0_`/`f0_`), and cross-validation that the full sections trace to v2.1.88 while the lean branch is new in 2.1.154. |
| [lean_prompt_rationale_and_rollout.md](./lean_prompt_rationale_and_rollout.md) | The *why* layer: token economy (six full sections collapse to one ~6-bullet section; the section cache makes compute-once but NOT token-cheaper, so shrinking text is the only lasting per-turn win), the capability-gate rationale (full scaffolding for haiku/sonnet/opus≤4.7, lean for opus-4-8 + unknown first-party, conservative full for unknown third-party via `!UA()`), the three-surface override stack that dark-launches lean server-side, the contrast with the radically-simple `cKq` path, and the HIGH-confidence grep trail proving the gate is net-new post-2.1.88. |

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_156_lean_prompt.md](../00_overview/symbol_additions_v2_1_156_lean_prompt.md) — All v2.1.156 symbols introduced/touched by this module (the comprehensive table for the lean prompt gate, section builders, and helpers)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (Model selection, Prompt building) — destination for the gate/provider/normalization rows when merged
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (System Prompts, Tools) — destination for the assembler/section-builder/tool-description rows when merged

Key functions in this module (list format — see the additions file for the full table):

- `isLeanSystemPrompt` (`X3`) — memoized top-level gate; `true` ⇒ lean prompt (cli_inner_pretty.js:143864, 143872-143877). See [lean_prompt_eligibility_gate.md](./lean_prompt_eligibility_gate.md).
- `isFullPromptModel` (`c45`) — static allow-list; `true` ⇒ keep FULL prompt (cli_inner_pretty.js:143847-143862).
- `isForcedLeanModel` (`d45`) — server/growthbook force-lean override (cli_inner_pretty.js:143839-143845).
- `isEarlyAccessModel` (`gM6`) — `-eap` suffix bypass forcing lean-eligibility (cli_inner_pretty.js:143836-143838).
- `isFirstPartyProvider` (`UA`) — provider-class gate behind `c45`'s unknown-id fall-through (cli_inner_pretty.js:91891-91893).
- `normalizeModelId` (`O7`) — canonical model id resolver (cli_inner_pretty.js:98770-98778).
- `buildSystemPromptSections` (`N0`) — the assembler; terminal switch picks lean vs full body (cli_inner_pretty.js:555614-555658). See [lean_vs_full_prompt_diff.md](./lean_vs_full_prompt_diff.md).
- `leanHarnessSection` (`oXz`) — the single lean body section (`# Harness`, 6 bullets) (cli_inner_pretty.js:555591-555607).
- `isSimplePromptMode` (`cKq`) — `CLAUDE_CODE_SIMPLE` hard short-circuit ("radically simple" path) (cli_inner_pretty.js:555588-555590).
- `isOpus46OrNewer` (`Wj`) — Fast-Mode opus membership test; **distinct** from the lean gate (cli_inner_pretty.js:98257-98263).

## Reading Order

1. **README.md** (this file) — the surface: three prompt modes, the gate, the rollout stack.
2. [lean_prompt_eligibility_gate.md](./lean_prompt_eligibility_gate.md) — *who* gets lean. Read the
   predicate (`X3`/`c45`/`d45`), normalization, memoization, and the model→lean/full truth table.
3. [lean_vs_full_prompt_diff.md](./lean_vs_full_prompt_diff.md) — *what* changes. The body diff:
   what lean keeps, what it drops, and the within-section variants.
4. [lean_prompt_rationale_and_rollout.md](./lean_prompt_rationale_and_rollout.md) — *why* it exists
   and *how* it ships: token economy, the capability bet, and the dark-launch ladder.

Related modules:
- [../43_model_opus48/](../43_model_opus48/) — Opus 4.8 model id map and effort defaults (the model that triggers lean by default).
