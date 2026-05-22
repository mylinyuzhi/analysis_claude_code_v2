# Agent Identity Propagation — v2.1.142

## TL;DR

When the leader spawns a teammate, or when a parent agent spawns a subagent
through the Agent tool, the child runs inside an `AsyncLocalStorage`-scoped
*identity context* that carries `agentId`, `agentName`, `teamName`, and
`parentAgentId`. Three independent surfaces consume this context:

1. **HTTP request headers on every LLM call** — `x-claude-code-agent-id` and
   `x-claude-code-parent-agent-id` are added by the Anthropic client factory
   when the current async-context has an agent identity. Introduced in
   v2.1.139, unchanged in v2.1.142. These headers let server-side telemetry
   reconstruct the parent/child topology of a single user request without
   relying on per-session correlation.
2. **OTel / Perfetto span attributes** — `agent_id`, `parent_agent_id`, and
   `team_name` are written onto every `claude_code.llm_request`,
   `claude_code.tool_use`, and `claude_code.subagent_*` span. The metadata
   helpers (`s68`/`recordPerfettoAgent`, `vh1`/`getAgentSpanMetadata`) read
   the current context and emit the attribute set.
3. **OTLP attributes on the running span** — `claude_code.llm_request` and
   tool spans attach `parent_agent_id` when present
   (`cli_inner_pretty.js:241779`), so distributed-tracing back-ends can
   stitch a parent's span tree across subagent boundaries.

The propagation primitive is two separate `AsyncLocalStorage` instances:

