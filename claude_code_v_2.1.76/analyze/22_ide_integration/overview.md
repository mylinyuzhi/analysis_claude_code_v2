# IDE Integration Architecture (Claude Code 2.1.38)

## Overview

Claude Code integrates with IDEs (VS Code, JetBrains, Cursor, Windsurf, etc.) through a bidirectional MCP (Model Context Protocol) connection. The IDE extension/plugin starts an MCP server; Claude Code connects to it as a client. This enables: passing live editor selection context, showing diff previews, opening files at specific lines, fetching LSP diagnostics, and syncing permission modes. The transport is either SSE (Server-Sent Events) over HTTP or WebSocket, with an auth token header for WebSocket.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (IDE Integration)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP Protocol)

Key functions in this document:
- `findConnectedIdeClient` (iV) - Finds the connected IDE MCP client from the clients list
- `closeAllDiffTabs` (mx7) - Sends command to IDE to close all diff preview tabs
- `closeDiffTab` (aQA) - Sends command to close a specific diff tab by tab name
- `sendIdeConnectedNotification` (hx7) - Sends `ide_connected` notification after MCP handshake
- `useIdeSelection` (fVq) - React hook tracking current editor selection via MCP notifications
- `selectionChangedSchema` (oMz) - Zod schema for `selection_changed` notification from IDE
- `callMcpTool` (_h) - Low-level helper wrapping `lo4` to invoke IDE MCP tools
- `executeMcpTool` (lo4) - Core MCP tool invoker with timeout, progress, auth error handling
- `openDiffInIde` (aJz) - Opens diff view in IDE and waits for user response
- `IDEDiffHandler` (MPq) - React hook orchestrating diff display lifecycle
- `DiagnosticsManager` (KI) - Singleton managing IDE LSP diagnostics baseline/delta
- `installIdeExtension` (zD9) - Runs `code --install-extension anthropic.claude-code`
- `checkExtensionInstalled` (kx7) - Checks if the extension is already installed
- `waitForIdeConnection` (Ex7) - Polls for IDE presence (up to 30s) after installation
- `detectAvailableIDEs` (Ub1) - Scans IDE SSE port files for available IDE instances
- `getIdeConnectionStatus` (Rf1) - React hook returning "connected"/"disconnected"/null
- `ideSelectionIndicator` (FWq) - Status bar component showing "⧉ N lines selected"
- `syncPermissionModeToIde` (aVq) - Hook that sends `set_permission_mode` when permissionMode changes
- `useIdeStatusMonitoring` (dLq) - Hook with 4 notification effects for IDE state changes
- `handleIdeAutoInstallation` (Fx7) - Orchestrates auto-install + onboarding flow

---

## Architecture Diagram

```
IDE Extension/Plugin (in IDE process)
  |
  | Starts MCP server on localhost:<port>
  | Writes port info to ~/.claude/ide/<pid>.json (SSE port file)
  |
  v
+---------------------------------------+
| MCP Server (in IDE)                   |
|  Exposes tools:                       |
|    - openDiff                         |
|    - close_tab                        |
|    - closeAllDiffTabs                 |
|    - openFile                         |
|    - getDiagnostics                   |
|    - set_permission_mode              |
|  Sends notifications:                 |
|    - selection_changed                |
|    - notifications/message (Chrome)   |
+---------------------------------------+
          ^          |
          |          | MCP Protocol (JSON-RPC over SSE or WebSocket)
          |          |
          |          v
+---------------------------------------+
| Claude Code CLI                       |
|  MCP Client named "ide"               |
|  Transport: sse-ide or ws-ide         |
|  Auth: X-Claude-Code-Ide-Authorization|
|                                       |
|  React hooks:                         |
|    useIdeSelection (fVq)              |
|    syncPermissionModeToIde (aVq)      |
|    useIdeStatusMonitoring (dLq)       |
|                                       |
|  Tool callers:                        |
|    callMcpTool (_h)                   |
|    → openDiffInIde (aJz)             |
|    → DiagnosticsManager (KI)          |
|    → closeAllDiffTabs (mx7)           |
+---------------------------------------+
```

---

## Supported IDEs

The IDE config registry (`U01`) defines 18 supported IDEs split into two families:

### VSCode Family (`ideKind: "vscode"`)

| IDE Key | Display Name | Extension ID |
|---------|-------------|-------------|
| `cursor` | Cursor | `anthropic.claude-code` |
| `windsurf` | Windsurf | `anthropic.claude-code` |
| `vscode` | VS Code | `anthropic.claude-code` |

Auto-install is supported: Claude Code calls `code --install-extension anthropic.claude-code` (or the equivalent CLI for Cursor/Windsurf).

### JetBrains Family (`ideKind: "jetbrains"`)

intellij, pycharm, webstorm, phpstorm, rubymine, clion, goland, rider, datagrip, appcode, dataspell, aqua, gateway, fleet, androidstudio

JetBrains requires the user to install the plugin manually. Claude Code shows an onboarding dialog when it detects JetBrains is running and the plugin is connected.

---

## IDE Detection Flow

### Step 1: Terminal-Level Detection (Sync)

```javascript
// ============================================
// isVsCodeRunning / isJetBrainsRunning - Sync cached checks
// Location: chunks.80.mjs:2081-2087
// ============================================

// ORIGINAL (for source lookup):
Qb1 = KA(() => {
    return f$6(xA.terminal)
}), gb1 = KA(() => {
    return Oh(lV.terminal)
}), bX = KA(() => {
    return Qb1() || gb1() || Boolean(process.env.FORCE_CODE_TERMINAL)
})

// READABLE (for understanding):
isVsCodeRunning = memoize(() => isVsCodeIDE(terminalInfo.terminal));
isJetBrainsRunning = memoize(() => isJetBrainsIDE(terminalEnvInfo.terminal));
isIdeEnvironment = memoize(() =>
    isVsCodeRunning() || isJetBrainsRunning() || Boolean(process.env.FORCE_CODE_TERMINAL)
);

// Mapping: Qb1→isVsCodeRunning, gb1→isJetBrainsRunning, bX→isIdeEnvironment, KA→memoize
```

`lV.terminal` comes from environment variable inspection (e.g. `TERM_PROGRAM=vscode`) or JetBrains-specific detection via parent process scanning.

### Step 2: IDE Process Discovery (Async)

