# Agent tool and subagent runtime — 2.1.220 current-state analysis

**Authoritative source:**
`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`.
All plain locations below are from that bundle. The 2.1.193 bundle is used for direct delta checks;
`/lyz/codespace/3rd/claude-code/src/tools/AgentTool/` is a readable semantic reference only.

## Executive result

The 2.1.220 Agent tool is a routing and lifecycle coordinator, not merely a wrapper around another
model call. Its call path:

1. validates depth, flat-team, budget, session-count, concurrency, agent-type, isolation, and MCP
   preconditions;
2. resolves a specialized, fork, teammate, remote, foreground, or background execution shape;
3. constructs an independent worker context with scoped permissions, tools, hooks, skills, MCP
   clients, memory, transcript, model, and abort ownership;
4. drives the shared query loop and persists the sidechain;
5. converts terminal output into a sanitized, metered result or task notification;
6. tears down every agent-scoped resource, including nested background work.

The missing changelog analysis is now closed:

- explicit tool lists that resolve to zero tools can be refused before the worker spends a model call;
- terminal API-error assistant messages cannot be finalized as success;
- recoverable rate-limit, overload, and server-error cutoffs return only earlier text and prepend an
  unmistakable partial-result warning;
- a cutoff before any text remains an error, not an empty successful result.

## 1. Tool contract and route selection

### Agent input/output contract

**What it does:** Defines which execution knobs the model may request and which terminal shapes the query
loop must handle.

**How it works:**
1. `AGENT_TOOL_BASE_SCHEMA` (`G8y`) accepts description, prompt, optional agent type/model, and
   `run_in_background`.
2. `AGENT_TOOL_FULL_SCHEMA` (`W8y`) adds a validated addressable name, deprecated `team_name` and
   `mode`, isolation, and cwd. `cwd` and worktree isolation are mutually constrained by the call path.
3. `getAgentToolInputSchema` (`ZMs`) omits cwd or background selection on surfaces that cannot support
   them.
4. The output schema is a union of `completed`, `async_launched`, and `remote_launched`; named teammate
   launch is an internal additional shape handled by the result mapper.
5. The tool remains `isReadOnly() === true` and concurrency-safe from the parent executor's viewpoint.
   This classification means the Agent call itself does not mutate files; the child may do so under its
   own permissions.

**Why this approach:**
- A discriminated result lets the parent distinguish immediate content from a future notification.
- Deprecated fields remain schema-visible to avoid breaking old prompts or replayed calls while their
  values no longer control child privilege.
- Dynamic schema omission prevents unsupported knobs from being proposed in the first place.

**Key insight:** `run_in_background` is a preference, not the sole routing decision. Remote isolation,
coordinator/fork/assistant modes, the agent definition, and the “background disabled” override all
participate.

### Preflight order and route decision

**What it does:** Rejects impossible or unsafe launches before creating durable agent state.

**How it works:**
1. The current depth is compared with `getMaxSubagentSpawnDepth` (`hee`) before any other work.
2. Teammates are kept flat: a teammate cannot provide `name`, and in-process teammates cannot request or
   inherit background execution.
3. Agent definitions are filtered by permission rules and the session allow-list. Normalized name
   matching is accepted only when exactly one available definition matches; ambiguous matches fail.
4. A fork is a special built-in type. It is unavailable inside another fork and cannot use remote
   isolation.
5. The session budget and monotone spawn count are checked and charged. Local launches also face the
   live concurrency check; remote isolation bypasses that local slot.
6. Required MCP servers may be polled for up to 30 seconds. A connected server counts only if it exposes
   at least one tool, which also proves authentication completed.
7. The model is resolved, the child depth is incremented, and telemetry records the selected definition.
8. Remote isolation returns a cloud-task handle. In a team context, a name may route to teammate spawn.
   Otherwise a local foreground/background path is built.
9. The local async predicate is true for remote-like/background defaults, coordinator, fork-subagent,
   assistant, and proactive modes unless background tasks are globally disabled; explicit
   `run_in_background: false` suppresses only the default-background term.

