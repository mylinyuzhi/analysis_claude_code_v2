# IDE Integration

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

## Overview

Claude Code supports deep integration with IDEs through multiple mechanisms:
1. **Process-based IDE detection** - Detects running IDEs by analyzing system processes
2. **Terminal keybinding setup** - Configures Shift+Enter for multi-line input
3. **Extension auto-installation** - Installs the `anthropic.claude-code` VS Code extension
4. **IDE diff support** - Opens diff tabs directly in the IDE via MCP
5. **Context attachments** - Injects IDE selection and opened file context into prompts

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          IDE Integration Layer                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                   IDE Detection (iEA Config Map)                        │ │
│  │  Cursor, Windsurf, VSCode, IntelliJ, PyCharm, WebStorm, ...            │ │
│  │  Platform-specific process detection (macOS/Windows/Linux)              │ │
│  └────────────────────────────────────┬───────────────────────────────────┘ │
│                                       │                                      │
│              ┌────────────────────────┼────────────────────────┐            │
│              ▼                        ▼                        ▼            │
│  ┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐   │
│  │  VSCode-based     │    │   JetBrains       │    │   Terminal        │   │
│  │  (Cursor, Wind-   │    │   (IntelliJ,      │    │   (Alacritty,     │   │
│  │   surf, VSCode)   │    │    PyCharm, etc.) │    │    Warp, Zed)     │   │
│  └─────────┬─────────┘    └─────────┬─────────┘    └─────────┬─────────┘   │
│            │                        │                        │              │
│            ▼                        ▼                        ▼              │
│  ┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐   │
│  │ Extension Install │    │ Plugin Detection  │    │ Keybinding Setup  │   │
│  │ anthropic.claude- │    │ Process-based     │    │ Shift+Enter for   │   │
│  │ code extension    │    │ detection only    │    │ multi-line input  │   │
│  └───────────────────┘    └───────────────────┘    └───────────────────┘   │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                      MCP Transport Layer                                │ │
│  │  ┌─────────────────────┐          ┌─────────────────────┐              │ │
│  │  │   SSE-IDE Transport │          │  WS-IDE Transport   │              │ │
│  │  │   http://host/sse   │          │   ws://host:port    │              │ │
│  │  └─────────────────────┘          └─────────────────────┘              │ │
│  │                                                                         │ │
│  │  MCP Commands: openDiff, close_tab, closeAllDiffTabs                   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Supported IDEs

### IDE Configuration Map (iEA)

The system maintains a comprehensive configuration map for 18+ supported IDEs:

| IDE | IDE Kind | Display Name | Extension |
|-----|----------|--------------|-----------|
| Cursor | vscode | Cursor | anthropic.claude-code |
| Windsurf | vscode | Windsurf | anthropic.claude-code |
| VS Code | vscode | VS Code | anthropic.claude-code |
| IntelliJ IDEA | jetbrains | IntelliJ IDEA | claude-code-jetbrains-plugin |
| PyCharm | jetbrains | PyCharm | claude-code-jetbrains-plugin |
| WebStorm | jetbrains | WebStorm | claude-code-jetbrains-plugin |
| PhpStorm | jetbrains | PhpStorm | claude-code-jetbrains-plugin |
| RubyMine | jetbrains | RubyMine | claude-code-jetbrains-plugin |
| CLion | jetbrains | CLion | claude-code-jetbrains-plugin |
| GoLand | jetbrains | GoLand | claude-code-jetbrains-plugin |
| Rider | jetbrains | Rider | claude-code-jetbrains-plugin |
| DataGrip | jetbrains | DataGrip | claude-code-jetbrains-plugin |
| AppCode | jetbrains | AppCode | claude-code-jetbrains-plugin |
| DataSpell | jetbrains | DataSpell | claude-code-jetbrains-plugin |
| Aqua | jetbrains | Aqua | claude-code-jetbrains-plugin |
| Gateway | jetbrains | Gateway | claude-code-jetbrains-plugin |
| Fleet | jetbrains | Fleet | claude-code-jetbrains-plugin |
| Android Studio | jetbrains | Android Studio | claude-code-jetbrains-plugin |

### IDE Type Check Functions

```javascript
// ============================================
// isVSCodeIDE - Check if IDE is VSCode-based
// Location: chunks.131.mjs (referenced as kF1)
// ============================================

// READABLE (for understanding):
function isVSCodeIDE(ideName) {
  if (!ideName) return false;
  let ideConfig = IDE_CONFIG_MAP[ideName];
  return ideConfig && ideConfig.ideKind === "vscode";
}

// Matches: cursor, windsurf, vscode
```

```javascript
// ============================================
// isJetBrainsIDE - Check if IDE is JetBrains-based
// Location: chunks.131.mjs (referenced as Rx)
// ============================================

// READABLE (for understanding):
function isJetBrainsIDE(ideName) {
  if (!ideName) return false;
  let ideConfig = IDE_CONFIG_MAP[ideName];
  return ideConfig && ideConfig.ideKind === "jetbrains";
}

// Matches: intellij, pycharm, webstorm, phpstorm, rubymine, clion, goland, rider, datagrip, appcode, dataspell, aqua, gateway, fleet, androidstudio
```

---

## 2. IDE Detection

### Process Detection Strategy

Claude Code uses platform-specific process detection to identify running IDEs:

```javascript
// ============================================
// detectRunningIDEs - Detect running IDEs by analyzing system processes
// Location: chunks.131.mjs:2733-2779
// ============================================

// ORIGINAL (for source lookup):
async function z27() {
  let A = [];
  try {
    let Q = $Q();
    if (Q === "macos") {
      let G = (await e5('ps aux | grep -E "Visual Studio Code|Code Helper|Cursor Helper|Windsurf Helper|IntelliJ IDEA|PyCharm|WebStorm|PhpStorm|RubyMine|CLion|GoLand|Rider|DataGrip|AppCode|DataSpell|Aqua|Gateway|Fleet|Android Studio" | grep -v grep', {
        shell: !0,
        reject: !1
      })).stdout ?? "";
      for (let [Z, Y] of Object.entries(iEA))
        for (let J of Y.processKeywordsMac)
          if (G.includes(J)) {
            A.push(Z);
            break
          }
    } else if (Q === "windows") {
      // Windows uses tasklist with findstr
    } else if (Q === "linux") {
      // Linux uses ps aux with grep
    }
  } catch (Q) {
    e(Q)
  }
  return A
}

// READABLE (for understanding):
async function detectRunningIDEs() {
  let detectedIDEs = [];
  try {
    let platform = getOS();
    if (platform === "macos") {
      // Search running processes for IDE keywords
      let processOutput = (await execAsync('ps aux | grep -E "Visual Studio Code|Code Helper|Cursor Helper|..." | grep -v grep', {
        shell: true,
        reject: false
      })).stdout ?? "";

      // Match process output against IDE config keywords
      for (let [ideKey, ideConfig] of Object.entries(IDE_CONFIG_MAP)) {
        for (let keyword of ideConfig.processKeywordsMac) {
          if (processOutput.includes(keyword)) {
            detectedIDEs.push(ideKey);
            break;  // Only add each IDE once
          }
        }
      }
    } else if (platform === "windows") {
      // Uses tasklist | findstr "Code.exe Cursor.exe Windsurf.exe idea64.exe ..."
      let processOutput = (await execAsync('tasklist | findstr /I "Code.exe Cursor.exe ..."', {...})).stdout;
      // Match against processKeywordsWindows
    } else if (platform === "linux") {
      // Uses ps aux | grep -E "code|cursor|windsurf|idea|pycharm|..."
      let processOutput = (await execAsync('ps aux | grep -E "code|cursor|..." | grep -v grep', {...})).stdout;
      // Match against processKeywordsLinux with special handling for vscode vs cursor
    }
  } catch (error) {
    logError(error);
  }
  return detectedIDEs;
}

// Mapping: z27→detectRunningIDEs, $Q→getOS, e5→execAsync, iEA→IDE_CONFIG_MAP
```

### Platform-Specific Detection Keywords

Each IDE has platform-specific process keywords for detection:

| IDE | macOS Keywords | Windows Keywords | Linux Keywords |
|-----|----------------|------------------|----------------|
| Cursor | "Cursor Helper", "Cursor.app" | "cursor.exe" | "cursor" |
| Windsurf | "Windsurf Helper", "Windsurf.app" | "windsurf.exe" | "windsurf" |
| VS Code | "Visual Studio Code", "Code Helper" | "code.exe" | "code" |
| IntelliJ IDEA | "IntelliJ IDEA" | "idea64.exe" | "idea", "intellij" |
| PyCharm | "PyCharm" | "pycharm64.exe" | "pycharm" |
| Android Studio | "Android Studio" | "studio64.exe" | "android-studio" |

**Key insight:** On Linux, there's special handling to distinguish VS Code from Cursor (both contain "code"):
```javascript
if (ideKey !== "vscode") {
  detectedIDEs.push(ideKey);
} else if (!processOutput.includes("cursor") && !processOutput.includes("appcode")) {
  detectedIDEs.push(ideKey);  // Only add vscode if cursor/appcode not detected
}
```

### Lock File Discovery

IDEs write lock files to `~/.claude/ide/` directory containing connection information. Claude Code discovers and parses these lock files:

```javascript
// ============================================
// getIDELockFiles - Discover IDE lock files
// Location: chunks.131.mjs:2351-2369
// ============================================

// ORIGINAL (for source lookup):
function bF1() {
  try {
    return I27().flatMap((B) => {
      try {
        return vA().readdirSync(B).filter((G) => G.name.endsWith(".lock")).map((G) => {
          let Z = qL0(B, G.name);
          return { path: Z, mtime: vA().statSync(Z).mtime }
        })
      } catch (G) { return e(G), [] }
    }).sort((B, G) => G.mtime.getTime() - B.mtime.getTime()).map((B) => B.path)
  } catch (A) { return e(A), [] }
}

// READABLE (for understanding):
function getIDELockFiles() {
  try {
    return getIDEDirectories().flatMap((ideDir) => {
      try {
        return fs.readdirSync(ideDir)
          .filter((entry) => entry.name.endsWith(".lock"))
          .map((entry) => {
            let fullPath = pathJoin(ideDir, entry.name);
            return { path: fullPath, mtime: fs.statSync(fullPath).mtime };
          });
      } catch (error) { logError(error); return []; }
    })
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())  // Most recent first
    .map((entry) => entry.path);
  } catch (error) { logError(error); return []; }
}

// Mapping: bF1→getIDELockFiles, I27→getIDEDirectories, vA→fs, qL0→pathJoin
```

### Lock File Parser

```javascript
// ============================================
// parseLockFile - Parse IDE lock file content
// Location: chunks.131.mjs:2371-2403
// ============================================

// ORIGINAL (for source lookup):
function Sr2(A) {
  try {
    let Q = vA().readFileSync(A, { encoding: "utf-8" }),
      B = [], G, Z, Y = !1, J = !1, X;
    try {
      let W = AQ(Q);
      if (W.workspaceFolders) B = W.workspaceFolders;
      G = W.pid, Z = W.ideName, Y = W.transport === "ws",
      J = W.runningInWindows === !0, X = W.authToken
    } catch (W) {
      B = Q.split(`\n`).map((K) => K.trim())
    }
    let I = A.split(yF1).pop();
    if (!I) return null;
    let D = I.replace(".lock", "");
    return {
      workspaceFolders: B, port: parseInt(D), pid: G,
      ideName: Z, useWebSocket: Y, runningInWindows: J, authToken: X
    }
  } catch (Q) { return e(Q), null }
}

// READABLE (for understanding):
function parseLockFile(lockFilePath) {
  try {
    let content = fs.readFileSync(lockFilePath, { encoding: "utf-8" });
    let workspaceFolders = [];
    let pid, ideName;
    let useWebSocket = false, runningInWindows = false;
    let authToken;

    try {
      // Try parsing as JSON (modern format)
      let parsed = JSON.parse(content);
      if (parsed.workspaceFolders) workspaceFolders = parsed.workspaceFolders;
      pid = parsed.pid;
      ideName = parsed.ideName;
      useWebSocket = parsed.transport === "ws";
      runningInWindows = parsed.runningInWindows === true;
      authToken = parsed.authToken;
    } catch (parseError) {
      // Fallback: legacy format (line-separated paths)
      workspaceFolders = content.split('\n').map((line) => line.trim());
    }

    // Extract port from filename (e.g., "12345.lock" -> 12345)
    let filename = lockFilePath.split(PATH_SEPARATOR).pop();
    if (!filename) return null;
    let port = parseInt(filename.replace(".lock", ""));

    return { workspaceFolders, port, pid, ideName, useWebSocket, runningInWindows, authToken };
  } catch (error) { logError(error); return null; }
}

// Mapping: Sr2→parseLockFile, AQ→JSON.parse, yF1→PATH_SEPARATOR
```