```javascript
// ============================================
// detectAvailableIDEs - Scans IDE SSE port files
// Location: chunks.80.mjs:1578-1636
// ============================================

// ORIGINAL (for source lookup):
async function Ub1(A) {
    let q = [];
    try {
        let K = process.env.CLAUDE_CODE_SSE_PORT,
            Y = K ? parseInt(K) : null,
            z = y8().normalize("NFC"),
            w = V$6();
        for (let H of w) {
            let $ = Sx7(H);
            if (!$) continue;
            // If running in WSL and IDE runs in Windows, validate WSL path crossing
            // If workspace folder matches current cwd → valid IDE
            let O = /* workspace match logic */ ...;
            let _ = $.ideName ?? (bX() ? S_(lV.terminal) : "IDE"),
                J = await Qx7($.runningInWindows, $.port),
                X;
            if ($.useWebSocket) X = `ws://${J}:${$.port}`;
            else X = `http://${J}:${$.port}/sse`;
            q.push({ url: X, name: _, workspaceFolders: $.workspaceFolders,
                port: $.port, isValid: O, authToken: $.authToken,
                ideRunningInWindows: $.runningInWindows })
        }
    } catch (K) { K1(K) }
    return q
}

// READABLE (for understanding):
async function detectAvailableIDEs(validateWorkspace) {
    let results = [];
    let envSsePort = process.env.CLAUDE_CODE_SSE_PORT;
    let cwd = getCwd().normalize("NFC");
    let portFiles = getIdePortFiles(); // reads ~/.claude/ide/*.json
    for (let portFile of portFiles) {
        let ideInfo = parsePortFile(portFile);
        // Validate: workspace folder must contain cwd (with WSL path conversion)
        let isValid = /* workspace containment check */;
        let url = ideInfo.useWebSocket
            ? `ws://${host}:${ideInfo.port}`
            : `http://${host}:${ideInfo.port}/sse`;
        results.push({ url, name, authToken: ideInfo.authToken, ... });
    }
    return results;
}

// Mapping: Ub1→detectAvailableIDEs, w→portFiles, V$6→getIdePortFiles, Sx7→parsePortFile
```

**Key insight:** Each IDE extension writes a JSON port file to `~/.claude/ide/<pid>.json` containing: `port`, `useWebSocket`, `authToken`, `workspaceFolders`, `runningInWindows`, `ideName`. Claude Code scans these files to find active IDE instances. The workspace folder validation ensures Claude Code only connects to the IDE whose workspace contains the current working directory.

### Step 3: Auto-Connection

```javascript
// ============================================
// handleIdeAutoInstallation - Orchestrates the full IDE setup
// Location: chunks.80.mjs:1880-1901
// ============================================

// ORIGINAL (for source lookup):
async function Fx7(A, q, K, Y) {
    Ex7().then(A);
    let z = f6().autoInstallIdeExtension ?? !0;
    if (process.env.CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL !== "true" && z) {
        let w = q ?? Q01();
        if (w) {
            if (f$6(w)) kx7(w).then(async (H) => {
                zD9(w).catch(($) => ({
                    installed: !1, error: $.message || "Installation failed",
                    installedVersion: null, ideType: w
                })).then(($) => {
                    if (Y($), $?.installed) Ex7().then(A);
                    if (!H && $?.installed === !0 && !P$6()) K()
                })
            });
            else if (Oh(w) && !P$6()) kx7(w).then(async (H) => {
                if (H) K()
            })
        }
    }
}

// READABLE (for understanding):
async function handleIdeAutoInstallation(onConnected, ideType, showOnboarding, setInstallStatus) {
    waitForIdeConnection().then(onConnected);
    let autoInstall = getSettings().autoInstallIdeExtension ?? true;
    if (process.env.CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL !== "true" && autoInstall) {
        let targetIde = ideType ?? getDefaultIdeType();
        if (isVsCodeIde(targetIde)) {
            checkExtensionInstalled(targetIde).then(async (alreadyInstalled) => {
                installIdeExtension(targetIde)
                    .catch(/* return error result */)
                    .then((result) => {
                        setInstallStatus(result);
                        if (result?.installed) waitForIdeConnection().then(onConnected);
                        // Show onboarding only on first install
                        if (!alreadyInstalled && result?.installed === true && !hasOnboardingBeenShown())
                            showOnboarding();
                    });
            });
        } else if (isJetBrainsIde(targetIde) && !hasOnboardingBeenShown()) {
            checkExtensionInstalled(targetIde).then((pluginConnected) => {
                if (pluginConnected) showOnboarding();
            });
        }
    }
}
```

**Decision logic:**
- VSCode family: Always attempt auto-install via CLI; show onboarding only on first successful install
- JetBrains: Cannot auto-install; check if plugin is already connected; show onboarding if first time

### Step 4: Extension Installation (VSCode only)

```javascript
// ============================================
// installIdeExtension - Invokes code CLI to install extension
// Location: chunks.80.mjs:1664-1682
// ============================================

// ORIGINAL (for source lookup):
async function HD9(A) {
    if (f$6(A)) {
        let q = Ix7(A);  // find code/cursor/windsurf binary
        if (q) {
            let K = await $D9(q);  // get currently installed version
            if (!K || yx7.lt(K, Lx7())) {  // if missing or outdated
                await new Promise((z) => setTimeout(z, 500));
                let Y = await d4(q, ["--force", "--install-extension", "anthropic.claude-code"], {
                    env: JXA()
                });
                if (Y.code !== 0) throw Error(`${Y.code}: ${Y.error} ${Y.stderr}`);
                K = Lx7()  // return current version
            }
            return K
        }
    }
    return null
}

// READABLE (for understanding):
async function installVscodeExtension(ideType) {
    let vscodeCli = findVsCodeBinary(ideType);
    if (vscodeCli) {
        let installedVersion = await getInstalledExtensionVersion(vscodeCli);
        if (!installedVersion || semver.lt(installedVersion, CURRENT_VERSION)) {
            await delay(500);  // brief pause for stability
            let result = await spawn(vscodeCli,
                ["--force", "--install-extension", "anthropic.claude-code"],
                { env: getLinuxEnvWithoutDisplay() });
            if (result.code !== 0) throw Error(`${result.code}: ${result.error} ${result.stderr}`);
        }
        return installedVersion;
    }
    return null;
}
```

**Key insight:** The version check `semver.lt(installed, current)` ensures the extension is always at parity with the CLI. The 500ms delay before install avoids race conditions with IDE startup.

### Step 5: Wait for Connection

```javascript
// ============================================
// waitForIdeConnection - Polls for IDE appearance with 30s timeout
// Location: chunks.80.mjs:1563-1576
// ============================================

