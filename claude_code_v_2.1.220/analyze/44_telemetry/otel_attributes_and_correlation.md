# OTel attributes and trace correlation (2.1.202 / 2.1.212 / 2.1.214 / 2.1.216)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines, `VERSION 2.1.220`, `build_sha 4073f595`).
**Baseline:** `…/2.1.193/extract/cli_inner_pretty.js` — every `(193)` citation is tagged.

Bullets covered here:

| Version | Bullet |
|---|---|
| `.202` | *Added `workflow.run_id` and `workflow.name` OpenTelemetry attributes to telemetry emitted by workflow-spawned agents* |
| `.212` | *Fixed OTLP event log records missing `trace_id`/`span_id` when `TRACEPARENT` is set in SDK/headless mode* |
| `.214` | *Added `message.uuid`, `client_request_id`, and `tool_source` attributes to OpenTelemetry log events* |
| `.214` | *Fixed OTel log events emitted outside the turn's async context missing the interaction span's trace context* |
| `.216` | *Fixed telemetry misreporting permission denials: failed permission-prompt requests no longer count as user rejections, and user interrupts are now reported as user aborts instead of rejections* |

---

## 1. The one function all five bullets pass through

Every OTel *log event* in Claude Code is emitted by a single function. In 2.1.193 it took two
parameters. In 2.1.220 it takes three, and gained two lines in its body. Those two lines are the
`.202`, `.212` and `.214`-correlation bullets.

```javascript
// ============================================
// emitOtelLogEvent - the single emission point for every claude_code.* OTel log record
// Location: cli_inner_pretty.js:167354-167372
// ============================================

// ORIGINAL (for source lookup):
async function Ac(e, t = {}, r) {
  let n = { ...qRt(), "event.name": e, "event.timestamp": new Date().toISOString(), "event.sequence": z1g++ },
    o = _0t();
  if (o) n["prompt.id"] = o;
  let i = Z.CLAUDE_CODE_WORKSPACE_HOST_PATHS;
  if (i) n["workspace.host_paths"] = i.split("|");
  Object.assign(n, D5r(r));
  for (let [u, d] of Object.entries(t)) if (d !== void 0) n[u] = d;
  let s = new Date(),
    a = X1g(),
    l = { timestamp: s, observedTimestamp: s, body: `claude_code.${e}`, attributes: n, ...(a && { context: a }) },
    c = Z$r();
  if (c) {
    c.emit(l);
    return;
  }
  if (!WSi(l) && !rlu)
    ((rlu = !0), w(`[3P telemetry] Event dropped (no event logger initialized): ${e}`, { level: "warn" }));
}

// READABLE (for understanding):
async function emitOtelLogEvent(eventName, metadata = {}, agentContext) {
  let attributes = {
    ...getTelemetryAttributes(),                       // user.id / session.id / organization.id / …
    "event.name": eventName,
    "event.timestamp": new Date().toISOString(),
    "event.sequence": eventSequence++,
  };
  let promptId = getPromptId();
  if (promptId) attributes["prompt.id"] = promptId;
  let workspaceHostPaths = env.CLAUDE_CODE_WORKSPACE_HOST_PATHS;
  if (workspaceHostPaths) attributes["workspace.host_paths"] = workspaceHostPaths.split("|");

  Object.assign(attributes, buildWorkflowOtelAttributes(agentContext));   // NEW in this window (.202)

  for (let [key, value] of Object.entries(metadata)) if (value !== undefined) attributes[key] = value;

  let now = new Date(),
    resolvedContext = resolveLogRecordTraceContext(),                     // NEW in this window (.212/.214)
    logRecord = {
      timestamp: now,
      observedTimestamp: now,
      body: `claude_code.${eventName}`,
      attributes,
      ...(resolvedContext && { context: resolvedContext }),               // NEW in this window
    },
    betaLogger = getBetaEventLogger();
  if (betaLogger) { betaLogger.emit(logRecord); return; }
  if (!emitToOrgEventLogger(logRecord) && !hasWarnedNoEventLogger)
    ((hasWarnedNoEventLogger = true),
      logForDebugging(`[3P telemetry] Event dropped (no event logger initialized): ${eventName}`, { level: "warn" }));
}

// Mapping: Ac→emitOtelLogEvent, qRt→getTelemetryAttributes, _0t→getPromptId, D5r→buildWorkflowOtelAttributes,
//          X1g→resolveLogRecordTraceContext, Z$r→getBetaEventLogger, WSi→emitToOrgEventLogger,
//          z1g→eventSequence, rlu→hasWarnedNoEventLogger, w→logForDebugging, Z→env
```

The 2.1.193 original, for the diff:

```javascript
// ORIGINAL (2.1.193, for source lookup) — cli_inner_pretty.js:195214-195230 (193):
async function Jc(e, t = {}) {
  let n = { ...R4e(), "event.name": e, "event.timestamp": new Date().toISOString(), "event.sequence": jNd++ },
    r = DTt();
  if (r) n["prompt.id"] = r;
  let o = process.env.CLAUDE_CODE_WORKSPACE_HOST_PATHS;
  if (o) n["workspace.host_paths"] = o.split("|");
  for (let [l, c] of Object.entries(t)) if (c !== void 0) n[l] = c;
  let s = new Date(),
    i = { timestamp: s, observedTimestamp: s, body: `claude_code.${e}`, attributes: n },
    a = qpr();
  ...
}
```

Three structural differences, and nothing else:

1. a third parameter `agentContext`;
2. `Object.assign(n, D5r(r))` — the workflow attributes;
3. `a = X1g()` plus `...(a && { context: a })` — **the log record now carries an explicit OTel
   `Context`**. In 2.1.193 the record had no `context` field at all.

The `v2.1.88` named tree calls this function `logOTelEvent`
(`3rd/claude-code/src/utils/telemetry/events.ts`) and `qRt`/`R4e` `getTelemetryAttributes`
(`3rd/claude-code/src/utils/telemetryAttributes.ts`) — names worth using, because the obfuscated
`Ac` is reused for unrelated declarations elsewhere in the bundle.

**Scale of the change:** the *number* of distinct events is unchanged — `grep -c 'Ac("'` is
**220=39**, `grep -c 'Jc("'` is **193=39**. What changed is how many of them are *correlated*:
`grep -c 'agentContext,$'` is **220=29 / 193=18**. Eleven more call sites now hand the emitter an
agent context. That count is the honest measure of this window's telemetry work: not new events,
better joins.

---

## 2. `workflow.run_id` / `workflow.name` (.202) — and a ground-truth correction

### 2.1 The false-delta trap, resolved

`_GROUND_TRUTH_verified_anchors.md` §3 lists this bullet as *"220=3 / 193=2 — partially
pre-existing. Find the one new emission site."* **That is a regex artefact and the bullet is fully
net-new.** The probe used `grep -c 'workflow.run_id'`, where `.` is a wildcard:

```
grep -c  'workflow.run_id'  → 220=3 / 193=2     (matches workflow_run_id too)
grep -cF 'workflow.run_id'  → 220=1 / 193=0     (the actual dotted OTel attribute)
grep -cF 'workflow.name'    → 220=1 / 193=0
```

The 193 "hits" are `workflow_run_id:` — a **snake_case field of the internal `tengu_*` analytics
payload**, at `:424852 (193)` and `:424892 (193)`. Those still exist in 2.1.220 at `:388701` and
`:388741`, unchanged. The dotted `workflow.run_id` / `workflow.name` **OTel** attribute names appear
exactly once each, in one new function.

### 2.2 The mechanism

```javascript
// ============================================
// buildWorkflowOtelAttributes - dotted OTel attributes for a workflow-spawned subagent
// Location: cli_inner_pretty.js:111459-111462
// ============================================

// ORIGINAL (for source lookup):
function D5r(e) {
  if (!e || !mde(e) || !e.workflowRunId) return {};
  return { "workflow.run_id": e.workflowRunId, ...(e.workflowName && { "workflow.name": e.workflowName }) };
}

// READABLE (for understanding):
function buildWorkflowOtelAttributes(agentContext) {
  if (!agentContext || !isSubagentContext(agentContext) || !agentContext.workflowRunId) return {};
  return {
    "workflow.run_id": agentContext.workflowRunId,
    ...(agentContext.workflowName && { "workflow.name": agentContext.workflowName }),
  };
}

// Mapping: D5r→buildWorkflowOtelAttributes, mde→isSubagentContext
```

Its sibling `nZ` at `:111463-111466` returns the **camelCase** `{ workflowRunId, workflowName }`
shape for the internal analytics pipe. Two functions, same data, two naming conventions — that is
the giveaway that `D5r` was added *alongside* an existing internal path, not converted from it.

Three call sites, all read:

- `:167360` — inside `emitOtelLogEvent`, so **every** `claude_code.*` log event is covered.
- `:168127` — `u.setAttributes(D5r(t))` on the `claude_code.llm_request` span.
- `:168218` — `c.setAttributes(D5r(t))` on the `claude_code.tool` span.

### `Decision: three guards before emitting, and only for subagents`

**What it does:** decides whether a telemetry record gets workflow attribution.

**How it works:**
1. `!agentContext` — no context at all (a bare `emitOtelLogEvent("auth", …)` call with two args);
   return `{}`.
