# Agent Team / "swarm" — Readable-Source Restoration (v2.1.183)

> **What this is.** A *readable-source-level* reconstruction of the **entire** Agent-Team
> ("swarm") machine **as it exists in Claude Code v2.1.183** — not a delta, the *whole subsystem* —
> written as clean TypeScript organized the way the genuine Anthropic source tree (the v2.1.88
> named-TS at `/lyz/codespace/3rd/claude-code/src`) organizes it. It restores both the parts that
> are **byte-for-byte carryover** from v2.1.156 (mailbox, control-message protocol, backend
> registry, in-process runner, permission bridge, system-prompt addendum, gate/identity helpers)
> **and** the **v2.1.178 redesign** (implicit session team at startup, the Agent tool as the
> teammate spawner, the tmux `send-keys`→`respawn-pane` fix, SendMessage `"main"`/`uds:`/`bridge:`
> addressing, the coordinator-mode expansion, and the background-task survival fix).
>
> **Why it exists.** The sibling docs in `30_agent_team/` (`README.md`,
> `implicit_team_and_agent_tool_spawn.md`, `spawn_backends_and_tmux_fix.md`,
> `mailbox_lifecycle_and_sendmessage_delta.md`, `coordinator_and_background_survival.md`) are a
> *verified 2.1.156 → 2.1.183 delta*: they document only what the v2.1.178 redesign changed and
> defer the unchanged spine to the v2.1.156 baseline. **This directory is the source-level companion
> to that delta analysis** — it restores the full subsystem so you can read the implementation
> top-to-bottom without cross-referencing two version trees. Read this README, then the file you
> care about; jump to the delta docs when you want the *why-it-changed* narrative.
>
> Every behavior here is backed by a v2.1.183 line that was read directly; every reconstructed
> function carries a `// 2.1.183: <readable> = <obf> @<line>` anchor (all line numbers are
> `cli_inner_pretty.js`) so any claim can be re-verified in seconds.

---

## How to read these files (the three evidence tiers)

These files were built — and adversarially verified — under a strict evidence discipline (the full
rules live in [`_conventions.md`](./_conventions.md)):

1. **PRIMARY — truth.** The v2.1.183 obfuscated bundle
   `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines).
   Every symbol, constant, branch, and verbatim string was verified by reading the exact line(s).
   Obfuscated names re-mangle every build, so all were re-derived in this build (e.g. the master
   gate `R7`→`Sl`). Assets corroborate verbatim text:
   `extract/assets/tools/{Agent,SendMessage}.md` (verbatim tool metadata),
   `assets/feature_gates.json` (`tengu_amber_flint`, `tengu_coordinator_*`), `assets/env_vars.json`
   (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`, `CLAUDE_CODE_COORDINATOR_MODE`,
   `CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME`, `CLAUDE_CODE_TEAMMATE_COMMAND`).
2. **SCAFFOLD — readable logic & names.** The v2.1.183 delta docs in `30_agent_team/` (the five
   files linked above) plus the scout dossier `_scout_dossier_agent_team.md` supplied v2.1.183-specific
   anchors, readable names, and before/after analysis as a jump-start — each claim re-verified
   against the 183 bundle. For the *unchanged-carryover logic*, the v2.1.156 baseline
   (`../../../claude_code_v_2.1.156/analyze/30_agent_team/`) was the secondary scaffold.
3. **CONVENTION + REAL ANCESTOR — file shape & genuine names.** The v2.1.88 named-TS source. **Unlike
   the Workflow feature, the swarm is NOT gated out in v2.1.88 — it is a real, fully-implemented
   subsystem.** So v2.1.88 is both the *shape* template (file layout, `Tool`/`buildTool` factory,
   Zod usage, `feature()` gating, ESM `.js` import specifiers on `.ts`, React/Ink `.tsx` for UI)
   **and** a genuine readable ancestor for the carryover parts — real function names and logic are
   borrowed where v2.1.183 still does the same thing. **But the topology differs:** v2.1.88's
   `tools/TeamCreateTool/` and `tools/TeamDeleteTool/` are **deleted** in v2.1.183 (so no live files
   for them — they are mentioned only as the "before"), and v2.1.88 spawned teammates via the
   `team_name` parameter where v2.1.183 spawns via the Agent `name` + the implicit `teamContext`.
   **When behavior diverges, the 183 bundle wins;** the 88 file is cited only for the
   convention/name borrowed (each file header discloses the mirror path).

