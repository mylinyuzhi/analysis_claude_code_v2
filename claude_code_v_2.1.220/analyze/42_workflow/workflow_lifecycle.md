# Workflow lifecycle — create, run, resume, adopt

> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, `build_sha 4073f595`, 872,596 lines).
> BASELINE: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`.
> Every `cli_inner_pretty.js:<line>` is a **220** line unless tagged **(193)**.
> Conventions: [`../_CONVENTIONS.md`](../_CONVENTIONS.md)

Companion documents: [workflow_runtime_core.md](workflow_runtime_core.md) (sandbox + concurrency) ·
[workflow_model_resolution.md](workflow_model_resolution.md) ·
[workflow_state_and_ipc.md](workflow_state_and_ipc.md) ·
[workflow_server_authored_launch.md](workflow_server_authored_launch.md)

---

## TL;DR

There are **four** ways a workflow run begins, and they converge on one launcher, `Osn` (`:388585`):

| Entry | Trigger | Resume handle | Anchor |
|---|---|---|---|
| **Tool call** | model invokes `Workflow` | `runId` in the tool result | `S6y.call` `:389494-389568` |
| **Adopt** | a checkpointed run is picked up after a process fork/restart | `scriptSha256`-pinned `scriptPath` | `sEd` `:388865-388906` |
| **Env-delivered** | a CCR session started with `CLAUDE_REMOTE_WORKFLOW_SCRIPT` | none (session *is* the handle) | `:502329-502354` |
| **Server-authored event** | a `workflow_launch` carrier event on a remote transport | none | `:502491-502583` |

The last two are covered in
[workflow_server_authored_launch.md](workflow_server_authored_launch.md); this document owns the
first two plus the shared machinery.

Delta summary for this window (all counts `grep -cF`, 220 vs 193):

| Mechanism | 220 | 193 | Verdict |
|---|---|---|---|
| `scriptSha256` content pin on adopt | 7 | **0** | **NET_NEW** |
| `suppressCompletionNotification` | 3 | **0** | **NET_NEW** |
| `workflow_compile` / `workflow_resolve` counters | 2 / 2 | **0 / 0** | **NET_NEW** |
| `scriptIsVerbatimBuiltIn` telemetry redaction | 5 | **0** | **NET_NEW** |
| `CLAUDE_WORKFLOW_NAME_ONLY` lockdown | 5 | **0** | **NET_NEW** |
| `<diagnostics>` + `agents_empty_result` in the completion message | 1 / 1 | **0 / 0** | **NET_NEW** |
| journal format, key derivation, `qWy = "v2"` | — | — | CARRYOVER |
| meta parser, compiler, await transform, persistence | — | — | CARRYOVER |

---

## 1. Create — from tool call to launch

### 1.1 The tool definition and its five gates

`WorkflowTool` (`S6y`, `:389355-389645`) is registered under `dk` = `"Workflow"` (`:231211`) with
alias `"RunWorkflow"` (`:389357`) and `maxResultSizeChars: 1e5` (`:389359`).

`validateInput` (`:389376-389431`) applies five gates in a deliberate order — cheapest and most
absolute first:

| # | Gate | Failure | `errorCode` | Anchor |
|---|---|---|---|---|
| 1 | tool dispatch retracted by a server fallback | fixed object `_Ed` | 7 | `:389377`, `:389350-389354` |
| 2 | `disableWorkflows` managed setting / `CLAUDE_CODE_DISABLE_WORKFLOWS` | "disabled by managed settings" | 5 | `:389378-389383`, `CQt` `:119310` |
| 3 | feature not enabled for the session | "org policy, launch gate, or the *Dynamic workflows* setting in /config" | 6 | `:389384-389390`, `M0` `:119317` |
| 4 | `CLAUDE_WORKFLOW_NAME_ONLY` set **and** a non-`{name,args}` field present | lists the offending fields | 8 | `:389391-389404` |
| 5 | script resolves, parses, compiles, is deterministic, and no live run owns the `runId` | per-case | 1–4 | `:389405-389429` |

**The enablement chain** (`M0`, `:119317-119323`) is four conditions deep and worth spelling out
because the error message enumerates them:

```javascript
// ============================================
// areWorkflowsEnabled - The four-layer gate behind the Workflow tool
// Location: cli_inner_pretty.js:119310-119349
// ============================================

// ORIGINAL (for source lookup):
function CQt() { return Yt(process.env.CLAUDE_CODE_DISABLE_WORKFLOWS) || SI()?.settings.disableWorkflows === !0; }
function M0() {
  if (CQt()) return !1;
  if (!lJn()) return !1;
  let { available: e, defaultOn: t } = hWi();
  if (!e) return !1;
  return SI()?.settings.enableWorkflows ?? t;
}
function lJn() { return ns("allow_workflows"); }
function lug() {
  if (Yt(process.env.CLAUDE_CODE_WORKFLOWS)) { let t = Ke("tengu_workflows_enabled", !0); return { available: t, defaultOn: t }; }
  if (su(process.env.CLAUDE_CODE_WORKFLOWS)) return { available: !1, defaultOn: !1 };
  if (!Ke("tengu_workflows_enabled", !0)) return { available: !1, defaultOn: !1 };
  return { available: !0, defaultOn: Ca() !== "pro" };
}

// READABLE (for understanding):
function areWorkflowsDisabledByPolicy() {                   // hard kill-switch
  return isTruthy(env.CLAUDE_CODE_DISABLE_WORKFLOWS) || managedSettings()?.settings.disableWorkflows === true;
}
function areWorkflowsEnabled() {
  if (areWorkflowsDisabledByPolicy()) return false;         // 1. managed kill-switch
  if (!isPolicyAllowed("allow_workflows")) return false;    // 2. org policy
  const { available, defaultOn } = workflowAvailability();
  if (!available) return false;                             // 3. launch gate
  return managedSettings()?.settings.enableWorkflows ?? defaultOn;   // 4. user setting, else default
}
function computeWorkflowAvailability() {
  if (isTruthy(env.CLAUDE_CODE_WORKFLOWS)) {                // explicit opt-in still respects the gate
    const gated = featureGate("tengu_workflows_enabled", true);
    return { available: gated, defaultOn: gated };
  }
  if (isFalsy(env.CLAUDE_CODE_WORKFLOWS)) return { available: false, defaultOn: false };
  if (!featureGate("tengu_workflows_enabled", true)) return { available: false, defaultOn: false };
  return { available: true, defaultOn: subscriptionTier() !== "pro" };   // ← Pro must opt in
}

// Mapping: CQt→areWorkflowsDisabledByPolicy, M0→areWorkflowsEnabled, lJn→isPolicyAllowed("allow_workflows"),
//          hWi→workflowAvailability (memoised, :119336-119339), lug→computeWorkflowAvailability,
//          Ke→featureGate, Ca→subscriptionTier, SI→managedSettings, Yt→isTruthy, su→isFalsy
```

**Key insight:** the *default* differs by subscription tier — `defaultOn: Ca() !== "pro"`
(`:119348`). Max and Team sessions get dynamic workflows on by default; Pro sessions must turn them
on in `/config`. This is a cost control, not a capability control: a Pro account can still enable it.
It also explains the hedged wording in the tool's own error string — *"org policy, launch gate, or
the \"Dynamic workflows\" setting in /config"* — the client genuinely cannot tell which of the four
layers said no without re-deriving them, so it lists all three plausible causes.

`hWi` memoises into `sJn` (`:119336-119339`, `:119350`) with **no invalidator**: the availability
verdict is computed once per process. A `/config` toggle changes `enableWorkflows` (read live on
every call) but never `available`.

### 1.2 `CLAUDE_WORKFLOW_NAME_ONLY` — NET_NEW lockdown mode

```javascript
// ============================================
// isNameOnlyWorkflowMode - Restrict this session to bundled, named workflows
// Location: cli_inner_pretty.js:386782-386787 (predicate), :389391-389404 (enforcement)
// ============================================

// ORIGINAL (for source lookup):
function z$t() { return Z.CLAUDE_WORKFLOW_NAME_ONLY; }
var Vxo = "CLAUDE_REMOTE_WORKFLOW_SCRIPT", KPs = "CLAUDE_REMOTE_WORKFLOW_ARGS", LSd = "CLAUDE_WORKFLOW_NAME_ONLY";
...
if (z$t()) {
  let o = [e.script && "script", e.scriptPath && "scriptPath",
           e.resumeFromRunId && "resumeFromRunId", e.remote && "remote"].filter((i) => Boolean(i));
  if (o.length > 0)
    return { result: !1,
      message: `This session restricts the Workflow tool to named workflows (${LSd} is set). Not allowed here: ${o.join(", ")}. Invoke as {name, args} only.`,
      errorCode: 8 };
}

// READABLE (for understanding):
function isNameOnlyWorkflowMode() { return env.CLAUDE_WORKFLOW_NAME_ONLY; }
…
if (isNameOnlyWorkflowMode()) {
  const forbidden = ["script", "scriptPath", "resumeFromRunId", "remote"]
    .filter((k) => Boolean(input[k]));
  if (forbidden.length > 0)
    return { result: false, errorCode: 8,
      message: `This session restricts the Workflow tool to named workflows `
             + `(CLAUDE_WORKFLOW_NAME_ONLY is set). Not allowed here: ${forbidden.join(", ")}. `
             + `Invoke as {name, args} only.` };
}

