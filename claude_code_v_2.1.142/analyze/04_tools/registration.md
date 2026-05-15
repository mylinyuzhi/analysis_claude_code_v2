# Tool Registration — Factory & Property Keys

> The `createTool` (`XK`) factory at `cli_inner_pretty.js:141068` is the single registration entry point. Every built-in tool in the bundle flows through it.

## The factory

### createTool (`XK`) — defaults merger

**What it does:** Takes a partial tool definition and returns a complete tool object with `TOOL_DEFAULTS` filled in for any unspecified methods.

**How it works:**
1. Starts with `TI1` (defaults map): `isEnabled`, `isConcurrencySafe`, `isReadOnly`, `isDestructive`, `checkPermissions` (allow), `toAutoClassifierInput` (empty), `userFacingName` (empty).
2. Overrides `userFacingName` to default to `() => H.name`.
3. Spreads `H`'s own property descriptors on top via `Object.defineProperties`, so getters (used heavily for `inputSchema`/`outputSchema`) are preserved verbatim.

**Why this approach:** A plain `{...TI1, ...H}` spread would invoke any getter in `H` at factory time and store the resolved value. Tools depend on lazy evaluation of Zod schemas (`get inputSchema() { return C45(); }`) so they can defer module-graph cost until the schema is actually needed. `Object.defineProperties` copies the descriptor itself, preserving the getter.

**Key insight:** The lazy-getter pattern is what lets the bundle register all 46 tools at startup without paying the Zod-build cost upfront. Schemas only materialise the first time the model calls (or first time the prompt asks for) that tool — which for many tools (CronCreate, PowerShell, REPL) never happens in a given session.

```javascript
// ============================================
// createTool (XK) — wrap a partial tool def with TOOL_DEFAULTS
// Location: cli_inner_pretty.js:141068-141070
// ============================================

// ORIGINAL (for source lookup):
function XK(H) {
  return Object.defineProperties({ ...TI1, userFacingName: () => H.name }, Object.getOwnPropertyDescriptors(H));
}

// READABLE (for understanding):
function createTool(partialToolDef) {
  // 1. Start with the defaults table merged with a custom userFacingName fallback
  // 2. defineProperties applies all of partialToolDef's descriptors (incl. getters) on top
  // 3. Result: a complete Tool with partial overrides intact, and lazy getters preserved
  return Object.defineProperties(
    { ...TOOL_DEFAULTS, userFacingName: () => partialToolDef.name },
    Object.getOwnPropertyDescriptors(partialToolDef),
  );
}

// Mapping: XK→createTool, H→partialToolDef, TI1→TOOL_DEFAULTS
```

### TOOL_DEFAULTS (`TI1`) — fail-closed defaults

**What it does:** Provides safe defaults for every tool method that isn't required.

```javascript
// ============================================
// TOOL_DEFAULTS (TI1) — fail-closed default methods
// Location: cli_inner_pretty.js:141082-141093
// ============================================

// ORIGINAL (for source lookup):
TI1 = {
  isEnabled: () => !0,
  isConcurrencySafe: (H) => !1,
  isReadOnly: (H) => !1,
  isDestructive: (H) => !1,
  checkPermissions: (H, $) => Promise.resolve({ behavior: "allow", updatedInput: H }),
  toAutoClassifierInput: (H) => "",
  userFacingName: (H) => "",
};

// READABLE (for understanding):
const TOOL_DEFAULTS = {
  isEnabled: () => true,                                  // Tool is registered → enabled
  isConcurrencySafe: (_input) => false,                   // Conservative — assume side-effects
  isReadOnly: (_input) => false,                          // Conservative — assume writes
  isDestructive: (_input) => false,                       // Default benign
  checkPermissions: (input, _ctx) =>                      // Default: defer to general policy
    Promise.resolve({ behavior: "allow", updatedInput: input }),
  toAutoClassifierInput: (_input) => "",                  // Skip auto-mode classifier
  userFacingName: (_input) => "",                         // Replaced by createTool with H.name
};

// Mapping: TI1→TOOL_DEFAULTS
```