**Lock File Structure (JSON format):**
```json
{
  "workspaceFolders": ["/path/to/project1", "/path/to/project2"],
  "pid": 12345,
  "ideName": "vscode",
  "transport": "ws",
  "runningInWindows": false,
  "authToken": "optional-bearer-token"
}
```

### IDE Directories

```javascript
// ============================================
// getIDEDirectories - Get directories containing IDE lock files
// Location: chunks.131.mjs:2426-2458
// ============================================

// READABLE (for understanding):
function getIDEDirectories() {
  let directories = [];
  let fs = getFs();
  let platform = getOS();

  // Primary: ~/.claude/ide
  let primaryDir = pathJoin(getClaudeDir(), "ide");
  if (fs.existsSync(primaryDir)) directories.push(primaryDir);

  // WSL: Also check Windows user directories
  if (platform !== "wsl") return directories;

  // Get Windows USERPROFILE via PowerShell
  let windowsProfile = process.env.USERPROFILE;
  if (!windowsProfile) {
    try {
      let result = execSync("powershell.exe -Command '$env:USERPROFILE'");
      if (result) windowsProfile = result.trim();
    } catch {
      logger("Unable to get Windows USERPROFILE - IDE detection may be incomplete");
    }
  }

  if (windowsProfile) {
    let wslPath = new WSLPathConverter(process.env.WSL_DISTRO_NAME).toLocalPath(windowsProfile);
    let windowsIdeDir = pathJoin(wslPath, ".claude", "ide");
    if (fs.existsSync(windowsIdeDir)) directories.push(windowsIdeDir);
  }

  // Also scan /mnt/c/Users/*/. claude/ide
  try {
    if (fs.existsSync("/mnt/c/Users")) {
      for (let user of fs.readdirSync("/mnt/c/Users")) {
        if (["Public", "Default", "Default User", "All Users"].includes(user.name)) continue;
        let userIdeDir = pathJoin("/mnt/c/Users", user.name, ".claude", "ide");
        if (fs.existsSync(userIdeDir)) directories.push(userIdeDir);
      }
    }
  } catch (error) { logError(error); }

  return directories;
}

// Mapping: I27→getIDEDirectories, zQ→getClaudeDir
```

### Connection Validation

```javascript
// ============================================
// getAvailableIDEConnections - Find valid IDE connections
// Location: chunks.131.mjs:2532-2587
// ============================================

// ORIGINAL (for source lookup):
async function IhA(A) {
  let Q = [];
  try {
    let B = process.env.CLAUDE_CODE_SSE_PORT,
      G = B ? parseInt(B) : null,
      Z = EQ(),  // Current working directory
      Y = bF1(); // Get lock files
    for (let J of Y) {
      let X = Sr2(J);  // Parse lock file
      if (!X) continue;
      // Skip if IDE process not running (on non-WSL systems)
      if ($Q() !== "wsl" && zK() && (!X.pid || !X27(X.pid))) continue;
      let I = !1;
      if (process.env.CLAUDE_CODE_IDE_SKIP_VALID_CHECK === "true") I = !0;
      else if (X.port === G) I = !0;
      else I = X.workspaceFolders.some((V) => {
        // ... workspace matching logic
      });
      if (!I && !A) continue;
      // Build connection URL
      let W = await gr2(X.runningInWindows, X.port);
      let K = X.useWebSocket ? `ws://${W}:${X.port}` : `http://${W}:${X.port}/sse`;
      Q.push({ url: K, name: D, workspaceFolders: X.workspaceFolders, ... });
    }
  } catch (B) { e(B) }
  return Q
}

// READABLE (for understanding):
async function getAvailableIDEConnections(includeInvalid = false) {
  let connections = [];
  try {
    let forcedPort = process.env.CLAUDE_CODE_SSE_PORT ? parseInt(process.env.CLAUDE_CODE_SSE_PORT) : null;
    let currentWorkingDir = getCwd();
    let lockFiles = getIDELockFiles();

    for (let lockPath of lockFiles) {
      let lockInfo = parseLockFile(lockPath);
      if (!lockInfo) continue;

      // Skip if IDE process not running (non-WSL only)
      if (getOS() !== "wsl" && isInCodeTerminal() && (!lockInfo.pid || !isIDEProcessRunning(lockInfo.pid))) {
        continue;
      }

      // Validate workspace match
      let isValid = false;
      if (process.env.CLAUDE_CODE_IDE_SKIP_VALID_CHECK === "true") {
        isValid = true;
      } else if (lockInfo.port === forcedPort) {
        isValid = true;
      } else {
        isValid = lockInfo.workspaceFolders.some((folder) => {
          let normalizedFolder = normalizePath(folder);
          // Handle WSL path conversion if needed
          if (getOS() === "wsl" && lockInfo.runningInWindows && process.env.WSL_DISTRO_NAME) {
            // Convert Windows path to WSL path and compare
          }
          // Case-insensitive comparison on Windows
          if (getOS() === "windows") {
            return currentWorkingDir.toUpperCase() === normalizedFolder.toUpperCase() ||
                   currentWorkingDir.toUpperCase().startsWith(normalizedFolder.toUpperCase() + PATH_SEP);
          }
          return currentWorkingDir === normalizedFolder ||
                 currentWorkingDir.startsWith(normalizedFolder + PATH_SEP);
        });
      }

      if (!isValid && !includeInvalid) continue;

      // Determine connection URL
      let host = await getIDEHost(lockInfo.runningInWindows, lockInfo.port);
      let url = lockInfo.useWebSocket ? `ws://${host}:${lockInfo.port}` : `http://${host}:${lockInfo.port}/sse`;

      connections.push({
        url,
        name: lockInfo.ideName ?? (isInCodeTerminal() ? getDisplayName(terminal) : "IDE"),
        workspaceFolders: lockInfo.workspaceFolders,
        port: lockInfo.port,
        isValid,
        authToken: lockInfo.authToken,
        ideRunningInWindows: lockInfo.runningInWindows
      });
    }
  } catch (error) { logError(error); }
  return connections;
}

