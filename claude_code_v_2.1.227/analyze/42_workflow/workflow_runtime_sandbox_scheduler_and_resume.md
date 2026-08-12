# Workflow runtime, sandbox, scheduler, and resume in 2.1.227

## Scope and evidence

Primary source ranges in `cli_inner_pretty.js`:

- `:118112-118148` - enablement, managed disable, org policy, and server-carrier carve-out.
- `:406630-406720` - workflow-size resolution and prompt text.
- `:475706-475848` - shared VM intrinsic hardening.
- `:490881-491077` - AST gate, await transform, compilation, determinism shim.
- `:491098-491399` - task registration, progress state, terminal transitions, notification.
- `:491428-491934` - script persistence, metadata parsing, child workflow runtime.
- `:491944-493417` - resume journal, scheduler, agent execution, parallel/pipeline semantics, limits.
- `:493418-493829` - built-in/plugin/user/project discovery and VM context construction.
- `:493839-494268` - execution, progress batching, and local task lifecycle.
- `:494269-494830` - adopted and server-authored workflow paths.
- `:547421-547880` - Workflow tool schema, validation, permission, call, and result rendering.

All behavior below is verified in 2.1.227. Direct comparison with 2.1.220 is used only where the report
states a version delta.

## Architecture at a glance

The subsystem has five boundaries:

| Boundary | Input | Output |
|---|---|---|
| Admission | inline script, name, or path plus args/resume ID | resolved script and permission decision |
| Compilation | metadata-prefixed JavaScript | hardened `vm.Script` or syntax error |
| Realm | compiled script plus controlled API values | isolated workflow promise |
| Scheduler | `agent`/`parallel`/`pipeline` calls | journaled subagent results and progress snapshots |
| Lifecycle | running task | completed, failed, killed, paused/adopted, or remote result line |

The public tool launches locally in the background. The same core runner is also used by a
server-authored carrier, but that ingress is authenticated by transport, pinned bundle metadata, and
a one-shot handoff command.

### Workflow admission and source resolution

**What it does:** Selects one script, enforces workflow policy, and ensures approval applies to the
actual script that will execute.

**How it works:**
1. `WorkflowTool.validateInput` (`rnS`, `cli_inner_pretty.js:547575-547660`) rejects a retracted call,
   managed `disableWorkflows`, failed org/session enablement, and invalid name-only usage.
2. `resolveWorkflowInput` (`iVp`, `:547421-547448`) applies precedence. `scriptPath` wins even if script
   or name is also present; named resolution is second; inline script is last.
3. Path input is resolved against the current working directory, rejects UNC paths, reads through the
   storage boundary, and caps content at 524,288 bytes.
4. A named workflow is looked up across built-in, plugin, user, and project registries. If not found,
   validation returns the current available-name list.
5. The script is parsed before permission resolution. This means the approval UI reviews a
   syntactically meaningful workflow rather than an opaque invalid blob.
6. Permission rules may target the named workflow. For path/name input, `checkPermissions` resolves
   and inserts the script into `updatedInput` before asking, so the approved payload is the execution
   payload.
7. A running `resumeFromRunId` is rejected. The prior task must be stopped before the same journal is
   reused.
8. On launch, syntax compilation occurs again, the script is persisted under the session directory,
   and the tool immediately returns task/run/transcript/script identifiers.

**Why this approach:**
- Resolution before approval prevents a name or path from being swapped after the user reviews it.
- Repeating parse/compile at call time protects against state changes between validation and dispatch.
- Returning a background task handle avoids blocking the main turn while many agents run.
- The trade-off is duplicated resolution work, but the two passes protect a security-sensitive
  time-of-check/time-of-use boundary.

**Key insight:** Workflow approval is attached to resolved code, not merely to the string that named
the code.

### Metadata parsing and pure-literal policy

**What it does:** Separates descriptive workflow metadata from executable code without evaluating the
metadata.

**How it works:**
1. `parseWorkflowDefinition` (`EL`, `:491493-491524`) rejects scripts over 512 KiB and parses the file
   as the latest ECMAScript module grammar.
2. The first AST statement must be one named export containing exactly one `const meta` declaration
   initialized by an object expression.
3. `parsePureMetaLiteral` (`EFp`/`vFp`, `:491566-491611`) accepts literals, arrays without holes or
   spread, plain objects, interpolation-free template literals, and negative numeric literals.