**Why this approach:**
- Cheap deterministic refusals precede filesystem and model work.
- Concurrency is checked once before worktree creation and again when taking the slot, closing a TOCTOU
  gap; the second failure cleans the new worktree.
- Definition selection and permission filtering occur before normalization succeeds, so a denied agent
  cannot be recovered through a spelling variant.

**Key insight:** The spawn counter is charged before MCP/tool construction, whereas the concurrency slot
is acquired after worktree construction and is releasable. One measures attempted delegation budget; the
other measures live execution occupancy.

## 2. Worker tool resolution

### Explicit, wildcard, and denied tool resolution

**What it does:** Computes the exact tool array serialized into the child request.

**How it works:**
1. `resolveAgentTools` (`dte`) first calls `filterToolsForAgent` (`MNy`) unless the caller requested exact
   fork tools. The filter accounts for built-in status, async/teammate mode, permission mode, and depth.
2. Definition-level `disallowedTools` is applied to both exact and normalized names, including server-wide
   MCP patterns.
3. Undefined tools or a wildcard resolve to every remaining allowed tool.
4. An explicit list is classified into:
   - valid and resolved;
   - recognized but unavailable in this worker surface;
   - invalid names;
   - MCP server wildcards expanded to all tools from that server.
5. `Agent(typeA,typeB)` is also metadata: its rule content becomes `allowedAgentTypes`. If the depth filter
   removed the Agent tool, the spec is tracked as valid but cannot restore the tool.
6. Search aliases can resolve to the available search implementation, and resolved tools are deduplicated
   by object identity/name.
7. Agent-specific MCP tools are initialized afterward, filtered by `disallowedTools`, and merged by name.

**Why this approach:**
- The worker gets a pool assembled under its own effective permission mode, rather than inheriting an
  arbitrary parent subset.
- Explicit lists are diagnostic: separating invalid from unavailable gives the zero-tool refusal a useful
  remediation message.
- Forks use an exception—parent-exact tools—to preserve a byte-identical cached request prefix.

**Key insight:** `disallowedTools` wins after base-pool filtering and before agent MCP merge. An agent cannot
reintroduce a denied tool through its own MCP configuration.

### Zero-tool refusal

**What it does:** Prevents accidental no-tool agents while preserving deliberate text-only and resume cases.

**How it works:**
1. The final merged tool array is checked after agent-specific MCP initialization.
2. Telemetry always explains the empty result: invalid, unavailable, valid-but-empty, source pool size,
   wildcard, continuation, and async dimensions.
3. Refusal occurs only when all of these hold:
   - the definition supplied an explicit resolution result;
   - at least one diagnostic category is non-empty;
   - there was no wildcard;
   - the available pool itself was non-empty;
   - this is not a continuation with recorded UUIDs.
4. Before throwing, the runtime cleans MCP clients, session hooks, transcript-subdirectory state, and tracing.
5. An intentionally empty wildcard-filtered pool or a resumed sidechain may continue with no tools.

**Why this approach:**
- “Zero tools” is not always a bug; a text-only agent can be intentional.
- The refusal targets the high-confidence configuration mistake: named tools were requested but resolved
  to nothing despite tools existing in the session.
- Cleanup before throw prevents a pre-query validation failure from leaking agent-scoped resources.

**Key insight:** The guard tests intent and context, not just `tools.length === 0`.

```javascript
// ============================================
// refuseAccidentalZeroToolAgent - Diagnose and reject an explicit tools list that resolves to nothing
// Location: cli_inner_pretty.js:344423-344460
// ============================================

// ORIGINAL (for source lookup):
if (Tr.length === 0) {
  let jr = Ze?.invalidTools ?? [],
    In = Ze?.unavailableTools ?? [],
    ni = (Ze?.validTools ?? []).filter((yr) => !fr({ name: yr })),
    Vt = F !== void 0 && F.size > 0,
    un = [
      jr.length ? `unrecognized [${jr.join(", ")}]` : "",
      In.length ? `not available to subagents [${In.join(", ")}]` : "",
      ni.length ? `recognized but matched no tools in this session [${ni.join(", ")}]` : "",
    ]
      .filter(Boolean)
      .join("; "),
    dn = un !== "" && Ze !== void 0 && !Ze.hasWildcard && m.length > 0 && !Vt;
  if (
    (O("tengu_subagent_zero_tools", {
      isBuiltIn: e.source === "built-in",
      invalidCount: jr.length,
      unavailableCount: In.length,
      validButEmptyCount: ni.length,
      availablePoolSize: m.length,
      hadWildcard: Ze?.hasWildcard ?? !1,
      isContinuation: Vt,
      refused: dn,
      isAsync: o,
    }),
    dn)
  )
    throw (
      await It(),
      r.sessionHooksRegistry.clear(oe),
      Rxs(oe),
      nat(oe),
      new Lr(
        `Agent '${e.agentType}' would be spawned with zero tools \u2014 refusing. ` +
          `Its tools list resolved to nothing: ${un}. Fix the agent's tools frontmatter or pass a different subagent_type.`,
        "subagent zero-tool spawn refused",
      )
    );
}