// Mapping: IhA→getAvailableIDEConnections, bF1→getIDELockFiles, Sr2→parseLockFile,
//          X27→isIDEProcessRunning, gr2→getIDEHost, EQ→getCwd
```

**Workspace Matching Algorithm:**
1. If `CLAUDE_CODE_IDE_SKIP_VALID_CHECK=true`, always valid
2. If `CLAUDE_CODE_SSE_PORT` matches lock file port, always valid
3. Otherwise, check if current working directory is inside any workspace folder
4. Special handling for WSL: Convert Windows paths to WSL paths before comparison

### Process Running Check

```javascript
// ============================================
// isIDEProcessRunning - Check if IDE process is still running
// Location: chunks.131.mjs:2315-2332
// ============================================

// ORIGINAL (for source lookup):
function X27(A) {
  if (!Pr2(A)) return !1;  // Basic PID check
  if (!zK()) return !0;    // Not in code terminal, assume running
  try {
    let Q = process.ppid;
    for (let B = 0; B < 10; B++) {
      if (Q === A) return !0;  // Found in parent chain
      if (Q === 0 || Q === 1) break;
      let G = _aA(Q);
      let Z = G ? parseInt(G) : null;
      if (!Z || Z === Q) break;
      Q = Z
    }
    return !1
  } catch (Q) { return !1 }
}

// READABLE (for understanding):
function isIDEProcessRunning(pid) {
  // First check if process exists at all
  if (!isProcessAlive(pid)) return false;

  // If not running in code terminal, just check process exists
  if (!isInCodeTerminal()) return true;

  // Walk up parent process chain to verify IDE is our parent
  try {
    let currentPid = process.ppid;
    for (let i = 0; i < 10; i++) {
      if (currentPid === pid) return true;  // IDE is in our parent chain
      if (currentPid === 0 || currentPid === 1) break;
      let parentPid = getParentPid(currentPid);
      if (!parentPid || parentPid === currentPid) break;
      currentPid = parentPid;
    }
    return false;
  } catch (error) { return false; }
}

// Mapping: X27→isIDEProcessRunning, Pr2→isProcessAlive, zK→isInCodeTerminal, _aA→getParentPid
```

**Key insight:** The process check walks up the parent chain (up to 10 levels) to verify the IDE process is actually our parent. This prevents connecting to a stale lock file from a crashed IDE.

### Stale Lock File Cleanup

```javascript
// ============================================
// cleanupStaleLockFiles - Remove stale IDE lock files
// Location: chunks.131.mjs:2460-2490
// ============================================

// READABLE (for understanding):
async function cleanupStaleLockFiles() {
  try {
    let lockFiles = getIDELockFiles();
    for (let lockPath of lockFiles) {
      let lockInfo = parseLockFile(lockPath);
      if (!lockInfo) {
        // Invalid lock file, delete it
        try { fs.unlinkSync(lockPath); } catch (e) { logError(e); }
        continue;
      }

      let host = await getIDEHost(lockInfo.runningInWindows, lockInfo.port);
      let isStale = false;

      if (lockInfo.pid) {
        // If PID provided, check if process is alive
        if (!isProcessAlive(lockInfo.pid)) {
          if (getOS() !== "wsl") isStale = true;
          else if (!await isPortReachable(host, lockInfo.port)) isStale = true;
        }
      } else {
        // No PID, check if port is reachable
        if (!await isPortReachable(host, lockInfo.port)) isStale = true;
      }

      if (isStale) {
        try { fs.unlinkSync(lockPath); } catch (e) { logError(e); }
      }
    }
  } catch (error) { logError(error); }
}

// Mapping: D27→cleanupStaleLockFiles, NL0→isPortReachable, Pr2→isProcessAlive
```

### IDE Connection Polling

```javascript
// ============================================
// waitForIDEConnection - Poll for IDE connection with timeout
// Location: chunks.131.mjs:2517-2530
// ============================================

// ORIGINAL (for source lookup):
async function Mr2() {
  if (xF1) xF1.abort();
  xF1 = c9();
  let A = xF1.signal;
  await D27();  // Cleanup stale locks first
  let Q = Date.now();
  while (Date.now() - Q < 30000 && !A.aborted) {
    let B = await IhA(!1);
    if (A.aborted) return null;
    if (B.length === 1) return B[0];
    await new Promise((G) => setTimeout(G, 1000))
  }
  return null
}

// READABLE (for understanding):
async function waitForIDEConnection() {
  // Cancel any previous wait
  if (waitAbortController) waitAbortController.abort();
  waitAbortController = new AbortController();
  let signal = waitAbortController.signal;

  // First cleanup stale lock files
  await cleanupStaleLockFiles();

  let startTime = Date.now();
  while (Date.now() - startTime < 30000 && !signal.aborted) {  // 30 second timeout
    let connections = await getAvailableIDEConnections(false);
    if (signal.aborted) return null;
    if (connections.length === 1) return connections[0];  // Found exactly one valid connection
    await delay(1000);  // Poll every 1 second
  }
  return null;
}

// Mapping: Mr2→waitForIDEConnection, D27→cleanupStaleLockFiles, IhA→getAvailableIDEConnections
```

### IDE Connected Notification

```javascript
// ============================================
// notifyIDEConnected - Send connection notification to IDE
// Location: chunks.131.mjs:2589-2596
// ============================================

// ORIGINAL (for source lookup):
async function Cr2(A) {
  await A.notification({
    method: "ide_connected",
    params: { pid: process.pid }
  })
}

