# 04 — Tools Subsystem (framework · registry · serialization · deferral · ~48 tools) — v2.1.183

> Module: `04_tools` — the **whole tools machine** as it exists in Claude Code **v2.1.183**: the tool
> **framework** (`Tool`/`buildTool`/`ValidationResult`/`ToolUseContext`), the **registry/assembly**
> pipeline (`getAllBaseTools` → `getTools` → `assembleToolPool` → `getMergedTools`), the **wire
> serializer** (`buildToolSchema` + `eager_input_streaming`), the **deferred-tool / ToolSearch**
> machine, and **every built-in tool at contract level** (~48 tools).
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`
> (699,346 lines). Every `cli_inner_pretty.js:<line>` citation below is a **v2.1.183** line.
> Obfuscated names were **re-derived** for v2.1.183 — the bundler re-mangles every build (the v2.1.156
> serializer `w08` is `CWn` here, `getAllBaseTools` `ra`→`LW`, `buildTool` `oA`→`pi`). Never reuse a
> name across builds; the per-feature additions file is the canonical map.

> **📁 Full readable-source restoration.** This README is the module front-door; the *whole machine*
> restored as clean TypeScript organized like the genuine Anthropic source tree (v2.1.88
> `/lyz/codespace/3rd/claude-code/src`) lives in
> [**`reconstructed_source/`**](./reconstructed_source/README.md): 4 framework files + 28 per-tool
> files. Every reconstructed function is line-anchored to the 2.1.183 bundle and was adversarially
> re-verified against it.

---

## TL;DR — one framework, three pipelines, ~48 contracts

The tools subsystem is the contract layer between the agent loop and everything the model can *do*. It
has a clean four-layer shape, and v2.1.183 keeps that shape intact:

1. **Framework** (`Tool.ts`) — the `Tool`/`ToolDef` type spine, the `buildTool` factory (`pi`,
   cli_inner_pretty.js:149995) that fills `TOOL_DEFAULTS` (`jJu`, cli_inner_pretty.js:150010) over a
   tool spec while **preserving getters** via `Object.defineProperties`, the `ValidationResult` shape,
   and the cached `findToolByName`/`toolMatchesName` name resolver.
2. **Registry / assembly** (`tools.ts`) — the single exhaustive `getAllBaseTools` array (`LW`,
   cli_inner_pretty.js:436517) and the `getTools` → `assembleToolPool` → `getMergedTools` pipeline
   that turns it into the live menu the model sees, applying deny-rules, REPL-mode hiding, the
   `isEnabled()` mask, and the MCP/skill merge.
3. **Wire serialization** (`toolSchema.ts`) — `buildToolSchema` (`CWn`, cli_inner_pretty.js:581300)
   converts one in-process `Tool` into the Messages-API `tools[]` entry `{ name, description,
   input_schema, strict?, eager_input_streaming?, defer_loading?, cache_control? }`.
4. **Deferral / ToolSearch** (`deferredTools.ts`) — `isDeferredTool` (`G2`,
   cli_inner_pretty.js:222307), the 11-rule ladder that decides which tools ship **name-only**
   (`defer_loading: true`) on turn 1 and are fetched lazily through the `ToolSearch` tool, plus the
   keyword scorer and the `<system-reminder>` delta renderer.

On top of those four layers sit the **~48 built-in tool contracts** — Bash, Read, Edit, Write,
Glob, Grep, the Agent dispatcher, the Task/Cron families, the MCP-resource tools, web tools, plan-mode
tools, worktree tools, and the onboarding/misc group — each reconstructed with its identity, Zod input
schema, verbatim description, gating, `validateInput`, `checkPermissions`, and `call` behavior.

**The structural spine is carryover from v2.1.156.** The v2.1.183 deltas are *additive and narrow*: two
new registry slots (DesignSync, Projects), the removal of `TeamCreate`/`TeamDelete` (2.1.178, now 0
hits in the bundle), two new rules in the deferral ladder, an agent-team property-stripping table in
the serializer, and new `eager_input_streaming` model-caps records for `claude-opus-4-8` /
`claude-fable-5` / `claude-mythos-5`. See [§ Cross-version status](#cross-version-status).

---

## Architecture overview

```
                                   ┌──────────────────────────────────────────┐
                                   │  Tool.ts  — FRAMEWORK (the type spine)    │
                                   │  buildTool(pi) · TOOL_DEFAULTS(jJu)       │
                                   │  ValidationResult · ToolUseContext        │
                                   │  findToolByName(vl) / toolMatchesName(Rc) │
                                   │  getEmptyToolPermissionContext(kO)        │
                                   └──────────────────────────────────────────┘
                                                     ▲ imported by every tool
   tools/<Name>Tool.ts  (~48 contracts)             │
   ┌──────────────────────────────────────┐         │
   │ name · inputSchema(Zod) · description │─────────┘
   │ isEnabled · isReadOnly                │
   │ validateInput · checkPermissions      │
   │ async *call → ToolResult / yields     │
   └──────────────────────────────────────┘
                  │  collected into one ordered array
                  ▼
   tools.ts  — REGISTRY / ASSEMBLY
   ┌───────────────────────────────────────────────────────────────────────────┐
   │ getAllBaseTools (LW)  — exhaustive, hand-ordered, slot-stable               │
   │       │  (...slot ? [slot] : [] spreads → no holes → cache breakpoint safe) │
   │       ▼                                                                      │
   │ getTools (zR)         — CLAUDE_CODE_SIMPLE fast-path → deny → REPL → isEnabled│
   │       ▼                                                                      │
   │ assembleToolPool (YY) — built-in prefix (sorted) + MCP/skill tail, uniqBy    │
   │       ▼                                                                      │
   │ getMergedTools (iqe)  — dedup, non-MCP first / MCP last, coordinator subtract │
   └───────────────────────────────────────────────────────────────────────────┘
                  │  per tool, per request
                  ▼
   toolSchema.ts  — WIRE SERIALIZATION
   ┌───────────────────────────────────────────────────────────────────────────┐
   │ buildToolSchema (CWn) → { name, description, input_schema,                  │
   │                           strict?, eager_input_streaming?,                  │
   │                           defer_loading?, cache_control? }                  │
   │   cache-keyed on (lean tag · stream tag · name|name:hash)                   │
   └───────────────────────────────────────────────────────────────────────────┘
                  │  defer_loading decided by ↓
                  ▼
   deferredTools.ts  — DEFERRAL / ToolSearch
   ┌───────────────────────────────────────────────────────────────────────────┐
   │ isDeferredTool (G2) — 11-rule ladder → name-only on turn 1                  │
   │ searchToolsWithKeywords (dUi) — score by name + coarseParts                 │
   │ getDeferredToolsDelta (Qgo) — 5-state diff → 4-section <system-reminder>    │
   └───────────────────────────────────────────────────────────────────────────┘
                  │
                  ▼   the wire `tools[]` array on the Messages-API request
