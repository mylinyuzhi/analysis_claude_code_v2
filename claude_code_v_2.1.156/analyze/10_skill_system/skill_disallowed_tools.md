# disallowed-tools Frontmatter: Per-Skill Tool Removal Scoped to the Active Turn

> Part of the **10_skill_system** module, covering the **v2.1.143 → v2.1.156** delta. Companion to the 2.1.142 docs
> [skill_frontmatter.md](../../../claude_code_v_2.1.142/analyze/10_skill_system/skill_frontmatter.md) (the YAML frontmatter contract) and
> [claude_effort_var.md](../../../claude_code_v_2.1.142/analyze/10_skill_system/claude_effort_var.md) (`${CLAUDE_EFFORT}` and the effort field). This document covers the **new** `disallowed-tools` frontmatter field added in changelog **2.1.152** — the subtractive twin of `allowed-tools` — and how it is parsed, normalized, applied at runtime via two different mechanisms (inline vs forked skills), and why it is *ephemeral* (cleared on the next user message) rather than persistent.

## Related Symbols

> Symbol mappings live only in the central index files (do not duplicate as tables here):
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (tools, agent loop)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skills, effort, hooks)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Permissions, prompt)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Slash commands, plugins)

Key symbols in this document:
- `SKILL_FRONTMATTER_SCHEMA` (`aL6`) — skill YAML zod schema, extends the common schema (cli_inner_pretty.js:184517)
- `COMMON_FRONTMATTER_SCHEMA` (`GL5`) — shared skill/slash-command schema holding `disallowed-tools` + `disallowedTools` (cli_inner_pretty.js:184480-184516)
- `AGENT_FRONTMATTER_SCHEMA` (`TL5`) — agent/subagent zod schema; carries its own `disallowedTools` (cli_inner_pretty.js:184556-184586)
- `normalizeToolList` (`fc`) — wraps `tZ4`, returns `[]` for null/undefined (cli_inner_pretty.js:443196-443200)
- `normalizeToolListOrNull` (`tZ4`) — string/array → trimmed token list, collapses to `["*"]` (cli_inner_pretty.js:443179-443189)
- `parseToolSpecList` (`IS`) — paren-aware comma/space splitter for tool specs (cli_inner_pretty.js:442850-442882)
- `parsePluginCommand` (`cV$`) — plugin command/skill frontmatter parser (cli_inner_pretty.js:414118-414164)
- `parseSkillFrontmatter` (`cd6`) — `.claude` skill frontmatter → record (cli_inner_pretty.js:421555-421591)
- `buildSkillCommandObject` (`Ov$`) — skill record → command object with `disallowedTools` (cli_inner_pretty.js:421592-421630)
- `applyToolDenyRules` (`c28`) — mutates `alwaysDenyRules.command` (union or replace) (cli_inner_pretty.js:395738-395745)
- `runInlineSkill` (`yA4`) — inline skill executor; calls `c28` union for disallowed tools (cli_inner_pretty.js:396582-396649)
- `processUserInput` (`fI8`) — per-message processor; resets deny rules with `c28` replace (cli_inner_pretty.js:590814-590839)
- `addDenyRulesToContext` (`fV8`) — pure deny-rule appender on a `toolPermissionContext` (cli_inner_pretty.js:452899-452902)
- `addAllowRulesToContext` (`YV8`) — pure allow-rule appender (cli_inner_pretty.js:452892-452897)
- `wrapAppStateWithRules` (`tT4`) — wraps `getAppState` to apply allow+deny rules (cli_inner_pretty.js:452903-452908)
- `buildForkedSkillContext` (`D0$`) — builds forked-skill context layers + agent (cli_inner_pretty.js:452910-452925)
- `applyPermissionLayers` (`T6`) — folds `permissionLayers` over the base context (cli_inner_pretty.js:453162-453182)
- `resolveEffortFromLayers` (`k3`) — folds the `effort` layer over baseline effort (cli_inner_pretty.js:453183-453189)
- `buildHookStatusEnv` (`w5`) — status/hook env; effort reflects the effort layer (cli_inner_pretty.js:552312-552327)
- `EFFORT_LEVELS` (`dN`) — `["low","medium","high","xhigh","max"]` (cli_inner_pretty.js:185009)
- `SKILL_TOOL_NAME` (`ZX`) — `"Skill"` (cli_inner_pretty.js:216282)
- `AGENT_TOOL_NAME` (`sq`) — `"Agent"` (cli_inner_pretty.js:185637)

---

## TL;DR

`disallowed-tools` is a YAML frontmatter field a skill/slash-command author writes to **remove tools from the model for as long as that file is active**. It is the subtractive complement to `allowed-tools`:

| Field | Direction | Persistence | Mechanism |
|-------|-----------|-------------|-----------|
| `allowed-tools` | additive (grant) | persists; surfaces as a permission prompt for narrowing | `command_permissions` allow-list + `alwaysAllowRules.command` |
| **`disallowed-tools`** | **subtractive (deny)** | **ephemeral — cleared when the user sends the next message** | `alwaysDenyRules.command` union (inline) / `disallowed_tools` permission layer (fork) |

