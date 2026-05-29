# Subagent Subsystem (`34_subagent`) — v2.1.142

## What is a Subagent?

A **subagent** in Claude Code is an *independent agent loop* that runs inside the same process as its parent and is addressable by `agentType` (a `slug` like `code-reviewer`). It is *not* the same thing as a teammate in the multi-agent-teams subsystem (`30_agent_team/`), even though both spawn auxiliary agents.

| Dimension | Subagent (this module) | Teammate (30_agent_team) |
|-----------|------------------------|--------------------------|
| **Spawn mechanism** | `Agent` tool from the main loop, or `--agent` flag on CLI, or `CLAUDE_CODE_FORK_SUBAGENT=1` env | `Agent` tool with `name`+`team_name`, or `SpawnTeammate`; tmux pane / tmux window / in-process |
| **Identity** | UUID `agentId`; addressed by `agentType` | UUID `teammateId`; addressed by `name` within `team_name` |
| **Lifetime** | Tied to the parent turn; result returned to parent as `tool_result`. Async-background subagents continue across parent turns | Long-running; outlives the spawning turn until the user dismisses or kills it |
| **Communication** | One-shot: parent waits on `tool_result`. (Or polls progress for `run_in_background`.) | Bidirectional: file-based mailbox (`SendMessage`), shutdown_request, permission_request |
| **IPC channel** | In-memory promise chain; transcript JSONL on disk | File-locked JSON inbox/outbox under `~/.claude/<team>/inboxes/<agent>.json` |
| **Transcript** | Sidechain JSONL: `~/.claude/sidechains/<agentId>.jsonl` | Per-teammate session under the team workspace |
| **Plan-mode handoff** | Inherited from parent permissionMode (unless agent frontmatter pins it) | Explicit `plan_mode_required` flag in spawn; `awaitingPlanApproval` gate |
| **Hooks fired** | `SubagentStart`, `SubagentStop`, and `mainThreadAgentHooks` for `--agent` | `TeammateIdle`, `TaskCompleted`, plus the standard subagent hooks |
| **Gating** | Always on (subagents) + `CLAUDE_CODE_FORK_SUBAGENT` for the implicit fork path | `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` + `tengu_amber_flint` feature flag |

In short: **a subagent is a worker, a teammate is a peer.** Subagents return a result through the tool-call protocol; teammates collaborate over a long-lived IPC channel. The two subsystems share some implementation surface (`runAgent`, agent definitions, `AGENT_COLOR_PALETTE`), but they have different ownership models and different transcripts on disk.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_subagent.md](../00_overview/symbol_additions_v2_1_142_subagent.md) - v2.1.142 subagent subsystem (this module's symbols)
> - [symbol_additions_v2_1_142_agents.md](../00_overview/symbol_additions_v2_1_142_agents.md) - v2.1.142 background-agents / agent view
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent, Tools, Subagent)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks, Skills, Compact)

Key functions in this README:
- `runAgent` (`Vb`) - the streaming generator that runs a subagent turn (cli_inner_pretty.js:393099-393434) — see [runtime_execution.md](./runtime_execution.md)
- `runResumedSubagent` (`uiH`) - resume entrypoint that threads `resumePersistedCount` (cli_inner_pretty.js:386626-386766)
- `isForkSubagentEnabled` (`W0`) - the env/feature-flag gate for the implicit `Agent`-without-`subagent_type` fork path (cli_inner_pretty.js:211750-211752)
- `normalizeAgentTypeSlug` (`Zu7`) - the case- and separator-insensitive matcher (cli_inner_pretty.js:351139-352068)
- `getAgentContext` (`RD`) / `runWithAgentContext` (`RU`) - ALS-backed agent context propagation (cli_inner_pretty.js:97620-97625) — see [als_propagation.md](./als_propagation.md)
- `startAgentSummarization` (`CM$`) - the per-subagent 30s timer loop that produces task-notification summaries (cli_inner_pretty.js:271869-271941) — see [subagent_ui_rendering.md](./subagent_ui_rendering.md)
- `AGENT_COLOR_PALETTE` (`Nf`) / `SUBAGENT_THEME_KEYS` (`UP`) - 8-color palette with `_FOR_SUBAGENTS_ONLY` theme-key segregation (cli_inner_pretty.js:231368-231378)

