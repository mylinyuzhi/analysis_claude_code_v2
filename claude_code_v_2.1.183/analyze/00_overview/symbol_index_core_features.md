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
| `DCe` | `isArtifactEnabled` (first-party/online/non-local-agent gate consulted by the `_vd` Artifact filter) | cli_inner_pretty.js:221839 | function |
| `Fn` | `runTmux` (low-level tmux exec used by `a3n`, `Fn(B8, [...])`) | cli_inner_pretty.js:50307 | function |
| `N8` | `SWARM_SESSION_NAME` (`"claude-swarm"`; external standalone swarm session name) | cli_inner_pretty.js:362638 | constant |
| `Nen` | `AGENT_MESSAGE_TAG` (`"agent-message"`; relay-envelope tag) | cli_inner_pretty.js:45675 | constant |
| `Nhe` | `readTeamFile` (reads/parses on-disk team config; v2.1.156 `gZ`) | cli_inner_pretty.js:362824 | function |
| `Qoo` | `HIDDEN_SESSION_NAME` (`"claude-hidden"`; hidePane break-pane target) | cli_inner_pretty.js:362641 | constant |
| `Slt` | `assertNoControlChars` (rejects Unicode control chars before sending to a terminal; NEW defense-in-depth) | cli_inner_pretty.js:362755 | function |
| `VAe` | `ARTIFACT_TOOL` (`"Artifact"`; dropped from worker-tool list unless `DCe()`) | cli_inner_pretty.js:221750 | constant |
| `VI` | `isInteractiveTerminal` (`Ot.isInteractive`; coordinator interactive-local-veto input) | cli_inner_pretty.js:3154 | function |
| `_a` | `isRemoteWorkspace` (`Ot.caps.workspace === "remote"`; coordinator veto input) | cli_inner_pretty.js:3638 | function |
| `_vd` | `getCoordinatorUserContext` (builds `workerToolsContext`; NEW filters drop `Workflow`/`Artifact`; v2.1.156 `wk5`) | cli_inner_pretty.js:221916 | function |
| `cza` | `resolveAgentName` (resolves caller-task's agent name for the relay envelope; NEW) | cli_inner_pretty.js:434343 | function |
| `fDa` | `CONTROL_CHAR_RE` (`/\p{Cc}/u`; Unicode "Control" category; NEW) | cli_inner_pretty.js:362775 | constant |
| `gvd` | `COORDINATOR_HIDDEN_TOOLS` (worker-tool denylist `new Set([zh, Em])`; carryover) | cli_inner_pretty.js:222194 | constant |
| `i$p` | `sendTeammateMessage` (string-message leg → `writeToMailbox` + roster suggestion; v2.1.156 `Ih_`) | cli_inner_pretty.js:434357 | function |
| `kj` | `runTmuxInSwarmSocket` (`tmux [-S <socket>] …`; v2.1.156 `kS`) | cli_inner_pretty.js:421866 | function |
| `lDa` | `wrapRelayMessage` (wraps peer text in `<agent-message from="…">…</agent-message>`; NEW) | cli_inner_pretty.js:362507 | function |
| `lza` | `REQUEST_ID_RE` (`/^[^\n\r]{1,200}$/`; bounds echoed `request_id`; NEW) | cli_inner_pretty.js:434539 | constant |
| `sF` | `SwarmPaneError` (typed error thrown by `a3n`/`Slt` on pane-command failure; carryover) | cli_inner_pretty.js:362769 | class |
| `yF` | `runTmuxInSwarmLabel` (`tmux -L <label> …`; v2.1.156 `BE`) | cli_inner_pretty.js:421871 | function |
| `ylt` | `SWARM_WINDOW_NAME` (`"swarm-view"`; carryover) | cli_inner_pretty.js:362639 | constant |
| `zh` | `SEND_MESSAGE_NAME` (`"SendMessage"`; v2.1.156 `cf`) | cli_inner_pretty.js:221450 | constant |

> **REMOVED in v2.1.183 (TeamCreate / TeamDelete — v2.1.156 before-picture, grep=0 in v2.1.183):** `rd` `TeamCreate` name const (v2.1.156 :216438), `Th_` `TeamCreateTool` def (v2.1.156 :406631), `Oo` `TeamDelete` name const (v2.1.156 :216439), `vh_` `TeamDeleteTool` def (v2.1.156 :406775), `RO4` `TEAM_CREATE_PROMPT` (v2.1.156 :406487), `xO4` `TEAM_DELETE_PROMPT` (v2.1.156 :406735), `oN_` `resolveTeamName` routing pivot (v2.1.156 :398190), `aA4` `spawnTeammate` v2.1.156 entry (v2.1.156 :398160). Full traceability in [`symbol_additions_v2_1_183_agent_team.md`](symbol_additions_v2_1_183_agent_team.md) §8.

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
| `Ewd` | `getPrecomputeBufferFractionResolved` (`return bqr(e,t,n).fraction`; NEW DELTA 4a wrapper) | cli_inner_pretty.js:226935 | function |
| `Ggo` | `RAPID_REFILL_TURN_WINDOW` (`3` — a refill is "rapid" if `turnCounter < 3`; v2.1.156 `Yc6`) | cli_inner_pretty.js:461664 | constant |
| `Igo` | `computeRapidRefillStreak` (rapid-refill counter; byte-identical to v2.1.156 `fc6`) | cli_inner_pretty.js:461481 | function |
| `JNi` | `isValidFraction` (`[0,1)` per-fraction validator for the precompute arm table; NEW DELTA 4a) | cli_inner_pretty.js:226785 | function |
| `Jjp` | `autoWindowSpinnerHint` (DELTA 3 CHANGED: spinner hint; now suppresses for `clientdata` source too; v2.1.156 `Hx_`) | cli_inner_pretty.js:461655 | function |
| `Kjp` | `isModelUnavailableError` (classifier for `FW`; NEW DELTA 1) | cli_inner_pretty.js:461478 | function |
| `Kw` | `isAutoCompactEnabled` (false if `DISABLE_COMPACT`/`DISABLE_AUTO_COMPACT`; else `autoCompactEnabled` config; v2.1.156 `J0`) | cli_inner_pretty.js:226746 | function |
| `QNi` | `AUTOCOMPACT_BUFFER_TOKENS` (`13000`; buffer subtracted from the effective window; v2.1.156 `zX4`) | cli_inner_pretty.js:226839 | constant |
| `Sqr` | `getThresholdOverrides` (CHANGED DELTA 4a: sets `precomputeBufferFraction: Ewd(...)`; v2.1.156 `jc6`) | cli_inner_pretty.js:226938 | function |
| `Swd` | `reportArmTableMalformed` (one-shot emit of `tengu_precompute_arm_table_malformed`; NEW DELTA 4a) | cli_inner_pretty.js:226912 | function |
| `VCe` | `calculateTokenWarningStatePublic` (public warning-state wrapper; blocking base = raw cap `_wd`; v2.1.156 `WRH`) | cli_inner_pretty.js:226951 | function |
| `Wgo` | `isColdCompact` (`st(process.env.CLAUDE_CODE_COLD_COMPACT)`; v2.1.156 `Mc6`) | cli_inner_pretty.js:461516 | function |
| `ZNi` | `MANUAL_COMPACT_BUFFER_TOKENS` (`3000`; buffer subtracted from the blocking base; v2.1.156 `AX4`) | cli_inner_pretty.js:226840 | constant |
| `_qr` | `opus48ExperimentWindow` (Opus-4.8-only autocompact-window override; source `'experiment'`; v2.1.156 `wX4`) | cli_inner_pretty.js:226856 | function |
| `_wd` | `getEffectiveContextWindowSizeRaw` (`tH(e, Wb()) − min(maxOutputTokens, 20000)`; blocking-limit base; v2.1.156 `sb_`) | cli_inner_pretty.js:226908 | function |
| `bwd` | `PRECOMPUTE_ARM_FLAG` (`"tengu_amber_moleskin"`; GrowthBook flag read by `bqr`; NEW DELTA 4a) | cli_inner_pretty.js:226970 | constant |
| `cWn` | `RAPID_REFILL_BREAKER_COUNT` (`3` — rapid-refill thrash breaker trips after 3; v2.1.156 `Y08`) | cli_inner_pretty.js:461665 | constant |
| `eBi` | `parseArmTable` (validates the `tengu_amber_moleskin` payload; strict all-or-nothing; NEW DELTA 4a) | cli_inner_pretty.js:226795 | function |
| `fqr` | `DEFAULT_PRECOMPUTE_BUFFER_FRACTION` (`0.2` default precompute buffer fraction; v2.1.156 `qc6`) | cli_inner_pretty.js:226841 | constant |
| `gqr` | `getPrecomputeBufferFraction` (scalar; `ct("tengu_amber_rokovoko", fqr)` validated; the fallback when the arm table is absent; v2.1.156 `tb_`) | cli_inner_pretty.js:226916 | function |
| `gwd` | `parseArmEntry` (parses one arm entry; requires valid `repl`+`sdk` fractions; NEW DELTA 4a) | cli_inner_pretty.js:226788 | function |
| `hqr` | `WINDOW_MAX` (`1e6` (1M) upper clamp for parsed/env/configured/clientdata windows; v2.1.156 `jX4`) | cli_inner_pretty.js:226967 | constant |
| `hwn` | `WINDOW_MIN` (`1e5` (100k) lower clamp; v2.1.156 `zc6`) | cli_inner_pretty.js:226966 | constant |
| `iBi` | `isAbovePrecomputeOrCompact` (proactive-work gate with a `jQ`=200k standard-window floor; v2.1.156 `tv7`) | cli_inner_pretty.js:226956 | function |
| `jgo` | `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES` (`3` circuit-breaker trip; v2.1.156 `_c6`) | cli_inner_pretty.js:461663 | constant |
| `lMt` | `getAutoCompactThresholdForModel` (`gwn(oee(e,t), Sqr(e,t))`; public threshold; reused by `Yjp`; v2.1.156 `DU6`) | cli_inner_pretty.js:226948 | function |
| `mqr` | `getPrecomputeThreshold` (`Math.min(e - round(e*precomputeBufferFraction), gwn(e,t))`; v2.1.156 `YX4`) | cli_inner_pretty.js:226824 | function |
| `nBi` | `calculateTokenWarningState` (banded classifier → `{level, pctLeft}`; v2.1.156 `fX4`; v2.1.88 `calculateTokenWarningState`) | cli_inner_pretty.js:226827 | function |
| `oBi` | `armTableMalformedLatch` (one-shot guard so `Swd` fires at most once/session; NEW DELTA 4a) | cli_inner_pretty.js:226971 | variable |
| `oee` | `getEffectiveContextWindowSize` (`resolvedWindow − min(maxOutputTokens, sBi=20000)` via `z2`; v2.1.156 `_qH`; v2.1.88 `getEffectiveContextWindowSize`) | cli_inner_pretty.js:226902 | function |
| `qCe` | `isConfiguredWindow` (CHANGED DELTA 3: true iff `z2().source ∈ {env,settings,clientdata,model-default}`; v2.1.156 `EH$`) | cli_inner_pretty.js:226895 | function |
| `rBi` | `AUTO_WINDOW_TABLE` (per-model auto-window override table, init empty `{}`; v2.1.156 `ob_`) | cli_inner_pretty.js:226968 | object |
| `sBi` | `MAX_OUTPUT_TOKENS_FOR_SUMMARY` (`20000` summary output reserve; v2.1.156 `MX4`) | cli_inner_pretty.js:226965 | constant |
| `tBi` | `matchArm` (exact `windowSize` match → entry, else default arm, else null; NEW DELTA 4a) | cli_inner_pretty.js:226813 | function |
| `uG` | `isRedwood3Reactive` (`if (xr()) return !1; return !!ct("tengu_amber_redwood3","")`; reactive-mode gate; v2.1.156 `Pc`) | cli_inner_pretty.js:226742 | function |
| `vqr` | `RECOVERY_TIMEOUT_MS` (`600000`; reactive-routing precompute-swap recovery timeout; NEW DELTA 4) | cli_inner_pretty.js:227081 | constant |
| `wgo` | `THRASHING_USER_MESSAGE` (user-facing "Autocompact is thrashing…"; interpolates `Ggo`/`cWn`; v2.1.156 `Oc6`) | cli_inner_pretty.js:461687 | constant |
| `yae` | `validateEnvInt` (validates an env int with default/upper bounds → `{effective, status}`; v2.1.156 `n$H`) | cli_inner_pretty.js:226769 | function |
| `yqr` | `parseWindowString` (parses `'auto'`/`Nm`/`Nk`/`N` strings, clamps `[hwn..hqr]`; v2.1.156 `Ac6`; v2.1.88 `parseWindowString`) | cli_inner_pretty.js:226843 | function |
| `ywn` | `getAutoCompactWindowSource` (returns just the `.source` field of `z2`; the `thresholdSource`; v2.1.156 `ab_`) | cli_inner_pretty.js:226899 | function |

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
| `$w` | `ENTRYPOINT_NAME` (`"MEMORY.md"`; rename only of v2.1.156 `OX`/`g75`) | cli_inner_pretty.js:150799 | constant |
| `BDp` | `LOCK_FILE_NAME` (`".consolidate-lock"`; auto-dream lock filename; v2.1.156 `qE_`) | cli_inner_pretty.js:424663 | constant |
| `CNr` | `storeClients` (maps parsed store records → `m_n` store clients; carryover transport; v2.1.156 `q24`) | cli_inner_pretty.js:150710 | function |
| `Dg` | `isSimpleSystemPrompt` (memoized simple-system-prompt gate consulted by `e0t`; v2.1.156 `X3`) | cli_inner_pretty.js:134268 | function |
| `Egi` | `buildSimpleMemoryPrompt` (DELTA 3 NEW: compact single/dual-dir builder for the simple-system-prompt branch; v2.1.156 `TFK`) | cli_inner_pretty.js:151481 | function |
| `FDp` | `HOLDER_STALE_MS` (`3600000`, 1 hr; lock stale window; v2.1.156 `KE_`) | cli_inner_pretty.js:424664 | constant |
| `Sgi` | `buildTinyTeamMemoryPrompt` (DELTA 3 NEW: tiny dual-dir private+team builder; v2.1.156 `GFK`) | cli_inner_pretty.js:151426 | function |
| `YSf` | `MEMORY_UPDATE_SOURCE_LABELS` (`{dream:"Background memory consolidation"}`; v2.1.156 `BQ_`) | cli_inner_pretty.js:590643 | constant |
| `_Qu` | `MOUNT_REGEX_MSG` (validation message for the `mount` regex `[A-Za-z0-9_-]+`; carryover) | cli_inner_pretty.js:150481 | constant |
| `aH` | `isTinyMemoryEnabled` (`ct("tengu_billiard_aviary", !1)`; tiny-memory variant gate; v2.1.156 `_D`) | cli_inner_pretty.js:147673 | function |
| `bgi` | `buildTinyMemoryPrompt` (DELTA 3 NEW: tiny single-dir builder; tiny-branch fallback when `Nk()` false; v2.1.156 `ZFK`) | cli_inner_pretty.js:151378 | function |
| `hm` | `getAutoMemBaseDir` (memoized private memory base dir `<Wse()>/projects/<slug>/(memory\|tiny_memory)/`; v2.1.156 `TA`; v2.1.88 `getAutoMemPath`) | cli_inner_pretty.js:147746 | function |
| `jQu` | `parseMemoryStoresEnvSafe` (DELTA 3 NEW: try-wrapped `Zse()` used by `e0t`) | cli_inner_pretty.js:151840 | function |
| `kBp` | `PROMPT_INDEX_WARN_FRACTION` (`0.8`; index-size warn threshold; NEW DELTA 2) | cli_inner_pretty.js:447212 | constant |
| `LBp` | `PROMPT_INDEX_COMPACT_FRACTION` (`0.7`; index-size compaction-target; NEW DELTA 2) | cli_inner_pretty.js:447213 | constant |
| `lAo` | `buildMultistore` (builds a multistore sync object; carryover transport; v2.1.156 `T24`) | cli_inner_pretty.js:448434 | function |
| `m_n` | `MemoryStoreClient` (store transport client; `readByPath`; carryover transport) | cli_inner_pretty.js:150574 | class |
| `mgi` | `buildCombinedPrivateTeam` (DELTA 3 NEW: combined private+team fallback builder; team-branch fallback) | cli_inner_pretty.js:151194 | function |
| `pAo` | `pushMultistore` (startup push for a multistore lane; carryover transport) | cli_inner_pretty.js:448833 | function |
| `rX` | `teamMultistore` (team-scope multistore `lAo(CNr(teamStores),…)`; scope-filtered driving is new; v2.1.156 `Tl`) | cli_inner_pretty.js:449224 | variable |
| `tgi` | `absoluteStorePath` (zod schema for the bare-string/`path` field; carryover; referenced by `bQu`) | cli_inner_pretty.js:150488 | function |
| `tie` | `MAX_ENTRYPOINT_LINES` (`200`; entrypoint line cap; v2.1.156 `B9H`) | cli_inner_pretty.js:150800 | constant |
| `yQu` | `deriveMountName` (derives a mount name from a store path; rename only of v2.1.156 `Qp_`) | cli_inner_pretty.js:150430 | function |

---

## Module: Background Agents

The v2.1.156 → v2.1.183 background-agents delta: the headline cross-cutting **nested-subagent 5-level depth limit** (also tabled under `symbol_index_core_execution.md`), the daemon worker **env-isolation** rework (the 2.1.181 ANTHROPIC_* provider-env leak fix), the reworked **`claude agents --json`** lifecycle surface (2.1.169 / 2.1.162), the re-mangled **`/bg`** / **`/stop`** command surface, and the daemon **retire/respawn** refinements. The bundler re-mangles every build (`zh8`→`sKn`, `Eq9`→`_Fl`, `bBz`→`aGf`, `OH9`→`JMl`, …). Headline anchors below; exhaustive table: [`symbol_additions_v2_1_183_background_agents.md`](symbol_additions_v2_1_183_background_agents.md). Module docs: [`../36_background_agents/`](../36_background_agents/README.md).

> **Nested-subagent depth limit** (`v1i` `SUBAGENT_DEPTH_LIMIT`=5 @221800, `cio` `filterSubagentTools` @371188, `bte` `buildResolvedTools` @371230, `Xut` `registerLocalAgentTask` @446073) is the headline cross-cutting delta but its canonical home is **[`symbol_index_core_execution.md`](symbol_index_core_execution.md)** ("Module: Subagent Depth Limit & Nested Spawn") — cross-linked there, not duplicated as table rows here.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
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
| `Bie` | `classifyTerminal` (`done`→`"success"`, `failed`→`"failure"`, `stopped`→`"stopped"`; terminal classifier behind `lGf`/`ph`) | cli_inner_pretty.js:192481 | function |
| `Egf` | `stopCommandDef` (interactive `/stop` `local-jsx` def; `immediate:!0`, `isEnabled:yi`; v2.1.156 region on `Yh8`) | cli_inner_pretty.js:567208 | object |
| `Gye` | `requestDaemonDetach` (Guard-1 already-bg path; ask the daemon to detach this client; v2.1.156 `bzH`) | cli_inner_pretty.js:477381 | function |
| `Hgf` | `stopCommandDefNonInteractive` (NEW headless `/stop` `type:"local"`, `supportsNonInteractive:!0`; `isEnabled:yi`) | cli_inner_pretty.js:567208 | object |
| `Ne` | `fromEnum` (value-preserving typed telemetry passthrough; cosmetic) | cli_inner_pretty.js:140 | function |
| `Qe` | `fromString` (value-preserving typed telemetry passthrough; cosmetic) | cli_inner_pretty.js:137 | function |
| `Tcc` | `normalizeStatus` (normalizes live-proc transport status to `idle`/`waiting`/`busy`) | cli_inner_pretty.js:691339 | function |
| `Uwe` | `originCwdOf` (resolves a job's origin cwd (de-worktree) for the `--cwd` containment test) | cli_inner_pretty.js:192496 | function |
| `YGf` | `buildSpareHostEnv` (NEW: env for the prewarmed `--bg-pty-host`/`--bg-spare` process; four scrub lists, no re-pass escape, macOS-only OAuth scrub) | cli_inner_pretty.js:695919 | function |
| `Zyn` | `launchEffortFlagsUnpinned` (NEW gate on `--effort` propagation; `Boolean(unpinOpus47/48/Fable5 launch-effort flags)`) | cli_inner_pretty.js:148956 | function |
| `cGf` | `agentsCommandHandler` (wires `--json` + `--all` through; `await t(e.cwd, e.all === !0)`; env guard carryover) | cli_inner_pretty.js:691363 | function |
| `cgf` | `AUTO_NAME_TIMEOUT_MS` (`3000` ms timeout on the async auto-naming LLM call; v2.1.156 `Qwz`) | cli_inner_pretty.js:567109 | constant |
| `hgf` | `backgroundCommandDef` (`local-jsx` `{name:"background", aliases:["bg"], …}`; `ygf = hgf` export alias; v2.1.156 `owz`/`awz`) | cli_inner_pretty.js:567140 | object |
| `iKn` | `deriveBackgroundSeed` (reverse-scan transcript → `{intent, name, nameSource, detail}`; v2.1.156 `Ah8`) | cli_inner_pretty.js:566927 | function |
| `jFe` | `isRecurring` (`routine !== void 0 \|\| inFlight?.kinds.includes("session_cron") \|\| oDt(e)`; recurring-job exception in `lGf`) | cli_inner_pretty.js:192504 | function |
| `ph` | `isTerminal` (`Gk(e.state) && e.tempo !== "active"`; terminal-and-settled; reused as `isSettled`) | cli_inner_pretty.js:192490 | function |
| `rDt` | `reconcileStaleStates` (NEW: auto-fails/auto-blocks process-less on-disk states past the `RAd` grace window) | cli_inner_pretty.js:192384 | function |
| `retireIfSettled` | `BgWorkerHandle.retireIfSettled` (NEW `detritusOnly` carve-out in the inflight guard + field on `tengu_bg_retired`; cliVersion/`session_cron` guards carryover) | cli_inner_pretty.js:594936 | method |
| `ugf` | `BackgroundForkPrompt` (confirm UI; six store selectors, auto-confirm-when-idle, once-only fork effect; v2.1.156 `gwz`) | cli_inner_pretty.js:566957 | function |
| `vcc` | `sanitize` (NEW: strips control chars + collapses whitespace from emitted names; v2.1.156 emitted raw `K.name`) | cli_inner_pretty.js:691333 | function |
| `zzn` | `listDaemonShorts` (NEW source: daemon RPC roster `{shorts, records}`; only `i.shorts` consumed) | cli_inner_pretty.js:564518 | function |

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
| `A2` | `WORKFLOW_SCRIPT_MAX_BYTES` (`524288` = 512 KiB script-size cap; v2.1.156 `jI`) | cli_inner_pretty.js:152140 | constant |
| `CLp` | `workflowInputSchema` (lazy Zod `strictObject`; fields unchanged; v2.1.156 `Q0_`) | cli_inner_pretty.js:419334 | variable |
| `EJu` | `getUserWorkflowSetting` (`mk()?.settings.enableWorkflows`; v2.1.156 `hL5`) | cli_inner_pretty.js:148803 | function |
| `HJu` | `resolveWorkflowAvailability` (`{available, defaultOn: sa()!=="pro"}`; v2.1.156 `SL5`) | cli_inner_pretty.js:148810 | function |
| `Kyn` | `isWorkflowsManagedDisabled` (`CLAUDE_CODE_DISABLE_WORKFLOWS` / `settings.disableWorkflows`; v2.1.156 `H48`) | cli_inner_pretty.js:148777 | function |
| `Q0p` | `WORKFLOW_SUBAGENT_PROMPT` (plain workflow-subagent system prompt; v2.1.156 `iG_`) | cli_inner_pretty.js:417723 | variable |
| `Qel` | `hasUltracodeKeyword` (`findUltracodeKeyword(text).length > 0`; v2.1.156 `lj4`) | cli_inner_pretty.js:464267 | function |
| `Vjn` | `WorkflowInputError` (`Error` subclass thrown by `call` on source/parse failure) | cli_inner_pretty.js:419409 | class |
| `Xel` | `findUltrareviewKeyword` (`matchKeyword(text,"ultrareview")`; v2.1.156 `dj4`) | cli_inner_pretty.js:464258 | function |
| `Yel` | `KEYWORD_DELIMITER_MAP` (masking delimiter map; unchanged; v2.1.156 `gj4`) | cli_inner_pretty.js:464280 | object |
| `aAi` | `isWorkflowsPolicyAllowed` (`di("allow_workflows")` capability gate; v2.1.156 `r$7`) | cli_inner_pretty.js:148800 | function |
| `aLp` | `WORKFLOW_ISOLATION_DESC` (`"'worktree'"`; the only `isolation` value advertised; v2.1.156 `q0_`) | cli_inner_pretty.js:418164 | constant |
| `ddo` | `WORKFLOW_SUBAGENT_DEF` (plain; `agentType:"workflow-subagent"`; v2.1.156 `mp6`) | cli_inner_pretty.js:417811 | object |
| `eNr` | `getWorkflowDefaultOn` (`tNr().defaultOn`; v2.1.156 `qP6`) | cli_inner_pretty.js:148791 | function |
| `gWa` | `MAX_STALL_RETRIES` (`5` per-agent stall retry ceiling; v2.1.156 `p74`) | cli_inner_pretty.js:417740 | constant |
| `jjt` | `resolveNamedWorkflow` (registry lookup of a saved/named workflow; v2.1.156 `AT$`) | cli_inner_pretty.js:418000 | function |
| `nLp` | `WORKFLOW_STRUCTURED_DEF` (`{...ddo, getSystemPrompt:()=>tLp}`; v2.1.156 `sG_`) | cli_inner_pretty.js:417820 | object |
| `nNr` | `isUltracodeOn` (`jr().ultracode === true; if(t) u2(); return t` — unpins launch effort; v2.1.156 `zP6`) | cli_inner_pretty.js:148937 | function |
| `oHl` | `saveWorkflow` (persist a named workflow; emits `tengu_workflow_saved`; v2.1.156 `$Q4`) | cli_inner_pretty.js:530752 | function |
| `r0t` | `readWorkflowScriptFile` (UNC-reject + cwd-resolve + `A2 + 1` bounded read; v2.1.156 `Hj$`) | cli_inner_pretty.js:152126 | function |
| `rLp` | `WORKFLOW_STALL_MS_DEFAULT` (`180000` = 3 min per-agent stall timeout; v2.1.156 `tG_`) | cli_inner_pretty.js:417739 | constant |
| `s4p` | `makeStandingUltracodeReminder` (standing-ultracode `ultra_effort_enter` reminder injector; v2.1.156 `_R_`) | cli_inner_pretty.js:464873 | function |
| `tLp` | `WORKFLOW_STRUCTURED_PROMPT` (StructuredOutput-forcing subagent prompt; v2.1.156 `aG_`) | cli_inner_pretty.js:417804 | variable |
| `tNr` | `resolveWorkflowAvailabilityCached` (memoizes `HJu()` into `Yyn`; v2.1.156 `KP6`) | cli_inner_pretty.js:148806 | function |
| `y1i` | `workflowExports` (namespace exposing lazy `WORKFLOW_TOOL_NAME`/`CODE_REVIEW_WORKFLOW_NAME` getters; v2.1.156 `m57`) | cli_inner_pretty.js:221549 | object |
| `zWn` | `findUltraplanKeyword` (`matchKeyword(text,"ultraplan")`; v2.1.156 `OG8`) | cli_inner_pretty.js:464255 | function |
| `X0p` | `WORKFLOW_REMOTE_DEFAULT` (`50` semaphore width for the remote executor; v2.1.156 `lG_`) | cli_inner_pretty.js:417717 | constant |

---

## Baseline reference

For the v2.1.143 → v2.1.156 baseline of these modules, see the v2.1.156 tree's [`symbol_index_core_features.md`](../../../claude_code_v_2.1.156/analyze/00_overview/symbol_index_core_features.md).
