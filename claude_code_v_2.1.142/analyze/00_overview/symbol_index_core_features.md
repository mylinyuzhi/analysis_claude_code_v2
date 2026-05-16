# Symbol Index — Core Features (v2.1.113 → v2.1.142)

> Symbol additions for v2.1.142 are tracked in 00_overview/symbol_additions_v2_1_142_*.md files. Consolidation into this index is a future pass.

This index catalogs obfuscated → readable mappings for the **core feature** symbols introduced or changed between v2.1.113 and v2.1.142. Scope: Plan Mode, Background Agents, /goal, Todo, Compact, Hooks, Skills, Thinking, Steering, CLI.

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

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

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

## Module: Thinking

Extended thinking, thinking-summary toggle, thinking spinner (rotating, amber warmup), thinking-block redaction handling.

*(New symbols pending unit work — see symbol_additions_v2_1_142_*.md files when present.)*

Known new themes for this window:

- Thinking spinner inline-progressive ("still thinking", "thinking more", "almost done") (v2.1.116)
- 10-sec amber warmup spinner (v2.1.141)
- Redacted thinking block after tool call: API 400 fix (v2.1.136)
- Opus 4.7 + Bedrock IP ARN + thinking disabled: 400 fix (v2.1.117)
- Alt+T (thinking toggle) on macOS terminals without Option-as-Meta (v2.1.132 fix)
- `thinking.enabled` in status-line stdin (v2.1.119)

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
