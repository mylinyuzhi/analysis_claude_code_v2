# Agent SDK Architecture

## Overview

Claude Code exposes an Agent SDK that allows external developers to build custom agents on top of the Claude Code runtime. The SDK operates through a **non-interactive print mode** where the Claude Code binary is invoked programmatically via `--print` flags and communicates over JSON-streaming stdio. SDK clients exist for TypeScript, Python, and raw CLI invocation. The system detects which SDK is being used through the `CLAUDE_CODE_ENTRYPOINT` environment variable and adapts its behavior accordingly -- changing system prompts, restricting certain built-in agents, adjusting error messages, and selecting the appropriate I/O transport.

When `--sdk-url` points to a WebSocket endpoint, the transport layer uses a **dual-channel architecture** (`HybridTransport` / `eo6`): inbound messages are received over a persistent WebSocket connection (inherited from `WebSocketTransport` / `to6`), while outbound `stream_event` messages are batched for 100 ms and uploaded via HTTP POST through `BatchQueue` (`Y26`). Non-streaming outbound messages flush the batch buffer and HTTP POST synchronously. An `AsyncQueue` (`Pi6`) sits between the application logic and the I/O loop for all stdio-based transports.

The message protocol includes two notable server→client event types introduced in recent versions: `auth_status` (fields: `isAuthenticating`, `output`, `error`) signals authentication state changes, and `prompt_suggestion` carries a follow-up prompt hint emitted after each turn when `promptSuggestions: true` was set in the `initialize` control request.

## Version 2.1.76 New Features

### rate_limit Event Type (NEW)

**What it does:** Emitted when the Claude API returns rate-limit headers. Allows SDK clients to implement backoff logic or surface capacity information without polling.

**When emitted:** After each API response that includes `x-ratelimit-*` headers, before the `assistant` message for that turn.

```javascript
{
  "type": "rate_limit",
  "info": {
    "requests_remaining": 42,
    "requests_reset_at": "2025-03-15T12:00:00Z",
    "tokens_remaining": 100000,
    "tokens_reset_at": "2025-03-15T12:00:00Z"
  },
  "session_id": "<uuid>",
  "uuid": "<uuid>"
}
```

**Key insight:** SDK clients previously had no visibility into rate-limit state without inspecting raw HTTP headers. The `rate_limit` event decouples the SDK abstraction from transport-level details.

### background Flag in Agent Definitions (NEW)

**What it does:** When `background: true` is set on an agent definition, invocations of that agent via the Task tool default to background execution.

**Why this approach:** Certain agent types (e.g., long-running analysis agents) are almost always intended to run asynchronously. The flag bakes this default into the agent definition.

**Per-invocation override:** The Task tool's `run_in_background` parameter still overrides the definition-level default.

### Max Turns and Budget Enforcement Fix

**What changed:** In v2.1.38, max turns and budget limits were defined and checked, but a code path existed where the agent loop could continue past the limit in certain edge cases. In v2.1.76, these checks are now applied unconditionally at the end of every turn.

**Impact:** SDK clients relying on `error_max_turns` or `error_max_budget_usd` result subtypes can now depend on them firing reliably.

### activeForm Field Removed (Breaking Change)

**What changed:** In v2.1.38, certain task creation APIs required an `activeForm` field. This requirement has been removed in v2.1.76.

**Migration:** Remove any `activeForm` field from task creation calls. The field is silently ignored if present.

## Sub-Documents

| Document | Lines | Contents |
|---|---|---|
| [streaming_protocol.md](./streaming_protocol.md) | ~1100 | Complete NDJSON message protocol — all message types, schemas, output format comparison, rate_limit event |
| [transport_layer.md](./transport_layer.md) | ~1380 | StdioStreamIO (so6), WebSocketTransport (to6), HybridTransport (eo6), SSETransport (z26), CCR v2 protocol |
| [ui_linkage.md](./ui_linkage.md) | ~1540 | How SDK stream events drive UI state machine, thinking/text/tool streaming, React/Ink component architecture |
| [sdk_ui_interaction_patterns.md](./sdk_ui_interaction_patterns.md) | ~700 | **NEW** Complete interaction lifecycle, component patterns, multi-tool execution, permission flow diagrams |
| [sdk_session_management.md](./sdk_session_management.md) | ~1020 | Session persistence, max turns, budget limits, rate_limit events, auto-compact integration |
| [sdk_tools_integration.md](./sdk_tools_integration.md) | ~870 | Tool execution in SDK mode, permission prompt tool, Promise.race pattern for hook/SDK permissions |
| [agent_definitions.md](./agent_definitions.md) | ~800 | Built-in agent definitions, custom agent schema, agent loading pipeline, background flag, SDK-specific filtering |
| [sdk_outbound_queue.md](./sdk_outbound_queue.md) | ~850 | Pi6 AsyncQueue + Y26 BatchQueue dual-queue outbound architecture, backpressure, retry with exponential backoff |
| [sdk_error_recovery.md](./sdk_error_recovery.md) | ~950 | WebSocket reconnection, abort handling, timeout management, error output formatting |
| [sdk_mcp_integration.md](./sdk_mcp_integration.md) | ~680 | MCP server integration in SDK mode, sdkMcpServers, sendMcpMessage, SdkMcpTransport (oi8), type="sdk" routing |
| [sdk_cross_references.md](./sdk_cross_references.md) | ~740 | Cross-module behavior differences, attachment producers in SDK mode, isNonInteractive locations |
| [sdk_hooks.md](./sdk_hooks.md) | ~470 | SDK hook callback mechanism, hookCallbackIds, createHookCallback method |
| [sdk_ui_state_machine.md](./sdk_ui_state_machine.md) | ~500 | UI state machine driven by stream events, state transitions, callback interfaces |
| [sdk_ui_components.md](./sdk_ui_components.md) | ~580 | UI component architecture, SpinnerController, ThinkingPanel, StreamingTextDisplay, ToolUseIndicator |
| [sdk_ui_rendering.md](./sdk_ui_rendering.md) | ~680 | Output formats (text/json/stream-json), streamlined output, rate_limit/prompt_suggestion handling |

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `isNonInteractive` (q7) - Returns true when running in SDK/print mode (chunks.1.mjs:2720)
- `setInteractive` (bL6) - Sets the interactive flag on global state
- `getEntrypoint` (L59) - Returns the current entrypoint string
- `setEntrypoint` (iGz) - Detects and sets CLAUDE_CODE_ENTRYPOINT
- `determineClientType` (inline in nGz) - Maps entrypoint to client type
- `StdioStreamIO` (so6) - Base stdio JSON streaming transport (chunks.184.mjs:1942); `outbound = new Pi6` queue
- `RemoteStreamIO` (AI1) - Extends so6; delegates to `URq` to select WebSocket/HybridTransport (chunks.185.mjs:660)
- `WebSocketTransport` (to6) - WebSocket connection with reconnection/buffering (chunks.184.mjs:2298)
- `HybridTransport` (eo6) - Reads inbound via WebSocket; writes `stream_event` via Y26 BatchQueue HTTP POST (chunks.184.mjs:2762)
- `createStreamIO` (UXz) - Factory that selects StdioStreamIO or RemoteStreamIO (chunks.187.mjs:1467)
- `handleToolUseStream` (xN6) - Central dispatcher: stream events → UI state (chunks.173.mjs:2384)
- `initializeSession` (FXz) - Processes initialize control request (chunks.187.mjs:1174)
- `handleRewindRequest` (thq) - Rolls back file changes to checkpoint (chunks.187.mjs:1271)
- `handleSetPermissionMode` (pXz) - Validates and applies permission mode transitions (chunks.187.mjs:1305)
- `streamJsonInputHandler` (oGz) - Routes stdin → stream for different input formats
- `processPermissionResult` (JV6) - MCP-based permission prompt result handler (chunks.184.mjs:1621)
- `getExternalUserAgent` (Jr) - Builds user-agent string for SDK requests
- `getBuiltinAgents` (APA) - Returns list of built-in agents (filters "guide" for SDK)
- `SDK_SYSTEM_PROMPT_CLI` (t17) - System prompt for CLI-embedded SDK
- `SDK_SYSTEM_PROMPT_AGENT` (e17) - System prompt for custom SDK agents
- `BASE_SYSTEM_PROMPT` (B7A) - Default non-SDK system prompt

---

## Entry Point Detection and Client Type Determination

### setEntrypoint - How the system knows it is running as SDK

**What it does:** Early in the startup process, `setEntrypoint` (iGz) examines process arguments and environment variables to classify how Claude Code was launched. This classification drives all downstream SDK-aware behavior.

