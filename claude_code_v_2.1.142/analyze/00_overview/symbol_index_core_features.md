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

The user-facing background sessions feature. Covers the React dashboard, dispatch UI, daemon-status formatting, attach-flow. (Daemon protocol itself is in `symbol_index_infra_platform.md`.)

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new symbols (preliminary, full mapping pending):

- `EQ4` — agents dashboard React component
- `H$9`, `Lg6`, `KG$`, `O44`, `RC5`, `T$A`, `T7A`, `W7A`, `WKA`, `ao5`, `bP8`, `qm8` — dashboard sibling helpers (cli_unpack_pretty/decls/functions/, found via `grep -l "claude agents"`)
- `In6`, `vn6`, `kn6`, `jQ4` — dashboard initial state / dispatcher recents

See `symbol_index_core_execution.md` Module: Agents for the CLI subcommand surface.

Known new themes:

- v2.1.139 introduction (`claude agents` Research Preview)
- v2.1.140: Completed-vs-Working state for background-shell agents
- v2.1.141: `--cwd <path>`, empty-placeholder cleanup, 5-min idle retire, onboarding text
- v2.1.142: clock-jump detection, brew-upgrade clean exit, dispatch flags, Apple Terminal color bleed

---

## Module: /goal Command

The session-scoped Stop-hook-as-loop. Live elapsed/turns/tokens overlay (`active_goal` event type).

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new symbols (preliminary):

- `Xk4` — goal-active overlay React component (cli_unpack_pretty/decls/functions/Xk4.js)
- `Xx4` — goal-command helper (cli_unpack_pretty/decls/functions/Xx4.js)
- `T6A` — `/goal` slash command definition (decl with `name: "goal"`)
- `ov5` — `"/goal is only available in trusted workspaces..."` error string
- (related) `"active_goal"` event-type discriminator string

Known new themes:

- v2.1.139 introduction (`/goal <condition>`, interactive/`-p`/Remote Control coverage)
- v2.1.140: clear error when `disableAllHooks`/`allowManagedHooksOnly` is set
- Overlay shows elapsed/turns/tokens

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

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new symbols (preliminary):

- `ks4` — `/claude-api` skill prompt string (cli_inner_pretty.js:593195)
- Plugin SKILL.md at root surfaces as skill (v2.1.142)

Known new themes:

- `/claude-api` skill added (v2.1.142)
- `${CLAUDE_EFFORT}` in skill content (v2.1.120)
- `skillOverrides` setting honored: `off` / `user-invocable-only` / `name-only` (v2.1.129)
- Plugin root SKILL.md (no `skills/` subdir) surfaces as skill (v2.1.142)
- `Skill(name *)` wildcard prefix match (v2.1.139)
- Subagents discover project/user/plugin skills via Skill tool (v2.1.133 fix)
- Skill argument names with regex metacharacters (v2.1.139 fix)

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
