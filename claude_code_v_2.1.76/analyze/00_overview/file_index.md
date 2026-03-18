# File Index (Claude Code 2.1.76)

> Mapping of chunk files to their primary functional content.
> Total Chunks: 198

| File | Primary Module(s) | Key Symbols / Functionality |
|------|-------------------|-----------------------------|
| `chunks.1.mjs` | Global State | `globalState` (`o6`): `hasExitedPlanMode`, `needsPlanModeExitAttachment`, plan mode flags |
| `chunks.14.mjs` | Mode Display | `CQ` (mode name), `Rv1` (mode icon), `cP` (mode color), `Lw8` (isDefaultMode) |
| `chunks.44.mjs` | Sandbox Core | `buildSeatbeltProfile`, `wrapWithMacOSSandbox`, `wrapWithLinuxSandbox`, `SandboxViolationStore` |
| `chunks.45.mjs` | Sandbox Module | `wrapWithSandbox`, `isSandboxingEnabled`, sandbox initialization and cleanup |
| `chunks.46.mjs` | Sandbox Settings | `isSandboxingEnabled` (public), `isManagedDomainsOnlyPolicy`, sandbox config builders |
| `chunks.47.mjs` | Sandbox Init / Model | `initializeSandboxFromSettings`, `selectModelForMode`, `getSystemPrompt`, `calculatePromptHash` |
| `chunks.48.mjs` | Plan Mode Context | `isPlanModeRequired` (`MC1`), `isStructuredTasksEnabled` (`jH`), `TodoWriteTool`, task dependency funcs |
| `chunks.52.mjs` | UI / Theme | TUI color palette definitions; `planMode` color key mapped to 6 teal/cyan values per theme |
| `chunks.53.mjs` | Keybindings Core | `parseKeystroke`, `parseChordString`, `resolveKeystroke`, `KeybindingContext` |
| `chunks.54.mjs` | Keybindings Config | `loadKeybindingsAsync`, `watchKeybindingsFile`, `validateKeybindingsComprehensive` |
| `chunks.72.mjs` | API Retry | `withApiRetry` (`V26`): retry logic with exponential backoff for LLM API calls |
| `chunks.74.mjs` | Tool Registry | `findTool` (`Tv`), `toolMatchesName` (`d39`): tool lookup and matching |
| `chunks.75.mjs` | Model / Thinking | `modelSupportsThinking`, `getInitialThinkingEnabled`, `getSettingsState`, `isOpus46Model` |
| `chunks.76.mjs` | Grep/Glob Tools | `GrepTool` (`tS`), `GlobTool` (`WB`), grep/glob input schemas |
| `chunks.79.mjs` | MCP Core | `McpClient`, `StdioClientTransport`, `LineBuffer`, `createEventSourceParser` |
| `chunks.80.mjs` | MCP Advanced | `SSEClientTransport`, `StreamableHTTPClientTransport`, `RemoteSessionManager` |
| `chunks.87.mjs` | Auto Memory | `MEMORY.md` logic, `getAutoMemoryDirectory`, `buildMemoryPrompt`, `isAutoMemoryEnabled` |
| `chunks.88.mjs` | Plan File / Tasks | Plan file I/O (`pD`, `uW`), task schemas, `getLargeMemoryFiles` |
| `chunks.89.mjs` | Task/Agent Core | Tool name constants, task creation/management, background task execution, tool sets |
| `chunks.90.mjs` | Agent Definitions | Built-in agents: `GENERAL_PURPOSE_AGENT`, `EXPLORE_AGENT`, `PLAN_AGENT`, `BASH_AGENT`, `CLAUDE_CODE_GUIDE_AGENT`; effort funcs |
| `chunks.91.mjs` | Agent Loading | `mergeAgentDefinitions`, `loadAgentDefinitions`, `parseAgentFromJson` |
| `chunks.107.mjs` | UI / Plan | `HX6` RejectedPlanViewer component; tool result routing |
| `chunks.109.mjs` | Telemetry Internal | `logToInternalCollector`, `initInternalTelemetry` |
| `chunks.110.mjs` | Keybindings UI | `KeybindingSetup`, `handleKeyEvent` (chord processing) |
| `chunks.123.mjs` | Agent Teams | `awaitingPlanApproval` task state management; in-process teammate lifecycle |
| `chunks.126.mjs` | Remote Sessions | `sendEventToRemoteSession`, `updateSessionTitle`, `hydrateSessionState` |
| `chunks.129.mjs` | Agent Teams / Plan | `PlanApprovalRequestMessageSchema` (Vx4), `PlanApprovalResponseMessageSchema` (Nx4); split-pane spawn |
| `chunks.130.mjs` | Worktree | Worktree creation/management, sparse checkout, symlink optimization |
| `chunks.131.mjs` | Teams Backend | `TmuxBackend`, `ITermBackend`, `getMailboxPath` (FY6), `validateTeamContext` (OTY), in-process teammate management |
| `chunks.132.mjs` | Mailbox System | `readMailbox` (wl), `writeToMailbox` (x3), `markMessageAsReadByIndex` (Vc6), `markMessagesAsRead` (kc6), idle/permission protocol |
| `chunks.133.mjs` | Subagent Runner | `agentLoopRunner` (qh), `cloneForkContext` (Fx8), `buildAgentSystemPrompt` (vvY), `resolveSkillByName` (NvY), `registerAgentHooks` (r24) |
| `chunks.134.mjs` | In-Process Teammate | `inProcessAgentRunner` (XNY), `pollForNextMessage` (DNY), `claimUnclaimedTask` (Ji4), NotebookEditTool (gd) |
| `chunks.135.mjs` | Teammate Spawn | `spawnTeammate` (qn4), `spawnTeammateDispatcher` (pNY), `spawnSplitPaneTeammate` (BNY), `spawnTmuxTeammate` (gNY), `spawnInProcessTeammate` (FNY) |
| `chunks.136.mjs` | AgentTool | `AgentTool` (QW6), `agentInputSchema` (aVY), `teammateInputSchema` (sVY), `agentOutputSchema` (eVY), worktree isolation, MCP validation |
| `chunks.139.mjs` | Plan Mode / ExitPlanMode | `ExitPlanModeTool` (Nj), `AskUserQuestionTool` (`dW1`), plan approval request send |
| `chunks.140.mjs` | Plan Mode / EnterPlanMode | `EnterPlanModeTool` (`kg1`), `LspTool`, task management tools |
| `chunks.141.mjs` | Task System / Teams | `TaskUpdate`, `TaskList`, `TeamCreateTool`, `SendMessageTool`, plan approval handlers |
| `chunks.142.mjs` | Main Loop / Attachments | Attachment producers, plan mode attachments, task reminder attachments, kill handlers |
| `chunks.143.mjs` | Conversation Chain | `buildConversationChain` (`ld1`): assembles messages for LLM API calls |
| `chunks.144.mjs` | Remote / MCP | SDK MCP transport, WebSocket transport (lower level) |
| `chunks.145.mjs` | Remote / MCP | `initializeSdkMcpClients`, MCP transport (higher level) |
| `chunks.146.mjs` | File Read Tool | `FileReadTool` (`i5`), PDF support, `analyzeConversationMemoryUsage`, read permissions |
| `chunks.149.mjs` | Agent Loop Core | `mainAgentLoop` (`ZR`), `StreamingToolExecutor`, tool execution pipeline, `FAST_MODEL_NAME`, `addDirCommand`, `feedbackCommand` |
| `chunks.150.mjs` | Slash Commands | `clearCommand`, `colorCommand`, `copyCommand` |
| `chunks.151.mjs` | Compact Command | `compactCommand`, `compactCommandHandler`, `buildCompactionContext` |
| `chunks.152.mjs` | Clear/Context UI | `clearCommandHandler`, `clearConversation`, `clearSessionCaches`, `contextCommand` |
| `chunks.153.mjs` | Session Commands | `helpCommand`, `initCommand`, `loginCommand`, `logoutCommand`, Fast Mode config |
| `chunks.154.mjs` | Thinking State | `thinkingEnabled`, `maxThinkingTokens` state keys |
| `chunks.155.mjs` | Memory UI | `memoryEditorModal`, memory management UI components |
| `chunks.156.mjs` | MCP Elicitation | `setupElicitationRequestHandler` (`RV6`), elicitation request/response schemas |
| `chunks.160.mjs` | UI / Message Grouping | `groupToolResults` (`q9q`), `extractToolInfo` (`QbA`), `isToolUseMessage` (`XJq`) |
| `chunks.161.mjs` | UI / MessageList | `MessageList` (`P8z`), `MessageListImpl` (`g91`), full conversation rendering |
| `chunks.162.mjs` | Bash UI | `BashOutputComponent` (`BYq`), bash tool output rendering |
| `chunks.168.mjs` | Client Data | `getClientDataPromptVariant` (`COq`), `extractPromptVariant` |
| `chunks.169.mjs` | LLM Core | `llmRequestGenerator` (`lOq`), `buildSystemPrompt`, `streamingQuery`, `contextCompactor` |
| `chunks.170.mjs` | Bash Tool | Bash tool execution, background bash, `processMcpCliResult` |
| `chunks.172.mjs` | UI Normalization | `normalizeDisplayMessages` (`t9q`), `reorderAttachments` (`dzz`), permission mode setup |
| `chunks.173.mjs` | Message Processing | `normalizeMessages` (`WJ`), `handleStreamEvent`, `loadTranscript`, plan reminder builders |
| `chunks.174.mjs` | File System / Config | `getGlobalConfig`, `updateGlobalConfig`, `getPermissionRules`, `checkPathDenyRule` |
| `chunks.175.mjs` | MCP Hub | `McpHub` (`nXq`), MCP CLI subcommands, tool/resource listing |
| `chunks.176.mjs` | MCP Context | `MCPContext` (`ZQA`), `onChangeAppStateHandler`, `ElicitationDialog`, RemoteSessionManager |
| `chunks.178.mjs` | SDK Transport | `StdioStreamIO` (`Mc1`), `WebSocketTransport` (`Pc1`), `SdkUrlStreamIO` (`FQA`), permission handler |
| `chunks.179.mjs` | SDK / Print Mode | `initializeSession` (`CJz`): processes initialize control request; Print mode agent loop |
| `chunks.181.mjs` | Plan Mode UI | `QuestionForm` (`$Wq`), `SingleQuestionComponent` (`YWq`), `ReviewAnswersScreen` (`wWq`) |
| `chunks.183.mjs` | Mode Cycle / UI | `cycleMode` (`hf1`), `cycleModeWithContext` (`FGq`), footer mode indicator rendering |
| `chunks.184.mjs` | Auto-compact Logic | Auto-compact dispatcher, compaction trigger, circuit breaker (3 attempts) |
| `chunks.185.mjs` | REPL / UI | Mode cycle handler (Shift+Tab), `lastPlanModeUse` tracking, permission dialog handling |
| `chunks.186.mjs` | InboxPoller | Plan approval response processing from mailbox; `mergeMcpClients`, `mergeCommands` |
| `chunks.188.mjs` | REPL Core | `REPL` (`TUA`), `handleSubmit` (`Z$`), `handleStreamedEvent` (`T11`); 9 dialog types |
| `chunks.189.mjs` | CLI / Teams | Swarm CLI args; `streamJsonInputHandler` (`oGz`), `setEntrypoint` (`iGz`) |
| `chunks.190.mjs` | Plan Mode Interview UI | `KIq` — main interview question component with tab/form navigation |
| `chunks.191.mjs` | IDE / Selection UI | `dIq` — IDE selection indicator (lines selected, file path) |
| `chunks.192.mjs` | Agent Teams UI | `qGz` — agent tab component (selected/viewed/idle state display) |
| `chunks.193.mjs` | REPL Main Component | `Efz` — main REPL component orchestrating all session UI and state |
| `chunks.194.mjs` | Tool Permission | `tuq` — async tool permission request handler (worker thread) |
| `chunks.195.mjs` | MCP Notifications | `ZBq` — MCP notification handler (failed/disconnected server UI) |
| `chunks.196.mjs` | Session Orchestrator | `ot8` — main session orchestrator (initializes agent loop, tools, MCP, remote) |
| `chunks.197.mjs` | Wrong Directory UI | `evz` — dialog shown when resuming a session from wrong directory |
| `chunks.198.mjs` | CLI Entry Point | `OVz` — main CLI entry function (Commander setup, all flags, subcommands) |
| `cli.chunks.mjs` | CLI Entry | Root entry point, tool wiring, `bootstrapTelemetry` |

