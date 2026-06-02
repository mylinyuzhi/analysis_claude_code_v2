# Workflow Tool Registration into Built-In Tool Set (2.1.154)

> Scope: how the Workflow tool object `n0_` enters the canonical built-in tool array
> `getAllBaseTools` (`ra`) through a **lazy `_H$` module slot**, why the slot is spread
> (`...(_H$ ? [_H$] : [])`) rather than referenced statically, and how the `isEnabled`/`NZ`
> gate chain (`NZ → KP6 → SL5 + r$7/k7`) decides whether the model ever sees it.
> The Workflow tool *itself* (schema, `validateInput`, `checkPermissions`, `call`) is documented
> in `42_workflow/`; this doc is the **registration plumbing** that wires it into the tool subsystem.
>
> **Status: NEW post-2.1.88.** The Workflow tool, its lazy slot, and the `NZ/SL5` gate did not
> exist in the 2.1.88 readable build — but the *registration mechanism* it plugs into (the
> `getAllBaseTools` array, the lazy-`null`-slot-then-spread idiom, `getTools`/`assembleToolPool`)
> has a direct 2.1.88 precursor in `src/tools.ts`. Confidence on the plumbing: **high**.

## Related Symbols

> Symbol mappings live ONLY in the central index files:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools, Agent Loop)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Workflow, Background)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Permissions, Gates)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key symbols in this document:
- `getAllBaseTools` (`ra`) — exhaustive built-in tool array; source of truth for everything the model could see (cli_inner_pretty.js:409313-409370).
- `WorkflowTool` object (`n0_`) — the tool definition built by the `yK` factory, name `Workflow` (cli_inner_pretty.js:378217-378225).
- `WorkflowTool` lazy slot (`_H$`) — module-level slot that holds `n0_` after lazy init; spread into `ra()` (cli_inner_pretty.js:409351, 409408, 409499-409501).
- `initializeBundledTools` (`k0`) — the `T()`-wrapped lazy initializer that populates `_H$` and the cron/monitor slots (cli_inner_pretty.js:409445-409504).
- `WorkflowTool export` (`ep6.WorkflowTool`) — module namespace whose getter returns `n0_` (cli_inner_pretty.js:378079-378080).
- `isWorkflowsEnabled` (`NZ`) — the runtime gate behind `n0_.isEnabled` (cli_inner_pretty.js:378222, 184757-184763).
- `resolveWorkflowAvailabilityCached` (`KP6`) — memoized `{available, defaultOn}` accessor (cli_inner_pretty.js:184776-184778).
- `resolveWorkflowAvailability` (`SL5`) — env/Statsig/tier computation of availability (cli_inner_pretty.js:184780-184788).
- `isWorkflowsAllowedByPolicy` (`r$7`) — org-policy gate via `allow_workflows` capability (cli_inner_pretty.js:184770-184772).
- `isWorkflowsDisabledByManagedSettings` (`H48`) — `disableWorkflows` / `CLAUDE_CODE_DISABLE_WORKFLOWS` kill switch (cli_inner_pretty.js:184750-184752).
- `getToolsForDefaultPreset` (`Xg6`) — enabled-only name list for `--tools default` (cli_inner_pretty.js:409308-409312).
- `getTools` (`Jk`) — built-in pool after deny-rule + REPL + isEnabled filtering (cli_inner_pretty.js:409414-409444).
- `assembleToolPool` (`zl`) — merges built-ins + skill tools + dedup (cli_inner_pretty.js:409374-409381).
- `filterToolsByDenyRules` (`HqH`) — strips blanket-denied / blocked tools (cli_inner_pretty.js:409371-409373).
- `yK` (tool factory) — wraps a partial def with `TOOL_DEFAULTS`, preserving getters (cli_inner_pretty.js:143482-143484).
- `registerBaseToolsProvider` (`iUK`) — installs `ra` as the cached tool-list provider (cli_inner_pretty.js:143455-143457).
- `WORKFLOW_TOOL_NAME` (`mx`) — the `"Workflow"` name constant (cli_inner_pretty.js:216290-216291).
- `parseBoolTrue` (`xH`) / `parseBoolFalse` (`k4`) — env truthiness helpers used by the gate (cli_inner_pretty.js:1795-1806).

---

## TL;DR

The model's tool menu is built by one function — `getAllBaseTools` (`ra`) at
`cli_inner_pretty.js:409313`. It returns a hand-ordered array of every built-in tool that *could*
exist in the current environment. The Workflow tool joins this array through three deliberately
decoupled pieces:

1. **The definition** — `n0_` (`cli_inner_pretty.js:378217`) is a normal tool object built by the
   `yK` factory with `name: mx` (`"Workflow"`) and `isEnabled: () => NZ()`. It is exported via the
   `ep6` module namespace as `WorkflowTool` (`cli_inner_pretty.js:378080`).
2. **The lazy slot** — a module-level variable `_H$` (`cli_inner_pretty.js:409408`) starts
   `undefined` and is populated *once*, inside the `T()`-wrapped lazy initializer `k0`
   (`cli_inner_pretty.js:409499-409501`), by calling `initBundledWorkflows()` and then reading
   `ep6.WorkflowTool`.