The schema accepts **two spellings of the same field**: the hyphenated `disallowed-tools` (what authors write) and the camelCase canonical alias `disallowedTools` (cli_inner_pretty.js:184492-184497). Both parsers coalesce them with `Y["disallowed-tools"] ?? Y.disallowedTools` and normalize via `normalizeToolList` (`fc`) onto a single record field `disallowedTools`.

At runtime there are **two application paths**:

1. **Inline skills** (`context: inline`, the default) push the deny-list straight into the live session's `toolPermissionContext` via `applyToolDenyRules` (`c28`) in **union** mode, OR-ing the tools into `alwaysDenyRules.command` (cli_inner_pretty.js:396622).
2. **Forked skills** (`context: fork`) attach a `{ kind: "disallowed_tools", disallowedTools }` **permission layer** built by `buildForkedSkillContext` (`D0$`, cli_inner_pretty.js:452918); `applyPermissionLayers` (`T6`) folds that layer over the child's base context using `addDenyRulesToContext` (`fV8`, cli_inner_pretty.js:453171-453172).

The "cleared on the next message" semantics come from the same mutator: `processUserInput` (`fI8`) calls `c28(setToolPermissionContext, G.disallowedTools ?? [])` in the **default replace mode** for every user message (cli_inner_pretty.js:590839). A message that does not run a skill resolves with `disallowedTools = undefined`, so the call **replaces** `alwaysDenyRules.command` with `[]`, wiping any deny rule the previous skill installed.

**Cross-validation (confidence: high):** In v2.1.88 the only `disallowed-tools` surface was the `--disallowedTools` **CLI flag** (`src/main.tsx`, parsed in `initializeToolPermissionContext`, `src/utils/permissions/permissionSetup.ts:874-898`) and an `disallowedTools` field on **agent** frontmatter (`src/tools/AgentTool/loadAgentsDir.ts:469-472`). There was **no** `disallowed-tools` field on **skill / slash-command** frontmatter — `grep -r "disallowed-tools" src/` returns exactly one hit, the CLI option. The per-skill frontmatter field documented here is **NEW post-2.1.88**.

---

## 1. The schema: one field, two spellings, three carriers

The skill frontmatter schema (`SKILL_FRONTMATTER_SCHEMA`, `aL6`) is built by extending a **common schema** (`COMMON_FRONTMATTER_SCHEMA`, `GL5`) shared with ordinary slash commands. The `disallowed-tools` entries live in the common schema, so both SKILL.md files and `.claude/commands/*.md` slash commands inherit them.

```javascript
// ============================================
// COMMON_FRONTMATTER_SCHEMA - disallowed-tools + canonical alias on skills/slash commands
// Location: cli_inner_pretty.js:184489-184497
// ============================================

// ORIGINAL (for source lookup):
"allowed-tools": BjH()
  .optional()
  .describe("Tools available to the model while this file is active. Comma-separated string or YAML list."),
"disallowed-tools": BjH()
  .optional()
  .describe(
    "Tools removed from the model while this file is active. Comma-separated string or YAML list. Cleared when the user sends the next message.",
  ),
disallowedTools: BjH().optional().describe("Canonical (normalized) alias of `disallowed-tools`."),

// READABLE (for understanding):
const COMMON_FRONTMATTER_SCHEMA = zodLazy(() => z.object({
  // ...name, description, model...
  "allowed-tools": stringOrStringArray().optional()
    .describe("Tools available to the model while this file is active. ..."),
  "disallowed-tools": stringOrStringArray().optional()
    .describe("Tools removed from the model while this file is active. ... Cleared when the user sends the next message."),
  disallowedTools: stringOrStringArray().optional()
    .describe("Canonical (normalized) alias of `disallowed-tools`."),
  // ...argument-hint, arguments, disable-model-invocation, user-invocable, effort, shell, version...
}));

// Mapping: GL5→COMMON_FRONTMATTER_SCHEMA, aL6→SKILL_FRONTMATTER_SCHEMA (GL5().extend(...)),
//          BjH→stringOrStringArray, yH→zodLazy, z2→optionalString, NcH→optionalBoolean
```

The agent/subagent schema (`AGENT_FRONTMATTER_SCHEMA`, `TL5`) carries its own `disallowedTools` field with subtly different semantics — it removes tools from the agent's **default tool set** and is *ignored if `tools` (the allow-list) is set*:

```javascript
// ============================================
// AGENT_FRONTMATTER_SCHEMA - disallowedTools on agent definitions
// Location: cli_inner_pretty.js:184565-184566
// ============================================

// ORIGINAL (for source lookup):
tools: BjH().optional().describe("Tools available to this agent. Replaces the default set."),
disallowedTools: BjH().optional().describe("Tools removed from the default set. Ignored if `tools` is set."),

// READABLE (for understanding):
const AGENT_FRONTMATTER_SCHEMA = zodLazy(() => z.object({
  // ...name, description, model...
  tools: stringOrStringArray().optional()
    .describe("Tools available to this agent. Replaces the default set."),
  disallowedTools: stringOrStringArray().optional()
    .describe("Tools removed from the default set. Ignored if `tools` is set."),
  // ...color, effort, permissionMode, mcpServers, hooks, maxTurns, skills, ...
}));

// Mapping: TL5→AGENT_FRONTMATTER_SCHEMA, BjH→stringOrStringArray
```