// READABLE (for understanding):
async function notifyIDEConnected(mcpClient) {
  await mcpClient.notification({
    method: "ide_connected",
    params: { pid: process.pid }
  });
}

// Mapping: Cr2→notifyIDEConnected
```

This notification is sent after successfully connecting to the IDE via MCP. It informs the IDE extension of Claude Code's process ID for coordination.

---

## 3. Terminal Keybinding Setup

### Supported Terminals

```javascript
// ============================================
// supportsKeybindingSetup - Check if terminal supports keybinding installation
// Location: chunks.68.mjs:2412-2414
// ============================================

// ORIGINAL (for source lookup):
function EjA() {
  return FjA() === "darwin" && l0.terminal === "Apple_Terminal" ||
         l0.terminal === "vscode" ||
         l0.terminal === "cursor" ||
         l0.terminal === "windsurf" ||
         l0.terminal === "alacritty" ||
         l0.terminal === "WarpTerminal" ||
         l0.terminal === "zed"
}

// READABLE (for understanding):
function supportsKeybindingSetup() {
  return (platform() === "darwin" && terminal.terminal === "Apple_Terminal") ||
         terminal.terminal === "vscode" ||
         terminal.terminal === "cursor" ||
         terminal.terminal === "windsurf" ||
         terminal.terminal === "alacritty" ||
         terminal.terminal === "WarpTerminal" ||
         terminal.terminal === "zed";
}

// Mapping: EjA→supportsKeybindingSetup, FjA→platform, l0→terminal
```

### VSCode/Cursor/Windsurf Keybinding Installation

```javascript
// ============================================
// installVSCodeKeybinding - Install Shift+Enter keybinding for VSCode-based IDEs
// Location: chunks.68.mjs:2476-2511
// ============================================

// ORIGINAL (for source lookup):
function fB0(A = "VSCode", Q) {
  let B = A === "VSCode" ? "Code" : A,
    G = xk(gB0(), FjA() === "win32" ? xk("AppData", "Roaming", B, "User") :
           FjA() === "darwin" ? xk("Library", "Application Support", B, "User") :
           xk(".config", B, "User")),
    Z = xk(G, "keybindings.json");
  try {
    let Y = "[]", J = [];
    if (!vA().existsSync(G)) vA().mkdirSync(G);
    if (vA().existsSync(Z)) {
      Y = vA().readFileSync(Z, { encoding: "utf-8" });
      J = parseJSON(Y) ?? [];
      // Backup existing keybindings
      let K = `${Z}.${randomHex}.bak`;
      vA().copyFileSync(Z, K);
    }
    // Check for existing Shift+Enter binding
    if (J.find((W) => W.key === "shift+enter" &&
               W.command === "workbench.action.terminal.sendSequence")) {
      return `Found existing ${A} terminal Shift+Enter key binding. Remove it to continue.`;
    }
    // Add new keybinding
    let D = addToKeybindings(Y, {
      key: "shift+enter",
      command: "workbench.action.terminal.sendSequence",
      args: { text: "\x1B\r" },  // ESC + CR sequence for multi-line
      when: "terminalFocus"
    });
    writeFile(Z, D, { encoding: "utf-8" });
    return `Installed ${A} terminal Shift+Enter key binding`;
  } catch (Y) {
    throw Error(`Failed to install ${A} terminal Shift+Enter key binding`);
  }
}

// READABLE (for understanding):
function installVSCodeKeybinding(ideName = "VSCode", context) {
  // Determine config directory based on IDE and platform
  let configDir = ideName === "VSCode" ? "Code" : ideName;
  let userDir = join(homedir(),
    platform() === "win32" ? join("AppData", "Roaming", configDir, "User") :
    platform() === "darwin" ? join("Library", "Application Support", configDir, "User") :
    join(".config", configDir, "User")
  );
  let keybindingsPath = join(userDir, "keybindings.json");

  // Read existing keybindings, backup, check for conflicts
  // Add: { key: "shift+enter", command: "workbench.action.terminal.sendSequence",
  //        args: { text: "\x1B\r" }, when: "terminalFocus" }
  // Write updated keybindings
}

// Mapping: fB0→installVSCodeKeybinding, gB0→homedir, FjA→platform, xk→join, vA→fs
```

**Keybinding configuration paths:**
| Platform | Cursor | VS Code | Windsurf |
|----------|--------|---------|----------|
| macOS | ~/Library/Application Support/Cursor/User/keybindings.json | ~/Library/Application Support/Code/User/keybindings.json | ~/Library/Application Support/Windsurf/User/keybindings.json |
| Windows | %APPDATA%\Cursor\User\keybindings.json | %APPDATA%\Code\User\keybindings.json | %APPDATA%\Windsurf\User\keybindings.json |
| Linux | ~/.config/Cursor/User/keybindings.json | ~/.config/Code/User/keybindings.json | ~/.config/Windsurf/User/keybindings.json |

### Terminal-Specific Setup

The keybinding dispatcher routes to terminal-specific handlers:

```javascript
// ============================================
// setupTerminalKeybinding - Dispatch to terminal-specific setup
// Location: chunks.68.mjs:2416-2458
// ============================================

// READABLE (for understanding):
async function setupTerminalKeybinding(context) {
  let message = "";
  switch (terminal.terminal) {
    case "Apple_Terminal":
      message = await setupAppleTerminal(context);  // gE8 - Option as Meta key
      break;
    case "vscode":
      message = installVSCodeKeybinding("VSCode", context);
      break;
    case "cursor":
      message = installVSCodeKeybinding("Cursor", context);
      break;
    case "windsurf":
      message = installVSCodeKeybinding("Windsurf", context);
      break;
    case "alacritty":
      message = await setupAlacritty(context);  // uE8 - TOML config
      break;
    case "WarpTerminal":
      message = setupWarp(context);  // mE8
      break;
    case "zed":
      message = setupZed(context);  // dE8
      break;
  }
  // Update state: shiftEnterKeyBindingInstalled = true
  return message;
}
```

---

## 4. Extension Installation

### Auto-Install Logic

```javascript
// ============================================
// installVSCodeExtension - Install anthropic.claude-code extension
// Location: chunks.131.mjs:2614-2632
// ============================================

