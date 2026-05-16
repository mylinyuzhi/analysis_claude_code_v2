# MCP Tool Hooks — `type: "mcp_tool"` (v2.1.118)

## Overview

v2.1.118 introduces a new hook type, `type: "mcp_tool"`. Instead of shelling out to a process, the hook invokes a tool on an already-configured MCP server. The changelog:

> Hooks can invoke MCP tools via `type: "mcp_tool"`

This unlocks structured hook authoring: a plugin can ship a single MCP server with multiple tools, and hook entries can call those tools directly without process spawning, JSON-stringification through stdin, or argument escaping. The hook input JSON is exposed via `${path.expr}` interpolation in the tool's arguments.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Hooks
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - MCP
> - [symbol_additions_v2_1_142_hooks.md](../00_overview/symbol_additions_v2_1_142_hooks.md) - New symbols

Key functions in this document:

- `mcpToolHook` (`XQ6`) — Executor: looks up MCP server, calls tool, parses output
- `interpolateMCPHookInput` (`hu5`) — Substitutes `${path.expr}` from hook input JSON
- `McpToolHookSchema` (returned by `Th9`) — Zod schema for the hook type
- `getMCPClients` (`xXH`) — Fallback to global MCP client list when toolUseContext is absent

## Schema Definition

```javascript
// ============================================
// McpToolHookSchema - Hook config for MCP tool invocation
// Location: cli_inner_pretty.js:48792-48806
// ============================================

// ORIGINAL (for source lookup):
q = y.object({
    type: y.literal("mcp_tool").describe("MCP tool hook type"),
    server: y.string().describe("Name of an already-configured MCP server to invoke"),
    tool: y.string().describe("Name of the tool on that server to call"),
    input: y.record(y.string(), y.unknown()).optional().describe(
      'Arguments passed to the MCP tool. String values support ${path} interpolation from the hook input JSON (e.g. "${tool_input.file_path}").',
    ),
    if: lq$(),
    timeout: y.number().positive().optional(),
    statusMessage: y.string().optional(),
    once: y.boolean().optional(),
})

// READABLE (for understanding):
const McpToolHookSchema = z.object({
  type: z.literal("mcp_tool"),
  server: z.string(),                              // MCP server name (must be connected)
  tool: z.string(),                                // Tool name on that server
  input: z.record(z.string(), z.unknown()).optional(),  // Tool args, with ${path} interpolation
  if: hookIfSchema(),
  timeout: z.number().positive().optional(),
  statusMessage: z.string().optional(),
  once: z.boolean().optional(),
});

// Mapping: q→McpToolHookSchema, y→zod, lq$→hookIfSchema
```

Example config:
```json
{
  "PostToolUse": [{
    "matcher": "Edit|Write",
    "hooks": [{
      "type": "mcp_tool",
      "server": "code-quality",
      "tool": "lint_file",
      "input": { "path": "${tool_input.file_path}" }
    }]
  }]
}
```

## Input Interpolation

