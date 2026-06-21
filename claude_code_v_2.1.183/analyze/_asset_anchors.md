# 2.1.183 Asset-Extract Anchors (scratch, shared across analysis agents)

Source: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/assets/` (structured extracts from the 2.1.183 build).
Bundle: `cli_inner_pretty.js` (699,346 lines). These are CORROBORATING anchors — every claim must still be verified by reading the bundle declaration.

## Build metadata
- version 2.1.183, build_sha `9d251abdbce0c0a6190d290add83634e0ab481f6`, build_time 2026-06-18T23:04:10Z, bun 1.4.0.
- assets/_summary.json: prompts_total=428, slash_commands=123, env_vars=677, cli_flags=882, feature_gates=1402.

## Tools present (assets/tools/*.md) — NOTE the removals
Agent, AskUserQuestion, Bash, CronCreate/Delete/List, DesignSync, Edit, EnterPlanMode, EnterWorktree, ExitPlanMode, ExitWorktree, Glob, Grep, LSP, ListMcpResourcesTool, NotebookEdit, PowerShell, Projects, PushNotification, REPL, Read, ReadMcpResourceTool, RemoteTrigger, ScheduleWakeup, SendMessage, SendUserFile, SendUserMessage, ShareOnboardingGuide, ShowOnboardingRolePicker, Skill, StructuredOutput, TaskCreate/Get/List/Output/Stop/Update, TestingPermission, TodoWrite, ToolSearch, WaitForMcpServers, WebFetch, WebSearch, Workflow, Write.
- **REMOVED vs 2.1.156: `TeamCreate`, `TeamDelete`** (grep=0 in bundle). Confirms 2.1.178 changelog.
- **NEW vs 2.1.156: `WaitForMcpServers`** (tool). Also web/managed surfaces: Projects, Artifact, SendUserFile, SendUserMessage, ShareOnboardingGuide, ShowOnboardingRolePicker.
- Agent tool property keys: `prompt, name, searchHint, aliases, maxResultSizeChars, description, inputSchema, outputSchema, call, isReadOnly, ...` — `name`/`aliases` = teammate-spawn surface.
- SendMessage: "Send a message to another agent", schema `o$p()`, has `shouldDefer`, `isEnabled`.

## Feature gates (focus features) — from feature_gates.json
**Agent team:** tengu_amber_flint (master gate), tengu_teammate_mode_changed, tengu_teammate_default_model_changed, tengu_transcript_input_to_teammate, tengu_coordinator_mode_switched, tengu_coordinator_panel.
**Workflow:** tengu_workflows_enabled, tengu_workflow_launched, tengu_workflow_completed, tengu_workflow_phase_completed, tengu_workflow_saved, tengu_workflow_keyword, tengu_workflow_keyword_dismissed, tengu_workflow_keyword_restored, tengu_workflow_agent_cap_exceeded, tengu_workflow_budget_cap_exceeded, tengu_workflow_journal_started_hit_respawn, tengu_workflow_usage_warning_accepted, tengu_review_workflow_routing.
**Background:** tengu_background, tengu_background_fork, tengu_background_already_bg, tengu_background_declined, tengu_background_spawn_failed, tengu_exit_background_work_prompt, tengu_bash_command_explicitly_backgrounded, tengu_bash_command_timeout_backgrounded.
**Compact:** tengu_amber_rokovoko (precompute fraction); (redwood2/redwood3 to be re-confirmed in bundle).
**Auto memory:** tengu_passport_quail, tengu_slate_thimble, tengu_moth_copse, tengu_onyx_plover, tengu_auto_dream_{skipped,fired,completed,failed,toggled}, tengu_auto_memory_toggled, tengu_memory_toggled, tengu_agent_memory_loaded, tengu_memory_store_resync_interval_minutes, tengu_memory_bulk_inflate, tengu_memory_threshold_crossed, tengu_memory_survey_event, tengu_sdk_memory_summary, tengu_cinder_plover.
**Scheduling/loop (context):** tengu_kairos_{brief,cron,cron_durable,loop_dynamic,loop_keepalive,loop_persistent,loop_prompt,push_notifications,input_needed_push}.

## Env vars (focus) — from env_vars.json
**Agent team:** CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS.
**Workflow:** CLAUDE_CODE_WORKFLOWS, CLAUDE_CODE_DISABLE_WORKFLOWS.
**Background:** CLAUDE_CODE_FORK_SUBAGENT (NEW — 5-level subagent fork), CLAUDE_SUBAGENT_BG_SHELL_MAX_MS, CLAUDE_BG_BACKEND, CLAUDE_BG_ISOLATION, CLAUDE_BG_SOURCE, CLAUDE_BG_SESSION_PERMISSION_RULES, CLAUDE_BG_MEMORY_TOGGLED_OFF, CLAUDE_BG_AUTH_SNAPSHOT_PATH, CLAUDE_BG_CLAIM_AUTH, CLAUDE_BG_PTY_AUTH, CLAUDE_BG_RENDEZVOUS_SOCK, CLAUDE_BG_RV_AUTH, CLAUDE_BG_SOCKET_TOKENS_PATH, CLAUDE_BG_TCC_DISCLAIMED, CLAUDE_AUTO_BACKGROUND_TASKS.
**Compact:** CLAUDE_CODE_AUTO_COMPACT_WINDOW, CLAUDE_CODE_COLD_COMPACT, DISABLE_AUTO_COMPACT, FALLBACK_FOR_ALL_PRIMARY_MODELS (NEW — fallback-model chain), CLAUDE_CODE_DISABLE_NONSTREAMING_FALLBACK.
**Auto memory:** CLAUDE_MEMORY_STORES, CLAUDE_CODE_REMOTE_MEMORY_DIR (NEW — remote team-stores), CLAUDE_CODE_DISABLE_AUTO_MEMORY, CLAUDE_COWORK_MEMORY_{GUIDELINES,EXTRA_GUIDELINES,INDEX_CONTENT,PATH_OVERRIDE} (NEW cowork-memory surface).

## CLI flags (focus) — from cli_flags.json
--agent-teams, --agent-name, --agent-id, --agent-color, --agent-type, --agent, --agents;
--bg, --bg-pty-host, --bg-spare (NEW?), --fork-session, --fork-point (NEW?), --forks, --include-forks, --reply-on-resume, --resume, --resume-session-at (NEW?);
--fallback-model, --workflow, --worktree.

## Confirmed re-mangling examples (2.1.156 obf -> 2.1.183 obf)
- isAgentTeamsEnabled: `R7`@240766 (156) -> `Sl`@293832 (183); bundler export now `isAgentSwarmsEnabled`. hasAgentTeamsFlag: `Ru5` -> `yqd`@293828.
- => ALL obfuscated names must be re-derived from the 2.1.183 bundle; never reuse a 2.1.156 obf name.
