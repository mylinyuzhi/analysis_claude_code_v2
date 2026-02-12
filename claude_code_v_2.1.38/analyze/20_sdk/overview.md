# Agent SDK Architecture

## Overview

Claude Code exposes an Agent SDK that allows external developers to build custom agents on top of the Claude Code runtime. The SDK operates through a **non-interactive print mode** where the Claude Code binary is invoked programmatically via `--print` flags and communicates over JSON-streaming stdio. SDK clients exist for TypeScript, Python, and raw CLI invocation. The system detects which SDK is being used through the `CLAUDE_CODE_ENTRYPOINT` environment variable and adapts its behavior accordingly -- changing system prompts, restricting certain built-in agents, adjusting error messages, and selecting the appropriate I/O transport.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `isNonInteractive` (w4) - Returns true when running in SDK/print mode
- `setInteractive` (bL6) - Sets the interactive flag on global state
- `getEntrypoint` (L59) - Returns the current entrypoint string
- `setEntrypoint` (iGz) - Detects and sets CLAUDE_CODE_ENTRYPOINT
- `determineClientType` (inline in nGz) - Maps entrypoint to client type
- `StdioStreamIO` (Mc1) - Base stdio JSON streaming transport
- `SdkUrlStreamIO` (FQA) - WebSocket-based transport for SDK URL connections
- `createStreamIO` (IJz) - Factory that selects StdioStreamIO or SdkUrlStreamIO
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

## Non-Interactive Mode Detection (isNonInteractive / w4)

### isNonInteractive - The core SDK mode check

**What it does:** A simple boolean getter (`w4()`) that returns `true` when Claude Code is running in non-interactive mode -- which includes all SDK scenarios, `--print` mode, and piped usage.

**How it works:**
1. Global state object `o6` holds `isInteractive` boolean
2. `w4()` returns `!o6.isInteractive`
3. The flag is set early in `main()` via `bL6(!z)` where `z` is true if any of: `--print`, `--init-only`, `--sdk-url`, or `!process.stdout.isTTY`

```javascript
// ============================================
// isNonInteractive - Check if running in SDK/print mode
// Location: chunks.1.mjs:2730-2732
// ============================================

// ORIGINAL (for source lookup):
function w4() {
    return !o6.isInteractive
}

// READABLE (for understanding):
function isNonInteractive() {
    return !globalState.isInteractive;
}

// Mapping: w4→isNonInteractive, o6→globalState
```

**Why this approach:**
Rather than checking entrypoint strings everywhere, the system uses a single boolean that captures the fundamental behavioral difference: interactive (human-in-the-loop with terminal UI) versus non-interactive (programmatic, machine-readable I/O). This is checked in 30+ locations throughout the codebase to adjust behavior:
- Error messages: SDK mode shows concise machine-parseable errors; interactive mode shows user-friendly messages with suggestions like "Run /login" or "Double press esc"
- Fast mode: Disabled in SDK mode (`"Fast mode is not available in the Agent SDK"`)
- PDF handling: SDK mode says "Try reading the file a different way"; interactive mode says "Double press esc to go back"
- Authentication: SDK mode shows `"Failed to authenticate"` directly; interactive mode suggests `/login`
- Beta tracing: Only enabled when both environment flags are set AND in SDK mode

**Key insight:** The `isNonInteractive` check is the single most important behavioral fork in the codebase. Almost every user-facing message and many control flow decisions branch on it.

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
    if (J6(process.env.CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS) && w4()) return [];
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
