# Symbol Index — Core Execution (v2.1.113 → v2.1.142)

This index catalogs obfuscated → readable mappings for the **core execution** symbols introduced or changed between v2.1.113 and v2.1.142. Scope: Agent Loop, LLM API, System Prompts, Tools, Agents, Subagent, State.

For other categories see:

- [`symbol_index_core_features.md`](symbol_index_core_features.md) — Plan, Background Agents, /goal, Todo, Compact, Hooks, Skills, Thinking, Steering, CLI
- [`symbol_index_infra_platform.md`](symbol_index_infra_platform.md) — MCP, Permissions, Sandbox, Auth, Model, Prompt, Telemetry
- [`symbol_index_infra_integration.md`](symbol_index_infra_integration.md) — LSP, Chrome/Browser, IDE, UI, Plugin, Code Indexing, Shell Parser, Slash Commands

## File:Line Format

For v2.1.142, the canonical source citation is:

```
cli_unpack_pretty/unknown/<obfuscated>.js    (per-decl isolated file — preferred)
cli_inner_pretty.js:<line>                   (the giant pretty-printed bundle — when context matters)
```

The cli_unpack_pretty per-decl files are stable: line counts inside each decl file don't shift as Bun reorganizes the bundle. Use `unknown/<id>.js` for the "what is this function" lookup and `cli_inner_pretty.js:<line>` only when you need surrounding context.

---

## Module: Agent Loop

The main per-turn dispatcher, message-stream consumer, tool-use orchestrator, abort/retry plumbing, and forked side-queries.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `D$` | buildRequestParams (closes over betas array; called inside `uEH`/`Sg`) | cli_inner_pretty.js (referenced) | function |
| `D3_` | forkedAgentTelemetry | cli_inner_pretty.js:242803-242821 | function |
| `JV` | runForkedQuery (used as fork-query inner call for summaries / compact prefix) | cli_inner_pretty.js:242702-242802 | function |
| `NiH` | streamingApiCallGenerator | cli_inner_pretty.js:524917-524921 | function |
| `Sg` | sideQueryRequestBuild | cli_inner_pretty.js:526468-526566 | function |
| `gC` | streamMainQuery (top-level streaming wrapper) | cli_inner_pretty.js (referenced) | function |
| `uEH` | streamingApiCall | cli_inner_pretty.js:524905-524916 | function |

Known new themes for this window:

- 1-hour cache silent-downgrade fix (v2.1.129)
- Stream idle timeout watchdog clear on cancel (v2.1.139)
- Reactive compact attempt loop integration in main loop (v2.1.113/.121)

---

## Module: LLM API

The HTTP/streaming layer: request build, retry, prompt cache, beta header negotiation, provider-specific quirks (Bedrock, Vertex, Foundry, Mantle), OAuth refresh.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Di8` | resolveBetaHeader | cli_inner_pretty.js:96761-96763 | function |
| `EU` | LONG_CONTEXT_BETA (`pJ("long_context", "context-1m-2025-08-07")`) | cli_inner_pretty.js:96801 | constant |
| `MB5` | clampMaxTokens | cli_inner_pretty.js:526376-526382 | function |
| `XP` | mapBetasToHeaderStrings | cli_inner_pretty.js:96764-96766 | function |
| `e7H` | getMaxOutputTokensForModel | cli_inner_pretty.js:526383-526387 | function |
| `pJ` | makeBetaHeaderToken (declares betas at module init) | cli_inner_pretty.js (referenced) | function |
| `x-claude-code-agent-id` | request header (v2.1.139 — subagent identity) | cli_inner_pretty.js:128061-128062 | header |
| `x-claude-code-parent-agent-id` | request header (v2.1.139 — subagent identity) | cli_inner_pretty.js:128061-128062 | header |

Known new themes for this window:

- 1-hour cache silent-downgrade fix (v2.1.129)
- Opus 4.7 `thinking.type.enabled is not supported` 400 on Bedrock IP ARN (v2.1.117)
- Cache control TTL ordering races (v2.1.116)
- Stream idle timeout watchdog clear on cancel (v2.1.139)
- Native binary musl/glibc dual install (v2.1.141)
- Subagent identity headers (v2.1.139)

---

## Module: System Prompts

The composition of system prompts: identity, tools section, environment description, CLAUDE.md injection, output-style overlay, plan-mode preamble. Also: frontmatter parsing (used by agent/skill/command/output-style definitions).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `JAY` | FRONTMATTER_KEY_INDEX (normalized→canonical key map) | cli_inner_pretty.js:141749 | constant |
| `PVK` | coerceToFrontmatterDict | cli_inner_pretty.js:141810-141813 | function |
| `XKH` | FRONTMATTER_RE (regex; tolerates trailing whitespace after opening `---`) | cli_inner_pretty.js:141889 | regex |
| `aI1` | quoteUnquotedFrontmatterValues (post-failure fixup) | cli_inner_pretty.js:141761-141787 | function |
| `as1` | agentFrontmatterSchema (Zod schema for agent `.md` frontmatter) | cli_inner_pretty.js:198717-198747 | function |
| `iI1` | KNOWN_FRONTMATTER_KEYS (canonical key list) | cli_inner_pretty.js:141694-141748 | constant |
| `iYH` | parseYaml (Bun.YAML.parse wrapper) | cli_inner_pretty.js:141751-141753 | function |
| `Fi$` | stringifyYaml (Bun.YAML.stringify wrapper) | cli_inner_pretty.js:141754-141760 | function |
| `os1` | commandFrontmatterSchema (shared base for agent/skill/output-style) | cli_inner_pretty.js:198640-198677 | function |
| `rA6` | skillFrontmatterSchema (Zod schema for skill `.md`) | cli_inner_pretty.js:198678-198716 | function |
| `rI1` | normalizeFrontmatterKey (`replace(/[-_]/g, "").toLowerCase()`) | cli_inner_pretty.js:141688-141690 | function |
| `tO` | parseMarkdownFrontmatter (YAML head extraction + tolerant retry) | cli_inner_pretty.js:141788-141809 | function |

Known new themes for this window:

- Plugin SKILL.md at root surfaces as a skill (v2.1.142)
- Compaction prompt asks model to preserve sensitive user instructions (v2.1.139)
- `/context all` per-skill token estimates account for tokenizer (v2.1.139)

---

## Module: Tools

Built-in tool definitions, parameter schemas, tool-result formatters, the tool factory, the deferred-tools system, MCP wrappers, and tool dispatcher.

### Tools — Core Factory & Defaults

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `G1` | toolMatchesName (name/alias predicate) | cli_inner_pretty.js (referenced from `i4`) | function |
| `GI1` | buildToolNameMap (Tools-array→Map cache builder) | cli_inner_pretty.js (referenced from `i4`) | function |
| `TI1` | TOOL_DEFAULTS (defaults map; rename from `jy_` in v2.1.112) | cli_inner_pretty.js:141082-141092 | object |
| `XK` | createTool (tool factory; rename from `Iq` in v2.1.112) | cli_inner_pretty.js:141068 | function |
| `i4` | findToolByName (cached name→tool resolver) | cli_inner_pretty.js:141057-141066 | function |
| `mTK` | TOOL_ARRAYS_SEEN (WeakSet<Tools>) | cli_inner_pretty.js:141080 | variable |
| `uTK` | TOOL_NAME_CACHE (WeakMap<Tools, Map<name, Tool>>) | cli_inner_pretty.js:141079 | variable |
| `vZ` | getEmptyToolPermissionContext (initial state factory) | cli_inner_pretty.js:141071-141078 | function |

### Tools — Tool Name Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bq` | READ_TOOL_NAME (`"Read"`) | cli_inner_pretty.js:141539 | constant |
| `D7` | AGENT_TOOL_NAME (`"Agent"`) | cli_inner_pretty.js (referenced) | constant |
| `EK` | POWERSHELL_TOOL_NAME (`"PowerShell"`) | cli_inner_pretty.js:141574 | constant |
| `FD` | WEB_FETCH_TOOL_NAME (`"WebFetch"`) | cli_inner_pretty.js:197731 | constant |
| `G7` | EDIT_TOOL_NAME (`"Edit"`) | cli_inner_pretty.js:143068 | constant |
| `Gz` | ASK_USER_QUESTION_TOOL_NAME (`"AskUserQuestion"`) | cli_inner_pretty.js:211430 | constant |
| `HV` | TODO_WRITE_TOOL_NAME (`"TodoWrite"`) | cli_inner_pretty.js:272171 | constant |
| `It` | PUSH_NOTIFICATION_TOOL_NAME (`"PushNotification"`) | cli_inner_pretty.js:211491 | constant |
| `J0` | STRUCTURED_OUTPUT_TOOL_NAME (`"StructuredOutput"`) | cli_inner_pretty.js:207570 | constant |
| `Km` | TASK_STOP_TOOL_NAME (`"TaskStop"`) | cli_inner_pretty.js:211475 | constant |
| `MX` | CRON_CREATE_TOOL_NAME | cli_inner_pretty.js:211654 | constant |
| `NH8` | SEND_USER_FILE_TOOL_NAME (`"SendUserFile"`) | cli_inner_pretty.js:211424 | constant |
| `P7H` | SEND_USER_MESSAGE_TOOL_NAME | cli_inner_pretty.js:211402 | constant |
| `QkH` | REMOTE_TRIGGER_TOOL_NAME | cli_inner_pretty.js:385266 | constant |
| `Q3H` | ENTER_PLAN_MODE_TOOL_NAME (`"EnterPlanMode"`) | cli_inner_pretty.js:211429 | constant |
| `QW` | SHELL_TOOL_NAMES_ARRAY | cli_inner_pretty.js:141680 | constant |
| `Sq` | BASH_TOOL_NAME (`"Bash"`) | cli_inner_pretty.js:141447 | constant |
| `VI` | WEB_SEARCH_TOOL_NAME | cli_inner_pretty.js:211558 | constant |
| `VP` | NOTEBOOK_EDIT_TOOL_NAME (`"NotebookEdit"`) | cli_inner_pretty.js:141573 | constant |
| `cY` | TOOL_SEARCH_TOOL_NAME (`"ToolSearch"`) | cli_inner_pretty.js:211392 | constant |
| `clH` | LSP_TOOL_NAME | cli_inner_pretty.js:382950 | constant |
| `d1` | GLOB_TOOL_NAME (`"Glob"`) | cli_inner_pretty.js:141564 | constant |
| `fX` | SKILL_TOOL_NAME | cli_inner_pretty.js (referenced) | constant |
| `hL` | MONITOR_TOOL_NAME (`"Monitor"`) | cli_inner_pretty.js:211515 | constant |
| `kFH` | ENTER_WORKTREE_TOOL_NAME | cli_inner_pretty.js (referenced) | constant |
| `m3` | REPL_TOOL_NAME (`"REPL"`) | cli_inner_pretty.js:141589 | constant |
| `mZ` | SEND_MESSAGE_TOOL_NAME (`"SendMessage"`) | cli_inner_pretty.js:211565 | constant |
| `nf` | SCHEDULE_WAKEUP_TOOL_NAME | cli_inner_pretty.js:211359 | constant |
| `o4` | WRITE_TOOL_NAME (`"Write"`) | cli_inner_pretty.js:207727 | constant |
| `qV` | CRON_DELETE_TOOL_NAME | cli_inner_pretty.js:211655 | constant |
| `y0H` | CRON_LIST_TOOL_NAME | cli_inner_pretty.js:211656 | constant |
| `yH8` | EXIT_WORKTREE_TOOL_NAME | cli_inner_pretty.js (referenced) | constant |
| `$n` | TASK_OUTPUT_TOOL_NAME (`"TaskOutput"`) | cli_inner_pretty.js:211428 | constant |
| `Am` | TEAM_CREATE_TOOL_NAME | cli_inner_pretty.js:211705 | constant |
| `BZ` | TASK_LIST_TOOL_NAME | cli_inner_pretty.js (referenced) | constant |
| `B3H` | LIST_MCP_RESOURCES_TOOL_NAME | cli_inner_pretty.js:210584 | constant |
| `Kg` | TASK_GET_TOOL_NAME | cli_inner_pretty.js (referenced) | constant |
| `NZ` | EXIT_PLAN_MODE_TOOL_NAME | cli_inner_pretty.js (referenced) | constant |
| `OX` | TASK_CREATE_TOOL_NAME | cli_inner_pretty.js (referenced) | constant |
| `P0` | TASK_UPDATE_TOOL_NAME | cli_inner_pretty.js (referenced) | constant |
| `St` | TEAM_DELETE_TOOL_NAME | cli_inner_pretty.js:211706 | constant |
| `WL$` | SHARE_ONBOARDING_GUIDE_TOOL_NAME | cli_inner_pretty.js (referenced) | constant |
| `dY6` | LEGACY_BRIEF_TOOL_NAME | cli_inner_pretty.js:211403 | constant |
| `hu` | LEGACY_AGENT_TOOL_NAME | cli_inner_pretty.js (referenced) | constant |
| `l3H` | WAIT_FOR_MCP_SERVERS_TOOL_NAME | cli_inner_pretty.js:211681 | constant |
| `u$_` | SEND_USER_FILE_TOOL_NAME (alt re-export for deferred-tools check) | cli_inner_pretty.js (via `s6(EH8).SEND_USER_FILE_TOOL_NAME`) | constant |
| `x$_` | BRIEF_TOOL_NAME | cli_inner_pretty.js (via `s6(W7H).BRIEF_TOOL_NAME`) | constant |

