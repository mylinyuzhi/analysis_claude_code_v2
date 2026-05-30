# Skill/Agent effort Frontmatter: xhigh Level and the Effort Permission-Layer Status-Bar Fix

> Module 10 (Skill System), v2.1.143 → v2.1.156 delta.
> Scope: the `effort:` frontmatter field on skills/commands/agents — the new `xhigh`
> level (2.1.154, Opus 4.8), how a per-skill `getEffort`/`effort` flows into a
> `kind: "effort"` permission layer at invocation, and the status-bar fix so the
> displayed effort reflects the skill/agent layer rather than the user's `/effort` baseline.

## Related Symbols

> Symbol mappings live in the central index files (do not duplicate tables here):
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Skill tool, fork, permission layers)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skills, Effort, Hooks, CLI)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Model effort support, Prompt)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Status line / hook env)

Key functions/values in this document:
- `EFFORT_LEVELS` (`dN`) — the effort enum `["low","medium","high","xhigh","max"]` (cli_inner_pretty.js:185009)
- `parseEffortValue` (`vx`) — frontmatter effort parser; enum-or-integer (cli_inner_pretty.js:184870-184878)
- `isEffortLevel` (`KkH`) — `dN.includes(value)` enum membership test (cli_inner_pretty.js:184859-184861)
- `parseEffortLevelStrict` (`pjH`) — accepts only `low|medium|high|xhigh` (no `max`) for `/effort` settings (cli_inner_pretty.js:184880-184883)
- `resolveModelEffort` (`or`) — applies silent downgrade for unsupported levels (cli_inner_pretty.js:184909-184919)
- `modelSupportsXhighEffort` (`ycH`) — Opus 4.7/4.8 only gate for `xhigh` (cli_inner_pretty.js:184834-184851)
- `modelSupportsMaxEffort` (`ow$`) — gate for `max` (referenced by `or`)
- `computeDisplayEffortLevel` (`Ev`) — `or(model, effort) ?? "high"` → clean string (cli_inner_pretty.js:184944-184947)
- `getDefaultEffortForModel` (`q48`) — Opus 4.8 → `high`, Opus 4.7 → `xhigh` (cli_inner_pretty.js:184987-184991)
- `processPromptSlashCommand` (`hN_`) — returns `effort: getEffort?.(args) ?? effort` (cli_inner_pretty.js:396604, 396649)
- `Skill.call` inline path — builds `{ kind: "effort", effort }` contextLayer (cli_inner_pretty.js:350745, 350790)
- `buildForkedSkillContext` (`D0$`) — fork contextLayers (allowed/disallowed tools) (cli_inner_pretty.js:452910-452925)
- `forkSlashCommand` (`NN_`) — bakes `getEffort?.() ?? effort` into the forked base agent (cli_inner_pretty.js:396035-396036)
- `applyPermissionLayers` (`T6`) — folds tool layers into permission context; effort/model are no-ops here (cli_inner_pretty.js:453162-453181)
- `resolveEffortFromLayers` (`k3`) — baseline `effortValue` overridden by each effort layer (cli_inner_pretty.js:453183-453188)
- `buildHookStatusEnv` (`w5`) — the status-bar fix: walks `permissionLayers`, overrides effort (cli_inner_pretty.js:552312-552327)
- `registerBundledSkill` (`bA`) — wires `getEffort` onto bundled skill records (cli_inner_pretty.js:524187-524233)

---

## TL;DR