// Mapping: z$t→isNameOnlyWorkflowMode, LSd→CLAUDE_WORKFLOW_NAME_ONLY_ENV, Z→env
```

**Verdict: NET_NEW.** `CLAUDE_WORKFLOW_NAME_ONLY` is **220=5 / 193=0**;
`restricts the Workflow tool to named workflows` is **220=1 / 193=0**. No changelog bullet in the
`.195`–`.220` window mentions it.

**Why this exists, and why the field list is exactly these four:** the mode's purpose is to make the
Workflow tool *non-programmable* — usable as a menu of vetted, bundled scripts and nothing else. Each
forbidden field is an arbitrary-code channel:

- `script` — obviously.
- `scriptPath` — reads any file on disk as JavaScript.
- `resumeFromRunId` — replays a *previously approved* script that may since have been edited on disk
  (§4 shows the resume path re-reads `scriptPath` and does **not** re-verify content in the tool path).
- `remote` — dispatches to a CCR session outside this session's policy envelope.

Note `remote` is checked even though it is **not in the input schema** — `_6y` (`:389256-389299`) has
no `remote` key, and the schema is `v.strictObject`, so the field can never be present. It is a
defence written against a *future* schema, and a harmless one. (The `...!1` at `:389297` is a
compiled-away conditional spread, i.e. a build-time-disabled extra field.)

The same lockdown is enforced independently inside the nested `workflow()` host (`:386850-386855`),
with a *different* message that names the correct remedy: *"nest with `workflow('<name>')` instead"*.

### 1.3 Script resolution — three sources, one precedence

```javascript
// ============================================
// resolveWorkflowScript - scriptPath > name > script, with built-in detection
// Location: cli_inner_pretty.js:389188-389214
// ============================================

// ORIGINAL (for source lookup):
async function yEd(e) {
  if (e.scriptPath) {
    let t, r;
    if (e.script) ((t = e.script), (r = SEd.resolve(Ht(), e.scriptPath)));
    else { let n = await IRt(e.scriptPath); if ("error" in n) return n; ((t = n.script), (r = n.path)); }
    if (ksn().some((n) => n.script === t))
      return { script: t, resolvedScriptPath: r, source: "built-in", scriptMatchesDefinition: !0 };
    return { script: t, resolvedScriptPath: r };
  }
  if (e.name) {
    let t = await Dsn(e.name, Ht());
    if (!t) { let r = (await Lft(Ht())).map((n) => n.name).join(", ");
              return { error: `Workflow "${e.name}" not found. Available: ${r || "(none)"}` }; }
    return { script: e.script ?? t.script, source: t.source,
             scriptMatchesDefinition: e.script === void 0 || e.script === t.script };
  }
  if (e.script) return { script: e.script };
  return { error: "Must provide script, name, or scriptPath" };
}

// READABLE (for understanding):
async function resolveWorkflowScriptSource(input) {
  if (input.scriptPath) {
    let script, path;
    if (input.script) {                                  // caller supplied both → trust the inline text,
      script = input.script;                             // use scriptPath only as the *identity*
      path = pathMod.resolve(cwd(), input.scriptPath);
    } else {
      const read = await readWorkflowScriptFile(input.scriptPath);
      if ("error" in read) return read;
      ({ script, path } = { script: read.script, path: read.path });
    }
    if (listBuiltInWorkflows().some((w) => w.script === script))       // byte-equal to a bundled script?
      return { script, resolvedScriptPath: path, source: "built-in", scriptMatchesDefinition: true };
    return { script, resolvedScriptPath: path };         // source undefined → telemetry redacts the name
  }
  if (input.name) {
    const found = await resolveNamedWorkflow(input.name, cwd());
    if (!found) {
      const available = (await listAllWorkflows(cwd())).map((w) => w.name).join(", ");
      return { error: `Workflow "${input.name}" not found. Available: ${available || "(none)"}` };
    }
    return { script: input.script ?? found.script, source: found.source,
             scriptMatchesDefinition: input.script === undefined || input.script === found.script };
  }
  if (input.script) return { script: input.script };
  return { error: "Must provide script, name, or scriptPath" };
}

// Mapping: yEd→resolveWorkflowScriptSource, IRt→readWorkflowScriptFile (:162030), ksn→listBuiltInWorkflows,
//          Dsn→resolveNamedWorkflow (:388331), Lft→listAllWorkflows, SEd→path, Ht→cwd
```

**Why `scriptPath` outranks `name` and `script`:** the tool's own schema says so
(*"Takes precedence over `script` and `name`"*, `:389288`), and the reason is the iteration loop the
prose teaches — every invocation persists its script to disk and returns the path, so the model is
expected to `Edit` that file and re-invoke with `{scriptPath}`. If `script` won, a model that kept
both fields in its context would silently re-run the stale inline copy and the edit would appear to
have no effect.

**Why `{scriptPath, script}` together is legal and means "trust the inline text":** this is the
adopt/resume shape. `sEd` and the RC paths already hold the script text in memory and want the path
only as an identity for the run. Re-reading from disk there would be a TOCTOU window.

**`scriptMatchesDefinition` is a privacy flag, not a correctness flag.** It feeds
`tMs(source, scriptIsVerbatimBuiltIn)` (`:388574-388576`), which gates two redactors:

```javascript
// ORIGINAL (:388577-388583):
function Qxo(e, t, r) { if (tMs(t, r) && e) return e; return "custom"; }
function Zxo(e, t, r) { if (tMs(t, r)) return (e ?? "").slice(0, d6y); return ""; }

// READABLE:
function telemetryWorkflowName(name, source, isVerbatimBuiltIn) {
  return isBundledAndUnmodified(source, isVerbatimBuiltIn) && name ? name : "custom";
}
function telemetryWorkflowDescription(desc, source, isVerbatimBuiltIn) {
  return isBundledAndUnmodified(source, isVerbatimBuiltIn) ? (desc ?? "").slice(0, 200) : "";
}
```

A workflow's `meta.name` and `meta.description` are *model-authored free text* about the user's
private codebase. They are reported to telemetry **only** when the script is byte-identical to a
bundled definition — otherwise the name becomes the literal `"custom"` and the description becomes
the empty string. `d6y = 200` (`:388914`) caps even the bundled description.

**Verdict: NET_NEW.** `scriptIsVerbatimBuiltIn` is **220=5 / 193=0**. The redaction pair `Qxo`/`Zxo`
and the predicate `tMs` have no 193 counterpart under any name reachable from these literals; the
2.1.193 launcher passed `s.name` straight into the event.

A second, independent redactor covers the *runtime* label:
`u6y(name, isVerbatimBuiltIn)` (`:388570-388573`) is called at `:388673` for the value handed to the
executor as `workflowName` — the field written into every subagent's agent-context. It returns the
real name for a verbatim built-in, otherwise `_g() ? e : "custom"`, i.e. the real name only when the
process is a first-party/internal build.

### 1.4 `meta` parsing — first statement, pure literal

```javascript
// ============================================
// parseWorkflowScriptMeta - Extract and validate the mandatory `export const meta = {...}` header
// Location: cli_inner_pretty.js:275599-275630
// ============================================

// ORIGINAL (for source lookup):
function $H(e) {
  if (e.length > o1) return { error: `Script exceeds ${o1} bytes` };
  let t;
  try { let { parse: l } = Myo();
        t = l(e, { ecmaVersion: "latest", sourceType: "module",
                   allowAwaitOutsideFunction: !0, allowReturnOutsideFunction: !0 }); }
  catch (l) { return { error: dgy(l, e) }; }
  let r = t.body[0];
  if (!r || r.type !== "ExportNamedDeclaration" || !fgy(r))
    return { error: "`export const meta = { name, description, phases }` must be the FIRST statement in the script" };
  let o = r.declaration.declarations[0].init, i;
  try { i = T6u(o); } catch (l) { return { error: `meta must be a pure literal: ${...}` }; }
  let s = hgy(i);
  if ("error" in s) return s;
  let a = e.slice(r.end).replace(/^[;\s]*\n/, "").trimStart();
  return { meta: s.meta, scriptBody: a };
}

// READABLE (for understanding):
function parseWorkflowScriptMeta(source) {
  if (source.length > MAX_WORKFLOW_SCRIPT_BYTES) return { error: `Script exceeds ${MAX_WORKFLOW_SCRIPT_BYTES} bytes` };
  let ast;
  try {
    ast = acorn.parse(source, { ecmaVersion: "latest", sourceType: "module",
                                allowAwaitOutsideFunction: true, allowReturnOutsideFunction: true });
  } catch (e) { return { error: formatScriptParseError(e, source) }; }        // ← the .202 caret formatter
  const first = ast.body[0];
  if (!first || first.type !== "ExportNamedDeclaration" || !isMetaExportStatement(first))
    return { error: "`export const meta = { name, description, phases }` must be the FIRST statement in the script" };
  let raw;
  try { raw = evaluatePureLiteral(first.declaration.declarations[0].init); }
  catch (e) { return { error: `meta must be a pure literal: ${msg(e)}` }; }
  const validated = validateMeta(raw);
  if ("error" in validated) return validated;
  const scriptBody = source.slice(first.end).replace(/^[;\s]*\n/, "").trimStart();
  return { meta: validated.meta, scriptBody };
}