---

## File map

Every reconstructed `.ts`/`.tsx` file restores one slice of the subsystem and opens with a header
block listing its v2.1.183 source regions, its v2.1.88 ancestor/mirror path, the scaffold delta doc
used, and a one-line cross-validation note. The tree below mirrors the genuine source layout
(`utils/`, `utils/swarm/`, `utils/swarm/backends/`, `tools/<Tool>/`, `coordinator/`, `tasks/`).

```
reconstructed_source/
├── _conventions.md                         the 3-tier evidence rules + naming registry (read first)
├── README.md                               you are here — index + evidence model + delta/carryover map
│
├── coordinator/
│   └── coordinatorMode.ts                  coordinator-mode gate/prompt/context: turns the session into
│                                           an orchestrator spawning workers, with the v2.1.183 prompt + the
│                                           Workflow/Artifact worker-tool filters (DELTA: cross-session peers,
│                                           TaskStop worker-stop, TeamCreate/Delete dropped from worker tools)
│
├── tasks/
│   └── agentNotification.ts                the task-notification builder (G4e) + keepalive substrate that
│                                           implement the background-task-survival fix: route the notice to
│                                           the live owner and gate eviction on live agent:* children (DELTA)
│
├── tools/
│   ├── AgentTool/
│   │   ├── AgentTool.tsx                    the Agent tool def + the call() teammate-spawn ROUTING rewrite
│   │   │                                    (_ = Sl() ? A.teamContext; if (_ && s && !L)) — the centerpiece
│   │   │                                    of the redesign: the Agent tool IS the spawner (DELTA)
│   │   ├── constants.ts                     Agent tool name ("Agent"), legacy alias ("Task"), one-shot
│   │   │                                    built-in agent types (Explore/Plan) (CARRYOVER)
│   │   └── prompt.ts                        the Agent tool description builder: structured/legacy/coordinator
│   │                                        branches + the teammate-suppression hints (DELTA: hint dropped team_name)
│   │
│   ├── SendMessageTool/
│   │   ├── SendMessageTool.ts               the SendMessage tool def: validateInput + call() with the new
│   │   │                                    "main" routing leg, socket-address gate, dropped "*" broadcast (DELTA)
│   │   ├── constants.ts                     SendMessage tool name + the ListAgents tool name cited by the
│   │   │                                    "not a local socket address" rejection (CARRYOVER + new ref)
│   │   └── prompt.ts                        the compact markdown SendMessage prompt: recipient table now has a
│   │                                        "main" row in place of the "*" broadcast row (DELTA, one row)
│   │
│   └── TaskStopTool/
│       └── constants.ts                     TaskStop tool name — the coordinator's worker-stop verb (reuses the
│                                            generic background-task stopper, not a bespoke StopAgent) (CARRYOVER)
│
└── utils/
    ├── agentContext.ts                      TeamContext / TeammateContext shapes + the AsyncLocalStorage store
    │                                        the Agent tool reads at spawn (TeamContext re-derived from the
    │                                        implicit-team return literal) (DELTA shape + CARRYOVER store)
    ├── agentId.ts                           deterministic agent-id helpers (name@team, request-id format) +
    │                                        isTeammateSession; reserved-name consts (CARRYOVER)
    ├── agentSwarmsEnabled.ts                the master gate isAgentSwarmsEnabled (opt-in env/flag AND
    │                                        tengu_amber_flint); the USER_TYPE==='ant' bypass was dropped (CARRYOVER, re-mangled)
    ├── mailbox.ts                           the in-memory Mailbox class (in-process async queue with blocking
    │                                        receive) — the in-PROCESS sibling of the file mailbox (CARRYOVER)
    ├── peerAddress.ts                       socket-address parsing + isLocalSocketAddress for cross-session
    │                                        uds:/bridge: recipients, with new \\.\pipe\ named-pipe support (DELTA)
    ├── teammate.ts                          the IDENTITY module (88 utils/teammate.ts): the AsyncLocalStorage-or-$q
    │                                        accessors getAgentName/getTeamName/getTeammateColor/getAgentId/
    │                                        getParentSessionId/getDynamicTeamContext (+set/clear) (CARRYOVER)
    ├── teammateControlMessages.ts           the typed control-frame protocol carried over the mailbox
    │                                        (idle/permission/sandbox/shutdown/plan/mode-set builders+parsers) (CARRYOVER)
    ├── teammateMailbox.ts                   the file-based per-recipient JSON inbox (writeToMailbox: pre-create →
    │                                        lock → re-read → push → atomicWrite) — the universal transport (CARRYOVER)
    │
    └── swarm/
        ├── constants.ts                     swarm constants: tmux bin/holding-cmd ("cat"), teammate-command
        │                                    env var, 500 ms in-process poll, session-team name prefix (CARRYOVER + tmux-fix const)
        ├── inProcessRunner.ts               the AsyncLocalStorage in-process teammate loop (spawn → turn →
        │                                    idle → wait → repeat); turn-end now ARMS +30 s eviction (DELTA half of bg-fix)
        ├── leaderPermissionBridge.ts        the leader-side per-call canUseTool factory: ask → interactive
        │                                    dialog OR mailbox permission_request round-trip (CARRYOVER)
        ├── permissionSync.ts                the mailbox round-trip + in-memory poller registry the bridge
        │                                    drives (build/publish request, send response, resolve callback) (CARRYOVER)
        ├── spawnTeammate.ts                 the spawn DISPATCH + the three backend paths (in-process /
        │                                    split-pane / new-window); reads the implicit team, no team_name arg (DELTA topology)
        ├── teamHelpers.ts                   the TEAM-FILE I/O module (88 utils/swarm/teamHelpers.ts): team-file
        │                                    path + read/write/update/removeMember + session-cleanup registration (CARRYOVER)
        ├── teammateInit.ts                  initializeSessionTeam (j3f) — writes the implicit session team at
        │                                    CLI startup (session-<id[:8]>, leader-only roster) (DELTA, centerpiece)
        ├── teammatePromptAddendum.ts        the verbatim "# Agent Teammate Communication … you MUST use the
        │                                    SendMessage tool" system-prompt addendum (CARRYOVER, verbatim)
        │
        └── backends/
            ├── ITermBackend.ts              the iTerm2 pane backend (it2 session split/run); always used
            │                                it2-run not send-keys, so the tmux fix didn't touch it (CARRYOVER)
            ├── TmuxBackend.ts               the tmux pane backend — HOME of the v2.1.178 fix: panes hold "cat"
            │                                and the command is injected via respawn-pane -k -- <cmd> (DELTA)
            ├── detection.ts                 environment probes (am I in tmux/iTerm2? installed?) + the async
            │                                detectAndGetBackend resolver with swarm_backend_detect telemetry (CARRYOVER)
            ├── registry.ts                  the backend registry: in-process-vs-pane decision + lazily-cached
            │                                backend instances (the two-mode split) (CARRYOVER abstraction)
            ├── teammateModeSnapshot.ts      captures the teammate execution mode once at startup
            │                                (auto/tmux/in-process; default now "in-process") (CARRYOVER, default changed)
            └── types.ts                     the shared PaneBackend interface + registry-state/detection-result
                                             types that both concrete backends implement (CARRYOVER, pure types)
```

