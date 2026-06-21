# Workflow Tool-Object Correctness Fixes (v2.1.156 → v2.1.183)

> **Delta tree.** This document covers only what changed in the **Workflow tool object** (`DLp`) — its `validateInput`, its determinism check, its output schema, and the `agent()` DSL effort opt — between v2.1.156 and v2.1.183. Every citation below is `cli_inner_pretty.js:<line>` in the **v2.1.183** bundle (`/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`) unless explicitly tagged `(v2.1.156 before)` or `(v2.1.88)`. The *unchanged* tool spine — the four-layer enablement gate, the input schema's `script`/`name`/`scriptPath`/`resumeFromRunId` fields, the `meta` AST parser, the `checkPermissions` ask-by-default + name-scoped allow-suggestion, UNC rejection, the 512 KiB cap, fire-and-forget persistence, the `call` launch path — is documented in the v2.1.156 baseline and is **linked, not re-derived**:
> - [`workflow_tool_definition.md`](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_tool_definition.md) — the tool anatomy: name constant, factory, schemas, gate, description, `validateInput` error codes 1-6, `checkPermissions`, `meta` parser, persistence, UNC rejection.
> - [`workflow_authoring_and_orchestration.md`](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_authoring_and_orchestration.md) — the `agent()`/`pipeline()`/`parallel()` DSL contract and the orchestration pattern catalog.
> - [`gate_caps_lifecycle_relations.md`](../../../claude_code_v_2.1.156/analyze/42_workflow/gate_caps_lifecycle_relations.md) — the gate chain, caps, journal/resume the determinism rule protects.
> - [`README.md`](../../../claude_code_v_2.1.156/analyze/42_workflow/README.md) — the NEW-post-2.1.88 verdict (GA'd 2.1.154); not re-derived here.
>
> The sibling delta docs in this tree cover the other two strands: the keyword UX in [`ultracode_keyword_trigger_delta.md`](./ultracode_keyword_trigger_delta.md), and the spawn-time fixes (per-agent `agentContext`, `/workflows immediate`) in `runtime_fixes_delta.md`.

---

## 0. Scope and headline

The Workflow tool object is **structurally frozen** v2.1.156 → v2.1.183: same factory wrapper, same `isEnabled` gate, same five input fields, same `checkPermissions` shape, same `meta` parser, same `call` launch spine. What moved is a tight cluster of **tool-object correctness fixes** — none of them touch the runtime, the journal, or the gate:

1. **Determinism check rewritten from a raw regex to an AST walk** (`rWa` @416439, the 2.1.172 fix). The `Date.now()` / `Math.random()` / `new Date()` ban no longer false-positives on mentions inside string literals or comments — it now flags only *real* `MemberExpression`/`NewExpression` nodes.
2. **A new `errorCode 7` server-fallback retraction** (`r5a` @419415) plus an `abortSignal`-aborted pre-check (`zCe` @227026) bolted onto the front and middle of `validateInput`. This lets the tool cleanly abandon a dispatch whose input was truncated by a server fallback, before doing any source resolution / parsing / launch.
3. **Two new output-schema fields** — `taskType` and `workflowName` (`ILp` @419372) — so a Workflow tool result self-describes whether it ran locally or dispatched to CCR, and echoes the script's `meta.name`.
4. **A per-agent `effort` opt in the `agent()` DSL** — documented in the description (`gdo` @418215) and read at runtime (`le = rB(re?.effort)` @417123) so an individual workflow agent call can override the session reasoning effort.

The error *messages* for codes 1-6 are byte-unchanged; the input schema fields and `checkPermissions` logic are unchanged. This doc re-derives the four functions the dossier called out — `resolveWorkflowSource` (`n5a`), `parseWorkflowMeta` (`m0`), `readWorkflowScriptFile` (`r0t`), `lookupPermissionRules` (`Vte`) — to anchor the v2.1.183 obfuscated names against the v2.1.156 readable spine, and analyzes the four deltas in depth.

**Confidence: all claims in this doc are high** — every cited v2.1.183 line and its v2.1.156 before-line was read directly, and the `errorCode 7` novelty is corroborated by a whole-bundle count (see §2.4).

---

## 1. Re-derivation: the unchanged spine the fixes sit on

The four functions below are **carried over unchanged** in logic from v2.1.156; they are re-derived here only so the rest of this doc can refer to v2.1.183 obfuscated names. The deep analysis of each lives in the baseline — links inline.

### `resolveWorkflowSource` (`n5a`) — the precedence ladder (unchanged logic)

**What it does:** Resolves the three mutually-exclusive source forms — `scriptPath` (highest precedence) > `name` > inline `script` — into a `{script, ...}` object or an `{error}`. Identical precedence and error messages to v2.1.156 `b44`; the only cosmetic change is that the v2.1.183 version surfaces a `resolvedScriptPath`/`source` discriminant the `call` path consumes.

```javascript
// ============================================
// resolveWorkflowSource - scriptPath > name > script precedence ladder
// Location: cli_inner_pretty.js:419272-419289
// ============================================

// ORIGINAL (for source lookup):
async function n5a(e) {
  if (e.scriptPath) {
    if (e.script) return { script: e.script, resolvedScriptPath: s5a.resolve(Pt(), e.scriptPath) };
    let t = await r0t(e.scriptPath);
    if ("error" in t) return t;
    return { script: t.script, resolvedScriptPath: t.path };
  }
  if (e.name) {
    let t = await jjt(e.name, Pt());
    if (!t) {
      let n = (await J0e(Pt())).map((r) => r.name).join(", ");
      return { error: `Workflow "${e.name}" not found. Available: ${n || "(none)"}` };
    }
    return { script: e.script ?? t.script, source: t.source };
  }
  if (e.script) return { script: e.script };
  return { error: "Must provide script, name, or scriptPath" };
}

// READABLE (for understanding):
async function resolveWorkflowSource(input) {
  if (input.scriptPath) {                                   // precedence 1: file on disk
    if (input.script)                                       //   both present → trust inline, resolve path for persistence
      return { script: input.script, resolvedScriptPath: path.resolve(cwd(), input.scriptPath) };
    const read = await readWorkflowScriptFile(input.scriptPath);
    if ("error" in read) return read;                       //   UNC reject / not-found / oversize bubble up
    return { script: read.script, resolvedScriptPath: read.path };
  }
  if (input.name) {                                         // precedence 2: named/saved workflow
    const found = await resolveNamedWorkflow(input.name, cwd());
    if (!found) {                                           //   miss → list available names
      const names = (await listWorkflows(cwd())).map((w) => w.name).join(", ");
      return { error: `Workflow "${input.name}" not found. Available: ${names || "(none)"}` };
    }
    return { script: input.script ?? found.script, source: found.source };
  }
  if (input.script) return { script: input.script };        // precedence 3: inline source
  return { error: "Must provide script, name, or scriptPath" };
}

// Mapping: n5a→resolveWorkflowSource, e→input, r0t→readWorkflowScriptFile, jjt→resolveNamedWorkflow,
//          J0e→listWorkflows, Pt→cwd, s5a→path(require("path"))
```

Logic-identical to v2.1.156 `b44` ([baseline §6 "resolveWorkflowSource"](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_tool_definition.md)). The `resolvedScriptPath`/`source` fields are how `call` decides whether to reuse a path or persist a fresh one — out of scope here.

### `parseWorkflowMeta` (`m0`) — first-statement `export const meta` (unchanged logic)

`m0` (cli_inner_pretty.js:416466-416499) is logic-identical to v2.1.156 `FZ`: 512 KiB size guard, Acorn parse as ES-module (top-level `await`/`return` allowed), the first statement must be `export const meta = <ObjectExpression>` (`U0p`, 416500-416506), static pure-literal evaluation (`oWa`/`sWa`, 416507+), field validation (`G0p`), and body split after the meta export's `end` offset. Its only relevance here is that **the same `m0(...)` call now runs `rWa` on its returned `scriptBody`** (see §3) and that `validateInput` calls it after the new abort pre-check. Deep analysis: [baseline §5 "parseWorkflowMeta"](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_tool_definition.md). Note the same Acorn module wrapper `xjn` (cli_inner_pretty.js:411725) backs both `m0` and the new `rWa` — see §3.

```javascript
// ============================================
// parseWorkflowMeta - parse + validate `export const meta`, split the body (logic unchanged from FZ)
// Location: cli_inner_pretty.js:416466-416499
// ============================================

// ORIGINAL (for source lookup):
function m0(e) {
  if (e.length > A2) return { error: `Script exceeds ${A2} bytes` };
  let t;
  try {
    let { parse: l } = xjn();
    t = l(e, { ecmaVersion: "latest", sourceType: "module", allowAwaitOutsideFunction: !0, allowReturnOutsideFunction: !0 });
  } catch (l) {
    return { error: `Script parse error: ${l instanceof Error ? l.message : String(l)}. Workflow scripts must be plain JavaScript — TypeScript syntax (type annotations like \`: string[]\`, interfaces, generics) fails to parse.` };
  }
  let n = t.body[0];
  if (!n || n.type !== "ExportNamedDeclaration" || !U0p(n))
    return { error: "`export const meta = { name, description, phases }` must be the FIRST statement in the script" };
  let o = n.declaration.declarations[0].init, s;
  try { s = sWa(o); } catch (l) { return { error: `meta must be a pure literal: ${l instanceof Error ? l.message : String(l)}` }; }
  let i = G0p(s);
  if ("error" in i) return i;
  let a = e.slice(n.end).replace(/^[;\s]*\n/, "").trimStart();
  return { meta: i.meta, scriptBody: a };
}