* `Atq` (accessed via `RD()`/`RU()`) — the *current agent identity* (the
  caller's own `agentId`, `parentAgentId`, `agentType`, etc.).
* `Ei8` (accessed via `BW()`/`sU$()`) — the *teammate context* for an
  in-process teammate (`isInProcess: true`, `teamName`, `parentSessionId`,
  `abortController`).

These are intentionally separate so a top-level subagent (no team) can have
`RD()` populated while `BW()` returns `undefined`, and so a teammate can
have both populated with consistent values.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Agents, Subagent, State
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Telemetry
> - [symbol_additions_v2_1_142_agent_team_arch.md](../00_overview/symbol_additions_v2_1_142_agent_team_arch.md) — Agent-team architecture additions

Key functions in this document (verified in v2.1.142):
- `getDynamicAgentContext` (`RD`) — `Atq.getStore()`; current agent-identity record (cli_inner_pretty.js:97620-97622)
- `runWithDynamicAgentContext` (`RU`) — `Atq.run(store, fn)`; pushes an identity onto the async stack (cli_inner_pretty.js:97623-97625)
- `isSubagentContext` (`Cz1`) — `H?.agentType === "subagent"` (cli_inner_pretty.js:97626-97628)
- `getBuiltInSubagentName` (`ztq`) — built-in vs user-defined subagent label for telemetry (cli_inner_pretty.js:97629-97633)
- `maybeEmitInvocationOnce` (`Ni8`) — emits `invokingRequestId` exactly once per invocation (cli_inner_pretty.js:97634-97638)
- `getTeammateContext` (`BW`) — `Ei8.getStore()`; teammate context (cli_inner_pretty.js:97759-97761)
- `runWithTeammateContext` (`sU$`) — pushes a teammate context (cli_inner_pretty.js:97762-97764)
- `isInProcessTeammate` (`DZ`) — `Ei8.getStore() !== undefined` (cli_inner_pretty.js:97765-97767)
- `createTeammateContext` (`IxH`) — adds `isInProcess: true` to a teammate identity bag (cli_inner_pretty.js:97768-97770)
- `getAgentId` (`tG`) — read `agentId` from teammate context or fall back to dynamic (cli_inner_pretty.js:97810-97814)
- `getAgentName` (`vA`) — same, for `agentName` (cli_inner_pretty.js:97815-97819)
- `getTeamName` (`q5`) — read `teamName` with optional fallback param (cli_inner_pretty.js:97820-97825)
- `isTeammate` (`AA`) — predicate: in a teammate context (cli_inner_pretty.js:97826-97829)
- `getParentSessionId` (`CU`) — read `parentSessionId` (cli_inner_pretty.js:97796-97800)
- `buildAnthropicClient` (`Tu`) — adds `x-claude-code-agent-id`/`-parent-agent-id` from `RD()` (cli_inner_pretty.js:128047-128090)
- `spawnInProcessTeammate` (`t68`) — populates a teammate context and registers a task (cli_inner_pretty.js:240335-240389)
- `getCurrentPerfettoAgent` (`iO$`) — caches `{agentId, agentName, parentAgentId, processId, threadId}` for trace metadata (cli_inner_pretty.js:239952-239960)
- `recordPerfettoAgent` (`s68`) — writes `process_name`/`thread_name`/`parent_agent` metadata events (cli_inner_pretty.js:240007-240003)
- `getAgentSpanMetadata` (`vh1`) — assembles `{agentId, parentSessionId, agentType, parentAgentId, teamName}` for span tags (cli_inner_pretty.js:137636-137658)
- `Atq` / `Ei8` — the two `AsyncLocalStorage` instances (cli_inner_pretty.js:97640-97642, 97772-97774)

---

## The Two AsyncLocalStorage Slots

Claude Code keeps **two** independent `AsyncLocalStorage` instances, each
holding a different but overlapping kind of identity:

```
┌─────────────────────────────────────────────────────────────────┐
│  Atq  (AsyncLocalStorage<DynamicAgentContext>)                 │
│  ───────────────────────────────────────────────────────────── │
│  agentId        — opaque per-spawn id (taskId / session uuid)   │
│  parentAgentId? — RD() at spawn time → set by parent            │
│  agentType?     — "subagent" | "teammate" | "main-session"      │
│  subagentName?  — for "subagent" type only (built-in label)     │
│  isBuiltIn?     — built-in vs user-defined subagent             │
│  agentName?                                                     │
│  teamName?                                                      │
│  parentSessionId?                                               │
│  color?                                                         │
│  planModeRequired?                                              │
│  invokingRequestId?  invocationKind?  invocationEmitted?        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Ei8  (AsyncLocalStorage<TeammateContext>)                     │
│  ───────────────────────────────────────────────────────────── │
│  agentId, agentName, teamName, color                            │
│  planModeRequired, parentSessionId                              │
│  abortController                                                │
│  isInProcess: true       ← always; set by createTeammateContext │
└─────────────────────────────────────────────────────────────────┘
```

### Why two slots?

**What it does:** Decouple "I am running inside a teammate process" from "I
am the current agent identity that should be put into headers / spans."

**How it works:**
- Subagents dispatched by the Agent tool use `RU()` to push a
  `DynamicAgentContext` onto `Atq` but do **not** touch `Ei8`. They are
  *agents*, not *teammates*.
- In-process teammates spawned by the team-lead use `sU$()` to push a
  `TeammateContext` onto `Ei8`. The teammate's runtime is also wrapped in
  `RU()` so its outbound API calls carry headers — but the source of truth
  for "what team am I in" is `Ei8`, not `Atq`.
- The accessor `getAgentId` first looks at `BW()` (teammate context); if
  absent it falls back to `RD()` (dynamic agent context). Same for
  `getAgentName`, `getTeamName`, `getParentSessionId`. This gives teammate
  values priority when both are set.

**Why this approach:**
- Different *audiences*. Telemetry / HTTP headers only care about a flat
  agent identifier. Team-runtime code cares about an entire context object
  (abortController, color for TUI, plan-mode flag).
- Different *lifetimes*. A teammate context is bound to the teammate's
  abort controller; an agent identity may persist beyond the abort (e.g.
  for finalisation telemetry after the run is cancelled).
- Different *propagation policies*. The teammate context is **not**
  inherited by spawned children — each teammate gets its own context at
  spawn time. The dynamic agent context **is** inherited (the child's
  `parentAgentId` is the snapshotted parent's `agentId`).

**Key insight:** A single store would conflate "I am in a teammate" with
"my outbound traffic should look like an agent". Splitting them lets
non-teammate subagents emit headers without paying the cost of an unused
team-runtime bag, and lets teammate code answer "am I in a team?" with a
single `BW() !== undefined` check rather than walking a deeper identity
record.

---

## Path 1: Subagent Dispatch via the Agent Tool

```javascript
// ============================================
// subagentDispatch - The Agent tool's dispatch path wraps the child in RU()
// Location: cli_inner_pretty.js:386513-386524 (excerpt of xi7)
// ============================================

// ORIGINAL (for source lookup):
function xi7({ messages: H, queryParams: $, description: q, taskRegistry: K, agentDefinition: _, setAppState: A }) {
  let { taskId: z, abortSignal: Y } = ZH5(q, K, _);
  Me(H, z).catch((O) => N(`bg-session initial transcript write failed: ${O}`));
  let f = {
    agentId: z,
    parentAgentId: RD()?.agentId,
    agentType: "subagent",
    subagentName: "main-session",
    isBuiltIn: !0,
  };
  return (
    RU(f, async () => { /* ...the child's turn loop... */ })
  );
}

// READABLE (for understanding):
function dispatchMainSessionSubagent({ messages, queryParams, description, taskRegistry, agentDefinition, setAppState }) {
  const { taskId, abortSignal } = registerSubagentTask(queryParams, taskRegistry, agentDefinition);
  // Best-effort persistence of the initial transcript; failures are logged but non-fatal.
  writeTranscript(messages, taskId).catch((e) => log(`bg-session initial transcript write failed: ${e}`));

  // Snapshot the *parent's* agentId now, so it survives even if the parent's
  // own context unwinds before the child completes (e.g. parent cancels).
  const identity = {
    agentId: taskId,
    parentAgentId: getDynamicAgentContext()?.agentId,   // RD()
    agentType: "subagent",
    subagentName: "main-session",
    isBuiltIn: true,
  };
  return runWithDynamicAgentContext(identity, async () => {
    /* the child's turn loop — every RD() call inside this lambda returns identity */
  });
}

// Mapping: xi7→dispatchMainSessionSubagent, H→messages, $→queryParams, q→description,
//          K→taskRegistry, _→agentDefinition, A→setAppState, z→taskId, Y→abortSignal,
//          f→identity, ZH5→registerSubagentTask, Me→writeTranscript,
//          RU→runWithDynamicAgentContext, RD→getDynamicAgentContext
```

### Parent ID Capture Timing

The `parentAgentId: RD()?.agentId` lookup happens *outside* `RU(...)` —
i.e., it samples the *caller's* identity *before* the child's identity is
pushed. This is the canonical way to chain agents:

```
parent: RD() = { agentId: "P", parentAgentId: "G" }     // grandparent G
   │
   │ ... parent spawns child ...
   ▼
child:  RD() = { agentId: "C", parentAgentId: "P" }     // chain G → P → C
```

If the child later spawns a grandchild, the same mechanism captures the
child's `agentId` ("C") and stores it as the grandchild's `parentAgentId`.
A subagent never sees its grandparent's `agentId` — only its immediate
parent's. The chain is reconstructed server-side from the header / span
attribute stream, not from a single message.

### Why Snapshot, Not Reference?

If the code did `parentAgentId: () => RD()?.agentId` (a lazy lookup) instead
of capturing once, then after the parent's outer `RU()` unwinds — for
example because the parent finished while the child is still streaming —
the lookup would return `undefined`. Snapshotting at spawn time gives the
child a stable parent identifier for its entire lifetime, regardless of the
parent's own lifecycle.

---

## Path 2: In-Process Teammate Spawn

The team-lead spawns a teammate through `spawnInProcessTeammate` (`t68`),
which creates **both** identity records in parallel:

```javascript
// ============================================
// spawnInProcessTeammate - Build teammate identity + dynamic context together
// Location: cli_inner_pretty.js:240335-240389 (excerpt)
// ============================================

// ORIGINAL (for source lookup):
async function t68(H, $) {
  let { name: q, teamName: K, prompt: _, color: A, planModeRequired: z, model: Y } = H,
    { taskRegistry: f } = $,
    O = In(q, K),
    M = xI("in_process_teammate");
  try {
    let w = T4(),
      D = v$(),
      j = { agentId: O, agentName: q, teamName: K, color: A, planModeRequired: z, parentSessionId: D },
      J = IxH({ agentId: O, agentName: q, teamName: K, color: A, planModeRequired: z, parentSessionId: D, abortController: w });
    if (s7H()) s68(O, q, D);
    /* register task, ... */
    return { success: !0, agentId: O, taskId: M, abortController: w, teammateContext: J };
  } catch (w) { /* ... */ }
}

// READABLE (for understanding):
async function spawnInProcessTeammate(input, ctx) {
  const { name, teamName, prompt, color, planModeRequired, model } = input;
  const { taskRegistry } = ctx;
  const agentId = buildTeammateAgentId(name, teamName);   // In(...)
  const taskId  = generateTaskId("in_process_teammate");  // xI(...)

  try {
    const abortController = newAbortController();         // T4()
    const parentSessionId = currentSessionId();           // v$()

    // (a) Plain identity bag — used to register the task & propagate to OTel spans.
    const identity = { agentId, agentName: name, teamName, color, planModeRequired, parentSessionId };

    // (b) Teammate context — same identity plus `isInProcess: true` and the abort handle.
    //     The teammate's worker loop runs INSIDE sU$(teammateContext, ...) elsewhere.
    const teammateContext = createTeammateContext({
      agentId, agentName: name, teamName, color, planModeRequired, parentSessionId,
      abortController,
    });

    // (c) If Perfetto tracing is on, record one metadata event per spawn.
    if (isPerfettoEnabled()) recordPerfettoAgent(agentId, name, parentSessionId);

    /* ... register the task in the registry, attach to AppState ... */
    return { success: true, agentId, taskId, abortController, teammateContext };
  } catch (e) { /* log + return failure shape */ }
}

// Mapping: t68→spawnInProcessTeammate, H→input, $→ctx, q→name, K→teamName, _→prompt,
//          A→color, z→planModeRequired, Y→model, f→taskRegistry, O→agentId, M→taskId,
//          w→abortController, D→parentSessionId, j→identity, J→teammateContext,
//          In→buildTeammateAgentId, xI→generateTaskId, T4→newAbortController,
//          v$→currentSessionId, IxH→createTeammateContext, s7H→isPerfettoEnabled, s68→recordPerfettoAgent
```

### Two Bags, One Source of Truth

Note the two near-identical objects: `identity` (in `j`) and `teammateContext`
(in `J`). The teammate-context bag is the union — same fields **plus**
`abortController` and `isInProcess: true`. They're kept separate because:

- `identity` is what the task registry stores (no abort handle needed at the
  registry layer — the registry uses the worker's status field for
  liveness).
- `teammateContext` is what the worker's outer `sU$(...)` runs against.
  Including the abort controller is essential so cooperative cancellation
  inside the worker can call `BW().abortController.abort()` from any depth.

The asymmetry is *not* a bug: the registry should not be able to abort the
worker directly (that goes through the registry's documented
`abortController?.abort()` accessor on the task record, not via the
teammate context).

### Where the Teammate Context Is Pushed

`t68` returns the `teammateContext`; the caller (the team-lead's runner
loop) wraps the teammate's first turn in `sU$(teammateContext, () => ...)`.
The runner is in the `bXY` skeleton (v2.1.112 name, preserved in v2.1.142).
After the wrap, every `BW()` inside the teammate's stack returns the
teammate-context, every `RD()` returns the dynamic-agent-context (also
pushed by the runner via `RU(...)`), and outbound API calls inherit both.

---

## Path 3: HTTP Headers on Every API Request

The Anthropic client factory `Tu` (`buildAnthropicClient`) consults `RD()`
when building the per-request default header set:

```javascript
// ============================================
// buildAnthropicClient - Inject agent-id headers on every Anthropic API call
// Location: cli_inner_pretty.js:128047-128090
// ============================================

// ORIGINAL (for source lookup):
async function Tu({ apiKey: H, maxRetries: $, model: q, fetchOverride: K, source: _ }) {
  let A = process.env.CLAUDE_CODE_CONTAINER_ID,
    z = process.env.CLAUDE_CODE_REMOTE_SESSION_ID,
    Y = process.env.CLAUDE_AGENT_SDK_CLIENT_APP,
    f = RD(),
    O = GV1(),
    w = {
      "x-app": N7() ? "cli-bg" : "cli",
      "User-Agent": Kl(),
      "X-Claude-Code-Session-Id": v$(),
      ...O,
      ...(A && { "x-claude-remote-container-id": A }),
      ...(z && { "x-claude-remote-session-id": z }),
      ...(Y && { "x-client-app": Y }),
      ...(f?.agentId && { "x-claude-code-agent-id": f.agentId }),
      ...(f?.parentAgentId && { "x-claude-code-parent-agent-id": f.parentAgentId }),
    };
  /* ... rest of client construction ... */
}

// READABLE (for understanding):
async function buildAnthropicClient({ apiKey, maxRetries, model, fetchOverride, source }) {
  const containerId    = process.env.CLAUDE_CODE_CONTAINER_ID;
  const remoteSessionId = process.env.CLAUDE_CODE_REMOTE_SESSION_ID;
  const sdkClientApp   = process.env.CLAUDE_AGENT_SDK_CLIENT_APP;
  const dynamicAgent   = getDynamicAgentContext();    // RD()
  const authHeaders    = getAuthHeaders();            // GV1()

  const defaultHeaders = {
    "x-app": isBackgroundProcess() ? "cli-bg" : "cli",
    "User-Agent": buildUserAgent(),
    "X-Claude-Code-Session-Id": currentSessionId(),
    ...authHeaders,
    ...(containerId    && { "x-claude-remote-container-id": containerId }),
    ...(remoteSessionId && { "x-claude-remote-session-id":  remoteSessionId }),
    ...(sdkClientApp   && { "x-client-app":                 sdkClientApp }),
    // v2.1.139+: surface the dispatching agent's identity so server-side
    // telemetry can stitch parent/child topology across subagent spawn.
    ...(dynamicAgent?.agentId       && { "x-claude-code-agent-id":         dynamicAgent.agentId }),
    ...(dynamicAgent?.parentAgentId && { "x-claude-code-parent-agent-id":  dynamicAgent.parentAgentId }),
  };
  /* ... build SDK client with defaultHeaders ... */
}

// Mapping: Tu→buildAnthropicClient, H→apiKey, $→maxRetries, q→model, K→fetchOverride,
//          _→source, A→containerId, z→remoteSessionId, Y→sdkClientApp, f→dynamicAgent,
//          O→authHeaders, w→defaultHeaders, RD→getDynamicAgentContext,
//          GV1→getAuthHeaders, N7→isBackgroundProcess, Kl→buildUserAgent, v$→currentSessionId
```

### Why Headers, Not Body Parameters?

**What it does:** Add `x-claude-code-agent-id` / `x-claude-code-parent-agent-id`
to the *HTTP request headers* of every Anthropic API call originating from
a subagent or teammate.

**Why this approach:**
1. **Transparent to model inputs.** A header doesn't perturb the
   `messages` array or `system` prompt the user sees in transcripts. The
   model can't observe the header and accidentally condition on it.
2. **Server-side aggregation.** Anthropic's request-routing infrastructure
   can group, rate-limit, and bill by `x-claude-code-agent-id` without
   the SDK having to inspect the body.
3. **Works under the SDK's compression / streaming pipeline.** The body
   may be chunked or post-processed; headers are stable.
4. **Preserves single-source-of-truth.** The agent-id is held in one place
   (`RD()`), not duplicated into each turn's request object.

**Alternative considered:** Add `metadata.user_id` style metadata into the
request body. Rejected because: (a) it would change the request schema,
(b) the body shape is shared with other Anthropic surfaces that
shouldn't see Claude-Code-specific identifiers, and (c) it'd require
threading the agent id through every call site instead of letting the
client read it from async-local once.

**Key insight:** Because the header is added inside the *factory* (and the
factory is called per-request, not memoised globally), every subagent gets
a freshly-built client with its own headers without any per-request
override gymnastics. This is the entire point of putting agent identity in
async-local: the factory just reads it.

### Conditional Emission

The headers are only added when present (`f?.agentId &&`). For the
top-level user session, `RD()` returns `undefined` (the outer code never
ran inside an `RU(...)`), so neither header is emitted. The main session's
identifier (`X-Claude-Code-Session-Id`) is always present and serves as the
top-level correlation key.

For a teammate, `RD()` is populated by the teammate's runner. For a
subagent, `RD()` is populated by `xi7` / `dispatchMainSessionSubagent`. For a
nested grand-subagent, `RD()` is populated by the parent subagent's own
dispatch — the chain is built by snapshotting once per spawn.

---

## Path 4: OTel / Perfetto Span Attributes

The same identity context drives observability backends.

### `getAgentSpanMetadata` — OTel attribute builder

```javascript
// ============================================
// getAgentSpanMetadata - Build agent-id attribute set for OTel spans
// Location: cli_inner_pretty.js:137636-137658
// ============================================

// ORIGINAL (for source lookup):
function vh1() {
  let H = RD();
  if (H) {
    let Y = { agentId: H.agentId, parentSessionId: H.parentSessionId, agentType: H.agentType };
    if (H.parentAgentId) Y.parentAgentId = H.parentAgentId;
    if (H.agentType === "teammate") Y.teamName = H.teamName;
    return Y;
  }
  let $ = tG(), q = CU(), K = q5(),
    A = AA() ? "teammate" : $ ? "standalone" : void 0;
  if ($ || A || q || K)
    return {
      ...($ && { agentId: $ }),
      ...(A && { agentType: A }),
      ...(q && { parentSessionId: q }),
      ...(K && { teamName: K }),
    };
  let z = fV8();
  if (z) return { parentSessionId: z };
  return {};
}

// READABLE (for understanding):
function getAgentSpanMetadata() {
  // (1) Fast path: a dynamic agent context exists → use it directly.
  const dynamic = getDynamicAgentContext();
  if (dynamic) {
    const tags = {
      agentId:          dynamic.agentId,
      parentSessionId:  dynamic.parentSessionId,
      agentType:        dynamic.agentType,
    };
    if (dynamic.parentAgentId)       tags.parentAgentId = dynamic.parentAgentId;
    if (dynamic.agentType === "teammate") tags.teamName = dynamic.teamName;
    return tags;
  }

  // (2) Fallback: assemble from the legacy per-piece accessors (teammate-aware).
  const agentId         = getAgentId();           // tG()
  const parentSessionId = getParentSessionId();   // CU()
  const teamName        = getTeamName();          // q5()
  const agentType       = isTeammate() ? "teammate" : (agentId ? "standalone" : undefined);

  if (agentId || agentType || parentSessionId || teamName) {
    return {
      ...(agentId         && { agentId }),
      ...(agentType       && { agentType }),
      ...(parentSessionId && { parentSessionId }),
      ...(teamName        && { teamName }),
    };
  }

  // (3) Last resort: maybe we're inside a fallback "ambient parent session" surface.
  const ambient = getAmbientParentSessionId();    // fV8()
  if (ambient) return { parentSessionId: ambient };

  return {};
}

// Mapping: vh1→getAgentSpanMetadata, H→dynamic, Y→tags, $→agentId, q→parentSessionId,
//          K→teamName, A→agentType, z→ambient, tG→getAgentId, CU→getParentSessionId,
//          q5→getTeamName, AA→isTeammate, RD→getDynamicAgentContext, fV8→getAmbientParentSessionId
```

### Three-Tier Fallback

The helper has three tiers because not every code path runs inside an
`RU(...)` push. Three concrete examples:

1. **Subagent on its first turn**: `RU()` is active → tier 1 returns the
   full record.
2. **Top-level teammate before its first runner call**: `Ei8` has the
   teammate context but `Atq` may not yet be populated → tier 2 reads from
   `tG()`/`CU()`/`q5()`/`AA()` which already prefer `BW()` over `RD()`.
3. **Background span emitted from a worker thread that never entered an
   agent context** (e.g. a daemon-side telemetry span): tiers 1 and 2
   return nothing → tier 3 attaches `parentSessionId` from an
   environment-supplied fallback (`fV8()` reads
   `CLAUDE_AMBIENT_PARENT_SESSION_ID`). This is the minimum context needed
   to correlate the span back to the user that triggered it.

### Perfetto Process / Thread Metadata

`s68` (`recordPerfettoAgent`) writes three Perfetto metadata events on
agent registration:

```javascript
ID6.push({ name: "process_name", cat: "__metadata", ph: "M", ts: 0,
           pid: agent.processId, tid: 0, args: { name: agent.agentName } });
ID6.push({ name: "thread_name",  cat: "__metadata", ph: "M", ts: 0,
           pid: agent.processId, tid: agent.threadId, args: { name: agent.agentName } });
if (agent.parentAgentId)
  ID6.push({ name: "parent_agent", cat: "__metadata", ph: "M", ts: 0,
             pid: agent.processId, tid: 0, args: { parent_agent_id: agent.parentAgentId } });
```

In the Perfetto UI, this renders each agent as its own "process" track with
a labelled thread; the `parent_agent` metadata event lets a trace viewer
join children to their parents visually. Threads correspond to
`agentName`s (deterministic via `T77()` hashing of the name).

`processId` is `1` for the top-level session (`agentId === currentSessionId()`)
and `V77(agentId)`-hashed integer for everything else, so the IDs are
deterministic but disjoint across spawn boundaries.

---

## Where Identity Is Set vs Read

| Site | Sets `Atq` (`RU`) | Sets `Ei8` (`sU$`) | Reads via `RD()` | Reads via `BW()` |
|------|-------------------|--------------------|------------------|------------------|
| `dispatchMainSessionSubagent` (`xi7`) | ✓ | – | – | – |
| Subagent turn loop body | – | – | ✓ (headers, spans) | – |
| `spawnInProcessTeammate` (`t68`) | – (delegated to runner) | – (delegated to runner) | ✓ (read `parentSessionId`) | – |
| Teammate runner (outer wrap) | ✓ | ✓ | – | – |
| Teammate turn loop body | – | – | ✓ | ✓ |
| Anthropic client factory (`Tu`) | – | – | ✓ (headers) | – |
| OTel span builders (`vh1`) | – | – | ✓ | – via accessors |
| Perfetto metadata (`iO$`) | – | – | ✓ (via `tG`/`vA`/`CU`) | – |

The "wrap-once / read-many" pattern is consistent: a single producer site
pushes the context once, and many consumer sites read it from the implicit
async stack rather than threading identity through every parameter.

---

## Lifetime and Inheritance

### Inheritance of `parentAgentId`

`parentAgentId` is captured **at spawn time** via `RD()?.agentId`. It is
therefore:
- *Inherited* from the spawner's `agentId` (the spawner becomes the
  parent).
- *Stable* over the child's entire lifetime, even if the spawner ends
  first.
- *Not chained at depth* — a grandchild knows its parent (the child), but
  not the grandparent. The chain is reconstructed by joining
  `(agentId, parentAgentId)` pairs server-side.

### No Inheritance from Other Async Local Storages

The two stores (`Atq`, `Ei8`) do not interact with the Node.js trace-event
async-context, with the OTel context-API, or with any other ALS. If
external instrumentation wants the agent identity, it must call `RD()` or
the convenience helpers.

### Reset on Process Boundary

`AsyncLocalStorage` lives in a single process. When the daemon spawns a
**bg worker** as a separate child process, identity is *not* propagated via
`Atq` — the child starts with no identity context. It must rebuild its own
context from argv flags (e.g. `--agent`, dispatch defaults) or from the
dispatch envelope written to its job-dir state file. See `permission_inheritance.md`
for the argv-level mechanisms.

This is why `parentAgentId` doesn't appear in bg-worker request headers
unless the worker explicitly rebuilds it. For `--bg` dispatched from
`claude agents`, the parent's session id flows via
`CLAUDE_AMBIENT_PARENT_SESSION_ID` env var instead (which surfaces as
`parentSessionId` in span tags, tier 3 of `getAgentSpanMetadata`).

---

## Why This Matters for Distributed Tracing

Before v2.1.139, Anthropic's server-side request log saw every subagent
call as if it came from the same session as the top-level chat. There was
no header that said "this call was made by a subagent of X". As a result:

1. **Quota / rate-limit metrics** lumped subagent fan-out into the parent's
   bucket without attribution. A user dispatching 8 parallel subagents
   couldn't see which one was responsible for a 429.
2. **Latency dashboards** showed only the top-level session's wall-clock
   time, not the subagent fan-out tree.
3. **Audit / safety reviews** couldn't reconstruct the agent tree from
   logs alone — they had to correlate by timestamps and by
   `messages[*].content` heuristics.

The `x-claude-code-agent-id` + `x-claude-code-parent-agent-id` pair, plus
the matching span attributes, lets the server side reconstruct the entire
spawn DAG from any single layer of the stack. Combined with the
`X-Claude-Code-Session-Id` (the top-level session uuid, always set), the
full join is:

```
(session-id, agent-id, parent-agent-id) → forest of agent trees
   rooted at the user's interactive session
```

This is the cheapest possible mechanism — three string headers per
request — and it adds no body bytes, no extra round-trips, and no
coordination between client and server.

---

## See Also

- [coordinator_process_model.md](./coordinator_process_model.md) — Bg-worker process boundaries (where header propagation stops at the child fork)
- [permission_inheritance.md](./permission_inheritance.md) — How dispatch defaults rebuild identity across process boundaries
- [v2_1_142_dispatch_flags.md](./v2_1_142_dispatch_flags.md) — `--add-dir` / `--model` / `--permission-mode` flags that flow alongside identity in argv
- [v2_1_142_subagent_matching.md](./v2_1_142_subagent_matching.md) — How a subagent is *identified* by type-name before identity propagation runs
- v2.1.112 baseline: identity propagation existed in skeleton form via the teammate context only; the dynamic-agent ALS and request headers were introduced in v2.1.139 and carried forward unchanged into v2.1.142.
