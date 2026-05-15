# Tool Inventory — v2.1.142

> All 46 tools registered in the v2.1.142 bundle, grouped by category. Offsets are in `cli_inner_pretty.js` and were extracted by the bundle-disassembler into `assets/tools_index.json`.

## Notation

- **Tool name** — primary name (model-facing) from `tool.name`
- **Offset** — byte offset of the registration call in `cli_inner_pretty.js` (decimal). Locate by `assets/tools_index.json` — these are stable per build.
- **Read?** — `isReadOnly()` returns: ✓ = true, ✗ = false, blank = `false` (default)
- **Conc?** — `isConcurrencySafe()` returns: ✓ = true, ✗ = false, blank = `false` (default)
- The `null` columns in `tools_index.json` mean the disassembler couldn't statically determine the return — typically a tool with input-dependent logic (e.g., Bash whose read-only-ness depends on the command). Reported here as blank.

## File tools (5)

| Tool | Offset | Read? | Conc? | One-liner |
|------|-------:|:-----:|:-----:|-----------|
| `Read` | 13365579 | ✓ | ✓ | Read files, images, PDFs, notebooks. Output is a discriminated union over the file kind; `maxResultSizeChars: Infinity` (never persist — would loop). |
| `Write` | 11926981 | | | Create or overwrite a file. Trips `readFileState` invalidation so subsequent Reads see fresh content. |
| `Edit` | 13631520 | | | Modify file contents via string replacement. Tracks `oldString`/`newString` with optional `replace_all`. |
| `NotebookEdit` | 11979501 | | | Edit a Jupyter notebook cell (.ipynb). Operates on `cell_id` + `cell_type` + `edit_mode`. |
| `Glob` | 11332069 | ✓ | ✓ | Find files by name pattern or wildcard. `globLimits.maxResults` capped by ctx. |

## Search tools (1)

| Tool | Offset | Read? | Conc? | One-liner |
|------|-------:|:-----:|:-----:|-----------|
| `Grep` | 11322384 | ✓ | ✓ | Ripgrep-backed content search with regex. User-facing name is "Search". `searchHint`: "search file contents with regex (ripgrep)". |

## Shell tools (2)

| Tool | Offset | Read? | Conc? | One-liner |
|------|-------:|:-----:|:-----:|-----------|
| `Bash` | 13756098 | | | Execute shell commands. `userFacingName` varies ("Bash", "SandboxedBash", "Update", "Updated plan"). Run-in-background option keys to TaskOutput/Stop. |
| `PowerShell` | 13320333 | | | Windows PowerShell execution. `shouldDefer: true` (deferred unless platform is Windows). 7872-byte prompt with extensive Windows-specific guidance. |

## Agent & Subagent (1)

| Tool | Offset | Read? | Conc? | One-liner |
|------|-------:|:-----:|:-----:|-----------|
| `Agent` | 11667636 | ✓ | ✓ | Delegate work to a subagent. Forks or in-processes a child agent with filtered tools and context-replacement state. |

## Plan Mode (2)

| Tool | Offset | Read? | Conc? | One-liner |
|------|-------:|:-----:|:-----:|-----------|
| `EnterPlanMode` | 12605031 | ✓ | ✓ | Switch to plan mode to design an approach before coding. `contextModifier` shifts `permissionContext.mode = 'plan'`. |
| `ExitPlanMode` | 12533671 | ✗ | ✓ | Present plan for approval and start coding (plan mode only). Triggers approval dialog. |

## TodoV2 (4)

| Tool | Offset | Read? | Conc? | One-liner |
|------|-------:|:-----:|:-----:|-----------|
| `TaskCreate` | 12626757 | | ✓ | Create a task in the task list. Returns a `task_id` the model can reference. |
| `TaskGet` | 12629751 | ✓ | ✓ | Retrieve a task by ID. Pure read; doesn't mutate state. |
| `TaskList` | 12642346 | ✓ | ✓ | List all tasks (optionally filtered by status). |
| `TaskUpdate` | 12635219 | | ✓ | Update a task's title/description/status. |

