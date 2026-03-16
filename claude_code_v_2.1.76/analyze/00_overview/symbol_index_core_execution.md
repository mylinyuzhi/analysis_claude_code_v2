# Symbol Index - Core Execution (Claude Code 2.1.76)

> Symbol mapping table Part 1: Core execution flow modules
> Lookup: Browse by module, or Ctrl+F search for obfuscated/readable name.

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
| i5 | FileReadTool | chunks.146.mjs:1754 | tool object |
| s7 | TOOL_NAME_READ | chunks.56.mjs:173 | constant ("Read") |
| vj | FileWriteTool | chunks.146.mjs:436 | tool object |
| _K | TOOL_NAME_WRITE | chunks.56.mjs:1234 | constant ("Write") |
| sW | EditTool | chunks.134.mjs:2124 | tool object |
| R4 | TOOL_NAME_EDIT | chunks.56.mjs:102 | constant ("Edit") |
| gd | NotebookEditTool | chunks.134.mjs:2615 | tool object |
| bJ | TOOL_NAME_NOTEBOOK_EDIT | chunks.56.mjs:1240 | constant ("NotebookEdit") |
| tS | GrepTool | chunks.76.mjs:1129 | tool object |
| N9 | TOOL_NAME_GREP | chunks.56.mjs:1215 | constant ("Grep") |
| WB | GlobTool | chunks.76.mjs:1495 | tool object |
| qz | TOOL_NAME_GLOB | chunks.56.mjs:1192 | constant ("Glob") |
| wt | SkillTool | chunks.132.mjs:820 | tool object |
| oH | TOOL_NAME_SKILL | chunks.90.mjs:2596 | constant ("Skill") |
| avA | AgentTool (Task) | chunks.132.mjs | tool object |
| I46 | TOOL_NAME_TASK | chunks.40.mjs:408 | constant ("Task") |
| Q7 | TOOL_NAME_BASH | chunks.54.mjs:2264 | constant ("Bash") |
| BYq | BashOutputComponent | chunks.162.mjs:417249 | component |

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
| j_6 | generateUnifiedPatch | chunks.134.mjs | function |
| PK1 | findExactString | chunks.134.mjs | function |
| zF4 | performLintValidation | chunks.134.mjs | function |
| yEY | getNotebookInputSchema | chunks.134.mjs:2595 | function |
| CEY | getNotebookOutputSchema | chunks.134.mjs | function |
| N51 | checkEditPermissions | chunks.146.mjs | function |
| ix1 | recordPatch | chunks.134.mjs | function |
| xP6 | computeGitDiff | chunks.134.mjs | function |
| sQ1 | tryParseAsIndex | chunks.134.mjs | function |
| _A | parseNotebook | chunks.134.mjs | function |

### Bash Tool Security Symbols

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| lm | bashSecurityValidation | chunks.150.mjs:321 | function |
| Of6 | speculativeReadonlyValidator | chunks.150.mjs:881 | function |
| fcY | completeReadonlyWhitelist | chunks.150.mjs:2314 | constant (Set) |
| PcY | simpleReadonlyCommands | chunks.150.mjs | constant (array) |
| ZcY | expandedReadonlyCommands | chunks.150.mjs | constant (array) |
| GcY | commandToRegex | chunks.150.mjs | function |
| NcY | isCommandInReadonlyWhitelist | chunks.150.mjs | function |
| ZhA | bashProgressHandler | chunks.150.mjs:2332 | function (generator) |
| dU1 | progressTimeCache | chunks.150.mjs | variable (Map) |
| RcY | PROGRESS_THROTTLE_INTERVAL_MS | chunks.150.mjs | constant |
| LcY | MAX_PROGRESS_CACHE_SIZE | chunks.150.mjs | constant |
| edY | jqSystemFunctionCheck | chunks.150.mjs | function |
| $cY | obfuscatedFlagsCheck | chunks.150.mjs | function |
| AcY | shellMetacharactersCheck | chunks.150.mjs | function |
| qcY | dangerousVariablesCheck | chunks.150.mjs | function |
| KcY | commandSubstitutionCheck | chunks.150.mjs | function |
| YcY | newlineInjectionCheck | chunks.150.mjs | function |
| zcY | ifsInjectionCheck | chunks.150.mjs | function |
| wcY | procEnvironCheck | chunks.150.mjs | function |
| HcY | malformedTokenCheck | chunks.150.mjs | function |
| ndY | jqAllowlistCheck | chunks.150.mjs | function |
| rdY | sedPrintlineAllowlistCheck | chunks.150.mjs | function |
| adY | sedEditAllowlistCheck | chunks.150.mjs | function |
| tdY | gitCdAllowlistCheck | chunks.150.mjs | function |
| sdY | xargsAllowlistCheck | chunks.150.mjs | function |
| OcY | sedFlagValidator | chunks.150.mjs | function |
| J6q | sedSubstitutionValidator | chunks.150.mjs | function |
| CY8 | hasSingleQuotedBackslashBypass | chunks.150.mjs | function |
| cdY | parseCommandQuoting | chunks.150.mjs | function |
| ldY | normalizeQuoting | chunks.150.mjs | function |
| $f6 | containsWindowsUNCPath | chunks.150.mjs | function |
| vcY | commandContainsGit | chunks.150.mjs | function |
| EcY | isInBareGitRepository | chunks.150.mjs | function |
| AD | splitCommandByOperators | chunks.150.mjs | function |
| pz | shellTokenizer | chunks.150.mjs | function |

