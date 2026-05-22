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
| `Vb` | `runAgent` (the streaming generator that runs a subagent turn — registers frontmatter hooks, connects agent MCPs, runs the LLM loop, persists transcript, fires SubagentStop) | cli_inner_pretty.js:393107-393434 | function |
| `eo7` | `registerFrontmatterHooks` (registers a subagent's `hooks:` frontmatter into `sessionHooksRegistry`, scoped to the subagent's agentId; cleared in SubagentStop) | cli_inner_pretty.js (called from 393200) | function |
| `g85` | `initializeAgentMcpServers` (loads frontmatter `mcpServers:`; gates on `isSourceAdminTrusted` for `strictPluginOnlyCustomization`) | cli_inner_pretty.js (called from 393232) | function |
| `slH` | `runSubagentLifecycle` (wraps `runAgent` in async-task registration, optional summarization, progress notification) | cli_inner_pretty.js (called from 386737) | function |
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
| `QL$` | `executeSubagentStartHooks` (fires `SubagentStart` for both agent-frontmatter and settings hooks; returns additional_context to inject) | cli_inner_pretty.js:520055 (definition), 520399 (export) | function |
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
