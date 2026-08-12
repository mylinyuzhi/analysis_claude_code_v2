# Hook runtime, matching, execution, and trust in 2.1.227

## Scope and evidence

This document analyzes the current hook implementation in
`/lyz/codespace/claude-code-bomb/versions/2.1.227/extract/cli_inner_pretty.js`. The principal ranges are:

- `:44834-44870` - canonical event-name list.
- `:55493-55614` - the five settings-defined hook schemas.
- `:187727-187767` - effective settings, managed-only policy, and configuration snapshots.
- `:188600-188730` - validated hook-result schema.
- `:190019-190273` - asynchronous response validation, registry, and delivery.
- `:479213-479290` - agent-frontmatter origin trust and registration.
- `:532863-533738` - event-specific input builders and the event registry.
- `:533739-536187` - async registration, JSON translation, command spawning, matching, streaming and
  ambient execution.
- `:343064-345116` and `:355500-355590` - permission arbitration and restricted-fork propagation.

The readable 2.1.88 tree is useful for naming long-lived concepts, but current behavior and all line
anchors below come from 2.1.227. The 2.1.220 bundle was compared directly for event names and
post-window decision points.

## Executive findings

1. The hook subsystem is a typed event router, not a collection of arbitrary shell callbacks. Each
   event builds a stable input envelope and has an event-specific result consumer.
2. The public surface did not grow from 2.1.220 to 2.1.227: both versions contain the same 31 events.
   The significant 2.1.222 change is at the permission consumer boundary.
3. Hook configuration is multi-origin, but execution is gated by managed policy, workspace trust,
   plugin eligibility, and agent-definition origin trust.
4. Selection and execution are deliberately separated. Matching, rule evaluation, and de-duplication
   finish before processes, HTTP calls, MCP calls, or verifier models are started.
5. Concurrent hook completion does not make permission behavior nondeterministic. Aggregation applies
   an explicit severity ordering.
6. Hook output is data with a schema. Arbitrary JSON keys are ignored, event-specific output must name
   the correct event, terminal control sequences are allowlisted, and invalid replacement output is
   rejected by the tool's output schema.
7. Async hooks have an exactly-once delivery registry, while `asyncRewake` is a separate control path
   that only wakes the model for exit code 2.

## Runtime surface

The 31 events divide naturally into six families:

| Family | Events | Primary result consumer |
|---|---|---|
| Tool and permission | PreToolUse, PostToolUse, PostToolUseFailure, PostToolBatch, PermissionRequest, PermissionDenied | permission engine and tool-result builder |
| Turn and prompt | UserPromptSubmit, UserPromptExpansion, Stop, StopFailure, MessageDisplay | agent loop and transcript renderer |
| Session and setup | SessionStart, SessionEnd, Setup, ConfigChange, CwdChanged, FileChanged, DirectoryAdded, InstructionsLoaded | session bootstrap and ambient services |
| Agent and task | SubagentStart, SubagentStop, TeammateIdle, TaskCreated, TaskCompleted | subagent/team scheduler |
| Compaction | PreCompact, PostCompact | compaction controller |
| External lifecycle | Elicitation, ElicitationResult, WorktreeCreate, WorktreeRemove, Notification | MCP, worktree, and notification controllers |

Settings accept five types:

| Type | Execution boundary | Output contract |
|---|---|---|
| `command` | local child process, shell or direct exec | stdout plus exit status; optional JSON |
| `prompt` | one model classification/evaluation | structured hook decision |
| `agent` | bounded agentic verifier | structured hook decision |
| `http` | HTTP POST of hook input | JSON response only |
| `mcp_tool` | configured MCP client/tool call | tool response parsed as hook output |

`callback` and `function` are internal-only runtime types. A callback receives the typed hook input and
may return the same JSON result shape. A function hook receives the conversation messages and reduces
to success/block, which is useful for in-process Stop enforcement.

### Event registry and typed input construction