**Why these defaults:** They are deliberately "fail closed where it matters": tools default to *not* concurrency-safe and *not* read-only, so a tool author who forgets to set `isConcurrencySafe: () => true` cannot accidentally have their tool run in parallel with another. But for `isEnabled` the default is `true` — if you registered the tool, you intend to use it. The `checkPermissions` default is `allow` because the *general* permission system (allow-rules / deny-rules in settings.json) runs separately; the tool-level method is for tool-specific logic only.

**Key insight:** Note that `userFacingName` is `(H) => ""` in `TI1` but `() => H.name` in the override inside `XK`. The empty default is a typo-safe sentinel so that bugs ("user-facing name not provided") manifest as visibly empty strings in the UI rather than crashing.

## Name resolution

### findToolByName (`i4`) — cached lookup with WeakMap

**What it does:** Resolves a tool name (or alias) to the registered `Tool` object, with two layers of caching.

**How it works:**
1. If `q` (the optional alias map) has the key, indirect through it: `i4(H, q[$])`.
2. Look up `H` (the Tools array) in `uTK` (a WeakMap of cached name→tool maps). If present, fast path through the map.
3. If not, but the WeakSet `mTK` already saw this `H`, do the slow `H.find(...)` (means we tried-but-failed to cache).
4. Otherwise build a fresh cache via `GI1(H)` (iterates the array, populates the `name → tool` map and `alias → tool` for any aliases).
5. Fallback: linear scan with `H.find(A => G1(A, $))` where `G1` is the matcher (`A.name === $ || A.aliases?.includes($)`).

**Why this approach:** The cache exists because `findToolByName` is called many times per turn (every tool-use block, every permission check, every render). A linear scan over 46+ tools per lookup compounds quickly during streaming. WeakMap-keying on the tools array means caches are GC'd automatically when a context (e.g., a subagent) is collected — no manual cache eviction needed.

**Key insight:** The dual WeakMap+WeakSet pair handles two cases: (1) we've cached this array, (2) we've *seen* this array but couldn't cache (e.g., it was modified between calls). Without the WeakSet, every modification would re-trigger the expensive `GI1(H)` rebuild.

```javascript
// ============================================
// findToolByName (i4) — cached name → tool resolution
// Location: cli_inner_pretty.js:141057-141067
// ============================================

// ORIGINAL (for source lookup):
function i4(H, $, q) {
  let K = q && Object.hasOwn(q, $) ? q[$] : void 0;
  if (K !== void 0 && K !== $) return i4(H, K);
  let _ = uTK.get(H);
  if (_) return _.get($);
  if (mTK.has(H)) {
    let A = GI1(H);
    return (uTK.set(H, A), A.get($));
  }
  return (mTK.add(H), H.find((A) => G1(A, $)));
}

// READABLE (for understanding):
function findToolByName(tools, name, aliasMap) {
  // 1. Follow alias indirection if provided (e.g., "FileRead" → "Read")
  const aliased = aliasMap && Object.hasOwn(aliasMap, name) ? aliasMap[name] : undefined;
  if (aliased !== undefined && aliased !== name) {
    return findToolByName(tools, aliased);
  }
  // 2. Fast path: WeakMap cache hit
  const cachedMap = TOOL_NAME_CACHE.get(tools);
  if (cachedMap) return cachedMap.get(name);
  // 3. Slow path: build cache on first repeat
  if (TOOL_ARRAYS_SEEN.has(tools)) {
    const built = buildToolNameMap(tools);
    TOOL_NAME_CACHE.set(tools, built);
    return built.get(name);
  }
  // 4. First-touch: linear scan, mark as seen
  TOOL_ARRAYS_SEEN.add(tools);
  return tools.find((tool) => toolMatchesName(tool, name));
}

// Mapping: i4→findToolByName, H→tools, $→name, q→aliasMap, uTK→TOOL_NAME_CACHE, mTK→TOOL_ARRAYS_SEEN, GI1→buildToolNameMap, G1→toolMatchesName
```

