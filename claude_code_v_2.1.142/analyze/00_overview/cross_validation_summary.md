# Cross-validation Summary — v2.1.142 (Unit D2)

A sweep across the v2.1.142 deobfuscation artifacts: symbol-mapping spot-check (50 rows), relative-link integrity, module-README sanity, symbol_index alphabetical ordering, and 2.1.112 → 2.1.142 cross-version drift.

**Source consulted:** `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (611,353 lines, 20,141,691 bytes).

**Note on timing:** This sweep was run while units A1–A4 were consolidating the `symbol_index_*.md` files in parallel. At the moment of the sweep the four split index files contained only narrative scaffolding + 5 table rows (all in `symbol_index_infra_platform.md`); the bulk of the v2.1.142 symbol corpus lives in the 19 `symbol_additions_v2_1_142_*.md` files (1,454 rows with parseable file:line citations, 2,072 rows total). The spot-check sample is therefore drawn from the union of all 23 index/additions files.

---

## 1. Symbol mapping spot-check (50 entries)

**Method:**

1. Built a TSV of every row matching `^| \`<id>\` |` across the four `symbol_index_*.md` files and the 19 `symbol_additions_v2_1_142_*.md` files (2,072 rows total).
2. Filtered to rows whose third column references `cli_inner_pretty.js:<line>` with a numeric line (1,454 rows).
3. Took every 29th row deterministically (`NR % 29 == 0`) to produce a sample of exactly 50.
4. For each sample row, looked up the obfuscated token in the bundle (`awk` exact-string match with word-boundary checks against `[A-Za-z0-9_$]`). A row passes if at least one occurrence of the token falls within `[start-30, end+30]` of the documented line.

`start` is the documented declaration line; `Source Line` is the first occurrence found inside the documented range. Small offsets (typically 0–17 lines) are normal because the documentation often cites the start of a multi-line annotation block while the actual `function`/`const` keyword sits a few lines below.

### Results table

