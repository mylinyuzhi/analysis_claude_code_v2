# 40 — System-Prompt Construction (v2.1.183)

> Module: `40_system_prompt` — the **system-prompt construction machine** of Claude Code
> **v2.1.183**: how the effective system prompt is assembled section-by-section, the identity
> strings, the main-loop intro builders, the `# System` / `# Tone` security-and-tone clauses, the
> environment block, the lean-vs-full split, the cacheable-section registry, and the built-in
> sub-agent / coordinator system prompts.
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`
> (699,346 lines; `VERSION:"2.1.183"`, build_sha `9d251ab`, 2026-06-18). Every
> `cli_inner_pretty.js:<line>` citation is a v2.1.183 line; any `(v2.1.156)` / `(v2.1.88)` tag is a
> deliberate before-picture / convention read in another bundle.
> Obfuscated names were **re-derived** for v2.1.183 — the bundler re-mangles every build, so a
> v2.1.156 obf name is never reused (the lean gate is `Dg` here, was `X3`; the assembler is `KL`).

> **📁 Full readable-source restoration:** this README is the module front door. For a source-level
> reconstruction of the **whole** subsystem at v2.1.183 — the assembler, lean gate, merge layer,
> identity, builders, env block, cacheable-section registry, and the five sub-agent prompts, all
> restored as readable TypeScript organized like the genuine Anthropic source tree (7 files) — see
> [**`reconstructed_source/`**](./reconstructed_source/README.md). Every reconstructed function is
> line-anchored to the 183 bundle and every prompt string is quoted verbatim.

---

## TL;DR — one machine, two layers, mostly carryover; the 2.1.183 deltas are all *content*

The effective system prompt is built by a **two-layer pipeline** whose *shape* is carried over
unchanged from the v2.1.156 baseline. **Layer 1 (sections)** — `buildEffectiveSystemPromptSections`
(obfuscated: `KL`, cli_inner_pretty.js:580888) — emits an ordered `string[]`: a `CLAUDE_CODE_SIMPLE`
short-circuit, then a **lean-vs-full head ternary** keyed on `isLeanSystemPrompt` (`Dg`,
cli_inner_pretty.js:134268), then a cacheable registry of ~25 dynamic sections, then the
`__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__` marker (`hoe`, cli_inner_pretty.js:53897), then the attachments
section. **Layer 2 (merge + identity)** — `mergeSystemPrompt` (`bW`, cli_inner_pretty.js:362647) +
`asSystemPrompt` (`Wc`, cli_inner_pretty.js:360521) — resolves the effective prompt by precedence
(override → coordinator → agent-def → custom → default) and brands the result; the live API path
prepends the identity line (`getIdentityString` / `l_n`, cli_inner_pretty.js:149945) and the uncached
billing header.

The **machine is carryover** — assembler shape, the lean gate, the identity strings, the
dynamic-boundary cache split, the merge precedence, and the sub-agent / coordinator prompts are all
structurally identical to v2.1.156 (each confirmed by reading the live 183 line, with 0-count BEFORE
greps where a string is net-new). What changed at 2.1.183 is **content inside the gated sections**:

1. the **Fable-5 / Mythos identity block** (`FABLE_IDENTITY`, gated by model family);
2. the **Fable-5 model-list env line** in `# Environment` (`getEnvBlockSimple`/`getEnvBlockStatic`);
3. the **team / ownership-frame intro variants** in the lean/full intro builders (armed by
   `isOwnershipFrameEnabled` / `t0o`); and
4. the rewritten **"Communicating with the user"** anti-verbosity section (`l_f`).

All four are **0-count in the v2.1.156 bundle** (anchor dossier §13) — net-new strings, not refactors.

---

## Architecture overview