4. Computed keys, methods, accessors, spread, arbitrary unary operators, and executable expressions
   are rejected.
5. `__proto__`, `constructor`, and `prototype` are forbidden metadata keys.
6. Name and description must be nonempty strings. Title/when-to-use are optional; phase entries retain
   only string title/detail/model fields.
7. The parser removes only the first metadata statement and returns the remaining source as the
   executable body.
8. Syntax diagnostics include the offending line, an 80-column window, and a caret at the parser
   location.

**Why this approach:**
- Static extraction permits discovery and UI rendering without executing repository/plugin code.
- A deliberately small literal language prevents getters, prototypes, or computed expressions from
  running during catalog load.
- Rejecting prototype-sensitive keys prevents object-shape manipulation in later merges.
- The trade-off is less expressive metadata; workflow behavior belongs in the script body, so the
  restriction is appropriate.

**Key insight:** `meta` is parsed as data even though it is written in JavaScript syntax.

### AST gate, await transformation, and dynamic-import defense

**What it does:** Instruments every asynchronous boundary for safe cross-realm settlement and rejects
syntax that can escape the workflow sandbox.

**How it works:**
1. `compileWorkflowScript` (`o0t`, `:490992-491014`) first asks the host parser to validate the body as
   a strict async function.
2. `transformWorkflowAsyncBoundaries` (`dqb`, `:490924-490991`) parses a strict async wrapper and walks
   the complete AST.
3. Identifiers beginning with the private transform prefix are rejected so workflow code cannot
   collide with injected helpers.
4. `with`, `await using`, and every `ImportExpression` are rejected before source rewriting.
5. Await operands, expression-bodied async arrows, `for await` iterables, async returns, async-generator
   returns, and async-generator yields are wrapped with realm settlement helpers.
6. Replacements are applied from the highest source offset downward so earlier offsets remain valid.
7. The transformed body is embedded in a closure that owns the promise and async-iterator settlement
   functions.
8. The resulting `vm.Script` still installs `importModuleDynamically` as a rejecting callback.
9. The 2.1.223 fix is step 4. In 2.1.220 the VM callback existed, but the AST walk did not reject
   `ImportExpression`. In 2.1.227, compilation fails before transformation and VM execution, while the
   old callback remains as a second line of defense.

**Why this approach:**
- Awaited VM values can be thenables whose prototype behavior crosses realms; central wrappers make
  settlement and cloning explicit.
- AST rejection is earlier and easier to audit than relying solely on a runtime loader callback.
- Keeping the runtime rejection protects against future parser/transform regressions.
- The trade-off is source rewriting complexity and explicit coverage of several JavaScript async
  forms. Missing one form would create inconsistent boundary behavior, so the visitor is intentionally
  exhaustive.

**Key insight:** The dynamic-import repair is defense in depth: reject the syntax structurally and
retain the loader denial at runtime.

### VM realm construction and intrinsic hardening

**What it does:** Creates a deterministic JavaScript realm that exposes orchestration primitives but
not general host capabilities.

**How it works:**
1. `createWorkflowRuntime` (`JFp`, `:493758-493829`) creates a null-prototype context with string and
   WebAssembly code generation disabled.
2. Initial globals are limited to log, phase, console, frozen budget, abort-aware timers, and later the
   wrapped agent/parallel/pipeline/workflow functions plus JSON-cloned args.
3. `hardenVMIntrinsics` (`L6t`, `:475706-475848`) deletes high-risk globals such as WebAssembly,
   FinalizationRegistry, WeakRef, shared-memory primitives, queueMicrotask, and JSC debug/shell globals.
4. It applies an enable-property-override shim before freezing common prototypes, preserving ordinary
   instance shadowing without leaving prototypes writable.
5. Constructors, prototypes, iterator prototype chains, namespace objects, error families, typed
   arrays, async/generator constructors, and Intl subconstructors are frozen.
6. `globalThis.then` is pinned to nonconfigurable `undefined`, preventing the realm object from being
   turned into a thenable when host code awaits it.
7. `installDeterminismShim` (`VQo`, `:490884-490886`) disables Math.random, Date.now, bare Date(), and
   zero-argument `new Date`; explicit-date construction and Date.parse/UTC remain available.
8. Host functions are wrapped in realm-owned call adapters. Values are cloned, snapshotted,
   sanitized, and stringified through dedicated cross-realm closures.
