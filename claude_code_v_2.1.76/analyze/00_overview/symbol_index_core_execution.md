# Symbol Index - Core Execution (Claude Code 2.1.76)

> Symbol mapping table Part 1: Core execution flow modules
> Lookup: Browse by module, or Ctrl+F search for obfuscated/readable name.
>
> **Cross-validated**: All symbols verified against source code on 2026-03-26.
> **Joint Analysis**: See [cli_ui_llm_joint_complete_v8.md](./cli_ui_llm_joint_complete_v8.md) for the latest comprehensive joint analysis with source-level algorithm restoration.

---

## Quick Navigation

- [State Management](#module-state-management)
- [Agent Loop](#module-agent-loop)
- [LLM API](#module-llm-api)
- [Attachments & Reminders](#module-attachments--reminders)
- [Tools](#module-tools)
- [Agents](#module-agents)
- [Subagent Execution](#module-subagent-execution)
- [Thinking Mode](#module-thinking-mode)

---

## Module: Tools

> Full analysis: [05_tools/](../05_tools/)

### Core Tools

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| L9 | FileReadTool | chunks.90.mjs:2052 | tool object |
| s7 | TOOL_NAME_READ | chunks.56.mjs:173 | constant ("Read") |
| xX | FileWriteTool | chunks.139.mjs:45 | tool object |
| _K | TOOL_NAME_WRITE | chunks.56.mjs:1234 | constant ("Write") |
| pX | EditTool | chunks.170.mjs:1116 | tool object |
| R4 | TOOL_NAME_EDIT | chunks.56.mjs:102 | constant ("Edit") |
| gd | NotebookEditTool | chunks.134.mjs:2615 | tool object |
| bJ | TOOL_NAME_NOTEBOOK_EDIT | chunks.56.mjs:1240 | constant ("NotebookEdit") |
| Vl | NotebookEditTool | chunks.139.mjs:1200 | tool object (primary) |
| bb | GrepTool | chunks.139.mjs:482 | tool object |
| N9 | TOOL_NAME_GREP | chunks.56.mjs:1215 | constant ("Grep") |
| rg | GlobTool | chunks.139.mjs:880 | tool object |
| qz | TOOL_NAME_GLOB | chunks.56.mjs:1192 | constant ("Glob") |
| J4 | BashTool | chunks.172.mjs:84 | tool object |
| Q7 | TOOL_NAME_BASH | chunks.54.mjs:2264 | constant ("Bash") |
| m66 | SkillTool | chunks.137.mjs:46 | tool object |
| wt | SkillTool | chunks.132.mjs:820 | tool object (legacy) |
| oH | TOOL_NAME_SKILL | chunks.90.mjs:2596 | constant ("Skill") |
| QW6 | AgentTool | chunks.136.mjs:1512 | tool object |
| r4 | TOOL_NAME_AGENT | chunks.40.mjs:406 | constant ("Agent") |
| I46 | TOOL_NAME_TASK | chunks.40.mjs:408 | constant ("Task") |
| I46 | TOOL_NAME_TASK (alias) | chunks.40.mjs:408 | constant ("Task") |
| Q7 | TOOL_NAME_BASH | chunks.54.mjs:2264 | constant ("Bash") |
| BYq | BashOutputComponent | chunks.162.mjs:417249 | component |

### Tool Schema Symbols

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| tm9 | readInputSchema | chunks.90.mjs:2000 | function (Zod schema getter) |
| em9 | readOutputSchema | chunks.90.mjs:2005 | function (Zod discriminated union) |
| _LY | writeInputSchema | chunks.139.mjs:27 | function (Zod schema getter) |
| wLY | writeOutputSchema | chunks.139.mjs:30 | function (Zod schema) |
| lV1 | editInputSchema | chunks.138.mjs:1536 | function (Zod schema getter) |
| Pa4 | editOutputSchema | chunks.138.mjs:1547 | function (Zod schema) |
| $LY | grepInputSchema | chunks.139.mjs:457 | function (Zod schema getter) |
| jLY | grepOutputSchema | chunks.139.mjs:473 | function (Zod schema) |
| JLY | globInputSchema | chunks.139.mjs:872 | function (Zod schema getter) |
| MLY | globOutputSchema | chunks.139.mjs:875 | function (Zod schema) |
| nm8 | patchHunkSchema | chunks.138.mjs:1541 | function (Zod schema) |
| Wa4 | editAlternativeSchema | chunks.138.mjs:1564 | function (Zod schema for line-ref edits) |

### File System Constants

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| y21 | CONCURRENT_EDIT_ERROR_MESSAGE | chunks.56.mjs:108 | constant |
| HLY | VCS_DIR_EXCLUSIONS | chunks.139.mjs:472 | constant ([".git", ".svn", ".hg", ".bzr"]) |
| P36 | MAX_PDF_PAGES_PER_REQUEST | chunks.85.mjs:2470 | constant (20) |
| TX1 | MIN_PAGES_FOR_PDF_PROMPT | chunks.85.mjs:2472 | constant (10) |
| XA4 | MAX_SIZE_FOR_PDF_EXTRACTION | chunks.85.mjs:2466 | constant (3145728) |
| Lx6 | DEFAULT_READ_LINES | chunks.56.mjs:175 | constant (2000) |
| R94 | IMAGE_EXTENSIONS_SET | chunks.90.mjs:1999 | Set (["png", "jpg", "jpeg", "gif", "webp"]) |
| Yx3 | PDF_EXTENSIONS_SET | chunks.56.mjs:148 | Set (["pdf"]) |

### File System Helper Functions

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| gw8 | parsePageRange | chunks.56.mjs:110 | function |
| yx6 | isAnthropicApi | chunks.56.mjs:139 | function |
| JD6 | isPdfExtension | chunks.56.mjs:143 | function |

### Edit Tool Symbols

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| Qw6 | getEditToolInputSchema | chunks.134.mjs | function |
| TR7 | getEditToolOutputSchema | chunks.134.mjs | function |
| IF4 | renderEditToolUseMessage | chunks.134.mjs:1234 | function |
| xF4 | renderEditToolProgress | chunks.134.mjs:1246 | function |
| bF4 | renderEditToolResult | chunks.134.mjs:1250 | function |
| uF4 | renderEditToolRejected | chunks.134.mjs:1271 | function |
| BF4 | renderEditToolError | chunks.134.mjs:1320 | function |
| sF4 | renderNotebookEditUseMessage | chunks.134.mjs | function |
| tF4 | renderNotebookEditRejected | chunks.134.mjs | function |
| eF4 | renderNotebookEditError | chunks.134.mjs | function |
| AQ4 | renderNotebookEditProgress | chunks.134.mjs | function |
| qQ4 | renderNotebookEditResult | chunks.134.mjs | function |
| SP6 | DiffViewer | chunks.134.mjs | component |
| ZW1 | EditPreview | chunks.134.mjs | component |
| hP6 | getEditToolUserFacingName | chunks.134.mjs | function |
| SkA | getEditToolSummary | chunks.134.mjs | function |
| gkA | getNotebookEditSummary | chunks.134.mjs | function |
| pu4 | getEditToolPrompt | chunks.134.mjs | function |
| qw1 | generateUnifiedPatch | chunks.57.mjs:249 | function |
| Qx6 | applyEditsAndGeneratePatch | chunks.57.mjs:267 | function |
| sq6 | findExactString | chunks.57.mjs:190 | function |
| uf7 | normalizeQuotes | chunks.57.mjs:174 | function |
| hD6 | adjustNewStringQuotes | chunks.57.mjs:198 | function |
| Em3 | applyStringReplacement | chunks.57.mjs:240 | function |
| zF4 | performLintValidation | chunks.170.mjs | function |
| yEY | getNotebookInputSchema | chunks.134.mjs:2595 | function |
| CEY | getNotebookOutputSchema | chunks.134.mjs | function |
| N51 | checkEditPermissions | chunks.146.mjs | function |
| xP6 | computeGitDiff | chunks.134.mjs | function |
| sQ1 | tryParseAsIndex | chunks.134.mjs | function |
| _A | parseNotebook | chunks.134.mjs | function |

### Bash Tool Security Symbols

> Full analysis: [security_validation.md](../05_tools/security_validation.md)

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| Rp6 | validateBashCommandSync | chunks.91.mjs:2209 | function (main sync entry point) |
| O01 | validateBashCommandAsync | chunks.91.mjs:2272 | function (async with tree-sitter) |
| pY4 | validateJqSecurity | chunks.91.mjs:1507 | function |
| rY4 | validateObfuscatedFlags | chunks.91.mjs:1759 | function |
| QY4 | validateShellMetacharacters | chunks.91.mjs:1537 | function |
| UY4 | validateDangerousVariables | chunks.91.mjs:1568 | function |
| dY4 | validateCommandSubstitution | chunks.91.mjs:1585 | function |
| w01 | validateNewlineInjection | chunks.91.mjs:1635 | function |
| lY4 | validateIfsInjection | chunks.91.mjs:1699 | function |
| iY4 | validateProcEnvironAccess | chunks.91.mjs:1716 | function |
| nY4 | validateMalformedTokens | chunks.91.mjs:1733 | function |
| cY4 | validateCarriageReturn | chunks.91.mjs:1656 | function |
| _01 | validateRedirection | chunks.91.mjs:1611 | function |
| tY4 | validateUnicodeWhitespace | chunks.91.mjs:2040 | function |
| sY4 | validateBraceExpansion | chunks.91.mjs:1978 | function |
| Kz4 | validateZshCommands | chunks.91.mjs:2179 | function |
| oY4 | validateBackslashWhitespace | chunks.91.mjs:1916 | function |
| aY4 | validateBackslashOperators | chunks.91.mjs:1954 | function |
| eY4 | validateMidWordHash | chunks.91.mjs:2056 | function |
| Az4 | validateCommentQuoteDesync | chunks.91.mjs:2075 | function |
| qz4 | validateQuotedNewline | chunks.91.mjs:2129 | function |
| Xg9 | validateSedReadOnly | chunks.91.mjs:2434 | function |
| zz4 | validateSedSubstitution | chunks.91.mjs:2471 | function |
| xW6 | validateSedCommand | chunks.91.mjs:2509 | function |
| w3 | CHECK_IDS | chunks.91.mjs:2394 | object (security check identifiers) |
| wg9 | DANGEROUS_PATTERNS | chunks.91.mjs:2361 | array (command substitution patterns) |
| Og9 | ZSH_DANGEROUS_COMMANDS | chunks.91.mjs:2346 | Set |
| Yz4 | CONTROL_CHARACTERS_REGEX | chunks.91.mjs:2421 | RegExp |
| Dg9 | UNICODE_WHITESPACE_REGEX | chunks.91.mjs:2420 | RegExp |
| Jg9 | SHELL_OPERATORS | chunks.91.mjs:2419 | Set |
| Fz | tokenizeCommand | chunks.91.mjs | function |
| ca | preprocessCommand | chunks.91.mjs | function |
| bY4 | extractQuoteContext | chunks.91.mjs | function |
| X38 | hasSingleQuotedBackslashPattern | chunks.91.mjs | function |
| $g9 | containsCharacter | chunks.91.mjs | function |
| _g9 | hasMalformedTokenPattern | chunks.91.mjs | function |

### Tool Filtering Sets

> Tool availability sets for different execution modes

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| CW6 | EXCLUDED_TOOLS | chunks.91.mjs:269 | Set (TaskOutput, ExitPlanMode, EnterPlanMode, Agent, AskUserQuestion, TaskStop) |
| xV8 | NON_BUILTIN_EXCLUDED | chunks.91.mjs:269 | Set (same as EXCLUDED_TOOLS for non-builtin contexts) |
| eP1 | ASYNC_ALLOWED_TOOLS | chunks.91.mjs:269 | Set (Read, WebSearch, Grep, WebFetch, Glob, TodoWrite, Edit, Write, NotebookEdit, Skill, ...) |
| WY4 | BACKGROUND_AGENT_TOOLS | chunks.91.mjs:269 | Set (TaskCreate, TaskGet, TaskList, TaskUpdate, SendMessage, CronCreate, CronDelete, CronList) |
| Xk8 | filterToolsByMode | chunks.93.mjs:1568 | function (filters tools by mode/async context) |
| _c | resolveToolFilter | chunks.93.mjs:1590 | function (validates tools, handles wildcard, Agent type restrictions) |
| z3 | matchesTool | chunks.56.mjs:1588 | function (checks tool.name or aliases) |

### Tool Name Constants

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| $C | TOOL_NAME_TASK_OUTPUT | chunks.40.mjs:421 | constant ("TaskOutput") |
| aJ | TOOL_NAME_EXIT_PLAN_MODE | chunks.90.mjs:507 | constant ("ExitPlanMode") |
| dt | TOOL_NAME_ENTER_PLAN_MODE | chunks.90.mjs:3121 | constant ("EnterPlanMode") |
| r4 | TOOL_NAME_AGENT | chunks.40.mjs:406 | constant ("Agent") |
| Fw | TOOL_NAME_ASK_USER_QUESTION | chunks.90.mjs:3123 | constant ("AskUserQuestion") |
| OC | TOOL_NAME_TASK_STOP | chunks.40.mjs:412 | constant ("TaskStop") |
| s7 | TOOL_NAME_READ | chunks.56.mjs:173 | constant ("Read") |
| jv | TOOL_NAME_WEB_SEARCH | chunks.56.mjs:1287 | constant ("WebSearch") |
| N9 | TOOL_NAME_GREP | chunks.56.mjs:1215 | constant ("Grep") |
| sO | TOOL_NAME_WEB_FETCH | chunks.56.mjs:80 | constant ("WebFetch") |
| qz | TOOL_NAME_GLOB | chunks.56.mjs:1192 | constant ("Glob") |
| MB | TOOL_NAME_TODO_WRITE | chunks.84.mjs:1401 | constant ("TodoWrite") |
| R4 | TOOL_NAME_EDIT | chunks.56.mjs:102 | constant ("Edit") |
| _K | TOOL_NAME_WRITE | chunks.56.mjs:1234 | constant ("Write") |
| bJ | TOOL_NAME_NOTEBOOK_EDIT | chunks.56.mjs:1240 | constant ("NotebookEdit") |
| oH | TOOL_NAME_SKILL | chunks.90.mjs:2596 | constant ("Skill") |
| TR | TOOL_NAME_TASK_CREATE | chunks.90.mjs:2592 | constant ("TaskCreate") |
| lt | TOOL_NAME_TASK_GET | chunks.91.mjs:41 | constant ("TaskGet") |
| it | TOOL_NAME_TASK_LIST | chunks.91.mjs:43 | constant ("TaskList") |
| ck | TOOL_NAME_TASK_UPDATE | chunks.90.mjs:2594 | constant ("TaskUpdate") |
| hI | TOOL_NAME_SEND_MESSAGE | chunks.91.mjs:39 | constant ("SendMessage") |
| ER | TOOL_NAME_CRON_CREATE | chunks.91.mjs:192 | constant ("CronCreate") |
| ed | TOOL_NAME_CRON_DELETE | chunks.91.mjs:194 | constant ("CronDelete") |
| SW6 | TOOL_NAME_CRON_LIST | chunks.91.mjs:196 | constant ("CronList") |
| jg9 | hasBackslashEscapedWhitespace | chunks.91.mjs | function |
| Mg9 | hasBackslashEscapedOperator | chunks.91.mjs | function |
| n36 | isEscapedBackslash | chunks.91.mjs | function |
| Gg9 | hasDangerousSedPattern | chunks.91.mjs | function |
| Wg9 | hasMultipleInputFiles | chunks.91.mjs | function |
| Zg9 | extractSedExpressions | chunks.91.mjs | function |
| _z4 | validateAllFlagsAllowed | chunks.91.mjs | function |
| Pg9 | isValidPrintCommand | chunks.91.mjs | function |

### File System Tool Symbols

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| g4 | resolvePath | chunks.10.mjs:1159 | function |
| L4 | resolvePath | chunks.10.mjs | function (alias) |
| p61 | hasParentTraversal | chunks.10.mjs:1187 | function |
| Gj | checkPathDenyRule | chunks.174.mjs:692 | function |
| ZX | checkPathDenyRule | chunks.139.mjs | function (alias) |
| ro | checkReadPermissions | chunks.146.mjs | function |
| gt | checkReadPermissions | chunks.90.mjs:2113 | function |
| Xz6 | checkEditPermissions | chunks.139.mjs | function |
| Ia4 | analyzeConversationMemoryUsage | chunks.146.mjs:2147 | function |
| OmY | fileReadInputSchema | chunks.146.mjs:1706 | variable |
| dBY | fileWriteInputSchema | chunks.146.mjs:419 | variable |
| $LY | grepInputSchema | chunks.139.mjs:524 | getter function |
| JLY | globInputSchema | chunks.139.mjs:897 | getter function |
| mP6 | findSimilarFile | chunks.146.mjs | function |
| OU1 | MAX_FILE_SIZE_BYTES | chunks.146.mjs | constant |
| P36 | MAX_PDF_PAGES_PER_REQUEST | chunks.85.mjs:2470 | constant (20) |
| TX1 | MIN_PAGES_FOR_PAGE_RANGE_PROMPT | chunks.85.mjs:2472 | constant (10) |
| XA4 | MAX_SIZE_FOR_PDF_EXTRACTION | chunks.85.mjs:2466 | constant (3145728) |
| GP1 | getPdfPageCount | chunks.90.mjs | function |
| UN8 | extractPdfPages | chunks.90.mjs | function |
| N34 | readPdfAsBase64 | chunks.90.mjs | function |
| Qd | detectLineEnding | chunks.134.mjs | function |
| AX | detectEncoding | chunks.134.mjs | function |
| ft | writeFileWithEncoding | chunks.134.mjs | function |
| aW | getMtime | chunks.174.mjs:1163 | function |
| TW1 | findSkillDirTriggers | chunks.134.mjs | function |
| vW1 | refreshSkillDirs | chunks.134.mjs | function |
| EW1 | clearFileWatcherCache | chunks.134.mjs | function |
| Fd | diagnosticsManager | chunks.134.mjs | object |
| $J | readFileSyncWithEncoding | chunks.134.mjs | function |
| ty1 | CONCURRENT_EDIT_ERROR_MESSAGE | chunks.134.mjs | constant |
| z2 | isFileHistoryEnabled | chunks.134.mjs | function |
| Xt | saveFileHistoryEntry | chunks.134.mjs | function |
| EEY | getParentDirectory | chunks.134.mjs | function |
| _t | updateGitWatcherCache | chunks.134.mjs | function |
| kEY | PATH_SEP | chunks.134.mjs | constant |
| eS | recordFileOperation | chunks.134.mjs | function |
| BJq | getPermissionRules | chunks.174.mjs | function |
| SJq | ignore (library) | chunks.174.mjs | library |
| hJq | getRelativePath | chunks.174.mjs | function |
| Jf | PATH_SEP (permission) | chunks.174.mjs | constant |

## Module: Agent Loop

> Full analysis: [03_llm_core/agent_loop.md](../03_llm_core/agent_loop.md)

### Main Loop Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Yh | mainAgentLoop | chunks.148.mjs:875 | async generator |
| omY | mainAgentLoopCore | chunks.148.mjs:882 | async generator (inner implementation) |
| ui6 | StreamingToolExecutor | chunks.148.mjs:3 | class |
| Wi6 | toolDispatcher | chunks.146.mjs:285 | async generator |
| RKq | getSessionGates | chunks.148.mjs:816 | function |
| SKq | getModelCallHelpers | chunks.148.mjs:834 | function (returns {callModel, microcompact, autocompact, uuid}) |
| NT6 | callModel | chunks.170.mjs:2009 | async generator (wrapper, delegates to mGq) |
| mGq | streamingQueryCore | chunks.171.mjs:3 | async generator (full streaming implementation) |
| pg | microcompact | chunks.133.mjs:991 | function (removes consecutive duplicate messages) |
| sqq | autoCompact | chunks.147.mjs:2633 | function (summarizes conversation when over threshold) |
| aqq | MAX_CONSECUTIVE_COMPACT_FAILURES | chunks.147.mjs:2686 | constant (3) - circuit breaker threshold |
| $54 | parseContextOverflowError | chunks.89.mjs:110 | function (extracts token counts from error) |
| fN8 | FLOOR_OUTPUT_TOKENS | chunks.89.mjs:217 | constant (3000) - minimum output tokens |
| nmY | generateUUID | chunks.148.mjs:839 | function (via SKq) |
| rmY | MAX_OUTPUT_TOKENS_RECOVERY | chunks.148.mjs:1418 | constant (3) |
| bKq | isMaxOutputTokens | chunks.148.mjs:871 | function (checks if message hit max_tokens) |
| _P1 | withApiRetry | chunks.89.mjs:3 | async generator (retry wrapper with context overflow recovery) |
| fxY | executeToolCore | chunks.146.mjs:442 | async function (core tool execution pipeline) |
| y4q | executePreToolHooks | chunks.146.mjs | async generator (pre-tool hook execution) |
| PE1 | normalizeToolInput | chunks.146.mjs:240 | function (handles string->typed conversions) |
| dK | findToolByName | chunks.56.mjs:1592 | function (tool definition lookup by name/alias) |
| Wm | cloneAbortController | chunks.148.mjs:16 | function (creates sibling abort controller) |
| umY | removeToolFromInProgress | chunks.148.mjs:230 | function (removes tool ID from in-progress set) |
| X1 | getGlobalState | chunks.148.mjs:multiple | function (access global React state) |
| K5 | recordPerformanceMark | chunks.148.mjs:250 | function (performance tracking) |

### Streaming & SSE Processing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ff8 | withMessageCollector | chunks.170.mjs:1990 | async generator wrapper |
| MI | buildApiParams | chunks.170.mjs | function (constructs API request parameters) |
| O9z | buildStreamingRequest | chunks.171.mjs | function (builds streaming request object) |
| w9z | getStreamingConfig | chunks.171.mjs | function (returns streaming configuration) |
| iA | isAPIKeyAuth | chunks.171.mjs:4 | function (checks if using API key) |
| rR | getFeatureFlag | chunks.171.mjs:4 | function (GrowthBook feature flag) |
| QA | getPlatform | chunks.171.mjs:11 | function (returns "firstParty"|"bedrock"|"vertex") |
| G31 | resolveInferenceProfile | chunks.171.mjs:11 | async function (Bedrock profile resolution) |
| A9z | getLastAssistantRequestId | chunks.170.mjs:2059 | function (finds last request ID for caching) |
| cM | normalizeMessages | chunks.173.mjs:1999 | function (message normalization for API) |
| TTq | deduplicateContent | chunks.173.mjs:2195 | function (removes duplicate content blocks) |
| an8 | mergeUserMessages | chunks.173.mjs:2182 | function (combines consecutive user messages) |
| Mzz | mergeAssistantMessages | chunks.173.mjs:2165 | function (combines assistant message chunks) |
| Dzz | hasToolResult | chunks.173.mjs:2175 | function (checks if user message has tool_result) |
| YS1 | ensureArray | chunks.173.mjs | function (ensures content is array) |
| JM | flattenMessages | chunks.173.mjs:1516 | function (flattens nested message structures, preserves isMeta, extends UUIDs) |
| Xn8 | normalizeUserMessage | chunks.173.mjs:1852 | function (user message normalization) |
| BGq | normalizeAssistantMessage | chunks.173.mjs:1879 | function (assistant message normalization) |
| gGq | addCacheControlsToMessages | chunks.174.mjs:829 | function (adds cache_control to messages) |
| q9z | trimImageCount | chunks.170.mjs:2075 | function (removes excess images from context) |
| Uh1 | isImageOrDocument | chunks.170.mjs:2067 | function (type guard) |
| xGq | isToolResult | chunks.170.mjs:2071 | function (type guard) |
| zF | extractReferencedTools | chunks.171.mjs:21 | function (finds tools mentioned in messages) |
| GX | isDeferredTool | chunks.171.mjs | function (checks if tool is deferred) |
| z3 | hasDeferredMarker | chunks.171.mjs | function (checks for HZ marker) |
| HZ | DEFERRED_TOOL_MARKER | chunks.171.mjs | constant ("deferred") |
| yi6 | shouldUseDynamicLoading | chunks.169.mjs:433 | async function (determines dynamic/tool search mode) |
| Sh1 | buildToolSchema | chunks.170.mjs:1452 | async function (constructs tool schema for API) |
| uq | buildSystemPromptFromSections | chunks.168.mjs | function (assembles system prompt) |
| _9z | buildSystemPromptBlocks | chunks.171.mjs:799 | function (wrapper that adds cache_control; calls Jn8) |
| Jn8 | formatSystemPromptBlocks | chunks.170.mjs:1483 | function (core system prompt formatter with cache scopes) |
| PA4 | MAX_IMAGES_IN_CONTEXT | chunks.170.mjs | constant (20) |
| VKq | executeStopHooks | chunks.148.mjs:621 | async generator (runs Stop hooks after turn) |
| Lp8 | executeStopHooksCore | chunks.148.mjs | async generator (core hook execution) |
| dh1 | processContentBlocks | chunks.173.mjs:2267 | function (processes content blocks from API response) |
| fp6 | formatDeferredToolHint | chunks.90.mjs:2274 | function (formats tool name for deferred tools hint) |
| Li6 | getDefaultMaxTokens | chunks.171.mjs:908 | function (gets default max output tokens for model) |
| lg | stripAnsiCodes | chunks.176.mjs:1469 | function (removes ANSI codes from model name) |
| kE1 | DEFERRED_TOOLS_INSTRUCTION | chunks.146.mjs:2508 | constant (instruction for loading deferred tools) |
| Dn8 | generateUUID | chunks.148.mjs:839 | function (via SKq, creates unique identifiers) |

> **CORRECTION:** Previous versions incorrectly listed `NT6` location as chunks.148.mjs:836.
> The actual `NT6` (callModel) is defined at chunks.170.mjs:2009 and is a thin wrapper.
> The value chunks.148.mjs:836 is where `SKq` references `NT6`, not where it's defined.
> The full streaming implementation is in `mGq` (streamingQueryCore) at chunks.171.mjs:3.

### Tool Execution Symbols

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| kq | createHookMessage | chunks.142.mjs:2615 | function |
| ng | getDynamicToolSet | chunks.145.mjs:2781 | function (returns all built-in tools) |
| dK | findTool | chunks.56.mjs:1592 | function (finds tool by name/alias) |
| z3 | matchesToolNameOrAlias | chunks.56.mjs:1588 | function (helper for dK) |
| Tv | findTool | chunks.74.mjs:1392 | function (older version) |
| d39 | toolMatchesName | chunks.74.mjs:1388 | function |
| U1q | formatIncomingCallsResult | chunks.144.mjs:284 | function (LSP call hierarchy) |
| TIY | getUniqueOutgoingFileCount | chunks.144.mjs:832 | function (count unique files in outgoing calls) |
| vIY | getUniqueIncomingFileCount | chunks.144.mjs:837 | function (count unique files in incoming calls) |
| dK | findToolInSet | chunks.146.mjs | function |

> **CORRECTION:** The symbol `YP6` was incorrectly documented as `assembleSessionToolSet`.
> The actual `YP6` (chunks.69.mjs:235) is the `debug` library's namespace function (used for logging).
> Tool set assembly is performed by `Xk8` (filterToolsForSubagent) and internal functions.

| p1 | createUserMessage | chunks.173.mjs:1378 | function |
| f4 | createAttachmentMessage | chunks.145.mjs | function |
| rk | isMcpTool | chunks.145.mjs | function |
| V4q | formatValidationError | chunks.145.mjs:3054 | function |

### Tool Execution Lifecycle

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ui6 | StreamingToolExecutor | chunks.148.mjs:3 | class |
| Wm | cloneAbortController | chunks.148.mjs:16 | function (creates sibling abort controller) |
| Wi6 | toolDispatcher | chunks.146.mjs:285 | async generator |
| ZxY | toolExecutionOrchestrator | chunks.146.mjs:391 | async generator (queued iterator) |
| fxY | toolExecutionPipeline | chunks.146.mjs:442 | async function (8-stage pipeline) |
| y4q | executePreToolHooksIterator | chunks.146.mjs:74 | async generator |
| k4q | executePostToolHooksIterator | chunks.145.mjs:3107 | async generator |
| E4q | executePostToolFailureHooksIterator | chunks.146.mjs:3 | async generator |
| GE1 | batchToolExecutor | chunks.146.mjs:1024 | async generator |
| LF8 | executePreToolHooks | chunks.175.mjs:2462 | async generator |
| RF8 | executePostToolHooks | chunks.175.mjs:2486 | async generator |
| hF8 | executePostToolFailureHooks | chunks.175.mjs:2505 | async generator |
| Ax | executeHooksIterator | chunks.175.mjs | async generator |
| Pi6 | AsyncQueue | chunks.146.mjs | class |
| NS1 | hasHooksForEvent | chunks.175.mjs | function |
| yF8 | formatHookBlockingError | chunks.175.mjs | function |
| umY | clearInProgressToolUseID | chunks.148.mjs:230 | function |
| C4q | createToolProgressMessage | chunks.172.mjs:2943 | function (progress attachment factory) |
| GxY | getDeferredToolSchemaHint | chunks.146.mjs:432 | function |
| PE1 | applyInputParamAliases | chunks.146.mjs:240 | function |
| XxY | formatErrorForTelemetry | chunks.146.mjs:229 | function |
| R4q | getNextImagePasteId | chunks.146.mjs:257 | function |
| h4q | getMcpServerFromToolName | chunks.146.mjs:266 | function |
| PxY | getMcpServerType | chunks.146.mjs:273 | function |
| WxY | getMcpServerBaseUrl | chunks.146.mjs:279 | function |

### Tool Coordination Symbols

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| readFileState | readFileState | chunks.149.mjs:2603 | Map (file cache) |
| CW6 | BACKGROUND_AGENT_EXCLUDED_TOOLS | chunks.91.mjs:269 | Set (tools excluded from background agents) |
| xV8 | ASYNC_AGENT_EXCLUDED_TOOLS | chunks.91.mjs:269 | Set (copy of CW6) |
| eP1 | ASYNC_AGENT_ALLOWED_TOOLS | chunks.91.mjs:269 | Set (tools allowed for async agents) |
| WY4 | TEAM_DELEGATE_TOOLS | chunks.91.mjs:269 | Set (team/cron tools for delegates) |
| Ufq | SAFE_TOOLS | chunks.172.mjs:2502 | Set (safe tools for plan mode) |
| LYz | FILE_MODIFICATION_TOOLS | chunks.172.mjs:2502 | Set (Write, Edit, NotebookEdit) |
| D$$ | ALL_TOOLS_COMBINED | chunks.172.mjs:2502 | Set (Ufq + LYz) |
| GY4 | ALL_SAFE_TOOLS | chunks.91.mjs:305 | Set (Read, Write, Edit, Glob, Grep, Bash, NotebookEdit) |
| Xk8 | filterToolsForSubagent | chunks.93.mjs:1568 | function |
| yp | cloneMap | chunks.149.mjs | function |
| Jh | parseMcpToolName | chunks.149.mjs | function |
| VD | parseMcpToolNameVariant | chunks.149.mjs | function |

### Task Management Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Uk1 | TaskStopTool | chunks.143.mjs:1651 | tool object |
| vW6 | TaskStopTool (legacy) | chunks.139.mjs:1537 | tool object |
| OC | TOOL_NAME_TASK_STOP | chunks.40.mjs:412 | constant ("TaskStop") |
| ck1 | TaskOutputTool | chunks.143.mjs:2036 | tool object |
| kW6 | TaskOutputTool (legacy) | chunks.139.mjs:1922 | tool object |
| $C | TOOL_NAME_TASK_OUTPUT | chunks.40.mjs:421 | constant ("TaskOutput") |
| TAq | TaskCreateTool | chunks.144.mjs:2839 | tool object |
| TR | TOOL_NAME_TASK_CREATE | chunks.90.mjs:2592 | constant ("TaskCreate") |
| hAq | TaskGetTool | chunks.144.mjs:2991 | tool object |
| lt | TOOL_NAME_TASK_GET | chunks.91.mjs:41 | constant ("TaskGet") |
| rAq | TaskListTool | chunks.145.mjs:417 | tool object |
| it | TOOL_NAME_TASK_LIST | chunks.91.mjs:43 | constant ("TaskList") |
| gAq | TaskUpdateTool | chunks.145.mjs:136 | tool object |
| ck | TOOL_NAME_TASK_UPDATE | chunks.90.mjs:2594 | constant ("TaskUpdate") |
| EW6 | buildTaskSnapshot | chunks.139.mjs:1687 | function |
| Ng1 | truncateTaskOutput | chunks.139.mjs:1664 | function |
| nyY | pollUntilDone | chunks.139.mjs:1716 | function |
| gk1 | getKillHandlerForType | chunks.143.mjs:1513 | function |
| ICY | getAllKillHandlers | chunks.143.mjs:1509 | function |
| Qk1 | stopTask | chunks.143.mjs:1580 | function |
| Lf6 | LocalBashTask | chunks.133.mjs:2542 | kill handler |
| Fk1 | LocalAgentTask | chunks.146.mjs:2292 | kill handler |
| Fn4 | RemoteAgentTask | chunks.136.mjs:1175 | kill handler |
| Gf | isBashTask | chunks.143.mjs | function |
| wQ6 | killBashTask | chunks.143.mjs | function |

### Tool Interface Patterns

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| AK | sanitizeToolName | chunks.149.mjs | function |
| KhA | createCancelledToolResult | chunks.149.mjs | function |
| _M1 | CANCELLED_MESSAGE | chunks.149.mjs | constant |
| si7 | recordToolOperation | chunks.149.mjs | function |
| An7 | recordToolOutput | chunks.149.mjs | function |
| ti7 | startToolOperationTimer | chunks.149.mjs | function |
| ei7 | endToolOperationTimer | chunks.149.mjs | function |
| mMA | reportPermissionDecision | chunks.149.mjs | function |
| qJ6 | updateFileAttribution | chunks.149.mjs | function |
| FMA | trackToolSuccess | chunks.149.mjs | function |
| Jn1 | recordToolDuration | chunks.149.mjs | function |
| cb1 | getFileExtension | chunks.149.mjs | function |
| ax7 | getBashFileExtension | chunks.149.mjs | function |
| rx7 | isMcpTelemetryEnabled | chunks.149.mjs | function |
| ox7 | getSkillName | chunks.149.mjs | function |
| vB | shouldIncludeMcpMetadata | chunks.149.mjs | function |
| P5 | extractServerName | chunks.149.mjs | function |

### Tool Discovery Symbols

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| tD | getDefaultTools | chunks.141.mjs:1505 | function |
| hg1 | filterToolsByRules | chunks.141.mjs:1469 | function |
| tU | getPermissionRules | chunks.174.mjs | function |
| O$ | isFilteringDisabled | chunks.141.mjs | function |
| Sx | uniqueBy | chunks.141.mjs | function |
| BW | isMcpToolByName ⚠ | chunks.89.mjs:607 | function |
| dM | TOOL_SEARCH_NAME | chunks.89.mjs:652 | constant ("ToolSearch") |
| dp7 | TOOL_SEARCH_PROMPT | chunks.89.mjs:654 | constant |
| E_6 | generateDeferredToolsPrompt ⚠ | chunks.89.mjs:618 | function |
| GX | isDeferredOrMcpTool | chunks.90.mjs:2260 | function |
| p94 | parseMcpToolName | chunks.90.mjs:2355 | function |
| pp7 | DEFERRED_TOOLS_HEADER | chunks.89.mjs:728 | constant |
| v_6 | shouldShowToolNamesInMessages | chunks.89.mjs:612 | function |
| x8 | getFeatureFlag | chunks.89.mjs | function |
| yv9 | TEST_MODE_DEFERRED_TOOLS | chunks.89.mjs:734 | constant |
| ca | cachedDeferredPrompt | chunks.89.mjs | variable |

> ⚠ BW (isMcpToolByName) and E_6 (generateDeferredToolsPrompt): claimed locations (chunks.89.mjs:607-618) show template literal strings in source, not function definitions. Actual MCP detection uses p94 and GX at chunks.90.mjs.

### Rendering Symbols

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| SfY | renderToolUseResult | chunks.130.mjs:3 | function |
| tx4 | renderToolUseSummary | chunks.130.mjs:91 | function |
| rK1 | StatusIndicator | chunks.130.mjs | component |
| z5 | ToolResultDisplay | chunks.130.mjs | component |
| AE | FilePathBreadcrumb | chunks.134.mjs | component |
| HA | Box | chunks.134.mjs | component |
| I | Box | chunks.134.mjs | component |
| V | Text | chunks.134.mjs | component |
| VN | CodeBlock | chunks.134.mjs | component |
| aS | LineCounter | chunks.134.mjs | component |
| Lf6 | LocalBashTaskHandler | chunks.133.mjs:2542 | object (kill handler) |
| Fk1 | LocalAgentTaskHandler | chunks.146.mjs:2292 | object (kill handler) |
| Fn4 | RemoteAgentTaskHandler | chunks.136.mjs:1175 | object (kill handler) |
| wQ6 | killBashTask | chunks.95.mjs:1918 | function |
| x66 | triggerAbortSignal | chunks.146.mjs:2012 | function |
| i9 | atomicUpdateTask | chunks.90.mjs:3003 | function |
| Zf | registerTask | chunks.90.mjs:3019 | function |
| VR | removeTask | chunks.90.mjs:3037 | function |
| EV8 | getRunningTasks | chunks.90.mjs:3053 | function |
| wY4 | pollTaskOutputs | chunks.90.mjs:3058 | function |
| OY4 | updateTaskOffsets | chunks.90.mjs:3087 | function |

> **CORRECTIONS:**
> - `na` was incorrectly documented as `killTask`. It is actually a diff function (`wf7.diff`) at chunks.56.mjs:2072.
>   Correct kill functions are `x66` (triggerAbortSignal) and `U4q` (killAllLocalAgents).
> - `c5` was incorrectly documented as `atomicUpdateTask`. The correct symbol is `i9` at chunks.90.mjs:3003.
> - `bZ` was incorrectly documented as `registerTaskInState`. The correct symbol is `Zf` at chunks.90.mjs:3019.
| dyY | taskStopInputSchema | chunks.139.mjs:1528 | variable |
| cyY | taskStopOutputSchema | chunks.139.mjs:1531 | variable |
| iyY | taskOutputInputSchema | chunks.139.mjs:1916 | variable |

### Structured Task Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| lt | TOOL_NAME_TASK_GET | chunks.91.mjs:41 | constant ("TaskGet") |
| it | TOOL_NAME_TASK_LIST | chunks.91.mjs:43 | constant ("TaskList") |
| Nh | TOOL_NAME_TASK_CREATE | chunks.88.mjs:371 | constant ("TaskCreate") |
| ck | TOOL_NAME_TASK_UPDATE | chunks.90.mjs:2594 | constant ("TaskUpdate") |
| MB | TOOL_NAME_TODO_WRITE | chunks.84.mjs:1401 | constant ("TodoWrite") |
| WM | getTaskList | chunks.140.mjs | function |
| lg | findTaskById | chunks.140.mjs | function |
| n_1 | createTask | chunks.140.mjs | function |
| sq6 | deleteTask | chunks.141.mjs | function |

### Team/Swarm Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| vh | TOOL_NAME_TEAM_CREATE | chunks.89.mjs:588 | constant ("TeamCreate") |
| VK1 | TOOL_NAME_TEAM_DELETE | chunks.89.mjs:590 | constant ("TeamDelete") |
| hI | TOOL_NAME_SEND_MESSAGE | chunks.91.mjs:39 | constant ("SendMessage") |
| l8 | isAgentTeamsEnabled | chunks.141.mjs | function |

### Cron Tools (v2.1.76)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TbY | CronCreateTool | chunks.145.mjs:950 | tool object |
| ER | TOOL_NAME_CRON_CREATE | chunks.91.mjs:192 | constant ("CronCreate") |
| VbY | CronDeleteTool | chunks.145.mjs:1066 | tool object |
| ed | TOOL_NAME_CRON_DELETE | chunks.91.mjs:194 | constant ("CronDelete") |
| ybY | CronListTool | chunks.145.mjs:1173 | tool object |
| SW6 | TOOL_NAME_CRON_LIST | chunks.91.mjs:196 | constant ("CronList") |
| ji6 | parseCronExpression | chunks.145.mjs:543-559 | function (parses 5-field cron) |
| IT6 | getNextCronMatch | chunks.145.mjs:792-797 | function (calculates next fire time) |
| CT6 | formatCronHumanReadable | chunks.145.mjs:613-651 | function (human-readable schedule) |
| kR | isKairosCronEnabled | chunks.91.mjs:186-188 | function (feature flag check) |

### Plan Mode Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ki6 | EnterPlanModeTool | chunks.144.mjs:1579 | tool object |
| N_6 | TOOL_NAME_ENTER_PLAN_MODE | chunks.89.mjs:564 | constant ("EnterPlanMode") |
| dt | TOOL_NAME_ENTER_PLAN_MODE (alt) | chunks.90.mjs:3121 | constant ("EnterPlanMode") |
| zD | ExitPlanModeTool | chunks.143.mjs:2802 | tool object |
| bW | TOOL_NAME_EXIT_PLAN_MODE | chunks.88.mjs:76 | constant ("ExitPlanMode") |
| aJ | TOOL_NAME_EXIT_PLAN_MODE (alt) | chunks.90.mjs:507 | constant ("ExitPlanMode") |
| TH | TOOL_NAME_ASK_USER_QUESTION | chunks.89.mjs:566 | constant ("AskUserQuestion") |
| Fw | TOOL_NAME_ASK_USER_QUESTION (alt) | chunks.90.mjs:3123 | constant ("AskUserQuestion") |
| kT6 | AskUserQuestionTool | chunks.143.mjs:3135 | tool object |
| Qp7 | ASK_QUESTION_DESCRIPTION | chunks.89.mjs:570 | constant |
| gp7 | ASK_QUESTION_PROMPT | chunks.89.mjs:572 | constant |
| Fp7 | MAX_QUESTIONS | chunks.89.mjs:568 | constant (12) |
| xv | TodoWriteTool | chunks.84.mjs:1970 | tool object |
| MB | TOOL_NAME_TODO_WRITE | chunks.84.mjs:1401 | constant ("TodoWrite") |
| - | TOOL_NAME_EXIT_WORKTREE | chunks.89.mjs | constant ("ExitWorktree") |
| - | ExitWorktreeTool | chunks.139.mjs | tool object |

**Plan file write bypass:** Write/Edit tools use `checkEditPermissions` (N51, line 123 / Xz6, line 191)
to return `{behavior: "allow"}` for plan file paths, bypassing the plan mode restriction.
See tools_filtering.md §7 and 16_file_system/overview.md §3.

### Skill & ToolSearch Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| m66 | SkillTool | chunks.137.mjs:46 | tool object |
| wt | SkillTool (legacy) | chunks.132.mjs:820 | tool object |
| oH | TOOL_NAME_SKILL | chunks.90.mjs:2596 | constant ("Skill") |
| $kY | isSafePromptSkill | chunks.136.mjs:2516 | function (auto-allow check) |
| OkY | SAFE_SKILL_FIELDS | chunks.137.mjs:274 | Set (allowed skill fields) |
| G66 | findSkillByName | chunks.136.mjs | function |
| dM | TOOL_NAME_TOOL_SEARCH | chunks.89.mjs:652 | constant ("ToolSearch") |
| pp7 | DEFERRED_TOOLS_HEADER | chunks.89.mjs:654 | constant |
| dp7 | TOOL_SEARCH_DESCRIPTION | chunks.89.mjs:654 | constant |
| ca | cachedDeferredPrompt | chunks.89.mjs:650 | variable |
| v_6 | isTestMode | chunks.89.mjs:612 | function |

### Agent/Task Tool Symbols

> See also: [Agent Loop Runner Symbols](#agent-loop-runner-symbols) for `qh`, `Yh`, `Bc6`, etc.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| QW6 | AgentTool | chunks.136.mjs:1512 | tool object |
| r4 | TOOL_NAME_AGENT | chunks.40.mjs:406 | constant ("Agent") |
| I46 | TOOL_NAME_TASK (alias) | chunks.40.mjs:408 | constant ("Task") |
| R31 | TOOL_NAME_VERIFICATION | chunks.40.mjs:410 | constant ("verification") |
| aVY | agentInputSchema | chunks.136.mjs:1444 | function (base schema) |
| sVY | teammateInputSchema | chunks.136.mjs:1451 | function (teammate schema) |
| xx8 | getMergedInputSchema | chunks.136.mjs:1461 | function (merged schema) |
| eVY | agentOutputSchema | chunks.136.mjs:1492 | function |
| tVY | completedResultSchema | chunks.136.mjs:1468 | variable |
| UEA | buildAgentResult | chunks.131.mjs:2514 | function |
| KNY | resolveTeamName | chunks.131.mjs:2546 | function |
| MM | isInProcessTeammate | chunks.48.mjs:234 | function |
| ww | getOutputFilePath | chunks.41.mjs:2248 | function |
| eu1 | getTasksDir | chunks.89.mjs | function |
| xZ | prefixAgentId | chunks.89.mjs | function |
| oV | createTaskId | chunks.41.mjs:2410 | function |
| RG | createTaskRecord | chunks.41.mjs:2418 | function |
| qn4 | spawnTeammate | chunks.135.mjs:1116 | function |
| pNY | spawnTeammateDispatcher | chunks.135.mjs:1110 | function |
| dVY | spawnSplitPaneTeammate | chunks.129.mjs | function |
| rVY | BACKGROUND_HINT_THRESHOLD | chunks.136.mjs:1379 | constant (2000ms) |
| - | backgroundAgentFlag | chunks.132.mjs | constant (background: true flag) |

> **CORRECTION:** The symbol `iVY` was incorrectly documented as `spawnTeammateDispatcher`.
> The actual `iVY` is `fs.promises` from Node.js (used as `iVY.access` for file access checks).
> The correct symbol for `spawnTeammateDispatcher` is `pNY` (chunks.135.mjs:1110).
> The correct symbol for `spawnTeammate` is `qn4` (chunks.135.mjs:1116).
>
> **CORRECTION:** The symbol `nVY` was incorrectly documented as `BACKGROUND_HINT_THRESHOLD`.
> The actual `nVY` is `proactiveController` (chunks.136.mjs:1377), used in agent loop context.
> The correct symbol for `BACKGROUND_HINT_THRESHOLD` is `rVY` (chunks.136.mjs:1379, value: 2000).

### Teammate Mailbox Symbols

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| wl | readMailbox | chunks.132.mjs:3 | function |
| x3 | writeToMailbox | chunks.132.mjs:22 | function |
| Vc6 | markMessageAsReadByIndex | chunks.132.mjs:57 | function |
| kc6 | markMessagesAsRead | chunks.132.mjs:92 | function |
| pY6 | readUnreadMessages | chunks.132.mjs:16 | function |
| $TY | clearMailbox | chunks.132.mjs:128 | function |
| HTY | formatMailboxMessages | chunks.132.mjs:141 | function |
| FY6 | getInboxPath | chunks.131.mjs:2849 | function |
| OTY | ensureInboxDirectoryExists | chunks.131.mjs:2858 | function |
| Nc6 | properLockfile | chunks.132.mjs:437 | import |
| iv1 | lockOptions | chunks.132.mjs:463 | object |

### Teammate Shutdown Symbols

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| YxY | handleShutdownApproval | chunks.145.mjs:2443 | function |
| zxY | handleShutdownRejection | chunks.145.mjs | function |
| Wf6 | createShutdownRequest | chunks.132.mjs:261 | function |
| Gx8 | createShutdownApproved | chunks.132.mjs:271 | function |
| fx8 | createShutdownRejected | chunks.132.mjs:282 | function |
| M66 | parseShutdownRequest | chunks.132.mjs:312 | function |
| Lf | parseShutdownApproved | chunks.132.mjs:328 | function |
| bZ1 | killInProcessTeammate | chunks.113.mjs:1272 | function |

### Teammate Message Types

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ec6 | createIdleNotification | chunks.132.mjs:153 | function |
| yc6 | parseIdleNotification | chunks.132.mjs:166 | function |
| Xx8 | createPermissionRequest | chunks.132.mjs:174 | function |
| Px8 | createPermissionResponse | chunks.132.mjs:187 | function |

### Agent Loop Runner Symbols

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| qh | agentLoopRunner | chunks.133.mjs:1565 | function (generator) |
| Yh | mainAgentLoop | chunks.148.mjs:875 | async generator (main entry point) |
| omY | mainAgentLoopCore | chunks.148.mjs:882 | async generator (implementation) |
| ui6 | StreamingToolExecutor | chunks.148.mjs:3 | class (parallel tool execution) |
| Wi6 | toolDispatcher | chunks.146.mjs:285 | async generator |
| fxY | executeToolCore | chunks.146.mjs:442 | async function |
| Bc6 | deriveToolUseContext | chunks.148.mjs:1978 | function |
| Fx8 | cloneForkContext | chunks.133.mjs:1788 | function |
| vvY | buildAgentSystemPrompt | chunks.133.mjs:1806 | function |
| DI | cloneMap | chunks.84.mjs:65 | function |
| bI | generateAgentId | chunks.93.mjs:1557 | function |
| C01 | resolveModelConfig | chunks.93.mjs:1476 | function |
| r24 | registerAgentHooks | chunks.95.mjs:1842 | function |
| zZ6 | deregisterAgentHooks | chunks.95.mjs:1830 | function |
| TvY | isTranscriptableMessage | chunks.133.mjs:1561 | function |
| X66 | runWithAgentIdentity | chunks.133.mjs:841 | function |
| Tf6 | getCurrentAgentIdentity | chunks.133.mjs:837 | function |
| mc4 | agentIdentityStorage | chunks.133.mjs:835 | AsyncLocalStorage |
| Ux8 | executeSubagentStartHooks | chunks.175.mjs:2666 | function (generator) |
| hf6 | loadTranscript | chunks.174.mjs:2705 | function |
| BQ1 | filterWhitespaceAssistant | chunks.173.mjs:1388 | function |
| mQ1 | filterThinkingOnlyAssistant | chunks.173.mjs:1435 | function |
| wP6 | stripOrphanedToolResults | chunks.173.mjs:344 | function |

### In-Process Teammate Symbols

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| XNY | inProcessAgentRunner | chunks.134.mjs:1571 | function |
| DNY | pollForNextMessage | chunks.134.mjs:1483 | function |
| Ji4 | claimUnclaimedTask | chunks.134.mjs:1464 | function |
| JNY | findNextAvailableTask | chunks.134.mjs:1445 | function |
| jNY | sleep | chunks.134.mjs:1441 | function |
| xN1 | registerTeammateAndRun | chunks.134.mjs:1847 | function |
| kb | updateInProcessTeammateTask | chunks.134.mjs:1413 | function |
| Ku8 | formatTeammateMessage | chunks.134.mjs:1405 | function |
| Mi4 | InProcessBackend | chunks.134.mjs:1888 | class |

### Web Tool Symbols

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| BX | WebFetchTool | chunks.143.mjs:1308 | tool object |
| lk1 | WebSearchTool | chunks.143.mjs:2393 | tool object |
| sO | TOOL_NAME_WEB_FETCH | chunks.56.mjs:80 | constant ("WebFetch") |
| jv | TOOL_NAME_WEB_SEARCH | chunks.56.mjs:1287 | constant ("WebSearch") |
| JL | TOOL_NAME_WEB_SEARCH (alt) | chunks.47.mjs:621 | constant ("WebSearch") |
| xO | TOOL_NAME_WEB_FETCH (alt) | chunks.46.mjs:2559 | constant ("WebFetch") |
| - | htmlToMarkdown | chunks.47.mjs | function |
| - | extractWithPrompt | chunks.47.mjs | function |
| - | executeSearch | chunks.46.mjs | function |

### LSP Tool Symbols

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| wF8 | LSPTool | chunks.144.mjs:877 | tool object |
| Ai6 | TOOL_NAME_LSP | chunks.144.mjs:359 | constant ("LSP") |

### MCP Tool Symbols

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ll | ListMcpResourcesTool | chunks.144.mjs:1144 | tool object |
| qi6 | TOOL_NAME_LIST_MCP_RESOURCES | chunks.144.mjs:1054 | constant ("ListMcpResourcesTool") |
| hl | ReadMcpResourceTool | chunks.144.mjs:1318 | tool object |
| p94 | parseMcpToolName | chunks.90.mjs:2355 | function |

---

## Module: LLM API

> **VERIFIED 2026-03-21**: Symbol mappings cross-validated against source code.
> Key files: chunks.170.mjs (callModel), chunks.171.mjs (streamingQueryCore), chunks.89.mjs (withApiRetry)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Yh | mainAgentLoop | chunks.148.mjs:875 | async generator (entry point) |
| omY | mainAgentLoopCore | chunks.148.mjs:882 | async generator (implementation) |
| NT6 | callModel | chunks.170.mjs:2009 | async generator (wrapper) |
| mGq | streamingQueryCore | chunks.171.mjs:3 | async generator (full implementation) |
| _P1 | withApiRetry | chunks.89.mjs:3 | async generator |
| $54 | parseContextOverflowError | chunks.89.mjs:110 | function |
| VI | calculateBackoffDelay | chunks.89.mjs:100 | function |
| O54 | extractRetryAfterHeader | chunks.89.mjs:96 | function |
| Cb9 | isFastModeDisabledError | chunks.89.mjs:131 | function |
| iF6 | isOverloadedError | chunks.89.mjs:136 | function |
| R36 | ModelFallbackError | chunks.89.mjs:260 | class (signals model overload) |
| RB | RetryError | chunks.89.mjs:249 | class (wraps retry failures) |
| Qz6 | mergeUsage | chunks.171.mjs:670 | function (merges incremental usage from SSE) |
| K9z | abortStream | chunks.171.mjs:663 | function (safely aborts stream controller) |
| bGq | nonStreamingFallbackCore | chunks.170.mjs:2028 | async generator (fallback when streaming fails) |
| qy1 | accumulateUsage | chunks.171.mjs:695 | function (adds usage stats across responses) |

### Retry Configuration Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Rb9 | DEFAULT_MAX_RETRIES | chunks.89.mjs:215 | constant (10) |
| fN8 | FLOOR_OUTPUT_TOKENS | chunks.89.mjs:217 | constant (3000, min output tokens after overflow) |
| hb9 | MAX_CONSECUTIVE_529_ERRORS | chunks.89.mjs:219 | constant (3, circuit breaker for overload) |
| Sb9 | BASE_RETRY_DELAY_MS | chunks.89.mjs:221 | constant (500ms) |
| Bb9 | MAX_RETRY_DELAY_MS | chunks.89.mjs:227 | constant (1800000, 30 min) |
| gb9 | MIN_RATE_LIMIT_RETRY_MS | chunks.89.mjs:229 | constant (20000, 20s) |
| Fb9 | DEFAULT_RATE_LIMIT_RETRY_MS | chunks.89.mjs:231 | constant (600000, 10 min) |

### Streaming & Query Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $71 | selectModelForMode | chunks.47.mjs:2003 | function |
| Af6 | accumulateUsage | chunks.169.mjs:1365 | function |
| b9z | wrapUserMessageWithCache | chunks.169.mjs:1385 | function |
| bq6 | calculateCost | chunks.47.mjs:1605 | function |
| COq | getClientDataPromptVariant | chunks.168.mjs:2386 | function |
| dOq | nonStreamingFallback | chunks.169.mjs:710 | function (generator) |
| dZ | buildSystemPrompt | chunks.169.mjs:236 | function |
| e51 | mergeUsage | chunks.169.mjs:1343 | function |
| g9z | capMaxTokens | chunks.169.mjs:1481 | function |
| hOq | buildSimplifiedSystemPrompt | chunks.169.mjs:225 | function |
| IOq | buildSimplifiedEnvInfo | chunks.169.mjs:402 | function |
| JT6 | processContentBlocks | chunks.173.mjs:278 | function |
| LN | initialUsageObject | chunks.169.mjs:1340 | constant |
| m9z | buildCacheControlMessages | chunks.169.mjs:580 | function |
| mp | completeQuery | chunks.169.mjs:672 | function |
| nSA | splitSystemPromptBySections | chunks.169.mjs:1394 | function |
| oZ5 | lookupPricingTier | chunks.47.mjs:1581 | function |
| pY | createErrorMessage | chunks.172.mjs:2860 | function |
| Q9z | NON_STREAMING_MAX_TOKENS | chunks.169.mjs:1479 | constant |
| R1q | normalizeToolInput | chunks.173.mjs:278 | function |
| rZ5 | computeUsdCost | chunks.47.mjs:1573 | function |
| s91 | createCacheControl | chunks.169.mjs:1399 | function |
| Sq6 | trackCumulativeCost | chunks.169.mjs:1375 | function |
| u9z | wrapAssistantMessageWithCache | chunks.169.mjs:1385 | function |
| US | createLlmClient | chunks.169.mjs:100 | function |
| UW1 | streamingQuery | chunks.169.mjs:691 | function (generator) |
| cM | normalizeMessages | chunks.173.mjs:1999 | function ✅ (Note: cM is the correct symbol; WJ at chunks.5.mjs is a different function) |
| x9z | applyEffortToRequest | chunks.169.mjs:566 | function |
| yd1 | abortStream | chunks.169.mjs:1336 | function |

### System Prompt Building

> Full analysis: [03_llm_core/system_prompt_building.md](../03_llm_core/system_prompt_building.md)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| R0 | buildSystemPrompt | chunks.168.mjs:2144 | async function |
| P5z | buildIntroSection | chunks.168.mjs:2071 | function |
| W5z | buildSystemSection | chunks.168.mjs:2079 | function |
| Z5z | buildCodingSection | chunks.168.mjs:2085 | function |
| G5z | buildCareSection | chunks.168.mjs:2093 | function |
| f5z | buildToolsSection | chunks.168.mjs:2106 | function |
| N5z | buildToneSection | chunks.168.mjs:2138 | function |
| v5z | buildOutputEfficiencySection | chunks.168.mjs:2122 | function |
| RZq | buildEnvSection | chunks.168.mjs:2194 | async function |
| ID1 | buildMemorySection | chunks.84.mjs:382 | async function |
| M5z | buildLanguageSection | chunks.168.mjs:2050 | function |
| D5z | buildOutputStyleSection | chunks.168.mjs:2056 | function |
| X5z | buildMcpInstructionsSection | chunks.168.mjs:2062 | function |
| Jn8 | formatSystemPromptBlocks | chunks.170.mjs:1483 | function |
| S_6 | CACHE_BOUNDARY_MARKER | chunks.168.mjs:2277 | constant |
| hZq | getModelKnowledgeCutoff | chunks.168.mjs:2215 | function |

### Message Normalization

> Full analysis: [03_llm_core/message_normalization.md](../03_llm_core/message_normalization.md)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| fN | trimMessagesAfterCompactBoundary | chunks.174.mjs:628 | function |
| Szz | findCompactBoundaryIndex | chunks.174.mjs:620 | function |
| RZ | isCompactBoundaryMessage | chunks.174.mjs:617 | function |
| T34 | applyContentReplacements | chunks.89.mjs:2205 | async function |
| djq | shouldIncludeInApi | chunks.174.mjs:634 | function |
| Ei6 | isThinkingOnly | chunks.174.mjs:641 | function |
| qr8 | countToolUses | chunks.174.mjs:647 | function |
| VTq | hasToolUseInHistory | chunks.174.mjs:660 | function |
| _9z | formatSystemPromptForApi | chunks.171.mjs:799 | function |
| Ui8 | normalizeAttachmentForAPI | chunks.174.mjs:3 | function |
| p1 | createUserMessage | chunks.173.mjs:1378 | function |
| b5 | wrapWithSystemReminderTags | chunks.174.mjs:469 | function |
| nr6 | createToolUsePlaceholder | chunks.174.mjs:456 | function |
| ir6 | createToolResultPlaceholder | chunks.174.mjs:463 | function |

> **CORRECTIONS:**
> - `lOq` (chunks.159.mjs:367) is QR code KANJI mode, NOT llmRequestGenerator
> - `V26` (chunks.193.mjs:2255) is module export, NOT withApiRetry. Use `_P1` instead.
> - `ZR` is module wrapper, NOT mainAgentLoop. Use `Yh` instead.
> - `uU1` location was wrong. Use `ui6` for StreamingToolExecutor.
> - `$OA` (previously listed as contextCompactor) does NOT exist. Compact integration is handled by `pg` (microcompact) and `sqq` (autoCompact) called from mainAgentLoopCore.

---

## Module: Attachments & Reminders

> Full analysis: [03_llm_core/reminder_integration.md](../03_llm_core/reminder_integration.md), [04_system_reminder/](../04_system_reminder/)
>
> **Source Files:**
> - `chunks.174.mjs` - normalizeAttachmentForAPI (normalization layer)
> - `chunks.147.mjs` - assembleAllAttachments, producer functions (production layer)
> - `chunks.173.mjs` - XML wrappers, plan/auto mode reminders (formatting layer)

### Core Attachment Functions

> **Note**: `Ui8` (normalizeAttachmentForAPI) handles `team_context` type attachments at lines 9-37,
> generating the "You are a teammate in team..." system reminder message for agent coordination.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ui8 | normalizeAttachmentForAPI | chunks.174.mjs:3-469 | function |
| _uY | assembleAllAttachments | chunks.147.mjs:3-18 | function |
| Vf6 | attachmentGenerator | chunks.147.mjs:822-829 | function (generator) |
| Hz | timedAttachmentProducer | chunks.147.mjs:20-46 | function |
| f4 | createAttachmentWrapper | chunks.147.mjs:942-949 | function |
| OuY | getQueuedCommandsAttachment | chunks.147.mjs:48-68 | function |
| $uY | getAgentPendingMessagesAttachment | chunks.147.mjs:70-81 | function |

### Attachment Producers - User-Dependent (Group 1)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| RuY | extractAtMentionedFiles | chunks.147.mjs:407-448 | function |
| SuY | extractMcpResources | chunks.147.mjs:464-495 | function |
| huY | extractAgentMentions | chunks.147.mjs:450-462 | function |

### Attachment Producers - Always-Computed (Group 2)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| fuY | getDateChangeAttachment | chunks.147.mjs:237-246 | function |
| TuY | getUltrathinkEffortAttachment | chunks.147.mjs:248-254 | function |
| xE1 | getDeferredToolsDeltaAttachment | chunks.147.mjs:256-267 | function |
| uE1 | getMcpInstructionsDeltaAttachment | chunks.147.mjs:269-282 | function |
| CuY | getChangedFilesAttachment | chunks.147.mjs:497-539 | function |
| IuY | getNestedMemoryAttachments | chunks.147.mjs:541-550 | function |
| BuY | getDynamicSkillAttachments | chunks.147.mjs:650-690 | function |
| guY | getSkillListingAttachment | chunks.147.mjs:700-721 | function |
| VuY | getUltraClaudeMdAttachment | chunks.147.mjs:302-304 | function |
| DuY | getPlanModeAttachment | chunks.147.mjs:136-168 | function |
| XuY | getPlanModeExitAttachment | chunks.147.mjs:170-181 | function |
| ZuY | getAutoModeAttachment | chunks.147.mjs:214-227 | function |
| GuY | getAutoModeExitAttachment | chunks.147.mjs:229-235 | function |
| ruY | getTodoReminderAttachment | chunks.147.mjs:972-990 | function |
| euY | getTeammateMailboxAttachment | chunks.147.mjs | function |
| AmY | getTeamContextAttachment | chunks.147.mjs | function |
| vuY | getCriticalSystemReminder | chunks.147.mjs:284-291 | function |

### Memory Loading Helpers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| EuY | parentDirTraversal | chunks.147.mjs:322-338 | function |
| Yqq | loadMemoryFromTriggerPath | chunks.147.mjs:371-395 | function |
| sF8 | createNestedMemoryAttachments | chunks.147.mjs:344-369 | function |
| HuY | extractTextFromContent | chunks.147.mjs:83 | function |
| juY | processPastedImages | chunks.147.mjs:88 | function |

### Attachment Producers - Main-Agent-Only (Group 3)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| kuY | getIdeSelectionAttachment | chunks.147.mjs:306-320 | function |
| LuY | getIdeOpenedFileAttachment | chunks.147.mjs:397-405 | function |
| NuY | getOutputStyleAttachment | chunks.147.mjs:293-300 | function |
| cuY | getDiagnosticsAttachment | chunks.147.mjs:789-798 | function |
| luY | getLspDiagnosticsAttachment | chunks.147.mjs:800-820 | function |
| suY | getUnifiedTasksAttachment | chunks.147.mjs:1033-1047 | function |
| Nqq | getUnretrievedTaskStatuses | chunks.147.mjs:1923-1940 | function |
| f4 | createTaskStatusAttachment | chunks.147.mjs:942-949 | function |
| tuY | getAsyncHookResponsesAttachment | chunks.147.mjs:1050-1082 | function |
| buY | getRelevantMemoriesAttachment | chunks.147.mjs:552-590 | function |
| auY | getTaskReminderAttachment | chunks.147.mjs:1013-1030 | function |
| qmY | getTokenUsageAttachment | chunks.147.mjs | function |
| YmY | getBudgetUsdAttachment | chunks.147.mjs | function |
| KmY | getOutputTokenUsageAttachment | chunks.147.mjs | function |
| _mY | getVerifyPlanReminderAttachment | chunks.147.mjs | function |
| _uY | assembleAllAttachments | chunks.147.mjs:3 | function |
| Hz | timedAttachmentProducer | chunks.147.mjs:20 | function |
| nuY | deduplicateAttachments | chunks.147.mjs:951 | function |

### Mode Control Helpers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| JuY | countTurnsSincePlanMode | chunks.147.mjs:105-122 | function |
| MuY | countPlanModeReminders | chunks.147.mjs:124-134 | function |
| PuY | countTurnsSinceAutoMode | chunks.147.mjs:183-200 | function |
| WuY | countAutoModeReminders | chunks.147.mjs:202-212 | function |
| E7 | isTeamMode | chunks.50.mjs:2543 | function |

### Reminder Formatting

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| b5 | wrapWithSystemReminderTags | chunks.173.mjs:2496-2523 | function |
| af | wrapInXmlTag | chunks.173.mjs:2490-2494 | function |
| p1 | createUserMessage | chunks.173.mjs:1378-1412 | function |
| nr6 | createToolCallMessage | chunks.174.mjs:490-495 | function |
| ir6 | createToolResultMessage | chunks.174.mjs:471-488 | function |
| Wzz | planModeReminderDispatcher | chunks.173.mjs:2525-2530 | function |
| Nzz | fullPlanReminder | chunks.173.mjs:2556-2690 | function |
| Ezz | sparsePlanReminder | chunks.173.mjs:2692-2699 | function |
| yzz | subAgentPlanReminder | chunks.173.mjs:2701-2712 | function |
| Zzz | ultraplanCompleteReminder | chunks.173.mjs:2532-2538 | function |
| Lzz | autoModeReminder | chunks.173.mjs:2714-2717 | function |
| Rzz | fullAutoModeReminder | chunks.173.mjs:2719-2732 | function |
| hzz | sparseAutoModeReminder | chunks.173.mjs:2734-2739 | function |

---

## Module: Thinking Mode

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| C59 | modelSupportsThinking | chunks.75.mjs:1770 | function |
| es1 | getModelBetas | chunks.47.mjs:2010 | function |
| fw6 | getInitialThinkingEnabled | chunks.75.mjs:1759 | function |
| Hn1 | INTERLEAVED_THINKING_BETA | chunks.1.mjs:2249 | constant ("interleaved-thinking-2025-05-14") |
| $L6 | ADAPTIVE_THINKING_BETA | chunks.1.mjs:2267 | constant ("adaptive-thinking-2026-01-28") |
| HL6 | EFFORT_BETA | chunks.1.mjs:2270 | constant ("effort-2025-11-24") |
| Jbq | DEFAULT_THINKING_BUDGET | chunks.1.mjs:2317 | constant (31999) |
| maxThinkingTokens | maxThinkingTokens | chunks.130.mjs:1564 | state key |
| ok7 | isOpus46Model | chunks.75.mjs:1755 | function |
| p17 | getDefaultEffortForModel | chunks.47.mjs:2018 | function |
| qPA | getEffortFromSettings | chunks.90.mjs:3080 | function |
| rz1 | getDefaultThinkingBudget | chunks.1.mjs:2319 | function |
| Sn7 | getEffortFromEnv | chunks.90.mjs:3085 | function |
| thinkingEnabled | thinkingEnabled | chunks.154.mjs:120 | state key |
| uK1 | parseEffortValue | chunks.90.mjs:3072 | function |
| VB1 | isOpus46Model | chunks.90.mjs:3068 | function |
| WJ6 | EFFORT_LEVELS | chunks.90.mjs:3070 | constant (Array) |
| xcA | CLAUDE_CODE_BETA | chunks.1.mjs:2245 | constant ("claude-code-20250219") |

---

## Module: Subagent Execution

> Full analysis: [08_subagent/](../08_subagent/), [26_background_agents/](../26_background_agents/)

### Core Parameters & Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| background-task-output | BACKGROUND_TASK_OUTPUT_MARKER | chunks.129.mjs:2194 | constant |
| backgroundTasks | backgroundTasks | chunks.151.mjs:2590 | state key |
| run_in_background | run_in_background | chunks.132.mjs:43 | parameter |
| CW6 | BACKGROUND_AGENT_EXCLUDED_TOOLS | chunks.91.mjs:269 | constant (Set) |
| eP1 | ASYNC_AGENT_ALLOWED_TOOLS | chunks.91.mjs:269 | constant (Set) |
| WY4 | TEAM_DELEGATE_TOOLS | chunks.91.mjs:269 | constant (Set) |
| xV8 | ASYNC_AGENT_EXCLUDED_TOOLS | chunks.91.mjs:269 | constant (Set) |
| KP6 | BACKGROUND_TASKS_DISABLED (AgentTool) | chunks.132.mjs:37 | constant (boolean) |
| Id1 | BACKGROUND_TASKS_DISABLED (BashTool) | chunks.170.mjs:528 | constant (boolean) |
| q_q | BASH_BACKGROUND_TIMEOUT_MS | chunks.170.mjs:514 | constant (2000) |
| Lv9 | TASK_TYPE_PREFIXES | chunks.89.mjs:~540 | constant (object map) |
| Tv9 | BROADCAST_MODES | chunks.89.mjs:~515 | constant (Set: "task-notification") |

### Task Identity

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| hp | createTaskId | chunks.89.mjs:522 | function |
| IZ | createTaskRecord | chunks.89.mjs:528 | function |
| Rv9 | getTypePrefix | chunks.89.mjs:~518 | function |
| oV | generateTaskId | chunks.41.mjs:2410 | function |
| k$3 | getTaskTypePrefix | chunks.41.mjs:2406 | function |

### Task State Management

> **CORRECTIONS:**
> - `yjA` and `CjA` are NOT task functions - they are constants in chunks.15.mjs:
>   - `yjA` = 67108864 (COMPACT_BOUNDARY_THRESHOLD)
>   - `CjA` = 5242880 (COMPACT_PRE_BOUNDARY_THRESHOLD)
> - `wd7` and `zd7` are NOT task functions - they are crypto module exports (chunks.72.mjs)
> - The actual task state functions are `i9`, `Zf`, `VR`, etc. (chunks.90.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| i9 | atomicUpdateTask | chunks.90.mjs:3003 | function |
| Zf | registerTask | chunks.90.mjs:3019 | function |
| VR | removeTask | chunks.90.mjs:3037 | function |
| EV8 | getRunningTasks | chunks.90.mjs:3053 | function |
| wY4 | pollTaskOutputs | chunks.90.mjs:3058 | function |
| OY4 | updateTaskState | chunks.90.mjs:3087 | function |
| LJ6 | isTerminalTaskStatus | chunks.41.mjs:2402 | function |
| oV | generateTaskId | chunks.41.mjs:2410 | function |
| RG | createTaskEntry | chunks.41.mjs:2418 | function |
| wQ6 | killLocalBashTask | chunks.95.mjs:1918 | function |
| t24 | killBashTasksForAgent | chunks.95.mjs:1938 | function |
| Hd7 | backgroundForegroundTask | chunks.89.mjs:~1515 | function |
| ia | isLocalAgentTask | chunks.89.mjs:~1402 | function |
| U4q | killAllLocalAgents | chunks.146.mjs:2029 | function |
| d4q | markTaskKilled | chunks.146.mjs:2034 | function |
| $m8 | markTaskCompleted | chunks.146.mjs:2100 | function |
| Hm8 | markTaskFailed | chunks.146.mjs:2117 | function |
| TV1 | updateTaskProgressPreservingSummary | chunks.146.mjs:2045 | function |
| nl4 | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | function |
| x66 | triggerAbortSignal | chunks.146.mjs:2012 | function |
| Qn4 | createBackgroundAgentTask | chunks.146.mjs:2133 | function |
| Un4 | createForegroundAgentTask | chunks.146.mjs:2165 | function |
| g2 | getOutputFilePath | chunks.41.mjs:2248 | function |
| Y91 | OutputBuffer | chunks.41.mjs:2252 | class |
| $O | flushOutputBuffer | chunks.41.mjs:2320 | function |
| Z97 | readOutputFileDelta | chunks.41.mjs:2325 | function |
| G97 | TASK_ID_CHARSET | chunks.41.mjs:2434 | constant ("0123456789abcdefghijklmnopqrstuvwxyz") |
| V$3 | TASK_TYPE_PREFIXES | chunks.41.mjs:2438 | object ({local_bash:"b", local_agent:"a", remote_agent:"r", in_process_teammate:"t", local_workflow:"w"}) |
| R61 | createChildAbortController | chunks.6.mjs:465 | function |
| Tq | registerProcessExitCleanup | chunks.1.mjs:4149 | function |
| u_6 | foregroundResolveMap | chunks.89.mjs:~1477 | variable (Map) |
| yjA | COMPACT_BOUNDARY_THRESHOLD | chunks.15.mjs:212 | constant (67108864) |
| CjA | COMPACT_PRE_BOUNDARY_THRESHOLD | chunks.15.mjs:214 | constant (5242880) |

> **CORRECTION:** `Kd7` was incorrectly documented as `killAllRunningAgents`.
> The actual `Kd7` (chunks.72.mjs:2707) is a crypto module export, NOT a task function.
> The correct function is `U4q` (killAllLocalAgents) at chunks.146.mjs:2029.

### Subagent Context Creation

> See also [Agent Loop Runner Symbols](#agent-loop-runner-symbols) for `Bc6`, `Fx8`, `vvY`, `DI`, `bI`, `C01`, etc.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| av | runForkedAgent | chunks.149.mjs:2634 | function |
| p1 | createUserMessage | chunks.173.mjs:1378 | function |
| gL9 | generateUUID | chunks.90.mjs | function |

> **CORRECTION:** Previous documentation incorrectly mapped:
> - `vQ1` as `deriveToolUseContext` - actual symbol is `Bc6` (chunks.148.mjs:1978)
> - `Nn7` as `buildForkContextMessages` - actual `Nn7` (chunks.75.mjs:487) is Azure PowerShell command execution.
>   Fork context messages are built inline in `agentLoopRunner` (qh), not by a separate function.

### Agent Loop Runner Symbols

> Core execution generator and its helper functions for subagent execution.
> Full analysis: [execution_flow_deep_dive.md](../08_subagent/execution_flow_deep_dive.md)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| qh | agentLoopRunner | chunks.133.mjs:1565 | function (async generator) |
| Yh | llmMessageLoop | chunks.148.mjs:875 | function (async generator) |
| omY | processTurnLoop | chunks.148.mjs:882 | function (inner generator) |
| Bc6 | deriveToolUseContext | chunks.148.mjs:1978 | function |
| C01 | resolveModelConfig | chunks.93.mjs:1476 | function |
| bI | generateAgentId | chunks.93.mjs:1557 | function |
| DI | cloneMap | chunks.84.mjs:65 | function |
| Fx8 | cloneForkContext | chunks.133.mjs:1788 | function |
| vvY | buildAgentSystemPrompt | chunks.133.mjs:1806 | function |
| NvY | resolveSkillByName | chunks.133.mjs:1817 | function |
| r24 | registerAgentHooks | chunks.95.mjs:1842 | function |
| zZ6 | deregisterAgentHooks | chunks.95.mjs:1830 | function |
| Ux8 | executeSubagentStartHooks | chunks.175.mjs:2666 | function (async generator) |
| X66 | runWithAgentIdentity | chunks.133.mjs:841 | function (AsyncLocalStorage wrapper) |
| Tf6 | getCurrentAgentIdentity | chunks.133.mjs:837 | function |
| mc4 | agentIdentityStorage | chunks.133.mjs:835 | AsyncLocalStorage instance |
| TvY | isMessageRecordable | chunks.133.mjs:1561 | function |
| dg | writeToTranscript | chunks.133.mjs:1739 | function |
| gc6 | writeAgentMetadata | chunks.133.mjs:1739 | function |
| a36 | cleanupAgentIdentity | chunks.133.mjs:1784 | function |
| Qx8 | cleanupTranscriptWriter | chunks.133.mjs:1784 | function |
| t24 | cleanupTaskState | chunks.133.mjs:1784 | function |

> **CORRECTION:** The symbol `p01` was incorrectly documented as `runWithAgentIdentity`.
> The actual `p01` (chunks.94.mjs:295) is `isSkillMdFile` - a helper that checks if a filename is "skill.md".

### Agent Definitions

> Note: Agent definition objects are defined in chunks.93.mjs, wrapped in E() lazy initializers.
>
> **WARNING:** The `hh` symbol was incorrectly documented as `mergeAgentDefinitions`. The actual `hh` function
> is `hasOnlyInProcessTeammates` (chunks.162.mjs:360) - a UI utility that checks if all running tasks
> are in-process teammates. The `mergeAgentDefinitions` functionality exists but has a different symbol.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| q96 | GENERAL_PURPOSE_AGENT | chunks.93.mjs:1681 | object (agent def) |
| X_4 | STATUSLINE_SETUP_AGENT | chunks.93.mjs:1694 | object (agent def) |
| QB | EXPLORE_AGENT | chunks.93.mjs:1871 | object (agent def) |
| x01 | PLAN_AGENT | chunks.93.mjs:1944 | object (agent def) |
| G_4 | CLAUDE_CODE_GUIDE_AGENT | chunks.93.mjs:2018 | object (agent def) |
| CF9 | buildClaudeCodeGuidePrompt | chunks.93.mjs:1957 | function (system prompt) |
| yF9 | buildGeneralPurposePrompt | chunks.93.mjs | function (system prompt) |
| LF9 | buildExploreSystemPrompt | chunks.93.mjs:1819 | function (system prompt) |
| hF9 | buildPlanSystemPrompt | chunks.93.mjs:1883 | function (system prompt) |
| RF9 | EXPLORE_WHEN_TO_USE | chunks.93.mjs:1862 | constant (string) |

### Progress Tracking

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| cD | STRUCTURED_OUTPUT_NAME | chunks.89.mjs:779 | constant ("StructuredOutput") |
| cv9 | MAX_RECENT_ACTIVITIES | chunks.89.mjs:1554 | constant (5) |
| LjA | computeTotalTokens | chunks.89.mjs:~1307 | function |
| Qj1 | trackProgressFromMessage | chunks.89.mjs:1307 | function |
| wB1 | createActivityDescriptionResolver | chunks.89.mjs:~1396 | function |
| x_6 | classifyToolActivity | chunks.89.mjs:989 | function |
| zB1 | getProgressSnapshot | chunks.89.mjs:1327 | function |

### Task Notification & Command Queue

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bp7 | drainQueue | chunks.89.mjs:~503 | function |
| Cp7 | queueEpochCounter | chunks.89.mjs:505 | variable (number) |
| dP | AGENT_ID_TAG | chunks.9.mjs:1257 | constant ("task-id") |
| G_6 | notifyQueueSubscribers | chunks.89.mjs:~381 | function |
| hp7 | getPendingTaskCount | chunks.89.mjs:~380 | function |
| Ip7 | hasQueuedTasks | chunks.89.mjs:~495 | function |
| KY | isHeadlessSession | chunks.89.mjs:879 | function (always returns false) |
| lB | enqueueOrBuffer | chunks.89.mjs:~407 | function |
| ND | STATUS_TAG | chunks.9.mjs:1263 | constant ("status") |
| NO | TASK_NOTIFICATION_TAG | chunks.9.mjs:1255 | constant ("task-notification") |
| TD | MESSAGE_TAG | chunks.9.mjs:1265 | constant ("summary") |
| vK1 | notifyTaskCompletion | chunks.89.mjs:1346 | function |
| W_6 | commandSubscribers | chunks.89.mjs:~415 | variable (Set) |
| WR | enqueueCommand | chunks.89.mjs:~402 | function |
| xj1 | commandQueue | chunks.89.mjs:514 | variable (Array) |
| xp7 | getQueueLength | chunks.89.mjs:~499 | function |

### Output File I/O

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| OC | TOOL_NAME_TASK_STOP | chunks.40.mjs:412 | constant ("TaskStop") |
| eu1 | getTasksDir | chunks.89.mjs:238 | function |
| hj1 | initOutputFile | chunks.89.mjs:310 | function |
| Ij1 | symlinkOutputFile | chunks.89.mjs:317 | function |
| z38 | readFullOutput | chunks.41.mjs:2348 | function |
| Rp7 | cleanupOutputFiles | chunks.89.mjs:328 | function |
| $C | TOOL_NAME_TASK_OUTPUT | chunks.40.mjs:421 | constant ("TaskOutput") |
| vp7 | outputWriteQueue | chunks.89.mjs:340 | variable (Map) |
| Z97 | readOutputFileDelta | chunks.41.mjs:2325 | function |
| g2 | getOutputFilePath | chunks.41.mjs:2248 | function |
| ZK1 | writeOutputChunk | chunks.89.mjs:253 | function |
| Y91 | OutputBuffer | chunks.41.mjs:2252 | class |
| $O | flushOutputBuffer | chunks.41.mjs:2320 | function |
| v$3 | getOrCreateOutputBuffer | chunks.41.mjs:2310 | function |
| W97 | appendToOutputBuffer | chunks.41.mjs:2316 | function |
| G97 | TASK_ID_CHARSET | chunks.41.mjs:2434 | constant (string) |
| V$3 | TASK_TYPE_PREFIXES | chunks.41.mjs:2438 | constant (object) |

> **CORRECTIONS:**
> - `WjA` was incorrectly documented as `readOutputFileDelta`. It is actually a timeout function at chunks.14.mjs:2696. The correct symbol is `Z97` at chunks.41.mjs:2325.
> - `ww` was incorrectly documented as `getOutputFilePath`. The correct symbol is `g2` at chunks.41.mjs:2248.
> - `M_6` was incorrectly documented as `readFullOutput`. The correct symbol is `z38` at chunks.41.mjs:2348.

### TaskOutput & TaskStop Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| EW6 | buildTaskSnapshot | chunks.139.mjs:1687 | function |
| kW6 | TaskOutputTool | chunks.139.mjs:~1922 | object |
| Ng1 | truncateTaskOutput | chunks.139.mjs:1664 | function |
| nyY | pollUntilDone | chunks.139.mjs:1716 | function |
| Vg1 | getKillHandlerForType | chunks.142.mjs:1652 | function |
| vW6 | TaskStopTool | chunks.139.mjs:~1537 | object |

### Mailbox System (Teammate Communication)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| wl | readMailbox | chunks.132.mjs:3 | function |
| x3 | writeToMailbox | chunks.132.mjs:22 | function |
| Vc6 | markMessageAsReadByIndex | chunks.132.mjs:57 | function |
| kc6 | markMessagesAsRead | chunks.132.mjs:92 | function |
| pY6 | readUnreadMessages | chunks.132.mjs:16 | function |
| $TY | clearMailbox | chunks.132.mjs:128 | function |
| HTY | formatMailboxMessages | chunks.132.mjs:141 | function |
| Nc6 | properLockfile | chunks.132.mjs:437 | module (npm package) |
| iv1 | lockOptions | chunks.132.mjs:463 | object |

### Teammate Execution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| pNY | spawnTeammateDispatcher | chunks.135.mjs:1110 | function |
| qn4 | spawnTeammate | chunks.135.mjs:1116 | function |
| Rb | isInProcessEnabled | chunks.135.mjs:208 | function |
| FNY | spawnInProcessTeammate | chunks.135.mjs:985 | function |
| BNY | spawnSplitPaneTeammate | chunks.135.mjs:711 | function |
| gNY | spawnTmuxTeammate | chunks.135.mjs:838 | function |
| JNY | findNextAvailableTask | chunks.134.mjs:1445 | function |

### Teammate Identity (AsyncLocalStorage)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ef8 | teammateContextStorage | chunks.84.mjs:1425 | AsyncLocalStorage |
| dD1 | createTeammateContext | chunks.84.mjs:1415 | function |
| iM | getTeammateContext | chunks.84.mjs:1403 | function |
| UD1 | runWithTeammateContext | chunks.84.mjs:1407 | function |

### Backend Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ju8 | TmuxBackend | chunks.134.mjs:2411 | class |
| Xu8 | ITermBackend | chunks.135.mjs:11 | class |
| Mi4 | InProcessBackend | chunks.134.mjs:1888 | class |
| zt | getBackend | chunks.131.mjs:1493 | function |
| OI | isRunningInsideTmux | chunks.131.mjs:759 | function |
| j51 | isRunningInIterm2 | chunks.131.mjs:772 | function |
| Kt | isTmuxInstalled | chunks.131.mjs:768 | function |

### Agent Loop & Execution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| qh | agentLoopRunner | chunks.133.mjs:1565 | function (generator) |
| Yh | llmMessageLoop | chunks.148.mjs:875 | function (generator) |
| Ux8 | executeSubagentStartHooks | chunks.175.mjs:2666 | function (generator) |
| XNY | inProcessAgentRunner | chunks.134.mjs:1571 | function |
| DNY | pollForNextMessage | chunks.134.mjs:1483 | function |
| Ji4 | claimUnclaimedTask | chunks.134.mjs:1464 | function |
| ss | parseShutdownRequest | chunks.131.mjs | function |
| ib4 | getUnclaimedTaskPrompt | chunks.131.mjs:336 | function |
| C01 | resolveModelConfig | chunks.93.mjs:1476 | function |
| bI | generateAgentId | chunks.93.mjs:1557 | function |
| DI | cloneMap | chunks.84.mjs:65 | function |
| Fx8 | cloneForkContext | chunks.133.mjs:1788 | function |
| vvY | buildAgentSystemPrompt | chunks.133.mjs:1806 | function |
| r24 | registerAgentHooks | chunks.95.mjs:1842 | function |

### Agent Identity (AsyncLocalStorage)

> **CORRECTION:** The symbol `p01` was incorrectly documented as `runWithAgentIdentity`.
> The actual `p01` (chunks.94.mjs:295) is `isSkillMdFile` - a helper that checks if a filename is "skill.md".

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| mc4 | agentIdentityStorage | chunks.133.mjs:859 | AsyncLocalStorage |
| X66 | runWithAgentIdentity | chunks.133.mjs:841 | function |
| Tf6 | getCurrentAgentIdentity | chunks.133.mjs:837 | function |
| ef8 | teammateContextStorage | chunks.84.mjs:1425 | AsyncLocalStorage |
| UD1 | runWithTeammateContext | chunks.84.mjs:1407 | function |
| iM | getTeammateContext | chunks.84.mjs:1403 | function |
| p01 | isSkillMdFile | chunks.94.mjs:295 | function |

### Result Building

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| qNY | countToolUses | chunks.131.mjs:2250 | function |
| UEA | buildAgentResult | chunks.131.mjs:2514 | function |

### Communication (Mailbox System)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _Q1 | fileLockSync | chunks.129.mjs:1114 | object |
| x3 | writeToMailbox | chunks.132.mjs:22 | function |
| Vc6 | markMessageAsReadByIndex | chunks.132.mjs:57 | function |
| wl | readMailbox | chunks.132.mjs:3 | function |
| kc6 | markAllMessagesAsRead | chunks.132.mjs:92 | function |
| pY6 | readUnreadMessages | chunks.132.mjs:16 | function |
| $TY | clearMailbox | chunks.132.mjs:128 | function |
| HTY | formatMailboxMessages | chunks.132.mjs:141 | function |
| FY6 | getMailboxPath | chunks.131.mjs:2849 | function |
| OTY | validateTeamContext | chunks.131.mjs:2858 | function |

### Idle Notification & Permission Protocol

> Functions for teammate idle notifications and permission request/response protocol.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ec6 | buildIdleNotification | chunks.132.mjs:153 | function |
| yc6 | parseIdleNotification | chunks.132.mjs:166 | function |
| Xx8 | buildPermissionRequest | chunks.132.mjs:174 | function |
| Px8 | buildPermissionResponse | chunks.132.mjs:187 | function |

### Transcript Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| BQ1 | filterWhitespaceAssistant | chunks.173.mjs:1388 | function |
| ld1 | buildConversationChain | chunks.143.mjs:850 | function |
| mQ1 | filterThinkingOnlyAssistant | chunks.173.mjs:1435 | function |
| hf6 | loadTranscript | chunks.174.mjs:2705 | function |
| wP6 | stripOrphanedToolResults | chunks.173.mjs:344 | function |
| dg | writeToTranscript | chunks.174.mjs:1671 | function |
| gc6 | writeAgentMetadata | chunks.174.mjs:1159 | function |
| px8 | setTranscriptSubdir | chunks.174.mjs:1139 | function |
| Qx8 | cleanupTranscriptWriter | chunks.174.mjs:1143 | function |

### Agent Cleanup Functions

> These functions are called in the `finally` block of `agentLoopRunner` (qh) to clean up resources.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| zZ6 | deregisterSkillHooks | chunks.95.mjs:1830 | function |
| a36 | cleanupAgentIdentity | chunks.93.mjs:278 | function |
| t24 | cleanupTaskState | chunks.95.mjs:1938 | function |

### Path Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| kh | getSessionPathForSubagent | chunks.1.mjs:2500 | function |
| xZ | prefixAgentId | chunks.89.mjs:894 | function |

### Spawn Dispatch & Backends

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| qn4 | spawnTeammate | chunks.135.mjs:1116 | function |
| pNY | spawnTeammateDispatcher | chunks.135.mjs:1110 | function |
| BNY | spawnSplitPaneTeammate | chunks.135.mjs:711 | function |
| gNY | spawnTmuxTeammate | chunks.135.mjs:838 | function |
| FNY | spawnInProcessTeammate | chunks.135.mjs:985 | function |
| cVY | spawnSeparateWindowTeammate | chunks.129.mjs:2700 | function |
| dVY | spawnSplitPaneTeammateLegacy | chunks.129.mjs:2650 | function |
| LP1 | spawnInProcessTeammateLegacy | chunks.123.mjs:242 | function |
| Rj6 | killInProcessTeammate | chunks.123.mjs:326 | function |
| di4 | createTeammatePaneInSwarmView | chunks.135.mjs:292 | function |

> **CORRECTION:** The symbol `iVY` was incorrectly documented as `spawnTeammateDispatcher`.
> The actual `iVY` is `fs.promises` from Node.js (used as `iVY.access` for file access checks).
> The correct symbol for `spawnTeammateDispatcher` is `pNY` (chunks.135.mjs:1110).

### In-Process Teammate Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Id | updateInProcessTeammate | chunks.131.mjs:190 | function |
| DVY | sendTeammateMessage | chunks.131.mjs:204 | function |
| lb4 | sendTeamBroadcast | chunks.131.mjs:213 | function |
| jVY | sleepAsync | chunks.131.mjs:218 | function |
| MVY | findUnclaimedTask | chunks.131.mjs:222 | function |
| PVY | buildTaskPrompt | chunks.131.mjs:231 | function |
| XVY | createPermissionHandler | chunks.131.mjs:3 | function |
| BY | TEAM_LEAD_ID | chunks.131.mjs:1981 | constant ("team-lead") |
| jNY | sleep | chunks.134.mjs:1441 | function (polling delay) |

---

## Module: State Management

> Full analysis: [15_state_management/](../15_state_management/)

### Store Logic

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bZ | registerTaskInState | chunks.142.mjs:1676 | function |
| dcA | createInternalState | chunks.1.mjs:2351 | function |
| E81 | getSettingsState | chunks.75.mjs:1757 | function |
| f6 | getGlobalConfig | chunks.174.mjs:1539 | function |
| fU6 | isSessionIdInUse | chunks.174.mjs:1178 | function |
| Gf6 | createStore | chunks.151.mjs:398 | function |
| gG1 | initialAppState | chunks.151.mjs:419 | function |
| ix1 | regenerateSessionId | chunks.1.mjs:2341 | function |
| jA | updateGlobalConfig | chunks.174.mjs:1460 | function |
| l4 | getUserSettings | chunks.151.mjs:410 | function |
| L7 | useSetAppState | chunks.151.mjs:591 | hook |
| nk | validateUuid | chunks.93.mjs:1552 | function |
| o6 | internalStateObject | chunks.1.mjs:3052 | object |
| QD | getDefaultPermissionContext | chunks.151.mjs:400 | function |
| R1 | getSessionId | chunks.1.mjs:2337 | function |
| u_ | AppStateProvider | chunks.151.mjs:522 | component |
| v6 | useAppState | chunks.151.mjs:576 | hook |
| Wf6 | getInitialPromptSuggestionEnabled | chunks.151.mjs:415 | function |
| yhA | useStoreContext | chunks.151.mjs:574 | hook |
| yt | resumeSession | chunks.142.mjs:379 | function |
| Zw6 | initialAttributionState | chunks.151.mjs:412 | function |

> **Note:** `yx1` is `randomUUID` imported from Node.js `crypto` module (not a custom function).