### Tools — Tool Registration Objects

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Y` | readTool / FileReadTool (Read registration) | cli_inner_pretty.js:407219 | object |
| `$Y6` | StructuredOutputTool | cli_inner_pretty.js:207581-207637 | object |
| `C38` | WebSearchTool | cli_inner_pretty.js:381254-381453 | function |
| `DH5` | PushNotificationTool | cli_inner_pretty.js:386004-386094 | function |
| `DMH` | TodoWriteTool | cli_inner_pretty.js:272170-272220 | object |
| `Fe_` | CronCreateTool | cli_inner_pretty.js:385053-385121 | function |
| `Gu7` | agentTool | cli_inner_pretty.js:351269-351600 | object |
| `JH5` | TeamCreateTool | cli_inner_pretty.js:386243-386345 | function |
| `L4` | BashTool | cli_inner_pretty.js:419457-419800 | object |
| `LH5` | TeamDeleteTool | cli_inner_pretty.js:386387-386446 | function |
| `Mn7` | exitWorktreeTool | cli_inner_pretty.js:384192-384307 | object |
| `Q38` | enterPlanModeTool | cli_inner_pretty.js:383798-383866 | object |
| `R38` | taskOutputTool | cli_inner_pretty.js:380973-381113 | object |
| `SH5` | SendMessageTool | cli_inner_pretty.js:387042-387268 | function |
| `SnH` | skillTool | cli_inner_pretty.js:353527-353795 | object |
| `V2` | exitPlanModeTool | cli_inner_pretty.js:381649-381825 | object |
| `Xn7` | taskCreateTool | cli_inner_pretty.js:384379-384439 | object |
| `Yw` | FileWriteTool | cli_inner_pretty.js:359972-360400 | object |
| `Zn7` | taskGetTool | cli_inner_pretty.js:384484-384549 | object |
| `_D` | FileEditTool | cli_inner_pretty.js:415451-415900 | object |
| `ae_` | RemoteTriggerTool | cli_inner_pretty.js:385375-385493 | function |
| `bH5` (`xH5`) | ShareOnboardingGuideTool | cli_inner_pretty.js:387305-387409 | function |
| `dy6` | PowerShellTool | cli_inner_pretty.js:405745-406100 | object |
| `de_` | CronDeleteTool | cli_inner_pretty.js:385135-385177 | function |
| `eI` | WebFetchTool | cli_inner_pretty.js:377334-377475 | function |
| `fB` | NotebookEditTool | cli_inner_pretty.js:361758-362200 | object |
| `fE6` | LSPTool | cli_inner_pretty.js:382949-383200 | object |
| `fH5` | SendUserFileTool (NEW v2.1.142) | cli_inner_pretty.js:385814-385877 | object |
| `hV` | GrepTool | cli_inner_pretty.js:339026-339330 | object |
| `hn7` | taskListTool | cli_inner_pretty.js:384882-384945 | object |
| `j7H` | ListMcpResourcesTool | cli_inner_pretty.js:210767-210815 | function |
| `mI6` | mcpToolBase (catch-all `mcp` tool + spread base for MCP wrappers) | cli_inner_pretty.js:409973-410010 | object |
| `ne_` | CronListTool | cli_inner_pretty.js:385206-385264 | function |
| `oI` | GlobTool | cli_inner_pretty.js:339349-339447 | object |
| `qn7` | enterWorktreeTool | cli_inner_pretty.js:383991-384062 | object |
| `rN6` | REPLTool | cli_inner_pretty.js:380386-380700 | object |
| `rd7` | SendUserMessageTool (with `BriefTool` alias via `LEGACY_BRIEF_TOOL_NAME`) | cli_inner_pretty.js:378456-378510 | function |
| `vn7` | taskUpdateTool | cli_inner_pretty.js:384666-384814 | object |
| `w38` | taskStopTool | cli_inner_pretty.js:378044-378097 | object |
| `wL$` | toolSearchTool | cli_inner_pretty.js:383397-383616 | object |
| `xc7` | ScheduleWakeupTool | cli_inner_pretty.js:380632-380682 | function |
| `yiH` | askUserQuestionTool | cli_inner_pretty.js:382084-382200 | object |
| `BO7` | WaitForMcpServersTool | cli_inner_pretty.js:271567-271678 | function |

### Tools — Deferred Tools System

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bl7` | invalidateToolSearchCacheIfChanged / warmDeferredCache (fingerprint-based) | cli_inner_pretty.js:383245-383248 | function |
| `F38` | toolSearchPromptBuilder / toolSearchScoreCache reference | cli_inner_pretty.js:383378-383396 / 383347 | function/variable |
| `Ge_` | compileWordBoundaryRegexes | cli_inner_pretty.js:383270-383274 | function |
| `IiH` | makeToolSearchResult | cli_inner_pretty.js:383252-383254 | function |
| `Mf6` | deferredToolsModule (re-export bundle) | cli_inner_pretty.js:211823-211829 | object |
| `OE6` | currentDeferredFingerprint | cli_inner_pretty.js:383346 | variable |
| `Of6` | formatDeferredToolLine | cli_inner_pretty.js:211842-211844 | function |
| `Pe_` | TOOL_SEARCH_MCP_WAIT_MS (5000ms) | cli_inner_pretty.js:383345 | constant |
| `SH8` | getToolSearchPromptText / toolSearchDescription | cli_inner_pretty.js:211845-211847 | function |
| `UI` | isToolSearchFeatureEnabled | cli_inner_pretty.js (referenced from `toolSearchTool.isEnabled`) | function |
| `Ul7` | searchDeferredTools / keywordSearch (main scoring algorithm) | cli_inner_pretty.js:383275-383342 | function |
| `We_` | computeDeferredToolFingerprint (sorted comma-joined names) | cli_inner_pretty.js:383240-383244 | function |
| `Ze_` | clearToolSearchCache (unconditional clear) | cli_inner_pretty.js:383249-383251 | function |
| `iM8` | formatToolList (comma-joined or N-cap-with-summary) | cli_inner_pretty.js (referenced from `deferred_tools_delta`) | function |
| `pl7` | extractToolNameParts (camel/snake split for scoring) | cli_inner_pretty.js:383255-383269 | function |
| `xHH` | MAX_INLINE_TOOL_NAMES (threshold for inline-vs-summarised lists) | cli_inner_pretty.js (referenced from `deferred_tools_delta`) | constant |
| `zm` | isDeferredTool (predicate for `defer_loading:true`) | cli_inner_pretty.js:211830-211841 | function |

### Tools — MCP Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AZH` | isComputerUseServer (recogniser) | cli_inner_pretty.js (referenced in MCP wrapper factory) | function |
| `CH4` | renderMcpToolUseProgressMessage | cli_inner_pretty.js (referenced in `mcpToolBase`) | function |
| `FrH` | McpSessionRecoveryError (retriable error class) | cli_inner_pretty.js (caught in MCP call retry block) | class |
| `JS6` | executeMcpToolCall (low-level MCP request dispatcher) | cli_inner_pretty.js (referenced in MCP wrapper call) | function |
| `KU` | formatMcpToolName (build `mcp__<server>__<tool>`) | cli_inner_pretty.js (referenced in MCP wrapper factory) | function |
| `M$4` | getElicitationOverrides (overrides for elicitation tools) | cli_inner_pretty.js (referenced in MCP wrapper factory) | function |
| `O$4` | isElicitationTool (recogniser for OAuth-elicitation tools) | cli_inner_pretty.js (referenced in MCP wrapper factory) | function |
| `QP$` | MAX_MCP_PROMPT_CHARS (truncation point for server descriptions) | cli_inner_pretty.js (referenced in MCP wrapper factory) | constant |
| `RH4` | renderMcpToolUseMessage (per-call UI renderer) | cli_inner_pretty.js (referenced in `mcpToolBase`) | function |
| `SrH` | serialiseMcpToolOutput (content-block→API content) | cli_inner_pretty.js:410008 | function |
| `Th` | resolveMcpInfoFromName (parse `mcp__server__tool`) | cli_inner_pretty.js (referenced in `pl7`) | function |
| `Y_5` | mcpAutoClassifierProjection (input→classifier text) | cli_inner_pretty.js (referenced from per-tool wrapper) | function |
| `a15` | loadComputerUseOverrides | cli_inner_pretty.js (referenced in MCP wrapper factory) | function |
| `cI6` | makeOAuthCompleteAuthenticationTool (synthetic tool for OAuth callback) | cli_inner_pretty.js:411780+ | function |
| `dI6` | makeOAuthAuthenticateTool (synthetic tool for OAuth start) | cli_inner_pretty.js:411664-411778 | function |
| `eH4` | markMcpToolSuccess / mcpPRToolHook (clears failure tracking; PR-counter hook) | cli_inner_pretty.js:411883-411891 | function |
| `eu` | isTruncatedHeuristic | cli_inner_pretty.js (referenced in `mcpToolBase.isResultTruncated`) | function |
| `fh` | McpToolError / TelemetrySafeError (uniform error envelope class) | cli_inner_pretty.js (error wrapping in MCP call) | class |
| `j15` | PR_TOOL_NAME_REGEX | cli_inner_pretty.js:411891 | constant |
| `k0H` | getMcpClient (extract live client from connection) | cli_inner_pretty.js (referenced in MCP wrapper call) | function |
| `o15` | loadChromeMcpOverrides | cli_inner_pretty.js (referenced in MCP wrapper factory) | function |
| `tM8` | renderMcpToolResultMessage (post-run UI renderer) | cli_inner_pretty.js (referenced in `mcpToolBase`) | function |
| `tz6` | MCP_RESULT_SIZE_CEILING (hard cap on user-supplied `maxResultSizeChars`) | cli_inner_pretty.js (referenced in MCP wrapper factory) | constant |
| `uTH` | isClaudeInChromeServer (recogniser) | cli_inner_pretty.js (referenced in MCP wrapper factory) | function |
| `z_5` | isWrappedToolEnabled (filter predicate for wrapper map) | cli_inner_pretty.js (referenced in MCP wrapper factory) | function |