// Mapping: $H→parseWorkflowScriptMeta, o1→MAX_WORKFLOW_SCRIPT_BYTES (=524288, :162044), Myo→acorn,
//          dgy→formatScriptParseError (:275631), fgy→isMetaExportStatement (:275665),
//          T6u→evaluatePureLiteral (:275699), hgy→validateMeta (:275718)
```

**Why `meta` must be the literal first statement, and a pure literal:** the tool has to answer
*"what is this workflow called and how many phases does it have?"* at three moments when it cannot
run the script — `getToolUseSummary` (`:389480-389493`), `renderToolUseMessage` (`:389569-389591`),
and the permission-dialog preview. Any of those would otherwise require executing untrusted code to
render a label. Restricting `meta` to a statically-evaluable literal makes those three call sites
pure AST work. `T6u` walks the object literal and rejects identifiers, calls, spreads and template
interpolation (the tool prose states this at `:388985-388986`), and the prototype-pollution keys
`__proto__ / constructor / prototype` are blocked by the module-level set `ugy` (`:275744`).

**What validation actually enforces** (`hgy`, `:275718-275727` + `ggy`, `:275728-275738`):

| Field | Rule | Behaviour when absent/wrong |
|---|---|---|
| `name` | non-empty string | **error** |
| `description` | non-empty string | **error** |
| `title` | non-empty string | silently `undefined` |
| `whenToUse` | string | silently `undefined` |
| `phases` | array of `{title: string, detail?: string, model?: string}` | silently `undefined`; non-conforming entries **silently dropped** |

So only two fields are mandatory. Everything else degrades quietly — a `phases` entry whose `title`
is not a string simply vanishes from the progress skeleton with no diagnostic, which is a plausible
source of "my phase box never appeared" confusion.

**Finding: `meta.phases[].model` is parsed and never read.** `ggy` extracts it at `:275733`+`:275735`, it is
carried into the task-registry entry as part of `phases` (`:386480`), persisted into the snapshot
(`:387016`) and re-hydrated (`:735182`) — but no consumer reads `.model` off a phase. The phase
renderers use only `title` and `kind` (`L9o`, `:650505-650518`; `pya`, `:651229-651235`). The tool
prose nevertheless instructs the model to set it: *"Add `model` to a phase entry when that phase uses
a specific model override"* (`:388985`). It is documentation-only metadata with no runtime effect —
worth knowing before anyone reads a phase's `model` as authoritative.

### 1.5 Compile — the await transform

`compileWorkflowScript` (`Cft`, `:386354-386376`) does three things:

1. **A syntax pre-check** by constructing `Function("async function _check() {'use strict';\n" + body + "\n}")`.
   This is cheap and produces a `SyntaxError` with a useful message before the expensive rewrite.
2. **`rewriteAwaitsForVM`** (`jWy`, `:386287-386353`) — the actual transform.
3. **`new vm.Script(wrapped, { filename: "workflow.js", importModuleDynamically: throws })`**.

Success and failure are both counted, which is new:

```javascript
// ORIGINAL:  return (be("workflow_compile"), { ok: !0, vmScript: n });
//            return (pe("workflow_compile", "syntax_error"), { ok: !1, error: `SyntaxError: ${…}` });
// READABLE:  countSuccess("workflow_compile"); … countFailure("workflow_compile", "syntax_error");
```

**Verdict: NET_NEW counters.** `workflow_compile` is **220=2 / 193=0** and `workflow_resolve`
(emitted in `validateInput` at `:389408`/`:389411` for the named-workflow lookup) is
**220=2 / 193=0**. The compile and resolve *mechanisms* are carryover; the instrumentation is not.
Neither appears in the changelog.

**What the await transform does and why it must exist.** Every `await X` in the script is rewritten
to `await __wRg$((X))`, where `__wRg$` is bound to `Promise.resolve.bind(Promise)` from the **host**
realm (`:386359`, `Cg = "__wRg$"` at `:386384`):

```javascript
// ============================================
// rewriteAwaitsForVM (excerpt) - wrap every awaited value so cross-realm thenables resolve correctly
// Location: cli_inner_pretty.js:386300-386353
// ============================================

// ORIGINAL (for source lookup):
let s = [], a = (u) => { if (!u) return; s.push([u.start, ` ${Cg}((`], [u.end, "))"]); },
    l = (u) => { for (let d = u.length - 2; d >= 0; d--) { let p = u[d];
        if (p && (p.type === "FunctionDeclaration" || p.type === "FunctionExpression" || p.type === "ArrowFunctionExpression")) return p; }
      return; };
r.ancestor(i, {
  VariableDeclaration(u) { if (u.kind === "await using") throw SyntaxError("'await using' declarations are not supported in workflow scripts."); },
  AwaitExpression(u) { a(u.argument); },
  ArrowFunctionExpression(u) { if (u.async && u.expression) a(u.body); },
  ForOfStatement(u) { if (u.await) s.push([u.right.start, ` ${Cg}a((`], [u.right.end, "))"]); },
  ReturnStatement(u, d, p) { let f = l(p); if (!f?.async) return;
    if (f.generator) { if (u.argument) s.push([u.argument.start, ` await ${Cg}((`], [u.argument.end, "))"]); } else a(u.argument); },
  YieldExpression(u, d, p) { let f = l(p); if (!(f?.async && f.generator)) return;
    if (u.delegate) { if (u.argument) s.push([u.argument.start, ` ${Cg}a((`], [u.argument.end, "))"]); } else a(u.argument); },
});
s.sort((u, d) => d[0] - u[0]);
let c = o; for (let [u, d] of s) c = c.slice(0, u) + d + c.slice(u);
return c.slice(28, c.length - 5);

// READABLE (for understanding):
const edits = [];
const wrapAwait = (node) => { if (!node) return; edits.push([node.start, ` __wRg$((`], [node.end, "))"]); };
const enclosingFunction = (ancestors) => { /* nearest function ancestor, skipping the node itself */ };
walk.ancestor(ast, {
  VariableDeclaration(n) { if (n.kind === "await using") throw new SyntaxError("'await using' declarations are not supported in workflow scripts."); },
  AwaitExpression(n)          { wrapAwait(n.argument); },
  ArrowFunctionExpression(n)  { if (n.async && n.expression) wrapAwait(n.body); },   // async x => expr — implicit await
  ForOfStatement(n)           { if (n.await) edits.push([n.right.start, ` __wRg$a((`], [n.right.end, "))"]); },
  ReturnStatement(n, _s, anc) { const f = enclosingFunction(anc); if (!f?.async) return;
                                if (f.generator) { if (n.argument) edits.push([n.argument.start, ` await __wRg$((`], [n.argument.end, "))"]); }
                                else wrapAwait(n.argument); },                        // async fn return — implicit await
  YieldExpression(n, _s, anc) { const f = enclosingFunction(anc); if (!(f?.async && f.generator)) return;
                                if (n.delegate) edits.push([n.argument.start, ` __wRg$a((`], [n.argument.end, "))"]);
                                else wrapAwait(n.argument); },
});
edits.sort((a, b) => b[0] - a[0]);      // apply right-to-left so earlier offsets stay valid
let out = wrappedSource; for (const [at, text] of edits) out = out.slice(0, at) + text + out.slice(at);
return out.slice(28, out.length - 5);   // strip the temporary `(async () => {'use strict';\n` … `\n})()` frame

// Mapping: jWy→rewriteAwaitsForVM, Cg→"__wRg$", a→wrapAwait, l→enclosingFunction, s→edits, r→acornWalk
```

**Why this is necessary:** `await` on a *cross-realm* promise is the classic `node:vm` footgun.
`await p` performs `PromiseResolve(%Promise%, p)` using the **current realm's** `%Promise%`. Inside
the guest, that is the guest's `Promise`, which does not recognise a host promise as a native
promise and therefore falls back to the thenable path — reading `p.then` and calling it. That works,
but it means guest code can intercept resolution of *any* host promise by installing
`Promise.prototype.then`, and it also means an object with a getter on `then` gets invoked with guest
`this`. Wrapping every awaited value in a **host-realm** `Promise.resolve` normalises it to a host
promise before the guest's `await` ever touches it.

**Six syntactic forms must be covered, not one**, because implicit awaits exist:
- explicit `await X`,
- `async x => X` (concise arrow body is an implicit await of the return value),
- `return X` inside any `async function`,
- `for await (… of X)` — wrapped with `__wRg$a`, the *async-iterator* adapter compiled at
  `:386359-386360`, not the plain resolver,
- `yield X` and `yield* X` inside an `async function*`.

Missing any one would leave an unwrapped cross-realm resolution. `await using` is rejected outright
rather than transformed — its disposal semantics have no single await site to wrap.

The `__wRg$a` adapter (the long IIFE at `:386359`) re-implements the async-iteration protocol
defensively: it validates that `@@asyncIterator` is callable, that `next`/`return`/`throw` exist and
are functions, and that each step result is an object — throwing precise `TypeError`s otherwise. A
hostile guest iterator therefore cannot make the host loop misbehave.

Finally, `r.full(i, …)` (`:386294-386297`) rejects any identifier starting with `__wRg$` and any
`with` statement — the former so guest code cannot shadow the injected helpers, the latter because
`with` defeats the static scoping the wrapper assumes.

**Verdict: CARRYOVER.** `Iterator.next is not a function` and
`'with' statements are not supported in workflow scripts.` are both 1/1.

### 1.6 Persistence — every invocation writes its script to disk

```javascript
// ============================================
// persistWorkflowScript - Fire-and-forget write of the script under the session dir
// Location: cli_inner_pretty.js:162010-162029
// ============================================

