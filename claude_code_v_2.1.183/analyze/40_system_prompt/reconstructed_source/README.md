# System-Prompt Construction — Readable-Source Restoration (v2.1.183)

> **What this is.** A *readable-source-level* reconstruction of the **whole** system-prompt
> construction machine **as it exists in Claude Code v2.1.183** — the section assembler, the
> lean/full split, the identity strings + selector, the main-loop intro builders, the `# System` /
> `# Tone` security-and-tone clauses, the four environment-block builders, the cacheable-section
> registry (and the two real "uncached" mechanisms), and the five built-in sub-agent / coordinator
> system prompts — written as clean TypeScript organized the way the genuine Anthropic source tree
> (the v2.1.88 named-TS at `/lyz/codespace/3rd/claude-code/src`) organizes it.
>
> **Why it exists.** The module front door one level up ([`../README.md`](../README.md)) is the
> narrative; this directory completes the picture by restoring the implementation at the source level,
> so you can read the machine top-to-bottom without grepping the 699,346-line bundle. Every behavior
> here is backed by a v2.1.183 line that was read directly; every reconstructed function carries a
> `// 2.1.183: <readable> = <obf> @<line>` anchor, and **every prompt string is quoted verbatim**
> (it is user-visible contract).

---

## How to read these files (the three evidence tiers)

These files were built — and verified — under a strict evidence discipline (the full rules live in
[`_conventions.md`](./_conventions.md)):

1. **PRIMARY — truth.** The v2.1.183 obfuscated bundle
   `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines;
   build_sha `9d251ab`, 2026-06-18). Every symbol, branch, gate, and string was verified by reading
   the exact line(s). The pre-extracted prompt assets
   (`…/extract/assets/system_prompts/01_identity.json`, `02_builder_*.txt`, `03_env_template_*.txt`,
   `04_subagent_{0..4}_*.txt`, `05_reminders.json`) are the **verbatim string source of truth** and
   are cited per-builder. Obfuscated names re-mangle every build, so all were re-derived in this build.
2. **SCAFFOLD — readable logic & names.** The v2.1.156 baseline analysis
   (`…/claude_code_v_2.1.156/analyze/44_lean_prompt/` for the lean/full split + the lean predicate, and
   `…/41_system_reminder/` for the reminder slimming) supplied the readable logic and the established
   readable names for the unchanged spine — each claim re-verified against the 183 bundle.
3. **CONVENTION ONLY — file shape.** The v2.1.88 named-TS source. It is mirrored for *shape only*:
   `utils/systemPrompt.ts` (the top assembler + merge layer), `utils/systemPromptType.ts` (the branded
   `SystemPrompt` type + `asSystemPrompt`), `constants/systemPromptSections.ts` (the
   `systemPromptSection` / `DANGEROUS_uncachedSystemPromptSection` registry), `constants/prompts.ts`
   (identity, builders, env, `prependBullets`, `getUnameSR`, scratchpad, `DEFAULT_AGENT_PROMPT`,
   `SYSTEM_PROMPT_DYNAMIC_BOUNDARY`), `constants/system.ts` + `cyberRiskInstruction.ts` (the `# System`
   tone/security clauses), and the sub-agent prompt builders (`utils/sideQuery.ts` / `forkedAgent.ts`).
   Each file's header cites the 2.1.88 path it imitates. **Note:** the 2.1.88
   `DANGEROUS_uncachedSystemPromptSection` factory has **no 2.1.183 counterpart** — see the file
   inventory note on `systemPromptSections.ts`.

---

## File inventory

Each file restores one slice of the subsystem. LOC is the reconstructed file's own line count; the
**v2.1.183 regions** are the load-bearing bundle spans each file is anchored to (all line numbers are
`cli_inner_pretty.js`). Every top-level symbol carries `// 2.1.183: <readable> = <obf> @<line>`.