// READABLE (for understanding):
if (allTools.length === 0) {
  const invalid = resolution?.invalidTools ?? [];
  const unavailable = resolution?.unavailableTools ?? [];
  const validButEmpty = (resolution?.validTools ?? []).filter(name => !isDisallowed({ name }));
  const isContinuation = recordedUuids !== undefined && recordedUuids.size > 0;
  const detail = describeResolutionFailure(invalid, unavailable, validButEmpty);
  const shouldRefuse = detail !== "" && resolution !== undefined && !resolution.hasWildcard && availableTools.length > 0 && !isContinuation;
  if (shouldRefuse) {
    await cleanupAgentMcp();
    clearAgentScopedState(agentId);
    throw new AgentRuntimeError(`Agent '${agentDefinition.agentType}' would be spawned with zero tools — refusing. Its tools list resolved to nothing: ${detail}.`);
  }
}

// Mapping: Tr→allTools, Ze→resolution, jr→invalid, In→unavailable, ni→validButEmpty, Vt→isContinuation, un→detail, dn→shouldRefuse, m→availableTools, F→recordedUuids, fr→isDisallowed, It→cleanupAgentMcp, oe→agentId
```

## 3. Child context construction

### Permission and prompt isolation

**What it does:** Creates a child context that shares infrastructure without leaking parent-local state or
granting a stronger permission posture.

**How it works:**
1. `runAgent` (`oG`) resolves the model through the audited resolver and creates or accepts a stable agent
   ID.
2. Fork context is filtered and combined with fork-specific prompt messages. Normal agents start from their
   own user prompt.
3. User/system context is loaded concurrently. Explore and Plan omit git status; `omitClaudeMd` can remove
   the CLAUDE.md portion.
4. The child permission context starts from current state. An agent-definition mode may replace it, except
   when the current mode is `bypassPermissions`, `acceptEdits`, or `auto`, unless an explicit spawn-mode
   mapping applies.
5. Agents without permission UI get `shouldAvoidPermissionPrompts`; background agents allowed to bubble
   prompts wait for automated checks before showing a dialog.
6. Explicit allowed tools replace session allow rules but preserve CLI-argument rules and MCP server policy.
7. A worktree is added to additional working directories.
8. SubagentStart hooks may inject recordable messages, blocking-error attachments, and additional context.
   Agent-frontmatter hooks are registered only when source trust permits.
9. Skills are preloaded concurrently; agent MCP servers are additive; current runtime-delta attachments and
   teammate address hints are appended.
10. Forks use the parent's rendered system prompt, exact tool array, thinking configuration, and
    noninteractive flag. Normal agents use their own prompt and the 2.1.220 thinking-display resolver.

**Why this approach:**
- Dynamic `getAppState` recomputes permission posture, so settings/approvals can change during a long agent
  run without rebuilding the context.
- Parent CLI permissions remain authoritative, but session-local approvals do not leak automatically.
- Fork byte identity trades isolation for cache efficiency intentionally; the separate normal path favors
  specialization.

**Key insight:** A normal child inherits the parent **mode** by default but not its already-approved session
rules. “Permission inheritance” does not mean privilege-state cloning.

```javascript
// ============================================
// resolveSubagentPermissionContext - Derive the live child permission view
// Location: cli_inner_pretty.js:344342-344370
// ============================================