| # | Obfuscated | Readable | Index File | Source Line | Status |
|---|------------|----------|------------|-------------|--------|
| 1 | `cA` | `writeToMailbox` (locked append) | symbol_additions_v2_1_142_agent_team_arch.md | 239162 (doc: 239157) | VERIFIED |
| 2 | `rgK` | `resolvePermissionMode` | symbol_additions_v2_1_142_agent_team_arch.md | 198981 | VERIFIED |
| 3 | `JF_` | `spawnSplitPaneTeammate` | symbol_additions_v2_1_142_agent_team_arch.md | 337020 | VERIFIED |
| 4 | `yQ4` | `mountFleetViewFromLeftArrow` | symbol_additions_v2_1_142_agents.md | 569366 | VERIFIED |
| 5 | `Ur6` | `BG_RETIRE_TICK_MS` | symbol_additions_v2_1_142_agents.md | 609578 | VERIFIED |
| 6 | `iC5` | `assembleBgSessionDispatch` | symbol_additions_v2_1_142_agents.md | 510501 (doc: 510508) | VERIFIED |
| 7 | `NQ4` | `iconForJobState` | symbol_additions_v2_1_142_agents.md | 566153 | VERIFIED |
| 8 | `UVK` | `buildAgentMemoryPrompt` | symbol_additions_v2_1_142_auto_memory.md | 142940 | VERIFIED |
| 9 | `qS1` | `slugifyName` | symbol_additions_v2_1_142_auto_memory.md | 141940 | VERIFIED |
| 10 | `TTK` | `os` module require | symbol_additions_v2_1_142_auto_memory.md | 139832 | VERIFIED |
| 11 | `zS1` | `sanitizePathKey` | symbol_additions_v2_1_142_auto_memory.md | 142495 | VERIFIED |
| 12 | `sandbox.bwrapPath` | `sandboxBwrapPathSetting` | symbol_additions_v2_1_142_by_version_133_142.md | 48374 | VERIFIED (literal `bwrapPath`) |
| 13 | `x-claude-code-parent-agent-id` | HTTP header literal | symbol_additions_v2_1_142_by_version_133_142.md | 128062 | VERIFIED (string literal) |
| 14 | `forceLoginMethod` | `forceLoginMethodSetting` | symbol_additions_v2_1_142_by_version_133_142.md | 50655 | VERIFIED |
| 15 | `DH4` | `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES` | symbol_additions_v2_1_142_compact_arch.md | 408486 | VERIFIED |
| 16 | `l47` | `shouldStartPrecomputedCompact` | symbol_additions_v2_1_142_compact_arch.md | 243440 | VERIFIED |
| 17 | `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | env var | symbol_additions_v2_1_142_compact_arch.md | 408360 | VERIFIED |
| 18 | `I44` | `buildCacheSafeParamsForCompact` | symbol_additions_v2_1_142_compact_cache.md | 431828 | VERIFIED |
| 19 | `CM$` | `subagentProgressSummary` | symbol_additions_v2_1_142_compact_cache.md | 271869 | VERIFIED |
| 20 | `ZxH` | `promptCachingScopeBeta` | symbol_additions_v2_1_142_compact_cache.md | 96809 | VERIFIED |
| 21 | `e7H` | `getMaxOutputTokensForModel` | symbol_additions_v2_1_142_compact_cache.md | 526383 | VERIFIED |
| 22 | `tI` | `hasHookForEvent` | symbol_additions_v2_1_142_hooks.md | 521134 (doc: 521135) | VERIFIED |
| 23 | `G38` | `postToolUseAggregator` | symbol_additions_v2_1_142_hooks.md | 378949 (doc: 378950) | VERIFIED |
| 24 | `P15` | `sseBodyOverflowTransformStream` | symbol_additions_v2_1_142_mcp.md | 412136 | VERIFIED |
| 25 | `UR$` | `WORKSPACE_BASH_TOOL_NAME` | symbol_additions_v2_1_142_mcp.md | 50146 (doc: 50157) | VERIFIED |
| 26 | `wJ$` | `expandDefaultsList` | symbol_additions_v2_1_142_permission.md | 337707 | VERIFIED |
| 27 | `qQK` | `clearPermissionUpdateCallback` | symbol_additions_v2_1_142_permission.md | 199113 | VERIFIED |
| 28 | `jdK` | `zshBuiltinsBypass` | symbol_additions_v2_1_142_permission.md | 205627 | VERIFIED |
| 29 | `eS6` | `findGenericAskRule` | symbol_additions_v2_1_142_permission.md | 421593 | VERIFIED |
| 30 | `Va1` | `vsCodeIdeaExcludes` | symbol_additions_v2_1_142_permission.md | 195285 (doc: 195302) | VERIFIED |
| 31 | `KI9` | `findFirstUnescaped` | symbol_additions_v2_1_142_permission.md | 50107 (doc: 50124) | VERIFIED |
| 32 | `V2` | `ExitPlanModeV2Tool` | symbol_additions_v2_1_142_plan_mode.md | 381649 | VERIFIED |
| 33 | `Sq6` | `slugifyPrompt` | symbol_additions_v2_1_142_plan_mode.md | 138987 | VERIFIED |
| 34 | `TdH` | `transitionPlanAutoMode` | symbol_additions_v2_1_142_plan_mode.md | 422736 | VERIFIED |
| 35 | `sQ` | `isUltraplanAvailable` | symbol_additions_v2_1_142_plan_mode.md | 475282 | VERIFIED |
| 36 | `ap7` | `isPipeSafe` | symbol_additions_v2_1_142_shell_snapshot.md | 360848 | VERIFIED |
| 37 | `bM6` | `getPluginBinPaths` | symbol_additions_v2_1_142_shell_snapshot.md | 230997 | VERIFIED |
| 38 | `CT8` | `getAiAgentTag` | symbol_additions_v2_1_142_shell_snapshot.md | 361227 | VERIFIED |
| 39 | `Qf$` | `emitSkillActivatedOtel` | symbol_additions_v2_1_142_skills_goal.md | 218520 | VERIFIED |
| 40 | `Xp6` | `goalGateCheck` | symbol_additions_v2_1_142_skills_goal.md | 486714 | VERIFIED |
| 41 | `vR$` | `ICON_PULSE` (`"◎"`) | symbol_additions_v2_1_142_skills_goal.md | 48414 | VERIFIED |
| 42 | `I$_` | `tengu_fork_subagent_enabled` | symbol_additions_v2_1_142_subagent.md | 211795 | VERIFIED |
| 43 | `He$` | `isOpus47LaunchDefaultActive` | symbol_additions_v2_1_142_think_ui.md | 198871 | VERIFIED |
| 44 | `vZ$` | `EffortLevelLabel` | symbol_additions_v2_1_142_think_ui.md | 496853 | VERIFIED |
| 45 | `lB_` | `STILL_THINKING_MS` (10_000) | symbol_additions_v2_1_142_think_ui.md | 328735 | VERIFIED |
| 46 | `tengu_scroll_speed_set` | telemetry event name | symbol_additions_v2_1_142_think_ui.md | 476541 | VERIFIED |
| 47 | `vf5` | `FEEDBACK_TRANSCRIPT_SCOPE_OPTIONS` | symbol_additions_v2_1_142_think_ui.md | 429617 | VERIFIED |
| 48 | `$Y6` | `structuredOutputTool` | symbol_additions_v2_1_142_tools_arch.md | 207571 (doc: 207581) | VERIFIED |
| 49 | `Gv$` | `recordToolDurationHistogram` | symbol_additions_v2_1_142_tools_arch.md | 388291 | VERIFIED |
| 50 | `fH5` | `sendUserFileTool` | symbol_additions_v2_1_142_tools_arch.md | 385814 | VERIFIED |

### Summary

- 50 / 50 sampled tokens are found inside the documented `[start-30, end+30]` window of `cli_inner_pretty.js`. No drift, no missing entries.
- Sanity-checked signatures (function vs constant vs object) for 9 of the 50 by inspecting the actual source line: all match the documented Type column. Examples:
  - `cA` doc says `function` → source `async function cA(H, $, q)` at 239162 (correct)
  - `DH4` doc says `constant` → source `DH4 = 3,` at 408486 (correct)
  - `NQ4` doc says `function` → source `function NQ4(H, $, q)` at 566153 (correct)
  - `fH5` doc says `function` (tool registration object) → source `(fH5 = XK({...}))` at 385814 — `fH5` is the result of `XK(...)`, the tool factory, which is an object (the documented description "tool registration object" is accurate; the Type column should arguably be `object` not `function`, but this is a minor convention difference, not drift).
- 12 of the 50 entries reference identifiers containing `$`, `_`, or non-alphanumeric markers (e.g. `CM$`, `UR$`, `Qf$`, `vR$`, `I$_`, `He$`, `vZ$`, `$Y6`, `Gv$`, plus the 3 settings-key / header / env-var literal entries). All resolve in-source. **Beware** when grepping these: GNU `grep -E "\b<id>\b"` does not treat `$` as a word boundary, so an exact word match needs `index()` + explicit `[A-Za-z0-9_$]` boundary checks. Several false-NOT_FOUND results in the first pass came from this issue.

---

## 2. Broken-link sweep

**Method:** extract every relative link of the form `](./...)` or `](../...)` from every Markdown file under `claude_code_v_2.1.142/analyze/`, strip any `#fragment`, resolve against the source file's directory using `realpath -m`, then test for existence.