// READABLE (for understanding):
function parseWorkflowMeta(source) {
  if (source.length > WORKFLOW_SCRIPT_MAX_BYTES) return { error: `Script exceeds ${WORKFLOW_SCRIPT_MAX_BYTES} bytes` };
  let ast;
  try {
    const { parse } = getAcorn();
    ast = parse(source, { ecmaVersion: "latest", sourceType: "module", allowAwaitOutsideFunction: true, allowReturnOutsideFunction: true });
  } catch (e) {
    return { error: `Script parse error: ${msg(e)}. … TypeScript syntax fails to parse.` };
  }
  const first = ast.body[0];
  if (!first || first.type !== "ExportNamedDeclaration" || !isMetaExport(first))
    return { error: "`export const meta = { name, description, phases }` must be the FIRST statement in the script" };
  const initNode = first.declaration.declarations[0].init;
  let metaRaw;
  try { metaRaw = evalObjectLiteral(initNode); }
  catch (e) { return { error: `meta must be a pure literal: ${msg(e)}` }; }
  const validated = validateMetaFields(metaRaw);
  if ("error" in validated) return validated;
  const scriptBody = source.slice(first.end).replace(/^[;\s]*\n/, "").trimStart();
  return { meta: validated.meta, scriptBody };
}

// Mapping: m0→parseWorkflowMeta, e→source, A2→WORKFLOW_SCRIPT_MAX_BYTES, xjn→getAcorn(acorn module),
//          U0p→isMetaExport, sWa→evalObjectLiteral, G0p→validateMetaFields
```

### `readWorkflowScriptFile` (`r0t`) and `lookupPermissionRules` (`Vte`) — unchanged

`readWorkflowScriptFile` (`r0t`, called from `n5a` @419275 and `checkPermissions` @419492) still rejects UNC paths up front, resolves relative to cwd, and does a `WORKFLOW_SCRIPT_MAX_BYTES + 1` bounded read so an oversized file is detected without slurping it. Logic-identical to v2.1.156 `Hj$` ([baseline §8 "readWorkflowScriptFile + UNC rejection"](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_tool_definition.md)).

`lookupPermissionRules` (`Vte`) is the generic rule collector the Workflow `checkPermissions` uses — re-derived here so §2's `checkPermissions` snippet has its dependency named:

```javascript
// ============================================
// lookupPermissionRules - collect allow/deny/ask rules for a tool into Map<ruleContent, rule>
// Location: cli_inner_pretty.js:585562-585580
// ============================================

// ORIGINAL (for source lookup):
function Vte(e, t, n) {
  let r = new Map(), o = [];
  switch (n) {
    case "allow": o = jye(e); break;
    case "deny":  o = gV(e);  break;
    case "ask":   o = Qye(e); break;
  }
  for (let s of o)
    if (s.ruleValue.toolName === t && s.ruleValue.ruleContent !== void 0 && s.ruleBehavior === n)
      r.set(s.ruleValue.ruleContent, s);
  return r;
}

// READABLE (for understanding):
function lookupPermissionRules(permissionCtx, toolName, behavior) {
  const out = new Map();
  let rules = [];
  switch (behavior) {                                  // pick the rule list for this behavior
    case "allow": rules = getAllowRules(permissionCtx); break;
    case "deny":  rules = getDenyRules(permissionCtx);  break;
    case "ask":   rules = getAskRules(permissionCtx);   break;
  }
  for (const r of rules)                               // keep only rules for THIS tool with a defined ruleContent
    if (r.ruleValue.toolName === toolName && r.ruleValue.ruleContent !== undefined && r.ruleBehavior === behavior)
      out.set(r.ruleValue.ruleContent, r);             // keyed by ruleContent (the workflow NAME) → O(1) .get(name)
  return out;
}