---

## New Chunks (v2.1.76 vs v2.1.38)

The following 8 chunks are new in v2.1.76 (vs 190 in v2.1.38):

| Chunk | Primary Content |
|-------|----------------|
| `chunks.190.mjs` | Plan mode interview question UI component (`KIq`) |
| `chunks.191.mjs` | IDE selection indicator UI (`dIq`) |
| `chunks.192.mjs` | Agent team tab UI (`qGz`) |
| `chunks.193.mjs` | Main REPL component (`Efz`) — expanded with cron, color, loop support |
| `chunks.194.mjs` | Async tool permission request handler (`tuq`) |
| `chunks.195.mjs` | MCP server notification UI (`ZBq`) |
| `chunks.196.mjs` | Session orchestrator (`ot8`) — new entry for expanded session config |
| `chunks.197.mjs` | Wrong-directory resume dialog (`evz`) |
| `chunks.198.mjs` | CLI entry point (`OVz`) — new main function with all v2.1.76 flags |

---

## Documentation Directories

### 20_sdk/ - Agent SDK Documentation

| File | Contents |
|------|----------|
| `overview.md` | SDK architecture overview, SDKRateLimitInfo types, `supportsEffort` field |
| `streaming_protocol.md` | Complete NDJSON message protocol, all message types, schemas |
| `transport_layer.md` | StdioStreamIO, WebSocketTransport, SdkUrlStreamIO internals |
| `ui_linkage.md` | How SDK stream events drive UI state machine |
| `agent_definitions.md` | Built-in agent definitions, `background: true` flag, `model` per-invocation |
| `sdk_tools_integration.md` | Tool execution in SDK mode, permission prompt tool, MCP tool integration |
| `sdk_hooks.md` | SDK hook callback mechanism, hookCallbackIds, createHookCallback method |
| `sdk_session_management.md` | Session persistence, max turns, budget limits, `activeForm` no longer required |

### 36_loop_cron/ - Loop/Cron Documentation

| File | Contents |
|------|----------|
| `README.md` | Module overview: /loop command + CronCreate/Delete/List tools |
| `implementation.md` | /loop command architecture: interval parsing, state management, error handling |
| `cron_tools.md` | CronCreate/CronDelete/CronList tool definitions and schemas |
| `integration.md` | How loop/cron integrates with agent loop, tools, and background agents |
