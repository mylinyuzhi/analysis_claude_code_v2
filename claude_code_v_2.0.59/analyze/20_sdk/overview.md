# SDK Integration Overview

> SDK integration architecture for Claude Code, covering entry point detection, transport selection, and message flow.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - SDK Transport module

Key functions in this document:
- `getEntrypoint` (xu3) - Detects SDK entry point from environment
- `StdioSDKTransport` (aSA) - stdin/stdout transport class
- `WebSocketSDKTransport` (RD0) - WebSocket transport class
- `validateSDKMessage` (gf5) - Message validation function

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         External SDK Clients                             │
├───────────────────┬───────────────────┬─────────────────────────────────┤
│   Python SDK      │   TypeScript SDK  │      CLI SDK (--print)          │
│   (sdk-py)        │   (sdk-ts)        │      (sdk-cli)                  │
│   query()         │   query()         │      Non-interactive mode       │
│   ClaudeSDKClient │   ClaudeSDKClient │                                 │
└─────────┬─────────┴─────────┬─────────┴───────────────┬─────────────────┘
          │                   │                         │
          │ spawn subprocess  │ spawn subprocess        │ direct invocation
          │ stdin/stdout      │ stdin/stdout            │ stdin/stdout
          ▼                   ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Claude Code CLI Process                             │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                     Entry Point Detection                          │  │
│  │  getEntrypoint (xu3) - chunks.157.mjs:1730-1742                   │  │
│  │                                                                    │  │
│  │  CLAUDE_CODE_ENTRYPOINT env var:                                  │  │
│  │    - sdk-py     → Python SDK                                      │  │
│  │    - sdk-ts     → TypeScript SDK                                  │  │
│  │    - sdk-cli    → CLI with --print flag                           │  │
│  │    - mcp        → MCP server mode                                 │  │
│  │    - cli        → Interactive CLI mode                            │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                  │                                       │
│                                  ▼                                       │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                     Transport Layer                                │  │
│  │                                                                    │  │
│  │  ┌─────────────────────┐    ┌─────────────────────────────────┐   │  │
│  │  │ StdioSDKTransport   │    │ WebSocketSDKTransport           │   │  │
│  │  │ (aSA)               │    │ (RD0)                           │   │  │
│  │  │ - stdin reading     │    │ - Extends aSA                   │   │  │
│  │  │ - stdout writing    │    │ - WebSocket connection          │   │  │
│  │  │ - JSON-lines proto  │    │ - Auto-reconnection             │   │  │
│  │  └─────────────────────┘    └─────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                  │                                       │
│                                  ▼                                       │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                     Message Processing                             │  │
│  │                                                                    │  │
│  │  validateSDKMessage (gf5) - chunks.121.mjs:35-41                  │  │
│  │  - Filter internal messages (env_manager_log, control_response)   │  │
│  │  - Validate session_id presence                                   │  │
│  │  - Route to appropriate handler                                   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                  │                                       │
│                                  ▼                                       │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                     Agent Loop                                     │  │
│  │  (Same execution path as interactive CLI)                         │  │
│  │  - Tool execution                                                 │  │
│  │  - LLM API calls                                                  │  │
│  │  - Response streaming                                             │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Entry Point Detection

### getEntrypoint Function

**What it does:** Detects the SDK entry point from environment variables and command-line arguments, setting `CLAUDE_CODE_ENTRYPOINT` for downstream processing.

**How it works:**
1. Check if `CLAUDE_CODE_ENTRYPOINT` is already set (skip if already defined)
2. Check for `mcp serve` command → set "mcp"
3. Check for `CLAUDE_CODE_ACTION` env var → set "claude-code-github-action"
4. Check for non-interactive mode → set "sdk-cli" or "cli"

**Why this approach:**
- Single source of truth for entry point detection
- Early detection allows downstream code to adapt behavior
- Environment variable propagation to child processes