// ORIGINAL (for source lookup):
async function Ex7() {
    if (W$6) W$6.abort();
    W$6 = Aq();
    let A = W$6.signal;
    await KD9();
    let q = Date.now();
    while (Date.now() - q < 30000 && !A.aborted) {
        let K = await Ub1(!1);
        if (A.aborted) return null;
        if (K.length === 1) return K[0];
        await new Promise((Y) => setTimeout(Y, 1000))
    }
    return null
}

// READABLE (for understanding):
async function waitForIdeConnection() {
    if (abortController) abortController.abort();
    abortController = createAbortController();
    let signal = abortController.signal;
    await waitForIdePortFilesReady();
    let startTime = Date.now();
    while (Date.now() - startTime < 30000 && !signal.aborted) {
        let ides = await detectAvailableIDEs(false); // validateWorkspace=false
        if (signal.aborted) return null;
        if (ides.length === 1) return ides[0];
        await delay(1000);
    }
    return null;
}
```

**How it works:**
1. Cancels any previous polling (one polling loop at a time)
2. Waits for IDE port files directory to be ready (`KD9`)
3. Polls every 1 second for up to 30 seconds
4. Returns the first (and only) discovered IDE — if more than one IDE is found, keeps waiting (expects exactly 1 match)

---

## MCP Transport Setup

### SSE-IDE Transport

```javascript
// ============================================
// connectMcpServer - SSE-IDE branch
// Location: chunks.145.mjs:1938-1955
// ============================================

// ORIGINAL (for source lookup):
} else if (q.type === "sse-ide") {
    SA(A, `Setting up SSE-IDE transport to ${q.url}`);
    let S = $81(),
        m = S.dispatcher ? { eventSourceInit: { fetch: async (b, g) => {
            return globalThis.fetch(b, { ...g, dispatcher: S.dispatcher })
        }}} : {};
    z = new D$6(new URL(q.url), Object.keys(m).length > 0 ? m : void 0)

// READABLE (for understanding):
} else if (serverConfig.type === "sse-ide") {
    logMcp(serverName, `Setting up SSE-IDE transport to ${serverConfig.url}`);
    let httpAgent = getHttpProxyAgent();
    let options = httpAgent.dispatcher ? {
        eventSourceInit: { fetch: async (url, init) =>
            globalThis.fetch(url, { ...init, dispatcher: httpAgent.dispatcher }) }
    } : {};
    transport = new StreamableHTTPClientTransport(new URL(serverConfig.url), options);
}

// Mapping: D$6→StreamableHTTPClientTransport, $81→getHttpProxyAgent
```

### WebSocket-IDE Transport

```javascript
// ============================================
// connectMcpServer - ws-ide branch
// Location: chunks.145.mjs:1956-1976
// ============================================

// ORIGINAL (for source lookup):
} else if (q.type === "ws-ide") {
    let S = Io6(), m = {
        "User-Agent": Xr(),
        ...q.authToken && { "X-Claude-Code-Ide-Authorization": q.authToken }
    }, b;
    if (typeof Bun < "u")
        b = new globalThis.WebSocket(q.url, { protocols: ["mcp"], headers: m,
            proxy: H81(q.url), tls: S || void 0 });
    else
        b = await Qo4(q.url, { headers: m, agent: w81(q.url), ...S || {} });
    z = new VG6(b)
}

// READABLE (for understanding):
} else if (serverConfig.type === "ws-ide") {
    let tlsOptions = getTlsOptions();
    let headers = {
        "User-Agent": getUserAgent(),
        ...(serverConfig.authToken && { "X-Claude-Code-Ide-Authorization": serverConfig.authToken })
    };
    let ws = (typeof Bun !== "undefined")
        ? new globalThis.WebSocket(serverConfig.url, { protocols: ["mcp"], headers, tls: tlsOptions })
        : await createWebSocket(serverConfig.url, { headers, agent: getHttpsAgent(serverConfig.url) });
    transport = new WebSocketClientTransport(ws);
}

// Mapping: VG6→WebSocketClientTransport, Io6→getTlsOptions, Qo4→createWebSocket
```

**Key differences:**
- SSE uses `StreamableHTTPClientTransport` (HTTP long-poll with EventSource semantics)
- WebSocket uses `VG6` (WebSocketClientTransport) which handles Bun vs Node.js differences
- Auth token `X-Claude-Code-Ide-Authorization` is only needed for WebSocket (SSE uses the same auth via port file workspace validation)

### Post-Connection: `ide_connected` Notification

```javascript
// ============================================
// sendIdeConnectedNotification - Notifies IDE that Claude Code is ready
// Location: chunks.80.mjs:1639-1646
// ============================================

// ORIGINAL (for source lookup):
async function hx7(A) {
    await A.notification({
        method: "ide_connected",
        params: { pid: process.pid }
    })
}

// READABLE (for understanding):
async function sendIdeConnectedNotification(mcpSession) {
    await mcpSession.notification({
        method: "ide_connected",
        params: { pid: process.pid }  // Claude Code CLI process ID
    });
}

// Mapping: hx7→sendIdeConnectedNotification, A→mcpSession
```

Called after successful handshake at `chunks.145.mjs:2182`. The IDE extension uses the PID to:
1. Verify Claude Code is still alive (process polling)
2. Know which Claude Code instance to attribute events to

---

## MCP Tool Invocation Layer

### Core Tool Invoker (`lo4`)

```javascript
// ============================================
// executeMcpTool - Core MCP tool caller with full lifecycle management
// Location: chunks.145.mjs:1676-1762
// ============================================

