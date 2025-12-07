# Symbol Index

> 唯一的符号映射表。各模块文档不再维护 mapping。
> 查找方式：按模块浏览，或 Ctrl+F 搜索混淆名/可读名。

---

## Module: Plan Mode

### EnterPlanMode Tool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| A71 | ENTER_PLAN_MODE_NAME | chunks.130.mjs | constant |
| Id2 | enterPlanModeDescription | chunks.130.mjs:2199-2272 | constant |
| cTA | EnterPlanModeTool | chunks.130.mjs:2336-2398 | object |
| Dd2 | EnterPlanModeConfirmUI | chunks.130.mjs:2401-2449 | function |

### ExitPlanMode Tool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| rRA | EXIT_PLAN_MODE_NAME | chunks.130.mjs | constant |
| TXZ | exitPlanModeDescriptionSimple | chunks.130.mjs:1702-1717 | constant |
| am2 | exitPlanModeDescriptionFile | chunks.130.mjs:1717-1741 | constant |
| gq | ExitPlanModeTool | chunks.130.mjs:1850-1928 | object |

### Plan File Persistence

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| kU | getPlansDirectory | chunks.88.mjs:810-817 | function |
| yU | getPlanFilePath | chunks.88.mjs:820-825 | function |
| xU | readPlanFile | chunks.88.mjs:828-837 | function |
| dA5 | getUniquePlanSlug | chunks.88.mjs:790-803 | function |
| ueB | generateRandomPlanSlug | chunks.88.mjs:770-785 | function |
| qFA | getPlanSlugCache | chunks.88.mjs | function |
| mA5 | PLAN_SLUG_RETRY_COUNT | chunks.88.mjs | constant |
| feB | PLAN_ADJECTIVES_LIST | chunks.88.mjs | constant |
| geB | PLAN_ACTIONS_LIST | chunks.88.mjs | constant |
| heB | PLAN_NOUNS_LIST | chunks.88.mjs | constant |
| Yo1 | randomSelect | chunks.88.mjs | function |

### Plan Mode State

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Jz0 | hasExitedPlanMode | chunks.1.mjs:2807 | function |
| ou | setHasExitedPlanMode | chunks.1.mjs:2811 | function |
| VH5 | getPlanModeAttachment | chunks.107.mjs:1886-1908 | function |
| XH5 | checkPlanModeThrottle | chunks.107.mjs:~1892 | function |
| IH5 | PLAN_MODE_THROTTLE_CONFIG | chunks.107.mjs | constant |

### Plan Mode System Prompts

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Sb3 | generateMainAgentPlanMode | chunks.153.mjs:2890-2964 | function |
| _b3 | generateSubAgentPlanMode | chunks.153.mjs:2966-2977 | function |
| jb3 | generatePlanModeInstructions | chunks.153.mjs:2885-2888 | function |

### Explore Agent

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| li5 | exploreAgentSystemPrompt | chunks.125.mjs:1370-1404 | constant |
| xq | exploreAgent | chunks.125.mjs:1404-1413 | object |

### Plan Agent

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ii5 | planAgentSystemPrompt | chunks.125.mjs:1425-1474 | constant |
| kWA | planAgent | chunks.125.mjs:1474-1484 | object |

### Agent Count Configuration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| uE9 | getPlanAgentCount | chunks.153.mjs:2062-2072 | function |
| mE9 | getExploreAgentCount | chunks.153.mjs:2074-2080 | function |

---

## Module: Core Entry & CLI

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| mu3 | mainEntry | chunks.158.mjs:1-50 | function |
| hu3 | commandHandler | chunks.158.mjs:51-150 | function |
| FU9 | initializeConfig | chunks.158.mjs:200-300 | function |
| ju3 | runMigrations | chunks.158.mjs:300-400 | function |
| VG | renderInteractive | chunks.158.mjs:400-500 | function |
| Rw9 | runNonInteractive | chunks.158.mjs:500-600 | function |
| WVA | MainInteractiveApp | chunks.158.mjs:600-900 | function |
| f0 | appState | chunks.158.mjs:500-700 | object |
| Yu | stateUpdateCallback | chunks.158.mjs:700-750 | function |
| $T | loadSettings | chunks.158.mjs:200-250 | function |
| e1 | getSessionId | chunks.158.mjs:250-280 | function |
| MQ | getClaudeDataDirectory | chunks.1.mjs:886 | function |
| WQ | globalState | chunks.1.mjs | object |

---

## Module: Agent Loop

### Main Loop Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| O$ | mainAgentLoop | chunks.146.mjs:1716-1977 | function |
| EV0 | StreamingToolExecutor | chunks.146.mjs:1335-1449 | class |
| OY1 | executeSingleTool | chunks.146.mjs:2193-2254 | function |
| mk3 | groupToolsByConcurrency | chunks.146.mjs:2154-2166 | function |
| ck3 | executeToolsInParallel | chunks.146.mjs:2183-2187 | function |
| dk3 | executeToolsSerially | chunks.146.mjs:2168-2181 | function |
| hk3 | getMaxToolConcurrency | chunks.146.mjs | function |
| pX9 | removeFromInProgressSet | chunks.146.mjs | function |
| SYA | mergeAsyncGenerators | chunks.146.mjs | function |

### API Calling

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| RYA | streamingApiCallWrapper | chunks.152.mjs:2836-2847 | function |
| wy | nonStreamingApiCall | chunks.152.mjs:2820-2834 | function |
| Ao1 | wrapMessageStream | chunks.152.mjs:2800-2818 | function |

### Context & State

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Pt | selectModelForPermissionMode | chunks.146.mjs:1790-1794 | function |
| BSA | createSubAgentContext | chunks.145.mjs:915 | function |
| gQA | injectClaudeMdContext | chunks.146.mjs:989-1003 | function |

---

## Module: LLM API

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $E9 | streamApiCall | chunks.153.mjs:3-361 | function |
| t61 | retryWrapper | chunks.121.mjs:1988-2046 | function |
| Kq | createApiClient | chunks.88.mjs:3-105 | function |
| U | buildRequestPayload | chunks.153.mjs:100-200 | function |
| ljA | mergeUsage | chunks.153.mjs:370-386 | function |
| mv3 | applyMessageCacheBreakpoints | chunks.153.mjs:406-413 | function |
| dv3 | applySystemCacheBreakpoints | chunks.153.mjs:415-423 | function |
| UQ0 | getDefaultMaxTokens | chunks.153.mjs:478-493 | function |
| UK0 | cleanupStream | chunks.153.mjs:363-368 | function |

---