**What it does:** Converts each event occurrence into a stable input envelope and dispatches it to the
correct event wrapper.

**How it works:**
1. `HOOK_EVENT_NAMES` (`jz`, `cli_inner_pretty.js:44839-44869`) is the validation source for settings
   and frontmatter. Unknown event keys are rejected before runtime.
2. `createBaseHookInput` (`Bh`, `:533824-533841`) supplies session ID, transcript path, current working
   directory, prompt ID, permission mode, agent identity, and normalized effort when available.
3. The event wrapper adds only its event-specific fields. PreToolUse adds tool name/input/use ID;
   SessionStart adds source/model/title; DirectoryAdded adds directory/source; Elicitation adds server,
   mode, URL, ID, and requested schema.
4. `HOOK_EVENT_REGISTRY` (`reS`, `:533620-533670`) maps every canonical name to exactly one wrapper.
5. Wrappers choose either the streaming runner or the ambient batch runner according to whether the
   event participates in an active model turn.
6. Event consumers deliberately interpret different subsets of the common result vocabulary. For
   example, PreCompact can replace custom instructions and block compaction; FileChanged collects new
   watch paths; MessageDisplay accepts display replacement text.

**Why this approach:**
- A shared envelope gives all hook transports the same provenance without forcing every event to
  invent its own session metadata.
- Per-event wrappers keep consumer rules explicit. A field meaningful for PostToolUse cannot silently
  affect SessionEnd.
- One registry makes schema validation, SDK export, and dispatch coverage auditable.
- The trade-off is a large registry and many thin wrappers, but this is safer than a generic payload
  whose allowed side effects depend on undocumented conventions.

**Key insight:** Event names select both an input schema and an authority boundary; they are not merely
labels attached to arbitrary data.

### Configuration snapshot and source merge

**What it does:** Builds the ordered candidate list for one hook event while honoring managed policy,
safe mode, plugins, and per-session frontmatter.

**How it works:**
1. `getInitialEffectiveHooks` (`_0s`, `:187735-187743`) resolves the startup configuration. A managed
   `disableAllHooks` produces an empty set. Managed-only policy and safe mode select managed hooks.
2. `getInitialHooksSnapshot` (`Spe`, `:187762-187767`) stores that effective configuration per session
   instead of re-reading a mutable object during every dispatch.
3. `collectHooksForEvent` (`meS`, `:534524-534553`) has an explicit `managedHooksOnly` fast path used by
   restricted internal checks. It returns only policy hooks and still honors managed disable.
4. The normal path begins with the initial effective settings snapshot, conditionally adds current
   non-managed settings, then eligible plugin hooks.
5. Agent- and skill-frontmatter hooks are appended from the session registry only when the runtime is
   not in managed/safe-only mode.
6. Plugin records retain plugin root and plugin ID; skill records retain skill root. Those fields later
   scope substitution, de-duplication, credential injection, telemetry, and activity attribution.
7. `hasHookForEvent` (`v5`, `:534554-534565`) provides a cheap preflight so high-frequency wrappers do
   not build inputs or start runners when no source can contribute.

**Why this approach:**
- Managed-only operation must be a source-selection rule, not a filter after user hooks have already
  executed.
- A startup snapshot prevents a settings reload from partially changing a dispatch in progress.
- Preserving origin metadata enables security decisions at the process boundary rather than trusting
  a flattened command string.
- The trade-off is that the merge looks more complex than concatenating arrays; the complexity
  represents distinct trust domains that must not collapse into one another.

**Key insight:** Hook order begins as policy provenance. Flattening source identity too early would
make later substitution, credentials, and telemetry unsafe or inaccurate.

### Workspace and definition-origin trust

**What it does:** Prevents repository-controlled hook code from running before the relevant workspace
or agent-definition origin has been trusted.

**How it works:**
1. Both `runHooksStreaming` (`JWp`, `:534804-535768`) and `executeHooksOutsideREPL` (`zN`,
   `:535786-536028`) exit before selection when managed policy disables hooks.