2. `!isSubagentContext(agentContext)` — `mde(e)` is `e.agentType === "subagent"` (`:111442`). The
   *main* agent is excluded even when it is the thing that started the workflow.
3. `!agentContext.workflowRunId` — a subagent that was not spawned by a workflow.
4. `workflow.name` is spread conditionally; `workflow.run_id` is not. The run id is the join key and
   is always present once we get past guard 3; the name is a human label that may be absent.

**Why this approach:**
- Guard 2 is the interesting one. Attributing the *main* agent's events to the workflow would make
  `workflow.run_id` non-selective: a session that ran one workflow would tag its entire remaining
  life with that run id, because the main agent context outlives the workflow. Restricting to
  subagent contexts means the attribute set is exactly "records produced by agents the workflow
  created" — which is what the bullet promises ("*so a workflow run's activity can be
  reconstructed*").
- Returning `{}` rather than `undefined` lets the caller use an unconditional
  `Object.assign(attrs, D5r(ctx))` with no null check. Same trick as `Got` (`:111449-111458`), the
  `subagent_type` / `is_built_in_agent` builder, which wraps its body in `try { … } catch { return {} }`.
- The three-guard ladder is ordered cheapest-first: identity check, string compare, property read.

**Key insight:** the attribute is deliberately *not* session-wide. Its selectivity, not its
presence, is what makes a workflow reconstructable — and that selectivity is the sole reason a
separate `D5r` exists next to the pre-existing `nZ`.

---

## 3. Trace-context propagation for log records (.212 / .214)

Two bullets, one new function. Both are real, but the anchor the scoping pass used
(`traceparent: Z.TRACEPARENT`, 220=2 / 193=0) **over-counts by one** and must be split.

### 3.1 The over-count, proved

```
grep -cF 'traceparent: Z.TRACEPARENT'            → 220=2 / 193=0
grep -n  'traceparent: process.env.TRACEPARENT'  → 193: :286545
```

2.1.193 already extracted `TRACEPARENT` — it just spelled the read `process.env.TRACEPARENT`
instead of routing it through the typed env accessor `Z`. The two 2.1.220 sites are therefore
**not** two new features:

| 220 site | 193 counterpart | Verdict |
|---|---|---|
| `:168065` — `a = yn() && Z.TRACEPARENT ? PS.propagation.extract(r, {…}) : r` on the **interaction span** | `:286545 (193)` — `Tr() && process.env.TRACEPARENT ? Ym.propagation.extract(n, {…}) : n` | **carryover**, `process.env.X` → `Z.X` rewrite only |
| `:167351` — inside `X1g()`, on the **log record** | none | **net-new** |

Likewise `ROOT_CONTEXT &&` is 220=1 / 193=1: the module-level stored-context fallback
(`:167328-167331` vs `:286500-286503 (193)`) is carryover. 2.1.193 assigned that variable inline
(`E2t = n` at `:286511 (193)`); 2.1.220 wraps it in a setter/getter pair `les`/`tlu`
(`:167322-167327`) — a refactor, not a behaviour change.

### 3.2 The net-new function

```javascript
// ============================================
// resolveLogRecordTraceContext - picks the OTel Context a log record should be stamped with
// Location: cli_inner_pretty.js:167346-167353
// ============================================

// ORIGINAL (for source lookup):
function X1g() {
  let e = Uio(),
    t = arr.trace.getSpanContext(e);
  if (t && arr.isSpanContextValid(t)) return e;
  if (yn() && Z.TRACEPARENT)
    return Y1g.extract(e, { traceparent: Z.TRACEPARENT, tracestate: Z.TRACESTATE }, arr.defaultTextMapGetter);
  return;
}

// READABLE (for understanding):
function resolveLogRecordTraceContext() {
  let candidate = getActiveOrStoredContext();                       // ALS context, or the stored interaction context
  let spanContext = otelApi.trace.getSpanContext(candidate);
  if (spanContext && otelApi.isSpanContextValid(spanContext)) return candidate;   // 1. a live span wins
  if (isNonInteractive() && env.TRACEPARENT)                                       // 2. headless/SDK: adopt the caller's trace
    return w3cPropagator.extract(
      candidate,
      { traceparent: env.TRACEPARENT, tracestate: env.TRACESTATE },
      otelApi.defaultTextMapGetter,
    );
  return;                                                                          // 3. no context — record stays unlinked
}

// Mapping: X1g→resolveLogRecordTraceContext, Uio→getActiveOrStoredContext, arr→otelApi,
//          Y1g→w3cPropagator (new nlu.W3CTraceContextPropagator(), :111425 region → :167425),
//          yn→isNonInteractive (:3286, `!Ot.isInteractive`), Z→env
```

and the fallback it builds on, which *is* carryover:

```javascript
// ============================================
// getActiveOrStoredContext - ALS context, falling back to the last-entered interaction context
// Location: cli_inner_pretty.js:167328-167331
// ============================================

// ORIGINAL (for source lookup):
function Uio() {
  let e = S8e.active();
  return e === aes.ROOT_CONTEXT && Bio ? Bio : e;
}

// READABLE (for understanding):
function getActiveOrStoredContext() {
  let active = contextManager.active();                          // AsyncLocalStorage store ?? ROOT_CONTEXT
  return active === otelApi.ROOT_CONTEXT && storedInteractionContext
    ? storedInteractionContext
    : active;
}

// Mapping: Uio→getActiveOrStoredContext, S8e→contextManager (elu instance, :167335),
//          aes→otelApi, Bio→storedInteractionContext
```

### `Algorithm: three-tier trace-context resolution`

**What it does:** answers "which trace does this log record belong to?" at the moment of emission,
for a client where emission frequently happens on a different async stack from the span that logically
owns it.

**How it works:**
1. **`contextManager.active()`** (`:167295-167297`) returns the AsyncLocalStorage store, or
   `ROOT_CONTEXT` if there is none. This is the happy path: a tool handler running inside
   `S8e.with(ctx, fn)` (`:168078`) sees the turn's context.