## Three Entry Points

```
   ┌───────────────────────────────────────────────────────────────────┐
   │   subagent entry points — three paths into the same `Vb`/`slH`     │
   └───────────────────────────────────────────────────────────────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
              ▼                        ▼                        ▼
   ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
   │  --agent <name>    │  │   Agent tool       │  │   CLAUDE_CODE_     │
   │  (main thread)     │  │   (LLM dispatch)   │  │   FORK_SUBAGENT=1  │
   │                    │  │                    │  │   (env / SDK -p)   │
   │ The main session's │  │ `subagent_type` &  │  │ Schema-omitted     │
   │ AgentDefinition is │  │ `prompt` from the  │  │ `subagent_type` =  │
   │ the user's chosen  │  │ tool_use block;    │  │ implicit fork:     │
   │ agent. Frontmatter │  │ resolved via       │  │ inherits full      │
   │ `hooks:`/          │  │ Zu7-normalized     │  │ parent context,    │
   │ `mcpServers:`/     │  │ matcher; spawns a  │  │ tools:["*"],       │
   │ `initialPrompt:`/  │  │ fresh subagent     │  │ permissionMode:    │
   │ `permissionMode:`  │  │ from `runAgent`.   │  │ "bubble"; FORK_    │
   │ apply to the main  │  │ Async by default.  │  │ AGENT synthetic    │
   │ loop itself.       │  │                    │  │ AgentDefinition.   │
   └────────────────────┘  └────────────────────┘  └────────────────────┘
              │                        │                        │
              └────────────────────────┼────────────────────────┘
                                       │
                                       ▼
                         ┌───────────────────────────┐
                         │   runAgent (Vb)            │
                         │ ─ registerFrontmatterHooks │
                         │ ─ initializeAgentMcpServers│
                         │ ─ executeSubagentStartHooks│
                         │ ─ LLM loop via gC          │
                         │ ─ recordSidechainTranscript│
                         │ ─ executeSubagentStopHooks │
                         └───────────────────────────┘
```

### Entry 1: `--agent <name>` (main-thread fork)

When the user starts Claude Code with `claude --agent code-reviewer`, the binary loads the `code-reviewer` agent definition and uses *its* `getSystemPrompt`, `tools`, `disallowedTools`, `permissionMode`, `effort`, and `model` for the **main loop** — not a subagent. The agent's `mcpServers:` (v2.1.117) and `hooks:` (v2.1.116) frontmatter are also loaded into the main session.

This means a `--agent <name>` session has no "main agent" running underneath; the agent IS the main loop. From the model's point of view, the user is talking directly to `code-reviewer`. From the hook system's point of view, hooks see `agent_type: "code-reviewer"` and *no* `agent_id` (`agent_id` is for subagent-fired hooks only; cli_inner_pretty.js:237697-237703).

`mainThreadAgentType` (`Kh`/`vp`) and `mainThreadAgentHooks` (`kp`/`dv$`) are the two session-state slots that hold this configuration after `--agent` is parsed.

### Entry 2: `Agent` tool (LLM-dispatched subagent)

The most common entry point. The main loop's LLM emits a `tool_use` block:

```json
{
  "type": "tool_use",
  "name": "Agent",
  "input": {
    "subagent_type": "code-reviewer",
    "description": "Review PR #2138",
    "prompt": "Review the diff in feature/auth..."
  }
}
```

The Agent tool's handler:
1. Resolves `subagent_type` against `activeAgents` (exact match first, then `normalizeAgentTypeSlug` fallback, see [agent_type_matching.md](./agent_type_matching.md)).
2. Filters via `filterAgentsByPermission` (`GnH`) for `Agent(code-reviewer)` deny rules.
3. Calls `runAgent` (`Vb`) with the resolved `AgentDefinition` and the user's prompt.
4. Records the transcript to `~/.claude/sidechains/<agentId>.jsonl`.
5. Returns the final assistant text (or a partial-progress payload, see [result_passing.md](./result_passing.md)) as the `tool_result`.

If the LLM also passes `run_in_background: true`, the subagent runs as an async task: the tool returns immediately with a "started" notification, and the parent is fed progress notifications via `<task-notification>` envelopes from `startAgentSummarization` (`CM$`).

### Entry 3: `CLAUDE_CODE_FORK_SUBAGENT=1` (SDK headless + fork path)

