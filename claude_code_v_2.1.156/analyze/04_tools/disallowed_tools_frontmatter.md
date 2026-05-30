# disallowed-tools Frontmatter: Removing Tools While Skill/Command Active

> **Scope:** The v2.1.143–156 tools-subsystem delta that lets a skill or slash-command
> frontmatter *remove* tools from the model for the duration of that skill/command, via a
> new `disallowed-tools` field. This is the deny-side mirror of the existing `allowed-tools`
> grant. Through v2.1.88 the `disallowed-tools` knob existed **only** for *agents*
> (`AgentDefinitionSchema.disallowedTools`) and as CLI/SDK flags (`--disallowed-tools`); the
> **skill/slash-command frontmatter** form documented here is **NEW post-2.1.88**.
>
> This doc traces the field end to end: the Zod schema (`cli_inner_pretty.js:184489-184497`),
> the two parse sites that lift it off frontmatter (`cli_inner_pretty.js:414132/414164`,
> `cli_inner_pretty.js:421574`), the **inline** application path that appends to
> `alwaysDenyRules.command` via `c28(...,"union")` (`cli_inner_pretty.js:395738-395744`,
> `396621-396622`), the **fork** application path that emits a `{kind:"disallowed_tools"}`
> permission layer (`cli_inner_pretty.js:452899-452925`) consumed by
> `T6`/`fV8` (`cli_inner_pretty.js:453160-453181`, `452899-452902`), and the
> **clear-on-next-message** mechanism in `fI8` (`cli_inner_pretty.js:590839`).
>
> **Source:** `cli_inner_pretty.js` (Claude Code v2.1.156 bundle).
> **Cross-validation:** `/lyz/codespace/3rd/claude-code/src/` (v2.1.88) —
> `entrypoints/sdk/coreSchemas.ts:1122`, `skills/loadSkillsDir.ts:376-398`,
> `utils/plugins/loadPluginCommands.ts`.

---

## Related Symbols

> Symbol mappings live in the central index files:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools, Agent Loop, LLM API, Subagent, State)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skills, Slash Commands, Permissions layering)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Permissions, Prompt, Telemetry/Gates)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key symbols in this document:

- `frontmatterToolListSchema` (`BjH`) — Zod union `string | string[]` reused for every tool-list frontmatter field (cli_inner_pretty.js:184468)
- `commandFrontmatterSchema` (`GL5`) — base slash-command/skill frontmatter object schema; declares both `disallowed-tools` and its canonical alias `disallowedTools` (cli_inner_pretty.js:184480-184515)
- `skillFrontmatterSchema` (`aL6`) — skill schema; `.extend()`s `GL5` with `when_to_use`/`context`/`agent`/`paths`/`hooks` (cli_inner_pretty.js:184517-184555)
- `agentFrontmatterSchema` (`TL5`) — agent schema; has only camelCase `disallowedTools` (the pre-2.1.88 form) (cli_inner_pretty.js:184556-184585)
- `parsePluginCommandMetadata` (containing fn at `cli_inner_pretty.js:~414100`) — plugin command/skill loader; reads `Y["disallowed-tools"] ?? Y.disallowedTools` into `disallowedTools` (cli_inner_pretty.js:414132, 414164)
- `parseSkillMetadata` (`cd6`) — local-dir skill metadata builder; reads `H["disallowed-tools"] ?? H.disallowedTools` (cli_inner_pretty.js:421555-421590, field at 421574)
- `splitToolSpecList` (`IS`) — paren-aware splitter for `"Bash(git status), Edit"`-style tool lists (cli_inner_pretty.js:442850-442882)
- `parseToolList` (`fc`) — normalizes a frontmatter value (`string | string[] | undefined`) to `string[]`, collapsing `*` to `["*"]` (cli_inner_pretty.js:443196-443200)
- `normalizeToolListOrNull` (`tZ4`) — inner normalizer fc/hDH share; returns `null` for nullish input (cli_inner_pretty.js:443179-443189)
- `dedupePreserveOrder` (`aq`) — `[...new Set(H)]` order-preserving dedup used by all rule appenders (cli_inner_pretty.js:40716-40718)
- `appendOrReplaceCommandDenyRules` (`c28`) — inline-path setter; "union" appends, default "replace" overwrites `alwaysDenyRules.command` (cli_inner_pretty.js:395738-395744)
- `appendCommandDenyRules` (`fV8`) — pure helper appending to `toolPermissionContext.alwaysDenyRules.command` with dedup (cli_inner_pretty.js:452899-452902)
- `appendCommandAllowRules` (`YV8`) — allow-side mirror of `fV8` (cli_inner_pretty.js:452892-452897)
- `wrapAppStateWithToolLayers` (`tT4`) — wraps a `getAppState` so its `toolPermissionContext` has the command's allow+deny lists applied (cli_inner_pretty.js:452903-452909)
- `buildForkedCommandContext` (`D0$`) — fork-path builder; produces `contextLayers` including `{kind:"disallowed_tools"}` (cli_inner_pretty.js:452910-452926)
- `computeEffectivePermissionContext` (`T6`) — folds `permissionLayers` (allowed/disallowed/avoid/effort/model) onto the base `toolPermissionContext` (cli_inner_pretty.js:453162-453182)
- `applyPermissionLayers` (`hV$`) — appends layers to a context and tracks a model override (cli_inner_pretty.js:453193-453205)
- `processCommandToMessages` (`yA4`) — inline command/skill expander; calls `c28(...,"union")` with the command's disallowed list (cli_inner_pretty.js:396582-396652)
- `processPromptSlashCommand` (`hN_`) — thin wrapper over `yA4` for user-typed prompt slash commands (cli_inner_pretty.js:396573-396581)
- `processUserInput` (`fI8`) — user-turn entry; replaces `alwaysDenyRules.command` with this turn's disallowed list (clear-on-next-message) (cli_inner_pretty.js:590814-590841)
- `executeForkedSlashCommand` (`NN_`) — fork-path command runner; threads `contextLayers` into the subagent's `permissionLayers` (cli_inner_pretty.js:396016-396084)
- `executeForkedSkill` (`mL_`, called at `cli_inner_pretty.js:350735`) — fork-path skill runner; same layer threading (cli_inner_pretty.js:350443-350470)
- `validateFrontmatterShadow` (`qkH`) — emits `tengu_frontmatter_shadow_*` telemetry on schema mismatch (cli_inner_pretty.js:184453-184463)

