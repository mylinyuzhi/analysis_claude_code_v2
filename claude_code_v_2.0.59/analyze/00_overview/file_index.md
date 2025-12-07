# File Index

> 按文件组织的内容索引。回答 "chunks.XX.mjs 里有什么？"
> 函数名使用可读名格式: `readableName (obfuscated)`

---

## Overview

- **Total chunk files**: 80 files
- **Total lines of code**: ~241,704 lines
- **Average file size**: ~3,000 lines / ~95KB per file

---

## Core Entry & CLI

### chunks.158.mjs - Main Entry Point (~900 lines)

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 1-50 | CLI entry point | mainEntry (mu3) |
| 51-150 | Command handler, pre-action hook | commandHandler (hu3) |
| 200-300 | Configuration and database init | initializeConfig (FU9) |
| 300-400 | Database migrations | runMigrations (ju3) |
| 400-500 | Start interactive React app | renderInteractive (VG) |
| 500-600 | Print mode execution | runNonInteractive (Rw9) |
| 600-900 | Main React component | MainInteractiveApp (WVA) |
| 500-700 | Application state object | appState (f0) |

### chunks.155.mjs - CLI Parsing (~500 lines)

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 1-500 | Commander.js setup | CLI argument parsing |

---

## LLM API & Streaming

### chunks.153.mjs - LLM API Calling (~3000 lines)

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 3-361 | Async generator for streaming API | streamApiCall ($E9) |
| 100-200 | Request payload building | buildRequestPayload (U) |
| 200-300 | Stream event processing | Event handlers |
| 300-361 | Error handling, fallback | Error recovery |
| 2179-2204 | Meta message creation | createMetaBlock (R0) |
| 2850-2854 | XML tag wrapper | wrapSystemReminderText (Qu) |
| 2856-2883 | Array message wrapper | wrapInSystemReminder (NG) |
| 2885-2977 | Plan mode instructions | generatePlanModeInstructions (jb3, Sb3, _b3) |

### chunks.121.mjs - Retry & Commands (~2100 lines)

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 1-500 | Slash command parsing | Command handlers |
| 1988-2046 | Retry with exponential backoff | retryWrapper (t61) |

---

## System Prompts & Reminders

### chunks.107.mjs - System Prompts & Attachments (~2200 lines)

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 1-200 | System prompt templates | getCoreSystemPrompt (gCB) |
| 50-100 | Session identity selection | getSessionTypeIdentity (rnA) |
| 100-200 | MCP CLI instructions | getMCPToolsPrompt (HE9) |
| 200-400 | Prompt helper functions | Various |
| 400-536 | Session prompts | Various |
| 537-733 | Summarization prompt template | getSummarizationPrompt (R91) |
| 733-1000 | Context injection | Various |
| 1000-1500 | CLAUDE.md processing | Various |
| 1500-1800 | IDE integration | Various |
| 1813-1829 | Main attachment orchestrator | generateAllAttachments (JH5) |
| 1832-1856 | Attachment error wrapper | wrapWithErrorHandling (aY) |
| 1860-1920 | File change detection | generateChangedFiles (wH5) |
| 1920-1960 | Nested memory attachment | generateNestedMemory (qH5) |
| 1960-2000 | CLAUDE.md processing | generateUltraClaudeMd (DH5) |
| 2000-2050 | Plan mode context | generatePlanMode (VH5) |
| 2050-2100 | Todo list reminders | generateTodoReminders (_H5) |
| 2100-2150 | Async messages | generateTeammateMailbox (vH5) |
| 2358-2377 | Todo turn counter | countTurnsSinceTodoWrite (SH5) |
| 2349 | Attachment wrapper | createAttachment (l9) |
| 2610-2613 | Todo reminder constants | todoReminderConstants (GY2) |

### chunks.152.mjs - Core Prompts (~500 lines)

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 1-100 | Main system prompt | getCoreSystemPrompt (gCB) |
| 100-500 | Core system instructions | Various |

### chunks.154.mjs - Message Processing (~2500 lines)

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 3-321 | Attachment to message conversion | convertAttachmentToSystemMessage (kb3) |
| 324-341 | Tool result simulation | createToolResultMessage (_SA) |
| 343-348 | Tool use simulation | createToolUseMessage (kSA) |
| 350-364 | Informational message | createInformationalMessage ($y) |
| 383-393 | Local command message | createLocalCommandMessage (z60) |
| 395-402 | Compaction boundary marker | createCompactBoundaryMessage (S91) |
| 2153 | Safe file write | atomicWriteFile (L_) |

---

## Tool System