```
                          buildEffectiveSystemPromptSections  (KL @580888)         ── LAYER 1 (sections)
                          │
   CLAUDE_CODE_SIMPLE? ───┤  yes → ["CWD: …\nDate: …"]  (near-empty; predates lean)   @580889-580895
                          │  no  ↓
   isLeanSystemPrompt(model) (Dg @134268) ── HEAD SWAP ───────────────────────────────┐
                          │                                                            │
        ┌─────────────────┴───────────────────┐                                        │
        │ LEAN head (1 section)               │ FULL head (6 sections)                 │
        │  buildLeanHarnessIntro  (w_f)       │  buildFullIntro            (y_f)        │
        │   intro + cyber-risk + "# Harness"  │  buildSystemSection        (__f)        │
        │                                     │  buildDoingTasksSection    (b_f)?       │
        │                                     │  buildExecutingActions…    (S_f)        │
        │                                     │  buildUsingToolsSection    (E_f)        │
        │                                     │  buildToneAndStyleSection  (T_f)        │
        └─────────────────────────────────────┘                                        │
                          │                                                            │
   + cacheable dynamic-section registry  (Jx descriptors → O8a resolver/memo)  @580905-580930
        anti_verbosity · action_caution · task_continuity · fable_identity(NEW) ·
        tool_param_json · investigate_first · session_guidance · memory ·
        env_info_simple/static(NEW model-list line) · language · output_style ·
        bg-session · scratchpad · context_management · brief · focus_mode ·
        reproduce_verify · act_dont_rederive · heron_brook · autonomy_append
                          │
   + __SYSTEM_PROMPT_DYNAMIC_BOUNDARY__  (hoe @53897)  — only when Xve() (first-party/AWS)  @580936
   + attachments section  (zOl)                                                          @580938
                          │
                          ▼  string[]
   ────────────────────────────────────────────────────────────────────────────────── LAYER 2 (merge)
   mergeSystemPrompt (bW @362647)   precedence: override → coordinator(bvd) → agent-def → custom → default
                          │  + appendSystemPrompt (last)
                          ▼  asSystemPrompt (Wc @360521 — identity brand)
   API path: prepend getIdentityString (l_n @149945)  +  uncached billing header (qun)
                          │
   cache-scope split (a0o @581374):  billing → null(uncached) · identity(a_n) → org · prefix → global · suffix → org
   out-of-band date: date_change attachment (ftl @464855) keeps the cached prefix date-free across midnight
```

The two structural choices worth internalizing: (1) the **head swap** is the only place lean vs full
diverges in body shape — six sections collapse to one; every *other* section is shared, with a `:L`
cache-key suffix selecting a lean/full variant of its text. (2) **"Uncached" is not a per-section
property** in 2.1.183 — the cache-busting responsibility was moved off the section registry (where a
stray `cacheBreak` would poison the whole cached prefix) onto a dedicated uncached billing block and a
transient date attachment.

---

## Reconstructed source files

All under [`reconstructed_source/`](./reconstructed_source/) — clean readable TypeScript organized the
way the v2.1.88 named source tree organizes the prompt machine. Every top-level symbol carries a
`// 2.1.183: <readable> = <obf> @<line>` anchor; every prompt string is quoted verbatim.