// Mapping: Vte→lookupPermissionRules, e→permissionCtx, t→toolName, n→behavior,
//          jye→getAllowRules, gV→getDenyRules, Qye→getAskRules
```

Logic-identical to v2.1.156 `d6H` ([baseline §7 "checkPermissions"](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_tool_definition.md)). The Workflow `checkPermissions` calls it as `Vte(n, zk, c).get(r)` where `zk = "Workflow"` and `r` is the workflow name — so an ad-hoc `scriptPath`/inline `script` (whose `r` is `undefined`, @419481) can never match a name-keyed rule and always falls through to `ask`. **Unchanged from v2.1.156.**

---

## 2. errorCode 7 — server-fallback retraction + abort pre-check

**Kind:** added. **Confidence: high.**

### What it does

A new branch at the very top of `validateInput` (and re-checked once mid-flight) detects that the dispatch's `abortController.signal` was aborted *with the specific server-fallback reason*, and bails out with a dedicated `errorCode 7` result `r5a` whose message warns that "the input may be truncated." It short-circuits **before** any source resolution, file read, AST parse, or launch.

### The new constant and the abort check

```javascript
// ============================================
// serverFallbackRetraction (errorCode 7) + abortSignal-aborted check
// Location: r5a cli_inner_pretty.js:419415-419419 ; zCe cli_inner_pretty.js:227026-227028
// ============================================

// ORIGINAL (for source lookup):
r5a = {
  result: !1,
  message: "Tool dispatch was retracted by a server fallback; the input may be truncated.",
  errorCode: 7,
};
// ...
function zCe(e) {
  return e.aborted && uMt(e.reason) === Hqr;
}

// READABLE (for understanding):
const serverFallbackRetraction = {
  result: false,
  message: "Tool dispatch was retracted by a server fallback; the input may be truncated.",
  errorCode: 7,
};
// signal is aborted AND the reason is the *specific* server-fallback retraction sentinel (Hqr), not a user Ctrl-C
function isRetractedByServerFallback(signal) {
  return signal.aborted && abortReason(signal.reason) === SERVER_FALLBACK_REASON;
}

// Mapping: r5a→serverFallbackRetraction, zCe→isRetractedByServerFallback, e→signal,
//          uMt→abortReason (unwraps a DOMException to its .message), Hqr→SERVER_FALLBACK_REASON
```

`zCe` is a shared abort-classification helper (cli_inner_pretty.js:227026), not workflow-specific: `uMt` (227020) unwraps a `DOMException`/`AbortError` to its underlying reason string, and `Hqr` is the sentinel string the server-fallback path aborts with. So `zCe(signal)` is true **only** when the dispatch was retracted by the fallback machinery — a user-initiated abort (a different reason) returns `false` and does not trigger errorCode 7.

### Where it's wired into validateInput

```javascript
// ============================================
// workflowValidateInput - errorCode 7 pre-check + mid-flight re-check (codes 1-6 unchanged)
// Location: cli_inner_pretty.js:419441-419478
// ============================================

// ORIGINAL (for source lookup):
async validateInput(e, t) {
  if (zCe(t.abortController.signal)) return r5a;                              // (1) NEW: bail before any work
  if (Kyn()) return { result: !1, message: "Dynamic workflows are disabled by managed settings (`disableWorkflows`).", errorCode: 5 };
  if (!Pw()) return { result: !1, message: 'Dynamic workflows are not enabled for this session (org policy, launch gate, or the "Dynamic workflows" setting in /config).', errorCode: 6 };
  let n = await n5a(e);
  if (zCe(t.abortController.signal)) return r5a;                              // (2) NEW: re-check after the await
  if ("error" in n) return { result: !1, message: n.error, errorCode: 1 };
  let r = m0(n.script);
  if ("error" in r) return { result: !1, message: `Invalid workflow script: ${r.error}`, errorCode: 2 };
  if (e.script && rWa(r.scriptBody))                                          // (3) determinism: now AST walk (§3)
    return { result: !1, message: "Workflow scripts must be deterministic: Date.now()/Math.random()/new Date() are unavailable (breaks resume). Stamp results after the workflow returns, or pass timestamps via args.", errorCode: 4 };
  if (e.resumeFromRunId) {
    for (let [o, s] of Object.entries(t.taskRegistry.all()))
      if (s.type === "local_workflow" && s.status === "running" && s.workflowRunId === e.resumeFromRunId)
        return { result: !1, message: `Workflow ${e.resumeFromRunId} is still running (task ${o}). Stop it first with ${uP}({taskId: "${o}"}) before resuming.`, errorCode: 3 };
  }
  return { result: !0 };
}

// READABLE (for understanding):
async function validateWorkflowInput(input, ctx) {
  if (isRetractedByServerFallback(ctx.abortController.signal)) return serverFallbackRetraction;  // errorCode 7 (NEW)
  if (isWorkflowsManagedDisabled()) return fail(5, "disabled by managed settings (`disableWorkflows`)");
  if (!isWorkflowsEnabled())        return fail(6, "not enabled for this session (org policy / launch gate / /config)");
  const resolved = await resolveWorkflowSource(input);                                            // may read a file off disk
  if (isRetractedByServerFallback(ctx.abortController.signal)) return serverFallbackRetraction;  // re-check (NEW)
  if ("error" in resolved)          return fail(1, resolved.error);
  const parsed = parseWorkflowMeta(resolved.script);
  if ("error" in parsed)            return fail(2, `Invalid workflow script: ${parsed.error}`);
  if (input.script && isNonDeterministic(parsed.scriptBody))                                      // AST walk (§3)
    return fail(4, "must be deterministic: Date.now()/Math.random()/new Date() unavailable (breaks resume)");
  if (input.resumeFromRunId) {                                                                     // resume-conflict check (unchanged)
    for (const [taskId, task] of Object.entries(ctx.taskRegistry.all()))
      if (task.type === "local_workflow" && task.status === "running" && task.workflowRunId === input.resumeFromRunId)
        return fail(3, `Workflow ${input.resumeFromRunId} is still running (task ${taskId}). Stop it with TaskStop first.`);
  }
  return { result: true };
}

