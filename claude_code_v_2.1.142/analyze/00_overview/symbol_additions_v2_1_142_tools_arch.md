# Symbol Additions — v2.1.142 Tools Architecture Unit

> Tool subsystem symbol mappings discovered while analysing the v2.1.142 bundle's tool architecture.
> When the symbol_index_*.md files are produced for v2.1.142, these mappings should be merged into `symbol_index_core_execution.md` (Tools section) and `symbol_index_infra_platform.md` (MCP section) as appropriate.

---

## Module: Tools — Core Factory & Defaults

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `XK` | `createTool` (factory; rename from `Iq` in v2.1.112) | cli_inner_pretty.js:141068 | function |
| `TI1` | `TOOL_DEFAULTS` (defaults map; rename from `jy_` in v2.1.112) | cli_inner_pretty.js:141082-141092 | object |
| `vZ` | `getEmptyToolPermissionContext` (factory; initial state) | cli_inner_pretty.js:141071-141078 | function |
| `i4` | `findToolByName` (cached name→tool resolver) | cli_inner_pretty.js:141057-141066 | function |
| `GI1` | `buildToolNameMap` (Tools-array→Map cache builder) | cli_inner_pretty.js:(referenced from i4) | function |
| `G1` | `toolMatchesName` (name/alias predicate) | cli_inner_pretty.js:(referenced from i4) | function |
| `uTK` | `TOOL_NAME_CACHE` (WeakMap<Tools, Map<name, Tool>>) | cli_inner_pretty.js:141079 | variable |
| `mTK` | `TOOL_ARRAYS_SEEN` (WeakSet<Tools>) | cli_inner_pretty.js:141080 | variable |

---

## Module: Tools — Tool Name Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bq` | `READ_TOOL_NAME` (`"Read"`) | cli_inner_pretty.js:141539 | constant |
| `Sq` | `BASH_TOOL_NAME` (`"Bash"`) | cli_inner_pretty.js:141447 | constant |
| `v9` | `GREP_TOOL_NAME` (`"Grep"`) | cli_inner_pretty.js:141468 | constant |
| `d1` | `GLOB_TOOL_NAME` (`"Glob"`) | cli_inner_pretty.js:141564 | constant |
| `G7` | `EDIT_TOOL_NAME` (`"Edit"`) | cli_inner_pretty.js:143068 | constant |
| `o4` | `WRITE_TOOL_NAME` (`"Write"`) | cli_inner_pretty.js:207727 | constant |
| `VP` | `NOTEBOOK_EDIT_TOOL_NAME` (`"NotebookEdit"`) | cli_inner_pretty.js:141573 | constant |
| `EK` | `POWERSHELL_TOOL_NAME` (`"PowerShell"`) | cli_inner_pretty.js:141574 | constant |
| `m3` | `REPL_TOOL_NAME` (`"REPL"`) | cli_inner_pretty.js:141589 | constant |
| `cY` | `TOOL_SEARCH_TOOL_NAME` (`"ToolSearch"`) | cli_inner_pretty.js:211392 | constant |
| `NH8` | `SEND_USER_FILE_TOOL_NAME` (`"SendUserFile"`) | cli_inner_pretty.js:211424 | constant |
| `u$_` | `SEND_USER_FILE_TOOL_NAME` (alt re-export for deferred-tools check) | cli_inner_pretty.js:(via s6(EH8).SEND_USER_FILE_TOOL_NAME) | constant |
| `Q3H` | `ENTER_PLAN_MODE_TOOL_NAME` (`"EnterPlanMode"`) | cli_inner_pretty.js:211429 | constant |
| `Gz` | `ASK_USER_QUESTION_TOOL_NAME` (`"AskUserQuestion"`) | cli_inner_pretty.js:211430 | constant |
| `Km` | `TASK_STOP_TOOL_NAME` (`"TaskStop"`) | cli_inner_pretty.js:211475 | constant |
| `It` | `PUSH_NOTIFICATION_TOOL_NAME` (`"PushNotification"`) | cli_inner_pretty.js:211491 | constant |
| `hL` | `MONITOR_TOOL_NAME` (`"Monitor"`) | cli_inner_pretty.js:211515 | constant |
| `$n` | `TASK_OUTPUT_TOOL_NAME` (`"TaskOutput"`) | cli_inner_pretty.js:211428 | constant |
| `J0` | `STRUCTURED_OUTPUT_TOOL_NAME` (`"StructuredOutput"`) | cli_inner_pretty.js:(referenced by $Y6 registration) | constant |
| `D7` | `AGENT_TOOL_NAME` (`"Agent"`) | cli_inner_pretty.js:(referenced by isDeferredTool) | constant |
| `x$_` | `BRIEF_TOOL_NAME` (`"Brief"`) | cli_inner_pretty.js:(via s6(W7H).BRIEF_TOOL_NAME) | constant |
| `nf` | `SKILL_TOOL_NAME` (`"Skill"`) | cli_inner_pretty.js:(referenced by isDeferredTool) | constant |

