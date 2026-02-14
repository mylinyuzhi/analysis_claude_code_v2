# Symbol Index - Core Features (Claude Code 2.1.38)

> Symbol mapping table Part 2: Core features and capabilities
> Lookup: Browse by module, or Ctrl+F search for obfuscated/readable name.

---

## Quick Navigation

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

---

## Module: Agent Teams

> Full analysis: [30_agent_teams/](../30_agent_teams/)
> **NEW in 2.1.32** - Multi-agent collaboration via swarms

### Team Management & Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| QSY | TeamCreateTool | chunks.141.mjs:571 | object |
| USY | TeamDeleteTool | chunks.141.mjs:759 | object |
| YhY | SendMessageTool | chunks.141.mjs:1373 | object |
| iB | SEND_MESSAGE_TOOL_NAME | chunks.89.mjs:592 | constant ("SendMessage") |
| mSY | writeTeamConfig | chunks.141.mjs:534 | function |
| ul4 | getTeamConfigPath | chunks.141.mjs:530 | function |
| M51 | readTeamConfig | chunks.141.mjs:TBD | function |
| FSY | sanitizeTeamName | chunks.141.mjs:543 | function |
| QP | getTeamsBaseDirectory | chunks.141.mjs:TBD | function |
| cRA | getTeamSubdirectory | chunks.141.mjs:TBD | function |

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
| OI | isRunningInsideTmux | chunks.131.mjs:TBD | function |
| j51 | isRunningInIterm2 | chunks.131.mjs:TBD | function |
| Kt | isTmuxInstalled | chunks.131.mjs:TBD | function |
| xQ1 | isIt2CliInstalled | chunks.131.mjs:TBD | function |
| WN | SWARM_SESSION_NAME | chunks.131.mjs:1237 | constant ("claude-swarm") |
| gP1 | SWARM_VIEW_WINDOW_NAME | chunks.131.mjs:1241 | constant ("swarm-view") |

### Message Handling

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| oSY | handleDirectMessage | chunks.141.mjs:1432 | function |
| aSY | handleBroadcast | chunks.141.mjs:1434 | function |
| sSY | handleShutdownRequest | chunks.141.mjs:1436 | function |
| tSY | handleShutdownApproval | chunks.141.mjs:1160 | function |
| eSY | handleShutdownRejection | chunks.141.mjs:1216 | function |
| AhY | handlePlanApproval | chunks.141.mjs:1239 | function |
| qhY | handlePlanRejection | chunks.141.mjs:1265 | function |

### Mailbox & Communication

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| f9 | writeToMailbox | chunks.129.mjs:1107 | function |
| Ld | readMailbox | chunks.129.mjs:1089 | function |
| JQ1 | markMessageAsReadByIndex | chunks.129.mjs:1130 | function |
| as | getInboxPath | chunks.129.mjs:TBD | function |
| eZY | ensureInboxDirectoryExists | chunks.129.mjs:TBD | function |
| ss | parseShutdownRequest | chunks.141.mjs:TBD | function |

### Task Auto-Claim

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ib4 | claimNextTask | chunks.141.mjs:TBD | function |
| MVY | findNextAvailableTask | chunks.131.mjs:222 | function |
| PVY | generatePromptFromTask | chunks.131.mjs:231 | function |
| o7A | attemptToClaimTask | chunks.131.mjs:TBD | function |

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
| F0A | getMemoryContext | chunks.87.mjs:2299 | function |
| m0A | buildMemoryPrompt | chunks.87.mjs:2257 | function |
| y2 | isAutoMemoryEnabled | chunks.87.mjs:2194 | function |
| ga | getHomeDirectory | chunks.87.mjs:2204 | function |
| mu1 | getAutoMemoryDirectory | chunks.87.mjs:2213 | function |
| LU7 | getCurrentContextPath | chunks.87.mjs:2209 | function |
| dx | hashPath | chunks.87.mjs:TBD | function |

---

## Module: Task System