---

## TL;DR

Skill/slash-command frontmatter has long carried `allowed-tools:` to **grant** extra tool
permissions while the file is active. v2.1.143+ adds the symmetric **`disallowed-tools:`**
field, which **removes** tools from the model for the lifetime of that skill/command:

```yaml
---
description: "Read-only audit of the codebase"
disallowed-tools: "Edit, Write, Bash(git push:*)"
---
```

The schema describes its own lifecycle precisely (cli_inner_pretty.js:184494-184496):
*"Tools removed from the model while this file is active. Comma-separated string or YAML
list. **Cleared when the user sends the next message.**"*

Two parallel application paths implement that one sentence, depending on where the skill/command runs:

1. **Inline (`context: inline`, the default).** The command expands into the *current*
   conversation. The disallowed list is appended (union, deduped) onto the persistent
   `appState.toolPermissionContext.alwaysDenyRules.command` via `c28(...,"union")`
   (cli_inner_pretty.js:396621-396622). It is **cleared on the next user turn** because
   `fI8` calls `c28(setter, thisTurn.disallowedTools ?? [])` in **replace** mode at the top
   of every user input (cli_inner_pretty.js:590839) — a plain message carries no
   disallowed list, so the prior skill's deny rules are overwritten with `[]`.

2. **Fork (`context: fork`).** The command runs as a *subagent*. Instead of mutating
   persistent state, `D0$` builds a `{kind:"disallowed_tools"}` **context layer**
   (cli_inner_pretty.js:452918) that is folded onto the subagent's derived
   `toolPermissionContext` by `T6` → `fV8` (cli_inner_pretty.js:453171-453172, 452899-452902).
   The layer lives only on the subagent's per-call `toolUseContext.permissionLayers`, so it
   evaporates automatically when the fork completes — no explicit clear needed.

In both cases the actual enforcement is "append to `alwaysDenyRules.command`": deny rules
beat allow rules in the policy engine, so a disallowed tool/pattern can never be invoked even
if a broader allow rule (or `--dangerously-skip-permissions`) would otherwise have let it
through.

**Confidence:** high for the inline path, fork path, and clear-on-next-message mechanism
(all read directly). high that the *skill/command frontmatter* field is new post-2.1.88
(2.1.88 skill/command loaders parse only `allowed-tools`).

---

## 1. The schema: `disallowed-tools` + a canonical alias

`disallowed-tools` is declared on the base command frontmatter schema `commandFrontmatterSchema`
(`GL5`), which the skill schema `aL6` extends. Both the kebab-case documented form and a
camelCase **canonical alias** are accepted.

```javascript
// ============================================
// commandFrontmatterSchema (disallowed-tools fields) - Zod schema for skill/command frontmatter
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
"allowed-tools": frontmatterToolListSchema()
  .optional()
  .describe("Tools available to the model while this file is active. Comma-separated string or YAML list."),
"disallowed-tools": frontmatterToolListSchema()
  .optional()
  .describe(
    "Tools removed from the model while this file is active. Comma-separated string or YAML list. Cleared when the user sends the next message.",
  ),
disallowedTools: frontmatterToolListSchema()
  .optional()
  .describe("Canonical (normalized) alias of `disallowed-tools`."),

// Mapping: BjH→frontmatterToolListSchema
```

`frontmatterToolListSchema` (`BjH`) is a single reusable union — `string | string[]` — so
every tool-list field (`allowed-tools`, `disallowed-tools`, agent `tools`/`skills`, command
`arguments`, skill `paths`) accepts either a comma-separated string **or** a YAML sequence
(cli_inner_pretty.js:184468):