### Why two spellings?

`disallowed-tools` is the author-facing, kebab-case form (matching `allowed-tools`, `argument-hint`, `when_to_use`, `disable-model-invocation`). `disallowedTools` is the camelCase **canonical alias** the system itself emits when it serializes a skill back to disk (e.g. when an agent definition or a normalized record is written) — and is exactly the spelling agents already used in v2.1.88. By accepting both at parse time and coalescing with `??`, the loader is forward/backward compatible: a hand-written file with `disallowed-tools` and a machine-serialized file with `disallowedTools` both land on the same record field. The describe text is the load-bearing documentation: *"Cleared when the user sends the next message."*

---

## 2. Parse: both parsers normalize via `fc` onto `disallowedTools`

Two distinct parsers produce skill/command records, and **both** read `disallowed-tools` ?? `disallowedTools` and run it through `normalizeToolList` (`fc`).

### 2a. Plugin command / plugin skill parser (`parsePluginCommand`, `cV$`)

```javascript
// ============================================
// parsePluginCommand - plugin command/skill frontmatter → command record
// Location: cli_inner_pretty.js:414129-414164
// ============================================

// ORIGINAL (for source lookup):
J = Y["allowed-tools"],
X = typeof J === "string" ? D(J) : Array.isArray(J) ? J.map((U) => (typeof U === "string" ? D(U) : U)) : J,
L = fc(X),
P = fc(Y["disallowed-tools"] ?? Y.disallowedTools),
// ...
return {
  type: "prompt", name: H, description: M,
  allowedTools: L,
  disallowedTools: P.length > 0 ? P : void 0,
  // ...
};

// READABLE (for understanding):
const rawAllowed = frontmatter["allowed-tools"];
const expandedAllowed = typeof rawAllowed === "string"
  ? expandSkillDir(rawAllowed)
  : Array.isArray(rawAllowed) ? rawAllowed.map(t => typeof t === "string" ? expandSkillDir(t) : t)
  : rawAllowed;
const allowedTools = normalizeToolList(expandedAllowed);
const disallowedTools = normalizeToolList(frontmatter["disallowed-tools"] ?? frontmatter.disallowedTools);
// ...
return {
  type: "prompt", name, description,
  allowedTools,
  disallowedTools: disallowedTools.length > 0 ? disallowedTools : undefined,  // omit empty
  // ...
};

// Mapping: cV$→parsePluginCommand, Y→frontmatter, fc→normalizeToolList, D→expandSkillDir,
//          J/X→rawAllowed/expandedAllowed, L→allowedTools, P→disallowedTools
```

Note `allowed-tools` runs through `${CLAUDE_SKILL_DIR}` expansion (`expandSkillDir`, `D`) before normalization because tool specs can reference the skill's directory (e.g. `Read(${CLAUDE_SKILL_DIR}/**)`); `disallowed-tools` is *not* expanded — a denial is a bare tool name/pattern, not a filesystem grant. The empty-list-to-`undefined` collapse (`P.length > 0 ? P : void 0`) keeps the record clean so downstream "is there a denial?" checks are a simple truthiness test.

### 2b. `.claude` skill parser (`parseSkillFrontmatter`, `cd6` + `buildSkillCommandObject`, `Ov$`)

```javascript
// ============================================
// parseSkillFrontmatter - .claude SKILL.md frontmatter → intermediate record
// Location: cli_inner_pretty.js:421573-421574
// ============================================

// ORIGINAL (for source lookup):
allowedTools: fc(H["allowed-tools"]),
disallowedTools: fc(H["disallowed-tools"] ?? H.disallowedTools),

// READABLE (for understanding):
allowedTools: normalizeToolList(frontmatter["allowed-tools"]),
disallowedTools: normalizeToolList(frontmatter["disallowed-tools"] ?? frontmatter.disallowedTools),

// Mapping: cd6→parseSkillFrontmatter, H→frontmatter, fc→normalizeToolList
```

The intermediate record then flows into `buildSkillCommandObject` (`Ov$`) which produces the final command object, again collapsing empty to `undefined`:

```javascript
// ============================================
// buildSkillCommandObject - skill record → command object (disallowedTools carried through)
// Location: cli_inner_pretty.js:421629-421630
// ============================================

// ORIGINAL (for source lookup):
allowedTools: z,
disallowedTools: A?.length ? A : void 0,

// READABLE (for understanding):
allowedTools,
disallowedTools: disallowedTools?.length ? disallowedTools : undefined,

// Mapping: Ov$→buildSkillCommandObject, z→allowedTools, A→disallowedTools
```

### The normalizer: `fc` → `tZ4` → `IS`

`normalizeToolList` (`fc`) is a thin wrapper that returns `[]` for null/undefined; the real work is `normalizeToolListOrNull` (`tZ4`):