The `effort:` frontmatter field on a skill, slash command, or agent lets that surface
override the reasoning effort the model uses while it runs (e.g. a `/code-review high`
skill forces `high` even if the user's global `/effort` is `medium`). It existed in
2.1.88. Three things changed in the 2.1.143–156 window:

1. **A new `xhigh` level.** `EFFORT_LEVELS` (`dN`) grew from
   `["low","medium","high","max"]` (2.1.88) to `["low","medium","high","xhigh","max"]`
   (cli_inner_pretty.js:185009). `xhigh` slots *between* `high` and `max` and is only
   honored on Opus 4.7/4.8 — on every other model it is **silently downgraded to `high`**.

2. **Per-skill effort flows through a permission layer.** When a skill/command is
   invoked, its resolved effort (`getEffort?.(args) ?? effort`) is emitted as a
   `{ kind: "effort", effort }` entry in `contextLayers` (inline path,
   cli_inner_pretty.js:350790) or baked into the forked sub-agent
   (cli_inner_pretty.js:396035-396036). The effort layer lives for exactly one turn —
   `permissionLayers` is rebuilt per turn — and `resolveEffortFromLayers` (`k3`,
   cli_inner_pretty.js:453183-453188) is the runtime authority that turns it into the
   `effortValue` actually sent to the API.

3. **The status-bar fix.** Before the fix, the status line showed the user's baseline
   `/effort`, not the effort a skill/agent had forced for the current turn. `w5`
   (cli_inner_pretty.js:552312-552327) now walks `q.permissionLayers` and, for every
   `kind === "effort"` layer, overrides the effort value before computing the displayed
   level — making the status bar mirror what `k3` actually sends to the model.

Changelog (2.1.156): *"Fixed the status bar showing the user's baseline /effort setting
instead of the effort level applied by skill/agent effort frontmatter."*

Cross-validation confidence: **high.** `effort` and `parseEffortValue` are direct
descendants of 2.1.88 (`src/utils/effort.ts`, `src/skills/loadSkillsDir.ts`,
`src/utils/frontmatterParser.ts`). The `xhigh` level, the `kind:"effort"` permission
layer, and the layer-based status display are **NEW post-2.1.88** (the entire
`permissionLayers` mechanism is absent from 2.1.88 source).

---

## 1. The `effort` enum gains `xhigh`

### What it does

`EFFORT_LEVELS` (`dN`) is the canonical ordered list of named effort levels. It is the
single source of truth used (a) by the frontmatter parser to validate `effort:` values,
(b) in the parser's error message listing valid options, and (c) by the model's
effort-support gates. As of 2.1.154 it is:

```javascript
// ============================================
// EFFORT_LEVELS - canonical named effort levels (xhigh added 2.1.154)
// Location: cli_inner_pretty.js:185009
// ============================================

// ORIGINAL (for source lookup):
dN = ["low", "medium", "high", "xhigh", "max"];
s$7 = { med: "medium" };

// READABLE (for understanding):
EFFORT_LEVELS = ["low", "medium", "high", "xhigh", "max"];
EFFORT_ALIASES = { med: "medium" };

// Mapping: dN→EFFORT_LEVELS, s$7→EFFORT_ALIASES
```

`xhigh` slots between `high` and `max`: described in-product as *"Deeper reasoning than
high, just below maximum"* (cli_inner_pretty.js:184972-184973, gated by the
`_P6 = "Opus 4.8/4.7 only"` caption at cli_inner_pretty.js:184993).

### How `effort:` frontmatter is validated

Both the plugin-command parser and the skill parser run the raw frontmatter value
through `parseEffortValue` (`vx`) and, on failure, log an error that *lists the enum*.
The two call sites are byte-for-byte parallel:

```javascript
// ============================================
// Skill effort frontmatter parse + invalid-value log
// Location: cli_inner_pretty.js:421565-421568 (skill); identical at 414144-414147 (plugin command)
// ============================================

// ORIGINAL (for source lookup):
let O = H.effort,
  M = O !== void 0 ? vx(O) : void 0;
if (O !== void 0 && M === void 0)
  N(`Skill ${q} has invalid effort '${O}'. Valid options: ${dN.join(", ")} or an integer`);

// READABLE (for understanding):
let rawEffort = frontmatter.effort,
  effort = rawEffort !== undefined ? parseEffortValue(rawEffort) : undefined;
if (rawEffort !== undefined && effort === undefined)
  logForDebugging(
    `Skill ${name} has invalid effort '${rawEffort}'. Valid options: ${EFFORT_LEVELS.join(", ")} or an integer`,
  );

// Mapping: H.effort→frontmatter.effort, O→rawEffort, M→effort, vx→parseEffortValue,
//          dN→EFFORT_LEVELS, N→logForDebugging, q→name
```

The `effort` field is then placed onto the parsed skill record
(`effort: M` at cli_inner_pretty.js:421585) and the parsed command record. Because the
error message interpolates `dN.join(", ")`, adding `xhigh` to `dN` automatically updated
every "valid options" string across both parsers — a single-point change.

### The parser: `parseEffortValue` (`vx`)

`vx` accepts a named level (after lowercasing + alias mapping) **or** a raw integer. It
deliberately tolerates both because the effort parameter is, at the API level, a numeric
budget; the named levels are sugar.

