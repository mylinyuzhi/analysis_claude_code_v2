# Workflow Tool, Schema and Module Overview

> Module: `42_workflow` — Dynamic Workflows (FLAGSHIP, new in 2.1.154)
> Build under analysis: Claude Code **v2.1.156**
> Source: `cli_inner_pretty.js` (single pretty-printed bundle; line citations are verified reads)

## Related Symbols

> Symbol mappings live in the central index (never in this doc):
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, Tools, LLM API)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (**Workflows**, Plan, Hooks, Skills, Compact)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP, Permissions, Sandbox, Auth)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (LSP, IDE, UI, Plugin)

Key symbols in this document (full table is in `symbol_index_core_features.md`):

- `WORKFLOW_TOOL_NAME` (`mx`) — the string `"Workflow"` (cli_inner_pretty.js:216291); re-exported as `m57.WORKFLOW_TOOL_NAME` (cli_inner_pretty.js:216289-216290)
- `workflowTool` (`n0_`) — the tool object built by the factory `yK` (cli_inner_pretty.js:378217)
- `workflowInputSchema` (`Q0_`) — lazy Zod `strictObject` for the tool input (cli_inner_pretty.js:378140-378185)
- `workflowOutputSchema` (`g0_`) — lazy Zod `object` for the tool result (cli_inner_pretty.js:378186-378216)
- `WORKFLOW_DESCRIPTION` (`Fp6`) — the long tool prompt/description string (cli_inner_pretty.js:376074-376077+)
- `parseWorkflowMeta` (`FZ`) — AST parser that extracts and validates the `meta` literal + script body (cli_inner_pretty.js:371746-371778)
- `isWorkflowsEnabled` (`NZ`) — the session-level enabled predicate (cli_inner_pretty.js:184757-184763)
- `isWorkflowsManagedDisabled` (`H48`) — managed-settings / env hard-off check (cli_inner_pretty.js:184750-184752)
- `resolveWorkflowAvailability` (`SL5`) — `{available, defaultOn}` from env + gate + tier (cli_inner_pretty.js:184780-184788)
- `persistWorkflowScript` (`xFK`) — writes the script under the session dir, returns its path (cli_inner_pretty.js:145280-145293)
- `readWorkflowScriptFile` (`Hj$`) — reads a `scriptPath`, rejecting UNC paths (cli_inner_pretty.js:145294-145305)
- `isUncPath` (`tm`) — `^[\\/]{2}` UNC detector (cli_inner_pretty.js:8587-8589)
- `resolveWorkflowSource` (`b44`) — resolves `scriptPath`/`name`/`script` to a script string (cli_inner_pretty.js:378081-378098)
- `lookupPermissionRules` (`d6H`) — collects allow/deny/ask rules for a tool (cli_inner_pretty.js:442061-442079)
- `WORKFLOW_SCRIPT_MAX_BYTES` (`jI`) — `524288` byte cap on scripts (cli_inner_pretty.js:145308)

---

## TL;DR

The **Workflow** tool is Claude Code's flagship 2.1.154 feature: a tool that takes a **self-contained JavaScript orchestration script** and runs it in the background, fanning work out across tens-to-hundreds of subagents deterministically. The model authors the script inline (`script`), names a saved one (`name`), or points at a file on disk (`scriptPath`); the runtime executes it against a sandboxed VM that exposes `agent()`, `pipeline()`, `parallel()`, `phase()`, `log()`, `args`, `budget`, and `workflow()` primitives, then returns a task ID immediately and notifies on completion.

This document covers the **module overview** plus the **tool anatomy** — the registration object, the schemas, the gate predicate, the description, validation/permission flow, the `meta` parser, script persistence, and UNC rejection. The execution VM, journal/respawn, telemetry, and `/workflows` UI are covered in sibling docs.

**Where the tool lives:**
- Tool name constant `mx = "Workflow"` — cli_inner_pretty.js:216291
- Tool object `n0_` registered via `yK({...})` — cli_inner_pretty.js:378217-378500+
- Input schema `Q0_` / output schema `g0_` — cli_inner_pretty.js:378140-378216
- Description `Fp6` — cli_inner_pretty.js:376074+

**NEW-post-2.1.88 verdict (confidence: high):** There is no Workflow / `RunWorkflow` tool, no inline-script orchestration schema, and no `resumeFromRunId`/`scriptPath` workflow plumbing anywhere in the readable v2.1.88 tree. The only `Workflow`-named artifact there — `src/components/WorkflowMultiselectDialog.tsx` — is a **GitHub Actions installer** (`@claude` / "Claude Code Review" GH Actions, typed `import type { Workflow } from '../commands/install-github-app/types.js'`), semantically unrelated to dynamic agent workflows. The entire dynamic-workflow subsystem is new in 2.1.154.

**The 82209 disambiguation (important):** `orchestrationConfiguration` at cli_inner_pretty.js:82209 is **NOT** part of dynamic workflows. It is a field name inside the AWS Bedrock Smithy schema `KnowledgeBaseRetrieveAndGenerateConfiguration` (cli_inner_pretty.js:82200-82211, namespace `"com.amazonaws.bedrock"`). It's a false-positive keyword match and must not be cited as workflow code.

---

## ASCII overview — from tool call to background run

```
LLM emits a Workflow tool call
        { script | name | scriptPath, args?, resumeFromRunId? }
                       │
                       ▼
        ┌──────────────────────────────────┐
        │  isEnabled: NZ()  (184757)        │  ── false ──▶ tool hidden from the model
        └──────────────────────────────────┘
                       │ enabled
                       ▼
        ┌──────────────────────────────────┐
        │  validateInput (378238)           │
        │   H48()  managed-off  → errorCode 5│
        │   !NZ()  not enabled  → errorCode 6│
        │   b44()  resolve src  → errorCode 1│
        │   FZ()   parse meta   → errorCode 2│
        │   determinism regex   → errorCode 4│
        │   resume still running→ errorCode 3│
        └──────────────────────────────────┘
                       │ ok
                       ▼
        ┌──────────────────────────────────┐
        │  checkPermissions (378274)        │
        │   d6H(...,"deny") → deny           │
        │   resolve scriptPath/name → input  │
        │   d6H(...,"ask")  → ask            │
        │   d6H(...,"allow")→ allow           │
        │   default          → ask + suggest │
        └──────────────────────────────────┘
                       │ allow
                       ▼
        ┌──────────────────────────────────┐
        │  call (378336)                    │
        │   b44 → script   FZ → meta         │
        │   runId = resumeFromRunId          │
        │          ?? wf_<uuid12>            │
        │   BP8 → compile to VM script       │
        │   xFK → persist script to disk     │  ──▶ returns scriptPath in result
        │   d("tengu_workflow_launched")     │
        │   spawn background VM (async)      │
        └──────────────────────────────────┘
                       │
                       ▼  returns immediately
        { status:"async_launched", taskId, runId, summary, scriptPath }
                       │
                       └─▶ <task-notification> on completion;  /workflows to watch
```