### chunks.19.mjs - Tool Constants (~2300 lines)

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 307-324 | Watcher initialization | initializeWatcher (k64) |
| 326-329 | Watcher disposal | disposeWatcher (dd0) |
| 331-335 | Change subscription | subscribeToChanges (y64) |
| 428 | WebFetch constant | WEBFETCH_TOOL_NAME ($X) |
| 449 | Edit constant | EDIT_TOOL_NAME ($5) |
| 499 | Read constant | READ_TOOL_NAME (d5) |
| 2147 | Glob constant | GLOB_TOOL_NAME (iK) |
| 2172 | Grep constant | GREP_TOOL_NAME (xY) |
| 2176 | Write constant | WRITE_TOOL_NAME (wX) |
| 2192 | NotebookEdit constant | NOTEBOOKEDIT_TOOL_NAME (JS) |
| 2232 | WebSearch constant | WEBSEARCH_TOOL_NAME (WS) |

### chunks.16.mjs - Bash Tool Constants (~1400 lines)

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 199-247 | File content LRU cache | FileContentCache (Kh0) |
| 889 | Checkbox icons | figuresIcons (H1) |
| 1367 | Bash tool constant | BASH_TOOL_NAME (C9) |

### chunks.106.mjs - Bash Tool Implementation (~2000 lines)

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 775-850 | Command execution, timeout, background | Bash call() method |
| 1847-1851 | Todos directory path | getTodosDirectory (x00) |
| 1853-1856 | Todo file path | getTodoFilePath (Ri) |
| 1858-1860 | Read todos | readTodosFromFile (Nh) |
| 1862-1864 | Write todos | writeTodosToFile (UYA) |

### chunks.88.mjs - Read Tool (~1500 lines)

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 3-105 | API client creation | createApiClient (Kq) |
| 1086-1091 | Malware warning constant | MALWARE_WARNING_REMINDER (tA5) |
| 1258-1400 | Multi-type file reading | Read call() method |

### chunks.122.mjs - Write Tool & Hooks (~3500 lines)

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 1-100 | Hook type definitions | Hook schema |
| 3371-3450 | File creation with validation | Write call() method |

### chunks.123.mjs - Edit Tool (~500 lines)

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 1-300 | String replacement with validation | Edit call() method |

### chunks.125.mjs - Glob, Grep & Agents (~1500 lines)

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 100-400 | Tool interface helpers | Various |
| 400-529 | Glob tool | Glob implementation |
| 529-812 | Ripgrep wrapper with modes | Grep implementation |
| 812-886 | Tool dispatching | Various |
| 886-950 | Pattern matching via fast-glob | Glob call() method |
| 988-1057 | Task tool description | taskToolDescription (ob2) |
| 1057-1100 | Tool filtering | filterToolsForAgent (w70) |
| 1100-1150 | Agent tools resolution | resolveAgentTools (Sn) |
| 1178-1223 | Agent entry message | agentEntryMessage (Af2) |
| 1243-1267 | General-purpose agent | generalPurposeAgent (o51) |
| 1272-1360 | Statusline setup agent | statuslineSetupAgent (Gf2) |
| 1366-1413 | Explore agent | exploreAgent (xq) |
| 1420-1484 | Plan agent | planAgent (kWA) |
| 1489-1493 | Built-in agent list | getBuiltInAgents (N70) |

---

## Todo List System

### chunks.60.mjs - TodoWrite Tool & Guide Agent (~1300 lines)

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 1-500 | Debounce utilities | Various |
| 500-783 | Todo state management | Various |
| 783-897 | Claude-code-guide agent | claudeCodeGuideAgent (iCB) |
| 897-1000 | Guide system prompt | Various |
| 901 | Todo description | todoWriteDescription (aCB) |
| 903-1086 | Todo usage guidelines | todoWritePrompt (nCB) |
| 1097 | Status enum | TodoStatusEnum (IJ6) |
| 1097-1101 | Item schema | TodoItemSchema (YJ6) |
| 1124 | Tool name constant | TODOWRITE_TOOL_NAME (QEB) |
| 1136-1140 | Input/output schemas | TodoWriteInputSchema (JJ6), TodoWriteOutputSchema (WJ6) |
| 1141-1211 | TodoWrite tool object | TodoWriteTool (BY) |

### chunks.118.mjs - Todo UI Components (~1500 lines)

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 1036-1064 | Checkbox list with status styling | TodoListComponent (Yn) |
| 1317-1460 | Spinner with activeForm display | SpinnerWithTodos (OO2) |

---

## Hooks System

### chunks.147.mjs - Hook Execution (~600 lines)

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 1-100 | Hook types, constants | ZN (DEFAULT_TIMEOUT) |
| 100-200 | Command hook execution | executeCommandHook (Oy3) |
| 200-300 | Prompt hook execution | executePromptHook (Iy3) |
| 300-400 | Agent hook execution | executeAgentHook (By3) |
| 400-500 | Callback hook execution | executeCallbackHook (Qy3) |
| 500-600 | Function hook execution | executeFunctionHook (Ay3) |

---

## Skill & Plugin System