```javascript
// ============================================
// parseEffortValue - parse named-level or integer effort frontmatter value
// Location: cli_inner_pretty.js:184870-184878
// ============================================

// ORIGINAL (for source lookup):
function vx(H) {
  if (H === void 0 || H === null || H === "") return;
  if (typeof H === "number" && o$7(H)) return H;
  let $ = String(H).toLowerCase(),
    q = s$7[$] ?? $;
  if (KkH(q)) return q;
  let K = parseInt($, 10);
  if (!isNaN(K) && o$7(K)) return K;
  return;
}

// READABLE (for understanding):
function parseEffortValue(raw) {
  if (raw === undefined || raw === null || raw === "") return undefined;
  if (typeof raw === "number" && isInteger(raw)) return raw;          // numeric effort budget
  let lowered = String(raw).toLowerCase(),
    aliased = EFFORT_ALIASES[lowered] ?? lowered;                     // "med" → "medium"
  if (isEffortLevel(aliased)) return aliased;                        // dN.includes(aliased)
  let asInt = parseInt(lowered, 10);
  if (!isNaN(asInt) && isInteger(asInt)) return asInt;               // "12000" → 12000
  return undefined;                                                  // invalid → triggers log above
}

// Mapping: vx→parseEffortValue, o$7→isInteger, s$7→EFFORT_ALIASES, KkH→isEffortLevel
```

`isEffortLevel` (`KkH`) is just `dN.includes(H)` (cli_inner_pretty.js:184859-184861), so
the enum is the literal allowlist. Note `parseEffortLevelStrict` (`pjH`,
cli_inner_pretty.js:184880-184883) is a *different, narrower* validator used for the
user's persisted `/effort` **setting** — it accepts only `low|medium|high|xhigh` and
deliberately **rejects `max`** (and integers). That asymmetry is intentional: `max` and
arbitrary integers are allowed as a *per-skill* override but not as a sticky global
default.

**Why both named levels and integers:** the API's reasoning-effort parameter is
ultimately a number. Skill authors usually want the readable named levels, but power
users / generated skills can pin an exact integer budget. Validating against `dN` while
also accepting integers gives the named-level UX without losing the raw escape hatch.

**Key insight:** `dN` is the *only* place the named set is defined. Parser validation,
the "valid options" error string, and the strict `/effort` setting validator all derive
from it, so `xhigh` was added in exactly one line and propagated everywhere.

---

## 2. Per-skill `getEffort` / `effort` → a `kind:"effort"` permission layer

A skill's effort can be **static** (the parsed `effort` field) or **dynamic** (a
`getEffort(args)` callback on bundled skills). Resolution is always the same idiom —
`getEffort?.(args) ?? effort` — appearing at three sites
(cli_inner_pretty.js:396035, 396604, 396649). Bundled skills get `getEffort` wired by
`registerBundledSkill` (`bA`):

```javascript
// ============================================
// registerBundledSkill - wires getEffort onto a bundled skill record
// Location: cli_inner_pretty.js:524187-524229 (getEffort at 524228)
// ============================================

// ORIGINAL (for source lookup):
function bA(H) {
  let { files: $ } = H, q, K = H.getPromptForCommand;
  /* ...build skillRoot for file-backed bundles... */
  let _ = {
    type: "prompt", name: H.name, /* ...many fields... */
    model: H.model,
    getPromptForCommand: K,
    getEffort: H.getEffort,
  };
  /* ...register _... */
}

// READABLE (for understanding):
function registerBundledSkill(spec) {
  let record = {
    type: "prompt", name: spec.name, /* ... */
    model: spec.model,
    getPromptForCommand: /* maybe-wrapped */ spec.getPromptForCommand,
    getEffort: spec.getEffort,   // dynamic per-invocation effort, optional
  };
  registry.push(record);
}

// Mapping: bA→registerBundledSkill, H→spec, _→record, getEffort→getEffort
```

> **Accuracy note:** in the 2.1.156 bundle the only place `getEffort:` is assigned is the
> generic pass-through at cli_inner_pretty.js:524228 — none of the three bundled skill
> bodies in scope (`/simplify` via `vO9` at 601350-601372, `/code-review` `Y18` at
> 211646, `/claude-api` via `tSz` at 612027-612045) actually supplies a `getEffort`
> function. They rely on the static `effort` field (set by the filesystem parsers for
> user skills). The `getEffort?.() ?? effort` idiom therefore degrades gracefully to the
> static field for every shipped skill, while leaving the dynamic hook available.

### Inline invocation path (`Skill.call` → `processPromptSlashCommand`)

When the model invokes the Skill tool on a **non-fork** skill, `Skill.call`
(cli_inner_pretty.js:350725) delegates to `processPromptSlashCommand` (`hN_`), which
returns the resolved effort:

```javascript
// ============================================
// processPromptSlashCommand - returns resolved effort for inline skill expansion
// Location: cli_inner_pretty.js:396637-396651 (inline branch); 396599-396606 (worker-handoff branch)
// ============================================

// ORIGINAL (for source lookup):
return {
  messages: [/* ... */],
  shouldQuery: !0,
  allowedTools: w,
  disallowedTools: D,
  model: H.model,
  effort: H.getEffort?.($) ?? H.effort,
  command: H,
};

// READABLE (for understanding):
return {
  messages: [/* expanded skill prompt + meta */],
  shouldQuery: true,
  allowedTools: allowed,
  disallowedTools: denied,
  model: command.model,
  effort: command.getEffort?.(args) ?? command.effort,   // dynamic ?? static
  command,
};

// Mapping: hN_→processPromptSlashCommand, H→command, $→args, w→allowed, D→denied,
//          getEffort→getEffort, H.effort→static frontmatter effort
```

`Skill.call` reads that back as `X = w.effort` (cli_inner_pretty.js:350745) and, only
when defined, appends a `kind:"effort"` layer to the result's `contextLayers`,
alongside the optional `allowed_tools` and `model` layers:

```javascript
// ============================================
// Skill.call - assemble per-skill contextLayers (effort/model/allowed_tools)
// Location: cli_inner_pretty.js:350787-350795
// ============================================

// ORIGINAL (for source lookup):
let I = [];
if (D.length > 0) I.push({ kind: "allowed_tools", allowedTools: D });
if (J) I.push({ kind: "model", mainLoopModel: GY$(J, q.options.mainLoopModel) });
if (X !== void 0) I.push({ kind: "effort", effort: X });
return {
  data: { success: !0, commandName: Y, allowedTools: D.length > 0 ? D : void 0, model: J },
  newMessages: h,
  ...(I.length > 0 && { contextLayers: I }),
};

// READABLE (for understanding):
let layers = [];
if (allowedTools.length > 0) layers.push({ kind: "allowed_tools", allowedTools });
if (model)                   layers.push({ kind: "model", mainLoopModel: resolveModel(model, ctx.options.mainLoopModel) });
if (effort !== undefined)    layers.push({ kind: "effort", effort });   // <-- per-skill effort layer
return {
  data: { success: true, commandName, allowedTools: allowedTools.length > 0 ? allowedTools : undefined, model },
  newMessages,
  ...(layers.length > 0 && { contextLayers: layers }),
};

// Mapping: I→layers, D→allowedTools, J→model, X→effort, Y→commandName, h→newMessages,
//          GY$→resolveModel
```

These `contextLayers` are merged into the session's `permissionLayers` (see §3) for the
turn that runs the expanded skill.

### Fork invocation path (`forkSlashCommand` → `buildForkedSkillContext`)

For a `context: fork` skill, effort is handled differently: rather than a `kind:"effort"`
layer, the resolved effort is **baked directly into the spawned sub-agent**:

```javascript
// ============================================
// forkSlashCommand - bake skill effort into the forked sub-agent
// Location: cli_inner_pretty.js:396032-396037
// ============================================

// ORIGINAL (for source lookup):
let {
    skillContent: f, modifiedGetAppState: O, contextLayers: M, baseAgent: j, promptMessages: w,
  } = await D0$(H, $, q),
  D = M.length > 0 ? [...(q.permissionLayers ?? []), ...M] : q.permissionLayers;
w.push(...A);
let J = H.getEffort?.($) ?? H.effort,
  X = J !== void 0 ? { ...j, effort: J } : j;

// READABLE (for understanding):
let { skillContent, modifiedGetAppState, contextLayers, baseAgent, promptMessages } =
      await buildForkedSkillContext(command, args, ctx),
  mergedLayers = contextLayers.length > 0
    ? [...(ctx.permissionLayers ?? []), ...contextLayers]
    : ctx.permissionLayers;
promptMessages.push(...extraMessages);
let effort = command.getEffort?.(args) ?? command.effort,         // dynamic ?? static
  agentForFork = effort !== undefined
    ? { ...baseAgent, effort }                                    // sub-agent inherits skill effort
    : baseAgent;

// Mapping: D0$→buildForkedSkillContext, H→command, $→args, q→ctx, M→contextLayers,
//          j→baseAgent, J→effort, X→agentForFork, A→extraMessages
```

`buildForkedSkillContext` (`D0$`) itself only emits `allowed_tools` / `disallowed_tools`
layers (it does not emit an effort layer) — the effort is applied at the agent level
because a fork is a *separate sub-agent run* with its own effort, whereas an inline skill
shares the main loop and therefore needs a layer to override the main loop's effort:

```javascript
// ============================================
// buildForkedSkillContext - fork contextLayers are tool-only; effort handled by caller
// Location: cli_inner_pretty.js:452910-452925
// ============================================

// ORIGINAL (for source lookup):
async function D0$(H, $, q) {
  let _ = (await H.getPromptForCommand($, q)).map((D) => (D.type === "text" ? D.text : "")).join("\n"),
    z = IS(H.allowedTools ?? []),
    A = IS(H.disallowedTools ?? []),
    Y = tT4(q.getAppState, z, A),
    f = [
      ...(z.length === 0 ? [] : [{ kind: "allowed_tools", allowedTools: z }]),
      ...(A.length === 0 ? [] : [{ kind: "disallowed_tools", disallowedTools: A }]),
    ],
    O = H.agent ?? "general-purpose",
    M = q.options.agentDefinitions.activeAgents,
    j = M.find((D) => D.agentType === O) ?? M.find((D) => D.agentType === "general-purpose") ?? M[0];
  if (!j) throw Error("No agent available for forked execution");
  let w = [T8({ content: _ })];
  return { skillContent: _, modifiedGetAppState: Y, contextLayers: f, baseAgent: j, promptMessages: w };
}

// READABLE (for understanding):
async function buildForkedSkillContext(command, args, ctx) {
  let skillContent = (await command.getPromptForCommand(args, ctx))
        .map((p) => (p.type === "text" ? p.text : "")).join("\n"),
    allowed = parseTools(command.allowedTools ?? []),
    denied = parseTools(command.disallowedTools ?? []),
    modifiedGetAppState = wrapAppStateWithToolRules(ctx.getAppState, allowed, denied),
    contextLayers = [
      ...(allowed.length === 0 ? [] : [{ kind: "allowed_tools", allowedTools: allowed }]),
      ...(denied.length === 0 ? [] : [{ kind: "disallowed_tools", disallowedTools: denied }]),
    ],
    agentType = command.agent ?? "general-purpose",
    activeAgents = ctx.options.agentDefinitions.activeAgents,
    baseAgent = activeAgents.find((a) => a.agentType === agentType)
             ?? activeAgents.find((a) => a.agentType === "general-purpose")
             ?? activeAgents[0];
  if (!baseAgent) throw Error("No agent available for forked execution");
  let promptMessages = [makeUserMessage({ content: skillContent })];
  return { skillContent, modifiedGetAppState, contextLayers, baseAgent, promptMessages };
}

// Mapping: D0$→buildForkedSkillContext, H→command, $→args, q→ctx, IS→parseTools,
//          tT4→wrapAppStateWithToolRules, f→contextLayers, j→baseAgent, T8→makeUserMessage
```

### Where the effort layer actually feeds the model: `resolveEffortFromLayers` (`k3`)

The effort layer is **not cosmetic.** At query time, the layer list is reduced to a
single effort value by `resolveEffortFromLayers` (`k3`), and that value is passed as
`effortValue` into the model query options (e.g. cli_inner_pretty.js:402936:
`effortValue: k3($)`):

```javascript
// ============================================
// resolveEffortFromLayers - baseline effortValue overridden by each effort layer
// Location: cli_inner_pretty.js:453183-453188
// ============================================

// ORIGINAL (for source lookup):
function k3(H) {
  let $ = H.getAppState().effortValue,
    q = H.permissionLayers;
  if (!q) return $;
  for (let K of q) if (K.kind === "effort") $ = K.effort;
  return $;
}

// READABLE (for understanding):
function resolveEffortFromLayers(ctx) {
  let effort = ctx.getAppState().effortValue;        // user baseline (/effort setting)
  let layers = ctx.permissionLayers;
  if (!layers) return effort;
  for (let layer of layers)
    if (layer.kind === "effort") effort = layer.effort;  // last skill/agent layer wins
  return effort;
}

// Mapping: k3→resolveEffortFromLayers, H→ctx, $→effort, q→layers, K→layer
```

For completeness, `applyPermissionLayers` (`T6`, cli_inner_pretty.js:453162-453181) is
the *tool-permission* sibling reducer: it folds `allowed_tools` / `disallowed_tools` /
`avoid_prompts` layers into the tool permission context, and treats `effort`/`model`
layers as no-ops (they are consumed by `k3` and the model-resolver respectively, not by
the permission system).

---

## 3. The status-bar fix: `buildHookStatusEnv` (`w5`) walks the layers

### The bug

The status line (and the `CLAUDE_EFFORT` env var / status-line hook input) is produced
by `buildHookStatusEnv` (`w5`). Before the fix it read effort straight from
`getAppState().effortValue` — the **user's baseline** `/effort` setting — so while a
skill or agent was running with a forced effort, the bar still displayed the user
baseline. It disagreed with what the model was actually doing, because the model query
used `k3` (which *does* honor the layer).

### The fix