## Legacy Todo (1)

| Tool | Offset | Read? | Conc? | One-liner |
|------|-------:|:-----:|:-----:|-----------|
| `TodoWrite` | 9006037 | | | Manage the session task checklist (legacy v1). Output not rendered in transcript; flows to a separate todo panel via `newMessages`. |

## Background Tasks (2)

| Tool | Offset | Read? | Conc? | One-liner |
|------|-------:|:-----:|:-----:|-----------|
| `TaskOutput` | 12511619 | ✓ | | Read output/logs from a background task. Streams stdout/stderr from a task launched by `Bash` with `run_in_background: true`. |
| `TaskStop` | 12421341 | | ✓ | Kill a running background task by `task_id`. UserFacingName "Stop Task". |

## MCP infrastructure (4)

| Tool | Offset | Read? | Conc? | One-liner |
|------|-------:|:-----:|:-----:|-----------|
| `ListMcpResourcesTool` | 6581385 | ✓ | ✓ | List resources from connected MCP servers. UserFacingName "listMcpResources". |
| `ReadMcpResourceTool` | 12584061 | ✓ | ✓ | Read a specific MCP resource by URI. |
| `WaitForMcpServers` | 8983278 | ✓ | ✗ | Block-wait for specific MCP servers to become connected. Not concurrency-safe (mutates wait registry). |
| `mcp` | 13452257 | | | Catch-all base for MCP tools + spread source. Not directly invokable by the model. See `mcp_integration.md`. |

## Web tools (2)

| Tool | Offset | Read? | Conc? | One-liner |
|------|-------:|:-----:|:-----:|-----------|
| `WebFetch` | 12403130 | ✓ | ✓ | Fetch and extract content from a URL via a small fast model. HTTPS upgrade enforced; cross-host redirects returned, not followed. 15-min response cache. UserFacingName "Fetch". |
| `WebSearch` | 12521076 | ✓ | ✓ | Search the web for current information. UserFacingName "Web Search". |

## Cron / Schedule / Triggers (4)

| Tool | Offset | Read? | Conc? | One-liner |
|------|-------:|:-----:|:-----:|-----------|
| `CronCreate` | 12646929 | | | Schedule a recurring or one-shot prompt. Stores cron job + prompt text in user config. |
| `CronDelete` | 12649606 | | | Cancel a scheduled cron job by ID. |
| `CronList` | 12651409 | ✓ | ✓ | List active cron jobs. |
| `RemoteTrigger` | 12656250 | | ✓ | Manage scheduled remote agent routines. `shouldDefer: true`. |

## Worktrees (2)

| Tool | Offset | Read? | Conc? | One-liner |
|------|-------:|:-----:|:-----:|-----------|
| `EnterWorktree` | 12611750 | | | Create an isolated git worktree and switch into it. UserFacingName branches ("Entering worktree" / "Creating worktree"). |
| `ExitWorktree` | 12618634 | | | Exit a worktree session and return to the original directory. UserFacingName "Cleaning up worktree" / "Exiting worktree". |

## Agent Teams / Swarm (3)

| Tool | Offset | Read? | Conc? | One-liner |
|------|-------:|:-----:|:-----:|-----------|
| `SendMessage` | 12709013 | | | Send messages to agent teammates (swarm protocol). Routes via UDS bridge, tmux-window IPC, or in-process queues. |
| `TeamCreate` | 12685110 | | | Create a multi-agent swarm team. Emits `tengu_team_created`. |
| `TeamDelete` | 12689423 | | | Disband a swarm team and clean up. Emits `tengu_team_deleted`. |

## User Interaction (4)

