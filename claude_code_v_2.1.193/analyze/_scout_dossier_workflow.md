# Scout Dossier — Workflow / Structured Output (v2.1.183 → v2.1.193)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, VERSION "2.1.193", build a1938d2a)
**Before bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
**Module:** EXTENDS existing `42_workflow/` (present in 183 tree, incl. `reconstructed_source/`).
**Scope:** 3 changelog bullets covering StructuredOutput call-control in `--json-schema` print mode + workflow `agent({schema})` subagents, and a `/workflows` detail-view status filter.

---

## TL;DR verdict

| Bullet | Tag | Verdict | Confidence |
|--------|-----|---------|------------|
| 1. No infinite StructuredOutput re-call after success; reliable follow-up | 2.1.187 | **NET-NEW** (two mechanisms: workflow-loop success guard + `requiresStructuredOutput` inline enforcement that REPLACES the old Stop-hook) | HIGH |
| 2. Abort workflow `agent({schema})` after 5 schema-validation failures | 2.1.186 | **NET-NEW wiring** of an existing cap concept into the workflow loop (the print-mode cap itself is carryover) | HIGH |
| 3. Status filter (`f`) in `/workflows` detail view | 2.1.186 | **NET-NEW filter** on a CARRYOVER detail component | HIGH |
| Workflow runtime / VM spine | — | **CARRYOVER** (agent runner is the same function with surgical insertions; builtins + sandbox unchanged) | HIGH |

---

## Key obfuscated symbols (re-derived in the 193 bundle)

> Symbol mappings live in the index files; add to `symbol_index_core_features.md` (Workflow section).

- `Ep` (`cli_inner_pretty.js:229498`) = `"StructuredOutput"` tool-name constant. (183: `Em` @221489.)
- `$Qr` (`229509`) = the StructuredOutput tool object (`isReadOnly`, `endsTurn:!0`, prompt "You MUST call this tool exactly once…").
- `qVd` (`229472`) = schema→tool factory: compiles the caller JSON Schema with Ajv and wraps a `call()` that throws on validation failure.
- `Fi` (`9055`, `class Fi extends Error`) = dual-message error (user-facing + internal/telemetry). Used by schema-mismatch throw (`229485`) and the retry-cap throw (`423822`).
- `m4` (`398565`, `async function* m4({…})`) = subagent query generator; now accepts `requiresStructuredOutput: W` (`398601`).
- `vbl` (`465576`, `async function* vbl(…)`) = per-turn message-prep generator that injects the inline StructuredOutput enforcement meta-message (`465638`).
- `Ibl` (`601998`) = "did the last StructuredOutput call SUCCEED?" helper (returns `s.is_error !== true`).
- `Hbl` (`465901`) = sentinel string `"[structured-output-enforce]"` (dedup marker for the injected nudge).
- `NYp` (`424307`) = `5` — default `MAX_STRUCTURED_OUTPUT_RETRIES` for the workflow loop.
- `kol` (`424307`/`424020`) = `5` — SEPARATE stall-retry cap (do not conflate with `NYp`).
- workflow per-agent runner = the inner `wt(Ne, label, attempt, reason)` function (called `423982`, `424043`); its body spans `~423760–423980`.
- `/workflows` detail component (anonymous, module init `jer` @543251): filter state `[P,O]=useState("all")` (`542947`), cycle array `eYt` (`543272`), label map `XOo` (`543273`), cycle fn `pe()` (`543007`), status-derive `D$e(agent,running)`.

---

## Bullet 1 — No infinite re-call after a successful StructuredOutput; follow-up turns reliably return structured output  [2.1.187]

**Verdict: NET-NEW, HIGH.** Implemented by TWO cooperating net-new mechanisms.

### 1A. Workflow-loop "success guard" (`dt !== void 0 && sr > 2` → abort)

In the per-agent runner, the assistant-message handler now guards StructuredOutput re-calls:

```javascript
// ============================================
// Workflow agent runner — StructuredOutput success guard
// Location: cli_inner_pretty.js:423836-423845
// ============================================

// ORIGINAL (for source lookup):
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
for (let block of assistantMsg.message.content) {
  if (block.type !== "tool_use") continue;
  toolCallsThisTurn++; inProgressIds.add(block.id);
  lastToolName = block.name; lastToolInputPreview = truncate(block.input);
  if (block.name === STRUCTURED_OUTPUT_TOOL) {            // "StructuredOutput"
    structuredOutputAttempts++;                           // sr
    lastStructuredOutputInput = block.input;              // So
    structuredOutputCallIds.add(block.id);                // Ko
    if (capturedStructuredOutput !== undefined && structuredOutputAttempts > 2) {
      abortController.abort("stalled");                   // already have a result → stop looping
      break;
    }
  }
}

// Mapping: Gn→assistantMsg, so→block, Ep→STRUCTURED_OUTPUT_TOOL, sr→structuredOutputAttempts,
//          dt→capturedStructuredOutput, So→lastStructuredOutputInput, Ko→structuredOutputCallIds, wr→abortController
```

- `dt` (capturedStructuredOutput) is set from the `structured_output` attachment at `423803-423805`.
- When `dt` is already captured AND the model issues a 3rd+ StructuredOutput call, the runner aborts `"stalled"`.
- The catch handler at `423854-423872` treats `"stalled" && dt !== undefined` as **success** — it returns `{ structured: dt, stalled:false, skipped:false }`. So the already-captured output is returned cleanly instead of letting the model loop forever.
- **183 diff:** the 183 runner (`417274-417285`) had `if (… wr.name === Em) (An++, (sr = wr.input));` — it ONLY counted attempts. No `dt !== void 0 && sr > 2` guard, no abort. Net-new.

### 1B. `requiresStructuredOutput` inline enforcement (REPLACES the 183 Stop-hook)

`requiresStructuredOutput` is a brand-new query option: **`grep -c` = 0 in 183, 8 in 193.** It threads from spawn sites into `s.options` and is consumed by the per-turn message generator `vbl`:

```javascript
// ============================================
// vbl — inline StructuredOutput enforcement nudge (per turn)
// Location: cli_inner_pretty.js:465638-465657
// ============================================

// ORIGINAL (for source lookup):
if (s.options.requiresStructuredOutput && YP(i) !== "auxiliary")
  try {
    let y = Abl(e), b = e.slice(y + 1),
        _ = Ibl([...b, ...t], Ep),
        S = !_ && b.some((H) => H.type === "user" && H.isMeta && typeof H.message.content === "string" && H.message.content.includes(Hbl));
    if (!_ && !S)
      ((m = Pn({ content: `${Hbl} You MUST call the ${Ep} tool to complete this request. Call this tool now.`, isMeta: !0 })), yield m);
  } catch (y) { T(`StructuredOutput enforcement failed: ${Ae(y)}`, { level: "error" }); }

// READABLE (for understanding):
if (session.options.requiresStructuredOutput && queryKind(i) !== "auxiliary")
  try {
    let lastUserIdx = findLastUserIndex(messages),
        recent = messages.slice(lastUserIdx + 1),
        alreadySucceeded = structuredOutputSucceeded([...recent, ...extra], STRUCTURED_OUTPUT_TOOL),  // Ibl
        alreadyNudged = !alreadySucceeded && recent.some(isEnforceSentinelMeta);                      // Hbl marker
    if (!alreadySucceeded && !alreadyNudged)
      yield (enforceMsg = makeMeta(`${ENFORCE_SENTINEL} You MUST call the ${STRUCTURED_OUTPUT_TOOL} tool to complete this request. Call this tool now.`));
  } catch (e) { log(`StructuredOutput enforcement failed: ${fmt(e)}`); }

// Mapping: Ibl→structuredOutputSucceeded, Hbl→ENFORCE_SENTINEL "[structured-output-enforce]",
//          Ep→STRUCTURED_OUTPUT_TOOL, Abl→findLastUserIndex, Pn→makeMeta
```