> Full analysis: [13_task_system/](../13_task_system/)
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
| Cg1 | verifyTaskCompletion | chunks.141.mjs:136 | function |
| J71 | taskStatusSchema | chunks.140.mjs:2949 | schema (pending, in_progress, completed) |

---

## Module: Keybindings

> Full analysis: [32_keybindings/](../32_keybindings/)
> **NEW in 2.1.18** - Customizable keyboard shortcuts

### Keybinding Logic

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| dX | KeybindingSetup | chunks.110.mjs:931 | function/component |
| x6Y | KeybindingHandler | chunks.110.mjs:988 | function |
| YS1 | loadKeybindings | chunks.54.mjs:1700 | function |
| Lq7 | watchKeybindingsFile | chunks.54.mjs:1752 | function |
| C6Y | CHORD_TIMEOUT_MS | chunks.110.mjs:1045 | constant (1000) |

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
| azz | buildPlanModeReminder | chunks.173.mjs:531 | function |
| Dz | isTeammate | chunks.139.mjs:2690 | function |
| ezz | buildPlanModeInterviewReminder | chunks.173.mjs:619 | function |
| g5 | getAgentName | chunks.139.mjs:2695 | function |
| kg1 | EnterPlanModeTool | chunks.140.mjs:1640 | tool object |
| kx | setNeedsPlanModeExitAttachment | chunks.139.mjs:2700 | function |
| MC1 | hasTeamConfig | chunks.139.mjs:2691 | function |
| Nj | ExitPlanModeTool | chunks.139.mjs:2641 | tool object |
| OT | setHasExitedPlanMode | chunks.139.mjs:2699 | function |
| pD | getPlanContent | chunks.146.mjs:2700 | function |
| q2z | buildPlanModeSubagentReminder | chunks.173.mjs:660 | function |
| sO | isPlanModeInterviewPhase | chunks.140.mjs:1475 | function |
| uW | getPlanFilePath | chunks.146.mjs:2702 | function |
| vg1 | pushToRemote | chunks.139.mjs:2720 | function |
| vP1 | generateRequestId | chunks.139.mjs:2710 | function |
| Xc4 | getPlanDesignAgentCount | chunks.140.mjs:1455 | function |
| xm | isPlanModeEnabled | chunks.130.mjs:412 | function |

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
| nmY | MAX_COMPACT_BUFFER | chunks.147.mjs:805 | constant (20000) |
| cCA | AUTO_COMPACT_BUFFER_OFFSET | chunks.147.mjs:807 | constant (13000) |
| rmY | TOKEN_WARNING_THRESHOLD | chunks.147.mjs:809 | constant (20000) |
| omY | TOKEN_ERROR_THRESHOLD | chunks.147.mjs:811 | constant (20000) |
| lCA | BLOCKING_LIMIT_OFFSET | chunks.147.mjs:813 | constant (3000) |

---

## Module: Hooks

> Full analysis: [11_hooks/](../11_hooks/)

### Hook Execution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| NI | executeHooksIterator | chunks.141.mjs:2311 | generator |
| IM6 | executeHook | chunks.130.mjs:1361 | function |
| Xi4 | executeAgentHook | chunks.141.mjs:1561 | function |
| BW6 | executeCommandHook | chunks.141.mjs:1898 | function |
| qyA | executePreToolHooks | chunks.141.mjs:2812 | generator |
| KyA | executePostToolHooks | chunks.141.mjs:2831 | generator |
| YyA | executePostToolUseFailureHooks | chunks.141.mjs:2850 | generator |
| zyA | executeStopHooks | chunks.141.mjs:2889 | generator |
| mW6 | executePreCompactHooks | chunks.141.mjs:3011 | function |
| UTA | executeNotificationHooks | chunks.141.mjs:2870 | function |
| HyA | executeUserPromptSubmitHooks | chunks.141.mjs:2946 | generator |
| $yA | executeSessionStartHooks | chunks.141.mjs:2961 | generator |
| AEA | executeSubagentStartHooks | chunks.141.mjs:2995 | generator |
| Wi4 | parseHookOutput | chunks.141.mjs:1780 | function |
| tGY | HOOK_EVENT_NAMES | chunks.129.mjs:717 | constant (Array) |
| Bj1 | HOOK_BLOCKED_TOOLS | chunks.141.mjs:TBD | constant (Set) |
| cD | STRUCTURED_OUTPUT_TOOL_NAME | chunks.89.mjs:TBD | constant |
| zJ6 | HookOutputSchema | chunks.141.mjs:TBD | schema |
| GB1 | StructuredOutputSchema | chunks.141.mjs:TBD | schema |
| registeredHooks | registeredHooks | chunks.1.mjs:2409 | state key |

