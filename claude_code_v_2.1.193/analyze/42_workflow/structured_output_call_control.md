# StructuredOutput Call-Control in `agent({schema})` (v2.1.183 → v2.1.193)

> Type: source-level logic delta in the Workflow per-agent runner + a new query-option enforcement path. Versions: bullet 1 = **2.1.187**, bullet 2 = **2.1.186**.
> TARGET: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`. Lines are **193** unless tagged *(183)*.
> CANONICAL runtime/VM context (unchanged): [`../../../claude_code_v_2.1.183/analyze/42_workflow/README.md`](../../../claude_code_v_2.1.183/analyze/42_workflow/README.md).

## TL;DR

Two changelog bullets patch the **same** function — the Workflow per-agent runner `wt` (`async function wt(tt,nt,Rt,$t)`, `cli_inner_pretty.js:423705`), the inner async routine that drives one `agent({schema})` subagent to completion. Both are NET-NEW logic against the 183 runner, which had **neither** guard:

1. **Stop re-calling StructuredOutput after success (2.1.187).** Once the runner has *captured* a `structured_output` attachment (`dt`), a 3rd+ StructuredOutput tool call aborts the agent with reason `"stalled"`; the catch handler recognizes `"stalled" && dt !== void 0` as a **success** and returns the already-captured output cleanly — instead of letting the model loop forever re-emitting StructuredOutput. In parallel, a brand-new `requiresStructuredOutput` query option drives an **inline, gated nudge** (`vbl`) that injects "You MUST call the StructuredOutput tool" *only until a call has succeeded*, then stops. This inline path **replaces** the 183 **Stop hook** (`zKn`) that re-fired every time the model tried to end its turn with no per-success dedup — the exact behavior this bullet fixes.

2. **Abort after 5 schema-validation failures (2.1.186).** A failure counter `Mr` increments for each StructuredOutput `tool_use` whose `tool_result` came back `is_error`; once `Mr >= kn` (`kn = MAX_STRUCTURED_OUTPUT_RETRIES ?? NYp`, `NYp = 5`) with no valid output captured, the runner throws a `DualError`. Caveat: the *cap concept* already existed for `--json-schema` **print mode** (CARRYOVER, byte-equivalent); what 2.1.186 ships is wiring that cap into the **in-process workflow loop**, which previously had none.

---

## Background: where StructuredOutput comes from

A workflow author writes `agent({ schema })`. The schema is compiled into a one-off tool by the factory `qVd` (`cli_inner_pretty.js:229472`): it Ajv-compiles the caller's JSON Schema and wraps a `call()` that *throws* on validation failure. The tool's name is the constant `Ep = "StructuredOutput"` (`:229498`); the base tool object `$Qr` (`:229509`) is a normal always-enabled tool object whose contract is explicit:

- metadata: `isMcp:false`, `isEnabled():true`, `isConcurrencySafe():true`, `isReadOnly():true`, `isOpenWorld():false`;
- model-facing strings: `searchHint:"return the final response as structured JSON"`, description `"Return structured output in the requested format"`, and the prompt `"Use this tool to return your final response in the requested structured format. You MUST call this tool exactly once at the end of your response to provide the structured output."`;
- size/schema/result contract: `maxResultSizeChars:1e5`, default `inputSchema` = `object().passthrough()`, `outputSchema` = string described as `"Structured output tool result"`, `call()` returns `{ data:"Structured output provided successfully", structured_output: input, endsTurn:true }`;
- permission/rendering: `checkPermissions()` always allows, `renderToolUseMessage()` displays an empty object as no message, up to three fields as `key: JSON.stringify(value)`, and larger objects as `N fields: first, second, third…`.

There is no model-capability gate in `$Qr` itself: `isEnabled()` is unconditional. The enforcement flag discussed below (`requiresStructuredOutput`) is a query/session option used to nudge the model until a successful tool result exists, not a `modelInfo.Capability.StructuredOutput` check at the tool-definition level.

The validation throw in `qVd` is the source of every `is_error` StructuredOutput `tool_result` that bullet 2 counts:

```javascript
// ============================================
// schemaToolFactory - compile a JSON Schema into the one-off StructuredOutput tool
// Location: cli_inner_pretty.js:229472-229490
// ============================================

// ORIGINAL (for source lookup):
function qVd(e) {
  try {
    let t = new XYi.Ajv({ allErrors: !0 });
    if (!t.validateSchema(e)) return { error: t.errorsText(t.errors) };
    let r = t.compile(e);
    return {
      tool: {
        ...$Qr,
        inputJSONSchema: e,
        async call(o) {
          if (!r(o)) {
            let i = r.errors?.map((l) => `${l.instancePath || "root"}: ${l.message}`).join(", "),
              a = r.errors?.map((l) => l.keyword).join(",");
            throw new Fi(`Output does not match required schema: ${i}`, `StructuredOutput schema mismatch: ${a ?? ""}`);
          }
          return { data: "Structured output provided successfully", structured_output: o, endsTurn: !0 };
        },
      },
    };
  } catch (t) { return { error: t instanceof Error ? t.message : String(t) }; }
}