// ORIGINAL (for source lookup):
async function F27(A) {
  if (kF1(A)) {
    let Q = xr2(A);
    if (Q) {
      let B = await H27(Q);
      if (!B || Tr2.lt(B, _r2())) {
        await new Promise((Z) => { setTimeout(Z, 500) });
        let G = await J2(Q, ["--force", "--install-extension", "anthropic.claude-code"], {
          env: LL0()
        });
        if (G.code !== 0) throw Error(`${G.code}: ${G.error} ${G.stderr}`);
        B = _r2()
      }
      return B
    }
  }
  return null
}

// READABLE (for understanding):
async function installVSCodeExtension(ideName) {
  if (isVSCodeIDE(ideName)) {
    let cliPath = getVSCodeCLIPath(ideName);  // "code", "cursor", or "windsurf"
    if (cliPath) {
      let currentVersion = await getInstalledExtensionVersion(cliPath);

      // Install if not installed or version is outdated
      if (!currentVersion || semver.lt(currentVersion, getMinRequiredVersion())) {
        await delay(500);  // Brief delay before install

        let result = await execCommand(cliPath, [
          "--force",
          "--install-extension",
          "anthropic.claude-code"
        ], { env: getCleanEnv() });  // Clean env to avoid DISPLAY issues on Linux

        if (result.code !== 0) {
          throw Error(`${result.code}: ${result.error} ${result.stderr}`);
        }
        currentVersion = getMinRequiredVersion();
      }
      return currentVersion;
    }
  }
  return null;
}

// Mapping: F27→installVSCodeExtension, kF1→isVSCodeIDE, xr2→getVSCodeCLIPath,
//          H27→getInstalledExtensionVersion, Tr2→semver, _r2→getMinRequiredVersion,
//          J2→execCommand, LL0→getCleanEnv
```

### Version Checking

```javascript
// ============================================
// getInstalledExtensionVersion - Check installed extension version
// Location: chunks.131.mjs:2654-2666
// ============================================

// ORIGINAL (for source lookup):
async function H27(A) {
  let { stdout: Q } = await TQ(A, ["--list-extensions", "--show-versions"], {
    env: LL0()
  }), B = Q?.split(`\n`) || [];
  for (let G of B) {
    let [Z, Y] = G.split("@");
    if (Z === "anthropic.claude-code" && Y) return Y
  }
  return null
}

// READABLE (for understanding):
async function getInstalledExtensionVersion(cliPath) {
  let { stdout } = await execCommand(cliPath, ["--list-extensions", "--show-versions"], {
    env: getCleanEnv()
  });
  let extensions = stdout?.split('\n') || [];

  for (let extension of extensions) {
    let [name, version] = extension.split("@");
    if (name === "anthropic.claude-code" && version) {
      return version;  // e.g., "2.1.7"
    }
  }
  return null;
}

// Mapping: H27→getInstalledExtensionVersion, TQ→execCommand
```

### CLI Path Resolution

```javascript
// ============================================
// getVSCodeCLIPath - Get CLI command for VSCode-based IDE
// Location: chunks.131.mjs:2702-2718
// ============================================

// READABLE (for understanding):
function getVSCodeCLIPath(ideName) {
  // First try to find CLI from parent process (macOS)
  let cliFromProcess = findCLIFromParentProcess();  // E27
  if (cliFromProcess && fs.existsSync(cliFromProcess)) {
    return cliFromProcess;
  }

  // Fallback to standard commands
  switch (ideName) {
    case "vscode": return "code";
    case "cursor": return "cursor";
    case "windsurf": return "windsurf";
    default: return null;
  }
}
```

---

## 5. IDE Diff Support

### useDiffWithIDE Hook

Claude Code can open diff views directly in the connected IDE via MCP:

```javascript
// ============================================
// useDiffWithIDE - React hook for IDE diff display
// Location: chunks.149.mjs:3253-3313
// ============================================

// ORIGINAL (for source lookup):
function tI9({
  onChange: A,
  toolUseContext: Q,
  filePath: B,
  edits: G,
  editMode: Z
}) {
  let Y = Pp.useRef(!1),
    [J, X] = Pp.useState(!1),
    I = Pp.useMemo(() => Uq7().slice(0, 6), []),  // Random 6-char ID
    D = Pp.useMemo(() => `✻ [Claude Code] ${qq7(B)} (${I}) ⧉`, [B, I]),  // Tab name
    W = fF1(Q.options.mcpClients) && L1().diffTool === "auto" && !B.endsWith(".ipynb"),
    K = hF1(Q.options.mcpClients) ?? "IDE";

  async function V() {
    if (!W) return;
    try {
      l("tengu_ext_will_show_diff", {});
      let { oldContent: F, newContent: H } = await wq7(B, G, Q, D);
      // ... handle diff result
    } catch (F) {
      e(F), X(!0)
    }
  }

  return Pp.useEffect(() => {
    return V(), () => { Y.current = !0 }
  }, []), {
    closeTabInIDE() { /* Close diff tab via MCP */ },
    showingDiffInIDE: W && !J,
    ideName: K,
    hasError: J
  }
}

// READABLE (for understanding):
function useDiffWithIDE({ onChange, toolUseContext, filePath, edits, editMode }) {
  const isCancelled = useRef(false);
  const [hasError, setHasError] = useState(false);
  const randomId = useMemo(() => generateId().slice(0, 6), []);
  const tabName = useMemo(() => `✻ [Claude Code] ${basename(filePath)} (${randomId}) ⧉`, [filePath, randomId]);

  // Check if IDE diff is available
  const canShowDiff = hasConnectedIDE(toolUseContext.options.mcpClients) &&
                      getSettings().diffTool === "auto" &&
                      !filePath.endsWith(".ipynb");  // Don't diff notebooks

  const ideName = getIDEName(toolUseContext.options.mcpClients) ?? "IDE";

  async function showDiff() {
    if (!canShowDiff) return;
    try {
      telemetry("tengu_ext_will_show_diff", {});
      const { oldContent, newContent } = await openDiffInIDE(filePath, edits, toolUseContext, tabName);

      if (isCancelled.current) return;

      telemetry("tengu_ext_diff_accepted", {});
      const processedEdits = processEdits(filePath, oldContent, newContent, editMode);

      if (processedEdits.length === 0) {
        // User rejected the diff
        telemetry("tengu_ext_diff_rejected", {});
        const ideClient = getIDEClient(toolUseContext.options.mcpClients);
        if (ideClient) await closeTab(tabName, ideClient);
        onChange({ type: "reject" }, { file_path: filePath, edits });
        return;
      }

      onChange({ type: "accept-once" }, { file_path: filePath, edits: processedEdits });
    } catch (error) {
      logError(error);
      setHasError(true);
    }
  }

  useEffect(() => {
    showDiff();
    return () => { isCancelled.current = true; };
  }, []);

  return {
    closeTabInIDE: () => { /* ... */ },
    showingDiffInIDE: canShowDiff && !hasError,
    ideName,
    hasError
  };
}

