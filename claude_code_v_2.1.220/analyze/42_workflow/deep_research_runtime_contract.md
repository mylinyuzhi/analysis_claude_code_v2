# The runtime contract beneath `deep-research` — registration, projection, realm, and fan-out

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(`build_sha 4073f595`). Every line number was read in **this** build.
**Baseline:** `…/versions/2.1.193/extract/cli_inner_pretty.js`, cited `(193)`.
**Named cross-check:** `/lyz/codespace/3rd/claude-code/src/` (v2.1.88 TypeScript).

Companion: [`deep_research_harness.md`](deep_research_harness.md) analyses the script. This document
analyses everything the script *stands on*: how a string in the binary becomes a runnable slash
command, what the realm it executes in actually contains, what `agent()` really does, what identity
its subagents run under, and which caps bind.

Where the general runtime is already documented in
[`workflow_runtime_core.md`](workflow_runtime_core.md) and
[`workflow_lifecycle.md`](workflow_lifecycle.md), this document does not restate it — it traces the
specific path `deep-research` takes and derives the consequences for that harness.

---

## TL;DR

| Fact | Evidence |
|------|----------|
| The bundled registry is a plain module-global array filled once, lazily, when the `Workflow` tool object is first constructed | `SSd` `:385340-385343`; `initBundledWorkflows` `:424902-424904`; call site `:425151` |
| Every registered workflow is **projected into a slash command** by `createWorkflowCommand`; that is the only reason `/deep-research` exists | `:506513-506557`, `:506559-506562` |
| `hidden: true` is what keeps `code-review` off the command list. `deep-research` does not set it | `:506561` filter; `:424406-424407` vs `:424878-424880` |
| The command does **not** run the workflow. It emits a prompt telling the model to call `Workflow({name:'deep-research', args})` | `:506528-506556` |
| Running it is `ask`-by-default: the approval dialog shows the resolved **script**, not the name | `:389443-389475` |
| `disableModelInvocation` may be a **function**, evaluated at command-build time — which is why `.218`'s restraint is remotely reversible | `:506526-506527`; `MJy` `:424445-424448` |
| The realm is `vm.createContext` over a null-prototype object with **11 host values** and nothing else. No `URL`, no `fetch`, no `require`, no `process` | `:388365-388414` |
| `Date.now`, `Math.random` and `new Date()` all **throw** inside the realm; `eval`/`Function` are disabled via `codeGeneration:{strings:false}` | `:386390-386410`, `:388383` |
| Deep-research's subagents are `workflow-subagent`: `tools: ["*"]` minus `SendUserMessage`, `Agent`, `Workflow` — so WebSearch and WebFetch are available, and recursion into more workflows is not | `:388208-388216` |
| `{schema}` swaps the system prompt, appends the `StructuredOutput` tool, and strips any pre-existing one | `:387445-387466`, `:388196-388207` |
| Concurrency is `min(16, max(2, cpus − 2))`; the 75-agent verify phase is throttled to that width | `:387140-387142`, `:388177` |
| The resume cache key hashes `(prevKey, prompt, {schema,model,effort,isolation,agentType})` — **`label` and `phase` are excluded**, so the `.207` label rework did not invalidate journals | `FSd` `:387077-387080`; `VWy` `:387047-387076` |
| Telemetry reports `workflow_name: "deep-research"` in the clear **only** because the script is a verbatim built-in; user scripts report `"custom"` | `:389525-389532`, `:388570-388573`, `:385327` (`source:"built-in"`) |

---

## 1. The launch chain, end to end

Nine hops from a keystroke to a running research harness:

```
  user types  /deep-research <question>
      │
 [1]  slash-command registry lookup ─────────────── GBo :507314-507328  (merges workflow commands in)
      │                                              via getWorkflowCommands HM_ :506559-506562
 [2]  command is type:"prompt", kind:"workflow" ─── createWorkflowCommand Lep :506513-506557
      │
 [3]  getPromptForCommand(args) ──────────────────── :506528-506556
      │      emits:  Run the "deep-research" workflow.  …  Invoke: Workflow({ name: "deep-research", args: "<question>" })
      │
 [4]  model reads that prompt, calls the tool ───── WorkflowTool S6y :389355-…
      │
 [5]  checkPermissions ───────────────────────────── :389432-389476   (deny → ask → allow rules; DEFAULT = ask)
      │
 [6]  call(): resolve name → script ──────────────── yEd :389188-389215 → Dsn :388331-388333 → Lft :388346-388356 → ksn :385336-385339
      │
 [7]  parse meta, compile with the await transform ─ $H :275599, Cft :386354, jWy :386287
      │
 [8]  launch (async, returns immediately) ────────── Osn :388585-…  → rEd :388439-388529 → eEd :388358-388429
      │
 [9]  script runs in the VM; agent() spawns subagents through the semaphore
```

Two properties of this chain are worth naming because they are unusual:

**The slash command never executes anything.** Hop [3] produces *text for the model*, not a call.
`/deep-research` is a prompt-injection convenience: it tells the model the workflow's name,
description, `whenToUse`, and phase list, then hands it the exact tool call to make. If the model
declines, nothing runs. This is why the `.218` restraint had to touch the *listing* and the *Skill
tool* rather than the workflow: the human path and the model path converge on the same tool call.

**The tool returns before the work starts.** Hop [8] returns `{ status: "async_launched", taskId,
runId, transcriptDir, scriptPath }` (`:389555-389566`) while the VM keeps running in the background.
The model gets a receipt, not a report; the report arrives later as a task notification. A
deep-research run that takes ten minutes therefore does not hold the model's turn open.

---

## 2. Registration — a 9-line registry

```javascript
// ============================================
// registerBundledWorkflow / getBundledWorkflows - the entire bundled-workflow registry
// Location: cli_inner_pretty.js:385327-385343
// ============================================

// ORIGINAL (for source lookup):
function kxo(e, t, r) {
  SSd.push({
    source: "built-in",
    ...t,
    script: e,
    hidden: r?.hidden,
    disableModelInvocation: r?.disableModelInvocation,
  });
}
function ksn() {
  if (bV()) return [];
  return SSd;
}
var SSd;
var Hsn = S(() => {
  Dxe();
  SSd = [];
});

// READABLE (for understanding):
function registerBundledWorkflow(script, meta, options) {
  BUNDLED_WORKFLOWS.push({
    source: "built-in",          // set FIRST so meta cannot override it
    ...meta,                     // { name, description, whenToUse, phases }
    script,
    hidden: options?.hidden,
    disableModelInvocation: options?.disableModelInvocation,   // boolean OR () => boolean
  });
}
function getBundledWorkflows() {
  if (areBundledSkillsDisabled()) return [];   // CLAUDE_CODE_DISABLE_BUNDLED_SKILLS / disableBundledSkills
  return BUNDLED_WORKFLOWS;
}
let BUNDLED_WORKFLOWS = [];

// Mapping: kxo→registerBundledWorkflow, ksn→getBundledWorkflows, SSd→BUNDLED_WORKFLOWS,
//          bV→areBundledSkillsDisabled, Hsn→bundledWorkflowRegistryModuleInit
```

**Three design points in nine lines:**

1. **`source: "built-in"` is written before the spread.** A registrar that passed
   `{source: "plugin"}` in `meta` would be silently honoured if the order were reversed. Since
   `source` gates telemetry redaction (§9) and the "verbatim built-in" check (`:389498`), that
   ordering is load-bearing.
2. **`getBundledWorkflows()` returns `[]` when bundled skills are disabled** rather than filtering
   downstream. One check, applied at the single read point, so `deep-research` disappears from the
   command list, the resolver, and the "is this a built-in script" test simultaneously. The setting
   is described at `:60835` as: *"bundled skills and workflows are removed entirely"* — and this is
   the line that implements the "entirely".
3. **`disableModelInvocation` is stored unevaluated.** The type is `boolean | (() => boolean)`, and
   nothing here decides which. That is what makes `.218` remotely reversible (§4.1).

**When it is filled.** Never at startup. `initBundledWorkflows` (`OJy` `:424902-424904`) calls both
registrars, and it is invoked exactly once, from the lazy `WorkflowTool` construction at `:425151`:

```javascript
// ============================================
// Lazy bundled-workflow init - the registry fills on first construction of the Workflow tool
// Location: cli_inner_pretty.js:425151
// ============================================

// ORIGINAL (for source lookup):
    (ihr = (() => ((yRd(), en(gRd)).initBundledWorkflows(), (aMs(), en(sMs)).WorkflowTool))()),

// READABLE (for understanding):
workflowToolOrNull = (() => {
  requireBundledWorkflowsModule().initBundledWorkflows();   // ← registers code-review + deep-research
  return requireWorkflowToolModule().WorkflowTool;
})();

// Mapping: ihr→workflowToolOrNull, yRd/gRd→bundled workflows module, aMs/sMs→WorkflowTool module
```

This exact shape survives from v2.1.88, where the named source reads
`require('./tools/WorkflowTool/bundled/index.js').initBundledWorkflows()` before
`require('./tools/WorkflowTool/WorkflowTool.js').WorkflowTool`
(`/lyz/codespace/3rd/claude-code/src/tools.ts:129-132`), guarded by `feature('WORKFLOW_SCRIPTS')`.
The mechanism is three years of versions old; only its *contents* are new.

**Consequence for `deep-research`:** if the Workflow tool is never constructed — `enableWorkflows`
off, or the feature unavailable (`M0()` `:119317-119323`) — the registry stays empty and
`/deep-research` does not exist as a command at all. It is not hidden; it is absent.

### 2.1 Resolution by name

```javascript
// ============================================
// getAllWorkflows / resolveWorkflowByName - name-only mode and the user-overrides-builtin precedence
// Location: cli_inner_pretty.js:388331-388356
// ============================================

// ORIGINAL (for source lookup):
async function Dsn(e, t) {
  return (await Lft(t)).find((n) => n.name === e);
}
...
  Lft = Vr(
    async (e) => {
      if (fd("workflows") || z$t()) return [...ksn()];
      let [t, r] = await Promise.all([QSd(e), Oyo()]),
        n = new Set(t.map((a) => a.name)),
        o = r.filter((a) => !n.has(a.name)),
        i = new Set([...n, ...o.map((a) => a.name)]);
      return [...ksn().filter((a) => !i.has(a.name)), ...o, ...t];
    },
    (e) => `${bV()}:${z$t()}:${e}`,
  );

// READABLE (for understanding):
async function resolveWorkflowByName(name, cwd) {
  return (await getAllWorkflows(cwd)).find(w => w.name === name);
}
const getAllWorkflows = memoise(
  async (cwd) => {
    // Lockdown: only the bundled set is visible at all
    if (isSlashCommandsDisabled("workflows") || isWorkflowNameOnlyMode()) return [...getBundledWorkflows()];
    const [userWorkflows, pluginWorkflows] = await Promise.all([loadUserWorkflows(cwd), loadPluginWorkflows()]);
    const userNames   = new Set(userWorkflows.map(w => w.name));
    const plugins     = pluginWorkflows.filter(w => !userNames.has(w.name));
    const taken       = new Set([...userNames, ...plugins.map(w => w.name)]);
    // precedence, weakest first: built-in < plugin < user
    return [...getBundledWorkflows().filter(w => !taken.has(w.name)), ...plugins, ...userWorkflows];
  },
  (cwd) => `${areBundledSkillsDisabled()}:${isWorkflowNameOnlyMode()}:${cwd}`,
);

// Mapping: Dsn→resolveWorkflowByName, Lft→getAllWorkflows, QSd→loadUserWorkflows, Oyo→loadPluginWorkflows,
//          z$t→isWorkflowNameOnlyMode, fd→isSlashCommandsDisabled, Vr→memoise
```

**A user file named `deep-research.js` in `~/.claude/workflows/` shadows the bundled harness
completely.** The built-in set is filtered by `taken` — user names win, plugin names win over
built-in, and the built-in is dropped, not merged. There is no warning and no marker in the command
list beyond the `source` field. That is a deliberate "your machine, your workflow" precedence, and
it is the same precedence the skills system uses.

Under `CLAUDE_WORKFLOW_NAME_ONLY` (`:386782-386787`) the branch returns *only* the bundled set, so in
that lockdown mode `deep-research` is one of the two workflows that can run at all.

The memo key includes `areBundledSkillsDisabled()` and the name-only flag, so toggling either
invalidates the cache correctly. `invalidateWorkflowCache` (`Jxo` `:388334-388336`) clears it
explicitly when workflow files change on disk.

---

## 3. The command projection

```javascript
// ============================================
// createWorkflowCommand - projecting a registry row into a slash command
// Location: cli_inner_pretty.js:506513-506562
// NOTE: inside getPromptForCommand the bundle writes template literals across real newlines
//       (`:506530-506535`, `:506543-506553`); shown here with \n escapes for compactness.
//       Every other line is verbatim.
// ============================================

// ORIGINAL (for source lookup):
function Lep(e) {
  return {
    type: "prompt",
    name: e.name,
    description: e.description,
    hasUserSpecifiedDescription: !0,
    whenToUse: e.whenToUse,
    progressMessage: "running dynamic workflow",
    contentLength: e.script.length,
    source: e.source === "built-in" ? "bundled" : e.source,
    loadedFrom: e.source === "built-in" ? "bundled" : e.source === "plugin" ? "plugin" : "skills",
    ...
    kind: "workflow",
    disableModelInvocation:
      typeof e.disableModelInvocation === "function" ? e.disableModelInvocation() : e.disableModelInvocation,
    async getPromptForCommand(t) {
      let r = e.phases ? `\n\nPhases:\n` + e.phases.map((s) => `- ${s.title}${s.detail ? `: ${s.detail}` : ""}`).join(`\n`) : "",
        n = t.trim(), o = Ie(e.name),
        i = n ? `{ name: ${o}, args: ${Ie(n)} }` : `{ name: ${o} }`;
      return [{ type: "text", text: `Run the "${e.name}" workflow.\n\n${e.description}${...}${r}\n\nInvoke: Workflow(${i})` }];
    },
  };
}
async function HM_(e) {
  if (!M0()) return [];
  return (await Lft(e)).filter((r) => !r.hidden).map(Lep);
}

// READABLE (for understanding):
function createWorkflowCommand(w) {
  return {
    type: "prompt",                              // a prompt command: expands to text for the model
    name: w.name,                                // → /deep-research
    description: w.description,
    kind: "workflow",                            // → the "[dynamic workflow]" menu tag (:744020)
    progressMessage: "running dynamic workflow",
    source: w.source === "built-in" ? "bundled" : w.source,
    // EVALUATED HERE, once per command-list build:
    disableModelInvocation: typeof w.disableModelInvocation === "function"
                              ? w.disableModelInvocation()
                              : w.disableModelInvocation,
    async getPromptForCommand(userArgs) {
      const phases = w.phases ? "\n\nPhases:\n" + w.phases.map(p => `- ${p.title}${p.detail ? `: ${p.detail}` : ""}`).join("\n") : "";
      const args = userArgs.trim();
      const call = args ? `{ name: ${JSON.stringify(w.name)}, args: ${JSON.stringify(args)} }`
                        : `{ name: ${JSON.stringify(w.name)} }`;
      return [{ type: "text", text:
        `Run the "${w.name}" workflow.\n\n${w.description}${w.whenToUse ? `\n\n${w.whenToUse}` : ""}${phases}\n\nInvoke: Workflow(${call})` }];
    },
  };
}
async function getWorkflowCommands(cwd) {
  if (!isWorkflowFeatureEnabled()) return [];
  return (await getAllWorkflows(cwd)).filter(w => !w.hidden).map(createWorkflowCommand);
}

// Mapping: Lep→createWorkflowCommand, HM_→getWorkflowCommands, M0→isWorkflowFeatureEnabled,
//          Lft→getAllWorkflows, Ie→JSON.stringify
```

**What the user sees.** The autocomplete row is built by `JJa` (`:744010-744026`): `displayText` is
`/deep-research`, `tag` is `"dynamic workflow"` when `type === "prompt" && kind === "workflow"`
(`:744013`, `:744020`), and `description` is the workflow description. That is exactly the string
that prompted this analysis:

> `[dynamic workflow] Deep research harness — fan-out web searches, fetch sources, adversarially verify claims, synthesize a cited report.`

The model-facing form differs: `PYe` (`:506916-506918`) renders
`` `${description} (dynamic workflow)` `` — suffix rather than tag — for skill listings.

**Why `hidden` and not a separate registry.** `code-review` registers with `{hidden: !0}`
(`:424406-424407`) because it is launched *by the `/code-review` skill*, not by a user typing
`/code-review` as a workflow — two commands with the same name would collide. `deep-research` has no
skill wrapper, so it must be its own command, so it must not be hidden. One boolean expresses
"launched by something else" versus "launched directly".

**The `args` round trip.** `JSON.stringify` is applied to both the name and the user's argument text
before interpolation (`:506538-506539`), so a question containing quotes or newlines produces a
valid tool call in the emitted prompt. This is the only escaping in the path — and it is on the
right side, since the model must reproduce a syntactically valid call.

**The phases are advertised to the model.** `getPromptForCommand` inlines the five
`{title, detail}` rows, so before the model calls the tool it has been told the run will do
"5 parallel WebSearch agents" and "3-vote adversarial verification per claim". That is how the model
knows the cost profile — the harness's own `meta.phases` is its cost disclosure.

---

## 4. `.218` — three enforcement layers for one restraint

### 4.1 Layer 1: removed from the model's skill listing

```javascript
// ============================================
// isModelInvocableCommand - the filter that hides disable-model-invocation commands from the listing
// Location: cli_inner_pretty.js:506851-506863
// ============================================

// ORIGINAL (for source lookup):
function oKe(e) {
  return (
    e.type === "prompt" &&
    !e.disableModelInvocation &&
    !DEe(e) &&
    (e.source === "builtin" || e.loadedFrom === "bundled" || e.loadedFrom === "skills" ||
     e.loadedFrom === "commands_DEPRECATED" || e.hasUserSpecifiedDescription || !!e.whenToUse)
  );
}

// READABLE (for understanding):
function isModelInvocableCommand(cmd) {
  return cmd.type === "prompt"
      && !cmd.disableModelInvocation      // ← .218 drops /deep-research here
      && !isExcludedCommand(cmd)
      && (cmd.source === "builtin" || cmd.loadedFrom === "bundled" || cmd.loadedFrom === "skills"
          || cmd.loadedFrom === "commands_DEPRECATED" || cmd.hasUserSpecifiedDescription || !!cmd.whenToUse);
}

// Mapping: oKe→isModelInvocableCommand, DEe→isExcludedCommand
```

`oKe` is applied by `zL` (`:507331-507334`), whose output feeds `BLo` (`:441278-441285`) → `YFo`
(`:499488-499499`) → `FLo` (`:441264-441276`), which renders the `- name: description` lines that
become the `skill_listing` system-reminder (`:534248-534258`). Since `createWorkflowCommand`
evaluates `disableModelInvocation()` eagerly, a `deep-research` row with the gate off is `true` here
and the command never reaches the listing. **The model is not told the command exists.**

### 4.2 Layer 2: refusal if it calls anyway

```javascript
// ============================================
// checkSkillInvocationBlocked - the runtime refusal, conditioned on whether the USER typed it
// Location: cli_inner_pretty.js:346456-346463
// ============================================

// ORIGINAL (for source lookup):
function oin(e, t) {
  let { commandName: r, userTypedThisTurn: n, isMainSession: o, permissionContext: i } = t;
  if (e.disableModelInvocation && !n)
    return {
      reason: "disable_model_invocation",
      message: `Skill ${r} cannot be used with ${Ph} tool due to disable-model-invocation`,
      errorCode: 4,
    };

// READABLE (for understanding):
function checkSkillInvocationBlocked(cmd, { commandName, userTypedThisTurn, … }) {
  if (cmd.disableModelInvocation && !userTypedThisTurn)      // ← the escape hatch for humans
    return { reason: "disable_model_invocation", message: `Skill ${commandName} cannot be used with the Skill tool …`, errorCode: 4 };
  …
}

// Mapping: oin→checkSkillInvocationBlocked, Ph→SKILL_TOOL_NAME
```

**`!userTypedThisTurn` is the whole design.** The restraint is about *initiative*, not capability:
the model may not decide on its own to spend ~100 subagents, but when a human types
`/deep-research`, the model is expected to execute it. `userTypedThisTurn` is derived by scanning
the current turn's messages for a bare `/<name>` token (`zNy` `:346566-346569`), so the check is
"did the human ask for this, in this turn" — not a session-level flag that could go stale.

### 4.3 Layer 3: the system-prompt clause

```javascript
// ============================================
// AGENT_AND_WORKFLOW_RESTRAINT_CLAUSE - a server-overridable default in the Opus-5 prompt bundle
// Location: cli_inner_pretty.js:508111-508115, applied at :507502-507514
// ============================================

// ORIGINAL (for source lookup):
  Kep = [
    "Do not call the AgentTool unless the user requested it",
    "Do not use workflows or deep-research unless the user requested it",
  ].join(`\n`);
...
function nO_(e) {
  let t = Jx()?.tengu_heron_brook;
  if (typeof t === "string" && t.trim() !== "") { ... return n; }
  let r = Ke("tengu_heron_brook", "");
  if (r.trim() !== "") { ... return n; }
  if (ZXn(e)) return (O("tengu_heron_brook_applied", { len: Kep.length, fromClientData: !1 }), Kep);
  return null;
}

// READABLE (for understanding):
const AGENT_AND_WORKFLOW_RESTRAINT_CLAUSE = [
  "Do not call the AgentTool unless the user requested it",
  "Do not use workflows or deep-research unless the user requested it",
].join("\n");

function resolveExtraSystemPromptClause(model) {
  const fromClientData = getClientData()?.tengu_heron_brook;     // 1st: server-pushed client data
  if (typeof fromClientData === "string" && fromClientData.trim()) return fromClientData.trim();
  const fromGate = readFeatureGate("tengu_heron_brook", "");      // 2nd: feature-gate string
  if (fromGate.trim()) return fromGate.trim();
  if (usesOpus5PromptBundle(model)) return AGENT_AND_WORKFLOW_RESTRAINT_CLAUSE;  // 3rd: hard-coded default
  return null;
}

// Mapping: Kep→AGENT_AND_WORKFLOW_RESTRAINT_CLAUSE, nO_→resolveExtraSystemPromptClause,
//          Jx→getClientData, Ke→readFeatureGate, ZXn→usesOpus5PromptBundle, O→emitTelemetry
```

**The clause is a *fallback*, not a fixture.** `tengu_heron_brook` is a free-text system-prompt slot
with three sources in strict precedence: server-pushed client data, a feature-gate string, then this
hard-coded pair. Anthropic can replace the text entirely without a release. The hard-coded default
applies only when `usesOpus5PromptBundle(model)` (`ZXn` `:118700-118704`) — which requires the
model's `opus_5_prompt_bundle` client-data flag **and** the absence of the
`tengu_fennel_godwit` kill gate (`:118750`).

Counts: `Do not use workflows or deep-research unless the user requested it` **220=1 / 193=0**;
`opus_5_prompt_bundle` **220=2 / 193=0**; `tengu_fennel_godwit` **220=1 / 193=0**.

### 4.4 Why three layers

They fail differently and independently:

| Layer | Fails open when | Reversible by |
|-------|-----------------|---------------|
| Listing filter | the model remembers the command from elsewhere (docs, a prior turn, user text) | `tengu_sorrel_avocet` |
| Skill-tool refusal | never — it is a hard return | `tengu_sorrel_avocet` |
| System-prompt clause | the model chooses not to comply | `tengu_heron_brook` (independent gate) |

The refusal is the only *guarantee*. The listing filter reduces temptation; the prompt clause covers
the paths the refusal does not (e.g. the model calling the `Workflow` tool **directly by name**,
which never goes through the Skill tool at all). That last gap is precisely why a prompt clause
exists alongside two mechanical checks: `Workflow({name:'deep-research'})` is a legal tool call for
any model that knows the name, and nothing mechanical blocks it.