```javascript
// ============================================
// normalizeToolListOrNull - string|array → trimmed token list, * collapses to ["*"]
// Location: cli_inner_pretty.js:443179-443200
// ============================================

// ORIGINAL (for source lookup):
function tZ4(H) {
  if (H === void 0 || H === null) return null;
  if (!H) return [];
  let $ = [];
  if (typeof H === "string") $ = [H];
  else if (Array.isArray(H)) $ = H.filter((K) => typeof K === "string");
  if ($.length === 0) return [];
  let q = IS($);
  if (q.includes("*")) return ["*"];
  return q;
}
function fc(H) {
  let $ = tZ4(H);
  if ($ === null) return [];
  return $;
}

// READABLE (for understanding):
function normalizeToolListOrNull(value) {
  if (value === undefined || value === null) return null;   // distinguishes "absent" from "empty"
  if (!value) return [];                                     // "" or 0 → empty
  let raw = typeof value === "string" ? [value]
          : Array.isArray(value) ? value.filter(v => typeof v === "string")
          : [];
  if (raw.length === 0) return [];
  const tokens = parseToolSpecList(raw);                     // split comma/space, respect parens
  if (tokens.includes("*")) return ["*"];                    // wildcard short-circuits to "deny everything"
  return tokens;
}
function normalizeToolList(value) {
  const result = normalizeToolListOrNull(value);
  return result === null ? [] : result;
}

// Mapping: tZ4→normalizeToolListOrNull, fc→normalizeToolList, IS→parseToolSpecList, $→raw, q→tokens
```

`parseToolSpecList` (`IS`, cli_inner_pretty.js:442850-442882) is a small state machine that splits on commas **and** spaces but tracks parenthesis depth so a spec like `Bash(git commit:*)` stays one token rather than fracturing on its internal comma/space:

```
input:  "Bash(git:*), Edit  Write"
        ┌──────────────┐
        │ ( opens, , and spaces inside parens are literal
        └──────────────┘
output: ["Bash(git:*)", "Edit", "Write"]
```

**Key insight:** Both the hyphenated and camelCase spellings, whether given as a comma-string or a YAML list, converge on the *same* normalized `string[]` of tool specs. A single wildcard `*` collapses the whole list to `["*"]` — a deny-all sentinel that downstream rule matching treats as "remove every tool while this skill is active." This is why `allowed-tools: "*"` and `disallowed-tools: "*"` are both meaningful and cheaply detectable.

---

## 3. Runtime application — two mechanisms

The reason there are two paths is the two skill execution contexts: **inline** (the skill body expands into the *current* conversation, sharing its permission context) and **fork** (the skill runs in a *child* subagent with its own context). A deny rule has to land in the right context object in each case.

```
                         disallowed-tools (normalized string[])
                                      │
              ┌───────────────────────┴────────────────────────┐
              │                                                 │
        context: inline (default)                        context: fork
              │                                                 │
   runInlineSkill (yA4) 396622                   buildForkedSkillContext (D0$) 452910
              │                                                 │
   c28(setToolPermissionContext,                  contextLayers += { kind:"disallowed_tools",
       D, "union")                                              disallowedTools: A }   [452918]
              │                                                 │
   alwaysDenyRules.command ∪= D                   applyPermissionLayers (T6) 453171
   (mutates the LIVE session context)             → fV8 appends to child's
              │                                       alwaysDenyRules.command  [452899]
              ▼                                                 ▼
   reset next turn by                              child context is per-fork,
   c28(...,"replace") in fI8 590839                discarded when the fork ends
```

### 3a. Inline skills — `c28` union into `alwaysDenyRules.command`

When an inline skill is executed, `runInlineSkill` (`yA4`) normalizes `disallowedTools` again (defensively, since the same executor is reached via several entry points) and, if non-empty, unions it into the live `toolPermissionContext`:

```javascript
// ============================================
// runInlineSkill - inline skill pushes deny-list into live context (union)
// Location: cli_inner_pretty.js:396619-396647
// ============================================

// ORIGINAL (for source lookup):
let j = kA4(H, $),
  w = IS(H.allowedTools ?? []),
  D = IS(H.disallowedTools ?? []);
if (D.length > 0) c28(q.setToolPermissionContext, D, "union");
// ...
return {
  messages: [ /* ... */ ],
  shouldQuery: !0,
  allowedTools: w,
  disallowedTools: D,
  // ...
};

// READABLE (for understanding):
const allowedTools = parseToolSpecList(skill.allowedTools ?? []);
const disallowedTools = parseToolSpecList(skill.disallowedTools ?? []);
if (disallowedTools.length > 0) {
  applyToolDenyRules(context.setToolPermissionContext, disallowedTools, "union");  // OR into live deny rules
}
// ...
return {
  shouldQuery: true,
  allowedTools,
  disallowedTools,   // propagated so processUserInput can decide the reset
  // ...
};

// Mapping: yA4→runInlineSkill, IS→parseToolSpecList, c28→applyToolDenyRules, q→context, D→disallowedTools, w→allowedTools
```

The mutator `applyToolDenyRules` (`c28`) is mode-aware:

```javascript
// ============================================
// applyToolDenyRules - union or replace alwaysDenyRules.command, idempotent
// Location: cli_inner_pretty.js:395738-395745
// ============================================

// ORIGINAL (for source lookup):
function c28(H, $, q = "replace") {
  H((K) => {
    let _ = K.alwaysDenyRules.command,
      z = q === "union" ? aq([...(_ ?? []), ...$]) : [...$];
    if ((_?.length ?? 0) === z.length && (_ ?? []).every((Y, f) => Y === z[f])) return K;
    return { ...K, alwaysDenyRules: { ...K.alwaysDenyRules, command: z.length > 0 ? z : void 0 } };
  });
}

// READABLE (for understanding):
function applyToolDenyRules(setToolPermissionContext, newDenied, mode = "replace") {
  setToolPermissionContext((ctx) => {
    const existing = ctx.alwaysDenyRules.command;
    const next = mode === "union"
      ? dedupe([...(existing ?? []), ...newDenied])   // inline skill: add to whatever is there
      : [...newDenied];                               // per-message reset: overwrite outright
    // No-op guard: if the array is unchanged, return the SAME object (no React re-render)
    if ((existing?.length ?? 0) === next.length && (existing ?? []).every((v, i) => v === next[i])) return ctx;
    return { ...ctx, alwaysDenyRules: { ...ctx.alwaysDenyRules, command: next.length > 0 ? next : undefined } };
  });
}

// Mapping: c28→applyToolDenyRules, H→setToolPermissionContext, $→newDenied, q→mode, aq→dedupe,
//          K→ctx, _→existing, z→next
```

Two design touches matter here:
- The deny-list is stored under `alwaysDenyRules.command`, the **same channel** users write deny rules into via `/permissions` and the same channel the `--disallowedTools` CLI flag feeds. So a skill denial composes naturally with operator/CLI denials — the permission engine doesn't need a separate "skill deny" concept.
- The **identity-preserving no-op guard** (`if (... every same) return K`) avoids spurious React state updates when the deny-list is unchanged, which matters because `setToolPermissionContext` is a state setter driving the TUI.

### 3b. Forked skills — a `disallowed_tools` permission layer

Forked skills can't mutate the parent's live context (the whole point of a fork is isolation). Instead `buildForkedSkillContext` (`D0$`) produces a **declarative context-layer array** that travels with the child and is applied lazily:

```javascript
// ============================================
// buildForkedSkillContext - assembles allowed/disallowed permission layers for a forked skill
// Location: cli_inner_pretty.js:452910-452925
// ============================================

// ORIGINAL (for source lookup):
async function D0$(H, $, q) {
  let _ = (await H.getPromptForCommand($, q)).map((D) => (D.type === "text" ? D.text : "")).join(`\n`),
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
async function buildForkedSkillContext(skill, args, context) {
  const skillContent = (await skill.getPromptForCommand(args, context))
    .map(b => b.type === "text" ? b.text : "").join("\n");
  const allowedTools    = parseToolSpecList(skill.allowedTools ?? []);
  const disallowedTools = parseToolSpecList(skill.disallowedTools ?? []);
  const modifiedGetAppState = wrapAppStateWithRules(context.getAppState, allowedTools, disallowedTools);
  const contextLayers = [
    ...(allowedTools.length    === 0 ? [] : [{ kind: "allowed_tools",    allowedTools }]),
    ...(disallowedTools.length === 0 ? [] : [{ kind: "disallowed_tools", disallowedTools }]),
  ];
  const agentType = skill.agent ?? "general-purpose";
  const agents = context.options.agentDefinitions.activeAgents;
  const baseAgent = agents.find(a => a.agentType === agentType)
                 ?? agents.find(a => a.agentType === "general-purpose")
                 ?? agents[0];
  if (!baseAgent) throw new Error("No agent available for forked execution");
  return { skillContent, modifiedGetAppState, contextLayers, baseAgent, promptMessages: [makeMessage(skillContent)] };
}

// Mapping: D0$→buildForkedSkillContext, IS→parseToolSpecList, tT4→wrapAppStateWithRules,
//          z→allowedTools, A→disallowedTools, Y→modifiedGetAppState, f→contextLayers, j→baseAgent
```

`buildForkedSkillContext` produces *two* representations of the same restriction (belt-and-suspenders):
- `modifiedGetAppState` — an already-wrapped `getAppState` (`wrapAppStateWithRules`, `tT4`) that bakes the allow/deny rules into the snapshot the child reads.
- `contextLayers` — declarative `{ kind }` records that `applyPermissionLayers` re-applies on every tool-use evaluation.

`applyPermissionLayers` (`T6`) is the fold that turns the layer array into an effective `toolPermissionContext`. The `disallowed_tools` case calls `addDenyRulesToContext` (`fV8`):