9. Timers are tracked and cancelled on abort; callbacks are re-entered through a VM-owned invocation
   function.

**Why this approach:**
- `node:vm` is only one layer; mutable intrinsics and host callbacks create additional escape or
  denial-of-service surfaces.
- Deterministic time/random behavior is required for prefix-hash resume to be meaningful.
- Freezing after the override shim avoids the TC39 override mistake that would break normal Error and
  object instance assignments.
- The trade-off is a nonstandard JavaScript environment, documented in the tool prompt because
  reproducibility and isolation matter more than full Node compatibility.

**Key insight:** The sandbox is the composition of disabled code generation, a minimal global surface,
frozen realm internals, deterministic APIs, and controlled value marshalling.

### Scheduler width, call cap, and token budget

**What it does:** Bounds orchestration fan-out and stops runaway scripts without discarding work that
is already in flight.

**How it works:**
1. `computeWorkflowConcurrency` (`Cqb`, `:492045-492047`) returns
   `min(16, max(2, cpuCount - 2))` and initializes the local agent semaphore.
2. Every `agent()` call increments a run-local count after checking the hard 1,000-call cap.
3. The token-budget check compares the current turn's output-token spend with the optional workflow
   total before new work is admitted.
4. Crossing the call cap throws `WorkflowAgentCapError`; crossing budget throws
   `WorkflowBudgetExceededError` and stops new calls while already-started agents can finish.
5. `parallel()` requires functions rather than already-started promises, so the scheduler controls
   when each branch invokes `agent()`.
6. `parallel()` uses all-settled semantics. Ordinary branch failures become `null` plus a logged
   failure; budget failures are counted separately as dropped slots.
7. `pipeline()` runs each item concurrently but stages within an item sequentially. A `null` stage
   result short-circuits the rest of that item's pipeline.
8. The phase table is index-stable; first use publishes the phase, and agent records reference that
   index.
9. Stalled local agents can retry up to five times. A separate throttling heuristic detects a slow,
   tiny response with no stop reason, waits 45 seconds, and performs one throttle retry.

**Why this approach:**
- CPU-relative width uses available parallelism while reserving host capacity; lower/upper clamps make
  behavior reasonable on both small and very large machines.
- A hard call cap catches infinite loops even when no token budget was configured.
- All-settled composition lets broad research workflows retain partial results.
- The trade-off is that `parallel()` failures become data-level nulls rather than failing the whole
  script; the failure list and progress log preserve diagnostics.

**Key insight:** Concurrency is bounded per run, while the call cap and token budget bound total work;
they solve different failure modes.

### Agent option validation and execution policy

**What it does:** Turns one `agent(prompt, opts)` call into a least-authority subagent with validated
model, tool, output, and isolation behavior.

**How it works:**
1. Options are cloned out of the VM. Schema objects use a WeakMap memo so the same realm object maps to
   one host clone.
2. `disallowedTools` and `bashCommandClamp` must be arrays of trimmed nonempty strings. Invalid input
   refuses the spawn rather than silently losing a restriction.
3. Bash clamps must parse as exact Bash permission rules. MCP deny entries are checked for empty server
   names, unsupported wildcards, spelling/case slips, and whether they can match the current or
   declared future tool surface.
4. In auto mode, the prompt/schema/agent type are sent to the delegated-action safety classifier before
   an agent is launched. Schemas over 4 KiB or unserializable schemas fail the classification safely.
5. Custom `agentType` must exist and remain allowed by permission policy. Its own denied tools are
   combined with the workflow-subagent deny set.
6. Model/effort options are resolved against parent model, permission mode, agent definition, and
   organization restrictions; restriction fallback emits a warning rather than silently changing the
   model.
7. `schema` is compiled to a StructuredOutput tool. A structured agent must call that tool; missing or
   invalid final output fails even if ordinary text exists.
8. Local worktree isolation is created and cleaned/retained through the normal subagent worktree path.
   The dormant remote-isolation branch is separate and rejects when unavailable.
9. The workflow-subagent definition denies agent spawning, SendMessage/team delegation, and Workflow,
   preventing recursive unbounded orchestration.
10. Final agent text is treated as an untrusted return value. Auto mode performs a hand-back safety
    review before the script consumes it.

