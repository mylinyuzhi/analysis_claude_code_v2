# MCP (Model Context Protocol) Implementation

## 1. Overview

The **Model Context Protocol (MCP)** implementation in Claude Code acts as a bridge between the LLM and external tools/resources. It employs a **Meta-Tooling Architecture** where the model interacts with MCP servers via a virtual CLI command (`mcp-cli`) rather than native tool bindings for every single tool. This allows scaling to hundreds of tools without consuming excessive context window space.

### Key Components
-   **Meta-Tool (`mcp-cli`)**: A virtual command-line interface intercepted by the system.
-   **Client (`McpClient` / `rH6`)**: Manages JSON-RPC connections to servers.
-   **Transports**: Supports `StdioClientTransport` (`SJA`) and remote/HTTP transports.
-   **State Management**: Persists connection state and tool definitions to `~/.claude/claude-code-mcp-cli/`.

## 2. Meta-Tool Architecture

Instead of registering every MCP tool as a native Anthropic API tool, Claude Code registers a single "Meta-Tool" or simply instructs the model to use the `mcp-cli` command.

### Execution Flow
1.  **Model Output**: The model generates a `Bash` tool call executing `mcp-cli call <server>/<tool> <args>`.
2.  **Interception**: The `Bash` tool executor (or a pre-execution hook) detects the `mcp-cli` command.
3.  **Parsing (`A11`)**: The command is parsed using a `Commander.js` instance (`mcpCliProgram`).
4.  **Execution (`yHz`)**:
    -   Resolves the server and tool name (`mFA`).
    -   Connects to the server if not already connected.
    -   Sends a `tools/call` JSON-RPC request.
5.  **Output**: The result is formatted as JSON (or text) and returned as "stdout" to the model.

## 3. Client Implementation (`chunks.79.mjs`)

The core client logic resides in `chunks.79.mjs`.

### `McpClient` (`rH6`)
Extends a base client class (`Hb1`) and implements:
-   `connect()`: Handshakes with the server (`initialize`).
-   `callTool()`: Sends `tools/call`.
-   `readResource()`: Sends `resources/read`.
-   `listTools()` / `listResources()`: Discovery methods.

### Transports
-   **`StdioClientTransport` (`SJA`)**:
    -   Spawns a child process.
    -   Pipes `stdin` and `stdout`.
    -   Redirects `stderr` to a separate stream for logging.
    -   Handles process lifecycle (kill on close).

## 4. CLI Interface (`chunks.175.mjs`)

The `mcp-cli` logic is defined in `chunks.175.mjs` using `Commander.js`.

### Subcommands
-   `servers`: List connected servers.
-   `tools`: List available tools (optionally filtered by server).
-   `info <tool>`: Get tool schema/description.
-   `call <tool> <args>`: Execute a tool.
-   `read <resource>`: Read a resource URI.
-   `grep <pattern>`: Search tools by name/description.

### Remote Execution (`zY1`)
If the environment detects it is running in a remote context (e.g., via `RE()` check), it delegates the execution to a remote endpoint (`POST /mcp`) using `zY1` (`callRemoteMcpEndpoint`).

## 5. Configuration & State

-   **Session State**: Stored in `~/.claude/claude-code-mcp-cli/<sessionId>.json`. Contains active server configs and cached tool definitions.
-   **Config Discovery**: Looks for `.mcp.json` or project-specific settings to auto-connect servers on startup.

## 6. Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md)

Key functions in this document:
- `mcpCliProgram` (A11) - Commander instance for `mcp-cli`.
- `executeMcpTool` (yHz) - Tool execution logic.
- `McpClient` (rH6) - Core client class.
- `StdioClientTransport` (SJA) - Process-based transport.
- `callRemoteMcpEndpoint` (zY1) - Remote delegation.