// ORIGINAL (for source lookup):
function Roo() { return Rtr.join(MK(Ht()), kt(), "workflows", "scripts") + Rtr.sep; }
function TLg(e, t) { return `${Roo()}${fbe(e)}-${t}.js`; }
function Loo(e, t, r) {
  let n = Roo(), o = TLg(e, t);
  return (
    (async () => { try { (await Ioo.mkdir(n, { recursive: !0, mode: 448 }),
                         await Ioo.writeFile(o, r, { encoding: "utf-8", mode: 384 })); }
                   catch (i) { w(`Failed to persist workflow script to ${o}: ${i}`, { level: "warn" }); } })(),
    o
  );
}

// READABLE (for understanding):
function workflowScriptDir() { return path.join(projectStateDir(cwd()), sessionId(), "workflows", "scripts") + path.sep; }
function workflowScriptPath(name, runId) { return `${workflowScriptDir()}${slugify(name)}-${runId}.js`; }
function persistWorkflowScript(name, runId, source) {
  const dir = workflowScriptDir();
  const file = workflowScriptPath(name, runId);
  void (async () => {                          // deliberately NOT awaited
    try {
      await fs.mkdir(dir, { recursive: true, mode: 0o700 });
      await fs.writeFile(file, source, { encoding: "utf-8", mode: 0o600 });
    } catch (e) { logWarn(`Failed to persist workflow script to ${file}: ${e}`); }
  })();
  return file;                                 // returned synchronously
}

// Mapping: Loo→persistWorkflowScript, Roo→workflowScriptDir, TLg→workflowScriptPath,
//          fbe→slugify (:162002), MK→projectStateDir, kt→sessionId, Ht→cwd, Ioo→fs/promises
```

Three deliberate choices:

- **The write is not awaited, but the path is returned synchronously.** The tool result must carry
  `scriptPath` immediately, and the model will not read the file until at least one more turn has
  elapsed. Blocking the launch on a disk write would add latency to every invocation for no benefit;
  a failed write degrades to a warning and an unusable-but-harmless path.
- **`mode: 448` (`0o700`) on the directory and `mode: 384` (`0o600`) on the file.** Workflow scripts
  encode the user's task and often their repository structure; they are treated as private state,
  not as project files.
- **The filename is `<slug(meta.name)>-<runId>.js`** — human-recognisable and collision-free. `fbe`
  lowercases, collapses non-alphanumerics to `-`, trims, and falls back to the literal `"workflow"`
  for a name with no usable characters.

The read side, `readWorkflowScriptFile` (`IRt`, `:162030-162041`), applies three guards: UNC paths
are rejected outright (`tu(e)`, a Windows-specific hardening), the path is resolved against `cwd()`,
and the read is size-capped by asking for `o1 + 1` bytes and rejecting if the result exceeds
`o1 = 524288` (`:162044`) — a read-limit rather than a stat-then-read, which closes the TOCTOU
window between checking the size and reading.

### 1.7 `checkPermissions` — the script is shown, not the path

`checkPermissions` (`:389432-389476`) resolves the permission key `n` to `e.name` **only when
`scriptPath` is absent** (`:389434`). The consequence is that rule-based allow/deny works for named
workflows and never for inline or path-based ones — those always reach the default branch, which is
`behavior: "ask"`.

The important line is `updatedInput`:

```javascript
// ORIGINAL (:389444-389450):
let s = e;
if (e.scriptPath) { let c = await IRt(e.scriptPath); if (!("error" in c)) s = { ...e, script: c.script }; }
else if (e.name)  { let c = await Dsn(e.name, Ht());  s = { ...e, script: c?.script }; }

// READABLE:
let shown = input;
if (input.scriptPath) {                                  // materialise the file contents …
  const read = await readWorkflowScriptFile(input.scriptPath);
  if (!("error" in read)) shown = { ...input, script: read.script };
} else if (input.name) {                                 // … or the named definition …
  const found = await resolveNamedWorkflow(input.name, cwd());
  shown = { ...input, script: found?.script };
}
```

**Why:** the approval dialog must show the *code that will run*, not a filename. A user asked to
approve `Workflow({scriptPath: "./wf.js"})` has been shown nothing. Inlining the resolved text into
`updatedInput` means the dialog renders the script body, and — because `updatedInput` is what the
tool is subsequently called with — it also **pins** the approved content: the `call` path re-resolves,
but `yEd`'s `{scriptPath, script}` branch (§1.3) then prefers the inlined text over a re-read.
That is the TOCTOU closure for the interactive path. (The *adopt* path needs a different mechanism
because there is no dialog; see §5.)

A `suggestions: [{ type: "addRules", rules: [{ toolName: dk, ruleContent: n }] }]` block is attached
only when a name exists (`:389465-389474`) — "always allow this workflow" is offered for named
workflows and is meaningless for inline ones.

### 1.8 `call` — what actually happens

```javascript
// ============================================
// WorkflowTool.call - Resolve, parse, compile, mint ids, launch, return immediately
// Location: cli_inner_pretty.js:389494-389568
// ============================================

// ORIGINAL (for source lookup, abridged):
let d = e.resumeFromRunId ?? `wf_${bEd.randomUUID().slice(0, 12)}`,
  p = s1("local_workflow"), f = u.meta.description, m = u.meta.name, g = Cft(u.scriptBody);
if (!g.ok) return (pe("task_local_workflow", "compile_failed"),
                   { data: { status: "async_launched", taskId: p, taskType: "local_workflow",
                             workflowName: m, runId: d, summary: f, error: g.error } });
let y = gte(d), _ = l ?? Loo(m, d, s), E = e.scriptPath ? void 0 : a,
    A = e.scriptPath ? "scriptPath" : (a ?? "inline"), b = Qxo(m, E, c), T = Zxo(u.meta.description, E, c);
return (O("tengu_workflow_launched", { … }), Osn({ … }),
        { data: { status: "async_launched", taskId: p, taskType: "local_workflow",
                  workflowName: m, runId: d, summary: f, transcriptDir: y, scriptPath: _ } });

// READABLE (for understanding):
const runId  = input.resumeFromRunId ?? `wf_${crypto.randomUUID().slice(0, 12)}`;
const taskId = mintTaskId("local_workflow");
const compiled = compileWorkflowScript(parsed.scriptBody);
if (!compiled.ok) {                                  // compile failure is a *result*, not a throw
  countFailure("task_local_workflow", "compile_failed");
  return { data: { status: "async_launched", taskId, taskType: "local_workflow",
                   workflowName: parsed.meta.name, runId, summary: parsed.meta.description,
                   error: compiled.error } };        // mapToolResultToToolResultBlockParam turns this into is_error
}
const transcriptDir = workflowTranscriptDir(runId);
const scriptPath    = resolvedScriptPath ?? persistWorkflowScript(parsed.meta.name, runId, script);
const source        = input.scriptPath ? undefined : resolvedSource;
const invocationSrc = input.scriptPath ? "scriptPath" : (resolvedSource ?? "inline");
logEvent("tengu_workflow_launched", { … });
launchWorkflow({ taskId, workflowRunId: runId, script, scriptPath, args: input.args,
                 meta: parsed.meta, vmScript: compiled.vmScript, toolUseContext, canUseTool,
                 toolUseId: toolUseContext.toolUseId, transcriptDir,
                 telemetry: { … }, isResume: input.resumeFromRunId != null,
                 invokingRequestId: apiRequest?.requestId });
return { data: { status: "async_launched", taskId, taskType: "local_workflow",
                 workflowName: parsed.meta.name, runId, summary: parsed.meta.description,
                 transcriptDir, scriptPath } };

