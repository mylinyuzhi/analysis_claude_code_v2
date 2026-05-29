# Attachment Catalogue — every reminder type

> Comprehensive catalogue of every `<system-reminder>` emit path in v2.1.142. Indexed by attachment type and grouped by subsystem. For each entry: trigger, rendered text, emit location, why-it-exists rationale.

## Index by subsystem

| Subsystem | Attachment types |
|-----------|------------------|
| **Tools** | `todo_reminder`, `task_reminder`, `edited_text_file`, `deferred_tools_delta`, `agent_listing_delta`, `mcp_instructions_delta`, `mcp_resource`, `verify_plan_reminder` |
| **Modes** | `plan_mode`, `plan_mode_reentry`, `plan_mode_exit`, `auto_mode`, `auto_mode_exit`, `thinking_reminder`, `ultrathink_effort` |
| **Memory** | `relevant_memories`, `memory_update`, `nested_memory` |
| **Hooks** | `hook_success`, `async_hook_response`, `hook_additional_context` (synthesised via `fK`) |
| **IDE** | `selected_lines_in_ide`, `opened_file_in_ide`, `diagnostics`, `lsp_diagnostics` |
| **Background agents** | `task_status` (running/killed/other) |
| **Agent teams** | `team_context`, `teammate_mailbox`, `agent_pending_messages` |
| **Files** | `file` (synthetic Read of dir/image/notebook/pdf), `pdf_reference`, `compact_file_reference` |
| **Skills** | `skill_listing`, `invoked_skills`, `dynamic_skill` |
| **Context** | `date_change`, `queued_command`, `agent_mention`, `at_mentioned_files`, `mcp_resources` |
| **Token economics** | `token_usage`, `output_token_usage`, `budget_usd`, `context_efficiency` (noop), `unified_tasks` |
| **Cross-cutting** | `critical_system_reminder`, `output_style` |
| **Inline strings** | Read-tool empty-file, Read-tool short-file, GitHub rate-limit, side-question prompt, container-restart, brief-mode toggle, ultrareview prompts, stale-memory marker, malware-warning, agent-team shutdown |

## Tools

### `todo_reminder` — TodoWrite nudge

**Trigger**: 10+ turns have passed since the last `TodoWrite` tool_use AND 10+ turns since the last `todo_reminder` was emitted. Tool set must include TodoWrite and NOT include the TaskList tool (which has its own reminder).

**Emit location**: `maybeEmitTodoReminder` (`Vq5`) at `cli_inner_pretty.js:398561-398572`. Counters from `countTurnsSinceTodoEvents` (`Tq5`) at line 398538.

**Renderer**: `cli_inner_pretty.js:425046-425058`

**Text**:

> The TodoWrite tool hasn't been used recently. If you're working on tasks that would benefit from tracking progress, consider using the TodoWrite tool to track progress. Also consider cleaning up the todo list if has become stale and no longer matches what you are working on. Only use it if it's relevant to the current work. This is just a gentle reminder - ignore if not applicable.
>
> Here are the existing contents of your todo list:
>
> `[1. [pending] First todo, 2. [in_progress] Second todo, …]`

**Why exists**: The model otherwise forgets to call TodoWrite on multi-step tasks; the reminder is a nudge, not a directive. Embedding the *current* list lets the model see whether items are stale.

**Thresholds**: `REMINDER_THRESHOLDS` (`aO8`) `= {TURNS_SINCE_WRITE: 10, TURNS_BETWEEN_REMINDERS: 10}` at `cli_inner_pretty.js:398821`. The dual-gate (since-last-write AND since-last-reminder) means a model that ignored a prior reminder still waits a full window before being prodded again.

### `task_reminder` — TaskCreate/TaskUpdate nudge

**Trigger**: Same threshold logic as `todo_reminder`, but for the newer `TaskCreate` (`OX`) / `TaskUpdate` (`P0`) tools. Only emits when TaskList feature is enabled.

**Emit location**: `maybeEmitTaskReminder` (`kq5`) at line 398596. Counters in `countTurnsSinceTaskEvents` (`vq5`) at line 398573.

**Renderer**: `cli_inner_pretty.js:425059-425072`

**Text**:

> The task tools haven't been used recently. If you're working on tasks that would benefit from tracking progress, consider using TaskCreate to add new tasks and TaskUpdate to update task status (set to in_progress when starting, completed when done). Also consider cleaning up the task list if it has become stale. Only use these if relevant to the current work. This is just a gentle reminder - ignore if not applicable.
>
> Here are the existing tasks:
>
> `#1. [pending] subject`
> `#2. [in_progress] subject`

**Why exists**: TaskCreate/TaskUpdate replaces the older flat TodoWrite list with a registry of named tasks. The reminder structure mirrors `todo_reminder`'s gentle-nudge pattern.

