# Symbol Index - Core Modules (Claude Code 2.1.7)

> Symbol mapping table Part 1: Core execution flow modules
> Lookup: Browse by module, or Ctrl+F search for obfuscated/readable name.
>
> **Related file:** [symbol_index_infra.md](./symbol_index_infra.md) - Infrastructure modules

---

## Quick Navigation

- [Background Agents](#module-background-agents) - **NEW in 2.0.60+**
- [Plan Mode](#module-plan-mode)
- [Core Entry & CLI](#module-core-entry--cli)
- [State Management](#module-state-management)
- [Agent Loop](#module-agent-loop)
- [LLM API](#module-llm-api)
- [System Prompts](#module-system-prompts--reminders)
- [Tools](#module-tools)
- [Agents](#module-agents)
- [Subagent Execution](#module-subagent-execution)
- [Todo List](#module-todo-list)
- [Compact](#module-compact)
- [Hooks](#module-hooks)
- [Skill System](#module-skill-system)
- [Thinking Mode](#module-thinking-mode)

---

## Module: Background Agents

> **NEW in 2.0.60** - Agents running asynchronously in background
> **2.0.64 Update** - Unified TaskOutput tool replaces AgentOutputTool/BashOutputTool

### TaskOutput Tool (Unified Background Task Output)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| aHA | TASKOUTPUT_TOOL_NAME | chunks.119.mjs:1574 | constant ("TaskOutput") |
| ap5 | taskOutputInputSchema | chunks.119.mjs:1754-1758 | object |
| YK1 | formatTaskOutput | chunks.119.mjs:1605-1632 | function |
| np5 | getTaskMaxOutputLength | chunks.119.mjs:1576-1580 | function |
| bbA | truncateTaskOutput | chunks.119.mjs:1582-1597 | function |
| op5 | waitForTaskCompletion | chunks.119.mjs:1634-1644 | function |
| rp5 | TaskOutputRenderer | chunks.119.mjs:1646-1719 | function |
| K71 | getTaskOutputContent | chunks.119.mjs:1606 | function |

### KillShell Tool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| GK1 | KILLSHELL_TOOL_NAME | chunks.119.mjs:1427 | constant ("KillShell") |
| ch2 | killShellDescription | chunks.119.mjs:1429-1435 | constant |

### Background Task Schema

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| - | task_id | chunks.119.mjs:1755 | schema field |
| - | block | chunks.119.mjs:1756 | schema field (default: true) |
| - | timeout | chunks.119.mjs:1757 | schema field (max: 600000ms) |
| - | backgroundTaskId | chunks.124.mjs:1499 | output field |
| - | backgroundedByUser | chunks.124.mjs:1500 | output field |

### Task Types

| Type | Description |
|------|-------------|
| local_bash | Background shell command |
| local_agent | Background sub-agent |
| remote_agent | Remote session agent |

### Ctrl+B Backgrounding (UI & Logic)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| H2 | registerKeyAction | chunks.68.mjs:1376-1403 | function |
| J3 | getKeyDisplayText | chunks.67.mjs:2650-2660 | function |
| yD1 | BackgroundShortcutHint | chunks.112.mjs:3291-3313 | function |
| uF9 | BackgroundSessionHint | chunks.153.mjs:196-221 | function |
| vD1 | backgroundAllTasks | chunks.121.mjs:708-720 | function |
| M32 | triggerBackgroundTransition | chunks.91.mjs:1353-1373 | function |
| yZ1 | backgroundSignalMap | chunks.91.mjs:1483 | variable (Map) |
| Li5 | backgroundShellTask | chunks.121.mjs:714 | function |
| Wm2 | hasBackgroundableTasks | chunks.121.mjs:700-705 | function |
| H59 | BackgroundShellUI | chunks.142.mjs:3133-3180 | function |
| GjA | useKeyBindingContext | chunks.68.mjs | function |
| J0 | useInput | chunks.68.mjs | function |

### Agent Task Lifecycle Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| C4A | createTaskNotification | chunks.91.mjs:1222-1240 | function |
| $4A | killBackgroundTask | chunks.91.mjs:1242-1251 | function |
| RI0 | updateTaskProgress | chunks.91.mjs:1253-1261 | function |
| _I0 | markTaskCompleted | chunks.91.mjs:1263-1274 | function |
| jI0 | markTaskFailed | chunks.91.mjs:1276-1286 | function |
| L32 | createFullyBackgroundedAgent | chunks.91.mjs:1288-1315 | function |
| O32 | createBackgroundableAgent | chunks.91.mjs:1317-1351 | function |
| Sr | isLocalAgentTask | chunks.91.mjs:1218-1220 | function |
| KO | createBaseTask | chunks.91.mjs:1204-1216 | function |
| FO | addTaskToState | chunks.91.mjs:1388-1398 | function |
| oY | updateTask | chunks.91.mjs:1377-1386 | function |

### Task Type Handlers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| es | LocalBashTaskHandler | chunks.121.mjs:755-834 | object |
| kZ1 | LocalAgentTaskHandler | chunks.91.mjs:1412-1482 | object |
| tu2 | RemoteAgentTaskHandler | chunks.121.mjs:185-252 | object |
| $i5 | getTaskHandlers | chunks.121.mjs:255-257 | function |

### Storage Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| aY | formatOutputPath | chunks.86.mjs:106-108 | function |
| g9A | appendToOutputFile | chunks.86.mjs:110-131 | function |
| OKA | registerOutputFile | chunks.86.mjs:174-183 | function |
| Zr | createEmptyOutputFile | chunks.86.mjs:167-172 | function |
| eSA | getAgentOutputDir | chunks.86.mjs:97-104 | function |
| K71 | getTaskOutputContent | chunks.86.mjs:157-165 | function |
| yb | getAgentTranscriptPath | chunks.148.mjs:692-696 | function |
| fb3 | sanitizePath | various | function |

### Remote Session Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| zi5 | startPollingRemoteSession | chunks.121.mjs:110-155 | function |
| nu2 | fetchRemoteSessionLogs | (remote API) | function |
| Ei5 | generateProgressSummary | chunks.121.mjs | function |
| Hi5 | extractTodoList | chunks.121.mjs | function |
| Fi5 | notifyRemoteTaskCompletion | chunks.121.mjs | function |
| cbA | createRemoteSession | (remote API) | function |
| lbA | getRemoteSessionUrl | chunks.121.mjs:157-159 | function |
| eu2 | getTeleportCommand | chunks.121.mjs:161-163 | function |

> Key files: chunks.68.mjs (keybindings), chunks.121.mjs (background logic), chunks.91.mjs (task state), chunks.86.mjs (storage), chunks.112/153.mjs (UI)

---

## Module: Plan Mode

> **Analysis Status:** ✅ Complete (v2.1.7)
> **Related docs:** [12_plan_mode/](../12_plan_mode/)

### EnterPlanMode Tool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| VK1 | ENTER_PLAN_MODE_NAME | chunks.120.mjs:519 | constant ("EnterPlanMode") |
| Au2 | enterPlanModeDescription | chunks.120.mjs:386-471 | constant |
| gbA | EnterPlanModeTool | chunks.120.mjs:535-605 | object |
| fl5 | enterPlanModeInputSchema | chunks.120.mjs:533 | object |
| hl5 | enterPlanModeOutputSchema | chunks.120.mjs:534 | object |
| Bu2 | renderEnterPlanToolUseMessage | chunks.120.mjs:474 | function |
| Gu2 | renderEnterPlanProgressMessage | chunks.120.mjs:478 | function |
| Zu2 | renderEnterPlanResultMessage | chunks.120.mjs:482-494 | function |
| Yu2 | renderEnterPlanRejectedMessage | chunks.120.mjs:497-503 | function |
| Ju2 | renderEnterPlanErrorMessage | chunks.120.mjs:506 | function |

### ExitPlanMode Tool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| vd | EXIT_PLAN_MODE_NAME | chunks.119.mjs:175 | constant ("ExitPlanMode") |
| SBY | exitPlanModeDescriptionSimple | chunks.119.mjs:2317-2331 | constant |
| Xg2 | exitPlanModeDescriptionFileBased | chunks.119.mjs:2332-2383 | constant |
| Jg2 | permissionScopingGuidelines | chunks.119.mjs:2361 | constant |
| V$ | ExitPlanModeTool | chunks.119.mjs:2494-2605 | object |
| Zl5 | allowedPromptSchema | chunks.119.mjs:2483-2486 | object |
| Yl5 | exitPlanModeInputSchema | chunks.119.mjs:2486-2489 | object |
| Jl5 | exitPlanModeOutputSchema | chunks.119.mjs:2489-2494 | object |
| Dg2 | renderExitPlanToolUseMessage | chunks.119.mjs:2386 | function |
| Wg2 | renderExitPlanProgressMessage | chunks.119.mjs:2390 | function |
| Kg2 | renderExitPlanResultMessage | chunks.119.mjs:2394-2433 | function |
| Vg2 | renderExitPlanRejectedMessage | chunks.119.mjs:2436-2446 | function |
| Fg2 | renderExitPlanErrorMessage | chunks.119.mjs:2449 | function |
| iY1 | PlanPreview | chunks.119.mjs:2441 | component |

### Plan File Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| NN | getPlanDir | chunks.86.mjs:48-56 | function |
| dC | getPlanFilePath | chunks.86.mjs:58-62 | function |
| AK | readPlanFile | chunks.86.mjs:64-74 | function |
| W71 | checkPlanExists | chunks.86.mjs:76-83 | function |
| GY0 | getUniquePlanSlug | chunks.86.mjs:TBD | function |
| ZY0 | cachePlanSlug | chunks.86.mjs:TBD | function |

### Plan Mode State Tracking

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| g0 | globalState | chunks.1.mjs:TBD | object |
| Xf0 | hasExitedPlanMode | chunks.1.mjs:2706-2708 | function |
| Iq | setHasExitedPlanMode | chunks.1.mjs:2710-2712 | function |
| If0 | needsPlanModeExitAttachment | chunks.1.mjs:2714-2716 | function |
| lw | setNeedsPlanModeExitAttachment | chunks.1.mjs:2718-2720 | function |
| Ty | onToolPermissionModeChanged | chunks.1.mjs:2722-2725 | function |

### Plan Mode System Reminders

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| z$7 | buildPlanModeSystemReminder | chunks.147.mjs:3247-3251 | function (router) |
| $$7 | buildFullPlanReminder | chunks.147.mjs:3253-3330 | function |
| C$7 | buildSparsePlanReminder | chunks.147.mjs:3332-3338 | function (NEW) |
| U$7 | buildSubAgentPlanReminder | chunks.147.mjs:3340-3351 | function |
| LJ9 | getMaxPlanAgents | chunks.147.mjs:2289-2298 | function |
| OJ9 | getMaxExploreAgents | chunks.147.mjs:2301-2306 | function |

### Plan Mode Attachment Generation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| R27 | findPlanModeAttachmentInfo | chunks.131.mjs:3176-3192 | function |
| _27 | countPlanModeAttachments | chunks.131.mjs:3195-3204 | function |
| j27 | buildPlanModeAttachment | chunks.131.mjs:3207-3231 | function |
| T27 | buildPlanModeExitAttachment | chunks.131.mjs:3233-3244 | function (NEW) |
| ar2 | PLAN_MODE_CONSTANTS | chunks.131.mjs:TBD | object |

### Plan Mode Permission Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| re | buildPermissionRules | chunks.150.mjs:2402-2418 | function |
| aK1 | semanticToRegex | chunks.150.mjs:TBD | function |

### Plan Mode Model Selection (Main Loop Integration)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| HQA | selectModelForPlanMode | chunks.46.mjs:2259-2268 | function |
| h51 | checkExceeds200kTokens | chunks.85.mjs:921-931 | function |
| FQA | getMainLoopModelSetting | chunks.46.mjs:TBD | function |
| sJA | getOpusModel | chunks.46.mjs:2250-2252 | function |
| OR | getSonnetModel | chunks.46.mjs:TBD | function |
| k1 | handleModeCycle | chunks.152.mjs:2512-2529 | function (callback) |
| kK9 | getNextModeInCycle | chunks.152.mjs:TBD | function |

### Plan Mode Agent Configurations

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| MS | ExploreAgentConfig | chunks.93.mjs:219-228 | object |
| UY1 | PlanAgentConfig | chunks.93.mjs:289-299 | object |
| sZ5 | exploreAgentSystemPrompt | chunks.93.mjs:196-218 | constant |
| tZ5 | planAgentSystemPrompt | chunks.93.mjs:240-289 | constant |

### Plan Mode Disallowed Tools (Agent Restrictions)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| f3 | TASK_TOOL_NAME | chunks.93.mjs:222 | constant ("Task") |
| CY1 | EXIT_PLAN_MODE_NAME_REF | chunks.93.mjs:222 | constant ("ExitPlanMode") |
| I8 | EDIT_TOOL_NAME | chunks.93.mjs:222 | constant ("Edit") |
| BY | WRITE_TOOL_NAME | chunks.93.mjs:222 | constant ("Write") |
| tq | KILLSHELL_TOOL_NAME_REF | chunks.93.mjs:222 | constant ("KillShell") |

### Plan Slug Caching (Session Restore)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Z7A | getPlanSlugCache | chunks.1.mjs:2778-2780 | function |
| ZY0 | cachePlanSlug | chunks.86.mjs:39-41 | function |
| J12 | clearPlanSlugCacheForSession | chunks.86.mjs:43-46 | function |

### Plan Mode Constants

| Constant | Value | Description |
|----------|-------|-------------|
| TURNS_BETWEEN_ATTACHMENTS | 5 | Turns before showing another plan attachment |
| FULL_REMINDER_EVERY_N_ATTACHMENTS | 3 | Show full reminder every N attachments |
| CLAUDE_CODE_PLAN_V2_AGENT_COUNT | env | Max design agents (default: 1, max: 5) |
| CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT | env | Max explore agents (default: 3, max: 5) |

> Note: Plan files now persist across `/clear` (fixed in 2.1.3)
> New in 2.1.7: Sparse reminders, exit attachments, improved state tracking

---

## Module: Core Entry & CLI

> **Analysis Status:** ✅ Complete (v2.1.7)
> **Related docs:** [01_cli/](../01_cli/)

### Entry Point Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| D_7 | mainEntry | chunks.157.mjs:1860-1891 | function |
| J_7 | commandHandler | chunks.157.mjs:3-1153 | function |
| X_7 | reportInitTelemetry | chunks.157.mjs:1155-1212 | function |
| I_7 | cleanupCursor | chunks.157.mjs:1214-1216 | function |
| Y_7 | processInputPrompt | chunks.157.mjs:294 | function |
| Z_7 | createRenderOptions | chunks.157.mjs:455 | function |
| HJ9 | resolvePermissionMode | chunks.157.mjs:151 | function |
| EJ9 | initToolPermissionContext | chunks.157.mjs:253 | function |
| hw9 | runNonInteractive | chunks.157.mjs:422 | function |
| v$A | MainInteractiveApp | chunks.157.mjs:598 | component |

### Commander.js Classes

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| O$1 | CommanderCommand | chunks.157.mjs:15 | class |
| LK | CommanderOption | chunks.157.mjs:21 | class |

### Session Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TBD | loadMostRecentSession | TBD | function |
| TBD | getSessionId | TBD | function |
| TBD | setSessionId | TBD | function |

### Named Sessions (NEW in 2.0.64)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TBD | renameSession | TBD | function |
| TBD | resumeByName | TBD | function |

### MCP CLI

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| de | mcpCliProgram | cli.chunks.mjs:1538 | constant |
| nX9 | mcpCliHandler | chunks.157.mjs:1582-1593 | function |

### Chrome Integration (NEW in 2.1.7)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| oX9 | claudeInChromeMcp | chunks.157.mjs:1599-1616 | function |
| AI9 | chromeNativeHostMain | chunks.157.mjs:1666-1677 | function |
| QI9 | ChromeNativeHostServer | chunks.157.mjs:1679-1816 | class |
| BI9 | NativeMessageReader | chunks.157.mjs:1818-1857 | class |

---

## Module: State Management

### App State Object

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TBD | appState | TBD | object |
| TBD | getDefaultAppState | TBD | function |

### React Context

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TBD | AppStateProvider | TBD | function |
| TBD | useAppState | TBD | function |

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

## Module: Todo List

### Tool & Schema

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TBD | TodoWriteTool | TBD | object |
| TBD | TODOWRITE_TOOL_NAME | TBD | constant |

---

## Module: Compact

> **Analysis Status:** ✅ Complete (v2.1.7)
> **Related docs:** [07_compact/](../07_compact/)

### Core Compact Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| cF1 | fullCompact | chunks.132.mjs:489-579 | function |
| ys2 | autoCompactDispatcher | chunks.132.mjs:1511-1535 | function |
| H97 | generateConversationSummary | chunks.132.mjs:590-652 | function |
| lc | microCompactToolResults | chunks.132.mjs:1111-1224 | function |
| ic | calculateThresholds | chunks.132.mjs:1472-1493 | function |
| nc | isAutoCompactEnabled | chunks.132.mjs:1495-1499 | function |
| l97 | shouldTriggerAutoCompact | chunks.132.mjs:1501-1509 | function |
| xs2 | getAutoCompactTarget | chunks.132.mjs:1458-1470 | function |
| q3A | calculateAvailableTokens | chunks.132.mjs:1452-1456 | function |
| F97 | handleCompactError | chunks.132.mjs:581-588 | function |
| FHA | flattenCompactResult | chunks.132.mjs:485-487 | function |

### Session Memory Compact (NEW in 2.1.x)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| sF1 | sessionMemoryCompact | chunks.132.mjs:1392-1422 | function |
| rF1 | isSessionMemoryCompactEnabled | chunks.132.mjs:1368-1370 | function |
| d97 | buildSessionMemoryCompactResult | chunks.132.mjs:1372-1390 | function |
| m97 | calculateCompactStartIndex | chunks.132.mjs:1346-1366 | function |
| hL0 | adjustStartIndexForToolPairs | chunks.132.mjs:1327-1344 | function |
| h97 | initSessionMemoryConfig | chunks.132.mjs:1288-1298 | function |
| f97 | getSessionMemoryConfig | chunks.132.mjs:1282-1286 | function |
| b97 | setSessionMemoryConfig | chunks.132.mjs:1275-1280 | function |
| Os2 | isTemplateEmpty | chunks.132.mjs:1011-1014 | function |
| Ms2 | buildSessionMemoryPrompt | chunks.132.mjs:1016-1024 | function |
| Ks2 | readSessionMemoryFile | chunks.132.mjs:821-828 | function |

### Post-Compact Attachment Generators

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| E97 | restoreRecentFilesAfterCompact | chunks.132.mjs:654-675 | function |
| z97 | createTodoAttachment | chunks.132.mjs:677-686 | function |
| xL0 | createPlanFileReferenceAttachment | chunks.132.mjs:688-697 | function |
| $97 | createInvokedSkillsAttachment | chunks.132.mjs:699-711 | function |
| C97 | createTaskStatusAttachments | chunks.132.mjs:713-730 | function |
| U97 | shouldExcludeFileFromRestore | chunks.132.mjs:732-747 | function |
| X4 | wrapAttachmentToMessage | chunks.132.mjs:87-94 | function |

### Plan Mode Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Y97 | countUserMessagesSincePlanModeExit | chunks.132.mjs:264-272 | function |

### PreCompact Hook

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| sU0 | executePreCompactHooks | chunks.120.mjs:2173-2202 | function |

### /compact Slash Command

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| EY7 | compactSlashCommand | chunks.136.mjs:2097-2150 | object |

### Token Counting & Estimation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| FhA | estimateTokensWithSafetyMargin | chunks.132.mjs:1087-1099 | function |
| js2 | countMessageTokens | chunks.132.mjs:1071-1079 | function |
| y97 | getCachedToolResultTokens | chunks.132.mjs:1081-1085 | function |
| sH | countTotalTokens | chunks.132.mjs (imported) | function |

### Compact Constants

| Obfuscated | Value | Description |
|------------|-------|-------------|
| uL0 | 13000 | Minimum tokens to preserve when compacting |
| c97 | 20000 | Warning threshold offset from context limit |
| p97 | 20000 | Error threshold offset from context limit |
| mL0 | 3000 | Minimum blocking limit offset |
| K97 | 2 | Max summary generation retry attempts |
| I97 | 5 | Maximum files to restore after compact |
| D97 | 50000 | Total token budget for restored files |
| W97 | 5000 | Maximum tokens per restored file |
| T97 | 20000 | Minimum token savings for micro-compact |
| P97 | 40000 | Default micro-compact threshold |
| S97 | 3 | Number of recent tool results to keep |
| _s2 | 2000 | Estimated tokens per image |

### Micro-Compact State

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| x97 | COMPACTABLE_TOOLS | chunks.132.mjs:1272 | Set |
| bL0 | compactedToolIds | chunks.132.mjs:1272 | Set |
| fL0 | clearedMemoryUuids | chunks.132.mjs:1272 | Set |
| Rs2 | toolResultTokenCache | chunks.132.mjs:1272 | Map |

### Error Messages

| Obfuscated | Value | Description |
|------------|-------|-------------|
| DhA | "Not enough messages to compact." | Empty conversation error |
| V97 | "Conversation too long..." | Prompt too long error |
| vkA | "API Error: Request was aborted." | Request abort error |
| Bs2 | "Compaction interrupted..." | Network/streaming error |

### Environment Variables

| Variable | Purpose |
|----------|---------|
| DISABLE_COMPACT | Completely disable all compaction |
| DISABLE_AUTO_COMPACT | Disable automatic compaction only |
| DISABLE_MICROCOMPACT | Disable micro-compaction |
| CLAUDE_AUTOCOMPACT_PCT_OVERRIDE | Override target percentage (0-100) |
| CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE | Override blocking limit calculation |

---

## Module: Hooks

### Hook Type Schemas (Updated in 2.1.0)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| S75 | commandHookSchema | chunks.90.mjs:1878-1884 | object |
| x75 | promptHookSchema | chunks.90.mjs:1884-1891 | object |
| y75 | agentHookSchema | chunks.90.mjs:1891-1898 | object |
| v75 | hookTypeUnion | chunks.90.mjs:1898 | union |
| k75 | hookMatcherSchema | chunks.90.mjs:1898-1901 | object |
| jb | eventHooksSchema | chunks.90.mjs:1901 | object |
| _b | HOOK_EVENT_TYPES | chunks.90.mjs:1311 | enum |

### Hook State Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| pZ1 | addSessionHook | chunks.91.mjs:2782-2784 | function |
| h32 | addHookToState | chunks.91.mjs:2798-2837 | function |
| g32 | removeHookFromState | chunks.91.mjs:2839-2868 | function |
| f32 | addFunctionHook | chunks.91.mjs:2786-2796 | function |
| wVA | clearSessionHooks | chunks.91.mjs:2933-2943 | function |

### Hook Retrieval

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| al5 | aggregateHooksFromAllSources | chunks.120.mjs:1430-1467 | function |
| uU0 | getMatchingHooks | chunks.120.mjs:1469-1516 | function |
| lZ1 | getSessionHooks | chunks.91.mjs:2877-2891 | function |
| u32 | getSessionFunctionHooks | chunks.91.mjs:2893-2919 | function |
| m32 | findSessionHook | chunks.91.mjs:2921-2931 | function |
| b32 | formatHooksForOutput | chunks.91.mjs:2870-2875 | function |

### Hook Sources

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| o32 | getPolicyHooks | chunks.91.mjs:3225-3228 | function |
| TdA | getPluginHooks | chunks.1.mjs:2764-2766 | function |
| G7A | setPluginHooks | chunks.1.mjs:2755-2762 | function |
| Hf0 | clearPluginHooks | chunks.1.mjs:2768-2774 | function |
| kI0 | loadPolicyHooksConfig | chunks.91.mjs:3149-3153 | function |
| fI0 | initializePolicyHooks | chunks.91.mjs:3179-3182 | function |
| br | isAllowManagedHooksOnly | chunks.91.mjs:3155-3157 | function |

### Hook Matching

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| nl5 | matchHookPattern | chunks.120.mjs:1419-1428 | function |
| LVA | isHookEqual | chunks.91.mjs:2951+ | function |

### Plugin Hooks Loading

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Qt | loadPluginHooks | chunks.120.mjs:2497-2523 | function |
| sl5 | extractPluginHooks | chunks.120.mjs:2446-2474 | function |
| WU | executePluginHooksForEvent | chunks.120.mjs:2526+ | function |

### once Configuration (NEW in 2.1.0)

All hook types support `once: true`:
- **command hooks**: chunks.90.mjs:1883
- **prompt hooks**: chunks.90.mjs:1890
- **agent hooks**: chunks.90.mjs:1897

When `once: true`, hook runs once and is removed after execution.
The removal is handled by `onHookSuccess` callback set to `g32` (removeHookFromState).

### Hook Timeout (Changed in 2.1.3)

Tool hook execution timeout changed from **60 seconds → 10 minutes**.

### Core Hook Execution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| At | executeHooksInREPL | chunks.120.mjs:1532-1908 | async generator |
| pU0 | executeHooksOutsideREPL | chunks.120.mjs:1910-1999 | function |
| CK1 | executeCommandHook | chunks.120.mjs:1319-1416 | function |
| Nu2 | executeAgentHook | chunks.120.mjs:986-1142 | function |
| w82 | executePromptHook | chunks.92.mjs:387-515 | function |
| BR0 | groupMessagesByToolUse | chunks.147.mjs:2599-2677 | function |
| V$A | isHookAttachment | chunks.147.mjs:2679-2681 | function |
| SVA | streamAsyncIterator | chunks.120.mjs | function |

### Event Trigger Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| lU0 | executePreToolHooks | chunks.120.mjs:2027-2043 | async generator |
| iU0 | executePostToolHooks | chunks.120.mjs:2046-2062 | async generator |
| nU0 | executePostToolFailureHooks | chunks.120.mjs:2065-2083 | async generator |
| vE0 | executeNotificationHooks | chunks.120.mjs:2085-2102 | function |
| aU0 | executeStopHooks | chunks.120.mjs:2104-2124 | async generator |
| oU0 | executeUserPromptSubmitHooks | chunks.120.mjs:2126-2139 | async generator |
| rU0 | executeSessionStartHooks | chunks.120.mjs:2141-2155 | async generator |
| kz0 | executeSubagentStartHooks | chunks.120.mjs:2157-2171 | async generator |
| sU0 | executePreCompactHooks | chunks.120.mjs:2173-2202 | function |
| tU0 | executeSessionEndHooks | chunks.120.mjs:2204-2228 | function |
| eU0 | executePermissionRequestHooks | chunks.120.mjs:2230-2247 | async generator |

### Special Hooks

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Aq0 | executeStatusLineHook | chunks.120.mjs:2249-2272 | function |
| Qq0 | executeFileSuggestionHook | chunks.120.mjs:2274-2295 | function |

### Hook Input/Output Processing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Mu2 | parseHookOutput | chunks.120.mjs:1179-1207 | function |
| Ru2 | processHookJsonOutput | chunks.120.mjs:1209-1316 | function |
| jE | createHookEnvironmentContext | chunks.120.mjs:1169-1177 | function |
| BY1 | substituteArguments | chunks.120.mjs | function |

### Hook Output Schema

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| AY1 | hookOutputSchema | chunks.92.mjs:149 | union |
| vG5 | asyncHookResponseSchema | chunks.92.mjs:106-109 | object |
| kG5 | syncHookOutputSchema | chunks.92.mjs:109-149 | object |
| PVA | isAsyncHookResponse | chunks.92.mjs:92-94 | function |
| F82 | isSyncHookResponse | chunks.92.mjs:88-90 | function |
| WyA | promptHookResponseSchema | chunks.92.mjs | object |
| c5 | parseJSON | chunks.92.mjs | function |
| SD | getSmallFastModel | chunks.92.mjs | function |

### Async Hook Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| H82 | registerAsyncHook | chunks.92.mjs:175-198 | function |
| E82 | addAsyncHookStdout | chunks.92.mjs:200-204 | function |
| z82 | addAsyncHookStderr | chunks.92.mjs:206-210 | function |
| $82 | checkAsyncHooks | chunks.92.mjs:212-229 | function |
| Td | asyncHookRegistry | chunks.92.mjs | Map |

### Frontmatter Hooks (NEW in 2.1.0)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| OD1 | registerSkillFrontmatterHooks | chunks.112.mjs:2340-2354 | function |

### Global State for Hooks

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| g0 | globalState | chunks.1.mjs | object |
| kr | cachedPolicyHooks | chunks.91.mjs:3230 | variable |

---

## Module: Skill System

> **Analysis Status:** ✅ Complete (v2.1.7)
> **Related docs:** [10_skill/](../10_skill/), [09_slash_command/](../09_slash_command/)

### Skill Tool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| kF | SKILL_TOOL_NAME | chunks.113.mjs | constant |
| Hf5 | skillInputSchema | chunks.113.mjs:737-739 | object |

### Skill Loading Pipeline (v2.1.7)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Wz7 | getSkills | chunks.146.mjs:2299-2318 | function |
| lO0 | loadSkillDirectoryCommands | chunks.133.mjs:2069-2096 | function |
| tw0 | getPluginSkills | chunks.130.mjs:1945-1979 | function |
| kZ9 | getBundledSkills | chunks.145.mjs:1774-1775 | function |
| vZ9 | bundledSkillsRegistry | chunks.145.mjs:1778 | variable |
| cO0 | scanSkillDirectory | chunks.133.mjs | function |
| So2 | loadSkillsFromPath | chunks.130.mjs | function |
| A77 | getFileInode | chunks.133.mjs | function |
| Y77 | loadLegacyCommands | chunks.133.mjs | function |

**Loading flow:**
1. `Wz7(A)` orchestrates loading via Promise.all
2. `lO0(A)` loads from managed/user/project directories
3. `tw0()` loads from enabled plugins
4. `kZ9()` returns bundled skills from `vZ9` registry
5. Deduplicates by inode via `A77()`

### Command Aggregation & Filtering (v2.1.7)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Aj | getAllCommands | chunks.146.mjs:2448-2454 | function |
| Nc | getLLMInvocableSkills | chunks.146.mjs:2456-2457 | function |
| hD1 | getUserSkills | chunks.146.mjs:2458-2464 | function |
| nY9 | getAllBuiltinCommands | chunks.146.mjs:2447 | function |
| xs | getBuiltinCommandNames | chunks.146.mjs:2447 | function |
| lt | clearSkillCaches | chunks.146.mjs:2320-2321 | function |

### Command Resolution (v2.1.7)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Cc | commandExists | chunks.146.mjs:2324-2326 | function |
| eS | findCommand | chunks.146.mjs:2328-2332 | function |
| gzA | getDescription | chunks.146.mjs:2334-2343 | function |

### Command Parsing (v2.1.7)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| wP2 | extractCommandParts | chunks.112.mjs:2323-2337 | function |
| nb5 | isValidCommandName | chunks.112.mjs:2478-2479 | function |
| OP2 | parseSlashCommandInput | chunks.112.mjs:2482-2570 | function |

### Command Execution (v2.1.7)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ab5 | executeSlashCommand | chunks.112.mjs:2597-2747 | function |
| RP2 | processPromptSlashCommand | chunks.112.mjs:2778-2818 | function |
| ib5 | executeForkedSlashCommand | chunks.112.mjs:2390-2475 | function |
| MP2 | executeSkillFromTool | chunks.112.mjs:2771-2776 | function |
| MD1 | trackSkillUsage | chunks.112.mjs:2362-2376 | function |
| q0 | generateHookId | chunks.112.mjs | function |
| H0 | createUserMessage | chunks.147.mjs:2410-2440 | function |
| X4 | createPermissionMessage | chunks.132.mjs:87-94 | function |
| Uc | parseAllowedTools | chunks.112.mjs | function |
| Hm | calculateThinkingTokens | chunks.112.mjs | function |
| QY1 | getSystemReminders | chunks.131.mjs | function |

### Metadata Formatting (v2.1.7)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ckA | formatCommandMetadata | chunks.112.mjs:2749-2752 | function |
| ob5 | formatSkillMetadata | chunks.112.mjs:2765-2768 | function |
| xz0 | formatSkillFormat | chunks.112.mjs:2755-2758 | function |
| LP2 | formatUserInvocableMetadata | chunks.112.mjs:2760-2762 | function |
| VHA | extractTextContent | chunks.131.mjs:3614-3621 | function |

### Serial Command Queue (v2.1.7)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bb5 | enqueueSerialCommand | chunks.112.mjs | function |
| cb5 | dequeueSerialCommand | chunks.112.mjs | function |
| db5 | processCommandQueue | chunks.112.mjs | function |
| eb5 | clearCommandQueue | chunks.112.mjs | function |

### Hook Registration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| OD1 | registerSkillHooks | chunks.112.mjs:2340-2354 | function |
| g32 | removeHook | chunks.112.mjs | function |
| pZ1 | registerHook | chunks.112.mjs | function |

### Fork Context Execution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ff5 | executeForkSkill | chunks.113.mjs:646-697 | function |
| TD1 | prepareForkContext | chunks.113.mjs | function |
| $f | runAgentLoop | chunks.113.mjs:661 | function |
| I52 | prepareForkMessages | chunks.113.mjs:138 | function |
| PD1 | formatSkillResult | chunks.113.mjs:686 | function |

**Fork execution flow:**
1. `eS(X, I)` looks up command/skill definition
2. If `D.type === "prompt" && D.context === "fork"`, calls `ib5`
3. `ib5` creates isolated agent context via `TD1`
4. Runs skill in sub-agent loop via `$f`
5. Returns `status: "forked"` with agentId

### Built-in Commands (Sample)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| VY7 | clearCommand | chunks.136.mjs:1953-1970 | object |
| EY7 | compactCommand | chunks.136.mjs:2097-2150 | object |
| WB9 | configCommand | chunks.137.mjs:1751 | object |
| F29 | helpCommand | chunks.138.mjs:327 | object |
| TG9 | modelCommand | chunks.145.mjs:2226 | object |

---

## Module: Thinking Mode

### Thinking Configuration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TBD | detectThinkingKeyword | TBD | function |
| TBD | isUltrathinkExact | TBD | function |
| TBD | calculateThinkingTokens | TBD | function |

### Default for Opus 4.5 (NEW in 2.0.67)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TBD | isThinkingEnabledByDefault | TBD | function |
| TBD | getModelThinkingDefault | TBD | function |

---

## Analysis Progress

| Module | Status | Priority |
|--------|--------|----------|
| Background Agents | ✅ Complete | P1 |
| Subagent Execution | ✅ Complete | P1 |
| Built-in Agents | ✅ Complete (6 agents) | P1 |
| Plugin Agent Integration | ✅ Complete (v2.1.7) | P1 |
| Skill System + Slash Commands | ✅ Complete (v2.1.7) | P1 |
| Plugin Skills | ✅ Complete (v2.1.7) | P1 |
| Agent Loop | ✅ Complete (v2.1.7) | P1 |
| LLM API | ✅ Complete (v2.1.7) | P1 |
| Tools | ✅ Complete (v2.1.7) | P1 |
| Plan Mode | ✅ Complete (v2.1.7) | P1 |
| Hooks (frontmatter) | Partial | P2 |
| All others | TBD | P3+ |

---

## See Also

- [symbol_index_infra.md](./symbol_index_infra.md) - Infrastructure modules
- [file_index.md](./file_index.md) - File content index
- [changelog_analysis.md](./changelog_analysis.md) - Version changes
