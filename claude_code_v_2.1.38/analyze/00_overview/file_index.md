# File Index (Claude Code 2.1.38)

> Mapping of chunk files to their primary functional content.
> Total Chunks: 190

| File | Primary Module(s) | Key Symbols / Functionality |
|------|-------------------|-----------------------------|
| `chunks.1.mjs` | Global State | `globalState` (`o6`): `hasExitedPlanMode`, `needsPlanModeExitAttachment`, plan mode flags |
| `chunks.14.mjs` | Mode Display | `CQ` (mode name), `Rv1` (mode icon), `cP` (mode color), `Lw8` (isDefaultMode) |
| `chunks.54.mjs` | Keybindings | `loadKeybindings`, `watchKeybindingsFile` |
| `chunks.87.mjs` | Auto Memory | `MEMORY.md` logic and instructions |
| `chunks.107.mjs` | UI / Plan | `HX6` RejectedPlanViewer component; tool result routing |
| `chunks.110.mjs` | Keybindings UI | `KeybindingSetup`, `handleKeyEvent` (chord processing) |
| `chunks.123.mjs` | Agent Teams | `awaitingPlanApproval` task state management |
| `chunks.126.mjs` | Remote Sessions | `sendEventToRemoteSession`, `updateSessionTitle` |
| `chunks.129.mjs` | Agent Teams / Plan | `PlanApprovalRequestMessageSchema` (Vx4), `PlanApprovalResponseMessageSchema` (Nx4), `$fY`, `OfY` |
| `chunks.131.mjs` | Agent Teams / Plan | `TmuxBackend`, `swarm-view` orchestration; `Au4` (buildPermissionCliArgs); `Ku4.spawn()` (PaneBackendExecutor); `hu4` (initializeInProcessTeammate with planModeRequired); `lVY`/`dVY`/`cVY` (spawn handlers) |
| `chunks.139.mjs` | Plan Mode / ExitPlanMode | `ExitPlanModeTool` (Nj), `Kd4`, `Yd4`, plan approval request send |
| `chunks.140.mjs` | Plan Mode / EnterPlanMode | `EnterPlanModeTool` (kg1), `getPlanDesignAgentCount`, `getPlanExploreAgentCount`, `isPlanModeInterviewPhase` |
| `chunks.141.mjs` | Task System / Teams | `TaskUpdate`, `TaskList`, `TeamCreateTool`, `SendMessageTool`, `AhY` (handlePlanApproval), `qhY` (handlePlanRejection) |
| `chunks.142.mjs` | Main Loop / Attachments | `ihY` (plan_mode attachment generator), `nhY` (plan_mode_exit generator), `SIY` (verify_plan stub), `ii4` constants |
| `chunks.144.mjs` | Remote / MCP | WebSocket Transport (Lower level) |
| `chunks.145.mjs` | Remote / MCP | WebSocket Transport (Higher level) |
| `chunks.149.mjs` | Fast Mode | `ANTHROPIC_SMALL_FAST_MODEL` configuration |
| `chunks.153.mjs` | Fast Mode / UI | Fast mode status display and toggle hints |
| `chunks.169.mjs` | Auto Memory | `auto_memory` feature registration |
| `chunks.173.mjs` | Attachments / Plan | `azz`/`szz`/`ezz`/`A2z`/`q2z` plan reminder builders; `plan_mode`, `plan_mode_reentry`, `plan_mode_exit` attachment processing |
| `chunks.179.mjs` | Fast Mode | Main loop mode switching logic |
| `chunks.183.mjs` | Mode Cycle / UI | `hf1` (getNextMode), `FGq` (mode cycle wrapper), footer mode indicator rendering |
| `chunks.185.mjs` | REPL / UI | Mode cycle handler (Shift+Tab), `lastPlanModeUse` tracking, permission dialog handling |
| `chunks.186.mjs` | InboxPoller | Plan approval response processing from mailbox (teammate inbox poller) |
| `chunks.48.mjs` | Agent Teams / Plan | `MC1` (isPlanModeRequired): reads `planModeRequired` from dynamic context → static context → env var |
| `chunks.52.mjs` | UI / Theme | TUI color palette definitions; `planMode` color key mapped to 6 teal/cyan values per theme |
| `chunks.132.mjs` | Task Tool / Plan | Task tool `call()` handler; `mode="plan"` converts to `plan_mode_required: true` for spawn |
| `chunks.151.mjs` | UI / Suggestions | `EhA` (getPromptSuggestionBlocker): suppresses inline prompt suggestions when `mode === "plan"` |
| `chunks.189.mjs` | CLI / Teams | Swarm CLI arguments (`--teammate-mode`); applies `--plan-mode-required` to dynamic team context |
| `cli.chunks.mjs` | CLI Entry | Root entry point, tool wiring, `bootstrapTelemetry` |
| `chunks.160.mjs` | UI / Message Grouping | `q9q` (groupToolResults): Collapses repeated tool executions; `QbA` (extractToolInfo); `XJq` (isToolUseMessage); `dd1` (isHookAttachment) |
| `chunks.161.mjs` | UI / MessageList | `P8z` (MessageList), `g91` (MessageListImpl), `n9q` (MessageComponent), `f8z` (isNotProgress); full conversation rendering with memoization |
| `chunks.172.mjs` | UI / Display Normalization | `t9q` (normalizeDisplayMessages): Groups tool uses with hooks/results; `dzz` (reorderAttachments); `DJq` (createAssistantMessage); permission mode setup |
| `chunks.173.mjs` | UI / Message Normalization | `WJ` (normalizeMessages): Transforms raw messages for display; `EN` (getVisibleMessagesAfterCompact); `qYq` (shouldShowMessageInChat); `iW1` (handleToolUseStream) |
| `chunks.188.mjs` | UI / REPL Core | `TUA` (REPL): Main session orchestrator; `Z$` (handleSubmit); `f11` (getInputDialogType); `N11` (handleCancel); 9 dialog types; spinner logic (`PG`, `Gw`) |