### File System Tool Symbols

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| g4 | resolvePath | chunks.10.mjs:1159 | function |
| p61 | hasParentTraversal | chunks.10.mjs:1187 | function |
| Gj | checkPathDenyRule | chunks.174.mjs:692 | function |
| ro | checkReadPermissions | chunks.146.mjs | function |
| Ia4 | analyzeConversationMemoryUsage | chunks.146.mjs:2147 | function |
| OmY | fileReadInputSchema | chunks.146.mjs:1706 | variable |
| dBY | fileWriteInputSchema | chunks.146.mjs:419 | variable |
| Z99 | grepInputSchema | chunks.76.mjs:1104 | variable |
| N99 | globInputSchema | chunks.76.mjs:1487 | variable |
| mP6 | findSimilarFile | chunks.146.mjs | function |
| OU1 | MAX_FILE_SIZE_BYTES | chunks.146.mjs | constant |
| wD1 | MAX_PDF_PAGES_PER_REQUEST | chunks.146.mjs | constant |
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
| ZR | mainAgentLoop | chunks.149.mjs:1753 | function (generator) |
| uU1 | StreamingToolExecutor | chunks.149.mjs:1835 | class |
| tZ6 | executeToolsSequentially | chunks.149.mjs:2035 | function (generator) |
| w6q | generateChainId | chunks.149.mjs:1776 | function |
| udY | MAX_OUTPUT_TOKENS_RECOVERY | chunks.149.mjs:2143 | constant (3) |

### Tool Execution Symbols

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| kq | createHookMessage | chunks.142.mjs:2615 | function |
| ng | getDynamicToolSet | chunks.141.mjs | function |
| Tv | findTool | chunks.74.mjs:1392 | function |
| d39 | toolMatchesName | chunks.74.mjs:1388 | function |
| U1q | createToolProgressMessage | chunks.172.mjs:2943 | function |
| YP6 | assembleSessionToolSet | chunks.141.mjs:1476 | function |
| dK | findToolInSet | chunks.146.mjs | function |
| p1 | createUserMessage | chunks.173.mjs:1378 | function |
| f4 | createAttachmentMessage | chunks.145.mjs | function |
| rk | isMcpTool | chunks.145.mjs | function |
| V4q | formatValidationError | chunks.146.mjs | function |