`Ibl` (`601998`) is the dedup gate: it walks messages backwards, finds the latest StructuredOutput `tool_use`, and returns `is_error !== true` for its `tool_result` — i.e. **true once a StructuredOutput call has SUCCEEDED.** Effect:
- Before success: the nudge is injected each turn → "follow-up turns reliably return structured output."
- After success: `alreadySucceeded === true` → no further nudge → the model is not pushed to re-call. The sentinel `[structured-output-enforce]` (`Hbl`, `465901`) prevents double-injecting within the same un-answered window.

**183 architecture diff (the real story):** In 183 the same "You MUST call the StructuredOutput tool to complete this request" text existed (`575802`) but was wired as a **Stop hook**: `zKn` (`575795`) registers via `Pct(e, t, "Stop", "", (n) => Ojn(n, Em), <text>, {timeout:5000})`. A Stop hook re-fires whenever the model tries to end the turn without a StructuredOutput, with no "already succeeded" dedup at the option level — which is exactly the failure mode this bullet fixes (it could keep pressuring re-calls). 193 moves enforcement to the gated inline `vbl` injection with the `Ibl` success-check + `Hbl` sentinel. So bullet 1B is a **refactor + behavior fix**, not a brand-new concept — but the option, helper, and sentinel are all net-new tokens.

**Where `requiresStructuredOutput` is set (all net-new):**
- Workflow `agent({schema})`: `requiresStructuredOutput: ge !== void 0` (`423795`, where `ge` is the schema).
- `m4` generator param `W` → child query options `requiresStructuredOutput: W` (`398601` → `398758`).
- Print/SDK `--json-schema` paths: `requiresStructuredOutput: v !== void 0 && pe` (`703037`, `703275`) — `v` is the parsed JSON schema.
- Main loop when StructuredOutput tool present: `requiresStructuredOutput: ho.some((Yo) => lc(Yo, Ep))` (`689033`).
- A forced sub-path: `requiresStructuredOutput: !0` (`587869`).

**Nudge-wording body change (corroboration):** the "subagent completed without calling StructuredOutput" error now reads `"(after in-conversation nudge)"` (`424073`) vs 183's `"(after 2 in-conversation nudges)"` (`417509`) — consistent with collapsing the old 2-nudge Stop-hook scheme into the single gated inline nudge.

---

## Bullet 2 — Workflow `agent({schema})` aborts after 5 schema-validation failures  [2.1.186]

**Verdict: NET-NEW wiring into the workflow loop; the cap concept itself is carryover from print mode. HIGH.**

### The net-new workflow-loop cap

```javascript
// ============================================
// Workflow agent runner — schema-failure retry cap
// Location: cli_inner_pretty.js:423782 (cap), 423814-423826 (count + abort)
// ============================================

// ORIGINAL (for source lookup):
kn = Be.MAX_STRUCTURED_OUTPUT_RETRIES ?? NYp,          // NYp = 5
...
if (Gn.type === "user") {
  let Mo = Gn.message.content;
  if (Array.isArray(Mo)) {
    for (let so of Mo)
      if (typeof so === "object" && so?.type === "tool_result")
        if ((cn.delete(so.tool_use_id), Ko.delete(so.tool_use_id) && so.is_error)) Mr++;
    if ((Ke(), Mr > 0 && Mr >= kn && dt === void 0))
      throw new Fi(
        `agent({schema}): StructuredOutput retry cap (${kn}) exceeded — ` +
          `${Mr} failed ${bn(Mr, "call")} with no valid output`,
        "Workflow agent({schema}) StructuredOutput retry cap exceeded");
  }
  continue;
}

// READABLE (for understanding):
const retryCap = envConfig.MAX_STRUCTURED_OUTPUT_RETRIES ?? DEFAULT_SO_RETRIES;   // 5
...
if (msg.type === "user" && Array.isArray(msg.message.content)) {
  for (const block of msg.message.content)
    if (block?.type === "tool_result") {
      inProgressIds.delete(block.tool_use_id);
      if (structuredOutputCallIds.delete(block.tool_use_id) && block.is_error)
        failedStructuredOutputCalls++;                 // Mr — only counts is_error results for SO calls
    }
  if (failedStructuredOutputCalls >= retryCap && capturedStructuredOutput === undefined)
    throw new DualError(`agent({schema}): StructuredOutput retry cap (${retryCap}) exceeded — ` +
                        `${failedStructuredOutputCalls} failed call(s) with no valid output`,
                        "Workflow agent({schema}) StructuredOutput retry cap exceeded");
}

// Mapping: kn→retryCap, NYp→DEFAULT_SO_RETRIES(5), Mr→failedStructuredOutputCalls,
//          Ko→structuredOutputCallIds, dt→capturedStructuredOutput, Fi→DualError, Be→envConfig
```