// Mapping: validateInput→validateWorkflowInput, e→input, t→ctx, zCe→isRetractedByServerFallback,
//          r5a→serverFallbackRetraction, Kyn→isWorkflowsManagedDisabled, Pw→isWorkflowsEnabled,
//          n5a→resolveWorkflowSource, m0→parseWorkflowMeta, rWa→isNonDeterministic, uP→"TaskStop"
```

### How it works (step-by-step)

1. **Pre-check (419442).** The very first line of `validateInput` is the abort check. If the dispatch's signal is already aborted by a server fallback, return `r5a` immediately — before `Kyn()`, before `Pw()`, before touching the source. No file is read, no script parsed, no permission asked.
2. **The managed-off / not-enabled gates (419443-419455)** are unchanged from v2.1.156 (codes 5 and 6, same messages) — see [baseline §6](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_tool_definition.md).
3. **Mid-flight re-check (419457).** Immediately after `await n5a(e)` — the one place `validateInput` does I/O (it may read a `scriptPath` off disk) — the abort is re-checked. If a server fallback fired *during* that read, the function bails with `r5a` rather than proceeding to parse a possibly-truncated script.
4. **Codes 1-4 + 3 (resume) (419458-419476)** are the same five checks as v2.1.156, with the determinism check (code 4) now using `rWa` instead of a regex (§3). The error messages are byte-identical.

### Why this approach (trade-offs, alternatives)

**What is a "server fallback retraction"?** When the primary model is unavailable, Claude Code's request layer can fall back to a different model mid-turn. A fallback can **truncate** an in-flight tool input that was assembled for the original model (e.g. the streamed `script` arrives partial). The signal is aborted with a distinguished reason (`Hqr`) so downstream tools can tell "the server pulled this dispatch" apart from "the user pressed Ctrl-C."

Why a *dedicated errorCode 7 with a "may be truncated" message* rather than reusing code 2 (parse error) or just throwing?

- **A truncated `script` would otherwise fail as a confusing parse error.** Without the pre-check, a half-streamed script reaches `m0` and produces `Invalid workflow script: <Acorn parse error>` (code 2) — a message that blames the *author* for malformed JavaScript when the real cause is that the dispatch was retracted by infrastructure. Code 7 names the real cause, so the retry logic (and any human reading the transcript) knows the input was truncated, not wrong.
- **Bailing before I/O is the cheap, safe default.** A retracted dispatch must not spawn agents or write files. Putting the check *first* means a retraction never burns a file read, an AST parse, or — critically — a launch. The Workflow tool is the single most expensive tool to run by accident (it can fan out to 1000 agents), so refusing to even validate a retracted dispatch is defense-in-depth aligned with the tool's danger profile.
- **The mid-flight re-check exists because `validateInput` is async.** The only `await` is `n5a` (which may hit the disk). A fallback can fire during that window, so the signal is re-sampled the instant the await resolves — a classic "check-await-recheck" pattern that closes the race where the signal flips between the top check and the work.
- **Why a constant `r5a` rather than an inline object?** The result is identical every time (`result:false`, fixed message, `errorCode:7`), so it's hoisted to a module-level constant and returned by reference from both check sites — no per-call allocation, and the two sites can't drift.

### Key insight — errorCode 7 is *new to Workflow but not to the codebase*

A whole-bundle count corroborates the novelty precisely: `grep -c "errorCode: 7"` returns **6** in the v2.1.156 bundle and **7** in v2.1.183 — exactly one new occurrence, the Workflow `r5a`. errorCode 7 already existed in v2.1.156 for *other* tools (e.g. NotebookEdit) as their server-fallback-retraction code; the 2.1.183 change is that Workflow **adopts the same convention**, giving it a uniform retraction code across tools instead of letting a truncated workflow input masquerade as a parse error. (v2.1.156 before: the Workflow `validateInput` @378238 opened directly with `H48()` — code 5 — with no abort pre-check and no errorCode 7; see [baseline §6](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_tool_definition.md).)

---

## 3. Determinism check: raw regex → AST walk (the 2.1.172 fix)

**Kind:** fix / refactored. **Confidence: high.**

### What it does

The determinism rule bans `Date.now()`, `Math.random()`, and argless `new Date()` from workflow scripts, because the resume protocol replays cached `agent()` results keyed on `(prompt, opts)` — if control flow depends on wall-clock time or randomness, the replay diverges from the original run and the cache is wrong. The *rule* is unchanged; the *detector* changed from a text regex that scanned the whole script body to an Acorn AST walk that flags only genuine member/new expressions.

### v2.1.156 before — the raw regex (false-positive prone)

```javascript
// ============================================
// (v2.1.156 before) determinism check - raw regex over the script body text
// Location: cli_inner_pretty.js:378256-378262  (v2.1.156 bundle)
// ============================================

// ORIGINAL (for source lookup):
if (H.script && /\bDate\s*\.\s*now\b|\bMath\s*\.\s*random\b|\bnew\s+Date\s*\(\s*\)/.test(K.scriptBody))
  return {
    result: !1,
    message: "Workflow scripts must be deterministic: Date.now()/Math.random()/new Date() are unavailable (breaks resume). Stamp results after the workflow returns, or pass timestamps via args.",
    errorCode: 4,
  };

// READABLE (for understanding):
// if (input.script && /Date.now | Math.random | new Date()/.test(parsed.scriptBody)) return fail(4, <same message>);
// — a raw text regex over the body string; the semantic AST-walk replacement is isNonDeterministic (rWa) in §3.2 below.

// Mapping: H→input, K.scriptBody→parsed.scriptBody (the post-meta body text)
```

The regex `\bDate\s*\.\s*now\b|\bMath\s*\.\s*random\b|\bnew\s+Date\s*\(\s*\)` ran against the **raw script-body text**. Because a regex has no idea what is code versus a string literal versus a comment, it matches `Date.now()` no matter where it appears — including:

- a prompt string: `` await agent(`Summarize when Date.now() should be avoided`) `` → false reject
- a comment: `// don't use Date.now() here` → false reject
- documentation: `phase("Explain Math.random() pitfalls")` → false reject

Any *mention* of the banned tokens — even one explaining the ban — tripped errorCode 4 and refused a perfectly deterministic script.

### v2.1.183 — the AST walk