// ORIGINAL (for source lookup):
function ze(jr) {
  if (jr === Ue && Me) return Me;
  Ue = jr;
  let In = jr;
  if (Oe && (ge || (jr.mode !== "bypassPermissions" && jr.mode !== "acceptEdits" && jr.mode !== "auto")))
    In = { ...In, mode: Oe };
  let ni = r.requestDialog !== void 0,
    Vt = i !== void 0 ? !i : Oe === "bubble" || ni ? !1 : o;
  if (Vt) In = { ...In, shouldAvoidPermissionPrompts: !0 };
  if (o && !Vt) In = { ...In, awaitAutomatedChecksBeforeDialog: !0 };
  if (g !== void 0)
    In = {
      ...In,
      alwaysAllowRules: {
        cliArg: jr.alwaysAllowRules.cliArg,
        ...(jr.alwaysAllowRules.mcpServerPolicy && { mcpServerPolicy: jr.alwaysAllowRules.mcpServerPolicy }),
        session: [...g],
      },
    };
  if (b && !In.additionalWorkingDirectories.has(b))
    In = {
      ...In,
      additionalWorkingDirectories: new Map([
        ...In.additionalWorkingDirectories,
        [b, { path: b, source: "session" }],
      ]),
    };
  return ((Me = In), In);
}

// READABLE (for understanding):
function resolveSubagentPermissionContext(parentPermissionContext) {
  if (parentPermissionContext === cachedInput && cachedOutput) return cachedOutput;
  let child = parentPermissionContext;
  if (agentMode && (spawnMode || !["bypassPermissions", "acceptEdits", "auto"].includes(parentPermissionContext.mode))) child = { ...child, mode: agentMode };
  const avoidPrompts = explicitCanShowPrompts !== undefined ? !explicitCanShowPrompts : agentMode === "bubble" || hasRequestDialog ? false : isAsync;
  if (avoidPrompts) child = { ...child, shouldAvoidPermissionPrompts: true };
  if (isAsync && !avoidPrompts) child = { ...child, awaitAutomatedChecksBeforeDialog: true };
  if (allowedTools !== undefined) child = replaceSessionAllowRulesPreservingCliAndMcpPolicy(child, allowedTools);
  if (worktreePath) child = addWorkingDirectory(child, worktreePath);
  return cache(parentPermissionContext, child);
}