> Note on file boundaries: the v2.1.183 bundle is a single concatenated file, so several of these
> modules are co-located there (the spawn dispatcher, the three spawn paths, and the backends all
> live near each other @421006–423591). The split into the directory layout above follows the
> v2.1.88 module conventions; each file's header discloses where its content physically sits in the
> bundle. The behavior is faithful to those exact lines — only the grouping is a convention choice.

---

## What changed in the v2.1.178 redesign vs what is byte-for-byte carryover

The redesign was surgical: a large fraction of the subsystem is the same algorithm with only
re-mangled obfuscated names. The table below maps every reconstructed file to **DELTA** (touched by
the v2.1.178 redesign / a v2.1.183 fix) or **CARRYOVER** (unchanged from v2.1.156 except for
re-mangling). The six DELTA themes are: implicit-team init, Agent-tool spawn, tmux respawn-pane fix,
SendMessage main/bridge/uds, coordinator expansion, and background-survival. The CARRYOVER themes
are: mailbox, control messages, backend registry, in-process runner, permission bridge, prompt
addendum, and gate/identity.

| File | Status | Redesign theme / why |
|------|--------|----------------------|
| `utils/swarm/teammateInit.ts` | **DELTA** | implicit-team init — `initializeSessionTeam` (j3f) writes the session-scoped team at startup; v2.1.88 had no implicit team (TeamCreate did this) |
| `tools/AgentTool/AgentTool.tsx` | **DELTA** | Agent-tool spawn — `call()` routes to the teammate path on `_ = Sl() ? A.teamContext` + `if (_ && s && !L)`; replaces v2.1.156 `team_name` routing |
| `tools/AgentTool/prompt.ts` | **DELTA** | Agent-tool spawn — teammate-suppression hints reworded; dropped the now-deprecated `team_name` from the hint text |
| `utils/swarm/spawnTeammate.ts` | **DELTA** | Agent-tool spawn (topology) — leaf spawners read the implicit `teamContext.teamName` and throw "session team not initialized" if absent; no `team_name` arg |
| `utils/swarm/backends/TmuxBackend.ts` | **DELTA** | tmux respawn-pane fix — panes hold `cat`; the command is injected via `respawn-pane -k -- <cmd>` instead of `send-keys` + Enter |
| `utils/agentContext.ts` | **DELTA (shape)** | implicit-team init — the `TeamContext` shape is re-derived from the implicit-team return literal (the store itself is carryover) |
| `utils/peerAddress.ts` | **DELTA** | SendMessage main/bridge/uds — new `isLocalSocketAddress` gate + a `\\.\pipe\` named-pipe branch for cross-session addresses |
| `tools/SendMessageTool/SendMessageTool.ts` | **DELTA** | SendMessage main/bridge/uds — new `"main"` routing leg + socket-address gate; the `"*"` broadcast recipient + handler are removed |
| `tools/SendMessageTool/prompt.ts` | **DELTA** | SendMessage main/bridge/uds — recipient table swaps the `"*"` broadcast row for a `"main"` row |
| `coordinator/coordinatorMode.ts` | **DELTA** | coordinator expansion — cross-session peers (`uds:`/`bridge:`), `TaskStop` worker-stop, new Workflow/Artifact worker-tool filters; TeamCreate/Delete gone from worker tools |
| `tools/TaskStopTool/constants.ts` | **DELTA (ref)** | coordinator expansion — the coordinator's `${uP}` worker-stop verb; reuses the generic `TaskStop` name |
| `tasks/agentNotification.ts` | **DELTA** | bg-survival — `enqueueAgentNotification` (G4e) routes to the live owner + releases the child keepalive pin; new `<note>` |
| `utils/swarm/inProcessRunner.ts` | **DELTA (half of bg-fix)** | bg-survival — turn-end arms `evictAfter = now + EVICT_DELAY_MS`, gated by live `agent:*` keepalive reasons; otherwise the loop is carryover |
| `utils/swarm/backends/teammateModeSnapshot.ts` | **DELTA (default)** | the snapshot mechanism is carryover, but the default mode changed to `"in-process"` (v2.1.88 defaulted to `"auto"`) |
| `tools/SendMessageTool/constants.ts` | **DELTA (ref)** | SendMessage delta — carries the `ListAgents` name newly cited by the socket-address rejection (the `SendMessage` name itself is carryover) |
| `utils/teammateMailbox.ts` | **CARRYOVER** | mailbox — the file-based `writeToMailbox` / inbox-path algorithm (only the read/consume side `markSingleMessageAsRead` differs from v2.1.88, matching v2.1.156) |
| `utils/mailbox.ts` | **CARRYOVER** | mailbox — the in-memory `Mailbox` class is structurally byte-for-byte the v2.1.88 class |
| `utils/teammateControlMessages.ts` | **CARRYOVER** | control messages — the typed control-frame builders/parsers + `isControlMessage` type set are structurally unchanged |
| `utils/swarm/backends/registry.ts` | **CARRYOVER** | backend registry — the in-process-vs-pane two-mode split + cached backends (only the factory-state shape vs v2.1.88 module-lets differs) |
| `utils/swarm/backends/detection.ts` | **CARRYOVER** | backend registry — the env probes + the async backend resolver |
| `utils/swarm/backends/ITermBackend.ts` | **CARRYOVER** | backend registry — iTerm2 always used `it2 session run` (not send-keys), so the tmux fix did not touch it |
| `utils/swarm/backends/types.ts` | **CARRYOVER** | backend registry — the pure `PaneBackend` interface + registry/detection types |
| `utils/swarm/inProcessRunner.ts` (loop) | (see above) | in-process runner — the spawn/turn/idle/wait loop body is carryover; only the eviction-arming is the bg-fix DELTA |
| `utils/swarm/leaderPermissionBridge.ts` | **CARRYOVER** | permission bridge — the ask → dialog-or-mailbox two-path design is unchanged |
| `utils/swarm/permissionSync.ts` | **CARRYOVER** | permission bridge — the mailbox round-trip + poller registry (v2.1.156 already moved fully to the mailbox path) |
| `utils/swarm/teammatePromptAddendum.ts` | **CARRYOVER** | prompt addendum — verbatim-identical "you MUST use the SendMessage tool" block |
| `utils/agentSwarmsEnabled.ts` | **CARRYOVER** | gate/identity — same opt-in-AND-`tengu_amber_flint` semantics (only re-mangled; the `USER_TYPE==='ant'` bypass was removed) |
| `utils/agentId.ts` | **CARRYOVER** | gate/identity — the deterministic `name@team` / request-id helpers + `isTeammateSession` |
| `utils/teammate.ts` | **CARRYOVER** | gate/identity — the IDENTITY accessor module (88 `utils/teammate.ts`): `getAgentName`/`getTeamName`/`getTeammateColor`/`getAgentId`/`getParentSessionId`/`getDynamicTeamContext` over the ALS-or-`$q` context |
| `utils/swarm/teamHelpers.ts` | **CARRYOVER** | the TEAM-FILE I/O module (88 `utils/swarm/teamHelpers.ts`): team-file path + read/write + `updateTeamFile`/`removeTeamMember`/`registerTeamForSessionCleanup` (`config.json` under `<teamsDir>/<team>/`) |
| `utils/swarm/constants.ts` | **CARRYOVER** | gate/identity — the swarm constants block (the tmux `cat` holding-command const is the one tmux-fix-adjacent addition) |
| `tools/AgentTool/constants.ts` | **CARRYOVER** | gate/identity — the Agent tool name / legacy `Task` alias / one-shot built-in types |

---

## External dependencies (not reconstructed; paths mirror the real source tree)

The reconstructed files import a number of modules that live **outside** this subsystem (they are
shared infrastructure or sibling tools). These are intentionally **not** reconstructed — the
import specifiers are written with the real source-tree paths so the layout stays faithful, and a
reviewer can locate the genuine module by its specifier. They fall into these groups (specifiers
are relative to the importing file):

- **Node / third-party:** `async_hooks` (AsyncLocalStorage), `fs`, `fs/promises`, `path`,
  `react` (Ink `.tsx`), `zod/v4` (schemas), `@anthropic-ai/sdk/resources/messages.mjs` (message types).
- **Debug / telemetry / logging:** `../debug.js` & `../../debug.js` & `../../utils/debug.js`,
  `../log.js`, `../telemetry.js` & `../../telemetry.js`, `../services/analytics/index.js`,
  `../services/analytics/growthbook.js` (the `tengu_amber_flint` gate lookup).
- **Tool / schema framework:** `../../Tool.js` (the `buildTool` factory + `ValidationResult`),
  `../../utils/lazySchema.js`, `../entrypoints/sdk/coreSchemas.js`,
  `../permissions/PermissionUpdateSchema.js`.
- **Env / platform / fs primitives:** `./envUtils.js`, `../../env.js`, `../../platform.js`,
  `./fs.js`, `./lockfile.js`, `../../execFileNoThrow.js`, `../bash/shellQuote.js`,
  `./constants/xml.js`, `../../string.js`, `../../array.js` / `./array.js`,
  `../../utils/slowOperations.js` / `./slowOperations.js`, `./bundledMode.js`.
- **Signal / errors:** `./signal.js` (the `createSignal` change-notifier), `../errors.js` /
  `../../utils/errors.js` (error helpers).
- **Permissions / auth / model:** `../../utils/permissions/{PermissionMode,permissions,toolPermissionContext}.js`,
  `../../utils/auth.js`, `../../utils/model/agent.js`.
- **Prompts / embedded tools:** `../../constants/prompts.js`, `../../utils/embeddedTools.js`,
  `../FileReadTool/prompt.js`, `../GrepTool/prompt.js`.
- **State / bootstrap:** `../../bootstrap/state.js` & `../../../bootstrap/state.js`,
  `./tasks.js` (the v2.1.88 `tasks` carryover surface), `./remoteIsolation.js`, `./it2Setup.js`.
  (Note: `teamHelpers.js` is now RECONSTRUCTED in-tree at `utils/swarm/teamHelpers.ts` — no longer external.)
- **Sibling-tool / subagent surfaces referenced but not reconstructed here:**
  `./agentColorManager.js`, `./agentToolUtils.js`, `./forkSubagent.js`,
  `./PaneBackendExecutor.js`, `./InProcessBackend.js`, `./spawnInProcess.js`
  (these are the v2.1.88 ancestor names cited by some headers — in v2.1.183 their behavior is
  folded into the reconstructed `spawnTeammate.ts` / `registry.ts` / `inProcessRunner.ts`).

A handful of "external" specifiers actually resolve to sibling files that **are** reconstructed in
this tree (e.g. `../agentId.js`, `../agentContext.js`, `../teammate.js`, `../teammateMailbox.js`,
`../teammateControlMessages.js`, `./backends/registry.js`, `./backends/detection.js`,
`../tools/AgentTool/constants.js`, `../tools/SendMessageTool/constants.js`,
`../tools/TaskStopTool/constants.js`, `../../coordinator/coordinatorMode.js`); those are the
in-tree edges, not out-of-scope dependencies.

---

## Verification & manifests

- **Symbol manifest:** the consolidated obfuscated→readable table for this subsystem (delta symbols
  **plus** the full-reconstruction additions surfaced here) lives at
  [`../../00_overview/symbol_additions_v2_1_183_agent_team.md`](../../00_overview/symbol_additions_v2_1_183_agent_team.md).
  Each reconstructed `.ts` file is itself a line-anchored symbol map for its slice (via its
  `// 2.1.183: <readable> = <obf> @<line>` comments), so per-file lookups don't need the central
  table.