```javascript
// ============================================
// isNonDeterministic - AST walk flagging real Date.now/Math.random/new Date() nodes
// Location: cli_inner_pretty.js:416439-416465
// ============================================

// ORIGINAL (for source lookup):
function rWa(e) {
  let { parse: t } = xjn(), n = ido(), r = !1;
  try {
    let o = t(e, { ecmaVersion: "latest", sourceType: "module", allowAwaitOutsideFunction: !0, allowReturnOutsideFunction: !0 });
    n.simple(o, {
      MemberExpression(s) {
        if (s.computed || s.object.type !== "Identifier" || s.property.type !== "Identifier") return;
        let i = s.object.name, a = s.property.name;
        if ((i === "Date" && a === "now") || (i === "Math" && a === "random")) r = !0;
      },
      NewExpression(s) {
        if (s.callee.type === "Identifier" && s.callee.name === "Date" && s.arguments.length === 0) r = !0;
      },
    });
  } catch {
    return !1;
  }
  return r;
}

// READABLE (for understanding):
function isNonDeterministic(scriptBody) {
  const { parse } = getAcorn();          // xjn = the acorn parser module
  const walk = getAcornWalk();           // ido = the acorn-walk module (e.acorn.walk)
  let found = false;
  try {
    const ast = parse(scriptBody, {
      ecmaVersion: "latest", sourceType: "module",
      allowAwaitOutsideFunction: true, allowReturnOutsideFunction: true,
    });
    walk.simple(ast, {
      MemberExpression(node) {
        // skip computed access (obj[x]) and anything not Identifier.Identifier
        if (node.computed || node.object.type !== "Identifier" || node.property.type !== "Identifier") return;
        const obj = node.object.name, prop = node.property.name;
        if ((obj === "Date" && prop === "now") || (obj === "Math" && prop === "random")) found = true;
      },
      NewExpression(node) {
        // flag `new Date()` with ZERO args (new Date(x) is deterministic — it's a parse, not a clock read)
        if (node.callee.type === "Identifier" && node.callee.name === "Date" && node.arguments.length === 0) found = true;
      },
    });
  } catch {
    return false;                         // unparseable → not our job to flag; m0 already reported the parse error
  }
  return found;
}

// Mapping: rWa→isNonDeterministic, e→scriptBody, xjn→getAcorn(acorn parser),
//          ido→getAcornWalk(acorn-walk), n.simple→walk.simple, r→found, s→node, i→obj, a→prop
```

Called from `validateInput` as `e.script && rWa(r.scriptBody)` (cli_inner_pretty.js:419461) — exactly where the regex used to be — and **only** when the source was inline `script` (named/`scriptPath` workflows are assumed already-vetted, unchanged rationale from [baseline §6](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_tool_definition.md)).

### How it works (step-by-step)

1. **Parse** the post-meta `scriptBody` with Acorn (`xjn`, the same parser module `m0` uses, cli_inner_pretty.js:411725) as an ES module with top-level `await`/`return` allowed — matching how the body actually runs.
2. **Walk** the AST with `acorn-walk`'s `simple` visitor (`ido`, cli_inner_pretty.js:415881, which registers `e.acorn.walk`). `simple` visits every node and dispatches to the named handler for its type.
3. **`MemberExpression` handler** — flags `Date.now` and `Math.random` *as property accesses*, with three guards that a regex cannot express:
   - `node.computed` is rejected: `Date["now"]` / `obj[k]` are not matched (the ban targets the literal `.now`/`.random` static form the description documents). A regex would still false-match a string containing those characters.
   - both sides must be `Identifier`: `foo().now` or `(x).random` don't match.
   - it matches the *member expression*, not a call — so `const f = Date.now` (taking the reference) is flagged too, which is correct: storing the reference and calling it later is just as nondeterministic.
4. **`NewExpression` handler** — flags `new Date()` **only with zero arguments**. This is the key semantic the regex's `new\s+Date\s*\(\s*\)` *tried* to encode but did imperfectly: `new Date(ts)` / `new Date("2020-01-01")` parse a fixed value and are deterministic, so they're allowed; only the argless `new Date()` (a clock read) is banned. The AST check reads `node.arguments.length === 0` exactly.
5. **`catch { return false }`** — if the body fails to parse, `rWa` returns "deterministic = ok" rather than throwing. This is safe because `validateInput` already ran `m0` *before* `rWa` (419459-419460): an unparseable body is caught by `m0` as errorCode 2 first, so by the time `rWa` runs the body is known to parse. The catch is belt-and-suspenders so a determinism check can never *throw* and crash validation.

### Why this approach (trade-offs, alternatives)

- **The regex was a textbook "regex can't parse a programming language" bug.** It scanned text with no notion of lexical context, so any string/comment mention tripped it. The fix is the canonical remedy: parse to an AST and inspect *nodes*, where a string literal is a `Literal` node and a comment isn't a node at all — neither is ever visited by the member/new handlers. So a script that *talks about* `Date.now()` in a prompt or comment now passes; only one that *calls* it is rejected.
- **Why reuse Acorn instead of a smarter regex?** The parser is already loaded and used by `m0` for the `meta` block, so the AST walk adds no new dependency and ~zero marginal cost (the body is already small — ≤ 512 KiB — and parsed once more). A "smarter" regex (e.g. one that tries to skip strings/comments) would be brittle, hard to read, and still wrong on template literals and nested quotes. The AST is the correct abstraction and was already on hand.
- **Why `new Date()`-args-aware?** The old regex `new\s+Date\s*\(\s*\)` only matched the *exact* empty-paren spelling, so `new Date( )` matched but `new Date(/*x*/)` was ambiguous, and it never distinguished `new Date(ts)` semantically — it just relied on the empty parens. The AST check is precise (`arguments.length === 0`), so a deterministic `new Date(timestamp)` is reliably allowed and a clock-reading `new Date()` is reliably rejected regardless of whitespace.
- **The error message is unchanged** (cli_inner_pretty.js:419465, byte-identical to v2.1.156 @378260) — only the *detector* changed, so a script that genuinely does call the banned APIs gets the same actionable message it always did. The runtime VM sandbox that makes `Date.now`/`Math.random`/`new Date()` *throw at execution time* (separate from this validateInput check) is unchanged — see [baseline §E in `gate_caps_lifecycle_relations.md`](../../../claude_code_v_2.1.156/analyze/42_workflow/gate_caps_lifecycle_relations.md).

### Key insight

This is a **fix that loosens** the check, not tightens it — the AST walk *rejects fewer* scripts than the regex did, by no longer false-flagging mentions. The danger of a determinism *miss* (a script that sneaks a real clock read through) is unchanged because the runtime VM sandbox is the actual hard guard; `rWa` is a fast pre-flight to give the model a clean, early errorCode 4 with a readable message instead of a confusing runtime throw later. So the cost-benefit is entirely upside: zero new false negatives at the hard boundary, and the elimination of an annoying class of false positives that blocked legitimate scripts. The description's standing line that "`Date.now()`/`Math.random()`/`new Date()` are unavailable" (cli_inner_pretty.js:418328, 419465) is now enforced at validateInput precisely as worded — by AST, not by string-search.

---

## 4. Output schema: new `taskType` and `workflowName` fields

**Kind:** added. **Confidence: high.**

### What it does

The Workflow output schema `ILp` gains two new optional fields — `taskType` (`"local_workflow"` | `"remote_agent"`) and `workflowName` (the `meta.name` echo) — so a Workflow tool result self-describes how it ran and which workflow it was, without the consumer having to cross-reference the task registry.

