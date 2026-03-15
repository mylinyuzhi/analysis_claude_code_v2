# Module: Model Context Protocol (MCP) (06)

## Overview

Claude Code v2.1.76 implements a "Meta-Tooling" architecture for MCP. Instead of exposing every MCP tool as a top-level model tool, it provides a virtual `mcp-cli` command accessible via the `Bash` tool. This allows for dynamic discovery and execution of thousands of potential tools without exceeding context limits or confusing the model with too many schemas.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `parseMcpCliCommand` (ce) - Regex-based parser for `mcp-cli` commands in the terminal.
- `processMcpCliResult` (CYz) - Post-processor for terminal output that redirects `mcp-cli` calls to the internal MCP bridge.
- `updateMcpSessionState` (CJq) - Syncs the current MCP server/tool/resource state to a local JSON file for the CLI.
- `buildMcpCliInstructions` (FOq) - Generates the mandatory "Read-Before-Call" safety instructions for the system prompt.
- `McpMetaTool` (ln4) - A placeholder tool definition used for internal MCP routing.

---

## Core Algorithms

### The `mcp-cli` Command Interception

**What it does:**
When the model executes a bash command, the system checks if it is an `mcp-cli` call. If so, it bypasses the real shell and executes the tool internally through the Model Context Protocol.

**How it works:**
1.  **Instruction Injection**: At the start of the session, `buildMcpCliInstructions` (FOq) adds a section to the system prompt explaining that `mcp-cli info <server>/<tool>` must be called before `mcp-cli call <server>/<tool>`.
2.  **Detection**: The `Bash` tool's `call` method invokes `parseMcpCliCommand` (ce). It uses a regex to match commands like `mcp-cli call <server>/<tool> [args]`.
3.  **Execution Bridge**: If matched, `processMcpCliResult` (CYz) is triggered. It uses `callMcpServer` (ECA) to communicate with the target MCP server via JSON-RPC.
4.  **Result Formatting**: The JSON results from the MCP server are formatted back into "stdout" for the model to read. For large outputs, it can save the result to a temporary file and return the path (`rawOutputPath`). In v2.1.76, binary content such as PDFs and audio returned by MCP servers is also saved to disk rather than included inline in the result.
5.  **State Persistence**: `updateMcpSessionState` (CJq) continuously updates a file in `~/.claude/claude-code-mcp-cli/<sessionId>.json` with the current list of servers and tools. This file acts as the source of truth for the `mcp-cli info` command.

**Why this approach:**
- **Context Efficiency**: Top-level tool schemas are limited. `mcp-cli` allows access to an unlimited number of MCP tools.
- **Reliability**: The "Info-Before-Call" rule ensures the model always knows the correct JSON schema for an MCP tool, preventing hallucinated parameters.
- **Unified Interface**: By using the terminal as the entry point, MCP tools feel like native CLI tools to the agent.

**Key insight:** The "Blocking Requirement" enforced via the system prompt (`You MUST call 'mcp-cli info' BEFORE ANY 'mcp-cli call'`) mirrors the `Read` before `Edit` pattern used for local files, ensuring high reliability in tool usage.

---

## Code Implementation (Deobfuscated)

### parseMcpCliCommand - Command string parser
// Location: chunks.174.mjs:2627-2640

// ORIGINAL (for source lookup):
```javascript
function ce(A) {
    let q = A.match(/^mcp-cli\s+(call|read)\s+([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)(?:\s+([\s\S]+))?$/);
    if (!q) return null;
    let [, K, Y, z, w = ""] = q;
    if (!K || !Y || !z) return null;
    return {
        command: K,
        server: Y,
        tool: z,
        toolName: z,
        args: w,
        fullCommand: A
    }
}
```

// READABLE (for understanding):
```javascript
/**
 * Parses a string to check if it's an mcp-cli command
 * @param {string} command - The raw bash command
 * @returns {Object|null} Parsed MCP info or null if not an MCP command
 */
function parseMcpCliCommand(command) {
    // Matches: mcp-cli <call|read> <server>/<tool> [arguments]
    const mcpRegex = /^mcp-cli\s+(call|read)\s+([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)(?:\s+([\s\S]+))?$/;
    const match = command.match(mcpRegex);

    if (!match) return null;

    const [, action, serverName, toolName, rawArgs = ""] = match;

    if (!action || !serverName || !toolName) return null;

    return {
        command: action,      // "call" or "read"
        server: serverName,   // e.g. "sqlite"
        tool: toolName,       // e.g. "query"
        toolName: toolName,
        args: rawArgs,        // JSON arguments as string
        fullCommand: command
    };
}
```

// Mapping: ce→parseMcpCliCommand, A→command, q→match, K→action, Y→serverName, z→toolName, w→rawArgs

---

