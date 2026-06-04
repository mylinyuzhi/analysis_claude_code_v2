# Cross-Validation Ledger — Agent Team / Swarm (v2.1.156)

> Module: `30_agent_team/` (Claude Code v2.1.156, bundle `cli_inner_pretty.js`, 649,979 lines).
> Subsystem internal name: **"swarm"** (telemetry `swarm_*`, user-facing error text "agent swarms").
> This is the consolidated **verification ledger** for the module: it maps every major
> obfuscated symbol back to its v2.1.88 named-TypeScript counterpart (the cleanest readable
> precursor, `/lyz/codespace/3rd/claude-code/src/...`), states what is byte-identical vs evolved,
> and reconciles this 2.1.156 module against the v2.1.142 `30_agent_team/` analysis tree.

## Scope

This ledger covers **only** the agent-team subsystem and its **two execution modes**: the
**in-process** teammate (an async task in the leader's own `claude` process, ALS-isolated) and
the **cross-process pane** teammate (a separate `claude` OS process in a tmux pane / iTerm2
split). It does **not** re-validate the daemon/background-agent fleet (`36_background_agents/`),
which is a different worker model (daemon-supervised child processes that outlive the REPL); the
single contrast is noted once below.

Because cross-validation is a *verification* artifact (like the `00_overview/` reports), the
v2.1.156→v2.1.88 symbol-mapping section uses a **table** by deliberate exception to the
module-doc list-format rule. The four sibling module docs
([execution_modes_and_backend_registry.md](./execution_modes_and_backend_registry.md),
[in_process_mode.md](./in_process_mode.md), [cross_process_mode.md](./cross_process_mode.md),
[mailbox_and_lifecycle_tools.md](./mailbox_and_lifecycle_tools.md)) use list format only.

---

## Related Symbols

> Symbol mappings live ONLY in the central index files and `symbol_additions_v2_1_156_agent_team.md`:
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, Tools, State)
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (**Agent Team / Swarm** lives here)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Permissions, MCP)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions/objects covered by this ledger (list format, per CLAUDE.md):

- `isInProcessEnabled` (obfuscated: `ma`) — the in-process-vs-pane switch (`cli_inner_pretty.js:381076`).
- `getTeammateExecutor` (obfuscated: `NT_`) — executor dispatch entry point (`cli_inner_pretty.js:381098`).
- `detectAndGetBackend` (obfuscated: `jLH`) — pane backend detection tree (`cli_inner_pretty.js:380965`).
- `createBackendRegistry` (obfuscated: `y94`) — registry state factory (the structural delta) (`cli_inner_pretty.js:380930`).
- `InProcessBackend` (obfuscated: `K94`) / `PaneBackendExecutor` (obfuscated: `L94`) — the two `TeammateExecutor` implementations (`cli_inner_pretty.js:380062`, `380388`).
- `runInProcessTeammate` (obfuscated: `JT_`) — the in-process agent loop (`cli_inner_pretty.js:379714`).
- `waitForNextPromptOrShutdown` (obfuscated: `DT_`) — the 6-priority poll loop (`cli_inner_pretty.js:379637`).
- `buildTeammateCliFlags` (obfuscated: `X94`) / `buildTeammateEnvString` (obfuscated: `WT$`) / `TEAMMATE_ENV_PASSTHROUGH` (obfuscated: `PT_`) — the evolved CLI/env replay builders (`cli_inner_pretty.js:380309`, `380336`, `380350`).
- `writeToMailbox` (obfuscated: `aA`) — the universal file-mailbox IPC (`cli_inner_pretty.js:338306`).
- `coordinatorModeRaw` (obfuscated: `cI`) / `isCoordinatorMode` (obfuscated: `Bp`) / `isCcrCoordinator` (obfuscated: `Mk5`) — the coordinator-mode gate, resolved live/dead below (`cli_inner_pretty.js:216440`, `216460`, `216463`).

---

## v2.1.156 → v2.1.88 mapping

