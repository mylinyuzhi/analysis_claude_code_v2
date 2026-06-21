# Symbol Index — Core Features (v2.1.156 → v2.1.183)

This index catalogs obfuscated → readable mappings for the **core feature** symbols that changed between v2.1.156 and v2.1.183. Scope for this delta tree: Compact, Auto Memory, Background Agents, Dynamic Workflows, and the **Agent Team ("swarm")** subsystem (the v2.1.178 implicit-team redesign).

For other categories see:

- [`symbol_index_core_execution.md`](symbol_index_core_execution.md) — Agent Loop, Tools, LLM API, Agents, Subagent, State
- [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) — MCP, Permissions, Sandbox, Auth, Model resolution, Prompt, Telemetry
- [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) — LSP, Chrome, IDE, UI Components, Plugin, Code Indexing, Shell Parser, Slash Commands

## File:Line Format

For v2.1.183, the canonical source citation is `cli_inner_pretty.js:<line>` — the single pretty-printed bundle at `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines). v2.1.156 / v2.1.88 citations are explicitly tagged as before-pictures.

## Per-feature symbol manifests (the granular tables live here)

This delta tree keeps the full per-symbol mapping tables in the **per-feature additions files** (one per module). This index is the routing layer; consult the additions file for the exhaustive, line-by-line, before/after table:

- [`symbol_additions_v2_1_183_agent_team.md`](symbol_additions_v2_1_183_agent_team.md) — **Agent Team / swarm** (implicit team, spawn routing, tmux fix, SendMessage delta, lifecycle-tool removal, coordinator mode, background-survival fix)
- [`symbol_additions_v2_1_183_compact.md`](symbol_additions_v2_1_183_compact.md) — Compact (dispatcher delta, window resolver, fallback model)
- [`symbol_additions_v2_1_183_auto_memory.md`](symbol_additions_v2_1_183_auto_memory.md) — Auto Memory (team memory stores/recall, status line)
- [`symbol_additions_v2_1_183_background_agents.md`](symbol_additions_v2_1_183_background_agents.md) — Background Agents
- [`symbol_additions_v2_1_183_workflow.md`](symbol_additions_v2_1_183_workflow.md) — Dynamic Workflows

---

## Module: Agent Team

The **agent-team (internally "swarm")** subsystem as it exists in v2.1.183 after the v2.1.178 redesign: `TeamCreate`/`TeamDelete` removed, an implicit session-scoped team created at CLI startup, the Agent tool as the teammate spawner, the `send-keys` → `respawn-pane` tmux fix, the SendMessage `"main"` recipient + `uds:`/`bridge:` cross-session addressing, coordinator-mode prompt deltas, and the background-task survival fix.

> The exhaustive obfuscated→readable table (with the v2.1.156 alias in the Description column for every rename, and the removed `TeamCreate`/`TeamDelete` rows for traceability) lives in [`symbol_additions_v2_1_183_agent_team.md`](symbol_additions_v2_1_183_agent_team.md). The rows below are the feature-level anchors the `30_agent_team/` module docs reference most.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Sl` | `isAgentSwarmsEnabled` (master gate; opt-in env/flag AND `tengu_amber_flint`; v2.1.156 `R7`) | cli_inner_pretty.js:293831 | function |
| `yqd` | `hasAgentTeamsCliFlag` (`process.argv.includes("--agent-teams")`; v2.1.156 `Ru5`) | cli_inner_pretty.js:293828 | function |
| `j3f` | `initializeSessionTeam` (writes the implicit session team at startup; returns leader `teamContext`) | cli_inner_pretty.js:682765 | function |
| `xic` | `sessionTeamName` (`` `session-${sessionId.slice(0,8)}` ``) | cli_inner_pretty.js:682752 | function |
| `F3f` | `resolveInheritedTeamName` (one-shot read+delete of `CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME`) | cli_inner_pretty.js:682756 | function |
| `Dla` | `registerTeamForSession` (sets active-team module var `$Xr`, emits change notification) | cli_inner_pretty.js:299006 | function |
| `NXr` | `ensureTeamTasksDir` (mkdir of `WG(team)` = `<configDir>/tasks/<team>`) | cli_inner_pretty.js:299080 | function |
| `oso` | `recordTeamCreated` (adds team to the orphan-cleanup set `QKt()`) | cli_inner_pretty.js:363019 | function |
| `WG` | `teamTasksDir` (`ust.join(tr(), "tasks", dst(team))`) | cli_inner_pretty.js:299074 | function |
| `Gbe` | `getTeamsDir` (`ker.join(tr(), "teams")`; no `.claude/teams` literal; v2.1.156 `RxH`) | cli_inner_pretty.js:735 | function |
| `np` | `TEAM_LEAD_NAME` (`"team-lead"`; v2.1.156 `tY`) | cli_inner_pretty.js:362636 | constant |
| `LY` | `RESERVED_MAIN_NAME` (`"main"`; reserved teammate name routed to the main conversation) | cli_inner_pretty.js:362512 | constant |
| `Gke` | `TMUX_HOLDING_COMMAND` (`"cat"`; the pane's benign holding process) | cli_inner_pretty.js:362642 | constant |
| `B8` | `TMUX_BINARY` (`"tmux"`; v2.1.156 `uu`) | cli_inner_pretty.js:362640 | constant |
| `_lt` | `TEAMMATE_COMMAND_ENV` (`"CLAUDE_CODE_TEAMMATE_COMMAND"`) | cli_inner_pretty.js:362643 | constant |
| `a3n` | `sendCommandToPaneViaRespawn` (`respawn-pane -k -t <pane> -- <cmd>`; v2.1.156 used `send-keys`) | cli_inner_pretty.js:421874 | function |
| `Rdo` | `TEAMMATE_SYSTEM_PROMPT_ADDENDUM` (verbatim-unchanged; v2.1.156 `jU6`) | cli_inner_pretty.js:420705 | constant |
| `eDp` | `createTeammateCanUseTool` (permission bridge; unchanged design; v2.1.156 `OT_`) | cli_inner_pretty.js:420713 | function |
| `p$p` | `SendMessageTool` (tool def; `isEnabled(){return Sl()}`; v2.1.156 `Bh_`) | cli_inner_pretty.js:434568 | object |
| `o$p` | `SendMessageSchema` (`{to, summary?(≤200), message: string \| r$p}`; v2.1.156 `Sh_`) | cli_inner_pretty.js:434558 | object |
| `r$p` | `sendMessageMessageUnion` (3-type union; unchanged vs v2.1.156 `hh_`) | cli_inner_pretty.js:434542 | object |
| `rza` | `buildSendMessagePrompt` (compact markdown; `"main"` row new; v2.1.156 `iO4`) | cli_inner_pretty.js:434286 | function |
| `nza` | `SEND_MESSAGE_DESCRIPTION` (`"Send a message to another agent"`) | cli_inner_pretty.js:434314 | constant |
| `LLa` | `parseSocketAddress` (`uds:`/`bridge:`/`/`/`\\.\pipe\` scheme parser) | cli_inner_pretty.js:359974 | function |
| `Lhe` | `isLocalSocketAddress` (new local-socket-address format gate) | cli_inner_pretty.js:359981 | function |
| `Gtt` | `LIST_AGENTS_TOOL` (`"ListAgents"`) | cli_inner_pretty.js:221577 | constant |
| `oI` | `isCoordinatorMode` (raw gate on `CLAUDE_CODE_COORDINATOR_MODE`) | cli_inner_pretty.js:221871 | function |
| `z9` | `isCoordinatorMode` (exported wrapper, `return oI()`) | cli_inner_pretty.js:221892 | function |
| `bvd` | `getCoordinatorSystemPrompt` (coordinator-mode system prompt) | cli_inner_pretty.js:221940 | function |
| `yvd` | `matchSessionMode` (emits `tengu_coordinator_mode_switched`) | cli_inner_pretty.js:221898 | function |
| `uP` | `TaskStop` tool name const (worker-stop tool surfaced in coordinator prompt) | cli_inner_pretty.js:220834 | constant |

---

## Module: Compact

The v2.1.156 → v2.1.183 compaction delta, scoped to four behavioral changes: (1) `--fallback-model` honored in the summarize call; (2) the 1M-context-without-credits auto-clamp-back to 200k; (3) the window resolver growing 4 → 6 sources; (4) the precompute arm table + remote-reactive gate + dispatcher prefix-overflow probe. This is a **rename-heavy** delta — the whole threshold ladder/dispatcher/pipeline was re-minified and moved (ladder ~423864 → 226742-226983, dispatcher/pipeline ~423130 → 460676-461687, model cap ~130165 → 134105). The rows below are the headline anchors; the exhaustive before/after table (with every re-minified carryover) is [`symbol_additions_v2_1_183_compact.md`](symbol_additions_v2_1_183_compact.md). Module docs: [`../07_compact/`](../07_compact/README.md).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `del` | `streamCompactSummary` (DELTA 1 HEADLINE: summarize LLM call wrapped in a `while(!0)` model-fallback chain; emits `tengu_model_fallback_triggered{query_source:"compact"}` @461266; v2.1.156 `_X4` @423539 was single-pass, `model:mainLoopModel` hardcoded, no `fallbackModel`) | cli_inner_pretty.js:461088 | function |
| `ICn` | `buildFallbackChain` (DELTA 1 NEW in compact path: normalizes `fallbackModel` string\|array\|undefined into a deduped chain, drops fallbacks with a smaller window via `XHe`) | cli_inner_pretty.js:461078 | function |
| `vF` | `FallbackTriggeredError` (caught inside the new `del` fallback loop @461264; pre-existing in v2.1.156 but NOT previously caught in the compaction path) | cli_inner_pretty.js:460488 | class |
| `FW` | `ModelUnavailableError` (DELTA 1 NEW: thrown for `reason==="model_blocked"`, `"${model} is currently unavailable."`) | cli_inner_pretty.js:461476 | class |
| `tH` | `getContextWindowForModel` (DELTA 2 CHANGED: model hard cap; new branch `if (ARr(e,t)) return jQ` @134108 clamps a credits-blocked 1M model to 200k; v2.1.156 `Ov` @130165 had no clamp) | cli_inner_pretty.js:134105 | function |
| `ARr` | `is1mClampActive` (DELTA 2 NEW: `N8e() && Ati()===void 0 && gti(e,t) > jQ` three-guard gate; no v2.1.156 equivalent) | cli_inner_pretty.js:134118 | function |
| `N8e` | `get1mCreditsBlocked` (DELTA 2 NEW: `return Ot.longContext1mCreditsBlocked` session-flag getter; no v2.1.156 equivalent) | cli_inner_pretty.js:2965 | function |
| `Wtr` | `set1mCreditsBlocked` (DELTA 2 NEW: latches the flag true; called by the 429 mapper `$Cd`) | cli_inner_pretty.js:2968 | function |
| `$Cd` | `rateLimitErrorMapper` (DELTA 2 CHANGED: 429 mapper; new branch latches the clamp flag + emits `tengu_1m_credits_clamp_activated` @229192) | cli_inner_pretty.js:229176 | function |
| `Fwn` | `is1mCreditsError` (DELTA 2 NEW: the "credits required for long context" 429 detector) | cli_inner_pretty.js:229606 | function |
| `jQ` | `STANDARD_WINDOW` (`200000` — the standard window and the 1M-clamp target; v2.1.156 `P36`) | cli_inner_pretty.js:134192 | constant |
| `z2` | `getAutoCompactWindow` (DELTA 3 CHANGED: 6-source resolver `env > settings > clientdata > experiment > model-default > auto`; v2.1.156 `Xl` @423915 had only 4) | cli_inner_pretty.js:226875 | function |
| `ywd` | `clientDataWindow` (DELTA 3 NEW: the `'clientdata'` source, reads `rowan_thicket[model]`; `rowan_thicket` grep = 0 in v2.1.156) | cli_inner_pretty.js:226865 | function |
| `hwd` | `MODEL_DEFAULT_CLAMP_SET` (DELTA 3 NEW: `Set(["claude-sonnet-4-6","claude-opus-4-6"])` always clamped to 200k by the `'model-default'` source) | cli_inner_pretty.js:226969 | object |
| `gwn` | `getAutoCompactThreshold` (`effectiveWindow − 13000` with PCT override floor; rename only of v2.1.156 `Jv$` @423864; formula identical) | cli_inner_pretty.js:226818 | function |
| `bqr` | `getPrecomputeArm` (DELTA 4a NEW: resolves the `tengu_amber_moleskin` arm table into a per-windowSize `{repl,sdk}` fraction; v2.1.156 had no arm table) | cli_inner_pretty.js:226920 | function |
| `S7` | `isLocalOrRemoteReactiveAllowed` (DELTA 4b CHANGED: remote sessions can now run reactive compaction when `tengu_reactive_compact_remote` is on; v2.1.156 `_JH` @423988 returned `!isRemote` unconditionally) | cli_inner_pretty.js:226751 | function |
| `Yjp` | `prefixOverflowCheck` (DELTA 4c NEW: detects when compaction physically cannot help via cache-prefix weight vs `lMt` threshold; drives `tengu_auto_compact_prefix_overflow`) | cli_inner_pretty.js:461484 | function |
| `Ego` | `autoCompactIfNeeded` (per-turn dispatcher; gained the prefix-overflow probe + recovery-timeout precompute-swap callback; rename of v2.1.156 `DX4` @424002) | cli_inner_pretty.js:461531 | function |
| `zut` | `compactConversation` (full whole-conversation pipeline; same 16-phase shape; rename only of v2.1.156 `_eH` @423130) | cli_inner_pretty.js:460676 | function |
| `cel` | `partialCompact` (direction-aware partial compactor for `/rewind summarize`; rename only of v2.1.156 `qX4` @423340) | cli_inner_pretty.js:460886 | function |

---

## Module: Auto Memory

The v2.1.156 → v2.1.183 auto-memory delta: the `CLAUDE_MEMORY_STORES` schema expansion (`scope`/`promptIndex`/`promptIndexMaxBytes`), the new `promptIndex` network fetch + `<memory path>` injection, the recall dispatcher rewritten to route by `scope`+`mode`, the "mounted-store-enables-team" recall fix (the 2.1.172 headline), the watcher scope-split into separate team+user lanes, and the 2.1.181 `memory_saved` status-line change (per-file list now verbose-only). The **runtime engine** (caps, lock, dream scheduler, extraction gate) is UNCHANGED carryover. Headline anchors below; exhaustive table: [`symbol_additions_v2_1_183_auto_memory.md`](symbol_additions_v2_1_183_auto_memory.md). Module docs: [`../31_auto_memory/`](../31_auto_memory/README.md).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `e0t` | `loadMemoryPrompt` (DELTA 3 HEADLINE: `async` recall dispatcher; routes by `scope`+`mode` (rw/ro), injects `<memory path>` blocks from `agi()`; rename of v2.1.156 `sM$` @145046 flat 6-branch) | cli_inner_pretty.js:151847 | function |
| `Nk` | `isTeamMemoryEnabled` (DELTA 4, the 2.1.172 fix: a mounted `CLAUDE_MEMORY_STORES` now enables team recall outright; v2.1.156 `nM$` @144715 was flag-only `tengu_herring_clock`) | cli_inner_pretty.js:151098 | function |
| `Zse` | `parseMemoryStoresEnv` (DELTA 1 CHANGED: now enforces at most one `scope:"user"` entry + propagates `scope`/`promptIndex`/`promptIndexMaxBytes`; v2.1.156 `z24` @436721 built `{path,mode,mount}` only) | cli_inner_pretty.js:150442 | function |
| `bQu` | `storeObjectSchema` (DELTA 1 CHANGED: zod store schema gained `scope`/`promptIndex`/`promptIndexMaxBytes`; v2.1.156 `dp_` @436758 was `{path,mode,mount?}`) | cli_inner_pretty.js:150491 | object |
| `vNr` | `isPromptIndexPathSafe` (DELTA 1 NEW: per-segment `promptIndex` validator rejecting empty + `.`/`..` traversal) | cli_inner_pretty.js:150438 | function |
| `agi` | `fetchStorePromptIndices` (DELTA 2 NEW: `Promise.allSettled` fetch of all stores' `promptIndex` content for injection; first network *pull* into the recall prompt) | cli_inner_pretty.js:150754 | function |
| `kQu` | `fetchOnePromptIndex` (DELTA 2 NEW: one store's index via `MemoryStoreClient.readByPath` under a 5s timeout; emits `memory_prompt_index` telemetry) | cli_inner_pretty.js:150768 | function |
| `xQu` | `MEM_PROMPT_INDEX_TIMEOUT_MS` (DELTA 2 NEW: `5000` — the `promptIndex` fetch timeout) | cli_inner_pretty.js:150791 | constant |
| `Iu` | `isAutoMemoryEnabled` (master gate; remote sessions stay enabled when `CLAUDE_CODE_REMOTE_MEMORY_DIR`/`CLAUDE_COWORK_MEMORY_PATH_OVERRIDE` set; rename only of v2.1.156 `M1` @142111) | cli_inner_pretty.js:147636 | function |
| `Wse` | `getRemoteMemoryRoot` (returns `CLAUDE_CODE_REMOTE_MEMORY_DIR` when set — the env hook behind the remote-recall fix) | cli_inner_pretty.js:147666 | function |
| `uH` | `getTeamMemPath` (`hm()/team/`; rename only of v2.1.156 `Jv` @144718; v2.1.88 `getTeamMemPath`) | cli_inner_pretty.js:151103 | function |
| `Agi` | `buildTeamRecallRwRo` (DELTA 3 NEW: multi-directory rw + ro team recall builder; renders writable-store guidance + read-only note + conditional "How to save memories") | cli_inner_pretty.js:151265 | function |
| `uFp` | `startMemoryWatcher` (DELTA 5 CHANGED: splits `Zse()` into team (`rX`) + user (`$W`) lanes by `scope`; emits new `tengu_personal_mem_sync_started`; v2.1.156 `LU_` @438392 fed the team lane only) | cli_inner_pretty.js:449203 | function |
| `$W` | `userMultistore` (DELTA 5 NEW: user-scope multistore fed by `scope:"user"` entries; no v2.1.156 equivalent) | cli_inner_pretty.js:449230 | variable |
| `lje` | `isUserStoreEnabled` (`tengu_marble_lark` user-store gate; the flag existed in v2.1.156, only the `scope:"user"` integration is new) | cli_inner_pretty.js:289759 | function |
| `Svp` | `renderMemorySaved` (DELTA 6, 2.1.181: `memory_saved` REPL renderer; per-file list now `o && s.map(Evp)` — produced only when verbose; v2.1.156 `sk_` @393698 always showed a truncated list) | cli_inner_pretty.js:383399 | function |
| `cXa` | `buildPromptIndexSizeWarning` (DELTA 2 NEW: warns when an index file nears `promptIndexMaxBytes ?? HTe`=25KB; thresholds `kBp`=0.8 / `LBp`=0.7) | cli_inner_pretty.js:447180 | function |
| `HTe` | `MAX_ENTRYPOINT_BYTES` (`25000`; also the default for `promptIndexMaxBytes ?? HTe`; rename only of v2.1.156 `aM$`) | cli_inner_pretty.js:150801 | constant |

---

## Module: Background Agents

The v2.1.156 → v2.1.183 background-agents delta: the headline cross-cutting **nested-subagent 5-level depth limit** (also tabled under `symbol_index_core_execution.md`), the daemon worker **env-isolation** rework (the 2.1.181 ANTHROPIC_* provider-env leak fix), the reworked **`claude agents --json`** lifecycle surface (2.1.169 / 2.1.162), the re-mangled **`/bg`** / **`/stop`** command surface, and the daemon **retire/respawn** refinements. The bundler re-mangles every build (`zh8`→`sKn`, `Eq9`→`_Fl`, `bBz`→`aGf`, `OH9`→`JMl`, …). Headline anchors below; exhaustive table: [`symbol_additions_v2_1_183_background_agents.md`](symbol_additions_v2_1_183_background_agents.md). Module docs: [`../36_background_agents/`](../36_background_agents/README.md).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `v1i` | `SUBAGENT_DEPTH_LIMIT` (`5` — nested-subagent depth cap; NEW, concept absent in v2.1.156; full plumbing in `symbol_index_core_execution.md`) | cli_inner_pretty.js:221800 | constant |
| `cio` | `filterSubagentTools` (universal tool filter; depth gate `if (Rc(i,vs)) return s < v1i;` @371194 hoisted above the async branch → fg+bg shared limit; v2.1.156 `uE6` @278956 team-only) | cli_inner_pretty.js:371188 | function |
| `bte` | `buildResolvedTools` (NEW 6th param `agentDepth` + 5th `isTeammate`; single chokepoint for fg & bg toolsets; v2.1.156 `no` @278972 4-arg) | cli_inner_pretty.js:371230 | function |
| `Xut` | `registerLocalAgentTask` (persists `spawnDepth` into the durable task record @446095 for resume; depth-threading registrar) | cli_inner_pretty.js:446073 | function |
| `_Fl` | `buildWorkerEnv` (2.1.181 leak fix: bg worker env builder; four scrub passes + host-auth branch; v2.1.156 `Eq9` @559877 was single-pass over a provider-auth-free list) | cli_inner_pretty.js:594705 | function |
| `GLo` | `PROVIDER_AUTH_SCRUB` (NEW, the leak fix: pass-2 provider auth/config union deleted from the worker env; no v2.1.156 ancestor) | cli_inner_pretty.js:595849 | variable |
| `jLo` | `TERMINAL_SESSION_SCRUB` (pass-1 carryover terminal/SSH/session scrub list, broadened by 7 entries; v2.1.156 `Y7q` @560861) | cli_inner_pretty.js:595797 | variable |
| `WLo` | `isHostManagedAuth` (NEW: pass-4 host-auth predicate `!!ANTHROPIC_UNIX_SOCKET \|\| …`) | cli_inner_pretty.js:594777 | function |
| `aGf` | `printAgentsJson` (2.1.169 fix: three-source merge `scanLiveProcesses + readAllJobStates + listDaemonShorts` keyed on jobId; adds `id`/`state`/`waitingFor`/`--all`; v2.1.156 `bBz` @642728 was live-procs only) | cli_inner_pretty.js:691275 | function |
| `lGf` | `mapJobState` (NEW: derives the JSON `state` ∈ working/blocked/done/failed/stopped; no v2.1.156 ancestor) | cli_inner_pretty.js:691342 | function |
| `QK` | `readAllJobStates` (reads every on-disk `state.json` — the persistent source surviving worker retirement that `bBz` lacked) | cli_inner_pretty.js:192363 | function |
| `m4e` | `scanLiveProcesses` (live-PID scanner; byte-identical to v2.1.156 `qSH` @373239 — the only source `bBz` had) | cli_inner_pretty.js:360113 | function |
| `JMl` | `backgroundModule` (ESM namespace for the `/bg` triple `{spawnBackgroundFork,deriveBackgroundSeed,call}`; v2.1.156 `OH9` @542679) | cli_inner_pretty.js:566833 | object |
| `sKn` | `spawnBackgroundFork` (`/bg` argv builder over the unified dispatcher; NEW `left_arrow` failure-placeholder branch + `Zyn()` effort-flag gate; v2.1.156 `zh8` @542680) | cli_inner_pretty.js:566834 | function |
| `lgf` | `backgroundCall` (`/bg` `call` handler; three guards then render the confirm UI; v2.1.156 `Fwz` @542895) | cli_inner_pretty.js:567091 | function |
| `aKn` | `stopSelfSession` (`/stop` impl: writes terminal `state:"stopped"`, emits `tengu_bg_agent_action`, exits; v2.1.156 `Yh8` @542955) | cli_inner_pretty.js:567155 | function |
| `respawnIfIdleStale` | `BgWorkerHandle.respawnIfIdleStale` (NEW `trigger` param `(pinnedSet, trigger="sweep")` ∈ sweep/attach/prewarm + inflight/detritus guard; v2.1.156 single-arg @560029) | cli_inner_pretty.js:594895 | method |
| `gFl` | `DETRITUS_KINDS` (NEW: `["local_bash","in_process_teammate","dream"]` — inflight kinds that do not block retire/respawn; `detritusOnly` grep = 0 in v2.1.156) | cli_inner_pretty.js:595796 | variable |
| `Wzn` | `isAttachUpgradeEnabled` (NEW: `tengu_bg_attach_upgrade` feature gate (default on) for the prewarm respawn loop; grep = 0 in v2.1.156) | cli_inner_pretty.js:564348 | function |

---

## Module: Workflow

The v2.1.156 → v2.1.183 Dynamic Workflows (`ultracode`) delta. The subsystem is **structurally frozen** — same 4-layer gate, VM runtime, caps (1000 agents / 180s stall / `min(16,cores−2)`), journal/resume, `meta` AST parser, subagent prompts. Deltas cluster in two places: (1) the keyword-trigger UX (`workflow(s)` → `ultracode`, dedicated violet shimmer, NEW `workflowKeywordTriggerEnabled` setting); (2) tool-definition / runtime correctness fixes (AST-walk determinism check, `errorCode 7` server-fallback retraction, output-schema `taskType`/`workflowName`, per-agent `effort` opt, per-agent `agentContext` attribution, `/workflows` immediate). The bundler re-mangles every build (`NZ`→`Pw`, `Bg6`→`hho`, `n0_`→`DLp`, …). Headline anchors below; exhaustive table: [`symbol_additions_v2_1_183_workflow.md`](symbol_additions_v2_1_183_workflow.md). Module docs: [`../42_workflow/`](../42_workflow/README.md).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Pw` | `isWorkflowsEnabled` (4-layer master gate `!Kyn() && aAi() && tNr().available && (EJu() ?? defaultOn)`; logic identical to v2.1.156 `NZ`) | cli_inner_pretty.js:148784 | function |
| `Jyn` | `isUltracodeKeywordTriggerEnabled` (NEW: reads `settings.workflowKeywordTriggerEnabled ?? true`; gates BOTH the keyword reminder + the input highlight; grep = 0 in v2.1.156) | cli_inner_pretty.js:148797 | function |
| `hho` | `matchKeyword` (generic code-span-masking keyword matcher; byte-identical to v2.1.156 `Bg6`) | cli_inner_pretty.js:464214 | function |
| `yho` | `findUltracodeKeyword` (`matchKeyword(text,"ultracode")`; v2.1.156 `pg6` matched `"workflows?"`) | cli_inner_pretty.js:464261 | function |
| `o4p` | `makeWorkflowKeywordReminder` (emits `tengu_workflow_keyword` + `[{type:"workflow_keyword_request"}]`; event name + reminder type UNCHANGED — the tell this is a UX rename; v2.1.156 `KR_`) | cli_inner_pretty.js:464869 | function |
| `ji` | `ultracodeSpans` (keyword-highlight memo `useMemo(()=> Pw() && Jyn() ? yho(inputText):[],…)`; v2.1.156 `o1` had no `Jyn()` gate) | cli_inner_pretty.js:622226 | variable |
| `el` | `toggleKeywordIgnored` (`alt+w` dismiss/restore; toast now "Ultracode keyword ignored"; v2.1.156 `UJ`) | cli_inner_pretty.js:622362 | function |
| `zk` | `WORKFLOW_TOOL_NAME` (`"Workflow"`; v2.1.156 `mx`) | cli_inner_pretty.js:221550 | constant |
| `DLp` | `workflowTool` (the tool object `pi({name:zk, aliases:["RunWorkflow"],…})`; `validateInput` gained errorCode 7, output schema gained 2 fields; v2.1.156 `n0_`) | cli_inner_pretty.js:419420 | object |
| `ILp` | `workflowOutputSchema` (NEW `taskType:enum(["local_workflow","remote_agent"]).optional()` + `workflowName:string().optional()`; v2.1.156 `g0_`) | cli_inner_pretty.js:419372 | variable |
| `r5a` | `serverFallbackRetraction` (NEW: `{result:false, message:"Tool dispatch was retracted by a server fallback…", errorCode:7}` returned by `validateInput`; no v2.1.156 ancestor on Workflow) | cli_inner_pretty.js:419415 | variable |
| `gdo` | `WORKFLOW_DESCRIPTION` (long opt-in policy + DSL reference; edits: keyword "ultracode", `agent()` gained `effort?`; v2.1.156 `Fp6`) | cli_inner_pretty.js:418170 | variable |
| `rWa` | `isNonDeterministic` (NEW IMPL, 2.1.172: Acorn + `acorn-walk` over `Date.now`/`Math.random`/argless `new Date()`; replaced the v2.1.156 inline regex that false-positived on strings/comments) | cli_inner_pretty.js:416439 | function |
| `m0` | `parseWorkflowMeta` (Acorn parse of `export const meta = <literal>`; pure-literal eval + proto-pollution ban; unchanged logic; v2.1.156 `FZ`) | cli_inner_pretty.js:416466 | function |
| `n5a` | `resolveWorkflowSource` (`scriptPath > name > inline script` precedence ladder; unchanged logic; v2.1.156 `b44`) | cli_inner_pretty.js:419272 | function |
| `Tt` | `spawnWorkflowAgent` (per-agent workflow spawn closure; both runtime fixes edit its `wj({…})` query call; v2.1.156 ancestor `tH` @375171) | cli_inner_pretty.js:417149 | function |
| `Dt` | `agentContext` (NEW, 2.1.174: per-agent attribution `{agentId,parentAgentId,depth,parentSessionId,agentType,subagentName,isBuiltIn}` passed as `override.agentContext` + via the `Rq` ALS wrapper; v2.1.156 passed only `{agentId}`) | cli_inner_pretty.js:417152 | object |
| `_Wa` | `WORKFLOW_AGENT_CAP` (`1000` agent-call ceiling; identical to v2.1.156 `F74`) | cli_inner_pretty.js:417718 | constant |
| `K0p` | `computeWorkflowConcurrency` (`min(16, max(2, cores−2))`; identical to v2.1.156 `dG_`) | cli_inner_pretty.js:416892 | function |
| `jmf` | `workflowsCommand` (`/workflows` slash command; NEW `immediate:!0` (2.1.169) + reworded description; v2.1.156 `Pjz`/`Wjz` had no `immediate`) | cli_inner_pretty.js:562632 | object |

---

## Baseline reference

For the v2.1.143 → v2.1.156 baseline of these modules, see the v2.1.156 tree's [`symbol_index_core_features.md`](../../../claude_code_v_2.1.156/analyze/00_overview/symbol_index_core_features.md).
