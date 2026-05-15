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
- `runAgent` (`Vb`) - the streaming generator that runs a subagent turn (cli_inner_pretty.js:393107-393434)
- `runResumedSubagent` (`uiH`) - resume entrypoint that threads `resumePersistedCount` (cli_inner_pretty.js:386626-386713)
- `isForkSubagentEnabled` (`W0`) - the env/feature-flag gate for the implicit `Agent`-without-`subagent_type` fork path (cli_inner_pretty.js:211750-211752)
- `normalizeAgentTypeSlug` (`Zu7`) - the case- and separator-insensitive matcher (cli_inner_pretty.js:351139-351143)
- `executeSubagentStartHooks` (`QL$`) - fires `SubagentStart` hooks and injects additional_context (cli_inner_pretty.js:520055)
- `startAgentSummarization` (`CM$`) - the per-subagent 30s timer loop that produces task-notification summaries (cli_inner_pretty.js:271869-271941)

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
- Not coordinator mode (`isCoordinatorMode()` returns false).
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
| [fork_lifecycle.md](./fork_lifecycle.md) | `CLAUDE_CODE_FORK_SUBAGENT` rollout history (v2.1.117 interactive, v2.1.121 `-p`/SDK); `FORK_AGENT` synthetic definition; cache-prefix structure of `buildForkedMessages`; coordinator-mode exclusion; `--agent` vs Agent-tool spawn comparison |
| [resume_state.md](./resume_state.md) | Fork-pointer hydrate (`recordForkContextRef`/`Vy6`, v2.1.118); transcript-line gating; `resumePersistedCount` dedup (v2.1.132); SDK `mcp_authenticate` `redirectUri` (v2.1.121); v2.1.118 `cwd` restore fix for resumed subagents |
| [transcript_isolation.md](./transcript_isolation.md) | Sidechain JSONL writes (`Me`/`recordSidechainTranscript`); transcript subdir override (`jVK`); v2.1.110 retention sweep over `~/.claude/tasks/`, `~/.claude/sidechains/`; peer-process gating; v2.1.105 PTL retry duplicate-write fix |
| [skill_discovery_in_subagent.md](./skill_discovery_in_subagent.md) | v2.1.133 unified `getSkillsFromAllSources` (`Ax5`); project/user/plugin/bundled skill resolution; how subagent inherits the skill catalog from parent; frontmatter `skills:` preload at agent start |
| [hook_inheritance.md](./hook_inheritance.md) | v2.1.116 agent-frontmatter `hooks:` firing for `--agent`; v2.1.118 agent-type hooks fix for non-Stop/SubagentStop events; v2.1.142 prompt-/agent-type hook validation error for `SessionStart`/`Setup`/`SubagentStart`; `mainThreadAgentHooks` storage |
| [mcpserver_inheritance.md](./mcpserver_inheritance.md) | v2.1.117 agent `mcpServers:` loaded for `--agent`; v2.1.101 dynamic-MCP propagation fix; admin-trust gate (`isSourceAdminTrusted`) under `strictPluginOnlyCustomization`; per-agent server cleanup |
| [agent_type_matching.md](./agent_type_matching.md) | v2.1.140 case-/separator-insensitive `subagent_type` (`Zu7`-normalized); two-pass exact-then-normalized lookup; ambiguity error with `(unavailable)` annotation; deny-rule precedence and source attribution |
| [result_passing.md](./result_passing.md) | Parent observation of subagent result; error propagation; v2.1.128 progress-summary cache fix (~3× `cache_creation` reduction); v2.1.101 partial-progress reporting on subagent errors; idle subagent summary cap (`tengu_agent_summary_skipped: "unchanged"`) |

## Quick Reference

- **Sidechain JSONL location**: `~/.claude/sidechains/<agentId>.jsonl` (transcript)
- **Sidechain metadata**: `~/.claude/sidechains/<agentId>.json` (agentType, cwd, worktreePath, description, name)
- **Frontmatter parsing**: `parseMarkdownFrontmatter` (`tO`, cli_inner_pretty.js:141788)
- **Color palette**: `AGENT_COLOR_PALETTE` (`Nf`, cli_inner_pretty.js:231368) — 8 colors: red, blue, green, yellow, purple, orange, pink, cyan
- **Identity headers**: `x-claude-code-agent-id`, `x-claude-code-parent-agent-id` (cli_inner_pretty.js:128061-128062, since v2.1.139)
- **OTel attributes**: `agent_id`, `parent_agent_id` on `claude_code.llm_request` spans (since v2.1.139)