// Mapping: d→runId, p→taskId, g→compiled, y→transcriptDir, _→scriptPath, A→invocationSrc,
//          s1→mintTaskId, gte→workflowTranscriptDir (:386965), Osn→launchWorkflow (:388585),
//          bEd→crypto, Cft→compileWorkflowScript
```

Three observations:

- **The `runId` format is `wf_` + 12 chars of a UUID** (`:389501`), and the input schema's regex is
  `/^wf_[a-z0-9-]{6,}$/` (`:389292`) — deliberately laxer than the generator, so a run id minted by
  an older build (or by the RC path at `:502226`) still validates.
- **`call` returns before the workflow does anything.** `Osn` is invoked for its side effect; the
  tool result is `status: "async_launched"` with a `taskId`. Everything after this point reaches the
  model through the task-notification channel — see
  [workflow_state_and_ipc.md](workflow_state_and_ipc.md).
- **A compile failure is returned as data with `error` set**, not thrown. `mapToolResultToToolResultBlockParam`
  (`:389592-389600`) converts it to `is_error: true` with the text *"Workflow script has a syntax
  error and was not launched"*. This keeps the failure inside the structured-output contract while
  still marking it an error for the model — a `throw` would lose the `taskId`/`runId` fields that the
  outputSchema documents.

`tengu_workflow_launched` carries nine fields (`:389528-389538`), of which `workflow_name` and
`workflow_description` are the redacted pair from §1.3. **Verdict: DELTA** — the event exists in 193
(220=2 / 193=1) but 2.1.220 has a *second* emission site at `:502231` (the server-authored path) and
the redaction of the two text fields is new.

---

## 2. Run — `Osn`, the single launcher

`launchWorkflow` (`Osn`, `:388585-388864`) is the join point for all four entries. It is
synchronous in its setup and returns the task-registry entry; the run itself is a detached async IIFE
(`:388632-388861`).

**Setup, in order:**

1. **Resume cleanup** (`:388604-388608`) — when `isResume`, remove any non-running registry entry for
   the same `workflowRunId`, so the new run replaces the stale card rather than appearing beside it.
2. **Owner resolution** (`:388609`) — `g$t(l.agentId, l.taskRegistry)` returns the invoking agent id
   *only if* it is a live subagent, never `"main-session"`. This is what makes a workflow launched by
   a subagent notify that subagent rather than the main loop.
3. **Registry entry** (`:388610-388625`) — `GPs` builds the `local_workflow` task (see
   [workflow_state_and_ipc.md §1](workflow_state_and_ipc.md)) and registers it.
4. **Keepalive** (`:388626`) — `Xse(_, `workflow:${t}`, …)` adds a keepalive reason to the owning
   subagent so it is not evicted while its workflow runs; released by `nG` in every terminal path.
5. **Abort plumbing** (`:388627`) — the tool-use context is cloned with the *task's* abort controller,
   so `TaskStop` kills the workflow and everything under it.
6. **Budget** (`:388628-388629`) — see [workflow_runtime_core.md §3.2](workflow_runtime_core.md).
7. **Progress batcher** (`:388634-388658`) — see [workflow_state_and_ipc.md §3](workflow_state_and_ipc.md).
8. **`rEd`** (`:388659-388675`) — the VM run.

**Teardown**, after `rEd` resolves:

| Step | Line | Note |
|---|---|---|
| adopted-away check | `:388676-388679` | if the abort reason is `"background"`, the run was handed to a fork — cancel the batcher and return **without** notifying |
| final flush | `:388680` | `R.flushNow()` |
| status derivation | `:388685` | `killed` if aborted, else `failed` if `L.error`, else `completed` |
| `tengu_workflow_completed` | `:388700-388710` | includes `workflow_run_id`, redacted name/description, agent count, tokens, tool calls, duration |
| per-phase telemetry | `:388711-388753` | **only for verbatim built-ins** (`tMs(p.source, p.scriptIsVerbatimBuiltIn)`) |
| snapshot | `:388755-388775` | `OSd` writes `<runId>.json` |
| registry transition | `:388780-388791` | `Gxo` (failed) or `VPs` (completed) |
| notification | `:388792-388813` | `qxo`, unless `suppressCompletionNotification` |

**Why per-phase telemetry is gated on "verbatim built-in":** `tengu_workflow_phase_completed` carries
`phase_title` (`:388745`) — free text from a model-authored script. The same privacy rule as §1.3
applies, but here it is implemented by *skipping the events entirely* rather than by redacting the
field, because a phase event with its title blanked carries no analytical value.

**`suppressCompletionNotification` is NET_NEW** (**220=3 / 193=0**). It is set only by the
server-authored launcher (`:502257`), whose caller collects the result via `onSettled` and posts it
on the carrier instead. When set, the task is marked `notified: true` and the keepalive is released
directly (`:388792-388793`, and again on the error path at `:388832-388834`) — otherwise the task
would sit forever holding its owner alive, waiting for a notification that will never be built.

---

## 3. The journal — how resume actually works

### 3.1 Storage

```javascript
// ============================================
// LocalFileJournal - Append-only JSONL record of agent starts and results
// Location: cli_inner_pretty.js:387081-387116 (class), :386965-386968 (dir)
// ============================================

// ORIGINAL (for source lookup):
function gte(e) { let t = l8() ?? tS(gn()); return Y$t.join(t, kt(), "subagents", "workflows", e); }
class JPs {
  path; dirReady = !1;
  constructor(e) { this.path = Kxo.join(gte(e), "journal.jsonl"); }
  async load() {
    let e;
    try { e = await Kfr.readFile(this.path, "utf8"); }
    catch (r) { if (qt(r)) return $Sd([]); throw r; }
    let t = [];
    for (let r of e.split("\n")) { if (!r) continue;
      try { t.push(JSON.parse(r)); }
      catch (n) { w(`LocalFileJournal: skipping unparseable line in ${this.path}: ${n}`); } }
    return $Sd(t);
  }
  async append(e) {
    if (!this.dirReady) (await Kfr.mkdir(Kxo.dirname(this.path), { recursive: !0 }), (this.dirReady = !0));
    await Kfr.appendFile(this.path, `${JSON.stringify(e)}\n`, "utf8");
  }
}

// READABLE (for understanding):
function workflowTranscriptDir(runId) {
  const base = sessionProjectDir() ?? projectStateDirFor(originalCwd());
  return path.join(base, sessionId(), "subagents", "workflows", runId);
}
class LocalFileJournal {
  path; dirReady = false;
  constructor(runId) { this.path = path.join(workflowTranscriptDir(runId), "journal.jsonl"); }
  async load() {
    let text;
    try { text = await fs.readFile(this.path, "utf8"); }
    catch (e) { if (isENOENT(e)) return indexJournal([]); throw e; }   // missing journal = empty, not an error
    const entries = [];
    for (const line of text.split("\n")) {
      if (!line) continue;
      try { entries.push(JSON.parse(line)); }
      catch (e) { logWarn(`LocalFileJournal: skipping unparseable line in ${this.path}: ${e}`); }
    }
    return indexJournal(entries);            // tolerate a torn final line
  }
  async append(entry) {
    if (!this.dirReady) { await fs.mkdir(path.dirname(this.path), { recursive: true }); this.dirReady = true; }
    await fs.appendFile(this.path, `${JSON.stringify(entry)}\n`, "utf8");
  }
}

// Mapping: JPs→LocalFileJournal (name leaked at :387100), gte→workflowTranscriptDir,
//          $Sd→indexJournal (:387035), qt→isENOENT, Kfr→fs/promises, Kxo/Y$t→path
```

The class name **`LocalFileJournal` is leaked verbatim** in its own warning string (`:387100`) —
`grep -cF 'LocalFileJournal'` → 220=1 / 193=1 — so this is one of the rare cases where the real
identifier is recoverable rather than inferred.

**Why JSONL and why per-line error tolerance:** the journal is appended concurrently from up to 16
agents (`append` is not serialised — each call is an independent `appendFile`). Append-only JSONL is
the only format that survives that without a lock: each write is a single `write(2)` of a
newline-terminated record, and POSIX append mode makes those atomic below `PIPE_BUF`-ish sizes.
A crash mid-write leaves one torn line, and `load()`'s per-line `try` discards exactly that line and
keeps everything before it. A JSON array would lose the whole file.

Two consequences worth naming: (a) a very large agent result *can* exceed the atomic-append size and
interleave — the per-line `try` degrades that to a lost record, i.e. one agent re-runs on resume;
(b) `dirReady` is a per-instance latch, so the `mkdir` race between concurrent first-appends is
resolved by `recursive: true` being idempotent.

### 3.2 Indexing

```javascript
// ORIGINAL (:387035-387046):
function $Sd(e) {
  let t = new Map(), r = new Map();
  for (let n of e)
    if (n.type === "result") t.set(n.key, n);
    else if (n.type === "started") { let o = r.get(n.key); if (o) o.push(n); else r.set(n.key, [n]); }
  return { results: t, started: r };
}

// READABLE:
function indexJournal(entries) {
  const results = new Map();      // key → the LAST result wins
  const started = new Map();      // key → every start attempt, in order
  for (const e of entries) {
    if (e.type === "result") results.set(e.key, e);
    else if (e.type === "started") {
      const prior = started.get(e.key);
      if (prior) prior.push(e); else started.set(e.key, [e]);
    }
  }
  return { results, started };
}
```

**Why `started` is an array while `results` is a scalar:** a key with two `started` records and no
`result` is the signature of a crash-and-respawn — the agent began, the process died, the run was
resumed, and it began again. That count is emitted as
`tengu_workflow_journal_started_hit_respawn` (`:387356-387357`) when a *cache miss* lands on a key
that has prior starts. It is the only telemetry in the product that measures "how often does a
resumed workflow re-do work it had already begun".

### 3.3 The cache key — a running prefix hash

```javascript
// ============================================
// deriveJournalKey - Chained hash of (previousKey, prompt, canonical opts)
// Location: cli_inner_pretty.js:387077-387080 (hash), :387047-387076 (canonicalisation)
// ============================================

// ORIGINAL (for source lookup):
function FSd(e, t, r) {
  let n = NSd.createHash("sha256").update(r).update("\x00").update(e).update("\x00").update(VWy(t)).digest("hex");
  return `${qWy}:${n}`;
}
function VWy(e) {
  if (!e) return "{}";
  let t = {}, r = ["schema", "model", "effort", "isolation", "agentType"];
  for (let o of r) { let i = e[o]; if (i === void 0 || typeof i === "function") continue; t[o] = i; }
  let n = (o) => { …stable-sort object keys, skip __proto__, drop functions, bound array length… };
  return JSON.stringify(n(t));
}

