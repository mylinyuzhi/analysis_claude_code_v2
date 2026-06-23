# Reconstruction Conventions — System Prompt (v2.1.183, readable-source restoration)

> **Goal:** a *readable-source-level* restoration of Claude Code **v2.1.183**'s **system-prompt
> construction machine** — how the effective system prompt is assembled section-by-section, the identity
> strings, the main-loop builders, the environment block, the sub-agent prompt variants, the lean/full
> prompt split, and the cacheable-section mechanism — written as clean TypeScript organized the way the
> genuine Anthropic source tree (v2.1.88 named-TS at `/lyz/codespace/3rd/claude-code/src`) organizes it.
> Reconstruct the *whole machine* at 2.1.183, not a delta.

## Three evidence tiers (do not confuse them)

1. **PRIMARY — the v2.1.183 obfuscated bundle + extracted assets**
   - Bundle: `…/2.1.183/extract/cli_inner_pretty.js` (699,346 lines). Isolated decls under
     `…/extract/cli_unpack_pretty/decls/`.
   - **Pre-extracted prompt assets — use as the verbatim string source of truth:**
     - `…/extract/assets/system_prompts/01_identity.json` — the four identity strings (`gNr`, `OAi`,
       `NAi`, plus the SDK-agent line).
     - `…/extract/assets/system_prompts/02_builder_{$vp,w_f,y_f}.txt` — the three main-loop prompt
       builders (lengths 1288 / 1078 / 935).
     - `…/extract/assets/system_prompts/03_env_template_*.txt` — the environment block template.
     - `…/extract/assets/system_prompts/04_subagent_{0..4}_*.txt` — the five sub-agent prompt variants.
     - `…/extract/assets/system_prompts/05_reminders.json` — 25 reminder strings (shared with the
       `41_system_reminder/` module — cross-link, don't duplicate the catalogue).
     - `…/extract/assets/system_prompts/_index.json` — maps the obf decl ids above.
   - **Every** section, branch, and quoted clause MUST be verified by reading the exact bundle line(s).
     Quote prompt text **verbatim** (it is user-visible contract). Obf names re-mangle per build.

2. **SCAFFOLD — the v2.1.156 baseline analysis docs**
   `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/44_lean_prompt/` (the lean/full
   split, the `X3` lean predicate, eligibility gate) and any `00_overview` prompt notes. The `# System`
   builder was `gXz` in 2.1.156 — re-derive its 2.1.183 analog. Inherit readable names; re-verify lines.

3. **CONVENTION ONLY — the v2.1.88 named-TS source**
   `/lyz/codespace/3rd/claude-code/src`. Mirror this shape:
   - `utils/systemPrompt.ts` — `buildEffectiveSystemPrompt({...})` (the top assembler).
   - `utils/systemPromptType.ts` — `type SystemPrompt = readonly string[] & {…}`, `asSystemPrompt(...)`.
   - `constants/systemPromptSections.ts` — `systemPromptSection(...)`,
     `DANGEROUS_uncachedSystemPromptSection(...)`, `clearSystemPromptSections()` (the cacheable-section
     registry — the mechanism that lets a section opt out of the cached prefix).
   - `constants/prompts.ts` — identity constants, `DEFAULT_AGENT_PROMPT`, `SYSTEM_PROMPT_DYNAMIC_BOUNDARY`,
     `CLAUDE_CODE_DOCS_MAP_URL`, `prependBullets(...)`, `getUnameSR()`, `getScratchpadInstructions()`.
   - `constants/{system.ts,cyberRiskInstruction.ts}` — the `# System` tone/security clauses (e.g.
     `CYBER_RISK_INSTRUCTION`), the `<system-reminder>` convention sentence.
   - `utils/systemPromptType.ts` + `utils/sideQuery.ts` / `utils/forkedAgent.ts` for sub-agent prompts.
   Cite the 2.1.88 file when you borrow a convention.

## What each reconstructed file MUST contain

- The **assembler** (`buildEffectiveSystemPrompt` analog): the ordered list of sections it concatenates,
  each section's source, and the lean-vs-full branch (which sections are dropped for lean models, gated by
  the `X3` analog). Anchor each section to its emit line.
- The **identity + builders**: reconstruct the three builders ($vp/w_f/y_f) as functions, quoting the
  verbatim text from `assets/system_prompts/`, with `// @<line>` anchors to where each clause is emitted.
- The **environment block** (`getUnameSR`/env template): how cwd / platform / date / model / git status
  are injected, and which parts are `DANGEROUS_uncached` (cache-busting).
- The **sub-agent prompts**: the five variants — what distinguishes each (default agent, Explore, Plan,
  output-style, SDK) and which `DEFAULT_AGENT_PROMPT`-family string each uses.
- The **`# System` security/tone clauses** verbatim (CYBER_RISK_INSTRUCTION, the `<system-reminder>`
  convention sentence, the tone/altitude paragraph) — quote, don't paraphrase.

## File format, anchors, and rules

- Clean readable TS; **every** top-level function/const carries `// 2.1.183: <readable> = <obf> @line`;
  non-trivial branches + every quoted clause get inline `// @<line>` anchors.
- **File header block**: 2.1.183 regions covered, the 2.1.88 convention mirror path, the 2.1.156 scaffold
  doc, and a one-line cross-validation note.
- **No invented behavior**; mark `// UNVERIFIED:` and report in your manifest if unconfirmable. Quote
  prompt strings verbatim. English only.
- **No symbol-mapping tables** in these files (project [`CLAUDE.md`](../../../../CLAUDE.md) rule) — inline
  anchors only; the module `README.md` uses list-format refs; new symbols go in your manifest for the
  `symbol_additions_v2_1_183_system_prompt.md` index.