// READABLE (for understanding):
function schemaToolFactory(jsonSchema) {
  try {
    let ajv = new Ajv({ allErrors: true });
    if (!ajv.validateSchema(jsonSchema)) return { error: ajv.errorsText(ajv.errors) }; // bad schema → no tool
    let validate = ajv.compile(jsonSchema);
    return {
      tool: {
        ...STRUCTURED_OUTPUT_BASE_TOOL,                  // $Qr — read-only, endsTurn, the "call once" prompt
        inputJSONSchema: jsonSchema,
        async call(input) {
          if (!validate(input)) {                        // validation FAILURE → throw a dual-message error
            let userMsg = validate.errors?.map(e => `${e.instancePath || "root"}: ${e.message}`).join(", "),
              keywords = validate.errors?.map(e => e.keyword).join(",");
            throw new DualError(`Output does not match required schema: ${userMsg}`,
                                `StructuredOutput schema mismatch: ${keywords ?? ""}`);  // → is_error tool_result
          }
          return { data: "Structured output provided successfully", structured_output: input, endsTurn: true };
        },
      },
    };
  } catch (e) { return { error: e instanceof Error ? e.message : String(e) }; }
}

// Mapping: qVd→schemaToolFactory, $Qr→STRUCTURED_OUTPUT_BASE_TOOL, Fi→DualError,
//          e→jsonSchema, r→validate, o→input
```

The base tool's display formatter is small but important for parity with the UI surface:

```javascript
// ============================================
// StructuredOutput base tool - compact tool-use display
// Location: cli_inner_pretty.js:229544-229548
// ============================================

// ORIGINAL (for source lookup):
renderToolUseMessage(e) {
  let t = Object.keys(e);
  if (t.length === 0) return null;
  if (t.length <= 3) return t.map((n) => `${n}: ${Le(e[n])}`).join(", ");
  return `${t.length} fields: ${t.slice(0, 3).join(", ")}\u2026`;
}

// READABLE (for understanding):
function renderStructuredOutputUse(input) {
  const keys = Object.keys(input);
  if (keys.length === 0) return null;
  if (keys.length <= 3) return keys.map((key) => `${key}: ${JSON.stringify(input[key])}`).join(", ");
  return `${keys.length} fields: ${keys.slice(0, 3).join(", ")}…`;
}

// Mapping: Le→JSON.stringify
```

`Fi` (`cli_inner_pretty.js:9055`, `class Fi extends Error`) is the dual-message error: a user-facing string plus an internal/telemetry string. It is reused by both the per-call schema throw above **and** the retry-cap throw in §2. This factory and `Ep`/`$Qr`/`Fi` are all **CARRYOVER** (the 183 names were `Em`/`Bl` etc.); they are shown only to anchor what "a failed StructuredOutput call" *is* for the new counting logic.

---

## 1. Bullet 1 — no infinite re-call after success; reliable follow-up [2.1.187]

This bullet is two NET-NEW mechanisms working together: a **runner-loop success guard** (1A) and the **`requiresStructuredOutput` inline enforcement** (1B) that replaces the 183 Stop hook.

### 1A. The success guard — stop the loop once a result is captured

**What it does.** Inside the runner's assistant-message handler, once a `structured_output` attachment has been captured into `dt`, a *third or later* StructuredOutput tool call aborts the agent with reason `"stalled"`. The catch handler then returns the captured `dt` as a clean success, so the model is never given the chance to keep re-emitting StructuredOutput indefinitely.

**How it works.**

```javascript
// ============================================
// workflowAgentRunner success guard - abort once a structured result is captured and the model keeps re-calling
// Location: cli_inner_pretty.js:423837-423842 (capture @423804)
// ============================================

// ORIGINAL (for source lookup):
//   @423804 (attachment branch): dt = Gn.attachment.data;
              for (let so of Gn.message.content) {
                if (so.type !== "tool_use") continue;
                if ((Mo++, cn.add(so.id), (wn = so.name), (rn = v8n(so.input) || void 0), so.name === Ep)) {
                  if ((sr++, (So = so.input), Ko.add(so.id), dt !== void 0 && sr > 2)) {
                    wr.abort("stalled");
                    break;
                  }
                }
              }