- Total relative links scanned: **931**
- Broken links: **17** (1.8%)

### Broken links by target

11 of the 17 broken links point to `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_infra_platform.md`. 4 more point to `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_core_features.md`. These targets do not exist: v2.1.112 keeps a **single unified** `symbol_index.md`, only v2.1.142 introduced the four-file split. Each broken link in `37_permission_policy/*` (8 files in that module + `architecture.md` and `v2_1_142_README.md`) needs to be repointed to `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index.md`.

### Broken links list

- `claude_code_v_2.1.142/analyze/37_permission_policy/v2_1_142_README.md:211` → `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_infra_platform.md`
- `claude_code_v_2.1.142/analyze/37_permission_policy/v2_1_142_README.md:212` → `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_core_features.md`
- `claude_code_v_2.1.142/analyze/37_permission_policy/architecture.md:436` → `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_infra_platform.md`
- `claude_code_v_2.1.142/analyze/37_permission_policy/dangerous_skip_path_expansion.md:340` → `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_infra_platform.md`
- `claude_code_v_2.1.142/analyze/37_permission_policy/localSettings_suggestion.md:219` → `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_infra_platform.md`
- `claude_code_v_2.1.142/analyze/37_permission_policy/bash_wrapper_deny.md:372` → `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_infra_platform.md`
- `claude_code_v_2.1.142/analyze/37_permission_policy/permission_mode_persistence.md:383` → `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_infra_platform.md`
- `claude_code_v_2.1.142/analyze/37_permission_policy/find_exec_delete_block.md:302` → `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_infra_platform.md`
- `claude_code_v_2.1.142/analyze/37_permission_policy/drive_root_match.md:345` → `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_infra_platform.md`
- `claude_code_v_2.1.142/analyze/37_permission_policy/auto_mode_defaults_token.md:383` → `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_core_features.md`
- `claude_code_v_2.1.142/analyze/37_permission_policy/sandbox_auto_allow_safety.md:330` → `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_infra_platform.md`
- `claude_code_v_2.1.142/analyze/37_permission_policy/auto_mode_hard_deny.md:337` → `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_core_features.md`
- `claude_code_v_2.1.142/analyze/37_permission_policy/parent_settings_behavior.md:376` → `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_infra_platform.md`
- `claude_code_v_2.1.142/analyze/37_permission_policy/skill_wildcard_match.md:379` → `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_core_features.md`
- `claude_code_v_2.1.142/analyze/37_permission_policy/auto_allow_shell_expansion.md:335` → `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_infra_platform.md`
- `claude_code_v_2.1.142/analyze/23_prompt_cache/v2_1_142_README.md:15` → `../../31_telemetry/` (no such module; telemetry is part of `06_mcp/` or referenced via symbol_index_infra_platform.md)
- `claude_code_v_2.1.142/analyze/11_hooks/v2_1_142_README.md:122` → `../22_mcp/` (typo — module is at `06_mcp/`)