```javascript
// ============================================
// frontmatterToolListSchema - reusable string|string[] union for tool-list fields
// Location: cli_inner_pretty.js:184465-184468
// ============================================

// ORIGINAL (for source lookup):
var oL6 = () => y.union([y.string(), y.number(), y.boolean(), y.null()]),
  ...
  BjH = () => y.union([oL6(), y.array(y.string())]),

// READABLE (for understanding):
const scalarSchema = () => z.union([z.string(), z.number(), z.boolean(), z.null()]);
const frontmatterToolListSchema = () => z.union([scalarSchema(), z.array(z.string())]);

// Mapping: oL6→scalarSchema, BjH→frontmatterToolListSchema, y→z (zod)
```

### Why two field names (`disallowed-tools` *and* `disallowedTools`)?

**What it does:** Accepts both spellings of the same concept and prefers the kebab form.

**Why this approach:**
- `disallowed-tools` is the **documented, user-facing** form, matching `allowed-tools`,
  `argument-hint`, `disable-model-invocation`, etc. — all kebab-case in YAML frontmatter.
- `disallowedTools` (camelCase) is documented as the *"canonical (normalized) alias"*
  (cli_inner_pretty.js:184497). It exists for two reasons: (1) the **agent** schema `TL5`
  has only `disallowedTools` (cli_inner_pretty.js:184566) — the pre-2.1.88 spelling — so
  accepting it on commands/skills too keeps a single mental model; (2) tooling that
  generates frontmatter programmatically (e.g. dream-proposal skill authoring) emits the
  JS-friendly camelCase.
- Every read site uses the nullish-coalescing precedence `Y["disallowed-tools"] ??
  Y.disallowedTools` (cli_inner_pretty.js:414132, 421574) — kebab wins, camelCase is the
  fallback. They are **not** merged; the kebab form, if present, fully shadows the alias.

**Key insight:** This dual-name acceptance is paired with a *shadow validator*
`validateFrontmatterShadow` (`qkH`, cli_inner_pretty.js:184453-184463) that re-parses the
raw frontmatter against the schema and fires `tengu_frontmatter_shadow_unknown_key` /
`tengu_frontmatter_shadow_mismatch` telemetry (cli_inner_pretty.js:184458, 184461) when a
field is unrecognized or mistyped. So Anthropic can observe in the wild how often authors
reach for `disallowedTools` vs `disallowed-tools`, or fat-finger a variant, without breaking
the parse (the validator swallows errors in a `try/catch`).

---

## 2. Two parse sites lift it off frontmatter

The field is read in two loaders, both using the same `?? alias` precedence and the same
list parser `fc`.

**Plugin command/skill loader** (`cli_inner_pretty.js:414132`, output at `414164`):

```javascript
// ============================================
// parsePluginCommandMetadata (disallowed-tools handling) - plugin loader reading disallowed-tools
// Location: cli_inner_pretty.js:414129-414164
// ============================================

// ORIGINAL (for source lookup):
J = Y["allowed-tools"],
X = typeof J === "string" ? D(J) : Array.isArray(J) ? J.map((U) => (typeof U === "string" ? D(U) : U)) : J,
L = fc(X),
P = fc(Y["disallowed-tools"] ?? Y.disallowedTools),
...
return {
  type: "prompt",
  ...
  allowedTools: L,
  disallowedTools: P.length > 0 ? P : void 0,
  ...

// READABLE (for understanding):
const rawAllowed = frontmatter["allowed-tools"];
// allowed-tools first runs ${CLAUDE_PLUGIN_ROOT}/${CLAUDE_SKILL_DIR} substitution via D(...)
const substitutedAllowed =
  typeof rawAllowed === "string" ? substitute(rawAllowed)
  : Array.isArray(rawAllowed) ? rawAllowed.map((s) => (typeof s === "string" ? substitute(s) : s))
  : rawAllowed;
const allowedTools = parseToolList(substitutedAllowed);
const disallowedTools = parseToolList(frontmatter["disallowed-tools"] ?? frontmatter.disallowedTools);
...
return {
  type: "prompt",
  ...
  allowedTools,
  disallowedTools: disallowedTools.length > 0 ? disallowedTools : undefined,
  ...
};

// Mapping: Y→frontmatter, J→rawAllowed, D→substitute, X→substitutedAllowed, L→allowedTools, P→disallowedTools, fc→parseToolList
```

**Local-dir skill metadata builder** `parseSkillMetadata` (`cd6`, `cli_inner_pretty.js:421574`):

```javascript
// ============================================
// parseSkillMetadata (disallowed-tools handling) - local skill metadata builder
// Location: cli_inner_pretty.js:421573-421574
// ============================================

// ORIGINAL (for source lookup):
allowedTools: fc(H["allowed-tools"]),
disallowedTools: fc(H["disallowed-tools"] ?? H.disallowedTools),

// READABLE (for understanding):
allowedTools: parseToolList(frontmatter["allowed-tools"]),
disallowedTools: parseToolList(frontmatter["disallowed-tools"] ?? frontmatter.disallowedTools),

// Mapping: H→frontmatter, fc→parseToolList
```