// Mapping: ze→resolveSubagentPermissionContext, jr→parentPermissionContext, Ue→cachedInput, Me→cachedOutput, In→child, Oe→agentMode, ge→spawnMode, i→explicitCanShowPrompts, Vt→avoidPrompts, o→isAsync, g→allowedTools, b→worktreePath
```

## 4. Query, transcript, and cleanup lifecycle

### Sidechain execution

**What it does:** Runs the ordinary query loop in an agent-scoped context while maintaining a resumable
sidechain transcript.

**How it works:**
1. Initial prompt/context messages are written before querying. Forks can store a compact
   `fork-context-ref` instead of duplicating the parent prefix.
2. Agent metadata records type, fork/worktree/cwd, description/name/tool-use ID, parent, spawn depth, and
   requested model.
3. `runAgent` calls the shared `query` generator (`Kse`) with the child system/user/system contexts, tools,
   maximum turns, and query source.
4. Stream-only metrics are translated to parent metrics; model-change events update the resolved model;
   API-error system notices are forwarded but not recorded as successful content.
5. Recordable messages are appended one at a time with the previous UUID, maintaining an O(1) parent chain.
6. Background agent progress may be forwarded to the output transport; nested progress is forwarded only
   when `forwardSubagentText` is enabled.
7. Normal completion invokes built-in callbacks. An aborted controller throws the dedicated abort error.
8. `finally` runs an ordered cleanup set: interrupted SubagentStop hook, MCP cleanup, session hooks, prompt
   cache tracking, nested-memory propagation, read-file and message buffers, skill names, REPL snapshot,
   tracing, transcript routing, todos, REPL timers, shell tasks, monitor tasks, and precompute state. Some
   jobs are keepalive-gated for parked agents.

**Why this approach:**
- The child reuses the battle-tested main query loop instead of implementing a second executor.
- Per-message transcript writes make resume and live observation durable without waiting for terminal success.
- Cleanup is centralized in `finally` because cancellation, max-turn exit, API error, and successful return all
  allocate the same resources.

**Key insight:** A background task's task-registry message buffer is not its only source of truth; the
sidechain transcript is written during execution and can outlive UI retention.

## 5. Foreground, auto-background, and background ownership

### Completion-versus-background race

**What it does:** Allows a nominally synchronous call to detach without restarting or duplicating its worker.

**How it works:**
1. Both foreground and background local agents are registered in the task registry and driven by
   `runAsyncAgentLifecycle` (`hIe`).
2. An initially foreground launch links the parent abort controller to a child controller and starts an
   auto-background timer unless the surface disables it.
3. The Agent call races the lifecycle promise against `backgroundSignal`.
4. If background wins and the task is still viable, ownership is marked for later notification, the abort
   link is detached, and the tool returns `async_launched` with output metadata.
5. If completion wins, the same accumulated message stream is finalized inline; no second worker exists.
6. A narrow race where background fires after terminal state is detected and treated as foreground completion.
7. Foreground cleanup sends task status/usage and clears the background hint in `finally`.

**Why this approach:**
- One lifecycle implementation prevents different correctness behavior between explicit background and
  auto-background transitions.
- Racing a signal rather than cancelling/restarting preserves model cache, transcript, tools in flight, and
  worktree state.
- The terminal-state recheck avoids returning an async handle for work that already finished.

**Key insight:** “Auto-background” is an ownership transition around one running task, not a migration of the
agent loop.

```javascript
// ============================================
// raceForegroundAgentAgainstBackgrounding - Decide whether the Agent call returns content or a task handle
// Location: cli_inner_pretty.js:399087-399131
// ============================================

// ORIGINAL (for source lookup):
let ut;
try {
  ut = G
    ? await we.then(() => "done")
    : await Promise.race([we.then(() => "done"), Pt.backgroundSignal.then(() => "backgrounded")]);
} catch (In) {
  if (((ut = "done"), In instanceof tl)) {
    if (
      (O("tengu_agent_tool_terminated", {
        agent_type: ae.agentType,
        model: ae.resolvedAgentModel,
        final_model: Bu(Nt.at(-1) ?? ae.resolvedAgentModel),
        model_swapped: Nt.length > 1,
        duration_ms: Date.now() - ae.startTime,
        is_async: !1,
        is_built_in_agent: ae.isBuiltInAgent,
        agent_depth: ae.agentDepth,
        reason: Ee("user_cancel_sync"),
      }),
      !(lr.signal.aborted && !l.abortController.signal.aborted))
    )
      throw In;
    Pe = _n(In);
  } else (w(`Sync agent error: ${le(In)}`, { level: "error" }), (Pe = _n(In)));
}
let Xe = ut === "done" && !Pe && Ypr(mt, A);
if (Xe) aan(mt, A);
let it = A.get(mt)?.status,
  ft = ut === "backgrounded" && !Xe && it !== void 0 && it !== "running" && !Ypr(mt, A);
if ((ut === "backgrounded" && !ft) || Xe) {
  if (((fr = !0), It(), Zrd(lt), !yn())) Xse(Ue, `agent:${mt}`, A);
  let In = l.options.tools.some((ni) => qa(ni, zi) || qa(ni, ri));
  return {
    data: {
      isAsync: !0,
      status: "async_launched",
      agentId: mt,
      description: r,
      resolvedModel: At,
      ...(Nt.length > 1 && { modelsUsed: [...Nt] }),
      prompt: e,
      outputFile: ly(mt),
      canReadOutputFile: In,
    },
  };
}