**How it works:**
1. If `CLAUDE_CODE_ENTRYPOINT` is already set (e.g., by an SDK wrapper), exit immediately -- the SDK itself sets this before spawning the process
2. Check if the process arguments include `mcp serve` -- if so, set entrypoint to `"mcp"`
3. Check if `CLAUDE_CODE_ACTION` is truthy -- if so, set to `"claude-code-github-action"`
4. Otherwise, if the `isNonInteractive` flag is set (meaning `-p`/`--print` was passed), set to `"sdk-cli"`; if not, set to `"cli"`

**Why this approach:**
The SDK wrappers (TypeScript, Python) set the entrypoint environment variable themselves (`sdk-ts`, `sdk-py`) before launching the Claude Code binary. This means by the time `setEntrypoint` runs, SDK sessions already have their entrypoint set and skip the detection logic entirely. The function only needs to handle the "bare" CLI case, where it distinguishes between interactive CLI usage (`"cli"`) and programmatic piped usage (`"sdk-cli"`).

**Key insight:** The TypeScript SDK sets `CLAUDE_CODE_ENTRYPOINT=sdk-ts`, the Python SDK sets `CLAUDE_CODE_ENTRYPOINT=sdk-py`, and VS Code sets `CLAUDE_CODE_ENTRYPOINT=claude-vscode`. This early-exit pattern means SDK detection is effectively a protocol between the wrapping process and the Claude Code binary, not runtime inference.

```javascript
// ============================================
// setEntrypoint - Classify how Claude Code was launched
// Location: chunks.189.mjs:916-928
// ============================================

// ORIGINAL (for source lookup):
function iGz(A) {
    if (process.env.CLAUDE_CODE_ENTRYPOINT) return;
    let q = process.argv.slice(2),
        K = q.indexOf("mcp");
    if (K !== -1 && q[K + 1] === "serve") {
        process.env.CLAUDE_CODE_ENTRYPOINT = "mcp";
        return
    }
    if (J6(process.env.CLAUDE_CODE_ACTION)) {
        process.env.CLAUDE_CODE_ENTRYPOINT = "claude-code-github-action";
        return
    }
    process.env.CLAUDE_CODE_ENTRYPOINT = A ? "sdk-cli" : "cli"
}

// READABLE (for understanding):
function setEntrypoint(isNonInteractive) {
    // If the SDK wrapper already set the entrypoint, respect it
    if (process.env.CLAUDE_CODE_ENTRYPOINT) return;

    let args = process.argv.slice(2);
    let mcpIndex = args.indexOf("mcp");
    if (mcpIndex !== -1 && args[mcpIndex + 1] === "serve") {
        process.env.CLAUDE_CODE_ENTRYPOINT = "mcp";
        return;
    }
    if (parseBool(process.env.CLAUDE_CODE_ACTION)) {
        process.env.CLAUDE_CODE_ENTRYPOINT = "claude-code-github-action";
        return;
    }
    // Default: non-interactive => sdk-cli, interactive => cli
    process.env.CLAUDE_CODE_ENTRYPOINT = isNonInteractive ? "sdk-cli" : "cli";
}

// Mapping: iGz→setEntrypoint, A→isNonInteractive, J6→parseBool
```

### Client Type Mapping

After the entrypoint is determined, the main function maps it to a human-readable client type string that is used in telemetry and behavior branching:

| Entrypoint Value | Client Type | Source |
|---|---|---|
| `sdk-ts` | `sdk-typescript` | TypeScript SDK wrapper |
| `sdk-py` | `sdk-python` | Python SDK wrapper |
| `sdk-cli` | `sdk-cli` | Raw CLI with `--print` |
| `claude-vscode` | `claude-vscode` | VS Code extension |
| `local-agent` | `local-agent` | Local agent mode |
| `remote` | `remote` | Remote/WebSocket session |
| (default) | `cli` | Interactive terminal |

---

## Non-Interactive Mode Detection (isNonInteractive / q7)

### isNonInteractive - The core SDK mode check

**What it does:** A simple boolean getter (`q7()`) that returns `true` when Claude Code is running in non-interactive mode -- which includes all SDK scenarios, `--print` mode, and piped usage.

**How it works:**
1. Global state object `v1` holds `isInteractive` boolean
2. `q7()` returns `!v1.isInteractive`
3. The flag is set early in `main()` via `bL6(!z)` where `z` is true if any of: `--print`, `--init-only`, `--sdk-url`, or `!process.stdout.isTTY`

```javascript
// ============================================
// isNonInteractive - Check if running in SDK/print mode
// Location: chunks.1.mjs:2720-2722
// ============================================

// ORIGINAL (for source lookup):
function q7() {
    return !v1.isInteractive
}

// READABLE (for understanding):
function isNonInteractive() {
    return !globalState.isInteractive;
}

// Mapping: q7→isNonInteractive, v1→globalState
```

**Why this approach:**
Rather than checking entrypoint strings everywhere, the system uses a single boolean that captures the fundamental behavioral difference: interactive (human-in-the-loop with terminal UI) versus non-interactive (programmatic, machine-readable I/O). This is checked in 30+ locations throughout the codebase to adjust behavior:
- Error messages: SDK mode shows concise machine-parseable errors; interactive mode shows user-friendly messages with suggestions like "Run /login" or "Double press esc"
- Fast mode: Disabled in SDK mode (`"Fast mode is not available in the Agent SDK"`)
- PDF handling: SDK mode says "Try reading the file a different way"; interactive mode says "Double press esc to go back"
- Authentication: SDK mode shows `"Failed to authenticate"` directly; interactive mode suggests `/login`
- Beta tracing: Only enabled when both environment flags are set AND in SDK mode

**Key insight:** The `isNonInteractive` check is the single most important behavioral fork in the codebase. Almost every user-facing message and many control flow decisions branch on it.

### DY4 - Session-specific non-interactive check

**What it does:** A function that checks the `isNonInteractiveSession` property from a session context object.

```javascript
// ============================================
// isNonInteractiveSession - Check session context for SDK mode
// Location: chunks.91.mjs:45-47
// ============================================

// ORIGINAL (for source lookup):
function DY4(A) {
    return A.isNonInteractiveSession
}

// READABLE (for understanding):
function isNonInteractiveSession(sessionContext) {
    return sessionContext.isNonInteractiveSession;
}

// Mapping: DY4→isNonInteractiveSession, A→sessionContext
```

**Difference from q7():**
- `q7()` checks **global state** (application-wide interactive mode)
- `DY4(sessionContext)` checks **session context** (session-specific flag)

The session context flag is set based on:
- `CLAUDE_CODE_ENTRYPOINT` environment variable (`sdk-ts`, `sdk-py`, `sdk-cli`)
- Explicit session options passed during initialization

---

## SDK I/O Transport Architecture

### StdioStreamIO (Mc1) - Base JSON-line transport

**What it does:** Provides the foundational input/output stream for non-interactive sessions. Reads newline-delimited JSON from stdin and supports bidirectional control flow for permission prompts.

**How it works:**
1. Constructor takes a readable stream (`input`) and optional `replayUserMessages` flag
2. The `read()` async generator processes the stream line by line
3. Each line is parsed as JSON and classified by `type`:
   - `"keep_alive"` -- silently ignored (heartbeat)
   - `"update_environment_variables"` -- applies env var changes to `process.env`
   - `"control_response"` -- resolves a pending permission request promise
   - `"user"` -- yields as a user message for the agent loop
   - `"control_request"` -- yields as a control message
4. Permission requests are tracked in a `pendingRequests` Map keyed by `request_id`

```javascript
// ============================================
// StdioStreamIO - Base JSON streaming transport for SDK
// Location: chunks.178.mjs:1060-1134
// ============================================

// ORIGINAL (for source lookup):
class Mc1 {
    input; replayUserMessages; structuredInput;
    pendingRequests = new Map;
    inputClosed = !1;
    constructor(A, q) {
        this.input = A; this.replayUserMessages = q;
        this.structuredInput = this.read()
    }
    async * read() {
        let A = "";
        for await (let q of this.input) {
            A += q;
            let K;
            while ((K = A.indexOf("\n")) !== -1) {
                let Y = A.slice(0, K);
                A = A.slice(K + 1);
                let z = await this.processLine(Y);
                if (z) yield z
            }
        }
        // ... handle remaining data and close
    }
}

// READABLE (for understanding):
class StdioStreamIO {
    input; replayUserMessages; structuredInput;
    pendingRequests = new Map();
    inputClosed = false;
    constructor(inputStream, replayUserMessages) {
        this.input = inputStream;
        this.replayUserMessages = replayUserMessages;
        this.structuredInput = this.read();
    }
    async * read() {
        let buffer = "";
        for await (let chunk of this.input) {
            buffer += chunk;
            let newlineIndex;
            while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
                let line = buffer.slice(0, newlineIndex);
                buffer = buffer.slice(newlineIndex + 1);
                let message = await this.processLine(line);
                if (message) yield message;
            }
        }
        // Handle remaining buffer and close pending requests
    }
}

// Mapping: Mc1→StdioStreamIO, A→inputStream/buffer, q→replayUserMessages/chunk
```