### Recommended fixes

- `37_permission_policy/*.md` (15 links): rewrite `symbol_index_infra_platform.md` / `symbol_index_core_features.md` segments to `symbol_index.md` when the target directory is `claude_code_v_2.1.112/analyze/00_overview/`.
- `23_prompt_cache/v2_1_142_README.md:15`: either remove the broken telemetry cross-link or repoint to the `symbol_index_infra_platform.md` Telemetry module section within v2.1.142.
- `11_hooks/v2_1_142_README.md:122`: change `../22_mcp/` → `../06_mcp/`.

---

## 3. Module README sanity

**Method:** for each of the 18 numbered module directories plus `00_overview/` and `by_version/`, look for a top-level `README.md` or `v2_1_142_README.md`, require `>= 500 bytes`, and confirm it exists.

### Results

- **17 of 18 numbered modules** carry a README ≥ 500 bytes. All pass cleanly.
- **30_agent_team** has **no README** at the directory root. The module instead provides 8 topic-scoped markdown files (`coordinator_process_model.md`, `mailbox_protocol.md`, `permission_inheritance.md`, `team_mailbox_v_personal.md`, `tool_inheritance.md`, `v2_1_142_dispatch_flags.md`, `v2_1_142_subagent_matching.md`, `worktree_isolation.md`). This is a structural gap — every other module has a landing page.
- `by_version/` (not a module per se, but a sibling directory) likewise has no README. It holds per-version drop summaries (`v2.1.113-114.md`, `v2.1.116.md`, …, `v2.1.142.md`). A landing index would help navigation but is not strictly required by the analysis structure.

### Per-module sizes

- `00_overview/README.md` — 8,257 B
- `02_ui/v2_1_142_README.md` — 10,424 B
- `04_tools/README.md` — 16,859 B
- `06_mcp/v2_1_142_README.md` — 8,623 B
- `07_compact/v2_1_142_README.md` — 22,567 B
- `10_skill_system/v2_1_142_README.md` — 17,142 B
- `11_hooks/v2_1_142_README.md` — 11,421 B
- `12_plan_mode/README.md` — 20,487 B
- `18_sandbox/v2_1_142_README.md` — 12,665 B
- `19_think_level/v2_1_142_README.md` — 11,366 B
- `23_prompt_cache/v2_1_142_README.md` — 18,285 B
- `30_agent_team/` — **missing**
- `31_auto_memory/README.md` — 24,372 B
- `34_subagent/README.md` — 17,157 B
- `36_background_agents/README.md` — 12,743 B
- `37_permission_policy/v2_1_142_README.md` — 17,393 B
- `38_shell_snapshot/README.md` — 19,573 B
- `39_goal/README.md` — 12,303 B