### Hook Utilities

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ji4 | generateHookId | chunks.141.mjs:TBD | function |
| XJ6 | interpolatePrompt | chunks.141.mjs:1566 | function |
| DJ6 | registerAgentInState | chunks.141.mjs:1624 | function |
| iD1 | unregisterAgentFromState | chunks.141.mjs:1652 | function |
| fR | combineAbortSignals | chunks.141.mjs:1577 | function |
| jn7 | getStructuredOutputTool | chunks.141.mjs:1582 | function |
| kq | formatMessage | chunks.141.mjs:1683 | function |

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
| Pt | activeSkillsMap | chunks.134.mjs:2033 | Map |
| aQ1 | conditionalSkillsMap | chunks.134.mjs:2035 | Map |
| BkA | activatedSkillsSet | chunks.134.mjs:2037 | Set |
| mkA | skillChangeListeners | chunks.134.mjs:2039 | Array |
| dF4 | createSkillObject | chunks.134.mjs:1682 | function |
| pF4 | parseSkillHooks | chunks.134.mjs:1663 | function |

### Built-in Skills/Plugins

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| wzq | SecurityReviewPlugin | chunks.162.mjs:419022 | object |
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

### Steering Logic

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| N11 | onCancel | chunks.188.mjs:328-340 | function |
| Aq | createAbortController | chunks.6.mjs:449-451 | function |
| O3 | abortController | chunks.188.mjs:99 | state variable |
| HY | setAbortController | chunks.188.mjs:99 | state setter |
| XhA | createUserInterruptMessage | chunks.149.mjs | function |
| FG1 | createCleanupMessage | chunks.149.mjs | function |
| i4K | setupAbortTimeout | chunks.6.mjs | function |
| n4K | DEFAULT_TIMEOUT | chunks.6.mjs | constant |

### Remote Steering

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| cancelSession | cancelSession | chunks.176.mjs:3060-3063 | method (RemoteSessionManager) |

### Help Text

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| enter-to-steer-in-realtime | STEERING_HELP_TIP_ID | chunks.176.mjs:1341 | constant (help tip) |

---

## Module: CLI

> Full analysis: [01_cli/](../01_cli/)

### Entry Points & Commands

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| nGz | mainEntry | chunks.190.mjs:931 | function |
| aGz | commanderSetup | chunks.190.mjs:999 | function |
| qZz | cliWrapper | chunks.189.mjs:16 | function |
| gRq | showSetupScreens | chunks.190.mjs:758 | function |
| PGz | pluginValidateCommand | chunks.189.mjs:3 | function |
| VGz | installCommandRender | chunks.189.mjs:80 | function |
| yGz | updateCheckCommand | chunks.189.mjs:371 | function |
| vGz | setupTokenCommand | chunks.189.mjs:267 | function |
| LGz | doctorCommand | chunks.189.mjs:313 | function |
| RGz | installCommandAction | chunks.189.mjs:328 | function |

### UI & Interaction

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TUA | REPL | chunks.188.mjs:3 | function (Component) |
| J0 | getToolUseContext | chunks.188.mjs:426 | function |
| oc | handleQuery | chunks.188.mjs:550 | function |
| ff | onQuery | chunks.188.mjs:589 | function |
| Z$ | onSubmit | chunks.188.mjs:686 | function |
