# Symbol Index - Core Features (Claude Code 2.1.7)

> Symbol mapping table Part 2: Core features and capabilities
> Lookup: Browse by module, or Ctrl+F search for obfuscated/readable name.
>
> **Related files:**
> - [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution flow
> - [symbol_index_infra_platform.md](./symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - Integration infrastructure

---

## Quick Navigation

- [Background Agents](#module-background-agents) - **NEW in 2.0.60+**
- [Plan Mode](#module-plan-mode)
- [Core Entry & CLI](#module-core-entry--cli)
- [Todo List](#module-todo-list)
- [Compact](#module-compact)
- [Hooks](#module-hooks)
- [Skill System](#module-skill-system)
- [Thinking Mode](#module-thinking-mode)
- [Steering](#module-steering) - **NEW in 2.1.7**

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
| GY0 | getUniquePlanSlug | chunks.86.mjs:23-37 | function |
| ZY0 | cachePlanSlug | chunks.86.mjs:39-41 | function |

### Plan Mode State Tracking

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| g0 | globalState | chunks.1.mjs:2321 | object |
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
| ar2 | PLAN_MODE_CONSTANTS | chunks.132.mjs:330 | object |

### Plan Mode Permission Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| re | buildPermissionRules | chunks.150.mjs:2402-2418 | function |
| aK1 | semanticToRegex | chunks.123.mjs:1838 | function |

### Plan Mode Model Selection (Main Loop Integration)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| HQA | selectModelForPlanMode | chunks.46.mjs:2259-2268 | function |
| h51 | checkExceeds200kTokens | chunks.85.mjs:921-931 | function |
| FQA | getMainLoopModelSetting | chunks.46.mjs:2216-2223 | function |
| sJA | getOpusModel | chunks.46.mjs:2248-2252 | function |
| OR | getSonnetModel | chunks.46.mjs:2231-2234 | function |
| k1 | handleModeCycle | chunks.152.mjs:2512-2529 | function (callback) |
| kK9 | getNextModeInCycle | chunks.151.mjs:3438-3455 | function |

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
| ji5 | loadMostRecentSession | chunks.154.mjs:1058-1085 | function |
| q0 | getSessionId | chunks.1.mjs:2312-2314 | function |
| pw | setSessionId | chunks.1.mjs:2316-2318 | function |

### Named Sessions (NEW in 2.0.64)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Bi5 | renameSession | chunks.154.mjs:1087-1105 | function |
| Ni5 | resumeByName | chunks.154.mjs:1107-1130 | function |

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

## Module: Todo List

> **Analysis Status:** ✅ Complete (v2.1.7)
> **Related docs:** [13_todo_list/](../13_todo_list/)

### Tool & Schema

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Bm | TODOWRITE_TOOL_NAME | chunks.59.mjs:224 | constant ("TodoWrite") |
| vD | TodoWriteTool | chunks.59.mjs:402-481 | object |
| KCB | todoWriteToolPrompt | chunks.59.mjs:4-186 | constant |
| VCB | todoWriteShortDescription | chunks.58.mjs:3318 | constant |
| NX8 | todoStatusEnum | chunks.59.mjs:197 | enum |
| wX8 | todoItemSchema | chunks.59.mjs:197-201 | object |
| jIA | todoArraySchema | chunks.59.mjs:201 | array |
| SX8 | todoWriteInputSchema | chunks.59.mjs:397-398 | object |
| xX8 | todoWriteOutputSchema | chunks.59.mjs:399-401 | object |

### Render Functions (all return null - silent tool)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| HCB | renderTodoToolUseMessage | chunks.59.mjs:204-206 | function |
| ECB | renderTodoProgressMessage | chunks.59.mjs:208-210 | function |
| zCB | renderTodoRejectedMessage | chunks.59.mjs:212-214 | function |
| $CB | renderTodoErrorMessage | chunks.59.mjs:216-218 | function |
| CCB | renderTodoResultMessage | chunks.59.mjs:220-222 | function |

### Todo Reminder System

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| s27 | countTurnsSinceLastTodo | chunks.132.mjs:96-115 | function |
| t27 | generateTodoReminderAttachments | chunks.132.mjs:117-133 | function |
| nr2 | TODO_REMINDER_CONSTANTS | chunks.132.mjs:327-330 | object |
| z97 | createTodoAttachment | chunks.132.mjs:677-686 | function |

### Constants

| Constant | Value | Description |
|----------|-------|-------------|
| nr2.TURNS_SINCE_WRITE | 10 | Turns without TodoWrite before reminder |
| nr2.TURNS_BETWEEN_REMINDERS | 10 | Minimum turns between reminders |

### UI Components

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ns | TodoListComponent | chunks.107.mjs:1804-1838 | function |
| Yx5 | getStatusIcon | chunks.107.mjs:1857-1872 | function |
| SI1 | TasksV2UIComponent | chunks.107.mjs:1912 | function (NEW) |

### Persistence Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| FY0 | getTodosDirectory | chunks.86.mjs:888-892 | function |
| Ir | getTodoFilePath | chunks.86.mjs:894-897 | function |
| Cb | readTodosFromFile | chunks.86.mjs:899-901 | function |
| d9A | writeTodosToFile | chunks.86.mjs:903-905 | function |
| M12 | readJsonFile | chunks.86.mjs:927-937 | function |
| R12 | writeJsonFile | chunks.86.mjs:939-945 | function |

### Tasks v2 System (NEW in 2.1.x - currently disabled)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Gm | isTasksV2Enabled | chunks.59.mjs:242-244 | function (returns false) |
| PIA | getTaskListId | chunks.59.mjs:269-271 | function |
| RBA | readTasksFromFile | chunks.59.mjs:336-352 | function |
| _CB | createTask | chunks.59.mjs:312-333 | function |
| HY0 | migrateTodosToV2 | chunks.86.mjs:947-968 | function |

### State Listener

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| wCB | addTodoStateListener | chunks.59.mjs:232-234 | function |
| LCB | notifyTodoStateListeners | chunks.59.mjs:236-240 | function |
| o10 | todoStateListeners | chunks.59.mjs:371 | Set |
| OCB | clearCompletedTasks | chunks.107.mjs:1931 | function |

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
| E97 | restoreFilesPostCompact | chunks.132.mjs:654-675 | function |
| z97 | createTodoAttachment | chunks.132.mjs:677-686 | function |
| xL0 | createPlanFileReferenceAttachment | chunks.132.mjs:688-697 | function |
| $97 | createInvokedSkillsAttachment | chunks.132.mjs:699-711 | function |
| C97 | createTaskStatusAttachments | chunks.132.mjs:713-730 | function |
| U97 | shouldExcludeFromRestore | chunks.132.mjs:732-747 | function |
| TL0 | readFileForRestore | chunks.132.mjs:3-85 | function |
| X4 | wrapAttachmentToMessage | chunks.132.mjs:87-94 | function |

### Plan Mode Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Y97 | countUserMessagesSincePlanModeExit | chunks.132.mjs:264-272 | function |
| T27 | createPlanModeExitAttachment | chunks.131.mjs:3233-3244 | function |
| R27 | analyzeRecentPlanModeActivity | chunks.131.mjs:3176-3193 | function |
| _27 | countPlanModeAttachmentsSinceExit | chunks.131.mjs:3195-3205 | function |
| dC | getPlanFilePath | chunks.86.mjs:58-62 | function |
| AK | readPlanFile | chunks.86.mjs:64-74 | function |

### Tool Result Persistence

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Z4A | persistLargeToolResult | chunks.89.mjs:2412-2443 | function |
| F85 | wrapTruncatedToolResult | chunks.89.mjs:2463-2483 | function |

### Content Analysis

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| X97 | analyzeContentBlock | chunks.132.mjs:391-425 | function |

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

> **Analysis Status:** ✅ Complete (v2.1.7)
> **Related docs:** [19_think_level/](../19_think_level/)

### Core Enable/Disable Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| q91 | isThinkingEnabled | chunks.68.mjs:3540-3547 | function |
| wz8 | isModelThinkingCapable | chunks.68.mjs:3533-3538 | function |
| Hm | calculateMaxThinkingTokens | chunks.68.mjs:3466-3476 | function |
| o5A | getModelMaxThinkingTokens | chunks.1.mjs:2240-2252 | function |

### Keyword Detection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| CjA | detectThinkingKeyword | chunks.68.mjs:3513-3518 | function |
| qz8 | extractThinkingFromMessage | chunks.68.mjs:3482-3506 | function |
| Nz8 | getMessageTextContent | chunks.68.mjs:3508-3511 | function |
| Uz8 | thinkingLevelToTokens | chunks.68.mjs:3478-3480 | function |
| zDA | extractKeywordPositions | chunks.68.mjs:3521-3531 | function |

### Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| sB0 | THINKING_TOKEN_LEVELS | chunks.68.mjs:3573-3576 | constant |
| sB0.ULTRATHINK | 31999 | chunks.68.mjs:3574 | constant |
| sB0.NONE | 0 | chunks.68.mjs:3575 | constant |
| Cz8 | ULTRATHINK_REGEX | chunks.68.mjs:3576 | constant |
| jZ0 | DEFAULT_THINKING_BUDGET | chunks.85.mjs:856 | constant (1024) |
| C91 | THINKING_LEVEL_COLORS | chunks.68.mjs:3567-3569 | constant |
| kRB | THINKING_SHIMMER_COLORS | chunks.68.mjs:3569-3572 | constant |
| zz8 | RAINBOW_COLORS | chunks.68.mjs:3572 | constant |
| $z8 | RAINBOW_SHIMMER_COLORS | chunks.68.mjs:3572 | constant |

### Thinking Content Detection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| leB | containsThinkingContent | chunks.85.mjs:640-646 | function |
| _J9 | isThinkingBlock | chunks.148.mjs:555-557 | function |
| dF1 | isThinkingOnlyMessage | chunks.148.mjs:511-515 | function |

### Compact/Restore Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| UG7 | filterCompactableMessages | chunks.135.mjs:694-712 | function |
| w$7 | removeTrailingThinkingBlocks | chunks.148.mjs:559-589 | function |
| Su2 | filterOrphanedThinkingMessages | chunks.148.mjs:591-611 | function |
| dbA | restoreSessionMessages | chunks.120.mjs:2594-2605 | function |
| s27 | countTurnsForTodoReminder | chunks.132.mjs:96-115 | function |

### Main Loop Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| vH1 | processUserInputWithThinking | chunks.134.mjs:2620-2642 | function |
| r77 | buildUserInputMessage | chunks.134.mjs:2582-2606 | function |
| aN | mainQueryLoop | chunks.134.mjs:99-114 | async generator |
| oHA | apiStreamHandler | chunks.134.mjs:202-206 | async generator |

### Subagent Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| WJ | buildToolUseContextForSubagent | chunks.154.mjs:1054-1073 | function |
| lkA | buildToolUseContext | chunks.134.mjs:1918-1962 | function |

### Interleaved Thinking (Beta)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $b0 | INTERLEAVED_THINKING_BETA | chunks.1.mjs:2207 | constant |
| lU1 | INTERLEAVED_THINKING_BETAS | chunks.1.mjs:2228 | constant (Set) |
| iU1 | VERTEX_SUPPORTED_BETAS | chunks.1.mjs:2228 | constant (Set) |

### Settings Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| - | alwaysThinkingEnabled | chunks.90.mjs:1967 | settings field |
| - | thinkingEnabled | chunks.137.mjs:696-709 | config toggle |

### Streaming Handlers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| - | content_block_start (thinking) | chunks.147.mjs:206-210 | event handler |
| - | thinking_delta | chunks.147.mjs:257-264 | event handler |

---

## Module: Steering

> **Analysis Status:** ✅ Complete (v2.1.7)
> **Related docs:** [21_steering/](../21_steering/)

### System Reminder Extraction

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| PG5 | SYSTEM_REMINDER_REGEX | chunks.91.mjs:3581 | constant (RegExp) |
| mI0 | extractSystemReminder | chunks.91.mjs:3368-3371 | function |
| SG5 | filterSystemReminderMessages | chunks.91.mjs:3373-3403 | function |

### System Reminder Wrappers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Yh | wrapSystemReminderText | chunks.147.mjs:3212-3216 | function |
| q5 | wrapInSystemReminder | chunks.147.mjs:3218-3245 | function |
| H0 | createMetaBlock | chunks.147.mjs:2410-2440 | function |

### User Context Injection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _3A | injectUserContext | chunks.133.mjs:2585-2599 | function |
| fA9 | combineSystemContext | chunks.133.mjs:2580-2583 | function |

### Context Modifier Flow

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| KM0 | serialExecutionContextFlow | chunks.134.mjs:571-610 | async generator |
| S77 | groupByConcurrencySafety | chunks.134.mjs:612-624 | function |
| y77 | executeConcurrentTools | chunks.134.mjs (internal) | async generator |
| x77 | executeSerialTools | chunks.134.mjs:626-639 | async generator |

### File State Tracking

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| VzA | buildReadFileStateMapping | chunks.135.mjs:519-576 | function |
| MKA | mergeReadFileState | chunks.86.mjs:851-858 | function |
| BG7 | MAX_FILE_STATE_CACHE_SIZE | chunks.135.mjs:578 | constant (10) |

### Plan Mode Steering (Cross-ref: Plan Mode)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| z$7 | buildPlanModeSystemReminder | chunks.147.mjs:3247-3251 | function (router) |
| $$7 | buildFullPlanReminder | chunks.147.mjs:3253-3330 | function |
| C$7 | buildSparsePlanReminder | chunks.147.mjs:3332-3338 | function |
| U$7 | buildSubAgentPlanReminder | chunks.147.mjs:3340-3351 | function |

### Attachment Pipeline

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| O27 | generateAllAttachments | chunks.131.mjs:3121-3138 | function |
| q$7 | convertAttachmentToSystemMessage | chunks.148.mjs:3-371 | function |
| fJ | wrapWithErrorHandling | chunks.131.mjs:3140-3163 | function |
| MuA | createToolUseMessage | chunks.148.mjs:392-397 | function |
| OuA | createToolResultMessage | chunks.148.mjs:373-390 | function |

### Main Loop Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| aN | mainAgentLoop | chunks.133.mjs:2900+ | async function |
| VHA | prepareToolUseContext | chunks.133.mjs:2650-2690 | function |
| oHA | prepareMessagesForApi | chunks.135.mjs:480-511 | function |
| BJ9 | buildFinalApiMessages | chunks.133.mjs:2765-2800 | function |
| T77 | sendApiRequest | chunks.87.mjs | async function |

### Hook-Steering Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| oG0 | runPreToolUseHook | chunks.120.mjs:1165-1210 | async function |
| QG0 | runPostToolUseHook | chunks.120.mjs:1245-1295 | async function |
| tO9 | handleToolPermissionDecision | chunks.147.mjs:1570-1598 | async function |

### Hook additionalContext Events

| Hook Event | Description |
|------------|-------------|
| UserPromptSubmit | After user sends message |
| SessionStart | At session initialization |
| SubagentStart | When spawning subagent |
| PostToolUse | After tool execution |
| PostToolUseFailure | After tool failure |

> Key files: chunks.91.mjs (extraction), chunks.133.mjs (injection/main loop), chunks.134.mjs (context modifiers), chunks.135.mjs (file state/api prep), chunks.147.mjs (reminders/permissions), chunks.148.mjs (attachment conversion), chunks.131.mjs (attachment generation), chunks.120.mjs (hooks), chunks.87.mjs (API)

---

## See Also

- [symbol_index_core_execution.md](./symbol_index_core_execution.md) - Core execution flow
- [symbol_index_infra_platform.md](./symbol_index_infra_platform.md) - Platform infrastructure (MCP, Auth, etc.)
- [symbol_index_infra_integration.md](./symbol_index_infra_integration.md) - Integration infrastructure (LSP, Chrome, IDE, etc.)
- [file_index.md](./file_index.md) - File content index
- [changelog_analysis.md](./changelog_analysis.md) - Version changes