- **Cross-validation report:** the default-to-FAIL adversarial review of the `30_agent_team` delta
  tree (every cited anchor re-read against the v2.1.183 bundle, with the off-by-N and any
  mis-citations itemized) is at
  [`../../00_overview/cross_validation_report_agent_team.md`](../../00_overview/cross_validation_report_agent_team.md).

For *what changed* between v2.1.156 and v2.1.183 specifically — the redesign framing, the
before/after contrast table, and the carryover links to the v2.1.156 baseline — read the delta docs
one level up: [`../README.md`](../README.md),
[`../implicit_team_and_agent_tool_spawn.md`](../implicit_team_and_agent_tool_spawn.md),
[`../spawn_backends_and_tmux_fix.md`](../spawn_backends_and_tmux_fix.md),
[`../mailbox_lifecycle_and_sendmessage_delta.md`](../mailbox_lifecycle_and_sendmessage_delta.md),
[`../coordinator_and_background_survival.md`](../coordinator_and_background_survival.md).

---

## Suggested reading order

1. **`utils/agentSwarmsEnabled.ts`** — is the subsystem even on? (opt-in env/flag AND `tengu_amber_flint`).
2. **`utils/swarm/teammateInit.ts`** — the centerpiece: how the implicit session team is materialized at startup.
3. **`tools/AgentTool/AgentTool.tsx` → `utils/swarm/spawnTeammate.ts`** — the Agent tool as spawner, and the three backend spawn paths it dispatches to.
4. **`utils/swarm/backends/{registry,detection,teammateModeSnapshot,types}.ts` → `TmuxBackend.ts` / `ITermBackend.ts`** — how a teammate process/async-task is actually created, including the tmux respawn-pane fix.
5. **`utils/swarm/inProcessRunner.ts`** — the in-process teammate turn loop and its eviction-arming half of the bg-survival fix.
6. **`utils/{teammateMailbox,mailbox,teammateControlMessages}.ts` → `utils/swarm/{leaderPermissionBridge,permissionSync}.ts`** — the IPC the teammate uses to talk back, the typed control frames, and the permission round-trip.
7. **`tools/SendMessageTool/{prompt,SendMessageTool,constants}.ts` → `utils/peerAddress.ts`** — what the model can say with SendMessage now (the `"main"` recipient + cross-session `uds:`/`bridge:` addressing).
8. **`coordinator/coordinatorMode.ts` → `tools/TaskStopTool/constants.ts` → `tasks/agentNotification.ts`** — the orchestration layer, the worker-stop verb, and the background-task-survival fix.
9. **`utils/swarm/teammatePromptAddendum.ts`, `utils/{agentId,agentContext,teammate}.ts`, `utils/swarm/constants.ts`, `tools/AgentTool/{constants,prompt}.ts`** — the identity/constants/prompt leaves, read as needed.