---

## 1. The tool-name constant and the factory

### `mx = "Workflow"` and the `RunWorkflow` alias

**What it does:** Defines the canonical tool name and a back-compat alias.

```javascript
// ============================================
// WORKFLOW_TOOL_NAME - the "Workflow" tool-name constant + module re-export
// Location: cli_inner_pretty.js:216289-216291
// ============================================

// ORIGINAL (for source lookup):
var m57 = {};
X$(m57, { WORKFLOW_TOOL_NAME: () => mx });
var mx = "Workflow";

// READABLE (for understanding):
const workflowExports = {};
defineLazyExports(workflowExports, { WORKFLOW_TOOL_NAME: () => WORKFLOW_TOOL_NAME });
const WORKFLOW_TOOL_NAME = "Workflow";

// Mapping: m57→workflowExports, X$→defineLazyExports, mx→WORKFLOW_TOOL_NAME
```

`mx` sits in the same block of tool-name constants as `cf = "SendMessage"` (216283), `SL = "TaskCreate"` (216284), `nT = "TaskStop"` (216170), and `n18 = "ListAgents"` (216292) — the agent-team / task-orchestration tool family the Workflow runtime composes with.

The tool's `aliases: ["RunWorkflow"]` (cli_inner_pretty.js:378219) lets prompts/skills refer to it as `RunWorkflow` while the wire name stays `Workflow`. `searchHint` (cli_inner_pretty.js:378220) is `"orchestrate subagents with deterministic JavaScript workflow"` — the string used by `ToolSearch` deferred-tool matching so the model can re-surface the schema on demand.

### `yK` — the tool factory wrapper

**What it does:** Merges a partial tool definition over a defaults object so every tool gets sane fallbacks.

```javascript
// ============================================
// makeTool - tool factory: defaults overlaid by the supplied definition
// Location: cli_inner_pretty.js:143482-143484
// ============================================

// ORIGINAL (for source lookup):
function yK(H) {
  return Object.defineProperties({ ...P45, userFacingName: () => H.name }, Object.getOwnPropertyDescriptors(H));
}

// READABLE (for understanding):
function makeTool(definition) {
  return Object.defineProperties(
    { ...TOOL_DEFAULTS, userFacingName: () => definition.name },
    Object.getOwnPropertyDescriptors(definition),
  );
}

// Mapping: yK→makeTool, H→definition, P45→TOOL_DEFAULTS
```

`P45` (cli_inner_pretty.js:143499-143507) supplies the defaults: `isEnabled: () => !0`, `checkPermissions: () => ({behavior:"allow"})`, `toAutoClassifierInput: () => ""`, etc. The Workflow definition overrides every one of these. Note the use of `Object.getOwnPropertyDescriptors` — this is what preserves the `get inputSchema()` / `get outputSchema()` **getters** as getters (rather than eagerly evaluating them), which matters because the schemas are lazily built (see §3).

---

## 2. `isEnabled` — the four-layer gate

`isEnabled: () => NZ()` (cli_inner_pretty.js:378222). `NZ` is a four-condition AND that decides whether the tool is even offered to the model.

```javascript
// ============================================
// isWorkflowsEnabled - session-level gate for the Workflow tool
// Location: cli_inner_pretty.js:184750-184788
// ============================================

// ORIGINAL (for source lookup):
function H48() {
  return xH(process.env.CLAUDE_CODE_DISABLE_WORKFLOWS) || UV()?.settings.disableWorkflows === !0;
}
function NZ() {
  if (H48()) return !1;
  if (!r$7()) return !1;
  let { available: H, defaultOn: $ } = KP6();
  if (!H) return !1;
  return hL5() ?? $;
}
function r$7() { return k7("allow_workflows"); }
function hL5() { return UV()?.settings.enableWorkflows; }
function KP6() {
  if ($48 !== void 0) return $48;
  return (($48 = SL5()), $48);
}
function SL5() {
  if (xH(process.env.CLAUDE_CODE_WORKFLOWS)) {
    let $ = V$("tengu_workflows_enabled", !0);
    return { available: $, defaultOn: $ };
  }
  if (k4(process.env.CLAUDE_CODE_WORKFLOWS)) return { available: !1, defaultOn: !1 };
  if (!V$("tengu_workflows_enabled", !0)) return { available: !1, defaultOn: !1 };
  return { available: !0, defaultOn: _4() !== "pro" };
}

// READABLE (for understanding):
function isWorkflowsManagedDisabled() {
  return parseBoolTrue(process.env.CLAUDE_CODE_DISABLE_WORKFLOWS)
      || getManagedSettings()?.settings.disableWorkflows === true;
}
function isWorkflowsEnabled() {
  if (isWorkflowsManagedDisabled()) return false;          // layer 1: hard off
  if (!isWorkflowsPolicyAllowed()) return false;           // layer 2: org policy "allow_workflows"
  const { available, defaultOn } = resolveWorkflowAvailabilityCached();
  if (!available) return false;                            // layer 3: env + gate availability
  return getUserWorkflowSetting() ?? defaultOn;            // layer 4: user setting, else tier default
}
function isWorkflowsPolicyAllowed() { return isManagedPolicyAllowed("allow_workflows"); }
function getUserWorkflowSetting() { return getManagedSettings()?.settings.enableWorkflows; }
function resolveWorkflowAvailabilityCached() {
  if (availabilityCache !== undefined) return availabilityCache;
  return (availabilityCache = resolveWorkflowAvailability());
}
function resolveWorkflowAvailability() {
  if (parseBoolTrue(process.env.CLAUDE_CODE_WORKFLOWS)) {   // explicit env force-on
    const on = checkGate("tengu_workflows_enabled", true);
    return { available: on, defaultOn: on };
  }
  if (parseBoolFalse(process.env.CLAUDE_CODE_WORKFLOWS))    // explicit env force-off
    return { available: false, defaultOn: false };
  if (!checkGate("tengu_workflows_enabled", true))         // remote feature gate
    return { available: false, defaultOn: false };
  return { available: true, defaultOn: getTier() !== "pro" }; // default: on for non-pro tiers
}

// Mapping: H48→isWorkflowsManagedDisabled, NZ→isWorkflowsEnabled,
//          r$7→isWorkflowsPolicyAllowed, hL5→getUserWorkflowSetting,
//          KP6→resolveWorkflowAvailabilityCached, SL5→resolveWorkflowAvailability,
//          $48→availabilityCache, xH→parseBoolTrue, k4→parseBoolFalse,
//          V$→checkGate, _4→getTier, k7→isManagedPolicyAllowed, UV→getManagedSettings
```

