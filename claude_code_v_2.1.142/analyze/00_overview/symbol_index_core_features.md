# Symbol Index — Core Features (v2.1.113 → v2.1.142)

> Symbol additions for v2.1.142 are tracked in 00_overview/symbol_additions_v2_1_142_*.md files. Consolidation into this index is a future pass.

This index catalogs obfuscated → readable mappings for the **core feature** symbols introduced or changed between v2.1.113 and v2.1.142. Scope: Plan Mode, Background Agents, /goal, Todo, Compact, Hooks, Skills, Thinking / Effort, Steering, CLI.

For other categories see:

- [`symbol_index_core_execution.md`](symbol_index_core_execution.md) — Agent Loop, Tools, LLM API, Agents, Subagent, State
- [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) — MCP, Permissions, Sandbox, Auth, Model, Prompt, Telemetry
- [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) — LSP, Chrome, IDE, UI, Plugin, Code Indexing, Shell Parser, Slash Commands

## File:Line Format

For v2.1.142, the canonical source citation is `cli_unpack_pretty/unknown/<obfuscated>.js` (per-decl isolated file). When surrounding context matters, cite `cli_inner_pretty.js:<line>` instead.

---

## Module: Plan Mode

The `/plan` command, plan-file naming and persistence, plan-mode permission overlay, `ExitPlanMode` re-entry.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- `/plan` and `/plan open` act on existing plan when entering plan mode (v2.1.119 fix)
- Plan mode not re-applied after `ExitPlanMode` within same session (v2.1.132 fix)
- `--permission-mode` flag honored when resuming plan-mode session with `-p --continue`/`--resume` (v2.1.132)
- Plan acceptance dialog wording with `--dangerously-skip-permissions` (v2.1.118 fix)
- Plan mode blocks file writes when matching `Edit(...)` allow rule exists (v2.1.136 fix)
- Auto mode no longer overrides plan mode with "Execute immediately" (v2.1.119 fix)

---

## Module: Background Agents (claude agents)

The user-facing background sessions feature. Covers the React dashboard, the on-demand daemon supervisor, dispatch flag plumbing, attach/detach handoff, and persistent state. The full v2.1.142 mapping table lives in [`symbol_additions_v2_1_142_agents.md`](symbol_additions_v2_1_142_agents.md) — the rows below are the most load-bearing entries; refer to the additions file for telemetry events and the long tail.