// READABLE (for understanding):
//   earlier, the attachment branch captured the result:  capturedStructuredOutput = block.attachment.data;
              for (let block of assistantMsg.message.content) {
                if (block.type !== "tool_use") continue;
                toolCallsThisTurn++;                                  // Mo
                inProgressToolUseIds.add(block.id);                  // cn
                lastToolName = block.name;                           // wn
                lastToolSummary = previewInput(block.input);         // rn / v8n
                if (block.name === STRUCTURED_OUTPUT_TOOL) {         // Ep === "StructuredOutput"
                  structuredOutputAttempts++;                        // sr
                  lastStructuredOutputInput = block.input;           // So
                  structuredOutputCallIds.add(block.id);             // Ko — tracked so §2 can match is_error results
                  if (capturedStructuredOutput !== undefined && structuredOutputAttempts > 2) {
                    abortController.abort("stalled");                // already have a result + extra re-calls → stop
                    break;
                  }
                }
              }

// Mapping: Gn→assistantMsg, so→block, Ep→STRUCTURED_OUTPUT_TOOL, Mo→toolCallsThisTurn, cn→inProgressToolUseIds,
//          sr→structuredOutputAttempts, So→lastStructuredOutputInput, Ko→structuredOutputCallIds,
//          dt→capturedStructuredOutput, wr→abortController, v8n→previewInput
```

The capture happens in the runner's attachment branch (`:423804`): `if (Gn.type === "attachment" && Gn.attachment.type === "structured_output") { dt = Gn.attachment.data; continue; }`. So `dt` is set the moment a StructuredOutput call *succeeds* and produces its attachment. The guard `dt !== void 0 && sr > 2` then says: *we already have a valid result, and the model has now issued more than two StructuredOutput calls in this agent — abort.* The `sr > 2` (not `> 1`) leaves a small slack so a single redundant re-call right after success does not trip the guard; only persistent re-calling does.

**The catch turns the "stalled" abort into a clean success.** The abort reason is `"stalled"`, but the catch handler special-cases the case where `dt` was captured and returns it as a *non-stalled* result:

```javascript
// ============================================
// workflowAgentRunner catch - "stalled" with a captured result is returned as success (not a stall)
// Location: cli_inner_pretty.js:423852-423875
// ============================================