// READABLE (for understanding):
const JOURNAL_KEY_VERSION = "v2";                     // qWy, :387120
function deriveJournalKey(promptString, opts, previousKey) {
  const digest = crypto.createHash("sha256")
    .update(previousKey).update("\0")                 // ← the chain link
    .update(promptString).update("\0")
    .update(canonicaliseOpts(opts))
    .digest("hex");
  return `${JOURNAL_KEY_VERSION}:${digest}`;
}
function canonicaliseOpts(opts) {
  if (!opts) return "{}";
  const picked = {};
  for (const k of ["schema", "model", "effort", "isolation", "agentType"]) {   // ← the ONLY five
    const v = opts[k];
    if (v === undefined || typeof v === "function") continue;
    picked[k] = v;
  }
  return JSON.stringify(deterministicClone(picked));   // keys sorted, functions dropped, __proto__ skipped
}

// Mapping: FSd→deriveJournalKey, VWy→canonicaliseOpts, qWy→JOURNAL_KEY_VERSION,
//          e→promptString, t→opts, r→previousKey, NSd→crypto
```

And the driving loop, inside `agent()`:

```javascript
// ORIGINAL (:387329-387358, abridged):
if (a) {
  ((ge = FSd(ve, ae, E)), (E = ge));
  let Ze = A ? void 0 : l?.results.get(ge);
  if (Ze !== void 0) return (emit cached progress node, m(Ze.result));
  A = !0;
  let He = l?.started.get(ge);
  if (He && He.length > 0) O("tengu_workflow_journal_started_hit_respawn", { attempts: He.length });
}

// READABLE:
if (journal) {
  key = deriveJournalKey(promptString, opts, chainState);
  chainState = key;                                     // every call advances the chain
  const hit = cacheDisabled ? undefined : journalSnapshot?.results.get(key);
  if (hit !== undefined) { emitCachedNode(hit); return cloneIntoGuest(hit.result); }
  cacheDisabled = true;                                 // ← FIRST MISS DISABLES THE CACHE FOREVER
  const priorStarts = journalSnapshot?.started.get(key);
  if (priorStarts?.length) logEvent("tengu_workflow_journal_started_hit_respawn", { attempts: priorStarts.length });
}
```

**How "longest unchanged prefix" is implemented — this is the whole design in three lines.**

- `E` (`chainState`) starts as `""` (`:387163`) and is overwritten with each derived key
  (`:387330`). So key *n* depends on key *n−1*, which depends on *n−2*, … — a Merkle chain over the
  sequence of `(prompt, opts)` pairs.
- Therefore **changing call *k* changes the key of every call from *k* onward**, even if their own
  prompts are identical. The cache stops hitting exactly at the first edit, which is precisely the
  contract the tool prose states: *"the longest unchanged prefix of agent() calls returns cached
  results instantly; the first edited/new call and everything after it runs live"* (`:389101`).
- `A` (`cacheDisabled`) is a one-way latch set on the first miss (`:387355`). Even if a later key
  coincidentally matches a journal entry, it is ignored. **Why:** a chain is only meaningful as a
  prefix. Once the sequence has diverged, a later match would mean a *different* call reusing a
  *different* call's result — the ordering assumption that makes the chain sound has already been
  violated.

**The five opts that participate in the key, and the ones that do not.** Only
`schema`, `model`, `effort`, `isolation`, `agentType` are hashed. Deliberately excluded:

| Excluded | Why it is safe to exclude |
|---|---|
| `label` | display only; renaming a step should not invalidate its result |
| `phase` | grouping only; regrouping the progress tree should not re-run agents |
| `stallMs` | a timeout, not an input; changing it does not change what the agent would produce |

That is a *semantic* choice, not an oversight: the key hashes what changes the agent's **output**,
not what changes its **presentation**. It is also why the tool prose can promise *"Same script + same
args → 100% cache hit"* while the model is free to relabel steps between runs.

**`deterministicClone` matters more than it looks.** `JSON.stringify` of an object literal is
key-*insertion*-ordered, so `{model: "x", effort: "high"}` and `{effort: "high", model: "x"}` would
hash differently. The recursive walk sorts `Object.keys` at every level (`:387063`), bounds array
length via `Number.isSafeInteger` (`:387056-387058`), drops functions, and skips `__proto__`. The
result is a canonical form in which a re-ordered `schema` object still hits cache.

**`qWy = "v2"` is a format version baked into every key** (`:387120`). Bumping it invalidates every
journal in existence in one edit — the standard escape hatch for when the hashed tuple must change.
It is `"v2"` in **both** bundles, so no invalidation happened in this window.

**Two limitations the prose does not state, both visible here:**

1. **`args` is not in the key.** Re-running with `{scriptPath, resumeFromRunId, args: <different>}`
   replays cached results derived from the *old* args, as long as the prompt strings the script
   builds happen to be unchanged. The recovery hints do pass `args` back (`:386688`, `:386706`), so
   the intended usage re-supplies the same value — but nothing enforces it.
2. **Resume is same-session only**, stated in the schema description (`:389295`) and structurally
   true: `gte(runId)` includes `kt()` (the session id), so a new session cannot find the journal.

### 3.4 Writing

Two record types, written from inside `agent()`:

```javascript
// ORIGINAL (:387360-387372):
Me = (Ze) => { ((Ue = !0), (Oe = Ze), !a) ? undefined :
  a.append({ type: "started", key: ge, agentId: Ze }).catch((He) =>
    w(`workflow journal started-append failed: ${He}`, { level: "warn" })); },
ze = async (Ze) => {
  if (a && ge && Ze !== null)
    await a.append({ type: "result", key: ge, agentId: Oe ?? "", result: Ze })
      .catch((He) => w(`workflow journal result-append failed: ${He}`, { level: "warn" }));
  return Ze;
},

// READABLE:
const onAgentIdKnown = (agentId) => {
  agentStarted = true; startedAgentId = agentId;
  if (!journal) return;
  journal.append({ type: "started", key, agentId })
    .catch((e) => logWarn(`workflow journal started-append failed: ${e}`));   // fire-and-forget
};
const recordResult = async (value) => {
  if (journal && key && value !== null)                        // ← null results are NOT journalled
    await journal.append({ type: "result", key, agentId: startedAgentId ?? "", result: value })
      .catch((e) => logWarn(`workflow journal result-append failed: ${e}`));
  return value;
};
```

- The `started` append is **not awaited** — it is a crash-forensics breadcrumb, and blocking every
  agent launch on a disk write would serialise the fan-out.
- The `result` append **is** awaited, before the value is returned to the script (`:387396`). If the
  process dies between the agent finishing and the script consuming the value, the journal already
  has it. This ordering is the difference between resume being useful and resume being a coin flip.
- **`value !== null` means skipped and API-errored agents are never cached.** `agent()` returns
  `null` for a user-skipped agent (`:387839`) and for an API error (`:387857-387863`). Not journalling
  those makes them retry on resume, which is the desired behaviour — but it also means a workflow
  where many agents legitimately return `null` gets no cache benefit for them.

**Verdict for §3 as a whole: CARRYOVER.** `journal.jsonl`, `LocalFileJournal`,
`tengu_workflow_journal_started_hit_respawn` and the `"v2"` prefix are all 1/1 across the bundles.
The one new thing near this machinery is *documentation*: the added sentence in the tool prose
(`:389101`) and the `<diagnostics>` block in the completion notification (§ below and
[workflow_state_and_ipc.md §5](workflow_state_and_ipc.md)) both now point the model at
`journal.jsonl` before it starts diagnosing an empty result.

---

## 4. Resume — the tool path

Resuming is *not* a distinct code path. It is the ordinary `call` path with three differences:

1. **`runId` is reused instead of minted** (`:389501`) — `e.resumeFromRunId ?? mint()`. Because the
   journal lives at `gte(runId)`, reusing the id is the entire mechanism by which the journal is found.
2. **A liveness check runs in `validateInput`** (`:389421-389429`):

   ```javascript
   // ORIGINAL:
   for (let [o, i] of Object.entries(t.taskRegistry.all()))
     if (i.type === "local_workflow" && i.status === "running" && i.workflowRunId === e.resumeFromRunId)
       return { result: !1, message: `Workflow ${e.resumeFromRunId} is still running (task ${o}). Stop it first with ${f1}({taskId: "${o}"}) before resuming.`, errorCode: 3 };

   // READABLE: refuse to resume a run that is still going — two live runs sharing one journal
   //           would interleave appends under the same keys and corrupt the prefix chain.
   ```
3. **Stale cards are reaped** in `Osn` (`:388604-388608`) and `be("task_local_workflow_resume")` is
   counted.

Note what is **not** re-verified: the tool path re-reads `scriptPath` from disk (`yEd` → `IRt`) with
no content pin. Between the original approval and the resume, that file may have changed —
intentionally, since editing it is the documented workflow. `checkPermissions` runs again on the
resume invocation and inlines the *current* file contents into `updatedInput` (§1.7), so the user is
re-shown the edited script and re-approves. The pinning gap is closed by the human, not by a hash.
Contrast §5, where there is no human.

**The resume hint appears in four places**, each phrased for its context:

| Where | Wording | Anchor |
|---|---|---|
| tool prose | *"relaunch with `Workflow({scriptPath, resumeFromRunId})` — the longest unchanged prefix…"* | `:389101` |
| tool result | *"To resume after editing the script: … (cached results may themselves be empty — inspect journal.jsonl…)"* | `:389634-389639` |
| completion notification, failed/killed | *"To resume after editing the script, call: …"* inside `<recovery>` | `:386689` |
| completion notification, completed | *"To re-run with edited post-processing: … agents whose (prompt, opts) are unchanged replay from cache."* inside `<diagnostics>` | `:386707-386709` |
| paused task | *"Resume the paused workflow by calling: …"* | `:386623-386626` |
| background-fork failure | *"To resume manually: …"* | `:564888`, `:565074` |

All of them interpolate `args` when present (`, args: ${JSON.stringify(args)}`) — a small but
important detail, since §3.3 showed `args` is not part of the cache key and therefore must be
re-supplied by the caller to get a correct replay.

---

## 5. Adopt — resume across a process boundary, with a content pin

This is the `.196` "background session reliability" mechanism seen from the workflow side. When the
CLI hands its session to a background fork (or is restarted), running workflows are **checkpointed**
to a state file and later **adopted** by the new process.

### 5.1 Checkpoint

```javascript
// ============================================
// checkpointWorkflowForAdopt - Serialise a running workflow into the handoff state file
// Location: cli_inner_pretty.js:564815-564826
// ============================================