### Agent View & Dispatch Surface

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ao5` | `mountFleetView` | cli_inner_pretty.js:569079-569208 | function |
| `EQ4` | `FleetViewDashboard` | cli_inner_pretty.js:567084-… | function |
| `yQ4` | `mountFleetViewFromLeftArrow` | cli_inner_pretty.js:569366-569381 | function |
| `MoH` | `shouldAcceptLeftArrowToAgentView` | cli_inner_pretty.js:435227-435228 | function |
| `$1H` | `setHasUsedAgentsFleet` | cli_inner_pretty.js:435230-435233 | function |
| `fF` | `isAgentsFleetEnabled` | cli_inner_pretty.js:139882-139884 | function |
| `rmH` | `isAgentViewDisabled` | cli_inner_pretty.js:139859-139861 | function |
| `Cq6` | `consumeAgentViewRelaunchMarker` | cli_inner_pretty.js:139921-139924 | function |
| `E5$` | `AGENT_VIEW_RELAUNCH_ENV_KEY` | cli_inner_pretty.js:139925 | constant |
| `og4` | `STATE_LABELS` | cli_inner_pretty.js:569355 | constant |
| `rg4` | `STATE_BUCKET_ORDER` | cli_inner_pretty.js:569354 | constant |
| `So5` | `JOB_KIND_LABELS` | cli_inner_pretty.js:569361 | constant |
| `Go6` | `parseAgentsDispatchFlags` | cli_inner_pretty.js:65-103 | function |
| `gg4` | `coerceDispatchDefaults` | cli_inner_pretty.js:565469-565478 | function |
| `qg6` | `dispatchDefaultsToArgv` | cli_inner_pretty.js:509773-509780 | function |
| `MN4` | `setDispatchExtraArgsForSession` | cli_inner_pretty.js:509767-509769 | function |
| `OG$` | `dispatchExtraArgsState` | cli_inner_pretty.js (near 509790) | variable |

### Daemon Lifecycle

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `O89` | `runDaemonSupervisor` | cli_inner_pretty.js:609952-610186 | function |
| `f89` | `getBinaryIdentity` | cli_inner_pretty.js:609938-609947 | function |
| `tKA` | `binaryIdentityChanged` | cli_inner_pretty.js:609948-609951 | function |
| `aB` | `BgWorkerHandle` | cli_inner_pretty.js:527970-528594 | class |
| `aB.retireIfSettled` | `BgWorkerHandle.retireIfSettled` | cli_inner_pretty.js:527901-527964 | function |
| `aB.shiftGraceClocksForward` | `BgWorkerHandle.shiftGraceClocksForward` | cli_inner_pretty.js:528143-528147 | function |
| `aKA` | `STALE_BINARY_POLL_MS` (60000) | cli_inner_pretty.js:610188 | constant |
| `sKA` | `DAEMON_IDLE_GRACE_DEFAULT_MS` (5000) | cli_inner_pretty.js:610189 | constant |
| `gKA` | `BG_RETIRE_GRACE_DEFAULT_MS` (3600000) | cli_inner_pretty.js:609576 | constant |
| `Ur6` | `BG_RETIRE_TICK_MS` (60000) | cli_inner_pretty.js:609578 | constant |
| `i$9` | `BG_RETIRE_LOW_MEM_GRACE_MS` (60000) | cli_inner_pretty.js:609577 | constant |
| `BB5` | `BG_RECENT_ADOPT_GRACE_MS` (120000) | cli_inner_pretty.js:528605 | constant |
| `pB5` | `BG_EMPTY_IDLE_GRACE_MS` (300000) | cli_inner_pretty.js:528606 | constant |
| `mB5` | `BG_REATTACH_TIMEOUT_MS` (120000) | cli_inner_pretty.js:528604 | constant |

### Worktree Recognition (v2.1.142)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `DE6` | `enterExistingWorktree` | cli_inner_pretty.js:523107-523141 | function |
| `NP8` | `gitWorktreeListPorcelain` | cli_inner_pretty.js:523088-523106 | function |
| `CiH` | `cleanupWorktreeOrPreserveExisting` | cli_inner_pretty.js:523155-523197 | function |
| `eJ$` | `createAgentWorktree` | cli_inner_pretty.js:523198-… | function |

### Dispatch / Spare / Capability Forwarding

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `jN4` | `claimSpareOrColdDispatch` | cli_inner_pretty.js:509877-509921 | function |
| `yP8` | `coldDispatchFromTemplate` | cli_inner_pretty.js:509781-509834 | function |
| `RN4` | `flagsWithoutPositional` | cli_inner_pretty.js:511207-511225 | function |
| `_b5` | `BG_FLAGS_BOOLEAN` | cli_inner_pretty.js:511327-511332 | constant |
| `Pg6` | `BG_FLAGS_WITH_ARGUMENT` | cli_inner_pretty.js:511283-511326 | constant |
| `vJ` | `getAttacherCaps` | cli_inner_pretty.js:2686-2688 | function |
| `aV8` | `setAttacherCaps` | cli_inner_pretty.js:2689-2691 | function |
| `xy` | `resolvePreferredEditor` | cli_inner_pretty.js:445808-445810 | function |
| `AL8` | `isClaudeInChromeEnabled` | cli_inner_pretty.js:493305-493314 | function |
| `HG8` | `jobMatchesCwd` | cli_inner_pretty.js:565822-565825 | function |
| `e0$` | `spawnOriginDir` | cli_inner_pretty.js:566055-566059 | function |

See [`symbol_additions_v2_1_142_agents.md`](symbol_additions_v2_1_142_agents.md) for the full table (telemetry events, persistence schema, subagent-type matcher, completed-vs-working classifier).

See `symbol_index_core_execution.md` Module: Agents for the CLI subcommand surface.

Known new themes:

- v2.1.139 introduction (`claude agents` Research Preview — promoted from the ant-only `agentsPlatform` subcommand of v2.1.88)
- v2.1.140: Completed-vs-Working state for background-shell agents; subagent_type slug normalization
- v2.1.141: `--cwd <path>`, empty-placeholder cleanup, 5-min idle retire, onboarding text
- v2.1.142: clock-jump detection (`shiftGraceClocksForward`), brew-upgrade clean exit (`tKA`), pre-existing worktree recognition (`DE6`), dispatch flags (`--add-dir`/`--settings`/`--mcp-config`/`--plugin-dir`/`--strict-mcp-config`/`--permission-mode`/`--model`/`--effort`/`--dangerously-skip-permissions`), `$EDITOR` forwarding via `attacher-caps`, Chrome shim isolation, `--dangerously-skip-permissions` survives retire/wake (via `RN4` + `_b5`)

---

## Module: /goal Command

The session-scoped Stop-hook-as-loop. `/goal <condition>` installs a Stop hook with the condition as its `prompt`. After every assistant turn the Stop-hook chain evaluates the hook; if it `hook_success`-es without a block, the goal auto-clears and emits `tengu_goal_achieved`; if it `blockingError`s, iterations++ and the model continues. Live elapsed/turns/tokens overlay panel (`Xk4`) plus a `◎ /goal active` status-bar badge (`Xx4`).

Detailed source-of-truth list is in [`symbol_additions_v2_1_142_skills_goal.md`](symbol_additions_v2_1_142_skills_goal.md) section "Module: /goal command".

### Goal command surface

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BR5` | `goalCommand` (interactive `local-jsx` variant) | cli_inner_pretty.js:507850-507857 | object |
| `pR5` | `goalNonInteractive` (non-interactive `local` variant, opts into Remote Control) | cli_inner_pretty.js:507858-507869 | object |
| `UR5` | `goalDefaultExport` (= `BR5`) | cli_inner_pretty.js:507870 | object |
| `uR5` | `interactiveGoalCall` (the `BR5.call` body) | cli_inner_pretty.js:507789-507806 | function |
| `mR5` | `goalNonInteractiveCall` (the `pR5.call` body) | cli_inner_pretty.js:507815-507839 | function |
| `Hx5` | `goalDefaultRef` (re-exported alias for `BR5`) | cli_inner_pretty.js:514106 | reference |
| `Ng6` | `goalNonInteractiveRef` (re-exported alias for `pR5`) | cli_inner_pretty.js:514107 | reference |