| Tool | Offset | Read? | Conc? | One-liner |
|------|-------:|:-----:|:-----:|-----------|
| `AskUserQuestion` | 12548084 | ✓ | ✓ | Prompt the user with a multiple-choice question. `requiresUserInteraction: true` — auto-rejected in non-interactive sessions. |
| `PushNotification` | 12674161 | ✓ | ✓ | Send a notification to the user via terminal and optionally mobile (Remote Control). Use sparingly — "annoying notifications accumulate". |
| `SendUserMessage` | 12433400 | ✓ | ✓ | Send a message to the user — primary visible output channel for non-tool-call output. |
| `SendUserFile` | 12668657 | ✓ | ✓ | **NEW v2.1.142.** Deliver files (screenshots, reports, artifacts) to the user as attachments. `status: 'normal'\|'proactive'`. Gated by Kairos feature + `tengu_send_user_file` Statsig. |

## REPL / Sandboxed exec (1)

| Tool | Offset | Read? | Conc? | One-liner |
|------|-------:|:-----:|:-----:|-----------|
| `REPL` | 12492828 | ✗ | ✗ | Execute JavaScript with programmatic tool access. Inner tool calls go through `canUseTool`. Variant via `CLAUDE_REPL_VARIANT` env. `isTransparentWrapper: true`. |

## Discovery / Schema-hydration (2)

| Tool | Offset | Read? | Conc? | One-liner |
|------|-------:|:-----:|:-----:|-----------|
| `ToolSearch` | 12591118 | ✓ | ✓ | Fetch full schema definitions for deferred tools so they can be called. The dispatcher for the entire deferred-tools system. See `deferred_tools.md`. |
| `Skill` | 11741309 | | | Invoke a slash-command skill. Loaded skills' implementations live in markdown files; this tool delegates to the skill harness. |

## Code intelligence (1)

| Tool | Offset | Read? | Conc? | One-liner |
|------|-------:|:-----:|:-----:|-----------|
| `LSP` | 12576814 | ✓ | ✓ | Definitions, references, symbols, hover — wraps the LSP subsystem. `isLsp: true`. Enabled via `ENABLE_LSP_TOOL` env. |

## Sleep / Pacing (1)

| Tool | Offset | Read? | Conc? | One-liner |
|------|-------:|:-----:|:-----:|-----------|
| `ScheduleWakeup` | 12501175 | | | Self-pace next iteration: pick a delay before resuming work or running the next /loop tick. Used by long-loop /loop skills. |

## Onboarding (1)

| Tool | Offset | Read? | Conc? | One-liner |
|------|-------:|:-----:|:-----:|-----------|
| `ShareOnboardingGuide` | 12718725 | ✗ | ✗ | Upload ONBOARDING.md and get a team share link. `shouldDefer: true`. |

## Output shaping (1)

| Tool | Offset | Read? | Conc? | One-liner |
|------|-------:|:-----:|:-----:|-----------|
| `StructuredOutput` | 6484868 | ✓ | ✓ | Return the final response as structured JSON. Called exactly once at end of response — passes `structured_output` field through to the API consumer. |

## Testing / Internal (1)

| Tool | Offset | Read? | Conc? | One-liner |
|------|-------:|:-----:|:-----:|-----------|
| `TestingPermission` | 12540871 | ✓ | ✓ | Test fixture — `checkPermissions` always returns `{behavior: 'ask'}` so test assertions can target dialog rendering. Only registered when `NODE_ENV === 'test'`. |

## Placeholder / Sentinel (1)

| Tool | Offset | Read? | Conc? | One-liner |
|------|-------:|:-----:|:-----:|-----------|
| `eval_registered__${...}` | 12441737 | ✗ | ✗ | Placeholder pattern surfaced by the disassembler from `eval_registered__${...}` calls — not a real callable tool. Bookkeeping artefact. |

## Summary table (alphabetised, one-pager)