```javascript
// ============================================
// applyPermissionLayers - fold permissionLayers over the base context (disallowed_tools → fV8)
// Location: cli_inner_pretty.js:453162-453182
// ============================================

// ORIGINAL (for source lookup):
function T6(H) {
  let $ = H.getAppState().toolPermissionContext,
    q = H.permissionLayers;
  if (!q) return $;
  for (let K of q)
    switch (K.kind) {
      case "allowed_tools":    $ = YV8($, [...K.allowedTools]);    break;
      case "disallowed_tools": $ = fV8($, [...K.disallowedTools]); break;
      case "avoid_prompts":    if (!$.shouldAvoidPermissionPrompts) $ = { ...$, shouldAvoidPermissionPrompts: !0 }; break;
      case "effort": case "model": break;
    }
  return $;
}

// READABLE (for understanding):
function applyPermissionLayers(context) {
  let toolCtx = context.getAppState().toolPermissionContext;   // BASE from app state
  const layers = context.permissionLayers;
  if (!layers) return toolCtx;
  for (const layer of layers)
    switch (layer.kind) {
      case "allowed_tools":    toolCtx = addAllowRulesToContext(toolCtx, [...layer.allowedTools]);    break;
      case "disallowed_tools": toolCtx = addDenyRulesToContext(toolCtx, [...layer.disallowedTools]);  break;
      case "avoid_prompts":    if (!toolCtx.shouldAvoidPermissionPrompts) toolCtx = { ...toolCtx, shouldAvoidPermissionPrompts: true }; break;
      case "effort": case "model": break;   // not tool-permission concerns; handled by k3 / model selection
    }
  return toolCtx;
}

// Mapping: T6→applyPermissionLayers, H→context, $→toolCtx, q→layers, K→layer,
//          YV8→addAllowRulesToContext, fV8→addDenyRulesToContext
```

```javascript
// ============================================
// addDenyRulesToContext - pure: append deny specs to alwaysDenyRules.command
// Location: cli_inner_pretty.js:452899-452902
// ============================================

// ORIGINAL (for source lookup):
function fV8(H, $) {
  if ($.length === 0) return H;
  return { ...H, alwaysDenyRules: { ...H.alwaysDenyRules, command: aq([...(H.alwaysDenyRules.command || []), ...$]) } };
}

// READABLE (for understanding):
function addDenyRulesToContext(toolCtx, denied) {
  if (denied.length === 0) return toolCtx;                            // identity for empty
  return { ...toolCtx, alwaysDenyRules: {
    ...toolCtx.alwaysDenyRules,
    command: dedupe([...(toolCtx.alwaysDenyRules.command || []), ...denied]),  // union, deduped
  }};
}

// Mapping: fV8→addDenyRulesToContext, H→toolCtx, $→denied, aq→dedupe
```

**Key insight:** both mechanisms end at the *same* destination — `alwaysDenyRules.command` unioned with the skill's tools. Inline uses an **imperative mutation** (`c28` against the live `setToolPermissionContext`); fork uses a **declarative layer** (`T6`/`fV8`) computed fresh each evaluation. The fork path must be re-derivable per tool-use because a forked child's base context can change, and because the layer is *positional* — it is applied last, after the base context, so the skill's denial wins even over a base allow.

---

## 4. Cleared-on-next-message semantics

This is the field's defining behavior and the reason the describe text says *"Cleared when the user sends the next message."* It is implemented in `processUserInput` (`fI8`), which runs once per user message:

```javascript
// ============================================
// processUserInput - resets alwaysDenyRules.command to THIS message's disallowed tools
// Location: cli_inner_pretty.js:590837-590839
// ============================================

// ORIGINAL (for source lookup):
b_("query_process_user_input_base_start");
let G = await mkz(H, K, _, z, A, Y, f, M, j, w, D, T6(z).mode, J, X, L, P, $, q);
if ((b_("query_process_user_input_base_end"), !j)) c28(z.setToolPermissionContext, G.disallowedTools ?? []);

// READABLE (for understanding):
trace("query_process_user_input_base_start");
const resolved = await resolveUserInputToMessages(input, mode, /* ... */, applyPermissionLayers(context).mode, /* ... */);
trace("query_process_user_input_base_end");
if (!isAlreadyProcessing) {
  // mode defaults to "replace": overwrite deny rules with THIS turn's set.
  // A turn that runs no skill → resolved.disallowedTools is undefined → replace with [] → CLEARED.
  applyToolDenyRules(context.setToolPermissionContext, resolved.disallowedTools ?? []);
}

// Mapping: fI8→processUserInput, mkz→resolveUserInputToMessages, G→resolved, c28→applyToolDenyRules,
//          z→context, j→isAlreadyProcessing, T6→applyPermissionLayers
```

### How the reset works — the state machine

```
turn N:   user types "/restricted-skill"
            └─ resolveUserInputToMessages → runInlineSkill (yA4)
                 └─ c28(..., D, "union")           alwaysDenyRules.command = [..., D]   (skill active)
            └─ fI8: c28(..., G.disallowedTools)    G.disallowedTools = D  → replace → command = [D]
            └─ model runs the turn; tools in D are DENIED

turn N+1: user types a plain message (no skill)
            └─ resolveUserInputToMessages → no skill → resolved.disallowedTools = undefined
            └─ fI8: c28(..., undefined ?? [])       replace → alwaysDenyRules.command = undefined  (CLEARED)
            └─ model runs the turn; D tools allowed again
```

The crucial detail is the **mode**: `runInlineSkill` uses **union** (so a skill *adds* to whatever the live deny-set already is, e.g. operator deny rules), but `processUserInput` uses the **default replace** (third argument omitted). Replace is what makes the field ephemeral: every user message overwrites `alwaysDenyRules.command` with *that message's* resolved disallowed list. Because a non-skill message resolves to `undefined`, the very next user message wipes the prior skill's denial. The deny rule lives exactly one turn.

