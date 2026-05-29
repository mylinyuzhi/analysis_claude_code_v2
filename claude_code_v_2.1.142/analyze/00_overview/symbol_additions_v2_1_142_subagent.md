# Symbol Additions — v2.1.142 Subagent Subsystem (Unit 08)

These mappings cover the v2.1.142 subagent subsystem: the three spawn entry points (`--agent`, Agent tool, `CLAUDE_CODE_FORK_SUBAGENT`), agent definition loading from frontmatter, the `runAgent`/`slH` async lifecycle, transcript persistence (sidechain JSONL), fork-pointer hydration, hook/MCP frontmatter inheritance, agent-type matching, skill discovery, and the AgentSummary background loop.

Cross-validated against:
- v2.1.142 bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js`
- v2.1.142 per-decl: `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_unpack_pretty/`
- v2.1.88 TypeScript: `/lyz/codespace/3rd/claude-code/src/tools/AgentTool/`, `/lyz/codespace/3rd/claude-code/src/services/AgentSummary/`
- v2.1.112 reference: `claude_code_v_2.1.112/analyze/30_agent_team/`

> These rows should eventually be merged into `symbol_index_core_execution.md` (subagent runtime, fork) and `symbol_index_core_features.md` (skill discovery, summaries). They live here while Unit 08 (subagent) is being reviewed.

---

## Module: Subagent Definition Loading & Frontmatter (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `iI1` | `KNOWN_FRONTMATTER_KEYS` (the canonical key list — `name`, `description`, `model`, `allowed-tools`, `disable-model-invocation`, `user-invocable`, `effort`, `version`, `tools`, `disallowedTools`, `color`, `permissionMode`, `maxTurns`, `initialPrompt`, `memory`, `background`, `isolation`, `hooks`, `mcpServers`, …) | cli_inner_pretty.js:141694-141748 | constant |
| `JAY` | `FRONTMATTER_KEY_INDEX` (map of normalized→canonical, used for case-/dash-/underscore-insensitive frontmatter parsing) | cli_inner_pretty.js:141749 | constant |
| `rI1` | `normalizeFrontmatterKey` (`replace(/[-_]/g, "").toLowerCase()`) | cli_inner_pretty.js:141688-141690 | function |
| `tO` | `parseMarkdownFrontmatter` (YAML head extraction + tolerant retry with `aI1` quote-escape) | cli_inner_pretty.js:141788-141809 | function |
| `aI1` | `quoteUnquotedFrontmatterValues` (post-failure fixup: quote bare values containing colons/special chars) | cli_inner_pretty.js:141761-141787 | function |
| `as1` | `agentFrontmatterSchema` (Zod schema for agent `.md` frontmatter — name, description, tools, mcpServers, hooks, color, permissionMode, etc.) | cli_inner_pretty.js:198717-198747 | function |
| `rA6` | `skillFrontmatterSchema` (Zod schema for skill `.md` — `context: inline|fork`, `agent:` to bind a `context: fork` skill to a subagent type) | cli_inner_pretty.js:198678-198716 | function |
| `os1` | `commandFrontmatterSchema` (shared base for `agent`/`skill`/`output-style` — `disable-model-invocation`, `user-invocable`, `model`, `argument-hint`) | cli_inner_pretty.js:198640-198677 | function |

---

## Module: Subagent Runtime — runAgent & Lifecycle (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Vb` | `runAgent` (the streaming generator that runs a subagent turn — registers frontmatter hooks, connects agent MCPs, runs the LLM loop, persists transcript, fires SubagentStop) | cli_inner_pretty.js:393099-393434 | function |
| `eo7` | `registerFrontmatterHooks` (registers a subagent's `hooks:` frontmatter into `sessionHooksRegistry`, scoped to the subagent's agentId; cleared in SubagentStop) | cli_inner_pretty.js (called from 393200) | function |
| `g85` | `initializeAgentMcpServers` (loads frontmatter `mcpServers:`; gates on `isSourceAdminTrusted` for `strictPluginOnlyCustomization`) | cli_inner_pretty.js (called from 393232) | function |
| `slH` | `runSubagentLifecycle` (wraps `runAgent` in async-task registration, optional summarization, progress notification) | cli_inner_pretty.js:339762 (def), called from 386739 | function |
| `uiH` | `runResumedSubagent` (resume entry: hydrates transcript, builds `resumePersistedCount`, dispatches to `slH`) | cli_inner_pretty.js:386626-386713 | function |
| `Me` | `recordSidechainTranscript` (append messages to `~/.claude/sidechains/<agentId>.jsonl`) | cli_inner_pretty.js:514415 (export); called from 393304, 393360 | function |
| `tJ$` | `writeAgentMetadata` (write `~/.claude/sidechains/<agentId>.json` — agentType, worktreePath, cwd, description, name) | cli_inner_pretty.js:514386 (export); called from 393305 | function |
| `vE6` | `readAgentMetadata` (counterpart to `tJ$`; resume path uses it to restore worktreePath/cwd/description/name) | cli_inner_pretty.js:514425 (export) | function |
| `miH` | `loadSubagentTranscript` (read sidechain JSONL into messages array) | cli_inner_pretty.js (called from 386641) | function |
| `jVK` | `setAgentTranscriptSubdir` (override sidechain dir for this agent — e.g. a forked skill writes into a per-skill folder) | cli_inner_pretty.js (called from 393131) | function |
| `JVK` | `clearAgentTranscriptSubdir` (lifecycle cleanup: pop the override at SubagentStop) | cli_inner_pretty.js (called from 393417) | function |
| `cJ6` | `filterUnresolvedToolUses` (drop assistant messages whose `tool_use` blocks lack matching `tool_result` — repairs interrupted transcripts on resume) | cli_inner_pretty.js:393435-393451 | function |
| `IA8` | `loadJSONL` (line-delimited JSON reader, surface-level — drops malformed lines) | cli_inner_pretty.js (called from 386641) | function |
| `HJ$` | `stripDeadFork` (drop messages marked as dead-fork branches from prior rewinds) | cli_inner_pretty.js (called from 386641) | function |
| `ej$` | `fixupOrphanToolUseIds` (rebuild integrity invariants after dead-fork strip) | cli_inner_pretty.js (called from 386641) | function |
| `ArK` | `mergeContentReplacements` (merge persisted `contentReplacements` into the current state on resume) | cli_inner_pretty.js (called from 386641) | function |
| `Vy6` | `recordForkContextRef` (write a fork pointer rather than copying the parent transcript — v2.1.118 fix) | cli_inner_pretty.js (called from 393300) | function |