// ORIGINAL (for source lookup):
async function lo4({ client: { client: A, name: q }, tool: K, args: Y, meta: z, signal: w, onProgress: H }) {
    let $ = Date.now(), O, _;
    try {
        if (SA(q, `Calling MCP tool: ${K}`), O = setInterval(() => {
            let f = Date.now() - $, N = `${Math.floor(f/1000)}s`;
            SA(q, `Tool '${K}' still running (${N} elapsed)`)
        }, 30000), px7()) _ = setInterval(() => { Ux7() }, 50000);
        let J = Ft(), X, D = new Promise((f, Z) => {
            X = setTimeout(() => Z(new Ok(`MCP server "${q}" tool "${K}" timed out after ...`)), J)
        }),
        j = await Promise.race([A.callTool({ name: K, arguments: Y, _meta: z }, ZZ, {
            signal: w, timeout: J,
            onprogress: H ? (f) => H({ type: "mcp_progress", ... }) : void 0
        }), D]).finally(() => { if (X) clearTimeout(X) });
        // ...error check, duration log, return...
    } catch (J) {
        // AbortError → return {content: undefined}
        // 401 → throw aG6 (McpAuthError)
        // other → rethrow
    }
}

// READABLE (for understanding):
async function executeMcpTool({ client: { client, name: serverName }, tool, args, meta, signal, onProgress }) {
    let startTime = Date.now();
    // Every 30s: log "Tool still running (Xs elapsed)"
    let loggingInterval = setInterval(() => {
        let elapsed = `${Math.floor((Date.now()-startTime)/1000)}s`;
        logMcp(serverName, `Tool '${tool}' still running (${elapsed} elapsed)`);
    }, 30000);
    // Race actual call vs timeout
    let timeout = getMcpTimeout();
    let result = await Promise.race([
        client.callTool({ name: tool, arguments: args, _meta: meta }, ..., { signal, onprogress }),
        new Promise((_, reject) => setTimeout(() => reject(new McpTimeoutError(...)), timeout))
    ]);
    if (result.isError) throw new McpToolError(errorText);
    return { content: await normalizeContent(result, tool, serverName), structuredContent: result.structuredContent };
}
```

**What it does:** The central tool call gateway for all IDE tool invocations:
1. **Progress logging** - Every 30s logs "still running" to help diagnose slow IDE responses
2. **Timeout race** - Uses `Promise.race` to enforce timeout (`Ft()` returns the configured MCP timeout)
3. **Error classification** - 401 becomes `McpAuthError`; timeout becomes `McpTimeoutError`; tool errors become `McpToolError`
4. **Content normalization** - `uBY` normalizes mixed content arrays

### Thin IDE Tool Wrapper (`_h`)

```javascript
// ============================================
// callMcpTool - Thin wrapper around executeMcpTool
// Location: chunks.145.mjs:1430-1437 (approx)
// ============================================

// ORIGINAL (for source lookup):
async function _h(A, q, K) {
    return (await lo4({
        client: K, tool: A, args: q,
        signal: Aq().signal
    })).content
}

// READABLE (for understanding):
async function callMcpTool(toolName, args, ideClient) {
    return (await executeMcpTool({
        client: ideClient,
        tool: toolName,
        args: args,
        signal: getAbortController().signal
    })).content;
}

// Mapping: _h→callMcpTool, A→toolName, q→args, K→ideClient, lo4→executeMcpTool, Aq→getAbortController
```

---

## IDE Tool Operations

### `openDiff` — Diff Review Workflow

The diff review workflow is the most complex IDE integration. It suspends Claude Code execution while the user reviews the proposed change in their IDE.

```javascript
// ============================================
// openDiffInIde - Opens diff and awaits user decision
// Location: chunks.180.mjs:78-130
// ============================================

// ORIGINAL (for source lookup):
async function aJz(A, q, K, Y) {
    let z = !1, w = b1(), H = g4(A),
        $ = w.existsSync(H) ? $J(H) : "";
    async function O() {  // cleanup: close tab on abort
        if (z) return; z = !0;
        try { await aQA(Y, _) } catch (J) { K1(J) }
        process.off("beforeExit", O); K.abortController.signal.removeEventListener("abort", O)
    }
    K.abortController.signal.addEventListener("abort", O);
    process.on("beforeExit", O);
    let _ = iV(K.options.mcpClients);
    try {
        let { updatedFile: J } = tu1({ filePath: H, fileContents: $, edits: q });
        if (!_ || _.type !== "connected") throw Error("IDE client not available");
        let X = H, D = _.config.ideRunningInWindows === !0;
        if (eA() === "wsl" && D && process.env.WSL_DISTRO_NAME)
            X = new g01(process.env.WSL_DISTRO_NAME).toIDEPath(H);
        let j = await _h("openDiff", {
            old_file_path: X, new_file_path: X,
            new_file_contents: J, tab_name: Y
        }, _), M = Array.isArray(j) ? j : [j];
        if (eJz(M)) return O(), { oldContent: $, newContent: M[1].text };     // FILE_SAVED
        else if (sJz(M)) return O(), { oldContent: $, newContent: J };          // TAB_CLOSED
        else if (tJz(M)) return O(), { oldContent: $, newContent: $ };          // DIFF_REJECTED
        throw Error("Not accepted")
    } catch (J) { throw K1(J), O(), J }
}

