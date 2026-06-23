# Symbol Additions — System-Prompt Construction (v2.1.183)

> Consolidated obfuscated→readable symbol table for the **system-prompt construction**
> subsystem **as it exists in v2.1.183** — the assembler (`buildEffectiveSystemPromptSections`),
> the lean/full gate, the merge/precedence layer, the identity strings + selector, the section
> builders (intro / # System / # Tone / env block / scratchpad / default-agent), the cacheable
> section registry + the two "uncached" mechanisms (cache-scope splitter + date-change
> attachment), and the built-in sub-agent / coordinator system prompts.
>
> Every row was harvested from the inline `// 2.1.183: <readable> = <obf> @cli_inner_pretty.js:NNN`
> anchors (and the file-header obf lists) of the reconstructed `.ts` files under
> `40_system_prompt/reconstructed_source/` and re-derived by reading the declaration in the live
> v2.1.183 bundle. **The bundler re-mangles every build** — these v2.1.183 names DO NOT apply to
> other versions (e.g. the lean gate `isLeanSystemPrompt` re-mangled to `Dg`; the assembler `KL`).
>
> **Unique symbols indexed: 77** (no duplicate obf rows; `$vp` and `t0o` each appear under one
> canonical readable name with a single-definition note — see §2 and §5).
>
> **Cross-validated against:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`
> (699,346 lines; build_sha 9d251ab, 2026-06-18). File:Line column uses the v2.1.183 bundle line
> (`cli_inner_pretty.js:NNN`); the reconstructed source file is noted parenthetically in the
> Readable column where helpful.
>
> **Home index.** These rows fold into **`00_overview/symbol_index_infra_platform.md`,
> "## Module: Prompt"** (the canonical home for system-prompt construction: identity, lean gate,
> assembler, env block, cache-scope split). The sub-agent / coordinator prompt rows (§6) overlap
> the **Subagent** area of `00_overview/symbol_index_core_execution.md` (the agent defs `uce`/`k5n`/
> `nye` and the Agent/Task tool description `Aqa` live there); they are duplicated in §6 as a
> reading aid for the system-prompt docs.

---

## Module: System-Prompt Assembler & Merge Layer

The two-layer build (sections → merge) plus the simple/short-circuit entry and the section-cache
descriptor/resolver. `KL` is the structural heart; `bW` resolves the effective prompt by precedence.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bW | mergeSystemPrompt (utils/systemPrompt.ts) | cli_inner_pretty.js:362647-362665 | function |
| Jx | systemPromptSection (cacheable descriptor factory; `cacheBreak` hardcoded false) | cli_inner_pretty.js:429774-429776 | function |
| KL | buildEffectiveSystemPromptSections (the section assembler) | cli_inner_pretty.js:580888-580940 | function |
| n0o | isSimplePromptMode (CLAUDE_CODE_SIMPLE short-circuit) | cli_inner_pretty.js:580858-580860 | function |
| O8a | resolveSystemPromptSections (compute-once-per-process memo) | cli_inner_pretty.js:429777-429786 | function |

---

## Module: Lean / Full Prompt Gate

The capability gate that swaps the full six-section head for the single lean "# Harness" head.
`Dg` is the memoized public predicate; the other four are its supporting helpers.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| C8u | isForcedLeanModel (clientData + tengu_velvet_cascade additive override) | cli_inner_pretty.js:134235-134242 | function |
| cme | isEarlyAccessModel (`-eap` suffix bypass) | cli_inner_pretty.js:134232-134234 | function |
| Dg | isLeanSystemPrompt (memoized lean gate; fwd `var Dg;` @134260) | cli_inner_pretty.js:134268-134273 | function |
| I8u | isFullPromptModel (model-family capability judgement) | cli_inner_pretty.js:134243-134259 | function |

---

## Module: Identity Strings & Selector

The three canonical identity lines, the selector, the org-cache identity set, and the
`SystemPrompt`-brand identity function. Canonical home: `utils/systemPromptType.ts`
(re-exported from `constants/prompts.ts`).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| a_n | IDENTITY_STRINGS (org-cached identity set, over FJu) | cli_inner_pretty.js:149958-149961 | const |
| FJu | identityStringsArray ([gNr, OAi, NAi] backing array for a_n) | cli_inner_pretty.js:149958-149960 | const |
| gNr | BASE_IDENTITY ("...official CLI for Claude.") | cli_inner_pretty.js:149953 | const |
| l_n | getIdentityString (identity selector; vertex / SDK / interactive) | cli_inner_pretty.js:149945-149952 | function |
| NAi | SDK_AGENT_IDENTITY ("You are a Claude agent, built on...SDK.") | cli_inner_pretty.js:149955 | const |
| OAi | SDK_CLI_IDENTITY ("...official CLI for Claude, running within the Claude Agent SDK.") | cli_inner_pretty.js:149954 | const |
| Wc | asSystemPrompt (SystemPrompt-brand identity fn `e => e`) | cli_inner_pretty.js:360521-360523 | function |

---

## Module: Head & Section Builders (Intro / # System / # Tone)

The full-mode head builders (intro, # System, # Tone, etc.), the lean head, the security/tone
clause strings, the bullet renderer, the hooks clause, and the ownership-frame ("team") predicate
that selects the intro variant. NEW in 2.1.183: the ownership-frame intro variants (`t0o`/`w_f`)
and the Fable-5 identity block (`d_f`).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| __f | buildSystemSection ("# System") | cli_inner_pretty.js:580719-580730 | function |
| A_f | buildAutonomyAppendSection (tengu_amber_sextant gate, default true) | cli_inner_pretty.js:580686-580696 | function |
| b_f | buildDoingTasksSection ("# Doing tasks") | cli_inner_pretty.js:580731-580763 | function |
| c_f | buildActionCautionSection | cli_inner_pretty.js:580661-580664 | function |
| d_f | FABLE_IDENTITY (Fable-5/Mythos identity block, NEW) | cli_inner_pretty.js:580909 (registered) | const |
| E_f | buildUsingToolsSection ("# Using your tools") | cli_inner_pretty.js:580781-580804 | function |
| f_f | buildHooksClause (the "# System" hooks bullet) | cli_inner_pretty.js:580670-580672 | function |
| F_f | buildFocusModeSection | cli_inner_pretty.js:581160-581165 | function |
| g_f | buildLanguageSection | cli_inner_pretty.js:580698-580703 | function |
| h_f | buildOutputStyleSection | cli_inner_pretty.js:580704-580708 | function |
| Jko | CYBER_RISK_INSTRUCTION ("authorized security testing" clause) | cli_inner_pretty.js:580615-580616 | const |
| l_f | buildAntiVerbositySection ("# Communicating with the user", rewritten) | cli_inner_pretty.js:580624-580660 | function |
| m_f | buildHeronBrookSection (tengu_heron_brook free-text, default "") | cli_inner_pretty.js:580673-580684 | function |
| O_f | buildBriefSection (returns s_f when isBriefEnabled) | cli_inner_pretty.js:581156-581159 | function |
| pV | prependBullets (` - item` bullet renderer) | cli_inner_pretty.js:580709-580711 | function |
| R_f | buildBackgroundSessionSection | cli_inner_pretty.js:581114-581134 | function |
| S_f | buildExecutingActionsSection ("# Executing actions with care") | cli_inner_pretty.js:580764-580780 | function |
| t0o | isOwnershipFrameEnabled (team intro predicate; memoized, NEW) | cli_inner_pretty.js:581260-581266 | function |
| T_f | buildToneAndStyleSection ("# Tone and style") | cli_inner_pretty.js:580848-580857 | function |
| u_f | buildTaskContinuitySection | cli_inner_pretty.js:580665-580669 | function |
| U_f | buildInvestigateFirstSection | cli_inner_pretty.js:581176-581178 | function |
| v_f | buildSessionGuidanceSection | cli_inner_pretty.js:580811-580847 | function |
| w_f | getLeanHarnessIntroSection (lean intro + "# Harness", ownership-frame variants) | cli_inner_pretty.js:580861-580881 | function |
| y_f | getFullIntroSection (intro + cyber-risk + URL rule) | cli_inner_pretty.js:580712-580718 | function |

> Note: `t0o` is a single definition with one canonical readable name `isOwnershipFrameEnabled`;
> its home is `constants/prompts.ts` (where `getLeanHarnessIntroSection` calls it) and it is
> imported/re-exported by `utils/systemPrompt.ts`. The earlier divergent name
> `isOwnershipFrameActive` was reconciled away — do not re-add a second row.

---

## Module: Environment Block, Scratchpad, Default-Agent Prompt

The env-block family (four shapes), the per-model cutoff / shell-info / OS-version / model-list
helpers, the model-id map, scratchpad instructions, and the general-purpose default-agent prompt.
NEW in 2.1.183: the Fable-5 model-list line (`getModelListLine` @581032/581047) and `wPe`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $vp | getDefaultAgentPrompt (general-purpose agent prompt builder) | cli_inner_pretty.js:384820-384835 | function |
| Cgi | buildExcludedModeMemorySection | cli_inner_pretty.js:151957-151961 | function |
| D_f | getEnvBlockSimple (live-session "# Environment" bulleted block) | cli_inner_pretty.js:581006-581039 | function |
| HUn | getScratchpadInstructions ("# Scratchpad Directory") | cli_inner_pretty.js:581135-581155 | function |
| L_f | getEnvBlockUname (classic `<env>` uname-style block, subagent trailer) | cli_inner_pretty.js:580976-581005 | function |
| M_f | getEnvBlockExcluded ("# Environment" excluded dynamic fields only) | cli_inner_pretty.js:581056-581073 | function |
| NBa | DEFAULT_AGENT_PROMPT (bare report-contract sentence) | cli_inner_pretty.js:581198-581199 | const |
| o0o | getShellInfoLine (zsh/bash/PowerShell shell-info line) | cli_inner_pretty.js:581088-581098 | function |
| P_f | getEnvBlockStatic ("# Environment" static, excludeDynamicSections mode) | cli_inner_pretty.js:581041-581053 | function |
| r0o | getKnowledgeCutoff (per-model knowledge-cutoff date) | cli_inner_pretty.js:581075-581087 | function |
| s0o | getUnameSR (`uname -sr` analog OS-version line) | cli_inner_pretty.js:581099-581102 | function |
| wPe | FRONTIER_MODEL_IDS / getModelIds (Fable-5 model-list map) | cli_inner_pretty.js:581254-581259 | object |
| zOl | buildAttachmentsSection (always-last attachments section) | cli_inner_pretty.js:580941-580947 | function |

> Note: `$vp` is a single definition (`getDefaultAgentPrompt`) homed in `constants/prompts.ts`
> and re-exported by `prompts/subagents.ts` as `buildGeneralPurposePrompt`. The const head
> `NBa` (DEFAULT_AGENT_PROMPT) is the bare sentence; `$vp` appends the strengths/guidelines tail.

---

## Module: Sub-Agent & Coordinator Prompts

The built-in sub-agent system prompts (Explore / Plan / general-purpose), their agent defs and
whenToUse strings, the Agent/Task tool description, and the coordinator/SDK multi-worker prompt.
Overlaps the Subagent area of `symbol_index_core_execution.md` (duplicated here as a reading aid).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Aqa | buildAgentToolDescription (Agent/Task tool DESCRIPTION; usage-notes tail @423290) | cli_inner_pretty.js:423136-423318 | function |
| bvd | getCoordinatorSystemPrompt (multi-worker orchestration top-prompt) | cli_inner_pretty.js:221940-222020 | function |
| Gbp | buildExplorePrompt (Explore agent system prompt, READ-ONLY) | cli_inner_pretty.js:371916-371957 | function |
| k5n | planAgentDef (built-in Plan agent def; model "inherit", omitClaudeMd) | cli_inner_pretty.js:472041-472052 | object |
| nye | generalPurposeAgentDef (built-in general-purpose agent def; tools ["*"]) | cli_inner_pretty.js:384838-384846 | object |
| qbp | EXPLORE_WHEN_TO_USE_LEAN | cli_inner_pretty.js:371971 | const |
| uce | exploreAgentDef (built-in Explore agent def; model "haiku", omitClaudeMd) | cli_inner_pretty.js:371986-371996 | object |
| Wbp | EXPLORE_WHEN_TO_USE | cli_inner_pretty.js:371969-371970 | const |
| zGp | buildPlanPrompt (Plan agent system prompt, READ-ONLY) | cli_inner_pretty.js:471975-472028 | function |

---

## Module: Cacheable Sections, Cache-Scope Split & Date Attachment

The section-cache store/clear primitives, the dynamic-boundary marker + gate, the cache-scope
splitter (real "uncached" mechanism A), and the out-of-band date-change attachment (mechanism B)
with its today/last-date primitives. 2.1.183 fact: there is NO `DANGEROUS_uncached` factory —
`Jx` hardcodes `cacheBreak:false` (see §"Assembler" `Jx` row).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| a0o | splitSystemPromptByCacheScope (cache-scope splitter; billing→null, identity→org) | cli_inner_pretty.js:581374-581436 | function |
| ayt | getSystemPromptSectionCache | cli_inner_pretty.js:3644-3646 | function |
| cyt | setLastEmittedDate | cli_inner_pretty.js:3656 | function |
| drr | setSystemPromptSectionCacheEntry | cli_inner_pretty.js:3647-3649 | function |
| dyt | clearBetaHeaderLatches (sticky-beta latch reset) | cli_inner_pretty.js:3698-3702 | function |
| ftl | detectDateChangeAttachment (out-of-band date_change emitter) | cli_inner_pretty.js:464855-464864 | function |
| hoe | SYSTEM_PROMPT_DYNAMIC_BOUNDARY (`__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__` marker; re-export @555558) | cli_inner_pretty.js:53897 | const |
| iLe | clearSystemPromptSections (== lyt + dyt) | cli_inner_pretty.js:429787-429789 | function |
| Itt | computeTodayISO (local `YYYY-MM-DD`) | cli_inner_pretty.js:220209-220215 | function |
| lyt | clearSystemPromptSectionState (section-cache clear) | cli_inner_pretty.js:3650-3652 | function |
| prr | lastEmittedDate (Ot.lastEmittedDate accessor) | cli_inner_pretty.js:3653 | function |
| QOl | recordSystemPromptHash (tengu_sysprompt_block telemetry) | cli_inner_pretty.js:581366-581373 | function |
| SCe | memoizedToday (process-memoized today = wn(Itt)) | cli_inner_pretty.js:220222 | function |
| Xve | isDynamicBoundaryEnabled (boundary-emit gate; firstParty/anthropicAws) | cli_inner_pretty.js:134600-134605 | function |

---

## Module: Mode / Section-Gate Predicates

The mode resolvers that gate optional sections inside the assembler — investigate-first mode
(scoped to opus-4-7) and the team/ownership-frame predicate already listed in §"Head & Section
Builders" (`t0o`). Listed separately because `i0o` keys a section name, not a builder.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| i0o | investigateFirstMode ("off"/"additive"/"compact"; opus-4-7 only, tengu_slate_harrier) | cli_inner_pretty.js:581166-581175 | function |