```javascript
// ============================================
// getEntrypoint - Detects SDK entry point from environment
// Location: chunks.157.mjs:1730-1742
// ============================================

// ORIGINAL (for source lookup):
function xu3(A) {
  if (process.env.CLAUDE_CODE_ENTRYPOINT) return;
  let Q = process.argv.slice(2),
    B = Q.indexOf("mcp");
  if (B !== -1 && Q[B + 1] === "serve") {
    process.env.CLAUDE_CODE_ENTRYPOINT = "mcp";
    return
  }
  if (Y0(process.env.CLAUDE_CODE_ACTION)) {
    process.env.CLAUDE_CODE_ENTRYPOINT = "claude-code-github-action";
    return
  }
  process.env.CLAUDE_CODE_ENTRYPOINT = A ? "sdk-cli" : "cli"
}

// READABLE (for understanding):
function getEntrypoint(isNonInteractive) {
  // Skip if already set (by external SDK)
  if (process.env.CLAUDE_CODE_ENTRYPOINT) return;

  const args = process.argv.slice(2);
  const mcpIndex = args.indexOf("mcp");

  // Check for MCP serve mode
  if (mcpIndex !== -1 && args[mcpIndex + 1] === "serve") {
    process.env.CLAUDE_CODE_ENTRYPOINT = "mcp";
    return;
  }

  // Check for GitHub Action mode
  if (parseBoolean(process.env.CLAUDE_CODE_ACTION)) {
    process.env.CLAUDE_CODE_ENTRYPOINT = "claude-code-github-action";
    return;
  }

  // CLI mode: sdk-cli for non-interactive, cli for interactive
  process.env.CLAUDE_CODE_ENTRYPOINT = isNonInteractive ? "sdk-cli" : "cli";
}

// Mapping: xu3→getEntrypoint, A→isNonInteractive, Q→args, B→mcpIndex, Y0→parseBoolean
```

**Key insight:** The SDK sets `CLAUDE_CODE_ENTRYPOINT` before spawning the CLI process, so the function returns early. This allows different SDKs (Python, TypeScript) to identify themselves.

---

## SDK Mode Detection

### Client Type Resolution

The main function (`vu3`) determines the client type based on the entry point:

```javascript
// ============================================
// Client Type Resolution
// Location: chunks.157.mjs:1756-1764
// ============================================

// ORIGINAL (for source lookup):
let I = (() => {
  if (process.env.GITHUB_ACTIONS === "true") return "github-action";
  if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-ts") return "sdk-typescript";
  if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-py") return "sdk-python";
  if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-cli") return "sdk-cli";
  if (process.env.CLAUDE_CODE_ENTRYPOINT === "claude-vscode") return "claude-vscode";
  if (process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN ||
      process.env.CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR) return "remote";
  return "cli"
})();

// READABLE (for understanding):
const clientType = (() => {
  if (process.env.GITHUB_ACTIONS === "true") return "github-action";
  if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-ts") return "sdk-typescript";
  if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-py") return "sdk-python";
  if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-cli") return "sdk-cli";
  if (process.env.CLAUDE_CODE_ENTRYPOINT === "claude-vscode") return "claude-vscode";
  if (process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN ||
      process.env.CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR) return "remote";
  return "cli";
})();

// Mapping: I→clientType
```

### SDK Entry Points

| Entry Point | Client Type | Description |
|-------------|-------------|-------------|
| `sdk-ts` | sdk-typescript | TypeScript SDK via `@anthropic-ai/claude-code-sdk` |
| `sdk-py` | sdk-python | Python SDK via `claude-agent-sdk` |
| `sdk-cli` | sdk-cli | CLI with `--print` or piped input |
| `mcp` | mcp | MCP server mode (`mcp serve`) |
| `claude-vscode` | claude-vscode | VS Code extension |
| `cli` | cli | Interactive terminal mode |

---

## Non-Interactive Mode Behavior

When running in SDK mode, Claude Code adjusts its behavior:

### Input Format Detection

```javascript
// ============================================
// Non-Interactive Mode Detection
// Location: chunks.157.mjs:1751-1755
// ============================================

// ORIGINAL:
let Q = A.includes("-p") || A.includes("--print"),
  B = A.some((Y) => Y.startsWith("--sdk-url")),
  G = Q || B || !process.stdout.isTTY;
lE0(!G), xu3(G);

// READABLE:
const isPrintMode = args.includes("-p") || args.includes("--print");
const hasSDKUrl = args.some((arg) => arg.startsWith("--sdk-url"));
const isNonInteractive = isPrintMode || hasSDKUrl || !process.stdout.isTTY;

setInteractiveMode(!isNonInteractive);
getEntrypoint(isNonInteractive);

// Mapping: Q→isPrintMode, B→hasSDKUrl, G→isNonInteractive
```

