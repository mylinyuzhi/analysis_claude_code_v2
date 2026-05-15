# Schema Validation — Zod inputSchema + validateInput

> Every tool input passes through two validation layers before `call` runs. The first is structural (Zod); the second is semantic (custom `validateInput`).

## Why two layers

A Zod schema can express "string with min length 1" or "enum of these values" but cannot express "this absolute path is not in a deny-listed directory" or "this cron expression is parseable". Splitting them keeps the schema declarative (what the model sees) and the semantic checks imperative (what the host enforces).

The split also matters for **error attribution**: structural errors are framed as `InputValidationError`, signalling to the model that it produced malformed JSON; semantic errors are framed as `<tool_use_error>` with a domain-specific message, signalling that the call shape was fine but the request couldn't be fulfilled.

## Layer 1: Zod input schema

### Pattern: lazy schema via `yH` wrapper

All input schemas in the bundle are wrapped by `yH(() => z.object({...}))` rather than defined eagerly. This is the lazy-evaluation primitive that pairs with `XK`'s descriptor-preserving spread.

```javascript
// ============================================
// Read tool inputSchema getter
// Location: cli_inner_pretty.js:407235-407237 (registration), C45 defined nearby
// ============================================

// ORIGINAL (for source lookup):
get inputSchema() {
  return C45();
},

// READABLE (for understanding):
get inputSchema() {
  // C45 is a memoised factory: first call builds the Zod schema, subsequent calls return it
  // (yH() wraps a Zod-construction function; result is cached on first invocation)
  return buildReadInputSchema();
},

// Mapping: C45→buildReadInputSchema
```

**What `yH` does:** Returns a function that, on first call, evaluates its argument and caches the result. Subsequent calls return the cached Zod object. This means even though the *getter* runs every property-access, the actual Zod schema construction happens at most once per process.