**Why this approach:**
- Deny/clamp options are security controls, so “invalid means ignore” would widen authority.
- Structured output needs a tool-enforced contract; asking for JSON in prose is not sufficient.
- Model fallback must remain visible because cost/capability may affect workflow design.
- The trade-off is substantial validation before each distinct spawn, justified because a workflow
  can amplify one bad option across hundreds of agents.

**Key insight:** `agent()` is a policy-checked spawn request, not a direct constructor for an unrestricted
child loop.

### Chained-prefix journal and resume

**What it does:** Replays completed agent calls only while the new execution exactly matches the prior
workflow prefix.

**How it works:**
1. `WorkflowJournal` (`Hma`, `:491990-492020`) stores append-only JSON lines under the run-specific
   transcript directory.
2. Loading tolerates a missing file and skips malformed individual lines instead of discarding the
   complete journal.
3. Entries are indexed into completed results and lists of started attempts.
4. `computeWorkflowJournalKey` (`LFp`, `:491986-491989`) hashes the previous prefix key, prompt, and a
   stable serialization of execution-relevant options.
5. Included options are schema, model, effort, isolation, agentType, disallowedTools, and
   bashCommandClamp. Object keys are sorted; functions and `__proto__` are excluded.
6. Each agent advances the rolling prefix key. Before the first miss, a matching result is emitted as
   cached and returned immediately.
7. The first missing key flips the run to live mode. Every later call runs live even if an isolated
   later hash happens to exist.
8. A live attempt appends `started` after it receives an agent ID and appends `result` only for a
   non-null completed result.
9. Resume reuses the original run ID but refuses while its prior task is still running.

**Why this approach:**
- Chaining the previous key makes the cache sensitive to ordering and all prior calls, not just one
  prompt in isolation.
- Longest-prefix replay is understandable after script edits: unchanged early work is reused and the
  changed suffix reruns.
- Append-only lines survive partial writes better than rewriting one large state file.
- The trade-off is deliberately conservative cache reuse after the first miss, avoiding surprising
  noncontiguous replay when control flow changes.

**Key insight:** Resume is deterministic prefix replay, not a global memo table keyed by prompt.

### Progress state and background lifecycle

**What it does:** Maintains one current workflow snapshot for the TUI, SDK stream, Remote Control,
notifications, and persisted task output.

**How it works:**
1. `registerWorkflowTask` (`hma`, `:491098-491142`) creates a running task with script/run metadata,
   counters, progress array, abort controller, and per-agent controllers.
2. `updateWorkflowProgressBatch` (`yma`, `:491167-491216`) upserts agent and phase records by
   `(type,index)` and appends log records.
3. Agent count is the maximum started index. Token/tool totals are recomputed from current agent
   records, preventing retries from accumulating stale snapshots.
4. Only logs are trimmed when the array exceeds the retention threshold; agent and phase records are
   never removed by log pressure.
5. `createWorkflowProgressBatcher` (`Wqb`, `:493938-493969`) batches frequent updates, updates the task
   registry, and sends filtered accumulated snapshots to SDK/bridge consumers with a heartbeat rule.
6. `startLocalWorkflowTask` (`Nkn`, `:493989-494268`) runs asynchronously, publishes progress, chooses
   completed/failed/killed/adopted, writes output, and optionally sends one completion notification.
7. Skip and retry abort only the selected agent controller with distinct reasons. Kill aborts the
   entire task; pause/adopt preserves resume metadata.
8. Completion output includes full result, failures, agent counts, token/tool totals, and the
   non-log progress snapshot. Notifications include bounded result text and journal recovery guidance.
9. A notification claim prevents duplicate terminal delivery.

**Why this approach:**
- Index-keyed upsert makes progress a level snapshot rather than a fragile sequence of start/finish
  edges.
- Recomputing counters from current records avoids double-counting retries.
- Batching reduces render/IPC overhead while retaining a current snapshot for late joiners.
- The trade-off is more state than a delta-only stream, necessary because SDK and Remote Control
  consumers can attach after execution begins.

**Key insight:** Workflow progress is a replicated state model; logs are events, but agents and phases
are replaceable state records.

### Workflow discovery and one-level composition

**What it does:** Builds the named-workflow catalog and lets a workflow call another named/path
workflow without allowing recursive nesting.

**How it works:**
1. Built-ins are registered in memory. Plugins load `.js` files from declared default/custom workflow
   paths with regular-file and 512-KiB limits.
