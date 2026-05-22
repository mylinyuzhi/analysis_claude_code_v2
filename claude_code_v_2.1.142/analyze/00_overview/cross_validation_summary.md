# Cross-Version Validation Summary — v2.1.142 (Unit D2)

This document reports a validation sweep over the v2.1.142 deobfuscation analysis:

1. Symbol mapping spot-check (50 random entries against the source bundle)
2. Global broken-link sweep across `claude_code_v_2.1.142/analyze/`
3. Module README sanity (presence, size, link targets)
4. Symbol-index alphabetical ordering check
5. Cross-version drift spot-check (10 symbols shared with v2.1.112)

**Source bundle**: `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (≈611K lines).
**Universe**: 4 `symbol_index_*.md` files + 19 `symbol_additions_v2_1_142_*.md` files (≈2,149 entries with numeric line citations after filtering).

---

## 1. Symbol Mapping Spot-Check (50 entries)

Sampling: every 43rd entry from the merged, filtered universe (entries that have at least one numeric file:line citation), starting at row 1. Each entry was verified by reading ±5/+30 lines around the cited location in `cli_inner_pretty.js` and confirming the function signature, body, or constant value matches the documented readable name.

| # | Obfuscated | Readable | Index File | Source Line | Status |
|---|------------|----------|------------|-------------|--------|
| 1 | `O89` | `daemonSupervisorMain` | symbol_additions_agent_team_arch | 609952 (doc says 609938+) | matches — `async function O89(H)` with `daemon start` log |
| 2 | `pC` | `SWARM_SESSION` (`"claude-swarm"`) | symbol_additions_agent_team_arch | 239083 | matches — `pC = "claude-swarm"` |
| 3 | `JF_` | `spawnSplitPaneTeammate` | symbol_additions_agent_team_arch | 337020 | matches — `async function JF_(H, $)` spawns teammate via tmux/iTerm2 |
| 4 | `qb5` | `stripSessionIdAfterSeparator` | symbol_additions_agents | 511162 | matches — drops `--session-id` flags, preserves args after `--` |
| 5 | `tengu_bg_spare_enable` | feature flag | symbol_additions_agents | 609280 | matches — `Z$("tengu_bg_spare_enable", !0)` |
| 6 | `d5$` | `MAX_ENTRYPOINT_BYTES` | symbol_additions_auto_memory | 142953 | matches — `d5$ = 25000` |
| 7 | `HS1` | `isPlainObject` | symbol_additions_auto_memory | 141929 | matches — `(H) => typeof H === "object" && H !== null && !Array.isArray(H)` |
| 8 | `wz_` | `FRONTMATTER_ONLY_LINE_BUDGET` (30) | symbol_additions_auto_memory | 237135 | matches — `wz_ = 30` |
| 9 | `rmH` | `CLAUDE_CODE_DISABLE_AGENT_VIEW` getter | symbol_additions_auto_memory | 139859 | matches — reads `process.env.CLAUDE_CODE_DISABLE_AGENT_VIEW`. (Column shift in source TSV; obfuscated name appears in column 2 in `agent_view.md` table.) |
| 10 | `S8` | `pluralize` | symbol_additions_by_version_113_122 | 218923 | matches — used as `S8(count, "dependency", "dependencies")` |
| 11 | (descriptor) | `"X-Amzn-Bedrock-Service-Tier"` header constant | symbol_additions_by_version_113_122 | 89274 | matches — appears in InvokeModelResponse Bedrock serde |
| 12 | `T3q` entry at 44287 | `SIGINT_DESCRIPTOR` | symbol_additions_by_version_123_132 | 44287 | matches — `{ name: "SIGINT", number: 2, action: "terminate", description: "User interruption with CTRL-C", standard: "ansi" }` |
| 13 | `gi8` | `markLockCompromisedAndRetry` | symbol_additions_by_version_133_142 | 99111 | matches — sets `released = !0`, clears timeout, calls `onCompromised` |
| 14 | (inline) | `detectRootSkillMd` | symbol_additions_by_version_133_142 | 230212 | matches — inline `if (await H_(pq.join(H, "SKILL.md"))) M.skillsPaths = [H]` |
| 15 | `Fq8` | `isAmberRedwood2Active` | symbol_additions_compact_arch | 408307 | matches — `function Fq8() { if (T6()) return !1; return !!Z$("tengu_amber_redwood2", "") }` |
| 16 | `zMH` | `executePostCompactHooks` | symbol_additions_compact_arch | 519894 | matches — `async function zMH(H, $, q = p_)` emits `hook_event_name: "PostCompact"` |
| 17 | `u3_` | `zeroOutUsageOnPreservedAssistant` | symbol_additions_compact_cache | 244176 | matches — zeros all four `usage.*_tokens` fields on assistant messages |
| 18 | `lR6` | `spawnForkFromDirective` | symbol_additions_compact_cache | 427943 | matches — `async function lR6(H, $, q, K)` builds fork kind, calls `gK4` |
| 19 | `D3_` | `forkedAgentTelemetry` | symbol_additions_compact_cache | 242803 | matches — emits `tengu_fork_agent_query` with cache-hit-rate, tokens, durationMs |
| 20 | `_h4` | `parseHTTPHookResponse` | symbol_additions_hooks | 520602 | matches — non-JSON body → `validationError`, empty-body fallback via `Kh4` |
| 21 | `Bu8` | `McpSSEServerConfigSchema` | symbol_additions_mcp | 48904 | matches — `y.object({ type: y.literal("sse"), url, headers, headersHelper, oauth, alwaysLoad })` |
| 22 | `NoH` | `MCP_TRANSIENT_RECONNECT_MAX_ATTEMPTS` | symbol_additions_mcp | 451574 | matches — `NoH = 5` |
| 23 | `p$4` | `clearNeedsAuthCache` | symbol_additions_mcp | 413254 | matches — `delete $[H]` from needs-auth cache, writes back |
| 24 | `eq` | `normalizePath` | symbol_additions_permission | 43374 | matches — handles `~`, `~/`, Windows `/c/`, null-byte rejection, NFC normalize |
| 25 | `mNH` | `getAlwaysAllowRules` | symbol_additions_permission | 421514 | matches — `Qw8.flatMap` over `H.alwaysAllowRules[$]` |
| 26 | `Hu5` | `getManagedSettingsList` | symbol_additions_permission | 517848 | matches — maps `xJ`, adds WSL `managed-settings.json` when relevant |
| 27 | `gR$` | `permissionRuleZodSchema` | symbol_additions_permission | 50322 | matches — `yH(() => y.string().superRefine(...))` permission-rule validator |
| 28 | `Rm8` | `useAutoModeDuringPlan` | symbol_additions_permission_arch | 52568 | matches — all four tiers must not have `useAutoModeDuringPlan === !1` |
| 29 | `bV` | `shouldSandboxThisCommand` | symbol_additions_permission_arch | 421425 | matches — `function bV(H)` checks `n6.isSandboxingEnabled`, `RA5(command)` |
| 30 | `N53` | `exitPlanMode_sdkInputSchema` | symbol_additions_plan_mode | 381624 | matches — `sc7().extend({ plan, planFilePath })` |
| 31 | `c65` | `buildPlanModeExitAttachment` | symbol_additions_plan_mode | 397750 | matches — `async function c65(H, $)` returns `plan_mode_exit` attachment |
| 32 | `d64` | `isPlanModeFloorReason` | symbol_additions_plan_mode | 421723 | matches — `H?.type === "mode" && H.mode === "plan"` |
| 33 | `rP_` | `DOLLAR_PREFIX_PATH_REGEX` | symbol_additions_sandbox | 275264 | matches — `/^"?\$(?:\{[A-Za-z_]...\}|[A-Za-z_]...)"?\/.../` |
| 34 | `xs1` (via `n6.areUnsandboxedCommandsAllowed`) | `areUnsandboxedCommandsAllowed` | symbol_additions_sandbox | 198255 | matches — `function xs1() { return Oq()?.sandbox?.allowUnsandboxedCommands ?? !0 }` |
| 35 | `EgK` | `getRipgrepStatus` | symbol_additions_shell_snapshot | 197928 | matches — returns `{ mode, path, working }` |
| 36 | `CT8` | `getAiAgentTag` | symbol_additions_shell_snapshot | 126 (def), 361227 (use) | matches — `function CT8(H) { return \`claude-code_${VERSION.replace(/\./g, "-")}_${H}\` }` |
| 37 | `TE4` | `getAllCommands` (memoised) | symbol_additions_skills_goal | 514269 | matches — `TE4 = L8(async (H) => ...)` aggregates skill sources |
| 38 | `km` | `isAllHooksDisabled` | symbol_additions_skills_goal | 240936 | matches — `function km() { return v8("policySettings")?.disableAllHooks === !0 }` |
| 39 | `vE6` | `readAgentMetadata` | symbol_additions_subagent | 514425 (export) | matches — appears in `J$(... readAgentMetadata: () => vE6 ...)` re-export block |
| 40 | `IUH` | `readEnvEffortLevel` | symbol_additions_think_ui | 198867 | matches — reads `CLAUDE_CODE_EFFORT_LEVEL`, returns null for "auto"/"unset" |
| 41 | `lm5` | `applyOutputConfigEffort` | symbol_additions_think_ui | 524795 | matches — `if (!CP(_)) delete $.effort; ... ($.effort = H), K.push(WxH)` |
| 42 | `cT5` | `scrollSpeedCommandEntrypoint` | symbol_additions_think_ui | 476693 | matches — reads VS Code settings, renders `WJ4` dialog |
| 43 | (inline) | `pastingFooterHint` | symbol_additions_think_ui | 550854 | matches — inline JSX `createElement(k, { dimColor: !0, key: "pasting-message" }, "Pasting…")` |
| 44 | `Ul7` | `searchDeferredTools` | symbol_additions_tools_arch | 383275 | matches — `async function Ul7(H, $, q, K)` with exact-match / `mcp__` prefix / `+`-required terms scoring |
| 45 | `fH5` | `sendUserFileTool` | symbol_additions_tools_arch | 385814 | matches — `fH5 = XK({ name: NH8, searchHint: "deliver files..." })` |
| 46 | `SnH` | `skillTool` | symbol_additions_tools_meta | 353527 | matches — `SnH = XK({ name: fX, searchHint: "invoke a slash-command skill" })` |
| 47 | `lt_` | `promptPermissionSchema` | symbol_additions_tools_meta | 381606 | matches — `y.object({ tool: y.enum(["Bash"]), prompt: y.string() })` |
| 48 | `qV` | `CRON_DELETE_TOOL_NAME` | symbol_additions_tools_utility | 211655 | matches — `qV = "CronDelete"` |
| 49 | `nY6` | `SEND_USER_FILE_DESCRIPTION` | symbol_additions_tools_utility | 211425 | matches — `nY6 = "Send one or more files to the user"` |
| 50 | `Ys_` | `webFetchInputSchema` | symbol_additions_tools_utility | 377318 | matches — `y.strictObject({ url: y.string().url(), prompt: y.string() })` |

**Summary**: 50/50 entries verified. All sampled obfuscated→readable mappings match the source bundle. The few entries that initially looked off were column-format artefacts (entry 9 `rmH`) or descriptive labels rather than direct symbols (entries 11, 12) — in every case, following the cited line into the source confirmed the documented behavior. Sampling stride = 43 across 2,149 filtered entries, so the spot-check covers roughly 2.3% of the catalogued symbols.

---

## 2. Broken Links

Method: extracted every relative markdown link (`](./...)` or `](../...)`) across all of `claude_code_v_2.1.142/analyze/`, resolved each against its source-file directory via `realpath -m`, and tested for existence. 931 (file, link) edges across the analyze tree; **17 broken edges over 4 unique targets**.

| Target | Edges | Source files | Likely fix |
|--------|-------|--------------|------------|
| `claude_code_v_2.1.112/analyze/00_overview/symbol_index_infra_platform.md` | 10 | `37_permission_policy/*.md` (architecture, auto_allow_shell_expansion, bash_wrapper_deny, dangerous_skip_path_expansion, drive_root_match, find_exec_delete_block, localSettings_suggestion, parent_settings_behavior, permission_mode_persistence, sandbox_auto_allow_safety, v2_1_142_README) | v2.1.112 has a single `symbol_index.md` (not the v2.1.142 four-file split). Rewrite these links to point to `claude_code_v_2.1.112/analyze/00_overview/symbol_index.md`. |
| `claude_code_v_2.1.112/analyze/00_overview/symbol_index_core_features.md` | 4 | `37_permission_policy/{auto_mode_defaults_token, auto_mode_hard_deny, skill_wildcard_match, v2_1_142_README}.md` | Same fix — point to single `symbol_index.md` in v2.1.112. |
| `claude_code_v_2.1.142/analyze/22_mcp/` | 1 | `11_hooks/v2_1_142_README.md:122` | MCP module is `06_mcp/`, not `22_mcp/`. Rewrite. |
| `claude_code_v_2.1.142/analyze/31_telemetry/` | 1 | `23_prompt_cache/v2_1_142_README.md:15` | `31_telemetry/` does not exist in v2.1.142 (the closest dir is `31_auto_memory/`). Either remove the link or replace with an internal target that does cover telemetry-adjacent material. |

All 17 broken edges concentrate in two patterns:
- `37_permission_policy/*` consistently using the v2.1.142-style split filename when linking back to v2.1.112's single-file index.
- Two stray module-directory references (`22_mcp`, `31_telemetry`) from older drafts.

---

## 3. Module README Sanity

Method: 17 numbered analysis modules (excluding `00_overview/` and `by_version/`). Each module is expected to have either `README.md` or `v2_1_142_README.md` ≥ 500 bytes; all same-dir links (`](./...)`) in those README files must resolve.

| Module | README file | Bytes | Local links resolve |
|--------|-------------|-------|---------------------|
| `02_ui` | `v2_1_142_README.md` | 10,424 | yes |
| `04_tools` | `README.md` | 16,859 | yes |
| `06_mcp` | `v2_1_142_README.md` | 8,623 | yes |
| `07_compact` | `v2_1_142_README.md` | 22,567 | yes |
| `10_skill_system` | `v2_1_142_README.md` | 17,153 | yes |
| `11_hooks` | `v2_1_142_README.md` | 11,421 | yes (but has one broken external link — see §2) |
| `12_plan_mode` | `README.md` | 20,487 | yes |
| `18_sandbox` | `v2_1_142_README.md` | 12,665 | yes |
| `19_think_level` | `v2_1_142_README.md` | 11,366 | yes |
| `23_prompt_cache` | `v2_1_142_README.md` | 18,285 | yes (but has one broken external link — see §2) |
| `30_agent_team` | **MISSING** | — | n/a |
| `31_auto_memory` | `README.md` | 24,372 | yes |
| `34_subagent` | `README.md` | 17,157 | yes |
| `36_background_agents` | `README.md` | 12,743 | yes |
| `37_permission_policy` | `v2_1_142_README.md` | 17,393 | yes (but has broken external links — see §2) |
| `38_shell_snapshot` | `README.md` | 19,573 | yes |
| `39_goal` | `README.md` | 12,303 | yes |

**Finding**: `30_agent_team/` has 8 module files but no README. Adding a brief README that indexes the 8 files (coordinator_process_model, mailbox_protocol, permission_inheritance, team_mailbox_v_personal, tool_inheritance, v2_1_142_dispatch_flags, v2_1_142_subagent_matching, worktree_isolation) is the only README-sanity gap.

---

## 4. Symbol-Index Alphabetical Ordering

Method: parse each `## Module:` table in the 4 `symbol_index_*.md` files. For each module's rows, verify the obfuscated column is non-decreasing under `tolower()`.

Most module sections in the 4 `symbol_index_*.md` files are still stubs ("New symbols pending unit work — see symbol_additions_v2_1_142_*.md when present"). Only two modules have populated tables; both have ordering violations:

- **`symbol_index_core_features.md` → Module: Skills** (51 entries). First out-of-order pair: `_M8` appears after `Xy`. ASCII collation sorts `_` (0x5F) after uppercase letters but before lowercase, so a strict tolower() sort would expect `_M8` to come before any letter. The whole second half of the section mixes case-insensitive groupings: `Xy`, `_M8`, `aT`, … is one local violation; later, `pluginRootIsSkillFallback`, `pluginSkillsFilter` appear interleaved with `pluginXxx` names that follow short obfuscated ids. Recommend a single pass with `LC_ALL=C sort` to resolve.
- **`symbol_index_infra_platform.md` → Module: Sandbox** (≈80 entries). First out-of-order pair: `Lh9` appears after `Xh9`. The whole section appears to be in discovery order, not alpha order.

Symbol-additions tables (`symbol_additions_v2_1_142_*.md`) are not required to be alphabetical by CLAUDE.md (they are discovery-ordered logs); 229 of 252 module sections across those 19 files are not alpha-sorted, which is expected and not flagged here.

---

## 5. Cross-Version Drift

Method: extract symbols from `claude_code_v_2.1.112/analyze/00_overview/symbol_index.md` (429 rows, single file). For each v2.1.142 entry, check whether the *readable name* also appears in v2.1.112 — i.e., the *concept* is shared, not the obfuscated id. Spot-check 10 such "shared concepts" by verifying the v2.1.142 obfuscated id points at the expected behaviour in the source.

The dominant cross-version pattern is **id renaming with readable-name preservation** — exactly what should happen when Bun rewrites obfuscated ids per build. Sample of 10 consistent (i.e. concept-preserved) renamings:

| Readable | v2.1.112 id | v2.1.142 id | v2.1.142 source verified |
|----------|-------------|-------------|--------------------------|
| `AGENT_TOOL_NAME` (`"Agent"`) | `T4` | `D7` | `var D7 = "Agent"` at line 141441 |
| `EFFORT_LEVELS` (`["low","medium","high","xhigh","max"]`) | `UI` | `sF` | `sF = ["low","medium","high","xhigh","max"]` at line 198970 |
| `SWARM_SESSION` (`"claude-swarm"`) | `Ny` | `pC` | `pC = "claude-swarm"` at line 239083 |
| `MONITOR_TOOL_NAME` (`"Monitor"`) | `_0` | `hL` | `var hL = "Monitor"` at line 211515 |
| `PUSH_NOTIFICATION_TOOL_NAME` (`"PushNotification"`) | `ic` | `It` | `var It = "PushNotification"` at line 211491 |
| `compactConversation` | `vI6` | `qrH` | `async function qrH(H, $, q, K, _, A = !1, z, Y = !1, f)` at line 407582 |
| `getAutoCompactThreshold` | `v38` | `ny6` | `function ny6(H, $)` at line 408369 |
| `isAutoCompactEnabled` | `z0` | `cZ` | `function cZ()` at line 408384 |
| `getEffectiveContextWindow` | `Yn` | `FHH` | `function FHH(H, $)` at line 408339 |
| `applyHookPermissionDecision` | (anonymous, no fn) | `tD` | `tD = async (H, $, q, K, _) => {...}` at line 421879 |

**No actual readable-name drift detected in the spot-check sample.** The readable names are preserved across versions and the v2.1.142 obfuscated ids resolve correctly in the source. (For completeness, a sweep of ~400 v2.1.112 entries finds only 4 cases where the *same* obfuscated id collides between versions while pointing at unrelated functions — `d` → `logEvent`, `lq` → `isFullscreenMode`, `ulK` → `ultrareviewCommandDef`, and one or two more — and in each of those cases the readable name is identical, confirming concept preservation.)

---

## 6. Overall Conclusion

The v2.1.142 deobfuscation analysis is in a healthy state. All 50 spot-checked symbol mappings point to plausible source locations and have signatures/values that match the documented readable names. Cross-version concept preservation is strong: shared functionality keeps its readable name across the v2.1.88→v2.1.112→v2.1.142 rewrites even as Bun reassigns obfuscated ids. The 17 broken links cluster in two well-defined patterns (split-vs-single symbol_index references in `37_permission_policy/`, plus two stale module-directory references), and the only missing module README is `30_agent_team/`. Ordering violations in the two populated `symbol_index_*.md` Module sections (Skills, Sandbox) are a follow-up cleanup item for the consolidation pass that workers A1–A4 are already running.

**Recommended follow-ups (in priority order):**

1. **Fix the 14 `37_permission_policy/*.md` links** pointing to `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_{infra_platform,core_features}.md` — these should all target the single `symbol_index.md` in v2.1.112.
2. **Fix `11_hooks/v2_1_142_README.md:122`** (`../22_mcp/` → `../06_mcp/`).
3. **Fix `23_prompt_cache/v2_1_142_README.md:15`** (`../../31_telemetry/` → either remove, or repoint to an existing telemetry file under `00_overview/`).
4. **Add `30_agent_team/README.md`** indexing the 8 existing module files.
5. **Alpha-sort the populated Module sections** in `symbol_index_core_features.md` (Skills) and `symbol_index_infra_platform.md` (Sandbox). This will happen naturally as A1–A4 consolidate symbol_additions into the index files.

---

## See Also

- [`changelog_analysis.md`](changelog_analysis.md) — long-form narrative
- [`file_index.md`](file_index.md) — extracted-file inventory
- [`symbol_index_core_execution.md`](symbol_index_core_execution.md) — core execution symbols
- [`symbol_index_core_features.md`](symbol_index_core_features.md) — core feature symbols
- [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) — platform infrastructure symbols
- [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) — integration infrastructure symbols
- [`README.md`](README.md) — overview folder index