---

## Related Symbols

> Symbol mappings live in the central index and the per-feature additions file (never as
> obf→readable tables in these docs). Each reconstructed `.ts` file is itself the authoritative,
> line-anchored symbol map for its slice (via its `// 2.1.183: <readable> = <obf> @<line>` comments).
>
> - [symbol_additions_v2_1_183_agent_team.md](../../00_overview/symbol_additions_v2_1_183_agent_team.md) — the consolidated v2.1.183 Agent-Team symbol table (delta symbols **plus** the full-reconstruction additions surfaced here).
> - [symbol_index_core_features.md](../../00_overview/symbol_index_core_features.md) — Agent Team / Swarm is the home module (Plan, Hooks, Skills, Compact, Todo, Thinking, Steering, CLI).
> - [symbol_index_core_execution.md](../../00_overview/symbol_index_core_execution.md) — the `pi`/`buildTool` factory, the Agent tool, and subagent spawn.
> - [symbol_index_infra_platform.md](../../00_overview/symbol_index_infra_platform.md) — permission-rule lookup, settings schema, the `tengu_amber_flint` gate.
> - [symbol_index_infra_integration.md](../../00_overview/symbol_index_infra_integration.md) — the tmux/iTerm2 backends and the `/config`-surfaced toggles.

Anchor entry points (re-derived v2.1.183 names; each file is the full map):