In non-interactive sessions (`-p`, SDK), v2.1.121 enabled the **fork-subagent** path: when `CLAUDE_CODE_FORK_SUBAGENT=1` is set, the Agent tool's `subagent_type` parameter becomes **optional**. If the LLM omits it, the system spawns an *implicit fork*: a subagent that inherits the parent's full conversation context (`forkContextMessages: messages`) and uses the synthetic `FORK_AGENT` (`vI`) AgentDefinition.

The fork path's purpose is prompt-cache efficiency: each fork child sends the same API prefix (the assistant message with all `tool_use` blocks + a user message with identical placeholder `tool_result`s), so all parallel forks share the same cache entry. See [fork_lifecycle.md](./fork_lifecycle.md).

Three preconditions:
- `CLAUDE_CODE_FORK_SUBAGENT=1` env var OR `tengu_copper_fox` GrowthBook flag.
- For the *automatic* (rollout) path: an interactive session — `getIsNonInteractiveSession()` (`T6`) must be false. The explicit env var bypasses this. (The first-position `i3H` check is a dead `return false` stub — the constant-folded remnant of v2.1.88's `isCoordinatorMode()` gate, since coordinator mode is removed from v2.1.142.)
- v2.1.117 enabled this in `claude` external builds; v2.1.121 extended it to `claude -p` and the SDK.

Source `resolveForkSubagentSource` (`S$_`): cli_inner_pretty.js:211733-211740 returns one of `"env" | "ant" | "gb_rollout"` or `"disabled"`.

## Lifecycle: Spawn → Execute → Return

```
            ┌─────────────────────────────────────────────────────────┐
            │           parent's main loop, on Agent tool call         │
            └─────────────────────────────────────────────────────────┘
                                       │
                                       ▼
                     resolveSubagentType (Zu7-normalized)
                                       │
                                       ▼
                            filterAgentsByPermission
                                       │
                                       ▼
                   createSubagentContext (forkedAgent.ts)
                                       │
                                       ▼
                       writeAgentMetadata (tJ$)
                                       │
                                       ▼
                 setAgentTranscriptSubdir (jVK, if applicable)
                                       │
                                       ▼
                       runAgent (Vb) ──── (slH wrapper for async)
                                       │
                  registerFrontmatterHooks  ◄── agent.hooks
                  initializeAgentMcpServers ◄── agent.mcpServers
                  executeSubagentStartHooks → x.push(additional_context)
                  enrichWithSkills          ◄── agent.skills[]
                                       │
                                       ▼
                    ┌──────────────────────────────────┐
                    │  for await (msg of gC({...})):    │
                    │    yield msg to parent's stream   │
                    │    recordSidechainTranscript(msg) │ ← Me(msg, agentId, parentUuid)
                    │    if msg is SubagentStop attach: │
                    │      flag stoppedNormally = true  │
                    └──────────────────────────────────┘
                                       │
                                       ▼
                        finally block — cleanup chain:
                          SubagentStop hooks (if not yet fired)
                          MCP server cleanup
                          sessionHooksRegistry.clear(agentId)
                          promptCacheTracking cleanup
                          readFileState.clear()
                          sentSkillNames clear
                          messages array drained
                          perfetto unregisterAgent
                          clearAgentTranscriptSubdir (JVK)
                          agentLifecycle.clearTodos
                          replContext clear
                                       │
                                       ▼
                       return final assistant text
                       to the parent as tool_result
```

## Module Documents

| Document | Purpose |
|----------|---------|
| [definition_schema.md](./definition_schema.md) | Agent frontmatter: `name`, `description`, `tools`/`disallowedTools`, `mcpServers`, `hooks`, `permissionMode`, `model`, `effort`, `color`, `initialPrompt`, `disable-model-invocation`, `omitClaudeMd`; agent-team-leader vs teammate frontmatter; v2.1.140 color palette |
| [builtin_agents.md](./builtin_agents.md) | Catalog of all v2.1.142 built-in agents (`general-purpose`, `Explore`, `Plan`, `statusline-setup`, `claude-code-guide`, `claude`/FleetView); per-agent frontmatter walk; assembly function `xgH`/`getBuiltInAgents` and conditional inclusion (`getIsNonInteractiveSession`=`T6`, `isAgentViewDisabled`=`rmH`, SDK-entrypoint check; NO coordinator branch — stripped in v2.1.142); precedence merge via `bC`; cross-validation with v2.1.88 (notes the removal of `verification` and coordinator-mode from external bundle) |
| [agent_tool_dispatch.md](./agent_tool_dispatch.md) | Deep dive into the Agent tool's `call()` handler (`Gu7.call`): precondition gates (teammate/background), routing decision (teammate / fork / normal), MCP required-server wait (30s + 500ms poll), system prompt + messages build (fork inherits `renderedSystemPrompt`), invocation building, sync vs async dispatch with auto-background race, error telemetry taxonomy |
| [reminder_interaction.md](./reminder_interaction.md) | Subagent attachment & system-reminder injection channels: `hook_additional_context` (SubagentStart), `agent_listing_delta` (CLAUDE_CODE_AGENT_LIST_IN_MESSAGES path), `skill_listing` (per-agent dedup `Ty6`), `critical_system_reminder` (per-turn re-injection), `mcp_instructions_delta`, `agent_mention`, `output_style`; how the fork path skips most reminders to preserve cache prefix |
| [fork_lifecycle.md](./fork_lifecycle.md) | `CLAUDE_CODE_FORK_SUBAGENT` rollout history (v2.1.117 interactive, v2.1.121 `-p`/SDK); `FORK_AGENT` synthetic definition; cache-prefix structure of `buildForkedMessages`; coordinator-mode exclusion; `--agent` vs Agent-tool spawn comparison |
| [resume_state.md](./resume_state.md) | Fork-pointer hydrate (`recordForkContextRef`/`Vy6`, v2.1.118); transcript-line gating; `resumePersistedCount` dedup (v2.1.132); SDK `mcp_authenticate` `redirectUri` (v2.1.121); v2.1.118 `cwd` restore fix for resumed subagents |
| [transcript_isolation.md](./transcript_isolation.md) | Sidechain JSONL writes (`Me`/`recordSidechainTranscript`); transcript subdir override (`jVK`); v2.1.110 retention sweep over `~/.claude/tasks/`, `~/.claude/sidechains/`; peer-process gating; v2.1.105 PTL retry duplicate-write fix |
| [skill_discovery_in_subagent.md](./skill_discovery_in_subagent.md) | v2.1.133 unified `getSkillsFromAllSources` (`Ax5`); project/user/plugin/bundled skill resolution; how subagent inherits the skill catalog from parent; frontmatter `skills:` preload at agent start |
| [hook_inheritance.md](./hook_inheritance.md) | v2.1.116 agent-frontmatter `hooks:` firing for `--agent`; v2.1.118 agent-type hooks fix for non-Stop/SubagentStop events; v2.1.142 prompt-/agent-type hook validation error for `SessionStart`/`Setup`/`SubagentStart`; `mainThreadAgentHooks` storage |
| [mcpserver_inheritance.md](./mcpserver_inheritance.md) | v2.1.117 agent `mcpServers:` loaded for `--agent`; v2.1.101 dynamic-MCP propagation fix; admin-trust gate (`isSourceAdminTrusted`) under `strictPluginOnlyCustomization`; per-agent server cleanup |
| [agent_type_matching.md](./agent_type_matching.md) | v2.1.140 case-/separator-insensitive `subagent_type` (`Zu7`-normalized); two-pass exact-then-normalized lookup; ambiguity error with `(unavailable)` annotation; deny-rule precedence and source attribution |
| [result_passing.md](./result_passing.md) | Parent observation of subagent result; error propagation; v2.1.128 progress-summary cache fix (~3× `cache_creation` reduction); v2.1.101 partial-progress reporting on subagent errors; idle subagent summary cap (`tengu_agent_summary_skipped: "unchanged"`) |
| [runtime_execution.md](./runtime_execution.md) | Deep dive into `runAgent` (`Vb`): setup phase (agentId/permission context/tools/MCP), LLM loop body (yield filtering, sidechain writes, parent-uuid chain), stop-attach signal, cleanup pipeline with `keepaliveGated` two-state model, sync-vs-async permission decision tree |
| [als_propagation.md](./als_propagation.md) | `AsyncLocalStorage`-backed agent context (`Atq`/`RU`/`RD`): why ALS not AppState, store shape for subagent vs teammate, `invokingRequestId` sparse-edge protocol, nested-spawn shadowing, consumer surfaces (HTTP/OTel/hooks/tools) |
| [subagent_ui_rendering.md](./subagent_ui_rendering.md) | How parent's REPL renders subagent activity: color palette segregation (`_FOR_SUBAGENTS_ONLY` tokens), streaming output path, `<task-notification>` envelopes, 30s `startAgentSummarization` (`CM$`) timer with unchanged-skip + skipCacheWrite, final `tool_result` envelope, error/abort envelopes |

## Quick Reference

- **Sidechain JSONL location**: `~/.claude/sidechains/<agentId>.jsonl` (transcript)
- **Sidechain metadata**: `~/.claude/sidechains/<agentId>.json` (agentType, cwd, worktreePath, description, name)
- **Frontmatter parsing**: `parseMarkdownFrontmatter` (`tO`, cli_inner_pretty.js:141788)
- **Color palette**: `AGENT_COLOR_PALETTE` (`Nf`, cli_inner_pretty.js:231368) — 8 colors: red, blue, green, yellow, purple, orange, pink, cyan
- **Identity headers**: `x-claude-code-agent-id`, `x-claude-code-parent-agent-id` (cli_inner_pretty.js:128061-128062, since v2.1.139)
- **OTel attributes**: `agent_id`, `parent_agent_id` on `claude_code.llm_request` spans (cli_inner_pretty.js:241778-241779, since v2.1.139)
- **Agent context store**: `AsyncLocalStorage`-backed; `getAgentContext` (`RD`, cli_inner_pretty.js:97620-97622) reads the current `{ agentId, agentType, parentAgentId, ... }`; spawn wraps the child generator via `runWithAgentContext` (`RU`, cli_inner_pretty.js:97623-97625). All HTTP / OTel / hook code reads identity via `RD()` rather than threading params through every call.

## v2.1.88 → v2.1.142 Evolution

A consolidated view of what changed in the subagent subsystem between the v2.1.88 TS source (`/lyz/codespace/3rd/claude-code/src/tools/AgentTool/`) and the v2.1.142 build (`/lyz/codespace/claude-code-bomb/versions/2.1.142/`).

| Area | v2.1.88 | v2.1.142 | Details |
|------|---------|----------|---------|
| **Built-in agents** | `general-purpose`, `Explore`, `Plan`, `statusline-setup`, `claude-code-guide` always; `verification` doubly-gated by `feature('VERIFICATION_AGENT')` + `tengu_hive_evidence` GrowthBook (default false) (5–6) | `general-purpose`, `Explore`, `Plan`, `statusline-setup`, `claude-code-guide`, `claude` (FleetView) — no `verification` in bundle (6) | `claude` is new (post-v2.1.130 FleetView). `verification` either dead-code-eliminated by Bun bundler or removed; not present in v2.1.142 bundle. v2.1.88's `areExplorePlanAgentsEnabled` was gated by `feature('BUILTIN_EXPLORE_PLAN_AGENTS')` + `tengu_amber_stoat` (default true); v2.1.142's `o3$()` is unconditional. See [builtin_agents.md](./builtin_agents.md). |
| **Fork-subagent path** | Internal-only (USER_TYPE=ant) | External + SDK (v2.1.117 + v2.1.121) | Gated by `CLAUDE_CODE_FORK_SUBAGENT` env or `tengu_copper_fox` GrowthBook. See [fork_lifecycle.md](./fork_lifecycle.md). |
| **Agent listing in messages** | Attachment mechanism + gate already present | Same mechanism + `whenToUseLean` (v2.1.140) shorter description for the attachment path | Both versions gate via `tengu_agent_list_attach` / `CLAUDE_CODE_AGENT_LIST_IN_MESSAGES`. v2.1.140 added the lean variant consulted by `Fw6` when rendering for attachments. See [reminder_interaction.md](./reminder_interaction.md). |
| **Fork-pointer persistence** | Copied parent transcript per fork (~10MB) | Records `fork-context-ref` pointer (~200B) (v2.1.118) | Hydrates on resume by walking parent transcript to `parentLastUuid`. See [resume_state.md](./resume_state.md). |
| **Resume dedup** | None — PTL retries duplicate-wrote prefix | `resumePersistedCount` (v2.1.132) | Slice off persisted head; anchor `parentUuid` to last persisted UUID. |
| **Cwd persistence** | Not in sidecar metadata | Persisted in `~/.claude/sidechains/<id>.json` (v2.1.118) | Resumed subagents restore their original cwd. |
| **Summary cache sharing** | Independent cache per fork — ~3× cache_creation cost | Shared cache via `cacheSafeParams` + `skipCacheWrite` (v2.1.128) | Summary fork reads existing cache, doesn't create new entry. See [result_passing.md](./result_passing.md). |
| **Summary idle skip** | Fires every 30s regardless | Skipped when transcript unchanged (v2.1.128) | Once-per-streak `tengu_agent_summary_skipped: "unchanged"` telemetry. |
| **Skill discovery** | Two parallel paths (main / fork) — fork missed project skills | Unified `getSkillsFromAllSources` (v2.1.133) | Same catalog for all callers. See [skill_discovery_in_subagent.md](./skill_discovery_in_subagent.md). |
| **MCP frontmatter for --agent** | Ignored on main thread | Loaded (v2.1.117) | Main-thread agent sees its own MCP servers. See [mcpserver_inheritance.md](./mcpserver_inheritance.md). |
| **MCP parallel connect** | Sequential — startup ~N × 200ms | `Promise.all` (v2.1.119) | Drops startup to slowest single connect. |
| **Dynamic MCP propagation** | Lost in subagent | Threaded via live `mcpClients` (v2.1.101) | Skills' runtime-registered MCP visible to subagents. |
| **Hooks frontmatter for --agent** | Ignored on main thread | Fires (v2.1.116) | Set via `mainThreadAgentHooks` slot. See [hook_inheritance.md](./hook_inheritance.md). |
| **Agent-type hooks for non-Stop** | "Messages required" error | Works (v2.1.118) | Builder accepts empty-messages for non-Stop events. |
| **Hook validation for context-less events** | Silent fail / generic error | Clear "use command-type hook instead" (v2.1.142) | `SessionStart`/`Setup`/`SubagentStart` only accept command-type hooks. |
| **Agent type matching** | Exact, case-sensitive | Two-pass: exact → NFKC+lowercase+stripped (v2.1.140) | `"Code Reviewer"` resolves to `code-reviewer`. See [agent_type_matching.md](./agent_type_matching.md). |
| **Partial progress on error** | Just the error string | Includes last assistant text + recent tools (v2.1.101) | Parent can continue with knowledge of what was tried. |
| **Identity headers** | Not sent | `x-claude-code-agent-id` + `parent` (v2.1.139) | OTel spans also tagged. |
| **Color palette segregation** | Direct theme tokens | `_FOR_SUBAGENTS_ONLY` suffixed (v2.1.140) | Theme contrast tuned independently of role tokens. See [subagent_ui_rendering.md](./subagent_ui_rendering.md). |
| **Retention sweep coverage** | `~/.claude/projects/` only | Adds `tasks/`, `sidechains/`, `shell-snapshots/`, `backups/` (v2.1.110) | Subagent transcripts bounded in disk. See [transcript_isolation.md](./transcript_isolation.md). |
| **Cleanup keepalive gating** | All cleanups run unconditionally | `mcpMonitors` + `shellTasks` skip if backgrounded | Background subagents keep their MCP/shell surface alive after stream exits. See [runtime_execution.md](./runtime_execution.md). |
| **Teammate background guard** | Single check | Two checks: explicit `run_in_background=true` + agent's `background: true` | Both paths covered. See [agent_tool_dispatch.md](./agent_tool_dispatch.md). |
| **Required MCP wait** | 30s + 500ms poll | Same | No change. Early exit on `failed` or no-more-pending. |
| **SDK redirectUri for MCP auth** | localhost-only | Custom scheme + localhost fallback (v2.1.121) | Supports mobile/extension SDK consumers. |
| **`omitClaudeMd` kill switch** | Hard-coded behavior | GrowthBook `tengu_slim_subagent_claudemd` (default true) | Can be reverted if regression found. |

The dominant theme: **incremental cost reduction without losing capability**. Almost every v2.1.x change is either (a) closing a token/disk/network leak, (b) increasing the surface where the same mechanism works (fork in SDK, hooks in main-thread), or (c) tightening validation so silent failures become loud errors.