// ORIGINAL (for source lookup):
async function AZs(e, t = {}) {
  let r = t.derivedTranscriptDir ?? gte(e.workflowRunId);
  return {
    taskId: e.id, workflowRunId: e.workflowRunId, scriptPath: e.scriptPath,
    scriptSha256: e.script ? zSp.createHash("sha256").update(e.script).digest("hex") : void 0,
    argsJson: e.args !== void 0 ? Ie(e.args) : void 0,
    description: e.description, startTime: e.startTime,
    transcriptDir: await ux.realpath(r).catch(() => r),
  };
}

// READABLE (for understanding):
async function checkpointWorkflowForAdopt(task, opts = {}) {
  const dir = opts.derivedTranscriptDir ?? workflowTranscriptDir(task.workflowRunId);
  return {
    taskId: task.id,
    workflowRunId: task.workflowRunId,
    scriptPath: task.scriptPath,
    scriptSha256: task.script                                  // ← the content pin
      ? crypto.createHash("sha256").update(task.script).digest("hex") : undefined,
    argsJson: task.args !== undefined ? JSON.stringify(task.args) : undefined,
    description: task.description,
    startTime: task.startTime,
    transcriptDir: await fs.realpath(dir).catch(() => dir),    // resolve symlinks now
  };
}

// Mapping: AZs→checkpointWorkflowForAdopt, gte→workflowTranscriptDir, zSp→crypto, Ie→JSON.stringify, ux→fs/promises
```

The record's zod schema is at `:565253-565263`: `workflowRunId` must match `/^wf_[a-z0-9-]{6,}$/`
and `scriptSha256` must match `/^[0-9a-f]{64}$/`.

### 5.2 Adopt

```javascript
// ============================================
// resumeAdoptedWorkflow - Re-launch a checkpointed workflow, refusing an edited script
// Location: cli_inner_pretty.js:388865-388906
// ============================================

// ORIGINAL (for source lookup):
async function sEd(e) {
  let { taskId: t, workflowRunId: r, scriptPath: n, argsJson: o, startTime: i } = e, s = await IRt(n);
  if ("error" in s) throw new Lr(s.error, "adopted workflow script read failed");
  let a = s.script;
  if (e.scriptSha256 === void 0)
    throw new Lr("workflow was checkpointed without a content pin; resume via the Workflow tool",
                 "adopted workflow missing scriptSha256");
  if (iEd.createHash("sha256").update(a).digest("hex") !== e.scriptSha256)
    throw new Lr("script content changed since it was approved; resume via the Workflow tool to re-approve",
                 "adopted workflow scriptSha256 mismatch");
  let l = $H(a); if ("error" in l) throw new Lr(…);
  let c = Cft(l.scriptBody); if (!c.ok) throw new Lr(…);
  let u = o !== void 0 ? Ut(o) : void 0;
  for (let d of Object.values(e.toolUseContext.taskRegistry.all()))
    if (d.type === "local_workflow" && d.workflowRunId === r && d.status === "running") {
      e.toolUseContext.taskRegistry.remove(t); return; }
  Osn({ taskId: t, workflowRunId: r, script: a, scriptPath: n, args: u, meta: l.meta,
        vmScript: c.vmScript, toolUseContext: e.toolUseContext, canUseTool: e.canUseTool,
        toolUseId: void 0, transcriptDir: gte(r),
        telemetry: { source: "adopt", name: "custom", description: "", scriptIsVerbatimBuiltIn: !1 },
        isResume: !0, startTime: i });
}

// READABLE (for understanding):
async function resumeAdoptedWorkflow(checkpoint) {
  const read = await readWorkflowScriptFile(checkpoint.scriptPath);
  if ("error" in read) throw new TaggedError(read.error, "adopted workflow script read failed");
  const script = read.script;

  if (checkpoint.scriptSha256 === undefined)                  // pre-pin checkpoint → refuse
    throw new TaggedError("workflow was checkpointed without a content pin; resume via the Workflow tool",
                          "adopted workflow missing scriptSha256");
  if (sha256Hex(script) !== checkpoint.scriptSha256)          // file edited since approval → refuse
    throw new TaggedError("script content changed since it was approved; resume via the Workflow tool to re-approve",
                          "adopted workflow scriptSha256 mismatch");

  const parsed = parseWorkflowScriptMeta(script);   if ("error" in parsed)  throw new TaggedError(…);
  const compiled = compileWorkflowScript(parsed.scriptBody); if (!compiled.ok) throw new TaggedError(…);
  const args = checkpoint.argsJson !== undefined ? JSON.parse(checkpoint.argsJson) : undefined;

  for (const t of Object.values(ctx.taskRegistry.all()))      // idempotence: someone already resumed it
    if (t.type === "local_workflow" && t.workflowRunId === checkpoint.workflowRunId && t.status === "running") {
      ctx.taskRegistry.remove(checkpoint.taskId); return; }

  launchWorkflow({ …, toolUseId: undefined, transcriptDir: workflowTranscriptDir(runId),
                   telemetry: { source: "adopt", name: "custom", description: "", scriptIsVerbatimBuiltIn: false },
                   isResume: true, startTime: checkpoint.startTime });
}

// Mapping: sEd→resumeAdoptedWorkflow, Lr→TaggedError, IRt→readWorkflowScriptFile, iEd→crypto,
//          Ut→JSON.parse, $H→parseWorkflowScriptMeta, Cft→compileWorkflowScript, Osn→launchWorkflow
```

**Verdict: NET_NEW.** `scriptSha256` is **220=7 / 193=0**, and both refusal strings are 220=1 / 193=0.

**Why a content pin is required here and not on the tool resume path.** The two resume flows differ
in exactly one respect that matters: whether a human is in the loop.

| | Tool resume | Adopt |
|---|---|---|
| Who initiates | the model, in a live turn | the process itself, during startup |
| Approval | `checkPermissions` runs; the dialog shows the current file contents (§1.7) | none — there is no turn and no user present |
| If the file changed | the user sees the new code and re-approves | **nobody would ever see it** |

Without the pin, adopt is a persistent arbitrary-code-execution primitive: write a script to
`~/.claude/projects/.../workflows/scripts/foo-wf_abc.js`, wait for any process restart, and the CLI
re-executes whatever is there with the original approval's authority. The hash makes the approval
bind to *content*, not to a path. The two error messages both end with the same instruction —
*"resume via the Workflow tool"* — routing the user back through the path that does have a dialog.

**Why a missing pin is also a hard refusal** rather than a fall-through: a checkpoint written by a
build older than this change has no `scriptSha256`, and treating "no pin" as "no check" would make
the guard trivially bypassable by forging an old-format record. The schema marks the field `.optional()`
(`:565256`) so old records still *parse* — and then `sEd` rejects them. Parse-permissively,
act-strictly.

**Two more details:**

- `telemetry: { source: "adopt", name: "custom", description: "" }` (`:388896`) hard-codes the
  redacted values rather than recomputing them. An adopted script's provenance is unknown to the new
  process, so it is treated as maximally private.
- `toolUseId: void 0` — there is no live tool call to attach progress to, which is why the SDK
  publisher's `toolUseId` is `undefined` for adopted runs and their progress reaches only the
  registry-backed surfaces.

### 5.3 The transcript-directory relink

`gte(runId)` embeds the **session id**. A fork has a *new* session id, so the adopted run's journal
would be looked up in a directory that does not exist. `nEp` (`:565049-565070`) fixes this by
symlinking the new location to the old one:

```javascript
// READABLE (abridged from :565049-565070):
async function relinkAdoptedTranscriptDir(checkpoint) {
  const wanted = workflowTranscriptDir(checkpoint.workflowRunId);   // new session's path
  if (wanted === checkpoint.transcriptDir) return;                  // same session — nothing to do
  if (await fs.realpath(wanted).catch(() => undefined) === checkpoint.transcriptDir) return;  // already linked
  await fs.stat(path.join(checkpoint.transcriptDir, "journal.jsonl"));  // refuse to link to a dir with no journal
  await fs.mkdir(path.dirname(wanted), { recursive: true });
  try { await fs.unlink(wanted); }
  catch (e) { if (errno(e) !== "ENOENT") {                          // it is a real directory, not a stale link
      try { await fs.rmdir(wanted); }
      catch (e2) { if (errno(e2) === "ENOTEMPTY") await fs.rm(wanted, { recursive: true, force: true }); } } }
  await fs.symlink(checkpoint.transcriptDir, wanted);
}
```

The `stat` of `journal.jsonl` before any mutation is the guard that makes the destructive
`rm -rf` fallback safe: the source must be a real workflow transcript directory, or nothing is
removed. Note the escalation ladder `unlink → rmdir → rm -r`, which handles the three states the
target can be in (stale symlink, empty dir, populated dir) with the least destructive operation that
can succeed.

### 5.4 Failure handling

`sEd` is called from the deferred-resume effect at `:824005-824021`, wrapped so that a rejection
removes the task and notifies:

```javascript
// READABLE (from :824021-824027):
.catch((err) => {
  taskRegistry.remove(checkpoint.taskId);
  notifyAdoptedWorkflowFailed(checkpoint, err instanceof Error ? err.message : "resume failed");
  countFailure("task_local_workflow", "adopt_resume_failed");
  reportError(err);
});
```

`aGo` (`:565071-565078`) builds the message and, when a `scriptPath` exists, appends the manual
recovery command. Note that a `scriptSha256` mismatch produces this message *with* a resume hint —
which is correct: the user should re-run it through the tool, where the dialog will show the edited
script.

A sibling path, `abandon()` (`:564884-564893`), handles "the fork never spawned at all" and emits
`$e("task_local_workflow", "adopt_spawn_failed")`. Together with `adopt_resume_failed` and
`adopt_checkpoint_flush_failed` (`:564863`), that is a three-stage failure taxonomy for the handoff.

---

## 6. Termination

All four terminal transitions funnel through one helper:

```javascript
// ============================================
// terminateWorkflowTask - Single transition point for completed / failed / killed / paused
// Location: cli_inner_pretty.js:386573-386591
// ============================================