### Tool Execution Lifecycle

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ui6 | ToolExecutorClass | chunks.148.mjs:3 | class |
| Wi6 | toolDispatcher | chunks.146.mjs:285 | generator |
| ZxY | toolExecutionOrchestrator | chunks.146.mjs:391 | function |
| fxY | toolExecutionPipeline | chunks.146.mjs:442 | function |
| y4q | executePreToolHooksIterator | chunks.146.mjs:74 | generator |
| k4q | executePostToolHooksIterator | chunks.145.mjs:3107 | generator |
| E4q | executePostToolFailureHooksIterator | chunks.146.mjs:3 | generator |
| GE1 | batchToolExecutor | chunks.146.mjs:1024 | generator |
| LF8 | executePreToolHooks | chunks.175.mjs:2462 | generator |
| RF8 | executePostToolHooks | chunks.175.mjs:2486 | generator |
| hF8 | executePostToolFailureHooks | chunks.175.mjs:2505 | generator |
| Ax | executeHooksIterator | chunks.175.mjs | generator |
| Pi6 | AsyncQueue | chunks.146.mjs | class |
| NS1 | hasHooksForEvent | chunks.175.mjs | function |
| yF8 | formatHookBlockingError | chunks.175.mjs | function |

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
| vW6 | TaskStopTool | chunks.139.mjs:1537 | tool object |
| OC | TOOL_NAME_TASK_STOP | chunks.40.mjs:412 | constant ("TaskStop") |
| kW6 | TaskOutputTool | chunks.139.mjs:1922 | tool object |
| $C | TOOL_NAME_TASK_OUTPUT | chunks.40.mjs:421 | constant ("TaskOutput") |
| EW6 | buildTaskSnapshot | chunks.139.mjs:1687 | function |
| Ng1 | truncateTaskOutput | chunks.139.mjs:1664 | function |
| nyY | pollUntilDone | chunks.139.mjs:1716 | function |
| Vg1 | getKillHandlerForType | chunks.142.mjs:1652 | function |
| IhY | getAllKillHandlers | chunks.142.mjs:1648 | function |

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
| gj1 | LocalBashTaskHandler | chunks.89.mjs:2012 | object (kill handler) |
| B_6 | LocalAgentTaskHandler | chunks.89.mjs:1574 | object (kill handler) |
| Qi4 | RemoteAgentTaskHandler | chunks.142.mjs:1586 | object (kill handler) |
| hjA | killBashTask | chunks.89.mjs:1846 | function |
| na | killAgentTask | chunks.89.mjs:1376 | function |
| c5 | atomicUpdateTask | chunks.142.mjs:1662 | function |
| bZ | registerTaskInState | chunks.142.mjs:1676 | function |
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
| ER | TOOL_NAME_CRON_CREATE | chunks.91.mjs:192 | constant ("CronCreate") |
| ed | TOOL_NAME_CRON_DELETE | chunks.91.mjs:194 | constant ("CronDelete") |
| SW6 | TOOL_NAME_CRON_LIST | chunks.91.mjs:196 | constant ("CronList") |

### Plan Mode Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| N_6 | TOOL_NAME_ENTER_PLAN_MODE | chunks.89.mjs:564 | constant ("EnterPlanMode") |
| bW | TOOL_NAME_EXIT_PLAN_MODE | chunks.88.mjs:76 | constant ("ExitPlanMode") |
| TH | TOOL_NAME_ASK_USER_QUESTION | chunks.89.mjs:566 | constant ("AskUserQuestion") |
| Qp7 | ASK_QUESTION_DESCRIPTION | chunks.89.mjs:570 | constant |
| gp7 | ASK_QUESTION_PROMPT | chunks.89.mjs:572 | constant |
| Fp7 | MAX_QUESTIONS | chunks.89.mjs:568 | constant (12) |
| - | TOOL_NAME_EXIT_WORKTREE | chunks.89.mjs | constant ("ExitWorktree") |
| - | ExitWorktreeTool | chunks.139.mjs | tool object |

### Skill & ToolSearch Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| wt | SkillTool | chunks.132.mjs:820 | tool object |
| oH | TOOL_NAME_SKILL | chunks.90.mjs:2596 | constant ("Skill") |
| dM | TOOL_NAME_TOOL_SEARCH | chunks.89.mjs:652 | constant ("ToolSearch") |
| pp7 | DEFERRED_TOOLS_HEADER | chunks.89.mjs:654 | constant |
| dp7 | TOOL_SEARCH_DESCRIPTION | chunks.89.mjs:654 | constant |
| ca | cachedDeferredPrompt | chunks.89.mjs:650 | variable |
| v_6 | isTestMode | chunks.89.mjs:612 | function |