## Module: System Prompts & Reminders

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| gCB | getCoreSystemPrompt | chunks.152.mjs:1-100 | function |
| rnA | getSessionTypeIdentity | chunks.107.mjs:50-100 | function |
| HE9 | getMCPToolsPrompt | chunks.107.mjs:100-200 | function |
| R91 | getSummarizationPrompt | chunks.107.mjs:537-733 | function |
| JH5 | generateAllAttachments | chunks.107.mjs:1813-1829 | function |
| aY | wrapWithErrorHandling | chunks.107.mjs:1832-1856 | function |
| FH5 | criticalSystemReminder | chunks.107.mjs:378-386 | function |
| wH5 | generateChangedFiles | chunks.107.mjs:1860-1920 | function |
| qH5 | generateNestedMemory | chunks.107.mjs:1920-1960 | function |
| DH5 | generateUltraClaudeMd | chunks.107.mjs:1960-2000 | function |
| _H5 | generateTodoReminders | chunks.107.mjs:2050-2100 | function |
| vH5 | generateTeammateMailbox | chunks.107.mjs:2100-2150 | function |
| SH5 | countTurnsSinceTodoWrite | chunks.107.mjs:2358-2377 | function |
| l9 | createAttachment | chunks.107.mjs:2349 | function |
| kb3 | convertAttachmentToSystemMessage | chunks.154.mjs:3-321 | function |
| kSA | createToolUseMessage | chunks.154.mjs:343-348 | function |
| _SA | createToolResultMessage | chunks.154.mjs:324-341 | function |
| $y | createInformationalMessage | chunks.154.mjs:350-364 | function |
| z60 | createLocalCommandMessage | chunks.154.mjs:383-393 | function |
| S91 | createCompactBoundaryMessage | chunks.154.mjs:395-402 | function |
| Qu | wrapSystemReminderText | chunks.153.mjs:2850-2854 | function |
| NG | wrapInSystemReminder | chunks.153.mjs:2856-2883 | function |
| R0 | createMetaBlock | chunks.153.mjs:2179-2204 | function |
| gQA | injectClaudeMdContext | chunks.146.mjs:989-1003 | function |

