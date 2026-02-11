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

### Teammate/Swarm Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| fEA | TmuxBackend | chunks.131.mjs:1144 | class |
| EEA | ITermBackend | chunks.131.mjs:1381 | class |
| zt | getBackend | chunks.131.mjs:1493 | function |
| WN | SWARM_SESSION_NAME | chunks.131.mjs:1237 | constant ("claude-swarm") |
| gP1 | SWARM_VIEW_WINDOW_NAME | chunks.131.mjs:1241 | constant ("swarm-view") |
| iB | SEND_MESSAGE_TOOL_NAME | chunks.89.mjs:592 | constant ("SendMessage") |
| YhY | SendMessageTool | chunks.141.mjs:1373 | object |
| oSY | handleDirectMessage | chunks.141.mjs:1432 | function |
| aSY | handleBroadcast | chunks.141.mjs:1434 | function |
| sSY | handleShutdownRequest | chunks.141.mjs:1436 | function |
| tSY | handleShutdownApproval | chunks.141.mjs:1160 | function |
| eSY | handleShutdownRejection | chunks.141.mjs:1216 | function |
| AhY | handlePlanApproval | chunks.141.mjs:1239 | function |
| qhY | handlePlanRejection | chunks.141.mjs:1265 | function |

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
| xm | isPlanModeEnabled | chunks.130.mjs:412 | function |
| pD | getPlanContent | chunks.146.mjs:2700 | function |
| uW | getPlanFilePath | chunks.146.mjs:2702 | function |

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
| tGY | HOOK_EVENT_NAMES | chunks.129.mjs:717 | constant (Array) |
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
| Pt | activeSkillsMap | chunks.134.mjs:2033 | Map |
| aQ1 | conditionalSkillsMap | chunks.134.mjs:2035 | Map |
| BkA | activatedSkillsSet | chunks.134.mjs:2037 | Set |
| mkA | skillChangeListeners | chunks.134.mjs:2039 | Array |

---

## Module: Thinking Mode

> Full analysis: [19_think_level/](../19_think_level/)

---

## Module: Steering

> Full analysis: [21_steering/](../21_steering/)