### updateMcpSessionState - Persistence for discovery
// Location: chunks.174.mjs:353-378

// ORIGINAL (for source lookup):
```javascript
async function CJq(A, q, K) {
    if (!O$()) return;
    try {
        await B2z(hc(), { recursive: !0 });
        let Y = await Promise.all(q.filter((O) => O.isMcp).map(Q2z)),
            z = {}, w = {};
        for (let O of A) {
            z[O.name] = O.config;
            let _ = P5(O.name);
            w[_] = O.name
        }
        let H = {
                clients: A.map(F2z),
                configs: z,
                tools: Y,
                resources: K,
                normalizedNames: w
            },
            $ = ST6();
        await u2z($, Q1(H, null, 2))
    } catch {}
}
```

// READABLE (for understanding):
```javascript
/**
 * Syncs MCP state to a local JSON file for the mcp-cli tool to use
 * @param {Array} servers - Active MCP server clients
 * @param {Array} tools - Known tools across all servers
 * @param {Array} resources - Available MCP resources
 */
async function updateMcpSessionState(servers, tools, resources) {
    if (!isMcpCliEnabled()) return;

    try {
        const cacheDir = getMcpCliCacheDir();
        await ensureDir(cacheDir, { recursive: true });

        // 1. Prepare tool metadata (names, descriptions, schemas)
        const mcpToolMetadata = await Promise.all(
            tools.filter(t => t.isMcp).map(extractToolInfo)
        );

        const serverConfigs = {};
        const normalizedToOriginalMap = {};

        for (const server of servers) {
            serverConfigs[server.name] = server.config;
            const normalizedName = normalizeServerName(server.name);
            normalizedToOriginalMap[normalizedName] = server.name;
        }

        // 2. Build session state object
        const sessionState = {
            clients: servers.map(s => serializeClient(s)),
            configs: serverConfigs,
            tools: mcpToolMetadata,
            resources: resources,
            normalizedNames: normalizedToOriginalMap
        };

        // 3. Write to ~/.claude/claude-code-mcp-cli/<sessionId>.json
        const sessionFile = getMcpSessionFilePath();
        await writeAtomic(sessionFile, JSON.stringify(sessionState, null, 2));

    } catch (err) {
        // Silently fail, MCP discovery might be degraded
    }
}
```

// Mapping: CJq→updateMcpSessionState, A→servers, q→tools, K→resources, Q2z→extractToolInfo, hc→getMcpCliCacheDir, ST6→getMcpSessionFilePath

---

## Command Parse Regex: Full Breakdown

The `parseMcpCliCommand` (ce) regex deserves deep analysis because it defines the boundary between MCP and regular bash:

```
/^mcp-cli\s+(call|read)\s+([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)(?:\s+([\s\S]+))?$/
```

| Segment | Meaning |
|---|---|
| `^mcp-cli` | Must be at start of string (no prefix commands allowed) |
| `\s+` | One or more spaces between tokens |
| `(call\|read)` | Capture group 1: only these two subcommands trigger interception |
| `([a-zA-Z0-9_-]+)` | Capture group 2: server name (alphanumeric, underscores, hyphens) |
| `\/` | Literal `/` separator between server and tool |
| `([a-zA-Z0-9_-]+)` | Capture group 3: tool name (same charset as server name) |
| `(?:\s+([\s\S]+))?` | Optional: capture group 4 = JSON args (any chars including newlines) |
| `$` | Must be end of string |

**What this intentionally excludes:**
- `mcp-cli info` — NOT intercepted; handled by the session state file lookup, not live execution
- `mcp-cli servers`, `mcp-cli tools`, etc. — these are passthrough subcommands to the real `mcp-cli` binary
- Piped commands (`mcp-cli call server/tool | jq`) — the `$` anchor prevents matching if the command continues

**Why `[\s\S]+` for args:** The args section must match JSON objects which may contain embedded newlines (pretty-printed JSON). `[\s\S]` matches any character including `\n`, unlike `.` which excludes newlines in default JavaScript regex mode.

---

## Safety Instruction Enforcement

The `buildMcpCliInstructions` (FOq) function generates a mandatory two-step protocol injected into the system prompt:

```
MANDATORY WORKFLOW:
1. ALWAYS call: mcp-cli info <server>/<tool>
   BEFORE calling: mcp-cli call <server>/<tool> {...}

This is a BLOCKING REQUIREMENT. Skipping info causes incorrect parameters.
```

**Why this matters:**
- MCP tool schemas are not included in the main system prompt (context efficiency)
- Without the schema, the model would guess parameter names and types → frequent tool call failures
- The two-step mirrors the `Read` → `Edit` pattern for files: always inspect before acting
- The word "BLOCKING" in the instruction exploits the model's training to treat such emphatic language as hard constraints

