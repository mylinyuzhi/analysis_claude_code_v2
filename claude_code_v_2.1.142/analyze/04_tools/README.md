# 04 — Tools Subsystem (v2.1.142)

> **Module**: `04_tools/` — Foundational analysis of Claude Code's tool subsystem.
> **Bundle**: `cli_inner_pretty.js` (2.1.142 extract).
> **TypeScript reference**: `/lyz/codespace/3rd/claude-code/src/Tool.ts`, `/lyz/codespace/3rd/claude-code/src/tools.ts` (2.1.88 baseline).

## What this module covers

Every external action the model takes — reading a file, running a shell command, delegating to a subagent, calling an MCP server — goes through the tool subsystem. A tool is a structured contract that ties a Zod schema for input, a permission gate, an async `call` implementation, and a family of render methods together. This module documents how tools are registered, validated, gated, invoked, and rendered.

Tools are the only sanctioned side-channel between the model and the host: every other surface (system prompt, attachments, hooks) is one-way or already filtered. That is why the contract is unusually wide — it must cover schema validation, permission policy, deferred loading, MCP federation, abort signalling, output streaming, and three distinct render phases (use / result / rejected) with a single uniform shape.

## File map

| File | Topic |
|------|-------|
| `registration.md` | The `createTool` (`XK`) factory, full property keys, name-via-identifier convention |
| `schema_validation.md` | Zod input schema, `validateInput`, error envelope to the model |
| `permission_pipeline.md` | `checkPermissions` contract and integration with allow/deny/ask flow |
| `lifecycle.md` | The end-to-end call: validate → permission → invoke → render |
| `deferred_tools.md` | Lazy loading via `shouldDefer`, the ToolSearch tool, system-reminder delta protocol |
| `mcp_integration.md` | MCP tools as a separate factory class, `_meta` annotations, error envelopes |
| `tool_inventory.md` | All 46 tools — one-line description, offset, capability flags |

## Architecture diagram

```
                     ┌─────────────────────────────────────┐
                     │   getAllBaseTools / assembleToolPool │  (built-ins + MCP, deny-filtered)
                     └────────────┬────────────────────────┘
                                  │  Tools array
                                  ▼
       ┌─────────────────────────────────────────────────────────┐
       │                  Model sees tool prompts                 │
       │  (full schema for non-deferred; name only for deferred)  │
       └────────────┬───────────────────────┬────────────────────┘
                    │ tool_use block         │ deferred name in system-reminder
                    ▼                        ▼
            ┌───────────────┐         ┌─────────────────┐
            │  Resolve name │         │  ToolSearch     │
            │   (i4 / find) │         │  (cY) hydrates  │
            └───┬───────────┘         │  schema on demand│
                ▼                     └─────────────────┘
        ┌───────────────────────────────────────────────────┐
        │ Stage 1: input.safeParse(inputSchema)              │   ─┐
        │   → fail → InputValidationError back to the model  │    │
        ├────────────────────────────────────────────────────┤    │
        │ Stage 2: tool.validateInput?.(input, ctx)          │    │
        │   → result:false → tool_use_error with .message    │    │ Pre-tool
        ├────────────────────────────────────────────────────┤    │ pipeline
        │ Stage 3: hooks (PreToolUse) + tool.checkPermissions │    │
        │   → 'allow'/'deny'/'ask'/'passthrough'              │    │
        │   → ask → UI dialog → user decides                  │    │
        ├────────────────────────────────────────────────────┤   ─┘
        │ Stage 4: await tool.call(input, ctx, canUseTool,    │
        │          parentMessage, onProgress)                 │   ─ execute
        │   → streams progress via onProgress(...)             │
        │   → returns { data, newMessages?, mcpMeta? }         │
        ├────────────────────────────────────────────────────┤
        │ Stage 5: hooks (PostToolUse) may rewrite output     │
        ├────────────────────────────────────────────────────┤
        │ Stage 6: mapToolResultToToolResultBlockParam(data)  │   ─ shape
        │   → ToolResultBlockParam (returned to API)          │
        ├────────────────────────────────────────────────────┤
        │ Stage 7: renderToolUseMessage / renderToolResult-   │
        │           Message / renderToolUseRejectedMessage    │   ─ render
        └─────────────────────────────────────────────────────┘
```