### v2.1.183 — the two new fields

```javascript
// ============================================
// workflowOutputSchema - adds taskType + workflowName (other fields unchanged)
// Location: cli_inner_pretty.js:419372-419407
// ============================================

// ORIGINAL (for source lookup):
ILp = we(() =>
  H.object({
    status: H.enum(["async_launched", "remote_launched"]),
    taskId: H.string(),
    taskType: H.enum(["local_workflow", "remote_agent"]).optional()
      .describe("TaskType of the registered background task — 'local_workflow' for in-process runs, 'remote_agent' when remote:true dispatches to CCR. Set on all new writes; absent only on transcripts written before this field existed."),
    workflowName: H.string().optional()
      .describe("meta.name from the workflow script — same value as task_started.workflow_name. Set on all new writes; absent only on transcripts written before this field existed."),
    runId: H.string().optional().describe("Local workflow run identifier for resumeFromRunId. ..."),
    summary: H.string().optional(),
    transcriptDir: H.string().optional().describe("Directory where subagent transcripts are written during execution"),
    scriptPath: H.string().optional().describe("Path to the persisted workflow script for this invocation. ..."),
    sessionUrl: H.string().optional().describe("CCR session URL when status is remote_launched"),
    warning: H.string().optional().describe("Non-blocking heads-up (e.g. local git state diverges from the pushed branch the cloud session will clone)"),
    error: H.string().optional().describe("Set if syntax check failed"),
  }),
);

// READABLE (for understanding):
workflowOutputSchema = memoize(() =>
  z.object({
    status:        z.enum(["async_launched", "remote_launched"]),
    taskId:        z.string(),
    taskType:      z.enum(["local_workflow", "remote_agent"]).optional(), // NEW: how it ran (local vs CCR)
    workflowName:  z.string().optional(),                                 // NEW: meta.name echo
    runId:         z.string().optional(),
    summary:       z.string().optional(),
    transcriptDir: z.string().optional(),
    scriptPath:    z.string().optional(),
    sessionUrl:    z.string().optional(),
    warning:       z.string().optional(),
    error:         z.string().optional(),
  }),
);

// Mapping: ILp→workflowOutputSchema, we→memoize, H→z(zod)
```

### v2.1.156 before — neither field

```javascript
// ============================================
// (v2.1.156 before) workflowOutputSchema - no taskType, no workflowName
// Location: cli_inner_pretty.js:378186-378216  (v2.1.156 bundle)
// ============================================

// ORIGINAL (for source lookup):
g0_ = yH(() =>
  y.object({
    status: y.enum(["async_launched", "remote_launched"]),
    taskId: y.string(),
    runId: y.string().optional().describe("Local workflow run identifier for resumeFromRunId. ..."),
    summary: y.string().optional(),
    transcriptDir: y.string().optional().describe("Directory where subagent transcripts are written during execution"),
    scriptPath: y.string().optional().describe("Path to the persisted workflow script for this invocation. ..."),
    sessionUrl: y.string().optional().describe("CCR session URL when status is remote_launched"),
    warning: y.string().optional().describe("Non-blocking heads-up (e.g. local git state diverges from the pushed branch the remote session will clone)"),
    error: y.string().optional().describe("Set if syntax check failed"),
  }),
);

// READABLE (for understanding):
// workflowOutputSchema = memoize(() => z.object({ status, taskId, runId?, summary?, transcriptDir?,
//   scriptPath?, sessionUrl?, warning?, error? }));  — same shape as v2.1.183 (§4 above) MINUS the two
//   NEW fields taskType? and workflowName?, and with warning wording "remote" instead of "cloud".

// Mapping: g0_→workflowOutputSchema(156), yH→memoize, y→z(zod)
```

### Where the fields get populated

These are not merely declared — `call` writes them into the result `data`. In the v2.1.183 launch path, the success result includes `taskType: "local_workflow"` and `workflowName: f` where `f = c.meta.name` (cli_inner_pretty.js:419560-419561, and the compile-failed branch at the same lines), e.g.:

```javascript
// from call(...) success/compile-failed result data (cli_inner_pretty.js:419556-419565)
{
  status: "async_launched",
  taskId: d,
  taskType: "local_workflow",     // NEW field, populated
  workflowName: f,                // NEW field, f = c.meta.name
  runId: u,
  summary: p,
  ...
}
```

### How it works / Why this approach (trade-offs)

1. **`taskType` discriminates local vs remote at the result level.** The describe text ties it to the registered background task's type: `"local_workflow"` for in-process runs, `"remote_agent"` when `remote:true` dispatches to CCR. Before, a consumer reading a Workflow result had to infer "remote" from `status === "remote_launched"` and/or the presence of `sessionUrl`; now the `taskType` is explicit and matches the value already stored in the task registry — a single source of truth echoed forward.
2. **`workflowName` echoes `meta.name`.** The describe text says it is "the same value as `task_started.workflow_name`" — so the result carries the workflow's identity inline, which is what `/workflows` history, transcripts, and telemetry key on. A consumer no longer has to re-parse the script's `meta` to learn which workflow a result came from.
3. **Both are `.optional()` with a deliberate back-compat note.** The describe text on each — "Set on all new writes; absent only on transcripts written before this field existed" — tells the schema reader these are *additive*: existing/replayed transcripts that predate the fields won't have them, and that's valid. Making them optional (rather than required) is what lets old journal/transcript entries still validate against the new schema, which matters for **resume**: a resumed run reads transcripts written by an earlier build.
4. **Why add them now?** As the subsystem matured (remote/CCR dispatch via `remote_agent`, richer `/workflows` history), having the result self-describe its `taskType`/`workflowName` removes a class of "look it up in the registry" coupling and makes the tool result a complete, standalone record. The cost is two optional fields of prompt/schema weight — negligible against a result the model already reads.

**Minor co-located wording change:** the `warning` field's describe text changed "the **remote** session will clone" (v2.1.156 @378212) → "the **cloud** session will clone" (v2.1.183 @419404) — a terminology refresh ("remote" → "cloud" for CCR sessions), not a behavior change.

### Key insight

The new fields are the **"self-describing result" pattern**: a fire-and-forget tool that returns a task handle benefits from the result carrying enough identity (`taskType`, `workflowName`) that downstream readers — the model, `/workflows`, transcript replay — don't have to join against the task registry to reconstruct what was launched. The optional + back-compat-noted design is the tell that this is an additive schema migration done carefully so resume across builds keeps validating.

---

## 5. Per-agent `effort` opt in the `agent()` DSL

**Kind:** added. **Confidence: high.**

### What it does

