# Symbol Index — Core Execution (v2.1.156 → v2.1.183)

This index catalogs obfuscated → readable mappings for the **core execution** symbols that changed between v2.1.156 and v2.1.183: the Agent Loop, Tools, LLM API, Agents, Subagent, State, and the subagent/tool-execution machinery shared by the Agent tool and the task-notification path.

For other categories see:

- [`symbol_index_core_features.md`](symbol_index_core_features.md) — Compact, Auto Memory, Background Agents, Workflow, **Agent Team / swarm**
- [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) — MCP, Permissions, Sandbox, Auth, Model, Prompt, Telemetry
- [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) — LSP, Chrome, IDE, UI, Plugin, Code Indexing, Shell Parser, Slash Commands

## File:Line Format

For v2.1.183, the canonical source citation is `cli_inner_pretty.js:<line>` — `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines). v2.1.156 / v2.1.88 citations are tagged as before-pictures.

## Per-feature symbol manifests

The exhaustive per-symbol tables live in the per-feature additions files (linked from [`symbol_index_core_features.md`](symbol_index_core_features.md)). This index records the execution-layer anchors those features share.

---

## Module: Agent Tool & Subagent Execution (Agent Team spawn surface)

The Agent tool became the teammate spawner in the v2.1.178 redesign. These rows are the tool-definition / schema / spawn-dispatch / task-notification / keepalive symbols the `30_agent_team/` docs reference. Their canonical exhaustive home is [`symbol_additions_v2_1_183_agent_team.md`](symbol_additions_v2_1_183_agent_team.md) (sections 4, 5, 10).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `f3n` | `agentToolDef` (the Agent tool object; `get inputSchema(){return zao()}`, teammate routing in `call`) | cli_inner_pretty.js:423505 | object |
| `vs` | Agent tool name const (`"Agent"`) | cli_inner_pretty.js:149939 | constant |
| `CDp` | `baseAgentSchema` (`{description,prompt,subagent_type,model,run_in_background}`) | cli_inner_pretty.js:423431 | object |
| `IDp` | `buildAgentInputSchema` (merges `name`/`team_name`/`mode` onto `CDp`) | cli_inner_pretty.js:423446 | object |
| `zao` | served Agent schema (`buildAgentInputSchema().omit({cwd:true})`) | cli_inner_pretty.js:423478 | function |
| `cqa` | `spawnTeammate` (Agent→ teammate-spawn entry; `cqa(e,t){return HDp(e,t)}`) | cli_inner_pretty.js:423053 | function |
| `HDp` | `dispatchTeammateSpawn` (pane vs in-process dispatcher) | cli_inner_pretty.js:423041 | function |
| `sqa` | `spawnInProcessTeammate` (in-process spawn; lazy `teamContext`) | cli_inner_pretty.js:422925 | function |
| `SDp` | `spawnSplitPaneTeammate` (cross-process pane spawn; throws if no `teamContext.teamName`) | cli_inner_pretty.js:422644 | function |
| `EDp` | `spawnNewWindowTeammate` (`use_splitpane===false` variant; same session-team guard) | cli_inner_pretty.js:422762 | function |
| `G4e` | `buildTaskNotification` (task-notification builder; owner-alive gate + bg-survival `<note>`) | cli_inner_pretty.js:445827 | function |
| `Lye` | `getKeepaliveReasons` (`e.keepaliveReasons ?? new Set()`) | cli_inner_pretty.js:445750 | function |
| `YR` | `isCompletedButKeptAlive` (`status==="completed" && getKeepaliveReasons(e).size>0`) | cli_inner_pretty.js:445753 | function |
| `qut` | `startInProcessTeammate` (fire-and-forget runner entry) | cli_inner_pretty.js:421374 | function |
| `sDp` | `runInProcessTeammateLoop` (per-turn AbortController; idle notification on turn end) | cli_inner_pretty.js:421006 | function |
| `ZLp` | `IN_PROCESS_POLL_MS` (`500`) | cli_inner_pretty.js:421380 | constant |
| `bQ` | `formatAgentId` (`` `${name}@${team}` ``; v2.1.156 `Ei`) | cli_inner_pretty.js:103172 | function |

---

## Module: Subagent Depth Limit & Nested Spawn

The cross-cutting **nested-subagent 5-level depth limit** (2.1.172 / 2.1.181) and the depth-threading plumbing it rides on. The whole cap is a single one-line filter predicate over the Agent tool (`if (Rc(i, vs)) return s < v1i;` @371194) placed **above** the async branch so the foreground and background toolset builds share one ceiling (the 2.1.181 fg/bg-shared mechanism). `agentDepth`/`spawnDepth` are **net-new in v2.1.183** — both grep = 0 in the v2.1.156 bundle, where the only gate was a team-only boolean inside `uE6`'s async branch. The exhaustive table (with spawn-site stampings and telemetry) is [`symbol_additions_v2_1_183_background_agents.md`](symbol_additions_v2_1_183_background_agents.md) §"Nested-subagent depth limit"; deep prose is [`../36_background_agents/nested_subagent_depth_limit.md`](../36_background_agents/nested_subagent_depth_limit.md).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `v1i` | `SUBAGENT_DEPTH_LIMIT` (hard-coded `5`; declared in the tool-filter comma-list `…UPt,v1i=5,T1i…`; concept absent in v2.1.156) | cli_inner_pretty.js:221800 | constant |
| `Gz` | `getAgentDepth` (`if (e.agentType==="main") return 0; return e.depth ?? 0;` — per-branch depth read; `Gz(parent)+1` is the universal child-depth expression; NEW) | cli_inner_pretty.js:103152 | function |
| `jz` | `isMainAgent` (`return e.agentType === "main"` — root-context guard beside `Gz`) | cli_inner_pretty.js:103149 | function |
| `$Cr` | `isSubagent` (`return e.agentType === "subagent"` — complementary discriminator beside `Gz`/`jz`) | cli_inner_pretty.js:103156 | function |
| `cio` | `filterSubagentTools` (universal subagent tool filter; depth gate `if (Rc(i,vs)) return s < v1i;` @371194 hoisted above the async branch; v2.1.156 predecessor `uE6` @278956 was team-only, no `agentDepth`) | cli_inner_pretty.js:371188 | function |
| `bte` | `buildResolvedTools` (resolved-tools builder; NEW 6th param `agentDepth (s=0)` forwarded into `cio` @371234 + new 5th `isTeammate (o)`; single chokepoint for both fg & bg → shared limit; v2.1.156 predecessor `no` @278972 was 4-arg) | cli_inner_pretty.js:371230 | function |
| `Rc` | `matchesName` (`e.name === t || (e.aliases?.includes(t) ?? !1)` — tool-name/alias matcher used by the `cio` depth gate against `vs` (`"Agent"`, tabled in the Agent Tool module above); v2.1.156 `h1`) | cli_inner_pretty.js:149965 | function |
| `Xut` | `registerLocalAgentTask` (local-agent task registrar; **persists `spawnDepth: r`** into the durable task record @446095 so a resume reads back the authoritative depth instead of re-deriving) | cli_inner_pretty.js:446073 | function |
| `od` | `isLocalAgentTask` (`…"type" in e && e.type === "local_agent"` predicate; gates the persisted-depth read on resume `(od(g)?g.spawnDepth:void 0) ?? Gz(parent)+1` @434085) | cli_inner_pretty.js:445761 | function |
| `uE6` | `filterSubagentTools` (v2.1.156 BEFORE-PICTURE; 4-field `{tools,isBuiltIn,isAsync,permissionMode}` — no `agentDepth`; team-only keep-Agent gate `R7()&&mG()`) | v2.1.156 cli_inner_pretty.js:278956 | function |
| `no` | `buildResolvedTools` (v2.1.156 BEFORE-PICTURE; 4-arg `(H,$,q,K)` — no depth param, no `isTeammate`) | v2.1.156 cli_inner_pretty.js:278972 | function |

> Spawn-site depth stampings are anonymous locals (referenced by line, not tabled): Agent-tool spawn `z = Gz(c.agentContext)+1`@423722 (stamps `agentDepth:z`@423825, `depth:z`@423933/@423990); resume `(od(g)?g.spawnDepth:void 0) ?? Gz(o.agentContext)+1`@434085; built-in fork `d = Gz(t.agentContext)` (**no `+1`** — same-depth continuation)@473586; workflow agent `depth: Gz(ue)+1`@417155. Telemetry `agent_depth` rides `tengu_agent_tool_selected`@423733 / `tengu_agent_tool_terminated`@371803 — there is **no** "depth-limit-hit" event; enforcement is purely by removing the Agent tool from the resolved toolset.

---

## Module: Agent Team — Shared mailbox / keepalive / TaskStop / prompt-queue plumbing

The subagent/tool-execution primitives the Agent-tool spawn and task-notification path share with the broader runtime. Their canonical exhaustive home is [`symbol_additions_v2_1_183_agent_team.md`](symbol_additions_v2_1_183_agent_team.md) (sections 3, 7, 9, 10); homed here per the additions-file routing note.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$A` | `writeToMailbox` (universal send; lock→re-read→push→atomicWrite; v2.1.156 `aA`) | cli_inner_pretty.js:365950 | function |
| `B3f` | `TEAM_NAME_PREFIX` (`"session"` — deterministic team-name prefix) | cli_inner_pretty.js:682817 | constant |
| `Cso` | `createShutdownRejected` (shutdown-rejected control-frame builder) | cli_inner_pretty.js:366181 | function |
| `Fhe` | `readMailbox` (parse array; ENOENT→`[]`; SyntaxError-tolerant; v2.1.156 `h_H`) | cli_inner_pretty.js:365930 | function |
| `Fut` | `removeKeepaliveReason` (release a pin; schedule `evictAfter = now + zGe` if terminal+unpinned; v2.1.156 `hW8`) | cli_inner_pretty.js:445779 | function |
| `If` | `toAgentId` (identity brand-cast; routes a notification to the still-alive owner) | cli_inner_pretty.js:2037 | function |
| `Kyp` | `ensureInboxDir` (`mkdir -p` of `inboxes/`; v2.1.156 `HD_`) | cli_inner_pretty.js:365924 | function |
| `Llt` | `createShutdownRequest` (shutdown-request control-frame builder) | cli_inner_pretty.js:366162 | function |
| `Ls` | `getMainAgentId` (main conversation agent id; `"main"` queue target + notification fallback) | cli_inner_pretty.js:2664 | function |
| `QBn` | `gcStaleChildReasons` (garbage-collects stale `agent:` reasons whose child already notified) | cli_inner_pretty.js:445801 | function |
| `U3f` | `resetInheritedTeamNameForTesting` (`setCachedInheritedName(undefined)`; decl @682762) | cli_inner_pretty.js:682764 | function |
| `ZKt` | `getCachedInheritedTeamName` (module-level cache getter read by `F3f`) | cli_inner_pretty.js:3558 | function |
| `_f` | `enqueuePendingNotification` (`ug.enqueuePendingNotification` — queue `G4e` routes into) | cli_inner_pretty.js:234006 | function |
| `a3t` | `stopTask` (stop primitive used by `edt.call`) | cli_inner_pretty.js:424764 | function |
| `ect` | `hasChildAgents` (scans an agent's reasons for any `agent:` prefix) | cli_inner_pretty.js:445794 | function |
| `edt` | `taskStopTool` (`TaskStop` def; aliases `KillShell`/`KillBash`; v2.1.156 carryover) | cli_inner_pretty.js:424867 | object |
| `em` | `isTeammate` (`Pk()` OR in-process `$q.agentId && $q.teamName`; drives Agent-desc GUARD 1) | cli_inner_pretty.js:103466 | function |
| `e7t` | `setCachedInheritedTeamName` (module-level cache setter for `F3f`) | cli_inner_pretty.js:3561 | function |
| `gte` | `getTeamFilePath` (team-file path; v2.1.156 `pa`) | cli_inner_pretty.js:362812 | function |
| `iF` | `isProtocolFrame` (10-type teammate-protocol-frame predicate; v2.1.156 `$X8`) | cli_inner_pretty.js:366256 | function |
| `iUt` | `LOCK_OPTIONS` (proper-lockfile retry/backoff opts; v2.1.156 `DG$`) | cli_inner_pretty.js:365965 | constant |
| `l1e` | `getInProcessTeammateContext` (returns in-process teammate context `$q`) | cli_inner_pretty.js:103447 | function |
| `o_` | `enqueuePrompt` (`ug.enqueue`; `"main"` routing enqueues `priority:"next", isMeta:true`) | cli_inner_pretty.js:234005 | function |
| `pDa` | `AGENT_NAME_RE` (`/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/` teammate-name regex) | cli_inner_pretty.js:362645 | constant |
| `tC` | `isTerminalStatus` (`"completed"|"failed"|"killed"`; eviction precondition; v2.1.156 `S2`) | cli_inner_pretty.js:575418 | function |
| `tWe` | `addKeepaliveReason` (register `agent:<childId>` pin; idempotent, local-agent only; v2.1.156 `yW8`) | cli_inner_pretty.js:445772 | function |
| `tr` | `getConfigDir` (`(CLAUDE_CONFIG_DIR ?? ~/.claude).normalize("NFC")`; v2.1.156 `l8`) | cli_inner_pretty.js:825 | function |
| `v4e` | `getInboxPath` (`<teamsDir>/<team>/inboxes/<agent>.json`; v2.1.156 `jhH`) | cli_inner_pretty.js:365916 | function |
| `wso` | `createShutdownApproved` (shutdown-approved control-frame builder) | cli_inner_pretty.js:366171 | function |
| `xr` | `isHeadless` / `isNonInteractive` (`!Ot.isInteractive`; vetoes parked-owner branch; v2.1.156 `R6` family) | cli_inner_pretty.js:3151 | function |
| `zGe` | `EVICT_DELAY_MS` (`30000` — eviction grace after last keepalive reason drops) | cli_inner_pretty.js:439188 | constant |
| `zts` | `permissionModeEnum` (`cl.enum(wM)` for the Agent `mode` param) | cli_inner_pretty.js:53866 | function |

---

## Module: Workflow — Shared subagent / tool-execution / agent-context plumbing

Generic execution plumbing the Workflow tool and its spawn path consume. Canonical exhaustive home: [`symbol_additions_v2_1_183_workflow.md`](symbol_additions_v2_1_183_workflow.md) ("Runtime spawn / attribution fixes", "Subagent prompts and defs"); homed here per the additions-file routing note.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Em` | `STRUCTURED_OUTPUT_TOOL_NAME` (`"StructuredOutput"`; v2.1.156 `iY`) | cli_inner_pretty.js:221489 | constant |
| `M2s` | `resolveSubagentNameForTelemetry` (`isBuiltIn ? subagentName : "user-defined"`; v2.1.156 `e3K`) | cli_inner_pretty.js:103159 | function |
| `Rq` | `runInAgentContext` (`pwt.run(ctx, fn)` agent-context ALS run wrapper; v2.1.156 `Lg`) | cli_inner_pretty.js:103143 | function |
| `a4` | `currentSessionId` (stored in `agentContext.parentSessionId`) | cli_inner_pretty.js:103436 | function |
| `ay` | `isBuiltInAgentDef` (built-in subagent predicate; feeds `agentContext.isBuiltIn`) | cli_inner_pretty.js:472399 | function |
| `ido` | `getAcornWalk` (the `acorn-walk` module backing `rWa`'s `walk.simple`) | cli_inner_pretty.js:415881 | function |
| `vXu` | `getAgentAttribution` (reads `pwt.getStore()` → attribution headers; v2.1.156 `X75`) | cli_inner_pretty.js:145447 | function |
| `xjn` | `getAcorn` (the Acorn parser module backing both `m0` and `rWa`) | cli_inner_pretty.js:411725 | function |

> `Tt` (`spawnWorkflowAgent`), `Dt` (`agentContext`), and the workflow subagent prompts/defs (`Q0p`/`tLp`/`ddo`/`nLp`) are workflow-feature-owned and tabled under **Module: Workflow** in [`symbol_index_core_features.md`](symbol_index_core_features.md) — not duplicated here.

---

## Module: Compact — Shared loop / token-accounting plumbing

The compact-delta symbols that are loop/LLM-API/token-accounting-adjacent. Canonical exhaustive home: [`symbol_additions_v2_1_183_compact.md`](symbol_additions_v2_1_183_compact.md); homed here per the additions-file routing note.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$T` | `estimateMessagesTokens` (per-message token-estimate sum; feeds `Yjp` prefix computation) | cli_inner_pretty.js:462778 | function |
| `Qtt` | `latestAssistantUsage` (newest-first scan for prior request's billed usage; feeds `Yjp`) | cli_inner_pretty.js:227130 | function |
| `TGn` | `reactiveCompact` (reactive-lane orchestrator; v2.1.156 `lA8`) | cli_inner_pretty.js:453256 | function |
| `Xjp` | `shouldAutoCompact` (loop predicate; only change is local-mode gate `_JH→S7`; v2.1.156 `eb_`) | cli_inner_pretty.js:461519 | function |

> `Ego` (`autoCompactIfNeeded`) and `vF` (`FallbackTriggeredError`) are loop/LLM-API-adjacent but already tabled under **Module: Compact** in [`symbol_index_core_features.md`](symbol_index_core_features.md) — cross-link there, not duplicated here.

---

## Module: Auto Memory — Shared forked extraction / dream entrypoints

The forked extraction/dream entrypoint family the auto-memory delta cross-links to the loop/subagent layer. Canonical exhaustive home: [`symbol_additions_v2_1_183_auto_memory.md`](symbol_additions_v2_1_183_auto_memory.md) ("Runtime Engine Carryover").

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BQa` | `autoDreamExtractor` (per-turn auto-dream scheduler closure; v2.1.156 `B04`) | cli_inner_pretty.js:455415 | function |
| `Nyn` | `isExtractModeActive` (per-turn extraction trigger gate; v2.1.156 `S88`) | cli_inner_pretty.js:147662 | function |
| `PQa` | `buildDreamPrompt` (auto-dream fork prompt builder; v2.1.156 `C04`) | cli_inner_pretty.js:455311 | function |
| `pendingMemoryUpdates` | `pendingMemoryUpdates` (appState ambient memory-update queue; drained per turn @465837) | cli_inner_pretty.js:294619 | variable |
| `w2p` | `getDreamThresholds` (reads `tengu_onyx_plover` `{minHours,minSessions}`; v2.1.156 `ag_`) | cli_inner_pretty.js:455394 | function |

---

## Module: Background Agents — Shared depth-mechanism discriminators

The fork-subagent feature-surface helpers that sit beside the depth mechanism. Canonical exhaustive home: [`symbol_additions_v2_1_183_background_agents.md`](symbol_additions_v2_1_183_background_agents.md) ("Nested-subagent depth limit").

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `L1i` | `getForkSubagentSource` (`CLAUDE_CODE_FORK_SUBAGENT` source resolver; pre-existing in v2.1.156) | cli_inner_pretty.js:222216 | function |
| `vvd` | `isForkSubagentEnabled` (`CLAUDE_CODE_FORK_SUBAGENT` env/GrowthBook gate `y7`; pre-existing) | cli_inner_pretty.js:222208 | function |

---

## Module: Other execution deltas

Compact dispatcher/loop integration, background-agent execution, and workflow VM execution symbols are catalogued in their per-feature additions files. For the v2.1.143→v2.1.156 execution baseline, see the v2.1.156 tree's [`symbol_index_core_execution.md`](../../../claude_code_v_2.1.156/analyze/00_overview/symbol_index_core_execution.md).