### Key insight

The contract intentionally separates **shaping for the API** (`mapToolResultToToolResultBlockParam`, which produces `content` blocks Anthropic's servers will see) from **rendering for the user** (`renderToolResultMessage`, which produces React nodes). The same `data` object feeds both, but the model only ever sees the API shape. This lets the tool return rich structured data (e.g., the Read tool returns `{type:"text", file:{content, ...}}`) without forcing the UI to parse JSON to display it, and without forcing the API to ship React markup.

## Lifecycle stages

### Stage 1 — Schema parse (Zod, strict-mode optional)

The model's emitted `tool_use.input` is run through `inputSchema.safeParse(...)`. Failures emit `<tool_use_error>InputValidationError: ...</tool_use_error>` back to the model with the Zod error message. The model is expected to self-correct on the next turn. See `schema_validation.md`.

### Stage 2 — Per-tool `validateInput`

A second, semantic-level validator that runs after Zod parses. Examples: Read rejects deny-listed paths and binary files; CronCreate rejects malformed cron strings. Returns `{result:true}` or `{result:false, message, errorCode}`. See `schema_validation.md`.

### Stage 3 — Permission gate

Three coordinating layers:
1. **PreToolUse hook** (`hookPermissionResult`): can override decision before `checkPermissions` runs.
2. **`tool.checkPermissions(input, ctx)`**: returns one of:
   - `{behavior:'allow', updatedInput}` — proceed, possibly with rewritten input
   - `{behavior:'deny', message}` — fail with model-visible reason
   - `{behavior:'ask', message, ...}` — interactive permission dialog
   - `{behavior:'passthrough', message, suggestions?}` — fall through to general permission logic (MCP tools use this)
3. **General permission logic** (allow/deny/ask rules) — applies if `behavior` is `passthrough`.

See `permission_pipeline.md` and `37_permission_policy/` for the broader policy layer.

### Stage 4 — `call`

The bulk of the tool's work runs in `await tool.call(input, ctx, canUseTool, parentMessage, onProgress?)`. Key context properties:
- `ctx.abortController.signal` — observed throughout long-running calls
- `ctx.readFileState` — LRU cache that Read/Edit/Write coordinate via
- `ctx.options.mcpClients` — list of connected MCP clients (for MCP tools)
- `onProgress` — emits `{type:"progress", toolUseID, data}` for streaming UI

Return shape: `{data, newMessages?, contextModifier?, mcpMeta?}`. See `lifecycle.md`.

### Stage 5 — `mapToolResultToToolResultBlockParam`

Converts `data` into the `{tool_use_id, type:"tool_result", content}` block the model sees. Tools control whether `content` is a plain string ("Read N lines from ...") or an array of typed blocks (e.g., the Read tool emits `[{type:"image", source:...}]` for image files).

### Stage 6 — Render methods

Each tool implements at most three render functions:
- `renderToolUseMessage(input)` — what the user sees as the tool starts (e.g., "Reading src/foo.ts")
- `renderToolResultMessage(data, ...)` — what the user sees when it finishes (e.g., the diff for Edit)
- `renderToolUseRejectedMessage(input)` — what the user sees if they denied the call

All three are React-tree functions. Defaults provided for unimplemented variants. See `lifecycle.md`.

## Tool counts by category (v2.1.142)

> Source: `assets/tools/_index.json` (46 tools registered, plus `eval_registered__${...}` placeholder pattern).

| Category | Count | Tools |
|----------|------:|-------|
| **File** | 5 | Read, Write, Edit, NotebookEdit, Glob |
| **Shell** | 2 | Bash, PowerShell |
| **Search** | 1 | Grep |
| **Agent / Subagent** | 1 | Agent |
| **Plan Mode** | 2 | EnterPlanMode, ExitPlanMode |
| **Tasks / TodoV2** | 5 | TaskCreate, TaskGet, TaskList, TaskUpdate, TodoWrite |
| **Background Tasks** | 2 | TaskOutput, TaskStop |
| **MCP infrastructure** | 4 | ListMcpResourcesTool, ReadMcpResourceTool, WaitForMcpServers, `mcp` (catch-all base) |
| **Web** | 2 | WebFetch, WebSearch |
| **Cron / Triggers** | 4 | CronCreate, CronDelete, CronList, RemoteTrigger |
| **Worktrees** | 2 | EnterWorktree, ExitWorktree |
| **Agent Teams** | 3 | SendMessage, TeamCreate, TeamDelete |
| **User Interaction** | 4 | AskUserQuestion, PushNotification, SendUserMessage, SendUserFile |
| **REPL / Sandboxed exec** | 1 | REPL |
| **Discovery** | 2 | ToolSearch, Skill |
| **Code intelligence** | 1 | LSP |
| **Sleep / Pacing** | 1 | ScheduleWakeup |
| **Onboarding** | 1 | ShareOnboardingGuide |
| **Output shaping** | 1 | StructuredOutput |
| **Testing** | 1 | TestingPermission |
| **Placeholder** | 1 | `eval_registered__${...}` |

**Total**: 46 registered tools + a class of dynamically-created MCP tools at runtime (one per (server, tool) tuple, name format `mcp__<server>__<tool>` unless `CLAUDE_AGENT_SDK_MCP_NO_PREFIX` is set).

## Feature deltas from v2.1.112 → v2.1.142

### 1. Tool factory rename: `Iq` → `XK`

The factory that wraps a partial definition with the `TI1` (formerly `jy_`) defaults table is now identifier `XK` at `cli_inner_pretty.js:141068`. The factory body is structurally identical — `Object.defineProperties({ ...TI1, userFacingName: () => H.name }, Object.getOwnPropertyDescriptors(H))` — but the name change ripples through 47 call sites.

**What it does:** Wraps a partial tool definition with safe defaults so every tool exported has a complete contract surface (the TypeScript `buildTool` analog).

**How it works:**
1. Start with `TI1` — the defaults map: `isEnabled: ()=>!0`, `isConcurrencySafe: ()=>!1`, `isReadOnly: ()=>!1`, `isDestructive: ()=>!1`, `checkPermissions: (input, ctx)=>Promise.resolve({behavior:'allow',updatedInput:input})`, `toAutoClassifierInput: ()=>""`, `userFacingName: ()=>""`.
2. Override `userFacingName` to default to `H.name` (the tool's primary name) — so `Read` tool's user-facing-name defaults to `"Read"` unless a custom one is provided.
3. Spread `H`'s own property descriptors on top — including getters (used heavily for `inputSchema` to lazily evaluate Zod schemas at first use).

**Why this approach:** Using `Object.getOwnPropertyDescriptors` instead of a plain spread preserves Zod schema getters. If you had `get inputSchema() { return ...; }`, a `{...TI1, ...H}` spread would invoke the getter once at factory time and store the result; `defineProperties` instead copies the descriptor itself, deferring evaluation until first read. This matters because some schemas need module-level state (e.g., feature flags) that isn't ready at tool-registration time.

**Key insight:** The rename appears to be cosmetic (no behavior change), but the getter-preservation is the actual reason the factory exists at all. A naive `Object.assign` would break lazy schema construction.

### 2. New tool: `SendUserFile`

A new first-class tool (`SendUserFileTool`, factory call at `cli_inner_pretty.js:385814`) that delivers files (screenshots, reports, built artifacts) directly to the user, surfacing them as attachments rather than mentions. Gated by `tengu_send_user_file` Statsig gate and Kairos feature flag.

- Input: `{files: string[], caption?: string, status: 'normal'|'proactive'}`
- Output: `{caption?, attachments: Array<{path, size, isImage, file_uuid?}>}`
- Concurrency-safe and read-only (the side-effect is "user notification", not file modification).
- `status: 'proactive'` is for cases where the agent is initiating contact (e.g., a background-task completion delivering its artifact).

See `tool_inventory.md` for the full property keys.

### 3. Identifier-keyed `name` references

Every tool's `name` property is now read from a module-scoped string constant rather than inlined. For example, the Read tool's definition site is:

```js
($Y = XK({
  name: Bq,    // Bq = "Read" — module-level constant defined at line 141539
  searchHint: "read files, images, PDFs, notebooks",
  ...
}))
```

This pattern (`var Bq = "Read"`, `var Sq = "Bash"`, `var G7 = "Edit"`, `var o4 = "Write"`, `var v9 = "Grep"`, `var d1 = "Glob"`, `var VP = "NotebookEdit"`, `var EK = "PowerShell"`, etc.) appears across the bundle and is used in branchy code (e.g., post-call telemetry that special-cases `Read`, `Bash`, `Edit`, `Write` for file-state tracking).

**Why this approach:** Three reasons:
1. **Single source of truth** for the tool name string — every comparison (`H.name === Bq`) uses the constant.
2. **Minifier-friendly** — the constant becomes a single short identifier rather than a recurring 5-character string literal.
3. **Cross-module reuse** — the constant can be exported and consumed by permission rules, system prompts, and telemetry without re-declaring the string in each place.

**Key insight:** The pattern is doubly useful for tools that have many call-site comparisons (`Read`, `Bash`, `Edit`, `Write`) versus tools that are referenced only by their own definition site (`StructuredOutput`, `TestingPermission`). The bundler still emits the string literal for the latter, but with the indirection, refactors and renames touch one site instead of dozens.

## Related modules

- `02_ui/` — render methods feed into the UI subsystem
- `06_mcp/` — MCP tool federation (see `mcp_integration.md`)
- `07_compact/` — tool-result token counting and persistence threshold
- `11_hooks/` — PreToolUse / PostToolUse hooks (see `permission_pipeline.md`)
- `12_plan_mode/` — Enter/ExitPlanMode use a distinct set of allow rules
- `37_permission_policy/` — the broader policy layer
- `30_agent_team/` — SendMessage / TeamCreate / TeamDelete tools

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - v2.1.142 additions: [symbol_additions_v2_1_142_tools_arch.md](../00_overview/symbol_additions_v2_1_142_tools_arch.md)

Key entries:
- `createTool` (obfuscated: `XK`) - Tool factory (rename from `Iq` in v2.1.112)
- `TOOL_DEFAULTS` (obfuscated: `TI1`) - Defaults map merged by factory (rename from `jy_`)
- `findToolByName` (obfuscated: `i4`) - Name-to-tool resolver with WeakMap cache
- `isDeferredTool` (obfuscated: `zm`) - Predicate for `defer_loading:true` in API
- `TOOL_SEARCH_TOOL_NAME` (obfuscated: `cY`) - `"ToolSearch"` constant
- `READ_TOOL_NAME` (obfuscated: `Bq`) - `"Read"` constant
- `SEND_USER_FILE_TOOL_NAME` (obfuscated: `NH8`) - `"SendUserFile"` constant

## Validation status (B1)

Cross-checked against `extract/assets/tools/_index.json` (46 tools, of which 45 are named + 1 `eval_registered__${...}` placeholder):

- All 45 named tools have a per-tool doc under `04_tools/` (45/45 coverage).
- 4 supplementary docs (`brief.md`, `config.md`, `sleep.md`, `synthetic_output.md`) document tools present in the 2.1.88 TS baseline but removed/renamed/aliased in v2.1.142. These are kept as deobfuscation cross-references — not registered tools.
- 9 architecture docs cover the pipeline (`registration.md`, `schema_validation.md`, `permission_pipeline.md`, `lifecycle.md`, `deferred_tools.md`, `mcp_integration.md`, `mcp_auth.md`, `tool_inventory.md`, `README.md`).
- All v2.1.142-specific changes are documented in-place: `MCP_TOOL_TIMEOUT` (mcp.md, wait_for_mcp_servers.md), `alwaysLoad` MCP override added in 2.1.121 (mcp.md, mcp_integration.md, deferred_tools.md), PowerShell `tengu_cobalt_ridge` rollout gate (powershell.md), deferred-tool protocol (deferred_tools.md), subagent inheritance (agent.md), Monitor sleep guard added in 2.1.142 (bash.md, powershell.md), `SendUserFile` first-class addition (this README, send_user_file.md, deferred_tools.md).
- Local markdown links: 58/58 clean. No empty stub docs (minimum doc size: 76 lines).
