# Agent runtime and execution routes

The Agent tool is a router over several execution substrates. Its difficult invariant is that all
routes share the same policy boundary while preserving the right task, slot, transcript, and
worktree ownership after foreground work becomes asynchronous.

### Agent input contract and route selection

**What it does:** Validates one Agent request and selects teammate, remote, background-local, or
foreground-local execution.

**How it works:**
1. The schema accepts prompt, short description, optional agent type/model/name, background flag,
   `worktree`/`remote` isolation, and explicit cwd (`cli_inner_pretty.js:550718-550823`).
2. `team_name` and `mode` remain accepted but are described as deprecated and ignored
   (`550760-550765`); permission comes from the parent/agent definition.
3. `agentTool` (`hni`, `550824-550939`) checks depth first, normalizes description whitespace, and
   rejects nested named teammates or invalid teammate/background combinations.
4. It resolves allowed agent types against permission rules before spending time on model, MCP, or
   worktree setup.
5. A named request in active team mode routes to an in-process teammate when no isolation/cwd route
   was requested (`550941-550970`).
6. Fork requests reject remote isolation and recursive forks, then inherit exact parent context;
   ordinary requests resolve the named/default definition with normalized-name ambiguity checks.
7. Remote isolation degrades to worktree/local only when remote eligibility is unavailable; an
   eligible remote request creates a cloud session and returns immediately (`551016-551194`).
8. Local requests compute async status from explicit flags, agent frontmatter, environment/session
   modes, and foreground constraints (`551026-551043`).

**Why this approach:**
- Cheap structural and policy checks precede expensive MCP waits and worktree creation.
- One schema keeps compatibility across interactive, SDK, team, fork, and remote surfaces.
- Explicit degradation avoids turning unavailable remote work into a hard failure when a safe local
  substrate exists; the trade-off is that requested isolation semantics may change with a warning.
- Forks are stricter because their defining property is inherited local conversation context.

**Key insight:** “Background” is not a single input bit. It is a derived execution property that
combines request intent, agent defaults, host mode, remote requirements, and foreground policy.

### Child context and model construction

**What it does:** Builds a child session whose prompt, tools, permissions, model, identity, and project
root are consistent with the selected definition.

**How it works:**
1. Required MCP servers may wait up to 30 seconds for pending clients, then admission compares the
   required names with actually tool-producing MCP servers (`551049-551095`).
2. Model selection combines the agent definition, parent model, explicit override, and permission
   mode; restricted substitutions are surfaced through a notification callback (`551100-551123`,
   `551326-551337`).
3. Ordinary agents build a fresh system prompt; forks reuse the rendered parent prompt and replay
   context with exact tools (`551195-551238`, `551298-551313`).
4. The child depth is parent depth plus one, and the lifecycle records invocation type before start.
5. Permission context inherits from the parent or observer pairing, then applies the child definition
   inside `runSubagentStream` (`$5`, `481870-482020`).
6. Worktree isolation creates a temporary project and binds a child session to that cwd; explicit cwd
   similarly creates a project-scoped session (`551273-551342`).
7. Available tools are filtered for child role, async restrictions, disallowed frontmatter, exact
   fork mode, and connected MCP tools.

**Why this approach:**
- Model, prompt, permission, and cwd are resolved before task launch so telemetry and persisted task
  metadata describe the actual run.
- Fork exactness preserves conversation semantics; normal agents receive a smaller independent
  prompt for cache and safety isolation.
- Delayed MCP admission prevents an agent definition from silently launching without declared
  dependencies.
- Project-scoped sessions make relative file and shell operations coherent inside worktrees.

**Key insight:** The child is not the parent loop with a different prompt. It is a newly assembled
execution context whose inherited pieces are explicit and route-dependent.

### Concurrency-slot ownership across routes

**What it does:** Acquires one slot only after preflight succeeds and releases it exactly once when
the real execution ends.

**How it works:**
1. Worktree creation and abort checks occur before acquisition so failed setup does not occupy
   capacity (`551342-551376`).
2. The acquisition helper rechecks concurrency because earlier validation may have yielded during MCP
   or worktree work (`550936-550939`).
3. It returns the task-registry's idempotent release closure.
4. `We` wraps promises so an early thrown error releases the slot (`551377-551385`).
5. A background task passes the release closure as `onRunSettled`; returning the launch handle does
   not release capacity (`551419-551445`).
6. A foreground task also passes the same closure into the underlying runner.
7. If foreground execution wins the auto-background race, task ownership transfers to the registry
   and the Agent call returns an async handle; the slot remains held (`551550-551672`).
8. Terminal or recovered foreground completion eventually settles the runner and releases once;
   duplicate error/finally paths are harmless.