| File | Restores | Key symbols (v2.1.183) |
|------|----------|------------------------|
| [`utils/systemPrompt.ts`](./reconstructed_source/utils/systemPrompt.ts) | The Layer-1 **assembler** (`buildEffectiveSystemPromptSections`), the **lean gate** (`isLeanSystemPrompt` + `isFullPromptModel` / `isForcedLeanModel` / `isEarlyAccessModel`), the **merge layer** (`mergeSystemPrompt`), the dynamic-boundary gate, the ownership-frame + investigate-first predicates, and the Fable-5 model-id map. | `KL` :580888, `Dg` :134268, `I8u` :134243, `C8u` :134235, `bW` :362647, `Jx` :429774, `O8a` :429777, `Xve` :134600, `i0o` :581166 |
| [`utils/systemPromptType.ts`](./reconstructed_source/utils/systemPromptType.ts) | The branded `SystemPrompt` type + **`asSystemPrompt`** identity-brand, the three **identity strings**, the **identity selector**, and the org-cached identity set. | `Wc` :360521, `gNr`/`OAi`/`NAi` :149953-955, `l_n` :149945, `a_n` :149958 |
| [`constants/prompts.ts`](./reconstructed_source/constants/prompts.ts) | The **main-loop intro builders** (`getFullIntroSection` / `getLeanHarnessIntroSection`), `prependBullets`, the hooks clause, the **four environment-block builders** (uname / simple / static / excluded incl. the NEW model-list line), `getUnameSR`, the per-model knowledge-cutoff map, the **scratchpad** instructions, the **dynamic boundary** marker, the **default-agent prompt**, and the ownership-frame predicate. | `y_f` :580712, `w_f` :580861, `pV` :580709, `L_f`/`D_f`/`P_f`/`M_f` :580976-581073, `s0o` :581099, `r0o` :581075, `HUn` :581135, `NBa`/`$vp` :581198/384820, `hoe` :53897, `t0o` :581260 |
| [`constants/system.ts`](./reconstructed_source/constants/system.ts) | The **`# System`** security/trust clauses and the **`# Tone and style`** bullets, quoted verbatim — including `CYBER_RISK_INSTRUCTION` and **the `<system-reminder>` convention sentence**. | `Jko` :580615, `__f` :580719, `T_f` :580848 |
| [`constants/systemPromptSections.ts`](./reconstructed_source/constants/systemPromptSections.ts) | The **cacheable-section registry** (`systemPromptSection` factory + `resolveSystemPromptSections` memo + `clearSystemPromptSections`) and readable models of the **two real "uncached" mechanisms**: the cache-scope splitter and the out-of-band `date_change` attachment. | `Jx` :429774, `O8a` :429777, `iLe` :429787, `a0o` :581374, `ftl` :464855, `QOl` :581366 |
| [`prompts/subagents.ts`](./reconstructed_source/prompts/subagents.ts) | The five **sub-agent prompt variants**: Explore + Plan (READ-ONLY specialists), general-purpose default, the two tool-description slices (`_0`/`_4`, documented as NOT agent prompts), and the **coordinator / SDK top-prompt**. | `Gbp` :371916, `zGp` :471975, `$vp` :384820, `Aqa` :423136, `bvd` :221940 |

> The v2.1.183 bundle is a single concatenated file, so several of these modules are co-located there
> (e.g. nearly all the section builders live in the `580615-581268` neighborhood). The split into
> seven files follows the v2.1.88 conventions; each file's header discloses where its content
> physically sits in the bundle.

---

## Key design decisions and algorithms

### The lean-vs-full head swap and the lean gate

**What it does:** A single boolean — `isLeanSystemPrompt(model)` (`Dg`, cli_inner_pretty.js:134268) —
chooses between a **full** six-section behavioral head (full identity-tone, `# System`, `# Doing
tasks`, `# Executing actions with care`, `# Using your tools`, `# Tone and style`) and a **lean**
single-section head (`buildLeanHarnessIntro` / `w_f`: a collapsed intro + a 5-bullet `# Harness`
block). Everything *after* the head is shared between the two modes.

**How it works:**
1. The gate is **memoized** (`wn`, a lodash-style memoize) because one prompt build consults it 16+
   times — once for the head swap, then again for every per-section lean/full variant whose cache key
   carries the `:L` suffix. Each call otherwise re-runs model-id normalization + a regex + clientData /
   growthbook lookups, so memoizing is a real per-build saving.
2. Precedence (highest → lowest), verbatim at cli_inner_pretty.js:134269-134272:
   - **no model** → FULL (a missing model resolves conservatively to the larger prompt);
   - env `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT` **true** → LEAN (operator override);
   - env `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT` **false** → FULL (operator override);
   - else `!isFullPromptModel(model) || isForcedLeanModel(model)` — the static capability gate.