**How it works (layered AND, evaluated cheapest-first):**

1. **Managed hard-off** (`H48`): if `CLAUDE_CODE_DISABLE_WORKFLOWS` is set true *or* managed `disableWorkflows === true`, the feature is off — full stop. This is the enterprise kill switch.
2. **Org policy** (`r$7` → `k7("allow_workflows")`): the deployment must allow the `allow_workflows` capability.
3. **Availability** (`SL5`, memoized via `$48`): a small env→gate→tier state machine —
   - `CLAUDE_CODE_WORKFLOWS=true` → availability follows the remote gate `tengu_workflows_enabled`, `defaultOn` mirrors it.
   - `CLAUDE_CODE_WORKFLOWS=false` → forced unavailable.
   - else if remote gate `tengu_workflows_enabled` is off → unavailable.
   - else → available, with **`defaultOn = (tier !== "pro")`**.
4. **User preference** (`hL5`): the `enableWorkflows` setting wins if present; otherwise the tier default (`defaultOn`) decides.

**Why this approach:** Each layer represents a different *authority*: enterprise admin (1), org policy (2), Anthropic rollout control (3), end user (4). Ordering them outer-to-inner means the most restrictive authority always wins and the expensive checks (`SL5` does gate IO) are memoized in `$48`. The `defaultOn = tier !== "pro"` line is the rollout lever — workflows ship "on by default" for Max/Team/Enterprise tiers but "off by default" for Pro, where a single workflow can burn a large fraction of the quota.

**Key insight:** `isWorkflowsEnabled` (`NZ`) is checked **three times** in the tool lifecycle — at `isEnabled` (whether the model even sees the tool), and again inside `validateInput` (defense-in-depth in case the session state changed mid-conversation). The double-check in `validateInput` maps to a distinct error code (6 vs the static 5 for managed-off), so the model gets an actionable message about *why* a tool it was offered now refuses.

**Cross-validation (2.1.88, confidence high):** none of `NZ`, `SL5`, `tengu_workflows_enabled`, `allow_workflows`, `disableWorkflows`, or `CLAUDE_CODE_WORKFLOWS` exists in the v2.1.88 tree. Entirely new.

---

## 3. The schemas — `Q0_` (input) and `g0_` (output)

Both schemas are wrapped in `yH(() => ...)` (a lazy memoizer) and exposed through getters so the Zod objects are built once on first access, not at module load. The tool reads them via `get inputSchema() { return Q0_(); }` (378229-378231) and `get outputSchema() { return g0_(); }` (378232-378234).

### `Q0_` — input schema (`strictObject` + `.refine`)

```javascript
// ============================================
// workflowInputSchema - the Workflow tool input contract
// Location: cli_inner_pretty.js:378140-378185
// ============================================

// ORIGINAL (for source lookup):
Q0_ = yH(() =>
  y.strictObject({
    script: y.string().max(jI).optional().describe("Self-contained workflow script. Must begin with `export const meta = ...`"),
    name: y.string().optional().describe("Name of a predefined workflow (built-in or from .claude/workflows/)."),
    description: y.string().optional().describe("Ignored — set the workflow description in the script's `meta` block."),
    title: y.string().optional().describe("Ignored — set the workflow title in the script's `meta` block."),
    args: y.unknown().optional().describe("Optional input value exposed to the script as the global `args`, verbatim..."),
    scriptPath: y.string().optional().describe("Path to a workflow script file on disk... Takes precedence over `script` and `name`."),
    resumeFromRunId: y.string().regex(/^wf_[a-z0-9-]{6,}$/).optional().describe("Run ID of a prior Workflow invocation to resume from..."),
    ...!1,
  }).refine((H) => H.script || H.name || H.scriptPath, { message: "Must provide script, name, or scriptPath" }),
);

// READABLE (for understanding):
workflowInputSchema = memoize(() =>
  z.strictObject({
    script:          z.string().max(WORKFLOW_SCRIPT_MAX_BYTES).optional(),
    name:            z.string().optional(),
    description:     z.string().optional(),   // accepted but ignored (meta is authoritative)
    title:           z.string().optional(),   // accepted but ignored (meta is authoritative)
    args:            z.unknown().optional(),   // raw JSON value → global `args`
    scriptPath:      z.string().optional(),    // precedence: scriptPath > script/name
    resumeFromRunId: z.string().regex(/^wf_[a-z0-9-]{6,}$/).optional(),
  }).refine((i) => i.script || i.name || i.scriptPath, { message: "Must provide script, name, or scriptPath" }),
);

// Mapping: Q0_→workflowInputSchema, yH→memoize, y→z(zod), jI→WORKFLOW_SCRIPT_MAX_BYTES
```

**Field analysis:**

- **`script`** — the inline source, capped at `jI = 524288` bytes (512 KiB; cli_inner_pretty.js:145308). The `.describe()` text restates the hard rule that the script must *start* with `export const meta = {...}` as a pure literal.
- **`name`** — a saved/built-in workflow. Resolved by `AT$` (378089) against the workflow registry; falls back to listing available names if not found.
- **`description` / `title`** — deliberately accepted-but-ignored. Their `.describe()` text steers the model to put these in the script's `meta` block instead. This is a UX guard: earlier the model tended to set them at the tool level and have them silently lost; making them explicit-and-ignored documents the precedence.
- **`args`** — `z.unknown()` so any JSON value passes through verbatim to the VM global `args`. The description warns *not* to JSON-encode arrays/objects (a stringified list breaks `args.filter`/`args.map`).
- **`scriptPath`** — a file on disk; **takes precedence** over `script` and `name`. This is the iterate-in-place handle: every invocation persists its script (see §6) and returns the path, so the model can `Write`/`Edit` the file and re-invoke with the same `scriptPath`.
- **`resumeFromRunId`** — regex-pinned to `^wf_[a-z0-9-]{6,}$` (the run-ID format minted in `call`). Resuming replays cached `agent()` results for unchanged `(prompt, opts)` and re-runs only edited/new calls. Same-session only.