---

## Module: Tools — Tool Registration Objects

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$Y` | `readTool` (Read tool registration) | cli_inner_pretty.js:407219 | object |
| `$Y6` | `structuredOutputTool` (StructuredOutput tool) | cli_inner_pretty.js:207581 | object |
| `fH5` | `sendUserFileTool` (SendUserFile tool — NEW v2.1.142) | cli_inner_pretty.js:385814 | object |
| `wL$` | `toolSearchTool` (ToolSearch tool) | cli_inner_pretty.js:383397 | object |
| `mI6` | `mcpToolBase` (catch-all `mcp` tool + spread base for MCP wrappers) | cli_inner_pretty.js:409973 | object |

---

## Module: Tools — Deferred Tools System

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `zm` | `isDeferredTool` (predicate for `defer_loading:true`) | cli_inner_pretty.js:211830-211841 | function |
| `Of6` | `formatDeferredToolLine` (line formatter for deferred-tools list) | cli_inner_pretty.js:211842-211844 | function |
| `SH8` | `getToolSearchPromptText` (description + prompt for ToolSearch) | cli_inner_pretty.js:211845-211847 | function |
| `Mf6` | `deferredToolsModule` (re-export bundle: isDeferredTool, getPrompt, formatDeferredToolLine, TOOL_SEARCH_TOOL_NAME) | cli_inner_pretty.js:211823-211829 | object |
| `Bl7` | `invalidateToolSearchCacheIfChanged` (fingerprint-based cache invalidation) | cli_inner_pretty.js:383245-383248 | function |
| `Ze_` | `clearToolSearchCache` (unconditional cache clear) | cli_inner_pretty.js:383249-383251 | function |
| `We_` | `computeDeferredToolFingerprint` (sorted comma-joined names) | cli_inner_pretty.js:383240-383244 | function |
| `OE6` | `currentDeferredFingerprint` (last-seen fingerprint) | cli_inner_pretty.js:383346 | variable |
| `Pe_` | `TOOL_SEARCH_MCP_WAIT_MS` (5000ms max wait for pending servers) | cli_inner_pretty.js:383345 | constant |
| `F38` | `toolSearchScoreCache` (memoised scoring cache) | cli_inner_pretty.js:383347 | variable |
| `pl7` | `extractToolNameParts` (camel/snake split for scoring) | cli_inner_pretty.js:383255-383269 | function |
| `Ge_` | `compileWordBoundaryRegexes` (regex cache per query token) | cli_inner_pretty.js:383270-383274 | function |
| `Ul7` | `searchDeferredTools` (main scoring algorithm) | cli_inner_pretty.js:383275-383342 | function |
| `IiH` | `makeToolSearchResult` (wraps matches with deferred/pending counts) | cli_inner_pretty.js:383252-383254 | function |
| `xHH` | `MAX_INLINE_TOOL_NAMES` (threshold for inline-vs-summarised lists) | cli_inner_pretty.js:(referenced from deferred_tools_delta) | constant |
| `iM8` | `formatToolList` (comma-joined or N-cap-with-summary list formatter) | cli_inner_pretty.js:(referenced from deferred_tools_delta) | function |

---

## Module: Tools — MCP Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `mI6` | `mcpToolBase` (catch-all + spread base) | cli_inner_pretty.js:409973-410010 | object |
| `fh` | `McpToolError` (uniform error envelope class) | cli_inner_pretty.js:(error wrapping in MCP call) | class |
| `KU` | `formatMcpToolName` (build `mcp__<server>__<tool>`) | cli_inner_pretty.js:(referenced in MCP wrapper factory) | function |
| `tz6` | `MCP_RESULT_SIZE_CEILING` (hard cap on user-supplied maxResultSizeChars) | cli_inner_pretty.js:(referenced in MCP wrapper factory) | constant |
| `QP$` | `MAX_MCP_PROMPT_CHARS` (truncation point for server descriptions) | cli_inner_pretty.js:(referenced in MCP wrapper factory) | constant |
| `Y_5` | `mcpAutoClassifierProjection` (input→classifier text) | cli_inner_pretty.js:(referenced from per-tool wrapper) | function |
| `SrH` | `serialiseMcpToolOutput` (content-block→API content) | cli_inner_pretty.js:410008 | function |
| `eu` | `isTruncatedHeuristic` (does this string look truncated?) | cli_inner_pretty.js:(referenced in mcpToolBase.isResultTruncated) | function |
| `RH4` | `renderMcpToolUseMessage` (per-call UI renderer) | cli_inner_pretty.js:(referenced in mcpToolBase) | function |
| `CH4` | `renderMcpToolUseProgressMessage` (progress UI renderer) | cli_inner_pretty.js:(referenced in mcpToolBase) | function |
| `tM8` | `renderMcpToolResultMessage` (post-run UI renderer) | cli_inner_pretty.js:(referenced in mcpToolBase) | function |
| `uTH` | `isClaudeInChromeServer` (recogniser for Chrome in-process MCP) | cli_inner_pretty.js:(referenced in MCP wrapper factory) | function |
| `AZH` | `isComputerUseServer` (recogniser for computer-use MCP) | cli_inner_pretty.js:(referenced in MCP wrapper factory) | function |
| `o15` | `loadChromeMcpOverrides` (Chrome MCP tool overrides loader) | cli_inner_pretty.js:(referenced in MCP wrapper factory) | function |
| `a15` | `loadComputerUseOverrides` (computer-use overrides loader) | cli_inner_pretty.js:(referenced in MCP wrapper factory) | function |
| `O$4` | `isElicitationTool` (recogniser for OAuth-elicitation synthetic tools) | cli_inner_pretty.js:(referenced in MCP wrapper factory) | function |
| `M$4` | `getElicitationOverrides` (overrides for elicitation tools) | cli_inner_pretty.js:(referenced in MCP wrapper factory) | function |
| `z_5` | `isWrappedToolEnabled` (filter predicate for the wrapper map) | cli_inner_pretty.js:(referenced in MCP wrapper factory) | function |
| `FrH` | `McpSessionRecoveryError` (retriable error class) | cli_inner_pretty.js:(caught in MCP call retry block) | class |
| `dI6` | `makeOAuthAuthenticateTool` (synthetic tool for OAuth start) | cli_inner_pretty.js:411664-411778 | function |
| `cI6` | `makeOAuthCompleteAuthenticationTool` (synthetic tool for OAuth callback) | cli_inner_pretty.js:411780+ | function |
| `Th` | `resolveMcpInfoFromName` (parse `mcp__server__tool` back to {serverName, toolName}) | cli_inner_pretty.js:(referenced in pl7) | function |
| `JS6` | `executeMcpToolCall` (low-level MCP request dispatcher) | cli_inner_pretty.js:(referenced in MCP wrapper call) | function |
| `k0H` | `getMcpClient` (extract live client from connection) | cli_inner_pretty.js:(referenced in MCP wrapper call) | function |
| `eH4` | `markMcpToolSuccess` (clear failure tracking) | cli_inner_pretty.js:(referenced in MCP wrapper call success path) | function |

---

## Module: Tools — Schema Validation & Dispatcher

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `j38` | `validateSendUserFilePaths` (file path validator for SendUserFile) | cli_inner_pretty.js:(referenced by sendUserFileTool.validateInput) | function |
| `fK6` | `parsePagesParam` (parse PDF page range like "1-5") | cli_inner_pretty.js:(referenced by readTool.validateInput) | function |
| `eq` | `resolvePath` (relative→absolute path resolver) | cli_inner_pretty.js:(referenced widely) | function |
| `yL` | `matchesDenyRule` (look up deny rule for path) | cli_inner_pretty.js:(referenced by readTool.validateInput) | function |
| `Nq$` | `isBinaryByMagic` (detect binary file by leading bytes) | cli_inner_pretty.js:(referenced by readTool.validateInput) | function |
| `YBH` | `isReadableImageExt` (whitelist of readable image extensions) | cli_inner_pretty.js:(referenced by readTool.validateInput) | function |
| `ne7` | `READABLE_BINARY_EXTS` (Set of ext names readable via Read) | cli_inner_pretty.js:(referenced by readTool.validateInput) | constant |
| `h45` | `isDeviceFile` (detect /dev/* or named pipes) | cli_inner_pretty.js:(referenced by readTool.validateInput) | function |
| `ZGH` | `MAX_PAGES` (PDF max-pages-per-request) | cli_inner_pretty.js:(referenced by readTool.validateInput) | constant |
| `CwH` | `evaluatePermissionForFileTool` (shared by Read/Edit/Write/NotebookEdit) | cli_inner_pretty.js:(referenced by readTool.checkPermissions) | function |
| `V38` | `resolvePermission` (combine hook + tool + general policy) | cli_inner_pretty.js:379417 | function |
| `v38` | `runPreToolUseHooksStream` (async iterator yielding hook events) | cli_inner_pretty.js:388058 | function |
| `G38` | `runPostToolUseHooksStream` (async iterator for post-call hooks) | cli_inner_pretty.js:379443 | function |
| `Z38` | `recordPostHookOutputRewrite` (record file-state effects from PostToolUse) | cli_inner_pretty.js:379446 | function |
| `T38` | `runOnErrorHooksStream` (async iterator for tool-error hooks) | cli_inner_pretty.js:379498 | function |
| `r7` | `anonymiseToolName` (strip MCP server prefix for telemetry aggregation) | cli_inner_pretty.js:(referenced by telemetry calls) | function |
| `S8` | `pluralize` ("1 file" / "N files") | cli_inner_pretty.js:(referenced by sendUserFileTool) | function |
| `a8` | `sleepWithAbort` (cancellable sleep) | cli_inner_pretty.js:(referenced by ToolSearch waits) | function |
| `c_H` | `getStallMonitor` (Stall-warning observer) | cli_inner_pretty.js:388085 | function |
| `kq8` | `recordToolResultBytes` (telemetry hook) | cli_inner_pretty.js:388320 | function |
| `Gv$` | `recordToolDurationHistogram` (telemetry hook) | cli_inner_pretty.js:388291 | function |
| `UI` | `isToolSearchFeatureEnabled` (gates ToolSearch tool registration) | cli_inner_pretty.js:(referenced from toolSearchTool.isEnabled) | function |
| `U3H` | `isSkillDiscoveryEnabled` (gates Skill defer behaviour) | cli_inner_pretty.js:(referenced by isDeferredTool) | function |

---

## Module: Tools — Render Helpers (Read tool example)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `pe7` | `renderReadToolUseMessage` (Read tool use renderer) | cli_inner_pretty.js:(referenced from readTool.renderToolUseMessage) | function |
| `Ue7` | `renderReadToolUseTag` (line range / page count tag) | cli_inner_pretty.js:(referenced from readTool.renderToolUseTag) | function |
| `Fe7` | `renderReadToolResultMessage` (Read result renderer) | cli_inner_pretty.js:(referenced from readTool.renderToolResultMessage) | function |
| `ge7` | `renderReadToolUseErrorMessage` (Read error renderer with did-you-mean) | cli_inner_pretty.js:(referenced from readTool.renderToolUseErrorMessage) | function |
| `MI6` | `getReadActivitySummary` (extracts a short input summary for spinner) | cli_inner_pretty.js:(referenced from readTool.getToolUseSummary) | function |
| `Qe7` | `readToolUserFacingName` (UI display name for Read) | cli_inner_pretty.js:(referenced from readTool.userFacingName) | function |
| `Iw8` | `editToolUserFacingName` (Edit tool's userFacingName; returns `"Update"` / `"Updated plan"` / `"Create"`; also reused by Bash for `sed -i`) | cli_inner_pretty.js:415257-415263 | function |
| `mp7` | `writeToolUserFacingName` (Write tool's userFacingName; returns `"Updated plan"` for plan-dir files, else `"Write"`) | cli_inner_pretty.js:359731-359734 | function |
| (inline arrow) | `bashToolUserFacingName` (Bash's input-dependent userFacingName method; inline on tool object — no top-level binding) | cli_inner_pretty.js:419501-419509 | function |
| `FvH` | `parseSedInPlace` (parser recognising `sed -i …` as a file-edit-equivalent command; used by Bash userFacingName + sandbox layer) | cli_inner_pretty.js:336532 | function |
| `bH` | `parseBoolean` (env-var truthy parser: `"1"`/`"true"`/`"yes"`/`"on"`) | cli_inner_pretty.js:1769 | function |
| `SO` | `getPlanDirPrefix` (memoised lazy initialiser returning the plan-mode scratch directory; gates `"Updated plan"` labels) | cli_inner_pretty.js:517791 | function |
| `le7` | `readFileImpl` (actual file-reading worker) | cli_inner_pretty.js:407377 | function |
| `S45` | `findCaseInsensitiveMatch` (fallback when ENOENT) | cli_inner_pretty.js:407380 | function |
| `mS$` | `suggestSimilarFilename` (did-you-mean by edit distance) | cli_inner_pretty.js:407387 | function |
| `s5H` | `suggestSimilarFileInDir` (directory-scoped fuzzy match) | cli_inner_pretty.js:407388 | function |
| `c7H` | `getReadConfig` (env-driven config: maxSizeBytes, maxTokens, etc.) | cli_inner_pretty.js:407228 | function |
| `aN` | `READ_FILE_HINT_PREFIX` ("Try checking files in") | cli_inner_pretty.js:407389 | constant |
| `OK6` | `READ_LINE_NUMBER_HINT_TEXT` | cli_inner_pretty.js:141548 | constant |
| `zVK` | `READ_LINE_NUMBER_HINT_LONG` (full hint text) | cli_inner_pretty.js:141557 | variable |
| `YVK` | `READ_BROAD_FILE_HINT` (suggest offset/limit for long files) | cli_inner_pretty.js:141551 | constant |
| `fVK` | `READ_TARGETED_FILE_HINT` (encourage range reads) | cli_inner_pretty.js:141553 | constant |
| `qVK` | `READ_REREAD_REMINDER` ("don't re-read after Edit") | cli_inner_pretty.js:141541 | constant |
| `nI1` | `READ_FILE_UNCHANGED_MESSAGE` | cli_inner_pretty.js:141544 | constant |
| `KVK` | `READ_WASTED_CALL_MESSAGE` | cli_inner_pretty.js:141546 | constant |
| `Bi$` | `READ_FILE_STATE_CURRENT_SUFFIX` ("file state is current...") | cli_inner_pretty.js:141543 | constant |
| `AVK` | `READ_TOOL_DESCRIPTION` ("Read a file from the local filesystem.") | cli_inner_pretty.js:141547 | constant |
| `OBH` | `READ_TOOL_FAMILY_NAMES` (Set: Read, Glob, Grep, Bash, PowerShell, NotebookEdit) | cli_inner_pretty.js:141598 | constant |
| `fBH` | `DEFAULT_READ_LINE_COUNT` (2000) | cli_inner_pretty.js:141546 | constant |

---

## Module: Tools — System-Reminder Delta Protocol

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `aY` | `pushAttachment` (queue an attachment for next system-reminder) | cli_inner_pretty.js:397569 | function |
| `h2` | `reminderWrap` (wraps text in `<system-reminder>` envelope) | cli_inner_pretty.js:424714-424718 | function |
| `o_` | `wrapMessagesAsReminders` (maps `h2` over a list of messages) | cli_inner_pretty.js:424748-424761 | function |
| `Wq4` | `unwrapReminder` (strip envelope; used by compaction normaliser) | cli_inner_pretty.js:424719-424722 | function |
| `Vq5` | `maybeEmitTodoReminder` (threshold-gated TodoWrite nudge) | cli_inner_pretty.js:398561-398572 | function |
| `kq5` | `maybeEmitTaskReminder` (threshold-gated TaskCreate/TaskUpdate nudge) | cli_inner_pretty.js:398596-398607 | function |
| `Tq5` | `countTurnsSinceTodoEvents` (turn counter for reminder gate) | cli_inner_pretty.js:398533-398559 | function |
| `vq5` | `countTurnsSinceTaskEvents` (task variant turn counter) | cli_inner_pretty.js:398573-398594 | function |
| `aO8` | `REMINDER_THRESHOLDS` (`{TURNS_SINCE_WRITE:10, TURNS_BETWEEN_REMINDERS:10}`) | cli_inner_pretty.js:398821 | constant |
| `Z38` | `detectPostHookFileChange` (emits `edited_text_file` after formatter modifies file) | cli_inner_pretty.js:378825-378847 | function |

---

## Module: Tools — Streaming Executor (Runtime Mechanism)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `NL$` | `StreamingToolExecutor` (streaming dispatcher class — queue, concurrency control, abort tree) | cli_inner_pretty.js:388590-388860+ | class |
| `eH5` | `dispatchToolCall` (Stage 1–4 pre-call pipeline: schema → validateInput → hooks → permission → call) | cli_inner_pretty.js:387960-388549 | function |
| `pE6` | `nameResolutionHints` ("Did you mean …?" for unknown tool names) | cli_inner_pretty.js (referenced in `NL$.addTool`) | function |
| `xm` | `isBridgeEvent` (remote-control bridge event predicate) | cli_inner_pretty.js (referenced in `NL$.executeTool`) | function |
| `mE6` | `TOOL_HOOK_SLOW_THRESHOLD_MS` (`2000`) | cli_inner_pretty.js:388551 | constant |
| `QW` | `SIBLING_ABORTING_TOOLS` (`[BASH_TOOL_NAME, POWERSHELL_TOOL_NAME]`) | cli_inner_pretty.js:141680 | constant |
| `FiH` | `INTERRUPT_MESSAGE_FOR_TOOL_USE` (user-rejected sentinel) | cli_inner_pretty.js (referenced in `createSyntheticErrorMessage`) | constant |
| `DkH` | `REJECT_MESSAGE` | cli_inner_pretty.js (referenced in `createSyntheticErrorMessage`) | constant |

---

## Module: Tools — UI Rendering Pipeline

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `kQ_` | `renderToolUseMessageSafe` (try/catch wrapper around `tool.renderToolUseMessage`) | cli_inner_pretty.js:344781-344787 | function |
| `EC7` | `renderToolUseProgressMessage` (splits hook progress from tool progress) | cli_inner_pretty.js:344788-344818 | function |
| `NQ_` | `renderToolUseQueuedMessage` (try/catch wrapper around `tool.renderToolUseQueuedMessage`) | cli_inner_pretty.js:344819-344825 | function |
| `KkH` | `MessageResponse` (Ink wrapper providing 1-line response container) | cli_inner_pretty.js (referenced in `renderToolUseProgressMessage`) | function |
| `xz8` | `HookProgressMessage` (PreToolUse / PostToolUse hook progress UI) | cli_inner_pretty.js (referenced in `renderToolUseProgressMessage`) | function |

---

## Module: Tools — Send User File (NEW v2.1.142)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `NH8` | `SEND_USER_FILE_TOOL_NAME` (`"SendUserFile"`) | cli_inner_pretty.js:211424 | constant |
| `nY6` | `SEND_USER_FILE_DESCRIPTION` (`"Send one or more files to the user"`) | cli_inner_pretty.js:211425 | constant |
| `iY6` | `SEND_USER_FILE_PROMPT` (full usage prompt) | cli_inner_pretty.js:211426 | constant |
| `EH8` | `sendUserFileModule` (re-export bundle: SEND_USER_FILE_TOOL_PROMPT, SEND_USER_FILE_TOOL_NAME, DESCRIPTION) | cli_inner_pretty.js:211422-211423 | object |
| `wi7` | `sendUserFileToolModule` (re-export bundle: SendUserFileTool) | cli_inner_pretty.js:385777 | object |
| `fH5` | `sendUserFileTool` (the tool registration object) | cli_inner_pretty.js:385814 | object |
| `zH5` | `buildSendUserFileInputSchema` (yH-wrapped input schema factory) | cli_inner_pretty.js:385793-385803 | function |
| `YH5` | `buildSendUserFileOutputSchema` (yH-wrapped output schema factory) | cli_inner_pretty.js:385804-385813 | function |
| `fi7` | `renderSendUserFileToolUseMessage` (UI renderer for SendUserFile use) | cli_inner_pretty.js:385869 | function |

---

## v2.1.112 → v2.1.142 Tool-Architecture Renames

| Concept | v2.1.112 | v2.1.142 |
|---------|----------|----------|
| Tool factory function | `Iq` | `XK` |
| Tool defaults map | `jy_` | `TI1` |
| Empty permission context | `MD` | `vZ` |
| (file location) | chunks.64.mjs (chunks-style bundle) | cli_inner_pretty.js (consolidated bundle) |

The factory body itself is structurally identical between versions; the identifier change reflects bundling churn rather than semantic change. The defaults table is identical in both versions (`isEnabled→true`, `isConcurrencySafe→false`, `isReadOnly→false`, `isDestructive→false`, `checkPermissions→{allow}`, `toAutoClassifierInput→""`, `userFacingName→""`).

---

**Status**: Consolidated into symbol_index_core_execution.md as of v2.1.142 deobfuscation work.