One subtle asymmetry worth noting: the **plugin** loader coerces an empty disallowed list to
`undefined` (`P.length > 0 ? P : void 0`, cli_inner_pretty.js:414164) so the field disappears
when empty, whereas `parseSkillMetadata` stores the raw `[]`. Downstream both are guarded by
`if (D.length > 0)` / `if (A.length === 0)` checks, so the difference is cosmetic.

### `fc` / `IS`: parsing `"Bash(git status), Edit"` correctly

**What it does:** Turns a frontmatter value into a clean `string[]` of tool specifications,
splitting on commas/whitespace **but not inside parentheses** so that
`Bash(git status, push)` stays one spec.

**How it works** (`parseToolList` → `normalizeToolListOrNull` → `splitToolSpecList`):

```javascript
// ============================================
// parseToolList / normalizeToolListOrNull - frontmatter value -> string[] of tool specs
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
  if (value === undefined || value === null) return null;     // distinguishes "absent" from "empty"
  if (!value) return [];                                       // "" / false / 0 -> empty list
  let items = [];
  if (typeof value === "string") items = [value];             // single comma-separated string
  else if (Array.isArray(value)) items = value.filter((s) => typeof s === "string");
  if (items.length === 0) return [];
  const specs = splitToolSpecList(items);
  if (specs.includes("*")) return ["*"];                      // wildcard collapses to ["*"]
  return specs;
}
function parseToolList(value) {
  const normalized = normalizeToolListOrNull(value);
  return normalized === null ? [] : normalized;               // fc flattens null -> []
}

// Mapping: tZ4→normalizeToolListOrNull, fc→parseToolList, IS→splitToolSpecList, H→value, $→items, q→specs
```

`splitToolSpecList` (`IS`) is the paren-aware character scanner that makes
`Bash(...)`-style specs survive comma-splitting (cli_inner_pretty.js:442850-442882): it
tracks a "`_` = inside parens" flag and, on `,` or space, only ends the current token when
the flag is false. So `"Bash(git status), Edit"` → `["Bash(git status)", "Edit"]`, while a
plain `"Edit, Write"` → `["Edit", "Write"]`.

**Why this approach:** The deny list must accept the *same grammar* as Claude Code's
permission rules — `ToolName`, `ToolName(specifier)`, `ToolName(prefix:*)`. A naive
`split(",")` would shatter `Bash(git status, log)`. The shared `IS` scanner guarantees the
frontmatter deny list and CLI `--disallowed-tools` (which also uses `IS`, see
`cli_inner_pretty.js:442893`) parse identically.

---

## 3. The deny-rule appenders: `fV8`, `YV8`, `c28`

The lowest layer is a pair of pure helpers that append to the command-channel allow/deny rule
arrays. Both dedup with `dedupePreserveOrder` (`aq` = `[...new Set(H)]`,
cli_inner_pretty.js:40716-40718).

```javascript
// ============================================
// appendCommandAllowRules / appendCommandDenyRules - pure rule appenders on toolPermissionContext
// Location: cli_inner_pretty.js:452892-452902
// ============================================

// ORIGINAL (for source lookup):
function YV8(H, $) {
  if ($.length === 0) return H;
  return { ...H, alwaysAllowRules: { ...H.alwaysAllowRules, command: aq([...(H.alwaysAllowRules.command || []), ...$]) } };
}
function fV8(H, $) {
  if ($.length === 0) return H;
  return { ...H, alwaysDenyRules: { ...H.alwaysDenyRules, command: aq([...(H.alwaysDenyRules.command || []), ...$]) } };
}

// READABLE (for understanding):
function appendCommandAllowRules(ctx, toolSpecs) {
  if (toolSpecs.length === 0) return ctx;                       // no-op fast path
  return { ...ctx, alwaysAllowRules: { ...ctx.alwaysAllowRules, command: dedupePreserveOrder([...(ctx.alwaysAllowRules.command || []), ...toolSpecs]) } };
}
function appendCommandDenyRules(ctx, toolSpecs) {
  if (toolSpecs.length === 0) return ctx;                       // no-op fast path
  return { ...ctx, alwaysDenyRules: { ...ctx.alwaysDenyRules, command: dedupePreserveOrder([...(ctx.alwaysDenyRules.command || []), ...toolSpecs]) } };
}

// Mapping: YV8→appendCommandAllowRules, fV8→appendCommandDenyRules, H→ctx, $→toolSpecs, aq→dedupePreserveOrder
```

`c28` (`appendOrReplaceCommandDenyRules`) is the **stateful** counterpart used by the inline
path. It takes a React-style state setter and a mode (`"union"` to append, default
`"replace"` to overwrite) and is the single point that mutates the *persistent* deny list:

```javascript
// ============================================
// appendOrReplaceCommandDenyRules - stateful setter for alwaysDenyRules.command (union | replace)
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
function appendOrReplaceCommandDenyRules(setToolPermissionContext, toolSpecs, mode = "replace") {
  setToolPermissionContext((ctx) => {
    const prev = ctx.alwaysDenyRules.command;
    const next = mode === "union"
      ? dedupePreserveOrder([...(prev ?? []), ...toolSpecs])   // append (skill/command activates)
      : [...toolSpecs];                                        // overwrite (next user turn)
    // referential-equality bail-out: if list is unchanged, return the same object (no re-render)
    if ((prev?.length ?? 0) === next.length && (prev ?? []).every((s, i) => s === next[i])) return ctx;
    return { ...ctx, alwaysDenyRules: { ...ctx.alwaysDenyRules, command: next.length > 0 ? next : undefined } };
  });
}

// Mapping: c28→appendOrReplaceCommandDenyRules, H→setToolPermissionContext, $→toolSpecs, q→mode, K→ctx, _→prev, z→next, aq→dedupePreserveOrder
```

**Key insight — the identity bail-out (cli_inner_pretty.js:395742).** Before producing a new
context object, `c28` compares the existing list element-by-element with the computed one and
returns the *same reference* if they match. Because `toolPermissionContext` flows through
React state (`setToolPermissionContext`), returning an unchanged reference suppresses a
re-render of the whole permission UI. This matters for the clear-on-next-message path: when
the user sends an ordinary message and the deny list is already empty, `c28(setter, [])`
in replace mode sees `prev=[]`/`undefined` and `next=[]`, so it is a true no-op — every keystroke
turn doesn't churn state.

---

## 4. Inline path: append now, clear next turn

For the default `context: inline` case, the command/skill expands into the current
conversation through `processCommandToMessages` (`yA4`), reached from
`processPromptSlashCommand` (`hN_`, cli_inner_pretty.js:396573-396581). The disallowed list
is applied **directly to the live app state**:

```javascript
// ============================================
// processCommandToMessages (inline disallowed-tools application) - applies deny rules then expands command
// Location: cli_inner_pretty.js:396619-396651
// ============================================

// ORIGINAL (for source lookup):
let j = kA4(H, $),
  w = IS(H.allowedTools ?? []),
  D = IS(H.disallowedTools ?? []);
if (D.length > 0) c28(q.setToolPermissionContext, D, "union");
...
return {
  messages: [ T8({ content: j, uuid: z }), T8({ content: J, isMeta: !0 }), ...X, ...A,
    VK({ type: "command_permissions", allowedTools: w, model: H.model }) ],
  shouldQuery: !0,
  allowedTools: w,
  disallowedTools: D,
  model: H.model,
  effort: H.getEffort?.($) ?? H.effort,
  command: H,
};

// READABLE (for understanding):
const promptBlocks = renderCommandPrompt(command, args);
const allowedTools = splitToolSpecList(command.allowedTools ?? []);
const disallowedTools = splitToolSpecList(command.disallowedTools ?? []);
if (disallowedTools.length > 0)
  appendOrReplaceCommandDenyRules(ctx.setToolPermissionContext, disallowedTools, "union"); // APPEND
...
return {
  messages: [ /* command prompt + expanded content + command_permissions marker */ ],
  shouldQuery: true,
  allowedTools,
  disallowedTools,      // <-- propagated up so fI8 can replace the deny list next turn
  model: command.model,
  effort: command.getEffort?.(args) ?? command.effort,
  command,
};

// Mapping: yA4→processCommandToMessages, H→command, $→args, D→disallowedTools, w→allowedTools, IS→splitToolSpecList, c28→appendOrReplaceCommandDenyRules, q→ctx
```

Note the asymmetry with `allowed-tools`: the **allowed** list is *not* applied via `c28` here
— it is carried as a `command_permissions` message marker
(`VK({type:"command_permissions", allowedTools: w, ...})`, cli_inner_pretty.js:396643) and a
returned `allowedTools` field, which the query loop turns into an `{kind:"allowed_tools"}`
layer. Only the **disallowed** list mutates `alwaysDenyRules.command` immediately. The reason
is enforcement timing — see "Why deny is eager, allow is lazy" below.

### The clear-on-next-message mechanism

`processUserInput` (`fI8`) is the front door for *every* user turn. Right after it processes
the input (which runs any slash command via `mkz` → `yN_` → `yA4`, returning that turn's
`disallowedTools`), it **replaces** the persistent deny list:

```javascript
// ============================================
// processUserInput (clear-on-next-message) - replace alwaysDenyRules.command with this turn's deny list
// Location: cli_inner_pretty.js:590837-590840
// ============================================

// ORIGINAL (for source lookup):
b_("query_process_user_input_base_start");
let G = await mkz(H, K, _, z, A, Y, f, M, j, w, D, T6(z).mode, J, X, L, P, $, q);
if ((b_("query_process_user_input_base_end"), !j)) c28(z.setToolPermissionContext, G.disallowedTools ?? []);

// READABLE (for understanding):
mark("query_process_user_input_base_start");
const result = await processInputToMessages(input, mode, /* ... */, computeEffectivePermissionContext(ctx).mode, /* ... */);
mark("query_process_user_input_base_end");
if (!isAlreadyProcessing)
  // default mode = "replace": overwrite the deny list with THIS turn's disallowed tools.
  // A plain user message has result.disallowedTools === undefined -> replaces with [] -> clears the prior skill's deny rules.
  appendOrReplaceCommandDenyRules(ctx.setToolPermissionContext, result.disallowedTools ?? []);

// Mapping: fI8→processUserInput, G→result, mkz→processInputToMessages, j→isAlreadyProcessing, c28→appendOrReplaceCommandDenyRules, z→ctx, T6→computeEffectivePermissionContext
```