2. `shouldSkipHookDueToTrust` (`yit`, `:533821-533823`) blocks all ordinary hook execution until the
   workspace trust decision is accepted.
3. Agent-frontmatter registration has a second, origin-specific check. `isAgentHookOriginTrusted`
   (`VJo`, `:479213-479218`) trusts built-in/plugin/policy sources, user or CLI settings, and otherwise
   checks the canonical project key derived from the definition's own base directory.
4. `agentTrustRoot` (`NOp`, `:479223-479228`) maps `.claude/agents` back to its project root so the key
   matches the trust dialog's project entry.
5. `reportUntrustedAgentHookOrigin` (`KJo`, `:479236-479257`) escapes control/format characters in the
   displayed key, explains the exact blocked origin, and emits cause-specific telemetry.
6. `hasNonEmptyHooks` (`YJo`, `:479261-479268`) checks actual nested hook arrays, avoiding trust
   warnings for an empty `hooks` object.
7. Only after these gates does `registerFrontmatterHooks` (`BOp`, `:479270-479289`) copy definitions
   into the per-session registry. Subagent Stop hooks are converted to SubagentStop during registration.

**Why this approach:**
- Workspace trust protects the current repository, while origin trust protects definitions imported
  from another directory. Either one alone leaves a gap.
- Checking before registration reduces the chance that untrusted entries leak into later enumeration
  or diagnostics.
- Canonical project keys align the enforcement decision with what the user actually approved.
- The trade-off is that a valid agent definition from an additional directory may require a separate
  trust action; automatic reachability is intentionally not treated as consent.

**Key insight:** A hook's authority follows the folder that supplied executable configuration, not the
session that happens to invoke it.

### Matcher and `if:` selection

**What it does:** Reduces merged configuration to the hooks relevant to one event and, for tool events,
one semantic tool input.

**How it works:**
1. `getMatchingHooks` (`H_a`, `:534566-534742`) derives a match query by event: tool name, command name,
   session source, setup/compact trigger, notification type, end reason, agent type, MCP server,
   configuration source, load reason, directory source, or file basename.
2. Events in the list-form set accept exact alternatives separated by `|` or `,`, including hyphens
   and spaces. Tool names are canonicalized and expanded through aliases before equality comparison.
3. A matcher containing regex syntax falls back to `RegExp` and is tested against the canonical name,
   legacy aliases, and session aliases. Invalid regular expressions fail closed.
4. Bare `mcp__server` matchers are warned once because exact-list semantics match no concrete MCP tool;
   the correct all-tools form is `mcp__server__.*`.
5. Matching records are expanded to individual hook definitions while retaining source roots and a
   `matcherIsMatchAll` telemetry bit.
6. Command, prompt, agent, HTTP, and MCP hooks are de-duplicated by source root plus execution-defining
   fields and `if:` expression. The same command from two different plugins is not collapsed.
7. If any selected hook contains `if:`, `buildHookIfEvaluator` (`peS`, `:534444-534472`) asks the target
   tool to prepare its permission matcher for the parsed input. Rule tool name and content must both
   match.
8. An `if:` expression on a non-tool event cannot be evaluated and is skipped. It never defaults to
   true.
9. HTTP hooks are removed for SessionStart and Setup because those phases do not support that
   transport.

**Why this approach:**
- Fast exact matching handles ordinary names predictably, while regex fallback preserves expressive
  matching for advanced configurations.
- Tool-owned permission matchers understand Bash commands and file paths better than a generic string
  predicate.
- De-duplication prevents the same effective hook from running twice after configuration merging,
  while source scoping avoids merging unrelated plugin code.
- The trade-off is dual matcher semantics. The warning for bare MCP servers makes the most dangerous
  boundary visible.

**Key insight:** `matcher` selects an event subject; `if:` selects a semantic tool invocation. They are
separate filters with different parsers and different failure behavior.

### Streaming versus ambient execution