## Property keys

Every tool object exposes a subset of these keys. The Tool TypeScript contract (`Tool.ts`) defines the full surface; the factory fills defaults for the optional ones.

### Required for every tool

| Key | Type | Purpose |
|-----|------|---------|
| `name` | `string` | Primary identifier — must match the model-facing tool name in API. Always read from a module-level string constant (e.g., `name: Bq` where `Bq = "Read"`). |
| `description()` | `async () => string` | Short summary for the model (max ~50 chars typical). Shown in tool listings. |
| `prompt({...})` | `async (opts) => string` | The longer per-tool prompt the model sees in the system prompt — includes usage notes, examples, gotchas. |
| `inputSchema` | `z.ZodObject` | Zod schema for input. Implemented as a getter for lazy evaluation. |
| `call(input, ctx, canUseTool, parentMessage, onProgress?)` | `async () => {data, ...}` | The actual work. |
| `mapToolResultToToolResultBlockParam(data, toolUseID)` | `(data, id) => ToolResultBlockParam` | Shapes `data` for the Anthropic API. |
| `renderToolUseMessage(input, opts)` | `(input, opts) => ReactNode` | Activity UI before/during execution. |

### Optional methods with defaults

| Key | Default | Purpose |
|-----|---------|---------|
| `isEnabled()` | `() => true` | Gate the tool entirely (env vars, Statsig). |
| `isConcurrencySafe(input)` | `() => false` | Permits parallel batch execution. **Defaults to false**. |
| `isReadOnly(input)` | `() => false` | Allows running in plan mode or restricted-mode workers. |
| `isDestructive(input)` | `() => false` | Affects classifier / auto-mode policy. |
| `checkPermissions(input, ctx)` | `() => ({behavior:'allow', updatedInput})` | Tool-specific permission logic. |
| `toAutoClassifierInput(input)` | `() => ""` | Compact representation for the security classifier. Empty string skips. |
| `userFacingName(input?)` | `() => H.name` (overridden by factory) | Display name in UI; may vary by input. |

### Optional, no default

| Key | Purpose |
|-----|---------|
| `outputSchema` | Zod schema for output, used by `PostToolUse` hook validators. |
| `aliases` | Backwards-compat names. Resolved by `findToolByName`. |
| `searchHint` | One-line capability phrase for `ToolSearch` keyword matching (e.g., "read files, images, PDFs, notebooks"). |
| `validateInput(input, ctx)` | Semantic validator after Zod parsing. Returns `{result, message?, errorCode?}`. |
| `shouldDefer` | `true` → tool is sent with `defer_loading:true`; must be loaded via `ToolSearch` first. |
| `alwaysLoad` | `true` → never deferred even if `shouldDefer` is true. MCP-specific opt-in. |
| `isMcp` | `true` → tool came from an MCP server. Triggers different error envelopes. |
| `isLsp` | `true` → LSP-backed code intelligence tool. |
| `mcpInfo` | `{serverName, toolName, ...}` — present on all MCP tools. |
| `maxResultSizeChars` | Per-tool budget before result is persisted to disk and replaced with a preview. |
| `strict` | Strict-mode flag for the API (more rigid schema adherence). |
| `backfillObservableInput(input)` | Mutate observable copies of `input` (e.g., resolve relative paths). Idempotent. |
| `getPath(input)` | Extract file path from input (Read/Edit/Write/NotebookEdit). |
| `preparePermissionMatcher(input)` | Build a matcher closure for permission-rule patterns ("Bash(git *)"). |
| `requiresUserInteraction()` | Indicates the tool must run in interactive mode (AskUserQuestion). |
| `isSearchOrReadCommand(input)` | Returns `{isSearch, isRead, isList}` for UI collapsing. |
| `isOpenWorld(input)` | Tool reaches external systems (WebFetch, WebSearch, MCP). |
| `isTransparentWrapper()` | REPL — delegates rendering to inner tool calls. |
| `interruptBehavior()` | `'cancel' \| 'block'` when user submits during execution. |
| `getActivityDescription(input)` | Present-tense spinner verb ("Reading src/foo.ts"). |
| `getToolUseSummary(input)` | Short compact-view summary. |
| `renderToolResultMessage(data, ...)` | Post-run UI (defaults to nothing rendered). |
| `renderToolUseProgressMessage(progress, opts)` | Streaming UI during long calls. |
| `renderToolUseRejectedMessage(input, opts)` | UI when user denies the call. |
| `renderToolUseErrorMessage(content, opts)` | UI on call error. |
| `renderToolUseQueuedMessage()` | UI for queued (waiting-for-permission) tools. |
| `renderToolUseTag(input)` | Optional metadata tag (timeout, model id). |
| `renderGroupedToolUse(toolUses, opts)` | Render N parallel tool uses as one block. |
| `extractSearchText(output)` | Flattened text for transcript search indexing. |
| `isResultTruncated(output)` | Gates click-to-expand affordance. |
| `inputsEquivalent(a, b)` | Dedup check for repeated calls (Read uses this for stale-state detection). |