- A failed attempt = a StructuredOutput `tool_use` whose `tool_result` came back `is_error` (the schema-mismatch throw at `229485` produces exactly these error results via `qVd`/`$Qr`).
- Cap = `Be.MAX_STRUCTURED_OUTPUT_RETRIES ?? NYp` with `NYp = 5` (`424307`). So **5 failed schema validations with no valid output ⇒ abort.**
- **183 diff:** the 183 workflow runner's user-message handler (`417266-417272`) only did `Te.delete(wr.tool_use_id)` — NO `is_error` counter, NO cap, NO abort. The strings `"retry cap exceeded"`, `requiresStructuredOutput`, and the failure counter are all `grep -c` = 0 in 183. Net-new.

### Adversarial nuance — the cap is NOT brand new for print mode

The SDK/print-mode StructuredOutput retry cap is **CARRYOVER, NOT a 193 delta.** `error_max_structured_output_retries` appears **5× in both** 183 and 193, and the print-mode block is byte-equivalent:
- 183: `685293-685320` — `en = parseInt(process.env.MAX_STRUCTURED_OUTPUT_RETRIES || "5", 10); if (_n >= en && Yt.length === 0) … subtype:"error_max_structured_output_retries"`.
- 193: `704023-704054` — same logic, re-mangled (`Ti`, `Cr`, `Mjo`, `Ep`).

So the "5-attempt cap" already existed for `--json-schema` print mode in 183. **What bullet 2 actually ships is applying that cap to in-process workflow `agent({schema})` subagents** (which previously had none and could loop forever on repeated validation failures). Both paths default to 5 and honor the same `MAX_STRUCTURED_OUTPUT_RETRIES` knob.

---

## Bullet 3 — Status filter (press `f`) in `/workflows` detail view  [2.1.186]

**Verdict: NET-NEW filter on a CARRYOVER detail component. HIGH.**

The detail component existed in 183 (`~532060-532145`): identical `j`/`k`/`x`/`p`/`s` key handlers, identical footer hints (`select · x stop · r restart · p pause · esc back · s save`), and the same status-label map (`done:"Completed"`, `interrupted:"Stopped"` @`532279-532282`). 193 adds a status filter on top:

```javascript
// ============================================
// /workflows detail — status filter state + cycle + key handler
// Location: cli_inner_pretty.js:542947 (state), 543007 (cycle), 543081 (key), 543128 (hint)
// ============================================

// ORIGINAL (for source lookup):
[P, O] = sP.useState("all"),
F = sP.useMemo(() => {
  if (!M || P === "all" || S === "phases") return M;
  return { ...M, agents: M.agents.filter((Ke) => D$e(Ke, U) === P) };
}, [M, P, S, U]),
...
function pe() {
  if (!M || v) return;
  let Ke = new Set(M.agents.map((Dt) => D$e(Dt, U)));
  (O((Dt) => { let Qt = eYt.indexOf(Dt);
    for (let Xn = 0; Xn < eYt.length; Xn++) { Qt = (Qt + 1) % eYt.length; let dt = eYt[Qt];
      if (dt === "all" || Ke.has(dt)) break; }
    return eYt[Qt]; }), _(0), te());
}
...
else if (Ke.key === "f" && S === "agents") (Ke.preventDefault(), pe());
...
if (S === "agents" && nt) _t.push(rt ? `f filter: ${rt}` : "f filter");
// eYt = ["all","running","queued","failed","done","skipped","interrupted"]   (543272)

// READABLE (for understanding):
const [statusFilter, setStatusFilter] = useState("all");                       // P / O
const filtered = useMemo(() => {
  if (!model || statusFilter === "all" || view === "phases") return model;
  return { ...model, agents: model.agents.filter(a => agentStatus(a, isRunning) === statusFilter) };
}, [model, statusFilter, view, isRunning]);
function cycleStatusFilter() {                                                  // pe
  if (!model || transcriptOpen) return;
  const present = new Set(model.agents.map(a => agentStatus(a, isRunning)));
  setStatusFilter(prev => {                                                     // skip statuses with no agents
    let idx = FILTER_ORDER.indexOf(prev);
    for (let n = 0; n < FILTER_ORDER.length; n++) { idx = (idx + 1) % FILTER_ORDER.length;
      const next = FILTER_ORDER[idx]; if (next === "all" || present.has(next)) break; }
    return FILTER_ORDER[idx];
  });
  setScroll(0); resetSelection();
}
// key handler: if (key==="f" && view==="agents") cycleStatusFilter();
// footer hint:  view==="agents" → "f filter: <status>" | "f filter"

// Mapping: P→statusFilter, O→setStatusFilter, F→filtered, M→model, pe→cycleStatusFilter,
//          eYt→FILTER_ORDER, D$e→agentStatus, XOo→STATUS_LABELS, S→view
```