- `isAgentSwarmsEnabled` (`Sl`, cli_inner_pretty.js:293831) — the master gate → `utils/agentSwarmsEnabled.ts`.
- `initializeSessionTeam` (`j3f`, cli_inner_pretty.js:682765) / `sessionTeamName` (`xic`, cli_inner_pretty.js:682752) — the implicit team → `utils/swarm/teammateInit.ts`.
- `agentTool` (`f3n`, cli_inner_pretty.js:423505) and the `call()` routing @423542–423591 — the spawner → `tools/AgentTool/AgentTool.tsx`.
- spawn dispatch `dispatchTeammateSpawn` (`HDp`/`cqa`, cli_inner_pretty.js:423041/423053) — the three backend paths → `utils/swarm/spawnTeammate.ts`.
- `sendCommandViaRespawn` (`a3n`, cli_inner_pretty.js:421874) and `PANE_HOLD_COMMAND` (`Gke`="cat", cli_inner_pretty.js:362642) — the tmux fix → `utils/swarm/backends/TmuxBackend.ts`.
- `writeToMailbox` (`$A`, cli_inner_pretty.js:365950) and `getTeamsDir` (`Gbe`, cli_inner_pretty.js:735) — the file mailbox → `utils/teammateMailbox.ts`.
- `sendMessageTool` (`p$p`, cli_inner_pretty.js:434568) and `parseSocketAddress`/`isLocalSocketAddress` (`LLa`/`Lhe`, cli_inner_pretty.js:359974/359981) — SendMessage + addressing → `tools/SendMessageTool/SendMessageTool.ts`, `utils/peerAddress.ts`.
- `getCoordinatorSystemPrompt` (`bvd`, cli_inner_pretty.js:221940) and the `TaskStop` name (`uP`, cli_inner_pretty.js:220834) — coordinator → `coordinator/coordinatorMode.ts`, `tools/TaskStopTool/constants.ts`.
- `enqueueAgentNotification` (`G4e`, cli_inner_pretty.js:445827) with keepalive `YR`/`Lye` (cli_inner_pretty.js:445753/445750) — the bg-survival fix → `tasks/agentNotification.ts`.