// READABLE (for understanding):
let outcome;
try {
  outcome = disableAutoBackground
    ? await lifecycle.then(() => "done")
    : await Promise.race([lifecycle.then(() => "done"), task.backgroundSignal.then(() => "backgrounded")]);
} catch (error) {
  outcome = "done";
  recoveredError = normalizeForegroundAgentError(error);
}
const parked = outcome === "done" && !recoveredError && isTaskParked(taskId);
const backgroundLostRace = outcome === "backgrounded" && taskAlreadyTerminal(taskId) && !parked;
if ((outcome === "backgrounded" && !backgroundLostRace) || parked) {
  notifyOwnerOnCompletion = true;
  unlinkParentAbort();
  return { data: makeAsyncLaunchedResult(taskId, resolvedModel) };
}

// Mapping: ut→outcome, G→disableAutoBackground, we→lifecycle, Pt→task, In→error, Pe→recoveredError, Xe→parked, mt→taskId, A→taskRegistry, ft→backgroundLostRace, fr→notifyOwnerOnCompletion, It→unlinkParentAbort, At→resolvedModel
```

## 6. Terminal correctness and partial recovery

### API-error termination classification

**What it does:** Stops a terminal assistant API-error message from being treated as a successful answer.

**How it works:**
1. After the stream ends, `runAsyncAgentLifecycle` takes the last assistant message.
2. A non-user-abort API-error assistant message becomes `AgentApiErrorTerminationError` (`m0o`) carrying
   both redacted user-facing text and an `errorKind`.
3. The lifecycle therefore enters its error branch rather than calling `finalizeAgentTool`.
4. The sync wrapper passes the exception and accumulated history to `recoverSyncAgentError` (`Apd`).
5. `buildApiErrorPartialRecovery` (`jNy`) accepts only `rate_limit`, `overloaded`, or `server_error`, removes
   API-error assistant records, and requires earlier non-error assistant text.
6. Accepted recovery prepends an explicit “PARTIAL … did NOT finish” note. Telemetry records
   `api_error_partial`.
7. Other API errors, or any accepted category before the first text, are rethrown. A generic non-abort error
   may expose earlier text but does not receive the API-cutoff note.

**Why this approach:**
- Rate and transient server failures do not invalidate already completed investigative work.
- Authentication, validation, policy, and other API errors are not assumed transient and cannot masquerade as
  a completed task.
- Requiring earlier text solves the empty-result bug: there is nothing useful to recover before first output.
- Removing the API-error record prevents its text from being selected by finalization.

**Key insight:** The system distinguishes “task succeeded,” “task failed with useful partial work,” and “task
failed before producing work.” Earlier code collapsed these states.

```javascript
// ============================================
// recoverSyncAgentError - Recover only marked partial output from eligible terminal failures
// Location: cli_inner_pretty.js:345891-345915
// ============================================

// ORIGINAL (for source lookup):
function jNy(e, t) {
  if (!(e instanceof m0o)) return null;
  if (!e.errorKind || !UNy.has(e.errorKind)) return null;
  let r = t.filter((n) => n.type !== "assistant" || !n.isApiErrorMessage);
  if (Kpr(r) === void 0) return null;
  return {
    history: r,
    cutoffNote:
      `${zpr(e.message, { prependMarker: !1 }).sanitized}

` +
      "Everything below is PARTIAL output recovered from the agent before it was cut off. The agent did NOT finish its task \u2014 treat these results as incomplete.",
  };
}
function Apd(e, t) {
  let r = jNy(e, t);
  if (r) return ($e("subagent_complete", "api_error_partial"), r);
  let n = e instanceof tl;
  if (e instanceof m0o || Kpr(t) === void 0) {
    if (!n) pe("subagent_complete", "subagent_sync_errored");
    throw e;
  }
  if (!n) $e("subagent_complete", "sync_error_partial");
  return { history: t };
}

// READABLE (for understanding):
function buildApiErrorPartialRecovery(error, history) {
  if (!(error instanceof AgentApiErrorTerminationError)) return null;
  if (!error.errorKind || !RECOVERABLE_API_ERROR_KINDS.has(error.errorKind)) return null;
  const cleanHistory = history.filter(message => message.type !== "assistant" || !message.isApiErrorMessage);
  if (lastNonErrorAssistantText(cleanHistory) === undefined) return null;
  return { history: cleanHistory, cutoffNote: `${sanitize(error.message)}\n\nEverything below is PARTIAL output recovered from the agent before it was cut off. The agent did NOT finish its task — treat these results as incomplete.` };
}
function recoverSyncAgentError(error, history) {
  const partial = buildApiErrorPartialRecovery(error, history);
  if (partial) return partial;
  const aborted = error instanceof AbortError;
  if (error instanceof AgentApiErrorTerminationError || lastNonErrorAssistantText(history) === undefined) throw error;
  return { history };
}