Design note: `pe()` cycles through `eYt` but **skips statuses no agent currently has** (`present.has(next)`), always allowing `"all"` — so `f` only stops on meaningful filters. The footer reflects the active filter via `XOo[P].toLowerCase()` (`543117`, `543128`).

**183 diff (all net-new):** `grep -c` in 183 = 0 for the cycle array `["all","running","queued",…]`, for `key === "f" && S === "agents"`, and for the `"f filter"` hint. `useState("all")` and `agents.filter` each gain exactly one new occurrence (183→193: 1→2 and 3→4). The 183 key handler (`532080-532096`) has `j/k/x/p/s` but **no `f`**. Confirmed net-new filter, carryover host component.

---

## Runtime / VM spine — CARRYOVER (confirmed)

The note asked to confirm the workflow runtime/VM spine is unchanged. It is:
- **Agent runner is the same function** with surgical insertions. The 193 runner loop (`423785-423850`) is line-for-line the 183 runner (`417238-417286`) — same `for await (let … of m4/wj({agentDefinition, promptMessages, toolUseContext, canUseTool, availableTools, transcriptSubdir, spawnedByWorkflowRunId, …}))`, same attachment/`set_in_progress_tool_use_ids`/`user`/`assistant` branch structure, same return-shape objects (`structuredOutputAttempts`, `lastStructuredOutputInput`). Only the guard (1A), enforcement flag (1B), and cap (bullet 2) are inserted.
- **`agent()` builtin doc string is byte-identical** between 193 (`425071`) and 183 (`418215`) except the re-mangled isolation tokens (`jYp`/`GYp` vs `aLp`/`lLp`). Same `opts {label,phase,schema,model,effort,isolation,agentType}` contract.
- **Builtins + sandbox unchanged**: `pipeline(`/`parallel(`/`phase(` counts ~60 (193) vs ~59 (183); `createContext`/`runInContext` present in both. `WORKFLOW_TOOL_NAME = "Workflow"` (`229559`). No structural change to the VM.

Conclusion: these three bullets are **small deltas ON TOP** of an unchanged workflow VM/runtime spine.

---

## Anchor table (quick reference)

