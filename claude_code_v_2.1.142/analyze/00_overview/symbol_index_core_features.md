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