> Plan mode prompts: See [Module: Plan Mode](#module-plan-mode)

---

## Module: Tools

### Tool Name Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| C9 | BASH_TOOL_NAME | chunks.16.mjs:1367 | constant |
| d5 | READ_TOOL_NAME | chunks.19.mjs:499 | constant |
| wX | WRITE_TOOL_NAME | chunks.19.mjs:2176 | constant |
| $5 | EDIT_TOOL_NAME | chunks.19.mjs:449 | constant |
| iK | GLOB_TOOL_NAME | chunks.19.mjs:2147 | constant |
| xY | GREP_TOOL_NAME | chunks.19.mjs:2172 | constant |
| A6 | TASK_TOOL_NAME | chunks.19.mjs | constant |
| QEB | TODOWRITE_TOOL_NAME | chunks.60.mjs:1124 | constant |
| $X | WEBFETCH_TOOL_NAME | chunks.19.mjs:428 | constant |
| WS | WEBSEARCH_TOOL_NAME | chunks.19.mjs:2232 | constant |
| JS | NOTEBOOKEDIT_TOOL_NAME | chunks.19.mjs:2192 | constant |

### Tool Definition Objects

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| D9 | BashTool | chunks.154.mjs | object |
| n8 | ReadTool | chunks.88.mjs | object |
| BY | TodoWriteTool | chunks.60.mjs:1141-1211 | object |
| lD | EditTool | chunks.153.mjs | object |
| QV | WriteTool | chunks.153.mjs | object |
| pJ | AskUserQuestionTool | chunks.153.mjs | object |

> Plan mode tools: See [Module: Plan Mode](#module-plan-mode)

### Tool Helper Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| wY1 | getBuiltinTools | chunks.146.mjs:891-893 | function |
| DV0 | getEnabledToolNames | chunks.146.mjs:885-889 | function |
| LC | getEnabledTools | chunks.146.mjs:903-912 | function |
| r51 | convertToolForAPI | chunks.146.mjs:952-966 | function |
| L_ | atomicWriteFile | chunks.154.mjs:2153 | function |
| z8 | quotePathArray | chunks.154.mjs | function |

### Tool Execution Pipeline

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| EV0 | StreamingToolExecutor | chunks.146.mjs:1335-1449 | class |
| VX0 | executeToolsByGroup | chunks.146.mjs:2113-2152 | function |
| mk3 | groupToolsByConcurrency | chunks.146.mjs:2154-2166 | function |
| dk3 | executeToolsSerially | chunks.146.mjs:2168-2181 | function |
| ck3 | executeToolsInParallel | chunks.146.mjs:2183-2187 | function |
| OY1 | executeSingleTool | chunks.146.mjs:2193-2254 | function |
| pk3 | wrapToolExecution | chunks.146.mjs:2256-2279 | function |
| lk3 | executeToolWithValidation | chunks.146.mjs:2281-2400 | function |
| pX9 | removeFromInProgressSet | chunks.146.mjs:2189-2191 | function |
| vk3 | removeToolFromContext | chunks.146.mjs:1451-1453 | function |
| hk3 | getMaxToolConcurrency | chunks.146.mjs:1697-1699 | function |
| SYA | parallelGeneratorWithLimit | chunks.107.mjs:2626-2659 | function |

### Tool Restriction Sets

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| CTA | ALWAYS_EXCLUDED_TOOLS | chunks.146.mjs:949 | constant |
| Qf2 | BUILTIN_ONLY_TOOLS | chunks.146.mjs:949 | constant |
| Bf2 | ASYNC_SAFE_TOOLS | chunks.146.mjs:949 | constant |

### Additional Tool Definitions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| jn | TaskTool | chunks.145.mjs:1812-2015 | object |
| CY1 | BashOutputTool | chunks.145.mjs:2281-2400 | object |
| HY1 | KillShellTool | chunks.145.mjs | object |
| Wa | AGENTOUTPUT_TOOL_NAME | chunks.139.mjs:1576 | constant |
| zO | GlobTool | chunks.125.mjs:894 | object |
| Py | GrepTool | chunks.125.mjs:555 | object |
| kP | NotebookEditTool | chunks.123.mjs:2036 | object |
| nV | WebFetchTool | chunks.130.mjs:1232 | object |

### Background Shell Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Fo1 | createBackgroundShell | chunks.88.mjs:1408-1470 | function |
| G15 | generateShellId | chunks.88.mjs | function |
| J01 | extractShellData | chunks.88.mjs | function |
| mJ9 | filterOutput | chunks.145.mjs | function |
| IV0 | truncateIfNeeded | chunks.145.mjs | function |

---

## Module: Agents

### Built-in Agent Definitions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| o51 | generalPurposeAgent | chunks.125.mjs:1243-1267 | object |
| Gf2 | statuslineSetupAgent | chunks.125.mjs:1272-1360 | object |
| iCB | claudeCodeGuideAgent | chunks.60.mjs:783-897 | object |
| N70 | getBuiltInAgents | chunks.125.mjs:1489-1493 | function |

> Plan mode agents (xq, kWA): See [Module: Plan Mode](#module-plan-mode)

### Agent Helper Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ob2 | taskToolDescription | chunks.125.mjs:988-1057 | function |
| w70 | filterToolsForSubagent | chunks.125.mjs:1116-1128 | function |
| Sn | resolveAgentTools | chunks.125.mjs:1130-1176 | function |
| Af2 | agentEntryMessage | chunks.125.mjs:1178-1223 | function |
| BSA | createSubAgentContext | chunks.145.mjs:915-960 | function |
| ky | deduplicateAgentsByPriority | chunks.125.mjs:1629-1641 | function |
| Kf2 | loadAllAgents | chunks.125.mjs:1799-1846 | function |
| $O | isBuiltInAgent | chunks.125.mjs | function |
| inA | resolveAgentModel | chunks.59.mjs:3028-3037 | function |

> Agent count functions (uE9, mE9): See [Module: Plan Mode](#module-plan-mode)

---

## Module: Subagent Execution

### Task Tool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| A6 | TASK_TOOL_NAME | chunks.19.mjs:2156 | constant |
| jn | TaskTool | chunks.145.mjs:1812-2015 | object |
| OJ9 | taskInputSchema | chunks.145.mjs:1771-1778 | object |
| mtZ | asyncTaskInputSchema | chunks.145.mjs:1777-1778 | object |
| P_3 | completedOutputSchema | chunks.145.mjs:1803-1806 | object |
| j_3 | asyncLaunchedOutputSchema | chunks.145.mjs:1806-1811 | object |
| S_3 | taskOutputSchemaUnion | chunks.145.mjs:1811 | object |

### AgentOutputTool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Wa | AGENTOUTPUT_TOOL_NAME | chunks.139.mjs:1576 | constant |
| VtZ | agentOutputInputSchema | chunks.145.mjs:1683-1687 | object |

### Subagent Execution Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| XY1 | executeAgent | chunks.145.mjs:1069-1190 | function |
| YY1 | executeForkAgent | chunks.145.mjs:962-1026 | function |
| SWA | generateAgentId | chunks.125.mjs:1106-1108 | function |
| KY1 | loadTranscript | chunks.154.mjs:1243-1267 | function |
| EJ9 | recordSidechainTranscript | chunks.154.mjs:908-910 | function |
| Bz9 | filterTranscriptEvents | chunks.154.mjs:1269-1275 | function |
| sX0 | filterUnresolvedToolUses | chunks.145.mjs:1192-1220 | function |

### Model Resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| inA | resolveAgentModel | chunks.59.mjs:3028-3038 | function |
| UD | resolveModelName | chunks.59.mjs:2998-3008 | function |
| Pt | getModelForPermissionMode | chunks.59.mjs:2792-2801 | function |
| Jh1 | DEFAULT_MODEL | chunks.59.mjs | constant |

### Tool Restriction Sets

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| CTA | ALWAYS_BLOCKED_TOOLS | chunks.146.mjs:949 | constant |
| Qf2 | NON_BUILTIN_BLOCKED_TOOLS | chunks.146.mjs:949 | constant |
| Bf2 | ASYNC_ALLOWED_TOOLS | chunks.146.mjs:949 | constant |

### Background Agent Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| hH5 | checkAsyncAgentStatus | chunks.107.mjs:2522-2551 | function |
| S69 | getQuerySource | chunks.145.mjs:1880 | function |

### Agent Colors

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| j0A | AGENT_COLORS | chunks.125.mjs:1089 | constant |
| HTA | AGENT_COLOR_MAP | chunks.125.mjs:1090-1098 | constant |
| PWA | getAgentColor | chunks.125.mjs:1067-1072 | function |
| jWA | setAgentColor | chunks.125.mjs:1074-1081 | function |

### Subagent Context Properties

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| JU0 | createIsolatedAbortController | chunks.145.mjs:916 | function |
| E_3 | generateChainId | chunks.145.mjs:953 | function |

---

## Module: Todo List

### Tool & Schema

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| BY | TodoWriteTool | chunks.60.mjs:1141-1211 | object |
| QEB | TODOWRITE_TOOL_NAME | chunks.60.mjs:1124 | constant |
| nCB | todoWritePrompt | chunks.60.mjs:903-1086 | constant |
| aCB | todoWriteDescription | chunks.60.mjs:901 | constant |
| IJ6 | TodoStatusEnum | chunks.60.mjs:1097 | constant |
| YJ6 | TodoItemSchema | chunks.60.mjs:1097-1101 | object |
| V7A | TodoArraySchema | chunks.60.mjs:1101 | object |
| JJ6 | TodoWriteInputSchema | chunks.60.mjs:1136 | object |
| WJ6 | TodoWriteOutputSchema | chunks.60.mjs:1138-1140 | object |

### Render Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| rCB | renderToolUseMessage | chunks.60.mjs:1104 | function |
| oCB | renderToolUseProgressMessage | chunks.60.mjs:1108 | function |
| tCB | renderToolUseRejectedMessage | chunks.60.mjs:1112 | function |
| eCB | renderToolUseErrorMessage | chunks.60.mjs:1116 | function |
| AEB | renderToolResultMessage | chunks.60.mjs:1120 | function |

### File Persistence

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| x00 | getTodosDirectory | chunks.106.mjs:1847-1851 | function |
| Ri | getTodoFilePath | chunks.106.mjs:1853-1856 | function |
| Nh | readTodosFromFile | chunks.106.mjs:1858-1860 | function |
| UYA | writeTodosToFile | chunks.106.mjs:1862-1864 | function |
| hZ2 | parseJsonTodoFile | chunks.106.mjs:1885-1895 | function |
| gZ2 | writeJsonTodoFile | chunks.106.mjs:1897-1903 | function |
| vK5 | migrateTodosBetweenSessions | chunks.106.mjs:1873-1883 | function |
| fD5 | postCompactTodoRestore | chunks.107.mjs:1271-1280 | function |

### UI Components

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Yn | TodoListComponent | chunks.118.mjs:1036-1064 | function |
| OO2 | SpinnerWithTodos | chunks.118.mjs:1317-1460 | function |
| F69 | toggleTodosHandler | chunks.142.mjs:2475-2486 | function |
| AD9 | TodosCommandComponent | chunks.149.mjs:2465-2478 | function |
| Cx3 | todosSlashCommand | chunks.149.mjs:2493-2516 | object |

### Reminder System

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| SH5 | countTurnsSinceTodoWrite | chunks.107.mjs:2358-2377 | function |
| _H5 | generateTodoReminders | chunks.107.mjs:2379-2394 | function |
| GY2 | todoReminderConstants | chunks.107.mjs:2610-2614 | object |
| GY2.TURNS_SINCE_WRITE | TODO_TURNS_SINCE_WRITE | 7 | constant |
| GY2.TURNS_BETWEEN_REMINDERS | TODO_TURNS_BETWEEN | 3 | constant |
| kb3 | convertAttachmentToSystemMessage | chunks.154.mjs:3-321 | function |
| NQ0 | isSkippableMessage | chunks.107.mjs | function |

### Helper Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| iO3 | extractTodosFromSessionLog | chunks.139.mjs:309 | function |
| H1 | figuresIcons | chunks.16.mjs:889 | object |
| AH1 | isUnicodeSupported | chunks.16.mjs | function |

---

## Module: Compact

### Core Compact Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| j91 | fullCompact | chunks.107.mjs:1120-1237 | function |
| sI2 | autoCompactDispatcher | chunks.107.mjs:1707-1731 | function |
| Si | microCompactToolResults | chunks.107.mjs:1440-1545 | function |
| f91 | tryMicroCompact | chunks.107.mjs:1621-1645 | function |
| tD5 | shouldTriggerAutoCompact | chunks.107.mjs:1698-1705 | function |
| x1A | calculateThresholds | chunks.107.mjs:1677-1691 | function |
| aI2 | getAutoCompactThreshold | chunks.107.mjs:1663-1674 | function |
| b1A | isAutoCompactEnabled | chunks.107.mjs:1694-1695 | function |

### Message Selection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| nk | keepMessagesAfterLastBoundary | chunks.154.mjs:438-442 | function |
| WZ | filterAndNormalizeMessages | chunks.153.mjs:2547-2607 | function |
| yb3 | findLastBoundaryMarkerIndex | chunks.154.mjs | function |
| lh | isBoundaryMarker | chunks.154.mjs | function |
| NQ0 | isThinkingOnlyBlock | chunks.107.mjs | function |
| wb3 | isSyntheticErrorMessage | chunks.153.mjs | function |
| u59 | isUserMessageVisible | chunks.153.mjs | function |

### Summary Generation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| T91 | formatSummaryContent | chunks.107.mjs:754-760 | function |
| MD5 | cleanupSummaryTags | chunks.107.mjs:735-752 | function |

### Context Restoration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bD5 | restoreFileReads | chunks.107.mjs:1248-1269 | function |
| fD5 | restoreTodoList | chunks.107.mjs:1271-1280 | function |
| XQ0 | restorePlanFile | chunks.107.mjs:1282-1291 | function |
| GA2 | getReadFileState | chunks.107.mjs | function |
| hD5 | isAgentFile | chunks.107.mjs | function |
| VQ0 | readFileWithLimits | chunks.107.mjs | function |

### Token Counting

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ZK | countTotalTokens | chunks.106.mjs:3551-3560 | function |
| gG | approximateTokenCount | chunks.88.mjs:385-387 | function |
| C91 | extractUsageInfo | chunks.106.mjs:3542-3545 | function |
| E91 | calculateTotalTokenCount | chunks.106.mjs:3547-3549 | function |
| iI2 | calculateToolResultTokens | chunks.107.mjs:1400-1427 | function |
| EQ0 | countMessageArrayTokens | chunks.107.mjs | function |

### Compact Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| zQ0 | FREE_SPACE_BUFFER | chunks.107.mjs:1733 | constant |
| rD5 | WARNING_THRESHOLD | chunks.107.mjs:1735 | constant |
| oD5 | ERROR_THRESHOLD | chunks.107.mjs:1737 | constant |
| mD5 | MIN_TOKENS_TO_SAVE | chunks.107.mjs:1558 | constant |
| dD5 | DEFAULT_TOKEN_THRESHOLD | chunks.107.mjs:1560 | constant |
| cD5 | KEEP_LAST_N_TOOLS | chunks.107.mjs:1562 | constant |
| lI2 | TOKENS_PER_IMAGE | chunks.107.mjs:1564 | constant |
| _D5 | MAX_FILES_TO_RESTORE | chunks.107.mjs | constant |
| yD5 | MAX_TOKENS_PER_FILE | chunks.107.mjs | constant |
| kD5 | TOTAL_FILE_TOKEN_BUDGET | chunks.107.mjs | constant |
| gD5 | SUMMARY_WRITE_MAX_WAIT | chunks.107.mjs:1380 | constant |
| uD5 | SUMMARY_WRITE_TIMEOUT | chunks.107.mjs:1382 | constant |

### Compact Registries

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| CQ0 | microCompactedConversations | chunks.107.mjs:1593 | variable |
| DQ0 | compactedToolUseIds | chunks.107.mjs | variable |
| pI2 | toolResultTokenCache | chunks.107.mjs | variable |
| pD5 | eligibleToolsForCompact | chunks.107.mjs | variable |
| HQ0 | memoryAttachmentTracking | chunks.107.mjs | variable |

---

## Module: Hooks

### Core Hook Execution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| qa | executeHooksInREPL | chunks.147.mjs:3-338 | function |
| kV0 | executeHooksOutsideREPL | chunks.147.mjs:340-453 | function |
| ZN | DEFAULT_HOOK_TIMEOUT | chunks.147.mjs | constant |

### Hook Type Executors

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| SV0 | executeShellHook | chunks.146.mjs:3337-3430 | function |
| eP2 | executePromptHook | chunks.121.mjs:1754-1920 | function |
| aX9 | executeAgentHook | chunks.146.mjs:2937-3134 | function |
| Qy3 | executeCallbackHook | chunks.147.mjs:756-784 | function |
| Ay3 | executeFunctionHook | chunks.147.mjs:698-754 | function |
| qsA | createShellCommandWrapper | chunks.68.mjs:2483-2554 | function |

### Event-Specific Executors

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| OV0 | executePreToolUseHooks | chunks.147.mjs:455-472 | function |
| RV0 | executePostToolUseHooks | chunks.147.mjs:474-491 | function |
| TV0 | executePostToolUseFailureHooks | chunks.147.mjs:493-511 | function |
| WQ0 | executeSessionStartHooks | chunks.147.mjs:569-582 | function |
| yV0 | executeSessionEndHooks | chunks.147.mjs:631-649 | function |
| PV0 | executeStopHooks | chunks.147.mjs:532-552 | function |
| k60 | executeUserPromptSubmitHooks | chunks.147.mjs:554-567 | function |
| B60 | executeNotificationHooks | chunks.147.mjs:513-530 | function |
| FQ0 | executePreCompactHooks | chunks.147.mjs:600-629 | function |
| mW0 | executePermissionRequestHooks | chunks.147.mjs:654-671 | function |
| rX0 | executeSubagentStartHooks | chunks.147.mjs:584-598 | function |

### Hook Configuration Loading

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ek3 | loadAllHooks | chunks.146.mjs:3445-3476 | function |
| SZ2 | getSettingsHooks | chunks.106.mjs:1598-1601 | function |
| P00 | getHookSources | chunks.106.mjs:1522-1526 | function |
| r21 | getSessionHooks | chunks.106.mjs:1285-1299 | function |
| _V0 | getMatchingHooks | chunks.146.mjs:3478-3520 | function |
| tk3 | matchPattern | chunks.146.mjs:3432-3443 | function |
| tE | createHookContext | chunks.146.mjs:3187-3195 | function |
| zLA | HOOK_EVENT_TYPES | chunks.94.mjs:2194 | constant |

### Hook Output Processing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| oX9 | parseHookJSONOutput | chunks.146.mjs:3197-3225 | function |
| tX9 | processHookResponse | chunks.146.mjs:3227-3335 | function |
| zYA | isAsyncHookResponse | chunks.146.mjs | function |
| kZ2 | isNotAsyncResponse | chunks.146.mjs | function |
| Q91 | hookOutputSchema | chunks.106.mjs:1675-1722 | object |
| xK5 | syncResponseSchema | chunks.106.mjs:1680-1720 | object |
| yK5 | asyncResponseSchema | chunks.106.mjs:1675-1678 | object |

### Hook Abort & Interruption

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ck | createCombinedAbortSignal | chunks.106.mjs:1725-1738 | function |
| rX9 | shouldSkipWorkspaceTrust | chunks.146.mjs:3182-3185 | function |
| t21 | isAllowManagedHooksOnly | chunks.106.mjs:1528-1530 | function |

### Hook Session Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| s21 | registerSessionHook | chunks.106.mjs | function |
| o21 | unregisterSessionHook | chunks.106.mjs | function |
| NZ2 | findSessionHook | chunks.106.mjs | function |

### Hook Message Types

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| l9 | createHookMessage | chunks.107.mjs:2349 | function |
| HVA | generateHookToolUseID | chunks.147.mjs | function |

---

## Module: Skill System

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| b69 | loadSkillFile | chunks.94.mjs:100-200 | function |
| VK0 | loadSkillCommands | chunks.94.mjs:200-300 | function |
| Sv3 | aggregateSkills | chunks.94.mjs:300-400 | function |

---

## Module: MCP Protocol

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| D1A | connectMcpServer | chunks.131.mjs:100-200 | function |
| y32 | callMcpTool | chunks.131.mjs:200-300 | function |
| b10 | processMcpResult | chunks.131.mjs:300-400 | function |
| v10 | batchConnect | chunks.131.mjs:400-500 | function |

---

## Module: Code Indexing - Tree-sitter

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Q05 | loadTreeSitterWasm | chunks.90.mjs:465-498 | function |
| jA2 | ensureTreeSitterLoaded | chunks.90.mjs:500-503 | function |
| B05 | parseCommand | chunks.90.mjs:505-523 | function |
| SA2 | findCommandNode | chunks.90.mjs:525-539 | function |
| G05 | extractEnvVars | chunks.90.mjs:541-550 | function |
| Z05 | extractCommandArgs | chunks.90.mjs:552-569 | function |
| I05 | stripQuotes | chunks.90.mjs:571-573 | function |
| q01 | parserInstance | chunks.90.mjs | variable |
| jo1 | bashLanguage | chunks.90.mjs | variable |
| Po1 | initPromise | chunks.90.mjs | variable |
| No1 | ParserClass | chunks.90.mjs | class |
| qo1 | LanguageClass | chunks.90.mjs | class |
| s15 | maxCommandLength | chunks.90.mjs | constant |
| r15 | declarationCommands | chunks.90.mjs | constant |
| o15 | argumentNodeTypes | chunks.90.mjs | constant |
| t15 | substitutionTypes | chunks.90.mjs | constant |
| To1 | commandNodeTypes | chunks.90.mjs | constant |

---

## Module: Code Indexing - File Index

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| UO3 | getFileIndex | chunks.138.mjs:1954-1962 | function |
| NO3 | buildFileIndex | chunks.138.mjs:1976-1998 | function |
| MO3 | searchFileIndex | chunks.138.mjs:2028-2075 | function |
| jJ0 | refreshIndexCache | chunks.138.mjs:2077-2086 | function |
| x09 | autocompleteFiles | chunks.138.mjs:2102-2121 | function |
| wO3 | extractDirectoryPrefixes | chunks.138.mjs:1964-1970 | function |
| qO3 | getAdditionalFiles | chunks.138.mjs:1972-1974 | function |
| LO3 | commonPrefix | chunks.138.mjs:2000-2005 | function |
| y09 | findCommonCompletionPrefix | chunks.138.mjs:2007-2016 | function |
| jZ1 | createFileResult | chunks.138.mjs:2018-2026 | function |
| PZ1 | fileIndexInstance | chunks.138.mjs | variable |
| PJ0 | useFuseJsFallback | chunks.138.mjs | variable |
| SJ0 | cachedFileIndex | chunks.138.mjs | variable |
| _J0 | cachedFileList | chunks.138.mjs | variable |
| fXA | refreshPromise | chunks.138.mjs | variable |
| k09 | lastRefreshTimestamp | chunks.138.mjs | variable |
| $O3 | cacheTTL | chunks.138.mjs | constant |
| sPA | maxResults | chunks.138.mjs | constant |
| KO3 | lruMaxEntries | chunks.138.mjs | constant |
| DO3 | lruCacheTTL | chunks.138.mjs | constant |
| j09 | lruCacheInstance | chunks.138.mjs | variable |

---

## Module: Code Indexing - File Cache

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Kh0 | FileContentCache | chunks.16.mjs:199-247 | class |
| Dh0 | fileContentCacheInstance | chunks.16.mjs:249 | variable |

---

## Module: Code Indexing - File Watching

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| k64 | initializeWatcher | chunks.19.mjs:307-324 | function |
| dd0 | disposeWatcher | chunks.19.mjs:326-329 | function |
| y64 | subscribeToChanges | chunks.19.mjs:331-335 | function |
| x64 | markInternalWrite | chunks.19.mjs:337-340 | function |
| v64 | getWatchedFiles | chunks.19.mjs:342-354 | function |
| b64 | onFileChange | chunks.19.mjs:356-365 | function |
| f64 | onFileUnlink | chunks.19.mjs:367-371 | function |
| cd0 | findSettingByPath | chunks.19.mjs:373-375 | function |
| fm | watcherManager | chunks.19.mjs:403-408 | object |
| h9A | chokidarInstance | chunks.19.mjs | variable |
| gd0 | watcherInitialized | chunks.19.mjs | variable |
| md0 | watcherDisposed | chunks.19.mjs | variable |
| pxA | debounceTimestamps | chunks.19.mjs | variable |
| wKA | subscriberCallbacks | chunks.19.mjs | variable |
| j64 | stabilityThreshold | chunks.19.mjs | constant |
| S64 | pollInterval | chunks.19.mjs | constant |
| _64 | debounceWindow | chunks.19.mjs | constant |

---

## Module: Shell Command Parser

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _A2 | FallbackCommandParser | chunks.90.mjs:600-637 | class |
| Y05 | createTreeSitterCommandParser | chunks.90.mjs:646-724 | function |
| N01 | shellParserFacade | chunks.90.mjs:724-737 | object |
| yA2 | analyzeCommandWithPipes | chunks.90.mjs:804-829 | function |
| J05 | checkPipePermissions | chunks.90.mjs:739-797 | function |
| W05 | stripOutputRedirections | chunks.90.mjs:799-802 | function |

---

## Module: Permission Checking

### Core Permission Decision Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Wb3 | toolPermissionDecisionEngine | chunks.153.mjs:1358-1417 | function |
| M$ | toolPermissionDispatcher | chunks.153.mjs:1480-1502 | function |
| KVA | getDenialRules | chunks.153.mjs:1299-1305 | function |
| CVA | getAllowRules | chunks.153.mjs:1250-1256 | function |
| yY1 | getAskRules | chunks.153.mjs:1307-1313 | function |
| so1 | findAllowRuleForTool | chunks.153.mjs:1323-1325 | function |
| ro1 | findDenyRuleForTool | chunks.153.mjs:1327-1329 | function |
| oo1 | findAskRuleForTool | chunks.153.mjs:1331-1333 | function |
| OK0 | ruleMatchesTool | chunks.153.mjs:1315-1321 | function |

### Rule Parsing Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| nN | parseRuleString | chunks.153.mjs:1230-1244 | function |
| B3 | stringifyRule | chunks.153.mjs:1246-1248 | function |
| mU | parseMcpToolName | chunks.154.mjs:2554-2563 | function |
| RK0 | getRulesForToolByBehavior | chunks.153.mjs:1339-1356 | function |
| fU | getRulesForToolWrapper | chunks.153.mjs:1335-1337 | function |

### Permission Context Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ZE | initializePermissionContext | chunks.70.mjs:2169-2176 | function |
| UF | applyPermissionUpdate | chunks.16.mjs:1122-1192 | function |
| JxA | persistRuleAddition | chunks.16.mjs:1072-1098 | function |
| fh0 | persistRuleDeletion | chunks.16.mjs:1038-1060 | function |
| FV9 | deletePermissionRule | chunks.153.mjs:1419-1446 | function |
| PE9 | ruleAggregation | chunks.153.mjs:1448-1466 | function |
| MK0 | PERMISSION_SOURCES | chunks.153.mjs:1517 | constant |
| iN | FILE_BASED_SOURCES | chunks.16.mjs:1007 | constant |

### File Permission Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| jD | filePathRuleMatching | chunks.154.mjs:1697-1726 | function |
| L0A | checkEditPermission | chunks.154.mjs:1815-1856 | function |
| OB | readSettingsFile | chunks.154.mjs:2359-2366 | function |
| cB | writeSettingsFile | chunks.154.mjs:2368-2407 | function |
| X2 | isPlanFile | chunks.154.mjs | function |
| yR | checkFileSafety | chunks.154.mjs | function |

### Bash Permission Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| no1 | bashCommandPermissionCheck | chunks.90.mjs:1935-2008 | function |
| io1 | exactBashCommandMatcher | chunks.90.mjs:2055-2096 | function |
| oA2 | prefixBashCommandMatcher | chunks.90.mjs:2098-2156 | function |
| k05 | sandboxAutoAllowBash | chunks.90.mjs:1903-1933 | function |
| fo1 | pathRedirectionPermissionCheck | chunks.90.mjs:1163-1185 | function |
| _05 | mcpToolPermissionCheck | chunks.90.mjs:1759-1822 | function |
| xo1 | checkPathPermission | chunks.90.mjs:854-888 | function |
| F05 | resolveAndCheckPath | chunks.90.mjs:890-899 | function |
| V05 | extractDirectoryFromGlob | chunks.90.mjs:845-852 | function |
| hA2 | formatPathList | chunks.90.mjs:839-843 | function |
| J05 | checkPipePermissions | chunks.90.mjs:739-797 | function |
| WIA | bashSandboxingCheck | chunks.106.mjs:446-452 | function |

### Helper Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| hV0 | sourceLabelFormatter | chunks.153.mjs:1209-1228 | function |
| yV | permissionMessageBuilder | chunks.153.mjs:1258-1297 | function |
| Fv | permissionModeLabel | chunks.19.mjs:835-848 | function |
| SE9 | initializePermissionMode | chunks.153.mjs:1537-1567 | function |
| nT | extractCommandRedirections | chunks.153.mjs:800-848 | function |

---

## Module: Telemetry

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| M9 | telemetryMarker | chunks.117.mjs:100-200 | function |
| GA | analyticsEvent | chunks.117.mjs:200-300 | function |
| AA | errorLog | chunks.117.mjs:300-400 | function |
| uN | logWarning | chunks.107.mjs | function |

---

## Module: UI Components

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| BsA | InternalApp | chunks.68.mjs:100-300 | class |

---

## Module: Model Selection

### Provider Detection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| V6 | getProvider | chunks.19.mjs:451-452 | function |
| Y0 | parseBoolean | chunks.107.mjs | function |

### Model ID Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TzA | SONNET_37_IDS | chunks.56.mjs:1450-1454 | constant |
| PzA | SONNET_35_IDS | chunks.56.mjs:1455-1459 | constant |
| jzA | HAIKU_35_IDS | chunks.56.mjs:1460-1464 | constant |
| SzA | HAIKU_45_IDS | chunks.56.mjs:1465-1469 | constant |
| At | SONNET_40_IDS | chunks.56.mjs:1470-1474 | constant |
| fv1 | SONNET_45_IDS | chunks.56.mjs:1475-1479 | constant |
| _zA | OPUS_40_IDS | chunks.56.mjs:1480-1484 | constant |
| kzA | OPUS_41_IDS | chunks.56.mjs:1485-1489 | constant |
| yzA | OPUS_45_IDS | chunks.56.mjs:1490-1494 | constant |

### Model ID Resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| eI | getModelIds | chunks.56.mjs:1586-1589 | function |
| NiA | getProviderModelIds | chunks.56.mjs:1533-1544 | function |
| $kA | getCachedModelIds | chunks.56.mjs | function |
| Pr8 | initializeModelIds | chunks.56.mjs:1577-1583 | function |
| Rr8 | fetchBedrockModelIds | chunks.56.mjs:1547-1574 | function |
| w_ | findModel | chunks.56.mjs | function |

### Model Selection Priority Chain

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| yE0 | getSessionOverrideModel | chunks.1.mjs:2591-2592 | function |
| mnA | getActiveModelSource | chunks.59.mjs:2737-2745 | function |
| Tt | getActiveModel | chunks.59.mjs:2748-2754 | function |
| k3 | getFinalModel | chunks.59.mjs:2757-2760 | function |
| CCB | getDefaultModelOverride | chunks.59.mjs:2812-2816 | function |
| cnA | getFallbackModel | chunks.59.mjs:2819-2827 | function |
| jt | getFallbackModelNormalized | chunks.59.mjs:2829-2830 | function |

### Default Model Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| XU | getDefaultSonnetModel | chunks.59.mjs:2763-2765 | function |
| wUA | getDefaultOpusModel | chunks.59.mjs:2776-2779 | function |
| X7A | getDefaultHaikuModel | chunks.59.mjs:2782-2785 | function |
| MW | getSmallFastModel | chunks.59.mjs:2725-2726 | function |

### Model Alias & Normalization

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Y7A | MODEL_ALIASES | chunks.59.mjs:3147 | constant |
| J7A | FULL_MODEL_ALIASES | chunks.59.mjs:3147 | constant |
| Vh1 | isKnownAlias | chunks.59.mjs:2994-2995 | function |
| UD | normalizeModelName | chunks.59.mjs:2998-3013 | function |
| inA | resolveAgentModel | chunks.59.mjs:3028-3037 | function |
| YM | getModelDisplayName | chunks.59.mjs:3016-3025 | function |
| nnA | getModelDisplayLabel | chunks.59.mjs:3040-3043 | function |

### Plan/Subscription Checks

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Pt | selectModelForPermissionMode | chunks.59.mjs:2792-2800 | function |
| BB | isClaudePro | chunks.59.mjs | function |
| pw | hasPaidExtras | chunks.59.mjs | function |
| UUA | isMaxPlan | chunks.59.mjs:2768-2769 | function |
| $UA | isTeamPlan | chunks.59.mjs:2772-2773 | function |
| W7A | isOpusModelById | chunks.59.mjs:2729-2730 | function |
| KT | isOpusModel | chunks.59.mjs:2733-2734 | function |
| Wh1 | isSonnet1MExperimentEnabled | chunks.59.mjs:2803-2809 | function |
| dnA | isHaikuDefaultForPro | chunks.59.mjs:2788-2789 | function |

### Model Display Config

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Xh1 | SONNET_CONFIG | chunks.59.mjs:3151-3155 | constant |
| UCB | SONNET_1M_CONFIG | chunks.59.mjs:3156-3160 | constant |
| wCB | HAIKU_45_CONFIG | chunks.59.mjs:3161-3165 | constant |
| xY6 | HAIKU_35_CONFIG | chunks.59.mjs:3166-3170 | constant |
| bY6 | OPUS_CONFIG | chunks.59.mjs:3172-3175 | constant |
| pnA | getDefaultModelDescription | chunks.59.mjs:2874-2877 | function |

---

## Module: Prompt Building

### System Prompt Assembly

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Tn | buildCompleteSystemPrompt | chunks.152.mjs:2307-2448 | function |
| CE9 | getEnvironmentContext | chunks.152.mjs:2582-2601 | function |
| GSA | getAgentSpecificContext | chunks.152.mjs:2616-2625 | function |
| kv3 | getGitStatusPrompt | chunks.152.mjs | function |

### Identity Selection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| rnA | getSessionTypeIdentity | chunks.60.mjs:465-472 | function |
| gCB | getCoreSystemPrompt | chunks.60.mjs:474-476 | function |
| hCB | CLAUDE_CODE_IDENTITY | chunks.60.mjs:478 | constant |
| sY6 | CLAUDE_CODE_SDK_IDENTITY | chunks.60.mjs:479 | constant |
| rY6 | CLAUDE_AGENT_IDENTITY | chunks.60.mjs:480 | constant |

### MCP Instructions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| HE9 | getMCPToolsPrompt | chunks.152.mjs:2465-2580 | function |
| bv3 | getMCPServerInstructions | chunks.152.mjs:2450-2463 | function |
| bZ | isMCPEnabled | chunks.152.mjs | function |

### Git Instructions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| cU6 | getGitInstructions | chunks.71.mjs:787-875 | function |
| EOB | getBashToolDescription | chunks.71.mjs:736-785 | function |

### Security & Guidelines

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| DE9 | SECURITY_GUIDELINES | chunks.152.mjs | constant |

---

## Module: API Calling

### Core API Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $E9 | streamApiCall | chunks.153.mjs:3-361 | function |
| t61 | withRetry | chunks.121.mjs:1988-2046 | function |
| Kq | createApiClient | chunks.88.mjs:3-105 | function |
| U | buildRequestPayload | chunks.153.mjs | function |

### Response Processing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| RYA | streamingApiCallWrapper | chunks.146.mjs | function |
| wy | nonStreamingApiCall | chunks.153.mjs | function |
| Ao1 | wrapMessageStream | chunks.153.mjs | function |

### Error Handling

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| E81 | FallbackTriggeredError | chunks.121.mjs | class |
| X81 | RetryError | chunks.121.mjs | class |

---

## Constants (Cross-Module)

### Threshold Constants

| Obfuscated | Readable | Value | Description |
|------------|----------|-------|-------------|
| GY2.TURNS_SINCE_WRITE | TODO_TURNS_SINCE_WRITE | 7 | Min turns before todo reminder |
| GY2.TURNS_BETWEEN_REMINDERS | TODO_TURNS_BETWEEN | 3 | Min turns between reminders |
| IH5.TURNS_BETWEEN_ATTACHMENTS | PLAN_MODE_THROTTLE | 5 | Min turns between plan_mode |

### String Constants

| Obfuscated | Readable | Description |
|------------|----------|-------------|
| tA5 | MALWARE_WARNING_REMINDER | Appended to all file reads |
| $q | EMPTY_CONTENT_PLACEHOLDER | Empty message placeholder |
| xO | TOOL_USE_PLACEHOLDER | Tool use placeholder text |
| sJA | EMPTY_PROMPT_PLACEHOLDER | Empty prompt text |
| pXA | INTERRUPTED_MESSAGE | Interrupted tool message |

### Numeric Constants

| Obfuscated | Readable | Value | Description |
|------------|----------|-------|-------------|
| NKA | MAX_LINES_BEFORE_TRUNCATE | - | Truncation limit for files |
| ZN | DEFAULT_HOOK_TIMEOUT | 60000 | Hook timeout in ms |

---

## Utility Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| nO | generateUUID | chunks.153.mjs | function |
| Y0 | parseBooleanEnv | chunks.107.mjs | function |
| o9 | createAbortController | chunks.107.mjs | function |
| B9 | extractXmlTagContent | chunks.153.mjs:2260-2279 | function |
| nJ | splitMessageContent | chunks.153.mjs:2290-2346 | function |
| cV | createLocalCommandCaveat | chunks.153.mjs:2229-2234 | function |

---

## Module: Slash Commands

### Command Parsing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _P2 | parseSlashCommandInput | chunks.121.mjs:913-1016 | function |
| rJA | extractCommandParts | chunks.121.mjs:862-877 | function |
| if5 | isValidCommandName | chunks.121.mjs:909-911 | function |
| ph | commandExists | chunks.152.mjs:2174-2176 | function |
| Pq | lookupCommand | chunks.152.mjs:2178-2182 | function |
| Ny | getBuiltinCommandNames | chunks.152.mjs:2265 | function |
| KE9 | getAllBuiltinCommands | chunks.152.mjs:2265 | function |

### Command Execution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| nf5 | executeCommand | chunks.121.mjs:1018-1147 | function |
| kP2 | processPromptCommand | chunks.121.mjs:1177-1214 | function |
| a61 | formatCommandMetadata | chunks.121.mjs:1149-1153 | function |
| Y$ | buildMessageContent | chunks.153.mjs:2207-2216 | function |
| w0A | parseAllowedTools | chunks.153.mjs:1569-1600 | function |
| sf5 | formatCommandMetadataForPrompt | chunks.121.mjs:1155-1175 | function |
| s61 | processSlashCommandTool | chunks.121.mjs:1217-1300 | function |

### Custom Command Loading

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _n | loadCommandFilesFromDirectories | chunks.153.mjs:1855-1882 | function |
| TK0 | scanMarkdownFiles | chunks.153.mjs:1809-1836 | function |
| NV | parseFrontmatter | chunks.16.mjs:892-919 | function |
| fC9 | loadCustomCommandsForExecution | chunks.152.mjs:909-994 | function |
| Zv3 | generateCommandName | chunks.152.mjs:894-896 | function |
| Bv3 | generateSkillCommandName | chunks.152.mjs:880-892 | function |
| Gv3 | generateRegularCommandName | chunks.152.mjs:870-878 | function |
| Qv3 | deduplicateCommands | chunks.152.mjs:852-868 | function |
| WK0 | isSkillMarkdown | chunks.152.mjs:848-850 | function |
| RSA | getDirectoryPath | chunks.152.mjs | function |
| Sv3 | getSkillsFromPluginsAndDirectories | chunks.152.mjs:2151-2168 | function |
| zb3 | getProjectRoots | chunks.153.mjs:1840-1853 | function |
| PK0 | directoryExists | chunks.153.mjs:1805-1807 | function |

### Built-in Command Definitions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ky3 | configCommand | chunks.148.mjs:312-326 | object |
| rV9 | configCommandRef | chunks.148.mjs:326 | object |
| by3 | contextCommand | chunks.148.mjs:659-694 | object |
| QF9 | contextCommandRef | chunks.148.mjs:694 | object |
| hy3 | costCommand | chunks.148.mjs:707-732 | object |
| GF9 | costCommandRef | chunks.148.mjs:732 | object |
| cy3 | doctorCommand | chunks.148.mjs:1311-1324 | object |
| EF9 | doctorCommandRef | chunks.148.mjs:1324 | object |
| sy3 | helpCommand | chunks.148.mjs:1642-1659 | object |
| kF9 | helpCommandRef | chunks.148.mjs:1659 | object |
| ey3 | ideCommand | chunks.148.mjs:1921-2002 | object |
| gF9 | ideCommandRef | chunks.148.mjs:2002 | object |
| Ax3 | initCommand | chunks.148.mjs:2013-2048 | object |
| mF9 | initCommandRef | chunks.148.mjs:2048 | object |
| ny3 | memoryCommand | chunks.148.mjs:1480-1500 | object |
| MF9 | memoryCommandRef | chunks.148.mjs:1500 | object |
| Ny3 | clearCommand | chunks.147.mjs:2275-2290 | object |
| LV9 | clearCommandRef | chunks.147.mjs:2290 | object |
| Ly3 | compactCommand | chunks.147.mjs:2309-2357 | object |
| OV9 | compactCommandRef | chunks.147.mjs:2357 | object |
| wy3 | feedbackCommand | chunks.147.mjs:2208-2228 | object |
| qV9 | feedbackCommandRef | chunks.147.mjs:2228 | object |
| Ix3 | mcpCommand | chunks.149.mjs:1422-1455 | object |
| jK9 | mcpCommandRef | chunks.149.mjs:1455 | object |
| yK9 | prCommentsCommand | chunks.149.mjs:1457-1530 | object |
| Yx3 | releaseNotesCommand | chunks.149.mjs:1531-1570 | object |
| bK9 | releaseNotesCommandRef | chunks.149.mjs:1570 | object |
| Jx3 | renameCommand | chunks.149.mjs:1571-1590 | object |
| hK9 | renameCommandRef | chunks.149.mjs:1590 | object |
| Kx3 | resumeCommand | chunks.149.mjs:2294-2357 | object |
| JJ1 | reviewCommand | chunks.149.mjs:2367-2432 | object |
| Dx3 | statusCommand | chunks.149.mjs:2419-2445 | object |
| sK9 | statusCommandRef | chunks.149.mjs:2445 | object |
| Hx3 | tasksCommand | chunks.149.mjs:2446-2494 | object |
| oK9 | tasksCommandRef | chunks.149.mjs:2494 | object |
| ID9 | usageCommand | chunks.149.mjs:2755-2770 | object |
| Ux3 | vimCommand | chunks.149.mjs:2802-2823 | object |

### Command Queue Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| m89 | enqueueCommand | chunks.142.mjs:1717-1722 | function |
| n89 | dequeueSingleCommand | chunks.142.mjs:1724-1732 | function |
| a89 | dequeueAllCommands | chunks.142.mjs:1734-1744 | function |
| VI1 | popAllCommandsAndMerge | chunks.142.mjs:1755-1771 | function |
| P8 | processCommandsCallback | chunks.145.mjs:164-170 | function |
| D69 | handleEscapeKey | chunks.142.mjs:2494-2511 | function |

### Error Classes

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| WW | AbortError | chunks.16.mjs:1329-1333 | class |
| oj | CommandNotFoundError | chunks.16.mjs:1328 | class |
| yY | SDKAbortError | chunks.153.mjs:259 | class |
| IS | TimeoutError | chunks.153.mjs:264 | class |

### Telemetry Events

| Event Name | Description |
|------------|-------------|
| tengu_input_slash_missing | Input doesn't start with `/` or parse fails |
| tengu_input_slash_invalid | Valid command name but command doesn't exist |
| tengu_input_command | Command executed successfully |
| tengu_input_prompt | Fallback to prompt mode |
| tengu_slash_command_tool_invocation | Command invoked as tool |
| tengu_dir_search | Directory search metrics |

---

## See Also

- [file_index.md](./file_index.md) - File → content index
- [architecture.md](./architecture.md) - System architecture overview