**What it does:** Chooses an execution contract appropriate to active turns versus lifecycle events.

**How it works:**
1. `executeHooks` (`jN`, `:534780-534803`) is the public streaming adapter. It delegates to
   `runHooksStreaming` and narrows fields in restricted agent contexts.
2. `runHooksStreaming` emits progress attachments immediately, then launches selected hooks as async
   generators and merges their yielded results.
3. The generic path executes independent hooks concurrently. Completion order can affect ordinary
   messages, but permission aggregation uses explicit precedence rather than last-writer-wins.
4. Internal callback-only batches use a smaller path that avoids public progress/telemetry noise and
   translates only recognized semantic fields.
5. `executeHooksOutsideREPL` serializes the input once, starts one promise per hook, awaits all results,
   and returns compact records with command, success, output, blocked, cancellation, watch paths, and
   system message.
6. The ambient runner supports command, HTTP, MCP, and callback hooks. Prompt, agent, and function
   hooks fail as unsupported outside the conversation context instead of constructing a synthetic one.
7. Both runners share trust, matching, timeout composition, command spawning, JSON validation, plugin
   attribution, and terminal-sequence filtering.

**Why this approach:**
- An active turn needs incremental progress and rich typed effects; a lifecycle call usually needs a
  bounded aggregate before it can continue.
- Concurrency prevents one slow independent hook from serially delaying all others.
- Explicitly refusing context-dependent hook types outside the REPL is safer than evaluating a model
  without the conversation state the hook author expected.
- The trade-off is two aggregation implementations. Shared low-level helpers keep their security and
  parsing behavior aligned.

**Key insight:** The two runners differ in delivery semantics, not in trust. Ambient execution is not
a privileged shortcut around the normal gates.

### Hook-type dispatch

**What it does:** Executes each selected hook through the transport implied by its type while
normalizing outcomes into the same result vocabulary.

**How it works:**
1. Command hooks call `spawnHookCommand` and interpret stdout, stderr, exit status, timeout, and
   backgrounding.
2. Prompt hooks substitute the serialized input into the prompt and run a bounded evaluator model.
   They require conversation context and are cancelled for internal evaluator-agent recursion.
3. Agent hooks run a bounded verifier with conversation context. They are likewise prevented from
   recursively launching in the internal evaluator context.
4. HTTP hooks POST the serialized input. Empty bodies are accepted as an empty result; nonempty bodies
   must be valid hook JSON. HTTP is excluded from SessionStart and Setup.
5. MCP hooks locate an already-configured server/tool, interpolate input values from the event payload,
   call the client with timeout/abort handling, and parse the returned body through the hook schema.
6. Callback hooks invoke the host-provided function with input, tool-use ID, abort signal, hook index,
   and limited state/attribution access.
7. Function hooks receive messages and the abort signal. Truthy completion succeeds; false becomes
   the configured blocking error; exceptions become nonblocking execution errors.
8. Every transport produces one of `success`, `blocking`, `non_blocking_error`, or `cancelled`, plus
   optional semantic fields.

**Why this approach:**
- A transport-neutral result shape lets event consumers focus on authority and side effects rather
  than process, HTTP, MCP, or model mechanics.
- Recursion guards prevent verifier hooks from triggering an unbounded verifier hierarchy.
- MCP hooks reuse configured authentication and server policy rather than inventing a second client.
- The trade-off is that not every type is available in every phase; truthful refusal is preferable to
  silently running with incomplete context.

**Key insight:** Hook type chooses how code runs, while hook event chooses what the result is allowed to
mean.

### Command execution and substitution security

**What it does:** Runs command hooks with platform-correct process behavior while preventing plugin
configuration values from becoming executable shell syntax.

**How it works:**
1. `spawnHookCommand` (`iri`, `:534133-534403`) distinguishes shell form from exec form. Presence of
   `args` selects direct executable spawning; absence selects Bash/zsh/sh or PowerShell.