### chunks.94.mjs - Skill System (~400 lines)

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 100-200 | Load skill from file | loadSkillFile (b69) |
| 200-300 | Load from directories | loadSkillCommands (VK0) |
| 300-400 | Combine all skills | aggregateSkills (Sv3) |

### chunks.95.mjs - Plugin Schema

| Lines | Content | Key Functions |
|-------|---------|---------------|
| - | Manifest validation | Plugin schema |

---

## MCP Protocol

### chunks.131.mjs - MCP Client (~500 lines)

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 100-200 | Connect to MCP server | connectMcpServer (D1A) |
| 200-300 | Execute MCP tool | callMcpTool (y32) |
| 300-400 | Handle MCP result | processMcpResult (b10) |
| 400-500 | Connect multiple servers | batchConnect (v10) |

---

## Code Indexing

### chunks.89.mjs - Tree-sitter WASM Runtime (~600 lines)

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 50-80 | Node to WASM memory | marshalNode |
| 80-110 | WASM to Node | unmarshalNode |
| 100-200 | Parser wrapper | Parser class |
| 200-300 | Language definition | Language class |
| 300-400 | Parsed AST | Tree class |
| 400-500 | AST traversal | TreeCursor class |
| 500-600 | AST node | Node class |

### chunks.90.mjs - Bash Command Parsing (~2000 lines)

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 465-498 | Load tree-sitter WASM | loadTreeSitterWasm (Q05) |
| 500-503 | Lazy init guard | ensureTreeSitterLoaded (jA2) |
| 505-523 | Core parsing | parseCommand (B05) |
| 525-539 | Find command node | findCommandNode (SA2) |
| 541-550 | Extract env vars | extractEnvVars (G05) |
| 552-569 | Extract args | extractCommandArgs (Z05) |
| 600-637 | Fallback parser | FallbackCommandParser (_A2) |
| 646-724 | Tree-sitter parser factory | createTreeSitterCommandParser (Y05) |
| 724-737 | Parser facade | shellParserFacade (N01) |
| 739-797 | Pipe permission check | checkPipePermissions (J05) |
| 804-829 | Pipe analysis | analyzeCommandWithPipes (yA2) |
| 854-888 | Path permission check | checkPathPermission (xo1) |
| 1935+ | Main permission check | checkBashPermission (no1) |

### chunks.138.mjs - File Index (~2200 lines)

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 1954-1962 | Get/create FileIndex singleton | getFileIndex (UO3) |
| 1964-1970 | Extract directory prefixes | extractDirectoryPrefixes (wO3) |
| 1976-1998 | Build index using ripgrep | buildFileIndex (NO3) |
| 2000-2005 | Common prefix finder | commonPrefix (LO3) |
| 2007-2016 | Completion prefix | findCommonCompletionPrefix (y09) |
| 2018-2026 | Create result object | createFileResult (jZ1) |
| 2028-2075 | Search with scoring | searchFileIndex (MO3) |
| 2077-2086 | Async cache refresh | refreshIndexCache (jJ0) |
| 2102-2121 | Autocomplete entry | autocompleteFiles (x09) |

---

## Telemetry & Logging

### chunks.117.mjs - OpenTelemetry (~500 lines)

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 100-200 | Lifecycle markers | telemetryMarker (M9) |
| 200-300 | Event tracking | analyticsEvent (GA) |
| 300-400 | Error logging | errorLog (AA) |

### chunks.138.mjs - Sentry

| Lines | Content | Key Functions |
|-------|---------|---------------|
| - | Error tracking | Sentry integration |

---

## UI Components (React/Ink.js)

### chunks.67.mjs - Ink Reconciler

| Lines | Content | Key Functions |
|-------|---------|---------------|
| - | Custom React reconciler | Ink.js integration |

### chunks.68.mjs - Internal App

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 100-300 | Internal app class | InternalApp (BsA) |

### chunks.142.mjs - Keyboard Handlers

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 2475-2486 | Ctrl+T handler | toggleTodosHandler (F69) |

### chunks.149.mjs - Slash Commands UI

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 2465-2478 | Todos command renderer | TodosCommandComponent (AD9) |
| 2493-2516 | Todos command definition | todosSlashCommand (Cx3) |

---

## Agent Communication

### chunks.145.mjs - Agent Spawning

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 915 | Subagent context factory | createSubAgentContext (BSA) |
| 1-400 | Task tool dispatch | Agent spawning |

### chunks.146.mjs - Tool Definitions

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 885 | Get enabled tools | getEnabledToolNames (DV0) |
| 891 | Get all tools | getToolList (wY1) |
| 989-1003 | CLAUDE.md injection | injectClaudeMdContext (gQA) |

### chunks.139.mjs - Session Logs

| Lines | Content | Key Functions |
|-------|---------|---------------|
| 309 | Extract todos from log | extractTodosFromSessionLog (iO3) |

---

## See Also

- [symbol_index.md](./symbol_index.md) - Symbol mapping table
- [architecture.md](./architecture.md) - System architecture overview