The v2.1.88 named TypeScript under `/lyz/codespace/3rd/claude-code/src/` is the **cleanest readable
precursor** (the tree's only version token is `2.1.83`, so it is a ~v2.1.83-88 snapshot). The
2.1.156 bundle is an almost line-for-line evolution of this code. The table below maps each major
obfuscated symbol to its named-TS file:line, with a confidence rating and a
`byte-identical | evolved | new` classification. "byte-identical" means the *logic* is identical
modulo obfuscation (the registry's state-holding migration is treated as a structural-only
evolution, called out separately).

### Backend Registry (`registry.ts`)

| v2.1.156 (obfuscated) | Readable name | v2.1.88 named-TS file:line | Confidence | Status |
|------------------------|---------------|----------------------------|------------|--------|
| `ma` @381076 | `isInProcessEnabled` | `utils/swarm/backends/registry.ts:351` | High | byte-identical (branch-for-branch) |
| `jLH` @380965 | `detectAndGetBackend` | `registry.ts:136` | High | byte-identical (priority-for-priority) |
| `NT_` @381098 | `getTeammateExecutor` | `registry.ts:425` | High | byte-identical |
| `ET_` @381102 | `getPaneBackendExecutor` | `registry.ts:442` | High | byte-identical |
| `S94` @381094 | `getInProcessBackend` | `registry.ts:404` | High | byte-identical |
| `NU6` @381091 | `getResolvedTeammateMode` | `registry.ts:396` | High | byte-identical |
| `kU6` @381070 | `markInProcessFallback` | `registry.ts:326` | High | byte-identical |
| `LSH` @381056 | `getBackendByType` | `registry.ts:295` | High | byte-identical |
| `YeH` @381064 | `getCachedBackend` | `registry.ts:308` | High | byte-identical |
| `vU6` @381067 | `getCachedDetectionResult` | `registry.ts:317` | High | byte-identical |
| `AeH` @380942 | `ensureBackendsRegistered` | `registry.ts:74` | High | evolved (lazy `import()` semantics same; registry-object threaded) |
| `GU6` @380950 | `registerTmuxBackend` | `registry.ts:85` | High | byte-identical |
| `VU6` @380953 | `registerITermBackend` | `registry.ts:93` | High | byte-identical (same debug log) |
| `BW8` @380956 | `createTmuxBackendInstance` (`createTmuxBackend`) | `registry.ts:106` | High | byte-identical (same throw string) |
| `h94` @380960 | `createITermBackendInstance` (`createITermBackend`) | `registry.ts:119` | High | byte-identical (same throw string) |
| `vT_` @381034 | `getTmuxInstallInstructions` | `registry.ts:259` | High | byte-identical (per-OS text + "agent swarms" wording) |
| `EU6` @381110 | `resetBackendDetection` | `registry.ts:457` | High | evolved (clears registry-object fields not module `let`s) |
| `y94` @380930 | `createBackendRegistry` | `registry.ts:26-66` (module-level `let`s) | High | **new** (state-holding form; see "What evolved") |
| `NS` @381118 | `globalBackendRegistry` | (implicit — module-level state) | High | new |

### Teammate-mode snapshot (`teammateModeSnapshot.ts`)

| v2.1.156 (obfuscated) | Readable name | v2.1.88 named-TS file:line | Confidence | Status |
|------------------------|---------------|----------------------------|------------|--------|
| `LT_` @380280 | `setCliTeammateModeOverride` | `teammateModeSnapshot.ts:25` | High | byte-identical |
| `XU6` @380283 | `getCliTeammateModeOverride` | `teammateModeSnapshot.ts:33` | High | byte-identical |
| `LU6` @380286 | `clearCliTeammateModeOverride` | `teammateModeSnapshot.ts:43` | High | byte-identical |
| `D94` @380289 | `captureTeammateModeSnapshot` | `teammateModeSnapshot.ts:56` | High | evolved (config read via `Q1(...).value` getter, not `getGlobalConfig().teammateMode`) |
| `JSH` @380293 | `getTeammateModeFromSnapshot` | `teammateModeSnapshot.ts:75` | High | byte-identical |
| `PEq` @49109 | `teammateModeEnum` | `teammateModeSnapshot.ts:13` (`TeammateMode` type) | High | byte-identical (`["auto","tmux","in-process"]`) |

### Detection (`detection.ts`)

| v2.1.156 (obfuscated) | Readable name | v2.1.88 named-TS file:line | Confidence | Status |
|------------------------|---------------|----------------------------|------------|--------|
| `MhH` @336159 | `isInsideTmuxSync` | `detection.ts:36` | High | byte-identical (reads captured `TMUX`) |
| `Ga` @336178 | `isInsideTmux` (async, cached) | `detection.ts:50` | High | byte-identical |
| `h6H` @336192 | `isInITerm2` | `detection.ts:90` | High | byte-identical (3 indicators) |
| `kXH` @336189 | `isTmuxAvailable` | `detection.ts:73` (`tmux -V`) | High | byte-identical |
| `MG$` @336199 | `isIt2CliAvailable` | `detection.ts:117` (`it2 session list`) | High | byte-identical (same `--version` caveat comment) |
| `GsH` @336209 | `IT2_COMMAND` (`"it2"`) | `detection.ts:109` | High | byte-identical |

### Executors (`InProcessBackend.ts`, `PaneBackendExecutor.ts`)

| v2.1.156 (obfuscated) | Readable name | v2.1.88 named-TS file:line | Confidence | Status |
|------------------------|---------------|----------------------------|------------|--------|
| `K94` @380062 | `InProcessBackend` | `backends/InProcessBackend.ts:38` | High | evolved (taskRegistry abstraction; see below) |
| `_94` @380172 | `createInProcessBackend` | `backends/InProcessBackend.ts:337` | High | byte-identical |
| `L94` @380388 | `PaneBackendExecutor` | `backends/PaneBackendExecutor.ts:39` | High | byte-identical (spawn/sendMessage/terminate/kill/isActive 1:1) |
| `P94` @380498 | `createPaneBackendExecutor` | `backends/PaneBackendExecutor.ts:350` | High | byte-identical |

### In-process runner (`inProcessRunner.ts`)

| v2.1.156 (obfuscated) | Readable name | v2.1.88 named-TS file:line | Confidence | Status |
|------------------------|---------------|----------------------------|------------|--------|
| `JT_` @379714 | `runInProcessTeammate` | `inProcessRunner.ts:883` | High | evolved (`standalone` + `shutdownRequested` poll additions; taskRegistry) |
| `qeH` @380016 | `startInProcessTeammate` | `inProcessRunner.ts:1544` | High | byte-identical |
| `DT_` @379637 | `waitForNextPromptOrShutdown` (poll loop) | `inProcessRunner.ts:697` | High | evolved (6 priorities vs the v2.1.88 set; `standalone` skip) |
| `fT_` @380022 | `POLL_INTERVAL_MS` (`500`) | `inProcessRunner.ts:697` / `:114` | High | byte-identical |
| `$94` @379595 | `notifyTeamLeadIdle` | `inProcessRunner.ts` (idle path) | High | byte-identical |
| `jU6` @379421 | `TEAMMATE_SYSTEM_PROMPT_ADDENDUM` | `swarm/teammatePromptAddendum.ts` | High | byte-identical (verbatim text) |
| `CW8` @381458 | `spawnInProcessTeammate` | `swarm/spawnInProcess.ts` | High | evolved (`taskRegistry.register` vs raw `setAppState`) |
| `bW8` @381513 | `killInProcessTeammate` | `swarm/spawnInProcess.ts` | High | byte-identical |

### InProcessTeammateTask helpers (`InProcessTeammateTask.tsx`)

| v2.1.156 (obfuscated) | Readable name | v2.1.88 named-TS file:line | Confidence | Status |
|------------------------|---------------|----------------------------|------------|--------|
| `xW8` @381583 | `requestTeammateShutdown` | `tasks/InProcessTeammateTask/InProcessTeammateTask.tsx:35` | High | byte-identical |
| `RW8` @381589 | `appendTeammateMessage` | `InProcessTeammateTask.tsx:51` | High | byte-identical |
| `weH` @381595 | `injectUserMessageToTeammate` | `InProcessTeammateTask.tsx:68` | High | byte-identical |
| `l6H` @381601 | `findTeammateTaskByAgentId` | `InProcessTeammateTask.tsx:92` | High | byte-identical |
| `ZSH` @381610 | `getAllInProcessTeammateTasks` | `InProcessTeammateTask.tsx:113` | High | byte-identical |
| `e_H` @381613 | `getRunningTeammatesSorted` | `InProcessTeammateTask.tsx:123` | High | byte-identical |

### CLI/env replay builders (`spawnUtils.ts`)

| v2.1.156 (obfuscated) | Readable name | v2.1.88 named-TS file:line | Confidence | Status |
|------------------------|---------------|----------------------------|------------|--------|
| `J94` @380305 | `resolveTeammateExecPath` (`getTeammateCommand`) | `swarm/spawnUtils.ts:23` | High | byte-identical |
| `X94` @380309 | `buildTeammateCliFlags` (`buildInheritedCliFlags`) | `swarm/spawnUtils.ts:38` | High | **evolved** (`skipModel`, `--permission-mode auto`, `--plugin-url`, `auto`/`mantle` branches) |
| `WT$` @380336 | `buildTeammateEnvString` (`buildInheritedEnvVars`) | `swarm/spawnUtils.ts:135` | High | **evolved** (passthrough list grown; secure-storage) |
| `PT_` @380350 | `TEAMMATE_ENV_PASSTHROUGH` (`TEAMMATE_ENV_VARS`) | `swarm/spawnUtils.ts:96` | High | **evolved** (17 → 35 entries) |

### TmuxBackend / ITermBackend (`TmuxBackend.ts`, `ITermBackend.ts`)

| v2.1.156 (obfuscated) | Readable name | v2.1.88 named-TS file:line | Confidence | Status |
|------------------------|---------------|----------------------------|------------|--------|
| `ZU6` @380545 | `TmuxBackend` | `backends/TmuxBackend.ts:93` | High | evolved (socket-path router; see below) |
| `kS` @380537 | `runTmuxInSwarmSocket` (`runTmuxInUserSession`) | `TmuxBackend.ts:77` | High | **evolved** (optional `-S <socket>`) |
| `BE` @380542 | `runTmuxInSwarmLabel` (`runTmuxInSwarm`) | `TmuxBackend.ts:87` | High | byte-identical (`-L <label>`) |
| `ZT_` @380517 | `acquirePaneCreationLock` | `TmuxBackend.ts` (pane-create lock) | Medium | byte-identical (promise-chain mutex) |
| `TU6` @380820 | `ITermBackend` | `backends/ITermBackend.ts:79` | High | byte-identical (it2 CLI) |

### Mailbox + lifecycle tools (`teammateMailbox.ts`, tool dirs)

| v2.1.156 (obfuscated) | Readable name | v2.1.88 named-TS file:line | Confidence | Status |
|------------------------|---------------|----------------------------|------------|--------|
| `aA` @338306 | `writeToMailbox` | `utils/teammateMailbox.ts:134` | High | evolved (collapsed to file-only; see below) |
| `h_H` @338286 | `readMailbox` | `teammateMailbox.ts:84` | High | byte-identical |
| `whH` @338301 | `readUnreadMessages` | `teammateMailbox.ts:115` | High | byte-identical |
| `JG$` @338333 | `markMessageAsReadByIndex` | `teammateMailbox.ts:201` | High | byte-identical |
| `jhH` @338272 | `getInboxPath` | `teammateMailbox.ts:56` | High | byte-identical |
| `VsH` @338516 | `createShutdownRequestMessage` | `teammateMailbox.ts:772` | High | byte-identical |
| `NXH` @338554 | `isShutdownRequest` | `teammateMailbox.ts:868` | High | byte-identical |
| `oJ8` @338544 | `sendShutdownRequestToMailbox` | `teammateMailbox.ts:831` | High | byte-identical |
| `PG$` @338422 | `createIdleNotification` | `teammateMailbox.ts:410` | High | byte-identical |
| `tY` @336140 | `TEAM_LEAD_NAME` (`"team-lead"`) | `teammateMailbox.ts` (const) | High | byte-identical |
| `rd`/`Oo`/`cf` @216438/216439/216283 | `TeamCreate`/`TeamDelete`/`SendMessage` | `tools/{TeamCreateTool,TeamDeleteTool,SendMessageTool}/constants.ts` | High | evolved (SendMessage simplified) |
| `OT_` @379430 | `createTeammateCanUseTool` (permission bridge) | `swarm/leaderPermissionBridge.ts` + `permissionSync.ts` | High | byte-identical (mailbox-polled permission sync) |
| `R7` @240766 | `isAgentTeamsEnabled` (master gate) | `utils/teammate.ts` (gate) | High | byte-identical (`tengu_amber_flint`) |

---

## What is byte-identical

The **core decision logic of the subsystem is byte-identical** to the v2.1.88 named TypeScript,
modulo obfuscation. Concretely:

### The execution-mode switch (`isInProcessEnabled` / `ma`)

`ma` @`cli_inner_pretty.js:381076` matches `isInProcessEnabled` @`registry.ts:351`
**branch-for-branch**:

- The non-interactive guard (`R6()` ↔ `getIsNonInteractiveSession()`) is checked first, before the
  mode is read (`cli_inner_pretty.js:381077` ↔ `registry.ts:354`).
- The explicit `"in-process"` → `true` and `"tmux"` → `false` branches (`cli_inner_pretty.js:381079-381081`
  ↔ `registry.ts:364-367`).
- The auto-mode `inProcessFallbackActive` short-circuit, then `!insideTmux && !inITerm2`
  (`cli_inner_pretty.js:381082-381088` ↔ `registry.ts:368-383`).

The most subtle correctness property — the fallback bit is read **only** in the auto branch so that
a mid-session explicit `"tmux"` still takes effect — is carried verbatim from the v2.1.88 comment at
`registry.ts:369-371`. The 2.1.156 obfuscated form preserves it exactly because the bit is checked
*inside* the `else` (auto) block (`cli_inner_pretty.js:381082`), never in the explicit branches.

### The pane detection tree (`detectAndGetBackend` / `jLH`)

`jLH` @`cli_inner_pretty.js:380965` matches `detectAndGetBackend` @`registry.ts:136`
**priority-for-priority**, including:

- The cache short-circuit (`cli_inner_pretty.js:380966-380967` ↔ `registry.ts:141-146`).
- Priority 1 insideTmux → tmux native; Priority 2 iTerm2 → `getPreferTmuxOverIterm2` → it2 →
  ITerm native, else tmux fallback with `needsIt2Setup: !preferTmux`, else throw; Priority 3 tmux
  external, else throw (`cli_inner_pretty.js:380970-381033` ↔ `registry.ts:158-253`).
- The exact throw strings: `"iTerm2 detected but it2 CLI not installed. Install it2 with: pip install it2"`
  (`cli_inner_pretty.js:380975` ↔ `registry.ts:228-230`), and the per-OS `getTmuxInstallInstructions`
  text including the literal **"agent swarms"** wording (`cli_inner_pretty.js:381034-381054` ↔
  `registry.ts:259-285`) — the wording that confirms the "swarm" internal name.

The `swarm_backend_detect` telemetry leaves (`SH`/`t$`/`uH`) are new vs the v2.1.88 source (which
emits none here), but they are leaf-level observability and do not change the tree.

### The teammate-mode snapshot & detection probes

`teammateModeSnapshot.ts` and `detection.ts` are byte-identical (see the table above). The snapshot
precedence is **CLI override > config > "auto"** in both, the init-bug `logError` + lazy-capture
safety net is present in both (`cli_inner_pretty.js:380294-380296` ↔ `teammateModeSnapshot.ts:76-86`),
and `detection.ts` carries the same two load-bearing comments: that `isInsideTmuxSync` reads the
*original captured* `TMUX` (because Shell.ts overrides it) and that `isIt2CliAvailable` uses
`it2 session list` rather than `--version` (because `--version` succeeds even when the iTerm2 Python
API is off).

### The pane executor & the in-process runner core

`PaneBackendExecutor` (`L94`) maps 1:1 to `PaneBackendExecutor.ts:39`: the two-phase spawn
(create empty pane → type `cd … && env … claude --agent-id …` into it), the `spawnedTeammates`
map, the one-shot cleanup hook, the `!insideTmux ⇒ useExternalSession` negation, and the
graceful-`terminate`-via-mailbox vs forceful-`kill`-via-pane split are all faithful. The runner's
agent-loop body, the 500 ms poll interval, the model-decided (not auto-approved) shutdown
(`inProcessRunner.ts:687, 1364-1367`), and the `messages: []` retention-hygiene strip at spawn
(`InProcessBackend.ts:119-122`) are all carried through.

### The mailbox protocol

The concurrency-safe write (`writeToMailbox` lock → re-read → push → atomic write), the
flip-don't-delete consume (`markMessageAsReadByIndex`), the `"team-lead"` distinguished recipient,
the shutdown/idle/permission message builders, and the leader↔teammate permission bridge are all
byte-identical to `teammateMailbox.ts` / `leaderPermissionBridge.ts` / `permissionSync.ts`.

---

## What evolved since v2.1.88

Five concrete evolutions, all verified against both trees:

### 1. Registry state lifted from module `let`s into a passed-in object

**Diff:** v2.1.88 holds 8 pieces of session state — `cachedBackend`, `cachedDetectionResult`,
`backendsRegistered`, `cachedInProcessBackend`, `cachedPaneBackendExecutor`,
`inProcessFallbackActive`, `TmuxBackendClass`, `ITermBackendClass` — as **module-level `let`
variables** (`registry.ts:26-66`). v2.1.156 packs the *same 8 fields* into the object returned by
`createBackendRegistry` (`y94` @`cli_inner_pretty.js:380930`) and threads it as a trailing
`reg = NS` parameter on every registry function (e.g. `function ma(H = NS)` @`381076`).

```javascript
// ============================================
// createBackendRegistry - the v2.1.156 state-holding form (vs v2.1.88 module-level lets)
// Location: cli_inner_pretty.js:380930-380941
// ============================================

// ORIGINAL (for source lookup):
function y94() {
  return { cachedBackend: null, cachedDetectionResult: null, backendsRegistered: !1,
    cachedInProcessBackend: null, cachedPaneBackendExecutor: null, inProcessFallbackActive: !1,
    TmuxBackendClass: null, ITermBackendClass: null };
}

// READABLE (for understanding):
function createBackendRegistry() {            // v2.1.88 had these 8 as module-level `let`s
  return { cachedBackend: null, cachedDetectionResult: null, backendsRegistered: false,
    cachedInProcessBackend: null, cachedPaneBackendExecutor: null, inProcessFallbackActive: false,
    TmuxBackendClass: null, ITermBackendClass: null };
}

// Mapping: y94→createBackendRegistry; the 8 fields ↔ registry.ts:26-66 module-level lets
```

**Why it matters / trade-off:** Functionally equivalent (the singleton `globalBackendRegistry`,
`NS` @`381118`, is created once at module init so production behavior is unchanged). The object
form makes the registry **unit-testable against a fresh `createBackendRegistry()`** without
process-global leakage between tests, and lets `resetBackendDetection` clear fields rather than
re-assign module `let`s. This is the **only structural** delta in the registry; it is *not* a
behavioral change.

### 2. Backend-detection branches: a service-tier + telemetry layer, same tree shape

The detection *tree* is unchanged, but two non-structural additions appear in v2.1.156:
- `swarm_backend_detect` telemetry on every leaf (`SH`/`t$`/`uH` at `cli_inner_pretty.js:380973,
  380988, 380995, 381017, 381032`), which the v2.1.88 source does not emit.
- The fallback-iTerm2→tmux leaf distinguishes `"fallback_to_tmux"` vs `"needs_it2_setup"` in its
  telemetry reason (`cli_inner_pretty.js:380995`), matching the `needsIt2Setup: !preferTmux`
  semantics that v2.1.88 only encoded in the return value (`registry.ts:219`).

### 3. The env-passthrough list grew from 17 to 35 entries (enterprise hardening)

This is the largest behavioral evolution. v2.1.88 `TEAMMATE_ENV_VARS` (`spawnUtils.ts:96-128`) has
**17 entries**: 3 provider flags (BEDROCK/VERTEX/FOUNDRY), `ANTHROPIC_BASE_URL`,
`CLAUDE_CONFIG_DIR`, the two CCR-remote markers, and the 10 proxy/CA-cert vars. v2.1.156 `PT_`
(`cli_inner_pretty.js:380350-380386`) has **35 entries**, adding three whole groups:

- **AWS/Mantle/Foundry provider expansion** (11 new): `CLAUDE_CODE_USE_ANTHROPIC_AWS`,
  `CLAUDE_CODE_USE_MANTLE`, `ANTHROPIC_AWS_WORKSPACE_ID`, `ANTHROPIC_AWS_BASE_URL`,
  `ANTHROPIC_AWS_API_KEY`, `CLAUDE_CODE_SKIP_ANTHROPIC_AWS_AUTH`, `AWS_BEARER_TOKEN_BEDROCK`,
  `ANTHROPIC_BEDROCK_MANTLE_BASE_URL`, `CLAUDE_CODE_SKIP_MANTLE_AUTH`, `AWS_REGION`,
  `ANTHROPIC_BEDROCK_SERVICE_TIER` (`cli_inner_pretty.js:380354-380364`).
- **Subagent model pin** (1 new): `CLAUDE_CODE_SUBAGENT_MODEL` (`cli_inner_pretty.js:380365`).
- **Telemetry opt-out group** (6 new): `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`,
  `CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST`, `DISABLE_ERROR_REPORTING`, `DISABLE_GROWTHBOOK`,
  `DISABLE_TELEMETRY`, `DO_NOT_TRACK` (`cli_inner_pretty.js:380380-380385`).

Plus a special-cased **secure-storage** var outside the list loop:
`CLAUDE_SECURESTORAGE_CONFIG_DIR`, forwarded whenever defined (`cli_inner_pretty.js:380342-380343`)
— this entry is **new in v2.1.156** and has no v2.1.88 analog. The proxy/CA-cert group and the two
CCR markers are byte-identical to v2.1.88 (including the `CLAUDE_CODE_REMOTE_MEMORY_DIR` "must
travel with `CLAUDE_CODE_REMOTE`" rationale).

**Why:** every new group is a **least-privilege forward** required so a pane teammate — a fresh
login-shell process that does not inherit the parent's exported env — behaves identically to the
leader in managed/enterprise contexts: it talks to the same provider endpoint, uses the same forced
subagent model, and inherits the same telemetry opt-out. Forgetting any of these would silently
change a child's provider, model, or telemetry posture.

### 4. `buildTeammateCliFlags` gained `skipModel`, `--permission-mode auto`, and `--plugin-url`

v2.1.88 `buildInheritedCliFlags` (`spawnUtils.ts:38-89`) takes only `{planModeRequired,
permissionMode}`; v2.1.156 `X94` (`cli_inner_pretty.js:380309`) takes
`{planModeRequired, permissionMode, skipModel}`. Three concrete additions:

- **`skipModel`**: when the caller (`L94.spawn`) intends to inject a *per-teammate* `--model`
  itself, it sets `skipModel:true` so the builder does not also emit one
  (`cli_inner_pretty.js:380318`). v2.1.88 always emitted the model flag.
- **`--permission-mode auto`**: a new permission-mode branch (`cli_inner_pretty.js:380314`) absent
  from v2.1.88 (which only had `bypassPermissions`/`acceptEdits`); the `auto` permission mode is
  itself newer than v2.1.88.
- **`--plugin-url` loop**: v2.1.156 forwards each inline plugin *URL* in addition to each plugin
  *dir* (`cli_inner_pretty.js:380326` — `for (let O of Wt()) … --plugin-url`); v2.1.88 forwards
  only `--plugin-dir` (`spawnUtils.ts:71-74`). The plan-mode precedence safety line
  (don't propagate `--dangerously-skip-permissions` when `planModeRequired`) is identical in both.

### 5. The TmuxBackend user-session router gained an optional socket override

v2.1.88's `runTmuxInUserSession` (`TmuxBackend.ts:77-81`) is plain
`execFileNoThrow(TMUX_COMMAND, args)` — no socket. v2.1.156's `kS` (`cli_inner_pretty.js:380537`)
**optionally** prepends `-S <socketPath>` when `getSwarmSocketPath()` (`ob6`) returns one:

```javascript
// ============================================
// runTmuxInSwarmSocket - v2.1.156 added an optional -S <socket> the user-session router lacked
// Location: cli_inner_pretty.js:380537-380541
// ============================================

// ORIGINAL (for source lookup):
function kS(H) {
  let $ = ob6(), q = $ ? ["-S", $, ...H] : H;
  return y8(uu, q);
}

// READABLE (for understanding):
function runTmuxInSwarmSocket(args) {
  const socketPath = getSwarmSocketPath();              // v2.1.88: no such path; always plain args
  const fullArgs = socketPath ? ["-S", socketPath, ...args] : args;
  return execFileNoThrow(TMUX_COMMAND, fullArgs);
}

// Mapping: kS→runTmuxInSwarmSocket, ob6→getSwarmSocketPath, y8→execFileNoThrow, uu→TMUX_COMMAND
//          v2.1.88 analog: runTmuxInUserSession @TmuxBackend.ts:77 (no -S)
```

The external-session router `BE` (`-L <label>`, `cli_inner_pretty.js:380542`) is byte-identical to
v2.1.88's `runTmuxInSwarm` (`TmuxBackend.ts:87`).

### 6. `writeToMailbox` routing collapsed to file-only; `SendMessage` tool simplified

In v2.1.88 the mailbox transport was *conceptually* dual (the comment on `writeToMailbox` says it
"routes to in-process or file-based based on recipient"); in v2.1.156 that routing collapsed —
**all** recipients are file-based, making the IPC trivially uniform across both execution modes.
The teammate-mode snapshot at startup made the in-memory shortcut unnecessary.

The model-facing `SendMessage` tool also **narrowed**. v2.1.88 `SendMessageTool.ts` was a rich
router supporting `to: "*"` broadcast (`SendMessageTool.ts:73-74, 232-255`), `uds:<socket-path>`
local peers, and `bridge:<session-id>` Remote Control peers. v2.1.156's swarm `SendMessageTool`
(`Bh_`) **rejects** `to: "*"`: *"broadcast (to: \"*\") is no longer supported — send a message per
recipient"* (`cli_inner_pretty.js:407495`), while it **retains** the `bridge:`/`uds:` scheme parse
(`lO4`, `cli_inner_pretty.js:407500`). This matches the v2.1.142 README's note that "`SendMessage`
rejects `to: "*"`" — so the broadcast removal predates 2.1.156 (it is a 2.1.112→142-era change),
and 2.1.156 carries it forward.

---

## Delta vs the v2.1.142 `30_agent_team` module

The v2.1.142 `30_agent_team/` module (see
[../../../claude_code_v_2.1.142/analyze/30_agent_team/README.md](../../../claude_code_v_2.1.142/analyze/30_agent_team/README.md))
framed the subsystem around a **task taxonomy** of five worker kinds — *in-process teammate*,
*subagent (Agent tool)*, *background agent (daemon child)*, *remote agent (cloud)*, and
*daemon-side helpers* — all sharing one `AppState.tasks` record with a `type` discriminator. Its
docs (`task_taxonomy.md`, `teammate_runner_loop.md`, `mailbox_protocol.md`,
`coordinator_process_model.md`, `agent_identity_propagation.md`) organize the system **by task
type and identity**.

This v2.1.156 module **reframes the same code around the `BackendRegistry` executor split** — the
question "*is this teammate an in-process async task or a cross-process pane?*" — which the v2.1.142
tree never documents. Concretely:

**What the v2.1.142 docs already covered (and this module does not re-derive):**

- **The in-process poll loop.** `teammate_runner_loop.md` described the in-process teammate loop
  with a **5-priority** order; this module documents v2.1.156's loop as **6-priority**, the
  difference being the explicit `shutdownRequested`-flag + `standalone` short-circuit
  (`cli_inner_pretty.js:379654`) that the runner gained — itself an *evolved* (not new) piece. The
  500 ms interval, the mailbox-shutdown-before-chat ordering, and the team-lead-preferred dequeue
  are continuous across both.
- **The mailbox protocol.** `mailbox_protocol.md` covered the file-IPC envelope, the per-inbox
  lock, and the message types; this module's `mailbox_and_lifecycle_tools.md` re-derives the
  concurrency-safe write from v2.1.156 source but the schema is unchanged (the v2.1.142 README
  states "the team mailbox protocol itself did **not** change schema").
- **Identity propagation.** `agent_identity_propagation.md` covered the two `AsyncLocalStorage`
  slots and the `x-claude-code-agent-id` headers; this module references the ALS isolation but
  defers the telemetry-header detail to that doc.
- **`SendMessage` narrowing.** The v2.1.142 README already noted `SendMessage` rejects `to: "*"`
  and gains `bridge:`/`uds:` schemes — this module confirms both still hold at
  `cli_inner_pretty.js:407495, 407500`.

**What this v2.1.156 module sharpens (and v2.1.142 did not have at all):**

- **The `BackendRegistry`** (`R94`/`y94`/`NS`) as a named subsystem — the v2.1.142 tree has no
  document describing a backend registry; the only registry-symbol mention is an unrelated
  `teammateMode` reference in `permission_inheritance.md`.
- **`isInProcessEnabled`** (`ma`) as *the* execution-mode algorithm, with its non-interactive
  guard, sticky auto-mode fallback, and environment probe.
- **The `PaneBackend` split** (`TmuxBackend` / `ITermBackend` behind `PaneBackendExecutor`) and the
  tmux/iTerm2 detection tree — v2.1.142's table lists in-process teammates and tmux child processes
  as one row but never separates the *pane backend abstraction* from the in-process backend. The
  v2.1.88 named TS already contains the full `PaneBackendExecutor` + `TmuxBackend` + `ITermBackend`
  split, so this design is at least as old as ~v2.1.83-88; the v2.1.156 form is its faithful
  continuation, simply *documented* here for the first time in this analysis lineage.
- **The CLI/env replay builders** (`buildTeammateCliFlags` / `buildTeammateEnvString` /
  `TEAMMATE_ENV_PASSTHROUGH`) as the "configuration-replay" mechanism for cross-process teammates,
  with the 17→35 passthrough growth quantified.

> One-line daemon contrast (out of scope here, per the v2.1.142 `coordinator_process_model.md`):
> the background-agent fleet is a **`claude daemon` supervisor** owning a worker pool of child
> processes that *survive the leader* — a different worker model that shares neither the
> `BackendRegistry` nor the in-process/pane executor split documented in this module.

---

## Coordinator mode: live or dead?

**Finding: coordinator mode is LIVE in v2.1.156 — a full revival of v2.1.88's `coordinatorMode.ts`
feature that was genuinely *absent* in v2.1.142.** It is a **separate feature** from the agent-team
execution-mode split and never participates in `isInProcessEnabled`; it is documented here only to
resolve the dossier's open live/dead question. **This is a re-introduction, not a correction of the
v2.1.142 analysis** — the v2.1.142 module was right that coordinator mode was gone *in v2.1.142*
(see the cross-version grep below).

The v2.1.142 README
([../../../claude_code_v_2.1.142/analyze/30_agent_team/README.md](../../../claude_code_v_2.1.142/analyze/30_agent_team/README.md))
states "**coordinator mode was removed** entirely … the gate survives only as the dead `i3H`
stub (`return false`)" — and that is accurate **for v2.1.142**. A direct grep of the *v2.1.142*
bundle (`/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js`) returns
**zero** hits for `CLAUDE_CODE_COORDINATOR_MODE`, `"You are a **coordinator**"`,
`tengu_coordinator_mode_switched`, `getCoordinatorAgents`, and `COORDINATOR_MODE_ALLOWED_TOOLS`. The
same five anchors are all **present** in the v2.1.156 bundle (the env var is read *and written*, the
telemetry fires, the prompt and roster machinery exist). The feature was therefore **removed by
v2.1.142 and re-introduced somewhere in the v2.1.143 → v2.1.156 window** (the exact reviving release
is not pinned here — it would require the intermediate bundles to bisect). What returns is the
v2.1.88 `coordinatorMode.ts` feature essentially intact:

```javascript
// ============================================
// coordinatorModeRaw - LIVE in v2.1.156 (re-introduced after being absent in v2.1.142)
// Location: cli_inner_pretty.js:216440-216476
// ============================================

// ORIGINAL (for source lookup):
function cI() {                                            // @216440
  if (!xH(process.env.CLAUDE_CODE_COORDINATOR_MODE)) return !1;
  if (zT() && !d6() && !xH(process.env.CLAUDE_CODE_REMOTE)) return !1;
  return !0;
}
function Bp() { return cI(); }                             // @216460 isCoordinatorMode
function Mk5() { return Bp() && !1; }                      // @216463 isCcrCoordinator — hard false
// ... later, the gate is actively SET, not just read:
if (q) process.env.CLAUDE_CODE_COORDINATOR_MODE = "1";    // @216471
else delete process.env.CLAUDE_CODE_COORDINATOR_MODE;     // @216472

// READABLE (for understanding):
function coordinatorModeRaw() {
  if (!isTruthy(process.env.CLAUDE_CODE_COORDINATOR_MODE)) return false;
  // interactive AND not a fork AND not remote → not coordinator
  if (isInteractive() && !isForkSession() && !isTruthy(process.env.CLAUDE_CODE_REMOTE)) return false;
  return true;
}
function isCoordinatorMode() { return coordinatorModeRaw(); }
function isCcrCoordinator() { return isCoordinatorMode() && false; }   // permanently disabled

// Mapping: cI→coordinatorModeRaw, Bp→isCoordinatorMode, Mk5→isCcrCoordinator,
//          zT→isInteractive, d6→isForkSession, xH→isTruthy
```

**Evidence it is live (not a dead stub):**
- `cI` is a real implementation (`cli_inner_pretty.js:216440`), not `return false`.
- The env var is **actively set/cleared** at `cli_inner_pretty.js:216471-216475` — dead code would
  not write it.
- `isCoordinatorMode` (`Bp`) is referenced at numerous live call sites: tool-set assembly
  (`cli_inner_pretty.js:409418, 409423`), system-prompt selection (`cli_inner_pretty.js:516604`),
  session-mode telemetry (`cli_inner_pretty.js:599036, 641647, 641804, 646125`), the resume-time
  `matchSessionMode` reconciler (`cli_inner_pretty.js:599012, 628728, 634601, 641623, 641782`), and
  the analytics payload `is_coordinator` (`cli_inner_pretty.js:646503`).
- The env var name appears in role-config docs and passthrough lists at
  `cli_inner_pretty.js:336442` and `560867`, and there is an `@internal` MCP role-config string at
  `cli_inner_pretty.js:336442` documenting the `comms` server role used *only* when coordinator
  mode is active.

**The revived feature is the *same* v2.1.88 coordinator mode, not a different one.** The four
v2.1.156 functions map 1:1 onto the v2.1.88 `coordinator/coordinatorMode.ts` exports:
`isCoordinatorMode` (`Bp` ↔ `coordinatorMode.ts:36`), `matchSessionMode` (`jk5` ↔ `:49`),
`getCoordinatorUserContext` (`wk5` ↔ `:80`), and `getCoordinatorSystemPrompt` (`Dk5` ↔ `:111`,
both opening with the identical "You are a **coordinator**. Your job is to:" prompt). The
`getCoordinatorAgents()` roster-replacement + `COORDINATOR_MODE_ALLOWED_TOOLS` machinery the
v2.1.88 reference carried in `tools/AgentTool/builtInAgents.ts` is **also back** in v2.1.156 (grep
of the v2.1.156 bundle returns 2 hits for those two identifiers — they were absent in v2.1.142).
So there is **one** coordinator mode across all three versions; v2.1.142 simply lacked it. The only
piece v2.1.156 keeps permanently disabled is the **CCR** sub-variant: `isCcrCoordinator` (`Mk5`) is
`Bp() && false` — always `false` (`cli_inner_pretty.js:216463`).

**Why it is out of scope for this module:** coordinator mode governs *prompt / tooling / session
role*, not *how teammates are executed*. `isInProcessEnabled` (`ma` @`381076`) never reads
`CLAUDE_CODE_COORDINATOR_MODE`, and `isCoordinatorMode` lives in an entirely different module
(`Bx` @`216449`) from the `BackendRegistry` (`R94` @`380912`). It is documented here only to
resolve the dossier's open live/dead question and to record the cross-version re-introduction
(absent in v2.1.142, live again in v2.1.156).

---

## See Also

Sibling documents in this module (`30_agent_team/`):
- [README.md](./README.md) — module overview & navigation.
- [execution_modes_and_backend_registry.md](./execution_modes_and_backend_registry.md) — the mode decision + registry (the core).
- [in_process_mode.md](./in_process_mode.md) — `InProcessBackend`, the agent + 500 ms poll loop, ALS isolation.
- [cross_process_mode.md](./cross_process_mode.md) — `PaneBackendExecutor`, `TmuxBackend`/`ITermBackend`, CLI/env builders.
- [mailbox_and_lifecycle_tools.md](./mailbox_and_lifecycle_tools.md) — file mailbox IPC, TeamCreate/TeamDelete/SendMessage, permission bridge.
- this document — the consolidated v2.1.156→v2.1.88 cross-validation ledger.