## Identifier-keyed `name` references

Every tool name is read from a module-scoped constant rather than inlined as a literal. The bundle uses these constants extensively in branchy post-call logic that special-cases the major tools.

### Example: Read tool registration

```javascript
// ============================================
// readTool registration — uses Bq = "Read" constant
// Location: cli_inner_pretty.js:407219-407222
// ============================================

// ORIGINAL (for source lookup):
($Y = XK({
  name: Bq,
  searchHint: "read files, images, PDFs, notebooks",
  maxResultSizeChars: 1 / 0,
  strict: !0,
  ...
}));

// READABLE (for understanding):
readTool = createTool({
  name: READ_TOOL_NAME,                           // "Read" — defined once at module scope
  searchHint: "read files, images, PDFs, notebooks",
  maxResultSizeChars: Infinity,                   // Never persist Read output (would loop)
  strict: true,                                    // API enforces strict schema for this tool
  ...
});

// Mapping: $Y→readTool, XK→createTool, Bq→READ_TOOL_NAME, 1/0→Infinity, !0→true
```

### Tool name constants

| Constant | Value | Location | Used by |
|----------|-------|----------|---------|
| `Bq` | `"Read"` | cli_inner_pretty.js:141539 | Read tool, file-state cache logic, telemetry branches |
| `Sq` | `"Bash"` | cli_inner_pretty.js:141447 | Bash tool, command parser, sandbox checks |
| `v9` | `"Grep"` | cli_inner_pretty.js:141468 | Grep tool, search-tool grouping (`FW_` set) |
| `d1` | `"Glob"` | cli_inner_pretty.js:141564 | Glob tool, search-tool grouping |
| `G7` | `"Edit"` | cli_inner_pretty.js:143068 | Edit tool, file-state cache, REPL prompts |
| `o4` | `"Write"` | cli_inner_pretty.js:207727 | Write tool, file-state cache, REPL prompts |
| `VP` | `"NotebookEdit"` | cli_inner_pretty.js:141573 | NotebookEdit tool, search-tool grouping |
| `EK` | `"PowerShell"` | cli_inner_pretty.js:141574 | PowerShell tool, search-tool grouping |
| `m3` | `"REPL"` | cli_inner_pretty.js:141589 | REPL tool, REPL-only filter |
| `cY` | `"ToolSearch"` | cli_inner_pretty.js:211392 | ToolSearch tool, deferred-tool reminders |
| `NH8` | `"SendUserFile"` | cli_inner_pretty.js:211424 | SendUserFile tool (NEW in v2.1.142) |
| `Q3H` | `"EnterPlanMode"` | cli_inner_pretty.js:211429 | EnterPlanMode tool |
| `Gz` | `"AskUserQuestion"` | cli_inner_pretty.js:211430 | AskUserQuestion tool |
| `Km` | `"TaskStop"` | cli_inner_pretty.js:211475 | TaskStop tool |
| `It` | `"PushNotification"` | cli_inner_pretty.js:211491 | PushNotification tool |
| `hL` | `"Monitor"` | cli_inner_pretty.js:211515 | Monitor tool |
| `$n` | `"TaskOutput"` | cli_inner_pretty.js:211428 | TaskOutput tool |