// READABLE (for understanding):
async function openDiffInIde(filePath, edits, toolContext, tabName) {
    let closed = false;
    let fs = getFs();
    let absolutePath = resolvePath(filePath);
    let originalContent = fs.existsSync(absolutePath) ? readFileSync(absolutePath) : "";

    // Cleanup: close tab if process exits or query is aborted
    async function closeTab() {
        if (closed) return; closed = true;
        try { await closeDiffTab(tabName, ideClient); } catch {}
        process.off("beforeExit", closeTab);
        toolContext.abortController.signal.removeEventListener("abort", closeTab);
    }
    toolContext.abortController.signal.addEventListener("abort", closeTab);
    process.on("beforeExit", closeTab);

    let ideClient = findConnectedIdeClient(toolContext.options.mcpClients);
    let { updatedFile: newContent } = applyEdits({ filePath: absolutePath, fileContents: originalContent, edits });
    if (!ideClient || ideClient.type !== "connected") throw Error("IDE client not available");

    // WSL path conversion: if IDE runs in Windows, convert /mnt/c/... → C:\...
    let idePath = filePath;
    if (isWsl() && ideClient.config.ideRunningInWindows && process.env.WSL_DISTRO_NAME)
        idePath = new WslPathConverter(process.env.WSL_DISTRO_NAME).toIDEPath(absolutePath);

    // Block until user accepts/rejects in IDE
    let result = await callMcpTool("openDiff", {
        old_file_path: idePath, new_file_path: idePath,
        new_file_contents: newContent, tab_name: tabName
    }, ideClient);
    let responseArray = Array.isArray(result) ? result : [result];

    if (isFileSaved(responseArray))     // FILE_SAVED: user saved modified content
        return closeTab(), { oldContent: originalContent, newContent: responseArray[1].text };
    else if (isTabClosed(responseArray))  // TAB_CLOSED: user closed without editing (accept as-is)
        return closeTab(), { oldContent: originalContent, newContent };
    else if (isDiffRejected(responseArray))  // DIFF_REJECTED: user rejected change
        return closeTab(), { oldContent: originalContent, newContent: originalContent };
    throw Error("Not accepted");
}
```

**Response Protocol — Three Return Codes:**

| Code | Meaning | `newContent` returned |
|------|---------|----------------------|
| `FILE_SAVED` + file text | User saved (possibly edited) | `responseArray[1].text` (saved content) |
| `TAB_CLOSED` | User closed tab → accept proposed change | `newContent` (proposed) |
| `DIFF_REJECTED` | User explicitly rejected | `originalContent` (no change) |

**Key insight:** `openDiff` is a **blocking call** — Claude Code waits until the user takes action in the IDE. The abort cleanup handler ensures the IDE tab is closed even if the user runs `/escape` or Claude Code crashes.

**WSL special handling:** When the IDE runs in Windows but Claude Code runs in WSL, paths are converted from Linux format (`/mnt/c/Users/...`) to Windows format (`C:\Users\...`) so the VS Code extension can open the correct file.

### `openFile` — File Navigation

```javascript
// ============================================
// ensureFileOpened - Opens file in IDE for diagnostics workflow
// Location: chunks.146.mjs:33-47
// ============================================

// ORIGINAL (for source lookup):
async ensureFileOpened(A) {
    if (!this.initialized || !this.mcpClient || this.mcpClient.type !== "connected") return;
    try {
        await _h("openFile", {
            filePath: A, preview: !1,
            startText: "", endText: "",
            selectToEndOfLine: !1, makeFrontmost: !1
        }, this.mcpClient)
    } catch (q) { K1(q) }
}

// READABLE (for understanding):
async ensureFileOpened(filePath) {
    if (!this.initialized || !this.mcpClient?.connected) return;
    await callMcpTool("openFile", {
        filePath,
        preview: false,       // Open in full editor, not preview pane
        startText: "",        // No selection range
        endText: "",
        selectToEndOfLine: false,
        makeFrontmost: false  // Don't steal focus
    }, this.mcpClient);
}
```

Called by `DiagnosticsManager.beforeFileEdited()` to ensure a file is open in the IDE before fetching diagnostics. The `makeFrontmost: false` is critical — it doesn't steal window focus from the user.

### `getDiagnostics` — LSP Diagnostics Bridge

```javascript
// ============================================
// DiagnosticsManager - Manages LSP diagnostic baseline and deltas
// Location: chunks.146.mjs:3-100
// ============================================

// ORIGINAL (for source lookup):
class KI {
    static instance;
    baseline = new Map;      // filePath → DiagnosticItem[]
    initialized = !1;
    mcpClient;
    lastProcessedTimestamps = new Map;
    rightFileDiagnosticsState = new Map; // for _claude_fs_right: tracking
    static getInstance() { if (!KI.instance) KI.instance = new KI; return KI.instance }
    normalizeFileUri(A) {
        let q = ["file://", "_claude_fs_right:", "_claude_fs_left:"], K = A;
        for (let Y of q) if (A.startsWith(Y)) { K = A.slice(Y.length); break }
        return eG6(K) // normalize path
    }
    async beforeFileEdited(A) { /* record baseline diagnostics */ }
    async getNewDiagnostics() {
        let A = [];
        let z = await _h("getDiagnostics", {}, this.mcpClient);
        A = this.parseDiagnosticResult(z);
        // Compare against baseline, collect new diagnostics
        let Y = [];
        for (let z of A.filter(inBaseline).filter(fileUri)) {
            let _ = z.diagnostics.filter((J) => !baseline.some(equals(J)));
            if (_.length > 0) Y.push({ uri: z.uri, diagnostics: _ });
            baseline.set(w, latest.diagnostics); // rolling update
        }
        return Y
    }
}

// READABLE (for understanding):
class DiagnosticsManager {
    static instance; // Singleton
    baseline = new Map(); // filePath → diagnostic list at time of edit

    async beforeFileEdited(filePath) {
        // Snapshot current diagnostics for this file
        let rawResult = await callMcpTool("getDiagnostics", { uri: `file://${filePath}` }, this.mcpClient);
        let parsed = this.parseDiagnosticResult(rawResult)[0];
        let normalizedPath = this.normalizeFileUri(filePath);
        this.baseline.set(normalizedPath, parsed?.diagnostics ?? []);
    }

    async getNewDiagnostics() {
        // Fetch all diagnostics after edit, compare against baselines
        let allDiagnostics = await callMcpTool("getDiagnostics", {}, this.mcpClient);
        let newDiagnostics = [];
        for (let fileResult of allDiagnostics) {
            // _claude_fs_right: means the "new" file in diff view
            let deltaItems = fileResult.diagnostics.filter(d => !this.baseline.has(d));
            if (deltaItems.length > 0) newDiagnostics.push({ uri: fileResult.uri, diagnostics: deltaItems });
        }
        return newDiagnostics;
    }
}
```

**URI Scheme Handling:**
- `file://...` — normal file URI (standard LSP format)
- `_claude_fs_right:...` — the "right" (new) side of a diff view in IDE
- `_claude_fs_left:...` — the "left" (old) side of a diff view in IDE

This allows Claude Code to get diagnostics even when the file is being shown in a diff tab rather than a normal editor.

### `set_permission_mode` — Permission Sync