---

## 5. The realm — exactly what exists inside

```javascript
// ============================================
// buildWorkflowVMContext - the complete global surface a workflow script sees
// Location: cli_inner_pretty.js:388365-388414
// ============================================

// ORIGINAL (for source lookup):
    E = Msn.createContext(
      {
        __proto__: null,
        log: eve(p.log),
        phase: eve(p.phase),
        console: m,
        budget: g,
        setTimeout: _.setTimeout,
        clearTimeout: _.clearTimeout,
      },
      { codeGeneration: { strings: !1, wasm: !1 } },
    );
  (Fxo(E), V$t(E));
  ...
  for (let [L, P] of [["agent", p.agent], ["parallel", p.parallel], ["pipeline", p.pipeline], ["workflow", I]])
    Object.defineProperty(E, L, { value: R(Dxo(P)), writable: !0, enumerable: !0, configurable: !0 });
  {
    let L = i === void 0 ? void 0 : JSON.stringify(i);
    Object.defineProperty(E, "args", {
      value: L === void 0 ? void 0 : Msn.runInContext(`JSON.parse(${JSON.stringify(L)})`, E),
      ...
    });
  }

// READABLE (for understanding):
const vmContext = vm.createContext(
  {
    __proto__: null,          // no Object.prototype on the sandbox global itself
    log, phase, console,      // console is a sanitising shim onto the workflow_log channel
    budget,                   // frozen {total, spent(), remaining()}
    setTimeout, clearTimeout, // abort-aware, host-tracked
  },
  { codeGeneration: { strings: false, wasm: false } },   // eval / new Function / WASM all disabled
);
applyDeterminismShim(vmContext);   // Date.now / Math.random / bare Date() throw
hardenVMIntrinsics(vmContext);     // delete escape-hatch globals, freeze intrinsics
for (const [name, fn] of [["agent",…],["parallel",…],["pipeline",…],["workflow",…]])
  Object.defineProperty(vmContext, name, { value: wrapCrossRealm(fn), writable: true, … });
Object.defineProperty(vmContext, "args", {
  // deep copy across the realm boundary: stringify on the host, parse INSIDE the VM
  value: args === undefined ? undefined : vm.runInContext(`JSON.parse(${JSON.stringify(JSON.stringify(args))})`, vmContext),
  …
});

// Mapping: Msn→require("vm"), eve→wrapHostFn, Fxo→applyDeterminismShim, V$t→hardenVMIntrinsics,
//          Dxo/R→cross-realm marshalling wrappers, i→args
```

### 5.1 The complete global inventory

| Name | Kind | Source |
|------|------|--------|
| `log`, `phase` | host functions | `:388376-388377` |
| `console` | sanitising shim → `workflow_log` progress channel | `:388364`, `:388378` |
| `budget` | frozen `{total, spent(), remaining()}` | `:388365-388370` |
| `setTimeout`, `clearTimeout` | abort-aware wrappers | `:386250-386286` |
| `agent`, `parallel`, `pipeline`, `workflow` | host functions, cross-realm wrapped | `:388399-388405` |
| `args` | realm-native deep copy | `:388406-388414` |
| ECMAScript intrinsics | `Object`, `Array`, `JSON`, `Math`, `Promise`, `RegExp`, `Map`, `Set`, typed arrays, `Intl`, … | `vm.createContext` default |

**That is the whole list.** There is no `URL`, no `fetch`, no `TextEncoder`, no `Buffer`, no
`process`, no `require`, no `globalThis.crypto`. This is the fact that the `.207` fix's opening
comment states, and it is why deep-research parses URLs with a regex.

**How strong is that claim?** Three independent lines of evidence:

1. `vm.createContext` is given a plain null-prototype object with seven keys; a new V8 context
   provides ECMAScript intrinsics only, and every non-intrinsic the runtime wants is injected
   explicitly — including `console` and `setTimeout`, which would be free if web/Node globals were
   present.
2. The `.207` fix comment asserts it directly (`:424565-424566`), and the same comment cites the
   downstream consequence at `:424690-424691` (punycode unavailable).