```javascript
// ============================================
// interpolateMCPHookInput - ${path.expr} substitution for tool args
// Location: cli_inner_pretty.js:519791-519816
// ============================================

// ORIGINAL (for source lookup):
function hu5(H, $) {
  let q = (_) => {
      let A = $;
      for (let z of _.split(".")) {
        if (A == null || typeof A !== "object") return;
        A = A[z];
      }
      return A;
    },
    K = (_) => {
      if (typeof _ === "string")
        return _.replace(/\$\{([a-zA-Z_][a-zA-Z0-9_.]*)\}/g, (A, z) => {
          let Y = q(z);
          if (Y === void 0 || Y === null) return "";
          return typeof Y === "object" ? SH(Y) : String(Y);
        });
      if (Array.isArray(_)) return _.map(K);
      if (_ !== null && typeof _ === "object") {
        let A = {};
        for (let [z, Y] of Object.entries(_)) A[z] = K(Y);
        return A;
      }
      return _;
    };
  return K(H);
}

// READABLE (for understanding):
function interpolateMCPHookInput(toolInputTemplate, hookInputJSON) {
  // Walker that resolves a dotted path like "tool_input.file_path" against the hook input
  const resolveDotPath = (dotPath) => {
    let cursor = hookInputJSON;
    for (const segment of dotPath.split(".")) {
      if (cursor == null || typeof cursor !== "object") return undefined;
      cursor = cursor[segment];
    }
    return cursor;
  };

  // Recursive substituter — walks through strings, arrays, and objects
  const substitute = (value) => {
    if (typeof value === "string") {
      // Match ${identifier(.identifier)*}
      return value.replace(/\$\{([a-zA-Z_][a-zA-Z0-9_.]*)\}/g, (_match, path) => {
        const resolved = resolveDotPath(path);
        if (resolved === undefined || resolved === null) return "";   // Missing path → empty string
        return typeof resolved === "object"
          ? JSON.stringify(resolved)                                   // Nested object → JSON-serialized
          : String(resolved);
      });
    }
    if (Array.isArray(value)) return value.map(substitute);
    if (value !== null && typeof value === "object") {
      const result = {};
      for (const [k, v] of Object.entries(value)) result[k] = substitute(v);
      return result;
    }
    return value;
  };

  return substitute(toolInputTemplate);
}

// Mapping:
//   hu5→interpolateMCPHookInput, H→toolInputTemplate, $→hookInputJSON,
//   q→resolveDotPath, K→substitute, SH→JSON.stringify
```

## Executor

