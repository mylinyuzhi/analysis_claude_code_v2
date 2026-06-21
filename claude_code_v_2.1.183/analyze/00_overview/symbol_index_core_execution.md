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
| `Rc` | `matchesName` (`e.name === t || (e.aliases?.includes(t) ?? !1)` — tool-name/alias matcher used by the `cio` depth gate; v2.1.156 `h1`) | cli_inner_pretty.js:149965 | function |
| `vs` | `AGENT_TOOL` name const (`"Agent"`; the tool the depth gate filters out; v2.1.156 `sq`) | cli_inner_pretty.js:149939 | constant |
| `Xut` | `registerLocalAgentTask` (local-agent task registrar; **persists `spawnDepth: r`** into the durable task record @446095 so a resume reads back the authoritative depth instead of re-deriving) | cli_inner_pretty.js:446073 | function |
| `od` | `isLocalAgentTask` (`…"type" in e && e.type === "local_agent"` predicate; gates the persisted-depth read on resume `(od(g)?g.spawnDepth:void 0) ?? Gz(parent)+1` @434085) | cli_inner_pretty.js:445761 | function |
| `uE6` | `filterSubagentTools` (v2.1.156 BEFORE-PICTURE; 4-field `{tools,isBuiltIn,isAsync,permissionMode}` — no `agentDepth`; team-only keep-Agent gate `R7()&&mG()`) | v2.1.156 cli_inner_pretty.js:278956 | function |
| `no` | `buildResolvedTools` (v2.1.156 BEFORE-PICTURE; 4-arg `(H,$,q,K)` — no depth param, no `isTeammate`) | v2.1.156 cli_inner_pretty.js:278972 | function |

> Spawn-site depth stampings are anonymous locals (referenced by line, not tabled): Agent-tool spawn `z = Gz(c.agentContext)+1`@423722 (stamps `agentDepth:z`@423825, `depth:z`@423933/@423990); resume `(od(g)?g.spawnDepth:void 0) ?? Gz(o.agentContext)+1`@434085; built-in fork `d = Gz(t.agentContext)` (**no `+1`** — same-depth continuation)@473586; workflow agent `depth: Gz(ue)+1`@417155. Telemetry `agent_depth` rides `tengu_agent_tool_selected`@423733 / `tengu_agent_tool_terminated`@371803 — there is **no** "depth-limit-hit" event; enforcement is purely by removing the Agent tool from the resolved toolset.

---

## Module: Other execution deltas

Compact dispatcher/loop integration, background-agent execution, and workflow VM execution symbols are catalogued in their per-feature additions files. For the v2.1.143→v2.1.156 execution baseline, see the v2.1.156 tree's [`symbol_index_core_execution.md`](../../../claude_code_v_2.1.156/analyze/00_overview/symbol_index_core_execution.md).
