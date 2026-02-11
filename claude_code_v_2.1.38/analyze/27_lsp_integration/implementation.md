# LSP Integration Analysis

## Module Overview

Claude Code v2.1.38 includes a comprehensive Language Server Protocol (LSP) client. This enables the agent to provide advanced code intelligence features such as "Go to Definition", "Find References", "Hover Information", and "Document Symbols". The system supports multiple LSP servers running in parallel, mapped by file extension.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `createLspClient` (um4) - Low-level wrapper for LSP process communication
- `LspServerInstance` (Fm4) - Manages a single LSP server's lifecycle and requests
- `LspServerManager` (lm4) - Orchestrates multiple LSP servers across the workspace
- `registerDiagnostics` (om4) - Handles incoming diagnostic notifications

## LSP Client Factory (um4)

The `createLspClient` function creates a wrapper around a child process that implements the LSP protocol over `stdio`.

```javascript
// ============================================
// createLspClient - stdio-based LSP client
// Location: chunks.133.mjs:1614-1775
// ============================================

// READABLE (for understanding):
function createLspClient(serverName) {
    let process, connection, capabilities;
    let isInitialized = false;
    let pendingNotifications = [];

    return {
        async start(command, args, options) {
            process = spawn(command, args, {
                stdio: ["pipe", "pipe", "pipe"],
                env: { ...globalThis.process.env, ...options.env },
                cwd: options.cwd
            });

            const reader = new StreamMessageReader(process.stdout);
            const writer = new StreamMessageWriter(process.stdin);
            connection = createMessageConnection(reader, writer);
            
            connection.listen();
            // ... setup notification and request handlers ...
        },

        async initialize(params) {
            const result = await connection.sendRequest("initialize", params);
            capabilities = result.capabilities;
            await connection.sendNotification("initialized", {});
            isInitialized = true;
            return result;
        },

        sendRequest(method, params) {
            return connection.sendRequest(method, params);
        },

        stop() {
            await connection.sendRequest("shutdown", {});
            await connection.sendNotification("exit", {});
            process.kill();
        }
    };
}
```

## LSP Server Management

The `LspServerManager` (lm4) is the central coordinator. It maintains a mapping of file extensions to LSP servers and ensures the correct server is started when a file is accessed.

### Server Lifecycle (Algorithm)

**What it does:** Manages the "Starting -> Running -> Stopped" states of LSP servers.

**How it works:**
1. **Detection**: When an agent requests a feature for `file.ts`, the manager looks up `.ts` in the `extensionToLanguage` map.
2. **Auto-Start**: If the mapped server (e.g., `typescript-language-server`) is stopped, it calls `start()`.
3. **Initialization**: It sends the `initialize` request with workspace folders and client capabilities (Hover, Definition, etc.).
4. **Retry Logic**: If a request fails with `ContentModified` (-32801), it implements an exponential backoff retry (up to 3 times, starting at 500ms).

```javascript
// ============================================
// LspServerInstance Request Handler with Retry
// Location: chunks.133.mjs:1892-1912
// ============================================

// ORIGINAL (for source lookup):
async function X(P, W) {
    let G;
    for (let Z = 0; Z <= fkA; Z++) try {
        return await K.sendRequest(P, W)
    } catch (N) {
        G = N;
        let T = N.code;
        if (typeof T === "number" && T === qvY && Z < fkA) {
            let y = KvY * Math.pow(2, Z);
            await new Promise((B) => setTimeout(B, y));
            continue
        }
        break
    }
    throw G;
}

// READABLE (for understanding):
async function sendRequestWithRetry(method, params) {
    let lastError;
    const MAX_RETRIES = 3;
    const BASE_DELAY = 500;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            return await this.client.sendRequest(method, params);
        } catch (error) {
            lastError = error;
            if (error.code === -32801 && attempt < MAX_RETRIES) { // ContentModified
                const delay = BASE_DELAY * Math.pow(2, attempt);
                await sleep(delay);
                continue;
            }
            break;
        }
    }
    throw lastError;
}

// Mapping: qvY→-32801, fkA→3, KvY→500
```

## Passive Diagnostics

Claude Code handles `textDocument/publishDiagnostics` notifications asynchronously. It uses a registry (`cQ1`) to buffer diagnostics before delivering them to the agent.

**Filtering strategy:**
- **Deduplication**: Uses a hash of the diagnostic message, severity, and range to avoid spamming the same error.
- **Volume Limiting**: Hard limit of 10 diagnostics per file and 30 total across all files. This ensures the system prompt doesn't get flooded with linter noise.

**Key insight:** The LSP integration is "lazy". Servers are only started when needed and requests are heavily throttled/deduplicated to preserve context window and performance.