A workflow script can now override the reasoning effort for an *individual* `agent()` call via a new `effort?` opt, independent of the session effort. The description documents the option (cli_inner_pretty.js:418215) and the runtime reads it on each spawn (cli_inner_pretty.js:417123), normalizing it through the shared effort parser `rB`.

### The description signature delta

v2.1.183 `agent()` signature (cli_inner_pretty.js:418215) now lists `effort?: string` between `model?` and `isolation?`:

```
agent(prompt: string, opts?: {label?, phase?, schema?, model?, effort?: string, isolation?: 'worktree', agentType?}): Promise<any>
```

with the prose (also @418215): *"opts.effort overrides the reasoning effort for this agent call ('low' | 'medium' | 'high' | 'xhigh' | 'max') — omit to inherit the session effort; use 'low' for cheap mechanical stages and higher tiers only for the hardest verify/judge stages."*

v2.1.156 before — the signature had **no** `effort` opt (cli_inner_pretty.js:376122, v2.1.156 bundle): `agent(prompt, opts?: {label?, phase?, schema?, model?, isolation?, agentType?})`.

### The runtime read

```javascript
// ============================================
// agent() per-call effort - normalize opts.effort, merge into the subagent def
// Location: cli_inner_pretty.js:417122-417124
// ============================================

// ORIGINAL (for source lookup):
let se = ae ?? (ge ? nLp : ddo),
  le = rB(re?.effort),
  pe = le !== void 0 ? { ...se, effort: le } : se,

// READABLE (for understanding):
let agentDef = customAgentDef ?? (structuredOutputTool ? structuredSubagentDef : plainSubagentDef),  // pick base def
  effort = parseEffort(opts?.effort),                  // normalize "low"/.../numeric → valid effort | undefined
  defWithEffort = effort !== undefined                  // only override when a valid effort was given
    ? { ...agentDef, effort }                           // shallow-merge the per-call effort onto the def
    : agentDef;                                          // else inherit the session effort (unchanged behavior)

// Mapping: se→agentDef, ae→customAgentDef, ge→structuredOutputTool, nLp→structuredSubagentDef,
//          ddo→plainSubagentDef, le→effort, re→opts, rB→parseEffort, pe→defWithEffort
```

`rB` (cli_inner_pretty.js:148923-148932) is the shared effort parser, also used by `/effort` and elsewhere — it accepts a number (if a valid effort level), a string (lowercased, mapped through an alias table `uAi`, validated by `wBe`), or a numeric string, and returns `undefined` for anything invalid/empty:

```javascript
// ============================================
// parseEffort - normalize an effort value to a valid level, else undefined
// Location: cli_inner_pretty.js:148923-148932
// ============================================

// ORIGINAL (for source lookup):
function rB(e) {
  if (e === void 0 || e === null || e === "") return;
  if (typeof e === "number" && lAi(e)) return e;
  let t = String(e).toLowerCase(), n = uAi[t] ?? t;
  if (wBe(n)) return n;
  let r = parseInt(t, 10);
  if (!isNaN(r) && lAi(r)) return r;
  return;
}

// READABLE (for understanding):
function parseEffort(value) {
  if (value === undefined || value === null || value === "") return undefined;  // unset → inherit
  if (typeof value === "number" && isValidEffortNumber(value)) return value;    // numeric effort
  const lower = String(value).toLowerCase();
  const normalized = effortAliasMap[lower] ?? lower;                            // alias resolution
  if (isValidEffortLevel(normalized)) return normalized;                        // "low".."max"
  const asInt = parseInt(lower, 10);
  if (!isNaN(asInt) && isValidEffortNumber(asInt)) return asInt;                // numeric string
  return undefined;                                                             // invalid → inherit, don't throw
}

// Mapping: rB→parseEffort, e→value, lAi→isValidEffortNumber, uAi→effortAliasMap, wBe→isValidEffortLevel
```

### v2.1.156 before — no per-call effort read

In v2.1.156 the agent-runtime selected the subagent def and merged tools/prompt, but **never read an effort opt**. The corresponding line (cli_inner_pretty.js:375131, v2.1.156 bundle) is:

```javascript
// (v2.1.156 before) — subagent def selection; NO effort read anywhere between here and spawn
let Y$ = [...(eH.disallowedTools ?? []), ...(mp6.disallowedTools ?? [])],
  iH = e.schema ? oG_ : rG_,                 // pick StructuredOutput vs plain def (= v2.1.183 nLp/ddo)
  q$ = ... ;
KH = ... ;                                   // merge tools/prompt; no { ...def, effort } merge exists
```

There is no `rB(...effort)` call and no `{ ...def, effort }` merge in the v2.1.156 agent path — confirming the per-call effort opt is genuinely new in v2.1.183, not a rename.

### How it works (step-by-step)

1. **Pick the base subagent def** (`se`): a custom `agentType` def if supplied (`ae`), else the StructuredOutput-forcing def (`nLp`) when the call has a `schema`, else the plain workflow-subagent def (`ddo`). (This selection is the unchanged v2.1.156 logic, just with re-derived names.)
2. **Parse the per-call effort** (`le = rB(re?.effort)`): normalize `opts.effort` through `rB`. Invalid or absent → `undefined`.
3. **Merge conditionally** (`pe`): only if `le !== undefined` does it shallow-merge `{ ...se, effort: le }` onto the def; otherwise the def is used as-is. So omitting `effort` (or passing garbage) preserves the exact v2.1.156 behavior — the agent inherits the session effort.
4. The merged `pe` then flows into the agent's model/permission resolution (`ve = pte(zhe(pe, ...), ...)` @417131) so the per-call effort participates in model selection just like a session effort would.

### Why this approach (trade-offs)

- **Per-stage effort tuning is the natural complement to per-stage `model`.** v2.1.156 already let a workflow override the *model* per `agent()` call (`opts.model`); effort is the other reasoning-cost lever. The description's guidance — "'low' for cheap mechanical stages and higher tiers only for the hardest verify/judge stages" — is exactly the pipeline pattern the orchestration catalog teaches: scan/extract stages run cheap, judge/verify stages run hard. Letting effort vary per agent makes that economically tunable inside one workflow instead of forcing one effort for the whole run.
- **Reusing `rB` rather than a bespoke validator** keeps the workflow effort semantics identical to `/effort` and the rest of the codebase (same alias table, same valid-level set, same numeric handling). A new validator would risk drift (e.g. accepting "xhigh" in one place and not another).
- **Fail-soft, not fail-loud.** `rB` returns `undefined` for an invalid value and the merge is skipped — a bad `effort:"turbo"` silently inherits the session effort rather than throwing and killing the agent mid-run. For a long-running fan-out where one stage's typo shouldn't abort the whole workflow, fail-soft is the right trade-off (consistent with how `agent()` already tolerates skipped agents by returning `null`). The cost is that a typo is silently ignored rather than surfaced; given the description enumerates the exact valid strings, that's an acceptable trade.
- **Shallow-merge onto the def** (rather than threading effort through a separate parameter) means effort rides the same def object that carries the system prompt, tools, and permission mode — one object to flow downstream, no new plumbing.