### `edited_text_file` — PostToolUse hook touched a file

**Trigger**: After Edit/Write/NotebookEdit returns successfully, PostToolUse hooks run. If the hook modified the file (`mtime` changed AND content differs from cache), emit this attachment so the next Edit doesn't fail with a stale-file error.

**Emit location**: `detectPostHookFileChange` (`Z38`) at `cli_inner_pretty.js:378825+`. See `04_tools/reminder_interaction.md` for full source.

**Renderer**: `cli_inner_pretty.js:425170+` (in the `PER_TOOL_RENDERERS` map for `edited_text_file`)

**Text**:

> Note: `<filename>` was modified, either by the user or by a linter. This change was intentional, so make sure to take it into account as you proceed (ie. don't revert it unless the user asks you to). Don't tell the user this, since they are already aware. Here are the relevant changes (shown with line numbers):
> `<snippet>`

Or, if the cumulative snippet budget for the turn was exceeded:

> Note: `<filename>` was modified, either by the user or by a linter. This change was intentional, so make sure to take it into account as you proceed (ie. don't revert it unless the user asks you to). Don't tell the user this, since they are already aware. The diff was omitted because other modified files in this turn already exceeded the snippet budget; use the Read tool if you need the current content.

**Why exists**: The PostToolUse hook (e.g., `prettier`/`ruff`) is a side-channel mutation the model didn't make; without warning, the next Edit would fail with a stale-content error (since `readFileState` doesn't match). The reminder primes the model.

**Why hedged ("likely a formatter")**: The dispatcher can't tell *who* changed the file (sibling hook? external IDE? watch script?). Attributing plausibly without overcommitting avoids misleading the model.

### `deferred_tools_delta` — MCP toolset changes

**Trigger**: Mid-session MCP server connects, disconnects, or reconnects; plan-mode toggles a tool's defer state; feature flag flips a tool's deferred status.

**Emit location**: `AMH` at `cli_inner_pretty.js:397831-397838`. Helper `compute_deferred_delta` at `Yh6`.

**Renderer**: `cli_inner_pretty.js:425201-425241`

**Text** (four sections, any non-empty subset):

> The following deferred tools are now available via `ToolSearch`. Their schemas are NOT loaded — calling them directly will fail with InputValidationError. Use ToolSearch with query "select:<name>[,<name>...]" to load tool schemas before calling them:
> `<addedLines>`
>
> N deferred tool(s) are available again (MCP server reconnected — names announced earlier in this conversation): name1, name2. Load via ToolSearch as before.
>
> The following deferred tools are no longer available (their MCP server disconnected). Do not search for them — ToolSearch will return no match:
> `<removedNames>`
>
> The following MCP servers are still connecting — their tools (typically named mcp__<server>__*) are not yet available but will appear shortly:
> `<pendingMcpServers>`
> If the user's request might be served by one of these servers (even if they didn't name it explicitly), call ToolSearch with a relevant keyword — ToolSearch will wait for connecting servers and search their tools once available. Do not report a capability as unavailable without first searching.

**Why four states** (not just `added`/`removed`): The 2.1.88 reference only emitted `added`/`removed`. v2.1.142 added `readded` (server reconnect) and `pending` (server connecting) because mid-session MCP server bounces produced misleading "tool removed" reminders followed by a re-add seconds later — the model wasted turns assuming the tool was gone.

### `agent_listing_delta` — Agent tool's available types changed

**Trigger**: `mQH` at `cli_inner_pretty.js:397839-397874`. Emits when the union of available agent types changes (new agents loaded from `.claude/agents/`, plugin-shipped agents added/removed).

**Renderer**: `cli_inner_pretty.js:425242-425267`

**Text** (sections):

- Initial listing:

> Available agent types for the Agent tool:
> `<addedLines>` (one line per agent: `- name: <name>` — `<description>`)
>
> When you launch multiple agents for independent work, send them in a single message with multiple tool uses so they run concurrently.

- Delta listing:

> New agent types are now available for the Agent tool:
> `<addedLines>`
>
> The following agent types are no longer available:
> `- agent1`
> `- agent2`

**Why initial-only concurrency note**: First-time exposure is the only time the model is guaranteed to have not seen the convention. Subsequent emissions skip the concurrency line so the model isn't repeatedly nagged.

### `mcp_instructions_delta` — MCP server instructions changed

**Trigger**: `BQH` at `cli_inner_pretty.js:397876-397883`. Emits when an MCP server's instruction block was added or removed.

**Renderer**: `cli_inner_pretty.js:425269-425291`

**Text**:

> # MCP Server Instructions
>
> The following MCP servers have provided instructions for how to use their tools and resources:
>
> `<addedBlocks joined by "\n\n">`
>
> The following MCP servers have disconnected. Their instructions above no longer apply:
> `<removedNames>`