```javascript
// ============================================
// mcpToolHook - MCP tool hook executor
// Location: cli_inner_pretty.js:519817-519849
// ============================================

// ORIGINAL (for source lookup):
async function XQ6(H, $, q, K, _, A = p_) {
  let z = K ?? xXH();
  if (z === void 0) {
    let D = `mcp_tool hooks are not available for the '${$}' hook event (no MCP client context)`;
    return (N(`Hooks: mcp_tool hook skipped — ${D}`, { level: "warn" }), { ok: !1, body: "", error: D });
  }
  let Y = z.find((D) => D.name === H.server);
  if (!Y || Y.type !== "connected") {
    let D = `MCP server '${H.server}' not connected`;
    return (N(`Hooks: mcp_tool hook skipped — ${D}`, { level: "warn" }), { ok: !1, body: "", error: D });
  }
  let f = H.input ? hu5(H.input, q) : {},
    O = H.timeout ? H.timeout * 1000 : A,
    { signal: M, cleanup: w } = yV(_, { timeoutMs: O });
  try {
    N(`Hooks: mcp_tool calling ${H.server}/${H.tool} with ${Object.keys(f).length} arg(s)`);
    let D = await Y.client.callTool({ name: H.tool, arguments: f }, Dh, { signal: M, timeout: O });
    w();
    let j = Array.isArray(D.content)
      ? D.content.map((J) => (J.type === "text" ? J.text : `[${J.type}]`)).join(`\n`)
      : "";
    if (D.isError) return { ok: !1, body: j, error: j || "MCP tool returned an error" };
    return { ok: !0, body: j };
  } catch (D) {
    if ((w(), M.aborted)) return { ok: !1, body: "", aborted: !0 };
    let j = ZH(D);
    return (N(`Hooks: mcp_tool hook error: ${j}`, { level: "error" }), { ok: !1, body: "", error: j });
  }
}

// READABLE (for understanding):
async function mcpToolHook(hook, hookEvent, hookInputJSON, mcpClients, parentSignal, timeoutMs = DEFAULT_HOOK_TIMEOUT) {
  // 1. Resolve MCP client list — prefer toolUseContext's clients, fall back to global registry
  const clients = mcpClients ?? getMCPClients();
  if (clients === undefined) {
    const reason = `mcp_tool hooks are not available for the '${hookEvent}' hook event (no MCP client context)`;
    logForDebugging(`Hooks: mcp_tool hook skipped — ${reason}`, { level: "warn" });
    return { ok: false, body: "", error: reason };
  }

  // 2. Find the named server and verify it's connected
  const server = clients.find((c) => c.name === hook.server);
  if (!server || server.type !== "connected") {
    const reason = `MCP server '${hook.server}' not connected`;
    logForDebugging(`Hooks: mcp_tool hook skipped — ${reason}`, { level: "warn" });
    return { ok: false, body: "", error: reason };
  }

  // 3. Interpolate ${path} placeholders against the hook input JSON
  const toolArgs = hook.input ? interpolateMCPHookInput(hook.input, hookInputJSON) : {};
  const effectiveTimeout = hook.timeout ? hook.timeout * 1000 : timeoutMs;
  const { signal, cleanup } = createCombinedAbortSignal(parentSignal, { timeoutMs: effectiveTimeout });

  try {
    logForDebugging(
      `Hooks: mcp_tool calling ${hook.server}/${hook.tool} with ${Object.keys(toolArgs).length} arg(s)`,
    );
    // 4. Call the tool through the MCP client (signal + timeout cover cancellation)
    const result = await server.client.callTool(
      { name: hook.tool, arguments: toolArgs },
      mcpCallToolSchema,
      { signal, timeout: effectiveTimeout },
    );
    cleanup();

    // 5. Concatenate all text-type content blocks; mark non-text with their type for traceability
    const body = Array.isArray(result.content)
      ? result.content
          .map((c) => (c.type === "text" ? c.text : `[${c.type}]`))
          .join("\n")
      : "";

    if (result.isError) {
      return { ok: false, body, error: body || "MCP tool returned an error" };
    }
    return { ok: true, body };
  } catch (e) {
    cleanup();
    if (signal.aborted) return { ok: false, body: "", aborted: true };
    const message = errorMessage(e);
    logForDebugging(`Hooks: mcp_tool hook error: ${message}`, { level: "error" });
    return { ok: false, body: "", error: message };
  }
}

// Mapping:
//   XQ6→mcpToolHook, H→hook, $→hookEvent, q→hookInputJSON, K→mcpClients, _→parentSignal, A→timeoutMs,
//   z→clients, Y→server, f→toolArgs, O→effectiveTimeout, M→signal, w→cleanup, D→result, j→body,
//   xXH→getMCPClients, p_→DEFAULT_HOOK_TIMEOUT, yV→createCombinedAbortSignal,
//   Dh→mcpCallToolSchema, ZH→errorMessage, hu5→interpolateMCPHookInput
```

## YW Sync-driver Branch

The synchronous hook driver `YW` (used for events without conversation context like PreCompact, SessionEnd) also handles `mcp_tool`:

```javascript
// ============================================
// YWHookSyncDriver - mcp_tool branch (no toolUseContext path)
// Location: cli_inner_pretty.js:522260-522295
// ============================================

// ORIGINAL (for source lookup):
if (X.type === "mcp_tool") {
  let I = `${X.server}/${X.tool}`;
  try {
    let h = await XQ6(X, A, $, void 0, K, _);    // ← K=void 0 means "use global xXH() clients"
    if (h.aborted)
      return ((D ??= "hook_cancelled"), { command: I, succeeded: !1, output: "Hook cancelled", blocked: !1 });
    if (h.error || !h.ok)
      return (
        (D ??= "hook_mcp_tool_failed"),
        { command: I, succeeded: !1, output: h.error || "MCP tool returned an error", blocked: !1 }
      );
    let { json: C, validationError: R } = VW8(h.body);
    if (R) throw Error(R);
    let B = C && ZS(C) ? C : void 0,
      u = B?.decision === "block";
    return (
      ZW8(C, z),                                    // ← terminalSequence side-channel
      {
        command: I, succeeded: !0,
        output: u ? B?.reason || "" : h.body, blocked: u,
        watchPaths: B?.hookSpecificOutput && "watchPaths" in B.hookSpecificOutput ? B.hookSpecificOutput.watchPaths : void 0,
        systemMessage: B?.systemMessage,
      }
    );
  } catch (h) {
    let C = h instanceof Error ? h.message : String(h);
    return (
      N(`${z} [${I}] failed to run: ${C}`, { level: "error" }),
      (D ??= "hook_mcp_exec_failed"),
      { command: I, succeeded: !1, output: C, blocked: !1 }
    );
  }
}

// READABLE (for understanding):
if (entry.hook.type === "mcp_tool") {
  const commandLabel = `${entry.hook.server}/${entry.hook.tool}`;
  try {
    // Note: 4th param (mcpClients) is undefined here — mcpToolHook falls back to getMCPClients()
    const result = await mcpToolHook(entry.hook, hookEvent, hookInput, undefined, signal, timeoutMs);
    if (result.aborted) {
      errorReason ??= "hook_cancelled";
      return { command: commandLabel, succeeded: false, output: "Hook cancelled", blocked: false };
    }
    if (result.error || !result.ok) {
      errorReason ??= "hook_mcp_tool_failed";
      return {
        command: commandLabel,
        succeeded: false,
        output: result.error || "MCP tool returned an error",
        blocked: false,
      };
    }
    // Parse hook JSON output (decision:block, systemMessage, watchPaths, terminalSequence...)
    const { json, validationError } = parseHookOutput(result.body);
    if (validationError) throw Error(validationError);
    const parsed = json && isPlainObject(json) ? json : undefined;
    const isBlocked = parsed?.decision === "block";
    return (
      dispatchTerminalSequence(json, hookLabel),   // emit terminalSequence (v2.1.141)
      {
        command: commandLabel,
        succeeded: true,
        output: isBlocked ? parsed?.reason || "" : result.body,
        blocked: isBlocked,
        watchPaths:
          parsed?.hookSpecificOutput && "watchPaths" in parsed.hookSpecificOutput
            ? parsed.hookSpecificOutput.watchPaths
            : undefined,
        systemMessage: parsed?.systemMessage,
      }
    );
  } catch (e) {
    const errorText = e instanceof Error ? e.message : String(e);
    logForDebugging(`${hookLabel} [${commandLabel}] failed to run: ${errorText}`, { level: "error" });
    errorReason ??= "hook_mcp_exec_failed";
    return { command: commandLabel, succeeded: false, output: errorText, blocked: false };
  }
}

// Mapping: X→entry.hook, A→hookEvent, $→hookInput, K→mcpClients,
//   _→signal, z→hookLabel, h→result, ZW8→dispatchTerminalSequence, VW8→parseHookOutput
```

## Streaming-driver Branch

In `aP` (the streaming hook driver used for most events), `mcp_tool` gets its own branch (`cli_inner_pretty.js:521644-521770`). Functionally similar to `YW`'s branch but yields progress and result messages through the iterator instead of returning a single value.

## Key Decisions/Algorithms

### Server lookup is name+state-based

**What it does:** `clients.find(c => c.name === hook.server)` then `server.type === "connected"`.

**How it works:**
1. The clients list includes both connected and disconnected servers.
2. Name match is exact (case-sensitive).
3. Type check filters out disconnected / pending / errored states.

**Why this approach:**
- Hooks are matched and queued before the executor knows which servers are healthy. Filtering at hook-run time means a temporarily-down server cleanly fails without poisoning the entire hook chain.
- The error message `"MCP server 'X' not connected"` is actionable: user can `/mcp` to reconnect.

**Key insight:** This is a **soft fail** — the hook errors but doesn't block the event. The hook chain continues; the error appears in transcript as a non-blocking error. Compare to the alternative of refusing to start the event ("can't begin PostToolUse because X is down"), which would surface as user-visible event-execution failure.