`w5` was changed to replicate `k3`'s reduction inline: start from the baseline, then
walk `permissionLayers` and let each `kind:"effort"` layer override, before computing the
displayed level:

```javascript
// ============================================
// buildHookStatusEnv - status-bar/hook effort now honors the skill/agent effort layer
// Location: cli_inner_pretty.js:552312-552327
// ============================================

// ORIGINAL (for source lookup):
function w5(H, $, q) {
  let K = $ ?? E$(),
    _ = q?.agentType ?? WR(),
    z = q?.options?.mainLoopModel,
    A = q?.getAppState?.().effortValue;
  for (let f of q?.permissionLayers ?? []) if (f.kind === "effort" && f.effort !== void 0) A = f.effort;
  let Y = z && q?.getAppState && A2(z) ? { level: Ev(z, A) } : void 0;
  return {
    session_id: K,
    transcript_path: Gk(K),
    cwd: C$(),
    permission_mode: H,
    agent_id: q?.agentId,
    agent_type: _,
    effort: Y,
  };
}

// READABLE (for understanding):
function buildHookStatusEnv(permissionMode, sessionId, ctx) {
  let session = sessionId ?? currentSessionId(),
    agentType = ctx?.agentType ?? mainThreadAgentType(),
    model = ctx?.options?.mainLoopModel,
    effortValue = ctx?.getAppState?.().effortValue;                 // start: user baseline
  for (let layer of ctx?.permissionLayers ?? [])                    // THE FIX:
    if (layer.kind === "effort" && layer.effort !== undefined)
      effortValue = layer.effort;                                   // skill/agent layer overrides baseline
  let effort = model && ctx?.getAppState && modelSupportsEffort(model)
        ? { level: computeDisplayEffortLevel(model, effortValue) }  // Ev applies silent downgrade
        : undefined;
  return {
    session_id: session,
    transcript_path: transcriptPath(session),
    cwd: currentWorkingDir(),
    permission_mode: permissionMode,
    agent_id: ctx?.agentId,
    agent_type: agentType,
    effort,
  };
}

// Mapping: w5→buildHookStatusEnv, H→permissionMode, $→sessionId, q→ctx, K→session,
//          A→effortValue, f→layer, Y→effort, Ev→computeDisplayEffortLevel, A2→modelSupportsEffort
```

### Precedence

The precedence is a strict two-tier "layer beats baseline":

```
   ┌─────────────────────────────────────────────────────────────┐
   │ displayed/applied effort for the current turn                  │
   ├─────────────────────────────────────────────────────────────┤
   │ TOP   : skill/agent `kind:"effort"` layer (per-turn)          │  ← last layer wins (k3 / w5 loop)
   │ BASE  : user baseline  getAppState().effortValue (/effort)    │  ← used only if no effort layer
   └─────────────────────────────────────────────────────────────┘
                              │
                              ▼  Ev(model, effortValue) = or(model, value) ?? "high"
                  ┌──────────────────────────────────────┐
                  │ silent downgrade (or):               │
                  │   "max"   & !modelSupportsMaxEffort   → "high"
                  │   "xhigh" & !modelSupportsXhighEffort → "high"
                  └──────────────────────────────────────┘
```

`w5` now uses the **same** "baseline then override per effort layer" walk that `k3`
uses, so the status bar's effort and the model's actual effort are computed from the same
inputs — the displayed value can no longer disagree with the applied value.

### The displayed level + silent downgrade

The displayed level is `computeDisplayEffortLevel` (`Ev`):

```javascript
// ============================================
// computeDisplayEffortLevel - turn an effort value into the display level (with downgrade)
// Location: cli_inner_pretty.js:184944-184947 (Ev); 184909-184919 (or)
// ============================================

// ORIGINAL (for source lookup):
function Ev(H, $) {
  let q = or(H, $) ?? "high";
  return E1H(q);
}
function or(H, $) {
  if (!A2(H)) return;
  let q = AkH(H), K = q48(H), _ = zkH();
  if (_ === null) return q ? K : void 0;
  let z = _ ?? (q ? K : void 0) ?? $ ?? K;
  if (z === "max" && !ow$(H)) return "high";
  if (z === "xhigh" && !ycH(H)) return "high";
  return z;
}

// READABLE (for understanding):
function computeDisplayEffortLevel(model, effortValue) {
  let level = resolveModelEffort(model, effortValue) ?? "high";
  return normalizeEffortLevelString(level);
}
function resolveModelEffort(model, requestedEffort) {
  if (!modelSupportsEffort(model)) return undefined;
  let pinLaunch = isLaunchEffortPinned(model),       // unpinOpus47/48 flags
    launchDefault = getDefaultEffortForModel(model), // q48: opus-4-8 → "high", opus-4-7 → "xhigh"
    envEffort = effortFromEnv();                     // CLAUDE_CODE_EFFORT_LEVEL
  if (envEffort === null) return pinLaunch ? launchDefault : undefined;
  let level = envEffort ?? (pinLaunch ? launchDefault : undefined) ?? requestedEffort ?? launchDefault;
  if (level === "max"   && !modelSupportsMaxEffort(model))   return "high";   // SILENT DOWNGRADE
  if (level === "xhigh" && !modelSupportsXhighEffort(model)) return "high";   // SILENT DOWNGRADE
  return level;
}

// Mapping: Ev→computeDisplayEffortLevel, or→resolveModelEffort, A2→modelSupportsEffort,
//          q48→getDefaultEffortForModel, ow$→modelSupportsMaxEffort, ycH→modelSupportsXhighEffort,
//          E1H→normalizeEffortLevelString, AkH→isLaunchEffortPinned, zkH→effortFromEnv
```