---

## Module: Fork-Subagent Path (`isForkSubagentEnabled` / `FORK_AGENT`) (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `W0` | `isForkSubagentEnabled` (true when `CLAUDE_CODE_FORK_SUBAGENT` env or feature flag enables fork path; mutually exclusive with coordinator mode) | cli_inner_pretty.js:211750-211752 | function |
| `S$_` | `resolveForkSubagentSource` (returns `"disabled" \| "env" \| "ant" \| "gb_rollout"` based on env / feature flag / org gate) | cli_inner_pretty.js:211733-211740 | function |
| `nlK` | `getForkSubagentSource` (memoized + telemetry-emitting wrapper around `S$_`) | cli_inner_pretty.js:211741-211746 | function |
| `R$_` | `_resetForkSubagentSourceTelemetryForTesting` (test-only reset) | cli_inner_pretty.js:211747-211749 | function |
| `vI` | `FORK_AGENT` (synthetic AgentDefinition for the fork path — `agentType:"fork"`, `tools:["*"]`, `permissionMode:"bubble"`, `model:"inherit"`, `maxTurns:200`) | cli_inner_pretty.js:211810-211819 | constant |
| `ilK` | `FORK_SUBAGENT_TYPE` (`"fork"`) | cli_inner_pretty.js:211797 | constant |
| `Yf6` | `buildForkedMessages` (assemble the assistant-with-tool_uses + user-with-placeholder-results message pair; identical prefix for prompt-cache sharing across parallel forks) | cli_inner_pretty.js:211761-211772 | function |
| `zf6` | `isInForkChild` (scan messages for the `FORK_BOILERPLATE_TAG` — guard against recursive forking) | cli_inner_pretty.js:211753-211760 | function |
| `zf$` | `buildChildMessage` (the per-fork directive prompt wrapped in the boilerplate tag) | cli_inner_pretty.js:211773-211789 | function |
| `ff6` | `buildWorktreeNotice` (worktree-aware fork prompt addition — re-read files because parent may have modified) | cli_inner_pretty.js:211790-211792 | function |
| `cLH` | `FORK_BOILERPLATE_TAG` (the XML tag wrapping the fork directive in the child's prompt) | cli_inner_pretty.js (constants), used at 211758 | constant |
| `C$_` | `FORK_PLACEHOLDER_RESULT` (`"Fork started — processing in background"`, the constant tool_result body for every fork child) | cli_inner_pretty.js:211799 | constant |
| `I$_` | `tengu_fork_subagent_enabled` (telemetry event name) | cli_inner_pretty.js:211795 | constant |
| `h$_` | `tengu_copper_fox` (the feature-flag key gating fork-subagent rollout) | cli_inner_pretty.js:211794 | constant |
| `IH8` | `forkSubagentSourceMemo` (module-level cache for `nlK` — set on first call) | cli_inner_pretty.js:211796 | variable |
| `GHH` | `isForkSubagentRuntimeEnabled` (a parallel runtime gate used elsewhere — returns true if env var set or `tengu_copper_fox` flag on) | cli_inner_pretty.js:344846-344851 | function |
| `i3H` | `isFeatureDisabled` (the master-kill predicate consulted by `S$_`/`GHH`) | cli_inner_pretty.js:211707-211709 | function |

---

## Module: Agent-Type Matching (Case/Separator-Insensitive) (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Zu7` | `normalizeAgentTypeSlug` (`NFKC` + `toLowerCase` + strip `\p{White_Space}\p{Pd}_`) | cli_inner_pretty.js:351139-351143 | function |
| `Y5H` | `truncateForErrorLabel` (bounded substring of normalized agent name for telemetry/error text) | cli_inner_pretty.js (called from 351374) | function |
| `WV6` | `findDenyingPermissionRule` (locate the permission rule that disallowed a matched agent — distinguishes "not found" from "denied") | cli_inner_pretty.js:421499 (export) | function |
| `GnH` | `filterAgentsByPermission` (apply `Agent(<type>)` deny rules to the agent list before resolution) | cli_inner_pretty.js (called from 351367) | function |
| `BOH` | `rememberLastResolutionColor` (cache the requested→canonical color mapping for spinner UI) | cli_inner_pretty.js (called from 351396) | function |

---

## Module: Main-Thread Agent (`--agent` flag) Session State (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Kh` | `getMainThreadAgentType` (state getter — current `--agent` value, undefined for plain sessions) | cli_inner_pretty.js:3074-3077 | function |
| `vp` | `setMainThreadAgentType` (state setter; written when `--agent <name>` is parsed) | cli_inner_pretty.js:3078-3082 | function |
| `kp` | `getMainThreadAgentHooks` (returns the agent-frontmatter hooks registered on `--agent` start) | cli_inner_pretty.js:3083-3085 | function |
| `dv$` | `setMainThreadAgentHooks` (write-through state setter) | cli_inner_pretty.js:3087-3090 | function |
| `mainThreadAgentType` | session state field | cli_inner_pretty.js:2282 | variable |
| `mainThreadAgentHooks` | session state field | cli_inner_pretty.js:2283 | variable |

---

## Module: Subagent Skill Discovery (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ax5` | `getSkillsFromAllSources` (unified loader returning skill-dir + plugin + bundled + builtin-plugin skills; v2.1.133 made this same for main and subagent) | cli_inner_pretty.js:513752 | function |
| `KI6` | `loadSkillDirCommands` (walk `<repo>/.claude/skills/` + `~/.claude/skills/`) | cli_inner_pretty.js (called from `Ax5`) | function |
| `Dh6` | `loadPluginSkills` (walk every enabled plugin's `skillsPath`/`skillsPaths`) | cli_inner_pretty.js (called from `Ax5`) | function |
| `zG4` | `getBundledSkills` | cli_inner_pretty.js (called from `Ax5`) | function |
| `GrK` | `getBuiltinPluginSkills` | cli_inner_pretty.js (called from `Ax5`) | function |
| `c85` | `resolveSkillByName` (look up a skill by frontmatter `skills:` list in agent definition) | cli_inner_pretty.js (called from 393206) | function |
| `InH` | `getSkillCommandFromSkill` (turn a Skill entry into a slash command record for preload) | cli_inner_pretty.js (called from 393211) | function |
| `YX$` | `formatSkillLoadingMetadata` (label preloaded skills with their progress messages in subagent transcript) | cli_inner_pretty.js (dynamic import at 393218) | function |

---

## Module: Subagent Hook Inheritance (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `QL$` | `executeSubagentStartHooks` (fires `SubagentStart` for both agent-frontmatter and settings hooks; returns additional_context to inject) | cli_inner_pretty.js:520054-520057 (def), 520399 (export) | function |
| `S9H` | `executeSubagentStopHooks` (fires `SubagentStop` at lifecycle end — runs via `runAgent`'s finally block on interrupted queries) | cli_inner_pretty.js (called from 393377) | function |
| `eo7` | `registerFrontmatterHooks` (validates v2.1.142 prompt-/agent-type hooks against `SessionStart`/`Setup`/`SubagentStart` and rejects with "use a command-type hook instead") | cli_inner_pretty.js (called from 393200) | function |
| `B7H` | `isAgentTypeAdminTrusted` (gate that lets policy-/plugin-/built-in-sourced agents register hooks even when user hooks are disabled) | cli_inner_pretty.js (called from 393199) | function |
| `DX` | `isFeatureBypassed` (feature kill-switch consulted by `B7H`) | cli_inner_pretty.js (called from 393199) | function |

---

## Module: AgentSummary Background Loop (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `CM$` | `startAgentSummarization` (per-subagent timer loop that periodically forks a summary turn over the subagent's transcript; cache-shared with the parent) | cli_inner_pretty.js:271869-271941 | function |
| `JV` | `runForkedQueryForSummary` (the inner fork call that produces the summary string) | cli_inner_pretty.js (called from 271902) | function |
| `lO7` | `recordAgentSummary` (write the summary back to the subagent's progress state so the parent sees it in task notifications) | cli_inner_pretty.js (called from 271922) | function |
| `cJ6` | `filterUnresolvedToolUses` (reused — see Subagent Runtime above) | cli_inner_pretty.js:393435-393451 | function |
| `zP_` | `summaryPromptTemplate` (the "describe your most recent action in 3-5 words using present tense (-ing)" prompt) | cli_inner_pretty.js:271850-271867 | function |
| `AP_` | `SUMMARY_INTERVAL_MS` (30000 — wall-clock interval between summary attempts) | cli_inner_pretty.js:271942 | constant |
| `tengu_agent_summary_skipped` | telemetry event name for "transcript unchanged" cap | cli_inner_pretty.js (emitted at 271891) | constant |

---

## Module: Subagent Color Palette (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Nf` | `AGENT_COLOR_PALETTE` (`["red","blue","green","yellow","purple","orange","pink","cyan"]` — the canonical set of agent colors; the v2.1.140 update preserved this 8-color palette with revised TUI shades) | cli_inner_pretty.js:231368 | constant |
| `UP` | `AGENT_COLOR_TUI_KEYS` (per-color theme keys — `red_FOR_SUBAGENTS_ONLY`, …) | cli_inner_pretty.js:231369-231378 | constant |
| `agentColorMap` | session-state map of agentId → color | cli_inner_pretty.js:2250 | variable |
| `agentColorIndex` | rotating index for auto-assigning the next palette color | cli_inner_pretty.js:2251 | variable |

---

## Module: Subagent Hook Schemas — SubagentStart Telemetry (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `SUBAGENT_START` | hook event name string | cli_inner_pretty.js:48544, 237667 | constant |
| `ZY_` | `subagentStartHookInputSchema` (Zod schema — `hookEventName: "SubagentStart"`, `additionalContext: string?`) | cli_inner_pretty.js:238068, 519062 | function |
| `M_` | `buildHookInputBase` (hook-input common fields builder — used at 520055 with `agent_id`/`agent_type` for SubagentStart) | cli_inner_pretty.js (called from 520055) | function |

---

## Module: Agent Tool — Dispatch Header & Resume (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `D7` | `AGENT_TOOL_NAME` (`"Agent"`) | cli_inner_pretty.js (used at 351038, etc.) | constant |
| `mZ` | `SEND_MESSAGE_TOOL_NAME` (`"SendMessage"` — agent-team-aware resume) | cli_inner_pretty.js (used at 235696, 235712) | constant |
| `at` | `GENERAL_PURPOSE_AGENT` (the default `general-purpose` AgentDefinition used when `subagent_type` is omitted and fork path is disabled) | cli_inner_pretty.js (used at 211736-211740, 351038) | constant |
| `F7H` | `userFacingAgentName` (map an internal agentType to its display label) | cli_inner_pretty.js (called from 351046) | function |

---

## Cross-References

- **Built-in agents**: `Plan` (`d88`, cli_inner_pretty.js:231700), `statusline-setup` (`q67`, cli_inner_pretty.js:231715), `Explore`, `general-purpose`. The frontmatter `omitClaudeMd: !0` (e.g. `Plan` line 231709) controls CLAUDE.md hierarchy inclusion in the subagent's userContext.
- **Telemetry**: `tengu_subagent_type_normalized`, `tengu_subagent_type_miss`, `tengu_fork_subagent_enabled`, `tengu_agent_summary_skipped`.
- **Subagent identity headers**: `x-claude-code-agent-id` and `x-claude-code-parent-agent-id` set in API request headers at cli_inner_pretty.js:128061-128062 (v2.1.139 introduction).

---

**Status**: Consolidated into symbol_index_core_execution.md as of v2.1.142 deobfuscation work.

---

## Module: ALS Agent-Context Propagation & UI Palette (cli_inner_pretty.js)

Added while writing [34_subagent/runtime_execution.md](../34_subagent/runtime_execution.md), [als_propagation.md](../34_subagent/als_propagation.md), and [subagent_ui_rendering.md](../34_subagent/subagent_ui_rendering.md). These cover the runtime-time identity propagation and the parent-REPL rendering surfaces.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Atq` | `agentContextAsyncStorage` (`AsyncLocalStorage<AgentContext>` instance) | cli_inner_pretty.js:97641 | variable |
| `RD` | `getAgentContext` (`Atq.getStore()`) | cli_inner_pretty.js:97620-97622 | function |
| `RU` | `runWithAgentContext` (`Atq.run(ctx, fn)`) | cli_inner_pretty.js:97623-97625 | function |
| `Cz1` | `isSubagentContext` (`ctx?.agentType === "subagent"`) | cli_inner_pretty.js:97626-97628 | function |
| `ztq` | `getSubagentLogName` (returns built-in name or literal `"user-defined"`) | cli_inner_pretty.js:97629-97633 | function |
| `Ni8` | `consumeInvokingRequestId` (one-shot spawn/resume edge emitter) | cli_inner_pretty.js:97634-97638 | function |
| `_tq` | `async_hooks` module reference | cli_inner_pretty.js:97640 | variable |
| `cJ6` | `dropDanglingToolUses` (strips assistant messages whose `tool_use` block has no matching `tool_result` — used both by `runAgent` and `startAgentSummarization`) | cli_inner_pretty.js:393435-393451 | function |
| `d85` | `buildSubagentSystemPrompt` (composes subagent prompt; falls back to `Ka7` on throw) | cli_inner_pretty.js:393452-393460 | function |
| `c85` | `resolveAgentSkill` (tries `name`, `agentType:name`, `*:name` suffix) | cli_inner_pretty.js:393461-393472 | function |
| `Q85` | `isPersistableMessage` (predicate filtering `stream_event`/etc. out of sidechain writes) | cli_inner_pretty.js (called from 393357) | function |
| `S9H` | `executeSubagentStopHook` (post-loop hook runner; 5 s budget when called from interrupted-loop finally) | cli_inner_pretty.js (called from 393377) | function |
| `qa7` | `registerKeepalive` (mark agent as kept-alive in `taskRegistry`; skips shellTasks/mcpMonitors cleanup) | cli_inner_pretty.js (called from 393370) | function |
| `en7` | `clearShellTasks` (per-agent shell-task cleanup) | cli_inner_pretty.js (called from 393427) | function |
| `nTH` | `unregisterPerfettoAgent` (perfetto-tracing cleanup) | cli_inner_pretty.js (called from 393416) | function |
| `$a7` | `clearSentSkillNames` (per-agent skill-listing cleanup) | cli_inner_pretty.js (called from 393397) | function |
| `vnK` | `clearPromptCacheTracking` (per-agent cache stats cleanup) | cli_inner_pretty.js (called from 393393) | function |
| `Ag` | `isPromptCacheTrackingEnabled` | cli_inner_pretty.js (called from 393393) | function |
| `rj` | `isSyntheticAgent` (true for FORK_AGENT and similar built-ins with a `callback`) | cli_inner_pretty.js (called from 393368) | function |
| `kwH` | `resolveAgentModel` (`agentDef.model > runtimeOverride > permission-mode override > mainLoopModel`) | cli_inner_pretty.js (called from 393129) | function |
| `Li` | `resolveAgentTools` (filter the parent's tool pool by agent frontmatter `tools:`/`disallowedTools:`) | cli_inner_pretty.js (called from 393177) | function |
| `rS7` | `isInProcessTeammate` (gate for stricter tool-pool filter in teammate path) | cli_inner_pretty.js (called from 393178) | function |
| `iS7` | `TEAMMATE_BLOCKED_TOOLS` (set of tool names removed for in-process teammates: Goal/SpawnTeammate/etc.) | cli_inner_pretty.js (used in 393178) | constant |
| `B7H` | `isSourceAdminTrusted` (admin-trusted source bypass for hook/mcp gates) | cli_inner_pretty.js (called from 393199) | function |
| `eo7` | `registerFrontmatterHooks` (register agent.hooks into sessionHooksRegistry under agentId) | cli_inner_pretty.js (called from 393200) | function |
| `g85` | `initializeAgentMcpServers` (connect agent's frontmatter mcpServers, return clients/tools/cleanup) | cli_inner_pretty.js (called from 393232) | function |
| `Mm` / `V7H` | `cloneReadFileState` (clone for subagent; fork path uses parent's directly) | cli_inner_pretty.js (called from 393139) | function |
| `Yg` | `EMPTY_READ_FILE_STATE` (constant initial state for non-fork subagents) | cli_inner_pretty.js (used at 393139) | constant |
| `zj6` | `createSubagentContext` (forks the parent's `ToolUseContext` with new agentId/messages/appState) | cli_inner_pretty.js (called from 393263) | function |
| `Ty6` | `computeSkillListingAttachment` (skill catalog attachment shown to subagent) | cli_inner_pretty.js (called from 393281) | function |
| `Gy6` | `crypto` module alias used in `runAgent` for `randomUUID()` | cli_inner_pretty.js:393473 | variable |
| `AMH` | `attachContextAttachments` (compose attachment list from MCP/tool pool) | cli_inner_pretty.js (called from 393234) | function |
| `Nf` | `AGENT_COLOR_PALETTE` (`["red","blue","green","yellow","purple","orange","pink","cyan"]`) | cli_inner_pretty.js:231368 | constant |
| `UP` | `SUBAGENT_THEME_KEYS` (`{red:"red_FOR_SUBAGENTS_ONLY", ...}` — segregated from role tokens) | cli_inner_pretty.js:231369-231378 | constant |
| `red_FOR_SUBAGENTS_ONLY` (and 7 siblings) | theme tokens for subagent palette; resolved against active theme | cli_inner_pretty.js:145287-145294 (light RGB), 145357-145364 (ANSI) | theme-token |
| `CM$` | `startAgentSummarization` (per-async-subagent 30 s timer producing `<task-notification>` summaries; skips when transcript unchanged) | cli_inner_pretty.js:271869-271941 | function |
| `AP_` | `AGENT_SUMMARY_DEFAULT_INTERVAL` (30000 ms) | cli_inner_pretty.js:271942 | constant |
| `zP_` | `buildAgentSummaryPrompt` (the user-msg template fed to the summarization fork) | cli_inner_pretty.js:271850-271867 | function |
| `JV` | `forkAndQueryOnce` (cache-safe, transcript-skipping query used by background summarization) | cli_inner_pretty.js (called from 271902) | function |
| `lO7` | `emitTaskNotification` (push `<task-notification>` into the parent's main loop queue) | cli_inner_pretty.js (called from 271922) | function |
| `Oz` | `TASK_NOTIFICATION_MODE` (`"task-notification"`) | cli_inner_pretty.js:41076 | constant |
| `tengu_agent_summary_skipped` | telemetry — summarization tick skipped (`reason: "unchanged"`) | cli_inner_pretty.js:271891 | event-name |

---

## Module: Sidechain Transcript & Fork Pointer (cli_inner_pretty.js)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Me` | `recordSidechainTranscript` (write subagent message chain into `~/.claude/sidechains/<agentId>.jsonl`) | cli_inner_pretty.js:515274-515276 | function |
| `Vy6` | `recordForkContextRef` (persist `fork-context-ref` record with `parentSessionId`/`parentLastUuid`/`contextLength`) | cli_inner_pretty.js:515277-515279 | function |
| `Zx5` | `loadForkContextPrefix` (read parent transcript starting at `parentLastUuid`; LRU cache via `iEH`) | cli_inner_pretty.js:515280-515301 | function |
| `iEH` | `forkContextRefCache` (LRU map; cap `Wx5`) | cli_inner_pretty.js:515282-515301 | variable |
| `tJ$` | `writeAgentMetadata` (write `~/.claude/sidechains/<agentId>.json` — agentType/cwd/worktreePath/description/name) | cli_inner_pretty.js (called from 393305) | function |
| `jVK` | `setAgentTranscriptSubdir` (override per-agent transcript subdir) | cli_inner_pretty.js:141615-141617 | function |
| `JVK` | `clearAgentTranscriptSubdir` (cleanup counterpart, called in finally) | cli_inner_pretty.js:141618-141620 | function |
| `wK6` | `agentTranscriptSubdirMap` | cli_inner_pretty.js:141647 | variable |
| `_0` | `getSidechainPath` (resolves `~/.claude/<session>/subagents[/<subdir>]/agent-<agentId>.jsonl`) | cli_inner_pretty.js:141621-141627 | function |
| `Ui$` | `listSidechainAgentIds` (enumerate agent ids from filenames) | cli_inner_pretty.js:141628-141639 | function |
| `XVK` | `extractTeammateMessageQueues` | cli_inner_pretty.js:141640-141646 | function |

---

## Module: Built-in Agent Definitions (cli_inner_pretty.js)

Added while writing [34_subagent/builtin_agents.md](../34_subagent/builtin_agents.md). The built-in agents are static `AgentDefinition` constants registered at startup via `xgH`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `xgH` | `assembleBuiltInAgents` (registration list assembler; conditionally includes by SDK entrypoint / coordinator mode / remote-MCP) | cli_inner_pretty.js:231898-231913 | function |
| `bC` | `getActiveAgentsFromList` (precedence merge: built-in → plugin → user → project → flag → policy, last-write-wins) | cli_inner_pretty.js:231970-231981 | function |
| `at` | `GENERAL_PURPOSE_AGENT` (the `general-purpose` built-in; `tools: ["*"]`, no model — inherits parent) | cli_inner_pretty.js:231625-231633 | constant |
| `ot` | `EXPLORE_AGENT` (the `Explore` built-in; read-only with `disallowedTools`, `model: haiku` external / `inherit` ant, `omitClaudeMd: true`) | cli_inner_pretty.js:231595-231605 | constant |
| `d88` | `PLAN_AGENT` (the `Plan` built-in; read-only architect, `model: "inherit"`, `omitClaudeMd: true`, reuses Explore's tools) | cli_inner_pretty.js:231700-231711 | constant |
| `q67` | `STATUSLINE_SETUP_AGENT` (the `statusline-setup` built-in; `tools: ["Read", "Edit"]`, `model: "sonnet"`, `color: "orange"`) | cli_inner_pretty.js:231715-231860 | constant |
| `H67` | `CLAUDE_CODE_GUIDE_AGENT` (the `claude-code-guide` built-in; dynamic prompt that embeds user's config; `permissionMode: "dontAsk"`, `model: "haiku"`) | cli_inner_pretty.js:231470-231538 | constant |
| `BM6` | `CLAUDE_CODE_GUIDE_AGENT_TYPE` (`"claude-code-guide"`) | cli_inner_pretty.js:231457 | constant |
| `FM6` | `CLAUDE_FLEETVIEW_AGENT` (the `claude` built-in for FleetView background jobs; `isolation: "worktree"`, `permissionMode: "auto"`, `appendSystemPrompt: true`) | cli_inner_pretty.js:231865-231893 | constant |
| `J5_` | `getGeneralPurposeSystemPrompt` (the static prompt body for the general-purpose agent) | cli_inner_pretty.js:231607-231621 | function |
| `w5_` | `getExploreSystemPrompt` (the Explore agent's prompt with read-only mode boilerplate; selects search-tool guidance based on `hasEmbeddedSearchTools`) | cli_inner_pretty.js:231540-231581 | function |
| `X5_` | `getPlanSystemPrompt` (the Plan agent's prompt with read-only mode boilerplate) | cli_inner_pretty.js:231635-231688 | function |
| `O5_` | `getClaudeCodeGuideBasePrompt` (the dynamic base for claude-code-guide; spliced with user-config sections by `H67.getSystemPrompt`) | cli_inner_pretty.js:231390-231448 | function |
| `M5_` | `getFeedbackGuideline` (3P vs internal: feedback URL or `/feedback` command) | cli_inner_pretty.js:231450-231453 | function |
| `f5_` | `CLAUDE_CODE_DOCS_MAP_URL` (`"https://code.claude.com/docs/en/claude_code_docs_map.md"`) | cli_inner_pretty.js:231455 | constant |
| `e87` | `CDP_DOCS_MAP_URL` (`"https://platform.claude.com/llms.txt"`) | cli_inner_pretty.js:231456 | constant |
| `D5_` | `EXPLORE_WHEN_TO_USE_FULL` (full description for system-prompt enumeration) | cli_inner_pretty.js:231583-231584 | constant |
| `j5_` | `EXPLORE_WHEN_TO_USE_LEAN` (lean description for agent_listing_delta — shorter) | cli_inner_pretty.js:231585 | constant |
| `$67` | `EXPLORE_AGENT_MIN_QUERIES` (`3`) | cli_inner_pretty.js:231582 | constant |
| `rj` | `isBuiltInAgent` (`H.source === "built-in"`) | cli_inner_pretty.js:231961-231963 | function |
| `g7H` | `isPluginAgent` (`H.source === "plugin"`) | cli_inner_pretty.js:231967-231969 | function |
| `ZTH` | `isCustomAgent` (neither built-in nor plugin) | cli_inner_pretty.js:231964-231966 | function |
| `c88` | `hasRequiredMcpServers` (substring/case-insensitive match against the MCP server list) | cli_inner_pretty.js:231982-231985 | function |
| `s3$` | `filterAgentsByMcpRequirements` (drop agents whose `requiredMcpServers` aren't satisfied) | cli_inner_pretty.js:231986-231988 | function |
| `o3$` | `areExplorePlanAgentsEnabled` (currently always returns true; gate placeholder for Explore + Plan) | cli_inner_pretty.js:231895-231897 | function |

---

## Module: Agent Tool Dispatch (cli_inner_pretty.js)

Added while writing [34_subagent/agent_tool_dispatch.md](../34_subagent/agent_tool_dispatch.md). These cover the Agent tool's `call()` handler.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Gu7` | `AgentTool` (the Agent tool definition object) | cli_inner_pretty.js:351269 | constant |
| `eq7` | `buildAgentToolPrompt` (the Agent tool's prompt builder; emits 'When to fork', examples, agent listings) | cli_inner_pretty.js:235536-235727 | function |
| `Fw6` | `renderAgentForListing` (`- name: whenToUse (Tools: ...)` line) | cli_inner_pretty.js:235526-235530 | function |
| `lA_` | `formatAgentTools` (renders tool subset: "All tools" / "All tools except X" / explicit list) | cli_inner_pretty.js:235513-235525 | function |
| `gw6` | `isAgentListAttachEnabled` (env CLAUDE_CODE_AGENT_LIST_IN_MESSAGES + `tengu_agent_list_attach` flag) | cli_inner_pretty.js:235531-235535 | function |
| `XV6` | `buildAgentToolInputSchema` (schema builder; conditionally adds team/name/mode/isolation/cwd fields) | cli_inner_pretty.js:351242-351267 | function |
| `xc_` | `agentToolOutputSchema` | cli_inner_pretty.js (called from 351292) | function |
| `TnH` | `registerBackgroundAsyncTask` (async-path task registration in taskRegistry) | cli_inner_pretty.js:351577 | function |
| `Tu7` | `registerForegroundAsyncTask` (sync-path with auto-background watchdog) | cli_inner_pretty.js:351672 | function |
| `tI7` | `spawnTeammate` (multi-agent-teams spawn entry point) | cli_inner_pretty.js:351340 | function |
| `eJ$` | `createAgentWorktree` (worktree setup via `git worktree add`) | cli_inner_pretty.js:351528 | function |
| `nwH` | `removeAgentWorktree` | cli_inner_pretty.js (called from 351563) | function |
| `GV6` | `hasWorktreeChanges` (cleanup gate — keep worktree if it has diffs) | cli_inner_pretty.js (called from 351561) | function |
| `ZV6` | `getAgentWorktreeName` (`agent-<shortId>` slug) | cli_inner_pretty.js (called from 351528) | function |
| `Zz` | `toAgentId` (type-brand UUID → typed AgentId) | cli_inner_pretty.js (called from 351528, 351586) | function |
| `Jq$` | `runWithCwdOverride` (wraps an async closure with cwd-override scope) | cli_inner_pretty.js (called from 351599, 351649) | function |
| `BOH` | `rememberAgentColor` (cache requested→color for spinner UI) | cli_inner_pretty.js (called from 351339, 351393, 351462) | function |
| `kwH` | `resolveAgentModel` (precedence: agent.model > runtime override > permission-mode default > parent) | cli_inner_pretty.js (called from 351463) | function |
| `vHH` | `filterToolPoolByPermission` (apply permission-mode filter to tool pool) | cli_inner_pretty.js (called from 351524) | function |
| `n7H` | `getMcpServerNameFromTool` (extract server from `mcp__<server>__<tool>`) | cli_inner_pretty.js:235745-235747 | function |
| `k0` | `isMcpTool` (`name?.startsWith("mcp__") || isMcp === true`) | cli_inner_pretty.js:235742-235744 | function |
| `WV6` | `findDenyingPermissionRule` (locate rule blocking matched agent for error messages) | cli_inner_pretty.js (called from 351397) | function |
| `Rc_` | `getAutoBackgroundMs` (returns 120000 if `CLAUDE_AUTO_BACKGROUND_TASKS` env or `tengu_auto_background_agents` flag) | cli_inner_pretty.js (called from 351679) | function |
| `ZnH` | `isBackgroundTasksDisabled` (env `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS`) | cli_inner_pretty.js (read at 351521, 351671, etc.) | variable |
| `Sc_` | `BACKGROUND_HINT_DELAY_MS` (sync-path progress threshold) | cli_inner_pretty.js (read at 351708) | constant |
| `Ko` | `isSummarizationEnabled` (gate for `startAgentSummarization`) | cli_inner_pretty.js (read at 351615, 351694) | function |
| `bwH` | `accumulateAgentStats` (per-message stats accumulator) | cli_inner_pretty.js (called from 351737, 351749) | function |
| `avH` | `createToolStatsAccumulator` | cli_inner_pretty.js (called from 351652) | function |
| `svH` | `getToolNameRegistry` | cli_inner_pretty.js (called from 351653) | function |
| `H9H` | `getCurrentStats` | cli_inner_pretty.js (called from 351749) | function |
| `Yz8` | `extractAssistantTextBlock` (per-block text extractor for progress events) | cli_inner_pretty.js (called from 351750) | function |
| `fz8` | `emitAssistantBlockProgress` (per-block progress event emitter) | cli_inner_pretty.js (called from 351751) | function |
| `zz8` | `buildAgentResultEnvelope` (sync-path result aggregator) | cli_inner_pretty.js (called from 351753) | function |
| `Mz8` | `recordAgentCompletion` (`taskRegistry.update` for sync completion) | cli_inner_pretty.js (called from 351754) | function |
| `Oz8` | `classifyHandoffIfNeeded` (subagent → main-thread handoff hint extraction) | cli_inner_pretty.js (called from 351761) | function |
| `e4H` | `completeAsyncAgent` (taskRegistry update for async completion) | cli_inner_pretty.js (called from 351775) | function |
| `$9H` | `failAsyncAgent` (taskRegistry update for async failure) | cli_inner_pretty.js (called from 351792) | function |
| `Mq` (alias on `g7H` callees) | `getPluginMetadata` (returns pluginId/marketplace for telemetry) | cli_inner_pretty.js (called from 351466) | function |
| `RH` | `recordSuccess` (success counter for `subagent_launch`) | cli_inner_pretty.js (called from 351355, 351622, 351701) | function |
| `uH` | `bumpErr` (error counter for `subagent_launch:<reason>`) | cli_inner_pretty.js (throughout error paths) | function |
| `at.agentType` | the constant `"general-purpose"` | cli_inner_pretty.js (used at 351357) | constant |
| `LZH` | `MAIN_AGENT_REPL_KEY` (sentinel key for main-thread REPL context map) | cli_inner_pretty.js (read at 351543) | constant |
| `HdH` | `deriveQuerySource` (`agent:builtin:X` / `agent:user:X` / etc. for telemetry) | cli_inner_pretty.js (called from 351537) | function |

---

## Module: Reminder Interactions / Attachment Channels (cli_inner_pretty.js)

Added while writing [34_subagent/reminder_interaction.md](../34_subagent/reminder_interaction.md). These cover the attachment + system-reminder injection path.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AMH` | `computeAttachmentsForSubagent` (orchestrator at runAgent setup; calls individual delta-computers) | cli_inner_pretty.js (called from 393234) | function |
| `Tt_` | `normalizeAttachmentForAPI` (converts attachment object → user message; per-attachment renderer dispatch table at 425165+) | cli_inner_pretty.js:425165+ | function |
| `fK` | `createAttachmentMessage` (low-level attachment-message builder) | cli_inner_pretty.js (called from 393190, 393197, 393234, 393284) | function |
| `mQH` | `computeAgentListingDelta` (diff against prior `agent_listing_delta`s; emit added/removed types) | cli_inner_pretty.js:397839-397875 | function |
| `Ty6` | `computeSkillListingAttachment` (per-agent skill dedup via `tO8` map; main-loop seed via `eO8`) | cli_inner_pretty.js:398336-398366 | function |
| `s65` | `computeCriticalSystemReminder` (per-turn re-injection of `criticalSystemReminder_EXPERIMENTAL`) | cli_inner_pretty.js:397884-397888 | function |
| `BQH` | `computeMcpInstructionsDelta` (per-server instruction publication; delta against prior) | cli_inner_pretty.js:397876-397882 | function |
| `t65` | `computeOutputStyleReminder` (output-style turn reminder) | cli_inner_pretty.js:397889-397894 | function |
| `e65` | `computeSelectedLinesInIdeAttachment` (IDE-selected lines injection) | cli_inner_pretty.js:397895-397911 | function |
| `a65` | `computeThinkingReminder` (thinking-mode reminder for user prompts) | cli_inner_pretty.js:397820-397830 | function |
| `tO8` | `perAgentSkillSentSet` (Map<agentId, Set<skillName>> for dedup) | cli_inner_pretty.js (read at 398345-398354) | variable |
| `eO8` | `mainLoopSkillSeedFlag` (one-shot: seeds without sending on first main-loop call) | cli_inner_pretty.js (read at 398347-398351) | variable |
| `rM6` | `renderSkillListContent` (formats skill catalog as text; usage-weighted ordering via `l7H`) | cli_inner_pretty.js:232385 | function |
| `qM8` | `getMcpSkillCommands` (skills published by MCP servers) | cli_inner_pretty.js (called from 398341) | function |
| `D9H` | `dedupSkillCommands` (dedup by name, plugin-aware) | cli_inner_pretty.js (called from 398342) | function |
| `cw` | `uniqBy` (lodash-style dedup helper) | cli_inner_pretty.js (called from 393233, 398342) | function |
| `Q7H` | `applySkillOverlay` (main-loop only: append session-skill overlay) | cli_inner_pretty.js (called from 398343) | function |
| `Np` | `getSessionSkillOverlay` | cli_inner_pretty.js (called from 398343) | function |
| `gZ` | `loadSkillsFromDisk` (project + user dirs, plugin dirs, bundled) | cli_inner_pretty.js (called from 393203, 398340) | function |
| `R9` | `getProjectRoot` | cli_inner_pretty.js (called from 393203, 398339) | function |
| `o_` | `wrapInArray` (`[H]` — used by attachment renderers) | cli_inner_pretty.js (used throughout 425*) | function |
| `w8` | `createUserMessage` (`{type: "user", message: {role: "user", content: ...}, isMeta?, uuid, ...}`) | cli_inner_pretty.js (used throughout) | function |
| `Z$` | `getFeatureValue_CACHED_MAY_BE_STALE` (GrowthBook flag reader) | cli_inner_pretty.js (used throughout) | function |
| `bH` | `parseEnvTruthy` (env var truthiness with "1"/"true" matches) | cli_inner_pretty.js (used throughout) | function |
| `E4` | `parseEnvFalsy` (env var explicit-false check) | cli_inner_pretty.js (used at 235533) | function |
| `Ka7` | `DEFAULT_SUBAGENT_SYSTEM_PROMPT` (fallback when agent.getSystemPrompt throws) | cli_inner_pretty.js (used in `d85` fallback path) | constant |
| `criticalSystemReminder_EXPERIMENTAL` | per-agent definition field; injected each turn | cli_inner_pretty.js:238250, 242698, 393275, 397885 | string |
