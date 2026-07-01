# Todo / Tasks Prompt Surface

This page documents the model-facing instructions for the 2.1.193 todo/task tools. The authoritative target is `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`; the named TypeScript tree is used only to cross-check semantics where it matches the bundle.

## Prompt Families

### TodoWrite Prompt Selection

**What it does:** Chooses the instruction text for the legacy `TodoWrite` checklist tool.

**How it works:**
1. `TodoWriteTool.prompt` calls `selectTodoWritePrompt` (`qIa`) with the active model (`cli_inner_pretty.js:308599-308604`, `cli_inner_pretty.js:308829-308831`).
2. The selector returns a compact prompt for the lean/simple model predicate, otherwise it returns the long classic prompt.
3. The compact prompt emphasizes the hard contract: send the full list, use `content` / `status` / `activeForm`, keep one `in_progress` item, and mark tasks complete.
4. The long prompt adds detailed usage guidance, examples, "when not to use" rules, and completion-quality requirements (`cli_inner_pretty.js:308606-308800`).

**Why this approach:**
- Smaller models get a lower-token contract that preserves the required schema and core behavior.
- Larger/default models get examples and counterexamples that reduce misuse on complex coding tasks.
- The trade-off is prompt drift risk: two texts must preserve the same operational contract. In 2.1.193 they both retain full-list replacement and one-active-task guidance.

**Key insight:** The prompt split is not a feature split. Both prompts describe the same `TodoWrite` state machine; the selector only changes instruction density.

### TaskCreate Prompt Contract

**What it does:** Teaches the model to create one structured V2 task at a time.

**How it works:**
1. `TaskCreateTool.prompt` returns `buildTaskCreatePrompt` (`$cl`) (`cli_inner_pretty.js:437711-437763`, `cli_inner_pretty.js:437806-437808`).
2. The prompt tells the model to use tasks for complex multi-step work, plan mode, explicit user requests, multi-item requests, new instructions, work starts, and follow-up discoveries.
3. It tells the model not to use tasks for single trivial tasks, purely conversational requests, or work that is too small to benefit from tracking.
4. The prompt defines `subject`, `description`, and optional `activeForm`; all new tasks start as `pending`.
5. In teammate mode, it adds assignment-specific guidance: include enough detail for another agent, then use `TaskUpdate` owner assignment when needed (`cli_inner_pretty.js:437712-437717`).
6. The validation steer rejects batch-shaped `tasks` / `todos` input and Agent-shaped `prompt` / `subagent_type` input with corrective text (`cli_inner_pretty.js:437691-437696`).

**Why this approach:**
- Single-task creation keeps hook validation, rollback, and transcript references precise.
- Teammate-only prompt fragments avoid burdening solo sessions with assignment mechanics they cannot use.
- The coercion/validation split is pragmatic: harmless aliases can be repaired, but conceptual misuse gets explicit steering.

**Key insight:** `TaskCreate` is deliberately narrower than `TodoWrite`. V1 replaces a whole checklist; V2 creates exactly one durable record and relies on `TaskUpdate` for later state transitions.

### TaskUpdate Prompt Contract

**What it does:** Defines the mutation surface for task status, fields, ownership, metadata, deletion, and dependencies.

**How it works:**
1. `TaskUpdateTool.prompt` returns the fixed prompt text `Vcl` (`cli_inner_pretty.js:437951-438025`, `cli_inner_pretty.js:438075-438077`).
2. The prompt prioritizes completion discipline: mark resolved work, do not complete partial/failing work, and call `TaskList` after resolution.
3. It defines `status`, `subject`, `description`, `activeForm`, `owner`, `metadata`, `addBlocks`, and `addBlockedBy`.
4. It presents the intended status progression as `pending` to `in_progress` to `completed`, with `deleted` as a permanent removal action.
5. It explicitly warns about staleness: read the latest state with `TaskGet` before updating.
6. The examples are one-record updates, matching the tool's single-`taskId` schema (`cli_inner_pretty.js:438007-438024`).

