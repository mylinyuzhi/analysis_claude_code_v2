# 30 — Agent Team (v2.1.142)

## What this unit covers

The **agent team** subsystem is the umbrella for everything that lets one
running `claude` process coordinate work across other agentic units. It spans
five concrete sub-systems that share state, identity propagation, and the
`AgentTool` / `SendMessage` / `TeamCreate` / `TeamDelete` toolset, but differ
in how the "worker" actually runs:

| Sub-system | Worker lives in | Talks back via | Lifetime | Cross-references |
|------------|-----------------|----------------|----------|------------------|
| **In-process teammate** | Same Node.js process, async-isolated by `AsyncLocalStorage` (`Ei8`) | File mailbox under `~/.claude/{team}/inboxes/` | Until the leader REPL exits | [`teammate_runner_loop.md`](./teammate_runner_loop.md), [`mailbox_protocol.md`](./mailbox_protocol.md), [`team_lifecycle_tools.md`](./team_lifecycle_tools.md) |
| **Subagent (Agent tool dispatch)** | Same Node.js process, async-isolated by `AsyncLocalStorage` (`Atq`) | In-memory `<task-notification>` XML at completion | Until task completes / killed | [`agent_identity_propagation.md`](./agent_identity_propagation.md), [`v2_1_142_subagent_matching.md`](./v2_1_142_subagent_matching.md), [`tool_inheritance.md`](./tool_inheritance.md) |
| **Background agent (bg worker)** | Separate child process spawned by `claude daemon`, attached over UDS / PTY | Daemon control protocol + roster file | Survives leader exit; daemon-supervised | [`coordinator_process_model.md`](./coordinator_process_model.md), [`v2_1_142_dispatch_flags.md`](./v2_1_142_dispatch_flags.md), [`worktree_isolation.md`](./worktree_isolation.md) |
| **Remote agent (cloud session)** | Anthropic-hosted session reached via the Bridge transport | HTTPS+SSE bridge messages, surfaced as `<task-notification>` | Cloud-managed | [`team_mailbox_v_personal.md`](./team_mailbox_v_personal.md) (bridge: scheme), [`task_taxonomy.md`](./task_taxonomy.md) |
| **Daemon-side helpers (workflow / mcp / dream)** | Bun child or in-process, distinct task types | Their own task-state mutations | Until done | [`task_taxonomy.md`](./task_taxonomy.md) |

There is **no single "agent team" runtime** — instead, an `AppState.tasks`
record holds one entry per active "thing the user kicked off in parallel",
each carrying a `type` discriminator (`in_process_teammate`, `local_agent`,
`remote_agent`, `local_bash`, `local_workflow`, `monitor_mcp`, `mcp_task`,
`dream`). All UI surfaces — the FleetView dashboard, the footer pill, the
background-task dialog, the spinner-tree — read this single record and project
it through type-specific renderers.

## How to read these files

```
30_agent_team/
├── README.md                            ← you are here (index)
│
├── task_taxonomy.md                     ← the 8 task types, their state shapes,
│                                          and the Task interface they share
├── builtin_agents.md                    ← the built-in roster from the team angle:
│                                          xgH assembly gates, the `claude` FleetView
│                                          worker (appendSystemPrompt, dispatch chain),
│                                          coordinator-mode removal, role matrix
│
├── fleet_view_ui.md                     ← the `claude agents` dashboard UI
│                                          (FleetView / EQ4 / dispatch chips)
├── agent_management_ui.md               ← the `/agents` menu: create/edit/delete
│                                          definitions, generateAgent (LLM), the
│                                          v2.1.142 "Running + Library" embedding
│
├── teammate_runner_loop.md              ← in-process teammate poll loop,
│                                          5-priority order, agent-loop wrapper
├── team_lifecycle_tools.md              ← TeamCreate / TeamDelete / SendMessage
│                                          public-tool definitions
│
├── coordinator_process_model.md         ← `claude daemon` supervisor:
│                                          worker pool, 60s tick, retire policy,
│                                          v2.1.142 clock-jump + brew-upgrade
├── mailbox_protocol.md                  ← file-based IPC envelope, locks, types
├── team_mailbox_v_personal.md           ← per-agent inbox vs channels vs bridge
├── permission_inheritance.md            ← `permissionMode` propagation rules
├── tool_inheritance.md                  ← tools / MCP / skills / hooks scoping
├── agent_identity_propagation.md        ← Atq / Ei8 ALS, x-claude-code-agent-id,
│                                          OTel / Perfetto span tags
├── worktree_isolation.md                ← `isolation: worktree`, EnterWorktree,
│                                          v2.1.142 pre-existing-worktree fix
│
├── v2_1_142_dispatch_flags.md           ← `claude agents` 8 new flags
└── v2_1_142_subagent_matching.md        ← case/separator-insensitive subagent_type
```

### Suggested reading order

For someone trying to understand the system from scratch:

1. **`task_taxonomy.md`** — get the type discriminator straight first; every
   other doc references these types.
2. **`builtin_agents.md`** — what agents *exist* and which role each can play
   (subagent / fleet worker / teammate / main session); the `claude` FleetView
   worker; why coordinator mode is gone.
3. **`agent_identity_propagation.md`** — the two `AsyncLocalStorage` slots are
   the load-bearing abstraction the rest of the runtime sits on.
4. **`teammate_runner_loop.md`** — the simplest agentic runtime (in-process)
   shows how a teammate processes inbox traffic between turns.