// Mapping: jNy→buildApiErrorPartialRecovery, Apd→recoverSyncAgentError, e→error, t→history, r→partial/cleanHistory, n→aborted/message, m0o→AgentApiErrorTerminationError, UNy→RECOVERABLE_API_ERROR_KINDS, Kpr→lastNonErrorAssistantText, zpr→sanitizeSubagentText, tl→AbortError
```

### Final result extraction and sanitization

**What it does:** Produces a bounded, provenance-aware parent-visible result from successful or recovered
history.

**How it works:**
1. `finalizeAgentTool` (`XIs`) requires at least one assistant message.
2. It prefers text blocks from the last assistant message; if that message ended in pure tool use, it scans
   backward for the most recent assistant text.
3. Usage comes from the last assistant response; tool counts and detailed read/search/bash/edit statistics are
   aggregated across nested results.
4. Model swaps are retained in ordered `modelsUsed`; telemetry distinguishes initial and final model.
5. Final text blocks pass through `sanitizeSubagentContentBlocks` (`_pd`), which neutralizes control-shaped
   tags and flags escalation patterns. Recovery notes and handoff-classifier reasons are sanitized too.
6. In auto permission mode, risky handoff history may prepend a security warning. Classifier unavailability
   fails open with an explicit warning rather than silently blocking the result.
7. The tool-result mapper adds continuation/usage metadata for ordinary synchronous agents, omits that trailer
   for one-shot built-ins, and substitutes an explicit no-output message for an empty content array.

**Why this approach:**
- Falling back from a pure tool-use final turn preserves the last actual finding during abrupt/max-turn exits.
- Output sanitization treats subagent text as lower-trust content without destroying useful prose.
- Separating internal IDs/instructions from user-facing content reduces accidental leakage and premature
  claims about background results.

**Key insight:** Sanitization is applied at every parent-facing text surface—successful result, partial note,
notification final message, and classifier warning—not only at the normal success return.

## 7. Background lifecycle ordering

### Terminal state before embellishment

**What it does:** Ensures waiters unblock even if classification, summarization, or worktree cleanup stalls.

**How it works:**
1. `runAsyncAgentLifecycle` (`hIe`) tracks messages, progress, models, active tools, and a default ten-minute
   no-progress watchdog.
2. The watchdog is rearmed by stream/query progress and defers while any tool is in flight. On expiry it aborts,
   fails the task, and emits a terminal notification.
3. At normal stream end, a terminal API-error assistant is rejected before finalization.
4. On success the task registry is completed before auto-mode handoff classification and worktree cleanup.
5. Keepalive-parked agents defer owner notification so a later resume owns the terminal handoff.
6. Cancellation marks killed before cleanup and retains the last sanitized partial text. Other errors mark failed
   and also include safe prior text when available.
7. `finally` stops timers/summaries and clears agent-scoped invocation/dump state.

**Why this approach:**
- `TaskOutput(block=true)` depends on registry status. Expensive notification decoration must not keep it blocked.
- Tool-aware watchdog deferral distinguishes a quiet but active shell/tool from a genuinely stuck stream.
- Status-before-cleanup accepts that cleanup may hang, while preserving a truthful terminal state.

**Key insight:** Notification delivery is downstream of task completion. A missing notification embellishment
does not mean the agent is still running.

```javascript
// ============================================
// rejectTerminalSubagentApiError - Convert a final API-error assistant into lifecycle failure
// Location: cli_inner_pretty.js:346122-346136
// ============================================

// ORIGINAL (for source lookup):
let te = eD(_);
if (te?.isApiErrorMessage && !Ofe(te))
  throw new m0o(
    Xc(
      te.message.content,
      `
`,
    ),
    te.error,
  );