**How the state machine clears the field, step by step:**

```
Turn N   : user types "/audit"  (frontmatter disallowed-tools: "Edit, Write")
           fI8 -> mkz -> yA4
             yA4: c28(setter, ["Edit","Write"], "union")   => alwaysDenyRules.command = ["Edit","Write"]
             yA4 returns { disallowedTools: ["Edit","Write"], ... }
           fI8 (post-process): c28(setter, ["Edit","Write"])  [replace]  => stays ["Edit","Write"]
           model now runs the /audit body WITHOUT Edit/Write.

Turn N+1 : user types a normal message "now refactor foo()"
           fI8 -> mkz   (no slash command -> no yA4 deny application)
             mkz returns { disallowedTools: undefined, ... }
           fI8 (post-process): c28(setter, [] )  [replace]  => alwaysDenyRules.command = undefined
           Edit/Write are AVAILABLE again.  <-- "Cleared when the user sends the next message."
```

The `!isAlreadyProcessing` guard (`!j`, cli_inner_pretty.js:590839) is what scopes this to a
genuine top-level user turn. When `fI8` is re-entered for nested processing (e.g. a queued
`nextInput`, or hook-driven re-expansion), `j` is true and the deny list is left untouched —
otherwise a mid-turn re-entry would wipe a deny list that the active command still depends on.

**Why this approach (replace-on-turn instead of explicit teardown):**
- There is no reliable "skill finished" event for an inline skill — its content is just
  spliced into the conversation and the model keeps going. So a teardown callback would be
  fragile. Tying the lifetime to "until the next user message" gives a crisp, observable
  boundary the user understands ("my next message resets it").
- Using **replace** (not "remove these specific tools") means the per-turn deny list is
  *declarative*: whatever the current turn declares is the entire deny list. This composes
  cleanly when a user types another `/command` with its own `disallowed-tools` — the new
  list simply replaces the old one rather than accumulating stale entries from prior skills.
- The cost is that two inline skills cannot stack their deny lists across turns. Within one
  turn they *can* (the `"union"` append in `yA4` accumulates), but a fresh user turn always
  resets. This is the intended semantics, matching the schema text exactly.

**Tradeoff / sharp edge:** Because the deny rule is written to the *persistent*
`toolPermissionContext`, it is visible to **all** tool calls in that turn, not just calls the
skill itself makes. That is the whole point (the model must not reach for a removed tool
mid-turn), but it means an inline skill's `disallowed-tools` also affects any tool calls the
user might trigger in the same turn before sending the next message.

---

## 5. Fork path: a `{kind:"disallowed_tools"}` permission layer

When the skill/command declares `context: fork`, it runs as a **subagent**, and mutating the
parent's persistent state would be wrong (the parent must keep its tools). Instead,
`buildForkedCommandContext` (`D0$`) packages the allow/disallow lists as *context layers* and
as a *wrapped getAppState*:

```javascript
// ============================================
// buildForkedCommandContext - builds disallowed_tools context layer for forked skill/command
// Location: cli_inner_pretty.js:452910-452926
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
async function buildForkedCommandContext(command, args, ctx) {
  const skillContent = (await command.getPromptForCommand(args, ctx))
    .map((b) => (b.type === "text" ? b.text : "")).join("\n");
  const allowedTools = splitToolSpecList(command.allowedTools ?? []);
  const disallowedTools = splitToolSpecList(command.disallowedTools ?? []);
  const wrappedGetAppState = wrapAppStateWithToolLayers(ctx.getAppState, allowedTools, disallowedTools);
  const contextLayers = [
    ...(allowedTools.length === 0 ? [] : [{ kind: "allowed_tools", allowedTools }]),
    ...(disallowedTools.length === 0 ? [] : [{ kind: "disallowed_tools", disallowedTools }]),   // <-- the new deny layer
  ];
  const agentType = command.agent ?? "general-purpose";
  const candidates = ctx.options.agentDefinitions.activeAgents;
  const baseAgent =
    candidates.find((a) => a.agentType === agentType)
    ?? candidates.find((a) => a.agentType === "general-purpose")
    ?? candidates[0];
  if (!baseAgent) throw Error("No agent available for forked execution");
  const promptMessages = [makeUserMessage({ content: skillContent })];
  return { skillContent, modifiedGetAppState: wrappedGetAppState, contextLayers, baseAgent, promptMessages };
}

// Mapping: D0$→buildForkedCommandContext, H→command, $→args, q→ctx, _→skillContent, z→allowedTools, A→disallowedTools, Y→wrappedGetAppState, f→contextLayers, j→baseAgent, w→promptMessages, IS→splitToolSpecList, tT4→wrapAppStateWithToolLayers
```