**Why exists**: MCP servers ship per-server instruction documents (in the MCP `instructions` field). When a server connects mid-session, its instructions become relevant; when it disconnects, the model should know they no longer apply.

### `mcp_resource` — ReadMcpResource output

**Trigger**: `ReadMcpResource` tool call returns text or binary content.

**Renderer**: `cli_inner_pretty.js:425128-425161`

**Text** (for text content):

> Full contents of resource:
>
> `<text>`
>
> Do NOT read this resource again unless you think it may have changed, since you already have the full contents.

**Text** (for empty / non-displayable):

> `<mcp-resource server="<server>" uri="<uri>">(No content)</mcp-resource>`

**Why "don't re-read"**: Models tend to re-fetch resources when reasoning about them. For MCP resources (often large, server-paged), this can blow the prompt budget. The hardcoded reminder is shorter and cheaper than relying on prompt engineering for the same effect.

### `verify_plan_reminder` — post-plan verify nudge

**Trigger**: `xq5` (call site at line 397612). Emits when the plan-mode `verify` flag is set and the model is exiting plan mode with implementation TODO complete.

**Renderer**: `cli_inner_pretty.js:425312-425314`

**Text**:

> You have completed implementing the plan. Please call the `verify` tool directly (NOT the `Skill` tool or an agent) to verify that all plan items were completed correctly.

**Why exists**: The `/plan` workflow has an optional verify step. Without a reminder, the model often forgets to call the verify tool and the user has to manually trigger it.

## Modes

### `plan_mode` — full or sparse plan banner

**Trigger**: `d65` at `cli_inner_pretty.js:397726-397748`. Mode is "plan" AND either initial entry OR ≥5 turns since the last plan banner.

**Renderer**: `Gz5` → `Vz5` (full) / `Nz5` (sparse) / `Ez5` (subagent) at `cli_inner_pretty.js:424762-424935`

**Full text** (one of three variants by `customInstructions` / `bf()` / default; ~400 lines):

> # Plan Mode is Active
>
> The user has triggered plan mode … (full workflow: Phase 1 Initial Understanding, Phase 2 Design, Phase 3 Review, Phase 4 Final Plan, Phase 5 Call ExitPlanMode)
> …
> ## Plan File Info:
> `A plan file already exists at <path>. …`
> or
> `No plan file exists yet. You should create your plan at <path> using the Write tool.`

**Sparse text** (after first emission):

> Plan mode still active (see full instructions earlier in conversation). Read-only except plan file (`<path>`). Follow 5-phase workflow. End turns with `AskUserQuestion` (for clarifications) or `ExitPlanMode` (for plan approval). Never ask about plan approval via text or AskUserQuestion.

**Why full/sparse alternation**: Plan mode's full instructions are ~400 lines — including them every turn would waste tokens and invalidate the cached prefix. The sparse variant assumes the full instructions are still in the model's working context.

**Cadence**: `Is7 = {TURNS_BETWEEN_ATTACHMENTS: 5, FULL_REMINDER_EVERY_N_ATTACHMENTS: 5}` — every 5 turns emit *something*, and every 5th emission is a full re-statement. Effective cadence: full reminder every 25 turns; sparse reminder every 5 turns in between.

### `plan_mode_reentry` — returning to plan mode

**Trigger**: User re-enters plan mode (`/plan`) after exiting, and a plan file already exists from the prior session.

**Emit location**: `d65` at line 397736 (inside the `if (HH$())` branch).

**Renderer**: `cli_inner_pretty.js:425110-425124`

**Text**:

> ## Re-entering Plan Mode
>
> You are returning to plan mode after having previously exited it. A plan file exists at `<planFilePath>` from your previous planning session.
>
> **Before proceeding with any new planning, you should:**
> 1. Read the existing plan file to understand what was previously planned
> 2. Evaluate the user's current request against that plan
> 3. Decide how to proceed:
>    - **Different task**: If the user's request is for a different task—even if it's similar or related—start fresh by overwriting the existing plan
>    - **Same task, continuing**: If this is explicitly a continuation or refinement of the exact same task, modify the existing plan while cleaning up outdated or irrelevant sections
> 4. Continue on with the plan process and most importantly you should always edit the plan file one way or the other before calling `ExitPlanMode`
>
> Treat this as a fresh planning session. Do not assume the existing plan is relevant without evaluating it first.

**Why embeds the file path**: The model may be reading from a compacted summary that lost the path. Embedding removes ambiguity.

### `plan_mode_exit` — leaving plan mode