3. `isFullPromptModel` (`I8u`, cli_inner_pretty.js:134243) is a **capability judgement, not a "weak
   model" check**: Haiku/Sonnet and Opus ≤ 4.7 keep the full scaffolding; **Opus 4.8 / Fable 5 / Mythos
   5** (cli_inner_pretty.js:134257) are trusted to run lean. Unknown ids fall through to
   `!isFirstPartyOrGateway()` — first-party/gateway hosts go lean (frontier), other hosts
   (bedrock/vertex/foundry/mantle) stay full conservatively.
4. `isForcedLeanModel` (`C8u`, cli_inner_pretty.js:134235) is an **additive-only override channel**: a
   server-pushed `clientData.simple_system_prompt` map or the `tengu_velvet_cascade` growthbook can
   *add* a model to the lean set, never remove it — because the gate is `!isFullPromptModel ||
   isForcedLeanModel`.

**Why this approach:** Lean is a **token-cost lever** gated on *trust*. Frontier models follow terse
guidance reliably, so the full scaffolding is wasted tokens on every turn for them; weaker/older models
still need the explicit `# System` / `# Tone` contract. Making the override channel additive-only makes
the lean rollout **monotone and reversible from the server**: Anthropic can dial a model into lean via
growthbook without shipping a client, and can never accidentally *strip* full guidance from a model
that statically requires it.

**Key insight:** The head swap is the *only* body-shape divergence between lean and full. The win is
not caching (the lean text still ships every turn) — it is **shrinking the every-turn prefix**, which
is why the lean predicate, not the cache, is the real cost mechanism. The `:L` cache-key suffix exists
so that the lean and full *variants of each shared section* cache separately rather than thrashing.

### "Uncached" without a `cacheBreak` factory — the moved cache-busting responsibility

**What it does:** The v2.1.88 convention exposes two section factories — `systemPromptSection` (cached)
and `DANGEROUS_uncachedSystemPromptSection` (per-turn, cache-breaking). In v2.1.183 **the second factory
does not exist**: `systemPromptSection` (`Jx`, cli_inner_pretty.js:429774) hardcodes `cacheBreak: false`,
and a grep of the whole 699,346-line bundle for `cacheBreak: true` / `cacheBreak: !0` returns **zero
hits**. No section descriptor is ever uncached.

**How it works:** The cache-busting responsibility was moved off the section registry onto two
out-of-band mechanisms:
- **(A) The cache-scope splitter** `a0o` (cli_inner_pretty.js:581374). Every assembled prompt block is
  tagged with a `cacheScope`. The per-request **billing header** (the `x-anthropic-billing-header…`
  block) is *always* pushed with `cacheScope: null` — genuinely uncached, because it carries volatile
  per-request attribution. The identity strings (the `a_n` set) are `cacheScope: "org"`; everything
  before the `__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__` marker is the static prefix; everything after is the
  dynamic suffix.
- **(B) The out-of-band date attachment** `ftl` (cli_inner_pretty.js:464855). The date is deliberately
  **not** embedded in any cached section. The cached body stays date-free; when the calendar day drifts
  past the memoized "today" (`SCe`, cli_inner_pretty.js:220222), `ftl` emits a transient `date_change`
  attachment whose user-invisible reminder (cli_inner_pretty.js:590594) tells the model the new date.

**Why this approach:** A per-section `cacheBreak: true` is a footgun — a single cache-breaking
descriptor would poison the *entire* cached prefix that sits before it, since the prompt cache is
prefix-based. By centralizing "uncached" into one dedicated block (the billing header) and pushing the
one genuinely volatile-but-model-relevant field (the date) into an attachment, the cached prefix stays
byte-stable across the whole session — including across midnight, which a naive
`DANGEROUS_uncached("date", …)` section would have broken every single day.

**Key insight:** When you grep for cache-busting in 2.1.183, do *not* look for a section factory —
there isn't one. The cache boundary is the `hoe` marker; the genuinely uncached block is the billing
header; and the date lives in an attachment, not the prompt body.