### SdkUrlStreamIO (FQA) - WebSocket transport for remote SDK connections

**What it does:** Extends `StdioStreamIO` to connect to a remote WebSocket URL instead of reading from local stdin. Used when `--sdk-url` is provided, enabling hosted/remote agent scenarios.

**How it works:**
1. Inherits from `Mc1` (StdioStreamIO) -- passes a synthetic PassThrough stream as the input
2. Creates a WebSocket transport to the specified URL, with optional auth headers
3. Data received from the WebSocket is piped into the PassThrough stream
4. When the WebSocket closes, the PassThrough stream ends
5. Outgoing writes go through the WebSocket transport

```javascript
// ============================================
// SdkUrlStreamIO - WebSocket transport for SDK URL mode
// Location: chunks.178.mjs:1630-1663
// ============================================

// ORIGINAL (for source lookup):
FQA = class FQA extends Mc1 {
    url; transport; inputStream;
    constructor(A, q, K) {
        let Y = new GJz({ encoding: "utf8" });
        super(Y, K);
        this.inputStream = Y;
        this.url = new WJz(A);
        let z = {}, w = nV();
        if (w) z.Authorization = `Bearer ${w}`;
        // ... setup transport
    }
}

// READABLE (for understanding):
class SdkUrlStreamIO extends StdioStreamIO {
    url; transport; inputStream;
    constructor(sdkUrl, inputSource, replayUserMessages) {
        let passthroughStream = new PassThrough({ encoding: "utf8" });
        super(passthroughStream, replayUserMessages);
        this.inputStream = passthroughStream;
        this.url = new URL(sdkUrl);
        let headers = {};
        let sessionToken = getSessionAccessToken();
        if (sessionToken) headers.Authorization = `Bearer ${sessionToken}`;
        // Create WebSocket transport, pipe data to passthroughStream
    }
}

// Mapping: FQA→SdkUrlStreamIO, Mc1→StdioStreamIO, A→sdkUrl, q→inputSource, K→replayUserMessages
```

### createStreamIO - Transport factory

**What it does:** Selects the appropriate I/O transport based on whether `--sdk-url` is provided.

```javascript
// ============================================
// createStreamIO - Factory for selecting I/O transport
// Location: chunks.179.mjs:1887-1901
// ============================================

// ORIGINAL (for source lookup):
function IJz(A, q) {
    // ... create input stream from string or passthrough ...
    return q.sdkUrl ? new FQA(q.sdkUrl, K, q.replayUserMessages) : new Mc1(K, q.replayUserMessages)
}

// READABLE (for understanding):
function createStreamIO(promptInput, options) {
    let inputStream;
    if (typeof promptInput === "string") {
        inputStream = createReadableFromJsonLines([...]);
    } else {
        inputStream = promptInput;
    }
    return options.sdkUrl
        ? new SdkUrlStreamIO(options.sdkUrl, inputStream, options.replayUserMessages)
        : new StdioStreamIO(inputStream, options.replayUserMessages);
}

// Mapping: IJz→createStreamIO, A→promptInput, q→options, FQA→SdkUrlStreamIO, Mc1→StdioStreamIO
```

**Key insight:** The transport abstraction lets the same agent loop code work identically whether input comes from local stdin (TypeScript/Python SDK piping to the process) or from a remote WebSocket (hosted deployment). The `StdioStreamIO` class handles the newline-delimited JSON protocol, and `SdkUrlStreamIO` simply bridges a WebSocket into that same stream interface.

---

## SDK System Prompts

### Three Identity Tiers

The system prompt identity line changes based on how Claude Code is being used:

1. **`BASE_SYSTEM_PROMPT`** (B7A): `"You are Claude Code, Anthropic's official CLI for Claude."` -- Used for normal interactive CLI sessions.

2. **`SDK_SYSTEM_PROMPT_CLI`** (t17): `"You are Claude Code, Anthropic's official CLI for Claude, running within the Claude Agent SDK."` -- Used when Claude Code is invoked through the SDK but retains its full Claude Code identity (the `systemPrompt` option was not overridden).

3. **`SDK_SYSTEM_PROMPT_AGENT`** (e17): `"You are a Claude agent, built on Anthropic's Claude Agent SDK."` -- Used when a custom agent is being built through the SDK with a custom system prompt. This is the most generic identity, allowing the developer's custom prompt to define the agent's personality.

**Why three tiers:**
- Tier 1 (CLI) is the default for human users at a terminal
- Tier 2 (SDK CLI) signals to the model that it might be controlled programmatically, adjusting how it communicates
- Tier 3 (SDK Agent) fully defers identity to the developer, who supplies their own system prompt via the `--system-prompt` or `--append-system-prompt` CLI flags

---

## User Agent Construction

### getExternalUserAgent (Jr) - SDK request identification

**What it does:** Builds a User-Agent string for API requests that identifies the SDK version and entrypoint, used when running in external/non-interactive mode.

```javascript
// ============================================
// getExternalUserAgent - Build user-agent for SDK API requests
// Location: chunks.47.mjs:1725-1728
// ============================================

// ORIGINAL (for source lookup):
function Jr() {
    let A = process.env.CLAUDE_AGENT_SDK_VERSION
        ? `, agent-sdk/${process.env.CLAUDE_AGENT_SDK_VERSION}` : "";
    return `claude-cli/${VERSION} (external, ${process.env.CLAUDE_CODE_ENTRYPOINT}${A})`
}

// READABLE (for understanding):
function getExternalUserAgent() {
    let sdkVersionSuffix = process.env.CLAUDE_AGENT_SDK_VERSION
        ? `, agent-sdk/${process.env.CLAUDE_AGENT_SDK_VERSION}` : "";
    return `claude-cli/${VERSION} (external, ${process.env.CLAUDE_CODE_ENTRYPOINT}${sdkVersionSuffix})`;
}

// Mapping: Jr→getExternalUserAgent, A→sdkVersionSuffix
```

**Example outputs:**
- TypeScript SDK: `claude-cli/2.1.38 (external, sdk-ts, agent-sdk/0.1.5)`
- Python SDK: `claude-cli/2.1.38 (external, sdk-py, agent-sdk/0.2.0)`
- Raw CLI print: `claude-cli/2.1.38 (external, sdk-cli)`

---

## Built-in Agent Restrictions in SDK Mode

### getBuiltinAgents (APA) - SDK-specific agent filtering

**What it does:** Returns the list of built-in agents available for subagent dispatch. In SDK mode, the "guide" agent is excluded because it relies on web fetching and interactive documentation browsing that are not appropriate for programmatic use.

**How it works:**
1. If `CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS` is truthy AND in non-interactive mode, return empty array (full disable)
2. Otherwise, start with the five core agents: Bash, general-purpose, File search, code search, and plan agent
3. If NOT in SDK mode (`sdk-ts`, `sdk-py`, `sdk-cli`), also add the "guide" agent (`Rn7`)

```javascript
// ============================================
// getBuiltinAgents - Return available built-in agents (SDK-filtered)
// Location: chunks.90.mjs:3049-3054
// ============================================

// ORIGINAL (for source lookup):
function APA() {
    if (J6(process.env.CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS) && q7()) return [];
    let A = [Tn7, ZB1, En7, bv, PJ6];
    if (process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-ts" &&
        process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-py" &&
        process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-cli") A.push(Rn7);
    return A
}

// READABLE (for understanding):
function getBuiltinAgents() {
    // Allow SDK users to completely disable built-in agents
    if (parseBool(process.env.CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS) && isNonInteractive()) {
        return [];
    }
    let agents = [bashAgent, generalPurposeAgent, fileSearchAgent, codeSearchAgent, planAgent];
    // Guide agent excluded in SDK mode (it fetches docs interactively)
    if (process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-ts" &&
        process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-py" &&
        process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-cli") {
        agents.push(guideAgent);
    }
    return agents;
}

// Mapping: APA→getBuiltinAgents, Tn7→bashAgent, ZB1→generalPurposeAgent,
//   En7→fileSearchAgent, bv→codeSearchAgent, PJ6→planAgent, Rn7→guideAgent
```

**Why exclude the guide agent in SDK mode:**
The guide agent (`claude-code-guide`) fetches documentation from URLs and is designed for interactive "how do I use Claude Code?" queries. In SDK mode, the developer is building their own agent and controls the system prompt -- the guide agent would be noise. Additionally, the `CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS` environment variable gives SDK developers full control to remove all built-in agents, leaving only their custom-defined ones.

---

## SDK CLI Options

The following CLI flags are specifically relevant to SDK usage (from `chunks.189.mjs`):