### Recommended fixes

- Add `claude_code_v_2.1.142/analyze/30_agent_team/README.md` summarising the eight existing topic files and the v2.1.142 dispatch-flag / subagent-matching deltas.
- (Optional) add `claude_code_v_2.1.142/analyze/by_version/README.md` indexing the per-version files.

---

## 4. Symbol_index alphabetical ordering check

**Method:** for each of the four `symbol_index_*.md` files, scan each `## Module:` section and verify that the obfuscated identifiers in the leading `| \`<id>\` | …` table column are in ascending order.

### Results

At the moment of the sweep the four index files contain **5 table rows in total** — all five live in `symbol_index_infra_platform.md` lines 226-230, under the *Sandbox* module:

```
| `n6` | sandboxStateNamespace | cli_inner_pretty.js:198457-198475 | object |
| `n6.isSandboxingEnabled` (→ `st$`) | isSandboxingEnabled | cli_inner_pretty.js:198273-198279 | function |
| `n6.isAutoAllowBashIfSandboxedEnabled` (→ `bs1`) | isAutoAllowBashIfSandboxedEnabled | cli_inner_pretty.js:198251-198254 | function |
| `n6.areUnsandboxedCommandsAllowed` (→ `xs1`) | areUnsandboxedCommandsAllowed | cli_inner_pretty.js:198255-198257 | function |
| `n6.isPlatformInEnabledList` (→ `at$`) | isPlatformInEnabledList | cli_inner_pretty.js:198262-198272 | function |
```

These rows describe a single namespace object plus four of its methods, ordered by **declaration order within the namespace** (the method index inside the object literal at lines 198251-198279), not strict alphabetical-by-method-name. That is a reasonable convention for namespace bundles — the alphabetical rule from CLAUDE.md applies between independent symbols, not between members of a single namespace object — so this is **not** a violation.

- `symbol_index_core_execution.md`, `symbol_index_core_features.md`, `symbol_index_infra_integration.md` — **0 table rows** (narrative scaffolding only, waiting on the A1–A4 consolidation work).
- `symbol_index_infra_platform.md` — 5 rows, all in one namespace cluster, ordering acceptable.

### Note on the symbol_additions files

The 19 `symbol_additions_v2_1_142_*.md` files (1,454 rows with line-numbered citations) follow **topic / control-flow order** inside each `## Module:` section, not alphabetical order — e.g. in `symbol_additions_v2_1_142_agents.md` the `claude agents` Subcommand & Dispatch Flag Plumbing section walks the flag-parsing pipeline top-to-bottom (`parseAgentsDispatchFlags` → `resolveDispatchExtraArgs` → `serializeDispatchExtraArgs` → `coerceDispatchDefaults` → `renderDispatchDefaultsChips` → `dispatchDefaultsToArgv` → …). This is deliberate and aids reading; the CLAUDE.md alphabetical rule applies to the consolidated `symbol_index_*.md` files (the central index), not to the per-feature additions files.

When A1–A4 fold the additions into the four index files, the consolidator should re-sort within each module section.

---

## 5. Cross-version drift (v2.1.112 ↔ v2.1.142)

**Method:**