// ORIGINAL (for source lookup):
      } catch (Gn) {
        let Mo = wr.signal.aborted ? zy(wr.signal.reason) : void 0;
        if (Mo === "stalled" || Mo === "user-retry") {
          if (Mo === "stalled" && dt !== void 0) {
            let so = Date.now() - rr;
            return (
              Ir("done", { tokens: qe + nn, toolCalls: ct + Sn, durationMs: Tt + so, resultPreview: u9e(dt) }),
              { structured: dt, text: "", tokens: nn, toolCalls: Sn, stalled: !1, skipped: !1, durationMs: so,
                stopReason: void 0, outputTokens: void 0, structuredOutputAttempts: sr, lastStructuredOutputInput: So });
          }
          // ... otherwise emit an "error"/stalled result that the outer kol-loop may retry ...

// READABLE (for understanding):
      } catch (err) {
        let reason = abortController.signal.aborted ? abortReason(abortController.signal.reason) : undefined;
        if (reason === "stalled" || reason === "user-retry") {
          if (reason === "stalled" && capturedStructuredOutput !== undefined) {
            let durationMs = Date.now() - startedAt;
            return (
              emitProgress("done", { /* tokens/toolCalls */, durationMs, resultPreview: preview(capturedStructuredOutput) }),
              { structured: capturedStructuredOutput, text: "", /* tokens */,
                stalled: false,    // ← NOT a stall: the outer retry loop will NOT re-run this agent
                skipped: false,
                structuredOutputAttempts, lastStructuredOutputInput });
          }
          // ... genuine stall (no captured output) → emit "error" so the outer stall loop may retry ...

// Mapping: Gn→err, wr→abortController, zy→abortReason, dt→capturedStructuredOutput, rr→startedAt,
//          sr→structuredOutputAttempts, So→lastStructuredOutputInput, Ir→emitProgress, u9e→preview
```

**Why this approach.**

- **Abort-then-recover instead of a per-turn guard.** The runner already aborts on `"stalled"` and `"user-retry"`; reusing the abort path (rather than adding a separate "stop the for-await loop" code path) means the existing catch is the single exit point. The clever part is the `stalled: false` in the returned object: the runner is wrapped by an outer **stall-retry loop** (`for (let Pt = 1; tt.stalled && !Rt && Pt <= kol; Pt++)`, `cli_inner_pretty.js:424020`, cap `kol = 5`). Returning `stalled: false` means a successful-but-aborted agent is **not** re-run by that loop — the captured output is final. Had the guard returned `stalled: true`, the agent would be relaunched, defeating the purpose.
- **Why `sr > 2` and not a hard "abort on the 2nd call".** A model can legitimately emit StructuredOutput once and immediately get its attachment; a single stray follow-up call is tolerated. Only sustained re-calling (the pathological loop the changelog calls out) crosses `sr > 2`.

**Key insight.** The fix is not "forbid re-calling"; it is "once we *have* the answer, any further StructuredOutput pressure is treated as a stall and short-circuited into the success we already hold." The success is delivered from `dt`, not from the (n-th) model call.

**183 before-picture.** The 183 runner's assistant handler only *counted* StructuredOutput calls — it had no `dt`-captured guard and no abort. The equivalent 183 line was `if (… wr.name === Em) (An++, (sr = wr.input));` (183 `:417279-417280`) — a bare counter, no `dt !== void 0 && sr > 2`, no `abort("stalled")`. So a 183 workflow agent that had already produced a valid structured result could keep being pushed to re-call it. NET-NEW.

### 1B. `requiresStructuredOutput` inline enforcement (replaces the 183 Stop-hook)

**What it does.** `requiresStructuredOutput` is a brand-new query option (`grep -c requiresStructuredOutput` = **0 in 183, 8 in 193**). When set, the per-turn message-prep generator `vbl` injects a single meta-message nudge — *"You MUST call the StructuredOutput tool to complete this request"* — but only **until a StructuredOutput call has succeeded**, and only once per un-answered window (deduped by a sentinel). This is the mechanism that makes "follow-up turns reliably return structured output" without the runaway pressure the old Stop hook caused.

**How it works.**

```javascript
// ============================================
// enforceStructuredOutputNudge - gated inline meta-message: nudge until a StructuredOutput call succeeds
// Location: cli_inner_pretty.js:465638-465659 (inside vbl @465576)
// ============================================

// ORIGINAL (for source lookup):
  if (s.options.requiresStructuredOutput && YP(i) !== "auxiliary")
    try {
      let y = Abl(e),
        b = e.slice(y + 1),
        _ = Ibl([...b, ...t], Ep),
        S = !_ && b.some((H) => H.type === "user" && H.isMeta && typeof H.message.content === "string" && H.message.content.includes(Hbl));
      if (!_ && !S)
        ((m = Pn({ content: `${Hbl} You MUST call the ${Ep} tool to complete this request. Call this tool now.`, isMeta: !0 })),
          yield m);
    } catch (y) { T(`StructuredOutput enforcement failed: ${Ae(y)}`, { level: "error" }); }

// READABLE (for understanding):
  if (session.options.requiresStructuredOutput && queryKind(i) !== "auxiliary") // skip the auxiliary/aux model path
    try {
      let lastUserIdx = findLastUserIndex(messages),                 // Abl
        sinceLastUser = messages.slice(lastUserIdx + 1),             // only the messages since the last user turn
        alreadySucceeded = structuredOutputSucceeded([...sinceLastUser, ...extra], STRUCTURED_OUTPUT_TOOL), // Ibl
        alreadyNudged = !alreadySucceeded &&                         // dedup: did we already inject the sentinel?
          sinceLastUser.some(msg => msg.type === "user" && msg.isMeta &&
            typeof msg.message.content === "string" && msg.message.content.includes(ENFORCE_SENTINEL)); // Hbl
      if (!alreadySucceeded && !alreadyNudged)
        yield (nudgeMsg = makeMeta({
          content: `${ENFORCE_SENTINEL} You MUST call the ${STRUCTURED_OUTPUT_TOOL} tool to complete this request. Call this tool now.`,
          isMeta: true,
        }));
    } catch (e) { log(`StructuredOutput enforcement failed: ${fmt(e)}`, { level: "error" }); }

// Mapping: vbl→messagePrepGenerator, s.options→session.options, YP→queryKind, Abl→findLastUserIndex,
//          Ibl→structuredOutputSucceeded, Ep→STRUCTURED_OUTPUT_TOOL, Hbl→ENFORCE_SENTINEL "[structured-output-enforce]",
//          Pn→makeMeta, T→log
```

The gate is the helper `Ibl` (`cli_inner_pretty.js:601998`), which decides *"has a StructuredOutput call already succeeded?"*:

```javascript
// ============================================
// structuredOutputSucceeded - did the latest StructuredOutput tool_use get a non-error tool_result?
// Location: cli_inner_pretty.js:601998-602021
// ============================================

// ORIGINAL (for source lookup):
function Ibl(e, t) {
  let n;
  for (let r = e.length - 1; r >= 0; r--) {
    let o = e[r];
    if (!o) continue;
    if (o.type === "assistant" && Array.isArray(o.message.content)) {
      let s = o.message.content.find((i) => i.type === "tool_use" && i.name === t);
      if (s) { n = s.id; break; }
    }
  }
  if (!n) return !1;
  for (let r = e.length - 1; r >= 0; r--) {
    let o = e[r];
    if (!o) continue;
    if (o.type === "user" && Array.isArray(o.message.content)) {
      let s = o.message.content.find((i) => i.type === "tool_result" && i.tool_use_id === n);
      if (s) return s.is_error !== !0;
    }
  }
  return !1;
}

// READABLE (for understanding):
function structuredOutputSucceeded(messages, toolName) {
  let latestCallId;
  // walk backwards to the most recent StructuredOutput tool_use, capture its id
  for (let i = messages.length - 1; i >= 0; i--) {
    let m = messages[i];
    if (!m) continue;
    if (m.type === "assistant" && Array.isArray(m.message.content)) {
      let call = m.message.content.find(b => b.type === "tool_use" && b.name === toolName);
      if (call) { latestCallId = call.id; break; }
    }
  }
  if (!latestCallId) return false;                       // never called → not succeeded
  // find that call's tool_result; success iff is_error !== true
  for (let i = messages.length - 1; i >= 0; i--) {
    let m = messages[i];
    if (!m) continue;
    if (m.type === "user" && Array.isArray(m.message.content)) {
      let result = m.message.content.find(b => b.type === "tool_result" && b.tool_use_id === latestCallId);
      if (result) return result.is_error !== true;       // ← the success gate
    }
  }
  return false;
}

// Mapping: Ibl→structuredOutputSucceeded, e→messages, t→toolName, n→latestCallId, s.is_error→result.is_error
```

So the enforcement loop is:

- **Before any success:** `alreadySucceeded === false`. The `[structured-output-enforce]` sentinel (`Hbl`, `cli_inner_pretty.js:465901`) dedups so the nudge is injected at most once per un-answered window — but it *is* injected on each new turn that still lacks a successful call. → "follow-up turns reliably return structured output."
- **After a success:** `Ibl` returns `true` → `alreadySucceeded === true` → **no nudge**. The model is not pressured to re-call. Combined with 1A's runner guard, the loop cannot be driven indefinitely.

**Why this approach — the real story is a Stop-hook → inline-gate refactor.** In **183** the identical text *"You MUST call the StructuredOutput tool to complete this request. Call this tool now."* existed (183 `:575802`) but was wired as a **Stop hook**:

```javascript
// ============================================
// (183 before-picture) zKn - registers the StructuredOutput nudge as a Stop hook
// Location: cli_inner_pretty.js:575795-575804 (183)
// ============================================

// ORIGINAL (183, for source lookup):
function zKn(e, t) {
  Pct(e, t, "Stop", "",
    (n) => Ojn(n, Em),
    `You MUST call the ${Em} tool to complete this request. Call this tool now.`,
    { timeout: 5000 });
}

// READABLE (for understanding):
function registerStructuredOutputStopHook(a, b) {
  registerHook(a, b, "Stop", "",
    (state) => hasNoStructuredOutput(state, STRUCTURED_OUTPUT_TOOL),   // Ojn — fire when the turn ends with no SO
    `You MUST call the ${STRUCTURED_OUTPUT_TOOL} tool to complete this request. Call this tool now.`,
    { timeout: 5000 });
}

// Mapping (183): zKn→registerStructuredOutputStopHook, Pct→registerHook, Ojn→hasNoStructuredOutput, Em→STRUCTURED_OUTPUT_TOOL
```

A **Stop hook** re-fires *every time* the model tries to end the turn without having called StructuredOutput. It has no "already succeeded" dedup at the *option* level and no `[structured-output-enforce]` sentinel — which is exactly the runaway-pressure failure mode bullet 1 fixes. 193 deletes that registration entirely (the Stop-hook variant of the text is **gone**: in 193 the string appears *only* at the inline `vbl` injection `:465651`, never as a hook) and replaces it with the gated inline `vbl` injection keyed on `Ibl`'s success-check + the `Hbl` sentinel.

So bullet 1B is a **refactor + behavior fix**, not a brand-new concept — but the *option* (`requiresStructuredOutput`), the *success helper* (`Ibl`), and the *sentinel* (`Hbl`) are all net-new tokens (all grep=0 in 183).

**Corroborating wording change.** The "subagent completed without calling StructuredOutput" error now reads *"(after in-conversation nudge)"* (singular, `cli_inner_pretty.js:424073`) where 183 read *"(after 2 in-conversation nudges)"* (183 `:417509`). Collapsing "2 nudges" → "nudge" is consistent with replacing the multi-fire Stop hook with the single gated inline nudge.

**Where `requiresStructuredOutput` is threaded (all net-new wiring).** The option is set true wherever a StructuredOutput-returning query is launched, and consumed only by `vbl`:

- Workflow `agent({schema})`: `requiresStructuredOutput: ge !== void 0` (`:423795`, `ge` is the caller's schema) — set inside the runner's `m4(...)` spawn.
- The subagent query generator `m4` (`async function* m4`, `:398565`) takes a `requiresStructuredOutput: W` param (`:398601`) and forwards it into the child query options (`:398758`).
- Print/SDK `--json-schema`: `requiresStructuredOutput: v !== void 0 && pe` (`:703037`, `:703275`), where `v` is the parsed JSON schema.
- Main loop when the StructuredOutput tool is present: `requiresStructuredOutput: ho.some((Yo) => lc(Yo, Ep))` (`:689033`).
- A forced sub-path: `requiresStructuredOutput: !0` (`:587869`).

---

## 2. Bullet 2 — `agent({schema})` aborts after 5 schema-validation failures [2.1.186]

**What it does.** When a workflow `agent({schema})` keeps producing StructuredOutput that fails schema validation, the runner now aborts after **5** failed attempts (configurable via `MAX_STRUCTURED_OUTPUT_RETRIES`, default `NYp = 5`) by throwing a `DualError`, instead of looping forever.

**How it works.** The runner declares the cap up front, counts failed StructuredOutput `tool_result`s in its user-message handler, and throws when the count reaches the cap with no valid output captured:

```javascript
// ============================================
// workflowAgentRunner retry cap - count failed StructuredOutput tool_results, abort at 5
// Location: cli_inner_pretty.js:423782 (cap), 423814-423826 (count + throw)
// ============================================

// ORIGINAL (for source lookup):
        kn = Be.MAX_STRUCTURED_OUTPUT_RETRIES ?? NYp,           // NYp = 5
// ... user-message branch:
            if (Gn.type === "user") {
              let Mo = Gn.message.content;
              if (Array.isArray(Mo)) {
                for (let so of Mo)
                  if (typeof so === "object" && so?.type === "tool_result") {
                    if ((cn.delete(so.tool_use_id), Ko.delete(so.tool_use_id) && so.is_error)) Mr++;
                  }
                if ((Ke(), Mr > 0 && Mr >= kn && dt === void 0))
                  throw new Fi(
                    `agent({schema}): StructuredOutput retry cap (${kn}) exceeded — ` +
                      `${Mr} failed ${bn(Mr, "call")} with no valid output`,
                    "Workflow agent({schema}) StructuredOutput retry cap exceeded",
                  );
              }
              continue;
            }

// READABLE (for understanding):
        retryCap = envConfig.MAX_STRUCTURED_OUTPUT_RETRIES ?? DEFAULT_SO_RETRIES,   // 5
// ... user-message branch:
            if (msg.type === "user") {
              let content = msg.message.content;
              if (Array.isArray(content)) {
                for (let block of content)
                  if (typeof block === "object" && block?.type === "tool_result") {
                    inProgressToolUseIds.delete(block.tool_use_id);                 // cn
                    // delete returns true iff this was a tracked StructuredOutput call id; AND it errored
                    if (structuredOutputCallIds.delete(block.tool_use_id) && block.is_error)
                      failedStructuredOutputCalls++;                                // Mr
                  }
                resetStallTimerIfIdle();                                            // Ke
                if (failedStructuredOutputCalls >= retryCap && capturedStructuredOutput === undefined)
                  throw new DualError(
                    `agent({schema}): StructuredOutput retry cap (${retryCap}) exceeded — ` +
                      `${failedStructuredOutputCalls} failed call(s) with no valid output`,
                    "Workflow agent({schema}) StructuredOutput retry cap exceeded");
              }
              continue;
            }

// Mapping: kn→retryCap, Be→envConfig, NYp→DEFAULT_SO_RETRIES(5), Mr→failedStructuredOutputCalls,
//          Ko→structuredOutputCallIds, cn→inProgressToolUseIds, dt→capturedStructuredOutput, Fi→DualError, bn→pluralize
```

The counting is precise: `Ko` (`structuredOutputCallIds`) was populated in 1A whenever the model issued a StructuredOutput `tool_use` (`Ko.add(so.id)`). Here, `Ko.delete(so.tool_use_id)` returns `true` *only* if this `tool_result` answers one of those tracked StructuredOutput calls; combined with `&& so.is_error`, `Mr` increments **only for failed StructuredOutput results** — not for ordinary tool errors and not for successful StructuredOutput calls. A failed attempt is therefore exactly "a StructuredOutput call whose `tool_result` came back `is_error`", which is precisely what the schema throw in `qVd` (§Background, `:229485`) produces.

The cap is `Be.MAX_STRUCTURED_OUTPUT_RETRIES ?? NYp` with `NYp = 5` (`cli_inner_pretty.js:424307`). The guard `dt === void 0` ensures the abort never fires once a valid result exists — failures only matter while there is *no* good output. The throw uses `Fi` (the dual-message `DualError`): the user-facing message names the cap and count; the second string `"Workflow agent({schema}) StructuredOutput retry cap exceeded"` is the internal/telemetry label.

**Why this approach.**

- **Count results, not requests.** The counter lives in the *user*-message handler (where `tool_result`s arrive), not the assistant handler (where `tool_use`s are emitted), so it counts *confirmed* failures (results that came back `is_error`) rather than optimistically counting attempts that might still succeed. This is why `Ko` is a set threaded across both handlers: the assistant side records "a StructuredOutput call is in flight"; the user side resolves it as success/failure.
- **A hard literal `5`, env-overridable.** `NYp = 5` mirrors the print-mode default (`MAX_STRUCTURED_OUTPUT_RETRIES || "5"`), so both StructuredOutput surfaces honor the same knob and the same default — a single mental model for operators.
- **Throw, not silent skip.** A `DualError` surfaces as a real workflow error (the workflow agent failed), which is the correct semantics: an `agent({schema})` that cannot produce schema-valid output 5× in a row has genuinely failed, and silently returning empty would corrupt downstream pipeline steps that expect the structured value.

**Key insight — distinguish the two "5"s.** The runner has *two* independent caps, both `= 5`, declared adjacently (`kol = 5`, `NYp = 5`, `:424306-424307`) and easy to conflate:
- `NYp` (this bullet) — **per-call schema-validation failures** within a single agent run; reaching it **throws**.
- `kol` — the outer **stall-retry** cap: how many times the *whole agent* `wt` is relaunched when it returns `stalled: true` (`for (… Pt <= kol; Pt++)`, `:424020`). Note 1A's success path returns `stalled: false`, so a captured-output abort does **not** consume a `kol` retry.

### Adversarial nuance — the cap is NOT new for print mode (CARRYOVER)

The SDK/print-mode `--json-schema` StructuredOutput retry cap **already existed in 183 and is byte-equivalent in 193** — it is not a 193 delta. `error_max_structured_output_retries` appears **5× in both** bundles, and the print-mode block is the same logic, only re-mangled:

```javascript
// ============================================
// printModeRetryCap (CARRYOVER) - SDK --json-schema 5-retry cap; byte-equivalent to 183
// Location: cli_inner_pretty.js:704023-704054 (193)  |  685293-685320 (183)
// ============================================

// ORIGINAL (193, for source lookup):
        if (vt.type === "user" && v) {
          let Cr = Mjo(this.mutableMessages, Ep) + me - dt,
            Ti = parseInt(process.env.MAX_STRUCTURED_OUTPUT_RETRIES || "5", 10);
          if (Cr >= Ti && wr.length === 0) {
            // ... yield { type: "result", subtype: "error_max_structured_output_retries", ... }

// ORIGINAL (183, for comparison):
//   en = parseInt(process.env.MAX_STRUCTURED_OUTPUT_RETRIES || "5", 10);
//   if (_n >= en && Yt.length === 0) { ... subtype: "error_max_structured_output_retries" ... }   (183 :685295)

// READABLE (for understanding):
        if (msg.type === "user" && hasSchema) {
          let failures = countFailedStructuredOutput(this.mutableMessages, STRUCTURED_OUTPUT_TOOL) + retracted - dropped, // Mjo
            cap = parseInt(process.env.MAX_STRUCTURED_OUTPUT_RETRIES || "5", 10);
          if (failures >= cap && pendingToolUses.length === 0)
            // emit the SDK error result subtype "error_max_structured_output_retries"

// Mapping: Mjo→countFailedStructuredOutput, Ep→STRUCTURED_OUTPUT_TOOL, Cr→failures, Ti→cap, wr→pendingToolUses
//          (183: Y0o→Mjo, Em→Ep, _n→Cr, en→Ti, Yt→wr — re-mangle only)
```

So the "5-attempt cap" was already enforced for `--json-schema` print mode in 183. **What bullet 2 actually ships is applying that same cap to in-process workflow `agent({schema})` subagents** — which previously had *no* counter, *no* cap, and *no* abort (the 183 runner's user handler only did `Te.delete(wr.tool_use_id)` with no `is_error` accounting, 183 `:417266-417272`). Both paths default to `5` and honor `MAX_STRUCTURED_OUTPUT_RETRIES`.

---

## Evidence note (NET-NEW vs CARRYOVER)

| Item | 193 | 183 | Verdict |
|------|-----|-----|---------|
| `requiresStructuredOutput` occurrences | 8 | 0 | NET-NEW (2.1.187) |
| `[structured-output-enforce]` sentinel (`Hbl`) | 1 (`:465901`) | 0 | NET-NEW |
| `structuredOutputSucceeded` (`Ibl`) success helper | present (`:601998`) | absent | NET-NEW |
| Stop-hook registration of the SO nudge text | absent (text only inline `:465651`) | present (`zKn` `:575795`) | REMOVED/refactored in 193 |
| "after … in-conversation nudge(s)" wording | "nudge" (`:424073`) | "2 … nudges" (`:417509`) | REFINEMENT (corroborates the collapse) |
| `"StructuredOutput retry cap"` string | 2 (`:423823/:423825`) | 0 | NET-NEW (2.1.186) |
| runner failure counter `Mr` + `is_error` accounting | present (`:423819`) | absent (`:417266-417272`) | NET-NEW |
| `NYp = 5` workflow SO retry cap | present (`:424307`) | absent in loop | NET-NEW |
| print-mode `error_max_structured_output_retries` cap | 5× (`:704023+`) | 5× (`:685293+`) | CARRYOVER (byte-equiv) |
| `Ep`/`$Qr`/`qVd`/`Fi` StructuredOutput core | present | present (re-mangled) | CARRYOVER |

(Counts above are `grep -c` over each whole bundle; line citations are 193 unless tagged 183.)

## Cross-links

- Sibling 193 doc: [`workflows_detail_status_filter.md`](./workflows_detail_status_filter.md) (bullet 3, `/workflows` UI).
- Module overview: [`README.md`](./README.md).
- The workflow-agent `depth: K3(pe)+1` (`:423707`) stamped inside this same `wt` runner feeds the shared subagent depth cap: [`../36_background_agents/subagent_depth_tracking.md`](../36_background_agents/subagent_depth_tracking.md).
- 183 canonical runtime/VM (unchanged sandbox + builtins + `agent()` contract): [`../../../claude_code_v_2.1.183/analyze/42_workflow/README.md`](../../../claude_code_v_2.1.183/analyze/42_workflow/README.md).

## Related Symbols

> Symbol mappings live in the central index files, never in this doc:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (Agent Loop, Tools, Subagent)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (**Workflow** is indexed here)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
> - per-feature additions: [symbol_additions_v2_1_193_workflow.md](../00_overview/symbol_additions_v2_1_193_workflow.md)

Key functions/constants in this document:

- `STRUCTURED_OUTPUT_TOOL` (`Ep`, `:229498`) — the `"StructuredOutput"` tool-name constant; sibling tool object `$Qr` (`:229509`), factory `qVd` (`:229472`).
- `DualError` (`Fi`, `:9055`) — `class Fi extends Error`; dual user/internal message; used by the schema throw (`:229485`) and the retry-cap throw (`:423823`).
- `workflowAgentRunner` (`wt`, `:423705`) — `async function wt(tt,nt,Rt,$t)`; hosts the success guard (`:423840`), the failure cap (`:423819`), and the `m4(... requiresStructuredOutput: ge !== void 0 ...)` spawn (`:423795`).
- `requiresStructuredOutput` (query option; `:398601`, `:423795`, `:465638`, `:587869`, `:689033`, `:703037`, `:703275`) — force-StructuredOutput flag (NET-NEW; 0 in 183).
- `subagentQueryGenerator` (`m4`, `:398565`) — `async function* m4`; param `requiresStructuredOutput: W` (`:398601`), forwarded to child options (`:398758`).
- `messagePrepGenerator` (`vbl`, `:465576`) — per-turn generator; inline enforcement block at `:465638`.
- `structuredOutputSucceeded` (`Ibl`, `:601998`) — returns `true` once the latest StructuredOutput `tool_use` has a non-error `tool_result`.
- `ENFORCE_SENTINEL` (`Hbl`, `:465901`) — `"[structured-output-enforce]"`; nudge dedup marker (NET-NEW; 0 in 183).
- `findLastUserIndex` (`Abl`, `:465479`) — last user-message index, used to scope the nudge dedup window.
- `DEFAULT_SO_RETRIES` (`NYp`, `:424307`) — `5`; workflow `agent({schema})` schema-failure cap. Distinct from `kol` (`:424306`), the stall-retry cap (also `5`).
- 183 before-picture: `zKn` Stop-hook registrar (183 `:575795`); runner counter-only line (183 `:417279`); print-mode cap (183 `:685295`, CARRYOVER).