```

The key design property threading every layer is **prompt-cache stability**: the built-in tools occupy
a *contiguous, fixed-order prefix* with a cache breakpoint after the last one, so toggling any
conditional tool changes only the suffix and never invalidates the cached built-in block.

---

## Reconstructed source — file table

The reconstruction is two tiers: **framework** files (the four-layer machine above) and the
**`tools/`** directory (one file per tool or per tightly-coupled family). LOC = reconstructed lines.

### Framework (`reconstructed_source/*.ts`)

| File | Restores | v2.1.183 anchors | LOC |
|------|----------|------------------|----:|
| [`Tool.ts`](./reconstructed_source/Tool.ts) | The framework type spine + `buildTool` factory: `ValidationResult`/`ToolResult`/`ToolUseContext`, `TOOL_DEFAULTS`, the two-tier WeakMap `findToolByName` cache, `getEmptyToolPermissionContext`. | `pi` :149995, `jJu` :150010, `kO` :149998, `Rc` :149965, `vl` :149984 | 807 |
| [`tools.ts`](./reconstructed_source/tools.ts) | The registry + assembly pipeline: `getAllBaseTools`, presets, deny-filter, `getTools`, `assembleToolPool`, `getMergedTools`, `useMergedTools`, the run-once slot-population init. | `LW` :436517, `zR` :436622, `YY` :436581, `iqe` :539937 | 526 |
| [`toolSchema.ts`](./reconstructed_source/toolSchema.ts) | The Messages-API wire serializer: `buildToolSchema`, the schema cache, the four-way `eager_input_streaming` gate + ENV kill, the `strict` gate, the agent-team prop-strip table, the per-model `MODEL_CAPS`. | `CWn` :581300, `Ed` :95158, `W_f` :581683 | 655 |
| [`deferredTools.ts`](./reconstructed_source/deferredTools.ts) | The deferral machine: `isDeferredTool` 11-rule ladder, the keyword scorer, the 5-state deferred-tools delta diff + 4-section `<system-reminder>`, the usage-nudge, the `defer_loading` wire stamp. | `G2` :222307, `dUi` :230294, `Qgo` :462347 | 1102 |

### Built-in tools (`reconstructed_source/tools/*.ts`) — ~48 contracts in 28 files

| File | Tool(s) (wire name) | v2.1.183 obf | LOC |
|------|---------------------|--------------|----:|
| [`AgentTool.ts`](./reconstructed_source/tools/AgentTool.ts) | **Agent** (legacy wire alias "Task") — the subagent / fork / teammate / background / remote dispatcher | `f3n` :423505 | 891 |
| [`BashTool.ts`](./reconstructed_source/tools/BashTool.ts) | **Bash** — shell exec with sandbox decision, sed-edit interception, destructive/read-only tagging | `Cl` :450669 | 793 |
| [`PowerShellTool.ts`](./reconstructed_source/tools/PowerShellTool.ts) | **PowerShell** — Windows shell sibling of Bash (lazily required when PowerShell present) | `Ifo`-gated | 605 |
| [`ReadTool.ts`](./reconstructed_source/tools/ReadTool.ts) | **Read** — text/image/PDF/notebook read with the PARTIAL-view truncation geometry | `hg` :463520 | 621 |
| [`WriteTool.ts`](./reconstructed_source/tools/WriteTool.ts) | **Write** — overwrite-or-create file write | `yE` :193030 | 366 |
| [`EditTool.ts`](./reconstructed_source/tools/EditTool.ts) | **Edit** — exact-string replace / `replace_all` | `kH` :152083 | 381 |
| [`NotebookEditTool.ts`](./reconstructed_source/tools/NotebookEditTool.ts) | **NotebookEdit** — Jupyter cell replace/insert/delete | `wW` :221448 | 378 |
| [`GlobTool.ts`](./reconstructed_source/tools/GlobTool.ts) | **Glob** — fast path-glob match | `hj` | 249 |
| [`GrepTool.ts`](./reconstructed_source/tools/GrepTool.ts) | **Grep** — ripgrep-backed content search (arg-build core) | `OR` | 538 |
| [`REPLTool.ts`](./reconstructed_source/tools/REPLTool.ts) | **REPL** — code-execution sandbox that wraps file/exec primitives | `wpo` :221566 | 408 |
| [`LSPTool.ts`](./reconstructed_source/tools/LSPTool.ts) | **LSP** — language-server queries (env-gated, `isLsp`/`shouldDefer`) | `Opo` :429593 | 461 |
| [`AgentTool.ts` siblings → `TaskTools.ts`](./reconstructed_source/tools/TaskTools.ts) | **TaskCreate / TaskGet / TaskUpdate / TaskList / TaskStop / TaskOutput** — the background-task family (gated by `_H` / `CLAUDE_CODE_ENABLE_TASKS`) | `aVa/dVa/AVa/bVa/edt/q3n` | 1234 |
| [`CronTools.ts`](./reconstructed_source/tools/CronTools.ts) | **CronCreate / CronDelete / CronList** — scheduled-routine family | `w$p` slot | 537 |
| [`McpResourceTools.ts`](./reconstructed_source/tools/McpResourceTools.ts) | **ListMcpResources / ReadMcpResource / WaitForMcpServers** — MCP resource family | `_G/kG/sla` | 1114 |
| [`PlanModeTools.ts`](./reconstructed_source/tools/PlanModeTools.ts) | **EnterPlanMode / ExitPlanMode** — plan-mode transition pair | `a2n/Ij` | 851 |
| [`WorktreeTools.ts`](./reconstructed_source/tools/WorktreeTools.ts) | **EnterWorktree / ExitWorktree** — git-worktree isolation pair (gated by `udt`) | `G8a/Z8a` | 846 |
| [`AskUserQuestionTool.ts`](./reconstructed_source/tools/AskUserQuestionTool.ts) | **AskUserQuestion** — structured multiple-choice question to the user | `sut` :391450 | 552 |
| [`SkillTool.ts`](./reconstructed_source/tools/SkillTool.ts) | **Skill** — invoke a registered skill | `lut` :221449 | 439 |
| [`TodoWriteTool.ts`](./reconstructed_source/tools/TodoWriteTool.ts) | **TodoWrite** — the task-list state writer | `Dxe` :221398 | 382 |
| [`StructuredOutputTool.ts`](./reconstructed_source/tools/StructuredOutputTool.ts) | **StructuredOutput** (`Em`) — the structured-output sink (added conditionally, never deny-filtered through `getTools`) | `Em` :221489 | 285 |
| [`ToolSearchTool.ts`](./reconstructed_source/tools/ToolSearchTool.ts) | **ToolSearch** — the loader that fetches deferred-tool schemas on demand | `IMt` :221267 | 1074 |
| [`WebFetchTool.ts`](./reconstructed_source/tools/WebFetchTool.ts) | **WebFetch** — fetch + summarize a URL | `gF` :210992 | 530 |
| [`WebSearchTool.ts`](./reconstructed_source/tools/WebSearchTool.ts) | **WebSearch** — web search | `V3n` :221393 | 590 |
| [`SendMessageTool.ts`](./reconstructed_source/tools/SendMessageTool.ts) | **SendMessage / ListAgents** — cross-agent messaging (teammate mailbox) | `o9a`-adjacent | 426 |
| [`ScheduleWakeupTool.ts`](./reconstructed_source/tools/ScheduleWakeupTool.ts) | **ScheduleWakeup** — self-rescheduling (kairos loop) | `Y9a` :220800 | 250 |
| [`RemoteTriggerTool.ts`](./reconstructed_source/tools/RemoteTriggerTool.ts) | **RemoteTrigger** — cloud/remote-trigger entrypoint tool | `Zza` slot | 307 |
| [`PushNotificationTool.ts`](./reconstructed_source/tools/PushNotificationTool.ts) | **PushNotification** — surface results to the user (eager in remote-trigger entrypoints) | `oKa` slot | 270 |
| [`OnboardingMiscTools.ts`](./reconstructed_source/tools/OnboardingMiscTools.ts) | **DesignSync · Projects · Artifact · SendUserFile · SendUserMessage · ShareOnboardingGuide · ShowOnboardingRolePicker** — onboarding/misc group (DesignSync + Projects are **NEW in 2.1.183**) | `k$p/iKa/dKa/x$p/o9a/_Ka/Eqa` | 849 |
| [`TestingPermissionTool.ts`](./reconstructed_source/tools/TestingPermissionTool.ts) | **TestingPermission** — a permission-test fixture tool (not user-facing) | — | 103 |

> The ~48 figure is the count of distinct **wire `name` constants** across these files (Task* = 6,
> Cron* = 3, MCP-resource = 3, plan/worktree pairs, the onboarding group). `TeamCreate`/`TeamDelete`
> are intentionally **absent** — removed in 2.1.178 (0 hits in the v2.1.183 bundle).

---

## Key design decisions & algorithms

### 1. The `getAllBaseTools` slot array — fixed order for prompt-cache stability

**What it does:** `getAllBaseTools` (`LW`, cli_inner_pretty.js:436517) returns the complete, hand-ordered
array of every built-in tool that *could* be available in the current environment, with each
conditional tool spread as `...(slot ? [slot] : [])`.

**How it works:**
1. Unconditional tools (Agent, TaskOutput, the file tools, web tools…) appear at fixed positions.
2. Every conditional tool contributes *exactly one element or zero* via a spread — never an `undefined`
   hole, never a reshuffle. Examples: Bash is `...(isBashToolAvailable() ? [BashTool] : [])` (`Su`,
   cli_inner_pretty.js:436521); Task* are `...(isTasksEnabled() ? [TaskCreate…] : [])` (`_H`,
   cli_inner_pretty.js:436539); the worktree pair is `...(isWorktreeModeEnabled() ? […] : [])` (`udt`,
   cli_inner_pretty.js:436547).
3. Glob/Grep are dropped specifically when an embedded-search build aliases `find`/`grep` to bundled
   `bfs`/`ugrep` (the suppression `Set` from `jot`, cli_inner_pretty.js:436522).

**Why this approach:** The server-side `claude_code_global_system_caching` dynamic config places the
system-prompt cache breakpoint **after the last built-in tool**. A spread-or-empty pattern means
toggling any conditional tool changes only the *suffix* of the array; the cached built-in block stays
byte-identical, so the cache stays warm. A naive `tools.push(cond && X)` (leaving `false`/`undefined`
holes) or reordering by enablement would invalidate the cache on every gate flip.

**Key insight:** The array order is *load-bearing*, not cosmetic. The whole registry is engineered so
gate changes are cache-suffix-only — which is why even reserved/empty slots (`...emptySlotA`,
`...[]`) are kept in place to preserve element positions.

### 2. `getTools` — the deny → REPL → `isEnabled` mask, with a tool-search re-add

**What it does:** `getTools` (`zR`, cli_inner_pretty.js:436622) turns the exhaustive base array into the
*production* pool, honoring permissions, REPL mode, and per-tool enablement.

**How it works:**
1. **`CLAUDE_CODE_SIMPLE` fast-path** — a minimal pool (REPL+Edit+Write, or Bash/PowerShell+Read+Edit),
   extended in coordinator mode (cli_inner_pretty.js:436623). This short-circuits the whole pipeline.
2. **Drop the 3 "special" tools** (`ListMcpResources`, `ReadMcpResource`, `StructuredOutput`) that are
   added conditionally *elsewhere*, then deny-filter (`filterToolsByDenyRules` / `Fce`).
3. **REPL-mode filter** — when the REPL tool is present, hide the REPL-only primitives it wraps inside
   the VM (the `REPL_ONLY_TOOLS` set).
4. **`isEnabled()` mask-then-filter** — `isEnabled()` is evaluated *exactly once per tool into an array*
   (cli_inner_pretty.js:436642), then used as the filter predicate.
5. **Tool-search fallback** — if tool-search is active but Bash got filtered out and no REPL filtering
   happened, re-add Glob/Grep so search-mode sessions retain file search (cli_inner_pretty.js:436644).

**Why this approach:** The **mask-then-filter** trick (compute all `isEnabled()` results first, then
filter) matters because `isEnabled()` may have side effects or be order-sensitive; calling it once per
tool and snapshotting avoids re-invoking gates mid-iteration. The same idiom appears in
`getToolsForDefaultPreset`. The special-tool drop in step 2 keeps a single insertion point for the three
tools whose presence depends on runtime state the base array can't express.

**Key insight:** `getTools` is where *policy* (deny rules, REPL hiding, enablement) is applied; the base
array is pure *availability*. Separating availability from policy is what lets the same base array feed
both the model menu and the `--tools default` preset name list.

### 3. `assembleToolPool` / `getMergedTools` — built-in prefix, MCP last, dedup wins

**What it does:** `assembleToolPool` (`YY`, cli_inner_pretty.js:436581) is the single source of truth for
combining built-ins with MCP + skill tools; `getMergedTools` (`iqe`, cli_inner_pretty.js:539937) does
the final dedup + partition the model menu rides on.

**How it works:**
1. Built-ins are sorted by name as a **contiguous prefix**; MCP/skill tools form the **sorted tail**.
2. `uniqBy(..., 'name')` keeps the *first* occurrence — so a built-in **wins** a name collision against
   an MCP tool of the same name.
3. `getMergedTools` re-dedups, partitions so **non-MCP first / MCP last** (each partition sorted), then
   — in coordinator mode — narrows to the coordinator allow-set (`filterCoordinatorTools` / `lwl`).

**Why this approach:** The contiguous-built-in-prefix ordering is the *same* cache argument as the base
array: toggling a built-in only invalidates the suffix, never interleaving MCP tools into the cached
built-in block. The "built-in wins on name conflict" rule (first-occurrence `uniqBy`) is a deliberate
safety property — a third-party MCP server cannot shadow `Bash` or `Read` by registering a tool with the
same name.

**Key insight:** Two dedup passes (`assembleToolPool` then `getMergedTools`) look redundant but each owns
a different invariant: the first guarantees built-in-prefix + built-in-wins; the second guarantees
MCP-last ordering and coordinator-mode narrowing. The ordering invariants — not the dedup — are the
point.

### 4. `buildToolSchema` — cache-keyed serialization + the four-way `eager_input_streaming` gate

**What it does:** `buildToolSchema` (`CWn`, cli_inner_pretty.js:581300) serializes one in-process `Tool`
into the Messages-API `tools[]` wire object, deciding `strict`, `eager_input_streaming`, `defer_loading`,
and `cache_control`.

**How it works:**
1. **Cache key** = lean tag (`"L:"` when the model uses a lean system prompt, cli_inner_pretty.js:581303)
   + stream tag (`"F:"` when provider+caps make eager streaming eligible) + name (or `name:hash(schema)`
   for tools carrying a raw `inputJSONSchema`). The base object is memoized under this key.
2. On a miss: convert Zod→JSON-schema (or use the raw MCP schema), strip agent-team-only properties when
   agent-teams are off (`stripAgentTeamProps`, cli_inner_pretty.js:581315 — **2.1.183-new**), resolve the
   description, decide `strict` (only when the `tengu_tool_pear` gate is on **and** the tool opts in
   **and** the model supports structured outputs).
3. **The four-way `eager_input_streaming` gate** (cli_inner_pretty.js:581321-581327), bracketed by an
   explicit-off ENV kill: it turns on for (1) first-party Anthropic base-url + `tengu_fgts` gate, OR
   (2) vertex + standard base-url + per-model vertex cap, OR (3) bedrock + standard base-url + per-model
   bedrock cap, OR (4) an explicit truthy `CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING` env force.
   The whole gate is short-circuited OFF when that env var is *explicitly* falsy.
4. **Per-request layer (not cached):** `defer_loading: true` (cli_inner_pretty.js:581339) and
   `cache_control` are layered onto a fresh copy, because they vary per call.

**Why this approach:** The split between a **cached base object** (name/description/schema/strict/eager)
and an **uncached per-request layer** (defer/cache-control) is precise: the base is stable across a
session for a given model, so caching it avoids re-running Zod→JSON-schema conversion every turn; the
per-request keys genuinely change call-to-call and so are never cached. The documented "F:" cache-key
asymmetry (the stream tag is computed from provider+cap *without* the custom-base-url guards the real
gate enforces) is a deliberate, harmless cache over-segmentation rather than a bug.

**Key insight:** A custom Vertex/Bedrock base-url with a caps-eligible model produces a cache key with
`"F:"` but a cached object that does **not** set `eager_input_streaming` — over-segmentation, never
mis-emission. The serializer fails *closed* on the wire field, which is the safe direction.

### 5. `isDeferredTool` — the 11-rule ordered ladder

**What it does:** `isDeferredTool` (`G2`, cli_inner_pretty.js:222307) is the single decision point that
decides each tool's wire shape: `true` ⇒ ship **name-only** (`defer_loading: true`) on turn 1 and fetch
the full schema lazily via `ToolSearch`; `false` ⇒ always ship with the full schema.

**How it works (the ladder is order-sensitive):**
1. `alwaysLoad === true` ⇒ never defer (explicit opt-out).
2. **NEW @222309:** name in the server-controlled non-deferrable list (`getNonDeferrableBuiltins` /
   `c1i`) ⇒ never defer — placed *before* the MCP check so Anthropic can force even an MCP tool eager
   via dynamic config, no client release needed.
3. All MCP tools defer by default.
4. `ToolSearch` itself never defers (it is the loader).
5. `Agent` is eager only when fork-subagent is enabled.
6–7. `Brief` and `SendUserFile` are core UX tools, always eager.
8. **NEW @222317:** `PushNotification` is eager in a remote-trigger entrypoint (it's the primary way
   cloud agents surface results) — mirrors the EnterWorktree-in-bg exemption.
9. `ScheduleWakeup` is eager when the kairos dynamic-loop gate is on.
10. `EnterWorktree` is eager in `bg` sessions (where worktrees are the workflow).
11. Fallthrough: honor the tool's own `shouldDefer` flag (27 tool decls set this).

**Why this approach:** Deferral exists to shrink the turn-1 prompt: a session with many MCP tools would
otherwise pay full-schema tokens for tools the model may never call. The ladder is *ordered* because the
rules overlap — putting the server-controlled exempt list (rule 2) *above* the MCP default (rule 3) is
what lets Anthropic flip a specific MCP tool to eager without a release, and the entrypoint-specific
exemptions (rules 8–10) ensure the *one* tool a given launch mode depends on is always visible turn-1.

**Key insight:** The two NEW rules (2 and 8) are both about *reachability guarantees* — making sure a
critical tool is never hidden behind a `ToolSearch` round-trip when the entrypoint or a server flag says
it must be visible. The rest of the ladder is carryover from the v2.1.156 `pp` ladder, reordered to slot
them in.

### 6. `buildTool` — getter-preserving defaults merge

**What it does:** `buildTool` (`pi`, cli_inner_pretty.js:149995) is the factory every tool object is built
from: it overlays a tool spec onto `TOOL_DEFAULTS` (`jJu`, cli_inner_pretty.js:150010) so a partial spec
becomes a complete `Tool`.

**How it works:** Instead of `{ ...TOOL_DEFAULTS, ...spec }`, it uses `Object.defineProperties` so that a
tool whose `description`/`prompt`/`isEnabled` is a **getter** keeps lazy-getter semantics rather than being
flattened to its value at build time. `TOOL_DEFAULTS` are **fail-closed** (e.g. a missing `isEnabled`
defaults to a safe value; a missing `checkPermissions` denies).

**Why this approach:** Many tool fields are intentionally lazy — a `prompt(opts)` that branches on model,
or an `isEnabled()` that reads a gate at call time. A spread would invoke/snapshot getters at registration
time, defeating laziness and breaking model-conditional descriptions. Getter preservation is the whole
reason the factory uses `defineProperties`.

**Key insight:** The 2.1.183 drift here is tiny but real: `getEmptyToolPermissionContext` (`kO`) now emits
`mcpPermissionModeOverrides: {}` (cli_inner_pretty.js:150005) and `alwaysAskRules: {}`, and `prompt()` now
threads a `model` field — additive shape changes consumed by the permission layer
(cli_inner_pretty.js:688645).

---

## Cross-version status

Everything below is **structurally carryover from v2.1.156**; the obfuscated names were re-derived for
v2.1.183 but the logic is the same. The **new-at-2.1.183** items are additive and listed separately.

**Carryover (re-derived names, identical logic):**

- The framework spine (`buildTool`, `TOOL_DEFAULTS`, `ValidationResult`, `findToolByName`/`toolMatchesName`
  two-tier cache) — byte-equivalent to the v2.1.88/2.1.156 precursor shape.
- The registry pipeline (`getAllBaseTools` → `getTools` → `assembleToolPool` → `getMergedTools`) and its
  cache-stable slot ordering.
- The serializer (`buildToolSchema`) and its cache-key scheme + `strict` gate.
- The deferral ladder's rules 1, 3–7, 9–11; the keyword scorer; the 5-state delta + system-reminder
  rendering.
- Per-tool algorithms: the Read PARTIAL-view truncation geometry, the Bash sandbox decision, the Grep
  ripgrep arg-build — all re-read and confirmed byte-for-byte at their 2.1.183 lines.

**New at 2.1.183 (additive):**

- **Registry slots:** `DesignSync` (`k$p`, cli_inner_pretty.js:436707) and `Projects` (`iKa`, gated by
  `CLAUDE_PROJECT_TOOL`, cli_inner_pretty.js:436708) — two new tools in `getAllBaseTools`.
- **Tool removal:** `TeamCreate`/`TeamDelete` removed in 2.1.178 (0 hits in the bundle); the old
  agent-team spread is superseded by `_H()?[Task*]` + `udt()?[Worktree pair]`.
- **Deferral ladder:** two new rules — the server-controlled non-deferrable list (rule 2, @222309) and
  the `PushNotification`-in-remote-trigger exemption (rule 8, @222317).
- **Serializer:** the agent-team property-stripping table (`stripAgentTeamProps`/`AGENT_TEAM_STRIP_TABLE`,
  gated by `agentTeamsEnabled` / `Sl`), and new `eager_input_streaming` `MODEL_CAPS` records for
  `claude-opus-4-7`, `claude-opus-4-8` (the default Opus), `claude-fable-5`, `claude-mythos-5`
  (cli_inner_pretty.js:95118-95148).
- **Per-tool fields:** the Agent tool's deprecated-and-ignored `team_name` input; the Read tool's new
  `truncatedByTokenCap` output field (cli_inner_pretty.js:463468).

---

## Reading order

1. **This README** — the four-layer mental model + the slot-stability invariant that recurs at every
   layer.
2. **[`reconstructed_source/README.md`](./reconstructed_source/README.md)** — the reconstruction index:
   the 3-tier evidence model, the per-file inventory, and the anchor-comment convention.
3. **`Tool.ts`** — the framework spine; read `buildTool` + `ValidationResult` first, they are imported by
   every tool.
4. **`tools.ts`** — the registry pipeline top-to-bottom: `getAllBaseTools` → `getTools` →
   `assembleToolPool` → `getMergedTools`. Internalize the slot-spread cache argument.
5. **`toolSchema.ts`** — how one tool becomes a wire object; focus on the `eager_input_streaming` gate.
6. **`deferredTools.ts`** — the `isDeferredTool` ladder, then the delta-diff/system-reminder renderer.
7. **`tools/`** — pick any tool by its row in the table above; each file is self-contained with its own
   header disclosing its bundle regions.

---

## Related modules

- **`30_agent_team/`** — the implicit-team redesign (2.1.178): the Agent tool's `name`-param teammate
  route and the removal of `TeamCreate`/`TeamDelete` that this module records.
- **`36_background_agents/`** — the Task* family launches background agents; the nested-subagent depth
  limit and `bg` session kind (which the deferral ladder's rules 8/10 key on) live there.
- **`42_workflow/`** — the `Workflow` tool is a registry slot (`Edt`) populated by `initializeBundledTools`;
  its full reconstruction is a sibling tree.
- **Permissions / Sandbox** (platform infra) — `checkPermissions`, the deny-rule lookup
  (`getDenyRuleForTool`), and the Bash sandbox decision feed into the per-tool contracts here.

---

## Related Symbols

> Symbol mappings live in the central index and the per-feature additions file (never as tables in
> module docs). Each reconstructed `.ts` file is itself the authoritative, line-anchored symbol map for
> its slice (via its `// 2.1.183: <readable> = <obf> @<line>` anchor comments).
>
> - [symbol_additions_v2_1_183_tools.md](../00_overview/symbol_additions_v2_1_183_tools.md) — **the
>   consolidated v2.1.183 Tools symbol table** (framework + registry + serializer + deferral + every
>   per-tool symbol; add new rows there).
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Tools is the home
>   module here (Agent Loop, LLM API, Tools, Agents, Subagent, State).
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (the
>   Workflow/Skill/Todo tool slots, plan mode).
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra
>   (permission deny-rule lookup, model caps, prompt building, the `eager_input_streaming` gate).
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
>   (MCP-resource tools, LSP tool, the ToolSearch UI surface).

Key functions in this module (re-derived v2.1.183 names):

- `buildTool` (`pi`, cli_inner_pretty.js:149995) — the getter-preserving tool factory over `TOOL_DEFAULTS`.
- `getAllBaseTools` (`LW`, cli_inner_pretty.js:436517) — the exhaustive, cache-stable built-in array.
- `getTools` (`zR`, cli_inner_pretty.js:436622) — deny → REPL → `isEnabled` mask + tool-search re-add.
- `assembleToolPool` (`YY`, cli_inner_pretty.js:436581) / `getMergedTools` (`iqe`, cli_inner_pretty.js:539937) — built-in-prefix / MCP-last dedup.
- `buildToolSchema` (`CWn`, cli_inner_pretty.js:581300) — the Messages-API wire serializer.
- `isDeferredTool` (`G2`, cli_inner_pretty.js:222307) — the 11-rule deferral ladder (rules 2 & 8 NEW).
- `getDeferredToolsDelta` (`Qgo`, cli_inner_pretty.js:462347) — the 5-state delta diff for the `<system-reminder>`.
- `searchToolsWithKeywords` (`dUi`, cli_inner_pretty.js:230294) — the ToolSearch keyword scorer.
- `MODEL_CAPS` (`Ed`, cli_inner_pretty.js:95158) — per-model `eager_input_streaming` caps (opus-4-8/fable-5/mythos-5 NEW).
- `getEmptyToolPermissionContext` (`kO`, cli_inner_pretty.js:149998) — now emits `mcpPermissionModeOverrides`.
- `AgentTool` (`f3n`, cli_inner_pretty.js:423505) — the subagent/fork/teammate/background/remote dispatcher.
- `BashTool` (`Cl`, cli_inner_pretty.js:450669) / `FileReadTool` (`hg`, cli_inner_pretty.js:463520) — the load-bearing exec/read contracts.