3. **The shipped 2.1.193 bug is the experiment.** `new URL(...)` inside `normURL` and inside the
   label builder threw on every call, which is exactly the reported symptom ("every Fetch-phase
   agent labelled unknown"). If `URL` existed, that bug could not have occurred.

Note that `hardenVMIntrinsics` *does* mention `URL` — `typeof URL !== 'undefined' ? URL : undefined`
in its freeze list (`:385412`). That is defensive, not evidence of presence: the same function is
shared with `REPLTool` (`:385364-385366` says so), whose realm is configured differently. The guard
is there so one hardening routine can serve both.

### 5.2 The determinism shim

```javascript
// ============================================
// WORKFLOW_DETERMINISM_SHIM - why a workflow script cannot read the clock
// Location: cli_inner_pretty.js:386390-386410
// ============================================

// ORIGINAL (for source lookup):
  UWy = `(() => {
      const NOW_ERR = ${Ie(FWy)};
      const RANDOM_ERR = ${Ie(BWy)};
      Math.random = function random() { throw new Error(RANDOM_ERR) };
      const RealDate = Date;
      RealDate.now = function now() { throw new Error(NOW_ERR) };
      function ShimDate(...a) {
        if (!new.target) throw new Error(NOW_ERR); // bare Date() → now-string
        if (a.length === 0) throw new Error(NOW_ERR);
        return Reflect.construct(RealDate, a, new.target);
      }
      ...
      RealDate.prototype.constructor = ShimDate;
      Object.freeze(RealDate);
      globalThis.Date = ShimDate;
    })()`;

// READABLE (for understanding):
Math.random = () => { throw new Error(RANDOM_ERR) };
Date.now    = () => { throw new Error(NOW_ERR) };
function ShimDate(...args) {
  if (!new.target)      throw new Error(NOW_ERR);   // bare Date() returns a now-string
  if (args.length === 0) throw new Error(NOW_ERR);  // new Date() reads the clock
  return Reflect.construct(RealDate, args, new.target);  // new Date(x) is fine — deterministic
}
RealDate.prototype.constructor = ShimDate;  // close the (new Date(x)).constructor backdoor
Object.freeze(RealDate);                    // …and make that irreversible

// Mapping: UWy→WORKFLOW_DETERMINISM_SHIM, FWy/BWy→the two error message constants
```

**Why determinism is enforced at all:** resume. The journal replays a workflow by matching a
**running prefix hash** of `(prompt, opts)` pairs (§8). A script that interpolated `Date.now()` into
a prompt would produce a different hash on every run, and resume would degrade to "re-run
everything". Rather than documenting that as a footgun, the runtime makes the footgun throw.

`deep-research` complies naturally: nothing in the harness reads a clock or a random source. The
`publishDate` field is *reported by the extraction agent*, not computed. The one place the design
shows through is `VERIFY_PROMPT` step 4 — `Is the claim outdated? (check dates — old claims about
fast-moving fields are suspect)` — which delegates the notion of "now" to the subagent, which does
have a clock. That is the intended pattern: **the script is deterministic; its agents are not.**

### 5.3 Intrinsic hardening

`hardenVMIntrinsics` (`V$t` `:385349-385488`) runs a ~135-line program *inside* the already-created
context. It:

- **Deletes** `ShadowRealm`, `WebAssembly`, `FinalizationRegistry`, `WeakRef`, `Atomics`,
  `SharedArrayBuffer`, `queueMicrotask`, and the JSC debug globals `$vm`, `gc`, `edenGC`, `fullGC`,
  `print`, `readFile`, `Loader` (`:385361-385373`). The comment explains the selection: callbacks
  that run on the host event loop outside any `try`/`catch`, shared-memory primitives, and — for
  `$vm` — a full sandbox escape.
- **Applies SES-style enable-property-override** (`:385374-385391`) before freezing, converting data
  properties on `Object.prototype`, `Function.prototype`, `Array.prototype`, `Date.prototype` and the
  error prototypes into accessors whose setter `defineProperty`s onto the receiver. Without this,
  freezing triggers the TC39 "override mistake" and `this.name = 'X'` in an `Error` subclass
  constructor throws.
- **Freezes** every intrinsic constructor and prototype, the typed-array hierarchy, the hidden
  `%AsyncFunction%`/`%GeneratorFunction%` intrinsics reached via instances, `Intl.*`
  sub-constructors, and every iterator prototype reachable from a real iterator (`:385404-385484`).
- **Pins `globalThis.then` to a non-configurable `undefined`** (`:385442-385448`). The comment gives
  the reason: any object with a `then` becomes a thenable, so if the sandbox global (or a value
  aliasing it) were `await`ed by host code, a script-supplied `then` would run with host authority.
  The same argument drives freezing the `JSON`/`Math`/`Reflect`/`Proxy` namespace objects
  (`:385437-385441`).

**Why `eval` is not deleted:** `:385364-385366` — the routine is shared with `REPLTool`, which needs
`codeGeneration:{strings:true}`. The Workflow tool disables code generation at context creation
instead, which is strictly stronger and applies to `new Function` as well.

**Note the ordering.** `createContext` sets `codeGeneration:{strings:false}` at `:388383`, and the
hardening program is compiled by the *host* and run with `runInContext` at `:385350`. Host-side
compilation is unaffected by the in-realm code-generation flag — which is also how `args` is
injected at `:388409`. The flag stops the *script* from compiling strings; it does not stop the
*host* from compiling into the realm.

---

## 6. `args` — how the question crosses the boundary

```javascript
let L = i === void 0 ? void 0 : JSON.stringify(i);
Object.defineProperty(E, "args", {
  value: L === void 0 ? void 0 : Msn.runInContext(`JSON.parse(${JSON.stringify(L)})`, E), …
});
```

`args` is serialised on the host and **parsed inside the realm**, so the resulting value's prototype
chain is the realm's, not the host's. Consequences that matter to `deep-research`:

- `typeof args === "string"` at `:424542` is meaningful — a string stays a string, an object becomes
  a realm-native object, and there is no cross-realm proxy to confuse `typeof`.
- The value is a **deep copy**. Mutating `args` in the script cannot affect the host.
- Anything non-JSON-serialisable (functions, symbols, cycles) is lost or throws on the host side
  before injection — but the Workflow tool's `args` arrives from a JSON tool call, so it is
  JSON-shaped by construction.
- The double `JSON.stringify` is not a typo: the inner one serialises the value; the outer one
  produces a JS string *literal* to embed in the parse expression.

---

## 7. `agent()` as `deep-research` uses it

`deep-research` uses exactly four of the eleven documented `agent()` options: `label`, `phase`,
`schema`, and (never) `model`/`effort`/`agentType`/`isolation`. What each triggers:

### 7.1 `{schema}` — the structured-output contract

```javascript
// ============================================
// Structured-output wiring - schema → forced StructuredOutput tool + swapped system prompt
// Location: cli_inner_pretty.js:387445-387466
// ============================================

// ORIGINAL (for source lookup):
      let Wr = [...(_r.disallowedTools ?? []), ...(eMs.disallowedTools ?? [])],
        rn = ve.schema ? ZWy : QWy,
        $n = ve.schema && !YIs(_r.tools) ? [...(_r.tools ?? []), Eg] : _r.tools;
      ...
    let Ne;
    if (ve?.schema) {
      let It = wir(ve.schema);
      if ("error" in It) throw TypeError(`agent({schema}) received an invalid JSON Schema: ${It.error}`);
      Ne = It.tool;
    }
    let ge = Ce ?? (Ne ? t6y : eMs),
      ...
      Ze = G7(at, xBe(Me.mcp.tools.concat(nt)), { skipReplFilter: !0, skillTools: Me.skillTools }),
      He = Ne ? [...Ze.filter((It) => !qa(It, Eg)), Ne] : Ze,

// READABLE (for understanding):
const promptSuffix = opts.schema ? STRUCTURED_OUTPUT_NOTE : WORKFLOW_RETURN_VALUE_NOTE;
// custom agentTypes get StructuredOutput appended to their explicit tool list
const toolNames = opts.schema && !isWildcardToolList(custom.tools) ? [...(custom.tools ?? []), "StructuredOutput"] : custom.tools;

let structuredTool;
if (opts.schema) {
  const compiled = compileStructuredOutputTool(opts.schema);   // memoised per schema OBJECT identity
  if ("error" in compiled) throw TypeError(`agent({schema}) received an invalid JSON Schema: ${compiled.error}`);
  structuredTool = compiled.tool;
}
const agentDef = customAgent ?? (structuredTool ? WORKFLOW_SUBAGENT_DEF_STRUCTURED : WORKFLOW_SUBAGENT_DEF);
const pool     = assembleToolPool(permissionCtx, mcpAndSessionTools, { skipReplFilter: true, skillTools });
// strip any inherited StructuredOutput, then append THIS call's schema-bound one
const tools    = structuredTool ? [...pool.filter(t => !isTool(t, "StructuredOutput")), structuredTool] : pool;

// Mapping: ve→opts, ZWy→STRUCTURED_OUTPUT_NOTE, QWy→WORKFLOW_RETURN_VALUE_NOTE, wir→compileStructuredOutputTool,
//          Eg→"StructuredOutput", eMs→WORKFLOW_SUBAGENT_DEF, t6y→WORKFLOW_SUBAGENT_DEF_STRUCTURED, G7→assembleToolPool
```

Four things happen, and all four matter to `deep-research`:

1. **The schema is compiled to an Ajv validator + tool definition**, memoised on the schema's
   *object identity* (`wir` `:231091-231096`, `Map aPu`). Deep-research declares its five schemas
   once at module scope, so `SEARCH_SCHEMA` compiles once and is reused across all 5 searchers;
   `VERDICT_SCHEMA` compiles once and serves all 75 verifiers. Had the script built schema literals
   inside the loop, it would compile 75 Ajv validators. There is a second identity cache on the VM
   side too — a `WeakMap` keyed by the schema object (`:387296`, `:387306-387310`) so the
   cross-realm clone is also done once per schema.
2. **Size limits apply.** `fty`/`uPu` reject a schema with more than `1e5` nodes or depth over `1e4`
   (`:231097-231102`, `:231103-…`, constants `:231148-231149`), and Ajv runs with
   `validateFormats: false`. Deep-research's schemas are trivially inside these bounds.
3. **The subagent definition switches** from `WORKFLOW_SUBAGENT_DEF` to its structured twin, whose
   system prompt (`e6y` `:388201-388207`) opens with *"CRITICAL: You MUST call the StructuredOutput
   tool exactly once"* and explicitly says *"the script reads ONLY the StructuredOutput tool call"*.
4. **Any inherited `StructuredOutput` is stripped before the new one is appended** (`:387466`). Two
   differently-typed tools with one name would be ambiguous; this guarantees the schema in force is
   the one this call passed.

**Why the design forces a tool call rather than parsing text.** Validation happens at the tool
boundary, so a malformed response produces a tool-level validation error the model sees and can
retry against (`If validation fails, read the error and call StructuredOutput again with a corrected
shape`, `:388200`). Parsing free text would push failure into the script, where the only recovery is
`null`. This is what lets `deep-research` assume `r.results`, `ext.claims`, `v.refuted` and
`report.findings` exist without defensive checks.

### 7.2 `{label}` and `{phase}` — presentation only

`label` defaults to the first 60 characters of the prompt with whitespace collapsed (`:387319-387322`);
`phase` defaults to the current global `phase()` cursor (`:387323`). Both are display concerns:
they flow into the `workflow_agent` progress events (`:387378-387391`) that drive the `/workflows`
view, the Remote-Control agent grid, and the task-status line (`:388649` — `phaseTitle: label`).

**Critically, neither is part of the resume cache key** (§8). This is why the `.207` label rework
was safe to ship: it changed every Fetch-phase label, but journals written by 2.1.193 remain
matchable on prompt and schema.

### 7.3 What `deep-research` does *not* pass

- **No `model`, no `effort`.** Every one of the ~97 agents inherits the session's main-loop model
  (`:387284`, `:387344`, and the resolution chain in
  [`workflow_model_resolution.md`](workflow_model_resolution.md)). On an Opus session, the 75
  verifiers are Opus. The harness could plausibly run verification on a cheaper tier — it does not,
  and the `whenToUse` text does not warn about it.
- **No `agentType`.** So it takes the default `workflow-subagent` and never touches the agentType
  permission gate at `:387432-387443`.
- **No `isolation`.** No worktrees are created — correct, since nothing writes to the filesystem.

---

## 8. The subagent identity — what a deep-research agent may do

```javascript
// ============================================
// WORKFLOW_SUBAGENT_DEF - the identity every deep-research agent runs under
// Location: cli_inner_pretty.js:388208-388217
// ============================================

// ORIGINAL (for source lookup):
    (eMs = {
      agentType: "workflow-subagent",
      whenToUse: "Internal subagent for workflow script orchestration.",
      tools: ["*"],
      disallowedTools: [SB, qo, dk],
      source: "built-in",
      baseDir: "built-in",
      getSystemPrompt: () => JWy,
    }),
    (t6y = { ...eMs, getSystemPrompt: () => e6y }));

// READABLE (for understanding):
const WORKFLOW_SUBAGENT_DEF = {
  agentType: "workflow-subagent",
  tools: ["*"],                                       // the whole base pool…
  disallowedTools: ["SendUserMessage", "Agent", "Workflow"],   // …minus these three
  source: "built-in", baseDir: "built-in",
  getSystemPrompt: () => WORKFLOW_SUBAGENT_PROMPT,
};
const WORKFLOW_SUBAGENT_DEF_STRUCTURED = { ...WORKFLOW_SUBAGENT_DEF, getSystemPrompt: () => STRUCTURED_OUTPUT_SUBAGENT_PROMPT };

// Mapping: eMs→WORKFLOW_SUBAGENT_DEF, t6y→WORKFLOW_SUBAGENT_DEF_STRUCTURED,
//          SB→"SendUserMessage" (:151923), qo→"Agent" (:162358), dk→"Workflow" (:231211),
//          JWy→WORKFLOW_SUBAGENT_PROMPT (:388115), e6y→STRUCTURED_OUTPUT_SUBAGENT_PROMPT (:388201)
```

**`tools: ["*"]` is why `deep-research` works at all.** `WebSearch` and `WebFetch` are ordinary base
tools (both present in `assets/tools/_index.json`), so a wildcard pool includes them. The harness
never declares a dependency on them — it only *asks* for them in prose (`Use WebSearch with the query
above`, `:424617`; `Use WebFetch to retrieve the page content`, `:424626`). If either tool were
disabled — by a deny rule, by `disallowedTools` in settings, or by a policy — the agents would
silently fall back to whatever they could do, and the schema would still be satisfiable with
`claims: []` and `sourceQuality: "unreliable"`. **There is no capability precondition check
anywhere in the launch path.** A deep-research run in an environment without web access produces a
well-formed report saying nothing was found.

**The three denials, and what each prevents:**

| Denied | Why |
|--------|-----|
| `Agent` | a workflow subagent spawning further subagents would escape the workflow's own accounting (the 1,000-call cap and the token budget are enforced in `agent()`, not in the Agent tool) |
| `Workflow` | prevents unbounded recursion. Nesting is instead offered through the in-realm `workflow()` host function, which is capped at **one** level — *"Nesting is one level only: workflow() inside a child throws"* (`DSd` `:386829`, tool prose `:388995`) |
| `SendUserMessage` | the subagent's job is to *return a value*; messaging the user directly would bypass the script. The system prompt says so explicitly: *"Do NOT use SendUserMessage to deliver your answer"* (`:388120`) |

**The permission mode** is `Ue.permissionMode ?? "acceptEdits"` (`:387464`) — deep-research's agents
inherit `acceptEdits`, but they never edit anything; WebFetch has its own approval path.

---

## 9. Concurrency, caps, and what actually binds

| Limit | Value | Where | Binds `deep-research`? |
|-------|-------|-------|------------------------|
| Local agent concurrency | `min(16, max(2, cpus − 2))` | `zWy` `:387140-387142`, bound `:388177` | **yes** — the 75-agent verify phase runs ≤16 wide |
| Remote agent concurrency | 50 | `YWy` `:388109` | no — the remote path throws (`:387393`) |
| `agent()` calls per run | 1,000 | `WSd` `:388110`, check `:387190-387194` | no — max ~119 |
| Turn token budget | user-set (`+500k` style) | `:387195-387201`, `:388365-388370` | possibly — exhaustion turns pending agents into `null` |
| Items per `parallel`/`pipeline` | 4,096 (documented in tool prose) | tool description | no — max 36 |
| Sync-slice timeout | 30 s | `Bxo` `:386383` | no — the script awaits almost immediately |
| Per-agent stall timeout | 180 s | `r6y` `:388131` | **maybe** — a slow WebFetch on a large page |
| WebSearch calls per **session** | 200 (`CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`) | `:231406`, `:231413`, refusal `:403661-403675` | **yes, across runs** — see below |

### 9.1 The concurrency width, and why 16

`min(16, max(2, cpus − 2))`: two cores are reserved for the host (the main agent loop, the renderer),
the floor of 2 keeps a single-core machine from serialising completely, and the ceiling of 16 is a
flat cap regardless of core count. For deep-research the ceiling is what matters: the verify phase
submits 75 thunks at once and they drain 16 at a time, so wall-clock is roughly
`ceil(75/16) ≈ 5` verifier round-trips plus the fetch and search waves.

### 9.2 The WebSearch session cap — the one real cross-feature interaction

```javascript
// ============================================
// WebSearch session cap - a shared, session-scoped counter every workflow subagent draws on
// Location: cli_inner_pretty.js:403657-403675 (check), :231405-231407 + :231413 (limit)
// ============================================

// ORIGINAL (for source lookup):
    async call(e, t, r, n, o) {
      let i = performance.now(),
        { query: s } = e,
        a = yPu(),
        l = t.taskRegistry.getWebSearchCalls();
      if (l >= a)
        return (
          pe("tool_web_search", "web_search_session_cap", { max_web_searches_per_session: a }),
          { data: { query: s, results: [`Web search was not performed: this session has used its web search budget (${l} of ${a} WebSearch calls). …`], durationSeconds: 0, searchCount: 0 } }
        );
      if ((t.taskRegistry.incrementWebSearchCalls(), wwd())) { ... }

// READABLE (for understanding):
async call(input, ctx) {
  const cap  = getMaxWebSearchesPerSession();          // env ?? 200
  const used = ctx.taskRegistry.getWebSearchCalls();   // SESSION-wide, shared by every subagent
  if (used >= cap) {
    emitTelemetry("tool_web_search", "web_search_session_cap", { max_web_searches_per_session: cap });
    // NOT an error — a successful tool result whose content is a refusal sentence
    return { data: { query, results: ["Web search was not performed: this session has used its web search budget (…)"], searchCount: 0 } };
  }
  ctx.taskRegistry.incrementWebSearchCalls();
  …
}

// Mapping: yPu→getMaxWebSearchesPerSession (:231405-231407), _ty→200 (:231413), pe→emitTelemetryError
```

The counter lives on the **task registry**, i.e. it is session-scoped and shared by the main agent
and every subagent, including all ~97 of a deep-research run. `VERIFY_PROMPT` step 2 instructs every
verifier to search (`:424644`), so a single full run can consume `angles + claims×3 ≈ 80` searches —
40% of the default budget.

**The failure is silent and biased.** Over-cap searches return a *successful* tool result whose text
is a refusal. A verifier that cannot search for contradicting evidence has less basis to confirm,
and the prompt tells it to `Default to refuted=true if uncertain` (`:424650`). So the third
deep-research run in a session is systematically more likely to refute true claims than the first.
Nothing in either feature knows about the other: the cap is `.212` work (`220=4 / 193=0`) and the
harness predates it.

**Mitigation available to a user:** raise `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`, which the
refusal text itself suggests. The relationship is not documented anywhere else.

---

## 10. `parallel()` and `pipeline()` — the exact semantics deep-research relies on

```javascript
// ============================================
// pipeline() - per-item stage chain with no barrier, and a null short-circuit
// Location: cli_inner_pretty.js:388049-388083 (per-item loop :388061-388065)
// ============================================

// ORIGINAL (for source lookup):
    ce = Tft(async (ne, ...ee) => {
      ...
      let ae = await Promise.allSettled(
          te.map(async (he, Le) => {
            let Ae = await p(he);
            for (let Ce of de) {
              if (Ae.v === null) break;
              Ae = await p(f(Ce, Ae.v, he, Le));
            }
            return Ae;
          }),
        ),
        Te = 0,
        ve = ae.map((he, Le) => {
          if (he.status === "fulfilled") return he.value.v;
          let { name: Ae, msg: Ce } = Rsn(he.reason);
          if (Ae === "WorkflowBudgetExceededError") return (Te++, null);
          let Ne = `pipeline[${Le}] failed: ${Ce}`;
          return (C.push(Ne), r({...}), null);
        });
      if (Te > 0) C.push(`pipeline: ${Te} ${Et(Te, "slot")} dropped — token budget exceeded`);
      return m(ve);
    }),

// READABLE (for understanding):
const pipeline = async (items, ...stages) => {
  const settled = await Promise.allSettled(items.map(async (item, i) => {
    let cur = { v: item };
    for (const stage of stages) {
      if (cur.v === null) break;                       // ← null short-circuits the REST of this item's chain
      cur = { v: await stage(cur.v, item, i) };        // ← stages get (prevResult, originalItem, index)
    }
    return cur;
  }))
  return settled.map((s, i) => {
    if (s.status === "fulfilled") return s.value.v;
    if (errorName(s.reason) === "WorkflowBudgetExceededError") { budgetDropped++; return null }
    recordFailure(`pipeline[${i}] failed: ${msg}`);    // surfaced in the run's failures + a log line
    return null;
  })
}

// Mapping: ce→pipeline, oe→parallel (:388016-388048), Tft→cross-realm entry wrapper,
//          budget-drop bookkeeping: parallel :388046, pipeline :388081
//          p→settle-in-VM, f→call-in-VM, m→clone-into-VM, C→failures array
```

Three properties deep-research depends on:

1. **No barrier between stages.** Angle A's fetch fan-out begins while angle B is still searching.
   With 5 angles whose search latencies differ by 2–3×, this is most of the harness's wall-clock
   saving.
2. **`null` short-circuits.** `if (!r) return null` in stage 1 (`:424659`) means a failed searcher
   never reaches the dedup/fetch stage — no `undefined.results` crash, and no code needed to express
   it.
3. **A throwing stage costs one item, not the run.** `Promise.allSettled` plus the per-item mapping
   turns a rejection into `null` in the results array, with the reason recorded in the run's
   `failures`. Deep-research's `searchResults.flat().filter(Boolean)` (`:424724`) then removes them.

`parallel()` (`:388016-388048`) is the same shape but a genuine barrier, with one extra guard: it
rejects an array of promises with a specific message — *"parallel() expects an array of functions,
not promises. Wrap each call: () => agent(...)"* (`:388024`). Deep-research's nested
`parallel(rankedClaims.map(claim => () => parallel(Array.from({length:3}, (_, v) => () => agent(…)))))`
is exactly the thunk-of-thunks shape this guard teaches.

---

## 11. Phases — pre-seeded, so nothing races

```javascript
// ============================================
// Phase registry - meta.phases pre-seeds the index map before the script's first statement
// Location: cli_inner_pretty.js:387206-387218; seeding source :388670
// ============================================

// ORIGINAL (for source lookup):
  function W(ne, ee) {
    let te = D.get(ne);
    if (te == null)
      ((te = ++M),
        D.set(ne, te),
        r({ type: "progress", toolUseID: `workflow_phase_${te}`, data: { type: "workflow_phase", index: te, title: ne, kind: ee } }));
    return te;
  }
  for (let ne of i ?? []) W(ne);
...
          seedPhaseTitles: s.phases?.map((q) => q.title),

// READABLE (for understanding):
function resolvePhase(title, kind) {
  let index = phaseIndexByTitle.get(title);
  if (index == null) {                       // first sighting wins the next index
    index = ++phaseCounter;
    phaseIndexByTitle.set(title, index);
    emitProgress({ type: "workflow_phase", index, title, kind });
  }
  return index;
}
for (const title of seedPhaseTitles ?? []) resolvePhase(title);   // ← runs BEFORE the script
// launcher: seedPhaseTitles = meta.phases.map(p => p.title)

// Mapping: W→resolvePhase, D→phaseIndexByTitle, M→phaseCounter, i→seedPhaseTitles
```

Because `meta.phases` declares `Scope, Search, Fetch, Verify, Synthesize` (`:424892-424898`), those
five titles are registered as indices 1–5 **before the script's first line runs**. Every later
`phase("Verify")` or `{phase: "Fetch"}` is a *lookup*, never an insertion. This is why deep-research
can safely mix the global `phase()` cursor (used at `:424541`, `:424746`, `:424808` — outside any
concurrent region) with explicit `{phase:}` opts (used at `:424657`, `:424704`, `:424753` — inside
`pipeline`/`parallel`), and still get a stable, correctly-ordered progress tree.

**The general hazard this avoids:** without seeding, whichever concurrent agent resolved first would
claim the lower index, and the progress tree would order phases by completion rather than by design.
The tool prose warns authors about exactly this (*"use this inside pipeline()/parallel() stages to
avoid races on the global phase() state"*). A bundled workflow gets the guarantee for free by
declaring `meta.phases` — which it must declare anyway, for the `/deep-research` command text (§3).

---

## 12. Resume — and why the `.207` rework did not break journals

```javascript
// ============================================
// deriveJournalKey / canonicaliseAgentOpts - the resume cache key, and what it deliberately omits
// Location: cli_inner_pretty.js:387077-387080, :387047-387058
// ============================================

// ORIGINAL (for source lookup):
function FSd(e, t, r) {
  let n = NSd.createHash("sha256").update(r).update("\x00").update(e).update("\x00").update(VWy(t)).digest("hex");
  return `${qWy}:${n}`;
}
function VWy(e) {
  if (!e) return "{}";
  let t = {},
    r = ["schema", "model", "effort", "isolation", "agentType"];
  for (let o of r) {
    let i = e[o];
    if (i === void 0 || typeof i === "function") continue;
    t[o] = i;
  }
  ...

// READABLE (for understanding):
function deriveJournalKey(promptStr, opts, prevKey) {
  const h = sha256(prevKey + "\0" + promptStr + "\0" + canonicaliseAgentOpts(opts));
  return `${KEY_PREFIX}:${h}`;          // running prefix hash: key_n depends on key_{n-1}
}
function canonicaliseAgentOpts(opts) {
  // ONLY these five keys participate. label, phase, stallMs are excluded.
  const KEYS = ["schema", "model", "effort", "isolation", "agentType"];
  …deterministic, sorted-key serialisation of those five…
}

// Mapping: FSd→deriveJournalKey, VWy→canonicaliseAgentOpts, NSd→require("crypto")
```

**`label` and `phase` are not in the key.** That is a design decision with a direct payoff here: the
`.207` change rewrote every Fetch-phase label (`fetch:unknown` → `fetch:example.com`) without
touching the prompts or the schemas, so a run journaled by an older build still matches on resume.
Cosmetic changes to a workflow are free; semantic ones (a changed prompt, a changed schema) correctly
invalidate from that point forward — which is exactly the stated resume contract ("the longest
unchanged prefix of `agent()` calls returns cached results instantly").

**The chaining matters for deep-research specifically.** Because `key_n` folds in `key_{n-1}`, the
cache is a *prefix* cache over the script's actual call order — and that order is
completion-order-dependent inside `pipeline`/`parallel`. Two runs of the same question with the same
search results can therefore diverge in call order and lose cache hits mid-fetch. The prefix survives
reliably only through the Scope agent, which is call #1 and deterministic. Resume is most valuable
here for the case it was built for: an edited script re-run with `resumeFromRunId`.

---

## 13. Telemetry — why this workflow's name is reported in the clear

```javascript
// ============================================
// Workflow telemetry redaction - built-in scripts identify themselves; user scripts do not
// Location: cli_inner_pretty.js:388574-388581 (redactors), :389498 (verbatim test), :389525-389537 (event)
// ============================================

// ORIGINAL (for source lookup):
function tMs(e, t) {
  return e === "built-in" && t;
}
function Qxo(e, t, r) {
  if (tMs(t, r) && e) return e;
  return "custom";
}
function Zxo(e, t, r) {
  if (tMs(t, r)) return (e ?? "").slice(0, d6y);
  return "";
}
...
          c = a === "built-in" && i.scriptMatchesDefinition === !0,

// READABLE (for understanding):
const isVerbatimBuiltIn = (source, scriptMatchesDefinition) => source === "built-in" && scriptMatchesDefinition;
const redactWorkflowName = (name, source, matches) => isVerbatimBuiltIn(source, matches) && name ? name : "custom";
const redactWorkflowDescription = (desc, source, matches) => isVerbatimBuiltIn(source, matches) ? (desc ?? "").slice(0, CAP) : "";
// at launch:
const scriptIsVerbatimBuiltIn = source === "built-in" && resolved.scriptMatchesDefinition === true;

// Mapping: tMs→isVerbatimBuiltIn, Qxo→redactWorkflowName, Zxo→redactWorkflowDescription,
//          u6y→resolveReportedWorkflowName (:388570-388573)
```

`tengu_workflow_launched` (`:389528-389538`) therefore reports, for a `/deep-research` run:
`invocation_mode: "named"`, `workflow_source: "built-in"`, `workflow_name: "deep-research"`,
`workflow_description: "Deep research harness — …"`, `phase_count: 5`, `has_args: true`,
`script_size_chars` ≈ **23,000** (the script literal spans `:424450-424877`, ~22,969 bytes as
embedded). For a user-authored workflow the same fields report `"custom"` and `""`.

**The condition is `scriptMatchesDefinition`, not just `source`.** `yEd` (`:389188-389211`) sets that
flag by comparing the resolved script against the registry entry — including the `scriptPath` branch,
which checks whether the file's contents match *any* built-in script (`:389197-389198`). So a user who
copies `deep-research` into their own workflows directory and runs it unmodified is still reported as
the built-in; the moment they edit one character, the name becomes `"custom"`. The privacy property
is about *content*, not provenance: Anthropic only sees names and descriptions it wrote itself.

---

## 14. What a reader should take away

1. **The harness is data, the runtime is code.** Everything specific to research — the vote count,
   the URL parser, the prompts — lives in a string. Everything general — the realm, the semaphore,
   the schema enforcement, the journal — lives in the binary. The `.196`/`.207` fixes changed the
   string; the `.218` fix changed the registration; none of them touched the runtime.
2. **Every capability the script lacks becomes a defensive measure.** No `URL` → a regex that
   re-derives WHATWG authority parsing. No punycode → a refusal to assert non-ASCII hosts. No clock
   → date-freshness delegated to the subagents. The sandbox's minimalism is visible in the harness's
   shape.
3. **Restraint is layered because the layers fail differently.** A listing filter is not a
   guarantee; a runtime refusal is; a prompt clause covers the direct-tool-call path neither
   mechanical layer sees.
4. **The one unexamined interaction is the WebSearch session cap.** Two features shipped in the same
   window, one bounding a resource the other consumes ~80 of per run, with no cross-reference and a
   failure mode that biases the harness's own decision rule.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions and constants in this document:

- `registerBundledWorkflow` (`kxo`) - the 9-line registry writer, `:385327-385335`
- `getBundledWorkflows` (`ksn`) - registry reader with the bundled-skills kill switch, `:385336-385339`
- `BUNDLED_WORKFLOWS` (`SSd`) - the registry array, `:385340-385343`
- `areBundledSkillsDisabled` (`bV`) - `:162055`
- `getAllWorkflows` (`Lft`) - memoised built-in ∪ plugin ∪ user merge with precedence, `:388346-388356`
- `resolveWorkflowByName` (`Dsn`) - `:388331-388333`
- `invalidateWorkflowCache` (`Jxo`) - `:388334-388336`
- `createWorkflowCommand` (`Lep`) - registry row → slash command, `:506513-506557`
- `getWorkflowCommands` (`HM_`) - `!hidden` filter + feature gate, `:506559-506562`
- `isWorkflowFeatureEnabled` (`M0`) - `:119317-119323`
- `isModelInvocableCommand` (`oKe`) - the listing filter that drops `disableModelInvocation`, `:506851-506863`
- `checkSkillInvocationBlocked` (`oin`) - the `!userTypedThisTurn` refusal, `:346456-346463`
- `buildModelVisibleSkillSet` (`BLo`) - merge for the skill listing, `:441278-441285`
- `renderSkillListingLines` (`FLo`) - `- name: description` lines, `:441264-441276`
- `buildSkillListingReminder` (`YFo`) - `:499488-499499`
- `loadAllSlashCommands` (`GBo`) - merges workflow commands into the command registry, `:507314-507328`
- `describeCommandForListing` (`PYe`) - appends `(dynamic workflow)`, `:506916-506918`
- `buildCommandMenuRow` (`JJa`) - emits the `dynamic workflow` tag, `:744010-744026`
- `resolveWorkflowScriptSource` (`yEd`) - name/scriptPath/inline resolution + `scriptMatchesDefinition`, `:389188-389215`
- `buildWorkflowVMContext` (`eEd`) - the realm and its 11 globals, `:388358-388429`
- `createWorkflowHostObjects` (`zSd`) - `agent`/`parallel`/`pipeline`/`log`/`phase`, `:387149-388105`
- `runWorkflowScript` (`rEd`) - `:388439-388529`
- `launchWorkflow` (`Osn`) - seeds `seedPhaseTitles` from `meta.phases`, `:388585-…`, seeding `:388670`
- `applyDeterminismShim` (`Fxo`) - `:386247-386249`
- `WORKFLOW_DETERMINISM_SHIM` (`UWy`) - `:386390-386410`
- `hardenVMIntrinsics` (`V$t`) - deletions, SES override, freezes, `then`-pinning, `:385349-385488`
- `computeAgentConcurrency` (`zWy`) - `min(16, max(2, cpus−2))`, `:387140-387142`
- `WORKFLOW_AGENT_CAP` (`WSd`) - 1,000, `:388110`
- `DEFAULT_AGENT_STALL_MS` (`r6y`) - 180,000, `:388131`
- `WORKFLOW_SYNC_SLICE_TIMEOUT_MS` (`Bxo`) - 30,000, `:386383`
- `WORKFLOW_SUBAGENT_DEF` (`eMs`) / `WORKFLOW_SUBAGENT_DEF_STRUCTURED` (`t6y`) - `:388208-388217`
- `WORKFLOW_SUBAGENT_PROMPT` (`JWy`) / `STRUCTURED_OUTPUT_SUBAGENT_PROMPT` (`e6y`) - `:388115-388121`, `:388201-388207`
- `STRUCTURED_OUTPUT_NOTE` (`ZWy`) / `WORKFLOW_RETURN_VALUE_NOTE` (`QWy`) - `:388196-388200`, `:388122-388126`
- `compileStructuredOutputTool` (`wir`) - memoised Ajv compile, `:231091-231096`
- `STRUCTURED_OUTPUT_TOOL_NAME` (`Eg`) - `:231145`
- `deriveJournalKey` (`FSd`) / `canonicaliseAgentOpts` (`VWy`) - `:387077-387080`, `:387047-387076`
- `isVerbatimBuiltIn` (`tMs`) / `redactWorkflowName` (`Qxo`) / `redactWorkflowDescription` (`Zxo`) - `:388574-388581`
- `getMaxWebSearchesPerSession` (`yPu`) - `:231405-231407`, default `_ty = 200` `:231413`
