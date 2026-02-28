# Symbol Index - Core Execution (Claude Code 2.1.38)

> Symbol mapping table Part 1: Core execution flow modules
> Lookup: Browse by module, or Ctrl+F search for obfuscated/readable name.

---

## Quick Navigation

- [State Management](#module-state-management)
- [Agent Loop](#module-agent-loop)
- [LLM API](#module-llm-api)
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
| Jq | TOOL_NAME_READ | chunks.46.mjs:2634 | constant ("Read") |
| vj | FileWriteTool | chunks.146.mjs:436 | tool object |
| f5 | TOOL_NAME_WRITE | chunks.134.mjs | constant ("Write") |
| sW | EditTool | chunks.134.mjs:2124 | tool object |
| bq | TOOL_NAME_EDIT | chunks.134.mjs | constant ("Edit") |
| gd | NotebookEditTool | chunks.134.mjs:2615 | tool object |
| tS | GrepTool | chunks.76.mjs:1129 | tool object |
| WB | GlobTool | chunks.76.mjs:1495 | tool object |
| wt | SkillTool | chunks.132.mjs:820 | tool object |
| avA | AgentTool (Task) | chunks.132.mjs | tool object |
| BYq | BashOutputComponent | chunks.162.mjs:417249 | component |

### Edit Tool Symbols

| Obfuscated | Readable | File:Line | Type |
|---|---|---|---|
| jM | TOOL_NAME_NOTEBOOK_EDIT | chunks.134.mjs | constant |
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
| aW | getModificationTime | chunks.134.mjs | function |
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

### Tool Execution Pipeline

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $E | isMcpTool | chunks.149.mjs:420 | function |
| b1q | executePostToolHooksIterator | chunks.149.mjs:3 | function (generator) |
| B1q | executePreToolHooksIterator | chunks.149.mjs:161 | function (generator) |
| bU1 | toolDispatcher | chunks.149.mjs:343 | function (generator) |
| c6 | createUserMessage | chunks.149.mjs:340 | function |
| g1q | bashPreFlightCheck | chunks.149.mjs:460 | function |
| kq | createHookMessage | chunks.149.mjs:80 | function |
| kt | getDynamicToolSet | chunks.149.mjs:350 | function |
| NdY | toolExecutionPipeline | chunks.149.mjs:490 | function |
| Tv | findTool | chunks.149.mjs:345 | function |
| u1q | executePostToolFailureHooksIterator | chunks.149.mjs:90 | function (generator) |
| VdY | toolExecutionOrchestrator | chunks.149.mjs:448 | function |
| W74 | markAsLongRunning | chunks.149.mjs:470 | function |
| x1q | formatValidationError | chunks.149.mjs:500 | function |

### Team/Swarm Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| tc4 | TeamCreateTool | chunks.141.mjs:377 | tool |
| YhY | SendMessageTool | chunks.141.mjs:1373 | tool |

---

## Module: LLM API

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $OA | contextCompactor | chunks.169.mjs:672 | function (generator, wraps lOq with compact check) |
| Af6 | accumulateUsage | chunks.169.mjs:1365 | function |
| b9z | wrapUserMessageWithCache | chunks.169.mjs:1385 | function |
| bq6 | calculateCost | chunks.47.mjs:1605 | function |
| dOq | nonStreamingFallback | chunks.169.mjs:710 | function (generator) |
| e51 | mergeUsage | chunks.169.mjs:1343 | function |
| g9z | capMaxTokens | chunks.169.mjs:1481 | function |
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
| Bj1 | BACKGROUND_AGENT_ALLOWED_TOOLS | chunks.89.mjs:~540 | constant (Set) |
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
| c5 | atomicUpdateTask | chunks.89.mjs:TBD | function |
| CjA | markTaskFailed | chunks.89.mjs:~1495 | function |
| Hd7 | backgroundForegroundTask | chunks.89.mjs:~1515 | function |
| ia | isLocalAgentTask | chunks.89.mjs:~1402 | function |
| Kd7 | killAllRunningAgents | chunks.89.mjs:~1448 | function |
| na | killTask | chunks.89.mjs:~1375 | function |
| R61 | createChildAbortController | chunks.89.mjs:TBD | function |
| RjA | updateTaskProgress | chunks.89.mjs:~1453 | function |
| Tq | registerProcessExitCleanup | chunks.89.mjs:TBD | function |
| u_6 | foregroundResolveMap | chunks.89.mjs:~1477 | variable (Map) |
| wd7 | createForegroundTask | chunks.89.mjs:~1477 | function |
| Yd7 | updateProgressSummary | chunks.89.mjs:~1467 | function |
| yjA | markTaskCompleted | chunks.89.mjs:~1482 | function |
| zd7 | createAsyncTask | chunks.89.mjs:~1447 | function |

### Progress Tracking

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| cD | THINKING_TOOL_NAME | chunks.89.mjs:TBD | constant |
| cv9 | MAX_RECENT_ACTIVITIES | chunks.89.mjs:TBD | constant |
| LjA | computeTotalTokens | chunks.89.mjs:~1307 | function |
| Qj1 | trackProgressFromMessage | chunks.89.mjs:1307 | function |
| wB1 | createActivityDescriptionResolver | chunks.89.mjs:~1396 | function |
| x_6 | classifyToolActivity | chunks.89.mjs:TBD | function |
| zB1 | getProgressSnapshot | chunks.89.mjs:1327 | function |

### Task Notification & Command Queue

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bp7 | drainQueue | chunks.89.mjs:~503 | function |
| Cp7 | queueEpochCounter | chunks.89.mjs:TBD | variable (number) |
| dP | AGENT_ID_TAG | chunks.89.mjs:TBD | constant |
| G_6 | notifyQueueSubscribers | chunks.89.mjs:~381 | function |
| hp7 | getPendingTaskCount | chunks.89.mjs:~380 | function |
| Ip7 | hasQueuedTasks | chunks.89.mjs:~495 | function |
| KY | isHeadlessSession | chunks.89.mjs:TBD | function |
| lB | enqueueOrBuffer | chunks.89.mjs:~407 | function |
| ND | STATUS_TAG | chunks.89.mjs:TBD | constant |
| NO | TASK_NOTIFICATION_TAG | chunks.89.mjs:TBD | constant |
| TD | MESSAGE_TAG | chunks.89.mjs:TBD | constant |
| vK1 | notifyTaskCompletion | chunks.89.mjs:1346 | function |
| W_6 | commandSubscribers | chunks.89.mjs:~415 | variable (Set) |
| WR | enqueueCommand | chunks.89.mjs:~402 | function |
| xj1 | commandQueue | chunks.89.mjs:TBD | variable (Array) |
| xp7 | getQueueLength | chunks.89.mjs:~499 | function |

### Output File I/O

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bj1 | TASK_STOP_TOOL_NAME | chunks.89.mjs:~550 | constant ("TaskStop") |
| eu1 | getTasksDir | chunks.89.mjs:238 | function |
| hj1 | initOutputFile | chunks.89.mjs:310 | function |
| Ij1 | symlinkOutputFile | chunks.89.mjs:317 | function |
| M_6 | readFullOutput | chunks.89.mjs:300 | function |
| Rp7 | cleanupOutputFiles | chunks.89.mjs:328 | function |
| uj1 | TASK_OUTPUT_TOOL_NAME | chunks.89.mjs:~551 | constant ("TaskOutput") |
| vp7 | outputWriteQueue | chunks.89.mjs:340 | variable (Map) |
| WjA | readOutputFileDelta | chunks.89.mjs:276 | function |
| ww | getOutputFilePath | chunks.89.mjs:249 | function |
| ZK1 | writeOutputChunk | chunks.89.mjs:253 | function |

### TaskOutput & TaskStop Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| EW6 | buildTaskSnapshot | chunks.139.mjs:TBD | function |
| kW6 | TaskOutputTool | chunks.139.mjs:~1922 | object |
| Ng1 | truncateTaskOutput | chunks.139.mjs:TBD | function |
| nyY | pollUntilDone | chunks.139.mjs:TBD | function |
| Vg1 | getKillHandlerForType | chunks.139.mjs:TBD | function |
| vW6 | TaskStopTool | chunks.139.mjs:~1537 | object |

### Agent Loop & Execution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| dR | agentLoopRunner | chunks.107.mjs:2100 | function (generator) |
| GVY | inProcessAgentRunner | chunks.129.mjs:2400 | function |
| p01 | withTelemetrySpan | chunks.132.mjs:268 | function |
| WVY | inProcessPollLoop | chunks.129.mjs:2300 | function (generator) |

### Result Building

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| qNY | countToolUses | chunks.129.mjs:2250 | function |
| UEA | buildAgentResult | chunks.129.mjs:2500 | function |

### Communication (Mailbox System)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _Q1 | fileLockSync | chunks.143.mjs:500 | object |
| f9 | writeToMailbox | chunks.143.mjs:550 | function |
| JQ1 | markMessageAsReadByIndex | chunks.143.mjs:600 | function |
| Ld | readMailbox | chunks.143.mjs:520 | function |

### Transcript Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| BQ1 | filterWhitespaceAssistant | chunks.143.mjs:780 | function |
| ld1 | buildConversationChain | chunks.143.mjs:850 | function |
| mQ1 | filterThinkingOnlyAssistant | chunks.143.mjs:760 | function |
| sP1 | loadTranscript | chunks.143.mjs:700 | function |
| wP6 | stripOrphanedToolResults | chunks.143.mjs:730 | function |

### Path Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| kh | getSessionPathForSubagent | chunks.1.mjs:2500 | function |
| xZ | prefixAgentId | chunks.132.mjs:TBD | function |

### Spawn Dispatch & Backends

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| cVY | spawnSeparateWindowTeammate | chunks.129.mjs:2700 | function |
| dVY | spawnSplitPaneTeammate | chunks.129.mjs:2650 | function |
| iVY | spawnTeammateDispatcher | chunks.129.mjs:2550 | function |
| LP1 | spawnInProcessTeammate | chunks.129.mjs:2600 | function |

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
