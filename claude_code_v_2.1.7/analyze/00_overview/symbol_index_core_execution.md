# Symbol Index - Core Execution (Claude Code 2.1.7)

> Symbol mapping table Part 1: Core execution flow modules
> Lookup: Browse by module, or Ctrl+F search for obfuscated/readable name.
>
> **Related files:**
> - [symbol_index_core_features.md](./symbol_index_core_features.md) - Core features (Plan, Hooks, Skills, etc.)
> - [symbol_index_infra_platform.md](./symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - Integration infrastructure

---

## Quick Navigation

- [State Management](#module-state-management)
- [Agent Loop](#module-agent-loop)
- [LLM API](#module-llm-api)
- [System Prompts & Reminders](#module-system-prompts--reminders)
- [Tools](#module-tools)
- [Agents](#module-agents)
- [Subagent Execution](#module-subagent-execution)

---

## Module: State Management

> Full analysis: [15_state_management/](../15_state_management/)

### Core State Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| HzA | createDefaultAppState | chunks.135.mjs:1235-1329 | function |
| SG7 | shallowEqual | chunks.135.mjs:1225-1233 | function |
| FzA | INITIAL_SPECULATION_STATE | chunks.135.mjs:1416-1418 | constant |

### React Context

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| b5 | AppStateProvider | chunks.135.mjs:1331-1384 | function |
| a0 | useAppState | chunks.135.mjs:1386-1390 | function |
| HZ2 | useAppStateSafe | chunks.135.mjs:1392-1396 | function |
| RM0 | appStateContext | chunks.135.mjs:1419 | context |
| c19 | providerInitializedContext | chunks.135.mjs:1419 | context |

### Notification System

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| S4 | useNotificationQueue | chunks.135.mjs:1422-1520 | function |
| xG7 | getNextNotification | chunks.135.mjs | function |
| l19 | DEFAULT_NOTIFICATION_TIMEOUT | chunks.135.mjs | constant |

### Global State Flags (Plan Mode)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| g0 | globalState | chunks.1.mjs | object |
| Xf0 | hasExitedPlanMode | chunks.1.mjs:2706-2708 | function |
| Iq | setHasExitedPlanMode | chunks.1.mjs:2710-2712 | function |
| If0 | needsPlanModeExitAttachment | chunks.1.mjs:2714-2716 | function |
| lw | setNeedsPlanModeExitAttachment | chunks.1.mjs:2718-2720 | function |
| Ty | onToolPermissionModeChanged | chunks.1.mjs:2722-2725 | function |

### Global State Flags (Delegate Mode)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Df0 | setHasExitedDelegateMode | chunks.1.mjs:2727-2729 | function |
| Wf0 | needsDelegateModeExitAttachment | chunks.1.mjs:2731-2733 | function |
| jdA | setNeedsDelegateModeExitAttachment | chunks.1.mjs:2735-2737 | function |

### Global State Flags (Session)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| cAA | isSessionPersistenceDisabled | chunks.1.mjs:2702-2704 | function |
| Z7A | getPlanSlugCache | chunks.1.mjs:2778-2780 | function |
| PdA | setTeleportedSessionInfo | chunks.1.mjs:2782-2788 | function |
| Iq1 | getTeleportedSessionInfo | chunks.1.mjs:2790-2792 | function |
| Dq1 | markTeleportFirstMessageLogged | chunks.1.mjs:2794-2796 | function |

### Global State Flags (Hooks)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| G7A | registerHooks | chunks.1.mjs:2755-2762 | function |
| TdA | getRegisteredHooks | chunks.1.mjs:2764-2766 | function |
| Hf0 | clearPluginHooks | chunks.1.mjs:2768-2776 | function |

### System Reminder Extraction

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| mI0 | extractSystemReminder | chunks.91.mjs:3368-3371 | function |
| SG5 | filterSystemReminderMessages | chunks.91.mjs:3373-3402 | function |
| PG5 | SYSTEM_REMINDER_REGEX | chunks.91.mjs | constant |

---

## Module: Agent Loop

> Full analysis: [03_llm_core/agent_loop.md](../03_llm_core/agent_loop.md)

### Main Loop Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $f | runSubagentLoop | chunks.112.mjs:2913-3057 | async generator |
| aN | coreMessageLoop | chunks.134.mjs:99-400 | async generator |
| HN | executeToolsParallel | chunks.134.mjs:402-500 | function |
| ZA1 | aggregateToolResults | chunks.134.mjs:502-550 | function |
| xVA | TaskTool | chunks.113.mjs:74-405 | object |

### Background Agent Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Im2 | aggregateAsyncAgentExecution | chunks.121.mjs:486-542 | async generator |
| TH1 | streamShellOutput | chunks.124.mjs:1313-1360 | function |
| es | LocalBashTaskHandler | chunks.121.mjs:755-834 | object |

### Turn & Progress Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| q82 | MAX_TURNS | chunks.113.mjs:39 | constant (500) |
| L2 | PROGRESS_YIELD_INTERVAL | chunks.112.mjs:2946 | constant (3) |
| FG5 | MAX_RECENT_ACTIVITIES | chunks.91.mjs:1394 | constant (5) |
| j77 | MAX_OUTPUT_TOKEN_RECOVERY | chunks.134.mjs:155 | constant (3) |
| wi5 | MAX_RECENT_TOOLS | chunks.121.mjs:490 | constant (5) |

### Streaming Tool Execution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _H1 | StreamingToolExecutor | chunks.133.mjs:2911-3087 | class |
| jH1 | executeSingleToolGenerator | chunks.133.mjs:3097 | function |
| C77 | removeFromInProgressToolUseIDs | chunks.133.mjs:3089-3091 | function |

---

## Module: LLM API

> Full analysis: [03_llm_core/api_calling.md](../03_llm_core/api_calling.md)

### Client Creation (Multi-Provider)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| XS | createAnthropicClient | chunks.82.mjs:2634-2737 | function |
| ss8 | createBedrockClient | chunks.85.mjs:177-250 | function |
| ts8 | createVertexClient | chunks.85.mjs:252-310 | function |
| oHA | streamingApiCall | chunks.147.mjs:162-285 | function |

### Retry Logic & Error Handling

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| v51 | retryGenerator | chunks.85.mjs:3-68 | generator |
| ps8 | parseRetryAfterHeader | chunks.85.mjs:70-72 | function |
| fSA | calculateBackoffDelay | chunks.85.mjs:74-82 | function |
| TeB | parseContextLimitError | chunks.85.mjs:84-103 | function |
| ls8 | isOverloadError | chunks.85.mjs:105-108 | function |
| ns8 | isRetryableError | chunks.85.mjs:122-137 | function |
| as8 | getMaxRetries | chunks.85.mjs:139-143 | function |

### Streaming Response Processing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| - | message_start | chunks.147.mjs:180 | event type |
| - | content_block_start | chunks.147.mjs:195 | event type |
| - | content_block_delta | chunks.147.mjs:210 | event type |
| - | content_block_stop | chunks.147.mjs:225 | event type |
| - | message_delta | chunks.147.mjs:240 | event type |
| - | message_stop | chunks.147.mjs:255 | event type |

### Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ms8 | MAX_RETRIES_DEFAULT | chunks.85.mjs:145 | constant (10) |
| qZ0 | FLOOR_OUTPUT_TOKENS | chunks.85.mjs:147 | constant (3000) |
| ds8 | FALLBACK_TRIGGER_COUNT | chunks.85.mjs:149 | constant (3) |
| - | BACKOFF_DELAYS | chunks.85.mjs:75 | constant [1000,2000,4000,...] |
| - | STALL_DETECTION_TIMEOUT | chunks.147.mjs:268 | constant (30000ms) |

---

## Module: System Prompts & Reminders

> Full analysis: [04_system_reminder/](../04_system_reminder/)

### Core Attachment Generation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| O27 | generateAllAttachments | chunks.131.mjs:3121-3138 | function |
| fJ | wrapWithErrorHandling | chunks.131.mjs:3140-3163 | function |
| VHA | yieldAttachments | chunks.131.mjs:3614-3621 | async generator |
| X4 | wrapAttachmentToMessage | chunks.132.mjs:87-94 | function |

### Attachment Conversion

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| q$7 | convertAttachmentToSystemMessage | chunks.148.mjs:3-371 | function |
| MuA | createToolUseMessage | chunks.148.mjs:392-397 | function |
| OuA | createToolResultMessage | chunks.148.mjs:373-390 | function |
| FI | normalizeAttachmentsToAPI | chunks.148.mjs:399-435 | function |

### XML Wrapper Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Yh | wrapSystemReminderText | chunks.147.mjs:3212-3216 | function |
| q5 | wrapInSystemReminder | chunks.147.mjs:3218-3245 | function |
| H0 | createMetaBlock | chunks.147.mjs:2410-2440 | function |

### User Prompt Attachment Generators

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| h27 | generateAtMentionedFilesAttachment | chunks.131.mjs:3372-3409 | function |
| u27 | generateMcpResourcesAttachment | chunks.131.mjs:3425-3456 | function |
| g27 | generateAgentMentionsAttachment | chunks.131.mjs:3411-3423 | function |

### Core Attachment Generators

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| m27 | generateChangedFilesAttachment | chunks.131.mjs:3458-3508 | function |
| d27 | generateNestedMemoryAttachment | chunks.131.mjs:3510-3521 | function |
| v27 | generateClaudeMdAttachment | chunks.131.mjs:3283-3285 | function |
| j27 | generatePlanModeAttachment | chunks.131.mjs:3207-3231 | function |
| T27 | generatePlanModeExitAttachment | chunks.131.mjs:3233-3244 | function (NEW) |
| P27 | generateDelegateModeAttachment | chunks.131.mjs:3246-3256 | function (NEW) |
| S27 | generateDelegateModeExitAttachment | chunks.131.mjs:3258-3263 | function (NEW) |
| t27 | generateTodoRemindersAttachment | chunks.132.mjs:117-133 | function |
| B97 | generateCollabNotificationAttachment | chunks.132.mjs:223-225 | function (NEW) |
| x27 | generateCriticalSystemReminderAttachment | chunks.131.mjs:3265-3272 | function |

### Main Agent Attachment Generators

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| k27 | generateIdeSelectionAttachment | chunks.131.mjs:3287-3300 | function |
| f27 | generateIdeOpenedFileAttachment | chunks.131.mjs:3362-3370 | function |
| y27 | generateOutputStyleAttachment | chunks.131.mjs:3274-3281 | function |
| M27 | generateQueuedCommandsAttachment | chunks.131.mjs:3166-3174 | function |
| o27 | generateDiagnosticsAttachment | chunks.131.mjs:3583-3591 | function |
| r27 | generateLspDiagnosticsAttachment | chunks.131.mjs:3593-3612 | function |
| A97 | generateUnifiedTasksAttachment | chunks.132.mjs:151-188 | function (NEW) |
| Q97 | generateAsyncHookResponsesAttachment | chunks.132.mjs:190-221 | function |
| mr2 | generateMemoryAttachment | chunks.131.mjs:3073 | function |
| G97 | generateTokenUsageAttachment | chunks.132.mjs:227-237 | function |
| Z97 | generateBudgetAttachment | chunks.132.mjs:239-249 | function |
| J97 | generateVerifyPlanReminderAttachment | chunks.132.mjs:274-276 | function (NEW) |

### Plan Mode Content Generators

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| z$7 | generatePlanModeInstructions | chunks.147.mjs:3247-3251 | function (router) |
| $$7 | generateFullPlanModeInstructions | chunks.147.mjs:3253-3330 | function |
| C$7 | generateSparsePlanModeInstructions | chunks.147.mjs:3332-3338 | function (NEW) |
| U$7 | generateSubAgentPlanModeInstructions | chunks.147.mjs:3340-3351 | function |

### Nested Memory Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| G52 | readManagedAndUserSettings | chunks.92.mjs:2894-2902 | function |
| Z52 | readProjectFilesInNestedDir | chunks.92.mjs:2904-2927 | function |
| Y52 | readCwdLevelRules | chunks.92.mjs:2929-2933 | function |
| zY1 | readConditionalRules | chunks.92.mjs:2934-2947 | function |
| fVA | readRulesDirectoryRecursive | chunks.92.mjs:2831-2880 | function |
| gb | readSingleFileWithImports | chunks.92.mjs:2810-2829 | function |
| XD0 | formatClaudeMdContext | chunks.92.mjs:2983-2998 | function |

### Constants

| Obfuscated | Readable | Value | Type |
|------------|----------|-------|------|
| xd | MAX_CONTENT_SIZE | 40000 | constant |
| hVA | MAX_LINES | 3000 | constant |
| aZ5 | MAX_IMPORT_DEPTH | 5 | constant |
| pZ5 | CLAUDE_MD_PREFIX | string | constant |
| Se8 | MALWARE_WARNING | string | constant |
| w27 | PROGRESS_TURN_THRESHOLD | 3 | constant |
| ar2 | PLAN_MODE_CONSTANTS | object | constant |

---

## Module: Tools

> **Analysis Status:** ✅ Complete (v2.1.7)
> **Related docs:** [05_tools/](../05_tools/)

### Tool Name Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| X9 | BASH_TOOL_NAME | chunks.93.mjs:22 | constant ("Bash") |
| z3 | READ_TOOL_NAME | chunks.93.mjs:207 | constant ("Read") |
| BY | WRITE_TOOL_NAME | chunks.93.mjs | constant ("Write") |
| I8 | EDIT_TOOL_NAME | chunks.93.mjs | constant ("Edit") |
| f3 | TASK_TOOL_NAME | chunks.113.mjs:83 | constant ("Task") |
| Bm | TODOWRITE_TOOL_NAME | chunks.59.mjs:224 | constant ("TodoWrite") |
| lI | GLOB_TOOL_NAME | chunks.93.mjs:385 | constant ("Glob") |
| DI | GREP_TOOL_NAME | chunks.93.mjs:385 | constant ("Grep") |
| cI | WEBFETCH_TOOL_NAME | chunks.93.mjs:385 | constant ("WebFetch") |
| aR | WEBSEARCH_TOOL_NAME | chunks.93.mjs:385 | constant ("WebSearch") |
| kF | SKILL_TOOL_NAME | chunks.113.mjs:408 | constant ("Skill") |
| zY | ASKUSERQUESTION_TOOL_NAME | chunks.119.mjs:2283 | constant ("AskUserQuestion") |
| GK1 | KILLSHELL_TOOL_NAME | chunks.119.mjs:1427 | constant ("KillShell") |
| aHA | TASKOUTPUT_TOOL_NAME | chunks.119.mjs:1574 | constant ("TaskOutput") |
| VK1 | ENTERPLANMODE_TOOL_NAME | chunks.120.mjs:519 | constant ("EnterPlanMode") |

### Tool Objects

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| v5 | ReadTool | chunks.86.mjs:561-827 | object |
| X$ | WriteTool | chunks.115.mjs:1269-1441 | object |
| J$ | EditTool | chunks.115.mjs:779-1056 | object |
| vD | TodoWriteTool | chunks.59.mjs:402-481 | object |
| as | GlobTool | chunks.115.mjs:1972+ | object |
| Tc | GrepTool | chunks.115.mjs:1621+ | object |
| o2 | BashTool | chunks.124.mjs:1505-1620 | object |
| hF | WebFetchTool | chunks.119.mjs:1247-1424 | object |
| vD | WebSearchTool | chunks.119.mjs:2110+ | object |
| ZK1 | KillShellTool | chunks.119.mjs:1490-1571 | object |
| xVA | TaskTool | chunks.113.mjs:74-405 | object |
| Sg2 | LSPTool | chunks.119.mjs:3121, chunks.120.mjs:27+ | object (NEW in 2.1.7) |

### Tool Input Schemas

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| je8 | readInputSchema | chunks.86.mjs:565-598 | object |
| se8 | editInputSchema | chunks.115.mjs:783-812 | object |
| Ne8 | writeInputSchema | chunks.115.mjs:1271-1285 | object |
| SX8 | todoWriteInputSchema | chunks.59.mjs:397-398 | object |
| wd2 | bashInputSchema | chunks.124.mjs:1458-1492 | object |
| hh2 | webFetchInputSchema | chunks.119.mjs:1250-1259 | object |

### Tool Output Schemas

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Pe8 | readOutputSchema | chunks.86.mjs:609-625 | object |
| Te8 | editOutputSchema | chunks.115.mjs:814-829 | object |
| qe8 | writeOutputSchema | chunks.115.mjs:1287-1296 | object |
| xX8 | todoWriteOutputSchema | chunks.59.mjs:399-401 | object |
| rq0 | bashOutputSchema | chunks.124.mjs:1493-1501 | object |

### TodoWrite Supporting Types

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| NX8 | todoStatusEnum | chunks.59.mjs:197 | enum (pending/in_progress/completed) |
| wX8 | todoItemSchema | chunks.59.mjs:197-201 | object |
| jIA | todoArraySchema | chunks.59.mjs:201 | array |

### Tool Execution (ToolUseQueueManager)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _H1 | ToolUseQueueManager | chunks.133.mjs:2911-3087 | class |
| aN | queryGenerator | chunks.134.mjs:99-114 | async generator |
| jH1 | toolExecutor | chunks.134.mjs:660-739 | function |
| k77 | progressCallbackWrapper | chunks.134.mjs:741-770 | function |
| b77 | toolValidationAndExecution | chunks.134.mjs:772-849 | function |
| _77 | getMaxConcurrency | chunks.134.mjs:80 | function (default: 10) |
| C77 | removeFromInProgressToolUseIDs | chunks.133.mjs:3089-3091 | function |
| j77 | MAX_OUTPUT_TOKEN_RECOVERY | chunks.134.mjs:155 | constant (3) |

### Tool Groupings

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| XG9 | getToolsByGrouping | chunks.144.mjs:1259-1281 | function |

Tool groupings defined in `XG9`:
- `READ_ONLY`: as, Tc, V$, v5, hF, vD, XK1, ZK1, JK1, Ud, qd
- `EDIT`: J$, X$, qf
- `EXECUTION`: o2
- `MCP`: Dynamic MCP tools
- `OTHER`: Remaining tools

### Tool Restriction Sets

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| - | ALWAYS_EXCLUDED_TOOLS | chunks.144.mjs | Set (ExitPlanMode, EnterPlanMode, Task, AskUserQuestion) |
| - | BUILTIN_ONLY_TOOLS | chunks.144.mjs | Set (inherits ALWAYS_EXCLUDED_TOOLS) |
| - | ASYNC_SAFE_TOOLS | chunks.144.mjs | Set (Read, Edit, TodoWrite, Grep, WebSearch, Glob, Bash, Skill, SlashCommand, WebFetch) |

### Read-Before-Edit Enforcement

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| mz | getFileModifiedTime | chunks.86.mjs | function |
| Z | readFileState | chunks.86.mjs:764 | Map |

**readFileState structure:**
```typescript
Map<string, {
  content: string;      // File content at read time
  timestamp: number;    // File mtime at read time
  offset?: number;      // Starting line if partial read
  limit?: number;       // Number of lines if partial read
}>
```

**Error Codes (Edit tool):**
| Code | Condition |
|------|-----------|
| 1 | old_string === new_string (no change) |
| 2 | Permission denied (path in deny list) |
| 3 | Cannot create - file already exists |
| 4 | File does not exist |
| 5 | Jupyter notebook (use NotebookEdit) |
| 6 | File has not been read yet |
| 7 | File modified since read |
| 8 | String to replace not found |
| 9 | Multiple matches found (replace_all=false) |
| 10 | Settings.json validation failed |

### Edit Tool String Matching

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| k6A | findStringWithQuoteNormalization | chunks.113.mjs:1708-1714 | function |
| FS2 | normalizeQuotes | chunks.113.mjs:1692-1694 | function |
| iD1 | replaceString | chunks.113.mjs:1716-1723 | function |
| nD1 | applyEditAndPatch | chunks.113.mjs:1725-1741 | function |
| QbA | applyEditsAndGeneratePatch | chunks.113.mjs:1743-1783 | function |
| HS2 | getEditSnippet | chunks.113.mjs:1797-1807 | function |
| $S2 | areEditsEquivalent | chunks.113.mjs:1937-1945 | function |
| KS2 | editPrompt | chunks.113.mjs:1681-1689 | constant |
| xy2 | editInputSchema | chunks.114.mjs:2693-2697 | object |
| KW1 | editOutputSchema | chunks.114.mjs:2704-2712 | object |
| ZRA | FILE_MODIFIED_ERROR | chunks.55.mjs:1151 | constant |

### Edit Tool Settings Validation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| uy2 | validateSettingsJsonEdit | chunks.114.mjs:2913-2929 | function |
| h$0 | isSettingsJsonFile | chunks.148.mjs:2039-2044 | function |
| b$0 | validateSettingsJson | chunks.148.mjs | function |
| C71 | findSimilarFileName | chunks.148.mjs:2812-2825 | function |

### Quote Normalization Constants

| Obfuscated | Readable | Value | Type |
|------------|----------|-------|------|
| Sf5 | LEFT_SINGLE_QUOTE | ' (U+2018) | constant |
| xf5 | RIGHT_SINGLE_QUOTE | ' (U+2019) | constant |
| yf5 | LEFT_DOUBLE_QUOTE | " (U+201C) | constant |
| vf5 | RIGHT_DOUBLE_QUOTE | " (U+201D) | constant |

### Bash Tool with Background Support

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| e51 | spawnShellCommand | chunks.85.mjs:1900-2016 | function |
| Dm2 | createLocalBashTask | chunks.121.mjs:610-635 | function |
| Li5 | backgroundShellTask | chunks.121.mjs:637-698 | function |
| It | isShellTask | chunks.121.mjs:567-569 | function |
| Iq0 | killShellTask | chunks.121.mjs:590-607 | function |
| es | LocalBashTaskHandler | chunks.121.mjs:755-834 | object |
| Km2 | removeShellTask | chunks.121.mjs:722-736 | function |

### Shell Command Object (chunks.85.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| - | shellCommand.status | chunks.85.mjs:2005 | property (running/backgrounded/killed/completed) |
| - | shellCommand.background | chunks.85.mjs:2008 | method (taskId) → streams |
| - | shellCommand.kill | chunks.85.mjs:2009 | method () → void |
| - | shellCommand.result | chunks.85.mjs:2010 | property (Promise) |

### Tool Permission System

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| lz7 | toolPermissionDecisionEngine | chunks.147.mjs:1538 | function |
| B$ | toolPermissionDispatcher | chunks.147.mjs:1658 | function |
| Jr | fileReadPermissionCheck | chunks.148.mjs:2339 | function |
| g6A | fileWritePermissionCheck | chunks.148.mjs:2419 | function |
| AE | filePathRuleMatching | chunks.148.mjs:2308 | function |
| CVA | getAllowRules | chunks.147.mjs:1422 | function |
| _d | getDenyRules | chunks.147.mjs:1471 | function |
| UVA | getAskRules | chunks.147.mjs:1479 | function |

**Permission behaviors:**
- `"allow"` - Automatically allowed
- `"deny"` - Automatically blocked
- `"ask"` - Requires user prompt
- `"passthrough"` - No rule match, use defaults

### Path Safety Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| XX9 | windowsSuspiciousPatternCheck | chunks.148.mjs:2136 | function |
| a$7 | isLockedDirectory | chunks.148.mjs:2046 | function |
| t$7 | isSensitiveFile | chunks.148.mjs:2113 | function |

**Locked directories:** node_modules, .git, __pycache__, .venv, venv, dist, build
**Sensitive files:** .env*, credentials*, secrets*, *.pem, *.key, id_rsa*, id_ed25519*

### File System Abstraction Layer

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| NT9 | FileSystemWrapper | chunks.1.mjs:2933-3039 | object |
| vA | getFileSystem | chunks.1.mjs:3039 | function |
| MW | monitoringWrapper | chunks.1.mjs:~2920 | function |
| RW | detectEncoding | chunks.148.mjs:2720-2741 | function |
| _c | detectLineEnding | chunks.148.mjs:2743-2770 | function |
| XC7 | countLineEndingTypes | chunks.148.mjs:2762-2771 | function |
| ns | writeFileWithLineEndings | chunks.148.mjs:2710-2717 | function |
| Yr | resolvePath | chunks.148.mjs:2773-2787 | function |
| mz | getFileModifiedTime | chunks.148.mjs:2692-2695 | function |
| L12 | readTextFileWithLineNumbers | chunks.148.mjs:2697-2708 | function |
| HX9 | readFileUtf8 | chunks.148.mjs:2682-2690 | function |
| k6 | getRelativePath | chunks.148.mjs:2802-2810 | function |

### Notebook & Image Handling

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| gA2 | parseNotebookCells | chunks.85.mjs:2845-2858 | function |
| hA2 | formatNotebookCell | chunks.85.mjs:~2830 | function |
| uA2 | notebookToolResult | chunks.85.mjs:2860-2873 | function |
| KY0 | readImageFile | chunks.86.mjs:456-460 | function |
| TEB | readPDFFile | chunks.55.mjs:1174-1188 | function |
| ye8 | readImageAsBase64 | chunks.86.mjs:~440 | function |
| xe8 | resizeImageForTokenLimit | chunks.86.mjs:~450 | function |
| E71 | IMAGE_EXTENSIONS | chunks.86.mjs:468 | constant (Set) |
| Re8 | BINARY_EXTENSIONS | chunks.86.mjs:470 | constant (Set) |
| sG8 | PDF_EXTENSIONS | chunks.55.mjs:1197 | constant (Set) |
| IIA | isPDFEnabled | chunks.55.mjs:~1160 | function |
| a01 | isPDFExtension | chunks.55.mjs:1170-1172 | function |

### File Size Limits

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| AxA | MAX_FILE_SIZE_BYTES | chunks.148.mjs:2949 | constant (262144) |
| Me8 | MAX_FILE_TOKENS | chunks.86.mjs:464 | constant (25000) |
| WY0 | getMaxTokens | chunks.86.mjs:368 | function |
| DY0 | getFileSizeError | chunks.86.mjs:487 | function |
| $71 | MaxFileReadTokenExceededError | chunks.86.mjs:511-519 | class |

### Settings File Watcher (Chokidar)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| cG8 | setupSettingsFileWatcher | chunks.55.mjs:990-1011 | function |
| MEB | closeWatcher | chunks.55.mjs:1013-1016 | function |
| nG8 | handleSettingsChange | chunks.55.mjs:1044-1053 | function |
| aG8 | handleSettingsDelete | chunks.55.mjs:1055-1059 | function |
| GIA | settingsFileWatcher | chunks.55.mjs:995 | variable |
| BIA | chokidarModule | chunks.55.mjs:984-987 | object |
| iG8 | getSettingFilePaths | chunks.55.mjs:1029-1042 | function |
| pG8 | registerChangeCallback | chunks.55.mjs:1018-1022 | function |
| l01 | recentlyModifiedFiles | chunks.55.mjs | Map |
| ZIA | changeCallbacks | chunks.55.mjs | Set |

### Tool Telemetry & Monitoring

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| l | logTelemetryEvent | chunks.134.mjs | function |
| LF | logStructuredMetric | chunks.134.mjs:1008-1023 | function |
| k9 | sanitizeToolName | chunks.134.mjs:668 | function |
| aU1 | recordDuration | chunks.134.mjs:958 | function |
| sZ1 | recordToolResult | chunks.134.mjs:985 | function |
| J82 | trackToolInput | chunks.134.mjs:869 | function |
| X82 | clearToolInput | chunks.134.mjs:869 | function |
| D82 | logDebugOutput | chunks.134.mjs:973 | function |
| pI0 | trackPermissionDecision | chunks.134.mjs:889 | function |
| lI0 | recordToolSuccess | chunks.134.mjs:981-983 | function |

**Telemetry Events:**
- `tengu_tool_use_success` - Successful execution (chunks.134.mjs:992)
- `tengu_tool_use_error` - Execution errors (chunks.134.mjs:668, 776, 804, 1073)
- `tengu_tool_use_cancelled` - Cancelled execution (chunks.134.mjs:698)
- `tengu_tool_use_progress` - Progress updates (chunks.134.mjs:744)
- `tengu_tool_use_can_use_tool_allowed` - Permission granted (chunks.134.mjs:916)
- `tengu_tool_use_can_use_tool_rejected` - Permission denied (chunks.134.mjs:889)

---

## Module: Agents

### Built-in Agents

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ED0 | getBuiltInAgents | chunks.93.mjs:458-462 | function |
| K52 | bashAgent | chunks.93.mjs:19-27 | object (NEW in 2.1.x) |
| $Y1 | generalPurposeAgent | chunks.93.mjs:33-56 | object |
| F52 | statuslineSetupAgent | chunks.93.mjs:61-170 | object |
| MS | exploreAgent | chunks.93.mjs:219-228 | object |
| UY1 | planAgent | chunks.93.mjs:289-299 | object |
| z52 | claudeCodeGuideAgent | chunks.93.mjs:382-449 | object |
| AY5 | CLAUDE_CODE_GUIDE_NAME | chunks.93.mjs:311 | constant |

### Agent System Prompts

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| rZ5 | bashSystemPrompt | chunks.93.mjs:3-14 | constant |
| sZ5 | exploreSystemPrompt | chunks.93.mjs:185-218 | constant |
| tZ5 | planSystemPrompt | chunks.93.mjs:240-288 | constant |
| QY5 | claudeCodeGuideSystemPrompt | chunks.93.mjs:324-381 | constant |

### Plugin Agent Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| DG | loadPlugins | chunks.130.mjs:3246-3263 | function (memoized) |
| O4A | getPluginAgents | chunks.93.mjs:554-587 | function (memoized) |
| L52 | clearPluginAgentsCache | chunks.93.mjs:541-543 | function |
| N52 | loadAgentsFromDirectory | chunks.93.mjs:475-497 | function |
| w52 | loadAgentFromFile | chunks.93.mjs:499-539 | function |
| mb | deduplicateAgents | chunks.93.mjs:602-614 | function |
| DY5 | parseAgentFromJSON | chunks.93.mjs:638-672 | function |
| NY1 | parseAgentsFromJSON | chunks.93.mjs:674-682 | function |
| WY5 | parseAgentFromFrontmatter | chunks.93.mjs:684-769 | function |
| XY5 | getAgentParseError | chunks.93.mjs:616-626 | function |
| IY5 | parseAgentHooks | chunks.93.mjs:628-636 | function |
| kG5 | getAllAgents | chunks.93.mjs:780-856 | function |
| j52 | registerFrontmatterHooks | chunks.93.mjs:859-875 | function |
| p_ | isBuiltInAgent | chunks.93.mjs:590-592 | function |
| qY1 | isPluginAgent | chunks.93.mjs:598-600 | function |
| R52 | isSettingsAgent | chunks.93.mjs:594-596 | function |

### Agent Source Priority

| Priority | Source | Override Behavior |
|----------|--------|-------------------|
| 1 (lowest) | built-in | Default agents |
| 2 | plugin | Can override built-in |
| 3 | userSettings | Can override plugin |
| 4 | projectSettings | Can override user |
| 5 | flagSettings | Can override project |
| 6 (highest) | policySettings | Cannot be overridden |

---

## Module: Subagent Execution

### Task Tool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| xVA | TaskTool | chunks.113.mjs:74-405 | object |
| uP2 | taskInputSchema | chunks.113.mjs:30-38 | object |
| Yf5 | taskOutputSchema | chunks.113.mjs:73 | union |
| Gf5 | completedOutputSchema | chunks.113.mjs:64-66 | object |
| Zf5 | asyncLaunchedOutputSchema | chunks.113.mjs:67-72 | object |
| Bf5 | baseOutputSchema | chunks.113.mjs:40-63 | object |

### Agent Execution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $f | runAgentLoop | chunks.113.mjs:179-187 | async generator |
| XA1 | executeInAgentContext | chunks.113.mjs:175-216 | function |
| YA1 | resolveAgentModel | chunks.113.mjs:113 | function |
| bD1 | loadTranscript | chunks.113.mjs:123 | function |
| iz | sanitizeAgentId | chunks.113.mjs:122-162 | function |
| LS | generateSessionId | chunks.113.mjs:162 | function |
| gP2 | getParentSessionId | chunks.113.mjs:163 | function |

### Background Agent Creation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| L32 | createFullyBackgroundedAgent | chunks.91.mjs:1288-1315 | function |
| O32 | createBackgroundableAgent | chunks.91.mjs:1317-1351 | function |
| M32 | triggerBackgroundTransition | chunks.91.mjs:1353-1373 | function |
| R32 | cleanupAgentTask | chunks.91.mjs:1375-1390 | function |

### Fork Context (NEW in 2.1.0)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| I52 | prepareForkMessages | chunks.113.mjs:138 | function |
| Ff5 | executeForkSkill | chunks.113.mjs:646-697 | function |
| TD1 | prepareForkContext | chunks.113.mjs:659 | function |

### Agent Progress Tracking

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| OI0 | createProgressTracker | chunks.91.mjs:1194 | function |
| MI0 | getProgressSnapshot | chunks.91.mjs:1209-1216 | function |
| vZ1 | updateProgressFromMessage | chunks.91.mjs:1200-1207 | function |
| FG5 | MAX_RECENT_ACTIVITIES | chunks.91.mjs:1394 | constant (5) |

### Agent Task Lifecycle

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| C4A | createTaskNotification | chunks.91.mjs:1222-1240 | function |
| $4A | killBackgroundTask | chunks.91.mjs:1242-1251 | function |
| RI0 | updateTaskProgress | chunks.91.mjs:1253-1261 | function |
| _I0 | markTaskCompleted | chunks.91.mjs:1263-1274 | function |
| jI0 | markTaskFailed | chunks.91.mjs:1276-1286 | function |
| Sr | isLocalAgentTask | chunks.91.mjs:1218-1220 | function |
| kZ1 | LocalAgentTaskHandler | chunks.91.mjs:1412-1482 | object |
| yZ1 | backgroundSignalMap | chunks.91.mjs:1483 | Map |

### Tool Restriction Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| CY1 | EXIT_PLAN_MODE_NAME | chunks.93.mjs:173 | constant ("ExitPlanMode") |
| I8 | ENTER_PLAN_MODE_NAME | TBD | constant ("EnterPlanMode") |
| BY | ASKUSER_NAME | TBD | constant ("AskUserQuestion") |
| tq | KILLSHELL_NAME | TBD | constant ("KillShell") |

---

## See Also

- [symbol_index_core_features.md](./symbol_index_core_features.md) - Core features (Plan, Hooks, Skills, etc.)
- [symbol_index_infra_platform.md](./symbol_index_infra_platform.md) - Platform infrastructure (MCP, Auth, etc.)
- [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - Integration infrastructure (LSP, Chrome, IDE, etc.)
- [file_index.md](./file_index.md) - File content index
- [changelog_analysis.md](./changelog_analysis.md) - Version changes