2. User and project directories load only `.js`; `.mjs`, `.cjs`, and `.ts` are counted as near misses
   for diagnostics.
3. `getAllWorkflows` (`J6t`/`Fqb`, `:493731-493741`) merges precedence so user/project entries shadow
   plugin entries, and both shadow same-named built-ins.
4. Discovery is cached by project/name-only context and can be invalidated after configuration/plugin
   changes.
5. `createChildWorkflowFunction` (`AFp`, `:491687-491803`) resolves a string name or `{scriptPath}` and
   compiles the child body in a fresh hardened realm.
6. Child calls share the parent's scheduler hooks, token budget, timers, and abort signal; agent phases
   are prefixed to keep UI grouping distinct.
7. Args are cloned into the child realm. Logs are prefixed with the child name.
8. The child's own `workflow()` global always rejects, limiting composition to one level.

**Why this approach:**
- User/project shadowing enables local customization while plugin and built-in defaults remain
  available under nonconflicting names.
- A fresh realm prevents a child script from inheriting mutable globals from its parent.
- Shared scheduler/budget preserves one resource envelope across composition.
- The one-level limit prevents recursive workflow expansion and difficult nested resume semantics.

**Key insight:** Child workflows compose script logic, not resource budgets or nesting depth.

### Server-authored launch protocol

**What it does:** Safely carries a workflow script from the remote control plane into a remote Claude
Code session and returns one machine-readable result line.

**How it works:**
1. `handleWorkflowLaunchEvent` (`t9b`, `:494648-494740`) accepts only UUID-bearing events received on
   the authenticated remote/SSE path in a remote session.
2. `parseWorkflowLaunchPointer` (`dUp`, `:494557-494582`) requires a filestore path below
   `/.workflow/`, a lowercase 64-hex SHA-256, and a positive bundle size capped at 4 MiB.
3. Managed/org policy is checked before fetching. A ledger distinguishes transient fetch failures from
   final validation failures and de-duplicates repeated event UUIDs.
4. The fetched byte length must equal the pinned size, and a timing-safe SHA-256 comparison must pass.
5. `decodeWorkflowBundle` (`fUp`, `:494588-494617`) requires version 1 and two big-endian
   length-prefixed frames: nonempty script and optional args JSON. Truncation, oversized frames, or
   trailing bytes fail.
6. Only one distinct launch is allowed in the session. Valid content is stored in a random one-use
   in-memory handoff slot.
7. The handler prepends hidden `/workflow-launch-exec <slot>` input. The hidden command consumes and
   deletes the slot before calling the shared workflow runner.
8. Result serialization uses a single `remote-workflow:` line, strips line separators that could forge
   protocol lines, and progressively drops diagnostics before the primary result when the 100-KiB cap
   is exceeded.
9. A server-authored carrier can use the narrow review-session policy carve-out, but managed
   `disableWorkflows` still wins.

**Why this approach:**
- The event contains only a pinned pointer, keeping large code out of the control frame.
- Size plus digest verification binds the fetched bytes to the authorized event.
- A one-use slot prevents a model or replayed command from choosing arbitrary hidden-command input.
- Result degradation prioritizes the actual workflow result over failure diagnostics.
- The trade-off is a multi-stage protocol, appropriate for executing server-supplied code in a remote
  worker.

**Key insight:** Transport authentication authorizes the carrier; content size, digest, framing, and
policy independently authorize the bytes that execute.

### Advisory workflow-size policy

**What it does:** Communicates a preferred orchestration scale without changing scheduler hard limits.

**How it works:**
1. `resolveWorkflowSizeGuideline` (`Awt`, `:406670-406673`) prefers the settings-file value, then the
   session value, and otherwise returns default `medium`.
2. The sizes map to advisory targets: small under 5 agents, medium under 15, large under 50;
   unrestricted emits no prompt addition.
3. The value is memoized for the initial tool description so prompt caching remains stable.
4. A mid-session change is delivered as an attachment rather than rewriting the cached tool
   definition.
5. Explicit settings hide the redundant `/config` row; session config remains available otherwise.
6. The scheduler does not read the guideline. Its real limits remain concurrency, 1,000 calls, and the
   token budget.

**Why this approach:**
- Model guidance can reduce accidental cost without breaking intentionally large user-requested
  workflows.