| File | LOC | Restores | v2.1.183 regions |
|------|----:|----------|------------------|
| [`utils/systemPrompt.ts`](./utils/systemPrompt.ts) | 642 | The Layer-1 **section assembler** (`buildEffectiveSystemPromptSections` / `KL`), the **lean gate** (`isLeanSystemPrompt` + `isFullPromptModel` / `isForcedLeanModel` / `isEarlyAccessModel`), the **merge layer** (`mergeSystemPrompt`), the dynamic-boundary gate, the ownership-frame + investigate-first predicates, and the Fable-5 model-id map. The full registry of ~25 section descriptors with per-descriptor `// @<line>` anchors. | 580888-580940, 134232-134273, 362647-362665, 134600-134605, 581166-581266, 429774-429785 |
| [`utils/systemPromptType.ts`](./utils/systemPromptType.ts) | 117 | The branded `SystemPrompt` type + **`asSystemPrompt`** identity-brand, the three **identity strings** (verbatim), the **identity selector** (vertex / SDK-append / SDK-agent / interactive branches), and the org-cached identity set. | 360521-360523, 149945-149961 |
| [`constants/prompts.ts`](./constants/prompts.ts) | 566 | The **main-loop intro builders** (FULL `y_f`, LEAN `w_f` incl. the NEW ownership-frame variants), `prependBullets`, the hooks clause, the **four env-block builders** (uname / simple / static / excluded, incl. the NEW Fable-5 model-list line), `getUnameSR`, the shell-info + per-model knowledge-cutoff helpers, the **scratchpad** instructions, the **dynamic-boundary** marker (single home), and the **default-agent prompt** family. | 53897, 149953-955, 580615-580718, 580861-581102, 581135-581266, 384820-384846 |
| [`constants/system.ts`](./constants/system.ts) | 142 | The **`# System`** security/trust clauses and the **`# Tone and style`** bullets, quoted verbatim — `CYBER_RISK_INSTRUCTION`, the markdown-output / permission-mode / **`<system-reminder>` convention** / prompt-injection / hooks / auto-compress clauses, and the four tone bullets. | 580615-580616, 580670-580672, 580719-580730, 580848-580857 |
| [`constants/systemPromptSections.ts`](./constants/systemPromptSections.ts) | 298 | The **cacheable-section registry** (`systemPromptSection` factory, `resolveSystemPromptSections` memo, `clearSystemPromptSections`) **and** readable models of the two real "uncached" mechanisms: the **cache-scope splitter** (billing→null / identity→org / prefix→global / suffix→org) and the **out-of-band `date_change` attachment** (the date is never baked into a cached section). | 429774-429789, 3644-3702, 581374-581436, 581366-581373, 464855-464864, 220209-220222, 590594 |
| [`prompts/subagents.ts`](./prompts/subagents.ts) | 355 | The five **sub-agent prompt variants**: Explore + Plan (READ-ONLY specialists, verbatim incl. the hard READ-ONLY blocks), general-purpose default (re-exported from `prompts.ts`), the two tool-description slices (`_0`/`_4`, documented as NOT agent prompts), and the **coordinator / SDK top-prompt** (`bvd`). | 371916-371996, 471975-472052, 384820-384846, 423136-423318, 221940-222020+ |

**Total reconstructed LOC: 2,120.**

### Inventory note — the missing `DANGEROUS_uncachedSystemPromptSection` factory

The 2.1.88 convention exposes *two* section factories on `systemPromptSections.ts` —
`systemPromptSection` (cached) and `DANGEROUS_uncachedSystemPromptSection` (cache-breaking). In
**v2.1.183 the second factory does not exist**: `systemPromptSection` (`Jx`) hardcodes
`cacheBreak: false`, and a grep of the whole bundle for `cacheBreak: !0` / `cacheBreak: true` returns
**zero hits**. `systemPromptSections.ts` therefore keeps the `cacheBreak` field on the type for
shape-compatibility but provides only the cached factory, plus faithful readable models of the two
mechanisms that *actually* realize "uncached": the cache-scope splitter `a0o` (the billing header is
always `cacheScope: null`) and the date-change attachment `ftl` (the date is delivered out-of-band, not
in a cached section). This is the one place the 2.1.88 convention does not map 1:1 — flagged
`UNVERIFIED-default` in the file header and MEDIUM in the anchor dossier §14.