`wrapAppStateWithToolLayers` (`tT4`) belt-and-suspenders applies the same lists onto the
*wrapped* `getAppState` so any code that reads app state directly (not via layers) still sees
the narrowed context (cli_inner_pretty.js:452903-452909): it returns a thunk that calls the
original `getAppState()` and runs its `toolPermissionContext` through
`appendCommandDenyRules(appendCommandAllowRules(...))`.

The `contextLayers` flow into the subagent's `toolUseContext.permissionLayers` at the
fork runners — `executeForkedSlashCommand` (`NN_`, cli_inner_pretty.js:396033, 396077) and
`executeForkedSkill` (`mL_`, cli_inner_pretty.js:350461):

```javascript
// ============================================
// executeForkedSkill (layer threading) - merge contextLayers into subagent permissionLayers
// Location: cli_inner_pretty.js:350443-350462
// ============================================

// ORIGINAL (for source lookup):
let { modifiedGetAppState: L, contextLayers: P, baseAgent: Z, promptMessages: W, skillContent: G } = await D0$(H, q || "", K),
  ...
  for await (let I of WS({ agentDefinition: v, promptMessages: W,
    toolUseContext: { ...K, getAppState: L,
      permissionLayers: P.length > 0 ? [...(K.permissionLayers ?? []), ...P] : K.permissionLayers },
    ... }))

// READABLE (for understanding):
const { modifiedGetAppState, contextLayers, baseAgent, promptMessages, skillContent } =
  await buildForkedCommandContext(skill, args || "", ctx);
...
for await (const ev of runAgent({ agentDefinition: agent, promptMessages,
  toolUseContext: { ...ctx, getAppState: modifiedGetAppState,
    permissionLayers: contextLayers.length > 0
      ? [...(ctx.permissionLayers ?? []), ...contextLayers]   // STACK onto parent's layers
      : ctx.permissionLayers },
  ... }))

// Mapping: D0$→buildForkedCommandContext, L→modifiedGetAppState, P→contextLayers, Z/v→baseAgent, W→promptMessages, WS→runAgent, K→ctx
```

### `T6`: how layers become an effective deny list

`computeEffectivePermissionContext` (`T6`) is the single fold that turns the base app-state
`toolPermissionContext` plus the stack of `permissionLayers` into the *effective* context the
permission engine consults. The `disallowed_tools` case routes straight into `fV8`:

```javascript
// ============================================
// computeEffectivePermissionContext - fold permissionLayers onto base toolPermissionContext
// Location: cli_inner_pretty.js:453162-453182
// ============================================

// ORIGINAL (for source lookup):
function T6(H) {
  let $ = H.getAppState().toolPermissionContext,
    q = H.permissionLayers;
  if (!q) return $;
  for (let K of q)
    switch (K.kind) {
      case "allowed_tools":   $ = YV8($, [...K.allowedTools]); break;
      case "disallowed_tools": $ = fV8($, [...K.disallowedTools]); break;
      case "avoid_prompts":   if (!$.shouldAvoidPermissionPrompts) $ = { ...$, shouldAvoidPermissionPrompts: !0 }; break;
      case "effort":
      case "model": break;
    }
  return $;
}

// READABLE (for understanding):
function computeEffectivePermissionContext(ctx) {
  let permCtx = ctx.getAppState().toolPermissionContext;     // base (persistent) context
  const layers = ctx.permissionLayers;
  if (!layers) return permCtx;                                // no layers -> base unchanged
  for (const layer of layers)
    switch (layer.kind) {
      case "allowed_tools":    permCtx = appendCommandAllowRules(permCtx, [...layer.allowedTools]); break;
      case "disallowed_tools": permCtx = appendCommandDenyRules(permCtx, [...layer.disallowedTools]); break;  // <-- deny layer
      case "avoid_prompts":    if (!permCtx.shouldAvoidPermissionPrompts) permCtx = { ...permCtx, shouldAvoidPermissionPrompts: true }; break;
      case "effort":
      case "model": break;                                    // handled by k3 / hV$, not here
    }
  return permCtx;
}

// Mapping: T6→computeEffectivePermissionContext, H→ctx, $→permCtx, q→layers, K→layer, YV8→appendCommandAllowRules, fV8→appendCommandDenyRules
```

Layers are **applied in order** and `fV8` *appends*, so multiple nested forks each contribute
their deny rules cumulatively. The deny layer is purely derived — it lives on the per-call
`toolUseContext` (`applyPermissionLayers`/`hV$`, cli_inner_pretty.js:453193-453205, also
re-applies layers after a tool emits new ones at cli_inner_pretty.js:410566, 410610, 447750)
— so when the forked subagent's `toolUseContext` is discarded, the deny rules vanish with no
explicit clear. That is the fork-path analogue of "cleared when the user sends the next message."