**`...!1` (378182):** `...false` spread is a no-op (`false` has no enumerable own keys). It's almost certainly the residue of a build-time conditional (`...(SOME_FLAG && {extraField})`) that compiled to `...false` when the flag is statically false — a dead-but-harmless spread.

**`.refine`:** the cross-field invariant "at least one of script/name/scriptPath" — `strictObject` alone can't express "one-of", so a `.refine` enforces it and produces the friendly message.

**Why `strictObject`:** unknown keys are rejected outright. For a tool whose payload can be a 512 KB program, rejecting stray keys early prevents the model from inventing fields (e.g. `parallelism`, `maxAgents`) that the runtime silently ignores — fail loud instead of fail quiet.

### `g0_` — output schema

```javascript
// ============================================
// workflowOutputSchema - the Workflow tool result contract
// Location: cli_inner_pretty.js:378186-378216
// ============================================

// ORIGINAL (for source lookup):
g0_ = yH(() =>
  y.object({
    status: y.enum(["async_launched", "remote_launched"]),
    taskId: y.string(),
    runId: y.string().optional().describe("Local workflow run identifier for resumeFromRunId..."),
    summary: y.string().optional(),
    transcriptDir: y.string().optional().describe("Directory where subagent transcripts are written during execution"),
    scriptPath: y.string().optional().describe("Path to the persisted workflow script for this invocation..."),
    sessionUrl: y.string().optional().describe("CCR session URL when status is remote_launched"),
    warning: y.string().optional().describe("Non-blocking heads-up (e.g. local git state diverges...)"),
    error: y.string().optional().describe("Set if syntax check failed"),
  }),
);

// READABLE (for understanding):
workflowOutputSchema = memoize(() =>
  z.object({
    status:        z.enum(["async_launched", "remote_launched"]), // local bg run vs remote CCR session
    taskId:        z.string(),                                     // background task handle
    runId:         z.string().optional(),                          // resume handle (local only)
    summary:       z.string().optional(),                          // meta.description echo
    transcriptDir: z.string().optional(),                          // where subagent transcripts land
    scriptPath:    z.string().optional(),                          // persisted script (iterate handle)
    sessionUrl:    z.string().optional(),                          // CCR URL when remote_launched
    warning:       z.string().optional(),                          // non-blocking heads-up
    error:         z.string().optional(),                          // set if compile/syntax check failed
  }),
);

// Mapping: g0_→workflowOutputSchema, yH→memoize, y→z(zod)
```

**Key insight — the tool is fire-and-forget:** `status` is only ever `async_launched` (local background) or `remote_launched` (CCR cloud session). There is **no `completed` status** in the output schema, because the tool returns *immediately* with a task ID; the actual result arrives later as a `<task-notification>`. `runId` is the resume handle for local runs (absent for remote — there the `sessionUrl` is the resume handle), and `scriptPath` is the persisted-script handle for iterate-in-place. Even a *compile failure* returns a normal result object with `error` set rather than throwing (see `call`, 378348-378352), so a bad script surfaces as a soft error the model can read and fix, not a tool exception.

---

## 4. `Fp6` — the tool description / prompt

`prompt()` and `description()` both return the same constant `Fp6` (cli_inner_pretty.js:378223-378228), assigned at module init (376074-376077). It is one of the longest tool descriptions in the codebase (~80 lines of prose). Its job is not just documentation — it is the **policy that gates when the model is allowed to call the tool at all**.

> **Content walk-through:** this section maps the *structure* of `Fp6` and explains *why it is one giant
> string*. For a verbatim, section-by-section walk of its **content** — the opt-in policy, the
> pipeline-vs-parallel argument, and the full orchestration pattern catalog (adversarial verify, judge
> panel, loop-until-dry, multi-modal sweep, completeness critic, …) — see
> [`workflow_authoring_and_orchestration.md`](./workflow_authoring_and_orchestration.md).

```javascript
// ============================================
// WORKFLOW_DESCRIPTION - the long opt-in policy + scripting reference for Workflow
// Location: cli_inner_pretty.js:376074-376189
// ============================================

// ORIGINAL (for source lookup):
Fp6 = `Execute a workflow script that orchestrates multiple subagents deterministically. Workflows run in the background — this tool returns immediately with a task ID, and a <task-notification> arrives when the workflow completes. Use /workflows to watch live progress.
...
ONLY call this tool when the user has explicitly opted into multi-agent orchestration. ...
- The user included the "workflow" or "workflows" keyword ...
- Ultracode is on ...
...`;

// READABLE (for understanding):
// (verbatim string — not re-paraphrased; the value IS the prompt)

// Mapping: Fp6→WORKFLOW_DESCRIPTION
```

**What the description encodes (the load-bearing parts):**

1. **Explicit opt-in gate (376081-376088).** "ONLY call this tool when the user has explicitly opted into multi-agent orchestration." Five accepted forms of opt-in: the literal keyword `workflow`/`workflows`, ultracode being on, the user's own words ("fan out agents"), a skill/slash-command instruction, or a request for a named/saved workflow. Everything else — even tasks that would obviously benefit — must use the plain `Agent` tool or just *ask* the user first.
2. **Ultracode standing opt-in (376101).** When a system-reminder confirms ultracode is on, the opt-in is *standing*: author and run a workflow for every substantive task; token cost is explicitly "not a constraint." This ties the description to the `ultracode` setting (xhigh effort + standing orchestration, cli_inner_pretty.js:51700-51706).
3. **Iterate-in-place contract (376103).** "Pass the script inline via `script` — do not Write it to a file first." Persistence is automatic; to iterate, edit the returned `scriptPath` and re-invoke. This mirrors the `scriptPath` field precedence in the input schema.
4. **The `meta` contract (376105-376119).** The script must begin with `export const meta = {...}` as a PURE LITERAL — required `name`/`description`, optional `whenToUse`/`phases`. This is exactly what `FZ` enforces (§5).
5. **Scripting primitives reference (376121-376135).** Full signatures for `agent()`, `pipeline()`, `parallel()`, `log()`, `phase()`, `args`, `budget`, and `workflow()` — including the concurrency cap `min(16, cpu cores - 2)` (376155), the lifetime agent cap `1000` (376155), worktree isolation cost (~200-500 ms/agent, 376122), and the determinism ban on `Date.now()`/`Math.random()`/`new Date()` (376135).
6. **pipeline-vs-parallel guidance (376137-376179).** A long argued case that `pipeline()` (no barrier between stages) is the default and `parallel()` (barrier) is justified only when a stage genuinely needs *all* prior results — with a "smell test" and worked examples.