// Mapping: tI9→useDiffWithIDE, fF1→hasConnectedIDE, hF1→getIDEName,
//          wq7→openDiffInIDE, VS0→closeTab, nN→getIDEClient
```

### MCP Commands

The IDE diff support uses these MCP commands:

```javascript
// openDiff - Open a diff tab in the IDE
await mcpCall("openDiff", {
  old_file_path: filePath,
  new_file_path: filePath,
  new_file_contents: updatedContent,
  tab_name: tabName  // e.g., "✻ [Claude Code] file.js (abc123) ⧉"
}, ideClient);

// close_tab - Close a diff tab
await mcpCall("close_tab", {
  tab_name: tabName
}, ideClient);

// closeAllDiffTabs - Close all Claude Code diff tabs
await mcpCall("closeAllDiffTabs", {}, ideClient);
```

### Response Handling

The IDE returns different responses based on user action:

| Response | Meaning |
|----------|---------|
| `["TAB_CLOSED"]` | User closed the tab (accept) |
| `[{type: "text", text: "..."}]` | User modified content (accept with changes) |
| `["REJECTED"]` | User rejected the diff |

---

## 6. Connection Lifecycle

### Auto-Connect Logic

```javascript
// ============================================
// useIDEAutoConnect - Hook for automatic IDE connection
// Location: chunks.153.mjs:157-185
// ============================================

// ORIGINAL (for source lookup):
function hF9({
  autoConnectIdeFlag: A,
  ideToInstallExtension: Q,
  setDynamicMcpConfig: B,
  setShowIdeOnboarding: G,
  setIDEInstallationState: Z
}) {
  fF9.useEffect(() => {
    function Y(J) {
      if (!J) return;
      if (!((L1().autoConnectIde || A || zK() || Q || a1(process.env.CLAUDE_CODE_AUTO_CONNECT_IDE)) &&
            !iX(process.env.CLAUDE_CODE_AUTO_CONNECT_IDE))) return;
      B((D) => {
        if (D?.ide) return D;
        return {
          ...D,
          ide: {
            type: J.url.startsWith("ws:") ? "ws-ide" : "sse-ide",
            url: J.url,
            ideName: J.name,
            authToken: J.authToken,
            ideRunningInWindows: J.ideRunningInWindows,
            scope: "dynamic"
          }
        }
      })
    }
    hr2(Y, Q, () => G(!0), (J) => Z(J))
  }, [A, Q, B, G, Z])
}

// READABLE (for understanding):
function useIDEAutoConnect({
  autoConnectIdeFlag,
  ideToInstallExtension,
  setDynamicMcpConfig,
  setShowIdeOnboarding,
  setIDEInstallationState
}) {
  useEffect(() => {
    function handleIDEConnection(connection) {
      if (!connection) return;

      // Check if auto-connect is enabled
      const shouldConnect = (
        getSettings().autoConnectIde ||
        autoConnectIdeFlag ||
        isInCodeTerminal() ||
        ideToInstallExtension ||
        parseBoolean(process.env.CLAUDE_CODE_AUTO_CONNECT_IDE)
      ) && !isDisabled(process.env.CLAUDE_CODE_AUTO_CONNECT_IDE);

      if (!shouldConnect) return;

      // Set up IDE MCP config
      setDynamicMcpConfig((config) => {
        if (config?.ide) return config;  // Already connected
        return {
          ...config,
          ide: {
            type: connection.url.startsWith("ws:") ? "ws-ide" : "sse-ide",
            url: connection.url,
            ideName: connection.name,
            authToken: connection.authToken,
            ideRunningInWindows: connection.ideRunningInWindows,
            scope: "dynamic"
          }
        };
      });
    }

    // Initialize connection
    initializeIDEConnection(
      handleIDEConnection,
      ideToInstallExtension,
      () => setShowIdeOnboarding(true),
      (state) => setIDEInstallationState(state)
    );
  }, [autoConnectIdeFlag, ideToInstallExtension, setDynamicMcpConfig, setShowIdeOnboarding, setIDEInstallationState]);
}

// Mapping: hF9→useIDEAutoConnect, L1→getSettings, zK→isInCodeTerminal,
//          a1→parseBoolean, hr2→initializeIDEConnection
```

### Transport Selection

The IDE transport type is determined by the connection URL:

```javascript
// chunks.131.mjs:1599-1630
if (config.type === "sse-ide") {
  // SSE-IDE Transport: HTTP/SSE for server→client, HTTP POST for client→server
  transport = new SSEClientTransport(new URL(config.url), options);
} else if (config.type === "ws-ide") {
  // WS-IDE Transport: Full-duplex WebSocket
  let ws = new WebSocket(config.url, ["mcp"], {
    headers: {
      "User-Agent": getUserAgent(),
      ...(config.authToken && { "X-Claude-Code-Ide-Authorization": config.authToken })
    }
  });
  transport = new WebSocketClientTransport(ws);
}
```

---

## 7. IDE Context Attachments

Claude Code injects IDE context into prompts via attachment generators:

### IDE Selection Attachment

```javascript
// ============================================
// generateIdeSelectionAttachment - Capture IDE selection context
// Location: chunks.131.mjs:3135 (referenced in O27)
// ============================================