### The merge precedence ladder (`mergeSystemPrompt`)

**What it does:** Resolves the *effective* system prompt from up to five candidate sources, then always
appends `appendSystemPrompt` last (except under override).

**How it works** (cli_inner_pretty.js:362647-362665, highest → lowest):
1. `overrideSystemPrompt` → **replaces everything** (e.g. loop mode) — no append. (@362655)
2. **coordinator mode + no main-thread agent def** → the coordinator prompt (`bvd`), then append. (@362656)
3. **main-thread agent def** → its `getSystemPrompt()`. If the agent def *also* sets
   `appendSystemPrompt`, the agent prompt is **appended to** `(custom ?? default)`; otherwise it
   **replaces** it. (@362659-362664)
4. else `customSystemPrompt` (`--system-prompt`) if present, else `defaultSystemPrompt`.

Every return path is wrapped through `asSystemPrompt` (`Wc`), a compile-time-only identity brand
(`function Wc(e){return e}`) that tags a `string[]` as "blessed as a system prompt" at zero runtime
cost.

**Why this approach:** A strict precedence ladder makes the override semantics unambiguous: there is
exactly one winner per build, and `append` is a *modifier* on the winner, not a competitor. The
v2.1.183 difference from v2.1.88 is the **agent-def `appendSystemPrompt` branch** — what used to be a
proactive-mode "# Custom Agent Instructions" append became a general agent-append branch, so any agent
definition (built-in or custom) can choose to *extend* rather than *replace* the base prompt.

### The READ-ONLY contract on the Explore and Plan sub-agents

**What it does:** The Explore (`Gbp`, cli_inner_pretty.js:371916) and Plan (`zGp`,
cli_inner_pretty.js:471975) built-in agents are **structurally read-only**, and their system prompts
*restate the prohibition* in a hard `=== CRITICAL: READ-ONLY MODE ===` block enumerating every banned
operation (Write/Edit/rm/mv/cp/redirects/heredocs/state-changing commands).

**How it works:** Read-only is enforced **twice** — once by the agent def's tool set (Explore's
`disallowedTools` strips the Agent + edit tools; Plan inherits Explore's tools) and once by the prompt
text. The prompts interpolate live tool-name + shell seams (`${bashToolName}`, Glob/Grep-vs-bash) so
the same prompt adapts to a POSIX-bash or PowerShell environment, but the static English around every
seam is fixed. Plan additionally requires its output to end with a `### Critical Files for
Implementation` list.

**Why this approach:** Belt-and-suspenders. The tool-set restriction is the real enforcement (the agent
*cannot* edit), but the prompt restatement steers the model away from even *trying* — which avoids
wasted tool calls that would fail and avoids the model narrating edits it can't make. Explore is also
explicitly modeled as a *fast* haiku agent ("returns output as quickly as possible", parallel
tool-calls encouraged) because its job is breadth-first location, not deep analysis.

---

## Cross-version status — carryover vs new-at-2.1.183

Verified by reading the live 183 line for every claim, with **0-count greps in the v2.1.156 bundle**
for every net-new string (anchor dossier §13).