**Why a single giant string:** The Workflow tool is unusually dangerous-by-default (it can spawn hundreds of agents and burn huge token budgets), and it asks the model to *write a program*. Both the **authorization policy** and the **DSL reference** have to be in the model's context the moment it considers calling the tool — so they live in `description()`/`prompt()`, not in a separate skill. The trade-off is prompt weight: this is one of the largest tool descriptions, which is part of why workflows are gated behind tiers/gates (a Pro user who never enables them never pays the token cost — `isEnabled` returns false and the description is never sent).

The `tengu_workflow_keyword` / `..._dismissed` / `..._restored` telemetry (feature_gates.json) and the system-reminder that "confirms" the keyword tie back to opt-in form #1 here — the runtime detects the literal `workflow` keyword in the user turn and injects a reminder the model is told to look for.

---

## 5. `FZ` — the `meta` parser and script validator

**What it does:** Parses the script with Acorn, asserts that the *first statement* is `export const meta = <pure object literal>`, statically evaluates that literal into a real JS object, validates the required fields, and splits off the script body.

```javascript
// ============================================
// parseWorkflowMeta - parse + validate `export const meta` and split the body
// Location: cli_inner_pretty.js:371746-371778
// ============================================

// ORIGINAL (for source lookup):
function FZ(H) {
  if (H.length > jI) return { error: `Script exceeds ${jI} bytes` };
  let $;
  try {
    let { parse: f } = BK4();
    $ = f(H, { ecmaVersion: "latest", sourceType: "module", allowAwaitOutsideFunction: !0, allowReturnOutsideFunction: !0 });
  } catch (f) {
    return { error: `Script parse error: ${f instanceof Error ? f.message : String(f)}. Workflow scripts must be plain JavaScript — TypeScript syntax ... fails to parse.` };
  }
  let q = $.body[0];
  if (!q || q.type !== "ExportNamedDeclaration" || !IZ_(q))
    return { error: "`export const meta = { name, description, phases }` must be the FIRST statement in the script" };
  let _ = q.declaration.declarations[0].init, z;
  try { z = UK4(_); } catch (f) { return { error: `meta must be a pure literal: ${f instanceof Error ? f.message : String(f)}` }; }
  let A = bZ_(z);
  if ("error" in A) return A;
  let Y = H.slice(q.end).replace(/^[;\s]*\n/, "").trimStart();
  return { meta: A.meta, scriptBody: Y };
}

// READABLE (for understanding):
function parseWorkflowMeta(source) {
  if (source.length > WORKFLOW_SCRIPT_MAX_BYTES) return { error: `Script exceeds ${WORKFLOW_SCRIPT_MAX_BYTES} bytes` };
  let ast;
  try {
    const { parse } = getAcorn();
    ast = parse(source, { ecmaVersion: "latest", sourceType: "module", allowAwaitOutsideFunction: true, allowReturnOutsideFunction: true });
  } catch (e) {
    return { error: `Script parse error: ${msg(e)}. Workflow scripts must be plain JavaScript — TypeScript syntax fails to parse.` };
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

// Mapping: FZ→parseWorkflowMeta, jI→WORKFLOW_SCRIPT_MAX_BYTES, BK4→getAcorn,
//          IZ_→isMetaExport, UK4→evalObjectLiteral, bZ_→validateMetaFields
```

**How it works (step-by-step):**