Note this resets only the `command` sub-array of `alwaysDenyRules`, not the operator's other deny rules — but since both inline-skill union (`c28 "union"`) and `--disallowedTools`/`/permissions` rules land in `alwaysDenyRules.command`, an important subtlety is that a *plain* turn's replace will also blow away CLI/operator command denials that share that channel. In practice the resolved `disallowedTools` for a non-skill turn carries forward the base context's command denials through the resolution pipeline, so a plain turn does not strip operator deny rules; the replace is scoped to the *skill-contributed* delta. (Confidence: medium — the precise re-seeding of operator denials happens inside `resolveUserInputToMessages` (`mkz`), outside this document's anchors.)

### Why this is the opposite of `allowed-tools`

`allowed-tools` is *granting*, so the system surfaces it as a `command_permissions` allow-list and (when narrowing rules are in play) a **permission prompt** — the user is asked to consent to the expanded access. A grant that silently expired could leave the model unable to do work the user expected. By contrast `disallowed-tools` is *restricting*; an expired restriction is the safe default (more tools available, not fewer), so it needs no consent prompt and can vanish on its own. The asymmetry — grants prompt and persist, denials are silent and ephemeral — is the deliberate design of the two fields.

---

## 5. Why a subtractive, ephemeral disallow path (instead of narrowing `allowed-tools`)?

This is the central design question. A skill author who wants "no Bash while my docs-writing skill runs" has two conceivable implementations:

**Alternative A — narrow `allowed-tools`:** require the author to *enumerate every tool except Bash*. This is what the agent `tools` allow-list effectively does. It is brittle: the author must know the full tool set, the set grows over time (Workflow, AskUserQuestion, TaskCreate were added across this very version window), and a stale allow-list silently strips newly-shipped tools. It is also non-composable: an allow-list *replaces*, so combining a skill's narrowing with an operator's existing grants is a set intersection the author can't see.

**Alternative B — additive denial (chosen):** the author lists only the tools to remove. The list is small, self-documenting, robust to new tools (a new tool is allowed unless explicitly denied), and **composes by union** with operator/CLI denials in the shared `alwaysDenyRules.command` channel.

The build chose B, and made it *ephemeral* for three reasons:

1. **Least surprise across turns.** A skill's job is bounded — it answers a question, writes a doc, runs a review. Its restriction should not silently outlive the skill. Tying the lifetime to "the next user message" matches the user's mental model: I asked for this thing, it's done, my tools are back.
2. **No new persistence surface.** Reusing `alwaysDenyRules.command` (the existing permission channel) means no new serialized state, no new "clear skill restrictions" command, no risk of a forgotten denial wedging a session. The reset is free because `processUserInput` already rewrites the deny channel every turn.
3. **Safe-by-default expiry.** As argued above, an expired *denial* fails open (more tools), which is the benign direction, so automatic expiry carries no risk — unlike an expired grant.

### Contrast with the v2.1.88 agent denylist (a true precursor with different semantics)

The agent `disallowedTools` field (v2.1.88, `src/tools/AgentTool/agentToolUtils.ts:122-159`) removes tools from the agent's **tool pool** — they never reach the model at all:

```typescript
// 2.1.88 — resolveAgentTools (src/tools/AgentTool/agentToolUtils.ts:149-159)
const disallowedToolSet = new Set(
  disallowedTools?.map(toolSpec => permissionRuleValueFromString(toolSpec).toolName) ?? [],
);
const allowedAvailableTools = filteredAvailableTools.filter(
  tool => !disallowedToolSet.has(tool.name),
);
```

and the agent prompt advertises this as *"All tools except X, Y, Z"* (`src/tools/AgentTool/prompt.ts:31-33`), and is *ignored if an allow-list is set* — exactly the 2.1.156 agent schema describe text *"Tools removed from the default set. Ignored if `tools` is set."* (cli_inner_pretty.js:184566).

The new skill `disallowed-tools` is **deliberately different**: it does **not** filter the tool pool — the tools remain visible to the model — it installs a **permission-engine deny rule** (`alwaysDenyRules.command`). The model can still *attempt* the tool; the attempt is *denied* by the permission layer. This is the right choice for a transient, per-turn restriction: filtering the pool would require recomputing the tool list and re-sending tool schemas to the API mid-conversation (expensive, cache-busting), whereas a deny rule is a cheap O(1) policy check at tool-use time and reuses the exact path operator deny rules already take.

**Cross-validation summary:**
- `--disallowedTools` CLI flag — **precursor** (2.1.88, `permissionSetup.ts:874-898`). Session-wide, not per-skill. Confidence: high.
- Agent-def `disallowedTools` (pool filtering, ignored-if-allowlist) — **precursor** (2.1.88, `loadAgentsDir.ts:469-472`, `agentToolUtils.ts:149-159`). Stable semantics. Confidence: high.
- Per-skill / per-slash-command `disallowed-tools` frontmatter (permission-layer deny, cleared-on-next-message) — **NEW post-2.1.88** (changelog 2.1.152). `grep -r "disallowed-tools" src/` in 2.1.88 returns only the CLI option. Confidence: high.

---

## 6. Relationship to the effort permission layer (same machinery)