| Component | Status | v2.1.183 anchor |
|-----------|:------:|-----------------|
| Assembler shape (`KL`: SIMPLE short-circuit → lean/full ternary → cacheable registry → boundary → attachments) | carryover | cli_inner_pretty.js:580888 |
| Lean gate (`isLeanSystemPrompt` + full/forced/eap predicates) | carryover (logic) | cli_inner_pretty.js:134268 |
| Identity strings + selector (`gNr`/`OAi`/`NAi`, `l_n`) | carryover | cli_inner_pretty.js:149945-955 |
| `CYBER_RISK_INSTRUCTION`, `# System` clauses, `<system-reminder>` convention sentence, `# Tone` bullets | carryover | cli_inner_pretty.js:580615, 580719, 580848 |
| Dynamic-boundary marker + cache-scope split + date attachment | carryover | cli_inner_pretty.js:53897, 581374, 464855 |
| Merge precedence (`bW`) + `asSystemPrompt` brand | carryover (agent-append branch generalized) | cli_inner_pretty.js:362647, 360521 |
| Sub-agent prompts (`$vp` general-purpose, `Gbp` Explore, `zGp` Plan) + coordinator (`bvd`) | carryover | cli_inner_pretty.js:384820, 371916, 471975, 221940 |
| **Fable-5 / Mythos identity block** (`FABLE_IDENTITY`, gated on model family) | **NEW at 2.1.183** | registry `fable_identity` @580909 |
| **Fable-5 model-list env line** ("The most recent Claude models are Fable 5…") | **NEW at 2.1.183** | cli_inner_pretty.js:581032 / 581047 |
| **Team / ownership-frame intro variants** ("You work alongside the user… and own the outcome") | **NEW at 2.1.183** | `w_f` @580864-869, predicate `t0o` @581260 |
| **"Communicating with the user" anti-verbosity rewrite** (`l_f`) | **NEW at 2.1.183** | cli_inner_pretty.js:580624-580660 |

The one place the v2.1.88 convention does **not** map 1:1 is the missing
`DANGEROUS_uncachedSystemPromptSection` factory (see the "uncached without a `cacheBreak` factory"
algorithm above) — flagged MEDIUM in the dossier and modeled faithfully via mechanisms (A) and (B).

---

## Reading order

1. **This README** — the machine in one screen: the two layers, the head swap, and where the four
   2.1.183 content deltas live.
2. **[`reconstructed_source/README.md`](./reconstructed_source/README.md)** — the reconstruction index:
   the 3-tier evidence model, the file inventory, and the anchor convention.
3. **`utils/systemPrompt.ts`** — the assembler + the lean gate + the merge layer. This is the spine;
   internalize the `KL` return body (cli_inner_pretty.js:580931-580939) and the `Dg` precedence.
4. **`constants/system.ts` → `constants/prompts.ts`** — the verbatim contract: `# System` /
   `<system-reminder>` / `# Tone` clauses, then the intro builders + the four env blocks.
5. **`constants/systemPromptSections.ts`** — the cacheable registry and the two "uncached" mechanisms
   (the subtle part: why there is no `cacheBreak` factory).
6. **`prompts/subagents.ts`** — the five sub-agent variants + the coordinator top-prompt.

---

## Related modules

- [`41_system_reminder/`](../41_system_reminder/) — the `<system-reminder>` injection machine; the
  `date_change` attachment that keeps the prompt cache stable (mechanism B above) is rendered through
  the reminder renderer (cli_inner_pretty.js:590594), and the 25-string reminder catalogue lives there
  (cross-link, not duplicated here).
- [`04_tools/`](../04_tools/) — the Agent/Task tool whose description (`Aqa`) supplies the `_0`/`_4`
  sub-agent assets, and the built-in agent defs (`uce`/`k5n`/`nye`) that register the Explore/Plan/
  general-purpose `getSystemPrompt` functions reconstructed here.
- [`30_agent_team/`](../30_agent_team/) — coordinator mode (the `bvd` coordinator system prompt) and the
  team/ownership-frame UX that the new intro variants serve.
- [`42_workflow/`](../42_workflow/) — the Workflow tool whose subagent prompts share the
  default-agent-prompt family, and the `Pw()` workflows gate that toggles the coordinator's workflow
  bullet.
- The model module — Fable 5 / Mythos 5 / Opus 4.8 capability tiers drive both the lean gate
  (`isFullPromptModel`) and the new Fable-5 identity / model-list content.

---

## Related Symbols