2. **The stored-context fallback.** `sat()` at `:168030-168033` does
   `S8e.enterWith(r)` and, when the span key is the interaction key `oat`, also `les(r)` — parking the
   interaction context in a module-level variable. `aat()` at `:168035-168036` clears it on span end.
   So when a callback has *lost* the ALS store — a `setTimeout`, a detached `.then()`, an
   `EventEmitter` handler registered before the turn began — step 1 yields `ROOT_CONTEXT` and step 2
   substitutes the interaction context anyway. **This is exactly the `.214` bullet** ("*OTel log
   events emitted outside the turn's async context*").
3. **`isSpanContextValid`.** Even after step 2 the context may hold no span (before the first turn,
   or after `W$e()` ended the interaction). The check is on the extracted *span context*, not on the
   context object — a `Context` is always truthy, a span context is not always valid.
4. **`TRACEPARENT` extraction, non-interactive only.** If there is still no valid span, and the
   process is headless (`yn()` = `!Ot.isInteractive`, `:3286-3288`), the W3C `traceparent` from the
   environment is parsed and used. This is the `.212` bullet.
5. **`return;`** — `undefined`. The caller's `...(a && { context: a })` then omits the field entirely
   rather than passing `undefined` into the SDK.

**Why this approach:**
- **Why gate step 4 on non-interactive?** `TRACEPARENT` is a *single* span id injected by whoever
  launched the process (a CI job, a parent SDK call). In a headless run that is correct for the
  whole process: one invocation, one parent span. In an interactive REPL the process outlives the
  launching span by hours, so stamping turn 40's events with the shell's startup traceparent would
  produce a trace with a 6-hour root span and no causal meaning. The same predicate guards the
  interaction span at `:168065`, so client-side the two paths agree.
- **Why not just always call `propagation.extract`?** Because step 1 must win. If a real span is
  active, adopting `TRACEPARENT` would *reparent* the record out of the span that actually produced
  it. Ordering "live span → env traceparent → nothing" is the only ordering that keeps in-process
  causality authoritative and treats the environment as a last resort.
- **Alternative not taken:** stamping the record with `ROOT_CONTEXT` unconditionally. That is what
  2.1.193 effectively did by omitting `context` — the SDK falls back to `context.active()` at emit
  time, which is `ROOT_CONTEXT` in precisely the cases the bullets complain about. Passing an
  explicit resolved context moves the decision from the SDK's implicit ambient read to a call site
  that can see the stored-context fallback.
- **Failure mode on a malformed `TRACEPARENT`:** `W3CTraceContextPropagator.extract` returns the
  input context unchanged when the header does not parse. `X1g` then returns that context, whose
  span context is still invalid — so the record gets a `context` that carries no trace ids. The
  record is emitted, unlinked, with no error. Silent degradation, no crash.

**Key insight:** the fix is not "read `TRACEPARENT`" — 2.1.193 already did that for spans. The fix
is that **log records were never given a context object at all**, so they silently inherited
whatever the SDK's ambient read produced. One new function and one conditional spread in the
emitter close a gap that no amount of `TRACEPARENT` plumbing elsewhere could have closed.

---

## 4. `message.uuid`, `client_request_id`, `tool_source` (.214)

The bullet names three attributes. They have three different provenance stories, and the ground
truth is right to insist on splitting them.

| Attribute | Literal count | Verdict |
|---|---|---|
| `"message.uuid"` | 220=**3** / 193=**0** | net-new (3 sites) |
| `client_request_id` | 220=**7** / 193=**5** | 5 carryover + **2 new** |
| `tool_source` | 220=**1** / 193=**0** | net-new (1 builder, 2 call sites) |

> Counting note: the scoping pass reported `message.uuid` as 19/14 using an unescaped regex, where
> `.` matched the property accesses `message?.uuid` / `message.uuid` that exist throughout both
> bundles. `grep -cF '"message.uuid"'` — the quoted attribute name — is the correct probe and gives
> 3/0.

### 4.1 `message.uuid` — joining OTel logs to transcript entries

Three emission sites, all read:

- `:340052` — `assistant_response`: `"message.uuid": b.at(-1)?.uuid`
- `:343276` — `user_prompt` (interactive path)
- `:593770` — `user_prompt` (SDK / headless path)

The interactive site shows why the attribute is worth anything:

```javascript
// ============================================
// emitUserPromptEvent (inlined) - the OTel uuid is the SAME uuid written to the transcript
// Location: cli_inner_pretty.js:343270-343278
// ============================================

// ORIGINAL (for source lookup):
    let ae = lKe.randomUUID();
    q9t(ae);
    let Te = nN(o.options.mainLoopModel, Sb(o));
    O("tengu_input_prompt", { ...(c && { prompt_source: fe(c) }), ...(Te && { effort_level: fe(Te) }) });
    let ve = s || lKe.randomUUID();
    return (
      Ac("user_prompt", { prompt_length: String(e.length), prompt: P9r(e), "prompt.id": ae, "message.uuid": ve }),
      {
        messages: [zr({ content: Dfe({ inputString: e, precedingInputBlocks: t }), uuid: ve, promptSource: c }), ...n],
        shouldQuery: !0,
      }
    );

// READABLE (for understanding):
    let promptId = crypto.randomUUID();
    setCurrentPromptId(promptId);
    let effort = resolveReasoningEffort(context.options.mainLoopModel, getAgentConfig(context));
    logTenguEvent("tengu_input_prompt", { ...(promptSource && { prompt_source: str(promptSource) }),
                                          ...(effort && { effort_level: str(effort) }) });
    let messageUuid = providedUuid || crypto.randomUUID();        // <- one uuid
    return (
      emitOtelLogEvent("user_prompt", {
        prompt_length: String(rawInput.length),
        prompt: redactIfDisabled(rawInput),
        "prompt.id": promptId,
        "message.uuid": messageUuid,                              // <- stamped on the OTel record
      }),
      {
        messages: [makeUserMessage({ content: buildContent({ inputString: rawInput, precedingInputBlocks }),
                                     uuid: messageUuid,           // <- and on the transcript message
                                     promptSource }), ...priorMessages],
        shouldQuery: true,
      }
    );

// Mapping: Ac→emitOtelLogEvent, P9r→redactIfDisabled, q9t→setCurrentPromptId, O→logTenguEvent,
//          zr→makeUserMessage, lKe→crypto, ve→messageUuid, ae→promptId
```

`messageUuid` is minted once and used twice — once as the OTel attribute, once as the transcript
message's `uuid`. That is the whole point: an operator holding an OTel log record can now `grep` the
`.jsonl` transcript for the exact message, and vice versa. The pre-existing `prompt.id` (`:167357`)
does not do this — it is a per-prompt telemetry id with no transcript counterpart.

**An informative asymmetry:** the *third* `user_prompt` emission, the slash-command path at
`:343402-343408`, has `prompt.id`, `command_name` and `command_source` but **no `message.uuid`**. A
slash command is not necessarily a transcript message (it may resolve entirely client-side), so
there is no uuid to join to. The attribute is present exactly where a join target exists, which is
better engineering than emitting a synthetic uuid that resolves to nothing.

### 4.2 `client_request_id` — the two genuinely new sites

Site-by-site mapping (all ten lines read in their own bundle):

| 220 | 193 | |
|---|---|---|
| `:167740` | `:286218 (193)` | carryover |
| `:168137` | `:286617 (193)` | carryover |
| `:168179` | `:286659 (193)` | carryover |
| `:509624` | `:594494 (193)` | carryover |
| `:510277` | `:594969 (193)` | carryover |
| `:339695` | — | **new** — the `api_error` OTel event |
| `:340033` | — | **new** — the `api_request` OTel event |

The 2.1.193 `api_error` emission (`:468312-468323 (193)`) and `api_request` emission
(`:468642-468656 (193)`) are otherwise attribute-for-attribute identical to 220's `:339687-339700`
and `:340022-340037`. So the pre-existing five sites were *spans* and *internal* analytics; the
delta is that the two highest-volume **log events** now carry the id.

Both new sites use the same guard, and it is not obvious:

```javascript
// :339684  (api_error path)
let D = c ? void 0 : l;                     // c = didFallBackToNonStreaming, l = clientRequestId
// :339695
        client_request_id: D,

// :340033  (api_request path)
        client_request_id: f ? void 0 : u,
```

`c` is the same variable emitted as `didFallBackToNonStreaming: c` at `:339672`. **When the request
fell back from streaming to non-streaming, the client request id is suppressed.** The reason is
sound: the fallback issues a *second* HTTP request, so the id the client is holding no longer
identifies the request whose outcome is being reported. Emitting it would create a false join.
2.1.193 already applied exactly this guard to its internal event (`clientRequestId: c ? void 0 : l`
at `:468342 (193)`); the `.214` change is that the OTel events adopted the established convention
rather than inventing a looser one.

### 4.3 `tool_source` — tool provenance in three values

```javascript
// ============================================
// buildToolSourceAttribute - classifies where a tool implementation came from
// Location: cli_inner_pretty.js:152007-152010
// ============================================

// ORIGINAL (for source lookup):
function Kro(e) {
  let t = !e ? "builtin" : zro(e) ? "sdk_host_builtin_mcp" : "mcp";
  return { tool_source: fe(t) };
}

// READABLE (for understanding):
function buildToolSourceAttribute(mcpInfo) {
  let source = !mcpInfo
    ? "builtin"                       // no MCP info at all -> compiled into the CLI
    : isSdkHostServer(mcpInfo)        // serverType === "sdk" && callerIsSdkHost()
      ? "sdk_host_builtin_mcp"        // an MCP server the embedding SDK host itself provides
      : "mcp";                        // a genuine third-party MCP server
  return { tool_source: attrString(source) };
}

// Mapping: Kro→buildToolSourceAttribute, zro→isSdkHostServer (:151999-152001), fe→attrString (:141-143)
```

`zro` is `e?.serverType === "sdk" && FOe()`. Two conditions, because `serverType: "sdk"` alone is
claimed by the payload; `FOe()` (`:46438`) confirms from the client side that we really are running
under an SDK host. A server cannot promote itself into the `sdk_host_builtin_mcp` bucket.

Both call sites are the two `tool_decision` emissions, and both also gained the `agentContext`
third argument in the same edit:

```javascript
// :315748-315759  (recordToolDecision)
  Ac("tool_decision",
    { decision: c, source: f, tool_name: ua(n.name), tool_use_id: a,
      ...Kro(n.mcpInfo),
      ...(Object.keys(m).length > 0 && { tool_parameters: Ie(m) }) },
    i.agentContext);

// :425978-425989  (the fast-path emission when no prompt was shown)
  Ac("tool_decision",
    { decision: ce, source: se, tool_name: ua(e.name), tool_use_id: t,
      ...Kro(e.mcpInfo),
      ...(Object.keys(ne).length > 0 && { tool_parameters: Ie(ne) }) },
    n.agentContext);
```

The 2.1.193 counterpart at `:307102-307108 (193)` has neither `...Kro(...)` nor the third argument —
the argument lists are otherwise identical. So one attribute and one correlation channel were added
to both emissions of the same event in one change.

### `Decision: why a three-way enum instead of a boolean is_mcp`

**What it does:** distinguishes three provenances for the tool that a permission decision was made
about.

**How it works:** a single ternary chain over `mcpInfo`, evaluated at the emission site (not stored
on the tool), so it always reflects the registration that actually served this call.

**Why this approach:**
- A boolean `is_mcp` already existed nearby — `:425964` passes `isMcp: e.isMcp ?? !1` to the internal
  analytics event on the very same code path. The OTel attribute deliberately does *not* reuse it,
  because `is_mcp: true` conflates a user's own third-party MCP server with a tool the *embedding
  host* injected through the MCP transport. For a security reviewer reading `tool_decision` records
  those are opposite risk profiles: `sdk_host_builtin_mcp` is first-party code that merely travels
  over MCP; `mcp` is code the operator installed.
- Returning `{ tool_source: … }` (an object) rather than the bare string lets the call sites spread
  it, so adding a second provenance attribute later needs no edit at the call sites — the same
  pattern as `D5r` (§2) and `Got` (`:111449`).
- `fe()` (`:141-143`) is the identity-typed attribute-string wrapper; using it rather than a raw
  literal is what keeps the value inside the project's "this string is safe to export" discipline.

**Key insight:** the enum is defined by *who supplied the implementation*, not by *which transport
carried it*. That is the distinction the boolean could not express, and it is the reason a new
attribute was worth adding next to one that already existed.

---

## 5. Permission-denial misreporting (.216)

**Bullet:** *failed permission-prompt requests no longer count as user rejections, and user
interrupts are now reported as user aborts instead of rejections.*

`user_abort` is 220=5 / 193=4 — one new site. It is in the function that maps a permission
`decisionReason` onto the `source` attribute of the `tool_decision` event.

```javascript
// ============================================
// mapDecisionReasonToTelemetrySource - decisionReason -> tool_decision "source" attribute
// Location: cli_inner_pretty.js:425294-425320
// ============================================

// ORIGINAL (for source lookup):
function XJy(e, t) {
  if (!e) return "config";
  switch (e.type) {
    case "permissionPromptTool": {
      let n = e.toolResult?.decisionClassification;
      if (n === "user_temporary" || n === "user_permanent" || n === "user_reject") return n;
      return t === "allow" ? "user_temporary" : "user_reject";
    }
    case "rule":
      return YJy(e.rule.source, t);
    case "hook":
      return "hook";
    case "mode":
    case "classifier":
    case "subcommandResults":
    case "asyncAgent":
    case "sandboxOverride":
    case "workingDir":
    case "safetyCheck":
      return "config";
    case "other":
      if (e.reason === i7t) return "user_abort";
      return "config";
    default:
      return "config";
  }
}

// READABLE (for understanding):
function mapDecisionReasonToTelemetrySource(decisionReason, behavior) {
  if (!decisionReason) return "config";
  switch (decisionReason.type) {
    case "permissionPromptTool": {
      let classification = decisionReason.toolResult?.decisionClassification;
      if (classification === "user_temporary" || classification === "user_permanent" || classification === "user_reject")
        return classification;                                  // the prompt tool told us what the user did
      return behavior === "allow" ? "user_temporary" : "user_reject";   // inferred from the outcome
    }
    case "rule":   return mapRuleSourceToTelemetrySource(decisionReason.rule.source, behavior);
    case "hook":   return "hook";
    case "mode": case "classifier": case "subcommandResults": case "asyncAgent":
    case "sandboxOverride": case "workingDir": case "safetyCheck":
      return "config";
    case "other":
      if (decisionReason.reason === CAN_USE_TOOL_ABORTED_REASON) return "user_abort";   // NEW in .216
      return "config";
    default: return "config";
  }
}

// Mapping: XJy→mapDecisionReasonToTelemetrySource, YJy→mapRuleSourceToTelemetrySource,
//          i7t→CAN_USE_TOOL_ABORTED_REASON ("tool permission request aborted", :58356)
```

2.1.193's counterpart, `Mef` at `:444511-444534 (193)`, is byte-identical except for one line —
its `case "other":` is folded into the `return "config"` group at `:444530-444531 (193)`, with no
reason inspection at all.

### 5.1 The supporting taxonomy is entirely new

The abort reason is one of **four** new permission-failure reason strings introduced in this window,
declared together at `:58353-58356` with canonical reason objects at `:58380-58383`:

```javascript
// :58353-58356
  q5n = "tool permission stream closed before response received",
  V5n = "canUseTool returned a schema-invalid permission result",
  z5n = "tool permission request failed",
  i7t = "tool permission request aborted",
// :58380-58383
    (VPi = { type: "other", reason: q5n }),
    (G4r = { type: "other", reason: V5n }),
    (zPi = { type: "other", reason: z5n }),
    (s7t = { type: "other", reason: i7t }));
```

All four literals, and the three internal telemetry values they map to, are **220>0 / 193=0**:

```
tool permission stream closed before response received   1 / 0
canUseTool returned a schema-invalid permission result   2 / 0
tool permission request failed                           1 / 0
tool permission request aborted                          1 / 0
permissionStreamClosed                                   1 / 0
canUseToolInvalidResult                                  1 / 0
canUseToolRequestFailed                                  1 / 0
```

The internal-event side of the mapping is the `case "other":` ladder in `Mtd`'s sibling at
`:315790-315799`, which now discriminates seven reasons:

```javascript
    case "other":
      if (r.reason === Axt) return "sandboxAutoAllow";
      if (r.reason === B4r) return "readOnlyCommand";
      if (r.reason === U4r) return "classifierTranscriptTooLong";
      if (r.reason === q5n) return "permissionStreamClosed";
      if (r.reason === V5n) return "canUseToolInvalidResult";
      if (r.reason === z5n) return "canUseToolRequestFailed";
      if (r.reason === i7t) return "canUseToolAborted";
      if (r.bashMissKind !== void 0) return `bashMiss:${r.bashMissKind}`;
      return "other";
```

### `Decision: why "config" was the wrong default, and why the fix is a reason check`

**What it does:** stops an infrastructure failure in the permission-prompt channel from being
recorded as a human decision.

**How it works:**
1. In 2.1.193, a `--permission-prompt-tool` invocation that never answered produced
   `decisionReason.type === "permissionPromptTool"` with no `decisionClassification`, so line
   `:444517 (193)` inferred from the outcome: not-allow ⇒ `"user_reject"`. **The absence of an answer
   was recorded as a rejection.**
2. 2.1.220 gives those failures a *different reason type*. The four new canonical objects are all
   `{ type: "other", reason: … }` — they leave the `permissionPromptTool` branch entirely, so the
   outcome-inference on line `:425300` can never see them.
3. Of the four, only the abort maps to a user-attributed source (`user_abort`, `:425315`); stream
   closure, schema-invalid result, and request failure all fall through to `"config"` — recorded as
   a policy outcome, not a person.

**Why this approach:**
- **Why not simply return `"unknown"` for all four?** Because they are not equally unknown. A user
  pressing Esc *is* a user action and belongs in the user-attributed bucket; a dead socket is not.
  Collapsing them would trade one misattribution for another.
- **Why route the abort through `"other"` rather than adding a `"user_abort"` reason type?**
  `jPi` at `:58364-58376` is the closed list of eleven reason types, consumed by schema validation
  and by the permission engine's own switches. Adding a twelfth type means touching every exhaustive
  switch over it. Adding a *reason string* under the existing `"other"` type costs one `if` in each
  of the two mappers — and both mappers already had an `"other"` arm to extend.
- **The ordering in `:315790-315799` matters**: `bashMissKind` is checked *last*, after all seven
  named reasons. A reason object can carry both fields, and the named reason is the more specific
  explanation.
- **Failure mode:** an `"other"` reason that matches none of the seven falls to `"other"` / `"config"`.
  Unknown failures are silently bucketed as policy outcomes — the same class of misattribution the
  bullet fixes, just narrower. The taxonomy is open-ended by construction.

**Key insight:** `decisionClassification` is 220=5 / 193=5 — the *classification plumbing* is
untouched. The fix is upstream of it: the failure paths were given a reason type that never reaches
the inference. A literal-count diff on this bullet reports "no change"; the change is which branch
the data flows down.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this module are staged in
> [symbol_additions_v2_1_220_telemetry.md](../00_overview/symbol_additions_v2_1_220_telemetry.md).

Key functions in this document:
- `emitOtelLogEvent` (`Ac`, `:167354`) - the single emission point for `claude_code.*` OTel log records; named `logOTelEvent` in `3rd/claude-code/src/utils/telemetry/events.ts`
- `getTelemetryAttributes` (`qRt`, `:167170`) - base attribute set (user/session/org/version/entrypoint)
- `buildWorkflowOtelAttributes` (`D5r`, `:111459`) - dotted `workflow.run_id` / `workflow.name`
- `buildWorkflowAnalyticsContext` (`nZ`, `:111463`) - camelCase sibling for the internal `tengu_*` pipe
- `buildSubagentOtelAttributes` (`Got`, `:111449`) - `subagent_type` / `is_built_in_agent`
- `isSubagentContext` (`mde`, `:111442`) - `agentType === "subagent"`
- `resolveLogRecordTraceContext` (`X1g`, `:167346`) - three-tier trace-context resolution for log records
- `getActiveOrStoredContext` (`Uio`, `:167328`) - ALS context with the stored-interaction fallback
- `setStoredInteractionContext` (`les`, `:167322`) / `getStoredInteractionContext` (`tlu`, `:167325`)
- `enterSpanScope` (`sat`, `:168030`) / `exitSpanScope` (`aat`, `:168035`) - where the stored context is parked and cleared
- `isNonInteractive` (`yn`, `:3286`) - `!Ot.isInteractive`; gates `TRACEPARENT` adoption
- `redactIfDisabled` (`P9r`, `:167340`) - `OTEL_LOG_USER_PROMPTS` redaction gate
- `buildToolSourceAttribute` (`Kro`, `:152007`) - `tool_source` ∈ `builtin | sdk_host_builtin_mcp | mcp`
- `isSdkHostServer` (`zro`, `:151999`) - `serverType === "sdk" && callerIsSdkHost()`
- `recordToolDecision` (`Ptd`, `:315736`) - emits `tool_decision` after a prompt
- `mapDecisionReasonToTelemetrySource` (`XJy`, `:425294`) - `decisionReason` → `source` attribute
- `mapDecisionReasonToInternalReason` (`Mtd`, `:315764`) - the seven-reason `"other"` ladder at `:315790`
- `CAN_USE_TOOL_ABORTED_REASON` (`i7t`, `:58356`) - `"tool permission request aborted"`
- `attrString` (`fe`, `:141`) - typed attribute-string wrapper