```javascript
// ============================================
// syncPermissionModeToIde - Keeps IDE extension in sync with permission mode
// Location: chunks.186.mjs:1736-1752
// ============================================

// ORIGINAL (for source lookup):
function aVq(A, q) {
    let K = e(6);
    rc1.useRef(void 0);
    let z, w;
    if (K[2] !== A || K[3] !== q) z = () => {
        let H = A.find(jPz);
        if (!H) return;
        _h("set_permission_mode", {
            mode: q === "bypassPermissions" ? "skip_all_permission_checks" : "ask"
        }, H)
    }, w = [A, q], K[2] = A, K[3] = q, K[4] = z, K[5] = w;
    else z = K[4], w = K[5];
    rc1.useEffect(z, w)
}
function jPz(A) { return A.type === "connected" && A.name === qy }  // qy = "claude-in-chrome"

// READABLE (for understanding):
function syncPermissionModeToIde(mcpClients, permissionMode) {
    useEffect(() => {
        let chromeClient = mcpClients.find(isChromeMcpServer);
        if (!chromeClient) return;
        callMcpTool("set_permission_mode", {
            mode: permissionMode === "bypassPermissions"
                ? "skip_all_permission_checks"
                : "ask"
        }, chromeClient);
    }, [mcpClients, permissionMode]);
}

// Mapping: aVq→syncPermissionModeToIde, jPz→isChromeMcpServer, qy→CHROME_MCP_SERVER_NAME
```

**Note:** This is actually for the **Chrome MCP server** (`claude-in-chrome`), not the IDE MCP server. It syncs Claude Code's permission mode to the browser extension so it knows whether to show permission prompts.

---

## Selection Context Tracking

### Selection Changed Notification

```javascript
// ============================================
// useIdeSelection - React hook for IDE selection tracking
// Location: chunks.186.mjs:410-453
// ============================================

// ORIGINAL (for source lookup):
function fVq(A, q) {
    let K = ic1.useRef(!1), Y = ic1.useRef(null);
    ic1.useEffect(() => {
        let z = iV(A);
        if (Y.current !== z) K.current = !1, Y.current = z || null,
            q({ lineCount: 0, lineStart: void 0, text: void 0, filePath: void 0 });
        if (K.current || !z) return;
        let w = (H) => {
            if (H.selection?.start && H.selection?.end) {
                let { start: $, end: O } = H.selection, _ = O.line - $.line + 1;
                if (O.character === 0) _--;  // cursor at start of line → don't count that line
                let J = { lineCount: _, lineStart: $.line, text: H.text, filePath: H.filePath };
                q(J)
            }
        };
        z.client.setNotificationHandler(oMz, (H) => {
            if (Y.current !== z) return;  // stale handler guard
            try {
                let $ = H.params;
                if ($.selection?.start && $.selection?.end) w($);
                else if ($.text !== void 0) w({ selection: null, text: $.text, filePath: $.filePath })
            } catch ($) { K1($) }
        }), K.current = !0
    }, [A, q])
}

// READABLE (for understanding):
function useIdeSelection(mcpClients, onSelectionChange) {
    let handlerRegistered = useRef(false);
    let currentIdeRef = useRef(null);
    useEffect(() => {
        let ideClient = findConnectedIdeClient(mcpClients);
        // If IDE changed (reconnect/disconnect), reset and clear selection
        if (currentIdeRef.current !== ideClient) {
            handlerRegistered.current = false;
            currentIdeRef.current = ideClient || null;
            onSelectionChange({ lineCount: 0, lineStart: undefined, text: undefined, filePath: undefined });
        }
        if (handlerRegistered.current || !ideClient) return;
        let processSelection = (data) => {
            if (data.selection?.start && data.selection?.end) {
                let { start, end } = data.selection;
                let lineCount = end.line - start.line + 1;
                if (end.character === 0) lineCount--; // cursor at column 0 = exclusive
                onSelectionChange({ lineCount, lineStart: start.line, text: data.text, filePath: data.filePath });
            }
        };
        ideClient.client.setNotificationHandler(selectionChangedSchema, (notification) => {
            if (currentIdeRef.current !== ideClient) return; // ignore stale handler
            let params = notification.params;
            if (params.selection?.start && params.selection?.end) processSelection(params);
            else if (params.text !== undefined)  // selection cleared, but file context still available
                processSelection({ selection: null, text: params.text, filePath: params.filePath });
        });
        handlerRegistered.current = true;
    }, [mcpClients, onSelectionChange]);
}
```

**Line count edge case:** When the cursor is at character 0 of the last line (`end.character === 0`), that line is not included in the selection. This matches how VS Code defines selections (end is exclusive).

### Selection Schema

```javascript
// ============================================
// selectionChangedSchema - Zod schema for IDE selection notifications
// Location: chunks.186.mjs:463-479
// ============================================

// ORIGINAL (for source lookup):
oMz = u.object({
    method: u.literal("selection_changed"),
    params: u.object({
        selection: u.object({
            start: u.object({ line: u.number(), character: u.number() }),
            end:   u.object({ line: u.number(), character: u.number() })
        }).nullable().optional(),
        text: u.string().optional(),
        filePath: u.string().optional()
    })
})

// READABLE (for understanding):
selectionChangedSchema = z.object({
    method: z.literal("selection_changed"),
    params: z.object({
        selection: z.object({
            start: z.object({ line: z.number(), character: z.number() }),
            end:   z.object({ line: z.number(), character: z.number() })
        }).nullable().optional(),   // null → selection was cleared
        text: z.string().optional(),        // selected text (or full file if no selection)
        filePath: z.string().optional()     // absolute file path in IDE
    })
});
```

Two cases:
1. **Active selection:** `selection` is non-null with `start`/`end`, `text` contains selected text
2. **Cursor position / file context:** `selection` is null, `text` may still be the active file's content, `filePath` still set

---

## UI Linkage

### IDE Selection Status Bar Indicator