### Key insight

The `effort` opt closes the gap between the two cost levers a workflow controls: before v2.1.183 a script could pick a cheaper/dearer *model* per agent but was stuck with one *reasoning effort* for every agent in the run. Now both axes are per-call, so the canonical "cheap scan → expensive judge" pipeline can run a `low`-effort grep stage and an `xhigh`-effort verify stage in the same workflow. The implementation is deliberately minimal and fail-soft — a three-line read-parse-merge that reuses the global effort parser — so it adds the capability without any new failure mode that could abort a fan-out.

---

## 6. Summary of the four deltas

| Delta | v2.1.156 (before) | v2.1.183 (after) | Kind |
|---|---|---|---|
| Determinism check | raw regex on body text (`@378256`, false-positives on strings/comments) | AST walk `rWa` over `MemberExpression`/`NewExpression` (`@416439`) | fix (2.1.172) |
| Server-fallback retraction | none; no abort pre-check; `errorCode 7` only in other tools | `r5a` errorCode 7 + `zCe` pre-check & re-check in `validateInput` (`@419415`/`@419442`/`@419457`) | added |
| Output schema | `g0_` — no `taskType`/`workflowName` (`@378186`) | `ILp` — `+taskType` `+workflowName` (`@419372`); "remote"→"cloud" warning text | added |
| `agent()` effort | no `effort` opt in DSL; runtime never read it (`@376122`/`@375131`) | `effort?` documented (`@418215`) + runtime `le = rB(re?.effort)` (`@417123`) | added |

Everything else in the tool object — factory, gate, input schema fields, `checkPermissions`, `meta` parser, `call` launch spine, persistence, UNC rejection, caps — is **carried over unchanged** from v2.1.156 ([baseline `workflow_tool_definition.md`](../../../claude_code_v_2.1.156/analyze/42_workflow/workflow_tool_definition.md)).

---

## 7. Confidence and open items

- **All four deltas are high-confidence**, each verified by reading the cited v2.1.183 line and its v2.1.156 before-line directly. The errorCode 7 novelty is corroborated by the whole-bundle count (`grep -c "errorCode: 7"` = 6 in v2.1.156, 7 in v2.1.183 — exactly one new site, the Workflow `r5a`).
- **Carried caveat (dossier §D3):** the tool description `gdo` (cli_inner_pretty.js:418170+) is ~150 lines; this doc diffed the load-bearing `agent()` signature (`effort?`) and the determinism standing line. There may be additional small wording tweaks elsewhere in the pattern catalog not enumerated here — low impact; a full character-level diff of `gdo` vs v2.1.156 `Fp6` is the place to look for an exhaustive description audit (out of scope for this tool-object-fixes doc).
- **`Hqr` (the server-fallback abort sentinel)** was confirmed as the reason `zCe` matches against, but the exact code path that *aborts with* `Hqr` (the server-fallback dispatcher) lives in the request/dispatch layer and was not traced here — the Workflow-side adoption of errorCode 7 is fully verified; the producer of the sentinel is outside this module's scope.

---

## Related Symbols

> Symbol mappings (single source of truth — do not duplicate as tables in this doc):
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Workflows live here)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Permissions live here)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [symbol_additions_v2_1_183_workflow.md](../00_overview/symbol_additions_v2_1_183_workflow.md) - Per-feature v2.1.183 re-derived workflow symbols

Key functions in this document:
- `WorkflowTool` (obfuscated: `DLp`, cli_inner_pretty.js:419420) — the tool object built by `pi`; `validateInput`/`checkPermissions`/`call`; was `n0_` (built by `yK`) in v2.1.156
- `isNonDeterministic` (obfuscated: `rWa`, cli_inner_pretty.js:416439) — NEW AST-walk determinism check (acorn-walk over `MemberExpression`/`NewExpression`); replaced the v2.1.156 inline regex `@378256`
- `serverFallbackRetraction` (obfuscated: `r5a`, cli_inner_pretty.js:419415) — NEW errorCode 7 result constant ("Tool dispatch was retracted by a server fallback…")
- `isRetractedByServerFallback` (obfuscated: `zCe`, cli_inner_pretty.js:227026) — shared abort-classification check; `signal.aborted && reason === Hqr`
- `workflowOutputSchema` (obfuscated: `ILp`, cli_inner_pretty.js:419372) — output schema; NEW `taskType` + `workflowName` fields; was `g0_` in v2.1.156
- `parseEffort` (obfuscated: `rB`, cli_inner_pretty.js:148923) — shared effort normalizer read by the new `agent()` `effort` opt at `@417123`
- `resolveWorkflowSource` (obfuscated: `n5a`, cli_inner_pretty.js:419272) — scriptPath>name>script precedence; was `b44` in v2.1.156 (logic unchanged)
- `parseWorkflowMeta` (obfuscated: `m0`, cli_inner_pretty.js:416466) — `export const meta` parser; was `FZ` in v2.1.156 (logic unchanged)
- `readWorkflowScriptFile` (obfuscated: `r0t`, cli_inner_pretty.js:419492 callsite) — UNC-reject + bounded read; was `Hj$` in v2.1.156 (logic unchanged)
- `resolveNamedWorkflow` (obfuscated: `jjt`, cli_inner_pretty.js:419495 callsite) — registry lookup by name; was `AT$` in v2.1.156
- `lookupPermissionRules` (obfuscated: `Vte`, cli_inner_pretty.js:585562) — allow/deny/ask rule collector keyed by `ruleContent`; was `d6H` in v2.1.156 (logic unchanged)
- `WorkflowInputError` (obfuscated: `Vjn`, cli_inner_pretty.js:419409) — `Error` subclass thrown by `call` on source/parse failure
- `getAcorn` (obfuscated: `xjn`, cli_inner_pretty.js:411725) / `getAcornWalk` (obfuscated: `ido`, cli_inner_pretty.js:415881) — the acorn parser + acorn-walk modules backing `m0` and `rWa`
- `WORKFLOW_TOOL_NAME` (obfuscated: `zk`, cli_inner_pretty.js:221550) — `"Workflow"`; was `mx` in v2.1.156
- `TaskStop` name (obfuscated: `uP`, cli_inner_pretty.js:220834) — interpolated into the errorCode 3 resume-conflict message