---

## The anchor-comment convention

Every reconstructed file follows the same in-file anchoring discipline so any claim is re-verifiable in
seconds against the live bundle:

- **Top-level symbols** carry `// 2.1.183: <readable> = <obf> @cli_inner_pretty.js:<line(s)>`. Example,
  from `utils/systemPrompt.ts`:
  `// 2.1.183: isLeanSystemPrompt = Dg @cli_inner_pretty.js:134268-134273 (fwd `var Dg;` @134260)`.
- **Non-trivial branches and every quoted clause** carry an inline `// @<line>` anchor pointing at the
  exact emit site, e.g. `// @149948: SDK + append → SDK_CLI_IDENTITY`.
- **Prompt strings are quoted verbatim** — never paraphrased — because they are the user-visible /
  model-visible contract. Where a string interpolates a live value (tool name, shell, model id), the
  *static* English is quoted exactly and only the `${…}` slot is a reconstructed seam.
- **Each file header block** discloses: the 2.1.183 regions covered, the 2.1.88 convention mirror path,
  the 2.1.156 scaffold doc, and a one-line cross-validation note (carryover vs new).
- **No symbol-mapping tables** inside these files (project `CLAUDE.md` rule) — inline anchors only; the
  consolidated obf→readable tables live in the symbol-additions index (see Provenance).
- Anything that could not be confirmed in the bundle is marked `// UNVERIFIED:` (e.g. the coordinator
  prompt tail beyond cli_inner_pretty.js:221995 is omitted with such a marker, and the absence of a
  `cacheBreak: true` site is marked `// UNVERIFIED-default:`).

---

## Provenance

The working notes and specs these files were derived from, and the convention rulebook they obey:

- [`_anchors_system_prompt.md`](./_anchors_system_prompt.md) — **the anchor dossier**: a section-by-
  section map of the machine (§0 one-paragraph map; §1 assembler `KL`; §1a/§1b the lean/full branch +
  the real entry points; §2 identity; §3 cacheable registry; §4-§6 the intro/`# System`/lean builders
  with verbatim clauses; §7/§7a the cache-scope splitter + out-of-band date; §8 the four env builders;
  §9 the lean gate predicates; §10 the merge layer; §11 the five sub-agent prompts; §12 the dynamic
  section builders; **§13 the new-vs-2.1.156 0-count grep table**; §14 confidence). Every
  `cli_inner_pretty.js:<line>` in the reconstructed files traces back to a row here.
- [`_conventions.md`](./_conventions.md) — **the reconstruction rulebook**: the three evidence tiers,
  the asset-as-string-source-of-truth rule, what each file must contain, and the file-format / anchor /
  verbatim-quoting rules these `.ts` files were written against.

Consolidated symbol mapping (obf→readable tables — never duplicated inside the `.ts` files):
- [`../../00_overview/symbol_additions_v2_1_183_system_prompt.md`](../../00_overview/symbol_additions_v2_1_183_system_prompt.md) — **all 77 v2.1.183 system-prompt symbols**, harvested from the inline anchors of these files and re-derived in the live bundle. Folds into `symbol_index_infra_platform.md` "## Module: Prompt".

---

## Cross-validation status

Every `cli_inner_pretty.js` anchor, gate, branch, and verbatim prompt string in these files was read
directly in the live v2.1.183 bundle; the carryover/new-at-2.1.183 verdicts are corroborated by
0-count greps in the v2.1.156 BEFORE bundle (anchor dossier §13) — full results and the per-anchor
re-verification log:
[`../../00_overview/cross_validation_report_system_prompt.md`](../../00_overview/cross_validation_report_system_prompt.md).

---

## Suggested reading order

1. **`utils/systemPromptType.ts`** — the identity strings + brand; the smallest, dependency-free file.
2. **`utils/systemPrompt.ts`** — the assembler `KL`, the lean gate `Dg`, and the merge layer `bW`. This
   is the spine; the `KL` return body (cli_inner_pretty.js:580931-580939) is the structural heart.