```javascript
// ============================================
// ideSelectionIndicator - Status bar "⧉ N lines selected" display
// Location: chunks.182.mjs:1514-1545
// ============================================

// ORIGINAL (for source lookup):
function FWq(A) {
    let q = e(7), { ideSelection: K, mcpClients: Y } = A,
        z = Rf1(Y),
        w = z === "connected" && (K?.filePath || K?.text && K.lineCount > 0);
    if (z === null || !w || !K) return null;
    if (K.text && K.lineCount > 0) {
        let H = K.lineCount === 1 ? "line" : "lines", $;
        if (q[0] !== K.lineCount || q[1] !== H)
            $ = xc1.createElement(V, { color: "ide", key: "selection-indicator" },
                "⧉ ", K.lineCount, " ", H, " selected"),
            q[0] = K.lineCount, q[1] = H, q[2] = $;
        else $ = q[2];
        return $
    }
    if (K.filePath) {
        let H; if (q[3] !== K.filePath) H = bDz(K.filePath), q[3] = K.filePath, q[4] = H;
        else H = q[4];
        let $; if (q[5] !== H)
            $ = xc1.createElement(V, { color: "ide", key: "selection-indicator" },
                "⧉ In ", H),
            q[5] = H, q[6] = $;
        else $ = q[6];
        return $
    }
}

// READABLE (for understanding):
function IdeSelectionIndicator({ ideSelection, mcpClients }) {
    let connectionStatus = getIdeConnectionStatus(mcpClients); // "connected"/"disconnected"/null
    let hasActiveContent = connectionStatus === "connected" &&
        (ideSelection?.filePath || (ideSelection?.text && ideSelection.lineCount > 0));
    if (connectionStatus === null || !hasActiveContent || !ideSelection) return null;

    if (ideSelection.text && ideSelection.lineCount > 0) {
        let unit = ideSelection.lineCount === 1 ? "line" : "lines";
        return <Text color="ide">⧉ {ideSelection.lineCount} {unit} selected</Text>;
    }
    if (ideSelection.filePath) {
        let filename = getFilename(ideSelection.filePath); // basename
        return <Text color="ide">⧉ In {filename}</Text>;
    }
}

// Mapping: FWq→IdeSelectionIndicator, Rf1→getIdeConnectionStatus, bDz→getFilename
```

**Display rules:**
- `⧉ 3 lines selected` — when text is selected in IDE
- `⧉ In filename.ts` — when cursor is in a file but no selection
- Nothing — when IDE is disconnected or no active context

### `getIdeConnectionStatus` React Hook

```javascript
// ============================================
// getIdeConnectionStatus - Memoized hook returning IDE connection state
// Location: chunks.182.mjs:1500-1506
// ============================================

// ORIGINAL (for source lookup):
function Rf1(A) {
    return mWq.useMemo(() => {
        let q = A?.find((K) => K.name === "ide");
        if (!q) return null;
        return q.type === "connected" ? "connected" : "disconnected"
    }, [A])
}

// READABLE (for understanding):
function getIdeConnectionStatus(mcpClients) {
    return useMemo(() => {
        let ideClient = mcpClients?.find((c) => c.name === "ide");
        if (!ideClient) return null;           // IDE never configured
        return ideClient.type === "connected" ? "connected" : "disconnected";
    }, [mcpClients]);
}
```

**Three states:**
- `null` — no IDE MCP server configured at all
- `"connected"` — IDE MCP server is active
- `"disconnected"` — IDE MCP server was configured but is not currently connected (error, timeout, etc.)

### IDE Status Monitoring Notifications

```javascript
// ============================================
// useIdeStatusMonitoring - 4 status notification effects
// Location: chunks.187.mjs:2265-2337
// ============================================
```

Four notification effects with different priorities:

| Condition | Notification Key | Text | Priority |
|-----------|-----------------|------|----------|
| IDE available but not connected | `ide-status-hint` | `⊙ /ide for VS Code` | low |
| IDE was connected, now disconnected | `ide-status-disconnected` | `⊙ IDE disconnected` | medium (error color) |
| JetBrains plugin not connected | `ide-status-jetbrains-disconnected` | `IDE plugin not connected · /status for info` | medium |
| VSCode extension install failed | `ide-status-install-error` | `IDE extension install failed (see /status for info)` | medium (error color) |

---

## Onboarding Dialog

### Trigger Conditions

- VSCode family: Shown after first successful auto-install (when `!alreadyInstalled && result.installed === true && !hasOnboardingBeenShown()`)
- JetBrains: Shown when plugin is detected connected and onboarding hasn't been shown

Tracked per-IDE in settings: `hasIdeOnboardingBeenShown[terminalName] = true`

### Dialog Content

The dialog (`Nx7` at `chunks.188.mjs:1268`) shows:
- Welcome message: "Claude Code is now connected to [IDE Name]"
- "extension" vs "plugin" based on VSCode vs JetBrains detection (`Oh(ideType)`)
- Feature highlights: open files, selected lines context, diff review
- Keyboard shortcut: `Cmd+Option+K` (macOS) or `Ctrl+Alt+K` (Windows/Linux)
- Installed extension version (if available)

### Persistence

```javascript
// ============================================
// markIdeOnboardingAsShown - Persists shown state to settings
// Location: chunks.80.mjs:1298-1308
// ============================================

// ORIGINAL (for source lookup):
function aX9() {
    if (P$6()) return;
    let A = lV.terminal || "unknown";
    jA((q) => ({
        ...q,
        hasIdeOnboardingBeenShown: {
            ...q.hasIdeOnboardingBeenShown,
            [A]: !0
        }
    }))
}

// READABLE (for understanding):
function markIdeOnboardingAsShown() {
    if (hasIdeOnboardingBeenShown()) return;
    let terminalName = terminalEnvInfo.terminal || "unknown";
    updateSettings((settings) => ({
        ...settings,
        hasIdeOnboardingBeenShown: {
            ...settings.hasIdeOnboardingBeenShown,
            [terminalName]: true  // keyed by IDE name (e.g. "vscode", "cursor", "intellij")
        }
    }));
}
```

Stored in `~/.claude/settings.json` under `hasIdeOnboardingBeenShown` as a dictionary keyed by IDE type name.

---

## Diff Display Architecture (IDE vs Terminal)

The `MPq` (IDEDiffHandler) hook chooses between IDE diff and terminal diff:

```javascript
// ============================================
// IDEDiffHandler - Orchestrates diff display (IDE vs terminal)
// Location: chunks.180.mjs:3-63
// ============================================

// ORIGINAL (for source lookup):
function MPq({ onChange: A, toolUseContext: q, filePath: K, edits: Y, editMode: z }) {
    let w = Qc.useRef(!1), [H, $] = Qc.useState(!1),
        O = Qc.useMemo(() => nJz().slice(0, 6), []),  // random 6-char ID
        _ = Qc.useMemo(() => `✻ [Claude Code] ${rJz(K)} (${O}) ⧉`, [K, O]),  // tab name
        J = N$6(q.options.mcpClients) && f6().diffTool === "auto" && !K.endsWith(".ipynb"),
        X = T$6(q.options.mcpClients) ?? "IDE";  // IDE display name

    async function D() {
        if (!J) return;
        let { oldContent: j, newContent: M } = await aJz(K, Y, q, _);
        // ... handle result, apply or reject edits
    }
    return Qc.useEffect(() => { return D(), () => { w.current = !0 } }, []), {
        closeTabInIDE() { let j = iV(q.options.mcpClients); if (!j) return Promise.resolve(); return aQA(_, j) },
        showingDiffInIDE: J && !H,
        ideName: X,
        hasError: H
    }
}

// READABLE (for understanding):
function IDEDiffHandler({ onChange, toolUseContext, filePath, edits, editMode }) {
    let cleanedUp = useRef(false);
    let [hasError, setHasError] = useState(false);
    let tabId = useMemo(() => generateId().slice(0, 6), []);
    let tabName = useMemo(() => `✻ [Claude Code] ${getFilename(filePath)} (${tabId}) ⧉`, [filePath, tabId]);
    // IDE diff enabled when: IDE connected + diffTool="auto" + not notebook file
    let useIdeDiff = hasConnectedIde(toolUseContext.options.mcpClients)
        && getSettings().diffTool === "auto"
        && !filePath.endsWith(".ipynb");
    let ideName = getIdeName(toolUseContext.options.mcpClients) ?? "IDE";
    // ...
    return {
        closeTabInIDE: () => closeDiffTab(tabName, findConnectedIdeClient(mcpClients)),
        showingDiffInIDE: useIdeDiff && !hasError,
        ideName,
        hasError
    };
}
```

**IDE diff enablement conditions:**
1. `hasConnectedIde(mcpClients)` — at least one "ide" MCP client in "connected" state
2. `settings.diffTool === "auto"` — user hasn't set diffTool to "terminal" or "none"
3. `!filePath.endsWith(".ipynb")` — Jupyter notebooks always use terminal diff (IDE can't render notebook diffs)

**Tab naming format:** `✻ [Claude Code] filename (XXXXXX) ⧉` — the `✻` and `⧉` are Unicode characters that make the tab visually distinct; the 6-char random ID prevents tab name collisions when editing the same file multiple times.

---

## macOS Parent Process Scanning for IDE Detection

```javascript
// ============================================
// detectIdeFromParentProcess - macOS only, walks process tree
// Location: chunks.80.mjs:1718-1742
// ============================================

// ORIGINAL (for source lookup):
function OD9() {
    try {
        if (eA() !== "macos") return null;
        let q = process.ppid;
        for (let K = 0; K < 10; K++) {
            if (!q || q === 0 || q === 1) break;
            let Y = Qf(`ps -o command= -p ${q}`)?.trim();
            if (Y) {
                let w = {
                    "Visual Studio Code.app": "code",
                    "Cursor.app": "cursor",
                    "Windsurf.app": "windsurf",
                    "Visual Studio Code - Insiders.app": "code",
                    "VSCodium.app": "codium"
                }, H = "/Contents/MacOS/Electron";
                for (let [$, O] of Object.entries(w)) {
                    let _ = Y.indexOf($ + "/Contents/MacOS/Electron");
                    if (_ !== -1) {
                        let J = _ + $.length;
                        return Y.substring(0, J) + "/Contents/Resources/app/bin/" + O
                    }
                }
            }
            let z = Qf(`ps -o ppid= -p ${q}`)?.trim();
            if (!z) break;
            q = parseInt(z, 10)
        }
    } catch {}
    return null
}

// READABLE (for understanding):
function findVsCodeBinaryFromParentProcess() {
    if (getPlatform() !== "macos") return null;
    let pid = process.ppid;
    for (let depth = 0; depth < 10; depth++) {  // walk up 10 levels max
        if (!pid || pid <= 1) break;
        let command = execSync(`ps -o command= -p ${pid}`)?.trim();
        if (command) {
            let ideApps = {
                "Visual Studio Code.app": "code",
                "Cursor.app": "cursor",
                "Windsurf.app": "windsurf",
                ...
            };
            for (let [appName, binName] of Object.entries(ideApps)) {
                let idx = command.indexOf(appName + "/Contents/MacOS/Electron");
                if (idx !== -1) {
                    // Reconstruct the path to the CLI binary
                    return command.substring(0, idx + appName.length)
                        + "/Contents/Resources/app/bin/" + binName;
                }
            }
        }
        pid = parseInt(execSync(`ps -o ppid= -p ${pid}`)?.trim(), 10);
    }
    return null;
}
```

**Why:** On macOS, when the user opens a terminal inside VS Code, the terminal process is a descendant of the VS Code process. Walking up the process tree with `ps` lets Claude Code find the VS Code binary path without relying on `PATH` or environment variables. This returns the exact IDE CLI binary path (e.g. `/Applications/Cursor.app/Contents/Resources/app/bin/cursor`).

---

## Telemetry Events

| Event | Location | When |
|-------|----------|------|
| `tengu_mcp_ide_server_connection_succeeded` | chunks.145.mjs:2176 | After successful MCP handshake |
| `tengu_mcp_ide_server_connection_failed` | chunks.145.mjs:2162 | After MCP connection failure |
| `tengu_ext_will_show_diff` | chunks.180.mjs:19 | Before calling `openDiff` |
| `tengu_ext_diff_accepted` | chunks.180.mjs:25 | Diff accepted (FILE_SAVED or TAB_CLOSED) |
| `tengu_ext_diff_rejected` | chunks.180.mjs:28 | Diff rejected (no changes after apply) |
| `tengu_ext_installed` | chunks.80.mjs:1541 | Extension installed successfully |
| `tengu_ext_install_error` | chunks.80.mjs:1552 | Extension install failed |

---

## Environment Variable Controls

| Variable | Effect |
|----------|--------|
| `CLAUDE_CODE_SSE_PORT` | Override: use specific IDE port (bypasses workspace validation) |
| `CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL` | `"true"` disables auto-install of extension |
| `CLAUDE_CODE_IDE_SKIP_VALID_CHECK` | `"true"` skips workspace folder validation |
| `CLAUDE_CODE_AUTO_CONNECT_IDE` | Controls auto-connect behavior (truthy/falsy) |
| `FORCE_CODE_TERMINAL` | Forces IDE environment detection even without `TERM_PROGRAM` |
| `WSL_DISTRO_NAME` | Enables WSL path conversion for Windows IDE |
| `DISPLAY` | Cleared on Linux to prevent VS Code GUI popups during headless install |