// ORIGINAL (for source lookup):
function jxo(e, t, r, n) {
  let o = null;
  return (t.update(e, (i) => {
      if (i.status !== "running") return i;
      ((o = i), i.abortController?.abort());
      let s = Date.now();
      return { ...i, ...n, status: r, endTime: s, ...(CE(r) && { evictAfter: s + Yse }),
               abortController: void 0, agentControllers: void 0 };
    }), o);
}

// READABLE (for understanding):
function terminateWorkflowTask(taskId, registry, status, extra) {
  let previous = null;
  registry.update(taskId, (task) => {
    if (task.status !== "running") return task;      // idempotent — a second call is a no-op
    previous = task;
    task.abortController?.abort();                   // kill the VM run and every in-flight agent
    const now = Date.now();
    return { ...task, ...extra, status, endTime: now,
             ...(isTerminal(status) && { evictAfter: now + TASK_EVICT_TTL_MS }),   // 30_000, :341922
             abortController: undefined, agentControllers: undefined };            // drop the handles
  });
  return previous;                                   // null if it was already terminal
}

// Mapping: jxo→terminateWorkflowTask, CE→isTerminal, Yse→TASK_EVICT_TTL_MS (=30000, :341922)
```

| Wrapper | Status | Extra behaviour | Anchor |
|---|---|---|---|
| `VPs` | `completed` | writes `outputFile` JSON, `be("task_local_workflow")` | `:386593-386613` |
| `Gxo` | `failed` | `rA(taskId)`, failure counter | `:386614-386617` |
| `tve` | `killed` | releases keepalive, `rA`, `Vp(e,"stopped",…)` | `:386627-386634` |
| `kft` | `paused` | releases keepalive; `notified: true` so no notification fires | `:386618-386622` |

**Why the returned `previous` doubles as a success flag:** `kft` and `tve` return
`r !== null` (`:386621`, `:386633`) — i.e. "did I actually transition it?". The `status !== "running"`
early return makes a double-stop safe, and the null tells the caller not to send a second
notification. This is the same claim-once pattern as `pBe` in the notification builder
(see [workflow_state_and_ipc.md §5](workflow_state_and_ipc.md)).

**Why the controllers are dropped rather than kept:** `abortController` and `agentControllers`
(a `Map` of up to 1,000 entries) hold references to closures that in turn hold the whole tool-use
context. A terminal task lives for `evictAfter + 30 s` and remains addressable by `TaskOutput`;
nulling the controllers is what stops that from retaining an entire run's object graph.

A distinct, non-terminal transition exists for **individual agents**:

```javascript
// ORIGINAL (:386635-386653):
function ISd(e, t, r, n) { … i.agentControllers?.get(t) … s.abort(new DOMException(r, "AbortError")) … }
function Vfr(e, t, r) { return ISd(e, t, "user-skip", r); }
function zfr(e, t, r) { return ISd(e, t, "user-retry", r); }

// READABLE:
function abortWorkflowAgent(taskId, agentId, reason, registry) { … }   // reason ∈ {"user-skip","user-retry"}
const skipWorkflowAgent  = (taskId, agentId, reg) => abortWorkflowAgent(taskId, agentId, "user-skip",  reg);
const retryWorkflowAgent = (taskId, agentId, reg) => abortWorkflowAgent(taskId, agentId, "user-retry", reg);
```

These are the `/workflows` steering controls. The reason string travels through the
`DOMException.name`-adjacent `reason` slot and is read back in the executor at `:387643-387712`,
where `user-skip` returns `{skipped: true}` (→ `agent()` returns `null`) and `user-retry` feeds the
same retry ladder as a stall (§7.1 of [workflow_runtime_core.md](workflow_runtime_core.md)) but is
reported distinctly: *"agent abandoned: user requested retry on all N attempts"* (`:387851`).

---

## 7. Timeline summary

```
  Model emits Workflow tool_use
        │
        ├─ validateInput  ── 5 gates ──────────────► errorCode 1..8, nothing runs
        ├─ checkPermissions ─ inlines script text into updatedInput (pins content for this turn)
        │
        └─ call
             ├─ yEd        resolve  (scriptPath > name > script)      + workflow_resolve counter
             ├─ $H         parse meta  (first statement, pure literal)
             ├─ Cft        compile  (await transform → vm.Script)     + workflow_compile counter
             ├─ Loo        persist  <slug>-<runId>.js   (async, mode 0600)
             ├─ tengu_workflow_launched
             └─ Osn ─ registry entry ─ keepalive ─ budget ─ batcher
                   └─ rEd ─ journal.load() ─ eEd (VM context) ─ script.runInContext
                          └─ zSd host objects: agent/parallel/pipeline/phase/log/workflow
                                 ├─ journal key chain  → cached? return
                                 ├─ semaphore(min(16,cpus−2))
                                 ├─ oG subagent query  → journal.append({result})
                                 └─ progress events    → batcher → 7 surfaces
                   ├─ tengu_workflow_completed  (+ per-phase, built-ins only)
                   ├─ OSd snapshot  <runId>.json
                   ├─ VPs / Gxo     registry transition + outputFile
                   └─ qxo           task-notification → main agent
        │
   ┌────┴─────────────────────────────────────────┐
   │ process fork / restart                        │
   │   AZs  checkpoint  (+ scriptSha256 pin)       │
   │   nEp  relink transcript dir via symlink      │
   │   sEd  adopt: read → verify sha256 → Osn      │
   └───────────────────────────────────────────────┘
```

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
- `WorkflowTool` (S6y) - `:389355-389645` — definition, gates, `call`, result rendering
- `WORKFLOW_INPUT_SCHEMA` (_6y) - `:389254-389300` and `WORKFLOW_OUTPUT_SCHEMA` (b6y) - `:389301-389343`
- `areWorkflowsEnabled` (M0) - `:119317-119323` and `areWorkflowsDisabledByPolicy` (CQt) - `:119310-119312`
- `computeWorkflowAvailability` (lug) - `:119340-119349` — the Pro-tier default-off rule
- `isNameOnlyWorkflowMode` (z$t) - `:386782-386784` — `CLAUDE_WORKFLOW_NAME_ONLY`
- `resolveWorkflowScriptSource` (yEd) - `:389188-389214`
- `telemetryWorkflowName` (Qxo) - `:388577-388580` / `telemetryWorkflowDescription` (Zxo) - `:388581-388584`
- `parseWorkflowScriptMeta` ($H) - `:275599-275630`, `validateMeta` (hgy) - `:275718-275727`, `normalisePhases` (ggy) - `:275728-275738`
- `compileWorkflowScript` (Cft) - `:386354-386376`, `rewriteAwaitsForVM` (jWy) - `:386287-386353`
- `persistWorkflowScript` (Loo) - `:162016-162029`, `readWorkflowScriptFile` (IRt) - `:162030-162041`
- `launchWorkflow` (Osn) - `:388585-388864`
- `LocalFileJournal` (JPs) - `:387081-387116` — name leaked at `:387100`
- `deriveJournalKey` (FSd) - `:387077-387080`, `canonicaliseOpts` (VWy) - `:387047-387076`, `indexJournal` ($Sd) - `:387035-387046`
- `workflowTranscriptDir` (gte) - `:386965-386968`, `workflowSnapshotDir` (MSd) - `:386961-386964`
- `writeWorkflowSnapshot` (OSd) - `:386969-386978`, `listWorkflowSnapshots` (XPs) - `:386979-387026`
- `checkpointWorkflowForAdopt` (AZs) - `:564815-564826`
- `resumeAdoptedWorkflow` (sEd) - `:388865-388906`
- `relinkAdoptedTranscriptDir` (nEp) - `:565049-565070`
- `terminateWorkflowTask` (jxo) - `:386573-386591` and its four wrappers `:386593-386634`
- `abortWorkflowAgent` (ISd) - `:386635-386648` — the `/workflows` skip/retry controls