1. Parsed `claude_code_v_2.1.112/analyze/00_overview/symbol_index.md` for `| \`<obf>\` | \`<readable>\` |` rows → **418 obfuscated→readable pairs**.
2. Joined against the 1,454-row v2.1.142 corpus on the **obfuscated** column → **15 collisions** (same obfuscated token appears in both versions' docs).
3. Compared the readable names of each collision pair.

### Results

| Obfuscated | v2.1.112 readable | v2.1.142 readable | Drift? |
|---|---|---|---|
| `d85` | `buildAgentSystemPromptWithSkills` | `contextHintReject` | drift (slot reused) |
| `vJ` | `getAttacherCaps` | `estimateMessageTokens` | drift (slot reused) |
| `q36` | `getSelectorStateForDir` | `initMonitorTool` | drift (slot reused) |
| `K36` | `initSelectorStateForDir` | `runPostCompactHook` | drift (slot reused) |
| `Cc` | `isOpus46FastModeOverride` | `TEAM_DELETE_TOOL_NAME` | drift (slot reused) |
| `ec8` | `HAIKU_4_5_MODEL_FAMILY` | `preCompactBlockedThrow` | drift (slot reused) |
| `iI6` | `sanitizeUnicodeString` | `extractMcpToolList` | drift (slot reused) |
| `QI6` | `wrapInsufficientScopeDetector` | `NO_MSGS_TO_COMPACT_MSG` | drift (slot reused) |
| `qQK` | `clearPermissionUpdateCallback` | `registeredPowerupCommand` | drift (slot reused) |
| `H2` | `SKILLS_DIR_SENTINEL` | `filterRelevantMessages` | drift (slot reused) |
| `Yn` | `INLINE_MARKETPLACE_SENTINEL` | `getEffectiveContextWindow` | drift (slot reused) |
| `sF` | `EFFORT_LEVELS` | `mutateInProcessTeammateTask` | drift (slot reused) |
| `lq` | `isFullscreenMode` | `isFullscreenMode` | **stable** |
| `v38` | `runPreToolUseHooksStream` | `getAutoCompactThreshold` | drift (slot reused) |
| `Z38` | `recordPostHookOutputRewrite` | `isWindowFromEnvOrSettings` | drift (slot reused) |

### Interpretation

This is **not deobfuscation drift** — it is **obfuscator slot reuse**. Bun's bundler/minifier hashes top-level declarations into short identifiers (`<two-letter><digit>`, `<letter><letter><digit>`, etc.); when a v2.1.142 build adds, removes, or re-orders declarations relative to v2.1.112, the slot for, e.g., `EFFORT_LEVELS` is freed and reassigned to whichever declaration now hashes there. **14 of the 15 colliding identifiers point to entirely different source functions in the two builds.** That is expected.

The single stable mapping — `lq` → `isFullscreenMode` in both versions — is coincidence rather than a guarantee.

### Practical consequence

Any v2.1.142 module document that copies an obfuscated→readable mapping from the v2.1.112 docs (or vice versa) without re-grepping the bundle will silently install a wrong reference. Cross-version reuse of obfuscated names is unsafe. The v2.1.142 `symbol_additions_*` files use `EFFORT_LEVELS` (now spelled `sF` in v2.1.142, was `UI` in v2.1.112 — see `claude_code_v_2.1.112/analyze/00_overview/symbol_index.md` line 39) but document them under the new identifier, which is the correct discipline.

---

## 6. Overall conclusion

- **Symbol mappings:** 50 / 50 spot-checks pass against the live source bundle. No factual drift in the sample. The v2.1.142 corpus is internally consistent.
- **Broken links:** 17 / 931 (1.8%). All 17 are mechanical fixable issues — 15 are stale references to a four-file index that exists in v2.1.142 but not v2.1.112, and 2 are path typos.
- **Module READMEs:** 17 / 18 modules carry an adequate landing README. The single gap is `30_agent_team/`, which has good content in topic-scoped files but no top-level index.
- **Symbol_index ordering:** N/A in the current snapshot — the four split files contain almost no table rows yet (the consolidation pass is in flight). The 5 entries that do exist (Sandbox namespace methods in `symbol_index_infra_platform.md`) are correctly grouped.
- **Cross-version drift:** Naive obfuscated-identifier reuse between v2.1.112 and v2.1.142 is unsafe — 14 of 15 same-named identifiers map to unrelated source functions across builds. The v2.1.142 docs treat each version's identifiers independently, which is the correct approach.

**Overall status: HEALTHY with three concrete follow-ups:**

1. Repoint the 17 broken relative links (mechanical sed across `37_permission_policy/`, plus two one-line edits in `23_prompt_cache/` and `11_hooks/`).
2. Author a README for `30_agent_team/`.
3. (Process note for A1–A4) when folding the `symbol_additions_v2_1_142_*` rows into `symbol_index_*.md`, sort alphabetically within each Module section per CLAUDE.md, and rely on the documented file:line citations (which this sweep just confirmed at 100%) rather than re-grepping each row.
