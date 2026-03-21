# Symbol Index - Core Features (Claude Code 2.1.76)

> Symbol mapping table Part 2: Core features and capabilities
> Lookup: Browse by module, or Ctrl+F search for obfuscated/readable name.

---

## Quick Navigation

- [Rewind / Checkpointing](#module-rewind--checkpointing) - **NEW in 2.1.x**
- [Agent Teams](#module-agent-teams) - **NEW in 2.1.32**
- [Auto Memory](#module-auto-memory) - **NEW in 2.1.32**
- [Task System](#module-task-system) - **REFACTORED from Todo List**
- [Background Agents](#module-background-agents) - Foreground, background, and teammate execution
- [Keybindings](#module-keybindings) - **NEW in 2.1.18**
- [Remote Sessions](#module-remote-sessions) - **NEW in 2.1.27**
- [Fast Mode](#module-fast-mode) - **NEW in 2.1.36**
- [Proactive Mode](#module-proactive-mode) - **NEW in 2.1.38**
- [Plan Mode](#module-plan-mode)
- [Compact](#module-compact)
- [Hooks](#module-hooks)
- [Skill System](#module-skill-system)
- [Loop/Cron System](#module-loopcron-system) - **NEW in 2.1.71**
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

> **CORRECTION**: Previous versions incorrectly documented spawn function locations.
> The correct locations are verified in source code below.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| pNY | spawnTeammateDispatcher | chunks.135.mjs:1110 | function |
| qn4 | spawnTeammate | chunks.135.mjs:1116 | function |
| Rb | isInProcessEnabled | chunks.135.mjs:208 | function |
| FNY | spawnInProcessTeammate | chunks.135.mjs:985 | function |
| BNY | spawnSplitPaneTeammate | chunks.135.mjs:711 | function |
| gNY | spawnTmuxTeammate | chunks.135.mjs:838 | function |
| XNY | inProcessAgentRunner | chunks.134.mjs:1571 | function |
| DNY | pollForNextMessage | chunks.134.mjs:1483 | function |
| Ji4 | claimUnclaimedTask | chunks.134.mjs:1464 | function |
| JNY | findNextAvailableTask | chunks.134.mjs:1445 | function |
| xN1 | registerTeammateAndRun | chunks.134.mjs:1847 | function |
| jNY | sleep | chunks.134.mjs:1441 | function |
| bZ1 | killInProcessTeammate | chunks.113.mjs:1272 | function |

> **Note**: `iVY` was incorrectly documented as `spawnTeammateDispatcher`. The actual `iVY` is `fs.promises` (Node.js built-in).
> See `symbol_index_core_execution.md` for more details and `iVY.access` usage patterns.

### Agent Identity (Teammate Context)

> AsyncLocalStorage-based context for tracking teammate agent identity across async operations.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ef8 | teammateContextStorage | chunks.84.mjs:1425 | AsyncLocalStorage |
| dD1 | createTeammateContext | chunks.84.mjs:1415 | function |
| iM | getTeammateContext | chunks.84.mjs:1403 | function |
| UD1 | runWithTeammateContext | chunks.84.mjs:1407 | function |

### Backend Management

> **CORRECTION**: Previous versions incorrectly documented backend class locations.
> Verified locations: TmuxBackend=Ju8 @ chunks.134.mjs:2411, ITermBackend=Xu8 @ chunks.135.mjs:11.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ju8 | TmuxBackend | chunks.134.mjs:2411 | class |
| Xu8 | ITermBackend | chunks.135.mjs:11 | class |
| Mi4 | InProcessBackend | chunks.134.mjs:1888 | class |
| zt | getBackend | chunks.131.mjs:1493 | function |
| OI | isRunningInsideTmux | chunks.131.mjs:759 | function |
| j51 | isRunningInIterm2 | chunks.131.mjs:772 | function |
| Kt | isTmuxInstalled | chunks.131.mjs:768 | function |
| xQ1 | isIt2CliInstalled | chunks.131.mjs:780 | function |
| WN | SWARM_SESSION_NAME | chunks.131.mjs:1237 | constant ("claude-swarm") |
| gP1 | SWARM_VIEW_WINDOW_NAME | chunks.131.mjs:1241 | constant ("swarm-view") |

> **Note**: `fEA` and `EEA` were previously incorrectly mapped to TmuxBackend and ITermBackend.
> The actual backend classes are `Ju8` (TmuxBackend) and `Xu8` (ITermBackend).

### Message Handling

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| AhY | handlePlanApproval | chunks.145.mjs:2521 | function |
| aSY | handleBroadcast | chunks.145.mjs:1434 | function |
| YxY | handleShutdownApproval | chunks.145.mjs:2443 | async function |
| zxY | handleShutdownRejection | chunks.145.mjs:2499 | async function |
| Gx8 | createShutdownApprovalResponse | chunks.145.mjs:2456 | function |
| fx8 | createShutdownRejectionResponse | chunks.145.mjs:2502 | function |
| iP1 | parsePlanApprovalResponse | chunks.129.mjs:1428 | function |
| Nx4 | PlanApprovalResponseMessageSchema | chunks.129.mjs:1553 | schema |
| oSY | handleDirectMessage | chunks.145.mjs:1432 | function |
| qhY | handlePlanRejection | chunks.145.mjs:2547 | function |
| sSY | handleShutdownRequest | chunks.145.mjs:1436 | function |
| Vx4 | PlanApprovalRequestMessageSchema | chunks.129.mjs:1546 | schema |
| Vq | gracefulExit | chunks.117.mjs:899 | async function |

### Mailbox & Communication

> **CORRECTION**: Previous versions incorrectly documented mailbox function locations.
> Correct locations verified in source code (chunks.132.mjs).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| wl | readMailbox | chunks.132.mjs:3 | function |
| x3 | writeToMailbox | chunks.132.mjs:22 | function |
| Vc6 | markMessageAsReadByIndex | chunks.132.mjs:57 | function |
| kc6 | markMessagesAsRead | chunks.132.mjs:92 | function |
| pY6 | readUnreadMessages | chunks.132.mjs:16 | function |
| $TY | clearMailbox | chunks.132.mjs:128 | function |
| HTY | formatMailboxMessages | chunks.132.mjs:141 | function |
| ss | parseShutdownRequest | chunks.131.mjs:1396 | function |
| FY6 | getInboxPath | chunks.131.mjs:2849 | function |
| OTY | ensureInboxDirectoryExists | chunks.131.mjs:2858 | function |
| Nc6 | properLockfile | chunks.132.mjs:437 | module (npm) |
| iv1 | lockOptions | chunks.132.mjs:463 | object (retries: 10, minTimeout: 5ms, maxTimeout: 100ms) |

### System Reminder Integration

> Team context and mailbox attachments converted to system-reminders for LLM context.
> Cross-reference: [04_system_reminder/](../04_system_reminder/)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ui8 | normalizeAttachmentForAPI | chunks.174.mjs:3 | function |

### Task Auto-Claim & Dependencies

> **CORRECTION**: Previous `MVY` and `ib4` mappings were incorrect. See correct symbols below.
> Verified: `JNY` = `findNextAvailableTask` at chunks.134.mjs:1445 (used by claimUnclaimedTask).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ji4 | claimUnclaimedTask | chunks.134.mjs:1464 | function |
| JNY | findNextAvailableTask | chunks.134.mjs:1445 | function |
| OT8 | claimTask | chunks.84.mjs:1781 | async function |
| $N9 | claimTaskWithAgentBusyValidation | chunks.84.mjs:1831 | async function |
| ft | unassignTeammateTasks | chunks.84.mjs:1883 | async function |
| PVY | generatePromptFromTask | chunks.131.mjs:231 | function |

> **Note**: `ib4` (chunks.131.mjs:336) maps to `getUnclaimedTaskPrompt`, not `claimNextTask`.
> `MVY` at chunks.131.mjs:222 is NOT `findNextAvailableTask`. The actual `findNextAvailableTask`
> function is `JNY` at chunks.134.mjs:1445, called by `Ji4` (claimUnclaimedTask).
> The task claiming logic flow: `Ji4` → `JNY` → `OT8`.

### Idle Notification Protocol

> Teammates notify team-lead when idle, ready for new work assignments.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ec6 | buildIdleNotification | chunks.132.mjs:153 | function |
| yc6 | parseIdleNotification | chunks.132.mjs:166 | function |
| Xx8 | buildPermissionRequest | chunks.132.mjs:174 | function |
| Px8 | buildPermissionResponse | chunks.132.mjs:187 | function |

**Idle reasons**: "available", "interrupted", "failed"

### Constants & Helpers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| BY | TEAM_LEAD_ID | chunks.131.mjs:1981 | constant ("team-lead") |
| jNY | sleep | chunks.134.mjs:1441 | function (Promise-based delay) |

---

## Module: Auto Memory

> Full analysis: [31_auto_memory/](../31_auto_memory/)
> **NEW in 2.1.32** - Persistent memory via MEMORY.md

### Core Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| o2 | MEMORY_MD_FILENAME | chunks.84.mjs:415 | constant ("MEMORY.md") |
| BG3 | MEMORY_MD_FILENAME_ALT | chunks.50.mjs:2457 | constant ("MEMORY.md") |
| uj | MEMORY_MAX_LINES | chunks.84.mjs:417 | constant (200) |
| p14 | AUTO_MEMORY_DISPLAY_NAME | chunks.84.mjs:419 | constant ("auto memory") |
| Uf8 | MEMORY_DIR_EXISTS_HINT | chunks.84.mjs:423 | constant |
| pf8 | DUAL_MEMORY_DIR_EXISTS_HINT | chunks.84.mjs:425 | constant |
| mG3 | MEMORY_SUBDIR_NAME | chunks.50.mjs:2455 | constant ("memory") |

### Enable/Disable Logic

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Z3 | isAutoMemoryEnabled | chunks.50.mjs:2401 | function |
| t6 | isTruthy | chunks.50.mjs | function (helper) |
| xz | isFalsy | chunks.50.mjs | function (helper) |
| mA | getUserSettings | chunks.50.mjs | function |

### Directory Resolution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| uH | getAutoMemoryDirectory | chunks.50.mjs:2468-2473 | function (lazy) |
| Ma | getHomeDirectory | chunks.50.mjs:2411 | function |
| FG3 | getCurrentContextPath | chunks.50.mjs:2443 | function |
| BD | hashPath | chunks.50.mjs | function |
| gG3 | getCustomMemoryDirectory | chunks.50.mjs:2434 | function |
| UJ7 | getCoworkMemoryPathOverride | chunks.50.mjs:2430 | function |
| Sz8 | normalizePath | chunks.50.mjs | function |

> **Note**: `uH` uses lazy evaluation via the `e1()` memoization helper, which caches the result based on the current context path dependency.

### Prompt Building

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Q14 | buildMemoryPrompt | chunks.84.mjs:290 | function |
| U14 | buildMemoryIndex | chunks.84.mjs:324 | function |
| uv9 | buildAutoMemoryPromptSimple | chunks.84.mjs:367 | function |
| Cv9 | buildCombinedMemoryPrompt | chunks.84.mjs:230 | function |
| Iv9 | buildTypedCombinedMemoryPrompt | chunks.84.mjs:237 | function |
| xv9 | buildBackgroundAgentMemoryPrompt | chunks.84.mjs:329 | function |
| d14 | buildAgentMemoryPrompt | chunks.84.mjs:333 | function |
| Dt | buildSearchContextSection | chunks.84.mjs:373 | function |

> **Note**: The `Qf8` module (cli.chunks.mjs:3549-3553) exports these prompt functions:
> - `Qf8.buildCombinedMemoryPrompt` → `Cv9`
> - `Qf8.buildTypedCombinedMemoryPrompt` → `Iv9`
> - `Qf8.buildExtractModeTypedCombinedPrompt` → `bv9`

### Team Memory

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Lk | getTeamMemoryDirectory | chunks.84.mjs:144 | function |
| hv9 | getTeamMemoryMdPath | chunks.84.mjs:148 | function |
| SD1 | isTeamMemoryEnabled | chunks.84.mjs:139 | function |

> **Note**: `Lk` is exported as `getTeamMemPath` in cli.chunks.mjs - both names refer to the same function.

### Path Validation & Permissions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Da | isAutoMemoryPath | chunks.50.mjs:2451 | function |
| QJ7 | validateMemoryPath | chunks.50.mjs:2416 | function |
| m14 | isTeamMemoryPath | chunks.84.mjs:184 | function |
| JF6 | shouldBypassPermissionsForTeamMemory | chunks.84.mjs:211 | function |

### Main Entry Point

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ID1 | getAutoMemory | chunks.84.mjs:382 | async function |

### File Operations

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| CD1 | ensureMemoryDirExists | chunks.84.mjs:261 | async function |
| DF6 | recordMemoryDirLoadMetrics | chunks.84.mjs:273 | function |
| $z1 | getMemoryMdPath | chunks.50.mjs:2447 | function |

### Staleness Detection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| dJ7 | getDaysSinceTimestamp | chunks.50.mjs:2476 | function |
| cJ7 | formatRelativeTime | chunks.50.mjs:2480 | function |
| Cz8 | buildStalenessWarning | chunks.50.mjs:2487 | function |
| lJ7 | formatStalenessReminder | chunks.50.mjs:2493 | function |

### Memory Extraction

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| sE1 | buildExtractionSubagentPrompt | chunks.148.mjs:393 | function |
| DKq | buildStandardExtractionPrompt | chunks.148.mjs:397 | function |
| XKq | buildFileBasedExtractionPrompt | chunks.148.mjs:402 | function |
| PKq | buildTeamExtractionPrompt | chunks.148.mjs:407 | function |
| WKq | buildTeamFileBasedExtractionPrompt | chunks.148.mjs:412 | function |
| IuY | produceNestedMemoryAttachment | chunks.147.mjs:541 | async function |
| buY | produceRelevantMemories | chunks.147.mjs:552 | async function |
| zqq | getRelevantMemoriesTrigger | chunks.147.mjs:592 | function |

### Combined Prompt Builders (Team Memory)

> **VERIFIED 2026-03-21**: All three combined prompt builders located in chunks.84.mjs.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Cv9 | buildCombinedMemoryPrompt | chunks.84.mjs:230 | function |
| Iv9 | buildTypedCombinedMemoryPrompt | chunks.84.mjs:237 | function |
| bv9 | buildExtractModeTypedCombinedPrompt | chunks.84.mjs:244 | function |

**When each is used:**
- `Cv9` - Team memory enabled, standard format
- `Iv9` - Team memory + file-based format (`tengu_swinburne_dune`)
- `bv9` - Team memory + background agent mode (`tengu_passport_quail`)

### Relevant Memories Helpers

> **CORRECTION**: Previous versions incorrectly documented locations for helper functions.
> Verified locations: wqq=chunks.147.mjs:743, GW6=chunks.90.mjs:860, a4q=chunks.146.mjs:2773, h36=chunks.89.mjs:684.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| wqq | extractAgentReferences | chunks.147.mjs:743 | function |
| GW6 | getAgentMemoryPath | chunks.90.mjs:860 | function |
| a4q | searchMemoryFiles | chunks.146.mjs:2773 | async function |
| h36 | readFileWithLimit | chunks.89.mjs:684 | async function |
| hE1 | RELEVANT_MEMORIES_MAX_LINES | chunks.147.mjs:1164 | constant (200) |
| Yqq | collectNestedMemoryFiles | chunks.147.mjs:371 | function |
| AuY | listAndRankMemoryFiles | chunks.146.mjs:2784 | async function |
| quY | selectMemoriesWithLLM | chunks.146.mjs:2821 | async function |
| sxY | MAX_FILES_TO_CONSIDER | chunks.146.mjs:2870 | constant (200) |
| txY | PREVIEW_LINES | chunks.146.mjs:2872 | constant (30) |
| exY | MEMORY_SELECTION_PROMPT | chunks.146.mjs:2874 | constant (LLM system prompt) |

> **Note**: `Yqq` was incorrectly documented at line 546. The actual location is line 371.
> `a4q` was incorrectly documented as chunks.147.mjs; actual location is chunks.146.mjs:2773.
> **wqq regex patterns**: Supports TWO formats:
> 1. `/(^|\s)@"([\w:.@-]+) \(agent\)"/g` - Matches `@"agent-name (agent)"` format
> 2. `/(^|\s)@(agent-[\w:.@-]+)/g` - Matches `@agent-name` format

### Memory File Loading (@include Support)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| xD1 | loadMemoryFileWithIncludeSupport | chunks.84.mjs:495 | function |
| dv9 | extractFrontmatterPaths | chunks.84.mjs:449 | function |
| o14 | stripHtmlComments | chunks.84.mjs:469 | function |

> **Note**: `xD1` provides enhanced memory file loading with frontmatter path extraction, HTML comment stripping, and automatic 200-line truncation for AutoMem/TeamMem types. Used by the @include system for MEMORY.md references.

### Memory Template Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| RD1 | SCOPE_TYPE_DEFINITIONS | chunks.84.mjs:104 | constant |
| _36 | MEMORY_DONT_SAVE_SECTION | chunks.84.mjs:104 | constant |
| w36 | FRONTMATTER_TEMPLATE | chunks.84.mjs:104 | constant |
| LD1 | TEAM_SCOPE_DEFINITIONS | chunks.84.mjs:104 | constant |
| h14 | MEMORY_TYPE_NAMES | chunks.84.mjs:103 | constant |
| Uv9 | ALLOWED_TEXT_EXTENSIONS | chunks.84.mjs:862 | constant (Set of extensions) |

> **Verified 2026-03-21**: All constants located at chunks.84.mjs:103-104 (h14, RD1, _36, w36, LD1) and chunks.84.mjs:862 (Uv9).
> - `h14` = Array of memory type names: ["user", "feedback", "project", "reference"]
> - `RD1` = Memory types for single-scope (user, feedback, project, reference)
> - `LD1` = Memory types for team scope (with private/team guidance)
> - `_36` = "What NOT to save in memory" guidance
> - `w36` = Template for memory file frontmatter
> - `Uv9` = Set of allowed text file extensions for @include system

### TUI Components

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| toY | memoryEditorModal | chunks.155.mjs:714 | function |
| TA | updateUserSettings | chunks.153.mjs | function |

### Attachment Normalization (Cross-reference: System Reminder)

> Functions in chunks.174.mjs and chunks.173.mjs used by memory attachment normalization.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ui8 | normalizeAttachmentForAPI | chunks.174.mjs:3 | function |
| b5 | wrapWithSystemReminderTags | chunks.173.mjs:2496 | function |
| p1 | createUserMessage | chunks.173.mjs:1378 | function |

> **Note**: These functions are documented in the System Reminder module but are critical for memory attachment processing. See [04_system_reminder/](../04_system_reminder/) for full analysis.

---

## Module: Task System

> Full analysis: [13_task_system/](../13_task_system/), [05_tools/task_management_tools.md](../05_tools/task_management_tools.md)
> **REFACTORED** - Replaces Todo List (v2.1.7)

### Tool Name Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TR | TOOL_NAME_TASK_CREATE | chunks.90.mjs:2592 | constant ("TaskCreate") |
| ck | TOOL_NAME_TASK_UPDATE | chunks.90.mjs:2594 | constant ("TaskUpdate") |
| lt | TOOL_NAME_TASK_GET | chunks.91.mjs:41 | constant ("TaskGet") |
| it | TOOL_NAME_TASK_LIST | chunks.91.mjs:43 | constant ("TaskList") |

### Core Async Functions (chunks.84.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| jf | getTaskManager | chunks.84.mjs:1619 | function |
| aD1 | createTask | chunks.84.mjs:1669 | async function |
| DB | loadTask | chunks.84.mjs:1687 | async function |
| WI | updateTask | chunks.84.mjs:1701 | async function |
| sD1 | deleteTask | chunks.84.mjs:1713 | async function |
| DX | loadAllTasks | chunks.84.mjs:1742 | async function |
| _T8 | addTaskDependency | chunks.84.mjs:1754 | async function |
| r$ | isTaskSystemEnabled | chunks.84.mjs:1585 | function |
| wR | getTaskDirectory | chunks.84.mjs:1630 | function |
| yF6 | getTaskFilePath | chunks.84.mjs:1634 | function |
| L06 | sanitizeTaskListId | chunks.84.mjs:1626 | function |
| wN9 | getHighWaterMark | chunks.84.mjs:1664 | async function |
| zT8 | readHighWaterMarkFile | chunks.84.mjs (inferred) | async function |
| P84 | writeHighWaterMark | chunks.84.mjs:1580 | async function |
| Gt | invalidateTaskCache | chunks.84.mjs (inferred) | function |

### Task Schema & Hooks

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| H36 | taskStatusSchema | chunks.84.mjs:1932 | schema (pending, in_progress, completed) |
| zN9 | taskSchema | chunks.84.mjs:1932 | schema (full task object) |
| Hi6 | executeTaskCompletedHooks | chunks.175.mjs:2594 | async generator |
| $i6 | getTaskCompletedHookMessage | chunks.175.mjs:1602 | function |

### High Watermark Helpers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| P84 | writeHighWaterMark | chunks.84.mjs:1580 | async function |
| zT8 | readHighWaterMarkFile | chunks.84.mjs (inferred) | async function |
| W84 | getMaxTaskIdFromFiles | chunks.84.mjs:1647 | async function |
| Gt | invalidateTaskCache | chunks.84.mjs (inferred) | function |

### Task Claim Functions (chunks.84.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| OT8 | claimTask | chunks.84.mjs:1781 | async function |
| $N9 | claimTaskWithAgentBusyValidation | chunks.84.mjs:1831 | async function |
| ft | unassignTeammateTasks | chunks.84.mjs:1883 | async function |

### Lock Configuration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| nD1 | lockOptions | chunks.84.mjs:1942 | object (retries: 10, minTimeout: 5, maxTimeout: 100) |
| EF6 | lockfile | chunks.84.mjs (import) | module |
| _N9 | HIGHWATERMARK_FILENAME | chunks.84.mjs:1914 | constant (".highwatermark") |

### TodoWrite Tool (Simple Todo List)

> Mutually exclusive with structured Task tools. Enabled when `r$()` returns false.
> Full analysis: [05_tools/task_management_tools.md](../05_tools/task_management_tools.md#7-todowrite-tool)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| xv | TodoWriteTool | chunks.84.mjs:1970 | object |
| MB | TOOL_NAME_TODO_WRITE | chunks.84.mjs:1401 | constant ("TodoWrite") |
| HN9 | todoWriteInputSchema | chunks.84.mjs:1964 | schema |
| jN9 | todoWriteOutputSchema | chunks.84.mjs:1966 | schema |
| y06 | todoArraySchema | chunks.84.mjs (import) | schema |
| r$ | isTaskSystemEnabled | chunks.84.mjs:1585 | function |

---

## Module: Background Agents

> Full analysis: [26_background_agents/](../26_background_agents/), [08_subagent/](../08_subagent/)
> **Multi-mode execution** - Foreground, background, and teammate agents

### Background Task Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| fV1 | BACKGROUND_TASKS_DISABLED | chunks.136.mjs:1443 | constant (boolean from env) |
| V$3 | TASK_TYPE_PREFIXES | chunks.41.mjs:2438 | constant (object) |
| G97 | TASK_ID_CHARSET | chunks.41.mjs:2434 | constant ("0123456789abcdefghijklmnopqrstuvwxyz") |
| KP6 | BACKGROUND_TASKS_DISABLED | chunks.132.mjs:37 | constant (boolean) |
| Id1 | BASH_BACKGROUND_DISABLED | chunks.170.mjs:528 | constant (boolean) |
| q_q | BASH_BACKGROUND_TIMEOUT_MS | chunks.170.mjs:514 | constant (2000) |
| ghY | TURNS_BETWEEN_PROGRESS | chunks.142.mjs:2863 | constant (3) |

> **Note:** The blocked tools for background agents are enforced via tool filtering logic rather than a single constant. Tools blocked include: TaskOutput, ExitPlanMode, EnterPlanMode, Task, AskUserQuestion, TaskStop.

### Task ID Generation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| oV | createTaskId | chunks.41.mjs:2410 | function |
| k$3 | getTypePrefix | chunks.41.mjs:2406 | function |
| N$3 | generateRandomBytes | chunks.41.mjs | function |

### Background Task Creation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| zd7 | createAsyncTask | chunks.89.mjs:1447 | function |
| wd7 | createForegroundTask | chunks.89.mjs:1477 | function |
| u_6 | foregroundResolveMap | chunks.89.mjs:1477 | variable (Map) |
| Hp7 | backgroundTaskSignalMap | chunks.89.mjs | variable (Map) |

### Task State Management

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| RG | createTaskRecord | chunks.41.mjs:2418 | function |
| bZ | registerTaskInState | chunks.142.mjs:1676 | function |
| c5 | atomicUpdateTask | chunks.142.mjs:1662 | function |
| yjA | markTaskCompleted | chunks.89.mjs:1422 | function |
| CjA | markTaskFailed | chunks.89.mjs:1435 | function |
| Hd7 | backgroundForegroundTask | chunks.89.mjs:1515 | function |
| na | killTask | chunks.89.mjs:1376 | function |
| Kd7 | killAllRunningAgents | chunks.89.mjs:1448 | function |
| Ui4 | getRunningTasks | chunks.142.mjs:1686 | function |
| ia | isLocalAgentTask | chunks.89.mjs:1342 | function |
| i9 | updateTaskState | chunks.41.mjs | function |
| LJ6 | isTerminalStatus | chunks.41.mjs:2402 | function |

### Progress & Output

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| RjA | reportToolProgress | chunks.89.mjs:1393 | function |
| Yd7 | updateTaskProgress | chunks.89.mjs:1407 | function |
| g2 | getOutputFilePath | chunks.41.mjs:2248 | function |
| yJ6 | getTasksDir | chunks.41.mjs | function |
| ZK1 | writeOutputChunk | chunks.89.mjs:253 | function |
| WjA | readOutputFileDelta | chunks.89.mjs:276 | function |
| M_6 | readFullOutput | chunks.89.mjs:300 | function |
| hj1 | initOutputFile | chunks.89.mjs:310 | function |
| Ij1 | symlinkOutputFile | chunks.89.mjs:317 | function |
| Rp7 | cleanupOutputFiles | chunks.89.mjs:328 | function |
| vp7 | pendingWrites | chunks.89.mjs:346 | variable (Map) |
| Zf | registerTask | chunks.41.mjs | function |
| $O | flushTaskOutput | chunks.41.mjs | function |

### Kill Handlers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Lf6 | LocalBashTaskHandler | chunks.133.mjs:2542 | object |
| Fk1 | LocalAgentTaskHandler | chunks.146.mjs:2292 | object |
| Fn4 | RemoteAgentTaskHandler | chunks.136.mjs:1175 | object |
| wQ6 | killBashTask | chunks.95.mjs:1918 | function |
| x66 | killAgentTask | chunks.146.mjs:2012 | function |
| Vg1 | getKillHandlerForType | chunks.142.mjs:1652 | function |
| IhY | getAllKillHandlers | chunks.142.mjs:1648 | function |
| GN1 | notifyTaskCompletion | chunks.133.mjs | function |

### System Reminder Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| vIY | getUnifiedTasksAttachment | chunks.142.mjs:2719 | function |
| di4 | buildTaskAttachments | chunks.142.mjs:1711 | function |
| TIY | countTurnsSinceLastProgress | chunks.142.mjs:2703 | function |
| pi4 | resetProgressState | chunks.142.mjs | function |
| Ng1 | truncateTaskOutput | chunks.139.mjs:1664 | function |

### Notification & Queue

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| vK1 | notifyTaskCompletion | chunks.89.mjs:1346 | function |
| WR | enqueueCommand | chunks.89.mjs:402 | function |
| G_6 | notifyQueueSubscribers | chunks.89.mjs:381 | function |
| lB | enqueueOrBuffer | chunks.89.mjs:407 | function |
| W_6 | commandSubscribers | chunks.89.mjs:415 | variable (Set) |
| xj1 | commandQueue | chunks.89.mjs:514 | variable (Array) |
| Cp7 | queueEpochCounter | chunks.89.mjs:505 | variable |

### Transcript & Compaction

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| hf6 | loadTranscript | chunks.174.mjs:2705 | function |
| ld1 | buildConversationChain | chunks.173.mjs:2092 | function |
| BQ1 | filterWhitespaceAssistant | chunks.173.mjs:1388 | function |
| mQ1 | filterThinkingOnlyAssistant | chunks.173.mjs:1435 | function |
| wP6 | stripOrphanedToolResults | chunks.173.mjs:344 | function |
| kh | getSessionPathForSubagent | chunks.1.mjs:2500 | function |
| xZ | prefixAgentId | chunks.89.mjs:894 | function |
| nhA | loadAgentTranscripts | chunks.173.mjs:2766 | function |
| ihA | extractTeammateMessages | chunks.173.mjs:2759 | function |
| X$ | getAgentIdPrefix | chunks.41.mjs | function |

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

## Module: Proactive Mode

> Full analysis: [03_llm_core/proactive_mode.md](../03_llm_core/proactive_mode.md)
> **NEW in 2.1.38** - Experimental autonomous agent behavior

### Proactive Controller References (2.1.76)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Nb1 | proactiveController | chunks.196.mjs:1792 | variable (REPL) |
| _fz | proactiveController | chunks.192.mjs:2137 | variable (prompt suggestion) |
| nVY | proactiveController | chunks.136.mjs:1377 | variable (agent loop) |
| WeY | proactiveController | chunks.160.mjs:3104 | variable (progress bar) |

### Legacy Proactive Controller References (2.1.38)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| uE6 | proactiveController | chunks.188.mjs:32 | variable |
| P9z | proactiveController | chunks.169.mjs | variable |
| M8z | proactiveController | chunks.161.mjs | variable |
| ajz | proactiveController | chunks.184.mjs | variable |
| sGq | proactiveController | chunks.183.mjs | variable |

### Proactive Mode Functions

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| w8 | getFeatureFlag | chunks.177.mjs:217 | function |
| x8 | getFeatureFlag (legacy) | chunks.174.mjs:2137 | function |
| COq | getClientDataPromptVariant | chunks.168.mjs:2386 | function |
| M9z | extractPromptVariant | chunks.168.mjs:2380 | function |

---

## Module: Plan Mode

> Full analysis: [12_plan_mode/](../12_plan_mode/)

### Plan Logic

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| a2 | applyPermissionAction | chunks.42.mjs:1637 | function |
| A2z | buildPlanModeSparseReminder | chunks.173.mjs:676 | function |
| nk6 | hasExitedPlanMode | chunks.1.mjs:2930 | function (getter) |
| Au4 | buildPermissionCliArgs | chunks.131.mjs:847 | function |
| azz | buildPlanModeReminder | chunks.173.mjs:531 | function |
| JuY | countTurnsSinceLastAttachment | chunks.147.mjs:105 | function |
| Dc4 | getPlanExploreAgentCount | chunks.140.mjs:1467 | function |
| Dz | isTeammate | chunks.139.mjs:2690 | function |
| EhA | getPromptSuggestionBlocker | chunks.151.mjs:149 | function |
| Dp | handlePlanModeTransition | chunks.1.mjs:2946 | function |
| dt | TOOL_NAME_ENTER_PLAN_MODE | chunks.90.mjs:3121 | constant ("EnterPlanMode") |
| DuY | getPlanModeAttachment | chunks.147.mjs:136 | function (async) |
| ezz | buildPlanModeInterviewReminder | chunks.173.mjs:619 | function |
| g5 | getAgentName | chunks.139.mjs:2695 | function |
| Gc4 | renderEnterPlanModeResult | chunks.132.mjs:2768 | function (React) |
| W26 | cycleMode | chunks.191.mjs:3007 | function |
| GH | handleCycleModeKeybinding | chunks.193.mjs:649 | function (keybinding handler) |
| hmA | matchesAlwaysAllowRule | chunks.172.mjs:1884 | function |
| hu4 | initializeInProcessTeammate | chunks.131.mjs:2305 | function |
| t4q | PLAN_MODE_ATTACHMENT_CONFIG | chunks.147.mjs:1235 | constant (object) |
| Kd4 | renderExitPlanModeResult | chunks.131.mjs:1153 | function (React) |
| Ki6 | EnterPlanModeTool | chunks.144.mjs:1579 | tool object |
| JS | setNeedsPlanModeExitAttachment | chunks.1.mjs:2942 | function |
| l8 | hasTeamContext | chunks.1.mjs | function |
| MuY | countPlanModeAttachments | chunks.147.mjs:124 | function |
| MC1 | isPlanModeRequired | chunks.48.mjs:301 | function |
| XuY | getPlanModeExitAttachment | chunks.147.mjs:170 | function (async) |
| zD | ExitPlanModeTool | chunks.143.mjs:2802 | tool object |
| Of6 | evaluateBashCommandReadiness | chunks.150.mjs:881 | function |
| HV | setHasExitedPlanMode | chunks.1.mjs:2934 | function |
| pD | getPlanFileContent | chunks.88.mjs:126 | function |
| pCY | buildEnterPlanModePrompt | chunks.140.mjs:1488 | function |
| Pf6 | containsGitCommand | chunks.169.mjs:2014 | function |
| PM | isTeamLeader | chunks.1.mjs | function |
| q2z | buildPlanModeSubagentReminder | chunks.173.mjs:685 | function |
| Fu1 | needsPlanModeExitAttachment | chunks.1.mjs:2938 | function (getter) |
| rO | isPlanModeInterviewPhase | chunks.50.mjs:2520 | function |
| szz | buildFullPlanModeReminder | chunks.173.mjs:531 | function |
| tzz | buildAllowedToolsList | chunks.173.mjs:611 | function |
| uW | getPlanFilePath | chunks.88.mjs:120 | function (returns path in format `~/.claude/plans/{slug}.md`) |
| N51/Xz6 | checkEditPermissions | chunks.146.mjs / chunks.139.mjs | function (Write/Edit plan file bypass — returns "allow" for plan file paths, short-circuiting orchestrator mode check) |
| vg1 | pushToRemote | chunks.139.mjs:2720 | function |
| vP1 | generateRequestId | chunks.139.mjs:2710 | function |
| Xc4 | getPlanDesignAgentCount | chunks.140.mjs:1455 | function |
| xm | isPlanModeEnabled | chunks.130.mjs:412 | function |
| Yd4 | renderExitPlanModeRejected | chunks.131.mjs:1324 | function (React) |
| jZ1 | RejectedPlanViewer | chunks.112.mjs:1142 | function (React) |
| aPq | ExitPlanModeDialog | chunks.165.mjs:2676 | function (React) |
| $Y | isTeammate | chunks.139.mjs:2690 | function |
| NF6 | hasTeamConfig | chunks.139.mjs:2879 | function |
| l5 | getTeamName | chunks.139.mjs:2882 | function |
| ak | hashForRequestId | chunks.139.mjs:2883 | function |
| x3 | writeToMailbox | chunks.139.mjs:2892 | function (async) |
| ik1 | findTaskByAgentName | chunks.139.mjs:2898 | function |
| ag8 | setAwaitingPlanApproval | chunks.139.mjs:2899 | function |
| E7 | isTasksEnabled | chunks.143.mjs:2950 | function |
| z3 | toolNameMatches | chunks.143.mjs:2950 | function |
| r4 | TaskToolName | chunks.143.mjs:2950 | constant ("Task") |
| Fj | getPlanFilePath | chunks.143.mjs:2877 | function |
| sJ | getPlanContent | chunks.143.mjs:2878 | function |
| sl6 | autoModeGate | chunks.143.mjs:2916 | object (module) |
| tCY | autoModeState | chunks.143.mjs:2937 | object (module) |
| MS | setNeedsAutoModeExitAttachment | chunks.1.mjs:2955 | function |
| pu1 | needsAutoModeExitAttachment | chunks.1.mjs:2951 | function (getter) |
| Qu1 | handleAutoModeTransition | chunks.1.mjs:2959 | function |
| Uk | TOOL_NAME_EXIT_PLAN_MODE | chunks.90.mjs:505 | constant ("ExitPlanMode") |
| aJ | TOOL_NAME_EXIT_PLAN_MODE_ALT | chunks.90.mjs:507 | constant ("ExitPlanMode") |
| SI | TaskToolDisplayName | chunks.143.mjs:3004 | constant ("Task") |

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

### Plan Mode Display (Mode Configuration)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| D57 | MODE_CONFIGURATION | chunks.40.mjs:358 | constant (object) |
| Lw8 | isDefaultMode | chunks.14.mjs:3277 | function |

**Note:** Mode display properties (icon, title, color) are defined in `D57` configuration object:
```javascript
D57 = {
    plan: { title: "Plan Mode", symbol: "⏸", color: "planMode" },
    acceptEdits: { title: "Accept edits", symbol: "⏵⏵", color: "autoAccept" },
    ...
}
```
The previously documented symbols `CQ`, `Rv1`, `cP` do NOT exist as separate functions - mode display is handled via `D57` lookup.

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

### Plan Mode Tool Names

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| dt | TOOL_NAME_ENTER_PLAN_MODE | chunks.90.mjs:3121 | constant ("EnterPlanMode") |
| aJ | TOOL_NAME_EXIT_PLAN_MODE | chunks.90.mjs:507 | constant ("ExitPlanMode") |
| N_6 | TOOL_NAME_ENTER_PLAN_MODE | chunks.89.mjs:564 | constant ("EnterPlanMode") |
| bW | TOOL_NAME_EXIT_PLAN_MODE | chunks.88.mjs:76 | constant ("ExitPlanMode") |

### Auto-Mode Gate

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| IN | isAutoModeGateEnabled | cli.chunks.mjs:7421 | function |
| dn8 | getAutoModeUnavailableReason | cli.chunks.mjs:7425 | function |
| qS1 | getAutoModeUnavailableNotification | cli.chunks.mjs:7426 | function |

### Swarm Config Properties

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| - | planModeRequired | chunks.135.mjs:657 | property |
| - | plan_mode_required | chunks.135.mjs:720 | property |

---

## Module: Compact

> Full analysis: [07_compact/](../07_compact/)

### Compaction Logic

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| sqq | autocompactDispatcher | chunks.147.mjs:2633 | function |
| CmY | shouldTriggerAutoCompaction | chunks.147.mjs:2620 | function |
| Xh | isAutoCompactEnabled | chunks.147.mjs:2614 | function |
| mz6 | getCompactionStatus | chunks.147.mjs:2591 | function |
| oc6 | getAutoCompactThreshold | chunks.147.mjs:2577 | function |
| OF | getEffectiveContextWindow | chunks.147.mjs:2566 | function |
| mf6 | performFullCompaction | chunks.147.mjs:1473 | function |
| Gqq | generateSummaryWithLLM | chunks.147.mjs:1752 | function |
| lE1 | trySessionMemoryQuickPath | chunks.147.mjs:2482 | function |
| fqq | collectFilesToKeep | chunks.147.mjs:1862 | function |
| Nqq | collectTasksToKeep | chunks.147.mjs:1923 | function |
| mE1 | collectPlanToKeep | chunks.147.mjs:1885 | function |
| Tqq | getInvokedSkillsAttachment | chunks.147.mjs:1896 | function |
| vqq | collectPlanModeAttachment | chunks.147.mjs:1910 | function |
| DmY | isInternalFile | chunks.147.mjs:1942 | function |
| RmY | MAX_COMPACT_BUFFER | chunks.147.mjs:2676 | constant (20000) |
| Jp8 | AUTO_COMPACT_BUFFER_OFFSET | chunks.147.mjs:2678 | constant (13000) |
| hmY | TOKEN_WARNING_THRESHOLD | chunks.147.mjs:2680 | constant (20000) |
| SmY | TOKEN_ERROR_THRESHOLD | chunks.147.mjs:2682 | constant (20000) |
| Mp8 | BLOCKING_LIMIT_OFFSET | chunks.147.mjs:2684 | constant (3000) |
| aqq | MAX_AUTO_COMPACT_FAILURES | chunks.147.mjs:2686 | constant (3) |
| jmY | COMPACT_MAX_RETRIES | chunks.147.mjs:1960 | constant (2) |

### Session Memory Compaction

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| lE1 | trySessionMemoryQuickPath | chunks.147.mjs:2482 | function |
| cE1 | isSessionMemoryCompactEnabled | chunks.147.mjs:2440 | function |
| ymY | buildSessionMemoryCompactResult | chunks.147.mjs:2448 | function |
| Yp8 | addPreservedSegmentToMarker | chunks.147.mjs:1449 | function |
| Xqq | MAX_FILES_TO_KEEP | chunks.147.mjs:1954 | constant (5) |
| $mY | MAX_FILE_RESTORE_TOKENS | chunks.147.mjs:1956 | constant (50000) |
| HmY | MAX_TOKENS_PER_FILE | chunks.147.mjs:1958 | constant (5000) |

### Message Selection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| EmY | findCompactionBoundary | chunks.147.mjs:2413 | function |
| Op8 | adjustBoundariesForTools | chunks.147.mjs:2376 | function |
| oqq | isTextBlockMessage | chunks.147.mjs:2349 | function |
| VmY | extractToolResultIds | chunks.147.mjs:2359 | function |
| kmY | hasToolUseWithId | chunks.147.mjs:2369 | function |
| vmY | getSmCompactConfig | chunks.147.mjs:2331 | function |
| NmY | loadSmCompactConfig | chunks.147.mjs:2337 | function |
| xmY | setSmCompactConfig | chunks.147.mjs:2326 | function |
| TmY | smCompactConfig | chunks.147.mjs:711 | variable |
| $p8 | SM_COMPACT_CONFIG_DEFAULTS | chunks.147.mjs:707 | constant |

### Slash Command Compact

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| PpY | compactCommandHandler | chunks.151.mjs:131 | function |
| WpY | manualCompactWithReactiveMode | chunks.151.mjs:57 | function |
| N9q | initializeCompactCommand | chunks.151.mjs:186 | function |
| G9q | buildCompactionContext | chunks.151.mjs:109 | function |
| Z9q | reactiveCompactRef | chunks.151.mjs:129 | variable |

### Compact Boundary Markers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ri6 | createCompactBoundaryMessage | chunks.174.mjs:580 | function |
| RZ | isCompactBoundaryMessage | chunks.174.mjs:616 | function |
| Szz | findLastCompactBoundaryIndex | chunks.174.mjs:620 | function |
| fN | getMessagesFromLastBoundary | chunks.174.mjs:628 | function |

### Compact State Cleanup

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| K16 | clearMessageCache | chunks.147.mjs:2011 | function |
| gl | clearTokenEstimate | chunks.147.mjs:2551 | function |
| bc6 | clearCompactBoundaries | chunks.133.mjs:916 | function |

### Query Pipeline Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| SKq | createCompactionToolsContext | chunks.148.mjs:834 | function |
| omY | queryLoopMainFunction | chunks.148.mjs:882 | function |
| Yh | queryEntryPoint | chunks.148.mjs:875 | function |

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

> Note: `mf6` (performFullCompaction) is listed in Compaction Logic section above.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Gqq | generateSummaryWithLLM | chunks.147.mjs:1752 | function |
| Wqq | performPartialCompaction | chunks.147.mjs:1610 | function |
| Jqq | extractCompactionMetadata | chunks.147.mjs:1364 | function |
| zp8 | mergeCustomInstructions | chunks.147.mjs:1465 | function |
| BE1 | extractTextFromResponse | chunks.173.mjs:2364 | function |
| Ri6 | createCompactBoundaryMessage | chunks.174.mjs:580 | function |
| jl | assembleMessages | chunks.147.mjs:1445 | function |
| Ck | countMessagesTokens | chunks.84.mjs:1094 | function |
| Nf6 | estimateTokenCount | chunks.133.mjs:974 | function |

### Message Selection & Boundary Logic

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| EmY | findCompactionBoundary | chunks.147.mjs:2413 | function |
| Op8 | adjustBoundariesForTools | chunks.147.mjs:2376 | function |
| vmY | getSmCompactConfig | chunks.147.mjs:2331 | function |
| NmY | loadSmCompactConfig | chunks.147.mjs:2337 | function |
| oqq | isTextBlockMessage | chunks.147.mjs:2349 | function |
| VmY | extractToolResultIds | chunks.147.mjs:2359 | function |
| kmY | hasToolUseWithId | chunks.147.mjs:2369 | function |

### Configuration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| cE1 | isSessionMemoryCompactEnabled | chunks.147.mjs:2440 | function |
| WZ6 | SECTION_TOKEN_LIMIT | chunks.147.mjs:174 | constant (2000) |
| Hs4 | TOTAL_SESSION_NOTES_LIMIT | chunks.147.mjs:176 | constant (12000) |
| dE1 | SM_COMPACT_CONFIG_DEFAULTS | chunks.147.mjs:2542 | constant ({ minTokens: 10000, minTextBlockMessages: 5, maxTokens: 40000 }) |
| - | ENABLE_CLAUDE_CODE_SM_COMPACT | process.env | environment variable |
| - | DISABLE_CLAUDE_CODE_SM_COMPACT | process.env | environment variable |
| - | tengu_session_memory | Statsig | feature flag |
| - | tengu_sm_compact | Statsig | feature flag |

### State Preservation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| kq | createAttachmentMessage | chunks.142.mjs:2615 | function |
| TyA | readFileForAttachment | chunks.142.mjs:2524 | function |
| uW | getPlanFilePath | chunks.88.mjs:120 | function |
| pD | getPlanFileContent | chunks.88.mjs:126 | function |
| UB | getTodoList | chunks.88.mjs:274 | function |
| St6 | getInvokedSkillsForAgent | chunks.1.mjs:3052 | function |
| Xqq | MAX_FILES_TO_KEEP | chunks.147.mjs:1954 | constant (5) |
| $mY | MAX_FILE_RESTORE_TOKENS | chunks.147.mjs:1956 | constant (50000) |
| HmY | MAX_TOKENS_PER_FILE | chunks.147.mjs:1958 | constant (5000) |

### File Read Tracking

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| R14 | LruMapWrapper | chunks.84.mjs:3 | class |
| kT | QuickLRU | chunks.84.mjs | class (import) |
| ED1 | normalizePath | chunks.84.mjs | function |
| yd | createLruCache | chunks.84.mjs:53 | function |
| mf8 | mapEntriesToObject | chunks.84.mjs:57 | function |
| jB | getWatchedFilePaths | chunks.84.mjs:61 | function |
| DI | cloneLruCache | chunks.84.mjs:65 | function |
| yD1 | mergeFileReadState | chunks.84.mjs:70 | function |
| Ed | LRU_MAX_ENTRIES | chunks.84.mjs:79 | constant (100) |
| yv9 | LRU_MAX_SIZE | chunks.84.mjs:81 | constant (26214400) |

### Microcompaction

> **Note:** In v2.1.76, microcompaction is disabled (no-op function). The `pg` function simply returns messages unchanged.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| pg | performMicrocompaction | chunks.133.mjs:991 | function (no-op in v2.1.76) |
| Qc4 | clearMicrocompactInProgress | chunks.133.mjs:992 | function |
| lc4 | IMAGE_TOKEN_ESTIMATE | chunks.133.mjs:997 | constant (2000) |
| NG1 | setMicrocompactInProgress | chunks.147.mjs:221 | function |
| Ds4 | clearMicrocompactInProgress | chunks.147.mjs:225 | function |
| js4 | resetMicrocompactStateAndFlag | chunks.147.mjs:229 | function |
| FD9 | createPreview | chunks.80.mjs:2799 | function |
| BD9 | formatPersistedOutputMessage | chunks.80.mjs:2760 | function |
| umY | MIN_MICROCOMPACT_TOKENS | chunks.147.mjs:464 | constant (20000) |
| BmY | MANUAL_MICROCOMPACT_THRESHOLD | chunks.147.mjs:466 | constant (40000) |
| mmY | KEEP_RECENT_TOOL_RESULTS | chunks.147.mjs:468 | constant (3) |
| gCA | IMAGE_TOKEN_ESTIMATE | chunks.147.mjs:470 | constant (2000) |

### Compaction Hooks

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| sT6 | executePreCompactHooks | chunks.175.mjs:2682 | function |
| FE1 | executePostCompactHooks | chunks.175.mjs:2713 | function |
| Qu8 | executeSessionStartHooks | chunks.175.mjs:2632 | function |
| RF | executeHooksOutsideREPL | chunks.175.mjs:2279 | function |
| $w | createHookContext | chunks.175.mjs:1002 | function |
| T$ | DEFAULT_HOOK_TIMEOUT | chunks.176.mjs:178 | constant (600000) |
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
| Ax | executeHooksIterator | chunks.175.mjs:1612 | generator |
| LF8 | executePreToolHooks | chunks.175.mjs:2462 | generator |
| RF8 | executePostToolHooks | chunks.175.mjs:2486 | generator |
| hF8 | executePostToolUseFailureHooks | chunks.175.mjs:2505 | generator |
| Xm | executeNotificationHooks | chunks.175.mjs:2528 | function |
| Lp8 | executeStopHooks | chunks.175.mjs:2547 | generator |
| Rp8 | executeTeammateIdleHooks | chunks.175.mjs:2579 | generator |
| Hi6 | executeTaskCompletedHooks | chunks.175.mjs:2594 | generator |
| yr8 | executeUserPromptSubmitHooks | chunks.175.mjs:2613 | generator |
| yp8 | getTeammateIdleHookMessage | chunks.175.mjs:1597 | function |
| $i6 | getTaskCompletedHookMessage | chunks.175.mjs:1602 | function |
| Qu8 | executeSessionStartHooks | chunks.175.mjs:2632 | generator |
| RQ8 | executeSessionEndHooks | chunks.175.mjs | function |
| UN6 | executeConfigChangeHooks | chunks.175.mjs:2787 | function |
| ZF6 | executeInstructionsLoadedHooks | chunks.175.mjs:2814 | function |
| A$8 | executeElicitationHooks | chunks.175.mjs | function |
| q$8 | executeElicitationResultHooks | chunks.175.mjs | function |
| Ux8 | executeSubagentStartHooks | chunks.175.mjs:2666 | generator |
| Uu8 | executeSetupHooks | chunks.175.mjs | generator |
| b_6 | executePermissionRequestHooks | chunks.175.mjs:2766 | generator |
| mW6 | executePreCompactHooks | chunks.141.mjs:3011 | function |
| JN1 | executePluginHooksForSession | chunks.135.mjs:1836 | function |
| oN1 | executePluginHooksForSetup | chunks.135.mjs:1882 | function |
| nB | loadAllPluginHooks | chunks.94.mjs:824 | variable (memoized) |
| l1z | allowManagedHooksOnly | chunks.163.mjs:2537 | function |
| nF9 | extractPluginHooksForEvent | chunks.94.mjs:751 | function |
| KA6 | registerPluginHooks | chunks.94.mjs | function |
| lu1 | deregisterPluginHooks | chunks.94.mjs | function |
| oF9 | setupPluginHookHotReload | chunks.94.mjs:806 | function |
| rF9 | resetHotReloadState | chunks.94.mjs:796 | function |
| d01 | clearPluginHookCache | chunks.94.mjs:792 | function |
| F_4 | getEnabledPluginsHash | chunks.94.mjs:800-804 | function (for hot reload change detection) |
| rN1 | executeWorktreeRemoveHook | chunks.175.mjs | function |
| nN1 | executeWorktreeCreateHook | chunks.175.mjs | function |

### Hook Resolution & Loading

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| kr8 | resolveHooksForEvent | chunks.175.mjs:1506 | function |
| E_z | mergeHookSources | chunks.175.mjs:1477 | function |
| k_z | matchesHookMatcher | chunks.175.mjs:1434 | function |
| Uk7 | getPolicySettingsHooks | chunks.75.mjs:1533 | function |
| DN1 | getRegisteredHooks | chunks.1.mjs:2921 | function |
| Ww6 | getSessionHooks | chunks.75.mjs:1184 | function |
| Ik7 | getSessionFunctionHooks | chunks.75.mjs:1200 | function |
| xk7 | findHookCallbackForEvent | chunks.75.mjs:1228 | function |

### Hook Executors

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| vS1 | executeCommandHook | chunks.175.mjs:1218 | function |
| Nr8 | executeHttpHook | chunks.175.mjs:868 | function |
| cTq | executeAgentHook | chunks.175.mjs:515 | function |
| QTq | executePromptHook | chunks.175.mjs:366 | function |
| L_z | executeCallbackHook | chunks.176.mjs:61 | function |
| y_z | executeFunctionHook | chunks.176.mjs:3 | function |
| RF | executeHooksOutsideREPL | chunks.175.mjs:2279 | function |

### Hook Output Processing

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Kvq | parseHookOutput | chunks.175.mjs:1030 | function |
| qvq | tryParseHookJson | chunks.175.mjs:997 | function |
| Yvq | parseHttpHookOutput | chunks.175.mjs:1053 | function |
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
| eTq | registerAsyncHook | chunks.175.mjs:955 | function |
| On7 | appendAsyncHookStdout | chunks.90.mjs:1840 | function |
| _n7 | appendAsyncHookStderr | chunks.90.mjs:1846 | function |
| cMA | finalizeAsyncHook | chunks.90.mjs:1852 | function |
| Jn7 | getPendingHookResponses | chunks.90.mjs:1865 | function |
| Xn7 | removeDeliveredAsyncHooks | chunks.90.mjs:1916 | function |
| lMA | cleanupAllAsyncHooks | chunks.90.mjs:1923 | function |
| VR | asyncHookRegistry | chunks.90.mjs:1941 | variable (Map) |
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
| WS1 | interpolateHookPrompt | chunks.175.mjs:722 | function |
| mN | combineAbortSignals | chunks.175.mjs:250 | function |
| pTq | getStructuredOutputTool | chunks.175.mjs:321 | function |
| ZS1 | registerAgentInState | chunks.175.mjs:346 | function |
| zZ6 | unregisterAgentFromState | chunks.95.mjs:1830 | function |
| MZ | getHookDisplayName | chunks.75.mjs:1272 | function |
| f01 | mergeAsyncGenerators | chunks.92.mjs:2642 | generator |
| Pi4 | isWorkspaceTrustRequired | chunks.141.mjs:1765 | function |

### Hook Schemas & Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| tGY | HOOK_EVENT_NAMES_SCHEMA | chunks.131.mjs:2395 | schema (Zod enum for 22 events) |
| T$ | DEFAULT_HOOK_TIMEOUT | chunks.176.mjs:178 | constant (600000ms = 10 min) |
| CW6 | HOOK_BLOCKED_TOOLS | chunks.91.mjs:269 | constant (Set) |
| oM | STRUCTURED_OUTPUT_TOOL_NAME | chunks.91.mjs:94 | constant ("StructuredOutput") |
| zJ6 | HookOutputSchema | chunks.129.mjs:834 (LZY) | schema |
| GB1 | StructuredOutputSchema | chunks.90.mjs:2044 | schema |
| gZ | HookBasePayloadSchema | chunks.129.mjs:717 | schema |
| eGY | PreToolUsePayloadSchema | chunks.129.mjs:722 | schema |
| qZY | PostToolUsePayloadSchema | chunks.129.mjs:732 | schema |
| KZY | PostToolUseFailurePayloadSchema | chunks.129.mjs:738 | schema |
| JZY | PreCompactPayloadSchema | chunks.129.mjs:774 | schema |
| WZY | AsyncHookResponseSchema | chunks.129.mjs:792 | schema |
| cow | AllHookInputUnionSchema | chunks.129.mjs:792 | schema |
| registeredHooks | registeredHooks | chunks.1.mjs:2409 | state key |
| - | PostCompactPayloadSchema | chunks.129.mjs | schema |
| - | ElicitationPayloadSchema | chunks.129.mjs | schema |
| - | ConfigChangePayloadSchema | chunks.129.mjs | schema |

---

## Module: Skill System

> Full analysis: [10_skill_system/](../10_skill_system/)

### Skill Loading Core

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| I0 | getAllSkills | chunks.168.mjs:2013 | function (memoized, returns all loaded skills) |
| NR | getAllSkillsForTool | chunks.168.mjs:2029 | function (filtered for Skill tool invocation) |
| z5z | getSkills | chunks.168.mjs:1815 | function (aggregates all skill sources) |
| JV8 | loadSkillDirCommands | chunks.90.mjs:1577 | function (memoized, loads from skill directories) |
| Zp6 | loadSkillsFromDirectory | chunks.90.mjs:1265 | function (loads skills from one directory) |
| Fm9 | loadLegacyCommands | chunks.90.mjs:1373 | function (loads deprecated commands format) |
| v94 | createSkillObject | chunks.90.mjs:1185 | function (factory for skill objects) |
| jV8 | isSkillFile | chunks.90.mjs:1323 | function (checks if filename is SKILL.md) |
| um9 | deduplicateSkillFiles | chunks.90.mjs:1327 | function (dedup by preferring SKILL.md) |
| BP6 | clearSkillsCache | chunks.90.mjs:1439 | function |
| Cr6 | clearAllSkillCaches | chunks.168.mjs:1838 | function |
| oB | refreshSkills | chunks.168.mjs:1842 | function |

### Skill Registry & Lookup

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| G66 | findSkillByName | chunks.168.mjs:1850 | function (finds by name, alias, or userFacingName) |
| rY6 | hasSkill | chunks.168.mjs:1854 | function |
| kf6 | getSkillOrThrow | chunks.168.mjs:1858 | function |
| Sv6 | getSkillDescription | chunks.168.mjs:1864 | function |
| vp6 | getSlashCommandSkills | chunks.168.mjs:2031 | function (filtered for slash commands) |
| Ii8 | ALWAYS_INCLUDE_SKILLS | chunks.168.mjs:2037 | Set (skills always included) |
| EZq | filterAlwaysIncludeSkills | chunks.168.mjs:1846 | function |

### Conditional Skill Activation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| LW6 | activateConditionalSkills | chunks.90.mjs:1508 | function (activates skills when paths match) |
| xm9 | parseSkillPaths | chunks.90.mjs:1176 | function (parses `paths:` frontmatter) |
| VW6 | conditionalSkillsMap | chunks.90.mjs:1616 | Map (stores conditional skills) |
| IP1 | activatedSkillsSet | chunks.90.mjs:1620 | Set (skills already activated, never re-deactivated) |
| rd | activeSkillsMap | chunks.90.mjs:1549 | Map (currently active skills) |
| MV8 | skillChangeListeners | chunks.90.mjs:1620 | Array (callbacks notified on skill changes) |
| HV8 | checkedSkillsDirs | chunks.90.mjs:1620 | Set (directories already checked) |
| E94 | clearSkillsCache | chunks.90.mjs:1539 | function (resets skill caches) |

### Skill Parsing & Frontmatter

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| T94 | parseSkillHooks | chunks.90.mjs:1166 | function (Zod-parses hooks frontmatter) |
| Pp6 | parseSkillArguments | chunks.90.mjs:1099 | function (parses arguments frontmatter) |

### Bundled & Plugin Skills

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| lPq | bundledSkillRegistry | chunks.165.mjs:2587 | Array |
| iPq | getBundledSkills | chunks.165.mjs:2589 | function |
| f24 | getBuiltinPluginSkills | chunks.94.mjs:2705 | function |
| hk8 | getPluginSkills | chunks.94.mjs:707-746 | variable (memoized) |
| vU7 | loadPluginSkillDir | chunks.87.mjs | function (loads from plugin skillsPath) |
| uu1 | createPluginCommandObject | chunks.87.mjs:1870 | function |

### Skill Execution Helpers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ej1 | interpolateArguments | chunks.87.mjs:1735 | function |
| uB | executeShellExpansion | chunks.90.mjs:1031 | function (executes !`cmd` and ```!\ncmd\n``` patterns in skill text) |
| Lm9 | TEMPLATE_CODE_BLOCK_REGEX | chunks.90.mjs:1089 | constant (/```!\s*\n?...\n?```/g) |
| Rm9 | TEMPLATE_INLINE_REGEX | chunks.90.mjs:1089 | constant (/(?<=^|\s)!`([^`]+)`/gm) |
| Jb7 | formatShellOutput | chunks.90.mjs:1068 | function |
| hm9 | handleShellExpansionError | chunks.90.mjs:1050 | function |
| mM6 | setupForkedCommandContext | chunks.149.mjs:2562 | function |
| FM6 | extractForkedCommandResult | chunks.149.mjs:2582 | function |
| tJ | checkBashPermission | chunks.90.mjs:1036 | function (permission check for shell commands) |
| JW6 | summarizeToolOutput | chunks.90.mjs:1046 | function |
| ym9 | getEmptyConfig | chunks.90.mjs:1046 | function |
| Z94 | formatBashResult | chunks.90.mjs:1046 | function |

### Forked Skill Execution

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| zkY | executeForkedSkill | chunks.136.mjs:2447 | function (spawns subagent for forked skill) |
| DN1 | setupForkedCommandContext | chunks.148.mjs:1951 | function (prepares context for forked execution) |
| XN1 | extractForkedCommandResult | chunks.148.mjs:1971 | function (extracts result from forked execution) |
| ABY | createIsolatedAppState | chunks.148.mjs:1934 | function (wraps getAppState with allowedTools injection) |
| Bc6 | createChildToolUseContext | chunks.148.mjs:1978 | function (creates isolated context for nested agent execution) |
| zA6 | clearInvokedSkillsForAgent | chunks.136.mjs:2512 | function (cleanup after forked execution) |
| bI | generateAgentId | chunks.136.mjs:2449 | function (unique ID for forked agent) |
| qh | runAgentLoop | chunks.136.mjs:2471 | function (main agent execution loop) |
| JM | flattenMessages | chunks.173.mjs:1516 | function (flattens nested messages; used in skill progress at chunks.136.mjs:2487) |

### Skill Usage Tracking

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ON1 | trackSkillUsage | chunks.133.mjs:884 | function (records usage count and timestamp) |
| ux8 | computeSkillScore | chunks.133.mjs:900 | function (7-day half-life decay scoring) |
| Qg | getSkillUsageState | chunks.168.mjs:1895 | function (returns skill usage map) |
| Ci8 | getUsedSkillNames | chunks.168.mjs:1896 | function |

### Skill-Reminder Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| guY | generateSkillListingAttachment | chunks.147.mjs:700 | function (creates skill_listing attachment) |
| fV8 | formatSkillListing | chunks.90.mjs:2654 | function (budget-aware skill formatting) |
| GV8 | formatSkillDescriptionLine | chunks.90.mjs:2645 | function |
| PB9 | formatSkillEntry | chunks.90.mjs:2649 | function |
| TV8 | getSkillToolInfo | chunks.90.mjs:2689 | function |
| vV8 | getLimitedSkillToolCommands | chunks.90.mjs:2697 | function |
| nT6 | sentSkillNames | chunks.147.mjs:1247 | Set (tracks which skills were sent) |
| Oc | clearSentSkillNames | chunks.147.mjs:692 | function |
| Vn4 | markInitialSend | chunks.147.mjs:696 | function |

### Skill Tool Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| m66 | SkillTool | chunks.137.mjs:46 | object (tool definition) |
| oH | SKILL_TOOL_NAME | chunks.90.mjs:2596 | constant ("Skill") |
| _kY | skillInputSchema | chunks.137.mjs:27-30 | schema |
| wkY | skillOutputSchema | chunks.137.mjs:30-45 | schema |
| OkY | SKILL_PROPERTY_KEYS | chunks.137.mjs:274 | Set (safe properties for auto-allow) |
| $kY | validateSkillProperties | chunks.136.mjs:2516 | function (checks for unsafe properties) |
| tn4 | isPluginFirstParty | chunks.136.mjs:2528 | function |
| WvY | processPromptSlashCommand | chunks.133.mjs:1426 | function |

### Skill Hook Registration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| gc4 | registerSkillHooks | chunks.133.mjs:862 | function (registers hooks from skill frontmatter) |
| JW1 | addSkillHook | chunks.95.mjs:1688 | function (wrapper for session hook registration) |
| c24 | addSessionHook | chunks.95.mjs:1704 | function (core session hook registration) |
| MW1 | addFunctionHook | chunks.95.mjs:1692 | function (registers function-based hooks) |
| l24 | removeSessionHook | chunks.95.mjs:1741 | function (removes session hook) |
| zZ6 | clearSessionHooks | chunks.95.mjs:1830 | function (clears all hooks for session) |
| jW1 | getSessionHooks | chunks.95.mjs:1774 | function (gets hooks for session/event) |
| Fu | HOOK_EVENT_NAMES | chunks.40.mjs:771 | constant (22-item Array, all event names) |

### InstructionsLoaded Hook (NEW v2.1.76)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| WF6 | hasInstructionsLoadedHook | chunks.175.mjs:2806 | function |
| ZF6 | executeInstructionsLoadedHooks | chunks.175.mjs:2814 | function |
| EM6 | getGlobalHooks | chunks.50.mjs:2389 | function |
| Xp | getRegisteredHooks | chunks.1.mjs:2991 | function |

### Skill-Compact Integration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Tqq | getInvokedSkillsAttachment | chunks.147.mjs:1896 | function (creates invoked_skills attachment) |
| Uw6 | registerInvokedSkill | chunks.1.mjs:3037 | function (records skill invocation in session state) |
| St6 | getInvokedSkillsForAgent | chunks.1.mjs:3052 | function (gets invoked skills by agentId) |
| zA6 | clearInvokedSkillsForAgent | chunks.1.mjs:3069 | function |
| iu1 | clearInvokedSkillsForAgents | chunks.1.mjs:3060 | function |
| Aiq | getAllInvokedSkills | chunks.1.mjs:3048 | function |

### Plugin Skills

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Uu4 | isPluginFirstParty | chunks.132.mjs:764 | function |
| NT | FIRST_PARTY_REPOSITORIES | chunks.15.mjs:227 | constant (Set) |
| TU7 | loadCommandsFromDir | chunks.87.mjs:1856 | function |

### Built-in Prompt Skills (Registration)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| rw | registerPromptSkill | chunks.165.mjs:2546 | function |
| DRq | registerAllBundledSkills | chunks.184.mjs:710 | function (master registration) |
| uyq | registerUpdateConfigSkill | chunks.181.mjs:228 | function (NEW v2.1.76) |
| Fyq | registerKeybindingsHelpSkill | chunks.181.mjs:721 | function |
| Qyq | registerDebugSkill | chunks.181.mjs:1090 | function |
| dyq | registerStuckSkill | chunks.181.mjs:1583 | function (NEW v2.1.76) |
| nyq | registerReviewCommand | chunks.160.mjs:1317 | function |
| oyq | registerPrCommentsCommand | chunks.160.mjs:1317 | function |
| syq | registerSecurityReviewCommand | chunks.162.mjs:1814 | function |
| eyq | registerSimplifySkill | chunks.181.mjs:1379 | function (NEW v2.1.76) |
| YLq | registerBatchSkill | chunks.181.mjs:1526 | function (NEW v2.1.76) |
| gJz | registerLoopSkill | chunks.181.mjs:1640 | function (NEW v2.1.71) |
| PMz | registerClaudeApiSkill | chunks.184.mjs:674 | function (NEW v2.1.76) |

### Builtin Prompt Command Factory

> Deep analysis: [09_slash_command/review.md](../09_slash_command/review.md)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bZ1 | builtinPromptCommandFactory | chunks.160.mjs:1289 | function |
| NN6 | reviewCommandDefinition | chunks.161.mjs:2580 | object |
| HuA | registerReviewCommand | chunks.161.mjs:2577 | function |
| m5q | prCommentsCommandDefinition | chunks.160.mjs:1319 | object |
| F5q | registerPrCommentsCommand | chunks.160.mjs:1317 | function |
| wzq | securityReviewCommandDefinition | chunks.162.mjs:1819 | object |
| Hzq | registerSecurityReviewCommand | chunks.162.mjs:1814 | function |

### Skill Constants & Configuration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| r94 | SKILL_LISTING_RATIO | chunks.90.mjs:2720 | constant (0.02) |
| o94 | SKILL_MIN_DESCRIPTION | chunks.90.mjs:2722 | constant (4) |
| a94 | SKILL_MAX_BUDGET | chunks.90.mjs:2724 | constant (16000) |
| WB9 | MIN_TRUNCATE_LENGTH | chunks.90.mjs:2726 | constant (20) |
| no6 | DEFAULT_LOOP_INTERVAL | chunks.181.mjs:1662 | constant ("10m") |

---

## Module: Loop/Cron System

> Full analysis: [36_loop_cron/](../36_loop_cron/), [08_subagent/slash_command_integration.md](../08_subagent/slash_command_integration.md)
> **NEW in 2.1.71** - Recurring task scheduling via /loop command and Cron tools

### Cron Tool Names & Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ER | TOOL_NAME_CRON_CREATE | chunks.91.mjs:192 | constant ("CronCreate") |
| ed | TOOL_NAME_CRON_DELETE | chunks.91.mjs:194 | constant ("CronDelete") |
| SW6 | TOOL_NAME_CRON_LIST | chunks.91.mjs:196 | constant ("CronList") |
| - | CLAUDE_CODE_DISABLE_CRON | process.env | environment variable |

### Cron Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| - | CronCreateTool | chunks.139.mjs | tool object |
| - | CronDeleteTool | chunks.139.mjs | tool object |
| - | CronListTool | chunks.139.mjs | tool object |
| - | cronJobRegistry | chunks.89.mjs | variable (Map: id → cronJob) |
| - | createCronJob | chunks.89.mjs | function |
| - | deleteCronJob | chunks.89.mjs | function |
| - | listCronJobs | chunks.89.mjs | function |

### Loop Command

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| - | loopCommandDefinition | chunks.163.mjs | object (slash command definition) |
| - | parseLoopInterval | chunks.163.mjs | function (parses "5m", "1h" → ms) |
| - | loopCommandHandler | chunks.163.mjs | function |

### Integration with Team Tools

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| WY4 | TEAM_DELEGATE_TOOLS | chunks.91.mjs:269 | Set (includes CronCreate/Delete/List) |

---

## Module: Thinking Mode

> Full analysis: [03_llm_core/thinking_mode_integration.md](../03_llm_core/thinking_mode_integration.md), [19_think_level/](../19_think_level/)

### Thinking Capability Detection

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| QG7 | supportsThinking | chunks.56.mjs:1348 | function (checks if model supports thinking) |
| I21 | supportsAdaptiveThinking | chunks.56.mjs:1355 | function (checks if model supports adaptive thinking) |
| Bvq | supportsInterleavedThinking | chunks.176.mjs:1594 | function (checks interleaved thinking beta support) |

### Thinking Budget Configuration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| FGq | getDefaultThinkingBudget | chunks.176.mjs:1549 | function (default budget based on model) |
| oa | getThinkingBudgetLimits | chunks.176.mjs:1533 | function (returns min/max budget) |

### Thinking Mode State

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| K | thinkingConfig | multiple | parameter (thinking configuration object) |
| gG7 | buildContextManagementConfig | chunks.56.mjs:1291 | function (builds context_management for thinking) |

### Budget Constants

| Model Family | Default Budget | Max Budget |
|-------------|---------------|------------|
| Opus 4.5/4.6, Sonnet 4.x, Haiku 4.x | 32,000 | 64,000 |
| Opus 4.0/4.1 | 32,000 | 32,000 |
| Claude 3 Opus | 4,096 | 4,096 |
| Claude 3 Sonnet/Haiku | 8,192 | 8,192 |
| Claude 3.7 Sonnet | 32,000 | 64,000 |

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
| XhA | createUserInterruptMessage | chunks.149.mjs:1737-1751 | function |
| FG1 | createCleanupMessage | chunks.149.mjs | function |
| i4K | setupAbortTimeout | chunks.6.mjs | function |
| n4K | DEFAULT_TIMEOUT | chunks.6.mjs | constant |
| YK | resetLoadingState | chunks.188.mjs:218-221 | function |
| I6 | isQueryRunningRef | chunks.188.mjs:196 | ref (useRef<boolean>) |

### UI Layer - Cancel Handler Component

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ngA | cancelHandlerComponent | chunks.185.mjs:2137-2175 | function (React component) |
| Z | handleCancelPress | chunks.185.mjs:2151-2167 | function (closure inside ngA) |

### Prompt Queue System

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| lB | enqueueCommand | chunks.89.mjs:415-420 | function |
| KY | isPromptQueueingEnabled | chunks.89.mjs:879-881 | function (always returns false) |
| Kd7 | cancelRunningAgentTasks | chunks.89.mjs:1388-1391 | function (dead code via KY) |
| GjA | clearLegacyQueue | chunks.89.mjs:407-409 | function |
| WR | enqueueToLegacyQueue | chunks.89.mjs:411-413 | function |
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
| iA | executeQueuedInput | chunks.188.mjs:894-925 | function (useCallback) |
| rc | popCommandFromQueue | chunks.188.mjs:341-353 | function (useCallback) |
| wD | lastQueryCompletionTime | chunks.188.mjs:194 | state variable |
| LP | setLastQueryCompletionTime | chunks.188.mjs:194 | state setter |

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

### Core Orchestration

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _uY | assembleAllAttachments | chunks.147.mjs:3-18 | function |
| Hz | timedAttachmentProducer | chunks.147.mjs:20-46 | function |

### Configuration Constants

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| t4q | PLAN_MODE_CONFIG | chunks.147.mjs:1231-1235 | constant |
| e4q | AUTO_MODE_CONFIG | chunks.147.mjs:1236-1240 | constant |
| IE1 | TODO_REMINDER_CONFIG | chunks.147.mjs:1226-1230 | constant |
| YuY | ULTRAMEMORY_CONFIG | chunks.147.mjs:1241-1243 | constant |
| wuY | QUEUED_COMMAND_MODES | chunks.147.mjs:1245 | constant (Set) |

### Attachment Producers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| DuY | getPlanModeAttachment | chunks.147.mjs:136-168 | function |
| XuY | getPlanModeExitAttachment | chunks.147.mjs:170-181 | function |
| ZuY | getAutoModeAttachment | chunks.147.mjs:214-227 | function |
| GuY | getAutoModeExitAttachment | chunks.147.mjs:229-235 | function |
| fuY | getDateChangeAttachment | chunks.147.mjs:237-246 | function |
| TuY | getUltrathinkEffortAttachment | chunks.147.mjs:248-254 | function |
| xE1 | getDeferredToolsDeltaAttachment | chunks.147.mjs:256-267 | function |
| uE1 | getMcpInstructionsDeltaAttachment | chunks.147.mjs:269-282 | function |
| vuY | getCriticalSystemReminderAttachment | chunks.147.mjs:284-291 | function |
| NuY | getOutputStyleAttachment | chunks.147.mjs:293-300 | function |
| kuY | getIdeSelectionAttachment | chunks.147.mjs:306-320 | function |
| LuY | getIdeOpenedFileAttachment | chunks.147.mjs:397-405 | function |
| RuY | getAtMentionedFilesAttachment | chunks.147.mjs:407-448 | function |
| huY | getAgentMentionsAttachment | chunks.147.mjs:450-462 | function |
| SuY | getMcpResourcesAttachment | chunks.147.mjs:464-495 | function |
| CuY | getChangedFilesAttachment | chunks.147.mjs:497+ | function |
| OuY | getQueuedCommandsAttachment | chunks.147.mjs:48-68 | function |
| qmY | getTokenUsageAttachment | chunks.147.mjs:1108-1118 | function |
| KmY | getOutputTokenUsageAttachment | chunks.147.mjs:1120-1122 | function |
| YmY | getBudgetUsdAttachment | chunks.147.mjs:1124-1134 | function |

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
| phY | assembleAttachments | chunks.142.mjs:1948 | function |
| oP1 | attachmentMessageGenerator | chunks.142.mjs:2494 | function (async generator) |
| kq | convertAttachmentToMessage | chunks.142.mjs:2615 | function |
| dzz | reorderAttachments | chunks.172.mjs:3244 | function |
| bG1 | buildContextMessages | chunks.148.mjs:2414 | function |

### Message Normalization

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Ui8 | normalizeAttachmentForAPI | chunks.174.mjs:1-469 | function |
| WJ | normalizeMessages | chunks.173.mjs:89 | function |
| hMA | extractSystemReminderContent | chunks.90.mjs:517 | function |
| EL9 | SYSTEM_REMINDER_REGEX | chunks.90.mjs:730 | constant (regex) |
| Wzz | planModeReminderDispatcher | chunks.173.mjs:2525-2530 | function |
| Nzz | fullPlanReminder | chunks.173.mjs:2556-2690 | function |
| Ezz | sparsePlanReminder | chunks.173.mjs:2692-2699 | function |
| yzz | subAgentPlanReminder | chunks.173.mjs:2701-2712 | function |
| Zzz | ultraplanCompleteReminder | chunks.173.mjs:2532-2538 | function |
| Lzz | autoModeReminder | chunks.173.mjs:2714-2717 | function |
| Rzz | fullAutoModeReminder | chunks.173.mjs:2719-2732 | function |
| hzz | sparseAutoModeReminder | chunks.173.mjs:2734-2739 | function |
| af | wrapInXmlTag | chunks.173.mjs:2490-2494 | function |
| b5 | wrapWithSystemReminderTags | chunks.173.mjs:2496-2523 | function |

### Synthetic Message Creation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| nr6 | createToolCallMessage | chunks.174.mjs:490-495 | function |
| ir6 | createToolResultMessage | chunks.174.mjs:471-488 | function |
| p1 | createUserMessage | chunks.173.mjs:1378-1412 | function |

### File Attachment Producers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| TyA | buildFileAttachmentForMention | chunks.142.mjs:2524 | function |
| KIY | extractAtMentionedFiles | chunks.142.mjs:2199 | function |
| wIY | getChangedFilesAttachment | chunks.142.mjs:2285 | function |
| i5 | FileReadTool | chunks.88.mjs:2200 | object (tool definition) |

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
| aGz | commanderSetup | chunks.198.mjs:999 | function |
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

### Enable/Disable Logic (chunks.135.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| iz | isFileCheckpointingEnabled | chunks.135.mjs:1977-1980 | function (master guard: interactive=opt-out; SDK=opt-in) |
| YVY | isSDKCheckpointingEnabled | chunks.135.mjs:1982-1984 | function (SDK mode: requires CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING=true) |

### File History Core (chunks.135.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| R66 | trackFileEdit | chunks.135.mjs:1986-2014 | async function (record file pre-edit backup; first-edit-only pattern) |
| lf6 | createSnapshotForMessage | chunks.135.mjs:2016-2073 | async function (finalize snapshot for all tracked files at message end) |
| sN1 | rewindHandler | chunks.135.mjs:2075-2100 | async function (execute rewind to target message snapshot) |
| tN1 | snapshotExistsForMessage | chunks.135.mjs:2102-2105 | function (check if snapshot exists for messageId) |
| eN1 | getDryRunDiffStats | chunks.135.mjs:2107-2112 | function (run rewindAndRestoreFiles with dryRun=true, return diff stats) |
| Wn4 | hasChangesToRestore | chunks.135.mjs:2114-2133 | function (check if any files differ from snapshot) |
| Zn4 | rewindAndRestoreFiles | chunks.135.mjs:2135-2169 | function (restore tracked files from snapshot; supports dry-run) |
| cu8 | fileNeedsRestore | chunks.135.mjs:2171-2201 | function (multi-tier comparison: existence, mode, size, mtime, content) |
| Mn4 | calculateFileDiffStats | chunks.135.mjs:2203-2233 | function (compute +/- line counts for dry-run preview using Myers diff) |
| zVY | generateBackupFileName | chunks.135.mjs:2238-2240 | function (SHA256 hash of path + @v{version}; e.g. `a1b2c3d4e5f6a7b8@v2`) |
| zz6 | resolveBackupPath | chunks.135.mjs:2242-2245 | function (build full path to backup file in ~/.claude/file-history/{sessionId}/) |
| du8 | createBackupFile | chunks.135.mjs:2247-2273 | function (write versioned backup copy to ~/.claude/file-history/) |
| _VY | restoreFileFromBackup | chunks.135.mjs:2275-2293 | function (copy backup content back to original file path) |
| Gn4 | findBackupInOlderSnapshot | chunks.135.mjs:2295-2301 | function (fallback: find version-1 backup in earliest snapshot) |
| fn4 | normalizeFilePath | chunks.135.mjs:2303-2308 | function (normalize file path for use as snapshot key) |
| AV1 | resolveTrackedFilePath | chunks.135.mjs:2310-2313 | function (resolve normalized path to absolute via cwd) |
| Dn4 | getDirectoryPath | (inferred from Node.js path.dirname) | function (extract directory from file path) |
| Pn4 | setFilePermissions | (inferred from Node.js fs.chmodSync) | function (apply file permissions/mode to restored file) |
| Tn4 | debugLogState | chunks.135.mjs:2419-2421 | function (log state for debugging; no-op in production) |
| Jn4 | MAX_SNAPSHOTS | chunks.135.mjs:2423 | constant (= 100; max snapshots retained in memory) |
| OVY | DEBUG_FILE_HISTORY | chunks.135.mjs:2425 | constant (= false; enables verbose debug logging for file history) |

### Snapshot Helpers (chunks.135.mjs, chunks.1.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| rw6 | deepCopySnapshot | chunks.1.mjs:3865 | function (lodash cloneDeep wrapper for immutable snapshot copies) |
| wVY | checkForHistoryChanges | chunks.135.mjs:2391-2417 | function (compare old/new snapshot state for debugging; no-op in prod) |
| L66 | reportFileHistoryChange | chunks.135.mjs:1928-1930 | function (no-op placeholder for potential history change notifications) |

### Persistence (chunks.135.mjs, chunks.174.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| qV1 | hydrateFileHistoryFromSnapshots | chunks.135.mjs:2315-2335 | function (reconstruct FileHistory React state from JSONL snapshots) |
| KV1 | migrateFileHistoryToNewSession | chunks.135.mjs:2337-2400 | async function (on --resume: hard-link/copy backup files to new session dir) |
| _l6 | recordFileHistorySnapshot | chunks.174.mjs:1683-1685 | async function (write file-history-snapshot entry to session .jsonl via SessionDatabase) |
| Jz | getSessionDatabase | chunks.174.mjs:1406-1600 | function (SessionDatabase singleton for persistence operations) |

### UI Component (chunks.185.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| zs8 | RewindMessageSelector | chunks.185.mjs:1179-1469 | function (React component: message list + restore options UI) |
| g | generateRestoreOptions | chunks.185.mjs:1207-1235 | function (build restore option list; conditional on hasCodeChanges) |
| b | handleMessageSelection | chunks.185.mjs:1248-1268 | async function (process message selection, show options or fast-path restore) |
| p | handleRestoreOptionSelected | chunks.185.mjs:1269-1320 | async function (dispatch restore/summarize based on selected option) |
| YI1 | isOnlyOneMessageAfterIndex | chunks.185.mjs:1704-1724 | function (check if only trivial messages exist after index; enables fast-path restore) |
| KXz | getMessagesDiffStats | chunks.185.mjs:1659-1690 | function (compute diff stats for files changed between two messages) |
| XV6 | shouldShowMessageInChat | chunks.185.mjs:1692-1702 | function (visibility filter for chat display; also used for rewind message selection) |
| Ys8 | VISIBLE_MESSAGE_COUNT | chunks.185.mjs:1730 | constant (= 7; messages visible per page; scroll window centers on selected) |

### Slash Command (chunks.165.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _Az | rewindCommandDefinition | chunks.165.mjs:699-710 | object (name: "rewind", aliases: ["checkpoint"]) |
| QXq | rewindCommandExport | chunks.165.mjs:710 | variable (alias for _Az, exported name) |
| pXq | rewindCommandModule | chunks.165.mjs:685 | object (module container for command) |
| zAz | rewindCommandHandler | chunks.165.mjs:687-691 | async function (calls openMessageSelector; returns "skip" type) |

### Summarization Pipeline (chunks.147.mjs, chunks.174.mjs, chunks.89.mjs) — Shared with /compact

> These functions implement the summarize functionality, shared between `/rewind → Summarize from here` and `/compact`.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Wqq | performPartialCompaction | chunks.147.mjs:1610-1707 | async function (main entry for "Summarize from here"; returns boundaryMarker + summaryMessages + attachments) |
| Gqq | generateSummaryWithLLM | chunks.147.mjs:1752+ | async function (LLM call for summarization) |
| Ri6 | createCompactBoundary | chunks.174.mjs:580-599 | function (create compact_boundary system message with metadata) |
| Yp8 | attachPreservedSegment | chunks.147.mjs:1449-1463 | function (add preservedSegment to compact_boundary for message relinking) |
| S54 | formatCompactPrompt | chunks.89.mjs:443-452 | function (build summarization prompt with optional user context) |
| sF6 | formatSummaryContent | chunks.89.mjs:479-492 | function (format summary text with transcript link) |
| BE1 | extractTextContent | chunks.173.mjs:2364-2369 | function (extract text from assistant message content blocks) |
| Cz | getSessionTranscriptPath | chunks.174.mjs:1128-1131 | function (get path to session .jsonl transcript file) |
| eW | countTokensFromMessages | chunks.84.mjs:1146-1168 | function (calculate token count from message array) |
| sT6 | runPreCompactHooks | chunks.175.mjs:2682-2711 | async function (execute PreCompact hooks before summarization) |
| FE1 | runPostCompactHooks | chunks.175.mjs:2713-2732 | async function (execute PostCompact hooks after summarization) |
| na | computeDiff | chunks.56.mjs:2072-2074 | function (Myers diff algorithm - from diff library) |

### Message Filtering Helpers (chunks.185.mjs, chunks.173.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| Hz6 | isCompactSummaryMessage | chunks.173.mjs:1275-1277 | function (check if message is compact summary text) |
| wl6 | isToolResultMessage | chunks.173.mjs:1587-1589 | function (check if message has toolUseResult) |
| Yhq | isTextBlock | chunks.185.mjs:1175-1177 | function (check if content block is text type) |

### Internal XML Tag Constants (chunks.14.mjs) — Used by isSelectableMessage

> These constants define internal XML tags that mark messages as non-visible in chat.
> Messages containing these tags are filtered out by `XV6` (shouldShowMessageInChat).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| WP | LOCAL_COMMAND_STDOUT | chunks.14.mjs:631 | constant ("local-command-stdout") |
| oA6 | LOCAL_COMMAND_STDERR | chunks.14.mjs:633 | constant ("local-command-stderr") |
| rHA | BASH_STDOUT | chunks.14.mjs:627 | constant ("bash-stdout") |
| oHA | BASH_STDERR | chunks.14.mjs:629 | constant ("bash-stderr") |
| EH | TASK_NOTIFICATION | chunks.14.mjs:641 | constant ("task-notification") |
| vV | TICK | chunks.14.mjs:639 | constant ("tick") |
| fj | TEAMMATE_MESSAGE | chunks.14.mjs:663 | constant ("teammate-message") |

### Compact Boundary Helpers (chunks.174.mjs) — Used for compaction markers

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| RZ | isCompactBoundary | chunks.174.mjs:616-618 | function (check if message is compact_boundary system message) |
| Szz | findLastCompactBoundaryIndex | chunks.174.mjs:620-625 | function (find last compact_boundary in message array, returns -1 if none) |
| fN | sliceFromLastCompactBoundary | chunks.174.mjs:628-632 | function (slice messages from last compact_boundary to end) |

### API Handler (chunks.187.mjs)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| thq | handleRewindRequest | chunks.187.mjs:1271-1303 | async function (API endpoint for SDK/CLI rewind requests; checks checkpointing enabled, validates snapshot exists, optionally returns diff stats or executes restore) |