| Bullet | 193 anchor | Obf symbol | Readable gloss | 183-diff | Confidence |
|--------|-----------|-----------|----------------|----------|------------|
| 1A success guard | `423840` | `dt !== void 0 && sr > 2 → wr.abort("stalled")` | stop re-calling SO after a captured result | absent (183 `417279-417280` only counts) | high |
| 1A return-as-success | `423854-423872` | catch `"stalled" && dt!==undefined` → `{structured:dt}` | already-captured output returned cleanly | absent | high |
| 1B option | `423795`,`398601`,`398758`,`703037`,`703275`,`689033`,`587869` | `requiresStructuredOutput` | force-SO query option | `grep -c`=0 in 183 → 8 in 193 | high |
| 1B inline nudge | `465638-465654` (`vbl`) | `s.options.requiresStructuredOutput`, `Hbl`, `Ibl` | gated meta-message enforcement | replaces 183 Stop-hook `zKn`@`575795` | high |
| 1B success-check | `601998` | `Ibl` | last SO call succeeded? (`is_error!==true`) | new helper | high |
| 1B sentinel | `465901` | `Hbl="[structured-output-enforce]"` | nudge dedup marker | `grep -c`=0 in 183 | high |
| 1 wording change | `424073` | "after in-conversation nudge" | single-nudge wording | 183 `417509` "after 2 in-conversation nudges" | high |
| 2 cap value | `423782`,`424307` | `kn = Be.MAX_STRUCTURED_OUTPUT_RETRIES ?? NYp`, `NYp=5` | workflow SO retry cap = 5 | absent in 183 loop | high |
| 2 failure count | `423819` | `Ko.delete(id) && so.is_error → Mr++` | count failed SO `tool_result`s | absent in 183 (`417269` no counter) | high |
| 2 abort | `423821-423826` | `Mr>=kn && dt===void 0 → throw Fi(...)` | "StructuredOutput retry cap (5) exceeded" | `grep -c`=0 in 183 | high |
| 2 schema throw | `229485` | `throw new Fi("Output does not match required schema…")` | per-call validation failure | carryover (183 `221476`, class `Bl`) | high |
| 2 print-mode cap (CARRYOVER) | `704023-704054` | `error_max_structured_output_retries` | SDK print cap, env `MAX_STRUCTURED_OUTPUT_RETRIES||"5"` | byte-equiv 183 `685293-685320`; 5× both | high |
| 3 filter state | `542947` | `[P,O]=useState("all")` | status filter state | 183 `useState("all")` count 1→2 | high |
| 3 filtered list | `542948-542951` | `F = …agents.filter(D$e(a,U)===P)` | apply filter | new occurrence | high |
| 3 cycle fn | `543007` | `pe()` | cycle filter, skip empty statuses | new | high |
| 3 cycle order | `543272` | `eYt=["all","running",…]` | filter order | `grep -c`=0 in 183 | high |
| 3 key handler | `543081` | `key==="f" && S==="agents" → pe()` | `f` cycles filter | `grep -c`=0 in 183 | high |
| 3 footer hint | `543128` | `"f filter[: <status>]"` | hint | `grep -c`=0 in 183 | high |
| 3 host component | carryover | `532060-532145` (183) | detail view w/ j/k/x/p/s | unchanged shell | high |
| VM spine | carryover | `m4`@`398565`, runner loop, `agent()` doc `425071` | unchanged | line-for-line vs 183 | high |

---

## Proposed module docs

EXTEND `42_workflow/` (do not create a new module dir):
1. `42_workflow/structured_output_call_control.md` — covers bullets 1+2 together (they patch the same agent runner): the success guard (`dt !== void 0 && sr > 2`), the `requiresStructuredOutput` inline enforcement (and why it replaced the 183 Stop-hook), the `Ibl`/`Hbl` dedup, and the failure-retry cap (`NYp=5`). Include the print-mode-carryover caveat for the cap.
2. `42_workflow/workflows_detail_status_filter.md` — bullet 3: the `f`-key filter, `eYt` cycle order, empty-status skipping, footer hint, on a carryover detail component.

Add new symbols (`Ep` already exists; add `requiresStructuredOutput`, `Ibl`, `Hbl`, `vbl`, `NYp`, `qVd`, `eYt`/`XOo`/`pe` filter group) to `symbol_index_core_features.md` (Workflow / StructuredOutput section).

---

## Depth assessment

**Moderate-to-rich.** Bullets 1 and 2 are genuine source-level logic deltas in the workflow agent runner (guards, counters, a new query option, a new enforcement generator path, a new helper + sentinel) — each with clean 183 before/after diffs and an adversarial carryover caveat (print-mode cap; old Stop-hook). Bullet 3 is a real but smaller UI-state delta (filter state + cycle + key + hint) layered on a carryover component. The underlying workflow VM/runtime spine is unchanged. Enough substance for one combined call-control doc + one short filter doc.