| Tool | Category | Offset | Read | Conc | shouldDefer |
|------|----------|-------:|:----:|:----:|:-----------:|
| `Agent` | Agent | 11667636 | ✓ | ✓ | (cond.) |
| `AskUserQuestion` | UI | 12548084 | ✓ | ✓ | |
| `Bash` | Shell | 13756098 | | | |
| `CronCreate` | Cron | 12646929 | | | ✓ |
| `CronDelete` | Cron | 12649606 | | | ✓ |
| `CronList` | Cron | 12651409 | ✓ | ✓ | ✓ |
| `Edit` | File | 13631520 | | | |
| `EnterPlanMode` | Plan | 12605031 | ✓ | ✓ | ✓ |
| `EnterWorktree` | Worktree | 12611750 | | | ✓ |
| `ExitPlanMode` | Plan | 12533671 | ✗ | ✓ | |
| `ExitWorktree` | Worktree | 12618634 | | | ✓ |
| `Glob` | File | 11332069 | ✓ | ✓ | |
| `Grep` | Search | 11322384 | ✓ | ✓ | |
| `LSP` | Intel | 12576814 | ✓ | ✓ | ✓ |
| `ListMcpResourcesTool` | MCP | 6581385 | ✓ | ✓ | ✓ |
| `NotebookEdit` | File | 11979501 | | | |
| `PowerShell` | Shell | 13320333 | | | ✓ |
| `PushNotification` | UI | 12674161 | ✓ | ✓ | |
| `REPL` | Exec | 12492828 | ✗ | ✗ | (ant-only) |
| `Read` | File | 13365579 | ✓ | ✓ | |
| `ReadMcpResourceTool` | MCP | 12584061 | ✓ | ✓ | ✓ |
| `RemoteTrigger` | Cron | 12656250 | | ✓ | ✓ |
| `ScheduleWakeup` | Sleep | 12501175 | | | ✓ |
| `SendMessage` | Team | 12709013 | | | |
| `SendUserFile` | UI | 12668657 | ✓ | ✓ | never |
| `SendUserMessage` | UI | 12433400 | ✓ | ✓ | |
| `ShareOnboardingGuide` | Onboard | 12718725 | ✗ | ✗ | ✓ |
| `Skill` | Discovery | 11741309 | | | (cond.) |
| `StructuredOutput` | Output | 6484868 | ✓ | ✓ | ✓ |
| `TaskCreate` | Todo | 12626757 | | ✓ | |
| `TaskGet` | Todo | 12629751 | ✓ | ✓ | |
| `TaskList` | Todo | 12642346 | ✓ | ✓ | |
| `TaskOutput` | BG | 12511619 | ✓ | | |
| `TaskStop` | BG | 12421341 | | ✓ | |
| `TaskUpdate` | Todo | 12635219 | | ✓ | |
| `TeamCreate` | Team | 12685110 | | | ✓ |
| `TeamDelete` | Team | 12689423 | | | ✓ |
| `TestingPermission` | Test | 12540871 | ✓ | ✓ | ✓ |
| `TodoWrite` | Todo | 9006037 | | | |
| `ToolSearch` | Discovery | 12591118 | ✓ | ✓ | never |
| `WaitForMcpServers` | MCP | 8983278 | ✓ | ✗ | |
| `WebFetch` | Web | 12403130 | ✓ | ✓ | |
| `WebSearch` | Web | 12521076 | ✓ | ✓ | |
| `Write` | File | 11926981 | | | |
| `eval_registered__${...}` | Placeholder | 12441737 | ✗ | ✗ | |
| `mcp` | MCP base | 13452257 | | | |

## Total: 46 registered + dynamic MCP wrappers

The 46 tools above are static. Each connected MCP server contributes additional tools at runtime (typically 5–30 per server), wrapped via the per-(server, tool) factory at `cli_inner_pretty.js:414750`. Names follow `mcp__<server>__<tool>` unless `CLAUDE_AGENT_SDK_MCP_NO_PREFIX` is set.

## Source pointers

- `tools_index.json`: `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/assets/tools_index.json`
- Per-tool markdown: `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/assets/tools/<Name>.md`
- TypeScript reference (v2.1.88): `/lyz/codespace/3rd/claude-code/src/tools/<NameTool>/<NameTool>.ts`
- Bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js` (offsets above)

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - v2.1.142 additions: [symbol_additions_v2_1_142_tools_arch.md](../00_overview/symbol_additions_v2_1_142_tools_arch.md)