`modelSupportsXhighEffort` (`ycH`) returns true only for `claude-opus-4-8` and
`claude-opus-4-7` (cli_inner_pretty.js:184850), or when the `xhigh_effort` 3P capability
override says so. So a skill carrying `effort: xhigh` running on, say, Sonnet 4.6 is
**silently downgraded to `high`** for both the API call and the status bar — they stay
consistent precisely because both go through `Ev`/`or`.

The hook-input schema documents this downgrade explicitly. The `effort.level` field
describes itself as the *"Active effort level for the current turn (e.g., "low",
"medium", "high", "xhigh", "max"), after any silent downgrade for the selected model.
Also exposed to hook commands and Bash as the CLAUDE_EFFORT env var."*
(cli_inner_pretty.js:336659-336665).

> **CLAUDE_EFFORT note.** Because `effort.level` (and thus `CLAUDE_EFFORT`) is the
> *post-downgrade* level pulled through `Ev`, a hook or Bash command that reads
> `CLAUDE_EFFORT` sees the effort actually in force for this turn — including a
> skill/agent override and including the silent `xhigh→high` / `max→high` downgrade —
> never the raw frontmatter request and never the bare user baseline.

---

## 4. Why a *layer* mechanism (design rationale)

### What it does

Instead of mutating session-global effort when a skill runs (and having to remember to
restore it), per-skill effort is expressed as an entry in a `permissionLayers` array that
is rebuilt every turn. Three layer kinds compose the same way: `effort`, `model`, and the
disallowed-tools / allowed-tools layers (cf. cli_inner_pretty.js:350788-350790 where all
three are emitted together; the disallowed-tools layer for forks at
cli_inner_pretty.js:452918).

### Why this approach (vs. mutating global state)

1. **Composability.** A single skill invocation can simultaneously force a model
   (`kind:"model"`), restrict tools (`kind:"disallowed_tools"`), and raise effort
   (`kind:"effort"`). Each is an independent layer reduced by its own resolver
   (`T6` for tools, `k3` for effort, the model-resolver for model). New override
   dimensions can be added without touching the others — the reducers each ignore layer
   kinds they don't care about (`T6` no-ops on `effort`/`model`,
   cli_inner_pretty.js:453177-453179).

2. **Per-turn lifetime = automatic cleanup.** `permissionLayers` is the canonical place
   per-turn overrides live; because it is rebuilt each turn, a forced effort
   *self-expires* after the turn that ran the skill. There is no "reset the global effort
   back to baseline" bookkeeping to get wrong (the same reset that clears the
   disallowed-tools restriction on the next user message). This mirrors the disallowed-
   tools frontmatter lifetime described elsewhere in module 10.

3. **Single computation point ⇒ display can't drift.** Because the runtime authority is a
   pure reduction over the layer list (`k3`), the status bar only had to *reuse the same
   reduction* (the `w5` loop) to stay in sync. The pre-fix bug was exactly the cost of
   *not* doing that — `w5` read the baseline directly and skipped the layers. The layer
   design makes "make the display match reality" a two-line loop, not a cross-cutting
   state-sync problem.

4. **Last-writer-wins ordering is well-defined.** Both `k3` and `w5` iterate the layer
   array and let later entries override earlier ones, so a nested skill's effort
   (appended later) deterministically wins over an outer one — important because skills
   can invoke skills (`nested-skill` trigger at cli_inner_pretty.js:350751).

**Trade-off:** the layer array is walked on every effort read (status bar, each query).
Layer counts are tiny (single digits per turn), so the linear scan is negligible versus
the correctness/cleanup benefits of a declarative, self-expiring override.