The `disallowed_tools` permission layer is one of several `permissionLayers` kinds; the others (`allowed_tools`, `avoid_prompts`, `effort`, `model`) ride the same array. This matters because the 2.1.143–156 window also fixed the *status-bar effort* display using the very same layer mechanism. `applyPermissionLayers` (`T6`) ignores `effort`/`model` (they're not tool-permission concerns), but `resolveEffortFromLayers` (`k3`, cli_inner_pretty.js:453183-453189) and `buildHookStatusEnv` (`w5`, cli_inner_pretty.js:552312-552327) fold the `effort` layer over the baseline so the displayed effort reflects the *active skill's* effort, not the user's session baseline:

```javascript
// ============================================
// buildHookStatusEnv - status/hook env effort reflects the effort permission layer
// Location: cli_inner_pretty.js:552316-552317
// ============================================

// ORIGINAL (for source lookup):
A = q?.getAppState?.().effortValue;
for (let f of q?.permissionLayers ?? []) if (f.kind === "effort" && f.effort !== void 0) A = f.effort;

// READABLE (for understanding):
let effort = context?.getAppState?.().effortValue;                 // user baseline
for (const layer of context?.permissionLayers ?? [])
  if (layer.kind === "effort" && layer.effort !== undefined) effort = layer.effort;  // skill/command override wins

// Mapping: w5→buildHookStatusEnv, q→context, A→effort, f→layer
```

The takeaway for this doc: `disallowed_tools` is not a one-off — it is a member of a uniform `permissionLayers` design where each layer kind declares a scoped, per-turn override (tools, effort, model, prompt-avoidance). The effort enum `EFFORT_LEVELS` (`dN`) gained `xhigh` in this window (cli_inner_pretty.js:185009), and the same per-skill `effort` frontmatter that produces an `effort` layer (cli_inner_pretty.js:396874) is the sibling of the `disallowed-tools` field that produces a `disallowed_tools` layer.

---

## 7. End-to-end trace (worked example)

A skill `restrict.md` with:

```yaml
---
name: restrict
disallowed-tools: Bash, Edit
context: inline
---
Read the config and summarize it. Do not modify anything.
```

1. **Parse** — `.claude` loader runs `parseSkillFrontmatter` (`cd6`); `fc(H["disallowed-tools"] ?? H.disallowedTools)` → `normalizeToolListOrNull` → `parseToolSpecList("Bash, Edit")` → `["Bash","Edit"]`. `buildSkillCommandObject` (`Ov$`) stores `disallowedTools: ["Bash","Edit"]` on the command object (cli_inner_pretty.js:421574, 421630).
2. **Invoke** — user types `/restrict`. `processUserInput` (`fI8`) resolves the input, reaching `runInlineSkill` (`yA4`).
3. **Inline apply** — `D = parseToolSpecList(["Bash","Edit"])`; `D.length > 0` → `c28(setToolPermissionContext, ["Bash","Edit"], "union")` → `alwaysDenyRules.command = [...existing, "Bash", "Edit"]` (cli_inner_pretty.js:396622).
4. **Per-message reset** — back in `fI8`, `G.disallowedTools = ["Bash","Edit"]`; `c28(setToolPermissionContext, ["Bash","Edit"])` (replace) confirms the deny channel for this turn (cli_inner_pretty.js:590839).
5. **Turn runs** — the model may try Bash/Edit but the permission engine denies them via `alwaysDenyRules.command`; Read/Grep/etc. still work.
6. **Next message** — user types "thanks". `resolveUserInputToMessages` resolves with `disallowedTools = undefined`; `fI8` runs `c28(setToolPermissionContext, [])` (replace) → `alwaysDenyRules.command = undefined`. Bash/Edit are available again. The restriction lived exactly one turn.

Had the same skill declared `context: fork`, step 3 would instead route through `buildForkedSkillContext` (`D0$`): a `{ kind: "disallowed_tools", disallowedTools: ["Bash","Edit"] }` layer (cli_inner_pretty.js:452918) attached to the child, applied by `applyPermissionLayers` (`T6`) → `addDenyRulesToContext` (`fV8`) on every child tool-use (cli_inner_pretty.js:453171, 452899); the layer is discarded with the child when the fork completes, so there is no cross-turn cleanup to do.

---

## Appendix: confidence and unverified edges

- All schema, parse, and runtime line citations were read directly in `cli_inner_pretty.js` for this build (2.1.156).
- **High confidence:** the dual schema spellings (184492-184497), agent-def field (184566), both parser normalizations (414132/414164, 421574/421630), inline `c28` union (396622) and the `c28` mutator (395738-395745), the fork layer build (452918) and application (`T6` 453171 / `fV8` 452899-452902), and the per-message reset (590839).
- **Medium confidence:** the exact re-seeding of operator/CLI command denials on a non-skill turn (whether `resolveUserInputToMessages` / `mkz` re-derives `alwaysDenyRules.command` from the base context) is asserted from the `c28` replace semantics but the seeding itself happens inside `mkz`, which is outside the cited anchors. The user-visible "cleared on next message" behavior for *skill-contributed* denials is verified; the interaction with persistent operator denials is inferred.
- The readable variable names in the snippets are reconstructions for understanding; the ORIGINAL blocks are verbatim from the bundle and are the authority for source lookup.