### Core SDK Flags
- `--print` / `-p` -- Required for all SDK usage. Enables non-interactive mode with machine-readable output. Skips the workspace trust dialog.
- `--output-format <format>` -- `"text"` (default), `"json"` (single result), or `"stream-json"` (real-time streaming). SDK typically uses `stream-json`.
- `--input-format <format>` -- `"text"` (default) or `"stream-json"` (for bidirectional streaming).
- `--sdk-url <url>` -- Internal flag for remote SDK URL connections. Forces `stream-json` for both input and output.
- `--include-partial-messages` -- Include partial message chunks as they arrive (requires `stream-json`).
- `--replay-user-messages` -- Re-emit user messages on stdout for acknowledgment (requires `stream-json`).

### Agent Configuration
- `--system-prompt <prompt>` -- Override the entire system prompt. When set, the SDK agent identity (Tier 3) is used.
- `--append-system-prompt <prompt>` -- Append to the default system prompt while keeping Claude Code identity.
- `--allowed-tools <tools...>` -- Restrict which tools the agent can use.
- `--disallowed-tools <tools...>` -- Deny specific tools.
- `--tools <tools...>` -- Specify the exact set of available tools.
- `--agents <json>` -- Define custom agents as a JSON object.
- `--permission-prompt-tool <tool>` -- MCP tool for handling permission prompts programmatically.
- `--max-turns <n>` -- Limit the number of agentic turns.
- `--max-budget-usd <amount>` -- Limit API spending.
- `--json-schema <schema>` -- Enable structured output validation.

### Session Management
- `--session-id <uuid>` -- Use a specific session ID.
- `--continue` / `--resume` -- Resume a previous session.
- `--no-session-persistence` -- Disable saving sessions to disk.
- `--enable-auth-status` -- Enable auth status messages in SDK mode.

---

## Entry Point Flow: npm Package to Agent Loop

The complete SDK initialization flow from `npm` package invocation to the agent loop:

```
1. SDK Wrapper (TypeScript/Python) sets environment variables:
   - CLAUDE_CODE_ENTRYPOINT = "sdk-ts" | "sdk-py"
   - CLAUDE_AGENT_SDK_VERSION = "<version>"
   - Spawns: claude --print --output-format=stream-json --input-format=stream-json [flags]

2. CLI Entry (chunks.189.mjs: nGz)
   ├── Detect non-interactive mode (isNonInteractive = true)
   ├── setInteractive(false) via bL6(!z)
   ├── setEntrypoint(true) -- early-exits since CLAUDE_CODE_ENTRYPOINT already set
   ├── determineClientType() -- maps "sdk-ts" → "sdk-typescript"
   ├── setClientType(clientType)
   ├── eagerLoadSettings()
   └── run() entry

3. Run function (chunks.189.mjs: aGz)
   ├── Commander parses CLI arguments
   ├── preAction hook:
   │   ├── Init settings
   │   ├── Run migrations
   │   └── Sync remote settings
   ├── Action handler:
   │   ├── Resolve SDK URL if provided
   │   ├── Load MCP configs (SDK-specific: only --mcp-config if --strict-mcp-config)
   │   ├── Load tools (filtered by --allowed-tools, --tools)
   │   ├── Run setup()
   │   ├── Load commands and agents (built-in agents filtered for SDK)
   │   ├── Create StreamIO transport (StdioStreamIO or SdkUrlStreamIO)
   │   └── Enter printMode agent loop
   │
4. Print Mode Agent Loop (chunks.179.mjs)
   ├── Read messages from StreamIO
   ├── Process through agent loop (same core loop as interactive mode)
   ├── Write stream events as JSON lines to stdout
   ├── Handle permission control_request / control_response bidirectional flow
   └── Output final result message

5. SDK Wrapper reads JSON lines from stdout:
   ├── stream_event messages → partial results
   ├── control_request messages → permission prompts (resolved via control_response on stdin)
   └── result message → final output
```

**Key insight about the flow:** The SDK does not use a separate API or protocol -- it literally runs the same Claude Code binary with `--print` mode, communicating over stdin/stdout JSON lines. This means SDK agents get the exact same tool implementations, safety checks, permission system, and model access as interactive CLI users. The only differences are: (1) filtered built-in agents, (2) different system prompt identity, (3) machine-optimized error messages, and (4) the I/O transport layer.

---

## Telemetry in SDK Mode

SDK sessions include additional telemetry metadata:

- `entrypoint` -- The `CLAUDE_CODE_ENTRYPOINT` value (e.g., `"sdk-ts"`)
- `agentSdkVersion` -- The `CLAUDE_AGENT_SDK_VERSION` value
- `isInteractive` -- Always `"false"` for SDK sessions
- `clientType` -- The mapped client type (e.g., `"sdk-typescript"`)
- `userType` -- Always `"external"` in telemetry payloads
- `surface` -- Set to the entrypoint value via `getEntrypoint()` (L59)

This data flows through `c01()` (chunks.80.mjs:2480) into the telemetry event payload, enabling Anthropic to track SDK adoption and usage patterns separately from interactive CLI sessions.

---

## SDK Auto-Configuration When --sdk-url Is Set

When `--sdk-url` is provided, the CLI automatically configures several settings that would otherwise need to be specified manually:

```javascript
// ============================================
// sdkUrlAutoConfig - Auto-configures settings for --sdk-url mode
// Location: chunks.189.mjs:1089-1096
// ============================================

// ORIGINAL (for source lookup):
let D1 = H.sdkUrl ?? void 0;
if (D1) {
    if (!b) b = "stream-json";     // auto input format
    if (!m) m = "stream-json";     // auto output format
    if (H.verbose === void 0) g = !0; // auto verbose
    if (!H.print) U = !0           // auto print mode
}

// READABLE (for understanding):
let sdkUrl = argv.sdkUrl ?? undefined;
if (sdkUrl) {
    if (!inputFormat) inputFormat = "stream-json";   // Require bidirectional streaming
    if (!outputFormat) outputFormat = "stream-json"; // Require streaming output
    if (argv.verbose === undefined) verbose = true;  // Auto-enable verbose mode
    if (!argv.print) print = true;                   // Auto-enable print mode
}

// Mapping: D1→sdkUrl, H→argv, b→inputFormat, m→outputFormat, g→verbose, U→print
```

**Why auto-configure:** The `--sdk-url` flag is an internal flag used when Claude Code connects to a hosted session. The remote server always requires bidirectional streaming, so these are forced defaults. Manual users invoking `--sdk-url` don't need to also specify four other flags.

---

## JSON Schema Structured Output

The `--json-schema` flag enables validated structured output. When set, the final result is guaranteed to match the specified JSON schema.

**How it works:**
1. Schema is registered via `setJsonSchema(schema)` (called from `initializeSession` if in SDK mode, or from CLI args)
2. The agent is instructed to produce JSON-formatted output
3. On completion, the output is validated against the schema
4. If valid, returned in `result.result` as a JSON string
5. The parsed data is also available via the `attachment` message with `type: "structured_output"`

**Typical SDK usage:**

```javascript
// TypeScript SDK example:
const result = await client.run("Extract the name and age", {
    jsonSchema: {
        type: "object",
        properties: {
            name: { type: "string" },
            age: { type: "integer" }
        },
        required: ["name", "age"],
        additionalProperties: false
    }
});
// result.result is guaranteed to be { name: "...", age: ... }
```

**Where the schema is applied internally:**
- Set in `KR6(jsonSchema)` during session initialization
- Used to build a structured output tool or prompt injection
- For Bedrock: applied to `bedrockConfig.format = outputFormat`

---

## Error Message Adaptation for SDK Mode

The `isNonInteractive` check (w4) is the most-used guard in the codebase — over 30 call sites. Here's the complete taxonomy of how error messages differ:

| Scenario | Interactive mode | SDK mode |
|---|---|---|
| Authentication failure | `"Run /login to authenticate"` | `"Failed to authenticate"` |
| PDF file read failure | `"Double press esc to go back"` | `"Try reading the file a different way"` |
| Fast mode unavailable | Shows toggle option | `"Fast mode is not available in the Agent SDK"` |
| Permission denied | Shows interactive prompt | Returns deny result immediately |
| Beta tracing | Not available | Enabled when `CLAUDE_CODE_ENABLE_BETA_TRACING=1` |
| Escape key hint | Shows escape key shortcut | Not shown |
| Login prompt | `/login` command hint | API key environment variable hint |

**Why machine-optimized errors:** SDK callers parse output programmatically. Human-readable "you should run /login" instructions would be noise in machine-parseable output. The SDK mode uses terse, actionable error strings that map cleanly to SDK exception types.

---

## Control Request Flow — Complete State Machine

The control request/response protocol forms a state machine that governs SDK session lifecycle:

```
SDK Client                              Claude Code Binary
    │                                        │
    │ ──── control_request (initialize) ────► │
    │                                        ├── Register hooks, agents, schema
    │ ◄─── control_response (session info) ── │
    │                                        │
    │ ──── user message ─────────────────────► │
    │                                        ├── Process message
    │ ◄─── assistant message ──────────────── │
    │ ◄─── stream_event × N ──────────────── │ (if stream-json)
    │                                        │
    │ ◄─── control_request (can_use_tool) ── │ Claude wants to use Bash
    │                                        ├── Awaiting permission...
    │ ──── control_response (allow) ────────► │
    │                                        ├── Execute tool
    │ ◄─── tool_result ──────────────────────── │
    │                                        │
    │ ──── control_request (interrupt) ─────► │  [optional: user aborts]
    │                                        ├── abortController.abort()
    │ ◄─── control_response (success) ─────── │
    │                                        │
    │ ◄─── result (success/error) ──────────── │  Final message
```

**Key insight about concurrency:** Multiple user messages can be queued in the stream. The agent loop processes them sequentially, but the SDK can pipeline messages. The `control_request` (permission prompt) blocks the agent loop until the client responds — if the client is slow to respond, the entire agent turn is paused. This is why the `abortSignal` in `sendRequest` is critical for unblocking stuck sessions.

---

## SDK Hook Integration

SDK sessions support hooks injected via the `initialize` control request. These hooks are special — instead of running shell commands, they call back into the SDK via `hookCallbackIds`:

```javascript
// initialize request with hooks:
{
  "type": "control_request",
  "request": {
    "subtype": "initialize",
    "hooks": {
      "PreToolUse": [{
        "matcher": "Bash",
        "hookCallbackIds": ["callback-uuid-1"],
        "timeout": 30000
      }]
    }
  }
}
```

**How SDK hook callbacks work:**
1. SDK client registers a callback ID
2. When a matched tool is about to run, Claude Code sends a `control_request` with the callback ID
3. SDK client's registered handler is called
4. Response is returned via `control_response`
5. Agent proceeds based on the hook's decision (allow/deny/modify)

This enables the TypeScript/Python SDK to implement hooks as regular functions rather than external shell scripts, with full access to the SDK's context.

---

## Tools Integration in SDK Mode

### Tool Execution Differences

The `isNonInteractive` flag affects tool behavior in several key ways:

| Aspect | Interactive Mode | SDK Mode |
|---|---|---|
| Permission prompts | Shown interactively to user | Sent via `control_request` or MCP tool |
| Error messages | User-friendly with suggestions | Machine-parseable terse strings |
| Fast mode | Available (toggle with /fast) | Disabled (`"Fast mode is not available in the Agent SDK"`) |
| PDF reading failures | `"Double press esc to go back"` | `"Try reading the file a different way"` |
| Tool timeouts | User can cancel with Ctrl+C | Controlled via `abortSignal` |

### isNonInteractiveSession Flag Propagation

The `isNonInteractive` flag (accessed via `q7()`) propagates through the tool execution pipeline:

```javascript
// ============================================
// Tool execution checks isNonInteractive for behavior branching
// Location: Multiple tool implementations
// ============================================

// Example from PDF reading:
if (isNonInteractive()) {
    // SDK mode: machine-readable error
    throw new Error("Try reading the file a different way");
} else {
    // Interactive mode: user-friendly message with hint
    throw new Error("Failed to read PDF. Double press esc to go back.");
}

// Mapping: q7→isNonInteractive
```

### Permission Prompt Tool Flow

When `--permission-prompt-tool <tool-name>` is specified, Claude Code routes permission prompts to an MCP tool instead of the standard `control_request` mechanism:

```javascript
// ============================================
// Permission Prompt Tool - MCP-based permission handling
// Location: chunks.178.mjs:989-1010, chunks.179.mjs:1600-1630
// ============================================

// Permission request with MCP tool:
async function permissionRequestWithMcpTool(toolName, toolInput, sessionContext) {
    // Call the MCP tool with permission request payload
    let mcpToolCall = {
        type: "tool_use",
        name: toolName,
        input: {
            tool_name: toolInput.tool_name,
            input: toolInput.input,
            tool_use_id: toolInput.tool_use_id
        }
    };

    // Race between tool response and abort signal
    let response = await Promise.race([
        callMcpTool(mcpToolCall),
        abortSignalPromise
    ]);

    // Process response via processPermissionResult
    return processPermissionResult(
        parsePermissionResponse(response),
        permissionTool,
        toolInput,
        sessionContext
    );
}

// Mapping: JV6→processPermissionResult
```

**Permission tool response handling (`processPermissionResult` / JV6):**

```javascript
// ============================================
// processPermissionResult - Processes MCP tool permission result
// Location: chunks.184.mjs:1621-1642
// ============================================

// ORIGINAL (for source lookup):
function JV6(A, q, K, Y) {
    let z = {
        type: "permissionPromptTool",
        permissionPromptToolName: q.name,
        toolResult: A
    };
    if (A.behavior === "allow") {
        let _ = A.updatedPermissions;
        if (_) Y.setAppState((w) => ({
            ...w,
            toolPermissionContext: _v(w.toolPermissionContext, _)
        })), NC(_);
        return {
            ...A,
            decisionReason: z
        }
    } else if (A.behavior === "deny" && A.interrupt) k(`SDK permission prompt deny+interrupt: tool=${q.name} message=${A.message}`), Y.abortController.abort();
    return {
        ...A,
        decisionReason: z
    }
}

// READABLE (for understanding):
function processPermissionResult(toolResult, permissionTool, toolInput, sessionContext) {
    let decisionReason = {
        type: "permissionPromptTool",
        permissionPromptToolName: permissionTool.name,
        toolResult: toolResult
    };

    if (toolResult.behavior === "allow") {
        // Apply updated permissions if provided
        if (toolResult.updatedPermissions) {
            sessionContext.setAppState((state) => ({
                ...state,
                toolPermissionContext: mergePermissions(state.toolPermissionContext, toolResult.updatedPermissions)
            }));
            persistPermissions(toolResult.updatedPermissions);
        }
        return { ...toolResult, decisionReason };
    } else if (toolResult.behavior === "deny" && toolResult.interrupt) {
        // deny+interrupt: abort the entire session
        logDebug(`SDK permission prompt deny+interrupt: tool=${permissionTool.name}`);
        sessionContext.abortController.abort();
    }
    return { ...toolResult, decisionReason };
}

// Mapping: JV6→processPermissionResult, A→toolResult, q→permissionTool, K→toolInput, Y→sessionContext, z→decisionReason, _v→mergePermissions, NC→persistPermissions
```

**Permission tool response schema:**
```javascript
{
    behavior: "allow" | "deny" | "ask",
    message?: string,           // Optional message for deny/ask
    updatedPermissions?: [...], // Optional permission updates
    interrupt?: boolean,        // If true + deny, abort entire session
    updatedInput?: {...}        // Optional modified tool input
}
```

---

## Auto-Compact in SDK Mode

### Compaction Behavior in SDK Sessions

The auto-compaction feature behaves differently in SDK mode:

**Environment Variable Control:**
- `DISABLE_COMPACT=1` — Completely disables auto-compaction
- In SDK mode, compaction messages are streamed as `stream_event` messages

```javascript
// ============================================
// Auto-compact integration in SDK sessions
// Location: chunks.107.mjs:1707-1731
// ============================================

// ORIGINAL (for source lookup):
async function sI2(A, Q, B) {
    if (Y0(process.env.DISABLE_COMPACT)) return { wasCompacted: !1 };
    // ... compaction logic
}

// READABLE (for understanding):
async function autoCompactDispatcher(messages, sessionContext, sessionMemoryType) {
    // SDK can disable compact entirely via environment variable
    if (parseBoolean(process.env.DISABLE_COMPACT)) {
        return { wasCompacted: false };
    }
    // ... rest of compaction logic
}

// Mapping: sI2→autoCompactDispatcher, Y0→parseBoolean
```

**Key differences in SDK mode:**
1. No interactive prompts for compaction confirmation
2. Compaction events are emitted as `stream_event` messages (if `--include-partial-messages`)
3. The `autoCompactEnabled` setting from settings.json still applies
4. Token thresholds are the same as interactive mode

**Compaction message in stream:**
```javascript
{
    "type": "stream_event",
    "event": {
        "type": "content_block_start",
        "index": 0,
        "content_block": {
            "type": "compaction",
            // ... compaction details
        }
    },
    "session_id": "<uuid>",
    "uuid": "<uuid>"
}
```

---

## Skills and Slash Commands in SDK Mode

### SkillTool Behavior

The SkillTool (`wt`) works in SDK mode but with some differences:

**Skills availability:**
- Custom skills defined in `.claude/skills/` are available
- Built-in skills are available (unless disabled via `--disallowed-tools`)
- The `isNonInteractive` check affects skill prompt suggestions

```javascript
// ============================================
// SkillTool - Skills work in SDK mode
// Location: chunks.132.mjs:820
// ============================================

// Skills are registered as tools and invoked normally
// The skill expansion happens before the tool is executed
const SkillTool = {
    name: "Skill",
    inputSchema: skillInputSchema,
    handler: async (input, context) => {
        // Skill expansion and execution
        // Works identically in SDK and interactive mode
    }
};
```

### Slash Command Expansion

Slash commands (`/help`, `/clear`, `/compact`, etc.) are handled differently in SDK mode:

**Expansion mechanism:**
1. User message contains `/command` text
2. `queued_command` attachment is created
3. Attachment is processed and command is expanded

```javascript
// ============================================
// Queued command attachment handling
// Location: chunks.142.mjs:1993-2001, chunks.179.mjs:315-353
// ============================================

// In attachment processing:
if (event.attachment.type === "queued_command") {
    // Expand the command into a user message
    yield {
        type: "user",
        message: { role: "user", content: event.attachment.prompt },
        session_id: getSessionId(),
        isReplay: true
    };
}
```

**Commands available in SDK mode:**
- Most slash commands work (unless they require interactive UI)
- `/clear` — Clears conversation
- `/compact` — Triggers manual compaction
- `/model` — Changes model
- `/permissions` — Updates permission mode

**Commands NOT available in SDK mode:**
- `/doctor` — Requires interactive terminal UI
- `/review-pr` — Requires interactive prompts
- `/config` — Some features require interactive editing

### queued_command Attachment Type

When a slash command is queued, it appears as an attachment:

```javascript
{
    "type": "attachment",
    "attachment": {
        "type": "queued_command",
        "prompt": "Expanded command content...",
        "source_uuid": "<original-message-uuid>"
    },
    "session_id": "<uuid>",
    "uuid": "<uuid>"
}
```

This is then expanded into a user message in the stream, allowing the agent to process it as if the user had typed the expanded content directly.

---

## Practical SDK Usage Examples

### Example 1: Basic TypeScript SDK Agent

```javascript
// ============================================
// TypeScript SDK - Basic agent usage pattern
// Location: User code (not in Claude Code source)
// ============================================

import { ClaudeAgent } from '@anthropic-ai/claude-agent-sdk';

const client = new ClaudeAgent({
  model: 'claude-sonnet-4-6',
  maxTurns: 10,
});

// Simple prompt
const result = await client.run('List all TypeScript files in the src directory');
console.log(result.result);

// Stream events in real-time
for await (const event of client.stream('Analyze the codebase structure')) {
  switch (event.type) {
    case 'stream_event':
      // Handle streaming events (thinking, text, tool_use)
      console.log(event.event.type);
      break;
    case 'result':
      // Final result
      console.log('Completed:', result.subtype);
      break;
  }
}
```

### Example 2: Permission Handling with MCP Tool

```javascript
// ============================================
// SDK with permission-prompt-tool for automated permissions
// Location: User code (not in Claude Code source)
// ============================================

import { ClaudeAgent } from '@anthropic-ai/claude-agent-sdk';

const client = new ClaudeAgent({
  model: 'claude-sonnet-4-6',
  permissionPromptTool: 'my_permission_handler', // MCP tool name
});

// The MCP tool receives permission requests:
// {
//   tool_name: "Bash",
//   input: { command: "npm install", description: "Install dependencies" },
//   tool_use_id: "xxx"
// }

// MCP tool returns:
// { behavior: "allow" } | { behavior: "deny", message: "..." }
```

### Example 3: Structured Output with JSON Schema

```javascript
// ============================================
// SDK with JSON Schema for validated structured output
// Location: User code (not in Claude Code source)
// ============================================

import { ClaudeAgent } from '@anthropic-ai/claude-agent-sdk';

const result = await client.run('Extract user profile from this text', {
  jsonSchema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      age: { type: 'integer', minimum: 0 },
    },
    required: ['name', 'email'],
    additionalProperties: false,
  },
});

// result.result is guaranteed to match the schema
const profile = JSON.parse(result.result);
console.log(profile.name, profile.email);
```

### Example 4: Hook Callbacks for PreToolUse

```javascript
// ============================================
// SDK with hook callbacks for tool interception
// Location: User code (not in Claude Code source)
// ============================================

import { ClaudeAgent } from '@anthropic-ai/claude-agent-sdk';

const client = new ClaudeAgent({
  hooks: {
    PreToolUse: [
      {
        matcher: 'Bash', // Match Bash tool
        handler: async (toolInput) => {
          // Intercept before Bash execution
          if (toolInput.command.includes('rm -rf')) {
            return {
              behavior: 'deny',
              message: 'Destructive commands not allowed',
            };
          }
          return { behavior: 'allow' };
        },
      },
    ],
  },
});

// The hook intercepts Bash tool calls before execution
```

### Example 5: Session Resumption

```javascript
// ============================================
// SDK session persistence and resumption
// Location: User code (not in Claude Code source)
// ============================================

import { ClaudeAgent } from '@anthropic-ai/claude-agent-sdk';

// First session
const client1 = new ClaudeAgent({ sessionId: 'my-session-123' });
await client1.run('Remember that my name is Alice');

// Later: Resume the session
const client2 = new ClaudeAgent({ resume: 'my-session-123' });
const result = await client2.run('What is my name?');
// Result will include context from previous session
```

### Example 6: Budget and Turn Limits

```javascript
// ============================================
// SDK with budget and turn limits
// Location: User code (not in Claude Code source)
// ============================================

import { ClaudeAgent } from '@anthropic-ai/claude-agent-sdk';

const client = new ClaudeAgent({
  model: 'claude-sonnet-4-6',
  maxTurns: 5,        // Maximum 5 agent turns
  maxBudgetUsd: 1.00, // Maximum $1.00 API cost
});

const result = await client.run('Complex analysis task');

// Check why the session ended
if (result.subtype === 'error_max_turns') {
  console.log('Reached turn limit at', result.num_turns, 'turns');
} else if (result.subtype === 'error_max_budget_usd') {
  console.log('Reached budget limit at $', result.total_cost_usd);
}
```

### Example 7: Raw CLI Invocation

```bash
# ============================================
# Raw CLI with --print for SDK-like usage
# Location: Shell scripts
# ============================================

# Basic non-interactive prompt
echo '{"type": "user", "content": "Hello"}' | claude --print

# With stream-json output format
claude --print --output-format stream-json << 'EOF'
{"type": "user_message", "content": "List files"}
EOF

# With structured output
claude --print --json-schema '{"type":"object","properties":{"result":{"type":"string"}}}' \
  --output-format json << 'EOF'
{"type": "user_message", "content": "Summarize the project"}
EOF

# With permission-prompt-tool for automated permissions
claude --print --permission-prompt-tool my_permission_handler \
  --output-format stream-json
```

---

## SDK Integration Best Practices

### Error Handling

```javascript
try {
  const result = await client.run('Task');
  if (result.is_error) {
    // Handle execution errors
    console.error('Agent errors:', result.errors);
  }
} catch (error) {
  // Handle connection/stream errors
  if (error.name === 'AbortError') {
    console.log('Session was interrupted');
  }
}
```

### Streaming Response Handling

```javascript
// Stream events as they arrive
for await (const event of client.streamEvents('Analyze code')) {
  switch (event.type) {
    case 'stream_event':
      if (event.event.type === 'content_block_delta') {
        // Text or thinking delta
        process.stdout.write(event.event.delta.text);
      }
      break;
    case 'control_request':
      // Permission request - respond via control_response
      await respondToPermission(event.request);
      break;
    case 'result':
      // Session complete
      break;
  }
}
```

### Timeout Management

```javascript
// Set timeout for long-running operations
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 60000); // 1 minute

try {
  const result = await client.run('Long task', {
    signal: controller.signal,
  });
} finally {
  clearTimeout(timeout);
}
```

---

## UI Interaction Design for SDK Clients

### Overview

SDK clients must reconstruct interactive UI state from the NDJSON stream events. This section documents the state machine and event mapping patterns that enable rich client interfaces.

### UI State Machine

The UI state machine tracks the current phase of agent operation:

```
┌─────────────┐     user message     ┌─────────────┐
│   idle      │ ──────────────────────▶│ requesting  │
└─────────────┘                        └─────────────┘
     ▲                                       │
     │                                       │ stream_request_start
     │                                       ▼
     │                                ┌─────────────┐
     │     message_stop               │  thinking   │
     │ ◀──────────────────────────────│             │
     │                                └─────────────┘
     │                                       │
     │                                       │ content_block_start (type: text)
     │                                       ▼
     │                                ┌─────────────┐
     │     content_block_stop          │ responding  │
     │ ◀──────────────────────────────│             │
     │                                └─────────────┘
     │                                       │
     │                                       │ content_block_start (type: tool_use)
     │                                       ▼
     │                                ┌─────────────┐
     │     content_block_stop          │ tool-use    │
     │ ◀──────────────────────────────│             │
     │                                └─────────────┘
     │                                       │
     │                                       │ tool_input_complete
     │                                       ▼
     │                                ┌─────────────┐
     │     tool_result                 │ tool-input  │
     │ ◀──────────────────────────────│             │
     └───────────────────────────────└─────────────┘
```

**State Transitions:**

| Current State | Event | Next State | UI Action |
|---------------|-------|------------|-----------|
| idle | User sends message | requesting | Show "Sending..." indicator |
| requesting | `stream_request_start` | thinking | Show "Thinking..." spinner |
| thinking | `content_block_start` (text) | responding | Start text streaming display |
| thinking | `content_block_start` (tool_use) | tool-use | Show tool name, prepare input |
| responding | `content_block_stop` | idle (or thinking) | Finalize text display |
| tool-use | `content_block_stop` | tool-input | Execute tool, show result |
| tool-input | `tool_result` event | thinking | Return to thinking state |

### Stream Event → UI State Mapping

```javascript
// ============================================
// UI State Dispatcher - Maps stream events to UI states
// Location: chunks.173.mjs:2384 (handleToolUseStream)
// ============================================

// ORIGINAL (for source lookup):
async function xN6(A, Q, B, g, Z) {
  // xN6 handles tool execution state transitions
  // Dispatches to appropriate handler based on tool type
  const toolType = Q.type;
  const handlers = {
    [serverToolTypes.bash]: handleBashTool,
    [serverToolTypes.read]: handleReadTool,
    [serverToolTypes.write]: handleWriteTool,
    [serverToolTypes.edit]: handleEditTool,
    // ... 11 server-side tool types total
  };
  return handlers[toolType]?.(A, Q, B, g, Z) ?? handleLocalTool(A, Q, B, g, Z);
}

// READABLE (for understanding):
async function handleToolUseStream(sessionContext, toolUse, toolResult, state, options) {
  // handleToolUseStream dispatches tool execution to appropriate handlers
  // Based on tool type, routes to server-side or local execution
  const toolType = toolUse.type;

  // Server-side tools require backend processing
  const serverSideHandlers = {
    bash: handleBashTool,        // Shell command execution
    read: handleReadTool,        // File reading
    write: handleWriteTool,      // File writing
    edit: handleEditTool,        // File editing
    glob: handleGlobTool,        // File pattern matching
    grep: handleGrepTool,        // Content search
    webFetch: handleWebFetchTool, // Web content fetching
    webSearch: handleWebSearchTool, // Web search
    taskOutput: handleTaskOutputTool, // Background task output
    agent: handleAgentTool,       // Subagent spawning
    skill: handleSkillTool        // Skill invocation
  };

  // Local tools execute in SDK client context
  if (serverSideHandlers[toolType]) {
    return serverSideHandlers[toolType](sessionContext, toolUse, toolResult, state, options);
  }
  return handleLocalTool(sessionContext, toolUse, toolResult, state, options);
}

// Mapping: xN6→handleToolUseStream, A→sessionContext, Q→toolUse, B→toolResult, g→state, Z→options
```

### Callback Interface for UI Reconstruction

SDK clients implement callback interfaces to handle UI state changes:

```typescript
// TypeScript interface for UI callbacks
interface SDKUICallbacks {
  // State transitions
  onStateChange(state: 'idle' | 'requesting' | 'thinking' | 'responding' | 'tool-use' | 'tool-input'): void;

  // Content streaming
  onTextDelta(delta: string): void;
  onThinkingDelta(delta: string): void;
  onToolInputDelta(toolName: string, partialJson: string): void;

  // Tool execution
  onToolStart(toolName: string, toolId: string): void;
  onToolInputComplete(toolName: string, toolId: string, input: object): void;
  onToolResult(toolId: string, result: any): void;

  // Status events
  onAuthStatus(status: AuthStatus): void;
  onRateLimit(info: RateLimitInfo): void;
  onPromptSuggestion(suggestion: string): void;
  onTaskNotification(notification: TaskNotification): void;

  // Error handling
  onError(error: SDKError): void;
}

// Event dispatcher implementation
class SDKEventDispatcher {
  private state: UIState = 'idle';
  private callbacks: SDKUICallbacks;

  dispatch(event: StreamEvent) {
    switch (event.type) {
      case 'stream_request_start':
        this.transition('thinking');
        break;

      case 'stream_event':
        this.handleStreamEvent(event.event);
        break;

      case 'result':
        this.transition('idle');
        break;
    }
  }

  private transition(newState: UIState) {
    if (this.state !== newState) {
      this.state = newState;
      this.callbacks.onStateChange(newState);
    }
  }

  private handleStreamEvent(event: AnthropicEvent) {
    switch (event.type) {
      case 'content_block_start':
        if (event.content_block.type === 'thinking') {
          // Extended thinking mode
        } else if (event.content_block.type === 'text') {
          this.transition('responding');
        } else if (event.content_block.type === 'tool_use') {
          this.transition('tool-use');
          this.callbacks.onToolStart(
            event.content_block.name,
            event.content_block.id
          );
        }
        break;

      case 'content_block_delta':
        if (event.delta.type === 'text_delta') {
          this.callbacks.onTextDelta(event.delta.text);
        } else if (event.delta.type === 'thinking_delta') {
          this.callbacks.onThinkingDelta(event.delta.thinking);
        } else if (event.delta.type === 'input_json_delta') {
          this.callbacks.onToolInputDelta(
            this.currentToolName,
            event.delta.partial_json
          );
        }
        break;

      case 'content_block_stop':
        if (this.state === 'tool-use') {
          // Tool input complete, waiting for execution
          this.transition('tool-input');
        }
        break;
    }
  }
}
```

### Tool Input JSON Accumulation

SDK clients must buffer partial JSON deltas and parse when complete:

```javascript
// ============================================
// Tool Input Accumulator - Buffers and parses JSON deltas
// ============================================

class ToolInputAccumulator {
  private buffers: Map<string, { name: string; buffer: string }> = new Map();

  onInputDelta(toolId: string, toolName: string, partialJson: string) {
    const entry = this.buffers.get(toolId) || { name: toolName, buffer: '' };
    entry.buffer += partialJson;
    this.buffers.set(toolId, entry);

    // Try to parse partial JSON for preview (may fail)
    try {
      const parsed = this.parsePartialJson(entry.buffer);
      this.emitPreview(toolId, parsed);
    } catch {
      // Invalid JSON - show raw buffer (truncated)
      this.emitPreview(toolId, entry.buffer.slice(0, 100) + '...');
    }
  }

  onComplete(toolId: string): object {
    const entry = this.buffers.get(toolId);
    if (!entry) throw new Error(`No buffer for tool ${toolId}`);

    const parsed = JSON.parse(entry.buffer);
    this.buffers.delete(toolId);
    return parsed;
  }

  private parsePartialJson(json: string): object {
    // Attempt to parse potentially incomplete JSON
    // Uses lenient parser for preview purposes
    return JSON.parse(json + '"'.repeat(this.countUnclosedStrings(json)));
  }

  private countUnclosedStrings(json: string): number {
    // Count unclosed string literals
    let inString = false;
    let escape = false;
    for (const char of json) {
      if (escape) { escape = false; continue; }
      if (char === '\\') { escape = true; continue; }
      if (char === '"') inString = !inString;
    }
    return inString ? 1 : 0;
  }
}
```

### Thinking Panel Integration

Extended thinking mode streams thinking content that should be displayed in a collapsible panel:

```javascript
// ============================================
// Thinking Panel State Management
// ============================================

interface ThinkingPanelState {
  isStreaming: boolean;
  content: string;
  isExpanded: boolean;
}

class ThinkingPanelManager {
  private state: ThinkingPanelState = {
    isStreaming: false,
    content: '',
    isExpanded: false
  };

  onStart() {
    this.state.isStreaming = true;
    this.state.content = '';
    this.emitState();
  }

  onDelta(delta: string) {
    this.state.content += delta;
    this.emitState();
  }

  onStop() {
    this.state.isStreaming = false;
    this.emitState();
  }

  toggleExpanded() {
    this.state.isExpanded = !this.state.isExpanded;
    this.emitState();
  }
}
```

### SDK Client Reconstruction Pattern

The recommended pattern for reconstructing UI state:

```javascript
// Full SDK client example with UI state management
class SDKClient {
  private eventDispatcher: SDKEventDispatcher;
  private toolAccumulator: ToolInputAccumulator;
  private thinkingManager: ThinkingPanelManager;

  async processStream(stream: AsyncIterable<StreamEvent>) {
    for await (const event of stream) {
      switch (event.type) {
        case 'stream_request_start':
          // Initialize new request state
          this.toolAccumulator = new ToolInputAccumulator();
          this.eventDispatcher.dispatch(event);
          break;

        case 'stream_event':
          // Process Anthropic API events
          if (event.event.type === 'content_block_delta') {
            if (event.event.delta.type === 'input_json_delta') {
              this.toolAccumulator.onInputDelta(
                event.event.index,
                this.currentToolName,
                event.event.delta.partial_json
              );
            }
          }
          this.eventDispatcher.dispatch(event);
          break;

        case 'result':
          // Session complete
          this.eventDispatcher.dispatch(event);
          break;

        case 'control_request':
          // Permission request
          const response = await this.handlePermissionRequest(event.request);
          await this.sendControlResponse(response);
          break;
      }
    }
  }
}
```

### Server-Side Tool Types

The SDK supports 11 server-side tool types that require backend execution:

| Tool Type | Handler Function | Input Type | Result Type |
|-----------|-----------------|------------|-------------|
| bash | `handleBashTool` | `{command, timeout}` | `{stdout, stderr, exit_code}` |
| read | `handleReadTool` | `{file_path, limit, offset}` | `{content, lines}` |
| write | `handleWriteTool` | `{file_path, content}` | `{success}` |
| edit | `handleEditTool` | `{file_path, old_string, new_string}` | `{success}` |
| glob | `handleGlobTool` | `{pattern, path}` | `{matches[]}` |
| grep | `handleGrepTool` | `{pattern, path, type}` | `{matches[]}` |
| webFetch | `handleWebFetchTool` | `{url, prompt}` | `{content}` |
| webSearch | `handleWebSearchTool` | `{query}` | `{results[]}` |
| taskOutput | `handleTaskOutputTool` | `{task_id, block, timeout}` | `{output, status}` |
| agent | `handleAgentTool` | `{prompt, subagent_type}` | `{result}` |
| skill | `handleSkillTool` | `{skill, args}` | `{result}` |

### TTFT Metric Tracking

Time To First Token (TTFT) is a critical performance metric for SDK clients:

```javascript
// ============================================
// TTFT Tracking - Measure time to first response token
// ============================================

class TTFTTracker {
  private requestStartTime: number | null = null;
  private firstTokenTime: number | null = null;

  onRequestStart() {
    this.requestStartTime = performance.now();
    this.firstTokenTime = null;
  }

  onFirstToken() {
    if (this.firstTokenTime === null) {
      this.firstTokenTime = performance.now();
    }
  }

  getTTFT(): number | null {
    if (this.requestStartTime === null || this.firstTokenTime === null) {
      return null;
    }
    return this.firstTokenTime - this.requestStartTime;
  }
}

// Usage in stream processing
for await (const event of stream) {
  if (event.type === 'stream_event' &&
      event.event.type === 'content_block_delta' &&
      event.event.delta.type === 'text_delta') {
    ttftTracker.onFirstToken();
    const ttft = ttftTracker.getTTFT();
    if (ttft !== null) {
      console.log(`TTFT: ${ttft.toFixed(0)}ms`);
    }
  }
}
```

---

## Key Algorithm Summary

This section provides a consolidated reference for the core algorithms used throughout the SDK module.

### 1. Exponential Backoff with Jitter

**Used by:** WebSocketTransport reconnection, BatchQueue retry

**Algorithm:**
```javascript
// Base formula: delay = min(baseDelay * 2^(attempts-1) + jitter, maxDelay)
// WebSocketTransport: base=1000ms, max=30000ms, jitter=±25%
// BatchQueue: base=500ms, max=8000ms, jitter=0-1000ms

function computeBackoff(attempts, baseMs, maxMs, jitterMs) {
    let backoff = Math.min(baseMs * Math.pow(2, attempts - 1), maxMs);
    let jitter = jitterMs * Math.random();
    return backoff + jitter;
}
```

**Why jitter matters:** Prevents "thundering herd" where all clients retry simultaneously after a server outage, overwhelming the server again.

**See also:** [transport_layer.md](./transport_layer.md#reconnection-algorithm), [sdk_outbound_queue.md](./sdk_outbound_queue.md#retry-delay-algorithm)

---

### 2. Message Buffering and Replay

**Used by:** WebSocketTransport reconnection recovery

**Algorithm:**
```
1. On send: store message in CircularBuffer(1000) with UUID
2. On reconnect: send X-Last-Request-Id header with last sent UUID
3. Server responds with X-Last-Request-Id of last received message
4. Client replays all messages after that point
```

**Key insight:** The 1000-message buffer provides ~1 minute of reconnection coverage at typical message rates. Larger buffers would consume more memory without proportional benefit.

**See also:** [transport_layer.md](./transport_layer.md#message-replay-on-reconnect)

---

### 3. Stream Event Batching (100ms Window)

**Used by:** HybridTransport stream_event coalescing

**Algorithm:**
```
1. On stream_event write: add to buffer, start 100ms timer if not running
2. On non-stream_event write: flush buffer immediately, then write message
3. On timer fire: flush buffer via HTTP POST
```

**Why 100ms:** Balances latency (users see events quickly) with efficiency (fewer HTTP requests). A 100ms window typically captures 10-50 stream events per batch.

**Trade-off:**
- Shorter window: lower latency, more HTTP overhead
- Longer window: higher latency, fewer HTTP requests

**See also:** [transport_layer.md](./transport_layer.md#hybridtransport)

---

### 4. Queue Backpressure

**Used by:** BatchQueue capacity management

**Algorithm:**
```
1. On enqueue: check if pending.length + items.length > maxQueueSize
2. If full: await Promise that resolves when space available
3. On drain: call releaseBackpressure() to wake waiters
```

**Why backpressure:** Prevents unbounded memory growth when the network can't keep up with event production. Without backpressure, a slow network would cause OOM errors.

**Default limits:**
- maxQueueSize: 100,000 events
- maxBatchSize: 500 events per HTTP POST

**See also:** [sdk_outbound_queue.md](./sdk_outbound_queue.md#enqueue-algorithm)

---

### 5. Permission Flow Routing

**Used by:** Tool execution permission handling

**Algorithm:**
```
1. Check isNonInteractive()
   - If false: show terminal UI prompt, await keyboard input
   - If true: continue to step 2

2. Check hasMcpPermissionTool()
   - If true: invoke MCP tool with permission request
   - If false: continue to step 3

3. Send control_request to SDK client
   - Await control_response with allow/deny decision
```

**Key insight:** This three-tier routing allows:
- Interactive users to approve/deny in real-time
- SDK users with MCP servers to automate permissions
- SDK users without MCP to implement custom UI

**See also:** [sdk_tools_integration.md](./sdk_tools_integration.md#permission-handling), [sdk_cross_references.md](./sdk_cross_references.md#tool-execution-cross-reference)

---

### 6. UI State Machine

**Used by:** handleToolUseStream event processor

**States:**
```
"idle" → "requesting" → "thinking" → "responding" → "tool-input" → "tool-use" → "idle"
```

**Transitions:**
| Event | From | To |
|-------|------|-----|
| stream_request_start | idle | requesting |
| content_block_start(thinking) | requesting | thinking |
| content_block_start(text) | requesting/responding | responding |
| content_block_start(tool_use) | any | tool-input |
| message_stop | any | tool-use |
| result | any | idle |

**See also:** [ui_linkage.md](./ui_linkage.md#the-ui-state-machine)

---

### 7. Attachment Group Filtering

**Used by:** System reminder production

**Groups:**
```
Group 1 (Sequential): at_mentioned_files, mcp_resources, agent_mentions
Group 2 (Parallel): changed_files, plan_mode, todo_reminders, etc.
Group 3 (Main-Agent-Only): ide_selection, diagnostics, token_usage, queued_commands
```

**SDK Mode Effect:**
- Group 1: Same, but routed through SDK channels
- Group 2: Same, but output as events instead of UI
- Group 3: Some return NULL (IDE selection), some output as events (token usage)

**See also:** [sdk_cross_references.md](./sdk_cross_references.md#detailed-attachment-producer-cross-reference)

---

## Summary

The SDK module provides a complete programmatic interface to Claude Code through:

1. **Transport Layer**: NDJSON over stdio or WebSocket with reconnection and batching
2. **Permission Flow**: Three-tier routing for interactive, MCP, and SDK clients
3. **State Management**: React/Ink context with selector-based subscriptions
4. **Streaming Protocol**: Real-time event delivery with backpressure
5. **Cross-Module Integration**: Hooks, MCP, Compact, and System Reminders

For detailed analysis of specific components, refer to the individual documents listed in the [Sub-Documents](#sub-documents) section.