5. **`mailbox_protocol.md`** + **`team_mailbox_v_personal.md`** — the IPC
   that connects teammates.
6. **`fleet_view_ui.md`** + **`agent_management_ui.md`** +
   **`v2_1_142_dispatch_flags.md`** — the two user-facing UIs (running fleet
   vs. definition management, now fused in v2.1.142) and the dispatch flags.
7. **`coordinator_process_model.md`** + **`worktree_isolation.md`** — the
   `claude daemon` supervisor and filesystem isolation for the background variant.
8. **`team_lifecycle_tools.md`** — the public tools the model uses to create
   teams and route messages.
9. **`permission_inheritance.md`** + **`tool_inheritance.md`** —
   cross-cutting concerns affecting every variant (tool resolver, MCP/skill/hook
   scoping).
10. **`v2_1_142_subagent_matching.md`** — narrow fix-doc for the matcher in
    the Agent tool.

## v2.1.142 highlights

The agent-team subsystem evolved across this release in five directions:

0. **Built-in roster reshaped + the UIs fused** — the `claude` FleetView worker
   agent (`isolation:"worktree"`, `permissionMode:"auto"`, the
   `appendSystemPrompt` mechanism) is new; **coordinator mode was removed**
   entirely; and the `/agents` definition-management menu now embeds the live
   FleetView dashboard as a "Running (N)" section above the "Library"
   (`builtin_agents.md`, `agent_management_ui.md`). The `Explore` agent's model
   was also hardcoded to `haiku` (dropping v2.1.88's ant/`tengu_explore_agent`
   branch).
1. **Background agents matured** — `claude agents` got 8 new dispatch flags
   (`--add-dir`, `--settings`, `--mcp-config`, `--plugin-dir`,
   `--strict-mcp-config`, `--permission-mode`, `--model`, `--effort` /
   `--dangerously-skip-permissions`), and the daemon now compensates for
   wall-clock jumps (macOS sleep/wake) and gracefully restarts after
   `brew upgrade` (see `coordinator_process_model.md` and
   `v2_1_142_dispatch_flags.md`).
2. **Worktree handling tightened** — `EnterWorktree` accepts pre-existing
   worktrees (no more "duplicate" failures in bg sessions), and stale-cleanup
   now considers untracked files dirty (`worktree_isolation.md`).
3. **Subagent name matching relaxed** — `subagent_type` is now
   case/separator-insensitive via NFKC + Unicode `\p{Pd}` /
   `\p{White_Space}` stripping (`v2_1_142_subagent_matching.md`).
4. **Telemetry surface expanded** — every LLM request now carries
   `x-claude-code-agent-id` / `x-claude-code-parent-agent-id` headers, and
   every span attaches `agent_id`, `parent_agent_id`, `team_name`,
   `parent_session_id` attributes (`agent_identity_propagation.md`).

The team mailbox protocol itself did **not** change schema; what changed is
the surrounding tool surface (`SendMessage` rejects `to: "*"`, gains
`bridge:` / `uds:` schemes, and now routes to a remote cloud session via the
Bridge transport).

## Cross-version cross-references

Where a topic was first covered in an earlier deobfuscation pass, this unit
links back to it rather than duplicating:

- The **v2.1.88 TypeScript reference** (the cleanest readable source; the only
  version token in the tree is `2.1.83`, so it is an **older** ~v2.1.83-88
  snapshot, *predating* v2.1.142) lives in
  `/lyz/codespace/3rd/claude-code/src/tasks/`,
  `src/coordinator/coordinatorMode.ts`, and `src/tools/AgentTool/`.
  The reference contains a **coordinator mode** (`coordinatorMode.ts`
  system prompt, `getCoordinatorAgents()` roster replacement,
  `COORDINATOR_MODE_ALLOWED_TOOLS`) that v2.1.142 has **removed**: zero symbol
  hits in the bundle, and the gate survives only as the dead `i3H` stub
  (`return false`). Verified in
  [`builtin_agents.md`](./builtin_agents.md#coordinator-mode-removed-in-v21142)
  and [`34_subagent/fork_lifecycle.md`](../34_subagent/fork_lifecycle.md). Note
  that the **`ultraplan`** remote-agent flow is *not* removed — its attention
  states (`isUltraplan` / `ultraplanPhase`) are live in v2.1.142's
  `remote_agent` task (see [`task_taxonomy.md`](./task_taxonomy.md)); only the
  separate *coordinator mode* was dropped. Do not conflate "coordinator mode"
  (removed) with the `claude daemon` *supervisor* (`coordinator_process_model.md`,
  still present — it supervises background-fleet workers).
- The **v2.1.112 baseline** for the in-process teammate skeleton lives in
  `claude_code_v_2.1.112/analyze/30_agent_team/`. The polling-priority order,
  the 500 ms loop, the mailbox file format, and the leader-broadcast pattern
  were all introduced there and are referenced (not re-derived) in this
  unit's docs.

## Symbol index

All obfuscated → readable mappings live in
[`symbol_index_core_features.md`](../00_overview/symbol_index_core_features.md)
(Module: Agent Team, Module: Background Agents) and, for the more granular
v2.1.142 additions, in
[`symbol_additions_v2_1_142_agent_team_arch.md`](../00_overview/symbol_additions_v2_1_142_agent_team_arch.md)
and [`symbol_additions_v2_1_142_agents.md`](../00_overview/symbol_additions_v2_1_142_agents.md).

This file is an index only — it should not be expanded with implementation
detail; that goes in the per-topic file.