**Why this approach:**
- Late acquisition minimizes slot hold time during setup.
- The second check closes the cooperative-event-loop race between preflight and launch.
- Binding release to the execution promise rather than tool-call return handles auto-backgrounding
  correctly.
- Idempotence is slightly more stateful than a raw decrement but makes multiple cleanup owners safe.

**Key insight:** Presentation lifecycle and execution lifecycle diverge at auto-backgrounding. The
semaphore follows execution, not the Agent tool response.

### Foreground completion versus auto-background race

**What it does:** Lets a synchronous-looking agent become background work without duplicating or
losing its task record.

**How it works:**
1. `registerForegroundAgentTask` (`OWd`, `cli_inner_pretty.js:353314-353378`) creates a running task
   with `isBackgrounded: false`, an abort controller, and a resolver-backed background signal.
2. An optional timer flips the task to background and resolves that signal.
3. The Agent call races the execution promise against the background signal (`551597-551600`).
4. If execution is already terminal when the background signal wins, it is treated as completed
   rather than returned as phantom background work.
5. A genuine background transition marks owner notification state, detaches the parent abort bridge,
   persists task ownership, and returns the async result shape (`551635-551672`).
6. Otherwise it extracts final/recovered output and the `finally` path removes non-background task
   state and emits terminal usage (`551674-551757`).

**Why this approach:**
- A promise race avoids polling and keeps foreground latency low.
- Re-reading task status after the race handles near-simultaneous completion.
- One task record changes ownership rather than creating a second background record.
- The extra terminal-state checks add complexity but eliminate missing or duplicated notifications.

**Key insight:** The race result is only a hint; authoritative task state decides whether the run
actually crossed into background ownership.

### Partial-result recovery and finalization

**What it does:** Produces a useful Agent result after normal completion or recoverable stream errors,
then applies security review before handing it to the parent.

**How it works:**
1. Foreground progress records meaningful stream events while forwarding API retry state, shell
   progress, optional nested text, and response-length deltas (`551470-551550`).
2. A cancellation owned by the child becomes recoverable terminal data; a parent/user cancellation
   remains a thrown interrupt.
3. On other stream errors, the recovery helper selects a valid history prefix and optional cutoff
   note (`551684-551702`).
4. `finalizeSubagentResult` (`Mfa`, `483346-483421`) locates the last usable assistant text, falling
   back through live history when the final assistant message has no text.
5. It computes tokens, tool statistics, duration, model swaps, telemetry, and sanitized content.
6. `reviewSubagentHandoff` (`DDr`, `483486-483575`) runs only in auto mode when actions/text warrant
   review; flagged, unavailable, and upstream-refused reviews produce distinct warnings.
7. Cutoff and handoff warnings are prepended to the final content, preserving useful partial work.

**Why this approach:**
- Recovering a trustworthy prefix is more useful than discarding a long worker run after a late API
  failure.
- Parent and child cancellation ownership must differ or backgrounding/cancellation races become
  indistinguishable.
- Result extraction and safety review are separate: structural sanitization is deterministic, while
  policy review can fail or refuse.
- Warnings preserve evidence and let the parent decide, rather than silently suppressing all output.

**Key insight:** A subagent's final answer is treated as untrusted handoff data. Completion does not
automatically grant its text authority in the parent loop.

### Worktree cleanup policy

**What it does:** Removes a clean temporary worktree when safe and preserves dirty or hook-owned work
for recovery.

**How it works:**
1. Spawn records path, branch, original head, git root, and whether a hook created the worktree.
2. Cleanup nulls its local handle first so repeated calls cannot process the same worktree twice
   (`551343-551372`).
3. Hook-created worktrees are kept and reported.
4. A bundle-created worktree whose head has not materially changed is removed; its persisted agent
   metadata is updated asynchronously.
5. If changes exist or removal cannot be completed, git metadata is repaired and the path/branch are
   returned to the caller.
6. Setup/abort/concurrency failures invoke cleanup before propagating.

**Why this approach:**
- Null-before-await gives idempotence across exception paths.
- Clean ephemeral worktrees should disappear automatically; dirty work is user value and must remain
  recoverable.
- Hook ownership is respected because the Agent tool cannot infer the hook's lifecycle contract.
- Preservation may leave cleanup work for the user, but avoids destructive loss.

**Key insight:** Cleanup is outcome-sensitive: temporary infrastructure is disposable, produced work
is not.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `agentTool` (`hni`) - validates and routes Agent requests.
- `runSubagentStream` (`$5`) - builds the child context and yields its stream.
- `registerBackgroundAgentTask` (`KWe`) - creates an asynchronously owned task.
- `registerForegroundAgentTask` (`OWd`) - creates a task that may auto-background.
- `finalizeSubagentResult` (`Mfa`) - extracts metrics and safe final text.
- `reviewSubagentHandoff` (`DDr`) - reviews auto-mode results before handoff.