### `${path}` interpolation supports dotted paths

**What it does:** `"${tool_input.file_path}"` reaches into `hookInputJSON.tool_input.file_path`.

**How it works:**
- Path is split on `.` into segments.
- A walker steps through `hookInputJSON` one segment at a time.
- Each step checks `cursor == null || typeof cursor !== "object"` to handle missing intermediate keys safely — returns `undefined` rather than throwing.
- Missing-key resolves to empty string in the substituted output (not `"undefined"`, which would be confusing in a `path` argument).

**Why this approach:**
- Most hooks need to project a specific nested field (the tool input, an error message, a session ID). Dotted paths cover this cleanly without exposing eval semantics.
- Empty-string fallback (not error or undefined-string) is **safer in misconfigured cases**: a hook expecting `${tool_input.file}` against an event without `tool_input` gets `path: ""`, which usually fails downstream with a sensible "path required" error from the MCP tool itself.

**Key insight:** This is a **strict template language**: no expressions, no transforms, no defaults. The MCP tool is expected to validate its own arguments. The hook authoring contract is "pluck values; don't compute."

### Object values serialize as JSON

**What it does:** If a `${path}` resolves to an object/array, it's `JSON.stringify`'d into the string.

**Why this approach:**
- Some MCP tools take JSON-stringified args (e.g., a "validate" tool that accepts a serialized AST). Without auto-stringification, the hook author would have to template the whole JSON manually — error-prone.
- The recursive `substitute` function ALSO recurses into object/array values directly when they're top-level — so a hook arg that's `{"path": "${tool_input.file_path}"}` substitutes inside.

**Key insight:** Two paths through the substituter: **string values** are pattern-replaced with stringified resolutions; **object/array values** are recursed into. The distinction matters: hook author who writes `{"meta": "${tool_input}"}` gets the full JSON dump as a string, but writing `{"meta": {"sub": "${tool_input.file_path}"}}` gets a structured object with the file_path projected.

### Empty body if non-text content

**What it does:** If `result.content` is an array, text blocks are joined with newlines; non-text blocks (image, resource) appear as `[type]` placeholders.

**Why this approach:**
- Hook output is fundamentally string-oriented (parsed as JSON or treated as plaintext). Image content from an MCP tool can't be rendered in the hook chain.
- The `[image]` placeholder is at least **traceable** — the user sees their hook is producing non-text content and can adjust their tool choice.

**Key insight:** This is **lossy compression**. A hook calling an MCP tool that returns mixed image+text content will lose the images. The MCP tool author should rethink: if a hook needs the image, the tool should return base64 in a text block instead.

## Diff vs v2.1.112

v2.1.112 had no `mcp_tool` hook type. Hook types were `command`, `prompt`, `agent`, `http`, plus internal `callback`/`function` types. The Zod discriminated union enumerated only those.

The v2.1.118 patch adds:
1. `McpToolHookSchema` to the schema discriminated union.
2. `mcpToolHook` (XQ6) — new executor.
3. `interpolateMCPHookInput` (hu5) — new substitution helper.
4. Branch in `aP` (streaming driver) for `mcp_tool`.
5. Branch in `YW` (sync driver) for `mcp_tool`.
6. Branch in `PQ6` (matcher resolver) for `mcp_tool` de-duplication key.
7. Branch in command-rendering helpers (`JS`, `S1H`) to format `mcp_tool` entries as `server/tool` strings.
8. Telemetry classification (`zh4`'s count buckets — adds `mcp_tool` count).

All other hook types are unaffected.

## Related Reading

- MCP client architecture: see `00_overview/symbol_index_infra_platform.md` "MCP Protocol" section for `client.callTool` shape and connection-state model.
- Hook executor flow: see [v2.1.112 11_hooks/README.md](../../../claude_code_v_2.1.112/analyze/11_hooks/README.md) for the streaming driver's overall structure.