### Goal core (xaH module)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `CaH` | `registerGoal` (installs the Stop hook + records `activeGoal`) | cli_inner_pretty.js:486719-486732 | function |
| `baH` | `clearGoal` (removes the Stop hook + clears `activeGoal`) | cli_inner_pretty.js:486734-486745 | function |
| `Xp6` | `goalGateCheck` (hooks-disabled / trust-workspace precondition) | cli_inner_pretty.js:486714-486718 | function |
| `gX8` | `getStopHookPrompts` (reads active Stop hooks with empty matcher) | cli_inner_pretty.js:486706-486713 | function |
| `oP4` | `getLastGoalAttachment` (walks messages newest-first for last achieved goal_status) | cli_inner_pretty.js:486693-486702 | function |
| `aP4` | `formatHookReason` (= `` `Last check: ${...}` ``) | cli_inner_pretty.js:486703-486705 | function |
| `sP4` | `goalStatusAttachment` (factory; sentinel attachments for register/clear) | cli_inner_pretty.js:486747-486753 | function |
| `UX8` | `isClearKeyword` (lower-cases and tests `rv5`) | cli_inner_pretty.js:486690-486692 | function |
| `FX8` | `STOP_HOOK_GOAL_PROMPT` (priming meta-message factory) | cli_inner_pretty.js:486758-486759 | function |
| `ov5` | `GOAL_TRUST_GATE_MSG` (`"/goal is only available in trusted workspaces..."`) | cli_inner_pretty.js:486760 | constant |
| `av5` | `GOAL_HOOKS_GATE_MSG` (`"/goal can't run while hooks are disabled..."`) | cli_inner_pretty.js:486761-486762 | constant |
| `rv5` | `GOAL_CLEAR_KEYWORDS` (`Set(["clear","stop","off","reset","none","cancel"])`) | cli_inner_pretty.js:486771 | constant |
| `RaH` | `MAX_GOAL_CONDITION_CHARS` (= `4000`) | cli_inner_pretty.js:486756 | constant |

### Goal precondition predicates

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `km` | `isAllHooksDisabled` (reads `policySettings.disableAllHooks`) | cli_inner_pretty.js:240936-240938 | function |
| `rw` | `isAllowManagedHooksOnly` (reads policy OR user-tier `disableAllHooks`) | cli_inner_pretty.js:240930-240935 | function |
| `T6` | `isTrustedWorkspace` (workspace trust check) | (settings module) | function |
| `_5` | `isTrustImplicitlyAccepted` (sandbox/projects-map bypass) | cli_inner_pretty.js:140015-140017 | function |
| `I6` | `isRemoteWorkspace` (= `caps.workspace === "remote"`) | cli_inner_pretty.js:3104-3106 | function |

