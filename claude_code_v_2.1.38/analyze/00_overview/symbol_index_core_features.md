# Symbol Index - Core Features (Claude Code 2.1.38)

> Symbol mapping table Part 2: Core features and capabilities
> Lookup: Browse by module, or Ctrl+F search for obfuscated/readable name.

---

## Quick Navigation

- [Rewind / Checkpointing](#module-rewind--checkpointing) - **NEW in 2.1.x**
- [Agent Teams](#module-agent-teams) - **NEW in 2.1.32**
- [Auto Memory](#module-auto-memory) - **NEW in 2.1.32**
- [Task System](#module-task-system) - **REFACTORED from Todo List**
- [Keybindings](#module-keybindings) - **NEW in 2.1.18**
- [Remote Sessions](#module-remote-sessions) - **NEW in 2.1.27**
- [Fast Mode](#module-fast-mode) - **NEW in 2.1.36**
- [Plan Mode](#module-plan-mode)
- [Compact](#module-compact)
- [Hooks](#module-hooks)
- [Skill System](#module-skill-system)
- [Thinking Mode](#module-thinking-mode)
- [Steering](#module-steering)
- [System Reminder](#module-system-reminder)
- [Status Line](#status-line)
- [CLI — Agent SDK Entrypoint](#agent-sdk--entrypoint--mode-detection)

---

## Module: Agent Teams

> Full analysis: [30_agent_teams/](../30_agent_teams/)
> **NEW in 2.1.32** - Multi-agent collaboration via swarms

### Team Management & Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| cRA | getTeamSubdirectory | chunks.141.mjs:526 | function |
| F$1 | cleanupTeam | chunks.123.mjs:187 | function |
| FSY | sanitizeTeamName | chunks.141.mjs:543 | function |
| iB | SEND_MESSAGE_TOOL_NAME | chunks.89.mjs:592 | constant ("SendMessage") |
| M51 | readTeamConfig | chunks.131.mjs:2046 | function |
| mSY | writeTeamConfig | chunks.141.mjs:534 | function |
| QP | getTeamsBaseDirectory | chunks.1.mjs:4047 | function |
| QSY | TeamCreateTool | chunks.141.mjs:571 | object |
| ul4 | getTeamConfigPath | chunks.141.mjs:530 | function |
| USY | TeamDeleteTool | chunks.141.mjs:759 | object |
| YhY | SendMessageTool | chunks.141.mjs:1373 | object |

### Spawn & Execution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| iVY | spawnTeammateDispatcher | chunks.131.mjs:2467 | function |
| Rm | isInProcessEnabled | chunks.131.mjs:1586 | function |
| LP1 | spawnInProcessTeammate | chunks.123.mjs:242 | function |
| dVY | spawnSplitPaneTeammate | chunks.131.mjs:2077 | function |
| cVY | spawnSeparateWindowTeammate | chunks.131.mjs:2202 | function |
| WVY | inProcessPollLoop | chunks.131.mjs:260 | function |
| GVY | inProcessAgentRunner | chunks.131.mjs:347 | function |

### Backend Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| fEA | TmuxBackend | chunks.131.mjs:1144 | class |
| EEA | ITermBackend | chunks.131.mjs:1381 | class |
| zt | getBackend | chunks.131.mjs:1493 | function |
| OI | isRunningInsideTmux | chunks.131.mjs:759 | function |
| j51 | isRunningInIterm2 | chunks.131.mjs:772 | function |
| Kt | isTmuxInstalled | chunks.131.mjs:768 | function |
| xQ1 | isIt2CliInstalled | chunks.131.mjs:780 | function |
| WN | SWARM_SESSION_NAME | chunks.131.mjs:1237 | constant ("claude-swarm") |
| gP1 | SWARM_VIEW_WINDOW_NAME | chunks.131.mjs:1241 | constant ("swarm-view") |

### Message Handling

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| AhY | handlePlanApproval | chunks.141.mjs:1239 | function |
| aSY | handleBroadcast | chunks.141.mjs:1434 | function |
| eSY | handleShutdownRejection | chunks.141.mjs:1216 | function |
| iP1 | parsePlanApprovalResponse | chunks.129.mjs:1428 | function |
| Nx4 | PlanApprovalResponseMessageSchema | chunks.129.mjs:1553 | schema |
| oSY | handleDirectMessage | chunks.141.mjs:1432 | function |
| qhY | handlePlanRejection | chunks.141.mjs:1265 | function |
| sSY | handleShutdownRequest | chunks.141.mjs:1436 | function |
| tSY | handleShutdownApproval | chunks.141.mjs:1160 | function |
| Vx4 | PlanApprovalRequestMessageSchema | chunks.129.mjs:1546 | schema |

### Mailbox & Communication

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| as | getInboxPath | chunks.129.mjs:1067 | function |
| eZY | ensureInboxDirectoryExists | chunks.129.mjs:1080 | function |
| f9 | writeToMailbox | chunks.129.mjs:1107 | function |
| JQ1 | markMessageAsReadByIndex | chunks.129.mjs:1130 | function |
| Ld | readMailbox | chunks.129.mjs:1089 | function |
| ss | parseShutdownRequest | chunks.129.mjs:1396 | function |

### Task Auto-Claim & Dependencies

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ib4 | claimNextTask | chunks.131.mjs:241 | function |
| MVY | findNextAvailableTask | chunks.131.mjs:222 | function |
| o7A | attemptToClaimTask | chunks.48.mjs:593 | function |
| PVY | generatePromptFromTask | chunks.131.mjs:231 | function |
| r7A | addDependency | chunks.48.mjs:569 | function |
| sq6 | deleteTask | chunks.48.mjs:530 | function |
| WX | getAllTasks | chunks.48.mjs:555 | function |

---

## Module: Auto Memory

> Full analysis: [31_auto_memory/](../31_auto_memory/)
> **NEW in 2.1.32** - Persistent memory via MEMORY.md

### Memory Logic

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| pN9 | MEMORY_MD_FILENAME | chunks.87.mjs:2229 | constant ("MEMORY.md") |
| Ua | MEMORY_MD_FILENAME_ALT | chunks.87.mjs:2310 | constant ("MEMORY.md") |
| Qu1 | MEMORY_MAX_LINES | chunks.87.mjs:2312 | constant (200) |
| Cp | MEMORY_FILE_SIZE_WARNING_THRESHOLD | chunks.88.mjs:2530 | constant (40000) |
| F0A | getMemoryContext | chunks.87.mjs:2299 | function |
| m0A | buildMemoryPrompt | chunks.87.mjs:2257 | function |
| y2 | isAutoMemoryEnabled | chunks.87.mjs:2194 | function |
| ga | getHomeDirectory | chunks.87.mjs:2204 | function |
| mu1 | getAutoMemoryDirectory | chunks.87.mjs:2213 | function |
| LU7 | getCurrentContextPath | chunks.87.mjs:2209 | function |
| dx | hashPath | chunks.10.mjs:1191 | function |
| Fu1 | isAutoMemoryPath | chunks.87.mjs:2223 | function |
| gN9 | normalizedPath | chunks.87.mjs:2209 | function |
| cN9 | recordMemoryDirLoadMetrics | chunks.87.mjs:2240 | function |
| DK1 | getLargeMemoryFiles | chunks.88.mjs:2439 | function |

### TUI Components

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| toY | memoryEditorModal | chunks.155.mjs:714 | function |
| Z7 | updateUserSettings | chunks.40.mjs:849 | function |

---

## Module: Task System

> Full analysis: [13_task_system/](../13_task_system/), [05_tools/task_management_tools.md](../05_tools/task_management_tools.md)
> **REFACTORED** - Replaces Todo List (v2.1.7)

### Task Tools (Names)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Nh | TASK_CREATE_TOOL_NAME | chunks.140.mjs:2806 | constant ("TaskCreate") |
| NK1 | TASK_GET_TOOL_NAME | chunks.140.mjs:2953 | constant ("TaskGet") |
| DR | TASK_UPDATE_TOOL_NAME | chunks.141.mjs:32 | constant ("TaskUpdate") |
| TK1 | TASK_LIST_TOOL_NAME | chunks.141.mjs:299 | constant ("TaskList") |

### Task State & Logic

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| WM | getTaskManager | chunks.140.mjs:2850 | function |
| lg | findTaskById | chunks.141.mjs:89 | function |
| JS | updateTaskState | chunks.141.mjs:151 | function |
| n_1 | createTask | chunks.140.mjs:2850 | function |
| r7A | addDependency | chunks.141.mjs:172 | function |
| Cg1 | executeTaskCompletedHooks | chunks.141.mjs:2927 | generator (also in Hooks module) |
| J71 | taskStatusSchema | chunks.140.mjs:2949 | schema (pending, in_progress, completed) |

### TodoWrite Tool (Simple Todo List)

> Mutually exclusive with structured Task tools. Enabled when `jH()` returns false.
> Full analysis: [05_tools/task_management_tools.md](../05_tools/task_management_tools.md#7-todowrite-tool)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bO | TodoWriteTool | chunks.48.mjs:772 | object |
| cg | TODO_WRITE_TOOL_NAME | chunks.48.mjs:224 | constant ("TodoWrite") |
| Sf5 | todoWriteInputSchema | chunks.48.mjs:767 | schema |
| hf5 | todoWriteOutputSchema | chunks.48.mjs:769 | schema |
| d_1 | todoArraySchema | chunks.48.mjs:201 | schema |
| Vf5 | todoItemSchema | chunks.48.mjs:197 | schema |
| ff5 | todoStatusSchema | chunks.48.mjs:197 | schema |
| jH | isStructuredTasksEnabled | chunks.48.mjs:405 | function |
| U6 | getCurrentAgentId | chunks.48.mjs | function |

---

## Module: Keybindings

> Full analysis: [32_keybindings/](../32_keybindings/)
> **NEW in 2.1.18** - Customizable keyboard shortcuts

### Configuration & Loading

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Mk5 | loadKeybindingsAsync | chunks.54.mjs:1635 | function |
| YS1 | loadKeybindingsSync | chunks.54.mjs:1700 | function |
| kq7 | getCachedBindings | chunks.54.mjs:1695 | function |
| R71 | getKeybindingsFilePath | chunks.54.mjs:1627 | function |
| tqA | getDefaultKeybindings | chunks.54.mjs:1631 | function |
| Hv | isKeybindingCustomizationEnabled | chunks.54.mjs:1601 | function |
| kJ1 | DEFAULT_KEYBINDINGS | chunks.54.mjs:1127 | constant |
| yq7 | getValidationWarnings | chunks.54.mjs:1812 | function |
| Dk5 | isErrorLike | chunks.54.mjs:1613 | function |

### File Watching

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Lq7 | watchKeybindingsFile | chunks.54.mjs:1752 | function |
| Pk5 | stopWatchingKeybindings | chunks.54.mjs:1782 | function |
| Nq7 | handleKeybindingsFileChange | chunks.54.mjs:1793 | function |
| Wk5 | handleKeybindingsFileDelete | chunks.54.mjs:1803 | function |
| Rq7 | subscribeToKeybindingsChanges | chunks.54.mjs:1787 | function |
| Jk5 | WATCH_STABILITY_THRESHOLD_MS | chunks.54.mjs:1816 | constant (500) |
| Xk5 | WATCH_POLL_INTERVAL_MS | chunks.54.mjs:1818 | constant (200) |
| L71 | fileWatcher | chunks.54.mjs:1820 | variable |
| fq7 | isWatcherInitialized | chunks.54.mjs:1822 | variable |
| Tq7 | isWatcherCleaned | chunks.54.mjs:1824 | variable |

### State & Caching

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ZM | cachedBindings | chunks.54.mjs:1826 | variable |
| GW | cachedWarnings | chunks.54.mjs:1828 | variable |
| KS1 | changeListeners | chunks.54.mjs:1830 | variable |
| Vq7 | lastTelemetryDate | chunks.54.mjs:1832 | variable |
| Cq7 | seenFallbacks | chunks.54.mjs:1881 | variable |

### Validation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| aE5 | isValidKeybindingBlock | chunks.54.mjs:1386 | function |
| sE5 | isValidKeybindingBlockArray | chunks.54.mjs:1392 | function |
| tE5 | isValidContext | chunks.54.mjs:1396 | function |
| eE5 | parseAndValidateKeystroke | chunks.54.mjs:1400 | function |
| Ak5 | validateKeybindingBlock | chunks.54.mjs:1420 | function |
| qk5 | validateKeybindingsArray | chunks.54.mjs:1510 | function |
| Kk5 | detectDuplicateBindings | chunks.54.mjs:1522 | function |
| Yk5 | detectReservedKeyConflicts | chunks.54.mjs:1546 | function |
| aqA | detectMalformedJSON | chunks.54.mjs:1482 | function |
| zk5 | flattenKeybindingsForValidation | chunks.54.mjs:1565 | function |
| sqA | validateKeybindingsComprehensive | chunks.54.mjs:1579 | function |
| Gq7 | VALID_CONTEXTS | chunks.54.mjs:1598 | constant |
| jk5 | isValidKeybindingStructure | chunks.54.mjs:1617 | function |
| Eq7 | isValidKeybindingArray | chunks.54.mjs:1623 | function |

### Reserved Shortcuts

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Wq7 | getReservedShortcuts | chunks.54.mjs:1304 | function |
| k71 | normalizeKeystroke | chunks.54.mjs:1311 | function |
| qS1 | RESERVED_UNIX_SHORTCUTS | chunks.54.mjs:1335 | constant |
| rqA | RESERVED_UNIX_COMMON | chunks.54.mjs:1347 | constant |
| oqA | RESERVED_MACOS_SHORTCUTS | chunks.54.mjs:1355 | constant |

### Keystroke Parsing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| iC1 | parseKeystroke | chunks.53.mjs:2752 | function |
| rN5 | parseChordString | chunks.53.mjs:2810 | function |
| oN5 | stringifyKeystroke | chunks.53.mjs:2815 | function |
| aN5 | getDisplayKeyName | chunks.53.mjs:2825 | function |
| aK6 | flattenKeybindings | chunks.53.mjs:2864 | function |
| oK6 | stringifyChord | chunks.53.mjs:2860 | function |
| v77 | getKeyNameFromEvent | chunks.53.mjs:2875 | function |

### Matching & Resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| sK6 | findKeybindingForAction | chunks.53.mjs:2893 | function |
| sN5 | eventToKeystroke | chunks.53.mjs:2901 | function |
| tN5 | isPrefixMatch | chunks.53.mjs:2914 | function |
| eN5 | isExactMatch | chunks.53.mjs:2928 | function |
| tK6 | resolveKeystroke | chunks.53.mjs:2942 | function |
| C6Y | CHORD_TIMEOUT_MS | chunks.110.mjs:1045 | constant (1000) |

### React Context & UI

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| dX | KeybindingSetup | chunks.110.mjs:931 | component |
| x6Y | KeybindingHandler | chunks.110.mjs:988 | component |
| A36 | KeybindingContext | chunks.53.mjs:2983 | component |
| k77 | KeybindingContextObject | chunks.53.mjs:3081 | constant |
| S6Y | logKeybindingWarnings | chunks.110.mjs:890 | function |
| VL | useKeybindingContext | chunks.53.mjs:3058 | function |
| q36 | useRegisterContext | chunks.53.mjs:3062 | function |

### Telemetry & Utilities

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| RK | getDisplayTextWithFallback | chunks.54.mjs:1847 | function |
| m0 | getKeybindingForActionSync | chunks.54.mjs:1863 | function |
| vq7 | logCustomKeybindingsLoaded | chunks.54.mjs:1605 | function |
| AT5 | noop | chunks.53.mjs:3056 | function |

---

## Module: Remote Sessions

> Full analysis: [33_remote_sessions/](../33_remote_sessions/)
> **NEW in 2.1.27** - SSH/Remote agent execution support

### Remote Logic

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| JM6 | sendEventToRemoteSession | chunks.126.mjs:712 | function |
| omA | hydrateSessionState | chunks.126.mjs:845 | function |
| qmA | updateSessionTitle | chunks.126.mjs:912 | function |

---

## Module: Fast Mode

> Full analysis: [34_fast_mode/](../34_fast_mode/)
> **NEW in 2.1.36** - Optimized low-latency model toggle

### Fast Mode Logic

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| fast_mode_state | fast_mode_state | chunks.179.mjs | variable |
| $S | FAST_MODEL_NAME | chunks.153.mjs:1591 | constant |
| i4 | isFastModeAvailable | chunks.153.mjs:1585 | function |

---

## Module: Plan Mode

> Full analysis: [12_plan_mode/](../12_plan_mode/)

### Plan Logic

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| a2 | applyPermissionAction | chunks.140.mjs:1695 | function |
| A2z | buildPlanModeSparseReminder | chunks.173.mjs:676 | function |
| aL6 | hasExitedPlanModeGetter | chunks.1.mjs:2859 | function |
| Au4 | buildPermissionCliArgs | chunks.131.mjs:847 | function |
| azz | buildPlanModeReminder | chunks.173.mjs:531 | function |
| Dc4 | getPlanExploreAgentCount | chunks.140.mjs:1467 | function |
| Dz | isTeammate | chunks.139.mjs:2690 | function |
| EhA | getPromptSuggestionBlocker | chunks.151.mjs:149 | function |
| ey | onModeTransition | chunks.1.mjs:2875 | function |
| ezz | buildPlanModeInterviewReminder | chunks.173.mjs:619 | function |
| FGq | getNextModeWithContext | chunks.183.mjs:1799 | function |
| g5 | getAgentName | chunks.139.mjs:2695 | function |
| Gc4 | renderEnterPlanModeResult | chunks.140.mjs:1597 | function (React) |
| hf1 | getNextMode | chunks.183.mjs:1778 | function |
| hu4 | initializeInProcessTeammate | chunks.131.mjs:2305 | function |
| HX6 | RejectedPlanViewer | chunks.107.mjs:1153 | function (React) |
| ihY | generatePlanModeAttachments | chunks.142.mjs:2034 | function (async) |
| ii4 | PLAN_MODE_REMINDER_CONSTANTS | chunks.142.mjs:2921 | constant (object) |
| Kd4 | renderExitPlanModeResult | chunks.139.mjs:2491 | function (React) |
| kg1 | EnterPlanModeTool | chunks.140.mjs:1640 | tool object |
| kx | setNeedsPlanModeExitAttachment | chunks.1.mjs:2871 | function |
| MC1 | isPlanModeRequired | chunks.48.mjs:301 | function |
| nhY | generatePlanModeExitAttachment | chunks.142.mjs:2060 | function (async) |
| Nj | ExitPlanModeTool | chunks.139.mjs:2641 | tool object |
| OT | setHasExitedPlanMode | chunks.1.mjs:2863 | function |
| pD | getPlanContent | chunks.146.mjs:2700 | function |
| pCY | buildEnterPlanModePrompt | chunks.140.mjs:1488 | function |
| q2z | buildPlanModeSubagentReminder | chunks.173.mjs:685 | function |
| sL6 | needsPlanModeExitAttachmentGetter | chunks.1.mjs:2867 | function |
| sO | isPlanModeInterviewPhase | chunks.140.mjs:1475 | function |
| szz | buildFullPlanModeReminder | chunks.173.mjs:531 | function |
| tzz | buildAllowedToolsList | chunks.173.mjs:611 | function |
| uW | getPlanFilePath | chunks.146.mjs:2702 | function |
| vg1 | pushToRemote | chunks.139.mjs:2720 | function |
| vP1 | generateRequestId | chunks.139.mjs:2710 | function |
| Xc4 | getPlanDesignAgentCount | chunks.140.mjs:1455 | function |
| xm | isPlanModeEnabled | chunks.130.mjs:412 | function |
| Yd4 | renderExitPlanModeRejected | chunks.139.mjs:2550 | function (React) |
| Zc4 | renderEnterPlanModeRejected | chunks.140.mjs:1612 | function (React) |
| aPq | ExitPlanModeDialog | chunks.181.mjs:405 | function (React) |

### Plan Mode — AskUserQuestion Tool

> Full analysis: [12_plan_mode/ask_user_question.md](../12_plan_mode/ask_user_question.md)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| dW1 | AskUserQuestionTool | chunks.139.mjs:2903 | tool object |
| TH | TOOL_NAME_AskUserQuestion | chunks.89.mjs:566 | constant ("AskUserQuestion") |
| Qp7 | AskUserQuestion_shortDescription | chunks.89.mjs:570 | constant (string) |
| gp7 | AskUserQuestion_fullPrompt | chunks.89.mjs:572 | constant (string) |
| Fp7 | AskUserQuestion_maxHeaderLength | chunks.89.mjs | constant (= 12) |
| zCY | optionSchema | chunks.139.mjs:2875 | schema (label, description) |
| Xd4 | questionSchema | chunks.139.mjs:2878 | schema (question, header, options, multiSelect) |
| wCY | askUserQuestionInputSchema | chunks.139.mjs:2883 | schema (questions, answers, metadata) |
| HCY | askUserQuestionOutputSchema | chunks.139.mjs:2902 | schema (questions, answers) |
| $CY | AnswerDisplayCard | chunks.139.mjs:2825 | function (React) |
| OCY | renderAnswerLine | chunks.139.mjs:2840 | function (React) |
| ep4 | exitPlanModeToolPrompt | chunks.139.mjs:2458 | constant (string - ExitPlanMode instructions with AskUserQuestion guidance) |
| $Wq | QuestionForm | chunks.181.mjs:1920 | function (React - outer permission dialog, plan mode detection) |
| YWq | SingleQuestionComponent | chunks.181.mjs:1503 | function (React - one question with extra options) |
| wWq | ReviewAnswersScreen | chunks.181.mjs:1800 | function (React - summary before submit) |
| Sv6 | QuestionProgressTabs | chunks.181.mjs:1367 | function (React - horizontal tab bar) |
| WDz | transformOptionToUIFormat | chunks.181.mjs:1769 | function ({type:"text", value, label, description}) |
| PDz | isNotOtherOption | chunks.181.mjs:1765 | function (value !== "__other__") |
| VDz | selectToolPermissionContextMode | chunks.181.mjs:2164 | function (state→mode selector for $Wq) |
| GDz | selectToolPermissionContextMode | chunks.181.mjs:1778 | function (state→mode selector for YWq) |
| HgA | collectPastedImages | chunks.181.mjs:2176 | function (async - converts pasted images to API blocks) |
| KWq | initQuestionNavState | chunks.181.mjs:1357 | lazy initializer (question navigation state) |
| qWq | useQuestionNavigation | chunks.181.mjs:1368 | function (hook - question nav state machine) |
| XDz | initialQuestionNavState | chunks.181.mjs:1359 | constant (initial nav state object) |
| RV6 | setupElicitationRequestHandler | chunks.156.mjs:1540 | function (MCP elicitation handler) |
| UCY | standardPlanModeWorkflowText | chunks.140.mjs:1576 | constant (string - "What Happens in Plan Mode" section, omitted in interview mode) |
| Mc4 | initStandardPlanModeWorkflowText | chunks.140.mjs:1574 | lazy initializer (for UCY) |

### Plan Mode — Clear Context & Session Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| DL6 | createNewSessionId | chunks.1.mjs:2429 | function |
| dU7 | clearPlanFileSlug | chunks.88.mjs:98 | function |
| FiY | clearCommandHandler | chunks.152.mjs:1481 | function |
| GIA | clearConversation | chunks.152.mjs:1438 | function (async) |
| mcA | getContextUsagePercentage | chunks.1.mjs:2291 | function |
| n0A | registerPlanFileSlug | chunks.88.mjs:94 | function |
| PIA | clearSessionCaches | chunks.152.mjs:1421 | function |
| QiY | clearCommandDefinition | chunks.152.mjs:1498 | constant (object) |
| Rj1 | getPlanFileSlug | chunks.88.mjs:78 | function |

### Plan Mode Display (Mode Cycle)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| CQ | getModeDisplayName | chunks.14.mjs:3260 | function |
| cP | getModeThemeColor | chunks.14.mjs:3298 | function |
| Lw8 | isDefaultMode | chunks.14.mjs:3277 | function |
| Rv1 | getModeIcon | chunks.14.mjs:3281 | function |

### Plan Mode State Flags (Global)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| o6 | globalSessionState | chunks.1.mjs:2400 | object |
| hasExitedPlanMode | hasExitedPlanMode | chunks.1.mjs:2403 | state key (bool) |
| needsPlanModeExitAttachment | needsPlanModeExitAttachment | chunks.1.mjs:2404 | state key (bool) |

### Plan Mode Swarm UI

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $d4 | setTaskAwaitingPlanApproval | chunks.139.mjs:2587 | function |
| $fY | PlanApprovalRequestMessage | chunks.129.mjs:1756 | function (React) |
| Hd4 | findTaskByAgentName | chunks.139.mjs:2581 | function |
| kM6 | renderTeamMessageContent | chunks.129.mjs:1869 | function |
| OfY | PlanApprovalResponseMessage | chunks.129.mjs:1799 | function (React) |
| _fY | getTeamMessageSummary | chunks.129.mjs:1882 | function |

---

## Module: Compact

> Full analysis: [07_compact/](../07_compact/)

### Compaction Logic

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| fs4 | autoCompactDispatcher | chunks.147.mjs:778 | function |
| amY | shouldAutoCompact | chunks.147.mjs:765 | function |
| Ac | getCompactionStatus | chunks.147.mjs:736 | function |
| SQ1 | getAutoCompactThreshold | chunks.147.mjs:722 | function |
| m51 | getEffectiveContextWindow | chunks.147.mjs:717 | function |
| xm | isAutoCompactEnabled | chunks.147.mjs:759 | function |
| ga4 | generateConversationSummary | chunks.146.mjs:2566 | function |
| vZ6 | performSessionMemoryCompaction | chunks.147.mjs:651 | function |
| Fa4 | performPartialCompaction | chunks.146.mjs:2437 | function |
| imY | createCompactionSummaryMessage | chunks.147.mjs:620 | function |
| Ts4 | generateToolUseSummary | chunks.147.mjs:832 | function |
| Ua4 | collectFilesToKeep | chunks.146.mjs:2665 | function |
| ca4 | collectTasksToKeep | chunks.146.mjs:2724 | function |
| jZ6 | collectPlanToKeep | chunks.146.mjs:2699 | function |
| da4 | collectSkillsToKeep | chunks.146.mjs:2710 | function |
| pa4 | collectTodosToKeep | chunks.146.mjs:2688 | function |
| PU1 | calculateMessageTokens | chunks.147.mjs:296 | function |
| nmY | MAX_COMPACT_BUFFER | chunks.147.mjs:805 | constant (20000) |
| cCA | AUTO_COMPACT_BUFFER_OFFSET | chunks.147.mjs:807 | constant (13000) |
| rmY | TOKEN_WARNING_THRESHOLD | chunks.147.mjs:809 | constant (20000) |
| omY | TOKEN_ERROR_THRESHOLD | chunks.147.mjs:811 | constant (20000) |
| lCA | BLOCKING_LIMIT_OFFSET | chunks.147.mjs:813 | constant (3000) |

### Model Context Utilities

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| iCA | getMaxOutputTokens | chunks.169.mjs:1496 | function |
| yG | getMaxContextTokens | chunks.1.mjs:2286 | function |
| nz1 | getDefaultMaxOutputTokens | chunks.1.mjs:2305 | function |
| FP | getCurrentProvider | chunks.1.mjs:2597 | function |
| Obq | DEFAULT_MAX_CONTEXT | chunks.1.mjs:2323 | constant (200000) |
| JL6 | DEFAULT_MAX_OUTPUT | chunks.1.mjs:2325 | constant (20000) |

### Standard Compaction (Full Lifecycle)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| AW1 | performFullCompaction | chunks.146.mjs:2325 | function |
| Ev | countTokens | chunks.75.mjs:2288 | function |
| Ia4 | getLastUserMessage | chunks.146.mjs:2147 | function |
| xa4 | extractMetadataFromMessage | chunks.146.mjs:2248 | function |
| DZ6 | grantPermission | chunks.146.mjs:2115 | function |
| VOA | formatCustomInstructions | chunks.76.mjs:198 | function |
| B51 | extractTextFromMessage | chunks.173.mjs:370 | function |
| rd | resetCodeIndexing | chunks.142.mjs:2377 | function |
| PZ | countTokens | chunks.75.mjs:2236 | function |
| Yp | extractUsageFromMessage | chunks.75.mjs:2227 | function |
| JU1 | createBoundaryMarker | chunks.173.mjs:1215 | function |
| a$ | generateSessionId | chunks.173.mjs:1658 | function |
| ux1 | formatSummaryContent | chunks.76.mjs:323 | function |
| fOA | recordQuerySource | chunks.76.mjs:72 | function |
| Qa4 | handleCompactionError | chunks.146.mjs:2546 | function |
| av | callLLMWithCache | chunks.149.mjs:2634 | function |
| vmY | canUseSummarizeTool | chunks.146.mjs:2555 | function |
| GN | getLastAssistantMessage | chunks.172.mjs:2785 | function |
| XU1 | shouldAgentUseTools | chunks.174.mjs:2473 | function |
| Sx | deduplicateTools | chunks.2.mjs:1164 | function |
| UW1 | createMainLLMLoop | chunks.169.mjs:691 | function (generator) |
| WJ | normalizeMessages | chunks.173.mjs:89 | function |
| TmY | deduplicateMessages | chunks.146.mjs:2283 | function |
| EN | getVisibleMessagesAfterCompact | chunks.173.mjs:1286 | function |
| _U1 | ERROR_MESSAGES.EMPTY_MESSAGES | chunks.146.mjs:2768 | constant |
| QO | API_ERROR_PREFIX | chunks.72.mjs:1824 | constant ("API Error") |
| dU | PROMPT_TOO_LONG_PREFIX | chunks.72.mjs:1826 | constant ("Prompt is too long") |
| ma4 | ERROR_MESSAGES.PROMPT_TOO_LONG | chunks.146.mjs:2770 | constant |
| Ba4 | MAX_FILES_TO_KEEP | chunks.146.mjs:2760 | constant (5) |
| NmY | MAX_COMPACT_RETRIES | chunks.146.mjs:2766 | constant (2) |
| JL6 | MAX_SUMMARY_OUTPUT_TOKENS | chunks.1.mjs:2325 | constant (20000) |
| i5 | SUMMARIZE_TOOL | chunks.146.mjs:1754 | constant (FileReadTool object) |
| IW6 | THINKING_SIMPLE_TOOL | chunks.140.mjs:1355 | constant (object) |

### Message Selection & Boundary Logic

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| lmY | selectHistoricalWindow | chunks.147.mjs:590 | function |
| pCA | adjustBoundariesForTools | chunks.147.mjs:553 | function |
| dmY | extractToolResultIds | chunks.147.mjs:536 | function |
| cmY | hasToolUseWithId | chunks.147.mjs:546 | function |
| Zs4 | isTextBlockMessage | chunks.147.mjs:526 | function |
| UmY | getSmCompactConfig | chunks.147.mjs:508 | function |
| pmY | loadSmCompactConfig | chunks.147.mjs:514 | function |
| gmY | setSmCompactConfig | chunks.147.mjs:501 | function |
| Gs4 | configLoaded | chunks.147.mjs:689 | variable |

### Configuration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TZ6 | isSessionMemoryCompactEnabled | chunks.147.mjs:612 | function |
| gmY | setSmCompactConfig | chunks.147.mjs:501 | function |
| WZ6 | SECTION_TOKEN_LIMIT | chunks.147.mjs:174 | constant (2000) |
| Hs4 | TOTAL_SESSION_NOTES_LIMIT | chunks.147.mjs:176 | constant (12000) |
| RmY | SESSION_NOTES_TEMPLATE | chunks.147.mjs:178 | constant (string) |
| NZ6 | SM_COMPACT_CONFIG_DEFAULTS | chunks.147.mjs:708 | constant ({ minTokens: 10000, minTextBlockMessages: 5, maxTokens: 40000 }) |
| dCA | smCompactConfig | chunks.147.mjs:712 | variable |

### State Preservation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| EmY | shouldExcludeFile | chunks.146.mjs:2743 | function |
| kq | createAttachmentMessage | chunks.142.mjs:2615 | function |
| TyA | readFileForAttachment | chunks.142.mjs:2524 | function |
| uW | getPlanFilePath | chunks.88.mjs:120 | function |
| pD | getPlanFileContent | chunks.88.mjs:126 | function |
| UB | getTodoList | chunks.88.mjs:274 | function |
| zR6 | getInvokedSkills | chunks.1.mjs:2972 | function |
| Ba4 | MAX_FILES_TO_KEEP | chunks.146.mjs:2760 | constant (5) |
| fmY | MAX_FILE_RESTORE_TOKENS | chunks.146.mjs:2762 | constant (50000) |
| VmY | MAX_TOKENS_PER_FILE | chunks.146.mjs:2764 | constant (5000) |

### File Read Tracking

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _p7 | LruMapWrapper | chunks.88.mjs:2200 | class |
| ZT | QuickLRU | chunks.88.mjs | class (import) |
| J_6 | normalizePath | chunks.88.mjs | function |
| A91 | buildFileReadState | chunks.150.mjs:2459 | function |
| yj1 | mergeFileReadState | chunks.88.mjs:2267 | function |
| Rp | createLruCache | chunks.88.mjs:2250 | function |
| yp | cloneLruCache | chunks.88.mjs:2262 | function |
| wjA | mapEntriesToObject | chunks.88.mjs:2254 | function |
| Th | getWatchedFilePaths | chunks.88.mjs:2258 | function |
| JK1 | LRU_MAX_ENTRIES | chunks.88.mjs:2276 | constant (100) |
| eT9 | LRU_MAX_SIZE | chunks.88.mjs:2278 | constant (26214400) |
| kcY | BUILD_STATE_DEFAULT_MAX | chunks.150.mjs:2518 | constant (10) |

### Microcompaction

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| gm | performMicrocompaction | chunks.147.mjs:310 | function |
| Ps4 | calculateToolResultTokens | chunks.147.mjs:280 | function |
| QmY | getOrCalculateToolResultTokens | chunks.147.mjs:290 | function |
| uq1 | persistToolResult | chunks.80.mjs:2721 | function |
| Ws4 | createMicrocompactBoundary | chunks.173.mjs:1236 | function |
| QCA | isMicrocompactBoundary | chunks.173.mjs:1255 | function |
| bmY | isPersistedContent | chunks.147.mjs:255 | function |
| Bq1 | isErrorResult | chunks.80.mjs:2813 | function |
| UCA | restoreMicrocompactState | chunks.147.mjs:263 | function |
| Ms4 | resetMicrocompactState | chunks.147.mjs:259 | function |
| NG1 | setMicrocompactInProgress | chunks.147.mjs:221 | function |
| Ds4 | clearMicrocompactInProgress | chunks.147.mjs:225 | function |
| js4 | resetMicrocompactStateAndFlag | chunks.147.mjs:229 | function |
| FD9 | createPreview | chunks.80.mjs:2799 | function |
| BD9 | formatPersistedOutputMessage | chunks.80.mjs:2760 | function |
| umY | MIN_MICROCOMPACT_TOKENS | chunks.147.mjs:464 | constant (20000) |
| BmY | MANUAL_MICROCOMPACT_THRESHOLD | chunks.147.mjs:466 | constant (40000) |
| mmY | KEEP_RECENT_TOOL_RESULTS | chunks.147.mjs:468 | constant (3) |
| gCA | IMAGE_TOKEN_ESTIMATE | chunks.147.mjs:470 | constant (2000) |
| NXA | CLEARED_CONTENT_MESSAGE | chunks.80.mjs:2844 | constant |
| C$6 | PERSISTED_OUTPUT_START | chunks.80.mjs:2840 | constant |
| VXA | PERSISTED_OUTPUT_END | chunks.80.mjs:2842 | constant |
| fXA | TOOL_RESULTS_DIR | chunks.80.mjs:2838 | constant ("tool-results") |
| ex7 | PREVIEW_SIZE | chunks.80.mjs:2846 | constant (2000) |
| FmY | COMPACTABLE_TOOLS | chunks.147.mjs:498 | variable (Set) |
| TG1 | compactedToolIds | chunks.147.mjs:474 | variable (Set) |
| fZ6 | clearedAttachmentUUIDs | chunks.147.mjs:476 | variable (Set) |
| VZ6 | toolResultTokenCache | chunks.147.mjs:478 | variable (Map) |
| MU1 | microcompactInProgress | chunks.147.mjs:247 | variable (boolean) |

---

## Module: Hooks

> Full analysis: [11_hooks/](../11_hooks/)

### Hook Event Dispatchers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| NI | executeHooksIterator | chunks.141.mjs:2226 | generator |
| qyA | executePreToolHooks | chunks.141.mjs:2812 | generator |
| KyA | executePostToolHooks | chunks.141.mjs:2831 | generator |
| YyA | executePostToolUseFailureHooks | chunks.141.mjs:2850 | generator |
| UTA | executeNotificationHooks | chunks.141.mjs:2870 | function |
| zyA | executeStopHooks | chunks.141.mjs:2889 | generator |
| wyA | executeTeammateIdleHooks | chunks.141.mjs:2912 | generator |
| Cg1 | executeTaskCompletedHooks | chunks.141.mjs:2927 | generator |
| HyA | executeUserPromptSubmitHooks | chunks.141.mjs:2946 | generator |
| $yA | executeSessionStartHooks | chunks.141.mjs:2961 | generator |
| OyA | executeSetupHooks | chunks.141.mjs:2979 | generator |
| AEA | executeSubagentStartHooks | chunks.141.mjs:2995 | generator |
| mW6 | executePreCompactHooks | chunks.141.mjs:3011 | function |
| PP | executePluginHooksForSession | chunks.142.mjs:248 | function |
| FW6 | executePluginHooksForSetup | chunks.142.mjs:291 | function |
| pa | loadAllPluginHooks | chunks.87.mjs:2606 | variable (memoized async fn, exported as loadPluginHooks) |
| Ap | allowManagedHooksOnly | chunks.142.mjs:256 | function |
| oN9 | extractPluginHooksForEvent | chunks.87.mjs:2547 | function |
| O61 | registerPluginHooks | chunks.1.mjs:2912 | function |
| YR6 | deregisterPluginHooks | chunks.1.mjs:2929 | function |
| sN9 | setupPluginHookHotReload | chunks.87.mjs:2589 | function |
| aN9 | resetHotReloadState | chunks.87.mjs:2585 | function |
| rO6 | clearPluginHookCache | chunks.87.mjs:2581 | function |
| g0A | hotReloadAlreadySetup | chunks.87.mjs:2596 | variable (bool guard) |

### Hook Resolution & Loading

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| oRA | resolveHooksForEvent | chunks.141.mjs:2140 | function |
| JhY | mergeHookSources | chunks.141.mjs:2104 | function |
| _hY | matchesHookMatcher | chunks.141.mjs:2079 | function |
| Uk7 | getPolicySettingsHooks | chunks.75.mjs:1533 | function |
| DN1 | getRegisteredHooks | chunks.1.mjs:2921 | function |
| Ww6 | getSessionHooks | chunks.75.mjs:1184 | function |
| Ik7 | getSessionFunctionHooks | chunks.75.mjs:1200 | function |
| xk7 | findHookCallbackForEvent | chunks.75.mjs:1228 | function |

### Hook Executors

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| BW6 | executeCommandHook | chunks.141.mjs:1924 | function |
| Xi4 | executeAgentHook | chunks.141.mjs:1561 | function |
| Pn7 | executePromptHook | chunks.90.mjs:2050 | function |
| DhY | executeCallbackHook | chunks.142.mjs:154 | function |
| XhY | executeFunctionHook | chunks.142.mjs:96 | function |
| AyA | executeHooksOutsideREPL | chunks.141.mjs:2691 | function |

### Hook Output Processing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Wi4 | parseHookOutput | chunks.141.mjs:1780 | function |
| Gi4 | processHookJsonOutput | chunks.141.mjs:1810 | function |
| SK1 | isAsyncHookResponse | chunks.90.mjs:1624 | function |
| zn7 | isSyncHookResponse | chunks.90.mjs:1620 | function |
| aRA | buildPreToolUseBlockingMessage | chunks.141.mjs:2202 | function |
| sRA | buildStopHookFeedbackMessage | chunks.141.mjs:2206 | function |
| tRA | buildTeammateIdleFeedbackMessage | chunks.141.mjs:2211 | function |
| yg1 | buildTaskCompletedFeedbackMessage | chunks.141.mjs:2216 | function |
| eRA | buildUserPromptSubmitBlockingMessage | chunks.141.mjs:2221 | function |

### Async Hook Background Registry

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| $n7 | registerAsyncHook | chunks.90.mjs:1793 | function |
| On7 | appendAsyncHookStdout | chunks.90.mjs:1840 | function |
| _n7 | appendAsyncHookStderr | chunks.90.mjs:1846 | function |
| cMA | finalizeAsyncHook | chunks.90.mjs:1852 | function |
| Jn7 | checkAsyncHookResponses | chunks.90.mjs:1865 | function |
| Xn7 | removeDeliveredAsyncHooks | chunks.90.mjs:1916 | function |
| lMA | cleanupAllAsyncHooks | chunks.90.mjs:1923 | function |
| VR | asyncHookRegistry | chunks.90.mjs:1934 | variable (Map) |
| ji4 | backgroundHookProcess | chunks.141.mjs:1739 | function |

### Hook Telemetry & Streaming

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| qn7 | startHookOtelSpan | chunks.90.mjs:1512 | function |
| Kn7 | finalizeHookOtelSpan | chunks.90.mjs:1534 | function |
| Hn7 | notifyHookStart | chunks.90.mjs:1728 | function |
| Ch | logHookCompletion | chunks.90.mjs:1770 | function |
| HJ6 | hookProgressPoller | chunks.90.mjs:1747 | function |
| xL9 | emitHookProgress | chunks.90.mjs:1738 | function |
| dMA | dispatchHookEvent | chunks.90.mjs:1719 | function |
| wn7 | setHookEventHandler | chunks.90.mjs:1714 | function |
| wJ6 | isRemoteStreamingEvent | chunks.90.mjs:1724 | function |
| IL9 | REMOTE_STREAMING_HOOK_EVENTS | chunks.90.mjs:1790 | constant (["SessionStart","Setup"]) |
| Mi4 | buildHookDefinitionsList | chunks.142.mjs:189 | function |
| Zi4 | buildPluginHookCounts | chunks.141.mjs:2092 | function |

### Hook Utilities

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| aX | buildBasePayload | chunks.141.mjs:1770 | function |
| XJ6 | interpolateHookPrompt | chunks.90.mjs:2001 | function |
| fR | combineAbortSignals | chunks.90.mjs:1691 | function |
| jn7 | getStructuredOutputTool | chunks.90.mjs:2005 | function |
| DJ6 | registerAgentInState | chunks.90.mjs:2030 | function |
| iD1 | unregisterAgentFromState | chunks.75.mjs:1240 | function |
| MZ | getHookDisplayName | chunks.75.mjs:1272 | function |
| _J6 | mergeAsyncGenerators | chunks.90.mjs:1950 | generator |
| Pi4 | isWorkspaceTrustRequired | chunks.141.mjs:1765 | function |

### Hook Schemas & Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| tGY | HOOK_EVENT_NAMES | chunks.129.mjs:717 | constant (15-item Array) |
| MP | DEFAULT_HOOK_TIMEOUT | chunks.142.mjs:215 | constant (600000ms = 10 min) |
| Bj1 | HOOK_BLOCKED_TOOLS | chunks.89.mjs:876 | constant (Set) |
| zJ6 | HookOutputSchema | chunks.129.mjs:834 (LZY) | schema |
| GB1 | StructuredOutputSchema | chunks.90.mjs:2044 | schema |
| gZ | HookBasePayloadSchema | chunks.129.mjs:717 | schema |
| eGY | PreToolUsePayloadSchema | chunks.129.mjs:722 | schema |
| qZY | PostToolUsePayloadSchema | chunks.129.mjs:732 | schema |
| KZY | PostToolUseFailurePayloadSchema | chunks.129.mjs:738 | schema |
| WZY | AsyncHookResponseSchema | chunks.129.mjs:792 | schema |
| cow | AllHookInputUnionSchema | chunks.129.mjs:792 | schema |
| registeredHooks | registeredHooks | chunks.1.mjs:2409 | state key |

---

## Module: Skill System

> Full analysis: [10_skill_system/](../10_skill_system/)

### Skill Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ukA | loadSkills | chunks.134.mjs:2059 | function |
| oQ1 | loadSkillFromDir | chunks.134.mjs:1758 | function |
| EW1 | activateConditionalSkills | chunks.134.mjs:1996 | function |
| vW1 | discoverProjectSkills | chunks.134.mjs:1964 | function |
| iF4 | getLoadedSkills | chunks.134.mjs:1992 | function |
| bkA | isSkillFile | chunks.134.mjs:1823 | function |
| fEY | deduplicateSkillFiles | chunks.134.mjs:1827 | function |
| VEY | getSkillName_fromSkillMd | chunks.134.mjs:1853 | function |
| NEY | getSkillName_fromMdFile | chunks.134.mjs:1861 | function |
| cF4 | getRelativePath | chunks.134.mjs:1846 | function |
| TEY | deriveCommandName | chunks.134.mjs:1869 | function |
| TW1 | findSkillDirectories | chunks.134.mjs:1945 | function |
| vEY | loadLegacyCommands | chunks.134.mjs:1873 | function |
| ZEY | parsePathPatterns | chunks.134.mjs:1673 | function |
| GEY | getInodeId | chunks.134.mjs:1651 | function |
| BP6 | clearSkillsCache | chunks.134.mjs:1937 | function |
| lF4 | registerSkillChangeListener | chunks.134.mjs:1941 | function |
| gF4 | checkedSkillsDirs | chunks.134.mjs:2031 | Set |
| Pt | activeSkillsMap | chunks.134.mjs:2033 | Map |
| aQ1 | conditionalSkillsMap | chunks.134.mjs:2035 | Map |
| BkA | activatedSkillsSet | chunks.134.mjs:2037 | Set |
| mkA | skillChangeListeners | chunks.134.mjs:2039 | Array |
| dF4 | createSkillObject | chunks.134.mjs:1682 | function |
| pF4 | parseSkillHooks | chunks.134.mjs:1663 | function |
| bP6 | parseBoolean | chunks.134.mjs:1659 | function |

### Skill Execution Helpers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ej1 | interpolateArguments | chunks.87.mjs:1735 | function |
| Ma | processTemplateExpressions | chunks.81.mjs:601 | function (executes !`cmd` and ```!\ncmd\n``` patterns in skill text) |
| q09 | TEMPLATE_CODE_BLOCK_REGEX | chunks.81.mjs:659 | constant (/```!\s*\n?...\n?```/g) |
| K09 | TEMPLATE_INLINE_REGEX | chunks.81.mjs:659 | constant (/(?<!\w|\$)!`([^`]+)`/g) |
| Jb7 | formatShellOutput | chunks.81.mjs:625 | function |
| mM6 | setupForkedCommandContext | chunks.149.mjs:2562 | function |
| FM6 | extractForkedCommandResult | chunks.149.mjs:2582 | function |

### Plugin Skill Loading

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| B0A | loadPluginSkills | chunks.87.mjs:2157 | function (memoized, loads skills from all plugins) |
| vU7 | loadPluginSkillDir | chunks.87.mjs (referenced) | function (loads skills from one plugin skillsPath) |
| uu1 | buildCommandFromFrontmatter | chunks.87.mjs (referenced) | function (plugin-aware variant of skill construction) |

### Bundled Skill Registry

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Sj | registerPromptSkill | chunks.166.mjs:1795 | function |
| nHq | getBundledSkills | chunks.166.mjs:1822 | function |
| iHq | bundledSkillRegistry | chunks.166.mjs:1826 | Array |
| nI | initSkillRegistry | chunks.166.mjs:1828 | function |

### Builtin Prompt Command Factory (`bZ1`)

> Deep analysis: [09_slash_command/review.md](../09_slash_command/review.md)
> Used by `/review`, `/pr-comments`, `/security-review` — "marketplace placeholder" pattern

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bZ1 | builtinPromptCommandFactory | chunks.160.mjs:1289 | function |
| NN6 | reviewCommandDefinition | chunks.161.mjs:2580 | object |
| HuA | registerReviewCommand | chunks.161.mjs:2577 | function |
| m5q | prCommentsCommandDefinition | chunks.160.mjs:1319 | object |
| F5q | registerPrCommentsCommand | chunks.160.mjs:1317 | function |
| wzq | securityReviewCommandDefinition | chunks.162.mjs:1819 | object |
| Hzq | registerSecurityReviewCommand | chunks.162.mjs:1814 | function |
| y7z | SECURITY_REVIEW_SKILL_TEXT | chunks.162.mjs:1620 | constant |

### Built-in Skills/Plugins

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| E7z | TasksCommand | chunks.162.mjs:418749 | object |
| R7z | TodosCommand | chunks.162.mjs:418817 | object |
| b7z | VimModeCommand | chunks.162.mjs:419181 | object |
| I7z | ThemeCommand | chunks.162.mjs:419142 | object |
| PuA | UsageCommand | chunks.162.mjs:419075 | object |

### Built-in Prompt Skills (Registration & Prompts)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| __z | VERIFIER_SYSTEM_PROMPT | chunks.177.mjs:1933-2176 | constant |
| Ejq | initVerifiersModuleInit | chunks.177.mjs:2178-2180 | function |
| Njq | registerVerifySkill | chunks.177.mjs:1921-1923 | function (stub) |
| Tjq | verifySkillModuleInit | chunks.177.mjs:1925-1927 | function |
| vjq | registerInitVerifiersSkill | chunks.177.mjs:1929-1931 | function (stub) |
| xjq | registerAllBuiltinSkills | chunks.177.mjs:2441-2443 | function |
| bjq | builtinSkillsLazyInit | chunks.177.mjs:2445-2456 | function |
| Xjq | registerRememberSkill | chunks.177.mjs:1142-1144 | function (stub) |
| QOz | REMEMBER_SKILL_PROMPT | chunks.177.mjs:1146-1259 | constant |
| Pjq | registerSettingsHelpSkill | chunks.177.mjs:1314-1316 | function (stub) |
| dOz | SETTINGS_HELP_PROMPT | chunks.177.mjs:1318-1563 | constant |
| fjq | registerKeybindingsSkill | chunks.177.mjs:1809-1838 | function |
| kjq | registerDebugSkill | chunks.177.mjs:2188-2249 | function |
| Cjq | registerBenchmarkSkill | chunks.177.mjs:2279-2281 | function (stub) |
| hjq | registerSkillifySkill | chunks.177.mjs:2299-2301 | function (stub) |
| j_z | SKILLIFY_PROMPT | chunks.177.mjs:2303-2434 | constant |
| jjq | registerChromeSkill | chunks.177.mjs:1269-1290 | function |

---

## Module: Thinking Mode

> Full analysis: [19_think_level/](../19_think_level/)

---

## Module: Steering

> Full analysis: [21_steering/](../21_steering/)
> Real-time course correction via interrupt signals

### Core Steering Logic

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| N11 | onCancel | chunks.188.mjs:328-340 | function |
| Aq | createAbortController | chunks.6.mjs:449-451 | function |
| O3 | abortController | chunks.188.mjs:99 | state variable |
| HY | setAbortController | chunks.188.mjs:99 | state setter |
| O7 | streamMode | chunks.188.mjs:87 | state variable ("requesting"\|"thinking"\|"responding"\|"tool-input"\|"tool-use") |
| tK | setStreamMode | chunks.188.mjs:87 | state setter |
| XhA | createUserInterruptMessage | chunks.149.mjs | function |
| FG1 | createCleanupMessage | chunks.149.mjs | function |
| i4K | setupAbortTimeout | chunks.6.mjs | function |
| n4K | DEFAULT_TIMEOUT | chunks.6.mjs | constant |
| YK | resetLoadingState | chunks.188.mjs:218-221 | function |

### UI Layer - Cancel Handler Component

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ngA | cancelHandlerComponent | chunks.185.mjs:2137-2172 | function (React component) |
| Z | handleCancelPress | chunks.185.mjs:2152-2167 | function (closure inside ngA) |

### Prompt Queue System

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| lB | enqueueCommand | chunks.89.mjs:415-422 | function |
| KY | isPromptQueueingEnabled | chunks.89.mjs:879 | function (always returns false) |
| Kd7 | cancelRunningAgentTasks | chunks.89.mjs:1388-1393 | function (dead code via KY) |
| GjA | clearLegacyQueue | chunks.89.mjs:407-409 | function |
| WR | enqueueToLegacyQueue | chunks.89.mjs:417-419 | function |
| up7 | dequeueFromLegacyArray | chunks.89.mjs:401-406 | function |
| G_6 | notifyQueueSubscribers | chunks.89.mjs:384-387 | function |
| Sp7 | subscribeToQueueChanges | chunks.89.mjs:374-378 | function |
| hp7 | getQueueRevision | chunks.89.mjs:380-382 | function |
| Ip7 | isLegacyQueueNonEmpty | chunks.89.mjs:389-391 | function |
| xp7 | getLegacyQueueLength | chunks.89.mjs:393-395 | function |
| bp7 | notifyLegacyQueueProgress | chunks.89.mjs:397-399 | function |
| xj1 | legacyQueueArray | chunks.89.mjs:503 | variable (array) |
| Cp7 | queueRevisionCounter | chunks.89.mjs:506 | variable (number) |
| W_6 | legacyQueueSubscribers | chunks.89.mjs:507 | variable (Set) |
| AB1 | logQueueEvent | chunks.89.mjs | function (telemetry) |
| Z_6 | dequeueNextCommand | chunks.89.mjs:422-437 | function |
| V_6 | popAndMergeQueuedCommands | chunks.89.mjs:473-500 | function |

### Queue Processor Hook

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| HVq | useQueuedCommandProcessor | chunks.186.mjs:87-135 | function (React hook) |
| zVq | processNextQueuedCommand | chunks.186.mjs:63-84 | function |
| iA | executeQueuedInput | chunks.188.mjs:894-926 | function (useCallback) |
| rc | popCommandFromQueue | chunks.188.mjs:343-355 | function (useCallback) |
| wD | lastQueryCompletionTime | chunks.188.mjs | state variable |
| LP | setLastQueryCompletionTime | chunks.188.mjs | state setter |

### Stream Event Processing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| iW1 | processStreamEvent | chunks.173.mjs:390-450 | function |

### Remote Steering

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| cancelSession | cancelSession | chunks.176.mjs:3060-3063 | method (RemoteSessionManager) |

### Help Text & Tips

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| enter-to-steer-in-relatime | STEERING_HELP_TIP_ID | chunks.176.mjs:1341 | constant (help tip; NOTE: typo "relatime" not "realtime" in source) |
| prompt-queue | PROMPT_QUEUE_HELP_TIP_ID | chunks.176.mjs:1333 | constant (help tip) |

---

## Module: System Reminder

> Full analysis: [04_system_reminder/](../04_system_reminder/)

### UI Visibility & Filtering

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| qYq | shouldShowMessageInChat | chunks.173.mjs:1292 | function |
| EN | getVisibleMessagesAfterCompact | chunks.173.mjs:1286 | function |
| Y2z | findLastCompactBoundary | chunks.173.mjs:1278 | function |
| cR | isCompactBoundary | chunks.173.mjs:1274 | function |
| f8z | isNotProgress | chunks.161.mjs:571 | function |

### Attachment Injection Pipeline

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| oP1 | attachmentMessageGenerator | chunks.142.mjs:2494 | function (async generator) |
| kq | convertAttachmentToMessage | chunks.142.mjs:2615 | function |
| dzz | reorderAttachments | chunks.172.mjs:3244 | function |
| bG1 | buildContextMessages | chunks.148.mjs:2414 | function |

### Message Normalization

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| WJ | normalizeMessages | chunks.173.mjs:89 | function |
| hMA | extractSystemReminderContent | chunks.90.mjs:517 | function |
| EL9 | SYSTEM_REMINDER_REGEX | chunks.90.mjs:730 | constant (regex) |

### API Preparation (isMeta Stripping)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| m9z | formatMessagesForAPI | chunks.169.mjs:1385 | function |
| b9z | formatUserMessageForAPI | chunks.169.mjs:618 | function |
| u9z | formatAssistantMessageForAPI | chunks.169.mjs:645 | function |

### Message Classification Helpers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| V2z | isValidUserMessage | chunks.173.mjs:2164 | function |
| GN6 | getFirstMeaningfulUserMessage | chunks.173.mjs:2054 | function |

---

## Module: CLI

> Full analysis: [01_cli/](../01_cli/)

### Entry Points & Commands

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| nGz | mainEntry | chunks.189.mjs:931 | function |
| aGz | commanderSetup | chunks.190.mjs:999 | function |
| qZz | cliEntry | chunks.190.mjs:167 | function |
| iGz | determineEntrypoint | chunks.189.mjs:916 | function |
| gRq | showSetupScreens | chunks.189.mjs:758 | function |
| PGz | pluginValidateCommand | chunks.189.mjs:3 | function |
| VGz | installCommandRender | chunks.189.mjs:80 | function |
| yGz | updateCheckCommand | chunks.189.mjs:371 | function |
| vGz | setupTokenCommand | chunks.189.mjs:267 | function |
| LGz | doctorCommand | chunks.189.mjs:313 | function |
| RGz | installCommandAction | chunks.189.mjs:328 | function |
| tGz | cleanupOnExit | chunks.189.mjs:2144 | function |
| LUA | noopCliOptionsPostProcess | chunks.189.mjs:2142 | function |

### Rendering Primitives

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| mGz | renderWithCallback | chunks.189.mjs:741 | function |
| LF | renderFullscreenComponent | chunks.189.mjs:748 | function |
| $l1 | renderAndWait | chunks.189.mjs:754 | function |
| rGz | createRenderOptions | chunks.189.mjs:958 | function |
| oGz | streamJsonInputHandler | chunks.189.mjs:984 | function (routes stdin → stream based on input format) |
| _QA | FpsMetricsTracker | chunks.176.mjs:1020 | class |
| js | resolveInkOptions | chunks.110.mjs:874 | function |
| RUA | flushRenderQueue | chunks.189.mjs:864 | function |

### State Store Architecture

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Gf6 | createStateStore | chunks.151.mjs:398 | function |
| u_ | AppStateProvider | chunks.151.mjs:522 | function (Component) |
| Pf1 | AppStateRoot | chunks.176.mjs:643 | function (Component) |
| K11 | onChangeAppStateHandler | chunks.176.mjs:581 | function |
| BDq | FpsMetricsWrapper | chunks.176.mjs:657 | function (Component) |

### UI & Interaction

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TUA | REPL | chunks.188.mjs:3 | function (Component) |
| J0 | getToolUseContext | chunks.188.mjs:426 | function |
| oc | handleQuery | chunks.188.mjs:550 | function |
| ff | onQuery | chunks.188.mjs:589 | function |
| Z$ | onSubmit | chunks.188.mjs:686 | function |
| B_ | useFullStore | chunks.151.mjs:595 | hook |
| sgA | mergeCommandArrays | chunks.186.mjs:177 | function |
| tD | loadTools | chunks.141.mjs:1505 | function |
| PVq | subscribePluginCommands | chunks.186.mjs:191 | function |
| hH | localConnectionHandler | chunks.185.mjs:1433 | function |
| pJ | remoteConnectionHandler | chunks.185.mjs:1684 | function |

### Permission Mode & Tool Context (chunks.172.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| qJq | setupPermissionMode | chunks.172.mjs:2175 | function |
| KJq | buildToolPermissionContext | chunks.172.mjs:2252 | function |
| hd | parseToolList | chunks.172.mjs:2219 | function |
| Szz | expandToolNames | chunks.172.mjs:2158 | function |
| rRA | getAllToolNames | chunks.141.mjs:1459 | function |
| hzz | isSymlinkedPath | chunks.172.mjs:2168 | function |
| AJq | buildPermissionContextObject | chunks.172.mjs:2074 | function |
| cG1 | validateDirectory | chunks.151.mjs:2206 | function |
| lG1 | formatDirectoryWarning | chunks.151.mjs:2235 | function |
| QmA | checkBypassGateAsync | chunks.172.mjs:2313 | function |
| rD1 | isBypassPermissionsDisabled | chunks.172.mjs:2317 | function |
| oD1 | downgradeBypassContext | chunks.172.mjs:2323 | function |
| YJq | enforceBypassGateAsync | chunks.172.mjs:2336 | function |

### preAction Hook Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| KDq | appInitializer | chunks.175.mjs:2316 | variable (lazy thunk) |
| Rp7 | runMigrations | chunks.89.mjs:328 | function |
| UGz | syncSettings | chunks.189.mjs:851 | function |
| M_4 | fetchRemoteSettings | chunks.110.mjs:1299 | function |
| Dv7 | postRemoteSettings | chunks.72.mjs:2328 | function |
| EK | profileCheckpoint | chunks.189.mjs (import) | function |

### Argument Validation Helpers (chunks.189.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| UT6 | Commander | chunks.189.mjs (import) | library |
| kXq | CommanderInvalidArgumentError | chunks.189.mjs (import) | class |
| xv | parseUuid | chunks.189.mjs:1101 | function |
| zm1 | isSessionInUse | chunks.189.mjs:1101 | function |
| i8 | isClaudeAiSubscriber | chunks.189.mjs:1130 | function |
| pg1 | hasEnterpriseMcpConfig | chunks.189.mjs:1269 | function |
| hn4 | isMcpConfigAllowedByEnterprise | chunks.189.mjs:1271 | function |
| yl | exitWithError | chunks.189.mjs:1302 | function |
| H6 | chalk | chunks.189.mjs (import) | library |

### Agent SDK — Entrypoint & Mode Detection

> Full analysis: [20_sdk/](../20_sdk/)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| iGz | setEntrypoint | chunks.189.mjs:916-928 | function (detects CLAUDE_CODE_ENTRYPOINT; sets cli/sdk-cli/mcp/github-action) |
| w4 | isNonInteractive | chunks.1.mjs:2730-2732 | function (returns !globalState.isInteractive; used in 30+ locations) |
| bL6 | setInteractive | chunks.1.mjs:2738 | function (sets globalState.isInteractive flag) |
| L59 | getEntrypoint | chunks.75.mjs:1578 | function (returns CLAUDE_CODE_ENTRYPOINT env var) |
| APA | getBuiltinAgents | chunks.90.mjs:3049-3054 | function (filters guide agent in SDK mode) |
| Jr | getExternalUserAgent | chunks.47.mjs:1725-1728 | function (builds SDK user-agent string) |
| CJz | initializeSession | chunks.179.mjs:1654-1734 | function (processes initialize control_request) |
| t17 | SDK_SYSTEM_PROMPT_CLI | chunks.47.mjs:2494 | constant (system prompt for CLI-embedded SDK) |
| e17 | SDK_SYSTEM_PROMPT_AGENT | chunks.47.mjs:2496 | constant (system prompt for custom SDK agents) |

### Session Management (/resume, /rename)

> Full analysis: [09_slash_command/resume_and_rename.md](../09_slash_command/resume_and_rename.md)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| i8z | resumeCommandDefinition | chunks.161.mjs:2560 | object |
| l8z | resumeHandler | chunks.161.mjs:2466 | function |
| c8z | ResumeInteractiveUI | chunks.161.mjs:2388 | component |
| WN6 | SessionPickerUI | chunks.161.mjs:1227 | component |
| KYq | SessionPreviewComponent | chunks.161.mjs:930 | component |
| _Yq | SessionTagTabBar | chunks.161.mjs:1057 | component |
| ZN6 | checkCrossProjectResume | chunks.161.mjs:2178 | function |
| fN6 | agenticSearch | chunks.161.mjs:2244 | function |
| p8z | AGENTIC_SEARCH_SYSTEM_PROMPT | chunks.161.mjs:2303 | constant |
| GYq | formatResumeError | chunks.161.mjs:2349 | function |
| zuA | ResumeErrorUI | chunks.161.mjs:2358 | component |
| CAz | renameCommandDefinition | chunks.160.mjs:1613 | object |
| yAz | renameHandler | chunks.160.mjs:1570 | function |
| Q91 | saveCustomTitle | chunks.173.mjs:2264 | function |
| nL7 | setTerminalTitle | chunks.76.mjs:583 | function |
| B8z | isWorthShowing | chunks.161.mjs:2077 | function |
| Q8z | buildSearchableText | chunks.161.mjs:2104 | function |
| g8z | buildForkGroups | chunks.161.mjs:2110 | function |
| U8z | extractUniqueTags | chunks.161.mjs:2123 | function |
| h8z | extractSearchSnippet | chunks.161.mjs:1194 | function |
| abA | formatSnippetWithHighlight | chunks.161.mjs:1186 | function |
| sbA | buildSessionLabel | chunks.161.mjs:1210 | function |
| tbA | buildSessionDescription | chunks.161.mjs:1219 | function |
| $F | searchByTitle | chunks.173.mjs:2433 | function |
| wuA | loadAllProjectSessions | chunks.173.mjs:2609 | function |
| VN6 | loadSessionsForCwds | chunks.173.mjs:2663 | function |
| TI | loadFullSession | chunks.173.mjs:2380 | function |
| sR | isLazySession | chunks.173.mjs:2376 | function |
| Xw | getSessionId | chunks.173.mjs:2371 | function |
| Gi | getSessionDisplayTitle | chunks.9.mjs:1289 | function |
| xv | parseSessionUUID | chunks.90.mjs:2338 | function |
| pN6 | saveSessionTag | chunks.173.mjs:2274 | function |
| FbA | setAgentName | chunks.173.mjs:2312 | function |
| id1 | setCurrentSessionTitle | chunks.173.mjs:2308 | function |
| wm1 | getCurrentSessionTitle | chunks.173.mjs:2303 | function |
| re | appendToLog | chunks.173.mjs:2257 | function |
| PYq | matchesSessionLocally | chunks.161.mjs:2231 | function |
| WYq | extractTranscriptText | chunks.161.mjs:2225 | function |
| d8z | extractMessageText | chunks.161.mjs:2212 | function |

### Status Line

> Full analysis: [09_slash_command/statusline.md](../09_slash_command/statusline.md)
> Slash command + subagent + runtime UI component for the bottom status bar

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| E3z / GBA | statuslineCommandDefinition | chunks.167.mjs:760 | object (prompt-type slash command) |
| En7 / kn7 | statuslineSetupAgentDefinition | chunks.90.mjs:2650 | object (built-in subagent definition) |
| APA | getBuiltinAgents | chunks.90.mjs:3049 | function (returns all built-in agent defs including En7) |
| JyA | executeStatusLineHook | chunks.142.mjs:48 | function (async) |
| Zjz | buildStatusLinePayload | chunks.183.mjs:2910 | function |
| YZq | StatusLineComponent | chunks.183.mjs:2981 | function (React component) |
| nWq | NotificationStatusBar | chunks.182.mjs:1642 | function (React component — system status bar) |
| ugA | isStatusLineConfigured | chunks.183.mjs:2906 | function |
| KZq | getLastAssistantMessageId | chunks.183.mjs:2976 | function |
| kw6 | checkExceeds200kTokens | chunks.75.mjs:2261 | function |
| Ew6 | getLastApiUsage | chunks.75.mjs:2247 | function |
| $71 | selectModelForStatusLine | chunks.47.mjs:2003 | function (opus/haiku/default model selection) |
| _e | isVimModeEnabled | chunks.155.mjs:843 | function (f6().editorMode === "vim") |
| Nq | isRemoteMode | chunks.1.mjs:3014 | function (o6.isRemoteMode) |
| PN1 | getMainThreadAgentType | chunks.1.mjs:3006 | function (o6.mainThreadAgentType) |
| U6 | getSessionId | chunks.1.mjs:2425 | function (o6.sessionId) |
| m$q | statuslineCommandModuleInit | chunks.167.mjs:758 | function (lazy init) |

---

## Module: Rewind / Checkpointing

> Full analysis: [35_rewind/](../35_rewind/)

### File History Core (chunks.134.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| kP6 | rewindHandler | chunks.134.mjs:334341-334368 | function (execute rewind to target message snapshot) |
| DF4 | rewindAndRestoreFiles | chunks.134.mjs:334380-334415 | function (restore tracked files from snapshot; supports dry-run) |
| TkA | createBackupFile | chunks.134.mjs:146-172 | function (write versioned backup copy of a file to backup dir) |
| TvY | generateBackupFileName | chunks.134.mjs:137-139 | function (SHA256(filePath).slice(0,16) + "@v" + version → content-addressed name) |
| Jt | resolveBackupPath | chunks.134.mjs:141-144 | function (~/.claude/file-history/{sessionId}/{backupFileName} path builder) |
| jF4 | fileNeedsRestore | chunks.134.mjs:78-100 | function (multi-tier file comparison: existence, mode, size, mtime, content) |
| vvY | restoreFileFromBackup | chunks.134.mjs:174-192 | function (copy backup content back to original file path) |
| OF4 | calculateFileDiffStats | chunks.134.mjs:102-135 | function (compute +/- line counts for dry-run preview) |
| EvY | findBackupInOlderSnapshot | chunks.134.mjs:194-200 | function (fallback: find version-1 backup in earliest snapshot) |

### Snapshot Recording (chunks.133.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| WW1 | createSnapshotForMessage | chunks.133.mjs:334285-334350 | function (finalize snapshot for all tracked files at message end) |
| Xt | trackFileEdit | chunks.133.mjs:2760-2793 | function (record file pre-edit backup into current snapshot; first-edit-only) |
| MF4 | normalizeFilePath | chunks.133.mjs (utility) | function (normalize file path for use as snapshot key) |
| X61 | copySnapshot | chunks.1.mjs:3762-3765 | function (DEEP clone of snapshot via Myers clone; needed before mutation in trackFileEdit) |
| PF4 | debugLogFileHistoryState | chunks.133.mjs:334653 | function (conditional stderr debug logger; ALWAYS no-op in prod: LvY guard = false) |
| LvY | isDebugLoggingEnabled | chunks.133.mjs:334656 | constant (= false; debug flag for PF4; never set to true in production) |
| kvY | checkForHistoryChanges | chunks.134.mjs:288-314 | function (vestigial: computes backup diff between old/new snapshots, calls _t which is a no-op stub) |
| _t | reportFileDiffToIDE | chunks.133.mjs:334190 | function (NO-OP STUB: empty body; was IDE diff notification hook, removed/never shipped) |
| iQ1 | recordFileHistorySnapshot | chunks.173.mjs:1992-1994 | function (writes file-history-snapshot entry to session .jsonl via NJq write queue) |
| EkA | resolveTrackedFilePath | chunks.134.mjs:209-212 | function (resolve normalized/relative path to absolute via cwd; used before fs ops) |
| cjq | cleanupOldBackups | chunks.178.mjs:328-346 | function (delete backup files older than cleanupPeriodDays cutoff) |
| NJq | SessionDatabase | chunks.173.mjs:1720-1810 | class (JSONL session DB with write queue, 100ms batching, 100MB chunk limit) |

### Capability Check & Settings (chunks.179.mjs, chunks.140.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| mMq | checkRewindCapability | chunks.179.mjs:1747-1779 | function (validate rewind feasibility; dry-run or execute) |
| LP6 | snapshotExistsForMessage | chunks.134.mjs:334368 | function (check if file history has snapshot for messageId) |
| RP6 | getDryRunDiffStats | chunks.134.mjs:334373 | function (run DF4 with dryRun=true, return diff stats) |
| z2 | isFileCheckpointingEnabled | chunks.133.mjs:334248 | function (master guard: interactive=opt-out via setting+env; SDK=opt-in via CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING) |
| NvY | isSDKCheckpointingEnabled | chunks.133.mjs:334253 | function (SDK mode checkpointing: only ON if CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING=true AND disable env not set) |
| CP6 | migrateFileHistoryToNewSession | chunks.134.mjs:334572 | function (on --resume: hard-link/copy backup files from old session dir to new session dir) |
| yP6 | hydrateFileHistoryFromSnapshots | chunks.134.mjs:334552 | function (reconstruct FileHistory React state from persisted JSONL snapshots on session load) |
| fileCheckpointingEnabled | fileCheckpointingEnabled | chunks.140.mjs:2613 | constant (global boolean setting: "Enable file checkpointing for code rewind") |

### UI Component (chunks.178.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| fMq | RewindMessageSelector | chunks.178.mjs:2328-2800 | function (React component: message list + restore options UI) |
| TJz | calculateFileDiffBetweenMessages | chunks.178.mjs:2803-2834 | function (compute diff stats from stored structuredPatch data in messages) |
| g | generateRestoreOptions | chunks.178.mjs:2356-2384 | function (build restore option list; conditional on hasCodeChanges) |
| U | messageSelectionCallback | chunks.178.mjs:2388-2412 | function (Phase 1 Enter handler: fileHistory on → show Phase 2 options; off → directly call onRestoreMessage) |
| x | handleRestoreOptionSelected | chunks.178.mjs:2413-2456 | function (dispatch restore/summarize based on selected option) |
| dQA | MAX_VISIBLE_MESSAGES | chunks.178.mjs | constant (= 7; messages visible per page; scroll window centers on selected) |
| GMq | MessagePreview | chunks.178.mjs | function (React component: renders single message text preview) |
| VMq | DiffStats | chunks.178.mjs | function (React component: renders +insertions -deletions in color) |
| Zc1 | isSelectableMessage | chunks.178.mjs:2836-2846 | function (filter: user messages only, exclude tool_result turns/compact markers/meta/internal XML) |
| iS | doubleKeyPressHandler | chunks.73.mjs:2527-2544 | function (800ms double-press window; tracks Esc+Esc; shows "press again" pending indicator) |
| ZQ1 | extractMessageContent | chunks.173.mjs:377-386 | function (extract text blocks from message content for input re-injection after restore) |
| BL7 | buildSummarizeRequestContent | chunks.76.mjs:115-196 | function (build LLM summarize prompt with optional userContext appended as Additional Instructions) |
| lo | computeDiff | chunks.75.mjs:2676-2678 | function (Myers diff algorithm; built-in, not npm; returns [{added,removed,count,value}]) |
| cjq | cleanupOldBackupFiles | chunks.178.mjs:328-346 | function (delete session backup files older than cleanupPeriodDays × 24h cutoff) |
| kA | RestoreOptionSelector | chunks.178.mjs | function (React component: radio-style list; isDisabled during non-summarize loading; defaultFocus "both" or "conversation") |
| NJz | RestoreDiffStats | chunks.178.mjs | function (React component: shows file-level +/- counts from mMq dry-run; rendered for modes "both"/"code") |
| ZE7 | useDoubleEscapeExit | chunks.73.mjs:2555-2579 | function (hook: tracks Ctrl-C/Ctrl-D double-press pending state; returns {pending, keyName}) |
| GE7 | DOUBLE_PRESS_WINDOW_MS | chunks.73.mjs | constant (= 800ms; window for double-press detection in iS/doubleKeyPressHandler) |
| bE6 | randomUUID | cli.chunks.mjs:6568 | function (Node crypto.randomUUID; called after restore to invalidate derived caches) |
| $K1 | syncTodosToStorage | chunks.88.mjs:278-280 | function (write restored todos array to {sessionId}-agent.json + refreshAppState) |
| q6 | showNotification | chunks.188.mjs | function (push notification to queue; only summarize action triggers post-restore notification) |

### Slash Command (chunks.165.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| twq | defineRewindCommand | chunks.165.mjs:1152-1165 | function (lazy init: register /rewind slash command with alias "checkpoint") |
| cqz | handleRewindCommand | chunks.165.mjs:1137-1141 | function (slash command handler: calls openMessageSelector, returns {type:"skip"}) |
| lqz | rewindCommandDefinition | chunks.165.mjs:1152-1165 | object (slash command definition object for /rewind) |
| B7A | BASE_SYSTEM_PROMPT | chunks.47.mjs:2492 | constant (default interactive CLI system prompt) |

### Callbacks & Dialog Arbitration (chunks.188.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| f11 | dialogArbiter | chunks.188.mjs:304-317 | function (10-level priority arbiter: returns active dialog name; "message-selector" is priority #2) |
| N11 | onCancelAndPreRestore | chunks.188.mjs:328 | function (dual-purpose: app cancel handler AND pre-restore hook; aborts LLM stream + clears tool permission queue + clears queued commands) |
| onRestoreCode | onRestoreCode | chunks.188.mjs | function (callback: wires setFileHistory state updater into rewindHandler kP6) |
| onRestoreMessage | onRestoreMessage | chunks.188.mjs | function (callback: slice messages at checkpoint, restore todos, reset permission, re-inject prompt text) |
| onSummarize | onSummarize | chunks.188.mjs | function (callback: invoke Fa4 summarizationEngineFunction for targeted summarization) |

### Summarization Pipeline (chunks.146.mjs) — Shared with /compact

> These functions implement `Fa4` (`summarizationEngineFunction`), shared between `/rewind → Summarize` and `/compact`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Fa4 | summarizationEngineFunction | chunks.146.mjs | function (main entry: orchestrates full summarization pipeline; partial or full compaction) |
| mW6 | executePreCompactHooks | chunks.141.mjs:3011 | function (run PreCompact hooks; collect custom instructions and user-facing hook messages) |
| ga4 | runSummarizeLLM | chunks.146.mjs:2566 | function (LLM call for summarization; uses mainLoopModel; supports cache-sharing and streaming-retry feature flags) |
| TmY | stripImagesFromMessages | chunks.146.mjs:2283 | function (replace image content with placeholder before sending to summarize LLM) |
| PP | runSessionStartHooks | chunks.142.mjs:248 | function (execute SessionStart plugin hooks post-compaction; collects context messages) |
| Ua4 | collectReadFiles | chunks.146.mjs:2665 | function (collect recently-read files for post-compact context; 5000 token/file cap, 50000 cumulative budget) |
| ca4 | collectCompletedTasks | chunks.146.mjs:2724 | function (extract completed local agent task statuses for post-compact context) |
| pa4 | collectTodos | chunks.146.mjs:2688 | function (extract current todo items for post-compact context) |
| jZ6 | collectPlanFile | chunks.146.mjs:2699 | function (extract active plan file reference for post-compact context) |
| da4 | collectInvokedSkills | chunks.146.mjs:2710 | function (extract invoked skills list for post-compact context) |
| JU1 | createBoundaryMarker | chunks.173.mjs:1215 | function (create compact_boundary system message: stores trigger, preTokens, userContext, messageCount) |
| ux1 | formatSummaryText | chunks.76.mjs:323 | function (build context-restoration text block with transcript link and continuation directives) |
| a$ | getTranscriptFilePath | chunks.173.mjs:1658 | function (construct session transcript file path for summary footer link) |