((R = !0), g?.(), _0o(e, s));
let de = Ypr(e, s);
if (!de) j("completed");
let ae = WNy(s, e, _),
  Te = XIs(ae, e, { ...n, modelsUsed: E }, { suppressTelemetry: de });

// READABLE (for understanding):
const lastAssistant = getLastAssistantMessage(agentMessages);
if (lastAssistant?.isApiErrorMessage && !isUserAbortMessage(lastAssistant)) {
  throw new AgentApiErrorTerminationError(extractText(lastAssistant.message.content, "\n"), lastAssistant.error);
}
completionStarted = true;
stopSummarization?.();
markTaskComplete(taskId, taskRegistry);
const parked = isTaskParked(taskId, taskRegistry);
const authoritativeHistory = getRegistryHistoryIfLonger(taskRegistry, taskId, agentMessages);
const result = finalizeAgentTool(authoritativeHistory, taskId, { ...metadata, modelsUsed });

// Mapping: te→lastAssistant, eD→getLastAssistantMessage, _→agentMessages, Ofe→isUserAbortMessage, m0o→AgentApiErrorTerminationError, Xc→extractText, R→completionStarted, g→stopSummarization, _0o→markTaskComplete, de→parked, Ypr→isTaskParked, WNy→getRegistryHistoryIfLonger, ae→authoritativeHistory, XIs→finalizeAgentTool, E→modelsUsed
```

## 8. Three-way verification

### 2.1.193 baseline

The 2.1.193 Agent tool already has:

- explicit/wildcard/disallowed tool resolution (`pre`, `:384073-384156 (193)`);
- foreground-to-background racing (`:431090-431167 (193)`);
- the async watchdog and task lifecycle (`Hqe`, `:384384-384692 (193)`);
- result fallback to earlier assistant text (`SSo`, `:384221-384292 (193)`);
- auto-mode handoff classification.

The following 2.1.220 behaviors are directly absent from the matching 193 paths:

- the zero-tool refusal/event (`tengu_subagent_zero_tools` is 1/0);
- terminal assistant API-error rejection and `AgentApiErrorTerminationError`;
- recoverable error-kind set plus the explicit partial-output warning;
- final-output instruction-pattern sanitization;
- ordered `modelsUsed` and final-model telemetry through foreground/background transitions;
- nested depth-2+ text forwarding and stronger “do not expose internal ID / do not predict results” tool-result
  instructions.

In 193, the async lifecycle goes directly from stream end to `finalizeAgentTool` (`:384564-384570 (193)`),
and the sync wrapper accepts any error if *some* assistant message exists (`:431151-431155 (193)`). This is
the exact reason an API-error assistant could be reported as successful or a rate-limited pre-text run could
produce a misleading result.

### Readable 2.1.88 source

The readable files expose the semantic split `AgentTool.tsx`, `runAgent.ts`, and `agentToolUtils.ts`, which
corroborates the names `resolveAgentTools`, `runAgent`, `finalizeAgentTool`, and
`runAsyncAgentLifecycle`. They also document sidechain recording, permission isolation, auto-backgrounding,
and cleanup intent.

They are materially older than the 2.1.220 bundle: for example, their normal-agent thinking path disables
thinking, their zero-tool logic and terminal API-error class are absent, and their partial-result helper is a
simple last-text extractor. Those files are therefore ancestry/semantic evidence only; every new behavior
claimed above is anchored in the 2.1.220 bundle.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `AgentTool` (`Wko`) - schema, preflight, routing, execution, and result mapping
- `resolveAgentTools` (`dte`) - explicit/wildcard tool resolution
- `filterToolsForAgent` (`MNy`) - surface/depth/permission filtering
- `runAgent` (`oG`) - child context and query-loop driver
- `runAsyncAgentLifecycle` (`hIe`) - task state, watchdog, completion, and notification
- `finalizeAgentTool` (`XIs`) - sanitized content and usage result builder
- `buildApiErrorPartialRecovery` (`jNy`) - eligible transient-cutoff recovery
- `recoverSyncAgentError` (`Apd`) - fail-versus-partial decision
- `classifySubagentHandoff` (`tin`) - auto-mode post-run review
- `AgentApiErrorTerminationError` (`m0o`) - terminal API-error discriminator