**Why this approach:**
1. **Cold-start performance.** Zod schemas can be expensive to build (especially union/discriminated-union schemas like Read's output). Lazy construction shaves cold-start tens of milliseconds.
2. **Conditional schema content.** Several tools' schemas depend on runtime state (feature flags, sandbox availability). `yH(() => ...)` lets the schema reflect the state at first use rather than module-load.
3. **Avoiding circular imports.** Some schemas reference other module exports that aren't yet defined when the registration block runs.

### Pattern: `.strictObject` vs `.object` vs `.passthrough`

| Variant | Behaviour | Used by |
|---------|-----------|---------|
| `y.strictObject(...)` | Reject unknown keys → schema error | SendUserFile, AskUserQuestion, most strict tools |
| `y.object(...)` | Ignore unknown keys silently | Most tools |
| `y.object(...).passthrough()` | Preserve unknown keys in parsed output | `mcp` catch-all base tool (forwards arbitrary args) |

The MCP base tool uses `passthrough` because its input shape is unknown at registration — each MCP server contributes its own `inputJSONSchema` at runtime.

## Layer 2: validateInput (`validateInput`)

### Contract

```typescript
validateInput?(input, ctx) => Promise<{result: true} | {result: false, message: string, errorCode: number}>
```

Returns `{result:true}` to proceed, or `{result:false, message, errorCode}` to reject. The `message` is shown directly to the model (wrapped in `<tool_use_error>`). The `errorCode` is forwarded to telemetry (`tengu_tool_use_error.errorCode`) so failures can be tracked over time without parsing message strings.

### Examples

#### Read — path & file-type validation

```javascript
// ============================================
// readTool.validateInput — path policy + binary file rejection
// Location: cli_inner_pretty.js:407300-407339
// ============================================

// ORIGINAL (for source lookup):
async validateInput({ file_path: H, pages: $ }, q) {
  if ($ !== void 0) {
    let f = fK6($);
    if (!f) return { result: !1, message: `Invalid pages parameter: "${$}". Use formats like "1-5", ...`, errorCode: 7 };
    if ((f.lastPage === 1 / 0 ? ZGH + 1 : f.lastPage - f.firstPage + 1) > ZGH)
      return { result: !1, message: `Page range "${$}" exceeds maximum of ${ZGH} pages per request. ...`, errorCode: 8 };
  }
  let K = eq(H), _ = q.getAppState();
  if (yL(K, _.toolPermissionContext, "read", "deny") !== null)
    return { result: !1, message: "File is in a directory that is denied by your permission settings.", errorCode: 1 };
  if (K.startsWith("\\\\") || K.startsWith("//")) return { result: !0 };
  let Y = TNH.extname(K).toLowerCase();
  if (Nq$(K) && !YBH(Y) && !ne7.has(Y.slice(1)))
    return { result: !1, message: `This tool cannot read binary files. ...`, errorCode: 4 };
  if (h45(K)) return { result: !1, message: `Cannot read '${H}': this device file would block or produce infinite output.`, errorCode: 9 };
  return { result: !0 };
},

// READABLE (for understanding):
async validateInput({ file_path, pages }, ctx) {
  // 1. PDF page-range validation (if provided)
  if (pages !== undefined) {
    const parsed = parsePagesParam(pages);
    if (!parsed) {
      return { result: false, message: `Invalid pages parameter: "${pages}". Use formats like "1-5", "3", or "10-20".`, errorCode: 7 };
    }
    const count = parsed.lastPage === Infinity ? MAX_PAGES + 1 : parsed.lastPage - parsed.firstPage + 1;
    if (count > MAX_PAGES) {
      return { result: false, message: `Page range "${pages}" exceeds maximum of ${MAX_PAGES} pages per request.`, errorCode: 8 };
    }
  }
  // 2. Deny-rule check against the resolved absolute path
  const absPath = resolvePath(file_path);
  const appState = ctx.getAppState();
  if (matchesDenyRule(absPath, appState.toolPermissionContext, "read", "deny") !== null) {
    return { result: false, message: "File is in a directory that is denied by your permission settings.", errorCode: 1 };
  }
  // 3. UNC paths bypass extension checks (Windows network shares)
  if (absPath.startsWith("\\\\") || absPath.startsWith("//")) return { result: true };
  // 4. Binary file rejection (unless whitelisted ext or known-readable binary)
  const ext = path.extname(absPath).toLowerCase();
  if (isBinaryByMagic(absPath) && !isReadableImageExt(ext) && !READABLE_BINARY_EXTS.has(ext.slice(1))) {
    return { result: false, message: "This tool cannot read binary files. ...", errorCode: 4 };
  }
  // 5. Device-file rejection (/dev/random, /dev/zero, named pipes)
  if (isDeviceFile(absPath)) {
    return { result: false, message: `Cannot read '${file_path}': this device file would block or produce infinite output.`, errorCode: 9 };
  }
  return { result: true };
},

// Mapping: H→file_path, $→pages, q→ctx, fK6→parsePagesParam, eq→resolvePath, yL→matchesDenyRule, Nq$→isBinaryByMagic, YBH→isReadableImageExt, ne7→READABLE_BINARY_EXTS, h45→isDeviceFile, ZGH→MAX_PAGES
```

**Why a separate validator (vs Zod):**
- The deny-rule lookup needs `ctx.getAppState()` for the live permission context. Zod can't run effects.
- Binary detection requires reading the file's first bytes (magic check). Sync I/O in a schema would block parsing.
- Errors carry per-failure-mode `errorCode` numbers used for telemetry aggregation.

**Key insight:** The order matters: PDF range check → deny rules → UNC bypass → binary check → device-file check. The expensive checks (filesystem reads in binary detection) run last, after the cheap policy checks. A path denied by rules is rejected without touching the filesystem.

#### SendUserFile — file existence

```javascript
// ============================================
// sendUserFileTool.validateInput — delegate to j38 helper
// Location: cli_inner_pretty.js:385843-385845
// ============================================

// ORIGINAL (for source lookup):
async validateInput({ files: H }, $) {
  return j38(H);
},

// READABLE (for understanding):
async validateInput({ files }, _ctx) {
  // j38 = validateSendUserFilePaths: checks every file in the array exists, is not a directory,
  // and is within an allowed root. Returns {result:true} or {result:false, message, errorCode}.
  return validateSendUserFilePaths(files);
},

// Mapping: H→files, j38→validateSendUserFilePaths, $→_ctx
```

#### TaskStop — task existence

```javascript
// ============================================
// taskStopTool.validateInput — verify task_id resolves to a running task
// Location: cli_inner_pretty.js:381014
// ============================================

// ORIGINAL (for source lookup):
async validateInput({ task_id: H }, { getAppState: $ }) {
  let q = $().tasks[H];
  if (!q) return { result: !1, message: `No task found with id "${H}"`, errorCode: 1 };
  if (q.status !== "running") return { result: !1, message: `Task "${H}" is not running (status: ${q.status})`, errorCode: 2 };
  return { result: !0 };
},

// READABLE (for understanding):
async validateInput({ task_id }, { getAppState }) {
  const task = getAppState().tasks[task_id];
  if (!task) {
    return { result: false, message: `No task found with id "${task_id}"`, errorCode: 1 };
  }
  if (task.status !== "running") {
    return { result: false, message: `Task "${task_id}" is not running (status: ${task.status})`, errorCode: 2 };
  }
  return { result: true };
},

// Mapping: H→task_id, $→getAppState, q→task
```

## Error propagation

### Stage A — Zod parse failure

```javascript
// ============================================
// dispatchTool — Stage 1 Zod parse error → InputValidationError
// Location: cli_inner_pretty.js:387980-388002 (extracted)
// ============================================

// ORIGINAL (for source lookup):
// (Reconstructed; surrounding code is the dispatcher loop around line 387986)
let j = H.inputSchema.safeParse(L);
if (!j.success) {
  let KH = j.error.message?.slice(0, 200) ?? "input did not match schema";
  // returns a tool_result with is_error: true and content `<tool_use_error>InputValidationError: ${KH}</tool_use_error>`
}

// READABLE (for understanding):
const parsed = tool.inputSchema.safeParse(rawInput);
if (!parsed.success) {
  const truncatedMessage = parsed.error.message?.slice(0, 200) ?? "input did not match schema";
  return makeToolErrorResult({
    toolUseID,
    content: `<tool_use_error>InputValidationError: ${truncatedMessage}</tool_use_error>`,
    is_error: true,
    toolUseResult: `InputValidationError: ${parsed.error.message}`,
  });
}

// Mapping: j→parsed, L→rawInput, KH→truncatedMessage
```

**Why 200-char truncation:** Zod error messages for deep schemas can run to thousands of characters listing every union variant. The 200-char cap prevents the error envelope from dominating the model's context. The full error stays in `toolUseResult` for telemetry.

### Stage B — validateInput rejection

```javascript
// ============================================
// dispatchTool — Stage 2 validateInput error
// Location: cli_inner_pretty.js:388004-388039
// ============================================

// ORIGINAL (for source lookup):
let J = await H.validateInput?.(j.data, K);
if (J?.result === !1)
  return (
    N(`${H.name} tool validation error: ${J.message?.slice(0, 200)}`),
    J8(w, "tool_validate_input_rejected"),
    d("tengu_tool_use_error", {
      messageID: z, toolName: r7(H.name), error: J.message, errorCode: J.errorCode,
      isMcp: H.isMcp ?? !1, ...
    }),
    [{ message: w8({ content: [{ type: "tool_result", content: `<tool_use_error>${J.message}</tool_use_error>`, is_error: !0, tool_use_id: $ }], toolUseResult: `Error: ${J.message}`, sourceToolAssistantUUID: A.uuid }) }]
  );

// READABLE (for understanding):
const validation = await tool.validateInput?.(parsed.data, ctx);
if (validation?.result === false) {
  logger.warn(`${tool.name} tool validation error: ${validation.message?.slice(0, 200)}`);
  releaseSemaphore(turnSpan, "tool_validate_input_rejected");
  // Telemetry: include errorCode for aggregation
  emitTelemetry("tengu_tool_use_error", {
    messageID, toolName: anonymiseToolName(tool.name),
    error: validation.message, errorCode: validation.errorCode,
    isMcp: tool.isMcp ?? false,
    ...
  });
  return [{
    message: makeMessage({
      content: [{
        type: "tool_result",
        content: `<tool_use_error>${validation.message}</tool_use_error>`,
        is_error: true,
        tool_use_id: toolUseID,
      }],
      toolUseResult: `Error: ${validation.message}`,
      sourceToolAssistantUUID: parentMessage.uuid,
    }),
  }];
}

// Mapping: H→tool, j.data→parsed.data, K→ctx, J→validation, N→logger.warn, d→emitTelemetry, w8→makeMessage, $→toolUseID, A→parentMessage, r7→anonymiseToolName
```

### What the model sees

```
<tool_use_error>InputValidationError: Expected string at "file_path", received undefined</tool_use_error>
```

vs.

```
<tool_use_error>This tool cannot read binary files. The file appears to be a binary .exe file. Please use appropriate tools for binary file analysis.</tool_use_error>
```

The difference signals to the model whether to retry with corrected JSON (Stage A) or to pick a different tool / approach (Stage B).

## Strict mode (`strict: true`)

A few tools (notably `Read`) set `strict: true`. This propagates to the API as the `strict` field on the tool definition. When set, the API enforces the schema more rigidly — for example, refusing extra properties even if the schema is non-strict in Zod.

**Why selective:** Strict mode catches more bugs but reduces flexibility. The Anthropic team enables it for tools where the cost of an extra property is high (Read needs precise `file_path`/`offset`/`limit` to avoid duplicate file-state cache entries) but leaves it off where flexibility matters (Bash, where new properties may be added gradually).

The `tengu_tool_pear` Statsig gate controls whether `strict: true` is actually applied at request time; the property only takes effect when the gate is on.

## Input coercion via `backfillObservableInput`

After Zod validates and before observers (hooks, transcript, canUseTool) see the input, `backfillObservableInput` runs on a **copy** of the input. It can mutate that copy in place to add legacy/derived fields.

```javascript
// ============================================
// readTool.backfillObservableInput — resolve to absolute path for observers
// Location: cli_inner_pretty.js:407262-407264
// ============================================

// ORIGINAL (for source lookup):
backfillObservableInput(H) {
  if (typeof H.file_path === "string") H.file_path = eq(H.file_path);
},

// READABLE (for understanding):
backfillObservableInput(observableInput) {
  // Resolve to an absolute path so PreToolUse hooks see the same thing the call will use.
  // The ORIGINAL API-bound input keeps the relative path (preserves prompt cache).
  if (typeof observableInput.file_path === "string") {
    observableInput.file_path = resolvePath(observableInput.file_path);
  }
},

// Mapping: H→observableInput, eq→resolvePath
```

**Why a copy, not the original:** The original input is sent to the API verbatim. Rewriting it (e.g., turning `./foo.ts` into `/abs/path/foo.ts`) would bust the prompt cache — every Read call would have a unique fully-resolved path even if the model emitted the same shorthand. The copy is for **observers** (hooks, transcript display, `canUseTool` permission callback) who benefit from seeing the resolved form.

**Key insight:** This is a subtle but important separation: what the model "said" vs. what the host "knows". The model said `./foo.ts`; the host knows it means `/abs/path/foo.ts`. Hooks need the latter to write meaningful policies (`Bash(rm -rf /home/*)`), but the API caches the former to avoid re-transmitting the system prompt.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - v2.1.142 additions: [symbol_additions_v2_1_142_tools_arch.md](../00_overview/symbol_additions_v2_1_142_tools_arch.md)

Key functions in this document:
- `validateSendUserFilePaths` (obfuscated: `j38`) - File path validator for SendUserFile
- `parsePagesParam` (obfuscated: `fK6`) - Parse PDF page range param (e.g. "1-5")
- `resolvePath` (obfuscated: `eq`) - Relative→absolute path resolver
- `matchesDenyRule` (obfuscated: `yL`) - Look up deny rule for path
- `isBinaryByMagic` (obfuscated: `Nq$`) - Detect binary file by leading bytes
- `isDeviceFile` (obfuscated: `h45`) - Detect /dev/* or named-pipe paths
- `MAX_PAGES` (obfuscated: `ZGH`) - PDF max-pages-per-request limit
- `anonymiseToolName` (obfuscated: `r7`) - Strip MCP server prefix for telemetry
