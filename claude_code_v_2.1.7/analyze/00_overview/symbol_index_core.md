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

> Key files: chunks.68.mjs (keybindings), chunks.121.mjs (background logic), chunks.91.mjs (task state), chunks.112/153.mjs (UI)

---

## Module: Plan Mode

### EnterPlanMode Tool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TBD | ENTER_PLAN_MODE_NAME | TBD | constant |
| TBD | EnterPlanModeTool | TBD | object |
| TBD | EnterPlanModeConfirmUI | TBD | function |

### ExitPlanMode Tool

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TBD | EXIT_PLAN_MODE_NAME | TBD | constant |
| TBD | ExitPlanModeTool | TBD | object |

### Plan File Persistence

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TBD | getPlansDirectory | TBD | function |
| TBD | getPlanFilePath | TBD | function |
| TBD | readPlanFile | TBD | function |
| TBD | generateRandomPlanSlug | TBD | function |

> Note: Plan files now persist across `/clear` (fixed in 2.1.3)

---

## Module: Core Entry & CLI

### Entry Point Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TBD | mainEntry | TBD | function |
| TBD | commandHandler | TBD | function |
| TBD | initializeConfig | TBD | function |
| TBD | renderInteractive | TBD | function |

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

### Main Loop Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TBD | mainAgentLoop | TBD | function |
| TBD | StreamingToolExecutor | TBD | class |
| TBD | executeSingleTool | TBD | function |
| TBD | groupToolsByConcurrency | TBD | function |

### Async Execution (Enhanced in 2.0.64)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TBD | asyncAgentExecution | TBD | function |
| TBD | wakeMainAgent | TBD | function |

---

## Module: LLM API

### API Calling

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| v51 | retryApiCall | chunks.85.mjs:3-68 | function |
| ps8 | parseRetryAfter | chunks.85.mjs:70-72 | function |
| fSA | calculateBackoffDelay | chunks.85.mjs:74-82 | function |
| TeB | parseContextOverflow | chunks.85.mjs:84-103 | function |
| ls8 | isOverloadedError | chunks.85.mjs:105-108 | function |
| ns8 | shouldRetryError | chunks.85.mjs:122-137 | function |
| as8 | getMaxRetries | chunks.85.mjs:139-143 | function |

### Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ms8 | MAX_RETRIES_DEFAULT | chunks.85.mjs:145 | constant (10) |
| qZ0 | FLOOR_OUTPUT_TOKENS | chunks.85.mjs:147 | constant (3000) |
| ds8 | FALLBACK_TRIGGER_COUNT | chunks.85.mjs:149 | constant (3) |

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

### Tool Name Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| X9 | BASH_TOOL_NAME | chunks.93.mjs:22 | constant ("Bash") |
| z3 | READ_TOOL_NAME | chunks.93.mjs:207 | constant ("Read") |
| TBD | WRITE_TOOL_NAME | TBD | constant |
| TBD | EDIT_TOOL_NAME | TBD | constant |
| f3 | TASK_TOOL_NAME | chunks.113.mjs:83 | constant ("Task") |
| TBD | TODOWRITE_TOOL_NAME | TBD | constant |
| lI | GLOB_TOOL_NAME | chunks.93.mjs:385 | constant ("Glob") |
| DI | GREP_TOOL_NAME | chunks.93.mjs:385 | constant ("Grep") |
| cI | WEBFETCH_TOOL_NAME | chunks.93.mjs:385 | constant ("WebFetch") |
| aR | WEBSEARCH_TOOL_NAME | chunks.93.mjs:385 | constant ("WebSearch") |
| kF | SKILL_TOOL_NAME | chunks.113.mjs:408 | constant ("Skill") |

### Bash Tool with Background Support

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| wd2 | bashInputSchema | chunks.124.mjs:1458-1492 | object |
| rq0 | bashOutputSchema | chunks.124.mjs:1493-1501 | object |
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

### Core Compact Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TBD | fullCompact | TBD | function |
| TBD | autoCompactDispatcher | TBD | function |
| TBD | microCompactToolResults | TBD | function |

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

### Metadata Formatting (v2.1.7)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ckA | formatCommandMetadata | chunks.112.mjs:2749-2752 | function |
| ob5 | formatSkillMetadata | chunks.112.mjs:2765-2768 | function |
| xz0 | formatSkillFormat | chunks.112.mjs:2755-2758 | function |
| LP2 | formatUserInvocableMetadata | chunks.112.mjs:2760-2762 | function |

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
| Skill System + Slash Commands | ✅ Complete (v2.1.7) | P1 |
| Plugin Skills | ✅ Complete (v2.1.7) | P1 |
| LLM API | Partial mapping | P2 |
| Plan Mode | TBD | P3 |
| Hooks (frontmatter) | Partial | P2 |
| All others | TBD | P3+ |

---

## See Also

- [symbol_index_infra.md](./symbol_index_infra.md) - Infrastructure modules
- [file_index.md](./file_index.md) - File content index
- [changelog_analysis.md](./changelog_analysis.md) - Version changes