> Symbol mappings live in the central index and the per-feature additions file (never as tables in
> module docs):
> - [symbol_additions_v2_1_183_system_prompt.md](../00_overview/symbol_additions_v2_1_183_system_prompt.md) — **all 77 re-derived v2.1.183 system-prompt symbols** for this module (the comprehensive tables; add new rows there).
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra; **"## Module: Prompt"** is the home for system-prompt construction (identity, lean gate, assembler, env block, cache-scope split).
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution; the Subagent area (agent defs `uce`/`k5n`/`nye`, Agent/Task description `Aqa`).
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (the coordinator/team, workflow, and effort surfaces that toggle optional prompt sections).
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations (the `/config` and output-style UI that feed the env/output-style sections).

Key functions in this module (re-derived v2.1.183 names):

- `buildEffectiveSystemPromptSections` (`KL`, cli_inner_pretty.js:580888) — Layer-1 section assembler; SIMPLE short-circuit → lean/full head → cacheable registry → boundary → attachments.
- `isLeanSystemPrompt` (`Dg`, cli_inner_pretty.js:134268) — memoized lean gate; drives the head swap and the `:L` per-section cache suffix.
- `isFullPromptModel` (`I8u`, cli_inner_pretty.js:134243) / `isForcedLeanModel` (`C8u`, cli_inner_pretty.js:134235) — the static capability gate + the additive-only server override.
- `mergeSystemPrompt` (`bW`, cli_inner_pretty.js:362647) / `asSystemPrompt` (`Wc`, cli_inner_pretty.js:360521) — Layer-2 precedence resolver + the compile-time SystemPrompt brand.
- `getIdentityString` (`l_n`, cli_inner_pretty.js:149945) + `BASE_IDENTITY` (`gNr`, cli_inner_pretty.js:149953) / `SDK_CLI_IDENTITY` (`OAi`) / `SDK_AGENT_IDENTITY` (`NAi`) — identity selector + the three lines.
- `systemPromptSection` (`Jx`, cli_inner_pretty.js:429774) / `resolveSystemPromptSections` (`O8a`, cli_inner_pretty.js:429777) — the cacheable-section factory + memo (no `cacheBreak` factory in 2.1.183).
- `splitSystemPromptByCacheScope` (`a0o`, cli_inner_pretty.js:581374) / `detectDateChangeAttachment` (`ftl`, cli_inner_pretty.js:464855) — the two real "uncached" mechanisms.
- `SYSTEM_PROMPT_DYNAMIC_BOUNDARY` (`hoe`, cli_inner_pretty.js:53897) / `isDynamicBoundaryEnabled` (`Xve`, cli_inner_pretty.js:134600) — the cache-prefix boundary marker + its first-party/AWS gate.
- `getFullIntroSection` (`y_f`, cli_inner_pretty.js:580712) / `getLeanHarnessIntroSection` (`w_f`, cli_inner_pretty.js:580861) — the FULL and LEAN intro builders; the latter carries the NEW ownership-frame variants.
- `CYBER_RISK_INSTRUCTION` (`Jko`, cli_inner_pretty.js:580615) / `buildSystemSection` (`__f`, cli_inner_pretty.js:580719) / `buildToneAndStyleSection` (`T_f`, cli_inner_pretty.js:580848) — the security/tone clauses + the `<system-reminder>` convention sentence.
- `isOwnershipFrameEnabled` (`t0o`, cli_inner_pretty.js:581260) — **NEW** team/ownership-frame predicate that swaps the intro wording.
- `getEnvBlockSimple` (`D_f`, cli_inner_pretty.js:581006) / `getEnvBlockStatic` (`P_f`, cli_inner_pretty.js:581041) — the env builders carrying the **NEW** Fable-5 model-list line (cli_inner_pretty.js:581032/581047).
- `getDefaultAgentPrompt` (`$vp`, cli_inner_pretty.js:384820) / `buildExplorePrompt` (`Gbp`, cli_inner_pretty.js:371916) / `buildPlanPrompt` (`zGp`, cli_inner_pretty.js:471975) / `getCoordinatorSystemPrompt` (`bvd`, cli_inner_pretty.js:221940) — the sub-agent + coordinator system prompts.