### Agent/Task Tool Symbols

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| rj1 | AgentTool | chunks.132.mjs:85 | tool object |
| I46 | TOOL_NAME_TASK | chunks.40.mjs:408 | constant ("Task") |
| oVY | agentInputSchema | chunks.132.mjs:37 | variable |
| ANY | agentOutputSchema | chunks.132.mjs:84 | variable |
| aVY | teamSpawnSchema | chunks.132.mjs:45 | variable |
| sVY | agentResultBaseSchema | chunks.132.mjs:52 | variable |
| tVY | completedResultSchema | chunks.132.mjs:75 | variable |
| eVY | asyncLaunchedResultSchema | chunks.132.mjs:78 | variable |
| NR | generateAgentId | chunks.89.mjs | function |
| zd7 | createAsyncTask | chunks.132.mjs | function |
| wd7 | createForegroundTask | chunks.132.mjs | function |
| dR | agentLoopRunner | chunks.130.mjs:1961 | function (generator) |
| sP1 | loadTranscript | chunks.173.mjs:2722 | function |
| BQ1 | filterWhitespaceAssistant | chunks.173.mjs:1388 | function |
| mQ1 | filterThinkingOnlyAssistant | chunks.173.mjs:1435 | function |
| wP6 | stripOrphanedToolResults | chunks.173.mjs:344 | function |
| UEA | buildAgentResult | chunks.131.mjs:2514 | function |
| Nn7 | buildForkContextMessages | chunks.90.mjs:2529 | function |
| KNY | resolveTeamName | chunks.131.mjs:2546 | function |
| MM | isInProcessTeammate | chunks.48.mjs:234 | function |
| yjA | markTaskCompleted | chunks.89.mjs:1422 | function |
| CjA | markTaskFailed | chunks.89.mjs:1435 | function |
| vK1 | notifyTaskCompletion | chunks.89.mjs | function |
| ww | getOutputFilePath | chunks.89.mjs | function |
| eu1 | getTasksDir | chunks.89.mjs | function |
| xZ | prefixAgentId | chunks.89.mjs | function |
| hp | createTaskId | chunks.89.mjs:522 | function |
| IZ | createTaskRecord | chunks.89.mjs:528 | function |
| iVY | spawnTeammateDispatcher | chunks.129.mjs:2550 | function |
| dVY | spawnSplitPaneTeammate | chunks.129.mjs | function |
| nVY | BACKGROUND_HINT_THRESHOLD | chunks.132.mjs | constant |
| - | backgroundAgentFlag | chunks.132.mjs | constant (background: true flag) |

### Web Tool Symbols

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| JL | TOOL_NAME_WEB_SEARCH | chunks.47.mjs:621 | constant ("WebSearch") |
| xO | TOOL_NAME_WEB_FETCH | chunks.46.mjs:2559 | constant ("WebFetch") |
| - | WebFetchTool | chunks.47.mjs | tool object |
| - | WebSearchTool | chunks.46.mjs, chunks.14-15.mjs | tool object |
| - | htmlToMarkdown | chunks.47.mjs | function |
| - | extractWithPrompt | chunks.47.mjs | function |
| - | executeSearch | chunks.46.mjs | function |

---

## Module: LLM API

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $OA | contextCompactor | chunks.169.mjs:672 | function (generator, wraps lOq with compact check) |
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
| lOq | llmRequestGenerator | chunks.169.mjs:739 | function (generator) |
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
| V26 | withApiRetry | chunks.72.mjs:1861 | function (generator) |
| WJ | normalizeMessages | chunks.169.mjs:600 | function |
| x9z | applyEffortToRequest | chunks.169.mjs:566 | function |
| yd1 | abortStream | chunks.169.mjs:1336 | function |

---

## Module: Attachments & Reminders

> Full analysis: [03_llm_core/reminder_integration.md](../03_llm_core/reminder_integration.md), [04_system_reminder/](../04_system_reminder/)

### Core Attachment Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ui8 | normalizeAttachmentForAPI | chunks.174.mjs:1-469 | function |
| phY | assembleAttachments | chunks.142.mjs:1948 | function |
| oP1 | attachmentGenerator | chunks.142.mjs:2494 | function (generator) |
| gw | timedAttachmentProducer | chunks.142.mjs:1967 | function |
| kq | createHookMessage | chunks.142.mjs:2615 | function |
| dhY | buildQueuedCommandsAttachment | chunks.142.mjs:1993 | function |
| chY | countAssistantTurns | chunks.142.mjs:2003 | function |