1. **Size guard** — reject scripts over 512 KiB up front (redundant with the schema's `.max(jI)` but covers the `name`/`scriptPath` paths where the script came from disk/registry).
2. **Parse** with Acorn (`BK4`) as ES-module source, allowing top-level `await`/`return` (the body runs in an async wrapper). A parse failure returns a message that explicitly blames TypeScript syntax — the single most common authoring mistake.
3. **Shape check** (`IZ_`, 371779-371785): the first statement must be `ExportNamedDeclaration` whose declaration is a single `const meta = <ObjectExpression>`.
4. **Static evaluation** (`UK4`/`pK4`, 371786-371823): walk the object literal and turn it into a real value — but *only* literal node types are allowed. `pK4` handles `Literal`, `ArrayExpression` (no sparse, no spread), nested `ObjectExpression`, `TemplateLiteral` (only with **zero** interpolations), and negative-number `UnaryExpression`. Anything else throws `non-literal node type in meta`. `UK4` additionally bans computed keys, methods/accessors, and (via `CZ_`/`RZ_`, 371853-371857) the prototype-pollution keys `__proto__`, `constructor`, `prototype`.
5. **Field validation** (`bZ_`, 371832-371841): `name` and `description` must be non-empty strings; `title`/`whenToUse` optional strings; `phases` normalized by `xZ_` (371842-371852) into `{title, detail?, model?}[]`, dropping anything without a string `title`.
6. **Body split**: everything after the `meta` export's end offset, with leading `;`/whitespace/newline trimmed.

**Why this approach — static evaluation instead of `eval`:** The `meta` block is read **before** the script is allowed to run (it's used in the permission dialog, the `/workflows` list, telemetry, and progress grouping). Running arbitrary code to learn the metadata would be both a security hole and a chicken-and-egg problem (you'd have to trust the script to learn whether to trust the script). By restricting `meta` to a *pure literal* and walking the AST by hand, the parser gets the metadata deterministically and safely — no side effects, no `Date.now()` leaking in, no prototype pollution. The "pure literal" rule in `Fp6` and the schema descriptions exist precisely because this parser will reject anything else.

**Key insight — `meta` is the trust boundary.** Everything the *user* sees before approving a run (the permission dialog summary via `getToolUseSummary`, the workflow name/description in `/workflows`) comes from this statically-evaluated `meta`. The script body is never evaluated to produce display text. That's why `meta` must be first, must be literal, and may not interpolate: it is the one part of an untrusted program the runtime is willing to read without executing.

**Cross-validation (2.1.88):** no precursor. `FZ`, `IZ_`, `UK4`, `pK4`, `bZ_`, `xZ_` are all new. Confidence high.

---

## 6. `validateInput` — the six error codes

`validateInput(H, $)` (cli_inner_pretty.js:378238-378273) runs the synchronous-ish pre-flight after the schema passes. It returns `{result:false, message, errorCode}` on failure or `{result:true}` on success. The six error codes are a deliberate enum so the UI/telemetry can distinguish failure classes:

- **errorCode 5** — `H48()` managed-off. "Dynamic workflows are disabled by managed settings (`disableWorkflows`)." (378240-378244)
- **errorCode 6** — `!NZ()` not enabled for this session (org policy / launch gate / `/config` setting). (378245-378251)
- **errorCode 1** — `b44(H)` source resolution failed (e.g. unknown `name`, unreadable `scriptPath`). The message is the resolver's own error. (378252-378253)
- **errorCode 2** — `FZ(...)` meta-parse failed: `Invalid workflow script: <reason>`. (378254-378255)
- **errorCode 4** — determinism violation: the *inline* script (`H.script` only) contains `Date.now()`, `Math.random()`, or argless `new Date()`. Regex `/\bDate\s*\.\s*now\b|\bMath\s*\.\s*random\b|\bnew\s+Date\s*\(\s*\)/` on the **scriptBody** (not the meta). (378256-378262)
- **errorCode 3** — resume conflict: `resumeFromRunId` names a run that is still `running`; the model must `TaskStop` it first. (378263-378271)

```javascript
// ============================================
// workflowValidateInput - pre-flight gate + determinism + resume-conflict check
// Location: cli_inner_pretty.js:378238-378273
// ============================================

// ORIGINAL (for source lookup):
async validateInput(H, $) {
  if (H48()) return { result: !1, message: "Dynamic workflows are disabled by managed settings (`disableWorkflows`).", errorCode: 5 };
  if (!NZ()) return { result: !1, message: 'Dynamic workflows are not enabled for this session ...', errorCode: 6 };
  let q = await b44(H);
  if ("error" in q) return { result: !1, message: q.error, errorCode: 1 };
  let K = FZ(q.script);
  if ("error" in K) return { result: !1, message: `Invalid workflow script: ${K.error}`, errorCode: 2 };
  if (H.script && /\bDate\s*\.\s*now\b|\bMath\s*\.\s*random\b|\bnew\s+Date\s*\(\s*\)/.test(K.scriptBody))
    return { result: !1, message: "Workflow scripts must be deterministic: Date.now()/Math.random()/new Date() are unavailable (breaks resume) ...", errorCode: 4 };
  if (H.resumeFromRunId) {
    for (let [_, z] of Object.entries($.taskRegistry.all()))
      if (z.type === "local_workflow" && z.status === "running" && z.workflowRunId === H.resumeFromRunId)
        return { result: !1, message: `Workflow ${H.resumeFromRunId} is still running (task ${_}). Stop it first with ${nT}({taskId: "${_}"}) before resuming.`, errorCode: 3 };
  }
  return { result: !0 };
}

// READABLE (for understanding):
async function validateWorkflowInput(input, ctx) {
  if (isWorkflowsManagedDisabled()) return fail(5, "disabled by managed settings (`disableWorkflows`)");
  if (!isWorkflowsEnabled())        return fail(6, "not enabled for this session (org policy, launch gate, or /config)");
  const resolved = await resolveWorkflowSource(input);
  if ("error" in resolved)          return fail(1, resolved.error);
  const parsed = parseWorkflowMeta(resolved.script);
  if ("error" in parsed)            return fail(2, `Invalid workflow script: ${parsed.error}`);
  if (input.script && /\bDate\s*\.\s*now\b|\bMath\s*\.\s*random\b|\bnew\s+Date\s*\(\s*\)/.test(parsed.scriptBody))
    return fail(4, "must be deterministic: Date.now()/Math.random()/new Date() are unavailable (breaks resume)");
  if (input.resumeFromRunId) {
    for (const [taskId, task] of Object.entries(ctx.taskRegistry.all()))
      if (task.type === "local_workflow" && task.status === "running" && task.workflowRunId === input.resumeFromRunId)
        return fail(3, `Workflow ${input.resumeFromRunId} is still running (task ${taskId}). Stop it with TaskStop first.`);
  }
  return { result: true };
}

// Mapping: validateInput→validateWorkflowInput, H→input, $→ctx, b44→resolveWorkflowSource,
//          FZ→parseWorkflowMeta, nT→"TaskStop", q→resolved, K→parsed
```

**Why determinism is enforced only on inline `script`:** the regex runs on `K.scriptBody` only when `H.script` is set. Named/`scriptPath` workflows are assumed already-vetted (a saved workflow that resumes correctly must already be deterministic; re-validating it on every resume would be wasted work and could reject a previously-accepted script). The ban exists because **resume** replays cached `agent()` results keyed on `(prompt, opts)` — if the script's control flow depends on wall-clock time or randomness, the replay would diverge from the original run and the cache would be wrong. So nondeterminism is a correctness bug for resume, hence a hard reject with a specific code.

**Why `b44` then `FZ` (resolve, then parse):** `validateInput` re-resolves the source even though `call` will resolve it again. This is intentional defense-in-depth — `validateInput` is the gate the permission/UI layer trusts, so it must independently confirm the script is real and parseable before the user is asked to approve it. The duplication is cheap (the script is already in memory or a small file).

### `resolveWorkflowSource` (`b44`) — precedence

`b44` (cli_inner_pretty.js:378081-378098) implements the documented precedence **`scriptPath > name > script`**: if `scriptPath` is set it reads the file via `Hj$` (or uses `H.script` if both are present, resolving the path for persistence); else if `name` is set it looks the workflow up via `AT$` (and lists available names on miss); else it uses the inline `script`; else returns the "Must provide script, name, or scriptPath" error.

---

## 7. `checkPermissions` — rule lookup, ask-by-default, allow-suggestion

`checkPermissions(H, $)` (cli_inner_pretty.js:378274-378318) decides allow/deny/ask. Because a workflow runs arbitrary code, the **default is `ask`** — only an explicit allow rule short-circuits the prompt.

**How it works:**

1. **Rule key** — `K = H.scriptPath ? void 0 : H.name` (378276). Permission rules are keyed by the workflow *name*; an ad-hoc `scriptPath` or inline `script` has no stable name, so `K` is `undefined` for those and no name-based rule can match (they always go to `ask`).
2. **Deny first** — `d6H(q, mx, "deny").get(K)` (377277-378278 via `_("deny")`). If a deny rule matches the name → `{behavior:"deny"}` with `decisionReason.rule`.
3. **Resolve the script into `updatedInput`** — for `scriptPath`, read it via `Hj$` and inline the resolved `script` (378286-378288); for `name`, resolve via `AT$` (378289-378291). This means the *approval UI sees the actual script*, not just a path/name — the human reviews what will run.
4. **Ask rule** → `{behavior:"ask", updatedInput}` (378293-378300).
5. **Allow rule** → `{behavior:"allow", updatedInput}` (378301-378302).
6. **Default** → `ask` with a `suggestions` block (only when a name `K` exists) offering an `addRules` action that would `allow` this `toolName: mx, ruleContent: K` to `localSettings` (378303-378317) — i.e. "always allow this named workflow."

`d6H` (cli_inner_pretty.js:442061-442079) is the generic rule collector: it pulls allow/deny/ask rule lists, filters to `ruleValue.toolName === "Workflow"` with a defined `ruleContent`, and returns a `Map<ruleContent, rule>` so `.get(name)` is an O(1) name lookup.

**Why ask-by-default with a name-scoped allow suggestion:** Inline scripts and arbitrary file paths can never be auto-allowed (no stable identity to match a rule against), so they always prompt — exactly what you want for "run this arbitrary program." But a *named* workflow has a stable identity, so the UI can offer "allow this workflow by name forever," and the human reviews the resolved script the first time. This is the same allow-rule-suggestion pattern other dangerous tools use, specialized to workflow names.

---

## 8. `xFK` — script persistence, and `Hj$`/`tm` — UNC rejection

### `xFK` — persist the script under the session directory

**What it does:** Synchronously computes the on-disk path for this run's script, kicks off an async write of the script bytes, and returns the path *immediately* (without awaiting the write).

```javascript
// ============================================
// persistWorkflowScript - write the script to the session dir; return its path now
// Location: cli_inner_pretty.js:145267-145293
// ============================================

// ORIGINAL (for source lookup):
function d9H(H) {
  return H.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "workflow";
}
function O68() {
  return bgH.join(AZ(C$()), E$(), "workflows", "scripts") + bgH.sep;
}
function Y95(H, $) {
  return `${O68()}${d9H(H)}-${$}.js`;
}
function xFK(H, $, q) {
  let K = O68(), _ = Y95(H, $);
  return (
    (async () => {
      try {
        (await f68.mkdir(K, { recursive: !0, mode: 448 }), await f68.writeFile(_, q, { encoding: "utf-8", mode: 384 }));
      } catch (z) { N(`Failed to persist workflow script to ${_}: ${z}`, { level: "warn" }); }
    })(),
    _
  );
}

// READABLE (for understanding):
function slugifyWorkflowName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "workflow";
}
function workflowScriptsDir() {
  return path.join(sessionRoot(cwd()), sessionId(), "workflows", "scripts") + path.sep;
}
function workflowScriptPath(name, runId) {
  return `${workflowScriptsDir()}${slugifyWorkflowName(name)}-${runId}.js`;
}
function persistWorkflowScript(name, runId, scriptText) {
  const dir = workflowScriptsDir(), filePath = workflowScriptPath(name, runId);
  // Fire-and-forget the write; return the path synchronously.
  (async () => {
    try {
      await fs.mkdir(dir, { recursive: true, mode: 0o700 });        // 448 = 0o700
      await fs.writeFile(filePath, scriptText, { encoding: "utf-8", mode: 0o600 }); // 384 = 0o600
    } catch (e) { log(`Failed to persist workflow script to ${filePath}: ${e}`, { level: "warn" }); }
  })();
  return filePath;
}

// Mapping: xFK→persistWorkflowScript (H→name, $→runId, q→scriptText),
//          d9H→slugifyWorkflowName, O68→workflowScriptsDir, Y95→workflowScriptPath,
//          f68→fs/promises, bgH→path, N→log
```

**How it works:**

1. Path = `<sessionRoot>/<sessionId>/workflows/scripts/<slug>-<runId>.js`, where the slug is the workflow's `meta.name` lowercased to `[a-z0-9-]` (falling back to `"workflow"` if it slugs to empty), and `runId` is the `wf_...` id minted in `call`.
2. The directory is created `recursive` with mode `0o700` (owner-only), and the file written with mode `0o600` (owner read/write only).
3. The write is **not awaited** — `xFK` returns the path string synchronously; the IIFE runs in the background and only *logs a warning* on failure.

**Why fire-and-forget:** `call` needs the path *now* to put it in the tool result (so the model can iterate), and the launch should not block on disk IO. If the write fails, the workflow still runs (the script is already in memory) — persistence is a convenience for iteration, not a correctness requirement, so a failed write is a warning, not an error. The restrictive `0o700`/`0o600` modes reflect that these scripts are arbitrary code under the user's session dir.

`call` invokes it as `P = f ?? xFK(D, M, A)` (cli_inner_pretty.js:378354): if the source was already a resolved `scriptPath` (`f`), reuse it; otherwise persist the script (`A`) under name `D` and run id `M`. The returned `P` becomes the `scriptPath` in the tool result.

### `Hj$` + `tm` — reading a `scriptPath`, with UNC rejection

```javascript
// ============================================
// readWorkflowScriptFile - read a scriptPath from disk, rejecting UNC paths
// Location: cli_inner_pretty.js:145294-145305 (UNC test tm at 8587-8589)
// ============================================

// ORIGINAL (for source lookup):
function tm(H) { return /^[\\/]{2}/.test(H); }

async function Hj$(H) {
  if (tm(H)) return { error: `UNC paths are not allowed for workflow scriptPath: ${H}` };
  let $ = bgH.resolve(C$(), H);
  try {
    let q = await U$().readFileBytes($, jI + 1);
    if (q.byteLength > jI) return { error: `Workflow script file ${$} exceeds ${jI} bytes` };
    return { script: q.toString("utf-8"), path: $ };
  } catch (q) {
    if (P8(q)) return { error: `Workflow script file not found: ${$}` };
    return { error: `Failed to read workflow script file ${$}: ${q}` };
  }
}

// READABLE (for understanding):
function isUncPath(p) { return /^[\\/]{2}/.test(p); }   // two leading slashes/backslashes

async function readWorkflowScriptFile(rawPath) {
  if (isUncPath(rawPath)) return { error: `UNC paths are not allowed for workflow scriptPath: ${rawPath}` };
  const resolved = path.resolve(cwd(), rawPath);
  try {
    const bytes = await fileSystem().readFileBytes(resolved, WORKFLOW_SCRIPT_MAX_BYTES + 1);
    if (bytes.byteLength > WORKFLOW_SCRIPT_MAX_BYTES)
      return { error: `Workflow script file ${resolved} exceeds ${WORKFLOW_SCRIPT_MAX_BYTES} bytes` };
    return { script: bytes.toString("utf-8"), path: resolved };
  } catch (e) {
    if (isNotFound(e)) return { error: `Workflow script file not found: ${resolved}` };
    return { error: `Failed to read workflow script file ${resolved}: ${e}` };
  }
}

// Mapping: tm→isUncPath, Hj$→readWorkflowScriptFile, H/rawPath, $→resolved,
//          jI→WORKFLOW_SCRIPT_MAX_BYTES, U$→fileSystem, P8→isNotFound, bgH→path, C$→cwd
```

**How it works:**

1. **UNC rejection** — `tm(H)` matches `^[\\/]{2}` (two leading forward- or back-slashes), i.e. Windows UNC paths like `\\server\share\evil.js` or `//host/share`. These are rejected with a specific error *before* any IO.
2. **Resolve relative to cwd** — `path.resolve(cwd(), rawPath)` anchors the path to the project working directory.
3. **Bounded read** — reads at most `jI + 1` bytes (`524289`) so an oversized file is detected (`> jI`) without slurping a multi-gigabyte file into memory.
4. **Typed errors** — not-found vs other IO error get distinct messages.

**Why reject UNC paths specifically:** a UNC path can point at a *remote SMB share* — reading and then **executing** code fetched over the network would let a workflow script be sourced from an attacker-controlled server, bypassing the local-file assumptions of the cwd-resolution and permission model. Rejecting `^[\\/]{2}` closes that vector cheaply and up front. (Note `tm` is a shared helper — it's the same UNC detector used elsewhere in path handling — but here it's load-bearing for the workflow security boundary.) The `jI + 1` read cap is the matching DoS guard: a `scriptPath` to a huge file can't exhaust memory.

`Hj$` is the read path used by both `checkPermissions` (to inline the script for review, 378287) and `b44`/`validateInput`/`call` (to resolve the source). The `+1`-byte trick and UNC rejection therefore protect every entry point that accepts a path.

**Cross-validation (2.1.88):** no precursor for `xFK`, `Hj$`, `O68`, `Y95`, `d9H`. New. Confidence high. (`tm` the UNC detector predates workflows as a generic path util, but its workflow use is new.)

---

## 9. `call` — the launch path (overview)

`call(H, $, q, K, _)` (cli_inner_pretty.js:378336-378500+) is the actual launcher; the deep dive lives in the execution-runtime sibling doc, but the spine relevant to this anatomy:

1. **Resolve + parse** — `b44(H)` → script; `FZ(A)` → meta. Throws on resolution/parse error (these were already caught in `validateInput`; the re-check is belt-and-suspenders). (378337-378341)
2. **Mint run id** — `M = H.resumeFromRunId ?? \`wf_${randomUUID().slice(0,12)}\`` (378342). The `wf_` + 12 hex matches the `resumeFromRunId` regex.
3. **Compile** — `BP8(O.scriptBody)` (378347, `BP8` at 367468) compiles the body to a VM script. On failure it returns `{status:"async_launched", error}` *without throwing* (378348-378352) and emits `tengu_workflow` `compile_failed`.
4. **Persist** — `P = f ?? xFK(D, M, A)` (378354): reuse the resolved path or persist the script (§8).
5. **Launch telemetry** — `d("tengu_workflow_launched", {...})` with `invocation_mode` (scriptPath/named/inline), `workflow_source`, `phase_count`, `has_args`, `is_resume`, `script_size_chars` (378359-378368).
6. **Resume cleanup** — if resuming, remove the prior non-running registry entries for that run id (378369-378375).
7. **Spawn the VM** — `cB6({...})` builds the task descriptor (taskId, scriptPath, phases, defaultModel = `mainLoopModel`, workflowRunId, args, taskRegistry); the async IIFE then runs `q44(X.vmScript, ...)` with progress batching (a 16 ms `setTimeout` debounce, 378398-378421), an agent-controller registry, token budget, and a `journal` (`bp6`). (378376-378434)
8. **On completion** — emits `tengu_workflow_completed` (status killed/failed/completed, agent_count, total_tokens, duration_ms) and per-phase `tengu_workflow_phase_completed` rollups (378443-378496).

The synchronous part of `call` returns the `async_launched` result (taskId/runId/summary/scriptPath) immediately; the IIFE keeps running in the background and feeds the `/workflows` progress display.

---

## NEW-post-2.1.88 verdict (summary)

**Confidence: high.** The entire dynamic-workflow subsystem — the `Workflow`/`RunWorkflow` tool, the inline-script + `name` + `scriptPath` + `resumeFromRunId` input schema, the `meta` AST parser, the determinism/UNC/size guards, the gate chain (`NZ`/`SL5`/`H48`), and the script-persistence layer — has **no precursor** in the readable v2.1.88 source. The lone `Workflow`-named file there (`src/components/WorkflowMultiselectDialog.tsx`) is a **GitHub Actions installer** (`@claude`, "Claude Code Review" GH workflows; `import type { Workflow } from '../commands/install-github-app/types.js'`), unrelated to agent orchestration. Per the upstream changelog this shipped in 2.1.154 ("Introducing dynamic workflows…"), with 2.1.156 carrying the task-panel fix for the stray "main" row.

**82209 note (repeat for emphasis):** `orchestrationConfiguration` at cli_inner_pretty.js:82209 belongs to the AWS Bedrock Smithy schema `KnowledgeBaseRetrieveAndGenerateConfiguration` (namespace `com.amazonaws.bedrock`, 82200-82211) — a keyword false-positive, not workflow code. Do not cite it as part of this module.

---

## Pre-completion checklist

- [x] No mapping tables in this module doc — list-format refs only; full tables go to `symbol_index_core_features.md`.
- [x] New symbols (mx, n0_, Q0_, g0_, Fp6, FZ, NZ, H48, SL5, xFK, Hj$, tm, b44, d6H, jI, yK, BP8, KP6, hL5, r$7) to be registered in `symbol_index_core_features.md` (Workflows section).
- [x] Code snippets use the single `====` header block + ORIGINAL + READABLE + Mapping.
- [x] Every cited `cli_inner_pretty.js:<line>` was read directly.
- [x] Cross-validation against v2.1.88 stated with confidence (high); NEW-post-2.1.88 verdict explicit.