### Why the indirection matters

The pattern enables three things that inline string literals would obstruct:

1. **Constant comparisons in hot paths.** Tool-dispatch code (around `cli_inner_pretty.js:388297`) repeatedly checks `if (H.name === Bq)` for Read-specific output processing. Using a constant lets the engine optimise this to identity comparison and lets the minifier replace the constant with a one-character variable name throughout the bundle.
2. **Single point of refactor.** A future tool rename (e.g., "Read" → "FileRead") touches one declaration, not 30+ comparison sites.
3. **Cross-module exports.** Permission rules (`tools/BashTool/`-style hierarchies in source), system prompts, and telemetry can all import the name constant from one module and stay in lockstep with the registration.

The deobfuscated TypeScript reference (`/lyz/codespace/3rd/claude-code/src/tools/<X>Tool/<X>Tool.ts`) names them `READ_TOOL_NAME`, `BASH_TOOL_NAME`, etc., reflecting the same intent without minification.

## userFacingName resolution

The `userFacingName` property can be:
- A function `(input?) => string` — recomputed per call (e.g., MCP tools that show server name)
- Defaulted to `() => H.name` by the factory if absent — most tools rely on this

Three patterns appear in the bundle for derived user-facing names. Each is realised as either an inline method on the tool object or a standalone function reused across tools.

### Pattern 1: static override

```javascript
// Most common — returns a single fixed display string regardless of input.
userFacingName: () => "Stop Task",       // taskStopTool — UI display differs from API name
```

### Pattern 2: input-dependent (Bash) — inline arrow + delegation to the Edit-style labeller

The Bash tool resolves its `userFacingName` *inline* as a method on the tool object — there is no dedicated top-level function. It returns one of three label families:

1. `"Bash"` when there is no input (e.g., name lookups before a call).
2. The Edit-style label (`"Updated plan"` for plan-mode files, `"Update"` otherwise) when the command parses as `sed -i …`, because the bundle treats an in-place `sed` as a file-write equivalent. This branch delegates to `editToolUserFacingName` (obfuscated: `Iw8`) — the same function the Edit tool installs as its `userFacingName` — by synthesising a `{file_path, old_string:"x"}` payload. The non-empty `"x"` guarantees the `"Create"` branch of `Iw8` is never reached for Bash, so only `"Updated plan"` or `"Update"` are observable on this code path.
3. `"SandboxedBash"` when the `CLAUDE_CODE_BASH_SANDBOX_SHOW_INDICATOR` env flag is truthy *and* `shouldSandboxThisCommand` (obfuscated: `bV`) reports the command will be sandboxed; otherwise `"Bash"`.

The `sed -i` detection uses `parseSedInPlace` (obfuscated: `FvH`), the same parser that the sandbox/permission layer uses to recognise edit-equivalent shell commands.

