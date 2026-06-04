# 30 — Agent Team (v2.1.156)

> Module: `30_agent_team/` (Claude Code v2.1.156, bundle `cli_inner_pretty.js`, 649,979 lines).
> Subsystem internal name: **"swarm"** — telemetry events are emitted as `swarm_*` (e.g. `swarm_in_process_spawn`, `swarm_backend_detect`) and the user-facing install-help error text reads "agent swarms". This is the same subsystem that the v2.1.142 tree documented under the name **"agent team"**. The two names are interchangeable; this tree keeps the directory name `30_agent_team` for continuity and uses "swarm" wherever the bundle does.

## What this unit covers

The **agent-team (swarm)** subsystem is what lets one running `claude` REPL (the *team lead*) spawn and coordinate other agentic *teammates*. Unlike the daemon background fleet (`36_background_agents/`), every teammate here is **leader-owned**: it is created by, talks to, and dies with the leader REPL. The whole subsystem is gated behind a single master switch, `isAgentTeamsEnabled` (obfuscated: `R7`), which returns false unless an opt-in env var/flag is present **and** the GrowthBook gate `tengu_amber_flint` is on (`cli_inner_pretty.js:240766-240770`).

The defining design fact of v2.1.156's swarm is that a teammate can run in **exactly one of two execution modes**, and a single small module — the **BackendRegistry** (`R94` @`cli_inner_pretty.js:380912`) — owns the entire mode decision and hands callers a uniform executor. The two modes are:

| | **In-process** | **Cross-process (panes)** |
|---|---|---|
| **Worker lives in** | the *same* `claude` Node process, isolated by nested `AsyncLocalStorage` scopes | a *separate* `claude` OS process inside a tmux pane or iTerm2 split |
| **Backend / executor** | `InProcessBackend` (`K94` @`380062`) | `PaneBackendExecutor` (`L94` @`380388`) wrapping a `TmuxBackend` (`ZU6` @`380545`) or `ITermBackend` (`TU6` @`380820`) |
| **Spawn function** | `spawnInProcessTeammate` (`CW8` @`381458`) → `startInProcessTeammate` (`qeH` @`380016`) → `runInProcessTeammate` (`JT_` @`379714`) | `PaneBackendExecutor.spawn` (@`380403`): create pane → assemble `cd … && env … claude --agent-id …` → **type it into the pane** via `send-keys`/`it2` |
| **Talks back via** | file mailbox under `~/.claude/teams/<team>/inboxes/<agent>.json` (`writeToMailbox` `aA` @`338306`) | the *same* file mailbox — no shared memory, no pipe |
| **Lifetime** | dies with the leader REPL; no process boundary | dies with the leader REPL (cleanup kills the pane); a real but non-supervised OS process |

Both backends implement the identical `TeammateExecutor` shape (`type` / `setContext` / `isAvailable` / `spawn` / `sendMessage` / `terminate` / `kill` / `isActive`), so every caller spawns and manages teammates without knowing which mode is live. The three things unify the two modes into one subsystem:

1. **The BackendRegistry** decides mode. `isInProcessEnabled` (`ma` @`381076`) is the switch (non-interactive ⇒ always in-process; `teammateMode` config of `in-process`/`tmux` forces a mode; `auto` ⇒ in-process unless the leader is itself inside a tmux/iTerm2 pane, or a pane spawn already failed and set a sticky fallback bit). `getTeammateExecutor` (`NT_` @`381098`) reads that switch and returns either `getInProcessBackend` (`S94`) or the memoized `PaneBackendExecutor` from `detectAndGetBackend` (`jLH` @`380965`).
2. **The file mailbox** is the universal IPC. The leader never speaks "tmux" or "async task" to a teammate — it writes one JSON object to the recipient's inbox file under an advisory lock, and the teammate polls that file every 500 ms (`POLL_INTERVAL_MS` `fT_` = `500` @`380022`). A file mailbox is the lowest common denominator that works identically across an in-process async boundary *and* a cross-process OS boundary.
3. **The TeamCreate / TeamDelete / SendMessage toolset** (the `U57` tool set) plus the teammate system-prompt addendum (`TEAMMATE_SYSTEM_PROMPT_ADDENDUM` `jU6` @`379421`) is the model-facing surface, identical regardless of mode.

This README is an **index only** — implementation detail, dual-version snippets and step-by-step algorithm analysis live in the per-topic files below.

## Related Symbols

> Symbol mappings live ONLY in the central index files and the per-module additions file (this doc uses **list format**, never a mapping table):
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (Agent Loop, Tools, State)
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (**Agent Team / Swarm** lives here)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (Permissions)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations

Key functions/classes referenced by this index (detail in the per-topic docs):