- Separating advisory size from safety caps keeps policy understandable.
- Memoization protects prompt-cache stability; attachments carry mutable state.
- The trade-off is non-enforcement, explicitly stated in the prompt so the model can exceed it when
  user intent requires.

**Key insight:** Size guidance shapes planning; scheduler limits enforce safety.

## 2.1.220 to 2.1.227 assessment

### Verified 2.1.223 delta

The concrete Workflow-owned delta is one new AST branch at 2.1.227 `:490936`:
`ImportExpression` raises a syntax error before source transformation. The 2.1.220 equivalent walker
at `:386240-386249` rejected reserved identifiers and `with`, but not dynamic import. Both versions
also install a VM `importModuleDynamically` rejection callback (2.1.220 `:386365-386367`; 2.1.227
`:491002-491005`). Therefore the new mechanism is accurately described as compile-time structural
rejection added in front of an existing runtime denial.

This matches the 2.1.223 changelog: workflow scripts could use dynamic `import()` to execute outside
the intended sandbox. The current design closes the syntax route before a script object is admitted
and retains the callback for defense in depth.

### Stable carryover that was revalidated

- The metadata-first pure-literal contract, 512-KiB script cap, await transform, determinism shim,
  frozen realm, concurrency formula, 1,000-call cap, journal prefix chain, progress snapshot, one-level
  child workflows, and server-authored launch path remain present.
- `workflowSizeGuideline` still defaults to medium and remains advisory.
- The workflow result and progress channels remain background-task based.
- No other 2.1.221-2.1.227 changelog bullet should be attributed to a new Workflow event or transport.
  Worktree isolation and background permission restrictions are shared Agent/Permissions behavior;
  Remote Control folding and state issues are owned by their integration modules.

## Operational invariants

- The executed script is resolved and parsed before approval.
- Metadata is never evaluated during discovery.
- Dynamic import, `with`, `await using`, current time, randomness, eval, and wasm generation are not
  available to workflow scripts.
- Every VM/host asynchronous boundary is wrapped.
- Invalid deny/clamp configuration refuses a spawn instead of widening tools.
- New agent work stops at the call cap or token budget; in-flight work may settle.
- Resume reuses only the longest unchanged call prefix.
- Agent and phase progress records are never trimmed as logs.
- Child workflows cannot recursively call another child workflow.
- Server-authored bytes must satisfy policy, path, size, digest, framing, and one-use handoff checks.
- The size guideline never substitutes for hard resource controls.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:

- `resolveWorkflowSizeGuideline` (`Awt`) - current/default advisory size.
- `hardenVMIntrinsics` (`L6t`) - shared realm hardening pass.
- `installDeterminismShim` (`VQo`) - Date/Math nondeterminism guard.
- `transformWorkflowAsyncBoundaries` (`dqb`) - AST security gate and await transform.
- `compileWorkflowScript` (`o0t`) - hardened VM compilation.
- `registerWorkflowTask` (`hma`) - creates current workflow task state.
- `updateWorkflowProgressBatch` (`yma`) - index-keyed progress reducer.
- `parseWorkflowDefinition` (`EL`) - metadata and executable-body parser.
- `createChildWorkflowFunction` (`AFp`) - one-level nested workflow runner.
- `computeWorkflowJournalKey` (`LFp`) - chained deterministic cache key.
- `WorkflowJournal` (`Hma`) - append-only started/result store.
- `computeWorkflowConcurrency` (`Cqb`) - per-run semaphore width.
- `createWorkflowHooks` (`FFp`) - orchestration scheduler and agent policy.
- `getAllWorkflows` (`J6t`) - merged named-workflow registry.
- `createWorkflowRuntime` (`JFp`) - VM context and host API population.
- `runWorkflowScript` (`ZFp`) - execution and result/error normalization.
- `createWorkflowProgressBatcher` (`Wqb`) - task and SDK snapshot publisher.
- `startLocalWorkflowTask` (`Nkn`) - full background lifecycle.
- `parseWorkflowLaunchPointer` (`dUp`) - remote carrier pointer validation.
- `decodeWorkflowBundle` (`fUp`) - versioned frame decoder.
- `handleWorkflowLaunchEvent` (`t9b`) - authenticated event/ledger/handoff controller.
- `resolveWorkflowInput` (`iVp`) - tool input source precedence.
- `WorkflowTool` (`rnS`) - external tool contract.