**What happens if the model skips info:**
- `callMcpServer` (ECA) receives unvalidated args
- The MCP server may reject with a JSON Schema validation error
- The error is returned to the model as tool output
- The model then calls `info` (now knowing it should have done this first) and retries
- This graceful degradation path exists but is far slower than compliance

---

## Large Output File Reference

When a tool call returns a very large response, `processMcpCliResult` (CYz) saves it to a temp file instead of including it inline. In v2.1.76, this extends to binary content: PDFs and audio returned by MCP servers are saved to disk rather than transmitted inline as base64.

```javascript
// ============================================
// processMcpCliResult - Handle large MCP tool output via file reference
// Location: chunks.170.mjs:473-510
// ============================================

// ORIGINAL (for source lookup):
async function CYz(A, q) {
  let K = await ECA(A);
  if (!K) return null;
  let Y = formatMcpResult(K);
  if (Y.length > MAX_INLINE_OUTPUT) {
    let z = path.join(os.tmpdir(), `mcp-output-${Date.now()}.txt`);
    await fs.writeFile(z, Y);
    return { stdout: `Output saved to: ${z}\nUse Bash to read it.`, rawOutputPath: z };
  }
  return { stdout: Y };
}

// READABLE (for understanding):
async function processMcpCliResult(parsedCommand, context) {
  const result = await callMcpServer(parsedCommand);  // [ECA]
  if (!result) return null;

  const formattedOutput = formatMcpResult(result);

  // If output exceeds threshold, save to file to avoid polluting context window
  if (formattedOutput.length > MAX_INLINE_OUTPUT) {
    const outputFile = path.join(os.tmpdir(), `mcp-output-${Date.now()}.txt`);
    await fs.writeFile(outputFile, formattedOutput);
    return {
      stdout: `Output saved to: ${outputFile}\nUse Bash to read it.`,
      rawOutputPath: outputFile  // caller can access full content if needed
    };
  }

  return { stdout: formattedOutput };
}

// Mapping: CYz→processMcpCliResult, A→parsedCommand, q→context, K→result, Y→formattedOutput, z→outputFile
```

**Binary content handling (v2.1.76):** When the MCP result contains a content block with `type: "blob"` (PDFs, audio files, images above size threshold), the system writes the binary to a temp file and substitutes a file path reference. This avoids embedding large base64 payloads in the terminal context window, which would rapidly consume token budget.

**Design rationale for file reference approach:**
- Large tool outputs (e.g., database query results with thousands of rows) could consume enormous context
- Saving to a file lets the model selectively read portions using `head`, `grep`, or line ranges
- The `rawOutputPath` field in the return value lets the caller programmatically access the full content if needed for further processing

---

## callMcpServer (ECA) Response Normalization

`callMcpServer` (ECA, chunks.145.mjs:1627) normalizes three different MCP response formats into a single structure:

**Format 1: Text content array**
```json
{ "content": [{ "type": "text", "text": "result string" }] }
```
→ Extracted as: `result.content[0].text`

**Format 2: Mixed content array**
```json
{ "content": [
  { "type": "text", "text": "description" },
  { "type": "image", "data": "base64...", "mimeType": "image/png" }
]}
```
→ Text parts joined with `\n`, image parts saved as temp files with references

**Format 3: isError response**
```json
{ "content": [{ "type": "text", "text": "error message" }], "isError": true }
```
→ Returned as error string prefixed with `[MCP Error] ` so the model knows to handle it as a tool failure

**Format 4: Binary blob (v2.1.76)**
```json
{ "content": [{ "type": "blob", "data": "base64...", "mimeType": "application/pdf" }] }
```
→ Decoded and saved to temp file; path reference returned to model

**Normalization rationale:** MCP servers from different vendors format their responses inconsistently. The normalization layer at `callMcpServer` means the rest of Claude Code always gets a predictable string output, regardless of which MCP server produced it.

---

## State Persistence Flow

```
App state change (setState())
    ↓
onChangeAppStateHandler (K11) — reference equality guard
    ↓ (only if mcp reference changed)
updateMcpSessionState (CJq)
    ↓
getMcpSessionFilePath (ST6) → ~/.claude/claude-code-mcp-cli/{sessionId}.json
    ↓
writeAtomic (u2z) — atomic file write prevents partial reads
    ↓
Session file available for mcp-cli child process reads
```

**Atomic write importance:** The session file is read by `mcp-cli info` commands. A non-atomic write could result in the child process reading a partially written file (e.g., truncated JSON). The `writeAtomic` function writes to a temp file in the same directory, then renames it — renames are atomic on POSIX filesystems within the same partition.

See also: [ui_linkage.md](./ui_linkage.md) for the K11 observer details, [mcp_hub.md](./mcp_hub.md) for MCPContext endpoint mode.