2. Exec form substitutes project, plugin-root, plugin-data, and user-config placeholders separately in
   the executable and each argument. The resulting strings never pass through a shell parser.
3. Shell form rejects `${user_config.*}` for plugin hooks. The error tells authors to use exec form or
   the derived `CLAUDE_PLUGIN_OPTION_*` environment variable.
4. Plugin-only variables are rejected when the hook lacks a plugin origin. Skill hooks may use their
   root but not plugin data.
5. The plugin directory must still exist at execution time. A missing installation produces a
   reinstall-oriented error instead of spawning in an unintended directory.
6. The environment starts from the controlled process environment, adds project/plugin metadata,
   terminal dimensions, event-specific `CLAUDE_ENV_FILE`, and credentials only for eligible official
   plugins.
7. `safeHookCwd` (`eri`, `:535770-535775`) uses the current directory if it still exists, otherwise the
   original session directory. This handles hooks that delete or rename the current path.
8. POSIX children run detached for process-group cancellation; Windows chooses PowerShell or Git Bash
   explicitly and hides the child window.
9. Input JSON is written to stdin. Timeout and parent abort share a composed signal, and spawn failures
   are distinguished from nonzero exits.

**Why this approach:**
- Direct exec form is the only reliable way to preserve substituted strings as data across quotes,
  dollars, backticks, and platform shell differences.
- Retaining shell form preserves compatibility for existing hook scripts and pipelines.
- Late directory validation handles plugin uninstall/reload races.
- The trade-off is two process paths and platform-specific warnings, justified by compatibility and
  the security difference between arguments and shell source.

**Key insight:** The security boundary is not substitution itself; it is whether the substituted value
is parsed again as code.

### Exit status and JSON translation

**What it does:** Converts process/transport output into typed effects without letting malformed JSON
erase a deliberate block.

**How it works:**
1. `parseCommandHookOutput` (`ori`, `:533898-533912`) treats output not starting with `{` as plain text.
   JSON-looking output is parsed and validated by `parseAndValidateHookJson` (`rqp`,
   `:533842-533871`).
2. HTTP responses use the stricter `parseHttpHookOutput` (`nqp`, `:533913-533939`): nonempty non-JSON
   bodies are errors.
3. Exit status 0 is success. Plain stdout becomes a success attachment unless suppressed by valid JSON.
4. Exit status 2 is blocking. A JSON schema error does not downgrade it; stderr remains the blocking
   reason. Missing plugin scripts receive a narrow nonblocking exception for selected stop/task events.
5. Other nonzero statuses become nonblocking errors. Repeated spawn failures for the same event and
   command are de-duplicated to reduce noise.
6. `translateHookJsonResult` (`mIn`, `:533940-534132`) maps common fields such as `continue: false`,
   `decision`, `reason`, `systemMessage`, and `terminalSequence`.
7. `hookSpecificOutput.hookEventName` must equal the event being executed. A mismatched name throws
   instead of applying a field under the wrong authority.
8. Event-specific fields include PreToolUse permission/input changes, PostToolUse context/output
   replacement, PermissionRequest decisions, PermissionDenied retry, SessionStart watch/reload/title,
   elicitation responses, and MessageDisplay replacement.
9. `persistHookOutput` (`git`, `:533872-533897`) keeps small fields inline and persists larger fields to
   a session-scoped file, returning a preview/reference. Persistence failure falls back to bounded
   truncation.
10. Terminal sequences are accepted only for OSC 0/1/2/9/99/777 and BEL, with an additional OSC 9 body
    restriction.

**Why this approach:**
- Exit code remains an independent control channel when stdout is unavailable or malformed.
- Event-name validation prevents a generic producer from smuggling privileged fields into another
  event's result.
- Out-of-band persistence preserves useful diagnostics without flooding the model context.
- The trade-off is a richer parser and legacy fields such as `updatedMCPToolOutput`; retaining them
  avoids breaking existing integrations while the general replacement field is preferred.