### Goal resume (Kn6 module)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Cr5` | `restoreGoalFromTranscript` (gated re-register at `--resume` time) | cli_inner_pretty.js:564153-564164 | function |
| `Eg4` | `findGoalToRestore` (walks messages newest-first for unmet goal_status) | cli_inner_pretty.js:564144-564152 | function |

### Goal UI (overlay + badge)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Xk4` | `GoalOverlayPanel` (active/achieved/none three-flavour dialog) | cli_inner_pretty.js:507612-507742 | function (React) |
| `UF6` | `LabeledField` (the "Label: value" row used by the dialog) | cli_inner_pretty.js:507749-507768 | function (React) |
| `xR5` | `activeGoalSelector` (= `H.activeGoal`) | cli_inner_pretty.js:507746-507748 | function |
| `bR5` | `incrementHelper` (= `H + 1`; force-refresh helper for the dialog) | cli_inner_pretty.js:507743-507745 | function |
| `Xx4` | `GoalActiveBadge` (status-bar `◎ /goal active` React component) | cli_inner_pretty.js:544426-544501 | function (React) |
| `dg5` | `setAtSelector` (= `H.activeGoal?.setAt`; gate the badge's re-render) | cli_inner_pretty.js:544508-544510 | function |
| `Ug5` | `BADGE_PULSE_PERIOD_MS` (= `4000`) | cli_inner_pretty.js:544514 | constant |
| `Fg5` | `BADGE_DOT_INTERVAL_FRAC` (= `0.18`) | cli_inner_pretty.js:544515 | constant |
| `V28` | `BADGE_DOTS` (= `20`) | cli_inner_pretty.js:544513 | constant |

### Goal Stop-hook resolution loop (inline block in main chain)

| Location | Behaviour |
|----------|-----------|
| cli_inner_pretty.js:391744-391769 | Stop-hook `hook_success` -> matches `activeGoal.condition` to `hook.prompt` -> remove hook, yield `active_goal`-undefined, yield `goal_status` met=true with stats, emit `tengu_goal_achieved` |
| cli_inner_pretty.js:391778-391786 | Stop-hook `blockingError` matching activeGoal -> yield `active_goal` with iterations++ + lastReason, yield `goal_status` met=false |

### Goal telemetry events

| Event | Where |
|-------|-------|
| `tengu_stop_hook_added` (`via: "goal"`) | cli_inner_pretty.js:486729 |
| `tengu_stop_hook_removed` (`via: "goal"`) | cli_inner_pretty.js:486743 |
| `tengu_goal_achieved` | cli_inner_pretty.js:391761 |
| `tengu_goal_restored_on_resume` | cli_inner_pretty.js:564163 |
| `goal_set` failure metric (`code`: `hooks_gate` / `trust_gate` / `too_long`) | cli_inner_pretty.js:486721, 486756 callers |

Known themes:

- v2.1.139 introduction (`/goal <condition>`, interactive `local-jsx` + `-p`/SDK/Remote Control `local`)
- v2.1.140: pre-gate `goalGateCheck` for `disableAllHooks`/`allowManagedHooksOnly`/trust, mirrored in resume path
- Overlay shows elapsed/turns/tokens with 1-second tick; status-bar pulse over 4-second 20-step palette

---

## Module: Todo

TodoWrite tool + TaskList tool. (Note: the v2.1.112 baseline had these — this section captures only deltas.)

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- `TaskList` returning tasks in arbitrary filesystem order instead of sorted by ID (v2.1.119 fix)

---

## Module: Compact

Autocompact dispatcher, microcompact stub, context-collapse persistence, summarize-up-to-here, prompt cache interaction.

Full delta mappings live in [`symbol_additions_v2_1_142_compact_arch.md`](symbol_additions_v2_1_142_compact_arch.md) (autocompact pipeline, prompts, hooks) and [`symbol_additions_v2_1_142_compact_cache.md`](symbol_additions_v2_1_142_compact_cache.md) (reactive compact, partial compact, telemetry). The canonical functions/constants for cross-doc lookup are summarized below.

### Autocompact (proactive lane)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Fo7` | autoCompactGenerator | cli_inner_pretty.js:408400-408445 | function |
| `qrH` | compactConversation | cli_inner_pretty.js:407582-407767 | function |
| `o45` | shouldAutoCompactNow | cli_inner_pretty.js:408389-408399 | function |
| `cZ` | isAutoCompactEnabled | cli_inner_pretty.js:408384-408388 | function |
| `Wy6` | computeRapidRefillStreak | cli_inner_pretty.js:408349-408351 | function |
| `vP$` | computeAutoCompactThreshold | cli_inner_pretty.js:408269-408274 | function |
| `MH4` | computeContextLevel | cli_inner_pretty.js:408278-408289 | function |
| `o47` | isAboveAutoCompactThreshold | cli_inner_pretty.js:408377-408383 | function |
| `FHH` | getEffectiveContextWindow | cli_inner_pretty.js:408339-408344 | function |
| `di` | resolveAutoCompactWindowSource | cli_inner_pretty.js:408320-408334 | function |
| `Bn` | postCompactCleanup | cli_inner_pretty.js:243907-243920 | function |
| `DH4` | MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES (=3) | cli_inner_pretty.js:408486 | constant |
| `PI6` | RAPID_REFILL_TURN_WINDOW (=3) | cli_inner_pretty.js:408487 | constant |
| `NO8` | MAX_CONSECUTIVE_RAPID_REFILLS (=3) | cli_inner_pretty.js:408488 | constant |
| `Py6` | AUTOCOMPACT_THRASHING_MESSAGE | cli_inner_pretty.js:408513 | constant |
| `YH4` | AUTOCOMPACT_BUFFER_TOKENS | cli_inner_pretty.js:408290 | constant |

### Reactive compact (1M-context overflow lane, v2.1.113+)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Y97` | reactiveCompactDispatcher | cli_inner_pretty.js:243951-244055 | function |
| `Ej6` | runReactiveCompact | cli_inner_pretty.js:244056-244092 | function |
| `f97` | finalizeReactiveCompact | cli_inner_pretty.js:244093-244175 | function |
| `uq8` | iterateReactiveSummarize | cli_inner_pretty.js:243253-243336 | function |
| `X3_` | summarizeReactiveAttempt | cli_inner_pretty.js:243188-243241 | function |
| `B47` | seedPreservedCount | cli_inner_pretty.js:243242-243248 | function |
| `L3_` | nextStepFromGap | cli_inner_pretty.js:243249-243252 | function |
| `H4H` | isReactiveCompactEligible | cli_inner_pretty.js:243938-243944 | function |
| `mUH` | extractPTLTokenGap | cli_inner_pretty.js (referenced) | function |
| `n47` | startPrecomputedCompact | cli_inner_pretty.js:243450-243540 | function |
| `i47` | swapWithPrecomputeIfReady | cli_inner_pretty.js:243599-243630 | function |

### Compact prompts (v2.1.139 sensitive-instructions clause)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `bq8` | compactFullPrompt | cli_inner_pretty.js:242949-243062 | function |
| `m47` | compactPartialPrompt | cli_inner_pretty.js:242856-242948 | function |
| `j3_` | compactRecentBodyConst | cli_inner_pretty.js:243108-243181 | constant |
| `u47` | compactNoToolsReminder | cli_inner_pretty.js:243182-243186 | constant |
| `Yj6` | lazyInitCompactBodies | cli_inner_pretty.js:243107 | function |
| `J3_` | stripAnalysisAndRewrapSummary | cli_inner_pretty.js:243063-243084 | function |
| `fM$` | wrapSummaryAsContinuationPrompt | cli_inner_pretty.js:243085-243105 | function |

### Partial compact + /rewind (v2.1.141 "Summarize up to here", v2.1.133 silent abort)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_H4` | partialCompact | cli_inner_pretty.js:407768-407934 | function |
| `AH4` | partialCompactErrorNotice | cli_inner_pretty.js:407935-407951 | function |
| `Gb` | USER_ABORT_PATTERN | cli_inner_pretty.js:408217 | constant |
| `ErH` | NO_MESSAGES_PATTERN | cli_inner_pretty.js:408213 | constant |
| `$rH` | PRECOMPACT_BLOCKED_PREFIX | cli_inner_pretty.js:408218 | constant |
| `tF` | PROMPT_TOO_LONG_PREFIX | cli_inner_pretty.js:200302 | constant |

### Hooks (PreCompact blocking added v2.1.105)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ug` | executePreCompactHooks | cli_inner_pretty.js:519855-519893 | function |
| `zMH` | executePostCompactHooks | cli_inner_pretty.js:519894-519912 | function |
| `FM8` | throwOnPreCompactHookBlock | cli_inner_pretty.js:407549-407558 | function |

Known new themes for this window:

- Compaction prompt asks model to preserve sensitive user instructions (v2.1.139)
- "Summarize up to here" added to Rewind menu (v2.1.141)
- Reactive compaction: first summarize attempt seeds from original request's overflow size (v2.1.142)
- Esc during conversation compaction no longer shows spurious "Error compacting" (v2.1.133)
- `/model` in one session silently changing autocompact threshold in others (v2.1.141 fix)
- Skills invoked before auto-compaction being re-executed against next user message (v2.1.119 fix)
- Cache-miss warning after `/clear` or compaction (v2.1.129 fix)
- Compacting resumed long-context session "Extra usage required" (v2.1.113 fix)

---

## Module: Hooks

Hook event dispatch (PreToolUse, PostToolUse, PreCompact, PostCompact, UserPromptSubmit, SessionStart, Setup, SubagentStart/Stop, Stop, ConfigChange, PermissionRequest, PermissionDenied), hook-config schema, hook execution surface.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- `type: "mcp_tool"` hooks (v2.1.118)
- `duration_ms` in PostToolUse / PostToolUseFailure (v2.1.119)
- `hookSpecificOutput.updatedToolOutput` for non-MCP tools (v2.1.121)
- `effort.level` JSON field + `$CLAUDE_EFFORT` env var (v2.1.133)
- `args: string[]` exec form (v2.1.139)
- `continueOnBlock` config for PostToolUse (v2.1.139)
- `terminalSequence` field for desktop notifications / window titles / bells (v2.1.141)
- Hook misconfiguration error for prompt/agent hooks on SessionStart/Setup/SubagentStart (v2.1.142)
- Status-line stdin includes `effort.level` and `thinking.enabled` (v2.1.119)
- `PermissionRequest` `updatedInput` re-check against deny rules (v2.1.110, also revisited in v2.1.113)
- Hooks now run without terminal access (v2.1.139 — prevents prompt corruption)
- Agent-type hooks: messages-required error for non-Stop/SubagentStop events (v2.1.118)
- `transcript_path` post-EnterWorktree cwd switch (v2.1.141 fix)
- ConfigChange spurious hook firing from symlinked settings (v2.1.140 fix)

---

## Module: Skills

Skill registry, frontmatter parsing, `${CLAUDE_EFFORT}` interpolation, model-invocation gating, skill-tool dispatch, plugin-skill bridging.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Am7 | isUserTypedSlashCommandInTurn | cli_inner_pretty.js:353362 | function |
| Ax5 | getSkillsFromAllSources | cli_inner_pretty.js:513752 | function |
| Dh6 | loadPluginSkills | cli_inner_pretty.js (referenced from Ax5) | function |
| D9H | applyFallbackDeduplication | cli_inner_pretty.js:513829 | function |
| H2 | SKILLS_DIR_SENTINEL ("skills-dir") | cli_inner_pretty.js:218312 | constant |
| H_ | pathExists | cli_inner_pretty.js (used by U88 skills fallback) | function |
| iP8 | isSkillHiddenFromUser | cli_inner_pretty.js:513855 | function |
| kB6 | SKILL_OVERRIDE_VALUES | cli_inner_pretty.js:477208 | constant |
| kg | validatePluginComponentPaths | cli_inner_pretty.js:229997 | function |
| KI6 | loadSkillDirCommands | cli_inner_pretty.js (referenced from Ax5) | function |
| ks4 | /claude-api skill prompt string | cli_inner_pretty.js:593195 | constant |
| nX5 | scanSkillsPaths | cli_inner_pretty.js:457453 | function |
| N7H | formatSkillSourceForOtel (skillSourceMetadata) | cli_inner_pretty.js:218534 | function |
| oT5 | resolveSkillOverrideLock | cli_inner_pretty.js:476885 | function |
| aT5 | resolveProjectSkillOverride | cli_inner_pretty.js:476894 | function |
| Qf$ | emitSkillActivatedOtel | cli_inner_pretty.js:218520 | function |
| r__ | manifestPathsCoverDefaultFolder | cli_inner_pretty.js:230034 | function |
| rT5 | SKILL_OVERRIDE_STYLES | cli_inner_pretty.js:477209 | constant |
| sT5 | SkillRow | cli_inner_pretty.js:477137 | function |
| st | getSkillOverride | cli_inner_pretty.js:513847 | function |
| TE4 | getAllCommands | cli_inner_pretty.js:514269 | function |
| U88 | loadPluginFromDir | cli_inner_pretty.js:230049 | function |
| uFH | substituteArgsInPrompt | cli_inner_pretty.js:217479 | function |
| uJ4 | SkillsDialog | cli_inner_pretty.js:476909 | function |
| VE4 | isSkillModelInvocationDisabled | cli_inner_pretty.js:513851 | function |
| Vx | escapeRegex | cli_inner_pretty.js:9491 | function |
| WTH | resolvePluginPathRelative | cli_inner_pretty.js:229990 | function |
| xJ4 | formatSkillSource | cli_inner_pretty.js:476897 | function |
| XG$ | shouldListSkillForModel | cli_inner_pretty.js:513858 | function |
| z36 | parseArgumentString | cli_inner_pretty.js:217462 | function |
| zG4 | getBundledSkills | cli_inner_pretty.js (referenced from Ax5) | function |

Known new themes:

- `/claude-api` skill added (v2.1.142)
- `${CLAUDE_EFFORT}` in skill content (v2.1.120) — `aT(model, effort)` lookup, also exposed to hooks and Bash via `CLAUDE_EFFORT` env var
- `skillOverrides` setting honored: `off` / `user-invocable-only` / `name-only` (v2.1.129) — four-tier resolution via `oT5`/`aT5`
- Plugin root SKILL.md (no `skills/` subdir) surfaces as skill (v2.1.142) — gated by `P !== H2` (not the auto-loaded `skills-dir` marketplace)
- `skills: ["./"]` valid in plugin manifest (v2.1.142) — `kg` resolves plugin root, post-filter accepts root for non-`skills-dir` plugins
- `plugin.json skills` shadowing default `skills/` reports `folder-shadowed-by-manifest` advisory (v2.1.136)
- File-path entries in `skills:` produce `component-load-failed` error (v2.1.136) — via `kg(..., expectDir=true)`
- `Skill(name *)` wildcard prefix match (v2.1.139) — matcher accepts both `:*` and ` *` suffixes
- Subagents discover project/user/plugin skills via Skill tool (v2.1.133 fix) — unified loader `Ax5`
- Skill argument names with regex metacharacters (v2.1.139 fix) — `Vx` escape applied in `uFH`
- `claude_code.skill_activated` OTel event (v2.1.126) — `Qf$` emits one per skill activation with `invocation_trigger` of `user-slash`/`claude-proactive`/`nested-skill`
- `/skills` dialog type-to-filter (v2.1.121) — filters by name, description, source label

---

## Module: Thinking / Effort

Extended thinking, thinking-summary toggle, thinking spinner (rotating, amber warmup), thinking-block redaction handling, effort-level resolution and plumbing.

For the full mapping see [symbol_additions_v2_1_142_think_ui.md](symbol_additions_v2_1_142_think_ui.md) (effort resolver, slider, hook/env plumbing, Bedrock-ARN resolution, byte-watchdog). Key symbols carried forward from v2.1.112 with new obfuscation:

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `CP` | `modelSupportsEffort` (was `QI` in v2.1.112) | cli_inner_pretty.js:198795-198811 | function |
| `fY$` | `modelSupportsMaxEffort` (was `Ct6` in v2.1.112) | cli_inner_pretty.js:198812-198828 | function |
| `OY$` | `modelSupportsXhigh` (was `bt6` in v2.1.112) | cli_inner_pretty.js:198829-198847 | function |
| `Z3H` | `resolveAppliedEffort` (was `wy6` in v2.1.112) | cli_inner_pretty.js:198874-198884 | function |
| `$e$` | `getDefaultEffortForModel` (was `IF1` in v2.1.112; simplified to 2 lines in v2.1.117) | cli_inner_pretty.js:198951-198954 | function |
| `IUH` | `readEnvEffortLevel` (was `Zj6` in v2.1.112) | cli_inner_pretty.js:198867-198870 | function |
| `aT` | `resolveEffortForApi` (single source-of-truth for `output_config.effort`, hook input, `CLAUDE_EFFORT` env) | cli_inner_pretty.js:198908-198911 | function |
| `lm5` | `applyOutputConfigEffort` (sets `output_config.effort` gated on `modelSupportsEffort`) | cli_inner_pretty.js:524795-524803 | function |
| `He$` | `isOpus47LaunchDefaultActive` (model is opus-4-7 AND !unpinOpus47LaunchEffort) | cli_inner_pretty.js:198871-198873 | function |
| `py5` | `EffortSliderComponent` (env-aware initial index, v2.1.132) | cli_inner_pretty.js:496927-497117 | component |
| `Ey5` | `applyEffortLevel` (typed-arg; surfaces env-override conflict, v2.1.132) | cli_inner_pretty.js:496721-496749 | function |
| `yy5` | `clearEffortLevel` (`/effort auto` env-conflict message, v2.1.132) | cli_inner_pretty.js:496757-496769 | function |
| `k7` | `resolveModelCanonicalId` (ARN→backing-model path added v2.1.122) | cli_inner_pretty.js:97419-97427 | function |
| `abH` | `loadBedrockInferenceProfileBackingModel` (async cache, v2.1.122) | cli_inner_pretty.js:90502-90523 | function |
| `TV1` | `wrapStreamWithByteWatchdog` (cancel-path clearAllTimers added v2.1.139) | cli_inner_pretty.js:128281-128392 | function |
| `$l$` | `StreamIdleTimeoutError` | cli_inner_pretty.js:128470-128485 | class |

Known new themes for this window:

- Thinking spinner inline-progressive ("still thinking", "thinking more", "almost done") (v2.1.116)
- 10-sec amber warmup spinner (v2.1.141)
- Redacted thinking block after tool call: API 400 fix (v2.1.136)
- Opus 4.7 + Bedrock IP ARN + thinking disabled: 400 fix (v2.1.117)
- Alt+T (thinking toggle) on macOS terminals without Option-as-Meta (v2.1.132 fix)
- `thinking.enabled` in status-line stdin (v2.1.119)
- Default Pro/Max effort on Opus 4.6 / Sonnet 4.6: `medium` → `high` (v2.1.117)
- `effort.level` in hook input JSON + `CLAUDE_EFFORT` env var (v2.1.133)
- `/effort` slider opens at env-reflected position; env-override conflict messages (v2.1.132)
- Bedrock application-inference-profile ARN now resolves to backing model so `/model` Effort row appears + `output_config.effort` is sent (v2.1.122)
- Stream-idle watchdog rearms on clock-jump (Mac sleep/wake) and `cancel()` clears timers (v2.1.126, v2.1.139)

See [`../19_think_level/v2_1_142_README.md`](../19_think_level/v2_1_142_README.md) for the end-to-end effort plumbing diagram.

---

## Module: Steering

Background/foreground task scheduling, `/loop`, `/schedule`, `/babysit-prs`, recurring routines, cron, `RemoteTrigger`.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- `/routines` slash command (v2.1.142)
- `/loop` Esc cancels pending wakeups (v2.1.113)
- `/loop` no longer schedules redundant wakeups for tasks that notify on completion (v2.1.140 fix)
- One-shot scheduled tasks countdown vs. recurring (v2.1.113 fix)

---

## Module: CLI

CLI argparser, subcommand router, top-level flags, environment-variable parsing.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- New `claude agents` flags (v2.1.142): `--add-dir`, `--settings`, `--mcp-config`, `--plugin-dir`, `--permission-mode`, `--model`, `--effort`, `--dangerously-skip-permissions`
- `--from-pr` supports GitLab/Bitbucket/GitHub Enterprise (v2.1.119)
- `--plugin-url <url>` (v2.1.129)
- `claude ultrareview [target]` non-interactive (v2.1.120)
- `claude plugin details <name>` / `claude plugin tag` / `claude plugin prune` (v2.1.118/121/139)
- `claude project purge [path]` (v2.1.126)
- `CLAUDE_CODE_FORCE_SYNC_OUTPUT=1`, `CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE`, `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY=1` (v2.1.129)
- `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1` (v2.1.142)
- `ANTHROPIC_WORKSPACE_ID` (v2.1.141)
- `ANTHROPIC_BEDROCK_SERVICE_TIER` (v2.1.122)
- `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1` (v2.1.132)
- `CLAUDE_CODE_SESSION_ID` (v2.1.132)
- `DISABLE_UPDATES` (v2.1.118)

---

## See Also

- [`changelog_analysis.md`](changelog_analysis.md) — long-form narrative
- [`changelog_to_code_map.md`](changelog_to_code_map.md) — per-bullet pointers
- [`file_index.md`](file_index.md) — extracted-file inventory
- The v2.1.112 baseline lives at `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index.md`
