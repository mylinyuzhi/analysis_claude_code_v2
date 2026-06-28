# Symbol Additions — v2.1.193 — Agent Team (EXTEND)

> These symbols route to **[symbol_index_core_features.md](./symbol_index_core_features.md)** (the **Agent Team** / "swarm" subsystem is indexed there alongside Background Agents).
>
> Bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION `2.1.193`, build `a1938d2a`, BUILD_TIME `2026-06-25T18:18:11Z`). Every line below was **re-derived in the live 193 bundle** for this round (grep -n / Read). Obfuscated names are re-mangled per build and are **never** assumed to carry across versions; where a symbol is *carryover* from v2.1.183 with a different obf token, the 183 obf name is noted in the readable column for traceability.
>
> Scope of this round (the 183→193 Agent-Team delta): (1) the NET-NEW `teammateMode: "iterm2"` explicit pin (2.1.186), (2) `--effort` inheritance into pane-spawned teammates (2.1.186), (3) the stop-notification attribution + "finished"/"stopped" wording rewrite (2.1.187). The v2.1.178 implicit-team redesign machinery is **unchanged carryover** in this window and is NOT re-indexed here (see the v2.1.183 `30_agent_team` tree).

## Module: Agent Team — `teammateMode: "iterm2"` explicit pin (NET-NEW 2.1.186)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `uhs` | `EXEC_MODE_ENUM` (`["auto","tmux","iterm2","in-process"]`; 183 `Its` lacked `"iterm2"`) | cli_inner_pretty.js:54136 | constant |
| `kPe` | `detectAndGetBackend` (gains explicit `iterm2` branch; 88 `utils/swarm/backends/registry.ts`) | cli_inner_pretty.js:429186 | function |
| `zRe` | `getTeammateModeFromSnapshot` (default `$jt="in-process"`) | cli_inner_pretty.js:302915 | function |
| `$jt` | `DEFAULT_TEAMMATE_MODE` (`"in-process"`) | cli_inner_pretty.js:302921 | constant |
| `R8` | `isInsideITerm2` (`TERM_PROGRAM==="iTerm.app" \|\| ITERM_SESSION_ID \|\| terminal==="iTerm.app"`) | cli_inner_pretty.js:363523 | function |
| `Rft` | `isIt2CliReachable` (`command -v it2` in login shell, then `it2 session list`) | cli_inner_pretty.js:363533 | function |
| `xft` | `IT2_BIN` (`"it2"`) | cli_inner_pretty.js:363571 | constant |
| `svo` | `createITermBackend` (instantiates the registered `ITermBackendClass`) | cli_inner_pretty.js:429181 | function |
| `rvo` | `ITermBackend` (class; `type="iterm2"`, `displayName="iTerm2"`) | cli_inner_pretty.js:429024 | class |
| `iXp` | `emitPaneFallbackHint` (auto-mode pane-open failure → in-process; picks the `iterm2`/`tmux` hint) | cli_inner_pretty.js:429964 | function |
| `Re` | `recordSwarmOpFailure` (telemetry; `Re("swarm_backend_detect","iterm2_explicit_*")`) | cli_inner_pretty.js:44848 | function |
| `Ie` | `recordSwarmOpSuccess` (telemetry; `Ie("swarm_backend_detect")`) | cli_inner_pretty.js:44845 | function |

## Module: Agent Team — `--effort` inheritance into pane teammates (NET-NEW 2.1.186)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `pil` | `buildInheritedCliFlags` (leader/pane variant; also pushes `--teammate-mode`; 88 `utils/swarm/spawnUtils.ts:38`; 183 `F5a`@421627) | cli_inner_pretty.js:428485 | function |
| `Mil` | `buildInheritedSubagentCliFlags` (subagent-pane variant; no `--teammate-mode`) | cli_inner_pretty.js:429445 | function |
| `PIe` | `isLaunchEffortUnpinned` (`unpinOpus47/48LaunchEffort && unpinFable5LaunchEffort`) | cli_inner_pretty.js:149794 | function |
| `Lt` | `getConfigSnapshot` (read by `PIe`) | cli_inner_pretty.js:149794 (call) | function |

## Module: Agent Team — stop-notification attribution + wording (NET-NEW + FIX 2.1.187)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Eqe` | `enqueueAgentNotification` (`killedBy` param; "finished"/"was stopped by Claude\|user"; 183 `@445830` "came to rest") | cli_inner_pretty.js:453792 | function |
| `kht` | `stopTask` (`killedBy="user"` default; cascades `killedBy` to children) | cli_inner_pretty.js:431759 | function |
| `GSe` | `killAndNotifyTask` (`GSe(e,t,n="user")`; propagates `killedBy` into `Eqe` + task state) | cli_inner_pretty.js:453871 | function |
| `LEo` | `teammateIdleBanner` (idleReason → "finished"; 183 `Hao`@379341 "came to rest") | cli_inner_pretty.js:390965 | function |
| `Mde` | `markAgentStoppedByUser` (called on user-source stop; also in Background Agents additions) | cli_inner_pretty.js:431809 | function |
| `Kl` | `isLocalAgentTask` (used by `Eqe` to test live-task notify; carryover of 183 `od`) | cli_inner_pretty.js:453726 | function |

## Module: Agent Team — implicit-team deprecation (CARRYOVER 2.1.178 — listed for cross-ref only)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| (schema) | `team_name` Agent param — `"Deprecated; ignored. The session has a single implicit team."` (byte-identical to 183) | cli_inner_pretty.js:430391 | object |
