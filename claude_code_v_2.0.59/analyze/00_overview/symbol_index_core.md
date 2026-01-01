# Symbol Index - Core Modules

> 符号映射表 Part 1: 核心执行流程模块
> 查找方式：按模块浏览，或 Ctrl+F 搜索混淆名/可读名。
>
> **Related file:** [symbol_index_infra.md](./symbol_index_infra.md) - Infrastructure modules (MCP, Permissions, Sandbox, etc.)

---

## Quick Navigation

- [Plan Mode](#module-plan-mode) - Plan/Explore agents, plan file persistence
- [Core Entry & CLI](#module-core-entry--cli) - Main entry, command handler
- [State Management](#module-state-management) - App state, React context
- [Agent Loop](#module-agent-loop) - Main loop, tool execution
- [LLM API](#module-llm-api) - API calls, streaming
- [System Prompts](#module-system-prompts--reminders) - Prompts, reminders, attachments
- [Tools](#module-tools) - Tool definitions, execution pipeline
- [Agents](#module-agents) - Built-in agents, helper functions
- [Subagent Execution](#module-subagent-execution) - Task tool, agent output
- [Todo List](#module-todo-list) - Todo tool, persistence, UI
- [Compact](#module-compact) - Auto-compact, micro-compact, token counting
- [Hooks](#module-hooks) - Hook execution, event handlers
- [Skill System](#module-skill-system) - Skill tool, loading, aggregation
- [Thinking Mode](#module-thinking-mode) - Ultrathink keyword, tab toggle, API integration
- [Output Style](#module-output-style) - Output style command, built-in styles, custom styles
- [Prompt Suggestions](#module-prompt-suggestions) - Autocomplete suggestions, fuzzy search, file index

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

### Entry Point Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| mu3 | mainEntry | chunks.158.mjs:1438-1462 | function |
| hu3 | commandHandler | chunks.158.mjs:3-600 | function |
| FU9 | initializeConfig | chunks.158.mjs:200-300 | function |
| ju3 | runMigrations | chunks.158.mjs:300-400 | function |
| VG | renderInteractive | chunks.158.mjs:400-500 | function |
| Rw9 | runNonInteractive | chunks.158.mjs:500-600 | function |
| WVA | MainInteractiveApp | chunks.158.mjs:600-900 | function |
| gu3 | reportInitTelemetry | chunks.158.mjs:987-1044 | function |
| uu3 | cleanupCursor | chunks.158.mjs:1046-1048 | function |
| Tu3 | setupTerminalCursor | chunks.158.mjs:416 | function |
| bu3 | createRenderOptions | chunks.158.mjs:662 | function |

### Commander.js Framework

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| pK0 | Command | chunks.155.mjs:26-500 | class |
| Oz9 | Option | chunks.155.mjs (import) | class |
| gf3 | Argument | chunks.155.mjs (import) | class |
| fJ1 | CommanderInstance | chunks.158.mjs:3 | alias |
| BF | OptionClass | chunks.158.mjs (addOption) | alias |
| hf3 | EventEmitter | chunks.155.mjs:4 | import |

### Session Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ki | loadMostRecentSession | chunks.158.mjs:418 | function |
| nE | validateUUID | chunks.158.mjs:60 | function |
| aE9 | sessionIdInUse | chunks.158.mjs:65 | function |
| zR | setSessionId | chunks.1.mjs:2479 | function |
| Fx | syncSessionState | chunks.158.mjs:422 | function |

### Permission Resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| SE9 | resolvePermissionMode | chunks.158.mjs:245-280 | function |
| _E9 | initToolPermissionContext | chunks.153.mjs:1602-1657 | function |
| kR | PERMISSION_MODES | chunks.158.mjs:50 | constant |

### MCP CLI Mode

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bZ | isMcpEnabled | chunks.158.mjs:1439 | function |
| iz9 | mcpCliHandler | chunks.158.mjs:1441 | function |

### App State

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| f0 | appState | chunks.158.mjs:353-415 | object |
| Yu | stateUpdateCallback | chunks.156.mjs:2146-2183 | function |
| $T | loadSettings | chunks.154.mjs:2439-2475 | function |
| e1 | getSessionId | chunks.1.mjs:2473 | function |
| MQ | getClaudeDataDirectory | chunks.1.mjs:886 | function |
| WQ | globalState | chunks.1.mjs | object |

### Utility Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Y0 | parseBoolean | chunks.1.mjs:890-895 | function |
| M9 | emitTelemetry | chunks.158.mjs (throughout) | function |
| GA | trackEvent | chunks.158.mjs:417 | function |
| AA | logError | chunks.158.mjs:795 | function |
| tA | chalk | chunks.158.mjs (import) | import |
| SD0 | resolvePath | chunks.158.mjs:71 | function |
| YW1 | fileExists | chunks.158.mjs:72 | function |
| nw9 | readFileSync | chunks.158.mjs:75 | function |
| f7 | tryParseJSON | chunks.158.mjs:128 | function |
| ZMA | validateMcpConfig | chunks.158.mjs:130 | function |
| BYA | loadMcpConfigFile | chunks.158.mjs:135 | function |
| ns | mapValues | chunks.158.mjs:147 | function |

---

## Module: State Management

### App State Object & Factory

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| f0 | appState | chunks.158.mjs:353-415 | object |
| wp | getDefaultAppState | chunks.70.mjs:2336-2397 | function |
| k0 | todoSessionId | chunks.158.mjs:352 | variable |

### React Context Provider

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| yG | AppStateProvider | chunks.70.mjs:2399-2437 | function |
| OQ | useAppState | chunks.70.mjs:2440-2443 | function |
| sMB | appStateContext | chunks.70.mjs:2460 | variable |
| aMB | appStateProviderInitializedContext | chunks.70.mjs:2460 | variable |

### State Change Callback

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Yu | onChangeAppState | chunks.156.mjs:2146-2183 | function |
| cB | saveSettingsValue | chunks.156.mjs | function |
| Ts | setCurrentModel | chunks.1.mjs:2598 | function |
| c0 | updateSettings | chunks.106.mjs | function |
| UYA | persistTodoData | chunks.106.mjs:1862-1864 | function |

### State Initialization Helpers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $T | loadSettings | chunks.154.mjs:2439-2475 | function |
| Cf3 | loadAllSettings | chunks.154.mjs:2439-2475 | function |
| wa | getCachedSettings | chunks.154.mjs | function |
| vSA | settingsCache | chunks.154.mjs | variable |
| e1 | getSessionId | chunks.1.mjs:2473 | function |
| qE0 | generateNewSessionId | chunks.1.mjs:2476 | function |
| zR | setSessionId | chunks.1.mjs:2479 | function |
| _E9 | initializeToolPermissionContext | chunks.153.mjs:1602-1657 | function |
| ZE | initializeDefaultToolPermissions | chunks.70.mjs:2169-2176 | function |
| Kf2 | loadAgentDefinitions | chunks.125.mjs:1799-1846 | function |
| $21 | initializeMcpState | chunks.101.mjs:3123-3162 | function |
| VrA | isExtendedThinkingEnabled | chunks.70.mjs:2295-2303 | function |
| UkA | getInitialMainLoopModel | chunks.1.mjs:2595 | function |
| xE0 | setInitialMainLoopModel | chunks.1.mjs:2601 | function |

### Notification Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| vZ | useNotificationManager | chunks.70.mjs:2463-2527 | function |
| $U6 | sortNotificationsByPriority | chunks.70.mjs | function |
| oMB | DEFAULT_NOTIFICATION_TIMEOUT | chunks.70.mjs | constant |
| Qe | notificationTimeoutId | chunks.70.mjs | variable |

### Git Diff State

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| K51 | incrementGitDiffVersion | chunks.122.mjs:2604-2612 | function |
| L_2 | useGitDiffUpdater | chunks.122.mjs:2581-2596 | function |

### Settings Watching

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| t7A | subscribeToSettingsChanges | chunks.70.mjs | function |
| IxA | loadToolPermissions | chunks.70.mjs | function |
| rMB | mergePermissionContexts | chunks.70.mjs | function |

### Background Tasks State

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| q | updateBackgroundTaskState | chunks.106.mjs:475-486 | function |

### Session Storage Paths

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| MQ | getClaudeConfigDir | chunks.1.mjs:886-888 | function |
| PVA | getProjectsDir | chunks.154.mjs:586-588 | function |
| fb3 | sanitizePath | chunks.154.mjs:627-628 | function |
| vJ1 | sanitizePath | chunks.154.mjs:2198-2199 | function |
| cH | getProjectDir | chunks.154.mjs:631-633 | function |
| DVA | getAgentTranscriptPath | chunks.154.mjs:599-602 | function |
| WSA | getSessionTranscriptPath | chunks.154.mjs:594-597 | function |
| aJA | getCurrentSessionPath | chunks.154.mjs:590-592 | function |

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
| sI2 | autoCompactDispatcher | chunks.107.mjs:1708-1731 | function |
| Si | microCompactToolResults | chunks.107.mjs:1440-1545 | function |
| f91 | tryNestedMemoryCache | chunks.107.mjs:1621-1645 | function |
| tD5 | shouldTriggerAutoCompact | chunks.107.mjs:1698-1706 | function |
| x1A | calculateThresholds | chunks.107.mjs:1677-1692 | function |
| aI2 | getAutoCompactThreshold | chunks.107.mjs:1663-1675 | function |
| b1A | isAutoCompactEnabled | chunks.107.mjs:1694-1696 | function |
| R91 | buildCompactionPrompt | chunks.107.mjs:537-710 | function |
| FQ0 | runPreCompactHooks | chunks.107.mjs | function |
| wq | runSessionStartHooks | chunks.107.mjs:1203 | function |

### Nested Memory (Session Memory Cache)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| b91 | isNestedMemoryEnabled | chunks.107.mjs:1597-1599 | function |
| dI2 | waitForCacheLock | chunks.107.mjs:1362-1368 | function |
| hI2 | getCachedBoundaryUuid | chunks.107.mjs:1346-1348 | function |
| cI2 | getCachedSummaryContent | chunks.107.mjs:1371-1378 | function |
| sD5 | rebuildFromCache | chunks.107.mjs:1601-1619 | function |
| k91 | getSessionMemorySummaryPath | chunks.154.mjs:1501-1503 | function |
| kJ1 | getSessionMemoryDir | chunks.154.mjs:1497-1499 | function |
| S91 | createCompactBoundary | chunks.154.mjs:395-410 | function |

### Nested Memory File Watching

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| qH5 | getNestedMemoryAttachments | chunks.107.mjs:2152-2163 | function |
| ZY2 | collectNestedMemoryFiles | chunks.107.mjs:1981-2005 | function |
| qQ0 | addToReadState | chunks.107.mjs:1965-1979 | function |
| CH5 | getRelatedDirectories | chunks.107.mjs | function |
| pZ2 | getFilesAtPath | chunks.107.mjs | function |
| lZ2 | getNestedFiles | chunks.107.mjs | function |
| iZ2 | getCwdLevelFiles | chunks.107.mjs | function |

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
| HVA | generateHookToolUseID | chunks.147.mjs | function |

> Note: `l9` (createAttachment) is defined in [Module: System Prompts & Reminders](#module-system-prompts--reminders) and is used by hooks to create attachment messages.

---

## Module: Skill System

### Skill Tool Definition

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| kq | SKILL_TOOL_NAME | chunks.125.mjs:42 | constant |
| ln | SkillTool | chunks.130.mjs:2555-2745 | object |
| Ft5 | skillInputSchema | chunks.130.mjs:2548-2549 | object |
| Kt5 | skillOutputSchema | chunks.130.mjs:2550-2554 | object |
| _b2 | skillToolPrompt | chunks.125.mjs:9-39 | function |

### Skill Execution Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| s61 | processSlashCommand | chunks.121.mjs:1170-1174 | function |
| kP2 | processPromptCommand | chunks.121.mjs:1177-1214 | function |
| U60 | formatSkillMetadata | chunks.121.mjs:1155-1158 | function |
| sf5 | formatCommandMetadata | chunks.121.mjs:1165-1168 | function |
| af5 | formatSlashCommandMetadata | chunks.121.mjs:1160-1163 | function |

### Skill Loading Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| XK0 | loadSkillsFromDirectory | chunks.152.mjs:1008-1093 | function |
| VK0 | loadSkillDirectoryCommands | chunks.152.mjs:1115-1134 | function |
| Sv3 | getSkillsFromAllSources | chunks.152.mjs:2151-2168 | function |
| iW0 | getPluginSkills | chunks.142.mjs:3586-3617 | function |
| b69 | loadSkillsFromPluginPath | chunks.142.mjs:3382-3451 | function |
| gC9 | clearSkillDirectoryCache | chunks.152.mjs:1096-1098 | function |

### Skill Aggregation & Filtering

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| sE | getAllCommands | chunks.152.mjs:2266-2271 | function |
| OWA | getModelInvokableSkills | chunks.152.mjs:2273-2274 | function |
| Z71 | getSlashCommands | chunks.152.mjs:2275-2276 | function |
| n51 | getSlashCommandSkills | chunks.152.mjs:2277-2283 | function |
| nH9 | clearAllSkillCaches | chunks.152.mjs:2170-2172 | function |
| ph | commandExists | chunks.152.mjs:2174-2176 | function |
| Pq | lookupCommand | chunks.152.mjs:2178-2182 | function |
| KE9 | getBuiltinCommands | chunks.152.mjs:2265 | function |
| Ny | getBuiltinCommandNames | chunks.152.mjs:2265 | function |

### Skill Token Budget

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Dt5 | getSkillTokenBudget | chunks.130.mjs:2750-2752 | function |
| Ht5 | limitCommandsByTokenBudget | chunks.130.mjs:2761-2770 | function |
| Ct5 | getSkillTokenBudgetResult | chunks.130.mjs:2772-2776 | function |
| qd2 | formatSkillForPrompt | chunks.130.mjs:2754-2759 | function |
| Pi5 | formatSkillListWithCount | chunks.124.mjs:3192-3209 | function |
| Sb2 | getLimitedSkills | chunks.124.mjs:3192 | function |

### Frontmatter Parsing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| NV | parseFrontmatter | chunks.16.mjs:892-919 | function |
| Wx | extractFirstHeading | chunks.153.mjs:1705-1716 | function |
| UO | parseToolsArray | chunks.153.mjs:1737-1741 | function |
| Y0 | parseBoolean | chunks.1.mjs:890-895 | function |
| Fa | processPromptTemplate | chunks.152.mjs:~1065 | function |

### SlashCommand Tool (Related)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| cP | SLASHCOMMAND_TOOL_NAME | chunks.130.mjs:2748 | constant |
| Nd2 | slashCommandToolPrompt | chunks.130.mjs:2784-2789 | function |

---

## Module: Thinking Mode

> See detailed analysis: [19_think_level/think_keyword_analysis.md](../19_think_level/think_keyword_analysis.md)

### Keyword Detection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ae | detectThinkingKeyword | chunks.70.mjs:2275-2281 | function |
| WrA | isUltrathinkExact | chunks.70.mjs:2195-2198 | function |
| XrA | extractKeywordPositions | chunks.70.mjs:2283-2293 | function |
| zU6 | calculateThinkingTokens | chunks.70.mjs:2244-2268 | function |
| EU6 | levelToTokens | chunks.70.mjs:2240-2242 | function |
| UU6 | extractMessageContent | chunks.70.mjs:2270-2273 | function |
| Xf | getMaxThinkingTokens | chunks.70.mjs:2228-2238 | function |
| nMB | segmentTextByKeyword | chunks.70.mjs:2205-2226 | function |
| Qj3 | buildThinkingMetadata | chunks.142.mjs:3046-3060 | function |

### Thinking Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| zm1 | THINKING_TOKEN_LEVELS | chunks.70.mjs:2330-2333 | constant |
| CU6 | ULTRATHINK_REGEX_GLOBAL | chunks.70.mjs:2333 | constant |
| JrA | THINKING_LEVEL_COLORS | chunks.70.mjs:2323-2326 | constant |
| iMB | THINKING_SHIMMER_COLORS | chunks.70.mjs:2326-2329 | constant |

### Thinking UI Components

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| DO2 | ThinkingIndicator | chunks.118.mjs:1074-1095 | function |

### Thinking Block Processing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| NQ0 | isThinkingOnlyMessage | chunks.154.mjs:451-529 | function |
| pE9 | isThinkingBlock | chunks.154.mjs | function |
| xb3 | filterTrailingThinking | chunks.154.mjs | function |

### Context Management / Preservation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bCB | buildContextManagementEdits | chunks.60.mjs:392-445 | function |
| vo0 | INTERLEAVED_THINKING_BETA | chunks.24.mjs:1817 | constant |
| nbA | CONTEXT_MANAGEMENT_BETA | chunks.24.mjs:1806 | constant |
| aX4 | supportsInterleavedThinking | chunks.24.mjs | function |

### API Token Calculations

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| UQ0 | getModelMaxOutputTokens | chunks.153.mjs:478-493 | function |
| pv3 | capTokensForFallback | chunks.153.mjs:468-475 | function |
| cv3 | MAX_CONTEXT_THRESHOLD | chunks.153.mjs:495 | constant |

### Effort Level System (SEPARATE from Thinking)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| g60 | getEffortLevel | chunks.121.mjs:2208-2225 | function |
| h60 | isValidEffortLevel | chunks.121.mjs | function |
| kv3 | buildReasoningEffortPrompt | chunks.152.mjs:2286-2295 | function |
| hv3 | applyTaskIntensity | chunks.152.mjs:2716-2718 | function |
| _v3 | EFFORT_LEVEL_MAPPING | chunks.152.mjs:2655-2659 | constant |

---

## Module: Output Style

> See detailed documentation: [09_slash_command/output_style.md](../09_slash_command/output_style.md)

### Command Definition

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| tC9 | outputStyleCommand | chunks.152.mjs:1707-1740 | object |
| OJ1 | OUTPUT_STYLE_INFO_KEYWORDS | chunks.152.mjs | constant |
| MJ1 | OUTPUT_STYLE_HELP_KEYWORDS | chunks.152.mjs | constant |

### UI Components

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $v3 | OutputStyleMenuComponent | chunks.152.mjs:1624-1660 | function |
| qv3 | SetStyleDirectComponent | chunks.152.mjs:1670-1684 | function |
| Nv3 | ShowCurrentStyleComponent | chunks.152.mjs:1686-1691 | function |
| wv3 | findStyleCaseInsensitive | chunks.152.mjs:1662-1668 | function |
| uY1 | OutputStyleSelector | chunks.147.mjs:3116-3157 | function |
| dV9 | convertStylesToOptions | chunks.147.mjs:3100-3114 | function |

### Style Definitions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TQA | BUILTIN_OUTPUT_STYLES | chunks.153.mjs:1967-2058 | object |
| wK | DEFAULT_STYLE_NAME | chunks.153.mjs:1951 | constant |
| gE9 | INSIGHT_BLOCK_TEMPLATE | chunks.153.mjs:1960-1966 | constant |

### Style Loading

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| cQA | loadAllOutputStyles | chunks.153.mjs:1923-1941 | async function |
| fE9 | loadCustomOutputStyles | chunks.153.mjs:1892-1920 | async function |
| EE9 | getCurrentStyleConfig | chunks.153.mjs:1944-1947 | async function |
| AK0 | loadPluginOutputStyles | chunks.151.mjs | async function |

### System Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| KH5 | generateOutputStyleReminder | chunks.107.mjs:1919-1926 | function |

---

## Module: Prompt Suggestions

> Input autocomplete system - command, file, shell, and MCP suggestions.
> Documentation: [09_slash_command/prompt_suggestions.md](../09_slash_command/prompt_suggestions.md)

### Core Hook

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| e09 | usePromptSuggestions | chunks.138.mjs:2819-3172 | function |
| A69 | usePromptSuggestionDisplay | chunks.142.mjs:1869-1897 | function |

### Command Suggestions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bXA | isSlashCommand | chunks.138.mjs:1769-1771 | function |
| IO3 | hasCommandArguments | chunks.138.mjs:1773-1778 | function |
| T09 | getCommandSuggestions | chunks.138.mjs:1795-1845 | function |
| R09 | formatCommandSuggestion | chunks.138.mjs:1784-1793 | function |
| OJ0 | applyCommandSuggestion | chunks.138.mjs:1851-1858 | function |
| ZO3 | HYPHEN_UNDERSCORE_COLON_REGEX | chunks.138.mjs:1865 | constant |

### File Reference Suggestions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| vJ0 | getAtMentionSuggestions | chunks.138.mjs:2361-2417 | function |
| x09 | searchFiles | chunks.138.mjs:2102-2121 | function |
| MO3 | searchFileIndex | chunks.138.mjs:2028-2075 | function |
| NO3 | buildFileIndex | chunks.138.mjs:1976-1998 | function |
| jJ0 | refreshFileIndexCache | chunks.138.mjs:2077-2086 | function |
| jZ1 | createFileSuggestion | chunks.138.mjs:2018-2026 | function |
| u09 | formatUnifiedSuggestion | chunks.138.mjs:2295-2317 | function |

### Token Parsing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| oPA | parseFilePath | chunks.138.mjs:2778-2798 | function |
| t09 | extractTokenFromParsed | chunks.138.mjs:2739-2743 | function |
| fJ0 | formatSuggestionText | chunks.138.mjs:2745-2757 | function |
| SZ1 | applySuggestionToInput | chunks.138.mjs:2123-2129 | function |
| mO3 | parseSlashCommandArgs | chunks.138.mjs:2800-2813 | function |
| dO3 | shouldSkipCommandSuggestions | chunks.138.mjs:2815-2817 | function |

### Shell Completions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| SO3 | detectCompletionType | chunks.138.mjs:2187-2226 | function |
| h09 | getShellCompletions | chunks.138.mjs:2260-2279 | function |
| uO3 | getShellCompletionsCached | chunks.138.mjs:2769-2776 | function |
| yO3 | executeShellCompletion | chunks.138.mjs:2244-2258 | function |
| _O3 | generateBashCompgenCmd | chunks.138.mjs:2228-2234 | function |
| kO3 | generateZshCompgenCmd | chunks.138.mjs:2236-2242 | function |
| hJ0 | applyShellCompletion | chunks.138.mjs:2759-2767 | function |
| b09 | inferTypeFromToken | chunks.138.mjs:2166-2170 | function |
| PO3 | findLastStringToken | chunks.138.mjs:2172-2179 | function |
| jO3 | isAtCommandPosition | chunks.138.mjs:2181-2185 | function |
| f09 | isPipeOperator | chunks.138.mjs:2162-2164 | function |

### Agent & MCP Server Suggestions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| vO3 | getAgentSuggestions | chunks.138.mjs:2324-2340 | function |
| bO3 | getMcpServerSuggestions | chunks.138.mjs:2342-2359 | function |
| xO3 | truncateDescription | chunks.138.mjs:2319-2322 | function |
| r09 | isMcpServerSuggestion | chunks.138.mjs:2724-2726 | function |

### Directory Suggestions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| S09 | searchDirectories | chunks.138.mjs:1901-1915 | function |
| HO3 | parseDirectoryInput | chunks.138.mjs:1868-1884 | function |
| CO3 | readDirectoryContents | chunks.138.mjs:1886-1899 | function |

### Resume Session Suggestions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| o09 | formatResumeCommand | chunks.138.mjs:2734-2737 | function |

### Common Prefix & Selection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| y09 | getCommonPrefix | chunks.138.mjs:2007-2016 | function |
| LO3 | findCommonPrefixPair | chunks.138.mjs:2000-2005 | function |
| rPA | preserveSelectedIndex | chunks.138.mjs:2728-2732 | function |

### Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| sPA | MAX_FILE_SUGGESTIONS | chunks.138.mjs:2145 | constant |
| xJ0 | MAX_UNIFIED_SUGGESTIONS | chunks.138.mjs:2419 | constant |
| yJ0 | MAX_SHELL_COMPLETIONS | chunks.138.mjs:2281 | constant |
| RO3 | SHELL_COMPLETION_TIMEOUT | chunks.138.mjs:2283 | constant |
| $O3 | FILE_INDEX_CACHE_TTL | chunks.138.mjs:2143 | constant |
| m09 | MAX_AGENT_DESCRIPTION_LEN | chunks.138.mjs:2421 | constant |
| TO3 | SHELL_PIPE_OPERATORS | chunks.138.mjs:2292 | constant |
| KO3 | DIRECTORY_CACHE_MAX | chunks.138.mjs:1917 | constant |
| DO3 | DIRECTORY_CACHE_TTL | chunks.138.mjs:1919 | constant |

### State Variables

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| SJ0 | cachedFileIndex | chunks.138.mjs:2135 | variable |
| _J0 | cachedFileList | chunks.138.mjs:2137 | variable |
| fXA | pendingCacheRefresh | chunks.138.mjs:2139 | variable |
| k09 | lastCacheRefreshTime | chunks.138.mjs:2141 | variable |
| kZ1 | shellCompletionAbortController | chunks.138.mjs:3178 | variable |
| j09 | directoryCache | chunks.138.mjs:1921 | variable |

---

## See Also

- [symbol_index_infra.md](./symbol_index_infra.md) - Infrastructure modules (MCP, Permissions, Sandbox, etc.)
- [file_index.md](./file_index.md) - File → content index
- [architecture.md](./architecture.md) - System architecture overview