**Why this approach:**
- The prompt front-loads correctness criteria because `TaskUpdate` is the point where false completion can corrupt user-visible progress.
- It keeps deletion in the same tool as status updates, avoiding a separate delete API while still making deletion explicit.
- The trade-off is a larger prompt and a wider tool surface, but the implementation already centralizes hooks, ownership, dependencies, and metadata in one mutation hub.

**Key insight:** `TaskUpdate` carries the operational rules that `TaskCreate` cannot enforce: completion quality, ownership handoff, dependency edges, and cleanup.

### TaskGet And TaskList Prompt Roles

**What it does:** Splits read-only task inspection into detail lookup and scheduler view.

**How it works:**
1. `TaskGetTool.prompt` says to fetch a task when full requirements, dependencies, or assigned work context are needed (`cli_inner_pretty.js:437854-437877`).
2. `TaskGet` output includes description and both dependency arrays but omits owner/metadata from its schema result (`cli_inner_pretty.js:437930-437937`).
3. `TaskListTool.prompt` says to use the list for available work, progress checks, blocked work, post-completion selection, and ID-order preference (`cli_inner_pretty.js:438226-438284`).
4. In teammate mode, `TaskList` adds workflow guidance: find pending unowned unblocked tasks, prefer low IDs, claim with `TaskUpdate`, and focus on blockers when blocked (`cli_inner_pretty.js:438235-438251`).
5. `TaskList` intentionally returns a compact summary: id, subject, status, optional owner, and open blockers (`cli_inner_pretty.js:438342-438348`).

**Why this approach:**
- `TaskList` stays small enough to be called often as a scheduler primitive.
- `TaskGet` preserves detail retrieval without forcing every list call to carry full descriptions.
- The trade-off is a two-step workflow for nontrivial tasks: list first, then get detail before mutation.

**Key insight:** The read prompts make V2 tasks behave like a work queue: `TaskList` chooses work, `TaskGet` loads requirements, and `TaskUpdate` records progress.

### TaskOutput Deprecation Prompt Boundary

**What it does:** Separates runtime background-task output retrieval from the durable task-list tools.

**How it works:**
1. `TaskOutputTool.prompt` is a deprecation-oriented prompt (`cli_inner_pretty.js:435517-435534`).
2. It tells the model not to use the tool for local-agent tasks because the Agent tool result already contains the final result.
3. It tells the model to prefer reading the output file path for bash and remote-agent tasks.
4. The tool remains enabled and keeps legacy aliases, but the prompt guides new usage away from unnecessary polling (`cli_inner_pretty.js:435497-435516`).

**Why this approach:**
- Runtime tasks still need a compatibility path for older transcripts and tool names.
- Steering through the prompt avoids breaking old surfaces while reducing new calls to a less useful API.
- The trade-off is naming confusion: "TaskOutput" sounds adjacent to `TaskList`, but it operates on runtime task registry entries, not durable work items.

**Key insight:** `TaskOutput` is a background-process tool, not a V2 task-list read tool. Its prompt exists mostly to prevent that overload from misleading the model.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Todo / Tasks tool, prompt, reminder, and UI anchors
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent/tool execution context
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Hooks, permissions, and platform context
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI and integration surfaces

Key functions in this document:
- `TodoWriteTool` (`tLe`) - legacy checklist tool with model-selected prompt.
- `TaskCreateTool` (`Ncl`) - one-task creation prompt and validation steering.
- `TaskGetTool` (`jcl`) - read-only full-detail task lookup prompt.
- `TaskUpdateTool` (`qcl`) - mutation prompt for status, owner, metadata, deletion, and dependencies.
- `TaskListTool` (`Jcl`) - compact scheduler-view prompt.
- `TaskOutputTool` (`j6n`) - runtime background-task output prompt and legacy aliases.