**Key insight:** effort isn't stored as forced state — it's *derived* per turn by folding
a short-lived layer list over the user baseline. The status-bar fix is the recognition
that the *display* must perform the identical fold; anything that reads effort must go
through (or replicate) the layer reduction, never the raw baseline.

---

## 5. Cross-reference: Opus 4.8 default-high `xhigh` model side (module 43)

The model-side counterpart of `xhigh` lives in module 43 (Opus 4.8). Two anchors here tie
the two together:

- `getDefaultEffortForModel` (`q48`, cli_inner_pretty.js:184987-184991): Opus 4.8 launches at
  `high`, Opus 4.7 launches at `xhigh`. So on Opus 4.8 the *default* effort is `high`, and
  `xhigh`/`max` are opt-in (via `/effort`, `ultracode` → `xhigh` at
  cli_inner_pretty.js:185015, or a skill's `effort:` frontmatter).
- `modelSupportsXhighEffort` (`ycH`, cli_inner_pretty.js:184834-184851): the gate that
  makes `xhigh` *meaningful* only on Opus 4.7/4.8 — every other model silent-downgrades
  to `high`.

See module 43 for the Opus 4.8 model-id map and the full effort-default selection; this
doc covers only how the skill/agent `effort:` frontmatter *feeds into* that selection via
the permission layer.

---

## 6. Cross-validation against 2.1.88 (confidence: high)

**Precursors that existed (effort frontmatter machinery):**

- `effort?: string | null` frontmatter field — `src/utils/frontmatterParser.ts:39-40`,
  with the comment *"Effort level for agents (e.g., 'low', 'medium', 'high', 'max', or an
  integer)"*. Note the 2.1.88 example list is **`max` but no `xhigh`**.
- The skill parser's effort parse + invalid log — `src/skills/loadSkillsDir.ts:228-233`:
  `parseEffortValue(effortRaw)` then `logForDebugging("... Valid options:
  ${EFFORT_LEVELS.join(', ')} or an integer")`. This is the byte-for-byte ancestor of
  `vx` + `dN.join(", ")` at cli_inner_pretty.js:421565-421568 / 414144-414147.
- `EFFORT_LEVELS = ['low','medium','high','max']` — `src/utils/effort.ts:13-17` (no
  `xhigh`). `parseEffortValue` / `isEffortLevel` / `modelSupportsEffort` /
  `modelSupportsMaxEffort` — `src/utils/effort.ts` — direct ancestors of `vx` / `KkH` /
  `A2` / `ow$`.

**NEW post-2.1.88 (no precursor):**

- The `xhigh` level itself — `dN` adds it (cli_inner_pretty.js:185009); 2.1.88's
  `EFFORT_LEVELS` lacks it, and there is **no** `modelSupportsXhighEffort` /
  `xhigh` string anywhere under `src/` in 2.1.88 (grep returns nothing). `ycH` is new.
- The `kind:"effort"` permission layer + the entire `permissionLayers` mechanism — grep
  for `permissionLayers` across `src/` in 2.1.88 returns **zero hits**. `k3`
  (resolveEffortFromLayers) and the contextLayers emission at
  cli_inner_pretty.js:350788-350790 / 396035-396036 have no precursor.
- The layer-based status-bar / hook-env effort (`w5` walk at
  cli_inner_pretty.js:552317) — no precursor; the 2.1.88 hook env had no
  layer-aware effort threading. This is the 2.1.156 changelog fix.

---

## Appendix: end-to-end flow

```
 frontmatter `effort: xhigh`  ──parse──▶  vx() ──validate against──▶ dN (incl. xhigh)
        │                                   │ invalid → "Valid options: ${dN.join(', ')} or an integer"
        ▼
  skill record .effort (or dynamic .getEffort)
        │
        ├── INLINE  ── Skill.call → processPromptSlashCommand → effort = getEffort?.()??effort
        │              → contextLayers += { kind:"effort", effort }   (350790)
        │
        └── FORK    ── forkSlashCommand → effort = getEffort?.()??effort
                       → baseAgent = { ...agent, effort }             (396036)

 per turn:  permissionLayers = [...session, ...skill contextLayers]
        │
        ├── model query:  effortValue: k3(ctx)  ── baseline overridden by effort layers (453187)
        │                       └─▶ API uses this effort
        │
        └── status bar / CLAUDE_EFFORT:  w5(ctx) walks permissionLayers,
                                          overrides effortValue (552317),
                                          Ev(model, effortValue) → display level
                                          (silent xhigh/max → high downgrade via or/ycH/ow$)

 next user message → permissionLayers rebuilt → skill effort layer gone (self-expires)
```