**Key insight:** A blocking exit is not cancelled by a parsing failure; control intent and structured
payload validity are evaluated independently.

### Deterministic result aggregation

**What it does:** Merges results from concurrently completing hooks into stable permission and tool
effects.

**How it works:**
1. `runHooksStreaming` forwards messages, system messages, additional context, initial user messages,
   watch paths, session titles, display content, and continuation stops as they arrive.
2. Permission behavior is folded with the order `deny` over `defer` over `ask` over `allow` over
   `passthrough`. A later weaker result cannot replace an earlier stronger one.
3. Updated input coupled to permission behavior is emitted only when the winning behavior is `allow`
   or `ask`. A denied or deferred call does not apply a weaker hook's rewritten input.
4. A standalone updated input is still propagated when a hook intentionally omitted a permission
   behavior.
5. PostToolUse replacement prefers `updatedToolOutput`; deprecated `updatedMCPToolOutput` is used only
   when the general field is absent and the consumer confirms an MCP tool.
6. The tool dispatcher validates a replacement against the tool's output schema and mapping function.
   Invalid replacement reverts to the original result and adds a hook execution error.
7. PreToolUse updated input is similarly checked against the input schema before permission
   arbitration. Significant validation failures become denial.
8. Outcomes and injected-character counts are recorded per hook and per plugin after all runners
   settle.

**Why this approach:**
- Concurrent execution improves latency, but security decisions need an associative severity rule.
- Revalidating replacement values at the consumer preserves each tool's invariants.
- Prefer-new/fallback-old behavior supports gradual migration from MCP-only output replacement.
- The trade-off is that message order may follow completion order while permission order does not; the
  distinction is intentional because only one is security-sensitive.

**Key insight:** Concurrency changes when results arrive, not which permission result wins.

### PreToolUse permission boundary

**What it does:** Treats PreToolUse output as a proposal that must survive deterministic policy,
safety checks, and context-specific `canUseTool` requirements.

**How it works:**
1. PreToolUse may return deny, defer, ask, allow, or updated input. The wrapper validates input before
   passing it to permission arbitration.
2. `arbitratePreToolHook` (`VSn`, `:344395-344430`) makes hook deny final, but re-runs rule-based checks
   for allow and ask using the rewritten input.
3. A deterministic deny always wins. A safety/ask result enters the full permission pipeline.
4. Hook `ask` sets `hookAskFloor`, ensuring an auto-mode classifier allow cannot erase the explicit
   request for confirmation.
5. Hook `allow` bypasses the prompt only when no stronger rule remains and `requireCanUseTool` is
   false.
6. The fork-context builder propagates `requireCanUseTool` and the internal fork runner defaults it to
   true (`:355500-355590`). Explicit restricted agents also set it true at their call sites.
7. Consequently, summaries, compaction, renames, and comparable internal background forks still call
   their restricted permission callback after a hook allows the tool.

**Why this approach:**
- Repository and plugin hooks are extensibility code, not a higher policy tier than managed rules or
  an internal task's restricted tool contract.
- Defaulting internal forks to the stricter path prevents callers from needing to remember the flag.
- Rechecking rewritten input closes a time-of-check/input-substitution gap.
- The trade-off is an additional permission pass and the possibility that a hook-approved background
  action is still denied; that is the intended least-authority behavior.

**Key insight:** The 2.1.222 repair changes who has final authority, not what a hook can express.

### Asynchronous hook lifecycle

**What it does:** Allows long-running command hooks to leave the foreground while preserving bounded,
exactly-once output delivery and an optional model-rewake path.

**How it works:**
1. A command definition can set `async`, or its first completed JSON line can return `async: true`.
   `forceSyncExecution` disables both paths for callers that require completion before proceeding.
2. `registerAsyncHook` (`YWp`, `:533739-533820`) separates ordinary async from `asyncRewake`.
3. Ordinary async backgrounding registers process ID, hook ID/event/name, command, plugin ID, process
   wrapper, and a response-delivered flag in `AsyncHookRegistry` (`_Wu`, `:190066-190093`).