**Key insight:** Non-interactive mode is triggered by:
1. `--print` or `-p` flag
2. `--sdk-url` flag (WebSocket mode)
3. Non-TTY stdout (piped output)

---

## Transport Selection

The SDK uses different transport mechanisms based on the connection mode:

### Transport Decision Flow

```
┌─────────────────────────────┐
│    --sdk-url provided?      │
└──────────────┬──────────────┘
               │
     ┌─────────┴─────────┐
     │                   │
    Yes                  No
     │                   │
     ▼                   ▼
┌─────────────────┐  ┌─────────────────┐
│ WebSocketSDK    │  │ StdioSDK        │
│ Transport (RD0) │  │ Transport (aSA) │
│                 │  │                 │
│ - WS connection │  │ - stdin input   │
│ - Resilience    │  │ - stdout output │
│ - Reconnection  │  │ - JSON-lines    │
└─────────────────┘  └─────────────────┘
```

---

## Identity Selection

### SDK-Specific System Prompts

Claude Code uses different identities based on the entry point:

| Entry Point | Identity | Description |
|-------------|----------|-------------|
| Interactive CLI | `CLAUDE_CODE_IDENTITY` | Full Claude Code branding |
| SDK modes | `CLAUDE_CODE_SDK_IDENTITY` | SDK-specific identity |
| Agent SDK | `CLAUDE_AGENT_IDENTITY` | Custom agent identity |

```javascript
// ============================================
// Identity Constants
// Location: chunks.60.mjs:478-480
// ============================================

// ORIGINAL:
const hCB = "Claude Code";           // CLAUDE_CODE_IDENTITY
const sY6 = "Claude Code SDK";       // CLAUDE_CODE_SDK_IDENTITY
const rY6 = "Claude Agent";          // CLAUDE_AGENT_IDENTITY

// READABLE:
const CLAUDE_CODE_IDENTITY = "Claude Code";
const CLAUDE_CODE_SDK_IDENTITY = "Claude Code SDK";
const CLAUDE_AGENT_IDENTITY = "Claude Agent";

// Mapping: hCB→CLAUDE_CODE_IDENTITY, sY6→CLAUDE_CODE_SDK_IDENTITY, rY6→CLAUDE_AGENT_IDENTITY
```

---

## Message Flow Overview

### Typical SDK Interaction Sequence

```
SDK Client                    Claude Code CLI
    │                              │
    │  spawn process               │
    │  set CLAUDE_CODE_ENTRYPOINT  │
    │─────────────────────────────>│
    │                              │
    │  {"type": "user", ...}       │ JSON-lines input
    │─────────────────────────────>│
    │                              │
    │                              │ Process message
    │                              │ Execute agent loop
    │                              │
    │  {"type": "stream_event"}    │ Streaming response
    │<─────────────────────────────│
    │  {"type": "stream_event"}    │
    │<─────────────────────────────│
    │                              │
    │  (Control Request)           │ Permission check
    │<─────────────────────────────│
    │  (Control Response)          │
    │─────────────────────────────>│
    │                              │
    │  {"type": "result", ...}     │ Final result
    │<─────────────────────────────│
    │                              │
```

---

## Related Documents

- [message_protocol.md](./message_protocol.md) - SDK message format and validation
- [transport_layer.md](./transport_layer.md) - Transport implementation details (input side)
- [output_pipeline.md](./output_pipeline.md) - Output pipeline implementation (output side)
- [control_protocol.md](./control_protocol.md) - Control request/response pattern
- [python_sdk_usage.md](./python_sdk_usage.md) - Python SDK interface analysis
- [websocket_resilience.md](./websocket_resilience.md) - WebSocket reconnection patterns
- [integration_patterns.md](./integration_patterns.md) - Best practices and patterns