// Called as part of main agent attachments:
fJ("ide_selection", async () => k27(ideContext, toolUseContext))

// k27 returns attachment with:
// - Which IDE the user is working in
// - Current selection/cursor position (if available)
```

### IDE Opened File Attachment

```javascript
// ============================================
// generateIdeOpenedFileAttachment - Capture currently opened file
// Location: chunks.131.mjs:3135 (referenced in O27)
// ============================================

// Called as part of main agent attachments:
fJ("ide_opened_file", async () => f27(ideContext, toolUseContext))

// f27 returns attachment with:
// - Path of the currently open file in IDE
// - File content or relevant portion
```

**Key insight:** These attachments only run for the main agent (not subagents) and have a 1-second timeout:
```javascript
let J = c9();  // Create abort controller
setTimeout(() => { J.abort() }, 1000);  // 1 second timeout
```

---

## Key Functions Summary

### IDE Detection & Configuration

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| IDE_CONFIG_MAP | iEA | chunks.131.mjs:2903-3030 | IDE metadata with process keywords |
| detectRunningIDEs | z27 | chunks.131.mjs:2733-2779 | Process-based IDE detection |
| isVSCodeIDE | kF1 | chunks.131.mjs:2334-2338 | Check if VSCode-based |
| isJetBrainsIDE | Rx | chunks.131.mjs:2340-2344 | Check if JetBrains-based |
| getTerminalIDEName | pEA | chunks.131.mjs:2346-2349 | Get IDE from terminal env |

### Lock File Handling

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| getIDELockFiles | bF1 | chunks.131.mjs:2351-2369 | Discover IDE lock files |
| parseLockFile | Sr2 | chunks.131.mjs:2371-2403 | Parse lock file content |
| getIDEDirectories | I27 | chunks.131.mjs:2426-2458 | Get lock file directories |
| cleanupStaleLockFiles | D27 | chunks.131.mjs:2460-2490 | Remove stale lock files |

### Connection Validation

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| getAvailableIDEConnections | IhA | chunks.131.mjs:2532-2587 | Find valid IDE connections |
| waitForIDEConnection | Mr2 | chunks.131.mjs:2517-2530 | Poll for IDE with 30s timeout |
| isIDEProcessRunning | X27 | chunks.131.mjs:2315-2332 | Check IDE process in parent chain |
| isPortReachable | NL0 | chunks.131.mjs:2405-2424 | TCP port reachability check |
| notifyIDEConnected | Cr2 | chunks.131.mjs:2589-2596 | Send MCP connection notification |
| getIDEHost | gr2 | chunks.131.mjs:3053-3070 | Get IDE host (WSL aware) |

### Extension Installation

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| installVSCodeExtension | F27 | chunks.131.mjs:2614-2632 | Install anthropic.claude-code |
| getInstalledExtensionVersion | H27 | chunks.131.mjs:2654-2666 | Check extension version |
| getVSCodeCLIPath | xr2 | chunks.131.mjs:2702-2718 | Get IDE CLI command |
| findCLIFromParentProcess | E27 | chunks.131.mjs:2668-2700 | Find CLI from process tree |
| getCleanEnv | LL0 | chunks.131.mjs:2635-2641 | Clean env for Linux |

### Terminal Keybinding

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| supportsKeybindingSetup | EjA | chunks.68.mjs:2412-2414 | Check terminal support |
| setupTerminalKeybinding | uB0 | chunks.68.mjs:2416-2458 | Keybinding dispatcher |
| installVSCodeKeybinding | fB0 | chunks.68.mjs:2476-2511 | Setup Shift+Enter |
| setupAppleTerminal | gE8 | chunks.68.mjs:2539-2573 | Option as Meta key |
| setupAlacritty | uE8 | chunks.68.mjs:2575-2611 | Alacritty TOML config |

### IDE Diff Support

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| useDiffWithIDE | tI9 | chunks.149.mjs:3253-3313 | React hook for IDE diff |
| openDiffInIDE | wq7 | chunks.149.mjs:3328-3380 | Open diff tab via MCP |
| closeTab | VS0 | chunks.149.mjs:3382-3391 | Close diff tab |
| closeAllDiffTabs | fr2 | chunks.131.mjs:2824-2828 | Close all Claude diff tabs |

### IDE Connection & State

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| useIDEAutoConnect | hF9 | chunks.153.mjs:157-185 | Auto-connect hook |
| initializeIDEConnection | hr2 | chunks.131.mjs:2830-2854 | Connection orchestrator |
| hasConnectedIDE | fF1 | chunks.131.mjs:2598-2600 | Check for IDE connection |
| getIDEClient | nN | chunks.131.mjs:2818-2822 | Get IDE MCP client |
| getIDEName | hF1 | chunks.131.mjs:2792-2795 | Get IDE name from client |
| getIDEDisplayName | EK | chunks.131.mjs:2802-2816 | Human-readable IDE name |
| isInCodeTerminal | zK | chunks.131.mjs:3035-3037 | Check if in IDE terminal |

### IDE Context Attachments

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| generateIdeSelectionAttachment | k27 | chunks.131.mjs:3287-3300 | IDE selection context |
| generateIdeOpenedFileAttachment | f27 | chunks.131.mjs:3362-3370 | Opened file context |

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `CLAUDE_CODE_AUTO_CONNECT_IDE` | Enable/disable auto-connect to IDE |
| `CLAUDE_CODE_SSE_PORT` | Force specific IDE port connection |
| `CLAUDE_CODE_IDE_SKIP_VALID_CHECK` | Skip workspace validation |
| `CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL` | Skip extension auto-installation |
| `CLAUDE_CODE_IDE_HOST_OVERRIDE` | Override IDE host address |
| `FORCE_CODE_TERMINAL` | Force detection as running in code terminal |
| `WSL_DISTRO_NAME` | WSL distribution name for path translation |

---

## Related Modules

- **27_lsp_integration/** - LSP diagnostics and language server integration (split from IDE module in v2.1.7)
- **06_mcp/** - MCP protocol implementation including SSE-IDE and WS-IDE transports
- **04_system_reminder/** - Attachment generation including IDE context