4. Progress output is sampled while the process runs. `checkForAsyncHookResponses` (`SWu`,
   `:190140-190239`) only consumes completed processes.
5. The consumer scans stdout for the first JSON line without the async marker, validates it through
   `salvageAsyncHookJson` (`gWu`, `:190019-190053`), records the final process outcome, marks delivery,
   and removes the registry entry.
6. If the full schema is invalid, recognized `systemMessage`, numeric/boolean metrics, and
   event-specific additional context are salvaged independently; malformed fields are dropped.
7. Completing an async SessionStart hook invalidates the session environment cache so exported values
   become visible.
8. `asyncRewake` does not enter the ordinary response registry. It waits on a tracked promise and, only
   for exit code 2, enqueues a next-priority task notification containing bounded summary and feedback.
9. `flushPendingAsyncRewakeHooks` (`E_a`, `:533713-533720`) waits for tracked rewake promises but caps
   shutdown delay at 30 seconds. Ordinary pending processes are explicitly completed or cancelled by
   `shutdownAsyncHooks` (`W0s`, `:190242-190269`).

**Why this approach:**
- Ordinary async output belongs in transcript/control delivery; a blocking Stop-hook response needs to
  wake the model. Separate registries keep those meanings distinct.
- The delivered flag plus removal is a simple exactly-once protocol within one process.
- Field-level salvage preserves safe context when one optional field is malformed.
- The trade-off is that async completion is polled rather than awaited by the original call; this is
  necessary to let the foreground turn continue.

**Key insight:** `async` means “deliver later”; `asyncRewake` means “resume reasoning only if the hook
blocks.” They are different scheduling contracts.

### Ambient-event side effects

**What it does:** Converts batch-hook outcomes into lifecycle-specific actions without exposing the
full interactive result surface.

**How it works:**
1. `executePreCompactHooks` (`dke`, `:532863-532903`) concatenates successful nonblocked output into
   custom compaction instructions and separately records display status and blockers.
2. `executePostCompactHooks` (`SAt`, `:532904-532927`) reports completion/failure but cannot retroactively
   modify the completed compact summary.
3. `executeConfigChangeHooks` (`Y_t`, `:532928-532936`) clears blocking for policy-settings changes so
   a hook cannot veto managed policy arrival.
4. `executeDirectoryAddedHooks` (`CKt`, `:532937-532945`) matches on source and returns both raw results
   and collected system messages.
5. CwdChanged and FileChanged share an ambient helper that invalidates the environment cache, merges
   returned watch paths, and collects system messages.
6. SessionStart can add context, an initial user message, title, watch paths, and a request to reload
   skills in the same session.
7. WorktreeCreate requires one successful nonempty path. Relative paths resolve against `safeHookCwd`;
   no runnable hook, empty success, and failed execution produce distinct errors.
8. Elicitation and ElicitationResult parse accept/decline/cancel responses and turn decline into an
   explicit blocking reason.

**Why this approach:**
- Lifecycle controllers need narrow domain results, not arbitrary transcript effects.
- Managed policy must remain authoritative even if a ConfigChange observer objects.
- Distinct WorktreeCreate failures make configuration, execution, and output-contract problems
  diagnosable.
- The trade-off is event-specific adapter code, which preserves clear authority boundaries.

**Key insight:** Ambient hooks observe lifecycle changes, but each caller explicitly decides which
effects can alter that lifecycle.

## 2.1.220 to 2.1.227 assessment

### Stable surface

- The event arrays are identical: 31 names in the same order at 2.1.220 `:49367-49397` and 2.1.227
  `:44839-44869`.
- The settings-defined transport set remains command, prompt, MCP tool, HTTP, and agent.
- `asyncRewake`, `managedHooksOnly`, `hookAskFloor`, `updatedToolOutput`, and the deprecated
  `updatedMCPToolOutput` already exist in 2.1.220. Their presence alone is not evidence of a new
  2.1.227 feature.
