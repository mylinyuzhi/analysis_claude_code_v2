# Workflow runtime and UI deltas — OTEL attributes, SDK/RC progress publishing, script parsing, save path, `/workflows` layout

> **Type/version:** nine `.198`→`.216` bullets, four genuinely net-new mechanisms and three
> carryover-with-a-narrow-delta. TARGET bundle:
> `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, `build_sha 4073f595`). BASELINE: the 2.1.193 bundle.
> Every `cli_inner_pretty.js:<line>` below is a **220** line unless tagged **(193)**.

Companion doc: [workflow_size_guideline.md](workflow_size_guideline.md).

---

## TL;DR

Six independent changes, only one of which is a new subsystem:

| Bullet | Real delta | Size of delta |
|---|---|---|
| `.202` `workflow.run_id` / `workflow.name` OTel attrs | new `D5r` attribute builder + **two** `setAttributes` lines and one `Object.assign` | ~4 lines |
| `.202` unicode-quote corruption + parse-error line | Windows-path skip + counters on a **carryover** regex, and a `script`-field exemption for the Workflow tool | ~12 lines |
| `.202` `/workflows` agent list layout | `{model, stats}` → `{model, stats, time}`; `toolCalls` cell deleted; title width helper `qii` added | one function rewritten |
| `.198` progress view dropping earliest agents (SDK/desktop) | publish the **accumulated snapshot** instead of the **batch delta**, plus a 10 s heartbeat | ~6 lines |
| `.208`/`.212` RC clients not seeing the agent grid | a **third** bridge subscription that pushes the agent fan on change | ~12 lines |
| `.208` save dialog showing `~/.claude/workflows/` | display-only: `MO(join(X$t(), name))` replaces a hardcoded `~/…` literal | 1 line |
| `.216` workflow/scheduled-task writes following a symlink at `.claude` | new `assertDirChainReal` O_NOFOLLOW **chain** walk (the pre-existing guard only checked the immediate parent) | ~20 lines |
| `.205` `--json-schema` rejecting valid schemas / running silently unstructured | three changes in one function: a node+depth size walker, `validateFormats: !1`, and an `exit(1)` where 193 fell through — plus a new strict-schema converter | ~16 lines + a 90-line converter |

And two bullets whose scoping anchors turned out to be **wrong**, with the workflow-side code proven
byte-identical to 2.1.193 (§7).

---

## 1. `.202` — `workflow.run_id` / `workflow.name` OpenTelemetry attributes

> *"Added `workflow.run_id` and `workflow.name` OpenTelemetry attributes to telemetry emitted by
> workflow-spawned agents, so a workflow run's activity can be reconstructed from OTel data."*

### 1.1 Correcting the ground-truth count first

`_GROUND_TRUTH_verified_anchors.md` §3 lists this bullet as `220=3 / 193=2` — "partially pre-existing.
Find the one new emission site." That count came from an **unescaped dot**: `workflow.run_id` as a regex
also matches `workflow_run_id`.

| Pattern | 220 | 193 | What the 193 hits are |
|---|---|---|---|
| `workflow\.run_id` (literal dot) | **1** (`:111461`) | **0** | — |
| `workflow_run_id` (snake_case) | 2 (`:388701`, `:388741`) | 2 (`:424852 (193)`, `:424892 (193)`) | the `tengu_workflow_completed` / `tengu_workflow_phase_completed` product-analytics events |

The 193 hits are a *different telemetry channel* (the internal `tengu_*` event stream, not OTel), and they
are pure carryover. **The OTel semantic-convention attributes are genuinely net-new: 220=1 / 193=0.**
Same for `workflow\.name`: 220=1 / 193=0.

### 1.2 The builder and its three consumers

```javascript
// ============================================
// buildWorkflowOtelAttrs / buildWorkflowEventFields - workflow provenance for telemetry
// Location: cli_inner_pretty.js:111459-111466
// ============================================

// ORIGINAL (for source lookup):
function D5r(e) {
  if (!e || !mde(e) || !e.workflowRunId) return {};
  return { "workflow.run_id": e.workflowRunId, ...(e.workflowName && { "workflow.name": e.workflowName }) };
}
function nZ(e) {
  if (!e || !mde(e) || !e.workflowRunId) return {};
  return { workflowRunId: e.workflowRunId, workflowName: e.workflowName };
}

// READABLE (for understanding):
function buildWorkflowOtelAttrs(agentContext) {
  if (!agentContext || !isSubagentContext(agentContext) || !agentContext.workflowRunId) return {};
  return {
    "workflow.run_id": agentContext.workflowRunId,
    ...(agentContext.workflowName && { "workflow.name": agentContext.workflowName }),
  };
}
function buildWorkflowEventFields(agentContext) {          // camelCase twin for the tengu_* event stream
  if (!agentContext || !isSubagentContext(agentContext) || !agentContext.workflowRunId) return {};
  return { workflowRunId: agentContext.workflowRunId, workflowName: agentContext.workflowName };
}

// Mapping: D5r→buildWorkflowOtelAttrs, nZ→buildWorkflowEventFields, mde→isSubagentContext (:111442)
```

Three consumers, all one-liners bolted onto existing attribute assembly:

| Consumer | Line | Emission surface |
|---|---|---|
| `Ac` — the OTel **log-record** emitter (`body: "claude_code.<event>"`) | `:167360` `Object.assign(n, D5r(r))` | every `claude_code.*` log event that passes an agent context |
| the `claude_code.llm_request` **span** builder | `:168127` `u.setAttributes(D5r(t))` | one span per LLM request |
| the `claude_code.tool` **span** builder | `:168218` `c.setAttributes(D5r(t))` | one span per tool call |

The 2.1.193 sites are byte-identical *minus these lines*:

```javascript
// 193, :286603-286608 — the llm_request span, with no workflow attributes
u = a.startSpan("claude_code.llm_request", { attributes: c }, i);
if (n?.querySource) u.setAttribute("query_source", n.querySource);
if (t && !YK(t)) {
  if (t.agentId) u.setAttribute("agent_id", t.agentId);
  if (t.parentAgentId) u.setAttribute("parent_agent_id", t.parentAgentId);
}                                          // <- 220 adds u.setAttributes(D5r(t)) here
```

(The `claude_code.tool` span in 193 is at `:286694 (193)` with the same shape.)

### Why a dotted namespace, and why a separate camelCase twin

**What it does.** Stamps every span and log record produced *inside* a workflow-spawned subagent with the
run id, so an OTel backend can group them.

**How it works.**
1. `mde(e)` (`:111442`) requires `agentType === "subagent"`. Main-loop and background-agent activity is
   never stamped, even if a workflow is running — only work *inside* the workflow's agents.
2. `!e.workflowRunId` short-circuits, so a plain `Agent`-tool subagent emits nothing extra.
3. `workflow.name` is conditionally spread: absent when falsy, rather than present-and-empty. OTel
   backends index on attribute *presence*, so an empty-string attribute would create a bogus cardinality
   bucket.

**Why this approach.**
- **Dots, not underscores, because this is the OTel channel.** OpenTelemetry semantic conventions are
  dotted and hierarchical; `workflow.run_id` will group alongside `gen_ai.request.model` and
  `gen_ai.response.id` (`:168178`) in the same trace. The internal `tengu_*` events use snake_case flat
  keys, which is why `nZ` exists as a camelCase twin (12 call sites, e.g. `:342491`, `:398850`, `:414333`)
  rather than reusing `D5r`.
- **Attach at the span factory, not at each emitter.** There are three factories and dozens of emitters.
  Bolting the builder onto the factories means every future span type inherits workflow provenance for
  free, and it is impossible for a new emitter to forget.
- **`run_id` rather than a trace link.** A workflow's agents each get their own root span (they run in
  separate async contexts, via `AsyncLocalStorage` at `:111474`). A shared attribute is the only way to
  correlate them without inventing a synthetic parent span, which would have to stay open for the whole
  workflow — hours, in the worst case — and would break span-duration histograms.

**Key insight.** The bullet's promise, *"a workflow run's activity can be reconstructed from OTel data"*,
is exactly satisfied by a group-by on one attribute across two span types plus the log stream. It is a
4-line change that turns three independent telemetry streams into one queryable unit — a good example of
attaching data at the narrowest chokepoint rather than at every producer.

---

## 2. `.202` — unicode escapes in workflow scripts, and the parse-error line

> *"Fixed workflow scripts with unicode quote escapes in strings being corrupted before parsing; workflow
> parse errors now show the offending line instead of always blaming TypeScript."*

Two independent fixes in one bullet. The scoping file called both out; here is the full mechanism.

### 2.1 The repair pass itself is CARRYOVER — the guards are the delta

The driving regex is **byte-identical** between builds:

```
/\\u([dD][89aAbB][0-9a-fA-F]{2})\\u([dD][c-fC-F][0-9a-fA-F]{2})|\\u([0-9a-fA-F]{4})/
```

- 2.1.193: inlined as a single global literal inside `hor`, `:593478 (193)`.
- 2.1.220: split into `ltp` (non-global, `:508587`), `BO_ = new RegExp(ltp.source, "g")` (`:508588`), and a
  brand-new third regex `UO_` (`:508589`).

```javascript
// ============================================
// repairDoubleEscapedUnicode - deep-walk tool input, un-double-escaping \uXXXX, with Windows-path skip
// Location: cli_inner_pretty.js:508472-508506
// ============================================

// ORIGINAL (for source lookup):
function ctp(e) {
  let t = { repairedStrings: 0, windowsPathSkips: 0 },
    r = vqs(e, t);
  if (t.repairedStrings > 0 || t.windowsPathSkips > 0)
    O("tengu_repair_double_escaped_unicode", {
      repaired_strings: t.repairedStrings,
      windows_path_skips: t.windowsPathSkips,
    });
  return r;
}
function vqs(e, t) {
  if (typeof e === "string") {
    if (!e.includes("\\u")) return e;
    if (!ltp.test(e)) return e;
    if (UO_.test(e)) return (t.windowsPathSkips++, e);
    let r = e.replace(BO_, (n, o, i, s, a) => {
      let l = a;
      while (l > 0 && e[l - 1] === "\\") l--;
      if ((a - l) & 1) return n;
      if (o !== void 0) return String.fromCharCode(parseInt(o, 16), parseInt(i, 16));
      let c = parseInt(s, 16);
      if (c >= 55296 && c <= 57343) return n;
      return String.fromCharCode(c);
    });
    if (r !== e) t.repairedStrings++;
    return r;
  }
  if (Array.isArray(e)) return e.map((r) => vqs(r, t));
  if (e !== null && typeof e === "object") {
    let r = {};
    for (let [n, o] of Object.entries(e)) r[n] = vqs(o, t);
    return r;
  }
  return e;
}

// READABLE (for understanding):
function repairDoubleEscapedUnicode(toolInput) {
  let stats = { repairedStrings: 0, windowsPathSkips: 0 },
    repaired = repairValue(toolInput, stats);
  if (stats.repairedStrings > 0 || stats.windowsPathSkips > 0)
    emitTelemetry("tengu_repair_double_escaped_unicode", {
      repaired_strings: stats.repairedStrings,
      windows_path_skips: stats.windowsPathSkips,
    });
  return repaired;
}
function repairValue(value, stats) {
  if (typeof value === "string") {
    if (!value.includes("\\u")) return value;               // 1. cheapest possible reject
    if (!ESCAPE_RE.test(value)) return value;               // 2. non-global .test(), no allocation
    if (WINDOWS_PATH_RE.test(value)) { stats.windowsPathSkips++; return value; }   // 3. NEW in 220
    let out = value.replace(ESCAPE_RE_G, (whole, hi, lo, bmp, offset) => {
      let scan = offset;
      while (scan > 0 && value[scan - 1] === "\\") scan--;  // count preceding backslashes
      if ((offset - scan) & 1) return whole;                // odd run => this \u is itself escaped
      if (hi !== undefined) return String.fromCharCode(parseInt(hi, 16), parseInt(lo, 16));  // surrogate pair
      let cp = parseInt(bmp, 16);
      if (cp >= 0xd800 && cp <= 0xdfff) return whole;       // lone surrogate: refuse
      return String.fromCharCode(cp);
    });
    if (out !== value) stats.repairedStrings++;
    return out;
  }
  if (Array.isArray(value)) return value.map((v) => repairValue(v, stats));
  if (value !== null && typeof value === "object") {
    let out = {};
    for (let [k, v] of Object.entries(value)) out[k] = repairValue(v, stats);
    return out;
  }
  return value;
}