### Tools — Schema Validation & Dispatcher

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `CwH` | checkReadPermissionForTool / evaluatePermissionForFileTool (Read/Edit/Write/NotebookEdit) | cli_inner_pretty.js (referenced) | function |
| `G38` | runPostToolUseHooksStream | cli_inner_pretty.js:379443 | function |
| `Gv$` | recordToolDurationHistogram (telemetry hook) | cli_inner_pretty.js:388291 | function |
| `Nq$` | isBinaryByMagic (detect binary by leading bytes) | cli_inner_pretty.js (referenced by `readTool.validateInput`) | function |
| `S8` | pluralize ("1 file" / "N files") | cli_inner_pretty.js (referenced) | function |
| `T38` | runOnErrorHooksStream (tool-error hooks) | cli_inner_pretty.js:379498 | function |
| `U3H` | isSkillDiscoveryEnabled (gates Skill defer behaviour) | cli_inner_pretty.js (referenced by `isDeferredTool`) | function |
| `V38` | resolvePermission (hook + tool + general policy) | cli_inner_pretty.js:379417 | function |
| `YBH` | isReadableImageExt | cli_inner_pretty.js (referenced by `readTool.validateInput`) | function |
| `Z38` | recordPostHookOutputRewrite (file-state effects from PostToolUse) | cli_inner_pretty.js:379446 | function |
| `ZGH` | MAX_PAGES (PDF max-pages-per-request) | cli_inner_pretty.js (referenced by `readTool.validateInput`) | constant |
| `a8` | sleepWithAbort / sleep (cancellable sleep) | cli_inner_pretty.js (referenced by ToolSearch waits) | function |
| `c_H` | getStallMonitor (Stall-warning observer) | cli_inner_pretty.js:388085 | function |
| `eq` | resolvePath / expandPath (relative→absolute path resolver) | cli_inner_pretty.js:43374 | function |
| `fK6` | parsePagesParam (parse PDF page range like "1-5") | cli_inner_pretty.js (referenced by `readTool.validateInput`) | function |
| `h45` | isDeviceFile (detect /dev/* or named pipes) | cli_inner_pretty.js (referenced by `readTool.validateInput`) | function |
| `j38` | validateSendUserFilePaths / validateAttachmentPaths | cli_inner_pretty.js (referenced) | function |
| `J38` | resolveAttachments | cli_inner_pretty.js (referenced) | function |
| `kq8` | recordToolResultBytes (telemetry hook) | cli_inner_pretty.js:388320 | function |
| `ne7` | READABLE_BINARY_EXTS (Set of readable ext names via Read) | cli_inner_pretty.js (referenced by `readTool.validateInput`) | constant |
| `r7` | anonymiseToolName (strip MCP server prefix for telemetry aggregation) | cli_inner_pretty.js (referenced by telemetry calls) | function |
| `v38` | runPreToolUseHooksStream (async iterator) | cli_inner_pretty.js:388058 | function |
| `yL` | matchesDenyRule / matchingRuleForInput (deny rule lookup) | cli_inner_pretty.js (referenced) | function |

### Tools — Send User File (NEW v2.1.142)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `EH8` | sendUserFileModule (re-export bundle) | cli_inner_pretty.js:211422-211423 | object |
| `YH5` | buildSendUserFileOutputSchema (yH-wrapped output schema factory) | cli_inner_pretty.js:385804-385813 | function |
| `fi7` | renderSendUserFileToolUseMessage (UI renderer for SendUserFile use) | cli_inner_pretty.js:385869 | function |
| `iY6` | SEND_USER_FILE_PROMPT (full usage prompt) | cli_inner_pretty.js:211426 | constant |
| `nY6` | SEND_USER_FILE_DESCRIPTION (`"Send one or more files to the user"`) | cli_inner_pretty.js:211425 | constant |
| `wi7` | sendUserFileToolModule (re-export bundle: SendUserFileTool) | cli_inner_pretty.js:385777 | object |
| `zH5` | buildSendUserFileInputSchema (yH-wrapped input schema factory) | cli_inner_pretty.js:385793-385803 | function |

### Tools — Bash / PowerShell Internals

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `A78` | checkReadOnlyConstraints (read-only validation) | cli_inner_pretty.js | function |
| `D45` | runPowerShellCommand (PS runner) | cli_inner_pretty.js | function |
| `FUH` | parseForSecurity (bash AST parser) | cli_inner_pretty.js | function |
| `FvH` | parseSedInPlace / parseSedEditCommand (`sed -i …` parser; sandbox / userFacingName) | cli_inner_pretty.js:336532 | function |
| `Ge7` | POWERSHELL_PLATFORM_ERROR | cli_inner_pretty.js | constant |
| `Iw8` | editToolUserFacingName / fileEditUserFacingName (returns `"Update"`/`"Updated plan"`/`"Create"`) | cli_inner_pretty.js:415257-415263 | function |
| `O64` | permissionRuleExtractPrefix (rule prefix extractor) | cli_inner_pretty.js | function |
| `Oe7` | getPowerShellPrompt | cli_inner_pretty.js | function |
| `PM8` | isPowerShellReadOnly (PS read-only check) | cli_inner_pretty.js | function |
| `PZH` | getDefaultShellName (returns `"powershell"` when Git Bash absent) | cli_inner_pretty.js:141671-141673 | function |
| `Q55` | detectBlockedSleepPattern (sleep guard) | cli_inner_pretty.js | function |
| `SK5` | powerShellCommandMap (dispatched via `vt7`) | cli_inner_pretty.js | object |
| `Su` | isPowerShellToolEnabled | cli_inner_pretty.js:141659-141666 | function |
| `Te7` | isWindowsRequired (windows gate) | cli_inner_pretty.js | function |
| `Vz` | toPowerShellAlias (alias resolver) | cli_inner_pretty.js | function |
| `XL$` | bashToolHasPermission (permission decision) | cli_inner_pretty.js | function |
| `Y$$` | EndTruncatingAccumulator (output accumulator) | cli_inner_pretty.js | class |
| `Y9` | isBashAvailableOnHost | cli_inner_pretty.js:141667-141670 | function |
| `_45` | isPowerShellSearchOrRead (PS read/search classifier) | cli_inner_pretty.js | function |
| `bDH` | parsePowerShellForSecurity (PS AST parser) | cli_inner_pretty.js | function |
| `bNH` | matchWildcardPattern (glob matcher) | cli_inner_pretty.js | function |
| `bV` | shouldUseSandbox | cli_inner_pretty.js:421425-421432 | function |
| `eP$` | isBackgroundTasksDisabled (env flag) | cli_inner_pretty.js | variable |
| `f64` | isExplicitAutoMode (auto-mode classifier) | cli_inner_pretty.js | function |
| `gt7` | hasDangerousPowerShellCmdlet (destructive check) | cli_inner_pretty.js | function |
| `m55` | isSearchOrReadBashCommand (compound classifier) | cli_inner_pretty.js | function |
| `mf$` | extractPowerShellHints | cli_inner_pretty.js | function |
| `qW` | extractPowerShellSubcommands | cli_inner_pretty.js | function |
| `rM$` | commandHasAnyCd (cd detector) | cli_inner_pretty.js | function |
| `ve7` | detectBlockedPowerShellSleep | cli_inner_pretty.js | function |
| `vt7` | interpretPowerShellResult (dispatches via `SK5`; Bash uses `N84` at line 417282) | cli_inner_pretty.js:402035 | function |
| `xY$` | extractWildcardRulePrefix (shared Bash/PowerShell; aliased as `O64`) | cli_inner_pretty.js:207185 | function |
| `z45` | POWERSHELL_BLOCKING_BUDGET_MS | cli_inner_pretty.js | constant |
| `qg` | isMonitorFeatureEnabled (feature flag) | cli_inner_pretty.js | function |

### Tools — Read / Write / Edit Internals

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$84` | MAX_EDIT_FILE_SIZE (1 GiB) | cli_inner_pretty.js | constant |
| `AVK` | READ_TOOL_DESCRIPTION ("Read a file from the local filesystem.") | cli_inner_pretty.js:141547 | constant |
| `BB7H` (`Bi$`) | READ_FILE_STATE_CURRENT_SUFFIX ("file state is current...") | cli_inner_pretty.js:141543 | constant |
| `Dv6` | fileEditOutputSchema | cli_inner_pretty.js | function |
| `Fe7` | renderReadToolResultMessage | cli_inner_pretty.js | function |
| `H84` | renderEditToolUseErrorMessage | cli_inner_pretty.js | function |
| `KVK` | READ_WASTED_CALL_MESSAGE | cli_inner_pretty.js:141546 | constant |
| `MI6` | getReadActivitySummary / getReadToolUseSummary | cli_inner_pretty.js | function |
| `OBH` | READ_TOOL_FAMILY_NAMES (Set: Read, Glob, Grep, Bash, PowerShell, NotebookEdit) | cli_inner_pretty.js:141598 | constant |
| `OK6` | READ_LINE_NUMBER_HINT_TEXT | cli_inner_pretty.js:141548 | constant |
| `QRH` | isModeRestricted (file mode check) | cli_inner_pretty.js | function |
| `Qe7` | readToolUserFacingName / getReadUserFacingName (UI display name for Read) | cli_inner_pretty.js | function |
| `S45` | findCaseInsensitiveMatch (fallback when ENOENT) | cli_inner_pretty.js:407380 | function |
| `Ue7` | renderReadToolUseTag (line range / page count tag) | cli_inner_pretty.js | function |
| `VkH` | checkWritePermissionForTool | cli_inner_pretty.js | function |
| `YVK` | READ_BROAD_FILE_HINT (suggest offset/limit) | cli_inner_pretty.js:141551 | constant |
| `aN` | READ_FILE_HINT_PREFIX / FILE_NOT_FOUND_CWD_NOTE ("Try checking files in") | cli_inner_pretty.js:407389 | constant |
| `c7H` | getReadConfig / getDefaultFileReadingLimits | cli_inner_pretty.js:407228 | function |
| `dnH` | checkTeamMemSecrets (team-memory guard) | cli_inner_pretty.js | function |
| `e$4` | renderEditToolUseRejectedMessage | cli_inner_pretty.js | function |
| `f8` | isENOENT (errno check) | cli_inner_pretty.js | function |
| `fBH` | DEFAULT_READ_LINE_COUNT (2000) | cli_inner_pretty.js:141546 | constant |
| `fVK` | READ_TARGETED_FILE_HINT / TARGETED_RANGE_NUDGE | cli_inner_pretty.js:141553 | constant |
| `gRH` | FILE_READ_ONLY_ERROR_MESSAGE | cli_inner_pretty.js | constant |
| `ge7` | renderReadToolUseErrorMessage (Read error with did-you-mean) | cli_inner_pretty.js | function |
| `kY8` | checkSensitivePatterns (secret scanner) | cli_inner_pretty.js | function |
| `kv6` | getWriteToolUseSummary | cli_inner_pretty.js | function |
| `l7` | formatFileSize | cli_inner_pretty.js | function |
| `le7` | readFileImpl (actual file-reading worker) | cli_inner_pretty.js:407377 | function |
| `mS$` | suggestSimilarFilename (did-you-mean by edit distance) | cli_inner_pretty.js:407387 | function |
| `mp7` | writeToolUserFacingName / getWriteUserFacingName (returns `"Updated plan"` for plan-dir files) | cli_inner_pretty.js:359731-359734 | function |
| `nI1` | READ_FILE_UNCHANGED_MESSAGE | cli_inner_pretty.js:141544 | constant |
| `o$4` | getEditToolDescription | cli_inner_pretty.js | function |
| `pe7` | renderReadToolUseMessage | cli_inner_pretty.js | function |
| `qVK` | READ_REREAD_REMINDER ("don't re-read after Edit") | cli_inner_pretty.js:141541 | constant |
| `s$4` | renderEditToolUseMessage | cli_inner_pretty.js | function |
| `s5H` | suggestSimilarFileInDir / suggestPathUnderCwd (directory-scoped fuzzy match) | cli_inner_pretty.js:407388 | function |
| `t$4` | renderEditToolResultMessage | cli_inner_pretty.js | function |
| `x45` | LINES_LIMIT_DEFAULT | cli_inner_pretty.js | constant |
| `zVK` | READ_LINE_NUMBER_HINT_LONG (full hint text) | cli_inner_pretty.js:141557 | variable |
| `ZS6` | getEditToolUseSummary | cli_inner_pretty.js | function |

### Tools — Glob / Grep / NotebookEdit / Todo / REPL / LSP

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$dH` | TodoListSchema (lazy) | cli_inner_pretty.js | function |
| `Ae_` | MAX_LSP_FILE_SIZE_BYTES (10 MB) | cli_inner_pretty.js | constant |
| `BS7` | renderGrepToolUseMessage | cli_inner_pretty.js | function |
| `DT6` | formatLimitInfo (Grep UI) | cli_inner_pretty.js | function |
| `EU7` | renderNotebookEditToolResultMessage | cli_inner_pretty.js | function |
| `El7` | renderLspToolResultMessage | cli_inner_pretty.js | function |
| `FB7` | isLspConnected (gate) | cli_inner_pretty.js | function |
| `FRH` | toRelativePath (path relativizer) | cli_inner_pretty.js | function |
| `Fv6` | getNotebookEditToolUseSummary | cli_inner_pretty.js | function |
| `Gc7` | replayReplCalls | cli_inner_pretty.js | function |
| `IU7` | notebookEditPathModule | cli_inner_pretty.js | variable |
| `I38` | extractReplHistoryFromMessages | cli_inner_pretty.js | function |
| `Ic7` | collectReplNewMessages | cli_inner_pretty.js | function |
| `Il7` | lspFsModule (fs.promises) | cli_inner_pretty.js | variable |
| `LZH` | DEFAULT_REPL_AGENT_ID | cli_inner_pretty.js | constant |
| `Lc7` | refreshReplContext | cli_inner_pretty.js | function |
| `Lt_` | REPL_RESERVED_KEYS | cli_inner_pretty.js:380385 | constant |
| `MK6` | GLOB_DESCRIPTION | cli_inner_pretty.js | constant |
| `MT6` | getGrepToolUseSummary | cli_inner_pretty.js | function |
| `MVK` | getGlobPrompt | cli_inner_pretty.js | function |
| `Mc` | readFileSyncWithMetadata | cli_inner_pretty.js | function |
| `Nl7` | renderLspToolUseErrorMessage | cli_inner_pretty.js | function |
| `NU7` | renderNotebookEditToolUseErrorMessage | cli_inner_pretty.js | function |
| `P38` | wrapReplCode (code wrapper) | cli_inner_pretty.js | function |
| `PU7` | NOTEBOOK_EDIT_DESCRIPTION | cli_inner_pretty.js | constant |
| `P2` | semanticBoolean / preprocessBoolean | cli_inner_pretty.js | function |
| `Pb` | semanticNumber | cli_inner_pretty.js | function |
| `Pl7` | lspDiscriminatedSchema | cli_inner_pretty.js | function |
| `QnH` | getInitializationStatus (LSP) | cli_inner_pretty.js | function |
| `QS7` | renderGlobToolUseMessage | cli_inner_pretty.js | function |
| `Sc7` | getReplMaxResultSize | cli_inner_pretty.js | function |
| `Sl7` | lspUrlModule | cli_inner_pretty.js | variable |
| `Tc7` | summarizeReplCalls | cli_inner_pretty.js | function |
| `Tt_` | extractReplDocuments (PDF collector) | cli_inner_pretty.js | function |
| `US7` | renderGrepToolResultMessage | cli_inner_pretty.js | function |
| `W38` | postProcessReplResult (result coercer) | cli_inner_pretty.js | function |
| `WU7` | NOTEBOOK_EDIT_PROMPT | cli_inner_pretty.js | constant |
| `Wt_` | recordReplToolCall (call recorder) | cli_inner_pretty.js | function |
| `WL` | isReplEnabled (feature flag) / isReplActive | cli_inner_pretty.js | function |
| `Xt_` | REPL_DEFAULT_TIMEOUT_MS | cli_inner_pretty.js | constant |
| `Xc7` | createReplContext (VM context factory) | cli_inner_pretty.js | function |
| `Ye_` | lspOutputSchema | cli_inner_pretty.js | function |
| `YE6` | lspPathModule | cli_inner_pretty.js | variable |
| `YK6` | getGrepDescription | cli_inner_pretty.js | function |
| `Yx8` | fileHistoryEnabled (history flag) | cli_inner_pretty.js | function |
| `Ze_` | (see Deferred section — clearToolSearchCache) | — | — |
| `Zt_` | extractReplImages (image collector) | cli_inner_pretty.js | function |
| `cS7` | renderGlobToolResultMessage | cli_inner_pretty.js | function |
| `dS7` | renderGlobToolUseErrorMessage | cli_inner_pretty.js | function |
| `ed7` | exportReplNewTools (`registerTool` surface, v2.1.139) | cli_inner_pretty.js | function |
| `fe_` | getMethodAndParams (LSP operation mapper) | cli_inner_pretty.js | function |
| `gB7` | waitForInitialization (LSP await init) | cli_inner_pretty.js | function |
| `gS7` | getGlobUserFacingName | cli_inner_pretty.js | function |
| `h38` | resolveReplObject (final `o` resolver) | cli_inner_pretty.js | function |
| `hX$` | parseCellId (cell-N parser) | cli_inner_pretty.js | function |
| `hl7` | filterLocationsToCwd (cwd filter) | cli_inner_pretty.js | function |
| `iN6` | REPL_HARD_TIMEOUT_MS | cli_inner_pretty.js | constant |
| `ilH` | normalizePatternsToPath | cli_inner_pretty.js | function |
| `iO7` | TODO_WRITE_DESCRIPTION | cli_inner_pretty.js | constant |
| `jT6` | getGlobToolUseSummary | cli_inner_pretty.js | function |
| `kU7` | renderNotebookEditToolUseRejectedMessage | cli_inner_pretty.js | function |
| `kl7` | renderLspToolUseMessage | cli_inner_pretty.js | function |
| `kt_` | newReplWatchdog (timeout watcher) | cli_inner_pretty.js | function |
| `lN6` | exportReplCallLog | cli_inner_pretty.js | function |
| `nE` | makeChildAbortController / createAbortLink | cli_inner_pretty.js | function |
| `nO7` | getTodoWritePrompt | cli_inner_pretty.js | function |
| `nlH` | getGlobExclusionsForPluginCache | cli_inner_pretty.js | function |
| `nw` | isTodoV2Enabled / isTaskListEnabled (feature flag) | cli_inner_pretty.js | function |
| `oN` | getFileModificationTime | cli_inner_pretty.js | function |
| `p38` | lspLocationLinkToLocation | cli_inner_pretty.js | function |
| `pS7` | renderGrepToolUseErrorMessage | cli_inner_pretty.js | function |
| `qDH` | getLspServerManager | cli_inner_pretty.js | function |
| `rF_` | VCS_DIRECTORIES_TO_EXCLUDE | cli_inner_pretty.js:339013 | constant |
| `rN6` | (see Registration — REPLTool) | — | — |
| `rlH` | getFileReadIgnorePatterns | cli_inner_pretty.js | function |
| `t06` | LSP_DESCRIPTION | cli_inner_pretty.js:337457 | constant |
| `vl7` | getLspUserFacingName | cli_inner_pretty.js | function |
| `vt_` | newReplPromise (deferred promise factory) | cli_inner_pretty.js | function |
| `vU7` | renderNotebookEditToolUseMessage | cli_inner_pretty.js | function |
| `wT6` | applyHeadLimit (Grep limit applicator) | cli_inner_pretty.js | function |
| `we_` | formatLspResult (LSP UI formatter) | cli_inner_pretty.js | function |
| `wt` | ripGrep (native rg invoker) | cli_inner_pretty.js | function |
| `xL` | isUserMessage / isCompactBoundaryMessage | cli_inner_pretty.js | function |
| `xS7` | glob (native bfs wrapper) | cli_inner_pretty.js | function |
| `y38` | preloadReplPrimitives (primitive preload) | cli_inner_pretty.js | function |
| `yc7` | filterToolsForRepl (tool filter) | cli_inner_pretty.js | function |
| `ze_` | lspInputSchema | cli_inner_pretty.js | function |

### Tools — Specialty (Task, Plan, Worktree, AskUserQuestion, Onboarding, Web, Cron, Scheduling, Team)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$V` | isKairosCronEnabled | cli_inner_pretty.js:211587-211589 | function |
| `Bn7` | CRON_MAX_JOBS | cli_inner_pretty.js:385020 | constant |
| `Bt_` | extractWebSearchResults (counts `server_tool_use`/`web_search_tool_result`) | cli_inner_pretty.js:381186-381215 | function |
| `Ci` | teamFileLocation (team file resolver) | cli_inner_pretty.js | function |
| `Ct_` | countWebSearchResults | cli_inner_pretty.js | function |
| `Cv$` | getClientUiMode (html/tui mode detector) | cli_inner_pretty.js | function |
| `ClK` | MAX_HEADER_LENGTH (question header cap) | cli_inner_pretty.js | constant |
| `DL$` | createNewWorktree | cli_inner_pretty.js | function |
| `Dn7` | TASK_CREATE_DESCRIPTION | cli_inner_pretty.js:384355 | constant |
| `FlK` | buildWebSearchPrompt | cli_inner_pretty.js:211522-211557 | function |
| `Fc7` | renderWebSearchResultMessage | cli_inner_pretty.js:381153-381165 | function |
| `Fy` | (see Module: Background — daemon flag plumbing) | — | — |
| `G7H` | isDurableCronEnabled | cli_inner_pretty.js:211590-211592 | function |
| `GgK` | buildWebFetchSystemPrompt | cli_inner_pretty.js | function |
| `Gi7` | buildTeamCreatePrompt | cli_inner_pretty.js | function |
| `GN6` | getURLMarkdownContent | cli_inner_pretty.js:377123-377187 | function |
| `HE6` | getWebSearchToolUseSummary | cli_inner_pretty.js:381166-381169 | function |
| `HO8` | isShareOnboardingEnabled (feature gate) | cli_inner_pretty.js | function |
| `Hf6` | buildCronDeletePrompt | cli_inner_pretty.js:211642-211646 | function |
| `Hn7` | renderEnterWorktreeResult | cli_inner_pretty.js:383921-383938 | function |
| `Hs_` | WEB_FETCH_MAX_CONTENT_LENGTH | cli_inner_pretty.js:377226 | constant |
| `Hw6` | addDependencyEdge (blocks/blockedBy edge) | cli_inner_pretty.js | function |
| `Hl7` | uniquenessCheck (AskUserQuestion) | cli_inner_pretty.js:382035-382046 | object |
| `IE6` | findMostRecentOrgGuide | cli_inner_pretty.js | function |
| `Ik` | listAllTasks (sorted by ID since v2.1.119) | cli_inner_pretty.js | function |
| `In` | teamFilePath / buildIdNamespace | cli_inner_pretty.js | function |
| `JL` | getMyColor (agent color accessor) | cli_inner_pretty.js | function |
| `JL$` | formatCompletionBlockingError | cli_inner_pretty.js | function |
| `JN6` | DomainBlockedError | cli_inner_pretty.js:377247-377252 | class |
| `KL$` | isSendUserMessageEnabled (kairos brief gate) | cli_inner_pretty.js | function |
| `Kf6` | buildWaitForMcpServersPrompt | cli_inner_pretty.js:271665-271679 | function |
| `Kd7` | EgressBlockedError | cli_inner_pretty.js:377261-377274 | class |
| `Kl7` | annotationsSchema | cli_inner_pretty.js:382020-382034 | function |
| `LN6` | webFetchCache | cli_inner_pretty.js:377222 | variable |
| `LY` | shouldShowModelExtra (model-gate predicate) / isSimpleSystemPromptEnabled | cli_inner_pretty.js | function |
| `MT` | flushAutoModeBuffer (auto-mode cleanup) | cli_inner_pretty.js | function |
| `M38` | stopTask (type-dispatched stop handler) | cli_inner_pretty.js | function |
| `Mv6` | hunkSchema (lazy) | cli_inner_pretty.js | function |
| `Nv$` | PUSH_USER_PRESENT_THRESHOLD_MS (idle threshold) | cli_inner_pretty.js | constant |
| `NE6` | updateOrgGuide | cli_inner_pretty.js | function |
| `On7` | restoreCwdAndCaches | cli_inner_pretty.js:384146-384149 | function |
| `OT` | markPlanModeExited (session-state mutator) | cli_inner_pretty.js | function |
| `Os_` | webFetchPermissionKey | cli_inner_pretty.js:377291-377300 | function |
| `Pn7` | TASK_GET_DESCRIPTION | cli_inner_pretty.js:384441 | constant |
| `Py5` | (none — see Module: Compact in core_features) | — | — |
| `RN` | registerWorktreeOldCwd (pre-chdir cwd capture) | cli_inner_pretty.js | function |
| `Rt_` | TaskOutputResultComponent (Ink) | cli_inner_pretty.js | function |
| `SE6` | formatOnboardingResult | cli_inner_pretty.js | function |
| `SiH` | validateWorktreeSlug | cli_inner_pretty.js:522700 | function |
| `St_` | waitForTaskCompletion (polling wait) | cli_inner_pretty.js | function |
| `S38` | formatTaskForOutput | cli_inner_pretty.js | function |
| `TFH` | scheduleCronJob | cli_inner_pretty.js | function |
| `TTH` | taskStatusEnum (pending/in_progress/completed) | cli_inner_pretty.js | function |
| `T67` | persistNewTask (task store inserter) | cli_inner_pretty.js | function |
| `Tb5` | forkSlashCommand | cli_inner_pretty.js:511636-511642 | function |
| `Tn` | getTask (single-task fetch) | cli_inner_pretty.js | function |
| `TN6` | applyPromptToMarkdown | cli_inner_pretty.js:377188-377216 | function |
| `Te_` | planModeWorkflowText | cli_inner_pretty.js:383647-383658 | function |
| `Tn7` | TASK_UPDATE_DESCRIPTION | cli_inner_pretty.js:384551 | constant |
| `UJ6` | isWaitForMcpServersEnabled (model gate) | cli_inner_pretty.js | function |
| `UkH` | captureRevertState (prePlanMode capture) | cli_inner_pretty.js | function |
| `UlK` | PUSH_NOTIFICATION_PROMPT | cli_inner_pretty.js:211460-211500 | variable |
| `VnH` | suggestNearestCommand (Levenshtein typo suggester) | cli_inner_pretty.js | function |
| `Vn7` | TASK_UPDATE_PROMPT | cli_inner_pretty.js:384552-384625 | constant |
| `WI6` | isColdCompactEnabled | cli_inner_pretty.js:408352-408354 | function |
| `Wn7` | TASK_GET_PROMPT | cli_inner_pretty.js:384442-384463 | constant |
| `Xn6` | CONTROL_CHAR_STRIP_REGEX | cli_inner_pretty.js:569353 | constant |
| `Y$$` | (see Tools — Bash/PowerShell) | — | — |
| `Y_5` | (see Tools — MCP) | — | — |
| `ZN6` | fetchURL | cli_inner_pretty.js:377090-377116 | function |
| `Ad7` | checkDomainAllowed | cli_inner_pretty.js:377057-377074 | function |
| `Bt_` (see web) | — | — | — |
| `_d7` | isValidURL | cli_inner_pretty.js:377045-377056 | function |
| `_E6` | NOTES_ONLY_SENTINEL | cli_inner_pretty.js:381959 | constant |
| `aB` | BgWorkerHandle (worker-process wrapper; see Module: Agents) | — | — |
| `aP_`/`AP_` | AGENT_SUMMARY_INTERVAL_MS / SUMMARY_INTERVAL_MS (30000) | cli_inner_pretty.js:271942 | constant |
| `ad7` | getReplPrompt | cli_inner_pretty.js | function |
| `an7` | buildRemoteTriggerScheduleSummary | cli_inner_pretty.js:385311-385329 | function |
| `at_` | answerCoercionPartial | cli_inner_pretty.js:382050-382064 | function |
| `az` | LEAD_TEAMMATE_NAME (swarm constant) | cli_inner_pretty.js | constant |
| `bf` | isInterviewPhase | cli_inner_pretty.js:383636-383641 | function |
| `bj` | bgSupervisorNoun (`"daemon"` / `"background service"`) | cli_inner_pretty.js:139907-139909 | function |
| `blK` | ASK_USER_QUESTION_DESCRIPTION | cli_inner_pretty.js | constant |
| `bt_` | webSearchInputSchema | cli_inner_pretty.js:381229-381235 | function |
| `cn7` | REMOTE_TRIGGER_DESCRIPTION | cli_inner_pretty.js:385267-385268 | variable |
| `c88` | hasRequiredMcpServers (MCP requirement check) | cli_inner_pretty.js | function |
| `cA` | sendMessage (team SendMessage) | cli_inner_pretty.js | function |
| `ci7` | createOrgGuide | cli_inner_pretty.js | function |
| `cn7` | REMOTE_TRIGGER_DESCRIPTION (see Module: Web) | — | — |
| `dc7` | EXIT_PLAN_MODE_PROMPT | cli_inner_pretty.js | constant |
| `eI` | (see Registration — WebFetchTool) | — | — |
| `eK` | isAgentSwarmsEnabled / isSwarmEnabled (team gate) | cli_inner_pretty.js | function |
| `ee_` (`ce_`) | cronListInputSchema | cli_inner_pretty.js:385191 | function |
| `e$4` | (see Read/Write/Edit) | — | — |
| `el7` | renderEnterWorktreeUseMessage | cli_inner_pretty.js:383918-383920 | function |
| `eT` | humanizeCronExpression | cli_inner_pretty.js | function |
| `ea_` | WEB_FETCH_MAX_URL_LENGTH | cli_inner_pretty.js:377225 | constant |
| `et_` | AskUserQuestionResultComponent | cli_inner_pretty.js | function |
| `fT` | getLastUserKeystroke | cli_inner_pretty.js | function |
| `fd7` | webFetchAllowSuggestions | cli_inner_pretty.js:377301-377305 | function |
| `ff8` | isMarkdownPreserveHost (preapproved host check) | cli_inner_pretty.js | function |
| `g7H` | isPluginAgent (plugin agent detector) | cli_inner_pretty.js | function |
| `gK4` | deriveForkName | cli_inner_pretty.js:428036-428048 | function |
| `gj5` | EDITORS_NEEDING_G_FLAG (vscode-likes that need `-g file:line`) | cli_inner_pretty.js:445828 | constant |
| `gp7` | renderWriteToolResultMessage | cli_inner_pretty.js | function |
| `hE6` | SHARE_ONBOARDING_PROMPT | cli_inner_pretty.js | variable |
| `hu` | (see Tool Names — LEGACY_AGENT_TOOL_NAME) | — | — |
| `h4$` | isPlanApprovalRequired (team-mode gate) | cli_inner_pretty.js | function |
| `ht` | listCronJobs (scheduler list) | cli_inner_pretty.js | function |
| `iL_` | WAIT_FOR_MCP_TIMEOUT_MS | cli_inner_pretty.js:271541 | constant |
| `ikH` | onboardingErrorResult | cli_inner_pretty.js | function |
| `il7` | renderEnterPlanModeUseMessage | cli_inner_pretty.js | function |
| `iY8` | resolveExistingExecutable (executable resolver) | cli_inner_pretty.js | function |
| `it_` | testingPermissionInputSchema | cli_inner_pretty.js | function |
| `j15` | (see MCP — PR_TOOL_NAME_REGEX) | — | — |
| `jL$` | runTaskCreateHooks (hook validator iterator) | cli_inner_pretty.js | function |
| `jE6` | formatBlockingError | cli_inner_pretty.js | function |
| `jn7` | taskCreatePrompt | cli_inner_pretty.js:384309-384353 | function |
| `J68` | logSkillInvoked (analytics helper) | cli_inner_pretty.js | function |
| `kFH` | (see Tool Names — ENTER_WORKTREE_TOOL_NAME) | — | — |
| `ki7` | buildTeamDeletePrompt | cli_inner_pretty.js:386347-386362 | function |
| `kwH` | resolveAgentModel | cli_inner_pretty.js | function |
| `lF5` | summarizeOptionDescription (MessageSelector — see infra_integration UI) | cli_inner_pretty.js:540199-540212 | function |
| `lO7` | recordAgentSummary / publishSubagentSummary (writes summary back to parent's summary store) | cli_inner_pretty.js (called from 271922) | function |
| `lc7` | renderExitPlanModeResultMessage (approved renderer) | cli_inner_pretty.js | function |
| `li7` | deleteOrgGuide | cli_inner_pretty.js | function |
| `ll7` | enterPlanModePrompt | cli_inner_pretty.js:383739-383741 | function |
| `ln7` | REMOTE_TRIGGER_PROMPT | cli_inner_pretty.js:385269-385278 | variable |
| `lY6` | SEND_USER_MESSAGE_PROMPT | cli_inner_pretty.js:211406-211407 | variable |
| `mZ` | (see Tool Names — SEND_MESSAGE_TOOL_NAME) | — | — |
| `mlK` | TASK_STOP_PROMPT | cli_inner_pretty.js | constant |
| `mc7` | truncateOutput (TaskOutput) | cli_inner_pretty.js | function |
| `mO7` | pendingMcpServerNames | cli_inner_pretty.js | function |
| `nc7` | renderExitPlanModeRejectedMessage (declined renderer) | cli_inner_pretty.js | function |
| `nt_` | exitPlanModeOutputSchema | cli_inner_pretty.js:381630-381648 | function |
| `nY6` | (see Send User File) | — | — |
| `oR6` | branchCommandModuleInit | cli_inner_pretty.js:428249-428264 | function |
| `o$4` | (see Read/Write/Edit — getEditToolDescription) | — | — |
| `oa_` | WEB_FETCH_CACHE_MAX_SIZE | cli_inner_pretty.js:377221 | constant |
| `ol7` | renderEnterPlanModeRejectedMessage | cli_inner_pretty.js | function |
| `on7` | remoteTriggerResponseSchema | cli_inner_pretty.js:385363-385374 | function |
| `oV8` | setIsInteractive | cli_inner_pretty.js:2683-2685 | function |
| `oX$` | WEB_FETCH_MARKDOWN_TRUNCATE_LIMIT | cli_inner_pretty.js:377230 | constant |
| `pe_` | cronCreateInputSchema | cli_inner_pretty.js:385034-385049 | function |
| `pe7` | (see Read/Write/Edit — renderReadToolUseMessage) | — | — |
| `pp7` | renderWriteToolUseMessage | cli_inner_pretty.js | function |
| `plK` | PUSH_NOTIFICATION_DESCRIPTION | cli_inner_pretty.js | variable |
| `qE6` | markAgentAwaitingApproval (agent state mutator) | cli_inner_pretty.js | function |
| `qcK` | getWriteToolDescription | cli_inner_pretty.js | function |
| `qd7` | WEB_FETCH_HTML_TRUNCATE_LIMIT | cli_inner_pretty.js:377231 | constant |
| `qf6` | buildCronListPrompt | cli_inner_pretty.js:211647-211651 | function |
| `qh` | markPlanWasApproved (session-state mutator) | cli_inner_pretty.js | function |
| `ql7` | questionSchema (AskUserQuestion) | cli_inner_pretty.js:381993-382019 | function |
| `qm8` | (Agents — dashboard sibling; see Module: Agents below) | — | — |
| `qO8` | ONBOARDING_MAX_BYTES | cli_inner_pretty.js:387270 | constant |
| `rd7` | (see Registration — SendUserMessageTool) | — | — |
| `re_` | remoteTriggerOutputSchema | cli_inner_pretty.js:385362 | function |
| `rj` | isBuiltInAgent (built-in agent detector) | cli_inner_pretty.js | function |
| `rl7` | renderEnterPlanModeResultMessage | cli_inner_pretty.js | function |
| `ra_` | WEB_FETCH_CACHE_TTL_MS | cli_inner_pretty.js:377220 | constant |
| `rN6` | (see Registration — REPLTool) | — | — |
| `rY6` | askUserQuestionPromptBase | cli_inner_pretty.js | constant |
| `sY6` | buildCronCreateDescription | cli_inner_pretty.js:211593-211597 | function |
| `sc7` | exitPlanModeInputSchema | cli_inner_pretty.js:381612-381623 | function |
| `sd7` | getReplDescription | cli_inner_pretty.js | function |
| `sn_` | fileWriteInputSchema | cli_inner_pretty.js | function |
| `tG` | getAgentId (returns BW()?.agentId ?? Ou?.agentId) | cli_inner_pretty.js:97810-97814 | function |
| `tl7` | enterWorktreePromptBody | cli_inner_pretty.js:383882-383917 | function |
| `tn_` | fileWriteOutputSchema | cli_inner_pretty.js | function |
| `tY6` | buildCronCreatePrompt | cli_inner_pretty.js:211598-211641 | function |
| `tu` | startsWithApiErrorPrefix | cli_inner_pretty.js | function |
| `u38` | invalidatePlanCache (plan cache invalidator) | cli_inner_pretty.js | function |
| `ulK` | askUserQuestionPromptExtra | cli_inner_pretty.js | constant |
| `uiH` | runResumedSubagent / resumeSubagent (cwd-restore fix v2.1.118) | cli_inner_pretty.js:386626-386740 | function |
| `us_` | sendUserMessageInputSchema | cli_inner_pretty.js:378423-378438 | function |
| `ut_` | webSearchOutputSchema | cli_inner_pretty.js:381246-381253 | function |
| `vC` | logPlanModeTransition | cli_inner_pretty.js | function |
| `v2` | getPlanFilePath (plan-file path accessor) | cli_inner_pretty.js | function |
| `vN6` | httpStatusText | cli_inner_pretty.js:377278-377280 | function |
| `vk` | isValidCronExpression | cli_inner_pretty.js | function |
| `wv6` | gitDiffSchema (lazy) | cli_inner_pretty.js | function |
| `xH5` | (see Registration — ShareOnboardingGuideTool) | — | — |
| `xV8` | isUserPresent (idle detector) | cli_inner_pretty.js | function |
| `xc_` | agentOutputSchema | cli_inner_pretty.js:351254-351268 | function |
| `xs_` | preuploadedFileSchema (SendUserMessage) | cli_inner_pretty.js:378416-378422 | function |
| `xt_` | webSearchResultItemSchema | cli_inner_pretty.js:381236-381245 | function |
| `xRH` | hasCwdOverrideInSubagent (subagent context check) | cli_inner_pretty.js | function |
| `yH8` | (see Tool Names — EXIT_WORKTREE_TOOL_NAME) | — | — |
| `ye_` | enterWorktreeOutputSchema | cli_inner_pretty.js:383988-383990 | function |
| `yQ4` | mountFleetViewFromLeftArrow (see Module: Agents) | — | — |
| `yV6` | getCommandsIncludingMcpPrompts | cli_inner_pretty.js:353356-353361 | function |
| `yXH` | getTerminalFocus (focus state) | cli_inner_pretty.js | function |
| `ze_` | (see Glob/Grep/etc — lspInputSchema) | — | — |
| `zP_` | summaryPromptTemplate / buildSubagentSummaryPrompt | cli_inner_pretty.js:271850-271867 | function |
| `zd7` | isSameOriginRedirect | cli_inner_pretty.js:377075-377089 | function |
| `zf$` | buildChildMessage (per-fork directive prompt) | cli_inner_pretty.js:211773-211789 | function |
| `zn7` | renderExitWorktreeResult | cli_inner_pretty.js:384099-384125 | function |
| `zs_` | httpErrorMessage | cli_inner_pretty.js:377281-377290 | function |
| `xlK` | askUserQuestionPromptByMode | cli_inner_pretty.js | object |

### Tools — Cross-Cutting (Multiple Tools)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AA` | isTeammate (teammate context check) | cli_inner_pretty.js | function |
| `D7` (see Tool Names) | — | — | — |
| `DZ` | isInProcessTeammate (in-process teammate check) | cli_inner_pretty.js | function |
| `EH` | reportError / logError | cli_inner_pretty.js | function |
| `GQ` | getRulesForTool (permission rule getter) | cli_inner_pretty.js | function |
| `HG` | getCommandsForDir (directory commands loader) | cli_inner_pretty.js | function |
| `I$` | getCwd (cwd accessor) | cli_inner_pretty.js | function |
| `L8` | memoizeWithKey | cli_inner_pretty.js | function |
| `N` | log / logForDebugging | cli_inner_pretty.js | function |
| `R9` | getProjectDir / getProjectRoot | cli_inner_pretty.js:2342 | function |
| `RH` | finishTelemetrySpan / clearCompactFailureCounter / markPerfBoundary | cli_inner_pretty.js | function |
| `SH` | serialize (message serializer) | cli_inner_pretty.js | function |
| `T6` | isNonInteractive / isInteractiveTtyEnvironment | cli_inner_pretty.js:2677-2679 | function |
| `T8` | UIWrapper (UI wrapper component) | cli_inner_pretty.js | function |
| `Tk` | matchWildcardPattern (permission matcher) | cli_inner_pretty.js | function |
| `Wb` | extractText (text extractor; last-user-message text) | cli_inner_pretty.js | function |
| `Xv` | isInteractive | cli_inner_pretty.js:2680-2682 | function |
| `Xy` | findCommandByName (command lookup) | cli_inner_pretty.js | function |
| `ZH` | extractErrorMessage / errorMessage | cli_inner_pretty.js | function |
| `c7` | truncate (string truncator) | cli_inner_pretty.js | function |
| `cE` | TOOL_SUMMARY_MAX_LENGTH | cli_inner_pretty.js (constants) | constant |
| `d` | logEvent (analytics event logger) | cli_inner_pretty.js | function |
| `g9` | declineGlyph (Ink decline glyph) | cli_inner_pretty.js | constant |
| `jH` | inkBaseModule (Ink renderer module) | cli_inner_pretty.js | namespace |
| `jj` | getOpenInteractivePrompts (active prompts accessor) | cli_inner_pretty.js | function |
| `k` | Text (Ink Text component) | cli_inner_pretty.js | function |
| `m_` | getCommandName (name accessor) | cli_inner_pretty.js | function |
| `nE` | (see REPL — makeChildAbortController) | — | — |
| `p` | Box (Ink Box component) | cli_inner_pretty.js | function |
| `pG` | SYSTEM_REMINDER_TAG | cli_inner_pretty.js | constant |
| `q5` | getSessionId | cli_inner_pretty.js | function |
| `rH` | reactModule (React module) | cli_inner_pretty.js | namespace |
| `uH` | finishErrorTelemetry / recordCompactFailure | cli_inner_pretty.js | function |
| `v$` | getSessionId (alt) | cli_inner_pretty.js | function |
| `vA` | getMyAgentName | cli_inner_pretty.js | function |
| `y` | zod (zod imported as `y`) | cli_inner_pretty.js | namespace |
| `y6` | toError (error coercer) | cli_inner_pretty.js | function |
| `y7` | safeParseJSON | cli_inner_pretty.js | function |
| `yH` | lazySchema (lazy schema initializer) | cli_inner_pretty.js | function |

### Tools — System-Reminder Delta Protocol

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aY` | pushAttachment (queue an attachment for next system-reminder) | cli_inner_pretty.js:397569 | function |

Known new themes for this window:

- **Tool factory renamed**: `Y9({...})` / `Iq({...})` → `XK({...})` (`createTool`)
- **Tool definitions reference identifiers for `name`**: e.g. `name: Bq` where `Bq = "Read"`
- New tool: **SendUserFile** (decl: `NH8 = "SendUserFile"`, registered via `wi7` namespace)
- Embedded `bfs`/`ugrep` for Glob/Grep on native macOS/Linux builds (v2.1.117)
- Bash `dangerouslyDisableSandbox` permission-prompt fix (v2.1.113)
- WebFetch HTML truncation before markdown conversion (v2.1.117)
- Read tool offset validation: accept whitespace/`+`-prefix strings (v2.1.140)
- Bash tool surfaces `gh` API rate-limit hint (v2.1.116)
- PowerShell tool auto-approve parity with Bash (v2.1.119)
- Lazy Zod schemas (`yH(() => ...)`) defer cold-start ~80 ms
- v2.1.142 SendUserFile addition; v2.1.139 `ed7` `registerTool` surface from REPL

---

## Module: Agents (CLI subcommand surface)

The `claude agents` background-sessions subcommand: dashboard, dispatcher, daemon lifecycle, attach/detach, completion-state. (Daemon protocol primitives sit in `symbol_index_infra_platform.md`.)

### Agents — `claude agents` Dispatch & Flag Plumbing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `EQ4` | FleetViewDashboard (React component for the agent-view list) | cli_inner_pretty.js:567084-… | function |
| `Go6` | parseAgentsDispatchFlags (pre-Commander positional scan) | cli_inner_pretty.js:65-103 | function |
| `JN4` | STORE_OPEN_AGENT_VIEW_FLAG | cli_inner_pretty.js (called from `mountFleetView`, line 569095) | function |
| `MN4` | setDispatchExtraArgsForSession (module-level setter) | cli_inner_pretty.js:509767-509769 | function |
| `OG$` | dispatchExtraArgsState (module-level mutable array) | cli_inner_pretty.js (referenced near 509790) | variable |
| `OQ4` | STALE_AGENT_THRESHOLD_MS (21,600,000 ms = 6 h) | cli_inner_pretty.js:569222 | constant |
| `Pn6` | AUTO_RELAUNCH_MARKER_ENV (`"CLAUDE_AGENTS_AUTO_RELAUNCHED_AT"`) | cli_inner_pretty.js:569223 | constant |
| `Qg4` | renderDispatchDefaultsChips (React component) | cli_inner_pretty.js:565479-565503 | function |
| `So5` | JOB_KIND_LABELS (`{agent:"background", repo, skill, routine}`) | cli_inner_pretty.js:569361 | constant |
| `_j8` | formatTuiHistoryLabel | cli_inner_pretty.js (called from `mountFleetView`, line 569095) | function |
| `ao5` | mountFleetView (the agents-view loop) | cli_inner_pretty.js:569079-569208 | function |
| `gg4` | coerceDispatchDefaults (validate `--permission-mode`/`--model`/`--effort`) | cli_inner_pretty.js:565469-565478 | function |
| `hV$` | serializeDispatchExtraArgs (flatten typed-extra-args back into argv) | cli_inner_pretty.js:114-122 | function |
| `og4` | STATE_LABELS (`{review,blocked,working,done}` → user-facing strings) | cli_inner_pretty.js:569355 | constant |
| `qg6` | dispatchDefaultsToArgv (turn validated defaults into a `--model X --effort Y --permission-mode Z` tail) | cli_inner_pretty.js:509773-509780 | function |
| `rg4` | STATE_BUCKET_ORDER (`["review","blocked","working","done"]`) | cli_inner_pretty.js:569354 | constant |
| `tZ8` | RELAUNCH_GRACE_MS (3,600,000 ms = 1 h) | cli_inner_pretty.js:569221 | constant |
| `wN4` | getDispatchExtraArgs | cli_inner_pretty.js:509770-509772 | function |
| `yQ4` | mountFleetViewFromLeftArrow (the `←←` shortcut) | cli_inner_pretty.js:569366-569381 | function |
| `yV$` | resolveDispatchExtraArgs (run `path.resolve` over raw flag values) | cli_inner_pretty.js:104-113 | function |

### Agents — Gate, Onboarding Flag, Relaunch

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$1H` | setHasUsedAgentsFleet (sticky flag, first opening of agent view) | cli_inner_pretty.js:435230-435233 | function |
| `Cq6` | consumeAgentViewRelaunchMarker (read & delete env var) | cli_inner_pretty.js:139921-139924 | function |
| `E5$` | AGENT_VIEW_RELAUNCH_ENV_KEY (`"CLAUDE_CODE_AGENT_VIEW_RELAUNCH"`) | cli_inner_pretty.js:139925 | constant |
| `MoH` | shouldAcceptLeftArrowToAgentView (predicate gating `←←` shortcut) | cli_inner_pretty.js:435227-435228 | function |
| `OKH` | bgSupervisorNounCap (`"Daemon"` vs `"Background service"`) | cli_inner_pretty.js:139910-139912 | function |
| `fF` | isAgentsFleetEnabled (`= !isAgentViewDisabled()`) | cli_inner_pretty.js:139882-139884 | function |
| `rmH` | isAgentViewDisabled (env `CLAUDE_CODE_DISABLE_AGENT_VIEW` / managed-settings `disableAgentView`) | cli_inner_pretty.js:139859-139861 | function |
| `wZH` | fleetGateRejected (writes stderr message, `process.exit(1)`) | cli_inner_pretty.js:139916-139920 | function |
| `y5$` | ensureFleetGateHydrated (load settings before reading gate flags) | cli_inner_pretty.js:139885-139891 | function |

### Agents — `--bg` Flag Preservation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$b5` | stripResumeFlags (build prompt-mode flag array for child workers) | cli_inner_pretty.js:511141-511161 | function |
| `Ab5` | findPositionalPrompt (skip `--*` flags, return first bare token) | cli_inner_pretty.js:511195-511206 | function |
| `Kb5` | gateBgFlagDisclaimers (error if bg+bypassPermissions/auto not interactive) | cli_inner_pretty.js:511179-511194 | function |
| `Pg6` | BG_FLAGS_WITH_ARGUMENT (set of `--model`, `--agent`, `--effort`, `--add-dir`, …) | cli_inner_pretty.js:511283-511326 | constant |
| `RN4` | flagsWithoutPositional (preserve boolean flags in `_b5`, keep value flags in `Pg6`) | cli_inner_pretty.js:511207-511225 | function |
| `_b5` | BG_FLAGS_BOOLEAN (set of `--dangerously-skip-permissions`, `--strict-mcp-config`, …) | cli_inner_pretty.js:511327-511332 | constant |
| `nC5` | BG_FLAG_NAMES (`["--bg","--background"]`) | cli_inner_pretty.js:511281 | constant |
| `qb5` | stripSessionIdAfterSeparator (preserve `--`, drop `--session-id`) | cli_inner_pretty.js:511162-511178 | function |
| `zb5` | captureClaudeEnvOverrides (capture `CLAUDE_CONFIG_DIR`/AWS/GCP env) | cli_inner_pretty.js:511226-511242 | function |

### Agents — Pre-existing Worktree Recognition

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$JH` | setCurrentWorktreeContext / saveWorktreeSession | cli_inner_pretty.js (called from `DE6`/`FkH`/`CiH`) | function |
| `CiH` | cleanupWorktreeOrPreserveExisting / deleteWorktreeAndExit (skip cleanup when `enteredExisting`) | cli_inner_pretty.js:523155-523197 | function |
| `DE6` | enterExistingWorktree (recognize registered worktrees; `enteredExisting:true`) | cli_inner_pretty.js:523107-523141 | function |
| `FkH` | keepWorktreeAtSessionEnd / keepWorktreeAndExit | cli_inner_pretty.js:523142-523154 | function |
| `NP8` | gitWorktreeListPorcelain / listRepoWorktrees (parse `git worktree list --porcelain`) | cli_inner_pretty.js:523088-523106 | function |
| `eJ$` | createAgentWorktree (`existed` branch resumes a previous matching worktree) | cli_inner_pretty.js:523198-… | function |
| `jO$` | currentWorktreeContextState | cli_inner_pretty.js (used in 234443, 234446) | variable |
| `oz` | getCurrentWorktreeContext / isInWorktreeSession / getActiveWorktreeSession | cli_inner_pretty.js (used in 523143, 523156) | function |

### Agents — Daemon Lifecycle

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BB5` | BG_RECENT_ADOPT_GRACE_MS (120,000 ms — don't retire just-adopted workers) | cli_inner_pretty.js:528605 | constant |
| `B6A` | startEventLoopStallDetector (200 ms tick; threshold 500 ms; hint sleep when > 5 s) | cli_inner_pretty.js:598366-598399 | function |
| `O89` | runDaemonSupervisor (top-level daemon entry — upgrade poll, retire timer, worker adopter) | cli_inner_pretty.js:609952-610186 | function |
| `RT$` | EVENT_LOOP_STALL_INTERVAL_MS (200) | cli_inner_pretty.js:598400 | constant |
| `Ur6` | BG_RETIRE_TICK_MS (60,000 ms — daemon's retire-loop interval) | cli_inner_pretty.js:609578 | constant |
| `aB` | BgWorkerHandle (class — wraps a worker process; tracks `lastInputAt`, `adoptedAt`, `retiring`/`retired`) | cli_inner_pretty.js:527970-528594 | class |
| `aB.adopt` | BgWorkerHandle.adopt (re-attach to a worker that survived a supervisor restart) | cli_inner_pretty.js:528052-… | function |
| `aB.claim` | BgWorkerHandle.claim (adopt a pre-warmed spare) | cli_inner_pretty.js:528015-528044 | function |
| `aB.retireIfSettled` | BgWorkerHandle.retireIfSettled (returns `{retired,reason}` after grace-window predicates) | cli_inner_pretty.js:527901-527964 | function |
| `aB.shiftGraceClocksForward` | BgWorkerHandle.shiftGraceClocksForward (v2.1.142 — bump clocks when wall-clock jumped) | cli_inner_pretty.js:528143-528147 | function |
| `aB.spawn` | BgWorkerHandle.spawn (cold-start a new worker) | cli_inner_pretty.js:528010-528014 | function |
| `aKA` | STALE_BINARY_POLL_MS (60,000 ms) | cli_inner_pretty.js:610188 | constant |
| `f89` | getBinaryIdentity (`realpath(binary) + mtimeMs`) | cli_inner_pretty.js:609938-609947 | function |
| `gKA` | BG_RETIRE_GRACE_DEFAULT_MS (3,600,000 ms = 1 h) | cli_inner_pretty.js:609576 | constant |
| `i$9` | BG_RETIRE_LOW_MEM_GRACE_MS (60,000 ms — under memory pressure) | cli_inner_pretty.js:609577 | constant |
| `mB5` | BG_REATTACH_TIMEOUT_MS (120,000 ms) | cli_inner_pretty.js:528604 | constant |
| `pB5` | BG_EMPTY_IDLE_GRACE_MS (300,000 ms = 5 min auto-retire, v2.1.141) | cli_inner_pretty.js:528606 | constant |
| `sKA` | DAEMON_IDLE_GRACE_DEFAULT_MS (5,000 ms) | cli_inner_pretty.js:610189 | constant |
| `tKA` | binaryIdentityChanged (realpath+mtime spot-check for upgrade-in-place) | cli_inner_pretty.js:609948-609951 | function |
| `ue4` | EVENT_LOOP_STALL_THRESHOLD_MS (500) | cli_inner_pretty.js:598401 | constant |
| `x6A` | EVENT_LOOP_SLEEP_HINT_MS (5000 — > 5 s means `[likely sleep/wake]`) | cli_inner_pretty.js:598402 | constant |

### Agents — Pre-warmed Worker (Spare) Fallback

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Fr6` | installHandleListeners (subscribe lease/state callbacks to a handle) | cli_inner_pretty.js (called from 609286, 609367) | function |
| `JN4` | discardPendingSpare | cli_inner_pretty.js:509922-509926 | function |
| `c1H` | SPARE_BG_AGENT_TEMPLATE (synthetic agent template for warming) | cli_inner_pretty.js (referenced near 509855, 509894) | constant |
| `jN4` | claimSpareOrColdDispatch (v2.1.141 — claim spare; on failure, fresh cold via `yP8`) | cli_inner_pretty.js:509877-509921 | function |
| `l1H` | pendingSpareDescriptor (module-level — the single warmed worker) | cli_inner_pretty.js (mutated near 509879, 509923) | variable |
| `xr6` | wrapSpareAsHandle (factory adapter from pending-spare descriptor to `BgWorkerHandle`) | cli_inner_pretty.js (called from 609285) | function |
| `yP8` | coldDispatchFromTemplate (fresh-spawn fallback path) | cli_inner_pretty.js:509781-509834 | function |

### Agents — Background-Worker Dispatch & Verbs

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Hb5` | rmHandler (`claude bg rm <id>`) | cli_inner_pretty.js:511077-… | function |
| `I$H` | spawnBgSession (top-level `--bg`/agent-view dispatch entry) | cli_inner_pretty.js:510492-510507 | function |
| `IN4` | bgVerbExtraArgsNote | cli_inner_pretty.js (export) | function |
| `Jg6` | preSeedReplBgJob (write empty job-state to disk before worker writes its own) | cli_inner_pretty.js:510464-510491 | function |
| `S$H` | extractFlagValue (find `--<flag>` then its argument in argv) | cli_inner_pretty.js (used in `iC5`) | function |
| `SN4` | parseResumeTarget | cli_inner_pretty.js (export) | function |
| `aC5` | logsHandler | cli_inner_pretty.js (export) | function |
| `bP8` | formatBgHints | cli_inner_pretty.js (export) | function |
| `eC5` | stopHandler | cli_inner_pretty.js (export) | function |
| `fg6` | recordBgDispatchFallback (telemetry for ack-timeout/short-alive recovery) | cli_inner_pretty.js:510408-510428 | function |
| `iC5` | assembleBgSessionDispatch (build `DispatchFrame` — flags, cwd, worktree, session-id, env) | cli_inner_pretty.js:510508-… | function |
| `rC5` | handleBgFlag | cli_inner_pretty.js (export) | function |
| `sC5` | attachHandler | cli_inner_pretty.js (export) | function |
| `tC5` | respawnHandler | cli_inner_pretty.js (export) | function |

### Agents — Attached-Session Capability Forwarding (Chrome Shim Isolation, Editor)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AL8` | isClaudeInChromeEnabled (returns false in non-TTY workers via `T6()`) | cli_inner_pretty.js:493305-493314 | function |
| `Fj5` | TERMINAL_EDITOR_REGEX (`/\b(vi\|vim\|nvim\|nano\|emacs\|pico\|micro\|helix\|hx)\b/`) | cli_inner_pretty.js:445827 | constant |
| `Lj8` | openInEditorAsync (the `v` shortcut handler) | cli_inner_pretty.js:445773-445806 | function |
| `Ox6` | getEditorDisplayName (human-readable label shown in dialogs) | cli_inner_pretty.js:445811-445816 | function |
| `Uj5` | GUI_EDITORS (`["code","cursor","windsurf","codium","subl","atom","gedit","notepad++","notepad"]`) | cli_inner_pretty.js:445826 | constant |
| `aV8` | setAttacherCaps (called when an `attacher-caps` rv-message arrives) | cli_inner_pretty.js:2689-2691 | function |
| `daH` | isClaudeInChromeAutoEnableEligible (only when interactive) | cli_inner_pretty.js:493315-493322 | function |
| `dj5` | envDefaultEditor (memoized lookup of `$VISUAL`/`$EDITOR`) | cli_inner_pretty.js:445829-445833 | function |
| `vJ` | getAttacherCaps (read forwarded attacher capability blob — non-null only while attached) | cli_inner_pretty.js:2686-2688 | function |
| `xy` | resolvePreferredEditor (`attacherCaps?.editor ?? envDefaultEditor`) | cli_inner_pretty.js:445808-445810 | function |

### Agents — Job-State Classification (v2.1.141)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Cn6` | colorForPrStatus (pr-status → colour) | cli_inner_pretty.js (used in 566049) | function |
| `En6` | enclosingRepoOrSpawnOrigin (use `BY(spawnOrigin) ?? spawnOrigin`) | cli_inner_pretty.js:566060-566063 | function |
| `HG8` | jobMatchesCwd (the v2.1.141 `--cwd <path>` filter) | cli_inner_pretty.js:565822-565825 | function |
| `HT$` | isLoopJob (intent or first-prompt starts with `/loop`) | cli_inner_pretty.js:566146-566149 | function |
| `NQ4` | iconForJobState | cli_inner_pretty.js:566153-566158 | function |
| `OG8` | isJobLongLivedRoutine (routine/cron/loop — never auto-retire) | cli_inner_pretty.js:566150-566152 | function |
| `Qj` | isJobSettled (predicate `retireIfSettled` uses to confirm terminal state) | cli_inner_pretty.js (called from 527948) | function |
| `byH` | classifyJobState (`working`/`blocked`/`review`/`done` from saved state/tempo/tasks) | cli_inner_pretty.js (used near 568578, 567725) | function |
| `cT` | isJobTerminalState | cli_inner_pretty.js (called from 180835) | function |
| `e0$` | spawnOriginDir (collapse `<repo>/.claude/worktrees/X/...` back to `<repo>`) | cli_inner_pretty.js:566055-566059 | function |
| `tempo:"active"` | enum value | cli_inner_pretty.js:180767 | enum |
| `tempo:"blocked"` | enum value | cli_inner_pretty.js:180753 | enum |
| `tempo:"idle"` | enum value | cli_inner_pretty.js:180757 | enum |

### Agents — Background-Agent Persistent State Schema

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Fb8` | WORKTREE_BRANCH_FIELD_NAME (`"worktreeBranch"`) | cli_inner_pretty.js:41085 | constant |
| `Ub8` | WORKTREE_PATH_FIELD_NAME (`"worktreePath"`) | cli_inner_pretty.js:41084 | constant |
| `aKH` | seedJobStateRecord (canonical empty/initial state record) | cli_inner_pretty.js (called from 510550, 509795, 509897) | function |
| `gz` | writeJobStateAtomic (lock-protected JSON write into `~/.claude/bg-sessions/<short>/state.json`) | cli_inner_pretty.js (used everywhere bg-state is written) | function |
| `k9` | jobStateDir (resolve `<configDir>/bg-sessions/<short>`) | cli_inner_pretty.js (used everywhere) | function |
| `o7` | readJobState | cli_inner_pretty.js (used at 527907, 510546, 569100) | function |
| `oW` | deleteJobStateAtomic (used after a stale-short conflict) | cli_inner_pretty.js (called near 509810) | function |
| `pb8` | WORKTREE_FIELD_NAME (`"worktree"`) | cli_inner_pretty.js:41083 | constant |

### Agents — Daemon Telemetry Events

| Event Name | Where Emitted | Notes |
|------------|---------------|-------|
| `tengu_bg_dispatch_low_mem` | daemon retire path | freemem() < threshold ⇒ retire settled workers (cli_inner_pretty.js:609260) |
| `tengu_bg_respawn_stale` | aB.retireIfSettled | idle worker retired-then-respawned for new binary (cli_inner_pretty.js:527897) |
| `tengu_bg_retired` | aB.retireIfSettled | per retired worker (cli_inner_pretty.js:527914, 527939, 527956) |
| `tengu_bg_spare_claim` | jN4 | dispatch successfully claimed a pre-warmed spare (cli_inner_pretty.js:609289) |
| `tengu_bg_spare_claim_fail` | jN4 / coldDispatch | spare-claim failed, fallback to cold dispatch (cli_inner_pretty.js:509882, 609304) |
| `tengu_bg_spare_enable` | feature flag | controls whether daemon pre-warms a spare (cli_inner_pretty.js:609280) |
| `tengu_daemon_idle_exit` | O89 | daemon exited after `sKA` ms with no clients (cli_inner_pretty.js:610118) |
| `tengu_daemon_self_restart_on_upgrade` | tKA | stale binary detected (cli_inner_pretty.js:610170) |
| `tengu_daemon_yield_takeover` | O89 | service daemon displaced a transient one (cli_inner_pretty.js:609982) |
| `tengu_event_loop_stall` | B6A | event-loop stall detector — includes `likely_sleep` (cli_inner_pretty.js:598383) |

Known new themes:

- `--cwd` flag scopes session list (v2.1.141)
- Daemon clock-jump detection vs. idle elapsed-time (v2.1.142)
- Pre-existing worktree recognition (v2.1.142)
- Empty placeholder cleanup, 5-min idle retire of `←` sessions (v2.1.141)
- `v` to open in editor uses `$EDITOR`/`$VISUAL` (v2.1.142)
- Dispatch flags: `--add-dir`, `--settings`, `--mcp-config`, `--plugin-dir`, `--permission-mode`, `--model`, `--effort`, `--dangerously-skip-permissions` (v2.1.142)
- Headless browser shim disabled while attached (v2.1.142)
- Crash-loop on missing-cwd resilience (v2.1.141)
- Background-color bleed on 256-color terminals (v2.1.142)

### Agents — Identity & Context Propagation (v2.1.139)

Two `AsyncLocalStorage` instances power agent identity propagation across processes (used for HTTP headers `x-claude-code-agent-id` / `x-claude-code-parent-agent-id`, OTel/Perfetto span attributes, and audit logging). `Atq` carries the agent context (this process's agent); `Ei8` carries the teammate context (parent → child team identity). Cross-validated against [agent_identity_propagation.md](../30_agent_team/agent_identity_propagation.md) (in 30_agent_team).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AA` | isTeammate (`BW() !== void 0`) | cli_inner_pretty.js:97826 | function |
| `Atq` | agentContextStore (AsyncLocalStorage instance) | cli_inner_pretty.js:97640-97642 | variable |
| `BW` | getTeammateContext (`Ei8.getStore()`) | cli_inner_pretty.js:97759 | function |
| `DZ` | isInProcessTeammate (`Ei8.getStore() !== void 0`) | cli_inner_pretty.js:97771-97773 | function |
| `Ei8` | teammateContextStore (AsyncLocalStorage instance) | cli_inner_pretty.js:97771-97774 | variable |
| `Ni8` | (companion init for `Atq` AsyncLocalStorage) | cli_inner_pretty.js:97634 | function |
| `RD` | getAgentContext (`Atq?.getStore()`) | cli_inner_pretty.js:97620 | function |
| `RU` | runWithAgentContext (`Atq.run(ctx, fn)`) | cli_inner_pretty.js:97623 | function |
| `q5` | getTeamName | cli_inner_pretty.js:97820 | function |
| `tG` | getAgentId (`BW()?.agentId ?? Ou?.agentId`) | cli_inner_pretty.js:97810-97814 | function |
| `vA` | getAgentName (`BW()?.agentName ?? Ou?.agentName`) | cli_inner_pretty.js:97815-97819 | function |
| `y4$` | getDynamicTeamContext (returns module-level `Ou`) | cli_inner_pretty.js:97807-97809 | function |
| `ztq` | (companion record-emitter for `Atq` context — invokingRequestId/invocationKind) | cli_inner_pretty.js:97629-97640 | function |

OTel / Perfetto span identity attributes (consumers of the above):

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `iO$` | buildAgentSpanAttributes (OTel attribute builder for agent_id/agent_name) | cli_inner_pretty.js:239952 | function |
| `s68` | recordAgentSpanAttributes (apply identity attrs to active span) | cli_inner_pretty.js:240007 | function |
| `t68` | recordAgentSpanAttributesAsync (async variant) | cli_inner_pretty.js:240335 | function |
| `vh1` | (Perfetto-side identity attr emitter) | cli_inner_pretty.js:137636 | function |

---

## Module: Subagent

The subagent runner: in-process spawn, transcript bridging, cwd preservation, tool-permission inheritance, agent-tool dispatcher.

### Subagent — Runtime & Lifecycle

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `ArK` | mergeContentReplacements (merge persisted `contentReplacements` on resume) | cli_inner_pretty.js (called from 386641) | function |
| `B7H` | isAgentTypeAdminTrusted (gate for policy-/plugin-/built-in-sourced agents) | cli_inner_pretty.js (called from 393199) | function |
| `CM$` | startAgentSummarization / subagentProgressSummary (per-subagent timer loop) | cli_inner_pretty.js:271869-271941 | function |
| `DX` | isFeatureBypassed (feature kill-switch consulted by `B7H`) | cli_inner_pretty.js (called from 393199) | function |
| `HJ$` | stripDeadFork (drop messages marked as dead-fork branches from prior rewinds) | cli_inner_pretty.js (called from 386641) | function |
| `IA8` | loadJSONL / loadJSONLLines (line-delimited JSON reader; drops malformed lines) | cli_inner_pretty.js (called from 386641) | function |
| `JVK` | clearAgentTranscriptSubdir (lifecycle cleanup at SubagentStop) | cli_inner_pretty.js (called from 393417) | function |
| `M_` | hookInputBase / buildHookInputBase (hook-input common fields builder) | cli_inner_pretty.js (called from 520055) | function |
| `Me` | recordSidechainTranscript / persistSubagentTranscript (append to `~/.claude/sidechains/<agentId>.jsonl`) | cli_inner_pretty.js:514415 | function |
| `QL$` | executeSubagentStartHooks (fires `SubagentStart`; returns `additionalContext`) | cli_inner_pretty.js:520055 | function |
| `Q85` | isRecordableMessage (filter for assistant/user/progress/system+compact_boundary messages) | cli_inner_pretty.js:393091-393097 | function |
| `S9H` | executeSubagentStopHooks (fires `SubagentStop` at lifecycle end) | cli_inner_pretty.js (called from 393377) | function |
| `SUBAGENT_START` | hook event name string | cli_inner_pretty.js:48544, 237667 | constant |
| `Vb` | runAgent / runSubagentInner (streaming generator running a subagent turn) | cli_inner_pretty.js:393098-393434 | function |
| `Vy6` | recordForkContextRef (write a fork pointer rather than copy parent transcript — v2.1.118 fix) | cli_inner_pretty.js (called from 393300) | function |
| `ZY_` | subagentStartHookInputSchema (Zod — `hookEventName: "SubagentStart"`, `additionalContext: string?`) | cli_inner_pretty.js:238068, 519062 | function |
| `alH` | extractLastAssistantText (extract last assistant message text for subagent result passing — narrower than the TS-source rich shape) | cli_inner_pretty.js:339749-339761 | function |
| `cJ6` | filterUnresolvedToolUses / stripIncompleteToolPairs (repairs interrupted transcripts on resume) | cli_inner_pretty.js:393435-393451 | function |
| `ej$` | fixupOrphanToolUseIds (rebuild integrity invariants after dead-fork strip) | cli_inner_pretty.js (called from 386641) | function |
| `eo7` | registerFrontmatterHooks (validates v2.1.142 prompt-/agent-type hooks; rejects with "use a command-type hook instead") | cli_inner_pretty.js (called from 393200) | function |
| `g85` | initializeAgentMcpServers (frontmatter `mcpServers:`; gates on `isSourceAdminTrusted`) | cli_inner_pretty.js (called from 393232) | function |
| `jVK` | setAgentTranscriptSubdir (override sidechain dir for this agent) | cli_inner_pretty.js (called from 393131) | function |
| `miH` | loadSubagentTranscript (read sidechain JSONL into messages array) | cli_inner_pretty.js (called from 386641) | function |
| `slH` | runSubagentLifecycle / runStreamingSubagentLoop (wraps `Vb` in async-task registration, summarization, progress) | cli_inner_pretty.js:339762-339950+ | function |
| `tJ$` | writeAgentMetadata / persistSubagentMetadata (writes `~/.claude/sidechains/<agentId>.json`) | cli_inner_pretty.js:514386 | function |
| `uiH` | runResumedSubagent (resume entry; hydrates transcript; builds `resumePersistedCount`) | cli_inner_pretty.js:386626-386713 | function |
| `vE6` | readAgentMetadata / loadSubagentMetadata (restore worktreePath/cwd/description/name) | cli_inner_pretty.js:514425 | function |

### Subagent — Fork-Subagent Path (`CLAUDE_CODE_FORK_SUBAGENT` / `FORK_AGENT`)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `C$_` | FORK_PLACEHOLDER_RESULT (`"Fork started — processing in background"`) | cli_inner_pretty.js:211799 | constant |
| `GHH` | isForkSubagentRuntimeEnabled (parallel runtime gate — env or `tengu_copper_fox`) | cli_inner_pretty.js:344846-344851 | function |
| `IH8` | forkSubagentSourceMemo (module-level cache for `nlK`) | cli_inner_pretty.js:211796 | variable |
| `I$_` | tengu_fork_subagent_enabled (telemetry event name) | cli_inner_pretty.js:211795 | constant |
| `R$_` | _resetForkSubagentSourceTelemetryForTesting (test-only reset) | cli_inner_pretty.js:211747-211749 | function |
| `S$_` | resolveForkSubagentSource (returns `"disabled" \| "env" \| "ant" \| "gb_rollout"`) | cli_inner_pretty.js:211733-211740 | function |
| `W0` | isForkSubagentEnabled (env or feature flag; mutually exclusive with coordinator mode) | cli_inner_pretty.js:211750-211752 | function |
| `Yf6` | buildForkedMessages (assistant-with-tool_uses + user-with-placeholder-results pair) | cli_inner_pretty.js:211761-211772 | function |
| `cLH` | FORK_BOILERPLATE_TAG (XML tag wrapping the fork directive in the child's prompt) | cli_inner_pretty.js (constants), used at 211758 | constant |
| `ff6` | buildWorktreeNotice (worktree-aware fork prompt addition) | cli_inner_pretty.js:211790-211792 | function |
| `h$_` | tengu_copper_fox (feature-flag key gating fork-subagent rollout) | cli_inner_pretty.js:211794 | constant |
| `i3H` | isFeatureDisabled (master-kill predicate consulted by `S$_`/`GHH`) | cli_inner_pretty.js:211707-211709 | function |
| `ilK` | FORK_SUBAGENT_TYPE (`"fork"`) | cli_inner_pretty.js:211797 | constant |
| `nlK` | getForkSubagentSource (memoized + telemetry wrapper around `S$_`) | cli_inner_pretty.js:211741-211746 | function |
| `vI` | FORK_AGENT (synthetic AgentDefinition: `agentType:"fork"`, `tools:["*"]`, `permissionMode:"bubble"`, `model:"inherit"`, `maxTurns:200`) | cli_inner_pretty.js:211810-211819 | constant |
| `zf6` | isInForkChild (scan messages for `FORK_BOILERPLATE_TAG` — guard against recursive forking) | cli_inner_pretty.js:211753-211760 | function |
| `zf$` | buildChildMessage (per-fork directive prompt wrapped in boilerplate tag) | cli_inner_pretty.js:211773-211789 | function |

### Subagent — Agent-Type Matching & Permission (Case/Separator-Insensitive, v2.1.140)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BOH` | rememberLastResolutionColor / setAgentColor (cache requested→canonical color mapping) | cli_inner_pretty.js (called from 351396) | function |
| `GnH` | filterAgentsByPermission / filterDeniedAgents (apply `Agent(<type>)` deny rules) | cli_inner_pretty.js (called from 351367) | function |
| `WV6` | findDenyingPermissionRule / getDenyRuleForAgent (distinguishes "not found" from "denied") | cli_inner_pretty.js:421499 | function |
| `Y5H` | truncateForErrorLabel (bounded substring of normalized agent name for telemetry/error text) | cli_inner_pretty.js (called from 351374) | function |
| `Zu7` | normalizeAgentTypeSlug / normalizeAgentType (`NFKC` + `toLowerCase` + strip `\p{White_Space}\p{Pd}_`) | cli_inner_pretty.js:351139-351143 | function |
| `subagent_launch:subagent_type_ambiguous` | error-bucket | cli_inner_pretty.js:351384 | uH-key |
| `subagent_launch:subagent_type_denied` | error-bucket | cli_inner_pretty.js:351400 | uH-key |
| `subagent_launch:subagent_type_not_found` | error-bucket | cli_inner_pretty.js:351408 | uH-key |
| `tengu_subagent_type_miss` | telemetry — Agent tool called with subagent_type that didn't match | cli_inner_pretty.js:351379, 351407 | event-name |
| `tengu_subagent_type_normalized` | telemetry — subagent_type matched after normalization | cli_inner_pretty.js:351394 | event-name |

### Subagent — Agent Tool Dispatch Header & Resume

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Cc_` | agentBaseInputSchema | cli_inner_pretty.js:351205-351221 | function |
| `D7` | AGENT_TOOL_NAME (`"Agent"`) | cli_inner_pretty.js (used at 351038) | constant |
| `F7H` | userFacingAgentName / getAgentTypeColor | cli_inner_pretty.js:231351 | function |
| `XV6` | agentExportedInputSchema | cli_inner_pretty.js:351250-351253 | function |
| `at` | GENERAL_PURPOSE_AGENT (default when `subagent_type` omitted and fork path disabled) | cli_inner_pretty.js (used at 211736-211740, 351038) | constant |
| `bc_` | agentFullInputSchema | cli_inner_pretty.js:351222-351249 | function |
| `n7H` | getMcpServerName (mcp__-prefix extractor) | cli_inner_pretty.js | function |
| `uc_` | resolveTeamName | cli_inner_pretty.js:351135-351138 | function |
| `ZnH` | isBackgroundTasksDisabled | cli_inner_pretty.js:351204 | variable |

### Subagent — Skill Discovery

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Ax5` | getSkillsFromAllSources (unified loader: skill-dir + plugin + bundled + builtin) | cli_inner_pretty.js:513752 | function |
| `Dh6` | loadPluginSkills (walk every enabled plugin's `skillsPath`/`skillsPaths`) | cli_inner_pretty.js (called from `Ax5`) | function |
| `GrK` | getBuiltinPluginSkills | cli_inner_pretty.js (called from `Ax5`) | function |
| `InH` | getSkillCommandFromSkill (turn Skill entry into slash-command record for preload) | cli_inner_pretty.js (called from 393211) | function |
| `KI6` | loadSkillDirCommands (walk `<repo>/.claude/skills/` + `~/.claude/skills/`) | cli_inner_pretty.js (called from `Ax5`) | function |
| `YX$` | formatSkillLoadingMetadata (label preloaded skills with progress messages) | cli_inner_pretty.js (dynamic import at 393218) | function |
| `c85` | resolveSkillByName (frontmatter `skills:` list lookup) | cli_inner_pretty.js (called from 393206) | function |
| `zG4` | getBundledSkills | cli_inner_pretty.js (called from `Ax5`) | function |

### Subagent — AgentSummary Background Loop

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `AP_` | SUMMARY_INTERVAL_MS / AGENT_SUMMARY_INTERVAL_MS (30000) | cli_inner_pretty.js:271942 | constant |
| `JV` | runForkedQueryForSummary (the inner fork call producing the summary string) | cli_inner_pretty.js (called from 271902) | function |
| `lO7` | recordAgentSummary / publishSubagentSummary | cli_inner_pretty.js (called from 271922) | function |
| `tengu_agent_summary_skipped` | telemetry event for "transcript unchanged" cap | cli_inner_pretty.js (emitted at 271891) | constant |
| `zP_` | summaryPromptTemplate / buildSubagentSummaryPrompt | cli_inner_pretty.js:271850-271867 | function |

### Subagent — Color Palette

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Nf` | AGENT_COLOR_PALETTE (`["red","blue","green","yellow","purple","orange","pink","cyan"]`) | cli_inner_pretty.js:231368 | constant |
| `UP` | AGENT_COLOR_TUI_KEYS (per-color theme keys — `red_FOR_SUBAGENTS_ONLY`, …) | cli_inner_pretty.js:231369-231378 | constant |
| `agentColorIndex` | rotating index for auto-assigning next palette color | cli_inner_pretty.js:2251 | variable |
| `agentColorMap` | session-state map of agentId → color | cli_inner_pretty.js:2250 | variable |

Known new themes for this window:

- Subagents resumed via `SendMessage` not restoring spawn cwd (v2.1.118 fix)
- `subagent_type` accepts case- and separator-insensitive values (v2.1.140)
- Forked subagents enabled on external builds via `CLAUDE_CODE_FORK_SUBAGENT=1` (v2.1.117)
- `x-claude-code-agent-id` / `x-claude-code-parent-agent-id` headers (v2.1.139)
- OTel `agent_id`/`parent_agent_id` span attributes (v2.1.139)
- Sub-agent progress summaries cache-miss fix (v2.1.128 — ~3× cache_creation reduction)
- Built-in agents: `Plan` (`d88`, cli_inner_pretty.js:231700), `statusline-setup` (`q67`, cli_inner_pretty.js:231715), `Explore`, `general-purpose`
- Frontmatter `omitClaudeMd: !0` (e.g. `Plan` line 231709) controls CLAUDE.md hierarchy inclusion

---

## Module: State

Session state primitives: AppState, mutable hook results, in-flight tool registry, plan state, transcript buffers, abort flags.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `BeH` | totalCacheReadInputTokens | cli_inner_pretty.js:2439-2441 | function |
| `HH$` | hasExitedPlanModeInSessionEver (session-state accessor) | cli_inner_pretty.js | function |
| `Kh` | getMainThreadAgentType (state getter; current `--agent` value) | cli_inner_pretty.js:3074-3077 | function |
| `cacheBreakerPhrase` | session-state field (referenced by `Bn` etc.) | cli_inner_pretty.js (multiple sites) | variable |
| `cacheMissAckedAtOutputTokens` | session-state field (default `-1` at startup) | cli_inner_pretty.js:278784, 607227 | variable |
| `dv$` | setMainThreadAgentHooks (write-through state setter) | cli_inner_pretty.js:3087-3090 | function |
| `kp` | getMainThreadAgentHooks (agent-frontmatter hooks registered on `--agent` start) | cli_inner_pretty.js:3083-3085 | function |
| `mainThreadAgentHooks` | session state field | cli_inner_pretty.js:2283 | variable |
| `mainThreadAgentType` | session state field | cli_inner_pretty.js:2282 | variable |
| `meH` | totalInputTokens | cli_inner_pretty.js:2433-2435 | function |
| `nX` | totalOutputTokens | cli_inner_pretty.js:2436-2438 | function |
| `peH` | totalCacheCreationInputTokens | cli_inner_pretty.js:2442-2444 | function |
| `vp` | setMainThreadAgentType (written when `--agent <name>` is parsed) | cli_inner_pretty.js:3078-3082 | function |

Known new themes for this window:

- `transcript_path` after `EnterWorktree` cwd switch (v2.1.141 fix)
- Idle re-render loop reduction (v2.1.117)
- Background-tasks orphan notification (v2.1.117)
- Stale view-preference / blank assistant messages (v2.1.121)
- `cacheMissAckedAtOutputTokens` session field (v2.1.129)

---

## See Also

- [`changelog_analysis.md`](changelog_analysis.md) — long-form narrative
- [`changelog_to_code_map.md`](changelog_to_code_map.md) — per-bullet pointers
- [`file_index.md`](file_index.md) — extracted-file inventory
- The v2.1.112 baseline lives at `../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index.md` (single-file index in that version)