- DirectoryAdded, frontmatter-origin trust, hyphen-aware exact matching, exit-code-2 preservation,
  async JSON salvage, and spawn-failure de-duplication remain active carryover protections.

### Verified post-window hardening

The 2.1.222 changelog fix is visible in context propagation rather than in the hook registry. The term
`requireCanUseTool` grows from two sites in 2.1.220 to five in 2.1.227. The current fork builder carries
the flag, and the generic internal fork runner defaults it to true. `arbitratePreToolHook` then refuses
to treat hook allow as sufficient when that flag is set. This combination closes the background-task
bypass while preserving hook deny, ask, input rewrite, logging, and progress behavior.

The deeper permission precedence and worktree isolation changes are documented in
[permission_engine_and_auto_mode.md](../38_permissions/permission_engine_and_auto_mode.md). They are
consumer-side security rules and should not be misreported as a new hook transport or event.

### No unsupported attribution

Versions 2.1.221, 2.1.223, 2.1.224, 2.1.225, 2.1.226, and 2.1.227 do not announce a primary hook-runtime
surface addition. Nearby changes in MCP elicitation, file suggestions, compaction, workflow sandboxing,
and session behavior have hook call sites, but their owning algorithms live in those modules. This
report records the current integration points without assigning unrelated changelog bullets to Hooks.

## Operational invariants

- No hook runs before managed disable and workspace trust checks.
- Agent-frontmatter hooks require trust for their own definition origin.
- A hook matcher and a hook `if:` condition are independent filters.
- Invalid `if:` evaluation fails closed.
- Concurrent completion cannot weaken the permission precedence.
- A PreToolUse allow cannot defeat deterministic deny, safety, required interaction, or a restricted
  `canUseTool` callback.
- Updated input and output are revalidated by the owning tool.
- Exit code 2 remains blocking even when JSON validation fails.
- Plugin configuration values are never substituted into shell source.
- Async response delivery is at most once within the process.
- Only allowlisted terminal notification/title sequences can be emitted.
- Managed policy changes cannot be vetoed by ConfigChange hooks.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:

- `getInitialEffectiveHooks` (`_0s`) - resolves the startup policy/settings view.
- `getInitialHooksSnapshot` (`Spe`) - stores per-session initial hook configuration.
- `isHooksManagedOnly` (`_3e`) - detects managed/safe-only source restrictions.
- `areHooksDisabledByPolicy` (`Sse`) - global managed disable gate.
- `isAgentHookOriginTrusted` (`VJo`) - agent-definition origin gate.
- `registerFrontmatterHooks` (`BOp`) - registers trusted agent/skill hook definitions.
- `createBaseHookInput` (`Bh`) - shared event provenance envelope.
- `collectHooksForEvent` (`meS`) - source merge.
- `getMatchingHooks` (`H_a`) - matcher, de-duplication, and `if:` selection.
- `hookMatcherMatches` (`deS`) - exact-list and regex matcher engine.
- `buildHookIfEvaluator` (`peS`) - tool-owned semantic input matcher.
- `executeHooks` (`jN`) - streaming public adapter.
- `runHooksStreaming` (`JWp`) - interactive concurrent runner and aggregator.
- `executeHooksOutsideREPL` (`zN`) - ambient batch runner.
- `spawnHookCommand` (`iri`) - secure command process boundary.
- `parseAndValidateHookJson` (`rqp`) - schema validator.
- `translateHookJsonResult` (`mIn`) - event-specific result translator.
- `persistHookOutput` (`git`) - bounded context persistence.
- `registerAsyncHook` (`YWp`) - async and async-rewake routing.
- `checkForAsyncHookResponses` (`SWu`) - exactly-once completion delivery.
- `salvageAsyncHookJson` (`gWu`) - field-level recovery for invalid async output.
- `arbitratePreToolHook` (`VSn`) - final hook/policy boundary.