**Trigger**: `c65` at line 397750. Mode transitioned from "plan" to something else AND a `plan_mode` attachment was found in the prior history (so the model knows it's an exit, not a never-entered state).

**Renderer**: Not the SR path — emits a shorter banner; see `12_plan_mode/`.

### `auto_mode` — auto-mode banner

**Trigger**: `n65` at line 397783. Mode is "auto" (no clarifying-question prompts). Cadence mirrors plan mode (`Ss7 = {TURNS_BETWEEN_ATTACHMENTS:5, FULL_REMINDER_EVERY_N_ATTACHMENTS:5}`).

**Renderer**: `yz5` at line 424936. Three variants:
- `once` — first-time `tengu_auto_notice_once` Statsig gate is set
- `full` (`hz5`) — verbose explanation
- `sparse` (`Iz5`) — short reminder

**Full text** (hz5):

> ## Auto Mode Active
>
> Auto mode is active. `XR6` (the auto-mode prompt body — see `12_plan_mode/` or assets/prompts).

**Sparse text** (Iz5):

> Auto mode still active (see full instructions earlier in conversation). `LR6` (sparse body).

**Once text** (Sz5):

> The user has asked you to work without stopping for clarifying questions. When you'd normally pause to check, make the reasonable call and continue; they'll redirect if needed.

### `auto_mode_exit` — leaving auto mode

**Trigger**: `i65` at line 397799. Auto mode exited (or `bv8()` returned false, meaning the feature flag flipped off mid-session).

### `thinking_reminder` — per-request thinking cue

**Trigger**: `a65` at line 397820. Always emits on regular user prompts where:
- No `customSystemPrompt` is set
- `thinkingConfig.type !== "disabled"`
- Model supports thinking (`IO$()` returns true)
- At least one assistant message exists in history

**Renderer**: System prompt section — see `19_think_level/`. The reminder body is a one-line cue to "respond without a thinking block" or similar.

**Why every prompt**: Tuning thinking frequency is hard from system-prompt-only. The model tends to over-think when given a thinking budget. The reminder dynamically suppresses thinking for simple turns and allows it for complex ones — see system prompt at `cli_inner_pretty.js:523540`:

> "User messages may include a `<system-reminder>` appended by this harness asking you to respond without a thinking block. These reminders are not from the user, so treat them as an instruction to you, and do not mention them. The reminders are intended to tune your thinking frequency — on simpler user messages, it's best to respond or act directly without thinking unless further reasoning is necessary."

### `ultrathink_effort` — UltraThink escalation

**Trigger**: `o65` at line 397816. User invoked an ultrathink-eligible command (the body of the user message contains the magic trigger).

**Renderer**: Adds the ultrathink effort marker — a single-token cue the model recognises to escalate its budget.

## Memory

### `relevant_memories` — auto-memory recall

**Trigger**: Auto-memory subsystem matched the current turn's prompt against the persisted memory store. See `31_auto_memory/`.

**Renderer**: `cli_inner_pretty.js:425073-425091`

**Text** (first memory is special-cased):

> Retrieved for possible relevance — use only if it actually applies to what the user asked.
>
> `<header>`
>
> `<memory content>`

Plus subsequent memories without the header (just `<header>\n\n<content>`).

For "synthesis:" memories, the lead-in line is suppressed (they're already labelled by header).

**Why "use only if it actually applies"**: Memory is recall-by-similarity, not certainty. The reminder must communicate that drift between past and present is the norm, not the exception.

### `memory_update` — memory directory changed

**Trigger**: `Eq5` at line 398623. The auto-memory writer (or `/remember`) wrote new files to the memory directory in the current turn.

**Renderer**: `cli_inner_pretty.js:425292-425310`

**Text**:

> `<source-name>` updated your memory directory: `<summary>`
> Files changed: `<paths.join(", ")>`
> Your loaded copy of `<inContextPaths.join(", ")>` is now stale relative to disk — Read it again if you need current contents.
> This is ambient context — do not narrate it to the user unless they ask or it is directly relevant to their request.

**Why staleness callout**: The model has CLAUDE.md content cached in its context from session start. If the memory subsystem rewrote a memory file the model had read, the cached content is now wrong.

### `nested_memory` — CLAUDE.md hierarchy

**Trigger**: `fq5` (line 397585). When the model accesses a directory whose ancestors carry CLAUDE.md files not yet loaded, the auto-memory loader walks up and queues them. The reminder announces the load.

**Renderer**: Similar to `relevant_memories`. See `31_auto_memory/`.

## Hooks

### `hook_success` — UserPromptSubmit / SessionStart / UserPromptExpansion hook output

**Trigger**: User-defined hook ran on prompt-submit, session-start, or prompt-expansion and printed to stdout.

**Renderer**: `cli_inner_pretty.js:425194-425198`

**Text**:

> `<hookName>` hook success: `<content>`

(Wrapped in `<system-reminder>` by `h2` directly — `w8({content: h2(`${H.hookName} hook success: ${H.content}`), isMeta: !0 })`.)

**Why only three hook events**: Other hook events (PreToolUse, PostToolUse) emit attachments differently (via `hook_additional_context`). The three covered events have user-facing output that should always reach the model.

### `async_hook_response` — asyncRewake hook output

**Trigger**: An asyncRewake hook (a hook that explicitly defers its work and posts back asynchronously) returned a payload.

**Emit location**: `yq5` at line 398637.

**Renderer**: `cli_inner_pretty.js:425186-425193`

**Text**: Composes `systemMessage` (if present) and `additionalContext` (if present), each as a separate user message wrapped via `o_()`.

### `hook_additional_context` — synthesised post-hook reminder

**Trigger**: PostToolUse hook (PreToolUse if `additionalContext` returned) fired and changed something the model should know.

**Emit location**: `fK` (factory) — see `04_tools/reminder_interaction.md`. The renderer is the same `Tq4`-resolved path (the type is `hook_additional_context`).

## IDE

### `selected_lines_in_ide` — user selected text in IDE

**Trigger**: `e65` at line 397895. The IDE bridge reports a non-empty text selection.

**Renderer**: Per-IDE handler — emits `<ide-selection file_path="…" lines="…">…</ide-selection>` wrapped as a reminder.

### `opened_file_in_ide` — user opened a file in IDE

**Trigger**: `qq5` at line 397600 (call site). Same shape as selection — emits `<ide-opened-file path="…">` wrapped reminder.

### `diagnostics` — LSP findings (snapshot)

**Trigger**: `Wq5` (call site at line 397602). Snapshot of all current LSP diagnostics across the workspace.

**Renderer**: `cli_inner_pretty.js:425104-425106`

**Text**:

> `<formatted diagnostics by file>`

### `lsp_diagnostics` — LSP findings (delta)

**Trigger**: `Zq5` (call site at line 397603). Diff vs the prior snapshot.

## Background agents

### `task_status` — background-agent state

**Trigger**: `Nq5` at line 398608. Background task lifecycle event (running / killed / completed / failed).

**Renderer**: `cli_inner_pretty.js:425163-425185`

**Three text branches**:

`status === "killed"`:

> `<system-reminder>` Task "<description>" (`<taskId>`) was stopped by the user. `</system-reminder>`

`status === "running"`:

> Background agent "<description>" (`<taskId>`) is still running. [Progress: `<deltaSummary>` if any.] Do NOT spawn a duplicate. You will be notified when it completes. You can [read partial output at `<outputFilePath>` | check its progress with the TaskOutput tool] or send it a message with SendMessage.

`status === "completed"` / `"failed"` / others:

> Task `<taskId>` (type: `<taskType>`) (status: `<status>`) (description: `<description>`) [Delta: `<deltaSummary>` if any] [Read the output file to retrieve the result: `<outputFilePath>` | You can check its output using the TaskOutput tool.]

**Why "do not spawn a duplicate"**: The most common subagent mistake — the model sees no tool_result and assumes the run failed, so it re-launches. The reminder explicitly forbids re-launching and points to the recovery API.

## Agent teams (eK() = isAgentTeamFeatureEnabled)

### `team_context` — initial team identity

**Trigger**: Once per agent session when the agent is identified as a teammate.

**Renderer**: `cli_inner_pretty.js:424966-424994`

**Text**:

> # Team Coordination
>
> You are a teammate in team "<teamName>".
>
> **Your Identity:**
> - Name: `<agentName>`
>
> **Team Resources:**
> - Team config: `<teamConfigPath>`
> - Task list: `<taskListPath>`
>
> **Team Leader:** The team lead's name is "team-lead". Send updates and completion notifications to them.
>
> Read the team config to discover your teammates' names. Check the task list periodically. Create new tasks when work should be divided. Mark tasks resolved when complete.
>
> **IMPORTANT:** Always refer to teammates by their NAME (e.g., "team-lead", "analyzer", "researcher"), never by UUID. When messaging, use the name directly:
>
> ```json
> {
>   "to": "team-lead",
>   "message": "Your message here",
>   "summary": "Brief 5-10 word preview"
> }
> ```

### `teammate_mailbox` — incoming messages from teammates

**Trigger**: `hq5` (line 397593). Renders the team mailbox contents.

**Renderer**: `CI6` early-exit branch at line 424962:

```javascript
if (H.type === "teammate_mailbox") return [w8({ content: aA5().formatTeammateMessages(H.messages), isMeta: !0 })];
```

The wrapper is `aA5().formatTeammateMessages(...)` — see `30_agent_team/teammate_runner_loop.md`.

### `agent_pending_messages` — subagent inbox

**Trigger**: `F65` at line 398678. Returns pending messages from the subagent's coordinator-routed inbox.

## Files

### `file` — synthetic Read of a directory / image / notebook / PDF

**Trigger**: An attachment was scheduled by the @-mention or auto-extracted-attach paths. Type is `file` with content of various subtypes.

**Renderer**: `cli_inner_pretty.js:424998-425022`

**Subtypes**:
- `image` — emits a tool_use marker + KW$ image attachment + truncation reminder if applicable.
- `text` — emits a tool_use marker + text content + truncation reminder if the file was truncated:
  > Note: The file `<filename>` was too large and has been truncated to the first `<fBH>` lines. Don't tell the user about this truncation. Use Read to read more of the file if you need.
- `notebook` — emits tool_use marker + notebook attachment.
- `pdf` — emits tool_use marker + PDF attachment.

The tool_use marker (`_W$`) and tool_result marker (`KW$`) are synthetic — the API sees a "Read happened" structure even though no Read tool_use was emitted by the model.

### `directory` — synthetic ls

**Trigger**: User @-mentioned a directory. The attachment loader produces a `directory` type instead of `file`.

**Renderer**: TS reference at `messages.ts:3525`:

```javascript
return wrapMessagesInSystemReminder([
  createToolUseMessage(BashTool.name, {
    command: `ls ${quote([attachment.path])}`,
    description: `Lists files in ${attachment.path}`,
  }),
  createToolResultMessage(BashTool, {
    stdout: attachment.content, stderr: '', interrupted: false,
  }),
]);
```

The Bash output is wrapped in the SR envelope as part of a `tool_use` + `tool_result` pair, mimicking an actual Bash call.

## Skills

### `skill_listing` — available skills changed

**Trigger**: `Ty6` (line 397587). Set of available skills changed.

**Text**: See `10_skill_system/` for the rendered format.

### `invoked_skills` — skills invoked pre-compact

**Trigger**: After compaction, replay marker for skills the agent invoked before the boundary.

**Renderer**: `cli_inner_pretty.js:425023-425045`

**Text**:

> The following skills were invoked EARLIER in this session (before the conversation was compacted), not on the current turn. They are shown here for context only so you remain aware of their guidelines.
>
> IMPORTANT: Do NOT re-execute these skills or perform their one-time setup actions (e.g., scheduling, creating files) again. The "## Input" sections below reflect the original arguments from when each skill was first invoked — they are NOT the user's current message. Only continue to apply ongoing behavioral guidelines from these skills where still relevant.
>
> `<skill bodies>`

**Why "do not re-execute"**: Skills are stateful (some have one-time setup). The compacted summary may have evicted the side effects, so the model would otherwise re-run them.

### `dynamic_skill` — auto-discovered skill

**Trigger**: `Jq5` (line 397586). A skill was auto-loaded because the user's prompt matched its activation triggers.

## Context

### `date_change` — day rolled over

**Trigger**: `r65` at line 397805. The current date (UTC or local depending on config) differs from the last-emitted date AND a `date_change` attachment for the new date hasn't already fired.

**Text**: Single-line "The date is now `<YYYY-MM-DD>`." reminder.

**Why exists**: Without this, the model relies on the system-prompt-injected date — which is stale once the day rolls over.

### `queued_command` — user typed during tool run

**Trigger**: User submitted a prompt while a previous tool was still executing. The prompt is buffered as a `queued_command` attachment.

**Renderer**: `cli_inner_pretty.js:425092-425103`. Handles both string and array (with text + image) prompts. Routed through `vq4` (a `<command-message>` envelope wrap) before SR-wrapping.

### `agent_mention` — user typed @<agent-type>

**Trigger**: `_q5` (line 397560). The user's prompt contains `@<agent-type>` and that agent type is available.

**Text**: A nudge to use the Agent tool with that agent type.

## Token economics

### `token_usage` — context usage approaching budget

**Trigger**: `Sq5` (call site at line 397607). Token count crosses configured thresholds.

### `output_token_usage` — output budget reminder

**Trigger**: `Rq5` (line 397611).

### `budget_usd` — spend budget reminder

**Trigger**: `Cq5` (line 397610). User configured a max-budget-USD limit.

### `context_efficiency` — noop in v2.1.142

**Renderer**: returns `[]`. The type is reserved for future use.

### `unified_tasks` — TaskList tool's table state

**Trigger**: `Nq5` (line 397604). Refreshes the model's view of TaskList state.

## Cross-cutting

### `critical_system_reminder` — experimental override

**Trigger**: `s65` at line 397884. Looks at `ctx.criticalSystemReminder_EXPERIMENTAL` — a session-scoped string set by experiments.

**Renderer**: `cli_inner_pretty.js:426169`

```javascript
critical_system_reminder: (H) => o_([w8({ content: H.content, isMeta: !0 })]),
```

Plain pass-through of the content (which is expected to already be SR-wrapped or interpretable as a directive on its own).

### `output_style` — output-style banner

**Trigger**: `t65` at line 397889. User selected a non-default output style. Emits per-style "turn reminder" if the style defines one.

## Inline strings (not attachment-type routed)

### Read tool — empty file / short file

**Trigger**: Read returned `text` outputData with empty content or content shorter than the requested offset.

**Location**: `cli_inner_pretty.js:407419-407431` (Read's `mapToolResultToToolResultBlockParam`).

**Text** (empty):

> `<system-reminder>Warning: the file exists but the contents are empty.</system-reminder>`

**Text** (short):

> `<system-reminder>Warning: the file exists but is shorter than the provided offset (<startLine>). The file has <totalLines> lines.</system-reminder>`

**Why inline** (not via attachment): Inlining keeps the reminder tied to the specific tool_use_id. The tool_result content hash stays stable across calls with the same input (cache-friendly).

### Read tool — wasted call

**Trigger**: `mapToolResultToToolResultBlockParam` case `"file_unchanged"`. Returns the constant `KVK`:

> Wasted call — file unchanged since your last Read. Refer to that earlier tool_result instead.

(Not SR-wrapped — the model recognises it as a wasted-call marker via the literal text.)

### Bash tool — GitHub API rate limit

**Trigger**: `gh` command stderr matches the GitHub rate-limit pattern.

**Location**: `cli_inner_pretty.js:271790`

**Text**:

> `<system-reminder>GitHub API rate limit exceeded (5,000/hr shared across all tools and agents). Run \`gh api rate_limit --jq .resources\` and sleep until reset before further gh calls. If polling in a loop, use ScheduleWakeup instead of retrying.</system-reminder>`

### Side question — lightweight separate agent

**Trigger**: `/ask` slash command or programmatic side-question invocation (`$D8` at `cli_inner_pretty.js:427848`).

**Text** (precedes the user's actual question):

> `<system-reminder>`This is a side question from the user. You must answer this question directly in a single response.
>
> IMPORTANT CONTEXT:
> - You are a separate, lightweight agent spawned to answer this one question
> - The main agent is NOT interrupted - it continues working independently in the background
> - You share the conversation context but are a completely separate instance
> - Do NOT reference being interrupted or what you were "previously doing" - that framing is incorrect
>
> CRITICAL CONSTRAINTS:
> - You have NO tools available - you cannot read files, run commands, search, or take any actions
> - This is a one-off response - there will be no follow-up turns
> - You can ONLY provide information based on what you already know from the conversation context
> - NEVER say things like "Let me try...", "I'll now...", "Let me check...", or promise to take any action
> - If you don't know the answer, say so - do not offer to look it up or investigate
>
> Simply answer the question with the information you have.`</system-reminder>`

**Why inline** (not via attachment): The side question runs in a forked query (`JV` with `maxTurns: 1`); it doesn't go through the standard attachment pipeline. The SR-wrapping is built into the prompt construction.

### Container restart — background tasks lost

**Trigger**: After a container restart, the daemon sees zombie task records but the processes are gone. `Tl4` at `cli_inner_pretty.js:575292-575298`.

**Text**:

> `<system-reminder>`The container was restarted. The following background tasks were running and are now stopped:
> - `<description>` (task `<task_id>`)
> Re-create them if still needed.`</system-reminder>`

### Brief mode toggle — `/brief` slash command

**Trigger**: User invoked `/brief` to toggle brief-only output mode.

**Location**: `cli_inner_pretty.js:497348-497351`

**Text**:

> `<system-reminder>`
> Brief mode is now enabled. Use the `Brief` tool for all user-facing output — plain text outside it is hidden from the user's view.
>
> or
>
> Brief mode is now disabled. The `Brief` tool is no longer available — reply with plain text.
> `</system-reminder>`

### Memory age marker — stale memory warning

**Trigger**: An auto-loaded memory file is >1 day old.

**Location**: `cli_inner_pretty.js:217459` (`iiK` helper).

**Text**:

> `<system-reminder>`This memory is `<N>` days old. Memories are point-in-time observations, not live state — claims about code behavior or file:line citations may be outdated. Verify against current code before asserting as fact.`</system-reminder>`

### Malware warning — Read tool head

**Trigger**: Pre-pended to every Read output (system prompt addition).

**Location**: TS reference at `src/tools/FileReadTool/FileReadTool.ts:730`.

**Text** (constant `'\n\n<system-reminder>\nWhenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.\n</system-reminder>\n'`).

### Agent teams non-interactive shutdown — print mode

**Trigger**: Print-mode (non-interactive) execution must complete by shutting down all team members.

**Location**: `cli_inner_pretty.js:604170-604182` (constant `gH9`).

**Text**:

> `<system-reminder>`
> You are running in non-interactive mode and cannot return a response to the user until your team is shut down.
>
> You MUST shut down your team before preparing your final response:
> 1. Use `requestShutdown` to ask each team member to shut down gracefully
> 2. Wait for shutdown approvals
> 3. Use the cleanup operation to clean up the team
> 4. Only then provide your final response to the user
>
> The user cannot receive your response until the team is completely shut down.
> `</system-reminder>`
>
> Shut down your team and prepare your final response for the user.

### Ultraplan remote planning sessions

**Trigger**: Remote planning sessions triggered from the local terminal. Three variants packaged as separate `require()`-loaded modules.

**Locations**:
- `cli_inner_pretty.js:475352-475371` (`oj4`) — single-agent remote planning
- `cli_inner_pretty.js:475373-475395` (`aj4`) — single-agent with mermaid diagrams
- `cli_inner_pretty.js:475397-475427` (`sj4`) — multi-agent ultra planning

Each is a long-form SR-wrapped scaffolding instruction. The text includes the magic teleport string `"__ULTRAPLAN_TELEPORT_LOCAL__"` for the bidirectional handoff.

### CLAUDE.md / context injection

**Trigger**: At session start, `EO8` (line 524243) prepends a reminder block summarising the static context (project CLAUDE.md, git status, user instructions).

**Text**:

> `<system-reminder>`
> As you answer the user's questions, you can use the following context:
> # `<key>`
> `<value>`
> # `<key2>`
> `<value2>`
> …
>
>       IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.
> `</system-reminder>`

**Why prepended at session start**: This is the *only* place where reminder text lives near the system prompt rather than inside a per-turn user message. The reminder rides as the first content block of the first user message, ensuring the cache prefix includes it.

## Reading order

- `runtime_lifecycle.md` — *how* reminders flow once emitted
- `ui_handling.md` — *why* the user doesn't see them
- `telemetry_and_cache.md` — *what* it costs in tokens

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - v2.1.142 additions: [symbol_additions_v2_1_142_system_reminder.md](../00_overview/symbol_additions_v2_1_142_system_reminder.md)

Key functions / emitters in this document:
- `collectAttachments` (obfuscated: `p65`) - Parallel generator runner
- `maybeEmitTodoReminder` (obfuscated: `Vq5`) - TodoWrite nudge gate
- `maybeEmitTaskReminder` (obfuscated: `kq5`) - TaskCreate/TaskUpdate nudge gate
- `countTurnsSinceTodoEvents` (obfuscated: `Tq5`)
- `countTurnsSinceTaskEvents` (obfuscated: `vq5`)
- `detectPostHookFileChange` (obfuscated: `Z38`) - Edited-file reminder
- `emitDeferredToolsDelta` (obfuscated: `AMH`) - MCP toolset delta
- `emitAgentListingDelta` (obfuscated: `mQH`)
- `emitMcpInstructionsDelta` (obfuscated: `BQH`)
- `maybeEmitPlanModeReminder` (obfuscated: `d65`)
- `maybeEmitAutoModeReminder` (obfuscated: `n65`)
- `maybeEmitThinkingReminder` (obfuscated: `a65`)
- `maybeEmitDateChange` (obfuscated: `r65`)
- `emitMemoryUpdate` (obfuscated: `Eq5`)
- `emitTaskStatus` (obfuscated: `Nq5`)
- `emitAsyncHookResponses` (obfuscated: `yq5`)
- `emitTeamContext` (handled in `CI6` early branch via `eK()`)
- `emitSideQuestion` (obfuscated: `$D8`) - Inline SR wrap
- `emitContainerRestartReminder` (obfuscated: `Tl4`)
- `emitPlanModeReentry` (handled in `d65` + renderer case)
- `getMemoryAgeMarker` (obfuscated: `iiK` → `A36`)
- `REMINDER_THRESHOLDS` (obfuscated: `aO8`) - TodoWrite/TaskCreate threshold
- `PLAN_REMINDER_THRESHOLDS` (obfuscated: `Is7`)
- `AUTO_REMINDER_THRESHOLDS` (obfuscated: `Ss7`)
- `MEMORY_REMINDER_THRESHOLD` (obfuscated: `B65`)
- `WASTED_READ_REMINDER` (obfuscated: `KVK`) - "Wasted call — file unchanged…"
- `SHUTDOWN_TEAM_PROMPT` (obfuscated: `gH9`) - Non-interactive team shutdown
- `CONTAINER_RESTART_REMINDER` (obfuscated: function `Tl4`)
- `BRIEF_MODE_REMINDER` (handled inline at L497348)