**Why two mechanisms?** Inline skills mutate persistent state because their effects must
outlive the single `getPromptForCommand` call and span the whole turn's tool calls in the
*main* conversation; the layer approach can't reach the main loop's persisted context.
Forked skills run in an isolated subagent, so a non-persistent, auto-expiring **layer** is
both safer (no parent mutation) and self-cleaning (no clear-on-next-message bookkeeping).

---

## 6. Why deny is eager but allow is lazy

A recurring asymmetry in the inline path: `disallowed-tools` is applied **eagerly** to
`alwaysDenyRules.command` the moment the command expands (cli_inner_pretty.js:396622), while
`allowed-tools` is carried as a deferred `command_permissions` marker / returned field
(cli_inner_pretty.js:396643-396646) that the query loop materializes into an
`{kind:"allowed_tools"}` layer.

**Why:** Permission semantics. **Deny must be in force before the very first tool call** the
skill body triggers — if the model immediately tries `Edit` and the deny rule isn't yet
written, the call could be permitted. **Allow** is only a *relaxation*; if it lands a beat
late the worst case is one extra permission prompt, never an unsafe call. So the safe-by-default
choice is: apply deny synchronously, defer allow. This mirrors the policy engine's own
precedence — deny rules always beat allow rules — pushed up into *when* each list is installed.

---

## 7. Cross-validation against v2.1.88

| Aspect | v2.1.88 | v2.1.156 | Confidence |
|--------|---------|----------|------------|
| `disallowed-tools` on **skill/command** frontmatter | **absent** — loaders parse only `allowed-tools` (`loadSkillsDir.ts:242-243`, `loadPluginCommands.ts:259`) | present (`cli_inner_pretty.js:184492`) | high (NEW) |
| `disallowedTools` on **agent** frontmatter | present (`coreSchemas.ts:1122`, `loadAgentsDir.ts:77`) | present (`cli_inner_pretty.js:184566`) | high (pre-existing) |
| `--disallowed-tools` CLI flag | present (`main.tsx`, `permissionSetup.ts:898`) | present (parser `IS` shared) | high (pre-existing) |
| Inline application = append to `alwaysDenyRules.command` | **no precursor** — `disallowed-tools` didn't exist for skills | `c28(...,"union")` (`cli_inner_pretty.js:396622`) | high (NEW) |
| Inline `allowed-tools` application | **replace** `alwaysAllowRules.command` inside wrapped `getAppState` (`loadSkillsDir.ts:384-388`) | layered / marker-based (`{kind:"allowed_tools"}`) | medium (refactored) |
| Permission **layer** abstraction (`permissionLayers` / `contextLayers`) | **absent** — no `contextLayers`, no `permissionLayers` in src | core mechanism (`T6`, `hV$`, `D0$`) | high (NEW) |
| Clear-on-next-message | n/a (no inline disallowed list to clear) | `fI8` replace at `cli_inner_pretty.js:590839` | high (NEW) |

> The v2.1.88 inline skill applied `allowed-tools` by **overwriting**
> `alwaysAllowRules.command` inside a per-call wrapped `getAppState`
> (`/lyz/codespace/3rd/claude-code/src/skills/loadSkillsDir.ts:382-391`). There was no
> `alwaysDenyRules.command` append for skills, no `disallowed-tools` field, and no
> `permissionLayers`/`contextLayers` concept anywhere in `src/`. The entire deny-side
> frontmatter feature, plus the layer machinery that the fork path rides on, is a
> post-2.1.88 addition.

**Bottom line:** `disallowed-tools` for skills/slash commands is genuinely **new** in the
2.1.143–156 window. The `disallowedTools` *agent* field and the `--disallowed-tools` CLI flag
are the only precursors; they share the `IS`/`fc` parser and the `fV8`/`alwaysDenyRules.command`
enforcement primitive, which is what made the new frontmatter field cheap to add.

---

## 8. ASCII summary — the two paths

```
                       skill/command frontmatter
                       disallowed-tools: "Edit, Write"
                                  │
                   parse: fc/IS  →  ["Edit","Write"]
                                  │
              ┌───────────────────┴────────────────────┐
        context: inline (default)                 context: fork
              │                                         │
   yA4: c28(setter, list, "union")          D0$: contextLayers +=
   APPEND -> appState                          {kind:"disallowed_tools",
     .toolPermissionContext                     disallowedTools:list}
     .alwaysDenyRules.command                        │
              │                              threaded into subagent
   in force for the WHOLE turn               toolUseContext.permissionLayers
              │                                        │
   NEXT user turn:                          T6(ctx): for each layer ->
   fI8: c28(setter, [] )  REPLACE            fV8(permCtx, list)
   -> alwaysDenyRules.command = undefined            │
              │                              effective deny list used by
   tools available again                     permission engine for THIS
   "cleared on next message"                 subagent only; dies with fork
```

Both paths converge on the same enforcement primitive — entries in
`alwaysDenyRules.command` — and deny always beats allow in the policy engine, so a tool named
in `disallowed-tools` cannot be invoked for the duration of the skill/command no matter what
allow rules (or skip-permissions flags) are otherwise in effect.