3. **`constants/system.ts` → `constants/prompts.ts`** — the verbatim contract: `# System` /
   `<system-reminder>` / `# Tone`, then the intro builders + the four env blocks.
4. **`constants/systemPromptSections.ts`** — the cacheable registry and the two "uncached" mechanisms
   (the subtle part: why there is no `cacheBreak` factory).
5. **`prompts/subagents.ts`** — the five sub-agent variants + the coordinator top-prompt.

For *what is unchanged vs new* between v2.1.156 and v2.1.183, read the module front door
([`../README.md`](../README.md), "Cross-version status") and the dossier's §13 grep table.

---

## Related Symbols

> Symbol mappings live in the central index and the per-feature additions file (never as obf→readable
> tables in these docs). Each reconstructed `.ts` file is itself the authoritative, line-anchored
> symbol map for its slice (via its `// 2.1.183: <readable> = <obf> @<line>` comments).
>
> - [symbol_additions_v2_1_183_system_prompt.md](../../00_overview/symbol_additions_v2_1_183_system_prompt.md) — the consolidated v2.1.183 system-prompt symbol table (all 77 symbols surfaced here).
> - [symbol_index_infra_platform.md](../../00_overview/symbol_index_infra_platform.md) — Platform infra; "## Module: Prompt" is the home for system-prompt construction.
> - [symbol_index_core_execution.md](../../00_overview/symbol_index_core_execution.md) — the Subagent area (agent defs `uce`/`k5n`/`nye`, Agent/Task description `Aqa`).
> - [symbol_index_core_features.md](../../00_overview/symbol_index_core_features.md) — coordinator/team, workflow, and effort surfaces that toggle optional prompt sections.
> - [symbol_index_infra_integration.md](../../00_overview/symbol_index_infra_integration.md) — the `/config` + output-style UI feeding the env / output-style sections.

Anchor entry points (re-derived v2.1.183 names; each file is the full map):

- `buildEffectiveSystemPromptSections` (`KL`, cli_inner_pretty.js:580888) — the section assembler → `utils/systemPrompt.ts`.
- `isLeanSystemPrompt` (`Dg`, cli_inner_pretty.js:134268) — the lean gate → `utils/systemPrompt.ts`.
- `mergeSystemPrompt` (`bW`, cli_inner_pretty.js:362647) / `asSystemPrompt` (`Wc`, cli_inner_pretty.js:360521) — merge + brand → `utils/systemPrompt.ts` / `utils/systemPromptType.ts`.
- `getIdentityString` (`l_n`, cli_inner_pretty.js:149945) — identity selector → `utils/systemPromptType.ts`.
- `systemPromptSection` (`Jx`, cli_inner_pretty.js:429774) / `splitSystemPromptByCacheScope` (`a0o`, cli_inner_pretty.js:581374) / `detectDateChangeAttachment` (`ftl`, cli_inner_pretty.js:464855) — registry + the two "uncached" mechanisms → `constants/systemPromptSections.ts`.
- `getFullIntroSection` (`y_f`, cli_inner_pretty.js:580712) / `getLeanHarnessIntroSection` (`w_f`, cli_inner_pretty.js:580861) — intro builders → `constants/prompts.ts`.
- `CYBER_RISK_INSTRUCTION` (`Jko`, cli_inner_pretty.js:580615) / `buildSystemSection` (`__f`, cli_inner_pretty.js:580719) — security/tone clauses → `constants/system.ts`.
- `getDefaultAgentPrompt` (`$vp`, cli_inner_pretty.js:384820) / `buildExplorePrompt` (`Gbp`, cli_inner_pretty.js:371916) / `buildPlanPrompt` (`zGp`, cli_inner_pretty.js:471975) / `getCoordinatorSystemPrompt` (`bvd`, cli_inner_pretty.js:221940) — sub-agent + coordinator prompts → `prompts/subagents.ts`.