3. **The spread** — inside `ra()` the slot is conditionally spliced in with
   `...(_H$ ? [_H$] : [])` at `cli_inner_pretty.js:409351`, immediately after the REPL/code
   tool `pQ6` (at cli_inner_pretty.js:409350).

Whether the model actually *sees* Workflow is then a two-stage decision:
- **Slot present?** `_H$` is non-null only after `k0` runs (which happens once the tool registry
  module graph is touched). If the workflow sub-module fails to load, `_H$` stays falsy and the
  spread contributes nothing — a structural "off".
- **`isEnabled()` true?** Even when present, `getToolsForDefaultPreset`/`getTools` call
  `n0_.isEnabled()` → `NZ()` (`cli_inner_pretty.js:378222`). `NZ` walks a four-layer gate
  (`H48` kill-switch → `r$7`/`allow_workflows` org policy → `SL5` env+Statsig availability →
  `enableWorkflows`/tier default) before returning true.

**Why this shape:** registration is structurally cheap and always succeeds; *enablement* is a pure
runtime decision recomputed every time the pool is assembled. That separation is what lets the same
binary expose Workflow to one org and hide it from another without re-bundling.

---

## ASCII overview — definition → slot → array → model

```
                       ┌─────────────────────────────────────────────────────┐
  STATIC (bundle)      │ n0_ = yK({ name: mx="Workflow",                      │
  cli:378217-378225    │            isEnabled: () => NZ(), prompt, schemas })  │
                       │ ep6.WorkflowTool : getter → n0_   (cli:378080)        │
                       └───────────────────────┬─────────────────────────────┘
                                               │ read lazily, once
  LAZY INIT (k0, T()-wrapped)                  ▼
  cli:409445-409504    ┌─────────────────────────────────────────────────────┐
                       │ _H$ = (() => {                                        │
                       │   initBundledWorkflows();        // register bundled  │
                       │   return ep6.WorkflowTool;       // == n0_            │
                       │ })();                            (cli:409499-409501)  │
                       └───────────────────────┬─────────────────────────────┘
                                               │  _H$ now non-null
  ASSEMBLY (ra)                                ▼
  cli:409313-409370    ┌─────────────────────────────────────────────────────┐
                       │ return [ qZ8, CZ8, ... pQ6,                          │
                       │          ...(_H$ ? [_H$] : []),   // (cli:409351)     │
                       │          ...dh_, ...ch_, G34, ... ];                  │
                       └───────────────────────┬─────────────────────────────┘
                                               │
  FILTERING                                    ▼
  Xg6 / Jk / zl        ┌─────────────────────────────────────────────────────┐
  cli:409308,414,374   │ deny-rule filter (HqH) → REPL filter → isEnabled()    │
                       │   n0_.isEnabled() → NZ() → KP6()/SL5() + r$7()/k7()   │
                       └───────────────────────┬─────────────────────────────┘
                                               │  survives all filters?
                                               ▼
                                  MODEL TOOL MENU includes "Workflow"
```

---

## 1. The Workflow tool definition (`n0_`) — what gets registered

The object that ultimately lands in the array is `n0_`, built by the tool factory `yK`. Only the
fields that matter for *registration* are reproduced here; the schema/permission/call internals are
covered in `42_workflow/workflow_tool_definition.md`.

```javascript
// ============================================
// WorkflowTool definition (n0_) — registration-relevant fields
// Location: cli_inner_pretty.js:378217-378234
// ============================================

// ORIGINAL (for source lookup):
n0_ = yK({
  name: mx,
  aliases: ["RunWorkflow"],
  searchHint: "orchestrate subagents with deterministic JavaScript workflow",
  maxResultSizeChars: 1e5,
  isEnabled: () => NZ(),
  async prompt() { return Fp6; },
  async description() { return Fp6; },
  get inputSchema() { return Q0_(); },
  get outputSchema() { return g0_(); },
  // ... toAutoClassifierInput, validateInput, checkPermissions, call ...
});

// READABLE (for understanding):
WorkflowTool = createTool({
  name: WORKFLOW_TOOL_NAME,                 // "Workflow"
  aliases: ["RunWorkflow"],                 // ToolSearch alias
  searchHint: "orchestrate subagents with deterministic JavaScript workflow",
  maxResultSizeChars: 100_000,
  isEnabled: () => isWorkflowsEnabled(),    // the runtime gate (NZ) — recomputed each call
  async prompt()      { return WORKFLOW_TOOL_DESCRIPTION; },
  async description() { return WORKFLOW_TOOL_DESCRIPTION; },
  get inputSchema()   { return buildWorkflowInputSchema(); },   // lazy getter
  get outputSchema()  { return buildWorkflowOutputSchema(); },  // lazy getter
});

// Mapping: n0_→WorkflowTool, mx→WORKFLOW_TOOL_NAME, NZ→isWorkflowsEnabled,
//          Fp6→WORKFLOW_TOOL_DESCRIPTION, Q0_→buildWorkflowInputSchema, g0_→buildWorkflowOutputSchema, yK→createTool
```

Two registration-critical observations:

- `isEnabled: () => NZ()` (cli_inner_pretty.js:378222) means **enablement is a function, not a
  flag**. `ra()` always *includes* the tool in the array; the decision to *show* it is deferred to
  the moment `isEnabled()` is called inside `Xg6`/`Jk` (Section 5). This is the whole reason the
  registration array can be static while the menu is dynamic.
- `inputSchema`/`outputSchema` are *getters*, not values. The `yK` factory
  (cli_inner_pretty.js:143482-143484) copies property descriptors with `Object.defineProperties`,
  so these getters survive into `n0_` and only build the Zod schema when first accessed — never at
  registration time.

```javascript
// ============================================
// yK — tool factory that preserves lazy getters
// Location: cli_inner_pretty.js:143482-143484
// ============================================

// ORIGINAL (for source lookup):
function yK(H) {
  return Object.defineProperties({ ...P45, userFacingName: () => H.name }, Object.getOwnPropertyDescriptors(H));
}

// READABLE (for understanding):
function createTool(partialDef) {
  // Start from TOOL_DEFAULTS (P45), then copy every own descriptor of partialDef
  // on top. Using getOwnPropertyDescriptors (not a {...spread}) keeps `get inputSchema()`
  // a getter instead of evaluating it once at factory time.
  return Object.defineProperties(
    { ...TOOL_DEFAULTS, userFacingName: () => partialDef.name },
    Object.getOwnPropertyDescriptors(partialDef),
  );
}

// Mapping: yK→createTool, H→partialDef, P45→TOOL_DEFAULTS
```