### Attachment Producers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| KIY | extractAtMentionedFiles | chunks.142.mjs | function |
| zIY | extractMcpResources | chunks.142.mjs | function |
| YIY | extractAgentMentions | chunks.142.mjs | function |
| wIY | getChangedFilesAttachment | chunks.142.mjs:2285 | function |
| HIY | getNestedMemoryAttachments | chunks.142.mjs | function |
| $IY | getDynamicSkillAttachments | chunks.142.mjs | function |
| OIY | getSkillListingAttachment | chunks.142.mjs | function |
| thY | getUltraClaudeMdAttachment | chunks.142.mjs | function |
| ihY | getPlanModeAttachment | chunks.142.mjs:2034 | function |
| nhY | getPlanModeExitAttachment | chunks.142.mjs | function |
| rhY | getDelegateModeAttachment | chunks.142.mjs | function |
| ohY | getDelegateModeExitAttachment | chunks.142.mjs | function |
| NIY | getTaskReminderAttachment | chunks.142.mjs | function |
| fIY | getTodoReminderAttachment | chunks.142.mjs:2645 | function |
| kIY | getTeammateMailboxAttachment | chunks.142.mjs | function |
| LIY | getTeamContextAttachment | chunks.142.mjs | function |
| ahY | getCriticalSystemReminder | chunks.142.mjs | function |
| ehY | getIdeSelectionAttachment | chunks.142.mjs | function |
| qIY | getIdeOpenedFileAttachment | chunks.142.mjs | function |
| PIY | getDiagnosticsAttachment | chunks.142.mjs | function |
| WIY | getLspDiagnosticsAttachment | chunks.142.mjs | function |
| vIY | getUnifiedTasksAttachment | chunks.142.mjs:2719 | function |
| EIY | getAsyncHookResponsesAttachment | chunks.142.mjs | function |
| RIY | getTokenUsageAttachment | chunks.142.mjs:2815 | function |
| yIY | getBudgetUsdAttachment | chunks.142.mjs | function |
| SIY | getVerifyPlanReminderAttachment | chunks.142.mjs | function |
| E7 | isTeamMode | chunks.50.mjs:2543 | function |

### Reminder Formatting

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| b5 | wrapWithSystemReminderTags | chunks.173.mjs:2496-2523 | function |
| af | wrapInXmlTag | chunks.173.mjs:2490-2494 | function |
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

## Module: Agent Loop

> Full analysis: [03_llm_core/](../03_llm_core/)

### Loop Entry & Telemetry

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| QL4 | bootstrapTelemetry | chunks.cli.mjs (referenced) | function |
| ZR | mainAgentLoop | chunks.149.mjs:1753 | function (generator, REPL-facing agent loop entry) |
| T11 | handleStreamedEvent | chunks.188.mjs:542 | function (REPL stream event callback) |

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

### Task State Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bZ | registerTask | chunks.142.mjs:1676 | function |
| c5 | atomicUpdateTask | chunks.142.mjs:1662 | function |
| CjA | markTaskFailed | chunks.89.mjs:1435 | function |
| Hd7 | backgroundForegroundTask | chunks.89.mjs:~1515 | function |
| ia | isLocalAgentTask | chunks.89.mjs:~1402 | function |
| Kd7 | killAllRunningAgents | chunks.89.mjs:~1448 | function |
| na | killTask | chunks.89.mjs:~1375 | function |
| R61 | createChildAbortController | chunks.6.mjs:465 | function |
| RjA | reportToolProgress | chunks.89.mjs:1393 | function |
| Tq | registerProcessExitCleanup | chunks.1.mjs:4149 | function |
| u_6 | foregroundResolveMap | chunks.89.mjs:~1477 | variable (Map) |
| wd7 | createForegroundTask | chunks.89.mjs:1477 | function |
| Yd7 | updateTaskProgress | chunks.89.mjs:1407 | function |
| yjA | markTaskCompleted | chunks.89.mjs:1422 | function |
| zd7 | createAsyncTask | chunks.89.mjs:1447 | function |

### Subagent Context Creation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| vQ1 | deriveToolUseContext | chunks.149.mjs:2589 | function |
| av | runForkedAgent | chunks.149.mjs:2634 | function |
| NR | generateAgentId | chunks.90.mjs:2343 | function |
| Nn7 | buildForkContextMessages | chunks.90.mjs:2529 | function |
| p1 | createUserMessage | chunks.173.mjs:1378 | function |
| gL9 | generateUUID | chunks.90.mjs | function |

### Agent Definitions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| hh | mergeAgentDefinitions | chunks.91.mjs:3 | function |
| KPA | validateMcpServers | chunks.91.mjs:17 | function |
| un7 | filterByMcpServers | chunks.91.mjs:22 | function |
| ZB1 | GENERAL_PURPOSE_AGENT | chunks.90.mjs:2622 | object (agent def) |
| bv | EXPLORE_AGENT | chunks.90.mjs:2808 | object (agent def) |
| PJ6 | PLAN_AGENT | chunks.90.mjs:2878 | object (agent def) |
| Tn7 | BASH_AGENT | chunks.90.mjs:2608 | object (agent def) |
| Rn7 | CLAUDE_CODE_GUIDE_AGENT | chunks.90.mjs:2904 | object (agent def) |
| En7 | STATUSLINE_SETUP_AGENT | chunks.90.mjs:2650 | object (agent def) |

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
| M_6 | readFullOutput | chunks.89.mjs:300 | function |
| Rp7 | cleanupOutputFiles | chunks.89.mjs:328 | function |
| $C | TOOL_NAME_TASK_OUTPUT | chunks.40.mjs:421 | constant ("TaskOutput") |
| vp7 | outputWriteQueue | chunks.89.mjs:340 | variable (Map) |
| WjA | readOutputFileDelta | chunks.89.mjs:276 | function |
| ww | getOutputFilePath | chunks.89.mjs:249 | function |
| ZK1 | writeOutputChunk | chunks.89.mjs:253 | function |