// Mapping: ctp→repairDoubleEscapedUnicode, vqs→repairValue, ltp→ESCAPE_RE, BO_→ESCAPE_RE_G,
//          UO_→WINDOWS_PATH_RE, O→emitTelemetry
```

The new Windows-path detector (`:508589`):

```javascript
UO_ = /(?:^|[^A-Za-z])[A-Za-z]:[\\/]|(?:^|[\s"'=])\\\\[^\s\\/]+[\\/](?!\\)/
```

Two alternatives: a drive-letter prefix (`C:\` or `C:/`, not preceded by a letter so `http://` and
`foo:bar` do not match), and a UNC prefix (`\\server\`, preceded by start/whitespace/quote/`=`, and not
followed by another backslash).

### Why a whole-string bail-out for Windows paths, and why the odd-backslash guard is not enough

**What it does.** Skips *the entire string* — not just the matching span — when it looks like a Windows
path.

**How it works.** The existing odd-backslash guard handles `"\\\\u0041"` (an escaped backslash followed by a
literal `u0041`) correctly. What it cannot handle is `"C:\\users\\bob"`: after JSON decoding this is the
7-char-relevant sequence `C:\users\bob`, and the substring `\u` in `\users` matches the BMP branch —
`\user` is not four hex digits, so it does not match… but `"C:\\unicode\\d834"`-shaped paths, and any path
component starting with `u` followed by four hex characters (`\ubeef\`, `\u0041files\`) do. The
preceding-backslash count is **1** (odd → returns `whole`) only when the backslash immediately before `\u`
is itself present in the *decoded* string; in the double-escaped forms this pass exists to repair, the run
length is even and the guard passes. The result is a mangled path.

**Why bail on the whole string rather than per-match.** A path is a *unit*: repairing part of it produces
something that is neither the original nor a valid path, and the failure is silent. Refusing the whole
string keeps the input byte-exact, and the only cost is that a genuinely double-escaped unicode literal
inside a string that also contains a Windows path is left un-repaired — a much better failure than a
corrupted path.

**Why the counters and the telemetry event.** `tengu_repair_double_escaped_unicode` (`:508476`,
**220=1 / 193=0**) reports `repaired_strings` and `windows_path_skips` per tool call. This is a
heuristic operating on model output; the two counters are how you find out whether the heuristic is firing
too often (`repaired_strings` high on tools that never need it) or is being defeated
(`windows_path_skips` high enough that repairs are being skipped in practice). Note the event fires when
**either** counter is non-zero, so skips are as observable as repairs.

**Ordering.** Three progressively-more-expensive rejects: `String.includes("\\u")` → non-global
`RegExp.test` (no capture-group allocation, no `lastIndex` state) → the Windows check → only then a
`replace` with a callback. Since this walks *every string in every tool input on every assistant message*,
the ordering is load-bearing.

### 2.2 The actual workflow fix: `script` is exempted from the repair

```javascript
// ============================================
// normalizeToolUseBlocks - the Workflow `script` exemption
// Location: cli_inner_pretty.js:531883-531896
// ============================================

// ORIGINAL (for source lookup):
if (typeof i === "object" && i !== null && !yxt(i)) {
  let s = Ic(t, o.name);
  if (s)
    try {
      let a = pU_(i, s.inputSchema, s.inputJSONSchema),
        l = ctp(a);
      if (s.name === dk && typeof a.script === "string") l.script = a.script;
      ((i = l), (i = atp(s, l, r)));
    } catch (a) { ... }
}

// READABLE (for understanding):
if (typeof input === "object" && input !== null && !isSentinelInput(input)) {
  let tool = findToolByName(tools, block.name);
  if (tool)
    try {
      let normalized = coerceInputAgainstSchema(input, tool.inputSchema, tool.inputJSONSchema),
        repaired = repairDoubleEscapedUnicode(normalized);
      if (tool.name === WORKFLOW_TOOL_NAME && typeof normalized.script === "string")
        repaired.script = normalized.script;          // <- restore the byte-exact script
      input = applyToolInputMigrations(tool, repaired, meta);
    } catch (err) { ... }
}

// Mapping: pU_→coerceInputAgainstSchema, ctp→repairDoubleEscapedUnicode, dk→WORKFLOW_TOOL_NAME ("Workflow"),
//          atp→applyToolInputMigrations, Ic→findToolByName, yxt→isSentinelInput
```

The 2.1.193 equivalent at `:600681-600682 (193)` has no split and no exemption:

```javascript
let a = hor(zWf(s, i.inputSchema, i.inputJSONSchema));   // repaired value is the ONLY value
((s = a), (s = lJl(i, a, n)));
```

### Why the Workflow tool needs an exemption that no other tool needs

**What it does.** Runs the repair on the whole Workflow input object, then puts the original `script`
string back.

**How it works.** `a` holds the schema-coerced-but-unrepaired input; `l` holds the repaired copy; the
`script` key is copied back from `a` onto `l`. Every other field (`name`, `scriptPath`, `args`, `remote`,
`resumeFromRunId`) keeps the repair.

**Why.** `script` is **JavaScript source**, and in JavaScript `\u201c` inside a string literal is a
*meaningful escape the language itself will decode*. The repair pass exists because models sometimes emit
`\\u201c` where they meant `\u201c` in ordinary prose fields; applying that same transform to source code
rewrites `"\u201c"` (a valid 6-char escape) into `"“"` (a literal curly quote) **before the parser sees
it**. That is usually harmless and occasionally fatal — a curly quote where a straight quote was intended
closes a string, and the script fails to parse with a syntax error that has no relation to what the model
wrote. Hence the bullet's two halves land together: the corruption *caused* the parse errors, and the
second half of the bullet improves the error message for the residual cases.

**Why restore rather than skip.** Skipping would mean threading a per-field exemption list through the
recursive walker. Restoring one key after the fact is O(1), requires no change to `vqs`, and — critically —
still repairs `args`, which is model-authored prose data passed *into* the script and does benefit from
the fix. A blanket skip for the Workflow tool would have lost that.

**Trade-off / residual risk.** The exemption is keyed on `s.name === dk`, i.e. the canonical name
`"Workflow"`. The tool also registers the alias `"RunWorkflow"` (`:389357`). If a request arrives naming
the alias and `findToolByName` resolves aliases to a tool object whose `.name` is the alias, the exemption
would miss. Not verified either way here — flagged as a possible edge.

### 2.3 The parse-error formatter

```javascript
// ============================================
// formatScriptParseError - loc-aware parse error with source line + caret
// Location: cli_inner_pretty.js:275631-275652
// ============================================

// ORIGINAL (for source lookup):
function dgy(e, t) {
  let r = e instanceof Error ? e.message : String(e),
    n =
      "Workflow scripts must be plain JavaScript — common causes are TypeScript syntax (type annotations, interfaces, generics) and broken string quoting or escaping.",
    o = pgy(e) ? e.loc : void 0,
    i = o ? t.split(`
`)[o.line - 1] : void 0;
  if (!o || i === void 0)
    return `Script parse error: ${r}. ${"Workflow scripts must be plain JavaScript — …"}`;
  let s = Math.max(0, Math.min(o.column, i.length)),
    a = Math.max(0, Math.min(s - Math.floor(Abs / 2), i.length - Abs)),
    l = i.slice(a, a + Abs),
    c = `${Mm(" ", s - a)}^`;
  return `Script parse error: ${r}

${l}
${c}

${"Workflow scripts must be plain JavaScript — …"}`;
}

// READABLE (for understanding):
function formatScriptParseError(err, source) {
  let message = err instanceof Error ? err.message : String(err),
    hint = "Workflow scripts must be plain JavaScript — common causes are TypeScript syntax "
         + "(type annotations, interfaces, generics) and broken string quoting or escaping.",
    loc = hasNumericLoc(err) ? err.loc : undefined,
    line = loc ? source.split("\n")[loc.line - 1] : undefined;
  if (!loc || line === undefined) return `Script parse error: ${message}. ${hint}`;   // graceful fallback
  let col = clamp(loc.column, 0, line.length),
    windowStart = clamp(col - Math.floor(SNIPPET_WIDTH / 2), 0, line.length - SNIPPET_WIDTH),
    snippet = line.slice(windowStart, windowStart + SNIPPET_WIDTH),
    caret = " ".repeat(col - windowStart) + "^";
  return `Script parse error: ${message}\n\n${snippet}\n${caret}\n\n${hint}`;
}

// Mapping: dgy→formatScriptParseError, pgy→hasNumericLoc (:275653), Abs→SNIPPET_WIDTH (=80, :275740),
//          Mm→repeatString
```

Compare 2.1.193's single flat string, `:422994 (193)`:

> `Script parse error: ${…}. Workflow scripts must be plain JavaScript — TypeScript syntax (type
> annotations like \`: string[]\`, interfaces, generics) fails to parse.`

Two changes:
1. **The hint no longer blames only TypeScript.** 220 adds *"and broken string quoting or escaping"* as a
   co-equal cause — which is the *other* half of this same bullet (§2.2). The changelog phrase "instead of
   always blaming TypeScript" is literally this string edit. (`TypeScript syntax` is 220=4 / 193=2.)
2. **A source line and caret**, windowed to 80 columns centred on the error column.

### Why guard `loc` with a runtime type predicate

`pgy` (`:275653-275664`) checks `"loc" in e`, `typeof loc.line === "number"`, `typeof loc.column ===
"number"` before use. The thrown value comes from a *bundled Acorn* (`Myo()`, `:275603`) whose error shape
is a contract the client does not own; and the `catch` also catches non-`Error` throws. A missing or
malformed `loc` degrades to the flat message rather than throwing inside the error formatter — the worst
possible place to throw, because it would replace a useful syntax error with an internal one.

The window arithmetic `Math.min(s - 40, i.length - Abs)` can go negative on short lines, hence the outer
`Math.max(0, …)`; and `Math.min(o.column, i.length)` handles a column that points one past the end (Acorn
reports the position *after* the offending token for some errors).

Sole caller: `$H` (`:275599-275629`), the workflow script meta-parser, itself called from 11 sites
including the tool's `validateInput` (`:389412`) and the `/workflows` save path (`:651272`). The
size cap it enforces first is `o1 = 524288` (512 KB, `:162044`) — *"Script exceeds 524288 bytes"*.

---

## 3. `.198` — the progress view dropped the earliest agents in SDK and desktop-app sessions

> *"Fixed the workflow progress view dropping the earliest agents from the list while the phase counter
> stayed correct in SDK and desktop-app sessions."*

The bullet names two consumers, and the qualifier is the whole story: this was **never** a terminal-UI bug.

### 3.1 What was NOT the bug — three renderers proven carryover

Before believing any renderer hypothesis, all three candidates were diffed:

| Renderer | 2.1.220 | 2.1.193 | Verdict |
|---|---|---|---|
| flat agent list, shows last `Azp = 8` + `└─ · · · +N more` | `Hga` `:650746-650811`, `Azp = 8` `:650879` | `XYp` `:425443-…`, `YYp = 8` `:425582 (193)` | byte-identical carryover |
| phase-group box (`done/total` header, failed+running rows, `✓ N done` summary) | `kga` `:650629-650745` | `:425330-425438 (193)` | byte-identical carryover |
| progress-event reducer with its log-only trim | `qPs` `:386523-386572` | `hTo` `:422745-422794 (193)` | byte-identical carryover |

`qPs` deserves a note because it *looks* like the fix and is not:

```javascript
if (a && o.length > kSd * 2) {                       // only when a non-keyed event was pushed
  let u = o.length - kSd, d = [];
  for (let p = 0; p < o.length; p++) {
    let f = o[p];
    if (u > 0 && f.type === "workflow_log") { u--; continue; }   // evict ONLY logs
    d.push(f);
  }
  o = d;
}
```

The trim already refused to evict `workflow_agent` / `workflow_phase` entries **in 2.1.193**. Anyone
reasoning from the bullet text alone would file this as the fix; the count says otherwise.

### 3.2 The actual fix: delta publishing → snapshot publishing

```javascript
// ============================================
// workflow SDK/bridge progress publisher - publishes the accumulated snapshot, not the batch
// Location: cli_inner_pretty.js:388634-388658
// ============================================

// ORIGINAL (for source lookup):
R = c6y({
  onBatch: (q) => qPs(t, q, l.taskRegistry),
  onSdkEmit: (q) => {
    let F = q.filter(oEd);
    if (F.length === 0) return;
    let G = A.getAppState()?.tasks?.[t];
    if (G?.type !== "local_workflow" || G.status !== "running") return;
    let j = F.findLast((Y) => Y.type === "workflow_agent"),
      z = F.every((Y) => Y.type === "workflow_agent" && Y.state === "progress"),
      V = Date.now(),
      K = !z || V - I >= l6y;
    if (K) I = V;
    Vpr({
      taskId: t,
      toolUseId: u,
      description: j ? (j.phaseTitle ? `${j.phaseTitle}: ${j.label}` : j.label) : E.description,
      startTime: E.startTime,
      totalTokens: G.totalTokens,
      toolUses: G.totalToolCalls,
      lastToolName: j?.label,
      summary: g,
      workflowProgress: K ? G.workflowProgress.filter(oEd) : void 0,
    });
  },
}),

// READABLE (for understanding):
publisher = createProgressBatcher({
  onBatch: (batch) => applyWorkflowProgressEvents(taskId, batch, ctx.taskRegistry),
  onSdkEmit: (batch) => {
    let interesting = batch.filter(isNotWorkflowLog);
    if (interesting.length === 0) return;
    let task = getAppState()?.tasks?.[taskId];
    if (task?.type !== "local_workflow" || task.status !== "running") return;
    let newestAgentEvent = interesting.findLast((e) => e.type === "workflow_agent"),
      isPureProgressTick = interesting.every((e) => e.type === "workflow_agent" && e.state === "progress"),
      now = Date.now(),
      includeFullSnapshot = !isPureProgressTick || now - lastSnapshotAt >= SNAPSHOT_HEARTBEAT_MS;  // 10 s
    if (includeFullSnapshot) lastSnapshotAt = now;
    emitTaskProgressFrame({
      taskId, toolUseId,
      description: newestAgentEvent
        ? (newestAgentEvent.phaseTitle ? `${newestAgentEvent.phaseTitle}: ${newestAgentEvent.label}` : newestAgentEvent.label)
        : launchRecord.description,
      startTime: launchRecord.startTime,
      totalTokens: task.totalTokens,
      toolUses: task.totalToolCalls,
      lastToolName: newestAgentEvent?.label,
      summary,
      workflowProgress: includeFullSnapshot ? task.workflowProgress.filter(isNotWorkflowLog) : undefined,
    });
  },
});

// Mapping: c6y→createProgressBatcher (:388538), qPs→applyWorkflowProgressEvents, oEd→isNotWorkflowLog (:388907),
//          Vpr→emitTaskProgressFrame (:345314), l6y→SNAPSHOT_HEARTBEAT_MS (=1e4, :388913), I→lastSnapshotAt,
//          E→launchRecord (the task-registry entry captured at launch), G→task (the live registry entry)
```

The 2.1.193 publisher, `:424803-424823 (193)`:

```javascript
C = () => {
  if (((v = void 0), S.length === 0)) return;
  let M = S;
  if (((S = []), hTo(t, M, l.taskRegistry), !Tr())) return;      // Tr() = isNonInteractive
  let U = M.filter((W) => W.type !== "workflow_log");            // U = THIS BATCH ONLY
  if (U.length === 0) return;
  let F = y.getAppState()?.tasks?.[t];
  if (F?.type !== "local_workflow" || F.status !== "running") return;
  let $ = U.findLast((W) => W.type === "workflow_agent");
  Fmt({ …, totalTokens: F.totalTokens, toolUses: F.totalToolCalls, …, workflowProgress: U });
};                                                              // ^^ publishes the DELTA
```

### The bug, precisely

**What went wrong.** `workflowProgress: U` published *only the events in the current 16 ms batch*. The
sibling fields — `totalTokens`, `toolUses` — were read from `F`, the **accumulated** task-registry entry.
So the frame said "12 agents done, 840 k tokens" while carrying a `workflowProgress` array containing the
two agents that had changed in the last 16 ms. A consumer that renders the array it receives shows two
agents; a consumer that renders the counters shows the true totals. That is verbatim the bullet: *"dropping
the earliest agents from the list while the phase counter stayed correct."*

**Why the terminal was immune.** The terminal renderer never reads these frames. It reads
`state.tasks[id].workflowProgress`, which `qPs`/`hTo` maintains as a full accumulated array in both
builds (§3.1). Only the frame consumers — the stream-json SDK and the desktop-app REPL bridge — saw the
delta. Hence "in SDK and desktop-app sessions".

**The fix.** `workflowProgress: G.workflowProgress.filter(oEd)` — publish the same accumulated array the
terminal reads, so all three consumers are fed from one source of truth. The batch `F` is demoted to a
*trigger*: it decides whether to publish at all, what the `description` should say, and whether this is a
"boring" tick.

**Why a 10 s heartbeat instead of always sending the snapshot.** Publishing the full array on every
16 ms tick is O(agents) bytes at 60 Hz — for a 50-agent workflow that is a real serialisation cost on the
hot path. `z` detects the *boring* case: a batch consisting purely of `workflow_agent` events in state
`progress`, i.e. token/tool-count ticks with no state transitions. In that case the snapshot is included at
most once per `l6y = 1e4` ms. Any batch containing a `start`, `done`, `error` or `workflow_phase` event —
i.e. anything that changes the *shape* of the grid — publishes immediately.

Note what is **always** sent even on a suppressed tick: `description`, `totalTokens`, `toolUses`,
`lastToolName`. Those are a handful of scalars, so live counters stay smooth at 60 Hz while the expensive
array is throttled. This is the same cheap-field/expensive-field split as the size-guideline memo — a
recurring pattern in this codebase.

**Why 10 s.** It is the maximum staleness a *newly attached* client can experience for grid **shape**
(§4 explains why that matters), and it is long enough that a 50-agent workflow burning tokens for ten
minutes publishes ~60 snapshots rather than ~36 000.

### 3.3 The batcher also gained a bridge mode

```javascript
// ============================================
// createProgressBatcher - 16 ms coalescing, plus a 250 ms rate limit for the desktop bridge
// Location: cli_inner_pretty.js:388538-388569
// ============================================

// ORIGINAL (for source lookup):
function c6y(e) {
  let t = [], r, n = 0,
    o = (i) => {
      if (((r = void 0), t.length === 0)) return;
      if (!i && !yn() && Mx()) {
        let a = n + a6y - Date.now();
        if (a > 0) { r = setTimeout(o, a); return; }
        n = Date.now();
      }
      let s = t;
      if (((t = []), e.onBatch(s), !yn() && !Mx())) return;
      e.onSdkEmit(s);
    };
  return {
    onProgress: (i) => { if ((t.push(i), !r)) r = setTimeout(o, s6y); },
    flushNow: () => { if (r) clearTimeout(r); o(!0); },
    cancel: () => { if (r) (clearTimeout(r), (r = void 0)); t = []; },
  };
}

// READABLE (for understanding):
function createProgressBatcher(handlers) {
  let pending = [], timer, lastFlushAt = 0,
    flush = (forced) => {
      timer = undefined;
      if (pending.length === 0) return;
      if (!forced && !isNonInteractive() && isReplBridgeActive()) {   // interactive + desktop bridge
        let wait = lastFlushAt + BRIDGE_MIN_INTERVAL_MS - Date.now();  // 250 ms
        if (wait > 0) { timer = setTimeout(flush, wait); return; }
        lastFlushAt = Date.now();
      }
      let batch = pending;
      pending = [];
      handlers.onBatch(batch);                                        // always: terminal task state
      if (!isNonInteractive() && !isReplBridgeActive()) return;       // pure terminal: stop here
      handlers.onSdkEmit(batch);                                      // SDK or bridge: publish a frame
    };
  return {
    onProgress: (event) => { pending.push(event); if (!timer) timer = setTimeout(flush, BATCH_WINDOW_MS); },
    flushNow: () => { if (timer) clearTimeout(timer); flush(true); },
    cancel:   () => { if (timer) { clearTimeout(timer); timer = undefined; } pending = []; },
  };
}

// Mapping: c6y→createProgressBatcher, s6y→BATCH_WINDOW_MS (=16, :388911),
//          a6y→BRIDGE_MIN_INTERVAL_MS (=250, :388912), yn→isNonInteractive (:3286),
//          Mx→isReplBridgeActive (:3969)
```

`onSdkEmit` is **220-only** (220=2 / 193=0) — in 193 the emit was inlined into the flush closure. The
emit gate widened as part of the same change:

| | 2.1.193 | 2.1.220 |
|---|---|---|
| publish frames when | `Tr()` — non-interactive only (`:424806 (193)`) | `yn() \|\| Mx()` — non-interactive **or** desktop REPL bridge (`:388553`) |
| extra rate limit | none | 250 ms, applied only when *interactive **and** bridge active* (`:388544-388551`) |

**Why the 250 ms limit is scoped to `interactive && bridge`.** In that configuration two consumers are
live at once: the terminal renderer (which needs 60 Hz to feel smooth, and gets it via `onBatch`) and the
desktop app reading frames. Frames are the expensive channel, so they are throttled to 4 Hz while the
terminal keeps its full rate. In pure SDK mode (`yn()` true) there *is* no terminal, so nothing is gained
by throttling and frames flow at the 16 ms cadence. `flushNow()` bypasses the limit via `forced` so the
final frame of a workflow is never delayed (`:388680` calls it before reading the terminal state).

**Key insight.** `isNonInteractive() || isReplBridgeActive()` is exactly the set "SDK and desktop-app
sessions" from the changelog bullet. When a bullet names its affected surfaces, the surface predicate is
usually a literal disjunction in the code — a fast way to locate a fix.

---

## 4. `.208` / `.212` — the agent grid for Remote Control clients

> `.208`: *"Fixed Remote Control clients attaching to a terminal-hosted session not seeing background
> agents and workflow progress until a task started or stopped."*
> `.212`: *"Fixed the workflow agent grid staying empty for Remote Control clients that join a session
> mid-run."*

### 4.1 The scoping anchors for these two bullets are wrong

`_scope_v211_214.md` #22 and `_scope_v206_210.md` #14/#22 probe `tengu_frame_publish_context` and
`tengu_remote_subagent_frame_nested`. Both are 220>0/193=0, but neither is about the agent grid:

- **`tengu_frame_publish_context`** (`:381716`, inside `wbd()`) is an **Artifact** gate. Its two consumers
  (`:381809`, `:382719`) add a `publish_context` field to artifact-publish payloads — `host: "frame"` at
  `:381722` is the artifact hosting service, not a Remote Control frame.
- **`tengu_remote_subagent_frame_nested`** (`:757401`) is in a branch guarded by
  `let ut = null; if (ut !== null) { … }` (`:757390-757391`) — **dead code** in the shipped bundle. The
  event cannot fire in 2.1.220.

### 4.2 The real mechanism: a third bridge subscription

The agent grid a Remote Control client renders comes from the `fan` array in the session state file. In
2.1.193 that array was written **only** by the periodic background-agent status writer
(`:465205 (193)`, inside the big `g8e(...)` state write that also carries `state`, `tempo`, `inFlight`,
`tokens`, `needs`, `block`, `children`). That writer is driven by task lifecycle transitions — hence
`.208`'s *"until a task started or stopped"*.

2.1.220 adds a dedicated, change-driven publisher:

```javascript
// ============================================
// subscribeBridgePublishers - 220 adds a THIRD subscription: the agent fan
// Location: cli_inner_pretty.js:335449-335487
// ============================================

// ORIGINAL (for source lookup):
function Mcd(e) {
  if (e.permissionBridgeSubscribed) return;
  ((e.permissionBridgeSubscribed = !0),
    xfe.subscribe((t) => { … Dcd(r, t) … }),
    sTo.subscribe((t) => { … Pcd(r, t) … }),
    bHs.subscribe(() => {
      if (!PI()) return;
      let t = UE();
      e.bridgeWriteChain = e.bridgeWriteChain
        .then(() => e.inFlight ?? void 0)
        .catch(() => {})
        .then(() =>
          Ocd(t).catch((r) => {
            if (!qt(r)) Bg(r);
          }),
        );
    }));
}

// READABLE (for understanding):
function subscribeBridgePublishers(bridge) {
  if (bridge.permissionBridgeSubscribed) return;
  bridge.permissionBridgeSubscribed = true;
  permissionPromptStore.subscribe((p) => { /* publish pending permission prompt */ });
  worktreeStore.subscribe((w)          => { /* publish worktree state          */ });
  agentFanStore.subscribe(() => {                                  // <-- NEW in 2.1.220
    if (!isBridgeEnabled()) return;
    let sessionId = getBridgeSessionId();
    bridge.bridgeWriteChain = bridge.bridgeWriteChain
      .then(() => bridge.inFlight ?? undefined)                    // serialise behind any in-flight write
      .catch(() => {})
      .then(() => publishAgentFan(sessionId).catch((e) => { if (!isAbort(e)) reportError(e); }));
  });
}

// Mapping: Mcd→subscribeBridgePublishers, bHs→agentFanStore (:334800), Ocd→publishAgentFan (:335489),
//          PI→isBridgeEnabled, UE→getBridgeSessionId, qt→isAbort
```

2.1.193's `ybl` (`:464880-464906 (193)`) has exactly **two** subscriptions — `SJ` and `vYn`. The
`bHs.subscribe` block has no 193 counterpart.

```javascript
// ============================================
// publishAgentFan - writes the agent grid into the RC session state file, hash-gated
// Location: cli_inner_pretty.js:335489-335505
// ============================================

// ORIGINAL (for source lookup):
async function Ocd(e) {
  if (!rs() && UE() !== e) return;
  let t = rc(e), r = await Da(t);
  if (!r || dm(r)) return;
  if (r.tempo === "blocked") return;
  let n = spr(),
    o = n.items.length > 0 ? n.items : void 0,
    i = o === void 0 || Bpt(o) === Bpt(r.fan),
    s = Fpt(n.budget) === Fpt(r.budget);
  if (i && s) return;
  await Gpt(t, { ...r, fan: i ? r.fan : o, budget: s ? r.budget : n.budget, inFlight: Z1t(), updatedAt: new Date().toISOString() }, {});
}

// READABLE (for understanding):
async function publishAgentFan(sessionId) {
  if (!isPrimaryHost() && getBridgeSessionId() !== sessionId) return;   // stale closure guard
  let statePath = bridgeStatePath(sessionId), state = await readBridgeState(statePath);
  if (!state || isTerminalState(state)) return;
  if (state.tempo === "blocked") return;                                // don't disturb a blocked session
  let snapshot = getAgentFanSnapshot(),
    items = snapshot.items.length > 0 ? snapshot.items : undefined,
    fanUnchanged = items === undefined || hashFanItems(items) === hashFanItems(state.fan),
    budgetUnchanged = budgetBucket(snapshot.budget) === budgetBucket(state.budget);
  if (fanUnchanged && budgetUnchanged) return;                          // no write at all
  await writeBridgeState(statePath, {
    ...state,
    fan: fanUnchanged ? state.fan : items,
    budget: budgetUnchanged ? state.budget : snapshot.budget,
    inFlight: getInFlightSummary(),
    updatedAt: new Date().toISOString(),
  }, {});
}

// Mapping: Ocd→publishAgentFan, spr→getAgentFanSnapshot (:334794), Bpt→hashFanItems (:334776),
//          Fpt→budgetBucket (:334772), Z1t→getInFlightSummary (:334785), Gpt→writeBridgeState,
//          Da→readBridgeState, rc→bridgeStatePath
```

The fan items themselves come from `lol` (`:764295-…`), which flattens the task registry, expanding a
`local_workflow` into **one item per workflow agent** (`:764324-764336`) with `id`, `label`,
`group: phaseTitle`, `startedAt`, `doneAt`, `failed`. `lol` is carryover (compare `:619961-619989 (193)`),
and `mol` (`:764424-764460`) pushes its output into `agentFanStore` via `SHs` (`:334788`) inside a
`useEffect` whose dependency array (`:764447`) includes the fan **hash** `dXf = Bpt(fol)`.

### Why the grid was empty for a mid-run joiner, and why this fixes it

**What it does.** Makes the agent grid a *push-on-change* value in the session state file rather than a
side-effect of the task-lifecycle writer.

**How it works.**
1. `mol` recomputes the fan on every task-state change and hashes it (`Bpt`, `:334776`) into the effect's
   dependency list, so `SHs` fires only when the grid's *content* changed — not on every re-render.
2. `SHs` stores the snapshot and emits on `bHs`.
3. The bridge subscription serialises a `publishAgentFan` behind whatever write is in flight
   (`bridgeWriteChain`), so concurrent writers cannot interleave a partial state file.
4. `publishAgentFan` re-hashes against what is *already on disk* and returns without writing if nothing
   moved — the second layer of the same de-duplication, needed because the state file can also be written
   by the status writer between the store update and this callback.

**Why a mid-run joiner was empty in 193.** The state file is the joiner's only initial view. In 193, `fan`
was written when the status writer ran, which happened on task start/stop. Join *between* two such events
and the file's `fan` is whatever it was at the last transition — for a workflow that started before you
attached and has not finished a phase, that can be absent entirely. There was no path from "the grid
changed" to "write the file". `.208` and `.212` are the same root cause reported from two angles: `.208`
from the "nothing appears until something starts/stops" symptom, `.212` from the "join mid-run and the grid
is empty" symptom.

**Why `if (r.tempo === "blocked") return`.** A blocked session is waiting on a permission prompt whose
payload is in the same file. Skipping fan writes while blocked avoids racing the prompt publisher for the
same file during the one moment the user is actually looking at it.

**Failure mode.** `if (!rs() && UE() !== e) return` — the subscription captures `sessionId` at callback
time, so if the bridge re-targets a different session between the emit and the async write, a non-primary
host drops the write rather than corrupting another session's file.

**Note the two mechanisms compose.** §3.2's snapshot publishing feeds the *frame* channel (stream-json,
consumed by the desktop app); §4 feeds the *state-file* channel (consumed by Remote Control web/mobile).
A mid-run joiner therefore gets its grid from whichever channel it uses, and within at most 10 s in the
frame case.

---

## 5. `.208` — the save dialog showed `~/.claude/workflows/` instead of the `CLAUDE_CONFIG_DIR` location

> *"Fixed the workflow save dialog showing `~/.claude/workflows/` instead of the `CLAUDE_CONFIG_DIR`
> location for user-scope saves."*

A one-line, display-only fix — and the interesting part is that the **write** was already correct.

| | 2.1.193 | 2.1.220 |
|---|---|---|
| dialog label expression | `M = u === "project" ? \`.claude/workflows/${D}.js\` : \`~/.claude/workflows/${D}.js\`` — `:541825 (193)` | `oES = wRr === "project" ? \`.claude/workflows/${aVa}.js\` : MO(gVa.join(X\$t(), \`${aVa}.js\`))` — `:728335` |
| actual user-scope save dir | `path.join(nr(), "workflows")` — `:541705 (193)` (already config-dir aware) | `X$t()` = `path.join(fn(), "workflows")` — `:388219-388221` |
| literal `~/.claude/workflows` | **1** | **0** |

`fn()` (`:14779`) is the memoised config-dir resolver:
`(process.env.CLAUDE_CONFIG_DIR ?? path.join(os.homedir(), ".claude")).normalize("NFC")`.
`MO` (`:51877-51882`) re-tildifies a path that *is* under `$HOME`, so the label still reads
`~/.claude/workflows/foo.js` for the default case and shows the real path otherwise.

### Why this class of bug is worth naming

**What it does.** Derives the displayed path from the same function that computes the written path.

**Why it happened.** The write path went through a helper (`GRf`/`WSS`) from the start; the label was a
template literal written inline in the dialog component, in a different file, by a different change. The
two agreed for every developer who does not set `CLAUDE_CONFIG_DIR`, which is almost everyone — so the
divergence survived until someone with a redirected config dir looked at the dialog.

**The fix's shape is the lesson.** `MO(join(X$t(), name))` composes the *authoritative* resolver with a
presentation function. There is now exactly one source for the directory, and the tilde is a display
concern applied last. The project-scope branch keeps its literal `.claude/workflows/…` because that path is
genuinely relative to the project root and has no config-dir component.

Dialog context: the label renders as `<scope> scope · <path>` at `:728344`
(`J1f = wRr === "project" ? "Project" : "User"`, `:728341`), with `tab` toggling scope (`:728355`).

---

## 6. `.216` — workflow saves and scheduled-task writes following a symlink at `.claude`

> *"Fixed workflow saves and scheduled-task writes following a symlink at `.claude`, which could redirect
> writes outside the project."* (SECURITY)

### 6.1 The scoping anchor is wrong here too

`_scope_v215_220.md` #18 probes `symlink at` (220=2 / 193=2). Neither 220 hit is this bullet:
`:224564` is the **git-worktree** creation guard, and `:541406` is the native-installer symlink removal
log. The real anchors are:

| Anchor | 220 | 193 |
|---|---|---|
| `assertDirChainReal` | **2** (`:51994`, `:51995`) | **0** |
| `Refusing to write under symlinked or non-directory path` | **1** (`:52005`) | **0** |
| `Refusing to write into symlinked directory` | 2 | 2 (carryover) |
| `Refusing to write through symlink` | 4 | 4 (carryover) |

So the *atomic writer's* symlink guards are carryover; a **new, stronger** guard was added and the two
write paths were re-routed through the atomic writer.

### 6.2 `assertDirChainReal` — the new guard

```javascript
// ============================================
// assertDirChainReal - O_NOFOLLOW walk of every path component from base to dir
// Location: cli_inner_pretty.js:51990-52010
// ============================================

// ORIGINAL (for source lookup):
async function jGn(e, t) {
  let r = Td.relative(e, t);
  if (r === "" || r.startsWith("..") || Td.isAbsolute(r))
    throw new Lr(
      `assertDirChainReal: dir must be strictly inside base (rel: ${r})`,
      "assertDirChainReal: dir must be strictly inside base",
    );
  let n = e;
  for (let o of r.split(Td.sep)) {
    n = Td.join(n, o);
    try {
      await (await A8.open(n, ap.constants.O_RDONLY | ap.constants.O_DIRECTORY | ap.constants.O_NOFOLLOW)).close();
    } catch (i) {
      let s = Bt(i);
      if (s === "ELOOP" || s === "ENOTDIR")
        throw new que(`Refusing to write under symlinked or non-directory path: ${n}`);
      if (s === "ENOENT") return;
      throw i;
    }
  }
}

// READABLE (for understanding):
async function assertDirChainReal(baseDir, targetDir) {
  let rel = path.relative(baseDir, targetDir);
  if (rel === "" || rel.startsWith("..") || path.isAbsolute(rel))
    throw new InternalError("assertDirChainReal: dir must be strictly inside base (rel: " + rel + ")",
                            "assertDirChainReal: dir must be strictly inside base");
  let walked = baseDir;
  for (let component of rel.split(path.sep)) {
    walked = path.join(walked, component);
    try {
      let fh = await fsp.open(walked, O_RDONLY | O_DIRECTORY | O_NOFOLLOW);
      await fh.close();                       // opened successfully => real directory, not a symlink
    } catch (err) {
      let code = errnoOf(err);
      if (code === "ELOOP" || code === "ENOTDIR")
        throw new SecurityError(`Refusing to write under symlinked or non-directory path: ${walked}`);
      if (code === "ENOENT") return;          // doesn't exist yet -> mkdir will create it for real
      throw err;
    }
  }
}

// Mapping: jGn→assertDirChainReal, Td→path, A8→fs.promises, ap→fs, Bt→errnoOf,
//          Lr→InternalError, que→SecurityError
```

### 6.3 Why the pre-existing guard was insufficient

The atomic writer `eDi`/`X5` (`:52256-…`, `:52398`) already had two symlink defences, both carryover:

- `checkParentDir` (`:52269-52278`): opens **`path.dirname(file)`** with `O_NOFOLLOW`, throwing on
  `ELOOP`/`ENOTDIR`.
- an `lstat` on the file itself (`:52280-52284`), refusing to write *through* a symlinked file.

**The gap.** `checkParentDir` checks **one** level. For `‹project›/.claude/workflows/foo.js` the immediate
parent is `workflows`; a symlink planted at `.claude` — the *grandparent* — is never examined. `O_NOFOLLOW`
only refuses to follow a symlink at the **final** component of the path it is given, so opening
`‹project›/.claude/workflows` happily traverses a symlinked `.claude` and succeeds. That is exactly the
attack the bullet names: *"a symlink at `.claude`"*.

`assertDirChainReal` closes it by opening **every** component in turn with `O_NOFOLLOW`, so a symlink
anywhere between the base and the target trips `ELOOP` on that component.

**Three design details worth stating.**
1. **`ENOENT` returns success, it does not throw.** The chain legitimately may not exist yet — the caller's
   next statement is `mkdir(..., { recursive: true })`. Returning early is safe because a component that
   does not exist cannot be a symlink, and `mkdir` creates real directories. The residual race (an
   attacker creating a symlink between the check and the `mkdir`) is narrowed but not eliminated; the
   `checkParentDir` re-check inside the atomic write is what closes the second half of the window.
2. **`rel === ""` is an error, not a no-op.** Calling with `base === target` means the caller mis-derived
   its base and would check nothing. Failing loudly on a mis-wired call is the right choice for a security
   primitive.
3. **The error type is distinct** (`que` vs `Lr`): a programmer error and a security refusal are different
   classes, so a caller can surface one to the user and report the other.

### 6.4 The two call sites

```javascript
// ============================================
// saveWorkflowScript - project-scope saves get the chain walk + an atomic write
// Location: cli_inner_pretty.js:728199-728218
// ============================================

// ORIGINAL (for source lookup):
async function oVa(e) {
  let t = fbe(e.name),
    r = WSS(e.scope, e.cwd),
    n = $vt.join(r, `${t}.js`),
    o = e.scope !== "user" && !I0t($vt.dirname(r));
  if (o)
    try {
      await jGn($vt.dirname($vt.dirname(r)), r);
    } catch (a) {
      throw (pe("workflow_save", "write_failed"), a);
    }
  await tii.mkdir(r, { recursive: !0, mode: 448 });
  try {
    if (e.overwrite) await X5(n, e.script, { encoding: "utf8", mode: 384, checkParentDir: o });
    else await tii.writeFile(n, e.script, { encoding: "utf8", mode: 384, flag: "wx" });
  } catch (a) { ... }

// READABLE (for understanding):
async function saveWorkflowScript(req) {
  let name = slugifyWorkflowName(req.name),
    dir = resolveWorkflowsDir(req.scope, req.cwd),                 // :728191-728198
    file = path.join(dir, `${name}.js`),
    needsSymlinkGuard = req.scope !== "user" && !isClaudeConfigDir(path.dirname(dir));
  if (needsSymlinkGuard)
    try {
      await assertDirChainReal(path.dirname(path.dirname(dir)), dir);   // base = parent of `.claude`
    } catch (e) { recordFailure("workflow_save", "write_failed"); throw e; }
  await fsp.mkdir(dir, { recursive: true, mode: 0o700 });
  try {
    if (req.overwrite) await atomicWriteFile(file, req.script, { encoding: "utf8", mode: 0o600, checkParentDir: needsSymlinkGuard });
    else await fsp.writeFile(file, req.script, { encoding: "utf8", mode: 0o600, flag: "wx" });
  } catch (e) { ... }

// Mapping: oVa→saveWorkflowScript, WSS→resolveWorkflowsDir, I0t→isClaudeConfigDir (:14682),
//          jGn→assertDirChainReal, X5→atomicWriteFile (:52398), fbe→slugifyWorkflowName,
//          tii→fs.promises, $vt→path, 448→0o700, 384→0o600
```

The 2.1.193 equivalent, `M2l` at `:541712-541735 (193)`, is:

```javascript
await Ner.mkdir(n, { recursive: !0, mode: 448 });
await Ner.writeFile(r, e.script, { encoding: "utf8", mode: 384, flag: e.overwrite ? "w" : "wx" });
```

— no guard, no atomic write, and `flag: "w"` on overwrite, which happily writes *through* a symlinked
target file.

The scheduled-task half is symmetrical:

```javascript
// ============================================
// writeScheduledTasks - the same guard for .claude/scheduled_tasks.json
// Location: cli_inner_pretty.js:230132-230145
// ============================================

// ORIGINAL (for source lookup):
async function G7r(e, t) {
  let r = t ?? Rl(),
    n = !I0t(VDt.join(r, ".claude"));
  if (n) await jGn(r, VDt.join(r, ".claude"));
  await xDu.mkdir(VDt.join(r, ".claude"), { recursive: !0 });
  let o = { tasks: e.map(({ durable: i, ...s }) => s) };
  await X5(BVe(r), Ie(o, null, 2) + `\n`, {
    encoding: "utf-8", allowSymlink: !n, checkParentDir: n, stagingDir: VDt.join(r, ".claude", Uye),
  });
}

// READABLE (for understanding):
async function writeScheduledTasks(tasks, cwdOverride) {
  let root = cwdOverride ?? getProjectRoot(),
    isProjectScope = !isClaudeConfigDir(path.join(root, ".claude"));
  if (isProjectScope) await assertDirChainReal(root, path.join(root, ".claude"));
  await fsp.mkdir(path.join(root, ".claude"), { recursive: true });
  let payload = { tasks: tasks.map(({ durable, ...rest }) => rest) };
  await atomicWriteFile(scheduledTasksPath(root), JSON.stringify(payload, null, 2) + "\n", {
    encoding: "utf-8",
    allowSymlink: !isProjectScope,      // the user config dir MAY legitimately be a symlink
    checkParentDir: isProjectScope,
    stagingDir: path.join(root, ".claude", STAGING_SUBDIR),
  });
}

// Mapping: G7r→writeScheduledTasks, jGn→assertDirChainReal, I0t→isClaudeConfigDir,
//          X5→atomicWriteFile, BVe→scheduledTasksPath, Ie→JSON.stringify, Uye→STAGING_SUBDIR
```

193's `TBt` (`:228541-228552 (193)`) is `mkdir` + plain `writeFile("utf-8")` — no guard, no atomicity.

### Why the guard is skipped for the user config dir

Both call sites compute the same condition: *is the `.claude` in question the user's config dir?*
(`I0t`, `:14682-14686`, which compares both the resolved path and a `realpath`-of-parent + basename form).
If it is, the guard is skipped and `allowSymlink: true` is passed.

**Rationale.** Symlinking `~/.claude` into a dotfiles repo or an encrypted volume is a *supported,
intentional* configuration — `CLAUDE_CONFIG_DIR` exists precisely to relocate it. The threat model is a
**repository-committed** symlink: a hostile repo ships `.claude -> /etc` or `.claude -> ../../victim`, and
merely opening it and saving a workflow writes outside the project. That threat only exists for
project-scope paths, where the directory is attacker-controlled content. Applying the guard to the user
config dir would break a legitimate setup to defend against a threat that does not exist there — the user
symlinked their own config on purpose.

**Key insight.** The `!I0t(...)` test is the boundary between "path the user configured" and "path the
repository supplied". Every security decision in these two functions — the chain walk, `allowSymlink`,
`checkParentDir` — flips on that single predicate. Compare `:224564`'s worktree guard, whose error string
names the same three-component attack surface (*"a repository-committed symlink at `.claude`,
`.claude/worktrees`, or `.claude/worktrees/<name>`"*): same threat model, independently defended.

---

## 7. `.202` `/workflows` agent list layout — and two left-arrow bullets that are carryover

### 7.1 The layout change is real and fully anchored

> *"Improved `/workflows` agent list layout: wider titles, a dedicated time column, shorter model names,
> and no per-row tool-call counts."*

All four sub-claims land in one rewritten pair of functions.

```javascript
// ============================================
// buildAgentRowCells - the {model, stats, time} triple that replaced {model, stats}
// Location: cli_inner_pretty.js:728539-728556
// ============================================

// ORIGINAL (for source lookup):
function gvS(e, t) {
  let r = cPe(e, t),
    n = TTr(e.fallbackModel ?? e.model, void 0),
    o = [];
  if (e.isolation != null) o.push(e.isolation);
  if (e.tokens != null) o.push(`${wa(e.tokens)} tok`);
  if (r === "running" && e.lastProgressAt != null) {
    let s = Math.floor((Date.now() - e.lastProgressAt) / 1000);
    if (s >= 30) o.push(`idle ${ra(s * 1000)}`);
  }
  if (r === "queued") o.push("queued");
  if (r === "interrupted") o.push("stopped");
  if (r === "skipped") o.push("skipped");
  if (r === "blocked") o.push("blocked");
  if (r === "failed") o.push("failed");
  let i = e.durationMs ?? (r === "running" && e.startedAt != null ? Math.max(0, Date.now() - e.startedAt) : void 0);
  return { model: n, stats: o.join(" \xB7 "), time: i != null ? Fst(i) : "" };
}

// READABLE (for understanding):
function buildAgentRowCells(agent, workflowActive) {
  let status = deriveAgentStatus(agent, workflowActive),
    model = formatModelPair(agent.fallbackModel ?? agent.model, undefined),   // single name, no arrow
    stats = [];
  if (agent.isolation != null) stats.push(agent.isolation);
  if (agent.tokens != null) stats.push(`${formatCompactCount(agent.tokens)} tok`);
  if (status === "running" && agent.lastProgressAt != null) {
    let idleSec = Math.floor((Date.now() - agent.lastProgressAt) / 1000);
    if (idleSec >= 30) stats.push(`idle ${formatDuration(idleSec * 1000)}`);
  }
  if (status === "queued")      stats.push("queued");
  if (status === "interrupted") stats.push("stopped");
  if (status === "skipped")     stats.push("skipped");
  if (status === "blocked")     stats.push("blocked");
  if (status === "failed")      stats.push("failed");
  let elapsedMs = agent.durationMs
    ?? (status === "running" && agent.startedAt != null ? Math.max(0, Date.now() - agent.startedAt) : undefined);
  return { model, stats: stats.join(" · "), time: elapsedMs != null ? formatCompactDuration(elapsedMs) : "" };
}

// Mapping: gvS→buildAgentRowCells, cPe→deriveAgentStatus (:728502), TTr→formatModelPair (:650468),
//          Fst→formatCompactDuration (:160497), wa→formatCompactCount, ra→formatDuration
```

Against 2.1.193's `VRf` (`:542006-542026 (193)`):

| Claim | 2.1.193 | 2.1.220 |
|---|---|---|
| tool-call counts | `if (e.toolCalls != null && e.toolCalls > 0) o.push(\`${e.toolCalls} ${bn(e.toolCalls,"tool")}\`)` — `:542012 (193)` | **gone** |
| duration | `o.push(Gi(e.durationMs))` inside the stats string, only when already finished — `:542013 (193)` | third return field `time`, and it covers the **running** case via `Date.now() - startedAt` |
| model | `kqt(e.model, e.fallbackModel, { compact: !0 })` → renders `"→ Haiku 4.5"` (arrow + fallback) — `:542008 (193)` | `TTr(e.fallbackModel ?? e.model, void 0)` → renders `"Haiku 4.5"` (the effective model, no arrow) |
| `blocked` state | absent | `if (r === "blocked") o.push("blocked")` — new |
| `failed` detail | `failed: ${error}` (unbounded error text) — `:542021-542024 (193)` | plain `"failed"` |
| return shape | `{ model, stats }` | `{ model, stats, time }` |

The layout function was rewritten to match:

```javascript
// ============================================
// layoutAgentRowSegments - 5 segments with a right-aligned fixed-width time column
// Location: cli_inner_pretty.js:728557-728581
// ============================================

// ORIGINAL (for source lookup):
function Q9a(e, t, r, n) {
  if (t <= 0) return [];
  let { model: o, stats: i, time: s } = gvS(e, n),
    a = r ? "permission" : void 0,
    l = !r,
    c = (_, E) => (E <= 0 ? "" : gi(_, E)),
    u = s ? c(s, t).padStart(Math.min(lNf, t)) : "",
    d = u ? t - Ft(u) - 1 : t,
    p = (_, E) => (_ && E ? 3 : 0),
    f = o, m = i;
  if (Ft(f) + p(f, m) + Ft(m) > d) {
    if (((m = c(m, d - Ft(f) - p(f, m))), Ft(f) + p(f, m) + Ft(m) > d)) f = c(f, d - Ft(m) - p(f, m));
  }
  let g = f && m ? " \xB7 " : "",
    y = Math.max(0, t - Ft(f) - Ft(g) - Ft(m) - Ft(u));
  return [
    { text: f, color: a, dimColor: l }, { text: g, color: a, dimColor: l }, { text: m, color: a, dimColor: l },
    { text: " ".repeat(y) }, { text: u, color: a, dimColor: l },
  ];
}

// READABLE (for understanding):
function layoutAgentRowSegments(agent, width, isSelected, workflowActive) {
  if (width <= 0) return [];
  let { model, stats, time } = buildAgentRowCells(agent, workflowActive),
    color = isSelected ? "permission" : undefined,
    dim = !isSelected,
    truncate = (s, w) => (w <= 0 ? "" : truncateToWidth(s, w)),
    timeCell = time ? truncate(time, width).padStart(Math.min(TIME_COL_WIDTH, width)) : "",   // right-aligned
    bodyWidth = timeCell ? width - displayWidth(timeCell) - 1 : width,
    sepWidth = (a, b) => (a && b ? 3 : 0),                                                    // " · "
    modelCell = model, statsCell = stats;
  if (displayWidth(modelCell) + sepWidth(modelCell, statsCell) + displayWidth(statsCell) > bodyWidth) {
    statsCell = truncate(statsCell, bodyWidth - displayWidth(modelCell) - sepWidth(modelCell, statsCell));
    if (displayWidth(modelCell) + sepWidth(modelCell, statsCell) + displayWidth(statsCell) > bodyWidth)
      modelCell = truncate(modelCell, bodyWidth - displayWidth(statsCell) - sepWidth(modelCell, statsCell));
  }
  let sep = modelCell && statsCell ? " · " : "",
    pad = Math.max(0, width - displayWidth(modelCell) - displayWidth(sep) - displayWidth(statsCell) - displayWidth(timeCell));
  return [
    { text: modelCell, color, dimColor: dim },
    { text: sep,       color, dimColor: dim },
    { text: statsCell, color, dimColor: dim },
    { text: " ".repeat(pad) },
    { text: timeCell,  color, dimColor: dim },
  ];
}

// Mapping: Q9a→layoutAgentRowSegments, gvS→buildAgentRowCells, gi→truncateToWidth, Ft→displayWidth,
//          lNf→TIME_COL_WIDTH (=6, :729794)
```

193's `F2l` (`:542027-542041 (193)`) returns three segments — `[model, filler, stats]` — with the stats
right-aligned and no time cell.

```javascript
// ============================================
// computeAgentTitleColumnWidth - the "wider titles" helper (220-only)
// Location: cli_inner_pretty.js:728581-728585
// ============================================

// ORIGINAL (for source lookup):
function qii(e, t) {
  let r = Math.min(yvS, Math.max(22, t - _vS), Math.max(4, Math.min(t, Math.max(12, t - lNf - 1)))),
    n = e.reduce((o, i) => Math.max(o, Ft(i.label)), 0);
  return Math.min(Math.max(12, n), r);
}

// READABLE (for understanding):
function computeAgentTitleColumnWidth(agents, availableWidth) {
  let ceiling = Math.min(
      MAX_TITLE_COL,                                         // 40
      Math.max(22, availableWidth - MIN_STATS_COL),          // leave 30 for model+stats, floor 22
      Math.max(4, Math.min(availableWidth, Math.max(12, availableWidth - TIME_COL_WIDTH - 1))),
    ),
    longestLabel = agents.reduce((m, a) => Math.max(m, displayWidth(a.label)), 0);
  return Math.min(Math.max(12, longestLabel), ceiling);       // grow to content, clamp to ceiling
}

// Mapping: qii→computeAgentTitleColumnWidth, yvS→MAX_TITLE_COL (=40, :729795),
//          _vS→MIN_STATS_COL (=30, :729796), lNf→TIME_COL_WIDTH (=6)
```

`grep -c 'Math.max(12, n), r'` is **220=1 / 193=0**. Callers: `:728705` (`qii(Fvt, TF - 5)`) and `:728986`
(`qii(eGe, Bvt - 4)`).

### Why `TIME_COL_WIDTH = 6`, and why the title width is content-driven with a 40 ceiling

**What it does.** Reserves a fixed right-hand column for elapsed time and lets the title column grow to
fit the longest agent label, up to 40 columns.

**How it works.** `formatCompactDuration` (`Fst`, `:160497-160505`) is a four-tier formatter:

```
t < 60s        -> "59s"      (3)
t < 60m        -> "9m59s"    (5)
t < 24h        -> "23h59m"   (6)   <- the maximum
otherwise      -> "9d23h"    (5)
```

The widest output any realistic duration can produce is `23h59m` = **6 characters**. `lNf = 6` is exactly
that bound, and `padStart(Math.min(lNf, width))` right-aligns within it, so times line up in a column
regardless of magnitude — `59s`, `9m01s` and `23h59m` all end at the same x. This is why the column can be
"dedicated" rather than merely "last": its width is a proven upper bound, not a guess.

**Why the title ceiling is 40 and the floor 12.** `Math.max(12, longestLabel)` grows the column to the
content — the "wider titles" improvement over 193's hard `Math.min(30, …)` clamp
(`:543028 (193)`, still present in the carryover detail-view path at `:729578`). The three clamps in
`ceiling` then guarantee, in order: never wider than 40 (`MAX_TITLE_COL`); leave at least 30 columns for
model+stats but never squeeze the title below 22; and never let the title plus the 6-wide time column plus
one separator exceed the available width. On a narrow terminal the third clamp dominates; on a wide one
the 40-column cap does, so titles do not stretch into unreadably-wide lines.

**Why remove per-row tool-call counts.** The row now has four competing pieces of data (model, isolation,
tokens, time) plus a right-aligned time column. Tool-call counts are the least actionable of them — the
phase header already carries `done/total`, the workflow header carries aggregate `totalToolCalls`, and a
per-agent tool count does not tell a user whether to intervene. Dropping it buys the width the time column
needs. The `stats` truncation order confirms the priority: `stats` is truncated **before** `model`
(`:728569-728572`), so the model name survives a narrow terminal and the token/isolation detail is what
gets cut.

**Why `TTr(fallbackModel ?? model, undefined)` rather than the model pair.** In 193 an agent that fell
back to a cheaper model rendered `→ Haiku 4.5` — the arrow told you a fallback happened but cost 2
columns and did not name the original (because `compact: true` suppressed it). 220 renders the *effective*
model only. The arrow form still exists in `TTr` (`t != null` branch, `:650470`) and is used elsewhere;
this call site just stopped asking for it. `mb` (`:111291-111298`) supplies the short display name and
returns `undefined` on Foundry, in which case `TTr` falls back to the raw id.

### 7.2 The two left-arrow bullets: workflow-side code is byte-identical carryover

> `.203`: *"Changed left arrow to no longer close the background tasks, diff, and workflow detail views —
> press Esc instead."*
> `.206`: *"Fixed left arrow not stepping back out of a phase or agent in the workflow detail view."*

The scoping files anchor both to `tengu_left_arrow_editing_guard` (`:559928`, 220=1 / 193=0). **That gate
is not in the workflow detail view.** It sits in the **prompt-input** key handler (`Ne(Me, ze)`,
`:559918-…`), inside the branch `if (i && !Me.shift && W.text === "")` — the *empty-prompt* left-arrow
that returns to the agent view, driving a four-state machine (`fire` / `arm` / `absorb` / `attach-arm`,
`Nyp` at `:559650-559662`, committed by `Fyp` at `:559664-559683`, with `UXs = 3000` /
`Oyp = 1000` / `GV_ = 150`). That is `48_accessibility_ui`'s `.219` bullet 14, not a workflow bullet.

The workflow detail view's own navigation is **carryover**:

| Element | 2.1.220 | 2.1.193 | Verdict |
|---|---|---|---|
| step-out ladder `agent → agents → phases → onBack ?? onClose` | `de()` `:729536-729547` | `le()` `:542986-542997 (193)` | identical |
| `left` → step-out | `:729625` `else if (Dt.key === "left") (Dt.preventDefault(), de());` | `:543075 (193)` `else if (Ke.key === "left") (Ke.preventDefault(), le());` | identical |
| Esc → step-out | `onCancel: de` `:729687` | `onCancel: le` `:543140 (193)` | identical |
| detail-view column math | `:729576-729581`, `:729644-729664` | `:543026-543031`, `:543094-543114 (193)` | identical |
| keyboard host wrapper | `Zl` (`:654325-654343`) with `flexDirection:"column"`, `tabIndex:0`, `autoFocus:true` | inline `B` with the same three props, `:543131-543135 (193)` | refactor only, same semantics |

So: at the `phases` level, left arrow **still** closes the view in 2.1.220 (`if (r) r(); else t();`,
`:729545-729546`) — which is what `.203` said it would stop doing, *for this component*. Two readings
are consistent with the evidence:

1. `.203`/`.206` changed the **host** view (the background-tasks / agents list that owns the left-arrow
   before it reaches the detail view), not the detail view, and the detail view's own handler was always
   correct; or
2. `.203` changed something and `.206` reverted it, netting to the 193 shape.

I could not distinguish these from the two bundles, and I will not guess. **Recorded as
CARRYOVER-in-component / delta-elsewhere, with the scoping anchor marked as a mis-anchor.** The honest
statement is: *no workflow-detail-view left-arrow code differs between 2.1.193 and 2.1.220.*

---

## 8. `.205` — the `--json-schema` validator: size caps, `validateFormats: false`, and the hard exit

> Bullet `.205` #2: *"Fixed `--json-schema` rejecting valid schemas and silently running unstructured;
> the `format` keyword is no longer mishandled."* This section is the **owning** write-up. It was
> previously routed to `51_headless_sdk` by this module's ledger and routed back here by that module's —
> cycle **C9** in [`../00_overview/_xval_contradictions.md`](../00_overview/_xval_contradictions.md) §2.
> Ownership is now settled here, and §8.1 explains why that is the *correct* home, not merely a
> tie-break.

### 8.1 Why this bullet belongs to `42_workflow`

The obvious reading is that `--json-schema` is a headless-SDK flag, so `51_headless_sdk` should own it.
That reading is wrong for one concrete reason: **the CLI flag is one of three consumers of the same
validator, and one of the other two is the Workflow tool's `agent({ schema })` option.**

`wir` — the memoised entry point — has exactly three call sites in 2.1.220:

- `:829660` — the `--json-schema` CLI flag (headless / background only).
- `:846060` — the SDK `initialize` tool-list builder.
- `:387454` — **inside the workflow agent dispatcher**, `let It = wir(ve.schema);` where `ve` is the
  `opts` object of a workflow script's `agent({ ..., schema })` call.

And that third call site is **byte-identical carryover**: `agent({schema}) received an invalid JSON
Schema` counts **220=1 / 193=1**, and the 193 shape at `:423674-423676 (193)` is the same three lines
against the same memo wrapper (`eat` → `wir`). So the workflow path inherited the entire `.205` fix
without a single workflow-side line changing — which is precisely the kind of delta that goes missing
when a bullet is filed under the flag that names it. A workflow script that wrote
`agent({ schema: { type: "object", properties: { ts: { type: "string", format: "date-time" } } } })`
threw a `TypeError` on every run in 2.1.193 and runs fine in 2.1.220.

The second reason is `:387247`, the *other* `schema too large` in the bundle (§8.6). It is a
workflow-only guard in the auto-mode safety classifier, net-new in this window, and documented nowhere
else.

### 8.2 The three defects behind one bullet

The bullet reads as one fix; the code shows three independent changes, all inside `fty`
(`:231103-231141`), whose 193 ancestor `qVd` (`:229472-229494 (193)`) is 23 lines against 39:

| # | Defect | 2.1.193 | 2.1.220 | Anchor |
|---|---|---|---|---|
| a | `format` keyword made `compile()` **throw**, so the whole schema was declared invalid | `new Ajv({ allErrors: !0 })` — `validateFormats` defaults to `true` | `validateFormats: !1` | `:231106` vs `:229474 (193)` |
| b | An invalid schema was swallowed: telemetry fired, the session ran **unstructured** | `else V("tengu_structured_output_failure", …)` and fall through | telemetry **then** `fm("Error: --json-schema is not a valid JSON Schema: …")` → exit 1 | `:829680-829684` vs `:713209 (193)` |
| c | No bound on schema size; a pathological schema went straight into Ajv codegen | absent | recursion/size walker with a node budget and a depth cap | `:231097-231105`, `:231148-231149` |

Verified counts (both bundles, `grep -cF`): `schema too large` **220=2 / 193=0** ·
`strictInputJSONSchema` **220=3 / 193=0** · `root_not_object` **220=1 / 193=0** ·
`unsupported_keyword` **220=5 / 193=0** · `tengu_structured_output_strict_schema` **220=1 / 193=0** ·
`Init JSON schema rejected, structured output disabled` **220=1 / 193=0** ·
`is not strict-compatible` **220=1 / 193=0** · `agent({schema}) received an invalid JSON Schema`
**220=1 / 193=1** (carryover, see §8.1).

### 8.3 The validator itself

```javascript
// ============================================
// compileStructuredOutputSchema - Validate a user JSON Schema and build the StructuredOutput tool from it
// Location: cli_inner_pretty.js:231091-231149
// ============================================

// ORIGINAL (for source lookup):
function wir(e) {
  let t = aPu.get(e);
  if (t) return t;
  let r = fty(e);
  return (aPu.set(e, r), r);
}
function uPu(e, t, r) {
  if (--t.n < 0 || r > pty) return !0;
  if (typeof e !== "object" || e === null) return !1;
  for (let n of Object.values(e)) if (uPu(n, t, r + 1)) return !0;
  return !1;
}
function fty(e) {
  try {
    if (uPu(e, { n: dty }, 0)) return { error: "schema too large" };
    let t = new lPu.Ajv({ allErrors: !0, validateFormats: !1 });
    if (!t.validateSchema(e)) return { error: t.errorsText(t.errors) };
    let n = t.compile(e),
      o;
    try {
      let i = Bpo(e);
      if (i.ok) o = i.schema;
      O("tengu_structured_output_strict_schema", {
        outcome: i.ok ? Ee("converted") : Ee("fallback"),
        reason: i.ok ? void 0 : fe(i.reason),
      });
    } catch (i) {
      w(
        `Strict structured-output schema derivation failed, falling back to non-strict: ${i instanceof Error ? i.message : String(i)}`,
        { level: "error" },
      );
    }
    return {
      tool: {
        ...Ous,
        inputJSONSchema: e,
        ...(o && { strictInputJSONSchema: o }),
        async call(i) {
          if (!n(i)) {
            let a = n.errors?.map((c) => `${c.instancePath || "root"}: ${c.message}`).join(", "),
              l = n.errors?.map((c) => c.keyword).join(",");
            throw new Lr(`Output does not match required schema: ${a}`, `StructuredOutput schema mismatch: ${l ?? ""}`);
          }
          return { data: "Structured output provided successfully", structured_output: i, endsTurn: !0 };
        },
      },
    };
  } catch (t) {
    return { error: t instanceof Error ? t.message : String(t) };
  }
}
var lPu, cty, uty, Eg = "StructuredOutput", Ous, aPu, dty = 1e5, pty = 1e4;

// READABLE (for understanding):
function getOrCompileStructuredOutputTool(userSchema) {                  // memoised by identity
  let cached = structuredOutputToolCache.get(userSchema);                // WeakMap, :231206
  if (cached) return cached;
  let built = compileStructuredOutputSchema(userSchema);
  structuredOutputToolCache.set(userSchema, built);
  return built;
}

// Shared mutable node budget, per-path depth. Returns true == "reject, too large".
function schemaExceedsSizeBudget(node, budget, depth) {
  if (--budget.remaining < 0 || depth > MAX_SCHEMA_DEPTH) return true;
  if (typeof node !== "object" || node === null) return false;           // scalars are free
  for (let child of Object.values(node))                                 // arrays included
    if (schemaExceedsSizeBudget(child, budget, depth + 1)) return true;
  return false;
}

function compileStructuredOutputSchema(userSchema) {
  try {
    // (1) cheapest gate first: bound the input before any allocation or codegen
    if (schemaExceedsSizeBudget(userSchema, { remaining: MAX_SCHEMA_NODES }, 0))
      return { error: "schema too large" };

    // (2) meta-schema validation stays ON; `format` assertion is turned OFF (see 8.5)
    let ajv = new AjvModule.Ajv({ allErrors: true, validateFormats: false });
    if (!ajv.validateSchema(userSchema)) return { error: ajv.errorsText(ajv.errors) };
    let validate = ajv.compile(userSchema);

    // (3) best-effort derivation of an API-strict schema; never fatal
    let strictSchema;
    try {
      let converted = deriveStrictSchema(userSchema);
      if (converted.ok) strictSchema = converted.schema;
      logEvent("tengu_structured_output_strict_schema", {
        outcome: converted.ok ? redact("converted") : redact("fallback"),
        reason: converted.ok ? undefined : redactReason(converted.reason),
      });
    } catch (err) {
      logMessage(`Strict structured-output schema derivation failed, falling back to non-strict: ${…}`,
                 { level: "error" });
    }

    return {
      tool: {
        ...STRUCTURED_OUTPUT_TOOL,                                       // Ous, :231161-231205
        inputJSONSchema: userSchema,                                     // the ORIGINAL travels to the API
        ...(strictSchema && { strictInputJSONSchema: strictSchema }),
        async call(modelOutput) {
          if (!validate(modelOutput)) {
            let detail  = validate.errors?.map((e) => `${e.instancePath || "root"}: ${e.message}`).join(", "),
                keywords = validate.errors?.map((e) => e.keyword).join(",");
            throw new ToolError(`Output does not match required schema: ${detail}`,
                                `StructuredOutput schema mismatch: ${keywords ?? ""}`);
          }
          return { data: "Structured output provided successfully", structured_output: modelOutput, endsTurn: true };
        },
      },
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}
var AjvModule, …, STRUCTURED_OUTPUT_TOOL_NAME = "StructuredOutput", STRUCTURED_OUTPUT_TOOL,
    structuredOutputToolCache, MAX_SCHEMA_NODES = 100000, MAX_SCHEMA_DEPTH = 10000;

// Mapping: wir→getOrCompileStructuredOutputTool, uPu→schemaExceedsSizeBudget,
//          fty→compileStructuredOutputSchema, Bpo→deriveStrictSchema, Ous→STRUCTURED_OUTPUT_TOOL,
//          aPu→structuredOutputToolCache, dty→MAX_SCHEMA_NODES, pty→MAX_SCHEMA_DEPTH,
//          lPu→AjvModule, Lr→ToolError, O→logEvent, w→logMessage, Ee/fe→redact*, e→userSchema
```

The 2.1.193 ancestor, for the diff that matters:

```javascript
// ============================================
// compileStructuredOutputSchema (2.1.193 ancestor) - the pre-fix validator
// Location: cli_inner_pretty.js:229472-229476 (193)
// ============================================

// ORIGINAL (for source lookup):
function qVd(e) {
  try {
    let t = new XYi.Ajv({ allErrors: !0 });
    if (!t.validateSchema(e)) return { error: t.errorsText(t.errors) };
    let r = t.compile(e);
    ...

// READABLE (for understanding):
function compileStructuredOutputSchema_v193(userSchema) {
  try {
    let ajv = new AjvModule.Ajv({ allErrors: true });   // validateFormats defaults to TRUE
    if (!ajv.validateSchema(userSchema)) return { error: ajv.errorsText(ajv.errors) };
    let validate = ajv.compile(userSchema);             // <-- THROWS on any unknown `format`
    ...

// Mapping: qVd→compileStructuredOutputSchema_v193, XYi→AjvModule, e→userSchema, t→ajv, r→validate
```

Three lines are the whole `format` fix: `{ allErrors: !0 }` → `{ allErrors: !0, validateFormats: !1 }`,
plus the size guard above it and the strict derivation below it.

### 8.4 The size walker `uPu` — what it traverses, what it rejects, and why a schema needs a cap

**What it does:** Bounds a user-supplied JSON Schema by *total node count* and *nesting depth* before
Ajv is allowed to see it. It is the first statement in `fty` and the only guard that runs before any
allocation.

**How it works:**

1. `uPu(schema, { n: dty }, 0)` is seeded with a **mutable box** `{ n: 100000 }` and depth `0`. The box
   is the important detail: because the same object is threaded through every recursive call,
   `--t.n` decrements a *single shared counter* across the entire traversal. A per-call integer would
   have given each branch its own 100k budget and the cap would have been meaningless for a wide schema.
   Depth, by contrast, is a plain `r + 1` parameter, so it is correctly **per path**.
2. `if (--t.n < 0 || r > pty) return !0` — a truthy return means *reject*. Note the decrement happens on
   entry for every value visited, scalars included, so the budget counts JSON nodes, not just objects.
3. `if (typeof e !== "object" || e === null) return !1` — scalars terminate a branch. `typeof null` is
   `"object"` in JS, hence the explicit null test.
4. `for (let n of Object.values(e))` — this is a **schema-agnostic JSON walk**, not a schema walk.
   `Object.values` on an array yields its elements, so `enum` lists, `anyOf` arrays, `examples`,
   `default` payloads and completely unknown vendor keywords are all counted. Nothing is rejected on
   *content*; the only failure modes are budget exhaustion and depth overflow.

**Why this approach — why a schema needs a size cap at all.** Three distinct hazards, and the cap is the
only thing standing in front of all three:

1. **`ajv.compile()` is a code generator, not a checker.** Ajv v8 emits JavaScript source proportional
   to the schema and hands it to `new Function`. A schema with a hundred thousand nodes becomes
   megabytes of generated source compiled synchronously on the main thread of an interactive CLI. The
   input here is a command-line argument (`--json-schema`, `:851014`) or a line of a workflow script —
   in a CI/headless context that is close to untrusted input, and the failure mode is a hang, not an
   error.
2. **The schema is re-transmitted on every single request.** `fty` stores the original as
   `inputJSONSchema` (`:231126`), which the tool→API payload builder reads at `:508168` and ships as
   `input_schema`. An oversized schema is therefore a permanent per-turn token tax for the life of the
   session. Failing at startup costs one error message; accepting it costs the user's whole budget.
3. **The depth cap is a stack guard.** `uPu` itself recurses, and so does Ajv's compiler. Node's default
   stack blows somewhere around 10–12k frames, so `pty = 1e4` fires *just before* the engine would throw
   `RangeError: Maximum call stack size exceeded`. That RangeError would still be caught — by the outer
   `catch` at `:231138` — but it would surface to the user as an engine message with no relationship to
   schemas. Setting the guard immediately under the engine's own limit means the user always sees
   `schema too large`.

**Why these numbers.** `1e5` nodes and `1e4` depth are not tuned thresholds, they are catastrophe
fences: a realistic structured-output schema is tens to low hundreds of nodes and single-digit depth, so
the caps are three orders of magnitude clear of legitimate use in both dimensions. The asymmetry
(nodes ≫ depth) tracks the two hazards — nodes bound *codegen size and tokens*, depth bounds *stack
frames* — and each is set against its own limit rather than against a common notion of "reasonable".
Contrast the strict converter's depth of **32** (§8.5), which is a semantic limit rather than a safety
one; the two coexist deliberately.

**Key insight:** the ordering is the design. The cheapest, most conservative check runs first, and it is
the *only* check capable of protecting the expensive ones. Everything after it — `new Ajv`,
`validateSchema`, `compile`, `Bpo` — operates on input already proven bounded, which is why none of them
need their own guards. And because `wir` memoises the whole result in a `WeakMap` keyed by the schema
object (`aPu`, `:231206`), a workflow that dispatches the same `agent({ schema })` fifty times pays for
one walk and one compile.

### 8.5 `validateFormats: false` — why a CLI turns format validation *off*

**What it does:** Instructs Ajv to skip the `format` keyword entirely — neither compiling an assertion
for it nor complaining that it does not recognise the format name.

**How it works.** Ajv's option default is `true` (`:40945`,
`validateFormats: (I = e.validateFormats) !== null && I !== void 0 ? I : !0`). With it on, the `format`
keyword's code generator runs (`:42492`) and looks up `d.formats[name]` — the **instance's** registered
format table. Ajv v8 ships that table **empty**; the implementations live in the separate `ajv-formats`
package, applied in this bundle only to a *different* Ajv instance (`:43102-43104`,
`new Ajv({ strict: !1, validateFormats: !0, … })` followed by the plugin call `LFl.default(e)`). So on
the StructuredOutput instance the lookup misses and control reaches `:42528-42537`:

```javascript
// ============================================
// ajvFormatKeyword.reportUnknownFormat - what Ajv does when `format` names something it does not know
// Location: cli_inner_pretty.js:42520-42537
// ============================================

// ORIGINAL (for source lookup):
          let m = d.formats[i];
          if (!m) { E(); return; }
          ...
          function E() {
            if (l.strictSchema === !1) { d.logger.warn(T()); return; }
            throw Error(T());
            function T() { return `unknown format "${i}" ignored in schema at path "${c}"`; }
          }

// READABLE (for understanding):
          let formatDef = ajvSelf.formats[formatName];
          if (!formatDef) { reportUnknownFormat(); return; }
          ...
          function reportUnknownFormat() {
            if (opts.strictSchema === false) { ajvSelf.logger.warn(message()); return; }
            throw Error(message());                    // <-- default strict mode: THROW
            function message() { return `unknown format "${formatName}" ignored in schema at path "${errSchemaPath}"`; }
          }

// Mapping: d→ajvSelf, i→formatName, m→formatDef, l→opts, c→errSchemaPath, E→reportUnknownFormat, T→message
```

Ajv's `strict` mode also defaults on, so `strictSchema !== false`, so it **throws**. In 2.1.193 that
throw happened inside `qVd`'s `try` at `compile()` (`:229476 (193)`) and the outer `catch` converted it
into `{ error: 'unknown format "date-time" ignored in schema at path "#/properties/ts"' }`. That is the
bullet's *"rejecting valid schemas"* in full: a schema is declared invalid because it used a keyword the
JSON Schema specification explicitly permits, and the CLI's own dependency choices happened not to
implement it. The most natural thing a user writes — `{"type":"string","format":"date-time"}` — was the
trigger.

**Why turn it off rather than register `ajv-formats`?** Four reasons, and they compound:

1. **`format` is annotation-only in modern drafts.** Since draft 2019-09 (and by default in 2020-12)
   `format` is an *annotation*, not an assertion; assertion behaviour is opt-in vocabulary. A schema
   that says `"format": "email"` is not claiming that non-emails must be rejected. Ajv's default — throw
   on an unrecognised format — is the harshest possible reading of a keyword the spec says you may
   ignore. `validateFormats: false` is the spec-default reading, not a relaxation.
2. **Two enforcers would disagree.** This validator's job is narrow: check the model's `StructuredOutput`
   tool input against the shape the user asked for, so a mismatch can be turned into a retryable
   `Output does not match required schema: …` (`:231132`). Actual schema *enforcement* belongs to the
   API, which receives the same schema as `input_schema` and applies its own rules under `strict: true`
   (`:508170-508181`). Registering format assertions client-side creates a second gate calibrated
   differently from the server's: a model output the API accepted would be bounced locally with
   `must match format "date-time"`, and the user would see an unexplainable retry loop between two
   validators they cannot inspect. One enforcer, server-side, is the coherent choice.
3. **A user-supplied regex surface for zero benefit.** `ajv-formats` is roughly thirty regexes, some of
   them expensive by reputation (`uri`, `email`, `date-time` with offsets); the bundle even carries both
   the `full` and `fast` variants (`:43095`). Enabling them means a *user-chosen* format name selects a
   regex that runs against *model-generated* strings on every turn — a ReDoS surface bought in exchange
   for validation the API already performs.
4. **The dependency is separate on purpose.** Ajv v8 split formats out precisely because most consumers
   do not want them. Re-adding the package to satisfy one code path would also change behaviour for the
   other Ajv instance's users, and would make "which formats does Claude Code enforce?" a versioned
   contract the product would then have to honour.

**What breaks if it were on** — which is exactly what 2.1.193 shipped:

- *Unknown* format name (`"format": "isbn"`, or any of the ~20 draft names `ajv-formats` omits) →
  `compile()` throws → the schema is rejected outright.
- *Known* format name, had the package been registered → an extra assertion the API never applied →
  valid model output rejected locally, retried, rejected again.
- Either way the `.205` half-b behaviour compounds it: the rejection was silent, so the user saw plain
  prose instead of JSON and no diagnostic at all.

**The trade-off that was accepted:** a user who genuinely wants `format` enforced client-side no longer
gets it, and gets no warning that it was ignored. The mitigation is that the original schema — `format`
keywords intact — is still what travels to the API (`inputJSONSchema: e`, `:231126`), so the server
remains free to act on it. The CLI simply stops being a second, louder opinion.

**Key insight:** the fix is a *scalpel*, and the surrounding line proves it.
`if (!t.validateSchema(e)) return { error: t.errorsText(t.errors) }` (`:231107`) is **kept**. The two
options are doing different jobs and only one was wrong:

- `validateSchema` — *"is this a legal JSON Schema document?"* — stays **on**, so `{"type": 5}` or
  `{"required": "name"}` is still caught, and (thanks to half-b, §8.7) now *reported* instead of
  swallowed. This is the *"no longer silently unstructured"* clause.
- `validateFormats` — *"should the `format` keyword assert?"* — goes **off**. This is the
  *"`format` no longer mishandled"* clause.

Reading the bullet's two clauses onto those two lines is the whole of `.205` #2.

### 8.6 The strict converter `Bpo`/`Fpo` — the *other* thing `format` now costs you

`fty` does not stop at "is it valid". It attempts a second, stricter derivation whose output is stored
alongside as `strictInputJSONSchema` (`:231127`, **220=3 / 193=0**).

```javascript
// ============================================
// deriveStrictSchema - Convert a user schema into an API-strict schema, or explain why it cannot
// Location: cli_inner_pretty.js:230971-230976 (entry), 230983-231062 (recursion), 231065-231079 (allowlists)
// ============================================

// ORIGINAL (for source lookup):
function Bpo(e) {
  let t = Fpo(e, 32, { remaining: 1e5 });
  if ("reason" in t) return { ok: !1, reason: t.reason };
  if (t.node.type !== "object") return { ok: !1, reason: "root_not_object" };
  return { ok: !0, schema: { ...t.node, type: "object" } };
}
function Fpo(e, t, r) {
  if (t <= 0) return { reason: "max_depth" };
  if (--r.remaining < 0) return { reason: "max_nodes" };
  if (!iPu(e)) return { reason: "not_object" };
  for (let i of Object.keys(e)) if (!aty.has(i)) return { reason: "unsupported_keyword" };
  ...
  if (o === "object") {
    let i = e.properties;
    if (!iPu(i)) return { reason: "no_properties" };
    if (e.additionalProperties !== void 0 && e.additionalProperties !== !1) return { reason: "additional_properties" };
    ...
    ((n.properties = Object.fromEntries(s)), (n.additionalProperties = !1));
  }
  ...
}
((aty = new Set(["$schema","type","description","title","properties","required","additionalProperties","items","enum","const","anyOf"])),
 (lty = new Set(["$schema","description","title"])),
 (oPu = new Set(["object","array","string","integer","number","boolean","null"])));

// READABLE (for understanding):
function deriveStrictSchema(userSchema) {
  let root = convertStrictNode(userSchema, /*maxDepth*/ 32, { remaining: 100000 });
  if ("reason" in root) return { ok: false, reason: root.reason };
  if (root.node.type !== "object") return { ok: false, reason: "root_not_object" };
  return { ok: true, schema: { ...root.node, type: "object" } };
}

function convertStrictNode(node, depthLeft, budget) {
  if (depthLeft <= 0)          return { reason: "max_depth" };
  if (--budget.remaining < 0)  return { reason: "max_nodes" };
  if (!isPlainObject(node))    return { reason: "not_object" };
  for (let key of Object.keys(node))
    if (!STRICT_ALLOWED_KEYWORDS.has(key)) return { reason: "unsupported_keyword" };   // `format` lands here
  ...
  if (declaredType === "object") {
    if (!isPlainObject(node.properties))              return { reason: "no_properties" };
    if (node.additionalProperties !== undefined &&
        node.additionalProperties !== false)          return { reason: "additional_properties" };
    ...
    out.additionalProperties = false;                 // strict mode's defining requirement
  }
  ...
}
const STRICT_ALLOWED_KEYWORDS = new Set(["$schema","type","description","title","properties",
                                         "required","additionalProperties","items","enum","const","anyOf"]);
const ANYOF_SIBLING_KEYWORDS  = new Set(["$schema","description","title"]);
const STRICT_ALLOWED_TYPES    = new Set(["object","array","string","integer","number","boolean","null"]);

// Mapping: Bpo→deriveStrictSchema, Fpo→convertStrictNode, iPu→isPlainObject, sPu→isJsonPrimitive,
//          aty→STRICT_ALLOWED_KEYWORDS, lty→ANYOF_SIBLING_KEYWORDS, oPu→STRICT_ALLOWED_TYPES,
//          t→depthLeft, r→budget, o→declaredType, n→out
```

**What the walker rejects** (each returns a `reason` that lands verbatim in telemetry, `:231115`):

- `unsupported_keyword` — any key outside the 11-name allowlist. **`format` is not on that list**
  (`:231065-231077`). This is the second, quieter sense in which `format` is "mishandled": in 2.1.220 it
  no longer breaks your schema, it merely costs you strict mode. `pattern`, `minimum`, `minLength`,
  `$ref`, `oneOf`, `allOf`, `not` and `patternProperties` are in the same boat.
- `unsupported_type` — a type outside the seven JSON types, or a union type containing `object`/`array`
  (`:231025`), or a duplicated member.
- `mismatched_keywords` — `properties`/`required`/`additionalProperties` on a non-object, or `items` on
  a non-array (`:231031-231033`).
- `no_properties` / `additional_properties` — an object without `properties`, or with
  `additionalProperties` set to anything other than `false` (`:231036-231037`).
- `invalid_required` — a `required` entry naming a property that does not exist, or duplicated
  (`:231041-231042`).
- `unsupported_items` — tuple form (`items: [...]`) (`:231056`).
- `unsupported_enum` / `unsupported_const` — non-primitive, empty, or duplicate-bearing values
  (`:230980-230982`, `:231013`).
- `root_not_object` — the top level must be `type: "object"` (`:230974`).
- `max_depth` (>32) / `max_nodes` (>100000) — note the depth is **32**, not the safety walker's 10000,
  because this bound is semantic (matching what the API's strict mode will accept) rather than a stack
  guard.

**Why a separate converter instead of just sending the schema with `strict: true`?** Because 2.1.193 did
exactly that and it was unsafe. At `:593195 (193)`,
`d && e.strict === !0 && t.model && T2e(t.model)` set `c.strict = !0` on the payload **with the raw
schema**, behind gate `tengu_tool_pear`. If that schema used a keyword the API's strict mode does not
support, the request failed at the server with an error the user could not map back to their schema. In
2.1.220 (`:508171-508180`) the schema is run through `Bpo` at send time and, on failure, a warn-level log
`Tool ${e.name} has strict: true but its schema is not strict-compatible (${g.reason}); sending
non-strict` (**220=1 / 193=0**) is emitted and the request degrades to non-strict. The second branch
consumes the pre-computed `strictInputJSONSchema` behind gate `tengu_structured_output_strict`
(default `false`) and the model-capability check `y7i` (`:150476-150478`), which tests for the beta
`structured_outputs` / `structured-outputs-2025-12-15` (`:109194`).

**Key insight:** the conversion is a *strictly optional upgrade path*. Every failure mode is
non-fatal — `Bpo` returning `{ok:false}` only omits a field, and even an exception inside it is caught
separately (`:231117-231122`) so a bug in the converter can never turn a working schema into a rejected
one. That containment is why it could be added in the same release as a bug fix without widening the
blast radius.

### 8.7 Who consumes the result, and what the user actually sees

Four surfaces, three different failure policies — and the differences are deliberate:

| Consumer | Line | On rejection | Rationale |
|---|---|---|---|
| `--json-schema` CLI flag | `:829660-829684` | telemetry `tengu_structured_output_failure`, then `fm("Error: --json-schema is not a valid JSON Schema: ${error}")` → red stderr, **exit 1** | The user explicitly asked for structured output on a one-shot run; silently producing prose is worse than no output |
| SDK `initialize` tool list | `:846060-846065` | error-level log `Init JSON schema rejected, structured output disabled`, once (`Pe` latch), session continues | A long-lived SDK session must not die at boot; the caller can still steer it |
| Workflow `agent({ schema })` | `:387454-387456` | `throw TypeError("agent({schema}) received an invalid JSON Schema: …")` | Surfaces as a workflow-script runtime error attributed to the offending `agent()` call |
| Tool→API payload builder | `:508168-508181` | n/a (consumes the compiled result) | degrades `strict` to non-strict with a warn log |

The CLI row is the `.205` half-b delta. `fm` (`:545772-545774`) awaits the analytics flush and then calls
`hs` (`:545734-545738`), which prints the message via `console.error(chalk.red(...))` and
`process.exit(1)`. Its 2.1.193 counterpart at `:713209 (193)` is a single statement —
`else V("tengu_structured_output_failure", { error: Ve("Invalid JSON schema") });` — with **no message
and no exit**. The session then ran with `StructuredOutput` absent from the tool list, so the model
answered in prose and a `--output-format=json` consumer downstream got a shape it did not expect. That
is the *"silently running unstructured"* the bullet names, and the fix is literally the addition of the
`fm(...)` call and the `Gt.error` interpolation.

Two supporting details worth having:

- The flag is **gated to non-interactive contexts**. `cPu` (`:231081-231083`) is
  `e.isNonInteractiveSession || e.isBgSession === !0`, tested at `:829548` before the JSON is even
  parsed, so `--json-schema` in an interactive REPL is ignored rather than erroring. Two earlier guards
  cover malformed input separately: `Error: --json-schema is not valid JSON` (`:829552`) and
  `Error: --json-schema must be a JSON object` (`:829555`) — both carryover.
- On success, telemetry records the schema's *shape* but not its content:
  `tengu_structured_output_enabled { schema_property_count, has_required_fields }` (`:829676-829679`),
  identical to `:713205-713208 (193)`.

### 8.8 Bonus: the *other* `schema too large`, and why it is workflow-only

`schema too large` is **220=2 / 193=0**. The second site, `:387247`, is not the validator at all — it is
a net-new guard in the workflow agent dispatcher's auto-mode safety path, and all of its anchors are
**220=1 / 193=0**: `output schema too large to classify safely`,
`output schema could not be serialized for classification`, `blocked by safety classifier`, and
`schemaJson` (220=2/193=0).

```javascript
// ============================================
// classifyWorkflowAgentDispatch (schema serialisation) - bound the schema before it enters the safety-classifier prompt
// Location: cli_inner_pretty.js:387236-387254
// ============================================

// ORIGINAL (for source lookup):
    if (Te?.schema != null) {
      let ge = new WeakSet();
      try {
        let Oe = JSON.stringify(Te.schema, (Ue, Me) => {
          if (typeof Me === "bigint") return Me.toString();
          if (Me !== null && typeof Me === "object") {
            if (ge.has(Me)) return "[Circular]";
            ge.add(Me);
          }
          return Me;
        });
        if (Oe !== void 0 && Oe.length > 4096) Ae = "output schema too large to classify safely";
        else Le = Oe || void 0;
      } catch {
        Ae = "output schema could not be serialized for classification";
      }
    }
    let Ce = Ae ? { reason: Ae } : await vpd({ prompt: ee, schemaJson: Le, ... });

// READABLE (for understanding):
    if (opts?.schema != null) {
      let seen = new WeakSet();
      try {
        let serialized = JSON.stringify(opts.schema, (key, value) => {
          if (typeof value === "bigint") return value.toString();       // BigInt would throw
          if (value !== null && typeof value === "object") {
            if (seen.has(value)) return "[Circular]";                   // cycles would throw
            seen.add(value);
          }
          return value;
        });
        if (serialized !== undefined && serialized.length > 4096)
          blockReason = "output schema too large to classify safely";   // fail CLOSED
        else schemaJson = serialized || undefined;
      } catch {
        blockReason = "output schema could not be serialized for classification";
      }
    }
    let decision = blockReason ? { reason: blockReason }
                               : await classifyAgentDispatch({ prompt, schemaJson, ... });

// Mapping: Te→opts, ge→seen, Oe→serialized, Ae→blockReason, Le→schemaJson, Ce→decision,
//          vpd→classifyAgentDispatch, ee→prompt
```

**Why this exists.** The classifier prompt builder `vpd` (`:345775-345790`) appends the schema
*verbatim* to the agent's prompt under an `[output schema]` header before sending it to the safety
classifier. So the schema is not data to the classifier — it is **prompt text**. An unbounded schema is
therefore two things at once: a dilution attack (enough JSON pushes the actual agent prompt out of the
classifier's effective attention) and a direct injection channel (a `description` string is free-form
English inside a model prompt). 4096 characters — roughly a thousand tokens — is the bound at which the
classifier's input stays dominated by the prompt it is supposed to be judging.

**Key insight:** it **fails closed**. A schema too large to classify does not get dispatched
unclassified; the agent is blocked with `[label] blocked by safety classifier: output schema too large
to classify safely` (`:387270`). Compare `fty`'s cap, which also rejects — the two guards look alike but
answer different questions: `fty` asks *"can I compile this without hurting myself?"*, `:387247` asks
*"can I let a safety classifier reason about this honestly?"*. The `JSON.stringify` replacer handling
BigInt and cycles is the same instinct: every path out of the serialisation must produce a decision, and
the only decisions available are "classify" or "block".

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_workflow.md](../00_overview/symbol_additions_v2_1_220_workflow.md).

Key functions in this document:
- `buildWorkflowOtelAttrs` (D5r) - `:111459` — `workflow.run_id` / `workflow.name` for spans and log records
- `buildWorkflowEventFields` (nZ) - `:111463` — camelCase twin for the `tengu_*` event stream
- `isSubagentContext` (mde) - `:111442` — restricts stamping to workflow-spawned subagents
- `repairDoubleEscapedUnicode` (ctp) - `:508472` — telemetry wrapper around the repair walk
- `repairValue` (vqs) - `:508482` — the recursive walk; carryover regex, new Windows-path bail-out
- `formatScriptParseError` (dgy) - `:275631` — source line + caret, reworded hint
- `hasNumericLoc` (pgy) - `:275653` — runtime shape guard on Acorn's `loc`
- `parseWorkflowScriptMeta` ($H) - `:275599` — script size cap, parse, `export const meta` validation
- `createProgressBatcher` (c6y) - `:388538` — 16 ms coalescing + 250 ms bridge rate limit
- `applyWorkflowProgressEvents` (qPs) - `:386523` — index-keyed upsert + log-only trim (carryover)
- `isNotWorkflowLog` (oEd) - `:388907` — the frame/publish filter
- `emitTaskProgressFrame` (Vpr) - `:345314` — the `system/task_progress` stream-json frame
- `subscribeBridgePublishers` (Mcd) - `:335449` — three subscriptions; the agent-fan one is new
- `publishAgentFan` (Ocd) - `:335489` — hash-gated write of `fan` into the RC state file
- `getAgentFanSnapshot` (spr) - `:334794` / `setAgentFanSnapshot` (SHs) - `:334788`
- `hashFanItems` (Bpt) - `:334776` — the `id:doneAt:failed` join used as a change key
- `buildAgentFanItems` (lol) - `:764295` — flattens tasks; one item per workflow agent (carryover)
- `saveWorkflowScript` (oVa) - `:728199` — chain guard + atomic write
- `resolveWorkflowsDir` (WSS) - `:728191` / `getUserWorkflowsDir` (X$t) - `:388219`
- `assertDirChainReal` (jGn) - `:51990` — per-component `O_NOFOLLOW` walk (net-new)
- `writeScheduledTasks` (G7r) - `:230132` — the same guard for `scheduled_tasks.json`
- `isClaudeConfigDir` (I0t) - `:14682` — the user-config vs repo-supplied boundary
- `getClaudeConfigDir` (fn) - `:14779` / `tildifyHomePath` (MO) - `:51877`
- `buildAgentRowCells` (gvS) - `:728539` — `{model, stats, time}`; no tool-call cell
- `layoutAgentRowSegments` (Q9a) - `:728557` — 5 segments, right-aligned 6-wide time column
- `computeAgentTitleColumnWidth` (qii) - `:728581` — content-driven title width, 40 ceiling
- `formatCompactDuration` (Fst) - `:160497` — the 4-tier formatter whose max width is 6
- `formatModelPair` (TTr) - `:650468` / `getModelDisplayName` (mb) - `:111291`
- `renderFlatAgentList` (Hga) - `:650746` — last-8 + `+N more` (carryover)
- `renderPhaseGroupBox` (kga) - `:650629` — failed+running rows, `✓ N done` summary (carryover)
- `stepOutOfWorkflowDetail` (de) - `:729536` — agent → agents → phases → back (carryover)
- `resolveLeftArrowAction` (Nyp) - `:559650` — the prompt-input guard state machine (not workflow)
- `isInvisibleAttachment` (_Qo) - `:687119` — attachment types skipped by the transcript walkers

From §8 (`--json-schema` / `agent({ schema })` validation):
- `getOrCompileStructuredOutputTool` (wir) - `:231091` — `WeakMap`-memoised entry point; 3 call sites
- `compileStructuredOutputSchema` (fty) - `:231103-231141` — the `.205` validator (193 ancestor `qVd` `:229472 (193)`)
- `schemaExceedsSizeBudget` (uPu) - `:231097-231101` — shared-budget / per-path-depth JSON walk
- `MAX_SCHEMA_NODES` (dty) - `:231148` — `1e5`, bounds Ajv codegen size and per-turn `input_schema` tokens
- `MAX_SCHEMA_DEPTH` (pty) - `:231149` — `1e4`, a stack guard set just under Node's frame limit
- `structuredOutputToolCache` (aPu) - `:231206` — `WeakMap` keyed by the schema object
- `STRUCTURED_OUTPUT_TOOL` (Ous) - `:231161-231205` — the base tool spread by `fty`
- `STRUCTURED_OUTPUT_TOOL_NAME` (Eg) - `:231145` — `"StructuredOutput"`
- `deriveStrictSchema` (Bpo) - `:230971` — depth 32 / 1e5 nodes; also used at send time `:508172`
- `convertStrictNode` (Fpo) - `:230983-231062` — the allowlist recursion and its 10 `reason` codes
- `STRICT_ALLOWED_KEYWORDS` (aty) - `:231065-231077` — 11 keywords; `format` deliberately absent
- `ANYOF_SIBLING_KEYWORDS` (lty) - `:231078` / `STRICT_ALLOWED_TYPES` (oPu) - `:231079`
- `isPlainObject` (iPu) - `:230977` / `isJsonPrimitive` (sPu) - `:230980`
- `isNonInteractiveOrBackground` (cPu) - `:231081` — gates `--json-schema` to `--print`/bg, tested `:829548`
- `buildToolApiPayload` (…) - `:508165-508181` — `strict` derivation at send time; `y7i` `:150476` beta check
- `STRUCTURED_OUTPUTS_BETA` (A_e) - `:109194` — `structured-outputs-2025-12-15`
- `exitWithErrorAfterFlush` (fm) - `:545772` / `exitWithError` (hs) - `:545734` — the `.205` hard exit
- `classifyAgentDispatch` (vpd) - `:345775` — appends `[output schema]` + schema JSON to the classifier prompt