`TOOL_DEFAULTS` (`P45`, cli_inner_pretty.js:143499-143507) supplies `isEnabled: () => !0` — but
Workflow overrides it with `() => NZ()`, so the default never applies here. (See
`42_workflow/workflow_tool_definition.md` Section 1 for the same factory from the tool's own POV.)

### The export indirection (`ep6.WorkflowTool`)

`n0_` is not referenced by the lazy initializer directly. It is reached through a module-namespace
getter so the registration site can stay decoupled from the definition site:

```javascript
// ============================================
// ep6 namespace — WorkflowTool getter → n0_
// Location: cli_inner_pretty.js:378079-378080
// ============================================

// ORIGINAL (for source lookup):
var ep6 = {};
X$(ep6, { WorkflowTool: () => n0_ });

// READABLE (for understanding):
const workflowToolModule = {};
defineLazyExports(workflowToolModule, { WorkflowTool: () => WorkflowTool });  // getter, not value

// Mapping: ep6→workflowToolModule, X$→defineLazyExports, n0_→WorkflowTool
```

`X$` (cli_inner_pretty.js:216290 shows the same idiom for `m57.WORKFLOW_TOOL_NAME`) installs a
*getter-backed* export. Reading `ep6.WorkflowTool` re-evaluates `() => n0_` each time, so the slot
always picks up the live `n0_` (this matters because `n0_` is assigned inside another `T()`-wrapped
init block, not at top level).

---

## 2. The lazy slot `_H$` and the `T()` initializer `k0`

`_H$` is declared as a bare module variable with no initializer (so it is `undefined`) alongside the
other conditional tool slots:

```javascript
// ============================================
// Lazy tool slots — _H$ (Workflow) among the conditional slots, all start undefined/null
// Location: cli_inner_pretty.js:409382-409408
// ============================================

// ORIGINAL (for source lookup):
var dh_, ch_, gM4, dM4, lh_, cM4, lM4 = null, nM4 = null, iM4 = null,
  /* ... */
  rM4 = null, oM4 = null, aM4 = null, sM4 = null, tM4 = null, eM4 = null,
  Hj4 = null, $j4 = null, qj4 = null, Kj4, _j4 = null, zj4 = null, Aj4 = null, Yj4,
  _H$,                          // <- Workflow slot: declared, no initializer (undefined)
  Dg6 = () => { if (!gI()) return null; return ($eH(), Z6(TV$)).PowerShellTool; },
  rh_,
  /* ... Jk = getTools ... */ ;

// READABLE (for understanding):
let cronToolsSlot, /* ch_ */ remoteTriggerSlot, monitorSlot, sendUserFileSlot,
    pushNotificationSlot, coordinatorModeModule /* Kj4 */, shareOnboardingSlot /* Yj4 */,
    workflowToolSlot;            // _H$  — populated lazily in k0()
let getPowerShellTool = () => isPowerShellAvailable() ? loadPowerShellTool() : null;  // Dg6
let TOOL_PRESETS;                // rh_

// Mapping: _H$→workflowToolSlot, Kj4→coordinatorModeModule, Yj4→shareOnboardingSlot,
//          Dg6→getPowerShellTool, rh_→TOOL_PRESETS, Z6→requireLazyModule
```

The slot is filled exactly once, inside `k0` — a `T(() => {...})` lazy initializer (`T` is the
"run-once memoized thunk" wrapper used throughout the bundle). `k0` first runs a long list of
sub-module initializers (`uK()`, `nF6()`, … which define `n0_`, `pQ6`, etc.), then assigns the
conditional slots from their respective lazily-`require`d modules:

```javascript
// ============================================
// k0 — one-time tool-registry initializer that populates _H$ (Workflow slot)
// Location: cli_inner_pretty.js:409491-409504 (assignment block); whole thunk 409445-409504
// ============================================

// ORIGINAL (for source lookup):
((dh_ = [(KO4(), Z6(qO4)).CronCreateTool, (zO4(), Z6(_O4)).CronDeleteTool, (YO4(), Z6(AO4)).CronListTool]),
  (ch_ = []),
  (gM4 = (PO4(), Z6(LO4)).RemoteTriggerTool),
  (dM4 = (YU6(), Z6(AU6)).MonitorTool),
  (lh_ = (VO4(), Z6(TO4)).SendUserFileTool),
  (cM4 = (SO4(), Z6(hO4)).PushNotificationTool),
  (Kj4 = (Bv(), Z6(Bx))),
  (Yj4 = (KM4(), Z6(qM4)).ShareOnboardingGuideTool),
  (_H$ = (() => {
    return ((QM4(), Z6(FM4)).initBundledWorkflows(), (HU6(), Z6(ep6)).WorkflowTool);
  })()),
  (rh_ = ["default"]));
iUK(ra);

// READABLE (for understanding):
cronToolsSlot     = [requireLazy(cronCreateMod).CronCreateTool,
                     requireLazy(cronDeleteMod).CronDeleteTool,
                     requireLazy(cronListMod).CronListTool];
/* ch_ */          = [];
remoteTriggerSlot  = requireLazy(remoteTriggerMod).RemoteTriggerTool;
monitorSlot        = requireLazy(monitorMod).MonitorTool;
sendUserFileSlot   = requireLazy(sendUserFileMod).SendUserFileTool;
pushNotifSlot      = requireLazy(pushNotifMod).PushNotificationTool;
coordinatorModeModule = requireLazy(coordinatorMod);
shareOnboardingSlot   = requireLazy(shareOnboardingMod).ShareOnboardingGuideTool;

workflowToolSlot   = (() => {
  requireLazy(bundledWorkflowsMod).initBundledWorkflows();   // register the built-in workflows first
  return requireLazy(workflowToolModule).WorkflowTool;       // then grab the tool object (== n0_)
})();

TOOL_PRESETS = ["default"];
registerBaseToolsProvider(getAllBaseTools);                  // iUK(ra) — install ra as the cached provider

// Mapping: _H$→workflowToolSlot, ep6→workflowToolModule, ra→getAllBaseTools, iUK→registerBaseToolsProvider,
//          Z6→requireLazy, QM4/FM4→bundledWorkflowsMod, HU6→workflowToolModule loader, dh_→cronToolsSlot
```

### Why an IIFE, and why `initBundledWorkflows()` *before* the tool read

The Workflow slot is the only one assigned via an **IIFE** rather than a single property read,
because it must perform a **side effect in a guaranteed order**:

1. `initBundledWorkflows()` must run first to register the shipped/bundled workflow scripts into the
   workflow registry.
2. *Then* `ep6.WorkflowTool` (==`n0_`) is read.

If the order were reversed, the tool could be registered while the bundled workflow set was still
empty — a subtle "Workflow tool present but `/workflows` shows nothing" bug. The comma-operator
sequence `(initBundledWorkflows(), WorkflowTool)` forces the side effect to complete and then yields
the tool object as the IIFE's value. This is a verbatim port of the 2.1.88 precursor
(`src/tools.ts:129-134`), where the same IIFE wraps the same two-step `require`:

```typescript
// 2.1.88 precursor (src/tools.ts:129-134) — same IIFE, gated by a feature flag
const WorkflowTool = feature('WORKFLOW_SCRIPTS')
  ? (() => {
      require('./tools/WorkflowTool/bundled/index.js').initBundledWorkflows()
      return require('./tools/WorkflowTool/WorkflowTool.js').WorkflowTool
    })()
  : null
```

**Notable delta from 2.1.88 → 2.1.156:** in 2.1.88 the slot was gated *at construction time* by the
`feature('WORKFLOW_SCRIPTS')` static flag — if the flag was off, the slot was `null` and Workflow
could never appear. In 2.1.156 that static feature-flag gate is **gone**: `_H$` is assigned
unconditionally in `k0` (cli_inner_pretty.js:409499-409501). The on/off decision has moved entirely
into the runtime `isEnabled → NZ` gate (Section 4). This is the architectural shift that makes
dynamic workflows a *runtime-configurable* capability (org policy, `/config`, Statsig, tier) rather
than a build-time feature flag — confidence **high**.

### `iUK(ra)` — installing the provider

The last line of `k0`, `iUK(ra)` (cli_inner_pretty.js:409503 → `iUK` at 143455-143457), stores
`ra` as the global "base tools provider" (`nUK`) so other subsystems can pull the canonical list
without importing `ra` directly. This is the registration "publish" step: after `k0` runs, the slot
is filled *and* the provider is wired up.

---

## 3. The spread point inside `getAllBaseTools` (`ra`)

`ra` is the exhaustive, hand-ordered list of every tool that could exist in the environment. The
Workflow slot is spread in right after the REPL/code-execution tool `pQ6`:

```javascript
// ============================================
// getAllBaseTools (ra) — Workflow slot spread among the conditional tail
// Location: cli_inner_pretty.js:409313-409370 (pQ6 at 409350, Workflow spread at 409351)
// ============================================

// ORIGINAL (for source lookup):
function ra() {
  return [
    qZ8, CZ8,
    ...(K1() ? [l4] : []),
    ...(RL() && K1() ? [] : [fC, ev]),
    JC, eY, hJ, GD, hU, LC, zLH, bZ8, deH, YtH, jtH, hL8,
    ...[],
    ...(nM4 ? [nM4] : []),
    /* ... many conditional slots ... */
    ...(R7() ? [nh_(), ih_()] : []),     // agent-teams: TeamCreate/TeamDelete
    ...(rM4 ? [rM4] : []),
    pQ6,                                  // REPL / code-execution tool
    ...(_H$ ? [_H$] : []),                // <- Workflow tool slot, spread iff non-null
    ...dh_,                               // cron tools
    ...ch_,
    G34,
    /* ... */
    c1H, jzH,
    ...(wE() ? [wV$] : []),
    yV7,
  ];
}

// READABLE (for understanding):
function getAllBaseTools() {
  return [
    AgentTool, TaskOutputTool,
    ...(hasEmbeddedSearch() ? [] : [GlobTool, GrepTool]),   // K1()/RL() shape of embedded-search gate
    /* core file/web/todo/task tools ... */
    ...(isAgentTeamsEnabled() ? [TeamCreateTool, TeamDeleteTool] : []),   // R7()
    ...(replOnlyExtra ? [replOnlyExtra] : []),
    codeExecutionTool,                                       // pQ6
    ...(workflowToolSlot ? [workflowToolSlot] : []),         // <- Workflow, present once k0 has run
    ...cronTools,
    /* ... cron / monitor / push / powershell / mcp-resource tools ... */
  ];
}

// Mapping: ra→getAllBaseTools, _H$→workflowToolSlot, pQ6→codeExecutionTool,
//          dh_→cronTools, R7→isAgentTeamsEnabled
```

### Why `...(_H$ ? [_H$] : [])` instead of a static element

This idiom — spread a one-element array when the slot is truthy, otherwise spread the empty array —
is used for **every** conditional tool in `ra` (cron, monitor, push-notification, powershell, agent
teams, etc.). It exists because the slots are **lazily populated module variables**, not static
tool objects:

1. **Null-safety without a hole.** A static `[ ..., pQ6, _H$, ...dh_ ]` would insert `undefined`
   into the array before `k0` runs, and downstream code (`.map(t => t.isEnabled())`,
   `.localeCompare` sorting on `t.name`) would crash on `undefined.name`. The
   `...(_H$ ? [_H$] : [])` form contributes **zero elements** when the slot is empty — no hole, no
   crash.
2. **Cache-stable ordering.** The comment on the 2.1.88 precursor (`src/tools.ts:191`) notes the
   array order MUST stay in sync with the server-side system-prompt cache config. Because the spread
   either adds exactly one element *at a fixed position* or nothing, the relative order of every
   other tool is preserved whether or not Workflow is present — the cache breakpoint after the last
   built-in stays valid.
3. **Position matters for the breakpoint.** Workflow sits immediately after `pQ6`
   (code-execution) and before the cron block — a stable position in the tool prefix, so adding
   Workflow doesn't shuffle the prefix-cached portion of the prompt.

**Key insight:** The truthiness of `_H$` is a *second, structural* gate that sits *under*
`isEnabled`. There are therefore two ways Workflow stays hidden:
- **Structural:** `_H$` falsy (the workflow sub-module never loaded / `k0` never ran) → the spread
  adds nothing → the tool is not even in the array.
- **Runtime:** `_H$` present but `n0_.isEnabled()` (==`NZ()`) false → the tool is in the array but
  filtered out by `Xg6`/`Jk`.
In the normal published build `k0` always runs, so the structural gate is effectively always
"present" and the real decision is the runtime `NZ` gate. The structural gate is the
defense-in-depth fallback for builds/platforms where the workflow module is stripped.

---

## 4. The `isEnabled → NZ` gate chain — when Workflow is actually shown

`n0_.isEnabled` is `() => NZ()`. `NZ` (cli_inner_pretty.js:184757-184763) is a four-layer
short-circuit. Each layer can only *veto*; the final answer is `enableWorkflows ?? defaultOn`.

```javascript
// ============================================
// isWorkflowsEnabled (NZ) — four-layer runtime gate behind n0_.isEnabled
// Location: cli_inner_pretty.js:184757-184763
// ============================================

// ORIGINAL (for source lookup):
function NZ() {
  if (H48()) return !1;                       // 1. managed-settings / env kill switch
  if (!r$7()) return !1;                       // 2. org policy capability gate
  let { available: H, defaultOn: $ } = KP6();  // 3. availability (env + Statsig + tier), memoized
  if (!H) return !1;
  return hL5() ?? $;                           // 4. user /config override, else tier default
}

// READABLE (for understanding):
function isWorkflowsEnabled() {
  if (isWorkflowsDisabledByManagedSettings()) return false;   // disableWorkflows / CLAUDE_CODE_DISABLE_WORKFLOWS
  if (!isWorkflowsAllowedByPolicy())          return false;   // allow_workflows capability (k7)
  const { available, defaultOn } = resolveWorkflowAvailabilityCached();
  if (!available)                             return false;
  return getUserEnableWorkflowsSetting() ?? defaultOn;        // /config switch wins, else tier default
}

// Mapping: NZ→isWorkflowsEnabled, H48→isWorkflowsDisabledByManagedSettings,
//          r$7→isWorkflowsAllowedByPolicy, KP6→resolveWorkflowAvailabilityCached, hL5→getUserEnableWorkflowsSetting
```

### Layer 1 — managed-settings / env kill switch (`H48`)

```javascript
// ============================================
// isWorkflowsDisabledByManagedSettings (H48) — hard kill switch
// Location: cli_inner_pretty.js:184750-184752
// ============================================

// ORIGINAL (for source lookup):
function H48() {
  return xH(process.env.CLAUDE_CODE_DISABLE_WORKFLOWS) || UV()?.settings.disableWorkflows === !0;
}

// READABLE (for understanding):
function isWorkflowsDisabledByManagedSettings() {
  return parseBoolTrue(process.env.CLAUDE_CODE_DISABLE_WORKFLOWS)   // operator env override
      || getManagedSettings()?.settings.disableWorkflows === true; // enterprise-managed settings
}

// Mapping: H48→isWorkflowsDisabledByManagedSettings, xH→parseBoolTrue, UV→getManagedSettings
```

This is the highest-priority veto and the same predicate `validateInput` re-checks at *call* time
(cli_inner_pretty.js:378239-378244, error code 5) — so even if a stale tool list still advertises
Workflow, a managed-settings disable will reject the actual invocation.

### Layer 2 — org policy capability (`r$7` → `k7("allow_workflows")`)

```javascript
// ============================================
// isWorkflowsAllowedByPolicy (r$7) — capability gate
// Location: cli_inner_pretty.js:184770-184772
// ============================================

// ORIGINAL (for source lookup):
function r$7() {
  return k7("allow_workflows");
}

// READABLE (for understanding):
function isWorkflowsAllowedByPolicy() {
  return hasCapability("allow_workflows");   // org policy / data-residency capability table (k7)
}

// Mapping: r$7→isWorkflowsAllowedByPolicy, k7→hasCapability
```

`k7` (cli_inner_pretty.js:184697) is the generic capability resolver used across the platform
(HIPAA/ZDR data-residency tables disable certain capabilities). Routing Workflow through it means a
ZDR/HIPAA org can disable dynamic workflows centrally with the same mechanism that disables web-fetch
or memory-sync.

### Layer 3 — availability (memoized `KP6` → computed `SL5`)

```javascript
// ============================================
// resolveWorkflowAvailabilityCached (KP6) + resolveWorkflowAvailability (SL5)
// Location: cli_inner_pretty.js:184776-184788
// ============================================

// ORIGINAL (for source lookup):
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
let cachedAvailability;                                        // $48
function resolveWorkflowAvailabilityCached() {
  if (cachedAvailability !== undefined) return cachedAvailability;     // memoize once per process
  return (cachedAvailability = resolveWorkflowAvailability());
}
function resolveWorkflowAvailability() {
  if (parseBoolTrue(process.env.CLAUDE_CODE_WORKFLOWS)) {              // explicit-true env
    const on = getFeatureGate("tengu_workflows_enabled", true);
    return { available: on, defaultOn: on };
  }
  if (parseBoolFalse(process.env.CLAUDE_CODE_WORKFLOWS))              // explicit-false env
    return { available: false, defaultOn: false };
  if (!getFeatureGate("tengu_workflows_enabled", true))                  // Statsig gate off
    return { available: false, defaultOn: false };
  return { available: true, defaultOn: getSubscriptionTier() !== "pro" };  // default ON for non-pro tiers
}

// Mapping: KP6→resolveWorkflowAvailabilityCached, SL5→resolveWorkflowAvailability, $48→cachedAvailability,
//          xH→parseBoolTrue, k4→parseBoolFalse, V$→getFeatureGate, _4→getSubscriptionTier
```

`KP6` memoizes into `$48` (cli_inner_pretty.js:184789) so the env/Statsig/tier computation runs
exactly once. `SL5` resolves a three-state env (`CLAUDE_CODE_WORKFLOWS` explicit-true via `xH`,
explicit-false via `k4`, unset → Statsig gate `tengu_workflows_enabled`). The crucial product
decision is the last line: when available, **`defaultOn` is true for every tier except `"pro"`**
(`_4()` is the subscription type from cli_inner_pretty.js:131589). Pro users must opt in via
`/config`; everyone else gets it by default.

### Layer 4 — user override, else tier default (`hL5`)

`hL5()` (cli_inner_pretty.js:184773-184775) reads the user's `/config` "Dynamic workflows"
setting (`enableWorkflows`). `NZ` returns `hL5() ?? $` — a non-undefined user setting wins, otherwise
the tier-derived `defaultOn` from layer 3 applies. This is the "user can flip it either way within
what their org allows" layer.

> Full cross-reference: this same `NZ`/`SL5`/`KP6`/`r$7` gate is documented from the *runtime/launch*
> angle in `42_workflow/gate_caps_lifecycle_relations.md` and from the *tool definition* angle in
> `42_workflow/workflow_tool_definition.md` Section 2. This doc documents only its role as the
> `isEnabled` predicate that the **registration filters** call.

---

## 5. From array to model: how the filters consume the slot

Three consumers read `ra()` and apply `isEnabled()` to decide the final menu.

### `getToolsForDefaultPreset` (`Xg6`) — name list for `--tools default`

```javascript
// ============================================
// getToolsForDefaultPreset (Xg6) — enabled-only names from ra()
// Location: cli_inner_pretty.js:409308-409312
// ============================================

// ORIGINAL (for source lookup):
function Xg6() {
  let H = ra(),
    $ = H.map((q) => q.isEnabled());
  return H.filter((q, K) => $[K]).map((q) => q.name);
}

// READABLE (for understanding):
function getToolsForDefaultPreset() {
  const all = getAllBaseTools();
  const enabledMask = all.map((t) => t.isEnabled());   // calls n0_.isEnabled() == NZ() for Workflow
  return all.filter((_, i) => enabledMask[i]).map((t) => t.name);
}

// Mapping: Xg6→getToolsForDefaultPreset, ra→getAllBaseTools
```

Note the **mask-then-filter** pattern: `isEnabled()` for *every* tool is computed once into an array
(`$`), then used to filter. This evaluates `NZ()` exactly once per assembly and avoids re-invoking
side-effecting gates mid-iteration. It is a verbatim port of `getToolsForDefaultPreset` in 2.1.88
(`src/tools.ts:179-183`) — confidence **high**.

### `getTools` (`Jk`) — the real built-in pool

`Jk` (cli_inner_pretty.js:409414-409444) is the production path. It:
1. Drops the three "special" tools (`c1H`, `jzH`, and the synthetic-output name `iY`) that are added
   conditionally elsewhere (cli_inner_pretty.js:409426).
2. Applies `HqH` (`filterToolsByDenyRules`) so blanket-denied / MCP-blocked tools never reach the
   model (cli_inner_pretty.js:409427-409428).
3. Applies the REPL-mode filter that hides REPL-only primitives when the REPL tool is active.
4. Maps `isEnabled()` into a mask and filters — the same mask trick as `Xg6`
   (cli_inner_pretty.js:409434-409435). This is where `NZ()` decides Workflow's fate in the live
   session.

`Jk` also has a `CLAUDE_CODE_SIMPLE` fast-path (cli_inner_pretty.js:409415-409425) that hard-codes a
tiny tool set; notably, even there, when in coordinator mode it appends the Workflow slot guarded by
**both** the slot truthiness *and* `NZ()`: `...(_H$ && NZ() ? [_H$] : [])`
(cli_inner_pretty.js:409418, 409423). This is the only place the slot truthiness and the runtime
gate are AND-ed *inline* — a belt-and-suspenders check in the minimal-tools path.

### `assembleToolPool` (`zl`) — merge with skill tools + dedup

```javascript
// ============================================
// assembleToolPool (zl) — built-ins + skill tools, sorted & deduped
// Location: cli_inner_pretty.js:409374-409381
// ============================================

// ORIGINAL (for source lookup):
function zl(H, $, q) {
  let K = Jk(H, q),
    _ = HqH($, H),
    z = (f, O) => f.name.localeCompare(O.name),
    A = q?.skillTools ?? [],
    Y = A.length > 0 ? _.concat(HqH(A, H)).sort(z) : _.sort(z);
  return TX([...K].sort(z).concat(Y), "name");
}

// READABLE (for understanding):
function assembleToolPool(permissionContext, mcpTools, options) {
  const builtInTools = getTools(permissionContext, options);          // includes Workflow iff NZ()
  let allowedMcp = filterToolsByDenyRules(mcpTools, permissionContext);
  const byName = (a, b) => a.name.localeCompare(b.name);
  const skillTools = options?.skillTools ?? [];
  const mcpPartition = skillTools.length > 0
    ? allowedMcp.concat(filterToolsByDenyRules(skillTools, permissionContext)).sort(byName)
    : allowedMcp.sort(byName);
  // built-ins as a contiguous, sorted prefix; uniqBy keeps first occurrence (built-in wins)
  return uniqByName([...builtInTools].sort(byName).concat(mcpPartition), "name");
}

// Mapping: zl→assembleToolPool, Jk→getTools, HqH→filterToolsByDenyRules, TX→uniqByName,
//          H→permissionContext, $→mcpTools, q→options
```

This matches the 2.1.88 `assembleToolPool` (`src/tools.ts:345-367`) — confidence **high** — including
the deliberate **sort built-ins as a contiguous prefix, then MCP tools** strategy that keeps the
system-prompt cache breakpoint stable. Workflow, being a built-in, always sorts inside the built-in
prefix; it never interleaves with MCP tools, so toggling it on/off only invalidates the suffix of
the cache, not the whole prompt.

`filterToolsByDenyRules` (`HqH`, cli_inner_pretty.js:409371-409373) is the deny gate: a tool is
removed if a deny rule matches its name *or* its `mcpInfo.effectiveMaxPermission === "blocked"`. So
`Workflow` can also be removed by a `deny: ["Workflow"]` settings rule entirely independent of `NZ`.

---

## 6. The complete decision table

Putting the structural slot, the deny rules, and the runtime gate together:

```
                                            _H$ truthy?   NZ() true?   deny rule?   →  Workflow visible?
─────────────────────────────────────────────────────────────────────────────────────────────────────
workflow module stripped / k0 never ran        no            —            —              NO (structural)
disableWorkflows / CLAUDE_CODE_DISABLE_*        yes          no            —              NO (H48 veto)
org lacks allow_workflows capability            yes          no            —              NO (r$7 veto)
CLAUDE_CODE_WORKFLOWS=false                      yes          no            —              NO (SL5 unavailable)
Statsig tengu_workflows_enabled off             yes          no            —              NO (SL5 unavailable)
pro tier, no /config opt-in                      yes          no            —              NO (defaultOn=false)
non-pro tier, available, no override             yes         yes           no             YES
any tier, user enabled in /config                yes         yes           no             YES
available + enabled BUT deny:["Workflow"]        yes         yes          yes             NO (HqH veto)
```

The order of vetoes inside `NZ` is `H48 → r$7 → SL5/KP6 → (enableWorkflows ?? defaultOn)`, and the
deny-rule veto (`HqH`) is applied *outside* `NZ` inside `Jk`/`zl`. The structural slot check is the
outermost gate of all.

---

## 7. Sibling 2.1.143–156 tools-subsystem deltas (anchors only)

These belong to the same "04_tools delta" but are documented in their own files; cross-referenced
here for completeness:

- **AskUserQuestion reservation (2.1.154).** The name constant `AskUserQuestion` (`ez`) is at
  cli_inner_pretty.js:143388. The 2.1.154 behavior change ("reserve the multiple-choice prompt for
  decisions it genuinely cannot make") lives in the tool's prompt/description, not in registration.
  See `04_tools/ask_user_question_reservation.md`.
- **`disallowed-tools` frontmatter.** Skills/slash-commands can *remove* tools from the assembled
  pool via frontmatter at cli_inner_pretty.js:184492-184497 area — this is a subtractive filter
  applied after `zl`, orthogonal to the additive registration described here. See
  `10_skill_system/`.
- **Read partial-view truncation (2.1.145)** and **streaming tool execution extended to
  Bedrock/Vertex (2.1.156)** are runtime-behavior changes to specific tools, not registration
  changes. Both are covered in the single file `04_tools/read_partial_view_and_streaming_exec.md`
  (Part 1 = Read partial-view, Part 2 = the per-model/per-provider `eager_input_streaming` gate).

---

## 8. Why this approach (design synthesis)

**Registration is structural and unconditional; enablement is runtime and recomputed.**
The single most important design choice is the split between *being in the array* and *being shown to
the model*. In 2.1.88 a static `feature('WORKFLOW_SCRIPTS')` flag decided both at once. In 2.1.156
the static flag is gone: `_H$` is filled unconditionally in `k0`, and the entire on/off decision is
the `isEnabled → NZ` function recomputed on every `getTools`/`assembleToolPool` call. This is what
makes "Dynamic workflows" a setting an org admin can flip, a user can toggle in `/config`, or a
Statsig gate can roll out gradually — all without re-shipping the binary.

**Lazy slot + spread is the bundle-wide idiom for conditional tools.** Workflow uses the exact same
`var slot; slot = require(...); ...(slot ? [slot] : [])` pattern as cron, monitor, push-notification,
powershell, agent-teams, etc. Reusing the idiom keeps `ra()` cache-stable (fixed positions, no holes)
and lets each tool's module be `require`d lazily inside `k0` rather than at top-level import time —
keeping cold-start cheap.

**The IIFE with `initBundledWorkflows()` first** is the one wrinkle: Workflow has a *registration
side effect* (its bundled scripts) that must complete before the tool object is exposed, so it can't
be a bare property read like the other slots. The comma-operator IIFE enforces that ordering.

**Defense in depth.** Three independent layers can hide Workflow — structural slot truthiness,
the multi-veto `NZ` gate, and the deny-rule filter — and the call-time `validateInput` re-checks
`H48`/`NZ` (cli_inner_pretty.js:378239-378251) so a stale advertised tool list cannot smuggle a
disabled Workflow into execution.

**Key insight:** The Workflow tool was *added* in 2.1.154, but it added **no new registration
machinery** — it slotted into an existing, well-worn pattern (`getAllBaseTools` array + lazy slot +
conditional spread + `isEnabled` filter). The genuinely new part is purely the gate function family
(`NZ/SL5/KP6/r$7/H48`) that replaced the old static feature flag, moving the on/off decision from
build time to runtime.

---

## Pre-completion checklist

- [x] No mapping tables in this module doc — list-format symbol refs only.
- [x] All cited `cli_inner_pretty.js:NNN` lines were read directly in this session.
- [x] Dual-version snippets: header `====` block + ORIGINAL + READABLE + Mapping, ORIGINAL verbatim.
- [x] Cross-validated against 2.1.88 `src/tools.ts` (getAllBaseTools/getTools/assembleToolPool/WorkflowTool IIFE); confidence stated.
- [x] NEW-post-2.1.88 status stated for the Workflow tool + gate; precursor stated for the registration plumbing.
- [x] Cross-links to `42_workflow/` for runtime, `04_tools/` siblings for related deltas.