### TaskOutput & TaskStop Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| EW6 | buildTaskSnapshot | chunks.139.mjs:1687 | function |
| kW6 | TaskOutputTool | chunks.139.mjs:~1922 | object |
| Ng1 | truncateTaskOutput | chunks.139.mjs:1664 | function |
| nyY | pollUntilDone | chunks.139.mjs:1716 | function |
| Vg1 | getKillHandlerForType | chunks.142.mjs:1652 | function |
| vW6 | TaskStopTool | chunks.139.mjs:~1537 | object |

### Agent Loop & Execution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| dR | agentLoopRunner | chunks.130.mjs:1961 | function (generator) |
| GVY | inProcessAgentRunner | chunks.131.mjs:348 | function |
| p01 | runWithAgentIdentity | chunks.80.mjs:2353 | function |
| WVY | pollForNextMessage | chunks.131.mjs:260 | function |
| ss | parseShutdownRequest | chunks.131.mjs | function |
| ib4 | getUnclaimedTaskPrompt | chunks.131.mjs:336 | function |

### Result Building

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| qNY | countToolUses | chunks.131.mjs:2250 | function |
| UEA | buildAgentResult | chunks.131.mjs:2514 | function |

### Communication (Mailbox System)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _Q1 | fileLockSync | chunks.129.mjs:1114 | object |
| f9 | writeToMailbox | chunks.129.mjs:1107 | function |
| JQ1 | markMessageAsReadByIndex | chunks.129.mjs:1130 | function |
| Ld | readMailbox | chunks.129.mjs:1089 | function |
| z51 | readUnreadMessages | chunks.129.mjs:1101 | function |

### Transcript Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| BQ1 | filterWhitespaceAssistant | chunks.173.mjs:1388 | function |
| ld1 | buildConversationChain | chunks.143.mjs:850 | function |
| mQ1 | filterThinkingOnlyAssistant | chunks.173.mjs:1435 | function |
| sP1 | loadTranscript | chunks.173.mjs:2722 | function |
| wP6 | stripOrphanedToolResults | chunks.173.mjs:344 | function |

### Path Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| kh | getSessionPathForSubagent | chunks.1.mjs:2500 | function |
| xZ | prefixAgentId | chunks.89.mjs:894 | function |

### Spawn Dispatch & Backends

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| cVY | spawnSeparateWindowTeammate | chunks.129.mjs:2700 | function |
| dVY | spawnSplitPaneTeammate | chunks.129.mjs:2650 | function |
| iVY | spawnTeammateDispatcher | chunks.129.mjs:2550 | function |
| LP1 | spawnInProcessTeammate | chunks.123.mjs:242 | function |
| Rj6 | killInProcessTeammate | chunks.123.mjs:326 | function |

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
| Gf6 | createStore | chunks.151.mjs:398 | function |
| gG1 | initialAppState | chunks.151.mjs:419 | function |
| jA | updateGlobalConfig | chunks.174.mjs:1460 | function |
| l4 | getUserSettings | chunks.151.mjs:410 | function |
| L7 | useSetAppState | chunks.151.mjs:591 | hook |
| o6 | internalStateObject | chunks.1.mjs:3052 | object |
| pcA | generateSessionId | chunks.1.mjs:2340 | function |
| QD | getDefaultPermissionContext | chunks.151.mjs:400 | function |
| u_ | AppStateProvider | chunks.151.mjs:522 | component |
| v6 | useAppState | chunks.151.mjs:576 | hook |
| Wf6 | getInitialPromptSuggestionEnabled | chunks.151.mjs:415 | function |
| yhA | useStoreContext | chunks.151.mjs:574 | hook |
| yt | resumeSession | chunks.142.mjs:379 | function |
| Zw6 | initialAttributionState | chunks.151.mjs:412 | function |