- `isAgentTeamsEnabled` (obfuscated: `R7`) — master gate; opt-in env/flag **AND** GrowthBook `tengu_amber_flint` (`cli_inner_pretty.js:240766-240770`).
- `hasAgentTeamsFlag` (obfuscated: `Ru5`) — `process.argv.includes("--agent-teams")` (`cli_inner_pretty.js:240763-240765`).
- `globalBackendRegistry` (obfuscated: `NS`) / `createBackendRegistry` (obfuscated: `y94`) — the singleton registry and its factory (`cli_inner_pretty.js:380912-380930`, `381118`).
- `isInProcessEnabled` (obfuscated: `ma`) — the in-process-vs-pane switch (`cli_inner_pretty.js:381076-381090`).
- `getTeammateExecutor` (obfuscated: `NT_`) — dispatch entry point returning the right executor (`cli_inner_pretty.js:381098-381101`).
- `InProcessBackend` (obfuscated: `K94`) — in-process `TeammateExecutor` (`cli_inner_pretty.js:380062`).
- `PaneBackendExecutor` (obfuscated: `L94`) — adapter wrapping a tmux/iTerm2 `PaneBackend` into a `TeammateExecutor` (`cli_inner_pretty.js:380388`).
- `writeToMailbox` (obfuscated: `aA`) — the universal file-mailbox IPC primitive shared by both modes (`cli_inner_pretty.js:338306`).
- `TEAMMATE_SYSTEM_PROMPT_ADDENDUM` (obfuscated: `jU6`) — system-prompt addendum that forces teammates to use `SendMessage` (`cli_inner_pretty.js:379421`).

## Files in this module

```
30_agent_team/
├── README.md                                   ← you are here (index + the two-mode framing)
│
├── execution_modes_and_backend_registry.md     ← THE CORE: the BackendRegistry (R94/NS), the
│                                                  isInProcessEnabled (ma) switch, getTeammateExecutor
│                                                  (NT_) dispatch, detectAndGetBackend (jLH) detection,
│                                                  teammateMode snapshot, and the shared
│                                                  TeammateExecutor interface
│
├── in_process_mode.md                           ← InProcessBackend (K94): spawnInProcessTeammate (CW8),
│                                                  the persistent runInProcessTeammate (JT_) agent loop,
│                                                  the 6-priority poll loop (DT_, 500 ms), the nested
│                                                  AsyncLocalStorage identity isolation, kill/shutdown
│
├── cross_process_mode.md                        ← PaneBackendExecutor (L94) and the pane backends
│                                                  TmuxBackend (ZU6) / ITermBackend (TU6): how a NEW
│                                                  `claude` process is launched by typing
│                                                  `cd … && env … claude --agent-id …` into a pane,
│                                                  the CLI/env builders, it2 setup
│
├── mailbox_and_lifecycle_tools.md               ← the file mailbox protocol (writeToMailbox aA,
│                                                  readUnreadMessages, message-type helpers), the
│                                                  TeamCreate/TeamDelete/SendMessage tools (U57), and
│                                                  the leader↔teammate permission bridge (OT_)
│
└── cross_validation.md                          ← every symbol above mapped to its v2.1.88 named-TS
                                                   counterpart (byte-identical vs evolved), the delta
                                                   vs the v2.1.142 framing, and the coordinator-mode
                                                   live/dead check
```

## Suggested reading order

For someone understanding the swarm subsystem from scratch:

1. **`execution_modes_and_backend_registry.md`** — read this first. The BackendRegistry and the `isInProcessEnabled` (`ma`) switch are the load-bearing abstraction; every other doc assumes you know which executor is chosen and why. It also defines the shared `TeammateExecutor` interface both modes implement.
2. **`in_process_mode.md`** — the simpler of the two runtimes (no process boundary). The persistent agent loop + 6-priority poll loop here is the clearest illustration of how a teammate consumes its inbox between turns, and the `AsyncLocalStorage` isolation explains how concurrent teammates coexist in one process.
3. **`cross_process_mode.md`** — the second runtime. Read it after in-process so the contrast (type-the-command-into-a-pane spawn, full CLI/env reconstruction, no shared `AppState`) is clear.
4. **`mailbox_and_lifecycle_tools.md`** — the IPC + model-facing toolset that *both* runtimes share. Best read once you have seen both spawn paths, since the mailbox is what connects them and the permission bridge reuses it.
5. **`cross_validation.md`** — last. The named-TypeScript ground-truth mapping and the delta against v2.1.142 / v2.1.88 only make sense after the mechanisms above are understood.

## v2.1.156 framing

This is a **continuation / delta module**. The v2.1.142 tree already contained a `30_agent_team/` directory; the v2.1.156 tree did **not** until this build added it. Rather than re-deriving the whole subsystem, this module is re-framed around the structure that v2.1.156's bundle actually exposes:

- v2.1.142 framed the umbrella as **five** worker variants (in-process teammate, subagent, background agent, remote/cloud agent, daemon-side helpers) keyed off `AppState.tasks` type discriminators.
- v2.1.156's swarm code is organized around the **BackendRegistry executor split** — exactly **two** teammate execution modes (in-process vs. cross-process panes), unified by the registry, the file mailbox, and the TeamCreate/TeamDelete/SendMessage toolset. This module documents that split directly from the v2.1.156 source.

**One-line contrast with `36_background_agents/`:** the background fleet is a *different worker model* — daemon-supervised child processes with their own persisted lifecycle that **survive the leader**, reached over the daemon control protocol; agent-team teammates (both modes here) are **leader-owned**, talk over the **file mailbox**, and die with the leader REPL. This module covers only the agent-team/swarm subsystem and is out of scope for the daemon fleet.

## Symbol index

All obfuscated → readable mappings for this module live in the central index:

- [`../00_overview/symbol_index_core_features.md`](../00_overview/symbol_index_core_features.md) — **Module: Agent Team** (the canonical symbol table).
- [`../00_overview/symbol_additions_v2_1_156_agent_team.md`](../00_overview/symbol_additions_v2_1_156_agent_team.md) — the granular v2.1.156 additions for this module (BackendRegistry, both backends, mailbox, lifecycle tools).

This file is an index only and should not be expanded with implementation detail or a mapping table; symbol tables belong exclusively to the files above.