```javascript
// ============================================
// bashToolUserFacingName - Bash's input-dependent display name
// Location: cli_inner_pretty.js:419501-419509
// ============================================

// ORIGINAL (for source lookup):
userFacingName(H) {
  if (!H) return "Bash";
  if (H.command) {
    let $ = FvH(H.command);
    if ($) return Iw8({ file_path: $.filePath, old_string: "x" });
  }
  return bH(process.env.CLAUDE_CODE_BASH_SANDBOX_SHOW_INDICATOR) && bV(H) ? "SandboxedBash" : "Bash";
},

// READABLE (for understanding):
userFacingName(input) {
  if (!input) return "Bash";                                  // No input yet → static label
  if (input.command) {
    const sedEdit = parseSedInPlace(input.command);           // FvH: recognise `sed -i` edits
    if (sedEdit) {
      // Treat in-place sed as a file edit and reuse the Edit tool's labeller
      // so a `sed -i` shows as "Updated plan" (for plan-mode files) or "Update" in the UI.
      // old_string is hardcoded non-empty to bypass Iw8's "Create" branch.
      return editToolUserFacingName({ file_path: sedEdit.filePath, old_string: "x" });
    }
  }
  // Sandbox indicator: show "SandboxedBash" only if BOTH the env flag is set
  // AND the per-input sandbox decision actually sandboxes this command.
  return parseBoolean(process.env.CLAUDE_CODE_BASH_SANDBOX_SHOW_INDICATOR) && shouldSandboxThisCommand(input)
    ? "SandboxedBash"
    : "Bash";
},

// Mapping: H→input, FvH→parseSedInPlace, Iw8→editToolUserFacingName, bH→parseBoolean, bV→shouldSandboxThisCommand
```

**Why the indirection?** The Edit tool's `userFacingName` (`Iw8`) already knows how to special-case plan-mode files ("Updated plan") and create-vs-update labelling. By piping a `sed -i` through the same labeller, Bash inherits that logic for free instead of duplicating the plan-directory string-prefix check inside its own method.

### Pattern 3: MCP-derived

```javascript
// MCP wrappers include the server identity in the display name so the user
// can distinguish two servers' tools that share a base name.
userFacingName: () => `${tool.name} - ${mcpServer.annotations?.title || mcpServer.name} (MCP)`,
//                                ^^ MCP tool name         ^^ MCP server name (annotated title preferred)
```

### Related labelling helpers

The "Updated plan" / "Update" / "Create" / "Write" strings are *not* a Bash concept — they originate from two file-write tools:

- `editToolUserFacingName` (obfuscated: `Iw8`) at `cli_inner_pretty.js:415257-415263` — installed as the Edit tool's `userFacingName`. Returns `"Update"` (default, no input, or non-empty `old_string` with no `edits`), `"Updated plan"` (file under plan dir), `"Update"` (when `edits != null`), or `"Create"` (when `old_string === ""`). Reused by Bash for `sed -i`.
- `writeToolUserFacingName` (obfuscated: `mp7`) at `cli_inner_pretty.js:359731-359734` — installed as the Write tool's `userFacingName`. Returns `"Updated plan"` when the write target is under `getPlanDirPrefix()` (obfuscated: `SO`), otherwise `"Write"`.

Both helpers gate the `"Updated plan"` string on the file path starting with the plan-mode directory prefix.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - v2.1.142 additions: [symbol_additions_v2_1_142_tools_arch.md](../00_overview/symbol_additions_v2_1_142_tools_arch.md)

Key functions in this document:
- `createTool` (obfuscated: `XK`) - Tool factory that wraps a partial definition with `TOOL_DEFAULTS`
- `TOOL_DEFAULTS` (obfuscated: `TI1`) - Default method table merged by `createTool`
- `findToolByName` (obfuscated: `i4`) - Resolve tool by name/alias with WeakMap cache
- `buildToolNameMap` (obfuscated: `GI1`) - Build a name→tool map from a Tools array
- `toolMatchesName` (obfuscated: `G1`) - Name/alias matcher predicate
- `READ_TOOL_NAME` (obfuscated: `Bq`) - `"Read"` constant
- `BASH_TOOL_NAME` (obfuscated: `Sq`) - `"Bash"` constant
- `EDIT_TOOL_NAME` (obfuscated: `G7`) - `"Edit"` constant
- `WRITE_TOOL_NAME` (obfuscated: `o4`) - `"Write"` constant
- `SEND_USER_FILE_TOOL_NAME` (obfuscated: `NH8`) - `"SendUserFile"` constant (NEW v2.1.142)
- `TOOL_SEARCH_TOOL_NAME` (obfuscated: `cY`) - `"ToolSearch"` constant
